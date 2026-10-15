"""dbx.pixels.wsi — Unified Whole Slide Image handler for databricks-pixels.

Supports all OpenSlide-recognized WSI formats:
- Aperio SVS
- Hamamatsu NDPI / VMS / VMU
- Leica SCN
- MIRAX MRXS
- Philips TIFF
- Sakura SVSLIDE
- Trestle TIF
- Ventana BIF / TIF
- Generic TIFF

Install the WSI dependencies with the ``wsi`` extra (``pip install databricks-pixels[wsi]``),
or, when working from a checkout of this repo, add its ``src/`` folder to ``sys.path``::

    import sys
    SRC_PATH = "/Workspace/<path-to-pixels-repo>/src"
    if SRC_PATH not in sys.path:
        sys.path.insert(0, SRC_PATH)

    from dbx.pixels.wsi import WSICatalog, WSIMetaExtractor, WSIVLMPhiDetector, wsi_to_image

See ``docs/WSI.md`` for the ingestion guide and known limitations.
"""

from dbx.pixels.wsi.catalog import WSICatalog
from dbx.pixels.wsi.wsi_meta_extractor import WSIMetaExtractor
from dbx.pixels.wsi.wsi_phi_tags import (
    LARGE_TAGS,
    NOT_PHI_TAGS,
    OPENSLIDE_PATTERNS,
    PHI_TAGS,
    QUESTIONABLE_TAGS,
    SUPPORTED_EXTENSIONS,
    classify_tag,
    classify_tags,
    scrub_image_description,
)
from dbx.pixels.wsi.wsi_utils import (
    wsi_detect_format,
    wsi_get_properties,
    wsi_to_image,
)
from dbx.pixels.wsi.wsi_vlm_phi_detector import WSIVLMPhiDetector

__all__ = [
    # Classes
    "WSICatalog",
    "WSIMetaExtractor",
    "WSIVLMPhiDetector",
    # Utils
    "wsi_to_image",
    "wsi_detect_format",
    "wsi_get_properties",
    # PHI tags
    "classify_tag",
    "classify_tags",
    "scrub_image_description",
    "PHI_TAGS",
    "QUESTIONABLE_TAGS",
    "NOT_PHI_TAGS",
    "LARGE_TAGS",
    # Constants
    "SUPPORTED_EXTENSIONS",
    "OPENSLIDE_PATTERNS",
]
