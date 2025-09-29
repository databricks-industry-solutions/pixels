# Databricks notebook source
# MAGIC %md
# MAGIC ## Create Binary PHI Flag
# MAGIC The goal of this notebook is to assess the `.dcm` files associated with PHI by reverse engineering the outcome of PHI masking from the original files in order to create a binary flag of `requires_phi_masking` for the original data. With this flag, we can then assess performance metrics on various PHI detection solutions.

# COMMAND ----------

# MAGIC %run ../../config/setup

# COMMAND ----------

from pyspark.sql import functions as F
from pyspark.sql.types import ArrayType, StringType
from pyspark.sql.functions import pandas_udf
import json
import pydicom
import pandas as pd

dicom_data = spark.read.table('hls_radiology.tcia.object_catalog')
masked_data = spark.read.table('hls_radiology.tcia.midi_b_val_subset')
joined_df = masked_data.join(dicom_data, "path")
tag_df = spark.read.table("hls_radiology.ddsm.dicom_tags")
tag_mapping = dict(tag_df.select("Tag", "Keyword").rdd.map(tuple).collect())
tag_mapping_bc = spark.sparkContext.broadcast(tag_mapping)

# COMMAND ----------

def dicom_to_json(path: str) -> str:
    local_path = path.replace("dbfs:", "")
    dcm = pydicom.dcmread(local_path)
    return json.dumps(dcm.to_json_dict())

dicom_to_json_udf = udf(dicom_to_json, StringType())

@pandas_udf(ArrayType(StringType()))
def find_diff_tags_udf(meta_col: pd.Series, masked_col: pd.Series) -> pd.Series:
    tag_mapping = tag_mapping_bc.value
    results = []

    for meta_str, masked_str in zip(meta_col, masked_col):
        try:
          meta_json = json.loads(meta_str or "{}")
          masked_json = json.loads(masked_str or "{}")

          diffs = []
          for k, v in meta_json.items():
              if k in masked_json:
                  try:
                      masked_value = masked_json[k].get("Value")
                      if masked_value != v.get("Value"):
                          diffs.append(tag_mapping.get(k, k))
                  except AttributeError:
                      continue
          results.append(diffs)
        except Exception:
          results.append([])

    return pd.Series(results)

# COMMAND ----------

df_with_masked_json = (
  joined_df
    .withColumn("masked_json", dicom_to_json_udf("path_masked"))
    .withColumn("diff_tags", find_diff_tags_udf("meta", "masked_json"))
)

# COMMAND ----------

pandas_masked_data_diff = df_with_masked_json.toPandas()
