# Databricks notebook source
# MAGIC %md 
# MAGIC You may find this solution accelerator at https://github.com/databricks-industry-solutions/pixels. 

# COMMAND ----------

# MAGIC %md
# MAGIC 
# MAGIC # Scale Dicom based image processing
# MAGIC 
# MAGIC ---
# MAGIC 
# MAGIC ![Dicom Image processing](https://dicom.offis.uni-oldenburg.de/images/dicomlogo.gif)
# MAGIC 
# MAGIC About DICOM: Overview
# MAGIC DICOM® — Digital Imaging and Communications in Medicine — is the international standard for medical images and related information. It defines the formats for medical images that can be exchanged with the data and quality necessary for clinical use.
# MAGIC 
# MAGIC DICOM® is implemented in almost every radiology, cardiology imaging, and radiotherapy device (X-ray, CT, MRI, ultrasound, etc.), and increasingly in devices in other medical domains such as ophthalmology and dentistry. With hundreds of thousands of medical imaging devices in use, DICOM® is one of the most widely deployed healthcare messaging Standards in the world. There are literally billions of DICOM® images currently in use for clinical care.
# MAGIC 
# MAGIC Since its first publication in 1993, DICOM® has revolutionized the practice of radiology, allowing the replacement of X-ray film with a fully digital workflow. Much as the Internet has become the platform for new consumer information applications, DICOM® has enabled advanced medical imaging applications that have “changed the face of clinical medicine”. From the emergency department, to cardiac stress testing, to breast cancer detection, DICOM® is the standard that makes medical imaging work — for doctors and for patients.
# MAGIC 
# MAGIC DICOM® is recognized by the International Organization for Standardization as the ISO 12052 standard.
# MAGIC 
# MAGIC ---
# MAGIC ## About databricks.pixels
# MAGIC - Use `databricks.pixels` python package for simplicity
# MAGIC   - Catalog your images
# MAGIC   - Extract Metadata
# MAGIC   - Display thumbnails
# MAGIC <!-- -->
# MAGIC - Scale up Image processing over multiple-cores and nodes
# MAGIC - Delta lake & Delta Engine accelerate metadata research.
# MAGIC - Delta lake (optionally) to speed up small file processing
# MAGIC - Mix of Spark and Python scale out processing
# MAGIC - Core libraries `python-gdcm` `pydicom`, well maintained 'standard' python packages for processing Dicom files.
# MAGIC 
# MAGIC author: douglas.moore@databricks.com
# MAGIC 
# MAGIC tags: dicom, dcm, pre-processing, visualization, repos, python, spark, pyspark, package, image catalog, mamograms, dcm file

# COMMAND ----------

# MAGIC %reload_ext autoreload
# MAGIC %autoreload 2

# COMMAND ----------

# DBTITLE 1,This token is no longer needed once this repo becomes public - when that happens please adjust the block below
token = dbutils.secrets.get("solution-accelerator-cicd", "github-pat")

# COMMAND ----------

# DBTITLE 1,Install requirements
# MAGIC %pip install git+https://token:$token@github.com/databricks-industry-solutions/pixels.git

# COMMAND ----------

# DBTITLE 1,Collect input parameters
dbutils.widgets.text("path", "s3://hls-eng-data-public/dicom/ddsm/", label="1.0 Path to directory tree containing files. /dbfs or s3:// supported")
dbutils.widgets.text("table", "hive_metastore.pixels_solacc.object_catalog", label="2.0 Catalog Schema Table to store object metadata into")
dbutils.widgets.dropdown("mode",defaultValue="overwrite",choices=["overwrite","append"], label="3.0 Update mode on object metadata table")

path = dbutils.widgets.get("path")
table = dbutils.widgets.get("table")
write_mode = dbutils.widgets.get("mode")

spark.conf.set('c.table',table)
print(F"{path}, {table}, {write_mode}")

# COMMAND ----------

# MAGIC %md ## Catalog the objects and files
# MAGIC `databricks.pixels.Catalog` just looks at the file metadata
# MAGIC The Catalog function recursively list all files, parsing the path and filename into a dataframe. This dataframe can be saved into a file 'catalog'. This file catalog can be the basis of further annotations

# COMMAND ----------

from databricks.pixels import Catalog, DicomFrames
catalog = Catalog(spark, path=path, table=table)
catalog_df = catalog.catalog()
display(catalog_df)

# COMMAND ----------

# MAGIC %md ## Save and explore the metadata

# COMMAND ----------

# DBTITLE 1,Save Metadata as a 'object metadata catalog'
catalog.save(catalog_df, mode=write_mode)

# COMMAND ----------

# MAGIC %sql select count(*) from ${c.table}

# COMMAND ----------

# MAGIC %md ## Load Catalog from Delta Lake

# COMMAND ----------

from databricks.pixels import Catalog
catalog_df = catalog.load()
display(catalog_df)

# COMMAND ----------

catalog_df.count()

# COMMAND ----------

# MAGIC %md ## Extract Metadata from the Dicom images
# MAGIC Using the Catalog dataframe, we can now open each Dicom file and extract the metadata from the Dicom file header. This operation runs in parallel, speeding up processing. The resulting `dcm_df` does not in-line the entire Dicom file. Dicom files tend to be larger so we process Dicom files only by reference.
# MAGIC 
# MAGIC Under the covers we use PyDicom and gdcm to parse the Dicom files
# MAGIC 
# MAGIC The Dicom metadata is extracted into a JSON string formatted column named `meta`

# COMMAND ----------

from databricks.pixels import DicomMetaExtractor # The transformer
meta_df = DicomMetaExtractor(catalog).transform(catalog_df)

# COMMAND ----------

display(meta_df)

# COMMAND ----------

# DBTITLE 1,Save the updated metadata frame
catalog.save(meta_df, table=table, mode=write_mode)
display(spark.table(table))

# COMMAND ----------

# MAGIC %md # Analyze Metadata

# COMMAND ----------

# MAGIC %sql
# MAGIC select count(1) from ${c.table}

# COMMAND ----------

# MAGIC %sql
# MAGIC SELECT meta:['00100010'].Value[0].Alphabetic as patient_name, meta:hash, meta:img_min, meta:img_max, path, meta
# MAGIC FROM ${c.table}

# COMMAND ----------

# DBTITLE 1,Query the object metadata table using the JSON notation
# MAGIC %sql
# MAGIC SELECT rowid, meta:hash, meta:['00100010'].Value[0].Alphabetic as patient_name, meta:img_min, meta:img_max, path, meta
# MAGIC FROM ${c.table}
# MAGIC WHERE array_contains( path_tags, 'patient7747' )
# MAGIC order by patient_name

# COMMAND ----------

# MAGIC %md ## Load and Filter Dicom Images

# COMMAND ----------

from databricks.pixels import Catalog
catalog = Catalog(spark, path=path, table=table)
dcm_df_filtered = catalog.load().filter('meta:img_max < 1000').repartition(1000)
dcm_df_filtered.count()

# COMMAND ----------

display(dcm_df_filtered.limit(5))

# COMMAND ----------

# MAGIC %md # Display Dicom Images

# COMMAND ----------

from databricks.pixels import DicomThumbnailExtractor
DicomThumbnailExtractor().transform(dcm_df_filtered).display()

# COMMAND ----------

# MAGIC %md
# MAGIC Done
