import numpy as np
import pandas as pd
import easyocr
import pydicom
from typing import Optional, List
from dataclasses import dataclass, replace
import cv2
import matplotlib.pyplot as plt

from dbx.pixels.dicom.dicom_utils import remove_dbfs_prefix, dicom_to_8bitarray, replace_pixel_array, array_to_image
from dbx.pixels.logging import LoggerProvider

from pyspark.ml.pipeline import Transformer
import pyspark.sql
from pyspark.sql.functions import pandas_udf, col, lit, expr

logger = LoggerProvider()

@dataclass
class OcrResult:
    array: np.ndarray
    bb: list
    output_path: Optional[str]
    error: Optional[str]


def fill_bounding_boxes(image_array: np.ndarray, 
                        horizontal_list: List) -> np.ndarray:
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

        #cv2.imwrite(outfile, image_array)
        return image_array
    except Exception as e:
        logger.error(f"Exception error {e}. image_array must be a numpy pixel array and horizontal_list must be a list of bounding boxes coordinates from easyocr.Reader.detect")
        # return original array
        return image_array


def compare_dicom_arrays(
    original_array: np.ndarray,
    redacted_array: Optional[np.ndarray] = None,
    figsize: tuple = (11, 11)
) -> None:
    """Display the DICOM pixel arrays of both original and redacted as images.

    Args:
        original_array (np.ndarray): a DICOM pixel array.
        redacted_array (Optional[np.ndarray]): a redacted DICOM pixel array.
        figsize (tuple): Figure size in inches (width, height).
    """
    try:
        #plt.clf()
        _, ax = plt.subplots(1, 2, figsize=figsize)
        ax[0].imshow(original_array)
        ax[0].set_title('Original')

        if isinstance(redacted_array, np.ndarray):
            ax[1].imshow(redacted_array)
            ax[1].set_title('Redacted')
        plt.show()

    except Exception as e:
        raise Exception(f"{e}. original_array must be a pixel numpy array. Likewise for redacted_array, if provided.")


def ocr_dcm(path: str, 
            output_dir: str = None,
            display: bool = False,
            gpu: bool = False,
            min_size: int = 1, 
            text_threshold: float = 0, 
            save_format: str = "dicom"
) -> List:
    image = dicom_to_8bitarray(path)
    null_result = OcrResult(None, None, None, None)

    if image is None:
        error_msg = f"image from path {path} should not be None"
        logger.error(error_msg)
        return replace(null_result, error=error_msg)
    elif not isinstance(image, np.ndarray):
        error_msg = f"image from path {path} should be a numpy pixel array"
        logger.error(error_msg)
        return replace(null_result, error=error_msg)
    elif image.dtype != np.uint8:
        error_msg = f"image from path {path} should be of dtype uint8 and not {image.dtype}"
        logger.error(error_msg)
        return replace(null_result, error=error_msg)
    else:
        # i.e. image.dtype == np.uint8
        # Detect text (no need recognizer)
        # Redactor to use the temporary directory with write permissions
        reader = easyocr.Reader(['en'], recognizer=False, gpu=gpu)

        try:
            horizontal_list, free_list = reader.detect(image, min_size=min_size, text_threshold=text_threshold)
            bb = horizontal_list[0]
        except Exception as e:
            error_msg = f"{e}. easyocr.Reader.detect exception"
            logger.exception(error_msg)
            return replace(null_result, error=error_msg)
        
        if not isinstance(bb, list):
            error_msg = f"ocr_dcm did not return a list. Check for error in ocr_dcm. path {path} must be a valid DICOM file that can be converted into a pixel numpy array of type uint8 and read by easyocr.Read.detect to return a (empty) list of text bounding boxes"
            logger.error(error_msg)
            return replace(null_result, bb=bb, error=error_msg)
        elif len(bb)<=0:
            error_msg = f"ocr_dcm returned an empty list. No text detected in path {path}"
            logger.warn(error_msg)
            return replace(null_result, bb=bb, error=error_msg)
        else:
            try:
                output_path = None
                redacted_array = fill_bounding_boxes(image, bb)

                # Save redacted images in output_dir
                if output_dir:
                    suffix = "_".join(path.split("/")[-2:])
                    if save_format == "dicom":
                        output_path = f'{output_dir}/{suffix}'
                        ds = replace_pixel_array(path, redacted_array, output_path)
                        error_msg = None
                    elif save_format == "jpg":
                        output_path = f'{output_dir}/{suffix.replace(".dcm", ".jpg")}'
                        array_to_image(redacted_array,
                                       output_path=output_path,
                                       return_type=None)
                        error_msg = None
                    else:
                        error_msg = ValueError(f"Invalid save_format: {save_format}. Options are dicom (default), jpg. No file was saved.")
                        logger.error(error_msg)

                #display images
                if display:
                    compare_dicom_arrays(image, redacted_array)
                return OcrResult(redacted_array, bb, output_path, error_msg)
            
            except Exception as e:
                error_msg = f"{e}. Path must be a string ending with .dcm for a dicom file that can be converted into a pixel numpy array of uint8 type."
                logger.exception(error_msg)
                return replace(null_result, error=error_msg)
        

class OcrRedactor(Transformer):
    def __init__(self, 
                 inputCol: str = "path", 
                 outputCol: str = "path_redacted",
                 output_dir: str = None,
                 gpu: bool = False,
                 min_size: int = 1, 
                 text_threshold: float = 0,
                 save_format: str = "dicom"
    ):
        super().__init__()
        self.inputCol = inputCol
        self.outputCol = outputCol
        self.output_dir = output_dir
        self.gpu = gpu
        self.min_size = min_size 
        self.text_threshold = text_threshold
        self.save_format = save_format

    def _transform(self, df):
        @pandas_udf("string")
        def ocr2redactarr_udf(paths: pd.Series) -> pd.Series:
            def ocr2redactarr(path: str) -> str:
                # Find text bounding boxes and apply fill mask
                result = ocr_dcm(path, 
                                 output_dir=self.output_dir,
                                 display=False,
                                 gpu=self.gpu,
                                 min_size=self.min_size,
                                 text_threshold=self.text_threshold, 
                                 save_format=self.save_format)
                # result (OcrResult) has attributes: array, bb, output_path, error
                return result.output_path
            return paths.apply(ocr2redactarr)
        return df.withColumn(self.outputCol, ocr2redactarr_udf(col(self.inputCol)))
    


class FilterTransformer(Transformer):
    """
    A custom Transformer that filters a DataFrame based on a condition on a column.
    """
    def __init__(self, inputCol: str = "path", 
                 outputCol: str = "filtered", 
                 filter: str = "CASE WHEN size(response.content) > 1 THEN {self.inputCol} ELSE NULL END"):
        super().__init__()
        self.inputCol = inputCol
        self.outputCol = outputCol
        self.filter = filter

        if self.inputCol is None or self.outputCol is None or self.filter is None:
            raise ValueError("Input column, output column, and filter expression must be set")

    def _transform(self, df: pyspark.sql.DataFrame) -> pyspark.sql.DataFrame:
        """
        Applies the filtering logic to the input DataFrame.
        """
        fiter_expr = eval('f"' +self.filter + '"')
        try:
            return df.withColumn(self.outputCol, expr(fiter_expr))
        except Exception as e:
            raise Exception(f"Error evaluating filter expression: {e}")

