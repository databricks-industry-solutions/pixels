# Databricks notebook source
# MAGIC %md
# MAGIC # Deploy Vista3D Serving Endpoint
# MAGIC
# MAGIC Creates or updates the model serving endpoint. Idempotent — handles
# MAGIC "already exists" by updating the existing endpoint configuration.

# COMMAND ----------

# MAGIC %run ../config/proxy_prep

# COMMAND ----------

# DBTITLE 1,Initialize
sql_warehouse_id, table, volume = init_widgets(show_volume=True)
model_uc_name, serving_endpoint_name = init_model_serving_widgets()

use_service_principal = False

volume_path = volume.replace(".", "/")

init_env()

os.environ["DEST_DIR"] = f"/Volumes/{volume_path}/monai_serving/vista3d/"

# COMMAND ----------

# DBTITLE 1,Get Latest Model Version
import mlflow
from mlflow import MlflowClient

mc = MlflowClient()
versions = mc.search_model_versions(
    f"name='{model_uc_name}'",
    order_by=["version_number DESC"],
    max_results=1,
)

if not versions:
    dbutils.notebook.exit(f"SKIP: no model versions found for {model_uc_name}")

model_version = versions[0].version
print(f"Using model {model_uc_name} version {model_version}")

# COMMAND ----------

# DBTITLE 1,Configure Credentials
scope_name = "pixels_scope"
sp_name = "pixels_sp"
sp_id_key = "pixels_sp_id"
sp_app_id_key = "pixels_sp_app_id"
sp_secret_key = "pixels_sp_secret"
token_key = "pixels_token"
m2m_client = None

from databricks.sdk import WorkspaceClient

if use_service_principal:
    try:
        from dbx.pixels.m2m import DatabricksM2MAuth

        m2m_client = DatabricksM2MAuth(
            principal_name=sp_name,
            account_api_token=os.environ["DATABRICKS_TOKEN"],
            secrets_scope_name=scope_name,
            secrets_client_id_key=sp_id_key,
            secrets_client_app_id_key=sp_app_id_key,
            secrets_client_secret_key=sp_secret_key,
            workspace_url=os.environ["DATABRICKS_HOST"],
        )
        m2m_client.grant_permissions(table, volume)
    except Exception as e:
        print(f"Service principal setup failed: {e}")
else:
    try:
        w = WorkspaceClient()

        if scope_name not in [scope.name for scope in w.secrets.list_scopes()]:
            w.secrets.create_scope(scope=scope_name)

        token = w.tokens.create(comment="pixels_serving_endpoint_token")
        w.secrets.put_secret(scope=scope_name, key=token_key, string_value=token.token_value)
        print(f"PAT created and saved in {token_key} secret")
    except Exception as e:
        print(f"PAT/secret setup failed (may already exist): {e}")

# COMMAND ----------

# DBTITLE 1,Create or Update Endpoint
from mlflow.deployments import get_deploy_client

client = get_deploy_client("databricks")

secret_template = "secrets/{scope}/{key}"
token_ref = "{{" + secret_template.format(scope=scope_name, key=token_key) + "}}"
client_app_id_ref = "{{" + secret_template.format(scope=scope_name, key=sp_app_id_key) + "}}"
client_secret_ref = "{{" + secret_template.format(scope=scope_name, key=sp_secret_key) + "}}"

conf_vars = {
    "DATABRICKS_HOST": os.environ["DATABRICKS_HOST"],
    "DATABRICKS_PIXELS_TABLE": os.environ["DATABRICKS_PIXELS_TABLE"],
    "DATABRICKS_WAREHOUSE_ID": os.environ["DATABRICKS_WAREHOUSE_ID"],
    "DEST_DIR": os.environ["DEST_DIR"],
}

if not m2m_client:
    conf_vars["DATABRICKS_TOKEN"] = token_ref
else:
    conf_vars["DATABRICKS_SCOPE"] = scope_name
    conf_vars["CLIENT_APP_ID"] = client_app_id_ref
    conf_vars["CLIENT_SECRET"] = client_secret_ref

endpoint_config = {
    "served_entities": [
        {
            "entity_name": model_uc_name,
            "entity_version": model_version,
            "workload_size": "Small",
            "workload_type": "GPU_MEDIUM",
            "scale_to_zero_enabled": True,
            "environment_vars": conf_vars,
        }
    ]
}

try:
    endpoint = client.create_endpoint(name=serving_endpoint_name, config=endpoint_config)
    print("SERVING ENDPOINT CREATED:", serving_endpoint_name)
except Exception as e:
    err_msg = str(e).lower()
    if "already exists" in err_msg or "resource_conflict" in err_msg:
        print(f"Endpoint {serving_endpoint_name} already exists, updating config")
        try:
            endpoint = client.update_endpoint(endpoint=serving_endpoint_name, config=endpoint_config)
        except Exception as e2:
            if "resource_conflict" in str(e2).lower():
                print(f"Endpoint is mid-update, skipping: {e2}")
            else:
                raise
    else:
        raise

dbutils.notebook.exit("SUCCESS: endpoint created/updated")
