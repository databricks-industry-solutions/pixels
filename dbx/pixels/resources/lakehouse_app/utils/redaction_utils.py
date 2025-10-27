"""
Utility functions for DICOM redaction job management via SQL Warehouse API.
"""

import json
import uuid
from typing import Dict, Optional, Union
import httpx
from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("RedactionUtils")


def generate_redaction_id() -> str:
    """Generate a unique UUID for a redaction job."""
    return str(uuid.uuid4())


def parse_redaction_json(redaction_json: Union[str, Dict]) -> Dict:
    """
    Parse redaction JSON from string or dict.
    
    Args:
        redaction_json: JSON string or dictionary
        
    Returns:
        Dictionary with redaction configuration
    """
    if isinstance(redaction_json, str):
        return json.loads(redaction_json)
    return redaction_json


def build_insert_statement(
    table_name: str,
    redaction_id: str,
    file_path: str,
    redaction_json: Dict,
    volume_path: str,
    created_by: Optional[str] = None
) -> str:
    """
    Build SQL INSERT statement for redaction job.
    
    Args:
        table_name: Fully qualified table name (catalog.schema.table)
        redaction_id: Unique identifier for the job
        file_path: Path to the DICOM file to be redacted
        redaction_json: Dictionary with redaction configuration
        volume_path: Unity Catalog volume path for output
        created_by: User who created the job
        
    Returns:
        SQL INSERT statement as string
    """
    # Convert redaction JSON to string and escape single quotes
    redaction_json_str = json.dumps(redaction_json).replace("'", "''")
    
    # Extract metadata from redaction JSON
    study_instance_uid = redaction_json.get('studyInstanceUID', '')
    series_instance_uid = redaction_json.get('seriesInstanceUID', '')
    sop_instance_uid = redaction_json.get('sopInstanceUID', '')
    modality = redaction_json.get('modality', '')
    
    global_redactions_count = redaction_json.get('totalGlobalRedactions', 0)
    frame_specific_redactions_count = redaction_json.get('totalFrameSpecificRedactions', 0)
    total_redaction_areas = redaction_json.get('totalRedactionAreas', 0)
    
    export_timestamp = redaction_json.get('exportTimestamp', '')
    
    # Escape single quotes in strings
    file_path_escaped = file_path.replace("'", "''")
    volume_path_escaped = volume_path.replace("'", "''")
    created_by_escaped = created_by.replace("'", "''") if created_by else ''
    
    # Build INSERT statement
    sql = f"""
    INSERT INTO {table_name} (
        redaction_id,
        file_path,
        study_instance_uid,
        series_instance_uid,
        sop_instance_uid,
        modality,
        redaction_json,
        global_redactions_count,
        frame_specific_redactions_count,
        total_redaction_areas,
        volume_path,
        output_file_path,
        new_series_instance_uid,
        status,
        error_message,
        insert_timestamp,
        update_timestamp,
        processing_start_timestamp,
        processing_end_timestamp,
        processing_duration_seconds,
        created_by,
        export_timestamp
    ) VALUES (
        '{redaction_id}',
        '{file_path_escaped}',
        '{study_instance_uid}',
        '{series_instance_uid}',
        '{sop_instance_uid}',
        '{modality}',
        '{redaction_json_str}',
        {global_redactions_count},
        {frame_specific_redactions_count},
        {total_redaction_areas},
        '{volume_path_escaped}',
        NULL,
        NULL,
        'PENDING',
        NULL,
        current_timestamp(),
        NULL,
        NULL,
        NULL,
        NULL,
        {f"'{created_by_escaped}'" if created_by else 'NULL'},
        {f"'{export_timestamp}'" if export_timestamp else 'NULL'}
    )
    """
    
    return sql.strip()


async def execute_sql_statement(
    sql_statement: str,
    warehouse_id: str,
    databricks_host: str,
    databricks_token: str
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
    
    headers = {
        "Authorization": f"Bearer {databricks_token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "warehouse_id": warehouse_id,
        "statement": sql_statement,
        "wait_timeout": "30s"
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
        logger.info(f"SQL statement executed successfully. Statement ID: {result.get('statement_id')}")
        
        return result


async def insert_redaction_job(
    table_name: str,
    file_path: str,
    redaction_json: Union[str, Dict],
    volume_path: str,
    warehouse_id: str,
    databricks_host: str,
    databricks_token: str,
    created_by: Optional[str] = None
) -> Dict:
    """
    Insert a redaction job into the table via SQL Warehouse API.
    
    Args:
        table_name: Fully qualified table name
        file_path: Path to the DICOM file
        redaction_json: Redaction configuration (string or dict)
        volume_path: Unity Catalog volume path for output
        warehouse_id: Databricks SQL Warehouse ID
        databricks_host: Databricks workspace host
        databricks_token: Databricks access token
        created_by: User who created the job
        
    Returns:
        Dictionary with redaction_id and execution status
    """
    # Parse redaction JSON
    redaction_dict = parse_redaction_json(redaction_json)
    
    # Generate redaction ID
    redaction_id = generate_redaction_id()
    
    # Build INSERT statement
    sql_statement = build_insert_statement(
        table_name=table_name,
        redaction_id=redaction_id,
        file_path=file_path,
        redaction_json=redaction_dict,
        volume_path=volume_path,
        created_by=created_by
    )
    
    # Execute SQL statement
    result = await execute_sql_statement(
        sql_statement=sql_statement,
        warehouse_id=warehouse_id,
        databricks_host=databricks_host,
        databricks_token=databricks_token
    )
    
    return {
        "redaction_id": redaction_id,
        "file_path": file_path,
        "status": "inserted",
        "statement_id": result.get("statement_id")
    }
