# Databricks notebook source
# MAGIC %md 
# MAGIC You may find this solution accelerator at https://github.com/databricks-industry-solutions/pixels.

# COMMAND ----------

# MAGIC %md # DICOM browser
# MAGIC Provide a nice Dicom browsing experience from a notebook

# COMMAND ----------

# MAGIC %run ./config/setup

# COMMAND ----------

path,table,write_mode = init_widgets()

# COMMAND ----------

# DBTITLE 1,Retrieve DICOM image entries indexed by the catalog and generate browser images
from dbx.pixels import Catalog
from dbx.pixels.dicom import DicomPlot

dcm_df_filtered = Catalog(spark, table=table).load().filter('meta:img_max < 1000 and lower(extension) = "dcm"').limit(1000)
DicomPlot(dcm_df_filtered).display()

# COMMAND ----------

# MAGIC %md
# MAGIC Previous: <a href="$./01-dcm-demo">DICOM demo</a>
