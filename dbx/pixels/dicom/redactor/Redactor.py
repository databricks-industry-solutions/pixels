import time
import datetime
import json
import uuid
from typing import Dict, List, Optional, Union
from pydicom.uid import generate_uid
from dbx.pixels.logging import LoggerProvider
from dbx.pixels.dicom.redactor.utils import redact_dcm

logger = LoggerProvider("DicomRedactor")

class Redactor:
    """
    Orchestrates DICOM file redaction using Delta table streaming.
    
    This class provides streaming-based redaction processing:
    1. Reads pending redaction jobs from a Delta table
    2. Processes files in parallel using Spark UDFs
    3. Updates results back to the table using MERGE operations
    
    All information is stored and managed in the Delta table.
    
    Example:
        redactor = Redactor(spark=spark)
        
        query = redactor.process_from_table(
            source_table='catalog.schema.object_catalog_redaction',
            checkpoint_location='/Volumes/catalog/schema/volume/checkpoints',
            trigger_interval="30 seconds",
            max_files_per_trigger=100
        )
    """
    
    def __init__(self, spark):
        """
        Initialize the Redactor for streaming processing.
        
        Args:
            spark: SparkSession for streaming operations
        """
        if not spark:
            raise ValueError("Spark session is required for streaming redaction processing")
        
        self.spark = spark
        self.logger = LoggerProvider("DicomRedactorStreaming")
        self.logger.info("Redactor initialized for streaming processing")
    
    def process_from_table(
        self,
        source_table: str,
        checkpoint_location: str,
        trigger_processing_time: str = None,
        trigger_available_now: bool = None,
        max_files_per_trigger: int = 100
    ):
        """
        Process redactions from a Delta table using Structured Streaming.
        
        This method reads pending redaction jobs from a table, processes them in parallel
        using a UDF, and merges the results back to the same table.
        
        Args:
            source_table: Name of the source/destination table
            checkpoint_location: Location for streaming checkpoints
            trigger_interval: How often to trigger processing (e.g., "10 seconds", "1 minute")
            max_files_per_trigger: Maximum number of files to process per trigger
            
        Returns:
            StreamingQuery object
        """
        self.logger.info(f"Starting streaming redaction from table: {source_table}")
        self.logger.info(f"Checkpoint location: {checkpoint_location}")
        
        # Create the redaction UDF
        redaction_udf = self._create_redaction_udf()
        
        # Read stream from table - only process pending records
        stream_df = (
            self.spark.readStream
            .format("delta")
            .option("ignoreChanges", "true")
            .option("maxFilesPerTrigger", max_files_per_trigger)
            .table(source_table)
            .filter("status = 'PENDING'")
        )
        
        # Apply the redaction UDF
        from pyspark.sql.functions import col, current_timestamp, lit
        
        processed_df = (
            stream_df
            .withColumn("processing_start_timestamp", current_timestamp())
            .withColumn("status", lit("PROCESSING"))
            .withColumn("redaction_result", redaction_udf(
                col("file_path"),
                col("redaction_json"),
                col("redaction_id")
            ))
        )
        
        # Extract result fields
        from pyspark.sql.functions import col as F_col
        processed_df = (
            processed_df
            .withColumn("output_file_path", F_col("redaction_result.output_file_path"))
            .withColumn("status", F_col("redaction_result.status"))
            .withColumn("error_message", F_col("redaction_result.error_message"))
            .withColumn("new_series_instance_uid", F_col("redaction_result.new_series_instance_uid"))
            .withColumn("processing_end_timestamp", current_timestamp())
            .withColumn("update_timestamp", current_timestamp())
            .drop("redaction_result")
        )
        
        # Write stream with foreachBatch for MERGE operation
        query = (
            processed_df.writeStream
            .foreachBatch(lambda batch_df, batch_id: self._merge_results(batch_df, source_table))
            .option("checkpointLocation", checkpoint_location)
            .trigger(processingTime=trigger_processing_time, availableNow=trigger_available_now)
            .start()
        )
        
        self.logger.info(f"Streaming query started with ID: {query.id}")
        return query
    
    def _create_redaction_udf(self):
        """
        Create a Spark UDF for parallel DICOM redaction.
        
        Returns:
            PySpark UDF for redaction processing
        """
        from pyspark.sql.functions import udf
        from pyspark.sql.types import StructType, StructField, StringType
        
        # Define the return schema
        result_schema = StructType([
            StructField("output_file_path", StringType(), True),
            StructField("status", StringType(), False),
            StructField("error_message", StringType(), True),
            StructField("new_series_instance_uid", StringType(), True),
            StructField("processing_duration_seconds", StringType(), True)
        ])
        
        def redact_file_udf(file_path: str, redaction_json_str: str, redaction_id: str) -> Dict:
            """
            UDF to redact a single DICOM file.
            
            Args:
                file_path: Path to the DICOM file
                redaction_json_str: JSON string with redaction instructions
                redaction_id: Unique identifier for this redaction job
                
            Returns:
                Dictionary with processing results
            """
            result = {
                "output_file_path": None,
                "status": "FAILED",
                "error_message": None,
                "new_series_instance_uid": None,
                "processing_duration_seconds": "0"
            }
            
            start_time = time.time()
            
            try:
                # Parse the redaction JSON
                redaction_json = json.loads(redaction_json_str)
                
                # Generate a new SeriesInstanceUID
                new_series_uid = generate_uid()
                
                # Perform the redaction
                output_path = redact_dcm(file_path, redaction_json, new_series_uid)
                
                # Update result
                result["output_file_path"] = output_path
                result["status"] = "SUCCESS"
                result["new_series_instance_uid"] = new_series_uid
                result["processing_duration_seconds"] = str(time.time() - start_time)
                
                logger.info(f"Successfully redacted {file_path} for job {redaction_id}")
                
            except Exception as e:
                result["status"] = "FAILED"
                result["error_message"] = str(e)
                result["processing_duration_seconds"] = str(time.time() - start_time)
                logger.error(f"Failed to redact {file_path} for job {redaction_id}: {e}")
            
            return result
        
        return udf(redact_file_udf, result_schema)
    
    def _merge_results(self, batch_df, target_table: str):
        """
        Merge processed results back to the source table.
        
        Args:
            batch_df: Batch DataFrame with processed results
            target_table: Target table name for MERGE operation
        """
        if batch_df.isEmpty():
            self.logger.info("Empty batch, skipping MERGE")
            return
        
        self.logger.info(f"Merging {batch_df.count()} records to {target_table}")
        
        # Create a temporary view for the batch
        temp_view = f"redaction_batch_{uuid.uuid4().hex}"
        batch_df.createOrReplaceTempView(temp_view)
        
        # Perform MERGE operation
        merge_sql = f"""
        MERGE INTO {target_table} AS target
        USING {temp_view} AS source
        ON target.redaction_id = source.redaction_id 
           AND target.file_path = source.file_path 
        WHEN MATCHED THEN UPDATE SET
            target.status = source.status,
            target.output_file_path = source.output_file_path,
            target.new_series_instance_uid = source.new_series_instance_uid,
            target.error_message = source.error_message,
            target.processing_start_timestamp = source.processing_start_timestamp,
            target.processing_end_timestamp = source.processing_end_timestamp,
            target.processing_duration_seconds = CAST(source.processing_duration_seconds AS DOUBLE),
            target.update_timestamp = source.update_timestamp
        """
        
        try:
            self.spark.sql(merge_sql)
            self.logger.info(f"Successfully merged batch to {target_table}")
        except Exception as e:
            self.logger.error(f"Failed to merge batch: {e}")
            raise
