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
from databricks.pixels import DicomPatcher
from pyspark.ml import Pipeline

patcher = DicomPatcher()

o_df = get_object_frame(spark)
dicom_df = DicomFrames(o_df)

fit_df = patcher.transform(dicom_df)
fit_df.count()

# COMMAND ----------

dicom_df.count()

# COMMAND ----------

fit_df.count()

# COMMAND ----------

dicom_patcher_schema = StructType([
    StructField('local_path',StringType(),False),
    StructField('offset_x',IntegerType(),False),
    StructField('offset_y',IntegerType(),False),
    StructField('i',IntegerType(),False),
    StructField('patch',BinaryType(),False)
])
#
# mapInPandas UDF
#
def dicom_patcher(meta: Iterator[pd.DataFrame]) -> Iterator[pd.DataFrame]:
    def patcher_input(pdf):
        print(F'pdf.shape {pdf.shape}')
        for i in range(pdf.shape[0]):
            (
              print(F'{i} {local_path}'')
              yield
                  pdf['local_path'][i],
                  pdf['width'][i],
                  pdf['height'][i],
                  pdf['size_x'][i],
                  pdf['size_y'][i],
                  pdf['stride_x'][i],
                  pdf['stride_y'][i],
                  i
            )
    print("dicom_patcher call")
    j = 0
    for pdf in meta:
      print(meta)
      for local_path, width, height, x_size, y_size, x_stride, y_stride, i in patcher_input(pdf):
        pdx = pd.DataFrame(columns=['local_path','offset_x','offset_y','i','patch'])
        for offset_x in range(0, width, x_stride):
          for offset_y in range(0,height, y_stride):
            patch = b"bytes"
            print('append')
            pdx.append({
              'local_path':  'blbblblblb', 
              'offset_x':  123, 
              'offset_y':  456, 
              'i':         5,
              'patch':     b'bpatch'},
              ignore_index=True, verify_integrity=True)
        yield pdx


# COMMAND ----------

from databricks.pixels import DicomFrames    
from databricks.pixels import DicomPatcher
from databricks.pixels import DicomMetaExtractor
from pyspark.ml import Pipeline

meta = DicomMetaExtractor()
patcher = DicomPatcher()
pipeline = Pipeline(stages=[meta])

o_df = get_object_frame(spark)
dicom_df = DicomFrames(o_df)

model = pipeline.fit(dicom_df)
fit_df = model.transform(dicom_df)
display(fit_df)

# COMMAND ----------


