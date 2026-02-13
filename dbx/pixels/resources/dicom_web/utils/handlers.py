"""
FastAPI endpoint handlers for DICOMweb QIDO-RS / WADO-RS / WADO-URI / STOW-RS.

These thin handler functions are imported by ``app.py`` and wired to routes.
They create a ``DICOMwebDatabricksWrapper`` per request and delegate to it.

Supported services:

* **QIDO-RS** — RESTful study/series/instance search
* **WADO-RS** — RESTful instance / frame retrieval (path-based)
* **WADO-URI** — Legacy query-parameter retrieval
  (``?requestType=WADO&studyUID=…&objectUID=…&contentType=…``)
* **STOW-RS** — RESTful instance storage (binary DICOM via multipart/related)

Authorization is controlled by the ``DICOMWEB_USE_USER_AUTH`` env var:

* **false** (default) — App authorization.  SQL queries use the service
  principal credentials managed by the Databricks SDK ``Config``.
* **true** — User (OBO) authorization.  The ``X-Forwarded-Access-Token``
  header is forwarded to the SQL Connector so every query runs with the
  end-user's Unity Catalog permissions.

See: https://docs.databricks.com/aws/en/dev-tools/databricks-apps/auth
"""

import json
import os
import uuid

from databricks.sdk.core import Config
from fastapi import HTTPException, Request, Response
from fastapi.responses import StreamingResponse

from dbx.pixels.lakebase import LakebaseUtils
from dbx.pixels.logging import LoggerProvider

from . import timing_decorator
from .dicom_tags import TRANSFER_SYNTAX_TO_MIME
from .sql_client import USE_USER_AUTH, DatabricksSQLClient
from .wrapper import DICOMwebDatabricksWrapper

logger = LoggerProvider("DICOMweb.Handlers")

# ---------------------------------------------------------------------------
# Lakebase singleton (persistent tier-2 cache for frame offsets + instance paths)
# ---------------------------------------------------------------------------

lb_utils = None
if "LAKEBASE_INSTANCE_NAME" in os.environ:
    try:
        from pathlib import Path

        # dbx.pixels.resources is a namespace package (__file__ is None).
        # Locate the SQL directory relative to lakebase.py which always
        # has a concrete __file__.
        import dbx.pixels.lakebase as _lb_mod

        _sql_dir = Path(_lb_mod.__file__).parent / "resources" / "sql" / "lakebase"

        lb_utils = LakebaseUtils(
            instance_name=os.environ["LAKEBASE_INSTANCE_NAME"],
            create_instance=True,
        )
        if os.environ.get("LAKEBASE_INIT_DB", "").lower() in ("1", "true", "yes"):
            for sql_file in [
                "CREATE_LAKEBASE_SCHEMA.sql",
                "CREATE_LAKEBASE_DICOM_FRAMES.sql",
                "CREATE_LAKEBASE_INSTANCE_PATHS.sql",
            ]:
                with open(_sql_dir / sql_file) as fh:
                    lb_utils.execute_query(fh.read())
            logger.info(f"Lakebase schema initialised: {os.environ['LAKEBASE_INSTANCE_NAME']}")
        else:
            logger.info(f"Lakebase connected (schema init skipped): {os.environ['LAKEBASE_INSTANCE_NAME']}")
    except Exception as exc:
        logger.warning(f"Lakebase init failed: {exc}")
else:
    logger.warning("LAKEBASE_INSTANCE_NAME not configured, tier-2 caching disabled")


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

def _resolve_token(request: Request) -> str:
    """
    Resolve a bearer token from the **same** auth source used for SQL.

    * **User auth (OBO)** — ``X-Forwarded-Access-Token`` forwarded by the
      Databricks Apps proxy.
    * **App auth** — token derived from the SDK ``Config().authenticate()``
      (service principal credentials).

    Both SQL queries and file-API byte-range reads share this single token.
    """
    if USE_USER_AUTH:
        token = request.headers.get("X-Forwarded-Access-Token")
        if not token:
            raise HTTPException(
                status_code=401,
                detail="User authorization (OBO) is enabled but no "
                       "X-Forwarded-Access-Token header was found",
            )
        return token

    # App auth — derive a bearer token from the SDK Config
    # (same credentials_provider the SQL Connector uses internally)
    #
    # cfg.authenticate() returns a HeaderFactory (callable).
    # Calling that factory returns {"Authorization": "Bearer <token>"}.
    try:
        cfg = Config()
        header_factory = cfg.authenticate()
        # HeaderFactory is Callable[[], Dict[str, str]]
        headers = header_factory() if callable(header_factory) else header_factory
        auth = headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            return auth[7:]
        raise ValueError("SDK Config did not produce a Bearer token")
    except Exception as exc:
        logger.error(f"App-auth token resolution failed: {exc}")
        raise HTTPException(
            status_code=500,
            detail=f"Could not derive app authorization token from SDK Config: {exc}",
        )


# ---------------------------------------------------------------------------
# Wrapper factory
# ---------------------------------------------------------------------------

def get_dicomweb_wrapper(request: Request, pixels_table: str | None = None) -> DICOMwebDatabricksWrapper:
    """Create a ``DICOMwebDatabricksWrapper`` from the incoming request context."""
    sql_client = _get_sql_client()
    token = _resolve_token(request)

    if not pixels_table:
        pixels_table = request.cookies.get("pixels_table") or os.getenv("DATABRICKS_PIXELS_TABLE")
    if not pixels_table:
        raise HTTPException(status_code=500, detail="DATABRICKS_PIXELS_TABLE not configured")

    return DICOMwebDatabricksWrapper(
        sql_client=sql_client,
        token=token,
        pixels_table=pixels_table,
        lb_utils=lb_utils,
    )


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
) -> Response:
    """GET /api/dicomweb/studies/{study}/series/{series}/metadata"""
    wrapper = get_dicomweb_wrapper(request)
    results = wrapper.retrieve_series_metadata(study_instance_uid, series_instance_uid)
    return Response(content=json.dumps(results, indent=2), media_type="application/dicom+json")


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

def _parse_multipart_related(body: bytes, content_type: str) -> list[bytes]:
    """
    Parse a ``multipart/related`` request body into its binary parts.

    The STOW-RS spec mandates ``multipart/related`` (not ``multipart/form-data``),
    so we parse it manually using boundary splitting.

    Args:
        body: Raw request body bytes.
        content_type: The full ``Content-Type`` header value.

    Returns:
        List of raw DICOM Part-10 byte strings (one per part).

    Raises:
        HTTPException 400: If the boundary is missing or no parts are found.
    """
    # Extract boundary from Content-Type
    boundary: str | None = None
    for segment in content_type.split(";"):
        segment = segment.strip()
        if segment.lower().startswith("boundary="):
            boundary = segment.split("=", 1)[1].strip().strip('"')
            break

    if not boundary:
        raise HTTPException(
            status_code=400,
            detail="Missing boundary in multipart/related Content-Type",
        )

    # The boundary marker in the body is prefixed with "--"
    delimiter = f"--{boundary}".encode()
    closing = f"--{boundary}--".encode()

    # Split body on delimiter
    raw_parts = body.split(delimiter)
    parts: list[bytes] = []

    for raw_part in raw_parts:
        # Skip preamble (before first delimiter) and closing marker
        stripped = raw_part.strip(b"\r\n")
        if not stripped or stripped == b"--" or stripped.startswith(closing):
            continue

        # Each part: headers \r\n\r\n body
        header_end = raw_part.find(b"\r\n\r\n")
        if header_end == -1:
            continue

        part_body = raw_part[header_end + 4 :]

        # Strip trailing \r\n (MIME boundary padding)
        if part_body.endswith(b"\r\n"):
            part_body = part_body[:-2]
        # Also handle trailing "--\r\n" from the closing boundary
        if part_body.endswith(b"--"):
            part_body = part_body[:-2]
            if part_body.endswith(b"\r\n"):
                part_body = part_body[:-2]

        if part_body:
            parts.append(part_body)

    if not parts:
        raise HTTPException(
            status_code=400,
            detail="No DICOM parts found in multipart/related body",
        )

    return parts


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
    STOW-RS: store DICOM instances.

    Accepts ``POST /api/dicomweb/studies`` (any study) or
    ``POST /api/dicomweb/studies/{study}`` (specific study).

    Request body must be ``multipart/related; type="application/dicom"``
    containing one or more DICOM Part-10 instances.

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

    # Read full body
    body = await request.body()
    if not body:
        raise HTTPException(status_code=400, detail="Empty request body")

    logger.info(
        f"STOW-RS: received {len(body)} bytes, "
        f"Content-Type: {content_type}, "
        f"study_constraint: {study_instance_uid or '(any)'}"
    )

    # Parse multipart parts
    dicom_parts = _parse_multipart_related(body, content_type)
    logger.info(f"STOW-RS: parsed {len(dicom_parts)} DICOM part(s)")

    # Store via wrapper
    wrapper = get_dicomweb_wrapper(request)
    result = wrapper.store_instances(dicom_parts, study_instance_uid)

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
