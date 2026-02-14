import os
import threading
import time
import uuid
from datetime import datetime, timedelta

from databricks.sdk import WorkspaceClient
from databricks.sdk.service.database import (
    DatabaseInstance,
    DatabaseInstanceRole,
    DatabaseInstanceRoleIdentityType,
    DatabaseInstanceState,
)
from psycopg2 import sql
from psycopg2.extras import execute_values
from psycopg2.pool import ThreadedConnectionPool

from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("LakebaseUtils")

LAKEBASE_SCHEMA = "pixels"
DICOM_FRAMES_TABLE = "dicom_frames"
INSTANCE_PATHS_TABLE = "instance_paths"
ACCESS_RULES_TABLE = "access_rules"
USER_GROUPS_TABLE = "user_groups"

# ---------------------------------------------------------------------------
# Feature flag — set LAKEBASE_RLS_ENABLED=true to activate Row-Level Security
# ---------------------------------------------------------------------------
RLS_ENABLED: bool = os.getenv("LAKEBASE_RLS_ENABLED", "false").lower() == "true"


class RefreshableThreadedConnectionPool(ThreadedConnectionPool):
    """
    A custom ThreadedConnectionPool that automatically refreshes database credentials
    before they expire. The pool tracks token expiration and proactively refreshes
    credentials 5 minutes before expiration to prevent connection failures.
    """

    def __init__(
        self,
        minconn,
        maxconn,
        credential_refresh_callback,
        token_lifetime_seconds=3600,
        refresh_before_seconds=300,
        *args,
        **kwargs,
    ):
        """
        Initialize the refreshable connection pool.

        Args:
            minconn: Minimum number of connections to maintain
            maxconn: Maximum number of connections to create
            credential_refresh_callback: Function that returns new credentials dict with 'password' key
            token_lifetime_seconds: How long the token is valid (default: 3600 = 1 hour)
            refresh_before_seconds: Refresh token this many seconds before expiration (default: 300 = 5 minutes)
            *args, **kwargs: Additional arguments passed to ThreadedConnectionPool
        """
        super().__init__(minconn, maxconn, *args, **kwargs)

        self.credential_refresh_callback = credential_refresh_callback
        self.token_lifetime_seconds = token_lifetime_seconds
        self.refresh_before_seconds = refresh_before_seconds
        self.token_expiration = datetime.now() + timedelta(seconds=token_lifetime_seconds)
        self.refresh_lock = threading.Lock()
        self.last_refresh = datetime.now()

        logger.info(
            f"Initialized RefreshableThreadedConnectionPool with token expiration at {self.token_expiration}"
        )

    def _check_and_refresh_token(self):
        """
        Check if token needs refresh and refresh it if necessary.
        This method is thread-safe and only one thread will perform the refresh.
        """
        now = datetime.now()
        time_until_expiration = (self.token_expiration - now).total_seconds()

        # Check if we need to refresh (without holding the lock)
        if time_until_expiration > self.refresh_before_seconds:
            return False

        # Acquire lock to perform refresh
        with self.refresh_lock:
            # Double-check after acquiring lock (another thread might have refreshed)
            now = datetime.now()
            time_until_expiration = (self.token_expiration - now).total_seconds()

            if time_until_expiration > self.refresh_before_seconds:
                return False

            try:
                logger.info(
                    f"Refreshing credentials. Time until expiration: {time_until_expiration:.2f} seconds"
                )

                # Get new credentials
                new_credentials = self.credential_refresh_callback()

                # Update connection parameters
                if "password" in new_credentials:
                    self._kwargs["password"] = new_credentials["password"]

                # Update expiration time
                self.token_expiration = datetime.now() + timedelta(
                    seconds=self.token_lifetime_seconds
                )
                self.last_refresh = datetime.now()

                logger.info(
                    f"Successfully refreshed credentials. New expiration: {self.token_expiration}"
                )
                return True

            except Exception as e:
                logger.error(f"Failed to refresh credentials: {str(e)}")
                # Update expiration to retry sooner
                self.token_expiration = datetime.now() + timedelta(seconds=60)
                raise

    def getconn(self, key=None):
        """
        Get a connection from the pool, refreshing credentials if needed.
        """
        self._check_and_refresh_token()
        return super().getconn(key)

    def get_time_until_expiration(self):
        """
        Get the time until token expiration in seconds.
        """
        return (self.token_expiration - datetime.now()).total_seconds()


class LakebaseUtils:
    # Default connection pool configuration
    DEFAULT_MIN_CONNECTIONS = 8
    DEFAULT_MAX_CONNECTIONS = 64

    def __init__(
        self,
        instance_name="pixels-lakebase",
        capacity="CU_2",
        user=None,
        app_sp_id=None,
        create_instance=False,
        min_connections: int = DEFAULT_MIN_CONNECTIONS,
        max_connections: int = DEFAULT_MAX_CONNECTIONS,
    ):
        self.instance_name = instance_name
        self.capacity = capacity
        self.min_connections = min_connections
        self.max_connections = max_connections
        self.workspace_client = WorkspaceClient()

        if user is None:
            self.user = self.workspace_client.current_user.me().user_name
        else:
            self.user = user

        self.instance = self.get_or_create_db_instance(create_instance)

        if app_sp_id is not None:
            self.get_or_create_sp_role(app_sp_id)

        self.connection = self.get_connection()

    def get_or_create_db_instance(self, create_instance):
        instances = list(self.workspace_client.database.list_database_instances() or [])
        db_exists = any(inst.name == self.instance_name for inst in instances)

        instance = None

        if db_exists:
            logger.info(f"Lakebase instance '{self.instance_name}' already exists.")
            instance = next(inst for inst in instances if inst.name == self.instance_name)
        else:
            if create_instance:
                logger.info(f"Creating Lakebase instance '{self.instance_name}'")
                instance = self.workspace_client.database.create_database_instance(
                    DatabaseInstance(name=self.instance_name, capacity=self.capacity)
                )
                logger.info(f"Created Lakebase instance: {instance.name}")
            else:
                raise Exception(f"Lakebase instance '{self.instance_name}' does not exist")

        while instance.state == DatabaseInstanceState.STARTING:
            instance = self.workspace_client.database.get_database_instance(name=self.instance_name)
            logger.info(f"Waiting for instance to be ready: {instance.state}")
            time.sleep(30)

        logger.info(f"Connection endpoint: {instance.read_write_dns}")

        return instance

    def get_or_create_sp_role(self, sp_client_id):
        role = DatabaseInstanceRole(
            name=sp_client_id, identity_type=DatabaseInstanceRoleIdentityType.SERVICE_PRINCIPAL
        )

        db_roles = list(
            self.workspace_client.database.list_database_instance_roles(self.instance_name) or []
        )
        db_roles_found = [dbrole for dbrole in db_roles if dbrole.name == sp_client_id]

        if len(db_roles_found) > 0:
            db_role = db_roles_found[0]
            logger.info(
                f"Role for service principal {sp_client_id} already exists in instance {self.instance_name}"
            )
        else:
            # Create the database instance role for the service principal
            db_role = self.workspace_client.database.create_database_instance_role(
                instance_name=self.instance_name, database_instance_role=role
            )
            logger.info(
                f"Created role for service principal {sp_client_id} in instance {self.instance_name}"
            )

        return db_role

    def _generate_credential(self):
        """
        Generate a new database credential token.
        This method is called by the connection pool to refresh credentials.

        Returns:
            dict: Dictionary with 'password' key containing the new token
        """
        cred = self.workspace_client.database.generate_database_credential(
            request_id=str(uuid.uuid4()), instance_names=[self.instance_name]
        )
        logger.info(f"Generated new database credential for instance '{self.instance_name}'")
        return {"password": cred.token}

    def get_connection(self):
        """
        Create and return a RefreshableThreadedConnectionPool that automatically
        refreshes credentials before they expire.

        Returns:
            RefreshableThreadedConnectionPool: A connection pool with auto-refresh capability
        """
        host = self.instance.read_write_dns
        database = "databricks_postgres"

        # Generate initial credentials
        initial_cred = self._generate_credential()

        db_kwargs = {
            "database": database,
            "user": self.user,
            "host": host,
            "sslmode": "require",
            "password": initial_cred["password"],
        }

        # Create refreshable connection pool
        # Tokens expire in 1 hour (3600 seconds), refresh 5 minutes (300 seconds) before expiration
        pool = RefreshableThreadedConnectionPool(
            minconn=self.min_connections,
            maxconn=self.max_connections,
            credential_refresh_callback=self._generate_credential,
            token_lifetime_seconds=3600,
            refresh_before_seconds=300,
            **db_kwargs,
        )

        logger.info(
            f"Created RefreshableThreadedConnectionPool for instance '{self.instance_name}' "
            f"with auto-refresh at 55 minutes"
        )

        return pool

    # ------------------------------------------------------------------
    # Core query helpers (RLS-aware)
    # ------------------------------------------------------------------

    def execute_and_fetch_query(
        self,
        query: str | sql.Composed,
        params: tuple = None,
        user_groups: list[str] | None = None,
    ) -> list[tuple]:
        """
        Execute a query and return rows.

        When ``user_groups`` is provided **and** ``LAKEBASE_RLS_ENABLED`` is
        ``True``, a ``SET LOCAL app.user_groups`` is issued in the same
        transaction so that PostgreSQL RLS policies can filter rows.

        The ``SET LOCAL`` is transaction-scoped: it is automatically cleared
        on ``COMMIT`` / ``ROLLBACK``, so pooled connections are never tainted.
        """
        conn = None
        try:
            conn = self.connection.getconn()
            with conn.cursor() as cursor:
                if RLS_ENABLED and user_groups:
                    groups_csv = ",".join(user_groups)
                    cursor.execute("SET LOCAL app.user_groups = %s", (groups_csv,))
                cursor.execute(query, params)
                results = cursor.fetchall()
            # Commit ends the transaction → clears SET LOCAL
            conn.commit()
            return results
        finally:
            if conn:
                self.connection.putconn(conn)

    def execute_query(self, query: str | sql.Composed, params: tuple = None):
        conn = None
        try:
            conn = self.connection.getconn()
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                conn.commit()
        finally:
            if conn:
                self.connection.putconn(conn)

    # ------------------------------------------------------------------
    # DICOM frame cache (persistent tier-2 for byte offsets)
    # ------------------------------------------------------------------

    def retrieve_frame_range(
        self,
        filename: str,
        frame: int,
        uc_table_name: str,
        table: str = DICOM_FRAMES_TABLE,
        user_groups: list[str] | None = None,
    ) -> dict | None:
        query = sql.SQL(
            "SELECT start_pos, end_pos, pixel_data_pos FROM {} "
            "WHERE filename = %s AND frame = %s AND uc_table_name = %s"
        ).format(sql.Identifier(LAKEBASE_SCHEMA, table))
        results = self.execute_and_fetch_query(
            query, (filename, frame, uc_table_name), user_groups=user_groups,
        )
        if len(results) == 1:
            return {
                "start_pos": results[0][0],
                "end_pos": results[0][1],
                "pixel_data_pos": results[0][2],
            }
        elif len(results) > 1:
            raise Exception(f"Multiple entries found for {filename} and frame {frame}")
        else:
            return None

    def retrieve_max_frame_range(
        self,
        filename: str,
        param_frames: int,
        uc_table_name: str,
        table: str = DICOM_FRAMES_TABLE,
        user_groups: list[str] | None = None,
    ) -> dict | None:
        query = sql.SQL(
            "SELECT max(frame), max(start_pos) FROM {} "
            "WHERE filename = %s AND frame <= %s AND uc_table_name = %s"
        ).format(sql.Identifier(LAKEBASE_SCHEMA, table))
        results = self.execute_and_fetch_query(
            query, (filename, param_frames, uc_table_name), user_groups=user_groups,
        )
        if len(results) == 1:
            return {"max_frame_idx": results[0][0], "max_start_pos": results[0][1]}
        else:
            return None

    def insert_frame_range(
        self,
        filename: str,
        frame: int,
        start_pos: int,
        end_pos: int,
        pixel_data_pos: int,
        uc_table_name: str,
        table: str = DICOM_FRAMES_TABLE,
        allowed_groups: list[str] | None = None,
    ):
        if allowed_groups:
            groups_literal = "{" + ",".join(allowed_groups) + "}"
            query = sql.SQL(
                "INSERT INTO {table} (filename, frame, start_pos, end_pos, "
                "pixel_data_pos, uc_table_name, allowed_groups) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s) "
                "ON CONFLICT (filename, frame, uc_table_name) DO UPDATE SET "
                "allowed_groups = ARRAY("
                "  SELECT DISTINCT unnest("
                "    {table}.allowed_groups || EXCLUDED.allowed_groups"
                "  )"
                ")"
            ).format(table=sql.Identifier(LAKEBASE_SCHEMA, table))
            self.execute_query(
                query,
                (filename, frame, start_pos, end_pos, pixel_data_pos, uc_table_name, groups_literal),
            )
        else:
            query = sql.SQL(
                "INSERT INTO {} (filename, frame, start_pos, end_pos, pixel_data_pos, uc_table_name) "
                "VALUES (%s, %s, %s, %s, %s, %s) ON CONFLICT DO NOTHING"
            ).format(sql.Identifier(LAKEBASE_SCHEMA, table))
            self.execute_query(
                query, (filename, frame, start_pos, end_pos, pixel_data_pos, uc_table_name),
            )

    def retrieve_all_frame_ranges(
        self,
        filename: str,
        uc_table_name: str,
        table: str = DICOM_FRAMES_TABLE,
        user_groups: list[str] | None = None,
    ) -> list[dict] | None:
        """
        Retrieve ALL cached frame offsets for a file in a single query.

        This is the PACS-style BOT lookup: one query returns the complete
        offset table for the file, enabling instant random access to any frame.

        Args:
            filename: Full path of the DICOM file
            uc_table_name: Fully qualified Unity Catalog table name (catalog.schema.table)
            table: Table name (default: dicom_frames)
            user_groups: User's Databricks groups for RLS enforcement.

        Returns:
            List of frame metadata dicts sorted by frame number, or None if no data cached.
            Each dict has: frame_number, start_pos, end_pos, pixel_data_pos
        """
        query = sql.SQL(
            "SELECT frame, start_pos, end_pos, pixel_data_pos FROM {} "
            "WHERE filename = %s AND uc_table_name = %s ORDER BY frame"
        ).format(sql.Identifier(LAKEBASE_SCHEMA, table))
        results = self.execute_and_fetch_query(
            query, (filename, uc_table_name), user_groups=user_groups,
        )
        if not results:
            return None
        return [
            {
                "frame_number": int(row[0]),
                "start_pos": int(row[1]),
                "end_pos": int(row[2]),
                "pixel_data_pos": int(row[3]),
            }
            for row in results
        ]

    def insert_frame_ranges(
        self,
        filename: str,
        frame_ranges: list[dict],
        uc_table_name: str,
        table: str = DICOM_FRAMES_TABLE,
        allowed_groups: list[str] | None = None,
    ):
        conn = None
        if allowed_groups:
            groups_literal = "{" + ",".join(allowed_groups) + "}"
            records = [
                [
                    filename,
                    str(frame_range.get("frame_number")),
                    str(frame_range.get("start_pos")),
                    str(frame_range.get("end_pos")),
                    str(frame_range.get("pixel_data_pos")),
                    uc_table_name,
                    groups_literal,
                ]
                for frame_range in frame_ranges
            ]
            query = sql.SQL(
                "INSERT INTO {table} (filename, frame, start_pos, end_pos, "
                "pixel_data_pos, uc_table_name, allowed_groups) "
                "VALUES %s "
                "ON CONFLICT (filename, frame, uc_table_name) DO UPDATE SET "
                "allowed_groups = ARRAY("
                "  SELECT DISTINCT unnest("
                "    {table}.allowed_groups || EXCLUDED.allowed_groups"
                "  )"
                ")"
            ).format(table=sql.Identifier(LAKEBASE_SCHEMA, table))
        else:
            records = [
                [
                    filename,
                    str(frame_range.get("frame_number")),
                    str(frame_range.get("start_pos")),
                    str(frame_range.get("end_pos")),
                    str(frame_range.get("pixel_data_pos")),
                    uc_table_name,
                ]
                for frame_range in frame_ranges
            ]
            query = sql.SQL(
                "INSERT INTO {} (filename, frame, start_pos, end_pos, "
                "pixel_data_pos, uc_table_name) "
                "VALUES %s ON CONFLICT DO NOTHING"
            ).format(sql.Identifier(LAKEBASE_SCHEMA, table))
        try:
            conn = self.connection.getconn()
            with conn.cursor() as cursor:
                execute_values(cursor, query, records)
                conn.commit()
        finally:
            if conn:
                self.connection.putconn(conn)

    # ------------------------------------------------------------------
    # Instance path cache (persistent tier-2 for SOP UID → file path)
    # ------------------------------------------------------------------

    def retrieve_instance_path(
        self,
        sop_instance_uid: str,
        uc_table_name: str,
        table: str = INSTANCE_PATHS_TABLE,
        user_groups: list[str] | None = None,
    ) -> dict | None:
        """
        Look up a single instance path by SOP Instance UID and UC table name.

        When RLS is enabled the query runs inside a transaction with
        ``SET LOCAL app.user_groups`` so that only rows the user is
        authorized to see are returned.

        Returns:
            Dict with ``local_path``, ``num_frames``, ``study_instance_uid``,
            ``series_instance_uid`` — or ``None`` if not cached / not allowed.
        """
        query = sql.SQL(
            "SELECT local_path, num_frames, study_instance_uid, series_instance_uid "
            "FROM {} WHERE sop_instance_uid = %s AND uc_table_name = %s"
        ).format(sql.Identifier(LAKEBASE_SCHEMA, table))
        results = self.execute_and_fetch_query(
            query, (sop_instance_uid, uc_table_name), user_groups=user_groups,
        )
        if not results:
            return None
        row = results[0]
        return {
            "path": row[0],
            "num_frames": int(row[1]),
            "study_instance_uid": row[2],
            "series_instance_uid": row[3],
        }

    def retrieve_instance_paths_by_series(
        self,
        study_instance_uid: str,
        series_instance_uid: str,
        uc_table_name: str,
        table: str = INSTANCE_PATHS_TABLE,
        user_groups: list[str] | None = None,
    ) -> dict[str, dict] | None:
        """
        Retrieve all cached instance paths for a series from a specific UC table.

        Returns:
            ``{sop_uid: {path, num_frames, ...}}`` dict, or ``None`` if
            no entries exist for the series.
        """
        query = sql.SQL(
            "SELECT sop_instance_uid, local_path, num_frames "
            "FROM {} WHERE study_instance_uid = %s AND series_instance_uid = %s "
            "AND uc_table_name = %s"
        ).format(sql.Identifier(LAKEBASE_SCHEMA, table))
        results = self.execute_and_fetch_query(
            query,
            (study_instance_uid, series_instance_uid, uc_table_name),
            user_groups=user_groups,
        )
        if not results:
            return None
        return {
            row[0]: {"path": row[1], "num_frames": int(row[2])}
            for row in results
        }

    def insert_instance_paths_batch(
        self,
        entries: list[dict],
        table: str = INSTANCE_PATHS_TABLE,
        allowed_groups: list[str] | None = None,
    ):
        """
        Bulk-insert instance path mappings.

        When ``allowed_groups`` is provided, each row is tagged with those
        groups and conflicts merge the group arrays (accumulative).
        Without ``allowed_groups``, the legacy ``ON CONFLICT DO NOTHING``
        behaviour is preserved.

        Each entry dict must contain:
        ``sop_instance_uid``, ``study_instance_uid``,
        ``series_instance_uid``, ``local_path``, ``num_frames``,
        ``uc_table_name``.
        """
        if not entries:
            return

        if allowed_groups:
            groups_literal = "{" + ",".join(allowed_groups) + "}"
            records = [
                (
                    e["sop_instance_uid"],
                    e["study_instance_uid"],
                    e["series_instance_uid"],
                    e["local_path"],
                    e.get("num_frames", 1),
                    e["uc_table_name"],
                    groups_literal,
                )
                for e in entries
            ]
            # Merge allowed_groups on conflict so that multiple users'
            # groups accumulate — never removes access, only widens it.
            query = sql.SQL(
                "INSERT INTO {table} (sop_instance_uid, study_instance_uid, "
                "series_instance_uid, local_path, num_frames, uc_table_name, "
                "allowed_groups) VALUES %s "
                "ON CONFLICT (sop_instance_uid, uc_table_name) DO UPDATE SET "
                "allowed_groups = ARRAY("
                "  SELECT DISTINCT unnest("
                "    {table}.allowed_groups || EXCLUDED.allowed_groups"
                "  )"
                ")"
            ).format(table=sql.Identifier(LAKEBASE_SCHEMA, table))
        else:
            records = [
                (
                    e["sop_instance_uid"],
                    e["study_instance_uid"],
                    e["series_instance_uid"],
                    e["local_path"],
                    e.get("num_frames", 1),
                    e["uc_table_name"],
                )
                for e in entries
            ]
            query = sql.SQL(
                "INSERT INTO {} (sop_instance_uid, study_instance_uid, "
                "series_instance_uid, local_path, num_frames, uc_table_name) "
                "VALUES %s ON CONFLICT DO NOTHING"
            ).format(sql.Identifier(LAKEBASE_SCHEMA, table))

        conn = None
        try:
            conn = self.connection.getconn()
            with conn.cursor() as cursor:
                execute_values(cursor, query, records)
                conn.commit()
            logger.info(f"Persisted {len(records)} instance paths to Lakebase")
        finally:
            if conn:
                self.connection.putconn(conn)

    # ==================================================================
    # RLS — User group resolution
    # ==================================================================

    def get_user_groups(self, user_email: str) -> list[str]:
        """
        Resolve the Databricks groups for a user from the ``user_groups``
        Lakebase table.

        This query is **not** subject to RLS (the ``user_groups`` table has
        no RLS policy) and always uses the service principal connection.

        Returns:
            Sorted list of group names, or an empty list if no mapping exists.
        """
        query = sql.SQL(
            "SELECT group_name FROM {} WHERE user_email = %s"
        ).format(sql.Identifier(LAKEBASE_SCHEMA, USER_GROUPS_TABLE))
        results = self.execute_and_fetch_query(query, (user_email,))
        return sorted(row[0] for row in results)

    def sync_user_groups_from_databricks(self) -> int:
        """
        Sync user → group memberships from the Databricks SCIM API into
        the ``pixels.user_groups`` Lakebase table.

        This should be called by an admin periodically (or on-demand)
        to keep the mapping current.

        Returns:
            Total number of (user, group) pairs synced.
        """
        w = self.workspace_client
        records: list[tuple] = []

        for user in w.users.list():
            email = user.user_name
            if not email:
                continue
            for g in (user.groups or []):
                if g.display:
                    records.append((email, g.display))

        if not records:
            logger.warning("sync_user_groups: no user-group pairs found in SCIM")
            return 0

        # Upsert: ON CONFLICT update the synced_at timestamp
        query = sql.SQL(
            "INSERT INTO {} (user_email, group_name, synced_at) "
            "VALUES %s "
            "ON CONFLICT (user_email, group_name) DO UPDATE SET synced_at = NOW()"
        ).format(sql.Identifier(LAKEBASE_SCHEMA, USER_GROUPS_TABLE))

        conn = None
        try:
            conn = self.connection.getconn()
            with conn.cursor() as cursor:
                execute_values(cursor, query, records)
                conn.commit()
            logger.info(f"Synced {len(records)} user-group mappings to Lakebase")
        finally:
            if conn:
                self.connection.putconn(conn)

        return len(records)

    # ==================================================================
    # RLS — Access rule management
    # ==================================================================

    def upsert_access_rule(
        self,
        uc_table_name: str,
        group_name: str,
        access_type: str = "full",
        uc_filter_sql: str | None = None,
        description: str | None = None,
    ):
        """
        Create or update an access rule.

        Args:
            uc_table_name: Fully qualified UC table name (``catalog.schema.table``).
            group_name: Databricks account group.
            access_type: ``'full'`` (all rows) or ``'conditional'`` (filtered).
            uc_filter_sql: UC SQL ``WHERE`` clause for conditional access.
                Example: ``"meta:['00120063'].Value[0] IS NOT NULL"``
            description: Human-readable description of the rule.
        """
        query = sql.SQL(
            "INSERT INTO {} (uc_table_name, group_name, access_type, uc_filter_sql, description) "
            "VALUES (%s, %s, %s, %s, %s) "
            "ON CONFLICT (uc_table_name, group_name) DO UPDATE SET "
            "access_type = EXCLUDED.access_type, "
            "uc_filter_sql = EXCLUDED.uc_filter_sql, "
            "description = EXCLUDED.description"
        ).format(sql.Identifier(LAKEBASE_SCHEMA, ACCESS_RULES_TABLE))
        self.execute_query(
            query, (uc_table_name, group_name, access_type, uc_filter_sql, description),
        )
        logger.info(
            f"Upserted access rule: {group_name} → {uc_table_name} ({access_type})"
        )

    def get_access_rules(self, uc_table_name: str) -> list[dict]:
        """Return all access rules for a given UC table."""
        query = sql.SQL(
            "SELECT group_name, access_type, uc_filter_sql, description "
            "FROM {} WHERE uc_table_name = %s"
        ).format(sql.Identifier(LAKEBASE_SCHEMA, ACCESS_RULES_TABLE))
        results = self.execute_and_fetch_query(query, (uc_table_name,))
        return [
            {
                "group_name": r[0],
                "access_type": r[1],
                "uc_filter_sql": r[2],
                "description": r[3],
            }
            for r in results
        ]

    # ==================================================================
    # RLS — Sync UC row filters → Lakebase allowed_groups
    # ==================================================================

    def sync_uc_row_filters(self, uc_table_name: str, sql_client) -> int:
        """
        Sync Unity Catalog row filter rules into per-row ``allowed_groups``
        on the Lakebase cache tables.

        For each access rule defined in ``pixels.access_rules``:

        * **full** — add the group to ``allowed_groups`` on every cached row
          for that UC table.
        * **conditional** — query the UC table with ``uc_filter_sql`` to find
          matching SOP Instance UIDs, then add the group only to those rows.

        The sync is **additive**: it only adds groups, never removes them.
        To reset, call ``reset_allowed_groups()`` first.

        Args:
            uc_table_name: Fully qualified UC table (``catalog.schema.table``).
            sql_client: A ``DatabricksSQLClient`` instance (uses service
                principal credentials to bypass UC row filters — the SP must
                have full SELECT on the table).

        Returns:
            Number of Lakebase rows updated.
        """
        rules = self.get_access_rules(uc_table_name)
        if not rules:
            logger.warning(f"sync_uc_row_filters: no rules for {uc_table_name}")
            return 0

        total_updated = 0

        for rule in rules:
            group = rule["group_name"]
            access_type = rule["access_type"]

            if access_type == "full":
                # Grant group to ALL rows for this UC table
                update_query = sql.SQL(
                    "UPDATE {} SET allowed_groups = ARRAY("
                    "  SELECT DISTINCT unnest(allowed_groups || ARRAY[%s])"
                    ") "
                    "WHERE uc_table_name = %s AND NOT (%s = ANY(allowed_groups))"
                ).format(sql.Identifier(LAKEBASE_SCHEMA, INSTANCE_PATHS_TABLE))
                conn = None
                try:
                    conn = self.connection.getconn()
                    with conn.cursor() as cursor:
                        cursor.execute(update_query, (group, uc_table_name, group))
                        updated = cursor.rowcount
                        conn.commit()
                    total_updated += updated
                    logger.info(
                        f"sync: group '{group}' (full) → updated {updated} instance_paths rows"
                    )
                finally:
                    if conn:
                        self.connection.putconn(conn)

                # Same for dicom_frames
                update_query_df = sql.SQL(
                    "UPDATE {} SET allowed_groups = ARRAY("
                    "  SELECT DISTINCT unnest(allowed_groups || ARRAY[%s])"
                    ") "
                    "WHERE uc_table_name = %s AND NOT (%s = ANY(allowed_groups))"
                ).format(sql.Identifier(LAKEBASE_SCHEMA, DICOM_FRAMES_TABLE))
                conn = None
                try:
                    conn = self.connection.getconn()
                    with conn.cursor() as cursor:
                        cursor.execute(update_query_df, (group, uc_table_name, group))
                        updated = cursor.rowcount
                        conn.commit()
                    total_updated += updated
                    logger.info(
                        f"sync: group '{group}' (full) → updated {updated} dicom_frames rows"
                    )
                finally:
                    if conn:
                        self.connection.putconn(conn)

            elif access_type == "conditional" and rule.get("uc_filter_sql"):
                # Query UC to find which SOP Instance UIDs match the condition.
                # NOTE: uc_filter_sql is admin-configured, not user input.
                uc_query = (
                    "SELECT meta:['00080018'].Value[0]::String AS SOPInstanceUID "
                    f"FROM IDENTIFIER(%(pixels_table)s) "
                    f"WHERE {rule['uc_filter_sql']}"
                )
                try:
                    rows = sql_client.execute(
                        uc_query, parameters={"pixels_table": uc_table_name},
                    )
                except Exception as exc:
                    logger.error(
                        f"sync: UC query failed for group '{group}': {exc}"
                    )
                    continue

                sop_uids = [str(r[0]) for r in rows if r and r[0]]
                if not sop_uids:
                    logger.info(f"sync: group '{group}' (conditional) → 0 matching SOP UIDs")
                    continue

                # Batch-update allowed_groups for matching rows
                update_query = sql.SQL(
                    "UPDATE {} SET allowed_groups = ARRAY("
                    "  SELECT DISTINCT unnest(allowed_groups || ARRAY[%s])"
                    ") "
                    "WHERE uc_table_name = %s "
                    "AND sop_instance_uid = ANY(%s) "
                    "AND NOT (%s = ANY(allowed_groups))"
                ).format(sql.Identifier(LAKEBASE_SCHEMA, INSTANCE_PATHS_TABLE))
                conn = None
                try:
                    conn = self.connection.getconn()
                    with conn.cursor() as cursor:
                        cursor.execute(
                            update_query,
                            (group, uc_table_name, sop_uids, group),
                        )
                        updated = cursor.rowcount
                        conn.commit()
                    total_updated += updated
                    logger.info(
                        f"sync: group '{group}' (conditional) → "
                        f"updated {updated}/{len(sop_uids)} instance_paths rows"
                    )
                finally:
                    if conn:
                        self.connection.putconn(conn)

        logger.info(
            f"sync_uc_row_filters complete for {uc_table_name}: "
            f"{total_updated} total rows updated across {len(rules)} rules"
        )
        return total_updated

    def reset_allowed_groups(self, uc_table_name: str):
        """
        Reset ``allowed_groups`` to ``'{}'`` for all rows of a UC table.
        Typically called before a full re-sync.
        """
        for tbl in (INSTANCE_PATHS_TABLE, DICOM_FRAMES_TABLE):
            query = sql.SQL(
                "UPDATE {} SET allowed_groups = '{}' WHERE uc_table_name = %s"
            ).format(sql.Identifier(LAKEBASE_SCHEMA, tbl))
            self.execute_query(query, (uc_table_name,))
        logger.info(f"Reset allowed_groups for {uc_table_name}")
