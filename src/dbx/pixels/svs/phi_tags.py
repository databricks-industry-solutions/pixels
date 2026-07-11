"""PHI tag classification for Aperio SVS / OpenSlide metadata properties.

Research-hardcoded lookup covering all standard OpenSlide / Aperio TIFF
properties.  Each tag is classified as PHI, QUESTIONABLE, or NOT_PHI.

Public API:
    classify_tag(key) -> str
    classify_tags(properties: dict) -> list[dict]
    scrub_image_description(image_desc: str) -> str
"""

from __future__ import annotations

# -- PHI: Definite Protected Health Information --------------------------------
PHI_TAGS: set[str] = {
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
    # Short-key variants (inside tiff.ImageDescription pipe-delimited section)
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

# -- QUESTIONABLE: May contain PHI depending on site configuration -------------
QUESTIONABLE_TAGS: set[str] = {
    "aperio.Date",
    "aperio.Time",
    "aperio.Clinic",
    "aperio.Pathologist",
    "aperio.Title",
    "aperio.Filename",
    "aperio.User",
    "aperio.ImageID",
    "tiff.Artist",
    "tiff.Copyright",
    # Short-key variants
    "Date",
    "Time",
    "Clinic",
    "Pathologist",
    "Title",
    "Filename",
    "User",
    "ImageID",
}

# -- NOT_PHI: Pure scanner / technical parameters ------------------------------
NOT_PHI_TAGS: set[str] = {
    "aperio.AppMag",
    "aperio.MPP",
    "aperio.ScanScope ID",
    "aperio.StripeWidth",
    "aperio.Parmset",
    "aperio.Filtered",
    "aperio.ICC Profile",
    "openslide.level-count",
    "openslide.mpp-x",
    "openslide.mpp-y",
    "openslide.objective-power",
    "openslide.vendor",
    "openslide.quickhash-1",
    "openslide.comment",
    "tiff.Make",
    "tiff.Model",
    "tiff.Software",
    "tiff.ResolutionUnit",
    "tiff.XResolution",
    "tiff.YResolution",
    # Short-key variants
    "AppMag",
    "MPP",
    "ScanScope ID",
    "StripeWidth",
    "Parmset",
    "Filtered",
    "ICC Profile",
}


def classify_tag(key: str) -> str:
    """Classify a single OpenSlide property key.

    Returns one of: 'PHI', 'QUESTIONABLE', 'NOT_PHI'.
    Tags not in any lookup default to 'NOT_PHI' (scanner geometry, level dims, etc.).
    """
    if key in PHI_TAGS:
        return "PHI"
    if key in QUESTIONABLE_TAGS:
        return "QUESTIONABLE"
    return "NOT_PHI"


def classify_tags(properties: dict) -> list[dict]:
    """Classify all OpenSlide properties and return the structured PHI report.

    Args:
        properties: Dict of OpenSlide property key -> value strings.

    Returns:
        List of dicts: [{"tag": key, "value": val, "classification": cls}, ...]
        Only includes PHI and QUESTIONABLE entries (NOT_PHI are omitted for brevity).
    """
    report = []
    for key, value in properties.items():
        cls = classify_tag(key)
        if cls in ("PHI", "QUESTIONABLE"):
            report.append({"tag": key, "value": value, "classification": cls})
    return report


def scrub_image_description(image_desc: str) -> str:
    """Scrub PHI/QUESTIONABLE values from the Aperio ImageDescription string.

    Aperio format::

        {header_line}|key = val|key = val|...

    Header line is technical-only (preserved as-is).  Each key=value pair
    whose key matches PHI or QUESTIONABLE is replaced with ``key = REDACTED``.

    Args:
        image_desc: Raw tiff.ImageDescription string.

    Returns:
        Scrubbed string with PHI values replaced.
    """
    if not image_desc:
        return image_desc

    parts = image_desc.split("|")
    # First part is the header line -- always preserved
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
            # Continuation or malformed -- preserve as-is
            rebuilt.append(kv)

    return "|".join(rebuilt)
