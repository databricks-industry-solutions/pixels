"""
DICOMweb FastAPI application for Databricks Pixels.

Registers QIDO-RS and WADO-RS routes and starts a uvicorn server.
"""

from fastapi import FastAPI, Request, Response
from utils.handlers import (
    dicomweb_qido_studies,
    dicomweb_qido_series,
    dicomweb_qido_instances,
    dicomweb_wado_series_metadata,
    dicomweb_wado_instance,
    dicomweb_wado_instance_frames,
)

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
    """

    # QIDO-RS
    @app.get("/api/dicomweb/studies", tags=["DICOMweb QIDO-RS"])
    def search_studies(request: Request):
        return dicomweb_qido_studies(request)

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

    # Service root
    @app.get("/api/dicomweb/", tags=["DICOMweb"])
    def dicomweb_root():
        return {
            "message": "DICOMweb service for Databricks Pixels",
            "services": {
                "QIDO-RS": {
                    "description": "Query based on ID for DICOM Objects",
                    "endpoints": [
                        "GET /api/dicomweb/studies",
                        "GET /api/dicomweb/studies/{study}/series",
                        "GET /api/dicomweb/studies/{study}/series/{series}/instances",
                    ],
                },
                "WADO-RS": {
                    "description": "Web Access to DICOM Objects",
                    "endpoints": [
                        "GET /api/dicomweb/studies/{study}/series/{series}/metadata",
                        "GET /api/dicomweb/studies/{study}/series/{series}/instances/{instance}",
                        "GET /api/dicomweb/studies/{study}/series/{series}/instances/{instance}/frames/{frameList}",
                    ],
                },
                "STOW-RS": {
                    "description": "Store Over the Web",
                    "status": "Not yet implemented",
                },
            },
            "documentation": "https://www.dicomstandard.org/using/dicomweb",
        }


# ------------------------------------------------------------------
# Standalone entrypoint
# ------------------------------------------------------------------

if __name__ == "__main__":
    from fastapi.middleware.cors import CORSMiddleware
    from starlette.middleware.base import BaseHTTPMiddleware

    app = FastAPI(
        title="Pixels DICOMweb Service",
        description="DICOMweb-compliant API for Databricks Pixels",
        version="1.0.0",
    )

    register_dicomweb_routes(app)

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

    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
