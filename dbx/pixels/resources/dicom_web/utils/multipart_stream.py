"""
Streaming multipart/related parser with per-part routing to Databricks Volumes.

Parses multipart boundaries on-the-fly as bytes arrive from the client,
extracts DICOM UIDs from the first 64 KB of each part, and streams each
part directly to its final ``/stow/{StudyUID}/{SeriesUID}/{SOPUID}.dcm``
location on Volumes — no intermediate ``.mpr`` file, no Spark split job.

Memory usage is **O(header_buf + chunk_size)** per part (~128 KB typical).

**Back-pressure prevention**: the client body is immediately drained into
an internal ``asyncio.Queue`` (unbounded), decoupled from the per-part
Volumes PUT writes.  This prevents the Databricks Apps reverse proxy from
closing an idle inbound connection when Volumes writes are slower than the
client upload rate.
"""

import asyncio
import os
import struct
import uuid
from io import BytesIO
from typing import AsyncIterator

from dbx.pixels.logging import LoggerProvider
from dbx.pixels.resources.dicom_web.utils.dicom_io import _get_upload_client, _get_upload_semaphore

logger = LoggerProvider("DICOMweb.MultipartStream")

_HEADER_BUF_SIZE = 64 * 1024  # 64 KB — enough for virtually all DICOM headers


# ---------------------------------------------------------------------------
# Lightweight DICOM UID extraction from raw bytes
# ---------------------------------------------------------------------------

# DICOM tag bytes (little-endian) for the UIDs we need
_TAG_SOP_INSTANCE_UID = b"\x08\x00\x18\x00"       # (0008,0018)
_TAG_STUDY_INSTANCE_UID = b"\x20\x00\x0D\x00"      # (0020,000D)
_TAG_SERIES_INSTANCE_UID = b"\x20\x00\x0E\x00"     # (0020,000E)
_TAG_NUMBER_OF_FRAMES = b"\x28\x00\x08\x00"         # (0028,0008)

# Known Explicit VR codes that use a 2-byte length field (short form)
_SHORT_VR = {
    b"AE", b"AS", b"AT", b"CS", b"DA", b"DS", b"DT", b"FL", b"FD",
    b"IS", b"LO", b"LT", b"PN", b"SH", b"SL", b"SS", b"ST", b"TM",
    b"UI", b"UL", b"US",
}


def _scan_uid_tag(raw: bytes, tag_bytes: bytes) -> str:
    """
    Scan raw DICOM bytes for a specific tag and return its UID string value.

    Handles both Explicit VR (``UI`` with 2-byte length) and Implicit VR
    (4-byte length) layouts.  Only returns values that look like valid
    DICOM UIDs (digits and dots).
    """
    offset = 0
    end = len(raw)
    while offset < end - 8:
        idx = raw.find(tag_bytes, offset)
        if idx == -1 or idx + 8 > end:
            return ""
        pos = idx + 4  # skip past the 4 tag bytes

        # Try Explicit VR first: next 2 bytes are ASCII VR letters
        vr = raw[pos:pos + 2]
        if vr in _SHORT_VR:
            # Explicit VR short form: VR(2) + length(2) + value
            if pos + 4 > end:
                return ""
            length = struct.unpack_from("<H", raw, pos + 2)[0]
            val_start = pos + 4
        elif vr.isalpha() and vr.isupper():
            # Explicit VR long form: VR(2) + 0x0000(2) + length(4) + value
            if pos + 8 > end:
                return ""
            length = struct.unpack_from("<I", raw, pos + 4)[0]
            val_start = pos + 8
        else:
            # Implicit VR: length(4) + value
            if pos + 4 > end:
                return ""
            length = struct.unpack_from("<I", raw, pos)[0]
            val_start = pos + 4

        if length == 0 or length > 128 or val_start + length > end:
            offset = idx + 4
            continue

        value = raw[val_start:val_start + length].rstrip(b"\x00").decode("ascii", errors="replace").strip()

        # Validate: DICOM UIDs contain only digits and dots
        if value and all(c in "0123456789." for c in value):
            return value

        offset = idx + 4

    return ""


def extract_dicom_uids(raw: bytes) -> dict[str, str | int]:
    """
    Extract Study/Series/SOP Instance UIDs from the first bytes of a DICOM part.

    **Strategy**: tries ``pydicom.dcmread`` first (handles all edge cases).
    If that fails (common with truncated buffers), falls back to a
    lightweight raw byte scan that searches for tag patterns directly
    in the binary data — no full DICOM parsing needed.
    """
    result: dict[str, str | int] = {
        "study_uid": "", "series_uid": "", "sop_uid": "", "num_frames": 1,
    }

    # -- Attempt 1: pydicom (most accurate) --------------------------------
    try:
        import pydicom
        ds = pydicom.dcmread(BytesIO(raw), stop_before_pixels=True, force=True)
        study = str(getattr(ds, "StudyInstanceUID", "") or "")
        series = str(getattr(ds, "SeriesInstanceUID", "") or "")
        sop = str(getattr(ds, "SOPInstanceUID", "") or "")
        nf = int(getattr(ds, "NumberOfFrames", 1) or 1)

        if sop:
            logger.debug(
                f"pydicom extracted UIDs: SOP={sop}, Study={study}, "
                f"Series={series}, frames={nf}"
            )
            return {"study_uid": study, "series_uid": series, "sop_uid": sop, "num_frames": nf}

        logger.warning(
            "pydicom parsed the buffer but found no SOPInstanceUID — "
            "falling back to raw byte scan"
        )
    except Exception as exc:
        logger.warning(
            f"pydicom failed on {len(raw)}-byte buffer ({type(exc).__name__}: {exc}) "
            f"— falling back to raw byte scan"
        )

    # -- Attempt 2: raw byte scan (resilient to truncated buffers) ---------
    sop = _scan_uid_tag(raw, _TAG_SOP_INSTANCE_UID)
    study = _scan_uid_tag(raw, _TAG_STUDY_INSTANCE_UID)
    series = _scan_uid_tag(raw, _TAG_SERIES_INSTANCE_UID)
    nf_str = _scan_uid_tag(raw, _TAG_NUMBER_OF_FRAMES)

    if sop:
        logger.debug(
            f"Raw byte scan extracted UIDs: SOP={sop}, Study={study}, "
            f"Series={series}"
        )
    else:
        logger.warning(
            f"Both pydicom and raw scan failed to find SOPInstanceUID "
            f"in {len(raw)}-byte buffer"
        )

    return {
        "study_uid": study,
        "series_uid": series,
        "sop_uid": sop,
        "num_frames": int(nf_str) if nf_str.isdigit() else 1,
    }


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

        # -- Phase 2: stream to storage ------------------------------------
        total_size = len(header_buf)

        extra_bytes = [0]  # mutable container so inner generator can accumulate

        async def _part_stream():
            """Yield buffered header then remaining body chunks."""
            yield bytes(header_buf)
            if has_more:
                try:
                    while True:
                        chunk = await body_gen.__anext__()
                        extra_bytes[0] += len(chunk)
                        yield chunk
                except StopAsyncIteration:
                    pass

        # ── Direct cloud upload fast path ──────────────────────────────
        from .cloud_direct_upload import DIRECT_UPLOAD_ENABLED, async_stream_to_cloud, resolve_cloud_url, get_temp_credentials
        _direct_ok = False
        if DIRECT_UPLOAD_ENABLED:
            try:
                _h = (
                    os.environ.get("DATABRICKS_HOST", "")
                    .replace("https://", "").replace("http://", "").rstrip("/")
                )
                cloud_url = await asyncio.to_thread(resolve_cloud_url, _h, token, dest_path)
                creds = await asyncio.to_thread(get_temp_credentials, _h, token, cloud_url)
                from .cloud_direct_upload import async_stream_to_cloud
                await async_stream_to_cloud(token, _h, cloud_url, _part_stream())
                _direct_ok = True
            except Exception as exc:
                logger.warning(
                    "Direct cloud upload failed (%s) — falling back to Files API: %s",
                    type(exc).__name__, exc,
                )

        total_size += extra_bytes[0]

        if not _direct_ok:
            # ── Files API fallback ─────────────────────────────────────
            rp_req = client.build_request(
                "PUT",
                url,
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/octet-stream",
                },
                content=_part_stream(),
            )
            async with _get_upload_semaphore():
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

    Memory: O(64 KB + chunk_size) per part, plus the read-ahead queue
    (unbounded, but at most one in-flight chunk per producer step).

    **Back-pressure prevention**: an ``asyncio.Queue`` eagerly drains the
    client body regardless of how fast individual Volumes PUTs complete.
    The multipart parser reads from the queue, so the inbound connection
    stays active throughout the upload, preventing proxy idle-timeouts.

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

    # ── Read-ahead: drain client body into a bounded queue independently of
    #    per-part Volumes writes.  256 × ~64 KB ≈ 16 MB per upload, which
    #    absorbs brief Volumes write pauses without unbounded memory growth.
    #    Back-pressure propagates to the OS socket only when the queue is
    #    full (i.e., Volumes is consistently slower than the client), which
    #    is acceptable — the proxy only cares about *short* idle gaps.
    _QUEUE_MAXSIZE = int(os.environ.get("STOW_READ_AHEAD_CHUNKS", "256"))
    queue: asyncio.Queue = asyncio.Queue(maxsize=_QUEUE_MAXSIZE)

    async def _drain_client() -> None:
        try:
            async for chunk in body_stream:
                await queue.put(chunk)
        finally:
            await queue.put(None)  # sentinel

    async def _queue_stream():
        """Async iterator that yields chunks from the queue."""
        while True:
            chunk = await queue.get()
            if chunk is None:
                return
            yield chunk

    drain_task = asyncio.create_task(_drain_client())

    # Use the process-wide shared client — no TCP+TLS handshake per upload.
    # Do NOT use `async with` here: closing a shared client would break all
    # other concurrent uploads that are still using it.
    client = _get_upload_client()

    results: list[dict] = []
    try:
        parser = AsyncMultipartParser(boundary, _queue_stream())
        async for headers, body_gen in parser.parts():
            result = await _upload_one_part(
                token, host, stow_base, client, headers, body_gen,
            )
            results.append(result)
    finally:
        if not drain_task.done():
            drain_task.cancel()
        try:
            await drain_task
        except asyncio.CancelledError:
            pass

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
