"""
DICOM BOT Cache Builder — Spark ML Transformer.

Reads the pixels table (UC Delta table of DICOM file paths), computes the
Basic Offset Table (BOT) for each file, and persists the frame byte offsets
to Lakebase so the DICOMweb server never has to compute them on-demand.

The ``dicom_frames`` table carries three new cache-metadata columns that let
the server make intelligent preload decisions at startup:

  * ``inserted_at``   — when the BOT row was first written
  * ``last_used_at``  — when the BOT was last served from Lakebase
  * ``access_count``  — how many times the BOT has been served

``CachePriorityScorer`` uses these columns to rank files for in-memory
preload, so the server front-loads the hottest entries within the available
RAM budget on each restart.

Typical usage
-------------
1. Run ``BOTCacheBuilder`` as a Spark batch job after every DICOM ingest::

    from dbx.pixels.dicom.cache import BOTCacheBuilder

    (
        BOTCacheBuilder(
            uc_table_name="catalog.schema.object_catalog",
            lakebase_instance_name="pixels-lakebase",
        )
        .transform(spark.read.table("catalog.schema.object_catalog"))
        .write.mode("append")
        .saveAsTable("catalog.schema.object_catalog_bot_cache_log")
    )

2. On server startup, call ``CachePriorityScorer.get_preload_list()`` to get
   the ordered list of files to warm into the in-memory BOT cache.
"""

import math
import struct
from datetime import datetime, timezone
from io import BytesIO
from typing import Optional

import pandas as pd
from pyspark.ml.pipeline import Transformer
from pyspark.sql.functions import col, pandas_udf
from pyspark.sql.types import StringType

from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("BOTCacheBuilder")


# ---------------------------------------------------------------------------
# DICOM byte-range constants (mirrors dicom_io.py — self-contained, no import)
# ---------------------------------------------------------------------------
_PIXEL_DATA_MARKER = b"\xe0\x7f\x10\x00"   # (7FE0,0010) little-endian
_ITEM_TAG = b"\xfe\xff\x00\xe0"            # (FFFE,E000)
_SEQ_DELIM_TAG = b"\xfe\xff\xdd\xe0"       # (FFFE,E0DD)
_HEADER_INITIAL_BYTES = 64 * 1024           # 64 KB — enough for most headers
_HEADER_EXTENDED_BYTES = 2 * 1024 * 1024   # 2 MB — for large private headers


# ---------------------------------------------------------------------------
# Pure BOT helpers — local-file variants, no HTTP / streaming dependencies
# ---------------------------------------------------------------------------

def _find_pixel_data_pos(raw: bytes) -> int:
    """
    Locate the top-level ``(7FE0,0010)`` Pixel Data tag in *raw*.

    When multiple occurrences exist (e.g. one nested inside an Icon Image
    Sequence), pydicom is used to find the dataset-level one.
    Returns -1 when not found.
    """
    import pydicom

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

    # Multiple occurrences — resolve via pydicom to get the top-level one.
    try:
        ds = pydicom.dcmread(BytesIO(raw), stop_before_pixels=True, force=True)
        tag_offset = ds.get_item((0x7FE0, 0x0010))
        if tag_offset is not None:
            # Return the position closest to what pydicom reports as the
            # PixelData element; fall through to last-occurrence heuristic.
            pass
    except Exception:
        pass

    # Conservative fallback: the last occurrence is the top-level pixel data.
    return positions[-1]


def _pixel_data_header_size(raw: bytes, pixel_data_pos: int) -> int:
    """
    Return the byte length of the Pixel Data element header (8 or 12 bytes).

    Explicit VR with a 4-byte length field (OB, OW, OF, OD, UN, …): 12 bytes.
    Implicit VR or explicit VR with 2-byte length: 8 bytes.
    """
    if pixel_data_pos + 8 > len(raw):
        return 12  # safe default
    vr = raw[pixel_data_pos + 4: pixel_data_pos + 6]
    if vr in (b"OB", b"OW", b"OF", b"OD", b"UN", b"UT", b"SQ", b"UC", b"UR"):
        return 12
    return 8


def _uncompressed_frame_length(ds) -> int:
    """Return the byte size of a single uncompressed DICOM frame."""
    samples = int(getattr(ds, "SamplesPerPixel", 1))
    return int(ds.Rows) * int(ds.Columns) * (int(ds.BitsAllocated) // 8) * samples


def _extract_from_extended_offset_table(
    ds, raw: bytes, pixel_data_pos: int, number_of_frames: int
) -> Optional[list]:
    """
    Build frame ranges from the Extended Offset Table ``(7FE0,0001/0002)``
    when present.  Returns ``None`` when the tags are absent or malformed.
    """
    eot_bytes = getattr(ds, "ExtendedOffsetTable", None)
    eot_len_bytes = getattr(ds, "ExtendedOffsetTableLengths", None)
    if eot_bytes is None or eot_len_bytes is None:
        return None

    expected = number_of_frames * 8
    if len(eot_bytes) != expected or len(eot_len_bytes) != expected:
        return None

    # Locate the BOT Item right after the Pixel Data tag to find data_start.
    search_area = raw[pixel_data_pos + 4: min(pixel_data_pos + 128, len(raw))]
    rel_pos = search_area.find(_ITEM_TAG)
    if rel_pos == -1:
        return None

    item_pos = pixel_data_pos + 4 + rel_pos
    if item_pos + 8 > len(raw):
        return None

    bot_length = struct.unpack("<I", raw[item_pos + 4: item_pos + 8])[0]
    data_start = item_pos + 8 + bot_length

    offsets = struct.unpack(f"<{number_of_frames}Q", bytes(eot_bytes))
    lengths = struct.unpack(f"<{number_of_frames}Q", bytes(eot_len_bytes))

    return [
        {
            "frame_number": idx,
            "start_pos": data_start + offsets[idx] + 8,
            "end_pos": data_start + offsets[idx] + 8 + lengths[idx] - 1,
            "pixel_data_pos": pixel_data_pos,
        }
        for idx in range(number_of_frames)
    ]


def _scan_compressed_frames_local(
    path: str, pixel_data_pos: int, number_of_frames: int
) -> list:
    """
    Scan a local compressed DICOM file for frame byte offsets.

    Starts at *pixel_data_pos*, skips the BOT item (which may be empty),
    then iterates over each frame's ``(FFFE,E000)`` Item tag recording the
    start and end byte positions of the pixel data payload.

    This is an O(num_frames) scan — only the 8-byte Item headers are read,
    not the frame pixel data itself.
    """
    frames: list[dict] = []
    with open(path, "rb") as f:
        f.seek(pixel_data_pos)
        chunk = f.read(128)

        bot_pos = chunk.find(_ITEM_TAG)
        if bot_pos == -1:
            return frames

        f.seek(pixel_data_pos + bot_pos + 4)
        bot_length_bytes = f.read(4)
        if len(bot_length_bytes) < 4:
            return frames
        bot_length = struct.unpack("<I", bot_length_bytes)[0]
        f.seek(bot_length, 1)  # skip BOT payload

        for frame_idx in range(number_of_frames):
            tag = f.read(4)
            if len(tag) < 4:
                break
            if tag == _SEQ_DELIM_TAG:
                f.read(4)  # consume the 4-byte zero length
                break
            if tag != _ITEM_TAG:
                break

            len_bytes = f.read(4)
            if len(len_bytes) < 4:
                break
            item_length = struct.unpack("<I", len_bytes)[0]
            if item_length == 0xFFFFFFFF:
                # Undefined item length — cannot determine frame boundary
                break

            frame_start = f.tell()
            frames.append({
                "frame_number": frame_idx,
                "start_pos": frame_start,
                "end_pos": frame_start + item_length - 1,
                "pixel_data_pos": pixel_data_pos,
            })
            f.seek(item_length, 1)

    return frames


# ---------------------------------------------------------------------------
# Public BOT computation entry point
# ---------------------------------------------------------------------------

def compute_bot_from_local_path(path: str) -> dict:
    """
    Compute the complete frame offset table for a local DICOM file.

    This mirrors ``compute_full_bot()`` in ``dicom_io.py`` but reads from
    the local filesystem instead of making HTTP byte-range requests to the
    Databricks Files API.  Designed for use inside Spark executors where
    ``/Volumes/...`` paths are accessible as regular files.

    Strategy order (fastest to slowest):

    1. **Uncompressed** — analytical computation from header only (zero
       additional I/O beyond the first 64 KB header read).
    2. **Extended Offset Table** ``(7FE0,0001/0002)`` — analytical, header
       only (zero additional I/O).
    3. **Local Item-tag scan** — reads only 8-byte Item headers, keeping
       memory at O(num_frames × ~50 B).

    Args:
        path: Local DICOM file path.  ``dbfs:`` prefix is stripped
            automatically so both ``/dbfs/...`` and ``dbfs:/...`` styles
            work.

    Returns:
        ``dict`` with keys:

        * ``transfer_syntax_uid`` — DICOM Transfer Syntax UID string.
        * ``frames`` — list of frame dicts, each with ``frame_number``,
          ``start_pos``, ``end_pos``, and ``pixel_data_pos`` (all ints).
        * ``num_frames`` — total number of frames.

    Raises:
        ValueError: Pixel Data tag not found, or no frames decoded.
        OSError: File not readable.
    """
    import pydicom

    clean_path = path.replace("dbfs:", "")

    with open(clean_path, "rb") as f:
        raw = f.read(_HEADER_INITIAL_BYTES)

    pixel_data_pos = _find_pixel_data_pos(raw)
    if pixel_data_pos == -1 and len(raw) >= _HEADER_INITIAL_BYTES:
        with open(clean_path, "rb") as f:
            raw = f.read(_HEADER_EXTENDED_BYTES)
        pixel_data_pos = _find_pixel_data_pos(raw)

    if pixel_data_pos == -1:
        raise ValueError(f"Cannot find Pixel Data (7FE0,0010) in: {path}")

    ds = pydicom.dcmread(BytesIO(raw), stop_before_pixels=True)
    transfer_syntax_uid = str(ds.file_meta.TransferSyntaxUID)
    is_compressed = ds.file_meta.TransferSyntaxUID.is_compressed
    number_of_frames = int(ds.get("NumberOfFrames", 1))

    if not is_compressed:
        item_length = _uncompressed_frame_length(ds)
        header_size = _pixel_data_header_size(raw, pixel_data_pos)
        frames = [
            {
                "frame_number": idx,
                "start_pos": pixel_data_pos + header_size + idx * item_length,
                "end_pos": pixel_data_pos + header_size + (idx + 1) * item_length - 1,
                "pixel_data_pos": pixel_data_pos,
            }
            for idx in range(number_of_frames)
        ]
    else:
        frames = _extract_from_extended_offset_table(ds, raw, pixel_data_pos, number_of_frames)

        if frames is None:
            frames = _scan_compressed_frames_local(clean_path, pixel_data_pos, number_of_frames)

        if not frames:
            raise ValueError(f"No frames decoded from compressed DICOM: {path}")

    return {
        "transfer_syntax_uid": transfer_syntax_uid,
        "frames": frames,
        "num_frames": len(frames),
    }


# ---------------------------------------------------------------------------
# Executor-side Lakebase connection cache
# ---------------------------------------------------------------------------
# One LakebaseUtils instance per (instance_name, uc_table_name) pair is kept
# alive in the executor process so repeated Pandas batches don't reconnect.
_executor_lb_cache: dict = {}


def _get_executor_lb(instance_name: str, uc_table_name: str):
    """Return a cached LakebaseUtils for the given parameters, creating one if needed."""
    key = f"{instance_name}::{uc_table_name}"
    if key not in _executor_lb_cache:
        from dbx.pixels.lakebase import LakebaseUtils
        _executor_lb_cache[key] = LakebaseUtils(
            instance_name=instance_name,
            uc_table_name=uc_table_name,
            min_connections=1,
            max_connections=4,
        )
    return _executor_lb_cache[key]


# ---------------------------------------------------------------------------
# Spark ML Transformer
# ---------------------------------------------------------------------------

class BOTCacheBuilder(Transformer):
    """
    Spark ML Transformer that pre-computes and persists DICOM frame offset
    tables (BOT) to Lakebase.

    Run as a batch Spark job after each DICOM ingest.  The DICOMweb server
    will then load frame offsets from Lakebase (milliseconds) instead of
    computing them on first access (seconds), eliminating cold-start latency.

    The transformer reads the ``local_path`` column from the pixels table,
    computes the BOT for every ``.dcm`` file that is not yet cached, and
    writes the frame offsets to the ``dicom_frames`` Lakebase table.  Each
    file's result is returned in the ``bot_cache_status`` output column as a
    JSON string:

    * ``{"status": "cached",  "num_frames": N}``  — BOT computed and stored
    * ``{"status": "skipped", "reason": "already_cached", "num_frames": N}``
    * ``{"status": "skipped", "reason": "not_dcm"}``
    * ``{"status": "error",   "error": "..."}``

    Parameters
    ----------
    uc_table_name:
        Fully qualified Unity Catalog table name (``catalog.schema.table``).
        Used as the ``uc_table_name`` key stored in every Lakebase row.
    lakebase_instance_name:
        Lakebase project / endpoint name.  Defaults to ``"pixels-lakebase"``.
    inputCol:
        DataFrame column containing the local DICOM file path.
        Defaults to ``"local_path"`` (the pixels table schema field).
    outputCol:
        Output column for per-file status JSON.
        Defaults to ``"bot_cache_status"``.
    skip_existing:
        When ``True`` (default), files already present in Lakebase are
        skipped.  Set to ``False`` to recompute and overwrite all entries.
    filter_extension:
        Only process files whose path ends with this extension
        (case-insensitive).  Defaults to ``".dcm"``.  Pass ``None`` to
        process every row.
    """

    def __init__(
        self,
        uc_table_name: str,
        lakebase_instance_name: str = "pixels-lakebase",
        inputCol: str = "local_path",
        outputCol: str = "bot_cache_status",
        skip_existing: bool = True,
        filter_extension: str = ".dcm",
    ):
        self.uc_table_name = uc_table_name
        self.lakebase_instance_name = lakebase_instance_name
        self.inputCol = inputCol
        self.outputCol = outputCol
        self.skip_existing = skip_existing
        self.filter_extension = filter_extension

    def _transform(self, df):
        uc_table_name = self.uc_table_name
        lakebase_instance_name = self.lakebase_instance_name
        skip_existing = self.skip_existing
        filter_extension = self.filter_extension

        @pandas_udf(StringType())
        def _build_bot_udf(paths: pd.Series) -> pd.Series:
            import json

            lb = _get_executor_lb(lakebase_instance_name, uc_table_name)

            results = []
            for path in paths:
                if not path:
                    results.append(json.dumps({"status": "skipped", "reason": "empty_path"}))
                    continue

                if filter_extension and not str(path).lower().endswith(filter_extension.lower()):
                    results.append(json.dumps({"status": "skipped", "reason": "not_dcm"}))
                    continue

                try:
                    if skip_existing:
                        existing = lb.retrieve_all_frame_ranges(path, uc_table_name)
                        if existing:
                            results.append(json.dumps({
                                "status": "skipped",
                                "reason": "already_cached",
                                "num_frames": len(existing),
                            }))
                            continue

                    bot = compute_bot_from_local_path(path)
                    lb.insert_frame_ranges(
                        filename=path,
                        frame_ranges=bot["frames"],
                        uc_table_name=uc_table_name,
                        transfer_syntax_uid=bot["transfer_syntax_uid"],
                    )
                    results.append(json.dumps({
                        "status": "cached",
                        "num_frames": bot["num_frames"],
                    }))

                except Exception as exc:
                    results.append(json.dumps({
                        "status": "error",
                        "error": str(exc)[:500],
                    }))

            return pd.Series(results)

        # Optionally pre-filter to DICOM files before distributing work.
        input_df = df
        if filter_extension and "extension" in df.columns:
            ext = filter_extension.lstrip(".").lower()
            input_df = df.filter(col("extension") == ext)

        return input_df.withColumn(self.outputCol, _build_bot_udf(col(self.inputCol)))


# ---------------------------------------------------------------------------
# Priority scorer for in-memory BOT preload
# ---------------------------------------------------------------------------

class CachePriorityScorer:
    """
    Scores Lakebase-cached BOT entries for in-memory preload prioritisation.

    On server startup, available RAM can only hold a fraction of the full
    Lakebase BOT table.  This class queries Lakebase and returns files ordered
    by a weighted priority score so the server front-loads the *hottest*
    entries first.

    **Scoring algorithm**::

        score = w_used   × recency(last_used_at,  half_life = 24 h)
              + w_insert × recency(inserted_at,   half_life = 168 h)
              + w_count  × log10(1 + access_count)

    where::

        recency(t, h) = exp(−hours_since(t) / h)

    * ``recency`` → 1.0 when the timestamp equals *now*; decays toward 0
      with configurable half-life (24 h for last-used, 168 h = 1 week for
      inserted-at).
    * ``log10(1 + n)`` grows without bound but slowly, ensuring frequently
      accessed files are favoured without completely dominating freshly
      inserted ones.

    Default weights: last_used=0.5, inserted=0.2, access_count=0.3.

    Both a **Python** implementation (useful for unit tests and offline
    analysis) and a **SQL** implementation (used for efficient Lakebase
    queries) are provided.

    Parameters
    ----------
    lb_utils:
        An initialised :class:`~dbx.pixels.lakebase.LakebaseUtils` instance.
    weights:
        Dict with keys ``"last_used"``, ``"inserted"``, ``"access_count"``.
    half_lives:
        Dict with keys ``"last_used"`` and ``"inserted"`` (hours).
    """

    DEFAULT_WEIGHTS = {
        "last_used": 0.5,
        "inserted": 0.2,
        "access_count": 0.3,
    }
    DEFAULT_HALF_LIVES = {
        "last_used": 24,    # 1 day — strongly prefer recently accessed files
        "inserted": 168,    # 1 week — recently ingested files are mildly preferred
    }

    def __init__(self, lb_utils, weights: dict | None = None, half_lives: dict | None = None):
        self.lb = lb_utils
        self.weights = {**self.DEFAULT_WEIGHTS, **(weights or {})}
        self.half_lives = {**self.DEFAULT_HALF_LIVES, **(half_lives or {})}

    # ------------------------------------------------------------------
    # Python implementation (testing / offline analysis)
    # ------------------------------------------------------------------

    def score(
        self,
        last_used_at: Optional[datetime],
        inserted_at: Optional[datetime],
        access_count: int,
        now: Optional[datetime] = None,
    ) -> float:
        """
        Compute a priority score in the range [0, ∞) for a single file.

        Higher score → load into in-memory BOT cache first.

        Parameters
        ----------
        last_used_at:
            Timestamp of last BOT access from Lakebase.  ``None`` if never
            accessed (treated as very old, contributing 0 to the score).
        inserted_at:
            Timestamp when the BOT rows were first written.
        access_count:
            Total number of times the BOT has been served from Lakebase.
        now:
            Reference timestamp.  Defaults to ``datetime.now(tz=UTC)``.
        """
        if now is None:
            now = datetime.now(tz=timezone.utc)

        def _ensure_tz(ts: Optional[datetime]) -> Optional[datetime]:
            if ts is None:
                return None
            if ts.tzinfo is None:
                return ts.replace(tzinfo=timezone.utc)
            return ts

        def recency(ts: Optional[datetime], half_life_h: float) -> float:
            if ts is None:
                return 0.0
            hours = max(0.0, (now - _ensure_tz(ts)).total_seconds() / 3600.0)
            return math.exp(-hours / half_life_h)

        r_used = recency(last_used_at, self.half_lives["last_used"])
        r_insert = recency(inserted_at, self.half_lives["inserted"])
        r_count = math.log10(1 + max(0, access_count))

        return (
            self.weights["last_used"] * r_used
            + self.weights["inserted"] * r_insert
            + self.weights["access_count"] * r_count
        )

    # ------------------------------------------------------------------
    # Lakebase query
    # ------------------------------------------------------------------

    def get_preload_list(
        self,
        uc_table_name: str,
        limit: int = 10_000,
    ) -> list[dict]:
        """
        Return files ordered by priority score, highest first.

        A single ``GROUP BY filename`` query computes the priority score
        **and** aggregates all frame offset data inline via ``json_agg``,
        so each returned entry can be passed directly to
        ``BOTCache.put_from_lakebase`` without any further Lakebase queries.

        Parameters
        ----------
        uc_table_name:
            Fully qualified UC table name (``catalog.schema.table``).
        limit:
            Maximum number of files to return.

        Returns
        -------
        list[dict]
            Each dict contains:

            * ``filename``           — full file path
            * ``frame_count``        — number of cached frames
            * ``transfer_syntax_uid``
            * ``last_used_at``       — ``datetime`` or ``None``
            * ``inserted_at``        — ``datetime``
            * ``access_count``       — total accesses
            * ``priority_score``     — computed priority (higher = better)
            * ``frames``             — list of frame dicts ready for
              ``BOTCache.put_from_lakebase`` (``frame_number``, ``start_pos``,
              ``end_pos``, ``pixel_data_pos``)
        """
        import json as _json
        from psycopg2 import sql

        w_used = self.weights["last_used"]
        w_ins = self.weights["inserted"]
        w_cnt = self.weights["access_count"]
        hl_used = self.half_lives["last_used"] * 3600.0    # hours → seconds
        hl_ins = self.half_lives["inserted"] * 3600.0

        query = sql.SQL(
            """
            SELECT
                filename,
                COUNT(*)                        AS frame_count,
                MAX(transfer_syntax_uid)        AS transfer_syntax_uid,
                MAX(last_used_at)               AS last_used_at,
                MIN(inserted_at)                AS inserted_at,
                SUM(access_count)               AS access_count,
                (
                  {w_used}  * EXP(
                    -EXTRACT(EPOCH FROM (
                        NOW() - COALESCE(MAX(last_used_at), NOW() - INTERVAL '30 days')
                    )) / {hl_used}
                  )
                + {w_ins}   * EXP(
                    -EXTRACT(EPOCH FROM (
                        NOW() - COALESCE(MIN(inserted_at), NOW() - INTERVAL '30 days')
                    )) / {hl_ins}
                  )
                + {w_cnt}   * LOG(1 + SUM(access_count))
                )                               AS priority_score,
                json_agg(
                    json_build_object(
                        'frame_number',   frame,
                        'start_pos',      start_pos,
                        'end_pos',        end_pos,
                        'pixel_data_pos', pixel_data_pos
                    ) ORDER BY frame
                )                               AS frames
            FROM {table}
            WHERE uc_table_name = %s
            GROUP BY filename
            ORDER BY priority_score DESC
            LIMIT %s
            """
        ).format(
            table=sql.Identifier(self.lb.schema, "dicom_frames"),
            w_used=sql.Literal(w_used),
            w_ins=sql.Literal(w_ins),
            w_cnt=sql.Literal(w_cnt),
            hl_used=sql.Literal(hl_used),
            hl_ins=sql.Literal(hl_ins),
        )

        rows = self.lb.execute_and_fetch_query(query, (uc_table_name, limit))
        results = []
        for row in rows:
            raw_frames = row[7]
            if isinstance(raw_frames, str):
                raw_frames = _json.loads(raw_frames)
            results.append({
                "filename": row[0],
                "frame_count": int(row[1]),
                "transfer_syntax_uid": row[2],
                "last_used_at": row[3],
                "inserted_at": row[4],
                "access_count": int(row[5]),
                "priority_score": float(row[6]),
                "frames": raw_frames or [],
            })
        return results
