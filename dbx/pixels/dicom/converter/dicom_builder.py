"""Low-level helper that converts a single image file into a DICOM file.

This module is intentionally *Spark-free* so that it can be imported inside
UDFs executed on workers.  All Spark-specific orchestration lives in
:mod:`~dbx.pixels.dicom.converter.image_to_dicom_transformer`.
"""

from __future__ import annotations

import datetime
import logging
import os
from typing import Any, Dict, Tuple

import numpy as np
from PIL import Image

from pydicom.dataset import Dataset, FileDataset, FileMetaDataset
from pydicom.uid import (
    ExplicitVRLittleEndian,
    SecondaryCaptureImageStorage,
    generate_uid,
)

from dbx.pixels.dicom.converter.metadata import apply_metadata_section

logger = logging.getLogger(__name__)

# Supported image extensions (lower-case, with leading dot)
SUPPORTED_EXTENSIONS = frozenset(
    {".png", ".jpg", ".jpeg", ".tif", ".tiff", ".bmp", ".gif", ".webp"}
)


# ────────────────────────────────────────────────────────────────────────────
# Helpers
# ────────────────────────────────────────────────────────────────────────────

def _file_datetime(filepath: str) -> Tuple[str, str]:
    """Return ``(DICOM date, DICOM time)`` derived from a file's mtime."""
    try:
        ts = os.path.getmtime(filepath)
    except OSError:
        ts = datetime.datetime.now().timestamp()
    dt = datetime.datetime.fromtimestamp(ts)
    return dt.strftime("%Y%m%d"), dt.strftime("%H%M%S.%f")


def _read_image(path: str):
    """Open an image and normalise it to a NumPy array + pixel parameters.

    Returns
    -------
    tuple
        ``(img_array, photometric, samples_per_pixel,
          bits_allocated, bits_stored, high_bit)``
    """
    img = Image.open(path)

    # ── Grayscale ──────────────────────────────────────────────────────
    if img.mode in ("L", "I"):
        return (
            np.array(img, dtype=np.uint8),
            "MONOCHROME2", 1, 8, 8, 7,
        )

    if img.mode == "I;16":
        return (
            np.array(img, dtype=np.uint16),
            "MONOCHROME2", 1, 16, 16, 15,
        )

    # ── RGB ────────────────────────────────────────────────────────────
    if img.mode == "RGB":
        return (
            np.array(img, dtype=np.uint8),
            "RGB", 3, 8, 8, 7,
        )

    # ── RGBA / Palette / Binary / others → convert to RGB ─────────────
    if img.mode in ("RGBA", "P", "PA", "LA"):
        img = img.convert("RGB")
        return (
            np.array(img, dtype=np.uint8),
            "RGB", 3, 8, 8, 7,
        )

    if img.mode == "1":  # binary
        img = img.convert("L")
        return (
            np.array(img, dtype=np.uint8),
            "MONOCHROME2", 1, 8, 8, 7,
        )

    # Fallback
    img = img.convert("RGB")
    return (
        np.array(img, dtype=np.uint8),
        "RGB", 3, 8, 8, 7,
    )


# ────────────────────────────────────────────────────────────────────────────
# Public API
# ────────────────────────────────────────────────────────────────────────────

def build_dicom(
    image_path: str,
    output_dir: str,
    meta: Dict[str, Dict[str, Any]],
    study_instance_uid: str,
    series_instance_uid: str,
    instance_number: int,
) -> str:
    """Convert a single image file into a DICOM Secondary Capture file.

    Parameters
    ----------
    image_path : str
        Path to the source image (PNG, JPEG, …).
    output_dir : str
        Directory where the ``.dcm`` file will be written.
    meta : dict
        Merged metadata dictionary with sections ``patient``, ``study``,
        ``series``, ``equipment``, ``instance``
        (see :func:`~dbx.pixels.dicom.converter.metadata.load_metadata`).
    study_instance_uid : str
        ``StudyInstanceUID`` shared across all series in the conversion run.
    series_instance_uid : str
        ``SeriesInstanceUID`` shared by all images in the same folder.
    instance_number : int
        1-based instance number within the series.

    Returns
    -------
    str
        Absolute path to the written DICOM file.
    """
    # ── Read image ─────────────────────────────────────────────────────
    (
        img_array,
        photometric,
        samples_per_pixel,
        bits_allocated,
        bits_stored,
        high_bit,
    ) = _read_image(image_path)

    rows, cols = img_array.shape[:2]

    # ── DICOM File Meta Information ────────────────────────────────────
    file_meta = FileMetaDataset()
    file_meta.FileMetaInformationGroupLength = 0  # recalculated on save
    file_meta.FileMetaInformationVersion = b"\x00\x01"
    file_meta.MediaStorageSOPClassUID = SecondaryCaptureImageStorage

    sop_instance_uid = generate_uid()
    file_meta.MediaStorageSOPInstanceUID = sop_instance_uid
    file_meta.TransferSyntaxUID = ExplicitVRLittleEndian
    file_meta.ImplementationClassUID = generate_uid()
    file_meta.ImplementationVersionName = "PIXELS_IMG2DCM"

    # ── Build Dataset ──────────────────────────────────────────────────
    dcm_filename = os.path.splitext(os.path.basename(image_path))[0] + ".dcm"
    dcm_path = os.path.join(output_dir, dcm_filename)

    ds = FileDataset(
        dcm_path, {}, file_meta=file_meta, preamble=b"\x00" * 128
    )

    # SOP Common Module
    ds.SOPClassUID = SecondaryCaptureImageStorage
    ds.SOPInstanceUID = sop_instance_uid
    ds.SpecificCharacterSet = "ISO_IR 100"

    # Patient Module
    apply_metadata_section(ds, meta.get("patient", {}))

    # Study Module
    ds.StudyInstanceUID = study_instance_uid
    apply_metadata_section(ds, meta.get("study", {}))

    # Series Module
    ds.SeriesInstanceUID = series_instance_uid
    apply_metadata_section(ds, meta.get("series", {}))

    # Equipment Module
    apply_metadata_section(ds, meta.get("equipment", {}))

    # General Image Module
    ds.InstanceNumber = instance_number
    ds.ImageType = ["DERIVED", "SECONDARY"]

    # SC Equipment Module — ConversionType is required
    ds.ConversionType = meta.get("instance", {}).get("ConversionType", "WSD")

    # Instance-level defaults
    apply_metadata_section(ds, meta.get("instance", {}))

    # ── Dates — fall back to file modification time ────────────────────
    file_date, file_time = _file_datetime(image_path)
    if not getattr(ds, "StudyDate", None):
        ds.StudyDate = file_date
    if not getattr(ds, "StudyTime", None):
        ds.StudyTime = file_time
    if not getattr(ds, "SeriesDate", None):
        ds.SeriesDate = file_date
    if not getattr(ds, "SeriesTime", None):
        ds.SeriesTime = file_time
    ds.ContentDate = file_date
    ds.ContentTime = file_time
    ds.AcquisitionDate = file_date
    ds.AcquisitionTime = file_time

    # Store original filename for traceability
    ds.ImageComments = f"Converted from {os.path.basename(image_path)}"

    # ── Image Pixel Module ─────────────────────────────────────────────
    ds.SamplesPerPixel = samples_per_pixel
    ds.PhotometricInterpretation = photometric
    ds.Rows = rows
    ds.Columns = cols
    ds.BitsAllocated = bits_allocated
    ds.BitsStored = bits_stored
    ds.HighBit = high_bit
    ds.PixelRepresentation = 0  # unsigned integer
    if samples_per_pixel == 3:
        ds.PlanarConfiguration = 0  # colour-by-pixel (R1G1B1 R2G2B2 …)

    # Pixel Data
    ds.PixelData = img_array.tobytes()
    ds["PixelData"].VR = "OW" if bits_allocated > 8 else "OB"

    # Transfer syntax flags (required for save_as)
    ds.is_little_endian = True
    ds.is_implicit_VR = False

    # ── Write ──────────────────────────────────────────────────────────
    os.makedirs(output_dir, exist_ok=True)
    ds.save_as(dcm_path, write_like_original=False)

    logger.info(
        "Converted %s → %s  (%d×%d, %s)",
        os.path.basename(image_path),
        dcm_filename,
        cols,
        rows,
        photometric,
    )
    return dcm_path

