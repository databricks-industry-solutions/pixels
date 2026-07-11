"""dbx.pixels.svs — SVS (Aperio Whole Slide Image) extension for databricks-pixels.

Install alongside ``databricks-pixels`` and extend the ``dbx.pixels`` namespace::

    import dbx.pixels
    _SVS_SRC = "/Workspace/Users/<you>/svs-pixels/src/dbx/pixels"
    if _SVS_SRC not in dbx.pixels.__path__:
        dbx.pixels.__path__.append(_SVS_SRC)

    from dbx.pixels.svs import SVSCatalog, SVSMetaExtractor, SVSTiffWriter
"""

from dbx.pixels.svs.catalog import SVSCatalog
from dbx.pixels.svs.svs_meta_extractor import SVSMetaExtractor
from dbx.pixels.svs.phi_tags import (
    classify_tag,
    classify_tags,
    scrub_image_description,
    PHI_TAGS,
    QUESTIONABLE_TAGS,
    NOT_PHI_TAGS,
)

# Lazy import: SVSTiffWriter depends on deidentify.py which may not be clean
# on all environments. Import on first access only.
def __getattr__(name):
    if name == "SVSTiffWriter":
        from dbx.pixels.svs.svs_tiff_writer import SVSTiffWriter
        globals()["SVSTiffWriter"] = SVSTiffWriter
        return SVSTiffWriter
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")

__all__ = [
    "SVSCatalog",
    "SVSMetaExtractor",
    "SVSTiffWriter",  # lazy-loaded
    "classify_tag",
    "classify_tags",
    "scrub_image_description",
    "PHI_TAGS",
    "QUESTIONABLE_TAGS",
    "NOT_PHI_TAGS",
]
