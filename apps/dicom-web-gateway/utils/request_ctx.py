"""
Request-scoped context for trace logging.

A ``contextvars.ContextVar`` carrying a per-request id that is set by the
gateway's instrumentation middleware (or the viewer's reverse proxy) and
read by every downstream layer — SQL client, Volumes I/O, handlers — so
log lines from a single ``/api/dicomweb/*`` call can be correlated.

ContextVars propagate across ``asyncio.to_thread`` and Starlette's
``iterate_in_threadpool`` (both copy the current context).  Bare
``concurrent.futures.ThreadPoolExecutor.submit`` does **not** propagate;
callers in that case should pass the id explicitly.
"""

import contextvars
import uuid

request_id_var: contextvars.ContextVar[str] = contextvars.ContextVar(
    "pixels_request_id", default="-"
)


def current_request_id() -> str:
    """Return the active request id, or ``'-'`` when no request is in scope."""
    return request_id_var.get()


def new_request_id() -> str:
    """Mint a short, opaque request id."""
    return f"rq-{uuid.uuid4().hex[:12]}"
