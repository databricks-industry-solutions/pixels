import os
import time

from databricks.sdk import WorkspaceClient
from databricks.sdk.service.database import DatabaseInstance, DatabaseInstanceRole, DatabaseInstanceRoleIdentityType, DatabaseInstanceState

class LakebaseUtils():
    def __init__(self, instance_name="pixels-lakebase", capacity = "CU_2", user = None, app_sp_id = None):
        self.instance_name = instance_name
        self.capacity = capacity
        self.workspace_client = WorkspaceClient()

        if user is None:
            self.user = self.workspace_client.current_user.me().user_name
        else:
            self.user = user

        self.instance = self.get_or_create_db_instance()

        if app_sp_id is not None:
            self.get_or_create_sp_role(app_sp_id)

        self.connection = self.get_connection()
        
    def get_or_create_db_instance(self):
        instances = list(self.workspace_client.database.list_database_instances() or [])
        db_exists = any(inst.name == self.instance_name for inst in instances)

        if db_exists:
            print(f"Lakebase instance '{self.instance_name}' already exists.")
            instance = next(inst for inst in instances if inst.name == self.instance_name)
        else:
            print(f"Creating Lakebase instance '{self.instance_name}'")
            instance = self.workspace_client.database.create_database_instance(
                DatabaseInstance(
                    name=self.instance_name,
                    capacity=self.capacity
                )
            )
            print(f"Created Lakebase instance: {instance.name}")

        while instance.state == DatabaseInstanceState.STARTING:
            instance = self.workspace_client.database.get_database_instance(name=self.instance_name)
            print(f"Waiting for instance to be ready: {instance.state}")
            time.sleep(30)

            
        print(f"Connection endpoint: {instance.read_write_dns}")

        return instance

    def get_or_create_sp_role(self, sp_client_id):
        role = DatabaseInstanceRole(
            name=sp_client_id,
            identity_type=DatabaseInstanceRoleIdentityType.SERVICE_PRINCIPAL
        )

        db_roles = list(self.workspace_client.database.list_database_instance_roles(self.instance_name) or [])
        db_role = any(dbrole.name == sp_client_id for dbrole in db_roles)

        if db_role:
            print(f"Role for service principal {sp_client_id} already exists in instance {self.instance_name}")
        else:
            # Create the database instance role for the service principal
            db_role = self.workspace_client.database.create_database_instance_role(instance_name=self.instance_name, database_instance_role=role)
            print(f"Created role for service principal {sp_client_id} in instance {self.instance_name}")

        return db_role

    def get_connection(self):
        import uuid

        import psycopg
        import string
        from psycopg_pool import ConnectionPool

        class CustomConnection(psycopg.Connection):
            global w
            def __init__(self, *args, **kwargs):
                # Call the parent class constructor
                super().__init__(*args, **kwargs)

            @classmethod
            def connect(cls, conninfo='', **kwargs):
                # Append the new password to kwargs
                cred = self.workspace_client.database.generate_database_credential(request_id=str(uuid.uuid4()), instance_names=[host])
                kwargs['password'] = cred.token

                # Call the superclass's connect method with updated kwargs
                return super().connect(conninfo, **kwargs)

        host = self.instance.read_write_dns
        port = 5432
        database = "databricks_postgres"

        pool = ConnectionPool(
            conninfo=f"dbname={database} user={self.user} host={host}",
            connection_class=CustomConnection,
            min_size=1,
            max_size=10,
            open=True
        )

        return pool.connection

    def execute_and_fetch_query(self, query):
        with self.connection() as conn:
            with conn.cursor() as cursor:
                return cursor.execute(query).fetchall()
            
    def execute_query(self, query):
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
