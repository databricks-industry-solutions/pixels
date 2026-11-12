"""
Unit tests for WADO-RS metadata slimming.

Tests cover:
- filter_dicom_json (non-DICOM keys, oversized InlineBinary at any depth)
- _stream_metadata_array (valid JSON array, batched chunks, row stream closed)
- series/study metadata queries (warehouse-side slimming expression)
"""

# -- sys.path fix ----------------------------------------------------------
# ``tests/dbx/`` shadows the top-level ``dbx`` namespace package.  Insert
# the project root *before* pytest prepends the test directory so that
# ``import dbx.pixels…`` resolves to the real package.
import sys
from pathlib import Path

_PROJECT_ROOT = str(Path(__file__).resolve().parents[2])
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)
# Add dicom-web-gateway app to path for utils imports
_GATEWAY_APP = str(Path(__file__).resolve().parents[2] / "apps" / "dicom-web-gateway")
if _GATEWAY_APP not in sys.path:
    sys.path.insert(0, _GATEWAY_APP)
# --------------------------------------------------------------------------

import json

from utils import wrapper
from utils.dicom_tags import filter_dicom_json
from utils.queries import (
    METADATA_INLINE_BINARY_MAX,
    build_series_metadata_query,
    build_study_metadata_query,
)

_BIG = "A" * 10_000
_SMALL = "AAAA"


def _meta(**extra):
    obj = {
        "00080018": {"vr": "UI", "Value": ["1.2.3"]},
        "200D3CF4": {"vr": "OB", "InlineBinary": _BIG},
        "00091001": {"vr": "OB", "InlineBinary": _SMALL},
        "00880200": {
            "vr": "SQ",
            "Value": [{"7FE00010": {"vr": "OW", "InlineBinary": _BIG}}],
        },
        "file_size": 123,
    }
    obj.update(extra)
    return json.dumps(obj)


class TestFilterDicomJson:
    def test_drops_non_dicom_keys(self):
        out = json.loads(filter_dicom_json(_meta()))
        assert "file_size" not in out
        assert out["00080018"] == {"vr": "UI", "Value": ["1.2.3"]}

    def test_without_max_keeps_inline_binary(self):
        out = json.loads(filter_dicom_json(_meta()))
        assert out["200D3CF4"]["InlineBinary"] == _BIG

    def test_strips_large_inline_binary_keeps_vr(self):
        out = json.loads(filter_dicom_json(_meta(), inline_binary_max=4096))
        assert out["200D3CF4"] == {"vr": "OB"}
        assert out["00091001"]["InlineBinary"] == _SMALL

    def test_strips_nested_inline_binary(self):
        out = json.loads(filter_dicom_json(_meta(), inline_binary_max=4096))
        assert out["00880200"]["Value"] == [{"7FE00010": {"vr": "OW"}}]


class _RowStream:
    """Iterator standing in for the SQL client's row generator."""

    def __init__(self, rows):
        self._rows = iter(rows)
        self.closed = False

    def __iter__(self):
        return self

    def __next__(self):
        return next(self._rows)

    def close(self):
        self.closed = True


class TestStreamMetadataArray:
    def _rows(self, n):
        return [[json.dumps({"00080018": {"vr": "UI", "Value": [str(i)]}})] for i in range(n)]

    def test_valid_json_array_in_batched_chunks(self):
        rows = self._rows(150)
        stream = _RowStream(rows[1:])
        chunks = list(wrapper._stream_metadata_array(rows[0], stream, "metadata"))

        body = json.loads("".join(chunks))
        assert [o["00080018"]["Value"][0] for o in body] == [str(i) for i in range(150)]
        # 150 instances at 64 per chunk -> 2 full chunks + remainder
        assert len(chunks) == 3
        assert stream.closed

    def test_closes_row_stream_when_aborted(self):
        rows = self._rows(200)
        stream = _RowStream(rows[1:])
        gen = wrapper._stream_metadata_array(rows[0], stream, "metadata")
        next(gen)
        gen.close()
        assert stream.closed


class TestMetadataQueries:
    def test_series_query_slims_on_warehouse(self):
        query, params = build_series_metadata_query("main.pixels.object_catalog", "1.2", "1.2.3")
        assert "from_json(meta::string, 'map<string,string>')" in query
        assert f"length(e.value) > {METADATA_INLINE_BINARY_MAX}" in query
        assert "'1.2'" not in query and "'1.2.3'" not in query
        assert params == {
            "pixels_table": "main.pixels.object_catalog",
            "study_uid": "1.2",
            "series_uid": "1.2.3",
        }

    def test_study_query_slims_on_warehouse(self):
        query, _ = build_study_metadata_query("main.pixels.object_catalog", "1.2")
        assert "from_json(meta::string, 'map<string,string>')" in query

    def test_query_has_no_stray_percent(self):
        # pyformat parameters: a bare '%' would break bind-parameter substitution.
        query, params = build_series_metadata_query("main.pixels.object_catalog", "1.2", "1.2.3")
        assert (query % {k: "x" for k in params}).count("%") == 0
