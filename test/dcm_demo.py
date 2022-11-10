# Databricks notebook source
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
# MAGIC - Scale up Image processing over multiple-cores and nodes
# MAGIC - Delta lake & Delta Engine accelerate metadata research.
# MAGIC - Delta lake (optionally) to speed up small file processing
# MAGIC - Mix of Spark and Python scale out processing
# MAGIC - Core library `pydicom`, a well maintained 'standard' python package for processing Dicom files.
# MAGIC 
# MAGIC author: douglas.moore@databricks.com
# MAGIC 
# MAGIC tags: dicom, dcm, pre-processing, visualization, repos, python, package, image catalog, mamograms

# COMMAND ----------

# MAGIC %md ## Setup
# MAGIC Depends on:
# MAGIC - gdcm from conda-forge (use init script to install)
# MAGIC - databricks_pixels python package
# MAGIC - %conda depends on DBR 8.4ML
# MAGIC - %conda has been depricated (licensing issue), use init script

# COMMAND ----------

# MAGIC %sh cat /dbfs/databricks/init_scripts/gdcm-install.sh
# MAGIC 
# MAGIC # use cluster init script to install conda dependencies

# COMMAND ----------

# MAGIC %pip install git+https://github.com/dmoore247/pixels.git@patcher

# COMMAND ----------

from databricks.pixels import version
version.__version__

# COMMAND ----------

# MAGIC %md ## Load Dicom Images from source
# MAGIC ```
# MAGIC %sh wget ftp://dicom.offis.uni-oldenburg.de/pub/dicom/images/ddsm/benigns_01.zip
# MAGIC %sh unzip benigns_01.zip
# MAGIC %sh cp -r ./benigns /dbfs/FileStore/shared_uploads/douglas.moore@databricks.com/
# MAGIC ```

# COMMAND ----------

# MAGIC %md ## Catalog the image files

# COMMAND ----------

from databricks.pixels import Catalog, DicomFrames
df = Catalog.catalog(spark, "dbfs:/FileStore/shared_uploads/douglas.moore@databricks.com/benigns/")

# COMMAND ----------

# MAGIC %fs ls dbfs:/FileStore/shared_uploads/douglas.moore@databricks.com/benigns/patient0186/

# COMMAND ----------

df.count()

# COMMAND ----------

display(df)

# COMMAND ----------

# MAGIC %md ## Extract Metadata from the Dicom images

# COMMAND ----------

dcm_df = DicomFrames(df).withMeta()
display(dcm_df)

# COMMAND ----------

# MAGIC %md ## Save and explore the metadata

# COMMAND ----------

# DBTITLE 1,Save Metadata as a 'object metadata catalog'
dcm_df.write.format('delta').option('mergeSchema','true').mode('overwrite').saveAsTable('douglas_moore_silver.meta_catalog')

# COMMAND ----------

# MAGIC %sql
# MAGIC SELECT rowid, meta:hash, meta:['00100010'].Value[0].Alphabetic as patient_name, meta:img_min, meta:img_max, path, meta
# MAGIC FROM douglas_moore_silver.meta_catalog
# MAGIC WHERE array_contains( path_tags, 'patient7747' )
# MAGIC order by patient_name

# COMMAND ----------

# MAGIC %md ## Alternate metadata extraction using a Transformer

# COMMAND ----------

# DBTITLE 1,Use a Transformer for metadata extraction
from databricks.pixels import DicomMetaExtractor
meta = DicomMetaExtractor()
meta_df = meta.transform(df)
display(meta_df)

# COMMAND ----------

meta_df.persist().createOrReplaceTempView("meta_1")

# COMMAND ----------

# MAGIC %sql
# MAGIC SELECT meta:hash, meta:['00100010'].Value[0].Alphabetic as patient_name, meta:img_min, meta:img_max, path, meta
# MAGIC FROM meta_1

# COMMAND ----------

# MAGIC %md ## Save Image (metadata) Catalog

# COMMAND ----------

# MAGIC %sql show databases like '*douglas*'

# COMMAND ----------

meta_df.write.format("delta").mode("overwrite").saveAsTable("douglas_moore_silver.meta_catalog")

# COMMAND ----------

# MAGIC %sql describe douglas_moore_silver.meta_catalog

# COMMAND ----------

# MAGIC %md ## Analyze Metadata

# COMMAND ----------

# DBTITLE 1,Analyze Dicom metadata
# MAGIC %sql
# MAGIC SELECT meta:hash, meta:['00100010'].Value[0].Alphabetic as patient_name, meta:img_min, meta:img_max, path, meta
# MAGIC FROM douglas_moore_silver.meta_catalog
# MAGIC WHERE array_contains( path_tags, 'patient7747' )
# MAGIC order by patient_name

# COMMAND ----------

# MAGIC %md ## Filter Dicom Images

# COMMAND ----------

dcm_df_filtered = dcm_df.filter('meta:img_max < 1000').repartition(64)
dcm_df_filtered.count()

# COMMAND ----------

# MAGIC %md ## Display Dicom Images

# COMMAND ----------

plots = DicomFrames(dcm_df_filtered).plotx()
plots

# COMMAND ----------

# MAGIC %md ## TODO
# MAGIC - Transformer to scale & filter images (down sampling)
# MAGIC - Explode slices
# MAGIC - Transformer to patch images (size_x, size_y, stride_x, stride_y)
# MAGIC - Inline .data
# MAGIC - ~~Wrapper to create image catalog~~
# MAGIC - ~~Generate identity for each file~~
# MAGIC ---
# MAGIC - Add to Image catalog
# MAGIC - De-identify header information
# MAGIC - De-identify text embedded in image
# MAGIC - ~~Tech Debt: Move path tags to base class~~
# MAGIC - Figure out why some images are blank and have max value >> 255
# MAGIC - Merge with annotations
# MAGIC - Flow into canonical DL pipeline
# MAGIC - Build resolver for S3:, S3a:, SMB:, CIFS:, https, sftp:...
# MAGIC - Optimize plotx to avoid creating duplicate plotfiles
# MAGIC - Scale test plotx
# MAGIC - Write .dcm function from dataframe
# MAGIC - Option to inline .dcm file
# MAGIC - Test performance w/ .dcm inlined and not inlined
# MAGIC - Test performance w/ patch inlined and not inlined
# MAGIC - Move into databricks github
# MAGIC - Heatmap
# MAGIC - Customer supplied transformer
# MAGIC - Catalog behaviours (merge catalog, copy from/to, ...)

# COMMAND ----------

# MAGIC %md
# MAGIC ## Canonical storage format in delta
# MAGIC 1 - ImageType
# MAGIC 
# MAGIC 2 - BinaryType
# MAGIC 
# MAGIC 3 - ArrayType
# MAGIC 
# MAGIC bytearray
# MAGIC numpy
# MAGIC png
# MAGIC jpg - lossless
# MAGIC TFRecord

# COMMAND ----------

# MAGIC %md ## Appendix
