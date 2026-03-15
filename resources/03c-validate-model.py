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
import mlflow

client = mlflow.deployments.get_deploy_client("databricks")
endpoint_status = client.get_endpoint(serving_endpoint_name)
ep_state = endpoint_status.get("state", {}).get("ready", "unknown")
print(f"Endpoint {serving_endpoint_name}: {ep_state}")

if ep_state != "READY":
    raise Exception(f"Endpoint {serving_endpoint_name} is {ep_state} — not READY yet")

# COMMAND ----------

# DBTITLE 1,Info Ping
resp = client.predict(
    endpoint=serving_endpoint_name,
    inputs={"dataframe_records": [{"input": {"action": "info"}}]},
)
print(f"Info ping OK")

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
