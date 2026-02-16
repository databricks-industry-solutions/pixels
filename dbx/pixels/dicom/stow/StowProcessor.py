import traceback
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
            StructField("status", StringType(), False),
            StructField("error_message", StringType(), True),
        ]
    )
)


class StowProcessor:
    """
    Orchestrates STOW-RS file ingestion in two independent phases,
    each driven by its own CDF stream on ``stow_operations``.

    **Phase 1 — Split** (``split_bundles``):

    Reads pending uploads (CDF inserts, ``status='pending'``), applies
    ``stow_split_udf`` to split multipart bundles into individual DICOM
    files on Volumes, and MERGEs the status +
    ``output_paths`` back to ``stow_operations``.

    **Phase 2 — Extract Metadata** (``extract_metadata``):

    Reads completed entries (CDF ``update_postimage``,
    ``status='completed'``), explodes ``output_paths``, applies
    ``DicomMetaExtractor`` to extract DICOM metadata via ``pydicom``,
    and saves the results to the catalog table.

    Each phase is designed to run as a separate Databricks job task so
    the handler can return extracted file paths to the client as soon
    as Phase 1 finishes, while Phase 2 continues in the background.

    Example — two-task job::

        # Task 1 (stow_split notebook)
        processor = StowProcessor(spark=spark)
        processor.split_bundles(
            source_table='cat.schema.stow_operations',
            volume='cat.schema.pixels_volume',
            checkpoint_location='/Volumes/.../stow/_checkpoints/split',
        )

        # Task 2 (stow_meta_extract notebook, depends on Task 1)
        processor = StowProcessor(spark=spark)
        processor.extract_metadata(
            source_table='cat.schema.stow_operations',
            catalog_table='cat.schema.object_catalog',
            volume='cat.schema.pixels_volume',
            checkpoint_location='/Volumes/.../stow/_checkpoints/meta',
        )
    """

    def __init__(self, spark):
        """
        Args:
            spark: Active SparkSession.
        """
        if not spark:
            raise ValueError("Spark session is required for STOW processing")

        self.spark = spark
        self.logger = LoggerProvider("StowProcessor")
        self.logger.info("StowProcessor initialized")

    # -----------------------------------------------------------------
    # Phase 1 — Split multipart bundles
    # -----------------------------------------------------------------

    def split_bundles(
        self,
        source_table: str,
        volume: str,
        checkpoint_location: str,
        max_files_per_trigger: int = 200,
    ):
        """
        Phase 1: split multipart bundles into individual DICOMs.

        * Reads ``stow_operations`` CDF (new inserts, ``status='pending'``).
        * Applies ``stow_split_udf`` — splits on multipart boundary,
          saves each part as ``<volume>/stow/<uuid>.dcm``.
        * MERGEs ``status='completed'``, ``output_paths=[…]`` back.
        * Uses ``trigger(availableNow=True)`` — drains and stops.

        Args:
            source_table: ``catalog.schema.stow_operations``.
            volume: UC volume (``catalog.schema.volume_name``).
            checkpoint_location: Checkpoint path for this stream.
            max_files_per_trigger: Max files per micro-batch.
        """
        volume_base = f"/Volumes/{volume.replace('.', '/')}"

        self.logger.info(f"Phase 1 (split): reading from {source_table}")

        stream_df = (
            self.spark.readStream.format("delta")
            .option("readChangeFeed", "true")
            .option("skipChangeCommits", "true")
            .option("maxFilesPerTrigger", max_files_per_trigger)
            .table(source_table)
            .filter(fn.col("_change_type") == "insert")
            .filter(fn.col("status") == "pending")
            .withColumn("parts", stow_split_udf(
                fn.col("volume_path"),
                fn.col("content_type"),
                fn.lit(volume_base))
            )
        )

        query = (
            stream_df.writeStream
            .foreachBatch(_make_split_handler(source_table))
            .option("checkpointLocation", checkpoint_location)
            .trigger(availableNow=True)
            .start()
        )

        query.awaitTermination()
        self.logger.info("Phase 1 complete: bundles split")

    # -----------------------------------------------------------------
    # Phase 2 — Extract DICOM metadata
    # -----------------------------------------------------------------

    def extract_metadata(
        self,
        source_table: str,
        catalog_table: str,
        volume: str,
        checkpoint_location: str,
        max_files_per_trigger: int = 200,
    ):
        """
        Phase 2: extract DICOM metadata from individual files.

        * Reads ``stow_operations`` CDF with ``status='completed'``.
        * Handles **both** ingestion paths:

          - **Legacy Spark split** — rows arrive as ``update_postimage``
            (Phase 1 MERGEs ``status`` from ``'pending'`` to
            ``'completed'``).
          - **Streaming split** — rows arrive as ``insert`` with
            ``status='completed'`` already set (the handler splits
            in-process and inserts directly as completed).

        * Explodes ``output_paths``, applies ``DicomMetaExtractor``
          (``pydicom.dcmread``), saves to the catalog table.
        * Uses ``trigger(availableNow=True)`` — drains and stops.

        Args:
            source_table: ``catalog.schema.stow_operations``.
            catalog_table: ``catalog.schema.object_catalog``.
            volume: UC volume (``catalog.schema.volume_name``).
            checkpoint_location: Checkpoint path for this stream.
            max_files_per_trigger: Max files per micro-batch.
        """
        from dbx.pixels.dicom import DicomMetaExtractor

        catalog = Catalog(self.spark, table=catalog_table, volume=volume)
        catalog.catalog(path=catalog._volume_path, streaming=True, streamCheckpointBasePath=f"{catalog._volume_path}/_checkpoints/stow_extract-{catalog_table}/")
        
        extractor = DicomMetaExtractor(catalog, inputCol="local_path", deep=False)

        self.logger.info(f"Phase 2 (meta): reading from {source_table}")

        df = (
            self.spark.readStream.format("delta")
            .option("readChangeFeed", "true")
            .option("startingVersion", "0")
            .option("maxFilesPerTrigger", max_files_per_trigger)
            .table(source_table)
            .filter(fn.col("status") == "completed")
            .filter(
                (fn.col("_change_type") == "update_postimage")
                | (fn.col("_change_type") == "insert")
            )
            .filter(fn.col("output_paths").isNotNull())
            .filter(fn.size("output_paths") > 0)
            .select(fn.explode("output_paths").alias("path"))
            .withColumn("modificationTime", fn.current_timestamp())
            .withColumn("length", fn.lit(0).cast("bigint"))
            .withColumn("original_path", fn.col("path"))
        )

        # Add path-derived columns (local_path, extension, file_type, …)
        df = Catalog._with_path_meta(df)
        df = extractor.transform(df)

        # Extract file_size from meta VARIANT to set the length column
        df = df.withColumn(
            "length",
            fn.coalesce(
                fn.expr("meta:file_size::bigint"),
                fn.lit(0).cast("bigint"),
            ),
        ).select(
            "path", "modificationTime", "length", "original_path",
            "relative_path", "local_path", "extension", "file_type",
            "path_tags", "is_anon", "meta",
        )

        catalog.save(df, mode="append")
        self.logger.info("Phase 2 complete: metadata extracted and saved")


# ---------------------------------------------------------------------------
# Phase 1: foreachBatch — split bundles, save files, MERGE status + paths
# ---------------------------------------------------------------------------

def _make_split_handler(source_table: str):
    """
    Return a Spark-Connect-safe ``foreachBatch`` callback for Phase 1.

    Captures only plain strings — no SparkSession or Catalog.
    """

    def _process_split_batch(batch_df: DataFrame, batch_id: int) -> None:
        _logger = LoggerProvider("StowProcessor.Split")
        _logger.info(f"Batch {batch_id}: splitting STOW bundles")

        # Explode parts — one row per extracted file
        exploded_df = (
            batch_df
            .select("file_id", fn.explode("parts").alias("part"))
            .select(
                "file_id",
                fn.col("part.output_path").alias("output_path"),
                fn.col("part.file_size").alias("file_size"),
                fn.col("part.status").alias("part_status"),
                fn.col("part.error_message").alias("part_error"),
            )
        )

        # Aggregate per file_id: collect successful paths, determine status
        status_df = (
            exploded_df
            .groupBy("file_id")
            .agg(
                fn.collect_list(
                    fn.when(
                        fn.col("part_status") == "SUCCESS",
                        fn.col("output_path"),
                    )
                ).alias("output_paths"),
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
                fn.when(fn.col("fail_count") > 0, fn.col("first_error"))
                .otherwise(fn.lit(None).cast("string")),
            )
        )

        from delta.tables import DeltaTable

        delta_table = DeltaTable.forName(batch_df.sparkSession, source_table)

        (
            delta_table.alias("trg")
            .merge(status_df.alias("src"), "trg.file_id = src.file_id")
            .whenMatchedUpdate(
                set={
                    "status": fn.col("src.final_status"),
                    "processed_at": fn.current_timestamp(),
                    "output_paths": fn.col("src.output_paths"),
                    "error_message": fn.col("src.error_message"),
                }
            )
            .execute()
        )

        _logger.info(f"Batch {batch_id}: MERGE complete")

    return _process_split_batch

# ---------------------------------------------------------------------------
# UDF — split multipart bundle → individual DICOMs (no pydicom)
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
    It **only splits and saves** — no pydicom processing.  Metadata
    extraction happens in Phase 2 via ``DicomMetaExtractor``.

    1. Reads the temp bundle file from ``volume_path``.
    2. Extracts the ``boundary`` from ``content_type``.
    3. Splits the multipart body on the boundary.
    4. For each part, saves the raw bytes as
       ``<volume_base>/stow/<uuid>.dcm``.

    Args:
        volume_path: Path to the temp multipart file
            (``/Volumes/…/<id>.mpr``).
        content_type: Full Content-Type header value including the
            boundary (e.g.
            ``multipart/related; type=application/dicom; boundary=abc``).
        volume_base: Base volume path for saving individual DICOMs
            (e.g. ``/Volumes/catalog/schema/volume``).

    Returns:
        List of dicts with ``output_path``, ``file_size``,
        ``status``, ``error_message``.
    """
    import mmap as _mmap
    import os as _os
    import uuid as _uuid

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
                "status": "FAILED",
                "error_message": "No boundary found in content_type",
            }]

        # ── Parse multipart bundle using mmap (memory-efficient) ──────
        delimiter = f"--{boundary}".encode()
        delim_len = len(delimiter)

        stow_dir = f"{volume_base}/stow"
        _os.makedirs(stow_dir, exist_ok=True)

        _WRITE_CHUNK = 8 * 1024 * 1024  # 8 MB

        with open(volume_path, "rb") as f:
            with _mmap.mmap(f.fileno(), 0, access=_mmap.ACCESS_READ) as mm:
                file_size = mm.size()
                seg_start = mm.find(delimiter)

                while seg_start != -1:
                    content_start = seg_start + delim_len

                    # Closing delimiter "--boundary--" marks end of message
                    if (content_start + 2 <= file_size
                            and mm[content_start:content_start + 2] == b"--"):
                        break

                    next_delim = mm.find(delimiter, content_start)
                    seg_end = next_delim if next_delim != -1 else file_size

                    # Skip leading CRLF after delimiter line
                    if (content_start + 2 <= seg_end
                            and mm[content_start:content_start + 2] == b"\r\n"):
                        content_start += 2

                    # Header / body separator
                    hdr_end = mm.find(b"\r\n\r\n", content_start, seg_end)
                    if hdr_end == -1:
                        seg_start = next_delim
                        continue

                    body_start = hdr_end + 4
                    body_end = seg_end

                    # Trim trailing CRLF before next delimiter
                    if (body_end >= body_start + 2
                            and mm[body_end - 2:body_end] == b"\r\n"):
                        body_end -= 2

                    body_len = body_end - body_start
                    if body_len <= 0:
                        seg_start = next_delim
                        continue

                    # ── Save individual DICOM file (chunked write) ────
                    part_id = _uuid.uuid4().hex
                    output_path = f"{stow_dir}/{part_id}.dcm"

                    with open(output_path, "wb") as out:
                        offset = body_start
                        while offset < body_end:
                            end = min(offset + _WRITE_CHUNK, body_end)
                            out.write(mm[offset:end])
                            offset = end

                    results.append({
                        "output_path": f"dbfs:{output_path}",
                        "file_size": body_len,
                        "status": "SUCCESS",
                        "error_message": None,
                    })

                    seg_start = next_delim

    except Exception as e:
        results.append({
            "output_path": "",
            "file_size": 0,
            "status": "FAILED",
            "error_message": str(e) + "\n" + traceback.format_exc(),
        })

    return results
