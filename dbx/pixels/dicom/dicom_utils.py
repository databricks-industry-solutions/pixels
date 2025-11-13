import base64
import copy
import io
import os

import numpy as np
import pydicom
import pyspark.sql
from pydicom import Dataset

from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider()


def cloud_open(path: str, anon: bool = False):
    try:
        if path.startswith("s3://"):
            """Read from S3 directly"""
            import s3fs

            fs = s3fs.S3FileSystem(anon)
            fp = fs.open(path)
            fsize = fs.size(path)
        else:
            """Read from local filesystem"""
            fp = open(path, "rb")
            fsize = os.stat(path).st_size
        return fp, fsize
    except Exception as e:
        raise Exception(f"path: {path} is_anon: {anon} exception: {e} exception.args: {e.args}")


def check_pixel_data(ds: Dataset) -> Dataset | None:
    """Check if pixel data exists before attempting to access it.
        pydicom.Dataset.pixel_array will throw an exception if the
        image contains no pixel data.
    params:
        ds -- An object of type pydicom.Dataset
    """
    try:
        a = ds.pixel_array
        return a
    except AttributeError as e:
        logger.error(f"AttributeError: {e}. pixel_array does not exist in ds")
        return None


def extract_metadata(ds: Dataset, deep: bool = True) -> dict:
    """Extract metadata from header of dicom image file
    params:
      path -- local path like /dbfs/mnt/... or s3://<bucket>/path/to/object.dcm
      deep -- True if deep inspection of the Dicom header is required
    """
    a = None
    js = {}
    if deep:
        a = check_pixel_data(ds)
    if deep and a is not None:
        a.flags.writeable = False
        js["has_pixel"] = True
        js["img_min"] = np.min(a).item()
        js["img_max"] = np.max(a).item()
        js["img_avg"] = np.average(a).item()
        js["img_shape_x"] = a.shape[0]
        js["img_shape_y"] = a.shape[1]
    elif deep:
        js["has_pixel"] = False

    # remove RTStruct
    if "30060039" in ds:
        del ds["30060039"]

    # remove binary images
    if "60003000" in ds:
        del ds["60003000"]
    if "7FE00010" in ds:
        del ds["7FE00010"]

    js = ds.to_json_dict() | js
    return js


def anonymize_metadata(
    ds: Dataset, fp_key: str, fp_tweak: str, keep_tags: tuple, encrypt_tags: tuple
):
    """
    Anonymizes metadata of a DICOM file.
    Args:
        ds (Dataset): DICOM dataset.
        fp_key (str): Key for encryption.
        fp_tweak (str): Tweak for encryption.
        keep_tags (tuple): Tuple of DICOM tags to keep unchanged.
        encrypt_tags (tuple): Tuple of DICOM tags to encrypt.
    Returns:
        Dataset: Anonymized DICOM dataset.
    """
    import dicognito.anonymizer
    from ff3 import FF3Cipher

    c = FF3Cipher(fp_key, fp_tweak)
    anonymizer = dicognito.anonymizer.Anonymizer()

    keep_values = [copy.deepcopy(ds[element]) for element in keep_tags if element in ds]
    encrypted_values = []

    for element in encrypt_tags:
        if element in ds:
            if "UID" in element:
                c.alphabet = "0123456789"
                ds[element].value = ".".join(
                    [
                        c.encrypt(element) if len(element) > 5 else element
                        for element in ds[element].value.split(".")
                    ]
                )
            else:
                c.alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,^_-"
                ds[element].value = (
                    c.encrypt(ds[element].value) if len(ds[element].value) > 5 else ""
                )

        encrypted_values.append(copy.deepcopy(ds[element]))

    anonymizer.anonymize(ds)

    with Dataset() as dataset:
        for values in encrypted_values + keep_values:
            dataset.add(values)
        ds.update(dataset)


def remove_dbfs_prefix(path: str) -> str:
    """Remove 'dbfs:' prefix from path if present

    Args:
        path (str): _description_

    Returns:
        str: _description_
    """
    try:
        if path.startswith("dbfs:/Volumes"):
            path = path.replace("dbfs:", "")
    except Exception as e:
        logger.error(f"Exception error: {e}. Path {path} may not be a string")
    return path


def dicom_to_8bitarray(path: str) -> np.ndarray:
    """
    Read .dcm DICOM file (typically monochrome) and convert its image to a 8bit array for subsequent easyOCR processing
    """
    try:
        path = remove_dbfs_prefix(path)
        dcm = pydicom.dcmread(path)
        pixel_array = check_pixel_data(dcm)
        if isinstance(pixel_array, np.ndarray):
            im = np.asfarray(pixel_array, dtype=np.float32)
            rescaled_image = (np.maximum(im, 0) / im.max()) * 255
            image = np.uint8(rescaled_image)
            return image
        elif pixel_array is None:
            logger.error("No pixel_array in dcm")
            return None
        else:
            logger.error("pixel_array is not a np.ndarray but of type {type(pixel_array)}")
            return None
    except Exception:
        logger.exception(
            "Pixel array must be a numpy array that can be converted from np.float32 to uint8"
        )
        return None


def dicom_to_array(path: str, dtype: str = "uint8") -> np.ndarray:
    """Function to convert DICOM to numpy array of pixel data.
    Args:
        path (str): Path to input DICOM file
        dtype (str): Data type of the output array. Default is 'uint8'.
    Returns:
        np.NDArray: Numpy array of pixel data
    """
    #    from pydicom.pixel_data_handlers.util import apply_voi_lut
    from pydicom.pixels import apply_voi_lut

    try:
        path = remove_dbfs_prefix(path)
        ds = pydicom.dcmread(path)
        pixel_array = check_pixel_data(ds)

        if isinstance(pixel_array, np.ndarray) and "VOILUTSequence" in ds:
            data = apply_voi_lut(pixel_array, ds)
        elif isinstance(pixel_array, np.ndarray) and "VOILUTSequence" not in ds:
            data = pixel_array
        elif pixel_array is None:
            logger.error(f"No pixel_array in {path}")
            return None
        else:
            logger.error(f"pixel_array in {path} is not a numpy array")
            return None

        # Convert to specified dtype if necessary
        if data.dtype != dtype:
            data = data.astype(dtype)
        return data

    except Exception as e:
        logger.exception(
            f"{e}. Path must be a string ending with .dcm for a dicom file and contains a pixel numpy array. Check for valid dtype {dtype}"
        )
        return None


def array_to_image(
    px_array: np.ndarray,
    max_width: int = 768,
    output_path: str = None,
    return_type: str = "str",
):
    from PIL import Image

    default_format = "JPEG"

    try:
        # Create an image from the pixel data
        image = Image.fromarray(px_array)

        # Resize the image if max_width>0
        if max_width > 0:
            if image.width > max_width:
                ratio = max_width / image.width
                new_size = (max_width, int(image.height * ratio))
                image = image.resize(new_size, Image.LANCZOS)
        else:
            logger.info(
                "Set min_width > 0 to resize the image otherwise no resizing will be performed."
            )

        # Save image if output_path is not None
        if output_path:
            extension = output_path.split(".")[-1].lower()
            if extension in ["jpg", "jpeg"]:
                format = "JPEG"
            elif extension == "png":
                format = "PNG"
            elif extension == "bmp":
                format = "BMP"
            elif extension == "gif":
                format = "GIF"
            elif extension == "tiff":
                format = "TIFF"
            else:
                format = default_format
                logger.warn(
                    f"Invalid output format: {extension}. Defaulting to .jpg. Valid formats are: jpg, jpeg, png, bmp, gif, tiff"
                )
            image.save(output_path, format=format)

        # Convert to requested return_type
        if return_type == "binary":  # Convert image to jpg
            with io.BytesIO() as output:
                image.save(output, format=default_format)
                jpg_binary = output.getvalue()
            return jpg_binary
        elif return_type == "str":
            with io.BytesIO() as output:
                image.save(output, format=default_format)
                jpg_binary = output.getvalue()
                base64_str = base64.b64encode(jpg_binary).decode("utf-8")
            return base64_str
        else:
            logger.warn(
                f"Invalid image return_type: {return_type}. Returning None. Valid return_types are: binary, str"
            )
            return None

    except Exception as e:
        logger.exception(f"{e}. Input must be numpy pixel array of a DICOM file")
        return None


def dicom_to_image(
    path: str,
    max_width: int = 768,
    output_path: str = None,
    return_type: str = "str",
):
    """Function to convert DICOM to image. Save to file or return as binary or base64 string
    Args:
        path (str): Path to input DICOM file
        max_width (int): Maximum width for the output image. If 0, no resizing is performed.
        output_path (str): Path where image will be saved. If None, image will not be saved.
        return_type (str): Type of the output image. Valid values are: binary, str. Default is 'str'.
    """
    try:
        px_array = dicom_to_array(path)
        image = array_to_image(px_array, max_width, output_path, return_type)
        return image
    except Exception as e:
        logger.exception(
            f"{e}. path {path} must be a DICOM file path containing a pixel numpy array"
        )
        return None


def replace_pixel_array(
    path: str, new_array: np.ndarray, output_path: str
) -> pydicom.dataset.FileDataset:
    try:
        # remove 'dbfs:' prefix if present
        path = remove_dbfs_prefix(path)
        ds = pydicom.dcmread(path)

        new_array = new_array.astype(ds.pixel_array.dtype)
        ds.PixelData = new_array.tobytes()
        ds.Rows, ds.Columns = new_array.shape[:2]
        ds.save_as(output_path)
        return ds
    except Exception as e:
        raise Exception(
            f"Exception error: {str(e)}. Check input path {path} exists and new_array is a 2D numpy array of pixels of 8-bit integers"
        )


def get_classifer_metrics(
    df: pyspark.sql.DataFrame,
    col_truth: str = "has_phi",
    col_pred: str = "phi_detected",
) -> dict:
    from sklearn.metrics import (
        accuracy_score,
        confusion_matrix,
        f1_score,
        precision_score,
        recall_score,
    )

    # sklearn expects a pandas, not spark df
    p_df = df.toPandas()
    precision = precision_score(p_df[col_truth], p_df[col_pred])
    recall = recall_score(p_df[col_truth], p_df[col_pred])
    f1 = f1_score(p_df[col_truth], p_df[col_pred])
    accuracy = accuracy_score(p_df[col_truth], p_df[col_pred])

    tn, fp, fn, tp = confusion_matrix(p_df[col_truth], p_df[col_pred]).ravel()
    specificity = tn / (tn + fp) if (tn + fp) != 0 else float("nan")
    npv = tn / (tn + fn) if (tn + fn) != 0 else float("nan")

    return {
        "precision": precision,
        "specificity": specificity,
        "npv": npv,
        "recall": recall,
        "f1": f1,
        "accuracy": accuracy,
    }
