"""
Lightweight Lakebase client for the DICOMweb Gateway.

Handles only the ``endpoint_metrics`` table — avoids pulling in the full
``databricks-pixels`` package and its heavy transitive dependencies.

Connection credentials are obtained via the Databricks SDK
(``WorkspaceClient``) and refreshed automatically.
"""

import json
import logging
import os
import threading
import time
from datetime import datetime, timedelta

import psycopg2
from databricks.sdk import WorkspaceClient

logger = logging.getLogger("DICOMweb.Gateway.MetricsStore")

_DEFAULT_DATABASE = "databricks_postgres"
_DEFAULT_SCHEMA = "pixels"
_METRICS_TABLE = "endpoint_metrics"
_RETENTION_HOURS = 24

# Credentials are refreshed 5 min before the 1-hour token lifetime expires.
_TOKEN_LIFETIME = 3600
_REFRESH_BEFORE = 300


class MetricsStore:
    """Minimal Lakebase accessor for the ``endpoint_metrics`` table."""

    def __init__(self):
        self._lock = threading.Lock()
        self._conn: psycopg2.extensions.connection | None = None
        self._token_expiry = datetime.min
        self._ws = WorkspaceClient()
        self._user = self._ws.current_user.me().user_name

        uc_table = os.getenv("DATABRICKS_PIXELS_TABLE", "")
        if uc_table and uc_table.count(".") == 2:
            parts = uc_table.strip().split(".")
            self._database = parts[0]
            self._schema = parts[1]
        else:
            self._database = _DEFAULT_DATABASE
            self._schema = _DEFAULT_SCHEMA

        instance_name = os.getenv("LAKEBASE_INSTANCE_NAME", "pixels-lakebase")
        branch = os.getenv("LAKEBASE_BRANCH_NAME", "main")
        self._project_rn = f"projects/{instance_name}"
        self._branch_rn = f"{self._project_rn}/branches/{branch}"
        self._endpoint_rn = f"{self._branch_rn}/endpoints/{instance_name}"

        self._host: str | None = None
        self._resolve_host()
        self._ensure_connection()
        self._ensure_table()

    # ------------------------------------------------------------------
    # Connection management
    # ------------------------------------------------------------------

    def _resolve_host(self):
        ep = self._ws.postgres.get_endpoint(self._endpoint_rn)
        self._host = ep.status.hosts.host
        logger.info("Lakebase host resolved: %s", self._host)

    def _generate_token(self) -> str:
        cred = self._ws.postgres.generate_database_credential(
            endpoint=self._endpoint_rn,
        )
        self._token_expiry = datetime.now() + timedelta(seconds=_TOKEN_LIFETIME)
        return cred.token

    def _ensure_connection(self):
        with self._lock:
            needs_refresh = (
                self._conn is None
                or self._conn.closed
                or datetime.now() >= self._token_expiry - timedelta(seconds=_REFRESH_BEFORE)
            )
            if not needs_refresh:
                return
            if self._conn and not self._conn.closed:
                try:
                    self._conn.close()
                except Exception:
                    pass
            token = self._generate_token()
            self._conn = psycopg2.connect(
                database=self._database,
                user=self._user,
                host=self._host,
                password=token,
                sslmode="require",
            )
            self._conn.autocommit = False
            logger.info("Lakebase connection established (metrics store)")

    def _get_conn(self) -> psycopg2.extensions.connection:
        self._ensure_connection()
        return self._conn  # type: ignore[return-value]

    # ------------------------------------------------------------------
    # Table bootstrap
    # ------------------------------------------------------------------

    def _ensure_table(self):
        conn = self._get_conn()
        with conn.cursor() as cur:
            cur.execute(
                f"CREATE TABLE IF NOT EXISTS {self._schema}.{_METRICS_TABLE} ("
                "  source TEXT NOT NULL,"
                "  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),"
                "  metrics JSONB NOT NULL,"
                "  PRIMARY KEY (source, recorded_at)"
                ")"
            )
            cur.execute(
                f"CREATE INDEX IF NOT EXISTS idx_endpoint_metrics_source_time "
                f"ON {self._schema}.{_METRICS_TABLE} (source, recorded_at DESC)"
            )
            conn.commit()
        logger.info("Ensured %s.%s table exists", self._schema, _METRICS_TABLE)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def insert_metrics(self, source: str, metrics: dict):
        """Insert a metrics snapshot and purge old rows."""
        conn = self._get_conn()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    f"INSERT INTO {self._schema}.{_METRICS_TABLE} "
                    "(source, recorded_at, metrics) VALUES (%s, NOW(), %s) "
                    "ON CONFLICT (source, recorded_at) DO UPDATE "
                    "SET metrics = EXCLUDED.metrics",
                    (source, json.dumps(metrics)),
                )
                cur.execute(
                    f"DELETE FROM {self._schema}.{_METRICS_TABLE} "
                    "WHERE recorded_at < NOW() - INTERVAL '%s hours'",
                    (_RETENTION_HOURS,),
                )
                conn.commit()
        except Exception:
            try:
                conn.rollback()
            except Exception:
                pass
            raise

    def get_latest_metrics(
        self,
        source: str | None = None,
        limit: int = 60,
    ) -> list[dict]:
        """Return the most recent metrics rows."""
        conn = self._get_conn()
        with conn.cursor() as cur:
            if source:
                cur.execute(
                    f"SELECT source, recorded_at, metrics "
                    f"FROM {self._schema}.{_METRICS_TABLE} "
                    "WHERE source = %s ORDER BY recorded_at DESC LIMIT %s",
                    (source, limit),
                )
            else:
                cur.execute(
                    f"SELECT source, recorded_at, metrics "
                    f"FROM {self._schema}.{_METRICS_TABLE} "
                    "ORDER BY recorded_at DESC LIMIT %s",
                    (limit,),
                )
            conn.commit()
            rows = cur.fetchall()

        results = []
        for src, ts, m in rows:
            results.append({
                "source": src,
                "recorded_at": ts.isoformat() if hasattr(ts, "isoformat") else str(ts),
                "metrics": m if isinstance(m, dict) else {},
            })
        return results


# ---------------------------------------------------------------------------
# Module-level singleton (created lazily to tolerate missing config)
# ---------------------------------------------------------------------------

_store: MetricsStore | None = None
_store_init_lock = threading.Lock()
_store_init_attempted = False


def get_store() -> MetricsStore | None:
    """Return the module-level MetricsStore singleton (or None if unavailable)."""
    global _store, _store_init_attempted
    if _store is not None:
        return _store
    if _store_init_attempted:
        return None
    with _store_init_lock:
        if _store is not None:
            return _store
        _store_init_attempted = True
        try:
            _store = MetricsStore()
            logger.info("MetricsStore singleton created")
        except Exception as exc:
            logger.warning("MetricsStore unavailable: %s", exc)
    return _store
