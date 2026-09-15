import hashlib
from concurrent.futures import ThreadPoolExecutor
from typing import Iterator

import pandas as pd
import pyspark.sql.types as t
from pyspark.ml.pipeline import Transformer
from pyspark.sql.functions import expr, lit

from dbx.pixels.dicom.dicom_utils import cloud_open, extract_metadata


class DicomMetaExtractor(Transformer):
    """
    Transformer class to transform paths to Dicom files to Dicom metadata in JSON format.

    Uses mapInPandas with a ThreadPoolExecutor to concurrently read DICOM file
    headers over the network, maximizing I/O throughput on each Spark task.

    When a 'content' column is present in the input DataFrame (e.g. from
    in-memory zip extraction), the extractor reads DICOM data directly from
    the binary content instead of opening the file from the path.
    """

    MAX_WORKERS = 32

    def __init__(
        self,
        catalog,
        inputCol="local_path",
        contentCol="content",
        outputCol="meta",
        basePath="dbfs:/",
        deep=False,
        useVariant=True,
        maxWorkers=None,
        remove_un_tags=False,
        permissive=False,
    ):
        self.inputCol = inputCol
        self.contentCol = contentCol
        self.outputCol = outputCol
        self.basePath = basePath
        self.catalog = catalog
        self.deep = deep
        self.useVariant = useVariant
        self.maxWorkers = maxWorkers if maxWorkers is not None else self.MAX_WORKERS
        self.remove_un_tags = remove_un_tags
        self.permissive = permissive

    def check_input_type(self, schema):
        field = schema[self.inputCol]
        if field.dataType != t.StringType():
            raise Exception(
                f"DicomMetaExtractor field {self.inputCol}, input type {field.dataType} did not match input type StringType"
            )

        field = schema["extension"]
        if field.dataType != t.StringType():
            raise Exception(
                f"DicomMetaExtractor field {field.name}, input type {field.dataType} did not match input type StringType"
            )

    def _transform(self, df):
        """
        Perform Dicom to metadata transformation using mapInPandas with
        concurrent I/O via ThreadPoolExecutor.

        When a 'content' column is present (from in-memory zip extraction),
        DICOM data is read directly from the binary content without file I/O.
        Otherwise, files are read from paths via cloud_open().

        Input:
          col('extension')
          col('is_anon')
        Output:
          col(self.outputCol) # Dicom metadata header in JSON format
        """
        self.check_input_type(df.schema)
        df = df.withColumn("is_anon", lit(self.catalog.is_anon()))

        input_col = self.inputCol
        content_col = self.contentCol
        output_col = self.outputCol
        deep = self.deep
        max_workers = self.maxWorkers
        remove_un_tags = self.remove_un_tags

        # Detect whether in-memory content is available
        has_content = content_col in [field.name for field in df.schema.fields]

        # Build output schema: all existing columns + the new meta column (as StringType initially)
        out_schema = t.StructType(
            list(df.schema.fields) + [t.StructField(output_col, t.StringType(), True)]
        )

        def _extract_meta(iterator: Iterator[pd.DataFrame]) -> Iterator[pd.DataFrame]:
            """mapInPandas function that uses a thread pool for concurrent DICOM I/O."""
            import io

            import simplejson as json
            from pydicom import dcmread

            def _process_file(
                path: str, content: bytes, deep: bool, anon: bool, remove_un_tags: bool
            ) -> str:
                try:
                    if content is not None and len(content) > 0:
                        # Read from in-memory content (from zip extraction)
                        fp = io.BytesIO(
                            bytes(content) if not isinstance(content, bytes) else content
                        )
                        fsize = len(content)
                    else:
                        # Fall back to reading from path
                        fp, fsize = cloud_open(path, anon)

                    with dcmread(fp, defer_size=1000, stop_before_pixels=(not deep)) as dataset:
                        meta_js = extract_metadata(dataset, deep, remove_un_tags=remove_un_tags)
                        if deep:
                            if hasattr(fp, "seek"):
                                fp.seek(0)
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

            for pdf in iterator:
                paths = pdf[input_col].tolist()
                anon_flags = pdf["is_anon"].tolist()
                contents = (
                    pdf[content_col].tolist() if has_content and content_col in pdf.columns else [None] * len(paths)
                )

                with ThreadPoolExecutor(max_workers=max_workers) as executor:
                    meta_results = list(
                        executor.map(
                            lambda args: _process_file(
                                args[0], args[1], deep, args[2], remove_un_tags
                            ),
                            zip(paths, contents, anon_flags),
                        )
                    )

                pdf[output_col] = meta_results
                yield pdf

        df = df.mapInPandas(_extract_meta, schema=out_schema)

        if self.useVariant:
            if self.permissive:
                df = df.withColumn(
                    "_corrupt_record",
                    expr(
                        f"CASE WHEN try_parse_json({self.outputCol}) IS NULL THEN {self.outputCol} ELSE NULL END"
                    ),
                )
                df = df.withColumn(self.outputCol, expr(f"try_parse_json({self.outputCol})"))
            else:
                df = df.withColumn(self.outputCol, expr(f"parse_json({self.outputCol})"))
        return df
