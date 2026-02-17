"""
Low-level DICOM file I/O operations.

Provides byte-range reads, **streaming** file delivery, **background
prefetching**, DICOM metadata extraction, and frame offset table
computation for PACS-style frame indexing.

**Frame offset computation** for compressed files uses a tiered strategy:

1. **Extended Offset Table** ``(7FE0,0001)`` + ``(7FE0,0002)`` — zero
   additional I/O when these tags are present in the header.
2. **Streaming Item tag scan** — a ranged HTTP stream reads only the
   8-byte Item headers, keeping memory at O(num_frames × 50 B).
3. **Full file download** — legacy fallback for malformed files.

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
import time
from collections.abc import Iterator
from io import BytesIO

import psutil
import pydicom
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

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
#
# The retry strategy handles transient connection and SSL errors that
# commonly occur during large file uploads (e.g. 175 MB DICOM instances).
# PUT is included in the allowed methods because it is idempotent.

_retry_strategy = Retry(
    total=3,                          # up to 3 retries (4 attempts total)
    backoff_factor=1,                 # wait 1s, 2s, 4s between retries
    status_forcelist=[502, 503, 504], # retry on gateway / server errors
    allowed_methods=["GET", "HEAD", "PUT", "OPTIONS"],  # PUT is idempotent
    raise_on_status=False,            # let caller inspect the response
)

_session = requests.Session()
_adapter = HTTPAdapter(
    pool_connections=20,   # distinct host pools (typically 1 for Databricks)
    pool_maxsize=50,       # concurrent connections per host
    max_retries=_retry_strategy,
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
# Buffered stream reader (for sequential parsing of HTTP streams)
# ---------------------------------------------------------------------------

class BufferedStreamReader:
    """
    Lightweight buffered reader over an HTTP streaming response.

    Provides ``read_exact(n)`` and ``skip(n)`` operations that work
    correctly across arbitrary ``iter_content`` chunk boundaries, while
    tracking the **absolute file position** so that frame byte-ranges
    can be recorded for future byte-range reads.

    When *tee_file* is provided, every byte consumed (via ``read_exact``
    or ``skip``) is also written to that file-like object.  This allows
    the pixel data region to be saved to local disk as a side-effect of
    the streaming scan — enabling subsequent frame reads from local
    storage instead of remote HTTP byte-range requests.

    The reader maintains a small internal buffer (at most one chunk
    plus a partial leftover from the previous read) — memory usage is
    O(chunk_size), not O(stream_size).
    """

    def __init__(
        self,
        response: requests.Response,
        chunk_size: int = 256 * 1024,
        start_position: int = 0,
        tee_file=None,
    ):
        self._iter = response.iter_content(chunk_size=chunk_size)
        self._response = response
        self._buf = b""
        self._position = start_position
        self._tee_file = tee_file

    @property
    def position(self) -> int:
        """Current absolute file position."""
        return self._position

    def read_exact(self, n: int) -> bytes:
        """Read exactly *n* bytes from the stream.

        Raises ``EOFError`` if the stream ends before *n* bytes are
        available.
        """
        while len(self._buf) < n:
            try:
                chunk = next(self._iter)
                if chunk:
                    self._buf += chunk
            except StopIteration:
                raise EOFError(
                    f"Unexpected end of stream at position {self._position} "
                    f"(wanted {n} bytes, have {len(self._buf)})"
                )

        result = self._buf[:n]
        self._buf = self._buf[n:]
        self._position += n
        if self._tee_file is not None:
            self._tee_file.write(result)
        return result

    def skip(self, n: int) -> None:
        """Consume and discard *n* bytes from the stream.

        Raises ``EOFError`` if the stream ends prematurely.
        """
        remaining = n

        # Drain from internal buffer first
        if self._buf:
            if len(self._buf) >= remaining:
                drained = self._buf[:remaining]
                self._buf = self._buf[remaining:]
                self._position += n
                if self._tee_file is not None:
                    self._tee_file.write(drained)
                return
            if self._tee_file is not None:
                self._tee_file.write(self._buf)
            remaining -= len(self._buf)
            self._buf = b""

        # Drain from the underlying iterator
        while remaining > 0:
            try:
                chunk = next(self._iter)
                if not chunk:
                    continue
                if len(chunk) <= remaining:
                    if self._tee_file is not None:
                        self._tee_file.write(chunk)
                    remaining -= len(chunk)
                else:
                    if self._tee_file is not None:
                        self._tee_file.write(chunk[:remaining])
                    self._buf = chunk[remaining:]
                    remaining = 0
            except StopIteration:
                raise EOFError(
                    f"Unexpected end of stream at position {self._position + n - remaining} "
                    f"(wanted to skip {n} bytes, {remaining} remaining)"
                )

        self._position += n

    def close(self) -> None:
        """Release the underlying HTTP connection."""
        self._response.close()


# ---------------------------------------------------------------------------
# Byte-range file access (buffered — for frames / small reads)
# ---------------------------------------------------------------------------

def _fetch_bytes_range(
    token: str,
    db_file: DatabricksFile,
    start: int = 0,
    end: int | None = None,
) -> bytes:
    """Fetch a byte range from Volumes using the pooled _session."""
    headers = _auth_headers(token)
    if end is not None:
        headers["Range"] = f"bytes={start}-{end - 1}"
    resp = _session.get(db_file.to_api_url(), headers=headers)
    if resp.status_code not in (200, 206):
        raise RuntimeError(f"HTTP {resp.status_code} fetching {db_file.file_path}")
    return resp.content


def get_file_part(token: str, db_file: DatabricksFile, frame: dict | None = None) -> bytes:
    """
    Retrieve a specific byte range or set of fragments from Databricks Volumes.
    """
    if frame is not None and "fragments" in frame:
        joined = b""
        for frag in frame["fragments"]:
            raw = _fetch_bytes_range(token, db_file, frag["start"], frag["start"] + frag["length"])
            joined += raw
        return joined

    if frame is not None:
        return _fetch_bytes_range(token, db_file, frame["start_pos"], frame["end_pos"] + 1)
    return _fetch_bytes_range(token, db_file)


def get_file_part_local(local_path: str, data_start: int, frame: dict) -> bytes:
    """
    Read frame pixel bytes from a local cache file, joining fragments if needed.
    """
    if "fragments" in frame:
        joined = b""
        with open(local_path, "rb") as f:
            for frag in frame["fragments"]:
                local_offset = frag["start"] - data_start
                f.seek(local_offset)
                joined += f.read(frag["length"])
        return joined

    local_offset = frame["start_pos"] - data_start
    with open(local_path, "rb") as f:
        f.seek(local_offset)
        return f.read(frame["frame_size"])


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


# ---------------------------------------------------------------------------
# Lightweight upload via persistent session (STOW-RS landing zone)
# ---------------------------------------------------------------------------


async def async_stream_to_volumes(
    token: str,
    volume_path: str,
    body_stream,
) -> int:
    """
    Stream an async byte stream directly to a Databricks Volume path.

    Uses the same ``build_request`` → ``send`` — the request body is piped
    chunk-by-chunk to the Volumes Files API with **O(chunk_size)** memory.

    This is the primary upload path for STOW-RS: the raw multipart body
    is streamed as-is to a single temp file on Volumes.  No parsing, no
    buffering of the full body.

    Args:
        token: Databricks bearer token.
        volume_path: Destination path starting with ``/Volumes/…``.
        body_stream: An async iterable of ``bytes`` chunks (e.g.
            ``request.stream()`` from Starlette/FastAPI).

    Returns:
        Total number of bytes streamed.

    Raises:
        RuntimeError: If the PUT request returns a non-success status.
    """
    import httpx

    host = (
        os.environ.get("DATABRICKS_HOST", "")
        .replace("https://", "")
        .replace("http://", "")
        .rstrip("/")
    )
    api_path = volume_path.lstrip("/")
    url = f"https://{host}/api/2.0/fs/files/{api_path}"

    total_size = 0

    async def _counting_stream():
        nonlocal total_size
        async for chunk in body_stream:
            total_size += len(chunk)
            yield chunk

    client = httpx.AsyncClient(timeout=httpx.Timeout(300.0))
    try:
        rp_req = client.build_request(
            "PUT",
            url,
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/octet-stream",
            },
            content=_counting_stream(),
        )
        response = await client.send(rp_req)
    finally:
        await client.aclose()

    if response.status_code not in (200, 204):
        raise RuntimeError(
            f"Volume streaming upload failed (HTTP {response.status_code}): "
            f"{response.text[:500]}"
        )

    return total_size


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

    **Disabling prefetch** — set the environment variable
    ``PIXELS_PREFETCH_ENABLED=false`` to turn off background file
    downloads entirely.  The viewer will fall back to streaming from
    Volumes for every request, which avoids resource contention on
    small instances.  The thread pool is still available (with a
    minimal worker count) so that lightweight background tasks such as
    series path pre-warming can still run.
    """

    _DEFAULT_MAX_FILE_BYTES = 5 * 1024 * 1024   # 5 MB

    def __init__(
        self,
        max_workers: int | None = None,
        max_memory_bytes: int | None = None,
        max_file_bytes: int | None = None,
    ):
        # ── Enabled / disabled via env var ───────────────────────────
        self._enabled = os.environ.get(
            "PIXELS_PREFETCH_ENABLED", "false"
        ).strip().lower() in ("1", "true", "yes")

        # ── CPU budget ──────────────────────────────────────────────
        cpu_count = os.cpu_count() or 4
        if self._enabled:
            self._max_workers = max_workers or max(1, int(cpu_count * _CPU_BUDGET_RATIO))
        else:
            # Minimal pool — only used for lightweight background tasks
            # like series path pre-warming (_maybe_prime_series).
            self._max_workers = max_workers or max(1, min(2, cpu_count))

        self._pool = concurrent.futures.ThreadPoolExecutor(
            max_workers=self._max_workers, thread_name_prefix="volprefetch",
        )

        # ── RAM budget ──────────────────────────────────────────────
        if max_memory_bytes is not None:
            self._max_memory_bytes = max_memory_bytes
        else:
            available = psutil.virtual_memory().available
            self._max_memory_bytes = int(available * _RAM_BUDGET_RATIO) if self._enabled else 0

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
            f"Prefetcher initialised: enabled={self._enabled}, "
            f"workers={self._max_workers} "
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

        When prefetching is disabled (``PIXELS_PREFETCH_ENABLED=false``),
        returns 0 immediately — no downloads are scheduled and the
        viewer falls back to streaming from Volumes.

        Returns the number of **newly** scheduled downloads.
        """
        if not self._enabled:
            return 0
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
        * Prefetching disabled → always returns ``None``.
        """
        if not self._enabled:
            return None
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
                "enabled": self._enabled,
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
# Progressive file streamer (single-writer, multi-reader frame delivery)
# ---------------------------------------------------------------------------

class _CaptureSlot:
    """Holds a frame capture request and its result."""

    __slots__ = ("data", "ready")

    def __init__(self):
        self.data: bytes | None = None
        self.ready = threading.Event()


class _FileStreamState:
    """
    Per-file streaming state with progressive frame offset publishing.

    The streaming worker (single writer) publishes frame metadata as it
    discovers each Item tag.  Multiple reader threads can call
    ``wait_for_frame(idx)`` to block until a specific frame is available.

    Inline capture: callers may ``register_capture(idx)`` *before* the
    stream reaches that frame.  When the worker encounters a captured
    frame it reads the pixel data and fills the capture slot, allowing
    the caller to serve it without any extra I/O.
    """

    def __init__(self, local_path: str, data_start: int):
        self.frames: dict[int, dict] = {}
        self._capture_slots: dict[int, _CaptureSlot] = {}
        self._condition = threading.Condition()
        self._stream_complete = False
        self._error: Exception | None = None
        self.local_path = local_path
        self.data_start = data_start
        self.transfer_syntax_uid: str = ""
        self.num_frames_found: int = 0

    # -- reader API -------------------------------------------------------

    def register_capture(self, frame_idx: int) -> _CaptureSlot | None:
        """Register interest for inline capture of *frame_idx*.

        Must be called **before** the stream reaches the frame.  Returns
        a ``_CaptureSlot`` whose ``.ready`` event will be set when the
        frame data is available (or when the stream completes/errors).
        Returns ``None`` if the stream already passed this frame.
        """
        with self._condition:
            if frame_idx in self._capture_slots:
                return self._capture_slots[frame_idx]
            if frame_idx in self.frames:
                return None  # stream already passed this frame
            slot = _CaptureSlot()
            self._capture_slots[frame_idx] = slot
            return slot

    def wait_for_frame(self, frame_idx: int, timeout: float = 120.0) -> dict | None:
        """Block until *frame_idx* is published or the stream ends.

        Returns the frame metadata dict, or ``None`` if the frame does
        not exist (stream completed without finding it).

        Raises:
            Exception: Re-raises any error from the streaming worker.
            TimeoutError: If the timeout expires.
        """
        deadline = time.monotonic() + timeout
        with self._condition:
            while frame_idx not in self.frames:
                if self._error:
                    raise self._error
                if self._stream_complete:
                    return None
                remaining = deadline - time.monotonic()
                if remaining <= 0:
                    raise TimeoutError(
                        f"Timed out waiting for frame {frame_idx} "
                        f"({len(self.frames)} frames discovered so far)"
                    )
                self._condition.wait(timeout=min(remaining, 1.0))
            return self.frames[frame_idx]

    @property
    def is_complete(self) -> bool:
        with self._condition:
            return self._stream_complete

    @property
    def has_error(self) -> bool:
        with self._condition:
            return self._error is not None

    # -- writer API (called by the stream worker) -------------------------

    def publish_frame(
        self, frame_idx: int, frame_meta: dict, frame_data: bytes | None = None,
    ) -> None:
        """Publish a frame offset and optionally fill a capture slot."""
        with self._condition:
            self.frames[frame_idx] = frame_meta
            self.num_frames_found = max(self.num_frames_found, frame_idx + 1)
            slot = self._capture_slots.get(frame_idx)
            if slot is not None and frame_data is not None:
                slot.data = frame_data
                slot.ready.set()
            self._condition.notify_all()

    def mark_complete(self, error: Exception | None = None) -> None:
        """Mark the stream as finished (success or failure)."""
        with self._condition:
            if error:
                self._error = error
            self._stream_complete = True
            for slot in self._capture_slots.values():
                if not slot.ready.is_set():
                    slot.ready.set()
            self._condition.notify_all()


class ProgressiveFileStreamer:
    """
    Coordinates progressive BOT construction across concurrent frame requests.

    **Single writer per file**: the first frame request for a given file
    starts a background streaming worker that reads from Volumes, parses
    Item tags, publishes frame offsets via ``_FileStreamState``, and
    writes the pixel data region to a local disk cache.

    **Multi-reader fan-out**: concurrent frame requests share the same
    ``_FileStreamState``, each waiting only for their specific frame.

    After the stream completes, the full BOT is available in
    ``state.frames`` and can be promoted to the in-memory / Lakebase
    cache.  The local cache file enables subsequent frame reads without
    any network I/O.
    """

    _DEFAULT_CACHE_DIR = "/tmp/pixels_frame_cache"
    _DEFAULT_MAX_CACHE_BYTES = 10 * 1024 ** 3  # 10 GB

    def __init__(
        self,
        cache_dir: str | None = None,
        max_cache_bytes: int | None = None,
    ):
        self._states: dict[str, _FileStreamState] = {}
        self._lock = threading.Lock()
        self._cache_dir = cache_dir or os.environ.get(
            "PIXELS_FRAME_CACHE_DIR", self._DEFAULT_CACHE_DIR,
        )
        self._max_cache_bytes = max_cache_bytes or self._DEFAULT_MAX_CACHE_BYTES
        os.makedirs(self._cache_dir, exist_ok=True)
        logger.info(
            f"ProgressiveFileStreamer: cache_dir={self._cache_dir}, "
            f"max_cache={self._max_cache_bytes / (1024**3):.1f} GB"
        )

    def get_or_start_stream(
        self,
        filename: str,
        token: str,
        db_file: DatabricksFile,
        pixel_data_pos: int,
        number_of_frames: int,
        header_raw: bytes,
        transfer_syntax_uid: str,
    ) -> _FileStreamState:
        """
        Get an existing stream or start a new one for *filename*.

        If a stream is already running (or completed successfully), the
        existing ``_FileStreamState`` is returned.  Otherwise a new
        background worker is submitted to the prefetcher thread pool.

        Callers should:

        1. ``state.register_capture(idx)`` for each wanted frame (before
           the stream reaches it).
        2. ``state.wait_for_frame(idx)`` — blocks until the frame offset
           is available.
        3. Serve the frame from the capture slot data, the local cache
           file, or a remote byte-range read (in that order of preference).
        """
        import hashlib

        with self._lock:
            existing = self._states.get(filename)
            if existing is not None:
                if not existing.has_error:
                    return existing
                del self._states[filename]

            data_start = _find_data_start(header_raw, pixel_data_pos)

            cache_name = hashlib.sha256(filename.encode()).hexdigest()[:32] + ".pixeldata"
            local_path = os.path.join(self._cache_dir, cache_name)

            state = _FileStreamState(local_path, data_start)
            state.transfer_syntax_uid = transfer_syntax_uid
            self._states[filename] = state

        file_prefetcher._pool.submit(
            self._stream_worker,
            state, token, db_file, pixel_data_pos,
            number_of_frames, data_start,
        )
        logger.info(
            f"Progressive stream started for {db_file.file_path} "
            f"(data_start={data_start}, expected_frames={number_of_frames})"
        )
        return state

    def get_state(self, filename: str) -> _FileStreamState | None:
        """Return the stream state for *filename* (or ``None``)."""
        with self._lock:
            return self._states.get(filename)

    def _stream_worker(
        self,
        state: _FileStreamState,
        token: str,
        db_file: DatabricksFile,
        pixel_data_pos: int,
        number_of_frames: int,
        data_start: int,
    ) -> None:
        """Background: stream from *data_start*, publish frames, write to disk."""
        headers = _auth_headers(token)
        headers["Range"] = f"bytes={data_start}-"

        tee_fh = None
        try:
            response = _session.get(
                db_file.to_api_url(), headers=headers, stream=True,
            )
            if response.status_code not in (200, 206):
                body = response.text[:500]
                response.close()
                raise RuntimeError(
                    f"Progressive stream HTTP {response.status_code} "
                    f"for {db_file.file_path}: {body}"
                )

            tee_fh = open(state.local_path, "wb")
            reader = BufferedStreamReader(
                response, chunk_size=256 * 1024,
                start_position=data_start, tee_file=tee_fh,
            )

            frame_idx = 0
            # 1. Consume BOT
            tag_bytes = reader.read_exact(8)
            if tag_bytes[:4] != _ITEM_TAG:
                 raise ValueError(f"Progressive stream: expected BOT Item at {reader.position-8}")
            bot_length = struct.unpack("<I", tag_bytes[4:8])[0]
            bot_data = reader.read_exact(bot_length)
            bot_offsets = []
            if bot_length > 0 and (bot_length % 4 == 0):
                bot_offsets = list(struct.unpack(f"<{bot_length//4}I", bot_data))
            
            first_frag_tag_pos = reader.position
            fragments = []

            # 2. Collect ALL fragments until end or seq delim
            while True:
                try:
                    tag_bytes = reader.read_exact(8)
                except EOFError:
                    break
                tag = tag_bytes[:4]
                if tag == _SEQ_DELIM_TAG:
                    break
                if tag != _ITEM_TAG:
                    logger.warning(f"Unexpected tag 0x{tag.hex()} during stream at {reader.position-8}")
                    break
                
                length = struct.unpack("<I", tag_bytes[4:8])[0]
                start_pos = reader.position
                fragments.append({"start": start_pos, "length": length})
                
                # Check if we need to capture any frames that might be in this fragment
                # Since we don't know the grouping yet, this is tricky. 
                # For now, we'll just write EVERYTHING to the tee_fh (which is already happening).
                reader.skip(length)

            # 3. Group and publish
            frames_list = _group_fragments(
                fragments, number_of_frames, bot_offsets,
                first_frag_tag_pos, pixel_data_pos
            )
            for f in frames_list:
                state.publish_frame(f["frame_number"], f)

            reader.close()
            if tee_fh:
                tee_fh.close()
                tee_fh = None

            state.mark_complete()
            logger.info(
                f"Progressive stream complete for {db_file.file_path}: "
                f"{frame_idx} frames, local cache at {state.local_path}"
            )

        except Exception as exc:
            logger.error(f"Progressive stream failed for {db_file.file_path}: {exc}")
            state.mark_complete(error=exc)
            if tee_fh:
                tee_fh.close()
            try:
                if os.path.exists(state.local_path):
                    os.unlink(state.local_path)
            except OSError:
                pass

    @property
    def stats(self) -> dict:
        """JSON-serialisable snapshot of active/completed streams."""
        with self._lock:
            active = sum(1 for s in self._states.values() if not s.is_complete)
            complete = sum(
                1 for s in self._states.values()
                if s.is_complete and not s.has_error
            )
            errored = sum(1 for s in self._states.values() if s.has_error)
            return {
                "cache_dir": self._cache_dir,
                "total_streams": len(self._states),
                "active": active,
                "complete": complete,
                "errored": errored,
            }


# Module-level singleton
progressive_streamer = ProgressiveFileStreamer()


# ---------------------------------------------------------------------------
# Local cache file reader
# ---------------------------------------------------------------------------

def get_file_part_local(local_path: str, data_start: int, frame: dict) -> bytes:
    """
    Read frame pixel bytes from a local cache file.

    The local cache file contains the pixel data region starting at
    ``data_start`` (absolute file position).  Frame metadata uses
    absolute positions, so we translate: ``local_offset = frame['start_pos'] - data_start``.

    Returns:
        Raw pixel bytes of the frame (without Item header).
    """
    local_offset = frame["start_pos"] - data_start
    with open(local_path, "rb") as f:
        f.seek(local_offset)
        return f.read(frame["frame_size"])


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

# DICOM Item tag and Sequence Delimitation Item tag (little-endian).
_ITEM_TAG = b"\xfe\xff\x00\xe0"
_SEQ_DELIM_TAG = b"\xfe\xff\xdd\xe0"


def _find_bot_item(header_raw: bytes, pixel_data_pos: int) -> tuple[int, int]:
    """
    Locate the byte position and length of the BOT Item (FFFE,E000).

    Returns:
        (bot_item_pos, bot_item_length) where bot_item_pos is the
        absolute position of the 8-byte Item header.
    """
    search_start = pixel_data_pos + 4
    search_end = min(pixel_data_pos + 128, len(header_raw))

    if search_end <= search_start:
        raise ValueError("Insufficient header bytes to find BOT")

    search_area = header_raw[search_start:search_end]
    rel_pos = search_area.find(_ITEM_TAG)
    if rel_pos == -1:
        raise ValueError("Cannot locate BOT Item tag")

    item_pos = search_start + rel_pos
    if item_pos + 8 > len(header_raw):
        raise ValueError("Insufficient header bytes to read BOT length")

    length = struct.unpack("<I", header_raw[item_pos + 4 : item_pos + 8])[0]
    return item_pos, length


def _find_data_start(header_raw: bytes, pixel_data_pos: int) -> int:
    """Legacy helper: returns first byte after the BOT payload."""
    pos, length = _find_bot_item(header_raw, pixel_data_pos)
    return pos + 8 + length


def _extract_from_extended_offset_table(
    ds,
    header_raw: bytes,
    pixel_data_pos: int,
    number_of_frames: int,
) -> list[dict] | None:
    """
    Build frame ranges from the Extended Offset Table (if present).

    DICOM tags ``(7FE0,0001)`` **ExtendedOffsetTable** and
    ``(7FE0,0002)`` **ExtendedOffsetTableLengths** appear *before*
    Pixel Data and are therefore captured by ``dcmread(stop_before_pixels)``.
    They contain 64-bit offsets and lengths — giving us every frame's
    exact byte range with **zero additional I/O**.

    Returns:
        A list of frame dicts on success, or ``None`` when the EOT tags
        are absent, incomplete, or malformed.
    """
    eot_bytes = getattr(ds, "ExtendedOffsetTable", None)
    eot_len_bytes = getattr(ds, "ExtendedOffsetTableLengths", None)

    if eot_bytes is None or eot_len_bytes is None:
        return None

    expected_size = number_of_frames * 8
    if len(eot_bytes) != expected_size or len(eot_len_bytes) != expected_size:
        logger.warning(
            f"Extended Offset Table size mismatch: "
            f"expected {expected_size} bytes for {number_of_frames} frames, "
            f"got offsets={len(eot_bytes)}, lengths={len(eot_len_bytes)}"
        )
        return None

    try:
        data_start = _find_data_start(header_raw, pixel_data_pos)
    except ValueError as exc:
        logger.warning(f"Extended Offset Table: cannot determine data_start: {exc}")
        return None

    offsets = struct.unpack(f"<{number_of_frames}Q", eot_bytes)
    lengths = struct.unpack(f"<{number_of_frames}Q", eot_len_bytes)

    frames: list[dict] = []
    for idx in range(number_of_frames):
        # The EOT offset points to the Item tag of the frame.
        # Frame pixel data starts 8 bytes later (after tag + length).
        frame_data_start = data_start + offsets[idx] + 8
        frame_data_length = lengths[idx]
        frames.append({
            "frame_number": idx,
            "frame_size": frame_data_length,
            "start_pos": frame_data_start,
            "end_pos": frame_data_start + frame_data_length - 1,
            "pixel_data_pos": pixel_data_pos,
        })

    return frames


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
# Streaming BOT computation (O(metadata) memory)
# ---------------------------------------------------------------------------

def _compute_bot_via_stream(
    token: str,
    db_file: DatabricksFile,
    pixel_data_pos: int,
    number_of_frames: int,
    header_raw: bytes,
    capture_frames: set[int] | None = None,
) -> tuple[list[dict], dict[int, bytes]]:
    """Build the complete frame offset table by streaming from the file."""
    bot_item_pos, bot_item_length = _find_bot_item(header_raw, pixel_data_pos)

    headers = _auth_headers(token)
    headers["Range"] = f"bytes={bot_item_pos}-"
    response = _session.get(db_file.to_api_url(), headers=headers, stream=True)

    if response.status_code not in (200, 206):
        body = response.text[:500]
        response.close()
        raise RuntimeError(f"Streaming BOT: HTTP {response.status_code} for {db_file.file_path}: {body}")

    reader = BufferedStreamReader(response, chunk_size=256 * 1024, start_position=bot_item_pos)
    fragments = []

    try:
        # 1. Consume BOT Item header and data
        reader.read_exact(8)  # skip BOT tag + length
        bot_data = reader.read_exact(bot_item_length)
        bot_offsets = []
        if bot_item_length > 0 and (bot_item_length % 4 == 0):
            bot_offsets = list(struct.unpack(f"<{bot_item_length//4}I", bot_data))

        first_frag_tag_pos = bot_item_pos + 8 + bot_item_length

        # 2. Collect ALL fragments until Sequence Delimiter
        while True:
            try:
                tag_bytes = reader.read_exact(8)
            except EOFError:
                break
            tag = tag_bytes[:4]
            if tag == _SEQ_DELIM_TAG:
                break
            if tag != _ITEM_TAG:
                # Some files might have garbage or multiple sequence delimiters
                logger.warning(f"Unexpected tag 0x{tag.hex()} during BOT scan at {reader.position-8}")
                break

            length = struct.unpack("<I", tag_bytes[4:8])[0]
            start_pos = reader.position
            fragments.append({"start": start_pos, "length": length})
            reader.skip(length)

        # 3. Group fragments into frames
        frames = _group_fragments(
            fragments, number_of_frames, bot_offsets, 
            first_frag_tag_pos, pixel_data_pos,
        )
    finally:
        reader.close()

    return frames, {}


def _group_fragments(
    fragments: list[dict], 
    num_frames: int, 
    bot_offsets: list[int],
    first_frag_tag_pos: int,
    pixel_data_pos: int
) -> list[dict]:
    """Group raw DICOM items into frames."""
    if not fragments:
        return []

    # Case A: Single frame — all fragments belong to it
    if num_frames == 1:
        start = fragments[0]["start"]
        end = fragments[-1]["start"] + fragments[-1]["length"] - 1
        return [{
            "frame_number": 0,
            "frame_size": sum(f["length"] for f in fragments),
            "start_pos": start,
            "end_pos": end,
            "pixel_data_pos": pixel_data_pos,
            "fragments": fragments
        }]

    # Case B: Multiple frames with BOT
    # Note: bot_offsets[i] is the relative position of the ITEM TAG of the 1st fragment of frame i
    if bot_offsets and len(bot_offsets) == num_frames:
        frames = []
        frag_idx = 0
        for i in range(num_frames):
            target_abs_tag_pos = first_frag_tag_pos + bot_offsets[i]
            
            # Collect fragments starting from target_abs_tag_pos
            # until we hit the next offset or end of fragments.
            current_frame_frags = []
            
            # Skip any fragments before this offset (shouldn't happen if BOT is correct)
            while frag_idx < len(fragments) and (fragments[frag_idx]["start"] - 8) < target_abs_tag_pos:
                frag_idx += 1
            
            # Determine the boundary of the next frame
            if i + 1 < num_frames:
                next_frame_tag_pos = first_frag_tag_pos + bot_offsets[i+1]
            else:
                next_frame_tag_pos = 1e18 # Effectively infinity for DICOM files
            
            while frag_idx < len(fragments) and (fragments[frag_idx]["start"] - 8) < next_frame_tag_pos:
                current_frame_frags.append(fragments[frag_idx])
                frag_idx += 1
            
            if current_frame_frags:
                start = current_frame_frags[0]["start"]
                end = current_frame_frags[-1]["start"] + current_frame_frags[-1]["length"] - 1
                frames.append({
                    "frame_number": i,
                    "frame_size": sum(f["length"] for f in current_frame_frags),
                    "start_pos": start,
                    "end_pos": end,
                    "pixel_data_pos": pixel_data_pos,
                    "fragments": current_frame_frags
                })
        if len(frames) == num_frames:
            return frames

    # Fallback/Case C: Assume 1 fragment per frame
    frames = []
    for i in range(min(num_frames, len(fragments))):
        f = fragments[i]
        frames.append({
            "frame_number": i,
            "frame_size": f["length"],
            "start_pos": f["start"],
            "end_pos": f["start"] + f["length"] - 1,
            "pixel_data_pos": pixel_data_pos,
            "fragments": [f]
        })
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





def compute_full_bot(
    token: str,
    db_file: DatabricksFile,
    capture_frames: set[int] | None = None,
) -> dict:
    """
    Compute the complete frame offset table for a DICOM file.

    This mimics how PACS systems pre-index frame offsets at ingest time
    for instant random access.

    **Optimisations** (compared to the legacy fsspec-based approach):

    * Uses the **pooled ``_session``** — no per-call TLS handshake.
    * **Uncompressed files** only download the first 64 KB (header) and
      compute frame offsets analytically.  No pixel data is read.
    * **Compressed files** use a tiered strategy to avoid downloading
      the entire file:

      1. **Extended Offset Table** ``(7FE0,0001)`` + ``(7FE0,0002)`` —
         when present in the header, frame ranges are computed
         analytically with zero additional I/O.
      2. **Streaming Item tag scan** — a ranged HTTP stream starting
         at the first data Item scans each 8-byte Item header to
         record positions and lengths.  Frame pixel data is consumed
         but **not buffered**, keeping memory at O(num_frames × 50 B).
      3. **Full file download** — legacy fallback when the above two
         strategies fail (malformed data, network errors).

    Args:
        token: Databricks bearer token.
        db_file: Target file in a Unity Catalog volume.
        capture_frames: Optional set of **0-indexed** frame numbers
            whose pixel data should be captured inline during the
            streaming scan (strategy 2).  Captured data is returned
            under the ``captured_frame_data`` key and can be served
            directly, saving one byte-range HTTP read per frame on
            the first cache-miss request.  Ignored when strategy 1
            (Extended Offset Table) or strategy 3 (full download)
            is used.

    Returns:
        dict with ``transfer_syntax_uid``, ``frames``, ``pixel_data_pos``,
        ``num_frames``, and ``captured_frame_data`` (a dict mapping
        0-indexed frame numbers to raw pixel bytes; empty when no
        frames were captured).
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
    captured_frame_data: dict[int, bytes] = {}

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
        # ── Compressed: try efficient strategies before full-file download ──

        # Strategy 1: Extended Offset Table (zero extra I/O) ─────────────
        frames = _extract_from_extended_offset_table(
            ds, raw, pixel_data_pos, number_of_frames,
        )
        if frames is not None:
            logger.info(
                f"BOT from Extended Offset Table: {len(frames)} frames "
                f"(zero additional I/O)"
            )
        else:
            # Strategy 2: Streaming Item tag scan (O(metadata) memory) ───
            try:
                frames, captured_frame_data = _compute_bot_via_stream(
                    token, db_file, pixel_data_pos,
                    number_of_frames, raw,
                    capture_frames=capture_frames,
                )
                logger.info(
                    f"BOT from streaming scan: {len(frames)} frames"
                )
            except Exception as stream_exc:
                logger.warning(
                    f"Streaming BOT scan failed ({stream_exc}), "
                    f"falling back to full file download"
                )
                frames = None

        # Strategy 3: Full file download (legacy fallback) ───────────────
        if not frames:
            logger.info("Using full-file download fallback for BOT")
            raw = _fetch_bytes_range(token, db_file)
            pixel_data_pos = raw.find(_PIXEL_DATA_MARKER)

            f = BytesIO(raw)
            try:
                endianness = (
                    "<" if ds.file_meta.TransferSyntaxUID.is_little_endian
                    else ">"
                )
                frames = _extract_from_basic_offsets(
                    f, pixel_data_pos, endianness,
                )

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
                            f"BOT: recovered last frame "
                            f"{last['frame_number']}"
                        )
            except Exception as exc:
                logger.warning(
                    f"BOT parsing failed ({exc}), "
                    f"falling back to sequential scan"
                )
                f = BytesIO(raw)
                frames = _legacy_extract_frames(
                    f, number_of_frames, pixel_data_pos,
                    number_of_frames, pixel_data_pos, 0,
                )

    logger.info(
        f"BOT computed for {db_file.file_path}: {len(frames)} frames, "
        f"transfer_syntax={transfer_syntax_uid}, "
        f"pixel_data_pos={pixel_data_pos}"
    )

    return {
        "transfer_syntax_uid": transfer_syntax_uid,
        "frames": frames,
        "pixel_data_pos": pixel_data_pos,
        "num_frames": number_of_frames,
        "captured_frame_data": captured_frame_data,
    }

