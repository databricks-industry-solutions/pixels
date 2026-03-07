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


def _query_params_to_dict(request: Request) -> dict:
    """
    Convert query params to a dict while preserving repeated keys as lists.

    `dict(request.query_params)` drops repeated keys (keeps only the last value),
    which breaks multi-valued DICOM filters such as ModalitiesInStudy.
    """
    normalized: dict[str, str | list[str]] = {}
    for key, value in request.query_params.multi_items():
        current = normalized.get(key)
        if current is None:
            normalized[key] = value
        elif isinstance(current, list):
            current.append(value)
        else:
            normalized[key] = [current, value]
    return normalized


@timing_decorator
def dicomweb_qido_studies(request: Request) -> Response:
    """GET /api/dicomweb/studies — search for studies."""
    wrapper = get_dicomweb_wrapper(request)
    results = wrapper.search_for_studies(_query_params_to_dict(request))
    return Response(content=json.dumps(results, indent=2), media_type="application/dicom+json")


def dicomweb_qido_series(request: Request, study_instance_uid: str) -> Response:
    """GET /api/dicomweb/studies/{study}/series"""
    wrapper = get_dicomweb_wrapper(request)
    results = wrapper.search_for_series(study_instance_uid, _query_params_to_dict(request))
    return Response(content=json.dumps(results, indent=2), media_type="application/dicom+json")


@timing_decorator
def dicomweb_qido_all_series(request: Request) -> Response:
    """GET /api/dicomweb/all_series — bulk discover every (study, series) pair."""
    wrapper = get_dicomweb_wrapper(request)
    results = wrapper.search_for_all_series()
    return Response(content=json.dumps(results, indent=2), media_type="application/dicom+json")


def dicomweb_qido_instances(
    request: Request, study_instance_uid: str, series_instance_uid: str
) -> Response:
    """GET /api/dicomweb/studies/{study}/series/{series}/instances"""
    wrapper = get_dicomweb_wrapper(request)
    results = wrapper.search_for_instances(
        study_instance_uid, series_instance_uid, _query_params_to_dict(request)
    )
    return Response(content=json.dumps(results, indent=2), media_type="application/dicom+json")
