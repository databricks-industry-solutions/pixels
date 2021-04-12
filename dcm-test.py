# Databricks notebook source
# %conda install -c conda-forge gdcm -y

# COMMAND ----------

#%pip install -r requirements.txt

# COMMAND ----------

#%pip freeze

# COMMAND ----------

# MAGIC %pip install pydicom

# COMMAND ----------

import pydicom

# COMMAND ----------

from databricks.pixels import Catalog

# COMMAND ----------

df = Catalog.catalog(spark, "dbfs:/FileStore/shared_uploads/douglas.moore@databricks.com/benigns/").repartition(64)
display(df)

# COMMAND ----------

# DBTITLE 1,Add and shape path and image metadata
from databricks.pixels import DicomFrames
from pyspark.sql import functions as F
dcm_df = DicomFrames(df).withMeta().withColumn('tags',F.slice(F.col('path_tags'),7,5))
display(dcm_df)

# COMMAND ----------

plots = DicomFrames(dcm_df.repartition(64)).plotx()

# COMMAND ----------

from databricks.pixels import PlotResult
plots = PlotResult(plots._files)

# COMMAND ----------

plots

# COMMAND ----------

from databricks.pixels import PlotResult
PlotResult(plots._files)

# COMMAND ----------

dcm_df.createOrReplaceTempView("dcm")

# COMMAND ----------

dcm_df.cache()

# COMMAND ----------

# MAGIC %sql
# MAGIC SELECT path, slice(path_tags,7,5) tags, meta:['img_min'], meta:['img_max'] from dcm
# MAGIC ORDER BY meta:['img_max'] desc

# COMMAND ----------

display(dcm_df)

# COMMAND ----------

lst = dcm_df.select('local_path','path_tags').collect()

# COMMAND ----------

z = [y for y in map(lambda x: (x['local_path'],x['path_tags'][6:-1]), lst)]

# COMMAND ----------

from databricks.pixels import PlotResult
plots = PlotResult(z)

# COMMAND ----------

plots._repr_html_()

# COMMAND ----------

lst

# COMMAND ----------

lst = plots._files
#[y for y in map(lambda x: x[1], lst)]
set([item for sublist in [y for y in map(lambda x: x[1], lst)] for item in sublist])

# COMMAND ----------

base_url = ""
files = plots._files
row_src = ""
for item in files:
    file = item[0]
    tags = item[1]
    if 'FileStore' in file:
        tag_str = ' '.join(tags)
        _src = file.replace('/dbfs/FileStore','files')
        row_src = row_src + F'<div class="column {tag_str} content"><img src="{base_url}/{_src}"><p>tags: {tag_str}</p></div>\n' 
print(row_src)
