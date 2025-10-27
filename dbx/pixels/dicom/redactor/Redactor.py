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
        from delta.tables import DeltaTable
        from pyspark.sql.functions import col

        delta_table = DeltaTable.forName(self.spark, target_table)

        merge_condition = (
            (col("target.redaction_id") == col("source.redaction_id")) & 
            (col("target.file_path") == col("source.file_path"))
        )

        (
            delta_table.alias("target")
            .merge(
                batch_df.alias("source"),
                merge_condition
            )
            .whenMatchedUpdate(set = {
                "status": col("source.status"),
                "output_file_path": col("source.output_file_path"),
                "new_series_instance_uid": col("source.new_series_instance_uid"),
                "error_message": col("source.error_message"),
                "processing_start_timestamp": col("source.processing_start_timestamp"),
                "processing_end_timestamp": col("source.processing_end_timestamp"),
                "processing_duration_seconds": col("source.processing_duration_seconds").cast("double"),
                "update_timestamp": col("source.update_timestamp")
            })
            .execute()
        )

        self.logger.info(f"Successfully merged batch to {target_table} using DeltaTable API")

