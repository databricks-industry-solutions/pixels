import os

import pytest
from databricks.connect import DatabricksSession
from databricks.sdk.runtime import dbutils
from pyspark.sql import SparkSession

from test_constants import (
    BASE_PATH,
    CATALOG,
    DEFAULT_FP_KEY,
    SCHEMA,
    TABLE,
    VOLUME_UC,
)


@pytest.fixture(scope="session")
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


def _session_needs_spark(session) -> bool:
    return any("spark" in item.fixturenames for item in session.items)


@pytest.fixture(scope="session", autouse=True)
def setup_teardown_database(request):
    """
    Session-scoped fixture that creates the database and volume at the start of the test session
    and drops them after all tests are completed.
    """
    if not _session_needs_spark(request.session):
        yield
        return

    spark = request.getfixturevalue("spark")
    from dbx.pixels import Catalog

    print("CREATING VOLUME AND SCHEMA")

    # Setup: Create database and volume
    spark.sql(f"CREATE DATABASE IF NOT EXISTS {CATALOG}.{SCHEMA}")
    spark.sql(f"CREATE VOLUME IF NOT EXISTS {VOLUME_UC}")

    catalog = Catalog(spark, table=TABLE, volume=VOLUME_UC)
    catalog.init_tables()

    yield

    print("DROPPING SCHEMA AND EVERYTHING IN IT")

    # Drop database
    spark.sql(f"DROP DATABASE IF EXISTS {CATALOG}.{SCHEMA} CASCADE")


@pytest.fixture(autouse=True)
def cleanup_after_test(request):
    """
    Function-scoped fixture that cleans up tables and folders before each test.
    """
    if "spark" not in request.fixturenames:
        yield
        return

    spark = request.getfixturevalue("spark")

    print("CLEANING TABLES AND FOLDERS")

    # Clean up tables by truncating them
    if spark.catalog.tableExists(TABLE):
        spark.sql(f"TRUNCATE TABLE {TABLE}")
    if spark.catalog.tableExists(TABLE + "_unzip"):
        spark.sql(f"TRUNCATE TABLE {TABLE}_unzip")
    if spark.catalog.tableExists(TABLE + "_autoseg_result"):
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

    yield
