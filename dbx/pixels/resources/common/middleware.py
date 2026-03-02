"""
Shared Starlette middleware for Pixels applications.

- **TokenMiddleware** — intercepts OHIF JS requests and injects config values
  (pixels table, router basename, host) into the config template.
- **LoggingMiddleware** — logs every request with user e-mail, method, path,
  status code, and elapsed time (TTFB — time to first byte, not full body delivery).
- **DBStaticFiles** — custom ``StaticFiles`` that falls back to ``index.html``
  on 404 (SPA support for OHIF viewer).

Both middleware classes are implemented as pure ASGI callables rather than
``BaseHTTPMiddleware`` subclasses.  ``BaseHTTPMiddleware`` wraps every request
in an ``anyio`` task group and buffers response bodies, adding per-request
overhead that compounds on asset-heavy pages.  Pure ASGI middleware calls
``app(scope, receive, send)`` directly with zero extra task scheduling.
"""

import time
from functools import lru_cache

import anyio
from fastapi import HTTPException, Response
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.requests import Request
from starlette.types import ASGIApp, Receive, Scope, Send

from dbx.pixels.resources.common.config import (
    get_pixels_table,
    logger,
    ohif_config_file,
    ohif_path,
)


@lru_cache(maxsize=8)
def _read_static_file(path: str) -> bytes:
    """Read a deploy-time-static file and cache it in memory.

    Only use this for files that are identical for every user and every request
    (JS bundles, index.html).  Do NOT use it for anything derived from request
    context — load those once at middleware init time instead.

    Always call this via ``anyio.to_thread.run_sync`` from async code.  The
    first call performs a real disk read (potentially several MB); subsequent
    calls return the cached bytes.  Either way, keeping it off the event loop
    avoids stalling concurrent requests.
    """
    return open(path, "rb").read()


async def _read_static_file_async(path: str) -> bytes:
    """Async wrapper for ``_read_static_file`` that never blocks the event loop."""
    return await anyio.to_thread.run_sync(_read_static_file, path)


class TokenMiddleware:
    """Inject runtime config into OHIF JavaScript on the fly.

    Implemented as a pure ASGI callable to avoid the per-request task-group
    overhead of ``BaseHTTPMiddleware``.

    Parameters
    ----------
    app : ASGIApp
        The ASGI application to wrap.
    default_data_source : str
        The OHIF data-source name to activate by default.
        Use ``"databricksPixelsDicom"`` for the legacy Lakehouse app and
        ``"dicomweb"`` for the DICOMweb app.
    dicomweb_root : str
        Base URL for the DICOMweb endpoints (e.g. ``"/api/dicomweb"``).
        Only relevant when *default_data_source* is ``"dicomweb"``.
    """

    def __init__(
        self,
        app: ASGIApp,
        default_data_source: str = "databricksPixelsDicom",
        dicomweb_root: str = "/api/dicomweb",
    ):
        self.app = app
        self.default_data_source = default_data_source
        self.dicomweb_root = dicomweb_root
        # Read the config template once at startup.  The file is the same for
        # all users; per-user values ({PIXELS_TABLE} etc.) are substituted at
        # request time and never stored.
        self._config_template: bytes = open(f"{ohif_path}/{ohif_config_file}.js", "rb").read()

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        path: str = scope["path"]

        if path.endswith("app-config-custom.js"):
            request = Request(scope, receive)
            pixels_table = get_pixels_table(request)
            new_body = (
                self._config_template.replace(b"{ROUTER_BASENAME}", b"/ohif/")
                .replace(b"{PIXELS_TABLE}", pixels_table.encode())
                .replace(b"{HOST_NAME}", b"/sqlwarehouse")
                .replace(b"{DEFAULT_DATA_SOURCE}", self.default_data_source.encode())
                .replace(b"{DICOMWEB_ROOT}", self.dicomweb_root.encode())
            )
            await Response(content=new_body, media_type="text/javascript")(scope, receive, send)
            return

        if path.endswith("local"):
            body = await _read_static_file_async(f"{ohif_path}/index.html")
            await Response(content=body.replace(b"./", b"/ohif/"), media_type="text/html")(
                scope, receive, send
            )
            return

        if False and path.startswith("/ohif/app.bundle.") and path.endswith(".js"):
            file_name = path.split("/")[-1]
            logger.debug(f"Patching HTJ2K decoder in {file_name}")
            body = await _read_static_file_async(f"{ohif_path}/{file_name}")
            await Response(
                content=body.replace(b"(decodeHTJ2K_local.codec)", b"(false)"),
                media_type="text/javascript",
            )(scope, receive, send)
            return

        await self.app(scope, receive, send)


class LoggingMiddleware:
    """Log every request with the caller's e-mail.

    Implemented as a pure ASGI callable.  The ``send`` callable is wrapped to
    capture the HTTP status code from the ``http.response.start`` message
    without buffering the response body.

    Note: elapsed time reflects TTFB (time-to-first-byte) — the interval from
    receiving the request to sending the first response message.  It does *not*
    include body transmission time, so large assets will appear fast in logs
    even when the browser download takes longer.
    """

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        request = Request(scope, receive)
        email = request.headers.get("X-Forwarded-Email", "")
        start = time.perf_counter()
        status_code = 0

        async def send_wrapper(message) -> None:
            nonlocal status_code
            if message["type"] == "http.response.start":
                status_code = message["status"]
                elapsed_ms = (time.perf_counter() - start) * 1000
                logger.info(
                    f" {email} | {request.method} {request.url.path}"
                    f" {status_code} [{elapsed_ms:.1f}ms ttfb]"
                )
            await send(message)

        await self.app(scope, receive, send_wrapper)


class DBStaticFiles(StaticFiles):
    """StaticFiles subclass that serves ``index.html`` on 404 (SPA fallback)."""

    async def get_response(self, path: str, scope):
        try:
            return await super().get_response(path, scope)
        except (HTTPException, StarletteHTTPException) as ex:
            if ex.status_code == 404:
                return await super().get_response("index.html", scope)
            raise
