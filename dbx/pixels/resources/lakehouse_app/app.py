import base64
import json
import os
import os.path
from pathlib import Path

import httpx
import uvicorn
from databricks.sdk import WorkspaceClient
from databricks.sdk.core import Config
from fastapi import FastAPI, HTTPException, Response
from fastapi.staticfiles import StaticFiles
from mlflow.deployments import get_deploy_client
from requests_toolbelt import MultipartEncoder
from starlette.background import BackgroundTask
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.requests import Request
from starlette.responses import StreamingResponse

import dbx.pixels.resources

# Initialize the Databricks Workspace Client
w = WorkspaceClient()

client = get_deploy_client("databricks")

cfg = Config()
os.environ["DATABRICKS_TOKEN"] = cfg.authenticate()["Authorization"].split(" ")[1]
os.environ["DATABRICKS_HOST"] = f"https://{os.environ['DATABRICKS_HOST']}"

table = os.environ["DATABRICKS_PIXELS_TABLE"]
warehouse_id = os.environ["DATABRICKS_WAREHOUSE_ID"]
serving_endpoint = os.environ["MONAI_SERVING_ENDPOINT"]

path = Path(dbx.pixels.__file__).parent
ohif_path = f"{path}/resources/ohif"

dataset = ['SmartCacheDataset', 'CacheDataset', 'PersistentDataset', 'Dataset']
dataloader = ['ThreadDataLoader', 'DataLoader']
tracking = ['mlflow', '']

file = "app-config"

with open(f"{ohif_path}/{file}.js", "r") as config_input:
    with open(f"{ohif_path}/{file}-custom.js", "w") as config_custom:
        config_custom.write(
            config_input.read().replace("{ROUTER_BASENAME}", "").replace("{PIXELS_TABLE}", table)
        )

app = FastAPI(title="Pixels")


async def _reverse_proxy_statements(request: Request):
    client = httpx.AsyncClient(base_url=cfg.host, timeout=httpx.Timeout(30))
    # Replace proxy url with right endpoint
    url = httpx.URL(path=request.url.path.replace("/sqlwarehouse/", ""))
    # Replace SQL Warehouse parameter
    if request.method == "POST":
        body = await request.json()
        body["warehouse_id"] = os.environ["DATABRICKS_WAREHOUSE_ID"]
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


async def _reverse_proxy_monai(request: Request):
    # Replace proxy url with right endpoint
    url = httpx.URL(path=request.url.path.replace("/monai/", "/"))

    if "info" in str(url):
        to_send = {"input": {"action": "info"}}

    resp = ""

    # Query the Databricks serving endpoint
    try:

        resp = client.predict(
            endpoint=serving_endpoint,
            inputs={"inputs": to_send},
        )

        return Response(content=resp.predictions, media_type="application/json")
    except Exception as e:
        print(e)
        resp = {"message": f"Error querying model: {e}"}
        return Response(content=str(resp), media_type="application/text", status_code=500)


async def _reverse_proxy_monai_infer_post(request: Request):
    url = httpx.URL(path=request.url.path.replace("/monai/", "/"))
    params = request.query_params
    form_data = await request.form()

    to_send = json.loads(form_data.get("params"))
    to_send["model"] = str(url).split("/")[2]
    to_send["image"] = params["image"]
    del to_send["result_compress"]  # TODO fix boolean type in model

    print({"inputs": {"input": {"infer": to_send}}})

    resp = ""

    # Query the Databricks serving endpoint
    try:

        res_json = json.loads(
            client.predict(
                endpoint=serving_endpoint, inputs={"inputs": {"input": {"infer": to_send}}}
            ).predictions
        )

        file_path = res_json["file"]

        resp_file = json.loads(
            client.predict(
                endpoint=serving_endpoint, inputs={"inputs": {"input": {"get_file": file_path}}}
            ).predictions
        )

        res_fields = dict()
        res_fields["params"] = (None, json.dumps(res_json["params"]), "application/json")
        res_fields["image"] = (
            file_path,
            base64.b64decode(resp_file["file_content"]),
            "application/octet-stream",
        )

        return_message = MultipartEncoder(fields=res_fields)
        return Response(content=return_message.to_string(), media_type=return_message.content_type)
    except Exception as e:
        print(e)
        resp = {"message": f"Error querying model: {e}"}
        return Response(content=json.dumps(resp), media_type="application/json", status_code=500)


async def _reverse_proxy_monai_nextsample_post(request: Request):
    url = httpx.URL(path=request.url.path.replace("/monai/", "/"))

    to_send = {"action": str(url)[1:]}
    resp = ""

    # Query the Databricks serving endpoint
    try:

        res_json = client.predict(endpoint=serving_endpoint, inputs={"inputs": {"input": to_send}})
        return Response(content=res_json.predictions, media_type="application/json")
    except Exception as e:
        print(e)
        resp = {"message": f"Error querying model: {e}"}
        return Response(content=json.dumps(resp), media_type="application/json", status_code=500)


async def _reverse_proxy_monai_train_post(request: Request):
    url = httpx.URL(path=request.url.path.replace("/monai/", "/"))
    body = await request.json()
    model = list(body.keys())[0]
    to_send = body[model]
    to_send["model"] = model

    if(type(body[model]["dataset"]) is list):
        to_send["dataset"] = body[model]["dataset"][0]
    elif(type(body[model]["dataset"]) is int):
        to_send["dataset"] = dataset[body[model]["dataset"]]

    if(type(body[model]["dataloader"]) is list):
        to_send["dataloader"] = body[model]["dataloader"][0]
    elif(type(body[model]["dataloader"]) is int):
        to_send["dataloader"] = dataloader[body[model]["dataloader"]]

    if(type(body[model]["tracking"]) is list):
        to_send["tracking"] = ''
    elif(type(body[model]["tracking"]) is int):
        to_send["tracking"] = tracking[body[model]["tracking"]]

    print({"inputs": {"input": {"train": to_send}}})

    resp = ""

    # Query the Databricks serving endpoint
    try:

        res_json = client.predict(
            endpoint=serving_endpoint, inputs={"inputs": {"input": {"train": to_send}}}
        )

        return Response(content=res_json.predictions, media_type="application/json")
    except Exception as e:
        print(e)
        resp = {"message": f"Error querying model: {e}"}
        return Response(content=json.dumps(resp), media_type="application/json", status_code=500)


class DBStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        try:
            return await super().get_response(path, scope)
        except (HTTPException, StarletteHTTPException) as ex:
            if ex.status_code == 404:
                return await super().get_response("index.html", scope)
            else:
                raise ex


app.add_route(
    "/sqlwarehouse/api/2.0/sql/statements/{path:path}", _reverse_proxy_statements, ["POST", "GET"]
)
app.add_route("/sqlwarehouse/api/2.0/fs/files/{path:path}", _reverse_proxy_files, ["GET", "PUT"])

app.add_route("/monai/{path:path}", _reverse_proxy_monai, ["GET", "PUT"])
app.add_route("/monai/infer/{path:path}", _reverse_proxy_monai_infer_post, ["POST"])
app.add_route("/monai/activelearning/{path:path}", _reverse_proxy_monai_nextsample_post, ["POST"])
app.add_route("/monai/train/{path:path}", _reverse_proxy_monai_train_post, ["POST"])

app.mount("/", DBStaticFiles(directory=f"{ohif_path}", html=True), name="ohif")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0")
