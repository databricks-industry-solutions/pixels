import time
import pandas as pd
from pyspark.sql.functions import pandas_udf, col
from typing import Iterator
from pyspark.ml.pipeline import Transformer
from dbx.pixels.modelserving.serving_endpoint_client import MONAILabelClient


class MONAILabelTransformer(Transformer):
    """
    Transformer class to generate autosegmentations of DICOM files using MONAILabel serving endpoint.
    """

    def __init__(self, endpoint_name="pixels-monai", inputCol="meta"):
        self.inputCol = inputCol
        self.endpoint_name = endpoint_name

    def _transform(self, df):
        @pandas_udf("result string, error string")
        def autosegm_monai_udf(iterator: Iterator[pd.Series]) -> Iterator[pd.DataFrame]:
            client = MONAILabelClient(self.endpoint_name)

            for s in iterator:
                results, errors = [], []
                for image_id in s:
                    result, error = client.predict(image_id)
                    results.append(result)
                    errors.append(error)

                yield pd.DataFrame({"result": results, "error": errors})

        return df \
                .selectExpr(f"{self.inputCol}:['0020000E'].Value[0] as image_id") \
                .filter("contains(meta:['00080008'], 'AXIAL')") \
                .distinct() \
                .withColumn("segmentation_result", autosegm_monai_udf(col("image_id"))) \
                .selectExpr("image_id", "segmentation_result.*")
