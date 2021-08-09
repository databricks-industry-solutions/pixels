from pyspark.ml.pipeline import Transformer
import pyspark.sql.types as t

from pyspark.sql.functions import col
from databricks.pixels.dicom_udfs import dicom_meta_udf

class DicomMetaExtractor(Transformer):
    # Day extractor inherit of property of Transformer 
    def __init__(self, inputCol='local_path', outputCol='meta', basePath='dbfs:/'):
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
        return self._transform_impl(df, self.inputCol, self.outputCol)

    def _transform_impl(self, df, inputCol, outputCol):
        print("calling dicom_meta_")
        return (df.withColumn(outputCol, dicom_meta_udf(col(inputCol))))


    
if __name__ == '__main__':
    exit