# Databricks notebook source
# MAGIC %md # Scale Dicom based image processing
# MAGIC - Use `databricks.pixels` python package for simplicity
# MAGIC - Scale up Image processing over multiple-cores and nodes
# MAGIC - Delta lake & Delta Engine accelerate metadata research.
# MAGIC - Delta lake (optionally) to speed up small file processing
# MAGIC - Mix of Spark and Python processing
# MAGIC - Uses `pydicom` python package as core library
# MAGIC 
# MAGIC author: douglas moore
# MAGIC 
# MAGIC tags: dicom, dcm, pre-processing, visualization, repos, python, package, image catalog, mamograms

# COMMAND ----------

# MAGIC %md ## Setup
# MAGIC Depends on:
# MAGIC - gdcm from conda-forge (use init script to install)
# MAGIC - databricks_pixels python package

# COMMAND ----------

# %conda install -c conda-forge gdcm -y
# use cluster init script

# COMMAND ----------

# MAGIC %pip install pydicom Pillow

# COMMAND ----------

from databricks.pixels import version
version.__version__

# COMMAND ----------

# MAGIC %md ## Load Dicom Images

# COMMAND ----------

from databricks.pixels import Catalog, DicomFrames
df = Catalog.catalog(spark, "dbfs:/FileStore/shared_uploads/douglas.moore@databricks.com/benigns/")

# COMMAND ----------

display(df)

# COMMAND ----------

# MAGIC %md ## Extract Metadata from the Dicom images

# COMMAND ----------

dcm_df = DicomFrames(df).withMeta()
display(dcm_df)

# COMMAND ----------

# MAGIC %md ## Save Image (metadata) Catalog

# COMMAND ----------

dcm_df.write.format("delta").mode("overwrite").save("/tmp/douglas_moore/dcm_catalog")

# COMMAND ----------

# DBTITLE 1,Read and cache metadata from storage
dcm_df = spark.read.format("delta").load("/tmp/douglas_moore/dcm_catalog")
dcm_df.createOrReplaceTempView("dicom_images")

# COMMAND ----------

# MAGIC %md ## Analyze Metadata

# COMMAND ----------

# DBTITLE 1,Analyze Dicom metadata
# MAGIC %sql
# MAGIC SELECT meta:hash, meta:['00100010'].Value[0].Alphabetic as patient_name, meta:img_min, meta:img_max, path 
# MAGIC FROM dicom_images
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
