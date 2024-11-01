# Databricks notebook source
# MAGIC %md
# MAGIC ### Deploying OHIF Viewer in a Serverless Lakehouse App
# MAGIC
# MAGIC This notebook guides you through the process of deploying the OHIF Viewer as a serverless lakehouse application.

# COMMAND ----------

# MAGIC %pip install --upgrade databricks-sdk -q
# MAGIC dbutils.library.restartPython()

# COMMAND ----------

# MAGIC %run ./config/proxy_prep

# COMMAND ----------

sql_warehouse_id, table, volume = init_widgets(show_volume=True)
init_env()

app_name = "pixels-ohif-viewer"

# COMMAND ----------

from databricks.sdk.service.apps import AppResource, AppResourceSqlWarehouse, AppResourceSqlWarehouseSqlWarehousePermission

from pathlib import Path
import dbx.pixels.resources

w = WorkspaceClient()

path = Path(dbx.pixels.__file__).parent
lha_path = (f"{path}/resources/lakehouse_app")

with open(f"{lha_path}/app-config.yaml", "r") as config_input:
        with open(f"{lha_path}/app.yaml", "w") as config_custom:
            config_custom.write(
                config_input.read()
                .replace("{PIXELS_TABLE}",os.environ["DATABRICKS_PIXELS_TABLE"])
            )

sql_resource = AppResource(
  name="sql_warehouse",
  sql_warehouse=AppResourceSqlWarehouse(
    id=os.environ["DATABRICKS_WAREHOUSE_ID"],
    permission=AppResourceSqlWarehouseSqlWarehousePermission.CAN_USE
  )
)

print(f"Creating Lakehouse App with name {app_name}, this step will require few minutes to complete")
app = w.apps.create_and_wait(name=app_name, resources=[sql_resource])
app = w.apps.deploy_and_wait(app_name=app_name, source_code_path=lha_path)

service_principal_id = app.deployment_artifacts.source_code_path.split("/")[3]

print(app.status.message)
print(app.url)

# COMMAND ----------

# MAGIC %md
# MAGIC # Lakehouse App Deployment and Permissions
# MAGIC
# MAGIC - Import the `catalog` service from the Databricks SDK.
# MAGIC - Update permissions for the catalog, schema, table, and volume.
# MAGIC - Use the `service_principal_id` to grant necessary privileges.

# COMMAND ----------

from databricks.sdk.service import catalog

w.grants.update(full_name=table.split(".")[0],
  securable_type=catalog.SecurableType.CATALOG,
  changes=[
    catalog.PermissionsChange(
      add=[catalog.Privilege.USE_CATALOG],
      principal=service_principal_id
    )
  ]
)

w.grants.update(full_name=table.split(".")[0]+"."+table.split(".")[1],
  securable_type=catalog.SecurableType.SCHEMA,
  changes=[
    catalog.PermissionsChange(
      add=[catalog.Privilege.USE_SCHEMA],
      principal=service_principal_id
    )
  ]
)

w.grants.update(full_name=table,
  securable_type=catalog.SecurableType.TABLE,
  changes=[
    catalog.PermissionsChange(
      add=[catalog.Privilege.SELECT],
      principal=service_principal_id
    )
  ]
)

w.grants.update(full_name=volume,
  securable_type=catalog.SecurableType.VOLUME,
  changes=[
    catalog.PermissionsChange(
      add=[catalog.Privilege.READ_VOLUME],
      principal=service_principal_id
    )
  ]
)
