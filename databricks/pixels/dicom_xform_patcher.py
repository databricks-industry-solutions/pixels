from pyspark.ml.pipeline import Transformer
import pyspark.sql.types as t

from pyspark.ml.util import *
from databricks.pixels.dicom_udfs import dicom_patcher, dicom_patcher_schema

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
        print("calling map")
        return df.mapInPandas(dicom_patcher, schema=dicom_patcher_schema)
