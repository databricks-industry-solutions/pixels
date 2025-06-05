import copy
import os

import numpy as np
import pydicom
from pydicom import Dataset
import io
import base64

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
    except:
        return None
    return a


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


def dicom_to_base64jpg(dicom_binary, min_width: int = 768):
    """ Function to convert DICOM to JPG
    """
    from pydicom.pixel_data_handlers.util import apply_voi_lut
    from PIL import Image

    # Read the DICOM file
    ds = pydicom.dcmread(io.BytesIO(dicom_binary))
    
    # Apply VOI LUT if present
    if 'VOILUTSequence' in ds:
        data = apply_voi_lut(ds.pixel_array, ds)
    else:
        data = ds.pixel_array
    
    # Convert to uint8 if necessary
    if data.dtype != 'uint8':
        data = data.astype('uint8')
    
    # Create an image from the pixel data
    image = Image.fromarray(data)
    
    # Resize the image if necessary
    if image.width < min_width:
        ratio = min_width / image.width
        new_size = (min_width, int(image.height * ratio))
        image = image.resize(new_size, Image.LANCZOS)
    
    # Convert image to jpg
    with io.BytesIO() as output:
        image.save(output, format="JPEG")
        jpg_binary = output.getvalue()
        jpg_base64_str = base64.b64encode(jpg_binary).decode("utf-8")
    
    return jpg_base64_str


# Register the function as a UDF
dicom_to_base64_udf = udf(dicom_to_base64jpg, StringType())
