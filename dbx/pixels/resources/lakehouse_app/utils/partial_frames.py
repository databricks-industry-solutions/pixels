import struct

import fsspec
import pydicom
import requests

import dbx.pixels.version as dbx_pixels_version
from dbx.pixels.databricks_file import DatabricksFile

from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("PartialFramesUtils")

"""
Utility functions for handling partial frame extraction from DICOM files in Databricks Volumes.

This module provides helper functions to:
- Retrieve specific byte ranges (frames) from files stored in Databricks Volumes using REST API calls.
- Parse DICOM metadata and extract pixel frame information efficiently, supporting both compressed and uncompressed formats.
- Support partial reading and indexing of large DICOM files for scalable image processing.
- Validate file paths using DatabricksFile for security and correctness.

Functions:
    - get_file_part: Retrieve a specific byte range from a file in Databricks Volumes.
    - get_file_metadata: Get the metadata of a file in Databricks Volumes.
    - pixel_frames_from_dcm_metadata_file: Extract pixel frame metadata from a DICOM file, supporting partial reads.
"""


def get_file_part(token: str, db_file: DatabricksFile, frame=None):
    """
    Retrieve a specific byte range (optionally a frame) from a file in Databricks Volumes.

    Args:
        token: The token to use for authentication.
        db_file (DatabricksFile): The DatabricksFile instance representing the file.
        frame (dict, optional): Dictionary with 'start_pos' and 'end_pos' keys specifying the byte range to retrieve.

    Returns:
        bytes: The content of the requested file part (or frame).

    Raises:
        Exception: If the file part cannot be retrieved (non-200/206 response).
    """
    file_url = db_file.to_api_url()

    headers = {
        "Authorization": "Bearer " + token,
        "User-Agent": f"DatabricksPixels/{dbx_pixels_version}",
    }
    if frame is not None:
        headers["Range"] = f"bytes={frame['start_pos']}-{frame['end_pos']}"

    response = requests.get(file_url, headers=headers)
    if response.status_code != 206 and response.status_code != 200:
        raise Exception(f"Failed to retrieve frame {frame} from {db_file.file_path}")
    return response.content


def get_file_metadata(token: str, db_file: DatabricksFile):
    """
    Get the metadata of a file in Databricks Volumes.
    """

    client_kwargs = {
        "headers": {
            "Authorization": "Bearer " + token,
            "User-Agent": f"DatabricksPixels/{dbx_pixels_version}",
        },
    }
    with fsspec.open(db_file.to_api_url(), "rb", client_kwargs=client_kwargs) as f:
        ds = pydicom.dcmread(f, stop_before_pixels=True)
        to_return = ds.to_json_dict()
        to_return.update(ds.file_meta.to_json_dict())
        return to_return

def extract_from_basic_offsets(f, pixel_data_pos, endianness):
    frames = []

    frame_index = 0
    f.seek(pixel_data_pos)
    buffer = f.read(100)
    basic_offset_pos = buffer.find(b"\xFE\xFF\x00\xE0")
    f.seek(pixel_data_pos + basic_offset_pos)
    basic_offsets = pydicom.encaps.parse_basic_offsets(f, endianness=endianness)

    if len(basic_offsets) == 0:
        raise Exception("No basic offsets found")

    start_pos = f.tell() + 8
    while frame_index < len(basic_offsets)-1:
        frame_size = basic_offsets[frame_index+1]-basic_offsets[frame_index]
        end_pos = start_pos + frame_size

        frames.append(
            {
                "frame_number": frame_index,
                "frame_size": frame_size,
                "start_pos": start_pos,
                "end_pos": end_pos,
                "pixel_data_pos": pixel_data_pos,
            }
        )

        frame_index += 1
        start_pos = end_pos

    return frames

def legacy_extract_frames(f, number_of_frames, pixel_data_pos, frame_limit, start_pos, frame_index):
    frame_delimeter = b"\xfe\xff\x00\xe0"
    frames = []
    f.seek(0)

    while frame_index <= number_of_frames and frame_index <= frame_limit:
        f.seek(start_pos)

        file_content = f.read(100)
        delimiter = file_content.find(frame_delimeter)

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

    if frames[0]["frame_size"] < 10000:
        frames.pop(0) #Remove basic offset table from frames

    return frames

def pixel_frames_from_dcm_metadata_file(
    token: str, db_file: DatabricksFile, frame_limit, last_indexed_frame, last_indexed_start_pos
):
    """
    Extract pixel frame metadata from a DICOM file, supporting partial reads.

    Args:
        token: The token to use for authentication.
        db_file (DatabricksFile): The DatabricksFile instance representing the DICOM file.
        frame_limit (int): The maximum index number of the frame to extract.
        last_indexed_frame (int): The last indexed frame index.
        last_indexed_start_pos (int): The last indexed start position.

    Returns:
        dict: Dictionary containing frame metadata and image dimensions.
    """
    pixel_data_delimiter = b"\xe0\x7f\x10\x00"
    frames = []

    client_kwargs = {
        "headers": {
            "Authorization": "Bearer " + token,
            "User-Agent": f"DatabricksPixels/{dbx_pixels_version}",
        },
    }

    with fsspec.open(db_file.to_api_url(), "rb", client_kwargs=client_kwargs) as f:
        ds = pydicom.dcmread(f, stop_before_pixels=True)
        is_compressed = ds.file_meta.TransferSyntaxUID.is_compressed

        number_of_frames = ds.get("NumberOfFrames", 1)

        f.seek(0)
        pixel_data_pos = f.read(1000000).find(pixel_data_delimiter)

        if last_indexed_frame != 0 and last_indexed_start_pos != 0:
            start_pos = last_indexed_start_pos - 100
            frame_index = last_indexed_frame
        else:
            start_pos = pixel_data_pos
            frame_index = 0

        f.seek(0)
        if is_compressed:
            # try to parse basic offsets first
            if last_indexed_frame == 0 or last_indexed_start_pos == 0:
                try:
                    endianness = '<' if ds.file_meta.TransferSyntaxUID.is_little_endian else '>'
                    frames = extract_from_basic_offsets(f, pixel_data_pos, endianness)
                except Exception as e:
                    logger.warning(f"Error parsing basic offsets: {e}, using fallback method")
                    frames = legacy_extract_frames(f, number_of_frames, pixel_data_pos, frame_limit, start_pos, frame_index)
            else:
                print("Using fallback method with last indexed frame and start pos", last_indexed_frame, last_indexed_start_pos)
                frames = legacy_extract_frames(f, number_of_frames, pixel_data_pos, frame_limit, start_pos, frame_index)
        else:
            item_length = ds.Rows * ds.Columns * (ds.BitsAllocated // 8)
            for frm_idx in range(number_of_frames):
                offset = (frm_idx * item_length) + 12

                frames.append(
                    {
                        "frame_number": frm_idx,
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
