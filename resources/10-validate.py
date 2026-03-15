# Databricks notebook source
# MAGIC %md
# MAGIC # Validate Pixels Installation
# MAGIC
# MAGIC Final install task that checks every deployed service is present and functional.
# MAGIC Each check is independent — one failure does not block the others.

# COMMAND ----------

# MAGIC %run ../config/proxy_prep

# COMMAND ----------

# DBTITLE 1,Widget Init & Environment Setup
sql_warehouse_id, table, volume = init_widgets(show_volume=True)
model_uc_name, serving_endpoint_name = init_model_serving_widgets()
init_env()

catalog_name, schema_name, table_name = table.split(".")

# Vector search source tables live in 'main' to avoid Control Tower row filters
vs_catalog = "main"

# COMMAND ----------

# DBTITLE 1,Validation Helper
import json as _json
import re as _re
import requests as _requests

_host = os.environ["DATABRICKS_HOST"]
_token = os.environ["DATABRICKS_TOKEN"]
_auth_headers = {"Authorization": f"Bearer {_token}"}

results = []

def check(service, name, passed, detail=""):
    """Record a single validation result."""
    status = "PASS" if passed else "FAIL"
    results.append({"service": service, "check": name, "status": status, "detail": detail})
    print(f"  [{status}] {service}: {name}" + (f" — {detail}" if detail else ""))

# COMMAND ----------

# DBTITLE 1,UC Tables
print("=== UC Tables ===")

_tables = [
    f"{catalog_name}.{schema_name}.object_catalog",
    f"{catalog_name}.{schema_name}.object_catalog_unzip",
    f"{catalog_name}.{schema_name}.object_catalog_autoseg_result",
]

for t in _tables:
    try:
        exists = spark.catalog.tableExists(t)
        check("UC Tables", t, exists, "exists" if exists else "NOT FOUND")
    except Exception as e:
        check("UC Tables", t, False, str(e)[:120])

# Row count on object_catalog
try:
    count = spark.sql(f"SELECT COUNT(*) AS cnt FROM {_tables[0]}").collect()[0]["cnt"]
    check("UC Tables", f"{_tables[0]} row count", count > 0, f"{count} rows")
except Exception as e:
    check("UC Tables", f"{_tables[0]} row count", False, str(e)[:120])

# COMMAND ----------

# DBTITLE 1,UC Functions
print("=== UC Functions ===")

_functions = [
    f"{catalog_name}.{schema_name}.extract_tags",
    f"{catalog_name}.{schema_name}.extract_tag_value",
]

for fn in _functions:
    try:
        spark.sql(f"DESCRIBE FUNCTION {fn}")
        check("UC Functions", fn, True, "exists")
    except Exception as e:
        check("UC Functions", fn, False, str(e)[:120])

# COMMAND ----------

# DBTITLE 1,Dashboard
print("=== Dashboard ===")

_dashboard = None
try:
    dashboards = list(w.lakeview.list())
    match = [d for d in dashboards if d.display_name and "Pixels" in d.display_name]
    if match:
        check("Dashboard", match[0].display_name, True, f"id={match[0].dashboard_id}")
        _dashboard = w.lakeview.get(match[0].dashboard_id)
    else:
        check("Dashboard", "Pixels dashboard", False, "no dashboard with 'Pixels' in name")
except Exception as e:
    check("Dashboard", "Pixels dashboard", False, str(e)[:120])

# Run each dashboard dataset query to catch SQL errors
if _dashboard and _dashboard.serialized_dashboard:
    try:
        _dash_json = _json.loads(_dashboard.serialized_dashboard)
    except Exception:
        _dash_json = {}

    for ds in _dash_json.get("datasets", []):
        ds_name = ds.get("displayName", ds.get("name", "unknown"))
        query_lines = ds.get("queryLines", [])
        if not query_lines:
            continue
        query = "".join(query_lines)

        # Substitute :param references with their default values
        params = {p["keyword"]: p["defaultSelection"]["values"]["values"][0]["value"]
                  for p in ds.get("parameters", [])
                  if p.get("defaultSelection", {}).get("values", {}).get("values")}

        # Replace identifier(:param) with the default table name
        for kw, val in params.items():
            query = _re.sub(rf"identifier\(\s*:{kw}\s*\)", val, query)
            query = _re.sub(rf":{kw}(?=\b)", f"'{val}'", query)

        # Wrap in a LIMIT 1 outer query to keep it lightweight
        wrapped = f"SELECT * FROM ({query}) _v LIMIT 1"

        try:
            spark.sql(wrapped).collect()
            check("Dashboard", f"query '{ds_name}'", True, "OK")
        except Exception as e:
            check("Dashboard", f"query '{ds_name}'", False, str(e)[:150])

# COMMAND ----------

# DBTITLE 1,Lakebase
print("=== Lakebase ===")

_lakebase_instance = "pixels-lakebase"

try:
    _lb_resp = _requests.get(f"{_host}/api/2.0/postgres/projects/{_lakebase_instance}", headers=_auth_headers)
    _lb_resp.raise_for_status()
    _lb_data = _lb_resp.json()
    _proj_name = _lb_data.get("status", {}).get("display_name", _lakebase_instance)
    check("Lakebase", _lakebase_instance, True, f"project={_proj_name}")
except Exception as e:
    check("Lakebase", _lakebase_instance, False, str(e)[:120])

try:
    from dbx.pixels.lakebase import LakebaseUtils
    lb = LakebaseUtils(instance_name=_lakebase_instance, uc_table_name=table)
    result = lb.execute_query("SELECT 1 AS ping")
    check("Lakebase", "SELECT 1 ping", True, "connected")
except Exception as e:
    check("Lakebase", "SELECT 1 ping", False, str(e)[:120])

# COMMAND ----------

# DBTITLE 1,Apps
print("=== Apps ===")

_app_names = ["pixels-dicomweb-gateway", "pixels-dicomweb"]

for _app_name in _app_names:
    try:
        _app = w.apps.get(_app_name)
        _app_state = _app.app_status.state.value if _app.app_status and _app.app_status.state else "unknown"
        is_running = _app_state == "RUNNING"
        check("Apps", f"{_app_name} state", is_running, _app_state)

        # Health check
        if _app.url:
            try:
                resp = _requests.get(f"{_app.url}/health", timeout=10, headers=_auth_headers)
                check("Apps", f"{_app_name} /health", resp.status_code == 200, f"HTTP {resp.status_code}")
            except Exception as e:
                check("Apps", f"{_app_name} /health", False, str(e)[:120])
    except Exception as e:
        check("Apps", f"{_app_name}", False, str(e)[:120])

# COMMAND ----------

# DBTITLE 1,Model Serving
print("=== Model Serving ===")

try:
    ep = w.serving_endpoints.get(serving_endpoint_name)
    ep_state = ep.state.ready.value if ep.state and ep.state.ready else "unknown"
    check("Model Serving", f"{serving_endpoint_name} state", ep_state == "READY", ep_state)

    if ep_state == "READY":
        try:
            import mlflow
            client = mlflow.deployments.get_deploy_client("databricks")
            resp = client.predict(
                endpoint=serving_endpoint_name,
                inputs={"dataframe_records": [{"input": {"action": "info"}}]},
            )
            check("Model Serving", f"{serving_endpoint_name} info ping", True, "responded")
        except Exception as e:
            check("Model Serving", f"{serving_endpoint_name} info ping", False, str(e)[:120])
    else:
        check("Model Serving", f"{serving_endpoint_name} info ping", False, f"skipped — endpoint {ep_state}")
except Exception as e:
    check("Model Serving", serving_endpoint_name, False, str(e)[:120])

# COMMAND ----------

# DBTITLE 1,Vector Search
print("=== Vector Search ===")

try:
    from databricks.vector_search.client import VectorSearchClient
    vs_client = VectorSearchClient()

    vs_ep = vs_client.get_endpoint("pixels_vs_endpoint")
    ep_status = vs_ep.get("endpoint_status", {}).get("state", "unknown")
    check("Vector Search", "pixels_vs_endpoint", ep_status == "ONLINE", ep_status)
except Exception as e:
    check("Vector Search", "pixels_vs_endpoint", False, str(e)[:120])

try:
    _vs_index_name = f"{vs_catalog}.{schema_name}.dicom_tags_vs"
    idx = vs_client.get_index("pixels_vs_endpoint", _vs_index_name)
    idx_status = idx.describe().get("status", {}).get("ready", False)
    check("Vector Search", _vs_index_name, idx_status, "ONLINE" if idx_status else "not ready")
except Exception as e:
    check("Vector Search", f"{vs_catalog}.{schema_name}.dicom_tags_vs", False, str(e)[:120])

# COMMAND ----------

# DBTITLE 1,Genie Space
print("=== Genie Space ===")

try:
    resp = _requests.get(f"{_host}/api/2.0/genie/spaces", headers=_auth_headers)
    resp.raise_for_status()
    spaces = resp.json().get("spaces", [])
    match = [s for s in spaces if s.get("title") == "Pixels - Genie"]
    if match:
        check("Genie Space", "Pixels - Genie", True, f"id={match[0].get('space_id', 'unknown')}")
    else:
        check("Genie Space", "Pixels - Genie", False, "not found")
except Exception as e:
    check("Genie Space", "Pixels - Genie", False, str(e)[:120])

# COMMAND ----------

# DBTITLE 1,Summary
print("\n" + "=" * 70)
print("PIXELS INSTALL VALIDATION SUMMARY")
print("=" * 70)

# Aligned table output
svc_w = max(len(r["service"]) for r in results)
chk_w = max(len(r["check"]) for r in results)

for r in results:
    flag = "PASS" if r["status"] == "PASS" else "FAIL"
    detail = f"  {r['detail']}" if r["detail"] else ""
    print(f"  [{flag}] {r['service']:<{svc_w}}  {r['check']:<{chk_w}}{detail}")

passed = sum(1 for r in results if r["status"] == "PASS")
total = len(results)
print("=" * 70)
print(f"Result: {passed}/{total} checks passed")
print("=" * 70)

if passed == total:
    dbutils.notebook.exit(f"PASS: {passed}/{total}")
else:
    failed = [r for r in results if r["status"] == "FAIL"]
    fail_names = ", ".join(f"{r['service']}/{r['check']}" for r in failed[:5])
    dbutils.notebook.exit(f"FAIL: {passed}/{total} — {fail_names}")
