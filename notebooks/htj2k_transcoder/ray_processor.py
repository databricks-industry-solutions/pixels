"""Phase 2: Ray GPU actor with prefetch I/O overlap.

Architecture (read-ahead eliminates GPU stalls):

    Main thread:  [wait read_0] [GPU_0] [write_0] [wait read_1] ...
    Prefetch:     [read_0]      [read_1]          [read_2]     ...
                                ^^^^^^^^           ^^^^^^^^
                         overlaps GPU_0+write_0  overlaps GPU_1+write_1

One actor per GPU. All bytes stay on the same node — no Arrow
serialization of pixel data, no cross-node object-store shipping.
``yield`` per-series flattens memory (no batch accumulation).
"""

import json
import os
import shutil

from datetime import datetime as dt

from .pipeline import (
    _ensure_nvimgcodec_tools,
    gpu_process_datasets,
    read_series_direct,
    save_and_upload_outputs,
)


def _register_modules_for_pickle_by_value():
    """Register htj2k_transcoder modules with cloudpickle so functions
    are serialized by value (embedded in the pickle) rather than by
    module reference. This is required because Ray / serverless_gpu
    workers don't have htj2k_transcoder installed.
    """
    import cloudpickle
    import htj2k_transcoder.pipeline as _pipeline_mod
    import htj2k_transcoder.ray_processor as _ray_mod

    cloudpickle.register_pickle_by_value(_pipeline_mod)
    cloudpickle.register_pickle_by_value(_ray_mod)


def _stage_nvimgcodec_tools(output_dir: str) -> str:
    """Stage nvimgcodec tools to a shared Volume path for Ray workers.

    Returns the tools_volume path.
    """
    import nvidia.nvimgcodec

    tools_volume = os.path.join(output_dir, "_nvimgcodec_tools")
    pkg_tools = os.path.join(os.path.dirname(nvidia.nvimgcodec.__file__), "tools")

    if os.path.isdir(pkg_tools):
        os.makedirs(tools_volume, exist_ok=True)
        shutil.copytree(pkg_tools, tools_volume, dirs_exist_ok=True)
        print(f"✓ Staged nvimgcodec tools to {tools_volume}")
    else:
        raise FileNotFoundError(f"Tools not found at {pkg_tools}")

    return tools_volume


def transcode_pending_series(
    spark,
    results_table: str,
    output_dir: str,
    transcode_cfg,
    merge_cfg,
    num_gpus: int = 8,
    batch_size: int = 16,
    actors_per_gpu: int = 4,
    num_cpus_per_actor: int = 3,
    io_pool_size: int = 64,
    gpu_type: str = "a10",
):
    """Run Phase 2: read pending rows, dispatch to Ray GPU actors, persist results.

    Args:
        spark: SparkSession
        results_table: fully-qualified Delta results table
        output_dir: Volume path for output DICOM files
        transcode_cfg: TranscodeConfig (or dict)
        merge_cfg: MergeConfig (or dict)
        num_gpus: number of GPUs to request
        batch_size: series per GPU actor __call__
        actors_per_gpu: fractional GPU actors per physical GPU
        num_cpus_per_actor: CPUs reserved per GPU actor
        io_pool_size: threads per actor for I/O
        gpu_type: GPU type for ray_launch
    """
    # Register modules so cloudpickle serializes functions by value
    # (Ray / serverless_gpu workers don't have htj2k_transcoder installed)
    _register_modules_for_pickle_by_value()

    # Serialize configs to dicts if needed
    _tc = transcode_cfg.to_dict() if hasattr(transcode_cfg, "to_dict") else dict(transcode_cfg)
    _mc = merge_cfg.to_dict() if hasattr(merge_cfg, "to_dict") else dict(merge_cfg)

    # Stage tools
    tools_volume = _stage_nvimgcodec_tools(output_dir)
    _tc["_tools_volume"] = tools_volume

    # Read pending rows
    pending_rows = (
        spark.table(results_table)
        .filter("status = 'pending'")
        .collect()
    )

    if not pending_rows:
        print("No pending series to process.")
        return

    groups = {}
    for row in pending_rows:
        key = (row.study_uid, row.series_uid)
        meta = json.loads(row.source_meta)
        files = json.loads(row.source_paths)
        files = [f[5:] if f.startswith("dbfs:") else f for f in files]
        groups[key] = {"files": files, "meta": meta}

    total_actors = num_gpus * actors_per_gpu
    _parquet_tmp = os.path.join(output_dir, "_results_parquet_tmp")
    shutil.rmtree(_parquet_tmp, ignore_errors=True)

    print(
        f"Pending: {len(groups)} series  |  GPUs: {num_gpus}  |  "
        f"batch={batch_size}  cpus/actor={num_cpus_per_actor}  pool={io_pool_size}"
    )

    # Capture all needed values for the closure
    _items = dict(groups)
    _out = output_dir
    _pool_size = io_pool_size

    # Set Ray env vars
    os.environ["RAY_TEMP_DIR"] = "/tmp/ray"
    #os.environ["RAY_DATA_VERBOSE_PROGRESS"] = "0"
    os.environ["RAY_DEDUP_LOGS"] = "1"
    os.environ["RAY_DEDUP_LOGS_AGG_WINDOW_S"] = "60"

    from serverless_gpu.ray import ray_launch

    @ray_launch(gpus=num_gpus, gpu_type=gpu_type, remote=True)
    def _run_phase2():
        import ray
        import json as _json
        import time as _time
        import socket as _socket
        import logging
        from concurrent.futures import ThreadPoolExecutor

        # Quiet Ray logging
        for _rlog in (
            "ray", "ray.data", "ray.tune", "ray.train", "ray.serve",
            "ray._private", "ray.air", "ray.data._internal", "ray.data.context",
        ):
            logging.getLogger(_rlog).setLevel(logging.WARNING)

        ctx = ray.data.DataContext.get_current()
        ctx.execution_options.verbose_progress = False

        # Build Ray Dataset with round-robin bin-packing
        items = []
        for (study_uid, series_uid), grp in _items.items():
            items.append({
                "study_uid": study_uid,
                "series_uid": series_uid,
                "file_paths_json": _json.dumps(grp["files"]),
                "num_files": len(grp["files"]),
            })

        items.sort(key=lambda x: x["num_files"], reverse=True)

        _NUM_BLOCKS = max(total_actors * 4, len(items))
        buckets = [[] for _ in range(_NUM_BLOCKS)]
        for i, item in enumerate(items):
            buckets[i % _NUM_BLOCKS].append(item)

        balanced = [item for bucket in buckets for item in bucket]

        ds = ray.data.from_items(balanced).repartition(_NUM_BLOCKS)
        print(
            f"✓ Ray dataset: {ds.count()} series in {_NUM_BLOCKS} blocks "
            f"(bin-packed, {total_actors} actors)"
        )

        # GPU Actor with prefetch I/O overlap
        class DicomSeriesProcessor:
            def __init__(self):
                self._host = _socket.gethostname()
                _ensure_nvimgcodec_tools(_tc["_tools_volume"])
                import pydicom  # noqa: warm up

                self._read_pool = ThreadPoolExecutor(max_workers=_pool_size)
                self._write_pool = ThreadPoolExecutor(max_workers=max(_pool_size // 4, 8))
                self._prefetch = ThreadPoolExecutor(max_workers=2)
                self._n = 0
                print(
                    f"✓ DicomSeriesProcessor on {self._host} "
                    f"(read={_pool_size}, write={max(_pool_size // 4, 8)})"
                )

            def _submit_read(self, batch, idx):
                fp = _json.loads(batch["file_paths_json"][idx])
                sid = str(batch["series_uid"][idx])
                return self._prefetch.submit(
                    read_series_direct, sid, fp, _pool_size, self._read_pool,
                )

            @staticmethod
            def _result(study, series, nfiles, status, detail, frames, orig, comp, etime, transcoded, path):
                return {
                    "study_uid": [study],
                    "series_uid": [series],
                    "status": [status],
                    "detail": [str(detail)],
                    "output_path": [str(path)],
                    "num_frames": [int(frames)],
                    "num_files": [int(nfiles)],
                    "original_size": [int(orig)],
                    "compressed_size": [int(comp)],
                    "encode_time": [float(etime)],
                    "transcoded": [bool(transcoded)],
                }

            def __call__(self, batch):
                n = len(batch["study_uid"])
                if n == 0:
                    return

                next_read = self._submit_read(batch, 0)

                for i in range(n):
                    t0 = _time.time()
                    study = str(batch["study_uid"][i])
                    series = str(batch["series_uid"][i])
                    fp = _json.loads(batch["file_paths_json"][i])
                    short = series[:40]

                    try:
                        # 1. Wait for current read (prefetched)
                        datasets, orig_sz = next_read.result()
                        t_read = _time.time() - t0

                        # 2. Immediately prefetch next series
                        if i + 1 < n:
                            next_read = self._submit_read(batch, i + 1)

                        if not datasets:
                            yield self._result(
                                study, series, len(fp), "error",
                                "No valid files after reading",
                                0, orig_sz, 0, _time.time() - t0, False, "",
                            )
                            continue

                        # 3. GPU compute (next read runs in background)
                        t_gpu = _time.time()
                        output_ds, mode, transcoded = gpu_process_datasets(datasets, _tc, _mc)
                        t_gpu = _time.time() - t_gpu

                        if mode == "skipped":
                            yield self._result(
                                study, series, len(fp), "skipped", mode,
                                0, orig_sz, 0, _time.time() - t0, False, "",
                            )
                            continue

                        # 4. Save + upload via write_pool
                        frames, comp_sz, out_path, local_dir = save_and_upload_outputs(
                            output_ds, series, study, _out, pool=self._write_pool,
                        )

                        if local_dir:
                            shutil.rmtree(local_dir, ignore_errors=True)

                        elapsed = _time.time() - t0
                        self._n += 1
                        if self._n % 25 == 0:
                            print(
                                f"  [{self._host}] {self._n} series | "
                                f"last: io={t_read:.1f} gpu={t_gpu:.1f} total={elapsed:.1f}s"
                            )

                        yield self._result(
                            study, series, len(fp), "success", mode,
                            frames, orig_sz, comp_sz, elapsed, transcoded, out_path,
                        )

                    except Exception as e:
                        import traceback
                        traceback.print_exc()
                        yield self._result(
                            study, series, len(fp), "error",
                            f"{type(e).__name__}: {str(e)[:500]}",
                            0, 0, 0, _time.time() - t0, False, "",
                        )

        # Run distributed processing
        t0 = _time.time()
        processed_ds = ds.map_batches(
            DicomSeriesProcessor,
            batch_size=batch_size,
            num_gpus=(1.0 / actors_per_gpu),
            num_cpus=num_cpus_per_actor,
            concurrency=total_actors,
        )

        processed_ds.write_parquet(_parquet_tmp)
        elapsed = _time.time() - t0
        print(f"\n✓ Ray Data complete in {elapsed:.0f}s")

    _run_phase2.distributed()

    # Load results and MERGE into Delta
    print(f"\nLoading results from {_parquet_tmp}...")
    results_df = spark.read.parquet(_parquet_tmp)
    total = results_df.count()
    ok = results_df.filter("status = 'success'").count()
    err = results_df.filter("status = 'error'").count()
    print(f"  Total: {total} | Success: {ok} | Error: {err}")

    # Dedup source rows
    results_df.createOrReplaceTempView("__ray_results_raw")
    spark.sql("""
        CREATE OR REPLACE TEMP VIEW __ray_results AS
        SELECT * FROM (
            SELECT *, ROW_NUMBER() OVER (
                PARTITION BY study_uid, series_uid
                ORDER BY
                    CASE status WHEN 'success' THEN 0 WHEN 'error' THEN 1 ELSE 2 END,
                    encode_time DESC
            ) AS _rn
            FROM __ray_results_raw
        ) WHERE _rn = 1
    """)

    _now = dt.now().isoformat()
    spark.sql(f"""
        MERGE INTO {results_table} AS t
        USING (
            SELECT
                study_uid, series_uid,
                CAST(output_path AS STRING) AS output_path,
                '{_now}' AS processed_at,
                status,
                CAST(detail AS STRING) AS detail,
                CAST(num_frames AS INT) AS num_frames,
                CAST(num_files AS INT) AS num_files,
                CAST(original_size AS BIGINT) AS original_size,
                CAST(compressed_size AS BIGINT) AS compressed_size,
                CAST(encode_time AS DOUBLE) AS encode_time,
                CAST(transcoded AS BOOLEAN) AS transcoded
            FROM __ray_results
        ) AS s
        ON t.study_uid = s.study_uid AND t.series_uid = s.series_uid
        WHEN MATCHED AND t.status = 'pending' THEN UPDATE SET
            t.output_path    = s.output_path,
            t.processed_at   = s.processed_at,
            t.status         = s.status,
            t.detail         = s.detail,
            t.num_frames     = s.num_frames,
            t.num_files      = s.num_files,
            t.original_size  = s.original_size,
            t.compressed_size = s.compressed_size,
            t.encode_time    = s.encode_time,
            t.transcoded     = s.transcoded
        WHEN NOT MATCHED THEN INSERT (
            study_uid, series_uid, output_path, processed_at,
            status, detail, num_frames, num_files,
            original_size, compressed_size, encode_time, transcoded,
            batch_id, source_paths, source_meta
        ) VALUES (
            s.study_uid, s.series_uid, s.output_path, s.processed_at,
            s.status, s.detail, s.num_frames, s.num_files,
            s.original_size, s.compressed_size, s.encode_time, s.transcoded,
            0, '', ''
        )
    """)

    print(f"✓ Phase 2 complete. Results merged into {results_table}.")

    try:
        shutil.rmtree(_parquet_tmp, ignore_errors=True)
    except Exception:
        pass
