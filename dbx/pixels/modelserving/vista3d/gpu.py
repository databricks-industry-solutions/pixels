import os
from typing import Iterator, Tuple

import pandas as pd
from pyspark.ml.pipeline import Transformer
from pyspark.sql import functions as F

class Vista3DGPUTransformer(Transformer):
    """
    A transformer that processes 3D medical images using VISTA3D model with GPU acceleration.

    Details of the Vista3D model can be found at: https://catalog.ngc.nvidia.com/orgs/nvidia/teams/monaitoolkit/models/monai_vista3d    

    The transformer can be configured with the following parameters:
    - inputCol: The name of the input column containing the DICOM metadata. Default is "meta".
    - table: The name of the table to use for the MONAILabel serving endpoint. Default is "main.pixels_solacc.object_catalog".
    - destDir: The destination directory for the segmentations. Default is "/Volumes/main/pixels_solacc/pixels_volume/vista3d/".
    - sqlWarehouseId: The SQL warehouse ID to use for the MONAILabel serving endpoint. Default is None.
    - labelPrompt: The label prompt to use for the MONAILabel serving endpoint. Default is None.
    - points: The points to use for the MONAILabel serving endpoint. Default is None.
    - pointLabels: The point labels to use for the MONAILabel serving endpoint. Default is None.
    - exportMetrics: Whether to export metrics like segment volume size in cm3 and number of voxels. Default is False.
    - exportOverlays: Whether to export overlays. Default is False.
    - host: The host URL for the MONAILabel serving endpoint. Default is None.
    - secret: The secret token for the MONAILabel serving endpoint. Default is None.
    - gpuCount: The number of GPUs to use for processing. Default is 1.
    - nWorkers: The number of workers to use for processing. Default is 1.
    - tasksPerGpu: The number of tasks to run per GPU. Default is 1.
    - parallelization: The number of partitions to use for the DataFrame. Default is 200.
    """

    def __init__(
        self,
        inputCol="meta",
        table="main.pixels_solacc.object_catalog",
        destDir="/Volumes/main/pixels_solacc/pixels_volume/vista3d/",
        sqlWarehouseId=None,
        labelPrompt=None,
        points=None,
        pointLabels=None,
        exportMetrics=None,
        exportOverlays=None,
        host=None,
        secret=None,
        gpuCount=1,
        nWorkers=1,
        tasksPerGpu=1
    ):

        self.inputCol = inputCol

        self.table = table
        self.destDir = destDir
        self.sqlWarehouseId = sqlWarehouseId
        self.labelPrompt = labelPrompt
        self.points = points
        self.pointLabels = pointLabels
        self.exportMetrics = exportMetrics
        self.exportOverlays = exportOverlays

        self.secret = secret
        self.host = host
        self.gpuCount = gpuCount
        self.nWorkers = nWorkers
        self.parallelization = int(self.gpuCount * nWorkers // tasksPerGpu)
    
    def _transform(self, df):
        @F.pandas_udf("result string, error string")
        def autosegm_monai_udf(
            iterator: Iterator[Tuple[pd.Series, pd.Series]],
        ) -> Iterator[pd.DataFrame]:

            os.environ["DEST_DIR"] = self.destDir
            os.environ["DATABRICKS_HOST"] = self.host
            os.environ["DATABRICKS_WAREHOUSE_ID"] = self.sqlWarehouseId
            os.environ["DATABRICKS_PIXELS_TABLE"] = self.table
            os.environ["DATABRICKS_TOKEN"] = self.secret

            params = {
                "label_prompt": self.labelPrompt,
                "points": self.points,
                "point_labels": self.pointLabels,
                "export_metrics": self.exportMetrics,
                "export_overlays": self.exportOverlays,
            }

            from monailabel_model.vista3d.code.dbvista3dmodel import DBVISTA3DModel

            model = DBVISTA3DModel(volumes_compatible=True)
            model.load_context()

            def process_series(series_uid, pid):
                # Perf fix for single node multi gpu
                if self.nWorkers == 1:
                    params['torch_device'] = pid % self.gpuCount
                
                try:
                    result = model.predict(
                        None, pd.DataFrame([{"series_uid": series_uid, "params": params}])
                    )
                    error = ""
                except Exception as e:
                    result = ""
                    error = str(e)
                return result, error

            for list_series_uid, list_pid in iterator:
                results, errors = [], []
                for series_uid, pid in zip(list_series_uid, list_pid):
                    result, error = process_series(series_uid, pid)
                    results.append(result)
                    errors.append(error)
                yield pd.DataFrame({"result": results, "error": errors})

        return (
            df.selectExpr(f"{self.inputCol}:['0020000E'].Value[0] as series_uid")
            .filter("contains(meta:['00080008'], 'AXIAL')")
            .distinct()
            .repartition(self.parallelization)
            .withColumn(
                "segmentation_result", autosegm_monai_udf(F.col("series_uid"), F.spark_partition_id())
            )
            .selectExpr("series_uid", "segmentation_result.*")
        )
