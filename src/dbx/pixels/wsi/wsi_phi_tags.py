"""PHI tag classification for Whole Slide Images (all OpenSlide-supported formats).

Unified classification covering vendor-specific metadata properties from:
- Aperio SVS (openslide.vendor = "aperio")
- Hamamatsu NDPI/VMS/VMU (openslide.vendor = "hamamatsu")
- Leica SCN (openslide.vendor = "leica")
- MIRAX MRXS (openslide.vendor = "mirax")
- Philips TIFF (openslide.vendor = "philips")
- Sakura SVSLIDE (openslide.vendor = "sakura")
- Trestle TIF (openslide.vendor = "trestle")
- Ventana BIF/TIF (openslide.vendor = "ventana")
- Generic TIFF (openslide.vendor = "generic-tiff")
- Standard TIFF tags (via tifffile fallback)

Classification tiers
--------------------
PHI          — Directly identifies a patient or operator.
QUESTIONABLE — May contain PHI depending on site configuration.
NOT_PHI      — Pure scanner / geometry / technical parameters.

Public API
----------
    classify_tag(key)                -> str
    classify_tags(properties: dict)  -> list[dict]
    scrub_image_description(desc)    -> str
    SUPPORTED_EXTENSIONS             -> set[str]
    OPENSLIDE_PATTERNS               -> list[str]
"""

from __future__ import annotations

# ---------------------------------------------------------------------------
# Supported WSI file extensions (OpenSlide + tifffile fallback)
# ---------------------------------------------------------------------------
SUPPORTED_EXTENSIONS: set[str] = {
    ".svs",       # Aperio
    ".tif",       # Generic TIFF, Trestle, Ventana
    ".tiff",      # Generic TIFF, Philips
    ".bif",       # Ventana
    ".ndpi",      # Hamamatsu
    ".mrxs",      # MIRAX (index file)
    ".vms",       # Hamamatsu (virtual microscope slide)
    ".vmu",       # Hamamatsu (virtual microscope uncompressed)
    ".scn",       # Leica
    ".svslide",   # Sakura
    ".dcm",       # DICOM WSI
}

# Glob patterns for use with Spark binaryFile reader or Catalog.catalog()
OPENSLIDE_PATTERNS: list[str] = [
    "*.svs", "*.tif", "*.tiff", "*.bif", "*.ndpi",
    "*.mrxs", "*.vms", "*.vmu", "*.scn", "*.svslide",
]

# ---------------------------------------------------------------------------
# PHI: Directly identifies a person (any vendor)
# ---------------------------------------------------------------------------
PHI_TAGS: set[str] = {
    # --- Aperio SVS ---
    "aperio.Patient",
    "aperio.PatientID",
    "aperio.DOB",
    "aperio.MRN",
    "aperio.AccessionNumber",
    "aperio.ClinicID",
    "aperio.ClinicalTrialID",
    "aperio.Procedure",
    "aperio.Diagnosis",
    "aperio.Id",
    # Aperio short-key variants (from ImageDescription pipe section)
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
    # --- Hamamatsu NDPI ---
    "hamamatsu.SourceLens",       # Operator-configured; may encode tech ID
    "hamamatsu.Reference",        # Patient/case reference
    # --- Leica SCN ---
    "leica.device-model",         # Sometimes contains operator info
    # --- Philips ---
    "philips.PIM_DP_UFS_BARCODE", # Barcode text (patient label)
    # --- Sakura ---
    "sakura.NominalLensMagnification",  # Technical, but barcode fields below
    # --- Generic TIFF tags (from tifffile) ---
    "Artist",            # tag 315 — person who created the image
    "HostComputer",      # tag 316 — workstation/operator ID
}

# ---------------------------------------------------------------------------
# QUESTIONABLE: May contain PHI depending on site configuration
# ---------------------------------------------------------------------------
QUESTIONABLE_TAGS: set[str] = {
    # --- Aperio ---
    "aperio.Date",
    "aperio.Time",
    "aperio.Clinic",
    "aperio.Pathologist",
    "aperio.Title",
    "aperio.Filename",
    "aperio.User",
    "aperio.ImageID",
    # Aperio short-key variants
    "Date",
    "Time",
    "Clinic",
    "Pathologist",
    "Title",
    "Filename",
    "User",
    "ImageID",
    # --- Hamamatsu ---
    "hamamatsu.Created",          # Scan timestamp
    "hamamatsu.Updated",          # Modification timestamp
    # --- Leica ---
    "leica.creation-date",
    "leica.device-version",
    # --- Philips ---
    "philips.DICOM_ACQUISITION_DATETIME",
    "philips.DICOM_DATE_OF_LAST_CALIBRATION",
    "philips.PIM_DP_SCANNER_OPERATOR_ID",
    # --- Ventana ---
    "ventana.ScanDate",
    "ventana.ScanTime",
    "ventana.Operator",
    # --- MIRAX ---
    "mirax.GENERAL.SLIDE_CREATIONDATETIME",
    "mirax.GENERAL.SLIDE_NAME",
    # --- Generic TIFF ---
    "ImageDescription",  # tag 270 — free-text; may embed patient info
    "DateTime",          # tag 306 — creation timestamp
    "Copyright",         # tag 33432
    "DateTimeOriginal",  # EXIF 36867
    "DateTimeDigitized", # EXIF 36868
    # --- OpenSlide common ---
    "openslide.comment",  # May contain free-text with PHI
    # --- Artist/Copyright short keys ---
    "tiff.Artist",
    "tiff.Copyright",
}

# ---------------------------------------------------------------------------
# LARGE_TAGS: Binary/array tags to skip during metadata extraction
# (avoids bloating the JSON output)
# ---------------------------------------------------------------------------
LARGE_TAGS: set[str] = {
    "JPEGTables",
    "JPEGQTables",
    "JPEGDCTables",
    "JPEGACTables",
    "TileOffsets",
    "TileByteCounts",
    "StripOffsets",
    "StripByteCounts",
    "ICCProfile",
    "ColorMap",
    "TransferFunction",
    "ReferenceBlackWhite",
    "XMP",
    "IPTCNAA",
    "Photoshop",
    "ExifIFD",
    "GeoKeyDirectoryTag",
    "GeoDoubleParamsTag",
    "GeoAsciiParamsTag",
    "ImageDepth",
    "SubIFDs",
}

# ---------------------------------------------------------------------------
# NOT_PHI: Pure scanner / technical parameters (representative, not exhaustive)
# ---------------------------------------------------------------------------
NOT_PHI_TAGS: set[str] = {
    # OpenSlide standard
    "openslide.level-count",
    "openslide.mpp-x",
    "openslide.mpp-y",
    "openslide.objective-power",
    "openslide.vendor",
    "openslide.quickhash-1",
    # Aperio technical
    "aperio.AppMag",
    "aperio.MPP",
    "aperio.ScanScope ID",
    "aperio.StripeWidth",
    "aperio.Parmset",
    "aperio.Filtered",
    "aperio.ICC Profile",
    # Hamamatsu technical
    "hamamatsu.XOffsetFromSlideCentre",
    "hamamatsu.YOffsetFromSlideCentre",
    "hamamatsu.SourceLens",
    # TIFF baseline
    "ImageWidth",
    "ImageLength",
    "BitsPerSample",
    "Compression",
    "PhotometricInterpretation",
    "SamplesPerPixel",
    "RowsPerStrip",
    "XResolution",
    "YResolution",
    "PlanarConfiguration",
    "ResolutionUnit",
    "Software",
    "Make",
    "Model",
    "TileWidth",
    "TileLength",
    "NewSubfileType",
    "Orientation",
    "SampleFormat",
    # Aperio short keys
    "AppMag",
    "MPP",
    "ScanScope ID",
    "StripeWidth",
    "Parmset",
    "Filtered",
    "ICC Profile",
}


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def classify_tag(key: str) -> str:
    """Classify a single WSI metadata property key.

    Returns one of: ``'PHI'``, ``'QUESTIONABLE'``, ``'NOT_PHI'``.
    Tags not in any lookup default to ``'NOT_PHI'``.
    """
    if key in PHI_TAGS:
        return "PHI"
    if key in QUESTIONABLE_TAGS:
        return "QUESTIONABLE"
    return "NOT_PHI"


def classify_tags(properties: dict) -> list[dict]:
    """Classify all WSI metadata properties and return the structured PHI report.

    Args:
        properties: Dict mapping property key (str) -> value (str).

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


def scrub_image_description(image_desc: str) -> str:
    """Scrub PHI/QUESTIONABLE values from Aperio-style ImageDescription strings.

    Aperio format::

        {header_line}|key = val|key = val|...

    Header line is technical-only (preserved as-is).  Each key=value pair
    whose key matches PHI or QUESTIONABLE is replaced with ``key = REDACTED``.

    Also handles free-text ImageDescription fields from other vendors by
    returning 'REDACTED' if the entire string is classified as PHI.

    Args:
        image_desc: Raw ImageDescription string.

    Returns:
        Scrubbed string with PHI values replaced.
    """
    if not image_desc:
        return image_desc

    # Aperio pipe-delimited format
    if "|" in image_desc:
        parts = image_desc.split("|")
        header = parts[0]
        rebuilt = [header]

        for kv in parts[1:]:
            if " = " in kv:
                k, _v = kv.split(" = ", 1)
                key_stripped = k.strip()
                if key_stripped in PHI_TAGS or key_stripped in QUESTIONABLE_TAGS:
                    rebuilt.append(f"{k} = REDACTED")
                else:
                    rebuilt.append(kv)
            else:
                rebuilt.append(kv)

        return "|".join(rebuilt)

    return image_desc
