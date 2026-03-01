"""
DICOMweb Gateway — Databricks App serving the full DICOMweb protocol.

Architecture::

    OHIF / Client  ──HTTP──▶  Gateway App   ──SQL──▶  SQL Warehouse
                              (this file)   ──PG───▶  Lakebase
                                            ──HTTP─▶  Volumes API

The gateway imports the DICOMweb handler library directly and calls
handlers in-process.  No Model Serving endpoint is involved.

Environment variables (set in ``app.yml``)::

    # ── Required ────────────────────────────────────────────────────────────
    DATABRICKS_WAREHOUSE_ID         SQL warehouse for QIDO-RS queries
    DATABRICKS_PIXELS_TABLE         Fully-qualified UC table (catalog.schema.table)

    # ── Lakebase (tier-2 persistent cache) ──────────────────────────────────
    LAKEBASE_INSTANCE_NAME          Lakebase instance name
                                    (default: "pixels-lakebase")
    LAKEBASE_INIT_DB                Run DDL migrations on startup — set to
                                    "true" on first deploy or after a schema
                                    change (default: disabled)

    # ── STOW-RS ─────────────────────────────────────────────────────────────
    DATABRICKS_STOW_VOLUME_PATH     Base Volumes path for STOW-RS uploads

    # ── In-memory caches ────────────────────────────────────────────────────
    PIXELS_BOT_CACHE_MAX_ENTRIES    Max BOT (frame-offset) cache entries
                                    (default: 100 000).
                                    Memory per entry ≈ 1.1 KB base +
                                    ~600 B × avg_frames_per_file:
                                      single-frame (X-ray)  → ~1.7 KB  → ~170 MB / 100 k
                                      10-frame avg          → ~7 KB    → ~700 MB / 100 k
                                      50-frame avg (CT)     → ~31 KB   → ~3 GB  / 100 k
                                    Each entry stores a list of frame dicts
                                    plus a mirrored frame_number→dict index.
    PIXELS_PATH_CACHE_MAX_ENTRIES   Max instance-path cache entries
                                    (default: 100 000).
                                    Memory per entry ≈ 1 KB flat
                                    (SOP UID key + local_path + num_frames)
                                    → ~100 MB / 100 k entries.

    # ── File prefetcher (async Volumes read-ahead) ───────────────────────────
    PIXELS_PREFETCH_ENABLED         Enable background prefetch of full DICOM
                                    files into RAM (default: false)
    PIXELS_PREFETCH_RAM_RATIO       Fraction of total RAM reserved for the
                                    prefetch buffer when no explicit cap is set
                                    (default: 0.50)
    PIXELS_PREFETCH_MAX_MEMORY_MB   Hard cap on prefetch buffer in MB —
                                    overrides PIXELS_PREFETCH_RAM_RATIO
    PIXELS_PREFETCH_MAX_FILE_MB     Skip prefetching files larger than this
                                    (default: 512 MB)

    # ── Disk frame cache (local SSD) ────────────────────────────────────────
    PIXELS_FRAME_CACHE_DIR          Directory for the on-disk frame cache
                                    (default: /tmp/pixels_frame_cache)
    PIXELS_FRAME_CACHE_MAX_GB       Maximum size of the on-disk cache in GB
                                    (default: 10 GB)

    # ── Gateway tuning ───────────────────────────────────────────────────────
    DICOMWEB_MAX_CONNECTIONS        Max concurrent outbound connections to
                                    Volumes (default: 200)
    DICOMWEB_MAX_KEEPALIVE          Max keep-alive connections (default: 100)
    DICOMWEB_METRICS_INTERVAL       Seconds between metrics snapshots pushed
                                    to the metrics store (default: 1)
"""

import asyncio
import logging
import os
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone

import httpx
import psutil
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse, JSONResponse
from utils.cache import bot_cache, instance_path_cache
from utils.dicom_io import file_prefetcher
from utils.handlers import (
    dicomweb_prime_series,
    dicomweb_qido_all_series,
    dicomweb_qido_instances,
    dicomweb_qido_series,
    dicomweb_qido_studies,
    dicomweb_resolve_paths,
    dicomweb_stow_studies,
    dicomweb_wado_instance,
    dicomweb_wado_instance_frames,
    dicomweb_wado_series_metadata,
    dicomweb_wado_uri,
)

from dbx.pixels.resources.common.middleware import LoggingMiddleware

try:
    from utils.handlers import dicomweb_resolve_frame_ranges
except ImportError:
    dicomweb_resolve_frame_ranges = None

from utils.metrics_store import get_store

logger = logging.getLogger("DICOMweb.Gateway")

_METRICS_INTERVAL = float(os.getenv("DICOMWEB_METRICS_INTERVAL", "1"))
_WADO_DIAG_HEADERS = os.getenv("DICOMWEB_WADO_DIAG_HEADERS", "false").strip().lower() in (
    "1",
    "true",
    "yes",
)

# Shared async HTTP client — available for future async Volumes reads.
_http_client: httpx.AsyncClient | None = None

# ---------------------------------------------------------------------------
# Startup BOT cache preload
# ---------------------------------------------------------------------------


def _startup_bot_preload() -> None:
    """
    Pre-warm the in-memory BOT cache from Lakebase immediately after startup.

    Runs in a background thread so the server starts accepting requests
    without delay.  Files are loaded in priority order — most recently
    accessed and most frequently accessed first — up to the BOT cache's
    configured ``max_entries`` limit.  The LRU cache handles any overflow
    automatically, so no RAM budget arithmetic is needed.
    """
    from utils.cache import bot_cache
    from utils.handlers._common import lb_utils

    if lb_utils is None:
        logger.info("Startup BOT preload: Lakebase not configured — skipping")
        return

    uc_table = os.getenv("DATABRICKS_PIXELS_TABLE")
    if not uc_table:
        logger.info("Startup BOT preload: DATABRICKS_PIXELS_TABLE not set — skipping")
        return

    limit = bot_cache._max_entries
    logger.info("Startup BOT preload: table=%s, limit=%d", uc_table, limit)

    t0 = time.perf_counter()
    try:
        priority_list = lb_utils.get_preload_priority_list(
            uc_table_name=uc_table,
            limit=limit,
        )
    except Exception as exc:
        logger.warning("Startup BOT preload: get_preload_priority_list failed: %s", exc)
        return

    all_filenames: list[str] = []
    if not priority_list:
        logger.info(
            "Startup BOT preload: priority list is empty — "
            "falling back to instance_paths preload"
        )
    else:
        logger.info("Startup BOT preload: %d files in priority list", len(priority_list))

        loaded = 0
        errors = 0

        for entry in priority_list:
            filename = entry["filename"]
            frames = entry.get("frames") or []
            if not frames:
                continue
            try:
                tsuid = entry.get("transfer_syntax_uid") or "1.2.840.10008.1.2.1"
                bot_cache.put_from_lakebase(filename, uc_table, frames, tsuid)
                loaded += 1
            except Exception as exc:
                logger.debug("Startup BOT preload: error for %s: %s", filename, exc)
                errors += 1

        elapsed = time.perf_counter() - t0
        logger.info(
            "Startup BOT preload complete: %d loaded, %d errors — %.1fs",
            loaded,
            errors,
            elapsed,
        )

        # Re-use BOT filenames to preload instance paths in one query.
        all_filenames = [e["filename"] for e in priority_list]

    # ── Instance-path cache preload ────────────────────────────────────────
    try:
        from utils.cache import instance_path_cache

        t1 = time.perf_counter()
        if all_filenames:
            path_map = lb_utils.retrieve_instance_paths_by_local_paths(all_filenames, uc_table)
        else:
            path_map = lb_utils.retrieve_instance_paths_for_preload(
                uc_table_name=uc_table, limit=limit
            )

        if path_map:
            instance_path_cache.batch_put(uc_table, path_map)
            logger.info(
                "Startup instance-path preload complete: %d entries — %.1fs",
                len(path_map),
                time.perf_counter() - t1,
            )
        else:
            logger.info(
                "Startup instance-path preload: instance_paths table is empty "
                "or not yet synced — skipping"
            )
    except Exception as exc:
        logger.warning("Startup instance-path preload failed (non-fatal): %s", exc)


# ---------------------------------------------------------------------------
# Gateway request counters
# ---------------------------------------------------------------------------

_gw_req_count = 0
_gw_req_errors = 0
_gw_req_latency_sum = 0.0
_gw_req_in_flight = 0  # gauge: requests currently being processed


def _record_request(elapsed: float, is_error: bool):
    global _gw_req_count, _gw_req_errors, _gw_req_latency_sum, _gw_req_in_flight
    _gw_req_count += 1
    _gw_req_latency_sum += elapsed
    if is_error:
        _gw_req_errors += 1
    _gw_req_in_flight -= 1


def _record_request_start():
    global _gw_req_in_flight
    _gw_req_in_flight += 1


def _bytes_to_mb(b: int) -> float:
    return round(b / (1024 * 1024), 2)


def _collect_system_metrics() -> dict:
    """Gather CPU, memory, thread, and network connection stats."""
    proc = psutil.Process()
    mem = proc.memory_info()
    sys_mem = psutil.virtual_memory()
    try:
        net_conns = len(proc.net_connections())
    except (psutil.AccessDenied, psutil.NoSuchProcess):
        net_conns = -1
    return {
        "cpu_percent_process": proc.cpu_percent(interval=0.1),
        "cpu_percent_system": psutil.cpu_percent(interval=0.1),
        "cpu_count": os.cpu_count(),
        "memory_rss_mb": _bytes_to_mb(mem.rss),
        "memory_vms_mb": _bytes_to_mb(mem.vms),
        "system_memory_total_mb": _bytes_to_mb(sys_mem.total),
        "system_memory_available_mb": _bytes_to_mb(sys_mem.available),
        "system_memory_used_percent": sys_mem.percent,
        "threads_active": threading.active_count(),
        "network_connections": net_conns,
    }


def _collect_cache_metrics() -> dict:
    """Gather BOT cache, instance path cache, and prefetcher stats."""
    return {
        "bot_cache": bot_cache.stats,
        "instance_path_cache": instance_path_cache.stats,
        "prefetcher": file_prefetcher.stats,
    }


def _snapshot_and_reset() -> dict:
    global _gw_req_count, _gw_req_errors, _gw_req_latency_sum
    snap = {
        "request_count": _gw_req_count,
        "error_count": _gw_req_errors,
        "latency_sum_s": round(_gw_req_latency_sum, 4),
        "avg_latency_s": (round(_gw_req_latency_sum / _gw_req_count, 4) if _gw_req_count else 0),
        "in_flight": max(_gw_req_in_flight, 0),  # gauge — not reset
        "system": _collect_system_metrics(),
        "caches": _collect_cache_metrics(),
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
            payload: dict = {"gateway": []}
            if store:
                try:
                    rows = store.get_latest_metrics(source="gateway", limit=1)
                    payload["gateway"] = rows
                except Exception as exc:
                    logger.error("Lakebase read for WS broadcast: %s", exc)

            if not payload["gateway"]:
                payload["gateway"] = [
                    {
                        "source": "gateway",
                        "recorded_at": datetime.now(timezone.utc).isoformat(),
                        "metrics": gw_snapshot,
                    }
                ]
            await _broadcast_metrics(payload)


# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------


@asynccontextmanager
async def _lifespan(application: FastAPI):
    global _http_client

    # Increase AnyIO's default thread-token limiter so StreamingResponse
    # producers wrapped by iterate_in_threadpool can run with higher
    # parallelism under bursty WADO traffic.
    try:
        import anyio

        anyio_tokens = int(os.getenv("DICOMWEB_ANYIO_THREAD_TOKENS", "128"))
        limiter = anyio.to_thread.current_default_thread_limiter()
        limiter.total_tokens = max(1, anyio_tokens)
        logger.info("AnyIO thread limiter tokens set to %d", limiter.total_tokens)
    except Exception as exc:
        logger.warning("Failed to configure AnyIO thread limiter: %s", exc)

    # Pre-size the default executor used by asyncio.to_thread so that
    # blocking SQL / Lakebase calls under concurrent load don't stall
    # waiting for new threads to be created.
    _default_executor = ThreadPoolExecutor(
        max_workers=int(os.getenv("STOW_THREAD_POOL_SIZE", "64")),
        thread_name_prefix="stow-io",
    )
    asyncio.get_event_loop().set_default_executor(_default_executor)

    _http_client = httpx.AsyncClient(
        http2=False,
        limits=httpx.Limits(
            max_connections=int(os.getenv("DICOMWEB_MAX_CONNECTIONS", "200")),
            max_keepalive_connections=int(
                os.getenv("DICOMWEB_MAX_KEEPALIVE", "100"),
            ),
        ),
    )
    task = asyncio.create_task(_metrics_reporter())

    # Log STOW upload mode clearly so operators can see at a glance
    # which path is active without needing to inspect env vars manually.
    from utils.cloud_direct_upload import DIRECT_UPLOAD_ENABLED, probe_direct_upload

    if DIRECT_UPLOAD_ENABLED:
        # Run synchronously so credentials are cached before the first upload request
        # arrives.  probe_direct_upload() also calls get_temp_credentials(), which
        # populates the in-process cache and prevents the first real upload from
        # paying the 5-8 s cold-start penalty.
        _probe_executor = ThreadPoolExecutor(max_workers=1, thread_name_prefix="stow-probe")
        await asyncio.get_event_loop().run_in_executor(_probe_executor, probe_direct_upload)
    else:
        logger.info(
            "STOW upload mode: FILES API  "
            "(set STOW_DIRECT_CLOUD_UPLOAD=true to enable direct cloud upload)"
        )

    # Pre-warm the in-memory BOT cache from Lakebase in a background thread.
    # The server starts serving requests immediately; the preload runs
    # concurrently and completes within seconds for most deployments.
    _preload_executor = ThreadPoolExecutor(max_workers=1, thread_name_prefix="bot-preload")
    _preload_future = _preload_executor.submit(_startup_bot_preload)

    yield

    # Graceful shutdown — flush any buffered STOW audit records before exit
    try:
        from utils.handlers._stow import _stow_record_buffer

        _stow_record_buffer.stop()
    except Exception:
        pass
    task.cancel()
    _preload_future.cancel()
    _preload_executor.shutdown(wait=False)
    _default_executor.shutdown(wait=False)
    await _http_client.aclose()
    _http_client = None


app = FastAPI(
    title="DICOMweb Gateway",
    description=("Full DICOMweb-compliant API backed by " "Databricks SQL, Lakebase, and Volumes"),
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
    request: Request,
    study_uid: str,
    series_uid: str,
):
    return dicomweb_qido_instances(request, study_uid, series_uid)


# ── WADO-RS ──────────────────────────────────────────────────────────────


@app.get(
    "/api/dicomweb/studies/{study_uid}/series/{series_uid}/metadata",
    tags=["WADO-RS"],
)
def retrieve_series_metadata(
    request: Request,
    study_uid: str,
    series_uid: str,
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
        request,
        study_uid,
        series_uid,
        sop_uid,
        frame_list,
    )


@app.get(
    "/api/dicomweb/studies/{study_uid}/series/{series_uid}" "/instances/{sop_uid}",
    tags=["WADO-RS"],
)
def retrieve_instance(
    request: Request,
    study_uid: str,
    series_uid: str,
    sop_uid: str,
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


if dicomweb_resolve_frame_ranges is not None:

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

_METRICS_WINDOWS: dict[str, int] = {
    "5m": 5 * 60,
    "30m": 30 * 60,
    "1h": 60 * 60,
    "8h": 8 * 60 * 60,
}


@app.get("/api/stow/status", tags=["Monitoring"])
def stow_status():
    """Return the active STOW upload mode and direct-cloud-upload diagnostics.

    Use this endpoint to confirm at runtime whether the gateway is writing
    DICOM files through the Databricks Files API or directly to cloud storage
    via UC Credential Vending.

    Response fields
    ---------------
    direct_upload_enabled : bool
        Value of the ``STOW_DIRECT_CLOUD_UPLOAD`` env var.
    mode : str
        ``"direct_cloud"`` or ``"files_api"``.
    provider : str | null
        Cloud provider detected from the volume storage location:
        ``"aws"``, ``"azure"``, or ``"gcp"``.  ``null`` when the Files API
        path is active.
    cloud_url : str | null
        Resolved cloud storage prefix (e.g. ``s3://my-bucket/dicom/``).
        ``null`` when the Files API path is active.
    volumes_concurrency : int
        Value of ``STOW_VOLUMES_CONCURRENCY`` semaphore limit.
    probe_error : str | null
        Reason string when the direct-upload probe failed at startup.
    """
    from utils.cloud_direct_upload import DIRECT_UPLOAD_ENABLED, probe_direct_upload

    probe = probe_direct_upload()
    return JSONResponse(
        content={
            "direct_upload_enabled": DIRECT_UPLOAD_ENABLED,
            "mode": probe["mode"],
            "provider": probe.get("provider"),
            "cloud_url": probe.get("cloud_url"),
            "volumes_concurrency": int(os.getenv("STOW_VOLUMES_CONCURRENCY", "8")),
            "probe_error": probe.get("error"),
        }
    )


@app.get("/api/metrics", tags=["Monitoring"])
def metrics(window: str = "5m"):
    """Return gateway metrics for the requested time window.

    Query parameters
    ----------------
    window : str
        One of ``5m`` (5 minutes), ``30m`` (30 minutes), ``1h`` (1 hour),
        or ``8h`` (8 hours).  Defaults to ``5m``.  Results are downsampled
        to at most 300 data points so the response stays lean.
    """
    delta_s = _METRICS_WINDOWS.get(window, _METRICS_WINDOWS["5m"])
    since = datetime.now(timezone.utc) - timedelta(seconds=delta_s)

    store = get_store()
    rows: list = []
    if store:
        try:
            rows = store.get_latest_metrics(
                source="gateway",
                since=since,
                max_points=300,
            )
        except Exception as exc:
            logger.error("Metrics Lakebase read: %s", exc)
    return JSONResponse(
        content={
            "gateway": rows,
            "window": window,
            "system": _collect_system_metrics(),
            "caches": _collect_cache_metrics(),
        }
    )


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

_METRICS_SKIP_PREFIXES = ("/health", "/ws/", "/api/metrics", "/api/dashboard")


def _is_wado_request(scope) -> bool:
    """Return True when the HTTP request targets a WADO endpoint."""
    path = scope.get("path", "")
    if path == "/api/dicomweb/wado":
        return True
    if path == "/api/dicomweb":
        query = scope.get("query_string", b"").decode("latin1").upper()
        return "REQUESTTYPE=WADO" in query
    if path.startswith("/api/dicomweb/studies/"):
        if path.endswith("/metadata"):
            return True
        if "/instances/" in path:
            return True
    return False


class _InstrumentMiddleware:
    """Pure ASGI middleware that records per-request latency and errors."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        path = scope.get("path", "")
        if any(path.startswith(p) for p in _METRICS_SKIP_PREFIXES):
            await self.app(scope, receive, send)
            return

        _record_request_start()
        inflight_at_start = max(_gw_req_in_flight, 0)
        t0 = time.perf_counter()
        status_code = 200
        ttfb_ms: float | None = None
        is_wado = _is_wado_request(scope)
        req_method = scope.get("method", "GET")
        req_id = f"gw-{time.time_ns():x}"

        async def _send_wrapper(message):
            nonlocal status_code, ttfb_ms
            if message["type"] == "http.response.start":
                status_code = message.get("status", 200)
                if ttfb_ms is None:
                    ttfb_ms = (time.perf_counter() - t0) * 1000.0
                if is_wado and _WADO_DIAG_HEADERS:
                    headers = list(message.get("headers", []))
                    headers.append((b"x-gw-request-id", req_id.encode()))
                    headers.append((b"x-gw-ttfb-ms", f"{ttfb_ms:.1f}".encode()))
                    headers.append((b"x-gw-inflight-start", str(inflight_at_start).encode()))
                    headers.append((b"server-timing", f"gw_ttfb;dur={ttfb_ms:.1f}".encode()))
                    message["headers"] = headers
            await send(message)

        try:
            await self.app(scope, receive, _send_wrapper)
        except Exception:
            status_code = 500
            raise
        finally:
            elapsed = time.perf_counter() - t0
            _record_request(elapsed, status_code >= 400)
            if is_wado:
                logger.info(
                    "WADO_DIAG id=%s method=%s path=%s status=%s "
                    "ttfb_ms=%.1f total_ms=%.1f inflight_start=%d inflight_end=%d",
                    req_id,
                    req_method,
                    path,
                    status_code,
                    ttfb_ms if ttfb_ms is not None else 0.0,
                    elapsed * 1000.0,
                    inflight_at_start,
                    max(_gw_req_in_flight, 0),
                )


app.add_middleware(_InstrumentMiddleware)
app.add_middleware(LoggingMiddleware)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, log_config=None)
