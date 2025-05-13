import pytest
from databricks.sdk.core import DatabricksError
from databricks.sdk.runtime import dbutils
from pyspark.sql import SparkSession

from dbx.pixels import Catalog

from conftest import (
    CATALOG,
    CHECKPOINT_BASE_PATH,
    DICOM_FILE_PATH,
    SCHEMA,
    TABLE,
    VOLUME_UC,
)


@pytest.fixture(autouse=True)
def setup(spark: SparkSession):
    spark.sql(f"CREATE DATABASE IF NOT EXISTS {CATALOG}.{SCHEMA}")
    spark.sql(f"CREATE VOLUME IF NOT EXISTS {VOLUME_UC}")
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
    spark.sql(f"DROP TABLE IF EXISTS {TABLE}_unzip")
    spark.sql(f"DROP TABLE IF EXISTS {TABLE}_autoseg_result")
    spark.sql(f"DROP VOLUME IF EXISTS {VOLUME_UC}")
    spark.sql(f"DROP DATABASE IF EXISTS {CATALOG}.{SCHEMA}")


def test_catalog_stream(spark: SparkSession):
    catalog = Catalog(spark, table=TABLE, volume=VOLUME_UC)
    catalog_df = catalog.catalog(
        path=DICOM_FILE_PATH, streaming=True, streamCheckpointBasePath=CHECKPOINT_BASE_PATH
    )

    assert catalog_df is not None

    catalog.save(df=catalog_df)

    assert catalog.load().count() == 4
