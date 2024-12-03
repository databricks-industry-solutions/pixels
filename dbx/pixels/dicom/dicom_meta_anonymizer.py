import pyspark.sql.types as t
from pyspark.ml.pipeline import Transformer
from pyspark.sql.functions import col, lit, udf

from dbx.pixels.dicom.dicom_udfs import anonymize_dicom_file


class DicomMetaAnonymizer(Transformer):
    """
    Transformer class to anonymize metadata of DICOM files.
    """

    def __init__(self, destPath:str, inputCol="local_path", outputCol="local_path",  key:str="<KEY>", tweak:str="CBD09280979564"):
        self.inputCol = inputCol
        self.outputCol = outputCol
        self.destPath = destPath
        self.key = key
        self.tweak = tweak


    def check_input_type(self, schema):
        field = schema[self.inputCol]
        
        if field.dataType != t.StringType():
            raise Exception(
                f"DicomMetaAnonymizer field {self.inputCol}, input type {field.dataType} did not match input type StringType"
            )

    def _transform(self, df):
        self.check_input_type(df.schema)
        return df.withColumn(self.outputCol, anonymize_dicom_file(col(self.inputCol), lit(self.destPath), lit(self.key), lit(self.tweak)))
