"""
Gateway concurrency & performance test.

Usage:
    # Explicit token
    python test_gateway_perf.py --base-url https://<app-host> \
                                --token dapi... \
                                --concurrency 1 5 10 20

    # Auto-detect from Databricks CLI profile / env vars
    python test_gateway_perf.py --base-url https://<app-host>

    # Use a specific Databricks CLI profile
    python test_gateway_perf.py --base-url https://<app-host> --profile MY_PROFILE

The script fires concurrent requests against several gateway endpoints,
ramps up the concurrency level, and prints a summary table comparing
latencies and error rates at each level.  A healthy async server should
keep p50/p95 roughly constant as concurrency grows; if it degrades
linearly that's a sign the event loop is being blocked.

Authentication priority:
  1. --token flag
  2. DATABRICKS_TOKEN env var
  3. Databricks SDK auto-config (CLI profile, Azure MSI, etc.)
"""

import argparse
import asyncio
import os
import statistics
import sys
import time
from dataclasses import dataclass, field
from urllib.parse import quote

import httpx


# ---------------------------------------------------------------------------
# Token resolution
# ---------------------------------------------------------------------------

def _resolve_token(args: argparse.Namespace) -> str:
    """Return a bearer token, trying CLI flag → env var → SDK in order."""
    if args.token:
        return args.token

    env_token = os.getenv("DATABRICKS_TOKEN")
    if env_token:
        return env_token

    try:
        from databricks.sdk.core import Config
        kwargs = {}
        if args.profile:
            kwargs["profile"] = args.profile
        cfg = Config(**kwargs)
        header_factory = cfg.authenticate()
        headers = header_factory() if callable(header_factory) else header_factory
        if headers:
            auth = headers.get("Authorization", "")
            if auth.startswith("Bearer "):
                return auth[7:]
    except Exception as exc:
        pass

    print(
        "ERROR: No authentication token found.\n"
        "Provide one via --token, DATABRICKS_TOKEN env var, or "
        "configure the Databricks CLI (`databricks configure`).",
        file=sys.stderr,
    )
    sys.exit(1)


# ---------------------------------------------------------------------------
# Endpoint catalogue — add / remove entries to match your data
# ---------------------------------------------------------------------------

ENDPOINTS: list[dict] = [
    {"method": "GET", "path": "/health", "tag": "health"},
    {"method": "GET", "path": "/api/dicomweb/", "tag": "dicomweb-root"},
    {"method": "GET", "path": "/api/dicomweb/studies", "tag": "QIDO-studies"},
    {"method": "GET", "path": "/api/dicomweb/studies?limit=1", "tag": "QIDO-studies-limit1"},
    {"method": "GET", "path": "/api/dicomweb/all_series?limit=1", "tag": "QIDO-all-series"},
]


def _extract_uid(item: dict, tag: str) -> str | None:
    """
    Extract a DICOM UID from a DICOMweb JSON object.

    Expected shape:
        {"0020000D": {"Value": ["1.2.3..."]}}
    """
    try:
        val = item.get(tag, {}).get("Value", [])
        if val and isinstance(val[0], str):
            return val[0]
    except Exception:
        return None
    return None


async def _discover_wado_uids(base_url: str, token: str, timeout: float) -> tuple[str, str, str]:
    """
    Discover one (study, series, sop) triple via QIDO so WADO endpoints
    can be exercised without hardcoding UIDs.
    """
    headers = _auth_headers(token)
    root = base_url.rstrip("/")

    async with httpx.AsyncClient(http2=True, verify=False, headers=headers) as client:
        studies_url = f"{root}/api/dicomweb/studies?limit=1"
        studies_resp = await client.get(studies_url, timeout=timeout)
        studies_resp.raise_for_status()
        studies = studies_resp.json()
        if not studies:
            raise RuntimeError("QIDO discovery returned no studies")
        study_uid = _extract_uid(studies[0], "0020000D")
        if not study_uid:
            raise RuntimeError("Failed to extract StudyInstanceUID (0020000D)")

        series_url = f"{root}/api/dicomweb/studies/{quote(study_uid, safe='')}/series?limit=1"
        series_resp = await client.get(series_url, timeout=timeout)
        series_resp.raise_for_status()
        series = series_resp.json()
        if not series:
            raise RuntimeError(f"QIDO discovery returned no series for study {study_uid}")
        series_uid = _extract_uid(series[0], "0020000E")
        if not series_uid:
            raise RuntimeError("Failed to extract SeriesInstanceUID (0020000E)")

        instances_url = (
            f"{root}/api/dicomweb/studies/{quote(study_uid, safe='')}"
            f"/series/{quote(series_uid, safe='')}/instances?limit=1"
        )
        instances_resp = await client.get(instances_url, timeout=timeout)
        instances_resp.raise_for_status()
        instances = instances_resp.json()
        if not instances:
            raise RuntimeError(
                f"QIDO discovery returned no instances for "
                f"study={study_uid}, series={series_uid}"
            )
        sop_uid = _extract_uid(instances[0], "00080018")
        if not sop_uid:
            raise RuntimeError("Failed to extract SOPInstanceUID (00080018)")

    return study_uid, series_uid, sop_uid


def _build_endpoints(args: argparse.Namespace, token: str) -> list[dict]:
    """Build endpoint list based on CLI flags."""
    eps = list(ENDPOINTS)
    if args.proxy_only:
        eps = [e for e in eps if e["tag"] not in ("health", "dicomweb-root")]
    return eps


async def _maybe_add_wado_endpoints(
    args: argparse.Namespace, token: str, endpoints: list[dict]
) -> list[dict]:
    """Append WADO endpoints when requested."""
    if not args.include_wado:
        return endpoints

    study_uid = args.study_uid
    series_uid = args.series_uid
    sop_uid = args.sop_uid

    if not (study_uid and series_uid and sop_uid):
        print("WADO UID discovery: querying QIDO for one instance triple...")
        study_uid, series_uid, sop_uid = await _discover_wado_uids(
            args.base_url, token, args.timeout
        )
        print(
            "WADO UID discovery: "
            f"study={study_uid}, series={series_uid}, sop={sop_uid}"
        )
    else:
        print(
            "WADO UID source: using CLI values "
            f"(study={study_uid}, series={series_uid}, sop={sop_uid})"
        )

    s_study = quote(study_uid, safe="")
    s_series = quote(series_uid, safe="")
    s_sop = quote(sop_uid, safe="")
    frame = max(1, int(args.frame_number))

    wado_eps = [
        {
            "method": "GET",
            "path": (
                f"/api/dicomweb/studies/{s_study}/series/{s_series}/metadata"
            ),
            "tag": "WADO-series-metadata",
        },
        {
            "method": "GET",
            "path": (
                f"/api/dicomweb/studies/{s_study}/series/{s_series}/instances/{s_sop}"
            ),
            "tag": "WADO-instance",
        },
        {
            "method": "GET",
            "path": (
                f"/api/dicomweb/studies/{s_study}/series/{s_series}"
                f"/instances/{s_sop}/frames/{frame}"
            ),
            "tag": f"WADO-frames-{frame}",
        },
        {
            "method": "GET",
            "path": (
                "/api/dicomweb/wado"
                f"?requestType=WADO&studyUID={quote(study_uid, safe='')}"
                f"&seriesUID={quote(series_uid, safe='')}"
                f"&objectUID={quote(sop_uid, safe='')}"
            ),
            "tag": "WADO-URI-instance",
        },
    ]

    return endpoints + wado_eps


@dataclass
class RequestResult:
    endpoint: str
    status: int
    latency: float
    error: str = ""


@dataclass
class LevelReport:
    concurrency: int
    total_requests: int
    successes: int = 0
    errors: int = 0
    latencies: list[float] = field(default_factory=list)
    wall_time: float = 0.0

    @property
    def rps(self) -> float:
        return self.total_requests / self.wall_time if self.wall_time else 0

    def _pct(self, p: float) -> float:
        if not self.latencies:
            return 0.0
        idx = int(len(self.latencies) * p)
        idx = min(idx, len(self.latencies) - 1)
        return sorted(self.latencies)[idx]

    @property
    def p50(self) -> float:
        return self._pct(0.5)

    @property
    def p95(self) -> float:
        return self._pct(0.95)

    @property
    def p99(self) -> float:
        return self._pct(0.99)

    @property
    def mean(self) -> float:
        return statistics.mean(self.latencies) if self.latencies else 0.0

    @property
    def stdev(self) -> float:
        return statistics.stdev(self.latencies) if len(self.latencies) > 1 else 0.0


# ---------------------------------------------------------------------------
# Worker
# ---------------------------------------------------------------------------

def _auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


async def _fire(
    client: httpx.AsyncClient,
    base_url: str,
    endpoint: dict,
    timeout: float,
) -> RequestResult:
    url = f"{base_url.rstrip('/')}{endpoint['path']}"
    tag = endpoint["tag"]
    t0 = time.monotonic()
    try:
        resp = await client.request(endpoint["method"], url, timeout=timeout)
        elapsed = time.monotonic() - t0
        return RequestResult(tag, resp.status_code, elapsed)
    except Exception as exc:
        elapsed = time.monotonic() - t0
        return RequestResult(tag, 0, elapsed, error=str(exc))


# ---------------------------------------------------------------------------
# Run one concurrency level
# ---------------------------------------------------------------------------

async def _run_level(
    base_url: str,
    concurrency: int,
    total_requests: int,
    timeout: float,
    endpoints: list[dict],
    token: str,
) -> LevelReport:
    report = LevelReport(concurrency=concurrency, total_requests=total_requests)
    sem = asyncio.Semaphore(concurrency)

    async def _bounded(client: httpx.AsyncClient, ep: dict) -> RequestResult:
        async with sem:
            return await _fire(client, base_url, ep, timeout)

    async with httpx.AsyncClient(
        http2=True, verify=False, headers=_auth_headers(token),
    ) as client:
        tasks = [
            _bounded(client, endpoints[i % len(endpoints)])
            for i in range(total_requests)
        ]
        wall_start = time.monotonic()
        results: list[RequestResult] = await asyncio.gather(*tasks)
        report.wall_time = time.monotonic() - wall_start

    for r in results:
        report.latencies.append(r.latency)
        if r.error or r.status >= 400:
            report.errors += 1
        else:
            report.successes += 1

    return report


# ---------------------------------------------------------------------------
# Pretty printing
# ---------------------------------------------------------------------------

_HDR = (
    f"{'Conc':>5}  {'Reqs':>5}  {'OK':>5}  {'Err':>5}  "
    f"{'RPS':>8}  {'Mean':>8}  {'Stdev':>8}  {'p50':>8}  {'p95':>8}  {'p99':>8}"
)
_SEP = "-" * len(_HDR)


def _row(r: LevelReport) -> str:
    return (
        f"{r.concurrency:>5}  {r.total_requests:>5}  {r.successes:>5}  {r.errors:>5}  "
        f"{r.rps:>8.1f}  {r.mean:>7.3f}s  {r.stdev:>7.3f}s  "
        f"{r.p50:>7.3f}s  {r.p95:>7.3f}s  {r.p99:>7.3f}s"
    )


def _diagnose(reports: list[LevelReport]):
    """Print a simple diagnosis based on how latency scales with concurrency."""
    if len(reports) < 2:
        return
    first, last = reports[0], reports[-1]
    if first.p50 == 0 or last.p50 == 0:
        return

    ratio = last.p50 / first.p50
    conc_ratio = last.concurrency / first.concurrency
    print("\n--- Diagnosis ---")

    if last.errors > last.total_requests * 0.1:
        print(
            f"WARNING: {last.errors}/{last.total_requests} errors at concurrency "
            f"{last.concurrency} — the gateway may be dropping requests."
        )

    if ratio > conc_ratio * 0.8:
        print(
            f"PROBLEM: p50 latency grew {ratio:.1f}x while concurrency grew "
            f"{conc_ratio:.1f}x.  This indicates serial request handling — "
            f"likely because _invoke_endpoint() uses synchronous `requests` "
            f"and blocks the asyncio event loop."
        )
    elif ratio > conc_ratio * 0.4:
        print(
            f"MODERATE: p50 latency grew {ratio:.1f}x for a {conc_ratio:.1f}x "
            f"concurrency increase.  There is some contention but the server "
            f"handles partial parallelism."
        )
    else:
        print(
            f"OK: p50 latency grew only {ratio:.1f}x for a {conc_ratio:.1f}x "
            f"concurrency increase.  The gateway handles concurrency well."
        )


# ---------------------------------------------------------------------------
# Detailed per-endpoint breakdown
# ---------------------------------------------------------------------------

async def _run_per_endpoint(
    base_url: str,
    concurrency: int,
    requests_each: int,
    timeout: float,
    endpoints: list[dict],
    token: str,
):
    """Fire *requests_each* requests per endpoint at a fixed concurrency."""
    print(f"\n{'='*60}")
    print(f"Per-endpoint breakdown (concurrency={concurrency}, "
          f"{requests_each} reqs per endpoint)")
    print(f"{'='*60}")

    sem = asyncio.Semaphore(concurrency)

    async def _bounded(client, ep):
        async with sem:
            return await _fire(client, base_url, ep, timeout)

    async with httpx.AsyncClient(
        http2=True, verify=False, headers=_auth_headers(token),
    ) as client:
        for ep in endpoints:
            tasks = [_bounded(client, ep) for _ in range(requests_each)]
            t0 = time.monotonic()
            results = await asyncio.gather(*tasks)
            wall = time.monotonic() - t0

            lats = [r.latency for r in results]
            errs = sum(1 for r in results if r.error or r.status >= 400)
            ok = len(results) - errs
            rps = len(results) / wall if wall else 0

            slats = sorted(lats)
            p50 = slats[len(slats) // 2] if slats else 0
            p95 = slats[int(len(slats) * 0.95)] if slats else 0

            print(
                f"  [{ep['tag']:<25}]  OK={ok:>3}  Err={errs:>3}  "
                f"RPS={rps:>6.1f}  p50={p50:.3f}s  p95={p95:.3f}s  "
                f"wall={wall:.2f}s"
            )


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

async def _main(args: argparse.Namespace):
    token = _resolve_token(args)
    token_preview = token[:8] + "..." if len(token) > 12 else "***"

    print(f"Target:      {args.base_url}")
    print(f"Auth:        Bearer {token_preview}")
    print(f"Concurrency: {args.concurrency}")
    print(f"Requests:    {args.requests_per_level} per level")
    print(f"Timeout:     {args.timeout}s")

    async with httpx.AsyncClient(
        http2=True, verify=False, headers=_auth_headers(token),
    ) as c:
        try:
            r = await c.get(f"{args.base_url.rstrip('/')}/health", timeout=args.timeout)
            print(f"Warm-up:     /health -> {r.status_code}")
            if r.status_code in (401, 403):
                print("ERROR: Authentication failed. Check your token.", file=sys.stderr)
                sys.exit(1)
        except Exception as exc:
            print(f"Warm-up FAILED ({exc}) — continuing anyway")
    print()

    eps = _build_endpoints(args, token)
    eps = await _maybe_add_wado_endpoints(args, token, eps)

    reports: list[LevelReport] = []
    print(_SEP)
    print(_HDR)
    print(_SEP)

    for conc in args.concurrency:
        report = await _run_level(
            args.base_url, conc, args.requests_per_level, args.timeout, eps, token,
        )
        reports.append(report)
        print(_row(report))

    print(_SEP)
    _diagnose(reports)

    if args.per_endpoint:
        await _run_per_endpoint(
            args.base_url,
            concurrency=args.per_endpoint_conc,
            requests_each=args.per_endpoint_reqs,
            timeout=args.timeout,
            endpoints=eps,
            token=token,
        )

    print()


def main():
    parser = argparse.ArgumentParser(
        description="DICOMweb Gateway concurrency & performance test",
    )
    parser.add_argument(
        "--base-url", required=True,
        help="Gateway root URL, e.g. https://my-app.databricksapps.com",
    )
    parser.add_argument(
        "--token",
        help="Databricks personal access token (or set DATABRICKS_TOKEN env var). "
             "Falls back to Databricks SDK auto-config if omitted.",
    )
    parser.add_argument(
        "--profile",
        help="Databricks CLI profile name (used when --token is not provided)",
    )
    parser.add_argument(
        "--concurrency", type=int, nargs="+", default=[1, 5, 10, 20],
        help="Concurrency levels to test (default: 1 5 10 20)",
    )
    parser.add_argument(
        "--requests-per-level", type=int, default=30,
        help="Total requests per concurrency level (default: 30)",
    )
    parser.add_argument(
        "--timeout", type=float, default=60.0,
        help="Per-request timeout in seconds (default: 60)",
    )
    parser.add_argument(
        "--proxy-only", action="store_true",
        help="Skip /health and /api/dicomweb/ (local endpoints) — "
             "only test endpoints that hit the serving model",
    )
    parser.add_argument(
        "--per-endpoint", action="store_true",
        help="Also run a per-endpoint breakdown after the main ramp",
    )
    parser.add_argument(
        "--per-endpoint-conc", type=int, default=10,
        help="Concurrency for per-endpoint breakdown (default: 10)",
    )
    parser.add_argument(
        "--per-endpoint-reqs", type=int, default=20,
        help="Requests per endpoint in breakdown (default: 20)",
    )
    parser.add_argument(
        "--include-wado", action="store_true",
        help="Include WADO endpoints in the benchmark. If UIDs are not "
             "provided, one instance is auto-discovered via QIDO.",
    )
    parser.add_argument(
        "--study-uid",
        help="StudyInstanceUID for WADO tests (optional with --include-wado)",
    )
    parser.add_argument(
        "--series-uid",
        help="SeriesInstanceUID for WADO tests (optional with --include-wado)",
    )
    parser.add_argument(
        "--sop-uid",
        help="SOPInstanceUID for WADO tests (optional with --include-wado)",
    )
    parser.add_argument(
        "--frame-number", type=int, default=1,
        help="Frame number for WADO-RS frame test (default: 1)",
    )
    args = parser.parse_args()
    asyncio.run(_main(args))


if __name__ == "__main__":
    main()
