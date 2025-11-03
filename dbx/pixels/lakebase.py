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
from psycopg2.extras import execute_values
from psycopg2.pool import ThreadedConnectionPool

from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("LakebaseUtils")

DICOM_FRAMES_TABLE = "dicom_frames"


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
    def __init__(
        self,
        instance_name="pixels-lakebase",
        capacity="CU_2",
        user=None,
        app_sp_id=None,
        create_instance=False,
    ):
        self.instance_name = instance_name
        self.capacity = capacity
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
            minconn=1,
            maxconn=32,
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

    def execute_and_fetch_query(self, query: str, params: tuple = None) -> list[tuple]:
        conn = None
        try:
            conn = self.connection.getconn()
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                return cursor.fetchall()
        finally:
            if conn:
                self.connection.putconn(conn)

    def execute_query(self, query: str, params: tuple = None):
        conn = None
        try:
            conn = self.connection.getconn()
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                conn.commit()
        finally:
            if conn:
                self.connection.putconn(conn)

    def retrieve_frame_range(
        self, filename: str, frame: int, table: str = DICOM_FRAMES_TABLE
    ) -> dict | None:
        results = self.execute_and_fetch_query(
            f"SELECT start_pos, end_pos, pixel_data_pos FROM {table} where filename = %s and frame = %s",
            (filename, frame),
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
        self, filename: str, param_frames: int, table: str = DICOM_FRAMES_TABLE
    ) -> dict | None:
        results = self.execute_and_fetch_query(
            f"SELECT max(frame), max(start_pos) FROM {table} where filename = %s and frame <= %s",
            (filename, param_frames),
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
        table: str = DICOM_FRAMES_TABLE,
    ):
        self.execute_query(
            f"INSERT INTO {table} (filename, frame, start_pos, end_pos, pixel_data_pos) VALUES (%s, %s, %s, %s, %s) ON CONFLICT DO NOTHING",
            (filename, frame, start_pos, end_pos, pixel_data_pos),
        )

    def insert_frame_ranges(
        self, filename: str, frame_ranges: list[dict], table: str = DICOM_FRAMES_TABLE
    ):
        conn = None
        records = [
            [
                filename,
                str(frame_range.get("frame_number")),
                str(frame_range.get("start_pos")),
                str(frame_range.get("end_pos")),
                str(frame_range.get("pixel_data_pos")),
            ]
            for frame_range in frame_ranges
        ]
        try:
            conn = self.connection.getconn()
            with conn.cursor() as cursor:
                execute_values(
                    cursor,
                    f"INSERT INTO {table} (filename, frame, start_pos, end_pos, pixel_data_pos) VALUES %s ON CONFLICT DO NOTHING",
                    records,
                )
                conn.commit()
        finally:
            if conn:
                self.connection.putconn(conn)
