# Databricks notebook source
# MAGIC %md
# MAGIC # Post-Install Updates
# MAGIC
# MAGIC Applies configuration updates that cannot be expressed declaratively in DAB:
# MAGIC - Set app thumbnails
# MAGIC
# MAGIC Note: dashboard parameter defaults (table, viewer_host) are now templated at
# MAGIC `make deploy` time by `scripts/render_dashboard.py`, so they survive
# MAGIC subsequent `bundle deploy` runs without needing a runtime patch.

# COMMAND ----------

# MAGIC %run ./config/proxy_prep

# COMMAND ----------

# DBTITLE 1,Set App Thumbnail
import base64
import os

app_name = "pixels-dicomweb"

# Notebook CWD is install/ — go up one level to repo root
_repo_root = os.path.dirname(os.getcwd())
_logo_path = os.path.join(_repo_root, "images", "Pixels Logo.png")
with open(_logo_path, "rb") as f:
    _encoded_thumbnail = base64.b64encode(f.read()).decode("utf-8")

# PATCH /api/2.0/apps/{name}/thumbnail  (body: app_thumbnail.thumbnail = base64 bytes)
w.api_client.do("PATCH", f"/api/2.0/apps/{app_name}/thumbnail", body={
    "app_thumbnail": {"thumbnail": _encoded_thumbnail},
})
print(f"✓ Thumbnail set for '{app_name}'")
