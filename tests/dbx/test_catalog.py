import pytest
from databricks.sdk.core import DatabricksError
from databricks.sdk.runtime import dbutils
from pyspark.sql import SparkSession

from conftest import BASE_PATH, CATALOG, DICOM_FILE_PATH, SCHEMA, TABLE, VOLUME_UC
from dbx.pixels.version import __version__


@pytest.fixture(autouse=True)
def setup(spark: SparkSession):
    spark.sql(f"CREATE DATABASE IF NOT EXISTS {CATALOG}.{SCHEMA}")
    spark.sql(f"CREATE VOLUME IF NOT EXISTS {VOLUME_UC}")
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
    spark.sql(f"DROP TABLE IF EXISTS {TABLE}_autoseg_result")
    spark.sql(f"DROP VOLUME IF EXISTS {VOLUME_UC}")
    spark.sql(f"DROP DATABASE IF EXISTS {CATALOG}.{SCHEMA}")


def test_catalog_import(spark):
    assert __version__ >= "0.0.6"


def test_path_read(spark):
    df = spark.read.format("binaryFile").load(DICOM_FILE_PATH).drop("content")
    count = df.count()
    assert count == 4


def test_catalog_init(spark):
    from dbx.pixels import Catalog

    catalog = Catalog(spark=spark, table=TABLE, volume=VOLUME_UC)
    assert catalog is not None
    assert catalog.is_anon


def catalog_path(spark, path):
    from dbx.pixels import Catalog

    catalog = Catalog(spark, table=TABLE, volume=VOLUME_UC)
    catalog_df = catalog.catalog(path=path)
    assert catalog_df is not None
    assert catalog_df.count() == 4
    return catalog_df


def test_catalog_public_s3(spark, caplog):
    import logging

    logging.getLogger(__name__)
    caplog.set_level(logging.DEBUG)

    catalog_df = catalog_path(spark, DICOM_FILE_PATH)
    assert len(catalog_df.columns) == 9
    row = catalog_df.collect()[0]
    assert row[0] == DICOM_FILE_PATH + "0007.LEFT_MLO.dcm"
    assert row[2] == 10943362
    assert row[6] == "dcm"


def test_catalog_private_s3(spark):
    path = "s3://databricks-datasets-private/HLS/dicom/images/ddsm/benigns/patient0007/"
    catalog_path(spark, path)


def test_catalog_private_mnt_private(spark):
    path = "/mnt/databricks-datasets-private/HLS/dicom/images/ddsm/benigns/patient0007/"
    catalog_path(spark, path)


def test_catalog_private_dbfs_private(spark):
    path = "dbfs:/mnt/databricks-datasets-private/HLS/dicom/images/ddsm/benigns/patient0007/"
    catalog_path(spark, path)


def test_catalog_save(spark):
    from dbx.pixels import Catalog

    catalog = Catalog(spark, table=TABLE, volume=VOLUME_UC)
    catalog_df = catalog.catalog(path=DICOM_FILE_PATH)
    assert catalog_df is not None
    assert catalog_df.count() == 4
    catalog.save(catalog_df)


def test_catalog_save_uc(spark):
    from dbx.pixels import Catalog

    catalog = Catalog(spark, table=TABLE, volume=VOLUME_UC)
    catalog_df = catalog.catalog(path=DICOM_FILE_PATH)
    assert catalog_df is not None
    assert catalog_df.count() == 4
    catalog.save(df=catalog_df, table=TABLE)


def test_catalog_save_dbfs(spark):
    from dbx.pixels import Catalog

    catalog = Catalog(spark, table=TABLE, volume=VOLUME_UC)
    catalog_df = catalog.catalog(path=DICOM_FILE_PATH)
    assert catalog_df is not None
    assert catalog_df.count() == 4
    catalog.save(df=catalog_df, path=f"/dbfs/tmp/{CATALOG}.{SCHEMA}.object_catalog")
