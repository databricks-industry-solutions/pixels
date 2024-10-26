# Databricks notebook source
# MAGIC %pip install ../monailabel-0.8.4rc2+10.g82c2442.dirty-py3-none-any.whl

# COMMAND ----------

dbutils.library.restartPython()

# COMMAND ----------

import os
from dbruntime.databricks_repl_context import get_context
from databricks.sdk import WorkspaceClient

w = WorkspaceClient()

dbutils.widgets.text("table", "main.pixels_solacc.object_catalog", label="1.0 Catalog Schema Table to store object metadata into")
dbutils.widgets.text("sqlWarehouseID", "", label="2.0 SQL Warehouse")

sql_warehouse_id = dbutils.widgets.get("sqlWarehouseID")
table = dbutils.widgets.get("table")

if not spark.catalog.tableExists(table):
    raise Exception("The configured table does not exist!")

if sql_warehouse_id == "":
    raise Exception("SQL Warehouse ID is mandatory!")
else:
    wh = w.warehouses.get(id=sql_warehouse_id)
    print(f"Using '{wh.as_dict()['name']}' as SQL Warehouse")
      
os.environ["DATABRICKS_TOKEN"] = get_context().apiToken
os.environ["DATABRICKS_WAREHOUSE_ID"] = sql_warehouse_id
os.environ["DATABRICKS_HOST"] = f"https://{get_context().browserHostName}"
os.environ["DATABRICKS_PIXELS_TABLE"] = table
os.environ["DEST_DIR"] = "/Volumes/main/pixels_solacc/pixels_volume/"

# COMMAND ----------

# MAGIC %md
# MAGIC ### Using MLFlow published model to generate segmentation of selected CT
# MAGIC The model is a custom pyfunc model that utilizes the MONAILabel app for medical image segmentation. The segmentation results will be saved in the directory specified by the `DEST_DIR` environment variable, and the file paths of the generated segmentations will be returned by the model.
# MAGIC
# MAGIC **Note:** The images must already been cataloged using the pixels solution accelerator.

# COMMAND ----------

import mlflow
import pandas as pd

# Load the model from the tracking server and perform inference
model = mlflow.pyfunc.load_model(f"runs:/6a04838b378c486b9e839b74bd51cd25/DBMONAILabelModel")

data = {'image_id': ["1.2.156.14702.1.1000.16.1.2020031111365289000020001"]}
df = pd.DataFrame(data)

display(model.predict(df))

# COMMAND ----------

# MAGIC %md
# MAGIC ### Generating Segmentations of CT scans using Databricks Serving Endpoint
# MAGIC In this cell, we define a function to score the model using a Databricks serving endpoint. The function `score_model` sends a POST request to the endpoint with the dataset in JSON format. The dataset is retrieved from a Spark SQL query, which selects distinct image IDs from the object catalog where the modality is 'CT'. The response from the endpoint is returned as a JSON object.
# MAGIC
# MAGIC **Note:** Ensure that the `DATABRICKS_TOKEN` environment variable is set with the appropriate authentication token.

# COMMAND ----------

import os
import requests
import numpy as np
import pandas as pd
import json

def create_tf_serving_json(data):
    return {'inputs': {name: data[name] for name in data.keys()} if isinstance(data, dict) else data[0][0]}

def generate_segmentation(image_id):
    url = 'https://e2-demo-west.cloud.databricks.com/serving-endpoints/db_monai_label_endpoint/invocations'
    headers = {'Authorization': f'Bearer {os.environ.get("DATABRICKS_TOKEN")}', 'Content-Type': 'application/json'}
    ds_dict = """{"dataframe_split": {
        "index": [0], 
        "columns": ["image_id"], 
        "data": [["{IMAGE_ID}"]]}}"""

    response = requests.request(method='POST', headers=headers, url=url, data=ds_dict.replace("{IMAGE_ID}",image_id))
    print(response)
    return response.json()
  
dataset = spark.sql("""
  SELECT distinct(meta:['0020000E'].Value[0]) as image_id
    FROM main.pixels_solacc.object_catalog
    WHERE meta:['00080060'].Value[0] = 'CT'
""").toPandas()

from concurrent.futures import ThreadPoolExecutor
import pandas as pd

with ThreadPoolExecutor() as executor:
    results = list(executor.map(generate_segmentation, [row["image_id"] for _, row in dataset.iterrows()]))

display(spark.createDataFrame(results))
