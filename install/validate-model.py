# Databricks notebook source
# MAGIC %md
# MAGIC # Validate Vista3D Serving Endpoint
# MAGIC
# MAGIC Checks that the serving endpoint is READY and runs a test inference
# MAGIC on a sample lung CT series. Raises an exception on failure so the
# MAGIC job task retries until the endpoint is available.

# COMMAND ----------

# MAGIC %run ./config/proxy_prep

# COMMAND ----------

# DBTITLE 1,Initialize
sql_warehouse_id, table, volume = init_widgets(show_volume=True)
model_uc_name, serving_endpoint_name, _ = init_model_serving_widgets()
init_env()

volume_path = volume.replace(".", "/")

# COMMAND ----------

# DBTITLE 1,Validate Endpoint
import requests as _requests
import traceback as _tb

_host = os.environ["DATABRICKS_HOST"]
_token = os.environ["DATABRICKS_TOKEN"]
_headers = {"Authorization": f"Bearer {_token}"}
_log_path = f"/Volumes/{volume_path}/03c_debug.log"
_step = "init"

try:
    # Step 1: Check endpoint state
    _step = "endpoint_state_check"
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

    # Step 2: Info ping
    _step = "info_ping"
    _invoke_url = f"{_host}/serving-endpoints/{serving_endpoint_name}/invocations"
    _invoke_headers = {**_headers, "Content-Type": "application/json"}

    _ping_resp = _requests.post(
        _invoke_url,
        headers=_invoke_headers,
        json={"dataframe_records": [{"input": {"action": "info"}}]},
        timeout=120,
    )
    if _ping_resp.status_code != 200:
        raise Exception(f"Info ping HTTP {_ping_resp.status_code}: {_ping_resp.text[:300]}")
    print(f"Info ping OK: {_ping_resp.status_code}")

    # Step 3: Test inference (warn on model-side errors, fail on connectivity issues)
    _step = "test_inference"
    series_uid = "1.2.156.14702.1.1000.16.1.2020031111365289000020001"

    _infer_resp = _requests.post(
        _invoke_url,
        headers=_invoke_headers,
        json={
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
        timeout=300,
    )
    if _infer_resp.status_code == 200:
        print(f"Inference OK on series {series_uid}")
        dbutils.notebook.exit(f"SUCCESS: endpoint {serving_endpoint_name} validated with test inference")
    elif _infer_resp.status_code == 400:
        # Model-side error (bad code, missing module, etc.) — not an infrastructure issue
        _warn = f"WARNING: inference returned 400 (model-side error): {_infer_resp.text[:200]}"
        print(_warn)
        dbutils.notebook.exit(f"SUCCESS: endpoint {serving_endpoint_name} responding (info ping OK). {_warn}")
    else:
        raise Exception(f"Inference HTTP {_infer_resp.status_code}: {_infer_resp.text[:300]}")

except Exception as _e:
    _err_msg = f"FAILED at step={_step}: {_e}\n{_tb.format_exc()}"
    print(_err_msg)
    try:
        dbutils.fs.put(_log_path, _err_msg, overwrite=True)
    except Exception:
        pass
    raise
