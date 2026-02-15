"""
DICOMweb Databricks Wrapper — main service class.

Orchestrates QIDO-RS (query), WADO-RS (retrieve), and STOW-RS (store)
operations using:

* **Databricks SQL Connector** with parameterized queries (no SQL injection)
* **PACS-style 3-tier BOT cache** for sub-second frame retrieval
* **Streaming** file delivery for zero-copy instance / frame transfers
* **Volumes Files API** for STOW-RS instance uploads

Authorization is handled by the ``DatabricksSQLClient`` which supports
both App auth and User (OBO) auth.
"""

import json
import os
import threading
import time
from collections.abc import Iterator
from io import BytesIO
from typing import Any, BinaryIO, Dict, List
from urllib.parse import quote as _url_quote

import httpx
import pydicom
from fastapi import HTTPException

from dbx.pixels.databricks_file import DatabricksFile
from dbx.pixels.logging import LoggerProvider

from . import timing_decorator
from .cache import bot_cache, instance_path_cache
from .dicom_io import (
    compute_full_bot,
    file_prefetcher,
    get_file_metadata,
    get_file_part,
    stream_file,
)
from .dicom_tags import format_dicomweb_response
from .queries import (
    build_insert_instance_query,
    build_instance_path_query,
    build_instances_query,
    build_series_instance_paths_query,
    build_series_metadata_query,
    build_series_query,
    build_study_query,
)
from .sql_client import DatabricksSQLClient, validate_table_name

logger = LoggerProvider("DICOMweb.Wrapper")

# ---------------------------------------------------------------------------
# Module-level series pre-warming state
# ---------------------------------------------------------------------------
# Tracks which (study, series) pairs have already been primed so that the
# background task is only submitted once per series — no matter how many
# concurrent WADO-URI / WADO-RS requests arrive.

_series_primed: set[str] = set()
_series_primed_lock = threading.Lock()


class DICOMwebDatabricksWrapper:
    """
    DICOMweb-compliant service backed by a Databricks SQL warehouse.

    *  QIDO-RS — study / series / instance searches
    *  WADO-RS — metadata, full instance, and per-frame retrieval

    Frame retrieval uses a 3-tier PACS-style cache for sub-second latency
    after the initial file indexing.

    **Singleton vs per-request lifecycle:**

    * **App auth (service principal)** — a single instance is created at
      module load time and reused across all requests.  The bearer token
      is resolved lazily via a ``token_provider`` callable so it
      auto-refreshes transparently (the Databricks SDK handles caching
      and renewal internally).
    * **User auth (OBO)** — a new instance is created per request because
      the token, user groups, and potentially the ``pixels_table``
      (cookie) differ between users.
    """

    def __init__(
        self,
        sql_client: DatabricksSQLClient,
        token: str | None = None,
        pixels_table: str = "",
        lb_utils=None,
        user_groups: list[str] | None = None,
        token_provider: "callable | None" = None,
    ):
        """
        Args:
            sql_client: Shared SQL client (handles auth internally).
            token: Static bearer token (used in OBO / per-request mode).
                Ignored when *token_provider* is set.
            pixels_table: Fully-qualified ``catalog.schema.table`` name.
            lb_utils: Optional ``LakebaseUtils`` singleton for persistent
                tier-2 caching (frame offsets + instance paths).
            user_groups: Databricks account groups of the current user.
                Used for RLS enforcement in Lakebase queries and for
                user-scoped in-memory cache keys.  ``None`` in app-auth
                mode (no per-user filtering).
            token_provider: Zero-arg callable that returns a fresh bearer
                token string.  When set, ``token`` is ignored and the
                provider is called on every ``_token`` access.  This
                enables the singleton wrapper to always use a valid,
                auto-refreshed token from the Databricks SDK.
        """
        self._sql = sql_client
        self._token_provider = token_provider
        self._static_token = token or ""
        self._table = validate_table_name(pixels_table)
        self._lb = lb_utils
        self._user_groups = user_groups

    @property
    def _token(self) -> str:
        """Return a current bearer token, auto-refreshed when using a provider."""
        if self._token_provider is not None:
            return self._token_provider()
        return self._static_token

    # -- helper: run parameterized SQL ------------------------------------

    def _query(self, sql: str, params: dict[str, Any] | None = None) -> list[list[Any]]:
        """Execute a parameterized query via the SQL client."""
        return self._sql.execute(sql, parameters=params, user_token=self._token)

    def _query_stream(self, sql: str, params: dict[str, Any] | None = None) -> Iterator[list[Any]]:
        """Execute a parameterized query and return a lazy row iterator."""
        return self._sql.execute_stream(sql, parameters=params, user_token=self._token)

    # ------------------------------------------------------------------
    # QIDO-RS — search
    # ------------------------------------------------------------------

    @timing_decorator
    def search_for_studies(self, params: Dict[str, Any]) -> List[Dict]:
        """QIDO-RS: search for studies."""
        logger.info(f"QIDO-RS: studies search, params={params}")
        query, sql_params = build_study_query(self._table, params)
        results = self._query(query, sql_params)
        columns = [
            "PatientName", "PatientID", "StudyInstanceUID", "StudyDate",
            "AccessionNumber", "StudyDescription", "Modality", "ModalitiesInStudy",
            "NumberOfStudyRelatedSeries", "NumberOfStudyRelatedInstances",
        ]
        formatted = format_dicomweb_response(results, columns)
        logger.info(f"QIDO-RS: found {len(formatted)} studies")
        return formatted

    def search_for_series(self, study_instance_uid: str, params: Dict[str, Any] | None = None) -> List[Dict]:
        """QIDO-RS: search for series within a study."""
        logger.info(f"QIDO-RS: series search in study {study_instance_uid}")
        query, sql_params = build_series_query(self._table, study_instance_uid, params or {})
        results = self._query(query, sql_params)
        columns = [
            "StudyInstanceUID", "SeriesInstanceUID", "Modality", "SeriesNumber",
            "SeriesDescription", "SeriesDate", "NumberOfSeriesRelatedInstances",
        ]
        formatted = format_dicomweb_response(results, columns)
        logger.info(f"QIDO-RS: found {len(formatted)} series")
        return formatted

    def search_for_instances(
        self, study_instance_uid: str, series_instance_uid: str, params: Dict[str, Any] | None = None
    ) -> List[Dict]:
        """QIDO-RS: search for instances within a series.

        **Side-effect**: pre-warms the ``instance_path_cache`` with every
        returned instance's local_path so that subsequent WADO-RS calls
        skip the SQL query entirely (~0.3 s saved per instance).
        """
        logger.info(f"QIDO-RS: instances search in series {series_instance_uid}")
        query, sql_params = build_instances_query(
            self._table, study_instance_uid, series_instance_uid, params or {},
        )
        results = self._query(query, sql_params)

        # Pre-warm instance path cache ────────────────────────────────
        # Column mapping from build_instances_query:
        #   [0] StudyInstanceUID  [1] SeriesInstanceUID  [2] SOPInstanceUID
        #   [3] SOPClassUID  [4] InstanceNumber  [5] Rows  [6] Columns
        #   [7] NumberOfFrames  [8] path  [9] local_path
        cache_entries: dict[str, dict] = {}
        for row in results:
            if row and len(row) >= 10 and row[2] and row[9]:
                sop_uid = str(row[2])
                local_path = str(row[9])
                num_frames = int(row[7]) if row[7] else 1
                cache_entries[sop_uid] = {"path": local_path, "num_frames": num_frames}
        if cache_entries:
            instance_path_cache.batch_put(
                self._table, cache_entries, user_groups=self._user_groups,
            )
            logger.info(
                f"Pre-warmed instance path cache with {len(cache_entries)} entries "
                f"(eliminates SQL for subsequent WADO-RS calls)"
            )

        # Mark series as primed so that _maybe_prime_series (called by
        # retrieve_instance / retrieve_instance_frames) skips the duplicate
        # series-level query.
        series_key = f"{study_instance_uid}/{series_instance_uid}"
        already_primed = False
        with _series_primed_lock:
            already_primed = series_key in _series_primed
            _series_primed.add(series_key)

        # Persist to Lakebase (tier-2 — survives restarts) ────────────
        # Skip if the series was already primed (data is already in Lakebase).
        if cache_entries and self._lb and not already_primed:
            try:
                lb_entries = [
                    {
                        "sop_instance_uid": uid,
                        "study_instance_uid": study_instance_uid,
                        "series_instance_uid": series_instance_uid,
                        "local_path": info["path"],
                        "num_frames": info.get("num_frames", 1),
                        "uc_table_name": self._table,
                    }
                    for uid, info in cache_entries.items()
                ]
                self._lb.insert_instance_paths_batch(
                    lb_entries, allowed_groups=self._user_groups,
                )
            except Exception as exc:
                logger.warning(f"Lakebase path batch persist failed (non-fatal): {exc}")

        # Background prefetch — download files from Volumes in parallel ─
        # Small files are downloaded fully so that subsequent WADO-RS
        # instance retrieval is instant (served from memory).
        # BOT computation is deferred to the first frame-level request.
        # Skip if the series was already primed (downloads already scheduled).
        if not already_primed:
            prefetch_paths = [info["path"] for info in cache_entries.values()]
            if prefetch_paths:
                n = file_prefetcher.schedule(self._token, prefetch_paths)
                logger.info(
                    f"Background prefetch: {n} new downloads scheduled "
                    f"({len(prefetch_paths)} instances)"
                )
        # ──────────────────────────────────────────────────────────────

        columns = [
            "StudyInstanceUID", "SeriesInstanceUID", "SOPInstanceUID", "SOPClassUID",
            "InstanceNumber", "Rows", "Columns", "NumberOfFrames", "path", "local_path",
        ]
        formatted = format_dicomweb_response(results, columns)
        logger.info(f"QIDO-RS: found {len(formatted)} instances")
        return formatted

    # ------------------------------------------------------------------
    # Path resolution — resolve SOP Instance UID → file path
    # ------------------------------------------------------------------

    def resolve_instance_paths(
        self,
        study_instance_uid: str,
        series_instance_uid: str,
    ) -> dict[str, str]:
        """
        Resolve file paths for every instance in a series.

        Uses the same 3-tier cache hierarchy as WADO-RS path resolution:

        1. **In-memory** ``instance_path_cache`` (µs)
        2. **Lakebase** persistent cache (ms)
        3. **SQL warehouse** fallback (~300 ms)

        Returns:
            ``{sop_instance_uid: local_path}`` mapping for all instances
            in the series.

        Raises:
            HTTPException 404: If no instances are found for the series.
        """
        logger.info(
            f"Resolve paths: study={study_instance_uid}, series={series_instance_uid}"
        )

        # ── Tier 2: Lakebase persistent cache ────────────────────────
        # (Tier 1 is keyed by individual SOP UIDs, not by series, so we
        # start at tier 2 for series-level bulk lookups.)
        if self._lb:
            try:
                lb_results = self._lb.retrieve_instance_paths_by_series(
                    study_instance_uid, series_instance_uid, self._table,
                    user_groups=self._user_groups,
                )
                if lb_results:
                    # Promote to tier 1
                    instance_path_cache.batch_put(
                        self._table, lb_results, user_groups=self._user_groups,
                    )
                    paths = {uid: info["path"] for uid, info in lb_results.items()}
                    logger.info(f"Resolve paths: {len(paths)} paths from Lakebase")
                    return paths
            except Exception as exc:
                logger.warning(f"Lakebase path lookup failed (non-fatal): {exc}")

        # ── Tier 3: SQL warehouse ────────────────────────────────────
        query, sql_params = build_instances_query(
            self._table, study_instance_uid, series_instance_uid,
        )
        results = self._query(query, sql_params)

        if not results:
            raise HTTPException(
                status_code=404,
                detail=(
                    f"No instances found for study={study_instance_uid}, "
                    f"series={series_instance_uid}"
                ),
            )

        # Column mapping from build_instances_query:
        #   [0] StudyInstanceUID  [1] SeriesInstanceUID  [2] SOPInstanceUID
        #   [3] SOPClassUID  [4] InstanceNumber  [5] Rows  [6] Columns
        #   [7] NumberOfFrames  [8] path  [9] local_path
        paths: dict[str, str] = {}
        cache_entries: dict[str, dict] = {}
        for row in results:
            if row and len(row) >= 10 and row[2] and row[9]:
                sop_uid = str(row[2])
                local_path = str(row[9])
                num_frames = int(row[7]) if row[7] else 1
                paths[sop_uid] = local_path
                cache_entries[sop_uid] = {"path": local_path, "num_frames": num_frames}

        # Pre-warm caches (tier 1 + tier 2) ────────────────────────────
        if cache_entries:
            instance_path_cache.batch_put(
                self._table, cache_entries, user_groups=self._user_groups,
            )
            if self._lb:
                try:
                    lb_entries = [
                        {
                            "sop_instance_uid": uid,
                            "study_instance_uid": study_instance_uid,
                            "series_instance_uid": series_instance_uid,
                            "local_path": info["path"],
                            "num_frames": info.get("num_frames", 1),
                            "uc_table_name": self._table,
                        }
                        for uid, info in cache_entries.items()
                    ]
                    self._lb.insert_instance_paths_batch(
                        lb_entries, allowed_groups=self._user_groups,
                    )
                except Exception as exc:
                    logger.warning(f"Lakebase path batch persist failed (non-fatal): {exc}")

        logger.info(f"Resolve paths: {len(paths)} paths from SQL warehouse")
        return paths

    # ------------------------------------------------------------------
    # STOW-RS — store instances
    # ------------------------------------------------------------------

    # ── STOW-RS upload constants ────────────────────────────────────────
    _STOW_MAX_RETRIES = 4
    _STOW_BACKOFF_BASE = 2.0
    _STOW_UPLOAD_TIMEOUT = 600.0   # 10 min read-timeout for large files

    def stow_volume_base(self) -> str:
        """Public accessor for the STOW-RS volume base path."""
        return self._stow_volume_base()

    def commit_instance(self, inst: Dict[str, Any]) -> None:
        """
        **Background task:** upload to Volume → parse DICOM → catalog insert → cache.

        Designed to run as a Starlette ``BackgroundTask`` after the HTTP
        response has been returned to the caller.

        The upload is performed via a direct ``httpx.PUT`` to the
        Databricks Files API (proxy-style, no SDK dependency), matching
        the pattern used by the legacy lakehouse app.

        After the file lands on the Volume the DICOM header is parsed
        from the *local* temp file (no extra round-trip), metadata is
        extracted, the catalog row is inserted, and caches are warmed.

        Args:
            inst: Dict with keys ``part_file`` (seekable ``BinaryIO``),
                ``volume_path`` (full ``/Volumes/…`` destination),
                and ``file_rel`` (relative path for catalog).
        """
        part_file: BinaryIO = inst["part_file"]
        volume_path: str = inst["volume_path"]
        file_rel: str = inst["file_rel"]

        try:
            # ── 1. Measure size ──────────────────────────────────────
            part_file.seek(0, 2)
            part_size = part_file.tell()
            size_mb = part_size / (1024 ** 2)

            # ── 2. Upload to Volume via httpx PUT (proxy) ────────────
            host = os.environ["DATABRICKS_HOST"].rstrip("/")
            token = self._token
            encoded_path = _url_quote(volume_path, safe="/")
            url = f"{host}/api/2.0/fs/files{encoded_path}"

            last_exc: BaseException | None = None
            for attempt in range(1, self._STOW_MAX_RETRIES + 1):
                try:
                    part_file.seek(0)
                    with httpx.Client(
                        timeout=httpx.Timeout(
                            self._STOW_UPLOAD_TIMEOUT, connect=10.0,
                        ),
                    ) as client:
                        resp = client.put(
                            url,
                            content=part_file,
                            headers={
                                "Authorization": f"Bearer {token}",
                                "Content-Type": "application/octet-stream",
                            },
                            params={"overwrite": "true"},
                        )
                        resp.raise_for_status()
                    logger.info(
                        f"STOW-RS upload: {volume_path} "
                        f"({size_mb:.1f} MB, attempt {attempt})"
                    )
                    break  # success
                except Exception as exc:
                    last_exc = exc
                    if attempt < self._STOW_MAX_RETRIES:
                        wait = self._STOW_BACKOFF_BASE ** attempt
                        logger.warning(
                            f"STOW-RS upload attempt {attempt}/"
                            f"{self._STOW_MAX_RETRIES} failed for "
                            f"{volume_path} ({size_mb:.1f} MB): {exc} "
                            f"— retrying in {wait:.0f}s"
                        )
                        time.sleep(wait)
                    else:
                        raise last_exc  # type: ignore[misc]

            # ── 3. Parse DICOM metadata from temp file ───────────────
            part_file.seek(0)
            ds = pydicom.dcmread(part_file, stop_before_pixels=True)

            sop_instance_uid = str(getattr(ds, "SOPInstanceUID", ""))
            study_uid = str(getattr(ds, "StudyInstanceUID", ""))
            series_uid = str(getattr(ds, "SeriesInstanceUID", ""))

            meta_dict = ds.to_json_dict()
            if hasattr(ds, "file_meta"):
                meta_dict.update(ds.file_meta.to_json_dict())
            meta_dict.pop("7FE00010", None)  # strip PixelData tag
            meta_json = json.dumps(meta_dict)

            logger.info(
                f"STOW-RS meta_json size: {len(meta_json)} bytes for {sop_instance_uid} ({volume_path})"
            )

            num_frames = int(getattr(ds, "NumberOfFrames", 1))

            # ── 4. Insert catalog row ────────────────────────────────
            insert_query, _ = build_insert_instance_query(self._table)
            params = {
                "pixels_table": self._table,
                "path": f"dbfs:{volume_path}",
                "length": part_size,
                "relative_path": file_rel,
                "local_path": volume_path,
                "meta_json": meta_json,
            }
            self._query(insert_query, params)

            logger.info(
                f"STOW-RS commit: {sop_instance_uid} → {volume_path}"
            )

            # ── 5. Warm caches ───────────────────────────────────────
            instance_path_cache.put(
                sop_instance_uid, self._table,
                {"path": volume_path, "num_frames": num_frames},
                user_groups=self._user_groups,
            )
            if self._lb:
                try:
                    self._lb.insert_instance_paths_batch(
                        [{
                            "sop_instance_uid": sop_instance_uid,
                            "study_instance_uid": study_uid,
                            "series_instance_uid": series_uid,
                            "local_path": volume_path,
                            "num_frames": num_frames,
                            "uc_table_name": self._table,
                        }],
                        allowed_groups=self._user_groups,
                    )
                except Exception as exc:
                    logger.warning(
                        f"STOW-RS: Lakebase cache warm failed (non-fatal): {exc}"
                    )

        except Exception as exc:
            logger.error(
                f"STOW-RS commit FAILED for {volume_path}: {exc}",
                exc_info=True,
            )
        finally:
            try:
                part_file.close()
            except Exception:
                pass

    def _stow_volume_base(self) -> str:
        """
        Derive the Volumes base path for STOW-RS file uploads.

        Resolution order:

        1. ``DATABRICKS_STOW_VOLUME_PATH`` env var (explicit override).
        2. Derived from ``pixels_table`` — ``/Volumes/{catalog}/{schema}/pixels_volume``.
        """
        explicit = os.getenv("DATABRICKS_STOW_VOLUME_PATH")
        if explicit:
            return explicit.rstrip("/")

        parts = self._table.split(".")
        if len(parts) != 3:
            raise HTTPException(
                status_code=500,
                detail="Cannot derive STOW volume path from pixels_table "
                       f"'{self._table}'. Set DATABRICKS_STOW_VOLUME_PATH.",
            )
        return f"/Volumes/{parts[0]}/{parts[1]}/pixels_volume"

    # ------------------------------------------------------------------
    # WADO-RS — metadata / instance retrieval
    # ------------------------------------------------------------------

    @timing_decorator
    def retrieve_series_metadata(self, study_instance_uid: str, series_instance_uid: str) -> Iterator[str]:
        """
        WADO-RS: stream DICOM metadata for every instance in a series.

        Returns an iterator of string chunks forming a JSON array.  Each
        instance's ``meta`` column is emitted as-is (already valid JSON),
        avoiding the ``json.loads`` / ``json.dumps`` round-trip and keeping
        memory usage proportional to one Arrow batch rather than the full
        result set.
        """
        logger.info(f"WADO-RS: metadata for series {series_instance_uid}")
        query, params = build_series_metadata_query(
            self._table, study_instance_uid, series_instance_uid,
        )
        row_stream = self._query_stream(query, params)

        # Peek at first row — raise 404 before streaming starts so the
        # HTTP status code is still correct.
        first_row = next(row_stream, None)
        if first_row is None or not first_row[0]:
            raise HTTPException(status_code=404, detail="Series not found or no instances")

        def _json_chunks() -> Iterator[str]:
            count = 1
            yield "[\n"
            yield first_row[0]
            for row in row_stream:
                if row and row[0]:
                    yield ",\n"
                    yield row[0]
                    count += 1
            yield "\n]"
            logger.info(f"WADO-RS: streamed {count} instance metadata records")

        return _json_chunks()

    @timing_decorator
    def retrieve_instance(
        self, study_instance_uid: str, series_instance_uid: str, sop_instance_uid: str
    ) -> tuple[Iterator[bytes], str | None]:
        """
        WADO-RS / WADO-URI: retrieve a full DICOM instance.

        Resolution order (fastest → slowest):

        1. **Prefetch cache** — file was downloaded in the background by a
           worker thread right after the QIDO query or series prime.
           Served instantly from memory (~0 ms).
        2. **Stream from Volumes** — fallback if the prefetch hasn't
           finished yet.  Uses the pooled ``requests.Session`` (~0.2 s).

        On the **first** request for a series, a background task pre-warms
        all sibling instances (paths + prefetch + BOTs) so subsequent
        WADO-URI calls are instant even without a preceding QIDO-RS query.

        Returns ``(chunk_generator, content_length_str | None)``.
        """
        # --- Trigger series-level pre-warming in background ───────────
        self._maybe_prime_series(study_instance_uid, series_instance_uid)

        # --- Resolve SOP UID → file path (3-tier: memory → Lakebase → SQL) ---
        local_path = self._resolve_instance_path(
            study_instance_uid, series_instance_uid, sop_instance_uid,
        )

        # --- Check prefetch cache (instant if background download finished) ---
        prefetched = file_prefetcher.get(local_path)
        if prefetched is not None:
            logger.info(
                f"WADO-RS: {sop_instance_uid} served from prefetch "
                f"({len(prefetched)} bytes, instant)"
            )
            return iter([prefetched]), str(len(prefetched))

        # --- Fallback: stream from Volumes ---
        logger.info(f"WADO-RS: {sop_instance_uid} streaming from Volumes (prefetch miss)")
        try:
            db_file = DatabricksFile.from_full_path(local_path)
            return stream_file(self._token, db_file)
        except Exception as exc:
            logger.error(f"Error streaming instance: {exc}")
            raise HTTPException(status_code=500, detail=f"Error streaming instance: {exc}")

    # ------------------------------------------------------------------
    # WADO-RS — PACS-style frame retrieval (3-tier cache, streaming)
    # ------------------------------------------------------------------

    @timing_decorator
    def retrieve_instance_frames(
        self,
        study_instance_uid: str,
        series_instance_uid: str,
        sop_instance_uid: str,
        frame_numbers: List[int],
    ) -> tuple[Iterator[bytes], str]:
        """
        Retrieve specific frames using the 3-tier PACS-style BOT cache,
        returning a **streaming** generator.

        The BOT resolution (cache lookups / computation) happens eagerly so
        that errors surface before the first byte is sent.  Frame bytes are
        then yielded one-by-one via byte-range HTTP reads, giving the client
        data as soon as each frame arrives.

        On the first request for a series, sibling instances are pre-warmed
        in the background (same as ``retrieve_instance``).

        Args:
            frame_numbers: 1-indexed frame numbers (per DICOMweb spec).

        Returns:
            ``(frame_generator, transfer_syntax_uid)``
        """
        logger.info(f"WADO-RS: frames {frame_numbers} from {sop_instance_uid}")

        # --- Trigger series-level pre-warming in background ───────────
        self._maybe_prime_series(study_instance_uid, series_instance_uid)

        db_file, frames_by_idx, transfer_syntax_uid = self._resolve_frame_offsets(
            study_instance_uid, series_instance_uid, sop_instance_uid,
            frame_numbers,
        )

        token = self._token

        def generate() -> Iterator[bytes]:
            for fn in frame_numbers:
                meta = frames_by_idx[fn - 1]
                t0 = time.time()
                content = get_file_part(token, db_file, meta)
                logger.info(
                    f"⏱️  get_file_part frame {fn}: "
                    f"{time.time() - t0:.4f}s, {len(content)} bytes"
                )
                content = DICOMwebDatabricksWrapper._strip_item_header(content, fn)
                yield content

        return generate(), transfer_syntax_uid

    # ------------------------------------------------------------------
    # Series pre-warming (critical for WADO-URI without prior QIDO-RS)
    # ------------------------------------------------------------------

    def _maybe_prime_series(
        self,
        study_instance_uid: str,
        series_instance_uid: str,
    ) -> None:
        """
        Trigger **background** pre-warming of all instances in a series.

        Called from ``retrieve_instance`` and ``retrieve_instance_frames``
        so that when a viewer issues WADO-URI requests directly (without
        a preceding QIDO-RS query), the first request primes the caches
        for all siblings and subsequent requests are instant.

        * Only fires **once** per ``(study, series)`` pair.
        * Non-blocking — returns immediately.
        * Uses the prefetcher's thread pool (shared CPU budget).
        """
        key = f"{study_instance_uid}/{series_instance_uid}"
        with _series_primed_lock:
            if key in _series_primed:
                return
            _series_primed.add(key)

        # Submit to the prefetcher's thread pool so we share the CPU budget.
        file_prefetcher._pool.submit(
            self._prime_series_task,
            study_instance_uid,
            series_instance_uid,
        )
        logger.info(
            f"Series pre-warm scheduled for {series_instance_uid} (background)"
        )

    def _prime_series_task(
        self,
        study_instance_uid: str,
        series_instance_uid: str,
    ) -> None:
        """
        Background task: load ALL instance paths for a series, pre-warm
        every cache tier, and schedule file prefetch.

        Resolution order (same 3-tier pattern):
        1. Lakebase ``retrieve_instance_paths_by_series``  (ms)
        2. SQL warehouse — full series query                (~0.3 s)

        Results are:
        * Pushed into the in-memory ``instance_path_cache``
        * Persisted to Lakebase (if sourced from SQL)
        * Passed to the file prefetcher
        """
        try:
            cache_entries: dict[str, dict] = {}

            # ── Tier 2: Lakebase series-level lookup (ms) ──────────────
            if self._lb:
                try:
                    t0 = time.time()
                    lb_entries = self._lb.retrieve_instance_paths_by_series(
                        study_instance_uid, series_instance_uid, self._table,
                        user_groups=self._user_groups,
                    )
                    elapsed = time.time() - t0
                    if lb_entries:
                        cache_entries = lb_entries
                        logger.info(
                            f"Series pre-warm: Lakebase HIT — "
                            f"{len(cache_entries)} instances in {elapsed:.4f}s"
                        )
                except Exception as exc:
                    logger.warning(
                        f"Series pre-warm: Lakebase lookup failed ({exc})"
                    )

            # ── Tier 3: SQL warehouse (~0.3 s, one-time per series) ────
            if not cache_entries:
                t0 = time.time()
                query, params = build_series_instance_paths_query(
                    self._table, study_instance_uid, series_instance_uid,
                )
                results = self._query(query, params)
                elapsed = time.time() - t0

                for row in results:
                    if row and len(row) >= 3 and row[0] and row[1]:
                        sop_uid = str(row[0])
                        cache_entries[sop_uid] = {
                            "path": str(row[1]),
                            "num_frames": int(row[2]),
                        }

                logger.info(
                    f"Series pre-warm: SQL returned "
                    f"{len(cache_entries)} instances in {elapsed:.4f}s"
                )

                # Persist to Lakebase so future restarts are instant
                if cache_entries and self._lb:
                    try:
                        lb_records = [
                            {
                                "sop_instance_uid": uid,
                                "study_instance_uid": study_instance_uid,
                                "series_instance_uid": series_instance_uid,
                                "local_path": info["path"],
                                "num_frames": info.get("num_frames", 1),
                                "uc_table_name": self._table,
                            }
                            for uid, info in cache_entries.items()
                        ]
                        self._lb.insert_instance_paths_batch(
                            lb_records, allowed_groups=self._user_groups,
                        )
                        logger.info(
                            f"Series pre-warm: persisted "
                            f"{len(lb_records)} paths to Lakebase"
                        )
                    except Exception as exc:
                        logger.warning(
                            f"Series pre-warm: Lakebase persist failed ({exc})"
                        )

            if not cache_entries:
                logger.warning("Series pre-warm: no instances found")
                return

            # ── Push into in-memory cache ──────────────────────────────
            instance_path_cache.batch_put(
                self._table, cache_entries, user_groups=self._user_groups,
            )
            logger.info(
                f"Series pre-warm: cached {len(cache_entries)} instance paths "
                f"in memory"
            )

            # ── Schedule file prefetch ──────────────────────────────────
            paths = [info["path"] for info in cache_entries.values()]
            n_pf = file_prefetcher.schedule(self._token, paths)
            logger.info(
                f"Series pre-warm complete: {n_pf} prefetch tasks scheduled "
                f"({len(cache_entries)} instances total)"
            )

        except Exception as exc:
            logger.warning(f"Series pre-warm failed (non-fatal): {exc}")

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _resolve_instance_path(
        self,
        study_instance_uid: str,
        series_instance_uid: str,
        sop_instance_uid: str,
    ) -> str:
        """
        Resolve SOP Instance UID → local file path using a 3-tier cache.

        1. In-memory ``instance_path_cache``  (µs)
        2. Lakebase ``instance_paths`` table  (ms)  — RLS-protected
        3. SQL warehouse query                (~300 ms) — UC row-filtered

        When ``user_groups`` is set (OBO mode + RLS), the in-memory cache
        key includes a groups hash so that two users with different group
        memberships never share cache entries.  Lakebase queries include
        ``SET LOCAL app.user_groups`` for PostgreSQL RLS enforcement.

        Side effects: promotes results into higher-tier caches and persists
        to Lakebase on a tier-3 hit.

        Returns:
            ``local_path`` string.

        Raises:
            HTTPException 404: if the instance is not found anywhere.
        """
        # ── Tier 1: in-memory cache (µs) ──────────────────────────────
        path_info = instance_path_cache.get(
            sop_instance_uid, self._table, user_groups=self._user_groups,
        )
        if path_info:
            return path_info["path"]

        # ── Tier 2: Lakebase persistent cache (ms) ────────────────────
        if self._lb:
            try:
                t0 = time.time()
                lb_info = self._lb.retrieve_instance_path(
                    study_instance_uid, series_instance_uid,
                    sop_instance_uid, self._table,
                    user_groups=self._user_groups,
                )
                logger.info(f"⏱️  Lakebase path lookup took {time.time() - t0:.4f}s")
                if lb_info:
                    logger.info(f"Instance path Lakebase HIT for {sop_instance_uid}")
                    instance_path_cache.put(
                        sop_instance_uid, self._table,
                        {"path": lb_info["path"], "num_frames": lb_info["num_frames"]},
                        user_groups=self._user_groups,
                    )
                    return lb_info["path"]
            except Exception as exc:
                logger.warning(f"Lakebase path lookup failed (non-fatal): {exc}")

        # ── Tier 3: SQL warehouse (~300 ms) ───────────────────────────
        logger.info(f"Instance path cache MISS — querying SQL for {sop_instance_uid}")
        query, params = build_instance_path_query(
            self._table, study_instance_uid, series_instance_uid, sop_instance_uid,
        )
        results = self._query(query, params)
        if not results or not results[0]:
            raise HTTPException(status_code=404, detail="Instance not found")

        local_path = results[0][0]
        num_frames = int(results[0][1])

        # Promote to tier 1
        instance_path_cache.put(
            sop_instance_uid, self._table,
            {"path": local_path, "num_frames": num_frames},
            user_groups=self._user_groups,
        )

        # Persist to tier 2 (Lakebase)
        if self._lb:
            try:
                self._lb.insert_instance_paths_batch(
                    [{
                        "sop_instance_uid": sop_instance_uid,
                        "study_instance_uid": study_instance_uid,
                        "series_instance_uid": series_instance_uid,
                        "local_path": local_path,
                        "num_frames": num_frames,
                        "uc_table_name": self._table,
                    }],
                    allowed_groups=self._user_groups,
                )
            except Exception as exc:
                logger.warning(f"Lakebase path persist failed (non-fatal): {exc}")

        return local_path

    def _resolve_frame_offsets(
        self,
        study_instance_uid: str,
        series_instance_uid: str,
        sop_instance_uid: str,
        frame_numbers: List[int],
    ) -> tuple[DatabricksFile, dict, str]:
        """
        Resolve frame byte-offsets from the 3-tier PACS cache.

        1. In-memory BOT cache  (µs)
        2. Lakebase persistent   (ms)
        3. Full BOT computation  (s) — only on first access

        Returns:
            ``(db_file, frames_by_idx, transfer_syntax_uid)``

        Raises:
            HTTPException: If the instance or requested frames are not found.
        """
        # --- resolve SOP UID → file path (3-tier) ---
        path = self._resolve_instance_path(
            study_instance_uid, series_instance_uid, sop_instance_uid,
        )

        db_file = DatabricksFile.from_full_path(path)
        filename = db_file.full_path
        token = self._token

        try:
            # --- TIER 1: in-memory BOT cache (µs) ---
            cached_bot = bot_cache.get(filename, self._table)
            if cached_bot:
                logger.info(f"BOT cache HIT ({bot_cache.stats})")
                frames_by_idx = cached_bot.get("frames_by_idx", {})
                if all((fn - 1) in frames_by_idx for fn in frame_numbers):
                    return db_file, frames_by_idx, cached_bot["transfer_syntax_uid"]

            # --- TIER 2: Lakebase persistent cache (ms) ---
            if self._lb:
                logger.info(f"Checking Lakebase for {filename}")
                t0 = time.time()
                lb_frames = self._lb.retrieve_all_frame_ranges(
                    filename, self._table, user_groups=self._user_groups,
                )
                logger.info(f"⏱️  Lakebase lookup took {time.time() - t0:.4f}s")

                if lb_frames:
                    logger.info(f"Lakebase HIT — {len(lb_frames)} frames")
                    lb_idx = {f["frame_number"]: f for f in lb_frames}

                    if all((fn - 1) in lb_idx for fn in frame_numbers):
                        tsuid = (cached_bot or {}).get("transfer_syntax_uid")
                        if not tsuid:
                            meta = get_file_metadata(token, db_file)
                            tsuid = meta.get("00020010", {}).get("Value", ["1.2.840.10008.1.2.1"])[0]

                        bot_cache.put_from_lakebase(filename, self._table, lb_frames, tsuid)
                        logger.info("Promoted Lakebase → memory cache")
                        return db_file, lb_idx, tsuid

            # --- TIER 3: compute full BOT (one-time cost per file) ---
            logger.info(f"Cache MISS — computing full BOT for {filename}")
            t0 = time.time()
            bot_data = compute_full_bot(token, db_file)
            logger.info(
                f"⏱️  compute_full_bot took {time.time() - t0:.4f}s — "
                f"{len(bot_data['frames'])} frames, tsuid={bot_data['transfer_syntax_uid']}"
            )

            bot_cache.put(filename, self._table, bot_data)

            if self._lb:
                try:
                    t0 = time.time()
                    self._lb.insert_frame_ranges(
                        filename, bot_data["frames"], self._table,
                        allowed_groups=self._user_groups,
                    )
                    logger.info(f"⏱️  Lakebase persist took {time.time() - t0:.4f}s")
                except Exception as exc:
                    logger.warning(f"Lakebase persist failed (non-fatal): {exc}")

            frames_by_idx = bot_data.get("frames_by_idx", {})
            for fn in frame_numbers:
                if (fn - 1) not in frames_by_idx:
                    raise HTTPException(
                        status_code=404,
                        detail=(
                            f"Frame {fn} (idx {fn - 1}) not found. "
                            f"File has {bot_data['num_frames']} frames."
                        ),
                    )

            return db_file, frames_by_idx, bot_data["transfer_syntax_uid"]

        except HTTPException:
            raise
        except Exception as exc:
            logger.error(f"Frame offset resolution error: {exc}")
            raise HTTPException(status_code=500, detail=f"Error resolving frame offsets: {exc}")

    @staticmethod
    def _strip_item_header(frame_content: bytes, frame_num: int) -> bytes:
        """Strip the 8-byte DICOM Item tag header if present."""
        if len(frame_content) >= 8 and frame_content[:4] == b"\xfe\xff\x00\xe0":
            logger.debug(f"Frame {frame_num}: stripping Item tag header")
            return frame_content[8:]
        return frame_content
