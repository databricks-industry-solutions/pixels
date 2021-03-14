# Databricks notebook source
from databricks.pixel import ObjectFrames, Catalog

# COMMAND ----------

help(Catalog)

# COMMAND ----------

path = 'dbfs:/databricks-datasets/med-images/camelyon16/'
df = Catalog.catalog(spark, path)


# COMMAND ----------

display(df)
