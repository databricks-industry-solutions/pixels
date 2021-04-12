from pyspark.sql import DataFrame
from pyspark.sql import functions as f
from pyspark.sql.functions import udf, col
from databricks.pixels import ObjectFrames
from databricks.pixels import PlotResult
from databricks.pixels.dicom_udfs import dicom_meta_udf
from databricks.pixels.dicom_udfs import dicom_plot_udf

import numpy as np

class DicomFrames(ObjectFrames):
    """ Specialized Dicom Image frame data structure """

    def __init__(self, df):
        super(self.__class__, self).__init__(df)
        self._df = df


    def toDF(self) -> DataFrame:
        return self._df

    def _with_meta(self, outputCol = 'meta', inputCol = 'local_path'):
        return DicomFrames(self._df.withColumn(outputCol,dicom_meta_udf(col(inputCol))))

    def _with_path_meta(self, basePath:str = 'dbfs:/', inputCol:str = 'path'):
        """ User overridable """
        return (
            DicomFrames(self._df
                .withColumn("relative_path", f.regexp_replace(inputCol, basePath+"(.*)$",r"$1"))
                .withColumn("local_path", f.regexp_replace(inputCol,"^dbfs:(.*$)",r"/dbfs$1"))
                .withColumn("extension",f.regexp_replace(inputCol, ".*\.(\w+)$", r"$1"))
                .withColumn("path_tags",
                                f.slice(
                                    f.split(
                                        f.regexp_replace(
                                            "relative_path",
                                            r"([0-9a-zA-Z]+)([\_\.\/\:\@])",
                                            r"$1,"),
                                        ","
                                    ),
                                    -1,
                                    5
                                )
                            )
                )
            )
    
    def withMeta(self):
        return self._with_path_meta()._with_meta()

    def plot(self):
        """plot runs a distributed plotting function over all Dicom images."""
        lst = self._df.withColumn(
                'plot',
                dicom_plot_udf(col('local_path'))
            ).select('plot').collect()
        return PlotResult([y for y in map(lambda x: x[0], lst)])

    def plotx(self):
        """plot runs a distributed plotting function over all Dicom images."""
        lst = self._df.withColumn(
                'plot',
                dicom_plot_udf(col('local_path'))
            ).select('plot','path_tags').collect()
        return PlotResult([y for y in map(lambda x: (x[0],x[1]), lst)])

if __name__ == '__main__':
    sys.path.insert(0, os.path.dirname(__file__)+"/../..")
    from databricks.pixels import DicomFrames
    o = DicomFrames(None)