import hashlib
from typing import Dict, List

import pyspark.sql.types as t
from pyspark.ml.pipeline import Transformer
from pyspark.sql.functions import col, explode, expr, lit, udf

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

        @udf(returnType=t.ArrayType(t.StringType()))
        def dicom_meta_udf(
            path: str, deep: bool = True, anon: bool = False, file_type: str = ""
        ) -> List[Dict]:
            """Extract metadata from header of dicom image file
            params:
            path -- local path like /dbfs/mnt/... or s3://<bucket>/path/to/object.dcm
            deep -- True if deep inspection of the Dicom header is required
            anon -- Set to True if accessing S3 and the bucket is public
            """
            import json

            from pydicom import dcmread
            from pydicom.filereader import read_preamble

            def process_dicom(file_obj, real_path, size):
                try:
                    with dcmread(file_obj, stop_before_pixels=(not deep)) as dataset:
                        meta_js = extract_metadata(dataset, deep)
                        #meta_js["hash"] = hashlib.sha1(file_obj.read()).hexdigest()
                        meta_js["file_size"] = size
                        meta_js["path"] = real_path
                        return json.dumps(meta_js)
                except Exception as err:
                    except_str = {
                        "udf": "dicom_meta_udf.process_dicom",
                        "error": str(err),
                        "args": str(err.args),
                        "path": real_path,
                    }
                    return json.dumps(except_str)

            try:
                fp, fsize = cloud_open(path, anon)
                if "zip" in file_type.lower():
                    import os
                    import zipfile

                    list_meta = []
                    with zipfile.ZipFile(fp, "r") as z:
                        for file in z.infolist():
                            if file.filename.endswith("/"):
                                continue
                            with z.open(file.filename) as z_file:
                                if not read_preamble(z_file, force=True):
                                    continue
                                z_file.seek(0)
                                list_meta.append(
                                    process_dicom(
                                        z_file, os.path.join(path, file.filename), file.file_size
                                    )
                                )
                    return list_meta
                elif "dicom" in file_type.lower():
                    return [process_dicom(fp, path, fsize)]
                else:
                    return [process_dicom(fp, path, fsize)]
            except Exception as err:
                except_str = {
                    "udf": "dicom_meta_udf",
                    "error": str(err),
                    "args": str(err.args),
                    "path": path,
                }
                return [json.dumps(except_str)]

        self.check_input_type(df.schema)
        return (
            df.withColumn("is_anon", lit(self.catalog.is_anon()))
            .withColumn(
                self.outputCol,
                explode(
                    dicom_meta_udf(
                        col(self.inputCol), lit(self.deep), col("is_anon"), col("file_type")
                    )
                ),
            )
            .withColumn("path", expr(f"concat('dbfs:',{self.outputCol}:path::string)"))
            .withColumn("relative_path", expr(f"{self.outputCol}:path::string"))
            ##.withColumn("meta", expr(f"parse_json({self.outputCol})"))
        )
