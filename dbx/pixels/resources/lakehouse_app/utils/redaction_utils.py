"""
Utility functions for DICOM redaction job management via SQL Warehouse API.
"""

import json
import uuid
from typing import Dict, Optional, Union

import httpx

from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("RedactionUtils")


def build_insert_statement(table_name: str) -> str:
    """
    Build SQL INSERT statement for redaction job.

    Args:
        table_name: Fully qualified table name (catalog.schema.table)

    Returns:
        SQL INSERT statement as string
    """

    # Build INSERT statement
    sql = f"""
    INSERT INTO {table_name} (
        redaction_id,
        study_instance_uid,
        series_instance_uid,
        new_series_instance_uid,
        modality,
        redaction_json,
        global_redactions_count,
        frame_specific_redactions_count,
        total_redaction_areas,
        status,
        insert_timestamp,
        created_by,
        export_timestamp
    ) VALUES (
        :redaction_id,
        :study_instance_uid,
        :series_instance_uid,
        :new_series_instance_uid,
        :modality,
        parse_json(:redaction_json),
        :global_redactions_count,
        :frame_specific_redactions_count,
        :total_redaction_areas,
        'PENDING',
        current_timestamp(),
        :created_by,
        :export_timestamp
    )
    """

    return sql.strip()


async def execute_sql_statement(
    sql_statement: str, warehouse_id: str, databricks_host: str, databricks_token: str, params: Dict
) -> Dict:
    """
    Execute SQL statement via Databricks SQL Warehouse API.

    Args:
        sql_statement: SQL statement to execute
        warehouse_id: Databricks SQL Warehouse ID
        databricks_host: Databricks workspace host
        databricks_token: Databricks access token

    Returns:
        Response dictionary from the API

    Raises:
        HTTPException if the request fails
    """
    url = f"{databricks_host}/api/2.0/sql/statements"

    headers = {"Authorization": f"Bearer {databricks_token}", "Content-Type": "application/json"}

    payload = {
        "warehouse_id": warehouse_id,
        "statement": sql_statement,
        "parameters": [
            {"name": "redaction_id", "value": params.get("redaction_id")},
            {"name": "study_instance_uid", "value": params.get("study_instance_uid")},
            {"name": "series_instance_uid", "value": params.get("series_instance_uid")},
            {"name": "new_series_instance_uid", "value": params.get("new_series_instance_uid")},
            {"name": "modality", "value": params.get("modality")},
            {"name": "redaction_json", "value": params.get("redaction_json")},
            {"name": "global_redactions_count", "value": params.get("global_redactions_count")},
            {
                "name": "frame_specific_redactions_count",
                "value": params.get("frame_specific_redactions_count"),
            },
            {"name": "total_redaction_areas", "value": params.get("total_redaction_areas")},
            {"name": "export_timestamp", "value": params.get("export_timestamp")},
            {"name": "created_by", "value": params.get("created_by")},
        ],
        "wait_timeout": "30s",
    }

    logger.info(f"Executing SQL statement via warehouse {warehouse_id}")
    logger.debug(f"SQL: {sql_statement[:200]}...")

    async with httpx.AsyncClient(timeout=httpx.Timeout(60.0)) as client:
        response = await client.post(url, headers=headers, json=payload)

        if response.status_code != 200:
            error_msg = f"SQL execution failed: {response.status_code} - {response.text}"
            logger.error(error_msg)
            raise Exception(error_msg)

        result = response.json()
        logger.info(
            f"SQL statement executed successfully. Statement ID: {result.get('statement_id')}"
        )

        return result


async def insert_redaction_job(
    table_name: str,
    redaction_json: Union[str, Dict],
    warehouse_id: str,
    databricks_host: str,
    databricks_token: str,
    created_by: Optional[str] = None,
) -> Dict:
    """
    Insert a redaction job into the table via SQL Warehouse API.

    Args:
        table_name: Fully qualified table name
        redaction_json: Redaction configuration (string or dict)
        warehouse_id: Databricks SQL Warehouse ID
        databricks_host: Databricks workspace host
        databricks_token: Databricks access token
        created_by: User who created the job

    Returns:
        Dictionary with redaction_id and execution status
    """
    import pydicom

    redaction_id = str(uuid.uuid4())
    new_series_uid = pydicom.uid.generate_uid()

    params = {
        "redaction_id": redaction_id,
        "study_instance_uid": redaction_json.get("studyInstanceUID", ""),
        "series_instance_uid": redaction_json.get("seriesInstanceUID", ""),
        "new_series_instance_uid": new_series_uid,
        "sop_instance_uid": redaction_json.get("sopInstanceUID", ""),
        "modality": redaction_json.get("modality", ""),
        "redaction_json": json.dumps(redaction_json),
        "global_redactions_count": redaction_json.get("totalGlobalRedactions", 0),
        "frame_specific_redactions_count": redaction_json.get("totalFrameSpecificRedactions", 0),
        "total_redaction_areas": redaction_json.get("totalRedactionAreas", 0),
        "export_timestamp": redaction_json.get("exportTimestamp", ""),
        "created_by": created_by,
    }

    # Build INSERT statement
    sql_statement = build_insert_statement(table_name=table_name)

    # Execute SQL statement
    result = await execute_sql_statement(
        sql_statement=sql_statement,
        warehouse_id=warehouse_id,
        databricks_host=databricks_host,
        databricks_token=databricks_token,
        params=params,
    )

    return {
        "redaction_id": redaction_id,
        "status": "inserted",
        "statement_id": result.get("statement_id"),
    }
