import numpy as np
import easyocr
import pydicom
from typing import Optional, List
import cv2
import matplotlib.pyplot as plt
from dbx.pixels.dicom.dicom_utils import dicom_to_8bitarray

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
        raise Exception(f"Exception error {e}. image_array must be a numpy pixel array and horizontal_list must be a list of bounding boxes coordinates from easyocr.Reader.detect")


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
        _, ax = plt.subplots(1, 2, figsize=figsize)
        ax[0].imshow(original_array)
        ax[0].set_title('Original')

        if isinstance(redacted_array, np.ndarray):
            ax[1].imshow(redacted_array)
            ax[1].set_title('Redacted')
        plt.show()

    except Exception as e:
        raise Exception(f"Exception error:{e}. original_array must be a pixel numpy array. Likewise for redacted_array, if provided.")


def ocr_dcm(path: str, 
            min_size: int = 1, 
            text_threshold: float = 0, 
            display=False,
            gpu=False
) -> List:
    try:
        image = dicom_to_8bitarray(path)

        # Detect text (no need recognizer)
        reader = easyocr.Reader(['en'], recognizer=False, gpu=gpu)
        bounds = reader.detect(image, min_size=min_size, text_threshold=text_threshold)
        horizontal_list, free_list = bounds

        bb = horizontal_list[0]
        redacted_array = fill_bounding_boxes(image, bb)

        #display images
        if display:
            compare_dicom_arrays(image, redacted_array)
        return redacted_array
    
    except Exception as e:
        raise Exception(f"Exception error: {e}. Path must be a string ending with .dcm for a dicom file")
