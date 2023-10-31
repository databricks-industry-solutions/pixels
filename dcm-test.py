# Databricks notebook source
# MAGIC %md ## Setup

# COMMAND ----------

# MAGIC %pip install pydicom s3fs python-gdcm==3.0.19

# COMMAND ----------

# MAGIC %md ### Reload

# COMMAND ----------

# MAGIC %reload_ext autoreload
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

# MAGIC %md # Test Imports

# COMMAND ----------

from databricks.labs.pixels import Catalog

# COMMAND ----------

from databricks.labs.pixels.dicom import DicomThumbnailExtractor

# COMMAND ----------

from databricks.labs.pixels.dicom  import DicomFrames
from databricks.labs.pixels.dicom import DicomMetaExtractor, DicomThumbnailExtractor, DicomPillowThumbnailExtractor, DicomPatcher

# COMMAND ----------

import s3fs
import pydicom


# COMMAND ----------

# MAGIC %fs ls dbfs:/FileStore/BCI

# COMMAND ----------

df = spark.read.format('image').load("dbfs:/FileStore/BCI").limit(10)

# COMMAND ----------

display(df.selectExpr('image.*','len(image.data)'))

# COMMAND ----------

# MAGIC %fs ls dbfs:/

# COMMAND ----------

# MAGIC %md ## Test Plotting

# COMMAND ----------

from databricks.labs.pixels import Catalog
from databricks.labs.pixels.dicom import DicomFrames
catalog = Catalog(spark, table=table)
dcm_df_filtered = catalog.load().filter('meta:img_max < 1000').limit(100)

plots = DicomFrames(dcm_df_filtered, withMeta=True, inputCol="local_path").plot()
len(plots)

# COMMAND ----------

plots

# COMMAND ----------

plots._files

# COMMAND ----------

from databricks.labs.pixels import dicom_plot_udf
from pyspark.sql.functions import col

plot_df = (dcm_df_filtered.withColumn(
                'plot',
                dicom_plot_udf(col('local_path')))
)
display(plot_df)

# COMMAND ----------

plots._get_rows()

# COMMAND ----------

# MAGIC %md # Test Metadata extraction

# COMMAND ----------

from databricks.labs.pixels.dicom import DicomFrames, DicomMetaExtractor # The transformer
from databricks.labs.pixels import Catalog
catalog = Catalog(spark, path=path, table=table)

print(catalog.is_anon())
catalog_df = catalog.load()

# COMMAND ----------

meta = DicomMetaExtractor(catalog)
meta_df = meta.transform(catalog_df.filter('extension = "dcm"').repartition(1_000))
display(meta_df.select('meta'))

# COMMAND ----------

# catalog.save(meta_df)

# COMMAND ----------

# MAGIC %md # Test Thumbnail extraction - matplotlilb

# COMMAND ----------

# load metata from the catalog

from databricks.labs.pixels import Catalog
catalog = Catalog(spark, path=path, table=table)
dcm_df_filtered = catalog.load().filter('meta:img_max < 1000').repartition(1000).limit(10)
dcm_df_filtered.count()

# COMMAND ----------

from databricks.labs.pixels.dicom import DicomThumbnailExtractor # The transformer
thumbnail_df = DicomThumbnailExtractor().transform(dcm_df_filtered)
display(thumbnail_df)

# COMMAND ----------

from databricks.labs.pixels.dicom import DicomThumbnailExtractor # The transformer
help(DicomThumbnailExtractor)

# COMMAND ----------

# MAGIC %md # Test DicomPillowThumbnailExtractor

# COMMAND ----------

# load metata from the catalog

from databricks.labs.pixels import Catalog
catalog = Catalog(spark, path=path, table=table)
dcm_df_filtered = catalog.load().filter('meta:img_max < 1000').repartition(1000)#.limit(10)
dcm_df_filtered.count()

# COMMAND ----------

from databricks.labs.pixels.dicom import DicomPillowThumbnailExtractor # The transformer
help(DicomPillowThumbnailExtractor)

# COMMAND ----------

# to process a batch of 100 images instead 10000 to reduce memory pressure
spark.conf.set("spark.sql.execution.arrow.maxRecordsPerBatch", "100")
spark.conf.set("spark.sql.execution.arrow.enabled", "true")

from databricks.labs.pixels.dicom import DicomPillowThumbnailExtractor # The transformer
thumbnail_df = DicomPillowThumbnailExtractor().transform(dcm_df_filtered)
display(thumbnail_df)

# COMMAND ----------

# MAGIC %sql
# MAGIC with k(key) as (select explode(json_object_keys(meta)) from ${c.table})
# MAGIC select distinct * from k
# MAGIC order by 1 ASC

# COMMAND ----------

help(DicomPlot)

# COMMAND ----------

dcm_df_filtered.count()

# COMMAND ----------

# DBTITLE 1,Display DICOM browser
from databricks.labs.pixels import Catalog
from databricks.labs.pixels.dicom import DicomPlot

catalog = Catalog(spark, table=table)
dcm_df_filtered = catalog.load().filter('extension == "dcm"').limit(1000)
DicomPlot(dcm_df_filtered).display()

# COMMAND ----------


