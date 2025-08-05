import configparser
import io
import logging
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

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

WATCH_DOGS_EMAILS = os.environ.get("WATCH_DOGS_EMAILS", "").split(",")

# Log initial environment state
logger.info("Checking environment variables...")
logger.info(f"DATABRICKS_HOST set: {'DATABRICKS_HOST' in os.environ}")
logger.info(f"DATABRICKS_TOKEN set: {'DATABRICKS_TOKEN' in os.environ}")
logger.info(f"DB_PROFILES set: {'DB_PROFILES' in os.environ}")

host = os.environ.get("DATABRICKS_HOST")
token = os.environ.get("DATABRICKS_TOKEN")

# Try to get credentials from DB_PROFILES first
if "DB_PROFILES" in os.environ:
    logger.info("Found DB_PROFILES, attempting to parse...")
    try:
        config = configparser.ConfigParser()
        config.read_file(io.StringIO(os.environ["DB_PROFILES"]))
        config = config["DEMO"]
        host = config["host"]
        token = config["token"]
        logger.info("Successfully parsed DB_PROFILES and set credentials")
    except Exception as e:
        logger.error(f"Error parsing DB_PROFILES: {str(e)}")
        raise

if not host or not token:
    raise ValueError("No credentials found in either environment variables or DB_PROFILES")

# Verify credentials
logger.info(f"Using Databricks host: {host}")
logger.info(f"Token length: {len(token) if token else 0}")

# Get branch name from environment
branch = os.getenv("GITHUB_HEAD_REF") or os.getenv("GITHUB_REF_NAME", "main")
logger.info(f"Using git branch: {branch}")

# Create workspace client using explicit credentials
try:
    workspace = WorkspaceClient(host=host, token=token)
    logger.info("Successfully created WorkspaceClient")
except Exception as e:
    logger.error(f"Failed to create WorkspaceClient: {str(e)}")
    raise

try:
    user = workspace.current_user.me().user_name
    logger.info(f"Successfully authenticated as user: {user}")
except Exception as e:
    logger.error("Failed to get current user")
    logger.error(f"Error: {str(e)}")
    raise

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
