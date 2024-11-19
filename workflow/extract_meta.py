# Databricks notebook source
# MAGIC %run ../config/setup

# COMMAND ----------

path,table,volume,write_mode = init_widgets()
init_catalog_schema_volume()

# COMMAND ----------

from dbx.pixels import Catalog
from dbx.pixels.dicom import DicomMetaExtractor
from pyspark.sql.functions import *

catalog = Catalog(spark, table=table, volume=volume)
catalog_df = catalog.catalog(path=path, extractZip=True, streaming=True, maxUnzippedRecordsPerFile=1024)

meta_df = DicomMetaExtractor(catalog, deep=False).transform(catalog_df)
catalog.save(meta_df, mode="append")
