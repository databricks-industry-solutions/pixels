# Databricks notebook source
# MAGIC %md
# MAGIC # DICOM Metadata Anonymization and Processing
# MAGIC
# MAGIC This notebook is designed to facilitate the anonymization and processing of dicom metadata. It leverages specific Python packages ([DICOGNITO](https://github.com/blairconrad/dicognito), [fastfpe](https://github.com/pjwerneck/fastfpe)) to ensure that sensitive patient information is protected while maintaining the integrity of the medical images.
# MAGIC
# MAGIC [Exactly what does dicognito do?](https://github.com/blairconrad/dicognito?tab=readme-ov-file#exactly-what-does-dicognito-do)
# MAGIC
# MAGIC By following this notebook, users can efficiently anonymize radiology datasets, making them suitable for research and analysis without compromising patient privacy.

# COMMAND ----------

# MAGIC %run ../install/config/setup

# COMMAND ----------

path,table,volume,write_mode = init_widgets()

# COMMAND ----------

# MAGIC %md
# MAGIC # Generate key for encryption
# MAGIC
# MAGIC The Format Preserving Encryption (FF1) library in Python uses two key components for encryption:
# MAGIC
# MAGIC ### Key (fp_key)
# MAGIC
# MAGIC A cryptographic key that can be 128, 192, or 256 bits in length<br>
# MAGIC Must be provided as a hexadecimal string<br>
# MAGIC Used as the main encryption key for the FPE algorithm
# MAGIC
# MAGIC ### Tweak (fp_tweak, optional)
# MAGIC An additional input parameter that adds domain separation to the encryption process<br>
# MAGIC Optional hex string; when omitted, derived automatically as the SHA-256 hex digest of each DICOM file path
# MAGIC
# MAGIC ### TWEAK - Additional details
# MAGIC The tweak is a parameter that synthetically increases the domain space of the encryption, making it more secure. It acts as an additional input parameter alongside the key to add an extra layer of security.
# MAGIC #### Security Considerations
# MAGIC The tweak is not necessarily secret, but should be treated as sensitive information. While tweaks don't need to be kept secret like encryption keys, they should be:
# MAGIC  - Randomly generated with high entropy
# MAGIC  - Not user-controlled
# MAGIC  - Utilized across the full domain space
# MAGIC Never reused for encrypting the same values that correspond to different entities
# MAGIC
# MAGIC #### Security Implications
# MAGIC Poor tweak management can lead to security vulnerabilities. If tweaks are chosen on a restricted domain or if access control is too broad, attackers could potentially create a codebook to decrypt the data. Additionally, using the same tweak and key to encrypt identical plaintexts will produce identical ciphertexts, which could leak information about the encrypted data.

# COMMAND ----------

import re
from databricks.sdk import WorkspaceClient

w = WorkspaceClient()

scope_name = "pixels-scope"

# Change keys, **DO NOT COMMIT THESE KEYS IN YOUR REPO - KEEP IT SAFE**

#pixels_fp_key length must be 128, 192 or 256 bits
pixels_fp_key = None

if scope_name not in [scope.name for scope in w.secrets.list_scopes()]:
  w.secrets.create_scope(scope=scope_name)

w.secrets.put_secret(scope=scope_name, key="pixels_fp_key", string_value=pixels_fp_key)

fp_key = dbutils.secrets.get(scope="pixels-scope", key="pixels_fp_key")
#tweak will be generated from file path

# COMMAND ----------

from dbx.pixels import Catalog
from dbx.pixels.dicom.dicom_anonymizer_extractor import DicomAnonymizerExtractor

catalog = Catalog(spark, table=table+"_anonym", volume=volume)
catalog_df = catalog.catalog(path=path, extractZip=True)

metadata_df = DicomAnonymizerExtractor(catalog, anonym_mode="METADATA", fp_key=fp_key).transform(catalog_df)

display(metadata_df)

#catalog.save(metadata_df)

# COMMAND ----------

# MAGIC %md
# MAGIC #Display anonymized dicoms

# COMMAND ----------

# MAGIC %sql
# MAGIC select meta:["00120063"].Value[0] as AnonimizationTool from ${table}_anonym
