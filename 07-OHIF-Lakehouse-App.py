# Databricks notebook source
# MAGIC %md
# MAGIC ### Deploying OHIF Viewer in a Serverless Lakehouse App
# MAGIC
# MAGIC This notebook guides you through the process of deploying the OHIF Viewer as a serverless lakehouse application.

# COMMAND ----------

# MAGIC %pip install --upgrade databricks-sdk 

# COMMAND ----------

dbutils.library.restartPython()

# COMMAND ----------

from databricks.sdk import WorkspaceClient
from databricks.sdk.service.apps import AppResource, AppResourceSqlWarehouse, AppResourceSqlWarehouseSqlWarehousePermission
from pathlib import Path
import dbx.pixels.resources

w = WorkspaceClient()

app_name = "pixels-ohif-viewer"
path = Path(dbx.pixels.__file__).parent
lha_path = (f"{path}/resources/lakehouse_app")

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

sql_resource = AppResource(
  name="sql_warehouse",
  sql_warehouse=AppResourceSqlWarehouse(
    id=sql_warehouse_id,
    permission=AppResourceSqlWarehouseSqlWarehousePermission.CAN_USE
  )
)

print("Creating APP")
w.apps.create(name="pixels-ohif-viewer", resources=[sql_resource])
print("Deploying app")
w.apps.deploy(app_name="pixels-ohif-viewer", source_code_path=[lha_path])
