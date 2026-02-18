"""
DICOMweb Gateway — Databricks App that translates DICOMweb REST API
calls into Model Serving endpoint invocations.

Architecture::

    OHIF / Client  ──HTTP──▶  Gateway App  ──JSON──▶  Serving Endpoint
                              (this file)             (DICOMwebServingModel)

Every inbound DICOMweb request (QIDO-RS, WADO-RS, WADO-URI, STOW-RS)
is serialised into a compact JSON payload, sent to the serving endpoint
via the invocations API, and the response is deserialised back into
the appropriate HTTP response (correct status code, content-type,
headers, binary body).

Environment variables (set in ``app.yml``)::

    DICOMWEB_SERVING_ENDPOINT   Name of the Model Serving endpoint
    DICOMWEB_GATEWAY_TIMEOUT    Per-request timeout in seconds (default 300)
"""

import base64
import json
import logging
import os

import requests as _requests
import zstd
from databricks.sdk.core import Config
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("DICOMweb.Gateway")

# Payloads smaller than this are sent as plain base64 — the zstd frame
# header (~12 bytes) and dictionary overhead aren't worth it.
_COMPRESS_THRESHOLD = 512

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

SERVING_ENDPOINT = os.getenv("DICOMWEB_SERVING_ENDPOINT", "dicomweb-serving")
_TIMEOUT = int(os.getenv("DICOMWEB_GATEWAY_TIMEOUT", "300"))

_FORWARD_HEADERS = {
    "accept",
    "content-type",
    "x-forwarded-access-token",
    "x-forwarded-email",
    "authorization",
    "cookie",
}

# ---------------------------------------------------------------------------
# Auth — auto-refreshed via Databricks SDK Config
# ---------------------------------------------------------------------------

_cfg: Config | None = None
_header_factory = None


def _get_auth() -> tuple[str, dict]:
    """Return ``(host, auth_headers)`` for serving endpoint calls."""
    global _cfg, _header_factory
    if _cfg is None:
        _cfg = Config()
        _header_factory = _cfg.authenticate()

    headers = _header_factory() if callable(_header_factory) else _header_factory
    if headers is None:
        _cfg = None
        _header_factory = None
        raise RuntimeError("Authentication failed — could not obtain token")

    host = (_cfg.host or os.getenv("DATABRICKS_HOST", "")).rstrip("/")
    return host, headers


# ---------------------------------------------------------------------------
# Serving endpoint invocation
# ---------------------------------------------------------------------------

def _invoke_endpoint(payload: dict) -> dict:
    """
    POST a serialised HTTP request to the DICOMweb serving endpoint.

    Returns the parsed prediction result dict.
    """
    host, auth_headers = _get_auth()
    url = f"{host}/serving-endpoints/{SERVING_ENDPOINT}/invocations"

    resp = _requests.post(
        url,
        headers={**auth_headers, "Content-Type": "application/json"},
        json={"dataframe_records": [payload]},
        timeout=_TIMEOUT,
    )

    if not resp.ok:
        logger.error(
            "Serving endpoint HTTP %d: %s", resp.status_code, resp.text[:500],
        )
        return {
            "status_code": resp.status_code,
            "headers": {},
            "body_text": resp.text,
            "body": "",
            "content_type": "text/plain",
        }

    result = resp.json()
    predictions = result.get("predictions")

    if isinstance(predictions, list) and predictions:
        pred = predictions[0]
    elif isinstance(predictions, str):
        pred = predictions
    else:
        pred = str(predictions)

    if isinstance(pred, str):
        try:
            return json.loads(pred)
        except json.JSONDecodeError:
            return _text_result(pred)
    if isinstance(pred, dict):
        return pred
    return _text_result(str(pred))


def _text_result(text: str) -> dict:
    return {
        "status_code": 200,
        "headers": {},
        "body_text": text,
        "body": "",
        "content_type": "text/plain",
    }


# ---------------------------------------------------------------------------
# zstd + base64 codec (shared between request and response paths)
# ---------------------------------------------------------------------------

def _encode(data: bytes) -> tuple[str, str]:
    """Compress *data* with zstd (if above threshold) and base64-encode.

    Returns ``(encoded_string, encoding_label)``.
    """
    if not data:
        return "", "identity"
    if len(data) >= _COMPRESS_THRESHOLD:
        compressed = zstd.compress(data)
        return base64.b64encode(compressed).decode("ascii"), "zstd+base64"
    return base64.b64encode(data).decode("ascii"), "base64"


def _decode(encoded: str, encoding: str) -> bytes:
    """Reverse of :func:`_encode`."""
    if not encoded:
        return b""
    raw = base64.b64decode(encoded)
    if encoding == "zstd+base64":
        return zstd.decompress(raw)
    return raw


# ---------------------------------------------------------------------------
# Request / Response serialisation
# ---------------------------------------------------------------------------

async def _serialize_request(request: Request) -> dict:
    """Pack an incoming HTTP request into the serving-endpoint payload.

    Request bodies above ``_COMPRESS_THRESHOLD`` are zstd-compressed
    before base64-encoding to reduce the JSON payload sent to the
    serving endpoint (STOW-RS uploads benefit significantly).
    """
    headers = {
        k: v
        for k, v in request.headers.items()
        if k.lower() in _FORWARD_HEADERS
    }

    body_bytes = b""
    if request.method in ("POST", "PUT", "PATCH"):
        body_bytes = await request.body()

    body_encoded, body_encoding = _encode(body_bytes)

    return {
        "method": request.method,
        "path": request.url.path,
        "query_string": str(request.query_params),
        "headers": json.dumps(headers),
        "body": body_encoded,
        "body_encoding": body_encoding,
    }


def _deserialize_response(result: dict) -> Response:
    """Unpack a serving-endpoint result back into an HTTP ``Response``.

    Handles three ``encoding`` values produced by the model:

    * ``"zstd+base64"`` — base64-decode then zstd-decompress
    * ``"base64"``       — plain base64-decode
    * ``"identity"``     — body is empty (or a legacy ``body_text`` field)
    """
    status_code = result.get("status_code", 200)
    content_type = result.get("content_type", "application/json")
    encoding = result.get("encoding", "")

    body_raw = result.get("body", "")
    content = _decode(body_raw, encoding)

    # Legacy fallback: older model versions may use body_text
    if not content:
        body_text = result.get("body_text", "")
        if body_text:
            content = body_text.encode("utf-8")

    skip = {"transfer-encoding", "connection", "content-length", "content-encoding"}
    headers = {
        k: v
        for k, v in result.get("headers", {}).items()
        if k.lower() not in skip
    }

    return Response(
        content=content,
        status_code=status_code,
        media_type=content_type,
        headers=headers,
    )


# ---------------------------------------------------------------------------
# Core proxy function
# ---------------------------------------------------------------------------

async def _proxy(request: Request) -> Response:
    """Proxy a single DICOMweb request through the serving endpoint."""
    try:
        payload = await _serialize_request(request)
        result = _invoke_endpoint(payload)
        return _deserialize_response(result)
    except Exception as exc:
        logger.error("Gateway proxy error: %s", exc, exc_info=True)
        return JSONResponse(
            status_code=502,
            content={"error": "Gateway error", "detail": str(exc)},
        )


# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------

app = FastAPI(
    title="DICOMweb Gateway",
    description=(
        "Translates DICOMweb REST API calls to a "
        "Databricks Model Serving endpoint"
    ),
    version="1.0.0",
)


# ── QIDO-RS ──────────────────────────────────────────────────────────────

@app.get("/api/dicomweb/studies", tags=["QIDO-RS"])
async def search_studies(request: Request):
    return await _proxy(request)


@app.get("/api/dicomweb/all_series", tags=["QIDO-RS"])
async def search_all_series(request: Request):
    return await _proxy(request)


@app.get(
    "/api/dicomweb/studies/{study_uid}/series",
    tags=["QIDO-RS"],
)
async def search_series(request: Request, study_uid: str):
    return await _proxy(request)


@app.get(
    "/api/dicomweb/studies/{study_uid}/series/{series_uid}/instances",
    tags=["QIDO-RS"],
)
async def search_instances(
    request: Request, study_uid: str, series_uid: str,
):
    return await _proxy(request)


# ── WADO-RS ──────────────────────────────────────────────────────────────

@app.get(
    "/api/dicomweb/studies/{study_uid}/series/{series_uid}/metadata",
    tags=["WADO-RS"],
)
async def retrieve_series_metadata(
    request: Request, study_uid: str, series_uid: str,
):
    return await _proxy(request)


@app.get(
    "/api/dicomweb/studies/{study_uid}/series/{series_uid}"
    "/instances/{sop_uid}/frames/{frame_list}",
    tags=["WADO-RS"],
)
async def retrieve_instance_frames(
    request: Request,
    study_uid: str,
    series_uid: str,
    sop_uid: str,
    frame_list: str,
):
    return await _proxy(request)


@app.get(
    "/api/dicomweb/studies/{study_uid}/series/{series_uid}"
    "/instances/{sop_uid}",
    tags=["WADO-RS"],
)
async def retrieve_instance(
    request: Request, study_uid: str, series_uid: str, sop_uid: str,
):
    return await _proxy(request)


# ── WADO-URI (legacy) ────────────────────────────────────────────────────

@app.get("/api/dicomweb/wado", tags=["WADO-URI"])
async def wado_uri(request: Request):
    return await _proxy(request)


@app.get("/api/dicomweb", tags=["WADO-URI"])
async def wado_uri_base(request: Request):
    if request.query_params.get("requestType", "").upper() == "WADO":
        return await _proxy(request)
    return {
        "service": "DICOMweb Gateway",
        "endpoint": SERVING_ENDPOINT,
        "status": "active",
    }


# ── STOW-RS ──────────────────────────────────────────────────────────────

@app.post("/api/dicomweb/studies/{study_uid}", tags=["STOW-RS"])
async def store_instances_study(request: Request, study_uid: str):
    return await _proxy(request)


@app.post("/api/dicomweb/studies", tags=["STOW-RS"])
async def store_instances(request: Request):
    return await _proxy(request)


# ── Auxiliary ────────────────────────────────────────────────────────────

@app.post("/api/dicomweb/resolve_paths", tags=["Path Resolution"])
async def resolve_paths(request: Request):
    return await _proxy(request)


@app.post("/api/dicomweb/prime", tags=["Cache Priming"])
async def prime_series(request: Request):
    return await _proxy(request)


@app.get("/api/dicomweb/", tags=["DICOMweb"])
async def dicomweb_root():
    return {
        "service": "DICOMweb Gateway for Databricks Pixels",
        "endpoint": SERVING_ENDPOINT,
        "documentation": "https://www.dicomstandard.org/using/dicomweb",
        "services": {
            "QIDO-RS": [
                "GET /api/dicomweb/studies",
                "GET /api/dicomweb/all_series",
                "GET /api/dicomweb/studies/{study}/series",
                "GET /api/dicomweb/studies/{study}/series/{series}/instances",
            ],
            "WADO-RS": [
                "GET /api/dicomweb/studies/{study}/series/{series}/metadata",
                "GET .../instances/{instance}",
                "GET .../instances/{instance}/frames/{frameList}",
            ],
            "STOW-RS": [
                "POST /api/dicomweb/studies",
                "POST /api/dicomweb/studies/{study}",
            ],
            "WADO-URI": [
                "GET /api/dicomweb/wado?requestType=WADO&studyUID=...&seriesUID=...&objectUID=...",
            ],
        },
    }


# ── Health ───────────────────────────────────────────────────────────────

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "endpoint": SERVING_ENDPOINT}


# ── Middleware ───────────────────────────────────────────────────────────

class _Options200(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        if request.method == "OPTIONS":
            return Response(status_code=200)
        return await call_next(request)


app.add_middleware(_Options200)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
