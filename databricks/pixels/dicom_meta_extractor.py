from numpy.core.fromnumeric import shape
from pyspark.ml.pipeline import Transformer
import pyspark.sql.types as t

from pyspark.sql.functions import col, udf

@udf
def dicom_meta_udf(local_path:str, deep:bool = True) -> dict:
    """Extract metadata from header of dicom image file"""
    from pydicom import dcmread
    from pydicom.errors import InvalidDicomError
    import numpy as np
    try:
        with dcmread(local_path) as ds:
            js = ds.to_json_dict()
            # remove binary images
            if '60003000' in js:
                del js['60003000']
            if '7FE00010' in js:
                del js['7FE00010']

            if deep:
                a = ds.pixel_array
                a.flags.writeable = False
                js['hash'] = hash(a.data.tobytes())
                js['img_min'] = np.min(a)
                js['img_max'] = np.max(a)
                js['img_avg'] = np.average(a)
                js['img_shape_x'] = a.shape[0]
                js['img_shape_y'] = a.shape[1]
            
            return str(js)
    except InvalidDicomError as err:
        return str({
            'error': str(err),
            'local_path': local_path
        })


class DicomMetaExtractor(Transformer):
    # Day extractor inherit of property of Transformer 
    def __init__(self, inputCol='local_path', outputCol='meta', basePath='dbfs:/'):
        self.inputCol = inputCol #the name of your columns
        self.outputCol = outputCol #the name of your output column
        self.basePath = basePath
    
    def check_input_type(self, schema):
        field = schema[self.inputCol]
        #assert that field is a datetype 
        if (field.dataType != t.StringType()):
            raise Exception('DicomMetaExtractor input type %s did not match input type StringType' % field.dataType)
        
        #TODO check string prefix for local filetype (or extended a resolvable scheme)

    def _transform(self, df):
        self.check_input_type(df.schema)
        return (df.withColumn(self.outputCol, dicom_meta_udf(col(self.inputCol))))

    
if __name__ == '__main__':
    exit