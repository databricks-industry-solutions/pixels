from pyspark.sql import SparkSession

from conftest import CHECKPOINT_BASE_PATH, DICOM_FILE_PATH, TABLE, VOLUME_UC
from dbx.pixels import Catalog


def test_catalog_stream(spark: SparkSession):
    catalog = Catalog(spark, table=TABLE, volume=VOLUME_UC)
    catalog_df = catalog.catalog(
        path=DICOM_FILE_PATH, streaming=True, streamCheckpointBasePath=CHECKPOINT_BASE_PATH
    )

    assert catalog_df is not None

    catalog.save(df=catalog_df)

    assert catalog.load().count() == 4
