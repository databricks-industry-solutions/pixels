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
# MAGIC **Prerequisite**: Run `01-ingest-wsi` first to populate `dmoore.wsi.object_catalog`.

# COMMAND ----------

# DBTITLE 1,Install dependencies
# MAGIC %pip install openslide-python openslide-bin tifffile imagecodecs Pillow mlflow openai -q

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
# --- Source: enriched metadata from 01-ingest-wsi ---
TABLE = "dmoore.wsi.object_catalog"

# --- VLM endpoint for PHI detection ---
VLM_ENDPOINT = "phi-detection"

print(f"Source table: {TABLE}")
print(f"VLM endpoint: {VLM_ENDPOINT}")

# COMMAND ----------

# DBTITLE 1,VLM PHI detection — label images
from pyspark.sql.functions import lit
from dbx.pixels.wsi import WSIVLMPhiDetector

# Run VLM PHI detection on all three sub-image series:
#   label  — printed patient name, barcode, accession (primary PHI target)
#   macro  — overview image (may contain handwritten labels)
#   tissue — smallest pyramid level (rarely contains PHI, but checks embedded text)
#
# wsi_to_image returns None (recorded as error, no VLM call) when a series is absent.

base_df = spark.sql(f"""
    SELECT local_path, extension,
           meta:_wsi_vendor::STRING AS vendor,
           meta:_wsi_format::STRING AS format
    FROM {TABLE}
""").repartition(8)

print(f"Total WSI files: {base_df.count()}")

results = []
for series in ["label", "macro", "tissue"]:
    detector = WSIVLMPhiDetector(
        endpoint=VLM_ENDPOINT,
        inputCol="local_path",
        outputCol="vlm_phi",
        series=series,
        max_width=768,
        temperature=0.0,
    )
    series_df = detector.transform(base_df).withColumn("series", lit(series))
    results.append(series_df)

phi_df = results[0].unionByName(results[1]).unionByName(results[2])

print(f"Total results (files × series): {phi_df.count()}")
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
print(f"Total scans (files × series): {total}")
print(f"Scans with PHI detected:      {with_phi}")
print(f"Scans with errors:            {with_error}")
print()

# Show files/series where PHI was found
display(results.filter(size("phi_entities") > 0))
