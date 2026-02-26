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
from collections import OrderedDict
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
# Resource budget constants
# ---------------------------------------------------------------------------
_CPU_BUDGET_RATIO = 0.80          # use at most 80 % of available cores
_RAM_BUDGET_RATIO = float(os.environ.get("PIXELS_PREFETCH_RAM_RATIO", "0.50"))
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

_SESSION_POOL_CONNECTIONS = int(
    os.environ.get("PIXELS_FILES_POOL_CONNECTIONS", "20")
)
_SESSION_POOL_MAXSIZE = int(
    os.environ.get("PIXELS_FILES_POOL_MAXSIZE", "100")
)

def _build_pooled_session(pool_connections: int, pool_maxsize: int) -> requests.Session:
    """Create a ``requests.Session`` with a tuned connection pool."""
    session = requests.Session()
    adapter = HTTPAdapter(
        pool_connections=pool_connections,
        pool_maxsize=pool_maxsize,
        max_retries=_retry_strategy,
    )
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    return session


# Live WADO reads use this pool (foreground, latency-sensitive).
_live_session = _build_pooled_session(
    _SESSION_POOL_CONNECTIONS,
    _SESSION_POOL_MAXSIZE,
)

# Background prefetch uses a dedicated pool so it can't starve interactive reads.
_PREFETCH_POOL_CONNECTIONS = int(
    os.environ.get("PIXELS_PREFETCH_POOL_CONNECTIONS", str(_SESSION_POOL_CONNECTIONS))
)
_PREFETCH_POOL_MAXSIZE = int(
    os.environ.get("PIXELS_PREFETCH_POOL_MAXSIZE", "50")
)
_prefetch_session = _build_pooled_session(
    _PREFETCH_POOL_CONNECTIONS,
    _PREFETCH_POOL_MAXSIZE,
)

# Back-compat alias used throughout the file for live reads.
_session = _live_session


# ---------------------------------------------------------------------------
# Shared async HTTP client for Volumes uploads (mirrors _session for reads)
# ---------------------------------------------------------------------------
# Creating a new httpx.AsyncClient per upload forces a fresh TCP+TLS
# handshake (~100–300 ms) for every request and prevents HTTP/2 connection
# multiplexing.  A single shared client keeps connections alive and reuses
# them across all concurrent uploads — the same principle that makes
# _session fast for reads.
#
# Lazy-initialised so that the client is created inside the worker process
# *after* uvicorn forks (avoids sharing asyncio state across fork()).

_upload_client: "httpx.AsyncClient | None" = None  # type: ignore[name-defined]


def _get_upload_client():  # return type annotated lazily to avoid top-level httpx import
    """Return the process-wide shared ``httpx.AsyncClient`` for Volumes uploads.

    HTTP/2 is intentionally disabled: multiplexing large file PUTs over a
    shared TCP connection causes all streams to compete for the same flow-
    control window, which makes large uploads SLOWER than dedicated HTTP/1.1
    connections.  Each upload stream should have its own TCP connection so
    it can use the full per-connection bandwidth.
    """
    global _upload_client
    if _upload_client is None:
        import httpx
        _upload_client = httpx.AsyncClient(
            http2=False,  # HTTP/1.1 — dedicated connection per upload stream
            limits=httpx.Limits(
                max_connections=200,
                max_keepalive_connections=100,
            ),
            timeout=httpx.Timeout(connect=30.0, write=None, read=60.0, pool=30.0),
        )
    return _upload_client


# ---------------------------------------------------------------------------
# Semaphore — limit concurrent Volumes PUT operations
# ---------------------------------------------------------------------------
# Without a concurrency cap, all N benchmark workers hit the Volumes API
# simultaneously.  Each upload gets 1/N of the available API bandwidth,
# making each take N× longer.  A semaphore ensures at most
# STOW_VOLUMES_CONCURRENCY uploads are active at once; the rest wait
# cheaply on the event loop.  Tune with the env var (default: 20).

_VOLUMES_UPLOAD_CONCURRENCY = int(os.environ.get("STOW_VOLUMES_CONCURRENCY", "20"))
_upload_semaphore: "asyncio.Semaphore | None" = None  # type: ignore[name-defined]


def _get_upload_semaphore():
    """Return the process-wide asyncio.Semaphore for Volumes PUT concurrency."""
    global _upload_semaphore
    if _upload_semaphore is None:
        import asyncio as _asyncio
        _upload_semaphore = _asyncio.Semaphore(_VOLUMES_UPLOAD_CONCURRENCY)
    return _upload_semaphore


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
    logger.debug(
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
    content_length: int | None = None,
) -> int:
    """
    Stream an async byte stream to a Databricks Volume path.

    When ``STOW_DIRECT_CLOUD_UPLOAD=true`` and the Volume is an External
    Volume, the upload bypasses the Databricks Files API and writes
    directly to S3 / ADLS / GCS via Unity Catalog credential vending.
    Falls back to the Files API transparently on any error (e.g. Managed
    Volume or missing ``EXTERNAL USE LOCATION`` privilege).

    Uses the same ``build_request`` → ``send`` — the request body is piped
    chunk-by-chunk to the Volumes Files API with **O(chunk_size)** memory.

    This is the primary upload path for STOW-RS: the raw multipart body
    is streamed as-is to a single temp file on Volumes.  No parsing, no
    buffering of the full body.

    **Back-pressure prevention**: an ``asyncio.Queue`` decouples reading
    from the client (fast) and writing to Volumes (potentially slower).
    The client body is drained eagerly into the queue so the inbound TCP
    connection never goes idle — preventing the Databricks Apps proxy from
    closing it due to an idle-connection timeout.

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
    import asyncio

    host = (
        os.environ.get("DATABRICKS_HOST", "")
        .replace("https://", "")
        .replace("http://", "")
        .rstrip("/")
    )

    # ── Direct cloud upload fast path (External Volumes only) ─────────────
    from .cloud_direct_upload import DIRECT_UPLOAD_ENABLED, async_direct_volumes_upload
    if DIRECT_UPLOAD_ENABLED:
        try:
            return await async_direct_volumes_upload(
                token, host, volume_path, body_stream, content_length,
            )
        except Exception as exc:
            logger.warning(
                "Direct cloud upload failed (%s) — falling back to Files API: %s",
                type(exc).__name__, exc,
            )
            # body_stream may be partially consumed; the Files API fallback
            # below will receive whatever remains (or raise its own error).

    api_path = volume_path.lstrip("/")
    url = f"https://{host}/api/2.0/fs/files/{api_path}"

    total_size = 0

    # Drain the inbound body into a bounded queue independently of the Volumes
    # write speed.  The queue absorbs short-lived throughput differences
    # between the client send rate and the Volumes PUT rate, preventing the
    # inbound TCP connection from going idle long enough for the Databricks
    # Apps proxy to time it out.
    #
    # maxsize=256 at ~64 KB chunks ≈ 16 MB per upload — enough headroom for
    # brief Volumes write pauses while keeping memory bounded.  If the queue
    # fills (Volumes is consistently slower than the client), back-pressure
    # propagates through the asyncio queue to the OS socket buffer, which is
    # acceptable because the proxy only cares about *short* idle gaps.
    _QUEUE_MAXSIZE = int(os.environ.get("STOW_READ_AHEAD_CHUNKS", "128"))
    queue: asyncio.Queue = asyncio.Queue(maxsize=_QUEUE_MAXSIZE)

    async def _drain_client() -> None:
        """Read all chunks from the request body and enqueue them."""
        try:
            async for chunk in body_stream:
                await queue.put(chunk)
        finally:
            await queue.put(None)  # sentinel — signals end of stream

    async def _volume_stream():
        """Yield chunks from the queue to the Volumes PUT body."""
        nonlocal total_size
        while True:
            chunk = await queue.get()
            if chunk is None:
                return
            total_size += len(chunk)
            yield chunk

    drain_task = asyncio.create_task(_drain_client())

    # Acquire the upload semaphore before starting the Volumes PUT so that
    # at most STOW_VOLUMES_CONCURRENCY uploads are active simultaneously.
    # Excess requests wait here on the event loop (zero threads, zero CPU)
    # instead of all hammering the Volumes API at once and sharing bandwidth.
    client = _get_upload_client()
    try:
        async with _get_upload_semaphore():
            put_headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/octet-stream",
            }
            # Setting Content-Length lets the Volumes API pre-allocate storage
            # and avoids chunked transfer encoding, which forces the API to
            # buffer the body before committing — adding significant latency
            # for large files.
            if content_length is not None:
                put_headers["Content-Length"] = str(content_length)
            rp_req = client.build_request(
                "PUT",
                url,
                headers=put_headers,
                content=_volume_stream(),
            )
            response = await client.send(rp_req)
    finally:
        # Do NOT close the shared client — it is reused across requests.
        if not drain_task.done():
            drain_task.cancel()
        try:
            await drain_task
        except asyncio.CancelledError:
            pass

    if response.status_code not in (200, 204):
        raise RuntimeError(
            f"Volume streaming upload failed (HTTP {response.status_code}): "
            f"{response.text[:500]}"
        )

    return total_size


class FilePrefetcher:
    """
    Resource-aware background file prefetcher with **LRU eviction**.

    When a QIDO-RS query returns instance paths, the prefetcher downloads
    files **in parallel** using a thread pool.  By the time the viewer
    requests individual instances via WADO-RS, the content is already in
    memory and can be served instantly.

    **LRU cache semantics**: completed downloads are held in an
    ``OrderedDict`` ordered by last access time.  ``get()`` refreshes an
    entry's position (most-recently-used).  When the memory budget is
    exceeded — either after a new download completes or when new
    ``schedule()`` calls need room — the **least-recently-used** entries
    are evicted automatically.  This prevents unbounded memory growth when
    files are prefetched (e.g. via priming) but never requested.

    Resource limits (computed once at construction):

    * **CPU** — worker threads = ``floor(cpu_count × 0.80)``, so 20 % of
      cores are always free for request handling, streaming, etc.
    * **RAM** — total bytes held in the prefetch cache are bounded by
      ``total_ram × ratio``.  The ratio defaults to 0.50 (50 % of total
      RAM) and can be overridden with ``PIXELS_PREFETCH_RAM_RATIO``.
      An absolute cap in MB can be set with ``PIXELS_PREFETCH_MAX_MEMORY_MB``
      (takes precedence over the ratio).
    * **Per-file size** — files larger than *max_file_bytes* (default
      10 MB, configurable via ``PIXELS_PREFETCH_MAX_FILE_MB``) are
      **not** prefetched.  Large multi-frame DICOMs gain nothing from
      being held in memory because their transfer time dominates;
      streaming them directly is equally efficient.

    **Disabling prefetch** — set the environment variable
    ``PIXELS_PREFETCH_ENABLED=false`` to turn off background file
    downloads entirely.  The viewer will fall back to streaming from
    Volumes for every request, which avoids resource contention on
    small instances.  The thread pool is still available for background
    tasks such as series path pre-warming and progressive frame streams;
    tune with ``PIXELS_BACKGROUND_POOL_WORKERS`` when prefetch is off.
    """

    _DEFAULT_MAX_FILE_BYTES = 10 * 1024 * 1024   # 10 MB

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
            disabled_default = max(4, min(16, cpu_count))
            disabled_workers = int(
                os.environ.get(
                    "PIXELS_BACKGROUND_POOL_WORKERS",
                    str(disabled_default),
                )
            )
            self._max_workers = max_workers or max(1, disabled_workers)

        self._pool = concurrent.futures.ThreadPoolExecutor(
            max_workers=self._max_workers, thread_name_prefix="volprefetch",
        )

        # ── RAM budget ──────────────────────────────────────────────
        _env_mb = os.environ.get("PIXELS_PREFETCH_MAX_MEMORY_MB")
        if max_memory_bytes is not None:
            self._max_memory_bytes = max_memory_bytes
        elif _env_mb is not None:
            self._max_memory_bytes = int(float(_env_mb) * 1024 ** 2)
        else:
            total = psutil.virtual_memory().total
            self._max_memory_bytes = int(total * _RAM_BUDGET_RATIO) if self._enabled else 0

        # ── Per-file size cap ───────────────────────────────────────
        _env_file_mb = os.environ.get("PIXELS_PREFETCH_MAX_FILE_MB")
        if max_file_bytes is not None:
            self._max_file_bytes = max_file_bytes
        elif _env_file_mb is not None:
            self._max_file_bytes = int(float(_env_file_mb) * 1024 ** 2)
        else:
            self._max_file_bytes = self._DEFAULT_MAX_FILE_BYTES

        # ── LRU cache state ─────────────────────────────────────────
        self._pending: dict[str, concurrent.futures.Future] = {}
        self._cache: OrderedDict[str, bytes] = OrderedDict()
        self._lock = threading.Lock()
        self._memory_used: int = 0
        self._memory_skipped: int = 0
        self._files_skipped_too_large: int = 0
        self._evicted_count: int = 0
        self._hits: int = 0
        self._misses: int = 0

        logger.debug(
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

        Non-blocking — returns immediately.  Paths already in the LRU
        cache or pending download are skipped.  When the memory budget
        is full, LRU eviction is attempted first; if all memory is held
        by in-flight downloads the request is skipped.

        Returns the number of **newly** scheduled downloads.
        """
        if not self._enabled:
            return 0
        with self._lock:
            new_count = 0
            skipped = 0
            for path in paths:
                if path in self._pending or path in self._cache:
                    continue
                if self._memory_used >= self._max_memory_bytes:
                    self._evict_lru_locked()
                if self._memory_used >= self._max_memory_bytes:
                    skipped += 1
                    continue
                future = self._pool.submit(self._fetch_one, token, path)
                future.add_done_callback(
                    lambda f, p=path: self._on_download_complete(p, f),
                )
                self._pending[path] = future
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
        Get prefetched file content (LRU-refreshed).

        * Already in cache → returns **instantly** and refreshes the
          entry's LRU position (most-recently-used).
        * Still downloading → waits up to *timeout* seconds.
        * Not scheduled / failed → returns ``None`` (caller falls back to
          streaming from Volumes).
        * Prefetching disabled → always returns ``None``.

        Unlike the old one-shot design, ``get()`` does **not** remove the
        entry — it stays in the LRU cache until evicted by memory pressure.
        """
        if not self._enabled:
            return None

        with self._lock:
            if path in self._cache:
                self._cache.move_to_end(path)
                self._hits += 1
                return self._cache[path]
            future = self._pending.get(path)

        if future is None:
            self._misses += 1
            return None

        try:
            content = future.result(timeout=timeout)
        except concurrent.futures.TimeoutError:
            logger.warning(f"Prefetch timeout for {path}")
            return None
        except Exception as exc:
            logger.warning(f"Prefetch failed for {path}: {exc}")
            return None

        if content is None:
            return None

        with self._lock:
            if path in self._cache:
                self._cache.move_to_end(path)
                self._hits += 1
                return self._cache[path]

        return content

    @property
    def stats(self) -> dict:
        """Snapshot of prefetcher state (JSON-serialisable)."""
        with self._lock:
            return {
                "enabled": self._enabled,
                "cached": len(self._cache),
                "pending": len(self._pending),
                "total": len(self._cache) + len(self._pending),
                "memory_used_mb": round(self._memory_used / (1024 ** 2), 2),
                "memory_budget_mb": round(self._max_memory_bytes / (1024 ** 2), 2),
                "memory_skipped": self._memory_skipped,
                "evicted": self._evicted_count,
                "hits": self._hits,
                "misses": self._misses,
                "max_file_size_mb": round(self._max_file_bytes / (1024 ** 2), 2),
                "files_skipped_too_large": self._files_skipped_too_large,
                "pool_workers": self._max_workers,
            }

    # -- internal ---------------------------------------------------------

    def _on_download_complete(
        self, path: str, future: concurrent.futures.Future,
    ) -> None:
        """Callback fired when a download Future resolves."""
        try:
            content = future.result()
        except Exception:
            content = None

        with self._lock:
            self._pending.pop(path, None)
            if content is not None:
                self._cache[path] = content
                self._memory_used += len(content)
                self._evict_lru_locked()

    def _evict_lru_locked(self) -> None:
        """Drop the oldest cache entries until within budget. Caller holds ``_lock``."""
        while self._memory_used > self._max_memory_bytes and self._cache:
            _, evicted = self._cache.popitem(last=False)
            self._memory_used -= len(evicted)
            self._evicted_count += 1

    def _fetch_one(self, token: str, path: str) -> bytes | None:
        """
        Download a single file from Volumes (runs in a worker thread).

        Uses ``stream=True`` so the response headers are read first
        without downloading the body.  If ``Content-Length`` exceeds the
        per-file size cap the connection is closed immediately.

        Memory accounting is handled by ``_on_download_complete``, not here.
        """
        db_file = DatabricksFile.from_full_path(path)
        headers = _auth_headers(token)
        response = _prefetch_session.get(
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
        content = response.content
        response.close()
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
    _DEFAULT_MAX_CACHE_BYTES = 50 * 1024 ** 3  # 50 GB

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
        _env_cache_gb = os.environ.get("PIXELS_FRAME_CACHE_MAX_GB")
        if max_cache_bytes is not None:
            self._max_cache_bytes = max_cache_bytes
        elif _env_cache_gb is not None:
            self._max_cache_bytes = int(float(_env_cache_gb) * 1024 ** 3)
        else:
            self._max_cache_bytes = self._DEFAULT_MAX_CACHE_BYTES
        os.makedirs(self._cache_dir, exist_ok=True)
        logger.debug(
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

            bot_pos, _ = _find_bot_item(header_raw, pixel_data_pos)
            data_start = bot_pos

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
        logger.debug(
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
            if not fragments:
                raise RuntimeError(
                    f"Progressive stream collected 0 fragments for "
                    f"{db_file.file_path} "
                    f"(pixel_data_pos={pixel_data_pos}, "
                    f"data_start={data_start}, "
                    f"expected_frames={number_of_frames}). "
                    f"The pixel data offset may be incorrect — check for "
                    f"multiple (7FE0,0010) tags."
                )

            frames_list = _group_fragments(
                fragments, number_of_frames, bot_offsets,
                first_frag_tag_pos, pixel_data_pos
            )

            if not frames_list:
                raise RuntimeError(
                    f"Progressive stream found {len(fragments)} fragments "
                    f"but _group_fragments returned 0 frames for "
                    f"{db_file.file_path} "
                    f"(num_frames={number_of_frames}, "
                    f"bot_offsets={bot_offsets[:5]})"
                )

            for f in frames_list:
                state.publish_frame(f["frame_number"], f)

            reader.close()
            if tee_fh:
                tee_fh.close()
                tee_fh = None

            state.mark_complete()
            logger.info(
                f"Progressive stream complete: "
                f"{len(frames_list)} frames indexed for {db_file.file_path}"
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


def _pixel_data_header_size(raw: bytes, pixel_data_pos: int) -> int:
    """
    Return the byte length of the Pixel Data element header.

    For **explicit VR** with a 4-byte-length VR (OB, OW, OF, OD, UN, …)
    the header is ``tag(4) + VR(2) + reserved(2) + length(4) = 12``.
    For **implicit VR** the header is ``tag(4) + length(4) = 8``.

    The caller must pass the raw file bytes and the position of the
    ``(7FE0,0010)`` tag so the function can inspect the bytes that
    follow it.
    """
    if pixel_data_pos + 8 > len(raw):
        return 12  # safe default (explicit VR)

    vr = raw[pixel_data_pos + 4 : pixel_data_pos + 6]
    if vr.isalpha():
        return 12  # explicit VR — tag(4) + VR(2) + reserved(2) + len(4)
    return 8       # implicit VR — tag(4) + len(4)


def _uncompressed_frame_length(ds) -> int:
    """
    Return the byte length of a single uncompressed frame.

    Accounts for ``SamplesPerPixel`` (> 1 for colour images like RGB).
    """
    samples_per_pixel = int(getattr(ds, "SamplesPerPixel", 1))
    return ds.Rows * ds.Columns * (ds.BitsAllocated // 8) * samples_per_pixel


def _find_pixel_data_pos(raw: bytes) -> int:
    """
    Locate the **top-level** Pixel Data tag ``(7FE0,0010)`` in *raw*.

    Some DICOM files contain more than one ``(7FE0,0010)`` tag — for
    example one nested inside an Icon Image Sequence and a second one
    at the dataset root for the actual pixel data.  A naïve ``find()``
    returns the first (nested) occurrence, producing incorrect byte
    offsets for every downstream frame calculation.

    **Algorithm**

    1. Collect every occurrence of the 4-byte marker.
    2. If there is exactly one, return it immediately (common fast path).
    3. If there are several, use ``pydicom.dcmread(stop_before_pixels=True)``
       to parse the DICOM structure.  pydicom handles sequences correctly
       and stops at the top-level pixel data boundary.  We then pick the
       first marker occurrence at or after that boundary.
    4. If pydicom parsing fails, fall back to the **last** occurrence
       (the top-level tag always has the highest offset because
       ``(7FE0,0010)`` is the highest standard group/element).

    Returns:
        Byte offset of the top-level tag, or ``-1`` if no marker was
        found (caller should extend the download range).
    """
    # ── Collect all occurrences ───────────────────────────────────────
    positions: list[int] = []
    search_from = 0
    while True:
        pos = raw.find(_PIXEL_DATA_MARKER, search_from)
        if pos == -1:
            break
        positions.append(pos)
        search_from = pos + 4

    if not positions:
        return -1

    if len(positions) == 1:
        return positions[0]

    # ── Multiple tags detected — resolve via pydicom ──────────────────
    logger.warning(
        f"Found {len(positions)} Pixel Data (7FE0,0010) tags at "
        f"offsets {positions}; resolving the top-level one via pydicom"
    )

    try:
        bio = BytesIO(raw)
        pydicom.dcmread(bio, stop_before_pixels=True, force=True)
        metadata_end = bio.tell()

        # pydicom may have consumed up to 4 bytes of the tag before
        # recognising it as pixel data and stopping.  Allow a small
        # look-back so the search window covers the tag start.
        search_start = max(0, metadata_end - 8)
        for p in positions:
            if p >= search_start:
                logger.debug(
                    f"Top-level Pixel Data tag at offset {p} "
                    f"(pydicom metadata_end={metadata_end})"
                )
                return p

        # Every found position is *before* where pydicom says metadata
        # ends → they are all nested inside sequences.  The real
        # top-level tag must be beyond our current download range.
        logger.warning(
            f"All {len(positions)} Pixel Data tags appear nested "
            f"(all before metadata_end={metadata_end}); real pixel "
            f"data may be beyond the downloaded range"
        )
        return -1

    except Exception as exc:
        logger.warning(
            f"pydicom parse failed during multi-tag resolution "
            f"({exc}); falling back to last occurrence"
        )
        return positions[-1]





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
    pixel_data_pos = _find_pixel_data_pos(raw)

    if pixel_data_pos == -1 and len(raw) >= _HEADER_INITIAL_BYTES:
        # Very large header (rare) — extend the range.
        raw = _fetch_bytes_range(token, db_file, 0, _HEADER_EXTENDED_BYTES)
        pixel_data_pos = _find_pixel_data_pos(raw)

    # ── Step 2: Parse DICOM metadata from the downloaded bytes ──
    ds = pydicom.dcmread(BytesIO(raw), stop_before_pixels=True)

    transfer_syntax_uid = str(ds.file_meta.TransferSyntaxUID)
    is_compressed = ds.file_meta.TransferSyntaxUID.is_compressed
    number_of_frames = int(ds.get("NumberOfFrames", 1))
    frames: list[dict] = []
    captured_frame_data: dict[int, bytes] = {}

    if not is_compressed:
        # ── Uncompressed: analytical BOT — zero additional I/O ──────────
        item_length = _uncompressed_frame_length(ds)
        header_size = _pixel_data_header_size(raw, pixel_data_pos)
        for idx in range(number_of_frames):
            offset = (idx * item_length) + header_size
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
            logger.debug(
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
                logger.debug(
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
            logger.debug("Using full-file download fallback for BOT")
            raw = _fetch_bytes_range(token, db_file)
            pixel_data_pos = _find_pixel_data_pos(raw)

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
                        logger.debug(
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

    logger.info(f"BOT computed: {len(frames)} frames for {db_file.file_path}")

    return {
        "transfer_syntax_uid": transfer_syntax_uid,
        "frames": frames,
        "pixel_data_pos": pixel_data_pos,
        "num_frames": number_of_frames,
        "captured_frame_data": captured_frame_data,
    }

