"""
WADO-RS / WADO-URI / Path-resolution handlers.

* GET  /api/dicomweb/studies/{study}/series/{series}/metadata
* GET  /api/dicomweb/studies/{study}/series/{series}/instances/{instance}
* GET  /api/dicomweb/studies/{…}/instances/{instance}/frames/{frameList}
* GET  /api/dicomweb/wado?requestType=WADO&studyUID=…&objectUID=…
* POST /api/dicomweb/resolve_paths
"""

import json
import uuid

from fastapi import HTTPException, Request, Response
from fastapi.responses import StreamingResponse

from dbx.pixels.logging import LoggerProvider

from .. import timing_decorator
from ..dicom_tags import TRANSFER_SYNTAX_TO_MIME
from ._common import get_dicomweb_wrapper

logger = LoggerProvider("DICOMweb.WADO")


# ---------------------------------------------------------------------------
# WADO-RS handlers
# ---------------------------------------------------------------------------

@timing_decorator
def dicomweb_wado_series_metadata(
    request: Request, study_instance_uid: str, series_instance_uid: str
) -> StreamingResponse:
    """GET /api/dicomweb/studies/{study}/series/{series}/metadata

    Streams the JSON array directly from Arrow batches — the ``meta``
    column is already valid JSON so no parse/serialize round-trip is needed.
    """
    wrapper = get_dicomweb_wrapper(request)
    stream = wrapper.retrieve_series_metadata(study_instance_uid, series_instance_uid)
    return StreamingResponse(stream, media_type="application/dicom+json")


def dicomweb_wado_instance(
    request: Request,
    study_instance_uid: str,
    series_instance_uid: str,
    sop_instance_uid: str,
) -> StreamingResponse:
    """GET /api/dicomweb/studies/{study}/series/{series}/instances/{instance}

    Streams the full DICOM file directly from Databricks Volumes → client
    without buffering the entire file in server memory.
    """
    wrapper = get_dicomweb_wrapper(request)
    stream, content_length = wrapper.retrieve_instance(
        study_instance_uid, series_instance_uid, sop_instance_uid,
    )
    headers: dict[str, str] = {"Cache-Control": "private, max-age=3600"}
    if content_length:
        headers["Content-Length"] = content_length
    return StreamingResponse(stream, media_type="application/dicom", headers=headers)


@timing_decorator
def dicomweb_wado_instance_frames(
    request: Request,
    study_instance_uid: str,
    series_instance_uid: str,
    sop_instance_uid: str,
    frame_list: str,
) -> StreamingResponse:
    """GET /…/instances/{instance}/frames/{frameList}

    Streams the multipart response frame-by-frame: the client receives
    each frame as soon as it arrives from the Volumes byte-range read,
    without waiting for all frames to be fetched first.
    """
    wrapper = get_dicomweb_wrapper(request)

    try:
        frame_numbers = [int(f.strip()) for f in frame_list.split(",")]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid frame list format")

    logger.debug(
        f"Frame request: study={study_instance_uid}, series={series_instance_uid}, "
        f"instance={sop_instance_uid}, frames={frame_numbers}"
    )

    try:
        # BOT resolution (cache/compute) happens eagerly — errors surface now
        frame_stream, transfer_syntax_uid = wrapper.retrieve_instance_frames(
            study_instance_uid, series_instance_uid, sop_instance_uid,
            frame_numbers,
        )

        mime_type = TRANSFER_SYNTAX_TO_MIME.get(transfer_syntax_uid, "application/octet-stream")
        boundary = f"BOUNDARY_{uuid.uuid4()}"

        def multipart_generator():
            """Yield multipart parts as each frame arrives from Volumes."""
            for idx, frame_data in enumerate(frame_stream):
                logger.debug(
                    f"Frame {idx + 1}: {len(frame_data)} bytes, "
                    f"first 4 bytes: {frame_data[:4].hex() if len(frame_data) >= 4 else 'N/A'}"
                )
                part_header = (
                    f"--{boundary}\r\n"
                    f"Content-Type: {mime_type};transfer-syntax={transfer_syntax_uid}\r\n\r\n"
                )
                yield part_header.encode() + frame_data + b"\r\n"
            yield f"--{boundary}--\r\n".encode()

        return StreamingResponse(
            multipart_generator(),
            media_type=f"multipart/related; type={mime_type}; boundary={boundary}",
            headers={"Cache-Control": "private, max-age=3600"},
        )
    except Exception:
        logger.error("Error retrieving frames", exc_info=True)
        raise


# ---------------------------------------------------------------------------
# WADO-URI handler (legacy query-parameter style)
# ---------------------------------------------------------------------------

@timing_decorator
def dicomweb_wado_uri(request: Request) -> StreamingResponse | Response:
    """
    WADO-URI endpoint — legacy query-parameter object retrieval.

    Spec reference: DICOM PS3.18 §6.2
    https://dicom.nema.org/medical/dicom/current/output/chtml/part18/sect_6.2.html

    Required query parameters::

        requestType=WADO
        studyUID=<Study Instance UID>
        seriesUID=<Series Instance UID>
        objectUID=<SOP Instance UID>

    Optional query parameters::

        contentType   — ``application/dicom`` (default) returns the raw
                        DICOM Part-10 file.  Other values (e.g.
                        ``image/jpeg``, ``image/png``) are **not yet
                        supported** and will return 406.
        frameNumber   — 1-indexed frame number.  When provided, only that
                        single frame is returned (multipart response,
                        same as WADO-RS frames).
        transferSyntax — requested Transfer Syntax UID (informational;
                         the file is returned as-is).

    Example request::

        GET /api/dicomweb/wado?requestType=WADO
            &studyUID=1.2.3
            &seriesUID=1.2.3.4
            &objectUID=1.2.3.4.5
            &contentType=application%2Fdicom

    Returns:
        ``StreamingResponse`` with the DICOM file, or a single-frame
        multipart response when ``frameNumber`` is specified.
    """
    params = dict(request.query_params)

    # ── Validate requestType ────────────────────────────────────────
    request_type = params.get("requestType", "")
    if request_type.upper() != "WADO":
        raise HTTPException(
            status_code=400,
            detail=(
                f"Invalid or missing requestType: '{request_type}'. "
                "WADO-URI requires requestType=WADO"
            ),
        )

    # ── Required UIDs ───────────────────────────────────────────────
    study_uid = params.get("studyUID")
    series_uid = params.get("seriesUID")
    object_uid = params.get("objectUID")

    if not study_uid or not object_uid:
        raise HTTPException(
            status_code=400,
            detail="WADO-URI requires at least studyUID and objectUID query parameters",
        )

    # seriesUID is technically optional in the spec but most
    # implementations require it.  We need it for our SQL queries.
    if not series_uid:
        raise HTTPException(
            status_code=400,
            detail="seriesUID is required by this server",
        )

    # ── Content type negotiation ────────────────────────────────────
    content_type = params.get("contentType", "application/dicom")
    if content_type not in ("application/dicom", "application/dicom;", "*/*"):
        raise HTTPException(
            status_code=406,
            detail=(
                f"Unsupported contentType: '{content_type}'. "
                "Only application/dicom is supported."
            ),
        )

    logger.info(
        f"WADO-URI: study={study_uid}, series={series_uid}, "
        f"object={object_uid}, contentType={content_type}"
    )

    wrapper = get_dicomweb_wrapper(request)

    # ── Optional frameNumber → delegate to frame retrieval ──────────
    frame_number_str = params.get("frameNumber")
    if frame_number_str:
        try:
            frame_number = int(frame_number_str)
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid frameNumber: '{frame_number_str}'",
            )

        logger.info(f"WADO-URI: frame {frame_number} requested")

        frame_stream, transfer_syntax_uid = wrapper.retrieve_instance_frames(
            study_uid, series_uid, object_uid, [frame_number],
        )

        mime_type = TRANSFER_SYNTAX_TO_MIME.get(
            transfer_syntax_uid, "application/octet-stream",
        )
        boundary = f"BOUNDARY_{uuid.uuid4()}"

        def single_frame_generator():
            for frame_data in frame_stream:
                part_header = (
                    f"--{boundary}\r\n"
                    f"Content-Type: {mime_type};"
                    f"transfer-syntax={transfer_syntax_uid}\r\n\r\n"
                )
                yield part_header.encode() + frame_data + b"\r\n"
            yield f"--{boundary}--\r\n".encode()

        return StreamingResponse(
            single_frame_generator(),
            media_type=(
                f"multipart/related; type={mime_type}; boundary={boundary}"
            ),
            headers={"Cache-Control": "private, max-age=3600"},
        )

    # ── Full instance retrieval (default) ───────────────────────────
    stream, content_length = wrapper.retrieve_instance(
        study_uid, series_uid, object_uid,
    )
    headers: dict[str, str] = {"Cache-Control": "private, max-age=3600"}
    if content_length:
        headers["Content-Length"] = content_length
    return StreamingResponse(
        stream, media_type="application/dicom", headers=headers,
    )


# ---------------------------------------------------------------------------
# Performance comparison: full stream vs progressive
# ---------------------------------------------------------------------------

@timing_decorator
def dicomweb_perf_compare(
    request: Request,
    study_instance_uid: str,
    series_instance_uid: str,
    sop_instance_uid: str,
    frame_list: str,
) -> Response:
    """GET /api/dicomweb/debug/perf/…/frames/{frameList}

    Compare time-to-first-byte (TTFB) and total delivery time between:

    A) **Full stream** — stream the entire file, then extract frames
    B) **Progressive** — progressive streaming with per-frame delivery

    Returns a JSON report with timing for each approach.  Useful for
    benchmarking without a browser.
    """
    import json
    import time as _time

    from ..dicom_io import (
        _HEADER_EXTENDED_BYTES,
        _HEADER_INITIAL_BYTES,
        _PIXEL_DATA_MARKER,
        _fetch_bytes_range,
        _find_pixel_data_pos,
        compute_full_bot,
        get_file_part,
        stream_file,
    )
    from ..cache import bot_cache

    wrapper = get_dicomweb_wrapper(request)

    try:
        frame_numbers = [int(f.strip()) for f in frame_list.split(",")]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid frame list format")

    logger.info(
        f"PERF COMPARE: frames={frame_numbers}, instance={sop_instance_uid}"
    )

    # ── Resolve path (shared) ────────────────────────────────────────
    path = wrapper._resolve_instance_path(
        study_instance_uid, series_instance_uid, sop_instance_uid,
    )
    from dbx.pixels.databricks_file import DatabricksFile
    db_file = DatabricksFile.from_full_path(path)
    filename = db_file.full_path
    token = wrapper._token

    results: dict = {
        "file": filename,
        "frame_numbers": frame_numbers,
    }

    # ── Approach A: Full file stream + extract ────────────────────────
    try:
        t_start = _time.time()
        t_ttfb = None

        raw = _fetch_bytes_range(token, db_file)
        pixel_data_pos = _find_pixel_data_pos(raw)

        from io import BytesIO
        import pydicom
        ds = pydicom.dcmread(BytesIO(raw), stop_before_pixels=True)
        transfer_syntax_uid = str(ds.file_meta.TransferSyntaxUID)

        bot_data = compute_full_bot(token, db_file)
        frames_by_idx = {
            f["frame_number"]: f for f in bot_data.get("frames", [])
        }

        frame_sizes_a = []
        for fn in frame_numbers:
            fidx = fn - 1
            meta = frames_by_idx.get(fidx)
            if meta:
                content = get_file_part(token, db_file, meta)
                if t_ttfb is None:
                    t_ttfb = _time.time() - t_start
                frame_sizes_a.append(len(content))

        t_total = _time.time() - t_start

        results["full_stream"] = {
            "ttfb_s": round(t_ttfb or t_total, 4),
            "total_s": round(t_total, 4),
            "frame_sizes": frame_sizes_a,
        }
    except Exception as exc:
        results["full_stream"] = {"error": str(exc)}

    # ── Clear caches so progressive starts fresh ─────────────────────
    bot_cache._cache.pop(bot_cache._key(filename, wrapper._table), None)

    # ── Approach B: Progressive streaming ────────────────────────────
    try:
        from ..dicom_io import progressive_streamer

        # Remove any existing stream state for a clean comparison
        with progressive_streamer._lock:
            progressive_streamer._states.pop(filename, None)

        t_start = _time.time()
        t_ttfb = None

        frame_stream, tsuid = wrapper.retrieve_instance_frames(
            study_instance_uid, series_instance_uid,
            sop_instance_uid, frame_numbers,
        )

        frame_sizes_b = []
        for frame_data in frame_stream:
            if t_ttfb is None:
                t_ttfb = _time.time() - t_start
            frame_sizes_b.append(len(frame_data))

        t_total = _time.time() - t_start

        results["progressive"] = {
            "ttfb_s": round(t_ttfb or t_total, 4),
            "total_s": round(t_total, 4),
            "frame_sizes": frame_sizes_b,
        }
    except Exception as exc:
        results["progressive"] = {"error": str(exc)}

    # ── Summary ──────────────────────────────────────────────────────
    if "ttfb_s" in results.get("full_stream", {}) and "ttfb_s" in results.get("progressive", {}):
        fs = results["full_stream"]
        pr = results["progressive"]
        ttfb_speedup = fs["ttfb_s"] / max(pr["ttfb_s"], 0.0001)
        total_speedup = fs["total_s"] / max(pr["total_s"], 0.0001)
        results["comparison"] = {
            "ttfb_speedup": f"{ttfb_speedup:.1f}x",
            "total_speedup": f"{total_speedup:.1f}x",
            "ttfb_delta_s": round(fs["ttfb_s"] - pr["ttfb_s"], 4),
            "total_delta_s": round(fs["total_s"] - pr["total_s"], 4),
        }

    return Response(
        content=json.dumps(results, indent=2),
        media_type="application/json",
    )


# ---------------------------------------------------------------------------
# Path resolution handler
# ---------------------------------------------------------------------------

@timing_decorator
async def dicomweb_resolve_paths(request: Request) -> Response:
    """POST /api/dicomweb/resolve_paths — resolve file paths for a series.

    Request body (JSON)::

        {
            "studyInstanceUID": "1.2.840.113619...",
            "seriesInstanceUID": "1.2.840.113619..."
        }

    Response body (JSON)::

        {
            "paths": {
                "1.2.840.113619.SOP1": "/Volumes/catalog/schema/volume/path/to/file1.dcm",
                "1.2.840.113619.SOP2": "/Volumes/catalog/schema/volume/path/to/file2.dcm"
            }
        }
    """
    body = await request.json()

    study_uid = body.get("studyInstanceUID")
    series_uid = body.get("seriesInstanceUID")

    if not study_uid or not series_uid:
        raise HTTPException(
            status_code=400,
            detail="Both 'studyInstanceUID' and 'seriesInstanceUID' are required",
        )

    wrapper = get_dicomweb_wrapper(request)
    paths = wrapper.resolve_instance_paths(study_uid, series_uid)

    return Response(
        content=json.dumps({"paths": paths}, indent=2),
        media_type="application/json",
    )
