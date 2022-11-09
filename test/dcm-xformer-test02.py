# Databricks notebook source
# MAGIC %pip install git+https://github.com/dmoore247/pixels.git@patcher

# COMMAND ----------

path = 'dbfs:/FileStore/shared_uploads/douglas.moore@databricks.com/benigns'

def get_object_frame(spark):
    from databricks.pixels import Catalog
    df = Catalog.catalog(spark, path)
    return df

# COMMAND ----------

from databricks.pixels import DicomFrames
o_df = get_object_frame(spark)
dicom_df = DicomFrames(o_df.limit(4))

# COMMAND ----------

meta_df = DicomFrames(o_df.limit(4)).withMeta()
display(meta_df)

# COMMAND ----------

from databricks.pixels import DicomMetaExtractor
meta = DicomMetaExtractor()
meta_df = meta.transform(dicom_df).persist()
display(meta_df)

# COMMAND ----------

meta_df.createOrReplaceTempView('meta_df')

# COMMAND ----------

# MAGIC %sql
# MAGIC SELECT rowid, meta:hash, meta:['00100010'].Value[0].Alphabetic as patient_name, meta:img_min, meta:img_max, meta:img_shape_x, meta:img_shape_y, path, meta
# MAGIC FROM meta_df

# COMMAND ----------

# MAGIC %md # test patcher

# COMMAND ----------

from databricks.pixels import DicomFrames
from databricks.pixels import DicomPatcher
from pyspark.ml import Pipeline

patcher = DicomPatcher()

o_df = get_object_frame(spark)
dicom_df = DicomFrames(o_df.limit(4))

fit_df = patcher.transform(dicom_df)
fit_df.count()

# COMMAND ----------

from databricks.pixels import DicomFrames    
from databricks.pixels import DicomPatcher
from databricks.pixels import DicomMetaExtractor
from pyspark.ml import Pipeline



o_df = get_object_frame(spark)
dicom_df = DicomFrames(o_df.limit(10))
dicom_df.persist()

# COMMAND ----------

# DBTITLE 1,Pandas UDF code under test
from typing import Iterator
import pandas as pd
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, BinaryType

dicom_patcher_schema_2 = StructType([
    StructField('local_path',StringType(),False),
    StructField('offset_x',IntegerType(),False),
    StructField('offset_y',IntegerType(),False),
    StructField('i',IntegerType(),False),
    StructField('patch',BinaryType(),False)
])
#
# mapInPandas UDF
#
def dicom_patcher2(pdf_iter: Iterator[pd.DataFrame]) -> Iterator[pd.DataFrame]:
    print(F"dicom_patcher2 {type(pdf_iter)}")
    import time
    import json
    print(F"{time.localtime()}")
    i = 0
    for _pdf in pdf_iter:
      print(F"_pdf {_pdf.columns} {_pdf}")
      
      width = 1000
      x_stride=32
      height = 180
      y_stride=32
      local_path = _pdf['local_path']
      meta = json.loads(_pdf['meta'][0])
      print(meta)

      for offset_x in range(0, width, x_stride):
        print(F"{offset_x}")
        for offset_y in range(0,height, y_stride):
          print(F"{offset_y}")
          patch = b"bytes"
          _pdf = pd.DataFrame({
            'local_path':local_path, 
            'offset_x':  offset_x, 
            'offset_y':  offset_y, 
            'i':         i,
            'patch':     b'bpatch'+bytearray(' '+str(offset_x)+' '+str(offset_y),'utf8')})
          i += 1
          yield _pdf

# COMMAND ----------

# DBTITLE 1,Unit Test mapInPandas udf
pdf = meta_df.toPandas()
for x in dicom_patcher2(iter([pdf])):
  print(F"x {x.to_string()}")

# COMMAND ----------

meta = DicomMetaExtractor()
patcher = DicomPatcher(patcher=dicom_patcher2, patcher_schema=dicom_patcher_schema_2)
pipeline = Pipeline(stages=[meta, patcher])
model = pipeline.fit(dicom_df)
fit_df = model.transform(dicom_df)
display(fit_df)

# COMMAND ----------

pdf = dicom_df.toDF().toPandas()

# COMMAND ----------

# MAGIC %sql show tables in douglas_moore_silver

# COMMAND ----------

# MAGIC %sql describe douglas_moore_silver.employee_image_ranking_delta

# COMMAND ----------

# MAGIC %sql drop table douglas_moore_silver.employee_image_ranking_delta

# COMMAND ----------


