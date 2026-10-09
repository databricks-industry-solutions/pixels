# Databricks notebook source
# MAGIC %md
# MAGIC # Register NV-Reason-CT Model in Unity Catalog
# MAGIC
# MAGIC Logs the `DBNVReasonCTModel` pyfunc (NVIDIA NV-Reason-CT, 3D CT VLM) and
# MAGIC registers it with a `champion` alias. Reuses the Pixels DICOMweb datastore
# MAGIC (`common/`) + the patched `monailabel` wheel shipped in `vista3d.tar.gz`.
# MAGIC
# MAGIC Params (widgets): `catalog`, `schema`, `volume`, `model_uc_name`.

# COMMAND ----------

# DBTITLE 1,Match the serving env's MLflow (older MLflow calls load_context at log time)
# MAGIC %pip install -q mlflow==3.11.1
# MAGIC dbutils.library.restartPython()

# COMMAND ----------

dbutils.widgets.text("catalog", "main")
dbutils.widgets.text("schema", "pixels_solacc")
dbutils.widgets.text("volume", "main.pixels_solacc.pixels_volume")
dbutils.widgets.text("model_uc_name", "main.pixels_solacc.nv_reason_ct")

catalog = dbutils.widgets.get("catalog")
schema = dbutils.widgets.get("schema")
volume = dbutils.widgets.get("volume")
model_uc_name = dbutils.widgets.get("model_uc_name")

# COMMAND ----------

# DBTITLE 1,Extract code + monailabel wheel from vista3d.tar.gz on the Volume
import os, sys, tarfile, shutil

_vp = volume.split(".")
_volume_base = f"/Volumes/{_vp[0]}/{_vp[1]}/{_vp[2]}"
_tar = os.path.join(_volume_base, "dist", "vista3d.tar.gz")

_model_dir = "/tmp/nvct"
if os.path.isdir(_model_dir):
    subprocess_rm = __import__("subprocess")
    subprocess_rm.run(["chmod", "-R", "u+w", _model_dir], check=False)
    shutil.rmtree(_model_dir, ignore_errors=True)
os.makedirs(_model_dir, exist_ok=True)
with tarfile.open(_tar, "r:gz") as tar:
    tar.extractall(_model_dir)

# archive top-level dir is "vista3d" (renamed from models/monai); it contains
# common/, nvreasonct/, artifacts/ (requires a fresh `make build` that includes
# the nvreasonct/ dir, re-uploaded to the Volume).
_root = os.path.join(_model_dir, "vista3d")
assert os.path.isdir(os.path.join(_root, "common")), "common/ missing in archive"
assert os.path.isdir(os.path.join(_root, "nvreasonct")), "nvreasonct/ missing — rebuild vista3d.tar.gz (make build) and re-upload"
os.chdir(_root)
sys.path.insert(0, _root)
print("extracted ->", _root, "| contents:", os.listdir(_root))

# COMMAND ----------

# DBTITLE 1,Signature + example payloads
from mlflow.models import ModelSignature
from mlflow.types.schema import ColSpec, DataType, Object, Property, Schema

input_examples = [
    {"input": {"action": "info"}},
    {
        "series_uid": "1.2.156.14702.1.1000.16.1.2020031111365293700020003",
        "params": {
            "prompt": "Describe the findings in this chest CT.",
            "anatomy_region": "chest",
            "max_new_tokens": 1024,
            "pixels_table": f"{catalog}.{schema}.object_catalog",
        },
    },
    {"series_uid": "1.2.156.14702.1.1000.16.1.2020031111365293700020003"},
    {
        "series_uid": "1.2.156.14702.1.1000.16.1.2020031111365293700020003",
        "study_uid": "1.2.156.14702.1.1000.16.0.20200311113603875",
    },
]

# Explicit schema: every field optional. infer_signature marks the params
# properties as required (they all appear together in the one example), which
# makes the endpoint reject any request that omits one of them.
_params = Object(
    [
        Property("prompt", DataType.string, required=False),
        Property("anatomy_region", DataType.string, required=False),
        Property("max_new_tokens", DataType.long, required=False),
        Property("pixels_table", DataType.string, required=False),
        Property("study_uid", DataType.string, required=False),
    ]
)
signature = ModelSignature(
    inputs=Schema(
        [
            ColSpec(Object([Property("action", DataType.string, required=False)]), "input", required=False),
            ColSpec(DataType.string, "series_uid", required=False),
            ColSpec(DataType.string, "study_uid", required=False),  # optional; skips a lookup query
            ColSpec(_params, "params", required=False),
        ]
    ),
    outputs=Schema([ColSpec(DataType.string)]),
)
print(signature)

# COMMAND ----------

# DBTITLE 1,Log + register
import mlflow
from mlflow import MlflowClient
from nvreasonct.dbnvreasonct import DBNVReasonCTModel

mlflow.set_registry_uri("databricks-uc")

MODEL_DESCRIPTION = (
    "NVIDIA NV-Reason-CT — a 3D vision-language model for CT (chest/abdomen): "
    "radiology report generation, QA, and multi-step reasoning over CT volumes "
    "(Primus 3D ViT + Qwen3.5-4B, 4.69B params). Served Pixels-style: resolves a "
    "DICOM series_uid to a NIfTI volume via the object_catalog datastore and "
    "returns a text report. Research/educational use only, not for clinical "
    "diagnosis. License OpenMDW-1.1."
)

with mlflow.start_run():
    logged = mlflow.pyfunc.log_model(
        artifact_path="DBNVReasonCTModel",
        python_model=DBNVReasonCTModel(),
        conda_env="./nvreasonct/conda.yaml",
        signature=signature,
        input_example=input_examples[1],
        code_paths=["./nvreasonct", "./common"],
        artifacts={
            "monailabel-0.8.5": "./artifacts/monailabel-0.8.5-py3-none-any.whl",
        },
    )

latest = mlflow.register_model(logged.model_uri, model_uc_name)

mc = MlflowClient()
mc.set_registered_model_tag(model_uc_name, "accelerator", "pixels")
mc.set_registered_model_alias(model_uc_name, "champion", latest.version)
mc.update_model_version(name=model_uc_name, version=latest.version, description=MODEL_DESCRIPTION)

dbutils.notebook.exit(f"SUCCESS: registered {model_uc_name} v{latest.version} (champion)")
