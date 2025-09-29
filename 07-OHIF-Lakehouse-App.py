# Databricks notebook source
# MAGIC %md
# MAGIC ### Deploying OHIF Viewer in a Serverless Lakehouse App
# MAGIC
# MAGIC This notebook guides you through the process of deploying the OHIF Viewer as a serverless lakehouse application.

# COMMAND ----------

# MAGIC %pip install --upgrade databricks-sdk==0.56.0 -q
# MAGIC dbutils.library.restartPython()

# COMMAND ----------

# MAGIC %run ./config/proxy_prep

# COMMAND ----------

# MAGIC %md
# MAGIC # Initializing Environment and Setting Up Application
# MAGIC
# MAGIC Initialize widgets to capture the SQL warehouse ID, table, and volume. We also set up the environment and define the application name as "pixels-ohif-viewer".

# COMMAND ----------

sql_warehouse_id, table, volume = init_widgets(show_volume=True)
init_env()

app_name = "pixels-ohif-viewer"
serving_endpoint_name = "pixels-monai-uc"

w = WorkspaceClient()

# COMMAND ----------

# MAGIC %md
# MAGIC # Setting Up and Deploying the Lakehouse Application
# MAGIC
# MAGIC The next step will perform several critical steps to set up and deploy our Lakehouse Application:
# MAGIC
# MAGIC 1. **Import Necessary Libraries**: We start by importing required libraries and modules such as `AppResource`, `AppResourceSqlWarehouse`, and others from the `databricks.sdk.service.apps`, along with `Path` from `pathlib`, and `dbx.pixels.resources`.
# MAGIC
# MAGIC 2. **Initialize Workspace Client**: An instance of `WorkspaceClient` is created to interact with the Databricks workspace.
# MAGIC
# MAGIC 3. **Prepare Application Configuration**: The application's configuration is prepared by reading a template configuration file (`app-config.yaml`), replacing placeholders with actual values (like the pixels table name), and writing the modified configuration to `app.yaml`.
# MAGIC
# MAGIC 4. **Define SQL Warehouse Resource**: We define a `sql_resource` with the SQL warehouse ID and permissions required for the application to use the SQL warehouse.
# MAGIC
# MAGIC 5. **Create and Deploy the Application**: The application is created and deployed using the `create_and_wait` and `deploy_and_wait` methods of the `WorkspaceClient`. This process involves specifying the application name, resources (like the SQL warehouse resource), and the path to the application's source code.
# MAGIC
# MAGIC 6. **Extract Service Principal ID**: After deployment, the service principal ID is extracted from the deployment artifacts for permission grants.
# MAGIC
# MAGIC 7. **Output Deployment Status and URL**: Finally, the deployment status message and the application URL are printed, indicating the completion of the deployment process and how to access the deployed application.
# MAGIC
# MAGIC This cell encapsulates the entire process of preparing, creating, and deploying the Lakehouse Application, making it a pivotal step in the application setup workflow.

# COMMAND ----------

from databricks.sdk.service.apps import AppResource, AppResourceSqlWarehouse, AppResourceSqlWarehouseSqlWarehousePermission, AppResourceServingEndpoint, AppResourceServingEndpointServingEndpointPermission, App, AppDeployment

from pathlib import Path
import dbx.pixels.resources

# Check if the lakehouse app has already been created
if app_name in [app.name for app in w.apps.list()]:
  print(f"App {app_name} already exists")
  app = w.apps.get(app_name)
  print(app.url)
else:
  path = Path(dbx.pixels.__file__).parent
  lha_path = (f"{path}/resources/lakehouse_app")

  with open(f"{lha_path}/app-config.yml", "r") as config_input:
          with open(f"{lha_path}/app.yml", "w") as config_custom:
              config_custom.write(
                  config_input.read()
                  .replace("{PIXELS_TABLE}", table)
              )

  resources = []

  sql_resource = AppResource(
    name="sql_warehouse",
    sql_warehouse=AppResourceSqlWarehouse(
      id=sql_warehouse_id,
      permission=AppResourceSqlWarehouseSqlWarehousePermission.CAN_USE
    )
  )
  resources.append(sql_resource)

  if serving_endpoint_name in [endpoint.name for endpoint in w.serving_endpoints.list()]:
    serving_endpoint = AppResource(
      name="serving_endpoint",
      serving_endpoint=AppResourceServingEndpoint(
        name=serving_endpoint_name,
        permission=AppResourceServingEndpointServingEndpointPermission.CAN_QUERY
      )
    )
    resources.append(serving_endpoint)

  print(f"Creating Lakehouse App with name {app_name}, this step will require few minutes to complete")

  app = App(app_name, default_source_code_path=lha_path, user_api_scopes=["sql","files.files"], resources=resources)
  app_created = w.apps.create_and_wait(app)
  app_deploy = w.apps.deploy_and_wait(app_name, AppDeployment(source_code_path=lha_path))

  print(app_deploy.status.message)
  print(app_created.url)

# COMMAND ----------

# MAGIC %md
# MAGIC # Granting Permissions
# MAGIC
# MAGIC The next cell is responsible for granting the necessary permissions to the service principal for accessing the catalog, schema, table, and volume.
# MAGIC
# MAGIC This ensures that the Lakehouse App has the required access to perform its operations.

# COMMAND ----------

from databricks.sdk.service import catalog

app_instance = w.apps.get(app_name)
last_deployment = w.apps.get_deployment(app_name, app_instance.active_deployment.deployment_id)
service_principal_id = last_deployment.deployment_artifacts.source_code_path.split("/")[3]

#Grant USE CATALOG permissions on CATALOG
w.grants.update(full_name=table.split(".")[0],
  securable_type=catalog.SecurableType.CATALOG,
  changes=[
    catalog.PermissionsChange(
      add=[catalog.Privilege.USE_CATALOG],
      principal=service_principal_id
    )
  ]
)

#Grant USE SCHEMA permissions on SCHEMA
w.grants.update(full_name=table.split(".")[0]+"."+table.split(".")[1],
  securable_type=catalog.SecurableType.SCHEMA,
  changes=[
    catalog.PermissionsChange(
      add=[catalog.Privilege.USE_SCHEMA],
      principal=service_principal_id
    )
  ]
)

#Grant ALL PRIVILEGES permissions on TABLE
w.grants.update(full_name=table,
  securable_type=catalog.SecurableType.TABLE,
  changes=[
    catalog.PermissionsChange(
      add=[catalog.Privilege.ALL_PRIVILEGES],
      principal=service_principal_id
    )
  ]
)

#Grant ALL PRIVILEGES permissions on VOLUME
w.grants.update(full_name=volume,
  securable_type=catalog.SecurableType.VOLUME,
  changes=[
    catalog.PermissionsChange(
      add=[catalog.Privilege.ALL_PRIVILEGES],
      principal=service_principal_id
    )
  ]
)

print("PERMISSIONS GRANTED")
