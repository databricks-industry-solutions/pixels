import configparser
import io
import os

from databricks.sdk import WorkspaceClient
from databricks.sdk.service.compute import ClusterSpec, DataSecurityMode, RuntimeEngine
from databricks.sdk.service.jobs import (
    GitProvider,
    GitSource,
    JobAccessControlRequest,
    JobPermissionLevel,
    NotebookTask,
    RunResultState,
    Source,
    Task,
)

WATCH_DOGS_EMAILS = os.environ.get("WATCH_DOGS_EMAILS", "").split(",")

config = configparser.ConfigParser()
config.read_file(io.StringIO(os.environ["DB_PROFILES"]))
config = config["DEMO"]

os.environ["DATABRICKS_HOST"] = config["host"]
os.environ["DATABRICKS_TOKEN"] = config["token"]

branch = os.getenv("GITHUB_HEAD_REF", "main")
# Create workspace client using host and token
workspace = WorkspaceClient(
    host=os.environ["DATABRICKS_HOST"], token=os.environ["DATABRICKS_TOKEN"]
)

user = workspace.current_user.me().user_name
nodes = [
    node
    for node in workspace.clusters.list_node_types().node_types
    if not node.is_deprecated and node.num_cores == 4.0 and node.is_io_cache_enabled
]
acl = [JobAccessControlRequest(user_name=user, permission_level=JobPermissionLevel.IS_OWNER)]

for watcher in WATCH_DOGS_EMAILS:
    # Check if the watcher is a valid user
    ww_list = list(
        workspace.users.list(
            attributes="id,userName", sort_by="userName", filter=f"userName eq '{watcher}'"
        )
    )
    if len(ww_list) >= 1 and watcher != user:
        acl.append(
            JobAccessControlRequest(
                user_name=watcher,
                permission_level=JobPermissionLevel.CAN_VIEW,
            )
        )

repo_url = "https://github.com/databricks-industry-solutions/pixels.git"

# Define the git source
git_source = GitSource(git_url=repo_url, git_provider=GitProvider.GIT_HUB, git_branch=branch)

# Define the job cluster
cluster_spec = ClusterSpec(
    num_workers=0,
    spark_version="14.3.x-scala2.12",
    node_type_id=nodes[0].node_type_id,
    spark_conf={"spark.master": "local[*, 4]"},
    data_security_mode=DataSecurityMode.SINGLE_USER,
    runtime_engine=RuntimeEngine.STANDARD,
)

# Define the notebook task
notebook_task = NotebookTask(
    notebook_path="pytest_databricks",
    base_parameters={},
    source=Source.GIT,
)

# Define the task
task = Task(task_key="notebook_task", notebook_task=notebook_task, new_cluster=cluster_spec)

# Submit the task
run_response = workspace.jobs.submit_and_wait(
    run_name="pixels_gitaction_test", tasks=[task], git_source=git_source, access_control_list=acl
)

if run_response.state.result_state != RunResultState.SUCCESS:
    raise Exception(f"Job failed with state {run_response.state.result_state}")
