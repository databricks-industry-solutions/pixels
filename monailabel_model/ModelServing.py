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

# MAGIC %pip install -r bundles/requirements.txt
# MAGIC %pip install ./artifacts/monailabel-0.8.5-py3-none-any.whl --no-deps
# MAGIC %pip install monai==1.4.0 pytorch-ignite --no-deps
# MAGIC %pip install databricks-sdk==0.36 --upgrade

# COMMAND ----------

dbutils.library.restartPython()

# COMMAND ----------

# MAGIC %run ../config/proxy_prep

# COMMAND ----------

sql_warehouse_id, table, volume = init_widgets(show_volume=True)
model_uc_name, serving_endpoint_name = init_model_serving_widgets()

dbutils.widgets.text("use_service_principal", "False", label="5.0 Use Service Principal")
use_service_principal = dbutils.widgets.get("use_service_principal").lower() == "true"

volume_path = volume.replace(".","/")

model_name = "wholeBody_ct_segmentation"

# COMMAND ----------

# MAGIC %md
# MAGIC ## Setting Up the Environment for MONAILabel Inference
# MAGIC
# MAGIC At this step, it is important to provide the right table that contains at least one CT Axial image and the SQLWarehouseID to execute the SQL commands.
# MAGIC
# MAGIC DEST_DIR will be the parameter used by the monailabel server to save the DICOM-SEG generated file 

# COMMAND ----------

init_env()

os.environ["DEST_DIR"] = f"/Volumes/{volume_path}/monai_serving/{model_name}/"

# COMMAND ----------

# MAGIC %md
# MAGIC ## Initialization and Model Testing
# MAGIC
# MAGIC **DBMONAILabelModel** class is an extension of **mlflow.pyfunc.PythonModel** that will initialize the MONAILabel app required for the inference.
# MAGIC
# MAGIC The **.predict** function will take as an input the **series_uid** of the CT Axial image that is needed to generate the dicom-segmentation file.

# COMMAND ----------

from bundles.code.bundlesmodel import DBBundlesModel

os.environ["MONAI_BUNDLES"] = model_name

model = DBBundlesModel(volumes_compatible=True)

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
          'model': model_name
          }
       }
      },
      { 'input': {                                        #train the model based on labelled series with mandatory fields
        'train': {
          'name': 'train_01',
          'pretrained': True,
          'max_epochs': 50,
          'val_split': 0.2,
          'train_batch_size': 1,
          'val_batch_size': 1,
          'gpus': 'all',
          'model': model_name
          }
       }
      },                      
      { 'input': {                                        #trigger the inference on a single DICOM series given the series uid, used in OHIF Viewer
        'infer': {
          'largest_cc': False,
          'device': ['NVIDIA A10G'],
          'result_extension': '.nrrd',
          'result_dtype': 'uint16',
          'result_compress': False,
          'restore_label_idx': False,
          'model': model_name,
          'image': '1.2.156.14702.1.1000.16.1.2020031111365289000020001',
          'export_metrics': False,
          'export_overlays': False,
          'points': [[10,10,10],[20,20,20]], #list of x,y,z points
          'point_labels': [0,1],
          'pixels_table': "main.pixels_solacc.object_catalog"
          }
       }
      },
      { 'input': {                                        #trigger the inference on a single DICOM series given the series uid, used in OHIF Viewer with mandatory fields
        'infer': {
          'model': 'vista3d',
          'image': '1.2.156.14702.1.1000.16.1.2020031111365289000020001',
          'label_prompt': [1,26]
          }
       }
      },
      { 'input': {                                        #Return the file from the inference, used in OHIF Viewer
        'get_file': '/tmp/vista/bundles/vista3d/models/prediction/1.2.156.14702.1.1000.16.1.2020031111365289000020001/1.2.156.14702.1.1000.16.1.2020031111365289000020001_seg.nii.gz',
        'result_dtype': 'uint8'
       }
      },
      { 'series_uid': '1.2.156.14702.1.1000.16.1.2020031111365293700020003',
        'params' : {
          'label_prompt' : [1,26],
          'export_metrics': False,
          'export_overlays': False,
          'points': [[100,100,100],[200,200,200]],
          'point_labels': [0,1],
          'dest_dir': '/Volumes/main/pixels_solacc/pixels_volume/monai_serving/vista3d',
          'pixels_table': "main.pixels_solacc.object_catalog",
          'torch_device': 0
        }
      },
      { 'series_uid': '1.2.156.14702.1.1000.16.1.2020031111365293700020003',
       'params' : {},
      },
      { 'series_uid': '1.2.156.14702.1.1000.16.1.2020031111365293700020003'}
]

signature = infer_signature(input_examples, model_output="")
signature.inputs.to_json()

# COMMAND ----------

# MAGIC %md
# MAGIC ## Testing the DBMONAILabelModel
# MAGIC
# MAGIC Let's try in the next cell our model with a sample input.

# COMMAND ----------

from common.utils import download_dcmqi_tools

# Download the dcmqi tool binary used for the conversion of nifti files to DICOM SEG files
download_dcmqi_tools("./artifacts")

# COMMAND ----------

# === OPTIONAL | Requires GPU Enabled cluster ===

try:
  import torchvision
  import pandas as pd
  import json

  # Pick one of the series_uid available in the pixels' catalog table
  series_uid = "1.2.156.14702.1.1000.16.1.2020031111365289000020001"

  input = { "series_uid": series_uid, "params": {
    "export_metrics": False,
    "export_overlays": False,
    "dest_dir": f"/Volumes/{volume_path}/monai_serving/{model_name}",
    "pixels_table" : table
    }
  }

  df = pd.DataFrame([input])

  # This step will download the VISTA3D Model bundle scripts and model weights to the local disk
  # This step will automatically download in the ./bin folder the itkimage2segimage binary required for the conversion of nifti files to DICOM SEG files

  model.load_context(context=None)
  result = model.predict(None, df)
except ImportError as e:
  print(e,", skipping model test")

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
    mlflow.pyfunc.log_model (
        "DBBundlesModel",
        python_model=DBBundlesModel(),
        conda_env="./bundles/conda.yaml",
        signature=signature,
        code_paths=["./bundles", "./common", "./lib"],
        artifacts={
            "monailabel-0.8.5": "./artifacts/monailabel-0.8.5-py3-none-any.whl",
            "itkimage2segimage": "./artifacts/itkimage2segimage"
        }
    )
    run_id = mlflow.active_run().info.run_id
    print(run_id)

# COMMAND ----------

model_uri = "runs:/{}/DBBundlesModel".format(run_id)
latest_model = mlflow.register_model(model_uri, model_uc_name)

# COMMAND ----------

# Define scope and key names for the credentials

scope_name = "pixels_scope"
sp_name = "pixels_sp"

sp_id_key = "pixels_sp_id"
sp_app_id_key = "pixels_sp_app_id"
sp_secret_key = "pixels_sp_secret"
token_key = "pixels_token"

m2m_client = None

delete_all_sercrets = False

# COMMAND ----------

# MAGIC %md
# MAGIC # Create Service Principal and generate access token
# MAGIC ## Fallback on Personal Access Token

# COMMAND ----------

from dbx.pixels.m2m import DatabricksM2MAuth
from databricks.sdk import WorkspaceClient

if use_service_principal:
    try:
        m2m_client = DatabricksM2MAuth(
            principal_name=sp_name,
            account_api_token=os.environ["DATABRICKS_TOKEN"],

            secrets_scope_name=scope_name,
            secrets_client_id_key=sp_id_key,
            secrets_client_app_id_key=sp_app_id_key,
            secrets_client_secret_key=sp_secret_key,

            workspace_url=os.environ["DATABRICKS_HOST"]
        )
        m2m_client.grant_permissions(table, volume)
    except Exception as e:
        print(e)
else: 
    # Create Personal Access Token | Not needed if service principal is used ===
    w = WorkspaceClient()

    if scope_name not in [scope.name for scope in w.secrets.list_scopes()]:
        w.secrets.create_scope(scope=scope_name)

    token = w.tokens.create(comment=f'pixels_serving_endpoint_token')

    w.secrets.put_secret(scope=scope_name, key=token_key, string_value=token.token_value)

    print(f"PAT created and saved in {token_key} secret")


# COMMAND ----------

# Sample script to cleanup secrets | Max 5 secrets are allowed per Service Principal | Disable by default

if delete_all_sercrets:
    from dbx.pixels.m2m import DatabricksM2MAuth

    list_secrets = DatabricksM2MAuth.list_service_principal_secrets(
        workspace_url=os.environ["DATABRICKS_HOST"], 
        account_api_token=os.environ["DATABRICKS_TOKEN"], 
        client_id=dbutils.secrets.get(scope_name, sp_id_key)
    )['secrets']

    for secret in list_secrets:
        DatabricksM2MAuth.delete_service_principal_secret(
            workspace_url=os.environ["DATABRICKS_HOST"], 
            account_api_token=os.environ["DATABRICKS_TOKEN"], 
            client_id=dbutils.secrets.get(scope_name, sp_id_key), secret_id=secret['id'])

# COMMAND ----------

from mlflow.deployments import get_deploy_client

client = get_deploy_client("databricks")

model_version = latest_model.version

secret_template = "secrets/{scope}/{key}"

token = "{{" + secret_template.format(scope=scope_name, key=token_key) + "}}"
client_app_id = "{{" + secret_template.format(scope=scope_name, key=sp_app_id_key) + "}}"
client_secret = "{{" + secret_template.format(scope=scope_name, key=sp_secret_key) + "}}"

conf_vars = {
    'DATABRICKS_HOST': os.environ["DATABRICKS_HOST"],
    'DATABRICKS_PIXELS_TABLE': os.environ["DATABRICKS_PIXELS_TABLE"],
    'DATABRICKS_WAREHOUSE_ID': os.environ["DATABRICKS_WAREHOUSE_ID"],
    'DEST_DIR': os.environ["DEST_DIR"]
}

if not m2m_client:
    conf_vars['DATABRICKS_TOKEN'] = token
else:
    conf_vars['DATABRICKS_SCOPE'] = scope_name
    conf_vars['CLIENT_APP_ID'] = client_app_id
    conf_vars['CLIENT_SECRET'] = client_secret

endpoint = client.create_endpoint(
    name=serving_endpoint_name,
    config={
        "served_entities": [
            {
                'entity_name': model_uc_name,
                "entity_version": model_version,
                "workload_size": "Small",
                "workload_type": "GPU_MEDIUM",
                "scale_to_zero_enabled": True,
                'environment_vars': conf_vars,
            }
        ]
    }
)

print("SERVING ENDPOINT CREATED:", serving_endpoint_name)


# COMMAND ----------

# MAGIC %md
# MAGIC ## Test the connection and execute inference using Serving Endpoint with Vista3D model
# MAGIC
# MAGIC NOTE: Serving Endpoint creation will take ~ 30 minutes to complete

# COMMAND ----------

import time
from mlflow.deployments import get_deploy_client

client = get_deploy_client("databricks")

def wait_for_endpoint_ready(endpoint_name, client, timeout=2100, interval=10):
    start_time = time.time()
    while time.time() - start_time < timeout:
        endpoint_status = client.get_endpoint(endpoint_name)
        if endpoint_status['state']['ready'] == "READY":
            print(f"Endpoint {endpoint_name} is ready.")
            return
        time.sleep(interval)
    raise TimeoutError(f"Endpoint {endpoint_name} did not become ready within {timeout} seconds.")

wait_for_endpoint_ready(serving_endpoint_name, client)

# COMMAND ----------

from dbx.pixels.modelserving.vista3d.servingendpoint import Vista3DMONAITransformer

df = spark.table(table)

df_monai = Vista3DMONAITransformer(table=table, destDir=os.environ["DEST_DIR"], endpoint_name=serving_endpoint_name, exportMetrics=True).transform(df)

display(df_monai.filter('series_uid = "1.2.156.14702.1.1000.16.1.2020031111365289000020001"'))

# Test performance using noop
#df_monai.write.format("noop").mode("overwrite").save()

# COMMAND ----------

# MAGIC %md
# MAGIC ### Initialize a Vista3DGPUTransformer to process the pixels' catalog table using GPU resources.

# COMMAND ----------

import torch
from dbx.pixels.modelserving.vista3d.gpu import Vista3DGPUTransformer

gpuCount = int(spark.conf.get("spark.executor.resource.gpu.amount","0") or torch.cuda.device_count())
nWorkers = (int(spark.conf.get("spark.databricks.clusterUsageTags.clusterWorkers")) or 1)
tasksPerGpu = int(spark.conf.get("spark.task.resource.gpu.amount","1"))

df = spark.table(table)

df_monai = Vista3DGPUTransformer(inputCol="meta", 
                                 table=table, 
                                 destDir=os.environ["DEST_DIR"], 
                                 sqlWarehouseId=os.environ["DATABRICKS_WAREHOUSE_ID"], 
                                 labelPrompt=None, exportMetrics=True, exportOverlays=False, 
                                 secret=os.environ["DATABRICKS_TOKEN"], 
                                 host=os.environ["DATABRICKS_HOST"], 
                                 gpuCount=gpuCount, nWorkers=nWorkers, tasksPerGpu=tasksPerGpu).transform(df)

display(df_monai)

# Test performance using noop
#df_monai.write.format("noop").mode("overwrite").save()

# COMMAND ----------

# MAGIC %sql
# MAGIC -- Requires Databricks Runtime 15.2 and above or Serverless
# MAGIC -- Sample query to illustrate how to use the ai_query function to query vista3d model in serving endpoint 
# MAGIC with ct as (
# MAGIC   select distinct(meta:['0020000E'].Value[0]) as series_uid
# MAGIC   from ${table}
# MAGIC   where meta:['00080008'] like '%AXIAL%'
# MAGIC )
# MAGIC
# MAGIC select series_uid, parse_json(ai_query(
# MAGIC   endpoint => '${serving_endpoint_name}',
# MAGIC   request => named_struct(
# MAGIC       'series_uid', series_uid,
# MAGIC       'params', named_struct(
# MAGIC                     'export_metrics', True,
# MAGIC                     'export_overlays', True
# MAGIC                 )
# MAGIC   ),
# MAGIC   returnType => 'STRING'
# MAGIC )) as result from ct
