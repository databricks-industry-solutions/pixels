from pyspark.sql import SparkSession

from dbx.pixels import Catalog
from test_constants import (
    CHECKPOINT_BASE_PATH,
    TABLE,
    UNZIP_BASE_PATH,
    VOLUME_UC,
    ZIP_FILE_PATH,
)


def test_catalog_unzip(spark: SparkSession):
    catalog = Catalog(spark, table=TABLE, volume=VOLUME_UC)
    catalog_df = catalog.catalog(
        path=ZIP_FILE_PATH, extractZip=True, extractZipBasePath=UNZIP_BASE_PATH
    )

    assert catalog_df is not None

    catalog.save(df=catalog_df)

    assert catalog.load().count() == 30


def test_catalog_unzip_stream(spark: SparkSession):
    catalog = Catalog(spark, table=TABLE, volume=VOLUME_UC)
    catalog_df = catalog.catalog(
        path=ZIP_FILE_PATH,
        extractZip=True,
        extractZipBasePath=UNZIP_BASE_PATH,
        streaming=True,
        streamCheckpointBasePath=CHECKPOINT_BASE_PATH,
    )

    assert catalog_df is not None

    catalog.save(df=catalog_df)

    assert catalog.load().count() == 30
