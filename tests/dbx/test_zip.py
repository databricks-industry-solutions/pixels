import pytest
from databricks.connect import DatabricksSession
from databricks.sdk.core import DatabricksError
from databricks.sdk.runtime import dbutils
from pyspark.sql import SparkSession
import os

from dbx.pixels import Catalog

FILE_PATH = "s3://hls-eng-data-public/dicom/ddsm/benigns_21*zip"
TABLE = "main.pixels_solacc.object_catalog_test"
VOLUME = f"main.pixels_solacc.pixels_volume_test"
BASE_PATH = f"/Volumes/main/pixels_solacc/pixels_volume_test/pixels_acc_test"
CHECKPOINT_BASE_PATH = f"{BASE_PATH}/checkpoints"
UNZIP_BASE_PATH = f"{BASE_PATH}/unzipped"


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


@pytest.fixture(autouse=True)
def setup(spark: SparkSession):
    spark.sql("CREATE DATABASE IF NOT EXISTS main.pixels_solacc")
    spark.sql(f"CREATE VOLUME IF NOT EXISTS {VOLUME}")
    yield

    try:
        folders = list(dbutils.fs.ls(BASE_PATH))
        if len(folders) > 0:
            dbutils.fs.rm(BASE_PATH, True)
    except DatabricksError as err:
        if "No file or directory exists on path" in str(err):
            print("Checkpoints folder clean, nothing to do")
        else:
            print(err)

    spark.sql(f"DROP TABLE IF EXISTS {TABLE}")
    spark.sql(f"DROP TABLE IF EXISTS {TABLE}_unzip")


def test_catalog_unzip(spark: SparkSession):
    catalog = Catalog(spark, table=TABLE, volume=VOLUME)
    catalog_df = catalog.catalog(
        path=FILE_PATH, extractZip=True, extractZipBasePath=UNZIP_BASE_PATH
    )

    assert catalog_df is not None

    catalog.save(df=catalog_df)

    assert catalog.load().count() == 30


def test_catalog_unzip_stream(spark: SparkSession):
    catalog = Catalog(spark, table=TABLE, volume=VOLUME)
    catalog_df = catalog.catalog(
        path=FILE_PATH,
        extractZip=True,
        extractZipBasePath=UNZIP_BASE_PATH,
        streaming=True,
        streamCheckpointBasePath=CHECKPOINT_BASE_PATH,
    )

    assert catalog_df is not None

    catalog.save(df=catalog_df)

    assert catalog.load().count() == 30
