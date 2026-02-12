"""
Utility modules for lakehouse app.
"""

import time
from functools import wraps

from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("Utils")

def timing_decorator(func):
    """Decorator to measure and log function execution time."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = func(*args, **kwargs)
            elapsed_time = time.time() - start_time
            logger.info(f"⏱️  {func.__name__} took {elapsed_time:.4f}s")
            return result
        except Exception as e:
            elapsed_time = time.time() - start_time
            logger.error(f"⏱️  {func.__name__} failed after {elapsed_time:.4f}s: {e}")
            raise
    return wrapper