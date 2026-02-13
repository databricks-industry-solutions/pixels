"""
Shared Starlette middleware for Pixels applications.

- **TokenMiddleware** — intercepts OHIF JS requests and injects config values
  (pixels table, router basename, host) into the config template.
- **LoggingMiddleware** — logs every request with user e-mail, method, path,
  and status code.
- **DBStaticFiles** — custom ``StaticFiles`` that falls back to ``index.html``
  on 404 (SPA support for OHIF viewer).
"""

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
    """Inject runtime config into OHIF JavaScript on the fly."""

    async def dispatch(self, request: Request, call_next):
        if request.url.path.endswith("app-config-custom.js"):
            pixels_table = get_pixels_table(request)
            body = open(f"{ohif_path}/{ohif_config_file}.js", "rb").read()
            new_body = (
                body.replace(b"{ROUTER_BASENAME}", b"/ohif/")
                .replace(b"{PIXELS_TABLE}", pixels_table.encode())
                .replace(b"{HOST_NAME}", b"/sqlwarehouse")
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
        response = await call_next(request)
        logger.info(
            f" {email} | {request.method} {request.url.path} {response.status_code}"
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

