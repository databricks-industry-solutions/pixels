import pytest
from pyspark.sql import SparkSession

from conftest import (
    CHECKPOINT_BASE_PATH,
    TABLE,
    UNZIP_BASE_PATH,
    VOLUME_UC,
    ZIP_FILE_PATH,
)
from dbx.pixels import Catalog


# ── Batch mode tests ─────────────────────────────────────────────────


def test_zip_skip_default(spark: SparkSession):
    """skipZip=True (default): zip files appear as single rows, not extracted."""
    catalog = Catalog(spark, table=TABLE, volume=VOLUME_UC)
    catalog_df = catalog.catalog(path=ZIP_FILE_PATH)

    assert catalog_df is not None
    # Should see the zip files themselves, not their contents
    assert catalog_df.count() > 0
    # content column is dropped by default
    assert "content" not in catalog_df.columns


def test_zip_disk_extraction(spark: SparkSession):
    """extractZipToDisk=True: extracts zip files to disk, processes extracted files."""
    catalog = Catalog(spark, table=TABLE, volume=VOLUME_UC)
    catalog_df = catalog.catalog(
        path=ZIP_FILE_PATH,
        extractZipToDisk=True,
        extractZipBasePath=UNZIP_BASE_PATH,
    )

    assert catalog_df is not None
    # content column should NOT be present in disk mode (files are on disk)
    assert "content" not in catalog_df.columns

    catalog.save(df=catalog_df)
    assert catalog.load().count() == 30


def test_zip_memory_extraction(spark: SparkSession):
    """extractZipInMemory=True: extracts zip files in memory, content column present."""
    catalog = Catalog(spark, table=TABLE, volume=VOLUME_UC)
    catalog_df = catalog.catalog(
        path=ZIP_FILE_PATH,
        extractZipInMemory=True,
    )

    assert catalog_df is not None
    # content column should be present in memory mode
    assert "content" in catalog_df.columns

    # Drop content before saving to avoid persisting large binary blobs
    catalog.save(df=catalog_df.drop("content"))
    assert catalog.load().count() == 30


def test_zip_mutually_exclusive_disk_and_memory(spark: SparkSession):
    """Setting extractZipToDisk and extractZipInMemory together should raise ValueError."""
    catalog = Catalog(spark, table=TABLE, volume=VOLUME_UC)
    with pytest.raises(ValueError, match="mutually exclusive"):
        catalog.catalog(
            path=ZIP_FILE_PATH,
            extractZipToDisk=True,
            extractZipInMemory=True,
        )


def test_zip_mutually_exclusive_skip_and_disk(spark: SparkSession):
    """Setting skipZip and extractZipToDisk together should raise ValueError."""
    catalog = Catalog(spark, table=TABLE, volume=VOLUME_UC)
    with pytest.raises(ValueError, match="mutually exclusive"):
        catalog.catalog(
            path=ZIP_FILE_PATH,
            skipZip=True,
            extractZipToDisk=True,
        )


def test_zip_mutually_exclusive_all_three(spark: SparkSession):
    """Setting all three zip flags should raise ValueError."""
    catalog = Catalog(spark, table=TABLE, volume=VOLUME_UC)
    with pytest.raises(ValueError, match="mutually exclusive"):
        catalog.catalog(
            path=ZIP_FILE_PATH,
            skipZip=True,
            extractZipToDisk=True,
            extractZipInMemory=True,
        )


# ── Streaming mode tests ─────────────────────────────────────────────


def test_zip_skip_streaming(spark: SparkSession):
    """skipZip=True in streaming: zip files appear as single rows."""
    catalog = Catalog(spark, table=TABLE, volume=VOLUME_UC)
    catalog_df = catalog.catalog(
        path=ZIP_FILE_PATH,
        streaming=True,
        streamCheckpointBasePath=CHECKPOINT_BASE_PATH,
    )

    assert catalog_df is not None
    assert catalog_df.isStreaming
    # content column is dropped by default
    assert "content" not in [field.name for field in catalog_df.schema.fields]


def test_zip_disk_streaming(spark: SparkSession):
    """extractZipToDisk=True in streaming: extracts to disk, processes files."""
    catalog = Catalog(spark, table=TABLE, volume=VOLUME_UC)
    catalog_df = catalog.catalog(
        path=ZIP_FILE_PATH,
        extractZipToDisk=True,
        extractZipBasePath=UNZIP_BASE_PATH,
        streaming=True,
        streamCheckpointBasePath=CHECKPOINT_BASE_PATH,
    )

    assert catalog_df is not None

    catalog.save(df=catalog_df)
    assert catalog.load().count() == 30


def test_zip_memory_streaming(spark: SparkSession):
    """extractZipInMemory=True in streaming: extracts in memory, content column present."""
    catalog = Catalog(spark, table=TABLE, volume=VOLUME_UC)
    catalog_df = catalog.catalog(
        path=ZIP_FILE_PATH,
        extractZipInMemory=True,
        streaming=True,
        streamCheckpointBasePath=CHECKPOINT_BASE_PATH,
    )

    assert catalog_df is not None

    # Drop content before saving to avoid persisting large binary blobs
    catalog.save(df=catalog_df.drop("content"))
    assert catalog.load().count() == 30
