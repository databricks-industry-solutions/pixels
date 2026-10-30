# Databricks notebook source
# MAGIC %md
# MAGIC # Deploy NV-Reason-CT Serving Endpoint
# MAGIC
# MAGIC Creates/updates a GPU model-serving endpoint for the `nv_reason_ct` champion.
# MAGIC Injects host/token/pixels-table/warehouse so the model can resolve a
# MAGIC `series_uid` -> NIfTI via the Pixels datastore at inference. Idempotent.

# COMMAND ----------

dbutils.widgets.text("model_uc_name", "main.pixels_solacc.nv_reason_ct")
dbutils.widgets.text("serving_endpoint_name", "pixels-nvreasonct")
dbutils.widgets.text("pixels_table", "main.pixels_solacc.object_catalog")
dbutils.widgets.text("warehouse_id", "")
dbutils.widgets.text("scale_to_zero_enabled", "true")
dbutils.widgets.text("host", "")

model_uc_name = dbutils.widgets.get("model_uc_name")
serving_endpoint_name = dbutils.widgets.get("serving_endpoint_name")
pixels_table = dbutils.widgets.get("pixels_table")
warehouse_id = dbutils.widgets.get("warehouse_id")
scale_to_zero_enabled = dbutils.widgets.get("scale_to_zero_enabled").lower() == "true"
assert warehouse_id, "warehouse_id is required (the model queries object_catalog through it)"

import os
from databricks.sdk import WorkspaceClient

host = dbutils.widgets.get("host") or WorkspaceClient().config.host
host = host.rstrip("/")
host = host if host.startswith("http") else f"https://{host}"
os.environ["DATABRICKS_HOST"] = host
print("host:", host)

# COMMAND ----------

# DBTITLE 1,Resolve champion version
import mlflow
from mlflow import MlflowClient

mlflow.set_registry_uri("databricks-uc")
mc = MlflowClient()
champion = mc.get_model_version_by_alias(model_uc_name, "champion")
model_version = champion.version
print(f"Serving {model_uc_name} v{model_version}")

# COMMAND ----------

# DBTITLE 1,Mint a PAT secret for the datastore (warehouse/API access at inference)
from databricks.sdk import WorkspaceClient

scope_name = "pixels_scope"
token_key = "pixels_nvreasonct_token"
w = WorkspaceClient()
try:
    if scope_name not in [s.name for s in w.secrets.list_scopes()]:
        w.secrets.create_scope(scope=scope_name)
    tok = w.tokens.create(comment="pixels_nvreasonct_endpoint_token")
    w.secrets.put_secret(scope=scope_name, key=token_key, string_value=tok.token_value)
    print(f"PAT stored in {scope_name}/{token_key}")
except Exception as e:
    print(f"secret setup note: {e}")

# COMMAND ----------

# DBTITLE 1,Create or update the endpoint
from mlflow.deployments import get_deploy_client

client = get_deploy_client("databricks")
token_ref = "{{" + f"secrets/{scope_name}/{token_key}" + "}}"

conf_vars = {
    "DATABRICKS_HOST": host,
    "DATABRICKS_TOKEN": token_ref,
    "DATABRICKS_PIXELS_TABLE": pixels_table,
    "DATABRICKS_WAREHOUSE_ID": warehouse_id,
}

# Cloud-aware GPU workload candidates (AWS/GCP: GPU_MEDIUM; Azure: GPU_LARGE/SMALL).
gpu_types = ["GPU_MEDIUM", "GPU_LARGE", "GPU_SMALL"]

endpoint_config = {
    "served_entities": [
        {
            "entity_name": model_uc_name,
            "entity_version": model_version,
            "workload_size": "Small",
            "workload_type": gpu_types[0],
            "scale_to_zero_enabled": scale_to_zero_enabled,
            "environment_vars": conf_vars,
        }
    ],
    "tags": [{"key": "accelerator", "value": "pixels"}, {"key": "model", "value": "nv-reason-ct"}],
}


def _unsupported(e):
    m = str(e).lower()
    return "workload type" in m and "not supported" in m


def _exists(e):
    m = str(e).lower()
    return "already exists" in m or "resource_conflict" in m


created = False
last_err = None
for wt in gpu_types:
    endpoint_config["served_entities"][0]["workload_type"] = wt
    try:
        client.create_endpoint(name=serving_endpoint_name, config=endpoint_config)
        print(f"CREATED {serving_endpoint_name} (workload_type={wt})")
        created = True
        break
    except Exception as e:
        if _unsupported(e):
            print(f"{wt} unsupported, trying next: {e}")
            last_err = e
            continue
        if _exists(e):
            try:
                client.update_endpoint(endpoint=serving_endpoint_name, config=endpoint_config)
                print(f"UPDATED {serving_endpoint_name} (workload_type={wt})")
                created = True
                break
            except Exception as e2:
                if _unsupported(e2):
                    last_err = e2
                    continue
                if "resource_conflict" in str(e2).lower():
                    print("mid-update, skipping")
                    created = True
                    break
                raise
        else:
            raise

if not created:
    raise RuntimeError(f"No supported GPU workload type from {gpu_types}") from last_err

dbutils.notebook.exit(f"SUCCESS: endpoint {serving_endpoint_name} create/update issued for {model_uc_name} v{model_version}")
