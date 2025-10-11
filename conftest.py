import os
import pytest
from databricks.connect import DatabricksSession
from pyspark.sql import SparkSession
from databricks.sdk.runtime import dbutils

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


def requires_spark(request):
    """
    Check if the current test requires Spark.
    Tests can be marked with @pytest.mark.spark to indicate they need Spark.
    """
    return request.node.get_closest_marker("spark") is not None


def requires_databricks_setup(request):
    """
    Check if the current test requires Databricks database/volume setup.
    Tests can be marked with @pytest.mark.databricks_setup to indicate they need DB setup.
    """
    return request.node.get_closest_marker("databricks_setup") is not None


@pytest.fixture(scope="session")
def spark(request) -> SparkSession:
    """
    Create a SparkSession (the entry point to Spark functionality) on
    the cluster in the remote Databricks workspace. Unit tests do not
    have access to this SparkSession by default.
    
    Only creates a session if the test is marked with @pytest.mark.spark.
    """
    if not requires_spark(request):
        pytest.skip("Spark not required for this test")
    
    sparkSession = DatabricksSession.builder.getOrCreate()

    if os.path.exists("./wheels/databricks_pixels.zip"):
        sparkSession.addArtifact("./wheels/databricks_pixels.zip", pyfile=True)
    return sparkSession


@pytest.fixture(scope="session")
def setup_teardown_database(request, spark: SparkSession):
    """
    Session-scoped fixture that creates the database and volume at the start of the test session
    and drops them after all tests are completed.
    
    Only runs for tests marked with @pytest.mark.databricks_setup.
    """
    if not requires_databricks_setup(request):
        pytest.skip("Databricks setup not required for this test")
    
    print("CREATING VOLUME AND SCHEMA")

    # Setup: Create database and volume
    spark.sql(f"CREATE DATABASE IF NOT EXISTS {CATALOG}.{SCHEMA}")
    spark.sql(f"CREATE VOLUME IF NOT EXISTS {VOLUME_UC}")
    
    yield

    print("DROPPING SCHEMA AND EVERYTHING IN IT")
    
    # Drop database
    spark.sql(f"DROP DATABASE IF EXISTS {CATALOG}.{SCHEMA} CASCADE")


@pytest.fixture
def cleanup_after_test(request, spark: SparkSession):
    """
    Function-scoped fixture that cleans up tables and folders before each test.
    
    Only runs for tests marked with @pytest.mark.databricks_setup.
    """
    if not requires_databricks_setup(request):
        pytest.skip("Databricks cleanup not required for this test")

    print("CLEANING TABLES AND FOLDERS")
    
    # Clean up tables by truncating them
    if spark.catalog.tableExists(TABLE):
        spark.sql(f"TRUNCATE TABLE {TABLE}")
    if spark.catalog.tableExists(TABLE+"_unzip"):
        spark.sql(f"TRUNCATE TABLE {TABLE}_unzip")
    if spark.catalog.tableExists(TABLE+"_autoseg_result"):
        spark.sql(f"TRUNCATE TABLE {TABLE}_autoseg_result")
    
    # Clean up folders in the volume
    try:
        # Clean up files
        import shutil

        # Clean up folders in the volume
        if os.path.exists(BASE_PATH):
            for folder in os.listdir(BASE_PATH):
                folder_path = os.path.join(BASE_PATH, folder)
                if os.path.isdir(folder_path):
                    shutil.rmtree(folder_path)
                    print(f"Cleaned {folder}")
            
    except Exception as err:
        if "No file or directory exists on path" in str(err):
            print("Folders clean, nothing to do")
        else:
            print(err)
