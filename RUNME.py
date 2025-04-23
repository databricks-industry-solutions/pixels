# Databricks notebook source
# MAGIC %md 
# MAGIC # Solution Accelerator Deployment
# MAGIC This notebook sets up clusters, a multi-task job (workflow), and applies ACLs. 🎉

# COMMAND ----------

# DBTITLE 0,Install util packages
# MAGIC %pip install --quiet git+https://github.com/databricks-academy/dbacademy@v1.0.13 git+https://github.com/databricks-industry-solutions/notebook-solution-companion@serverless databricks-sdk

# COMMAND ----------

from solacc.companion import NotebookSolutionCompanion
from databricks.sdk import WorkspaceClient
from databricks.sdk.service.jobs import JobAccessControlRequest, JobPermissionLevel

# COMMAND ----------

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
                "notebook_path": f"00-README"
            },
            "task_key": "00-README"
        },
        {
            "notebook_task": {
                "notebook_path": f"01-dcm-demo"
            },
            "task_key": "01-dcm-demo",
            "depends_on": [{"task_key": "00-README"}]
        },
        {
            "notebook_task": {
                "notebook_path": f"07-OHIF-Lakehouse-App"
            },
            "task_key": "07-OHIF-Lakehouse-App",
            "depends_on": [{"task_key": "01-dcm-demo"}]
        }
    ],
    "parameters": [
        {"name": "table", "default": "main.pixels_solacc.object_catalog"},
        {"name": "volume", "default": "main.pixels_solacc.pixels_volume"}
    ]
}

# COMMAND ----------

# Set up widget to control job execution
dbutils.widgets.dropdown("run_job", "False", ["True", "False"])
run_job = dbutils.widgets.get("run_job") == "True"

# COMMAND ----------

# Deploy the job and get job_id
print("Deploying job...")
job_id = NotebookSolutionCompanion().deploy_compute(job_json, run_job=run_job)
print(f"Job deployed with job_id: {job_id}")

# COMMAND ----------

# Apply group-based ACL (CAN_VIEW to "users")
print("Applying group permissions...")
w = WorkspaceClient()
w.jobs.update_access_control(
    job_id=job_id,
    access_control_list=[
        JobAccessControlRequest(
            group_name="users",
            permission_level=JobPermissionLevel.CAN_MANAGE
        )
    ]
)
print(f"Granted CAN_VIEW to group 'users' on job {job_id}")

# COMMAND ----------
