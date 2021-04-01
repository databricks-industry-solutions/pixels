# Databricks notebook source
# MAGIC %md # Demo Pixels Catalog

# COMMAND ----------

# MAGIC %conda install -c conda-forge gdcm -y

# COMMAND ----------

# MAGIC %pip install -vv -e git+https://github.com/dmoore247/pixels#egg=databricks.pixels

# COMMAND ----------

# MAGIC %sh ls ./src/databricks-pixels

# COMMAND ----------

import os, sys
os.environ

# COMMAND ----------

# MAGIC %pip install pydicom pillow

# COMMAND ----------

# MAGIC %md ## List files

# COMMAND ----------

from databricks.pixels import Catalog
df = Catalog.catalog(spark, 'dbfs:/databricks-datasets/med-images/camelyon16/', pattern='normal_???.tif')
display(df)


# COMMAND ----------


