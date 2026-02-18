"""
DICOMweb + OHIF FastAPI application for Databricks Pixels.

Registers DICOMweb routes (QIDO-RS, WADO-RS, WADO-URI) **and**
shared OHIF routes (viewer hosting, config page, MONAI proxy, SQL
warehouse proxy, redaction API, VLM analysis).
"""

from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse

from utils.handlers import (
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
    dicomweb_perf_compare,
    dicomweb_prime_series,
)
from utils.metrics import collect_metrics, start_metrics_logger

# ── Shared common modules ─────────────────────────────────────────────
from dbx.pixels.resources.common.middleware import (
    LoggingMiddleware,
    TokenMiddleware,
)
from dbx.pixels.resources.common.routes import register_all_common_routes


def register_dicomweb_routes(app: FastAPI):
    """
    Register DICOMweb routes with a FastAPI application.

    QIDO-RS (Query/Search):
    - GET /api/dicomweb/studies
    - GET /api/dicomweb/studies/{study}/series
    - GET /api/dicomweb/studies/{study}/series/{series}/instances

    WADO-RS (Retrieve):
    - GET /api/dicomweb/studies/{study}/series/{series}/metadata
    - GET /api/dicomweb/studies/{study}/series/{series}/instances/{instance}
    - GET /api/dicomweb/studies/{study}/series/{series}/instances/{instance}/frames/{frameList}

    STOW-RS (Store):
    - POST /api/dicomweb/studies
    - POST /api/dicomweb/studies/{study}

    """

    # QIDO-RS
    @app.get("/api/dicomweb/studies", tags=["DICOMweb QIDO-RS"])
    def search_studies(request: Request):
        return dicomweb_qido_studies(request)

    @app.get("/api/dicomweb/all_series", tags=["DICOMweb QIDO-RS"])
    def search_all_series(request: Request):
        return dicomweb_qido_all_series(request)

    @app.get("/api/dicomweb/studies/{study_instance_uid}/series", tags=["DICOMweb QIDO-RS"])
    def search_series(request: Request, study_instance_uid: str):
        return dicomweb_qido_series(request, study_instance_uid)

    @app.get(
        "/api/dicomweb/studies/{study_instance_uid}/series/{series_instance_uid}/instances",
        tags=["DICOMweb QIDO-RS"],
    )
    def search_instances(request: Request, study_instance_uid: str, series_instance_uid: str):
        return dicomweb_qido_instances(request, study_instance_uid, series_instance_uid)

    # WADO-RS
    @app.get(
        "/api/dicomweb/studies/{study_instance_uid}/series/{series_instance_uid}/metadata",
        tags=["DICOMweb WADO-RS"],
    )
    def retrieve_series_metadata(request: Request, study_instance_uid: str, series_instance_uid: str):
        return dicomweb_wado_series_metadata(request, study_instance_uid, series_instance_uid)

    @app.get(
        "/api/dicomweb/studies/{study_instance_uid}/series/{series_instance_uid}"
        "/instances/{sop_instance_uid}/frames/{frame_list}",
        tags=["DICOMweb WADO-RS"],
    )
    def retrieve_instance_frames(
        request: Request,
        study_instance_uid: str,
        series_instance_uid: str,
        sop_instance_uid: str,
        frame_list: str,
    ):
        return dicomweb_wado_instance_frames(
            request, study_instance_uid, series_instance_uid, sop_instance_uid, frame_list
        )

    @app.get(
        "/api/dicomweb/studies/{study_instance_uid}/series/{series_instance_uid}"
        "/instances/{sop_instance_uid}",
        tags=["DICOMweb WADO-RS"],
    )
    def retrieve_instance(
        request: Request,
        study_instance_uid: str,
        series_instance_uid: str,
        sop_instance_uid: str,
    ):
        return dicomweb_wado_instance(
            request, study_instance_uid, series_instance_uid, sop_instance_uid
        )

    # STOW-RS
    @app.post("/api/dicomweb/studies/{study_instance_uid}", tags=["DICOMweb STOW-RS"])
    async def store_instances_study(request: Request, study_instance_uid: str):
        return await dicomweb_stow_studies(request, study_instance_uid)

    @app.post("/api/dicomweb/studies", tags=["DICOMweb STOW-RS"])
    async def store_instances(request: Request):
        return await dicomweb_stow_studies(request)

    # Path resolution
    @app.post("/api/dicomweb/resolve_paths", tags=["DICOMweb Path Resolution"])
    async def resolve_paths(request: Request):
        return await dicomweb_resolve_paths(request)

    # Series priming (cache warm-up: paths + prefetch + BOT)
    @app.post("/api/dicomweb/prime", tags=["DICOMweb Cache Priming"])
    async def prime_series(request: Request):
        return await dicomweb_prime_series(request)

    # Debug: performance comparison (full stream vs progressive)
    @app.get(
        "/api/dicomweb/debug/perf/{study_instance_uid}/{series_instance_uid}"
        "/{sop_instance_uid}/frames/{frame_list}",
        tags=["Debug"],
    )
    def perf_compare(
        request: Request,
        study_instance_uid: str,
        series_instance_uid: str,
        sop_instance_uid: str,
        frame_list: str,
    ):
        return dicomweb_perf_compare(
            request, study_instance_uid, series_instance_uid,
            sop_instance_uid, frame_list,
        )

    # WADO-URI (legacy query-parameter retrieval)
    @app.get("/api/dicomweb/wado", tags=["DICOMweb WADO-URI"])
    def wado_uri(request: Request):
        return dicomweb_wado_uri(request)

    # Also accept WADO-URI at the base path (some viewers send it there)
    @app.get("/api/dicomweb", tags=["DICOMweb WADO-URI"])
    def wado_uri_base(request: Request):
        # Only treat as WADO-URI if the requestType param is present
        if request.query_params.get("requestType", "").upper() == "WADO":
            return dicomweb_wado_uri(request)
        # Otherwise, return the service root info
        return _dicomweb_service_root()

    # Metrics
    @app.get("/api/metrics", tags=["Monitoring"])
    def metrics():
        """Return a full metrics snapshot (CPU, memory, caches, prefetcher)."""
        return JSONResponse(content=collect_metrics())

    # Service root
    @app.get("/api/dicomweb/", tags=["DICOMweb"])
    def dicomweb_root():
        return _dicomweb_service_root()

    # Benchmark page (WADO-RS vs WADO-URI comparison)
    @app.get("/api/dicomweb/benchmark", tags=["Debug"])
    def benchmark_page():
        import pathlib
        html_path = pathlib.Path(__file__).parent / "pages" / "benchmark.html"
        with open(html_path, "r") as f:
            html = f.read()
        return Response(content=html, media_type="text/html")

    # Metrics Dashboard
    @app.get("/api/dicomweb/dashboard", tags=["Monitoring"])
    def metrics_dashboard():
        import pathlib
        html_path = pathlib.Path(__file__).parent / "pages" / "dashboard.html"
        with open(html_path, "r") as f:
            html = f.read()
        return Response(content=html, media_type="text/html")


def _dicomweb_service_root() -> dict:
    """Service capability document returned at the DICOMweb root."""
    return {
        "message": "DICOMweb service for Databricks Pixels",
        "services": {
            "QIDO-RS": {
                "description": "Query based on ID for DICOM Objects",
                "endpoints": [
                    "GET /api/dicomweb/studies",
                    "GET /api/dicomweb/all_series",
                    "GET /api/dicomweb/studies/{study}/series",
                    "GET /api/dicomweb/studies/{study}/series/{series}/instances",
                ],
            },
            "WADO-RS": {
                "description": "Web Access to DICOM Objects (RESTful)",
                "endpoints": [
                    "GET /api/dicomweb/studies/{study}/series/{series}/metadata",
                    "GET /api/dicomweb/studies/{study}/series/{series}/instances/{instance}",
                    "GET /api/dicomweb/studies/{study}/series/{series}/instances/{instance}/frames/{frameList}",
                ],
            },
            "STOW-RS": {
                "description": "STore Over the Web (RESTful) — upload DICOM instances",
                "endpoints": [
                    "POST /api/dicomweb/studies",
                    "POST /api/dicomweb/studies/{study}",
                ],
                "supported_content_types": ["multipart/related; type=application/dicom"],
                "notes": [
                    "The raw multipart body is streamed directly to a single temp file on Volumes — O(chunk_size) memory, zero DICOM parsing.",
                    "One tracking row per STOW request is written to the stow_operations Delta table (audit + processing queue).",
                    "A serverless Spark job (<app_name>_stow_processor) is auto-triggered with run-coalescing (max 1 running + 1 queued).",
                    "The Spark job splits the multipart bundle, saves individual DICOMs, extracts metadata via pydicom, and registers in the catalog.",
                    "No compression or transfer syntax negotiation.",
                ],
            },
            "WADO-URI": {
                "description": "Web Access to DICOM Objects (legacy query-parameter)",
                "endpoints": [
                    "GET /api/dicomweb/wado?requestType=WADO&studyUID=...&seriesUID=...&objectUID=...",
                    "GET /api/dicomweb?requestType=WADO&studyUID=...&seriesUID=...&objectUID=...",
                ],
                "supported_content_types": ["application/dicom"],
                "optional_params": ["frameNumber", "transferSyntax"],
            },
            "Prime": {
                "description": "Pre-warm all caches for a series (paths, prefetch, BOT)",
                "endpoints": [
                    "POST /api/dicomweb/prime",
                ],
                "notes": [
                    "Resolves all instance paths, schedules file prefetch, and computes BOT for every instance.",
                    "After priming, all WADO-RS frame requests hit the fast cache path (µs lookups).",
                ],
            },
        },
        "documentation": "https://www.dicomstandard.org/using/dicomweb",
    }


# ------------------------------------------------------------------
# Standalone entrypoint / App definition
# ------------------------------------------------------------------

from contextlib import asynccontextmanager

from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── startup ──
    start_metrics_logger(interval_seconds=300)  # log every 5 minutes
    yield
    # ── shutdown (cleanup if needed) ──

app = FastAPI(
    title="Pixels DICOMweb Service",
    description="DICOMweb-compliant API with OHIF viewer, MONAI, redaction, and VLM",
    version="1.0.0",
    lifespan=lifespan,
)

# ── DICOMweb standard routes ──────────────────────────────────────
register_dicomweb_routes(app)

# ── Shared common routes (OHIF, proxy, MONAI, redaction, VLM) ─────
register_all_common_routes(app)

# ── Middleware (order matters: first added = outermost) ────────────
app.add_middleware(TokenMiddleware, default_data_source="pixelsdicomweb", dicomweb_root="/api/dicomweb")
app.add_middleware(LoggingMiddleware)

class Options200Middleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        if request.method == "OPTIONS":
            return Response(status_code=200)
        return await call_next(request)

app.add_middleware(Options200Middleware)
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
