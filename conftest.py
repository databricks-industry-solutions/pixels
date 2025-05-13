import os

import pytest
from databricks.connect import DatabricksSession
from pyspark.sql import SparkSession

# Catalog and Schema configuration
CATALOG = "main"
SCHEMA = "pixels_solacc_gitactions"

# Volume configuration
VOLUME_NAME = "pixels_volume_test"
VOLUME_UC = f"{CATALOG}.{SCHEMA}.{VOLUME_NAME}"

# Table configuration
TABLE = f"{CATALOG}.{SCHEMA}.object_catalog_test"

# Path configurations
BASE_PATH = f"/Volumes/{CATALOG}/{SCHEMA}/{VOLUME_NAME}/"
CHECKPOINT_BASE_PATH = f"{BASE_PATH}/checkpoints"
UNZIP_BASE_PATH = f"{BASE_PATH}/unzipped"

# Test data paths
ZIP_FILE_PATH = "s3://hls-eng-data-public/dicom/ddsm/benigns_21*zip"
DICOM_FILE_PATH = "s3://hls-eng-data-public/dicom/ddsm/benigns/patient0007/"

# Anonymization configuration
DEFAULT_FP_KEY = "00112233445566778899aabbccddeeff"
DEFAULT_FP_TWEAK = "a1b2c3d4e5f60708"


@pytest.fixture
def spark() -> SparkSession:
    """
    Create a SparkSession (the entry point to Spark functionality) on
    the cluster in the remote Databricks workspace. Unit tests do not
    have access to this SparkSession by default.
    """
    sparkSession = DatabricksSession.builder.getOrCreate()

    if os.path.exists("./wheels/databricks_pixels.zip"):
        sparkSession.addArtifact("./wheels/databricks_pixels.zip", pyfile=True)
    return sparkSession
