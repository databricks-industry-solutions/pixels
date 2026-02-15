# Databricks notebook source
# MAGIC %md
# MAGIC ### Deploying OHIF Viewer in a Serverless Lakehouse App
# MAGIC
# MAGIC This notebook guides you through the process of deploying the OHIF Viewer as a serverless lakehouse application.

# COMMAND ----------

# MAGIC %pip install --upgrade databricks-sdk==0.60.0 psycopg[binary,pool] fsspec -q
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

app_name = "pixels-dicomweb"
lakebase_instance_name = "pixels-pixels"
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

# MAGIC %md
# MAGIC # Create Lakebase DB and DICOM_FRAMES table

# COMMAND ----------

import dbx
from dbx.pixels.lakebase import LakebaseUtils
lb_utils = LakebaseUtils(instance_name=lakebase_instance_name, uc_table_name=table, create_instance=True)

path = os.path.dirname(dbx.pixels.__file__)
sql_base_path = f"{path}/resources/sql/lakebase"

# Database is aligned to UC catalog, schema to UC schema
# (e.g. catalog.schema.table → database=catalog, schema=schema)
_lb_schema = lb_utils.schema

for sql_file in ["CREATE_LAKEBASE_SCHEMA.sql", "CREATE_LAKEBASE_DICOM_FRAMES.sql"]:
    file_path = os.path.join(sql_base_path, sql_file)
    with open(file_path, "r") as file:
        lb_utils.execute_query(file.read().format(schema_name=_lb_schema))

# Create the UC view used by Reverse ETL to sync instance_paths into Lakebase
from dbx.pixels.lakebase import parse_uc_table_name
_uc_catalog, _uc_schema, _uc_table = parse_uc_table_name(table)
with open(os.path.join(sql_base_path, "CREATE_INSTANCE_PATHS_VIEW.sql"), "r") as file:
    spark.sql(file.read().format(catalog=_uc_catalog, schema=_uc_schema, table=_uc_table))
print(f"✓ Created UC view {_uc_catalog}.{_uc_schema}.instance_paths_vw for Reverse ETL Sync")

# COMMAND ----------

# MAGIC %md
# MAGIC # Create Reverse ETL Synced Table
# MAGIC
# MAGIC Sync the `instance_paths_vw` view from Unity Catalog into Lakebase using
# MAGIC Reverse ETL.  This creates:
# MAGIC
# MAGIC 1. A **read-only synced table** in UC (`catalog.schema.instance_paths`)
# MAGIC 2. A **Postgres table** in Lakebase (`schema.instance_paths`)
# MAGIC
# MAGIC The sync pipeline keeps the Lakebase table continuously updated so the
# MAGIC DICOMweb app can resolve SOP Instance UIDs → file paths in sub-10 ms
# MAGIC without querying the SQL warehouse.

# COMMAND ----------

from databricks.sdk.service.database import (
    SyncedDatabaseTable,
    SyncedTableSpec,
    NewPipelineSpec,
    SyncedTableSchedulingPolicy,
)

_synced_table_name = f"{_uc_catalog}.{_uc_schema}.instance_paths"
_source_view_name  = f"{_uc_catalog}.{_uc_schema}.instance_paths_vw"

# Check if the synced table already exists
try:
    existing = w.database.get_synced_database_table(name=_synced_table_name)
    print(f"Synced table '{_synced_table_name}' already exists — state: {existing.data_synchronization_status.detailed_state}")
except Exception:
    synced_table = w.database.create_synced_database_table(
        SyncedDatabaseTable(
            name=_synced_table_name,
            database_instance_name=lakebase_instance_name,
            logical_database_name=_uc_catalog,
            spec=SyncedTableSpec(
                source_table_full_name=_source_view_name,
                primary_key_columns=["local_path"],
                scheduling_policy=SyncedTableSchedulingPolicy.SNAPSHOT,
                new_pipeline_spec=NewPipelineSpec(
                    storage_catalog=_uc_catalog,
                    storage_schema=_uc_schema,
                ),
            ),
        )
    )
    print(f"✓ Created synced table: {synced_table.name}")
    print(f"  Source:   {_source_view_name}")
    print(f"  Lakebase: {_uc_schema}.instance_paths")
    print(f"  Mode:     SNAPSHOT")

# COMMAND ----------

# MAGIC %md
# MAGIC # Deploy DICOMweb App
# MAGIC
# MAGIC Create (or update) the DICOMweb Databricks App.  The app-config template
# MAGIC is filled with the environment-specific values and written as `app.yml`.

# COMMAND ----------

from databricks.sdk.service.apps import (
    AppResource,
    AppResourceSqlWarehouse,
    AppResourceSqlWarehouseSqlWarehousePermission,
    AppResourceServingEndpoint,
    AppResourceServingEndpointServingEndpointPermission,
    App,
    AppDeployment,
)
from pathlib import Path
import os

_pixels_path = Path(dbx.pixels.__file__).parent
_dicomweb_path = str(_pixels_path / "resources" / "dicom_web")

# Derive STOW volume path from the volume widget (catalog.schema.volume_name)
_vol_parts = volume.split(".")
_stow_volume_path = f"/Volumes/{_vol_parts[0]}/{_vol_parts[1]}/{_vol_parts[2]}/stow/"

# Generate app.yml from the template
with open(f"{_dicomweb_path}/app-config.yml", "r") as config_input:
    with open(f"{_dicomweb_path}/app.yml", "w") as config_output:
        config_output.write(
            config_input.read()
            .replace("{PIXELS_TABLE}", table)
            .replace("{LAKEBASE_INSTANCE_NAME}", lakebase_instance_name)
            .replace("{LAKEBASE_INIT_DB}", "false")
            .replace("{LAKEBASE_RLS_ENABLED}", "false")
            .replace("{DICOMWEB_USE_USER_AUTH}", "false")
            .replace("{STOW_VOLUME_PATH}", _stow_volume_path)
        )

print(f"✓ Generated app.yml for DICOMweb app")

# Build app resources
resources = []

sql_resource = AppResource(
    name="sql_warehouse",
    sql_warehouse=AppResourceSqlWarehouse(
        id=sql_warehouse_id,
        permission=AppResourceSqlWarehouseSqlWarehousePermission.CAN_USE,
    ),
)
resources.append(sql_resource)

if serving_endpoint_name in [ep.name for ep in w.serving_endpoints.list()]:
    resources.append(
        AppResource(
            name="serving_endpoint",
            serving_endpoint=AppResourceServingEndpoint(
                name=serving_endpoint_name,
                permission=AppResourceServingEndpointServingEndpointPermission.CAN_QUERY,
            ),
        )
    )

# Create or retrieve existing app
if app_name in [a.name for a in w.apps.list()]:
    print(f"App '{app_name}' already exists")
    app = w.apps.get(app_name)
else:
    print(f"Creating DICOMweb App '{app_name}' — this may take a few minutes …")
    app = App(
        app_name,
        default_source_code_path=_dicomweb_path,
        user_api_scopes=["sql", "files.files"],
        resources=resources,
    )
    app = w.apps.create_and_wait(app)
    print(f"✓ App created: {app.url}")

# COMMAND ----------

# MAGIC %md
# MAGIC # Granting Permissions
# MAGIC
# MAGIC Grant the DICOMweb app's service principal access to:
# MAGIC - Lakebase tables (`dicom_frames`, `instance_paths`)
# MAGIC - Unity Catalog (catalog, schema, table, volume)

# COMMAND ----------

app_instance = w.apps.get(app_name)
app_instance.service_principal_client_id

# COMMAND ----------

from databricks.sdk.service import catalog

app_instance = w.apps.get(app_name)
service_principal_id = app_instance.service_principal_client_id

# Lakebase grants
role = lb_utils.get_or_create_sp_role(service_principal_id)
lb_utils.execute_query(f'GRANT SELECT, INSERT ON {_lb_schema}.dicom_frames TO "{role.name}"')
lb_utils.execute_query(f'GRANT SELECT, INSERT ON {_lb_schema}.instance_paths TO "{role.name}"')
lb_utils.execute_query(f'GRANT USAGE ON SCHEMA {_lb_schema} TO "{role.name}"')

# Index for fast Study Instance UID lookups on the Reverse-ETL-synced table
lb_utils.execute_query(f'CREATE INDEX IF NOT EXISTS idx_instance_paths_study ON {_lb_schema}.instance_paths (study_instance_uid)')

# UC grants
w.grants.update(
    full_name=_uc_catalog,
    securable_type="catalog",
    changes=[catalog.PermissionsChange(add=[catalog.Privilege.USE_CATALOG], principal=service_principal_id)],
)
w.grants.update(
    full_name=f"{_uc_catalog}.{_uc_schema}",
    securable_type="schema",
    changes=[catalog.PermissionsChange(add=[catalog.Privilege.USE_SCHEMA], principal=service_principal_id)],
)
w.grants.update(
    full_name=table,
    securable_type="table",
    changes=[catalog.PermissionsChange(add=[catalog.Privilege.ALL_PRIVILEGES], principal=service_principal_id)],
)
w.grants.update(
    full_name=volume,
    securable_type="volume",
    changes=[catalog.PermissionsChange(add=[catalog.Privilege.ALL_PRIVILEGES], principal=service_principal_id)],
)

print("✓ Permissions granted")

# COMMAND ----------

# MAGIC %md
# MAGIC # Deploy

# COMMAND ----------

app_deploy = w.apps.deploy_and_wait(app_name, AppDeployment(source_code_path=_dicomweb_path))

print(f"✓ {app_deploy.status.message}")
print(f"  URL: {app.url}")
