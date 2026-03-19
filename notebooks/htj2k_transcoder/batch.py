"""Batch mode: one-shot processing without Structured Streaming.

Uses DicomSeriesScanner from nvImageCodec to walk the directory and group
by series, then dispatches to Ray GPU workers.
"""

import time

from .pipeline import process_series_on_gpu


def discover_and_group(root_dir: str) -> dict:
    """Use nvImageCodec's DicomSeriesScanner to walk and group by series.

    Returns dict mapping (study_uid, series_uid) -> list of file paths.
    """
    from nvidia.nvimgcodec.tools.dicom.dicom_utils import DicomSeriesScanner

    t0 = time.time()
    scanner = DicomSeriesScanner(root_dir)
    scanner.scan()

    groups = {}
    for series in scanner.iter_series():
        key = (series.study_instance_uid, series.series_uid)
        groups[key] = [str(f) for f in series.files]

    print(
        f"Found {scanner.get_series_count()} series, "
        f"{scanner.get_total_files()} files ({time.time() - t0:.1f}s)"
    )
    return groups


def run_batch(
    root_dir: str,
    output_dir: str,
    transcode_cfg,
    merge_cfg,
    num_gpus: int = 8,
):
    """Full batch: discover -> group -> Ray dispatch.

    Args:
        root_dir: directory containing DICOM files
        output_dir: output directory for transcoded files
        transcode_cfg: TranscodeConfig (or dict with to_dict())
        merge_cfg: MergeConfig (or dict with to_dict())
        num_gpus: number of GPUs to use

    Returns:
        list of result dicts (one per series)
    """
    from serverless_gpu.ray import ray_launch

    groups = discover_and_group(root_dir)
    if not groups:
        print("No series found.")
        return []

    _tc = transcode_cfg.to_dict() if hasattr(transcode_cfg, "to_dict") else dict(transcode_cfg)
    _mc = merge_cfg.to_dict() if hasattr(merge_cfg, "to_dict") else dict(merge_cfg)
    _items = groups
    _ngpus = num_gpus

    @ray_launch(
        num_gpus_per_worker=1, num_cpus_per_worker=4,
        min_workers=_ngpus, max_workers=_ngpus,
    )
    def _run():
        import ray
        import time as _time

        remote_fn = ray.remote(num_gpus=1)(process_series_on_gpu)
        futures = {}
        for (study_uid, series_uid), files in _items.items():
            fut = remote_fn.remote(
                study_uid=study_uid, series_uid=series_uid,
                file_paths=files, output_dir=output_dir,
                transcode_cfg=_tc, merge_cfg=_mc,
            )
            futures[fut] = (study_uid, series_uid)

        print(f"Submitted {len(futures)} tasks to {_ngpus} GPUs")

        all_results = []
        remaining = list(futures.keys())
        t_start = _time.time()

        while remaining:
            done, remaining = ray.wait(
                remaining, num_returns=min(50, len(remaining)), timeout=600
            )
            for fut in done:
                try:
                    all_results.append(ray.get(fut))
                except Exception as e:
                    s, sr = futures[fut]
                    all_results.append({
                        "study_uid": s, "series_uid": sr,
                        "status": "error",
                        "detail": f"{type(e).__name__}: {str(e)[:500]}",
                        "num_frames": 0, "num_files": 0,
                        "original_size": 0, "compressed_size": 0,
                        "encode_time": 0.0, "transcoded": False,
                        "output_path": "",
                    })
            elapsed = _time.time() - t_start
            print(
                f"  Progress: {len(all_results)}/{len(futures)} "
                f"({elapsed:.0f}s elapsed)"
            )

        return all_results

    return _run()
