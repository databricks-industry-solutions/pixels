# Databricks notebook source
# MAGIC %md
# MAGIC # Image to DICOM Converter
# MAGIC
# MAGIC This notebook converts standard image files (PNG, JPEG, TIFF, BMP, GIF) into
# MAGIC DICOM files using the **`ImageToDicomTransformer`** — a Spark ML Pipeline
# MAGIC Transformer that plugs into the same workflow as `DicomMetaExtractor` and
# MAGIC other `dbx.pixels.dicom` components.
# MAGIC
# MAGIC ### Key Concepts
# MAGIC - **All images in the same folder** are treated as a single DICOM **Series**.
# MAGIC - Each image becomes one DICOM **Instance** (its own `SOPInstanceUID`).
# MAGIC - A **JSON metadata file** supplies patient / study / series information.
# MAGIC   If no JSON is provided, sensible defaults and file‑level metadata are used.
# MAGIC
# MAGIC ### Requirements
# MAGIC - **Runtime**: Databricks Runtime 14.3 LTS+
# MAGIC - **Libraries**: `pydicom`, `Pillow`, `numpy` (all included in the pixels package)

# COMMAND ----------

# MAGIC %md
# MAGIC ## 0 — Configuration

# COMMAND ----------

# DBTITLE 1,Widgets
dbutils.widgets.text("input_path",  "/Volumes/catalog/schema/volume/images", "Input folder (images)")
dbutils.widgets.text("output_path", "/Volumes/catalog/schema/volume/dicom_output", "Output folder (DICOM)")
dbutils.widgets.text("metadata_json", "", "Metadata JSON path (optional)")
dbutils.widgets.text("table", "catalog.schema.object_catalog", "Catalog table")
dbutils.widgets.text("volume", "catalog.schema.volume", "Catalog volume")

input_path    = dbutils.widgets.get("input_path")
output_path   = dbutils.widgets.get("output_path")
metadata_json = dbutils.widgets.get("metadata_json") or None
table         = dbutils.widgets.get("table")
volume        = dbutils.widgets.get("volume")

print(f"Input path:     {input_path}")
print(f"Output path:    {output_path}")
print(f"Metadata JSON:  {metadata_json or '(not provided – using defaults)'}")

# COMMAND ----------

# MAGIC %md
# MAGIC ## 1 — Catalog the image files

# COMMAND ----------

# DBTITLE 1,Build the file catalog
from dbx.pixels import Catalog

catalog = Catalog(spark, table=table, volume=volume)
catalog_df = catalog.catalog(path=input_path)
display(catalog_df.select("path", "local_path", "extension"))

# COMMAND ----------

# MAGIC %md
# MAGIC ## 2 — Convert images to DICOM
# MAGIC
# MAGIC The `ImageToDicomTransformer` filters the catalog to supported image
# MAGIC extensions, groups files by folder (one folder = one Series), and writes
# MAGIC a valid **DICOM Secondary Capture** file for each image.

# COMMAND ----------

# DBTITLE 1,Run the transformer
from dbx.pixels.dicom.converter import ImageToDicomTransformer

converter = ImageToDicomTransformer(
    output_dir=output_path,
    metadata_json=metadata_json,
    input_base_path=input_path,
)

result_df = converter.transform(catalog_df)
display(
    result_df.select(
        "path", "dicom_path", "study_instance_uid",
        "series_instance_uid", "instance_number", "conversion_status",
    )
)

# COMMAND ----------

# MAGIC %md
# MAGIC ## 3 — Summary

# COMMAND ----------

# DBTITLE 1,Conversion statistics
from pyspark.sql import functions as F

result_df.groupBy("conversion_status").count().show()

print(f"Total files processed: {result_df.count()}")
print(f"Successful: {result_df.filter(F.col('conversion_status') == 'OK').count()}")

# COMMAND ----------

# MAGIC %md
# MAGIC ## 4 — Validate a sample DICOM file

# COMMAND ----------

# DBTITLE 1,Read back and inspect
import pydicom

sample_row = result_df.filter(F.col("conversion_status") == "OK").first()
if sample_row:
    ds = pydicom.dcmread(sample_row["dicom_path"])
    print(f"Sample file: {sample_row['dicom_path']}\n")
    print(ds)
else:
    print("No successful conversions to validate.")

# COMMAND ----------

# MAGIC %md
# MAGIC ## 5 — (Optional) Generate a metadata template
# MAGIC
# MAGIC Run the cell below to write a sample JSON file you can customise.

# COMMAND ----------

# DBTITLE 1,Write metadata template
# from dbx.pixels.dicom.converter import METADATA_TEMPLATE
#
# template_path = f"{output_path}/dicom_metadata_template.json"
# with open(template_path, "w") as f:
#     f.write(METADATA_TEMPLATE)
# print(f"Template written to {template_path}")

# COMMAND ----------

# MAGIC %md
# MAGIC ## 6 — (Optional) Register in the Pixels catalog

# COMMAND ----------

# DBTITLE 1,Catalog the DICOM output
# from dbx.pixels.dicom import DicomMetaExtractor
#
# dicom_catalog_df = catalog.catalog(path=output_path)
# meta_df = DicomMetaExtractor(catalog).transform(dicom_catalog_df)
# catalog.save(meta_df, mode="overwrite")
# display(spark.sql(f"SELECT * FROM {table}"))

