# Databricks notebook source
# MAGIC %md
# MAGIC # Register Vista3D Model in Unity Catalog
# MAGIC
# MAGIC Idempotent: checks if a model version already exists before installing
# MAGIC heavy dependencies and logging a new version.

# COMMAND ----------

# MAGIC %run ../../config/proxy_prep

# COMMAND ----------

# DBTITLE 1,Check for Existing Model
model_uc_name, serving_endpoint_name, _ = init_model_serving_widgets()

import mlflow
from mlflow import MlflowClient

mc = MlflowClient()
try:
    versions = mc.search_model_versions(f"name='{model_uc_name}'")
    if versions:
        latest = max(versions, key=lambda v: int(v.version))
        print(f"Model {model_uc_name} has {len(versions)} existing version(s), latest={latest.version} — re-logging with updated deps")
except Exception as e:
    print(f"No existing model found, proceeding with registration: {e}")

# COMMAND ----------

# DBTITLE 1,Install Dependencies
import subprocess, sys, os

_nb_ctx = dbutils.notebook.entry_point.getDbutils().notebook().getContext()
_nb_dir = "/Workspace" + os.path.dirname(_nb_ctx.notebookPath().get())
_model_dir = os.path.normpath(os.path.join(_nb_dir, "../../monailabel_model"))

subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", f"{_model_dir}/vista3d/requirements.txt"])
subprocess.check_call([sys.executable, "-m", "pip", "install", f"{_model_dir}/artifacts/monailabel-0.8.5-py3-none-any.whl", "--no-deps"])
subprocess.check_call([sys.executable, "-m", "pip", "install", "torch==2.5.1", "torchvision==0.20.1", "torchaudio==2.5.1", "--index-url", "https://download.pytorch.org/whl/cpu"])
subprocess.check_call([sys.executable, "-m", "pip", "install", "monai==1.5.2", "pytorch-ignite", "--no-deps"])

# COMMAND ----------

dbutils.library.restartPython()

# COMMAND ----------

# MAGIC %run ../../config/proxy_prep

# COMMAND ----------

# DBTITLE 1,Re-initialize After Restart
sql_warehouse_id, table, volume = init_widgets(show_volume=True)
model_uc_name, serving_endpoint_name, _ = init_model_serving_widgets()
init_env()

import os, subprocess, sys

_nb_ctx = dbutils.notebook.entry_point.getDbutils().notebook().getContext()
_nb_dir = "/Workspace" + os.path.dirname(_nb_ctx.notebookPath().get())
_model_dir = os.path.normpath(os.path.join(_nb_dir, "../../monailabel_model"))
os.chdir(_model_dir)
sys.path.insert(0, _model_dir)

volume_path = volume.replace(".", "/")
os.environ["DEST_DIR"] = f"/Volumes/{volume_path}/monai_serving/vista3d/"

# COMMAND ----------

# DBTITLE 1,Model Description
MODEL_DESCRIPTION = """\
**VISTA3D** (Versatile Imaging SegmenTation and Annotation model) is an \
interactive, AI-powered foundation model designed by NVIDIA and its research \
partners to automate the segmentation and annotation of 3D Computed Tomography \
(CT) medical images. It acts as a specialized tool for researchers and \
clinicians to quickly create high-quality, ground-truth data for 3D human \
anatomy, supporting 127 different organ and lesion classes.

**Key Features and Capabilities**

- **Unified Architecture:** Combines automatic segmentation (auto-branch) with \
interactive refinement (interactive-branch) in one model.
- **3D Precision:** Operates directly on 3D CT volumes (using NIfTI format) \
rather than 2D slices, allowing it to understand the full spatial context of \
anatomy.
- **Interactive Refinement:** Allows users to refine automatic segmentation \
results through point-and-click prompts (adding positive/negative points).
- **Zero-Shot Learning:** Capable of segmenting unseen or rare anatomical \
structures (novel classes) without specific prior training on those classes.
- **High Performance:** Achieves state-of-the-art performance on 3D CT \
benchmarks, often outperforming or matching specialized (non-foundation) models.

**Core Workflows**

1. **Segment Everything:** Automatically segments a large number of pre-defined \
organs and structures in a full-body scan.
2. **Segment using Class:** Focuses on specific organs or structures (e.g., \
"liver," "tumor") via text or label prompts.
3. **Segment Point Prompts (Interactive):** Allows users to "click" to correct \
or identify structures, enabling "human-in-the-loop" refinement.

**Technical Details and Training**

- **Training Data:** Trained on a massive, diverse dataset of over 11,000 3D \
CT scans.
- **Model Architecture:** Utilizes a Transformer-based architecture (SegResNet \
+ Prompt Encoding).
- **Distillation:** Uses a novel 3D supervoxel method to distill knowledge \
from pre-trained 2D models (like Meta's SAM) to enhance its 3D capabilities.
- **Inference Speed:** Accelerated through NVIDIA TensorRT, making it faster \
than traditional ensemble methods like TotalSegmentator.

**Clinical and Research Utility**

VISTA3D is part of the NVIDIA MONAI framework for healthcare AI. It is \
designed to significantly reduce the time needed to annotate CT scans — a \
critical bottleneck in training new medical AI models — speeding up workflows \
by enabling rapid, accurate annotation. Note: Current versions are for \
research purposes, not clinical diagnosis.\
"""

# COMMAND ----------

# DBTITLE 1,Build Model Signature
from mlflow.models import infer_signature

input_examples = [
    {"input": {"action": "info"}},
    {"input": {"action": "activelearning/random"}},
    {
        "input": {
            "train": {
                "name": "train_01",
                "pretrained": True,
                "device": ["NVIDIA A10G"],
                "max_epochs": 50,
                "early_stop_patience": -1,
                "val_split": 0.2,
                "train_batch_size": 1,
                "val_batch_size": 1,
                "multi_gpu": True,
                "gpus": "all",
                "dataset": "SmartCacheDataset",
                "dataloader": "ThreadDataLoader",
                "tracking": "mlflow",
                "tracking_uri": "",
                "tracking_experiment_name": "",
                "model": "segmentation",
            }
        }
    },
    {
        "input": {
            "train": {
                "name": "train_01",
                "pretrained": True,
                "max_epochs": 50,
                "val_split": 0.2,
                "train_batch_size": 1,
                "val_batch_size": 1,
                "gpus": "all",
                "model": "segmentation",
            }
        }
    },
    {
        "input": {
            "infer": {
                "largest_cc": False,
                "device": ["NVIDIA A10G"],
                "result_extension": ".nrrd",
                "result_dtype": "uint16",
                "result_compress": False,
                "restore_label_idx": False,
                "model": "vista3d",
                "image": "1.2.156.14702.1.1000.16.1.2020031111365289000020001",
                "export_metrics": False,
                "export_overlays": False,
                "points": [[10, 10, 10], [20, 20, 20]],
                "point_labels": [0, 1],
                "pixels_table": "main.pixels_solacc.object_catalog",
            }
        }
    },
    {
        "input": {
            "infer": {
                "model": "vista3d",
                "image": "1.2.156.14702.1.1000.16.1.2020031111365289000020001",
                "label_prompt": [1, 26],
            }
        }
    },
    {
        "input": {
            "get_file": "/tmp/vista/bundles/vista3d/models/prediction/1.2.156.14702.1.1000.16.1.2020031111365289000020001/1.2.156.14702.1.1000.16.1.2020031111365289000020001_seg.nii.gz",
            "result_dtype": "uint8",
        }
    },
    {
        "series_uid": "1.2.156.14702.1.1000.16.1.2020031111365293700020003",
        "params": {
            "label_prompt": [1, 26],
            "export_metrics": False,
            "export_overlays": False,
            "points": [[100, 100, 100], [200, 200, 200]],
            "point_labels": [0, 1],
            "dest_dir": "/Volumes/main/pixels_solacc/pixels_volume/monai_serving/vista3d",
            "pixels_table": "main.pixels_solacc.object_catalog",
            "torch_device": 0,
        },
    },
    {
        "series_uid": "1.2.156.14702.1.1000.16.1.2020031111365293700020003",
        "params": {},
    },
    {"series_uid": "1.2.156.14702.1.1000.16.1.2020031111365293700020003"},
]

signature = infer_signature(input_examples, model_output="")

# COMMAND ----------

# DBTITLE 1,Download Tools
try:
    from common.utils import download_dcmqi_tools

    download_dcmqi_tools("./artifacts")
except Exception as e:
    print(f"dcmqi download skipped: {e}")

# COMMAND ----------

# DBTITLE 1,Log and Register Model
import mlflow
from mlflow import MlflowClient
from vista3d.code.dbvista3dmodel import DBVISTA3DModel

with mlflow.start_run():
    logged_model_info = mlflow.pyfunc.log_model(
        name="DBVISTA3DModel",
        python_model=DBVISTA3DModel(),
        conda_env="./vista3d/conda.yaml",
        signature=signature,
        input_example=input_examples[4],
        code_paths=["./vista3d", "./common", "./lib"],
        artifacts={
            "monailabel-0.8.5": "./artifacts/monailabel-0.8.5-py3-none-any.whl",
            "itkimage2segimage": "./artifacts/itkimage2segimage",
        },
    )

latest_model = mlflow.register_model(logged_model_info.model_uri, model_uc_name)

mc = MlflowClient()
mc.set_registered_model_tag(model_uc_name, "accelerator", "pixels")
mc.set_registered_model_alias(model_uc_name, "champion", latest_model.version)
mc.update_model_version(
    name=model_uc_name,
    version=latest_model.version,
    description=MODEL_DESCRIPTION,
)

dbutils.notebook.exit(f"SUCCESS: registered version {latest_model.version} with champion alias")
