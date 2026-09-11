# SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""
Utilities for fixing common malformed DICOM dataset issues.

These functions validate and normalize DICOM attributes to handle real-world malformed files
while adhering to DICOM standard (PS3.3, PS3.5) and pydicom conventions.

References:
- DICOM PS3.5: Data Structures and Encoding (Value Representations, formats)
- DICOM PS3.3: Information Object Definitions (IOD modules, attribute requirements)
"""

import logging
import pydicom
from pydicom.multival import MultiValue
from datetime import date, datetime, time
from pathlib import Path
from typing import List, Union
import os

logger = logging.getLogger(__name__)



class DicomFileLoader:
    """
    Simple iterable that auto-discovers DICOM files from a directory and yields batches.

    This class provides a simple interface for batch processing DICOM files without
    requiring external dependencies like PyTorch. It can be used with any function
    that accepts an iterable of (input_batch, output_batch) tuples.

    Args:
        input_dir: Path to directory containing DICOM files to process
        output_dir: Path to output directory. Output paths will preserve the directory
                   structure relative to input_dir.
        batch_size: Number of files to include in each batch (default: 256)

    Yields:
        tuple: (batch_input, batch_output) where both are lists of file paths
               batch_input contains source file paths
               batch_output contains corresponding output file paths with preserved directory structure

    Example:
        >>> loader = DicomFileLoader("/path/to/dicoms", "/path/to/output", batch_size=50)
        >>> for batch_in, batch_out in loader:
        ...     print(f"Processing {len(batch_in)} files")
        ...     print(f"Input: {batch_in[0]}")
        ...     print(f"Output: {batch_out[0]}")
    """

    def __init__(self, input_dir: str, output_dir: str, batch_size: int = 256):
        self.input_dir = input_dir
        self.output_dir = output_dir
        self.batch_size = batch_size
        self._files = None

    def _discover_files(self):
        """
        Discover DICOM files in the input directory.

        For network storage, optimize file discovery by using os.scandir
        instead of os.walk+os.path.isfile (to minimize stat calls), and avoid
        unnecessary reads. This improves performance when file metadata/listing
        is slow due to network latency.
        """
        if self._files is None:
            # Use a queue for iterative (non-recursive) traversal to efficiently scan directory tree
            files = []
            dirs_to_scan = [self.input_dir]
            while dirs_to_scan:
                current_dir = dirs_to_scan.pop()
                try:
                    with os.scandir(current_dir) as it:
                        for entry in it:
                            if entry.is_dir(follow_symlinks=False):
                                dirs_to_scan.append(entry.path)
                            elif entry.is_file(follow_symlinks=False):
                                try:
                                    # Minimize stat/read calls for S3 by only reading minimal header
                                    with open(entry.path, "rb") as fp:
                                        fp.seek(128)
                                        if fp.read(4) == b"DICM":
                                            files.append(entry.path)
                                except Exception:
                                    continue
                except Exception as e:
                    logger.warning(f"Could not scan directory {current_dir}: {e}")

            files.sort()
            self._files = files
            if not self._files:
                raise ValueError(f"No valid DICOM files found in {self.input_dir}")

            logger.info(f"Found {len(self._files)} DICOM files to process")


    def __iter__(self):
        """Iterate over batches of DICOM files."""
        self._discover_files()

        total_files = len(self._files)
        for batch_start in range(0, total_files, self.batch_size):
            batch_end = min(batch_start + self.batch_size, total_files)
            batch_input = self._files[batch_start:batch_end]

            # Compute output paths preserving directory structure
            batch_output = []
            for input_path in batch_input:
                relative_path = os.path.relpath(input_path, self.input_dir)
                output_path = os.path.join(self.output_dir, relative_path)
                batch_output.append(output_path)

            yield batch_input, batch_output


class DicomSeries:
    """
    Container class for a DICOM series with metadata and file list.
    
    This class represents a single DICOM series, holding all associated files
    and metadata extracted from the first file in the series.
    
    Attributes:
        series_uid: SeriesInstanceUID
        files: List of Path objects for files in this series
        modality: Modality (e.g., "CT", "MR", "PT")
        series_number: SeriesNumber
        instance_number: InstanceNumber (from first file)
        series_description: SeriesDescription
        patient_id: PatientID
        study_instance_uid: StudyInstanceUID
    
    Example:
        >>> series = DicomSeries(
        ...     series_uid="1.2.840.113619.2.55.3.12345",
        ...     files=[Path("/data/file1.dcm"), Path("/data/file2.dcm")],
        ...     modality="CT",
        ...     series_number=1,
        ...     instance_number=1,
        ...     series_description="Chest CT",
        ...     patient_id="PAT001",
        ...     study_instance_uid="1.2.840.113619.2.55.3.54321"
        ... )
        >>> print(f"Series {series.series_uid} has {len(series.files)} files")
        >>> print(f"Modality: {series.modality}")
    """
    
    def __init__(
        self,
        series_uid: str,
        files: List[Path],
        modality: str = "Unknown",
        series_number: str = "Unknown",
        instance_number: str = "Unknown",
        series_description: str = "Unknown",
        patient_id: str = "Unknown",
        study_instance_uid: str = "Unknown",
    ):
        """
        Initialize a DicomSeries.
        
        Args:
            series_uid: SeriesInstanceUID
            files: List of Path objects for DICOM files in this series
            modality: Modality (default: "Unknown")
            series_number: SeriesNumber (default: "N/A")
            instance_number: InstanceNumber from first file (default: "N/A")
            series_description: SeriesDescription (default: "N/A")
            patient_id: PatientID (default: "N/A")
            study_instance_uid: StudyInstanceUID (default: "N/A")
        """
        self.series_uid = series_uid
        self.files = files
        self.modality = modality
        self.series_number = series_number
        self.instance_number = instance_number
        self.series_description = series_description
        self.patient_id = patient_id
        self.study_instance_uid = study_instance_uid
    
    def __len__(self) -> int:
        """Return the number of files in this series."""
        return len(self.files)
    
    def __repr__(self) -> str:
        """Return string representation of the series."""
        return (
            f"DicomSeries(series_uid={self.series_uid!r}, "
            f"modality={self.modality!r}, "
            f"files={len(self.files)})"
        )
    
    def get_metadata_dict(self) -> dict:
        """
        Get metadata as a dictionary.
        
        Returns:
            Dictionary with all metadata fields
        """
        return {
            "modality": self.modality,
            "series_number": self.series_number,
            "instance_number": self.instance_number,
            "series_description": self.series_description,
            "patient_id": self.patient_id,
            "study_instance_uid": self.study_instance_uid,
        }
    
    def get_total_size(self) -> int:
        """
        Calculate total size of all files in bytes.
        
        Returns:
            Total size in bytes
        """
        return sum(f.stat().st_size for f in self.files)
    
    def get_total_size_mb(self) -> float:
        """
        Calculate total size of all files in megabytes.
        
        Returns:
            Total size in MB
        """
        return self.get_total_size() / (1024 * 1024)


class DicomSeriesScanner:
    """
    Scanner for DICOM files that groups files by SeriesInstanceUID.
    
    This class scans DICOM files from a directory or list of files, extracts metadata,
    and organizes files by their SeriesInstanceUID for batch processing.
    
    Example:
        >>> # Scan from directory
        >>> scanner = DicomSeriesScanner("/path/to/dicoms")
        >>> scanner.scan()
        >>> 
        >>> # Using glob to get all DICOM files in a directory
        >>> from glob import glob
        >>> dicom_files = glob("/path/to/dicoms/**/*.dcm", recursive=True)
        >>> scanner = DicomSeriesScanner(dicom_files)
        >>> scanner.scan()
        >>> 
        >>> # Iterate over all series
        >>> for series in scanner.iter_series():
        ...     print(f"Series {series.series_uid}: {len(series)} files, modality={series.modality}")
    """
    
    def __init__(self, source: Union[str, Path, List[Union[str, Path]]]):
        """
        Initialize the scanner with a source.
        
        Args:
            source: Either a directory path (str/Path) or a list of file paths
        """
        self.source = source
        self.series = {}  # Maps SeriesInstanceUID -> DicomSeries
        self._scanned = False
        
    def scan(self) -> None:
        """
        Scan all DICOM files and extract metadata.
        
        This method reads DICOM headers (stop_before_pixels=True) to extract:
        - SeriesInstanceUID
        - Modality
        - SeriesNumber
        - InstanceNumber
        - SeriesDescription
        - PatientID
        - StudyInstanceUID
        
        Files are grouped by their SeriesInstanceUID and stored as DicomSeries objects.
        """
        logger.info("Scanning DICOM files...")
        
        # Get list of files to scan
        file_paths = self._get_file_paths()
        
        # Temporary storage for building series
        series_files_temp = {}  # Maps SeriesInstanceUID -> List[Path]
        series_metadata_temp = {}  # Maps SeriesInstanceUID -> metadata dict
        
        total_files = 0
        skipped_files = 0
        
        for filepath in file_paths:
            total_files += 1
            try:
                # Read DICOM header only (not pixel data)
                ds = pydicom.dcmread(filepath, stop_before_pixels=True)
                series_uid = getattr(ds, "SeriesInstanceUID", None)
                
                if not series_uid:
                    logger.debug(f"Skipping file without SeriesInstanceUID: {filepath.name}")
                    skipped_files += 1
                    continue
                
                # Add file to series
                if series_uid not in series_files_temp:
                    series_files_temp[series_uid] = []
                    # Store metadata from first file of the series
                    series_metadata_temp[series_uid] = {
                        "modality": getattr(ds, "Modality", "Unknown"),
                        "series_number": getattr(ds, "SeriesNumber", "Unknown"),
                        "instance_number": getattr(ds, "InstanceNumber", "Unknown"),
                        "series_description": getattr(ds, "SeriesDescription", "Unknown"),
                        "patient_id": getattr(ds, "PatientID", "Unknown"),
                        "study_instance_uid": getattr(ds, "StudyInstanceUID", "Unknown"),
                    }
                
                series_files_temp[series_uid].append(filepath)
                
            except Exception as e:
                logger.info(f"Skipping non-DICOM or invalid file {filepath.name}: {e}")
                skipped_files += 1
                continue
        
        # Create DicomSeries objects from collected data
        for series_uid, files in series_files_temp.items():
            metadata = series_metadata_temp[series_uid]
            self.series[series_uid] = DicomSeries(
                series_uid=series_uid,
                files=files,
                modality=metadata["modality"],
                series_number=metadata["series_number"],
                instance_number=metadata["instance_number"],
                series_description=metadata["series_description"],
                patient_id=metadata["patient_id"],
                study_instance_uid=metadata["study_instance_uid"],
            )
        
        self._scanned = True
        
        logger.info("Scan complete:")
        logger.info(f"  Total files scanned: {total_files}")
        logger.info(f"  Valid DICOM files: {total_files - skipped_files}")
        logger.info(f"  Skipped files: {skipped_files}")
        logger.info(f"  Unique series found: {len(self.series)}")
    
    def _get_file_paths(self) -> List[Path]:
        """
        Get list of file paths from the source, optimized for network storage.
        Uses os.scandir for shallow directory or Path for manually provided lists, 
        to reduce unnecessary stat/read calls and speed up enumeration.
        
        Returns:
            List of Path objects to scan
        """
        if isinstance(self.source, (list, tuple)):
            # List of file paths provided
            return [Path(f) for f in self.source]
        else:
            source_path = Path(self.source)
            if not source_path.exists():
                raise FileNotFoundError(f"Source path does not exist: {source_path}")

            if source_path.is_file():
                return [source_path]
            elif source_path.is_dir():
                # For network storage, use os.scandir + a manual stack to minimize stat/read calls
                files = []
                stack = [str(source_path)]
                while stack:
                    dirpath = stack.pop()
                    try:
                        with os.scandir(dirpath) as entries:
                            for entry in entries:
                                if entry.name.startswith("."):
                                    continue  # ignore hidden files/dirs for speed, like .DS_Store etc.
                                if entry.is_dir(follow_symlinks=False):
                                    stack.append(entry.path)
                                elif entry.is_file(follow_symlinks=False):
                                    files.append(Path(entry.path))
                    except Exception as e:
                        # Log and continue for networked file systems that might have transient errors
                        logger.warning(f"Could not scan directory {dirpath}: {e}")
                        continue
                return files
            else:
                raise ValueError(f"Source is neither a file nor directory: {source_path}")
    
    def get_series_uids(self) -> List[str]:
        """
        Get list of all SeriesInstanceUIDs found.
        
        Returns:
            List of SeriesInstanceUID strings
        
        Raises:
            RuntimeError: If scan() has not been called yet
        """
        if not self._scanned:
            raise RuntimeError("Must call scan() before accessing series data")
        return list(self.series.keys())
    
    def get_series(self, series_uid: str) -> DicomSeries:
        """
        Get DicomSeries object for a specific series.
        
        Args:
            series_uid: SeriesInstanceUID to query
        
        Returns:
            DicomSeries object
        
        Raises:
            RuntimeError: If scan() has not been called yet
            KeyError: If series_uid not found
        """
        if not self._scanned:
            raise RuntimeError("Must call scan() before accessing series data")
        return self.series[series_uid]
    
    def get_files_for_series(self, series_uid: str) -> List[Path]:
        """
        Get all file paths for a specific series.
        
        Args:
            series_uid: SeriesInstanceUID to query
        
        Returns:
            List of Path objects for files in this series
        
        Raises:
            RuntimeError: If scan() has not been called yet
            KeyError: If series_uid not found
        """
        if not self._scanned:
            raise RuntimeError("Must call scan() before accessing series data")
        return self.series[series_uid].files
    
    def get_metadata_for_series(self, series_uid: str) -> dict:
        """
        Get metadata for a specific series as a dictionary.
        
        Args:
            series_uid: SeriesInstanceUID to query
        
        Returns:
            Dictionary with metadata fields:
            - modality: Modality (e.g., "CT", "MR", "PT")
            - series_number: SeriesNumber
            - instance_number: InstanceNumber (from first file)
            - series_description: SeriesDescription
            - patient_id: PatientID
            - study_instance_uid: StudyInstanceUID
        
        Raises:
            RuntimeError: If scan() has not been called yet
            KeyError: If series_uid not found
        """
        if not self._scanned:
            raise RuntimeError("Must call scan() before accessing series data")
        return self.series[series_uid].get_metadata_dict()
    
    def get_series_count(self) -> int:
        """
        Get the total number of series found.
        
        Returns:
            Number of unique series
        
        Raises:
            RuntimeError: If scan() has not been called yet
        """
        if not self._scanned:
            raise RuntimeError("Must call scan() before accessing series data")
        return len(self.series)
    
    def get_total_files(self) -> int:
        """
        Get the total number of DICOM files found.
        
        Returns:
            Total number of files across all series
        
        Raises:
            RuntimeError: If scan() has not been called yet
        """
        if not self._scanned:
            raise RuntimeError("Must call scan() before accessing series data")
        return sum(len(series) for series in self.series.values())
    
    def iter_series(self):
        """
        Iterate over all DicomSeries objects.
        
        Yields:
            DicomSeries object for each series
        
        Raises:
            RuntimeError: If scan() has not been called yet
        
        Example:
            >>> scanner = DicomSeriesScanner("/path/to/dicoms")
            >>> scanner.scan()
            >>> for series in scanner.iter_series():
            ...     print(f"Processing {series.modality} series with {len(series)} files")
        """
        if not self._scanned:
            raise RuntimeError("Must call scan() before accessing series data")
        
        for series in self.series.values():
            yield series


def fix_dicom_datetime_attributes(ds: pydicom.Dataset) -> None:
    """
    Fix malformed date/time attributes in DICOM datasets.

    Some legacy DICOM files have date/time values stored as strings in non-standard
    formats. This function converts valid date strings to proper Python date objects
    and removes invalid ones. This is necessary because highdicom expects proper
    date/time objects, not strings.

    Per DICOM PS3.5 Table 6.2-1 (Value Representations):
    - DA (Date): Character string with format "YYYYMMDD", fixed length 8
    - TM (Time): Character string with format "HHMMSS.FFFFFF" (1-6 fractional digits allowed)
    
    Both VRs are defined as character strings (not numeric types) and are allowed to be
    zero-length when the value is unknown or not applicable.
    
    Args:
        ds: pydicom.Dataset object to modify in-place
    """
    fixed_attrs = set()

    # List of date/time attributes that might need fixing
    date_attrs = ["StudyDate", "SeriesDate", "AcquisitionDate", "ContentDate"]
    time_attrs = ["StudyTime", "SeriesTime", "AcquisitionTime", "ContentTime"]

    # Fix date attributes - convert strings to date objects
    for attr in date_attrs:
        if hasattr(ds, attr):
            value = getattr(ds, attr)
            # If it's already a proper date/datetime object, skip
            if isinstance(value, (date, datetime)):
                continue
            # If it's a string, try to convert it to a date object
            if isinstance(value, str) and value:
                try:
                    # DICOM date format is YYYYMMDD
                    if len(value) >= 8 and value[:8].isdigit():
                        year = int(value[0:4])
                        month = int(value[4:6])
                        day = int(value[6:8])
                        date_obj = date(year, month, day)
                        setattr(ds, attr, date_obj)
                        fixed_attrs.add(f"{attr} (converted to date)")
                    else:
                        # Invalid format, remove it
                        delattr(ds, attr)
                        fixed_attrs.add(f"{attr} (removed)")
                except (ValueError, IndexError) as e:
                    # Invalid date values, remove it
                    delattr(ds, attr)
                    fixed_attrs.add(f"{attr} (removed - invalid)")
            elif not value:
                # Empty string, remove it
                delattr(ds, attr)
                fixed_attrs.add(f"{attr} (removed - empty)")

    # Fix time attributes - convert strings to time objects
    for attr in time_attrs:
        if hasattr(ds, attr):
            value = getattr(ds, attr)
            # If it's already a proper time/datetime object, skip
            if isinstance(value, (time, datetime)):
                continue
            # If it's a string, try to convert it to a time object
            if isinstance(value, str) and value:
                try:
                    # DICOM time format is HHMMSS.FFFFFF or HHMMSS
                    # Clean up the string
                    time_str = value.replace(":", "")

                    if "." in time_str:
                        parts = time_str.split(".")
                        main_part = parts[0]
                        frac_part = parts[1] if len(parts) > 1 else "0"
                    else:
                        main_part = time_str
                        frac_part = "0"

                    # Parse hours, minutes, seconds
                    if len(main_part) >= 2:
                        hour = int(main_part[0:2])
                        minute = int(main_part[2:4]) if len(main_part) >= 4 else 0
                        second = int(main_part[4:6]) if len(main_part) >= 6 else 0
                        microsecond = int(frac_part[:6].ljust(6, "0")) if frac_part else 0

                        time_obj = time(hour, minute, second, microsecond)
                        setattr(ds, attr, time_obj)
                        fixed_attrs.add(f"{attr} (converted to time)")
                    else:
                        # Too short to be valid, remove it
                        delattr(ds, attr)
                        fixed_attrs.add(f"{attr} (removed)")
                except (ValueError, IndexError) as e:
                    # Invalid time values, remove it
                    delattr(ds, attr)
                    fixed_attrs.add(f"{attr} (removed - invalid)")
            elif not value:
                # Empty string, remove it
                delattr(ds, attr)
                fixed_attrs.add(f"{attr} (removed - empty)")

    if fixed_attrs:
        logger.debug(
            f"Converted/fixed date/time attributes: {len([a for a in fixed_attrs if 'converted' in a])} converted, "
            f"{len([a for a in fixed_attrs if 'removed' in a])} removed"
        )

def fix_dicom_patient_sex_attributes(ds: pydicom.Dataset) -> None:
    """
    Fix malformed Patient's Sex (0010,0040) attribute.
    
    Per DICOM Patient Module:
    - Attribute: Patient's Sex (0010,0040)
    - Type: Required, Empty if Unknown (Type 2)
    - VR: Code String (CS), VM: 1
    - Definition: Sex of the named Patient
    - Enumerated Values: "M" (male), "F" (female), "O" (other)
    - Zero-length allowed when value is unknown
    
    Invalid values are normalized to empty string to indicate "unknown" rather than
    being coerced to a specific value.

    Args:
        ds: pydicom.Dataset object to modify in-place
    """
    if hasattr(ds, "PatientSex"):
        value = ds.PatientSex
        # Allow standard values and empty/None
        if value not in ("M", "F", "O", "", None):
            logger.debug(f"PatientSex '{value}' is non-standard, setting to empty (unknown)")
            ds.PatientSex = ""

def fix_image_type_attributes(ds: pydicom.Dataset) -> None:
    """
    Fix ImageType (0008,0008) attribute to meet DICOM VM requirements.

    Per DICOM standard (e.g., Enhanced CT Image IOD):
    - Attribute: Image Type (0008,0008)
    - Type: 1 (required, must not be empty)
    - VR: Code String (CS), VM: 2-n
    - Definition: Image characteristics
    - Value 1 shall be: "ORIGINAL" (acquired data) or "DERIVED" (processed/reformatted data)
    - Value 2 shall be: "PRIMARY" (used for diagnosis) or "SECONDARY" (not for diagnosis)
    - Additional values (3+) are defined by specific IODs or left to implementations

    This function only adds missing required values (positions 1-2); it does not remove
    or modify vendor-specific values beyond position 2.

    Args:
        ds: pydicom.Dataset object to modify in-place
    """
    if not hasattr(ds, "ImageType"):
        return
    
    original_image_type = ds.ImageType
    
    # Normalize to list, preserving all existing values
    if isinstance(original_image_type, str):
        image_type = [original_image_type] if original_image_type else []
    elif isinstance(original_image_type, (list, tuple, MultiValue)):
        # Convert to list for consistent manipulation
        image_type = list(original_image_type)
    else:
        raise ValueError(f"ImageType has unexpected type {type(original_image_type)}, cannot fix reliably")
    
    # Only fix if fewer than 2 values (required minimum)
    if len(image_type) < 2:
        if len(image_type) == 0:
            # No values - use defaults
            image_type = ['ORIGINAL', 'PRIMARY']
        elif len(image_type) == 1:
            # One value - add the missing second value based on what we have
            if image_type[0] in ['ORIGINAL', 'DERIVED']:
                # Value 1 is valid, add default for value 2
                image_type.append('PRIMARY')
            elif image_type[0] in ['PRIMARY', 'SECONDARY']:
                # Value 1 is missing, this is value 2 - prepend ORIGINAL
                image_type = ['ORIGINAL'] + image_type
            else:
                # Unknown value - keep it as value 2, prepend ORIGINAL
                image_type = ['ORIGINAL'] + image_type
        
        ds.ImageType = image_type
        logger.debug(f"Fixed ImageType: {original_image_type} → {image_type}")
        

def fix_missing_planar_configuration(ds: pydicom.Dataset) -> None:
    """
    Fix missing PlanarConfiguration (0028,0006) attribute for color images.

    Per DICOM Image Pixel Module:
    - Attribute: Planar Configuration (0028,0006)
    - Type: Conditionally Required (1C)
    - VR: Unsigned Short (US), VM: 1
    - Description: Indicates whether pixel data are encoded color-by-plane or color-by-pixel
    - Condition: Required if Samples per Pixel (0028,0002) has a value greater than 1
    - Enumerated Values:
      * 0: color-by-pixel (RGBRGBRGB... interleaved) - most common
      * 1: color-by-plane (RRR...GGG...BBB... planar)

    Some ultrasound and other files omit this required element. This adds it with
    the most common default value (0 = interleaved/color-by-pixel).

    Args:
        ds: pydicom.Dataset object to modify in-place
    """
    if (0x0028, 0x0006) not in ds and getattr(ds, "SamplesPerPixel", 1) > 1:
        logger.debug("Adding missing PlanarConfiguration (0=interleaved) for color image")
        ds.add(pydicom.dataelem.DataElement(0x00280006, "US", 0))


def fix_malformed_dicom(ds: pydicom.Dataset) -> None:
    """
    Fix common malformed DICOM dataset issues to enable processing.

    This function applies several minimal fixes to handle real-world malformed files
    while staying close to DICOM standard and pydicom conventions:

    1. **DateTime conversion** (DA/TM VRs per PS3.5 Table 6.2-1):
       - Validates format: "YYYYMMDD" (DA) and "HHMMSS.FFFFFF" (TM)
       - Converts to Python date/time objects (required for highdicom compatibility)
       - Invalid values → empty string (unknown/not applicable)
       
    2. **PatientSex normalization** (0010,0040, Type 2):
       - Enumerated values: "M", "F", "O"
       - Invalid values → "" (unknown)
    
    3. **ImageType VM enforcement** (0008,0008, Type 1, VM: 2-n):
       - Value 1: "ORIGINAL" or "DERIVED"
       - Value 2: "PRIMARY" or "SECONDARY"
       - Preserves vendor-specific values beyond position 2
       
    4. **PlanarConfiguration** (0028,0006, Type 1C):
       - Adds missing element when SamplesPerPixel > 1
       - Default value: 0 (color-by-pixel/interleaved)

    Args:
        ds: pydicom.Dataset object to modify in-place
    """
    fix_dicom_datetime_attributes(ds)
    fix_dicom_patient_sex_attributes(ds)
    fix_image_type_attributes(ds)
    fix_missing_planar_configuration(ds)