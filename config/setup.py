# Databricks notebook source
### Dicom Setup
# Python dependencies
# reload for code development
# capture input parameters

# COMMAND ----------

import os
import dbx

repo_main_folder = os.path.abspath(os.path.join(os.path.dirname(dbx.__file__), os.pardir))
print("Installing Pixels Solution Accelerator dependencies from ", repo_main_folder)

%pip install --quiet -r {repo_main_folder}/requirements.txt
%pip install --quiet --upgrade databricks-sdk==0.36.0

# COMMAND ----------

# MAGIC %reload_ext autoreload
# MAGIC %autoreload 2

# COMMAND ----------

# DBTITLE 1,Collect Input Parameters
def init_widgets():
  dbutils.widgets.text("path", "s3://hls-eng-data-public/dicom/landing_zone/*.zip", label="1.0 Path to directory tree containing files. /dbfs , /Volumes/ or s3:// supported")
  dbutils.widgets.text("table", "main.pixels_solacc.object_catalog", label="2.0 Catalog Schema Table to store object metadata into")
  dbutils.widgets.text("volume", "main.pixels_solacc.pixels_volume", label="3.0 Catalog Schema Volume to store checkpoints and unzipped files")
  dbutils.widgets.dropdown("mode",defaultValue="append",choices=["overwrite","append"], label="4.0 Update mode on object metadata table")

  path = dbutils.widgets.get("path")
  table = dbutils.widgets.get("table")
  volume = dbutils.widgets.get("volume")
  write_mode = dbutils.widgets.get("mode")

  #spark.conf.set('c.table',table)
  #print(F"{path}, {table}, {write_mode}")
  return path,table,volume,write_mode

path,table,volume,write_mode = init_widgets()

# COMMAND ----------

def init_catalog_schema_volume():
    # initialize the schema if it does not exist
    catalog = f"""{table.split(".")[0]}"""
    schema = f"""{table.split(".")[0]}.{table.split(".")[1]}"""

    if (spark.sql(f"show catalogs like '{catalog}'").count() == 0):
        spark.sql(f"create catalog if not exists {catalog}")
    
    if (spark.sql(f"show databases in {catalog} like '{schema}'").count() == 0):
        spark.sql(f"create database if not exists {schema}")

    if (spark.sql(f"show volumes in {schema} like '{volume}'").count() == 0):
        spark.sql(f"create volume if not exists {volume}")

# COMMAND ----------

'Done'
