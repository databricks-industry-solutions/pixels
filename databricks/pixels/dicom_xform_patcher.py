from pyspark.ml.pipeline import Transformer
import pyspark.sql.functions as f
import pyspark.sql.types as t

from pyspark.sql.functions import udf, col
from typing import Iterator
import pandas as pd
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, BinaryType

class DicomPatcher(Transformer):
    # Day extractor inherit of property of Transformer 
    def __init__(self, 
        size_x:int = 512, size_y:int = 512, stride_x:int = 512, stride_y:int = 512,
        inputCol:str = 'path', outputCol:str = 'patch', basePath:str = 'dbfs:/'):
        self._inputCol = inputCol #the name of your columns
        self._outputCol = outputCol #the name of your output column
        self._basePath = basePath
        self._size_x = size_x
        self._size_y = size_y
        self._stride_x = stride_x
        self._stride_y = stride_y

    def this():
        #define an unique ID
        this(Identifiable.randomUID("DicomPatcher"))

    def copy(extra):
        defaultCopy(extra)

    def check_input_type(self, schema):
        field = schema[self._inputCol]
        #assert that field is a datetype 
        if (field.dataType != t.StringType()):
            raise Exception('DicomPatcher input type %s did not match input type StringType' % field.dataType)

    def _transform(self, df):
        self.check_input_type(df.schema)
        return DicomPatcher._transform_impl(df, self._inputCol, self._outputCol)

    def _transform_impl(df, inputCol, outputCol):
         return df.mapInPandas(dicom_patcher, dicom_patcher_schema)

#
# mapInPandas UDF
#
def dicom_patcher(meta: Iterator[pd.DataFrame]) -> Iterator[pd.DataFrame]:
    j = 0
    for pdf in meta:
      for local_path, width, height, x_size, y_size, x_stride, y_stride, i in patcher_input(pdf):
          for offset_x in range(0, width, x_stride):
              for offset_y in range(0,height, y_stride):
                  patch = b"bytes"
                  yield local_path, offset_x, offset_y, i, patch

dicom_patcher_schema = StructType([
    StructField('local_path',StringType(),False),
    StructField('offset_x',IntegerType(),False),
    StructField('offset_y',IntegerType(),False),
    StructField('i',IntegerType(),False),
    StructField('patch',BinaryType(),False)
])

def patcher_input(pdf):
    for i in range(pdf.shape[0]):
        (
            yield
                pdf['local_path'][i],
                pdf['width'][i],
                pdf['height'][i],
                pdf['x_size'][i],
                pdf['x_size'][i],
                pdf['x_stride'][i],
                pdf['y_stride'][i]
        )


if "__main__" == __name__:
    0
