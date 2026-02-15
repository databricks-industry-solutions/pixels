# Databricks notebook source
# MAGIC %md
# MAGIC ### Create STOW-RS Processor Job
# MAGIC
# MAGIC Creates a **serverless performance-optimized** Spark job that processes STOW-RS uploads.
# MAGIC
# MAGIC The DICOMweb app streams each STOW-RS request to a temp file on Volumes
# MAGIC and inserts a tracking row into `stow_operations`.  This job reads new
# MAGIC rows via Change Data Feed, splits multipart bundles, extracts DICOMs,
# MAGIC and registers them in the catalog.
# MAGIC
# MAGIC **Run this after** `07-OHIF-Lakehouse-App` has deployed the DICOMweb app.
# MAGIC
# MAGIC What this notebook does:
# MAGIC 1. Creates the `stow_operations` Delta table (if not exists)
# MAGIC 2. Creates the `<app_name>_stow_processor` job (if not exists)
# MAGIC 3. Grants the app's service principal access to the STOW table and job

# COMMAND ----------

# MAGIC %pip install --upgrade databricks-sdk==0.60.0 -q
# MAGIC dbutils.library.restartPython()

# COMMAND ----------

# MAGIC %run ./config/proxy_prep

# COMMAND ----------

# MAGIC %md
# MAGIC # Parameters

# COMMAND ----------

sql_warehouse_id, table, volume = init_widgets(show_volume=True)
init_env()

app_name = "pixels-dicomweb"
w = WorkspaceClient()

# COMMAND ----------

# MAGIC %md
# MAGIC # Derive Names and Paths

# COMMAND ----------

_parts = table.split(".")
assert len(_parts) == 3, "table must be catalog.schema.table"
_uc_catalog = _parts[0]
_uc_schema = _parts[1]
_uc_table = _parts[2]

stow_table = f"{_uc_catalog}.{_uc_schema}.stow_operations"

# Volume UC name (e.g. main.pixels_solacc.pixels_volume)
_vol_parts = volume.split(".")
assert len(_vol_parts) == 3, "volume must be catalog.schema.volume_name"
volume_path = f"/Volumes/{_vol_parts[0]}/{_vol_parts[1]}/{_vol_parts[2]}"

# Job name follows the convention used by the handler's _resolve_stow_job_id()
job_name = f"{app_name}_stow_processor"

# Notebook path — derive from the current notebook's workspace location
_notebook_path = (
    dbutils.notebook.entry_point
    .getDbutils().notebook().getContext()
    .notebookPath().get()
)
_base_path = _notebook_path.rsplit("/", 1)[0]
stow_notebook_path = f"{_base_path}/workflow/stow_ingest"

print(f"App name            : {app_name}")
print(f"Job name            : {job_name}")
print(f"Catalog table       : {table}")
print(f"STOW tracking table : {stow_table}")
print(f"Volume              : {volume}")
print(f"Volume path         : {volume_path}")
print(f"Notebook path       : {stow_notebook_path}")

# COMMAND ----------

# MAGIC %md
# MAGIC # Create `stow_operations` Table
# MAGIC
# MAGIC The DDL is in `resources/sql/CREATE_STOW_OPERATIONS.sql`.
# MAGIC `Catalog.init_tables()` also executes it, but we ensure it exists before
# MAGIC creating the job.

# COMMAND ----------

import dbx.pixels
from pathlib import Path

_sql_path = Path(dbx.pixels.__file__).parent / "resources" / "sql" / "CREATE_STOW_OPERATIONS.sql"

with open(_sql_path, "r") as f:
    ddl = f.read().replace("{UC_SCHEMA}", f"{_uc_catalog}.{_uc_schema}")

spark.sql(ddl)
print(f"✓ Table {stow_table} ready")

# COMMAND ----------

# MAGIC %md
# MAGIC # Create Serverless Performance-Optimized Job (if not exists)
# MAGIC
# MAGIC The job:
# MAGIC - Runs `workflow/stow_ingest` (a thin notebook that calls `StowProcessor`)
# MAGIC - Uses **serverless performance-optimized** compute (`disable_auto_optimization=False`)
# MAGIC - Allows `max_concurrent_runs = 2` (1 running + 1 queued) for run coalescing
# MAGIC - Default parameters match the widgets — the DICOMweb handler overrides
# MAGIC   them via `notebook_params` in `run-now`

# COMMAND ----------

from databricks.sdk.service.jobs import (
    Task,
    NotebookTask,
    Source,
    JobEnvironment,
    JobParameterDefinition,
    JobAccessControlRequest,
    JobPermissionLevel,
)
from databricks.sdk.service.compute import Environment

existing_jobs = [j for j in w.jobs.list(name=job_name)]

if existing_jobs:
    job_id = existing_jobs[0].job_id
    print(f"Job '{job_name}' already exists (job_id: {job_id})")
else:
    created = w.jobs.create(
        name=job_name,
        tasks=[
            Task(
                task_key="stow_ingest",
                notebook_task=NotebookTask(
                    notebook_path=stow_notebook_path,
                    source=Source.WORKSPACE,
                ),
                environment_key="default",
                disable_auto_optimization=False,  # serverless performance-optimized
            )
        ],
        environments=[
            JobEnvironment(
                environment_key="default",
                spec=Environment(
                    client="1",
                    dependencies=[
                        "databricks-pixels @ git+https://github.com/databricks-industry-solutions/pixels@features/dicom_web_integration",
                    ],
                ),
            )
        ],
        max_concurrent_runs=1,
        tags={"app": app_name, "purpose": "stow_processor"},
        parameters=[
            JobParameterDefinition(name="catalog_table", default=table),
            JobParameterDefinition(name="volume", default=volume),
        ],
    )
    job_id = created.job_id
    print(f"✓ Created job '{job_name}' (job_id: {job_id})")
    print(f"  Notebook : {stow_notebook_path}")
    print(f"  Compute  : serverless performance-optimized")

# COMMAND ----------

# MAGIC %md
# MAGIC # Grant Permissions
# MAGIC
# MAGIC The DICOMweb app's service principal needs:
# MAGIC - `ALL_PRIVILEGES` on `stow_operations` (INSERT from handler, MERGE from job)
# MAGIC - `CAN_MANAGE_RUN` on the job (to trigger `run-now`)

# COMMAND ----------

from databricks.sdk.service import catalog as catalog_svc

app_instance = w.apps.get(app_name)
service_principal_id = app_instance.service_principal_client_id

# ── UC grant on stow_operations table ─────────────────────────────────
w.grants.update(
    full_name=stow_table,
    securable_type="table",
    changes=[
        catalog_svc.PermissionsChange(
            add=[catalog_svc.Privilege.ALL_PRIVILEGES],
            principal=service_principal_id,
        )
    ],
)
print(f"✓ Granted ALL_PRIVILEGES on {stow_table} to SP {service_principal_id}")

# ── Job permission — allow the app SP to trigger runs ──────────────────
w.jobs.set_permissions(
    job_id=str(job_id),
    access_control_list=[
        JobAccessControlRequest(
            service_principal_name=service_principal_id,
            permission_level=JobPermissionLevel.CAN_MANAGE_RUN,
        )
    ],
)
print(f"✓ Granted CAN_MANAGE_RUN on job {job_id} to SP {service_principal_id}")

# COMMAND ----------

# MAGIC %md
# MAGIC # Done
# MAGIC
# MAGIC The STOW-RS pipeline is ready:
# MAGIC
# MAGIC 1. **DICOMweb app** streams uploads → temp file on Volumes + tracking row in `stow_operations`
# MAGIC 2. **App triggers** `run-now` on `<app_name>_stow_processor` (with run coalescing)
# MAGIC 3. **This job** reads new rows via CDF, splits bundles, extracts DICOMs, registers in catalog
# MAGIC
# MAGIC To test manually:
# MAGIC ```
# MAGIC w.jobs.run_now(job_id=<JOB_ID>, notebook_params={"catalog_table": "<table>", "volume": "<volume>"})
# MAGIC ```

# COMMAND ----------

print(f"✅ STOW-RS processor setup complete")
print(f"   Job name : {job_name}")
print(f"   Job ID   : {job_id}")
print(f"   Table    : {stow_table}")
print(f"   App SP   : {service_principal_id}")

