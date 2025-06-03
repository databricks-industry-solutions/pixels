import io
import zipfile
from typing import Optional

import requests


class DatabricksRemoteZip:
    def __init__(self, token: str, file_path: str, base_url: str, initial_buffer_size: int = 8192):
        self.token = token
        self.file_path = file_path
        self.base_url = base_url
        self.initial_buffer_size = initial_buffer_size
        self._total_size = None
        self._file_like_obj = None

    def _get_headers(self, range_header: Optional[str] = None) -> dict:
        """Generate headers for Databricks API requests"""
        headers = {"Authorization": f"Bearer {self.token}"}
        if range_header:
            headers["Range"] = range_header
        return headers

    def _get_total_size(self) -> int:
        """Get total file size using HEAD request"""
        if self._total_size is None:
            url = f"{self.base_url}{self.file_path}"
            response = requests.head(url, headers=self._get_headers())
            response.raise_for_status()
            self._total_size = int(response.headers.get("Content-Length", 0))
        print(f"Total size: {self._total_size}")
        return self._total_size

    def _create_file_like_object(self) -> io.RawIOBase:
        """Create a file-like object for zipfile.ZipFile"""
        return DatabricksRangeReader(
            self.token,
            self.file_path,
            self._get_total_size(),
            self.base_url,
            self.initial_buffer_size,
        )

    def __enter__(self):
        self._file_like_obj = self._create_file_like_object()
        self._zip_file = zipfile.ZipFile(self._file_like_obj, "r")
        return self._zip_file

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self._zip_file:
            self._zip_file.close()
        if self._file_like_obj:
            self._file_like_obj.close()


class DatabricksRangeReader(io.RawIOBase):
    def __init__(
        self, token: str, file_path: str, total_size: int, base_url: str, buffer_size: int = 8192
    ):
        self.token = token
        self.file_path = file_path
        self.total_size = total_size
        self.position = 0
        self.buffer_size = buffer_size
        self.base_url = base_url
        self._cache = {}

    def _make_range_request(self, start: int, end: int) -> bytes:
        """Make HTTP range request to Databricks Files API"""
        url = f"{self.base_url}{self.file_path}"
        headers = {"Authorization": f"Bearer {self.token}", "Range": f"bytes={start}-{end}"}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.content

    def readinto(self, b) -> int:
        """Read data into buffer b and return bytes read"""
        if self.position >= self.total_size:
            return 0

        bytes_to_read = min(len(b), self.total_size - self.position)
        print(bytes_to_read)
        end_position = self.position + bytes_to_read - 1

        # Use caching for better performance
        cache_key = (self.position, end_position)
        if cache_key not in self._cache:
            self._cache[cache_key] = self._make_range_request(self.position, end_position)

        data = self._cache[cache_key]
        bytes_read = len(data)
        b[:bytes_read] = data
        self.position += bytes_read
        return bytes_read

    def seek(self, offset: int, whence: int = 0) -> int:
        """Seek to position in file"""
        if whence == 0:  # SEEK_SET
            self.position = offset
        elif whence == 1:  # SEEK_CUR
            self.position += offset
        elif whence == 2:  # SEEK_END
            self.position = self.total_size + offset
        return self.position

    def tell(self) -> int:
        """Return current position"""
        return self.position

    def readable(self) -> bool:
        return True

    def seekable(self) -> bool:
        return True

    def close(self):
        """Clean up cache"""
        self._cache.clear()
