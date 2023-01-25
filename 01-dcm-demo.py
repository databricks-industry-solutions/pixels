# Databricks notebook source
# MAGIC %md 
# MAGIC You may find this solution accelerator at https://github.com/databricks-industry-solutions/pixels. 

# COMMAND ----------

# MAGIC %md 
# MAGIC # `databricks.pixels` Solution Accelerator
# MAGIC ## Analyze DICOM data with SQL
# MAGIC <img width="80%"  src="https://raw.githubusercontent.com/databricks-industry-solutions/pixels/dmoore247-patch-8/images/pixels-dataflow-diagram.svg"/>

# COMMAND ----------

# MAGIC %md ## About DICOM
# MAGIC DICOM® — Digital Imaging and Communications in Medicine — is the international standard for medical images and related information. It defines the formats for medical images that can be exchanged with the data and quality necessary for clinical use.
# MAGIC 
# MAGIC ![Dicom Image processing](https://dicom.offis.uni-oldenburg.de/images/dicomlogo.gif)
# MAGIC 
# MAGIC 
# MAGIC DICOM® is implemented in almost every radiology, cardiology imaging, and radiotherapy device (X-ray, CT, MRI, ultrasound, etc.), and increasingly in devices in other medical domains such as ophthalmology and dentistry. With hundreds of thousands of medical imaging devices in use, DICOM® is one of the most widely deployed healthcare messaging Standards in the world. There are literally billions of DICOM® images currently in use for clinical care.
# MAGIC 
# MAGIC Since its first publication in 1993, DICOM® has revolutionized the practice of radiology, allowing the replacement of X-ray film with a fully digital workflow. Much as the Internet has become the platform for new consumer information applications, DICOM® has enabled advanced medical imaging applications that have “changed the face of clinical medicine”. From the emergency department, to cardiac stress testing, to breast cancer detection, DICOM® is the standard that makes medical imaging work — for doctors and for patients.
# MAGIC 
# MAGIC DICOM® is recognized by the International Organization for Standardization as the ISO 12052 standard.

# COMMAND ----------

# MAGIC %md
# MAGIC ## About `databricks.pixels`
# MAGIC Relibly turn millions of image files into SQL accessible metadata, thumbnails; Enable Deep Learning
# MAGIC 
# MAGIC * Use `databricks.pixels` python package for simplicity
# MAGIC   - Catalog your images
# MAGIC   - Extract Metadata
# MAGIC   - Visualize thumbnails
# MAGIC <!-- -->
# MAGIC * Scale up Image processing over multiple-cores and multiple worker nodes
# MAGIC * Delta Lake & Delta Engine accelerate metadata analysis.
# MAGIC * Scales well maintained 'standard' python packages `python-gdcm` `pydicom`
# MAGIC <!-- -->

# COMMAND ----------

# DBTITLE 1,Initialize the environment
# MAGIC %run ./00-setup

# COMMAND ----------

# DBTITLE 1,Display widgets
dbutils.widgets.text("path", path, label="1.0 Path to directory tree containing files. /dbfs or s3:// supported")
dbutils.widgets.text("table", table, label="2.0 Catalog Schema Table to store object metadata into")
dbutils.widgets.dropdown("mode", defaultValue="overwrite",choices=["overwrite","append"], label="3.0 Update mode on object metadata table")

# COMMAND ----------

# MAGIC %md ## Catalog the objects and files
# MAGIC `databricks.pixels.Catalog` just looks at the file metadata
# MAGIC The Catalog function recursively list all files, parsing the path and filename into a dataframe. This dataframe can be saved into a file 'catalog'. This file catalog can be the basis of further annotations

# COMMAND ----------

from databricks.pixels import Catalog
from databricks.pixels.dicom import DicomMetaExtractor, DicomThumbnailExtractor # The Dicom transformers

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

# MAGIC %sql 
# MAGIC select count(1) object_count,
# MAGIC        count(DISTINCT meta:['00100010'].Value[0].Alphabetic) as patient_count 
# MAGIC from ${c.table}

# COMMAND ----------

# DBTITLE 1,File Metadata analysis
# MAGIC %sql
# MAGIC with x as (
# MAGIC   select
# MAGIC   count(1) num_dicoms,
# MAGIC   format_number(sum(length), 0) as total_size_in_bytes,
# MAGIC   format_number(sum(length) /(1024*1024*1024), 1) as total_size_in_gb,
# MAGIC   format_number(avg(length), 0) avg_size_in_bytes
# MAGIC   from ${c.table} t
# MAGIC   where extension = 'dcm'
# MAGIC )
# MAGIC select num_dicoms, total_size_in_gb, avg_size_in_bytes from x

# COMMAND ----------

# MAGIC %md ### Decode Dicom attributes
# MAGIC Using the codes in the DICOM Standard Browser (https://dicom.innolitics.com/ciods) by Innolitics

# COMMAND ----------

# DBTITLE 1,Metadata Analysis
# MAGIC %sql
# MAGIC SELECT
# MAGIC     rowid,
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
# MAGIC   rowid,
# MAGIC   meta:['00100010'].Value[0].Alphabetic as patient_name,  -- Medical information from the DICOM header
# MAGIC   meta:hash, meta:img_min, meta:img_max, path,            -- technical metadata
# MAGIC   meta                                                    -- DICOM header metadata as JSON
# MAGIC FROM ${c.table}
# MAGIC WHERE array_contains( path_tags, 'patient7747' ) -- query based on a part of the filename
# MAGIC order by patient_name

# COMMAND ----------

# MAGIC %md
# MAGIC Next: <a href="$./02-dcm-browser">DICOM Image Browser</a>
