import io
from typing import Iterator, Tuple

import pandas as pd
import pyspark.sql.types as t
from PIL import Image
from pydicom import dcmread
from pyspark.ml.pipeline import Transformer
from pyspark.sql.functions import col, pandas_udf

from dbx.pixels.dicom.dicom_udfs import cloud_open

IMAGE_RESIZE = 256
IMAGE_SIZE = 768


class DicomPillowThumbnailExtractor(Transformer):
    """Transformer class to extract Thumbnail image from Dicom file.

    Parameters:
      inputCol (string): The localized (/) (or s3) path to your Dicom file
      outputCol (string): The name of your output column
      method (string): The Thumbnail method [matplotlib (default), pillow]

    Returns:
      imageSchema (outputCol): Spark dataframe column containing thumbnail of Dicom file

    Example:
      from dbx.pixels import DicomThumbnailExtractor # The transformer
      xform = DicomThumbnailExtractor()
      thumbnail_df = xform.transform(dcm_df_filtered)
      display(thumbnail_df)
    """

    def __init__(self, inputCol="local_path", outputCol="thumbnail"):
        self._inputCol = inputCol
        self._outputCol = outputCol

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

    def dicom_pillow_thumbnail(
        iterator: Iterator[Tuple[pd.Series, pd.Series]]
    ) -> Iterator[pd.Series]:
        """UDF Wrapper for thumbnail pandas udf"""

        def dicom_to_thumbnail(path, anon):
            """read dicom and serialize as png"""
            if True:
                fp, fsize = cloud_open(path, anon)
                with dcmread(fp) as ds:
                    image = Image.fromarray(ds.pixel_array).resize((IMAGE_RESIZE, IMAGE_RESIZE))
                    output = io.BytesIO()
                    image.save(output, format="PNG")
                    return output.getvalue()
            # except Exception:
            #  #some images are invalid
            #  return pd.Series(0)

        for a, b in iterator:
            # raise Exception(F"a {len(a)}, b {len(b)}")
            for i in range(len(a)):
                yield pd.Series(dicom_to_thumbnail(a.get(i), b.get(i)))

    def _do_pillow_thumbnail(self, df):
        """Use Pillow to create the thumbnail. The resulting image may be distorted"""

        image_meta = {"spark.contentAnnotation": '{"mimeType": "image/png"}'}
        dicom_pillow_thumbnail_udf = pandas_udf(
            DicomPillowThumbnailExtractor.dicom_pillow_thumbnail, returnType=t.BinaryType()
        )

        return df.withColumn(
            self._outputCol,
            dicom_pillow_thumbnail_udf(col("local_path"), col("is_anon")).alias(
                "content", metadata=image_meta
            ),
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
        return self._do_pillow_thumbnail(df)
