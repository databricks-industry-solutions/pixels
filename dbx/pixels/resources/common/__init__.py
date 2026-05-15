"""
Shared utilities and route registration for Pixels applications.

This package contains common code used by **both** the Lakehouse App
(OHIF viewer) and the DICOMweb service, including:

- OHIF viewer hosting and config page
- Token / Logging middleware
- MONAI model-serving integration
- Redaction API
- VLM analysis

Note: The SQL warehouse reverse-proxy routes are *not* shared — they
live in ``lakehouse_app/app.py`` because they are specific to the
legacy OHIF data flow.

Usage::

    from dbx.pixels.resources.common.routes import register_all_common_routes

    app = FastAPI(...)
    register_all_common_routes(app)
"""
