"""
Shared route registration for Pixels applications.

Provides ``register_all_common_routes(app)`` which wires up every
non-DICOMweb, non-proxy route group into a FastAPI application:

- OHIF viewer hosting, config page, cookie setter, redirects
- MONAI model-serving proxy (info, infer, active-learning, train)
- Redaction API (insert job, metadata shortcuts, AI redaction)
- VLM analysis

Each group also has its own ``register_*_routes(app)`` for granular use.
"""

import asyncio
import base64
import json
import os
import re

import httpx
from fastapi import FastAPI, HTTPException
from starlette.concurrency import run_in_threadpool
from starlette.requests import Request
from starlette.responses import (
    HTMLResponse,
    JSONResponse,
    RedirectResponse,
    Response,
)

from dbx.pixels.prompt import get_prompt
from dbx.pixels.utils import call_llm_serving_endpoint

from dbx.pixels.resources.common.config import (
    MONAI_DATALOADERS,
    MONAI_DATASETS,
    MONAI_TRACKING,
    cfg,
    get_pixels_table,
    get_seg_dest_dir,
    get_monai_endpoint,
    get_warehouse_id,
    log,
    pixels_pkg_path,
)
from dbx.pixels.resources.common.middleware import DBStaticFiles
from dbx.pixels.resources.common.pages import config_page
from dbx.pixels.resources.common.redaction_utils import insert_redaction_job
from dbx.pixels.resources.common.config import ohif_path


# ---------------------------------------------------------------------------
# Segmentation inference cache (MONAI)
# ---------------------------------------------------------------------------
_cache_segmentations: dict = {}
_cache_segmentations_lock = asyncio.Lock()


# ═══════════════════════════════════════════════════════════════════════════
# 1. OHIF VIEWER ROUTES — config page, cookies, redirects, static mounts
# ═══════════════════════════════════════════════════════════════════════════

def register_ohif_routes(app: FastAPI):
    """Config page, cookie setter, OHIF / microscopy viewer static mounts."""

    @app.get("/", response_class=HTMLResponse, tags=["OHIF"])
    async def main_page(request: Request):
        return config_page(get_pixels_table(request), get_seg_dest_dir(request))

    @app.post("/set_cookie", tags=["OHIF"])
    async def set_cookie(request: Request):
        form_data = await request.form()
        pixels_table = form_data.get("pixels_table")
        seg_dest_dir = form_data.get("seg_dest_dir")
        path = form_data.get("path")

        if not seg_dest_dir.startswith("/Volumes/"):
            raise HTTPException(
                status_code=400,
                detail="Destination directory must be in Volumes",
            )

        response = RedirectResponse(url=path, status_code=302)
        response.set_cookie(key="pixels_table", value=pixels_table)
        response.set_cookie(key="seg_dest_dir", value=seg_dest_dir)
        response.set_cookie(key="is_local", value=("local" in path))
        return response

    # ── OHIF SPA redirects ────────────────────────────────────────────

    @app.get("/ohif/viewer/{path:path}", tags=["OHIF"])
    async def ohif_redirect_viewer(request: Request):
        dest = httpx.URL(path=request.url.path.replace("/viewer/", "/"))
        return RedirectResponse(dest.path, status_code=302)

    @app.get("/ohif/segmentation/{path:path}", tags=["OHIF"])
    async def ohif_redirect_segmentation(request: Request):
        dest = httpx.URL(path=request.url.path.replace("/segmentation/", "/"))
        return RedirectResponse(dest.path, status_code=302)

    @app.get("/ohif/monai-label/{path:path}", tags=["OHIF"])
    async def ohif_redirect_monai(request: Request):
        dest = httpx.URL(path=request.url.path.replace("/monai-label/", "/"))
        return RedirectResponse(dest.path, status_code=302)

    # ── Static file mounts ────────────────────────────────────────────
    app.mount(
        "/ohif/",
        DBStaticFiles(directory=ohif_path, html=True),
        name="ohif",
    )
    app.mount(
        "/dicom-microscopy-viewer/",
        DBStaticFiles(
            directory=f"{ohif_path}/dicom-microscopy-viewer", html=True
        ),
        name="dicom-microscopy-viewer",
    )


# ═══════════════════════════════════════════════════════════════════════════
# 2. MONAI MODEL-SERVING PROXY
# ═══════════════════════════════════════════════════════════════════════════

def register_monai_routes(app: FastAPI):
    """MONAI info / infer / active-learning / train proxy routes."""

    serving_endpoint = get_monai_endpoint()

    def _reverse_proxy_monai(request: Request):
        from mlflow.deployments import get_deploy_client

        url = httpx.URL(path=request.url.path.replace("/api/monai/", "/"))

        if (
            request.cookies.get("is_local")
            and request.cookies.get("is_local").lower() == "true"
        ):
            return JSONResponse(
                status_code=501,
                content={"message": "Local files are not supported yet"},
            )

        if "info" in str(url):
            to_send = {"input": {"action": "info"}}

        resp = ""
        try:
            resp = get_deploy_client("databricks").predict(
                endpoint=serving_endpoint, inputs={"inputs": to_send}
            )
            if '"background",' in resp.predictions:
                resp.predictions = resp.predictions.replace('"background",', "")
            return Response(
                content=resp.predictions, media_type="application/json"
            )
        except Exception as e:
            log(e, request, "error")
            return Response(
                content=str({"message": f"Error querying model: {e}"}),
                media_type="application/text",
                status_code=500,
            )

    async def _reverse_proxy_monai_infer_post(request: Request):
        from mlflow.deployments import get_deploy_client

        url = httpx.URL(path=request.url.path.replace("/api/monai/", "/"))
        q_params = request.query_params
        form_data = await request.form()

        to_send = json.loads(form_data.get("params"))
        to_send["model"] = str(url).split("/")[2]
        to_send["image"] = q_params["image"]

        del to_send["result_compress"]
        for key in ("model_filename", "sw_batch_size", "sw_overlap", "highres"):
            to_send.pop(key, None)

        to_send["pixels_table"] = get_pixels_table(request)
        log({"inputs": {"input": {"infer": to_send}}}, request, "debug")

        try:
            image_key = q_params["image"]
            should_run_inference = False
            pending_event = None

            async with _cache_segmentations_lock:
                if image_key not in _cache_segmentations:
                    pending_event = asyncio.Event()
                    _cache_segmentations[image_key] = {"pending": pending_event}
                    should_run_inference = True
                elif "pending" in _cache_segmentations[image_key]:
                    pending_event = _cache_segmentations[image_key]["pending"]
                else:
                    file_path = _cache_segmentations[image_key]["file_path"]
                    params = _cache_segmentations[image_key]["params"]

            if should_run_inference:
                try:
                    file_res = await run_in_threadpool(
                        lambda: get_deploy_client("databricks").predict(
                            endpoint=serving_endpoint,
                            inputs={
                                "inputs": {"input": {"infer": to_send}}
                            },
                        )
                    )
                    res_json = json.loads(file_res.predictions)
                    file_path = res_json["file"]
                    params = res_json["params"]

                    async with _cache_segmentations_lock:
                        _cache_segmentations[image_key] = {
                            "file_path": file_path,
                            "params": params,
                        }
                    pending_event.set()
                except Exception:
                    async with _cache_segmentations_lock:
                        _cache_segmentations.pop(image_key, None)
                    pending_event.set()
                    raise
            elif pending_event is not None:
                await pending_event.wait()
                async with _cache_segmentations_lock:
                    entry = _cache_segmentations.get(image_key, {})
                    if "pending" in entry or image_key not in _cache_segmentations:
                        raise Exception("Inference failed in another request")
                    file_path = entry["file_path"]
                    params = entry["params"]

            file_content = await run_in_threadpool(
                lambda: get_deploy_client("databricks").predict(
                    endpoint=serving_endpoint,
                    inputs={
                        "inputs": {
                            "input": {
                                "get_file": file_path,
                                "result_dtype": "uint8",
                            }
                        }
                    },
                )
            )
            return Response(
                content=base64.b64decode(
                    json.loads(file_content.predictions)["file_content"]
                ),
                media_type="application/octet-stream",
            )
        except Exception as e:
            log(e, request, "error")
            async with _cache_segmentations_lock:
                entry = _cache_segmentations.get(q_params["image"], {})
                if "pending" not in entry and q_params["image"] in _cache_segmentations:
                    del _cache_segmentations[q_params["image"]]
            return Response(
                content=json.dumps({"message": f"Error querying model: {e}"}),
                media_type="application/json",
                status_code=500,
            )

    def _reverse_proxy_monai_nextsample_post(request: Request):
        from mlflow.deployments import get_deploy_client

        url = httpx.URL(path=request.url.path.replace("/api/monai/", "/"))
        to_send = {"action": str(url)[1:]}
        to_send["pixels_table"] = get_pixels_table(request)

        try:
            res_json = get_deploy_client("databricks").predict(
                endpoint=serving_endpoint,
                inputs={"inputs": {"input": to_send}},
            )
            return Response(
                content=res_json.predictions, media_type="application/json"
            )
        except Exception as e:
            log(e, request, "error")
            return Response(
                content=json.dumps({"message": f"Error querying model: {e}"}),
                media_type="application/json",
                status_code=500,
            )

    async def _reverse_proxy_monai_train_post(request: Request):
        from mlflow.deployments import get_deploy_client

        url = httpx.URL(path=request.url.path.replace("/api/monai/", "/"))
        body = await request.json()
        model = list(body.keys())[0]
        to_send = body[model]
        to_send["model"] = model

        if isinstance(body[model]["dataset"], list):
            to_send["dataset"] = body[model]["dataset"][0]
        elif isinstance(body[model]["dataset"], int):
            to_send["dataset"] = MONAI_DATASETS[body[model]["dataset"]]

        if isinstance(body[model]["dataloader"], list):
            to_send["dataloader"] = body[model]["dataloader"][0]
        elif isinstance(body[model]["dataloader"], int):
            to_send["dataloader"] = MONAI_DATALOADERS[body[model]["dataloader"]]

        if isinstance(body[model]["tracking"], list):
            to_send["tracking"] = ""
        elif isinstance(body[model]["tracking"], int):
            to_send["tracking"] = MONAI_TRACKING[body[model]["tracking"]]

        to_send["pixels_table"] = get_pixels_table(request)
        log({"inputs": {"input": {"train": to_send}}}, request, "debug")

        try:
            res_json = await run_in_threadpool(
                lambda: get_deploy_client("databricks").predict(
                    endpoint=serving_endpoint,
                    inputs={"inputs": {"input": {"train": to_send}}},
                )
            )
            return Response(
                content=res_json.predictions, media_type="application/json"
            )
        except Exception as e:
            log(e, request, "error")
            return Response(
                content=json.dumps({"message": f"Error querying model: {e}"}),
                media_type="application/json",
                status_code=500,
            )

    # Wire routes
    app.add_route(
        "/api/monai/{path:path}", _reverse_proxy_monai, ["GET", "PUT"]
    )
    app.add_route(
        "/api/monai/infer/{path:path}",
        _reverse_proxy_monai_infer_post,
        ["POST"],
    )
    app.add_route(
        "/api/monai/activelearning/{path:path}",
        _reverse_proxy_monai_nextsample_post,
        ["POST"],
    )
    app.add_route(
        "/api/monai/train/{path:path}",
        _reverse_proxy_monai_train_post,
        ["POST"],
    )


# ═══════════════════════════════════════════════════════════════════════════
# 3. REDACTION API
# ═══════════════════════════════════════════════════════════════════════════

def register_redaction_routes(app: FastAPI):
    """Redaction job insertion, metadata shortcuts, AI redaction."""

    warehouse_id = get_warehouse_id()
    use_user_auth: bool = os.getenv("DICOMWEB_USE_USER_AUTH", "false").lower() == "true"

    @app.post("/api/redaction/insert", response_class=JSONResponse, tags=["Redaction"])
    async def create_redaction_job(request: Request):
        """Create a new redaction job from JSON annotation data."""
        body = await request.body()
        log("Received redaction job creation request", request, "info")

        redaction_json = json.loads(body)
        if not redaction_json:
            raise HTTPException(
                status_code=400,
                detail="redaction_json is required and must be a valid JSON object",
            )

        created_by = request.headers.get("X-Forwarded-Email", "unknown")
        token = request.headers.get("X-Forwarded-Access-Token")

        if not token:
            if use_user_auth:
                # User (OBO) auth is enabled — the forwarded token is mandatory.
                raise HTTPException(
                    status_code=401,
                    detail="User authorization (OBO) is enabled but no "
                           "X-Forwarded-Access-Token header was found",
                )
            # App-auth mode — fall back to service-principal SDK credentials.
            try:
                header_factory = cfg.authenticate()
                headers = header_factory() if callable(header_factory) else header_factory
                auth = headers.get("Authorization", "")
                if auth.startswith("Bearer "):
                    token = auth[7:]
                else:
                    raise ValueError("SDK Config did not produce a Bearer token")
            except Exception as exc:
                raise HTTPException(
                    status_code=500,
                    detail=f"No X-Forwarded-Access-Token header and app-auth fallback failed: {exc}",
                )

        pixels_table = get_pixels_table(request)
        redaction_table = f"{pixels_table}_redaction"

        result = await insert_redaction_job(
            table_name=redaction_table,
            redaction_json=redaction_json,
            warehouse_id=warehouse_id,
            databricks_host=cfg.host,
            databricks_token=token,
            created_by=created_by,
        )

        log(f"Created redaction job {result['redaction_id']}", request, "info")
        return JSONResponse(content=result, status_code=201)

    @app.get(
        "/redaction/metadata_shortcuts",
        response_class=JSONResponse,
        tags=["Redaction"],
    )
    def redaction_metadata_shortcuts(request: Request):
        try:
            shortcut_path = (
                pixels_pkg_path
                / "resources"
                / "lakehouse_app"
                / "redaction"
                / "metadata_shortcuts.json"
            )
            with open(shortcut_path, "r") as f:
                return JSONResponse(content=json.load(f))
        except Exception as e:
            log(f"Error getting metadata shortcuts: {e}", request, "error")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to get metadata shortcuts: {e}",
            )

    @app.post(
        "/redaction/ai_redaction",
        response_class=JSONResponse,
        tags=["Redaction"],
    )
    async def ai_redaction(request: Request):
        try:
            body = await request.json()
            metadata = json.dumps(body.get("metadata"))
            prompt = body.get("prompt", "")
            max_tokens = body.get("max_tokens", 5000)
            temperature = body.get("temperature", 0.2)
            model = body.get("model", "databricks-llama-4-maverick")

            system_prompt = get_prompt("metadata_redaction", "ohif_redactor")

            user_prompt = {
                "type": "text",
                "text": (
                    "<USER_PROMPT>"
                    + prompt
                    + "</USER_PROMPT>\n<METADATA>"
                    + metadata
                    + "</METADATA>"
                ),
            }

            result = await run_in_threadpool(
                lambda: call_llm_serving_endpoint(
                    user_prompt,
                    system_prompt.content,
                    None,
                    model,
                    max_tokens,
                    temperature,
                )
            )

            if "choices" in result and "message" in result["choices"][0]:
                cleaned = result["choices"][0]["message"]["content"]
            else:
                cleaned = result

            if "```" in cleaned:
                matches = re.findall(
                    r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned
                )
                if matches:
                    cleaned = matches[0].strip()
                else:
                    cleaned = (
                        cleaned.replace("```json", "")
                        .replace("```", "")
                        .strip()
                    )

            log(f"Cleaned AI response: {cleaned}", request, "debug")

            if cleaned:
                content = json.loads(cleaned)
                if "summary" in content and "tags" in content:
                    return JSONResponse(
                        content={
                            "summary": content["summary"],
                            "tags": content["tags"],
                        }
                    )
                return JSONResponse(
                    content={"error": "No tags returned from model"}
                )
            return JSONResponse(
                content={"error": "No content returned from model"}
            )

        except Exception as e:
            log(f"Error doing AI redaction: {e}", request, "error")
            raise HTTPException(
                status_code=500, detail=f"Failed to do AI redaction: {e}"
            )


# ═══════════════════════════════════════════════════════════════════════════
# 4. VLM ANALYSIS
# ═══════════════════════════════════════════════════════════════════════════

def register_vlm_routes(app: FastAPI):
    """Vision Language Model analysis endpoint."""

    @app.post("/vlm/analyze", response_class=JSONResponse, tags=["VLM"])
    async def vlm_analyze(request: Request):
        body = await request.json()

        base64_image = body.get("image")
        prompt = body.get("prompt")
        metadata = json.dumps(body.get("metadata"))
        max_tokens = body.get("max_tokens", 1000)
        temperature = body.get("temperature", 0.7)
        model = body.get("model", "databricks-claude-sonnet-4")

        system_prompt = get_prompt("vlm_ohif", "vlm_analyzer")

        user_prompt = {
            "type": "text",
            "text": (
                "<USER_PROMPT>"
                + prompt
                + "</USER_PROMPT>\n<METADATA>"
                + metadata
                + "</METADATA>"
            ),
        }

        analysis_result = await run_in_threadpool(
            lambda: call_llm_serving_endpoint(
                user_prompt,
                system_prompt.content,
                base64_image,
                model,
                max_tokens,
                temperature,
            )
        )

        return JSONResponse(
            content=analysis_result["choices"][0]["message"]["content"]
        )


# ═══════════════════════════════════════════════════════════════════════════
# MASTER REGISTRATION
# ═══════════════════════════════════════════════════════════════════════════

def register_all_common_routes(app: FastAPI):
    """
    Register **all** shared (non-DICOMweb, non-proxy) routes with the application.

    Call order matters:
    1. MONAI routes
    2. Redaction + VLM (explicit paths)
    3. OHIF routes last (includes static-file mounts which are catch-all)
    """
    register_monai_routes(app)
    register_redaction_routes(app)
    register_vlm_routes(app)
    register_ohif_routes(app)  # static mounts must come last
