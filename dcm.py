# Databricks notebook source
# MAGIC %md # Scale Dicom based image processing
# MAGIC - Use `databricks.pixels` python package for simplicity
# MAGIC - Scale up Image processing over multiple-cores and nodes
# MAGIC - Delta lake & Delta Engine accelerate metadata research.
# MAGIC - Delta lake (optionally) to speed up small file processing
# MAGIC - Mix of Spark and Python processing
# MAGIC - Uses pydicom python package as core library
# MAGIC 
# MAGIC tags: douglas moore, dicom, dcm, pre-processing, visualization, repos, python, package, image catalog, mamograms

# COMMAND ----------

# MAGIC %md ## Setup

# COMMAND ----------

# %conda install -c conda-forge gdcm -y

# COMMAND ----------

#%pip install -r requirements.txt

# COMMAND ----------

# MAGIC %md ## Load Dicom Images

# COMMAND ----------

from databricks.pixels import Catalog, DicomFrames

# COMMAND ----------

df = Catalog.catalog(spark, "dbfs:/FileStore/shared_uploads/douglas.moore@databricks.com/benigns/")
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

# MAGIC %sql select meta:img_min, meta:img_max from dicom_images where array_contains( path_tags, 'patient7747' )

# COMMAND ----------

# DBTITLE 1,Analyze Dicom metadata
# MAGIC %sql
# MAGIC SELECT meta:['00100010'].Value[0].Alphabetic as patient_name, meta:img_min, meta:img_max, path 
# MAGIC FROM dicom_images 
# MAGIC order by patient_name

# COMMAND ----------

# MAGIC %md ## Filter Dicom Images

# COMMAND ----------

dcm_df_filtered = dcm_df.filter('meta:img_max < 1000')
dcm_df_filtered.count()

# COMMAND ----------

# MAGIC %md ## Display Dicom Images

# COMMAND ----------

plots = DicomFrames(dcm_df_filtered).plotx()
plots

# COMMAND ----------

# MAGIC %md ## Appendix
