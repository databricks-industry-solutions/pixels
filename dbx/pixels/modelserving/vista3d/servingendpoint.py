import os
from typing import Iterator

import pandas as pd
from mlflow.deployments import get_deploy_client
from pyspark.ml.pipeline import Transformer
from pyspark.sql.functions import col, pandas_udf, monotonically_increasing_id

from dbx.pixels.modelserving.serving_endpoint_client import MONAILabelClient


class MONAILabelClient:
    """
    Client for interacting with MONAI Label endpoints deployed on Databricks.
    
    This class facilitates making inference requests to deep learning models that 
    process medical imaging data, with built-in error handling and retry logic
    specifically designed for memory-intensive operations.
    """
    
    def __init__(self, endpoint_name, max_retries=3):
        """
        Initialize a new instance of the MONAILabelClient.
        
        Args:
            endpoint_name (str): The name of the MONAI Label endpoint deployed on Databricks.
            max_retries (int, optional): Maximum number of retry attempts for failed predictions.
                Defaults to 3.
        """
        self.client = get_deploy_client("databricks")
        self.endpoint = endpoint_name
        self.max_retries = max_retries

    def predict(self, series_uid, params, iteration=0, prev_error=None):
        """
        Execute the inference request to the Vista3D MONAI Label serving endpoint with built-in retry logic.
        
        This method handles errors during prediction, with special treatment for
        CUDA out-of-memory errors which are not retried. Other errors trigger
        automatic retries up to the configured maximum.
        
        Args:
            series_uid (str): Unique identifier for the medical image series.
            params (dict): Additional parameters for the prediction request.
            iteration (int, optional): Current retry iteration count. Used internally
                for recursion. Defaults to 0.
            prev_error (str, optional): Previous error message. Used internally for
                error tracking. Defaults to None.
                
        Returns:
            tuple: A tuple containing:
                - First element (str): Inference results as returned by the endpoint,
                  or an empty string if the prediction failed.
                - Second element (str): Error message if prediction failed, or an empty
                  string on success.
        """

        # Check if maximum retry count has been exceeded
        if iteration > self.max_retries:
            return ("", str(prev_error))

        try:
            # Attempt to call the endpoint with the provided parameters
            response = self.client.predict(
                endpoint=self.endpoint,
                inputs={"inputs": {"series_uid": series_uid, "params": params}},
            )
            return (response.predictions, "")
        except Exception as e:
            # Special handling for CUDA out-of-memory errors - don't retry these
            if "torch.OutOfMemoryError: CUDA out of memory" in str(e):
                return ("", str(e))
            
            # For all other errors, retry up to max_retries
            return self.predict(series_uid, params, iteration + 1, prev_error=str(e))


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
    - num_partitions: The number of partitions to use for the DataFrame. Default is 200. If num_partition is not provided than will be generated 1 partition per row.
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
        num_partitions=None,
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
    
    def _partition_strategy(self, df):
        if self.num_partitions is None:
            return df.withColumn("id", monotonically_increasing_id()).repartition("id").drop("id")
        else:
            return df.repartition(self.num_partitions)

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

        df = df.selectExpr(f"{self.inputCol}:['0020000E'].Value[0] as series_uid") \
            .filter("contains(meta:['00080008'], 'AXIAL')") \
            .distinct()
        
        df = self._partition_strategy(df)
        
        return df.withColumn("segmentation_result", autosegm_monai_udf(col("series_uid"))) \
                 .selectExpr("series_uid", "segmentation_result.*")
