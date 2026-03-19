"""HTJ2K DICOM Transcoder Library.

GPU-accelerated DICOM pipeline that:
1. Transcodes pixel data to HTJ2K via NVIDIA nvImageCodec
2. Converts legacy single-frame series to Enhanced Multi-Frame DICOM via highdicom
3. Distributes work across multiple GPUs with Ray actors
4. Tracks progress incrementally via Delta tables with streaming support

Usage from a Databricks notebook:

    from htj2k_transcoder import (
        TranscodeConfig, MergeConfig, InputConfig, StreamingConfig,
        create_results_table, process_batch_files, process_batch_delta,
        transcode_pending_series, discover_and_group, run_batch, print_summary,
    )
"""

from .config import TranscodeConfig, MergeConfig, InputConfig, StreamingConfig
from .pipeline import (
    process_series_on_gpu,
    stage_and_read_series,
    read_series_direct,
    gpu_process_datasets,
    save_and_upload_outputs,
)
from .streaming import (
    RESULTS_TABLE_SCHEMA_SQL,
    DICOM_TAGS,
    create_results_table,
    process_batch_files,
    process_batch_delta,
    start_autoloader_stream,
    start_delta_stream,
)
from .ray_processor import transcode_pending_series
from .batch import discover_and_group, run_batch
from .summary import print_summary

__all__ = [
    # config
    "TranscodeConfig", "MergeConfig", "InputConfig", "StreamingConfig",
    # pipeline
    "process_series_on_gpu", "stage_and_read_series", "read_series_direct",
    "gpu_process_datasets", "save_and_upload_outputs",
    # streaming
    "RESULTS_TABLE_SCHEMA_SQL", "DICOM_TAGS",
    "create_results_table", "process_batch_files", "process_batch_delta",
    "start_autoloader_stream", "start_delta_stream",
    # ray
    "transcode_pending_series",
    # batch
    "discover_and_group", "run_batch",
    # summary
    "print_summary",
]
