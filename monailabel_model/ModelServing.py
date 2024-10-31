# Databricks notebook source
# MAGIC %pip install ./monailabel-0.8.4rc2-py3-none-any.whl -q
# MAGIC dbutils.library.restartPython()

# COMMAND ----------

# MAGIC %run ../config/proxy_prep

# COMMAND ----------

init_widgets()
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

# Load the model from the tracking server and perform inference
#model = mlflow.pyfunc.load_model(f"runs:/{run_id}/DBMONAILabelModel")

data = {'image_id': ["1.2.156.14702.1.1000.16.1.2020031111365289000020001"]}
df = pd.DataFrame(data)

model.predict(None, df)

with dcmread(
  open(f"{os.environ['DEST_DIR']}/1.2.156.14702.1.1000.16.1.2020031111365289000020001.dcm", mode="rb"), defer_size=1000, stop_before_pixels=(not False)) as ds:
  print(ds.StudyInstanceUID)
  print(ds.SeriesInstanceUID)
  print(ds.SOPInstanceUID)
  print(ds.SeriesDescription)

# COMMAND ----------

import pandas as pd
import mlflow

data = {'image_id': ["1.2.156.14702.1.1000.16.1.2020031111365289000020001"]}
df = pd.DataFrame(data)

# Save the function as a model
with mlflow.start_run():
    mlflow.pyfunc.log_model(
        "DBMONAILabelModel",
        python_model=model,
        input_example=df,
        pip_requirements=["./code/monailabel-0.8.4rc2-py3-none-any.whl"],
        code_paths=["./lib", "./dblabelapp.py" ,"./dbmonailabelmodel.py" ,"./monailabel-0.8.4rc2-py3-none-any.whl"],
        artifacts={'segmentation-model': "./model/pretrained_segmentation.pt"}
    )
    run_id = mlflow.active_run().info.run_id

# COMMAND ----------

# MAGIC %md
# MAGIC After creating the model, publish it and create a serving endpoint

# COMMAND ----------

from mlflow.deployments import get_deploy_client

client = get_deploy_client("databricks")

endpoint = client.create_endpoint(
    name="pixels-monai",
    config={
        "served_entities": [
            {
                'name': 'pixels_monailabel-1',
                'entity_name': 'pixels_monailabel',
                "entity_version": "1",
                "workload_size": "Small",
                "workload_type": "GPU_MEDIUM",
                "scale_to_zero_enabled": True,
                'environment_vars': {
                  'DATABRICKS_TOKEN': '{{secrets/pixels-scope/ema_rina_token}}',
                  'DATABRICKS_HOST': os.environ["DATABRICKS_HOST"],
                  'DATABRICKS_PIXELS_TABLE': os.environ["DATABRICKS_PIXELS_TABLE"],
                  'DATABRICKS_WAREHOUSE_ID': os.environ["DATABRICKS_WAREHOUSE_ID"],
                  'DEST_DIR': os.environ["DEST_DIR"]
                },
            }
        ]
    }
)

