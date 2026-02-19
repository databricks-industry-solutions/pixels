"""
DICOMweb Gateway — Databricks App serving the full DICOMweb protocol.

Architecture::

    OHIF / Client  ──HTTP──▶  Gateway App   ──SQL──▶  SQL Warehouse
                              (this file)   ──PG───▶  Lakebase
                                            ──HTTP─▶  Volumes API

The gateway imports the DICOMweb handler library directly and calls
handlers in-process.  No Model Serving endpoint is involved.

Environment variables (set in ``app.yml``)::

    DATABRICKS_WAREHOUSE_ID     SQL warehouse for QIDO-RS queries
    DATABRICKS_PIXELS_TABLE     Fully-qualified UC table (catalog.schema.table)
    LAKEBASE_INSTANCE_NAME      Lakebase instance for tier-2 caching
    DATABRICKS_STOW_VOLUME_PATH Base Volumes path for STOW-RS uploads
"""

import asyncio
import logging
import os
import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone

import httpx
from fastapi import FastAPI, Request, Response, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse

from dbx.pixels.resources.dicom_web.utils.handlers import (
    dicomweb_qido_studies,
    dicomweb_qido_series,
    dicomweb_qido_all_series,
    dicomweb_qido_instances,
    dicomweb_wado_series_metadata,
    dicomweb_wado_instance,
    dicomweb_wado_instance_frames,
    dicomweb_wado_uri,
    dicomweb_stow_studies,
    dicomweb_resolve_paths,
    dicomweb_resolve_frame_ranges,
    dicomweb_prime_series,
)

from metrics_store import get_store

logger = logging.getLogger("DICOMweb.Gateway")

_METRICS_INTERVAL = float(os.getenv("DICOMWEB_METRICS_INTERVAL", "1"))

# Shared async HTTP client — available for future async Volumes reads.
_http_client: httpx.AsyncClient | None = None

# ---------------------------------------------------------------------------
# Gateway request counters
# ---------------------------------------------------------------------------

_gw_req_count = 0
_gw_req_errors = 0
_gw_req_latency_sum = 0.0


def _record_request(elapsed: float, is_error: bool):
    global _gw_req_count, _gw_req_errors, _gw_req_latency_sum
    _gw_req_count += 1
    _gw_req_latency_sum += elapsed
    if is_error:
        _gw_req_errors += 1


def _snapshot_and_reset() -> dict:
    global _gw_req_count, _gw_req_errors, _gw_req_latency_sum
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
    _http_client = httpx.AsyncClient(
        http2=True,
        limits=httpx.Limits(
            max_connections=int(os.getenv("DICOMWEB_MAX_CONNECTIONS", "200")),
            max_keepalive_connections=int(
                os.getenv("DICOMWEB_MAX_KEEPALIVE", "100"),
            ),
        ),
    )
    task = asyncio.create_task(_metrics_reporter())
    yield
    task.cancel()
    await _http_client.aclose()
    _http_client = None

app = FastAPI(
    title="DICOMweb Gateway",
    description=(
        "Full DICOMweb-compliant API backed by "
        "Databricks SQL, Lakebase, and Volumes"
    ),
    version="2.0.0",
    lifespan=_lifespan,
)


# ── QIDO-RS ──────────────────────────────────────────────────────────────

@app.get("/api/dicomweb/studies", tags=["QIDO-RS"])
def search_studies(request: Request):
    return dicomweb_qido_studies(request)


@app.get("/api/dicomweb/all_series", tags=["QIDO-RS"])
def search_all_series(request: Request):
    return dicomweb_qido_all_series(request)


@app.get(
    "/api/dicomweb/studies/{study_uid}/series",
    tags=["QIDO-RS"],
)
def search_series(request: Request, study_uid: str):
    return dicomweb_qido_series(request, study_uid)


@app.get(
    "/api/dicomweb/studies/{study_uid}/series/{series_uid}/instances",
    tags=["QIDO-RS"],
)
def search_instances(
    request: Request, study_uid: str, series_uid: str,
):
    return dicomweb_qido_instances(request, study_uid, series_uid)


# ── WADO-RS ──────────────────────────────────────────────────────────────

@app.get(
    "/api/dicomweb/studies/{study_uid}/series/{series_uid}/metadata",
    tags=["WADO-RS"],
)
def retrieve_series_metadata(
    request: Request, study_uid: str, series_uid: str,
):
    return dicomweb_wado_series_metadata(request, study_uid, series_uid)


@app.get(
    "/api/dicomweb/studies/{study_uid}/series/{series_uid}"
    "/instances/{sop_uid}/frames/{frame_list}",
    tags=["WADO-RS"],
)
def retrieve_instance_frames(
    request: Request,
    study_uid: str,
    series_uid: str,
    sop_uid: str,
    frame_list: str,
):
    return dicomweb_wado_instance_frames(
        request, study_uid, series_uid, sop_uid, frame_list,
    )


@app.get(
    "/api/dicomweb/studies/{study_uid}/series/{series_uid}"
    "/instances/{sop_uid}",
    tags=["WADO-RS"],
)
def retrieve_instance(
    request: Request, study_uid: str, series_uid: str, sop_uid: str,
):
    return dicomweb_wado_instance(request, study_uid, series_uid, sop_uid)


# ── WADO-URI (legacy) ────────────────────────────────────────────────────

@app.get("/api/dicomweb/wado", tags=["WADO-URI"])
def wado_uri(request: Request):
    return dicomweb_wado_uri(request)


@app.get("/api/dicomweb", tags=["WADO-URI"])
def wado_uri_base(request: Request):
    if request.query_params.get("requestType", "").upper() == "WADO":
        return dicomweb_wado_uri(request)
    return {
        "service": "DICOMweb Gateway",
        "status": "active",
    }


# ── STOW-RS ──────────────────────────────────────────────────────────────

@app.post("/api/dicomweb/studies/{study_uid}", tags=["STOW-RS"])
async def store_instances_study(request: Request, study_uid: str):
    return await dicomweb_stow_studies(request, study_uid)


@app.post("/api/dicomweb/studies", tags=["STOW-RS"])
async def store_instances(request: Request):
    return await dicomweb_stow_studies(request)


# ── Auxiliary ────────────────────────────────────────────────────────────

@app.post("/api/dicomweb/resolve_paths", tags=["Path Resolution"])
async def resolve_paths(request: Request):
    return await dicomweb_resolve_paths(request)


@app.post("/api/dicomweb/resolve_frame_ranges", tags=["Frame Resolution"])
async def resolve_frame_ranges(request: Request):
    return await dicomweb_resolve_frame_ranges(request)


@app.post("/api/dicomweb/prime", tags=["Cache Priming"])
async def prime_series(request: Request):
    return await dicomweb_prime_series(request)


@app.get("/api/dicomweb/", tags=["DICOMweb"])
def dicomweb_root():
    return {
        "service": "DICOMweb Gateway for Databricks Pixels",
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
def metrics():
    """Return the latest metrics from the gateway (via Lakebase)."""
    store = get_store()
    if store is None:
        return JSONResponse(
            status_code=503,
            content={"error": "MetricsStore not available"},
        )
    rows = store.get_latest_metrics(source=None, limit=300)
    gateway = [r for r in rows if r["source"] == "gateway"]
    return JSONResponse(content={
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
def dashboard():
    """Serve the live metrics dashboard."""
    import pathlib
    html_path = pathlib.Path(__file__).parent / "pages" / "dashboard.html"
    html = html_path.read_text()
    return HTMLResponse(content=html)


# ── Health ───────────────────────────────────────────────────────────────

@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}


# ── Middleware ───────────────────────────────────────────────────────────

class _Options200:
    """Pure ASGI middleware — bypasses BaseHTTPMiddleware's TaskGroup overhead."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http" and scope["method"] == "OPTIONS":
            await send({
                "type": "http.response.start",
                "status": 200,
                "headers": [(b"content-length", b"0")],
            })
            await send({"type": "http.response.body", "body": b""})
            return
        await self.app(scope, receive, send)


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
