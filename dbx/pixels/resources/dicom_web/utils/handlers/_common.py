"""
Shared infrastructure for DICOMweb handlers.

Singletons, authentication, and wrapper factories used by all handler
submodules (QIDO-RS, WADO-RS, WADO-URI, STOW-RS).

Authorization is controlled by the ``DICOMWEB_USE_USER_AUTH`` env var:

* **false** (default) — App authorization.  A **singleton**
  ``DICOMwebDatabricksWrapper`` is created at module load time and
  reused across all requests.  The bearer token auto-refreshes via
  the Databricks SDK ``Config``.
* **true** — User (OBO) authorization.  A **per-request** wrapper is
  created because the token, user groups, and ``pixels_table`` may
  differ between users.

See: https://docs.databricks.com/aws/en/dev-tools/databricks-apps/auth
"""

import os

from databricks.sdk.core import Config
from fastapi import HTTPException, Request

from dbx.pixels.lakebase import LakebaseUtils, RLS_ENABLED
from dbx.pixels.logging import LoggerProvider

from ..sql_client import USE_USER_AUTH, DatabricksSQLClient
from ..wrapper import DICOMwebDatabricksWrapper
from ..sql_client import validate_table_name


logger = LoggerProvider("DICOMweb.Handlers")

# ---------------------------------------------------------------------------
# Lakebase singleton (persistent tier-2 cache for frame offsets + instance paths)
# ---------------------------------------------------------------------------
# Lakebase has a 3-level namespace: Instance → Database → Schema → Table.
# When DATABRICKS_PIXELS_TABLE is set (e.g. pixels_dicomweb.tcia.object_catalog):
#   - Instance  → LAKEBASE_INSTANCE_NAME (the server, independent of UC)
#   - Database  → UC catalog  ("pixels_dicomweb")
#   - Schema    → UC schema   ("tcia")
# This alignment enables Reverse ETL Sync between UC and Lakebase.
# ---------------------------------------------------------------------------

lb_utils = None
if "LAKEBASE_INSTANCE_NAME" in os.environ or "DATABRICKS_PIXELS_TABLE" in os.environ:
    try:
        from pathlib import Path

        # dbx.pixels.resources is a namespace package (__file__ is None).
        # Locate the SQL directory relative to lakebase.py which always
        # has a concrete __file__.
        import dbx.pixels.lakebase as _lb_mod

        _sql_dir = Path(_lb_mod.__file__).parent / "resources" / "sql" / "lakebase"

        # Derive the UC table name (used to align database + schema)
        _uc_table = os.getenv("DATABRICKS_PIXELS_TABLE")

        lb_utils = LakebaseUtils(
            instance_name=os.environ.get("LAKEBASE_INSTANCE_NAME", "pixels-lakebase"),
            create_instance=True,
            uc_table_name=_uc_table,
        )

        if os.environ.get("LAKEBASE_INIT_DB", "").lower() in ("1", "true", "yes"):
            # The schema name used in DDL is the one LakebaseUtils derived
            _lb_schema = lb_utils.schema

            init_files = [
                "CREATE_LAKEBASE_SCHEMA.sql",
                "CREATE_LAKEBASE_DICOM_FRAMES.sql",
            ]
            # Apply RLS schema when enabled
            if RLS_ENABLED:
                init_files.append("CREATE_LAKEBASE_RLS.sql")
            for sql_file in init_files:
                with open(_sql_dir / sql_file) as fh:
                    ddl = fh.read().format(schema_name=_lb_schema)
                    lb_utils.execute_query(ddl)
            logger.info(
                f"Lakebase initialised: instance='{lb_utils.instance_name}', "
                f"database='{lb_utils.database}', schema='{_lb_schema}'"
                f"{' (RLS enabled)' if RLS_ENABLED else ''}"
            )
        else:
            logger.info(
                f"Lakebase connected (schema init skipped): "
                f"instance='{lb_utils.instance_name}', "
                f"database='{lb_utils.database}', schema='{lb_utils.schema}'"
            )
    except Exception as exc:
        logger.warning(f"Lakebase init failed: {exc}")
else:
    logger.warning(
        "Neither LAKEBASE_INSTANCE_NAME nor DATABRICKS_PIXELS_TABLE configured, "
        "tier-2 caching disabled"
    )


# ---------------------------------------------------------------------------
# SQL client singleton (shared across requests — connection reused for app auth)
# ---------------------------------------------------------------------------

_sql_client: DatabricksSQLClient | None = None


def get_sql_client() -> DatabricksSQLClient:
    """Lazily create the shared ``DatabricksSQLClient`` singleton."""
    global _sql_client
    if _sql_client is None:
        cfg = Config()
        warehouse_id = os.getenv("DATABRICKS_WAREHOUSE_ID")
        if not warehouse_id:
            raise HTTPException(status_code=500, detail="DATABRICKS_WAREHOUSE_ID not configured")
        host = cfg.host or os.getenv("DATABRICKS_HOST", "")
        _sql_client = DatabricksSQLClient(host=host, warehouse_id=warehouse_id)
    return _sql_client


# ---------------------------------------------------------------------------
# Token resolution — same approach for both SQL and file operations
# ---------------------------------------------------------------------------

def resolve_user_token(request: Request) -> str:
    """
    Extract the user's forwarded access token (OBO mode only).

    Raises:
        HTTPException 401: if the header is missing.
    """
    token = request.headers.get("X-Forwarded-Access-Token")
    if not token:
        raise HTTPException(
            status_code=401,
            detail="User authorization (OBO) is enabled but no "
                   "X-Forwarded-Access-Token header was found",
        )
    return token


# ---------------------------------------------------------------------------
# App-auth token provider (service principal — singleton, auto-refreshed)
# ---------------------------------------------------------------------------
# The SDK ``Config`` caches and auto-refreshes the bearer token internally.
# We keep one ``Config`` instance and call its header factory on each access
# so the wrapper always gets a valid, non-expired token.

_app_cfg: Config | None = None
_app_header_factory = None


def app_token_provider() -> str:
    """
    Return a current bearer token from the Databricks SDK ``Config``.

    The SDK handles caching and automatic refresh — calling this is
    near-zero cost when the token is still valid.

    If the header factory returns ``None`` (transient OAuth refresh
    failure), the ``Config`` is recreated on the next call so a fresh
    authentication flow can succeed.
    """
    global _app_cfg, _app_header_factory
    if _app_cfg is None:
        _app_cfg = Config()
        _app_header_factory = _app_cfg.authenticate()
    headers = _app_header_factory() if callable(_app_header_factory) else _app_header_factory
    if headers is None:
        # Token refresh returned None — reset so next call re-authenticates
        logger.warning("SDK header factory returned None — resetting Config for re-auth")
        _app_cfg = None
        _app_header_factory = None
        raise HTTPException(
            status_code=503,
            detail="Authentication temporarily unavailable — please retry",
        )
    auth = headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        return auth[7:]
    raise HTTPException(
        status_code=500,
        detail="SDK Config did not produce a Bearer token",
    )


# ---------------------------------------------------------------------------
# User group resolution (for RLS enforcement)
# ---------------------------------------------------------------------------

# In-memory cache: user email → list[str] (groups).
# Avoids a Lakebase round-trip on every request.
_user_groups_cache: dict[str, list[str]] = {}


def resolve_user_groups(request: Request) -> list[str] | None:
    """
    Resolve the current user's Databricks account groups for RLS.

    Returns ``None`` when RLS is not active (feature flag off, no
    Lakebase, or app-auth mode).  Handlers pass ``None`` through to
    the wrapper and caches, which preserves the legacy behaviour.
    """
    if not (RLS_ENABLED and USE_USER_AUTH and lb_utils):
        return None

    email = request.headers.get("X-Forwarded-Email", "").strip()
    if not email:
        logger.warning(
            "RLS enabled but X-Forwarded-Email header missing — "
            "no user group filtering will be applied"
        )
        return None

    # Fast path: in-memory hit
    cached = _user_groups_cache.get(email)
    if cached is not None:
        return cached

    # Slow path: query Lakebase user_groups table
    try:
        groups = lb_utils.get_user_groups(email)
        _user_groups_cache[email] = groups
        logger.info(f"Resolved {len(groups)} groups for {email}")
        return groups
    except Exception as exc:
        logger.warning(f"User group resolution failed for {email}: {exc}")
        return None


# ---------------------------------------------------------------------------
# Wrapper factory — singleton (app auth) or per-request (OBO)
# ---------------------------------------------------------------------------

_app_wrapper: DICOMwebDatabricksWrapper | None = None


def _get_app_wrapper(pixels_table: str) -> DICOMwebDatabricksWrapper:
    """
    Return the module-level singleton wrapper for app-auth (service principal).

    Created lazily on first call; reused for every subsequent request.
    The ``token_provider`` ensures the bearer token auto-refreshes via
    the Databricks SDK without recreating the wrapper.
    """
    global _app_wrapper
    if _app_wrapper is not None:
        _app_wrapper._table = pixels_table
        return _app_wrapper

    sql_client = get_sql_client()
    _app_wrapper = DICOMwebDatabricksWrapper(
        sql_client=sql_client,
        token_provider=app_token_provider,
        pixels_table=pixels_table,
        lb_utils=lb_utils,
        user_groups=None,
    )
    logger.info("App-auth singleton DICOMwebDatabricksWrapper created")
    return _app_wrapper


def _build_obo_wrapper(request: Request, pixels_table: str | None = None) -> DICOMwebDatabricksWrapper:
    """
    Build a per-request wrapper for OBO (user auth) mode.

    Each request carries a different user token, group memberships,
    and potentially a different ``pixels_table`` (via cookie).
    """
    sql_client = get_sql_client()
    token = resolve_user_token(request)
    user_groups = resolve_user_groups(request)

    if not pixels_table:
        pixels_table = request.cookies.get("pixels_table") or os.getenv("DATABRICKS_PIXELS_TABLE")
    if not pixels_table:
        raise HTTPException(status_code=500, detail="DATABRICKS_PIXELS_TABLE not configured")

    return DICOMwebDatabricksWrapper(
        sql_client=sql_client,
        token=token,
        pixels_table=pixels_table,
        lb_utils=lb_utils,
        user_groups=user_groups,
    )


def get_dicomweb_wrapper(request: Request) -> DICOMwebDatabricksWrapper:
    """
    Return the appropriate ``DICOMwebDatabricksWrapper``.

    * **App auth** — returns the module-level singleton (token auto-refreshes).
    * **User auth (OBO)** — returns a fresh per-request wrapper.
    """
    pixels_table = request.cookies.get("pixels_table") or os.getenv("DATABRICKS_PIXELS_TABLE") 
    
    if not pixels_table:
        raise HTTPException(status_code=500, detail="DATABRICKS_PIXELS_TABLE not configured")
    
    validate_table_name(pixels_table)
    
    if USE_USER_AUTH:
        return _build_obo_wrapper(request, pixels_table)
    return _get_app_wrapper(pixels_table)
