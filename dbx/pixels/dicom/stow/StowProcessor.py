import json
import os
import time
import traceback
import uuid
from datetime import datetime
from typing import Dict, List

import pyspark.sql.functions as fn
from pyspark.sql import DataFrame
from pyspark.sql.types import (
    ArrayType,
    LongType,
    StringType,
    StructField,
    StructType,
)

from dbx.pixels import Catalog
from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("StowProcessor")


# ---------------------------------------------------------------------------
# UDF return schema — one struct per DICOM part extracted from the bundle
# ---------------------------------------------------------------------------

_SPLIT_RESULT_SCHEMA = ArrayType(
    StructType(
        [
            StructField("output_path", StringType(), False),
            StructField("file_size", LongType(), False),
            StructField("meta_json", StringType(), True),
            StructField("status", StringType(), False),
            StructField("error_message", StringType(), True),
        ]
    )
)


class StowProcessor:
    """
    Orchestrates STOW-RS file ingestion using Delta table streaming.

    Processing pipeline (per micro-batch):

    1. Reads pending uploads from the ``stow_operations`` Delta table
       (CDF — new inserts with ``status = 'pending'``).
    2. Applies ``stow_split_udf`` to each row — the UDF:

       a. Opens the temp multipart bundle from ``/Volumes/…``.
       b. Parses the ``multipart/related`` body into individual parts.
       c. Saves each DICOM part to its final location on Volumes.
       d. Extracts DICOM metadata via ``pydicom.dcmread()``.
       e. Returns an array of ``(output_path, file_size, meta_json,
          status, error_message)`` structs.

    3. Explodes the array, builds catalog-compatible rows using
       ``Catalog._with_path_meta()``, and appends to the catalog table.
    4. MERGEs back to ``stow_operations`` to set
       ``status = 'completed'`` (or ``'failed'``).

    Example::

        processor = StowProcessor(spark=spark)

        query = processor.process_from_table(
            source_table='catalog.schema.stow_operations',
            catalog_table='catalog.schema.object_catalog',
            volume='catalog.schema.pixels_volume',
            checkpoint_location='/Volumes/.../stow_checkpoints/',
            trigger_available_now=True,
        )

        query.awaitTermination()
    """

    def __init__(self, spark):
        """
        Initialize the StowProcessor for streaming processing.

        Args:
            spark: SparkSession for streaming operations.
        """
        if not spark:
            raise ValueError("Spark session is required for STOW processing")

        self.spark = spark
        self.logger = LoggerProvider("StowProcessor")
        self.logger.info("StowProcessor initialized for streaming processing")

    def process_from_table(
        self,
        source_table: str,
        catalog_table: str,
        volume: str,
        checkpoint_location: str,
        trigger_processing_time: str = None,
        trigger_available_now: bool = None,
        max_files_per_trigger: int = 200,
    ):
        """
        Process STOW-RS uploads from the ``stow_operations`` Delta table
        using Structured Streaming.

        Reads pending rows via CDF, splits multipart bundles into
        individual DICOMs, registers paths + metadata in the catalog
        table, and MERGEs the status back to ``stow_operations``.

        Args:
            source_table: Fully-qualified ``stow_operations`` table name
                (``catalog.schema.stow_operations``).
            catalog_table: Fully-qualified catalog table name
                (``catalog.schema.object_catalog``).
            volume: Unity Catalog volume name
                (``catalog.schema.volume_name``).
            checkpoint_location: Path for streaming checkpoints.
            trigger_processing_time: How often to trigger processing
                (e.g. ``"10 seconds"``).  Mutually exclusive with
                *trigger_available_now*.
            trigger_available_now: If ``True``, drain all pending rows
                and stop.  Mutually exclusive with
                *trigger_processing_time*.
            max_files_per_trigger: Maximum files per micro-batch.

        Returns:
            StreamingQuery object.
        """
        self.logger.info(f"Starting STOW ingestion from table: {source_table}")
        self.logger.info(f"Catalog table: {catalog_table}")
        self.logger.info(f"Checkpoint location: {checkpoint_location}")

        self.source_table = source_table
        self.catalog_table = catalog_table
        self.volume = volume
        self.catalog = Catalog(self.spark, table=catalog_table, volume=volume)

        # Derive the Volumes base path for saving individual DICOMs.
        # volume = "catalog.schema.vol_name" → "/Volumes/catalog/schema/vol_name"
        self._volume_base = f"/Volumes/{volume.replace('.', '/')}"

        # Read stream — only new inserts with status = 'pending'.
        # skipChangeCommits prevents our own MERGE writes from looping back.
        stream_df = (
            self.spark.readStream.format("delta")
            .option("readChangeFeed", "true")
            .option("skipChangeCommits", "true")
            .option("maxFilesPerTrigger", max_files_per_trigger)
            .table(self.source_table)
            .filter(fn.col("_change_type") == "insert")
            .filter(fn.col("status") == "pending")
        )

        # Write stream with foreachBatch for MERGE operation
        query = (
            stream_df.writeStream
            .foreachBatch(
                lambda batch_df, batch_id: self._merge_results(batch_df, batch_id)
            )
            .option("checkpointLocation", checkpoint_location)
            .trigger(
                processingTime=trigger_processing_time,
                availableNow=trigger_available_now,
            )
            .start()
        )

        self.logger.info(f"Streaming query started with ID: {query.id}")
        return query

    # -----------------------------------------------------------------
    # foreachBatch callback
    # -----------------------------------------------------------------

    def _merge_results(self, batch_df: DataFrame, batch_id: int) -> None:
        """
        Process a single micro-batch of pending STOW operations.

        1. Apply ``stow_split_udf`` to split multipart bundles →
           individual DICOMs + metadata.
        2. Explode results, build catalog DataFrame, append to catalog.
        3. MERGE status back to ``stow_operations``.

        Args:
            batch_df: Micro-batch DataFrame (from CDF stream).
            batch_id: Spark-assigned batch identifier.
        """
        if batch_df.isEmpty():
            return

        self.logger.info(f"Batch {batch_id}: processing STOW bundles")

        volume_base = self._volume_base

        # ── 1. Split bundles into individual DICOMs ───────────────────
        split_df = batch_df.withColumn(
            "parts",
            stow_split_udf(
                fn.col("volume_path"),
                fn.col("content_type"),
                fn.lit(volume_base),
            ),
        )

        # Explode the parts array — one row per extracted DICOM.
        # Persist so the UDF result is computed once and reused by both
        # the catalog save (step 2) and the status MERGE (step 3).
        from pyspark import StorageLevel

        exploded_df = (
            split_df
            .select("file_id", fn.explode("parts").alias("part"))
            .select(
                "file_id",
                fn.col("part.output_path").alias("path"),
                fn.col("part.file_size").alias("length"),
                fn.col("part.meta_json").alias("meta"),
                fn.col("part.status").alias("part_status"),
                fn.col("part.error_message").alias("part_error"),
            )
            .persist(StorageLevel.MEMORY_AND_DISK)
        )

        try:
            # ── 2. Register successful parts in the catalog ──────────
            success_df = exploded_df.filter(fn.col("part_status") == "SUCCESS")

            catalog_df = (
                success_df
                .withColumn("modificationTime", fn.current_timestamp())
                .withColumn("original_path", fn.col("path"))
            )

            catalog_df = Catalog._with_path_meta(catalog_df)
            catalog_df = catalog_df.withColumn("is_anon", fn.lit(False))

            # Parse meta JSON string to VARIANT (matching catalog schema)
            catalog_df = catalog_df.withColumn(
                "meta",
                fn.when(
                    fn.col("meta").isNotNull(),
                    fn.expr("parse_json(meta)"),
                ).otherwise(fn.lit(None)),
            )

            # Select only catalog-compatible columns
            catalog_df = catalog_df.select(
                "path", "modificationTime", "length", "original_path",
                "relative_path", "local_path", "extension", "file_type",
                "path_tags", "is_anon", "meta",
            )

            self.catalog.save(catalog_df, mode="append")

            self.logger.info(f"Batch {batch_id}: saved to {self.catalog_table}")

            # ── 3. MERGE status back to stow_operations ──────────────
            # Aggregate per file_id: if any part failed → 'failed', else 'completed'
            status_df = (
                exploded_df
                .groupBy("file_id")
                .agg(
                    fn.count("*").alias("parts_count"),
                    fn.sum(
                        fn.when(fn.col("part_status") == "FAILED", 1).otherwise(0)
                    ).alias("fail_count"),
                    fn.first(
                        fn.when(
                            fn.col("part_error").isNotNull(), fn.col("part_error")
                        )
                    ).alias("first_error"),
                )
                .withColumn(
                    "final_status",
                    fn.when(fn.col("fail_count") > 0, fn.lit("failed"))
                    .otherwise(fn.lit("completed")),
                )
                .withColumn(
                    "error_message",
                    fn.when(
                        fn.col("fail_count") > 0, fn.col("first_error")
                    ).otherwise(fn.lit(None).cast("string")),
                )
            )

            from delta.tables import DeltaTable

            delta_table = DeltaTable.forName(
                batch_df.sparkSession, self.source_table,
            )

            (
                delta_table.alias("trg")
                .merge(
                    status_df.alias("src"),
                    "trg.file_id = src.file_id",
                )
                .whenMatchedUpdate(
                    set={
                        "status": fn.col("src.final_status"),
                        "processed_at": fn.current_timestamp(),
                        "error_message": fn.col("src.error_message"),
                    }
                )
                .execute()
            )

            self.logger.info(
                f"Batch {batch_id}: MERGE complete — "
                f"statuses updated in {self.source_table}"
            )
        finally:
            exploded_df.unpersist()


# ---------------------------------------------------------------------------
# UDF — split multipart bundle → individual DICOMs + metadata
# ---------------------------------------------------------------------------


@fn.udf(returnType=_SPLIT_RESULT_SCHEMA)
def stow_split_udf(
    volume_path: str,
    content_type: str,
    volume_base: str,
) -> List[Dict]:
    """
    Split a multipart/related temp file into individual DICOM files.

    This UDF runs on Spark workers where ``/Volumes/…`` is FUSE-mounted.
    It:

    1. Reads the temp bundle file from ``volume_path``.
    2. Extracts the ``boundary`` from ``content_type``.
    3. Splits the multipart body on the boundary.
    4. For each part, saves the raw bytes as ``<volume_base>/stow/<uuid>.dcm``.
    5. Attempts to extract DICOM metadata via ``pydicom.dcmread()``
       (best-effort — non-DICOM parts get ``meta_json = None``).

    Args:
        volume_path: Path to the temp multipart file (``/Volumes/…/<id>.mpr``).
        content_type: Full Content-Type header value including the boundary
            (e.g. ``multipart/related; type=application/dicom; boundary=abc``).
        volume_base: Base volume path for saving individual DICOMs
            (e.g. ``/Volumes/catalog/schema/volume``).

    Returns:
        List of dicts with ``output_path``, ``file_size``, ``meta_json``,
        ``status``, ``error_message``.
    """
    import json as _json
    import os as _os
    import uuid as _uuid
    from io import BytesIO as _BytesIO

    results = []

    try:
        # ── Extract boundary from Content-Type ────────────────────────
        boundary = None
        for part in content_type.split(";"):
            part = part.strip()
            if part.lower().startswith("boundary="):
                boundary = part.split("=", 1)[1].strip().strip('"')
        if not boundary:
            return [{
                "output_path": "",
                "file_size": 0,
                "meta_json": None,
                "status": "FAILED",
                "error_message": "No boundary found in content_type",
            }]

        # ── Read the temp multipart bundle ────────────────────────────
        with open(volume_path, "rb") as f:
            body = f.read()

        # ── Parse multipart body ──────────────────────────────────────
        delimiter = f"--{boundary}".encode()
        segments = body.split(delimiter)

        stow_dir = f"{volume_base}/stow"
        _os.makedirs(stow_dir, exist_ok=True)

        for segment in segments:
            # Skip preamble / epilogue
            if not segment or segment.strip() in (b"", b"--", b"--\r\n"):
                continue

            if segment.startswith(b"\r\n"):
                segment = segment[2:]

            # Header / body separator
            sep = segment.find(b"\r\n\r\n")
            if sep == -1:
                continue

            body_data = segment[sep + 4:]
            if body_data.endswith(b"\r\n"):
                body_data = body_data[:-2]

            if not body_data:
                continue

            # ── Save individual DICOM file ────────────────────────────
            part_id = _uuid.uuid4().hex
            output_path = f"{stow_dir}/{part_id}.dcm"

            with open(output_path, "wb") as out:
                out.write(body_data)

            # ── Extract DICOM metadata (best-effort) ──────────────────
            meta_json = None
            try:
                from pydicom import dcmread
                from dbx.pixels.dicom.dicom_utils import extract_metadata

                ds = dcmread(_BytesIO(body_data), stop_before_pixels=True, force=True)
                meta = extract_metadata(ds, deep=False)
                meta["file_size"] = len(body_data)
                meta_json = _json.dumps(meta, allow_nan=False)
            except Exception:
                pass  # not a valid DICOM or can't parse — meta stays None

            results.append({
                "output_path": f"dbfs:{output_path}",
                "file_size": len(body_data),
                "meta_json": meta_json,
                "status": "SUCCESS",
                "error_message": None,
            })

    except Exception as e:
        results.append({
            "output_path": "",
            "file_size": 0,
            "meta_json": None,
            "status": "FAILED",
            "error_message": str(e) + "\n" + traceback.format_exc(),
        })

    return results
