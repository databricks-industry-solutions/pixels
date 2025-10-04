import base64
import json
import os
import os.path
import re
from pathlib import Path

import httpx
import uvicorn
import zstd
from databricks.sdk.core import Config
from fastapi import FastAPI, HTTPException, Response
from fastapi.staticfiles import StaticFiles
from starlette.background import BackgroundTask
from starlette.concurrency import run_in_threadpool
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import (
    HTMLResponse,
    JSONResponse,
    RedirectResponse,
    StreamingResponse,
)
from utils.pages import config_page
from utils.partial_frames import get_file_part, pixel_frames_from_dcm_metadata_file

import dbx.pixels.resources
import dbx.pixels.version as dbx_pixels_version
from dbx.pixels.databricks_file import DatabricksFile
from dbx.pixels.lakebase import LakebaseUtils
from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("OHIF")

cfg = Config()

warehouse_id = os.getenv("DATABRICKS_WAREHOUSE_ID", None)
assert warehouse_id is not None, "[DATABRICKS_WAREHOUSE_ID] is not set, check app.yml"

if "MONAI_SERVING_ENDPOINT" in os.environ:
    serving_endpoint = os.environ["MONAI_SERVING_ENDPOINT"]
else:
    serving_endpoint = ""

path = Path(dbx.pixels.__file__).parent
ohif_path = f"{path}/resources/ohif"
file = "app-config"

dataset = ["SmartCacheDataset", "CacheDataset", "PersistentDataset", "Dataset"]
dataloader = ["ThreadDataLoader", "DataLoader"]
tracking = ["mlflow", ""]

lb_utils = LakebaseUtils(instance_name=os.environ["LAKEBASE_INSTANCE_NAME"])

app = FastAPI(title="Pixels")

cache_segmentations = {}


def get_pixels_table(request: Request):
    if request.cookies.get("pixels_table"):
        return request.cookies.get("pixels_table")
    else:
        return os.environ["DATABRICKS_PIXELS_TABLE"]


def get_seg_dest_dir(request: Request):
    if request.cookies.get("seg_dest_dir"):
        return request.cookies.get("seg_dest_dir")
    else:
        paths = get_pixels_table(request).split(".")
        return f"/Volumes/{paths[0]}/{paths[1]}/pixels_volume/ohif/exports/"


def log(message, request, log_type="info"):
    if request:
        email = request.headers.get("X-Forwarded-Email")
    else:
        email = ""

    if log_type == "error":
        logger.error(f"{email} | {message}")
    elif log_type == "debug":
        logger.debug(f"{email} | {message}")
    elif log_type == "info":
        logger.info(f"{email} | {message}")


async def _reverse_proxy_statements(request: Request):
    client = httpx.AsyncClient(base_url=cfg.host, timeout=httpx.Timeout(30))
    # Replace proxy url with right endpoint
    url = httpx.URL(path=request.url.path.replace("/sqlwarehouse/", ""))
    # Replace SQL Warehouse parameter
    if request.method == "POST":
        body = await request.json()
        body["warehouse_id"] = os.environ["DATABRICKS_WAREHOUSE_ID"]

        dest_dir = get_seg_dest_dir(request)
        body["statement"] = re.sub(r"Volumes/.*?/ohif/exports/", f"{dest_dir}/", body["statement"])
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


async def _reverse_proxy_files_multiframe(request: Request):
    client = httpx.AsyncClient(base_url=cfg.host, timeout=httpx.Timeout(30))
    # Replace proxy url with right endpoint
    url = httpx.URL(
        path=request.url.path.replace("/sqlwarehouse/", "").replace("/files_wsi/", "/files/")
    )

    # Parse and validate the path using DatabricksFile
    # Validation happens automatically during construction
    try:
        # Extract the volume path from URL (e.g., /api/2.0/fs/files/Volumes/catalog/schema/volume/path)
        # Remove the API prefix to get just the Volumes path
        volume_path = url.path.replace("/api/2.0/fs/files/", "").replace("/files/", "")
        db_file = DatabricksFile.from_full_path(volume_path)
    except ValueError as e:
        log(f"Invalid file path: {e}", request, "error")
        raise HTTPException(status_code=400, detail=f"Invalid file path: {e}")

    if "frames" in request.query_params:  # WSI Multi Frame images
        param_frames = int(request.query_params.get("frames"))
    elif "frame" in str(url):  # Multi Frame images
        param_frames = int(re.search(r"&frame=(\d+)", str(url)).group(1))
        url = str(url).split("&frame=")[0]
    else:
        return await _reverse_proxy_files(request)

    results = await run_in_threadpool(lambda: lb_utils.retrieve_frame_range(str(url), param_frames))

    frame_metadata = {}

    if results is not None:
        frame_metadata = results
    else:
        # get latest available index
        results = await run_in_threadpool(lambda: lb_utils.retrieve_max_frame_range(url))

        max_frame_idx = results["max_frame_idx"]
        max_start_pos = results["max_start_pos"]

        pixels_metadata = await run_in_threadpool(
            lambda: pixel_frames_from_dcm_metadata_file(
                request, db_file, param_frames, max_frame_idx, max_start_pos
            )
        )

        lb_utils.insert_frame_ranges(url, pixels_metadata["frames"])

        frame_metadata = pixels_metadata["frames"][param_frames - 1 - max_frame_idx]
        frame_metadata["pixel_data_pos"] = pixels_metadata["pixel_data_pos"]

    frame_content = await run_in_threadpool(lambda: get_file_part(request, db_file, frame_metadata))

    return Response(
        content=zstd.compress(frame_content),
        media_type="application/octet-stream",
        headers={"Content-Encoding": "zstd"},
    )


async def _reverse_proxy_files(request: Request):
    client = httpx.AsyncClient(base_url=cfg.host, timeout=httpx.Timeout(30))
    # Replace proxy url with right endpoint
    url = httpx.URL(path=request.url.path.replace("/sqlwarehouse/", ""))

    if request.method == "PUT":
        dest_dir = get_seg_dest_dir(request)
        url = httpx.URL(path=re.sub(r"/Volumes/.*?/ohif/exports/", f"{dest_dir}/", url.path))
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


def _reverse_proxy_monai(request: Request):
    from mlflow.deployments import get_deploy_client

    # Replace proxy url with right endpoint
    url = httpx.URL(path=request.url.path.replace("/monai/", "/"))

    if request.cookies.get("is_local") and request.cookies.get("is_local").lower() == "true":
        return JSONResponse(
            status_code=501, content={"message": "Local files are not supported yet"}
        )

    if "info" in str(url):
        to_send = {"input": {"action": "info"}}

    resp = ""

    # Query the Databricks serving endpoint
    try:
        resp = get_deploy_client("databricks").predict(
            endpoint=serving_endpoint,
            inputs={"inputs": to_send},
        )
        if '"background",' in resp.predictions:
            resp.predictions = resp.predictions.replace('"background",', "")

        return Response(content=resp.predictions, media_type="application/json")
    except Exception as e:
        log(e, request, "error")
        resp = {"message": f"Error querying model: {e}"}
        return Response(content=str(resp), media_type="application/text", status_code=500)


async def _reverse_proxy_monai_infer_post(request: Request):
    """
    Reverse proxy endpoint for MONAI inference POST requests with intelligent caching.

    This function handles medical image segmentation inference requests by acting as a proxy
    between the OHIF viewer frontend and Databricks-hosted MONAI models. It implements
    a two-stage process: inference execution and file retrieval, with caching to optimize
    performance for repeated requests on the same image.

    Args:
        request (Request): FastAPI request object containing:
            - Form data with 'params' (JSON string with inference parameters)
            - Query parameters including 'image' (image identifier)
            - URL path containing the model name

    Returns:
        Response:
            - Success: Binary segmentation data as application/octet-stream (uint8 format)
            - Error: JSON error message with 500 status code

    Process Flow:
        1. Extract and clean inference parameters from request
        2. Check cache for existing segmentation results
        3. If not cached: Execute inference on Databricks serving endpoint
        4. Retrieve segmentation file content from serving endpoint
        5. Return binary segmentation data to client

    Caching Strategy:
        - Uses global cache_segmentations dict keyed by image identifier
        - Stores file_path and params for each processed image
        - Avoids redundant inference calls for the same image
        - Cleans up cache entries on errors

    Error Handling:
        - Logs all errors for debugging
        - Removes corrupted cache entries on failure
        - Returns structured error responses
    """
    from mlflow.deployments import get_deploy_client

    # Parse request components
    url = httpx.URL(path=request.url.path.replace("/monai/", "/"))
    q_params = request.query_params
    form_data = await request.form()

    # Extract and prepare inference parameters
    to_send = json.loads(form_data.get("params"))
    to_send["model"] = str(url).split("/")[2]  # Extract model name from URL path
    to_send["image"] = q_params["image"]  # Add image identifier from query params

    # Remove parameters not supported by the backend model
    del to_send["result_compress"]  # TODO fix boolean type in model

    # Clean up optional parameters that may cause issues with the model
    if "model_filename" in to_send:
        del to_send["model_filename"]
    if "sw_batch_size" in to_send:
        del to_send["sw_batch_size"]
    if "sw_overlap" in to_send:
        del to_send["sw_overlap"]
    if "highres" in to_send:
        del to_send["highres"]

    # Add pixels table information for data access
    to_send["pixels_table"] = get_pixels_table(request)

    # Log the inference request for debugging
    log({"inputs": {"input": {"infer": to_send}}}, request, "debug")

    resp = ""

    # Execute inference with caching and error handling
    try:
        # Check if segmentation already exists in cache
        if q_params["image"] not in cache_segmentations:
            # Cache miss: Execute new inference request
            file_res = await run_in_threadpool(
                lambda: get_deploy_client("databricks").predict(
                    endpoint=serving_endpoint, inputs={"inputs": {"input": {"infer": to_send}}}
                )
            )

            # Parse inference response to get file location and parameters
            res_json = json.loads(file_res.predictions)
            file_path = res_json["file"]
            params = res_json["params"]

            # Cache the results for future requests
            cache_segmentations[q_params["image"]] = {"file_path": file_path, "params": params}
        else:
            # Cache hit: Retrieve existing file path and parameters
            file_path = cache_segmentations[q_params["image"]]["file_path"]
            params = cache_segmentations[q_params["image"]]["params"]

        # Retrieve the actual segmentation file content
        file_content = await run_in_threadpool(
            lambda: get_deploy_client("databricks").predict(
                endpoint=serving_endpoint,
                inputs={"inputs": {"input": {"get_file": file_path, "result_dtype": "uint8"}}},
            )
        )

        # Decode and return the binary segmentation data
        return Response(
            content=base64.b64decode(json.loads(file_content.predictions)["file_content"]),
            media_type="application/octet-stream",
        )
    except Exception as e:
        # Log error and clean up corrupted cache entry
        log(e, request, "error")
        resp = {"message": f"Error querying model: {e}"}

        # Remove potentially corrupted cache entry
        if q_params["image"] in cache_segmentations:
            del cache_segmentations[q_params["image"]]

        return Response(content=json.dumps(resp), media_type="application/json", status_code=500)


def _reverse_proxy_monai_nextsample_post(request: Request):
    from mlflow.deployments import get_deploy_client

    url = httpx.URL(path=request.url.path.replace("/monai/", "/"))

    to_send = {"action": str(url)[1:]}

    to_send["pixels_table"] = get_pixels_table(request)

    resp = ""

    # Query the Databricks serving endpoint
    try:
        res_json = get_deploy_client("databricks").predict(
            endpoint=serving_endpoint, inputs={"inputs": {"input": to_send}}
        )
        return Response(content=res_json.predictions, media_type="application/json")
    except Exception as e:
        log(e, request, "error")
        resp = {"message": f"Error querying model: {e}"}
        return Response(content=json.dumps(resp), media_type="application/json", status_code=500)


async def _reverse_proxy_monai_train_post(request: Request):
    from mlflow.deployments import get_deploy_client

    url = httpx.URL(path=request.url.path.replace("/monai/", "/"))
    body = await request.json()
    model = list(body.keys())[0]
    to_send = body[model]
    to_send["model"] = model

    if type(body[model]["dataset"]) is list:
        to_send["dataset"] = body[model]["dataset"][0]
    elif type(body[model]["dataset"]) is int:
        to_send["dataset"] = dataset[body[model]["dataset"]]

    if type(body[model]["dataloader"]) is list:
        to_send["dataloader"] = body[model]["dataloader"][0]
    elif type(body[model]["dataloader"]) is int:
        to_send["dataloader"] = dataloader[body[model]["dataloader"]]

    if type(body[model]["tracking"]) is list:
        to_send["tracking"] = ""
    elif type(body[model]["tracking"]) is int:
        to_send["tracking"] = tracking[body[model]["tracking"]]

    to_send["pixels_table"] = get_pixels_table(request)

    log({"inputs": {"input": {"train": to_send}}}, request, "debug")

    resp = ""

    # Query the Databricks serving endpoint
    try:
        res_json = await run_in_threadpool(
            lambda: get_deploy_client("databricks").predict(
                endpoint=serving_endpoint, inputs={"inputs": {"input": {"train": to_send}}}
            )
        )

        return Response(content=res_json.predictions, media_type="application/json")
    except Exception as e:
        log(e, request, "error")
        resp = {"message": f"Error querying model: {e}"}
        return Response(content=json.dumps(resp), media_type="application/json", status_code=500)


class TokenMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        if request.url.path.endswith("app-config-custom.js"):
            pixels_table = get_pixels_table(request)

            body = open(f"{ohif_path}/{file}.js", "rb").read()
            new_body = (
                body.replace(b"{ROUTER_BASENAME}", b"/ohif/")
                .replace(b"{PIXELS_TABLE}", pixels_table.encode())
                .replace(b"{HOST_NAME}", b"/sqlwarehouse")
            )

            return Response(content=new_body, media_type="text/javascript")
        elif request.url.path.endswith("local"):
            body = open(f"{ohif_path}/index.html", "rb").read()
            return Response(content=body.replace(b"./", b"/ohif/"), media_type="text/html")
        response = await call_next(request)
        return response


app.add_middleware(TokenMiddleware)


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        email = request.headers.get("X-Forwarded-Email")
        response = await call_next(request)
        logger.info(f" {email} | {request.method} {request.url.path} {response.status_code}")
        return response


app.add_middleware(LoggingMiddleware)


class DBStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        try:
            return await super().get_response(path, scope)
        except (HTTPException, StarletteHTTPException) as ex:
            if ex.status_code == 404:
                return await super().get_response("index.html", scope)
            else:
                raise ex


@app.get("/ohif/viewer/{path:path}")
async def local_redirect_viewer(request: Request):
    file_requested = httpx.URL(path=request.url.path.replace("/viewer/", "/"))
    return RedirectResponse(file_requested.path, status_code=302)


@app.get("/ohif/segmentation/{path:path}")
async def local_redirect_segmentation(request: Request):
    file_requested = httpx.URL(path=request.url.path.replace("/segmentation/", "/"))
    return RedirectResponse(file_requested.path, status_code=302)


@app.get("/ohif/monai-label/{path:path}")
async def local_redirect_monai(request: Request):
    file_requested = httpx.URL(path=request.url.path.replace("/monai-label/", "/"))
    return RedirectResponse(file_requested.path, status_code=302)


app.add_route(
    "/sqlwarehouse/api/2.0/sql/statements/{path:path}", _reverse_proxy_statements, ["POST", "GET"]
)
app.add_route(
    "/sqlwarehouse/api/2.0/fs/files/{path:path}", _reverse_proxy_files_multiframe, ["GET", "PUT"]
)
app.add_route(
    "/sqlwarehouse/api/2.0/fs/files_wsi/{path:path}", _reverse_proxy_files_multiframe, ["GET"]
)

app.add_route("/monai/{path:path}", _reverse_proxy_monai, ["GET", "PUT"])
app.add_route("/monai/infer/{path:path}", _reverse_proxy_monai_infer_post, ["POST"])
app.add_route("/monai/activelearning/{path:path}", _reverse_proxy_monai_nextsample_post, ["POST"])
app.add_route("/monai/train/{path:path}", _reverse_proxy_monai_train_post, ["POST"])

app.add_route("/monai/train/{path:path}", _reverse_proxy_monai_train_post, ["POST"])

app.mount("/ohif/", DBStaticFiles(directory=f"{ohif_path}", html=True), name="ohif")
app.mount(
    "/dicom-microscopy-viewer/",
    DBStaticFiles(directory=f"{ohif_path}/dicom-microscopy-viewer", html=True),
    name="dicom-microscopy-viewer",
)


@app.get("/", response_class=HTMLResponse)
async def main_page(request: Request):
    pixels_table = get_pixels_table(request)
    seg_dest_dir = get_seg_dest_dir(request)
    return config_page(pixels_table, seg_dest_dir)


@app.post("/set_cookie")
async def set_cookie(request: Request):
    form_data = await request.form()
    pixels_table = form_data.get("pixels_table")
    seg_dest_dir = form_data.get("seg_dest_dir")
    path = form_data.get("path")

    if not seg_dest_dir.startswith("/Volumes/"):
        raise HTTPException(status_code=400, detail="Destination directory must be in Volumes")

    response = RedirectResponse(url=path, status_code=302)
    response.set_cookie(key="pixels_table", value=pixels_table)
    response.set_cookie(key="seg_dest_dir", value=seg_dest_dir)
    response.set_cookie(key="is_local", value=("local" in path))
    return response


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", log_config=None)
