import os

def get_connection():
    from databricks.sdk import WorkspaceClient
    import uuid

    import psycopg
    import string
    from psycopg_pool import ConnectionPool

    w = WorkspaceClient()

    class CustomConnection(psycopg.Connection):
        global w
        def __init__(self, *args, **kwargs):
            # Call the parent class constructor
            super().__init__(*args, **kwargs)

        @classmethod
        def connect(cls, conninfo='', **kwargs):
            # Append the new password to kwargs
            instance = w.database.get_database_instance(name=instance_name)
            cred = w.database.generate_database_credential(request_id=str(uuid.uuid4()), instance_names=[host])
            kwargs['password'] = cred.token

            # Call the superclass's connect method with updated kwargs
            return super().connect(conninfo, **kwargs)

    username = w.current_user.me().user_name
    instance_name = os.getenv("LAKEBASE_INSTANCE") #"pixels-lakebase"
    instance = w.database.get_database_instance(name=instance_name)
    host = instance.read_write_dns
    port = 5432
    database = "databricks_postgres"

    pool = ConnectionPool(
        conninfo=f"dbname={database} user={username} host={host}",

        connection_class=CustomConnection,
        min_size=1,
        max_size=10,
        open=True
    )

    return pool

def execute_and_fetch_query(pool, query):
    with pool.connection() as conn:
        with conn.cursor() as cursor:
            return cursor.execute(query).fetchall()
        
def execute_query(pool, query):
    with pool.connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(query)
