# Databricks notebook source
# MAGIC %run ../config/setup

# COMMAND ----------

# MAGIC %pip install mlflow==2.12.1 databricks-sdk==0.28.0 --quiet
# MAGIC dbutils.library.restartPython()

# COMMAND ----------

dbutils.widgets.text("table", "main.pixels_solacc.object_catalog")
dbutils.widgets.text("volume", "main.pixels_solacc.pixels_volume")
dbutils.widgets.text("serving-endpoint", "pixels-monai-uc")

# COMMAND ----------

table = dbutils.widgets.get("table")
volume = "/Volumes/" + dbutils.widgets.get("volume").replace(".","/")
endpoint_name = dbutils.widgets.get("serving-endpoint")

# COMMAND ----------

from dbx.pixels.modelserving.client import MONAILabelTransformer

df = spark.readStream.table(table)

df_monai = MONAILabelTransformer(endpoint_name=endpoint_name).transform(df)

df_monai.writeStream \
    .option("checkpointLocation", f"{volume}/checkpoints/monailabel_autoseg_result/{table}") \
    .trigger(availableNow=True) \
    .outputMode("append") \
    .toTable(table+"_autoseg_result") \
    .awaitTermination()
