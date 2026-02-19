"""
DICOMweb Gateway — Databricks App that translates DICOMweb REST API
calls into Model Serving endpoint invocations.

Architecture::

    OHIF / Client  ──HTTP──▶  Gateway App  ──JSON──▶  Serving Endpoint
                              (this file)             (DICOMwebServingModel)

Every inbound DICOMweb request (QIDO-RS, WADO-RS, WADO-URI, STOW-RS)
is serialised into a compact JSON payload, sent to the serving endpoint
via the invocations API, and the response is deserialised back into
the appropriate HTTP response (correct status code, content-type,
headers, binary body).

Environment variables (set in ``app.yml``)::

    DICOMWEB_SERVING_ENDPOINT   Name of the Model Serving endpoint
    DICOMWEB_GATEWAY_TIMEOUT    Per-request timeout in seconds (default 300)
"""

import asyncio
import base64
import json
import logging
import os
import threading
import time
import requests
from contextlib import asynccontextmanager
from datetime import datetime, timezone

import httpx
import zstd
from databricks.sdk import WorkspaceClient
from databricks.sdk.core import Config
from fastapi import FastAPI, Request, Response, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.concurrency import run_in_threadpool

from metrics_store import get_store

logger = logging.getLogger("DICOMweb.Gateway")

# Payloads smaller than this are sent as plain base64 — the zstd frame
# header (~12 bytes) and dictionary overhead aren't worth it.
_COMPRESS_THRESHOLD = 512

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

SERVING_ENDPOINT = os.getenv("DICOMWEB_SERVING_ENDPOINT", "dicomweb-serving")
_TIMEOUT = int(os.getenv("DICOMWEB_GATEWAY_TIMEOUT", "300"))

_FORWARD_HEADERS = {
    "accept",
    "content-type",
    "x-forwarded-access-token",
    "x-forwarded-email",
    "authorization",
    "cookie",
}

_METRICS_INTERVAL = float(os.getenv("DICOMWEB_METRICS_INTERVAL", "1"))

# Shared async HTTP client — created/closed in the FastAPI lifespan.
_http_client: httpx.AsyncClient | None = None

# ---------------------------------------------------------------------------
# Gateway request counters (thread-safe)
# ---------------------------------------------------------------------------

_stats_lock = threading.Lock()
_gw_req_count = 0
_gw_req_errors = 0
_gw_req_latency_sum = 0.0


def _record_request(elapsed: float, is_error: bool):
    global _gw_req_count, _gw_req_errors, _gw_req_latency_sum
    with _stats_lock:
        _gw_req_count += 1
        _gw_req_latency_sum += elapsed
        if is_error:
            _gw_req_errors += 1


def _snapshot_and_reset() -> dict:
    global _gw_req_count, _gw_req_errors, _gw_req_latency_sum
    with _stats_lock:
        snap = {
            "request_count": _gw_req_count,
            "error_count": _gw_req_errors,
            "latency_sum_s": round(_gw_req_latency_sum, 4),
            "avg_latency_s": (
                round(_gw_req_latency_sum / _gw_req_count, 4)
                if _gw_req_count else 0
            ),
        }
        _gw_req_count = 0
        _gw_req_errors = 0
        _gw_req_latency_sum = 0.0
    return snap


# ---------------------------------------------------------------------------
# WebSocket clients for live metrics push
# ---------------------------------------------------------------------------

_ws_clients: set[WebSocket] = set()


async def _broadcast_metrics(data: dict):
    """Push a metrics payload to every connected WebSocket client."""
    stale = []
    for client in list(_ws_clients):
        try:
            await client.send_json(data)
        except Exception:
            stale.append(client)
    for client in stale:
        _ws_clients.discard(client)


# ---------------------------------------------------------------------------
# Auth — auto-refreshed via Databricks SDK Config
# ---------------------------------------------------------------------------

_cfg: Config | None = None
_header_factory = None
_workspace_client = None


def _get_auth() -> tuple[str, dict]:
    """Return ``(host, auth_headers)`` for serving endpoint calls."""
    global _cfg, _header_factory, _workspace_client

    if _cfg is None:
        _cfg = Config()
        _header_factory = _cfg.authenticate()
        _workspace_client = WorkspaceClient(config = _cfg)

    headers = _header_factory() if callable(_header_factory) else _header_factory
    if headers is None:
        _cfg = None
        _header_factory = None
        raise RuntimeError("Authentication failed — could not obtain token")

    host = os.getenv("DATABRICKS_HOST").rstrip("/")

    return host, headers


# ---------------------------------------------------------------------------
# Route-optimized data-plane URL + authorization_details resolution
# ---------------------------------------------------------------------------
# Endpoints with route optimization use a dedicated data-plane host that
# bypasses the workspace control plane.  The SDK resolves this internally
# for `serving_endpoints_data_plane.query()`; for raw HTTP streaming we
# must resolve it ourselves via `serving_endpoints.get()`.
#
# The endpoint also exposes `authorization_details` — a JSON blob that
# **must** be included in the OAuth client-credentials token request so
# the resulting token is scoped for this specific serving endpoint.
# Without it, the data-plane returns 401 "Missing authorization details".
# ---------------------------------------------------------------------------

_dp_url: str | None = None
_dp_auth_details: str | None = None
_dp_info_ts: float = 0
_DP_INFO_TTL = 300  # re-resolve every 5 minutes


def _resolve_endpoint_info() -> tuple[str, str | None]:
    """Resolve the invocations URL and ``authorization_details``.

    Queries the endpoint via the control-plane API and extracts:

    * ``data_plane_info.query_info.endpoint_url`` — the route-optimized
      invocations URL.
    * ``data_plane_info.query_info.authorization_details`` — the JSON
      claim that must be sent in the OAuth token request.

    Both values are cached for ``_DP_INFO_TTL`` seconds.  Falls back to
    the standard workspace URL (no ``authorization_details``) when the
    data-plane info is unavailable.
    """
    global _dp_url, _dp_auth_details, _dp_info_ts

    if _dp_url and time.time() < _dp_info_ts + _DP_INFO_TTL:
        return _dp_url, _dp_auth_details

    _get_auth()  # ensure _workspace_client is initialised

    try:
        ep = _workspace_client.serving_endpoints.get(name=SERVING_ENDPOINT)
        qi = getattr(getattr(ep, "data_plane_info", None), "query_info", None)
        if qi and qi.endpoint_url:
            _dp_url = qi.endpoint_url
            _dp_auth_details = getattr(qi, "authorization_details", None)
            _dp_info_ts = time.time()
            logger.info(
                "Route-optimized endpoint: url=%s  auth_details=%s",
                _dp_url,
                "present" if _dp_auth_details else "absent",
            )
            return _dp_url, _dp_auth_details
    except Exception as exc:
        logger.warning(
            "Data-plane info resolution failed: %s — falling back to workspace URL", exc,
        )

    host = os.getenv("DATABRICKS_HOST", "").rstrip("/")
    _dp_url = f"https://{host}/serving-endpoints/{SERVING_ENDPOINT}/invocations"
    _dp_auth_details = None
    _dp_info_ts = time.time()
    logger.info("Using standard workspace invocations URL: %s", _dp_url)
    return _dp_url, _dp_auth_details


# ---------------------------------------------------------------------------
# OAuth token for streaming (SP client-credentials grant)
# ---------------------------------------------------------------------------
# The SDK's WorkspaceClient handles token lifecycle internally for
# _invoke_endpoint, but _invoke_endpoint_stream makes raw HTTP calls
# and therefore needs an explicit Bearer token.
#
# For route-optimized endpoints the token request MUST include the
# `authorization_details` claim obtained from the endpoint's
# data_plane_info — otherwise the data-plane rejects the call with 401.
# ---------------------------------------------------------------------------

_oauth_lock = threading.Lock()
_oauth_token: str | None = None
_oauth_expiry: float = 0
_oauth_auth_details: str | None = object()  # sentinel: != any real value


def _refresh_sp_oauth_token(authorization_details: str | None = None) -> str:
    """Exchange SP credentials for a short-lived OAuth access token."""
    global _oauth_token, _oauth_expiry, _oauth_auth_details

    host = os.getenv("DATABRICKS_HOST", "").rstrip("/")
    client_id = os.getenv("DATABRICKS_CLIENT_ID", "")
    client_secret = os.getenv("DATABRICKS_CLIENT_SECRET", "")

    if not all([host, client_id, client_secret]):
        raise RuntimeError(
            "Service principal credentials not configured — "
            "set DATABRICKS_HOST, DATABRICKS_CLIENT_ID, and "
            "DATABRICKS_CLIENT_SECRET"
        )

    post_data = {
        "grant_type": "client_credentials",
        "scope": "all-apis",
    }
    if authorization_details:
        post_data["authorization_details"] = authorization_details

    resp = requests.post(
        f"https://{host}/oidc/v1/token",
        data=post_data,
        auth=(client_id, client_secret),
        timeout=30,
    )
    resp.raise_for_status()
    data = resp.json()

    _oauth_token = data["access_token"]
    _oauth_expiry = time.time() + data.get("expires_in", 3600)
    _oauth_auth_details = authorization_details
    logger.info("SP OAuth token refreshed (expires in %ds)", data.get("expires_in", 0))
    return _oauth_token


def _get_sp_oauth_token(authorization_details: str | None = None) -> str:
    """Return a cached SP OAuth token, refreshing if expired or stale."""
    global _oauth_token, _oauth_expiry, _oauth_auth_details

    def _valid():
        return (
            _oauth_token
            and time.time() < _oauth_expiry - 300
            and _oauth_auth_details == authorization_details
        )

    if _valid():
        return _oauth_token

    with _oauth_lock:
        if _valid():
            return _oauth_token
        return _refresh_sp_oauth_token(authorization_details)


def _get_streaming_auth_headers(authorization_details: str | None = None) -> dict:
    """Return auth headers for streaming HTTP calls.

    Uses the explicit SP OAuth client-credentials flow when
    ``DATABRICKS_CLIENT_ID`` / ``DATABRICKS_CLIENT_SECRET`` are set
    (the normal Databricks Apps case).  Falls back to SDK Config headers
    otherwise (e.g. PAT-based local testing).
    """
    if os.getenv("DATABRICKS_CLIENT_ID") and os.getenv("DATABRICKS_CLIENT_SECRET"):
        token = _get_sp_oauth_token(authorization_details)
        return {"Authorization": f"Bearer {token}"}
    _, headers = _get_auth()
    return headers


# ---------------------------------------------------------------------------
# Serving endpoint invocation
# ---------------------------------------------------------------------------

async def _invoke_endpoint(payload: dict) -> dict:
    """
    POST a serialised HTTP request to the DICOMweb serving endpoint.

    Uses the shared ``httpx.AsyncClient`` so multiple in-flight requests
    are truly concurrent (no event-loop blocking).

    Returns the parsed prediction result dict.
    """
    _get_auth()

    results = await run_in_threadpool(
            lambda: _workspace_client.serving_endpoints_data_plane.query(name=SERVING_ENDPOINT, dataframe_records=[payload])
        )
    resp = json.loads(results.predictions)

    if resp['status_code'] >= 400:
        logger.error(
            "Serving endpoint HTTP %d: %s", resp['status_code'], resp[:500],
        )
        return {
            "status_code": resp['status_code'],
            "headers": {},
            "body_text": resp['body'],
            "body": "",
            "content_type": "text/plain",
        }
    
    predictions = results.predictions

    if isinstance(predictions, list) and predictions:
        pred = predictions[0]
    elif isinstance(predictions, str):
        pred = predictions
    else:
        pred = str(predictions)

    if isinstance(pred, str):
        try:
            return json.loads(pred)
        except json.JSONDecodeError:
            return _text_result(pred)
    if isinstance(pred, dict):
        return pred
    return _text_result(str(pred))


def _text_result(text: str) -> dict:
    return {
        "status_code": 200,
        "headers": {},
        "body_text": text,
        "body": "",
        "content_type": "text/plain",
    }


# ---------------------------------------------------------------------------
# zstd + base64 codec (shared between request and response paths)
# ---------------------------------------------------------------------------

def _encode(data: bytes) -> tuple[str, str]:
    """Compress *data* with zstd (if above threshold) and base64-encode.

    Returns ``(encoded_string, encoding_label)``.
    """
    if not data:
        return "", "identity"
    if len(data) >= _COMPRESS_THRESHOLD:
        compressed = zstd.compress(data)
        return base64.b64encode(compressed).decode("ascii"), "zstd+base64"
    return base64.b64encode(data).decode("ascii"), "base64"


def _decode(encoded: str, encoding: str) -> bytes:
    """Reverse of :func:`_encode`."""
    if not encoded:
        return b""
    raw = base64.b64decode(encoded)
    if encoding == "zstd+base64":
        return zstd.decompress(raw)
    return raw


# ---------------------------------------------------------------------------
# Request / Response serialisation
# ---------------------------------------------------------------------------

async def _serialize_request(request: Request) -> dict:
    """Pack an incoming HTTP request into the serving-endpoint payload.

    Request bodies above ``_COMPRESS_THRESHOLD`` are zstd-compressed
    before base64-encoding to reduce the JSON payload sent to the
    serving endpoint (STOW-RS uploads benefit significantly).
    """
    headers = {
        k: v
        for k, v in request.headers.items()
        if k.lower() in _FORWARD_HEADERS
    }

    body_bytes = b""
    if request.method in ("POST", "PUT", "PATCH"):
        body_bytes = await request.body()

    body_encoded, body_encoding = _encode(body_bytes)

    return {
        "method": request.method,
        "path": request.url.path,
        "query_string": str(request.query_params),
        "headers": json.dumps(headers),
        "body": body_encoded,
        "body_encoding": body_encoding,
    }


def _deserialize_response(result: dict) -> Response:
    """Unpack a serving-endpoint result back into an HTTP ``Response``.

    Handles three ``encoding`` values produced by the model:

    * ``"zstd+base64"`` — base64-decode then zstd-decompress
    * ``"base64"``       — plain base64-decode
    * ``"identity"``     — body is empty (or a legacy ``body_text`` field)
    """
    status_code = result.get("status_code", 200)
    content_type = result.get("content_type", "application/json")
    encoding = result.get("encoding", "")

    body_raw = result.get("body", "")
    content = _decode(body_raw, encoding)

    # Legacy fallback: older model versions may use body_text
    if not content:
        body_text = result.get("body_text", "")
        if body_text:
            content = body_text.encode("utf-8")

    skip = {"transfer-encoding", "connection", "content-length", "content-encoding"}
    headers = {
        k: v
        for k, v in result.get("headers", {}).items()
        if k.lower() not in skip
    }

    return Response(
        content=content,
        status_code=status_code,
        media_type=content_type,
        headers=headers,
    )


# ---------------------------------------------------------------------------
# Core proxy function
# ---------------------------------------------------------------------------

async def _proxy(request: Request) -> Response:
    """Proxy a single DICOMweb request through the serving endpoint."""
    t0 = time.monotonic()
    is_error = False
    try:
        payload = await _serialize_request(request)
        result = await _invoke_endpoint(payload)
        resp = _deserialize_response(result)
        if resp.status_code >= 500:
            is_error = True
        return resp
    except Exception as exc:
        is_error = True
        logger.error("Gateway proxy error: %s", exc, exc_info=True)
        return JSONResponse(
            status_code=502,
            content={"error": "Gateway error", "detail": str(exc)},
        )
    finally:
        _record_request(time.monotonic() - t0, is_error)


# ---------------------------------------------------------------------------
# Streaming proxy — uses predict_stream for chunked transfer
# ---------------------------------------------------------------------------


def _unwrap_sse_chunk(data: str) -> dict | None:
    """Parse an SSE ``data:`` payload into one of our chunk dicts.

    MLflow model serving wraps ``predict_stream`` yields in a
    ``{"predictions": "<json_string>"}`` envelope.  This helper peels
    that wrapper (if present) and returns the inner chunk dict, or
    ``None`` if the payload doesn't match our protocol.
    """
    parsed = json.loads(data)

    if isinstance(parsed, dict) and "predictions" in parsed:
        inner = parsed["predictions"]
        if isinstance(inner, str):
            parsed = json.loads(inner)
        elif isinstance(inner, dict):
            parsed = inner

    if isinstance(parsed, dict) and parsed.get("type") in ("header", "chunk", "end"):
        return parsed

    logger.debug("Unexpected SSE payload: %s", str(parsed)[:200])
    return None


def _unwrap_predict_result(raw: bytes) -> dict:
    """Parse a regular (non-streaming) ``predict`` response body.

    The serving endpoint returns ``{"predictions": "<json>"}`` (or a
    list variant).  This function unwraps it into our response dict
    (``status_code``, ``headers``, ``body``, ``encoding``, …).
    """
    result = json.loads(raw)

    if isinstance(result, dict) and "predictions" in result:
        pred = result["predictions"]
        if isinstance(pred, list) and pred:
            pred = pred[0]
        if isinstance(pred, str):
            try:
                return json.loads(pred)
            except json.JSONDecodeError:
                pass
        if isinstance(pred, dict):
            return pred

    return result if isinstance(result, dict) else {}


async def _get_endpoint_info_async() -> tuple[str, str | None]:
    """Return cached endpoint info without a thread-pool hop when possible."""
    if _dp_url and time.time() < _dp_info_ts + _DP_INFO_TTL:
        return _dp_url, _dp_auth_details
    return await run_in_threadpool(_resolve_endpoint_info)


async def _get_auth_headers_async(
    authorization_details: str | None = None,
) -> dict:
    """Return cached auth headers without a thread-pool hop when possible."""
    if (
        os.getenv("DATABRICKS_CLIENT_ID")
        and os.getenv("DATABRICKS_CLIENT_SECRET")
        and _oauth_token
        and time.time() < _oauth_expiry - 300
        and _oauth_auth_details == authorization_details
    ):
        return {"Authorization": f"Bearer {_oauth_token}"}
    return await run_in_threadpool(
        lambda: _get_streaming_auth_headers(authorization_details),
    )


async def _invoke_endpoint_stream(payload: dict):
    """
    POST to the serving endpoint requesting streaming.

    Handles **three** response shapes transparently:

    1. **True SSE** (``text/event-stream``) with raw chunk dicts —
       ``predict_stream`` yielded our protocol directly.
    2. **True SSE with MLflow wrapping** — each ``data:`` line is
       ``{"predictions": "<json_chunk>"}``; we unwrap it.
    3. **Regular JSON** (``application/json``) — ``predict`` was called
       instead of ``predict_stream`` (e.g. older MLflow or missing
       params schema).  The single response is converted into the
       header / chunk / end protocol on the fly.

    In every case the caller receives the same sequence of chunk dicts.
    """
    url, auth_details = await _get_endpoint_info_async()
    auth_headers = await _get_auth_headers_async(auth_details)

    request_body = {
        "dataframe_records": [payload],
        "params": {"stream": True},
    }

    async with _http_client.stream(
        "POST",
        url,
        json=request_body,
        headers={**auth_headers, "Accept": "text/event-stream"},
        timeout=httpx.Timeout(_TIMEOUT, connect=30.0),
    ) as resp:
        if resp.status_code != 200:
            error_body = await resp.aread()
            raise RuntimeError(
                f"Serving endpoint returned {resp.status_code}: "
                f"{error_body[:500].decode('utf-8', errors='replace')}"
            )

        content_type = resp.headers.get("content-type", "")

        if "text/event-stream" in content_type:
            # ── Path A: true SSE (predict_stream) ──────────────────
            async for line in resp.aiter_lines():
                line = line.strip()
                if not line or not line.startswith("data:"):
                    continue
                data = line[5:].strip()
                if data == "[DONE]":
                    break
                try:
                    chunk = _unwrap_sse_chunk(data)
                    if chunk is not None:
                        yield chunk
                except Exception:
                    logger.warning("Malformed SSE data: %s", data[:200])
        else:
            # ── Path B: regular predict response (fallback) ────────
            raw = await resp.aread()
            logger.info(
                "Serving endpoint returned %s (not SSE); "
                "falling back to predict-result parsing",
                content_type,
            )
            pred = _unwrap_predict_result(raw)

            yield {
                "type": "header",
                "status_code": pred.get("status_code", 200),
                "headers": pred.get("headers", {}),
                "content_type": pred.get("content_type", "application/octet-stream"),
            }
            body = pred.get("body", "")
            if body:
                yield {
                    "type": "chunk",
                    "body": body,
                    "encoding": pred.get("encoding", ""),
                }
            yield {"type": "end"}


async def _proxy_stream(request: Request) -> Response:
    """Proxy a DICOMweb request with chunked streaming from the serving endpoint.

    The first SSE chunk carries HTTP metadata (status code, headers,
    content-type).  Subsequent chunks carry base64/zstd-encoded body
    fragments that are decoded and forwarded as a
    :class:`StreamingResponse` so the client receives bytes
    incrementally.
    """
    t0 = time.monotonic()
    try:
        payload = await _serialize_request(request)
        stream = _invoke_endpoint_stream(payload)

        header_chunk = None
        async for chunk in stream:
            if chunk.get("type") == "header":
                header_chunk = chunk
                break

        if header_chunk is None:
            _record_request(time.monotonic() - t0, True)
            return JSONResponse(
                status_code=502,
                content={"error": "No header chunk in streaming response"},
            )

        status_code = header_chunk.get("status_code", 200)
        content_type = header_chunk.get("content_type", "application/octet-stream")
        resp_headers = header_chunk.get("headers", {})
        is_error = status_code >= 500

        skip = {
            "transfer-encoding", "connection",
            "content-length", "content-encoding",
        }
        clean_headers = {
            k: v for k, v in resp_headers.items()
            if k.lower() not in skip
        }

        async def _body_gen():
            try:
                async for chunk in stream:
                    ct = chunk.get("type")
                    if ct == "chunk":
                        yield _decode(
                            chunk.get("body", ""), chunk.get("encoding", ""),
                        )
                    elif ct == "end":
                        break
            finally:
                _record_request(time.monotonic() - t0, is_error)

        return StreamingResponse(
            _body_gen(),
            status_code=status_code,
            media_type=content_type,
            headers=clean_headers,
        )
    except Exception as exc:
        _record_request(time.monotonic() - t0, True)
        logger.error("Gateway stream proxy error: %s", exc, exc_info=True)
        return JSONResponse(
            status_code=502,
            content={"error": "Gateway streaming error", "detail": str(exc)},
        )


# ---------------------------------------------------------------------------
# Background metrics reporter
# ---------------------------------------------------------------------------

async def _metrics_reporter():
    """Flush gateway stats to Lakebase and push to WebSocket clients."""
    store = get_store()
    if store is None:
        logger.warning("MetricsStore unavailable — Lakebase persistence disabled")
    logger.info("Gateway metrics reporter started (interval=%.1fs)", _METRICS_INTERVAL)
    while True:
        await asyncio.sleep(_METRICS_INTERVAL)
        gw_snapshot = _snapshot_and_reset()

        if store:
            try:
                store.insert_metrics("gateway", gw_snapshot)
            except Exception as exc:
                logger.error("Gateway metrics Lakebase write: %s", exc)

        if _ws_clients:
            payload: dict = {"serving": [], "gateway": []}
            if store:
                try:
                    rows = store.get_latest_metrics(source=None, limit=300)
                    payload["serving"] = [
                        r for r in rows
                        if r["source"].startswith("serving")
                    ]
                    payload["gateway"] = [
                        r for r in rows if r["source"] == "gateway"
                    ]
                except Exception as exc:
                    logger.error("Lakebase read for WS broadcast: %s", exc)

            if not payload["gateway"]:
                payload["gateway"] = [{
                    "source": "gateway",
                    "recorded_at": datetime.now(timezone.utc).isoformat(),
                    "metrics": gw_snapshot,
                }]
            await _broadcast_metrics(payload)


# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------

@asynccontextmanager
async def _lifespan(application: FastAPI):
    global _http_client
    _http_client = httpx.AsyncClient(
        http2=True,
        limits=httpx.Limits(
            max_connections=int(os.getenv("DICOMWEB_MAX_CONNECTIONS", "200")),
            max_keepalive_connections=int(
                os.getenv("DICOMWEB_MAX_KEEPALIVE", "100"),
            ),
        ),
    )
    task = asyncio.create_task(_metrics_reporter())
    yield
    task.cancel()
    await _http_client.aclose()
    _http_client = None

app = FastAPI(
    title="DICOMweb Gateway",
    description=(
        "Translates DICOMweb REST API calls to a "
        "Databricks Model Serving endpoint"
    ),
    version="1.0.0",
    lifespan=_lifespan,
)


# ── QIDO-RS ──────────────────────────────────────────────────────────────

@app.get("/api/dicomweb/studies", tags=["QIDO-RS"])
async def search_studies(request: Request):
    return await _proxy_stream(request)


@app.get("/api/dicomweb/all_series", tags=["QIDO-RS"])
async def search_all_series(request: Request):
    return await _proxy_stream(request)


@app.get(
    "/api/dicomweb/studies/{study_uid}/series",
    tags=["QIDO-RS"],
)
async def search_series(request: Request, study_uid: str):
    return await _proxy_stream(request)


@app.get(
    "/api/dicomweb/studies/{study_uid}/series/{series_uid}/instances",
    tags=["QIDO-RS"],
)
async def search_instances(
    request: Request, study_uid: str, series_uid: str,
):
    return await _proxy_stream(request)


# ── WADO-RS ──────────────────────────────────────────────────────────────

@app.get(
    "/api/dicomweb/studies/{study_uid}/series/{series_uid}/metadata",
    tags=["WADO-RS"],
)
async def retrieve_series_metadata(
    request: Request, study_uid: str, series_uid: str,
):
    return await _proxy_stream(request)


@app.get(
    "/api/dicomweb/studies/{study_uid}/series/{series_uid}"
    "/instances/{sop_uid}/frames/{frame_list}",
    tags=["WADO-RS"],
)
async def retrieve_instance_frames(
    request: Request,
    study_uid: str,
    series_uid: str,
    sop_uid: str,
    frame_list: str,
):
    return await _proxy_stream(request)


@app.get(
    "/api/dicomweb/studies/{study_uid}/series/{series_uid}"
    "/instances/{sop_uid}",
    tags=["WADO-RS"],
)
async def retrieve_instance(
    request: Request, study_uid: str, series_uid: str, sop_uid: str,
):
    return await _proxy_stream(request)


# ── WADO-URI (legacy) ────────────────────────────────────────────────────

@app.get("/api/dicomweb/wado", tags=["WADO-URI"])
async def wado_uri(request: Request):
    return await _proxy_stream(request)


@app.get("/api/dicomweb", tags=["WADO-URI"])
async def wado_uri_base(request: Request):
    if request.query_params.get("requestType", "").upper() == "WADO":
        return await _proxy_stream(request)
    return {
        "service": "DICOMweb Gateway",
        "endpoint": SERVING_ENDPOINT,
        "status": "active",
    }


# ── STOW-RS ──────────────────────────────────────────────────────────────

@app.post("/api/dicomweb/studies/{study_uid}", tags=["STOW-RS"])
async def store_instances_study(request: Request, study_uid: str):
    return await _proxy_stream(request)


@app.post("/api/dicomweb/studies", tags=["STOW-RS"])
async def store_instances(request: Request):
    return await _proxy_stream(request)


# ── Auxiliary ────────────────────────────────────────────────────────────

@app.post("/api/dicomweb/resolve_paths", tags=["Path Resolution"])
async def resolve_paths(request: Request):
    return await _proxy_stream(request)


@app.post("/api/dicomweb/prime", tags=["Cache Priming"])
async def prime_series(request: Request):
    return await _proxy_stream(request)


@app.get("/api/dicomweb/", tags=["DICOMweb"])
async def dicomweb_root():
    return {
        "service": "DICOMweb Gateway for Databricks Pixels",
        "endpoint": SERVING_ENDPOINT,
        "documentation": "https://www.dicomstandard.org/using/dicomweb",
        "services": {
            "QIDO-RS": [
                "GET /api/dicomweb/studies",
                "GET /api/dicomweb/all_series",
                "GET /api/dicomweb/studies/{study}/series",
                "GET /api/dicomweb/studies/{study}/series/{series}/instances",
            ],
            "WADO-RS": [
                "GET /api/dicomweb/studies/{study}/series/{series}/metadata",
                "GET .../instances/{instance}",
                "GET .../instances/{instance}/frames/{frameList}",
            ],
            "STOW-RS": [
                "POST /api/dicomweb/studies",
                "POST /api/dicomweb/studies/{study}",
            ],
            "WADO-URI": [
                "GET /api/dicomweb/wado?requestType=WADO&studyUID=...&seriesUID=...&objectUID=...",
            ],
        },
    }


# ── Monitoring ───────────────────────────────────────────────────────────

@app.get("/api/metrics", tags=["Monitoring"])
async def metrics():
    """Return the latest metrics from both serving and gateway (via Lakebase)."""
    store = get_store()
    if store is None:
        return JSONResponse(
            status_code=503,
            content={"error": "MetricsStore not available"},
        )
    rows = store.get_latest_metrics(source=None, limit=300)
    serving = [r for r in rows if r["source"].startswith("serving")]
    gateway = [r for r in rows if r["source"] == "gateway"]
    return JSONResponse(content={
        "serving": serving,
        "gateway": gateway,
    })


@app.websocket("/ws/metrics")
async def ws_metrics(websocket: WebSocket):
    """Stream live metrics to the dashboard over a persistent WebSocket."""
    await websocket.accept()
    _ws_clients.add(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        _ws_clients.discard(websocket)


@app.get("/api/dashboard", tags=["Monitoring"])
async def dashboard():
    """Serve the live metrics dashboard."""
    import pathlib
    html_path = pathlib.Path(__file__).parent / "pages" / "dashboard.html"
    html = html_path.read_text()
    return HTMLResponse(content=html)


# ── Health ───────────────────────────────────────────────────────────────

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "endpoint": SERVING_ENDPOINT}


# ── Middleware ───────────────────────────────────────────────────────────

class _Options200(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        if request.method == "OPTIONS":
            return Response(status_code=200)
        return await call_next(request)


app.add_middleware(_Options200)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
