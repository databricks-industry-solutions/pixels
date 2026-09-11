# Databricks notebook source
# /// script
# [tool.databricks.environment]
# environment_version = "5"
# ///
# DBTITLE 1,Benchmark: In-Memory vs Disk Zip Extraction
# MAGIC %md
# MAGIC # Benchmark: In-Memory vs Disk Zip Extraction
# MAGIC
# MAGIC Compares two zip-extraction strategies for the Pixels DICOM pipeline:
# MAGIC
# MAGIC 1. **In-memory** (`extractZipInMemory=True`) — extract zip entries in the Spark job; DICOM content stays in the DataFrame's `content` column.
# MAGIC 2. **Disk-first** (`extractZipToDisk=True`) — extract zip files to a UC Volume, write paths to an intermediate Delta table, then re-read for metadata extraction.
# MAGIC
# MAGIC **Test data:** 10 zip files × 5 synthetic DICOM files each = 50 DICOM files total.

# COMMAND ----------

# DBTITLE 1,Configuration
CATALOG = "main"
SCHEMA = "pixels_solacc_gitactions"
VOLUME_NAME = "pixels_volume_test"
VOLUME_UC = f"{CATALOG}.{SCHEMA}.{VOLUME_NAME}"
TABLE = f"{CATALOG}.{SCHEMA}.object_catalog_bench"
BASE_PATH = f"/Volumes/{CATALOG}/{SCHEMA}/{VOLUME_NAME}"
BENCH_ZIP_DIR = f"{BASE_PATH}/bench_zips"
UNZIP_DIR = f"{BASE_PATH}/bench_unzipped"
CHECKPOINT_DIR = f"{BASE_PATH}/bench_checkpoints"

NUM_ZIPS = 10
FILES_PER_ZIP = 5
IMAGE_SIZE = 128  # 128x128 pixel DICOM images

# COMMAND ----------

# DBTITLE 1,Setup: create schema, volume, and tables
spark.sql(f"CREATE SCHEMA IF NOT EXISTS {CATALOG}.{SCHEMA}")
spark.sql(f"CREATE VOLUME IF NOT EXISTS {VOLUME_UC}")
print(f"Schema: {CATALOG}.{SCHEMA}")
print(f"Volume: {VOLUME_UC}")
print(f"Zip dir: {BENCH_ZIP_DIR}")

# COMMAND ----------

# DBTITLE 1,Install worker dependencies
# MAGIC %pip install pydicom simplejson fsspec s3fs -q

# COMMAND ----------

# DBTITLE 1,Generate synthetic DICOM files and package into zips
import io
import os
import shutil
import zipfile

import numpy as np
import pydicom
from pydicom.dataset import Dataset, FileDataset
from pydicom.sequence import Sequence
from pydicom.uid import ExplicitVRLittleEndian, generate_uid


def create_synthetic_dicom(patient_id: str, study_idx: int, series_idx: int) -> bytes:
    """Create a minimal but valid DICOM file with pixel data."""
    file_meta = pydicom.Dataset()
    file_meta.MediaStorageSOPClassUID = "1.2.840.10008.5.1.4.1.1.2"  # CT
    file_meta.MediaStorageSOPInstanceUID = generate_uid()
    file_meta.TransferSyntaxUID = ExplicitVRLittleEndian

    ds = FileDataset("", {}, file_meta=file_meta, preamble=b"\x00" * 128)
    ds.is_little_endian = True
    ds.is_implicit_VR = False

    # Patient
    ds.PatientName = f"BENCH^Patient{patient_id}"
    ds.PatientID = patient_id
    ds.PatientBirthDate = "19800101"
    ds.PatientSex = "O"

    # Study
    ds.StudyInstanceUID = generate_uid()
    ds.StudyDate = "20250101"
    ds.StudyDescription = f"Benchmark Study {study_idx}"
    ds.Modality = "CT"
    ds.AccessionNumber = f"ACC{patient_id}{study_idx:03d}"

    # Series
    ds.SeriesInstanceUID = generate_uid()
    ds.SeriesNumber = series_idx
    ds.SeriesDescription = f"Series {series_idx}"

    # Instance
    ds.SOPClassUID = "1.2.840.10008.5.1.4.1.1.2"
    ds.SOPInstanceUID = generate_uid()
    ds.InstanceNumber = series_idx

    # Image pixel module — 128x128 16-bit grayscale
    ds.Rows = IMAGE_SIZE
    ds.Columns = IMAGE_SIZE
    ds.BitsAllocated = 16
    ds.BitsStored = 12
    ds.HighBit = 11
    ds.PixelRepresentation = 0
    ds.SamplesPerPixel = 1
    ds.PhotometricInterpretation = "MONOCHROME2"
    ds.RescaleIntercept = "0"
    ds.RescaleSlope = "1"
    pixels = np.random.randint(0, 4096, (IMAGE_SIZE, IMAGE_SIZE), dtype=np.uint16)
    ds.PixelData = pixels.tobytes()

    buf = io.BytesIO()
    ds.save_as(buf, write_like_original=False)
    return buf.getvalue()


import tempfile

# Clean previous run
if os.path.exists(BENCH_ZIP_DIR):
    shutil.rmtree(BENCH_ZIP_DIR)
os.makedirs(BENCH_ZIP_DIR, exist_ok=True)

# Generate zips locally first (UC Volume FS doesn't support seek required by zipfile),
# then copy to Volume.
with tempfile.TemporaryDirectory() as tmp_dir:
    for zip_idx in range(NUM_ZIPS):
        local_zip = os.path.join(tmp_dir, f"patient_{zip_idx:03d}.zip")
        with zipfile.ZipFile(local_zip, "w", zipfile.ZIP_DEFLATED) as zf:
            for file_idx in range(FILES_PER_ZIP):
                dcm_bytes = create_synthetic_dicom(
                    patient_id=f"P{zip_idx:03d}",
                    study_idx=zip_idx,
                    series_idx=file_idx,
                )
                zf.writestr(f"series_{file_idx:02d}.dcm", dcm_bytes)
        # Copy to Volume
        shutil.copy2(local_zip, BENCH_ZIP_DIR)

print(f"Created {NUM_ZIPS} zip files in {BENCH_ZIP_DIR}")
print(f"Total DICOM files: {NUM_ZIPS * FILES_PER_ZIP}")
print(f"Sample zip size: {os.path.getsize(os.path.join(BENCH_ZIP_DIR, 'patient_000.zip')):,} bytes")

# COMMAND ----------

# DBTITLE 1,Install pixels library
import subprocess, sys
repo = "/Workspace/Users/yong.liu@databricks.com/pixels-in-mem-zip"
subprocess.run(["git", "config", "--global", "--add", "safe.directory", repo], capture_output=True)
subprocess.run([sys.executable, "-m", "pip", "install", "-e", repo, "-q"], capture_output=True)

sys.path.insert(0, f"{repo}/src")
for key in list(sys.modules.keys()):
    if key.startswith("dbx") and key != "dbutils":
        del sys.modules[key]

from dbx.pixels import Catalog
from dbx.pixels.dicom import DicomMetaExtractor
print(f"Catalog: {Catalog}")
print(f"DicomMetaExtractor: {DicomMetaExtractor}")

# COMMAND ----------

# DBTITLE 1,Benchmark helper
import time
import shutil


def cleanup_bench_state():
    """Reset tables and folders between benchmark runs."""
    for suffix in ["", "_unzip"]:
        tbl = f"{TABLE}{suffix}"
        if spark.catalog.tableExists(tbl):
            spark.sql(f"DROP TABLE IF EXISTS {tbl}")
    for d in [UNZIP_DIR, CHECKPOINT_DIR]:
        if os.path.exists(d):
            shutil.rmtree(d)


def run_benchmark(mode: str) -> dict:
    """
    Run a full catalog → metadata extraction pipeline and return timing.
    mode: 'memory' or 'disk'
    """
    cleanup_bench_state()

    cat = Catalog(spark, table=TABLE, volume=VOLUME_UC)

    # ── Step 1: Catalog + zip extraction ──
    t0 = time.time()
    if mode == "memory":
        cat_df = cat.catalog(
            path=BENCH_ZIP_DIR,
            extractZipInMemory=True,
            pattern="*.zip",
        )
    elif mode == "disk":
        cat_df = cat.catalog(
            path=BENCH_ZIP_DIR,
            extractZipToDisk=True,
            extractZipBasePath=UNZIP_DIR,
            pattern="*.zip",
        )
    else:
        raise ValueError(f"Unknown mode: {mode}")
    t_catalog = time.time() - t0

    # ── Step 2: Metadata extraction ──
    t1 = time.time()
    extractor = DicomMetaExtractor(
        cat,
        inputCol="local_path",
        contentCol="content",
        outputCol="meta",
        basePath="dbfs:/",
        deep=False,
        useVariant=True,
        permissive=True,
    )
    # For in-memory mode, content column is present → DicomMetaExtractor reads from it.
    # For disk mode, content is absent → DicomMetaExtractor reads from local_path.
    meta_df = extractor.transform(cat_df)

    # Force materialization to measure real wall-clock time
    row_count = meta_df.count()
    t_meta = time.time() - t1

    t_total = time.time() - t0

    result = {
        "mode": mode,
        "rows": row_count,
        "catalog_sec": round(t_catalog, 2),
        "meta_sec": round(t_meta, 2),
        "total_sec": round(t_total, 2),
    }
    print(f"  [{mode:>6}]  rows={row_count}  catalog={t_catalog:.2f}s  meta={t_meta:.2f}s  total={t_total:.2f}s")
    return result

print("Benchmark helper ready")

# COMMAND ----------

# DBTITLE 1,Run benchmark: in-memory extraction
print("=" * 60)
print("Benchmark 1: extractZipInMemory=True")
print("=" * 60)
memory_result = run_benchmark("memory")

# COMMAND ----------

# DBTITLE 1,Run benchmark: disk extraction
print("=" * 60)
print("Benchmark 2: extractZipToDisk=True")
print("=" * 60)
disk_result = run_benchmark("disk")

# COMMAND ----------

# DBTITLE 1,Compare results
from pyspark.sql import Row

results = [memory_result, disk_result]
results_df = spark.createDataFrame([Row(**r) for r in results])
results_df.display()

# Speedup calculation
speedup = disk_result["total_sec"] / memory_result["total_sec"] if memory_result["total_sec"] > 0 else float("inf")

print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)
print(f"  Test data: {NUM_ZIPS} zips × {FILES_PER_ZIP} DICOM files = {NUM_ZIPS * FILES_PER_ZIP} total")
print(f"  Image size: {IMAGE_SIZE}×{IMAGE_SIZE} px, 16-bit")
print()
print(f"  In-memory total: {memory_result['total_sec']:.2f}s")
print(f"  Disk-first total: {disk_result['total_sec']:.2f}s")
print()
if speedup > 1:
    print(f"  → In-memory is {speedup:.1f}× faster than disk-first")
elif speedup < 1:
    print(f"  → Disk-first is {1/speedup:.1f}× faster than in-memory")
else:
    print(f"  → Both methods are equivalent")

# COMMAND ----------

# DBTITLE 1,Cleanup benchmark artifacts
cleanup_bench_state()
if os.path.exists(BENCH_ZIP_DIR):
    shutil.rmtree(BENCH_ZIP_DIR)
print("Benchmark artifacts cleaned up")

# Uncomment to also drop the test schema:
# spark.sql(f"DROP SCHEMA IF EXISTS {CATALOG}.{SCHEMA} CASCADE")