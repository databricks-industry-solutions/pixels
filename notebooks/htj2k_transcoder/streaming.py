"""Phase 1: Structured Streaming helpers for Auto Loader and Delta sources.

Provides:
- ``create_results_table(spark, table_name)`` — idempotent table creation
- ``process_batch_files(batch_df, batch_id)`` — foreachBatch for Auto Loader
- ``process_batch_delta(batch_df, batch_id)`` — foreachBatch for Delta streaming
- ``start_autoloader_stream(spark, ...)`` — start Auto Loader stream
- ``start_delta_stream(spark, ...)`` — start Delta stream

All functions run inside Spark Connect workers (no Ray / GPU imports).
"""

from datetime import datetime as dt

# ---------------------------------------------------------------------------
# Results table schema
# ---------------------------------------------------------------------------

RESULTS_TABLE_SCHEMA_SQL = """
    study_uid STRING, series_uid STRING, output_path STRING,
    processed_at STRING, status STRING, detail STRING,
    num_frames INT, num_files INT, original_size BIGINT,
    compressed_size BIGINT, encode_time DOUBLE, transcoded BOOLEAN,
    batch_id INT, source_paths STRING, source_meta STRING
"""

# ---------------------------------------------------------------------------
# DICOM tag hex codes for VARIANT extraction (Delta source)
# ---------------------------------------------------------------------------

DICOM_TAGS = {
    "StudyInstanceUID":  "0020000D",
    "SeriesInstanceUID": "0020000E",
    "StudyDescription":  "00081030",
    "SeriesDescription": "0008103E",
    "Modality":          "00080060",
    "PatientID":         "00100020",
    "TransferSyntaxUID": "00020010",
    "NumberOfFrames":    "00280008",
    "Rows":              "00280010",
    "Columns":           "00280011",
}

HTJ2K_UID = "1.2.840.10008.1.2.4.201"


def create_results_table(spark, table_name: str):
    """Create the results table if it doesn't exist."""
    spark.sql(f"CREATE TABLE IF NOT EXISTS {table_name} ({RESULTS_TABLE_SCHEMA_SQL})")


# ---------------------------------------------------------------------------
# Auto Loader foreachBatch
# ---------------------------------------------------------------------------

def process_batch_files(batch_df, batch_id, results_table: str = None):
    """foreachBatch callback for Auto Loader: scan headers, group by series, MERGE pending.

    Args:
        batch_df: Spark DataFrame from Auto Loader
        batch_id: micro-batch ID
        results_table: fully-qualified results table name.
            If None, looks for ``_results_table`` in the calling frame (notebook compat).
    """
    import json as _json
    if batch_df.isEmpty():
        return

    t0 = __import__("time").time()

    # Resolve results table name
    if results_table is None:
        import inspect
        frame = inspect.currentframe().f_back
        results_table = frame.f_globals.get("_results_table", frame.f_locals.get("_results_table"))

    file_paths = [row.path for row in batch_df.select("path").collect()]
    file_paths = [p[5:] if p.startswith("dbfs:") else p for p in file_paths]
    if not file_paths:
        return

    import pydicom
    from concurrent.futures import ThreadPoolExecutor, as_completed
    from collections import defaultdict
    from pyspark.sql import types as T

    groups = defaultdict(lambda: {
        "files": [], "study_description": "N/A",
        "series_description": "N/A", "modality": "N/A",
        "patient_id": "N/A", "transfer_syntaxes": set(),
        "has_multiframe": False, "dimensions": set(),
    })

    def _scan_header(fp):
        try:
            ds = pydicom.dcmread(fp, stop_before_pixels=True)
            study = str(getattr(ds, "StudyInstanceUID", ""))
            series = str(getattr(ds, "SeriesInstanceUID", ""))
            rows = getattr(ds, "Rows", None)
            cols = getattr(ds, "Columns", None)
            if not study or not series or rows is None or cols is None:
                return None
            ts = str(getattr(ds.file_meta, "TransferSyntaxUID", ""))
            nf = int(getattr(ds, "NumberOfFrames", 1))
            return {
                "file": fp, "study": study, "series": series,
                "study_desc": str(getattr(ds, "StudyDescription", "N/A")),
                "series_desc": str(getattr(ds, "SeriesDescription", "N/A")),
                "modality": str(getattr(ds, "Modality", "N/A")),
                "patient_id": str(getattr(ds, "PatientID", "N/A")),
                "ts": ts, "nf": nf, "rows": rows, "cols": cols,
            }
        except Exception:
            return None

    with ThreadPoolExecutor(max_workers=64) as pool:
        futs = {pool.submit(_scan_header, fp): fp for fp in file_paths}
        for fut in as_completed(futs):
            info = fut.result()
            if info is None:
                continue
            key = (info["study"], info["series"])
            g = groups[key]
            g["files"].append(info["file"])
            g["study_description"] = info["study_desc"]
            g["series_description"] = info["series_desc"]
            g["modality"] = info["modality"]
            g["patient_id"] = info["patient_id"]
            g["transfer_syntaxes"].add(info["ts"])
            if info["nf"] > 1:
                g["has_multiframe"] = True
            g["dimensions"].add((info["rows"], info["cols"]))

    if not groups:
        return

    now_str = dt.now().isoformat()
    rows = []
    for (study_uid, series_uid), g in groups.items():
        meta = {
            "study_description": g["study_description"],
            "series_description": g["series_description"],
            "modality": g["modality"],
            "patient_id": g["patient_id"],
            "transfer_syntaxes": sorted(g["transfer_syntaxes"]),
            "has_multiframe": g["has_multiframe"],
            "dimensions": [{"Rows": r, "Columns": c} for r, c in g["dimensions"]],
        }
        rows.append((
            study_uid, series_uid, "", now_str, "pending", "",
            0, len(g["files"]), 0, 0, 0.0, False,
            batch_id, _json.dumps(g["files"]), _json.dumps(meta),
        ))

    schema = T.StructType([
        T.StructField("study_uid", T.StringType()),
        T.StructField("series_uid", T.StringType()),
        T.StructField("output_path", T.StringType()),
        T.StructField("processed_at", T.StringType()),
        T.StructField("status", T.StringType()),
        T.StructField("detail", T.StringType()),
        T.StructField("num_frames", T.IntegerType()),
        T.StructField("num_files", T.IntegerType()),
        T.StructField("original_size", T.LongType()),
        T.StructField("compressed_size", T.LongType()),
        T.StructField("encode_time", T.DoubleType()),
        T.StructField("transcoded", T.BooleanType()),
        T.StructField("batch_id", T.IntegerType()),
        T.StructField("source_paths", T.StringType()),
        T.StructField("source_meta", T.StringType()),
    ])

    spark = batch_df.sparkSession
    batch_sdf = spark.createDataFrame(rows, schema)
    batch_sdf.createOrReplaceTempView("__pending_batch")

    spark.sql(f"""
        MERGE INTO {results_table} t
        USING __pending_batch s
        ON t.study_uid = s.study_uid AND t.series_uid = s.series_uid
        WHEN NOT MATCHED THEN INSERT *
    """)

    elapsed = __import__("time").time() - t0
    print(f"  Phase 1 batch {batch_id}: {len(rows)} series staged as pending ({elapsed:.1f}s)")


# ---------------------------------------------------------------------------
# Delta foreachBatch
# ---------------------------------------------------------------------------

def process_batch_delta(
    batch_df,
    batch_id,
    results_table: str = None,
    input_cfg=None,
):
    """foreachBatch callback for Delta streaming: extract DICOM tags, filter, MERGE pending.

    Args:
        batch_df: Spark DataFrame from Delta readStream
        batch_id: micro-batch ID
        results_table: fully-qualified results table name
        input_cfg: InputConfig instance (for filter_encoded / extra_filter)
    """
    from pyspark.sql import functions as _F

    if batch_df.isEmpty():
        return

    # Resolve results table name
    if results_table is None:
        import inspect
        frame = inspect.currentframe().f_back
        results_table = frame.f_globals.get("_results_table", frame.f_locals.get("_results_table"))

    # Build tag extraction expressions
    tag_exprs = {
        name: f"meta:['{code}'].Value[0]::String"
        for name, code in DICOM_TAGS.items()
    }

    # Extract DICOM tags from meta VARIANT column
    for name, expr in tag_exprs.items():
        batch_df = batch_df.withColumn(name, _F.expr(expr))

    # Filter: valid image DICOM files only
    batch_df = batch_df.filter(
        _F.col("StudyInstanceUID").isNotNull()
        & (_F.col("StudyInstanceUID") != "")
        & _F.col("SeriesInstanceUID").isNotNull()
        & (_F.col("SeriesInstanceUID") != "")
        & _F.col("Rows").isNotNull()
        & _F.col("Columns").isNotNull()
    )

    # Optionally filter out already-encoded HTJ2K files
    filter_encoded = True
    extra_filter = ""
    if input_cfg is not None:
        filter_encoded = input_cfg.filter_encoded
        extra_filter = input_cfg.extra_filter

    if filter_encoded:
        batch_df = batch_df.filter(
            (_F.col("TransferSyntaxUID") != HTJ2K_UID)
            | _F.col("TransferSyntaxUID").isNull()
        )

    if extra_filter:
        batch_df = batch_df.filter(_F.expr(extra_filter))

    # Group by series
    grouped = (
        batch_df
        .groupBy("StudyInstanceUID", "SeriesInstanceUID")
        .agg(
            _F.to_json(_F.collect_list("path")).alias("source_paths"),
            _F.first("StudyDescription").alias("_sd"),
            _F.first("SeriesDescription").alias("_srd"),
            _F.first("Modality").alias("_mod"),
            _F.first("PatientID").alias("_pid"),
            _F.collect_set("TransferSyntaxUID").alias("_tss"),
            _F.max(
                _F.when(_F.col("NumberOfFrames").cast("int") > 1, _F.lit(True))
                .otherwise(_F.lit(False))
            ).alias("_hmf"),
            _F.collect_set(_F.struct("Rows", "Columns")).alias("_dims"),
            _F.count("*").alias("num_files"),
        )
        .withColumn("source_meta", _F.to_json(_F.struct(
            _F.col("_sd").alias("study_description"),
            _F.col("_srd").alias("series_description"),
            _F.col("_mod").alias("modality"),
            _F.col("_pid").alias("patient_id"),
            _F.col("_tss").alias("transfer_syntaxes"),
            _F.col("_hmf").alias("has_multiframe"),
            _F.col("_dims").alias("dimensions"),
        )))
        .drop("_sd", "_srd", "_mod", "_pid", "_tss", "_hmf", "_dims")
    )

    # MERGE: insert only new series
    _view = f"_pending_{batch_id}"
    grouped.createOrReplaceTempView(_view)
    batch_df.sparkSession.sql(f"""
        MERGE INTO {results_table} AS t
        USING {_view} AS s
        ON t.study_uid = s.StudyInstanceUID
           AND t.series_uid = s.SeriesInstanceUID
        WHEN NOT MATCHED THEN INSERT (
            study_uid, series_uid, status, num_files,
            source_paths, source_meta, batch_id,
            output_path, processed_at, detail,
            num_frames, original_size, compressed_size,
            encode_time, transcoded
        ) VALUES (
            s.StudyInstanceUID, s.SeriesInstanceUID, 'pending',
            s.num_files, s.source_paths, s.source_meta, {batch_id},
            '', '', '', 0, 0, 0, 0.0, false
        )
    """)

    print(f"  Phase 1 batch {batch_id}: MERGE complete")


# ---------------------------------------------------------------------------
# Stream launchers
# ---------------------------------------------------------------------------

def start_autoloader_stream(spark, dicom_root_dir, streaming_cfg, timeout=None):
    """Start Auto Loader stream, wait for completion, and return the query.

    Args:
        spark: SparkSession
        dicom_root_dir: root directory with DICOM files
        streaming_cfg: StreamingConfig instance
        timeout: max seconds to wait (default: None = wait until done).
            With ``availableNow`` trigger, the stream processes all available
            data then stops; timeout is a safety net for unexpected hangs.

    Returns:
        StreamingQuery object
    """
    results_table = streaming_cfg.results_table
    create_results_table(spark, results_table)

    print(f"Starting Auto Loader stream from {dicom_root_dir}...")

    stream_reader = (
        spark.readStream
        .format("cloudFiles")
        .option("cloudFiles.format", "binaryFile")
        .option("pathGlobFilter", "*.dcm")
        .option("cloudFiles.maxFilesPerTrigger", streaming_cfg.max_files_per_trigger)
        .option("recursiveFileLookup", "true")
    )
    if streaming_cfg.use_managed_file_events:
        stream_reader = stream_reader.option("cloudFiles.useManagedFileEvents", "true")

    stream_df = stream_reader.load(dicom_root_dir).drop("content")

    def _batch_fn(batch_df, batch_id):
        process_batch_files(batch_df, batch_id, results_table=results_table)

    query = (
        stream_df
        .writeStream
        .foreachBatch(_batch_fn)
        .option("checkpointLocation", streaming_cfg.checkpoint_path)
        .trigger(availableNow=True)
        .start()
    )

    _await_stream(query, results_table, "Phase 1", timeout)
    return query


def start_delta_stream(spark, input_cfg, streaming_cfg, timeout=None):
    """Start Delta streaming, wait for completion, and return the query.

    Args:
        spark: SparkSession
        input_cfg: InputConfig instance
        streaming_cfg: StreamingConfig instance
        timeout: max seconds to wait (default: None = wait until done).
            With ``availableNow`` trigger, the stream processes all available
            data then stops; timeout is a safety net for unexpected hangs.

    Returns:
        StreamingQuery object
    """
    results_table = streaming_cfg.results_table
    create_results_table(spark, results_table)

    print(f"Starting Delta streaming on {input_cfg.delta_table}...")
    print(f"  Checkpoint: {streaming_cfg.checkpoint_path}")
    print(f"  Results:    {results_table}")

    stream_df = spark.readStream.table(input_cfg.delta_table)

    def _batch_fn(batch_df, batch_id):
        process_batch_delta(
            batch_df, batch_id,
            results_table=results_table,
            input_cfg=input_cfg,
        )

    query = (
        stream_df
        .writeStream
        .foreachBatch(_batch_fn)
        .option("checkpointLocation", streaming_cfg.checkpoint_path)
        .trigger(availableNow=True)
        .start()
    )

    _await_stream(query, results_table, "Phase 1 (Delta)", timeout)
    return query


def _await_stream(query, results_table, label, timeout=None):
    """Wait for a streaming query with progress reporting.

    Polls every 30s so the notebook cell shows activity instead
    of appearing stuck. Stops as soon as the query terminates
    or the timeout is reached.
    """
    import time

    poll_interval = 30  # seconds between progress prints
    elapsed = 0.0
    t0 = time.time()

    while True:
        # awaitTermination with a short timeout returns True if the
        # query has terminated, False if the timeout expired
        terminated = query.awaitTermination(timeout=poll_interval)
        elapsed = time.time() - t0

        if terminated:
            break

        # Print progress so the notebook doesn't look stuck
        status = query.status
        msg = status.get("message", "") if isinstance(status, dict) else str(status)
        print(f"  [{elapsed:.0f}s] Stream still running... {msg}")

        if timeout is not None and elapsed >= timeout:
            print(f"  Timeout ({timeout}s) reached — stopping stream.")
            query.stop()
            break

    print(f"\n✓ {label} complete ({elapsed:.0f}s). Pending series staged in {results_table}.")
