import hashlib
import json
import os

from pydicom import Dataset
from pyspark.sql.functions import udf

from ff3 import FF3Cipher


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
        df -- An object of type pydicom.Dataset
    """
    try:
        a = ds.pixel_array
    except:
        return None
    return a


@udf
def dicom_meta_udf(path: str, deep: bool = True, anon: bool = False) -> dict:
    """Extract metadata from header of dicom image file
    params:
      path -- local path like /dbfs/mnt/... or s3://<bucket>/path/to/object.dcm
      deep -- True if deep inspection of the Dicom header is required
      anon -- Set to True if accessing S3 and the bucket is public
    """
    import numpy as np
    from pydicom import dcmread

    try:

        fp, fsize = cloud_open(path, anon)
        with dcmread(fp, defer_size=1000, stop_before_pixels=(not deep)) as ds:
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
                a = ds.pixel_array
                a.flags.writeable = False
                js["has_pixel"] = True
                js["hash"] = hashlib.sha1(a).hexdigest()
                js["img_min"] = np.min(a).item()
                js["img_max"] = np.max(a).item()
                js["img_avg"] = np.average(a).item()
                js["img_shape_x"] = a.shape[0]
                js["img_shape_y"] = a.shape[1]
            elif deep:
                js["has_pixel"] = False

            js["file_size"] = fsize

            return json.dumps(js)
    except Exception as err:
        except_str = str(
            {"udf": "dicom_meta_udf", "error": str(err), "args": str(err.args), "path": path}
        )
        return except_str


@udf()
def anonymize_dicom_file(path: str, dest_path:str, fp_key:str, tweak:str) -> str:
    """
    UDF to anonymize a DICOM file.
    Args:
        path (str): Path to the DICOM file.
        dest_path (str): Destination path to save the anonymized DICOM file.
        fp_key (str): Key for encryption.
        tweak (str): Tweak for encryption.
    Returns:
        str: Path to the anonymized DICOM file.
    """
    import dicognito.anonymizer
    from pydicom import Dataset, dcmread
    import os

    c = FF3Cipher(fp_key, tweak)

    anonymizer = dicognito.anonymizer.Anonymizer()

    ds = dcmread(path)

    encr_StudyInstanceUID = ".".join([c.encrypt(element) if len(element) > 6 else element for element in ds.StudyInstanceUID.split(".")])
    encr_SeriesInstanceUID = ".".join([c.encrypt(element) if len(element) > 6 else element for element in ds.SeriesInstanceUID.split(".")])
    encr_SOPInstanceUID = ".".join([c.encrypt(element) if len(element) > 6 else element for element in ds.SOPInstanceUID.split(".")])

    anonymizer.anonymize(ds)

    with Dataset() as dataset:
        dataset.add_new(0x0020000D, "UI", encr_StudyInstanceUID)
        dataset.add_new(0x0020000E, "UI", encr_SeriesInstanceUID)
        dataset.add_new(0x00080018, "UI", encr_SOPInstanceUID)
        ds.update(dataset)
    
    anonymized_path = f"{dest_path}{encr_StudyInstanceUID}/{encr_SeriesInstanceUID}"

    if not os.path.exists(anonymized_path):
        os.makedirs(anonymized_path)

    ds.save_as(f"{anonymized_path}/{encr_SOPInstanceUID}.dcm")

    return anonymized_path
