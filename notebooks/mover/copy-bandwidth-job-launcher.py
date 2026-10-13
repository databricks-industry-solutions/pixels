# Databricks notebook source
# /// script
# [tool.databricks.environment]
# environment_version = "5"
# ///
# DBTITLE 1,Copy Bandwidth Job Launcher
# MAGIC %md
# MAGIC # Copy Bandwidth Job Launcher
# MAGIC
# MAGIC This notebook creates (or updates) a Databricks job that runs **N parallel copy tasks** to test bandwidth.
# MAGIC
# MAGIC Each task executes the same notebook on its own single-worker cluster drawn from the specified instance pool.
# MAGIC
# MAGIC ## Parameters
# MAGIC | Parameter | Description | Default |
# MAGIC |-----------|-------------|---------|
# MAGIC | `pool_id` | Instance pool ID for task clusters | *(required)* |
# MAGIC | `notebook_path` | Notebook each task will execute | *(required)* |
# MAGIC | `num_tasks` | Number of parallel tasks (cp1…cpN) | 4 |
# MAGIC | `job_name` | Name of the job to create/update | copy-performance |
# MAGIC | `spark_version` | Spark version key; blank = auto-detect latest LTS | *(auto)* |

# COMMAND ----------

dbutils.widgets.text("pool_id", "", "Pool ID")
dbutils.widgets.text("notebook_path", "", "Notebook Path")
dbutils.widgets.text("num_tasks", "16", "Number of Tasks")
dbutils.widgets.text("job_name", "copy-performance", "Job Name")
dbutils.widgets.text("spark_version", "", "Spark Version (blank=auto LTS)")

pool_id = dbutils.widgets.get("pool_id")
notebook_path = dbutils.widgets.get("notebook_path")
num_tasks = int(dbutils.widgets.get("num_tasks"))
job_name = dbutils.widgets.get("job_name")
spark_version = dbutils.widgets.get("spark_version")

# COMMAND ----------

# DBTITLE 1,Parameters


assert pool_id, "pool_id is required"
assert notebook_path, "notebook_path is required"
assert num_tasks > 0, "num_tasks must be > 0"

print(f"Pool: {pool_id}")
print(f"Notebook: {notebook_path}")
print(f"Tasks: {num_tasks}")
print(f"Job name: {job_name}")
print(f"Spark version: {spark_version or '(auto-detect LTS)'}")

# COMMAND ----------

# DBTITLE 1,Create/Update and Run Job
from databricks.sdk import WorkspaceClient
from databricks.sdk.service.compute import ClusterSpec, AutoScale, DataSecurityMode, RuntimeEngine, Kind
from databricks.sdk.service.jobs import (
    Task,
    NotebookTask,
    JobCluster,
)
import json

w = WorkspaceClient()

# --- Auto-detect latest LTS if spark_version is blank ---
if not spark_version:
    versions = w.clusters.spark_versions()
    lts_versions = [
        v for v in versions.versions
        if "LTS" in v.name and "ML" not in v.name and "Photon" not in v.name and "GPU" not in v.name
    ]
    # Sort by name descending to get the latest
    lts_versions.sort(key=lambda v: v.name, reverse=True)
    spark_version = lts_versions[0].key if lts_versions else versions.versions[0].key
    print(f"Auto-detected Spark version: {spark_version}")

# --- Build job cluster definitions (one per task for isolation) ---
job_clusters = []
tasks = []

for i in range(1, num_tasks + 1):
    cluster_key = f"cluster_cp{i}"
    job_clusters.append(
        JobCluster(
            job_cluster_key=cluster_key,
            new_cluster=ClusterSpec(
                instance_pool_id=pool_id,
                is_single_node=True,
                kind=Kind.CLASSIC_PREVIEW,
                data_security_mode=DataSecurityMode.DATA_SECURITY_MODE_DEDICATED,
                runtime_engine=RuntimeEngine.STANDARD,
                spark_version=spark_version,
            ),
        )
    )

    tasks.append(
        Task(
            task_key=f"cp{i}",
            notebook_task=NotebookTask(notebook_path=notebook_path),
            job_cluster_key=cluster_key,
            max_retries=0,
        )
    )

# --- Job settings ---
job_settings = dict(
    name=job_name,
    tasks=tasks,
    job_clusters=job_clusters,
    max_concurrent_runs=1,
    format="MULTI_TASK",
)
job_settings

# COMMAND ----------

# DBTITLE 1,Create or Update Job

from databricks.sdk.service.jobs import JobSettings, Format

# SDK requires Format enum, not plain string
settings = {**job_settings, "format": Format(job_settings["format"])} #AI keeps flopping back and forth on this.

# --- Create or Update ---
existing_jobs = list(w.jobs.list(name=job_name))

if existing_jobs:
    job_id = existing_jobs[0].job_id
    w.jobs.reset(job_id=job_id, new_settings=JobSettings(**settings))
    print(f"Updated existing job: {job_id}")
else:
    created = w.jobs.create(**settings)
    job_id = created.job_id
    print(f"Created new job: {job_id}")


# COMMAND ----------


# --- Trigger the job ---
run = w.jobs.run_now(job_id=job_id)
host = dbutils.notebook.entry_point.getDbutils().notebook().getContext().browserHostName().get()
run_url = f"https://{host}/jobs/{job_id}/runs/{run.run_id}"
print(f"\nJob triggered! Run ID: {run.run_id}")
print(f"Run URL: {run_url}")
