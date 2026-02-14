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

**Security (RLS-aware caching)**:

When ``LAKEBASE_RLS_ENABLED=true`` **and** ``DICOMWEB_USE_USER_AUTH=true``, cache
keys for ``InstancePathCache`` include a hash of the user's Databricks groups.
This prevents cross-user data leakage through the in-memory cache layer.

``BOTCache`` is NOT user-scoped because its entries (byte offsets) are only
reachable *after* the instance path has been resolved through the secured
``InstancePathCache`` — so access control is enforced upstream.
"""

import hashlib
import threading
from collections import OrderedDict
from typing import Optional

from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("DICOMweb.Cache")


def _groups_hash(user_groups: list[str] | None) -> str:
    """
    Compute a short, deterministic hash from a list of group names.

    Returns ``""`` when *user_groups* is ``None`` or empty, which
    preserves backward-compatible (non-scoped) cache keys.
    """
    if not user_groups:
        return ""
    canonical = ",".join(sorted(user_groups))
    return hashlib.sha256(canonical.encode()).hexdigest()[:12]


class BOTCache:
    """
    Thread-safe LRU cache for DICOM frame offset tables (BOT).

    Stores pre-computed byte offsets for every frame in a DICOM file,
    enabling instant random access via byte-range HTTP requests.

    Cache keys are scoped by ``(filename, uc_table)`` so that entries
    from different Unity Catalog tables never collide.

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

    @staticmethod
    def _key(filename: str, uc_table: str) -> str:
        """Build a composite cache key scoped to the UC table."""
        return f"{filename}\x00{uc_table}"

    def get(self, filename: str, uc_table: str) -> Optional[dict]:
        """Get cached BOT data for a file. Returns None if not cached."""
        key = self._key(filename, uc_table)
        with self._lock:
            if key in self._cache:
                self._cache.move_to_end(key)
                self._hits += 1
                return self._cache[key]
            self._misses += 1
            return None

    def get_frame(self, filename: str, uc_table: str, frame_idx: int) -> Optional[dict]:
        """Get cached frame metadata for a specific frame. Returns None if not cached."""
        bot = self.get(filename, uc_table)
        if bot is None:
            return None
        return bot.get("frames_by_idx", {}).get(frame_idx)

    def put(self, filename: str, uc_table: str, bot_data: dict):
        """
        Cache BOT data for a file. Creates an indexed lookup for O(1) frame access.

        Args:
            filename: Full file path
            uc_table: Unity Catalog table name (scopes the cache entry)
            bot_data: Dict with frames, transfer_syntax_uid, etc.
        """
        key = self._key(filename, uc_table)
        with self._lock:
            frames_by_idx = {
                frame["frame_number"]: frame
                for frame in bot_data.get("frames", [])
            }
            bot_data["frames_by_idx"] = frames_by_idx

            self._cache[key] = bot_data
            self._cache.move_to_end(key)

            while len(self._cache) > self._max_entries:
                self._cache.popitem(last=False)

    def put_from_lakebase(self, filename: str, uc_table: str, frames: list, transfer_syntax_uid: str):
        """
        Populate BOT cache from Lakebase query results.

        Args:
            filename: Full file path
            uc_table: Unity Catalog table name (scopes the cache entry)
            frames: List of frame dicts from lakebase retrieve_all_frame_ranges()
            transfer_syntax_uid: Transfer Syntax UID
        """
        bot_data = {
            "transfer_syntax_uid": transfer_syntax_uid,
            "frames": frames,
            "pixel_data_pos": frames[0]["pixel_data_pos"] if frames else 0,
            "num_frames": len(frames),
        }
        self.put(filename, uc_table, bot_data)

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
    to the same instance.

    **RLS-aware scoping**: When ``user_groups`` is passed to ``get`` / ``put``
    / ``batch_put``, the cache key includes a hash of the groups.  This means
    two users with different group memberships have **separate** cache
    entries — a user can never read another user's cached paths.

    When ``user_groups`` is ``None`` (backward compatibility / app-auth mode),
    the cache key matches the legacy format ``sop_uid\\x00uc_table``.

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

    @staticmethod
    def _key(
        sop_instance_uid: str,
        uc_table: str,
        user_groups: list[str] | None = None,
    ) -> str:
        """
        Build a composite cache key, optionally scoped to the user's groups.

        When *user_groups* is provided, a short hash is appended so that
        users with different group sets get independent cache entries.
        """
        gk = _groups_hash(user_groups)
        if gk:
            return f"{sop_instance_uid}\x00{uc_table}\x00{gk}"
        return f"{sop_instance_uid}\x00{uc_table}"

    def get(
        self,
        sop_instance_uid: str,
        uc_table: str,
        user_groups: list[str] | None = None,
    ) -> Optional[dict]:
        """Get cached path info for a SOP Instance UID."""
        key = self._key(sop_instance_uid, uc_table, user_groups)
        with self._lock:
            if key in self._cache:
                self._cache.move_to_end(key)
                self._hits += 1
                return self._cache[key]
            self._misses += 1
            return None

    def put(
        self,
        sop_instance_uid: str,
        uc_table: str,
        path_info: dict,
        user_groups: list[str] | None = None,
    ):
        """Cache path info for a SOP Instance UID."""
        key = self._key(sop_instance_uid, uc_table, user_groups)
        with self._lock:
            self._cache[key] = path_info
            self._cache.move_to_end(key)
            while len(self._cache) > self._max_entries:
                self._cache.popitem(last=False)

    def batch_put(
        self,
        uc_table: str,
        entries: dict[str, dict],
        user_groups: list[str] | None = None,
    ):
        """
        Cache multiple SOP Instance UID → path_info mappings at once.

        Used to **pre-warm** the cache after a QIDO-RS instance query so
        that subsequent WADO-RS calls skip the SQL lookup entirely.
        """
        with self._lock:
            for uid, info in entries.items():
                key = self._key(uid, uc_table, user_groups)
                self._cache[key] = info
                self._cache.move_to_end(key)
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
