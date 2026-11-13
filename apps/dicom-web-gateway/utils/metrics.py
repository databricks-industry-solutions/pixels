"""
Server metrics collector — system resources and application caches.

Provides:
- ``collect_metrics()`` — gathers a full snapshot (CPU, memory, caches,
  prefetcher, HTTP session) as a JSON-serialisable dict.
- ``start_metrics_logger()`` — launches a background async task that
  writes a one-line summary to the application log every *N* seconds
  (default 300 s = 5 min).
"""

import asyncio
import ctypes
import os
import threading
import time
from datetime import datetime, timezone

import psutil

from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("DICOMweb.Metrics")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _bytes_to_mb(b: int) -> float:
    """Convert bytes → megabytes, rounded to 2 decimals."""
    return round(b / (1024 * 1024), 2)


# ---------------------------------------------------------------------------
# Container (cgroup) limits
# ---------------------------------------------------------------------------
# psutil.virtual_memory() / cpu_count() describe the host VM, not the app
# container (e.g. 31 GB / 8 CPUs on a 12 GB / 4 vCPU Databricks App).  The
# limits that actually apply are the cgroup's.

_CGROUP_ROOT = "/sys/fs/cgroup"


def _read(path: str) -> str | None:
    try:
        with open(path) as f:
            return f.read().strip()
    except OSError:
        return None


def _stat_value(text: str | None, key: str) -> int:
    for line in (text or "").splitlines():
        name, _, value = line.partition(" ")
        if name == key:
            return int(value)
    return 0


def _cpu_limit(root: str) -> float | None:
    """CPU limit in cores from the cgroup quota (``None`` if unlimited)."""
    v2 = _read(f"{root}/cpu.max")
    if v2 is not None:
        quota, _, period = v2.partition(" ")
        return int(quota) / int(period) if quota != "max" and period else None
    quota = _read(f"{root}/cpu/cpu.cfs_quota_us")
    period = _read(f"{root}/cpu/cpu.cfs_period_us")
    if quota and period and int(quota) > 0:
        return int(quota) / int(period)
    return None


def _cpu_usage_seconds(root: str) -> float | None:
    """Cumulative CPU time used by the whole container, in seconds."""
    v2 = _read(f"{root}/cpu.stat")
    if v2 is not None:
        return _stat_value(v2, "usage_usec") / 1e6
    v1 = _read(f"{root}/cpuacct/cpuacct.usage")
    return int(v1) / 1e9 if v1 else None


def container_resources(root: str = _CGROUP_ROOT) -> dict:
    """Return the container's memory limit / working set and CPU limit.

    Working set = usage minus inactive file cache, the figure the Databricks
    Apps memory chart (and the kernel OOM killer) go by.  Values are ``None``
    when no cgroup limit applies (e.g. local runs).
    """
    limit = usage = None
    inactive_file = 0

    v2_max = _read(f"{root}/memory.max")
    if v2_max is not None:
        limit = None if v2_max == "max" else int(v2_max)
        usage = int(_read(f"{root}/memory.current") or 0)
        inactive_file = _stat_value(_read(f"{root}/memory.stat"), "inactive_file")
    else:
        v1_limit = _read(f"{root}/memory/memory.limit_in_bytes")
        if v1_limit is not None:
            limit = int(v1_limit)
            if limit >= 1 << 60:  # "unlimited" sentinel
                limit = None
            usage = int(_read(f"{root}/memory/memory.usage_in_bytes") or 0)
            inactive_file = _stat_value(
                _read(f"{root}/memory/memory.stat"), "total_inactive_file"
            )

    working_set = max(0, usage - inactive_file) if usage is not None else None
    cpu_limit = _cpu_limit(root)
    # anon = process heaps; file = page cache; shmem = tmpfs (e.g. /tmp)
    breakdown = {}
    v2_stat = _read(f"{root}/memory.stat")
    v1_stat = _read(f"{root}/memory/memory.stat")
    # active_file counts towards the working set; inactive_file does not.
    keys = (
        {"anon": "anon", "file": "file", "active_file": "active_file",
         "inactive_file": "inactive_file", "shmem": "shmem"}
        if v2_stat is not None
        else {"anon": "total_rss", "file": "total_cache", "active_file": "total_active_file",
              "inactive_file": "total_inactive_file", "shmem": "total_shmem"}
    )
    stat = v2_stat if v2_stat is not None else v1_stat
    if stat:
        for name, key in keys.items():
            breakdown[f"container_memory_{name}_mb"] = _bytes_to_mb(_stat_value(stat, key))
    return {
        **breakdown,
        "container_memory_limit_mb": _bytes_to_mb(limit) if limit else None,
        "container_memory_working_set_mb": (
            _bytes_to_mb(working_set) if working_set is not None else None
        ),
        "container_memory_used_percent": (
            round(working_set / limit * 100, 1) if limit and working_set is not None else None
        ),
        "container_cpu_limit": round(cpu_limit, 2) if cpu_limit else None,
    }


class _MallInfo2(ctypes.Structure):
    _fields_ = [
        (name, ctypes.c_size_t)
        for name in (
            "arena", "ordblks", "smblks", "hblks", "hblkhd",
            "usmblks", "fsmblks", "uordblks", "fordblks", "keepcost",
        )
    ]


try:
    _libc = ctypes.CDLL("libc.so.6")
    _libc.mallinfo2.restype = _MallInfo2
except (OSError, AttributeError):  # not glibc >= 2.33 (e.g. macOS)
    _libc = None


def malloc_stats() -> dict:
    """glibc heap totals for this process, summed over all arenas.

    ``in_use`` is memory held by live allocations; ``free_held`` is memory
    already freed but still kept by the allocator (not returned to the OS) -
    when it dominates RSS the growth is allocator retention, not live objects.
    """
    if _libc is None:
        return {}
    mi = _libc.mallinfo2()
    return {
        "malloc_in_use_mb": _bytes_to_mb(mi.uordblks + mi.hblkhd),
        "malloc_free_held_mb": _bytes_to_mb(mi.fordblks),
        "malloc_mmap_mb": _bytes_to_mb(mi.hblkhd),
        "malloc_heap_mb": _bytes_to_mb(mi.arena),
    }


class ContainerCpuMeter:
    """Container CPU use between successive ``sample()`` calls.

    Reports a percentage of the cgroup CPU limit (or of the host's cores when
    there is no limit).  Keep one meter per caller so independent callers do
    not shorten each other's measuring window.  The first call returns ``None``.
    """

    def __init__(self, root: str = _CGROUP_ROOT, clock=time.monotonic):
        self._root = root
        self._clock = clock
        self._last: tuple[float, float] | None = None

    def sample(self) -> float | None:
        used = _cpu_usage_seconds(self._root)
        now = self._clock()
        last, self._last = self._last, (used, now) if used is not None else None
        if used is None or last is None or now <= last[1]:
            return None
        cores = _cpu_limit(self._root) or os.cpu_count() or 1
        return round(max(0.0, (used - last[0]) / (now - last[1]) / cores * 100), 1)


# ---------------------------------------------------------------------------
# Snapshot collector
# ---------------------------------------------------------------------------


def collect_metrics() -> dict:
    """
    Gather a full metrics snapshot.

    The returned dict is JSON-serialisable and can be served directly by
    the ``/api/metrics`` endpoint.
    """
    # Import singletons lazily to avoid circular imports
    from .cache import bot_cache, instance_path_cache
    from .dicom_io import file_prefetcher

    proc = psutil.Process()
    mem = proc.memory_info()
    sys_mem = psutil.virtual_memory()

    pf_stats = file_prefetcher.stats

    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "system": {
            "cpu_percent_process": proc.cpu_percent(interval=0.1),
            "cpu_percent_system": psutil.cpu_percent(interval=0.1),
            "cpu_count": os.cpu_count(),
            "memory_rss_mb": _bytes_to_mb(mem.rss),
            "memory_vms_mb": _bytes_to_mb(mem.vms),
            "system_memory_total_mb": _bytes_to_mb(sys_mem.total),
            "system_memory_available_mb": _bytes_to_mb(sys_mem.available),
            "system_memory_used_percent": sys_mem.percent,
            "threads_active": threading.active_count(),
            "network_connections": len(proc.net_connections()),
        },
        "caches": {
            "bot_cache": bot_cache.stats,
            "instance_path_cache": instance_path_cache.stats,
        },
        "prefetcher": pf_stats,
        "http_pool": {
            "pool_connections": 20,
            "pool_maxsize": 50,
        },
    }


# ---------------------------------------------------------------------------
# One-line log summary
# ---------------------------------------------------------------------------


def _log_metrics_summary():
    """Write a compact metrics line to the application log."""
    try:
        m = collect_metrics()
        s = m["system"]
        c = m["caches"]
        p = m["prefetcher"]

        logger.debug(
            f"CPU: {s['cpu_percent_process']:.1f}% proc / "
            f"{s['cpu_percent_system']:.1f}% sys | "
            f"RAM: {s['memory_rss_mb']} MB "
            f"(sys {s['system_memory_used_percent']}%) | "
            f"Threads: {s['threads_active']} | "
            f"Conns: {s['network_connections']} | "
            f"BOT$: {c['bot_cache']['entries']} entries "
            f"({c['bot_cache']['hit_rate']} hit) | "
            f"Path$: {c['instance_path_cache']['entries']} entries "
            f"({c['instance_path_cache']['hit_rate']} hit) | "
            f"Prefetch: {p['done']} / {p['pending']} pending "
            f"mem {p['memory_used_mb']}/{p['memory_budget_mb']} MB"
        )
    except Exception as exc:
        logger.error(f"Metrics collection failed: {exc}")


# ---------------------------------------------------------------------------
# Background periodic logger
# ---------------------------------------------------------------------------

_metrics_task: asyncio.Task | None = None


async def _periodic_logger(interval_seconds: int):
    """Async loop that logs metrics at a fixed interval."""
    logger.info(f"Periodic metrics logger started (every {interval_seconds}s)")
    while True:
        await asyncio.sleep(interval_seconds)
        _log_metrics_summary()


def start_metrics_logger(interval_seconds: int = 300):
    """
    Start the background metrics logger.

    Safe to call multiple times — only the first call creates the task.

    Args:
        interval_seconds: Logging interval (default 300 = 5 minutes).
    """
    global _metrics_task
    if _metrics_task is not None:
        return  # already running

    loop = asyncio.get_event_loop()
    _metrics_task = loop.create_task(_periodic_logger(interval_seconds))
