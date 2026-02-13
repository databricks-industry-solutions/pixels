"""
FastAPI endpoint handlers for DICOMweb QIDO-RS / WADO-RS.

These thin handler functions are imported by ``app.py`` and wired to routes.
They create a ``DICOMwebDatabricksWrapper`` per request and delegate to it.

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
        for sql_file in [
            "CREATE_LAKEBASE_SCHEMA.sql",
            "CREATE_LAKEBASE_DICOM_FRAMES.sql",
            "CREATE_LAKEBASE_INSTANCE_PATHS.sql",
        ]:
            with open(_sql_dir / sql_file) as fh:
                lb_utils.execute_query(fh.read())
        logger.info(f"Lakebase initialised: {os.environ['LAKEBASE_INSTANCE_NAME']}")
    except Exception as exc:
        logger.warning(f"Lakebase init failed: {exc}")


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
