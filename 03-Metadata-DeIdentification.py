# Databricks notebook source
# MAGIC %md
# MAGIC # DICOM Metadata Anonymization and Processing
# MAGIC
# MAGIC This notebook is designed to facilitate the anonymization and processing of dicom metadata. It leverages specific Python packages to ensure that sensitive patient information is protected while maintaining the integrity of the medical images.
# MAGIC
# MAGIC By following this notebook, users can efficiently anonymize radiology datasets, making them suitable for research and analysis without compromising patient privacy.

# COMMAND ----------

# MAGIC %run ./config/setup

# COMMAND ----------

path,table,volume,write_mode = init_widgets()

# COMMAND ----------

# MAGIC %md
# MAGIC # Generate key for encryption
# MAGIC

# COMMAND ----------

from databricks.sdk import WorkspaceClient

w = WorkspaceClient()

scope_name = "pixels-scope"

if scope_name not in [scope.name for scope in w.secrets.list_scopes()]:
  w.secrets.create_scope(scope=scope_name)

#Change string_value to your own key, **DO NOT COMMIT THIS KEY IN YOUR REPO - KEEP IT SAFE**
w.secrets.put_secret(scope=scope_name, key="pixels_fp_key", string_value="2DE79D232DF5585D68CE47882AE256D6")

fp_key = dbutils.secrets.get(scope="pixels-scope", key="pixels_fp_key")
tweak = "CBD09280979564"

# COMMAND ----------

from dbx.pixels import Catalog
from dbx.pixels.dicom.dicom_meta_anonymizer_extractor import DicomMetaAnonymizerExtractor

catalog = Catalog(spark, table=table+"_anonym", volume=volume)
catalog_df = catalog.catalog(path=path, extractZip=True)

metadata_df = DicomMetaAnonymizerExtractor(catalog, anonym_mode="META", fp_key=fp_key, tweak=tweak).transform(catalog_df)

catalog.save(metadata_df)

# COMMAND ----------

# MAGIC %md
# MAGIC #Display anonymized dicoms

# COMMAND ----------

# MAGIC %sql
# MAGIC select * except(thumbnail) from ${table}_anonym
