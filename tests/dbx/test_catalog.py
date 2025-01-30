import pytest
from databricks.connect import DatabricksSession
from pyspark.sql import SparkSession
import os

from dbx.pixels.version import __version__

path = "s3://hls-eng-data-public/dicom/ddsm/benigns/patient0007/"


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


def test_catalog_import(spark):
    assert __version__ >= "0.0.6"


def test_path_read(spark):
    df = spark.read.format("binaryFile").load(path).drop("content")
    count = df.count()
    assert count == 4


def test_catalog_init(spark):
    from dbx.pixels import Catalog

    catalog = "main"
    schema = "main.pixels_solacc"
    volume = "main.pixels_solacc.pixels_volume"

    if spark.sql(f"show catalogs like '{catalog}'").count() == 0:
        spark.sql(f"create catalog if not exists {catalog}")

    if spark.sql(f"show databases in {catalog} like '{schema}'").count() == 0:
        spark.sql(f"create database if not exists {schema}")

    if spark.sql(f"show volumes in {schema} like '{volume}'").count() == 0:
        spark.sql(f"create volume if not exists {volume}")

    catalog = Catalog(spark=spark)
    assert catalog is not None
    assert catalog.is_anon


def catalog_path(spark, path):
    from dbx.pixels import Catalog

    catalog = Catalog(spark)
    catalog_df = catalog.catalog(path=path)
    assert catalog_df is not None
    assert catalog_df.count() == 4
    return catalog_df


def test_catalog_public_s3(spark, caplog):
    import logging

    logging.getLogger(__name__)
    caplog.set_level(logging.DEBUG)

    catalog_df = catalog_path(spark, path)
    assert len(catalog_df.columns) == 9
    row = catalog_df.collect()[0]
    assert row[0] == path + "0007.LEFT_MLO.dcm"
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
    path = "s3://hls-eng-data-public/dicom/ddsm/benigns/patient0007/"
    from dbx.pixels import Catalog

    catalog = Catalog(spark)
    catalog_df = catalog.catalog(path=path)
    assert catalog_df is not None
    assert catalog_df.count() == 4
    catalog.save(catalog_df)


def test_catalog_save_uc(spark):
    path = "s3://hls-eng-data-public/dicom/ddsm/benigns/patient0007/"
    from dbx.pixels import Catalog

    catalog = Catalog(spark)
    catalog_df = catalog.catalog(path=path)
    assert catalog_df is not None
    assert catalog_df.count() == 4
    catalog.save(df=catalog_df, table="main.pixels_solacc.object_catalog")


def test_catalog_save_dbfs(spark):
    path = "s3://hls-eng-data-public/dicom/ddsm/benigns/patient0007/"
    from dbx.pixels import Catalog

    catalog = Catalog(spark)
    catalog_df = catalog.catalog(path=path)
    assert catalog_df is not None
    assert catalog_df.count() == 4
    catalog.save(df=catalog_df, path="/dbfs/tmp/main.pixels_solacc.object_catalog")
