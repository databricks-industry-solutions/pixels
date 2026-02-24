"""
Databricks SQL client with App and User (OBO) authorization.

Uses the `Databricks SQL Connector for Python`_ with **parameterized queries**
to prevent SQL injection.

Authorization modes (controlled by ``DICOMWEB_USE_USER_AUTH`` env var):

* **App authorization** (default) — uses the service principal credentials
  injected by the Databricks Apps runtime (``DATABRICKS_CLIENT_ID`` /
  ``DATABRICKS_CLIENT_SECRET``).  The SDK ``Config`` handles token refresh
  automatically.
* **User authorization (OBO)** — when ``DICOMWEB_USE_USER_AUTH=true``, uses the
  ``X-Forwarded-Access-Token`` forwarded by the Databricks Apps proxy so
  every query runs with the end-user's Unity Catalog permissions.

.. _Databricks SQL Connector for Python:
   https://docs.databricks.com/aws/en/dev-tools/python-sql-connector
.. _Databricks Apps authorization:
   https://docs.databricks.com/aws/en/dev-tools/databricks-apps/auth
"""

import os
import queue
import re
import threading
from collections.abc import Iterator
from typing import Any

from databricks import sql as dbsql
from databricks.sdk.core import Config
from fastapi import HTTPException

from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("DICOMweb.SQL")

# ---------------------------------------------------------------------------
# Feature flag: set DICOMWEB_USE_USER_AUTH=true to enable On-Behalf-Of-User
# ---------------------------------------------------------------------------
USE_USER_AUTH: bool = os.getenv("DICOMWEB_USE_USER_AUTH", "false").lower() == "true"


# ---------------------------------------------------------------------------
# Table-name validation (identifiers can't be parameterized)
# ---------------------------------------------------------------------------

_TABLE_NAME_RE = re.compile(r"^[\w\-]+\.[\w\-]+\.[\w\-]+$")


def validate_table_name(name: str) -> str:
    """
    Validate that *name* looks like ``catalog.schema.table``.

    Table names are SQL identifiers and **cannot** be sent as bind parameters,
    so we must verify them before interpolation to prevent injection.
    """
    if not _TABLE_NAME_RE.match(name):
        raise ValueError(
            f"Invalid table name '{name}'. "
            "Expected format: catalog.schema.table (alphanumeric, underscores, hyphens)."
        )
    return name


# ---------------------------------------------------------------------------
# SQL Client
# ---------------------------------------------------------------------------


class DatabricksSQLClient:
    """
    SQL client backed by the Databricks SQL Connector for Python.

    * **App auth** — reuses a persistent connection authenticated via the SDK
      ``Config`` (which picks up ``DATABRICKS_CLIENT_ID`` /
      ``DATABRICKS_CLIENT_SECRET`` or ``DATABRICKS_TOKEN`` automatically).
    * **User auth (OBO)** — creates a per-request connection using the user's
      forwarded access token so Unity Catalog row/column policies apply.

    All queries use **parameterized execution** (``%(name)s`` placeholders)
    so user-supplied values never touch the SQL string.
    """

    def __init__(self, host: str, warehouse_id: str):
        self._host = host.replace("https://", "").replace("http://", "").rstrip("/")
        self._http_path = f"/sql/1.0/warehouses/{warehouse_id}"
        self._cfg = Config()

        # Connection pool for app-auth queries.
        # Each connection can only run one cursor at a time (SQL connector
        # is not thread-safe per connection), so under high concurrency a
        # pool prevents 60 threads from serializing behind one connection.
        _pool_size = int(os.getenv("DATABRICKS_SQL_POOL_SIZE", "8"))
        self._pool: queue.Queue = queue.Queue(maxsize=_pool_size)
        self._pool_size = _pool_size
        self._pool_lock = threading.Lock()
        self._pool_count = 0  # total connections created so far

        mode = "USER (OBO)" if USE_USER_AUTH else "APP (service principal)"
        logger.info(
            "SQL client configured for %s authorization (pool_size=%d)",
            mode, _pool_size,
        )

    # -- connection management ---------------------------------------------

    def _new_app_connection(self):
        return dbsql.connect(
            server_hostname=self._host,
            http_path=self._http_path,
            credentials_provider=lambda: self._cfg.authenticate,
            use_cloud_fetch=False,
        )

    def _acquire_app_connection(self):
        """
        Return a connection from the pool, creating one if needed.

        Blocks until a connection is available.  Connections are returned
        to the pool via ``_release_app_connection`` after each query.
        """
        try:
            return self._pool.get_nowait()
        except queue.Empty:
            pass

        with self._pool_lock:
            if self._pool_count < self._pool_size:
                conn = self._new_app_connection()
                self._pool_count += 1
                logger.debug(
                    "SQL pool: opened connection %d/%d", self._pool_count, self._pool_size
                )
                return conn

        # Pool is full — wait for a connection to be returned
        return self._pool.get(timeout=60)

    def _release_app_connection(self, conn, failed: bool = False):
        """Return *conn* to the pool, or discard it if *failed*."""
        if failed:
            try:
                conn.close()
            except Exception:
                pass
            with self._pool_lock:
                self._pool_count -= 1
        else:
            try:
                self._pool.put_nowait(conn)
            except queue.Full:
                conn.close()
                with self._pool_lock:
                    self._pool_count -= 1

    def _connect_as_user(self, user_token: str):
        """Create a one-shot connection using the user's access token."""
        return dbsql.connect(
            server_hostname=self._host,
            http_path=self._http_path,
            access_token=user_token,
            use_cloud_fetch=False,
        )

    # -- public API --------------------------------------------------------

    def execute(
        self,
        query: str,
        parameters: dict[str, Any] | None = None,
        user_token: str | None = None,
    ) -> list[list[Any]]:
        """
        Execute a **parameterized** SQL query and return rows.

        Args:
            query: SQL string with ``%(name)s`` placeholders.
            parameters: Bind-parameter dict (values only — never identifiers).
            user_token: The user's forwarded access token.  Used **only** when
                ``DICOMWEB_USE_USER_AUTH=true``; ignored otherwise.

        Returns:
            ``list[list[Any]]`` — each inner list is one row of column values.

        Raises:
            HTTPException: On SQL execution failure.
        """
        logger.debug(f"SQL: {query}  params={parameters}")

        is_obo = USE_USER_AUTH and user_token is not None
        conn = None
        failed = False

        try:
            if is_obo:
                conn = self._connect_as_user(user_token)
            else:
                conn = self._acquire_app_connection()

            with conn.cursor() as cursor:
                cursor.execute(query, parameters=parameters)
                # Use fetchmany_arrow in a loop instead of fetchall to
                # avoid crashes on large result sets (Arrow batches are
                # more memory-friendly and bypass known connector bugs).
                results: list[list[Any]] = []
                while True:
                    batch = cursor.fetchmany_arrow(10_000)
                    if batch.num_rows == 0:
                        break
                    results.extend(
                        list(row.values()) for row in batch.to_pylist()
                    )
                return results

        except Exception as exc:
            failed = True
            logger.error(f"SQL execution failed: {exc}")
            raise HTTPException(status_code=500, detail=f"SQL query failed: {exc}")

        finally:
            if conn is not None:
                if is_obo:
                    try:
                        conn.close()
                    except Exception:
                        pass
                else:
                    self._release_app_connection(conn, failed=failed)

    def execute_stream(
        self,
        query: str,
        parameters: dict[str, Any] | None = None,
        user_token: str | None = None,
    ) -> Iterator[list[Any]]:
        """
        Execute a **parameterized** SQL query and return a lazy row iterator.

        The query is executed **eagerly** (errors raise immediately), but
        rows are fetched lazily in Arrow batches — ideal for large result
        sets that will be streamed to the HTTP client.

        The caller **must** fully consume (or explicitly ``.close()``) the
        returned iterator so that the underlying cursor is released.

        Args:
            query: SQL string with ``%(name)s`` placeholders.
            parameters: Bind-parameter dict (values only — never identifiers).
            user_token: The user's forwarded access token.  Used **only** when
                ``DICOMWEB_USE_USER_AUTH=true``; ignored otherwise.

        Yields:
            ``list[Any]`` — one list of column values per row.

        Raises:
            HTTPException: On SQL execution failure.
        """
        logger.debug(f"SQL (stream): {query}  params={parameters}")

        is_obo = USE_USER_AUTH and user_token is not None
        conn = None
        failed = False

        try:
            if is_obo:
                conn = self._connect_as_user(user_token)
            else:
                conn = self._acquire_app_connection()

            cursor = conn.cursor()
            cursor.execute(query, parameters=parameters)
        except Exception as exc:
            failed = True
            logger.error(f"SQL execution failed: {exc}")
            if conn is not None:
                if is_obo:
                    try:
                        conn.close()
                    except Exception:
                        pass
                else:
                    self._release_app_connection(conn, failed=True)
            raise HTTPException(status_code=500, detail=f"SQL query failed: {exc}")

        def _rows() -> Iterator[list[Any]]:
            row_failed = False
            try:
                while True:
                    batch = cursor.fetchmany_arrow(10_000)
                    if batch.num_rows == 0:
                        break
                    for row in batch.to_pylist():
                        yield list(row.values())
            except Exception:
                row_failed = True
                raise
            finally:
                cursor.close()
                if is_obo:
                    try:
                        conn.close()
                    except Exception:
                        pass
                else:
                    self._release_app_connection(conn, failed=row_failed)

        return _rows()

    def close(self):
        """Drain and close all pooled app-auth connections."""
        while True:
            try:
                conn = self._pool.get_nowait()
                try:
                    conn.close()
                except Exception:
                    pass
            except queue.Empty:
                break
        with self._pool_lock:
            self._pool_count = 0

