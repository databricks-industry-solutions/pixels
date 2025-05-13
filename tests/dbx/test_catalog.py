from dbx.pixels.version import __version__
from .configs import CATALOG, DICOM_FILE_PATH, SCHEMA, TABLE, VOLUME_UC


def test_catalog_import(spark):
    assert __version__ >= "0.0.6"


def test_path_read(spark):
    df = spark.read.format("binaryFile").load(DICOM_FILE_PATH).drop("content")
    count = df.count()
    assert count == 4


def test_catalog_init(spark):
    from dbx.pixels import Catalog

    if spark.sql(f"show catalogs like '{CATALOG}'").count() == 0:
        spark.sql(f"create catalog if not exists {CATALOG}")

    if spark.sql(f"show databases in {CATALOG} like '{SCHEMA}'").count() == 0:
        spark.sql(f"create database if not exists {SCHEMA}")

    if spark.sql(f"show volumes in {SCHEMA} like '{VOLUME_UC}'").count() == 0:
        spark.sql(f"create volume if not exists {VOLUME_UC}")

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
    catalog.save(df=catalog_df, table=f"{CATALOG}.{SCHEMA}.object_catalog")


def test_catalog_save_dbfs(spark):
    from dbx.pixels import Catalog

    catalog = Catalog(spark, table=TABLE, volume=VOLUME_UC)
    catalog_df = catalog.catalog(path=DICOM_FILE_PATH)
    assert catalog_df is not None
    assert catalog_df.count() == 4
    catalog.save(df=catalog_df, path=f"/dbfs/tmp/{CATALOG}.{SCHEMA}.object_catalog")
