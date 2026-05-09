# Databricks notebook source
# MAGIC %md
# MAGIC # Validate Pixels Installation
# MAGIC
# MAGIC Final install task that checks every deployed service is present and functional.
# MAGIC Each check is independent — one failure does not block the others.

# COMMAND ----------

# MAGIC %pip install --quiet databricks-sdk==0.88.0 psycopg2-binary

# COMMAND ----------

dbutils.library.restartPython()

# COMMAND ----------

# MAGIC %run ./config/proxy_prep

# COMMAND ----------

# DBTITLE 1,Widget Init & Environment Setup
sql_warehouse_id, table, volume = init_widgets(show_volume=True)
model_uc_name, serving_endpoint_name, _ = init_model_serving_widgets()
init_env()

catalog_name, schema_name, table_name = table.split(".")

# Vector search source tables live in the same catalog as the job parameters
vs_catalog = catalog_name

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

_dashboard_json = None
try:
    _dash_resp = _requests.get(f"{_host}/api/2.0/lakeview/dashboards", headers=_auth_headers, params={"page_size": 100})
    _dash_resp.raise_for_status()
    _all_dashboards = _dash_resp.json().get("dashboards", [])
    match = [d for d in _all_dashboards if "Pixels" in d.get("display_name", "")]
    if match:
        _d = match[0]
        check("Dashboard", _d["display_name"], True, f"id={_d['dashboard_id']}")
        # Fetch full dashboard to get serialized_dashboard with queries
        _full_resp = _requests.get(f"{_host}/api/2.0/lakeview/dashboards/{_d['dashboard_id']}", headers=_auth_headers)
        _full_resp.raise_for_status()
        _ser = _full_resp.json().get("serialized_dashboard", "")
        _dashboard_json = _json.loads(_ser) if _ser else {}
    else:
        check("Dashboard", "Pixels dashboard", False, "no dashboard with 'Pixels' in name")
except Exception as e:
    check("Dashboard", "Pixels dashboard", False, str(e)[:120])

# Validate each dashboard query using the current job parameters (read-only).
if _dashboard_json:
    _param_overrides = {"table": table}

    for ds in _dashboard_json.get("datasets", []):
        ds_name = ds.get("displayName", ds.get("name", "unknown"))
        query_lines = ds.get("queryLines", [])
        if not query_lines:
            continue
        query = "".join(query_lines)

        # Substitute :param references — prefer job params over stale defaults
        params = {}
        for p in ds.get("parameters", []):
            kw = p.get("keyword", "")
            if kw in _param_overrides:
                params[kw] = _param_overrides[kw]
            else:
                try:
                    params[kw] = p["defaultSelection"]["values"]["values"][0]["value"]
                except (KeyError, IndexError):
                    pass

        # Replace identifier(:param) with the actual table name
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

import psycopg2  # noqa: E402

_lakebase_instance = "pixels-lakebase"
_lb_branch = "production"
_lb_endpoint_rn = f"projects/{_lakebase_instance}/branches/{_lb_branch}/endpoints/primary"

try:
    _lb_resp = _requests.get(f"{_host}/api/2.0/postgres/projects/{_lakebase_instance}", headers=_auth_headers)
    _lb_resp.raise_for_status()
    _lb_data = _lb_resp.json()
    _proj_name = _lb_data.get("status", {}).get("display_name", _lakebase_instance)
    check("Lakebase", _lakebase_instance, True, f"project={_proj_name}")
except Exception as e:
    check("Lakebase", _lakebase_instance, False, str(e)[:120])

try:
    _lb_ep_resp = _requests.get(
        f"{_host}/api/2.0/postgres/projects/{_lakebase_instance}/branches/{_lb_branch}/endpoints",
        headers=_auth_headers,
    )
    _lb_ep_resp.raise_for_status()
    _lb_eps = _lb_ep_resp.json().get("endpoints", [])
    if _lb_eps:
        _ep_state = _lb_eps[0].get("status", {}).get("current_state", "unknown")
        check("Lakebase", "endpoint state", _ep_state == "ACTIVE", _ep_state)
    else:
        check("Lakebase", "endpoint state", False, "no endpoints found")
except Exception as e:
    check("Lakebase", "endpoint state", False, str(e)[:120])


def _lb_open_connection():
    """Open a Postgres connection to Lakebase as the install user."""
    _ep = w.postgres.get_endpoint(_lb_endpoint_rn)
    _cred = w.postgres.generate_database_credential(endpoint=_lb_endpoint_rn)
    return psycopg2.connect(
        database=catalog_name,
        user=w.current_user.me().user_name,
        host=_ep.status.hosts.host,
        password=_cred.token,
        sslmode="require",
        connect_timeout=30,
    )


def _lb_synced_table_state(conn):
    """Return (pipeline_state, row_count) for the instance_paths synced table."""
    _resp = _requests.get(
        f"{_host}/api/2.0/database/synced_tables/{catalog_name}.{schema_name}.instance_paths",
        headers=_auth_headers,
    )
    _resp.raise_for_status()
    _body = _resp.json()
    _state = (
        _body.get("data_synchronization_status", {}).get("detailed_state")
        or _body.get("status", {}).get("detailed_state")
        or "UNKNOWN"
    )
    with conn.cursor() as cur:
        cur.execute(f'SELECT COUNT(*) FROM "{schema_name}".instance_paths')
        cnt = cur.fetchone()[0]
    conn.commit()
    return _state, cnt


def _lb_gateway_sp_grants(conn):
    """Return (sp_uuid, em_insert, ip_select) — privilege checks for the gateway SP."""
    _app = w.apps.get("pixels-dicomweb-gateway")
    _sp = _app.service_principal_client_id
    if not _sp:
        return None, False, False
    em = f'"{schema_name}".endpoint_metrics'
    ip = f'"{schema_name}".instance_paths'
    with conn.cursor() as cur:
        cur.execute("SELECT has_table_privilege(%s, %s, 'INSERT')", (_sp, em))
        em_ok = cur.fetchone()[0]
        cur.execute("SELECT has_table_privilege(%s, %s, 'SELECT')", (_sp, ip))
        ip_ok = cur.fetchone()[0]
    conn.commit()
    return _sp, em_ok, ip_ok


def _lb_metrics_writes(conn):
    """Return (count, max_recorded_at) for endpoint_metrics."""
    with conn.cursor() as cur:
        cur.execute(f'SELECT COUNT(*), MAX(recorded_at) FROM "{schema_name}".endpoint_metrics')
        cnt, last = cur.fetchone()
    conn.commit()
    return cnt, last


_lb_conn = None
try:
    _lb_conn = _lb_open_connection()
    with _lb_conn.cursor() as _cur:
        _cur.execute("SELECT 1")
        _ok = _cur.fetchone()[0] == 1
    _lb_conn.commit()
    check("Lakebase", "Postgres connectivity", _ok, f"db={catalog_name} as install user")
except Exception as e:
    check("Lakebase", "Postgres connectivity", False, str(e)[:150])

if _lb_conn is not None:
    try:
        _state, _cnt = _lb_synced_table_state(_lb_conn)
        check("Lakebase", "instance_paths pipeline", _state not in ("FAILED", "UNKNOWN"), _state)
        check("Lakebase", "instance_paths rows", _cnt > 0, f"{_cnt} rows")
    except Exception as e:
        check("Lakebase", "instance_paths sync", False, str(e)[:150])

    try:
        _sp, _em_ok, _ip_ok = _lb_gateway_sp_grants(_lb_conn)
        if _sp is None:
            check("Lakebase", "gateway SP grants", False, "no SP client_id on app")
        else:
            check("Lakebase", "gateway SP INSERT endpoint_metrics", _em_ok, f"sp={_sp[:8]}…")
            check("Lakebase", "gateway SP SELECT instance_paths", _ip_ok, f"sp={_sp[:8]}…")
    except Exception as e:
        check("Lakebase", "gateway SP grants", False, str(e)[:150])

    try:
        _cnt, _last = _lb_metrics_writes(_lb_conn)
        check("Lakebase", "endpoint_metrics writes", _cnt > 0, f"{_cnt} rows, last={_last}")
    except Exception as e:
        check("Lakebase", "endpoint_metrics writes", False, str(e)[:150])

    try:
        _lb_conn.close()
    except Exception:
        pass

# COMMAND ----------

# DBTITLE 1,Apps
print("=== Apps ===")

_app_names = ["pixels-dicomweb-gateway", "pixels-dicomweb"]

for _app_name in _app_names:
    try:
        _app_resp = _requests.get(f"{_host}/api/2.0/apps/{_app_name}", headers=_auth_headers)
        _app_resp.raise_for_status()
        _app_data = _app_resp.json()
        _app_state = _app_data.get("app_status", {}).get("state", "unknown")
        is_running = _app_state == "RUNNING"
        check("Apps", f"{_app_name} state", is_running, _app_state)

        # Health check
        _app_url = _app_data.get("url", "")
        if _app_url:
            try:
                resp = _requests.get(f"{_app_url}/health", timeout=10, headers=_auth_headers)
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
            _ping_resp = _requests.post(
                f"{_host}/serving-endpoints/{serving_endpoint_name}/invocations",
                headers={**_auth_headers, "Content-Type": "application/json"},
                json={"dataframe_records": [{"input": {"action": "info"}}]},
                timeout=120,
            )
            check("Model Serving", f"{serving_endpoint_name} info ping", _ping_resp.status_code == 200, f"HTTP {_ping_resp.status_code}")
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
    _vs_ep_resp = _requests.get(f"{_host}/api/2.0/vector-search/endpoints/pixels_vs_endpoint", headers=_auth_headers)
    _vs_ep_resp.raise_for_status()
    ep_status = _vs_ep_resp.json().get("endpoint_status", {}).get("state", "unknown")
    check("Vector Search", "pixels_vs_endpoint", ep_status == "ONLINE", ep_status)
except Exception as e:
    check("Vector Search", "pixels_vs_endpoint", False, str(e)[:120])

try:
    _vs_index_name = f"{vs_catalog}.{schema_name}.dicom_tags_vs"
    _vs_idx_resp = _requests.get(f"{_host}/api/2.0/vector-search/indexes/{_vs_index_name}", headers=_auth_headers)
    _vs_idx_resp.raise_for_status()
    idx_status = _vs_idx_resp.json().get("status", {}).get("ready", False)
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
    match = [s for s in spaces if "Pixels" in s.get("title", "") and "Genie" in s.get("title", "")]
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
    fail_lines = [
        f"{r['service']}/{r['check']}: {r['detail']}" if r.get("detail") else f"{r['service']}/{r['check']}"
        for r in failed[:5]
    ]
    raise Exception(f"FAIL: {passed}/{total} — " + " | ".join(fail_lines))
