"""
PACS-style BOT (Basic Offset Table) and instance path caching.

PACS systems are fast because they pre-index frame byte offsets at ingest time.
When a frame is requested, they look up the offset and do a single byte-range
read — no file parsing needed.

We replicate this with a 3-tier cache hierarchy:
  1. In-memory BOT cache (microseconds) — fastest, lost on restart
  2. Lakebase persistent cache (milliseconds) — survives restarts
  3. File BOT computation (seconds) — only on first access, then cached

After first access, every frame request = cache lookup + single HTTP range read.
"""

import threading
from collections import OrderedDict
from typing import Optional

from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("DICOMweb.Cache")


class BOTCache:
    """
    Thread-safe LRU cache for DICOM frame offset tables (BOT).

    Stores pre-computed byte offsets for every frame in a DICOM file,
    enabling instant random access via byte-range HTTP requests.

    Each cache entry contains:
    - transfer_syntax_uid: Transfer Syntax UID for correct MIME type
    - frames: list of frame metadata dicts
    - frames_by_idx: dict mapping frame_number → frame metadata (O(1) lookup)
    - pixel_data_pos: byte offset of pixel data element
    - num_frames: total number of frames
    """

    def __init__(self, max_entries: int = 10000):
        self._cache: OrderedDict = OrderedDict()
        self._lock = threading.Lock()
        self._max_entries = max_entries
        self._hits = 0
        self._misses = 0

    def get(self, filename: str) -> Optional[dict]:
        """Get cached BOT data for a file. Returns None if not cached."""
        with self._lock:
            if filename in self._cache:
                self._cache.move_to_end(filename)
                self._hits += 1
                return self._cache[filename]
            self._misses += 1
            return None

    def get_frame(self, filename: str, frame_idx: int) -> Optional[dict]:
        """Get cached frame metadata for a specific frame. Returns None if not cached."""
        bot = self.get(filename)
        if bot is None:
            return None
        return bot.get("frames_by_idx", {}).get(frame_idx)

    def put(self, filename: str, bot_data: dict):
        """
        Cache BOT data for a file. Creates an indexed lookup for O(1) frame access.

        Args:
            filename: Full file path (used as cache key)
            bot_data: Dict with frames, transfer_syntax_uid, etc.
        """
        with self._lock:
            frames_by_idx = {
                frame["frame_number"]: frame
                for frame in bot_data.get("frames", [])
            }
            bot_data["frames_by_idx"] = frames_by_idx

            self._cache[filename] = bot_data
            self._cache.move_to_end(filename)

            while len(self._cache) > self._max_entries:
                self._cache.popitem(last=False)

    def put_from_lakebase(self, filename: str, frames: list, transfer_syntax_uid: str):
        """
        Populate BOT cache from Lakebase query results.

        Args:
            filename: Full file path
            frames: List of frame dicts from lakebase retrieve_all_frame_ranges()
            transfer_syntax_uid: Transfer Syntax UID
        """
        bot_data = {
            "transfer_syntax_uid": transfer_syntax_uid,
            "frames": frames,
            "pixel_data_pos": frames[0]["pixel_data_pos"] if frames else 0,
            "num_frames": len(frames),
        }
        self.put(filename, bot_data)

    @property
    def stats(self) -> dict:
        """Cache hit/miss statistics."""
        total = self._hits + self._misses
        return {
            "entries": len(self._cache),
            "hits": self._hits,
            "misses": self._misses,
            "hit_rate": f"{self._hits / total * 100:.1f}%" if total > 0 else "N/A",
        }

    def __len__(self):
        return len(self._cache)

    def clear(self):
        with self._lock:
            self._cache.clear()
            self._hits = 0
            self._misses = 0


class InstancePathCache:
    """
    Thread-safe LRU cache for SOP Instance UID → file path + metadata mapping.

    Eliminates the SQL query to Databricks warehouse for repeated frame requests
    to the same instance. SOP Instance UIDs are globally unique, so this is safe.

    Each cache entry contains:
    - path: local_path of the DICOM file
    - num_frames: number of frames in the file
    """

    def __init__(self, max_entries: int = 50000):
        self._cache: OrderedDict = OrderedDict()
        self._lock = threading.Lock()
        self._max_entries = max_entries
        self._hits = 0
        self._misses = 0

    def get(self, sop_instance_uid: str) -> Optional[dict]:
        """Get cached path info for a SOP Instance UID."""
        with self._lock:
            if sop_instance_uid in self._cache:
                self._cache.move_to_end(sop_instance_uid)
                self._hits += 1
                return self._cache[sop_instance_uid]
            self._misses += 1
            return None

    def put(self, sop_instance_uid: str, path_info: dict):
        """Cache path info for a SOP Instance UID."""
        with self._lock:
            self._cache[sop_instance_uid] = path_info
            self._cache.move_to_end(sop_instance_uid)
            while len(self._cache) > self._max_entries:
                self._cache.popitem(last=False)

    def batch_put(self, entries: dict[str, dict]):
        """
        Cache multiple SOP Instance UID → path_info mappings at once.

        Used to **pre-warm** the cache after a QIDO-RS instance query so
        that subsequent WADO-RS calls skip the SQL lookup entirely.
        """
        with self._lock:
            for uid, info in entries.items():
                self._cache[uid] = info
                self._cache.move_to_end(uid)
            while len(self._cache) > self._max_entries:
                self._cache.popitem(last=False)

    @property
    def stats(self) -> dict:
        """Cache statistics."""
        with self._lock:
            total = self._hits + self._misses
            return {
                "entries": len(self._cache),
                "max_entries": self._max_entries,
                "hits": self._hits,
                "misses": self._misses,
                "hit_rate": f"{self._hits / total * 100:.1f}%" if total > 0 else "N/A",
            }

    def __len__(self):
        return len(self._cache)


# ---------------------------------------------------------------------------
# Module-level singletons (shared across all requests within the process)
# ---------------------------------------------------------------------------
bot_cache = BOTCache(max_entries=10000)
instance_path_cache = InstancePathCache(max_entries=50000)

