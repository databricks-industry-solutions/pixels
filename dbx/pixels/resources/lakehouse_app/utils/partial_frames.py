import struct

import fsspec
import pydicom
import requests

import dbx.pixels.version as dbx_pixels_version
from dbx.pixels.databricks_file import DatabricksFile

"""
Utility functions for handling partial frame extraction from DICOM files in Databricks Volumes.

This module provides helper functions to:
- Retrieve specific byte ranges (frames) from files stored in Databricks Volumes using REST API calls.
- Parse DICOM metadata and extract pixel frame information efficiently, supporting both compressed and uncompressed formats.
- Support partial reading and indexing of large DICOM files for scalable image processing.
- Validate file paths using DatabricksFile for security and correctness.

Functions:
    - get_file_part: Retrieve a specific byte range from a file in Databricks Volumes.
    - pixel_frames_from_dcm_metadata_file: Extract pixel frame metadata from a DICOM file, supporting partial reads.

Typical usage example:
    content = get_file_part(request, db_file, frame=frame_info)
    frames = pixel_frames_from_dcm_metadata_file(request, db_file, frame_limit, last_indexed_frame, last_indexed_start_pos)
"""


def get_file_part(request, db_file: DatabricksFile, frame=None):
    """
    Retrieve a specific byte range (optionally a frame) from a file in Databricks Volumes.

    Args:
        request: The HTTP request object containing headers (used for authentication).
        db_file (DatabricksFile): The DatabricksFile instance representing the file.
        frame (dict, optional): Dictionary with 'start_pos' and 'end_pos' keys specifying the byte range to retrieve.

    Returns:
        bytes: The content of the requested file part (or frame).

    Raises:
        Exception: If the file part cannot be retrieved (non-200/206 response).
    """
    file_url = db_file.to_api_url()

    headers = {
        "Authorization": "Bearer " + request.headers.get("X-Forwarded-Access-Token"),
        "User-Agent": f"DatabricksPixels/{dbx_pixels_version}",
    }
    if frame is not None:
        headers["Range"] = f"bytes={frame['start_pos']}-{frame['end_pos']}"

    response = requests.get(file_url, headers=headers)
    if response.status_code != 206 and response.status_code != 200:
        raise Exception(f"Failed to retrieve frame {frame} from {db_file.file_path}")
    return response.content


def pixel_frames_from_dcm_metadata_file(
    request, db_file: DatabricksFile, frame_limit, last_indexed_frame, last_indexed_start_pos
):
    """
    Extract pixel frame metadata from a DICOM file, supporting partial reads.

    Args:
        request: The HTTP request object containing headers (used for authentication).
        db_file (DatabricksFile): The DatabricksFile instance representing the DICOM file.
        frame_limit (int): The maximum index number of the frame to extract.
        last_indexed_frame (int): The last indexed frame index.
        last_indexed_start_pos (int): The last indexed start position.

    Returns:
        dict: Dictionary containing frame metadata and image dimensions.
    """
    pixel_data_delimiter = b"\xe0\x7f\x10\x00"
    frame_delimeter = b"\xfe\xff\x00\xe0"
    frames = []

    client_kwargs = {
        "headers": {
            "Authorization": "Bearer " + request.headers.get("X-Forwarded-Access-Token"),
            "User-Agent": f"DatabricksPixels/{dbx_pixels_version}"
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

        item_length = 100
        end_pos = 0

        f.seek(0)
        if is_compressed:
            while frame_index <= int(ds.get("NumberOfFrames", 1)) and frame_index <= frame_limit:
                f.seek(start_pos)

                file_content = f.read(item_length + 10)
                delimiter = file_content.find(frame_delimeter)

                if delimiter == -1:
                    break

                item_length = struct.unpack("<I", file_content[delimiter + 4 : delimiter + 8])[0]

                start_pos = start_pos + delimiter + 8
                end_pos = start_pos + item_length

                frames.append(
                    {
                        "frame_number": frame_index,
                        "frame_size": item_length,
                        "start_pos": start_pos,
                        "end_pos": end_pos,
                        "pixel_data_pos": pixel_data_pos
                    }
                )

                frame_index += 1
            frames.remove(frames[0])
        else:
            item_length = ds.Rows * ds.Columns * (ds.BitsAllocated // 8)
            for frm_idx in range(number_of_frames):
                start_pos = pixel_data_pos + (frm_idx * item_length)
                offset = frm_idx * item_length

                frames.append(
                    {
                        "frame_number": frm_idx,
                        "frame_size": item_length,
                        "start_pos": pixel_data_pos + offset,
                        "end_pos": pixel_data_pos + offset + item_length - 1,
                        "pixel_data_pos": pixel_data_pos
                    }
                )

        return {
            "frames": frames,
            "rows": ds.get("Rows", 1),
            "columns": ds.get("Columns", 1),
            "pixel_data_pos": pixel_data_pos,
        }
