"""
Direct cloud-storage upload using Unity Catalog Credential Vending.

When the Databricks STOW Volume is an **External Volume**, this module
bypasses the Databricks Files API proxy and writes DICOM files straight
to the underlying S3 / ADLS Gen2 / GCS bucket.  The result is cloud-
native, multi-gigabyte-per-second PUT throughput with no Databricks API
rate-limiting in the data path.

Architecture::

    DICOM client
        │  multipart/related POST (unchanged STOW-RS protocol)
        ▼
    Gateway (this app)
        │  1. UC credential-vending call  (lightweight JSON, once per hour)
        │     POST /api/2.1/unity-catalog/temporary-path-credentials
        │  2. Data streamed directly to cloud storage
        ▼
    S3 / ADLS / GCS  ──▶  External Volume (instantly visible in Databricks)

Requirements
------------
* The target Volume must be an **External Volume** backed by an external
  location.  Managed Volumes do not support credential vending.
* The service-principal must have ``EXTERNAL USE LOCATION`` on the
  external location (Unity Catalog privilege).
* Cloud SDK deps must be installed (see requirements.txt).

Enabling
--------
Set ``STOW_DIRECT_CLOUD_UPLOAD=true`` in the app environment.
The Files-API path is used as an automatic fallback if credential
vending fails (e.g., on Managed Volumes or missing privileges).

Supported providers
-------------------
* **AWS S3** — via ``boto3`` (``upload_fileobj``, auto-multipart for > 8 MB)
* **Azure ADLS Gen2** — via ``azure-storage-blob`` (``upload_blob``)
* **GCP GCS** — via ``google-cloud-storage`` (``upload_from_file``)
"""

from __future__ import annotations

import asyncio
import os
import re
import threading
import time
from io import BytesIO
from typing import AsyncIterator

import requests as _requests

from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("DICOMweb.CloudUpload")

# ---------------------------------------------------------------------------
# Feature flag
# ---------------------------------------------------------------------------

DIRECT_UPLOAD_ENABLED: bool = (
    os.getenv("STOW_DIRECT_CLOUD_UPLOAD", "false").lower() in ("1", "true", "yes")
)

# ---------------------------------------------------------------------------
# SDK-based host / token resolution
# ---------------------------------------------------------------------------

def _sdk_host_and_token() -> tuple[str, str]:
    """
    Return ``(host, bearer_token)`` using the Databricks SDK ``Config``.

    This is the same credential path used by the rest of the gateway
    (``app_token_provider()`` in ``_common.py``).  It works for all
    Databricks authentication methods — OAuth M2M, PAT, Databricks Apps
    identity — without requiring a raw ``DATABRICKS_TOKEN`` env var.
    """
    from databricks.sdk.core import Config
    cfg = Config()
    headers = cfg.authenticate()
    if callable(headers):
        headers = headers()
    token = (headers or {}).get("Authorization", "").removeprefix("Bearer ").strip()
    host = cfg.host.replace("https://", "").replace("http://", "").rstrip("/")
    return host, token


# ---------------------------------------------------------------------------
# In-process caches (one per process / uvicorn worker)
# ---------------------------------------------------------------------------

_storage_location_cache: dict[str, str] = {}   # uc_volume_name → cloud_url
_cred_cache: dict[str, tuple[dict, float]] = {}  # credential_name → (creds, expiry_ts)
_cred_inflight: dict[str, threading.Event] = {}  # credential_name → Event (stampede guard)
_cache_lock = threading.Lock()
_CRED_EXPIRE_BUFFER_S = 300   # refresh 5 minutes before actual expiry

# Module-level WorkspaceClient — created once, reused across all credential
# vends.  Creating WorkspaceClient() per call forces repeated SDK config
# loading and OAuth token inspection, which adds ~100-500 ms per call and
# causes massive thread-pool contention under high concurrency.
_workspace_client = None
_wc_lock = threading.Lock()


def _get_workspace_client():
    global _workspace_client
    if _workspace_client is None:
        with _wc_lock:
            if _workspace_client is None:
                from databricks.sdk import WorkspaceClient
                _workspace_client = WorkspaceClient()
    return _workspace_client


# ---------------------------------------------------------------------------
# Path utilities
# ---------------------------------------------------------------------------

def _volumes_to_uc_name_and_relative(volumes_path: str) -> tuple[str, str]:
    """
    Split ``/Volumes/catalog/schema/volume/a/b/c`` into
    ``("catalog.schema.volume", "a/b/c")``.
    """
    parts = volumes_path.strip("/").split("/")
    if len(parts) < 4 or parts[0].lower() != "volumes":
        raise ValueError(
            f"Expected /Volumes/catalog/schema/volume/… path, got: {volumes_path}"
        )
    uc_name = f"{parts[1]}.{parts[2]}.{parts[3]}"
    relative = "/".join(parts[4:]) if len(parts) > 4 else ""
    return uc_name, relative


def _get_storage_location(host: str, token: str, uc_volume_name: str) -> str:
    """
    Resolve the underlying cloud storage URL for a UC external volume.

    Uses the ``GET /api/2.1/unity-catalog/volumes/{name}`` endpoint and
    caches the result permanently (volumes don't move).

    Raises ``RuntimeError`` for Managed Volumes (no ``storage_location``).
    """
    with _cache_lock:
        cached = _storage_location_cache.get(uc_volume_name)
        if cached:
            return cached

    resp = _requests.get(
        f"https://{host}/api/2.1/unity-catalog/volumes/{uc_volume_name}",
        headers={"Authorization": f"Bearer {token}"},
        timeout=10,
    )
    if not resp.ok:
        raise RuntimeError(
            f"UC volumes API failed for '{uc_volume_name}': "
            f"HTTP {resp.status_code}: {resp.text[:300]}"
        )

    storage_location = resp.json().get("storage_location", "").rstrip("/") + "/"
    if not storage_location.strip("/"):
        raise RuntimeError(
            f"Volume '{uc_volume_name}' has no storage_location — "
            "it is likely a Managed Volume. Direct upload requires an External Volume."
        )

    with _cache_lock:
        _storage_location_cache[uc_volume_name] = storage_location

    logger.info(
        "Resolved storage location: %s → %s", uc_volume_name, storage_location
    )
    return storage_location


def resolve_cloud_url(host: str, token: str, volumes_path: str) -> str:
    """Convert a ``/Volumes/…`` path to its underlying cloud storage URL."""
    uc_name, relative = _volumes_to_uc_name_and_relative(volumes_path)
    base = _get_storage_location(host, token, uc_name)
    return base + relative


# ---------------------------------------------------------------------------
# Credential vending via UC service credentials
# ---------------------------------------------------------------------------

_service_credential_cache: dict[str, str] = {}  # cloud_url_prefix → credential_name


def _get_service_credential_name(host: str, token: str, cloud_url: str) -> str:
    """
    Resolve the UC service credential name for *cloud_url*.

    Checks ``STOW_SERVICE_CREDENTIAL_NAME`` first; if unset, queries the
    external-locations API and returns the credential that covers *cloud_url*.
    The result is cached permanently (credentials don't change).
    """
    explicit = os.environ.get("STOW_SERVICE_CREDENTIAL_NAME", "").strip()
    if explicit:
        return explicit

    with _cache_lock:
        for prefix, name in _service_credential_cache.items():
            if cloud_url.startswith(prefix):
                return name

    resp = _requests.get(
        f"https://{host}/api/2.1/unity-catalog/external-locations",
        headers={"Authorization": f"Bearer {token}"},
        timeout=10,
    )
    if not resp.ok:
        raise RuntimeError(
            f"Failed to list external locations: HTTP {resp.status_code}: {resp.text[:300]}"
        )

    for loc in resp.json().get("external_locations", []):
        url = loc.get("url", "").rstrip("/") + "/"
        cred_name = loc.get("credential_name", "")
        if cloud_url.startswith(url) and cred_name:
            with _cache_lock:
                _service_credential_cache[url] = cred_name
            logger.info(
                "Auto-discovered service credential '%s' for %s", cred_name, cloud_url
            )
            return cred_name

    raise RuntimeError(
        f"No external location covers {cloud_url}. "
        "Set STOW_SERVICE_CREDENTIAL_NAME explicitly or check UC external locations."
    )


def get_temp_credentials(host: str, token: str, cloud_url: str) -> dict:
    """
    Return (possibly cached) temporary credentials for writing to *cloud_url*.

    Uses ``w.credentials.generate_temporary_service_credential()`` via the
    Databricks SDK.  Unlike ``temporary-path-credentials``, this API works
    from **Databricks Apps** and only requires the ``ACCESS`` privilege on
    the service credential (not ``EXTERNAL USE LOCATION``).

    The credential name is resolved from ``STOW_SERVICE_CREDENTIAL_NAME``
    or auto-discovered from the external location that covers *cloud_url*.

    Credentials are cached for ~55 minutes (refreshed 5 minutes before expiry).
    """
    now = time.time()
    credential_name = _get_service_credential_name(host, token, cloud_url)

    cache_key = credential_name

    # Fast path — return from cache if still valid.
    with _cache_lock:
        entry = _cred_cache.get(cache_key)
        if entry and entry[1] > now:
            return entry[0]

        # Stampede guard: if another thread is already fetching, wait for it
        # instead of making N simultaneous SDK calls under high concurrency.
        if cache_key in _cred_inflight:
            event = _cred_inflight[cache_key]
        else:
            event = threading.Event()
            _cred_inflight[cache_key] = event
            event = None  # this thread is the fetcher

    if event is not None:
        event.wait(timeout=30)
        with _cache_lock:
            entry = _cred_cache.get(cache_key)
            if entry and entry[1] > now:
                return entry[0]
        raise RuntimeError(
            f"Timed out waiting for credential '{credential_name}' from another thread"
        )

    t0 = time.time()
    try:
        w = _get_workspace_client()
        result = w.credentials.generate_temporary_service_credential(
            credential_name=credential_name,
        )
        logger.debug("generate_temporary_service_credential took %.2fs", time.time() - t0)
    finally:
        with _cache_lock:
            inflight_event = _cred_inflight.pop(cache_key, None)
        if inflight_event:
            inflight_event.set()  # wake all threads waiting on this credential

    # Normalise the SDK response into the same dict shape the writer
    # functions (_write_s3, _write_adls, _write_gcs) already expect.
    creds: dict = {}
    if result.aws_temp_credentials:
        creds["aws_temp_credentials"] = {
            "access_key_id":     result.aws_temp_credentials.access_key_id,
            "secret_access_key": result.aws_temp_credentials.secret_access_key,
            "session_token":     result.aws_temp_credentials.session_token,
        }
    elif result.azure_user_delegation_sas:
        creds["azure_sas_token"] = result.azure_user_delegation_sas.sas_token
    elif hasattr(result, "gcp_oauth_token") and result.gcp_oauth_token:
        creds["gcp_oauth_token"] = {"oauth_token": result.gcp_oauth_token.oauth_token}

    if not creds:
        raise RuntimeError(
            f"generate_temporary_service_credential returned no usable credentials "
            f"for '{credential_name}' — check the credential type and provider."
        )

    expiry_ts = now + 3600 - _CRED_EXPIRE_BUFFER_S  # 55 minutes
    with _cache_lock:
        _cred_cache[cache_key] = (creds, expiry_ts)

    logger.debug(
        "Vended service credentials via '%s' (expire ~%.0fs)", credential_name, expiry_ts - now
    )
    return creds


# ---------------------------------------------------------------------------
# Async → sync queue bridge (streaming upload to cloud SDKs)
# ---------------------------------------------------------------------------

class _SyncQueueReader:
    """
    Wraps an ``asyncio.Queue`` as a **synchronous** file-like ``read()``
    object so boto3 / azure-storage-blob can stream from an async producer
    without needing to buffer the entire body in memory.

    Must be consumed from a **thread** (not the event loop) — typically
    via ``asyncio.to_thread``.
    """

    def __init__(self, queue: asyncio.Queue, loop: asyncio.AbstractEventLoop) -> None:
        self._queue = queue
        self._loop = loop
        self._buf = bytearray()
        self._done = False

    def read(self, n: int = -1) -> bytes:
        while not self._done and (n < 0 or len(self._buf) < n):
            try:
                chunk = asyncio.run_coroutine_threadsafe(
                    self._queue.get(), self._loop
                ).result(timeout=120)
                if chunk is None:
                    self._done = True
                else:
                    self._buf.extend(chunk)
            except Exception as exc:
                logger.warning("_SyncQueueReader: queue read error: %s", exc)
                self._done = True
                break

        if n < 0:
            result = bytes(self._buf)
            self._buf.clear()
        else:
            result = bytes(self._buf[:n])
            del self._buf[:n]
        return result


# ---------------------------------------------------------------------------
# Per-provider write functions (synchronous — run via asyncio.to_thread)
# ---------------------------------------------------------------------------

def _write_s3(
    reader: _SyncQueueReader,
    cloud_url: str,
    creds: dict,
    content_length: int | None,
) -> None:
    """Stream *reader* to S3 using boto3 ``upload_fileobj``."""
    import boto3
    from boto3.s3.transfer import TransferConfig
    from botocore.config import Config as BotoConfig
    from urllib.parse import urlparse

    parsed = urlparse(cloud_url)
    bucket = parsed.netloc
    key = parsed.path.lstrip("/")

    aws = creds.get("aws_temp_credentials") or creds
    s3 = boto3.client(
        "s3",
        aws_access_key_id=aws["access_key_id"],
        aws_secret_access_key=aws["secret_access_key"],
        aws_session_token=aws.get("session_token"),
        config=BotoConfig(retries={"max_attempts": 3, "mode": "adaptive"}),
    )

    # multipart_threshold / multipart_chunksize belong in TransferConfig,
    # not BotoConfig — they control the S3Transfer layer, not the botocore client.
    # 8 MB chunks keep per-upload memory at ~16 MB (queue + one boto3 part buffer)
    # while still giving S3 enough parallelism for large files.
    _chunk = int(os.environ.get("STOW_S3_CHUNK_MB", "8")) * 1024 * 1024
    transfer_cfg = TransferConfig(
        multipart_threshold=_chunk,
        multipart_chunksize=_chunk,
    )

    extra = {}
    if content_length is not None:
        extra["ContentLength"] = content_length

    s3.upload_fileobj(
        reader, bucket, key,
        ExtraArgs=extra if extra else None,
        Config=transfer_cfg,
    )
    logger.debug("S3 upload complete: s3://%s/%s", bucket, key)


def _write_adls(
    reader: _SyncQueueReader,
    cloud_url: str,
    creds: dict,
    content_length: int | None,
) -> None:
    """Stream *reader* to Azure ADLS Gen2 using a SAS token."""
    from azure.storage.blob import BlobClient

    sas_token = creds.get("sas_token", "")

    # abfss://container@account.dfs.core.windows.net/path/to/file
    m = re.match(r"abfss://([^@]+)@([^/]+)(/.+)", cloud_url)
    if not m:
        raise ValueError(f"Cannot parse Azure ADLS URL: {cloud_url}")
    container, dfs_host, path = m.group(1), m.group(2), m.group(3)
    account = dfs_host.split(".")[0]
    blob_url = f"https://{account}.blob.core.windows.net/{container}{path}?{sas_token}"

    client = BlobClient.from_blob_url(blob_url)
    client.upload_blob(
        reader,
        overwrite=True,
        length=content_length,
        max_concurrency=4,
    )
    logger.debug("ADLS upload complete: %s", cloud_url)


def _write_gcs(
    reader: _SyncQueueReader,
    cloud_url: str,
    creds: dict,
) -> None:
    """Stream *reader* to GCS using a short-lived OAuth2 token."""
    from google.cloud import storage as gcs
    from google.oauth2.credentials import Credentials
    from urllib.parse import urlparse

    parsed = urlparse(cloud_url)
    bucket_name = parsed.netloc
    blob_name = parsed.path.lstrip("/")

    # Databricks returns the token in different shapes depending on config
    access_token = (
        creds.get("access_token")
        or (creds.get("gcp_service_account_token") or {}).get("access_token")
    )
    client = gcs.Client(credentials=Credentials(token=access_token), project=None)
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    blob.upload_from_file(reader, rewind=False)
    logger.debug("GCS upload complete: %s", cloud_url)


# ---------------------------------------------------------------------------
# Public async API
# ---------------------------------------------------------------------------

def _detect_provider(cloud_url: str) -> str:
    if cloud_url.startswith("s3://"):
        return "aws"
    if cloud_url.startswith(("abfss://", "wasbs://", "adl://")):
        return "azure"
    if cloud_url.startswith("gs://"):
        return "gcp"
    raise ValueError(f"Unrecognised cloud storage URL scheme: {cloud_url}")


async def async_stream_to_cloud(
    token: str,
    host: str,
    cloud_url: str,
    body_stream: AsyncIterator[bytes],
    content_length: int | None = None,
) -> int:
    """
    Stream *body_stream* directly to *cloud_url* using UC temp credentials.

    Uses a ``asyncio.Queue`` to decouple the async producer (FastAPI request
    body) from the sync cloud-SDK consumer (boto3 / azure-storage-blob / GCS)
    so neither blocks the event loop and the full file is never buffered in
    memory.

    Returns the total number of bytes written.
    """
    t_start = time.time()
    creds = await asyncio.to_thread(get_temp_credentials, host, token, cloud_url)
    t_creds = time.time()
    provider = _detect_provider(cloud_url)

    # 128 chunks × ~64 KB = ~8 MB per upload (halved from 256 to reduce RSS
    # under high concurrency — each in-flight upload was holding ~16 MB just
    # from the queue buffer).
    _QUEUE_SIZE = int(os.environ.get("STOW_READ_AHEAD_CHUNKS", "128"))
    queue: asyncio.Queue = asyncio.Queue(maxsize=_QUEUE_SIZE)
    total_size = 0

    async def _drain() -> None:
        nonlocal total_size
        try:
            async for chunk in body_stream:
                total_size += len(chunk)
                await queue.put(chunk)
        finally:
            await queue.put(None)

    loop = asyncio.get_event_loop()
    drain_task = asyncio.create_task(_drain())
    reader = _SyncQueueReader(queue, loop)

    try:
        if provider == "aws":
            await asyncio.to_thread(_write_s3, reader, cloud_url, creds, content_length)
        elif provider == "azure":
            await asyncio.to_thread(_write_adls, reader, cloud_url, creds, content_length)
        elif provider == "gcp":
            await asyncio.to_thread(_write_gcs, reader, cloud_url, creds)
    finally:
        if not drain_task.done():
            drain_task.cancel()
        try:
            await drain_task
        except asyncio.CancelledError:
            pass

    t_end = time.time()
    logger.info(
        "Direct cloud upload complete: %s  bytes=%d  creds=%.2fs  upload=%.2fs  total=%.2fs",
        cloud_url, total_size,
        t_creds - t_start,
        t_end - t_creds,
        t_end - t_start,
    )
    return total_size


async def async_direct_volumes_upload(
    token: str,
    host: str,
    volumes_path: str,
    body_stream: AsyncIterator[bytes],
    content_length: int | None = None,
) -> int:
    """
    Convenience wrapper: resolve ``/Volumes/…`` → cloud URL, then stream.

    Raises ``RuntimeError`` if the volume is Managed (no storage_location).
    Callers should catch and fall back to the Files API when needed.
    """
    cloud_url = await asyncio.to_thread(resolve_cloud_url, host, token, volumes_path)
    return await async_stream_to_cloud(
        token, host, cloud_url, body_stream, content_length,
    )


def probe_direct_upload() -> dict:
    """
    Synchronous startup probe that validates the direct-upload configuration.

    Tries to resolve the storage location for the configured Volumes path and
    vend a read credential.  The result is logged clearly at INFO level so
    operators can see the active upload mode in the startup logs without
    having to send a real DICOM file.

    Returns a dict with keys:
        mode        – "direct_cloud" or "files_api"
        provider    – "aws" | "azure" | "gcp" | None
        cloud_url   – resolved cloud storage prefix, or None
        error       – error message string, or None
    """
    result: dict = {"mode": "files_api", "provider": None, "cloud_url": None, "error": None}

    if not DIRECT_UPLOAD_ENABLED:
        logger.info(
            "STOW upload mode: FILES API  "
            "(set STOW_DIRECT_CLOUD_UPLOAD=true to enable direct cloud upload)"
        )
        return result

    volumes_path = os.environ.get("DATABRICKS_STOW_VOLUME_PATH", "")
    if not volumes_path:
        msg = "STOW_DIRECT_CLOUD_UPLOAD=true but DATABRICKS_STOW_VOLUME_PATH is not set"
        logger.warning("STOW upload mode: DIRECT CLOUD — CONFIGURATION INCOMPLETE\n  %s", msg)
        result["error"] = msg
        return result

    try:
        host, token = _sdk_host_and_token()
        if not (host and token):
            raise RuntimeError(
                "Databricks SDK returned empty host or token — check workspace authentication"
            )
        cloud_url = resolve_cloud_url(host, token, volumes_path)
        provider = _detect_provider(cloud_url)

        # Verify credential vending works from this runtime — the UC
        # temporary-path-credentials API only works from Databricks Compute
        # (clusters/SQL warehouses), NOT from Databricks Apps.  Testing here
        # at startup surfaces the failure immediately with a clear message
        # rather than silently falling back on every request.
        get_temp_credentials(host, token, cloud_url)

        result.update({"mode": "direct_cloud", "provider": provider, "cloud_url": cloud_url})
        logger.info(
            "STOW upload mode: DIRECT CLOUD (%s)  "
            "storage_location=%s  volume=%s",
            provider.upper(),
            cloud_url,
            volumes_path,
        )
    except Exception as exc:
        msg = str(exc)
        result.update({"mode": "files_api", "provider": None, "cloud_url": None, "error": msg})
        is_compute_restriction = "outside of Databricks Compute" in msg
        if is_compute_restriction:
            logger.warning(
                "STOW upload mode: FILES API  (direct cloud unavailable from Databricks Apps)\n"
                "  UC credential vending requires Databricks Compute (cluster/SQL warehouse).\n"
                "  The Files API will be used instead — set STOW_VOLUMES_CONCURRENCY ≤ 8.\n"
                "  To enable direct cloud from Apps, provide static cloud credentials via\n"
                "  STOW_AWS_ACCESS_KEY_ID / STOW_AWS_SECRET_ACCESS_KEY env vars (future)."
            )
        else:
            logger.warning(
                "STOW upload mode: FILES API  (direct cloud probe failed)\n"
                "  Reason: %s",
                msg,
            )

    return result
