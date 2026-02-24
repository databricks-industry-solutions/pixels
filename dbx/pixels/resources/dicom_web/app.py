"""
Pixels OHIF Viewer — Databricks App hosting the OHIF viewer and
auxiliary APIs (MONAI proxy, redaction, VLM analysis).

DICOMweb protocol calls (QIDO-RS, WADO-RS, WADO-URI, STOW-RS) are
reverse-proxied to a dedicated DICOMweb Gateway application specified
by the ``DICOMWEB_GATEWAY_URL`` environment variable.
"""

import logging
import os
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse, StreamingResponse
from starlette.background import BackgroundTask
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from dbx.pixels.resources.common.middleware import (
    LoggingMiddleware,
    TokenMiddleware,
)
from dbx.pixels.resources.common.routes import register_all_common_routes
import dbx.pixels.version as dbx_pixels_version

logger = logging.getLogger("DICOMweb.Viewer")

GATEWAY_URL = os.getenv("DICOMWEB_GATEWAY_URL", "").rstrip("/")

_http_client: httpx.AsyncClient | None = None

_SKIP_PROXY_HEADERS = frozenset({
    "host", "content-length", "transfer-encoding",
})


# ---------------------------------------------------------------------------
# Reverse proxy — forwards DICOMweb requests to the gateway
# ---------------------------------------------------------------------------

async def _proxy_to_gateway(request: Request) -> Response:
    """Reverse-proxy a request to the DICOMweb gateway, streaming the
    response back to the client without buffering it in memory."""
    if not GATEWAY_URL:
        return JSONResponse(
            status_code=503,
            content={"error": "DICOMWEB_GATEWAY_URL not configured"},
        )

    target_url = f"{GATEWAY_URL}{request.url.path}"
    if request.query_params:
        target_url += f"?{request.query_params}"

    forward_headers = {
        k: v for k, v in request.headers.items()
        if k.lower() not in _SKIP_PROXY_HEADERS
    }

    user_token = request.headers.get("x-forwarded-access-token")
    if user_token:
        forward_headers["authorization"] = f"Bearer {user_token}"
    forward_headers["user-agent"] = f"DatabricksPixels/{dbx_pixels_version}_dicomweb_client"

    body = (
        await request.body()
        if request.method in ("POST", "PUT", "PATCH")
        else None
    )

    try:
        req = _http_client.build_request(
            request.method,
            target_url,
            headers=forward_headers,
            content=body,
        )
        resp = await _http_client.send(req, stream=True)

        skip = {"transfer-encoding", "connection"}
        resp_headers = {
            k: v for k, v in resp.headers.items()
            if k.lower() not in skip
        }

        return StreamingResponse(
            resp.aiter_raw(),
            status_code=resp.status_code,
            headers=resp_headers,
            media_type=resp.headers.get("content-type"),
            background=BackgroundTask(resp.aclose),
        )
    except Exception as exc:
        logger.error("Gateway proxy error: %s", exc, exc_info=True)
        return JSONResponse(
            status_code=502,
            content={"error": "Gateway proxy error", "detail": str(exc)},
        )


def register_dicomweb_proxy(app: FastAPI):
    """Register routes that proxy DICOMweb calls to the gateway."""

    @app.api_route(
        "/api/dicomweb/{path:path}",
        methods=["GET", "POST", "PUT", "DELETE"],
        tags=["DICOMweb Proxy"],
    )
    async def dicomweb_proxy(request: Request, path: str):
        return await _proxy_to_gateway(request)

    @app.api_route(
        "/api/dicomweb",
        methods=["GET"],
        tags=["DICOMweb Proxy"],
    )
    async def dicomweb_proxy_root(request: Request):
        return await _proxy_to_gateway(request)

    @app.get("/api/metrics", tags=["Monitoring"])
    async def metrics_proxy(request: Request):
        return await _proxy_to_gateway(request)


# ------------------------------------------------------------------
# App definition
# ------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    global _http_client
    _http_client = httpx.AsyncClient(
        http2=False,
        follow_redirects=True,
        timeout=httpx.Timeout(300.0, connect=30.0),
        limits=httpx.Limits(
            max_connections=int(os.getenv("DICOMWEB_MAX_CONNECTIONS", "200")),
            max_keepalive_connections=int(
                os.getenv("DICOMWEB_MAX_KEEPALIVE", "100"),
            ),
        ),
    )
    yield
    await _http_client.aclose()
    _http_client = None


app = FastAPI(
    title="Pixels OHIF Viewer",
    description=(
        "OHIF viewer with MONAI, redaction, and VLM analysis. "
        "DICOMweb calls are proxied to the gateway."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# ── DICOMweb proxy to gateway ─────────────────────────────────────
register_dicomweb_proxy(app)

# ── Shared common routes (OHIF, MONAI, redaction, VLM) ────────────
register_all_common_routes(app)

# ── Middleware (order matters: first added = outermost) ────────────
#app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(TokenMiddleware, default_data_source="pixelsdicomweb", dicomweb_root="/api/dicomweb")
app.add_middleware(LoggingMiddleware)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_config=None)
