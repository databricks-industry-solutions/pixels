# Databricks notebook source
# MAGIC %md # DICOM browser
# MAGIC Provide a nice Dicom browsing experience from a notebook

# COMMAND ----------

# MAGIC %run ./00-setup

# COMMAND ----------

dbutils.widgets.text("table", table, label="2.0 Catalog Schema Table to store object metadata into")

# COMMAND ----------

# DBTITLE 1,Retrieve DICOM image entries indexed by the catalog and generate browser images
from databricks.pixels import Catalog
from databricks.pixels.dicom import DicomPlot

dcm_df_filtered = Catalog(spark, table=table).load().filter('meta:img_max < 1000 and extension = "dcm"').limit(1000)
DicomPlot(dcm_df_filtered).display()

# COMMAND ----------

# MAGIC %md
# MAGIC Previous: <a href="$./01-dcm-demo">DICOM demo</a>

# COMMAND ----------


