# Databricks notebook source
# MAGIC %md
# MAGIC # Post-Install Updates
# MAGIC
# MAGIC Applies configuration updates that cannot be expressed declaratively in DAB:
# MAGIC - Patch dashboard parameter defaults to match the deployed catalog/schema/table
# MAGIC - Set app thumbnails

# COMMAND ----------

# MAGIC %run ../../config/proxy_prep

# COMMAND ----------

# DBTITLE 1,Widget Init & Environment Setup
sql_warehouse_id, table, volume = init_widgets(show_volume=True)
init_env()

catalog_name, schema_name, table_name = table.split(".")

# COMMAND ----------

# DBTITLE 1,Patch Dashboard Table Parameter
import json as _json
import requests as _requests

_host = os.environ["DATABRICKS_HOST"]
_token = os.environ["DATABRICKS_TOKEN"]
_auth_headers = {"Authorization": f"Bearer {_token}"}

# Find the Pixels dashboard
_dash_resp = _requests.get(f"{_host}/api/2.0/lakeview/dashboards", headers=_auth_headers, params={"page_size": 100})
_dash_resp.raise_for_status()
_all_dashboards = _dash_resp.json().get("dashboards", [])
_match = [d for d in _all_dashboards if "Pixels" in d.get("display_name", "")]

if not _match:
    print("⚠ No dashboard with 'Pixels' in name — skipping parameter patch")
    dbutils.notebook.exit("SKIP: no Pixels dashboard found")

_dash_id = _match[0]["dashboard_id"]
print(f"Found dashboard: {_match[0]['display_name']} (id={_dash_id})")

# Fetch full dashboard JSON
_full_resp = _requests.get(f"{_host}/api/2.0/lakeview/dashboards/{_dash_id}", headers=_auth_headers)
_full_resp.raise_for_status()
_ser = _full_resp.json().get("serialized_dashboard", "")
_dashboard_json = _json.loads(_ser) if _ser else {}

# Get the deployed viewer app URL for the viewer_host parameter
_viewer_app = w.apps.get("pixels-dicomweb")
_viewer_host = _viewer_app.url

# Override parameter defaults to match the deployed environment
_param_overrides = {"table": table, "viewer_host": _viewer_host}
_updated = False

# Patch dataset parameter defaults
for ds in _dashboard_json.get("datasets", []):
    for p in ds.get("parameters", []):
        kw = p.get("keyword", "")
        if kw in _param_overrides:
            try:
                old_val = p["defaultSelection"]["values"]["values"][0]["value"]
                if old_val != _param_overrides[kw]:
                    p["defaultSelection"]["values"]["values"][0]["value"] = _param_overrides[kw]
                    _updated = True
            except (KeyError, IndexError):
                pass

# Patch Global Filters widget selection defaults so the UI pre-selects the correct values
_filter_param_map = {"table": "table", "viewer_host": "viewer_host"}
for page in _dashboard_json.get("pages", []):
    if page.get("pageType") != "PAGE_TYPE_GLOBAL_FILTERS":
        continue
    for layout in page.get("layout", []):
        spec = layout.get("widget", {}).get("spec", {})
        for field in spec.get("encodings", {}).get("fields", []):
            param_name = field.get("parameterName", "")
            if param_name in _param_overrides:
                _new_sel = {
                    "values": {
                        "dataType": "STRING",
                        "values": [{"value": _param_overrides[param_name]}],
                    }
                }
                if spec.get("selection", {}).get("defaultSelection") != _new_sel:
                    spec.setdefault("selection", {})["defaultSelection"] = _new_sel
                    _updated = True

if _updated:
    _requests.patch(
        f"{_host}/api/2.0/lakeview/dashboards/{_dash_id}",
        headers={**_auth_headers, "Content-Type": "application/json"},
        json={"serialized_dashboard": _json.dumps(_dashboard_json)},
    ).raise_for_status()
    print(f"✓ Dashboard parameter defaults updated: table={table}, viewer_host={_viewer_host}")
else:
    print(f"✓ Dashboard parameter defaults already correct: table={table}, viewer_host={_viewer_host}")

# COMMAND ----------

# DBTITLE 1,Set App Thumbnail
import base64

app_name = "pixels-dicomweb"

# Notebook CWD is resources/dabs/ — go up two levels to repo root
_repo_root = os.path.dirname(os.path.dirname(os.getcwd()))
_logo_path = os.path.join(_repo_root, "images", "Pixels Logo.png")
with open(_logo_path, "rb") as f:
    _encoded_thumbnail = base64.b64encode(f.read()).decode("utf-8")

# PATCH /api/2.0/apps/{name}/thumbnail  (body: app_thumbnail.thumbnail = base64 bytes)
w.api_client.do("PATCH", f"/api/2.0/apps/{app_name}/thumbnail", body={
    "app_thumbnail": {"thumbnail": _encoded_thumbnail},
})
print(f"✓ Thumbnail set for '{app_name}'")
