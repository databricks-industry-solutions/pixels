import base64
import copy
import io
import os

import numpy as np
import pydicom
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
    except Exception as e:
        logger.error(f"Exception error: {e}. Path may not be a string")
        return None


def extract_metadata(ds: Dataset, deep: bool = True) -> dict:
    """Extract metadata from header of dicom image file
    params:
      path -- local path like /dbfs/mnt/... or s3://<bucket>/path/to/object.dcm
      deep -- True if deep inspection of the Dicom header is required
    """
    a = None
    js = ds.to_json_dict()
    # remove binary images
    if "60003000" in js:
        del js["60003000"]
    if "7FE00010" in js:
        del js["7FE00010"]
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
        logger.error(f"Exception error: {e}. Path may not be a string")
    return path


def dicom_to_array(dicom_path: str, dtype: str = "uint8") -> np.typing.NDArray:
    """Function to convert DICOM to numpy array of pixel data.
    Args:
        dicom_path (str): Path to input DICOM file
        dtype (str): Data type of the output array. Default is 'uint8'.
    Returns:
        np.NDArray: Numpy array of pixel data
    """
    from pydicom.pixel_data_handlers.util import apply_voi_lut

    # Read the DICOM file
    ds = pydicom.dcmread(dicom_path)

    if not check_pixel_data(ds):
        raise Exception(f"DICOM file {dicom_path} has no pixel data")

    # Apply VOI LUT if present
    if "VOILUTSequence" in ds:
        data = apply_voi_lut(ds.pixel_array, ds)
    else:
        data = ds.pixel_array

    # Convert to specified dtype if necessary
    if data.dtype != dtype:
        data = data.astype(dtype)

    return data


def dicom_to_image(
    dicom_path: str,
    min_width: int = 768,
    output_path: str = None,
    return_type: str = "str",
):
    """Function to convert DICOM to image. Save to file or return as binary or base64 string
    Args:
        dicom_path (str): Path to input DICOM file
        min_width (int): Minimum width for the output image. If 0, no resizing is performed.
        output_path (str): Path where image will be saved. If None, image will not be saved.
        return_type (str): Type of the output image. Valid values are: binary, str. Default is 'str'.
    """
    from PIL import Image

    default_format = "JPEG"

    px_array = dicom_to_array(dicom_path)

    # Create an image from the pixel data
    image = Image.fromarray(px_array)

    # Resize the image if min_width>0
    if min_width > 0:
        if image.width < min_width:
            ratio = min_width / image.width
            new_size = (min_width, int(image.height * ratio))
            image = image.resize(new_size, Image.LANCZOS)
    else:
        logger.info(
            "Set min_width > 0 to resize the image otherwise no resizing will be performed."
        )

    # Save image
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


# Register the function as a UDF
# dicom_to_base64_udf = udf(dicom_to_image, StringType())
