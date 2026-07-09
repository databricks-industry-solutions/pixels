CATALOG = "ema_rina"
SCHEMA = "pixels_solacc_gitactions"

VOLUME_NAME = "pixels_volume_test"
VOLUME_UC = f"{CATALOG}.{SCHEMA}.{VOLUME_NAME}"

TABLE = f"{CATALOG}.{SCHEMA}.object_catalog_test"

BASE_PATH = f"/Volumes/{CATALOG}/{SCHEMA}/{VOLUME_NAME}/"
CHECKPOINT_BASE_PATH = f"{BASE_PATH}/checkpoints"
UNZIP_BASE_PATH = f"{BASE_PATH}/unzipped"

ZIP_FILE_PATH = "s3://hls-eng-data-public/dicom/ddsm/benigns_21*zip"
DICOM_FILE_PATH = "s3://hls-eng-data-public/dicom/ddsm/benigns/patient0007/"

DEFAULT_FP_KEY = "00112233445566778899aabbccddeeff"
