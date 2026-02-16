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
import re
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
        self._app_conn = None  # lazy-initialised, reused across requests

        mode = "USER (OBO)" if USE_USER_AUTH else "APP (service principal)"
        logger.info(f"SQL client configured for {mode} authorization")

    # -- connection management ---------------------------------------------

    def _get_app_connection(self):
        """Return (or create) the shared app-auth connection."""
        if self._app_conn is None:
            self._app_conn = dbsql.connect(
                server_hostname=self._host,
                http_path=self._http_path,
                credentials_provider=lambda: self._cfg.authenticate,
                use_cloud_fetch=False,
            )
            logger.info("App-auth SQL connection established")
        return self._app_conn

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

        try:
            if is_obo:
                conn = self._connect_as_user(user_token)
            else:
                conn = self._get_app_connection()

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
            logger.error(f"SQL execution failed: {exc}")
            # Reset app connection on failure so next call gets a fresh one
            if not is_obo:
                self._app_conn = None
            raise HTTPException(status_code=500, detail=f"SQL query failed: {exc}")

        finally:
            # Close per-request OBO connections; app connection is reused
            if is_obo:
                try:
                    conn.close()
                except Exception:
                    pass

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

        try:
            if is_obo:
                conn = self._connect_as_user(user_token)
            else:
                conn = self._get_app_connection()

            cursor = conn.cursor()
            cursor.execute(query, parameters=parameters)
        except Exception as exc:
            logger.error(f"SQL execution failed: {exc}")
            if not is_obo:
                self._app_conn = None
            raise HTTPException(status_code=500, detail=f"SQL query failed: {exc}")

        def _rows() -> Iterator[list[Any]]:
            try:
                while True:
                    batch = cursor.fetchmany_arrow(10_000)
                    if batch.num_rows == 0:
                        break
                    for row in batch.to_pylist():
                        yield list(row.values())
            finally:
                cursor.close()
                if is_obo:
                    try:
                        conn.close()
                    except Exception:
                        pass

        return _rows()

    def close(self):
        """Close the shared app-auth connection (if open)."""
        if self._app_conn:
            self._app_conn.close()
            self._app_conn = None

