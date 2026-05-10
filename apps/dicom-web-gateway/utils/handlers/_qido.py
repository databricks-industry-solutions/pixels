"""
QIDO-RS (Query based on ID for DICOM Objects) handlers.

* GET /api/dicomweb/studies
* GET /api/dicomweb/studies/{study}/series
* GET /api/dicomweb/studies/{study}/series/{series}/instances
"""

import json

from fastapi import Request, Response

from dbx.pixels.logging import LoggerProvider

from .. import timing_decorator
from ..request_ctx import current_request_id
from ._common import get_dicomweb_wrapper

logger = LoggerProvider("DICOMweb.QIDO")


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
    logger.debug(
        "QIDO_STUDIES req_id=%s qs=%s",
        current_request_id(),
        str(request.query_params),
    )
    try:
        wrapper = get_dicomweb_wrapper(request)
        results = wrapper.search_for_studies(_query_params_to_dict(request))
    except Exception:
        logger.error("QIDO_STUDIES_FAIL req_id=%s", current_request_id(), exc_info=True)
        raise
    return Response(content=json.dumps(results, indent=2), media_type="application/dicom+json")


def dicomweb_qido_series(request: Request, study_instance_uid: str) -> Response:
    """GET /api/dicomweb/studies/{study}/series"""
    logger.debug(
        "QIDO_SERIES req_id=%s study=%s qs=%s",
        current_request_id(),
        study_instance_uid,
        str(request.query_params),
    )
    try:
        wrapper = get_dicomweb_wrapper(request)
        results = wrapper.search_for_series(study_instance_uid, _query_params_to_dict(request))
    except Exception:
        logger.error(
            "QIDO_SERIES_FAIL req_id=%s study=%s",
            current_request_id(),
            study_instance_uid,
            exc_info=True,
        )
        raise
    return Response(content=json.dumps(results, indent=2), media_type="application/dicom+json")


@timing_decorator
def dicomweb_qido_all_series(request: Request) -> Response:
    """GET /api/dicomweb/all_series — bulk discover every (study, series) pair."""
    logger.debug("QIDO_ALL_SERIES req_id=%s", current_request_id())
    try:
        wrapper = get_dicomweb_wrapper(request)
        results = wrapper.search_for_all_series()
    except Exception:
        logger.error("QIDO_ALL_SERIES_FAIL req_id=%s", current_request_id(), exc_info=True)
        raise
    return Response(content=json.dumps(results, indent=2), media_type="application/dicom+json")


def dicomweb_qido_instances(
    request: Request, study_instance_uid: str, series_instance_uid: str
) -> Response:
    """GET /api/dicomweb/studies/{study}/series/{series}/instances"""
    logger.debug(
        "QIDO_INSTANCES req_id=%s study=%s series=%s qs=%s",
        current_request_id(),
        study_instance_uid,
        series_instance_uid,
        str(request.query_params),
    )
    try:
        wrapper = get_dicomweb_wrapper(request)
        results = wrapper.search_for_instances(
            study_instance_uid, series_instance_uid, _query_params_to_dict(request)
        )
    except Exception:
        logger.error(
            "QIDO_INSTANCES_FAIL req_id=%s study=%s series=%s",
            current_request_id(),
            study_instance_uid,
            series_instance_uid,
            exc_info=True,
        )
        raise
    return Response(content=json.dumps(results, indent=2), media_type="application/dicom+json")
