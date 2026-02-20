import os
import threading
import time
import uuid
from datetime import datetime, timedelta

import psycopg2
from databricks.sdk import WorkspaceClient
from databricks.sdk.service.postgres import (
    Branch,
    BranchSpec,
    Endpoint,
    EndpointSpec,
    EndpointStatusState,
    EndpointType,
    Project,
    ProjectSpec,
    Role,
    RoleIdentityType,
    RoleRoleSpec,
)
from psycopg2 import sql
from psycopg2.extras import execute_values
from psycopg2.pool import ThreadedConnectionPool

from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("LakebaseUtils")

# ---------------------------------------------------------------------------
# Defaults — used only when no UC table name is provided.
# When a UC table (catalog.schema.table) is given, the Lakebase database
# is set to the UC catalog and the schema to the UC schema, giving a
# 1-to-1 namespace alignment for Reverse ETL Sync.
# ---------------------------------------------------------------------------
DEFAULT_LAKEBASE_DATABASE = "databricks_postgres"
DEFAULT_LAKEBASE_SCHEMA = "pixels"

DICOM_FRAMES_TABLE = "dicom_frames"
INSTANCE_PATHS_TABLE = "instance_paths"
ACCESS_RULES_TABLE = "access_rules"
USER_GROUPS_TABLE = "user_groups"
ENDPOINT_METRICS_TABLE = "endpoint_metrics"

# Metrics rows older than this are purged on each insert.
_METRICS_RETENTION_HOURS = 24

# ---------------------------------------------------------------------------
# Feature flag — set LAKEBASE_RLS_ENABLED=true to activate Row-Level Security
# ---------------------------------------------------------------------------
RLS_ENABLED: bool = os.getenv("LAKEBASE_RLS_ENABLED", "false").lower() == "true"


def parse_uc_table_name(uc_table_name: str) -> tuple[str, str, str]:
    """
    Parse a fully-qualified Unity Catalog table name into its components.

    Args:
        uc_table_name: Fully-qualified ``catalog.schema.table`` name.

    Returns:
        ``(catalog, schema, table)`` tuple.

    Raises:
        ValueError: If the name does not have exactly 3 dot-separated parts.
    """
    parts = uc_table_name.strip().split(".")
    if len(parts) != 3:
        raise ValueError(
            f"UC table name must be 'catalog.schema.table', got: '{uc_table_name}'"
        )
    return parts[0], parts[1], parts[2]


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
        uc_table_name: str | None = None,
        min_cu: float = 0.5,
        max_cu: float = 2.0,
        branch_name: str = "main",
    ):
        """
        Initialize Lakebase utilities.

        Lakebase has a 3-level namespace that mirrors Unity Catalog::

            Instance  →  Database  →  Schema  →  Table
                         (UC catalog)  (UC schema)

        When ``uc_table_name`` is provided (e.g. ``catalog.schema.table``):

        * **Lakebase database** is set to the UC **catalog** name.
        * **Lakebase schema** is set to the UC **schema** name.
        * **Lakebase instance** remains as configured (not derived from UC).

        This alignment enables Reverse ETL Sync between UC and Lakebase
        with matching database/schema names.

        Args:
            instance_name: Lakebase instance name (the server, not the
                database).  Defaults to ``"pixels-lakebase"``.
            capacity: Lakebase compute capacity.
            user: Databricks username for credentials.
            app_sp_id: Service principal client ID to grant access.
            create_instance: Whether to create the instance if missing.
            min_connections: Minimum pool connections.
            max_connections: Maximum pool connections.
            uc_table_name: Fully-qualified UC table (``catalog.schema.table``).
                Used to derive the Lakebase **database** and **schema**.
                Falls back to ``DATABRICKS_PIXELS_TABLE`` env var, then to
                the built-in defaults.
        """
        # -- Derive Lakebase database + schema from UC table name -----------
        uc_table_name = uc_table_name or os.getenv("DATABRICKS_PIXELS_TABLE")

        if uc_table_name:
            uc_catalog, uc_schema, _ = parse_uc_table_name(uc_table_name)
            self.database = uc_catalog
            self.schema = uc_schema
            logger.info(
                f"Lakebase aligned to UC: database='{self.database}', "
                f"schema='{self.schema}' (from UC table '{uc_table_name}')"
            )
        else:
            self.database = DEFAULT_LAKEBASE_DATABASE
            self.schema = DEFAULT_LAKEBASE_SCHEMA
            logger.info(
                f"No UC table provided — using defaults: "
                f"database='{self.database}', schema='{self.schema}'"
            )

        self.instance_name = instance_name
        self.capacity = capacity
        self.min_cu = min_cu
        self.max_cu = max_cu
        self.branch_name = branch_name
        self.min_connections = min_connections
        self.max_connections = max_connections
        self.workspace_client = WorkspaceClient()

        # Build resource names
        self.project_resource_name = f"projects/{self.instance_name}"
        self.branch_resource_name = f"{self.project_resource_name}/branches/{self.branch_name}"
        self.endpoint_resource_name = f"{self.branch_resource_name}/endpoints/{self.instance_name}"

        if user is None:
            self.user = self.workspace_client.current_user.me().user_name
        else:
            self.user = user

        self.instance = self.get_or_create_db_instance(create_instance)

        if app_sp_id is not None:
            self.get_or_create_sp_role(app_sp_id)

        # Ensure the target database exists before opening the pool
        self._ensure_database_exists()

        self.connection = self.get_connection()

    def get_or_create_db_instance(self, create_instance):
        """
        Get or create the Lakehouse environment (Project, Branch, and Endpoint).
        """
        # 1. Ensure Project exists
        try:
            project = self.workspace_client.postgres.get_project(self.project_resource_name)
            logger.info(f"Lakebase project '{self.instance_name}' exists.")
        except Exception:
            if create_instance:
                logger.info(f"Creating Lakebase project '{self.instance_name}'")
                project = self.workspace_client.postgres.create_project(
                    project_id=self.instance_name, project=Project(spec=ProjectSpec())
                ).result()
            else:
                raise Exception(f"Lakebase project '{self.instance_name}' does not exist")

        # 2. Ensure Branch exists
        try:
            branch = self.workspace_client.postgres.get_branch(self.branch_resource_name)
            logger.info(f"Lakebase branch '{self.branch_name}' exists.")
        except Exception:
            if create_instance:
                logger.info(f"Creating Lakebase branch '{self.branch_name}'")
                branch = self.workspace_client.postgres.create_branch(
                    parent=self.project_resource_name,
                    branch_id=self.branch_name,
                    branch=Branch(spec=BranchSpec(no_expiry=True)),

                )
            else:
                raise Exception(f"Lakebase branch '{self.branch_name}' does not exist")

        # 3. Ensure Endpoint exists
        try:
            endpoint = self.workspace_client.postgres.get_endpoint(self.endpoint_resource_name)
            logger.info(f"Lakebase endpoint '{self.instance_name}' exists.")
        except Exception:
            if create_instance:
                logger.info(f"Creating Lakebase endpoint '{self.instance_name}' with autoscale ({self.min_cu}-{self.max_cu} CU)")
                endpoint = self.workspace_client.postgres.create_endpoint(
                    parent=self.branch_resource_name,
                    endpoint_id=self.instance_name,
                    endpoint=Endpoint(
                        spec=EndpointSpec(
                            endpoint_type=EndpointType.ENDPOINT_TYPE_READ_WRITE,
                            autoscaling_limit_min_cu=self.min_cu,
                            autoscaling_limit_max_cu=self.max_cu,
                        )
                    ),
                )
            else:
                raise Exception(f"Lakebase endpoint '{self.instance_name}' does not exist")

        # Wait for endpoint to be ready (RUNNING or SUSPENDED)
        while endpoint.status.current_state not in [
            EndpointStatusState.ACTIVE,
            EndpointStatusState.IDLE,
        ]:
            endpoint = self.workspace_client.postgres.get_endpoint(self.endpoint_resource_name)
            logger.info(f"Waiting for endpoint to be ready: {endpoint.status.current_state}")
            time.sleep(30)

        logger.info(f"Connection endpoint: {endpoint.status.hosts.host}")
        return endpoint

    def get_or_create_sp_role(self, sp_client_id):
        roles = list(self.workspace_client.postgres.list_roles(self.branch_resource_name) or [])
        existing_role = next((r for r in roles if sp_client_id in r.name), None)

        if existing_role:
            logger.info(
                f"Role for service principal {sp_client_id} already exists in branch {self.branch_name}"
            )
            return existing_role
        else:
            # Create the database instance role for the service principal
            logger.info(
                f"Creating role for service principal {sp_client_id} in branch {self.branch_name}"
            )
            db_role = self.workspace_client.postgres.create_role(
                parent=self.branch_resource_name,
                role_id=sp_client_id,
                role=Role(
                    spec=RoleRoleSpec(
                        identity_type=RoleIdentityType.SERVICE_PRINCIPAL,
                        postgres_role=sp_client_id,
                    )
                ),
            ).result()
            return db_role

    def _generate_credential(self):
        """
        Generate a new database credential token.
        This method is called by the connection pool to refresh credentials.

        Returns:
            dict: Dictionary with 'password' key containing the new token
        """
        cred = self.workspace_client.postgres.generate_database_credential(
            endpoint=self.endpoint_resource_name
        )
        logger.info(f"Generated new database credential for endpoint '{self.instance_name}'")
        return {"password": cred.token}

    def _ensure_database_exists(self):
        """
        Create the target database if it does not already exist.

        ``CREATE DATABASE`` cannot run inside a transaction block, so this
        method opens a **separate, temporary connection** to the default
        ``databricks_postgres`` database with ``autocommit = True``.
        """
        if self.database == DEFAULT_LAKEBASE_DATABASE:
            return  # default database always exists

        host = self.instance.status.hosts.host
        cred = self._generate_credential()

        conn = psycopg2.connect(
            database=DEFAULT_LAKEBASE_DATABASE,
            user=self.user,
            host=host,
            sslmode="require",
            password=cred["password"],
        )
        try:
            conn.autocommit = True  # CREATE DATABASE cannot run in a TX
            with conn.cursor() as cursor:
                cursor.execute(
                    "SELECT 1 FROM pg_database WHERE datname = %s",
                    (self.database,),
                )
                if cursor.fetchone():
                    logger.info(f"Database '{self.database}' already exists")
                else:
                    cursor.execute(
                        sql.SQL("CREATE DATABASE {}").format(
                            sql.Identifier(self.database)
                        )
                    )
                    logger.info(f"Created database '{self.database}'")
        finally:
            conn.close()

    def get_connection(self):
        """
        Create and return a RefreshableThreadedConnectionPool that automatically
        refreshes credentials before they expire.

        Returns:
            RefreshableThreadedConnectionPool: A connection pool with auto-refresh capability
        """
        host = self.instance.status.hosts.host

        # Generate initial credentials
        initial_cred = self._generate_credential()

        db_kwargs = {
            "database": self.database,
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
            f"Created RefreshableThreadedConnectionPool for instance '{self.instance_name}', "
            f"database '{self.database}' with auto-refresh at 55 minutes"
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
        ).format(sql.Identifier(self.schema, table))
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
        ).format(sql.Identifier(self.schema, table))
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
            ).format(table=sql.Identifier(self.schema, table))
            self.execute_query(
                query,
                (filename, frame, start_pos, end_pos, pixel_data_pos, uc_table_name, groups_literal),
            )
        else:
            query = sql.SQL(
                "INSERT INTO {} (filename, frame, start_pos, end_pos, pixel_data_pos, uc_table_name) "
                "VALUES (%s, %s, %s, %s, %s, %s) ON CONFLICT DO NOTHING"
            ).format(sql.Identifier(self.schema, table))
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
            Each dict has: frame_number, start_pos, end_pos, pixel_data_pos,
            and optionally transfer_syntax_uid (from the first row that has it).
        """
        query = sql.SQL(
            "SELECT frame, start_pos, end_pos, pixel_data_pos, transfer_syntax_uid "
            "FROM {} "
            "WHERE filename = %s AND uc_table_name = %s ORDER BY frame"
        ).format(sql.Identifier(self.schema, table))
        results = self.execute_and_fetch_query(
            query, (filename, uc_table_name), user_groups=user_groups,
        )
        if not results:
            return None

        tsuid = None
        for row in results:
            if row[4]:
                tsuid = row[4]
                break

        frames = []
        for row in results:
            entry = {
                "frame_number": int(row[0]),
                "start_pos": int(row[1]),
                "end_pos": int(row[2]),
                "pixel_data_pos": int(row[3]),
            }
            if tsuid:
                entry["transfer_syntax_uid"] = tsuid
            frames.append(entry)
        return frames

    def touch_frame_ranges(
        self,
        filename: str,
        uc_table_name: str,
        table: str = DICOM_FRAMES_TABLE,
    ) -> int:
        """
        Record a BOT cache access: update ``last_used_at`` and increment
        ``access_count`` for all frames of *filename* in one statement.

        Call this every time a file's complete BOT is served from Lakebase
        (i.e. after a successful ``retrieve_all_frame_ranges`` that was
        loaded into the in-memory BOT cache).  The resulting statistics are
        consumed by ``get_preload_priority_list`` on server startup.

        Args:
            filename:      Full path of the DICOM file.
            uc_table_name: Fully qualified UC table name.
            table:         Lakebase table name (default: ``dicom_frames``).

        Returns:
            Number of rows updated (equals the number of frames for the file).
        """
        query = sql.SQL(
            "UPDATE {table} "
            "SET last_used_at = NOW(), access_count = access_count + 1 "
            "WHERE filename = %s AND uc_table_name = %s"
        ).format(table=sql.Identifier(self.schema, table))
        conn = None
        try:
            conn = self.connection.getconn()
            with conn.cursor() as cursor:
                cursor.execute(query, (filename, uc_table_name))
                updated = cursor.rowcount
                conn.commit()
            return updated
        finally:
            if conn:
                self.connection.putconn(conn)

    def get_preload_priority_list(
        self,
        uc_table_name: str,
        limit: int = 10_000,
        table: str = DICOM_FRAMES_TABLE,
    ) -> list[dict]:
        """
        Return files ordered by in-memory preload priority, highest first.

        The priority score is computed entirely in PostgreSQL::

            score = 0.5 × exp(−seconds_since(last_used_at) / 86400)
                  + 0.2 × exp(−seconds_since(inserted_at)  / 604800)
                  + 0.3 × log(1 + access_count)

        * **last_used_at** — most recently served BOT entries score highest
          (1-day half-life).
        * **inserted_at** — recently ingested files receive a mild bonus
          (1-week half-life).
        * **access_count** — frequently accessed files are favoured via
          ``log(1 + n)`` so high counts do not completely dominate.

        Caller responsibility: after consuming the list, use
        ``BOTCache.put_from_lakebase`` to populate the in-memory cache for
        each entry, stopping when the RAM budget is exhausted.

        Args:
            uc_table_name: Fully qualified UC table name.
            limit:         Maximum number of files to return.
            table:         Lakebase table name (default: ``dicom_frames``).

        Returns:
            List of dicts, each with:
            ``filename``, ``frame_count``, ``transfer_syntax_uid``,
            ``last_used_at``, ``inserted_at``, ``access_count``,
            ``priority_score``.
        """
        query = sql.SQL(
            """
            SELECT
                filename,
                COUNT(*)                        AS frame_count,
                MAX(transfer_syntax_uid)        AS transfer_syntax_uid,
                MAX(last_used_at)               AS last_used_at,
                MIN(inserted_at)                AS inserted_at,
                SUM(access_count)               AS access_count,
                (
                  0.5 * EXP(
                    -EXTRACT(EPOCH FROM (
                        NOW() - COALESCE(MAX(last_used_at), NOW() - INTERVAL '30 days')
                    )) / 86400.0
                  )
                + 0.2 * EXP(
                    -EXTRACT(EPOCH FROM (
                        NOW() - COALESCE(MIN(inserted_at), NOW() - INTERVAL '30 days')
                    )) / 604800.0
                  )
                + 0.3 * LOG(1 + SUM(access_count))
                )                               AS priority_score
            FROM {table}
            WHERE uc_table_name = %s
            GROUP BY filename
            ORDER BY priority_score DESC
            LIMIT %s
            """
        ).format(table=sql.Identifier(self.schema, table))

        rows = self.execute_and_fetch_query(query, (uc_table_name, limit))
        return [
            {
                "filename": row[0],
                "frame_count": int(row[1]),
                "transfer_syntax_uid": row[2],
                "last_used_at": row[3],
                "inserted_at": row[4],
                "access_count": int(row[5]),
                "priority_score": float(row[6]),
            }
            for row in rows
        ]

    def touch_frame_ranges_batch(
        self,
        filenames: list[str],
        uc_table_name: str,
        table: str = DICOM_FRAMES_TABLE,
    ) -> int:
        """
        Update ``last_used_at`` and increment ``access_count`` for multiple
        files in a single SQL statement.

        Used after a batch BOT load from Lakebase (e.g. ``_preload_series_bots``)
        to record accesses efficiently without N individual UPDATE calls.

        Args:
            filenames:     List of file paths to touch.
            uc_table_name: Fully qualified UC table name.
            table:         Lakebase table name (default: ``dicom_frames``).

        Returns:
            Number of rows updated.
        """
        if not filenames:
            return 0
        query = sql.SQL(
            "UPDATE {table} "
            "SET last_used_at = NOW(), access_count = access_count + 1 "
            "WHERE filename = ANY(%s) AND uc_table_name = %s"
        ).format(table=sql.Identifier(self.schema, table))
        conn = None
        try:
            conn = self.connection.getconn()
            with conn.cursor() as cursor:
                cursor.execute(query, (filenames, uc_table_name))
                updated = cursor.rowcount
                conn.commit()
            return updated
        finally:
            if conn:
                self.connection.putconn(conn)

    def retrieve_frame_ranges_batch(
        self,
        filenames: list[str],
        uc_table_name: str,
        table: str = DICOM_FRAMES_TABLE,
        user_groups: list[str] | None = None,
    ) -> dict[str, list[dict]]:
        """
        Retrieve cached frame offsets for multiple files in a single query.

        Used during series-level BOT preloading to populate the in-memory
        BOT cache for all instances at once, instead of N individual queries.

        Each file's frame list includes a ``transfer_syntax_uid`` key (on
        every frame dict) when the value is stored in the table.

        Args:
            filenames: Full paths of the DICOM files.
            uc_table_name: Fully qualified Unity Catalog table name.
            table: Lakebase table name (default: dicom_frames).
            user_groups: User's Databricks groups for RLS enforcement.

        Returns:
            ``{filename: [frame_dicts]}`` for files that have cached data.
            Files not in the cache are omitted from the result.
        """
        if not filenames:
            return {}

        placeholders = sql.SQL(", ").join([sql.Placeholder()] * len(filenames))
        query = sql.SQL(
            "SELECT filename, frame, start_pos, end_pos, pixel_data_pos, "
            "transfer_syntax_uid "
            "FROM {table} "
            "WHERE filename IN ({placeholders}) AND uc_table_name = %s "
            "ORDER BY filename, frame"
        ).format(
            table=sql.Identifier(self.schema, table),
            placeholders=placeholders,
        )
        params = tuple(filenames) + (uc_table_name,)
        results = self.execute_and_fetch_query(
            query, params, user_groups=user_groups,
        )

        if not results:
            return {}

        # Group rows by filename and resolve per-file transfer_syntax_uid
        raw_batch: dict[str, list[tuple]] = {}
        for row in results:
            fn = row[0]
            if fn not in raw_batch:
                raw_batch[fn] = []
            raw_batch[fn].append(row)

        batch: dict[str, list[dict]] = {}
        for fn, rows in raw_batch.items():
            tsuid = None
            for r in rows:
                if r[5]:
                    tsuid = r[5]
                    break
            frames = []
            for r in rows:
                entry = {
                    "frame_number": int(r[1]),
                    "start_pos": int(r[2]),
                    "end_pos": int(r[3]),
                    "pixel_data_pos": int(r[4]),
                }
                if tsuid:
                    entry["transfer_syntax_uid"] = tsuid
                frames.append(entry)
            batch[fn] = frames
        return batch

    def insert_frame_ranges(
        self,
        filename: str,
        frame_ranges: list[dict],
        uc_table_name: str,
        transfer_syntax_uid: str | None = None,
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
                    transfer_syntax_uid,
                    groups_literal,
                ]
                for frame_range in frame_ranges
            ]
            query = sql.SQL(
                "INSERT INTO {table} (filename, frame, start_pos, end_pos, "
                "pixel_data_pos, uc_table_name, transfer_syntax_uid, allowed_groups) "
                "VALUES %s "
                "ON CONFLICT (filename, frame, uc_table_name) DO UPDATE SET "
                "transfer_syntax_uid = COALESCE(EXCLUDED.transfer_syntax_uid, "
                "  {table}.transfer_syntax_uid), "
                "allowed_groups = ARRAY("
                "  SELECT DISTINCT unnest("
                "    {table}.allowed_groups || EXCLUDED.allowed_groups"
                "  )"
                ")"
            ).format(table=sql.Identifier(self.schema, table))
        else:
            records = [
                [
                    filename,
                    str(frame_range.get("frame_number")),
                    str(frame_range.get("start_pos")),
                    str(frame_range.get("end_pos")),
                    str(frame_range.get("pixel_data_pos")),
                    uc_table_name,
                    transfer_syntax_uid,
                ]
                for frame_range in frame_ranges
            ]
            query = sql.SQL(
                "INSERT INTO {} (filename, frame, start_pos, end_pos, "
                "pixel_data_pos, uc_table_name, transfer_syntax_uid) "
                "VALUES %s ON CONFLICT DO NOTHING"
            ).format(sql.Identifier(self.schema, table))
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
        study_instance_uid: str,
        series_instance_uid: str,
        sop_instance_uid: str,
        uc_table_name: str,
        table: str = INSTANCE_PATHS_TABLE,
        user_groups: list[str] | None = None,
    ) -> dict | None:
        """
        Look up a single instance path by the full DICOM UID hierarchy
        (Study / Series / SOP Instance UID) and UC table name.

        When RLS is enabled the query runs inside a transaction with
        ``SET LOCAL app.user_groups`` so that only rows the user is
        authorized to see are returned.

        Returns:
            Dict with ``local_path``, ``num_frames``, ``study_instance_uid``,
            ``series_instance_uid`` — or ``None`` if not cached / not allowed.
        """
        query = sql.SQL(
            "SELECT local_path, num_frames, study_instance_uid, series_instance_uid "
            "FROM {} "
            "WHERE sop_instance_uid = %s "
            "AND study_instance_uid = %s "
            "AND series_instance_uid = %s "
            "AND uc_table_name = %s"
        ).format(sql.Identifier(self.schema, table))
        results = self.execute_and_fetch_query(
            query,
            (sop_instance_uid, study_instance_uid, series_instance_uid, uc_table_name),
            user_groups=user_groups,
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
        ).format(sql.Identifier(self.schema, table))
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
                "ON CONFLICT (sop_instance_uid, study_instance_uid, "
                "series_instance_uid, uc_table_name) DO UPDATE SET "
                "allowed_groups = ARRAY("
                "  SELECT DISTINCT unnest("
                "    {table}.allowed_groups || EXCLUDED.allowed_groups"
                "  )"
                ")"
            ).format(table=sql.Identifier(self.schema, table))
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
            ).format(sql.Identifier(self.schema, table))

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


    def insert_metrics(self, source: str, metrics: dict):
        """Insert a metrics snapshot and purge rows older than the retention window."""
        import json as _json

        query = sql.SQL(
            "INSERT INTO {} (source, recorded_at, metrics) "
            "VALUES (%s, NOW(), %s) "
            "ON CONFLICT (source, recorded_at) DO UPDATE SET metrics = EXCLUDED.metrics"
        ).format(sql.Identifier(self.schema, ENDPOINT_METRICS_TABLE))
        purge = sql.SQL(
            "DELETE FROM {} WHERE recorded_at < NOW() - INTERVAL '%s hours'"
        ).format(sql.Identifier(self.schema, ENDPOINT_METRICS_TABLE))

        conn = None
        try:
            conn = self.connection.getconn()
            with conn.cursor() as cursor:
                cursor.execute(query, (source, _json.dumps(metrics)))
                cursor.execute(purge, (_METRICS_RETENTION_HOURS,))
                conn.commit()
        except Exception:
            if conn:
                try:
                    conn.rollback()
                except Exception:
                    pass
            raise
        finally:
            if conn:
                self.connection.putconn(conn)

    def get_latest_metrics(
        self,
        source: str | None = None,
        limit: int = 60,
    ) -> list[dict]:
        """Return the most recent metrics rows, optionally filtered by source.

        Each returned dict contains ``source``, ``recorded_at`` (ISO string),
        and ``metrics`` (the original JSONB payload).
        """
        if source:
            query = sql.SQL(
                "SELECT source, recorded_at, metrics FROM {} "
                "WHERE source = %s "
                "ORDER BY recorded_at DESC LIMIT %s"
            ).format(sql.Identifier(self.schema, ENDPOINT_METRICS_TABLE))
            params = (source, limit)
        else:
            query = sql.SQL(
                "SELECT source, recorded_at, metrics FROM {} "
                "ORDER BY recorded_at DESC LIMIT %s"
            ).format(sql.Identifier(self.schema, ENDPOINT_METRICS_TABLE))
            params = (limit,)

        rows = self.execute_and_fetch_query(query, params)
        results = []
        for row in rows:
            m = row[2] if isinstance(row[2], dict) else {}
            results.append({
                "source": row[0],
                "recorded_at": row[1].isoformat() if hasattr(row[1], "isoformat") else str(row[1]),
                "metrics": m,
            })
        return results

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
        ).format(sql.Identifier(self.schema, USER_GROUPS_TABLE))
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
        ).format(sql.Identifier(self.schema, USER_GROUPS_TABLE))

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
        ).format(sql.Identifier(self.schema, ACCESS_RULES_TABLE))
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
        ).format(sql.Identifier(self.schema, ACCESS_RULES_TABLE))
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
                ).format(sql.Identifier(self.schema, INSTANCE_PATHS_TABLE))
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
                ).format(sql.Identifier(self.schema, DICOM_FRAMES_TABLE))
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
                ).format(sql.Identifier(self.schema, INSTANCE_PATHS_TABLE))
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
            ).format(sql.Identifier(self.schema, tbl))
            self.execute_query(query, (uc_table_name,))
        logger.info(f"Reset allowed_groups for {uc_table_name}")
