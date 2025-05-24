import base64
import json
import os
import os.path
import re
from pathlib import Path

import httpx
import uvicorn
from databricks.sdk.core import Config
from fastapi import FastAPI, HTTPException, Response
from fastapi.staticfiles import StaticFiles
from requests_toolbelt import MultipartEncoder
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

import dbx.pixels.resources
from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("OHIF")

cfg = Config()

warehouse_id = os.environ["DATABRICKS_WAREHOUSE_ID"]

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
    email = request.headers.get("X-Forwarded-Email")
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
        request.method, url, headers=cfg.authenticate(), content=json.dumps(body).encode("utf-8")
    )

    rp_resp = await client.send(rp_req, stream=True)
    return StreamingResponse(
        rp_resp.aiter_raw(),
        status_code=rp_resp.status_code,
        headers=rp_resp.headers,
        background=BackgroundTask(rp_resp.aclose),
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
        request.method, url, headers=cfg.authenticate(), content=request.stream()
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

        return Response(content=resp.predictions, media_type="application/json")
    except Exception as e:
        log(e, request, "error")
        resp = {"message": f"Error querying model: {e}"}
        return Response(content=str(resp), media_type="application/text", status_code=500)


async def _reverse_proxy_monai_infer_post(request: Request):
    from mlflow.deployments import get_deploy_client

    url = httpx.URL(path=request.url.path.replace("/monai/", "/"))
    q_params = request.query_params
    form_data = await request.form()

    to_send = json.loads(form_data.get("params"))
    to_send["model"] = str(url).split("/")[2]
    to_send["image"] = q_params["image"]
    del to_send["result_compress"]  # TODO fix boolean type in model

    if "vista3d" in to_send["model"]:
        to_send["pixels_table"] = get_pixels_table(request)
    else:
        log("Table override not available in this model", request)

    log({"inputs": {"input": {"infer": to_send}}}, request, "debug")

    resp = ""

    # Query the Databricks serving endpoint
    try:

        if q_params["image"] not in cache_segmentations:
            file_res = await run_in_threadpool(
                lambda: get_deploy_client("databricks").predict(
                    endpoint=serving_endpoint, inputs={"inputs": {"input": {"infer": to_send}}}
                )
            )

            res_json = json.loads(file_res.predictions)

            file_path = res_json["file"]
            params = res_json["params"]
            cache_segmentations[q_params["image"]] = {"file_path": file_path, "params": params}
        else:
            file_path = cache_segmentations[q_params["image"]]["file_path"]
            params = cache_segmentations[q_params["image"]]["params"]

        file_content = await run_in_threadpool(
            lambda: get_deploy_client("databricks").predict(
                endpoint=serving_endpoint, inputs={"inputs": {"input": {"get_file": file_path}}}
            )
        )

        res_fields = dict()
        res_fields["params"] = (None, json.dumps(params), "application/json")
        res_fields["image"] = (
            file_path,
            base64.b64decode(json.loads(file_content.predictions)["file_content"]),
            "application/octet-stream",
        )

        return_message = MultipartEncoder(fields=res_fields)
        return Response(content=return_message.to_string(), media_type=return_message.content_type)
    except Exception as e:
        log(e, request, "error")
        resp = {"message": f"Error querying model: {e}"}

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

            user_token = request.headers.get("X-Forwarded-Access-Token")
            if user_token:
                new_body  # TODO
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
app.add_route("/sqlwarehouse/api/2.0/fs/files/{path:path}", _reverse_proxy_files, ["GET", "PUT"])

app.add_route("/monai/{path:path}", _reverse_proxy_monai, ["GET", "PUT"])
app.add_route("/monai/infer/{path:path}", _reverse_proxy_monai_infer_post, ["POST"])
app.add_route("/monai/activelearning/{path:path}", _reverse_proxy_monai_nextsample_post, ["POST"])
app.add_route("/monai/train/{path:path}", _reverse_proxy_monai_train_post, ["POST"])

app.mount("/ohif/", DBStaticFiles(directory=f"{ohif_path}", html=True), name="ohif")


@app.get("/", response_class=HTMLResponse)
async def main_page(request: Request):
    pixels_table = get_pixels_table(request)
    seg_dest_dir = get_seg_dest_dir(request)
    return f"""
    <html>
        <head>
            <title>Pixels Solution Accelerator</title>
            <link rel="stylesheet" type="text/css" href="https://ui-assets.cloud.databricks.com/login/vendor-jquery.5c80d7f6.chunk.css" crossorigin="anonymous">
            <link rel="stylesheet" type="text/css" href="https://ui-assets.cloud.databricks.com/login/70577.563792a4.chunk.css" crossorigin="anonymous">
            <link rel="stylesheet" type="text/css" href="https://ui-assets.cloud.databricks.com/login/59976.a356be26.chunk.css" crossorigin="anonymous">
            <link rel="stylesheet" type="text/css" href="https://ui-assets.cloud.databricks.com/login/62569.22f26a3b.chunk.css" crossorigin="anonymous">
            <script>document.cookie = "MONAILABEL_SERVER_URL="+window.location.origin+"/monai/; Path=/; Expires=Session;"</script>
        </head>
        <body class="light-mode dark-mode-supported">
        <uses-legacy-bootstrap>
            <div id="login-page">
                <div>
                    <div id="login-container" class="container">
                    <img src="https://{os.environ['DATABRICKS_HOST']}/login/logo_2020/databricks.svg" class="login-logo" style="width: 200px;">
                        <div class="login-form" style="min-width:600px">
                            <h3 class="sub-header">Pixels Solution Accelerator</h3>
                            <div class="tab-child">
                            <p class="instructions">This form allows you to customize some configurations of the ohif viewer.</p>
                            <form action="/set_cookie" id="config" method="post">
                                <p class="instructions">Select your preferred pixels catalog table.</p>
                                <input type="text" id="pixels_table" name="pixels_table" value="{pixels_table}" style="width:100%" required>
                                <p class="instructions">Choose the destination directory for the ohif segmentation and measurements results.</p>
                                <input type="text" id="seg_dest_dir" name="seg_dest_dir" value="{seg_dest_dir}" style="width:100%" required>
                                <p class="instructions">Only Volumes are supported</p>
                                <button name="path" value="/ohif/" class="btn btn-primary btn-large" type="submit">Confirm</button>
                                <button name="path" value="/ohif/local?" class="btn btn-secondary btn-large" type="submit">Browse local files</button>
                            </form>
                            </div>
                        </div>
                    </div>
                    <div class="terms-of-service-footer"><a href="https://databricks.com/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> | <a href="https://databricks.com/terms-of-use" target="_blank" rel="noopener noreferrer">Terms of Use</a></div><div style="margin: 20px auto; text-align: center;">
                    </div>
                </div>
            </div>
        </uses-legacy-bootstrap>
        </body>
    </html>
    """


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
