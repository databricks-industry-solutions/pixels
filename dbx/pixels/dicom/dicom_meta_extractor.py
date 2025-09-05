import hashlib

import pyspark.sql.types as t
from pyspark.ml.pipeline import Transformer
from pyspark.sql.functions import col, lit, udf

from dbx.pixels.dicom.dicom_utils import cloud_open, extract_metadata


class DicomMetaExtractor(Transformer):
    """
    Transformer class to transform paths to Dicom files to Dicom metadata in JSON format.
    """

    # Day extractor inherit of property of Transformer
    def __init__(
        self, catalog, inputCol="local_path", outputCol="meta", basePath="dbfs:/", deep=True
    ):
        self.inputCol = inputCol  # the name of your columns
        self.outputCol = outputCol  # the name of your output column
        self.basePath = basePath
        self.catalog = catalog
        self.deep = (
            deep  # If deep = True analyze also pixels_array data, may impact performance if enabled
        )

    def check_input_type(self, schema):
        field = schema[self.inputCol]
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

    def _transform(self, df):
        """
        Perform Dicom to metadata transformation.
        Input:
          col('extension')
          col('is_anon')
        Output:
          col(self.outputCol) # Dicom metadata header in JSON format
        """

        @udf
        def dicom_meta_udf(path: str, deep: bool = True, anon: bool = False) -> dict:
            """Extract metadata from header of dicom image file
            params:
            path -- local path like /dbfs/mnt/... or s3://<bucket>/path/to/object.dcm
            deep -- True if deep inspection of the Dicom header is required
            anon -- Set to True if accessing S3 and the bucket is public
            """
            import json

            from pydicom import dcmread

            try:
                fp, fsize = cloud_open(path, anon)
                with dcmread(fp, defer_size=1000, stop_before_pixels=(not deep)) as dataset:
                    meta_js = extract_metadata(dataset, deep)
                    if deep:
                        meta_js["hash"] = hashlib.sha1(fp.read()).hexdigest()
                    meta_js["file_size"] = fsize
                    return json.dumps(meta_js)
            except Exception as err:
                except_str = str(
                    {
                        "udf": "dicom_meta_udf",
                        "error": str(err),
                        "args": str(err.args),
                        "path": path,
                    }
                )
                return except_str

        self.check_input_type(df.schema)
        return df.withColumn("is_anon", lit(self.catalog.is_anon())).withColumn(
            self.outputCol, dicom_meta_udf(col(self.inputCol), lit(self.deep), col("is_anon"))
        )
