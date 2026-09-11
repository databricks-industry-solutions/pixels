"""Summary reporting for the HTJ2K transcoding pipeline."""


def print_summary(spark, results_table: str, transcode_cfg=None, merge_cfg=None, num_gpus: int = None):
    """Print a summary of processing results from the results table.

    Args:
        spark: SparkSession
        results_table: fully-qualified Delta results table
        transcode_cfg: TranscodeConfig (optional, for display)
        merge_cfg: MergeConfig (optional, for display)
        num_gpus: number of GPUs used (optional, for display)

    Returns:
        DataFrame with status aggregation (for display() in notebooks)
    """
    from pyspark.sql import functions as F

    res_df = spark.table(results_table)
    _total   = res_df.count()
    _pending = res_df.filter("status = 'pending'").count()
    _success = res_df.filter("status = 'success'").count()
    _skipped = res_df.filter("status = 'skipped'").count()
    _errors  = res_df.filter("status = 'error'").count()
    _transcoded = res_df.filter("status = 'success' AND transcoded = true").count()

    _agg = res_df.filter("status = 'success'").selectExpr(
        "SUM(num_frames) as total_frames",
        "SUM(original_size) as total_original",
        "SUM(compressed_size) as total_compressed",
        "SUM(encode_time) as total_encode",
    ).first()
    total_frames     = int(_agg.total_frames or 0)
    total_original   = int(_agg.total_original or 0)
    total_compressed = int(_agg.total_compressed or 0)
    total_encode     = float(_agg.total_encode or 0)

    ratio = total_original / total_compressed if total_compressed > 0 else 0
    fps   = total_frames / total_encode if total_encode > 0 else 0

    print("=" * 72)
    print("PROCESSING SUMMARY")
    print(f"  (from {results_table})")
    print("=" * 72)

    if transcode_cfg is not None or num_gpus is not None:
        tc_enabled = getattr(transcode_cfg, "enabled", "N/A") if transcode_cfg else "N/A"
        mc_enabled = getattr(merge_cfg, "enabled", "N/A") if merge_cfg else "N/A"
        gpus = num_gpus or "N/A"
        print(f"  Config: transcode={tc_enabled}, merge={mc_enabled}, GPUs={gpus}")
        print()

    print(f"  Total:        {_total}")
    print(f"  Pending:      {_pending}")
    print(f"  Success:      {_success}  (transcoded: {_transcoded})")
    print(f"  Skipped:      {_skipped}")
    print(f"  Errors:       {_errors}")
    print()
    print(f"  Frames:       {total_frames:,}")
    print(f"  Original:     {total_original / 1e9:.2f} GB")
    print(f"  Compressed:   {total_compressed / 1e9:.2f} GB")
    print(f"  Ratio:        {ratio:.2f}x")
    print(f"  Encode time:  {total_encode:.1f}s ({fps:.0f} frames/s)")
    print("=" * 72)

    if _errors > 0:
        print(f"\nErrors ({_errors}):")
        for row in res_df.filter("status = 'error'").select("series_uid", "detail").limit(10).collect():
            print(f"  {row.series_uid[:40]}...  {row.detail[:80]}")

    summary_df = (
        res_df.groupBy("status").agg(
            F.count("*").alias("count"),
            F.sum("num_frames").alias("total_frames"),
            F.sum("original_size").alias("original_bytes"),
            F.sum("compressed_size").alias("compressed_bytes"),
        ).orderBy("status")
    )

    return summary_df
