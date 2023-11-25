import hashlib

from pyspark.sql.functions import udf


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
        if path[-4:].lower() != ".dcm":
            return {}

        fp = cloud_open(path, anon)
        with dcmread(fp, defer_size=1000, stop_before_pixels=(not deep)) as ds:
            js = ds.to_json_dict()
            # remove binary images
            if "60003000" in js:
                del js["60003000"]
            if "7FE00010" in js:
                del js["7FE00010"]

            if deep:
                a = ds.pixel_array
                a.flags.writeable = False
                js["hash"] = hashlib.sha1(ds.pixel_array).hexdigest()
                js["img_min"] = np.min(a)
                js["img_max"] = np.max(a)
                js["img_avg"] = np.average(a)
                js["img_shape_x"] = a.shape[0]
                js["img_shape_y"] = a.shape[1]

            return str(js)
    except Exception as err:
        except_str = str(
            {"udf": "dicom_meta_udf", "error": str(err), "args": str(err.args), "path": path}
        )
        return except_str
