"""
Configuration settings for test files.
This module contains common configuration values used across test files.
"""

# Catalog and Schema configuration
CATALOG = "main"
SCHEMA = "pixels_solacc_gitactions"

# Volume configuration
VOLUME_NAME = "pixels_volume_test"
VOLUME_UC = f"{CATALOG}.{SCHEMA}.{VOLUME_NAME}"

# Table configuration
TABLE = f"{CATALOG}.{SCHEMA}.object_catalog_test"

# Path configurations
BASE_PATH = f"/Volumes/{CATALOG}/{SCHEMA}/{VOLUME_NAME}/pixels_acc_test"
CHECKPOINT_BASE_PATH = f"{BASE_PATH}/checkpoints"
UNZIP_BASE_PATH = f"{BASE_PATH}/unzipped"

# Test data paths
ZIP_FILE_PATH = "s3://hls-eng-data-public/dicom/ddsm/benigns_21*zip"
DICOM_FILE_PATH = "s3://hls-eng-data-public/dicom/ddsm/benigns/patient0007/"

# Anonymization configuration
DEFAULT_FP_KEY = "00112233445566778899aabbccddeeff"
DEFAULT_FP_TWEAK = "a1b2c3d4e5f60708"
