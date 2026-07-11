"""PHI tag classification for standard TIFF / BigTIFF / OME-TIFF / Aperio TIFF files.

Covers baseline TIFF tags (TIFF 6.0 spec) and common EXIF tags by their
string name as returned by tifffile (e.g. ``"Artist"``, ``"DateTime"``).

Classification tiers
--------------------
PHI          — Directly identifies a patient or operator.
QUESTIONABLE — May contain PHI depending on site configuration.
NOT_PHI      — Pure scanner / geometry / technical parameters.

Public API
----------
    classify_tag(key)                -> str
    classify_tags(properties: dict)  -> list[dict]
"""

from __future__ import annotations

# ---------------------------------------------------------------------------
# PHI: Directly identifies a person
# ---------------------------------------------------------------------------
PHI_TAGS: set[str] = {
    # Baseline TIFF 6.0
    "Artist",            # tag 315 — person who created the image
    "HostComputer",      # tag 316 — workstation/operator ID
    # Aperio SVS ImageDescription pipe-delimited sub-keys
    "Patient",
    "PatientID",
    "DOB",
    "MRN",
    "AccessionNumber",
    "ClinicID",
    "ClinicalTrialID",
    "Procedure",
    "Diagnosis",
    "Id",
}

# ---------------------------------------------------------------------------
# QUESTIONABLE: May contain PHI depending on site / scanner configuration
# ---------------------------------------------------------------------------
QUESTIONABLE_TAGS: set[str] = {
    # Baseline TIFF 6.0 — free-text / timestamp fields
    "ImageDescription",  # tag 270 — free-text; may embed patient info (Aperio, OME)
    "DateTime",          # tag 306 — image creation timestamp
    "Copyright",         # tag 33432 — may contain operator/institution name
    # EXIF timestamps
    "DateTimeOriginal",  # EXIF 36867
    "DateTimeDigitized", # EXIF 36868
    # Aperio SVS ImageDescription sub-keys
    "Date",
    "Time",
    "Clinic",
    "Pathologist",
    "Title",
    "Filename",
    "User",
    "ImageID",
}

# ---------------------------------------------------------------------------
# LARGE_TAGS: Binary / array tags that should be skipped or truncated during
# metadata extraction — their values are large byte blobs or offset arrays
# that add no textual metadata value and bloat the JSON output.
# ---------------------------------------------------------------------------
LARGE_TAGS: set[str] = {
    # JPEG / compression tables
    "JPEGTables",           # tag 347  — JPEG quantisation + Huffman tables (binary)
    "JPEGQTables",          # tag 519  — old-style JPEG quantisation tables
    "JPEGDCTables",         # tag 520  — old-style DC Huffman tables
    "JPEGACTables",         # tag 521  — old-style AC Huffman tables
    # Tile / strip index arrays (one entry per tile/strip — can be millions of entries)
    "TileOffsets",          # tag 324  — byte offset of every tile in the file
    "TileByteCounts",       # tag 325  — byte length of every tile
    "StripOffsets",         # tag 273  — byte offset of every strip
    "StripByteCounts",      # tag 279  — byte length of every strip
    # Colour / profile data
    "ICCProfile",           # tag 34675 — ICC colour profile (often 400 B – 4 MB)
    "ColorMap",             # tag 320  — RGB palette for indexed-colour images
    "TransferFunction",     # tag 301  — transfer function curves
    "ReferenceBlackWhite",  # tag 532  — reference black/white for YCbCr
    # Embedded metadata blobs
    "XMP",                  # tag 700  — XMP metadata XML (can be 10s of KB)
    "IPTCNAA",              # tag 33723 — IPTC/NAA metadata record
    "Photoshop",            # tag 34377 — Photoshop ImageResources block
    "ExifIFD",              # tag 34665 — embedded EXIF IFD offset array
    # GeoTIFF arrays
    "GeoKeyDirectoryTag",   # tag 34736 — GeoTIFF key directory
    "GeoDoubleParamsTag",   # tag 34736 — GeoTIFF double params
    "GeoAsciiParamsTag",    # tag 34737 — GeoTIFF ASCII params
    # WSI / scanning
    "ImageDepth",           # tag 32997 — depth offset array in some WSI formats
    "SubIFDs",              # tag 330  — sub-IFD offset array (pyramid levels)
}

# ---------------------------------------------------------------------------
# NOT_PHI: Scanner geometry / technical parameters (not exhaustive)
# ---------------------------------------------------------------------------
NOT_PHI_TAGS: set[str] = {
    "ImageWidth",
    "ImageLength",
    "BitsPerSample",
    "Compression",
    "PhotometricInterpretation",
    "StripOffsets",
    "SamplesPerPixel",
    "RowsPerStrip",
    "StripByteCounts",
    "XResolution",
    "YResolution",
    "PlanarConfiguration",
    "ResolutionUnit",
    "Software",          # tag 305 — scanner software version (NOT PHI)
    "Make",              # tag 271 — scanner manufacturer
    "Model",             # tag 272 — scanner model
    "TileWidth",
    "TileLength",
    "TileOffsets",
    "TileByteCounts",
    "NewSubfileType",
    "SubfileType",
    "Orientation",
    "ExtraSamples",
    "SampleFormat",
    "JPEGTables",
    "YCbCrSubSampling",
    "ReferenceBlackWhite",
    "ColorMap",
    "GrayResponseUnit",
    "GrayResponseCurve",
    # Aperio / OpenSlide technical
    "AppMag",
    "MPP",
    "ScanScope ID",
    "StripeWidth",
    "Parmset",
    "Filtered",
    "ICC Profile",
}


def classify_tag(key: str) -> str:
    """Classify a single TIFF tag name.

    Returns one of: ``'PHI'``, ``'QUESTIONABLE'``, ``'NOT_PHI'``.
    Tags not in any lookup default to ``'NOT_PHI'``.
    """
    if key in PHI_TAGS:
        return "PHI"
    if key in QUESTIONABLE_TAGS:
        return "QUESTIONABLE"
    return "NOT_PHI"


def classify_tags(properties: dict) -> list[dict]:
    """Classify all TIFF tag keys and return the structured PHI report.

    Args:
        properties: Dict mapping TIFF tag name (str) -> value (str).

    Returns:
        List of ``{"tag": key, "value": val, "classification": cls}`` dicts.
        Only PHI and QUESTIONABLE entries are included (NOT_PHI omitted).
    """
    report = []
    for key, value in properties.items():
        cls = classify_tag(key)
        if cls in ("PHI", "QUESTIONABLE"):
            report.append({"tag": key, "value": str(value), "classification": cls})
    return report
