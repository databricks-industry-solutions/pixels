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
# MAGIC
# MAGIC **NOTE**
# MAGIC
# MAGIC This notebook will use MONAILabel auto segmentation model on CT AXIAL images already available in the catalog

# COMMAND ----------

# MAGIC %pip install git+https://github.com/erinaldidb/MONAILabel_Pixels.git mlflow[databricks] -q
# MAGIC dbutils.library.restartPython()

# COMMAND ----------

dbutils.library.restartPython()

# COMMAND ----------

# MAGIC %run ../config/proxy_prep

# COMMAND ----------

sql_warehouse_id, table = init_widgets()
model_uc_name, serving_endpoint_name = init_model_serving_widgets()

# COMMAND ----------

# MAGIC %md
# MAGIC ## Setting Up the Environment for MONAILabel Inference
# MAGIC
# MAGIC At this step, it is important to provide the right table that contains at least one CT Axial image and the SQLWarehouseID to execute the SQL commands.
# MAGIC
# MAGIC DEST_DIR will be the parameter used by the monailabel server to save the DICOM-SEG generated file 

# COMMAND ----------

init_env()

os.environ["DEST_DIR"] = "/Volumes/main/pixels_solacc/pixels_volume/monai_serving/"

# COMMAND ----------

# MAGIC %md
# MAGIC ## Initialization and Model Testing
# MAGIC
# MAGIC **DBMONAILabelModel** class is an extension of **mlflow.pyfunc.PythonModel** that will initialize the MONAILabel app required for the inference.
# MAGIC
# MAGIC The **.predict** function will take as an input the **series_uid** of the CT Axial image that is needed to generate the dicom-segmentation file.

# COMMAND ----------

import dbmonailabelmodel
from dbmonailabelmodel import DBMONAILabelModel

model = DBMONAILabelModel()

model.load_context(context=None)

# COMMAND ----------

# MAGIC %md
# MAGIC ## Using the DBMONAILabelModel
# MAGIC
# MAGIC The next cell will provide examples on how to use the model with different input examples. Any of the elements in the **input_examples** list can be used as input.

# COMMAND ----------

from mlflow.models import infer_signature
from typing import Optional

input_examples = [
      { "input": { "action": "info" }},                   #retrieve informations about the monailabel server
      { "input": { "action": "activelearning/random" }},  #randomly return the next series_uid useful to label
      { "input": {                                        #train the model based on labelled series
        "train": {
          'name': 'train_01',
          'pretrained': True,
          'device': ['NVIDIA A10G'],
          'max_epochs': 50,
          'early_stop_patience': -1,
          'val_split': 0.2,
          'train_batch_size': 1,
          'val_batch_size': 1,
          'multi_gpu': True,
          'gpus': 'all',
          'dataset': 'SmartCacheDataset',
          'dataloader': 'ThreadDataLoader',
          'tracking': 'mlflow',
          'tracking_uri': '',
          'tracking_experiment_name': '',
          'model': 'segmentation'
          }
       }
      },
      { "input": {                                        #train the model based on labelled series with mandatory fields
        "train": {
          'name': 'train_01',
          'pretrained': True,
          'max_epochs': 50,
          'val_split': 0.2,
          'train_batch_size': 1,
          'val_batch_size': 1,
          'gpus': 'all',
          'model': 'segmentation'
          }
       }
      },                      
      { "input": {                                        #trigger the inference on a single DICOM series given the series uid, used in OHIF Viewer
        "infer": {
          'largest_cc': False,
          'device': ['NVIDIA A10G'],
          'result_extension': '.nrrd',
          'result_dtype': 'uint16',
          'result_compress': False,
          'restore_label_idx': False,
          'model': 'segmentation',
          'image': '1.2.156.14702.1.1000.16.1.2020031111365289000020001'
          }
       }
      },
      { "input": {                                        #trigger the inference on a single DICOM series given the series uid, used in OHIF Viewer with mandatory fields
        "infer": {
          'model': 'segmentation',
          'image': '1.2.156.14702.1.1000.16.1.2020031111365289000020001'
          }
       }
      },
      { "input": {                                        #Return the file from the inference, used in OHIF Viewer
        "get_file": "/tmp/rnd"
       }
      },
      { "series_uid":                                     #trigger the inference on a sigle DICOM series given the series uids, used in Transformer
          "1.2.156.14702.1.1000.16.1.2020031111365293700020003"
      }
]

signature = infer_signature(input_examples, model_output="")
signature.inputs.to_json()

# COMMAND ----------

# MAGIC %md
# MAGIC ## Testing the DBMONAILabelModel
# MAGIC
# MAGIC Let's try in the next cell our model with a sample input.

# COMMAND ----------

import pandas as pd

df = pd.DataFrame([input_examples[0]])
model.predict(None, df)

# COMMAND ----------

# MAGIC %md
# MAGIC ## Saving the Model with MLflow
# MAGIC
# MAGIC In this cell, the code performs the following key steps:
# MAGIC
# MAGIC - **Starting MLflow Run**: An MLflow run is initiated using `mlflow.start_run()`.
# MAGIC - **Logging the Model**: The model is logged with `mlflow.pyfunc.log_model()`
# MAGIC - **Retrieving Run ID**: The run ID is stored in the variable `run_id`.
# MAGIC
# MAGIC **NOTE:** It will be used a custom version of the MONAILabel server that includes databricks connectivity

# COMMAND ----------

import mlflow

# Save the function as a model
with mlflow.start_run():
    mlflow.pyfunc.log_model(
        "DBMONAILabelModel",
        python_model=DBMONAILabelModel(),
        signature=signature,
        pip_requirements=["git+https://github.com/erinaldidb/MONAILabel_Pixels.git"],
        code_paths=["./lib", "./dblabelapp.py" ,"./dbmonailabelmodel.py"]
    )
    run_id = mlflow.active_run().info.run_id

# COMMAND ----------

model_uri = "runs:/{}/DBMONAILabelModel".format(run_id)
latest_model = mlflow.register_model(model_uri, model_uc_name)

# COMMAND ----------

# MAGIC %md
# MAGIC ## Creating a personal token and assign it to a secret
# MAGIC
# MAGIC The next cell demonstrates how to create a personal access token (PAT) and store it securely in Databricks secrets. This token will be used for authentication when deploying the model to a serving endpoint.

# COMMAND ----------

from databricks.sdk import WorkspaceClient

w = WorkspaceClient()

token = w.tokens.create(comment=f'pixels_serving_endpoint_token')

w.secrets.create_scope(scope="pixels-scope")
w.secrets.put_secret(scope="pixels-scope", key="pixels_token", string_value=token.token_value)

# COMMAND ----------

# MAGIC %md
# MAGIC # Model Deployment with MLflow on Databricks
# MAGIC
# MAGIC 1. Imports the `get_deploy_client` function from `mlflow.deployments`.
# MAGIC 2. Initializes the deployment client for Databricks.
# MAGIC 3. Sets the model version to the latest deployed in the previous cell.
# MAGIC 4. Create a PAT token to be placed in the secret used for the serving endpoint. It can be created also from a Service Pricipal.
# MAGIC 5. Create secret token for authentication setting the PAT token created before, more info here on how to create one. [Databricks Secrets](https://docs.databricks.com/en/security/secrets/index.html).
# MAGIC 6. Creates an endpoint named "pixels-monai" with the specified configuration, including environment variables and model details.
# MAGIC
# MAGIC **NOTE**: Do not forget to create the token and to put it in a secret! In the next cell there is an example on how to let the serving endpoint automatically retrieve it at runtime

# COMMAND ----------

from mlflow.deployments import get_deploy_client

client = get_deploy_client("databricks")

model_version = latest_model.version

token_secret = "{{secrets/pixels-scope/pixels_token}}"

endpoint = client.create_endpoint(
    name=serving_endpoint_name,
    config={
        "served_entities": [
            {
                'name': 'pixels_monailabel-1',
                'entity_name': model_uc_name,
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

print("SERVING ENDPOINT CREATED:", serving_endpoint_name)


# COMMAND ----------

# MAGIC %md
# MAGIC ## Waiting for Endpoint Readiness and Usage Examples
# MAGIC
# MAGIC The following cell will wait for the endpoint to be ready, which usually takes around 30 minutes. It also provides some examples of how to use the serving endpoint with the current model. You can use directly the input_example used for the signature

# COMMAND ----------

import time
from mlflow.deployments import get_deploy_client

client = get_deploy_client("databricks")

while client.get_endpoint(serving_endpoint_name).state.ready != 'READY':
  print("ENDPOINT NOT READY YET")
  time.sleep(60)

client.predict(
    endpoint=serving_endpoint_name,
    inputs={"inputs": {"input": {"action":"info"}}},
)

client.predict(
    endpoint=serving_endpoint_name,
    inputs={"inputs": {"input": {"action":"activelearning/random"}}},
)

client.predict(
    endpoint=serving_endpoint_name,
    inputs={"inputs": input_examples[3]},
)

response = client.predict(
    endpoint=serving_endpoint_name,
    inputs={"dataframe_split": {"columns": ["series_uid"], "data": [["1.2.156.14702.1.1000.16.1.2020031111365293700020003"]]}},
)
