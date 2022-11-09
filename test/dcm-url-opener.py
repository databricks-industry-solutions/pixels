# Databricks notebook source
# MAGIC %pip install s3fs==2022.10.0 pydicom==2.3.0 python-gdcm==3.0.19

# COMMAND ----------

path = "/dbfs/mnt/databricks-datasets-private/HLS/dicom/images/ddsm/normals/patient9686/9686.LEFT_MLO.dcm"

# COMMAND ----------

# MAGIC %md ## Read Dicom

# COMMAND ----------

from pydicom import dcmread
import numpy as np

import s3fs
fs = s3fs.S3FileSystem()

def dicom_read(path, deep=True, defer_size=1000, stop_before_pixels=False):
  if path.startswith("s3://"):
    """Read from S3 directly"""
    fs = s3fs.S3FileSystem()
    fp = fs.open(path)
  else:
    """Read from local filesystem"""
    fp = open(path, 'rb')
  with dcmread(fp, defer_size=defer_size, stop_before_pixels=stop_before_pixels) as ds:
    js = ds.to_json_dict()
    # remove binary images
    # print('60003000' in js, '7FE00010' in js)
    if '60003000' in js:
        del js['60003000']
    if '7FE00010' in js:
        del js['7FE00010']

    # This may be time consuming
    if deep and not stop_before_pixels:
        a = ds.pixel_array
        a.flags.writeable = False
        js['hash'] = hash(a.data.tobytes())
        js['img_min'] = np.min(a)
        js['img_max'] = np.max(a)
        js['img_avg'] = np.average(a)
    return js
dicom_read(path, deep=False, defer_size=1000,stop_before_pixels=False)
dicom_read(path, deep=True, defer_size=1000)

# COMMAND ----------

import itertools

def params():
  """List of list of parameters"""
  somelists = [
     [True, False],          #deep loading of image or just metadata
     [10, 100, 1000, 10000], #defer_size how much to read eagerly vs. deferring
     [True, False],          #stop_before_pixels
                             #diverse sample paths
     ['s3://databricks-datasets-private/HLS/dicom/images/ddsm/normals/patient9686/9686.LEFT_MLO.dcm', 
      '/dbfs/mnt/databricks-datasets-private/HLS/dicom/images/ddsm/normals/patient9686/9686.LEFT_MLO.dcm']
  ]
  for element in itertools.product(*somelists):
      yield element

[p for p in params()]

# COMMAND ----------

# DBTITLE 1,Run performance test over all options
import mlflow
import timeit

def run_all_tests():
  for i, x in enumerate(params()):
    with mlflow.start_run():
      deep, defer_size, stop_before_pixels, path = x[0], x[1], x[2], x[3]
      mlflow.log_params({
        'instance':i,
        'isDeep':deep,
        'scheme':path[0:5],
        'defer_size':defer_size,
        'stop_before_pixels':stop_before_pixels,
        'path':path
      })

      t = 0
      ex = None
      try: # failure is always an option, catch and log exceptions
        t = timeit.timeit(
          lambda: mlflow.log_metric("num_keys",
            len(
              dicom_read(path, deep=deep, defer_size=defer_size,stop_before_pixels=stop_before_pixels).keys()
            )), 
          number=5)
      except Exception as e:
        ex = e
        print(e)
      mlflow.log_param('exception', ex)
      mlflow.log_metric('has_exception',(None != ex))
      mlflow.log_metric('time',t)

# COMMAND ----------

run_all_tests()

# COMMAND ----------


