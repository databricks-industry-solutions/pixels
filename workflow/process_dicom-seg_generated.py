# Databricks notebook source
# MAGIC %run ../config/setup

# COMMAND ----------

path,table,volume,write_mode = init_widgets()

# COMMAND ----------

from dbx.pixels import Catalog
from dbx.pixels.dicom import DicomMetaExtractor
from pyspark.sql.functions import expr

catalog = Catalog(spark, table=table, volume=volume)
catalog_df = catalog.catalog(path=path, streaming=True, streamCheckpointBasePath=f"{catalog._volume_path}/checkpoints/monai_label_segm/")

catalog_df = spark.readStream.table(table+"_autoseg_result").selectExpr("concat('dbfs:', nullif(result, '')) as path").where('path is not null')
catalog_df = Catalog._with_path_meta(catalog_df)

meta_df = DicomMetaExtractor(catalog, deep=False).transform(catalog_df)
meta_df = meta_df\
  .withColumn("modificationTime", expr("to_timestamp(unix_timestamp(concat(meta:['00080023'].Value[0], meta:['00080033'].Value[0]), 'yyyyMMddHHmmss'))"))\
  .withColumn("length", expr("meta:['file_size']").cast("bigint"))


catalog.save(meta_df, mode="append")
