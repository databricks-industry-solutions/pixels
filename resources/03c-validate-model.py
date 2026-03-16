# Databricks notebook source
# MAGIC %md
# MAGIC # Validate Vista3D Serving Endpoint
# MAGIC
# MAGIC Checks that the serving endpoint is READY and runs a test inference
# MAGIC on a sample lung CT series. Raises an exception on failure so the
# MAGIC job task retries until the endpoint is available.

# COMMAND ----------

# MAGIC %run ../config/proxy_prep

# COMMAND ----------

# DBTITLE 1,Initialize
sql_warehouse_id, table, volume = init_widgets(show_volume=True)
model_uc_name, serving_endpoint_name = init_model_serving_widgets()
init_env()

volume_path = volume.replace(".", "/")

# COMMAND ----------

# DBTITLE 1,Check Endpoint State
import requests as _requests

_host = os.environ["DATABRICKS_HOST"]
_token = os.environ["DATABRICKS_TOKEN"]
_headers = {"Authorization": f"Bearer {_token}"}

_ep_resp = _requests.get(f"{_host}/api/2.0/serving-endpoints/{serving_endpoint_name}", headers=_headers)
_ep_resp.raise_for_status()
_ep_data = _ep_resp.json()

ep_ready = _ep_data.get("state", {}).get("ready", "unknown")
ep_config_update = _ep_data.get("state", {}).get("config_update", "")
print(f"Endpoint {serving_endpoint_name}: ready={ep_ready}, config_update={ep_config_update}")

if ep_ready != "READY":
    raise Exception(f"Endpoint {serving_endpoint_name} is {ep_ready} — not READY yet")

if ep_config_update == "IN_PROGRESS":
    raise Exception(f"Endpoint {serving_endpoint_name} has config update in progress — waiting")

# COMMAND ----------

# DBTITLE 1,Info Ping
import mlflow

client = mlflow.deployments.get_deploy_client("databricks")
resp = client.predict(
    endpoint=serving_endpoint_name,
    inputs={"dataframe_records": [{"input": {"action": "info"}}]},
)
print("Info ping OK")

# COMMAND ----------

# DBTITLE 1,Test Inference on Sample Lung CT
series_uid = "1.2.156.14702.1.1000.16.1.2020031111365289000020001"

resp = client.predict(
    endpoint=serving_endpoint_name,
    inputs={
        "dataframe_records": [
            {
                "series_uid": series_uid,
                "params": {
                    "label_prompt": [1, 26],
                    "export_metrics": False,
                    "export_overlays": False,
                    "dest_dir": f"/Volumes/{volume_path}/monai_serving/vista3d",
                    "pixels_table": table,
                },
            }
        ]
    },
)
print(f"Inference OK on series {series_uid}")

# COMMAND ----------

dbutils.notebook.exit(f"SUCCESS: endpoint {serving_endpoint_name} validated with test inference")
