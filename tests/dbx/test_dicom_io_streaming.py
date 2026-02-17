"""
Unit tests for the streaming BOT computation components in dicom_io.

Tests cover:
- BufferedStreamReader (read_exact, skip, position tracking)
- _find_data_start (locating first data Item after BOT)
- _find_pixel_data_pos (robust pixel data tag detection with nested tags)
- _extract_from_extended_offset_table (EOT-based frame ranges)
- _compute_bot_via_stream (via mocked HTTP responses)
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
# --------------------------------------------------------------------------

import struct
from io import BytesIO
from unittest.mock import MagicMock, patch

import pydicom
import pytest

from dbx.pixels.resources.dicom_web.utils.dicom_io import (
    BufferedStreamReader,
    _ITEM_TAG,
    _PIXEL_DATA_MARKER,
    _SEQ_DELIM_TAG,
    _extract_from_extended_offset_table,
    _find_data_start,
    _find_pixel_data_pos,
    _pixel_data_header_size,
    _uncompressed_frame_length,
)


# ---------------------------------------------------------------------------
# Helpers to build synthetic DICOM byte sequences
# ---------------------------------------------------------------------------

def _make_item(data: bytes) -> bytes:
    """Build a DICOM Item element: tag (4) + length (4) + data."""
    return _ITEM_TAG + struct.pack("<I", len(data)) + data


def _make_seq_delim() -> bytes:
    """Build a Sequence Delimitation Item: tag (4) + zero length (4)."""
    return _SEQ_DELIM_TAG + b"\x00\x00\x00\x00"


def _make_encapsulated_pixel_data(
    frames: list[bytes],
    bot_offsets: list[int] | None = None,
) -> tuple[bytes, int]:
    """
    Build a minimal encapsulated pixel data element.

    Returns (raw_bytes, pixel_data_pos) where pixel_data_pos is the
    position of the Pixel Data tag in the returned bytes.

    The returned bytes include some fake DICOM preamble + metadata
    so that pixel_data_pos > 0 (more realistic than starting at 0).
    """
    preamble = b"\x00" * 128 + b"DICM"  # 132 bytes

    # Pixel Data tag (7FE0,0010) in little-endian + explicit VR OB
    pixel_data_tag = b"\xe0\x7f\x10\x00"  # tag
    vr_and_length = b"OB\x00\x00\xff\xff\xff\xff"  # VR(2) + reserved(2) + FFFFFFFF(4)

    # BOT Item
    if bot_offsets:
        bot_data = b"".join(struct.pack("<I", o) for o in bot_offsets)
    else:
        bot_data = b""
    bot_item = _make_item(bot_data)

    # Data Items (one per frame)
    data_items = b"".join(_make_item(f) for f in frames)

    seq_delim = _make_seq_delim()

    raw = preamble + pixel_data_tag + vr_and_length + bot_item + data_items + seq_delim
    pixel_data_pos = len(preamble)

    return raw, pixel_data_pos


# ---------------------------------------------------------------------------
# BufferedStreamReader tests
# ---------------------------------------------------------------------------

class TestBufferedStreamReader:

    @staticmethod
    def _make_reader(data: bytes, chunk_size: int = 10, start_pos: int = 0):
        """Create a BufferedStreamReader from in-memory bytes."""
        response = MagicMock()
        response.iter_content.return_value = iter(
            [data[i : i + chunk_size] for i in range(0, len(data), chunk_size)]
        )
        return BufferedStreamReader(response, chunk_size=chunk_size, start_position=start_pos)

    def test_read_exact_basic(self):
        reader = self._make_reader(b"Hello, World!", chunk_size=5)
        assert reader.read_exact(5) == b"Hello"
        assert reader.read_exact(2) == b", "
        assert reader.read_exact(6) == b"World!"
        assert reader.position == 13

    def test_read_exact_across_chunks(self):
        reader = self._make_reader(b"ABCDEFGHIJ", chunk_size=3)
        result = reader.read_exact(7)
        assert result == b"ABCDEFG"
        assert reader.position == 7

    def test_read_exact_eof(self):
        reader = self._make_reader(b"short")
        with pytest.raises(EOFError):
            reader.read_exact(10)

    def test_skip_basic(self):
        reader = self._make_reader(b"ABCDEFGHIJ", chunk_size=4)
        reader.skip(3)
        assert reader.position == 3
        assert reader.read_exact(2) == b"DE"
        assert reader.position == 5

    def test_skip_across_chunks(self):
        reader = self._make_reader(b"A" * 100, chunk_size=7)
        reader.skip(50)
        assert reader.position == 50
        assert reader.read_exact(5) == b"AAAAA"
        assert reader.position == 55

    def test_skip_eof(self):
        reader = self._make_reader(b"short")
        with pytest.raises(EOFError):
            reader.skip(10)

    def test_position_tracking_with_start_offset(self):
        reader = self._make_reader(b"data", chunk_size=2, start_pos=1000)
        assert reader.position == 1000
        reader.read_exact(2)
        assert reader.position == 1002
        reader.skip(1)
        assert reader.position == 1003

    def test_interleaved_read_and_skip(self):
        data = b"AABBCCDDEE"
        reader = self._make_reader(data, chunk_size=3)
        assert reader.read_exact(2) == b"AA"
        reader.skip(2)
        assert reader.read_exact(2) == b"CC"
        reader.skip(2)
        assert reader.read_exact(2) == b"EE"
        assert reader.position == 10


# ---------------------------------------------------------------------------
# _find_data_start tests
# ---------------------------------------------------------------------------

class TestFindDataStart:

    def test_empty_bot(self):
        raw, pixel_data_pos = _make_encapsulated_pixel_data(
            frames=[b"frame0"],
            bot_offsets=None,
        )
        data_start = _find_data_start(raw, pixel_data_pos)
        # data_start should point to the first data Item (frame 0)
        assert raw[data_start : data_start + 4] == _ITEM_TAG

    def test_nonempty_bot(self):
        raw, pixel_data_pos = _make_encapsulated_pixel_data(
            frames=[b"frame0", b"frame1"],
            bot_offsets=[0, 14],  # 8 (Item header) + 6 (frame0 data)
        )
        data_start = _find_data_start(raw, pixel_data_pos)
        assert raw[data_start : data_start + 4] == _ITEM_TAG

    def test_insufficient_header(self):
        with pytest.raises(ValueError):
            _find_data_start(b"too short", 0)


# ---------------------------------------------------------------------------
# _extract_from_extended_offset_table tests
# ---------------------------------------------------------------------------

class TestExtendedOffsetTable:

    def test_no_eot_returns_none(self):
        ds = MagicMock(spec=[])
        ds.ExtendedOffsetTable = None
        result = _extract_from_extended_offset_table(ds, b"", 0, 1)
        assert result is None

    def test_missing_lengths_returns_none(self):
        ds = MagicMock()
        ds.ExtendedOffsetTable = struct.pack("<Q", 0)
        ds.ExtendedOffsetTableLengths = None
        result = _extract_from_extended_offset_table(ds, b"", 0, 1)
        assert result is None

    def test_valid_eot_single_frame(self):
        frame_data = b"X" * 500
        raw, pixel_data_pos = _make_encapsulated_pixel_data(
            frames=[frame_data],
        )
        data_start = _find_data_start(raw, pixel_data_pos)

        ds = MagicMock()
        ds.ExtendedOffsetTable = struct.pack("<Q", 0)
        ds.ExtendedOffsetTableLengths = struct.pack("<Q", 500)

        frames = _extract_from_extended_offset_table(
            ds, raw, pixel_data_pos, number_of_frames=1,
        )
        assert frames is not None
        assert len(frames) == 1
        assert frames[0]["frame_number"] == 0
        assert frames[0]["frame_size"] == 500
        assert frames[0]["start_pos"] == data_start + 8  # after Item header
        assert frames[0]["end_pos"] == data_start + 8 + 500 - 1

    def test_valid_eot_multiple_frames(self):
        f0 = b"A" * 100
        f1 = b"B" * 200
        f2 = b"C" * 300
        raw, pixel_data_pos = _make_encapsulated_pixel_data(
            frames=[f0, f1, f2],
        )
        data_start = _find_data_start(raw, pixel_data_pos)

        # Offsets: frame 0 at 0, frame 1 at 8+100=108, frame 2 at 108+8+200=316
        offsets = [0, 108, 316]
        lengths = [100, 200, 300]

        ds = MagicMock()
        ds.ExtendedOffsetTable = struct.pack(f"<{len(offsets)}Q", *offsets)
        ds.ExtendedOffsetTableLengths = struct.pack(f"<{len(lengths)}Q", *lengths)

        frames = _extract_from_extended_offset_table(
            ds, raw, pixel_data_pos, number_of_frames=3,
        )
        assert frames is not None
        assert len(frames) == 3
        for i, (off, length) in enumerate(zip(offsets, lengths)):
            assert frames[i]["frame_number"] == i
            assert frames[i]["frame_size"] == length
            assert frames[i]["start_pos"] == data_start + off + 8

    def test_size_mismatch_returns_none(self):
        ds = MagicMock()
        ds.ExtendedOffsetTable = struct.pack("<Q", 0)
        ds.ExtendedOffsetTableLengths = struct.pack("<2Q", 0, 0)

        raw, pixel_data_pos = _make_encapsulated_pixel_data(frames=[b"x"])
        result = _extract_from_extended_offset_table(
            ds, raw, pixel_data_pos, number_of_frames=1,
        )
        assert result is None


# ---------------------------------------------------------------------------
# Streaming BOT scan integration test (with mocked HTTP)
# ---------------------------------------------------------------------------

class TestComputeBotViaStream:
    """Tests the streaming scanner using mocked HTTP responses."""

    def test_basic_streaming_scan(self):
        """Verify the streaming scanner correctly identifies frame positions."""
        from dbx.pixels.resources.dicom_web.utils.dicom_io import _compute_bot_via_stream

        f0 = b"A" * 100
        f1 = b"B" * 200
        f2 = b"C" * 50
        raw, pixel_data_pos = _make_encapsulated_pixel_data(
            frames=[f0, f1, f2],
        )
        data_start = _find_data_start(raw, pixel_data_pos)

        # The data after data_start (frame Items + seq delim)
        stream_data = raw[data_start:]

        mock_response = MagicMock()
        mock_response.status_code = 206
        mock_response.iter_content.return_value = iter([stream_data])

        db_file = MagicMock()
        db_file.to_api_url.return_value = "https://example.com/file.dcm"
        db_file.file_path = "/test/file.dcm"

        with patch(
            "dbx.pixels.resources.dicom_web.utils.dicom_io._session"
        ) as mock_session:
            mock_session.get.return_value = mock_response

            frames, captured = _compute_bot_via_stream(
                token="test-token",
                db_file=db_file,
                pixel_data_pos=pixel_data_pos,
                number_of_frames=3,
                header_raw=raw,
            )

        assert len(frames) == 3
        assert frames[0]["frame_size"] == 100
        assert frames[1]["frame_size"] == 200
        assert frames[2]["frame_size"] == 50

        # Positions should be relative to the real file
        assert frames[0]["start_pos"] == data_start + 8
        assert frames[1]["start_pos"] == data_start + 8 + 100 + 8
        assert frames[2]["start_pos"] == data_start + 8 + 100 + 8 + 200 + 8

    def test_streaming_scan_with_capture(self):
        """Verify inline frame capture during streaming scan."""
        from dbx.pixels.resources.dicom_web.utils.dicom_io import _compute_bot_via_stream

        f0 = b"A" * 50
        f1 = b"B" * 75
        raw, pixel_data_pos = _make_encapsulated_pixel_data(
            frames=[f0, f1],
        )
        data_start = _find_data_start(raw, pixel_data_pos)
        stream_data = raw[data_start:]

        mock_response = MagicMock()
        mock_response.status_code = 206
        mock_response.iter_content.return_value = iter([stream_data])

        db_file = MagicMock()
        db_file.to_api_url.return_value = "https://example.com/file.dcm"
        db_file.file_path = "/test/file.dcm"

        with patch(
            "dbx.pixels.resources.dicom_web.utils.dicom_io._session"
        ) as mock_session:
            mock_session.get.return_value = mock_response

            frames, captured = _compute_bot_via_stream(
                token="test-token",
                db_file=db_file,
                pixel_data_pos=pixel_data_pos,
                number_of_frames=2,
                header_raw=raw,
                capture_frames={0, 1},
            )

        assert len(frames) == 2
        assert len(captured) == 2
        assert captured[0] == f0
        assert captured[1] == f1


# ---------------------------------------------------------------------------
# _find_pixel_data_pos tests — robust detection of the top-level (7FE0,0010)
# ---------------------------------------------------------------------------

class TestFindPixelDataPos:
    """
    Verify that ``_find_pixel_data_pos`` correctly identifies the
    **top-level** Pixel Data tag even when earlier (nested) occurrences
    of the same byte pattern exist in the file.

    The bug this guards against: some DICOM files contain a
    ``(7FE0,0010)`` tag inside a sequence (e.g. Icon Image Sequence
    or overlay data).  A naïve ``bytes.find()`` returns the nested
    occurrence, which shifts every downstream frame offset calculation.
    """

    # -- helpers -----------------------------------------------------------

    @staticmethod
    def _build_dicom_with_icon(
        pixel_data: bytes,
        icon_data: bytes = b"\x01\x02\x03\x04",
    ) -> bytes:
        """
        Build a minimal DICOM file that contains **two** (7FE0,0010) tags:
        one nested inside an Icon Image Sequence and one at the top level.
        """
        from pydicom.dataset import Dataset, FileMetaDataset
        from pydicom.uid import ExplicitVRLittleEndian
        from pydicom.sequence import Sequence

        file_meta = FileMetaDataset()
        file_meta.MediaStorageSOPClassUID = "1.2.840.10008.5.1.4.1.1.2"
        file_meta.MediaStorageSOPInstanceUID = pydicom.uid.generate_uid()
        file_meta.TransferSyntaxUID = ExplicitVRLittleEndian

        ds = Dataset()
        ds.file_meta = file_meta
        ds.is_little_endian = True
        ds.is_implicit_VR = False
        ds.PatientName = "Test^Patient"
        ds.PatientID = "TEST001"
        ds.Rows = 4
        ds.Columns = 4
        ds.BitsAllocated = 16
        ds.BitsStored = 12
        ds.HighBit = 11
        ds.SamplesPerPixel = 1
        ds.PhotometricInterpretation = "MONOCHROME2"
        ds.PixelRepresentation = 0
        ds.NumberOfFrames = 1

        icon_ds = Dataset()
        icon_ds.Rows = 2
        icon_ds.Columns = 2
        icon_ds.BitsAllocated = 8
        icon_ds.BitsStored = 8
        icon_ds.HighBit = 7
        icon_ds.SamplesPerPixel = 1
        icon_ds.PhotometricInterpretation = "MONOCHROME2"
        icon_ds.PixelRepresentation = 0
        icon_ds.PixelData = icon_data

        ds.IconImageSequence = Sequence([icon_ds])
        ds.PixelData = pixel_data

        buf = BytesIO()
        pydicom.dcmwrite(buf, ds)
        return buf.getvalue()

    @staticmethod
    def _count_markers(raw: bytes) -> list[int]:
        """Return all positions of _PIXEL_DATA_MARKER in *raw*."""
        positions: list[int] = []
        search = 0
        while True:
            pos = raw.find(_PIXEL_DATA_MARKER, search)
            if pos == -1:
                break
            positions.append(pos)
            search = pos + 4
        return positions

    # -- tests against pydicom built-in test files -------------------------

    def test_single_tag_pydicom_ct_small(self):
        """CT_small.dcm has one (7FE0,0010) — should return it directly."""
        fpath = pydicom.data.get_testdata_file("CT_small.dcm")
        with open(fpath, "rb") as f:
            raw = f.read()

        positions = self._count_markers(raw)
        assert len(positions) == 1

        result = _find_pixel_data_pos(raw)
        assert result == positions[0]

    def test_single_tag_pydicom_mr_small(self):
        """MR_small.dcm has one (7FE0,0010) — fast-path returns it."""
        fpath = pydicom.data.get_testdata_file("MR_small.dcm")
        with open(fpath, "rb") as f:
            raw = f.read()

        positions = self._count_markers(raw)
        assert len(positions) == 1

        result = _find_pixel_data_pos(raw)
        assert result == positions[0]

    def test_multi_tag_pydicom_siemens_overlays(self):
        """
        MR-SIEMENS-DICOM-WithOverlays.dcm contains TWO (7FE0,0010) tags:
        one nested (overlay data, 4 096 bytes) and one top-level (pixel
        data, 468 512 bytes).  The robust finder must skip the nested tag.
        """
        fpath = pydicom.data.get_testdata_file(
            "MR-SIEMENS-DICOM-WithOverlays.dcm",
        )
        with open(fpath, "rb") as f:
            raw = f.read()

        positions = self._count_markers(raw)
        assert len(positions) == 2, (
            f"Expected 2 Pixel Data tags, got {len(positions)}"
        )

        result = _find_pixel_data_pos(raw)

        # Must NOT return the first (nested) tag.
        assert result != positions[0], (
            f"Returned nested tag at {positions[0]} instead of "
            f"top-level tag at {positions[1]}"
        )
        # Must return the second (top-level) tag.
        assert result == positions[1]

    def test_multi_tag_siemens_pixel_data_matches_pydicom(self):
        """
        End-to-end check: reading pixel bytes from the offset returned
        by ``_find_pixel_data_pos`` must match ``pydicom.pixel_array``.
        """
        fpath = pydicom.data.get_testdata_file(
            "MR-SIEMENS-DICOM-WithOverlays.dcm",
        )
        with open(fpath, "rb") as f:
            raw = f.read()

        ds = pydicom.dcmread(BytesIO(raw), stop_before_pixels=True)
        pixel_data_pos = _find_pixel_data_pos(raw)

        # Uncompressed explicit VR: tag(4) + VR(2) + reserved(2) + len(4) = 12
        frame_size = ds.Rows * ds.Columns * (ds.BitsAllocated // 8)
        data_start = pixel_data_pos + 12

        our_pixels = raw[data_start : data_start + frame_size]

        ds_full = pydicom.dcmread(fpath)
        expected_pixels = ds_full.pixel_array.tobytes()

        assert our_pixels == expected_pixels, (
            f"Pixel data mismatch: first 16 bytes "
            f"ours={our_pixels[:16].hex()} vs "
            f"pydicom={expected_pixels[:16].hex()}"
        )

    def test_multi_tag_siemens_naive_find_is_wrong(self):
        """
        Confirm the old ``bytes.find()`` approach gives the wrong offset
        for this file, proving the fix is necessary.
        """
        fpath = pydicom.data.get_testdata_file(
            "MR-SIEMENS-DICOM-WithOverlays.dcm",
        )
        with open(fpath, "rb") as f:
            raw = f.read()

        naive_pos = raw.find(_PIXEL_DATA_MARKER)
        robust_pos = _find_pixel_data_pos(raw)

        assert naive_pos != robust_pos, (
            "Naive find should disagree with robust find for this file"
        )
        assert naive_pos < robust_pos, (
            "Naive find returns the earlier (nested) tag"
        )


    # -- tests with synthetic DICOM bytes ----------------------------------

    def test_synthetic_dual_tag(self):
        """Synthetic DICOM with Icon Image Sequence (two pixel data tags)."""
        pixel_data = b"\xAA" * 32  # 4x4 16-bit
        raw = self._build_dicom_with_icon(pixel_data, icon_data=b"\xFF" * 4)

        positions = self._count_markers(raw)
        assert len(positions) == 2, (
            f"Expected 2 markers in synthetic file, got {len(positions)}"
        )

        result = _find_pixel_data_pos(raw)
        assert result == positions[-1]

    def test_no_marker_returns_negative_one(self):
        """When no (7FE0,0010) exists, return -1."""
        assert _find_pixel_data_pos(b"\x00" * 256) == -1

    def test_single_marker_returns_position(self):
        """A buffer with exactly one marker returns its offset."""
        prefix = b"\x00" * 100
        raw = prefix + _PIXEL_DATA_MARKER + b"\xff\xff\xff\xff"
        assert _find_pixel_data_pos(raw) == 100

    def test_header_only_download_64kb(self):
        """
        Simulate a 64 KB header download of the Siemens file.  Both
        tags should be within the first 64 KB.
        """
        fpath = pydicom.data.get_testdata_file(
            "MR-SIEMENS-DICOM-WithOverlays.dcm",
        )
        with open(fpath, "rb") as f:
            raw = f.read()

        header_64k = raw[: 64 * 1024]
        positions = self._count_markers(header_64k)
        assert len(positions) == 2

        result = _find_pixel_data_pos(header_64k)
        assert result == positions[-1]

    # -- regression: standard pydicom files unchanged ----------------------

    @pytest.mark.parametrize(
        "filename",
        [
            "CT_small.dcm",
            "MR_small.dcm",
            "MR_small_RLE.dcm",
            "JPEG2000.dcm",
            "JPEG-lossy.dcm",
            "SC_rgb.dcm",
            "rtdose.dcm",
        ],
    )
    def test_single_tag_regression(self, filename):
        """
        For standard single-tag pydicom test files, ``_find_pixel_data_pos``
        must return the same offset as a naïve ``find()``.
        """
        try:
            fpath = pydicom.data.get_testdata_file(filename)
        except FileNotFoundError:
            pytest.skip(f"{filename} not available")

        with open(fpath, "rb") as f:
            raw = f.read()

        naive = raw.find(_PIXEL_DATA_MARKER)
        robust = _find_pixel_data_pos(raw)
        assert robust == naive, (
            f"{filename}: robust={robust} != naive={naive}"
        )


# ---------------------------------------------------------------------------
# _pixel_data_header_size / _uncompressed_frame_length tests
# ---------------------------------------------------------------------------

class TestUncompressedFrameHelpers:
    """
    Verify that ``_pixel_data_header_size`` and ``_uncompressed_frame_length``
    correctly handle:

    * **Implicit VR** files (header = 8 bytes, not 12)
    * **Colour images** with ``SamplesPerPixel > 1`` (e.g. RGB)
    """

    @staticmethod
    def _verify_frame_data(filename: str):
        """
        End-to-end check: use the two helpers to locate the first frame
        and compare the bytes with pydicom's ``pixel_array.tobytes()``.
        """
        fpath = pydicom.data.get_testdata_file(filename)
        with open(fpath, "rb") as f:
            raw = f.read()

        ds = pydicom.dcmread(BytesIO(raw), stop_before_pixels=True)
        if ds.file_meta.TransferSyntaxUID.is_compressed:
            pytest.skip(f"{filename} is compressed")

        pdp = _find_pixel_data_pos(raw)
        header = _pixel_data_header_size(raw, pdp)
        frame_len = _uncompressed_frame_length(ds)

        our_pixels = raw[pdp + header : pdp + header + frame_len]

        ds_full = pydicom.dcmread(fpath)
        expected = ds_full.pixel_array.tobytes()

        assert our_pixels == expected, (
            f"{filename}: first 16 bytes: ours={our_pixels[:16].hex()} "
            f"expected={expected[:16].hex()}"
        )
        return header, frame_len

    def test_implicit_vr_header_is_8(self):
        """MR_small_implicit.dcm uses Implicit VR — header must be 8."""
        header, _ = self._verify_frame_data("MR_small_implicit.dcm")
        assert header == 8

    def test_explicit_vr_header_is_12(self):
        """CT_small.dcm uses Explicit VR — header must be 12."""
        header, _ = self._verify_frame_data("CT_small.dcm")
        assert header == 12

    def test_rgb_samples_per_pixel(self):
        """SC_rgb.dcm has SamplesPerPixel=3 — frame length must include it."""
        fpath = pydicom.data.get_testdata_file("SC_rgb.dcm")
        ds = pydicom.dcmread(fpath, stop_before_pixels=True)

        spp = int(getattr(ds, "SamplesPerPixel", 1))
        assert spp == 3, f"Expected SamplesPerPixel=3, got {spp}"

        frame_len = _uncompressed_frame_length(ds)
        expected = ds.Rows * ds.Columns * (ds.BitsAllocated // 8) * spp
        assert frame_len == expected

    def test_rgb_pixel_data_matches_pydicom(self):
        """End-to-end: RGB pixel data from our offset matches pydicom."""
        self._verify_frame_data("SC_rgb.dcm")

    @pytest.mark.parametrize(
        "filename",
        [
            "CT_small.dcm",
            "MR_small.dcm",
            "MR_small_implicit.dcm",
            "SC_rgb.dcm",
        ],
    )
    def test_frame_data_matches_pydicom(self, filename):
        """Parametrized end-to-end pixel data comparison."""
        self._verify_frame_data(filename)
