"""
Low-level DICOM file I/O operations.

Provides byte-range reads, **streaming** file delivery, DICOM metadata
extraction, and full Basic Offset Table (BOT) computation for PACS-style
frame indexing.

All functions operate on Databricks Volumes via the Files API.
"""

import struct
from collections.abc import Iterator

import fsspec
import pydicom
import requests

import dbx.pixels.version as dbx_pixels_version
from dbx.pixels.databricks_file import DatabricksFile
from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("DICOMweb.IO")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _auth_headers(token: str) -> dict[str, str]:
    """Standard auth + UA headers for the Databricks Files API."""
    return {
        "Authorization": f"Bearer {token}",
        "User-Agent": f"DatabricksPixels/{dbx_pixels_version}",
    }


# ---------------------------------------------------------------------------
# Byte-range file access (buffered — for frames / small reads)
# ---------------------------------------------------------------------------

def get_file_part(token: str, db_file: DatabricksFile, frame: dict | None = None) -> bytes:
    """
    Retrieve a specific byte range from a file in Databricks Volumes.

    Args:
        token: Databricks authentication token.
        db_file: Target file in a Unity Catalog volume.
        frame: Optional dict with ``start_pos`` / ``end_pos`` for a byte-range read.

    Returns:
        Raw bytes of the requested range (or whole file if *frame* is ``None``).
    """
    headers = _auth_headers(token)
    if frame is not None:
        headers["Range"] = f"bytes={frame['start_pos']}-{frame['end_pos']}"

    response = requests.get(db_file.to_api_url(), headers=headers)
    if response.status_code not in (200, 206):
        raise RuntimeError(
            f"Failed to retrieve file part from {db_file.file_path} "
            f"(HTTP {response.status_code})"
        )
    return response.content


# ---------------------------------------------------------------------------
# Streaming file access (zero-copy — for full instance retrieval)
# ---------------------------------------------------------------------------

def stream_file(
    token: str,
    db_file: DatabricksFile,
    chunk_size: int = 256 * 1024,
) -> tuple[Iterator[bytes], str | None]:
    """
    Stream an entire file from Databricks Volumes **without buffering**.

    Opens a streaming HTTP connection to the Files API and yields chunks
    as they arrive.  This avoids loading the full file into server memory,
    which is critical for large DICOM instances (multi-frame CT / MR scans).

    The returned generator **must** be fully consumed or explicitly closed
    to release the upstream HTTP connection.  FastAPI's ``StreamingResponse``
    handles this automatically.

    Args:
        token: Databricks bearer token.
        db_file: Target file descriptor.
        chunk_size: Bytes per yield (default 256 KiB).

    Returns:
        ``(chunk_generator, content_length_str | None)``
    """
    headers = _auth_headers(token)
    response = requests.get(db_file.to_api_url(), headers=headers, stream=True)

    if response.status_code != 200:
        body = response.text
        response.close()
        raise RuntimeError(
            f"Failed to stream {db_file.file_path} "
            f"(HTTP {response.status_code}): {body}"
        )

    content_length = response.headers.get("Content-Length")
    logger.info(
        f"Streaming {db_file.file_path} "
        f"(Content-Length: {content_length or 'unknown'}, chunk={chunk_size})"
    )

    def generate() -> Iterator[bytes]:
        try:
            for chunk in response.iter_content(chunk_size=chunk_size):
                if chunk:
                    yield chunk
        finally:
            response.close()

    return generate(), content_length


def get_file_metadata(token: str, db_file: DatabricksFile) -> dict:
    """
    Read DICOM metadata (header + file meta) without loading pixel data.

    Returns a merged JSON dict of the dataset and file-meta information header.
    """
    client_kwargs = {"headers": _auth_headers(token)}
    with fsspec.open(db_file.to_api_url(), "rb", client_kwargs=client_kwargs) as f:
        ds = pydicom.dcmread(f, stop_before_pixels=True)
        result = ds.to_json_dict()
        result.update(ds.file_meta.to_json_dict())
        return result


# ---------------------------------------------------------------------------
# BOT (Basic Offset Table) helpers
# ---------------------------------------------------------------------------

def _extract_from_basic_offsets(f, pixel_data_pos: int, endianness: str) -> list[dict]:
    """
    Parse the DICOM Basic Offset Table and return per-frame byte ranges.

    Note: the **last** frame is intentionally skipped here because the BOT
    only stores *start* offsets; the caller should use
    ``_extract_last_frame`` to recover it.
    """
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
        frames.append({
            "frame_number": idx,
            "frame_size": frame_size,
            "start_pos": start_pos,
            "end_pos": end_pos,
            "pixel_data_pos": pixel_data_pos,
        })
        start_pos = end_pos

    return frames


def _extract_last_frame(
    f, frames: list[dict], basic_offsets: list, pixel_data_pos: int,
    data_start: int | None = None,
) -> dict | None:
    """
    Recover the last frame that ``_extract_from_basic_offsets`` misses.

    For multi-frame files the Item tag sits right after the previous frame's
    end.  For **single-frame** files ``frames`` is empty so the caller must
    pass *data_start* (the file position immediately after the BOT).
    """
    # Where does this frame's Item tag begin?
    if frames:
        item_pos = frames[-1]["end_pos"]
    elif data_start is not None:
        item_pos = data_start
    else:
        return None

    try:
        f.seek(item_pos)
        item_header = f.read(8)
        if len(item_header) == 8 and item_header[:4] == b"\xfe\xff\x00\xe0":
            size = struct.unpack("<I", item_header[4:8])[0]
            return {
                "frame_number": len(basic_offsets) - 1,
                "frame_size": size,
                "start_pos": item_pos + 8,
                "end_pos": item_pos + 8 + size,
                "pixel_data_pos": pixel_data_pos,
            }
    except Exception:
        pass
    return None


def _legacy_extract_frames(f, number_of_frames: int, pixel_data_pos: int,
                           frame_limit: int, start_pos: int, frame_index: int) -> list[dict]:
    """
    Fallback frame extraction by scanning for Item delimiters sequentially.

    Used when the BOT is absent or malformed.
    """
    frame_delimiter = b"\xfe\xff\x00\xe0"
    frames = []
    f.seek(0)

    while frame_index <= number_of_frames and frame_index <= frame_limit:
        f.seek(start_pos)
        file_content = f.read(100)
        delimiter = file_content.find(frame_delimiter)
        if delimiter == -1:
            break

        item_length = struct.unpack("<I", file_content[delimiter + 4: delimiter + 8])[0]
        start_pos = start_pos + delimiter + 8
        end_pos = start_pos + item_length

        if start_pos == end_pos:
            continue

        frames.append({
            "frame_number": frame_index,
            "frame_size": item_length,
            "start_pos": start_pos,
            "end_pos": end_pos,
            "pixel_data_pos": pixel_data_pos,
        })
        start_pos = end_pos
        frame_index += 1

    if frames and frames[0]["frame_size"] < 10000:
        frames.pop(0)  # Remove empty/BOT placeholder frame

    return frames


# ---------------------------------------------------------------------------
# Full BOT computation (PACS-style one-shot indexing)
# ---------------------------------------------------------------------------

def compute_full_bot(token: str, db_file: DatabricksFile) -> dict:
    """
    Compute the complete Basic Offset Table for a DICOM file in **one** pass.

    This mimics how PACS systems pre-index frame offsets at ingest time for
    instant random access.  Opens the file once and extracts:

    * Transfer Syntax UID (needed for the correct MIME type)
    * ALL frame byte offsets (``start_pos``, ``end_pos`` per frame)
    * Pixel data position

    After this function returns, any frame can be retrieved with a single
    byte-range HTTP request using the cached offsets.

    Returns:
        dict with ``transfer_syntax_uid``, ``frames``, ``pixel_data_pos``, ``num_frames``.
    """
    pixel_data_marker = b"\xe0\x7f\x10\x00"
    frames: list[dict] = []

    client_kwargs = {"headers": _auth_headers(token)}

    with fsspec.open(db_file.to_api_url(), "rb", client_kwargs=client_kwargs) as f:
        ds = pydicom.dcmread(f, stop_before_pixels=True)

        transfer_syntax_uid = str(ds.file_meta.TransferSyntaxUID)
        is_compressed = ds.file_meta.TransferSyntaxUID.is_compressed
        number_of_frames = int(ds.get("NumberOfFrames", 1))

        # Locate pixel data element
        f.seek(0)
        pixel_data_pos = f.read(1_000_000).find(pixel_data_marker)

        f.seek(0)
        if is_compressed:
            try:
                endianness = "<" if ds.file_meta.TransferSyntaxUID.is_little_endian else ">"
                frames = _extract_from_basic_offsets(f, pixel_data_pos, endianness)

                # Recover the last frame (BOT only stores start offsets).
                # For single-frame files the loop above produces 0 frames,
                # so we must also pass data_start so the function knows
                # where the first (and only) Item tag lives.
                if len(frames) < number_of_frames:
                    f.seek(pixel_data_pos)
                    buf = f.read(100)
                    offset_pos = buf.find(b"\xfe\xff\x00\xe0")
                    f.seek(pixel_data_pos + offset_pos)
                    offsets = pydicom.encaps.parse_basic_offsets(f, endianness=endianness)
                    # f.tell() is now right after the BOT — first data Item tag
                    data_start = f.tell()

                    last = _extract_last_frame(
                        f, frames, offsets, pixel_data_pos, data_start=data_start
                    )
                    if last:
                        frames.append(last)
                        logger.info(f"BOT: recovered last frame {last['frame_number']}")
            except Exception as exc:
                logger.warning(f"BOT parsing failed ({exc}), falling back to sequential scan")
                frames = _legacy_extract_frames(
                    f, number_of_frames, pixel_data_pos,
                    number_of_frames, pixel_data_pos, 0,
                )
        else:
            item_length = ds.Rows * ds.Columns * (ds.BitsAllocated // 8)
            for idx in range(number_of_frames):
                offset = (idx * item_length) + 12
                frames.append({
                    "frame_number": idx,
                    "frame_size": item_length,
                    "start_pos": pixel_data_pos + offset,
                    "end_pos": pixel_data_pos + offset + item_length - 1,
                    "pixel_data_pos": pixel_data_pos,
                })

    logger.info(
        f"BOT computed for {db_file.file_path}: {len(frames)} frames, "
        f"transfer_syntax={transfer_syntax_uid}, pixel_data_pos={pixel_data_pos}"
    )

    return {
        "transfer_syntax_uid": transfer_syntax_uid,
        "frames": frames,
        "pixel_data_pos": pixel_data_pos,
        "num_frames": number_of_frames,
    }

