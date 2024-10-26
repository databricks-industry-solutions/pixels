# Databricks notebook source
# MAGIC %run ../config/setup

# COMMAND ----------

path,table,volume,write_mode = init_widgets()
path = dbutils.widgets.get("path_segms")

# COMMAND ----------

from dbx.pixels import Catalog
from dbx.pixels.dicom import DicomMetaExtractor
from pyspark.sql.functions import *

catalog = Catalog(spark, table=table, volume=volume)
catalog_df = catalog.catalog(
  path=path, 
  streaming=True, 
  streamCheckpointBasePath="/Volumes/main/pixels_solacc/pixels_volume/checkpoints/monailabel_autosegm/"
)

thumbnail_struct = "STRUCT<origin: STRING, height: INT, width: INT, nChannels: INT, mode: INT, data: BINARY>"

meta_df = DicomMetaExtractor(catalog).transform(catalog_df).withColumn("thumbnail", lit(None).cast(thumbnail_struct))
catalog.save(meta_df, mode="append")
