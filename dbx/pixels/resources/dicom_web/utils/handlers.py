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

import json
import os
import tempfile
import uuid
from collections.abc import AsyncIterator

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
    """
    global _app_cfg, _app_header_factory
    if _app_cfg is None:
        _app_cfg = Config()
        _app_header_factory = _app_cfg.authenticate()
    headers = _app_header_factory() if callable(_app_header_factory) else _app_header_factory
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


# ---------------------------------------------------------------------------
# STOW-RS handler
# ---------------------------------------------------------------------------

# ---------------------------------------------------------------------------
# Streaming multipart/related parser
# ---------------------------------------------------------------------------
# Small parts (≤ _SPILL_THRESHOLD) stay in RAM; larger ones spill to a
# temporary file on disk transparently via ``SpooledTemporaryFile``.
# This keeps peak heap usage at ~2 × _SPILL_THRESHOLD regardless of
# how many or how large the DICOM instances are.

_SPILL_THRESHOLD = 5 * 1024 * 1024  # 5 MB — spill to disk above this


def _extract_boundary(content_type: str) -> str:
    """Extract the MIME boundary string from a ``Content-Type`` header.

    Raises:
        HTTPException 400: If the boundary parameter is missing.
    """
    for segment in content_type.split(";"):
        segment = segment.strip()
        if segment.lower().startswith("boundary="):
            return segment.split("=", 1)[1].strip().strip('"')
    raise HTTPException(
        status_code=400,
        detail="Missing boundary in multipart/related Content-Type",
    )


async def _parse_multipart_streaming(
    body_stream: AsyncIterator[bytes],
    boundary: str,
) -> tuple[list[tempfile.SpooledTemporaryFile], int]:
    """
    Stream-parse a ``multipart/related`` request body.

    Reads chunks from *body_stream* (``request.stream()``), detects
    MIME boundary markers incrementally, and writes each part's raw
    binary content to its own ``SpooledTemporaryFile``.

    * Parts ≤ 5 MB stay entirely in RAM (fast path for small DICOMs).
    * Larger parts spill to a temporary file on disk, so a 175 MB
      instance only occupies ~1 MB of heap during parsing.

    Args:
        body_stream: Async iterator of raw request body chunks
            (from ``request.stream()``).
        boundary: The MIME boundary string (without ``--`` prefix).

    Returns:
        ``(part_files, total_bytes_received)`` — a list of open
        ``SpooledTemporaryFile`` objects seeked to position 0, and
        the total number of bytes read from the stream.
        **Caller must close every file.**

    Raises:
        HTTPException 400: If no DICOM parts are found.
    """
    # The interior/closing boundary in the wire format is always preceded
    # by CRLF.  The *first* boundary has no leading CRLF.
    first_delim = f"--{boundary}".encode()
    delim = b"\r\n" + first_delim  # interior boundary marker
    delim_len = len(delim)

    parts: list[tempfile.SpooledTemporaryFile] = []
    buf = bytearray()
    total_bytes = 0

    # Parser state: "preamble" → "headers" → "body" → "headers" → …
    state = "preamble"
    current: tempfile.SpooledTemporaryFile | None = None

    async for chunk in body_stream:
        total_bytes += len(chunk)
        buf.extend(chunk)

        # Process as much of the buffer as possible in each iteration.
        while True:
            # ── Skip everything before the first boundary ─────────
            if state == "preamble":
                idx = buf.find(first_delim)
                if idx == -1:
                    # Keep tail in case boundary spans chunks
                    if len(buf) > len(first_delim):
                        del buf[: len(buf) - len(first_delim)]
                    break
                del buf[: idx + len(first_delim)]
                # After the boundary: \r\n → next part, -- → closing
                if len(buf) < 2:
                    break  # need more data
                if buf[:2] == b"--":
                    state = "done"
                    break
                if buf[:2] == b"\r\n":
                    del buf[:2]
                state = "headers"
                continue

            # ── Parse (and discard) per-part MIME headers ─────────
            if state == "headers":
                idx = buf.find(b"\r\n\r\n")
                if idx == -1:
                    break  # need more data
                del buf[: idx + 4]
                current = tempfile.SpooledTemporaryFile(
                    max_size=_SPILL_THRESHOLD,
                )
                parts.append(current)
                state = "body"
                continue

            # ── Stream body bytes to the current temp file ────────
            if state == "body":
                idx = buf.find(delim)
                if idx != -1:
                    # Write everything before the boundary
                    if current is not None and idx > 0:
                        current.write(bytes(buf[:idx]))
                    if current is not None:
                        current.seek(0)
                    # Consume boundary
                    del buf[: idx + delim_len]
                    # Check closing vs. next part
                    if len(buf) >= 2 and buf[:2] == b"--":
                        state = "done"
                        break
                    if len(buf) >= 2 and buf[:2] == b"\r\n":
                        del buf[:2]
                    state = "headers"
                    current = None
                    continue

                # No boundary yet — flush safe prefix (keep tail
                # long enough that a split boundary is not missed).
                safe = len(buf) - delim_len
                if safe > 0 and current is not None:
                    current.write(bytes(buf[:safe]))
                    del buf[:safe]
                break  # need more data

            break  # state == "done"

    # Flush any trailing bytes in the buffer to the last part
    if state == "body" and current is not None and buf:
        current.write(bytes(buf))
        current.seek(0)

    if not parts:
        raise HTTPException(
            status_code=400,
            detail="No DICOM parts found in multipart/related body",
        )

    return parts, total_bytes


def _build_stow_response(
    result: dict,
    base_url: str,
    study_instance_uid: str | None = None,
) -> dict:
    """
    Build the STOW-RS response dataset (DICOM JSON format).

    The response contains:

    * ``00081190`` — **RetrieveURL** (base WADO-RS URL for the study)
    * ``00081199`` — **ReferencedSOPSequence** (successfully stored instances)
    * ``00081198`` — **FailedSOPSequence** (rejected instances with failure reasons)

    See DICOM PS3.18 §10.5.1 (Store Instances Response).
    """
    response: dict = {}

    # ReferencedSOPSequence
    if result["referenced"]:
        ref_items = []
        for ref in result["referenced"]:
            item: dict = {
                # ReferencedSOPClassUID
                "00081150": {"vr": "UI", "Value": [ref["sop_class_uid"]]},
                # ReferencedSOPInstanceUID
                "00081155": {"vr": "UI", "Value": [ref["sop_instance_uid"]]},
            }
            # Per-instance RetrieveURL
            study_uid = ref.get("study_instance_uid", study_instance_uid or "")
            if study_uid and base_url:
                item["00081190"] = {
                    "vr": "UR",
                    "Value": [f"{base_url}/studies/{study_uid}"],
                }
            ref_items.append(item)
        response["00081199"] = {"vr": "SQ", "Value": ref_items}

    # FailedSOPSequence
    if result["failed"]:
        fail_items = []
        for fail in result["failed"]:
            item = {
                # ReferencedSOPClassUID
                "00081150": {"vr": "UI", "Value": [fail.get("sop_class_uid", "")]},
                # ReferencedSOPInstanceUID
                "00081155": {"vr": "UI", "Value": [fail.get("sop_instance_uid", "")]},
                # FailureReason
                "00081197": {"vr": "US", "Value": [int(fail.get("failure_reason", "0110"), 16)]},
            }
            fail_items.append(item)
        response["00081198"] = {"vr": "SQ", "Value": fail_items}

    # Top-level RetrieveURL (study level)
    if result["referenced"] and base_url:
        # Use the first successfully stored instance's study UID
        first_study_uid = (
            study_instance_uid
            or result["referenced"][0].get("study_instance_uid", "")
        )
        if first_study_uid:
            response["00081190"] = {
                "vr": "UR",
                "Value": [f"{base_url}/studies/{first_study_uid}"],
            }

    return response


@timing_decorator
async def dicomweb_stow_store(
    request: Request,
    study_instance_uid: str | None = None,
) -> Response:
    """
    STOW-RS: store DICOM instances (**streaming pipeline**).

    Accepts ``POST /api/dicomweb/studies`` (any study) or
    ``POST /api/dicomweb/studies/{study}`` (specific study).

    Request body must be ``multipart/related; type="application/dicom"``
    containing one or more DICOM Part-10 instances.

    The request body is **never fully buffered in memory**.  Instead it
    is parsed incrementally via ``request.stream()`` and each DICOM part
    is written to a ``SpooledTemporaryFile`` (in-RAM for ≤ 5 MB, on-disk
    for larger files).  This keeps peak heap usage at a few MB even for
    175 MB+ uploads.

    Returns:
        * **200 OK** — all instances stored successfully.
        * **409 Conflict** — partial success (some stored, some failed).
        * **400 Bad Request** — invalid request body.

    Response body is ``application/dicom+json`` containing the
    ``ReferencedSOPSequence`` and ``FailedSOPSequence``.
    """
    content_type = request.headers.get("content-type", "")

    # Validate Content-Type
    ct_lower = content_type.lower()
    if "multipart/related" not in ct_lower:
        raise HTTPException(
            status_code=415,
            detail=(
                f"Unsupported Content-Type: '{content_type}'. "
                "STOW-RS requires multipart/related; type=\"application/dicom\""
            ),
        )

    # Extract boundary (validates presence)
    boundary = _extract_boundary(content_type)

    # ── Stream-parse multipart body into temp files ───────────────
    part_files, total_bytes = await _parse_multipart_streaming(
        request.stream(), boundary,
    )

    if total_bytes == 0:
        raise HTTPException(status_code=400, detail="Empty request body")

    logger.info(
        f"STOW-RS: received {total_bytes} bytes (streamed), "
        f"Content-Type: {content_type}, "
        f"study_constraint: {study_instance_uid or '(any)'}"
    )
    logger.info(f"STOW-RS: parsed {len(part_files)} DICOM part(s)")

    # ── Store via wrapper (files are seeked to 0) ─────────────────
    try:
        wrapper = get_dicomweb_wrapper(request)
        result = wrapper.store_instances(part_files, study_instance_uid)
    finally:
        # Always close temp files (releases disk / memory)
        for f in part_files:
            try:
                f.close()
            except Exception:
                pass

    # Build response
    base_url = str(request.base_url).rstrip("/") + "/api/dicomweb"
    response_body = _build_stow_response(result, base_url, study_instance_uid)

    # HTTP status: 200 if all succeeded, 409 if partial failure
    if result["failed"] and result["referenced"]:
        status_code = 409  # Conflict — partial success
    elif result["failed"]:
        status_code = 409  # All failed
    else:
        status_code = 200  # All succeeded

    return Response(
        content=json.dumps(response_body, indent=2),
        media_type="application/dicom+json",
        status_code=status_code,
    )
