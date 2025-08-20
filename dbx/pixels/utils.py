import hashlib
import os
import zipfile
import fsspec
from io import BytesIO

import pandas as pd
from PIL import Image
from pyspark.ml.image import ImageSchema
from pyspark.sql.functions import pandas_udf, udf
from pyspark.sql.types import ArrayType, StringType

from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider()


def to_image(data: bytes):
    """Converts PNG image based bytes data and converts it into OpenCV compatible Image type. This is the basis of diplaying images stored in Spark dataframes witin Databricks.
    :param bytes data - PNG image bytes
    """
    sig = hashlib.md5(data).hexdigest()

    b = BytesIO(initial_bytes=data)
    format = "RGBA"
    r, g, b, a = Image.open(b).convert(format).split()  # Convert to get matrix of pixel values
    imgx = Image.merge(format, (b, g, r, a))  # Flip color bands
    return {
        "image": [
            f"file-{sig}.png",
            imgx.height,
            imgx.width,
            4,  #
            ImageSchema.ocvTypes["CV_8UC4"],
            imgx.tobytes(),
        ]
    }


def _file_reader_helper(path):
    """Helper function to determine file reader based on path"""
    if path.startswith("s3://"):
        import s3fs
        from botocore.exceptions import NoCredentialsError

        fs = s3fs.S3FileSystem(anon=False)
        try:
            fs.exists(path)
        except NoCredentialsError:
            fs = s3fs.S3FileSystem(anon=True)
        fp = fs.open(path)
    elif path.startswith("dbfs:/Volumes/"):
        fp = open(path.replace("dbfs:/Volumes/", "/Volumes/"), "rb")
    elif path.startswith("dbfs:/"):
        fp = open(path.replace("dbfs:/", "/dbfs/"), "rb")
    else:
        fp = open(path, "rb")
    return fp.read()


@udf
def identify_type_udf(path: str):
    """Identifies the file type of a file based on the magic string."""
    import magic

    return magic.from_buffer(_file_reader_helper(path))


def unzip(raw_path, unzipped_base_path):
    """Unzips a file and returns a list of files that were unzipped."""
    logger.info(f"- UNZIP - Start unzip {raw_path}")
    to_return = []

    path = raw_path.replace("dbfs:", "")

    with fsspec.open("simplecache::"+path, mode="rb", s3={'anon': True}) as fp:

        # Check if file is zip
        is_zip = zipfile.is_zipfile(fp)
        if not is_zip:
            return [path]

        zip_archive = zipfile.ZipFile(fp, "r")
        zip_name = os.path.splitext(os.path.basename(path))[0]

        num_files_in_zip = len(zip_archive.namelist())
        processed = 0

        for file_name in zip_archive.namelist():
            if not os.path.basename(file_name).startswith(".") and not file_name.endswith("/"):
                logger.debug(f"- UNZIP - Unzipping file {file_name} in {path}")

                file_path = os.path.join(unzipped_base_path, zip_name, file_name)

                file_dir = os.path.dirname(file_path)
                if not os.path.exists(file_dir):
                    os.makedirs(file_dir)

                if path.startswith("/Volumes/"):
                    zip_cmd = ["unzip", "-j", "-o", path, file_name, "-d", file_dir]
                    result = subprocess.run(zip_cmd, capture_output=True, text=True)
                    
                    if result.returncode != 0:
                        raise Exception(result.stderr)

                else:
                   with zip_archive.open(file_name, "r") as file_object:
                    with open(file_path, "wb") as f:
                        f.write(file_object.read())

                to_return.append("dbfs:" + file_path)

            processed += 1
            if processed % 100 == 0:
                logger.info(
                    f"- UNZIP - {round(processed/num_files_in_zip*100,2)}% | {processed} / {num_files_in_zip} from {path}"
                )

    logger.info(f"- UNZIP - Completed unzip {path}")
    return to_return


@pandas_udf(ArrayType(StringType()))
def unzip_pandas_udf(col1, col2):
    return pd.Series([unzip(path, volume_base_path) for path, volume_base_path in zip(col1, col2)])


DICOM_MAGIC_STRING = "DICOM medical imaging data"
ZIP_MAGIC_STRING = "Zip archive data"
