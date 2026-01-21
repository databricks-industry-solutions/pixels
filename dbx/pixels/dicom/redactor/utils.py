import copy
import datetime
import hashlib
import os
import re
import tempfile
import time
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor, as_completed

import cv2
import numpy as np
import pydicom
from pydicom.dataset import FileDataset
from pydicom.pixels import as_pixel_options, pixel_array
from pydicom.tag import Tag

from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("DicomRedactorUtils")


def _cleanup_temp_files(fragment_list: dict) -> None:
    """Clean up temporary files created during redaction processing."""
    for temp_file_path in fragment_list.values():
        try:
            if temp_file_path and os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
                logger.debug(f"Cleaned up temp file: {temp_file_path}")
        except OSError as e:
            logger.warning(f"Failed to clean up temp file {temp_file_path}: {e}")


def get_frame(file_path, ds, frame_index=0):
    """
    Returns the frame at the given index. If the dataset has only one frame, returns the original dataset.
    """
    if ds.get("NumberOfFrames", 1) > 1:
        return pixel_array(file_path, index=frame_index)
    else:
        return pixel_array(file_path)


def redact_frame(frame, redaction):
    (x_min, y_min) = redaction["imagePixelCoordinates"]["topLeft"]
    (x_max, y_max) = redaction["imagePixelCoordinates"]["bottomRight"]

    cv2.rectangle(frame, (int(x_min), int(y_min)), (int(x_max), int(y_max)), 0, -1)
    return frame


def handle_global_redaction(file_path, ds, redaction_json):
    """
    Global redaction applies to all frames in the dataset.
    Iterates for each frame in parallel and applies one redaction at a time to the frame.
    """
    fragment_list = {}
    num_frames = ds.get("NumberOfFrames", 1)

    def handle_frame_global_redact(frame_index, file_path, ds, redaction_json):
        frame = get_frame(file_path, ds, frame_index)
        for global_redaction in redaction_json["globalRedactions"]:
            logger.debug(
                f"Redacting {frame_index} with global redaction {global_redaction['annotationUID']}"
            )
            frame = redact_frame(frame, global_redaction)

        with tempfile.NamedTemporaryFile(delete=False, suffix=".bin") as temp_file:
            temp_file.write(frame.tobytes())
            logger.debug(f"Frame {frame_index} written to temp file: {temp_file.name}")
            return temp_file.name

    if "globalRedactions" in redaction_json and len(redaction_json["globalRedactions"]) != 0:
        with ThreadPoolExecutor() as executor:
            future_to_idx = {
                executor.submit(handle_frame_global_redact, idx, file_path, ds, redaction_json): idx
                for idx in range(num_frames)
            }
            for future in as_completed(future_to_idx):
                idx = future_to_idx[future]
                fragment_list[idx] = future.result()
    return fragment_list


def handle_frame_redaction(file_path, ds, redaction_json, dtype, shape, fragment_list={}):
    """
    Frame redaction will be applied to
    """
    num_frames = ds.get("NumberOfFrames", 1)

    def handle_frame_redact(frame_index, frame_redaction):
        frame = None
        for redaction in frame_redaction:
            if num_frames == 1 or redaction["frameIndex"] == frame_index:
                logger.info(
                    f"Redacting frame {frame_index} with redaction {redaction['annotationUID']}"
                )
                if frame is None:
                    if frame_index not in fragment_list:
                        frame = get_frame(file_path, ds, frame_index)
                    else:
                        logger.info(f"Reading {fragment_list[frame_index]}")
                        with open(fragment_list[frame_index], "rb") as buf:
                            frame = copy.deepcopy(
                                np.frombuffer(buf.read(), dtype=dtype).reshape(shape)
                            )

                frame = redact_frame(frame, redaction)

        with tempfile.NamedTemporaryFile(delete=False, suffix=".bin") as temp_file:
            temp_file.write(frame.tobytes())
            logger.info(f"Frame {frame_index} written to temp file: {temp_file.name}")
            return temp_file.name

    if (
        "frameRedactions" in redaction_json
        and len(redaction_json["frameRedactions"]) != 0
        and file_path in redaction_json["frameRedactions"]
    ):
        frame_redaction = redaction_json["frameRedactions"][file_path]

        if num_frames == 1:
            frame_indexes = {0}
        else:
            frame_indexes = set([red["frameIndex"] for red in frame_redaction])

        with ThreadPoolExecutor() as executor:
            future_to_idx = {
                executor.submit(handle_frame_redact, idx, frame_redaction): idx
                for idx in frame_indexes
            }
            for future in as_completed(future_to_idx):
                idx = future_to_idx[future]
                fragment_list[idx] = future.result()
    return fragment_list


def handle_frame_transcode(
    frame_index, file_path, ds, dtype, shape, compressor, encoder_opts, fragment_list={}
):
    from pydicom.pixels import get_encoder

    encoder = get_encoder(compressor)

    if encoder.UID == pydicom.uid.JPEG2000:
        encoder_opts["j2k_cr"] = [ds.get("LossyImageCompressionRatio", 100)]

    if frame_index in fragment_list.keys():
        with open(fragment_list[frame_index], "rb") as f:
            arr = f.read()
    else:
        arr = get_frame(file_path, ds, frame_index).tobytes()

    return encoder.encode(src=arr, index=0, **encoder_opts)


def handle_frame_transcoding(
    file_path, ds, dtype, shape, compressor, encoder_opts, fragment_list={}
):

    frame_bytes = {}
    num_frames = ds.get("NumberOfFrames", 1)

    with ProcessPoolExecutor() as executor:
        future_to_idx = {
            executor.submit(
                handle_frame_transcode,
                idx,
                file_path,
                ds,
                dtype,
                shape,
                compressor,
                encoder_opts,
                fragment_list,
            ): idx
            for idx in range(num_frames)
        }
        for future in as_completed(future_to_idx):
            idx = future_to_idx[future]
            frame_bytes[idx] = future.result()
    return frame_bytes


def handle_metadata_redaction(new_ds, redaction_json):
    if "metadataRedactions" not in redaction_json or len(redaction_json["metadataRedactions"]) == 0:
        return new_ds

    for redaction in redaction_json["metadataRedactions"]:
        logger.info(f"Redacting metadata using {redaction}")

        tag = Tag(redaction["tag"].replace("(", "").replace(")", "").split(","))

        if new_ds.get(tag, None) is None and redaction["action"] != "modify":
            continue

        match redaction["action"]:
            case "remove":
                del new_ds[tag]
            case "redact":
                new_ds[tag].value = "***"  # Redact somehow
            case "modify":
                new_ds[tag].value = redaction["newValue"]
            case "hash":
                new_ds[tag].value = hashlib.sha256(new_ds.get(tag, None).value.encode()).hexdigest()
            case _:
                raise ValueError(f"Invalid action {redaction['action']}")

    new_ds.add_new(Tag("00120063"), "LO", "Databricks PIXELS - Manual Redaction")
    return new_ds


def redact_dcm(file_path, redaction_json, redaction_id, volume, dest_base_path):
    """
    Redact a single DICOM file based on the redaction JSON.

    Args:
        file_path: Path to the DICOM file
        redaction_json: Dictionary containing redaction instructions

    Returns:
        dest_path: Path to the redacted DICOM file
    """
    start_time = time.time()
    logger.info(f"Starting redaction of {file_path} at {datetime.datetime.now().isoformat()}")
    ds = pydicom.dcmread(file_path, stop_before_pixels=True)

    PhotometricInterpretation = "RGB"
    if "MONOCHROME" in ds.get("PhotometricInterpretation"):
        PhotometricInterpretation = ds.get("PhotometricInterpretation")

    # get first frame np dtype and shape
    dtype = pixel_array(file_path, index=0).dtype
    shape = pixel_array(file_path, index=0).shape

    encoder_opts = as_pixel_options(ds)
    encoder_opts["number_of_frames"] = 1  # Force to process one frame
    encoder_opts["photometric_interpretation"] = PhotometricInterpretation

    compressor = pydicom.uid.JPEG2000Lossless
    if ds.get("LossyImageCompression", "00") == "01":
        compressor = pydicom.uid.JPEG2000

    if redaction_json["enableFileOverwrite"]:
        dest_path = file_path
    else:
        catalog_name, schema_name, volume_name = volume.split(".")
        vol_base_path = (
            f"/Volumes/{catalog_name}/{schema_name}/{volume_name}/{dest_base_path}/{redaction_id}/"
        )
        dest_path = vol_base_path + re.sub(r"^(/Volumes/[^/]+/[^/]+/[^/]+/)", "", file_path)
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        logger.info(f"Destination path: {dest_path}")

    fragment_list = {}
    try:
        fragment_list = handle_global_redaction(file_path, ds, redaction_json)
        fragment_list = handle_frame_redaction(
            file_path, ds, redaction_json, dtype, shape, fragment_list
        )

        logger.info(
            f"{len(fragment_list)} frames patched and transcoded at {datetime.datetime.now().isoformat()}"
        )

        # Collect all frame fragments and transcode them
        frame_bytes = handle_frame_transcoding(
            file_path, ds, dtype, shape, compressor, encoder_opts, fragment_list
        )

        # Copy the original dataset's metadata except for PixelData
        new_ds = FileDataset(dest_path, {}, file_meta=ds.file_meta, preamble=ds.preamble)
        for elem in ds:
            if elem.tag != (0x7FE0, 0x0010):  # PixelData
                new_ds.add(copy.deepcopy(elem))
        for elem in ds.file_meta:
            new_ds.file_meta.add(copy.deepcopy(elem))

        if not redaction_json["enableFileOverwrite"]:
            new_ds.SeriesInstanceUID = redaction_json["new_series_instance_uid"]

        new_ds.update(handle_metadata_redaction(new_ds, redaction_json))

        logger.debug(f"{len(frame_bytes)} Frames collected at {datetime.datetime.now().isoformat()}")

        new_ds.file_meta.TransferSyntaxUID = compressor
        new_ds.PhotometricInterpretation = PhotometricInterpretation

        new_ds.PixelData = pydicom.encaps.encapsulate(
            [frame_bytes[idx] for idx in sorted(frame_bytes.keys())]
        )

        logger.debug(f"Encapsulated {len(frame_bytes)} frames at {datetime.datetime.now().isoformat()}")

        new_ds.save_as(dest_path)

        logger.info(f"Redaction completed in {time.time() - start_time:.2f} seconds")
        return dest_path
    finally:
        # Clean up temporary files to prevent resource leak
        _cleanup_temp_files(fragment_list)
