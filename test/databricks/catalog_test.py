from pyspark.sql import SparkSession
import pytest

@pytest.fixture
def spark() -> SparkSession:
  """  
  Create a SparkSession (the entry point to Spark functionality) on
  the cluster in the remote Databricks workspace. Unit tests do not
  have access to this SparkSession by default.
  """
  x = SparkSession.builder.appName("mymodule.pixels").getOrCreate()
  x.sparkContext.setJobGroup("mymodule.pixels.catalog","pytest")
  return x

def test_python_version(spark):
  import sys
  assert sys.version_info.major == 3
  assert sys.version_info.minor >= 8

def test_spark(spark):
  assert spark is not None
  assert type(spark) is SparkSession

def test_catalog_import(spark):
  from mymodule.pixels import Catalog
  from mymodule.pixels import version
  assert version.__version__ >= "0.0.6"
  
def test_catalog_init(spark):
  from mymodule.pixels import Catalog
  catalog = Catalog(spark=spark)
  assert(catalog is not None)
  assert catalog.is_anon

def catalog_path(spark, path):
  from mymodule.pixels import Catalog
  catalog = Catalog(spark)
  catalog_df = catalog.catalog(path=path)
  assert catalog_df is not None
  assert catalog_df.count() == 4
    
def test_catalog_public_s3(spark):
  path = "s3://hls-eng-data-public/dicom/ddsm/benigns/patient0007/"
  catalog_path(spark, path)

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
  from mymodule.pixels import Catalog
  catalog = Catalog(spark)
  catalog_df = catalog.catalog(path=path)
  assert catalog_df is not None
  assert catalog_df.count() == 4
  catalog.save(catalog_df)
  
def test_catalog_save_uc(spark):
  path = "s3://hls-eng-data-public/dicom/ddsm/benigns/patient0007/"
  from mymodule.pixels import Catalog
  catalog = Catalog(spark)
  catalog_df = catalog.catalog(path=path)
  assert catalog_df is not None
  assert catalog_df.count() == 4
  spark.sql("CREATE DATABASE IF NOT EXISTS main.pixels_solacc")
  catalog.save(df=catalog_df, table="main.pixels_solacc.object_catalog")
  
def test_catalog_save_dbfs(spark):
  path = "s3://hls-eng-data-public/dicom/ddsm/benigns/patient0007/"
  from mymodule.pixels import Catalog
  catalog = Catalog(spark)
  catalog_df = catalog.catalog(path=path)
  assert catalog_df is not None
  assert catalog_df.count() == 4
  spark.sql("CREATE DATABASE IF NOT EXISTS main.pixels_solacc")
  catalog.save(df=catalog_df, path="/dbfs/tmp/main.pixels_solacc.object_catalog")