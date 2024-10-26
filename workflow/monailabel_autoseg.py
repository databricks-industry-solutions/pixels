# Databricks notebook source
# MAGIC %pip install mlflow==2.12.1 databricks-sdk==0.28.0 --quiet
# MAGIC dbutils.library.restartPython()

# COMMAND ----------

dbutils.widgets.text("table", "main.pixels_solacc.object_catalog")
dbutils.widgets.text("volume", "main.pixels_solacc.pixels_volume")
dbutils.widgets.text("endpoint", "pixels_monailabel")

# COMMAND ----------

import os
import requests, json, math, time
from mlflow.utils.databricks_utils import get_databricks_host_creds, get_workspace_url
from mlflow.deployments import get_deploy_client

max_retries = 3
request_timeout_sec = 300

table = dbutils.widgets.get("table")
volume = "/Volumes/" + dbutils.widgets.get("volume").replace(".","/")
endpoint_name = dbutils.widgets.get("endpoint")

host = get_databricks_host_creds("databricks").host

class MONAILabelClient:
    def __init__(self):
        os.environ["MLFLOW_HTTP_REQUEST_MAX_RETRIES"] = str(max_retries)
        os.environ["MLFLOW_HTTP_REQUEST_TIMEOUT"] = str(request_timeout_sec)
        os.environ["MLFLOW_DEPLOYMENT_PREDICT_TIMEOUT"] = str(request_timeout_sec)

        self.client = get_deploy_client("databricks")
        self.endpoint = endpoint_name 
    
    def predict(self, image_id, iteration=0, prev_error=None):
      if iteration > max_retries:
        return ("", str(prev_error))
      
      try:
        response =  self.client.predict(
                endpoint=self.endpoint,
                inputs={"dataframe_split": {"columns": ["image_id"], "data": [[image_id]]}}
            )
        return (response.predictions[0]['0'], "")
      except Exception as e:
        if "torch.OutOfMemoryError: CUDA out of memory" in str(e):
          return ("", str(e))
        return self.predict(image_id, iteration + 1, prev_error=str(e))

# COMMAND ----------

import time
import pandas as pd
from pyspark.sql.functions import pandas_udf, lit
from typing import Iterator

@pandas_udf("result string, error string")
def autosegm_monai_udf(iterator: Iterator[pd.Series]) -> Iterator[pd.DataFrame]:
    client = MONAILabelClient()

    for s in iterator:
        results, errors = [], []
        for image_id in s:
            result, error = client.predict(image_id)
            results.append(result)
            errors.append(error)

        yield pd.DataFrame({"result": results, "error": errors})

# COMMAND ----------

import requests
import json
import pyspark.sql.functions as fn
from pyspark.sql.types import StructType, StructField, StringType

(spark.readStream.table(table)
    .where("meta:['00080060'].Value[0] = 'CT'")
    .selectExpr("meta:['0020000E'].Value[0] as image_id")
    .distinct()
    .withColumn("segmentation_result", autosegm_monai_udf(fn.col("image_id")))
    .selectExpr("image_id", "segmentation_result.*")
    .writeStream
    .option("checkpointLocation", f"{volume}/checkpoints/monailabel_autoseg_call/{table}")
    .trigger(availableNow=True)
    .outputMode("append")
    .toTable(table+"_autoseg_call_results")
    .awaitTermination()
)
