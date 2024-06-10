import hashlib
import json

from pyspark.sql.functions import udf
from pydicom import Dataset

def cloud_open(path: str, anon: bool = False):
    try:
        if path.startswith("s3://"):
            """Read from S3 directly"""
            import s3fs

            fs = s3fs.S3FileSystem(anon)
            fp = fs.open(path)
        else:
            """Read from local filesystem"""
            fp = open(path, "rb")
        return fp
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

        fp = cloud_open(path, anon)
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

            return json.dumps(js)
    except Exception as err:
        except_str = str(
            {"udf": "dicom_meta_udf", "error": str(err), "args": str(err.args), "path": path}
        )
        return except_str