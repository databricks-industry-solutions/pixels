# Databricks notebook source
# MAGIC %pip install dicognito==0.17.0 ff3==1.0.2

# COMMAND ----------

main_table = "hls_radiology.ddsm.object_catalog"
DEST_PATH = "/Volumes/ema_rina/pixels_solacc_deid/pixels_volume/anonymized/"

# COMMAND ----------

from databricks.sdk import WorkspaceClient

w = WorkspaceClient()

scope_name = "pixels-scope"

if scope_name not in [scope.name for scope in w.secrets.list_scopes()]:
  w.secrets.create_scope(scope=scope_name)

w.secrets.put_secret(scope=scope_name, key="pixels_fp_key", string_value="2DE79D232DF5585D68CE47882AE256D6")

# COMMAND ----------

import dicognito.anonymizer
import os
from ff3 import FF3Cipher
from pydicom import dcmread, Dataset
import copy

fp_key = dbutils.secrets.get(scope="pixels-scope", key="pixels_fp_key")
tweak = "CBD09280979564"

encrypt_list = ['StudyInstanceUID', 'SeriesInstanceUID', 'SOPInstanceUID', 'AccessionNumber', 'PatientID']
keep_list = ['StudyDate','StudyTime','SeriesDate']

c = FF3Cipher(fp_key, tweak)
anonymizer = dicognito.anonymizer.Anonymizer()

ds = dcmread("/Volumes/ema_rina/pixels_solacc_deid/pixels_volume/unzipped/benigns_21/benigns/patient0027/0027.LEFT_CC.dcm")

keep_values = [copy.deepcopy(ds[element]) for element in keep_list if element in ds]

encrypted_values = []

for element in encrypt_list:
    if element in ds:
      if("UID" in element):
        c.alphabet = "0123456789"
        ds[element].value = ".".join([c.encrypt(element) if len(element) > 5 else element for element in ds[element].value.split(".")])
      else:
        c.alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,^"
        ds[element].value = c.encrypt(ds[element].value) if len(ds[element].value) > 5 else ""
      
      encrypted_values.append(copy.deepcopy(ds[element]))

anonymizer.anonymize(ds)

with Dataset() as dataset:
    for values in encrypted_values + keep_values:
      dataset.add(values)

    ds.update(dataset)

print(dataset)

# COMMAND ----------

from dbx.pixels.dicom.dicom_meta_anonymizer import DicomMetaAnonymizer

df = spark.read.table(main_table).repartition(16)

anonymz_df = DicomMetaAnonymizer(key=key).transform(df)
display(anonymz_df.drop("thumbnail"))
