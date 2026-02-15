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
# STOW-RS — INSERT builder
# ---------------------------------------------------------------------------


def build_insert_instance_query(
    pixels_table: str,
) -> tuple[str, None]:
    """
    Build a parameterized INSERT statement for a single DICOM instance.

    The caller must provide a ``params`` dict with the following keys:

    * ``path`` — ``dbfs:/Volumes/…`` path
    * ``length`` — file size in bytes
    * ``local_path`` — ``/Volumes/…`` path
    * ``relative_path`` — path relative to the volume root
    * ``meta_json`` — DICOM metadata as a JSON string (for ``parse_json()``)

    Returns:
        ``(query_str, None)`` — the query template; the caller binds params
        at execution time.
    """
    validate_table_name(pixels_table)

    query = """
    INSERT INTO IDENTIFIER(%(pixels_table)s)
        (path, modificationTime, length, original_path, relative_path,
         local_path, extension, file_type, path_tags, is_anon, meta)
    VALUES (
        %(path)s,
        current_timestamp(),
        %(length)s,
        %(path)s,
        %(relative_path)s,
        %(local_path)s,
        'dcm',
        'DICOM',
        array(),
        false,
        parse_json(%(meta_json)s)
    )
    """
    return query, None
