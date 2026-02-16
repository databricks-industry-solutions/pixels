"""
Streaming multipart/related parser with per-part routing to Databricks Volumes.

Parses multipart boundaries on-the-fly as bytes arrive from the client,
extracts DICOM UIDs from the first 64 KB of each part, and streams each
part directly to its final ``/stow/{StudyUID}/{SeriesUID}/{SOPUID}.dcm``
location on Volumes — no intermediate ``.mpr`` file, no Spark split job.

Memory usage is **O(header_buf + chunk_size)** per part (~128 KB typical).
"""

import os
import uuid
from io import BytesIO
from typing import AsyncIterator

from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("DICOMweb.MultipartStream")

_HEADER_BUF_SIZE = 64 * 1024  # 64 KB — enough for virtually all DICOM headers


# ---------------------------------------------------------------------------
# Lightweight DICOM UID extraction from raw bytes
# ---------------------------------------------------------------------------

def extract_dicom_uids(raw: bytes) -> dict[str, str | int]:
    """
    Extract Study/Series/SOP Instance UIDs from the first bytes of a DICOM part.

    Uses ``pydicom.dcmread`` with ``stop_before_pixels=True`` on a BytesIO
    buffer.  Falls back to empty strings on any parsing failure — the caller
    uses UUID-based naming as a fallback.
    """
    import pydicom

    try:
        ds = pydicom.dcmread(BytesIO(raw), stop_before_pixels=True, force=True)
        return {
            "study_uid": str(getattr(ds, "StudyInstanceUID", "") or ""),
            "series_uid": str(getattr(ds, "SeriesInstanceUID", "") or ""),
            "sop_uid": str(getattr(ds, "SOPInstanceUID", "") or ""),
            "num_frames": int(getattr(ds, "NumberOfFrames", 1) or 1),
        }
    except Exception as exc:
        logger.debug(f"DICOM UID extraction failed: {exc}")
        return {"study_uid": "", "series_uid": "", "sop_uid": "", "num_frames": 1}


# ---------------------------------------------------------------------------
# Async streaming multipart/related parser
# ---------------------------------------------------------------------------

class AsyncMultipartParser:
    """
    Streaming parser for ``multipart/related`` bodies.

    Reads from an async byte stream, detects boundary markers on-the-fly,
    and yields ``(headers, body_generator)`` tuples whose bodies can be
    consumed as async iterators.

    Memory usage is O(chunk_size + boundary_length) regardless of part size.

    The caller **must** fully consume (or drain) each part's body generator
    before advancing to the next part.  The :meth:`parts` method drains any
    unconsumed body automatically before yielding the next part.
    """

    def __init__(self, boundary: str, stream):
        self._boundary = boundary
        self._stream = stream
        self._delimiter = f"\r\n--{boundary}".encode()
        self._first_delimiter = f"--{boundary}".encode()
        self._end_marker = b"--"
        self._buf = bytearray()
        self._stream_exhausted = False
        self._part_consumed = True

    async def _fill_buffer(self, min_bytes: int = 0) -> bool:
        """Read from stream until buffer has at least *min_bytes* or stream ends."""
        while len(self._buf) < min_bytes and not self._stream_exhausted:
            try:
                chunk = await self._stream.__anext__()
                self._buf.extend(chunk)
            except StopAsyncIteration:
                self._stream_exhausted = True
                return False
        return len(self._buf) >= min_bytes

    async def _read_until(self, marker: bytes) -> bytes | None:
        """Read until *marker* is found.  Returns bytes before marker."""
        while True:
            idx = self._buf.find(marker)
            if idx != -1:
                result = bytes(self._buf[:idx])
                self._buf = self._buf[idx + len(marker):]
                return result
            if self._stream_exhausted:
                return None
            await self._fill_buffer(len(self._buf) + 1)

    @staticmethod
    def _parse_headers(raw: bytes) -> dict[str, str]:
        """Parse MIME headers from raw bytes."""
        headers: dict[str, str] = {}
        for line in raw.decode("utf-8", errors="replace").splitlines():
            if ":" in line:
                key, val = line.split(":", 1)
                headers[key.strip().lower()] = val.strip()
        return headers

    async def _iter_part_body(self) -> AsyncIterator[bytes]:
        """Yield body bytes until the next boundary or end of stream."""
        holdback = len(self._delimiter)

        while True:
            if not self._stream_exhausted and len(self._buf) < holdback + 4096:
                await self._fill_buffer(holdback + 4096)

            idx = self._buf.find(self._delimiter)
            if idx != -1:
                if idx > 0:
                    yield bytes(self._buf[:idx])
                self._buf = self._buf[idx + len(self._delimiter):]
                self._part_consumed = True
                return

            safe = len(self._buf) - holdback
            if safe > 0:
                yield bytes(self._buf[:safe])
                self._buf = self._buf[safe:]
            elif self._stream_exhausted:
                if self._buf:
                    yield bytes(self._buf)
                    self._buf.clear()
                self._part_consumed = True
                return

    async def parts(self) -> AsyncIterator[tuple[dict[str, str], AsyncIterator[bytes]]]:
        """
        Yield ``(headers, body_iter)`` for each part in the message.

        The caller must fully consume *body_iter* before advancing.
        Any unconsumed body bytes are drained automatically.
        """
        await self._fill_buffer(len(self._first_delimiter) + 4)

        idx = self._buf.find(self._first_delimiter)
        if idx == -1:
            logger.error("No opening boundary found in multipart body")
            return

        self._buf = self._buf[idx + len(self._first_delimiter):]

        while True:
            await self._fill_buffer(2)

            if len(self._buf) >= 2 and self._buf[:2] == self._end_marker:
                return

            if len(self._buf) >= 2 and self._buf[:2] == b"\r\n":
                self._buf = self._buf[2:]

            header_bytes = await self._read_until(b"\r\n\r\n")
            if header_bytes is None:
                return

            headers = self._parse_headers(header_bytes)

            self._part_consumed = False
            body_gen = self._iter_part_body()
            yield headers, body_gen

            if not self._part_consumed:
                async for _ in body_gen:
                    pass


# ---------------------------------------------------------------------------
# Per-part upload to Volumes with UID extraction
# ---------------------------------------------------------------------------

async def _upload_one_part(
    token: str,
    host: str,
    stow_base: str,
    client,
    headers: dict[str, str],
    body_gen: AsyncIterator[bytes],
) -> dict:
    """
    Upload a single DICOM part to Volumes.

    1. Buffers the first 64 KB to extract DICOM UIDs.
    2. Determines destination: ``{stow_base}/{StudyUID}/{SeriesUID}/{SOPUID}.dcm``.
    3. Streams (buffered header + remaining body) via PUT to the Volumes Files API.
    """
    fallback_id = uuid.uuid4().hex

    try:
        # -- Phase 1: buffer first 64 KB for UID extraction ----------------
        header_buf = bytearray()
        has_more = True

        try:
            while len(header_buf) < _HEADER_BUF_SIZE:
                chunk = await body_gen.__anext__()
                header_buf.extend(chunk)
        except StopAsyncIteration:
            has_more = False

        uids = extract_dicom_uids(bytes(header_buf))
        study_uid = uids["study_uid"] or "unknown_study"
        series_uid = uids["series_uid"] or "unknown_series"
        sop_uid = uids["sop_uid"] or fallback_id
        num_frames = uids["num_frames"]

        dest_path = f"{stow_base}/{study_uid}/{series_uid}/{sop_uid}.dcm"
        api_path = dest_path.lstrip("/")
        url = f"https://{host}/api/2.0/fs/files/{api_path}"

        # -- Phase 2: stream to Volumes ------------------------------------
        total_size = 0

        async def _upload_body():
            nonlocal total_size
            total_size += len(header_buf)
            yield bytes(header_buf)
            if has_more:
                try:
                    while True:
                        chunk = await body_gen.__anext__()
                        total_size += len(chunk)
                        yield chunk
                except StopAsyncIteration:
                    pass

        rp_req = client.build_request(
            "PUT",
            url,
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/octet-stream",
            },
            content=_upload_body(),
        )
        response = await client.send(rp_req)

        if response.status_code not in (200, 204):
            raise RuntimeError(
                f"Volumes PUT failed (HTTP {response.status_code}): "
                f"{response.text[:500]}"
            )

        logger.info(
            f"Streamed part → {dest_path} "
            f"({total_size} bytes, SOP={sop_uid})"
        )

        return {
            "output_path": dest_path,
            "file_size": total_size,
            "study_uid": study_uid,
            "series_uid": series_uid,
            "sop_uid": sop_uid,
            "num_frames": num_frames,
            "status": "SUCCESS",
            "error_message": None,
        }
    except Exception as exc:
        logger.error(f"Part upload failed: {exc}")
        return {
            "output_path": "",
            "file_size": 0,
            "study_uid": "",
            "series_uid": "",
            "sop_uid": "",
            "num_frames": 1,
            "status": "FAILED",
            "error_message": str(exc),
        }


# ---------------------------------------------------------------------------
# Orchestrator: stream-and-split entire multipart body to Volumes
# ---------------------------------------------------------------------------

async def async_stream_split_to_volumes(
    token: str,
    stow_base: str,
    body_stream,
    content_type: str,
) -> list[dict]:
    """
    Parse a ``multipart/related`` body on-the-fly and stream each DICOM
    part directly to its final location on Volumes.

    For each part:

    1. Buffers the first 64 KB to extract DICOM UIDs via ``pydicom``.
    2. Determines destination path:
       ``{stow_base}/{StudyUID}/{SeriesUID}/{SOPUID}.dcm``
    3. Opens a streaming PUT to the Volumes Files API.
    4. Sends the buffered header + remaining body bytes.

    Memory: O(64 KB + chunk_size) per part.

    Args:
        token: Databricks bearer token.
        stow_base: Volume path prefix
            (e.g. ``/Volumes/catalog/schema/volume/stow``).
        body_stream: Async iterable of ``bytes`` chunks
            (e.g. ``request.stream()``).
        content_type: Full ``Content-Type`` header value including boundary.

    Returns:
        List of per-part result dicts with ``output_path``, ``file_size``,
        ``study_uid``, ``series_uid``, ``sop_uid``, ``num_frames``,
        ``status``, ``error_message``.
    """
    import httpx

    boundary = _extract_boundary(content_type)
    if not boundary:
        raise ValueError(f"No boundary found in Content-Type: {content_type}")

    host = (
        os.environ.get("DATABRICKS_HOST", "")
        .replace("https://", "")
        .replace("http://", "")
        .rstrip("/")
    )
    if not host:
        raise ValueError("DATABRICKS_HOST not configured")

    parser = AsyncMultipartParser(boundary, body_stream.__aiter__())
    results: list[dict] = []

    async with httpx.AsyncClient(timeout=httpx.Timeout(300.0)) as client:
        async for headers, body_gen in parser.parts():
            result = await _upload_one_part(
                token, host, stow_base, client, headers, body_gen,
            )
            results.append(result)

    succeeded = sum(1 for r in results if r["status"] == "SUCCESS")
    failed = sum(1 for r in results if r["status"] == "FAILED")
    logger.info(
        f"Streaming split complete: {succeeded} succeeded, {failed} failed "
        f"out of {len(results)} part(s)"
    )

    return results


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _extract_boundary(content_type: str) -> str | None:
    """Extract the ``boundary`` parameter from a Content-Type header."""
    for part in content_type.split(";"):
        part = part.strip()
        if part.lower().startswith("boundary="):
            return part.split("=", 1)[1].strip().strip('"')
    return None
