# Databricks notebook source
# MAGIC %md # Scale Dicom based image processing
# MAGIC - Use `databricks.pixels` python package for simplicity
# MAGIC - Scale up Image processing over multiple-cores and nodes
# MAGIC - Delta lake & Delta Engine accelerate metadata research.
# MAGIC - Delta lake (optionally) to speed up small file processing
# MAGIC - Mix of Spark and Python scale out processing
# MAGIC - Core libray `pydicom`, a well maintained 'standard' python package for processing Dicom files.
# MAGIC 
# MAGIC author: douglas moore
# MAGIC 
# MAGIC tags: dicom, dcm, pre-processing, visualization, repos, python, package, image catalog, mamograms

# COMMAND ----------

# MAGIC %md ## Setup
# MAGIC Depends on:
# MAGIC - gdcm from conda-forge (use init script to install)
# MAGIC - databricks_pixels python package
# MAGIC - %conda depends on DBR 8.4ML

# COMMAND ----------

# MAGIC %conda install -c conda-forge gdcm -y
# MAGIC # use cluster init script

# COMMAND ----------

# MAGIC %pip install git+https://github.com/dmoore247/pixels.git@patcher

# COMMAND ----------

from databricks.pixels import version
version.__version__

# COMMAND ----------

# MAGIC %md ## Load Dicom Images
# MAGIC ```
# MAGIC %sh wget ftp://dicom.offis.uni-oldenburg.de/pub/dicom/images/ddsm/benigns_01.zip
# MAGIC %sh unzip benigns_01.zip
# MAGIC %sh cp -r ./benigns /dbfs/FileStore/shared_uploads/douglas.moore@databricks.com/
# MAGIC ```

# COMMAND ----------

from databricks.pixels import Catalog, DicomFrames
df = Catalog.catalog(spark, "dbfs:/FileStore/shared_uploads/douglas.moore@databricks.com/benigns/")

# COMMAND ----------



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
