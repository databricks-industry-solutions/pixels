# Databricks notebook source
# MAGIC %run ../config/setup

# COMMAND ----------

path,table,volume,write_mode = init_widgets()

path = dbutils.widgets.get("path_segms")
volume_path = "/Volumes/" + dbutils.widgets.get("volume").replace(".","/")

# COMMAND ----------

from dbx.pixels import Catalog
from dbx.pixels.dicom import DicomMetaExtractor

catalog = Catalog(spark, table=table, volume=volume)
catalog_df = catalog.catalog(path=path, streaming=True, streamCheckpointBasePath=f"{catalog._volume_path}/checkpoints/monai_label_segm/")

catalog_df = spark.readStream.table(table+"_autoseg_result").selectExpr("concat('dbfs:', nullif(result, '')) as path").where('path is not null')
catalog_df = Catalog._with_path_meta(catalog_df)

meta_df = DicomMetaExtractor(catalog).transform(catalog_df)

catalog.save(meta_df, mode="append")
