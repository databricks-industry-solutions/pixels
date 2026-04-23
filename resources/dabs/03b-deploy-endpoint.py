# Databricks notebook source
# MAGIC %md
# MAGIC # Deploy Vista3D Serving Endpoint
# MAGIC
# MAGIC Creates or updates the model serving endpoint. Idempotent — handles
# MAGIC "already exists" by updating the existing endpoint configuration.

# COMMAND ----------

# MAGIC %run ../../config/proxy_prep

# COMMAND ----------

# DBTITLE 1,Initialize
sql_warehouse_id, table, volume = init_widgets(show_volume=True)
model_uc_name, serving_endpoint_name, scale_to_zero_enabled = init_model_serving_widgets()

use_service_principal = False

volume_path = volume.replace(".", "/")

init_env()

os.environ["DEST_DIR"] = f"/Volumes/{volume_path}/monai_serving/vista3d/"

# COMMAND ----------

# DBTITLE 1,Get Latest Model Version
import mlflow
from mlflow import MlflowClient

mc = MlflowClient()

try:
    champion = mc.get_model_version_by_alias(model_uc_name, "champion")
    model_version = champion.version
    print(f"Using champion model {model_uc_name} version {model_version}")
except Exception:
    # Fallback: use latest version if no champion alias exists yet
    versions = mc.search_model_versions(f"name='{model_uc_name}'")
    if not versions:
        dbutils.notebook.exit(f"SKIP: no model versions found for {model_uc_name}")
    latest = max(versions, key=lambda v: int(v.version))
    model_version = latest.version
    print(f"No champion alias — falling back to latest version {model_version}")

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
            "scale_to_zero_enabled": scale_to_zero_enabled,
            "environment_vars": conf_vars,
        }
    ],
    "tags": [
        {"key": "accelerator", "value": "pixels"},
    ],
}

# Check if endpoint already has this model version — skip update to avoid config churn
import requests as _requests

_host = os.environ["DATABRICKS_HOST"]
_token = os.environ["DATABRICKS_TOKEN"]
_ep_check = _requests.get(
    f"{_host}/api/2.0/serving-endpoints/{serving_endpoint_name}",
    headers={"Authorization": f"Bearer {_token}"},
)
if _ep_check.status_code == 200:
    _ep_data = _ep_check.json()
    _current_entities = _ep_data.get("config", {}).get("served_entities", [])
    if _current_entities and str(_current_entities[0].get("entity_version")) == str(model_version):
        print(f"Endpoint {serving_endpoint_name} already serving model version {model_version} — no update needed")
        dbutils.notebook.exit(f"SUCCESS: endpoint already configured with version {model_version}")

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

# Wait for the endpoint config update to complete so 03c doesn't have to
# retry while the container is still building (GPU builds take 20-30 min).
import time as _time

_max_wait = 2400  # 40 min
_poll_interval = 30
_elapsed = 0

while _elapsed < _max_wait:
    _ep_resp = _requests.get(
        f"{_host}/api/2.0/serving-endpoints/{serving_endpoint_name}",
        headers={"Authorization": f"Bearer {_token}"},
    )
    if _ep_resp.status_code != 200:
        print(f"Warning: endpoint check returned {_ep_resp.status_code}, retrying...")
        _time.sleep(_poll_interval)
        _elapsed += _poll_interval
        continue

    _ep_state = _ep_resp.json().get("state", {})
    _ready = _ep_state.get("ready")
    _config_update = _ep_state.get("config_update")

    if _ready == "READY" and _config_update == "NOT_UPDATING":
        print(f"Endpoint {serving_endpoint_name} is ready (waited {_elapsed}s)")
        break

    _pending = _ep_resp.json().get("pending_config", {}).get("served_entities", [])
    _deploy_msg = _pending[0].get("state", {}).get("deployment_state_message", "") if _pending else ""
    print(f"Waiting for endpoint... ready={_ready}, config_update={_config_update}, msg={_deploy_msg} ({_elapsed}s)")

    _time.sleep(_poll_interval)
    _elapsed += _poll_interval
else:
    print(f"Warning: endpoint did not become ready within {_max_wait}s — proceeding anyway")

dbutils.notebook.exit("SUCCESS: endpoint created/updated")
