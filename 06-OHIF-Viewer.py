# Databricks notebook source
# MAGIC %pip install fastapi uvicorn httpx databricks-sdk --upgrade 

# COMMAND ----------

dbutils.library.restartPython()

# COMMAND ----------

import os
from databricks.sdk import WorkspaceClient
from dbruntime.databricks_repl_context import get_context

w = WorkspaceClient()

dbutils.widgets.text("table", "main.pixels_solacc.object_catalog", label="1.0 Catalog Schema Table to store object metadata into")
dbutils.widgets.text("sqlWarehouseID", "", label="2.0 SQL Warehouse")

sql_warehouse_id = dbutils.widgets.get("sqlWarehouseID")
table = dbutils.widgets.get("table")

if not spark.catalog.tableExists(table):
    raise Exception("The configured table does not exist!")

if sql_warehouse_id == "":
    raise Exception("SQL Warehouse ID is mandatory!")
else:
    wh = w.warehouses.get(id=sql_warehouse_id)
    os.environ['DATABRICKS_WAREHOUSE_ID'] = sql_warehouse_id
    print(f"Using '{wh.as_dict()['name']}' as SQL Warehouse")

workspace_id = get_context().workspaceId
cluster_id = get_context().clusterId
os.environ["DATABRICKS_TOKEN"] = get_context().apiToken
os.environ['DATABRICKS_HOST'] = f"https://{get_context().browserHostName}"

# COMMAND ----------

# MAGIC %md
# MAGIC <h1> Inject current workspace and cluster configuration

# COMMAND ----------

import fileinput
import os.path
from pathlib import Path
import dbx.pixels.resources

path = Path(dbx.pixels.__file__).parent
ohif_path = (f"{path}/resources/ohif")

file = "app-config"

with open(f"{ohif_path}/{file}.js", "r") as config_input:
        with open(f"{ohif_path}/{file}-custom.js", "w") as config_custom:
            config_custom.write(
                config_input.read()
                .replace("{ROUTER_BASENAME}",f"/driver-proxy/o/{workspace_id}/{cluster_id}/3000/")
                .replace("{PIXELS_TABLE}",table)
            )

# COMMAND ----------

# MAGIC %md
# MAGIC <h1> Configure proxy 

# COMMAND ----------

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles

from starlette.requests import Request
from starlette.responses import StreamingResponse, JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.background import BackgroundTask
from starlette.exceptions import HTTPException as StarletteHTTPException

import os
import json
import httpx
import uvicorn

app = FastAPI(title="Pixels")

async def _reverse_proxy_statements(request: Request):
    client = httpx.AsyncClient(base_url=os.environ['DATABRICKS_HOST'], timeout=httpx.Timeout(30))
    #Replace proxy url with right endpoint
    url = httpx.URL(path=request.url.path.replace("/sqlwarehouse/",""))

    #Replace SQL Warehouse parameter
    body = await request.json()
    body['warehouse_id'] = os.environ['DATABRICKS_WAREHOUSE_ID']

    rp_req = client.build_request(request.method, url,
                                  headers={
                                      "Authorization": f"Bearer {os.environ['DATABRICKS_TOKEN']}"
                                  }, content = json.dumps(body).encode('utf-8'))
    
    rp_resp = await client.send(rp_req, stream=True)
    return StreamingResponse(
        rp_resp.aiter_raw(),
        status_code=rp_resp.status_code,
        headers=rp_resp.headers,
        background=BackgroundTask(rp_resp.aclose),
    )

async def _reverse_proxy_files(request: Request):
    client = httpx.AsyncClient(base_url=os.environ['DATABRICKS_HOST'], timeout=httpx.Timeout(30))
    #Replace proxy url with right endpoint
    url = httpx.URL(path=request.url.path.replace("/sqlwarehouse/",""))

    rp_req = client.build_request(request.method, url,
                                  headers={
                                      "Authorization": f"Bearer {os.environ['DATABRICKS_TOKEN']}"
                                  }, content = request.stream())
    
    rp_resp = await client.send(rp_req, stream=True)
    return StreamingResponse(
        rp_resp.aiter_raw(),
        status_code=rp_resp.status_code,
        headers=rp_resp.headers,
        background=BackgroundTask(rp_resp.aclose),
    )

class DBStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        try:
            return await super().get_response(path, scope)
        except (HTTPException, StarletteHTTPException) as ex:
            if ex.status_code == 404:
                return await super().get_response("index.html", scope)
            else:
                raise ex

app.add_route("/sqlwarehouse/api/2.0/sql/statements/{path:path}", _reverse_proxy_statements, ["POST", "GET"])
app.add_route("/sqlwarehouse/api/2.0/fs/files/{path:path}", _reverse_proxy_files, ["GET", "PUT"])
app.mount("/", DBStaticFiles(directory=f"{ohif_path}",html = True), name="ohif")


# COMMAND ----------

displayHTML(f"<a href='https://dbc-dp-{get_context().workspaceId}.cloud.databricks.com/driver-proxy/o/{get_context().workspaceId}/{get_context().clusterId}/3000/'> Click to go to OHIF Viewer!</a>")

config = uvicorn.Config(
    app,
    host="0.0.0.0",
    port=3000,
  )
server = uvicorn.Server(config)
await server.serve()
