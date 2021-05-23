# Databricks notebook source
# MAGIC %pip install pydicom Pillow

# COMMAND ----------

from databricks.pixels import Catalog
df = Catalog.catalog(spark, "dbfs:/FileStore/shared_uploads/douglas.moore@databricks.com/benigns/").repartition(64)
display(df)

# COMMAND ----------

# DBTITLE 1,Add and shape path and image metadata
from databricks.pixels import DicomFrames
from pyspark.sql import functions as F
dcm_df = DicomFrames(df).withMeta()
#.withColumn('tags',F.slice(F.col('path_tags'),7,5))
display(dcm_df)

# COMMAND ----------

plots = DicomFrames(dcm_df.repartition(64)).plotx()

# COMMAND ----------

plots

# COMMAND ----------

plots._files

# COMMAND ----------

def patch_get_buttons(self) -> str:
    """ 
    Turns path_tags into facets into buttons
        input: self._files
        returns: button html source code
    """
    n_files = len(self._files)
    # look for files and path tags
    if  (n_files <= 0 or len(self._files[0]) <= 1):
        return ''

    from collections import Counter
    lst = [item for sublist in [y for y in map(lambda x: x[1], self._files)] for item in sublist]
    c = Counter(lst).most_common(20)

    start = c[0][1]
    print("start {}, l_size {}".format(start, n_files))
    button_src = ''
    for i,v in enumerate(c):
        b = v[0]
        l = 100.0*(v[1]/n_files) # frequency
        button_src = button_src + \
F'''<div class="btn"><div class="gauge" style="height:{l}%;"></div><button onclick="filterSelection('{b}')">{b}</button></div>'''
    return button_src

PlotResult._get_buttons = patch_get_buttons
plots._plot_css = css
plots

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

display(lst)

# COMMAND ----------

z = [y for y in map(lambda x: (x['local_path'],x['path_tags'][6:-1]), lst)]

# COMMAND ----------

z

# COMMAND ----------

from databricks.pixels import PlotResult
plots = PlotResult(z)

# COMMAND ----------

r = plots._files[0][1]
len(r)

# COMMAND ----------


lst = [item for sublist in [y for y in map(lambda x: x[1], plots._files)] for item in sublist]
len(lst)

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

# COMMAND ----------

# MAGIC %fs ls dbfs:/databricks-datasets/med-images/camelyon16/

# COMMAND ----------

# MAGIC %md ## Test N

# COMMAND ----------

# MAGIC %pip install pydicom

# COMMAND ----------

from databricks.pixels import Catalog
path = "dbfs:/FileStore/shared_uploads/douglas.moore@databricks.com/benigns/"
df = Catalog.catalog(spark, path)
display(df)

# COMMAND ----------

type(df)

# COMMAND ----------

from pyspark.sql.dataframe import DataFrame

def save(df:DataFrame, path="dbfs:/object_catalog/objects", database="objects_catalog", table="objects", mode="append", mergeSchema = "true"):
    return (
        df.write
            .format("delta")
            .mode(mode)
            .option("path",path)
            .option("mergeSchema", mergeSchema)
            .saveAsTable(f"{database}.{table}")
    )

# COMMAND ----------

save(df, database="default", mode="overwrite")

# COMMAND ----------

# MAGIC %sql select * from default.objects

# COMMAND ----------

from databricks.pixels import DicomFrames
from pyspark.sql import functions as F
dcm_df = DicomFrames(df).withMeta()
display(dcm_df)

# COMMAND ----------

save(dcm_df, database="default", mode="append")

# COMMAND ----------

# MAGIC %sql select * from default.objects

# COMMAND ----------

Add Identity column

# COMMAND ----------

# dfZipWithIndex helper function
from pyspark.sql.types import LongType, StructField, StructType

def dfZipWithIndex (df, offset=1, colName="rowId"):
    '''
        Ref: https://stackoverflow.com/questions/30304810/dataframe-ified-zipwithindex
        Enumerates dataframe rows is native order, like rdd.ZipWithIndex(), but on a dataframe 
        and preserves a schema

        :param df: source dataframe
        :param offset: adjustment to zipWithIndex()'s index
        :param colName: name of the index column
    '''

    new_schema = StructType(
                    [StructField(colName,LongType(),True)]        # new added field in front
                    + df.schema.fields                            # previous schema
                )

    zipped_rdd = df.rdd.zipWithIndex()

    new_rdd = zipped_rdd.map(lambda row: ([row[1] +offset] + list(row[0])))

    return spark.createDataFrame(new_rdd, new_schema)

# COMMAND ----------

dfx = dfZipWithIndex(df)

# COMMAND ----------

display(dfx)

# COMMAND ----------

from pyspark.sql.functions import col, max
max = dfx.agg(max(col('rowId'))).collect()[0][0]
max

# COMMAND ----------

from pyspark.sql.session import SparkSession
s = SparkSession.builder.appName("pixels").getOrCreate()

# COMMAND ----------

s.conf.get("spark.app.id"), spark.conf.get("spark.app.id")

# COMMAND ----------


