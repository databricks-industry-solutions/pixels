"""
Lakehouse OHIF App for Databricks Pixels.

Uses the shared ``common`` package for OHIF hosting, MONAI proxy,
redaction, and VLM routes. The SQL warehouse reverse-proxy routes
are lakehouse-app-specific and defined here.
"""

import json
import os
import re

import httpx
import uvicorn
import zstd
from fastapi import FastAPI, HTTPException, Response
from starlette.background import BackgroundTask
from starlette.concurrency import run_in_threadpool
from starlette.requests import Request
from starlette.responses import StreamingResponse

import dbx.pixels.version as dbx_pixels_version
from dbx.pixels.databricks_file import DatabricksFile

from dbx.pixels.resources.common.config import (
    cfg,
    get_pixels_table,
    get_seg_dest_dir,
    log,
    logger,
)
from dbx.pixels.resources.common.middleware import LoggingMiddleware, TokenMiddleware
from dbx.pixels.resources.common.routes import register_all_common_routes

from utils.partial_frames import (
    get_file_metadata,
    get_file_part,
    pixel_frames_from_dcm_metadata_file,
)

# ---------------------------------------------------------------------------
# Lakebase (tier-2 frame cache) — optional
# ---------------------------------------------------------------------------
_lb_utils = None
try:
    if "LAKEBASE_INSTANCE_NAME" in os.environ:
        from dbx.pixels.lakebase import LakebaseUtils

        _lb_utils = LakebaseUtils(instance_name=os.environ["LAKEBASE_INSTANCE_NAME"])
except Exception as exc:
    logger.warning(f"Lakebase init failed (non-fatal): {exc}")

# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(title="Pixels")


# ═══════════════════════════════════════════════════════════════════════════
# SQL WAREHOUSE REVERSE-PROXY (lakehouse-app-specific)
# ═══════════════════════════════════════════════════════════════════════════

async def _reverse_proxy_statements(request: Request):
    client = httpx.AsyncClient(base_url=cfg.host, timeout=httpx.Timeout(30))
    url = httpx.URL(path=request.url.path.replace("/sqlwarehouse/", ""))
    if request.method == "POST":
        body = await request.json()
        body["warehouse_id"] = os.environ["DATABRICKS_WAREHOUSE_ID"]

        dest_dir = get_seg_dest_dir(request)
        body["statement"] = re.sub(
            r"Volumes/.*?/ohif/exports/", f"{dest_dir}/", body["statement"]
        )
        log(f"Overriding dest dir to {dest_dir}", request, "debug")
    else:
        body = {}

    rp_req = client.build_request(
        request.method,
        url,
        headers={
            "Authorization": "Bearer " + request.headers.get("X-Forwarded-Access-Token"),
            "User-Agent": f"DatabricksPixels/{dbx_pixels_version}",
        },
        content=json.dumps(body).encode("utf-8"),
    )

    rp_resp = await client.send(rp_req, stream=True)
    return StreamingResponse(
        rp_resp.aiter_raw(),
        status_code=rp_resp.status_code,
        headers=rp_resp.headers,
        background=BackgroundTask(rp_resp.aclose),
    )


async def _reverse_proxy_files_metadata(request: Request):
    """Reverse proxy endpoint for files metadata GET requests."""
    url = httpx.URL(path=request.url.path.replace("/sqlwarehouse/", ""))
    db_file = DatabricksFile.from_full_path(
        url.path.replace("api/2.0/fs/files_metadata", "")
    )
    metadata = await run_in_threadpool(
        lambda: get_file_metadata(
            request.headers.get("X-Forwarded-Access-Token"), db_file
        )
    )
    return Response(content=json.dumps(metadata), media_type="application/json")


async def _reverse_proxy_files_multiframe(request: Request):
    url = httpx.URL(
        path=request.url.path.replace("/sqlwarehouse/", "").replace(
            "/files_wsi/", "/files/"
        )
    )
    str_url = str(url)

    try:
        db_file = DatabricksFile.from_full_path(
            url.path.replace("api/2.0/fs/files", "")
        )
    except ValueError as e:
        log(f"Invalid file path: {e}", request, "error")
        raise HTTPException(status_code=400, detail=f"Invalid file path: {e}")

    if "frames" in request.query_params:
        param_frames = int(request.query_params.get("frames"))
    elif "frame" in str_url:
        param_frames = int(re.search(r"&frame=(\d+)", str_url).group(1))
        str_url = str_url.split("&frame=")[0]
    else:
        return await _reverse_proxy_files(request)

    uc_table_name = get_pixels_table(request)

    # Try tier-2 cache (Lakebase) first
    results = None
    if _lb_utils:
        results = await run_in_threadpool(
            lambda: _lb_utils.retrieve_frame_range(
                db_file.full_path, param_frames - 1, uc_table_name
            )
        )

    frame_metadata = {}
    if results is not None:
        frame_metadata = results
    else:
        max_frame_idx = 0
        max_start_pos = 0

        if _lb_utils:
            lb_max = await run_in_threadpool(
                lambda: _lb_utils.retrieve_max_frame_range(
                    db_file.full_path, param_frames - 1, uc_table_name
                )
            )
            if lb_max:
                max_frame_idx = 0 if lb_max["max_frame_idx"] is None else lb_max["max_frame_idx"]
                max_start_pos = 0 if lb_max["max_start_pos"] is None else lb_max["max_start_pos"]

        pixels_metadata = await run_in_threadpool(
            lambda: pixel_frames_from_dcm_metadata_file(
                request.headers.get("X-Forwarded-Access-Token"),
                db_file,
                param_frames,
                max_frame_idx,
                max_start_pos,
            )
        )

        if _lb_utils:
            await run_in_threadpool(
                lambda: _lb_utils.insert_frame_ranges(
                    db_file.full_path, pixels_metadata["frames"], uc_table_name
                )
            )

        frame_metadata = pixels_metadata["frames"][param_frames - 1 - max_frame_idx]
        frame_metadata["pixel_data_pos"] = pixels_metadata["pixel_data_pos"]

    frame_content = await run_in_threadpool(
        lambda: get_file_part(
            request.headers.get("X-Forwarded-Access-Token"),
            db_file,
            frame_metadata,
        )
    )

    return Response(
        content=zstd.compress(frame_content),
        media_type="application/octet-stream",
        headers={"Content-Encoding": "zstd"},
    )


async def _reverse_proxy_files(request: Request):
    client = httpx.AsyncClient(base_url=cfg.host, timeout=httpx.Timeout(30))
    url = httpx.URL(path=request.url.path.replace("/sqlwarehouse/", ""))

    if request.method == "PUT":
        dest_dir = get_seg_dest_dir(request)
        url = httpx.URL(
            path=re.sub(r"/Volumes/.*?/ohif/exports/", f"{dest_dir}/", url.path)
        )
        log(f"Overriding dest dir to {dest_dir}", request, "debug")

    rp_req = client.build_request(
        request.method,
        url,
        headers={
            "Authorization": "Bearer " + request.headers.get("X-Forwarded-Access-Token"),
            "User-Agent": f"DatabricksPixels/{dbx_pixels_version}",
        },
        content=request.stream(),
    )

    rp_resp = await client.send(rp_req, stream=True)
    return StreamingResponse(
        rp_resp.aiter_raw(),
        status_code=rp_resp.status_code,
        headers=rp_resp.headers,
        background=BackgroundTask(rp_resp.aclose),
    )


# ── Wire proxy routes ─────────────────────────────────────────────────
app.add_route(
    "/sqlwarehouse/api/2.0/sql/statements/{path:path}",
    _reverse_proxy_statements, ["POST", "GET"],
)
app.add_route(
    "/sqlwarehouse/api/2.0/fs/files/{path:path}",
    _reverse_proxy_files_multiframe, ["GET", "PUT"],
)
app.add_route(
    "/sqlwarehouse/api/2.0/fs/files_wsi/{path:path}",
    _reverse_proxy_files_multiframe, ["GET"],
)
app.add_route(
    "/sqlwarehouse/api/2.0/fs/files_metadata/{path:path}",
    _reverse_proxy_files_metadata, ["GET"],
)

# ── Middleware (order matters: first added = outermost) ────────────────
app.add_middleware(TokenMiddleware)
app.add_middleware(LoggingMiddleware)

# ── Shared common routes (OHIF, MONAI, redaction, VLM) ────────────────
register_all_common_routes(app)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", log_config=None)
