"""Core pipeline functions: I/O helpers, GPU processing, and series orchestration.

These functions run on Ray workers (GPU actors) or the driver. They handle:
- FUSE-safe file copy with retries
- Parallel stage-and-read / direct-read of DICOM series
- GPU transcode + multi-frame merge
- Parallel save + upload of output files
- Top-level per-series orchestrator (backward-compatible batch mode)
"""

import hashlib
import logging
import os
import shutil
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

logger = logging.getLogger("dicom_pipeline")
logger.setLevel(logging.INFO)


# ---------------------------------------------------------------------------
# FUSE-safe file helpers
# ---------------------------------------------------------------------------

def _copyfile_retry(src, dst, retries=3, backoff=2.0):
    for i in range(retries):
        try:
            shutil.copyfile(src, dst)
            return
        except PermissionError:
            if i == retries - 1:
                raise
            time.sleep(backoff * (2 ** i))


def _makedirs_retry(path, retries=3, backoff=2.0):
    for i in range(retries):
        try:
            os.makedirs(path, exist_ok=True)
            return
        except PermissionError:
            if i == retries - 1:
                raise
            time.sleep(backoff * (2 ** i))


# ---------------------------------------------------------------------------
# Default I/O parallelism (overridable via function args or shared pools)
# ---------------------------------------------------------------------------
DEFAULT_IO_READ_WORKERS = 256
DEFAULT_IO_WRITE_WORKERS = 64


def _stage_and_read_one(src, local_dir):
    """Copy one file Volumes -> NVMe, then pydicom.dcmread."""
    import pydicom
    dst = os.path.join(local_dir, os.path.basename(src))
    _copyfile_retry(src, dst)
    ds = pydicom.dcmread(dst)
    return dst, ds, os.path.getsize(dst)


def _read_one_direct(src):
    """Read file from Volumes directly into memory (no NVMe staging)."""
    import pydicom, io
    with open(src, 'rb') as f:
        data = f.read()
    ds = pydicom.dcmread(io.BytesIO(data))
    return ds, len(data)


def _save_and_copy_one(ds, local_dir, final_dir, filename):
    """Save to NVMe, then copy to Volumes."""
    local_path = os.path.join(local_dir, filename)
    ds.save_as(local_path, enforce_file_format=False)
    fsize = os.path.getsize(local_path)
    out_path = os.path.join(final_dir, filename)
    _copyfile_retry(local_path, out_path)
    return out_path, fsize, int(getattr(ds, "NumberOfFrames", 1))


# ---------------------------------------------------------------------------
# Composable sub-functions (used by pipelined actor and batch mode)
# ---------------------------------------------------------------------------

def stage_and_read_series(
    study_uid: str,
    series_uid: str,
    file_paths: list[str],
    staging_root: str = "/local_disk0/dicom_staging",
    io_workers: int = DEFAULT_IO_READ_WORKERS,
    pool: ThreadPoolExecutor = None,
):
    """Parallel stage + read all files for one series.

    Returns (datasets, original_size, local_dir).
    If ``pool`` is provided, uses it (io_workers ignored).
    Otherwise creates a new pool with ``io_workers`` threads.
    """
    local_dir = os.path.join(staging_root, "input", study_uid, series_uid)
    os.makedirs(local_dir, exist_ok=True)

    datasets, original_size, errors = [], 0, 0

    def _run(executor):
        nonlocal original_size, errors
        futs = {
            executor.submit(_stage_and_read_one, src, local_dir): src
            for src in file_paths if os.path.exists(src)
        }
        for fut in as_completed(futs):
            try:
                _, ds, fsize = fut.result()
                datasets.append(ds)
                original_size += fsize
            except Exception:
                errors += 1

    if pool is not None:
        _run(pool)
    else:
        with ThreadPoolExecutor(max_workers=io_workers) as p:
            _run(p)

    return datasets, original_size, local_dir


def read_series_direct(
    series_uid: str,
    file_paths: list[str],
    io_workers: int = DEFAULT_IO_READ_WORKERS,
    pool: ThreadPoolExecutor = None,
):
    """Read all files for one series directly into memory (no NVMe staging).

    Returns (datasets, original_size).
    Eliminates the copyfile Volumes->NVMe step.
    """
    datasets, original_size, errors = [], 0, 0

    def _run(executor):
        nonlocal original_size, errors
        futs = {
            executor.submit(_read_one_direct, src): src
            for src in file_paths if os.path.exists(src)
        }
        for fut in as_completed(futs):
            try:
                ds, fsize = fut.result()
                datasets.append(ds)
                original_size += fsize
            except Exception:
                errors += 1

    if pool is not None:
        _run(pool)
    else:
        with ThreadPoolExecutor(max_workers=io_workers) as p:
            _run(p)

    return datasets, original_size


def gpu_process_datasets(datasets, transcode_cfg, merge_cfg):
    """GPU processing: transcode / multiframe merge / both.

    Returns (output_datasets, mode_label, transcoded).
    Captures stderr from nvimgcodec C++ layer and attaches it to
    any exception so the real error (e.g. unsupported chroma, CUDA
    failures) is propagated instead of the generic ValueError.
    """
    import sys as _sys
    import tempfile as _tmpf

    do_transcode = transcode_cfg.get("enabled", True)
    do_merge = merge_cfg.get("enabled", True)
    htj2k_ts = "1.2.840.10008.1.2.4.202"

    if not do_transcode and not do_merge:
        return [], "skipped", False

    # Capture C-level stderr (fd 2) to surface nvimgcodec C++ errors
    stderr_fd = _sys.stderr.fileno()
    saved_fd = os.dup(stderr_fd)
    tmp = _tmpf.TemporaryFile(mode="w+b")
    os.dup2(tmp.fileno(), stderr_fd)

    try:
        if do_merge and do_transcode:
            from nvidia.nvimgcodec.tools.dicom.convert_multiframe import convert_to_enhanced_dicom
            out = convert_to_enhanced_dicom(
                series_datasets=[datasets],
                transfer_syntax_uid=htj2k_ts,
                num_resolutions=transcode_cfg.get("num_resolutions", 6),
                code_block_size=tuple(transcode_cfg.get("code_block_size", (64, 64))),
                progression_order=transcode_cfg.get("progression_order", "RPCL"),
            )
            return out, "multiframe+htj2k", True

        elif do_merge and not do_transcode:
            from nvidia.nvimgcodec.tools.dicom.convert_multiframe import convert_to_enhanced_dicom
            out = convert_to_enhanced_dicom(
                series_datasets=[datasets], transfer_syntax_uid=None,
            )
            return out, "multiframe", False

        else:  # do_transcode and not do_merge
            from nvidia.nvimgcodec.tools.dicom.convert_htj2k import transcode_datasets_to_htj2k
            out = transcode_datasets_to_htj2k(
                datasets=datasets,
                num_resolutions=transcode_cfg.get("num_resolutions", 6),
                code_block_size=tuple(transcode_cfg.get("code_block_size", (64, 64))),
                progression_order=transcode_cfg.get("progression_order", "RPCL"),
                max_batch_size=transcode_cfg.get("max_batch_size", 256),
            )
            return out, "htj2k", True

    except Exception as e:
        # Read captured C-level stderr
        os.dup2(saved_fd, stderr_fd)
        tmp.seek(0)
        captured = tmp.read().decode("utf-8", errors="replace").strip()
        tmp.close()
        os.close(saved_fd)
        if captured:
            err_lines = []
            for line in captured.splitlines():
                line = line.strip()
                if line and line not in err_lines:
                    err_lines.append(line)
            detail = "; ".join(err_lines[-5:])  # last 5 unique lines
            raise type(e)(f"{e} | nvimgcodec: {detail}") from e
        raise
    finally:
        # Restore stderr (no-op if already restored in except)
        try:
            os.dup2(saved_fd, stderr_fd)
        except OSError:
            pass
        try:
            tmp.close()
        except Exception:
            pass
        try:
            os.close(saved_fd)
        except OSError:
            pass


def save_and_upload_outputs(
    output_datasets,
    series_uid: str,
    study_uid: str,
    output_dir: str,
    staging_root: str = "/local_disk0/dicom_staging",
    io_workers: int = DEFAULT_IO_WRITE_WORKERS,
    pool: ThreadPoolExecutor = None,
):
    """Parallel save to NVMe + copy to Volumes.

    Returns (total_frames, total_size, output_path, local_dir).
    If ``pool`` is provided, uses it (io_workers ignored).
    """
    local_dir = os.path.join(staging_root, "output", study_uid, series_uid)
    os.makedirs(local_dir, exist_ok=True)
    final_dir = os.path.join(output_dir, study_uid)
    _makedirs_retry(final_dir)

    items = []
    for ds in output_datasets:
        sop = str(getattr(ds, "SOPInstanceUID", ""))
        sn = str(getattr(ds, "SeriesNumber", 1))
        inst = str(getattr(ds, "InstanceNumber", 1))
        h = hashlib.sha256(
            (str(getattr(ds, "SOPClassUID", "")) + sop).encode()
        ).hexdigest()[:8]
        items.append((ds, f"{sn}-{inst}-{h}.dcm"))

    total_frames, total_size, out_path = 0, 0, ""

    def _run(executor):
        nonlocal total_frames, total_size, out_path
        futs = {
            executor.submit(_save_and_copy_one, ds, local_dir, final_dir, fn): fn
            for ds, fn in items
        }
        for fut in as_completed(futs):
            p, sz, nf = fut.result()
            total_size += sz
            total_frames += nf
            out_path = p

    if pool is not None:
        _run(pool)
    else:
        with ThreadPoolExecutor(max_workers=min(io_workers, max(len(items), 1))) as p:
            _run(p)

    return total_frames, total_size, out_path, local_dir


# ---------------------------------------------------------------------------
# Top-level orchestrator (backward-compatible, used by batch mode)
# ---------------------------------------------------------------------------

def process_series_on_gpu(
    study_uid: str,
    series_uid: str,
    file_paths: list[str],
    output_dir: str,
    transcode_cfg: dict,
    merge_cfg: dict,
) -> dict:
    """Process a single DICOM series end-to-end on a GPU worker."""
    t0 = time.time()
    hostname = socket.gethostname()
    short = series_uid
    result = {
        "study_uid": study_uid, "series_uid": series_uid,
        "status": "error", "detail": "", "output_path": "",
        "num_frames": 0, "num_files": len(file_paths),
        "original_size": 0, "compressed_size": 0,
        "encode_time": 0.0, "transcoded": False,
    }
    local_input = local_output = None
    try:
        print(f"[{hostname}] Processing {short}... ({len(file_paths)} files)")

        datasets, orig_sz, local_input = stage_and_read_series(study_uid, series_uid, file_paths)
        t_io = time.time() - t0
        result["original_size"] = orig_sz
        print(f"  Staged+read {len(datasets)}/{len(file_paths)} in {t_io:.1f}s")
        if not datasets:
            result["detail"] = "No valid files after staging"
            return result

        t_gpu = time.time()
        output_ds, mode, transcoded = gpu_process_datasets(datasets, transcode_cfg, merge_cfg)
        t_gpu = time.time() - t_gpu
        if mode == "skipped":
            result["status"] = "skipped"
            result["detail"] = "Both transcode and merge disabled"
            return result

        t_save = time.time()
        frames, comp_sz, out_path, local_output = save_and_upload_outputs(
            output_ds, series_uid, study_uid, output_dir,
        )
        t_save = time.time() - t_save

        result.update({
            "num_frames": frames, "compressed_size": comp_sz,
            "output_path": out_path, "transcoded": transcoded,
            "encode_time": time.time() - t0,
            "status": "success", "detail": mode,
        })
        print(f"  [{hostname}] OK {short}: {mode}, {frames} frames | "
              f"io={t_io:.1f}s  gpu={t_gpu:.1f}s  save={t_save:.1f}s")

    except Exception as e:
        import traceback
        result["status"] = "error"
        result["detail"] = f"{type(e).__name__}: {str(e)[:500]}"
        print(f"  [{hostname}] ERROR {short}: {e}")
        traceback.print_exc()
    finally:
        for d in (local_input, local_output):
            if d:
                shutil.rmtree(d, ignore_errors=True)

    return result
