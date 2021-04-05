# Databricks notebook source
# %conda install -c conda-forge gdcm -y

# COMMAND ----------

# MAGIC %pip install -r requirements.txt

# COMMAND ----------

# MAGIC %pip freeze

# COMMAND ----------

# MAGIC %pip install pydicom

# COMMAND ----------

import pydicom

# COMMAND ----------

from databricks.pixels import Catalog

# COMMAND ----------

df = Catalog.catalog(spark, "dbfs:/FileStore/shared_uploads/douglas.moore@databricks.com/benigns/")
display(df)

# COMMAND ----------

from databricks.pixels import DicomFrames
dcm_df = DicomFrames(df).withMeta()
display(dcm_df)

# COMMAND ----------

plots = DicomFrames(dcm_df.repartition(64)).plot()

# COMMAND ----------

plots._files

# COMMAND ----------

from databricks.pixels import PlotResult
PlotResult(plots._files)

# COMMAND ----------


