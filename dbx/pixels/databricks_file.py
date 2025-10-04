"""
Databricks File Path Handler for Unity Catalog Volumes

This module provides a class to handle file paths in Databricks Unity Catalog volumes,
with validation and utility functions for path manipulation.

The DatabricksFile class encapsulates the three-level namespace of Unity Catalog
(catalog/schema/volume) plus the file path within the volume, and provides methods
to validate paths and retrieve file information.

Example:
    >>> db_file = DatabricksFile(
    ...     catalog="main",
    ...     schema="pixels_solacc",
    ...     volume="pixels_volume",
    ...     file_path="dicom/images/patient001/image.dcm"
    ... )
    >>> db_file.is_valid()
    True
    >>> db_file.full_path
    '/Volumes/main/pixels_solacc/pixels_volume/dicom/images/patient001/image.dcm'
    >>> db_file.file_name
    'image.dcm'
"""

import os
import re
from pathlib import Path
from typing import Optional, Tuple


class DatabricksFile:
    """
    Represents a file in a Databricks Unity Catalog volume.

    Attributes:
        catalog (str): The Unity Catalog catalog name.
        schema (str): The Unity Catalog schema name.
        volume (str): The Unity Catalog volume name.
        file_path (str): The relative path to the file within the volume.
    """

    # Regex patterns for validation
    # Catalog, schema, and volume names should contain only alphanumeric characters, underscores, and hyphens
    _IDENTIFIER_PATTERN = r"^[\w\-]+$"

    # File path can contain alphanumeric, underscores, hyphens, slashes, dots, and other common file characters
    _FILE_PATH_PATTERN = r"^[\w\-\.\/]+$"

    def __init__(
        self,
        catalog: str,
        schema: str,
        volume: str,
        file_path: str,
    ):
        """
        Initialize a DatabricksFile instance with automatic validation.

        Args:
            catalog (str): The Unity Catalog catalog name.
            schema (str): The Unity Catalog schema name.
            volume (str): The Unity Catalog volume name.
            file_path (str): The relative path to the file within the volume.

        Raises:
            ValueError: If any of the parameters are empty, None, or invalid.
        """
        if not catalog:
            raise ValueError("Catalog cannot be empty")
        if not schema:
            raise ValueError("Schema cannot be empty")
        if not volume:
            raise ValueError("Volume cannot be empty")
        if not file_path:
            raise ValueError("File path cannot be empty")

        self._catalog = catalog.strip()
        self._schema = schema.strip()
        self._volume = volume.strip()
        # Normalize file path: remove leading/trailing slashes
        self._file_path = file_path.strip().strip("/")

        # Always validate during construction for safety
        self.validate()

    @classmethod
    def from_full_path(cls, full_path: str) -> "DatabricksFile":
        """
        Create a DatabricksFile instance from a full Unity Catalog volume path.

        The created instance is automatically validated during construction.

        Args:
            full_path (str): Full path in format '/Volumes/catalog/schema/volume/file/path'
                            or 'dbfs:/Volumes/catalog/schema/volume/file/path'

        Returns:
            DatabricksFile: A new validated instance with parsed components.

        Raises:
            ValueError: If the path format is invalid or doesn't contain all required parts.

        Example:
            >>> db_file = DatabricksFile.from_full_path(
            ...     '/Volumes/main/pixels_solacc/pixels_volume/dicom/image.dcm'
            ... )
        """
        # Remove dbfs: prefix if present
        path = full_path.replace("dbfs:", "").strip()

        # Remove leading/trailing slashes
        path = path.strip("/")

        # Split the path
        parts = path.split("/")

        # Validate format: should start with 'Volumes' and have at least 5 parts
        # ['Volumes', 'catalog', 'schema', 'volume', 'file1', ...]
        if len(parts) < 5 or parts[0] != "Volumes":
            raise ValueError(
                f"Invalid volume path format. Expected '/Volumes/catalog/schema/volume/file/path', "
                f"got '{full_path}'"
            )

        catalog = parts[1]
        schema = parts[2]
        volume = parts[3]
        file_path = "/".join(parts[4:])

        return cls(catalog=catalog, schema=schema, volume=volume, file_path=file_path)

    @classmethod
    def from_url(cls, url: str) -> "DatabricksFile":
        """
        Create a DatabricksFile instance from a Databricks Files API URL.

        The created instance is automatically validated during construction.

        Args:
            url (str): Files API URL in format
                      'https://host/api/2.0/fs/files/Volumes/catalog/schema/volume/file/path'

        Returns:
            DatabricksFile: A new validated instance with parsed components.

        Raises:
            ValueError: If the URL format is invalid.

        Example:
            >>> db_file = DatabricksFile.from_url(
            ...     'https://myworkspace.databricks.com/api/2.0/fs/files/Volumes/main/schema/vol/file.dcm'
            ... )
        """
        # Extract the path after '/files/'
        match = re.search(r"/files/(Volumes/.+)$", url)
        if not match:
            raise ValueError(f"Invalid Databricks Files API URL format: {url}")

        volume_path = match.group(1)
        return cls.from_full_path(volume_path)

    @property
    def catalog(self) -> str:
        """Get the catalog name."""
        return self._catalog

    @property
    def schema(self) -> str:
        """Get the schema name."""
        return self._schema

    @property
    def volume(self) -> str:
        """Get the volume name."""
        return self._volume

    @property
    def file_path(self) -> str:
        """Get the file path within the volume."""
        return self._file_path

    @property
    def full_path(self) -> str:
        """
        Get the full Unity Catalog volume path.

        Returns:
            str: Full path in format '/Volumes/catalog/schema/volume/file/path'
        """
        return f"/Volumes/{self._catalog}/{self._schema}/{self._volume}/{self._file_path}"

    @property
    def dbfs_path(self) -> str:
        """
        Get the full path with dbfs: prefix.

        Returns:
            str: Full path in format 'dbfs:/Volumes/catalog/schema/volume/file/path'
        """
        return f"dbfs:{self.full_path}"

    @property
    def volume_path(self) -> str:
        """
        Get the volume path without the file path.

        Returns:
            str: Volume path in format '/Volumes/catalog/schema/volume'
        """
        return f"/Volumes/{self._catalog}/{self._schema}/{self._volume}"

    @property
    def three_level_namespace(self) -> str:
        """
        Get the three-level namespace identifier.

        Returns:
            str: Namespace in format 'catalog.schema.volume'
        """
        return f"{self._catalog}.{self._schema}.{self._volume}"

    @property
    def file_name(self) -> str:
        """
        Get the file name (last component of the path).

        Returns:
            str: The file name without directory path.

        Example:
            >>> db_file.file_path = "dicom/images/patient001/image.dcm"
            >>> db_file.file_name
            'image.dcm'
        """
        return Path(self._file_path).name

    @property
    def file_extension(self) -> str:
        """
        Get the file extension including the dot.

        Returns:
            str: The file extension (e.g., '.dcm', '.nii') or empty string if no extension.
        """
        return Path(self._file_path).suffix

    @property
    def parent_directory(self) -> str:
        """
        Get the parent directory path within the volume.

        Returns:
            str: The parent directory path, or empty string if file is at volume root.
        """
        parent = Path(self._file_path).parent
        return str(parent) if str(parent) != "." else ""

    def to_api_url(self, host: Optional[str] = None) -> str:
        """
        Convert to Databricks Files API URL.

        Args:
            host (str, optional): The Databricks workspace host. If None, reads from
                                 DATABRICKS_HOST environment variable.

        Returns:
            str: Files API URL in format
                'https://host/api/2.0/fs/files/Volumes/catalog/schema/volume/file/path'

        Raises:
            ValueError: If host is None and DATABRICKS_HOST environment variable is not set.
        """
        if host is None:
            host = os.environ.get("DATABRICKS_HOST")
            if host is None:
                raise ValueError(
                    "Host must be provided or DATABRICKS_HOST environment variable must be set"
                )

        # Remove protocol if present
        host = host.replace("https://", "").replace("http://", "")

        return (
            f"https://{host}/api/2.0/fs/files/Volumes/"
            f"{self._catalog}/{self._schema}/{self._volume}/{self._file_path}"
        )

    def is_valid(self) -> bool:
        """
        Check if all components of the file path are valid.

        Returns:
            bool: True if all components pass validation, False otherwise.
        """
        try:
            self.validate()
            return True
        except ValueError:
            return False

    def validate(self) -> None:
        """
        Validate all components of the file path.

        Raises:
            ValueError: If any component fails validation with a descriptive message.
        """
        if not re.match(self._IDENTIFIER_PATTERN, self._catalog):
            raise ValueError(
                f"Invalid catalog name '{self._catalog}'. "
                f"Catalog names must contain only alphanumeric characters, underscores, and hyphens."
            )

        if not re.match(self._IDENTIFIER_PATTERN, self._schema):
            raise ValueError(
                f"Invalid schema name '{self._schema}'. "
                f"Schema names must contain only alphanumeric characters, underscores, and hyphens."
            )

        if not re.match(self._IDENTIFIER_PATTERN, self._volume):
            raise ValueError(
                f"Invalid volume name '{self._volume}'. "
                f"Volume names must contain only alphanumeric characters, underscores, and hyphens."
            )

        # File paths can contain more characters than identifiers
        if not self._file_path or self._file_path.strip() == "":
            raise ValueError("File path cannot be empty")

        # Check for dangerous patterns
        if ".." in self._file_path:
            raise ValueError("File path cannot contain '..' (parent directory references)")

    def validate_api_url(self, host: Optional[str] = None) -> None:
        """
        Validate the full API URL format.

        Args:
            host (str, optional): The Databricks workspace host. If None, reads from
                                 DATABRICKS_HOST environment variable.

        Raises:
            ValueError: If the URL format is invalid.
        """
        # First validate the components
        self.validate()

        # Build the URL
        file_url = self.to_api_url(host)

        # Validate the full URL format
        url_regex = (
            r"^https://[a-zA-Z0-9\.\-]+/api/2\.0/fs/files/Volumes/[\w\-]+/[\w\-]+/[\w\-]+/.+"
        )
        if not re.match(url_regex, file_url):
            raise ValueError(f"Invalid file URL format: {file_url}")

    def get_components(self) -> Tuple[str, str, str, str]:
        """
        Get all components as a tuple.

        Returns:
            Tuple[str, str, str, str]: (catalog, schema, volume, file_path)
        """
        return (self._catalog, self._schema, self._volume, self._file_path)

    def __str__(self) -> str:
        """String representation returns the full path."""
        return self.full_path

    def __repr__(self) -> str:
        """Detailed representation for debugging."""
        return (
            f"DatabricksFile(catalog='{self._catalog}', schema='{self._schema}', "
            f"volume='{self._volume}', file_path='{self._file_path}')"
        )

    def __eq__(self, other) -> bool:
        """Check equality based on all components."""
        if not isinstance(other, DatabricksFile):
            return False
        return (
            self._catalog == other._catalog
            and self._schema == other._schema
            and self._volume == other._volume
            and self._file_path == other._file_path
        )

    def __hash__(self) -> int:
        """Make the object hashable for use in sets and dicts."""
        return hash((self._catalog, self._schema, self._volume, self._file_path))
