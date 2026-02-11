# Databricks notebook source
# MAGIC %pip install -r vista3d/requirements.txt
# MAGIC %pip install ./artifacts/monailabel-0.8.5-py3-none-any.whl --no-deps --force-reinstall
# MAGIC %pip install monai==1.5.1 pytorch-ignite --no-deps
# MAGIC %pip install simpleitk tensorboard torch torchvision
# MAGIC %pip install mlflow>=3.0 --upgrade
# MAGIC %pip install numpy<2 pylibjpeg>=2.0 pylibjpeg-openjpeg>=2.0

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

init_env()

os.environ["DEST_DIR"] = f"/Volumes/{volume_path}/monai_serving/vista3d/"

# COMMAND ----------

row = spark.sql(f"""SELECT
  collect_set(local_path) as paths,
  size(collect_set(local_path)) as num_files,
  meta:['0020000D'].Value[0]::String as StudyInstanceUID,
  meta:['0020000E'].Value[0]::String as SeriesInstanceUID
FROM
  {table} as coalesced
group by meta:['0020000D'].Value[0]::String, meta:['0020000E'].Value[0]::String""").collect()[0]

row[3]

# COMMAND ----------

import sys

if "./vista3d/code/" not in sys.path:
    sys.path.append("./vista3d/code/")

from vista3d_bundle.scripts.infer import InferClass
from vista3d.code.dbvista3dmodel import DBVISTA3DModel
from datetime import datetime

output_base_path = "/tmp/bench_vista3d/htj2k_coalesce_v8"

from vista3d.code.dbvista3dmodel import DBVISTA3DModel

model = DBVISTA3DModel(volumes_compatible=True)
model.load_context(context=None) #Downloads the vista3d model from the monai zoo
  
def execute_infer(series_uid:str, list_paths:list[str], prompt=None):

    try:
      import time
      start_time = time.time()
      
      print(f"{datetime.now()} ====== Infering image: {series_uid} | {list_paths[0]} ======")

      import os
      import shutil

      series_dir = os.path.join(output_base_path, str(series_uid))
      os.makedirs(series_dir, exist_ok=True)
      for src_path in list_paths:
          dst_path = os.path.join(series_dir, os.path.basename(src_path))
          shutil.copy(src_path, dst_path)
      
      result = vista3d_model.infer(dst_path, label_prompt=prompt, point=None, point_label=None, save_mask=True, output_dir=f"{output_base_path}/{series_uid}/seg/")
      vista3d_model.clear_cache()

      print(result)
      
      print(f"{datetime.now()} ===== Inference completed on image: {series_uid} ======")
      return time.time()-start_time , ""
    except Exception as e:
      import traceback
      print(f"Error: {e}")
      return 0, f"{e}\n{traceback.format_exc()}"

execute_infer(series_uid=row[3], list_paths=row[0], prompt=model.EVERYTHING_PROMPT)

# COMMAND ----------

# === OPTIONAL | Requires GPU Enabled cluster ===

try:
  import torchvision
  import pandas as pd
  import json

  label_prompt = ["liver", "hepatic tumor"]

  label_dict_path = "vista3d/code/vista3d_bundle/data/jsons/label_dict.json"
  label_dict = json.load(open(label_dict_path))
  label_index = [label_dict[label.strip()] for label in label_prompt if label.strip() in label_dict]

  # Pick one of the series_uid available in the pixels' catalog table
  series_uid = "1.2.156.14702.1.1000.16.1.2020031111365289000020001"

  input = { "series_uid": series_uid, "params": {
    "label_prompt": None,
    "export_metrics": True,
    "export_overlays": True,
    "dest_dir": f"/Volumes/{volume_path}/monai_serving/vista3d",
    "pixels_table" : table
    }
  }

  df = pd.DataFrame([input])

  # This step will download the VISTA3D Model bundle scripts and model weights to the local disk
  # This step will automatically download in the ./bin folder the itkimage2segimage binary required for the conversion of nifti files to DICOM SEG files


  from vista3d.code.dbvista3dmodel import DBVISTA3DModel

  model = DBVISTA3DModel(volumes_compatible=True)
  model.load_context(context=None)
  result = model.predict(None, df)
except ImportError as e:
  print(e,", skipping model test")

# COMMAND ----------

import pydicom

dicom_path = "/tmp/vista/bundles/vista3d/models/prediction/1.2.156.14702.1.1000.16.1/1.2.156.14702.1.1000.16.1_seg.dcm"
ds = pydicom.dcmread(dicom_path)
display(ds)
