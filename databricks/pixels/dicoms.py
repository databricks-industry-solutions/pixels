from pyspark.sql import DataFrame
from pyspark.sql import functions as f
from pyspark.sql.functions import udf, col
from databricks.pixels import ObjectFrames
from databricks.pixels import PlotResult
#from databricks.pixels.dicom_udfs import dicom_meta_udf
from databricks.pixels.dicom_udfs import dicom_plot_udf

import numpy as np

class DicomFrames(ObjectFrames):
    """ Specialized Dicom Image frame data structure """

    def __init__(self, df, withMeta = False, inputCol = 'local_path', outputCol = 'meta'):
        #if withMeta:
            #df =  df.withColumn(outputCol,dicom_meta_udf(col(inputCol)))
        super(self.__class__, self).__init__(df)
        self._df = df

    def toDF(self) -> DataFrame:
        return self._df

    def _with_meta(self, outputCol = 'meta', inputCol = 'local_path'):
        #return DicomFrames(self._df.withColumn(outputCol,dicom_meta_udf(col(inputCol))))
        return DicomFrames(self._df.mapInPandas(dcm_meta,dcm_meta_schema))
    
    def withMeta(self):
        return self._with_meta()

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


from typing import Iterator
import pandas as pd
import numpy as np

#
# mapInPandas UDF
#

def dcm_meta(pdfs: Iterator[pd.DataFrame]) -> Iterator[pd.DataFrame]:
    from pydicom.errors import InvalidDicomError
    from pydicom import dcmread
    local_path = ''
    for pdf in pdfs:
        assert 'local_path' in pdf.columns
        for i in range(pdf.shape[0]):
            local_path = pdf['local_path'][i]
            try:
              with dcmread(local_path) as ds:
                  js = ds.to_json_dict()
                  # remove binary images
                  if '60003000' in js:
                      del js['60003000']
                  if '7FE00010' in js:
                      del js['7FE00010']

                  a = ds.pixel_array
                  pdf_meta = pd.DataFrame({
                      'shape_x': [a.shape[0]],
                      'shape_y': [a.shape[1]],
                      'dtype':   [str(a.dtype)],
                      'img_min': [np.min(a)],
                      'img_max': [np.max(a)],
                      'img_avg': [np.average(a)],
                      'meta':    [str(js)],
                      'data':    [a.tobytes()],
                  })
                  yield pdf_meta
            except InvalidDicomError as err:
                return pd.DataFrame({
                        'error': str(err),
                        'path': local_path
                    })

dcm_meta_schema = "shape_x INT, shape_y INT, dtype STRING, img_min DOUBLE, img_max DOUBLE, img_avg DOUBLE, meta STRING, data BINARY"
