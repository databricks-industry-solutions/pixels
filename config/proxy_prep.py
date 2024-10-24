# Databricks notebook source
import os
from dbruntime.databricks_repl_context import get_context
from databricks.sdk import WorkspaceClient

ctx = get_context()
w = WorkspaceClient()


# COMMAND ----------

def init_widgets():
  dbutils.widgets.text("table", "main.pixels_solacc.object_catalog", label="1.0 Catalog Schema Table to store object metadata into")
  dbutils.widgets.text("sqlWarehouseID", "", label="2.0 SQL Warehouse")
  sql_warehouse_id = dbutils.widgets.get("sqlWarehouseID")
  table = dbutils.widgets.get("table")
  return sql_warehouse_id, table

# COMMAND ----------

def init_env():
  sql_warehouse_id = dbutils.widgets.get("sqlWarehouseID")
  table = dbutils.widgets.get("table")

  if not spark.catalog.tableExists(table):
      raise Exception("The configured table does not exist!")

  if sql_warehouse_id == "":
      raise Exception("SQL Warehouse ID is mandatory!")
  else:
      wh = w.warehouses.get(id=sql_warehouse_id)
      print(f"Using '{wh.as_dict()['name']}' as SQL Warehouse")
        
  os.environ["DATABRICKS_TOKEN"] = ctx.apiToken
  os.environ["DATABRICKS_WAREHOUSE_ID"] = sql_warehouse_id
  os.environ["DATABRICKS_HOST"] = f"https://{ctx.browserHostName}"
  os.environ["DATABRICKS_PIXELS_TABLE"] = table

# COMMAND ----------

def get_proxy_url(port:int = 8000):
  host_name = ctx.browserHostName
  ending = f"driver-proxy/o/{get_context().workspaceId}/{get_context().clusterId}/{port}/"
  
  azure = "azuredatabricks.net"
  gcp = "gcp.databricks.com"
  aws = "cloud.databricks.com"

  if azure in host_name:
    shard = int(get_context().workspaceId) % 20
    return f"https://adb-dp-{get_context().workspaceId}.{shard}.{azure}/{ending}"
  elif gcp in host_name:
    shard = int(get_context().workspaceId) % 10
    return f"https://dp-{get_context().workspaceId}.{shard}.{gcp}/{ending}"
  elif aws in host_name:
    dbc_host = '.'.join(host_name.split(".")[1:])
    return f"https://dbc-dp-{get_context().workspaceId}.{dbc_host}/{ending}"

