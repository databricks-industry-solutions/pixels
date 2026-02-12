"""Default DICOM metadata and helpers for the Image → DICOM converter.

This module defines:

* **DEFAULT_METADATA** — sensible fall-back values organised by DICOM module
  (patient, study, series, equipment, instance).
* **load_metadata()** — reads an optional user-provided JSON file and merges
  it with the defaults so that every required DICOM attribute has a value.
* **METADATA_TEMPLATE** — a reference JSON string that users can write to a
  file and customise.

The JSON schema groups tags by their DICOM module for clarity::

    {
      "patient":   { "PatientName": "…", … },
      "study":     { "StudyDescription": "…", … },
      "series":    { "SeriesDescription": "…", … },
      "equipment": { "Manufacturer": "…", … },
      "instance":  { "ConversionType": "…", … }
    }
"""

from __future__ import annotations

import copy
import json
import logging
import os
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)

# ────────────────────────────────────────────────────────────────────────────
# Default metadata values
# ────────────────────────────────────────────────────────────────────────────

DEFAULT_METADATA: Dict[str, Dict[str, Any]] = {
    "patient": {
        "PatientName": "Anonymous",
        "PatientID": "ANON000001",
        "PatientBirthDate": "",
        "PatientSex": "",
        "PatientAge": "",
        "PatientWeight": "",
    },
    "study": {
        "StudyDescription": "Converted from images",
        "StudyDate": "",
        "StudyTime": "",
        "AccessionNumber": "",
        "ReferringPhysicianName": "",
        "InstitutionName": "Databricks Pixels",
        "InstitutionalDepartmentName": "",
    },
    "series": {
        "SeriesDescription": "Image Series",
        "SeriesDate": "",
        "SeriesTime": "",
        "Modality": "OT",
        "BodyPartExamined": "",
        "SeriesNumber": 1,
        "OperatorsName": "",
        "ProtocolName": "Image Import",
    },
    "equipment": {
        "Manufacturer": "Databricks Pixels",
        "ManufacturerModelName": "ImageToDICOM",
        "SoftwareVersions": "1.0",
        "DeviceSerialNumber": "0",
    },
    "instance": {
        "ContentDescription": "Converted from standard image format",
        "ContentCreatorName": "Databricks Pixels",
        "BurnedInAnnotation": "NO",
        "RecognizableVisualFeatures": "YES",
        "LossyImageCompression": "00",
        "ConversionType": "WSD",
    },
}

# ────────────────────────────────────────────────────────────────────────────
# Template (serialisable to JSON for users)
# ────────────────────────────────────────────────────────────────────────────

METADATA_TEMPLATE: str = json.dumps(DEFAULT_METADATA, indent=2)
"""JSON string that can be written to a file as a starting-point template."""


# ────────────────────────────────────────────────────────────────────────────
# Loader
# ────────────────────────────────────────────────────────────────────────────

def load_metadata(json_path: Optional[str] = None) -> Dict[str, Dict[str, Any]]:
    """Return a merged metadata dictionary.

    If *json_path* is provided and the file exists, its contents are merged
    with :data:`DEFAULT_METADATA` — user-supplied non-empty values override
    the defaults.  If no path is given (or the file does not exist) the
    plain defaults are returned.

    Parameters
    ----------
    json_path : str, optional
        Path to a JSON metadata file (see :data:`METADATA_TEMPLATE` for the
        expected schema).

    Returns
    -------
    dict
        Merged metadata dictionary with sections ``patient``, ``study``,
        ``series``, ``equipment``, ``instance``.
    """
    merged = copy.deepcopy(DEFAULT_METADATA)

    if not json_path:
        logger.info("No metadata JSON path provided — using defaults")
        return merged

    if not os.path.exists(json_path):
        logger.warning("Metadata JSON not found at %s — using defaults", json_path)
        return merged

    logger.info("Loading metadata from %s", json_path)
    with open(json_path, "r") as fh:
        user_meta: dict = json.load(fh)

    # Merge section by section; only override with non-empty values
    for section_name, defaults in merged.items():
        user_section = user_meta.get(section_name, {})
        if not isinstance(user_section, dict):
            continue
        for key, value in user_section.items():
            if value not in (None, ""):
                defaults[key] = value

    return merged


def apply_metadata_section(ds, section: Dict[str, Any]) -> None:
    """Set attributes on a pydicom :class:`Dataset` from a flat *section* dict.

    Keys that start with ``_`` (e.g. ``_comment``) and values that are
    ``None`` or ``""`` are silently skipped.

    Parameters
    ----------
    ds : pydicom.dataset.Dataset
        Target DICOM dataset.
    section : dict
        ``{DicomTagKeyword: value}`` mapping.
    """
    for tag_name, value in section.items():
        if tag_name.startswith("_"):
            continue
        if value in (None, ""):
            continue
        setattr(ds, tag_name, value)

