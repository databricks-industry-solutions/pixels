import os
from typing import Iterator

import pandas as pd
from mlflow.deployments import get_deploy_client
from pyspark.ml.pipeline import Transformer
from pyspark.sql.functions import col, pandas_udf

from dbx.pixels.modelserving.serving_endpoint_client import MONAILabelClient


class MONAILabelClient:
    def __init__(self, endpoint_name, max_retries=3, request_timeout_sec=300):
        os.environ["MLFLOW_HTTP_REQUEST_MAX_RETRIES"] = str(max_retries)
        os.environ["MLFLOW_HTTP_REQUEST_TIMEOUT"] = str(request_timeout_sec)
        os.environ["MLFLOW_DEPLOYMENT_PREDICT_TIMEOUT"] = str(request_timeout_sec)

        self.client = get_deploy_client("databricks")
        self.endpoint = endpoint_name
        self.max_retries = max_retries

    def predict(self, series_uid, params={}):
        try:
            response = self.client.predict(
                endpoint=self.endpoint,
                inputs={"inputs": {"series_uid": series_uid, "params": params}},
            )
            return (response.predictions, "")
        except Exception as e:
            return ("", str(e))


class Vista3DMONAITransformer(Transformer):
    """
    Transformer class to generate autosegmentations of DICOM files using MONAILabel serving endpoint.

    Details of the Vista3D model can be found at: https://catalog.ngc.nvidia.com/orgs/nvidia/teams/monaitoolkit/models/monai_vista3d

    The transformer takes a DataFrame with DICOM metadata and generates segmentations using the MONAILabel
    serving endpoint. The segmentations are returned as a DataFrame with the same schema as the input DataFrame,
    with an additional column for the segmentation result.

    The transformer can be configured with the following parameters:
    - endpoint_name: The name of the MONAILabel serving endpoint with VISTA3D model to use. Default is "pixels-monai-uc-vista3d".
    - inputCol: The name of the input column containing the DICOM metadata. Default is "meta".
    - table: The name of the table to use for the MONAILabel serving endpoint. Default is "main.pixels_solacc.object_catalog".
    - destDir: The destination directory for the segmentations. Default is "/Volumes/main/pixels_solacc/pixels_volume/vista3d/",.
    - labelPrompt: The label prompt to use for the MONAILabel serving endpoint. Default is None.
    - points: The points to use for the MONAILabel serving endpoint. Default is None.
    - pointLabels: The point labels to use for the MONAILabel serving endpoint. Default is None.
    - exportMetrics: Whether to export metrics like segment volume size in cm3 and number of voxels. Default is False.
    - exportOverlays: Whether to export overlays. Default is False.
    - num_partitions: The number of partitions to use for the DataFrame. Default is 200.
    """

    def __init__(
        self,
        endpoint_name="pixels-monai-uc-vista3d",
        inputCol="meta",
        table="main.pixels_solacc.object_catalog",
        destDir="/Volumes/main/pixels_solacc/pixels_volume/vista3d/",
        labelPrompt=None,
        points=None,
        pointLabels=None,
        exportMetrics=False,
        exportOverlays=False,
        num_partitions=200,
    ):
        self.inputCol = inputCol
        self.endpoint_name = endpoint_name

        self.model_params = {
            "pixels_table": table,
            "dest_dir": destDir,
            "points": points,
            "point_labels": pointLabels,
            "label_prompt": labelPrompt,
            "export_metrics": exportMetrics,
            "export_overlays": exportOverlays,
        }
        self.num_partitions = num_partitions

    def _transform(self, df):
        @pandas_udf("result string, error string")
        def autosegm_monai_udf(iterator: Iterator[pd.Series]) -> Iterator[pd.DataFrame]:
            client = MONAILabelClient(self.endpoint_name)

            for s in iterator:
                results, errors = [], []
                for series_uid in s:
                    result, error = client.predict(series_uid, self.model_params)
                    results.append(result)
                    errors.append(error)

                yield pd.DataFrame({"result": results, "error": errors})

        return (
            df.selectExpr(f"{self.inputCol}:['0020000E'].Value[0] as series_uid")
            .filter("contains(meta:['00080008'], 'AXIAL')")
            .distinct()
            .repartition(self.num_partitions)
            .withColumn("segmentation_result", autosegm_monai_udf(col("series_uid")))
            .selectExpr("series_uid", "segmentation_result.*")
        )
