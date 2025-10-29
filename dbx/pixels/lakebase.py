import time

from databricks.sdk import WorkspaceClient
from databricks.sdk.service.database import (
    DatabaseInstance,
    DatabaseInstanceRole,
    DatabaseInstanceRoleIdentityType,
    DatabaseInstanceState,
)
from psycopg2.extras import execute_values
from psycopg2.pool import SimpleConnectionPool

from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("LakebaseUtils")

DICOM_FRAMES_TABLE = "dicom_frames"


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

    def get_connection(self):
        import uuid

        host = self.instance.read_write_dns
        database = "databricks_postgres"
        cred = self.workspace_client.database.generate_database_credential(
            request_id=str(uuid.uuid4()), instance_names=[self.instance_name]
        )

        db_kwargs = {
            "database": database,
            "user": self.user,
            "host": host,
            "sslmode": "require",
            "password": cred.token,
        }

        pool = SimpleConnectionPool(minconn=1, maxconn=10, **db_kwargs)

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
