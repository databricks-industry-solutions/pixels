"""
DICOMweb Wrapper for Databricks

This module provides a DICOMweb-compliant wrapper that uses Databricks SQL warehouse
to query the object_catalog delta table and respond to DICOMweb protocol requests.

It implements the following DICOMweb services:
- QIDO-RS: Query based on ID for DICOM Objects (Studies, Series, Instances)
- WADO-RS: Web Access to DICOM Objects (Retrieve instances)
- STOW-RS: Store Over the Web (Upload DICOM instances) - Not yet implemented

The wrapper translates DICOMweb REST API calls into SQL queries against the 
object_catalog table, which stores DICOM metadata in a JSON/Variant column.
"""
import os

os.environ["DATABRICKS_HOST"] = "https://e2-demo-field-eng.cloud.databricks.com/"
os.environ["DATABRICKS_TOKEN"] = "<TOKEN>"
os.environ["DATABRICKS_WAREHOUSE_ID"] = "8baced1ff014912d"
os.environ["DATABRICKS_PIXELS_TABLE"] = "ema_rina.pixels_solacc.object_catalog"
os.environ["LAKEBASE_INSTANCE_NAME"] = "shared-online-store"

import io
import json
import time
import functools
import uuid
from typing import Dict, List, Optional, Any
from datetime import datetime
import httpx
from fastapi import HTTPException, Request, Response
from databricks.sdk.core import Config

from dbx.pixels.logging import LoggerProvider
from dbx.pixels.databricks_file import DatabricksFile

import pydicom
import fsspec

from dbx.pixels.resources.lakehouse_app.utils.partial_frames import (
    get_file_part,
    get_file_metadata,
    pixel_frames_from_dcm_metadata_file
)
from dbx.pixels.lakebase import LakebaseUtils

logger = LoggerProvider("DICOMweb")


def timing_decorator(func):
    """Decorator to measure and log function execution time."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = func(*args, **kwargs)
            elapsed_time = time.time() - start_time
            logger.info(f"⏱️  {func.__name__} took {elapsed_time:.4f}s")
            return result
        except Exception as e:
            elapsed_time = time.time() - start_time
            logger.error(f"⏱️  {func.__name__} failed after {elapsed_time:.4f}s: {e}")
            raise
    return wrapper

# Initialize lakebase utils singleton
lb_utils = None
if "LAKEBASE_INSTANCE_NAME" in os.environ:
    try:
        from pathlib import Path
        import dbx.pixels.resources
        
        lb_utils = LakebaseUtils(instance_name=os.environ["LAKEBASE_INSTANCE_NAME"], create_instance=True)
        
        # Initialize lakebase table for frame caching
        path = Path(dbx.pixels.resources.__file__).parent
        sql_file = f"{path}/sql/lakebase/CREATE_LAKEBASE_DICOM_FRAMES.sql"
        with open(sql_file, 'r') as f:
            lb_utils.execute_query(f.read())
        
        logger.info(f"Initialized lakebase instance: {os.environ['LAKEBASE_INSTANCE_NAME']}")
    except Exception as e:
        logger.warning(f"Could not initialize lakebase: {e}")


class DICOMwebDatabricksWrapper:
    """
    DICOMweb wrapper that uses Databricks SQL queries to interact with the object_catalog.
    
    This class provides methods to:
    - Search for DICOM studies, series, and instances using QIDO-RS
    - Retrieve DICOM instances using WADO-RS
    - Build SQL queries from DICOMweb query parameters
    - Format query results as DICOMweb-compliant JSON
    """
    
    # Common DICOM tags mapping (Tag ID -> DICOM keyword)
    DICOM_TAGS = {
        # Patient level
        '00100010': 'PatientName',
        '00100020': 'PatientID',
        '00100030': 'PatientBirthDate',
        '00100040': 'PatientSex',
        
        # Study level
        '0020000D': 'StudyInstanceUID',
        '00080020': 'StudyDate',
        '00080030': 'StudyTime',
        '00080050': 'AccessionNumber',
        '00081030': 'StudyDescription',
        '00080090': 'ReferringPhysicianName',
        '00201206': 'NumberOfStudyRelatedSeries',
        '00201208': 'NumberOfStudyRelatedInstances',
        
        # Series level
        '0020000E': 'SeriesInstanceUID',
        '00200011': 'SeriesNumber',
        '00080060': 'Modality',
        '00080061': 'ModalitiesInStudy',
        '0008103E': 'SeriesDescription',
        '00200013': 'InstanceNumber',
        '00201209': 'NumberOfSeriesRelatedInstances',
        '00080021': 'SeriesDate',
        '00080031': 'SeriesTime',
        
        # Instance level
        '00080018': 'SOPInstanceUID',
        '00080016': 'SOPClassUID',
        '00200032': 'ImagePositionPatient',
        '00200037': 'ImageOrientationPatient',
        '00280010': 'Rows',
        '00280011': 'Columns',
        '00280008': 'NumberOfFrames',
        '00280100': 'BitsAllocated',
        '00280101': 'BitsStored',
        '00280102': 'HighBit',
        '00280103': 'PixelRepresentation',
    }
    
    # Reverse mapping for convenience
    TAG_TO_ID = {v: k for k, v in DICOM_TAGS.items()}
    
    def __init__(self, 
                 databricks_host: str,
                 databricks_token: str, 
                 warehouse_id: str,
                 pixels_table: str):
        """
        Initialize the DICOMweb wrapper.
        
        Args:
            databricks_host: Databricks workspace URL
            databricks_token: Databricks authentication token
            warehouse_id: SQL warehouse ID for query execution
            pixels_table: Name of the object_catalog table
        """
        self.databricks_host = databricks_host
        self.databricks_token = databricks_token
        self.warehouse_id = warehouse_id
        self.pixels_table = pixels_table
        self.sql_statement_api = "/api/2.0/sql/statements/"
        
    @timing_decorator
    def _execute_sql(self, query: str, wait_timeout: str = "30s") -> List[List[Any]]:
        """
        Execute a SQL query using Databricks SQL warehouse.
        
        Args:
            query: SQL query to execute
            wait_timeout: Maximum time to wait for query completion
            
        Returns:
            Query results as a list of rows
            
        Raises:
            HTTPException: If query execution fails
        """
        body = {
            "warehouse_id": self.warehouse_id,
            "statement": query,
            "wait_timeout": wait_timeout,
            "on_wait_timeout": "CANCEL"
        }
        
        logger.debug(f"Executing SQL query: {query}")
        
        with httpx.Client(base_url=self.databricks_host, timeout=httpx.Timeout(60)) as client:
            response = client.post(
                self.sql_statement_api,
                headers={
                    "Authorization": f"Bearer {self.databricks_token}",
                    "Content-Type": "application/json"
                },
                json=body
            )
            
            if response.status_code != 200:
                logger.error(f"SQL query failed with status {response.status_code}: {response.text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"SQL query failed: {response.text}"
                )
            
            result = response.json()
            
            if result.get("status", {}).get("state") == "FAILED":
                error_msg = result.get("status", {}).get("error", {}).get("message", "Unknown error")
                logger.error(f"SQL query failed: {error_msg}")
                raise HTTPException(status_code=500, detail=f"SQL query failed: {error_msg}")
            
            # Return the data array
            return result.get("result", {}).get("data_array", [])
    
    def _build_study_query(self, params: Dict[str, Any]) -> str:
        """
        Build SQL query for QIDO-RS studies search.
        
        Supports DICOMweb query parameters:
        - PatientName
        - PatientID
        - StudyDate
        - StudyTime
        - AccessionNumber
        - ModalitiesInStudy
        - StudyDescription
        - StudyInstanceUID
        - limit/offset for pagination
        
        Args:
            params: Query parameters from DICOMweb request
            
        Returns:
            SQL query string
        """
        filters = ["1=1"]
        
        # Patient Name - case insensitive, wildcard support
        if "PatientName" in params or "00100010" in params:
            name = params.get("PatientName", params.get("00100010", ""))
            # Replace DICOM wildcards (* and ?) with SQL wildcards (% and _)
            name = name.replace("*", "%").replace("?", "_")
            filters.append(f"lower(meta:['00100010'].Value[0]::String) like lower('{name}')")
        
        # Patient ID
        if "PatientID" in params or "00100020" in params:
            patient_id = params.get("PatientID", params.get("00100020", ""))
            patient_id = patient_id.replace("*", "%").replace("?", "_")
            filters.append(f"meta:['00100020'].Value[0]::String like '{patient_id}'")
        
        # Accession Number
        if "AccessionNumber" in params or "00080050" in params:
            accession = params.get("AccessionNumber", params.get("00080050", ""))
            accession = accession.replace("*", "%").replace("?", "_")
            filters.append(f"meta:['00080050'].Value[0]::String like '{accession}'")
        
        # Study Description
        if "StudyDescription" in params or "00081030" in params:
            description = params.get("StudyDescription", params.get("00081030", ""))
            description = description.replace("*", "%").replace("?", "_")
            filters.append(f"lower(meta:['00081030'].Value[0]::String) like lower('{description}')")
        
        # Study Instance UID
        if "StudyInstanceUID" in params or "0020000D" in params:
            study_uid = params.get("StudyInstanceUID", params.get("0020000D", ""))
            filters.append(f"meta:['0020000D'].Value[0]::String = '{study_uid}'")
        
        # Modalities in Study
        if "ModalitiesInStudy" in params or "00080061" in params:
            modalities = params.get("ModalitiesInStudy", params.get("00080061", ""))
            if isinstance(modalities, str):
                modalities = [modalities]
            modality_list = "','".join(modalities)
            filters.append(f"(meta:['00080060'].Value[0]::String in ('{modality_list}') OR "
                         f"meta:['00080061'].Value[0]::String in ('{modality_list}'))")
        
        # Study Date range
        if "StudyDate" in params or "00080020" in params:
            study_date = params.get("StudyDate", params.get("00080020", ""))
            # Handle date range format: 20200101-20201231
            if "-" in study_date:
                start_date, end_date = study_date.split("-")
                filters.append(f"meta:['00080020'].Value[0]::String >= '{start_date}'")
                filters.append(f"meta:['00080020'].Value[0]::String <= '{end_date}'")
            else:
                filters.append(f"meta:['00080020'].Value[0]::String = '{study_date}'")
        
        # Pagination
        limit_clause = ""
        offset_clause = ""
        if "limit" in params:
            limit_clause = f"LIMIT {params['limit']}"
        if "offset" in params:
            offset_clause = f"OFFSET {params['offset']}"
        
        where_clause = " AND ".join(filters)
        
        query = f"""
        SELECT 
            meta:['00100010'].Value[0]::String as PatientName,
            meta:['00100020'].Value[0]::String as PatientID,
            meta:['0020000D'].Value[0]::String as StudyInstanceUID,
            meta:['00080020'].Value[0]::String as StudyDate,
            meta:['00080030'].Value[0]::String as StudyTime,
            meta:['00080050'].Value[0]::String as AccessionNumber,
            meta:['00081030'].Value[0]::String as StudyDescription,
            meta:['00080060'].Value[0]::String as Modality,
            meta:['00080061'].Value[0]::String as ModalitiesInStudy,
            COUNT(DISTINCT meta:['0020000E'].Value[0]::String) as NumberOfStudyRelatedSeries,
            COUNT(*) as NumberOfStudyRelatedInstances
        FROM {self.pixels_table}
        WHERE {where_clause}
        GROUP BY 
            PatientName, PatientID, StudyInstanceUID, StudyDate, 
            StudyTime, AccessionNumber, StudyDescription, Modality, ModalitiesInStudy
        ORDER BY StudyDate DESC, StudyTime DESC
        {limit_clause} {offset_clause}
        """
        
        return query
    
    def _build_series_query(self, study_instance_uid: str, params: Dict[str, Any] = None) -> str:
        """
        Build SQL query for QIDO-RS series search within a study.
        
        Args:
            study_instance_uid: Study Instance UID to search within
            params: Optional query parameters for filtering
            
        Returns:
            SQL query string
        """
        filters = [f"meta:['0020000D'].Value[0]::String = '{study_instance_uid}'"]
        
        if params:
            # Series Instance UID
            if "SeriesInstanceUID" in params or "0020000E" in params:
                series_uid = params.get("SeriesInstanceUID", params.get("0020000E", ""))
                filters.append(f"meta:['0020000E'].Value[0]::String = '{series_uid}'")
            
            # Modality
            if "Modality" in params or "00080060" in params:
                modality = params.get("Modality", params.get("00080060", ""))
                filters.append(f"meta:['00080060'].Value[0]::String = '{modality}'")
            
            # Series Number
            if "SeriesNumber" in params or "00200011" in params:
                series_num = params.get("SeriesNumber", params.get("00200011", ""))
                filters.append(f"meta:['00200011'].Value[0]::String = '{series_num}'")
        
        where_clause = " AND ".join(filters)
        
        query = f"""
        SELECT 
            meta:['0020000D'].Value[0]::String as StudyInstanceUID,
            meta:['0020000E'].Value[0]::String as SeriesInstanceUID,
            meta:['00080060'].Value[0]::String as Modality,
            meta:['00200011'].Value[0]::String as SeriesNumber,
            meta:['0008103E'].Value[0]::String as SeriesDescription,
            meta:['00080021'].Value[0]::String as SeriesDate,
            meta:['00080031'].Value[0]::String as SeriesTime,
            COUNT(*) as NumberOfSeriesRelatedInstances
        FROM {self.pixels_table}
        WHERE {where_clause}
        GROUP BY 
            StudyInstanceUID, SeriesInstanceUID, Modality, 
            SeriesNumber, SeriesDescription, SeriesDate, SeriesTime
        ORDER BY SeriesNumber
        """
        
        return query
    
    def _build_instances_query(self, study_instance_uid: str, series_instance_uid: str, 
                               params: Dict[str, Any] = None) -> str:
        """
        Build SQL query for QIDO-RS instances search within a series.
        
        Args:
            study_instance_uid: Study Instance UID
            series_instance_uid: Series Instance UID
            params: Optional query parameters for filtering
            
        Returns:
            SQL query string
        """
        filters = [
            f"meta:['0020000D'].Value[0]::String = '{study_instance_uid}'",
            f"meta:['0020000E'].Value[0]::String = '{series_instance_uid}'"
        ]
        
        if params:
            # SOP Instance UID
            if "SOPInstanceUID" in params or "00080018" in params:
                sop_uid = params.get("SOPInstanceUID", params.get("00080018", ""))
                filters.append(f"meta:['00080018'].Value[0]::String = '{sop_uid}'")
        
        where_clause = " AND ".join(filters)
        
        query = f"""
        SELECT 
            meta:['0020000D'].Value[0]::String as StudyInstanceUID,
            meta:['0020000E'].Value[0]::String as SeriesInstanceUID,
            meta:['00080018'].Value[0]::String as SOPInstanceUID,
            meta:['00080016'].Value[0]::String as SOPClassUID,
            meta:['00200013'].Value[0]::String as InstanceNumber,
            meta:['00280010'].Value[0]::String as Rows,
            meta:['00280011'].Value[0]::String as Columns,
            meta:['00280008'].Value[0]::String as NumberOfFrames,
            path,
            local_path
        FROM {self.pixels_table}
        WHERE {where_clause}
        ORDER BY CAST(InstanceNumber as INT)
        """
        
        return query
    
    def _format_dicomweb_response(self, results: List[List[Any]], columns: List[str]) -> List[Dict]:
        """
        Format SQL query results as DICOMweb JSON response.
        
        DICOMweb JSON format uses DICOM tags as keys with Value/vr structure:
        {
            "0020000D": {
                "vr": "UI",
                "Value": ["1.2.840.113619.2.55.3.12..."]
            }
        }
        
        Args:
            results: Query results as list of rows
            columns: Column names from query
            
        Returns:
            List of DICOMweb-formatted dictionaries
        """
        formatted_results = []
        
        for row in results:
            item = {}
            for col_name, value in zip(columns, row):
                if value is None:
                    continue
                
                # Find the DICOM tag ID for this column name
                tag_id = self.TAG_TO_ID.get(col_name)
                
                if tag_id:
                    # Determine VR (Value Representation) based on tag
                    vr = self._get_vr_for_tag(tag_id)
                    
                    # Format value appropriately
                    formatted_value = self._format_value(value, vr)
                    
                    item[tag_id] = {
                        "vr": vr,
                        "Value": formatted_value if isinstance(formatted_value, list) else [formatted_value]
                    }
                else:
                    # Non-DICOM column (like paths or counts) - add as is
                    item[col_name] = value
            
            formatted_results.append(item)
        
        return formatted_results
    
    def _get_vr_for_tag(self, tag_id: str) -> str:
        """
        Get the Value Representation (VR) for a DICOM tag.
        
        Args:
            tag_id: DICOM tag ID (e.g., '0020000D')
            
        Returns:
            VR string (e.g., 'UI', 'PN', 'DA', 'TM', 'LO', 'IS')
        """
        # Common VR mappings
        vr_map = {
            '0020000D': 'UI',  # Study Instance UID
            '0020000E': 'UI',  # Series Instance UID
            '00080018': 'UI',  # SOP Instance UID
            '00080016': 'UI',  # SOP Class UID
            '00100010': 'PN',  # Patient Name
            '00100020': 'LO',  # Patient ID
            '00100030': 'DA',  # Patient Birth Date
            '00100040': 'CS',  # Patient Sex
            '00080020': 'DA',  # Study Date
            '00080021': 'DA',  # Series Date
            '00080030': 'TM',  # Study Time
            '00080031': 'TM',  # Series Time
            '00080050': 'SH',  # Accession Number
            '00081030': 'LO',  # Study Description
            '0008103E': 'LO',  # Series Description
            '00080060': 'CS',  # Modality
            '00080061': 'CS',  # Modalities In Study
            '00200011': 'IS',  # Series Number
            '00200013': 'IS',  # Instance Number
            '00280010': 'US',  # Rows
            '00280011': 'US',  # Columns
            '00280008': 'IS',  # Number of Frames
        }
        
        return vr_map.get(tag_id, 'LO')  # Default to LO (Long String)
    
    def _format_value(self, value: Any, vr: str) -> Any:
        """
        Format a value according to its VR type.
        
        Args:
            value: Raw value from database
            vr: Value Representation
            
        Returns:
            Formatted value
        """
        if value is None:
            return []
        
        # Handle array/list values
        if isinstance(value, (list, tuple)):
            return [self._format_value(v, vr) for v in value]
        
        # Handle JSON strings
        if isinstance(value, str) and value.startswith('['):
            try:
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    return [self._format_value(v, vr) for v in parsed]
            except json.JSONDecodeError:
                pass
        
        # String representations
        if vr in ['UI', 'LO', 'SH', 'PN', 'CS']:
            return str(value).strip()
        
        # Numeric representations
        if vr in ['IS', 'DS']:
            return str(value)
        
        if vr in ['US', 'SS', 'UL', 'SL']:
            try:
                return int(value)
            except (ValueError, TypeError):
                return str(value)
        
        # Date/Time
        if vr in ['DA', 'TM', 'DT']:
            return str(value).strip()
        
        return str(value)
    
    # QIDO-RS Endpoints
    
    @timing_decorator
    def search_for_studies(self, params: Dict[str, Any]) -> List[Dict]:
        """
        QIDO-RS: Search for studies.
        
        Endpoint: GET /studies
        
        Args:
            params: Query parameters
            
        Returns:
            List of study objects in DICOMweb JSON format
        """
        logger.info(f"QIDO-RS: Searching for studies with params: {params}")
        
        query = self._build_study_query(params)
        results = self._execute_sql(query)
        
        # Get column names from query
        columns = [
            'PatientName', 'PatientID', 'StudyInstanceUID', 'StudyDate', 'StudyTime',
            'AccessionNumber', 'StudyDescription', 'Modality', 'ModalitiesInStudy',
            'NumberOfStudyRelatedSeries', 'NumberOfStudyRelatedInstances'
        ]
        
        formatted = self._format_dicomweb_response(results, columns)
        logger.info(f"QIDO-RS: Found {len(formatted)} studies")
        
        return formatted
    
    def search_for_series(self, study_instance_uid: str, params: Dict[str, Any] = None) -> List[Dict]:
        """
        QIDO-RS: Search for series within a study.
        
        Endpoint: GET /studies/{study}/series
        
        Args:
            study_instance_uid: Study Instance UID
            params: Optional query parameters
            
        Returns:
            List of series objects in DICOMweb JSON format
        """
        logger.info(f"QIDO-RS: Searching for series in study {study_instance_uid}")
        
        query = self._build_series_query(study_instance_uid, params or {})
        results = self._execute_sql(query)
        
        columns = [
            'StudyInstanceUID', 'SeriesInstanceUID', 'Modality', 'SeriesNumber',
            'SeriesDescription', 'SeriesDate', 'SeriesTime', 'NumberOfSeriesRelatedInstances'
        ]
        
        formatted = self._format_dicomweb_response(results, columns)
        logger.info(f"QIDO-RS: Found {len(formatted)} series")
        
        return formatted
    
    def search_for_instances(self, study_instance_uid: str, series_instance_uid: str,
                                   params: Dict[str, Any] = None) -> List[Dict]:
        """
        QIDO-RS: Search for instances within a series.
        
        Endpoint: GET /studies/{study}/series/{series}/instances
        
        Args:
            study_instance_uid: Study Instance UID
            series_instance_uid: Series Instance UID
            params: Optional query parameters
            
        Returns:
            List of instance objects in DICOMweb JSON format
        """
        logger.info(f"QIDO-RS: Searching for instances in series {series_instance_uid}")
        
        query = self._build_instances_query(study_instance_uid, series_instance_uid, params or {})
        results = self._execute_sql(query)
        
        columns = [
            'StudyInstanceUID', 'SeriesInstanceUID', 'SOPInstanceUID', 'SOPClassUID',
            'InstanceNumber', 'Rows', 'Columns', 'NumberOfFrames', 'path', 'local_path'
        ]
        
        formatted = self._format_dicomweb_response(results, columns)
        logger.info(f"QIDO-RS: Found {len(formatted)} instances")
        
        return formatted
    
    # WADO-RS Endpoints
    
    @timing_decorator
    def retrieve_series_metadata(self, study_instance_uid: str, series_instance_uid: str) -> List[Dict]:
        """
        WADO-RS: Retrieve metadata for all instances in a series.
        
        Endpoint: GET /studies/{study}/series/{series}/metadata
        
        This returns the full DICOM metadata (from the meta column) for all instances
        in the series without the pixel data.
        
        Args:
            study_instance_uid: Study Instance UID
            series_instance_uid: Series Instance UID
            
        Returns:
            List of instance metadata dictionaries in DICOMweb JSON format
        """
        logger.info(f"WADO-RS: Retrieving metadata for series {series_instance_uid}")
        
        # Query to get the metadata
        query = f"""
        SELECT meta
        FROM {self.pixels_table}
        WHERE meta:['0020000D'].Value[0]::String = '{study_instance_uid}'
          AND meta:['0020000E'].Value[0]::String = '{series_instance_uid}'
        """
        
        results = self._execute_sql(query)
        
        if not results:
            raise HTTPException(status_code=404, detail="Series not found or no instances")
        
        # Parse the metadata JSON for each instance
        metadata_list = []
        for row in results:
            if row and row[0]:
                metadata_list.append(json.loads(row[0]))
        
        logger.info(f"WADO-RS: Retrieved metadata for {len(metadata_list)} instances")
        return metadata_list
    
    def retrieve_instance(self, study_instance_uid: str, series_instance_uid: str,
                               sop_instance_uid: str) -> tuple[bytes, str]:
        """
        WADO-RS: Retrieve a DICOM instance.
        
        Endpoint: GET /studies/{study}/series/{series}/instances/{instance}
        
        Args:
            study_instance_uid: Study Instance UID
            series_instance_uid: Series Instance UID
            sop_instance_uid: SOP Instance UID
            
        Returns:
            Tuple of (file_content, content_type)
        """
        logger.info(f"WADO-RS: Retrieving instance {sop_instance_uid}")
        
        # Query to get the file path
        query = f"""
        SELECT local_path, path
        FROM {self.pixels_table}
        WHERE meta:['0020000D'].Value[0]::String = '{study_instance_uid}'
          AND meta:['0020000E'].Value[0]::String = '{series_instance_uid}'
          AND meta:['00080018'].Value[0]::String = '{sop_instance_uid}'
        LIMIT 1
        """
        
        results = self._execute_sql(query)
        
        if not results or not results[0]:
            raise HTTPException(status_code=404, detail="Instance not found")
        
        local_path = results[0][0]
        
        # Read the DICOM file
        try:
            with open(local_path, 'rb') as f:
                content = f.read()
            
            return content, 'application/dicom'
        except Exception as e:
            logger.error(f"Error reading instance file: {e}")
            raise HTTPException(status_code=500, detail=f"Error reading instance: {str(e)}")
    
    @timing_decorator
    def retrieve_instance_frames(self, study_instance_uid: str, series_instance_uid: str,
                                       sop_instance_uid: str, frame_numbers: List[int], 
                                       databricks_token: str, lb_utils=None) -> tuple[List[bytes], str]:
        """
        WADO-RS: Retrieve specific frames from a DICOM instance.
        
        Endpoint: GET /studies/{study}/series/{series}/instances/{instance}/frames/{frameList}
        
        This endpoint retrieves the pixel data for specific frame(s) from a DICOM instance
        using efficient byte-range requests. It uses lakebase for caching frame metadata
        to avoid repeatedly parsing DICOM files.
        
        For single-frame images, frame number should be 1.
        For multi-frame images, frame numbers are 1-indexed.
        
        Args:
            study_instance_uid: Study Instance UID
            series_instance_uid: Series Instance UID
            sop_instance_uid: SOP Instance UID
            frame_numbers: List of frame numbers to retrieve (1-indexed)
            databricks_token: Token for authentication
            lb_utils: Optional LakebaseUtils instance for frame metadata caching
            
        Returns:
            Tuple of (frame_data, content_type)
        """
        logger.info(f"WADO-RS: Retrieving frames {frame_numbers} from instance {sop_instance_uid}")
        
        # Query to get the file path
        query = f"""
        SELECT local_path, ifnull(meta:['00280008'].Value[0]::integer, 1) as NumberOfFrames
        FROM {self.pixels_table}
        WHERE meta:['0020000D'].Value[0]::String = '{study_instance_uid}'
          AND meta:['0020000E'].Value[0]::String = '{series_instance_uid}'
          AND meta:['00080018'].Value[0]::String = '{sop_instance_uid}'
        LIMIT 1
        """
        
        results = self._execute_sql(query)
        
        if not results or not results[0]:
            raise HTTPException(status_code=404, detail="Instance not found")
        
        logger.info(f"WADO-RS: Results: {results}")
        
        path = results[0][0]
        db_file = DatabricksFile.from_full_path(path)
        
        try:
            # Get file metadata including transfer syntax
            start = time.time()
            dicom_metadata = get_file_metadata(databricks_token, db_file)
            logger.info(f"⏱️  get_file_metadata took {time.time() - start:.4f}s")
            
            # Extract transfer syntax UID from metadata (tag 0002,0010)
            transfer_syntax_uid = dicom_metadata.get('00020010', {}).get('Value', ['1.2.840.10008.1.2.1'])[0]
            logger.info(f"Transfer Syntax UID: {transfer_syntax_uid}")
            
            # Extract number of frames from metadata (tag 0028,0008)
            num_frames = int(results[0][1])
            logger.info(f"File has {num_frames} frame(s)")

            # Optimization: If requesting DICOMweb frame 1 and file has only 1 frame,
            # return the entire file's pixel data directly without parsing
            # Note: DICOMweb uses 1-based indexing, pydicom uses 0-based
            if len(frame_numbers) == 1 and frame_numbers[0] == 1 and num_frames == 1:  # DICOMweb frame 1
                # Check if this is a single-frame image by reading metadata
                try:
                    logger.info(f"Single-frame optimization: returning entire pixel data for {path}")
                    start = time.time()
                    file_content = get_file_part(databricks_token, db_file)
                    logger.info(f"⏱️  get_file_part (full file) took {time.time() - start:.4f}s")
                    
                    start = time.time()
                    ds = pydicom.dcmread(io.BytesIO(file_content))
                    logger.info(f"⏱️  pydicom.dcmread took {time.time() - start:.4f}s")
                    
                    # For encapsulated (compressed) pixel data, use generate_frames
                    start = time.time()
                    frames = list(pydicom.encaps.generate_frames(ds.PixelData))
                    logger.info(f"⏱️  pydicom.encaps.generate_frames extracted {len(frames)} frame(s) in {time.time() - start:.4f}s")
                    
                    return frames, transfer_syntax_uid
                except Exception as e:
                    logger.error(f"Error checking if {path} is single-frame: {e}")
                    raise HTTPException(status_code=500, detail=f"Error checking if {path} is single-frame: {str(e)}")
            else:
                # Collect frame data for each requested frame
                frames_data = []
                
                for frame_num in frame_numbers:
                    # Frame numbers are 1-indexed in DICOMweb, convert to 0-indexed
                    frame_idx = frame_num - 1
                    
                    # Try to get frame metadata from lakebase cache
                    frame_metadata = None

                    # If not in cache, extract frame metadata from DICOM file
                    if frame_metadata is None:
                        logger.debug(f"Extracting frame metadata for frame {frame_num}")
                        
                        # Get max indexed frame if available
                        max_frame_idx = 0
                        max_start_pos = 0
                        
                        # Extract frame metadata
                        start = time.time()
                        pixels_metadata = pixel_frames_from_dcm_metadata_file(
                            databricks_token,
                            db_file,
                            frame_idx,
                            max_frame_idx,
                            max_start_pos
                        )
                        logger.info(f"⏱️  pixel_frames_from_dcm_metadata_file took {time.time() - start:.4f}s")
                        
                        frames_list = pixels_metadata.get("frames", [])
                        logger.info(f"Extracted {len(frames_list)} frames, looking for frame_idx={frame_idx}, max_frame_idx={max_frame_idx}")
                        
                        if not frames_list:
                            logger.error(f"No frames extracted from {path}. Pixel data pos: {pixels_metadata.get('pixel_data_pos')}")
                            raise HTTPException(
                                status_code=500,
                                detail=f"Failed to extract frame metadata from file"
                            )
                        
                        # Log the frame numbers we got
                        frame_numbers_in_list = [f["frame_number"] for f in frames_list]
                        logger.info(f"Available frame numbers: {frame_numbers_in_list}")
                        
                        frame_metadata = None
                        for frame in frames_list:
                            if frame["frame_number"] == frame_idx:
                                frame_metadata = frame.copy()
                                frame_metadata["pixel_data_pos"] = pixels_metadata["pixel_data_pos"]
                                break
                        
                        if frame_metadata is None:
                            logger.error(f"Frame {frame_num} (index {frame_idx}) not in available frames: {frame_numbers_in_list}")
                            raise HTTPException(
                                status_code=404,
                                detail=f"Frame {frame_num} (index {frame_idx}) not found in extracted metadata. Available frames: {frame_numbers_in_list}"
                            )
                    
                    # Retrieve the frame content using byte-range request
                    start = time.time()
                    frame_content = get_file_part(databricks_token, db_file, frame_metadata)
                    logger.info(f"⏱️  get_file_part for frame {frame_num} took {time.time() - start:.4f}s")
                    logger.info(f"Frame {frame_num} raw data: {len(frame_content)} bytes, first 16 bytes: {frame_content[:16].hex() if len(frame_content) >= 16 else 'N/A'}")
                    logger.info(f"Frame metadata: start_pos={frame_metadata.get('start_pos')}, end_pos={frame_metadata.get('end_pos')}, size={frame_metadata.get('frame_size')}")
                    
                    # Check if the frame data starts with DICOM item tag (FE FF 00 E0) and skip it if present
                    # This is the encapsulated pixel data item tag that wraps each frame
                    if len(frame_content) >= 8 and frame_content[:4] == b'\xfe\xff\x00\xe0':
                        # Skip the 8-byte header: 4 bytes for tag + 4 bytes for length
                        logger.info(f"Frame {frame_num} has DICOM item tag, skipping 8-byte header")
                        frame_content = frame_content[8:]
                        logger.info(f"After stripping header: {len(frame_content)} bytes, first 16 bytes: {frame_content[:16].hex() if len(frame_content) >= 16 else 'N/A'}")
                    
                    frames_data.append(frame_content)
                
                # Return list of frames with transfer syntax
                return frames_data, transfer_syntax_uid

                
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error extracting frames: {e}")
            raise HTTPException(
                status_code=500, 
                detail=f"Error extracting frames: {str(e)}"
            )


# FastAPI endpoint handlers

def get_dicomweb_wrapper(request: Request, pixels_table: str = None) -> DICOMwebDatabricksWrapper:
    """
    Factory function to create a DICOMwebDatabricksWrapper from a request.
    
    Args:
        request: FastAPI request object
        pixels_table: Optional override for pixels table name
        
    Returns:
        Initialized DICOMwebDatabricksWrapper instance
    """
    cfg = Config()
    
    warehouse_id = os.getenv("DATABRICKS_WAREHOUSE_ID")
    if not warehouse_id:
        raise HTTPException(status_code=500, detail="DATABRICKS_WAREHOUSE_ID not configured")
    
    token = request.headers.get("X-Forwarded-Access-Token") or os.getenv("DATABRICKS_TOKEN")
    if not token:
        raise HTTPException(status_code=401, detail="No authentication token provided")
    
    if not pixels_table:
        pixels_table = request.cookies.get("pixels_table") or os.getenv("DATABRICKS_PIXELS_TABLE")
    
    if not pixels_table:
        raise HTTPException(status_code=500, detail="DATABRICKS_PIXELS_TABLE not configured")
    
    return DICOMwebDatabricksWrapper(
        databricks_host=cfg.host,
        databricks_token=token,
        warehouse_id=warehouse_id,
        pixels_table=pixels_table
    )


# Example FastAPI route handlers (to be integrated into app.py)

@timing_decorator
def dicomweb_qido_studies(request: Request) -> Response:
    """
    QIDO-RS endpoint for searching studies.
    
    GET /dicomweb/studies?PatientName=Smith&StudyDate=20240101-20241231
    """
    wrapper = get_dicomweb_wrapper(request)
    params = dict(request.query_params)
    
    results = wrapper.search_for_studies(params)
    
    return Response(
        content=json.dumps(results, indent=2),
        media_type="application/dicom+json"
    )


def dicomweb_qido_series(request: Request, study_instance_uid: str) -> Response:
    """
    QIDO-RS endpoint for searching series within a study.
    
    GET /dicomweb/studies/{studyInstanceUID}/series
    """
    wrapper = get_dicomweb_wrapper(request)
    params = dict(request.query_params)
    
    results = wrapper.search_for_series(study_instance_uid, params)
    
    return Response(
        content=json.dumps(results, indent=2),
        media_type="application/dicom+json"
    )


def dicomweb_qido_instances(request: Request, study_instance_uid: str, 
                                  series_instance_uid: str) -> Response:
    """
    QIDO-RS endpoint for searching instances within a series.
    
    GET /dicomweb/studies/{studyInstanceUID}/series/{seriesInstanceUID}/instances
    """
    wrapper = get_dicomweb_wrapper(request)
    params = dict(request.query_params)
    
    results = wrapper.search_for_instances(study_instance_uid, series_instance_uid, params)
    
    return Response(
        content=json.dumps(results, indent=2),
        media_type="application/dicom+json"
    )


@timing_decorator
def dicomweb_wado_series_metadata(request: Request, study_instance_uid: str,
                                        series_instance_uid: str) -> Response:
    """
    WADO-RS endpoint for retrieving metadata for all instances in a series.
    
    GET /dicomweb/studies/{studyInstanceUID}/series/{seriesInstanceUID}/metadata
    """
    wrapper = get_dicomweb_wrapper(request)
    
    results = wrapper.retrieve_series_metadata(study_instance_uid, series_instance_uid)
    
    return Response(
        content=json.dumps(results, indent=2),
        media_type="application/dicom+json"
    )


def dicomweb_wado_instance(request: Request, study_instance_uid: str,
                                 series_instance_uid: str, sop_instance_uid: str) -> Response:
    """
    WADO-RS endpoint for retrieving a DICOM instance.
    
    GET /dicomweb/studies/{studyInstanceUID}/series/{seriesInstanceUID}/instances/{sopInstanceUID}
    """
    wrapper = get_dicomweb_wrapper(request)
    
    content = wrapper.retrieve_instance(
        study_instance_uid, series_instance_uid, sop_instance_uid
    )
    
    return Response(
        content=content,
        media_type="application/octet-stream",
        headers={
            "Content-Length": str(len(content)),
            "Cache-Control": "private, max-age=3600"
        }
    )


@timing_decorator
def dicomweb_wado_instance_frames(request: Request, study_instance_uid: str,
                                        series_instance_uid: str, sop_instance_uid: str,
                                        frame_list: str) -> Response:
    """
    WADO-RS endpoint for retrieving specific frames from a DICOM instance.
    
    GET /dicomweb/studies/{studyInstanceUID}/series/{seriesInstanceUID}/instances/{sopInstanceUID}/frames/{frameList}
    
    frameList can be:
    - Single frame: "1"
    - Multiple frames: "1,3,5"
    
    Returns raw compressed pixel data as stored in the DICOM file.
    """
    wrapper = get_dicomweb_wrapper(request)
    
    # Parse frame list (comma-separated frame numbers)
    try:
        frame_numbers = [int(f.strip()) for f in frame_list.split(',')]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid frame list format")
    
    # Get token
    token = request.headers.get("X-Forwarded-Access-Token") or os.getenv("DATABRICKS_TOKEN")
    
    logger.info(f"Frame request: study={study_instance_uid}, series={series_instance_uid}, instance={sop_instance_uid}, frames={frame_numbers}")
    logger.info(f"Accept header: {request.headers.get('Accept')}")
    
    try:
        # Use the global lakebase singleton
        frames_data, transfer_syntax_uid = wrapper.retrieve_instance_frames(
            study_instance_uid, series_instance_uid, sop_instance_uid, frame_numbers,
            token, lb_utils  # Use the module-level singleton
        )
        
        logger.info(f"Retrieved {len(frames_data)} frame(s) with transfer syntax {transfer_syntax_uid}")
        
        # Map transfer syntax UID to content type
        transfer_syntax_to_mime = {
            '1.2.840.10008.1.2.4.80': 'image/jls',  # JPEG-LS Lossless
            '1.2.840.10008.1.2.4.81': 'image/jls',  # JPEG-LS Lossy
            '1.2.840.10008.1.2.4.90': 'image/jp2',  # JPEG 2000 Lossless
            '1.2.840.10008.1.2.4.91': 'image/jp2',  # JPEG 2000
            '1.2.840.10008.1.2.4.50': 'image/jpeg', # JPEG Baseline
            '1.2.840.10008.1.2.4.51': 'image/jpeg', # JPEG Extended
            '1.2.840.10008.1.2.4.57': 'image/jpeg', # JPEG Lossless Non-Hierarchical
            '1.2.840.10008.1.2.4.70': 'image/jpeg', # JPEG Lossless
        }
        
        # Default to application/octet-stream if transfer syntax not recognized
        mime_type = transfer_syntax_to_mime.get(transfer_syntax_uid, 'application/octet-stream')
        
        # Create multipart/related response
        boundary = f"BOUNDARY_{uuid.uuid4()}"
        
        # Build multipart body
        parts = []
        for idx, frame_data in enumerate(frames_data):
            logger.info(f"Frame {idx+1}: {len(frame_data)} bytes, first 4 bytes: {frame_data[:4].hex() if len(frame_data) >= 4 else 'N/A'}")
            part = f"--{boundary}\r\n"
            part += f"Content-Type: {mime_type};transfer-syntax={transfer_syntax_uid}\r\n\r\n"
            parts.append(part.encode('utf-8') + frame_data + b"\r\n")
        
        # Add closing boundary
        parts.append(f"--{boundary}--\r\n".encode('utf-8'))
        
        multipart_body = b''.join(parts)
        
        logger.info(f"Returning multipart response with {len(frames_data)} frame(s), total size: {len(multipart_body)} bytes")
        
        return Response(
            content=multipart_body,
            media_type=f"multipart/related; type={mime_type}; boundary={boundary}",
            headers={
                "Content-Length": str(len(multipart_body)),
                "Cache-Control": "private, max-age=3600"
            }
        )
    except Exception as e:
        logger.error(f"Error retrieving frames: {e}", exc_info=True)
        raise

