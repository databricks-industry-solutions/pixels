# Databricks notebook source
token = dbutils.secrets.get("solution-accelerator-cicd", "github-pat")

# COMMAND ----------

# MAGIC %pip install git+https://token:$token@github.com/databricks-industry-solutions/pixels.git

# COMMAND ----------

# MAGIC %load_ext autoreload
# MAGIC %autoreload 2

# COMMAND ----------

dbutils.widgets.text("path", "s3://hls-eng-data-public/dicom/ddsm/", label="1.0 Path to directory tree containing files. /dbfs or s3:// supported")
dbutils.widgets.text("table", "hive_metastore.pixels_solacc.object_catalog", label="2.0 Catalog Schema Table to store object metadata into")
dbutils.widgets.dropdown("mode",defaultValue="overwrite",choices=["overwrite","append"], label="3.0 Update mode on object metadata table")

path = dbutils.widgets.get("path")
table = dbutils.widgets.get("table")
write_mode = dbutils.widgets.get("mode")

spark.conf.set('c.table',table)
print(F"{path}, {table}, {write_mode}")

# COMMAND ----------

from databricks.pixels import Catalog, DicomFrames
catalog = Catalog(spark,path)

# COMMAND ----------

catalog_df = catalog.catalog()
display(catalog_df)

# COMMAND ----------

from databricks.pixels import DicomMetaExtractor # The transformer
meta = DicomMetaExtractor(catalog)

# COMMAND ----------

meta_df = meta.transform(catalog_df)

# COMMAND ----------

display(meta_df.limit(10))

# COMMAND ----------

from databricks.pixels import DicomMetaExtractor # The transformer
meta = DicomMetaExtractor(catalog)
catalog.save(meta_df, table=table, mode=write_mode)
display(spark.table(table))

# COMMAND ----------

# MAGIC %md ## Summary
# MAGIC `databricks.pixels` and Databricks makes it easy to scale up your Dicom file processing.

# COMMAND ----------


