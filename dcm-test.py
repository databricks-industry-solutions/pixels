# Databricks notebook source
# MAGIC %pip install pydicom

# COMMAND ----------

from databricks.pixels import Catalog
df = Catalog.catalog(spark, "dbfs:/FileStore/shared_uploads/douglas.moore@databricks.com/benigns/").repartition(64)
display(df)

# COMMAND ----------

import pydicom

# COMMAND ----------



# COMMAND ----------



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

from collections import Counter
lst = [item for sublist in [y for y in map(lambda x: x[1], plots._files)] for item in sublist]
c = Counter(lst).most_common(20)
c

# COMMAND ----------

css = """
* {
  box-sizing: border-box;
}

body {
  background-color: #f1f1f1;
  padding: 10px;
  font-family: Arial;
}

h1 {
  font-size: 50px;
  word-break: break-all;
}

img {
  width: 100%;
}

/* Center website */
.main {
  max-width: 1000px;
  margin: auto;
}

/* The Modal (background) */

.modal {
  display: none;
  /* Hidden by default */
  position: fixed;
  /* Stay in place */
  z-index: 1;
  /* Sit on top */
  padding-top: 50px;
  /* Location of the box */
  left: 0;
  top: 0;
  width: 100%;
  /* Full width */
  height: 100%;
  /* Full height */
  overflow: hidden;
  /* Enable scroll if needed */
  background-color: rgb(0, 0, 0);
  /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4);
  /* Black w/ opacity */
}

/* Modal Content */

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 5px;
  border: 1px solid #888;
  width: 100%;
}

img.modal-content {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 75%;
}

/* The Close Button */

.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover, .close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.row {
  margin: 5px -16px;
  overflow-y: auto;
  height: 600px;
  float: left;
  width: 85%;
}

/* Add padding BETWEEN each column */

.row, .row>.column {
  padding: 8px;
}

/* Create three equal columns that floats next to each other */

.column {
  float: left;
  width: 25.00%;
  display: none;
  /* Hide all elements by default */
}

/* Clear floats after rows */

.row:after {
  content: "";
  display: table;
  clear: both;
}

/* Content */

.content {
  background-color: rgb(37, 136, 50);
  padding: 10px;
  color: #333;
  size: 14pt;
}

.content p {
  color:bisque;
}

.content img {
  max-height: 100%;
  max-width: 100%;
}

/* The "show" class is added to the filtered elements */

.show {
  display: block;
}

/* Style the buttons */

.btn {
  border: none;
  outline: none;
  padding: 8px 10px;
  margin: 3px 3px;
  background-color: white;
  cursor: pointer;
  position:relative
}

.btn:hover {
  background-color: #ddd;
}

.btn.active {
  background-color: #666;
  color: white;
}

.btn-panel {
  padding: 5px;
  float: left;
  width: 15%;
}

.gauge {
  z-index: 3;
  background: #0000ff40;
  width:10px;
  height:50px;
  position:absolute;
  left:0;
  bottom:0;
  transform: rotate(180deg);
  margin: 0 auto
}
"""

# COMMAND ----------

help(patch_get_buttons)

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


