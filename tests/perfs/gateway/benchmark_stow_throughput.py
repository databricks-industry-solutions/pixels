#!/usr/bin/env python3
"""
STOW-RS Throughput Benchmark
=============================
Measures upload throughput of the DICOMweb STOW-RS endpoint using
synthetic DICOM payloads at configurable sizes.

For each payload size two phases are executed:

  1. **Sequential** — uploads N times in a loop to establish a baseline.
  2. **Concurrent** — uploads N times across C parallel workers to
     measure aggregate throughput under load.

Authentication uses the same OAuth2 client credentials grant as the
WADO concurrency benchmark.  Set env vars or CLI flags:

  DATABRICKS_SP_CLIENT_ID      service principal client ID
  DATABRICKS_SP_CLIENT_SECRET  service principal client secret
  DATABRICKS_HOST              workspace URL (for the token endpoint)

Usage::

    python tests/dbx/benchmark_stow_throughput.py \\
        --app-host https://your-app.databricksapps.com \\
        --databricks-host https://your-workspace.cloud.databricks.com \\
        --sizes 1,10,50,100 \\
        --repeats 5 \\
        --concurrency 4 \\
        --output results.json

Requirements:
    pip install requests pydicom
"""

import argparse
import concurrent.futures
import json
import logging
import os
import statistics
import sys
import time
import uuid
from io import BytesIO

import requests
import urllib3
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)-8s %(message)s",
)
logger = logging.getLogger(__name__)

STREAM_CHUNK_SIZE = 64 * 1024


# ---------------------------------------------------------------------------
# Auth (mirrors benchmark_wado_concurrency.py)
# ---------------------------------------------------------------------------

def _fetch_sp_token(databricks_host: str, client_id: str, client_secret: str) -> str:
    """Obtain a bearer token via the OAuth2 client credentials grant."""
    host = databricks_host.rstrip("/")
    if not host.startswith("http"):
        host = f"https://{host}"
    token_url = f"{host}/oidc/v1/token"

    logger.info("Fetching SP token from %s ...", token_url)
    resp = requests.post(
        token_url,
        auth=(client_id, client_secret),
        data={"grant_type": "client_credentials", "scope": "all-apis"},
        timeout=15,
    )
    if resp.status_code != 200:
        raise RuntimeError(
            f"Token request failed (HTTP {resp.status_code}): {resp.text[:300]}"
        )
    access_token = resp.json().get("access_token")
    if not access_token:
        raise RuntimeError(f"No access_token in response: {resp.text[:300]}")
    return access_token


def resolve_token(args: argparse.Namespace) -> str:
    """Return a token from --token, env var, or OAuth2 client credentials."""
    token = args.token or os.environ.get("DATABRICKS_TOKEN", "")
    if token:
        return token

    db_host = args.databricks_host or os.environ.get("DATABRICKS_HOST", "")
    client_id = args.client_id or os.environ.get("DATABRICKS_SP_CLIENT_ID", "")
    client_secret = args.client_secret or os.environ.get("DATABRICKS_SP_CLIENT_SECRET", "")

    if db_host and client_id and client_secret:
        return _fetch_sp_token(db_host, client_id, client_secret)

    if db_host and (not client_id or not client_secret):
        raise RuntimeError(
            "--databricks-host requires both --client-id / DATABRICKS_SP_CLIENT_ID "
            "and --client-secret / DATABRICKS_SP_CLIENT_SECRET"
        )
    return ""


# ---------------------------------------------------------------------------
# Payload generation
# ---------------------------------------------------------------------------

def _build_dicom_bytes(target_mb: float) -> bytes:
    """Return a valid DICOM Part-10 byte string of approximately *target_mb* MB.

    Starts from pydicom's example CT dataset, replaces PixelData with
    random bytes, and assigns a fresh SOP Instance UID.
    """
    import pydicom
    from pydicom.uid import generate_uid

    ds = pydicom.examples.ct
    ds = ds.copy()
    ds.SOPInstanceUID = generate_uid()

    target_bytes = int(target_mb * 1024 * 1024)

    # Serialize without pixel data to measure header size
    buf = BytesIO()
    ds.PixelData = b"\x00"
    pydicom.dcmwrite(buf, ds)
    header_size = buf.tell()

    pixel_size = max(target_bytes - header_size, 1024)
    cols = min(pixel_size, 65535)
    rows = (pixel_size + cols - 1) // cols
    pixel_size = rows * cols  # make exact so Rows*Columns matches PixelData length

    ds.PixelData = os.urandom(pixel_size)
    ds.Rows = rows
    ds.Columns = cols
    ds.BitsAllocated = 8
    ds.BitsStored = 8
    ds.HighBit = 7
    ds.PixelRepresentation = 0
    ds.SamplesPerPixel = 1

    buf = BytesIO()
    pydicom.dcmwrite(buf, ds)
    return buf.getvalue()


def build_stow_payload(dicom_bytes: bytes) -> tuple[bytes, str]:
    """Wrap raw DICOM bytes in a multipart/related STOW-RS body.

    Returns (body_bytes, content_type_header).
    """
    boundary = f"STOW_BENCH_{uuid.uuid4().hex[:12]}"
    body = (
        f"--{boundary}\r\n"
        f"Content-Type: application/dicom\r\n\r\n"
    ).encode() + dicom_bytes + f"\r\n--{boundary}--\r\n".encode()

    content_type = (
        f"multipart/related; type=application/dicom; boundary={boundary}"
    )
    return body, content_type


# ---------------------------------------------------------------------------
# Upload helpers
# ---------------------------------------------------------------------------

def _assign_fresh_uid(dicom_bytes: bytes) -> bytes:
    """Return a copy of *dicom_bytes* with a newly generated SOP Instance UID.

    Call this sequentially before submitting work to a thread pool to avoid
    any thread-safety concerns with pydicom's internal state.
    """
    import pydicom
    from pydicom.uid import generate_uid

    ds = pydicom.dcmread(BytesIO(dicom_bytes), force=True)
    ds.SOPInstanceUID = generate_uid()
    buf = BytesIO()
    pydicom.dcmwrite(buf, ds)
    return buf.getvalue()


def _do_upload(
    session: requests.Session,
    url: str,
    dicom_bytes: bytes,
    upload_timeout: float = 300.0,
) -> tuple[float, int, int]:
    """Upload a pre-prepared DICOM file via STOW-RS and return (elapsed_s, http_status, body_size).

    *dicom_bytes* must already contain a unique SOP Instance UID — callers are
    responsible for generating distinct payloads via :func:`_assign_fresh_uid`
    before submitting to a thread pool.

    Returns http_status=-1 on connection / SSL errors so callers can count
    them as errors without raising.
    """
    body, content_type = build_stow_payload(dicom_bytes)

    # connect timeout 30 s; read/upload timeout controlled by --upload-timeout
    timeout = (30, upload_timeout)

    t0 = time.perf_counter()
    try:
        resp = session.post(
            url,
            data=body,
            headers={"Content-Type": content_type},
            stream=True,
            timeout=timeout,
        )
        # Consume the streamed response fully
        for chunk in resp.iter_content(chunk_size=STREAM_CHUNK_SIZE):
            pass
        elapsed = time.perf_counter() - t0
        return elapsed, resp.status_code, len(body)
    except requests.exceptions.SSLError as exc:
        elapsed = time.perf_counter() - t0
        logger.error("SSL error during upload (%.1fs): %s", elapsed, exc)
        return elapsed, -1, len(body)
    except requests.exceptions.ConnectionError as exc:
        elapsed = time.perf_counter() - t0
        logger.error("Connection error during upload (%.1fs): %s", elapsed, exc)
        return elapsed, -1, len(body)
    except requests.exceptions.Timeout as exc:
        elapsed = time.perf_counter() - t0
        logger.error("Timeout during upload (%.1fs): %s", elapsed, exc)
        return elapsed, -1, len(body)


# ---------------------------------------------------------------------------
# Test phases
# ---------------------------------------------------------------------------

def run_sequential(
    session: requests.Session,
    url: str,
    dicom_bytes: bytes,
    repeats: int,
    size_mb: float,
    upload_timeout: float = 300.0,
) -> dict:
    """Upload *repeats* times sequentially and return timing stats."""
    logger.info("  Sequential: %d uploads of ~%g MB ...", repeats, size_mb)
    latencies: list[float] = []
    errors = 0

    for i in range(repeats):
        unique_bytes = _assign_fresh_uid(dicom_bytes)
        elapsed, status, body_size = _do_upload(session, url, unique_bytes, upload_timeout)
        if status != 200:
            logger.warning(
                "    upload %d/%d failed: HTTP %d (%.1fs)",
                i + 1, repeats, status, elapsed,
            )
            errors += 1
        else:
            latencies.append(elapsed)
            logger.info(
                "    upload %d/%d: %.2fs (%s bytes, HTTP %d)",
                i + 1, repeats, elapsed, f"{body_size:,}", status,
            )

    return _summarise(latencies, errors, size_mb, "sequential")


def run_concurrent(
    session: requests.Session,
    url: str,
    dicom_bytes: bytes,
    repeats: int,
    concurrency: int,
    size_mb: float,
    upload_timeout: float = 300.0,
) -> dict:
    """Upload *repeats* times across *concurrency* workers and return timing stats."""
    logger.info(
        "  Concurrent: %d uploads of ~%g MB (%d workers) ...",
        repeats, size_mb, concurrency,
    )
    latencies: list[float] = []
    errors = 0

    # Pre-generate one unique DICOM file per request sequentially so that each
    # worker thread receives a distinct SOP Instance UID payload. Doing this
    # outside the thread pool avoids any pydicom thread-safety concerns and
    # guarantees no two concurrent requests upload the same instance.
    logger.info("  Pre-generating %d unique DICOM payloads ...", repeats)
    unique_payloads = [_assign_fresh_uid(dicom_bytes) for _ in range(repeats)]

    t_wall_start = time.perf_counter()
    with concurrent.futures.ThreadPoolExecutor(max_workers=concurrency) as pool:
        futures = [
            pool.submit(_do_upload, session, url, payload, upload_timeout)
            for payload in unique_payloads
        ]
        for i, future in enumerate(concurrent.futures.as_completed(futures)):
            elapsed, status, body_size = future.result()
            if status != 200:
                logger.warning(
                    "    upload %d/%d failed: HTTP %d (%.1fs)",
                    i + 1, repeats, status, elapsed,
                )
                errors += 1
            else:
                latencies.append(elapsed)
    t_wall = time.perf_counter() - t_wall_start

    result = _summarise(latencies, errors, size_mb, "concurrent")
    result["wall_time_s"] = round(t_wall, 3)
    # Aggregate MB/s based on wall time (not sum of individual latencies)
    total_mb = len(latencies) * size_mb
    result["aggregate_mbps"] = round(total_mb / t_wall, 2) if t_wall > 0 else 0
    return result


def _summarise(
    latencies: list[float],
    errors: int,
    size_mb: float,
    mode: str,
) -> dict:
    """Compute statistics from a list of per-request latencies."""
    n = len(latencies)
    if n == 0:
        return {
            "mode": mode,
            "size_mb": size_mb,
            "requests": 0,
            "errors": errors,
            "total_s": 0,
            "mbps": 0,
            "p50_s": 0,
            "p95_s": 0,
            "max_s": 0,
        }

    total_s = sum(latencies)
    total_mb = n * size_mb
    sorted_lat = sorted(latencies)

    return {
        "mode": mode,
        "size_mb": size_mb,
        "requests": n,
        "errors": errors,
        "total_s": round(total_s, 3),
        "mbps": round(total_mb / total_s, 2) if total_s > 0 else 0,
        "p50_s": round(statistics.median(sorted_lat), 3),
        "p95_s": round(sorted_lat[int(n * 0.95)] if n >= 2 else sorted_lat[-1], 3),
        "max_s": round(sorted_lat[-1], 3),
    }


# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------

_HDR = (
    f"{'Size (MB)':>9} | {'Mode':<10} | {'Reqs':>4} | {'Errors':>6} | "
    f"{'Total (s)':>9} | {'MB/s':>7} | {'p50 (s)':>7} | {'p95 (s)':>7} | {'max (s)':>7}"
)
_SEP = "-" * len(_HDR)


def _fmt_row(r: dict) -> str:
    return (
        f"{r['size_mb']:>9g} | {r['mode']:<10} | {r['requests']:>4} | {r['errors']:>6} | "
        f"{r.get('wall_time_s', r['total_s']):>9.2f} | "
        f"{r.get('aggregate_mbps', r['mbps']):>7.2f} | "
        f"{r['p50_s']:>7.3f} | {r['p95_s']:>7.3f} | {r['max_s']:>7.3f}"
    )


def print_summary(results: list[dict]) -> None:
    print()
    print("STOW-RS Throughput Benchmark")
    print("=" * len(_HDR))
    print(_HDR)
    print(_SEP)
    for r in results:
        print(_fmt_row(r))
    print(_SEP)
    print()


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="STOW-RS throughput benchmark with synthetic DICOM payloads",
    )
    p.add_argument(
        "--app-host", required=True,
        help="Databricks App URL (e.g. https://your-app.databricksapps.com)",
    )
    p.add_argument("--databricks-host", default="",
                    help="Workspace URL for OIDC token endpoint (or DATABRICKS_HOST env)")
    p.add_argument("--client-id", default="",
                    help="SP client ID (or DATABRICKS_SP_CLIENT_ID env)")
    p.add_argument("--client-secret", default="",
                    help="SP client secret (or DATABRICKS_SP_CLIENT_SECRET env)")
    p.add_argument("--token", default="",
                    help="Bearer token — bypasses OAuth2 (or DATABRICKS_TOKEN env)")
    p.add_argument("--pixels-table", default="",
                    help="Pixels table name sent as cookie (or PIXELS_TABLE env)")
    p.add_argument(
        "--sizes", default="1,10,50,100",
        help="Comma-separated payload sizes in MB (default: 1,10,50,100)",
    )
    p.add_argument("--repeats", type=int, default=5,
                    help="Uploads per size per phase (default: 5)")
    p.add_argument("--concurrency", type=int, default=4,
                    help="Parallel workers for the concurrent phase (default: 4)")
    p.add_argument(
        "--upload-timeout", type=float, default=300.0,
        help="Per-upload read/send timeout in seconds (default: 300). "
             "Increase for very large payloads over slow links.",
    )
    p.add_argument(
        "--no-verify", action="store_true",
        help="Disable TLS certificate verification (useful for debugging SSL issues)",
    )
    p.add_argument("--output", default="",
                    help="Write JSON results to this file")
    return p.parse_args(argv)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main(argv: list[str] | None = None) -> None:
    args = parse_args(argv)

    # Auth
    token = resolve_token(args)
    if not token:
        logger.error("No token available — set --token, DATABRICKS_TOKEN, or SP credentials")
        sys.exit(1)

    app_host = args.app_host.rstrip("/")
    stow_url = f"{app_host}/api/dicomweb/studies"

    if args.no_verify:
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
        logger.warning("TLS verification DISABLED (--no-verify)")

    # Session — mount a retry adapter that handles transient SSL / connection drops
    session = requests.Session()
    session.headers["Authorization"] = f"Bearer {token}"
    session.verify = not args.no_verify

    _retry = Retry(
        total=3,
        connect=3,
        read=1,
        backoff_factor=2,
        status_forcelist=[500, 502, 503, 504],
        allowed_methods=["GET", "POST"],
        raise_on_status=False,
    )
    _adapter = HTTPAdapter(max_retries=_retry)
    session.mount("https://", _adapter)
    session.mount("http://", _adapter)

    pixels_table = args.pixels_table or os.environ.get("PIXELS_TABLE", "")
    if pixels_table:
        session.cookies.set("pixels_table", pixels_table)

    # Connectivity check
    logger.info("Checking connectivity to %s ...", stow_url)
    resp = session.get(
        f"{app_host}/api/dicomweb/studies",
        params={"limit": 1},
        timeout=(10, 30),
    )
    if resp.status_code != 200:
        logger.error("Server unreachable: HTTP %d", resp.status_code)
        sys.exit(1)
    logger.info("Server OK")

    # Parse sizes
    sizes = [float(s.strip()) for s in args.sizes.split(",")]
    logger.info(
        "Payload sizes: %s MB | repeats=%d | concurrency=%d",
        sizes, args.repeats, args.concurrency,
    )

    # Generate payloads
    payloads: dict[float, bytes] = {}
    for mb in sizes:
        logger.info("Generating ~%g MB DICOM payload ...", mb)
        payloads[mb] = _build_dicom_bytes(mb)
        logger.info("  -> %s bytes", f"{len(payloads[mb]):,}")

    logger.info("Upload timeout: %.0fs per request", args.upload_timeout)

    # Run benchmarks
    all_results: list[dict] = []

    for mb in sizes:
        dicom_bytes = payloads[mb]
        logger.info("--- %g MB ---", mb)

        seq = run_sequential(
            session, stow_url, dicom_bytes, args.repeats, mb,
            upload_timeout=args.upload_timeout,
        )
        all_results.append(seq)

        conc = run_concurrent(
            session, stow_url, dicom_bytes,
            args.repeats, args.concurrency, mb,
            upload_timeout=args.upload_timeout,
        )
        all_results.append(conc)

    # Summary
    print_summary(all_results)

    if args.output:
        with open(args.output, "w") as f:
            json.dump(all_results, f, indent=2)
        logger.info("Results written to %s", args.output)

    session.close()


if __name__ == "__main__":
    main()
