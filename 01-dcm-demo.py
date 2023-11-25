# Databricks notebook source
# MAGIC %md 
# MAGIC You may find this solution accelerator at https://github.com/databricks-industry-solutions/pixels. 

# COMMAND ----------

# MAGIC %md # Analytics on DICOM images should be simple
# MAGIC
# MAGIC - Catalog all of your files in parallel and scale with Spark
# MAGIC - Spark SQL on top of Delta Lake powers fast metadata analytics
# MAGIC - Python based Transformers / pandas udfs form building blocks for:
# MAGIC   - Metadata & Thumbnail extraction
# MAGIC   - Uses proven `gdcm`, `python-gdcm` & `pydicom` python packages & C++ libraries
# MAGIC   - Simple composing and extension into De-Identification and Deep Learing
# MAGIC <!-- -->
# MAGIC
# MAGIC The `dbx.pixels` solution accelerator turns DICOM images into SQL data

# COMMAND ----------

# DBTITLE 1,Initialize the environment
# MAGIC %run ./config/setup

# COMMAND ----------

# DBTITLE 1,Display widgets
path,table,write_mode = init_widgets()

# COMMAND ----------

# MAGIC %md ## Catalog the objects and files
# MAGIC `dbx.pixels.Catalog` just looks at the file metadata
# MAGIC The Catalog function recursively list all files, parsing the path and filename into a dataframe. This dataframe can be saved into a file 'catalog'. This file catalog can be the basis of further annotations

# COMMAND ----------

from dbx.pixels import Catalog
from dbx.pixels.dicom import DicomMetaExtractor, DicomThumbnailExtractor # The Dicom transformers

# COMMAND ----------

# DBTITLE 1,Catalog files in <path>
catalog = Catalog(spark, table=table)
catalog_df = catalog.catalog(path=path)

# COMMAND ----------

# MAGIC %md ## Extract Metadata from the Dicom images
# MAGIC Using the Catalog dataframe, we can now open each Dicom file and extract the metadata from the Dicom file header. This operation runs in parallel, speeding up processing. The resulting `dcm_df` does not in-line the entire Dicom file. Dicom files tend to be larger so we process Dicom files only by reference.
# MAGIC
# MAGIC Under the covers we use PyDicom and gdcm to parse the Dicom files
# MAGIC
# MAGIC The Dicom metadata is extracted into a JSON string formatted column named `meta`

# COMMAND ----------

meta_df = DicomMetaExtractor(catalog).transform(catalog_df)

# COMMAND ----------

# MAGIC %md ## Extract Thumbnails from the Dicom images
# MAGIC The `DicomThumbnailExtractor` transformer reads the Dicom pixel data and plots it and store the thumbnail inline (about 45kb) with the metadata

# COMMAND ----------

thumbnail_df = DicomThumbnailExtractor().transform(meta_df)

# COMMAND ----------

# MAGIC %md ## Save the metadata and thumbnail

# COMMAND ----------

catalog.save(thumbnail_df, mode=write_mode)

# COMMAND ----------

# MAGIC %sql describe ${c.table}

# COMMAND ----------

# MAGIC %md # Analyze DICOM Metadata with SQL

# COMMAND ----------

# MAGIC %sql select * from ${c.table}

# COMMAND ----------

# DBTITLE 1,File Metadata analysis
# MAGIC %sql
# MAGIC with x as (
# MAGIC   select
# MAGIC   format_number(count(DISTINCT meta:['00100010'].Value[0].Alphabetic),0) as patient_count,
# MAGIC   format_number(count(1),0) num_dicoms,
# MAGIC   format_number(sum(length) /(1024*1024*1024), 1) as total_size_in_gb,
# MAGIC   format_number(avg(length), 0) avg_size_in_bytes
# MAGIC   from ${c.table} t
# MAGIC   where extension = 'dcm'
# MAGIC )
# MAGIC select patient_count, num_dicoms, total_size_in_gb, avg_size_in_bytes from x

# COMMAND ----------

# MAGIC %md ### Decode Dicom attributes
# MAGIC Using the codes in the DICOM Standard Browser (https://dicom.innolitics.com/ciods) by Innolitics

# COMMAND ----------

# DBTITLE 1,Patient / Radiology Data Analysis
# MAGIC %sql
# MAGIC SELECT
# MAGIC     --rowid,
# MAGIC     meta:['00100010'].Value[0].Alphabetic patient_name, 
# MAGIC     meta:['00082218'].Value[0]['00080104'].Value[0] `Anatomic Region Sequence Attribute decoded`,
# MAGIC     meta:['0008103E'].Value[0] `Series Description Attribute`,
# MAGIC     meta:['00081030'].Value[0] `Study Description Attribute`,
# MAGIC     meta:`00540220`.Value[0].`00080104`.Value[0] `projection`, -- backticks work for numeric keys
# MAGIC     split(meta:`00081030`.`Value`[0],'_')[0] `Label`,
# MAGIC     split(meta:`00081030`.`Value`[0],'_')[1] `Instance`
# MAGIC FROM ${c.table}

# COMMAND ----------

# DBTITLE 1,Query the object metadata table using the JSON notation
# MAGIC %sql
# MAGIC SELECT 
# MAGIC   --rowid,
# MAGIC   meta:['00100010'].Value[0].Alphabetic as patient_name,  -- Medical information from the DICOM header
# MAGIC   meta:hash, meta:img_min, meta:img_max, path,            -- technical metadata
# MAGIC   meta                                                    -- DICOM header metadata as JSON
# MAGIC FROM ${c.table}
# MAGIC WHERE array_contains( path_tags, 'patient7747' ) -- query based on a part of the filename
# MAGIC order by patient_name

# COMMAND ----------

# MAGIC %md
# MAGIC Next: <a href="$./02-dcm-browser">DICOM Image Browser</a>
