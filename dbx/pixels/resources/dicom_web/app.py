"""
Example integration of DICOMweb wrapper into FastAPI application.

This file demonstrates how to integrate the DICOMweb wrapper into your
existing FastAPI application (like app.py or local_app.py).

Add these routes to your FastAPI app to enable DICOMweb protocol support.
"""

from fastapi import FastAPI, Request, Response
from utils.dicomweb import (
    dicomweb_qido_studies,
    dicomweb_qido_series,
    dicomweb_qido_instances,
    dicomweb_wado_series_metadata,
    dicomweb_wado_instance,
    dicomweb_wado_instance_frames,
)

# Assuming you have an existing FastAPI app
# app = FastAPI(title="Pixels")


def register_dicomweb_routes(app: FastAPI):
    """
    Register DICOMweb routes with your FastAPI application.
    
    This adds the following endpoints:
    
    QIDO-RS (Query/Search):
    - GET /api/dicomweb/studies - Search for studies
    - GET /api/dicomweb/studies/{study}/series - Search for series
    - GET /api/dicomweb/studies/{study}/series/{series}/instances - Search for instances
    
    WADO-RS (Retrieve):
    - GET /api/dicomweb/studies/{study}/series/{series}/instances/{instance} - Retrieve instance
    
    Args:
        app: FastAPI application instance
    """
    
    # QIDO-RS endpoints
    @app.get("/api/dicomweb/studies", tags=["DICOMweb QIDO-RS"])
    def search_studies(request: Request):
        """
        Search for DICOM studies.
        
        Query parameters:
        - PatientName: Patient name (supports wildcards * and ?)
        - PatientID: Patient ID
        - StudyDate: Study date (YYYYMMDD or YYYYMMDD-YYYYMMDD for range)
        - AccessionNumber: Accession number
        - StudyDescription: Study description
        - ModalitiesInStudy: Comma-separated modalities (e.g., CT,MR)
        - limit: Maximum number of results
        - offset: Offset for pagination
        
        Example:
        GET /api/dicomweb/studies?PatientName=Smith*&StudyDate=20240101-20241231&limit=10
        """
        return dicomweb_qido_studies(request)
    
    @app.get("/api/dicomweb/studies/{study_instance_uid}/series", tags=["DICOMweb QIDO-RS"])
    def search_series(request: Request, study_instance_uid: str):
        """
        Search for DICOM series within a study.
        
        Path parameters:
        - study_instance_uid: Study Instance UID
        
        Query parameters:
        - Modality: Series modality (e.g., CT, MR)
        - SeriesNumber: Series number
        - SeriesInstanceUID: Series Instance UID
        
        Example:
        GET /api/dicomweb/studies/1.2.840.113619.../series?Modality=CT
        """
        return dicomweb_qido_series(request, study_instance_uid)
    
    @app.get("/api/dicomweb/studies/{study_instance_uid}/series/{series_instance_uid}/instances",
             tags=["DICOMweb QIDO-RS"])
    def search_instances(request: Request, study_instance_uid: str, series_instance_uid: str):
        """
        Search for DICOM instances within a series.
        
        Path parameters:
        - study_instance_uid: Study Instance UID
        - series_instance_uid: Series Instance UID
        
        Query parameters:
        - SOPInstanceUID: SOP Instance UID (optional filter)
        
        Example:
        GET /api/dicomweb/studies/1.2.840.../series/1.2.840.../instances
        """
        return dicomweb_qido_instances(request, study_instance_uid, series_instance_uid)
    
    # WADO-RS endpoints
    @app.get("/api/dicomweb/studies/{study_instance_uid}/series/{series_instance_uid}/metadata",
             tags=["DICOMweb WADO-RS"])
    def retrieve_series_metadata(request: Request, study_instance_uid: str, 
                                       series_instance_uid: str):
        """
        Retrieve metadata for all instances in a series.
        
        Path parameters:
        - study_instance_uid: Study Instance UID
        - series_instance_uid: Series Instance UID
        
        Returns:
        - JSON array of DICOM metadata for all instances (without pixel data)
        
        Example:
        GET /api/dicomweb/studies/1.2.840.../series/1.2.840.../metadata
        """
        return dicomweb_wado_series_metadata(request, study_instance_uid, series_instance_uid)
    
    @app.get("/api/dicomweb/studies/{study_instance_uid}/series/{series_instance_uid}/instances/{sop_instance_uid}/frames/{frame_list}",
             tags=["DICOMweb WADO-RS"])
    def retrieve_instance_frames(request: Request, study_instance_uid: str, 
                                       series_instance_uid: str, sop_instance_uid: str,
                                       frame_list: str):
        """
        Retrieve specific frames from a DICOM instance.
        
        Path parameters:
        - study_instance_uid: Study Instance UID
        - series_instance_uid: Series Instance UID
        - sop_instance_uid: SOP Instance UID
        - frame_list: Comma-separated list of frame numbers (1-indexed), e.g., "1" or "1,3,5"
        
        Returns:
        - Binary pixel data for the requested frame(s)
        
        Example:
        GET /api/dicomweb/studies/1.2.840.../series/1.2.840.../instances/1.2.840.../frames/1
        """
        return dicomweb_wado_instance_frames(request, study_instance_uid, 
                                                   series_instance_uid, sop_instance_uid, frame_list)
    
    @app.get("/api/dicomweb/studies/{study_instance_uid}/series/{series_instance_uid}/instances/{sop_instance_uid}",
             tags=["DICOMweb WADO-RS"])
    def retrieve_instance(request: Request, study_instance_uid: str, 
                               series_instance_uid: str, sop_instance_uid: str):
        """
        Retrieve a DICOM instance.
        
        Path parameters:
        - study_instance_uid: Study Instance UID
        - series_instance_uid: Series Instance UID
        - sop_instance_uid: SOP Instance UID
        
        Returns:
        - Binary DICOM file content
        
        Example:
        GET /api/dicomweb/studies/1.2.840.../series/1.2.840.../instances/1.2.840...
        """
        return dicomweb_wado_instance(request, study_instance_uid, 
                                           series_instance_uid, sop_instance_uid)
    
    # Additional convenience endpoints
    
    @app.get("/api/dicomweb/", tags=["DICOMweb"])
    def dicomweb_root():
        """
        DICOMweb service root endpoint.
        
        Returns information about available DICOMweb services.
        """
        return {
            "message": "DICOMweb service for Databricks Pixels",
            "services": {
                "QIDO-RS": {
                    "description": "Query based on ID for DICOM Objects",
                    "endpoints": [
                        "GET /api/dicomweb/studies",
                        "GET /api/dicomweb/studies/{study}/series",
                        "GET /api/dicomweb/studies/{study}/series/{series}/instances"
                    ]
                },
                "WADO-RS": {
                    "description": "Web Access to DICOM Objects",
                    "endpoints": [
                        "GET /api/dicomweb/studies/{study}/series/{series}/metadata",
                        "GET /api/dicomweb/studies/{study}/series/{series}/instances/{instance}",
                        "GET /api/dicomweb/studies/{study}/series/{series}/instances/{instance}/frames/{frameList}"
                    ]
                },
                "STOW-RS": {
                    "description": "Store Over the Web",
                    "status": "Not yet implemented"
                }
            },
            "documentation": "https://www.dicomstandard.org/using/dicomweb"
        }


# Example: How to use in your existing app.py or local_app.py
if __name__ == "__main__":
    """
    Example of how to integrate into your existing application.
    
    In your app.py or local_app.py, add:
    
    ```python
    from dicomweb_integration_example import register_dicomweb_routes
    
    # After creating your FastAPI app
    app = FastAPI(title="Pixels")
    
    # Register DICOMweb routes
    register_dicomweb_routes(app)
    
    # Continue with your other routes...
    ```
    """
    
    # For testing purposes, create a standalone app
    app = FastAPI(
        title="Pixels DICOMweb Service",
        description="DICOMweb-compliant API for Databricks Pixels",
        version="1.0.0"
    )
    
    register_dicomweb_routes(app)

        # Add middleware to return 200 OK for all OPTIONS requests
    from starlette.middleware.base import BaseHTTPMiddleware

    class Options200Middleware(BaseHTTPMiddleware):
        def dispatch(self, request, call_next):
            if request.method == "OPTIONS":
                return Response(status_code=200)
            return call_next(request)

    app.add_middleware(Options200Middleware)

    from fastapi.middleware.cors import CORSMiddleware

    # Add CORS middleware to allow all origins, methods, and headers
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow all origins
        allow_credentials=True,
        allow_methods=["*"],  # Allow all HTTP methods
        allow_headers=["*"],  # Allow all headers
    )
    
    # Run with: uvicorn dicomweb_integration_example:app --reload
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

