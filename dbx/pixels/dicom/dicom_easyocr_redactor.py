import numpy as np
import easyocr
import pydicom
from typing import Optional, List
import cv2
import matplotlib.pyplot as plt


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
    for bbox in horizontal_list:
        (x_min, x_max, y_min, y_max) = bbox
        top_left = (x_min, y_max)
        bottom_right = (x_max, y_min)
        cv2.rectangle(image_array, top_left, bottom_right, (0, 0, 0), -1)

    #cv2.imwrite(outfile, image_array)
    return image_array


def compare_dicom_images(
    original_array: np.ndarray,
    redacted_array: Optional[np.ndarray] = None,
    bb: Optional[List] = None,
    figsize: tuple = (11, 11)
) -> None:
    """Display the DICOM pixel arrays of both original and redacted as images.

    Args:
        instance_original (pydicom.dataset.FileDataset): A single DICOM instance (with text PHI).
        instance_redacted (pydicom.dataset.FileDataset): A single DICOM instance (redacted PHI).
        figsize (tuple): Figure size in inches (width, height).
    """
    if redacted_array is None and bb is None:
        raise Exception("Either redacted_array (numpy pixel array) or bb (list of bounding boxes coordinates) must be provided.")

    _, ax = plt.subplots(1, 2, figsize=figsize)
    ax[0].imshow(original_array)
    ax[0].set_title('Original')

    if bb:
        try:
            redacted_array = fill_bounding_boxes(original_array, bb)
        except Exception as e:
            raise Exception(f"Exception error:{e}. bb may not be a list of bounding boxes coordinates.")
        
    ax[1].imshow(redacted_array)
    ax[1].set_title('Redacted')


def ocr_dcm(path: str, min_size: int = 1, text_threshold: float = 0, display=False) -> List:
    try:
        if path.startswith('dbfs:/Volumes'):
            path = path.replace('dbfs:','')
    except Exception as e:
        print(f"Exception error: {e}. Path may not be a string")

    try:
        dcm = pydicom.dcmread(path)

        # convert to 8bit for cv2
        im = np.asfarray(dcm.pixel_array, dtype=np.float32)
        rescaled_image = (np.maximum(im,0)/im.max())*255
        image = np.uint8(rescaled_image)

        # Detect text (no need recognizer)
        reader = easyocr.Reader(['en'], recognizer=False)
        bounds = reader.detect(image, min_size=min_size, text_threshold=text_threshold)
        horizontal_list, free_list = bounds

        #display images
        if display:
            compare_dicom_images(image, bb=horizontal_list[0])
        return horizontal_list[0]
    
    except Exception as e:
        print(f"Exception error: {e}. Path may not be a string")
