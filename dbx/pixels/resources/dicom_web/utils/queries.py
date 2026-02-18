"""
DICOMweb SQL query builders — **parameterized**.

Every function returns a ``(query, params)`` tuple.  User-supplied values are
**never** interpolated into the SQL string; they are passed as bind parameters
(``%(name)s`` placeholders) handled by the Databricks SQL Connector, which
prevents SQL injection at the protocol level.

Table names use the ``IDENTIFIER()`` clause so they are also injection-safe
at the engine level.  See:
https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-names-identifier-clause

See: https://docs.databricks.com/aws/en/dev-tools/python-sql-connector
"""

from typing import Any, Dict

from .sql_client import validate_table_name


# ---------------------------------------------------------------------------
# Public query builders — each returns (query_str, params_dict)
# ---------------------------------------------------------------------------


def build_study_query(
    pixels_table: str, params: Dict[str, Any]
) -> tuple[str, dict[str, Any]]:
    """
    Build a QIDO-RS *study-level* search query.

    Supported DICOMweb params: PatientName, PatientID, StudyDate,
    AccessionNumber, StudyDescription, StudyInstanceUID,
    ModalitiesInStudy, limit, offset.
    """
    validate_table_name(pixels_table)
    filters: list[str] = ["1=1"]
    sql_params: dict[str, Any] = {"pixels_table": pixels_table}

    # Patient Name (case-insensitive, wildcard)
    if "PatientName" in params or "00100010" in params:
        name = params.get("PatientName", params.get("00100010", ""))
        name = name.replace("*", "%").replace("?", "_")
        filters.append(
            "lower(meta:['00100010'].Value[0]::String) like lower(%(patient_name)s)"
        )
        sql_params["patient_name"] = name

    # Patient ID
    if "PatientID" in params or "00100020" in params:
        pid = params.get("PatientID", params.get("00100020", ""))
        pid = pid.replace("*", "%").replace("?", "_")
        filters.append("meta:['00100020'].Value[0]::String like %(patient_id)s")
        sql_params["patient_id"] = pid

    # Accession Number
    if "AccessionNumber" in params or "00080050" in params:
        acc = params.get("AccessionNumber", params.get("00080050", ""))
        acc = acc.replace("*", "%").replace("?", "_")
        filters.append("meta:['00080050'].Value[0]::String like %(accession)s")
        sql_params["accession"] = acc

    # Study Description
    if "StudyDescription" in params or "00081030" in params:
        desc = params.get("StudyDescription", params.get("00081030", ""))
        desc = desc.replace("*", "%").replace("?", "_")
        filters.append(
            "lower(meta:['00081030'].Value[0]::String) like lower(%(study_desc)s)"
        )
        sql_params["study_desc"] = desc

    # Study Instance UID
    if "StudyInstanceUID" in params or "0020000D" in params:
        uid = params.get("StudyInstanceUID", params.get("0020000D", ""))
        filters.append("meta:['0020000D'].Value[0]::String = %(study_uid)s")
        sql_params["study_uid"] = uid

    # Modalities in Study (variable-length IN clause)
    if "ModalitiesInStudy" in params or "00080061" in params:
        modalities = params.get("ModalitiesInStudy", params.get("00080061", ""))
        if isinstance(modalities, str):
            modalities = [modalities]
        placeholders = []
        for i, mod in enumerate(modalities):
            key = f"mod_{i}"
            placeholders.append(f"%({key})s")
            sql_params[key] = mod
        in_clause = ", ".join(placeholders)
        filters.append(
            f"(meta:['00080060'].Value[0]::String IN ({in_clause}) OR "
            f"meta:['00080061'].Value[0]::String IN ({in_clause}))"
        )

    # Study Date (single value or range YYYYMMDD-YYYYMMDD)
    if "StudyDate" in params or "00080020" in params:
        sd = params.get("StudyDate", params.get("00080020", ""))
        if "-" in sd:
            start, end = sd.split("-", 1)
            filters.append("meta:['00080020'].Value[0]::String >= %(date_start)s")
            filters.append("meta:['00080020'].Value[0]::String <= %(date_end)s")
            sql_params["date_start"] = start
            sql_params["date_end"] = end
        else:
            filters.append("meta:['00080020'].Value[0]::String = %(study_date)s")
            sql_params["study_date"] = sd

    # Pagination (integers — validated, not parameterized)
    limit_clause = ""
    if "limit" in params:
        limit_clause = f"LIMIT {int(params['limit'])}"
    offset_clause = ""
    if "offset" in params:
        offset_clause = f"OFFSET {int(params['offset'])}"

    where = " AND ".join(filters)

    query = f"""
    SELECT
        first(meta:['00100010'].Value[0].Alphabetic::String, true) as PatientName,
        meta:['00100020'].Value[0]::String as PatientID,
        meta:['0020000D'].Value[0]::String as StudyInstanceUID,
        meta:['00080020'].Value[0]::String as StudyDate,
        meta:['00080050'].Value[0]::String as AccessionNumber,
        first(meta:['00081030'].Value[0]::String, true) as StudyDescription,
        array_join(collect_set(meta:['00080060'].Value[0]::String), '/') as Modality,
        nullif(array_join(collect_set(meta:['00080061'].Value[0]::String), '/'), '') as ModalitiesInStudy,
        COUNT(DISTINCT meta:['0020000E'].Value[0]::String) as NumberOfStudyRelatedSeries,
        COUNT(*) as NumberOfStudyRelatedInstances
    FROM IDENTIFIER(%(pixels_table)s)
    WHERE {where}
    GROUP BY
        PatientID, StudyInstanceUID, StudyDate, AccessionNumber
    ORDER BY StudyDate DESC
    {limit_clause} {offset_clause}
    """
    return query, sql_params


def build_all_series_query(
    pixels_table: str,
) -> tuple[str, dict[str, Any]]:
    """Build a query returning *every* (study, series) pair in one round-trip.

    Used by the bulk discovery endpoint so the priming script avoids N
    per-study SQL queries (~800 ms each).
    """
    validate_table_name(pixels_table)
    sql_params: dict[str, Any] = {"pixels_table": pixels_table}

    query = """
    SELECT
        meta:['0020000D'].Value[0]::String as StudyInstanceUID,
        meta:['0020000E'].Value[0]::String as SeriesInstanceUID,
        array_join(collect_set(meta:['00080060'].Value[0]::String), '/') as Modality,
        first(meta:['00200011'].Value[0]::String, true) as SeriesNumber,
        first(meta:['0008103E'].Value[0]::String, true) as SeriesDescription,
        first(meta:['00080021'].Value[0]::String, true) as SeriesDate,
        COUNT(*) as NumberOfSeriesRelatedInstances
    FROM IDENTIFIER(%(pixels_table)s)
    GROUP BY
        StudyInstanceUID, SeriesInstanceUID
    ORDER BY StudyInstanceUID, SeriesDate DESC
    """
    return query, sql_params


def build_series_query(
    pixels_table: str,
    study_instance_uid: str,
    params: Dict[str, Any] | None = None,
) -> tuple[str, dict[str, Any]]:
    """Build a QIDO-RS *series-level* search query within a study."""
    validate_table_name(pixels_table)
    filters = ["meta:['0020000D'].Value[0]::String = %(study_uid)s"]
    sql_params: dict[str, Any] = {"pixels_table": pixels_table, "study_uid": study_instance_uid}

    if params:
        if "SeriesInstanceUID" in params or "0020000E" in params:
            uid = params.get("SeriesInstanceUID", params.get("0020000E", ""))
            filters.append("meta:['0020000E'].Value[0]::String = %(series_uid)s")
            sql_params["series_uid"] = uid
        if "Modality" in params or "00080060" in params:
            mod = params.get("Modality", params.get("00080060", ""))
            filters.append("meta:['00080060'].Value[0]::String = %(modality)s")
            sql_params["modality"] = mod
        if "SeriesNumber" in params or "00200011" in params:
            sn = params.get("SeriesNumber", params.get("00200011", ""))
            filters.append("meta:['00200011'].Value[0]::String = %(series_number)s")
            sql_params["series_number"] = sn

    where = " AND ".join(filters)

    query = f"""
    SELECT
        meta:['0020000D'].Value[0]::String as StudyInstanceUID,
        meta:['0020000E'].Value[0]::String as SeriesInstanceUID,
        array_join(collect_set(meta:['00080060'].Value[0]::String), '/') as Modality,
        first(meta:['00200011'].Value[0]::String, true) as SeriesNumber,
        first(meta:['0008103E'].Value[0]::String, true) as SeriesDescription,
        first(meta:['00080021'].Value[0]::String, true) as SeriesDate,
        COUNT(*) as NumberOfSeriesRelatedInstances
    FROM IDENTIFIER(%(pixels_table)s)
    WHERE {where}
    GROUP BY
        StudyInstanceUID, SeriesInstanceUID
    ORDER BY SeriesDate DESC
    """
    return query, sql_params


def build_instances_query(
    pixels_table: str,
    study_instance_uid: str,
    series_instance_uid: str,
    params: Dict[str, Any] | None = None,
) -> tuple[str, dict[str, Any]]:
    """Build a QIDO-RS *instance-level* search query within a series."""
    validate_table_name(pixels_table)
    filters = [
        "meta:['0020000D'].Value[0]::String = %(study_uid)s",
        "meta:['0020000E'].Value[0]::String = %(series_uid)s",
    ]
    sql_params: dict[str, Any] = {
        "pixels_table": pixels_table,
        "study_uid": study_instance_uid,
        "series_uid": series_instance_uid,
    }

    if params:
        if "SOPInstanceUID" in params or "00080018" in params:
            uid = params.get("SOPInstanceUID", params.get("00080018", ""))
            filters.append("meta:['00080018'].Value[0]::String = %(sop_uid)s")
            sql_params["sop_uid"] = uid

    where = " AND ".join(filters)

    query = f"""
    SELECT
        meta:['0020000D'].Value[0]::String as StudyInstanceUID,
        meta:['0020000E'].Value[0]::String as SeriesInstanceUID,
        meta:['00080018'].Value[0]::String as SOPInstanceUID,
        meta:['00080016'].Value[0]::String as SOPClassUID,
        meta:['00200013'].Value[0]::INT as InstanceNumber,
        meta:['00280010'].Value[0]::String as Rows,
        meta:['00280011'].Value[0]::String as Columns,
        meta:['00280008'].Value[0]::String as NumberOfFrames,
        path,
        local_path
    FROM IDENTIFIER(%(pixels_table)s)
    WHERE {where}
    ORDER BY InstanceNumber
    """
    return query, sql_params


# ---------------------------------------------------------------------------
# WADO-RS — metadata / path resolution queries
# ---------------------------------------------------------------------------


def build_series_metadata_query(
    pixels_table: str,
    study_instance_uid: str,
    series_instance_uid: str,
) -> tuple[str, dict[str, Any]]:
    """
    Build a WADO-RS query to retrieve raw DICOM JSON metadata for every
    instance in a series.

    Returns only the ``meta`` VARIANT column — the caller streams it
    directly as JSON without deserialization.
    """
    validate_table_name(pixels_table)
    query = """
    SELECT meta
    FROM IDENTIFIER(%(pixels_table)s)
    WHERE meta:['0020000D'].Value[0]::String = %(study_uid)s
      AND meta:['0020000E'].Value[0]::String = %(series_uid)s
    """
    sql_params: dict[str, Any] = {
        "pixels_table": pixels_table,
        "study_uid": study_instance_uid,
        "series_uid": series_instance_uid,
    }
    return query, sql_params


def build_instance_path_query(
    pixels_table: str,
    study_instance_uid: str,
    series_instance_uid: str,
    sop_instance_uid: str,
) -> tuple[str, dict[str, Any]]:
    """
    Build a query to resolve a single SOP Instance UID to its local file
    path and frame count.

    Used as the tier-3 (SQL warehouse) fallback in the 3-tier instance
    path cache.
    """
    validate_table_name(pixels_table)
    query = """
    SELECT local_path,
           ifnull(meta:['00280008'].Value[0]::integer, 1) as NumberOfFrames
    FROM IDENTIFIER(%(pixels_table)s)
    WHERE meta:['0020000D'].Value[0]::String = %(study_uid)s
      AND meta:['0020000E'].Value[0]::String = %(series_uid)s
      AND meta:['00080018'].Value[0]::String = %(sop_uid)s
    LIMIT 1
    """
    sql_params: dict[str, Any] = {
        "pixels_table": pixels_table,
        "study_uid": study_instance_uid,
        "series_uid": series_instance_uid,
        "sop_uid": sop_instance_uid,
    }
    return query, sql_params


def build_series_instance_paths_query(
    pixels_table: str,
    study_instance_uid: str,
    series_instance_uid: str,
) -> tuple[str, dict[str, Any]]:
    """
    Build a lightweight query returning SOP UID, local path, and frame
    count for every instance in a series.

    Used for background series pre-warming (cache tier-3 fallback).
    """
    validate_table_name(pixels_table)
    query = """
    SELECT meta:['00080018'].Value[0]::String  AS SOPInstanceUID,
           local_path,
           ifnull(meta:['00280008'].Value[0]::integer, 1) AS NumberOfFrames
    FROM IDENTIFIER(%(pixels_table)s)
    WHERE meta:['0020000D'].Value[0]::String = %(study_uid)s
      AND meta:['0020000E'].Value[0]::String = %(series_uid)s
    """
    sql_params: dict[str, Any] = {
        "pixels_table": pixels_table,
        "study_uid": study_instance_uid,
        "series_uid": series_instance_uid,
    }
    return query, sql_params


# ---------------------------------------------------------------------------
# STOW-RS — tracking table INSERT
# ---------------------------------------------------------------------------


def build_stow_insert_query(
    stow_table: str,
    records: list[dict],
) -> tuple[str, dict[str, Any]]:
    """
    Build a parameterized multi-row INSERT for the ``stow_operations`` table.

    Each *record* dict must contain:

    * ``file_id`` — UUID hex string (one per STOW-RS request)
    * ``volume_path`` — full ``/Volumes/…`` path to the temp multipart
      bundle (``.mpr`` file)
    * ``file_size`` — total size in bytes of the uploaded bundle (int)
    * ``upload_timestamp`` — ISO-8601 string (``YYYY-MM-DD HH:MM:SS``)
    * ``study_constraint`` — Study UID from the URL or ``None``
    * ``content_type`` — full Content-Type header including boundary
      (e.g. ``multipart/related; boundary=…``)
    * ``client_ip`` — client IP or ``None``
    * ``user_email`` — uploading user's email or ``None``
    * ``user_agent`` — client User-Agent string or ``None``

    Returns:
        ``(query, params)`` — a single INSERT with numbered bind
        parameters (``%(file_id_0)s``, ``%(file_id_1)s``, …) safe for
        the Databricks SQL Connector.
    """
    validate_table_name(stow_table)

    sql_params: dict[str, Any] = {"stow_table": stow_table}
    value_clauses: list[str] = []

    for i, r in enumerate(records):
        sql_params[f"file_id_{i}"] = r["file_id"]
        sql_params[f"volume_path_{i}"] = r["volume_path"]
        sql_params[f"file_size_{i}"] = r["file_size"]
        sql_params[f"upload_ts_{i}"] = r["upload_timestamp"]
        sql_params[f"study_{i}"] = r.get("study_constraint")
        sql_params[f"ct_{i}"] = r.get("content_type", "application/dicom")
        sql_params[f"ip_{i}"] = r.get("client_ip")
        sql_params[f"email_{i}"] = r.get("user_email")
        sql_params[f"ua_{i}"] = r.get("user_agent")

        value_clauses.append(
            f"(%(file_id_{i})s, %(volume_path_{i})s, %(file_size_{i})s, "
            f"%(upload_ts_{i})s, %(study_{i})s, %(ct_{i})s, %(ip_{i})s, "
            f"%(email_{i})s, %(ua_{i})s, "
            f"'pending', NULL, NULL)"
        )

    query = f"""
    INSERT INTO IDENTIFIER(%(stow_table)s)
        (file_id, volume_path, file_size, upload_timestamp,
         study_constraint, content_type, client_ip,
         user_email, user_agent,
         status, processed_at, error_message)
    VALUES {', '.join(value_clauses)}
    """
    return query, sql_params


def build_stow_poll_query(
    stow_table: str,
    file_id: str,
) -> tuple[str, dict[str, Any]]:
    """
    Build a parameterized SELECT to poll ``stow_operations`` for Phase 1 completion.

    Phase 1 (split) MERGEs ``status``, ``output_paths``, and ``error_message``
    once it finishes processing a bundle.  The handler polls this query until
    ``status`` is no longer ``'pending'``.

    Returns:
        ``(query, params)`` tuple.  The result set has columns:
        ``status``, ``output_paths``, ``error_message``.
    """
    validate_table_name(stow_table)

    query = """
    SELECT status, output_paths, error_message
    FROM IDENTIFIER(%(stow_table)s)
    WHERE file_id = %(file_id)s
    """
    return query, {"stow_table": stow_table, "file_id": file_id}


def build_stow_insert_completed_query(
    stow_table: str,
    records: list[dict],
) -> tuple[str, dict[str, Any]]:
    """
    Build a parameterized multi-row INSERT for the ``stow_operations`` table
    with ``status='completed'`` and ``output_paths`` pre-populated.

    Used by the **streaming split** path where the handler splits the
    multipart body in-process and writes individual DICOM files directly
    to Volumes — no Spark Phase 1 needed.  The row is inserted as
    ``completed`` so that Phase 2 (metadata extraction) can pick it up
    immediately via CDF.

    Each *record* dict must contain the same fields as
    :func:`build_stow_insert_query` plus:

    * ``output_paths`` — JSON array string of individual DICOM file
      paths (e.g. ``'["/Volumes/.../stow/1.2.3/1.2.4/1.2.5.dcm"]'``).

    Returns:
        ``(query, params)`` tuple.
    """
    validate_table_name(stow_table)

    sql_params: dict[str, Any] = {"stow_table": stow_table}
    value_clauses: list[str] = []

    for i, r in enumerate(records):
        sql_params[f"file_id_{i}"] = r["file_id"]
        sql_params[f"volume_path_{i}"] = r.get("volume_path")
        sql_params[f"file_size_{i}"] = r["file_size"]
        sql_params[f"upload_ts_{i}"] = r["upload_timestamp"]
        sql_params[f"study_{i}"] = r.get("study_constraint")
        sql_params[f"ct_{i}"] = r.get("content_type", "application/dicom")
        sql_params[f"ip_{i}"] = r.get("client_ip")
        sql_params[f"email_{i}"] = r.get("user_email")
        sql_params[f"ua_{i}"] = r.get("user_agent")
        sql_params[f"output_paths_{i}"] = r.get("output_paths")

        value_clauses.append(
            f"(%(file_id_{i})s, %(volume_path_{i})s, %(file_size_{i})s, "
            f"%(upload_ts_{i})s, %(study_{i})s, %(ct_{i})s, %(ip_{i})s, "
            f"%(email_{i})s, %(ua_{i})s, "
            f"'completed', current_timestamp(), NULL, "
            f"from_json(%(output_paths_{i})s, 'ARRAY<STRING>'))"
        )

    query = f"""
    INSERT INTO IDENTIFIER(%(stow_table)s)
        (file_id, volume_path, file_size, upload_timestamp,
         study_constraint, content_type, client_ip,
         user_email, user_agent,
         status, processed_at, error_message, output_paths)
    VALUES {', '.join(value_clauses)}
    """
    return query, sql_params
