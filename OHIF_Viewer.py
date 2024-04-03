# Databricks notebook source
# MAGIC %pip install dbtunnel[fastapi] httpx

# COMMAND ----------

dbutils.library.restartPython()

# COMMAND ----------

# MAGIC %md
# MAGIC <h1> Inject current workspace and cluster configuration

# COMMAND ----------

import fileinput
import os.path

router_basename = "/driver-proxy/o/{}/{}/3000/"
workspace_id = spark.conf.get("spark.databricks.clusterUsageTags.clusterOwnerOrgId")
cluster_id = spark.conf.get("spark.databricks.clusterUsageTags.clusterId")

files = ["app-config.js"]

for file in files:
    if not os.path.isfile(f"resources/ohif/{file}.bak"):
        with fileinput.FileInput(f"resources/ohif/{file}", inplace = True, backup ='.bak') as f:
            for line in f:
                if("{ROUTER_BASENAME}" in line):
                    print(
                        line
                        .replace("{ROUTER_BASENAME}",router_basename.format(workspace_id,cluster_id))
                        .replace("{PIXELS_TABLE}",dbutils.widgets.get("PixelsTable"))
                    , end ='')
                else:
                    print(line, end ='')


# COMMAND ----------

# MAGIC %md
# MAGIC <h1> Configure proxy 

# COMMAND ----------

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

from starlette.requests import Request
from starlette.responses import StreamingResponse
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
    body['warehouse_id'] = os.environ['SQL_WAREHOUSE']

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
app.add_route("/sqlwarehouse/api/2.0/fs/files/{path:path}", _reverse_proxy_files, ["GET"])

app.mount("/", StaticFiles(directory="resources/ohif/",html = True), name="ohif")

# COMMAND ----------

from dbtunnel import dbtunnel
dbtunnel.fastapi(app, port=3000).inject_auth().inject_env(
  SQL_WAREHOUSE=dbutils.widgets.get("SQLWarehouseID")
).run()
