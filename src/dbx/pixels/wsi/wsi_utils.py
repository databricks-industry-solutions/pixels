"""WSI utility functions — image conversion for all OpenSlide-supported formats.

Provides ``wsi_to_image()``, the unified WSI equivalent of
``dbx.pixels.tiff.tiff_utils.tiff_to_image()``.

Uses OpenSlide as the primary backend (handles all 13 WSI formats).
Falls back to tifffile for non-WSI TIFFs that OpenSlide cannot open.

Key features:
- Thumbnail extraction at configurable max_width (uses OpenSlide's
  get_thumbnail() which leverages the pyramid — never loads full-res data)
- Associated image extraction (label, macro, thumbnail) via OpenSlide
- Format-agnostic: works with SVS, NDPI, MRXS, SCN, BIF, Philips TIFF, etc.

No dependency on ``dbx.pixels.dicom`` or ``pydicom``.
"""

from __future__ import annotations

import base64
import io
from typing import Optional

import numpy as np
from PIL import Image

from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider()


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------


def _normalize_to_uint8_rgb(arr: np.ndarray) -> np.ndarray:
    """Coerce any numpy array to uint8 RGB suitable for JPEG encoding.

    Handles:
    - 16-bit / float arrays  →  normalise to 0-255
    - RGBA (4-channel)       →  composite onto white background
    - Grayscale (2-D)        →  replicate to 3 channels
    - Single-channel 3-D     →  replicate to 3 channels
    """
    # RGBA → RGB with white background composite
    if arr.ndim == 3 and arr.shape[-1] == 4:
        # Alpha composite onto white
        alpha = arr[:, :, 3:4].astype(np.float32) / 255.0
        rgb = arr[:, :, :3].astype(np.float32)
        white = np.full_like(rgb, 255.0)
        arr = (rgb * alpha + white * (1.0 - alpha)).astype(np.uint8)

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


def _pil_to_output(
    img: Image.Image,
    max_width: int,
    output_path: Optional[str],
    return_type: str,
) -> Optional[str | bytes]:
    """Resize, encode to JPEG, and return in requested format."""
    # Resize if needed
    if max_width > 0 and img.width > max_width:
        ratio = max_width / img.width
        new_size = (max_width, int(img.height * ratio))
        img = img.resize(new_size, Image.LANCZOS)

    # Ensure RGB (not RGBA or palette)
    if img.mode != "RGB":
        img = img.convert("RGB")

    # Encode to JPEG
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85)
    jpeg_bytes = buf.getvalue()

    # Optionally save to disk
    if output_path:
        with open(output_path, "wb") as f:
            f.write(jpeg_bytes)

    if return_type == "binary":
        return jpeg_bytes
    return base64.b64encode(jpeg_bytes).decode("utf-8")


# ---------------------------------------------------------------------------
# OpenSlide backend
# ---------------------------------------------------------------------------


def _wsi_openslide(
    path: str,
    series: str = "tissue",
    max_width: int = 768,
    output_path: Optional[str] = None,
    return_type: str = "str",
) -> Optional[str | bytes]:
    """Extract image from a WSI using OpenSlide."""
    import openslide

    try:
        slide = openslide.OpenSlide(path)

        if series in ("label", "macro", "thumbnail"):
            # Associated image extraction
            if series in slide.associated_images:
                img = slide.associated_images[series]
                slide.close()
                return _pil_to_output(img, max_width, output_path, return_type)
            else:
                logger.warning(
                    f"wsi_to_image: no '{series}' associated image in {path}; "
                    f"available: {list(slide.associated_images.keys())}. "
                    f"Falling back to tissue thumbnail."
                )

        # Tissue thumbnail (default)
        # Use OpenSlide's get_thumbnail which respects the pyramid
        thumb_size = (max_width, max_width) if max_width > 0 else slide.dimensions
        img = slide.get_thumbnail(thumb_size)
        slide.close()
        return _pil_to_output(img, max_width=0, output_path=output_path, return_type=return_type)

    except Exception as e:
        logger.exception(f"OpenSlide read failed for {path}: {e}")
        return None


# ---------------------------------------------------------------------------
# tifffile fallback
# ---------------------------------------------------------------------------


def _wsi_tifffile(
    path: str,
    series: str = "tissue",
    max_width: int = 768,
    output_path: Optional[str] = None,
    return_type: str = "str",
) -> Optional[str | bytes]:
    """Extract image from a TIFF using tifffile (fallback)."""
    import tifffile

    try:
        with tifffile.TiffFile(path) as tif:
            arr = None

            if series in ("label", "macro"):
                # Search for labeled IFD
                target_lc = series.strip().lower()
                for page in tif.pages:
                    try:
                        desc = page.description
                        if isinstance(desc, bytes):
                            desc = desc.decode("utf-8", errors="replace")
                        if desc.strip().strip("\x00").lower() == target_lc:
                            arr = page.asarray()
                            break
                    except Exception:
                        continue

                if arr is None:
                    logger.warning(
                        f"wsi_to_image: no '{series}' IFD in {path}; falling back to tissue"
                    )

            # Tissue (default) — smallest level of first series
            if arr is None:
                if tif.series:
                    s = tif.series[0]
                    if hasattr(s, "levels") and len(s.levels) > 1:
                        arr = s.levels[-1].asarray()
                    else:
                        arr = s.asarray()
                else:
                    arr = tif.pages[0].asarray()

        if arr is None:
            return None

        arr = _normalize_to_uint8_rgb(arr)
        img = Image.fromarray(arr)
        return _pil_to_output(img, max_width, output_path, return_type)

    except Exception as e:
        logger.exception(f"tifffile read failed for {path}: {e}")
        return None


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def wsi_to_image(
    path: str,
    max_width: int = 768,
    output_path: Optional[str] = None,
    return_type: str = "str",
    series: str = "tissue",
) -> Optional[str | bytes]:
    """Convert a WSI file to a JPEG thumbnail.

    Supports all OpenSlide formats (SVS, NDPI, MRXS, SCN, BIF, Philips TIFF,
    generic TIFF, etc.) with tifffile fallback for non-WSI TIFFs.

    Args:
        path:        Local path to the WSI file.
        max_width:   Resize thumbnail to this width (default 768).
                     Set to 0 to skip resize.
        output_path: If set, also save the JPEG to this path.
        return_type: ``"str"``    — base64-encoded JPEG string (default).
                     ``"binary"`` — raw JPEG bytes.
        series:      Which sub-image to extract:
                     ``"tissue"``    — tissue thumbnail (default; pyramid-aware).
                     ``"label"``     — label associated image (PHI target).
                     ``"macro"``     — macro/overview associated image.
                     ``"thumbnail"`` — built-in thumbnail if available.

    Returns:
        Base64 JPEG string, raw JPEG bytes, or ``None`` on failure.
    """
    # Try OpenSlide first
    try:
        import openslide

        fmt = openslide.OpenSlide.detect_format(path)
        if fmt is not None:
            result = _wsi_openslide(path, series, max_width, output_path, return_type)
            if result is not None:
                return result
    except ImportError:
        logger.warn(
            "wsi_to_image: preferred openslide not available. "
            "Install openslide-python openslide-bin."
        )
    except Exception:
        pass

    # Fallback to tifffile
    try:
        return _wsi_tifffile(path, series, max_width, output_path, return_type)
    except ImportError:
        logger.error(
            "wsi_to_image: neither openslide nor tifffile available. "
            "Install openslide-python openslide-bin or tifffile."
        )
        return None


def wsi_detect_format(path: str) -> Optional[str]:
    """Detect the WSI format of a file without fully opening it.

    Returns the OpenSlide vendor string (e.g. 'aperio', 'hamamatsu',
    'philips', 'generic-tiff') or None if not a recognized WSI format.
    """
    try:
        import openslide

        return openslide.OpenSlide.detect_format(path)
    except ImportError:
        return None
    except Exception:
        return None


def wsi_get_properties(path: str) -> dict:
    """Read all OpenSlide properties from a WSI file.

    Returns a dict of property key -> value strings.
    Returns an empty dict if the file cannot be opened.
    """
    try:
        import openslide

        slide = openslide.OpenSlide(path)
        props = dict(slide.properties)
        slide.close()
        return props
    except Exception:
        return {}
