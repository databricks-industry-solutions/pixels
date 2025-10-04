"""
Tests for the DatabricksFile class.

This test module verifies the functionality of the DatabricksFile class,
including path validation, parsing, and utility methods.
"""

import pytest

from dbx.pixels.databricks_file import DatabricksFile


class TestDatabricksFileInit:
    """Test initialization and basic properties."""

    def test_init_valid(self):
        """Test initialization with valid parameters."""
        db_file = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/images/patient001/image.dcm",
        )

        assert db_file.catalog == "main"
        assert db_file.schema == "pixels_solacc"
        assert db_file.volume == "pixels_volume"
        assert db_file.file_path == "dicom/images/patient001/image.dcm"

    def test_init_strips_whitespace(self):
        """Test that initialization strips whitespace."""
        db_file = DatabricksFile(
            catalog="  main  ",
            schema="  pixels_solacc  ",
            volume="  pixels_volume  ",
            file_path="  dicom/image.dcm  ",
        )

        assert db_file.catalog == "main"
        assert db_file.schema == "pixels_solacc"
        assert db_file.volume == "pixels_volume"
        assert db_file.file_path == "dicom/image.dcm"

    def test_init_strips_leading_trailing_slashes(self):
        """Test that file path leading/trailing slashes are stripped."""
        db_file = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="/dicom/image.dcm/",
        )

        assert db_file.file_path == "dicom/image.dcm"

    def test_init_empty_catalog_raises(self):
        """Test that empty catalog raises ValueError."""
        with pytest.raises(ValueError, match="Catalog cannot be empty"):
            DatabricksFile(
                catalog="",
                schema="pixels_solacc",
                volume="pixels_volume",
                file_path="dicom/image.dcm",
            )

    def test_init_empty_schema_raises(self):
        """Test that empty schema raises ValueError."""
        with pytest.raises(ValueError, match="Schema cannot be empty"):
            DatabricksFile(
                catalog="main", schema="", volume="pixels_volume", file_path="dicom/image.dcm"
            )

    def test_init_empty_volume_raises(self):
        """Test that empty volume raises ValueError."""
        with pytest.raises(ValueError, match="Volume cannot be empty"):
            DatabricksFile(
                catalog="main", schema="pixels_solacc", volume="", file_path="dicom/image.dcm"
            )

    def test_init_empty_file_path_raises(self):
        """Test that empty file path raises ValueError."""
        with pytest.raises(ValueError, match="File path cannot be empty"):
            DatabricksFile(
                catalog="main", schema="pixels_solacc", volume="pixels_volume", file_path=""
            )


class TestDatabricksFileFromFullPath:
    """Test creating instances from full paths."""

    def test_from_full_path_basic(self):
        """Test parsing a basic full path."""
        db_file = DatabricksFile.from_full_path(
            "/Volumes/main/pixels_solacc/pixels_volume/dicom/image.dcm"
        )

        assert db_file.catalog == "main"
        assert db_file.schema == "pixels_solacc"
        assert db_file.volume == "pixels_volume"
        assert db_file.file_path == "dicom/image.dcm"

    def test_from_full_path_with_dbfs_prefix(self):
        """Test parsing a path with dbfs: prefix."""
        db_file = DatabricksFile.from_full_path(
            "dbfs:/Volumes/main/pixels_solacc/pixels_volume/dicom/image.dcm"
        )

        assert db_file.catalog == "main"
        assert db_file.schema == "pixels_solacc"
        assert db_file.volume == "pixels_volume"
        assert db_file.file_path == "dicom/image.dcm"

    def test_from_full_path_nested_directories(self):
        """Test parsing a path with nested directories."""
        db_file = DatabricksFile.from_full_path(
            "/Volumes/main/pixels_solacc/pixels_volume/dicom/2024/01/patient001/image.dcm"
        )

        assert db_file.catalog == "main"
        assert db_file.file_path == "dicom/2024/01/patient001/image.dcm"

    def test_from_full_path_no_leading_slash(self):
        """Test parsing a path without leading slash."""
        db_file = DatabricksFile.from_full_path(
            "Volumes/main/pixels_solacc/pixels_volume/dicom/image.dcm"
        )

        assert db_file.catalog == "main"
        assert db_file.file_path == "dicom/image.dcm"

    def test_from_full_path_invalid_format_raises(self):
        """Test that invalid path format raises ValueError."""
        with pytest.raises(ValueError, match="Invalid volume path format"):
            DatabricksFile.from_full_path("/some/random/path")

    def test_from_full_path_too_short_raises(self):
        """Test that too short path raises ValueError."""
        with pytest.raises(ValueError, match="Invalid volume path format"):
            DatabricksFile.from_full_path("/Volumes/main/schema")


class TestDatabricksFileFromUrl:
    """Test creating instances from API URLs."""

    def test_from_url_basic(self):
        """Test parsing a basic API URL."""
        db_file = DatabricksFile.from_url(
            "https://myworkspace.databricks.com/api/2.0/fs/files/Volumes/main/pixels_solacc/pixels_volume/dicom/image.dcm"
        )

        assert db_file.catalog == "main"
        assert db_file.schema == "pixels_solacc"
        assert db_file.volume == "pixels_volume"
        assert db_file.file_path == "dicom/image.dcm"

    def test_from_url_invalid_format_raises(self):
        """Test that invalid URL format raises ValueError."""
        with pytest.raises(ValueError, match="Invalid Databricks Files API URL format"):
            DatabricksFile.from_url("https://myworkspace.databricks.com/some/other/path")


class TestDatabricksFileProperties:
    """Test various properties and getters."""

    def test_full_path(self):
        """Test full_path property."""
        db_file = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/image.dcm",
        )

        assert db_file.full_path == "/Volumes/main/pixels_solacc/pixels_volume/dicom/image.dcm"

    def test_dbfs_path(self):
        """Test dbfs_path property."""
        db_file = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/image.dcm",
        )

        assert db_file.dbfs_path == "dbfs:/Volumes/main/pixels_solacc/pixels_volume/dicom/image.dcm"

    def test_volume_path(self):
        """Test volume_path property."""
        db_file = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/image.dcm",
        )

        assert db_file.volume_path == "/Volumes/main/pixels_solacc/pixels_volume"

    def test_three_level_namespace(self):
        """Test three_level_namespace property."""
        db_file = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/image.dcm",
        )

        assert db_file.three_level_namespace == "main.pixels_solacc.pixels_volume"

    def test_file_name(self):
        """Test file_name property."""
        db_file = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/images/patient001/image.dcm",
        )

        assert db_file.file_name == "image.dcm"

    def test_file_name_no_directory(self):
        """Test file_name property when file is at root."""
        db_file = DatabricksFile(
            catalog="main", schema="pixels_solacc", volume="pixels_volume", file_path="image.dcm"
        )

        assert db_file.file_name == "image.dcm"

    def test_file_extension(self):
        """Test file_extension property."""
        db_file = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/image.dcm",
        )

        assert db_file.file_extension == ".dcm"

    def test_file_extension_no_extension(self):
        """Test file_extension property when file has no extension."""
        db_file = DatabricksFile(
            catalog="main", schema="pixels_solacc", volume="pixels_volume", file_path="dicom/image"
        )

        assert db_file.file_extension == ""

    def test_parent_directory(self):
        """Test parent_directory property."""
        db_file = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/images/patient001/image.dcm",
        )

        assert db_file.parent_directory == "dicom/images/patient001"

    def test_parent_directory_at_root(self):
        """Test parent_directory property when file is at root."""
        db_file = DatabricksFile(
            catalog="main", schema="pixels_solacc", volume="pixels_volume", file_path="image.dcm"
        )

        assert db_file.parent_directory == ""


class TestDatabricksFileToApiUrl:
    """Test converting to API URL."""

    def test_to_api_url_with_host_parameter(self):
        """Test to_api_url with explicit host parameter."""
        db_file = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/image.dcm",
        )

        url = db_file.to_api_url(host="myworkspace.databricks.com")
        expected = "https://myworkspace.databricks.com/api/2.0/fs/files/Volumes/main/pixels_solacc/pixels_volume/dicom/image.dcm"

        assert url == expected

    def test_to_api_url_strips_protocol_from_host(self):
        """Test that to_api_url strips protocol from host."""
        db_file = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/image.dcm",
        )

        url = db_file.to_api_url(host="https://myworkspace.databricks.com")
        expected = "https://myworkspace.databricks.com/api/2.0/fs/files/Volumes/main/pixels_solacc/pixels_volume/dicom/image.dcm"

        assert url == expected

    def test_to_api_url_with_env_variable(self, monkeypatch):
        """Test to_api_url using environment variable."""
        monkeypatch.setenv("DATABRICKS_HOST", "myworkspace.databricks.com")

        db_file = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/image.dcm",
        )

        url = db_file.to_api_url()
        expected = "https://myworkspace.databricks.com/api/2.0/fs/files/Volumes/main/pixels_solacc/pixels_volume/dicom/image.dcm"

        assert url == expected

    def test_to_api_url_no_host_raises(self, monkeypatch):
        """Test that to_api_url without host raises ValueError."""
        # Remove the env variable if it exists
        monkeypatch.delenv("DATABRICKS_HOST", raising=False)

        db_file = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/image.dcm",
        )

        with pytest.raises(ValueError, match="Host must be provided"):
            db_file.to_api_url()


class TestDatabricksFileValidation:
    """Test validation methods."""

    def test_is_valid_returns_true_for_valid_file(self):
        """Test is_valid returns True for valid components."""
        db_file = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/image.dcm",
        )

        assert db_file.is_valid() is True

    def test_is_valid_with_hyphens(self):
        """Test is_valid with hyphens in names."""
        db_file = DatabricksFile(
            catalog="main-catalog",
            schema="pixels-solacc",
            volume="pixels-volume",
            file_path="dicom/image.dcm",
        )

        assert db_file.is_valid() is True

    def test_is_valid_with_underscores(self):
        """Test is_valid with underscores in names."""
        db_file = DatabricksFile(
            catalog="main_catalog",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/image.dcm",
        )

        assert db_file.is_valid() is True

    def test_validate_raises_for_invalid_catalog(self):
        """Test validate raises for invalid catalog name."""
        db_file = DatabricksFile(
            catalog="main catalog",  # Space is invalid
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/image.dcm",
        )

        with pytest.raises(ValueError, match="Invalid catalog name"):
            db_file.validate()

    def test_validate_raises_for_invalid_schema(self):
        """Test validate raises for invalid schema name."""
        db_file = DatabricksFile(
            catalog="main",
            schema="pixels@solacc",  # @ is invalid
            volume="pixels_volume",
            file_path="dicom/image.dcm",
        )

        with pytest.raises(ValueError, match="Invalid schema name"):
            db_file.validate()

    def test_validate_raises_for_invalid_volume(self):
        """Test validate raises for invalid volume name."""
        db_file = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels volume",  # Space is invalid
            file_path="dicom/image.dcm",
        )

        with pytest.raises(ValueError, match="Invalid volume name"):
            db_file.validate()

    def test_validate_raises_for_parent_directory_reference(self):
        """Test validate raises for parent directory references."""
        db_file = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="../../../etc/passwd",
        )

        with pytest.raises(ValueError, match="cannot contain '..'"):
            db_file.validate()

    def test_validate_api_url(self, monkeypatch):
        """Test validate_api_url for valid URL."""
        monkeypatch.setenv("DATABRICKS_HOST", "myworkspace.databricks.com")

        db_file = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/image.dcm",
        )

        # Should not raise
        db_file.validate_api_url()


class TestDatabricksFileUtilityMethods:
    """Test utility methods."""

    def test_get_components(self):
        """Test get_components returns all components."""
        db_file = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/image.dcm",
        )

        components = db_file.get_components()
        assert components == ("main", "pixels_solacc", "pixels_volume", "dicom/image.dcm")

    def test_str_representation(self):
        """Test __str__ returns full path."""
        db_file = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/image.dcm",
        )

        assert str(db_file) == "/Volumes/main/pixels_solacc/pixels_volume/dicom/image.dcm"

    def test_repr_representation(self):
        """Test __repr__ returns detailed representation."""
        db_file = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/image.dcm",
        )

        repr_str = repr(db_file)
        assert "DatabricksFile" in repr_str
        assert "catalog='main'" in repr_str
        assert "schema='pixels_solacc'" in repr_str
        assert "volume='pixels_volume'" in repr_str
        assert "file_path='dicom/image.dcm'" in repr_str

    def test_equality_same_components(self):
        """Test equality when components are the same."""
        db_file1 = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/image.dcm",
        )
        db_file2 = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/image.dcm",
        )

        assert db_file1 == db_file2

    def test_inequality_different_components(self):
        """Test inequality when components are different."""
        db_file1 = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/image1.dcm",
        )
        db_file2 = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/image2.dcm",
        )

        assert db_file1 != db_file2

    def test_hashable(self):
        """Test that instances are hashable."""
        db_file1 = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/image.dcm",
        )
        db_file2 = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/image.dcm",
        )

        # Should be able to use in a set
        file_set = {db_file1, db_file2}
        assert len(file_set) == 1  # Same file should only appear once

    def test_usable_as_dict_key(self):
        """Test that instances can be used as dictionary keys."""
        db_file = DatabricksFile(
            catalog="main",
            schema="pixels_solacc",
            volume="pixels_volume",
            file_path="dicom/image.dcm",
        )

        file_dict = {db_file: "some_value"}
        assert file_dict[db_file] == "some_value"
