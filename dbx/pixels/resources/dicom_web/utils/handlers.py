"""
FastAPI endpoint handlers for DICOMweb QIDO-RS / WADO-RS / WADO-URI / STOW-RS.

These thin handler functions are imported by ``app.py`` and wired to routes.

Supported services:

* **QIDO-RS** — RESTful study/series/instance search
* **WADO-RS** — RESTful instance / frame retrieval (path-based)
* **WADO-URI** — Legacy query-parameter retrieval
  (``?requestType=WADO&studyUID=…&objectUID=…&contentType=…``)
* **STOW-RS** — RESTful instance storage (binary DICOM via multipart/related)

Authorization is controlled by the ``DICOMWEB_USE_USER_AUTH`` env var:

* **false** (default) — App authorization.  A **singleton**
  ``DICOMwebDatabricksWrapper`` is created at module load time and
  reused across all requests.  The bearer token auto-refreshes via
  the Databricks SDK ``Config``.
* **true** — User (OBO) authorization.  A **per-request** wrapper is
  created because the token, user groups, and ``pixels_table`` may
  differ between users.

See: https://docs.databricks.com/aws/en/dev-tools/databricks-apps/auth
"""

import concurrent.futures
import json
import os
import uuid
from datetime import datetime, timezone

import requests as _requests
from databricks.sdk.core import Config
from fastapi import HTTPException, Request, Response
from fastapi.responses import StreamingResponse

from dbx.pixels.lakebase import LakebaseUtils, RLS_ENABLED
from dbx.pixels.logging import LoggerProvider

from . import timing_decorator
from .dicom_tags import TRANSFER_SYNTAX_TO_MIME
from .sql_client import USE_USER_AUTH, DatabricksSQLClient
from .wrapper import DICOMwebDatabricksWrapper

logger = LoggerProvider("DICOMweb.Handlers")

# ---------------------------------------------------------------------------
# Lakebase singleton (persistent tier-2 cache for frame offsets + instance paths)
# ---------------------------------------------------------------------------
# Lakebase has a 3-level namespace: Instance → Database → Schema → Table.
# When DATABRICKS_PIXELS_TABLE is set (e.g. pixels_dicomweb.tcia.object_catalog):
#   - Instance  → LAKEBASE_INSTANCE_NAME (the server, independent of UC)
#   - Database  → UC catalog  ("pixels_dicomweb")
#   - Schema    → UC schema   ("tcia")
# This alignment enables Reverse ETL Sync between UC and Lakebase.
# ---------------------------------------------------------------------------

lb_utils = None
if "LAKEBASE_INSTANCE_NAME" in os.environ or "DATABRICKS_PIXELS_TABLE" in os.environ:
    try:
        from pathlib import Path

        # dbx.pixels.resources is a namespace package (__file__ is None).
        # Locate the SQL directory relative to lakebase.py which always
        # has a concrete __file__.
        import dbx.pixels.lakebase as _lb_mod

        _sql_dir = Path(_lb_mod.__file__).parent / "resources" / "sql" / "lakebase"

        # Derive the UC table name (used to align database + schema)
        _uc_table = os.getenv("DATABRICKS_PIXELS_TABLE")

        lb_utils = LakebaseUtils(
            instance_name=os.environ.get("LAKEBASE_INSTANCE_NAME", "pixels-lakebase"),
            create_instance=True,
            uc_table_name=_uc_table,
        )

        if os.environ.get("LAKEBASE_INIT_DB", "").lower() in ("1", "true", "yes"):
            # The schema name used in DDL is the one LakebaseUtils derived
            _lb_schema = lb_utils.schema

            init_files = [
                "CREATE_LAKEBASE_SCHEMA.sql",
                "CREATE_LAKEBASE_DICOM_FRAMES.sql",
            ]
            # Apply RLS schema when enabled
            if RLS_ENABLED:
                init_files.append("CREATE_LAKEBASE_RLS.sql")
            for sql_file in init_files:
                with open(_sql_dir / sql_file) as fh:
                    ddl = fh.read().format(schema_name=_lb_schema)
                    lb_utils.execute_query(ddl)
            logger.info(
                f"Lakebase initialised: instance='{lb_utils.instance_name}', "
                f"database='{lb_utils.database}', schema='{_lb_schema}'"
                f"{' (RLS enabled)' if RLS_ENABLED else ''}"
            )
        else:
            logger.info(
                f"Lakebase connected (schema init skipped): "
                f"instance='{lb_utils.instance_name}', "
                f"database='{lb_utils.database}', schema='{lb_utils.schema}'"
            )
    except Exception as exc:
        logger.warning(f"Lakebase init failed: {exc}")
else:
    logger.warning(
        "Neither LAKEBASE_INSTANCE_NAME nor DATABRICKS_PIXELS_TABLE configured, "
        "tier-2 caching disabled"
    )


# ---------------------------------------------------------------------------
# SQL client singleton (shared across requests — connection reused for app auth)
# ---------------------------------------------------------------------------

_sql_client: DatabricksSQLClient | None = None


def _get_sql_client() -> DatabricksSQLClient:
    """Lazily create the shared ``DatabricksSQLClient`` singleton."""
    global _sql_client
    if _sql_client is None:
        cfg = Config()
        warehouse_id = os.getenv("DATABRICKS_WAREHOUSE_ID")
        if not warehouse_id:
            raise HTTPException(status_code=500, detail="DATABRICKS_WAREHOUSE_ID not configured")
        host = cfg.host or os.getenv("DATABRICKS_HOST", "")
        _sql_client = DatabricksSQLClient(host=host, warehouse_id=warehouse_id)
    return _sql_client


# ---------------------------------------------------------------------------
# Token resolution — same approach for both SQL and file operations
# ---------------------------------------------------------------------------

def _resolve_user_token(request: Request) -> str:
    """
    Extract the user's forwarded access token (OBO mode only).

    Raises:
        HTTPException 401: if the header is missing.
    """
    token = request.headers.get("X-Forwarded-Access-Token")
    if not token:
        raise HTTPException(
            status_code=401,
            detail="User authorization (OBO) is enabled but no "
                   "X-Forwarded-Access-Token header was found",
        )
    return token


# ---------------------------------------------------------------------------
# App-auth token provider (service principal — singleton, auto-refreshed)
# ---------------------------------------------------------------------------
# The SDK ``Config`` caches and auto-refreshes the bearer token internally.
# We keep one ``Config`` instance and call its header factory on each access
# so the wrapper always gets a valid, non-expired token.

_app_cfg: Config | None = None
_app_header_factory = None


def _app_token_provider() -> str:
    """
    Return a current bearer token from the Databricks SDK ``Config``.

    The SDK handles caching and automatic refresh — calling this is
    near-zero cost when the token is still valid.

    If the header factory returns ``None`` (transient OAuth refresh
    failure), the ``Config`` is recreated on the next call so a fresh
    authentication flow can succeed.
    """
    global _app_cfg, _app_header_factory
    if _app_cfg is None:
        _app_cfg = Config()
        _app_header_factory = _app_cfg.authenticate()
    headers = _app_header_factory() if callable(_app_header_factory) else _app_header_factory
    if headers is None:
        # Token refresh returned None — reset so next call re-authenticates
        logger.warning("SDK header factory returned None — resetting Config for re-auth")
        _app_cfg = None
        _app_header_factory = None
        raise HTTPException(
            status_code=503,
            detail="Authentication temporarily unavailable — please retry",
        )
    auth = headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        return auth[7:]
    raise HTTPException(
        status_code=500,
        detail="SDK Config did not produce a Bearer token",
    )


# ---------------------------------------------------------------------------
# User group resolution (for RLS enforcement)
# ---------------------------------------------------------------------------

# In-memory cache: user email → list[str] (groups).
# Avoids a Lakebase round-trip on every request.
_user_groups_cache: dict[str, list[str]] = {}


def _resolve_user_groups(request: Request) -> list[str] | None:
    """
    Resolve the current user's Databricks account groups for RLS.

    Returns ``None`` when RLS is not active (feature flag off, no
    Lakebase, or app-auth mode).  Handlers pass ``None`` through to
    the wrapper and caches, which preserves the legacy behaviour.
    """
    if not (RLS_ENABLED and USE_USER_AUTH and lb_utils):
        return None

    email = request.headers.get("X-Forwarded-Email", "").strip()
    if not email:
        logger.warning(
            "RLS enabled but X-Forwarded-Email header missing — "
            "no user group filtering will be applied"
        )
        return None

    # Fast path: in-memory hit
    cached = _user_groups_cache.get(email)
    if cached is not None:
        return cached

    # Slow path: query Lakebase user_groups table
    try:
        groups = lb_utils.get_user_groups(email)
        _user_groups_cache[email] = groups
        logger.info(f"Resolved {len(groups)} groups for {email}")
        return groups
    except Exception as exc:
        logger.warning(f"User group resolution failed for {email}: {exc}")
        return None


# ---------------------------------------------------------------------------
# Wrapper factory — singleton (app auth) or per-request (OBO)
# ---------------------------------------------------------------------------

_app_wrapper: DICOMwebDatabricksWrapper | None = None


def _get_app_wrapper() -> DICOMwebDatabricksWrapper:
    """
    Return the module-level singleton wrapper for app-auth (service principal).

    Created lazily on first call; reused for every subsequent request.
    The ``token_provider`` ensures the bearer token auto-refreshes via
    the Databricks SDK without recreating the wrapper.
    """
    global _app_wrapper
    if _app_wrapper is not None:
        return _app_wrapper

    sql_client = _get_sql_client()
    pixels_table = os.getenv("DATABRICKS_PIXELS_TABLE")
    if not pixels_table:
        raise HTTPException(status_code=500, detail="DATABRICKS_PIXELS_TABLE not configured")

    _app_wrapper = DICOMwebDatabricksWrapper(
        sql_client=sql_client,
        token_provider=_app_token_provider,
        pixels_table=pixels_table,
        lb_utils=lb_utils,
        user_groups=None,
    )
    logger.info("App-auth singleton DICOMwebDatabricksWrapper created")
    return _app_wrapper


def _build_obo_wrapper(request: Request, pixels_table: str | None = None) -> DICOMwebDatabricksWrapper:
    """
    Build a per-request wrapper for OBO (user auth) mode.

    Each request carries a different user token, group memberships,
    and potentially a different ``pixels_table`` (via cookie).
    """
    sql_client = _get_sql_client()
    token = _resolve_user_token(request)
    user_groups = _resolve_user_groups(request)

    if not pixels_table:
        pixels_table = request.cookies.get("pixels_table") or os.getenv("DATABRICKS_PIXELS_TABLE")
    if not pixels_table:
        raise HTTPException(status_code=500, detail="DATABRICKS_PIXELS_TABLE not configured")

    return DICOMwebDatabricksWrapper(
        sql_client=sql_client,
        token=token,
        pixels_table=pixels_table,
        lb_utils=lb_utils,
        user_groups=user_groups,
    )


def get_dicomweb_wrapper(request: Request, pixels_table: str | None = None) -> DICOMwebDatabricksWrapper:
    """
    Return the appropriate ``DICOMwebDatabricksWrapper``.

    * **App auth** — returns the module-level singleton (token auto-refreshes).
    * **User auth (OBO)** — returns a fresh per-request wrapper.
    """
    if USE_USER_AUTH:
        return _build_obo_wrapper(request, pixels_table)
    return _get_app_wrapper()


# ---------------------------------------------------------------------------
# QIDO-RS handlers
# ---------------------------------------------------------------------------

@timing_decorator
def dicomweb_qido_studies(request: Request) -> Response:
    """GET /api/dicomweb/studies — search for studies."""
    wrapper = get_dicomweb_wrapper(request)
    results = wrapper.search_for_studies(dict(request.query_params))
    return Response(content=json.dumps(results, indent=2), media_type="application/dicom+json")


def dicomweb_qido_series(request: Request, study_instance_uid: str) -> Response:
    """GET /api/dicomweb/studies/{study}/series"""
    wrapper = get_dicomweb_wrapper(request)
    results = wrapper.search_for_series(study_instance_uid, dict(request.query_params))
    return Response(content=json.dumps(results, indent=2), media_type="application/dicom+json")


def dicomweb_qido_instances(
    request: Request, study_instance_uid: str, series_instance_uid: str
) -> Response:
    """GET /api/dicomweb/studies/{study}/series/{series}/instances"""
    wrapper = get_dicomweb_wrapper(request)
    results = wrapper.search_for_instances(
        study_instance_uid, series_instance_uid, dict(request.query_params)
    )
    return Response(content=json.dumps(results, indent=2), media_type="application/dicom+json")


# ---------------------------------------------------------------------------
# WADO-RS handlers
# ---------------------------------------------------------------------------

@timing_decorator
def dicomweb_wado_series_metadata(
    request: Request, study_instance_uid: str, series_instance_uid: str
) -> StreamingResponse:
    """GET /api/dicomweb/studies/{study}/series/{series}/metadata

    Streams the JSON array directly from Arrow batches — the ``meta``
    column is already valid JSON so no parse/serialize round-trip is needed.
    """
    wrapper = get_dicomweb_wrapper(request)
    stream = wrapper.retrieve_series_metadata(study_instance_uid, series_instance_uid)
    return StreamingResponse(stream, media_type="application/dicom+json")


def dicomweb_wado_instance(
    request: Request,
    study_instance_uid: str,
    series_instance_uid: str,
    sop_instance_uid: str,
) -> StreamingResponse:
    """GET /api/dicomweb/studies/{study}/series/{series}/instances/{instance}

    Streams the full DICOM file directly from Databricks Volumes → client
    without buffering the entire file in server memory.
    """
    wrapper = get_dicomweb_wrapper(request)
    stream, content_length = wrapper.retrieve_instance(
        study_instance_uid, series_instance_uid, sop_instance_uid,
    )
    headers: dict[str, str] = {"Cache-Control": "private, max-age=3600"}
    if content_length:
        headers["Content-Length"] = content_length
    return StreamingResponse(stream, media_type="application/dicom", headers=headers)


@timing_decorator
def dicomweb_wado_instance_frames(
    request: Request,
    study_instance_uid: str,
    series_instance_uid: str,
    sop_instance_uid: str,
    frame_list: str,
) -> StreamingResponse:
    """GET /…/instances/{instance}/frames/{frameList}

    Streams the multipart response frame-by-frame: the client receives
    each frame as soon as it arrives from the Volumes byte-range read,
    without waiting for all frames to be fetched first.
    """
    wrapper = get_dicomweb_wrapper(request)

    try:
        frame_numbers = [int(f.strip()) for f in frame_list.split(",")]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid frame list format")

    logger.info(
        f"Frame request: study={study_instance_uid}, series={series_instance_uid}, "
        f"instance={sop_instance_uid}, frames={frame_numbers}"
    )

    try:
        # BOT resolution (cache/compute) happens eagerly — errors surface now
        frame_stream, transfer_syntax_uid = wrapper.retrieve_instance_frames(
            study_instance_uid, series_instance_uid, sop_instance_uid,
            frame_numbers,
        )

        mime_type = TRANSFER_SYNTAX_TO_MIME.get(transfer_syntax_uid, "application/octet-stream")
        boundary = f"BOUNDARY_{uuid.uuid4()}"

        def multipart_generator():
            """Yield multipart parts as each frame arrives from Volumes."""
            for idx, frame_data in enumerate(frame_stream):
                logger.info(
                    f"Frame {idx + 1}: {len(frame_data)} bytes, "
                    f"first 4 bytes: {frame_data[:4].hex() if len(frame_data) >= 4 else 'N/A'}"
                )
                part_header = (
                    f"--{boundary}\r\n"
                    f"Content-Type: {mime_type};transfer-syntax={transfer_syntax_uid}\r\n\r\n"
                )
                yield part_header.encode() + frame_data + b"\r\n"
            yield f"--{boundary}--\r\n".encode()

        return StreamingResponse(
            multipart_generator(),
            media_type=f"multipart/related; type={mime_type}; boundary={boundary}",
            headers={"Cache-Control": "private, max-age=3600"},
        )
    except Exception:
        logger.error("Error retrieving frames", exc_info=True)
        raise


# ---------------------------------------------------------------------------
# WADO-URI handler (legacy query-parameter style)
# ---------------------------------------------------------------------------

@timing_decorator
def dicomweb_wado_uri(request: Request) -> StreamingResponse | Response:
    """
    WADO-URI endpoint — legacy query-parameter object retrieval.

    Spec reference: DICOM PS3.18 §6.2
    https://dicom.nema.org/medical/dicom/current/output/chtml/part18/sect_6.2.html

    Required query parameters::

        requestType=WADO
        studyUID=<Study Instance UID>
        seriesUID=<Series Instance UID>
        objectUID=<SOP Instance UID>

    Optional query parameters::

        contentType   — ``application/dicom`` (default) returns the raw
                        DICOM Part-10 file.  Other values (e.g.
                        ``image/jpeg``, ``image/png``) are **not yet
                        supported** and will return 406.
        frameNumber   — 1-indexed frame number.  When provided, only that
                        single frame is returned (multipart response,
                        same as WADO-RS frames).
        transferSyntax — requested Transfer Syntax UID (informational;
                         the file is returned as-is).

    Example request::

        GET /api/dicomweb/wado?requestType=WADO
            &studyUID=1.2.3
            &seriesUID=1.2.3.4
            &objectUID=1.2.3.4.5
            &contentType=application%2Fdicom

    Returns:
        ``StreamingResponse`` with the DICOM file, or a single-frame
        multipart response when ``frameNumber`` is specified.
    """
    params = dict(request.query_params)

    # ── Validate requestType ────────────────────────────────────────
    request_type = params.get("requestType", "")
    if request_type.upper() != "WADO":
        raise HTTPException(
            status_code=400,
            detail=(
                f"Invalid or missing requestType: '{request_type}'. "
                "WADO-URI requires requestType=WADO"
            ),
        )

    # ── Required UIDs ───────────────────────────────────────────────
    study_uid = params.get("studyUID")
    series_uid = params.get("seriesUID")
    object_uid = params.get("objectUID")

    if not study_uid or not object_uid:
        raise HTTPException(
            status_code=400,
            detail="WADO-URI requires at least studyUID and objectUID query parameters",
        )

    # seriesUID is technically optional in the spec but most
    # implementations require it.  We need it for our SQL queries.
    if not series_uid:
        raise HTTPException(
            status_code=400,
            detail="seriesUID is required by this server",
        )

    # ── Content type negotiation ────────────────────────────────────
    content_type = params.get("contentType", "application/dicom")
    if content_type not in ("application/dicom", "application/dicom;", "*/*"):
        raise HTTPException(
            status_code=406,
            detail=(
                f"Unsupported contentType: '{content_type}'. "
                "Only application/dicom is supported."
            ),
        )

    logger.info(
        f"WADO-URI: study={study_uid}, series={series_uid}, "
        f"object={object_uid}, contentType={content_type}"
    )

    wrapper = get_dicomweb_wrapper(request)

    # ── Optional frameNumber → delegate to frame retrieval ──────────
    frame_number_str = params.get("frameNumber")
    if frame_number_str:
        try:
            frame_number = int(frame_number_str)
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid frameNumber: '{frame_number_str}'",
            )

        logger.info(f"WADO-URI: frame {frame_number} requested")

        frame_stream, transfer_syntax_uid = wrapper.retrieve_instance_frames(
            study_uid, series_uid, object_uid, [frame_number],
        )

        mime_type = TRANSFER_SYNTAX_TO_MIME.get(
            transfer_syntax_uid, "application/octet-stream",
        )
        boundary = f"BOUNDARY_{uuid.uuid4()}"

        def single_frame_generator():
            for frame_data in frame_stream:
                part_header = (
                    f"--{boundary}\r\n"
                    f"Content-Type: {mime_type};"
                    f"transfer-syntax={transfer_syntax_uid}\r\n\r\n"
                )
                yield part_header.encode() + frame_data + b"\r\n"
            yield f"--{boundary}--\r\n".encode()

        return StreamingResponse(
            single_frame_generator(),
            media_type=(
                f"multipart/related; type={mime_type}; boundary={boundary}"
            ),
            headers={"Cache-Control": "private, max-age=3600"},
        )

    # ── Full instance retrieval (default) ───────────────────────────
    stream, content_length = wrapper.retrieve_instance(
        study_uid, series_uid, object_uid,
    )
    headers: dict[str, str] = {"Cache-Control": "private, max-age=3600"}
    if content_length:
        headers["Content-Length"] = content_length
    return StreamingResponse(
        stream, media_type="application/dicom", headers=headers,
    )


# ---------------------------------------------------------------------------
# STOW-RS handler — lightweight stream-to-Volumes proxy
# ---------------------------------------------------------------------------
#
# The server does ZERO DICOM processing.  It simply:
#   1. Splits the multipart/related body on the boundary.
#   2. PUTs each part directly into the Volumes landing zone via the
#      persistent HTTP session (connection-pooled, no SDK overhead).
#   3. Inserts tracking rows into a Delta table (stow_operations) for
#      auditing and as the input queue for the Spark processing job.
#   4. Triggers a serverless Spark job with run-coalescing (at most one
#      running + one queued).
#   5. Returns a minimal JSON receipt to the caller.
#
# All heavy lifting (metadata extraction, catalog INSERT, lakebase sync)
# is offloaded to the Spark job.
# ---------------------------------------------------------------------------

from .dicom_io import async_stream_to_volumes
from .queries import build_stow_insert_query

# ── Resolve user email: proxy header → SCIM /Me fallback (cached) ──────────
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


# ── STOW config (derived from env vars at module load time) ────────────────
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

# ── Background thread pool for fire-and-forget tracking + job trigger ──────
_stow_bg_pool = concurrent.futures.ThreadPoolExecutor(
    max_workers=2, thread_name_prefix="stow-bg",
)


def _write_stow_records(
    sql_client: DatabricksSQLClient,
    token: str | None,
    records: list[dict],
) -> None:
    """
    INSERT tracking rows into ``stow_operations``.

    Runs in the background pool so the handler can return immediately.
    Uses parameterized queries via :func:`build_stow_insert_query`.
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


# ── Job-name resolution cache (name → id, looked up once) ─────────────────
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


def _trigger_stow_job(token: str) -> None:
    """
    Trigger the STOW processing Spark job with **run coalescing**.

    * 0 active runs → trigger (starts immediately)
    * 1 active run  → trigger (queues behind the running one)
    * 2+ active     → skip  (running + queued already covers it)

    The job is looked up by name: ``<DATABRICKS_APP_NAME>_stow_processor``.
    Silently skips if the app name is not set or the job doesn't exist.
    """
    host = (
        os.environ.get("DATABRICKS_HOST", "")
        .replace("https://", "")
        .replace("http://", "")
        .rstrip("/")
    )
    if not host:
        return

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    job_id = _resolve_stow_job_id(host, headers)
    if not job_id:
        return

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
            logger.info(
                f"STOW-RS: job {job_id} already has {active_count} active runs "
                f"(running + queued) — skipping trigger"
            )
            return

        # ── Fire run-now with notebook_params ─────────────────────────
        run_now_url = f"https://{host}/api/2.1/jobs/run-now"
        run_payload: dict = {"job_id": job_id}

        # Pass catalog_table and volume so the notebook knows where
        # to read stow_operations and where to write catalog entries.
        if _stow_catalog_table or _stow_volume_uc:
            nb_params: dict[str, str] = {}
            if _stow_catalog_table:
                nb_params["catalog_table"] = _stow_catalog_table
            if _stow_volume_uc:
                nb_params["volume"] = _stow_volume_uc
            run_payload["notebook_params"] = nb_params

        resp = _requests.post(
            run_now_url,
            headers=headers,
            json=run_payload,
            timeout=10,
        )
        if resp.ok:
            run_id = resp.json().get("run_id", "?")
            action = "triggered" if active_count == 0 else "queued"
            logger.info(f"STOW-RS: {action} job {job_id}, run_id={run_id}")
        else:
            logger.warning(
                f"STOW-RS: job trigger failed (HTTP {resp.status_code}): "
                f"{resp.text[:300]}"
            )
    except Exception as exc:
        logger.error(f"STOW-RS: job trigger error: {exc}")


def _stow_background_tasks(
    sql_client: DatabricksSQLClient,
    token: str | None,
    records: list[dict],
) -> None:
    """Combined background task: write tracking records + trigger job."""
    _write_stow_records(sql_client, token, records)
    if token:
        _trigger_stow_job(token)


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

    The handler is deliberately **paper-thin**:

    1. Streams the entire multipart body as-is to a temp file on Volumes
       (``<stow_base>/<uuid>.mpr``).
    2. Inserts **one** tracking row into the ``stow_operations`` Delta
       table (background) and triggers the Spark job.

    The serverless Spark job (``<app_name>_stow_processor``) then:

    * Opens the temp file.
    * Parses the multipart body, splits into individual DICOMs.
    * Extracts DICOM metadata via ``pydicom``.
    * Saves each part to its final location on Volumes.
    * Registers paths + metadata in the catalog table.
    * MERGEs the status back to ``stow_operations``.

    Returns:
        202 Accepted — body streamed to landing zone successfully.
        400 Bad Request — invalid Content-Type.
        500 Internal Server Error — upload failed.
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
        raise HTTPException(
            status_code=500,
            detail="DATABRICKS_STOW_VOLUME_PATH not configured",
        )

    # ── Auth token (reuse app/user resolution already in place) ────────
    token = (
        _resolve_user_token(request) if USE_USER_AUTH else _app_token_provider()
    )

    # ── Stream entire body to a single temp file ───────────────────────
    file_id = uuid.uuid4().hex
    dest_path = f"{stow_base}/{file_id}.mpr"  # multipart-related bundle
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
        logger.error(f"STOW-RS: streaming upload failed for {file_id}: {exc}")
        raise HTTPException(
            status_code=500,
            detail=f"Upload failed: {exc}",
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
        "content_type": content_type,  # full multipart/related; boundary=…
        "client_ip": client_ip,
        "user_email": user_email,
        "user_agent": user_agent,
    }

    # ── Fire-and-forget: tracking INSERT + Spark job trigger ───────────
    sql_client = _get_sql_client()
    _stow_bg_pool.submit(
        _stow_background_tasks, sql_client, token, [record],
    )

    # ── Minimal receipt ────────────────────────────────────────────────
    receipt = {
        "file_id": file_id,
        "path": dest_path,
        "size": file_size,
        "status": "accepted",
        "content_type": content_type,
        "study_constraint": study_instance_uid,
    }

    logger.info(f"STOW-RS complete: {file_id} accepted ({file_size} bytes)")
    return Response(
        content=json.dumps(receipt, indent=2),
        status_code=202,
        media_type="application/json",
    )


# ---------------------------------------------------------------------------
# Path resolution handler
# ---------------------------------------------------------------------------

@timing_decorator
async def dicomweb_resolve_paths(request: Request) -> Response:
    """POST /api/dicomweb/resolve_paths — resolve file paths for a series.

    Request body (JSON)::

        {
            "studyInstanceUID": "1.2.840.113619...",
            "seriesInstanceUID": "1.2.840.113619..."
        }

    Response body (JSON)::

        {
            "paths": {
                "1.2.840.113619.SOP1": "/Volumes/catalog/schema/volume/path/to/file1.dcm",
                "1.2.840.113619.SOP2": "/Volumes/catalog/schema/volume/path/to/file2.dcm"
            }
        }
    """
    body = await request.json()

    study_uid = body.get("studyInstanceUID")
    series_uid = body.get("seriesInstanceUID")

    if not study_uid or not series_uid:
        raise HTTPException(
            status_code=400,
            detail="Both 'studyInstanceUID' and 'seriesInstanceUID' are required",
        )

    wrapper = get_dicomweb_wrapper(request)
    paths = wrapper.resolve_instance_paths(study_uid, series_uid)

    return Response(
        content=json.dumps({"paths": paths}, indent=2),
        media_type="application/json",
    )
