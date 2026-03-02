"""
DICOMweb utilities package for Databricks Pixels.

Provides QIDO-RS (Query) and WADO-RS (Retrieve) endpoint handlers
backed by Databricks SQL warehouse and PACS-style BOT caching.

Modules
-------
cache        — In-memory BOT + instance-path LRU caches
dicom_tags   — Tag constants, VR mappings, DICOMweb JSON formatting
dicom_io     — Low-level DICOM file I/O, streaming, and prefetching
metrics      — System and application metrics (CPU, RAM, caches)
queries      — QIDO-RS SQL query builders (parameterized)
sql_client   — Databricks SQL Connector with App / User (OBO) auth
wrapper      — ``DICOMwebDatabricksWrapper`` service class
handlers     — FastAPI endpoint handlers (QIDO / WADO / STOW / resolve)
  _common    — Shared singletons, authentication, wrapper factory
  _qido      — QIDO-RS handlers
  _wado      — WADO-RS, WADO-URI, path resolution handlers
  _stow      — STOW-RS handler with early return and cache pre-warming
"""

import time
from functools import wraps

from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("DICOMweb")


def timing_decorator(func):
    """Decorator to measure and log function execution time."""

    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = func(*args, **kwargs)
            elapsed = time.time() - start_time
            logger.debug(f"⏱️  {func.__name__} took {elapsed:.4f}s")
            return result
        except Exception as e:
            elapsed = time.time() - start_time
            logger.error(f"⏱️  {func.__name__} failed after {elapsed:.4f}s: {e}")
            raise

    return wrapper
