import json
import time
import traceback
from datetime import datetime
from typing import Dict

import pyspark.sql.functions as fn
from pyspark.sql.types import StringType, StructField, StructType

from dbx.pixels.dicom.redactor.utils import redact_dcm
from dbx.pixels.logging import LoggerProvider

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
        self.logger = LoggerProvider("DicomRedactor")
        self.logger.info("Redactor initialized for streaming processing")

    def process_from_table(
        self,
        source_table: str,
        volume: str,
        dest_base_path: str,
        checkpoint_location: str,
        trigger_processing_time: str = None,
        trigger_available_now: bool = None,
        max_files_per_trigger: int = 100,
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

        self.source_table = source_table
        self.volume = volume
        self.dest_base_path = dest_base_path

        # Read stream from table - only process pending records
        stream_df = (
            self.spark.readStream.format("delta")
            .option("skipChangeCommits", "true")
            .option("maxFilesPerTrigger", max_files_per_trigger)
            .table(self.source_table)
            .filter(fn.col("status") == fn.lit("PENDING"))
            .withColumn("processing_start_timestamp", fn.current_timestamp())
        )

        # Write stream with foreachBatch for MERGE operation
        query = (
            stream_df.writeStream.foreachBatch(
                lambda batch_df, batch_id: self._merge_results(batch_df, batch_id)
            )
            .option("checkpointLocation", checkpoint_location)
            .trigger(processingTime=trigger_processing_time, availableNow=trigger_available_now)
            .start()
        )

        self.logger.info(f"Streaming query started with ID: {query.id}")
        return query

    def _merge_results(self, batch_df, batch_id):
        """
        Merge processed results back to the source table.

        Args:
            batch_df: Batch DataFrame with processed results
            target_table: Target table name for MERGE operation
        """
        if batch_df.isEmpty():
            return

        processed_df = (
            batch_df.withColumn(
                "file_path",
                fn.explode(fn.variant_get("redaction_json", "$.filesToEdit", "array<string>")),
            )
            .withColumn(
                "redaction_result",
                redact_file_udf(
                    fn.col("file_path"),
                    fn.to_json(fn.col("redaction_json")),
                    fn.col("redaction_id"),
                    fn.col("new_series_instance_uid"),
                    fn.lit(self.volume),
                    fn.lit(self.dest_base_path),
                ),
            )
            .groupBy("redaction_id")
            .agg(
                fn.collect_set(fn.col("redaction_result.output_file_path")).alias(
                    "output_file_paths"
                ),
                fn.max(fn.col("redaction_result.status")).alias("status"),
                fn.collect_list(fn.col("redaction_result.error_message")).alias("error_messages"),
                fn.min(fn.col("redaction_result.processing_start_timestamp")).alias(
                    "processing_start_timestamp"
                ),
                fn.max(fn.col("redaction_result.processing_end_timestamp")).alias(
                    "processing_end_timestamp"
                ),
                fn.max(fn.col("redaction_result.processing_duration_seconds")).alias(
                    "processing_duration_seconds"
                ),
                fn.current_timestamp().alias("update_timestamp"),
            )
        )

        from delta.tables import DeltaTable

        delta_table = DeltaTable.forName(processed_df.sparkSession, self.source_table)

        (
            delta_table.alias("trg")
            .merge(processed_df.alias("src"), "trg.redaction_id == src.redaction_id")
            .whenMatchedUpdate(
                set={
                    "status": "src.status",
                    "output_file_paths": "src.output_file_paths",
                    "error_messages": "src.error_messages",
                    "processing_start_timestamp": "src.processing_start_timestamp",
                    "processing_end_timestamp": "src.processing_end_timestamp",
                    "processing_duration_seconds": "src.processing_duration_seconds",
                    "update_timestamp": "src.update_timestamp",
                }
            )
        ).execute()


@fn.udf(
    returnType=StructType(
        [
            StructField("output_file_path", StringType(), True),
            StructField("status", StringType(), False),
            StructField("error_message", StringType(), True),
            StructField("processing_duration_seconds", StringType(), False),
            StructField("processing_start_timestamp", StringType(), False),
            StructField("processing_end_timestamp", StringType(), False),
        ]
    )
)
def redact_file_udf(
    file_path: str,
    redaction_json_str: str,
    redaction_id: str,
    new_series_instance_uid: str,
    volume: str,
    dest_base_path: str,
    stop_on_exception: bool = False,
) -> Dict:
    """
    UDF to redact a single DICOM file.
    Args:
        file_path: Path to the DICOM file
        redaction_json_str: JSON string with redaction instructions
        redaction_id: Unique identifier for this redaction job
        new_series_instance_uid: New SeriesInstanceUID for the redacted file
        volume: Volume name for the redacted file
        dest_base_path: Base path for the redacted file
    Returns:
        Dictionary with processing results
    """
    start_time = time.time()
    result = {
        "output_file_path": None,
        "error_message": None,
        "processing_start_timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "processing_end_timestamp": None,
        "processing_duration_seconds": "0",
    }
    try:
        # Parse the redaction JSON
        redaction_json = json.loads(redaction_json_str)
        redaction_json["new_series_instance_uid"] = new_series_instance_uid
        # Perform the redaction
        output_path = redact_dcm(file_path, redaction_json, redaction_id, volume, dest_base_path)
        # Update result
        result["output_file_path"] = output_path
        result["status"] = "SUCCESS"
        result["processing_duration_seconds"] = str(time.time() - start_time)
        result["processing_end_timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        logger.info(f"Successfully redacted {file_path} for job {redaction_id}")
    except Exception as e:
        result["status"] = "FAILED"
        result["error_message"] = str(e) + "\n" + traceback.format_exc()
        result["processing_duration_seconds"] = str(time.time() - start_time)
        result["processing_end_timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        logger.error(f"Failed to redact {file_path} for job {redaction_id}: {e}")
        logger.error(traceback.format_exc())
        if stop_on_exception:
            raise e
    return result
