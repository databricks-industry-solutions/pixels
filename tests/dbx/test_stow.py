"""
Unit tests for the STOW-RS handler and supporting utilities.

Tests cover:
- _derive_stow_table (table name derivation)
- _resolve_stow_targets (per-request target resolution with cookie override)
- _extract_tag (DICOM tag extraction from JSON metadata)
- _resolve_user_email (proxy header + SCIM fallback)
- _StowRecordBuffer (thread-safe batched audit record buffer)
- _write_stow_records / _write_stow_records_completed (SQL INSERT helpers)
- _fire_stow_job (job trigger with run coalescing)
- _poll_stow_status (Phase 1 polling with timeout)
- _cache_streaming_results (UID → path cache population from streaming results)
- build_stow_insert_query / build_stow_poll_query / build_stow_insert_completed_query
- extract_dicom_uids (UID extraction from raw DICOM bytes)
- dicomweb_stow_studies (main handler — content-type validation & path routing)
"""

# -- sys.path fix ----------------------------------------------------------
# ``tests/dbx/`` shadows the top-level ``dbx`` namespace package.  Insert
# the project root *before* pytest prepends the test directory and purge
# any cached ``dbx`` module that points at the tests directory so that
# ``import dbx.pixels…`` resolves to the real package.
import sys
from pathlib import Path

_PROJECT_ROOT = str(Path(__file__).resolve().parents[2])
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)

# Evict shadowed 'dbx' from sys.modules so the real package is imported
_test_dbx_dir = str(Path(__file__).resolve().parent)
for _mod_name in list(sys.modules):
    if _mod_name == "dbx" or _mod_name.startswith("dbx."):
        _mod = sys.modules[_mod_name]
        if hasattr(_mod, "__file__") and _mod.__file__ and _test_dbx_dir in _mod.__file__:
            del sys.modules[_mod_name]
        elif hasattr(_mod, "__path__"):
            _paths = list(_mod.__path__) if hasattr(_mod.__path__, "__iter__") else []
            if any(_test_dbx_dir in p for p in _paths):
                del sys.modules[_mod_name]
# --------------------------------------------------------------------------

# Mock heavy / unavailable third-party modules that are pulled in
# transitively via handlers/__init__.py → _qido/_wado → _common → sql_client / lakebase.
# These are not needed by the _stow unit tests.
from unittest import mock as _mock

for _dep in [
    "databricks.sql",
    "databricks.sql.client",
    "databricks.sdk",
    "databricks.sdk.core",
    "databricks.sdk.service",
    "databricks.sdk.service.postgres",
    "psycopg2",
    "psycopg2.sql",
    "psycopg2.extras",
    "psycopg2.pool",
    "psutil",
]:
    sys.modules.setdefault(_dep, _mock.MagicMock())

import struct
import time
from io import BytesIO
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow import (
    _cache_streaming_results,
    _derive_stow_table,
    _extract_tag,
    _fire_stow_job,
    _poll_stow_status,
    _resolve_stow_targets,
    _resolve_user_email,
    _StowRecordBuffer,
    _token_email_cache,
    _write_stow_records,
    _write_stow_records_completed,
)
from dbx.pixels.resources.dicom_web_gateway.utils.multipart_stream import (
    _TAG_SOP_INSTANCE_UID,
    _TAG_STUDY_INSTANCE_UID,
    _scan_uid_tag,
    extract_dicom_uids,
)
from dbx.pixels.resources.dicom_web_gateway.utils.queries import (
    build_stow_insert_completed_query,
    build_stow_insert_query,
    build_stow_poll_query,
)

# ---------------------------------------------------------------------------
# Module-under-test imports
# ---------------------------------------------------------------------------


# ---------------------------------------------------------------------------
# _derive_stow_table
# ---------------------------------------------------------------------------


class TestDeriveStowTable:

    def test_valid_three_part_name(self):
        assert _derive_stow_table("main.pixels.object_catalog") == "main.pixels.stow_operations"

    def test_two_part_name_returns_none(self):
        assert _derive_stow_table("schema.table") is None

    def test_four_part_name_returns_none(self):
        assert _derive_stow_table("a.b.c.d") is None

    def test_single_part_returns_none(self):
        assert _derive_stow_table("table_only") is None

    def test_empty_string_returns_none(self):
        assert _derive_stow_table("") is None


# ---------------------------------------------------------------------------
# _extract_tag
# ---------------------------------------------------------------------------


class TestExtractTag:

    def test_single_value(self):
        meta = {"00080018": {"vr": "UI", "Value": ["1.2.3.4.5"]}}
        assert _extract_tag(meta, "00080018") == "1.2.3.4.5"

    def test_missing_tag(self):
        assert _extract_tag({}, "00080018") is None

    def test_empty_value_list(self):
        meta = {"00080018": {"vr": "UI", "Value": []}}
        assert _extract_tag(meta, "00080018") is None

    def test_non_dict_entry(self):
        meta = {"00080018": "not_a_dict"}
        assert _extract_tag(meta, "00080018") is None

    def test_numeric_value_converted_to_str(self):
        meta = {"00280008": {"vr": "IS", "Value": [5]}}
        assert _extract_tag(meta, "00280008") == "5"


# ---------------------------------------------------------------------------
# _resolve_stow_targets
# ---------------------------------------------------------------------------


class TestResolveStowTargets:

    @patch(
        "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._default_stow_catalog_table",
        "main.pixels.object_catalog",
    )
    @patch(
        "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._default_stow_table",
        "main.pixels.stow_operations",
    )
    def test_no_cookie_uses_default(self):
        request = MagicMock()
        request.cookies = {}
        stow_table, catalog_table = _resolve_stow_targets(request)
        assert stow_table == "main.pixels.stow_operations"
        assert catalog_table == "main.pixels.object_catalog"

    @patch(
        "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._default_stow_catalog_table",
        "main.pixels.object_catalog",
    )
    @patch(
        "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._default_stow_table",
        "main.pixels.stow_operations",
    )
    def test_valid_cookie_overrides_default(self):
        request = MagicMock()
        request.cookies = {"pixels_table": "catalog2.schema2.my_table"}
        stow_table, catalog_table = _resolve_stow_targets(request)
        assert stow_table == "catalog2.schema2.stow_operations"
        assert catalog_table == "catalog2.schema2.my_table"

    @patch(
        "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._default_stow_catalog_table",
        "main.pixels.object_catalog",
    )
    @patch(
        "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._default_stow_table",
        "main.pixels.stow_operations",
    )
    def test_invalid_cookie_falls_back_to_default(self):
        request = MagicMock()
        request.cookies = {"pixels_table": "DROP TABLE; --"}
        stow_table, catalog_table = _resolve_stow_targets(request)
        # Falls back to default because cookie is invalid
        assert stow_table == "main.pixels.stow_operations"
        assert catalog_table == "main.pixels.object_catalog"

    @patch(
        "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._default_stow_catalog_table",
        None,
    )
    @patch(
        "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._default_stow_table",
        None,
    )
    def test_no_default_no_cookie_returns_none(self):
        request = MagicMock()
        request.cookies = {}
        stow_table, catalog_table = _resolve_stow_targets(request)
        assert stow_table is None
        assert catalog_table is None

    def test_none_request_returns_none(self):
        stow_table, catalog_table = _resolve_stow_targets(None)
        assert stow_table is None
        assert catalog_table is None


# ---------------------------------------------------------------------------
# _resolve_user_email
# ---------------------------------------------------------------------------


class TestResolveUserEmail:

    def setup_method(self):
        _token_email_cache.clear()

    def test_proxy_header_fast_path(self):
        request = MagicMock()
        request.headers = {"X-Forwarded-Email": "user@example.com"}
        assert _resolve_user_email(request, "some-token") == "user@example.com"

    def test_proxy_header_with_whitespace(self):
        request = MagicMock()
        request.headers = {"X-Forwarded-Email": "  user@example.com  "}
        assert _resolve_user_email(request, "some-token") == "user@example.com"

    def test_empty_proxy_header_falls_through(self):
        request = MagicMock()
        request.headers = {"X-Forwarded-Email": ""}
        with patch.dict("os.environ", {"DATABRICKS_HOST": ""}):
            result = _resolve_user_email(request, "token")
        assert result is None

    def test_no_token_returns_none(self):
        request = MagicMock()
        request.headers = {}
        result = _resolve_user_email(request, "")
        assert result is None

    @patch("dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._requests")
    def test_scim_fallback_resolves_email(self, mock_requests):
        request = MagicMock()
        request.headers = {}
        mock_resp = MagicMock()
        mock_resp.ok = True
        mock_resp.json.return_value = {"emails": [{"value": "scim@example.com", "primary": True}]}
        mock_requests.get.return_value = mock_resp

        with patch.dict("os.environ", {"DATABRICKS_HOST": "https://myhost.cloud.databricks.com"}):
            result = _resolve_user_email(request, "my-token")

        assert result == "scim@example.com"

    @patch("dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._requests")
    def test_scim_cached_on_second_call(self, mock_requests):
        request = MagicMock()
        request.headers = {}
        mock_resp = MagicMock()
        mock_resp.ok = True
        mock_resp.json.return_value = {"emails": [{"value": "scim@example.com", "primary": True}]}
        mock_requests.get.return_value = mock_resp

        with patch.dict("os.environ", {"DATABRICKS_HOST": "https://myhost.cloud.databricks.com"}):
            _resolve_user_email(request, "my-token-2")
            _resolve_user_email(request, "my-token-2")

        # SCIM API should only be called once (result cached)
        assert mock_requests.get.call_count == 1

    @patch("dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._requests")
    def test_scim_failure_returns_none(self, mock_requests):
        request = MagicMock()
        request.headers = {}
        mock_requests.get.side_effect = Exception("network error")

        with patch.dict("os.environ", {"DATABRICKS_HOST": "https://host.com"}):
            result = _resolve_user_email(request, "my-token-3")
        assert result is None


# ---------------------------------------------------------------------------
# _StowRecordBuffer
# ---------------------------------------------------------------------------


class TestStowRecordBuffer:

    def test_flush_on_max_batch(self):
        collected = []

        def write_fn(sql_client, token, records):
            collected.extend(records)

        buf = _StowRecordBuffer(write_fn, max_batch=3, flush_interval_s=60)
        mock_client = MagicMock()
        buf.set_client(mock_client, "tok")

        buf.append({"file_id": "1"})
        buf.append({"file_id": "2"})
        assert len(collected) == 0  # not yet flushed

        buf.append({"file_id": "3"})
        assert len(collected) == 3  # flushed at batch boundary

        buf.stop()

    def test_flush_all_drains_buffer(self):
        collected = []

        def write_fn(sql_client, token, records):
            collected.extend(records)

        buf = _StowRecordBuffer(write_fn, max_batch=100, flush_interval_s=60)
        buf.set_client(MagicMock(), "tok")

        buf.append({"file_id": "a"})
        buf.append({"file_id": "b"})
        assert len(collected) == 0

        buf.flush_all()
        assert len(collected) == 2
        buf.stop()

    def test_stop_flushes_remaining(self):
        collected = []

        def write_fn(sql_client, token, records):
            collected.extend(records)

        buf = _StowRecordBuffer(write_fn, max_batch=100, flush_interval_s=60)
        buf.set_client(MagicMock(), "tok")

        buf.append({"file_id": "x"})
        buf.stop()
        assert len(collected) == 1

    def test_no_client_does_not_crash(self):
        """Flush with no SQL client configured should silently skip."""
        buf = _StowRecordBuffer(lambda *a: None, max_batch=1, flush_interval_s=60)
        buf.append({"file_id": "1"})
        buf.stop()  # Should not raise

    def test_write_fn_exception_does_not_crash(self):
        def bad_write_fn(sql_client, token, records):
            raise RuntimeError("SQL error")

        buf = _StowRecordBuffer(bad_write_fn, max_batch=1, flush_interval_s=60)
        buf.set_client(MagicMock(), "tok")
        buf.append({"file_id": "1"})  # triggers flush — should not raise
        buf.stop()

    def test_periodic_flush(self):
        collected = []

        def write_fn(sql_client, token, records):
            collected.extend(records)

        buf = _StowRecordBuffer(write_fn, max_batch=100, flush_interval_s=0.2)
        buf.set_client(MagicMock(), "tok")

        buf.append({"file_id": "periodic"})
        # Wait for periodic flush to fire
        time.sleep(0.5)
        assert len(collected) >= 1
        buf.stop()


# ---------------------------------------------------------------------------
# _write_stow_records / _write_stow_records_completed
# ---------------------------------------------------------------------------


class TestWriteStowRecords:

    def test_empty_records_is_noop(self):
        mock_client = MagicMock()
        _write_stow_records(mock_client, "tok", [])
        mock_client.execute.assert_not_called()

    def test_records_without_stow_table_and_no_default_is_noop(self):
        mock_client = MagicMock()
        with patch(
            "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._default_stow_table",
            None,
        ):
            _write_stow_records(mock_client, "tok", [{"file_id": "1"}])
        mock_client.execute.assert_not_called()

    def test_records_grouped_by_stow_table(self):
        mock_client = MagicMock()
        records = [
            {
                "stow_table": "cat.sch.stow_operations",
                "file_id": "f1",
                "volume_path": "/v/p",
                "file_size": 100,
                "upload_timestamp": "2024-01-01 00:00:00",
            },
            {
                "stow_table": "cat2.sch2.stow_operations",
                "file_id": "f2",
                "volume_path": "/v/p2",
                "file_size": 200,
                "upload_timestamp": "2024-01-01 00:00:00",
            },
        ]
        _write_stow_records(mock_client, "tok", records)
        assert mock_client.execute.call_count == 2

    def test_sql_error_with_raise_on_error(self):
        mock_client = MagicMock()
        mock_client.execute.side_effect = RuntimeError("SQL boom")
        with pytest.raises(RuntimeError, match="SQL boom"):
            _write_stow_records(
                mock_client,
                "tok",
                [
                    {
                        "stow_table": "cat.sch.stow_operations",
                        "file_id": "f1",
                        "volume_path": "/v/p",
                        "file_size": 100,
                        "upload_timestamp": "2024-01-01 00:00:00",
                    }
                ],
                raise_on_error=True,
            )

    def test_sql_error_without_raise_does_not_crash(self):
        mock_client = MagicMock()
        mock_client.execute.side_effect = RuntimeError("SQL boom")
        # Should not raise
        _write_stow_records(
            mock_client,
            "tok",
            [
                {
                    "stow_table": "cat.sch.stow_operations",
                    "file_id": "f1",
                    "volume_path": "/v/p",
                    "file_size": 100,
                    "upload_timestamp": "2024-01-01 00:00:00",
                }
            ],
        )


class TestWriteStowRecordsCompleted:

    def test_empty_records_is_noop(self):
        mock_client = MagicMock()
        _write_stow_records_completed(mock_client, "tok", [])
        mock_client.execute.assert_not_called()

    def test_inserts_completed_records(self):
        mock_client = MagicMock()
        records = [
            {
                "stow_table": "cat.sch.stow_operations",
                "file_id": "f1",
                "volume_path": "/stow/base",
                "file_size": 1024,
                "upload_timestamp": "2024-01-01 00:00:00",
                "output_paths": '["path1.dcm","path2.dcm"]',
            }
        ]
        _write_stow_records_completed(mock_client, "tok", records)
        mock_client.execute.assert_called_once()
        call_args = mock_client.execute.call_args
        query = call_args[0][0]
        assert "completed" in query
        assert "output_paths" in query


# ---------------------------------------------------------------------------
# _fire_stow_job
# ---------------------------------------------------------------------------


class TestFireStowJob:

    @patch.dict("os.environ", {"DATABRICKS_HOST": ""})
    def test_no_host_returns_skipped(self):
        result = _fire_stow_job("token")
        assert result["action"] == "skipped"
        assert "DATABRICKS_HOST" in result["reason"]

    @patch(
        "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._resolve_stow_job_id",
        return_value=None,
    )
    @patch.dict("os.environ", {"DATABRICKS_HOST": "https://host.com"})
    def test_no_job_id_returns_skipped(self, _):
        result = _fire_stow_job("token")
        assert result["action"] == "skipped"
        assert "not found" in result["reason"]

    @patch("dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._requests")
    @patch(
        "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._resolve_stow_job_id",
        return_value=42,
    )
    @patch.dict("os.environ", {"DATABRICKS_HOST": "https://host.com"})
    def test_triggers_job_when_no_active_runs(self, _, mock_requests):
        # First call: list runs (empty)
        list_resp = MagicMock()
        list_resp.ok = True
        list_resp.json.return_value = {"runs": []}
        # Second call: run-now
        run_resp = MagicMock()
        run_resp.ok = True
        run_resp.json.return_value = {"run_id": 999}

        mock_requests.get.return_value = list_resp
        mock_requests.post.return_value = run_resp

        result = _fire_stow_job("token")
        assert result["action"] == "triggered"
        assert result["run_id"] == 999

    @patch("dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._requests")
    @patch(
        "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._resolve_stow_job_id",
        return_value=42,
    )
    @patch.dict("os.environ", {"DATABRICKS_HOST": "https://host.com"})
    def test_already_processing_with_2_active_runs(self, _, mock_requests):
        list_resp = MagicMock()
        list_resp.ok = True
        list_resp.json.return_value = {
            "runs": [
                {"run_id": 1, "state": {"life_cycle_state": "RUNNING"}},
                {"run_id": 2, "state": {"life_cycle_state": "PENDING"}},
            ]
        }
        mock_requests.get.return_value = list_resp

        result = _fire_stow_job("token")
        assert result["action"] == "already_processing"
        assert result["active_runs"] == 2

    @patch("dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._requests")
    @patch(
        "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._resolve_stow_job_id",
        return_value=42,
    )
    @patch.dict("os.environ", {"DATABRICKS_HOST": "https://host.com"})
    def test_queued_with_1_active_run(self, _, mock_requests):
        list_resp = MagicMock()
        list_resp.ok = True
        list_resp.json.return_value = {
            "runs": [{"run_id": 1, "state": {"life_cycle_state": "RUNNING"}}]
        }
        run_resp = MagicMock()
        run_resp.ok = True
        run_resp.json.return_value = {"run_id": 888}

        mock_requests.get.return_value = list_resp
        mock_requests.post.return_value = run_resp

        result = _fire_stow_job("token")
        assert result["action"] == "queued"
        assert result["run_id"] == 888


# ---------------------------------------------------------------------------
# _poll_stow_status
# ---------------------------------------------------------------------------


class TestPollStowStatus:

    def test_no_stow_table_returns_skipped(self):
        mock_client = MagicMock()
        with patch(
            "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._default_stow_table",
            None,
        ):
            result = _poll_stow_status(mock_client, "tok", "file123")
        assert result["status"] == "skipped"

    @patch(
        "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._STOW_TABLE_POLL_INTERVAL",
        0.01,
    )
    @patch(
        "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._STOW_TABLE_POLL_TIMEOUT",
        0.1,
    )
    def test_completed_status_returned(self):
        mock_client = MagicMock()
        mock_client.execute.return_value = [("completed", ["/path/1.dcm"], None)]

        result = _poll_stow_status(
            mock_client, "tok", "file123", stow_table="cat.sch.stow_operations"
        )
        assert result["status"] == "completed"
        assert result["output_paths"] == ["/path/1.dcm"]

    @patch(
        "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._STOW_TABLE_POLL_INTERVAL",
        0.01,
    )
    @patch(
        "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._STOW_TABLE_POLL_TIMEOUT",
        0.1,
    )
    def test_timeout_when_stuck_pending(self):
        mock_client = MagicMock()
        mock_client.execute.return_value = [("pending", None, None)]

        result = _poll_stow_status(
            mock_client, "tok", "file123", stow_table="cat.sch.stow_operations"
        )
        assert result["status"] == "timeout"

    @patch(
        "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._STOW_TABLE_POLL_INTERVAL",
        0.01,
    )
    @patch(
        "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._STOW_TABLE_POLL_TIMEOUT",
        0.1,
    )
    def test_error_status_returned(self):
        mock_client = MagicMock()
        mock_client.execute.return_value = [("failed", [], "split error")]

        result = _poll_stow_status(
            mock_client, "tok", "file123", stow_table="cat.sch.stow_operations"
        )
        assert result["status"] == "failed"
        assert result["error_message"] == "split error"


# ---------------------------------------------------------------------------
# _cache_streaming_results
# ---------------------------------------------------------------------------


class TestCacheStreamingResults:

    @patch("dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._populate_cache")
    def test_successful_results_cached(self, mock_populate):
        part_results = [
            {
                "status": "SUCCESS",
                "sop_uid": "1.2.3",
                "study_uid": "2.3.4",
                "series_uid": "3.4.5",
                "num_frames": 1,
                "output_path": "/stow/2.3.4/3.4.5/1.2.3.dcm",
            },
            {
                "status": "FAILED",
                "sop_uid": "",
                "output_path": "/stow/bad",
            },
        ]
        entries = _cache_streaming_results(part_results, "2.3.4", "cat.sch.table")
        assert len(entries) == 1
        assert entries[0]["sop_uid"] == "1.2.3"
        mock_populate.assert_called_once()

    @patch("dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._populate_cache")
    def test_no_successful_results_returns_empty(self, mock_populate):
        part_results = [{"status": "FAILED", "sop_uid": "", "output_path": "/stow/bad"}]
        entries = _cache_streaming_results(part_results, None, "cat.sch.table")
        assert entries == []
        mock_populate.assert_not_called()

    @patch("dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._populate_cache")
    def test_missing_sop_uid_skipped(self, mock_populate):
        part_results = [
            {
                "status": "SUCCESS",
                "sop_uid": "",
                "study_uid": "",
                "series_uid": "",
                "output_path": "/stow/x",
            }
        ]
        entries = _cache_streaming_results(part_results, None, "cat.sch.table")
        assert entries == []
        mock_populate.assert_not_called()


# ---------------------------------------------------------------------------
# Query builders (build_stow_insert_query, build_stow_poll_query,
#                 build_stow_insert_completed_query)
# ---------------------------------------------------------------------------


class TestBuildStowInsertQuery:

    def test_single_record(self):
        records = [
            {
                "file_id": "abc123",
                "volume_path": "/Volumes/cat/sch/vol/2024-01-01/abc123.mpr",
                "file_size": 12345,
                "upload_timestamp": "2024-01-01 12:00:00",
                "study_constraint": "1.2.3",
                "content_type": "multipart/related; boundary=---",
                "client_ip": "10.0.0.1",
                "user_email": "user@example.com",
                "user_agent": "curl/8.0",
            }
        ]
        query, params = build_stow_insert_query("main.pixels.stow_operations", records)

        assert "INSERT INTO IDENTIFIER" in query
        assert "%(file_id_0)s" in query
        assert "'pending'" in query
        assert params["file_id_0"] == "abc123"
        assert params["file_size_0"] == 12345
        assert params["stow_table"] == "main.pixels.stow_operations"

    def test_multi_record_batch(self):
        records = [
            {
                "file_id": f"f{i}",
                "volume_path": f"/v/p{i}",
                "file_size": i * 100,
                "upload_timestamp": "2024-01-01 00:00:00",
            }
            for i in range(3)
        ]
        query, params = build_stow_insert_query("main.pixels.stow_operations", records)
        assert "%(file_id_0)s" in query
        assert "%(file_id_1)s" in query
        assert "%(file_id_2)s" in query

    def test_invalid_table_name_raises(self):
        with pytest.raises(ValueError, match="Invalid table name"):
            build_stow_insert_query("DROP TABLE; --", [{"file_id": "x"}])


class TestBuildStowPollQuery:

    def test_returns_parameterized_query(self):
        query, params = build_stow_poll_query("main.pixels.stow_operations", "file123")
        assert "%(file_id)s" in query
        assert "%(stow_table)s" in query
        assert params["file_id"] == "file123"
        assert params["stow_table"] == "main.pixels.stow_operations"

    def test_invalid_table_name_raises(self):
        with pytest.raises(ValueError):
            build_stow_poll_query("bad table!", "file123")


class TestBuildStowInsertCompletedQuery:

    def test_single_completed_record(self):
        records = [
            {
                "file_id": "abc",
                "volume_path": "/stow/base",
                "file_size": 500,
                "upload_timestamp": "2024-01-01 00:00:00",
                "output_paths": '["path1.dcm"]',
            }
        ]
        query, params = build_stow_insert_completed_query("main.pixels.stow_operations", records)
        assert "'completed'" in query
        assert "output_paths" in query
        assert params["output_paths_0"] == '["path1.dcm"]'


# ---------------------------------------------------------------------------
# extract_dicom_uids (multipart_stream)
# ---------------------------------------------------------------------------


class TestExtractDicomUids:

    def test_pydicom_extraction(self):
        """Test UID extraction from a valid (minimal) DICOM dataset."""
        import pydicom
        from pydicom.dataset import Dataset, FileMetaDataset
        from pydicom.uid import ExplicitVRLittleEndian

        file_meta = FileMetaDataset()
        file_meta.MediaStorageSOPClassUID = "1.2.840.10008.5.1.4.1.1.2"
        file_meta.MediaStorageSOPInstanceUID = "1.2.3.4.5.6.7"
        file_meta.TransferSyntaxUID = ExplicitVRLittleEndian

        ds = Dataset()
        ds.file_meta = file_meta
        ds.is_little_endian = True
        ds.is_implicit_VR = False
        ds.SOPInstanceUID = "1.2.3.4.5.6.7"
        ds.StudyInstanceUID = "1.2.3.4.5"
        ds.SeriesInstanceUID = "1.2.3.4.5.6"
        ds.NumberOfFrames = 3

        buf = BytesIO()
        pydicom.dcmwrite(buf, ds)
        raw = buf.getvalue()

        result = extract_dicom_uids(raw)
        assert result["sop_uid"] == "1.2.3.4.5.6.7"
        assert result["study_uid"] == "1.2.3.4.5"
        assert result["series_uid"] == "1.2.3.4.5.6"
        assert result["num_frames"] == 3

    def test_empty_bytes_returns_defaults(self):
        result = extract_dicom_uids(b"")
        assert result["sop_uid"] == ""
        assert result["num_frames"] == 1


# ---------------------------------------------------------------------------
# _scan_uid_tag (multipart_stream — raw byte scanner)
# ---------------------------------------------------------------------------


class TestScanUidTag:

    def test_explicit_vr_ui_tag(self):
        """Build a tag with Explicit VR short form (UI, 2-byte length)."""
        uid = "1.2.840.113619"
        uid_bytes = uid.encode("ascii") + b"\x00"  # padded with null
        tag = _TAG_SOP_INSTANCE_UID + b"UI" + struct.pack("<H", len(uid_bytes)) + uid_bytes
        result = _scan_uid_tag(tag, _TAG_SOP_INSTANCE_UID)
        assert result == uid

    def test_implicit_vr_tag(self):
        """Build a tag with Implicit VR (4-byte length, no VR code)."""
        uid = "1.2.3.4.5"
        uid_bytes = uid.encode("ascii") + b"\x00"
        # Implicit VR: first 2 bytes after tag are NOT a valid VR code
        tag = _TAG_STUDY_INSTANCE_UID + struct.pack("<I", len(uid_bytes)) + uid_bytes
        result = _scan_uid_tag(tag, _TAG_STUDY_INSTANCE_UID)
        assert result == uid

    def test_tag_not_found(self):
        assert _scan_uid_tag(b"\x00" * 100, _TAG_SOP_INSTANCE_UID) == ""

    def test_short_buffer(self):
        assert _scan_uid_tag(b"\x00", _TAG_SOP_INSTANCE_UID) == ""


# ---------------------------------------------------------------------------
# dicomweb_stow_studies — main handler (content-type validation)
# ---------------------------------------------------------------------------


class TestDicomwebStowStudies:

    @pytest.mark.asyncio
    async def test_routes_to_streaming_for_small_uploads(self):
        from dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow import (
            dicomweb_stow_studies,
        )

        request = MagicMock()
        request.headers = {
            "content-type": "multipart/related; boundary=---abc",
            "content-length": "1024",
        }
        request.cookies = {}

        mock_streaming = AsyncMock()
        mock_streaming.return_value = MagicMock()

        with patch.dict(
            "os.environ",
            {"DATABRICKS_STOW_VOLUME_PATH": "/Volumes/cat/sch/vol"},
        ):
            with patch(
                "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._resolve_stow_targets",
                return_value=("cat.sch.stow_operations", "cat.sch.table"),
            ):
                with patch(
                    "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow.resolve_user_token",
                    return_value="tok",
                ):
                    with patch(
                        "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._handle_streaming",
                        mock_streaming,
                    ) as mock_handle:
                        await dicomweb_stow_studies(request)

        mock_streaming.assert_called_once()

    @pytest.mark.asyncio
    async def test_routes_to_legacy_for_large_uploads(self):
        from dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow import (
            _STOW_STREAMING_MAX_BYTES,
            dicomweb_stow_studies,
        )

        request = MagicMock()
        large_size = _STOW_STREAMING_MAX_BYTES + 1
        request.headers = {
            "content-type": "multipart/related; boundary=---abc",
            "content-length": str(large_size),
        }
        request.cookies = {}

        mock_legacy = AsyncMock()
        mock_legacy.return_value = MagicMock()

        with patch.dict(
            "os.environ",
            {"DATABRICKS_STOW_VOLUME_PATH": "/Volumes/cat/sch/vol"},
        ):
            with patch(
                "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._resolve_stow_targets",
                return_value=("cat.sch.stow_operations", "cat.sch.table"),
            ):
                with patch(
                    "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow.resolve_user_token",
                    return_value="tok",
                ):
                    with patch(
                        "dbx.pixels.resources.dicom_web_gateway.utils.handlers._stow._handle_legacy_spark",
                        mock_legacy,
                    ):
                        await dicomweb_stow_studies(request)

        mock_legacy.assert_called_once()
