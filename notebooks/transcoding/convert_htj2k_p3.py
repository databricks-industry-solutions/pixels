import logging
import os
import tempfile
import time

import numpy as np
import pydicom

from torch.utils.data import DataLoader

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
        from nvidia import nvimgcodec

        _NVIMGCODEC_ENCODER = nvimgcodec.Encoder()
    return _NVIMGCODEC_ENCODER


def _get_nvimgcodec_decoder():
    """Get or create the global nvimgcodec decoder instance."""
    global _NVIMGCODEC_DECODER
    if _NVIMGCODEC_DECODER is None:
        from nvidia import nvimgcodec

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
    from nvidia import nvimgcodec

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
    from nvidia import nvimgcodec

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


def transcode_dicom_to_htj2k(
    dataloader: DataLoader,
    root_dir:str,
    output_dir: str,
    num_resolutions: int = 6,
    code_block_size: tuple = (64, 64),
    progression_order: str = "RPCL",
    max_batch_size: int = 256,
    add_basic_offset_table: bool = True,
    skip_transfer_syntaxes: list = (
        _get_transfer_syntax_constants()["HTJ2K"]
        | frozenset(
            [
                # Lossy JPEG 2000
                "1.2.840.10008.1.2.4.91",  # JPEG 2000 Image Compression (lossy allowed)
                # Lossy JPEG
                "1.2.840.10008.1.2.4.50",  # JPEG Baseline (Process 1) - always lossy
                "1.2.840.10008.1.2.4.51",  # JPEG Extended (Process 2 & 4, can be lossy)
            ]
        )
    ),
) -> str:
    """
    Transcode DICOM files to HTJ2K (High Throughput JPEG 2000) lossless compression.

    HTJ2K is a faster variant of JPEG 2000 that provides better compression performance
    for medical imaging applications. This function uses nvidia-nvimgcodec for hardware-
    accelerated decoding and encoding with batch processing for optimal performance.
    All transcoding is performed using lossless compression to preserve image quality.

    The function processes files with streaming decode-encode batches:
    1. Categorizes files by transfer syntax (HTJ2K/JPEG2000/JPEG/uncompressed)
    2. Extracts all frames from source files
    3. Processes frames in batches of max_batch_size:
       - Decodes batch using nvimgcodec (compressed) or pydicom (uncompressed)
       - Immediately encodes batch to HTJ2K
       - Discards decoded frames to save memory (streaming)
    4. Saves transcoded files with updated transfer syntax and optional Basic Offset Table

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
        input_dir: Path to directory containing DICOM files to transcode
        output_dir: Path to output directory for transcoded files. If None, creates temp directory
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
        max_batch_size: Maximum number of DICOM files to process in each batch (default: 256)
                       Lower values reduce memory usage, higher values may improve speed
        add_basic_offset_table: If True, creates Basic Offset Table for multi-frame DICOMs (default: True)
                               BOT enables O(1) frame access without parsing entire pixel data stream
                               Per DICOM Part 5 Section A.4. Only affects multi-frame files.
        skip_transfer_syntaxes: Optional list of Transfer Syntax UIDs to skip transcoding (default: HTJ2K, lossy JPEG 2000, and lossy JPEG)
                               Files with these transfer syntaxes will be copied directly to output
                               without transcoding. Useful for preserving already-compressed formats.
                               Example: ["1.2.840.10008.1.2.4.201", "1.2.840.10008.1.2.4.202"]

    Returns:
        str: Path to output directory containing transcoded DICOM files

    Raises:
        ImportError: If nvidia-nvimgcodec is not available
        ValueError: If input directory doesn't exist or contains no valid DICOM files
        ValueError: If DICOM files are missing required attributes (TransferSyntaxUID, PixelData)
        ValueError: If progression_order is not one of: "LRCP", "RLCP", "RPCL", "PCRL", "CPRL"

    Example:
        >>> # Basic usage with default settings
        >>> output_dir = transcode_dicom_to_htj2k("/path/to/dicoms")
        >>> print(f"Transcoded files saved to: {output_dir}")

        >>> # Custom output directory and batch size
        >>> output_dir = transcode_dicom_to_htj2k(
        ...     input_dir="/path/to/dicoms",
        ...     output_dir="/path/to/output",
        ...     max_batch_size=50,
        ...     num_resolutions=5
        ... )

        >>> # Process with smaller code blocks for memory efficiency
        >>> output_dir = transcode_dicom_to_htj2k(
        ...     input_dir="/path/to/dicoms",
        ...     code_block_size=(32, 32),
        ...     max_batch_size=5
        ... )

        >>> # Skip transcoding for files already in HTJ2K format
        >>> output_dir = transcode_dicom_to_htj2k(
        ...     input_dir="/path/to/dicoms",
        ...     skip_transfer_syntaxes=["1.2.840.10008.1.2.4.201", "1.2.840.10008.1.2.4.202"]
        ... )

    Note:
        Requires nvidia-nvimgcodec to be installed:
            pip install nvidia-nvimgcodec-cu{XX}[all]
        Replace {XX} with your CUDA version (e.g., cu13 for CUDA 13.x)

        The function preserves all DICOM metadata including Patient, Study, and Series
        information. Only the transfer syntax and pixel data encoding are modified.
    """
    import glob
    import shutil
    from pathlib import Path

    # Check for nvidia-nvimgcodec
    try:
        from nvidia import nvimgcodec
    except ImportError:
        raise ImportError(
            "nvidia-nvimgcodec is required for HTJ2K transcoding. "
            "Install it with: pip install nvidia-nvimgcodec-cu{XX}[all] "
            "(replace {XX} with your CUDA version, e.g., cu13)"
        )



    # Create output directory
    if output_dir is None:
        output_dir = tempfile.mkdtemp(prefix="htj2k_")
    else:
        os.makedirs(output_dir, exist_ok=True)

    # Create encoder and decoder instances (reused for all files)
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
    if skip_transfer_syntaxes is None:
        skip_transfer_syntaxes = []
    else:
        # Convert to set of strings for faster lookup
        skip_transfer_syntaxes = {str(ts) for ts in skip_transfer_syntaxes}
        logger.info(f"Files with these transfer syntaxes will be copied without transcoding: {skip_transfer_syntaxes}")

    start_time = time.time()
    transcoded_count = 0
    skipped_count = 0

    # Calculate batch info for logging
#    total_files = len(valid_dicom_files)
#    total_batches = (total_files + max_batch_size - 1) // max_batch_size

#    for batch_start in range(0, total_files, max_batch_size):
    total_files = 0
    for batch_in, batch_out in dataloader:
        #batch_end = min(batch_start + max_batch_size, total_files)
        #current_batch = batch_start // max_batch_size + 1
        #logger.info(f"[{batch_start}..{batch_end}] Processing batch {current_batch}/{total_batches}")
        #batch_files = valid_dicom_files[batch_start:batch_end]


        batch_datasets = [pydicom.dcmread(file) for file in batch_in]
        total_files += len(batch_datasets)
        nvimgcodec_batch = []
        pydicom_batch = []
        skip_batch = []  # Indices of files to skip (copy directly)

        for idx, ds in enumerate(batch_datasets):
            current_ts = getattr(ds, "file_meta", {}).get("TransferSyntaxUID", None)
            if current_ts is None:
                raise ValueError(f"DICOM file {os.path.basename(batch_in[idx])} does not have a Transfer Syntax UID")

            ts_str = str(current_ts)

            # Check if this transfer syntax should be skipped
            if ts_str in skip_transfer_syntaxes:
                skip_batch.append(idx)
                logger.info(f"  Skipping {os.path.basename(batch_in[idx])} (Transfer Syntax: {ts_str})")
                continue

            if ts_str in NVIMGCODEC_SYNTAXES:
                if not hasattr(ds, "PixelData") or ds.PixelData is None:
                    raise ValueError(
                        f"DICOM file {os.path.basename(batch_in[idx])} does not have a PixelData member"
                    )
                nvimgcodec_batch.append(idx)
            else:
                pydicom_batch.append(idx)

        # Handle skip_batch: copy files directly to output
        if skip_batch:
            for idx in skip_batch:
                source_file = batch_in[idx]
                output_file = os.path.join(output_dir, os.path.basename(source_file))
                shutil.copy2(source_file, output_file)
                skipped_count += 1
                logger.info(f"  Copied {os.path.basename(source_file)} to output (skipped transcoding)")

        num_frames = []
        encoded_data = []

        # Process nvimgcodec_batch: extract frames, decode, encode in streaming batches
        if nvimgcodec_batch:
            from collections import defaultdict

            # First, extract all compressed frames and group by PhotometricInterpretation
            grouped_frames = defaultdict(list)  # Key: PhotometricInterpretation, Value: list of (file_idx, frame_data)
            frame_counts = {}  # Track number of frames per file

            logger.info(f"  Extracting frames from {len(nvimgcodec_batch)} nvimgcodec files:")
            for idx in nvimgcodec_batch:
                ds = batch_datasets[idx]
                number_of_frames = int(ds.NumberOfFrames) if hasattr(ds, "NumberOfFrames") else None
                frames = _extract_frames_from_compressed(ds, number_of_frames)
                logger.info(
                    f"    File idx={idx} ({os.path.basename(batch_in[idx])}): extracted {len(frames)} frames (expected: {number_of_frames})"
                )

                # Get PhotometricInterpretation for this file
                photometric = getattr(ds, "PhotometricInterpretation", "UNKNOWN")

                # Store frames grouped by PhotometricInterpretation
                for frame in frames:
                    grouped_frames[photometric].append((idx, frame))

                frame_counts[idx] = len(frames)
                num_frames.append(len(frames))

            # Process each PhotometricInterpretation group separately
            logger.info(f"  Found {len(grouped_frames)} unique PhotometricInterpretation groups")

            # Track encoded frames per file to maintain order
            encoded_frames_by_file = {idx: [] for idx in nvimgcodec_batch}

            for photometric, frame_list in grouped_frames.items():
                # Determine color_spec based on PhotometricInterpretation
                if photometric.startswith("YBR"):
                    color_spec = nvimgcodec.ColorSpec.RGB
                    logger.info(
                        f"  Processing {len(frame_list)} frames with PhotometricInterpretation={photometric} using color_spec=RGB"
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

                    # Encode batch immediately (streaming - no need to keep decoded data)
                    encoded_batch = encoder.encode(decoded_batch, codec="jpeg2k", params=encode_params)
                    _validate_frames(encoded_batch, f"Encoded frame [{frame_batch_start}+")

                    # Store encoded frames by file index to maintain order
                    for file_idx, encoded_frame in zip(file_indices_batch, encoded_batch):
                        encoded_frames_by_file[file_idx].append(encoded_frame)

                    # decoded_batch is automatically freed here

            # Reconstruct encoded_data in original file order
            for idx in nvimgcodec_batch:
                encoded_data.extend(encoded_frames_by_file[idx])

        # Process pydicom_batch: extract frames and encode in streaming batches
        if pydicom_batch:
            # Extract all frames from uncompressed files
            all_decoded_frames = []

            for idx in pydicom_batch:
                try:
                    ds = batch_datasets[idx]
                    num_frames_tag = int(ds.NumberOfFrames) if hasattr(ds, "NumberOfFrames") else 1
                    if  "PixelData" in ds:
                        frames = _extract_frames_from_uncompressed(ds.pixel_array, num_frames_tag)
                        all_decoded_frames.extend(frames)
                        num_frames.append(len(frames))
                    else:
                        # insert 1 empty frame
                        frames = []
                        all_decoded_frames.extend(frames)
                        num_frames.append(1)
                        logger.warn(f"pydicom_batch:{idx=} {int(ds.NumberOfFrames) if hasattr(ds, "NumberOfFrames") else "no 'NumberOfFrames' tag found"}")
                        logger.warn(f"pydicom_batch:{idx=} {batch_in[idx]=} has no PixelData")
                except Exception as e:
                    logger.warn(f"pydicom_batch:{idx=} {batch_in[idx]=} has {e}.\n Skipping")

            # Encode in batches (streaming)
            total_frames = len(all_decoded_frames)
            if total_frames > 0:
                logger.info(f"  Encoding {total_frames} uncompressed frames in batches of {max_batch_size}")

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

        # Reassemble and save transcoded files
        frame_offset = 0
        files_to_process = nvimgcodec_batch + pydicom_batch

        for list_idx, dataset_idx in enumerate(files_to_process):
            nframes = num_frames[list_idx]
            encoded_frames = [bytes(enc) for enc in encoded_data[frame_offset : frame_offset + nframes]]
            frame_offset += nframes

            # Update dataset with HTJ2K encoded data
            # Create Basic Offset Table for multi-frame files if requested
            batch_datasets[dataset_idx].PixelData = pydicom.encaps.encapsulate(
                encoded_frames, has_bot=add_basic_offset_table
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

            try:
                # Save transcoded file
                input_file = batch_in[dataset_idx]
                relative_path = os.path.relpath(input_file, root_dir)
                output_file = os.path.join(output_dir, relative_path)
                os.makedirs(os.path.dirname(output_file), exist_ok=True)

                batch_datasets[dataset_idx].save_as(output_file)
                transcoded_count += 1
                logger.info(f"#{transcoded_count}: Transcoded {input_file}, saving as: {output_file}")
            except Exception as e:
                logger.error(f"Error saving transcoded {input_file} file: {output_file}")
                logger.error(f"Error: {e}")

    elapsed_time = time.time() - start_time

    logger.info(f"Transcoding complete:")
    logger.info(f"  Total files: {total_files}")
    logger.info(f"  Successfully transcoded: {transcoded_count}")
    logger.info(f"  Skipped (copied without transcoding): {skipped_count}")
    logger.info(f"  Time elapsed: {elapsed_time:.2f} seconds")
    logger.info(f"  Output directory: {output_dir}")

    return output_dir