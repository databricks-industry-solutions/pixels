"""De-identification image utilities for SVS pathology slides.

Functions for redacting PHI from label/macro sub-images and writing
de-identified pyramidal BigTIFF outputs.
"""

import os
import numpy as np
from PIL import Image, ImageDraw


def redact_image(img: "Image.Image", phi_elements: list) -> "Image.Image":
    """Apply black-rectangle redaction to detected PHI bounding boxes.

    Parameters
    ----------
    img : PIL.Image.Image
        The source image (label or macro sub-image).
    phi_elements : list[dict]
        Each dict must have a "bbox" key with {"x", "y", "w", "h"} in pixels.

    Returns
    -------
    PIL.Image.Image
        Copy of the input image with PHI regions blacked out.
    """
    out = img.convert("RGB").copy()
    draw = ImageDraw.Draw(out)
    for elem in phi_elements:
        bbox = elem.get("bbox")
        if not bbox:
            continue
        x, y, w, h = bbox.get("x", 0), bbox.get("y", 0), bbox.get("w", 0), bbox.get("h", 0)
        draw.rectangle([x, y, x + w, y + h], fill=(0, 0, 0))
    return out


def read_level_tiled(
    slide: "openslide.OpenSlide",
    level: int,
    tile_size: int = 4096,
) -> np.ndarray:
    """Read a full pyramid level by tiling to limit peak allocation.

    Allocates ONE numpy array for the entire level, then fills it tile-by-tile.
    Peak memory = full level array + one tile.

    Parameters
    ----------
    slide : openslide.OpenSlide
    level : int
    tile_size : int
        Tile edge in pixels at the target level (default 4096).

    Returns
    -------
    np.ndarray  shape (H, W, 3) uint8
    """
    w, h = slide.level_dimensions[level]
    ds = slide.level_downsamples[level]
    arr = np.zeros((h, w, 3), dtype=np.uint8)
    for y in range(0, h, tile_size):
        for x in range(0, w, tile_size):
            tw = min(tile_size, w - x)
            th = min(tile_size, h - y)
            # read_region always uses level-0 coordinates
            loc = (int(x * ds), int(y * ds))
            tile = np.array(
                slide.read_region(loc, level, (tw, th)).convert("RGB")
            )
            arr[y : y + th, x : x + tw] = tile
    return arr


def build_pyramid(base: np.ndarray, min_dim: int = 256) -> list:
    """Build a Gaussian-style pyramid by 2x downsampling.

    Parameters
    ----------
    base : np.ndarray  (H, W, 3) uint8
    min_dim : int
        Stop when both dimensions are below this threshold.

    Returns
    -------
    list[np.ndarray]  — level 0 is `base`; subsequent are 2x smaller.
    """
    from PIL import Image as _PILImage

    levels = [base]
    current = base
    while min(current.shape[0], current.shape[1]) > min_dim:
        h, w = current.shape[0] // 2, current.shape[1] // 2
        if h == 0 or w == 0:
            break
        pil = _PILImage.fromarray(current).resize((w, h), _PILImage.LANCZOS)
        current = np.array(pil)
        levels.append(current)
    return levels


def write_pyramidal_bigtiff(
    path: str,
    levels: list,
    tile_size: int = 256,
    jpeg_quality: int = 80,
) -> None:
    """Write a multi-resolution pyramidal BigTIFF from pre-built level arrays.

    Parameters
    ----------
    path : str
        Output file path.
    levels : list[np.ndarray]
        Pyramid levels (index 0 = full resolution).
    tile_size : int
    jpeg_quality : int
    """
    import tifffile

    _parent = os.path.dirname(path)
    if _parent and not _parent.startswith("/Volumes"):
        os.makedirs(_parent, exist_ok=True)

    opts = dict(
        tile=(tile_size, tile_size),
        compression="jpeg",
        compressionargs={"level": jpeg_quality},
        photometric="rgb",
        metadata=None,
    )
    with tifffile.TiffWriter(path, bigtiff=True) as tif:
        for i, arr in enumerate(levels):
            if i == 0:
                tif.write(
                    arr,
                    subifds=len(levels) - 1 if len(levels) > 1 else 0,
                    **opts,
                )
            else:
                tif.write(arr, subfiletype=1, **opts)


def write_pyramidal_bigtiff_streaming(
    path: str,
    slide: "openslide.OpenSlide",
    tile_size: int = 256,
    jpeg_quality: int = 80,
) -> None:
    """Write a pyramidal BigTIFF tile-by-tile directly from an OpenSlide handle.

    This function never holds more than ONE tile in memory (~196 KB for 256x256x3).
    Suitable for 1M-scale processing where each worker has limited RAM (e.g. 1 GB
    serverless UDF limit or constrained cluster workers).

    The output contains all pyramid levels from the source slide, written as
    JPEG-compressed tiles with SubIFD structure for multi-resolution readers.

    Parameters
    ----------
    path : str
        Output .tiff file path. If targeting a UC Volume (/Volumes/...),
        the parent directory must already exist (no os.makedirs on Volumes).
    slide : openslide.OpenSlide
        Open slide handle — caller is responsible for closing it after.
    tile_size : int
        Tile edge in pixels (default 256). Both read and write use this size.
    jpeg_quality : int
        JPEG compression quality (default 80).
    """
    import tifffile

    _parent = os.path.dirname(path)
    if _parent and not _parent.startswith("/Volumes"):
        os.makedirs(_parent, exist_ok=True)

    level_count = slide.level_count
    opts = dict(
        tile=(tile_size, tile_size),
        compression="jpeg",
        compressionargs={"level": jpeg_quality},
        photometric="rgb",
        metadata=None,
    )

    def _tile_generator(level: int):
        """Yield tiles row-by-row for a given pyramid level."""
        w, h = slide.level_dimensions[level]
        ds = slide.level_downsamples[level]
        for y in range(0, h, tile_size):
            for x in range(0, w, tile_size):
                tw = min(tile_size, w - x)
                th = min(tile_size, h - y)
                # read_region uses level-0 coordinates
                loc = (int(x * ds), int(y * ds))
                tile = np.array(
                    slide.read_region(loc, level, (tw, th)).convert("RGB")
                )
                # Pad to full tile_size if at edge (tifffile requires uniform tiles)
                if tile.shape[0] < tile_size or tile.shape[1] < tile_size:
                    padded = np.zeros((tile_size, tile_size, 3), dtype=np.uint8)
                    padded[: tile.shape[0], : tile.shape[1]] = tile
                    tile = padded
                yield tile

    with tifffile.TiffWriter(path, bigtiff=True) as tif:
        for lvl in range(level_count):
            w, h = slide.level_dimensions[lvl]
            if lvl == 0:
                tif.write(
                    _tile_generator(lvl),
                    shape=(h, w, 3),
                    dtype="uint8",
                    subifds=level_count - 1 if level_count > 1 else 0,
                    **opts,
                )
            else:
                tif.write(
                    _tile_generator(lvl),
                    shape=(h, w, 3),
                    dtype="uint8",
                    subfiletype=1,
                    **opts,
                )
