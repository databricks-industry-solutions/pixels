# Databricks notebook source
# MAGIC %fs ls dbfs:/FileStore/shared_uploads/douglas.moore@databricks.com/benigns

# COMMAND ----------

# MAGIC %fs rm -r dbfs:/FileStore/shared_uploads/douglas.moore@databricks.com/benigns

# COMMAND ----------

# MAGIC %sh 
# MAGIC wget ftp://dicom.offis.uni-oldenburg.de/pub/dicom/images/ddsm/benigns_01.zip
# MAGIC unzip benigns_01.zip
# MAGIC cp -r ./benigns /dbfs/FileStore/shared_uploads/douglas.moore@databricks.com/

# COMMAND ----------


