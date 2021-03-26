from pyspark.ml.pipeline import Transformer
import pyspark.sql.functions as f
import pyspark.sql.types as t

from pyspark.sql.functions import udf, col
@("dict")
def dicom_meta_(path:str):
    with dcmread(path) as ds:
        js = ds.to_json_dict()
        # remove binary images
        del js['60003000']
        del js['7FE00010']
        return js

class DicomMetaExtractor(Transformer):
    # Day extractor inherit of property of Transformer 
    def __init__(self, inputCol='path', outputCol='meta', basePath='dbfs:/'):
        self.inputCol = inputCol #the name of your columns
        self.outputCol = outputCol #the name of your output column
        self.basePath = basePath
    def this():
        #define an unique ID
        this(Identifiable.randomUID("DicomMetaExtractor"))
    def copy(extra):
        defaultCopy(extra)
    def check_input_type(self, schema):
        field = schema[self.inputCol]
        #assert that field is a datetype 
        if (field.dataType != t.StringType()):
            raise Exception('DicomMetaExtractor input type %s did not match input type StringType' % field.dataType)
    def _transform(self, df):
        self.check_input_type(df.schema)
        return _transform_impl(df, self.inputCol, self.outputCol)

    def _transform_impl(df, inputCol, outputCol):
         return (df.withColumn(outputCol,self.dicom_meta_(col(inputCol))))


