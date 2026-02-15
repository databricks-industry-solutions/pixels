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
# STOW-RS handler
# ---------------------------------------------------------------------------


async def dicomweb_stow_studies(
    request: Request,
    study_instance_uid: str | None = None,
) -> Response:
    """
    POST /api/dicomweb/studies — STOW-RS store DICOM instances.

    Accepts a ``multipart/related`` request body where each part is a
    raw DICOM Part 10 file (``Content-Type: application/dicom``).

    Two URL forms per the DICOMweb spec:

    * ``POST /studies`` — store to any study
    * ``POST /studies/{study}`` — constrain all parts to one study UID

    **Pipeline** (mirrors enterprise PACS "fire-and-forget"):

    1. Parse the multipart body into individual DICOM binary blobs.
    2. Upload each blob to Databricks Volumes (the "landing zone").
    3. Return a DICOMweb-compliant JSON response with per-instance status.
    4. Index metadata into the SQL catalog table **in the background**.

    The client gets a response as soon as all files are safely stored in
    Volumes.  Metadata indexing runs asynchronously so the study becomes
    searchable via QIDO-RS within seconds.

    Returns:
        200 OK — all instances stored successfully.
        202 Accepted — partial success (some instances failed).
        400 Bad Request — invalid Content-Type or no parts found.
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

    # ── Extract boundary ───────────────────────────────────────────────
    boundary = _extract_boundary(content_type)
    if not boundary:
        raise HTTPException(
            status_code=400,
            detail="Missing or invalid boundary in Content-Type header",
        )

    # ── Read and parse multipart body ──────────────────────────────────
    body = await request.body()
    logger.info(
        f"STOW-RS: received {len(body)} bytes, "
        f"study_constraint={study_instance_uid or 'none'}"
    )

    parts = _parse_multipart_related(body, boundary)
    if not parts:
        raise HTTPException(
            status_code=400,
            detail="No DICOM parts found in the multipart body",
        )

    logger.info(f"STOW-RS: parsed {len(parts)} part(s)")

    # ── Delegate to wrapper ────────────────────────────────────────────
    wrapper = get_dicomweb_wrapper(request)
    result = wrapper.store_instances(parts, study_instance_uid)

    # ── Build DICOMweb response ────────────────────────────────────────
    response_json = _build_stow_response_json(request, result)
    status_code = 200 if not result["failed"] else 202

    return Response(
        content=json.dumps(response_json, indent=2),
        status_code=status_code,
        media_type="application/dicom+json",
    )


# ---------------------------------------------------------------------------
# STOW-RS helpers — multipart parsing + response building
# ---------------------------------------------------------------------------


def _extract_boundary(content_type: str) -> str | None:
    """Extract the ``boundary`` parameter from a Content-Type header."""
    for part in content_type.split(";"):
        part = part.strip()
        if part.lower().startswith("boundary="):
            boundary = part.split("=", 1)[1].strip().strip('"')
            return boundary
    return None


def _parse_multipart_related(
    body: bytes, boundary: str,
) -> list[tuple[bytes, str]]:
    """
    Parse a ``multipart/related`` body into ``(content, content_type)`` parts.

    Each DICOM Part 10 file is returned as raw bytes alongside its
    declared Content-Type.  Binary-safe — splits on the boundary
    delimiter bytes, not text.
    """
    delimiter = f"--{boundary}".encode()

    parts: list[tuple[bytes, str]] = []
    segments = body.split(delimiter)

    for segment in segments:
        # Skip preamble (before first boundary) and epilogue (after closing --)
        if not segment or segment.strip() in (b"", b"--", b"--\r\n"):
            continue

        # Remove leading \r\n after the boundary line
        if segment.startswith(b"\r\n"):
            segment = segment[2:]

        # Find the header / body separator
        sep = segment.find(b"\r\n\r\n")
        if sep == -1:
            continue

        headers_raw = segment[:sep].decode("utf-8", errors="replace")
        body_data = segment[sep + 4:]

        # Remove trailing \r\n (before next boundary)
        if body_data.endswith(b"\r\n"):
            body_data = body_data[:-2]

        # Parse Content-Type from part headers
        ct = "application/dicom"
        for line in headers_raw.split("\r\n"):
            if line.lower().startswith("content-type:"):
                ct = line.split(":", 1)[1].strip()

        if body_data:
            parts.append((body_data, ct))

    return parts


def _build_stow_response_json(request: Request, result: dict) -> dict:
    """
    Build a DICOMweb-compliant STOW-RS JSON response.

    Tags used (per DICOM PS3.18 §10.5):

    * ``00081190`` — RetrieveURL
    * ``00081199`` — ReferencedSOPSequence (successful instances)
    * ``00081198`` — FailedSOPSequence (failed instances)
    * ``00081150`` — ReferencedSOPClassUID
    * ``00081155`` — ReferencedSOPInstanceUID
    * ``00081197`` — FailureReason
    """
    base_url = str(request.base_url).rstrip("/")
    dicomweb_root = f"{base_url}/api/dicomweb"

    response: dict = {}

    # ── Successful instances ───────────────────────────────────────────
    if result["stored"]:
        referenced_sop_seq = []
        for inst in result["stored"]:
            retrieve_url = (
                f"{dicomweb_root}/studies/{inst['study_instance_uid']}"
                f"/series/{inst['series_instance_uid']}"
                f"/instances/{inst['sop_instance_uid']}"
            )
            item = {
                "00081150": {"vr": "UI", "Value": [inst["sop_class_uid"]]},
                "00081155": {"vr": "UI", "Value": [inst["sop_instance_uid"]]},
                "00081190": {"vr": "UR", "Value": [retrieve_url]},
            }
            referenced_sop_seq.append(item)

        # Study-level RetrieveURL (use first stored instance's study)
        first_study = result["stored"][0]["study_instance_uid"]
        response["00081190"] = {
            "vr": "UR",
            "Value": [f"{dicomweb_root}/studies/{first_study}"],
        }
        response["00081199"] = {
            "vr": "SQ",
            "Value": referenced_sop_seq,
        }

    # ── Failed instances ───────────────────────────────────────────────
    if result["failed"]:
        failed_sop_seq = []
        for inst in result["failed"]:
            item: dict = {}
            if inst.get("sop_class_uid"):
                item["00081150"] = {
                    "vr": "UI",
                    "Value": [inst["sop_class_uid"]],
                }
            if inst.get("sop_instance_uid"):
                item["00081155"] = {
                    "vr": "UI",
                    "Value": [inst["sop_instance_uid"]],
                }
            # FailureReason: 0110 hex = 272 decimal (Processing failure)
            item["00081197"] = {
                "vr": "US",
                "Value": [int(inst.get("status", "0110"), 16)],
            }
            failed_sop_seq.append(item)

        response["00081198"] = {
            "vr": "SQ",
            "Value": failed_sop_seq,
        }

    return response


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
