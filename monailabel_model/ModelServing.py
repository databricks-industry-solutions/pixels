# Databricks notebook source
# MAGIC %md
# MAGIC # MONAILabel Server Initialization
# MAGIC
# MAGIC This notebook is designed to **initialize the Databricks customized version of the MONAILabel server**. It wraps the server in an **MLflow Python custom model** and registers it for use in a **serving endpoint**. The process involves:
# MAGIC
# MAGIC - **Installing the necessary MONAILabel package**
# MAGIC - **Configuring the environment**
# MAGIC - **Setting up the server** to be integrated with Databricks' MLflow for model management and deployment
# MAGIC
# MAGIC This setup allows for **efficient model serving and endpoint management** within the Databricks ecosystem.

# COMMAND ----------

# MAGIC %pip install git+https://github.com/erinaldidb/MONAILabel_Pixels.git -q
# MAGIC dbutils.library.restartPython()

# COMMAND ----------

# MAGIC %run ../config/proxy_prep

# COMMAND ----------

sql_warehouse_id, table = init_widgets()
init_env()

os.environ["DEST_DIR"] = "/Volumes/ema_rina/pixels_solacc/pixels_volume/monai_serving/"

# COMMAND ----------


import dbmonailabelmodel
from dbmonailabelmodel import DBMONAILabelModel

model = DBMONAILabelModel()

#mlflow.pyfunc.save_model("./db_monai_model/",
#                         python_model=my_model,
#                         artifacts={"db_monailabel_class_file": "./dblabelapp.py"},
#                         pip_requirements=["./monailabel-0.8.4rc2+10.g82c2442.dirty-py3-none-any.whl"],
#                         code_paths=["./bin","./lib","./model", "./monailabel-0.8.4rc2+10.g82c2442.dirty-py3-none-any.whl"]
#                         )

# COMMAND ----------

# DBTITLE 1,TEST RESULTS
import pandas as pd
import numpy as np
from pydicom import dcmread

# find a series_uid from pixels` table to test segmentation
# autosegmentation is compatible only for axial images
series_uid = spark.read.table(table).selectExpr(f"meta:['0020000E'].Value[0] as series_uid") \
  .filter("contains(meta:['00080008'], 'AXIAL')") \
  .limit(1).collect()[0][0]

data = {'series_uid': [series_uid]}
data = {'series_uid': ["1.2.826.0.1.3680043.8.498.46165708412055321465926503658507656958"]}
df = pd.DataFrame(data)

model.predict(None, df)

with dcmread(
  open(f"{os.environ['DEST_DIR']}{series_uid}.dcm", mode="rb"), defer_size=1000, stop_before_pixels=True) as ds:
  print(ds.StudyInstanceUID)
  print(ds.SeriesInstanceUID)
  print(ds.SOPInstanceUID)
  print(ds.SeriesDescription)

# COMMAND ----------

import pandas as pd
import mlflow

series_uid = spark.read.table(table).selectExpr(f"meta:['0020000E'].Value[0] as series_uid") \
  .filter("contains(meta:['00080008'], 'AXIAL')") \
  .limit(1).collect()[0][0]

data = {'series_uid': ["1.2.826.0.1.3680043.8.498.46165708412055321465926503658507656958"]}
df = pd.DataFrame(data)

# Save the function as a model
with mlflow.start_run():
    mlflow.pyfunc.log_model(
        "DBMONAILabelModel",
        python_model=model,
        input_example=df,
        pip_requirements=["git+https://github.com/erinaldidb/MONAILabel_Pixels.git"],
        code_paths=["./lib", "./dblabelapp.py" ,"./dbmonailabelmodel.py"],
        artifacts={'segmentation-model': "./model/pretrained_segmentation.pt"}
    )
    run_id = mlflow.active_run().info.run_id

# COMMAND ----------

# MAGIC %md
# MAGIC # Model Deployment with MLflow on Databricks
# MAGIC
# MAGIC 1. Imports the `get_deploy_client` function from `mlflow.deployments`.
# MAGIC 2. Initializes the deployment client for Databricks.
# MAGIC 3. Sets the model version to "1".
# MAGIC 4. Retrieves a secret token for authentication.
# MAGIC 5. Creates an endpoint named "pixels-monai" with the specified configuration, including environment variables and model details.

# COMMAND ----------

from mlflow.deployments import get_deploy_client

client = get_deploy_client("databricks")

model_version = "1"
token_secret = "{{secrets/pixels-scope/pixels_token}}"

endpoint = client.create_endpoint(
    name="pixels-monai",
    config={
        "served_entities": [
            {
                'name': 'pixels_monailabel-1',
                'entity_name': 'pixels_monailabel',
                "entity_version": model_version,
                "workload_size": "Small",
                "workload_type": "GPU_MEDIUM",
                "scale_to_zero_enabled": True,
                'environment_vars': {
                  'DATABRICKS_TOKEN': token_secret,
                  'DATABRICKS_HOST': os.environ["DATABRICKS_HOST"],
                  'DATABRICKS_PIXELS_TABLE': os.environ["DATABRICKS_PIXELS_TABLE"],
                  'DATABRICKS_WAREHOUSE_ID': os.environ["DATABRICKS_WAREHOUSE_ID"],
                  'DEST_DIR': os.environ["DEST_DIR"]
                },
            }
        ]
    }
)

