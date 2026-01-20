from dataclasses import dataclass, replace
from typing import List, Optional

import cv2
import easyocr
from pydicom import dcmread
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import pyspark.sql
from pyspark.ml.pipeline import Transformer
from pyspark.sql.functions import col, expr, pandas_udf

from dbx.pixels.dicom.dicom_utils import (
    array_to_image,
    dicom_to_8bitarray,
    replace_pixel_array,
    get_current_datetime,
    remove_dbfs_prefix
)
from dbx.pixels.dicom.redactor.dataclasses import *
from dbx.pixels.dicom.redactor.utils import frame_iterator, merge_results_from_frame_iterator, redact_dcm
from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider()


@dataclass
class OcrResult:
    array: np.ndarray
    bb: list
    output_path: Optional[str]
    error: Optional[str]


def redaction_json_to_bb(redaction_json: dict, path: str) -> List[List[int]]:
    if redaction_json.get('frameRedactions'):
        if redaction_json['frameRedactions'].get(path):
            bb = [[i['imagePixelCoordinates']['topLeft'][0], 
            i['imagePixelCoordinates']['bottomRight'][0],
            i['imagePixelCoordinates']['bottomRight'][1],
            i['imagePixelCoordinates']['topLeft'][1]] for i in redaction_json['frameRedactions'][path]]
            return bb
        else:
            raise KeyValueError(f"key {path} not found in redaction_json['frameRedactions']")
    else:
        raise KeyValueError(f"key frameRedactions not found in redaction_json")



def bb_to_ImagePixelCoord(bb):
    coor_list = []
    for b in bb:
        coor_list.append(ImagePixelCoordinates(
            topLeft = [b[0], b[3]],
            bottomRight=[b[1], b[2]],
            height = b[3] - b[2],
            width = b[1] - b[0]
            )
        )
    return coor_list


def coor_list_to_FrameRedaction(coor_list: List, frame_index: int):
    for coor in coor_list:
        yield FrameRedaction(
            annotationUID = None,
            frameIndex = frame_index,
            imagePixelCoordinates = coor,
            timestamp = get_current_datetime()
        )


def bb_to_FrameRedaction(bb: List, file: str, frame_index: int):
    coor_list = bb_to_ImagePixelCoord(bb)
    return {file: [asdict(i) for i in coor_list_to_FrameRedaction(coor_list, frame_index)]}


def fill_bounding_boxes(image_array: np.ndarray, horizontal_list: List) -> np.ndarray:
    """
    Detects text in an image using EasyOCR and fills the bounding boxes
    around the detected text with a solid color.

    Args:
        image_path (str): Path to the input image.
        output_path (str): Path to save the output image with filled bounding boxes.

    Returns:
        np.ndarray: Image with filled bounding boxes.
    """
    # See documentation of what detect returns
    # https://www.jaided.ai/easyocr/documentation/
    try:
        for bbox in horizontal_list:
            (x_min, x_max, y_min, y_max) = bbox
            top_left = (x_min, y_max)
            bottom_right = (x_max, y_min)
            cv2.rectangle(image_array, top_left, bottom_right, (0, 0, 0), -1)

        # cv2.imwrite(outfile, image_array)
        return image_array
    except Exception as e:
        logger.error(
            f"Exception error {e}. image_array must be a numpy pixel array and horizontal_list must be a list of bounding boxes coordinates from easyocr.Reader.detect"
        )
        # return original array
        return image_array


def compare_dicom_arrays(
    original_array: np.ndarray,
    redacted_array: Optional[np.ndarray] = None,
    figsize: tuple = (11, 11),
) -> None:
    """Display the DICOM pixel arrays of both original and redacted as images.

    Args:
        original_array (np.ndarray): a DICOM pixel array.
        redacted_array (Optional[np.ndarray]): a redacted DICOM pixel array.
        figsize (tuple): Figure size in inches (width, height).
    """
    try:
        # plt.clf()
        _, ax = plt.subplots(1, 2, figsize=figsize)
        ax[0].imshow(original_array)
        ax[0].set_title("Original")

        if isinstance(redacted_array, np.ndarray):
            ax[1].imshow(redacted_array)
            ax[1].set_title("Redacted")
        plt.show()

    except Exception as e:
        raise Exception(
            f"{e}. original_array must be a pixel numpy array. Likewise for redacted_array, if provided."
        )


def redact_single_dcm(
    path: str,
    image,
    bb,
    output_dir: str = None,
    display: bool = False,
    save_format: str = "dicom",
):
    null_result = OcrResult(None, None, None, None)

    try:
        output_path = None
        redacted_array = fill_bounding_boxes(image, bb)

        # Save redacted images in output_dir
        if output_dir:
            suffix = "_".join(path.split("/")[-2:])
            if save_format == "dicom":
                output_path = f"{output_dir}/{suffix}"
                replace_pixel_array(path, redacted_array, output_path)
                error_msg = None
            elif save_format == "jpg":
                output_path = f'{output_dir}/{suffix.replace(".dcm", ".jpg")}'
                array_to_image(
                    redacted_array, output_path=output_path, return_type=None
                )
                error_msg = None
            else:
                error_msg = ValueError(
                    f"Invalid save_format: {save_format}. Options are dicom (default), jpg. No file was saved."
                )
                logger.error(error_msg)
        else:
            error_msg = None

        # display images
        if display:
            compare_dicom_arrays(image, redacted_array)
        return OcrResult(redacted_array, bb, output_path, error_msg)

    except Exception as e:
        error_msg = f"{e}. Path must be a string ending with .dcm for a dicom file that can be converted into a pixel numpy array of uint8 type."
        logger.exception(error_msg)
        return replace(null_result, error=error_msg)


def ocr_dcm(
    file_path: str,
    frame_index: int = 0,
    gpu: bool = False,
    min_size: int = 1,
    text_threshold: float = 0,
) -> List:
    """
    Find the text bounding boxes using EasyOCR of only the first frame
    """
    null_result = OcrResult(None, None, None, None)

    image = dicom_to_8bitarray(remove_dbfs_prefix(file_path))
    ds = dcmread(remove_dbfs_prefix(file_path))
    num_frames = ds.get("NumberOfFrames", 1)

    if image is None:
        error_msg = f"image from path {file_path} should not be None"
        logger.error(error_msg)
        return replace(null_result, error=error_msg)
    elif not isinstance(image, np.ndarray):
        error_msg = f"image from path {file_path} should be a numpy pixel array"
        logger.error(error_msg)
        return replace(null_result, error=error_msg)
    elif image.dtype != np.uint8:
        error_msg = (
            f"image from path {file_path} should be of dtype uint8 and not {image.dtype}"
        )
        logger.error(error_msg)
        return replace(null_result, error=error_msg)
    else:
        # i.e. image.dtype == np.uint8
        # Detect text (no need recognizer)
        # Redactor to use the temporary directory with write permissions
        if num_frames > 1:
            image = image[frame_index]
        reader = easyocr.Reader(["en"], recognizer=False, gpu=gpu)
        try:
            horizontal_list, free_list = reader.detect(
                image, min_size=min_size, text_threshold=text_threshold
            )
            bb = horizontal_list[0]
            error_msg = None
        except Exception as e:
            error_msg = f"{e}. easyocr.Reader.detect exception"
            logger.exception(error_msg)
            return replace(null_result, error=error_msg)

        if not isinstance(bb, list):
            error_msg = f"ocr_dcm did not return a list. Check for error in ocr_dcm. path {file_path} must be a valid DICOM file that can be converted into a pixel numpy array of type uint8 and read by easyocr.Read.detect to return a (empty) list of text bounding boxes"
            logger.error(error_msg)
            return replace(null_result, bb=bb, error=error_msg)
        elif len(bb) <= 0:
            error_msg = (
                f"ocr_dcm returned an empty list. No text detected in path {file_path}"
            )
            logger.warn(error_msg)
            return replace(null_result, bb=bb, error=error_msg)
        else:
            # if redact immediately as part of this function
            # return redact_single_dcm(
            #     file_path,
            #     image,
            #     bb,
            #     output_dir=output_dir,
            #     display=display,
            #     save_format=save_format)
            # if use multi-threaded redaction later, return bb in the right format
            fr = bb_to_FrameRedaction(bb, file_path, frame_index)
            redaction_json = RedactionMetadata(filesToEdit=[file_path], frameRedactions=fr, globalRedactions=[]).__dict__
            return redaction_json


def multiframe_redactor(path: str, outdir: str, max_frames: int = 0, **kwargs):
    # Use EasyOCR to find binding boxes
    if path is None:
        return None
    else:
        path = remove_dbfs_prefix(path)
        redaction_json_dict = frame_iterator(path, ocr_dcm, max_frames=max_frames, **kwargs)
        try:
            if len(redaction_json_dict.get(0)['frameRedactions'][path][0]['imagePixelCoordinates']) == 4:
                redaction_json = merge_results_from_frame_iterator(redaction_json_dict)

                # Redact based on redaction_json
                output_path = redact_dcm(
                    path,
                    redaction_json,
                    redaction_id=None,
                    dest_base_path=outdir,
                )
                return output_path
            else:
                logger.warn("Invalid bounding boxes. No redaction will be performed.")
                return None
        except Exception as e:
            logger.warn(f"No text detected. No redaction required. {e}")
            return None


class OcrRedactor(Transformer):
    def __init__(
        self,
        inputCol: str = "path",
        outputCol: str = "path_redacted",
        output_dir: str = None,
        max_frames: int = 0,
        gpu: bool = False,
        min_size: int = 1,
        text_threshold: float = 0,
        save_format: str = "dicom",
    ):
        super().__init__()
        self.inputCol = inputCol
        self.outputCol = outputCol
        self.output_dir = output_dir
        self.max_frames = max_frames
        self.gpu = gpu
        self.min_size = min_size
        self.text_threshold = text_threshold
        self.save_format = save_format

    def _transform(self, df):
        @pandas_udf("string")
        def ocr2redactarr_udf(paths: pd.Series) -> pd.Series:
            def ocr2redactarr(path: str) -> str:
                # Find text bounding boxes and apply fill mask
                output_path = multiframe_redactor(
                    path,
                    outdir=self.output_dir,
                    max_frames=self.max_frames,
                    gpu=self.gpu,
                    min_size=self.min_size,
                    text_threshold=self.text_threshold)
                # result = ocr_dcm(
                #     path,
                #     #output_dir=self.output_dir,
                #     #display=False,
                #     gpu=self.gpu,
                #     min_size=self.min_size,
                #     text_threshold=self.text_threshold,
                #     #save_format=self.save_format,
                # )
                # result (OcrResult) has attributes: array, bb, output_path, error
                # output_path= result.output_path
                return output_path
            return paths.apply(ocr2redactarr)
        return df.withColumn(self.outputCol, ocr2redactarr_udf(col(self.inputCol)))


class FilterTransformer(Transformer):
    """
    A custom Transformer that filters a DataFrame based on a condition on a column.
    """

    def __init__(
        self,
        inputCol: str = "path",
        outputCol: str = "filtered",
        filter: str = "CASE WHEN size(response.content) > 1 THEN {self.inputCol} ELSE NULL END",
    ):
        super().__init__()
        self.inputCol = inputCol
        self.outputCol = outputCol
        self.filter = filter

        if self.inputCol is None or self.outputCol is None or self.filter is None:
            raise ValueError(
                "Input column, output column, and filter expression must be set"
            )

    def _transform(self, df: pyspark.sql.DataFrame) -> pyspark.sql.DataFrame:
        """
        Applies the filtering logic to the input DataFrame.
        """
        fiter_expr = eval('f"' + self.filter + '"')
        try:
            return df.withColumn(self.outputCol, expr(fiter_expr))
        except Exception as e:
            raise Exception(f"Error evaluating filter expression: {e}")
