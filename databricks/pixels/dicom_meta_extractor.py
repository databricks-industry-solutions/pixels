from numpy.core.fromnumeric import shape
from pyspark.ml.pipeline import Transformer
import pyspark.sql.types as t

from pyspark.sql.functions import col, udf, lit

from pydicom import dcmread
from pydicom.errors import InvalidDicomError

@udf
def dicom_meta_udf(path:str, deep:bool = True, anon:bool = False) -> dict:
    """
      Purpose: Extract metadata from header of dicom image file
      @param path: local path like /dbfs/mnt/... or s3://<bucket>/path/to/object.dcm
      @param deep: True if deep inspection of the Dicom header is required
      @param anon: Set to True if accessing S3 and the bucket is public
    """
    import numpy as np

    try:
        if path.startswith("s3://"):
            """Read from S3 directly"""
            import s3fs
            fs = s3fs.S3FileSystem(anon)
            fp = fs.open(path)
        else:
          """Read from local filesystem"""
          fp = open(path, 'rb')
        with dcmread(fp, defer_size=1000, stop_before_pixels=(not deep)) as ds:
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
    except Exception as err:
        except_str =  str({
            'error': str(err),
            'path': path
        })
        print(except_str)
        return except_str
        
class DicomMetaExtractor(Transformer):
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
            raise Exception('DicomMetaExtractor input type %s did not match input type StringType' % field.dataType)
        
        #TODO check string prefix for local filetype (or extended a resolvable scheme)

    def _transform(self, df):
        self.check_input_type(df.schema)
        return (df.withColumn(self.outputCol, 
                              dicom_meta_udf(
                                col(self.inputCol),
                                lit('True'),
                                lit(self.catalog.is_anon())
                              )))

    
if __name__ == '__main__':
    exit