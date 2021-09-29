# Databricks notebook source
# MAGIC %md ## DCM Setup
# MAGIC Need to install gdcm from conda. gdcm provides near universal conversion of pixel data from Dicom images

# COMMAND ----------

# MAGIC %fs ls dbfs:/databricks/init_scripts

# COMMAND ----------

dbutils.fs.put("dbfs:/databricks/init_scripts/gdcm-install.sh", 
"""%sh
#!/bin/bash
/databricks/python/bin/python -V
. /databricks/conda/etc/profile.d/conda.sh
#conda create --prefix /databricks/python
conda activate /databricks/python
conda install -c conda-forge gdcm -y
""",
overwrite = True)
dbutils.fs.ls("dbfs:/databricks/init_scripts/gdcm-install.sh")

# COMMAND ----------

dbutils.fs.head("dbfs:/databricks/init_scripts/gdcm-install.sh")

# COMMAND ----------

# MAGIC %sh cat /dbfs/databricks/init_scripts/gdcm-install.sh

# COMMAND ----------

# MAGIC %sql
# MAGIC create database objects_catalog location '/tmp/objects_catalog.db'

# COMMAND ----------

# MAGIC %sh bash /dbfs/databricks/init_scripts/gdcm-install.sh

# COMMAND ----------


