import hashlib
from io import BytesIO
from warnings import deprecated

import matplotlib
import matplotlib.pyplot as plt
import pyspark.sql.types as t
from PIL import Image
from pydicom import dcmread
from pyspark.ml.pipeline import Transformer
from pyspark.sql.functions import col, udf
from pyspark.sql.types import (
    BinaryType,
    IntegerType,
    StringType,
    StructField,
    StructType,
)
from typing_extensions import deprecated

from dbx.pixels.dicom.dicom_utils import cloud_open


@deprecated("Use OHIF viewer instead")
class DicomThumbnailExtractor(Transformer):
    """Transformer class to extract Thumbnail image from Dicom file.

    Parameters:
      inputCol (string): The localized (/) (or s3) path to your Dicom file
      outputCol (string): The name of your output column

    Returns:
      imageSchema (outputCol): Spark dataframe column containing thumbnail of Dicom file

    Example:
      from dbx.pixels import DicomThumbnailExtractor # The transformer
      xform = DicomThumbnailExtractor()
      thumbnail_df = xform.transform(dcm_df_filtered)
      display(thumbnail_df)
    """

    def __init__(self, inputCol="local_path", outputCol="thumbnail", method="matplotlib"):
        self._inputCol = inputCol
        self._outputCol = outputCol
        self._method = method

    def check_input_type(self, schema):
        """Verifies input dataframe contains columns
        Parameters:
          inputCol: Column containing localize path to Dicom file
          extension: file extension discovered during earlier process
          is_anon: True if s3 path and bucket is publically accessible
        """
        field = schema[self._inputCol]
        # assert that field is a datetype
        if field.dataType != t.StringType():
            raise Exception(
                f"DicomMetaExtractor field {self.inputCol}, input type {field.dataType} did not match input type StringType"
            )

        field = schema["extension"]  # file extension
        # assert that field is a datetype
        if field.dataType != t.StringType():
            raise Exception(
                f"DicomMetaExtractor field {field.name}, input type {field.dataType} did not match input type StringType"
            )

        field = schema["is_anon"]  # file extension
        # assert that field is a datetype
        if field.dataType != t.BooleanType():
            raise Exception(
                f"DicomMetaExtractor field {field.name}, input type {field.dataType} did not match input type BooleanType"
            )

    def figure_to_image(fig: matplotlib.figure):
        """Convert Matplotlib figure into Spark Image type

        Parameters:
          fig (Matplotlib.figure): Matplot figure containing thumbnail
        """
        tmpfile = BytesIO()
        fig.savefig(tmpfile, format="PNG")  # Create a PNG byte array from Matplotlib fig

        # Convert PNG to Image data array
        img = Image.open(tmpfile).convert("RGBA")  # Convert to get matrix of pixel values
        r, g, b, a = img.split()
        imgx = Image.merge("RGBA", (b, g, r, a))  # Flip color bands
        bytesx = imgx.tobytes()
        sig = hashlib.md5(bytesx).hexdigest()
        return {
            "image": {
                "origin": f"matplotlib-{sig}.png",  # origin
                "height": img.size[1],  # height
                "width": img.size[0],  # width
                "nChannels": 4,  # nChannels (RGBA)
                "mode": 24,  # mode
                "data": bytesx,  # must be bytearray
            }
        }

    def _do_matplotlib_thumbnail(self, df):
        """Use Matplotlib to create the thumbnail. The resulting will have scale bars"""

        def dicom_matplotlib_thumbnail(path: str, anon: bool = False):
            """Distributed function to render Dicom plot.
            This UDF will generate .png image into the

            Parameters:
            path (string) : Valid path (per cloud_open()) to Dicom file. Must end in .dcm
            anon (bool) : True if access to S3 bucket is anonymous
            """

            cmap = "gray"
            try:
                fp, fsize = cloud_open(path, anon)
                with dcmread(fp) as ds:
                    fig, ax = plt.subplots()
                    ax.imshow(ds.pixel_array, cmap=cmap)
                    image = DicomThumbnailExtractor.figure_to_image(fig)
                    plt.close()
                    return image
            except Exception as err:
                err_str = f"function: dicom_thumbnail_udf, input: {path}, err: {str(err)}"
                return {
                    "image": {
                        "origin": err_str,  # origin
                        "height": -1,  # height
                        "width": -1,  # width
                        "nChannels": -1,  # nChannels (RGBA)
                        "mode": -1,  # mode
                        "data": bytearray(0),  # must be bytearray
                    }
                }

        imageSchema = StructType(
            [
                StructField(
                    "image",
                    StructType(
                        [
                            StructField("origin", StringType(), True),
                            StructField("height", IntegerType(), False),
                            StructField("width", IntegerType(), False),
                            StructField("nChannels", IntegerType(), False),
                            StructField("mode", IntegerType(), False),
                            StructField("data", BinaryType(), False),
                        ]
                    ),
                    True,
                )
            ]
        )
        myudf = udf(dicom_matplotlib_thumbnail, returnType=imageSchema)
        return (
            df.withColumn("imageType", myudf(col(self._inputCol), col("is_anon")))
            .selectExpr("*", f"imageType.image as {self._outputCol}")
            .drop("imageType")
        )

    def _transform(self, df):
        """
        Perform Dicom to metadata transformation.
        Input:
          col('extension')
          col('is_anon')
        Output:
          col(self.outputCol) # Dicom metadata header in JSON format
        """
        self.check_input_type(df.schema)
        return self._do_matplotlib_thumbnail(df)
