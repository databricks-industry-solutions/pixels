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

import logging
import os
import tempfile
import time
from typing import Iterable, Literal, Sequence

import numpy as np
from nvidia import nvimgcodec

try:
    import pydicom
    from pydicom.sequence import Sequence
    from pydicom.dataset import Dataset as DicomDataset
except ImportError as e:
    raise ImportError("pydicom >= 3.0.0 is required but not installed.") from e
if tuple(int(x) for x in pydicom.__version__.split(".")[:3]) < (3, 0, 0):
    raise ImportError(f"pydicom >= 3.0.0 is required, found {pydicom.__version__}")

from .dicom_utils import fix_malformed_dicom, DicomFileLoader

logger = logging.getLogger(__name__)

# Global singleton instances for nvimgcodec encoder/decoder
# These are initialized lazily on first use to avoid import errors
# when nvimgcodec is not available
_NVIMGCODEC_ENCODER = None
_NVIMGCODEC_DECODER = None


def _get_nvimgcodec_encoder():
    """Get or create the global nvimgcodec encoder instance."""
    global _NVIMGCODEC_ENCODER
    if _NVIMGCODEC_ENCODER is None:

        _NVIMGCODEC_ENCODER = nvimgcodec.Encoder()
    return _NVIMGCODEC_ENCODER


def _get_nvimgcodec_decoder():
    """Get or create the global nvimgcodec decoder instance."""
    global _NVIMGCODEC_DECODER
    if _NVIMGCODEC_DECODER is None:
        _NVIMGCODEC_DECODER = nvimgcodec.Decoder(options=":fancy_upsampling=1")
    return _NVIMGCODEC_DECODER


def _setup_htj2k_decode_params(color_spec=None):
    """
    Create nvimgcodec decoding parameters for DICOM images.

    Args:
        color_spec: Color specification to use. If None, defaults to UNCHANGED.

    Returns:
        nvimgcodec.DecodeParams: Decode parameters configured for DICOM
    """
    if color_spec is None:
        color_spec = nvimgcodec.ColorSpec.UNCHANGED
    decode_params = nvimgcodec.DecodeParams(
        allow_any_depth=True,
        color_spec=color_spec,
    )
    return decode_params


def _setup_htj2k_encode_params(
    num_resolutions: int = 6, code_block_size: tuple = (64, 64), progression_order: str = "RPCL"
):
    """
    Create nvimgcodec encoding parameters for HTJ2K lossless compression.

    Args:
        num_resolutions: Number of wavelet decomposition levels
        code_block_size: Code block size as (height, width) tuple
        progression_order: Progression order for encoding. Must be one of:
            - "LRCP": Layer-Resolution-Component-Position (quality scalability)
            - "RLCP": Resolution-Layer-Component-Position (resolution scalability)
            - "RPCL": Resolution-Position-Component-Layer (progressive by resolution)
            - "PCRL": Position-Component-Resolution-Layer (progressive by spatial area)
            - "CPRL": Component-Position-Resolution-Layer (component scalability)

    Returns:
        tuple: (encode_params, target_transfer_syntax)

    Raises:
        ValueError: If progression_order is not one of the valid values
    """

    # Valid progression orders and their mappings
    VALID_PROG_ORDERS = {
        "LRCP": (nvimgcodec.Jpeg2kProgOrder.LRCP, "1.2.840.10008.1.2.4.201"),  # HTJ2K (Lossless Only)
        "RLCP": (nvimgcodec.Jpeg2kProgOrder.RLCP, "1.2.840.10008.1.2.4.201"),  # HTJ2K (Lossless Only)
        "RPCL": (nvimgcodec.Jpeg2kProgOrder.RPCL, "1.2.840.10008.1.2.4.202"),  # HTJ2K with RPCL Options
        "PCRL": (nvimgcodec.Jpeg2kProgOrder.PCRL, "1.2.840.10008.1.2.4.201"),  # HTJ2K (Lossless Only)
        "CPRL": (nvimgcodec.Jpeg2kProgOrder.CPRL, "1.2.840.10008.1.2.4.201"),  # HTJ2K (Lossless Only)
    }

    # Validate progression order
    if progression_order not in VALID_PROG_ORDERS:
        valid_orders = ", ".join(f"'{o}'" for o in VALID_PROG_ORDERS.keys())
        raise ValueError(f"Invalid progression_order '{progression_order}'. " f"Must be one of: {valid_orders}")

    # Get progression order enum and transfer syntax
    prog_order_enum, target_transfer_syntax = VALID_PROG_ORDERS[progression_order]

    quality_type = nvimgcodec.QualityType.LOSSLESS

    # Configure JPEG2K encoding parameters
    jpeg2k_encode_params = nvimgcodec.Jpeg2kEncodeParams()
    jpeg2k_encode_params.num_resolutions = num_resolutions
    jpeg2k_encode_params.code_block_size = code_block_size
    jpeg2k_encode_params.bitstream_type = nvimgcodec.Jpeg2kBitstreamType.J2K
    jpeg2k_encode_params.prog_order = prog_order_enum
    jpeg2k_encode_params.ht = True  # Enable High Throughput mode

    encode_params = nvimgcodec.EncodeParams(
        quality_type=quality_type,
        jpeg2k_encode_params=jpeg2k_encode_params,
    )

    return encode_params, target_transfer_syntax


def _extract_frames_from_compressed(ds, number_of_frames=None):
    """
    Extract frames from encapsulated (compressed) DICOM pixel data.

    Args:
        ds: pydicom Dataset with encapsulated PixelData
        number_of_frames: Expected number of frames (from NumberOfFrames tag)

    Returns:
        list: List of compressed frame data (bytes)
    """
    # Default to 1 frame if not specified (for single-frame images without NumberOfFrames tag)
    if number_of_frames is None:
        number_of_frames = 1

    frames = list(pydicom.encaps.generate_frames(ds.PixelData, number_of_frames=number_of_frames))
    return frames


def _extract_frames_from_uncompressed(pixel_array, num_frames_tag):
    """
    Extract individual frames from uncompressed pixel array.

    Handles different array shapes:
    - 2D (H, W): single frame grayscale
    - 3D (N, H, W): multi-frame grayscale OR (H, W, C): single frame color
    - 4D (N, H, W, C): multi-frame color

    Args:
        pixel_array: Numpy array of pixel data
        num_frames_tag: NumberOfFrames value from DICOM tag

    Returns:
        list: List of frame arrays
    """
    if not isinstance(pixel_array, np.ndarray):
        pixel_array = np.array(pixel_array)

    # 2D: single frame grayscale
    if pixel_array.ndim == 2:
        return [pixel_array]

    # 3D: multi-frame grayscale OR single-frame color
    if pixel_array.ndim == 3:
        if num_frames_tag > 1 or pixel_array.shape[0] == num_frames_tag:
            # Multi-frame grayscale: (N, H, W)
            return [pixel_array[i] for i in range(pixel_array.shape[0])]
        # Single-frame color: (H, W, C)
        return [pixel_array]

    # 4D: multi-frame color
    if pixel_array.ndim == 4:
        return [pixel_array[i] for i in range(pixel_array.shape[0])]

    raise ValueError(f"Unexpected pixel array dimensions: {pixel_array.ndim}")


def _validate_frames(frames, context_msg="Frame"):
    """
    Check for None values in decoded/encoded frames.

    Args:
        frames: List of frames to validate
        context_msg: Context message for error reporting

    Raises:
        ValueError: If any frame is None
    """
    for idx, frame in enumerate(frames):
        if frame is None:
            raise ValueError(f"{context_msg} {idx} failed (returned None)")

def _get_transfer_syntax_constants():
    """
    Get transfer syntax UID constants for categorizing DICOM files.

    Returns:
        dict: Dictionary with keys 'JPEG2000', 'HTJ2K', 'JPEG', 'NVIMGCODEC' (combined set)
    """
    JPEG2000_SYNTAXES = frozenset(
        [
            "1.2.840.10008.1.2.4.90",  # JPEG 2000 Image Compression (Lossless Only)
            "1.2.840.10008.1.2.4.91",  # JPEG 2000 Image Compression
        ]
    )

    HTJ2K_SYNTAXES = frozenset(
        [
            "1.2.840.10008.1.2.4.201",  # High-Throughput JPEG 2000 Image Compression (Lossless Only)
            "1.2.840.10008.1.2.4.202",  # High-Throughput JPEG 2000 with RPCL Options Image Compression (Lossless Only)
            "1.2.840.10008.1.2.4.203",  # High-Throughput JPEG 2000 Image Compression
        ]
    )

    JPEG_SYNTAXES = frozenset(
        [
            "1.2.840.10008.1.2.4.50",  # JPEG Baseline (Process 1)
            "1.2.840.10008.1.2.4.51",  # JPEG Extended (Process 2 & 4)
            "1.2.840.10008.1.2.4.57",  # JPEG Lossless, Non-Hierarchical (Process 14)
            "1.2.840.10008.1.2.4.70",  # JPEG Lossless, Non-Hierarchical, First-Order Prediction
        ]
    )

    return {
        "JPEG2000": JPEG2000_SYNTAXES,
        "HTJ2K": HTJ2K_SYNTAXES,
        "JPEG": JPEG_SYNTAXES,
        "NVIMGCODEC": JPEG2000_SYNTAXES | HTJ2K_SYNTAXES | JPEG_SYNTAXES,
    }


class ArrayInterfaceObject:
    def __init__(self, frame):
        self._frame = frame
    @property
    def __array_interface__(self):
        return self._frame.__array_interface__

class CudaArrayInterfaceObject:
    def __init__(self, frame):
        self._frame = frame
    @property
    def __cuda_array_interface__(self):
        return self._frame.__cuda_array_interface__

def _as_array(frame):
    if frame.buffer_kind == nvimgcodec.ImageBufferKind.STRIDED_DEVICE:
        return CudaArrayInterfaceObject(frame)
    else:
        return ArrayInterfaceObject(frame)

def transcode_datasets_to_htj2k(
    datasets: list[pydicom.Dataset],
    num_resolutions: int = 6,
    code_block_size: tuple = (64, 64),
    progression_order: str = "RPCL",
    max_batch_size: int = 256,
    skip_transfer_syntaxes: Sequence[str] | Literal["default"] | None = "default",
) -> list[pydicom.Dataset]:
    """
    Transcode pydicom datasets to HTJ2K (High Throughput JPEG 2000) lossless compression.

    HTJ2K is a faster variant of JPEG 2000 that provides better compression performance
    for medical imaging applications. This function uses NVIDIA's nvimgcodec for hardware-
    accelerated decoding and encoding with batch processing for optimal performance.
    All transcoding is performed using lossless compression to preserve image quality.

    The function processes datasets with streaming decode-encode batches:
    1. Categorizes datasets by transfer syntax (HTJ2K/JPEG2000/JPEG/uncompressed)
    2. Extracts all frames from source datasets
    3. Processes frames in batches for efficient encoding:
       - Decodes batch using nvimgcodec (compressed) or pydicom (uncompressed)
       - Immediately encodes batch to HTJ2K
       - Discards decoded frames to save memory (streaming)
    4. Returns transcoded datasets with updated transfer syntax and optional Basic Offset Table

    This streaming approach minimizes memory usage by never holding all decoded frames
    in memory simultaneously.

    Supported source transfer syntaxes:
    - HTJ2K (High-Throughput JPEG 2000) - decoded and re-encoded (add bot if needed)
    - JPEG 2000 (lossless and lossy)
    - JPEG (baseline, extended, lossless)
    - Uncompressed (Explicit/Implicit VR Little/Big Endian)

    Typical compression ratios of 60-70% with lossless quality.
    Processing speed depends on batch size and GPU capabilities.

    Args:
        datasets: List of pydicom Dataset objects to transcode.
                 Each dataset should have PixelData and TransferSyntaxUID attributes.
        num_resolutions: Number of wavelet decomposition levels (default: 6)
                        Higher values = better compression but slower encoding
        code_block_size: Code block size as (height, width) tuple (default: (64, 64))
                        Must be powers of 2. Common values: (32,32), (64,64), (128,128)
        progression_order: Progression order for HTJ2K encoding (default: "RPCL")
                          Must be one of: "LRCP", "RLCP", "RPCL", "PCRL", "CPRL"
                          - "LRCP": Layer-Resolution-Component-Position (quality scalability)
                          - "RLCP": Resolution-Layer-Component-Position (resolution scalability)
                          - "RPCL": Resolution-Position-Component-Layer (progressive by resolution)
                          - "PCRL": Position-Component-Resolution-Layer (progressive by spatial area)
                          - "CPRL": Component-Position-Resolution-Layer (component scalability)
        max_batch_size: Maximum number of frames to decode/encode in parallel (default: 256)
                       This controls internal frame-level batching for GPU operations.
                       Lower values reduce memory usage, higher values may improve GPU utilization.
        skip_transfer_syntaxes: Transfer Syntax UIDs to skip transcoding (default: "default").
                               - "default": Skip HTJ2K, lossy JPEG 2000, and lossy JPEG formats
                               - None or []: Transcode all datasets (don't skip any)
                               - str: Single Transfer Syntax UID to skip
                               - Sequence[str]: Multiple Transfer Syntax UIDs to skip
                               Skipped datasets remain in the returned list unchanged.
                               Example: ["1.2.840.10008.1.2.4.201", "1.2.840.10008.1.2.4.202"]
                               Example: "1.2.840.10008.1.2.4.201"

    Returns:
        list: List of pydicom Dataset objects (same length as input). Successfully transcoded
             datasets have updated TransferSyntaxUID and PixelData. Skipped datasets remain
             unchanged from the input.

    Raises:
        ImportError: If nvidia-nvimgcodec is not available
        ValueError: If datasets are missing required attributes (TransferSyntaxUID, PixelData)
        ValueError: If progression_order is not one of: "LRCP", "RLCP", "RPCL", "PCRL", "CPRL"

    Example:
        >>> import pydicom
        >>> # Read DICOM datasets
        >>> datasets = [pydicom.dcmread(f) for f in ["a.dcm", "b.dcm"]]
        >>> # Transcode to HTJ2K
        >>> transcoded = transcode_datasets_to_htj2k(datasets)
        >>> # Save to disk
        >>> for i, ds in enumerate(transcoded):
        ...     ds.save_as(f"output_{i}.dcm")

        >>> # Custom settings
        >>> transcoded = transcode_datasets_to_htj2k(
        ...     datasets,
        ...     num_resolutions=5,
        ...     code_block_size=(32, 32)
        ... )

        >>> # Skip certain transfer syntaxes
        >>> transcoded = transcode_datasets_to_htj2k(
        ...     datasets,
        ...     skip_transfer_syntaxes=["1.2.840.10008.1.2.4.201"]
        ... )

    Note:
        Requires nvidia-nvimgcodec to be installed:
            pip install nvidia-nvimgcodec-cu{XX}[all]
        Replace {XX} with your CUDA version (e.g., cu13 for CUDA 13.x)

        The function preserves all DICOM metadata including Patient, Study, and Series
        information. Only the transfer syntax and pixel data encoding are modified.
    """

    # Create encoder and decoder instances (reused for all datasets)
    encoder = _get_nvimgcodec_encoder()
    decoder = _get_nvimgcodec_decoder()  # Always needed for decoding input DICOM images

    # Setup HTJ2K encoding parameters
    encode_params, target_transfer_syntax = _setup_htj2k_encode_params(
        num_resolutions=num_resolutions, code_block_size=code_block_size, progression_order=progression_order
    )
    # Note: decode_params is created per-PhotometricInterpretation group in the batch processing
    logger.info("Using lossless HTJ2K compression")

    # Get transfer syntax constants
    ts_constants = _get_transfer_syntax_constants()
    NVIMGCODEC_SYNTAXES = ts_constants["NVIMGCODEC"]

    # Initialize skip list
    # - "default" → use default skip list (HTJ2K, lossy formats)
    # - None → don't skip anything (transcode all)
    # - [] → don't skip anything (transcode all)
    # - str → single UID to skip
    # - Sequence[str] → list of UIDs to skip
    if skip_transfer_syntaxes == "default":
        skip_transfer_syntaxes = (
            ts_constants["HTJ2K"]
            | frozenset(
                [
                    # Lossy JPEG 2000
                    "1.2.840.10008.1.2.4.91",  # JPEG 2000 Image Compression (lossy allowed)
                    # Lossy JPEG
                    "1.2.840.10008.1.2.4.50",  # JPEG Baseline (Process 1) - always lossy
                    "1.2.840.10008.1.2.4.51",  # JPEG Extended (Process 2 & 4, can be lossy)
                ]
            )
        )
    elif skip_transfer_syntaxes is None:
        skip_transfer_syntaxes = []
    elif isinstance(skip_transfer_syntaxes, str):
        # Single string UID - convert to list
        skip_transfer_syntaxes = [skip_transfer_syntaxes]
    
    # Convert to set of strings for faster lookup
    skip_transfer_syntaxes = {str(ts) for ts in skip_transfer_syntaxes}
    if skip_transfer_syntaxes:
        logger.info(f"Datasets with these transfer syntaxes will be skipped: {skip_transfer_syntaxes}")

    start_time = time.time()
    transcoded_count = 0
    skipped_count = 0
    total_datasets = len(datasets)

    # Process the batch of datasets
    batch_datasets = datasets
    nvimgcodec_batch = []
    pydicom_batch = []

    for idx, ds in enumerate(batch_datasets):
        current_ts = getattr(ds, "file_meta", {}).get("TransferSyntaxUID", None)
        if current_ts is None:
            raise ValueError(f"DICOM dataset at index {idx} does not have a Transfer Syntax UID")

        ts_str = str(current_ts)

        # Check if this transfer syntax should be skipped
        has_pixel_data = hasattr(ds, "PixelData") and ds.PixelData is not None
        if ts_str in skip_transfer_syntaxes or not has_pixel_data:
            logger.info(f"  Skipping dataset {idx} (Transfer Syntax: {ts_str}, has_pixel_data: {has_pixel_data})")
            skipped_count += 1
            continue

        assert has_pixel_data, f"DICOM dataset at index {idx} does not have a PixelData member"
        if ts_str in NVIMGCODEC_SYNTAXES:
            nvimgcodec_batch.append(idx)
        else:
            pydicom_batch.append(idx)

    num_frames = []
    encoded_data = []

    # Process nvimgcodec_batch: extract frames, decode, encode in streaming batches
    if nvimgcodec_batch:
        from collections import defaultdict

        # First, extract all compressed frames and group by PhotometricInterpretation
        grouped_frames = defaultdict(list)  # Key: PhotometricInterpretation, Value: list of (dataset_idx, frame_data)
        frame_counts = {}  # Track number of frames per dataset
        successful_nvimgcodec_batch = []  # Track successfully processed datasets

        logger.info(f"  Extracting frames from {len(nvimgcodec_batch)} nvimgcodec datasets:")
        for idx in nvimgcodec_batch:
            try:
                ds = batch_datasets[idx]
                number_of_frames = int(ds.NumberOfFrames) if hasattr(ds, "NumberOfFrames") else None

                if "PixelData" not in ds:
                    logger.warning(f"Skipping dataset (index {idx}): no PixelData found")
                    skipped_count += 1
                    continue

                frames = _extract_frames_from_compressed(ds, number_of_frames)
                logger.info(f"    Dataset idx={idx}: extracted {len(frames)} frames (expected: {number_of_frames})")

                # Get PhotometricInterpretation for this dataset
                photometric = getattr(ds, "PhotometricInterpretation", "UNKNOWN")

                # Store frames grouped by PhotometricInterpretation
                for frame in frames:
                    grouped_frames[photometric].append((idx, frame))

                frame_counts[idx] = len(frames)
                num_frames.append(len(frames))
                successful_nvimgcodec_batch.append(idx)  # Only add if successful
            except Exception as e:
                logger.warning(f"Skipping dataset (index {idx}): {e}")
                skipped_count += 1

        # Update nvimgcodec_batch to only include successfully processed datasets
        nvimgcodec_batch = successful_nvimgcodec_batch

        # Process each PhotometricInterpretation group separately
        logger.info(f"  Found {len(grouped_frames)} unique PhotometricInterpretation groups")

        # Track encoded frames per file to maintain order
        encoded_frames_by_file = {idx: [] for idx in nvimgcodec_batch}

        for photometric, frame_list in grouped_frames.items():
            # Determine color_spec based on PhotometricInterpretation
            if photometric.startswith("YBR"):
                color_spec = nvimgcodec.ColorSpec.SRGB
                logger.info(
                    f"  Processing {len(frame_list)} frames with PhotometricInterpretation={photometric} using color_spec=SRGB"
                )
            else:
                color_spec = nvimgcodec.ColorSpec.UNCHANGED
                logger.info(
                    f"  Processing {len(frame_list)} frames with PhotometricInterpretation={photometric} using color_spec=UNCHANGED"
                )

            # Create decode params for this group
            group_decode_params = _setup_htj2k_decode_params(color_spec=color_spec)

            # Extract just the frame data (without file index)
            compressed_frames = [frame_data for _, frame_data in frame_list]

            # Decode and encode in batches (streaming to reduce memory)
            total_frames = len(compressed_frames)

            for frame_batch_start in range(0, total_frames, max_batch_size):
                frame_batch_end = min(frame_batch_start + max_batch_size, total_frames)
                compressed_batch = compressed_frames[frame_batch_start:frame_batch_end]
                file_indices_batch = [file_idx for file_idx, _ in frame_list[frame_batch_start:frame_batch_end]]

                if total_frames > max_batch_size:
                    logger.info(
                        f"    Processing frames [{frame_batch_start}..{frame_batch_end}) of {total_frames} for {photometric}"
                    )

                # Decode batch with appropriate color_spec
                decoded_batch = decoder.decode(compressed_batch, params=group_decode_params)
                _validate_frames(decoded_batch, f"Decoded frame [{frame_batch_start}+")

                # TODO(janton): Remove this workaround when nvimgcodec > 0.7.0 is widely available
                # For nvimgcodec <= 0.7.0, it doesn't understand that SAMPLING_NONE and SAMPLING_GRAY are compatible,
                # so we drop the image object and pass array wrapper instead.
                decoded_batch = [_as_array(frame) for frame in decoded_batch]

                # Encode batch immediately (streaming - no need to keep decoded data)
                encoded_batch = encoder.encode(decoded_batch, codec="jpeg2k", params=encode_params)
                _validate_frames(encoded_batch, f"Encoded frame [{frame_batch_start}+")

                # Store encoded frames by file index to maintain order
                for file_idx, encoded_frame in zip(file_indices_batch, encoded_batch):
                    encoded_frames_by_file[file_idx].append(encoded_frame)

                # decoded_batch is automatically freed here

        # Reconstruct encoded_data in original dataset order
        for idx in nvimgcodec_batch:
            encoded_data.extend(encoded_frames_by_file[idx])

    # Process pydicom_batch: extract frames and encode in streaming batches
    if pydicom_batch:
        # Print DICOM metadata for first dataset
        if pydicom_batch and batch_datasets:
            first_ds = batch_datasets[pydicom_batch[0]]
            logger.info(f"  DICOM Metadata (first dataset):")
            logger.info(f"    BitsAllocated: {getattr(first_ds, 'BitsAllocated', 'N/A')}")
            logger.info(f"    BitsStored: {getattr(first_ds, 'BitsStored', 'N/A')}")
            logger.info(f"    HighBit: {getattr(first_ds, 'HighBit', 'N/A')}")
            logger.info(f"    PixelRepresentation: {getattr(first_ds, 'PixelRepresentation', 'N/A')}")
            logger.info(f"    SamplesPerPixel: {getattr(first_ds, 'SamplesPerPixel', 'N/A')}")
            logger.info(f"    PhotometricInterpretation: {getattr(first_ds, 'PhotometricInterpretation', 'N/A')}")
            logger.info(f"    Rows: {getattr(first_ds, 'Rows', 'N/A')}")
            logger.info(f"    Columns: {getattr(first_ds, 'Columns', 'N/A')}")
        
        # Extract all frames from uncompressed datasets
        all_decoded_frames = []
        successful_pydicom_batch = []  # Track successfully processed datasets

        for idx in pydicom_batch:
            try:
                ds = batch_datasets[idx]
                fix_malformed_dicom(ds)
                num_frames_tag = int(ds.NumberOfFrames) if hasattr(ds, "NumberOfFrames") else 1
                if "PixelData" in ds:
                    frames = _extract_frames_from_uncompressed(ds.pixel_array, num_frames_tag)
                    all_decoded_frames.extend(frames)
                    num_frames.append(len(frames))
                    successful_pydicom_batch.append(idx)  # Only add if successful
                else:
                    # No PixelData - log warning and skip dataset completely
                    logger.warning(f"Skipping dataset (index {idx}): no PixelData found")
                    skipped_count += 1
            except Exception as e:
                logger.warning(f"Skipping dataset (index {idx}): {e}")
                skipped_count += 1

        # Encode in batches (streaming)
        total_frames = len(all_decoded_frames)
        if total_frames > 0:
            logger.info(f"  Encoding {total_frames} uncompressed frames in batches of {max_batch_size}")
            
            # Print statistics of the uncompressed frames
            if all_decoded_frames:
                logger.info(f"  Frame statistics:")
                for i, frame in enumerate(all_decoded_frames[:5]):  # Show stats for first 5 frames
                    logger.info(f"    Frame {i}: shape={frame.shape}, dtype={frame.dtype}, "
                               f"min={np.min(frame)}, max={np.max(frame)}, "
                               f"mean={np.mean(frame):.2f}, std={np.std(frame):.2f}")
                if total_frames > 5:
                    logger.info(f"    ... ({total_frames - 5} more frames)")
            
            for frame_batch_start in range(0, total_frames, max_batch_size):
                frame_batch_end = min(frame_batch_start + max_batch_size, total_frames)
                decoded_batch = all_decoded_frames[frame_batch_start:frame_batch_end]

                if total_frames > max_batch_size:
                    logger.info(f"    Encoding frames [{frame_batch_start}..{frame_batch_end}) of {total_frames}")

                # Encode batch
                encoded_batch = encoder.encode(decoded_batch, codec="jpeg2k", params=encode_params)
                _validate_frames(encoded_batch, f"Encoded frame [{frame_batch_start}+")

                # Store encoded frames
                encoded_data.extend(encoded_batch)

        # Update pydicom_batch to only include successfully processed datasets
        pydicom_batch = successful_pydicom_batch

    # Reassemble and update transcoded datasets
    frame_offset = 0
    datasets_to_process = nvimgcodec_batch + pydicom_batch

    for list_idx, dataset_idx in enumerate(datasets_to_process):
        nframes = num_frames[list_idx]
        encoded_frames = [bytes(enc) for enc in encoded_data[frame_offset : frame_offset + nframes]]
        frame_offset += nframes

        # Update dataset with HTJ2K encoded data
        # Create Basic Offset Table for multi-frame files if requested
        batch_datasets[dataset_idx].PixelData = pydicom.encaps.encapsulate(
            encoded_frames, has_bot=True
        )
        batch_datasets[dataset_idx].file_meta.TransferSyntaxUID = pydicom.uid.UID(target_transfer_syntax)

        # Update PhotometricInterpretation to RGB for YBR images since we decoded with RGB color_spec
        # The pixel data is now in RGB color space, so the metadata must reflect this
        # to prevent double conversion by DICOM readers
        if hasattr(batch_datasets[dataset_idx], "PhotometricInterpretation"):
            original_pi = batch_datasets[dataset_idx].PhotometricInterpretation
            if original_pi.startswith("YBR"):
                batch_datasets[dataset_idx].PhotometricInterpretation = "RGB"
                logger.info(f"  Updated PhotometricInterpretation: {original_pi} -> RGB")

        transcoded_count += 1
        logger.info(f"  Transcoded dataset {dataset_idx}")

    elapsed_time = time.time() - start_time

    logger.info(f"Transcoding complete:")
    logger.info(f"  Total datasets: {total_datasets}")
    logger.info(f"  Successfully transcoded: {transcoded_count}")
    logger.info(f"  Skipped: {skipped_count}")
    logger.info(f"  Time elapsed: {elapsed_time:.2f} seconds")

    return batch_datasets
