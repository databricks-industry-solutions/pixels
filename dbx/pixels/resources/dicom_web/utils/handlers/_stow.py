"""
STOW-RS handler — lightweight stream-to-Volumes proxy with early return.

The server does ZERO DICOM processing.  It simply:

1. Streams the multipart/related body to a single temp file on Volumes.
2. Inserts a tracking row into ``stow_operations`` (audit + processing queue).
3. Fires a serverless Spark job (non-blocking, run-coalesced).
4. Polls ``stow_operations`` until Phase 1 (split) completes.
5. Reads DICOM headers from the newly-split files, caches UID → path
   mappings in memory (Tier 1) and Lakebase (Tier 2).
6. Returns a JSON receipt — Phase 2 (metadata extraction) continues in
   the background.

All heavy lifting (metadata extraction, catalog INSERT, lakebase sync)
is offloaded to the Spark job.
"""

import asyncio
import concurrent.futures
import json
import os
import time
import uuid
from datetime import datetime, timezone

import requests as _requests
from fastapi import HTTPException, Request, Response

from dbx.pixels.databricks_file import DatabricksFile
from dbx.pixels.logging import LoggerProvider

from ..cache import instance_path_cache
from ..dicom_io import async_stream_to_volumes, get_file_metadata
from ..queries import build_stow_insert_query, build_stow_poll_query
from ..sql_client import USE_USER_AUTH, DatabricksSQLClient
from ._common import (
    app_token_provider,
    get_sql_client,
    lb_utils,
    resolve_user_groups,
    resolve_user_token,
)

logger = LoggerProvider("DICOMweb.STOW")


# ---------------------------------------------------------------------------
# Resolve user email: proxy header → SCIM /Me fallback (cached)
# ---------------------------------------------------------------------------

_token_email_cache: dict[str, str | None] = {}


def _resolve_user_email(request: Request, token: str) -> str | None:
    """
    Best-effort resolution of the caller's email address.

    1. ``X-Forwarded-Email`` header (set by the Databricks Apps proxy).
    2. ``Authorization`` bearer token → Databricks SCIM ``/Me`` endpoint.

    Results are cached by token prefix (first 16 chars) so repeated
    uploads by the same session don't repeat the SCIM call.  Returns
    ``None`` silently on any failure — user email is *nice-to-have*,
    not critical.
    """
    # ── 1. Proxy header (fast path) ───────────────────────────────────
    email = request.headers.get("X-Forwarded-Email", "").strip()
    if email:
        return email

    # ── 2. SCIM /Me (external clients with just a bearer token) ───────
    cache_key = token[:16] if token else ""
    if cache_key in _token_email_cache:
        return _token_email_cache[cache_key]

    host = (
        os.environ.get("DATABRICKS_HOST", "")
        .replace("https://", "")
        .replace("http://", "")
        .rstrip("/")
    )
    if not host or not token:
        return None

    try:
        resp = _requests.get(
            f"https://{host}/api/2.0/preview/scim/v2/Me",
            headers={"Authorization": f"Bearer {token}"},
            timeout=3,
        )
        if resp.ok:
            data = resp.json()
            # SCIM returns emails as a list; primary first
            emails = data.get("emails", [])
            resolved = next(
                (e["value"] for e in emails if e.get("primary")),
                emails[0]["value"] if emails else None,
            )
            # Fall back to userName (often the email itself)
            resolved = resolved or data.get("userName")
            _token_email_cache[cache_key] = resolved
            return resolved
    except Exception as exc:
        logger.debug(f"SCIM /Me lookup failed (non-critical): {exc}")

    _token_email_cache[cache_key] = None
    return None


# ---------------------------------------------------------------------------
# STOW config (derived from env vars at module load time)
# ---------------------------------------------------------------------------

_stow_table: str | None = None
_stow_catalog_table: str | None = None     # e.g. "main.pixels_solacc.object_catalog"
_stow_volume_uc: str | None = None         # e.g. "main.pixels_solacc.pixels_volume"

_pixels_table_env = os.getenv("DATABRICKS_PIXELS_TABLE", "")
if _pixels_table_env:
    _parts = _pixels_table_env.split(".")
    if len(_parts) == 3:
        _stow_table = f"{_parts[0]}.{_parts[1]}.stow_operations"
        _stow_catalog_table = _pixels_table_env

# Derive volume UC name from DATABRICKS_STOW_VOLUME_PATH
# e.g. "/Volumes/main/pixels_solacc/pixels_volume/stow/" → "main.pixels_solacc.pixels_volume"
_stow_volume_path_env = os.getenv("DATABRICKS_STOW_VOLUME_PATH", "")
if _stow_volume_path_env:
    _vol_parts = _stow_volume_path_env.strip("/").split("/")
    if len(_vol_parts) >= 4 and _vol_parts[0] == "Volumes":
        _stow_volume_uc = f"{_vol_parts[1]}.{_vol_parts[2]}.{_vol_parts[3]}"


# ---------------------------------------------------------------------------
# Tracking table INSERT
# ---------------------------------------------------------------------------

def _write_stow_records(
    sql_client: DatabricksSQLClient,
    token: str | None,
    records: list[dict],
) -> None:
    """
    INSERT tracking rows into ``stow_operations``.

    Called synchronously — the row must exist before the Spark job is
    triggered.  Uses parameterized queries via :func:`build_stow_insert_query`.
    """
    if not _stow_table or not records:
        return
    try:
        query, params = build_stow_insert_query(_stow_table, records)
        sql_client.execute(
            query, parameters=params,
            user_token=token if USE_USER_AUTH else None,
        )
        logger.info(f"STOW tracking: inserted {len(records)} record(s)")
    except Exception as exc:
        logger.error(f"STOW tracking INSERT failed: {exc}")


# ---------------------------------------------------------------------------
# Job-name resolution cache (name → id, looked up once)
# ---------------------------------------------------------------------------

_stow_job_id: int | None = None
_stow_job_resolved = False


def _resolve_stow_job_id(host: str, headers: dict) -> int | None:
    """
    Resolve the STOW processor job ID by name.

    The job name follows the convention ``<DATABRICKS_APP_NAME>_stow_processor``.
    The lookup is done once and cached for the lifetime of the process.
    """
    global _stow_job_id, _stow_job_resolved
    if _stow_job_resolved:
        return _stow_job_id

    app_name = os.getenv("DATABRICKS_APP_NAME", "")
    if not app_name:
        logger.debug("STOW-RS: DATABRICKS_APP_NAME not set — cannot derive job name")
        _stow_job_resolved = True
        return None

    job_name = f"{app_name}_stow_processor"

    try:
        resp = _requests.get(
            f"https://{host}/api/2.1/jobs/list",
            headers=headers,
            params={"name": job_name, "limit": 1},
            timeout=5,
        )
        if resp.ok:
            jobs = resp.json().get("jobs", [])
            if jobs:
                _stow_job_id = jobs[0]["job_id"]
                logger.info(f"STOW-RS: resolved job '{job_name}' → id {_stow_job_id}")
            else:
                logger.warning(f"STOW-RS: no job found with name '{job_name}'")
        else:
            logger.warning(
                f"STOW-RS: job list lookup failed (HTTP {resp.status_code}): "
                f"{resp.text[:200]}"
            )
    except Exception as exc:
        logger.warning(f"STOW-RS: job name resolution failed: {exc}")

    _stow_job_resolved = True
    return _stow_job_id


# ---------------------------------------------------------------------------
# Fire Spark job (non-blocking)
# ---------------------------------------------------------------------------

_STOW_TABLE_POLL_INTERVAL = 3     # seconds between stow_operations polls
_STOW_TABLE_POLL_TIMEOUT = 600    # 10 min max wait for Phase 1


def _fire_stow_job(token: str) -> dict:
    """
    Trigger the STOW processing Spark job **without waiting**.

    The job consists of two tasks:

    * **Task 1 (split)** — splits multipart bundles into individual DICOMs,
      MERGEs ``status``/``output_paths`` back into ``stow_operations``.
    * **Task 2 (meta)** — extracts DICOM metadata and saves to the catalog.

    This function only *fires* the job.  The handler polls the
    ``stow_operations`` table directly (via :func:`_poll_stow_status`) so
    it can return as soon as Task 1 completes — without waiting for the
    full job to finish.

    Run-coalescing: at most one running + one queued.

    Returns:
        A status dict, e.g.::

            {"action": "triggered", "job_id": 123, "run_id": 456}
            {"action": "queued",    "job_id": 123, "run_id": 456}
            {"action": "already_processing", "job_id": 123, ...}
            {"action": "skipped",   "reason": "..."}
            {"action": "error",     "detail": "..."}
    """
    host = (
        os.environ.get("DATABRICKS_HOST", "")
        .replace("https://", "")
        .replace("http://", "")
        .rstrip("/")
    )
    if not host:
        return {"action": "skipped", "reason": "DATABRICKS_HOST not configured"}

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    job_id = _resolve_stow_job_id(host, headers)
    if not job_id:
        return {"action": "skipped", "reason": "stow_processor job not found"}

    try:
        # ── Check active runs ─────────────────────────────────────────
        list_url = f"https://{host}/api/2.1/jobs/runs/list"
        resp = _requests.get(
            list_url,
            headers=headers,
            params={"job_id": job_id, "active_only": "true"},
            timeout=5,
        )
        active_runs = resp.json().get("runs", []) if resp.ok else []
        active_count = len(active_runs)

        if active_count >= 2:
            run_states = [
                {
                    "run_id": r.get("run_id"),
                    "life_cycle_state": r.get("state", {}).get("life_cycle_state"),
                }
                for r in active_runs[:2]
            ]
            logger.info(
                f"STOW-RS: job {job_id} already has {active_count} active runs "
                f"(running + queued) — skipping trigger"
            )
            return {
                "action": "already_processing",
                "job_id": job_id,
                "active_runs": active_count,
                "runs": run_states,
            }

        # ── Fire run-now with job_parameters ─────────────────────────
        run_now_url = f"https://{host}/api/2.1/jobs/run-now"
        run_payload: dict = {"job_id": job_id}

        if _stow_catalog_table or _stow_volume_uc:
            job_params: dict[str, str] = {}
            if _stow_catalog_table:
                job_params["catalog_table"] = _stow_catalog_table
            if _stow_volume_uc:
                job_params["volume"] = _stow_volume_uc
            run_payload["job_parameters"] = job_params

        resp = _requests.post(
            run_now_url,
            headers=headers,
            json=run_payload,
            timeout=10,
        )
        if not resp.ok:
            detail = f"HTTP {resp.status_code}: {resp.text[:300]}"
            logger.warning(f"STOW-RS: job trigger failed — {detail}")
            return {"action": "error", "job_id": job_id, "detail": detail}

        run_id = resp.json().get("run_id")
        action = "triggered" if active_count == 0 else "queued"
        logger.info(f"STOW-RS: {action} job {job_id}, run_id={run_id}")

        return {
            "action": action,
            "job_id": job_id,
            "run_id": run_id,
        }
    except Exception as exc:
        logger.error(f"STOW-RS: job trigger error: {exc}")
        return {"action": "error", "detail": str(exc)}


# ---------------------------------------------------------------------------
# Poll stow_operations table for Phase 1 completion
# ---------------------------------------------------------------------------

def _poll_stow_status(
    sql_client: DatabricksSQLClient,
    token: str | None,
    file_id: str,
) -> dict:
    """
    Poll the ``stow_operations`` table until Phase 1 (split) completes.

    Phase 1's ``foreachBatch`` MERGEs ``status`` from ``'pending'`` to
    ``'completed'`` (or ``'failed'``) and populates ``output_paths``.
    This function polls the table directly — no dependency on the
    overall job lifecycle — so the handler can return as soon as
    the individual DICOM files are available on Volumes.

    Args:
        sql_client: Shared SQL client instance.
        token: Bearer token (user OBO or ``None`` for app-auth).
        file_id: The ``file_id`` inserted by the handler.

    Returns:
        A dict with ``status``, ``output_paths``, and ``error_message``.
        ``output_paths`` is a list of individual DICOM file paths
        (``dbfs:/Volumes/…/stow/<uuid>.dcm``).
    """
    if not _stow_table:
        return {"status": "skipped", "output_paths": [], "error_message": "stow_table not configured"}

    query, params = build_stow_poll_query(_stow_table, file_id)
    start = time.monotonic()

    while time.monotonic() - start < _STOW_TABLE_POLL_TIMEOUT:
        time.sleep(_STOW_TABLE_POLL_INTERVAL)

        try:
            rows = sql_client.execute(
                query, parameters=params,
                user_token=token if USE_USER_AUTH else None,
            )
        except Exception as exc:
            logger.debug(f"STOW-RS: poll query error (will retry): {exc}")
            continue

        if not rows:
            logger.debug(f"STOW-RS: file_id={file_id} not found yet (will retry)")
            continue

        status = rows[0][0]
        output_paths = rows[0][1] or []
        error_message = rows[0][2]

        if status == "pending":
            elapsed = int(time.monotonic() - start)
            logger.debug(
                f"STOW-RS: file_id={file_id} still pending ({elapsed}s elapsed)"
            )
            continue

        elapsed = round(time.monotonic() - start, 1)
        logger.info(
            f"STOW-RS: file_id={file_id} Phase 1 {status} in {elapsed}s, "
            f"{len(output_paths)} path(s)"
        )
        return {
            "status": status,
            "output_paths": output_paths,
            "error_message": error_message,
            "elapsed_seconds": elapsed,
        }

    elapsed = round(time.monotonic() - start, 1)
    logger.warning(f"STOW-RS: file_id={file_id} still pending after {elapsed}s — timeout")
    return {
        "status": "timeout",
        "output_paths": [],
        "error_message": f"Phase 1 did not complete within {_STOW_TABLE_POLL_TIMEOUT}s",
        "elapsed_seconds": elapsed,
    }


# ---------------------------------------------------------------------------
# Cache DICOM paths in instance_path_cache (Tier 1) + Lakebase (Tier 2)
# ---------------------------------------------------------------------------

def _read_dicom_uids(token: str, path: str) -> dict | None:
    """
    Read the DICOM header from *path* to extract UIDs and frame count.

    Uses a lightweight byte-range read (first ~64 KB) via the Volumes API
    — only header fields are parsed, pixel data is skipped entirely.

    Returns:
        ``{"sop_uid", "study_uid", "series_uid", "num_frames", "path"}``
        or ``None`` on any failure.
    """
    try:
        db_file = DatabricksFile.from_full_path(path)
        meta = get_file_metadata(token, db_file)

        sop_uid = _extract_tag(meta, "00080018")
        study_uid = _extract_tag(meta, "0020000D")
        series_uid = _extract_tag(meta, "0020000E")
        num_frames = int(_extract_tag(meta, "00280008") or "1")

        if not sop_uid:
            logger.debug(f"STOW-RS cache: no SOP UID in {path}")
            return None

        return {
            "sop_uid": sop_uid,
            "study_uid": study_uid or "",
            "series_uid": series_uid or "",
            "num_frames": num_frames,
            "path": db_file.full_path,
        }
    except Exception as exc:
        logger.debug(f"STOW-RS cache: header read failed for {path}: {exc}")
        return None


def _extract_tag(meta: dict, tag: str) -> str | None:
    """Extract a single-valued DICOM tag from a pydicom JSON dict."""
    entry = meta.get(tag)
    if entry and isinstance(entry, dict):
        values = entry.get("Value", [])
        if values:
            return str(values[0])
    return None


def _cache_stow_paths(
    token: str,
    output_paths: list[str],
    study_instance_uid: str | None,
    uc_table: str,
    user_groups: list[str] | None = None,
) -> list[dict]:
    """
    Read DICOM headers from newly-split files and cache UID → path mappings.

    For each path in *output_paths*:

    1. Byte-range read of the DICOM header (~64 KB) to extract
       SOP / Study / Series Instance UIDs and Number of Frames.
    2. Populate **Tier 1** (in-memory ``instance_path_cache``).
    3. Populate **Tier 2** (Lakebase ``instance_paths``) if available.

    Header reads are parallelized (thread pool, max 8 workers) so
    total latency is dominated by the slowest single read, not the sum.

    Args:
        token: Bearer token for Volumes API access.
        output_paths: Paths produced by Phase 1 (``dbfs:/Volumes/…``).
        study_instance_uid: Study UID from the STOW URL (fallback if
            the header lacks one).
        uc_table: Fully-qualified catalog table name.
        user_groups: User groups for RLS-scoped caching.

    Returns:
        List of successfully cached entry dicts (for inclusion in the
        HTTP response).
    """
    if not output_paths:
        return []

    max_workers = min(8, len(output_paths))

    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as pool:
        futures = {
            pool.submit(_read_dicom_uids, token, p): p
            for p in output_paths
        }
        results = []
        for future in concurrent.futures.as_completed(futures):
            info = future.result()
            if info:
                results.append(info)

    if not results:
        logger.warning("STOW-RS cache: no DICOM headers could be read")
        return []

    # ── Tier 1: in-memory cache ───────────────────────────────────────
    for r in results:
        instance_path_cache.put(
            r["sop_uid"], uc_table,
            {"path": r["path"], "num_frames": r["num_frames"]},
            user_groups=user_groups,
        )

    logger.info(f"STOW-RS cache: Tier 1 (memory) — cached {len(results)} instance path(s)")

    # ── Tier 2: Lakebase persistent cache ─────────────────────────────
    if lb_utils:
        try:
            lb_entries = [
                {
                    "sop_instance_uid": r["sop_uid"],
                    "study_instance_uid": r["study_uid"] or study_instance_uid or "",
                    "series_instance_uid": r["series_uid"],
                    "local_path": r["path"],
                    "num_frames": r["num_frames"],
                    "uc_table_name": uc_table,
                }
                for r in results
            ]
            lb_utils.insert_instance_paths_batch(
                lb_entries, allowed_groups=user_groups,
            )
            logger.info(
                f"STOW-RS cache: Tier 2 (Lakebase) — persisted {len(lb_entries)} instance path(s)"
            )
        except Exception as exc:
            logger.warning(f"STOW-RS cache: Lakebase persist failed (non-fatal): {exc}")

    return results


# ---------------------------------------------------------------------------
# Main STOW-RS handler
# ---------------------------------------------------------------------------

async def dicomweb_stow_studies(
    request: Request,
    study_instance_uid: str | None = None,
) -> Response:
    """
    POST /api/dicomweb/studies — STOW-RS store DICOM instances.

    Accepts a ``multipart/related`` request body and **streams** the raw
    bytes directly to a single temp file on Volumes using ``httpx`` —
    same zero-copy pattern as the legacy ``_reverse_proxy_files``.

    Memory usage is **O(chunk_size)** regardless of request size.

    **Early-return flow** — the response is sent as soon as the Spark
    job's **Phase 1 (split)** completes, without waiting for the full
    job (Phase 2 — metadata extraction) to finish:

    1. Streams the entire multipart body as-is to a temp file on Volumes
       (``<stow_base>/<date>/<uuid>.mpr``).
    2. Inserts **one** tracking row into ``stow_operations`` with the
       ``study_instance_uid`` from the URL (synchronous INSERT).
    3. Fires the serverless Spark job (non-blocking).
    4. Polls the ``stow_operations`` table until ``status`` changes from
       ``'pending'`` — meaning Phase 1 has MERGEd ``output_paths`` back.
    5. Reads DICOM headers from the newly-split files (parallel,
       ~64 KB per file) to extract SOP / Series / Study UIDs.
    6. Caches the UID → path mappings in **Tier 1** (in-memory
       ``instance_path_cache``) and **Tier 2** (Lakebase
       ``instance_paths``) so that subsequent WADO-RS requests hit
       the cache immediately.
    7. Returns the response with paths and cached UID mappings.
       Phase 2 (metadata extraction → catalog INSERT) continues in
       the background.

    Returns:
        200 OK — Phase 1 completed, individual DICOMs available on Volumes.
        400 Bad Request — invalid Content-Type.
        500 Internal Server Error — upload or Phase 1 processing failed.
    """
    content_type = request.headers.get("content-type", "")

    # ── Validate Content-Type ──────────────────────────────────────────
    if "multipart/related" not in content_type.lower():
        raise HTTPException(
            status_code=400,
            detail=(
                "STOW-RS requires Content-Type: multipart/related; "
                f"got '{content_type}'"
            ),
        )

    # ── Landing-zone configuration ─────────────────────────────────────
    stow_base = os.getenv("DATABRICKS_STOW_VOLUME_PATH", "").rstrip("/")
    if not stow_base:
        logger.error("STOW-RS: DATABRICKS_STOW_VOLUME_PATH env var not set")
        raise HTTPException(
            status_code=500,
            detail="DATABRICKS_STOW_VOLUME_PATH not configured",
        )

    # ── Auth token (reuse app/user resolution already in place) ────────
    token = (
        resolve_user_token(request) if USE_USER_AUTH else app_token_provider()
    )

    # ── Stream entire body to a single temp file ───────────────────────
    file_id = uuid.uuid4().hex
    current_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    dest_path = f"{stow_base}/{current_date}/{file_id}.mpr"
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

    logger.info(
        f"STOW-RS: streaming request to {dest_path}, "
        f"study_constraint={study_instance_uid or 'none'}"
    )

    try:
        file_size = await async_stream_to_volumes(
            token, dest_path, request.stream(),
        )
    except Exception as exc:
        logger.error(
            f"STOW-RS: streaming upload failed for {file_id}: "
            f"{type(exc).__name__}: {exc!r}"
        )
        raise HTTPException(
            status_code=500,
            detail=f"Upload failed ({type(exc).__name__}): {exc}",
        )

    logger.info(f"STOW-RS: streamed {file_id}.mpr ({file_size} bytes)")

    # ── Audit metadata ─────────────────────────────────────────────────
    client_ip = request.client.host if request.client else None
    user_email = _resolve_user_email(request, token)
    user_agent = request.headers.get("User-Agent") or None

    record = {
        "file_id": file_id,
        "volume_path": dest_path,
        "file_size": file_size,
        "upload_timestamp": now_iso,
        "study_constraint": study_instance_uid,
        "content_type": content_type,
        "client_ip": client_ip,
        "user_email": user_email,
        "user_agent": user_agent,
    }

    # ── Synchronous INSERT (must complete before job trigger) ───────────
    sql_client = get_sql_client()
    _write_stow_records(sql_client, token, [record])

    # ── Fire Spark job (non-blocking) ──────────────────────────────────
    if token:
        job_status = await asyncio.to_thread(_fire_stow_job, token)
    else:
        job_status = {"action": "skipped", "reason": "no auth token"}

    job_action = job_status.get("action", "?")
    logger.info(f"STOW-RS: job {job_action} for file_id={file_id}")

    # ── Poll stow_operations until Phase 1 completes ──────────────────
    #    Runs in a thread so the async event loop stays responsive.
    poll_result = await asyncio.to_thread(
        _poll_stow_status, sql_client, token, file_id,
    )

    phase1_status = poll_result.get("status", "unknown")
    output_paths = poll_result.get("output_paths", [])
    phase1_succeeded = phase1_status == "completed"

    # ── Cache UID → path mappings (Tier 1 + Tier 2) ───────────────────
    #    Read DICOM headers in parallel from the newly-split files to
    #    extract UIDs, then populate instance_path_cache + Lakebase.
    cached_entries: list[dict] = []
    if phase1_succeeded and output_paths and token:
        uc_table = _stow_catalog_table or ""
        user_groups = resolve_user_groups(request) if USE_USER_AUTH else None

        cached_entries = await asyncio.to_thread(
            _cache_stow_paths, token, output_paths,
            study_instance_uid, uc_table, user_groups,
        )

    # ── Build receipt & choose HTTP status ────────────────────────────
    receipt = {
        "file_id": file_id,
        "path": dest_path,
        "size": file_size,
        "status": "succeeded" if phase1_succeeded else phase1_status,
        "content_type": content_type,
        "study_constraint": study_instance_uid,
        "output_paths": output_paths,
        "cached_instances": len(cached_entries),
        "job": job_status,
        "phase1": poll_result,
    }

    http_status = 200 if phase1_succeeded else 500
    logger.info(
        f"STOW-RS complete: {file_id} ({file_size} bytes), "
        f"phase1={phase1_status}, cached={len(cached_entries)}, "
        f"HTTP {http_status}"
    )
    return Response(
        content=json.dumps(receipt, indent=2),
        status_code=http_status,
        media_type="application/json",
    )
