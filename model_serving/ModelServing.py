# Databricks notebook source
# MAGIC %pip install ./monailabel-0.8.4rc2+10.g82c2442.dirty-py3-none-any.whl

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

import mlflow
import pandas as pd
import dblabelapp
from dblabelapp import DBMONAILabelApp
import logging

class DBMONAILabelModel(mlflow.pyfunc.PythonModel):

    def __init__(self):
        self.logger = logging.getLogger(__name__)
        if f"{os.getcwd()}/bin" not in os.environ['PATH']:
            os.environ['PATH'] += f"{os.pathsep}{os.getcwd()}/bin"

    def predict(self, context, model_input, params=None):
        import os

        studies = os.environ["DATABRICKS_HOST"]
        app_dir = "./"
        test = "infer"
        model_nv = "segmentation"

        os.putenv("MASTER_ADDR", "127.0.0.1")
        os.putenv("MASTER_PORT", "1234")
        
        conf = {
            "models": model_nv,
            "preload": "false",
            "table": os.environ["DATABRICKS_PIXELS_TABLE"],
            "output": "dicom_seg"
        }

        dest_dir = os.environ["DEST_DIR"]
        app = DBMONAILabelApp(app_dir, studies, conf)

        self.logger.warning(f"Processing {model_input}")

        def upload_file(self, file_path, dest_path):
            from databricks.sdk import WorkspaceClient
            w = WorkspaceClient()   
            w.files.upload(dest_path, open(file_path, mode="rb"))
            self.logger.warning(f"File uploaded to {dest_path}")

        def infer_autosegmentation(image_id):
            import shutil
            from monailabel.utils.others.generic import device_list, file_ext
            from monailabel.datastore.utils.convert import nifti_to_dicom_seg
            from lib.configs.colors import SOME_COLORS
            
            image_uri = app.datastore().get_image_uri(image_id)

            self.logger.warning(f"Processing image URI: {image_uri}")

            result = app.infer(request={'model': 'segmentation', 'image': image_id, 'largest_cc': False, 'device': device_list()[0], 'result_extension': '.nrrd', 'result_dtype': 'uint16', 'result_compress': False, 'restore_label_idx': False})

            self.logger.warning(f"Inference completed on image: {image_uri}")

            suffixes = [".nii", ".nii.gz", ".nrrd"]
            image_path = [image_uri.replace(suffix, "") for suffix in suffixes if image_uri.endswith(suffix)][0]
            res_img = result.get("file") if result.get("file") else result.get("label")

            model_labels = []
            for idx, label_name in enumerate(app.info()['models'][model_nv]["labels"]):
                model_labels.append({
                    "name": label_name.replace("_"," "),
                    "model_name": model_nv,
                    "color": SOME_COLORS[idx+1]
                })

            label_names = [model_labels[int(centroid.split("_")[1])-1] for centroid in result.get("params").get("centroids").keys()]

            self.logger.warning(f"Starting conversion on image: {image_uri}")
            dicom_seg_file = nifti_to_dicom_seg(image_path, res_img, label_names, use_itk=True)
            self.logger.warning(f"Conversion completed on image: {image_uri}, temp file path: {dicom_seg_file}")

            label_json = result["params"]

            label_file = os.path.join(dest_dir, image_id+".dcm")
            self.logger.warning(f"Destination file path: {label_file}")
            
            upload_file(self, dicom_seg_file, label_file)

            print(f"++++ Image File: {image_path}")
            print(f"++++ Label File: {label_file}")
            return label_file

        return model_input.apply(lambda x: infer_autosegmentation(x['image_id']), axis=1)

model = DBMONAILabelModel()

#mlflow.pyfunc.save_model("./db_monai_model/",
#                         python_model=my_model,
#                         artifacts={"db_monailabel_class_file": "./dblabelapp.py"},
#                         pip_requirements=["./monailabel-0.8.4rc2+10.g82c2442.dirty-py3-none-any.whl"],
#                         code_paths=["./bin","./lib","./model", "./monailabel-0.8.4rc2+10.g82c2442.dirty-py3-none-any.whl"]
#                         )

# COMMAND ----------

import pandas as pd

data = {'image_id': ["1.2.156.14702.1.1000.16.1.2020031111365289000020001"]}
df = pd.DataFrame(data)

# Save the function as a model
with mlflow.start_run():
    mlflow.pyfunc.log_model(
        "DBMONAILabelModel",
        python_model=model,
        input_example=df,
        pip_requirements=["./code/monailabel-0.8.4rc2+10.g82c2442.dirty-py3-none-any.whl"],
        code_paths=["./lib", "./dblabelapp.py" ,"./monailabel-0.8.4rc2+10.g82c2442.dirty-py3-none-any.whl"],
        artifacts={'segmentation-model': "./model/pretrained_segmentation.pt"}
    )
    run_id = mlflow.active_run().info.run_id/Volumes/main/pixels_solacc/pixels_volume/1.2.156.14702.1.1000.16.1.2020031111365289000020001//Volumes/main/pixels_solacc/pixels_volume/1.2.156.14702.1.1000.16.1.2020031111365289000020001/

# Load the model from the tracking server and perform inference
model = mlflow.pyfunc.load_model(f"runs:/{run_id}/DBMONAILabelModel")

# COMMAND ----------

import pandas as pd
import numpy as np
from pydicom import dcmread

data = {'image_id': ["1.2.156.14702.1.1000.16.1.2020031111365289000020001"]}
df = pd.DataFrame(data)

model.predict(None, df)

with dcmread(
  open("/Volumes/main/pixels_solacc/pixels_volume/1.2.156.14702.1.1000.16.1.2020031111365289000020001.dcm", mode="rb"), defer_size=1000, stop_before_pixels=(not False)) as ds:
  print(ds.StudyInstanceUID)
  print(ds.SeriesInstanceUID)
  print(ds.SOPInstanceUID)
