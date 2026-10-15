# Databricks notebook source
# /// script
# [tool.databricks.environment]
# environment_version = "5"
# ///
# DBTITLE 1,WSI Ingest — Overview
# MAGIC %md
# MAGIC # Whole Slide Image (WSI) Ingest Pipeline
# MAGIC
# MAGIC Unified ingest for **all OpenSlide-supported formats**: Aperio SVS, Hamamatsu NDPI, Leica SCN, MIRAX MRXS, Philips TIFF, Ventana BIF/TIF, Sakura SVSLIDE, generic TIFF.
# MAGIC
# MAGIC **Pipeline**
# MAGIC 1. Install dependencies (`openslide-python`, `openslide-bin`, `tifffile`)
# MAGIC 2. Add `src/` to path for editable development
# MAGIC 3. Configure source paths and target Delta table
# MAGIC 4. `WSICatalog.catalog()` — discover all WSI files (multi-extension)
# MAGIC 5. `WSIMetaExtractor.transform()` — extract metadata into `meta VARIANT`
# MAGIC 6. Save enriched catalog to Delta
# MAGIC 7. Verify and explore results

# COMMAND ----------

# DBTITLE 1,Note — re-attach before re-running
# MAGIC %md
# MAGIC > **Re-attach before re-running.** If you add new slides to a source folder and then re-run
# MAGIC > this notebook in the *same* attached session, the batch `catalog()` scan can reuse the
# MAGIC > session's earlier file listing and silently miss the new files (no error is raised).
# MAGIC > Detach and re-attach the notebook (or run it as a job, which always gets a fresh session)
# MAGIC > before re-running. For folders that keep receiving new files, use `streaming=True`
# MAGIC > (Auto Loader), which tracks newly arrived files on its own.

# COMMAND ----------

# DBTITLE 1,Install dependencies
# MAGIC %md
# MAGIC This notebook loads the Pixels code from this repo's `src/` folder (next cell), so it
# MAGIC only needs the WSI libraries. These match the `wsi` extra in `setup.py` — keep them in
# MAGIC sync. All three install cleanly on serverless. Add `imagecodecs` (the `wsi-codecs`
# MAGIC extra) only if you need to decode compressed generic TIFFs; OpenSlide formats and
# MAGIC metadata extraction don't need it.

# COMMAND ----------

# MAGIC %pip install openslide-python openslide-bin tifffile -q

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
# Defaults match the bundle defaults in databricks.yml (catalog=main, schema=pixels).
dbutils.widgets.text(
    "table", "main.pixels.wsi_object_catalog", label="1.0 Catalog.Schema.Table for WSI metadata"
)
dbutils.widgets.text(
    "volume", "main.pixels.pixels_volume", label="2.0 Catalog.Schema.Volume (checkpoints, scratch)"
)
dbutils.widgets.text(
    "source_paths",
    "/Volumes/main/pixels/pixels_volume/wsi",
    label="3.0 Source folder(s) with WSI files, comma-separated",
)

TABLE = dbutils.widgets.get("table").strip()
VOLUME = dbutils.widgets.get("volume").strip()
SOURCE_PATHS = [p.strip() for p in dbutils.widgets.get("source_paths").split(",") if p.strip()]

print(f"Source paths: {SOURCE_PATHS}")
print(f"Target table: {TABLE}")
print(f"Volume:       {VOLUME}")

# COMMAND ----------

# DBTITLE 1,Initialize WSICatalog
from dbx.pixels.wsi import WSICatalog, WSIMetaExtractor, OPENSLIDE_PATTERNS

catalog = WSICatalog(spark, table=TABLE, volume=VOLUME)
print(f"Catalog: {catalog}")
print(f"WSI patterns: {OPENSLIDE_PATTERNS}")

# COMMAND ----------

# DBTITLE 1,Discover & catalog all WSI files
from functools import reduce
from pyspark.sql import DataFrame

# Catalog each source path and union results
dfs = []
for path in SOURCE_PATHS:
    try:
        df = catalog.catalog(path=path)  # Uses all WSI patterns by default
        dfs.append(df)
        print(f"  ✓ {path}")
    except Exception as e:
        print(f"  ✗ {path}: {e}")

if dfs:
    catalog_df = reduce(DataFrame.union, dfs).dropDuplicates(["path"]).repartition(8)
    print(f"\nTotal WSI files discovered: {catalog_df.count()}")
    display(catalog_df.select("path", "modificationTime", "length", "extension"))
else:
    raise ValueError("No WSI files found in any source path")

# COMMAND ----------

# DBTITLE 1,Extract WSI metadata
# WSIMetaExtractor adds a `meta` VARIANT column with:
# - All OpenSlide properties (vendor-specific: aperio.*, hamamatsu.*, philips.*, etc.)
# - Derived fields: _wsi_vendor, _wsi_format, _wsi_width, _wsi_height, _wsi_level_count,
#   _wsi_mpp_x, _wsi_mpp_y, _wsi_objective_power, _wsi_has_label, _wsi_has_macro
# - phi_tag_report: PHI classification of all properties

extractor = WSIMetaExtractor(catalog, inputCol="local_path", outputCol="meta")
enriched_df = extractor.transform(catalog_df)

print(f"Schema: {[f.name for f in enriched_df.schema.fields]}")
display(enriched_df.select("local_path", "extension", "meta"))

# COMMAND ----------

# DBTITLE 1,Save to Delta table
# Save the enriched catalog to Delta
catalog.save(enriched_df, mode="overwrite")

print(f"✓ Saved to {TABLE}")
print(f"  Rows: {spark.table(TABLE).count()}")

# COMMAND ----------

# DBTITLE 1,Explore metadata — vendor breakdown
# Vendor breakdown from extracted metadata
display(spark.sql(f"""
    SELECT
      meta:_wsi_vendor::STRING AS vendor,
      meta:_wsi_format::STRING AS format,
      meta:_wsi_backend::STRING AS backend,
      COUNT(*) AS file_count,
      AVG(meta:_wsi_width::INT) AS avg_width,
      AVG(meta:_wsi_height::INT) AS avg_height,
      AVG(meta:_wsi_mpp_x::DOUBLE) AS avg_mpp_x
    FROM {TABLE}
    GROUP BY 1, 2, 3
    ORDER BY file_count DESC
"""))

# COMMAND ----------

# DBTITLE 1,Explore metadata — PHI exposure
# PHI tag exposure summary
display(spark.sql(f"""
    SELECT
      local_path,
      meta:_wsi_vendor::STRING AS vendor,
      meta:_wsi_has_label::BOOLEAN AS has_label,
      meta:_wsi_has_macro::BOOLEAN AS has_macro,
      SIZE(CAST(meta:phi_tag_report AS ARRAY<STRING>)) AS phi_tag_count
    FROM {TABLE}
    WHERE SIZE(CAST(meta:phi_tag_report AS ARRAY<STRING>)) > 0
    ORDER BY phi_tag_count DESC
"""))
