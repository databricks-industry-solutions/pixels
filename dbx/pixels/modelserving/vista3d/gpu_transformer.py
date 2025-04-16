import os
from typing import Iterator, Tuple

import pandas as pd
from pyspark.ml.pipeline import Transformer
from pyspark.sql import functions as F
from pyspark.sql.functions import col, lit

from dbx.pixels.catalog import Catalog


class Vista3DGPUTransformer(Transformer):
    """
    A transformer that processes 3D medical images using GPU acceleration.
    This transformer is designed to work within a Spark pipeline on the current cluster.
    """

    def __init__(
        self,
        catalog: Catalog = None,
        inputCol="meta",
        table=None,
        destDir=None,
        sqlWarehouseId=None,
        labelPrompt=None,
        exportMetrics=None,
        exportOverlays=None,
        secret=None,
    ):

        self.inputCol = inputCol
        self.catalog = catalog
        self.table = table
        self.destDir = destDir
        self.sqlWarehouseId = sqlWarehouseId
        self.labelPrompt = labelPrompt
        self.exportMetrics = exportMetrics
        self.exportOverlays = exportOverlays
        self.secret = secret
        self.host = os.environ["DATABRICKS_HOST"]

    def _transform(self, df):
        @F.pandas_udf("result string, error string")
        def autosegm_monai_udf(
            iterator: Iterator[Tuple[pd.Series, pd.Series]],
        ) -> Iterator[pd.DataFrame]:

            os.environ["DEST_DIR"] = self.destDir
            os.environ["DATABRICKS_HOST"] = self.host
            os.environ["DATABRICKS_WAREHOUSE_ID"] = self.sqlWarehouseId
            os.environ["DATABRICKS_PIXELS_TABLE"] = self.table

            params = {
                "label_prompt": self.labelPrompt,
                "export_metrics": self.exportMetrics,
                "export_overlays": self.exportOverlays,
            }

            from monailabel_model.vista3d.code.dbvista3dmodel import DBVISTA3DModel

            model = DBVISTA3DModel()
            model.load_context(context=None)

            for list_series_uid, list_token in iterator:
                results, errors = [], []
                for series_uid, token in zip(list_series_uid, list_token):
                    os.environ["DATABRICKS_TOKEN"] = token
                    try:
                        results.append(
                            model.predict(
                                None, pd.DataFrame([{"series_uid": series_uid, "params": params}])
                            )
                        )
                        errors.append("")
                    except Exception as e:
                        results.append("")
                        errors.append(str(e))
                yield pd.DataFrame({"result": results, "error": errors})

        return (
            df.selectExpr(f"{self.inputCol}:['0020000E'].Value[0] as series_uid")
            .filter("contains(meta:['00080008'], 'AXIAL')")
            .distinct()
            .withColumn(
                "segmentation_result", autosegm_monai_udf(col("series_uid"), lit(self.secret))
            )
            .selectExpr("series_uid", "segmentation_result.*")
        )
