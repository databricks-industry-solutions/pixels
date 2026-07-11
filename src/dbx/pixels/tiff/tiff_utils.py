"""TIFF utility functions — image conversion for downstream processing.

Provides ``tiff_to_image()``, the TIFF equivalent of
``dbx.pixels.dicom.dicom_utils.dicom_to_image()``.

Handles standard TIFF, BigTIFF, and multi-level pyramidal WSI TIFFs
(Philips, Aperio SVS-style, NDPI) by reading the **smallest available
pyramid level** rather than the full-resolution page, so VLM callers
never load a 500 MB slide into memory.

No dependency on ``dbx.pixels.dicom`` or ``pydicom``.

Primary backend: ``tifffile``.  Falls back to ``Pillow`` if absent.
"""

from __future__ import annotations

import io
from typing import Optional

import numpy as np

from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider()


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _normalize_to_uint8_rgb(arr: np.ndarray) -> np.ndarray:
    """Coerce any numpy array to uint8 RGB suitable for JPEG encoding.

    Handles:
    - 16-bit / float arrays  →  normalise to 0-255
    - RGBA (4-channel)       →  drop alpha channel
    - Grayscale (2-D)        →  replicate to 3 channels
    - Single-channel 3-D     →  replicate to 3 channels
    """
    # Drop alpha channel
    if arr.ndim == 3 and arr.shape[-1] == 4:
        arr = arr[:, :, :3]

    # Convert to uint8
    if arr.dtype != np.uint8:
        lo, hi = float(arr.min()), float(arr.max())
        if hi > lo:
            arr = ((arr.astype(np.float32) - lo) / (hi - lo) * 255).astype(np.uint8)
        else:
            arr = np.zeros_like(arr, dtype=np.uint8)

    # Grayscale → RGB
    if arr.ndim == 2:
        arr = np.stack([arr, arr, arr], axis=-1)
    elif arr.ndim == 3 and arr.shape[-1] == 1:
        arr = np.concatenate([arr, arr, arr], axis=-1)

    return arr


def _tiff_to_array_tifffile(path: str) -> Optional[np.ndarray]:
    """Read the smallest pyramid level of a TIFF using ``tifffile``.

    For multi-level WSI TIFFs (e.g. Philips BigTIFF with 9 pyramid levels),
    returns ``series[0].levels[-1].asarray()`` — the lowest-resolution level.
    For single-level TIFFs, returns ``series[0].asarray()``.
    """
    import tifffile

    try:
        with tifffile.TiffFile(path) as tif:
            if tif.series:
                series = tif.series[0]
                if hasattr(series, "levels") and len(series.levels) > 1:
                    # Multi-level pyramid — pick the smallest level
                    return series.levels[-1].asarray()
                return series.asarray()
            # No series metadata — fall back to page 0
            return tif.pages[0].asarray()
    except Exception as e:
        logger.exception(f"tifffile read failed for {path}: {e}")
        return None


def _tiff_to_array_pillow(path: str) -> Optional[np.ndarray]:
    """Read the last frame of a TIFF using ``Pillow`` (fallback).

    For pyramidal TIFFs the last IFD is the lowest-resolution page,
    making it the best thumbnail candidate without tifffile.

    ``Image.MAX_IMAGE_PIXELS`` is temporarily disabled because WSI slides
    legitimately exceed Pillow's default decompression-bomb limit (the full
    resolution header triggers the guard even though we only decompress the
    small last frame).
    """
    from PIL import Image

    try:
        _prev = Image.MAX_IMAGE_PIXELS
        Image.MAX_IMAGE_PIXELS = None  # suppress bomb check for large WSI
        try:
            with Image.open(path) as img:
                n_frames = getattr(img, "n_frames", 1)
                if n_frames > 1:
                    img.seek(n_frames - 1)
                return np.array(img)
        finally:
            Image.MAX_IMAGE_PIXELS = _prev  # always restore
    except Exception as e:
        logger.exception(f"Pillow read failed for {path}: {e}")
        return None


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def tiff_to_image(
    path: str,
    max_width: int = 768,
    output_path: str = None,
    return_type: str = "str",
) -> Optional[str | bytes]:
    """Convert a TIFF file to a JPEG thumbnail.

    For multi-level pyramidal WSI TIFFs, reads the smallest available pyramid
    level to avoid loading full-resolution pixel data.  For single-level
    TIFFs, reads the full image and resizes if needed.

    Primary backend: ``tifffile``.  Falls back to ``Pillow`` if not installed.
    No dependency on ``dbx.pixels.dicom`` or ``pydicom``.

    Args:
        path:        Local path to the TIFF file.
        max_width:   Resize thumbnail to this width (default 768).
                     Set to 0 to skip resize.
        output_path: If set, also save the JPEG to this path.
        return_type: ``"str"``    — base64-encoded JPEG string (default).
                     ``"binary"`` — raw JPEG bytes.

    Returns:
        Base64 JPEG string, raw JPEG bytes, or ``None`` on failure.
    """
    try:
        # --- 1. Read pixel data (tifffile primary, Pillow fallback) ---
        arr: Optional[np.ndarray] = None

        try:
            import tifffile  # noqa: F401
            arr = _tiff_to_array_tifffile(path)
        except ImportError:
            pass

        if arr is None:
            arr = _tiff_to_array_pillow(path)

        if arr is None:
            logger.error(f"tiff_to_image: could not read pixel data from {path}")
            return None

        # --- 2. Normalise to uint8 RGB ---
        arr = _normalize_to_uint8_rgb(arr)

        # --- 3. Resize + encode using PIL directly (no DICOM dependency) ---
        import base64 as _base64
        from PIL import Image

        img = Image.fromarray(arr)
        if max_width > 0 and img.width > max_width:
            ratio = max_width / img.width
            img = img.resize((max_width, int(img.height * ratio)), Image.LANCZOS)

        if output_path:
            img.save(output_path, format="JPEG")

        buf = io.BytesIO()
        img.save(buf, format="JPEG")
        jpg_bytes = buf.getvalue()

        if return_type == "binary":
            return jpg_bytes
        if return_type == "str":
            return _base64.b64encode(jpg_bytes).decode("utf-8")

        logger.warning(f"tiff_to_image: unknown return_type '{return_type}', returning None.")
        return None

    except Exception as e:
        logger.exception(f"tiff_to_image failed for {path}: {e}")
        return None
