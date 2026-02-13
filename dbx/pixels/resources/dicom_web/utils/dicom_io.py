"""
Low-level DICOM file I/O operations.

Provides byte-range reads, **streaming** file delivery, **background
prefetching**, DICOM metadata extraction, and full Basic Offset Table
(BOT) computation for PACS-style frame indexing.

All functions operate on Databricks Volumes via the Files API.

A **persistent ``requests.Session``** with connection pooling is used for
all HTTP calls to the Volumes API.  This avoids the TCP + TLS handshake
overhead (~100 ms) that would otherwise occur on every request, which is
critical when streaming hundreds of instances in a series.
"""

import concurrent.futures
import os
import struct
import threading
from collections.abc import Iterator
from io import BytesIO

import psutil
import pydicom
import requests
from requests.adapters import HTTPAdapter

import dbx.pixels.version as dbx_pixels_version
from dbx.pixels.databricks_file import DatabricksFile
from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("DICOMweb.IO")

# ---------------------------------------------------------------------------
# Resource budget constants (reserve 20 % for the rest of the application)
# ---------------------------------------------------------------------------
_CPU_BUDGET_RATIO = 0.80          # use at most 80 % of available cores
_RAM_BUDGET_RATIO = 0.80          # prefetcher may cache up to 80 % of free RAM
_DISK_TOTAL_BYTES = 100 * 1024 ** 3   # 100 GB assumed disk
_DISK_BUDGET_BYTES = int(_DISK_TOTAL_BYTES * 0.80)  # keep 20 % headroom


# ---------------------------------------------------------------------------
# Persistent HTTP session (connection pool — reused across all requests)
# ---------------------------------------------------------------------------
# A single Session holds a pool of TCP+TLS connections to Databricks.
# Subsequent requests to the same host skip the handshake entirely.

_session = requests.Session()
_adapter = HTTPAdapter(
    pool_connections=20,   # distinct host pools (typically 1 for Databricks)
    pool_maxsize=50,       # concurrent connections per host
)
_session.mount("https://", _adapter)
_session.mount("http://", _adapter)


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

    Uses the persistent session so that consecutive calls (e.g. fetching
    427 instances in a series) reuse the same TCP+TLS connection.

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

    response = _session.get(db_file.to_api_url(), headers=headers)
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

    Uses the persistent session with ``stream=True``.  The connection is
    held for the duration of the transfer and returned to the pool once
    the generator is closed.

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
    response = _session.get(db_file.to_api_url(), headers=headers, stream=True)

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


# ---------------------------------------------------------------------------
# Background file prefetcher (parallel downloads from Volumes)
# ---------------------------------------------------------------------------


class FilePrefetcher:
    """
    Resource-aware background file prefetcher for Databricks Volumes.

    When a QIDO-RS query returns instance paths, the prefetcher downloads
    files **in parallel** using a thread pool.  By the time the viewer
    requests individual instances via WADO-RS, the content is already in
    memory and can be served instantly.

    Resource limits (computed once at construction):

    * **CPU** — worker threads = ``floor(cpu_count × 0.80)``, so 20 % of
      cores are always free for request handling, streaming, etc.
    * **RAM** — total bytes held in the prefetch cache are bounded by
      ``available_ram × 0.80``.  Once the budget is exhausted, new
      ``schedule()`` calls are silently skipped and the viewer falls back
      to streaming.
    * **Per-file size** — files larger than *max_file_bytes* (default
      5 MB) are **not** prefetched.  Large multi-frame DICOMs gain
      nothing from being held in memory because their transfer time
      dominates; streaming them directly is equally efficient.
    """

    _DEFAULT_MAX_FILE_BYTES = 5 * 1024 * 1024   # 5 MB

    def __init__(
        self,
        max_workers: int | None = None,
        max_memory_bytes: int | None = None,
        max_file_bytes: int | None = None,
    ):
        # ── CPU budget ──────────────────────────────────────────────
        cpu_count = os.cpu_count() or 4
        self._max_workers = max_workers or max(1, int(cpu_count * _CPU_BUDGET_RATIO))

        self._pool = concurrent.futures.ThreadPoolExecutor(
            max_workers=self._max_workers, thread_name_prefix="volprefetch",
        )

        # ── RAM budget ──────────────────────────────────────────────
        if max_memory_bytes is not None:
            self._max_memory_bytes = max_memory_bytes
        else:
            available = psutil.virtual_memory().available
            self._max_memory_bytes = int(available * _RAM_BUDGET_RATIO)

        # ── Per-file size cap ───────────────────────────────────────
        self._max_file_bytes = (
            max_file_bytes if max_file_bytes is not None
            else self._DEFAULT_MAX_FILE_BYTES
        )

        self._futures: dict[str, concurrent.futures.Future] = {}
        self._lock = threading.Lock()
        self._memory_used: int = 0        # bytes of completed, unconsumed results
        self._memory_skipped: int = 0     # downloads skipped due to budget
        self._files_skipped_too_large: int = 0  # downloads skipped (file too big)

        logger.info(
            f"Prefetcher initialised: workers={self._max_workers} "
            f"(of {cpu_count} cores), memory budget="
            f"{self._max_memory_bytes / (1024**2):.0f} MB, "
            f"max file size={self._max_file_bytes / (1024**2):.1f} MB"
        )

    # -- public API -------------------------------------------------------

    def schedule(self, token: str, paths: list[str]) -> int:
        """
        Schedule background download of files from Volumes.

        Non-blocking — returns immediately.  Paths that are already
        scheduled or completed are skipped.  New downloads are also
        skipped when the memory budget has been reached.

        Returns the number of **newly** scheduled downloads.
        """
        with self._lock:
            new_count = 0
            skipped = 0
            for path in paths:
                if path in self._futures:
                    continue
                if self._memory_used >= self._max_memory_bytes:
                    skipped += 1
                    continue
                self._futures[path] = self._pool.submit(
                    self._fetch_one, token, path,
                )
                new_count += 1
            self._memory_skipped += skipped
            if skipped:
                logger.warning(
                    f"Prefetch memory budget reached — "
                    f"skipped {skipped} downloads "
                    f"(used {self._memory_used / (1024**2):.0f} MB "
                    f"/ {self._max_memory_bytes / (1024**2):.0f} MB)"
                )
            return new_count

    def get(self, path: str, timeout: float = 5.0) -> bytes | None:
        """
        Get prefetched file content.

        * Already downloaded → returns **instantly**.
        * Still downloading → waits up to *timeout* seconds.
        * Not scheduled / failed → returns ``None`` (caller falls back to
          streaming from Volumes).
        """
        with self._lock:
            future = self._futures.pop(path, None)
        if future is None:
            return None
        try:
            content = future.result(timeout=timeout)
            if content is None:
                return None  # file was too large — fall back to streaming
            with self._lock:
                self._memory_used -= len(content)
            return content
        except concurrent.futures.TimeoutError:
            logger.warning(f"Prefetch timeout for {path}")
            return None
        except Exception as exc:
            logger.warning(f"Prefetch failed for {path}: {exc}")
            return None

    @property
    def stats(self) -> dict:
        """Snapshot of prefetcher state (JSON-serialisable)."""
        with self._lock:
            total = len(self._futures)
            done = sum(1 for f in self._futures.values() if f.done())
            return {
                "total": total,
                "done": done,
                "pending": total - done,
                "memory_used_mb": round(self._memory_used / (1024 ** 2), 2),
                "memory_budget_mb": round(self._max_memory_bytes / (1024 ** 2), 2),
                "memory_skipped": self._memory_skipped,
                "max_file_size_mb": round(self._max_file_bytes / (1024 ** 2), 2),
                "files_skipped_too_large": self._files_skipped_too_large,
                "pool_workers": self._max_workers,
            }

    # -- internal ---------------------------------------------------------

    def _fetch_one(self, token: str, path: str) -> bytes | None:
        """
        Download a single file from Volumes (runs in a worker thread).

        Uses ``stream=True`` so the response headers are read first
        without downloading the body.  If ``Content-Length`` exceeds the
        per-file size cap the connection is closed immediately —
        no bandwidth or memory is wasted on large files.

        BOT computation is **not** performed here — it is deferred to
        the first frame-level request (``_resolve_frame_offsets``) so
        that WADO-RS instance retrievals (no frames) stay lightweight.

        Returns ``None`` when the file is too large (caller falls back
        to streaming).
        """
        db_file = DatabricksFile.from_full_path(path)
        headers = _auth_headers(token)
        response = _session.get(
            db_file.to_api_url(), headers=headers, stream=True,
        )

        if response.status_code != 200:
            response.close()
            raise RuntimeError(
                f"Prefetch HTTP {response.status_code} for {path}"
            )

        # ── Check file size before downloading the body ─────────────
        content_length = int(response.headers.get("Content-Length", 0))
        if content_length > self._max_file_bytes:
            response.close()
            with self._lock:
                self._files_skipped_too_large += 1
            logger.debug(
                f"Prefetch skipped {path} — "
                f"{content_length / (1024**2):.1f} MB exceeds "
                f"{self._max_file_bytes / (1024**2):.1f} MB cap"
            )
            return None

        # ── Download body ───────────────────────────────────────────
        content = response.content  # reads the streamed body
        response.close()

        with self._lock:
            self._memory_used += len(content)

        return content


# Module-level singleton (resource-aware)
file_prefetcher = FilePrefetcher()


# ---------------------------------------------------------------------------
# Background BOT pre-computation (for files that bypass the prefetcher)
# ---------------------------------------------------------------------------



# ---------------------------------------------------------------------------
# DICOM metadata
# ---------------------------------------------------------------------------

def get_file_metadata(token: str, db_file: DatabricksFile) -> dict:
    """
    Read DICOM metadata (header + file meta) without loading pixel data.

    Uses a byte-range request through the **pooled ``_session``** so that
    no new TLS handshake is needed.  Only the first 64–2048 KB of the file
    is downloaded (enough to cover virtually every DICOM header).

    Returns a merged JSON dict of the dataset and file-meta information header.
    """
    raw = _fetch_bytes_range(token, db_file, 0, _HEADER_INITIAL_BYTES)

    # If the header is larger than the initial chunk, extend.
    try:
        ds = pydicom.dcmread(BytesIO(raw), stop_before_pixels=True)
    except Exception:
        raw = _fetch_bytes_range(token, db_file, 0, _HEADER_EXTENDED_BYTES)
        ds = pydicom.dcmread(BytesIO(raw), stop_before_pixels=True)

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

_PIXEL_DATA_MARKER = b"\xe0\x7f\x10\x00"

# Initial header download size.  Most DICOM headers are < 32 KB so
# 64 KB covers virtually all files without touching pixel data.
_HEADER_INITIAL_BYTES = 64 * 1024
# Fallback for files with very large private headers.
_HEADER_EXTENDED_BYTES = 2 * 1024 * 1024


def _fetch_bytes_range(
    token: str,
    db_file: DatabricksFile,
    start: int = 0,
    end: int | None = None,
) -> bytes:
    """
    Fetch a byte range from Volumes using the **pooled** ``_session``.

    If *end* is ``None`` the entire file is returned (no Range header).
    """
    headers = _auth_headers(token)
    if end is not None:
        headers["Range"] = f"bytes={start}-{end - 1}"
    resp = _session.get(db_file.to_api_url(), headers=headers)
    if resp.status_code not in (200, 206):
        raise RuntimeError(
            f"HTTP {resp.status_code} fetching {db_file.file_path}"
        )
    return resp.content


def compute_full_bot(token: str, db_file: DatabricksFile) -> dict:
    """
    Compute the complete Basic Offset Table for a DICOM file.

    This mimics how PACS systems pre-index frame offsets at ingest time for
    instant random access.

    **Optimisations** (compared to the legacy fsspec-based approach):

    * Uses the **pooled ``_session``** — no per-call TLS handshake.
    * **Uncompressed files** only download the first 64 KB (header) and
      compute frame offsets analytically.  No pixel data is read.
    * **Compressed files** download the full file once and parse the BOT
      from a ``BytesIO`` buffer.

    Returns:
        dict with ``transfer_syntax_uid``, ``frames``, ``pixel_data_pos``,
        ``num_frames``.
    """
    # ── Step 1: Download header portion (covers metadata + pixel data tag) ──
    raw = _fetch_bytes_range(token, db_file, 0, _HEADER_INITIAL_BYTES)
    pixel_data_pos = raw.find(_PIXEL_DATA_MARKER)

    if pixel_data_pos == -1 and len(raw) >= _HEADER_INITIAL_BYTES:
        # Very large header (rare) — extend the range.
        raw = _fetch_bytes_range(token, db_file, 0, _HEADER_EXTENDED_BYTES)
        pixel_data_pos = raw.find(_PIXEL_DATA_MARKER)

    # ── Step 2: Parse DICOM metadata from the downloaded bytes ──
    ds = pydicom.dcmread(BytesIO(raw), stop_before_pixels=True)

    transfer_syntax_uid = str(ds.file_meta.TransferSyntaxUID)
    is_compressed = ds.file_meta.TransferSyntaxUID.is_compressed
    number_of_frames = int(ds.get("NumberOfFrames", 1))
    frames: list[dict] = []

    if not is_compressed:
        # ── Uncompressed: analytical BOT — zero additional I/O ──────────
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
    else:
        # ── Compressed: need the full file for BOT + last-frame recovery ─
        raw = _fetch_bytes_range(token, db_file)          # full file
        pixel_data_pos = raw.find(_PIXEL_DATA_MARKER)     # recalculate

        f = BytesIO(raw)
        try:
            endianness = (
                "<" if ds.file_meta.TransferSyntaxUID.is_little_endian else ">"
            )
            frames = _extract_from_basic_offsets(f, pixel_data_pos, endianness)

            if len(frames) < number_of_frames:
                f.seek(pixel_data_pos)
                buf = f.read(100)
                offset_pos = buf.find(b"\xfe\xff\x00\xe0")
                f.seek(pixel_data_pos + offset_pos)
                offsets = pydicom.encaps.parse_basic_offsets(
                    f, endianness=endianness,
                )
                data_start = f.tell()

                last = _extract_last_frame(
                    f, frames, offsets, pixel_data_pos,
                    data_start=data_start,
                )
                if last:
                    frames.append(last)
                    logger.info(
                        f"BOT: recovered last frame {last['frame_number']}"
                    )
        except Exception as exc:
            logger.warning(
                f"BOT parsing failed ({exc}), falling back to sequential scan"
            )
            f = BytesIO(raw)
            frames = _legacy_extract_frames(
                f, number_of_frames, pixel_data_pos,
                number_of_frames, pixel_data_pos, 0,
            )

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

