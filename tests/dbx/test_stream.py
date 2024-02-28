import pytest
from databricks.connect import DatabricksSession
from databricks.sdk.core import DatabricksError
from databricks.sdk.runtime import dbutils
from pyspark.sql import SparkSession

from dbx.pixels import Catalog

FILE_PATH = "s3://hls-eng-data-public/dicom/ddsm/benigns/patient0007/"
TABLE = "main.pixels_solacc.object_catalog_stream"
CHECKPOINT_BASE_PATH = "/tmp/pixels_acc_stream_test/checkpoints/"


@pytest.fixture()
def spark() -> SparkSession:
    """
    Create a SparkSession (the entry point to Spark functionality) on
    the cluster in the remote Databricks workspace. Unit tests do not
    have access to this SparkSession by default.
    """
    return DatabricksSession.builder.getOrCreate()


@pytest.fixture(autouse=True)
def setup(spark: SparkSession):
    spark.sql("CREATE DATABASE IF NOT EXISTS main.pixels_solacc")
    yield

    try:
        checkpoints = list(dbutils.fs.ls(CHECKPOINT_BASE_PATH))
        if len(checkpoints) > 0:
            dbutils.fs.rm(CHECKPOINT_BASE_PATH, True)
    except DatabricksError as err:
        if "No file or directory exists on path" in str(err):
            print("Checkpoints folder clean, nothing to do")
        else:
            print(err)

    spark.sql(f"DROP TABLE IF EXISTS {TABLE}")


def test_catalog_stream(spark: SparkSession):
    catalog = Catalog(spark, table=TABLE)
    catalog_df = catalog.catalog(
        path=FILE_PATH, streaming=True, streamCheckpointBasePath=CHECKPOINT_BASE_PATH
    )

    assert catalog_df is not None

    catalog.save(df=catalog_df)

    assert catalog.load().count() == 4
