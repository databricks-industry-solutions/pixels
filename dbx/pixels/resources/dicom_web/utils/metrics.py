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
import os
import threading
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

        logger.info(
            f"📊  CPU: {s['cpu_percent_process']:.1f}% proc / "
            f"{s['cpu_percent_system']:.1f}% sys | "
            f"RAM: {s['memory_rss_mb']} MB "
            f"(sys {s['system_memory_used_percent']}%) | "
            f"Threads: {s['threads_active']} | "
            f"Conns: {s['network_connections']} | "
            f"BOT$: {c['bot_cache']['entries']} entries "
            f"({c['bot_cache']['hit_rate']} hit) | "
            f"Path$: {c['instance_path_cache']['entries']} entries "
            f"({c['instance_path_cache']['hit_rate']} hit) | "
            f"Prefetch: {p['futures_done']}✓ / {p['futures_pending']}⏳ "
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
    logger.info(
        f"Periodic metrics logger started (every {interval_seconds}s)"
    )
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
    _metrics_task = loop.create_task(
        _periodic_logger(interval_seconds)
    )

