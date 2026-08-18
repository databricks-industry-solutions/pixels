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

# DBTITLE 1,Install dependencies
# MAGIC %pip install openslide-python openslide-bin tifffile imagecodecs Pillow -q

# COMMAND ----------

# DBTITLE 1,Add src/ to sys.path
import sys

SRC_PATH = "/Workspace/Users/douglas.moore@databricks.com/pixels-tiff/src"
if SRC_PATH not in sys.path:
    sys.path.insert(0, SRC_PATH)
    print(f"Added to sys.path: {SRC_PATH}")
else:
    print(f"Already on sys.path: {SRC_PATH}")

# COMMAND ----------

# DBTITLE 1,Configuration
# --- Source paths (all UC Volume locations with WSI files) ---
SOURCE_PATHS = [
    "/Volumes/hls_radiology_east/orthanc_demo/raw_images/Aperio",
    "/Volumes/hls_radiology_east/orthanc_demo/raw_images/Generic-TIFF",
    "/Volumes/hls_radiology_east/orthanc_demo/raw_images/Philips-TIFF",
    "/Volumes/hls_radiology_east/osuwmc/sample",
    "/Volumes/hls_radiology_east/jsl/samples",
]

# --- Target Delta table and volume ---
TABLE  = "dmoore.wsi.object_catalog"
VOLUME = "dmoore.wsi.wsi_volume"

print(f"Source paths: {len(SOURCE_PATHS)}")
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
# MAGIC %sql
# MAGIC -- Vendor breakdown from extracted metadata
# MAGIC SELECT 
# MAGIC   meta:_wsi_vendor::STRING AS vendor,
# MAGIC   meta:_wsi_format::STRING AS format,
# MAGIC   meta:_wsi_backend::STRING AS backend,
# MAGIC   COUNT(*) AS file_count,
# MAGIC   AVG(meta:_wsi_width::INT) AS avg_width,
# MAGIC   AVG(meta:_wsi_height::INT) AS avg_height,
# MAGIC   AVG(meta:_wsi_mpp_x::DOUBLE) AS avg_mpp_x
# MAGIC FROM dmoore.wsi.object_catalog
# MAGIC GROUP BY 1, 2, 3
# MAGIC ORDER BY file_count DESC

# COMMAND ----------

# DBTITLE 1,Explore metadata — PHI exposure
# MAGIC %sql
# MAGIC -- PHI tag exposure summary
# MAGIC SELECT
# MAGIC   local_path,
# MAGIC   meta:_wsi_vendor::STRING AS vendor,
# MAGIC   meta:_wsi_has_label::BOOLEAN AS has_label,
# MAGIC   meta:_wsi_has_macro::BOOLEAN AS has_macro,
# MAGIC   SIZE(CAST(meta:phi_tag_report AS ARRAY<STRING>)) AS phi_tag_count
# MAGIC FROM dmoore.wsi.object_catalog
# MAGIC WHERE SIZE(CAST(meta:phi_tag_report AS ARRAY<STRING>)) > 0
# MAGIC ORDER BY phi_tag_count DESC
