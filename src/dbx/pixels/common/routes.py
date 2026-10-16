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
import hashlib
import json
import os
import re
import threading
import time

import httpx
import requests
from fastapi import FastAPI, HTTPException
from starlette.concurrency import run_in_threadpool
from starlette.requests import Request
from starlette.responses import HTMLResponse, JSONResponse, RedirectResponse, Response

from dbx.pixels.common.config import (
    MONAI_DATALOADERS,
    MONAI_DATASETS,
    MONAI_TRACKING,
    cfg,
    get_monai_endpoint,
    get_nvreasonct_endpoint,
    get_pixels_table,
    get_seg_dest_dir,
    get_vlm_model,
    get_warehouse_id,
    log,
    ohif_path,
    pixels_pkg_path,
)
from dbx.pixels.common.middleware import DBStaticFiles
from dbx.pixels.common.pages import config_page
from dbx.pixels.common.redaction_utils import insert_redaction_job
from dbx.pixels.prompt import get_prompt, get_user_prompts
from dbx.pixels.utils import call_llm_serving_endpoint

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
        DBStaticFiles(directory=f"{ohif_path}/dicom-microscopy-viewer", html=True),
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

        if request.cookies.get("is_local") and request.cookies.get("is_local").lower() == "true":
            return JSONResponse(
                status_code=501,
                content={"message": "Local files are not supported yet"},
            )

        action = str(url).strip("/") or "info"
        to_send = {"input": {"action": action}}

        resp = ""
        try:
            resp = get_deploy_client("databricks").predict(
                endpoint=serving_endpoint, inputs={"inputs": to_send}
            )
            if '"background",' in resp.predictions:
                resp.predictions = resp.predictions.replace('"background",', "")
            return Response(content=resp.predictions, media_type="application/json")
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

        # Build a composite cache key from the image path *and* the full
        # inference parameters so that label / model / config changes
        # invalidate stale cached results.
        image_key = q_params["image"]
        params_hash = hashlib.sha256(json.dumps(to_send, sort_keys=True).encode()).hexdigest()[:16]
        cache_key = f"{image_key}:{params_hash}"

        try:
            should_run_inference = False
            pending_event = None

            async with _cache_segmentations_lock:
                if cache_key not in _cache_segmentations:
                    pending_event = asyncio.Event()
                    _cache_segmentations[cache_key] = {"pending": pending_event}
                    should_run_inference = True
                elif "pending" in _cache_segmentations[cache_key]:
                    pending_event = _cache_segmentations[cache_key]["pending"]
                else:
                    file_path = _cache_segmentations[cache_key]["file_path"]
                    params = _cache_segmentations[cache_key]["params"]

            if should_run_inference:
                try:
                    file_res = await run_in_threadpool(
                        lambda: get_deploy_client("databricks").predict(
                            endpoint=serving_endpoint,
                            inputs={"inputs": {"input": {"infer": to_send}}},
                        )
                    )
                    res_json = json.loads(file_res.predictions)
                    file_path = res_json["file"]
                    params = res_json["params"]

                    async with _cache_segmentations_lock:
                        _cache_segmentations[cache_key] = {
                            "file_path": file_path,
                            "params": params,
                        }
                    pending_event.set()
                except Exception:
                    async with _cache_segmentations_lock:
                        _cache_segmentations.pop(cache_key, None)
                    pending_event.set()
                    raise
            elif pending_event is not None:
                await pending_event.wait()
                async with _cache_segmentations_lock:
                    entry = _cache_segmentations.get(cache_key, {})
                    if "pending" in entry or cache_key not in _cache_segmentations:
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
                content=base64.b64decode(json.loads(file_content.predictions)["file_content"]),
                media_type="application/octet-stream",
            )
        except Exception as e:
            log(e, request, "error")
            async with _cache_segmentations_lock:
                entry = _cache_segmentations.get(cache_key, {})
                if "pending" not in entry and cache_key in _cache_segmentations:
                    del _cache_segmentations[cache_key]
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
            return Response(content=res_json.predictions, media_type="application/json")
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
            return Response(content=res_json.predictions, media_type="application/json")
        except Exception as e:
            log(e, request, "error")
            return Response(
                content=json.dumps({"message": f"Error querying model: {e}"}),
                media_type="application/json",
                status_code=500,
            )

    # Wire routes
    app.add_route("/api/monai/{path:path}", _reverse_proxy_monai, ["GET", "PUT"])
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
    use_user_auth: bool = os.getenv("DICOMWEB_USE_USER_AUTH", "true").lower() == "true"

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
                log(
                    f"App-auth fallback failed while creating redaction job: {exc}",
                    request,
                    "error",
                )
                raise HTTPException(
                    status_code=500,
                    detail="Internal server error -- check application logs for details",
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
                matches = re.findall(r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned)
                if matches:
                    cleaned = matches[0].strip()
                else:
                    cleaned = cleaned.replace("```json", "").replace("```", "").strip()

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
                return JSONResponse(content={"error": "No tags returned from model"})
            return JSONResponse(content={"error": "No content returned from model"})

        except Exception as e:
            log(f"Error doing AI redaction: {e}", request, "error")
            raise HTTPException(status_code=500, detail=f"Failed to do AI redaction: {e}")


# ═══════════════════════════════════════════════════════════════════════════
# 4. VLM ANALYSIS
# ═══════════════════════════════════════════════════════════════════════════


_ABDOMEN_HINTS = ("abd", "liver", "pelvi", "kidney", "renal", "pancrea")

_SINGLE_IMAGE_NOTE = (
    "This series is a single image (e.g. a scout or dose sheet), not a 3D CT volume, "
    "so NV-Reason-CT was skipped. Showing a 2D analysis of the current view.\n\n"
)


def _nvreasonct_region(metadata: dict) -> str:
    """NV-Reason-CT takes 'chest' or 'abdomen'; infer it from the series description."""
    text = " ".join(str(metadata.get(k) or "") for k in ("seriesDescription", "studyDescription"))
    return "abdomen" if any(h in text.lower() for h in _ABDOMEN_HINTS) else "chest"


NVREASONCT_MIN_IMAGES = 16
NVREASONCT_TIMEOUT_S = 280
NVREASONCT_WAKE_S = 900  # stop trying to wake the endpoint after this long

# The dialog's built-in quick prompts are written for 2D models. NV-Reason-CT is
# prompt-sensitive (e.g. "Identify any abnormalities…" gets a one-line localization),
# so these get its full structured report instead; typed questions pass through.
_QUICK_PROMPTS = {
    "Identify any abnormalities or lesions in this medical image",
    "Describe the anatomical structures visible in this scan",
    "Assess the image quality and diagnostic value",
    "Is there a non-biological foreign object present in this image? Do not identify the "
    "object, just confirm its presence",
    "Provide differential diagnosis based on the imaging findings",
    "Analyze the clinical significance of these imaging findings",
    "Assess the urgency level and recommend next steps",
    "Provide guidance on patient management based on these images",
    "What do you see in this medical image?",
    "Explain the key findings in simple terms",
    "Scan this image for any visible PHI in the image or in the metadata",
    "Help me understand what this image shows",
}


def _nvreasonct_prompts() -> list:
    """Sample prompts for the dialog, from resources/prompts/nvreasonct/user (file name order)."""
    return [
        {
            "name": p.name,
            "description": p.description,
            "prompt": "\n".join(
                line for line in p.content.splitlines() if not line.startswith("#")
            ).strip(),
        }
        for p in sorted(get_user_prompts("nvreasonct"), key=lambda p: p.name)
    ]


# NV-Reason-CT scales to zero when idle and takes ~4 min to start. Selecting it in the dialog
# starts a wake-up (POST /vlm/warmup) tracked here; the viewer app runs a single worker.
_nvreasonct_wake = {"thread": None, "since": 0.0}
_nvreasonct_wake_lock = threading.Lock()


def _nvreasonct_invoke(endpoint, record, timeout):
    from databricks.sdk.core import Config

    config = Config()
    return requests.post(
        f"{config.host}/serving-endpoints/{endpoint}/invocations",
        headers={**config.authenticate(), "Content-Type": "application/json"},
        json={"dataframe_records": [record]},
        timeout=timeout,
    )


def _wake_nvreasonct(endpoint):
    """Send info requests (no inference) until the endpoint answers."""
    deadline = time.time() + NVREASONCT_WAKE_S
    while time.time() < deadline:
        try:
            resp = _nvreasonct_invoke(endpoint, {"input": {"action": "info"}}, (10, 300))
            if resp.status_code < 500 and resp.status_code != 429:
                return  # up, or failing in a way waiting won't fix
        except requests.RequestException:
            pass
        time.sleep(10)


def _nvreasonct_status(endpoint) -> str:
    """'ready' if the endpoint answers within a few seconds, else 'starting' (waking it up)."""
    with _nvreasonct_wake_lock:
        thread = _nvreasonct_wake["thread"]
        if thread is None or not thread.is_alive():
            thread = threading.Thread(target=_wake_nvreasonct, args=(endpoint,), daemon=True)
            thread.start()
            _nvreasonct_wake.update(thread=thread, since=time.time())
        elif time.time() - _nvreasonct_wake["since"] > 5:
            return "starting"  # already waking it up
    thread.join(timeout=5)
    return "starting" if thread.is_alive() else "ready"


def _nvreasonct_starting_s() -> float:
    """How long a still-running wake-up has been going (0 if none)."""
    thread = _nvreasonct_wake["thread"]
    return time.time() - _nvreasonct_wake["since"] if thread and thread.is_alive() else 0.0


def _vlm_models() -> list:
    """Models the VLM analyzer offers; the frontend greys out ones that don't fit the viewport."""
    vlm_model = get_vlm_model()
    models = [
        {
            "id": vlm_model,
            "label": f"{vlm_model.removeprefix('databricks-')} (2D, current view)",
            "type": "2d",
            "modalities": [],
            "min_images": 0,
            "reasoning": False,
            "description": "Analyzes a screenshot of the current viewport.",
        }
    ]
    if get_nvreasonct_endpoint():
        models.append(
            {
                "id": get_nvreasonct_endpoint(),
                "label": "NV-Reason-CT (3D CT volume)",
                "type": "ct3d",
                "modalities": ["CT"],
                "min_images": NVREASONCT_MIN_IMAGES,
                "reasoning": True,
                "description": "Analyzes the full CT series. About 10-60 s depending on the answer length; the first call after idle can take a few minutes.",
                "prompts": _nvreasonct_prompts(),
            }
        )
    return models


def _call_nvreasonct(
    endpoint, series_uid, prompt, region, max_new_tokens, pixels_table, study_uid=None
) -> dict:
    """Run NV-Reason-CT on a full DICOM series; it fetches the series itself.

    ``study_uid`` is optional and lets the model skip a series -> study lookup query.
    A ``prompt`` of None uses the model's own radiology-report prompt.

    Called directly rather than through the MLflow deploy client: that client goes through
    the Databricks SDK, which times out after 60 s and retries, so a long CT report (or a
    queued / cold endpoint) would be re-sent as duplicate GPU inferences.
    """
    record = {
        "series_uid": series_uid,
        "params": {
            "anatomy_region": region,
            "max_new_tokens": int(max_new_tokens),
            "pixels_table": pixels_table,
        },
    }
    if prompt:
        record["params"]["prompt"] = prompt
    if study_uid:
        record["study_uid"] = study_uid
    # one attempt; finish before the Databricks Apps proxy gives up (~300 s)
    resp = _nvreasonct_invoke(endpoint, record, (10, NVREASONCT_TIMEOUT_S))
    if resp.status_code != 200:
        raise Exception(f"NV-Reason-CT endpoint returned {resp.status_code}: {resp.text[:500]}")
    predictions = resp.json()["predictions"]
    return json.loads(predictions) if isinstance(predictions, str) else predictions


def _format_nvreasonct_report(result: dict, metadata: dict, show_reasoning: bool = False) -> str:
    """Format an NV-Reason-CT reply for the dialog: optional reasoning, report, labels, timing."""
    report = result.get("report", "")
    # Replies can contain more than one </think>; the final answer follows the last one.
    reasoning, _, answer = report.rpartition("</think>")
    labels = re.findall(r"<answer>(.*?)</answer>", answer, re.S)
    answer = re.sub(r"<answer>.*?</answer>", "", answer, flags=re.S).strip()
    answer = re.sub(r":[ \t]*\n\s*\n", ":\n", answer)

    series = metadata.get("seriesDescription") or "CT series"
    out = f"NV-Reason-CT, full 3D series analysis ({series})"
    reasoning = re.sub(r"</?think>", "\n", reasoning).strip()
    if show_reasoning and reasoning:
        out += f"\n\nReasoning:\n{reasoning}\n\nReport:"
    out += f"\n\n{answer}"
    if labels:
        out += f"\n\nLabels: {labels[-1].strip()}"
    t = result.get("timings") or {}
    if t:
        loading = t.get("fetch_s", 0) + t.get("convert_s", 0)
        slices = f"{result['slices']} slices, " if result.get("slices") else ""
        out += (
            f"\n\nTiming: {slices}data loading {loading:.0f} s (DICOM fetch {t.get('fetch_s', 0):.0f} s, "
            f"NIfTI {t.get('convert_s', 0):.0f} s), model inference {t.get('inference_s', 0):.0f} s"
        )
    return out


def register_vlm_routes(app: FastAPI):
    """Vision Language Model analysis endpoints.

    ``GET /vlm/models`` lists the models the analyzer offers. ``POST /vlm/analyze`` runs
    the selected one: NV-Reason-CT on the full CT series (by ``seriesInstanceUID``), or a
    2D vision-language model on the viewport screenshot. Only listed models (plus any in
    ``VLM_ALLOWED_MODELS``) are accepted. Older UIs that send a hard-coded model id get
    automatic routing: CT volumes to NV-Reason-CT, everything else to the 2D model.
    """

    @app.get("/vlm/models", response_class=JSONResponse, tags=["VLM"])
    async def vlm_models():
        return JSONResponse(content=_vlm_models())

    @app.post("/vlm/warmup", response_class=JSONResponse, tags=["VLM"])
    async def vlm_warmup(request: Request):
        """Wake a model that scales to zero; ``{"status": "ready" | "starting"}``."""
        body = await request.json()
        endpoint = get_nvreasonct_endpoint()
        if not endpoint or body.get("model") != endpoint:
            return JSONResponse(content={"status": "ready"})
        status = await run_in_threadpool(lambda: _nvreasonct_status(endpoint))
        return JSONResponse(content={"status": status})

    @app.post("/vlm/analyze", response_class=JSONResponse, tags=["VLM"])
    async def vlm_analyze(request: Request):
        body = await request.json()

        base64_image = body.get("image")
        prompt = body.get("prompt")
        raw_metadata = body.get("metadata") or {}
        metadata = json.dumps(raw_metadata)
        max_tokens = body.get("max_tokens", 1000)
        temperature = body.get("temperature", 0.7)
        # The bundled OHIF UI hardcodes databricks-claude-sonnet-4, which is deprecated
        # on many workspaces. Remap known-deprecated Claude FMAPI ids to the configured
        # 2D model (VLM_MODEL), so the hardcoded UI value keeps working.
        _DEPRECATED = {
            "databricks-claude-sonnet-4": get_vlm_model(),
            "databricks-claude-3-7-sonnet": get_vlm_model(),
        }
        requested = body.get("model") or ""
        show_reasoning = bool(body.get("show_reasoning"))
        nvreasonct_endpoint = get_nvreasonct_endpoint()
        legacy = not requested or requested in _DEPRECATED  # older UI without a model choice
        allowed = {m["id"] for m in _vlm_models()} | {
            m.strip() for m in os.environ.get("VLM_ALLOWED_MODELS", "").split(",") if m.strip()
        }
        if not legacy and requested not in allowed:
            raise HTTPException(status_code=400, detail=f"Model '{requested}' is not available")
        model = get_vlm_model() if legacy or requested == nvreasonct_endpoint else requested

        note = ""
        series_uid = raw_metadata.get("seriesInstanceUID")
        is_ct = str(raw_metadata.get("modality", "")).upper() == "CT"
        wants_nvreasonct = bool(nvreasonct_endpoint) and (
            legacy or requested == nvreasonct_endpoint
        )
        if wants_nvreasonct and series_uid and is_ct:
            region = _nvreasonct_region(raw_metadata)
            pixels_table = get_pixels_table(request)
            study_uid = raw_metadata.get("studyInstanceUID")
            report_prompt = None if (prompt or "").strip() in _QUICK_PROMPTS else prompt
            log(
                f"VLM analyze -> {nvreasonct_endpoint} series={series_uid} study={study_uid} "
                f"region={region} report_prompt={report_prompt is None}",
                request,
            )
            # A quick info request first: a cold endpoint would hold the report request
            # for minutes, so answer right away and keep waking it in the background.
            status = await run_in_threadpool(lambda: _nvreasonct_status(nvreasonct_endpoint))
            if status == "starting":
                raise HTTPException(
                    status_code=503,
                    detail=(
                        f"NV-Reason-CT is not answering yet (waiting {_nvreasonct_starting_s():.0f} s "
                        "so far). It scales to zero when idle and takes about 4 minutes to start, or "
                        "it may be busy with another request. Try again shortly, or use "
                        f"{get_vlm_model()} for a 2D analysis of the current view."
                    ),
                )
            try:
                result = await run_in_threadpool(
                    lambda: _call_nvreasonct(
                        nvreasonct_endpoint,
                        series_uid,
                        report_prompt,
                        region,
                        max_tokens,
                        pixels_table,
                        study_uid,
                    )
                )
                return JSONResponse(
                    content=_format_nvreasonct_report(result, raw_metadata, show_reasoning)
                )
            except requests.Timeout:
                raise HTTPException(
                    status_code=504,
                    detail=(
                        f"NV-Reason-CT did not answer within {NVREASONCT_TIMEOUT_S} s. If it was "
                        "idle it is probably still starting (about 4 minutes); try again shortly."
                    ),
                )
            except Exception as e:
                if "INSUFFICIENT_SLICES" not in str(e):
                    raise HTTPException(status_code=502, detail=f"NV-Reason-CT failed: {e}")
                log(f"VLM analyze: {series_uid} is not a 3D volume, using {model}", request)
                note = _SINGLE_IMAGE_NOTE
        elif requested and requested == nvreasonct_endpoint:
            raise HTTPException(status_code=400, detail="NV-Reason-CT needs a CT series")

        system_prompt = get_prompt("vlm_ohif", "vlm_analyzer")

        user_prompt = {
            "type": "text",
            "text": (
                "<USER_PROMPT>" + prompt + "</USER_PROMPT>\n<METADATA>" + metadata + "</METADATA>"
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

        content = analysis_result["choices"][0]["message"]["content"]
        return JSONResponse(content=note + content if note else content)


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
