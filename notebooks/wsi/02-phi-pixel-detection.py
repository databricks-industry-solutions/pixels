# Databricks notebook source
# /// script
# [tool.databricks.environment]
# environment_version = "5"
# ///
# DBTITLE 1,PHI Pixel Detection — Overview
# MAGIC %md
# MAGIC # WSI Pixel-Level PHI Detection
# MAGIC
# MAGIC Uses `WSIVLMPhiDetector` (OpenSlide-backed) to detect Protected Health Information
# MAGIC in the **label** and **macro** associated images of Whole Slide Image files.
# MAGIC
# MAGIC OpenSlide extracts the sub-image (no full-resolution data loaded), then a Databricks
# MAGIC VLM serving endpoint identifies PHI entities (patient names, DOBs, accession numbers, barcodes).
# MAGIC
# MAGIC **Prerequisite**: Run `01-ingest-wsi` first to populate the WSI metadata table, then set the
# MAGIC `table` widget below to that same table.

# COMMAND ----------

# DBTITLE 1,Install dependencies
# MAGIC %md
# MAGIC This notebook loads the Pixels code from this repo's `src/` folder (next cell), so it
# MAGIC only needs the WSI libraries (they match the `wsi` extra in `setup.py` — keep them in
# MAGIC sync) plus `mlflow`/`openai` for the VLM calls. If your slides are *compressed generic
# MAGIC TIFFs* (not OpenSlide formats), extracting the label/macro images decodes pixels and
# MAGIC also needs `imagecodecs` (the `wsi-codecs` extra), which may not build on serverless.

# COMMAND ----------

# MAGIC %pip install openslide-python openslide-bin tifffile mlflow openai -q

# COMMAND ----------

# DBTITLE 1,Add src/ to sys.path (editable dev only)
# Derive the repo root from this notebook's own location (works in Databricks Git
# folders / Workspace) rather than hardcoding a user path. If src/ isn't found
# (e.g. running against the pip-installed databricks-pixels[wsi]), use the package.
import os
import sys

_nb_ctx = dbutils.notebook.entry_point.getDbutils().notebook().getContext()
_nb_dir = "/Workspace" + os.path.dirname(_nb_ctx.notebookPath().get())
_repo_root = os.path.normpath(os.path.join(_nb_dir, "..", ".."))  # notebooks/wsi -> repo root
_src_path = os.path.join(_repo_root, "src")
if os.path.isdir(os.path.join(_src_path, "dbx", "pixels")):
    if _src_path not in sys.path:
        sys.path.insert(0, _src_path)
    print(f"Added to sys.path (editable): {_src_path}")
else:
    print("src/ not found next to notebook; using installed databricks-pixels package")

# COMMAND ----------

# DBTITLE 1,Configuration
# Set these with the widgets at the top of the notebook (or as job parameters).
# `table` is the WSI metadata table written by 01-ingest-wsi. `vlm_endpoint` is any
# vision-capable Databricks serving endpoint (Foundation Model API names change as models
# are released and retired — check Serving in your workspace if the default is missing).
dbutils.widgets.text(
    "table", "main.pixels.wsi_object_catalog", label="1.0 Catalog.Schema.Table from 01-ingest-wsi"
)
dbutils.widgets.text(
    "vlm_endpoint", "databricks-claude-sonnet-4-5", label="2.0 VLM serving endpoint for PHI detection"
)

TABLE = dbutils.widgets.get("table").strip()
VLM_ENDPOINT = dbutils.widgets.get("vlm_endpoint").strip()

print(f"Source table: {TABLE}")
print(f"VLM endpoint: {VLM_ENDPOINT}")

# COMMAND ----------

# DBTITLE 1,VLM PHI detection — label images
from pyspark.sql.functions import lit
from dbx.pixels.wsi import WSIVLMPhiDetector

# Run VLM PHI detection on up to three sub-image series per slide:
#   label  — printed patient name, barcode, accession (primary PHI target)
#   macro  — overview image (may contain handwritten labels)
#   tissue — smallest pyramid level (rarely contains PHI, but checks embedded text)
#
# Label and macro are only scanned for slides whose metadata says they have one
# (_wsi_has_label / _wsi_has_macro from 01-ingest-wsi). wsi_to_image falls back to the
# tissue thumbnail when a series is missing, so scanning it anyway would report a "label"
# result for a slide that has no label and send the same tissue image more than once.

base_df = spark.sql(f"""
    SELECT local_path, extension,
           meta:_wsi_vendor::STRING AS vendor,
           meta:_wsi_format::STRING AS format,
           coalesce(meta:_wsi_has_label::BOOLEAN, false) AS has_label,
           coalesce(meta:_wsi_has_macro::BOOLEAN, false) AS has_macro
    FROM {TABLE}
""").repartition(8)

print(f"Total WSI files: {base_df.count()}")

series_inputs = {
    "label": base_df.filter("has_label"),
    "macro": base_df.filter("has_macro"),
    "tissue": base_df,
}

results = []
for series, series_input in series_inputs.items():
    print(f"  {series:6}: {series_input.count()} slide(s) to scan")
    detector = WSIVLMPhiDetector(
        endpoint=VLM_ENDPOINT,
        inputCol="local_path",
        outputCol="vlm_phi",
        series=series,
        max_width=768,
        temperature=0.0,
    )
    series_df = detector.transform(series_input).withColumn("series", lit(series))
    results.append(series_df)

phi_df = results[0].unionByName(results[1]).unionByName(results[2])

print(f"Total scans: {phi_df.count()}")
display(phi_df.select("local_path", "vendor", "format", "series", "vlm_phi.*"))

# COMMAND ----------

# DBTITLE 1,PHI detection summary
from pyspark.sql.functions import col, size

results = phi_df.select(
    "local_path",
    "vendor",
    "series",
    col("vlm_phi.content").alias("phi_entities"),
    col("vlm_phi.error").alias("error"),
    col("vlm_phi.total_tokens").alias("tokens"),
)

total = results.count()
with_phi = results.filter(size("phi_entities") > 0).count()
with_error = results.filter(col("error").isNotNull()).count()

print("=== VLM PHI Detection Summary ===")
print(f"Total scans:                  {total}")
print(f"Scans with PHI detected:      {with_phi}")
print(f"Scans with errors:            {with_error}")
print()

# Show files/series where PHI was found
display(results.filter(size("phi_entities") > 0))
