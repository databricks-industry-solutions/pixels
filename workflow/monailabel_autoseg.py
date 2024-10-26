# Databricks notebook source
dbutils.widgets.text("table", "main.pixels_solacc.object_catalog")
dbutils.widgets.text("volume", "main.pixels_solacc.pixels_volume")

# COMMAND ----------


import requests
import json
import pyspark.sql.functions as fn
from pyspark.sql.types import StructType, StructField, StringType

table = dbutils.widgets.get("table")
volume = "/Volumes/" + dbutils.widgets.get("volume").replace(".","/")

schema = StructType([
    StructField("result", StringType(), True),
    StructField("error", StringType(), True)
])
@fn.udf(returnType=schema)
def segmentation_udf(image_id):
    from databricks.sdk import WorkspaceClient
    from databricks.sdk.service.serving import DataframeSplitInput
    import pandas as pd
    import os

    w = WorkspaceClient(token=os.environ["DATABRICKS_TOKEN"], host="e2-demo-west.cloud.databricks.com")

    df = DataframeSplitInput.from_dict({"columns": ["image_id"], "data": [image_id]})
    
    try:
        response = w.serving_endpoints.query(
            name="db_monai_label_endpoint",
            dataframe_split=df
        )
        return {"result": response.predictions[0]['0'], "error": None }
    except Exception as e:
        return {"result": None, "error": str(e) }

(spark.readStream.table(table)
    .where("meta:['00080060'].Value[0] = 'CT'")
    .selectExpr("meta:['0020000E'].Value[0] as image_id")
    .distinct()
    .withColumn("segmentation_result", segmentation_udf(fn.col("image_id")))
    .selectExpr("image_id", "segmentation_result.*")
    .writeStream
    .option("checkpointLocation", f"{volume}/checkpoints/monailabel_autoseg_call/")
    .trigger(availableNow=True)
    .outputMode("append")
    .toTable(table+"_autoseg_call_results")
    .awaitTermination()
)
