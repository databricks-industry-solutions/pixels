# Databricks notebook source
from ObjectFrames import ObjectFrames as of

# COMMAND ----------

# MAGIC %fs ls dbfs:/databricks-datasets/med-images/camelyon16/

# COMMAND ----------

image_path = 'dbfs:/databricks-datasets/med-images/camelyon16/'
o = of.ObjectFrames(image_path)
display(o.toDF())

# COMMAND ----------

display(o.__repr__)

# COMMAND ----------

help(display)

# COMMAND ----------

display(o)

# COMMAND ----------


