"""
Pixels OHIF Viewer — Databricks App hosting the OHIF viewer and
auxiliary APIs (MONAI proxy, redaction, VLM analysis).

DICOMweb protocol calls (QIDO-RS, WADO-RS, WADO-URI, STOW-RS) are
reverse-proxied to a dedicated DICOMweb Gateway application specified
by the ``DICOMWEB_GATEWAY_URL`` environment variable.
"""

import os
import time
import uuid
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, Request, Response
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from starlette.background import BackgroundTask
from starlette.types import ASGIApp, Receive, Scope, Send

from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("DICOMweb.Viewer")

# ---------------------------------------------------------------------------
# OHIF bootstrap — download static viewer assets from UC Volume on first start
# ---------------------------------------------------------------------------
_OHIF_DIR = os.environ.get("OHIF_STATIC_DIR", "")
if _OHIF_DIR.startswith("/Volumes/"):
    import tarfile

    _local_ohif = "/tmp/ohif"
    if not os.path.isdir(_local_ohif):
        from databricks.sdk import WorkspaceClient

        _archive_path = _OHIF_DIR.rstrip("/") + ".tar.gz"
        logger.info("Downloading OHIF from %s ...", _archive_path)
        _resp = WorkspaceClient().files.download(_archive_path)
        with open("/tmp/ohif.tar.gz", "wb") as _f:
            _f.write(_resp.contents.read())
        with tarfile.open("/tmp/ohif.tar.gz", "r:gz") as _tar:
            _tar.extractall("/tmp")
        os.remove("/tmp/ohif.tar.gz")
        logger.info("OHIF extracted to %s (%d entries)", _local_ohif, len(os.listdir(_local_ohif)))
    os.environ["OHIF_STATIC_DIR"] = _local_ohif

import dbx.pixels.version as dbx_pixels_version
from dbx.pixels.common.middleware import LoggingMiddleware, TokenMiddleware
from dbx.pixels.common.routes import register_all_common_routes

GATEWAY_URL = os.getenv("DICOMWEB_GATEWAY_URL", "").rstrip("/")

_http_client: httpx.AsyncClient | None = None
_proxy_in_flight = 0
_PROXY_DIAG_HEADERS = os.getenv("DICOMWEB_PROXY_DIAG_HEADERS", "false").strip().lower() in (
    "1",
    "true",
    "yes",
)
_PROXY_DIAG_LOG_WARNING = os.getenv("DICOMWEB_PROXY_DIAG_LOG_WARNING", "false").strip().lower() in (
    "1",
    "true",
    "yes",
)

_SKIP_PROXY_HEADERS = frozenset(
    {
        "host",
        "content-length",
        "transfer-encoding",
        #"cookie",
        "x-forwarded-access-token",
        "x-forwarded-user",
        "x-forwarded-email",
        "x-forwarded-preferred-username",
        "x-forwarded-host",
        "x-forwarded-for",
        "x-forwarded-proto",
        "x-real-ip",
        "traceparent",
        "tracestate",
    }
)

# Prefixes whose headers must NEVER be replayed app-to-app. These are set by
# the receiving app's Databricks Apps proxy on its own ingress hop; replaying
# them causes the gateway proxy to reject with "Unsupported request" (400).
_SKIP_PROXY_HEADER_PREFIXES = ("x-databricks-", "x-envoy-")


def _is_skipped_header(name: str) -> bool:
    n = name.lower()
    if n in _SKIP_PROXY_HEADERS:
        return True
    return any(n.startswith(p) for p in _SKIP_PROXY_HEADER_PREFIXES)


# ---------------------------------------------------------------------------
# Reverse proxy — forwards DICOMweb requests to the gateway
# ---------------------------------------------------------------------------


async def _proxy_to_gateway(request: Request) -> Response:
    """Reverse-proxy a request to the DICOMweb gateway, streaming the
    response back to the client without buffering it in memory."""
    global _proxy_in_flight
    if not GATEWAY_URL:
        logger.error(
            "VIEWER_PROXY_CONFIG_ERROR method=%s path=%s — DICOMWEB_GATEWAY_URL not configured",
            request.method,
            request.url.path,
        )
        return JSONResponse(
            status_code=503,
            content={"error": "DICOMWEB_GATEWAY_URL not configured"},
        )

    target_url = f"{GATEWAY_URL}{request.url.path}"
    if request.query_params:
        target_url += f"?{request.query_params}"

    forward_headers = {
        k: v for k, v in request.headers.items() if not _is_skipped_header(k)
    }

    user_token = request.headers.get("x-forwarded-access-token") or request.headers.get(
        "access-token"
    )
    if user_token:
        forward_headers["authorization"] = f"Bearer {user_token}"
        # Custom header — the gateway's Databricks Apps proxy strips
        # ``Authorization`` and does not inject ``X-Forwarded-Access-Token`` on
        # cross-app calls. We tunnel the user's token in a non-standard header
        # the proxy passes through unchanged, and the gateway's
        # ``resolve_user_token`` falls back to it for OBO downstream calls.
        forward_headers["x-pixels-user-token"] = user_token
    forward_headers["user-agent"] = (
        f"DatabricksPixels/{dbx_pixels_version.__version__}/dicomweb_client"
    )

    # Propagate (or mint) X-Request-ID so a single trace id threads
    # viewer logs → gateway logs → SQL/Volumes logs.
    req_id = request.headers.get("x-request-id") or f"rq-{uuid.uuid4().hex[:12]}"
    forward_headers["x-request-id"] = req_id

    body = await request.body() if request.method in ("POST", "PUT", "PATCH") else None
    t0 = time.perf_counter()
    _proxy_in_flight += 1
    inflight_start = _proxy_in_flight

    # ---- Detailed DEBUG dump of outgoing request to gateway ----
    def _redact(name: str, value: str) -> str:
        n = name.lower()
        if n == "authorization":
            scheme, _, tok = value.partition(" ")
            return f"{scheme} <REDACTED len={len(tok)} prefix={tok[:6]}…>"
        if "token" in n or "secret" in n or "key" in n or n == "cookie":
            return f"<REDACTED len={len(value)}>"
        return value

    _redacted_inbound = {k: _redact(k, v) for k, v in request.headers.items()}
    _redacted_forward = {k: _redact(k, v) for k, v in forward_headers.items()}
    _body_preview = ""
    if body is not None:
        try:
            _body_preview = body[:512].decode("utf-8", errors="replace")
        except Exception:
            _body_preview = f"<{len(body)} bytes binary>"

    logger.debug(
        "VIEWER_PROXY_ENTER req_id=%s method=%s path=%s qs=%s "
        "has_user_token=%s inflight_start=%d target=%s\n"
        "  inbound_headers=%s\n"
        "  forward_headers=%s\n"
        "  body_len=%d body_preview=%r",
        req_id,
        request.method,
        request.url.path,
        str(request.query_params),
        bool(user_token),
        inflight_start,
        target_url,
        _redacted_inbound,
        _redacted_forward,
        len(body) if body else 0,
        _body_preview,
    )

    try:
        req = _http_client.build_request(
            request.method,
            target_url,
            headers=forward_headers,
            content=body,
        )
        resp = await _http_client.send(req, stream=True)
        upstream_ttfb_ms = (time.perf_counter() - t0) * 1000.0

        skip = {"transfer-encoding", "connection"}
        resp_headers = {k: v for k, v in resp.headers.items() if k.lower() not in skip}

        # ---- On non-2xx, buffer body and log everything for diagnosis ----
        if resp.status_code >= 400:
            err_body = await resp.aread()
            await resp.aclose()
            _proxy_in_flight = max(0, _proxy_in_flight - 1)
            try:
                err_preview = err_body[:2048].decode("utf-8", errors="replace")
            except Exception:
                err_preview = f"<{len(err_body)} bytes binary>"
            logger.error(
                "VIEWER_PROXY_UPSTREAM_ERROR req_id=%s method=%s path=%s target=%s "
                "status=%s upstream_ttfb_ms=%.1f\n"
                "  resp_headers=%s\n"
                "  resp_body_len=%d resp_body_preview=%r",
                req_id,
                request.method,
                request.url.path,
                target_url,
                resp.status_code,
                upstream_ttfb_ms,
                dict(resp.headers),
                len(err_body),
                err_preview,
            )
            return Response(
                content=err_body,
                status_code=resp.status_code,
                headers=resp_headers,
                media_type=resp.headers.get("content-type"),
            )

        if _PROXY_DIAG_HEADERS:
            resp_headers["x-vp-request-id"] = req_id
            resp_headers["x-vp-upstream-ttfb-ms"] = f"{upstream_ttfb_ms:.1f}"
            resp_headers["x-vp-inflight-start"] = str(inflight_start)
            existing_timing = resp_headers.get("server-timing", "")
            vp_timing = f"vp_upstream_ttfb;dur={upstream_ttfb_ms:.1f}"
            resp_headers["server-timing"] = (
                f"{existing_timing}, {vp_timing}" if existing_timing else vp_timing
            )

        async def _close_upstream() -> None:
            global _proxy_in_flight
            try:
                await resp.aclose()
            finally:
                total_ms = (time.perf_counter() - t0) * 1000.0
                _proxy_in_flight = max(0, _proxy_in_flight - 1)
                log_fn = logger.warning if _PROXY_DIAG_LOG_WARNING else logger.info
                log_fn(
                    "VIEWER_PROXY_DIAG id=%s method=%s path=%s status=%s "
                    "upstream_ttfb_ms=%.1f stream_total_ms=%.1f "
                    "inflight_start=%d inflight_end=%d",
                    req_id,
                    request.method,
                    request.url.path,
                    resp.status_code,
                    upstream_ttfb_ms,
                    total_ms,
                    inflight_start,
                    _proxy_in_flight,
                )

        return StreamingResponse(
            resp.aiter_raw(),
            status_code=resp.status_code,
            headers=resp_headers,
            media_type=resp.headers.get("content-type"),
            background=BackgroundTask(_close_upstream),
        )
    except Exception as exc:
        _proxy_in_flight = max(0, _proxy_in_flight - 1)
        logger.error(
            "VIEWER_PROXY_ERROR req_id=%s method=%s path=%s target=%s: %s",
            req_id,
            request.method,
            request.url.path,
            target_url,
            exc,
            exc_info=True,
        )
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
        # Allow request multiplexing to the gateway when supported.
        http2=True,
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

EXCLUDED_PATHS = ["/instances/"]


class SelectiveGZipMiddleware:
    def __init__(self, app: ASGIApp, minimum_size: int = 1000):
        self.app = app
        # Initialize the GZip middleware once, wrapping the base app
        self.gzip_app = GZipMiddleware(app, minimum_size=minimum_size)

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        # We only care about HTTP requests
        if scope["type"] == "http":
            path = scope.get("path", "")

            # If the path matches our exclusion list, skip GZip entirely
            if any(excluded in path for excluded in EXCLUDED_PATHS):
                return await self.app(scope, receive, send)

            # Otherwise, pass the request through the GZip app
            return await self.gzip_app(scope, receive, send)

        # Pass non-HTTP connections (like websockets) through untouched
        await self.app(scope, receive, send)


# ── DICOMweb proxy to gateway ─────────────────────────────────────
register_dicomweb_proxy(app)

# ── Shared common routes (OHIF, MONAI, redaction, VLM) ────────────
register_all_common_routes(app)

# ── Middleware (order matters: first added = outermost) ────────────
app.add_middleware(SelectiveGZipMiddleware)
app.add_middleware(
    TokenMiddleware, default_data_source="pixelsdicomweb", dicomweb_root="/api/dicomweb"
)
app.add_middleware(LoggingMiddleware)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, log_config=None)
