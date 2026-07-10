"""
NIfTI segmentation overlay handlers.

Two read-only endpoints whose route decorators live in ``app.py`` (same
convention as QIDO-RS, WADO-RS, STOW-RS). Each handler is a thin orchestration
layer that delegates to:

* **SQL** — query builders in :mod:`utils.queries_nifti`, executed via the
  gateway's existing :class:`utils.sql_client.DatabricksSQLClient` (App or
  OBO mode, with the same retry / pooling behaviour as QIDO-RS).
* **File streaming** — a small inline helper that proxies bytes from a UC
  Volume via the Databricks Files API (``GET /api/2.0/fs/files/<path>``)
  with the same Bearer token used for the SQL query.

Authentication follows the gateway's ``DICOMWEB_USE_USER_AUTH`` switch
exactly. In OBO mode the user's forwarded access token is propagated to
both the SQL warehouse and the Files API so Unity Catalog ACLs on the
Delta table and the UC Volume apply uniformly.

Feature gate: activated when the request carries a ``pixels_table`` cookie
(multi-table mode), ``DATABRICKS_PIXELS_TABLE`` is configured, or
``NIFTI_SEGMENTATION_TABLE`` is set. When none are available (or when
``DATABRICKS_WAREHOUSE_ID`` is missing) both handlers raise
:class:`fastapi.HTTPException` so the gateway is functionally a no-op for
callers that haven't onboarded the feature.
"""

import json
import logging
import os
from typing import Any, Dict, Iterator, Optional, Sequence, Tuple
from urllib.parse import quote

import requests
from databricks.sdk.core import Config as _DBXConfig
from fastapi import HTTPException, Request
from fastapi.responses import StreamingResponse

from ..queries_nifti import (
    FIND_FOR_SERIES_COLUMNS,
    RESOLVE_FOR_FETCH_COLUMNS,
    build_find_for_series,
    build_resolve_for_fetch,
)
from ..sql_client import USE_USER_AUTH, validate_table_name
from ._common import app_token_provider, get_sql_client, resolve_user_token

logger = logging.getLogger("DICOMweb.Gateway")

# ---------------------------------------------------------------------------
# Tunables
# ---------------------------------------------------------------------------

_FILES_API_PREFIX = "/api/2.0/fs/files"
_FILES_API_TIMEOUT_S = 300
_FILES_API_CHUNK_BYTES = 65_536
_DEFAULT_NIFTI_TABLE_NAME = "nifti_segmentations"


# ---------------------------------------------------------------------------
# Config resolution
# ---------------------------------------------------------------------------


def _derive_nifti_table(pixels_table: str) -> str:
    """Convert ``catalog.schema.table`` into ``catalog.schema.nifti_segmentations``."""
    validate_table_name(pixels_table)
    catalog, schema, _ = pixels_table.split(".", 2)
    return f"{catalog}.{schema}.{_DEFAULT_NIFTI_TABLE_NAME}"


def _resolve_table(request: Request) -> str:
    """Return the effective Delta table; HTTP 404 when feature disabled."""
    cookie_pixels_table = request.cookies.get("pixels_table", "").strip()
    env_pixels_table = os.getenv("DATABRICKS_PIXELS_TABLE", "").strip()

    for source, pixels_table in (
        ("pixels_table cookie", cookie_pixels_table),
        ("DATABRICKS_PIXELS_TABLE", env_pixels_table),
    ):
        if not pixels_table:
            continue
        try:
            return _derive_nifti_table(pixels_table)
        except ValueError:
            logger.warning(
                "NIfTI overlay: invalid %s '%s'; trying next table source",
                source,
                pixels_table,
            )

    table = os.getenv("NIFTI_SEGMENTATION_TABLE", "").strip()
    if not table:
        raise HTTPException(
            status_code=404,
            detail=(
                "NIfTI overlay routes are disabled "
                "(no pixels_table cookie, DATABRICKS_PIXELS_TABLE, "
                "or NIFTI_SEGMENTATION_TABLE is configured)"
            ),
        )
    return table


def _resolve_token(request: Request) -> str:
    """Return the Bearer token to use for both SQL and Files API calls."""
    if USE_USER_AUTH:
        return resolve_user_token(request)
    return app_token_provider()


def _databricks_host() -> str:
    """Return the workspace URL used for Files API calls."""
    return _DBXConfig().host or os.getenv("DATABRICKS_HOST", "")


# ---------------------------------------------------------------------------
# Row → dict shaping
# ---------------------------------------------------------------------------


def _rows_to_dicts(
    rows: list[list[Any]],
    columns: Sequence[str],
    *,
    parse_label_info: bool,
) -> list[Dict[str, Any]]:
    """Zip ``rows`` (positional from the SQL Connector) against ``columns``.

    VARIANT columns come back as JSON-encoded strings; the ``label_info``
    column is decoded here so callers see a real ``dict``. Numeric columns
    are already typed correctly by Arrow — no coercion needed.
    """
    out: list[Dict[str, Any]] = []
    for row in rows:
        record: Dict[str, Any] = dict(zip(columns, row))
        if parse_label_info and isinstance(record.get("label_info"), str):
            try:
                record["label_info"] = json.loads(record["label_info"])
            except json.JSONDecodeError:
                logger.warning(
                    "Unparseable label_info for overlay id=%s; defaulting to {}",
                    record.get("id"),
                )
                record["label_info"] = {}
        out.append(record)
    return out


# ---------------------------------------------------------------------------
# Files API streaming (UC Volume read-only)
# ---------------------------------------------------------------------------


def _stream_volume_file(
    host: str, token: str, path: str
) -> Tuple[Iterator[bytes], Dict[str, str]]:
    """Open a streaming GET against ``GET /api/2.0/fs/files/<path>``.

    Returns ``(byte_iterator, upstream_headers)``. The iterator owns the
    upstream connection — exhausting it (or letting it be garbage-collected)
    closes the connection.
    """
    if not path:
        raise ValueError("path must be non-empty")

    # quote() with safe='/' percent-encodes everything except path separators.
    url = f"{host.rstrip('/')}{_FILES_API_PREFIX}{quote(path, safe='/')}"
    resp = requests.get(
        url,
        headers={"Authorization": f"Bearer {token}"},
        stream=True,
        timeout=_FILES_API_TIMEOUT_S,
    )
    if resp.status_code == 404:
        resp.close()
        raise FileNotFoundError(f"NIfTI overlay not found on UC Volume: {path}")
    resp.raise_for_status()

    passthrough = {
        key: resp.headers[key]
        for key in ("Content-Length", "Content-Type", "Last-Modified")
        if key in resp.headers
    }

    def _iter_chunks() -> Iterator[bytes]:
        try:
            for chunk in resp.iter_content(chunk_size=_FILES_API_CHUNK_BYTES):
                if chunk:
                    yield chunk
        finally:
            resp.close()

    return _iter_chunks(), passthrough


# ---------------------------------------------------------------------------
# Endpoint handlers
# ---------------------------------------------------------------------------


def nifti_related(
    request: Request, study: str, series: str
) -> list[Dict[str, Any]]:
    """``GET /api/dicomweb/nifti/related`` — list overlays for a ``(study, series)``.

    Rows are ordered by ``version DESC NULLS LAST, created_at DESC`` and
    exclude any row whose ``status = 'archived'``. The internal ``path``
    column is intentionally **not** projected.
    """
    table = _resolve_table(request)
    sql_client = get_sql_client()
    user_token: Optional[str] = resolve_user_token(request) if USE_USER_AUTH else None

    sql, params = build_find_for_series(table, study, series)
    try:
        rows = sql_client.execute(sql, parameters=params, user_token=user_token)
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception(
            "nifti_related: SQL execution failed for study=%s series=%s",
            study,
            series,
        )
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return _rows_to_dicts(rows, FIND_FOR_SERIES_COLUMNS, parse_label_info=True)


def nifti_fetch(
    request: Request, study: str, series: str, overlay_id: str
) -> StreamingResponse:
    """``GET /api/dicomweb/nifti/fetch`` — stream a single overlay file.

    Resolves ``(study, series, id)`` to a UC Volume path server-side, then
    proxies the bytes through the Databricks Files API using the same
    Bearer token that authorised the SQL query (so UC ACLs on both the
    Delta table and the Volume apply uniformly).

    Response headers: ``Content-Type: application/octet-stream``,
    ``Cache-Control: private, max-age=3600``, and ``ETag: "<sha256>"`` when
    the row carries a hash.
    """
    table = _resolve_table(request)
    sql_client = get_sql_client()
    user_token: Optional[str] = resolve_user_token(request) if USE_USER_AUTH else None

    sql, params = build_resolve_for_fetch(table, study, series, overlay_id)
    try:
        rows = sql_client.execute(sql, parameters=params, user_token=user_token)
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception(
            "nifti_fetch: SQL execution failed for study=%s series=%s id=%s",
            study,
            series,
            overlay_id,
        )
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    records = _rows_to_dicts(rows, RESOLVE_FOR_FETCH_COLUMNS, parse_label_info=False)
    if not records:
        raise HTTPException(
            status_code=404,
            detail=(
                f"No overlay with id={overlay_id!r} under "
                f"study={study!r} series={series!r}"
            ),
        )
    row = records[0]

    # Reuse the same token for the Files API call — in OBO mode that's the
    # user's token (so Volume ACLs apply), in app mode it's the SP's token.
    files_token = user_token if user_token is not None else app_token_provider()
    try:
        byte_iter, upstream_headers = _stream_volume_file(
            _databricks_host(), files_token, row["path"]
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except requests.HTTPError as exc:
        logger.exception(
            "nifti_fetch: Files API stream failed for "
            "study=%s series=%s id=%s path=%s",
            study,
            series,
            overlay_id,
            row.get("path"),
        )
        raise HTTPException(
            status_code=502, detail=f"Upstream Files API error: {exc}"
        ) from exc

    response_headers: Dict[str, str] = {"Cache-Control": "private, max-age=3600"}
    if row.get("sha256"):
        response_headers["ETag"] = f'"{row["sha256"]}"'
    if "Content-Length" in upstream_headers:
        response_headers["Content-Length"] = upstream_headers["Content-Length"]

    return StreamingResponse(
        byte_iter,
        media_type="application/octet-stream",
        headers=response_headers,
    )
