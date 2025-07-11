import os
import traceback
from typing import Iterator, Tuple

import pandas as pd
from pyspark.ml.pipeline import Transformer
from pyspark.sql import functions as F

from dbx.pixels.logging import LoggerProvider


class MonaiLabelBundlesGPUTransformer(Transformer):
    """
    A transformer that processes 3D medical images using MonaiLabel bundle models with GPU acceleration.

    The transformer can be configured with the following parameters:
    - inputCol: The name of the input column containing the DICOM metadata. Default is "meta".
    - table: The name of the table to use for the MONAILabel serving endpoint. Default is "main.pixels_solacc.object_catalog".
    - destDir: The destination directory for the segmentations. Default is "/Volumes/main/pixels_solacc/pixels_volume/bundles/".
    - modelName: The name of the MONAILabel model to use. Default is "wholeBody_ct_segmentation".
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

    The parallelization is determined by the number of GPUs and workers specified in the constructor.

    The transformer returns a DataFrame with the following columns:
    - series_uid: The series UID of the input image.
    - result: The segmentation result as a string.
    - error: Any error messages encountered during processing.
    """

    def __init__(
        self,
        inputCol="meta",
        table="main.pixels_solacc.object_catalog",
        destDir="/Volumes/main/pixels_solacc/pixels_volume/bundles/",
        modelName="wholeBody_ct_segmentation",
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
        tasksPerGpu=1,
    ):

        self.inputCol = inputCol

        self.table = table
        self.destDir = destDir
        self.modelName = modelName
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

        self.logger = LoggerProvider(name=__name__)

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
            os.environ["MONAI_BUNDLES"] = self.modelName

            params = {
                "label_prompt": self.labelPrompt,
                "points": self.points,
                "point_labels": self.pointLabels,
                "export_metrics": self.exportMetrics,
                "export_overlays": self.exportOverlays,
            }

            from monailabel_model.bundles.code.bundlesmodel import DBBundlesModel

            model = DBBundlesModel(volumes_compatible=True)
            model.load_context()

            def process_series(series_uid, pid):
                # Perf fix for single node multi gpu
                if self.nWorkers == 1:
                    params["torch_device"] = f"cuda:{pid % self.gpuCount}"

                self.logger.debug({"series_uid": series_uid, "params": params})

                try:
                    result = model.predict(
                        None, pd.DataFrame([{"series_uid": series_uid, "params": params}])
                    )
                    error = ""
                except Exception as e:
                    self.logger.error(e)
                    self.logger.error(traceback.format_exc())  # Print stacktrace
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
                "segmentation_result",
                autosegm_monai_udf(F.col("series_uid"), F.spark_partition_id()),
            )
            .selectExpr("series_uid", "segmentation_result.*")
        )
