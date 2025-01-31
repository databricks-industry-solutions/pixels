import pytest
from databricks.sdk.core import DatabricksError
from databricks.sdk.runtime import dbutils
from pyspark.sql import SparkSession

from dbx.pixels import Catalog
from dbx.pixels.dicom.dicom_anonymizer_extractor import DicomAnonymizerExtractor

FILE_PATH = "s3://hls-eng-data-public/dicom/ddsm/benigns_21*zip"
TABLE = "main.pixels_solacc.object_catalog_test_anonym"
VOLUME = f"main.pixels_solacc.pixels_volume_test"
BASE_PATH = f"/Volumes/main/pixels_solacc/pixels_volume_test/pixels_acc_test"
CHECKPOINT_BASE_PATH = f"{BASE_PATH}/checkpoints"
UNZIP_BASE_PATH = f"{BASE_PATH}/unzipped"
ANONYM_BASE_PATH = f"{BASE_PATH}/anonymized"


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
    spark.sql(f"DROP TABLE IF EXISTS {TABLE}_autoseg_result")


def test_meta_anonym(spark: SparkSession):
    fp_key = "2DE79D232DF5585D68CE47882AE256D6"
    tweak = "CBD09280979564"

    catalog = Catalog(spark, table=TABLE, volume=VOLUME)
    catalog_df = catalog.catalog(
        path=FILE_PATH, extractZip=True, extractZipBasePath=UNZIP_BASE_PATH
    )

    assert catalog_df is not None

    metadata_df = DicomAnonymizerExtractor(
        catalog, anonym_mode="METADATA", fp_key=fp_key, tweak=tweak
    ).transform(catalog_df)
    catalog.save(metadata_df)

    assert catalog.load().count() == 30
    assert (
        catalog.load().limit(1).selectExpr('meta:["00120063"].Value[0]').collect()[0][0]
        == "DICOGNITO"
    )
