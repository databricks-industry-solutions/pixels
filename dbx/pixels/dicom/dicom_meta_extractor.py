import hashlib

import pandas as pd
import pyspark.sql.types as t
from pyspark.ml.pipeline import Transformer
from pyspark.sql.functions import col, expr, lit, pandas_udf

from dbx.pixels.dicom.dicom_utils import cloud_open, extract_metadata


class DicomMetaExtractor(Transformer):
    """
    Transformer class to transform paths to Dicom files to Dicom metadata in JSON format.
    """

    # Day extractor inherit of property of Transformer
    def __init__(
        self,
        catalog,
        inputCol="local_path",
        outputCol="meta",
        basePath="dbfs:/",
        deep=False,
        useVariant=True,
    ):
        self.inputCol = inputCol  # the name of your columns
        self.outputCol = outputCol  # the name of your output column
        self.basePath = basePath
        self.catalog = catalog
        self.deep = (
            deep  # If deep = True analyze also pixels_array data, may impact performance if enabled
        )
        self.useVariant = useVariant

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

        @pandas_udf(t.StringType())
        def dicom_meta_udf(
            paths: pd.Series, deep_flags: pd.Series, anon_flags: pd.Series
        ) -> pd.Series:
            """Extract metadata from header of dicom image files (Pandas UDF)
            params:
            paths -- Series of local paths like /dbfs/mnt/... or s3://<bucket>/path/to/object.dcm
            deep_flags -- Series of boolean flags for deep inspection of the Dicom header
            anon_flags -- Series of boolean flags for accessing S3 public buckets
            """
            import simplejson as json
            from pydicom import dcmread

            def process_single_file(path: str, deep: bool, anon: bool) -> str:
                """Process a single DICOM file and return JSON metadata"""
                try:
                    fp, fsize = cloud_open(path, anon)
                    with dcmread(fp, defer_size=1000, stop_before_pixels=(not deep)) as dataset:
                        meta_js = extract_metadata(dataset, deep)
                        if deep:
                            meta_js["hash"] = hashlib.sha1(fp.read()).hexdigest()
                        meta_js["file_size"] = fsize
                        return json.dumps(meta_js, ignore_nan=True)
                except Exception as err:
                    except_str = str(
                        {
                            "udf": "dicom_meta_udf",
                            "error": str(err),
                            "args": str(err.args),
                            "path": path,
                        }
                    )
                    return json.dumps(except_str)

            # Process each row in the batch
            results = []
            for path, deep, anon in zip(paths, deep_flags, anon_flags):
                results.append(process_single_file(path, deep, anon))

            return pd.Series(results)

        self.check_input_type(df.schema)
        df = df.withColumn("is_anon", lit(self.catalog.is_anon()))
        df = df.withColumn(
            self.outputCol, dicom_meta_udf(col(self.inputCol), lit(self.deep), col("is_anon"))
        )
        if self.useVariant:
            df = df.withColumn(self.outputCol, expr(f"parse_json({self.outputCol})"))
        return df
