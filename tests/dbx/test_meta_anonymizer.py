from pyspark.sql import SparkSession

from conftest import (
    DEFAULT_FP_KEY,
    DEFAULT_FP_TWEAK,
    TABLE,
    UNZIP_BASE_PATH,
    VOLUME_UC,
    ZIP_FILE_PATH
)
from dbx.pixels import Catalog
from dbx.pixels.dicom.dicom_anonymizer_extractor import DicomAnonymizerExtractor


def test_meta_anonym(spark: SparkSession):
    catalog = Catalog(spark, table=TABLE, volume=VOLUME_UC)
    catalog_df = catalog.catalog(
        path=ZIP_FILE_PATH, extractZip=True, extractZipBasePath=UNZIP_BASE_PATH
    )

    assert catalog_df is not None

    metadata_df = DicomAnonymizerExtractor(
        catalog, anonym_mode="METADATA", fp_key=DEFAULT_FP_KEY, fp_tweak=DEFAULT_FP_TWEAK
    ).transform(catalog_df)
    catalog.save(metadata_df)

    assert catalog.load().count() == 30
    assert (
        catalog.load().limit(1).selectExpr('meta:["00120063"].Value[0]').collect()[0][0]
        == "DICOGNITO"
    )
