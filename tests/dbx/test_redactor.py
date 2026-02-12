"""
Tests for the Redactor class and related utilities.

This test module verifies the functionality of DICOM redaction features,
including metadata redaction, frame redaction coordinates, and edge cases.

Uses pydicom's sample DICOM files for realistic testing.
"""

import copy
import hashlib
import tempfile
from unittest.mock import MagicMock, patch

import numpy as np
import pydicom
import pytest
from pydicom import examples
from pydicom.dataset import FileDataset
from pydicom.tag import Tag


@pytest.fixture
def sample_ct_dataset() -> FileDataset:
    """Load pydicom's sample CT dataset for testing."""
    return copy.deepcopy(examples.ct)


@pytest.fixture
def sample_mr_dataset() -> FileDataset:
    """Load pydicom's sample MR dataset for testing."""
    return copy.deepcopy(examples.mr)


@pytest.fixture
def sample_ct_path() -> str:
    """Get path to pydicom's sample CT file."""
    return examples.get_path("ct")


@pytest.fixture
def sample_mr_path() -> str:
    """Get path to pydicom's sample MR file."""
    return examples.get_path("mr")


class TestHandleMetadataRedaction:
    """Test metadata redaction actions."""

    def test_remove_action(self, sample_ct_dataset):
        """Test that remove action deletes the tag."""
        from dbx.pixels.dicom.redactor.utils import handle_metadata_redaction

        ds = sample_ct_dataset
        redaction_json = {
            "metadataRedactions": [{"tag": "(0010,0010)", "action": "remove"}]  # PatientName
        }

        result = handle_metadata_redaction(ds, redaction_json)

        assert Tag(0x0010, 0x0010) not in result

    def test_redact_action(self, sample_ct_dataset):
        """Test that redact action replaces value with ***."""
        from dbx.pixels.dicom.redactor.utils import handle_metadata_redaction

        ds = sample_ct_dataset
        redaction_json = {
            "metadataRedactions": [{"tag": "(0010,0010)", "action": "redact"}]  # PatientName
        }

        result = handle_metadata_redaction(ds, redaction_json)

        assert result.PatientName == "***"

    def test_modify_action_existing_tag(self, sample_ct_dataset):
        """Test that modify action changes existing tag value."""
        from dbx.pixels.dicom.redactor.utils import handle_metadata_redaction

        ds = sample_ct_dataset
        redaction_json = {
            "metadataRedactions": [
                {"tag": "(0010,0010)", "action": "modify", "newValue": "Anonymous^Patient"}
            ]
        }

        result = handle_metadata_redaction(ds, redaction_json)

        assert result.PatientName == "Anonymous^Patient"

    def test_modify_action_new_tag(self, sample_ct_dataset):
        """Test that modify action creates new tag if it doesn't exist."""
        from dbx.pixels.dicom.redactor.utils import handle_metadata_redaction

        ds = sample_ct_dataset
        # Use a tag that might not exist - remove it first to test creation
        test_tag = Tag(0x0010, 0x1001)  # OtherPatientNames
        if test_tag in ds:
            del ds[test_tag]

        redaction_json = {
            "metadataRedactions": [
                {
                    "tag": "(0010,1001)",
                    "action": "modify",
                    "newValue": "NewName",
                    "vr": "LO",
                }
            ]
        }

        result = handle_metadata_redaction(ds, redaction_json)

        assert result[test_tag].value == "NewName"

    def test_hash_action(self, sample_ct_dataset):
        """Test that hash action replaces value with SHA256 hash."""
        from dbx.pixels.dicom.redactor.utils import handle_metadata_redaction

        ds = sample_ct_dataset
        original_value = ds.PatientID
        expected_hash = hashlib.sha256(str(original_value).encode()).hexdigest()

        redaction_json = {
            "metadataRedactions": [{"tag": "(0010,0020)", "action": "hash"}]  # PatientID
        }

        result = handle_metadata_redaction(ds, redaction_json)

        assert result.PatientID == expected_hash

    def test_hash_action_non_string_value(self, sample_ct_dataset):
        """Test that hash action handles non-string values (e.g., integers)."""
        from dbx.pixels.dicom.redactor.utils import handle_metadata_redaction

        ds = sample_ct_dataset
        rows_value = ds.Rows
        expected_hash = hashlib.sha256(str(rows_value).encode()).hexdigest()

        redaction_json = {"metadataRedactions": [{"tag": "(0028,0010)", "action": "hash"}]}  # Rows

        result = handle_metadata_redaction(ds, redaction_json)

        assert result.Rows == expected_hash

    def test_invalid_action_raises(self, sample_ct_dataset):
        """Test that invalid action raises ValueError."""
        from dbx.pixels.dicom.redactor.utils import handle_metadata_redaction

        ds = sample_ct_dataset
        redaction_json = {
            "metadataRedactions": [{"tag": "(0010,0010)", "action": "invalid_action"}]
        }

        with pytest.raises(ValueError, match="Invalid action"):
            handle_metadata_redaction(ds, redaction_json)

    def test_missing_tag_skipped_for_non_modify(self, sample_ct_dataset):
        """Test that missing tags are skipped for non-modify actions."""
        from dbx.pixels.dicom.redactor.utils import handle_metadata_redaction

        ds = sample_ct_dataset
        # Use a tag that doesn't exist
        redaction_json = {
            "metadataRedactions": [{"tag": "(9999,9999)", "action": "remove"}]  # Non-existent tag
        }

        # Should not raise, just skip
        result = handle_metadata_redaction(ds, redaction_json)
        assert result is not None

    def test_empty_redactions(self, sample_ct_dataset):
        """Test that empty redactions list returns dataset unchanged."""
        from dbx.pixels.dicom.redactor.utils import handle_metadata_redaction

        ds = sample_ct_dataset
        original_name = ds.PatientName

        redaction_json = {"metadataRedactions": []}

        result = handle_metadata_redaction(ds, redaction_json)

        assert result.PatientName == original_name

    def test_no_metadata_redactions_key(self, sample_ct_dataset):
        """Test that missing metadataRedactions key returns dataset unchanged."""
        from dbx.pixels.dicom.redactor.utils import handle_metadata_redaction

        ds = sample_ct_dataset
        original_name = ds.PatientName

        redaction_json = {}

        result = handle_metadata_redaction(ds, redaction_json)

        assert result.PatientName == original_name

    def test_adds_deidentification_method_tag(self, sample_ct_dataset):
        """Test that redaction adds DeidentificationMethod tag."""
        from dbx.pixels.dicom.redactor.utils import handle_metadata_redaction

        ds = sample_ct_dataset
        redaction_json = {"metadataRedactions": [{"tag": "(0010,0010)", "action": "redact"}]}

        result = handle_metadata_redaction(ds, redaction_json)

        # Tag 00120063 is DeidentificationMethod
        assert Tag(0x0012, 0x0063) in result
        assert "PIXELS" in result[Tag(0x0012, 0x0063)].value

    def test_multiple_redactions(self, sample_ct_dataset):
        """Test applying multiple redactions in sequence."""
        from dbx.pixels.dicom.redactor.utils import handle_metadata_redaction

        ds = sample_ct_dataset
        redaction_json = {
            "metadataRedactions": [
                {"tag": "(0010,0010)", "action": "redact"},  # PatientName
                {"tag": "(0010,0020)", "action": "hash"},  # PatientID
                {"tag": "(0008,0020)", "action": "remove"},  # StudyDate
            ]
        }

        result = handle_metadata_redaction(ds, redaction_json)

        assert result.PatientName == "***"
        assert len(result.PatientID) == 64  # SHA256 hex length
        assert Tag(0x0008, 0x0020) not in result


class TestRedactFrame:
    """Test frame redaction functionality."""

    def test_redact_frame_basic(self):
        """Test basic frame redaction with valid coordinates."""
        from dbx.pixels.dicom.redactor.utils import redact_frame

        # Create a simple test frame (100x100 grayscale)
        frame = np.ones((100, 100), dtype=np.uint8) * 255

        redaction = {"imagePixelCoordinates": {"topLeft": [10, 10], "bottomRight": [50, 50]}}

        result = redact_frame(frame, redaction)

        # Check that the redacted region is black (0)
        assert np.all(result[10:50, 10:50] == 0)
        # Check that outside the region is unchanged
        assert np.all(result[0:9, 0:9] == 255)

    def test_redact_frame_float_coordinates(self):
        """Test frame redaction with float coordinates (should be converted to int)."""
        from dbx.pixels.dicom.redactor.utils import redact_frame

        frame = np.ones((100, 100), dtype=np.uint8) * 255

        redaction = {
            "imagePixelCoordinates": {"topLeft": [10.5, 10.7], "bottomRight": [50.2, 50.9]}
        }

        # Should not raise
        result = redact_frame(frame, redaction)
        assert result is not None

    def test_redact_frame_preserves_shape(self):
        """Test that redaction preserves frame shape."""
        from dbx.pixels.dicom.redactor.utils import redact_frame

        frame = np.ones((512, 512, 3), dtype=np.uint8) * 255  # RGB

        redaction = {"imagePixelCoordinates": {"topLeft": [0, 0], "bottomRight": [100, 100]}}

        result = redact_frame(frame, redaction)

        assert result.shape == frame.shape


class TestGetFrame:
    """Test frame retrieval functionality."""

    def test_get_frame_with_real_ct_file(self, sample_ct_path, sample_ct_dataset):
        """Test getting frame from real CT DICOM file."""
        from dbx.pixels.dicom.redactor.utils import get_frame

        result = get_frame(sample_ct_path, sample_ct_dataset, 0)

        # CT_small.dcm has specific dimensions
        assert result is not None
        assert len(result.shape) >= 2  # At least 2D array

    def test_get_frame_with_real_mr_file(self, sample_mr_path, sample_mr_dataset):
        """Test getting frame from real MR DICOM file."""
        from dbx.pixels.dicom.redactor.utils import get_frame

        result = get_frame(sample_mr_path, sample_mr_dataset, 0)

        assert result is not None
        assert len(result.shape) >= 2

    @patch("dbx.pixels.dicom.redactor.utils.pixel_array")
    def test_get_frame_single_frame_mock(self, mock_pixel_array):
        """Test getting frame from single-frame DICOM (mocked)."""
        from dbx.pixels.dicom.redactor.utils import get_frame

        mock_pixel_array.return_value = np.zeros((512, 512))

        ds = MagicMock()
        ds.get.return_value = 1  # Single frame

        result = get_frame("/path/to/file.dcm", ds, 0)

        mock_pixel_array.assert_called_once_with("/path/to/file.dcm")
        assert result.shape == (512, 512)

    @patch("dbx.pixels.dicom.redactor.utils.pixel_array")
    def test_get_frame_multi_frame_mock(self, mock_pixel_array):
        """Test getting frame from multi-frame DICOM (mocked)."""
        from dbx.pixels.dicom.redactor.utils import get_frame

        mock_pixel_array.return_value = np.zeros((512, 512))

        ds = MagicMock()
        ds.get.return_value = 10  # Multi-frame

        result = get_frame("/path/to/file.dcm", ds, 5)

        mock_pixel_array.assert_called_once_with("/path/to/file.dcm", index=5)
        assert result.shape == (512, 512)


class TestCleanupTempFiles:
    """Test temporary file cleanup functionality."""

    def test_cleanup_existing_files(self):
        """Test cleanup of existing temporary files."""
        from dbx.pixels.dicom.redactor.utils import _cleanup_temp_files

        # Create actual temp files
        temp_files = {}
        for i in range(3):
            with tempfile.NamedTemporaryFile(delete=False, suffix=".bin") as f:
                f.write(b"test data")
                temp_files[i] = f.name

        # Verify files exist
        import os

        for path in temp_files.values():
            assert os.path.exists(path)

        # Cleanup
        _cleanup_temp_files(temp_files)

        # Verify files are deleted
        for path in temp_files.values():
            assert not os.path.exists(path)

    def test_cleanup_nonexistent_files(self):
        """Test cleanup handles nonexistent files gracefully."""
        from dbx.pixels.dicom.redactor.utils import _cleanup_temp_files

        fragment_list = {0: "/nonexistent/path/file.bin", 1: "/another/fake/file.bin"}

        # Should not raise
        _cleanup_temp_files(fragment_list)

    def test_cleanup_empty_dict(self):
        """Test cleanup handles empty dict."""
        from dbx.pixels.dicom.redactor.utils import _cleanup_temp_files

        # Should not raise
        _cleanup_temp_files({})

    def test_cleanup_none_values(self):
        """Test cleanup handles None values in dict."""
        from dbx.pixels.dicom.redactor.utils import _cleanup_temp_files

        fragment_list = {0: None, 1: None}

        # Should not raise
        _cleanup_temp_files(fragment_list)


class TestHandleGlobalRedaction:
    """Test global redaction functionality."""

    @patch("dbx.pixels.dicom.redactor.utils.get_frame")
    @patch("dbx.pixels.dicom.redactor.utils.redact_frame")
    def test_handle_global_redaction_empty(self, mock_redact, mock_get_frame):
        """Test global redaction with no redactions returns empty dict."""
        from dbx.pixels.dicom.redactor.utils import handle_global_redaction

        ds = MagicMock()
        ds.get.return_value = 1

        redaction_json = {"globalRedactions": []}

        result = handle_global_redaction("/path/to/file.dcm", ds, redaction_json)

        assert result == {}
        mock_get_frame.assert_not_called()

    @patch("dbx.pixels.dicom.redactor.utils.get_frame")
    @patch("dbx.pixels.dicom.redactor.utils.redact_frame")
    def test_handle_global_redaction_no_key(self, mock_redact, mock_get_frame):
        """Test global redaction with missing key returns empty dict."""
        from dbx.pixels.dicom.redactor.utils import handle_global_redaction

        ds = MagicMock()
        ds.get.return_value = 1

        redaction_json = {}

        result = handle_global_redaction("/path/to/file.dcm", ds, redaction_json)

        assert result == {}


class TestHandleFrameRedaction:
    """Test frame-specific redaction functionality."""

    def test_handle_frame_redaction_empty(self):
        """Test frame redaction with no redactions returns input dict."""
        from dbx.pixels.dicom.redactor.utils import handle_frame_redaction

        ds = MagicMock()
        ds.get.return_value = 1

        redaction_json = {"frameRedactions": {}}
        fragment_list = {0: "/some/path.bin"}

        result = handle_frame_redaction(
            "/path/to/file.dcm", ds, redaction_json, np.uint8, (512, 512), fragment_list
        )

        assert result == fragment_list

    def test_handle_frame_redaction_none_fragment_list(self):
        """Test frame redaction initializes empty dict when fragment_list is None."""
        from dbx.pixels.dicom.redactor.utils import handle_frame_redaction

        ds = MagicMock()
        ds.get.return_value = 1

        redaction_json = {"frameRedactions": {}}

        result = handle_frame_redaction(
            "/path/to/file.dcm", ds, redaction_json, np.uint8, (512, 512), None
        )

        assert isinstance(result, dict)


class TestMutableDefaultArguments:
    """Test that mutable default arguments are handled correctly."""

    def test_handle_frame_redaction_default_isolation(self):
        """Test that default fragment_list is not shared between calls."""
        from dbx.pixels.dicom.redactor.utils import handle_frame_redaction

        ds = MagicMock()
        ds.get.return_value = 1
        redaction_json = {"frameRedactions": {}}

        result1 = handle_frame_redaction(
            "/path/to/file1.dcm", ds, redaction_json, np.uint8, (512, 512)
        )
        result2 = handle_frame_redaction(
            "/path/to/file2.dcm", ds, redaction_json, np.uint8, (512, 512)
        )

        # Modifying one should not affect the other
        result1[999] = "test"
        assert 999 not in result2

    def test_handle_frame_transcode_default_isolation(self):
        """Test that default fragment_list is not shared between calls."""
        # We can't easily test this without mocking more, but we verify the function signature
        import inspect

        from dbx.pixels.dicom.redactor.utils import handle_frame_transcode

        sig = inspect.signature(handle_frame_transcode)
        fragment_list_param = sig.parameters["fragment_list"]

        # Default should be None, not {}
        assert fragment_list_param.default is None

    def test_handle_frame_transcoding_default_isolation(self):
        """Test that default fragment_list parameter is None."""
        import inspect

        from dbx.pixels.dicom.redactor.utils import handle_frame_transcoding

        sig = inspect.signature(handle_frame_transcoding)
        fragment_list_param = sig.parameters["fragment_list"]

        # Default should be None, not {}
        assert fragment_list_param.default is None


class TestTypeHints:
    """Test that functions have proper type hints."""

    def test_get_frame_has_type_hints(self):
        """Test that get_frame has type hints."""
        import inspect

        from dbx.pixels.dicom.redactor.utils import get_frame

        sig = inspect.signature(get_frame)

        assert sig.parameters["file_path"].annotation == str
        assert sig.parameters["frame_index"].annotation == int

    def test_redact_frame_has_type_hints(self):
        """Test that redact_frame has type hints."""
        import inspect

        from dbx.pixels.dicom.redactor.utils import redact_frame

        sig = inspect.signature(redact_frame)

        assert sig.parameters["redaction"].annotation == dict

    def test_handle_metadata_redaction_has_type_hints(self):
        """Test that handle_metadata_redaction has type hints."""
        import inspect

        from dbx.pixels.dicom.redactor.utils import handle_metadata_redaction

        sig = inspect.signature(handle_metadata_redaction)

        assert sig.parameters["redaction_json"].annotation == dict


class TestRedactDcmFunction:
    """Test the main redact_dcm function."""

    def test_redact_dcm_has_type_hints(self):
        """Test that redact_dcm has proper type hints."""
        import inspect

        from dbx.pixels.dicom.redactor.utils import redact_dcm

        sig = inspect.signature(redact_dcm)

        assert sig.parameters["file_path"].annotation == str
        assert sig.parameters["redaction_json"].annotation == dict
        assert sig.parameters["redaction_id"].annotation == str
        assert sig.parameters["volume"].annotation == str
        assert sig.parameters["dest_base_path"].annotation == str
        assert sig.return_annotation == str


class TestEndToEndRedaction:
    """End-to-end tests using real pydicom sample files."""

    def test_metadata_redaction_on_real_ct_file(self, sample_ct_path):
        """Test metadata redaction on a real CT DICOM file."""
        from dbx.pixels.dicom.redactor.utils import handle_metadata_redaction

        ds = pydicom.dcmread(sample_ct_path)
        original_patient_name = str(ds.PatientName)

        redaction_json = {
            "metadataRedactions": [
                {"tag": "(0010,0010)", "action": "redact"},  # PatientName
            ]
        }

        result = handle_metadata_redaction(ds, redaction_json)

        assert result.PatientName == "***"
        assert str(result.PatientName) != original_patient_name

    def test_full_deidentification_on_real_file(self, sample_ct_path):
        """Test comprehensive de-identification on real DICOM file."""
        from dbx.pixels.dicom.redactor.utils import handle_metadata_redaction

        ds = pydicom.dcmread(sample_ct_path)

        # Common PHI tags to redact
        redaction_json = {
            "metadataRedactions": [
                {"tag": "(0010,0010)", "action": "redact"},  # PatientName
                {"tag": "(0010,0020)", "action": "hash"},  # PatientID
            ]
        }

        result = handle_metadata_redaction(ds, redaction_json)

        # Verify redactions applied
        assert result.PatientName == "***"
        assert len(result.PatientID) == 64  # SHA256 hash length

        # Verify deidentification method tag added
        assert Tag(0x0012, 0x0063) in result

    def test_pixel_data_preserved_after_metadata_redaction(self, sample_ct_path):
        """Test that pixel data is preserved after metadata-only redaction."""
        from dbx.pixels.dicom.redactor.utils import handle_metadata_redaction

        ds = pydicom.dcmread(sample_ct_path)
        original_rows = ds.Rows
        original_cols = ds.Columns

        redaction_json = {"metadataRedactions": [{"tag": "(0010,0010)", "action": "redact"}]}

        result = handle_metadata_redaction(ds, redaction_json)

        # Image dimensions should be unchanged
        assert result.Rows == original_rows
        assert result.Columns == original_cols
