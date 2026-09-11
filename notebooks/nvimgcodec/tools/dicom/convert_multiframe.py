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
Utilities for converting legacy DICOM series to enhanced multi-frame format.

This module provides tools to convert series of single-frame DICOM files into
single multi-frame enhanced DICOM files, with optional HTJ2K compression for
improved storage efficiency.

Key Features:
- Convert legacy CT/MR/PT series to enhanced multi-frame format using highdicom
- Optional HTJ2K (High-Throughput JPEG 2000) lossless compression
- Batch processing of multiple series with automatic grouping by SeriesInstanceUID
- Preserve or generate new SeriesInstanceUID
- Handle unsupported modalities (MG, US, XA) by transcoding or copying
- Comprehensive statistics including frame counts and compression ratios

Enhanced DICOM multi-frame format benefits:
- Single file instead of hundreds of individual files
- Better organization and metadata structure
- More efficient I/O operations
- Standards-compliant with DICOM Part 3

Supported modalities for enhanced conversion:
- CT (Computed Tomography)
- MR (Magnetic Resonance)
- PT (Positron Emission Tomography)

Unsupported modalities (MG, US, XA, etc.) can be:
- Transcoded to HTJ2K (preserving original format)
- Copied without modification

Example:
    >>> from nvidia.nvimgcodec.tools.dicom.convert_multiframe import convert_to_enhanced_dicom
    >>> from nvidia.nvimgcodec.tools.dicom.dicom_utils import DicomSeriesScanner
    >>> import pydicom
    >>>
    >>> # Single series conversion with HTJ2K compression
    >>> datasets = [pydicom.dcmread(f"slice_{i:03d}.dcm") for i in range(100)]
    >>> enhanced = convert_to_enhanced_dicom(
    ...     series_datasets=[datasets],
    ...     transfer_syntax_uid="1.2.840.10008.1.2.4.202"  # HTJ2K with RPCL
    ... )
    >>> enhanced[0].save_as("enhanced_multiframe.dcm")  # 100 files → 1 file
    >>>
    >>> # Batch convert multiple series from a directory
    >>> scanner = DicomSeriesScanner("/path/to/input")
    >>> scanner.scan()
    >>>
    >>> for series in scanner.iter_series():
    ...     print(f"Converting {series.modality} series: {len(series)} files")
    ...     datasets = [pydicom.dcmread(f) for f in series.files]
    ...     enhanced = convert_to_enhanced_dicom(
    ...         series_datasets=[datasets],
    ...         transfer_syntax_uid="1.2.840.10008.1.2.4.202"
    ...     )
    ...     enhanced[0].save_as(f"enhanced_{series.series_uid}.dcm")
    >>>
    >>> # Convert without HTJ2K compression (just multi-frame)
    >>> enhanced = convert_to_enhanced_dicom(
    ...     series_datasets=[datasets],
    ...     transfer_syntax_uid=None  # Uses Explicit VR Little Endian
    ... )
"""

import logging
import os
import shutil
import tempfile
import warnings
import hashlib
from contextlib import contextmanager
from pathlib import Path
from typing import Iterable, List, Optional, Union
from .convert_htj2k import transcode_datasets_to_htj2k, _get_transfer_syntax_constants
from .dicom_utils import fix_malformed_dicom, DicomSeriesScanner, DicomSeries
import numpy as np

try:
    import pydicom
    import pydicom.config
    from pydicom.uid import generate_uid
except ImportError as e:
    raise ImportError("pydicom >= 3.0.0 is required but not installed.") from e
if tuple(int(x) for x in pydicom.__version__.split(".")[:3]) < (3, 0, 0):
    raise ImportError(f"pydicom >= 3.0.0 is required, found {pydicom.__version__}")

pydicom.config.assume_implicit_vr_switch = True

logger = logging.getLogger(__name__)

# Transfer syntax UIDs
EXPLICIT_VR_LITTLE_ENDIAN = "1.2.840.10008.1.2.1"
IMPLICIT_VR_LITTLE_ENDIAN = "1.2.840.10008.1.2"

def can_convert_to_enhanced_dicom(ds: pydicom.Dataset) -> bool:
    """
    Check if a DICOM dataset can be converted to enhanced DICOM.
    
    Args:
        ds: DICOM dataset
    """
    modality = getattr(ds, 'Modality', None)
    sop_class_uid = getattr(ds, 'SOPClassUID', None)
    
    if modality == "CT" and sop_class_uid == '1.2.840.10008.5.1.4.1.1.2':
        return True
    if modality == "MR" and sop_class_uid == '1.2.840.10008.5.1.4.1.1.4':
        return True
    if modality == "PT" and sop_class_uid == '1.2.840.10008.5.1.4.1.1.128':
        return True
    return False


@contextmanager
def _suppress_highdicom_warnings():
    """
    Context manager to suppress common highdicom warnings.

    Suppresses warnings like:
    - "unknown derived pixel contrast"
    - Other non-critical highdicom warnings

    This suppresses both Python warnings and logging-based warnings from highdicom.
    """
    # Suppress Python warnings
    with warnings.catch_warnings():
        warnings.filterwarnings("ignore", message=".*unknown derived pixel contrast.*")
        warnings.filterwarnings("ignore", category=UserWarning, module="highdicom.*")

        # Suppress highdicom logging warnings
        highdicom_logger = logging.getLogger("highdicom")
        highdicom_legacy_logger = logging.getLogger("highdicom.legacy")
        highdicom_sop_logger = logging.getLogger("highdicom.legacy.sop")

        # Save original log levels
        original_level = highdicom_logger.level
        original_legacy_level = highdicom_legacy_logger.level
        original_sop_level = highdicom_sop_logger.level

        try:
            # Temporarily set to ERROR to suppress WARNING messages
            highdicom_logger.setLevel(logging.ERROR)
            highdicom_legacy_logger.setLevel(logging.ERROR)
            highdicom_sop_logger.setLevel(logging.ERROR)
            yield
        finally:
            # Restore original log levels
            highdicom_logger.setLevel(original_level)
            highdicom_legacy_logger.setLevel(original_legacy_level)
            highdicom_sop_logger.setLevel(original_sop_level)


def _validate_series_consistency(datasets: List[pydicom.Dataset]) -> dict:
    """
    Validate that all datasets in a series are consistent.

    Args:
        datasets: List of pydicom.Dataset objects

    Returns:
        Dictionary with series metadata

    Raises:
        ValueError: If datasets are inconsistent
    """
    if not datasets:
        return None

    first_ds = datasets[0]

    if not isinstance(first_ds, pydicom.Dataset):
        raise ValueError(f"First dataset is not a pydicom.Dataset: {type(first_ds)}")

    # Check modality
    modality = getattr(first_ds, "Modality", None)
    if not modality:
        raise ValueError("First dataset missing Modality tag")

    # Required attributes that must be consistent
    optional_consistent_attrs = [
        "SeriesInstanceUID",
        "StudyInstanceUID",
        "PatientID",
        "PixelSpacing",
        "ImageOrientationPatient",
    ]

    # Collect metadata from first dataset
    # Check if Rows and Columns exist (required for image data)
    if not hasattr(first_ds, 'Rows') or not hasattr(first_ds, 'Columns'):
        raise ValueError(
            f"Dataset is missing required image attributes (Rows/Columns). "
            f"This may not be an image dataset or may require different handling."
        )
    
    metadata = {
        "modality": modality,
        "rows": first_ds.Rows,
        "columns": first_ds.Columns,
        "num_frames": len(datasets),
    }

    # Check consistency across all datasets
    # For multiframe creation, Rows and Columns MUST be consistent
    metadata["is_consistent"] = all(
        hasattr(ds, "Rows") and getattr(ds, "Rows") == first_ds.Rows and
        hasattr(ds, "Columns") and getattr(ds, "Columns") == first_ds.Columns
        for ds in datasets
    )
    
    if not metadata["is_consistent"]:
        logger.warning(f"Series has inconsistent dimensions - cannot create multiframe DICOM")

    # Check Modality consistency only for supported modalities
    if can_convert_to_enhanced_dicom(first_ds):
        if not all(ds.Modality == first_ds.Modality and ds.SOPClassUID == first_ds.SOPClassUID for ds in datasets):
            logger.warning(f"Inconsistent Modality and SOPClassUID values across series")
            metadata["is_consistent"] = False

    # Collect optional metadata
    for attr in optional_consistent_attrs:
        if hasattr(first_ds, attr):
            value = getattr(first_ds, attr)
            if value is not None:
                if not all(getattr(ds, attr) == value for ds in datasets):
                    logger.warning(f"Inconsistent {attr} values across series")

    logger.info(
        f"Series validated: {metadata['modality']} {metadata['rows']}x{metadata['columns']}, " f"{metadata['num_frames']} frames"
    )

    return metadata



def _ensure_required_attributes(datasets: List[pydicom.Dataset]) -> None:
    """
    Ensure that all datasets have the required attributes for enhanced multi-frame conversion.

    If required attributes are missing, they are added with sensible default values.
    This is necessary because the DICOM enhanced multi-frame standard requires certain
    attributes that may be missing from legacy DICOM files.

    Args:
        datasets: List of pydicom.Dataset objects to modify in-place
    """
    # Required attributes and their default values
    required_attrs = {
        "Manufacturer": "Unknown",
        "ManufacturerModelName": "Unknown",
        "DeviceSerialNumber": "Unknown",
        "SoftwareVersions": "Unknown",
    }

    # Check and add missing attributes to all datasets
    added_attrs = set()
    for ds in datasets:
        for attr, default_value in required_attrs.items():
            if not hasattr(ds, attr):
                setattr(ds, attr, default_value)
                added_attrs.add(attr)

    if added_attrs:
        logger.info(f"Added missing required attributes with default values: {', '.join(sorted(added_attrs))}")


def _transcode_to_htj2k(datasets: List[Union[List[pydicom.Dataset], pydicom.Dataset]]) -> List[Union[List[pydicom.Dataset], pydicom.Dataset]]:
    """
    Transcoder to HTJ2K.

    Args:
        datasets: List of pydicom.Dataset objects (multi-frame) or lists of pydicom.Dataset objects (single-frame per DICOM file).

    Returns:
        List of pydicom.Dataset objects (multi-frame) or lists of pydicom.Dataset objects (single-frame per DICOM file).
    """
    transcoded_datasets = []
    for series_datasets in datasets:
        if isinstance(series_datasets, pydicom.Dataset):
            series_datasets = [series_datasets]
        if isinstance(series_datasets, list):
            transcoded_datasets.extend(transcode_datasets_to_htj2k(datasets=series_datasets))
        else:
            raise ValueError(f"Invalid dataset type: {type(series_datasets)}")
    return transcoded_datasets

def _is_any_multiframe(datasets: Union[List[pydicom.Dataset], pydicom.Dataset]) -> bool:
    """
    Check if any of the datasets are multiframe.
    """
    if isinstance(datasets, list):
        return any(isinstance(ds, pydicom.Dataset) and hasattr(ds, 'NumberOfFrames') and int(ds.NumberOfFrames) > 1 for ds in datasets)
    elif isinstance(datasets, pydicom.Dataset):
        return hasattr(datasets, 'NumberOfFrames') and int(datasets.NumberOfFrames) > 1
    else:
        raise ValueError(f"Invalid dataset type: {type(datasets)}")

def is_any_nonimage(datasets: Union[List[pydicom.Dataset], pydicom.Dataset]) -> bool:
    """
    Check if any of the datasets are non-image.
    """
    if isinstance(datasets, list):
        return any(isinstance(ds, pydicom.Dataset) and not hasattr(ds, 'PixelData') for ds in datasets)
    elif isinstance(datasets, pydicom.Dataset):
        return not hasattr(datasets, 'PixelData')
    else:
        raise ValueError(f"Invalid dataset type: {type(datasets)}")

def convert_to_enhanced_dicom(
    series_datasets: List[List[Union[str, Path, pydicom.Dataset]]],
    transfer_syntax_uid: Optional[str] = None,
    num_resolutions: int = 6,
    code_block_size: tuple = (64, 64),
    progression_order: str = "RPCL",
) -> List[pydicom.Dataset]:
    """
    Convert legacy DICOM series to enhanced multi-frame DICOM.

    This function takes one or more series of single-frame DICOM files and converts them
    to enhanced multi-frame format. Supported modalities: CT, MR, PT. Unsupported modalities
    are returned unchanged.

    Args:
        series_datasets: List of lists of pydicom.Dataset objects, where the first level of the list iterates over
            separate series and the second level over frames within each series, each representing a single-frame DICOM dataset.
            Can also accept file paths (str or Path) which will be loaded automatically.
        transfer_syntax_uid: Transfer syntax for output. If None, uses Explicit VR Little Endian (1.2.840.10008.1.2.1).
            Use "1.2.840.10008.1.2.4.202" for HTJ2K with RPCL progression order.
        num_resolutions: Number of wavelet decomposition levels for HTJ2K (default: 6). Only used if transfer_syntax_uid is HTJ2K.
        code_block_size: Code block size for HTJ2K as (height, width) tuple (default: (64, 64)). Only used if transfer_syntax_uid is HTJ2K.
        progression_order: Progression order for HTJ2K (default: "RPCL"). Only used if transfer_syntax_uid is HTJ2K.

    Returns:
        List of pydicom.Dataset objects, where each object represents a single multi-frame DICOM dataset.
        For unsupported modalities or inconsistent series, returns the original datasets unchanged.

    Raises:
        ImportError: If highdicom is not installed
        ValueError: If series is invalid or inconsistent

    Example:
        >>> import pydicom
        >>> # Load a CT series (100 slices)
        >>> datasets = [pydicom.dcmread(f"slice_{i:03d}.dcm") for i in range(100)]
        >>>
        >>> # Convert to enhanced multi-frame with HTJ2K
        >>> enhanced = convert_to_enhanced_dicom(
        ...     series_datasets=[datasets],
        ...     transfer_syntax_uid="1.2.840.10008.1.2.4.202"
        ... )
        >>> # Result: 1 multi-frame file instead of 100 single-frame files
        >>> enhanced[0].save_as("enhanced_ct.dcm")
        >>>
        >>> # Convert multiple series at once
        >>> series1 = [pydicom.dcmread(f) for f in series1_files]
        >>> series2 = [pydicom.dcmread(f) for f in series2_files]
        >>> enhanced_list = convert_to_enhanced_dicom(
        ...     series_datasets=[series1, series2],
        ...     transfer_syntax_uid="1.2.840.10008.1.2.4.202"
        ... )
        >>> # Result: 2 enhanced multi-frame files (one per series)
        >>> enhanced_list[0].save_as("enhanced_series1.dcm")
        >>> enhanced_list[1].save_as("enhanced_series2.dcm")
    """
    try:
        import highdicom
        from highdicom.legacy import (
            LegacyConvertedEnhancedCTImage,
            LegacyConvertedEnhancedMRImage,
            LegacyConvertedEnhancedPETImage,
        )
    except ImportError as e:
        raise ImportError("highdicom is not installed. Install it with: pip install highdicom") from e

    # Set default transfer syntax
    if transfer_syntax_uid is None:
        transfer_syntax_uid = EXPLICIT_VR_LITTLE_ENDIAN
    if transfer_syntax_uid != EXPLICIT_VR_LITTLE_ENDIAN and transfer_syntax_uid not in _get_transfer_syntax_constants()["HTJ2K"]:
        raise ValueError(f"Transfer syntax {transfer_syntax_uid} is not supported for enhanced multi-frame conversion")
    logger.info(f"Transfer Syntax: {transfer_syntax_uid}")

    enhanced_datasets = []
    for datasets in series_datasets:
        logger.info(f"Processing DICOM series with {len(datasets)} dataset(s)")

        # Load datasets from paths if needed
        datasets = [pydicom.dcmread(dataset) if isinstance(dataset, (str, Path)) else dataset for dataset in datasets]
        if not all(isinstance(dataset, pydicom.Dataset) for dataset in datasets):
            raise ValueError("All datasets must be pydicom.Dataset or string/path to DICOM file")
        
        # Check for empty series
        if not datasets:
            raise ValueError("Series is empty")
        
        # Check if datasets are image files (have PixelData)
        # Non-image files (like Structured Reports) should be returned as-is
        
        if _is_any_multiframe(datasets):
            logger.info(f"Datasets are already multiframe, returning original datasets.")
            enhanced_datasets.extend(datasets)
            continue
        if is_any_nonimage(datasets):
            logger.info(f"Datasets are non-image, returning original datasets.")
            enhanced_datasets.extend(datasets)
            continue

        # All datasets are single-frame - proceed with normal conversion
        logger.info(f"Converting {len(datasets)} single-frame datasets to enhanced multi-frame DICOM")

        # Sort frames before conversion so pixel data order matches spatial order.
        # highdicom preserves input order for pixel data but builds
        # PerFrameFunctionalGroupsSequence with correct metadata regardless,
        # so unsorted input causes frame-by-frame viewers to show slices out of order.
        # Only sort when all frames share the same orientation — mixed-orientation series
        # (e.g. localizers with axial/coronal/sagittal slices) have no single meaningful
        # spatial order, so we preserve input order for those.
        if all(hasattr(ds, "ImagePositionPatient") and hasattr(ds, "ImageOrientationPatient") for ds in datasets):
            first_orientation = list(datasets[0].ImageOrientationPatient)
            orientations_consistent = all(
                list(ds.ImageOrientationPatient) == first_orientation for ds in datasets
            )
            if orientations_consistent:
                orientation = np.array(first_orientation).reshape(2, 3)
                normal = np.cross(orientation[0], orientation[1])
                datasets = sorted(datasets, key=lambda ds: np.dot(np.array(ds.ImagePositionPatient), normal))
                logger.info("Sorted datasets by spatial position before enhanced conversion")
            else:
                # TODO: consider replacing exact equality with an angular tolerance check
                # (e.g. arccos(|dot(n0, ni)|) < threshold) to be robust to tiny floating-point
                # variations and to detect non-parallel slices within an otherwise consistent series.
                logger.warning("Inconsistent ImageOrientationPatient across series — skipping spatial sort, preserving input order")
        elif all(hasattr(ds, "InstanceNumber") for ds in datasets):
            datasets = sorted(datasets, key=lambda ds: int(ds.InstanceNumber))
            logger.info("Sorted datasets by InstanceNumber before enhanced conversion")
        else:
            logger.warning("Could not determine sorting order for datasets before enhanced conversion")

        metadata = _validate_series_consistency(datasets)
        if not metadata["is_consistent"]:
            logger.warning(f"Series has inconsistent dimensions - returning single-frame datasets")
            enhanced_datasets.extend(datasets)
            continue

        # Check if modality supports Enhanced DICOM conversion
        if not can_convert_to_enhanced_dicom(datasets[0]):
            logger.info(f"Modality {datasets[0].Modality} and SOPClassUID {datasets[0].SOPClassUID} can't be converted to Enhanced DICOM. Returning original datasets.")
            enhanced_datasets.extend(datasets)
            continue

        ## Sort frames before conversion so pixel data order matches spatial order
        ## (highdicom preserves the input order for pixel data but builds
        ## PerFrameFunctionalGroupsSequence with correct metadata regardless,
        ## so unsorted input causes frame-by-frame viewers to show slices out of order)
        if all(hasattr(ds, "ImagePositionPatient") and hasattr(ds, "ImageOrientationPatient") for ds in datasets):
            orientation = np.array(datasets[0].ImageOrientationPatient).reshape(2, 3)
            normal = np.cross(orientation[0], orientation[1])
            datasets.sort(key=lambda ds: np.dot(np.array(ds.ImagePositionPatient), normal))
            logger.info("Sorted datasets by spatial position before enhanced conversion")
        elif all(hasattr(ds, "InstanceNumber") for ds in datasets):
            datasets.sort(key=lambda ds: int(ds.InstanceNumber))
            logger.info("Sorted datasets by InstanceNumber before enhanced conversion")
        else:
            logger.warning("Could not determine sorting order for datasets before enhanced conversion")

        ## Start the conversion to enhanced multiframe DICOM

        # Extract SeriesNumber and InstanceNumber from legacy datasets (use original if available)
        # Convert to native Python int (highdicom requires Python int, not pydicom IS/DS types)
        first_ds = datasets[0]

        series_uid = getattr(first_ds, "SeriesInstanceUID", None)
        if series_uid is None:
            raise ValueError(f"SeriesInstanceUID is missing in the first dataset")

        series_number = getattr(first_ds, "SeriesNumber", None)
        series_number = int(series_number) if series_number is not None else 1
        if series_number < 1:
            logger.warning(f"SeriesNumber was {series_number}, using default value: 1")
            series_number = 1
        instance_number = int(getattr(first_ds, "InstanceNumber", 1))
        if instance_number < 1:
            logger.warning(f"InstanceNumber was {instance_number}, using default value: 1")
            instance_number = 1

        # Note: highdicom's LegacyConverted* classes automatically preserve other important
        # metadata from the legacy datasets including:
        # - StudyInstanceUID
        # - PatientID, PatientName, PatientBirthDate, PatientSex
        # - StudyDate, StudyTime, StudyDescription
        # - Pixel spacing, slice spacing, image orientation/position
        # - And many other standard DICOM attributes

        # Fix any malformed date/time attributes that might cause issues
        for ds in datasets:
            fix_malformed_dicom(ds)

        # Add missing required attributes with default values if needed
        # The enhanced multi-frame DICOM standard requires these attributes
        _ensure_required_attributes(datasets)

        # Generate a NEW SOP Instance UID for the enhanced multi-frame DICOM
        # Note: We do NOT use an original SOP Instance UID because:
        # 1. This is a new DICOM instance (different SOP Class)
        # 2. We're combining multiple instances (each with their own SOP Instance UID) into one
        # 3. DICOM standard requires each instance to have a unique identifier
        new_sop_instance_uid = generate_uid()

        # Suppress common highdicom warnings during conversion
        detected_modality = metadata["modality"]
        
        # Log SOPClassUID for debugging
        first_sop_class = getattr(datasets[0], "SOPClassUID", "N/A")
        logger.info(f"Converting {detected_modality} series with SOPClassUID: {first_sop_class}")

        try:
            with _suppress_highdicom_warnings():
                if detected_modality == "CT" and first_sop_class == '1.2.840.10008.5.1.4.1.1.2':
                    enhanced = LegacyConvertedEnhancedCTImage(
                        legacy_datasets=datasets,
                        series_instance_uid=series_uid,
                        series_number=series_number,
                        sop_instance_uid=new_sop_instance_uid,
                        instance_number=instance_number,
                    )
                elif detected_modality == "MR" and first_sop_class == '1.2.840.10008.5.1.4.1.1.4':
                    enhanced = LegacyConvertedEnhancedMRImage(
                        legacy_datasets=datasets,
                        series_instance_uid=series_uid,
                        series_number=series_number,
                        sop_instance_uid=new_sop_instance_uid,
                        instance_number=instance_number,
                    )
                elif detected_modality == "PT" and first_sop_class == '1.2.840.10008.5.1.4.1.1.128':
                    enhanced = LegacyConvertedEnhancedPETImage(
                        legacy_datasets=datasets,
                        series_instance_uid=series_uid,
                        series_number=series_number,
                        sop_instance_uid=new_sop_instance_uid,
                        instance_number=instance_number,
                    )
                else:
                    # should never happen
                    raise ValueError(f"Unsupported modality: {detected_modality}")

            # After highdicom creates the enhanced image, ALSO set top-level tags
            # for DICOMweb compatibility
            if not hasattr(enhanced, "WindowCenter") and hasattr(datasets[0], "WindowCenter"):
                enhanced.WindowCenter = datasets[0].WindowCenter
            if not hasattr(enhanced, "WindowWidth") and hasattr(datasets[0], "WindowWidth"):
                enhanced.WindowWidth = datasets[0].WindowWidth
            if not hasattr(enhanced, "RescaleSlope") and hasattr(datasets[0], "RescaleSlope"):
                enhanced.RescaleSlope = datasets[0].RescaleSlope
            if not hasattr(enhanced, "RescaleIntercept") and hasattr(datasets[0], "RescaleIntercept"):
                enhanced.RescaleIntercept = datasets[0].RescaleIntercept

            enhanced_datasets.append(enhanced)
        except (ValueError, IndexError, KeyError, AttributeError) as e:
            # highdicom rejected the conversion (unsupported SOP class, malformed data, etc.)
            # Fall back to returning original single-frame datasets
            logger.warning(f"highdicom conversion failed: {e}. Returning original single-frame datasets.")
            enhanced_datasets.extend(datasets)
            continue

    if transfer_syntax_uid in _get_transfer_syntax_constants()["HTJ2K"]:
        logger.info(f"Transcoding {len(enhanced_datasets)} enhanced DICOM series to HTJ2K")
        enhanced_datasets = transcode_datasets_to_htj2k(
            datasets=enhanced_datasets,
            num_resolutions=num_resolutions,
            code_block_size=code_block_size,
            progression_order=progression_order,
        )

    return enhanced_datasets
