# Databricks notebook source
# MAGIC %pip install dbtunnel[fastapi] httpx databricks-sdk --upgrade 

# COMMAND ----------

dbutils.library.restartPython()

# COMMAND ----------

from databricks.sdk import WorkspaceClient

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
    print(f"Using '{wh.as_dict()['name']}' as SQL Warehouse")

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

workspace_id = spark.conf.get("spark.databricks.clusterUsageTags.clusterOwnerOrgId")
cluster_id = spark.conf.get("spark.databricks.clusterUsageTags.clusterId")

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

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from starlette.requests import Request
from starlette.responses import StreamingResponse
from starlette.background import BackgroundTask

import os
import json

import httpx

app = FastAPI(title="Pixels")


from fastapi.staticfiles import StaticFiles

from starlette.requests import Request
from starlette.responses import StreamingResponse, Response
from starlette.background import BackgroundTask

import os
import json

import httpx

app = FastAPI(title="Pixels")

async def _reverse_proxy_statements(request: Request):
    client = httpx.AsyncClient(base_url=os.environ['DATABRICKS_HOST'])
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
    client = httpx.AsyncClient(base_url=os.environ['DATABRICKS_HOST'])
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

app.add_route("/sqlwarehouse/api/2.0/sql/statements/{path:path}", _reverse_proxy_statements, ["POST", "GET"])
app.add_route("/sqlwarehouse/api/2.0/fs/files/{path:path}", _reverse_proxy_files, ["GET", "PUT"])

app.mount("/", StaticFiles(directory=f"{ohif_path}",html = True), name="ohif")

# COMMAND ----------

from dbtunnel import dbtunnel
dbtunnel.fastapi(app, port=3000).inject_auth().inject_env(
  DATABRICKS_WAREHOUSE_ID=dbutils.widgets.get("sqlWarehouseID")
).run()
