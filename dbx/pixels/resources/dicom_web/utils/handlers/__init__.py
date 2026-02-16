"""
DICOMweb handler package — re-exports all public handler functions.

Submodules
----------
_common   — Shared singletons, authentication, and wrapper factory
_qido     — QIDO-RS (study / series / instance search)
_wado     — WADO-RS, WADO-URI, and path resolution
_stow     — STOW-RS (instance storage with early return + caching)
"""

from ._qido import (
    dicomweb_qido_studies,
    dicomweb_qido_series,
    dicomweb_qido_instances,
)
from ._wado import (
    dicomweb_wado_series_metadata,
    dicomweb_wado_instance,
    dicomweb_wado_instance_frames,
    dicomweb_wado_uri,
    dicomweb_resolve_paths,
)
from ._stow import dicomweb_stow_studies

__all__ = [
    # QIDO-RS
    "dicomweb_qido_studies",
    "dicomweb_qido_series",
    "dicomweb_qido_instances",
    # WADO-RS / WADO-URI
    "dicomweb_wado_series_metadata",
    "dicomweb_wado_instance",
    "dicomweb_wado_instance_frames",
    "dicomweb_wado_uri",
    # STOW-RS
    "dicomweb_stow_studies",
    # Path resolution
    "dicomweb_resolve_paths",
]
