# Databricks notebook source
# /// script
# [tool.databricks.environment]
# base_environment = "databricks_ai_v4"
# environment_version = "4"
# ///
# MAGIC %md
# MAGIC # Introduction
# MAGIC
# MAGIC This notebook is designed to install the MONAILabel_Pixels and databricks-sdk libraries. It provides the necessary instructions to install these libraries using the `%pip` command and restart the Python library using `dbutils.library.restartPython()`.
# MAGIC
# MAGIC # MONAILabel
# MAGIC
# MAGIC MONAILabel is a framework for creating interactive and customizable annotation workflows for medical imaging data. It provides a user-friendly interface for annotating medical images and supports various annotation tasks such as segmentation, classification, etc.
# MAGIC
# MAGIC # Integration with OHIF Viewer:
# MAGIC
# MAGIC MONAILabel can be integrated with the OHIF Viewer to provide a seamless annotation experience. The OHIF Viewer is a web-based medical image viewer that allows users to view, annotate, and analyze medical images. By integrating MONAILabel with the OHIF Viewer, users can leverage the advanced annotation capabilities of MONAILabel directly within the viewer interface. This integration enables efficient and accurate annotation of medical images, enhancing the overall workflow for medical image analysis and research.

# COMMAND ----------

# DBTITLE 1,Install MONAILabel_Pixels and databricks-sdk
# MAGIC %pip install /Workspace/Users/emanuele.rinaldi@databricks.com/pixels/monailabel_model/artifacts/monailabel-0.8.5-py3-none-any.whl databricks-sdk SimpleITK fastapi uvicorn httpx --upgrade -q
# MAGIC dbutils.library.restartPython()

# COMMAND ----------

# MAGIC %run ./config/proxy_prep

# COMMAND ----------

init_widgets()
init_env()

# COMMAND ----------

# DBTITLE 1,Configuration
import os
import subprocess
import threading
import asyncio
import json
import shutil

# ---------------------------------------------------------------------------
# Configuration Parameters (edit these as needed)
# ---------------------------------------------------------------------------
MONAI_VOLUME_PATH = "/Volumes/serverless_lh10u9_catalog/pixels_solacc/pixels_volume/monai"
MONAI_APP_PATH = f"{MONAI_VOLUME_PATH}/apps/radiology"
MONAI_MODELS = "segmentation"
MONAI_TABLE = os.environ.get("DATABRICKS_PIXELS_TABLE", "")
MONAI_STUDIES_URL = os.environ.get("DATABRICKS_HOST", "")

# Local copy of the radiology app (avoids FUSE 'Illegal seek' errors
# from TensorBoard, RotatingFileHandler, and model checkpoint I/O)
MONAI_APP_LOCAL_PATH = "/tmp/monai_apps/radiology"

# OHIF Viewer
OHIF_PORT = 8001
MONAI_PORT = 8000  # MONAILabel server default port
DICOMWEB_GATEWAY_BASE = "https://pixels-dicomweb-gateway-7474654130285494.aws.databricksapps.com"

# ---------------------------------------------------------------------------
# Training Configuration Defaults
# ---------------------------------------------------------------------------
# These defaults are injected into every training request sent to MONAILabel.
# They map 1:1 to MONAILabel BasicTrainTask._config keys.
# The OHIF UI only exposes a subset; this is where you set the rest.
# Any value here can be overridden by the request body from the UI.
# ---------------------------------------------------------------------------
MONAI_TRAIN_DEFAULTS = {
    # ── Run identity ──────────────────────────────────────────────────
    "name": "train_01",

    # ── Model / weights ───────────────────────────────────────────────
    "pretrained": True,

    # ── Hardware ──────────────────────────────────────────────────────
    "device": "cuda",
    "multi_gpu": True,
    "gpus": "all",

    # ── Training hyper-parameters ─────────────────────────────────────
    "max_epochs": 50,
    "early_stop_patience": -1,        # -1 = disabled
    "val_split": 0.2,
    "train_batch_size": 1,
    "val_batch_size": 1,

    # ── Data pipeline ─────────────────────────────────────────────────
    "dataset": "SmartCacheDataset",   # SmartCacheDataset | CacheDataset | PersistentDataset | Dataset
    "dataloader": "ThreadDataLoader", # ThreadDataLoader | DataLoader

    # ── MLflow tracking (Databricks) ──────────────────────────────────
    "tracking": "mlflow",
    "tracking_uri": "databricks",     # "databricks" uses the workspace's managed MLflow
    "tracking_experiment_name": "",    # empty = auto-generated from model name
}

# The MLflow experiment name can be customised per-model at runtime.
# When left empty, MONAILabel defaults to the model name.
# To pin it, set e.g.:
#   MONAI_TRAIN_DEFAULTS["tracking_experiment_name"] = "/Users/you@databricks.com/monai_training"

# COMMAND ----------

# DBTITLE 1,MONAILabel Server Address Generation in Databricks
import os.path
from pathlib import Path
import dbx.pixels.resources
import dbx.pixels.version as dbx_pixels_version

workspace_id = get_context().workspaceId
cluster_id = get_context().clusterId

path = Path(dbx.pixels.__file__).parent
ohif_path = f"{path}/resources/ohif"

# Generate OHIF app-config with workspace-specific URLs
with open(f"{ohif_path}/app-config.js", "r") as config_input:
    with open(f"{ohif_path}/app-config-custom.js", "w") as config_custom:
        config_custom.write(
            config_input.read()
            .replace("{ROUTER_BASENAME}", f"/driver-proxy/o/{workspace_id}/{cluster_id}/{OHIF_PORT}/")
            .replace("{PIXELS_TABLE}", os.environ["DATABRICKS_PIXELS_TABLE"])
            .replace("{DICOMWEB_ROOT}", f"/driver-proxy/o/{workspace_id}/{cluster_id}/{OHIF_PORT}/dicomweb")
            .replace("{DEFAULT_DATA_SOURCE}", "pixelsdicomweb")
        )

displayHTML(f"""
<h2>🏥 MONAILabel Server Address</h2>
<p><code>{get_proxy_url()}</code></p>
<h2>🖼️ OHIF Viewer</h2>
<p><a href='{get_proxy_url(OHIF_PORT)}'>{get_proxy_url(OHIF_PORT)}</a></p>
""")

# COMMAND ----------

# MAGIC %md
# MAGIC ###Download the radiology app in the cluster
# MAGIC
# MAGIC The following command will download the radiology app from the MONAILabel github and saves it in the cluster

# COMMAND ----------

# DBTITLE 1,Downloading Radiology Apps with MonaiLabel
result = subprocess.run(
    ["monailabel", "apps", "--download", "--name", "radiology", "--output", f"{MONAI_VOLUME_PATH}/apps/"],
    capture_output=True, text=True
)
print(result.stdout)
if result.returncode != 0:
    print(f"Error: {result.stderr}")

# COMMAND ----------

# DBTITLE 1,Define OHIF Viewer and server functions
# MAGIC %md
# MAGIC ### Define OHIF Viewer Application and Server Functions
# MAGIC
# MAGIC The following cell defines:
# MAGIC 1. **OHIF Viewer** — a FastAPI reverse-proxy application for DICOMweb, SQL Warehouse, and file access
# MAGIC 2. **`start_monailabel_server()`** — launches the MONAILabel server as a subprocess
# MAGIC 3. **`start_ohif_server()`** — launches the OHIF Viewer via uvicorn
# MAGIC
# MAGIC Both servers are designed to run **in parallel** using Python threads.

# COMMAND ----------

# DBTITLE 1,Monailabel Radiology Segmentation
import httpx
import uvicorn
import logging
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from starlette.requests import Request
from starlette.responses import StreamingResponse, JSONResponse, Response
from starlette.background import BackgroundTask
from starlette.exceptions import HTTPException as StarletteHTTPException

# ---------------------------------------------------------------------------
# Helper: get audience token for DICOMweb gateway authentication
# ---------------------------------------------------------------------------
def get_audience_token(app_name="pixels-dicomweb-gateway"):
    from databricks.sdk import WorkspaceClient
    import requests
    w = WorkspaceClient()
    app_client_id = w.apps.get(app_name).oauth2_app_client_id
    workspace_url = w.config.host
    url = f"{workspace_url}/oidc/v1/token"
    notebook_token = (
        dbutils.notebook.entry_point.getDbutils()
        .notebook().getContext().apiToken().get()
    )
    data = {
        "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange",
        "subject_token": notebook_token,
        "subject_token_type": "urn:databricks:params:oauth:token-type:personal-access-token",
        "requested_token_type": "urn:ietf:params:oauth:token-type:access_token",
        "scope": "all-apis",
        "audience": app_client_id,
    }
    response = requests.post(url=url, data=data)
    return response.json()["access_token"]

# ---------------------------------------------------------------------------
# OHIF Viewer: FastAPI Application
# ---------------------------------------------------------------------------
ohif_app = FastAPI(title="Pixels")

async def _reverse_proxy_dicomweb(request: Request):
    client = httpx.AsyncClient(base_url=DICOMWEB_GATEWAY_BASE, timeout=httpx.Timeout(120))
    remote_path = request.path_params.get("path", "")
    target_url = f"/api/dicomweb/{remote_path}"
    if request.url.query:
        target_url += f"?{request.url.query}"
    body = await request.body() if request.method in ("POST", "PUT") else None
    fwd_headers = {
        k: v for k, v in request.headers.items()
        if k.lower() not in ("host", "transfer-encoding")
    }
    user_token = get_audience_token()
    if user_token:
        fwd_headers["authorization"] = f"Bearer {user_token}"
        fwd_headers["x-forwarded-access-token"] = user_token
        fwd_headers["X-Forwarded-Email"] = (
            dbutils.notebook.entry_point.getDbutils()
            .notebook().getContext().userName().get()
        )
    fwd_headers["user-agent"] = (
        f"DatabricksPixels/{dbx_pixels_version.__version__}/dicomweb_client"
    )
    # Inject pixels_table cookie so the gateway knows which table to query
    pixels_cookie = f"pixels_table={MONAI_TABLE}"
    existing_cookies = fwd_headers.get("cookie", "")
    fwd_headers["cookie"] = f"{existing_cookies}; {pixels_cookie}" if existing_cookies else pixels_cookie

    rp_req = client.build_request(request.method, target_url, headers=fwd_headers, content=body)
    rp_resp = await client.send(rp_req, stream=True)
    resp_headers = {
        k: v for k, v in rp_resp.headers.items()
        if k.lower() not in ("content-encoding", "transfer-encoding")
    }
    async def _cleanup():
        await rp_resp.aclose()
        await client.aclose()
    return StreamingResponse(
        rp_resp.aiter_raw(), status_code=rp_resp.status_code,
        headers=resp_headers, background=BackgroundTask(_cleanup),
    )

async def _reverse_proxy_statements(request: Request):
    client = httpx.AsyncClient(base_url=os.environ["DATABRICKS_HOST"], timeout=httpx.Timeout(30))
    url = httpx.URL(path=request.url.path.replace("/sqlwarehouse/", ""))
    if request.method == "POST":
        body = await request.json()
        body["warehouse_id"] = os.environ["DATABRICKS_WAREHOUSE_ID"]
    else:
        body = {}
    rp_req = client.build_request(
        request.method, url,
        headers={"Authorization": f"Bearer {os.environ['DATABRICKS_TOKEN']}"},
        content=json.dumps(body).encode("utf-8"),
    )
    rp_resp = await client.send(rp_req, stream=True)
    return StreamingResponse(
        rp_resp.aiter_raw(), status_code=rp_resp.status_code,
        headers=rp_resp.headers, background=BackgroundTask(rp_resp.aclose),
    )

async def _reverse_proxy_files(request: Request):
    client = httpx.AsyncClient(base_url=os.environ["DATABRICKS_HOST"], timeout=httpx.Timeout(30))
    url = httpx.URL(path=request.url.path.replace("/sqlwarehouse/", ""))
    rp_req = client.build_request(
        request.method, url,
        headers={"Authorization": f"Bearer {os.environ['DATABRICKS_TOKEN']}"},
        content=request.stream(),
    )
    rp_resp = await client.send(rp_req, stream=True)
    return StreamingResponse(
        rp_resp.aiter_raw(), status_code=rp_resp.status_code,
        headers=rp_resp.headers, background=BackgroundTask(rp_resp.aclose),
    )

class DBStaticFiles(StaticFiles):
    """Static files handler that injects a `pixels_table` cookie on HTML responses.
    
    The cookie tells the DICOMweb gateway which Unity Catalog table to read from.
    The value is read from the MONAI_TABLE global at request time so it stays
    in sync with the notebook's `table` widget parameter.
    """
    async def get_response(self, path: str, scope):
        try:
            response = await super().get_response(path, scope)
        except (HTTPException, StarletteHTTPException) as ex:
            if ex.status_code == 404:
                response = await super().get_response("index.html", scope)
            else:
                raise ex
        # Inject pixels_table cookie on HTML pages so the gateway knows which table to query
        content_type = response.headers.get("content-type", "")
        if "text/html" in content_type:
            response.set_cookie(key="pixels_table", value=MONAI_TABLE, path="/")
        return response

# ---------------------------------------------------------------------------
# MONAILabel training proxy — intercepts training requests from the OHIF UI,
# injects the full config (MONAI_TRAIN_DEFAULTS) including MLflow/Databricks
# tracking, and forwards to the MONAILabel server on localhost.
#
# Supports:
#   POST /train/{model}        — train a specific model
#   GET  /train/               — poll training status
#   DELETE /train/             — stop a running training
# ---------------------------------------------------------------------------
async def _reverse_proxy_monai_train(request: Request):
    """Proxy GET/DELETE /train/ → MONAILabel for status and stop."""
    client = httpx.AsyncClient(
        base_url=f"http://127.0.0.1:{MONAI_PORT}", timeout=httpx.Timeout(30)
    )
    target_url = request.url.path  # already starts with /train/
    rp_req = client.build_request(request.method, target_url)
    rp_resp = await client.send(rp_req, stream=True)
    return StreamingResponse(
        rp_resp.aiter_raw(),
        status_code=rp_resp.status_code,
        headers=dict(rp_resp.headers),
        background=BackgroundTask(rp_resp.aclose),
    )

async def _reverse_proxy_monai_train_post(request: Request):
    """Intercept POST /train/{model}, inject training config, forward to MONAILabel."""
    import copy

    model = request.path_params.get("path", "")
    body = {}
    try:
        body = await request.json()
    except Exception:
        pass  # empty body is fine — we have defaults

    # Start from our full defaults, then overlay anything the UI sent.
    # This ensures every BasicTrainTask._config key is explicitly set.
    train_params = copy.deepcopy(MONAI_TRAIN_DEFAULTS)
    if isinstance(body, dict):
        # The UI may send {model_name: {params}} or flat {params}
        ui_params = body.get(model, body) if model in body else body
        train_params.update(ui_params)

    # Always inject the pixels table so MONAILabel can find study data
    train_params["pixels_table"] = MONAI_TABLE

    # If the user left tracking_experiment_name empty, generate one from
    # the pixels table name so experiments are easy to find in the workspace.
    if not train_params.get("tracking_experiment_name"):
        safe_table = MONAI_TABLE.replace(".", "_") if MONAI_TABLE else "monai"
        train_params["tracking_experiment_name"] = f"monai_training_{safe_table}"

    # Ensure MLflow can authenticate to Databricks when running inside the
    # MONAILabel subprocess.  These env vars are already set by proxy_prep /
    # init_env(), but we surface them explicitly for clarity.
    for env_key in ("DATABRICKS_HOST", "DATABRICKS_TOKEN", "MLFLOW_TRACKING_URI"):
        if env_key not in os.environ and env_key == "MLFLOW_TRACKING_URI":
            os.environ["MLFLOW_TRACKING_URI"] = "databricks"

    # Build the payload that MONAILabel POST /train/{model} expects.
    # params dict is keyed by model name.
    payload = {model: train_params} if model else train_params

    print(f"[TrainProxy] Forwarding training request for model='{model}'")
    print(f"[TrainProxy] Config: {json.dumps(train_params, indent=2, default=str)}")

    client = httpx.AsyncClient(
        base_url=f"http://127.0.0.1:{MONAI_PORT}", timeout=httpx.Timeout(600)
    )
    target_url = f"/train/{model}" if model else "/train/"
    rp_req = client.build_request(
        "POST", target_url,
        content=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    rp_resp = await client.send(rp_req, stream=True)
    return StreamingResponse(
        rp_resp.aiter_raw(),
        status_code=rp_resp.status_code,
        headers=dict(rp_resp.headers),
        background=BackgroundTask(rp_resp.aclose),
    )

# Register routes (order matters — static mount must be last)
ohif_app.add_route("/dicomweb/{path:path}", _reverse_proxy_dicomweb, ["GET", "POST", "PUT", "DELETE", "OPTIONS"])
ohif_app.add_route("/sqlwarehouse/api/2.0/sql/statements/{path:path}", _reverse_proxy_statements, ["POST", "GET"])
ohif_app.add_route("/sqlwarehouse/api/2.0/fs/files/{path:path}", _reverse_proxy_files, ["GET", "PUT"])
ohif_app.add_route("/train/{path:path}", _reverse_proxy_monai_train_post, ["POST"])
ohif_app.add_route("/train/{path:path}", _reverse_proxy_monai_train, ["GET", "DELETE"])
ohif_app.mount("/", DBStaticFiles(directory=ohif_path, html=True), name="ohif")

# ---------------------------------------------------------------------------
# Logging configs
# ---------------------------------------------------------------------------

# OHIF server thread: passed to uvicorn.Config(log_config=...) so uvicorn's
# configure_logging() sets up file handlers from the start (avoids ZMQ crash).
_OHIF_LOG_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s [%(name)s] %(levelname)s: %(message)s",
        },
    },
    "handlers": {
        "file": {
            "class": "logging.FileHandler",
            "filename": "/tmp/ohif_uvicorn.log",
            "mode": "a",
            "formatter": "default",
        },
    },
    "loggers": {
        "uvicorn":        {"handlers": ["file"], "level": "INFO",    "propagate": False},
        "uvicorn.error":  {"handlers": ["file"], "level": "INFO",    "propagate": False},
        "uvicorn.access": {"handlers": ["file"], "level": "INFO",    "propagate": False},
        "asyncio":        {"handlers": ["file"], "level": "WARNING", "propagate": False},
    },
}

# MONAILabel subprocess: uses FileHandler instead of RotatingFileHandler.
# RotatingFileHandler.shouldRollover() calls stream.seek() which fails on
# Unity Catalog Volumes (FUSE) with "OSError: Illegal seek".
# Passing --log_config skips MONAILabel's default init_log_config().
_MONAI_LOG_CONFIG_PATH = "/tmp/monailabel_log_config.json"
_monai_log_config = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s [%(process)d] [%(threadName)s] [%(levelname)s] (%(name)s:%(lineno)d) - %(message)s",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "default",
            "stream": "ext://sys.stdout",
        },
        "file": {
            "class": "logging.FileHandler",
            "filename": "/tmp/monailabel.log",
            "mode": "a",
            "formatter": "default",
        },
    },
    "root": {
        "level": "INFO",
        "handlers": ["console", "file"],
    },
    "loggers": {
        "monailabel":     {"level": "INFO",    "handlers": ["console", "file"], "propagate": False},
        "uvicorn":        {"level": "INFO",    "handlers": ["console", "file"], "propagate": False},
        "uvicorn.access": {"level": "INFO",    "handlers": ["console", "file"], "propagate": False},
        "uvicorn.error":  {"level": "INFO",    "handlers": ["console", "file"], "propagate": False},
    },
}
with open(_MONAI_LOG_CONFIG_PATH, "w") as f:
    json.dump(_monai_log_config, f)

# ---------------------------------------------------------------------------
# Server state tracking — used by stop_servers() for graceful cleanup
# ---------------------------------------------------------------------------
_server_state = {
    "ohif_server": None,       # uvicorn.Server instance
    "ohif_loop": None,         # asyncio event loop running in the thread
    "monai_process": None,     # subprocess.Popen for MONAILabel
    "monai_thread": None,      # Thread running MONAILabel
    "ohif_thread": None,       # Thread running OHIF
}

def stop_servers():
    """Gracefully stop any servers started by a previous start_servers() call."""
    import time

    # Stop OHIF uvicorn server via its should_exit flag
    srv = _server_state.get("ohif_server")
    if srv is not None:
        srv.should_exit = True
        print("[cleanup] Signalled OHIF uvicorn server to shut down")

    # Stop MONAILabel subprocess
    proc = _server_state.get("monai_process")
    if proc is not None and proc.poll() is None:
        proc.terminate()
        try:
            proc.wait(timeout=5)
            print("[cleanup] MONAILabel process terminated gracefully")
        except subprocess.TimeoutExpired:
            proc.kill()
            proc.wait()
            print("[cleanup] MONAILabel process killed after timeout")

    # Wait for threads to finish
    for key in ("ohif_thread", "monai_thread"):
        t = _server_state.get(key)
        if t is not None and t.is_alive():
            t.join(timeout=5)

    # Reset state
    for k in _server_state:
        _server_state[k] = None

    time.sleep(1)  # brief pause so the OS fully releases sockets
    print("[cleanup] All servers stopped")

# ---------------------------------------------------------------------------
# Helper: copy radiology app from Volume to local disk
# ---------------------------------------------------------------------------
def _prepare_local_app():
    """Copy the radiology app from UC Volume (FUSE) to local disk (/tmp).
    
    FUSE does not support seek(), which breaks:
      - RotatingFileHandler (logging)
      - TensorBoard event file writer (training)
      - Any file I/O that uses seek/append
    
    By running the app from /tmp, all writes go to local disk.
    """
    if os.path.exists(MONAI_APP_LOCAL_PATH):
        shutil.rmtree(MONAI_APP_LOCAL_PATH)
    print(f"[setup] Copying app from {MONAI_APP_PATH} -> {MONAI_APP_LOCAL_PATH} ...")
    shutil.copytree(MONAI_APP_PATH, MONAI_APP_LOCAL_PATH)
    print(f"[setup] App copied to local disk ({MONAI_APP_LOCAL_PATH})")

# ---------------------------------------------------------------------------
# Server launcher functions
# ---------------------------------------------------------------------------
def start_monailabel_server(app_path, studies_url, table, models="segmentation", labels=None, use_pretrained=True):
    """Start MONAILabel server as a subprocess.

    Passes --log_config to override MONAILabel's default init_log_config()
    which uses RotatingFileHandler (fails on FUSE with 'Illegal seek').

    Sets MLFLOW_TRACKING_URI=databricks in the subprocess environment so
    that MONAILabel's MLFlowHandler logs metrics/artifacts to the
    Databricks-managed MLflow workspace (requires DATABRICKS_HOST and
    DATABRICKS_TOKEN already in the environment).
    """
    # Build environment for the subprocess: inherit everything, ensure
    # MLflow can talk to Databricks.
    env = os.environ.copy()
    env.setdefault("MLFLOW_TRACKING_URI", "databricks")

    cmd = [
        "monailabel", "start_server",
        "--app", app_path,
        "--studies", studies_url,
        "--conf", "models", models,
        "--table", table,
        "--log_config", _MONAI_LOG_CONFIG_PATH,
    ]
    if labels:
        cmd.extend(["--conf", "labels", labels])
    if not use_pretrained:
        cmd.extend(["--conf", "use_pretrained_model", "false"])

    print(f"[MONAILabel] Starting with command: {' '.join(cmd)}")
    print(f"[MONAILabel] MLFLOW_TRACKING_URI={env.get('MLFLOW_TRACKING_URI')}")
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, env=env)
    _server_state["monai_process"] = process
    for line in iter(process.stdout.readline, b""):
        print(f"[MONAILabel] {line.decode().strip()}")
    process.wait()

def start_ohif_server():
    """Start OHIF Viewer uvicorn server.
    
    Uses _OHIF_LOG_CONFIG passed to uvicorn.Config so that uvicorn's
    own configure_logging() sets up file handlers from the start.
    This prevents ZMQ IOStream crashes from the background thread.
    """
    config = uvicorn.Config(
        ohif_app,
        host="0.0.0.0",
        port=OHIF_PORT,
        log_config=_OHIF_LOG_CONFIG,
    )
    server = uvicorn.Server(config)
    _server_state["ohif_server"] = server

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    _server_state["ohif_loop"] = loop
    loop.run_until_complete(server.serve())

def start_servers(labels=None, use_pretrained=True):
    """Start both MONAILabel and OHIF Viewer servers in parallel.
    
    Automatically stops any servers still running from a previous call.
    Copies the radiology app to local disk to avoid FUSE seek errors.
    """
    # Gracefully stop any servers from a previous run
    if any(v is not None for v in _server_state.values()):
        print("[cleanup] Stopping servers from previous run...")
        stop_servers()

    # Copy app to local disk (avoids all FUSE 'Illegal seek' errors)
    _prepare_local_app()

    monai_thread = threading.Thread(
        target=start_monailabel_server,
        kwargs={
            "app_path": MONAI_APP_LOCAL_PATH,
            "studies_url": MONAI_STUDIES_URL,
            "table": MONAI_TABLE,
            "models": MONAI_MODELS,
            "labels": labels,
            "use_pretrained": use_pretrained,
        },
        daemon=True,
        name="monailabel-server",
    )
    ohif_thread = threading.Thread(
        target=start_ohif_server,
        daemon=True,
        name="ohif-viewer",
    )
    _server_state["monai_thread"] = monai_thread
    _server_state["ohif_thread"] = ohif_thread

    print("\n" + "=" * 60)
    print("Starting MONAILabel server and OHIF Viewer in parallel...")
    print("=" * 60 + "\n")
    monai_thread.start()
    ohif_thread.start()

    # Block until both servers stop
    monai_thread.join()
    ohif_thread.join()

print("Server functions defined. Run start_servers() to launch both servers.")

# COMMAND ----------

# DBTITLE 1,Start both servers (pre-trained model)
# MAGIC %md
# MAGIC ### Start Both Servers (Pre-trained Model)
# MAGIC
# MAGIC The next cell starts both the **MONAILabel server** (with the pre-trained segmentation model) and the **OHIF Viewer** in parallel. Both servers will run concurrently in background threads — the cell will block until the servers are stopped.

# COMMAND ----------

# DBTITLE 1,Launch servers with pre-trained model
start_servers(use_pretrained=True)

# COMMAND ----------

# DBTITLE 1,Start both servers with custom labels
# MAGIC %md
# MAGIC ### Start Both Servers (Custom Labels)
# MAGIC
# MAGIC Alternative: start the MONAILabel server with **user-defined labels** (no pre-trained model) and the OHIF Viewer in parallel. Edit `CUSTOM_LABELS` below to define your own segmentation classes.

# COMMAND ----------

# DBTITLE 1,Launch servers with custom labels
CUSTOM_LABELS = 'lung_left,lung_right'

start_servers(
    labels=CUSTOM_LABELS,
    use_pretrained=False,
)
