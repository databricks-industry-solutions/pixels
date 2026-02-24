"""
DICOM tag constants, VR (Value Representation) mappings, and DICOMweb JSON formatting.

Centralises all DICOM metadata knowledge so the rest of the codebase can work
with semantic column names while still producing spec-compliant DICOMweb JSON.
"""

import json
from typing import Any, Dict, List

# -------------------------------------------------------------------------
# DICOM tag ↔ keyword mappings
# -------------------------------------------------------------------------

DICOM_TAGS: Dict[str, str] = {
    # Patient level
    "00100010": "PatientName",
    "00100020": "PatientID",
    "00100030": "PatientBirthDate",
    "00100040": "PatientSex",
    # Study level
    "0020000D": "StudyInstanceUID",
    "00080020": "StudyDate",
    "00080030": "StudyTime",
    "00080050": "AccessionNumber",
    "00081030": "StudyDescription",
    "00080090": "ReferringPhysicianName",
    "00201206": "NumberOfStudyRelatedSeries",
    "00201208": "NumberOfStudyRelatedInstances",
    # Series level
    "0020000E": "SeriesInstanceUID",
    "00200011": "SeriesNumber",
    "00080060": "Modality",
    "00080061": "ModalitiesInStudy",
    "0008103E": "SeriesDescription",
    "00200013": "InstanceNumber",
    "00201209": "NumberOfSeriesRelatedInstances",
    "00080021": "SeriesDate",
    "00080031": "SeriesTime",
    # Instance level
    "00080018": "SOPInstanceUID",
    "00080016": "SOPClassUID",
    "00200032": "ImagePositionPatient",
    "00200037": "ImageOrientationPatient",
    "00280010": "Rows",
    "00280011": "Columns",
    "00280008": "NumberOfFrames",
    "00280100": "BitsAllocated",
    "00280101": "BitsStored",
    "00280102": "HighBit",
    "00280103": "PixelRepresentation",
}

TAG_TO_ID: Dict[str, str] = {v: k for k, v in DICOM_TAGS.items()}

# -------------------------------------------------------------------------
# Value Representation (VR) lookup
# -------------------------------------------------------------------------

_VR_MAP: Dict[str, str] = {
    "0020000D": "UI",
    "0020000E": "UI",
    "00080018": "UI",
    "00080016": "UI",
    "00100010": "PN",
    "00100020": "LO",
    "00100030": "DA",
    "00100040": "CS",
    "00080020": "DA",
    "00080021": "DA",
    "00080030": "TM",
    "00080031": "TM",
    "00080050": "SH",
    "00081030": "LO",
    "0008103E": "LO",
    "00080060": "CS",
    "00080061": "CS",
    "00200011": "IS",
    "00200013": "IS",
    "00280010": "US",
    "00280011": "US",
    "00280008": "IS",
}


def get_vr_for_tag(tag_id: str) -> str:
    """Return the VR for *tag_id*, defaulting to ``LO``."""
    return _VR_MAP.get(tag_id, "LO")


# -------------------------------------------------------------------------
# Value formatting
# -------------------------------------------------------------------------

def format_value(value: Any, vr: str) -> Any:
    """
    Format a raw database value according to its VR type.

    Returns a scalar or list suitable for the ``Value`` field in DICOMweb JSON.
    """
    if value is None:
        return []

    if isinstance(value, (list, tuple)):
        return [format_value(v, vr) for v in value]

    if isinstance(value, str) and value.startswith("["):
        try:
            parsed = json.loads(value)
            if isinstance(parsed, list):
                return [format_value(v, vr) for v in parsed]
        except json.JSONDecodeError:
            pass

    if vr in ("UI", "LO", "SH", "PN", "CS"):
        return str(value).strip()

    if vr in ("IS", "DS"):
        return str(value)

    if vr in ("US", "SS", "UL", "SL"):
        try:
            return int(value)
        except (ValueError, TypeError):
            return str(value)

    if vr in ("DA", "TM", "DT"):
        return str(value).strip()

    return str(value)


# -------------------------------------------------------------------------
# DICOMweb JSON response builder
# -------------------------------------------------------------------------

def format_dicomweb_response(
    results: List[List[Any]], columns: List[str]
) -> List[Dict]:
    """
    Convert SQL rows + column names into a DICOMweb-compliant JSON array.

    Each row becomes a dict keyed by DICOM tag IDs with ``vr`` / ``Value`` fields.
    Non-DICOM columns (e.g. ``path``, aggregate counts) are passed through as-is.
    """
    formatted: List[Dict] = []

    for row in results:
        item: Dict = {}
        for col_name, value in zip(columns, row):
            if value is None:
                continue

            tag_id = TAG_TO_ID.get(col_name)
            if tag_id:
                vr = get_vr_for_tag(tag_id)
                fv = format_value(value, vr)
                item[tag_id] = {
                    "vr": vr,
                    "Value": fv if isinstance(fv, list) else [fv],
                }
            else:
                item[col_name] = value
        formatted.append(item)

    return formatted


# -------------------------------------------------------------------------
# Transfer Syntax → MIME type mapping
# -------------------------------------------------------------------------

TRANSFER_SYNTAX_TO_MIME: Dict[str, str] = {
    "1.2.840.10008.1.2.4.80": "image/jls",   # JPEG-LS Lossless
    "1.2.840.10008.1.2.4.81": "image/jls",   # JPEG-LS Lossy
    "1.2.840.10008.1.2.4.90": "image/jp2",   # JPEG 2000 Lossless
    "1.2.840.10008.1.2.4.91": "image/jp2",   # JPEG 2000
    "1.2.840.10008.1.2.4.50": "image/jpeg",  # JPEG Baseline
    "1.2.840.10008.1.2.4.51": "image/jpeg",  # JPEG Extended
    "1.2.840.10008.1.2.4.57": "image/jpeg",  # JPEG Lossless NH
    "1.2.840.10008.1.2.4.70": "image/jpeg",  # JPEG Lossless
}

