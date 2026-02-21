"""
Shared Starlette middleware for Pixels applications.

- **TokenMiddleware** — intercepts OHIF JS requests and injects config values
  (pixels table, router basename, host) into the config template.
- **LoggingMiddleware** — logs every request with user e-mail, method, path,
  status code, and elapsed time.
- **DBStaticFiles** — custom ``StaticFiles`` that falls back to ``index.html``
  on 404 (SPA support for OHIF viewer).
"""

import time

from fastapi import HTTPException, Response
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from dbx.pixels.resources.common.config import (
    get_pixels_table,
    logger,
    ohif_config_file,
    ohif_path,
)


class TokenMiddleware(BaseHTTPMiddleware):
    """Inject runtime config into OHIF JavaScript on the fly.

    Parameters
    ----------
    app : ASGIApp
        The ASGI application (injected by Starlette).
    default_data_source : str
        The OHIF data-source name to activate by default.
        Use ``"databricksPixelsDicom"`` for the legacy Lakehouse app and
        ``"dicomweb"`` for the DICOMweb app.
    dicomweb_root : str
        Base URL for the DICOMweb endpoints (e.g. ``"/api/dicomweb"``).
        Only relevant when *default_data_source* is ``"dicomweb"``.
    """

    def __init__(self, app, default_data_source: str = "databricksPixelsDicom", dicomweb_root: str = "/api/dicomweb"):
        super().__init__(app)
        self.default_data_source = default_data_source
        self.dicomweb_root = dicomweb_root

    async def dispatch(self, request: Request, call_next):
        if request.url.path.endswith("app-config-custom.js"):
            pixels_table = get_pixels_table(request)
            body = open(f"{ohif_path}/{ohif_config_file}.js", "rb").read()
            new_body = (
                body.replace(b"{ROUTER_BASENAME}", b"/ohif/")
                .replace(b"{PIXELS_TABLE}", pixels_table.encode())
                .replace(b"{HOST_NAME}", b"/sqlwarehouse")
                .replace(b"{DEFAULT_DATA_SOURCE}", self.default_data_source.encode())
                .replace(b"{DICOMWEB_ROOT}", self.dicomweb_root.encode())
            )
            return Response(content=new_body, media_type="text/javascript")

        if request.url.path.endswith("local"):
            body = open(f"{ohif_path}/index.html", "rb").read()
            return Response(
                content=body.replace(b"./", b"/ohif/"), media_type="text/html"
            )

        if (
            request.url.path.startswith("/ohif/app.bundle.")
            and request.url.path.endswith(".js")
        ):
            file_name = request.url.path.split("/")[-1]
            logger.debug(f"Patching HTJ2K decoder in {file_name}")
            body = open(f"{ohif_path}/{file_name}", "rb").read()
            return Response(
                content=body.replace(b"(decodeHTJ2K_local.codec)", b"(false)"),
                media_type="text/javascript",
            )

        return await call_next(request)


class LoggingMiddleware(BaseHTTPMiddleware):
    """Log every request with the caller's e-mail."""

    async def dispatch(self, request: Request, call_next):
        email = request.headers.get("X-Forwarded-Email", "")
        start = time.perf_counter()
        response = await call_next(request)
        elapsed_ms = (time.perf_counter() - start) * 1000
        logger.info(
            f" {email} | {request.method} {request.url.path} {response.status_code} [{elapsed_ms:.1f}ms]"
        )
        return response


class DBStaticFiles(StaticFiles):
    """StaticFiles subclass that serves ``index.html`` on 404 (SPA fallback)."""

    async def get_response(self, path: str, scope):
        try:
            return await super().get_response(path, scope)
        except (HTTPException, StarletteHTTPException) as ex:
            if ex.status_code == 404:
                return await super().get_response("index.html", scope)
            raise

