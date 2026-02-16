"""
QIDO-RS (Query based on ID for DICOM Objects) handlers.

* GET /api/dicomweb/studies
* GET /api/dicomweb/studies/{study}/series
* GET /api/dicomweb/studies/{study}/series/{series}/instances
"""

import json

from fastapi import Request, Response

from .. import timing_decorator
from ._common import get_dicomweb_wrapper


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
