from pyspark.ml.image import ImageSchema
import hashlib
from io import BytesIO
import base64
from PIL import Image


def to_image(data:bytes):
  """Converts PNG image based bytes data and converts it into OpenCV compatible Image type. This is the basis of diplaying images stored in Spark dataframes witin Databricks.
    :param bytes data - PNG image bytes
  """
  sig = hashlib.md5(data).hexdigest()

  b = BytesIO(initial_bytes=data)
  format = 'RGBA'
  r,g,b,a = Image.open(b).convert(format).split() # Convert to get matrix of pixel values
  imgx = Image.merge(format, (b, g, r, a)) # Flip color bands
  return {'image':[
            F'file-{sig}.png',
            imgx.height,
            imgx.width,
            4, # 
            ImageSchema.ocvTypes['CV_8UC4'],
            imgx.tobytes()
          ]}

from pyspark.sql.functions import udf 
dicom_meta_udf = udf(to_image)