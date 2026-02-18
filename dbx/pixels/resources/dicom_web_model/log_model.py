"""
Log the DICOMweb PyFunc model to MLflow.

Run inside a Databricks notebook (``%run ./log_model``) or as a script::

    python log_model.py

The script:

1. Instantiates :class:`DICOMwebServingModel`.
2. Points at the ``dicom_web/`` source tree as a model artifact
   (handlers, wrapper, SQL client, caches — everything the serving
   endpoint needs at runtime).
3. Logs the model with an explicit signature and pip requirements.
4. Optionally registers it in the MLflow Model Registry (uncomment
   the last section).
"""

import os
from pathlib import Path

import mlflow
from mlflow.models.signature import ModelSignature
from mlflow.types.schema import ColSpec, Schema

from dicomweb_pyfunc import DICOMwebServingModel

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

_this_dir = Path(__file__).resolve().parent
_dicom_web_source = _this_dir.parent / "dicom_web"

if not _dicom_web_source.is_dir():
    raise FileNotFoundError(
        f"DICOMweb source directory not found at {_dicom_web_source}. "
        "Make sure this script is located in "
        "dbx/pixels/resources/dicom_web_model/ alongside the dicom_web/ folder."
    )

# ---------------------------------------------------------------------------
# Model signature
# ---------------------------------------------------------------------------

input_schema = Schema([
    ColSpec("string", "method"),
    ColSpec("string", "path"),
    ColSpec("string", "query_string"),
    ColSpec("string", "headers"),
    ColSpec("string", "body"),
    ColSpec("string", "body_encoding"),
])
output_schema = Schema([ColSpec("string")])
signature = ModelSignature(inputs=input_schema, outputs=output_schema)

# ---------------------------------------------------------------------------
# Pip requirements (mirrors dicom_web/requirements.txt + httpx for ASGI)
# ---------------------------------------------------------------------------

pip_requirements = [
    "databricks-pixels @ git+https://github.com/databricks-industry-solutions/pixels@features/dicom_web_integration",
    "databricks-sql-connector>=3.0.0",
    "databricks-sdk",
    "fastapi",
    "uvicorn",
    "httpx",
    "requests-toolbelt",
    "zstd",
    "psycopg2-binary",
    "psutil>=5.9.0",
    "python-multipart",
    "pydicom>=2.4.0",
    "pylibjpeg",
    "pylibjpeg-libjpeg",
    "pylibjpeg-openjpeg",
]

# ---------------------------------------------------------------------------
# Log model
# ---------------------------------------------------------------------------

with mlflow.start_run(run_name="dicomweb-serving-model") as run:
    model_info = mlflow.pyfunc.log_model(
        artifact_path="dicomweb_model",
        python_model=DICOMwebServingModel(),
        artifacts={
            "dicom_web_source": str(_dicom_web_source),
        },
        pip_requirements=pip_requirements,
        signature=signature,
        code_paths=[str(_this_dir / "dicomweb_pyfunc.py")],
    )

    print(f"Model logged:  {model_info.model_uri}")
    print(f"Run ID:        {run.info.run_id}")

# ---------------------------------------------------------------------------
# (Optional) Register the model — uncomment to auto-register after logging
# ---------------------------------------------------------------------------
# REGISTERED_MODEL_NAME = "dicomweb-serving"
# mlflow.register_model(model_info.model_uri, REGISTERED_MODEL_NAME)
# print(f"Registered as: {REGISTERED_MODEL_NAME}")
