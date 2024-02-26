# Databricks notebook source
# MAGIC %fs ls /Volumes/douglas_moore/pixels_solacc/raw_dicoms

# COMMAND ----------

# Setting up your Volume to read dicom files

# COMMAND ----------

# MAGIC %fs cp -r s3://hls-eng-data-public/dicom/ddsm/ /Volumes/douglas_moore/pixels_solacc/raw_dicoms

# COMMAND ----------


