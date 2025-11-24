# Databricks notebook source
# MAGIC %run ../config/setup

# COMMAND ----------

# MAGIC %pip install -r ./vista3d/requirements.txt
# MAGIC %pip install ./artifacts/monailabel-0.8.5-py3-none-any.whl --no-deps
# MAGIC %pip install monai==1.4.0 pytorch-ignite --no-deps
# MAGIC %pip install databricks-sdk==0.56 --upgrade

# COMMAND ----------

dbutils.library.restartPython()

# COMMAND ----------

dbutils.widgets.text("table", "main.pixels_solacc.object_catalog")
dbutils.widgets.text("volume", "main.pixels_solacc.pixels_volume")

# COMMAND ----------

table = dbutils.widgets.get("table")
volume = "/Volumes/" + dbutils.widgets.get("volume").replace(".","/")

token = dbutils.notebook.entry_point.getDbutils().notebook().getContext().apiToken().get()
host = dbutils.notebook.entry_point.getDbutils().notebook().getContext().apiUrl().get()

# COMMAND ----------

from common.utils import download_dcmqi_tools

# Download the dcmqi tool binary used for the conversion of nifti files to DICOM SEG files
download_dcmqi_tools("./bin")

# COMMAND ----------

import torch
from dbx.pixels.modelserving.vista3d.gpu import Vista3DGPUTransformer

gpuCount = int(spark.conf.get("spark.executor.resource.gpu.amount","0") or torch.cuda.device_count())
nWorkers = (int(spark.conf.get("spark.databricks.clusterUsageTags.clusterWorkers")) or 1)
tasksPerGpu = int(spark.conf.get("spark.task.resource.gpu.amount","1"))

print(f"gpuCount: {gpuCount}, nWorkers: {nWorkers}, tasksPerGpu: {tasksPerGpu}")
print(f"Parallelization factor: {int(gpuCount * nWorkers // tasksPerGpu)}")

df = spark.readStream.table(table)

df_monai = Vista3DGPUTransformer(inputCol="meta", 
                                 table=table, 
                                 destDir=volume+"/monailabel/vista3d/", 
                                 sqlWarehouseId="8baced1ff014912d", 
                                 labelPrompt=None, exportMetrics=True, exportOverlays=False, 
                                 secret=token, 
                                 host=host, 
                                 gpuCount=gpuCount, nWorkers=nWorkers, tasksPerGpu=tasksPerGpu).transform(df)

#display(df_monai)

# Test performance using noop
#df_monai.write.format("noop").mode("overwrite").save()

# COMMAND ----------

df_monai.writeStream \
    .option("checkpointLocation", f"{volume}/checkpoints/monailabel_autoseg_result/{table}") \
    .trigger(availableNow=True) \
    .outputMode("append") \
    .toTable(table+"_autoseg_result") \
    .awaitTermination()
