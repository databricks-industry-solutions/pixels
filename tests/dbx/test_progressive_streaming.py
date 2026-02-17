"""
Unit tests for the progressive file streamer components.

Tests cover:
- BufferedStreamReader tee_file support
- _CaptureSlot basic behaviour
- _FileStreamState publish / wait / register_capture
- Concurrent waiters on _FileStreamState
- ProgressiveFileStreamer stream lifecycle (mocked HTTP)
- get_file_part_local (local disk cache reads)
"""

import os
import struct
import tempfile
import threading
import time
from io import BytesIO
from unittest.mock import MagicMock, patch

import pytest

from dbx.pixels.resources.dicom_web.utils.dicom_io import (
    BufferedStreamReader,
    ProgressiveFileStreamer,
    _CaptureSlot,
    _FileStreamState,
    _ITEM_TAG,
    _SEQ_DELIM_TAG,
    _find_bot_item,
    get_file_part_local,
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_item(data: bytes) -> bytes:
    """Build a DICOM Item element: tag (4) + length (4) + data."""
    return _ITEM_TAG + struct.pack("<I", len(data)) + data


def _make_seq_delim() -> bytes:
    return _SEQ_DELIM_TAG + b"\x00\x00\x00\x00"


def _make_encapsulated_pixel_data(
    frames: list[bytes],
    bot_offsets: list[int] | None = None,
) -> tuple[bytes, int]:
    """Build minimal encapsulated pixel data and return (raw, pixel_data_pos)."""
    preamble = b"\x00" * 128 + b"DICM"
    pixel_data_tag = b"\xe0\x7f\x10\x00"
    vr_and_length = b"OB\x00\x00\xff\xff\xff\xff"

    if bot_offsets:
        bot_data = b"".join(struct.pack("<I", o) for o in bot_offsets)
    else:
        bot_data = b""
    bot_item = _make_item(bot_data)

    data_items = b"".join(_make_item(f) for f in frames)
    seq_delim = _make_seq_delim()

    raw = preamble + pixel_data_tag + vr_and_length + bot_item + data_items + seq_delim
    pixel_data_pos = len(preamble)
    return raw, pixel_data_pos


def _make_mock_reader(data: bytes, chunk_size: int = 10, start_pos: int = 0, tee_file=None):
    """Create a BufferedStreamReader backed by in-memory bytes."""
    response = MagicMock()
    response.iter_content.return_value = iter(
        [data[i : i + chunk_size] for i in range(0, len(data), chunk_size)]
    )
    return BufferedStreamReader(
        response, chunk_size=chunk_size, start_position=start_pos, tee_file=tee_file,
    )


# ---------------------------------------------------------------------------
# BufferedStreamReader tee_file tests
# ---------------------------------------------------------------------------

class TestBufferedStreamReaderTeeFile:

    def test_read_exact_tees_to_file(self):
        data = b"Hello, World!"
        buf = BytesIO()
        reader = _make_mock_reader(data, chunk_size=5, tee_file=buf)

        result = reader.read_exact(13)
        assert result == data
        assert buf.getvalue() == data

    def test_skip_tees_to_file(self):
        data = b"ABCDEFGHIJ"
        buf = BytesIO()
        reader = _make_mock_reader(data, chunk_size=4, tee_file=buf)

        reader.skip(10)
        assert buf.getvalue() == data

    def test_interleaved_read_and_skip_tee(self):
        data = b"AABBCCDDEE"
        buf = BytesIO()
        reader = _make_mock_reader(data, chunk_size=3, tee_file=buf)

        reader.read_exact(2)
        reader.skip(2)
        reader.read_exact(2)
        reader.skip(2)
        reader.read_exact(2)

        assert buf.getvalue() == data
        assert reader.position == 10

    def test_no_tee_file_works_normally(self):
        data = b"test data"
        reader = _make_mock_reader(data, chunk_size=4, tee_file=None)
        result = reader.read_exact(9)
        assert result == data

    def test_skip_within_buffer_tees(self):
        data = b"ABCDEF"
        buf = BytesIO()
        reader = _make_mock_reader(data, chunk_size=6, tee_file=buf)

        reader.read_exact(2)  # reads AB
        reader.skip(2)  # skips CD (from buffer)
        reader.read_exact(2)  # reads EF

        assert buf.getvalue() == data


# ---------------------------------------------------------------------------
# _CaptureSlot tests
# ---------------------------------------------------------------------------

class TestCaptureSlot:

    def test_initial_state(self):
        slot = _CaptureSlot()
        assert slot.data is None
        assert not slot.ready.is_set()

    def test_fill_slot(self):
        slot = _CaptureSlot()
        slot.data = b"frame data"
        slot.ready.set()
        assert slot.ready.is_set()
        assert slot.data == b"frame data"


# ---------------------------------------------------------------------------
# _FileStreamState tests
# ---------------------------------------------------------------------------

class TestFileStreamState:

    def test_publish_and_wait_for_frame(self):
        state = _FileStreamState("/tmp/test.pixeldata", data_start=1000)

        meta = {"frame_number": 0, "frame_size": 100, "start_pos": 1000, "end_pos": 1099}
        state.publish_frame(0, meta)

        result = state.wait_for_frame(0, timeout=1.0)
        assert result == meta

    def test_wait_for_frame_blocks_then_unblocks(self):
        state = _FileStreamState("/tmp/test.pixeldata", data_start=1000)
        results = {}

        def waiter():
            results["frame"] = state.wait_for_frame(0, timeout=5.0)
            results["time"] = time.monotonic()

        t_start = time.monotonic()
        t = threading.Thread(target=waiter)
        t.start()

        time.sleep(0.1)
        meta = {"frame_number": 0, "frame_size": 50}
        state.publish_frame(0, meta)
        t.join(timeout=5.0)

        assert results["frame"] == meta
        assert results["time"] - t_start >= 0.05  # waited at least a bit

    def test_wait_for_nonexistent_frame_returns_none(self):
        state = _FileStreamState("/tmp/test.pixeldata", data_start=1000)
        state.publish_frame(0, {"frame_number": 0})
        state.mark_complete()

        result = state.wait_for_frame(5, timeout=1.0)
        assert result is None

    def test_wait_for_frame_propagates_error(self):
        state = _FileStreamState("/tmp/test.pixeldata", data_start=1000)
        state.mark_complete(error=RuntimeError("stream failed"))

        with pytest.raises(RuntimeError, match="stream failed"):
            state.wait_for_frame(0, timeout=1.0)

    def test_wait_for_frame_timeout(self):
        state = _FileStreamState("/tmp/test.pixeldata", data_start=1000)

        with pytest.raises(TimeoutError):
            state.wait_for_frame(0, timeout=0.2)

    def test_register_and_capture(self):
        state = _FileStreamState("/tmp/test.pixeldata", data_start=1000)

        slot = state.register_capture(0)
        assert slot is not None

        meta = {"frame_number": 0, "frame_size": 50}
        state.publish_frame(0, meta, frame_data=b"captured!")
        assert slot.ready.is_set()
        assert slot.data == b"captured!"

    def test_register_capture_after_publish_returns_none(self):
        state = _FileStreamState("/tmp/test.pixeldata", data_start=1000)
        state.publish_frame(0, {"frame_number": 0})

        slot = state.register_capture(0)
        assert slot is None  # stream already passed this frame

    def test_register_capture_dedup(self):
        state = _FileStreamState("/tmp/test.pixeldata", data_start=1000)

        slot1 = state.register_capture(0)
        slot2 = state.register_capture(0)
        assert slot1 is slot2

    def test_concurrent_waiters(self):
        """Multiple threads waiting for different frames."""
        state = _FileStreamState("/tmp/test.pixeldata", data_start=1000)
        results = {}
        barrier = threading.Barrier(3)

        def wait_for(idx):
            barrier.wait(timeout=5)
            results[idx] = state.wait_for_frame(idx, timeout=5.0)

        threads = [threading.Thread(target=wait_for, args=(i,)) for i in range(3)]
        for t in threads:
            t.start()

        time.sleep(0.15)
        for i in range(3):
            state.publish_frame(i, {"frame_number": i, "idx": i})
            time.sleep(0.02)

        for t in threads:
            t.join(timeout=5.0)

        assert len(results) == 3
        for i in range(3):
            assert results[i]["idx"] == i

    def test_mark_complete_wakes_unfulfilled_captures(self):
        state = _FileStreamState("/tmp/test.pixeldata", data_start=1000)
        slot = state.register_capture(5)
        assert slot is not None

        state.mark_complete()
        assert slot.ready.is_set()
        assert slot.data is None  # never fulfilled


# ---------------------------------------------------------------------------
# get_file_part_local tests
# ---------------------------------------------------------------------------

class TestGetFilePartLocal:

    def test_read_frame_from_local_file(self):
        frame_content = b"X" * 256
        data_start = 1000
        frame_meta = {
            "start_pos": 1008,
            "frame_size": 256,
        }

        with tempfile.NamedTemporaryFile(delete=False) as f:
            f.write(b"\x00" * 8)  # 8 bytes before frame data
            f.write(frame_content)
            f.flush()
            local_path = f.name

        try:
            result = get_file_part_local(local_path, data_start, frame_meta)
            assert result == frame_content
        finally:
            os.unlink(local_path)

    def test_read_multiple_frames(self):
        data_start = 500
        f0 = b"A" * 100
        f1 = b"B" * 200

        # Layout: [item_hdr_0(8)] [f0(100)] [item_hdr_1(8)] [f1(200)]
        pixel_data = _make_item(f0) + _make_item(f1)

        with tempfile.NamedTemporaryFile(delete=False) as f:
            f.write(pixel_data)
            f.flush()
            local_path = f.name

        try:
            meta0 = {"start_pos": data_start + 8, "frame_size": 100}
            meta1 = {"start_pos": data_start + 8 + 100 + 8, "frame_size": 200}

            result0 = get_file_part_local(local_path, data_start, meta0)
            result1 = get_file_part_local(local_path, data_start, meta1)
            assert result0 == f0
            assert result1 == f1
        finally:
            os.unlink(local_path)


# ---------------------------------------------------------------------------
# ProgressiveFileStreamer integration test (mocked HTTP)
# ---------------------------------------------------------------------------

class TestProgressiveFileStreamer:

    def test_stream_lifecycle(self):
        """Full lifecycle: start stream → wait for frames → read from local cache."""
        f0 = b"A" * 50
        f1 = b"B" * 75
        f2 = b"C" * 100
        raw, pixel_data_pos = _make_encapsulated_pixel_data(frames=[f0, f1, f2])
        bot_pos, _ = _find_bot_item(raw, pixel_data_pos)
        stream_data = raw[bot_pos:]

        mock_response = MagicMock()
        mock_response.status_code = 206
        mock_response.iter_content.return_value = iter(
            [stream_data[i : i + 32] for i in range(0, len(stream_data), 32)]
        )

        db_file = MagicMock()
        db_file.to_api_url.return_value = "https://example.com/file.dcm"
        db_file.file_path = "/test/file.dcm"
        db_file.full_path = "/test/file.dcm"

        with tempfile.TemporaryDirectory() as tmpdir:
            streamer = ProgressiveFileStreamer(cache_dir=tmpdir)

            with patch(
                "dbx.pixels.resources.dicom_web.utils.dicom_io._session"
            ) as mock_session:
                mock_session.get.return_value = mock_response

                state = streamer.get_or_start_stream(
                    filename="/test/file.dcm",
                    token="test-token",
                    db_file=db_file,
                    pixel_data_pos=pixel_data_pos,
                    number_of_frames=3,
                    header_raw=raw,
                    transfer_syntax_uid="1.2.840.10008.1.2.4.70",
                )

            # Wait for all frames
            for i in range(3):
                meta = state.wait_for_frame(i, timeout=5.0)
                assert meta is not None
                assert meta["frame_number"] == i

            # Wait for stream to complete
            deadline = time.monotonic() + 5.0
            while not state.is_complete:
                time.sleep(0.05)
                if time.monotonic() > deadline:
                    raise TimeoutError("Stream did not complete")

            assert not state.has_error
            assert len(state.frames) == 3
            assert state.frames[0]["frame_size"] == 50
            assert state.frames[1]["frame_size"] == 75
            assert state.frames[2]["frame_size"] == 100

            # Verify local cache file
            assert os.path.exists(state.local_path)
            result = get_file_part_local(
                state.local_path, state.data_start, state.frames[0],
            )
            assert result == f0

            result = get_file_part_local(
                state.local_path, state.data_start, state.frames[2],
            )
            assert result == f2

    def test_inline_capture(self):
        """Register capture before stream starts → frame data captured inline."""
        f0 = b"A" * 30
        f1 = b"B" * 40
        raw, pixel_data_pos = _make_encapsulated_pixel_data(frames=[f0, f1])
        bot_pos, _ = _find_bot_item(raw, pixel_data_pos)
        stream_data = raw[bot_pos:]

        mock_response = MagicMock()
        mock_response.status_code = 206
        mock_response.iter_content.return_value = iter([stream_data])

        db_file = MagicMock()
        db_file.to_api_url.return_value = "https://example.com/file.dcm"
        db_file.file_path = "/test/capture.dcm"
        db_file.full_path = "/test/capture.dcm"

        with tempfile.TemporaryDirectory() as tmpdir:
            streamer = ProgressiveFileStreamer(cache_dir=tmpdir)

            with patch(
                "dbx.pixels.resources.dicom_web.utils.dicom_io._session"
            ) as mock_session:
                mock_session.get.return_value = mock_response

                state = streamer.get_or_start_stream(
                    filename="/test/capture.dcm",
                    token="test-token",
                    db_file=db_file,
                    pixel_data_pos=pixel_data_pos,
                    number_of_frames=2,
                    header_raw=raw,
                    transfer_syntax_uid="1.2.840.10008.1.2.4.70",
                )

                # Register capture for frame 1 (should be registered before
                # the worker reaches it). Keep mock alive so the background
                # thread can use it.
                slot = state.register_capture(1)

                if slot is not None:
                    slot.ready.wait(timeout=5.0)
                    if slot.data is not None:
                        assert slot.data == f1

                # Either way, the frame metadata should be available
                meta = state.wait_for_frame(1, timeout=5.0)
                assert meta is not None
                assert meta["frame_size"] == 40

    def test_deduplication(self):
        """Second call to get_or_start_stream returns the same state."""
        raw, pixel_data_pos = _make_encapsulated_pixel_data(frames=[b"X" * 10])
        bot_pos, _ = _find_bot_item(raw, pixel_data_pos)
        stream_data = raw[bot_pos:]

        mock_response = MagicMock()
        mock_response.status_code = 206
        mock_response.iter_content.return_value = iter([stream_data])

        db_file = MagicMock()
        db_file.to_api_url.return_value = "https://example.com/dedup.dcm"
        db_file.file_path = "/test/dedup.dcm"
        db_file.full_path = "/test/dedup.dcm"

        with tempfile.TemporaryDirectory() as tmpdir:
            streamer = ProgressiveFileStreamer(cache_dir=tmpdir)

            with patch(
                "dbx.pixels.resources.dicom_web.utils.dicom_io._session"
            ) as mock_session:
                mock_session.get.return_value = mock_response

                state1 = streamer.get_or_start_stream(
                    filename="/test/dedup.dcm",
                    token="test-token",
                    db_file=db_file,
                    pixel_data_pos=pixel_data_pos,
                    number_of_frames=1,
                    header_raw=raw,
                    transfer_syntax_uid="1.2.840.10008.1.2.4.70",
                )

            # Second call should return the same state object
            state2 = streamer.get_or_start_stream(
                filename="/test/dedup.dcm",
                token="test-token",
                db_file=db_file,
                pixel_data_pos=pixel_data_pos,
                number_of_frames=1,
                header_raw=raw,
                transfer_syntax_uid="1.2.840.10008.1.2.4.70",
            )

            assert state1 is state2

    def test_concurrent_frame_waiters(self):
        """Multiple threads wait for different frames from the same stream."""
        frames_data = [bytes([i]) * (50 + i * 10) for i in range(5)]
        raw, pixel_data_pos = _make_encapsulated_pixel_data(frames=frames_data)
        bot_pos, _ = _find_bot_item(raw, pixel_data_pos)
        stream_data = raw[bot_pos:]

        mock_response = MagicMock()
        mock_response.status_code = 206
        mock_response.iter_content.return_value = iter(
            [stream_data[i : i + 16] for i in range(0, len(stream_data), 16)]
        )

        db_file = MagicMock()
        db_file.to_api_url.return_value = "https://example.com/concurrent.dcm"
        db_file.file_path = "/test/concurrent.dcm"
        db_file.full_path = "/test/concurrent.dcm"

        with tempfile.TemporaryDirectory() as tmpdir:
            streamer = ProgressiveFileStreamer(cache_dir=tmpdir)
            results = {}

            with patch(
                "dbx.pixels.resources.dicom_web.utils.dicom_io._session"
            ) as mock_session:
                mock_session.get.return_value = mock_response

                state = streamer.get_or_start_stream(
                    filename="/test/concurrent.dcm",
                    token="test-token",
                    db_file=db_file,
                    pixel_data_pos=pixel_data_pos,
                    number_of_frames=5,
                    header_raw=raw,
                    transfer_syntax_uid="1.2.840.10008.1.2.4.70",
                )

                def wait_for(idx):
                    meta = state.wait_for_frame(idx, timeout=5.0)
                    results[idx] = meta

                threads = [threading.Thread(target=wait_for, args=(i,)) for i in range(5)]
                for t in threads:
                    t.start()
                for t in threads:
                    t.join(timeout=10.0)

            assert len(results) == 5
            for i in range(5):
                assert results[i] is not None
                assert results[i]["frame_number"] == i
                assert results[i]["frame_size"] == len(frames_data[i])
