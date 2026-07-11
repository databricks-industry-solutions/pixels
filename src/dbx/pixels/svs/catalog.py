"""SVSCatalog — extends the base Catalog for Aperio SVS whole-slide images.

Overrides:
    - catalog() defaults to pattern='*.svs'
    - init_tables() calls super().init_tables() then executes SVS-specific DDL
      (CREATE_SVS_CATALOG.sql creates object_catalog_redaction)
"""

from __future__ import annotations

from dbx.pixels.catalog import Catalog


class SVSCatalog(Catalog):
    """Object catalog for Aperio SVS whole-slide images.

    Extends :class:`dbx.pixels.Catalog` with SVS-specific defaults:
    - ``catalog()`` uses ``pattern='*.svs'``
    - ``init_tables()`` also creates the ``object_catalog_redaction`` table
      via ``CREATE_SVS_CATALOG.sql``

    Args:
        spark: Active SparkSession.
        table: Fully qualified UC table name (e.g. ``douglas_moore.pathology.object_catalog``).
        volume: Fully qualified UC volume name (e.g. ``douglas_moore.pathology.pixels_volume``).
    """

    def __init__(self, spark, table: str, volume: str):
        super().__init__(spark, table=table, volume=volume)

    def init_tables(self):
        """Create base tables via parent, then run SVS-specific DDL."""
        # Base DDL creates object_catalog
        super().init_tables()

        # SVS-specific: create object_catalog_redaction
        from pathlib import Path

        sql_path = Path(__file__).parent / "resources" / "sql"

        try:
            sql_files = {
                p.name: p.read_text()
                for p in sql_path.iterdir()
                if p.suffix == ".sql" and p.is_file()
            }
        except (PermissionError, OSError):
            # Serverless may block non-Python file reads; fall back to SDK
            from databricks.sdk import WorkspaceClient

            ws_path = str(sql_path)
            sql_files = {}
            w = WorkspaceClient()
            for obj in w.workspace.list(ws_path):
                if obj.path and obj.path.endswith(".sql"):
                    name = obj.path.rsplit("/", 1)[-1]
                    with w.workspace.download(obj.path) as f:
                        sql_files[name] = f.read().decode("utf-8")

        for file_name, content in sql_files.items():
            sql_commands = content.replace("{UC_TABLE}", self._table).replace(
                "{UC_SCHEMA}", self._schema
            )
            for sql_command in sql_commands.split(";"):
                if sql_command.strip():
                    self._spark.sql(sql_command)

    def catalog(self, path: str, pattern: str = "*.svs", **kwargs):
        """Catalog SVS files at the given path.

        Delegates to :meth:`Catalog.catalog` with ``pattern='*.svs'`` default.
        All other keyword arguments are forwarded unchanged.
        """
        return super().catalog(path, pattern=pattern, **kwargs)
