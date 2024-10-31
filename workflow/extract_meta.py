# Databricks notebook source
# MAGIC %run ../config/setup

# COMMAND ----------

path,table,volume,write_mode = init_widgets()

# COMMAND ----------

from dbx.pixels import Catalog
from dbx.pixels.dicom import DicomMetaExtractor
from pyspark.sql.functions import *

catalog = Catalog(spark, table=table, volume=volume)
catalog_df = catalog.catalog(path=path, extractZip=True, streaming=True)

meta_df = DicomMetaExtractor(catalog).transform(catalog_df)
catalog.save(meta_df, mode="append")
