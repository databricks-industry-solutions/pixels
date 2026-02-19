"""
MLflow PyFunc model wrapping the DICOMweb FastAPI application.

Deployed on a Databricks Model Serving endpoint:

* **load_context** — builds a minimal FastAPI app with all DICOMweb routes
  (QIDO-RS, WADO-RS, WADO-URI, STOW-RS) and initialises the backing
  infrastructure (SQL client, Lakebase, caches, token provider).
* **predict** — accepts an HTTP-request representation (method, path,
  query_string, headers, body), routes it through the in-process ASGI
  app via ``httpx.ASGITransport``, and returns the serialised HTTP response.

Typical deployment flow::

    1. Log this model with ``mlflow.pyfunc.log_model`` (see ``log_model.py``).
    2. Register in the MLflow Model Registry.
    3. Create a Databricks Model Serving endpoint backed by this model.
    4. Point the *DICOMweb Gateway* Databricks App at the endpoint.
"""

import asyncio
import base64
import json
import logging
import os
import socket
import sys
import threading
import time

import mlflow
import zstd

logger = logging.getLogger(__name__)

_REQUEST_TIMEOUT = float(os.getenv("DICOMWEB_PREDICT_TIMEOUT", "300"))
_METRICS_INTERVAL = float(os.getenv("DICOMWEB_METRICS_INTERVAL", "1"))
_STREAM_CHUNK_SIZE = int(os.getenv("DICOMWEB_STREAM_CHUNK_SIZE", "262144"))

# Payloads smaller than this are sent as plain base64 — the zstd frame
# header (~12 bytes) and dictionary overhead aren't worth it.
_COMPRESS_THRESHOLD = 512


def _resolve_node_id() -> str:
    """Derive a unique node identifier for this serving replica.

    On Databricks Model Serving every replica shares the same generic
    hostname (``mlflow-server.host.local``), so ``socket.gethostname()``
    alone cannot distinguish replicas.  This function tries several
    strategies in order:

    1. Explicit ``DICOMWEB_NODE_ID`` environment variable (operator override).
    2. Container ID from ``/proc/self/cgroup`` (Docker / K8s).
    3. Container ID from ``/proc/1/cpuset`` (older cgroup v1 setups).
    4. ``socket.gethostname()`` if it looks unique (non-generic).
    5. Short random UUID as a last resort.
    """
    import uuid

    explicit = os.getenv("DICOMWEB_NODE_ID")
    if explicit:
        return explicit

    for proc_path in ("/proc/self/cgroup", "/proc/1/cpuset"):
        try:
            with open(proc_path) as fh:
                for line in fh:
                    parts = line.strip().rsplit("/", 1)
                    if len(parts) == 2 and len(parts[1]) >= 12:
                        return parts[1][:12]
        except (OSError, IndexError):
            continue

    hostname = socket.gethostname()
    _generic = {"mlflow-server.host.local", "mlflow-server", "localhost"}
    if hostname and hostname not in _generic:
        return hostname

    return uuid.uuid4().hex[:8]


class DICOMwebServingModel(mlflow.pyfunc.PythonModel):
    """MLflow PyFunc wrapper around the Pixels DICOMweb FastAPI service."""

    # ------------------------------------------------------------------
    # Pickle safety — prevent cloudpickle from capturing Starlette /
    # FastAPI objects that live in MLflow's transitive import graph.
    # Only a trivial marker is serialised; all real state is rebuilt
    # in load_context on the serving side.
    # ------------------------------------------------------------------

    def __getstate__(self):
        return {"_class": "DICOMwebServingModel"}

    def __setstate__(self, state):
        pass

    # ------------------------------------------------------------------
    # load_context — build the ASGI app once, reuse across predictions
    # ------------------------------------------------------------------

    def load_context(self, context):
        """Initialise the DICOMweb FastAPI app and ASGI transport."""
        import httpx
        from fastapi import FastAPI, Request
        from fastapi.middleware.cors import CORSMiddleware

        # ── Node identity (unique per serving replica) ────────────────
        self._node_id = _resolve_node_id()
        self._metrics_source = f"serving:{self._node_id}"
        logger.info("Serving node ID: %s", self._node_id)

        # ── Request counters (thread-safe) ────────────────────────────
        self._stats_lock = threading.Lock()
        self._req_count = 0
        self._req_errors = 0
        self._req_latency_sum = 0.0

        # ── Make dicom_web source importable ──────────────────────────
        dicom_web_dir = context.artifacts["dicom_web_source"]
        if dicom_web_dir not in sys.path:
            sys.path.insert(0, dicom_web_dir)
        logger.info("DICOMweb source: %s", dicom_web_dir)

        # Importing handlers triggers _common.py which lazily creates:
        #   - DatabricksSQLClient singleton
        #   - Lakebase connection (if configured)
        #   - App-auth token provider (Databricks SDK Config)
        from utils.handlers import (                            # noqa: E402
            dicomweb_qido_studies,
            dicomweb_qido_series,
            dicomweb_qido_all_series,
            dicomweb_qido_instances,
            dicomweb_wado_series_metadata,
            dicomweb_wado_instance,
            dicomweb_wado_instance_frames,
            dicomweb_wado_uri,
            dicomweb_stow_studies,
            dicomweb_resolve_paths,
            dicomweb_prime_series,
        )

        # ── Build a minimal FastAPI app (DICOMweb routes only) ────────
        # We intentionally skip register_all_common_routes (OHIF viewer,
        # MONAI proxy, redaction, VLM) — those are irrelevant when the
        # app is behind a serving endpoint.

        app = FastAPI(
            title="DICOMweb Serving Endpoint",
            description="DICOMweb-compliant API served via MLflow Model Serving",
            version="1.0.0",
        )

        # --- QIDO-RS --------------------------------------------------
        @app.get("/api/dicomweb/studies", tags=["QIDO-RS"])
        def _search_studies(request: Request):
            return dicomweb_qido_studies(request)

        @app.get("/api/dicomweb/all_series", tags=["QIDO-RS"])
        def _search_all_series(request: Request):
            return dicomweb_qido_all_series(request)

        @app.get(
            "/api/dicomweb/studies/{study_uid}/series",
            tags=["QIDO-RS"],
        )
        def _search_series(request: Request, study_uid: str):
            return dicomweb_qido_series(request, study_uid)

        @app.get(
            "/api/dicomweb/studies/{study_uid}/series/{series_uid}/instances",
            tags=["QIDO-RS"],
        )
        def _search_instances(request: Request, study_uid: str, series_uid: str):
            return dicomweb_qido_instances(request, study_uid, series_uid)

        # --- WADO-RS ---------------------------------------------------
        @app.get(
            "/api/dicomweb/studies/{study_uid}/series/{series_uid}/metadata",
            tags=["WADO-RS"],
        )
        def _series_metadata(request: Request, study_uid: str, series_uid: str):
            return dicomweb_wado_series_metadata(request, study_uid, series_uid)

        @app.get(
            "/api/dicomweb/studies/{study_uid}/series/{series_uid}"
            "/instances/{sop_uid}/frames/{frame_list}",
            tags=["WADO-RS"],
        )
        def _instance_frames(
            request: Request,
            study_uid: str,
            series_uid: str,
            sop_uid: str,
            frame_list: str,
        ):
            return dicomweb_wado_instance_frames(
                request, study_uid, series_uid, sop_uid, frame_list,
            )

        @app.get(
            "/api/dicomweb/studies/{study_uid}/series/{series_uid}"
            "/instances/{sop_uid}",
            tags=["WADO-RS"],
        )
        def _instance(
            request: Request, study_uid: str, series_uid: str, sop_uid: str,
        ):
            return dicomweb_wado_instance(request, study_uid, series_uid, sop_uid)

        # --- WADO-URI (legacy) -----------------------------------------
        @app.get("/api/dicomweb/wado", tags=["WADO-URI"])
        def _wado_uri(request: Request):
            return dicomweb_wado_uri(request)

        @app.get("/api/dicomweb", tags=["WADO-URI"])
        def _wado_uri_base(request: Request):
            if request.query_params.get("requestType", "").upper() == "WADO":
                return dicomweb_wado_uri(request)
            return {"status": "DICOMweb Serving Endpoint — healthy"}

        # --- STOW-RS ---------------------------------------------------
        @app.post("/api/dicomweb/studies/{study_uid}", tags=["STOW-RS"])
        async def _stow_study(request: Request, study_uid: str):
            return await dicomweb_stow_studies(request, study_uid)

        @app.post("/api/dicomweb/studies", tags=["STOW-RS"])
        async def _stow(request: Request):
            return await dicomweb_stow_studies(request)

        # --- Auxiliary -------------------------------------------------
        @app.post("/api/dicomweb/resolve_paths", tags=["Path Resolution"])
        async def _resolve_paths(request: Request):
            return await dicomweb_resolve_paths(request)

        @app.post("/api/dicomweb/prime", tags=["Cache Priming"])
        async def _prime(request: Request):
            return await dicomweb_prime_series(request)

        @app.get("/api/dicomweb/", tags=["DICOMweb"])
        def _root():
            return {"status": "DICOMweb Serving Endpoint — healthy"}

        # --- CORS (permissive — auth is on the gateway side) -----------
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

        self._app = app
        self._transport = httpx.ASGITransport(app=app)  # type: ignore[arg-type]

        # A single persistent AsyncClient avoids per-request client churn.
        self._asgi_client = httpx.AsyncClient(
            transport=self._transport,
            base_url="http://dicomweb-serving",
            timeout=_REQUEST_TIMEOUT,
        )

        # Dedicated event loop on a background thread — all ASGI
        # dispatches run here via run_coroutine_threadsafe().  This
        # avoids the per-request loop creation that breaks anyio's
        # CapacityLimiter borrower tracking.
        self._loop = asyncio.new_event_loop()
        self._loop_thread = threading.Thread(
            target=self._loop.run_forever,
            daemon=True,
            name="asgi-event-loop",
        )
        self._loop_thread.start()
        logger.info("DICOMweb serving model initialised successfully")

        # ── Background metrics reporter ──────────────────────────────
        self._start_metrics_reporter()

    # ------------------------------------------------------------------
    # predict — route an HTTP request through the in-process ASGI app
    # ------------------------------------------------------------------

    def predict(self, context, model_input, params=None):
        """
        Route a serialised HTTP request through the DICOMweb ASGI app.

        Input columns (DataFrame / dict):
            method         HTTP method (GET / POST)
            path           Request path, e.g. ``/api/dicomweb/studies``
            query_string   URL query string (``limit=10&offset=0``)
            headers        JSON-encoded dict of HTTP headers
            body           Base64-encoded request body (POST / PUT)
            body_encoding  ``"zstd+base64"`` if body is zstd-compressed,
                           empty or ``"base64"`` for plain base64

        Returns:
            JSON string with ``status_code``, ``headers``,
            ``content_type``, ``body`` (encoded payload), and
            ``encoding`` (``"zstd+base64"`` | ``"base64"`` |
            ``"identity"``).
        """
        t0 = time.monotonic()
        is_error = False
        try:
            row = self._extract_row(model_input)

            method = str(row.get("method", "GET")).upper()
            path = str(row.get("path", "/"))
            query_string = str(row.get("query_string", "") or "")
            headers = self._parse_headers(row.get("headers", "{}"))
            body = self._decode_body(
                row.get("body", ""), row.get("body_encoding", ""),
            )

            url = f"{path}?{query_string}" if query_string else path

            status_code, resp_headers, content = self._asgi_request(
                method, url, headers, body,
            )
            if status_code >= 500:
                is_error = True
            return self._format_response(status_code, resp_headers, content)
        except Exception:
            is_error = True
            raise
        finally:
            elapsed = time.monotonic() - t0
            with self._stats_lock:
                self._req_count += 1
                self._req_latency_sum += elapsed
                if is_error:
                    self._req_errors += 1

    # ------------------------------------------------------------------
    # predict_stream — chunked streaming variant for large responses
    # ------------------------------------------------------------------

    def predict_stream(self, context, model_input, params=None):
        """
        Stream a serialised HTTP response from the DICOMweb ASGI app.

        Same input contract as :meth:`predict`.  Instead of returning a
        single JSON blob, this generator yields JSON-encoded chunks:

        1. **header** — ``{"type":"header", "status_code":…, "headers":…, "content_type":…}``
        2. **chunk**  — ``{"type":"chunk", "body":"<encoded>", "encoding":"…"}``
           (one per ``_STREAM_CHUNK_SIZE`` bytes of response body)
        3. **end**    — ``{"type":"end"}``

        Useful for WADO-RS instance / frame retrieval where responses can
        be hundreds of megabytes.  The serving endpoint sends each yielded
        string as an SSE ``data:`` event, so the gateway can start
        forwarding bytes to the client before the full response is built.
        """
        t0 = time.monotonic()
        is_error = False
        try:
            row = self._extract_row(model_input)

            method = str(row.get("method", "GET")).upper()
            path = str(row.get("path", "/"))
            query_string = str(row.get("query_string", "") or "")
            headers = self._parse_headers(row.get("headers", "{}"))
            body = self._decode_body(
                row.get("body", ""), row.get("body_encoding", ""),
            )

            url = f"{path}?{query_string}" if query_string else path

            for chunk_dict in self._asgi_request_stream(
                method, url, headers, body,
            ):
                if (
                    chunk_dict.get("type") == "header"
                    and chunk_dict.get("status_code", 200) >= 500
                ):
                    is_error = True
                yield json.dumps(chunk_dict)
        except Exception:
            is_error = True
            raise
        finally:
            elapsed = time.monotonic() - t0
            with self._stats_lock:
                self._req_count += 1
                self._req_latency_sum += elapsed
                if is_error:
                    self._req_errors += 1

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _extract_row(model_input) -> dict:
        """Normalise model_input (DataFrame, dict, or record) to a flat dict."""
        if hasattr(model_input, "iloc"):
            return model_input.iloc[0].to_dict()
        if isinstance(model_input, dict):
            return {
                k: (v[0] if isinstance(v, list) and len(v) == 1 else v)
                for k, v in model_input.items()
            }
        return model_input

    @staticmethod
    def _parse_headers(raw) -> dict:
        if isinstance(raw, str):
            try:
                return json.loads(raw)
            except (json.JSONDecodeError, TypeError):
                return {}
        return raw if isinstance(raw, dict) else {}

    def _snapshot_and_reset_stats(self) -> dict:
        """Atomically snapshot request counters and reset them to zero."""
        with self._stats_lock:
            snap = {
                "request_count": self._req_count,
                "error_count": self._req_errors,
                "latency_sum_s": round(self._req_latency_sum, 4),
                "avg_latency_s": (
                    round(self._req_latency_sum / self._req_count, 4)
                    if self._req_count else 0
                ),
            }
            self._req_count = 0
            self._req_errors = 0
            self._req_latency_sum = 0.0
        return snap

    def _start_metrics_reporter(self):
        """Launch a daemon thread that writes metrics to Lakebase every N seconds."""

        def _reporter():
            # Lazy imports — only available once load_context has run
            from utils.handlers._common import lb_utils  # noqa: F811
            from utils.metrics import collect_metrics

            if lb_utils is None:
                logger.warning(
                    "Lakebase not configured — metrics reporter disabled"
                )
                return

            logger.info(
                "Metrics reporter started (interval=%.1fs)", _METRICS_INTERVAL
            )
            while True:
                try:
                    time.sleep(_METRICS_INTERVAL)
                    system_metrics = collect_metrics()
                    request_stats = self._snapshot_and_reset_stats()
                    payload = {**system_metrics, "requests": request_stats}
                    lb_utils.insert_metrics(self._metrics_source, payload)
                except Exception as exc:
                    logger.error("Metrics reporter error: %s", exc)

        t = threading.Thread(target=_reporter, daemon=True, name="metrics-reporter")
        t.start()

    def _asgi_request(
        self, method: str, url: str, headers: dict, body: bytes,
    ) -> tuple:
        """Send a request through the ASGI transport and return the raw response.

        The coroutine is submitted to a dedicated background event loop
        via ``run_coroutine_threadsafe``, so the calling (predict) thread
        simply blocks on the future.  This avoids creating/destroying an
        event loop per request, which broke ``anyio``'s CapacityLimiter
        borrower tracking.
        """
        async def _do():
            resp = await self._asgi_client.request(
                method=method,
                url=url,
                headers=headers,
                content=body if body else None,
            )
            return resp.status_code, dict(resp.headers), resp.content

        future = asyncio.run_coroutine_threadsafe(_do(), self._loop)
        return future.result(timeout=_REQUEST_TIMEOUT + 5)

    def _asgi_request_stream(
        self, method: str, url: str, headers: dict, body: bytes,
    ):
        """Stream an ASGI response, yielding chunk dicts to the caller.

        A bounded :class:`queue.Queue` bridges the async ASGI iteration
        (running on the background event loop) to the synchronous
        ``predict_stream`` generator.  Back-pressure is automatic: the
        producer blocks when the queue is full.
        """
        import queue as _queue_mod

        _SENTINEL = object()
        q = _queue_mod.Queue(maxsize=32)

        async def _producer():
            try:
                skip = {
                    "transfer-encoding", "connection",
                    "content-length", "content-encoding",
                }
                async with self._asgi_client.stream(
                    method=method,
                    url=url,
                    headers=headers,
                    content=body if body else None,
                ) as resp:
                    resp_headers = {
                        k: v for k, v in resp.headers.items()
                        if k.lower() not in skip
                    }
                    q.put({
                        "type": "header",
                        "status_code": resp.status_code,
                        "headers": resp_headers,
                        "content_type": resp.headers.get("content-type", ""),
                    })

                    async for raw_chunk in resp.aiter_bytes(
                        chunk_size=_STREAM_CHUNK_SIZE,
                    ):
                        encoded, enc_label = (
                            DICOMwebServingModel._encode_body(raw_chunk)
                        )
                        q.put({
                            "type": "chunk",
                            "body": encoded,
                            "encoding": enc_label,
                        })

                    q.put({"type": "end"})
            except Exception as exc:
                q.put(exc)
            finally:
                q.put(_SENTINEL)

        asyncio.run_coroutine_threadsafe(_producer(), self._loop)

        while True:
            item = q.get(timeout=_REQUEST_TIMEOUT + 5)
            if item is _SENTINEL:
                break
            if isinstance(item, Exception):
                raise item
            yield item

    @staticmethod
    def _decode_body(raw_b64: str, encoding: str) -> bytes:
        """Decode a request body, handling optional zstd compression."""
        if not raw_b64:
            return b""
        raw = base64.b64decode(raw_b64)
        if encoding == "zstd+base64":
            raw = zstd.decompress(raw)
        return raw

    @staticmethod
    def _encode_body(content: bytes) -> tuple[str, str]:
        """
        Encode a response body for transport.

        Returns ``(encoded_string, encoding_label)``.  Bodies above
        ``_COMPRESS_THRESHOLD`` are zstd-compressed before base64 to
        reduce the JSON payload size (typically 2-20x for DICOM/JSON).
        """
        if not content:
            return "", "identity"
        if len(content) >= _COMPRESS_THRESHOLD:
            compressed = zstd.compress(content)
            return base64.b64encode(compressed).decode("ascii"), "zstd+base64"
        return base64.b64encode(content).decode("ascii"), "base64"

    @staticmethod
    def _format_response(
        status_code: int, headers: dict, content: bytes,
    ) -> str:
        content_type = headers.get("content-type", "")
        body_encoded, encoding = DICOMwebServingModel._encode_body(content)

        result: dict = {
            "status_code": status_code,
            "headers": headers,
            "content_type": content_type,
            "body": body_encoded,
            "encoding": encoding,
        }
        return json.dumps(result)
