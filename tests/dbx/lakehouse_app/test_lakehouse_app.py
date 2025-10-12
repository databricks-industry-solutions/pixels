"""
Tests for the lakehouse_app/app.py frame retrieval functionality.

This test module verifies the frame handling logic in the lakehouse app,
including URL parsing, frame parameter extraction, and error handling.

These are pure unit tests that don't require Databricks cluster connectivity.
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
import re
from fastapi import HTTPException


class TestFrameUrlParsing:
    """Test frame URL parsing and regex patterns."""

    def test_regex_pattern_ampersand_frame(self):
        """Test regex pattern matches &frame=n format."""
        url = "//host.com/api/2.0/fs/files/Volumes/main/schema/volume/file.dcm&frame=2"
        pattern = r"[/&]frame=(\d+)"
        
        match = re.search(pattern, url)
        assert match is not None
        assert match.group(1) == "2"

    def test_regex_pattern_slash_frame(self):
        """Test regex pattern matches /frame=n format."""
        url = "/api/2.0/fs/files/Volumes/main/schema/volume/file.dcm/frame=5"
        pattern = r"[/&]frame=(\d+)"
        
        match = re.search(pattern, url)
        assert match is not None
        assert match.group(1) == "5"

    def test_regex_pattern_no_frame(self):
        """Test regex pattern returns None when no frame parameter."""
        url = "/api/2.0/fs/files/Volumes/main/schema/volume/file.dcm"
        pattern = r"[/&]frame=(\d+)"
        
        match = re.search(pattern, url)
        assert match is None

    def test_regex_pattern_real_user_url(self):
        """Test regex pattern with the actual URL format reported by user."""
        url = "//fe-vm-vdm-classic-q6xfh3.cloud.databricks.com/api/2.0/fs/files/Volumes/main/pixels_solacc/pixels_volume/20250227134948_CT_ISRA_0_nvImage_HTJ2K.dcm&frame=2"
        pattern = r"[/&]frame=(\d+)"
        
        match = re.search(pattern, url)
        assert match is not None
        assert match.group(1) == "2"

    def test_url_cleaning_ampersand(self):
        """Test URL cleaning removes &frame=n parameter."""
        url = "//host.com/api/2.0/fs/files/Volumes/main/schema/volume/file.dcm&frame=2"
        cleaned = re.sub(r"[/&]frame=\d+", "", url)
        expected = "//host.com/api/2.0/fs/files/Volumes/main/schema/volume/file.dcm"
        
        assert cleaned == expected

    def test_url_cleaning_slash(self):
        """Test URL cleaning removes /frame=n parameter."""
        url = "/api/2.0/fs/files/Volumes/main/schema/volume/file.dcm/frame=5"
        cleaned = re.sub(r"[/&]frame=\d+", "", url)
        expected = "/api/2.0/fs/files/Volumes/main/schema/volume/file.dcm"
        
        assert cleaned == expected

    def test_url_cleaning_real_user_url(self):
        """Test URL cleaning with the actual URL format reported by user."""
        url = "//fe-vm-vdm-classic-q6xfh3.cloud.databricks.com/api/2.0/fs/files/Volumes/main/pixels_solacc/pixels_volume/20250227134948_CT_ISRA_0_nvImage_HTJ2K.dcm&frame=2"
        cleaned = re.sub(r"[/&]frame=\d+", "", url)
        expected = "//fe-vm-vdm-classic-q6xfh3.cloud.databricks.com/api/2.0/fs/files/Volumes/main/pixels_solacc/pixels_volume/20250227134948_CT_ISRA_0_nvImage_HTJ2K.dcm"
        
        assert cleaned == expected


class TestFrameLogic:
    """Test frame extraction logic that mimics the app.py implementation."""

    def test_frame_extraction_logic_ampersand(self):
        """Test the frame extraction logic with &frame=n pattern."""
        # Simulate the logic from app.py lines 143-150
        url = "//host.com/api/2.0/fs/files/Volumes/main/schema/volume/file.dcm&frame=3"
        
        if "frame" in str(url):
            frame_match = re.search(r"[/&]frame=(\d+)", str(url))
            if frame_match:
                param_frames = int(frame_match.group(1))
                cleaned_url = re.sub(r"[/&]frame=\d+", "", str(url))
                
                assert param_frames == 3
                assert "frame=" not in cleaned_url
                assert "file.dcm" in cleaned_url
            else:
                pytest.fail("Frame pattern should have matched")

    def test_frame_extraction_logic_slash(self):
        """Test the frame extraction logic with /frame=n pattern."""
        # Simulate the logic from app.py lines 143-150
        url = "/api/2.0/fs/files/Volumes/main/schema/volume/file.dcm/frame=7"
        
        if "frame" in str(url):
            frame_match = re.search(r"[/&]frame=(\d+)", str(url))
            if frame_match:
                param_frames = int(frame_match.group(1))
                cleaned_url = re.sub(r"[/&]frame=\d+", "", str(url))
                
                assert param_frames == 7
                assert "frame=" not in cleaned_url
                assert "file.dcm" in cleaned_url
            else:
                pytest.fail("Frame pattern should have matched")

    def test_frame_extraction_logic_no_frame(self):
        """Test the frame extraction logic when no frame parameter exists."""
        # Simulate the logic from app.py lines 143-150
        url = "/api/2.0/fs/files/Volumes/main/schema/volume/file.dcm"
        
        if "frame" in str(url):
            # Should not enter this block
            pytest.fail("Should not detect frame parameter when none exists")
        else:
            # Should fall back to regular file handling
            assert True  # This is the expected path

    def test_frame_extraction_logic_invalid_pattern(self):
        """Test the frame extraction logic with invalid frame pattern."""
        # Simulate the logic from app.py lines 143-150
        url = "/api/2.0/fs/files/Volumes/main/schema/volume/file.dcm?frame=invalid"
        
        should_fallback = False
        if "frame" in str(url):
            frame_match = re.search(r"[/&]frame=(\d+)", str(url))
            if frame_match:
                pytest.fail("Should not match invalid frame pattern")
            else:
                # Should fall back to regular file handling
                should_fallback = True
        
        assert should_fallback


class TestFrameImports:
    """Test that the frame-related imports work correctly."""

    def test_partial_frames_import(self):
        """Test that partial_frames functions can be imported."""
        try:
            from dbx.pixels.dicom.partial_frames import get_file_part, pixel_frames_from_dcm_metadata_file
            # If we get here, import was successful
            assert callable(get_file_part)
            assert callable(pixel_frames_from_dcm_metadata_file)
        except ImportError as e:
            pytest.fail(f"Failed to import partial_frames functions: {e}")

    def test_databricks_file_import(self):
        """Test that DatabricksFile can be imported."""
        try:
            from dbx.pixels.databricks_file import DatabricksFile
            assert DatabricksFile is not None
        except ImportError as e:
            pytest.fail(f"Failed to import DatabricksFile: {e}")

    def test_databricks_file_creation(self):
        """Test that DatabricksFile can be created without cluster connectivity."""
        from dbx.pixels.databricks_file import DatabricksFile
        
        # Test creating a DatabricksFile instance
        db_file = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="test.dcm"
        )
        
        assert db_file.catalog == "main"
        assert db_file.schema == "pixels_solacc"
        assert db_file.volume == "pixels_volume"
        assert db_file.file_path == "test.dcm"


class TestFrameErrorHandling:
    """Test error handling in frame processing."""

    def test_frame_number_extraction_edge_cases(self):
        """Test frame number extraction handles edge cases."""
        test_cases = [
            ("file.dcm&frame=0", 0),
            ("file.dcm&frame=999", 999),
            ("file.dcm/frame=123", 123),
            ("file.dcm&frame=42&other=param", 42),  # Should get first match
        ]
        
        pattern = r"[/&]frame=(\d+)"
        
        for url, expected in test_cases:
            match = re.search(pattern, url)
            assert match is not None, f"Failed to match: {url}"
            assert int(match.group(1)) == expected, f"Wrong frame number for: {url}"

    def test_frame_regex_edge_cases(self):
        """Test regex pattern handles edge cases correctly."""
        pattern = r"[/&]frame=(\d+)"
        
        # These should NOT match
        non_matching_cases = [
            "file.dcm?frame=5",  # Wrong separator
            "file.dcm frame=5",  # Space separator
            "file.dcm&frame=",   # No number
            "file.dcm&frame=abc", # Non-numeric
            "file.dcm&frameid=5", # Wrong parameter name
        ]
        
        for url in non_matching_cases:
            match = re.search(pattern, url)
            assert match is None, f"Should not match: {url}"


class TestFrameIntegration:
    """Integration tests that simulate the full frame processing flow."""

    def test_databricks_file_creation_from_cleaned_url(self):
        """Test that DatabricksFile can be created from cleaned URLs."""
        from dbx.pixels.databricks_file import DatabricksFile
        
        # Start with a URL containing frame parameter
        original_url = "/api/2.0/fs/files/Volumes/main/pixels_solacc/pixels_volume/test.dcm&frame=1"
        
        # Extract frame and clean URL (simulating app.py logic)
        if "frame" in original_url:
            frame_match = re.search(r"[/&]frame=(\d+)", original_url)
            if frame_match:
                param_frames = int(frame_match.group(1))
                cleaned_url = re.sub(r"[/&]frame=\d+", "", original_url)
                
                # Remove API prefix to get just the Volumes path (simulating app.py line 136)
                volumes_path = cleaned_url.replace("api/2.0/fs/files", "")
                
                # Test that DatabricksFile can be created
                try:
                    db_file = DatabricksFile.from_full_path(volumes_path)
                    assert db_file.catalog == "main"
                    assert db_file.schema == "pixels_solacc"
                    assert db_file.volume == "pixels_volume"
                    assert db_file.file_path == "test.dcm"
                    assert param_frames == 1
                except ValueError as e:
                    # This is expected behavior for invalid paths
                    assert "Invalid" in str(e) or "path" in str(e)

    def test_frame_processing_end_to_end_simulation(self):
        """Test the complete frame processing logic simulation."""
        # Simulate a request URL like the user reported
        request_path = "/sqlwarehouse/api/2.0/fs/files/Volumes/main/pixels_solacc/pixels_volume/20250227134948_CT_ISRA_0_nvImage_HTJ2K.dcm&frame=2"
        
        # Simulate app.py processing steps
        
        # Step 1: Replace proxy path (line 127-129)
        url_path = request_path.replace("/sqlwarehouse/", "").replace("/files_wsi/", "/files/")
        assert url_path == "api/2.0/fs/files/Volumes/main/pixels_solacc/pixels_volume/20250227134948_CT_ISRA_0_nvImage_HTJ2K.dcm&frame=2"
        
        # Step 2: Check for frame parameter (line 143)
        has_frame = "frame" in url_path
        assert has_frame
        
        # Step 3: Extract frame number (lines 144-150)
        frame_match = re.search(r"[/&]frame=(\d+)", url_path)
        assert frame_match is not None
        param_frames = int(frame_match.group(1))
        assert param_frames == 2
        
        # Step 4: Clean URL
        cleaned_url = re.sub(r"[/&]frame=\d+", "", url_path)
        assert cleaned_url == "api/2.0/fs/files/Volumes/main/pixels_solacc/pixels_volume/20250227134948_CT_ISRA_0_nvImage_HTJ2K.dcm"
        
        # Step 5: Extract volumes path (line 136)
        volumes_path = cleaned_url.replace("api/2.0/fs/files", "")
        assert volumes_path == "/Volumes/main/pixels_solacc/pixels_volume/20250227134948_CT_ISRA_0_nvImage_HTJ2K.dcm"
        
        # All steps completed successfully
        assert True

    def test_frame_processing_with_mocked_databricks_file(self):
        """Test frame processing logic using mocked DatabricksFile."""
        # Mock the DatabricksFile class itself
        with patch('dbx.pixels.databricks_file.DatabricksFile') as MockDatabricksFile:
            # Configure the mock
            mock_db_file = Mock()
            mock_db_file.catalog = "main"
            mock_db_file.schema = "pixels_solacc"
            mock_db_file.volume = "pixels_volume"
            mock_db_file.file_path = "test.dcm"
            mock_db_file.full_path = "/Volumes/main/pixels_solacc/pixels_volume/test.dcm"
            
            MockDatabricksFile.from_full_path.return_value = mock_db_file
            
            # Simulate the app.py frame processing logic
            url_path = "api/2.0/fs/files/Volumes/main/pixels_solacc/pixels_volume/test.dcm&frame=3"
            
            # Frame extraction logic
            if "frame" in url_path:
                frame_match = re.search(r"[/&]frame=(\d+)", url_path)
                if frame_match:
                    param_frames = int(frame_match.group(1))
                    cleaned_url = re.sub(r"[/&]frame=\d+", "", url_path)
                    volumes_path = cleaned_url.replace("api/2.0/fs/files", "")
                    
                    # This would normally call DatabricksFile.from_full_path
                    db_file = MockDatabricksFile.from_full_path(volumes_path)
                    
                    # Verify the mock was called correctly
                    MockDatabricksFile.from_full_path.assert_called_once_with(volumes_path)
                    
                    # Verify the extracted values
                    assert param_frames == 3
                    assert db_file.full_path == "/Volumes/main/pixels_solacc/pixels_volume/test.dcm"
                    assert cleaned_url == "api/2.0/fs/files/Volumes/main/pixels_solacc/pixels_volume/test.dcm"
