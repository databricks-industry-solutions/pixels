"""
STOW-RS handler — dual-path: streaming split or legacy Spark.

**Streaming path** (default, for uploads ≤ threshold):

1. Parses multipart boundaries on-the-fly as bytes arrive.
2. Extracts DICOM UIDs from the first 64 KB of each part.
3. Streams each part directly to
   ``/stow/{StudyUID}/{SeriesUID}/{SOPUID}.dcm`` on Volumes.
4. Inserts a tracking row into ``stow_operations`` as ``completed``
   with ``output_paths`` pre-populated.
5. Fires a Spark job for Phase 2 only (metadata extraction).
6. Caches UID → path mappings directly (no header re-reads needed).
7. Returns a JSON receipt immediately.

**Legacy Spark path** (for uploads > threshold):

1. Streams the multipart/related body to a single temp ``.mpr`` file.
2. Inserts a tracking row (``status='pending'``).
3. Returns a JSON receipt immediately to the client.
4. Fires a Spark job (Phase 1 split + Phase 2 metadata) in the background.

The threshold is controlled by ``STOW_STREAMING_MAX_BYTES`` (default 500 MB).
When ``Content-Length`` is absent or ≤ threshold, the streaming path is used.
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
from ..multipart_stream import async_stream_split_to_volumes
from ..queries import (
    build_stow_insert_completed_query,
    build_stow_insert_query,
    build_stow_poll_query,
)
from ..sql_client import USE_USER_AUTH, DatabricksSQLClient
from ._common import (
    app_token_provider,
    get_sql_client,
    lb_utils,
    resolve_user_groups,
    resolve_user_token,
)

logger = LoggerProvider("DICOMweb.STOW")

# Default 500 MB — uploads larger than this use the legacy Spark split path
_STOW_STREAMING_MAX_BYTES = int(os.getenv("STOW_STREAMING_MAX_BYTES", str(500 * 1024 * 1024)))


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
            emails = data.get("emails", [])
            resolved = next(
                (e["value"] for e in emails if e.get("primary")),
                emails[0]["value"] if emails else None,
            )
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
_stow_catalog_table: str | None = None  # e.g. "main.pixels_solacc.object_catalog"
_stow_volume_uc: str | None = None  # e.g. "main.pixels_solacc.pixels_volume"

_pixels_table_env = os.getenv("DATABRICKS_PIXELS_TABLE", "")
if _pixels_table_env:
    _parts = _pixels_table_env.split(".")
    if len(_parts) == 3:
        _stow_table = f"{_parts[0]}.{_parts[1]}.stow_operations"
        _stow_catalog_table = _pixels_table_env

_stow_volume_path_env = os.getenv("DATABRICKS_STOW_VOLUME_PATH", "")
if _stow_volume_path_env:
    _vol_parts = _stow_volume_path_env.strip("/").split("/")
    if len(_vol_parts) >= 4 and _vol_parts[0] == "Volumes":
        _stow_volume_uc = f"{_vol_parts[1]}.{_vol_parts[2]}.{_vol_parts[3]}"


# ---------------------------------------------------------------------------
# Batched async write buffer — collects audit records from concurrent uploads
# and flushes them to the SQL warehouse in chunks of up to BATCH_SIZE rows.
# ---------------------------------------------------------------------------

import threading as _threading


class _StowRecordBuffer:
    """
    Thread-safe buffer that coalesces single-row STOW audit records into
    batch INSERTs.

    Each upload appends its record.  A flush is triggered when:
    * the buffer reaches ``max_batch`` records, OR
    * ``flush_interval_s`` seconds have elapsed since the last flush.

    The periodic flush runs in a daemon background thread so records never
    sit in the buffer longer than ``flush_interval_s`` seconds even during
    quiet periods.
    """

    def __init__(
        self,
        write_fn,  # callable(sql_client, token, records) → None
        max_batch: int = 100,
        flush_interval_s: float = 2.0,
    ):
        self._write_fn = write_fn
        self._max_batch = max_batch
        self._flush_interval_s = flush_interval_s
        self._buf: list[dict] = []
        self._lock = _threading.Lock()
        self._sql_client = None
        self._token = None
        self._last_flush = time.monotonic()
        self._stop = _threading.Event()
        self._thread = _threading.Thread(
            target=self._periodic_flush, daemon=True, name="stow-record-flusher"
        )
        self._thread.start()

    def set_client(self, sql_client, token: str | None):
        """Provide the SQL client and auth token (called lazily on first use)."""
        self._sql_client = sql_client
        self._token = token

    def append(self, record: dict, sql_client=None, token: str | None = None) -> None:
        """Add *record* to the buffer; flush immediately if batch is full."""
        if sql_client is not None:
            self.set_client(sql_client, token)
        with self._lock:
            self._buf.append(record)
            if len(self._buf) >= self._max_batch:
                batch = self._buf[:]
                self._buf.clear()
                self._last_flush = time.monotonic()
            else:
                batch = None
        if batch:
            self._flush(batch)

    def flush_all(self) -> None:
        """Flush any remaining records synchronously (call at shutdown)."""
        with self._lock:
            batch = self._buf[:]
            self._buf.clear()
        if batch:
            self._flush(batch)

    def stop(self) -> None:
        self._stop.set()
        self.flush_all()

    def _periodic_flush(self) -> None:
        while not self._stop.wait(timeout=self._flush_interval_s):
            elapsed = time.monotonic() - self._last_flush
            if elapsed >= self._flush_interval_s:
                with self._lock:
                    if not self._buf:
                        continue
                    batch = self._buf[:]
                    self._buf.clear()
                    self._last_flush = time.monotonic()
                self._flush(batch)

    def _flush(self, batch: list[dict]) -> None:
        if not batch or self._sql_client is None:
            return
        try:
            self._write_fn(self._sql_client, self._token, batch)
        except Exception as exc:
            logger.warning(
                "STOW record buffer: batch flush failed (%d records): %s", len(batch), exc
            )


_stow_record_buffer = _StowRecordBuffer(
    write_fn=lambda sql_client, token, records: _write_stow_records(sql_client, token, records),
    max_batch=int(os.getenv("STOW_SQL_BATCH_SIZE", "100")),
    flush_interval_s=float(os.getenv("STOW_SQL_FLUSH_INTERVAL_S", "2.0")),
)


# ---------------------------------------------------------------------------
# Tracking table INSERT helpers
# ---------------------------------------------------------------------------


def _write_stow_records(
    sql_client: DatabricksSQLClient,
    token: str | None,
    records: list[dict],
) -> None:
    """INSERT tracking rows into ``stow_operations`` (status='pending')."""
    if not _stow_table or not records:
        return
    try:
        query, params = build_stow_insert_query(_stow_table, records)
        sql_client.execute(
            query,
            parameters=params,
            user_token=token if USE_USER_AUTH else None,
        )
        logger.info(f"STOW tracking: inserted {len(records)} record(s)")
    except Exception as exc:
        logger.error(f"STOW tracking INSERT failed: {exc}")


def _write_stow_records_completed(
    sql_client: DatabricksSQLClient,
    token: str | None,
    records: list[dict],
) -> None:
    """INSERT tracking rows as ``completed`` with ``output_paths`` pre-populated."""
    if not _stow_table or not records:
        return
    try:
        query, params = build_stow_insert_completed_query(_stow_table, records)
        sql_client.execute(
            query,
            parameters=params,
            user_token=token if USE_USER_AUTH else None,
        )
        logger.info(f"STOW tracking: inserted {len(records)} completed record(s)")
    except Exception as exc:
        logger.error(f"STOW tracking INSERT (completed) failed: {exc}")


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
                f"STOW-RS: job list lookup failed (HTTP {resp.status_code}): " f"{resp.text[:200]}"
            )
    except Exception as exc:
        logger.warning(f"STOW-RS: job name resolution failed: {exc}")

    _stow_job_resolved = True
    return _stow_job_id


# ---------------------------------------------------------------------------
# Fire Spark job (non-blocking)
# ---------------------------------------------------------------------------

_STOW_TABLE_POLL_INTERVAL = 30  # seconds between stow_operations polls
_STOW_TABLE_POLL_TIMEOUT = 5 * 60  # max wait for Phase 1


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
# Poll stow_operations table for Phase 1 completion (legacy path only)
# ---------------------------------------------------------------------------


def _poll_stow_status(
    sql_client: DatabricksSQLClient,
    token: str | None,
    file_id: str,
) -> dict:
    """
    Poll the ``stow_operations`` table until Phase 1 (split) completes.

    Only used by the **legacy Spark path** — the streaming path skips
    this entirely because the split is done in-process.
    """
    if not _stow_table:
        return {
            "status": "skipped",
            "output_paths": [],
            "error_message": "stow_table not configured",
        }

    query, params = build_stow_poll_query(_stow_table, file_id)
    start = time.monotonic()

    while time.monotonic() - start < _STOW_TABLE_POLL_TIMEOUT:
        time.sleep(_STOW_TABLE_POLL_INTERVAL)

        try:
            rows = sql_client.execute(
                query,
                parameters=params,
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
            logger.debug(f"STOW-RS: file_id={file_id} still pending ({elapsed}s elapsed)")
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

    Used by the **legacy Spark path** only — the streaming path populates
    the cache directly from UIDs extracted during upload.
    """
    if not output_paths:
        return []

    max_workers = min(8, len(output_paths))

    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as pool:
        futures = {pool.submit(_read_dicom_uids, token, p): p for p in output_paths}
        results = []
        for future in concurrent.futures.as_completed(futures):
            info = future.result()
            if info:
                results.append(info)

    if not results:
        logger.warning("STOW-RS cache: no DICOM headers could be read")
        return []

    _populate_cache(results, study_instance_uid, uc_table, user_groups)
    return results


def _cache_streaming_results(
    part_results: list[dict],
    study_instance_uid: str | None,
    uc_table: str,
    user_groups: list[str] | None = None,
) -> list[dict]:
    """
    Populate UID → path cache directly from streaming split results.

    No Volumes API calls needed — UIDs were already extracted during upload.
    """
    entries = []
    for r in part_results:
        if r["status"] != "SUCCESS" or not r.get("sop_uid"):
            continue
        entries.append(
            {
                "sop_uid": r["sop_uid"],
                "study_uid": r.get("study_uid", ""),
                "series_uid": r.get("series_uid", ""),
                "num_frames": r.get("num_frames", 1),
                "path": r["output_path"],
            }
        )

    if not entries:
        return []

    _populate_cache(entries, study_instance_uid, uc_table, user_groups)
    return entries


def _populate_cache(
    entries: list[dict],
    study_instance_uid: str | None,
    uc_table: str,
    user_groups: list[str] | None,
) -> None:
    """Shared cache population logic for both streaming and legacy paths."""
    # ── Tier 1: in-memory cache ───────────────────────────────────────
    for r in entries:
        instance_path_cache.put(
            r["sop_uid"],
            uc_table,
            {"path": r["path"], "num_frames": r["num_frames"]},
            user_groups=user_groups,
        )

    logger.info(f"STOW-RS cache: Tier 1 (memory) — cached {len(entries)} instance path(s)")

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
                for r in entries
            ]
            lb_utils.insert_instance_paths_batch(
                lb_entries,
                allowed_groups=user_groups,
            )
            logger.info(
                f"STOW-RS cache: Tier 2 (Lakebase) — persisted {len(lb_entries)} instance path(s)"
            )
        except Exception as exc:
            logger.warning(f"STOW-RS cache: Lakebase persist failed (non-fatal): {exc}")


# ---------------------------------------------------------------------------
# Main STOW-RS handler (dual-path)
# ---------------------------------------------------------------------------


async def dicomweb_stow_studies(
    request: Request,
    study_instance_uid: str | None = None,
) -> Response:
    """
    POST /api/dicomweb/studies — STOW-RS store DICOM instances.

    Routes to either the **streaming split** path or the **legacy Spark**
    path based on ``Content-Length`` and the ``STOW_STREAMING_MAX_BYTES``
    threshold.

    **Streaming path** (≤ threshold or unknown size):
      Parses multipart boundaries in-process, streams each DICOM part
      directly to ``/stow/{StudyUID}/{SeriesUID}/{SOPUID}.dcm``.
      No intermediate ``.mpr``, no Spark Phase 1, no polling.

    **Legacy Spark path** (> threshold):
      Streams the full body to a ``.mpr`` file, returns immediately, then
      triggers the Spark split+metadata job in the background.
    """
    content_type = request.headers.get("content-type", "")

    # ── Validate Content-Type ──────────────────────────────────────────
    if "multipart/related" not in content_type.lower():
        raise HTTPException(
            status_code=400,
            detail=("STOW-RS requires Content-Type: multipart/related; " f"got '{content_type}'"),
        )

    # ── Landing-zone configuration ─────────────────────────────────────
    stow_base = os.getenv("DATABRICKS_STOW_VOLUME_PATH", "").rstrip("/")
    if not stow_base:
        logger.error("STOW-RS: DATABRICKS_STOW_VOLUME_PATH env var not set")
        raise HTTPException(
            status_code=500,
            detail="DATABRICKS_STOW_VOLUME_PATH not configured",
        )

    # ── Auth token ─────────────────────────────────────────────────────
    token = resolve_user_token(request) if USE_USER_AUTH else app_token_provider()

    # ── Choose streaming vs legacy path ────────────────────────────────
    content_length_str = request.headers.get("content-length", "")
    use_streaming = True
    try:
        body_size = int(content_length_str)
        if body_size > _STOW_STREAMING_MAX_BYTES:
            use_streaming = False
            logger.info(
                f"STOW-RS: body size {body_size} exceeds streaming threshold "
                f"({_STOW_STREAMING_MAX_BYTES}) — using legacy Spark path"
            )
    except (ValueError, TypeError):
        pass  # Unknown size — default to streaming

    if use_streaming:
        return await _handle_streaming(request, stow_base, token, content_type, study_instance_uid)
    else:
        return await _handle_legacy_spark(
            request, stow_base, token, content_type, study_instance_uid
        )


# ---------------------------------------------------------------------------
# Streaming path — in-process split, no Spark Phase 1
# ---------------------------------------------------------------------------


async def _handle_streaming(
    request: Request,
    stow_base: str,
    token: str,
    content_type: str,
    study_instance_uid: str | None,
) -> Response:
    """
    Stream-and-split: parse multipart boundaries on-the-fly, write each
    DICOM part directly to ``/stow/{StudyUID}/{SeriesUID}/{SOPUID}.dcm``.
    """
    file_id = uuid.uuid4().hex
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

    logger.info(
        f"STOW-RS [streaming]: file_id={file_id}, "
        f"study_constraint={study_instance_uid or 'none'}"
    )

    # ── Stream-and-split to Volumes ────────────────────────────────────
    try:
        part_results = await async_stream_split_to_volumes(
            token,
            stow_base,
            request.stream(),
            content_type,
        )
    except Exception as exc:
        logger.error(
            f"STOW-RS [streaming]: split failed for {file_id}: " f"{type(exc).__name__}: {exc!r}"
        )
        raise HTTPException(
            status_code=500,
            detail=f"Streaming split failed ({type(exc).__name__}): {exc}",
        )

    succeeded = [r for r in part_results if r["status"] == "SUCCESS"]
    failed = [r for r in part_results if r["status"] == "FAILED"]
    total_size = sum(r.get("file_size", 0) for r in part_results)
    output_paths = [r["output_path"] for r in succeeded]

    logger.info(
        f"STOW-RS [streaming]: {file_id} — "
        f"{len(succeeded)} parts succeeded, {len(failed)} failed, "
        f"{total_size} bytes total"
    )

    # ── Audit metadata ─────────────────────────────────────────────────
    client_ip = request.client.host if request.client else None
    user_email = await asyncio.to_thread(_resolve_user_email, request, token)
    user_agent = request.headers.get("User-Agent") or None

    record = {
        "file_id": file_id,
        "volume_path": stow_base,
        "file_size": total_size,
        "upload_timestamp": now_iso,
        "study_constraint": study_instance_uid,
        "content_type": content_type,
        "client_ip": client_ip,
        "user_email": user_email,
        "user_agent": user_agent,
        "output_paths": json.dumps(output_paths),
    }

    # ── INSERT as completed (Phase 2 picks this up via CDF) ───────────
    # Offloaded to a thread so the blocking SQL round-trip does not stall
    # the asyncio event loop and freeze every other in-flight upload.
    sql_client = get_sql_client()
    await asyncio.to_thread(_write_stow_records_completed, sql_client, token, [record])

    # ── Fire Spark job for Phase 2 only (metadata extraction) ──────────
    job_status: dict = {"action": "skipped", "reason": "no auth token"}
    if token:
        job_status = await asyncio.to_thread(_fire_stow_job, token)

    job_action = job_status.get("action", "?")
    logger.info(f"STOW-RS [streaming]: job {job_action} for Phase 2")

    # ── Cache UID → path mappings directly (no header re-reads!) ───────
    # Also offloaded: _cache_streaming_results calls lb_utils.insert_instance_paths_batch
    # which is a synchronous Lakebase (PostgreSQL) write.
    cached_entries: list[dict] = []
    if succeeded and token:
        uc_table = _stow_catalog_table or ""
        user_groups = resolve_user_groups(request) if USE_USER_AUTH else None
        cached_entries = await asyncio.to_thread(
            _cache_streaming_results,
            part_results,
            study_instance_uid,
            uc_table,
            user_groups,
        )

    # ── Build receipt ──────────────────────────────────────────────────
    all_succeeded = len(failed) == 0 and len(succeeded) > 0
    receipt = {
        "file_id": file_id,
        "mode": "streaming",
        "size": total_size,
        "status": "succeeded" if all_succeeded else ("partial" if succeeded else "failed"),
        "content_type": content_type,
        "study_constraint": study_instance_uid,
        "output_paths": output_paths,
        "instances": [
            {
                "path": r["output_path"],
                "size": r["file_size"],
                "study_uid": r["study_uid"],
                "series_uid": r["series_uid"],
                "sop_uid": r["sop_uid"],
                "num_frames": r["num_frames"],
                "status": r["status"],
            }
            for r in part_results
        ],
        "cached_instances": len(cached_entries),
        "job": job_status,
    }

    http_status = 200 if all_succeeded else (200 if succeeded else 500)
    logger.info(
        f"STOW-RS [streaming] complete: {file_id} ({total_size} bytes), "
        f"{len(succeeded)}/{len(part_results)} succeeded, "
        f"cached={len(cached_entries)}, HTTP {http_status}"
    )
    return Response(
        content=json.dumps(receipt, indent=2),
        status_code=http_status,
        media_type="application/json",
    )


# ---------------------------------------------------------------------------
# Legacy Spark path — stream to .mpr, trigger Spark split + metadata
# ---------------------------------------------------------------------------


async def _handle_legacy_spark(
    request: Request,
    stow_base: str,
    token: str,
    content_type: str,
    study_instance_uid: str | None,
) -> Response:
    """
    Legacy path for large uploads: stream the entire multipart body to a
    single ``.mpr`` file on Volumes, then trigger a Spark job to split it.
    """
    file_id = uuid.uuid4().hex
    current_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    dest_path = f"{stow_base}/{current_date}/{file_id}.mpr"
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

    logger.info(
        f"STOW-RS [legacy]: streaming request to {dest_path}, "
        f"study_constraint={study_instance_uid or 'none'}"
    )

    import time as _time

    _t0 = _time.perf_counter()
    try:
        file_size = await async_stream_to_volumes(
            token,
            dest_path,
            request.stream(),
        )
    except Exception as exc:
        logger.error(
            f"STOW-RS [legacy]: streaming upload failed for {file_id}: "
            f"{type(exc).__name__}: {exc!r}"
        )
        raise HTTPException(
            status_code=500,
            detail=f"Upload failed ({type(exc).__name__}): {exc}",
        )
    _t_upload = _time.perf_counter()

    logger.info(f"STOW-RS [legacy]: streamed {file_id}.mpr ({file_size} bytes)")

    # ── Audit metadata ─────────────────────────────────────────────────
    client_ip = request.client.host if request.client else None
    user_email = await asyncio.to_thread(_resolve_user_email, request, token)
    _t_scim = _time.perf_counter()
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

    _t_sql = _time.perf_counter()
    logger.info(
        "STOW-RS [legacy]: timings for %s — upload=%.2fs  scim=%.2fs  total_before_sql=%.2fs",
        file_id,
        _t_upload - _t0,
        _t_scim - _t_upload,
        _t_sql - _t0,
    )

    # ── Buffer the audit record — flushed in batches of up to STOW_SQL_BATCH_SIZE
    # rows every STOW_SQL_FLUSH_INTERVAL_S seconds.  The file is already safely
    # on S3/Volumes so the SQL write does not block the HTTP response.
    sql_client = get_sql_client()
    _stow_record_buffer.append(record, sql_client=sql_client, token=token)

    # ── Fire Spark job in the background — do NOT await ────────────────
    async def _background_fire():
        if not token:
            logger.info(f"STOW-RS [legacy]: skipping job trigger for {file_id} — no auth token")
            return
        job_status = await asyncio.to_thread(_fire_stow_job, token)
        job_action = job_status.get("action", "?")
        logger.info(f"STOW-RS [legacy]: background job {job_action} for file_id={file_id}")

    asyncio.create_task(_background_fire())

    # ── Build receipt & return immediately ────────────────────────────
    receipt = {
        "file_id": file_id,
        "mode": "legacy_spark",
        "path": dest_path,
        "size": file_size,
        "status": "accepted",
        "content_type": content_type,
        "study_constraint": study_instance_uid,
    }

    logger.info(
        f"STOW-RS [legacy] accepted: {file_id} ({file_size} bytes), " f"job will run in background"
    )
    return Response(
        content=json.dumps(receipt, indent=2),
        status_code=200,
        media_type="application/json",
    )
