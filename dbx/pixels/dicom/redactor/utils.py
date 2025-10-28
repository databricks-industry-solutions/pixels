import cv2
import pydicom
import numpy as np
import tempfile
from concurrent.futures import ThreadPoolExecutor, as_completed
import time
import datetime
import os
import copy
from pydicom.dataset import FileDataset
import re

from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider("DicomRedactorUtils")

def redact_frame(frame, redaction):
  frame_dec = None
  
  if not isinstance(frame, np.ndarray):
    frame = np.frombuffer(frame, dtype=np.uint8)
  try:
    frame_dec = cv2.imdecode(frame, cv2.IMREAD_UNCHANGED)
  except:
    logger.warning("Failed to decode frame, is it already decoded? Processing original frame.")

  to_process = frame if frame_dec is None else frame_dec

  (x_min, y_min) = redaction['imagePixelCoordinates']['topLeft']
  (x_max, y_max) = redaction['imagePixelCoordinates']['bottomRight']

  cv2.rectangle(to_process, (int(x_min), int(y_min)), (int(x_max), int(y_max)), 0, -1)
  return to_process

def handle_global_redaction(ds, redaction_json):
  """
  Global redaction applies to all frames in the dataset.
  Iterates for each frame in parallel and applies one redaction at a time to the frame.
  """
  fragment_list = {}
  def handle_frame_global_redact(frame_index):
      frame = pydicom.encaps.get_frame(ds.PixelData, frame_index, number_of_frames=ds.get("NumberOfFrames", 1))
      for global_redaction in redaction_json['globalRedactions']:
          logger.debug(f"Redacting {frame_index} with global redaction {global_redaction['annotationUID']}")
          frame = redact_frame(frame, global_redaction)

      with tempfile.NamedTemporaryFile(delete=False, suffix=".bin") as temp_file:
          ret_va, buf = cv2.imencode(".jp2", frame)
          temp_file.write(buf.tobytes())
          logger.debug(f"Frame {frame_index} written to temp file: {temp_file.name}")
          return temp_file.name

  if len(redaction_json['globalRedactions']) != 0:
      num_frames = ds.get("NumberOfFrames", 1)
      with ThreadPoolExecutor() as executor:
          future_to_idx = {executor.submit(handle_frame_global_redact, idx): idx for idx in range(num_frames)}
          for future in as_completed(future_to_idx):
              idx = future_to_idx[future]
              fragment_list[idx] = future.result()
  return fragment_list

def handle_frame_redaction(ds, file_path, redaction_json, fragment_list={}):
  """
  Frame redaction will be applied to 
  """
  def handle_frame_redact(frame_index, frame_redaction):
    frame = None
    for redaction in frame_redaction:
      if redaction['frameIndex'] == frame_index:
        logger.debug(f"Redacting frame {frame_index} with redaction {redaction['annotationUID']}")
        if frame is None:
          if frame_index not in fragment_list:
            frame = pydicom.encaps.get_frame(ds.PixelData, frame_index, number_of_frames=ds.get("NumberOfFrames", 1))
          else:
            logger.debug(f"Reading {fragment_list[frame_index]}")
            frame = cv2.imread(fragment_list[frame_index], cv2.IMREAD_UNCHANGED)

        frame = redact_frame(frame, redaction)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".bin") as temp_file:
        ret_va, buf = cv2.imencode(".jp2", frame)
        temp_file.write(buf.tobytes())
        logger.debug(f"Frame {frame_index} written to temp file: {temp_file.name}")
        return temp_file.name

  if len(redaction_json['frameRedactions']) != 0 and file_path in redaction_json['frameRedactions']:
    frame_redaction = redaction_json['frameRedactions'][file_path]

    frame_indexes = set([red['frameIndex'] for red in frame_redaction])
    with ThreadPoolExecutor() as executor:
      future_to_idx = {executor.submit(handle_frame_redact, idx, frame_redaction): idx for idx in frame_indexes}
      for future in as_completed(future_to_idx):
          idx = future_to_idx[future]
          fragment_list[idx] = future.result()
  return fragment_list

def handle_frame_transcoding(ds, fragment_list={}):
  def handle_frame_transcode(idx):
      if idx in fragment_list.keys():
            with open(fragment_list[idx], "rb") as f:
                logger.debug(f"Reading {fragment_list[idx]}")
                return f.read()
      else:        
        frame = pydicom.encaps.get_frame(ds.PixelData, idx, number_of_frames=ds.get("NumberOfFrames", 1))
        frame_np = np.frombuffer(frame, dtype=np.uint8)
        if not ds.is_decompressed:
            frame_np = cv2.imdecode(frame_np, cv2.IMREAD_UNCHANGED)
        ret_va, buf = cv2.imencode(".jp2", frame_np)
        logger.debug(f"Transcoded frame {idx}")
      return buf.tobytes()
    
  frame_bytes = {}
  num_frames = ds.get("NumberOfFrames", 1)

  with ThreadPoolExecutor() as executor:
      future_to_idx = {executor.submit(handle_frame_transcode, idx): idx for idx in range(num_frames)}
      for future in as_completed(future_to_idx):
          idx = future_to_idx[future]
          frame_bytes[idx] = future.result()
  return frame_bytes

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
    ds = pydicom.dcmread(file_path)

    if redaction_json['enableFileOverwrite']:
      dest_path = file_path
    else:
      catalog_name, schema_name, volume_name = volume.split(".")
      vol_base_path = f"/Volumes/{catalog_name}/{schema_name}/{volume_name}/{dest_base_path}/{redaction_id}/"
      dest_path = vol_base_path + re.sub(r'^(/Volumes/[^/]+/[^/]+/[^/]+/)', '', file_path)
      os.makedirs(os.path.dirname(dest_path), exist_ok=True)
      logger.info(f"Destination path: {dest_path}")

    fragment_list = handle_global_redaction(ds, redaction_json)
    fragment_list = handle_frame_redaction(ds, file_path, redaction_json, fragment_list)
    
    logger.info(f"Frames {len(fragment_list)} patched and transcoded at {datetime.datetime.now().isoformat()}")

    # Copy the original dataset's metadata except for PixelData
    new_ds = FileDataset(dest_path, {}, file_meta=ds.file_meta, preamble=ds.preamble)
    for elem in ds:
        if elem.tag != (0x7fe0, 0x0010):  # PixelData
          new_ds.add(copy.deepcopy(elem))
    for elem in ds.file_meta:
        new_ds.file_meta.add(copy.deepcopy(elem))

    # Collect all frame fragments and transcode them
    frame_bytes = handle_frame_transcoding(ds, fragment_list)

    logger.info(f"{len(frame_bytes)} Frames collected at {datetime.datetime.now().isoformat()}")

    logger.debug(f"Setting TransferSyntaxUID to {pydicom.uid.JPEG2000Lossless} and PhotometricInterpretation to YBR_FULL")
    new_ds.file_meta.TransferSyntaxUID = pydicom.uid.JPEG2000Lossless
    new_ds.PhotometricInterpretation = "YBR_FULL"
    new_ds.SeriesInstanceUID = redaction_json['new_series_instance_uid']

    logger.debug(f"Starting to encapsulate {len(frame_bytes)} frames")
    new_ds.PixelData = pydicom.encaps.encapsulate([frame_bytes[idx] for idx in sorted(frame_bytes.keys())])
    logger.debug(f"Encapsulated {len(frame_bytes)} frames at {datetime.datetime.now().isoformat()}")

    new_ds.save_as(dest_path)

    logger.info(f"Redaction completed in {time.time() - start_time:.2f} seconds")
    return dest_path