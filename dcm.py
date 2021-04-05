# Databricks notebook source
# MAGIC %conda install -c conda-forge gdcm -y

# COMMAND ----------

# MAGIC %pip install -r requirements.txt

# COMMAND ----------

from databricks.pixels import Catalog
df = Catalog.catalog(spark, "dbfs:/FileStore/shared_uploads/douglas.moore@databricks.com/benigns/")
display(df)

# COMMAND ----------

from databricks.pixels import DicomFrames
dcm_df = DicomFrames(df).withMeta()
display(dcm_df)

# COMMAND ----------



# COMMAND ----------

plots = DicomFrames(dcm_df.repartition(64)).plot()

# COMMAND ----------

# MAGIC %fs ls dbfs:/FileStore/plots/pixels/

# COMMAND ----------

plots._files

# COMMAND ----------

plots._repr_html_()

# COMMAND ----------

from databricks.pixels import PlotResult

# COMMAND ----------

help(PlotResult)

# COMMAND ----------


