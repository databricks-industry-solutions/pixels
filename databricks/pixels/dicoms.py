from pyspark.sql import DataFrame
from pyspark.sql import functions as f
from pyspark.sql.functions import udf, col, lit
from databricks.pixels import ObjectFrames
from databricks.pixels import PlotResult
from databricks.pixels.dicom_udfs import dicom_plot_udf
from databricks.pixels.dicom_meta_extractor import dicom_meta_udf

import numpy as np


class DicomFrames(ObjectFrames):
    """ Specialized Dicom Image frame data structure """

    def __init__(self, df, withMeta = False, inputCol = 'local_path', outputCol = 'meta'):
        super(self.__class__, self).__init__(df)
        self._df = df

    def toDF(self) -> DataFrame:
        return self._df

    def _with_meta(self, outputCol = 'meta', inputCol = 'local_path'):
        return DicomFrames(self._df.withColumn(outputCol,dicom_meta_udf(col(inputCol))))
    
    def withMeta(self):
        return self._with_meta()

    def plot(self):
        """Plot runs a distributed plotting function over all Dicom images returning plot and path_tags."""
        import os
        save_folder = "/dbfs/FileStore/plots/pixels"
        os.makedirs(save_folder, exist_ok=True)
        
        lst = self._df.withColumn(
                'plot',
                dicom_plot_udf(col('local_path'), col('is_anon'), lit(save_folder))
            ).select('plot','path_tags').collect()
        return PlotResult([y for y in map(lambda x: (x[0],x[1]), lst)])

