"""
DICOMweb Databricks Wrapper — main service class.

Orchestrates QIDO-RS (query) and WADO-RS (retrieve) operations using:

* **Databricks SQL Connector** with parameterized queries (no SQL injection)
* **PACS-style 3-tier BOT cache** for sub-second frame retrieval
* **Streaming** file delivery for zero-copy instance / frame transfers

Authorization is handled by the ``DatabricksSQLClient`` which supports
both App auth and User (OBO) auth.
"""

import os
import threading
import time
from collections.abc import Iterator
from typing import Any, Dict, List

from fastapi import HTTPException

from dbx.pixels.databricks_file import DatabricksFile
from dbx.pixels.logging import LoggerProvider

from . import timing_decorator
from .cache import bot_cache, instance_path_cache
from .dicom_io import (
    _HEADER_EXTENDED_BYTES,
    _HEADER_INITIAL_BYTES,
    _PIXEL_DATA_MARKER,
    _extract_from_extended_offset_table,
    _fetch_bytes_range,
    _find_pixel_data_pos,
    _pixel_data_header_size,
    _uncompressed_frame_length,
    compute_full_bot,
    file_prefetcher,
    get_file_metadata,
    get_file_part,
    get_file_part_local,
    progressive_streamer,
    stream_file,
)
from .dicom_tags import format_dicomweb_response
from .queries import (
    build_all_series_query,
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
# Fire-and-forget Lakebase touch helpers
# ---------------------------------------------------------------------------
# Touching last_used_at / access_count should never block a request.
# Both helpers submit work to the prefetcher's thread pool so they share
# the existing worker budget without spawning extra threads.

def _touch_lakebase(lb, filename: str, uc_table: str) -> None:
    """
    Fire-and-forget: update ``last_used_at`` and increment ``access_count``
    for *filename* in Lakebase.  Failures are logged at DEBUG level only.
    """
    def _run():
        try:
            lb.touch_frame_ranges(filename, uc_table)
        except Exception as exc:
            logger.debug(f"touch_frame_ranges non-fatal: {exc}")

    try:
        file_prefetcher._pool.submit(_run)
    except Exception:
        pass  # pool may be shut down; ignore


def _touch_lakebase_batch(lb, filenames: list[str], uc_table: str) -> None:
    """
    Fire-and-forget batch variant for series-level BOT preloads.
    """
    if not filenames:
        return

    def _run():
        try:
            lb.touch_frame_ranges_batch(filenames, uc_table)
        except Exception as exc:
            logger.debug(f"touch_frame_ranges_batch non-fatal: {exc}")

    try:
        file_prefetcher._pool.submit(_run)
    except Exception:
        pass


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
        logger.debug(f"QIDO-RS: studies search, params={params}")
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
        logger.debug(f"QIDO-RS: series search in study {study_instance_uid}")
        query, sql_params = build_series_query(self._table, study_instance_uid, params or {})
        results = self._query(query, sql_params)
        columns = [
            "StudyInstanceUID", "SeriesInstanceUID", "Modality", "SeriesNumber",
            "SeriesDescription", "SeriesDate", "NumberOfSeriesRelatedInstances",
        ]
        formatted = format_dicomweb_response(results, columns)
        logger.info(f"QIDO-RS: found {len(formatted)} series")
        return formatted

    @timing_decorator
    def search_for_all_series(self) -> List[Dict]:
        """QIDO-RS bulk: return every (study, series) pair in a single query."""
        logger.debug("QIDO-RS: bulk all-series discovery")
        query, sql_params = build_all_series_query(self._table)
        results = self._query(query, sql_params)
        columns = [
            "StudyInstanceUID", "SeriesInstanceUID", "Modality", "SeriesNumber",
            "SeriesDescription", "SeriesDate", "NumberOfSeriesRelatedInstances",
        ]
        formatted = format_dicomweb_response(results, columns)
        logger.info(f"QIDO-RS bulk: found {len(formatted)} series across all studies")
        return formatted

    def search_for_instances(
        self, study_instance_uid: str, series_instance_uid: str, params: Dict[str, Any] | None = None
    ) -> List[Dict]:
        """QIDO-RS: search for instances within a series.

        **Side-effect**: pre-warms the ``instance_path_cache`` with every
        returned instance's local_path so that subsequent WADO-RS calls
        skip the SQL query entirely (~0.3 s saved per instance).
        """
        logger.debug(f"QIDO-RS: instances search in series {series_instance_uid}")
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
            logger.debug(
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

        # Background prefetch + BOT preloading ─────────────────────────
        # Small files are downloaded fully so that subsequent WADO-RS
        # instance retrieval is instant (served from memory).
        # BOTs are preloaded in a background thread so that subsequent
        # WADO-RS frame requests skip the per-instance computation.
        # Skip if the series was already primed (downloads already scheduled).
        if not already_primed:
            prefetch_paths = [info["path"] for info in cache_entries.values()]
            if prefetch_paths:
                n = file_prefetcher.schedule(self._token, prefetch_paths)
                logger.debug(
                    f"Background prefetch: {n} new downloads scheduled "
                    f"({len(prefetch_paths)} instances)"
                )
            if cache_entries:
                file_prefetcher._pool.submit(
                    self._preload_series_bots, dict(cache_entries),
                )
                logger.debug(
                    f"Background BOT preload scheduled for "
                    f"{len(cache_entries)} instances"
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
        logger.debug(
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
                    logger.debug(f"Resolve paths: {len(paths)} paths from Lakebase")
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

        logger.debug(f"Resolve paths: {len(paths)} paths from SQL warehouse")
        return paths

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
        logger.debug(f"WADO-RS: metadata for series {series_instance_uid}")
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
            logger.info(f"WADO-RS: streamed {count} metadata records")

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
            logger.info(f"WADO-RS: instance {sop_instance_uid} from prefetch ({len(prefetched)} B)")
            return iter([prefetched]), str(len(prefetched))

        # --- Fallback: stream from Volumes ---
        logger.info(f"WADO-RS: instance {sop_instance_uid} streaming from Volumes")
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
        Retrieve specific frames using progressive streaming with
        single-writer / multi-reader coordination.

        **Fast path** (BOT already cached in tier 1/2): frame byte
        ranges are known immediately.  Frames are served from the local
        disk cache (if available) or via remote byte-range reads.

        **Slow path** (cache miss): a progressive streaming worker is
        started (or joined if already running).  For each requested
        frame the caller:

        1. Registers an inline capture slot (zero-copy from the stream).
        2. Waits until the stream discovers the frame's offset.
        3. Serves the frame from the capture slot, the local cache file,
           or a remote byte-range read (in that order of preference).

        On the first request for a series, sibling instances are
        pre-warmed in the background (same as ``retrieve_instance``).

        Args:
            frame_numbers: 1-indexed frame numbers (per DICOMweb spec).

        Returns:
            ``(frame_generator, transfer_syntax_uid)``
        """
        logger.info(f"WADO-RS: frames {frame_numbers} from {sop_instance_uid}")

        # --- Trigger series-level pre-warming in background ───────────
        self._maybe_prime_series(study_instance_uid, series_instance_uid)

        # --- Resolve SOP UID → file path (3-tier) ---
        path = self._resolve_instance_path(
            study_instance_uid, series_instance_uid, sop_instance_uid,
        )
        db_file = DatabricksFile.from_full_path(path)
        filename = db_file.full_path
        token = self._token

        # --- Try fast path: BOT already cached (tier 1 / 2) ---
        fast_result = self._try_cached_frames(
            db_file, filename, token, frame_numbers,
        )
        if fast_result is not None:
            return fast_result

        # --- Slow path: progressive streaming (tier 3) ---
        return self._progressive_frame_retrieval(
            db_file, filename, token, frame_numbers,
        )

    @timing_decorator
    def resolve_frame_ranges(
        self,
        study_instance_uid: str,
        series_instance_uid: str,
        sop_instance_uid: str,
    ) -> dict:
        """Resolve the BOT for an instance and return frame byte-range metadata.

        Unlike :meth:`retrieve_instance_frames` this does **not** read any
        pixel data -- it only returns the information needed to perform
        direct Volumes byte-range reads.

        Returns:
            dict with ``file_path``, ``transfer_syntax_uid``, ``num_frames``,
            and ``frames`` (list of dicts with ``frame_number``,
            ``start_pos``, ``end_pos``, ``frame_size``, and optional
            ``fragments``).
        """
        path = self._resolve_instance_path(
            study_instance_uid, series_instance_uid, sop_instance_uid,
        )
        db_file = DatabricksFile.from_full_path(path)
        filename = db_file.full_path
        token = self._token

        # ── Tier 1: in-memory BOT cache ───────────────────────────────
        cached_bot = bot_cache.get(filename, self._table)
        if cached_bot:
            return self._format_frame_ranges(path, cached_bot)

        # ── Tier 2: Lakebase persistent cache ─────────────────────────
        if self._lb:
            try:
                lb_frames = self._lb.retrieve_all_frame_ranges(
                    filename, self._table, user_groups=self._user_groups,
                )
                if lb_frames:
                    tsuid = lb_frames[0].get("transfer_syntax_uid") if lb_frames else None
                    if not tsuid:
                        try:
                            meta = get_file_metadata(token, db_file)
                            tsuid = meta.get("00020010", {}).get(
                                "Value", ["1.2.840.10008.1.2.1"],
                            )[0]
                        except Exception:
                            tsuid = "1.2.840.10008.1.2.1"
                    bot_cache.put_from_lakebase(
                        filename, self._table, lb_frames, tsuid,
                    )
                    _touch_lakebase(self._lb, filename, self._table)
                    return {
                        "file_path": path,
                        "transfer_syntax_uid": tsuid,
                        "num_frames": len(lb_frames),
                        "frames": lb_frames,
                    }
            except Exception as exc:
                logger.warning(f"Lakebase frame range lookup failed: {exc}")

        # ── Tier 3: compute the BOT ──────────────────────────────────
        bot_data = compute_full_bot(token, db_file)
        bot_cache.put(filename, self._table, bot_data)

        if self._lb and bot_data.get("frames"):
            try:
                self._lb.insert_frame_ranges(
                    filename, bot_data["frames"], self._table,
                    transfer_syntax_uid=bot_data.get("transfer_syntax_uid"),
                    allowed_groups=self._user_groups,
                )
            except Exception as exc:
                logger.warning(f"Lakebase frame persist failed: {exc}")

        return self._format_frame_ranges(path, bot_data)

    @staticmethod
    def _format_frame_ranges(file_path: str, bot_data: dict) -> dict:
        """Shape BOT cache data into the response format."""
        frames = []
        for f in bot_data.get("frames", []):
            entry = {
                "frame_number": f["frame_number"],
                "start_pos": f["start_pos"],
                "end_pos": f["end_pos"],
                "frame_size": f["frame_size"],
            }
            if "fragments" in f:
                entry["fragments"] = f["fragments"]
            frames.append(entry)
        return {
            "file_path": file_path,
            "transfer_syntax_uid": bot_data.get("transfer_syntax_uid", ""),
            "num_frames": bot_data.get("num_frames", len(frames)),
            "frames": frames,
        }

    def _try_cached_frames(
        self,
        db_file: DatabricksFile,
        filename: str,
        token: str,
        frame_numbers: List[int],
    ) -> tuple[Iterator[bytes], str] | None:
        """
        Attempt to serve frames from the BOT cache (tier 1 / 2).

        Returns ``None`` when the BOT is not cached and a progressive
        stream is needed.
        """
        try:
            # ── Tier 1: in-memory BOT cache (µs) ────────────────────
            cached_bot = bot_cache.get(filename, self._table)
            if cached_bot:
                logger.debug(f"BOT cache HIT ({bot_cache.stats})")
                frames_by_idx = cached_bot.get("frames_by_idx", {})
                if all((fn - 1) in frames_by_idx for fn in frame_numbers):
                    tsuid = cached_bot["transfer_syntax_uid"]
                    state = progressive_streamer.get_state(filename)
                    return (
                        self._generate_from_cache(
                            db_file, token, frame_numbers, frames_by_idx, state,
                        ),
                        tsuid,
                    )

            # ── Tier 2: Lakebase persistent cache (ms) ──────────────
            if self._lb:
                logger.debug(f"Checking Lakebase for {filename}")
                t0 = time.time()
                lb_frames = self._lb.retrieve_all_frame_ranges(
                    filename, self._table, user_groups=self._user_groups,
                )
                logger.debug(f"Lakebase lookup took {time.time() - t0:.4f}s")

                if lb_frames:
                    logger.debug(f"Lakebase HIT — {len(lb_frames)} frames")
                    lb_idx = {f["frame_number"]: f for f in lb_frames}

                    if all((fn - 1) in lb_idx for fn in frame_numbers):
                        tsuid = (
                            (cached_bot or {}).get("transfer_syntax_uid")
                            or (lb_frames[0].get("transfer_syntax_uid") if lb_frames else None)
                        )
                        if not tsuid:
                            meta = get_file_metadata(token, db_file)
                            tsuid = meta.get("00020010", {}).get(
                                "Value", ["1.2.840.10008.1.2.1"],
                            )[0]

                        bot_cache.put_from_lakebase(
                            filename, self._table, lb_frames, tsuid,
                        )
                        _touch_lakebase(self._lb, filename, self._table)
                        logger.debug("Promoted Lakebase → memory cache")
                        state = progressive_streamer.get_state(filename)
                        return (
                            self._generate_from_cache(
                                db_file, token, frame_numbers, lb_idx, state,
                            ),
                            tsuid,
                        )
        except HTTPException:
            raise
        except Exception as exc:
            logger.warning(
                f"Cached frame lookup failed ({exc}), "
                f"falling back to progressive streaming"
            )

        return None

    def _generate_from_cache(
        self,
        db_file: DatabricksFile,
        token: str,
        frame_numbers: List[int],
        frames_by_idx: dict,
        state=None,
    ) -> Iterator[bytes]:
        """Yield frames from cached BOT, preferring local file reads."""
        for fn in frame_numbers:
            frame_idx = fn - 1
            meta = frames_by_idx[frame_idx]
            t0 = time.time()

            # Prefer local disk cache → remote byte-range
            if state is not None and state.is_complete and not state.has_error:
                try:
                    content = get_file_part_local(
                        state.local_path, state.data_start, meta,
                    )
                    logger.debug(
                        f"local read frame {fn}: "
                        f"{time.time() - t0:.4f}s, {len(content)} bytes"
                    )
                except Exception:
                    content = get_file_part(token, db_file, meta)
                    logger.debug(
                        f"get_file_part frame {fn}: "
                        f"{time.time() - t0:.4f}s, {len(content)} bytes"
                    )
            else:
                content = get_file_part(token, db_file, meta)
                logger.debug(
                    f"get_file_part frame {fn}: "
                    f"{time.time() - t0:.4f}s, {len(content)} bytes"
                )

            content = DICOMwebDatabricksWrapper._strip_item_header(content, fn)
            yield content

    def _progressive_frame_retrieval(
        self,
        db_file: DatabricksFile,
        filename: str,
        token: str,
        frame_numbers: List[int],
    ) -> tuple[Iterator[bytes], str]:
        """
        Serve frames via progressive streaming (tier 3 — cache miss).

        Fetches the DICOM header, checks for Extended Offset Table, and
        falls back to the progressive streamer for compressed files
        without EOT.
        """
        from io import BytesIO
        import pydicom

        logger.debug(f"Progressive frame retrieval for {filename}")

        # ── Download header ──────────────────────────────────────────
        raw = _fetch_bytes_range(token, db_file, 0, _HEADER_INITIAL_BYTES)
        pixel_data_pos = _find_pixel_data_pos(raw)
        if pixel_data_pos == -1 and len(raw) >= _HEADER_INITIAL_BYTES:
            raw = _fetch_bytes_range(token, db_file, 0, _HEADER_EXTENDED_BYTES)
            pixel_data_pos = _find_pixel_data_pos(raw)

        ds = pydicom.dcmread(BytesIO(raw), stop_before_pixels=True)
        transfer_syntax_uid = str(ds.file_meta.TransferSyntaxUID)
        is_compressed = ds.file_meta.TransferSyntaxUID.is_compressed
        number_of_frames = int(ds.get("NumberOfFrames", 1))

        if not is_compressed:
            # Uncompressed: analytical BOT (existing fast path)
            return self._uncompressed_frames(
                db_file, token, ds, pixel_data_pos,
                number_of_frames, transfer_syntax_uid, frame_numbers, filename,
                raw,
            )

        # ── Compressed: try Extended Offset Table first ──────────────
        eot_frames = _extract_from_extended_offset_table(
            ds, raw, pixel_data_pos, number_of_frames,
        )
        if eot_frames is not None:
            logger.debug(
                f"BOT from Extended Offset Table: {len(eot_frames)} frames "
                f"(zero additional I/O)"
            )
            bot_data = {
                "transfer_syntax_uid": transfer_syntax_uid,
                "frames": eot_frames,
                "pixel_data_pos": pixel_data_pos,
                "num_frames": number_of_frames,
                "captured_frame_data": {},
            }
            bot_cache.put(filename, self._table, bot_data)
            self._persist_bot_to_lakebase(
                filename, eot_frames, transfer_syntax_uid,
            )

            frames_by_idx = {f["frame_number"]: f for f in eot_frames}
            return (
                self._generate_from_cache(
                    db_file, token, frame_numbers, frames_by_idx,
                ),
                transfer_syntax_uid,
            )

        # ── Compressed: progressive streaming ─────────────────────────
        state = progressive_streamer.get_or_start_stream(
            filename, token, db_file, pixel_data_pos,
            number_of_frames, raw, transfer_syntax_uid,
        )

        # Register inline capture for requested frames
        capture_slots: dict[int, Any] = {}
        for fn in frame_numbers:
            frame_idx = fn - 1
            slot = state.register_capture(frame_idx)
            if slot is not None:
                capture_slots[frame_idx] = slot

        def generate() -> Iterator[bytes]:
            for fn in frame_numbers:
                frame_idx = fn - 1
                t0 = time.time()

                # Wait for this frame's offset to be discovered
                frame_meta = state.wait_for_frame(frame_idx, timeout=120.0)
                if frame_meta is None:
                    raise HTTPException(
                        status_code=404,
                        detail=(
                            f"Frame {fn} not found in stream "
                            f"({state.num_frames_found} frames discovered, "
                            f"pixel_data_pos={pixel_data_pos})"
                        ),
                    )

                # Try inline capture first (zero extra I/O)
                slot = capture_slots.get(frame_idx)
                if slot is not None:
                    slot.ready.wait(timeout=120.0)
                    if slot.data is not None:
                        logger.debug(
                            f"frame {fn} from inline capture: "
                            f"{time.time() - t0:.4f}s, "
                            f"{len(slot.data)} bytes"
                        )
                        yield slot.data
                        continue

                # Try local cache file
                if os.path.exists(state.local_path):
                    try:
                        content = get_file_part_local(
                            state.local_path, state.data_start, frame_meta,
                        )
                        logger.debug(
                            f"local read frame {fn}: "
                            f"{time.time() - t0:.4f}s, "
                            f"{len(content)} bytes"
                        )
                        content = DICOMwebDatabricksWrapper._strip_item_header(
                            content, fn,
                        )
                        yield content
                        continue
                    except Exception as exc:
                        logger.warning(
                            f"Local cache read failed for frame {fn}: {exc}"
                        )

                # Fallback: remote byte-range read
                content = get_file_part(token, db_file, frame_meta)
                logger.debug(
                    f"get_file_part frame {fn}: "
                    f"{time.time() - t0:.4f}s, "
                    f"{len(content)} bytes"
                )
                content = DICOMwebDatabricksWrapper._strip_item_header(
                    content, fn,
                )
                yield content

            # After all frames served, cache the full BOT if stream is done
            if state.is_complete and not state.has_error:
                self._cache_progressive_bot(
                    filename, state, transfer_syntax_uid,
                    pixel_data_pos, number_of_frames,
                )

        return generate(), transfer_syntax_uid

    def _uncompressed_frames(
        self,
        db_file: DatabricksFile,
        token: str,
        ds,
        pixel_data_pos: int,
        number_of_frames: int,
        transfer_syntax_uid: str,
        frame_numbers: List[int],
        filename: str,
        raw: bytes = b"",
    ) -> tuple[Iterator[bytes], str]:
        """Analytical BOT for uncompressed files — zero extra I/O."""
        item_length = _uncompressed_frame_length(ds)
        header_size = _pixel_data_header_size(raw, pixel_data_pos) if raw else 12
        frames: list[dict] = []
        for idx in range(number_of_frames):
            offset = (idx * item_length) + header_size
            frames.append({
                "frame_number": idx,
                "frame_size": item_length,
                "start_pos": pixel_data_pos + offset,
                "end_pos": pixel_data_pos + offset + item_length - 1,
                "pixel_data_pos": pixel_data_pos,
            })

        bot_data = {
            "transfer_syntax_uid": transfer_syntax_uid,
            "frames": frames,
            "pixel_data_pos": pixel_data_pos,
            "num_frames": number_of_frames,
            "captured_frame_data": {},
        }
        bot_cache.put(filename, self._table, bot_data)
        self._persist_bot_to_lakebase(filename, frames, transfer_syntax_uid)

        frames_by_idx = {f["frame_number"]: f for f in frames}
        return (
            self._generate_from_cache(
                db_file, token, frame_numbers, frames_by_idx,
            ),
            transfer_syntax_uid,
        )

    def _cache_progressive_bot(
        self,
        filename: str,
        state,
        transfer_syntax_uid: str,
        pixel_data_pos: int,
        number_of_frames: int,
    ) -> None:
        """Promote a completed progressive stream's BOT to the cache tiers."""
        try:
            frames = [
                state.frames[i] for i in sorted(state.frames.keys())
            ]
            bot_data = {
                "transfer_syntax_uid": transfer_syntax_uid,
                "frames": frames,
                "pixel_data_pos": pixel_data_pos,
                "num_frames": number_of_frames,
                "captured_frame_data": {},
            }
            bot_cache.put(filename, self._table, bot_data)
            self._persist_bot_to_lakebase(
                filename, frames, transfer_syntax_uid,
            )
            logger.debug(
                f"Promoted progressive BOT to cache: "
                f"{len(frames)} frames for {filename}"
            )
        except Exception as exc:
            logger.warning(f"Failed to cache progressive BOT: {exc}")

    def _persist_bot_to_lakebase(
        self,
        filename: str,
        frames: list[dict],
        transfer_syntax_uid: str | None = None,
    ) -> None:
        """Persist frame ranges to Lakebase (tier 2)."""
        if self._lb:
            try:
                t0 = time.time()
                self._lb.insert_frame_ranges(
                    filename, frames, self._table,
                    transfer_syntax_uid=transfer_syntax_uid,
                    allowed_groups=self._user_groups,
                )
                logger.debug(f"Lakebase persist took {time.time() - t0:.4f}s")
            except Exception as exc:
                logger.warning(f"Lakebase persist failed (non-fatal): {exc}")

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
        logger.debug(
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
                        logger.debug(
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

                logger.debug(
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
                        logger.debug(
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
            logger.debug(
                f"Series pre-warm: cached {len(cache_entries)} instance paths "
                f"in memory"
            )

            # ── Schedule file prefetch ──────────────────────────────────
            paths = [info["path"] for info in cache_entries.values()]
            n_pf = file_prefetcher.schedule(self._token, paths)
            logger.debug(
                f"Series pre-warm: {n_pf} prefetch tasks scheduled "
                f"({len(cache_entries)} instances total)"
            )

            # ── Preload BOTs into in-memory cache ─────────────────────
            self._preload_series_bots(cache_entries)

        except Exception as exc:
            logger.warning(f"Series pre-warm failed (non-fatal): {exc}")

    # ------------------------------------------------------------------
    # Series-level BOT preloading
    # ------------------------------------------------------------------

    def _preload_series_bots(
        self,
        cache_entries: dict[str, dict],
    ) -> None:
        """
        Preload the in-memory BOT cache for all instances in a series.

        Called from ``_prime_series_task`` and ``search_for_instances`` as a
        background task.  For each instance:

        1. Skip if already in tier-1 (in-memory BOT cache).
        2. Batch-load from Lakebase (tier 2) with a single query.
        3. Compute BOTs concurrently (tier 3) for still-missing files.

        After this method completes, every WADO-RS frame request for the
        series hits the fast path (µs cache lookup + byte-range read).
        """
        import concurrent.futures

        token = self._token
        uc_table = self._table

        needs_bot: dict[str, str] = {}
        for info in cache_entries.values():
            local_path = info["path"]
            db_file = DatabricksFile.from_full_path(local_path)
            filename = db_file.full_path
            if filename not in needs_bot and bot_cache.get(filename, uc_table) is None:
                needs_bot[filename] = local_path

        if not needs_bot:
            logger.debug("BOT preload: all instances already cached")
            return

        logger.info(f"BOT preload: {len(needs_bot)} instances need BOT loading")

        # ── Tier 2: batch load from Lakebase ──────────────────────────
        loaded_from_lb: set[str] = set()
        if self._lb:
            try:
                t0 = time.time()
                lb_batch = self._lb.retrieve_frame_ranges_batch(
                    list(needs_bot.keys()), uc_table,
                    user_groups=self._user_groups,
                )
                elapsed = time.time() - t0
                logger.debug(
                    f"BOT preload: Lakebase batch returned data for "
                    f"{len(lb_batch)}/{len(needs_bot)} files in {elapsed:.4f}s"
                )

                for filename, frames in lb_batch.items():
                    tsuid = frames[0].get("transfer_syntax_uid") if frames else None
                    if not tsuid:
                        db_file = DatabricksFile.from_full_path(filename)
                        try:
                            meta = get_file_metadata(token, db_file)
                            tsuid = meta.get("00020010", {}).get(
                                "Value", ["1.2.840.10008.1.2.1"],
                            )[0]
                        except Exception:
                            tsuid = "1.2.840.10008.1.2.1"
                    bot_cache.put_from_lakebase(filename, uc_table, frames, tsuid)
                    loaded_from_lb.add(filename)

                if loaded_from_lb:
                    _touch_lakebase_batch(self._lb, list(loaded_from_lb), uc_table)
            except Exception as exc:
                logger.warning(f"BOT preload: Lakebase batch failed ({exc})")

        # ── Tier 3: compute BOTs for remaining files ──────────────────
        remaining = {
            fn: path for fn, path in needs_bot.items()
            if fn not in loaded_from_lb
        }
        if not remaining:
            logger.info(
                f"BOT preload complete: {len(loaded_from_lb)} loaded from Lakebase"
            )
            return

        logger.debug(f"BOT preload: computing BOTs for {len(remaining)} files")
        max_workers = min(8, len(remaining))

        def _compute_single(filename: str, local_path: str):
            try:
                if bot_cache.get(filename, uc_table) is not None:
                    return
                db_file = DatabricksFile.from_full_path(local_path)
                t0 = time.time()
                bot_data = compute_full_bot(token, db_file)
                elapsed = time.time() - t0

                bot_cache.put(filename, uc_table, bot_data)

                frames = bot_data.get("frames", [])
                if self._lb and frames:
                    try:
                        self._lb.insert_frame_ranges(
                            filename, frames, uc_table,
                            transfer_syntax_uid=bot_data.get("transfer_syntax_uid"),
                            allowed_groups=self._user_groups,
                        )
                    except Exception as exc:
                        logger.warning(
                            f"BOT preload: Lakebase persist failed for {filename}: {exc}"
                        )

                logger.debug(
                    f"BOT preload: {len(frames)} frames for "
                    f"{filename} in {elapsed:.3f}s"
                )
            except Exception as exc:
                logger.warning(
                    f"BOT preload: computation failed for {filename}: {exc}"
                )

        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as pool:
            futures = [
                pool.submit(_compute_single, fn, path)
                for fn, path in remaining.items()
            ]
            concurrent.futures.wait(futures)

        logger.info(
            f"BOT preload complete: {len(loaded_from_lb)} from Lakebase, "
            f"{len(remaining)} computed"
        )

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
                logger.debug(f"Lakebase path lookup took {time.time() - t0:.4f}s")
                if lb_info:
                    logger.debug(f"Instance path Lakebase HIT for {sop_instance_uid}")
                    instance_path_cache.put(
                        sop_instance_uid, self._table,
                        {"path": lb_info["path"], "num_frames": lb_info["num_frames"]},
                        user_groups=self._user_groups,
                    )
                    return lb_info["path"]
            except Exception as exc:
                logger.warning(f"Lakebase path lookup failed (non-fatal): {exc}")

        # ── Tier 3: SQL warehouse (~300 ms) ───────────────────────────
        logger.debug(f"Instance path cache MISS — querying SQL for {sop_instance_uid}")
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
    ) -> tuple[DatabricksFile, dict, str, dict[int, bytes]]:
        """
        Resolve frame byte-offsets from the 3-tier PACS cache.

        1. In-memory BOT cache  (µs)
        2. Lakebase persistent   (ms)
        3. Full BOT computation  (s) — only on first access

        When the BOT is computed via the streaming scan (tier 3), the
        requested frames are captured inline so they can be served
        without a separate byte-range read.

        Returns:
            ``(db_file, frames_by_idx, transfer_syntax_uid, captured_data)``
            where *captured_data* maps 0-indexed frame numbers to raw
            pixel bytes (empty dict when frames were not captured).

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
        no_captured: dict[int, bytes] = {}

        try:
            # --- TIER 1: in-memory BOT cache (µs) ---
            cached_bot = bot_cache.get(filename, self._table)
            if cached_bot:
                logger.debug(f"BOT cache HIT ({bot_cache.stats})")
                frames_by_idx = cached_bot.get("frames_by_idx", {})
                if all((fn - 1) in frames_by_idx for fn in frame_numbers):
                    return db_file, frames_by_idx, cached_bot["transfer_syntax_uid"], no_captured

            # --- TIER 2: Lakebase persistent cache (ms) ---
            if self._lb:
                logger.debug(f"Checking Lakebase for {filename}")
                t0 = time.time()
                lb_frames = self._lb.retrieve_all_frame_ranges(
                    filename, self._table, user_groups=self._user_groups,
                )
                logger.debug(f"Lakebase lookup took {time.time() - t0:.4f}s")

                if lb_frames:
                    logger.debug(f"Lakebase HIT — {len(lb_frames)} frames")
                    lb_idx = {f["frame_number"]: f for f in lb_frames}

                    if all((fn - 1) in lb_idx for fn in frame_numbers):
                        tsuid = (
                            (cached_bot or {}).get("transfer_syntax_uid")
                            or (lb_frames[0].get("transfer_syntax_uid") if lb_frames else None)
                        )
                        if not tsuid:
                            meta = get_file_metadata(token, db_file)
                            tsuid = meta.get("00020010", {}).get("Value", ["1.2.840.10008.1.2.1"])[0]

                        bot_cache.put_from_lakebase(filename, self._table, lb_frames, tsuid)
                        logger.debug("Promoted Lakebase → memory cache")
                        return db_file, lb_idx, tsuid, no_captured

            # --- TIER 3: compute full BOT (one-time cost per file) ---
            # Pass the requested frame indices so the streaming scanner
            # can capture them inline (avoids a second byte-range read).
            capture_set = {fn - 1 for fn in frame_numbers}
            logger.debug(f"Cache MISS — computing full BOT for {filename}")
            t0 = time.time()
            bot_data = compute_full_bot(
                token, db_file, capture_frames=capture_set,
            )
            logger.debug(
                f"compute_full_bot took {time.time() - t0:.4f}s — "
                f"{len(bot_data['frames'])} frames, tsuid={bot_data['transfer_syntax_uid']}"
            )

            bot_cache.put(filename, self._table, bot_data)

            if self._lb:
                try:
                    t0 = time.time()
                    self._lb.insert_frame_ranges(
                        filename, bot_data["frames"], self._table,
                        transfer_syntax_uid=bot_data.get("transfer_syntax_uid"),
                        allowed_groups=self._user_groups,
                    )
                    logger.debug(f"Lakebase persist took {time.time() - t0:.4f}s")
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

            captured = bot_data.get("captured_frame_data", {})
            return db_file, frames_by_idx, bot_data["transfer_syntax_uid"], captured

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
