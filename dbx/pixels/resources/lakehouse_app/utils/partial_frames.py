"""
Partial frame extraction utilities for the Lakehouse App.

Provides helpers to:
- Retrieve specific byte ranges from files in Databricks Volumes.
- Parse DICOM metadata and extract pixel frame information.
- Support partial reading and incremental indexing of large DICOM files.

Functions:
    get_file_part      – byte-range read from Databricks Volumes
    get_file_metadata  – read DICOM header without pixel data
    pixel_frames_from_dcm_metadata_file – extract frame byte-ranges (incremental)
"""

import struct

import fsspec
import pydicom
import requests

import dbx.pixels.version as dbx_pixels_version
from dbx.pixels.databricks_file import DatabricksFile
from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("PartialFramesUtils")


# ---------------------------------------------------------------------------
# Byte-range file access
# ---------------------------------------------------------------------------


def get_file_part(token: str, db_file: DatabricksFile, frame=None):
    """
    Retrieve a specific byte range (optionally a frame) from a file in Databricks Volumes.

    Args:
        token: Databricks authentication token.
        db_file: DatabricksFile instance representing the file.
        frame: Optional dict with ``start_pos`` / ``end_pos`` keys.

    Returns:
        bytes: The content of the requested file part.
    """
    headers = {
        "Authorization": f"Bearer {token}",
        "User-Agent": f"DatabricksPixels/{dbx_pixels_version}",
    }
    if frame is not None:
        headers["Range"] = f"bytes={frame['start_pos']}-{frame['end_pos']}"

    response = requests.get(db_file.to_api_url(), headers=headers)
    if response.status_code not in (200, 206):
        raise RuntimeError(f"Failed to retrieve frame {frame} from {db_file.file_path}")
    return response.content


def get_file_metadata(token: str, db_file: DatabricksFile):
    """Read DICOM metadata (header + file meta) without loading pixel data."""
    client_kwargs = {
        "headers": {
            "Authorization": f"Bearer {token}",
            "User-Agent": f"DatabricksPixels/{dbx_pixels_version}",
        },
    }
    with fsspec.open(db_file.to_api_url(), "rb", client_kwargs=client_kwargs) as f:
        ds = pydicom.dcmread(f, stop_before_pixels=True)
        result = ds.to_json_dict()
        result.update(ds.file_meta.to_json_dict())
        return result


# ---------------------------------------------------------------------------
# Frame extraction helpers
# ---------------------------------------------------------------------------


def _extract_from_basic_offsets(f, pixel_data_pos, endianness):
    """Parse the DICOM Basic Offset Table and return per-frame byte ranges."""
    frames = []

    f.seek(pixel_data_pos)
    buffer = f.read(100)
    basic_offset_pos = buffer.find(b"\xfe\xff\x00\xe0")
    f.seek(pixel_data_pos + basic_offset_pos)
    basic_offsets = pydicom.encaps.parse_basic_offsets(f, endianness=endianness)

    if not basic_offsets:
        raise ValueError("No basic offsets found")

    start_pos = f.tell() + 8
    for idx in range(len(basic_offsets) - 1):
        frame_size = basic_offsets[idx + 1] - basic_offsets[idx]
        end_pos = start_pos + frame_size
        frames.append(
            {
                "frame_number": idx,
                "frame_size": frame_size,
                "start_pos": start_pos,
                "end_pos": end_pos,
                "pixel_data_pos": pixel_data_pos,
            }
        )
        start_pos = end_pos

    return frames


def _legacy_extract_frames(
    f, number_of_frames, pixel_data_pos, frame_limit, start_pos, frame_index
):
    """Fallback frame extraction by scanning for Item delimiters sequentially."""
    frame_delimiter = b"\xfe\xff\x00\xe0"
    frames = []
    f.seek(0)

    while frame_index <= number_of_frames and frame_index <= frame_limit:
        f.seek(start_pos)
        file_content = f.read(100)
        delimiter = file_content.find(frame_delimiter)
        if delimiter == -1:
            break

        item_length = struct.unpack("<I", file_content[delimiter + 4 : delimiter + 8])[0]
        start_pos = start_pos + delimiter + 8
        end_pos = start_pos + item_length

        if start_pos == end_pos:
            continue

        frames.append(
            {
                "frame_number": frame_index,
                "frame_size": item_length,
                "start_pos": start_pos,
                "end_pos": end_pos,
                "pixel_data_pos": pixel_data_pos,
            }
        )
        start_pos = end_pos
        frame_index += 1

    if frames and frames[0]["frame_size"] < 10000:
        frames.pop(0)

    return frames


# ---------------------------------------------------------------------------
# Main extraction function (used by lakehouse_app)
# ---------------------------------------------------------------------------


def pixel_frames_from_dcm_metadata_file(
    token: str, db_file: DatabricksFile, frame_limit, last_indexed_frame, last_indexed_start_pos
):
    """
    Extract pixel frame metadata from a DICOM file, supporting partial/incremental reads.

    Args:
        token: Databricks authentication token.
        db_file: DatabricksFile instance.
        frame_limit: Maximum frame index to extract.
        last_indexed_frame: Last indexed frame index (for incremental reads).
        last_indexed_start_pos: Last indexed start position.

    Returns:
        dict with ``frames``, ``rows``, ``columns``, ``pixel_data_pos``.
    """
    pixel_data_marker = b"\xe0\x7f\x10\x00"
    frames = []

    client_kwargs = {
        "headers": {
            "Authorization": f"Bearer {token}",
            "User-Agent": f"DatabricksPixels/{dbx_pixels_version}",
        },
    }

    with fsspec.open(db_file.to_api_url(), "rb", client_kwargs=client_kwargs) as f:
        ds = pydicom.dcmread(f, stop_before_pixels=True)
        # pydicom stops at the top-level Pixel Data tag; capture that
        # position so we skip any nested (7FE0,0010) tags (e.g. inside
        # Icon Image Sequence) when searching for the real pixel data.
        metadata_end = f.tell()
        is_compressed = ds.file_meta.TransferSyntaxUID.is_compressed
        number_of_frames = ds.get("NumberOfFrames", 1)

        f.seek(0)
        raw_header = f.read(1_000_000)
        # Search from near where pydicom stopped (allow small look-back
        # since pydicom may have consumed part of the 4-byte tag).
        search_from = max(0, metadata_end - 8)
        pixel_data_pos = raw_header.find(pixel_data_marker, search_from)
        if pixel_data_pos == -1:
            # Fallback: single-tag case or very small header
            pixel_data_pos = raw_header.find(pixel_data_marker)

        if last_indexed_frame != 0 and last_indexed_start_pos != 0:
            start_pos = last_indexed_start_pos - 100
            frame_index = last_indexed_frame
        else:
            start_pos = pixel_data_pos
            frame_index = 0

        f.seek(0)
        if is_compressed:
            if last_indexed_frame == 0 or last_indexed_start_pos == 0:
                try:
                    endianness = "<" if ds.file_meta.TransferSyntaxUID.is_little_endian else ">"
                    frames = _extract_from_basic_offsets(f, pixel_data_pos, endianness)
                except Exception as e:
                    logger.warning(f"BOT parsing failed: {e}, using fallback")
                    frames = _legacy_extract_frames(
                        f, number_of_frames, pixel_data_pos, frame_limit, start_pos, frame_index
                    )
            else:
                logger.warning(
                    f"Incremental read from frame {last_indexed_frame}, start_pos {last_indexed_start_pos}"
                )
                frames = _legacy_extract_frames(
                    f, number_of_frames, pixel_data_pos, frame_limit, start_pos, frame_index
                )
        else:
            samples_per_pixel = int(getattr(ds, "SamplesPerPixel", 1))
            item_length = ds.Rows * ds.Columns * (ds.BitsAllocated // 8) * samples_per_pixel
            # Explicit VR: tag(4) + VR(2) + reserved(2) + len(4) = 12
            # Implicit VR: tag(4) + len(4) = 8
            vr_bytes = raw_header[pixel_data_pos + 4 : pixel_data_pos + 6]
            header_size = 12 if vr_bytes.isalpha() else 8
            for idx in range(number_of_frames):
                offset = (idx * item_length) + header_size
                frames.append(
                    {
                        "frame_number": idx,
                        "frame_size": item_length,
                        "start_pos": pixel_data_pos + offset,
                        "end_pos": pixel_data_pos + offset + item_length - 1,
                        "pixel_data_pos": pixel_data_pos,
                    }
                )

        return {
            "frames": frames,
            "rows": ds.get("Rows", 1),
            "columns": ds.get("Columns", 1),
            "pixel_data_pos": pixel_data_pos,
        }
