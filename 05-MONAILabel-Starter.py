# Databricks notebook source
# MAGIC %pip install git+https://github.com/erinaldidb/MONAILabel_Pixels.git databricks-sdk --upgrade 

# COMMAND ----------

dbutils.library.restartPython()

# COMMAND ----------

import os
from dbruntime.databricks_repl_context import get_context
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
      
os.environ["DATABRICKS_TOKEN"] = get_context().apiToken
os.environ["DATABRICKS_WAREHOUSE_ID"] = sql_warehouse_id
os.environ["DATABRICKS_HOST"] = f"https://{get_context().browserHostName}"
os.environ["DATABRICKS_PIXELS_TABLE"] = table

# COMMAND ----------

displayHTML(f"<h1>Use the following link as MONAILabel server address</h1><br><h2>https://dbc-dp-{get_context().workspaceId}.cloud.databricks.com/driver-proxy/o/{get_context().workspaceId}/{get_context().clusterId}/8000/")

# COMMAND ----------

# MAGIC %sh
# MAGIC monailabel apps --download --name radiology --output /local_disk0/monai/apps/

# COMMAND ----------

# MAGIC %sh
# MAGIC monailabel start_server --app /local_disk0/monai/apps/radiology --studies $DATABRICKS_HOST --conf models segmentation --table $DATABRICKS_PIXELS_TABLE
