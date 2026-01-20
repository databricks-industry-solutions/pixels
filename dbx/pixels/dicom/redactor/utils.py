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
from pydicom import dcmread
from pydicom.pixels import as_pixel_options, pixel_array
from pydicom.tag import Tag

from typing import Dict, List

from dbx.pixels.dicom.dicom_utils import remove_dbfs_prefix
from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("DicomRedactorUtils")

def get_frame(file_path: str, frame_index: int = 0):
    """
    Returns the frame at the given index. If the dataset has only one frame, returns the original dataset.
    """
    ds = dcmread(remove_dbfs_prefix(file_path))
    if ds.get("NumberOfFrames", 1) > 1:
        return pixel_array(ds, index=frame_index)
    else:
        return pixel_array(ds)


def redact_frame(frame, redaction):
    # TODO: topLeft should be x_min, y_max
    # bottomRight should be x_max, y_min
    # cv2.rectangle expects (top_left, bottom_right), i.e. (x_min, y_max), (x_max, y_min)
    (x_min, y_max) = redaction["imagePixelCoordinates"]["topLeft"]
    (x_max, y_min) = redaction["imagePixelCoordinates"]["bottomRight"]

    cv2.rectangle(frame, (int(x_min), int(y_max)), (int(x_max), int(y_min)), 0, -1)
    return frame


def frame_iterator(file_path: str, some_fn, executor_type: str = "threadpool", max_frames: int = 0, **kwargs):
    """
    Global redaction applies to all frames in the dataset.
    Iterates for each frame in parallel and applies one redaction at a time to the frame.
    """
    file_path = remove_dbfs_prefix(file_path)
    ds = dcmread(file_path)
    results = {}
    num_frames = ds.get("NumberOfFrames", 1)
    if max_frames <= 0:
        max_frames = num_frames
    else:
        max_frames = min(num_frames, max_frames)

    if num_frames > 0:
        if "thread" in executor_type.lower():
            exec = ThreadPoolExecutor()
        elif "process" in executor_type.lower():
            exec = ProcessPoolExecutor()
        else:
            logger.warn(f"Invalid executor type: {executor_type}. Defaults to ThreadPoolExecutor")
        with exec as executor:
            future_to_idx = {
                executor.submit(some_fn, frame_index=idx, file_path=file_path, **kwargs):idx for idx in range(max_frames)
            }
            for future in as_completed(future_to_idx):
                idx = future_to_idx[future]
                results[idx] = future.result()
    else:
        results[0] = some_fn(**kwargs)
    return results

  
def merge_results_from_frame_iterator(frame_iterator_output):
    """
    Extends the frame_iterator_output[0] with frame_iterator_output[i] such that it resembles redaction_json
    """
    redaction_json_all_frames = frame_iterator_output[0]
    for k,v in frame_iterator_output.items():
        if k > 0:
            paths = redaction_json_all_frames['frameRedactions']
            for path in paths:
                redaction_json_all_frames['frameRedactions'][path].extend(v['frameRedactions'][path])
    return redaction_json_all_frames


def handle_frame_global_redact(frame_index, file_path, redaction_json):
    file_path = remove_dbfs_prefix(file_path)
    ds = dcmread(file_path)
    frame = get_frame(file_path, frame_index)
    for global_redaction in redaction_json["globalRedactions"]:
        logger.debug(
            f"Redacting {frame_index} with global redaction {global_redaction['annotationUID']}"
        )
        frame = redact_frame(frame, global_redaction)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".bin") as temp_file:
        temp_file.write(frame.tobytes())
        logger.debug(f"Frame {frame_index} written to temp file: {temp_file.name}")
        return temp_file.name
        

def handle_global_redaction(file_path, redaction_json):
    """
    Global redaction applies to all frames in the dataset.
    Iterates for each frame in parallel and applies one redaction at a time to the frame.
    """
    if "globalRedactions" in redaction_json and (len(redaction_json["globalRedactions"])!= 0):
        return frame_iterator(file_path, handle_frame_global_redact, redaction_json=redaction_json)
    else:
        return {}
    

def handle_frame_redact(frame_index, file_path, frame_redaction, dtype, shape, fragment_list: Dict={}):
    if not fragment_list:
        fragment_list = {}
        logger.warn("fragment_list should not be None but at least an empty dict {}")

    file_path = remove_dbfs_prefix(file_path)
    ds = dcmread(file_path)
    num_frames = ds.get("NumberOfFrames", 1)
    frame = None

    for redaction in frame_redaction:
        if num_frames == 1 or redaction["frameIndex"] == frame_index:
            logger.info(
                f"Redacting frame {frame_index} with redaction {redaction['annotationUID']}"
            )
            if frame is None:
                if frame_index not in fragment_list:
                    frame = get_frame(file_path, frame_index)
                else:
                    logger.info(f"Reading {fragment_list[frame_index]}")
                    with open(fragment_list[frame_index], "rb") as buf:
                        frame = copy.deepcopy(
                            np.frombuffer(buf.read(), dtype=dtype).reshape(shape)
                        )
            frame = redact_frame(frame, redaction)

    if frame is not None:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".bin") as temp_file:
            temp_file.write(frame.tobytes())
            logger.info(f"Frame {frame_index} written to temp file: {temp_file.name}")
            return temp_file.name
    else:
        logger.warn(f"frame is None. Nothing to output")
        return None


def handle_frame_redaction(file_path: str, redaction_json, dtype, shape, fragment_list: Dict={}):
    """
    Frame redaction will be applied to
    """
    if not fragment_list:
        fragment_list = {}
        logger.warn("fragment_list should not be None but at least an empty dict {}")

    file_path = remove_dbfs_prefix(file_path)
    ds = dcmread(file_path)
    num_frames = ds.get("NumberOfFrames", 1)

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
        results = frame_iterator(file_path, handle_frame_redact, frame_redaction=frame_redaction, dtype=dtype, shape=shape, fragment_list=fragment_list)
    else:
        logger.warn(f"No frameRedactions for file_path {file_path}, returning empty list")
        results = {}
    fragment_list.update(results)
    return fragment_list


def handle_frame_transcode(
    frame_index, file_path, compressor, encoder_opts, fragment_list: Dict = {}
):
    from pydicom.pixels import get_encoder

    if not fragment_list:
        fragment_list = {}
        logger.warn("fragment_list should not be None but at least an empty dict {}")

    file_path = remove_dbfs_prefix(file_path)
    ds = dcmread(file_path)
    encoder = get_encoder(compressor)

    if encoder.UID == pydicom.uid.JPEG2000:
        encoder_opts["j2k_cr"] = [ds.get("LossyImageCompressionRatio", 100)]

    if frame_index in fragment_list:
        if fragment_list.get(frame_index):
            arr = open(fragment_list[frame_index], "rb").read()
        else:
            arr = get_frame(file_path, frame_index).tobytes()
            logger.warn(f"{fragment_list[frame_index]} is None and cannot be read as a file.")
    else:
        arr = get_frame(file_path, frame_index).tobytes()
        logger.warn(f"fragment_list missing frame_index {frame_index} key")

    return encoder.encode(src=arr, index=0, **encoder_opts)


def handle_frame_transcoding(file_path, compressor, encoder_opts, fragment_list: Dict = {}):
    if not fragment_list: 
        fragment_list = {}
        logger.warn("fragment_list should not be None but at least an empty dict {}")

    file_path = remove_dbfs_prefix(file_path)
    ds = dcmread(file_path)
    num_frames = ds.get("NumberOfFrames", 1)
    return frame_iterator(file_path, handle_frame_transcode, compressor=compressor, encoder_opts=encoder_opts, fragment_list=fragment_list, executor_type="process")


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


def redact_dcm(file_path: str, redaction_json, redaction_id, dest_base_path):
    """
    Redact a single DICOM file based on the redaction JSON.

    Args:
        file_path: Path to the DICOM file
        redaction_json: Dictionary containing redaction instructions

    Returns:
        dest_path: Path to the redacted DICOM file
    """
    if file_path is None:
        return None
    else:
        start_time = time.time()
        logger.info(f"Starting redaction of {file_path} at {datetime.datetime.now().isoformat()}")
        file_path = remove_dbfs_prefix(file_path)
        ds = pydicom.dcmread(file_path, stop_before_pixels=False) # Yen: need to set to False to get dtype and shape later

        PhotometricInterpretation = "RGB"
        if "MONOCHROME" in ds.get("PhotometricInterpretation"):
            PhotometricInterpretation = ds.get("PhotometricInterpretation")

        # get first frame np dtype and shape
        dtype = pixel_array(ds, index=0).dtype
        shape = pixel_array(ds, index=0).shape

        encoder_opts = as_pixel_options(ds)
        encoder_opts["number_of_frames"] = 1  # Force to process one frame
        encoder_opts["photometric_interpretation"] = PhotometricInterpretation

        compressor = pydicom.uid.JPEG2000Lossless
        if ds.get("LossyImageCompression", "00") == "01":
            compressor = pydicom.uid.JPEG2000

        if redaction_json["enableFileOverwrite"]:
            dest_path = file_path
        else:
            # TODO: too restrictive. Just let users set dest_path directly
            #catalog_name, schema_name, volume_name = volume.split(".")
            # vol_base_path = (
            #     f"/Volumes/{catalog_name}/{schema_name}/{volume_name}/{dest_base_path}/{redaction_id}/"
            # )
            vol_base_path = dest_base_path
            # TODO: this assumes file_path must be in vol
            # dest_path = vol_base_path + re.sub(r"^(/Volumes/[^/]+/[^/]+/[^/]+/)", "", file_path)
            base_file_path = file_path.split("/")[-1]
            dest_path = f"{vol_base_path}/{base_file_path}"
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            logger.info(f"Destination path: {dest_path}")
        
        fragment_list = handle_global_redaction(file_path, redaction_json)
        fragment_list = handle_frame_redaction(file_path, redaction_json, dtype, shape, fragment_list)

        logger.info(
            f"{len(fragment_list)} frames patched and transcoded at {datetime.datetime.now().isoformat()}"
        )

        # Collect all frame fragments and transcode them
        frame_bytes = handle_frame_transcoding(file_path, compressor, encoder_opts, fragment_list)

        # Copy the original dataset's metadata except for PixelData
        new_ds = FileDataset(dest_path, {}, file_meta=ds.file_meta, preamble=ds.preamble)
        for elem in ds:
            if elem.tag != (0x7FE0, 0x0010):  # PixelData
                new_ds.add(copy.deepcopy(elem))
        for elem in ds.file_meta:
            new_ds.file_meta.add(copy.deepcopy(elem))

        if not redaction_json["enableFileOverwrite"]:
            # TODO: is new_series_instance_uid a new JSON key?
            new_ds.SeriesInstanceUID = redaction_json.get("new_series_instance_uid")

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
