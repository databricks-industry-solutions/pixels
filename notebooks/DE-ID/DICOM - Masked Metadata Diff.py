# Databricks notebook source
# MAGIC %md
# MAGIC ## Create Binary PHI Flag
# MAGIC The goal of this notebook is to assess the `.dcm` files associated with PHI by reverse engineering the outcome of PHI masking from the original files in order to create a binary flag of `requires_phi_masking` for the original data. With this flag, we can then assess performance metrics on various PHI detection solutions.

# COMMAND ----------

# MAGIC %run ../../config/setup

# COMMAND ----------

from pyspark.sql import functions as F
from pyspark.sql.types import ArrayType, StringType, StructType, StructField, MapType
from pyspark.sql.functions import pandas_udf
import json
import pydicom
import pandas as pd

dbutils.widgets.text("original_dicom_data", "hls_radiology.tcia.object_catalog")
dbutils.widgets.text("masked_dicom_data", "hls_radiology.tcia.midi_b_val_subset")
dbutils.widgets.text("dicom_tag_mapping_table", "hls_radiology.ddsm.dicom_tags")
dbutils.widgets.text("table_to_write", "hls_radiology.tcia.masked_dicom_diffing_results")

dicom_data = spark.read.table(dbutils.widgets.get("original_dicom_data"))
masked_data = spark.read.table(dbutils.widgets.get("masked_dicom_data")).drop("pixel_hash")
joined_df = masked_data.join(dicom_data, "path")
tag_df = spark.read.table(dbutils.widgets.get("dicom_tag_mapping_table"))
tag_mapping = dict(tag_df.select("Tag", "Keyword").rdd.map(tuple).collect())

# COMMAND ----------

def dicom_to_json(path: str) -> str:
    local_path = path.replace("dbfs:", "")
    dcm = pydicom.dcmread(local_path)
    return json.dumps(dcm.to_json_dict())

def make_get_diff_tag_udf(spark, dicom_tag_mapping: dict):
    diff_schema = StructType([
        StructField("result", ArrayType(StringType())),
        StructField("errors", ArrayType(MapType(StringType(), StringType())))
    ])

    tag_mapping_bc = spark.sparkContext.broadcast(dicom_tag_mapping)
    dicom_tag_mapping = spark.sparkContext.broadcast(dicom_tag_mapping)

    @pandas_udf(diff_schema)
    def find_diff_tags_udf(meta_col: pd.Series, masked_col: pd.Series) -> pd.DataFrame:
        tag_mapping = tag_mapping_bc.value
        results, errors_list = [], []

        for meta_str, masked_str in zip(meta_col, masked_col):
            row_results, row_errors = [], []

            try:
                meta_json = json.loads(meta_str or "{}")
                masked_json = json.loads(masked_str or "{}")

                for k, v in meta_json.items():
                    if k in masked_json:
                        try:
                            masked_value = masked_json[k].get("Value")
                            if masked_value != v.get("Value"):
                                row_results.append(tag_mapping.get(k, k))
                        except Exception as e:
                            row_errors.append({k: str(e)})

            except Exception as e:
                # Entire row parse failed
                row_results = []
                row_errors.append({"__row__": str(e)})

            results.append(row_results)
            errors_list.append(row_errors)

        return pd.DataFrame({"result": results, "errors": errors_list})

    return find_diff_tags_udf

# COMMAND ----------

dicom_to_json_udf = udf(dicom_to_json, StringType())
find_diff_tags_udf = make_get_diff_tag_udf(spark, tag_mapping)

diffed_dicom_data = (
  joined_df
    .withColumn("masked_json", dicom_to_json_udf("path_masked"))
    .withColumn("diff_tags", find_diff_tags_udf("meta", "masked_json"))
    .withColumn("diffing_tag_list", F.col("diff_tags.result"))
    .withColumn("diffing_errors", F.col("diff_tags.errors"))
    .drop("diff_tags")
)

# COMMAND ----------

table_name = dbutils.widgets.get("table_to_write")

(
    diffed_dicom_data
      .write
      .format("delta")
      .mode("overwrite")
      .saveAsTable(table_name)
)
