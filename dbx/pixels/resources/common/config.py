"""
Shared configuration helpers for Pixels applications.

Provides request-scoped helpers for reading the active pixels table,
segmentation destination directory, and a structured logging helper
that enriches messages with the current user's e-mail.
"""

import os
from pathlib import Path

from databricks.sdk.core import Config

import dbx.pixels
from dbx.pixels.logging import LoggerProvider

# ---------------------------------------------------------------------------
# Logger
# ---------------------------------------------------------------------------
logger = LoggerProvider("OHIF")

# ---------------------------------------------------------------------------
# Databricks SDK config (reads DATABRICKS_HOST / DATABRICKS_TOKEN from env)
# ---------------------------------------------------------------------------
cfg = Config()

# ---------------------------------------------------------------------------
# Path constants
# ---------------------------------------------------------------------------
pixels_pkg_path: Path = Path(dbx.pixels.__file__).parent
ohif_path: str = str(pixels_pkg_path / "resources" / "ohif")
ohif_config_file: str = "app-config"  # name of the JS config template (without .js)

# ---------------------------------------------------------------------------
# MONAI / ML helpers
# ---------------------------------------------------------------------------
MONAI_DATASETS = ["SmartCacheDataset", "CacheDataset", "PersistentDataset", "Dataset"]
MONAI_DATALOADERS = ["ThreadDataLoader", "DataLoader"]
MONAI_TRACKING = ["mlflow", ""]


def get_monai_endpoint() -> str:
    """Return the MONAI serving-endpoint name (empty string if not set)."""
    return os.environ.get("MONAI_SERVING_ENDPOINT", "")


def get_warehouse_id() -> str:
    """Return the Databricks SQL Warehouse ID (asserts if unset)."""
    wid = os.getenv("DATABRICKS_WAREHOUSE_ID", None)
    assert wid is not None, "[DATABRICKS_WAREHOUSE_ID] is not set, check app.yml"
    return wid


# ---------------------------------------------------------------------------
# Request-scoped helpers
# ---------------------------------------------------------------------------

def get_pixels_table(request) -> str:
    """Return the active pixels table from the cookie or environment."""
    if request.cookies.get("pixels_table"):
        return request.cookies.get("pixels_table")
    return os.environ["DATABRICKS_PIXELS_TABLE"]


def get_seg_dest_dir(request) -> str:
    """Return the segmentation destination directory from the cookie or environment."""
    if request.cookies.get("seg_dest_dir"):
        return request.cookies.get("seg_dest_dir")
    parts = get_pixels_table(request).split(".")
    return f"/Volumes/{parts[0]}/{parts[1]}/pixels_volume/ohif/exports/"


def log(message, request, log_type="info"):
    """Structured log helper that prepends the user e-mail."""
    email = ""
    if request:
        email = request.headers.get("X-Forwarded-Email", "")

    if log_type == "error":
        logger.error(f"{email} | {message}")
    elif log_type == "debug":
        logger.debug(f"{email} | {message}")
    else:
        logger.info(f"{email} | {message}")

