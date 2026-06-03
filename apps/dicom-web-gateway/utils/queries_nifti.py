"""
NIfTI segmentation overlay — **parameterized** SQL query builders.

Same convention as :mod:`utils.queries` (the DICOMweb pixel-table queries):
every builder returns a ``(query, params)`` tuple. User-supplied values are
**never** interpolated into the SQL string; they flow through ``%(name)s``
bind parameters handled by the Databricks SQL Connector, which prevents SQL
injection at the protocol level.

The **table name** also goes through a bind parameter — wrapped in the
``IDENTIFIER()`` clause so the engine treats it as an identifier rather
than a literal string. :func:`utils.sql_client.validate_table_name` is still
invoked as defence-in-depth before the value reaches the SQL layer.

See: https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-names-identifier-clause

The table is **append-only** by contract: every change (new overlay,
status flip, label re-mapping) is a new row with a higher ``version``;
existing rows are never UPDATED or DELETED by the application layer. The
``/related`` query therefore relies on ``version`` (with ``created_at`` as
a tie-breaker) to surface the newest revision first.

Schema reference — the Delta table named by ``NIFTI_SEGMENTATION_TABLE``
must expose at least these columns::

    id                      string
    study_instance_uid      string
    series_instance_uid     string
    path                    string  -- server-internal; never returned
    file_size_bytes         bigint
    sha256                  string
    name                    string
    description             string
    label_info              variant
    annotator               string
    source                  string
    version                 int
    status                  string
    created_at              timestamp
"""

from typing import Any, Dict, Tuple

from .sql_client import validate_table_name

# ---------------------------------------------------------------------------
# Column orders — must stay aligned with the SELECT projections below.
# The Databricks SQL Connector returns rows as ``list[list[Any]]`` (column
# names are not echoed back), so handlers zip them against these tuples.
# ---------------------------------------------------------------------------

FIND_FOR_SERIES_COLUMNS: Tuple[str, ...] = (
    "id",
    "name",
    "description",
    "label_info",
    "file_size_bytes",
    "sha256",
    "annotator",
    "source",
    "version",
    "status",
    "created_at",
)

RESOLVE_FOR_FETCH_COLUMNS: Tuple[str, ...] = (
    "path",
    "sha256",
    "file_size_bytes",
)


# ---------------------------------------------------------------------------
# Builders — each returns (query_str, params_dict)
# ---------------------------------------------------------------------------


def build_find_for_series(
    nifti_table: str, study_uid: str, series_uid: str
) -> Tuple[str, Dict[str, Any]]:
    """List non-archived overlays for a ``(study, series)``, newest first.

    The internal ``path`` column is intentionally **not** projected — the
    server keeps it private and only resolves it inside
    :func:`build_resolve_for_fetch`.
    """
    validate_table_name(nifti_table)
    sql = """
        SELECT id,
               name,
               description,
               label_info,
               file_size_bytes,
               sha256,
               annotator,
               source,
               version,
               status,
               CAST(created_at AS STRING) AS created_at
        FROM IDENTIFIER(%(nifti_table)s)
        WHERE  study_instance_uid  = %(study)s
          AND  series_instance_uid = %(series)s
          AND  (status IS NULL OR status <> 'archived')
        ORDER BY version DESC NULLS LAST, created_at DESC
    """
    params: Dict[str, Any] = {
        "nifti_table": nifti_table,
        "study": study_uid,
        "series": series_uid,
    }
    return sql, params


def build_resolve_for_fetch(
    nifti_table: str, study_uid: str, series_uid: str, overlay_id: str
) -> Tuple[str, Dict[str, Any]]:
    """Resolve a single overlay row to ``(path, sha256, file_size_bytes)``.

    The ``(study_instance_uid, series_instance_uid)`` predicates are
    **required** even though ``id`` is unique: the Delta table uses
    ``CLUSTER BY (study_instance_uid, series_instance_uid)`` (liquid
    clustering), so filtering by the cluster keys first lets the warehouse
    prune files before applying the ``id`` equality. Without these
    predicates the warehouse has to scan every clustered file to find the row.
    """
    validate_table_name(nifti_table)
    sql = """
        SELECT path, sha256, file_size_bytes
        FROM IDENTIFIER(%(nifti_table)s)
        WHERE  study_instance_uid  = %(study)s
          AND  series_instance_uid = %(series)s
          AND  id                  = %(id)s
        LIMIT 1
    """
    params: Dict[str, Any] = {
        "nifti_table": nifti_table,
        "study": study_uid,
        "series": series_uid,
        "id": overlay_id,
    }
    return sql, params
