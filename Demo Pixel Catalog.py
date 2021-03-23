# Databricks notebook source
# MAGIC %md # Demo Pixels Catalog

# COMMAND ----------

# MAGIC %pip install -vv -e git+https://github.com/dmoore247/pixels#egg=databricks.pixel

# COMMAND ----------

# DBTITLE 1,1. List Files
from databricks.pixel import Catalog
display(
  Catalog.catalog(spark, 'dbfs:/databricks-datasets/med-images/camelyon16/', pattern='normal_???.tif')
)

# COMMAND ----------

from databricks.pixel import Catalog
df = Catalog.catalog(spark, 'dbfs:/databricks-datasets/med-images/camelyon16/', pattern='normal_???.tif')
display(df)

# COMMAND ----------


