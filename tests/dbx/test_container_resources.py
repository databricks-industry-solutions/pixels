"""
Unit tests for container (cgroup) resource detection in the gateway metrics.

Tests cover:
- cgroup v2 limits, working set (usage minus inactive_file) and CPU quota
- cgroup v2 without limits ("max")
- cgroup v1 limits and its "unlimited" sentinel
- no cgroup files (local run)
- ContainerCpuMeter (CPU use between samples as % of the limit)
"""

# -- sys.path fix ----------------------------------------------------------
import sys
from pathlib import Path

_PROJECT_ROOT = str(Path(__file__).resolve().parents[2])
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)
_GATEWAY_APP = str(Path(__file__).resolve().parents[2] / "apps" / "dicom-web-gateway")
if _GATEWAY_APP not in sys.path:
    sys.path.insert(0, _GATEWAY_APP)
# --------------------------------------------------------------------------

from utils.metrics import ContainerCpuMeter, container_resources

_MB = 1024 * 1024


def _write(root: Path, files: dict) -> str:
    for name, text in files.items():
        path = root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text)
    return str(root)


def test_cgroup_v2_limits(tmp_path):
    root = _write(
        tmp_path,
        {
            "memory.max": str(12_000_000_000),
            "memory.current": str(9_000 * _MB),
            "memory.stat": f"anon 123\ninactive_file {500 * _MB}\nactive_file 1\n",
            "cpu.max": "400000 100000",
        },
    )
    res = container_resources(root)
    assert res["container_memory_limit_mb"] == round(12_000_000_000 / _MB, 2)
    assert res["container_memory_working_set_mb"] == 8500.0
    assert res["container_memory_used_percent"] == round(8500 * _MB / 12_000_000_000 * 100, 1)
    assert res["container_cpu_limit"] == 4.0


def test_cgroup_v2_unlimited(tmp_path):
    root = _write(
        tmp_path,
        {"memory.max": "max", "memory.current": str(100 * _MB), "cpu.max": "max 100000"},
    )
    res = container_resources(root)
    assert res["container_memory_limit_mb"] is None
    assert res["container_memory_working_set_mb"] == 100.0
    assert res["container_memory_used_percent"] is None
    assert res["container_cpu_limit"] is None


def test_cgroup_v1_limits(tmp_path):
    root = _write(
        tmp_path,
        {
            "memory/memory.limit_in_bytes": str(2048 * _MB),
            "memory/memory.usage_in_bytes": str(1100 * _MB),
            "memory/memory.stat": f"cache 1\ntotal_inactive_file {100 * _MB}\n",
            "cpu/cpu.cfs_quota_us": "200000",
            "cpu/cpu.cfs_period_us": "100000",
        },
    )
    res = container_resources(root)
    assert res["container_memory_limit_mb"] == 2048.0
    assert res["container_memory_working_set_mb"] == 1000.0
    assert res["container_memory_used_percent"] == round(1000 / 2048 * 100, 1)
    assert res["container_cpu_limit"] == 2.0


def test_cgroup_v1_unlimited_sentinel(tmp_path):
    root = _write(
        tmp_path,
        {
            "memory/memory.limit_in_bytes": str(9223372036854771712),
            "memory/memory.usage_in_bytes": str(50 * _MB),
            "cpu/cpu.cfs_quota_us": "-1",
            "cpu/cpu.cfs_period_us": "100000",
        },
    )
    res = container_resources(root)
    assert res["container_memory_limit_mb"] is None
    assert res["container_memory_used_percent"] is None
    assert res["container_cpu_limit"] is None


def test_no_cgroup(tmp_path):
    res = container_resources(str(tmp_path))
    assert res == {
        "container_memory_limit_mb": None,
        "container_memory_working_set_mb": None,
        "container_memory_used_percent": None,
        "container_cpu_limit": None,
    }


class _Clock:
    def __init__(self):
        self.t = 100.0

    def __call__(self):
        return self.t


def test_cpu_meter_v2_percent_of_limit(tmp_path):
    root = _write(tmp_path, {"cpu.max": "400000 100000", "cpu.stat": "usage_usec 10000000\n"})
    clock = _Clock()
    meter = ContainerCpuMeter(root, clock=clock)
    assert meter.sample() is None  # first call only primes
    # 2 CPU-seconds used over 1 s of wall time on a 4-core limit -> 50 %
    (tmp_path / "cpu.stat").write_text("usage_usec 12000000\nuser_usec 1\n")
    clock.t += 1.0
    assert meter.sample() == 50.0


def test_cpu_meter_v1_without_limit_uses_host_cores(tmp_path, monkeypatch):
    monkeypatch.setattr("utils.metrics.os.cpu_count", lambda: 8)
    root = _write(
        tmp_path,
        {
            "cpu/cpu.cfs_quota_us": "-1",
            "cpu/cpu.cfs_period_us": "100000",
            "cpuacct/cpuacct.usage": str(5 * 10**9),
        },
    )
    clock = _Clock()
    meter = ContainerCpuMeter(root, clock=clock)
    meter.sample()
    (tmp_path / "cpuacct/cpuacct.usage").write_text(str(9 * 10**9))
    clock.t += 2.0
    assert meter.sample() == 25.0  # 4 CPU-s / 2 s / 8 cores


def test_cpu_meter_no_cgroup(tmp_path):
    meter = ContainerCpuMeter(str(tmp_path), clock=_Clock())
    assert meter.sample() is None
    assert meter.sample() is None
