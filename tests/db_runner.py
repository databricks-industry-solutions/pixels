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


def debug_token(token):
    """Safely debug a token without exposing it"""
    if not token:
        return "NOT SET"
    return f"Set (length: {len(token)}, starts with: {token[:4]}...)"


# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

WATCH_DOGS_EMAILS = os.environ.get("WATCH_DOGS_EMAILS", "").split(",")

# Detailed environment debugging
logger.info("=== Environment Variable Details ===")
logger.info(f"DATABRICKS_HOST value: {os.environ.get('DATABRICKS_HOST', 'NOT SET')}")
logger.info(f"DATABRICKS_TOKEN: {debug_token(os.environ.get('DATABRICKS_TOKEN'))}")
logger.info(f"DB_PROFILES exists: {'DB_PROFILES' in os.environ}")
if "DB_PROFILES" in os.environ:
    logger.info(f"DB_PROFILES length: {len(os.environ['DB_PROFILES'])}")

# Prioritize environment variables over DB_PROFILES
host = os.environ.get("DATABRICKS_HOST")
token = os.environ.get("DATABRICKS_TOKEN")

if host and token:
    logger.info("Using credentials from environment variables")
    logger.info(f"Environment Host: {host}")
    logger.info(f"Environment Token: {debug_token(token)}")
elif "DB_PROFILES" in os.environ:
    logger.info("Using credentials from DB_PROFILES")
    try:
        config = configparser.ConfigParser()
        config.read_file(io.StringIO(os.environ["DB_PROFILES"]))
        config = config["DEMO"]
        host = config["host"]
        token = config["token"]
        logger.info("Successfully parsed DB_PROFILES")
        logger.info(f"DB_PROFILES Host: {host}")
        logger.info(f"DB_PROFILES Token: {debug_token(token)}")
    except Exception as e:
        logger.error(f"Error parsing DB_PROFILES: {str(e)}")
        raise
else:
    raise ValueError("No credentials found in either environment variables or DB_PROFILES")

# Clean up host URL - remove trailing slash if present
host = host.rstrip("/")
logger.info("\n=== Final Credential State ===")
logger.info(f"Final Host: {host}")
logger.info(f"Final Token: {debug_token(token)}")

# Get branch name from environment
branch = os.getenv("GITHUB_HEAD_REF") or os.getenv("GITHUB_REF_NAME", "main")
logger.info(f"Using git branch: {branch}")

# Test token format
if not token or len(token) < 30:  # PATs are typically longer than this
    logger.error("Token appears to be invalid (too short or empty)")
    raise ValueError("Invalid token format")

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

logger.info("=== Setting up test job ===")
logger.info("Fetching available node types...")
nodes = [
    node
    for node in workspace.clusters.list_node_types().node_types
    if not node.is_deprecated and node.num_cores == 4.0 and node.is_io_cache_enabled
]
if not nodes:
    raise ValueError("No suitable node types found")
logger.info(f"Selected node type: {nodes[0].node_type_id}")

logger.info("Setting up access control...")
acl = [JobAccessControlRequest(user_name=user, permission_level=JobPermissionLevel.IS_OWNER)]

for watcher in WATCH_DOGS_EMAILS:
    logger.info(f"Checking watcher: {watcher}")
    # Check if the watcher is a valid user
    ww_list = list(
        workspace.users.list(
            attributes="id,userName", sort_by="userName", filter=f"userName eq '{watcher}'"
        )
    )
    if len(ww_list) >= 1 and watcher != user:
        logger.info(f"Adding watcher {watcher} to ACL")
        acl.append(
            JobAccessControlRequest(
                user_name=watcher,
                permission_level=JobPermissionLevel.CAN_VIEW,
            )
        )

repo_url = "https://github.com/databricks-industry-solutions/pixels.git"
logger.info(f"Using repository: {repo_url} branch: {branch}")

# Define the git source
git_source = GitSource(git_url=repo_url, git_provider=GitProvider.GIT_HUB, git_branch=branch)

# Define the job cluster
logger.info("Configuring cluster...")
cluster_spec = ClusterSpec(
    num_workers=0,
    spark_version="14.3.x-scala2.12",
    node_type_id=nodes[0].node_type_id,
    spark_conf={"spark.master": "local[*, 4]"},
    data_security_mode=DataSecurityMode.SINGLE_USER,
    runtime_engine=RuntimeEngine.STANDARD,
)

# Define the notebook task
logger.info("Setting up notebook task...")
notebook_task = NotebookTask(
    notebook_path="pytest_databricks",
    base_parameters={},
    source=Source.GIT,
)

# Define the task
task = Task(task_key="notebook_task", notebook_task=notebook_task, new_cluster=cluster_spec)

# Submit the task
logger.info("=== Submitting job ===")
run_response = workspace.jobs.submit_and_wait(
    run_name="pixels_gitaction_test",
    tasks=[task],
    git_source=git_source,
    access_control_list=acl,
)

# Get the run URL
run_id = run_response.run_id
workspace_url = host.rstrip("/")
job_url = f"{workspace_url}#job/{run_response.job_id}/run/{run_id}"
logger.info(f"Job run URL: {job_url}")

if run_response.state.result_state != RunResultState.SUCCESS:
    logger.error(f"Job failed with state {run_response.state.result_state}")
    if run_response.state.state_message:
        logger.error(f"Error message: {run_response.state.state_message}")
    raise Exception(f"Job failed with state {run_response.state.result_state}")

logger.info("=== Job completed successfully ===")
