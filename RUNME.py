# Databricks notebook source
# MAGIC %md 
# MAGIC # Solution Accelerator Deployment
# MAGIC This notebook sets up clusters, a multi-task job (workflow), and applies ACLs.

# COMMAND ----------

# DBTITLE 0,Install packages with SDK version check
# MAGIC %pip install --quiet git+https://github.com/databricks-academy/dbacademy@v1.0.13 \
# MAGIC git+https://github.com/databricks-industry-solutions/notebook-solution-companion@serverless \
# MAGIC databricks-sdk --upgrade --force-reinstall

# COMMAND ----------

# MAGIC %run ./_resources/00-setup $reset_all_data=false

# COMMAND ----------

from solacc.companion import NotebookSolutionCompanion
from databricks.sdk import WorkspaceClient

# -- Version compatibility handling --
try:
    # Strategy 1: New SDK structure (>= 0.21.0)
    from databricks.sdk.service.jobs import JobPermissionLevel, JobAccessControlRequest
    CAN_MANAGE = JobPermissionLevel.CAN_MANAGE
except ImportError:
    try:
        # Strategy 2: Access via module (transitional versions)
        from databricks.sdk.service import jobs
        CAN_MANAGE = jobs.JobPermissionLevel.CAN_MANAGE
        JobAccessControlRequest = jobs.JobAccessControlRequest
    except AttributeError:
        try:
            # Strategy 3: Old SDK names (< 0.15.0)
            from databricks.sdk.service.jobs import PermissionLevel, JobAccessControlRequest
            CAN_MANAGE = PermissionLevel.CAN_MANAGE
        except ImportError:
            # Final fallback: Use strings (not recommended)
            CAN_MANAGE = "CAN_MANAGE"
            class JobAccessControlRequest(dict): 
                """Fallback class for ACL entries"""
                pass

# Verify SDK version
import databricks.sdk
print(f"Using Databricks SDK version: {databricks.sdk.__version__}")
print(f"Permission level resolved to: {CAN_MANAGE}")

# COMMAND ----------

# Define job configuration with ACLs
job_json = {
    "timeout_seconds": 7200,
    "max_concurrent_runs": 1,
    "tags": {
        "usage": "solacc_testing",
        "group": "HLS",
        "accelerator": "pixels"
    },
    "tasks": [
        {
            "notebook_task": {
                "notebook_path": "00-README"
            },
            "task_key": "00-README"
        },
        {
            "notebook_task": {
                "notebook_path": "01-dcm-demo"
            },
            "task_key": "01-dcm-demo",
            "depends_on": [{"task_key": "00-README"}]
        },
        {
            "notebook_task": {
                "notebook_path": "07-OHIF-Lakehouse-App"
            },
            "task_key": "07-OHIF-Lakehouse-App",
            "depends_on": [{"task_key": "01-dcm-demo"}]
        }
    ],
    "parameters": [
        {"name": "table", "default": "main.pixels_solacc.object_catalog"},
        {"name": "volume", "default": "main.pixels_solacc.pixels_volume"}
    ],
    "access_control_list": [
        JobAccessControlRequest(
            group_name="users",
            permission_level=CAN_MANAGE
        )
    ]
}

# COMMAND ----------

# Set up widget to control job execution
dbutils.widgets.dropdown("run_job", "False", ["True", "False"])
run_job = dbutils.widgets.get("run_job") == "True"

# COMMAND ----------

# Deploy the job and get job_id
print("Deploying job...")
companion = NotebookSolutionCompanion()
job_id = companion.deploy_compute(job_json, run_job=run_job)
print(f"Job deployed with job_id: {job_id}")

# Verify permissions
if hasattr(companion, 'w') and isinstance(companion.w, WorkspaceClient):
    try:
        print("Current job permissions:")
        print(companion.w.jobs.get_permission_levels(job_id=job_id))
    except Exception as e:
        print(f"Permission check failed: {str(e)}")
#