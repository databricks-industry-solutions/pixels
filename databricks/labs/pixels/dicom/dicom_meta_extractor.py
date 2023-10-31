from numpy.core.fromnumeric import shape
from pyspark.ml.pipeline import Transformer
import pyspark.sql.types as t

from pyspark.sql.functions import col, udf, lit, when

from pydicom import dcmread
from pydicom.errors import InvalidDicomError
from databricks.labs.pixels.dicom.dicom_udfs import dicom_meta_udf
        
class DicomMetaExtractor(Transformer):
    """
      Transformer class to transform paths to Dicom files to Dicom metadata in JSON format.
    """
    # Day extractor inherit of property of Transformer 
    def __init__(self, catalog, inputCol='local_path', outputCol='meta', basePath='dbfs:/'):
        self.inputCol = inputCol #the name of your columns
        self.outputCol = outputCol #the name of your output column
        self.basePath = basePath
        self.catalog = catalog
    
    def check_input_type(self, schema):
        field = schema[self.inputCol]
        #assert that field is a datetype 
        if (field.dataType != t.StringType()):
            raise Exception(f'DicomMetaExtractor field {self.inputCol}, input type {field.dataType} did not match input type StringType')
        
        field = schema["extension"] # file extension
        #assert that field is a datetype 
        if (field.dataType != t.StringType()):
            raise Exception(f'DicomMetaExtractor field {field.name}, input type {field.dataType} did not match input type StringType')

    def _transform(self, df):
      """
        Perform Dicom to metadata transformation.
        Input:
          col('extension')
          col('is_anon')
        Output:
          col(self.outputCol) # Dicom metadata header in JSON format
      """
      self.check_input_type(df.schema)
      return (df
              .withColumn('is_anon',lit(self.catalog.is_anon()))
              .withColumn(self.outputCol,
                              dicom_meta_udf(
                                col(self.inputCol),
                                lit('True'),
                                col('is_anon')
                                )
                        )
            )