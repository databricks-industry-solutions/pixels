from typing import Iterator

import pandas as pd
from pyspark.ml.pipeline import Transformer
from pyspark.sql.functions import col, pandas_udf

from dbx.pixels.modelserving.serving_endpoint_client import MONAILabelClient


class MONAILabelTransformer(Transformer):
    """
    Transformer class to generate autosegmentations of DICOM files using MONAILabel serving endpoint.
    """

    def __init__(self, endpoint_name="pixels-monai-uc", inputCol="meta"):
        self.inputCol = inputCol
        self.endpoint_name = endpoint_name

    def _transform(self, df):
        @pandas_udf("result string, error string")
        def autosegm_monai_udf(iterator: Iterator[pd.Series]) -> Iterator[pd.DataFrame]:
            client = MONAILabelClient(self.endpoint_name)

            for s in iterator:
                results, errors = [], []
                for series_uid in s:
                    result, error = client.predict(series_uid)
                    results.append(result)
                    errors.append(error)

                yield pd.DataFrame({"result": results, "error": errors})

        return (
            df.selectExpr(f"{self.inputCol}:['0020000E'].Value[0] as series_uid")
            .filter("contains(meta:['00080008'], 'AXIAL')")
            .distinct()
            .withColumn("segmentation_result", autosegm_monai_udf(col("series_uid")))
            .selectExpr("series_uid", "segmentation_result.*")
        )
