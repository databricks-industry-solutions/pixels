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

import asyncio
import base64
import json
import logging
import os
import threading
import time
import requests
from contextlib import asynccontextmanager
from datetime import datetime, timezone

import httpx
import zstd
from databricks.sdk import WorkspaceClient
from databricks.sdk.core import Config
from fastapi import FastAPI, Request, Response, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.concurrency import run_in_threadpool

from metrics_store import get_store

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

_METRICS_INTERVAL = float(os.getenv("DICOMWEB_METRICS_INTERVAL", "1"))

# Shared async HTTP client — created/closed in the FastAPI lifespan.
_http_client: httpx.AsyncClient | None = None

# ---------------------------------------------------------------------------
# Gateway request counters (thread-safe)
# ---------------------------------------------------------------------------

_stats_lock = threading.Lock()
_gw_req_count = 0
_gw_req_errors = 0
_gw_req_latency_sum = 0.0


def _record_request(elapsed: float, is_error: bool):
    global _gw_req_count, _gw_req_errors, _gw_req_latency_sum
    with _stats_lock:
        _gw_req_count += 1
        _gw_req_latency_sum += elapsed
        if is_error:
            _gw_req_errors += 1


def _snapshot_and_reset() -> dict:
    global _gw_req_count, _gw_req_errors, _gw_req_latency_sum
    with _stats_lock:
        snap = {
            "request_count": _gw_req_count,
            "error_count": _gw_req_errors,
            "latency_sum_s": round(_gw_req_latency_sum, 4),
            "avg_latency_s": (
                round(_gw_req_latency_sum / _gw_req_count, 4)
                if _gw_req_count else 0
            ),
        }
        _gw_req_count = 0
        _gw_req_errors = 0
        _gw_req_latency_sum = 0.0
    return snap


# ---------------------------------------------------------------------------
# WebSocket clients for live metrics push
# ---------------------------------------------------------------------------

_ws_clients: set[WebSocket] = set()


async def _broadcast_metrics(data: dict):
    """Push a metrics payload to every connected WebSocket client."""
    stale = []
    for client in list(_ws_clients):
        try:
            await client.send_json(data)
        except Exception:
            stale.append(client)
    for client in stale:
        _ws_clients.discard(client)


# ---------------------------------------------------------------------------
# Auth — auto-refreshed via Databricks SDK Config
# ---------------------------------------------------------------------------

_cfg: Config | None = None
_header_factory = None
_workspace_client = None


def _get_auth() -> tuple[str, dict]:
    """Return ``(host, auth_headers)`` for serving endpoint calls."""
    global _cfg, _header_factory, _workspace_client

    if _cfg is None:
        _cfg = Config()
        _header_factory = _cfg.authenticate()
        _workspace_client = WorkspaceClient(config = _cfg)

    headers = _header_factory() if callable(_header_factory) else _header_factory
    if headers is None:
        _cfg = None
        _header_factory = None
        raise RuntimeError("Authentication failed — could not obtain token")

    host = os.getenv("DATABRICKS_HOST").rstrip("/")

    return host, headers


# ---------------------------------------------------------------------------
# Serving endpoint invocation
# ---------------------------------------------------------------------------

async def _invoke_endpoint(payload: dict) -> dict:
    """
    POST a serialised HTTP request to the DICOMweb serving endpoint.

    Uses the shared ``httpx.AsyncClient`` so multiple in-flight requests
    are truly concurrent (no event-loop blocking).

    Returns the parsed prediction result dict.
    """
    _get_auth()

    results = await run_in_threadpool(
            lambda: _workspace_client.serving_endpoints_data_plane.query(name=SERVING_ENDPOINT, dataframe_records=[payload])
        )
    resp = json.loads(results.predictions)

    if resp['status_code'] >= 400:
        logger.error(
            "Serving endpoint HTTP %d: %s", resp['status_code'], resp[:500],
        )
        return {
            "status_code": resp['status_code'],
            "headers": {},
            "body_text": resp['body'],
            "body": "",
            "content_type": "text/plain",
        }
    
    predictions = results.predictions

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
    t0 = time.monotonic()
    is_error = False
    try:
        payload = await _serialize_request(request)
        result = await _invoke_endpoint(payload)
        resp = _deserialize_response(result)
        if resp.status_code >= 500:
            is_error = True
        return resp
    except Exception as exc:
        is_error = True
        logger.error("Gateway proxy error: %s", exc, exc_info=True)
        return JSONResponse(
            status_code=502,
            content={"error": "Gateway error", "detail": str(exc)},
        )
    finally:
        _record_request(time.monotonic() - t0, is_error)


# ---------------------------------------------------------------------------
# Background metrics reporter
# ---------------------------------------------------------------------------

async def _metrics_reporter():
    """Flush gateway stats to Lakebase and push to WebSocket clients."""
    store = get_store()
    if store is None:
        logger.warning("MetricsStore unavailable — Lakebase persistence disabled")
    logger.info("Gateway metrics reporter started (interval=%.1fs)", _METRICS_INTERVAL)
    while True:
        await asyncio.sleep(_METRICS_INTERVAL)
        gw_snapshot = _snapshot_and_reset()

        if store:
            try:
                store.insert_metrics("gateway", gw_snapshot)
            except Exception as exc:
                logger.error("Gateway metrics Lakebase write: %s", exc)

        if _ws_clients:
            payload: dict = {"serving": [], "gateway": []}
            if store:
                try:
                    rows = store.get_latest_metrics(source=None, limit=300)
                    payload["serving"] = [
                        r for r in rows
                        if r["source"].startswith("serving")
                    ]
                    payload["gateway"] = [
                        r for r in rows if r["source"] == "gateway"
                    ]
                except Exception as exc:
                    logger.error("Lakebase read for WS broadcast: %s", exc)

            if not payload["gateway"]:
                payload["gateway"] = [{
                    "source": "gateway",
                    "recorded_at": datetime.now(timezone.utc).isoformat(),
                    "metrics": gw_snapshot,
                }]
            await _broadcast_metrics(payload)


# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------

@asynccontextmanager
async def _lifespan(application: FastAPI):
    global _http_client
    _http_client = httpx.AsyncClient(http2=True)
    task = asyncio.create_task(_metrics_reporter())
    yield
    task.cancel()
    await _http_client.aclose()
    _http_client = None

app = FastAPI(
    title="DICOMweb Gateway",
    description=(
        "Translates DICOMweb REST API calls to a "
        "Databricks Model Serving endpoint"
    ),
    version="1.0.0",
    lifespan=_lifespan,
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


# ── Monitoring ───────────────────────────────────────────────────────────

@app.get("/api/metrics", tags=["Monitoring"])
async def metrics():
    """Return the latest metrics from both serving and gateway (via Lakebase)."""
    store = get_store()
    if store is None:
        return JSONResponse(
            status_code=503,
            content={"error": "MetricsStore not available"},
        )
    rows = store.get_latest_metrics(source=None, limit=300)
    serving = [r for r in rows if r["source"].startswith("serving")]
    gateway = [r for r in rows if r["source"] == "gateway"]
    return JSONResponse(content={
        "serving": serving,
        "gateway": gateway,
    })


@app.websocket("/ws/metrics")
async def ws_metrics(websocket: WebSocket):
    """Stream live metrics to the dashboard over a persistent WebSocket."""
    await websocket.accept()
    _ws_clients.add(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        _ws_clients.discard(websocket)


@app.get("/api/dashboard", tags=["Monitoring"])
async def dashboard():
    """Serve the live metrics dashboard."""
    import pathlib
    html_path = pathlib.Path(__file__).parent / "pages" / "dashboard.html"
    html = html_path.read_text()
    return HTMLResponse(content=html)


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
