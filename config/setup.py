# Databricks notebook source
### Dicom Setup
# Python dependencies
# reload for code development
# capture input parameters

# COMMAND ----------

# MAGIC %pip install --quiet pydicom==2.3.0 s3fs==2022.10.0 python-gdcm==3.0.19 python-magic==0.4.27 git+https://github.com/databricks-industry-solutions/pixels.git 

# COMMAND ----------

# MAGIC %reload_ext autoreload
# MAGIC %autoreload 2

# COMMAND ----------

# DBTITLE 1,Collect Input Parameters
def init_widgets():
  dbutils.widgets.text("path", "s3://hls-eng-data-public/dicom/ddsm/", label="1.0 Path to directory tree containing files. /dbfs or s3:// supported")
  dbutils.widgets.text("table", "main.pixels_solacc.object_catalog", label="2.0 Catalog Schema Table to store object metadata into")
  dbutils.widgets.dropdown("mode",defaultValue="append",choices=["overwrite","append"], label="3.0 Update mode on object metadata table")

  path = dbutils.widgets.get("path")
  table = dbutils.widgets.get("table")
  write_mode = dbutils.widgets.get("mode")

  spark.conf.set('c.table',table)
  #print(F"{path}, {table}, {write_mode}")
  return path,table,write_mode

path,table,write_mode = init_widgets()

# COMMAND ----------

# initialize the schema if it does not exist
schema = f"""{table.split(".")[0]}.{table.split(".")[1]}"""
spark.sql(f"create database if not exists {schema}")
;

# COMMAND ----------

'Done'

# COMMAND ----------


