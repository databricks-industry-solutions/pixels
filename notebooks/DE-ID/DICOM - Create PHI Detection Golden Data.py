# Databricks notebook source
# MAGIC %md
# MAGIC ## Create Golden Data for PHI-Detection Evaluation
# MAGIC
# MAGIC This notebook creates two tables: (1) a table that has a comparison of original dicoms versus the corresponding dicoms that have been masked by experts (MIDI-b data) and (2) a golden dataset that leverages this set of DICOMS to sample both PHI and non-PHI containing DICOM metadata for ML/AI evaluation.
# MAGIC
# MAGIC To do this, we:
# MAGIC
# MAGIC 1. Gather original DICOM metadata from `object_catalog`
# MAGIC 2. Gather corresponding masked metadata from the `midi_b_val` dataset
# MAGIC 3. Keep only data that the original and masked jsons have in common (i.e., the non-phi)
# MAGIC 5. Sample this data into the `phi_detection_golden` table

# COMMAND ----------

# MAGIC %run ../../config/setup

# COMMAND ----------

from pyspark.sql import functions as F
from pyspark.sql.types import ArrayType, StringType, StructType, StructField, MapType
from pyspark.sql.functions import pandas_udf
import json
import pydicom
import pandas as pd


dbutils.widgets.text(
  name="original_dicom_data",
  defaultValue="hls_radiology.tcia.object_catalog",
  label="1. Table containing original DICOM data"
)

dbutils.widgets.text(
  name="masked_dicom_data", 
  defaultValue="hls_radiology.tcia.midi_b_val",
  label="2. Table containing masked DICOM data"
)

dbutils.widgets.text(
  name="intermediate_diffing_table_to_write", 
  defaultValue="hls_radiology.tcia.masked_dicom_diffing_results",
  label="3. Table for which to write Dicom diffing results"
)

dbutils.widgets.text(
  name="golden_data_table", 
  defaultValue="hls_radiology.tcia.phi_detection_golden",
  label="4. Table for which to write golden data"
)

dbutils.widgets.text(
  name="dicom_tag_mapping_table", 
  defaultValue="hls_radiology.ddsm.dicom_tags",
  label="5. Table containing DICOM tag map (Optional)"
)

# COMMAND ----------

dicom_data = spark.read.table(dbutils.widgets.get("original_dicom_data"))
masked_data = spark.read.table(dbutils.widgets.get("masked_dicom_data")).drop("pixel_hash")
joined_df = masked_data.join(dicom_data, "path")
tag_df = spark.read.table(dbutils.widgets.get("dicom_tag_mapping_table"))
tag_mapping = dict(tag_df.select("Tag", "Keyword").rdd.map(tuple).collect())

# COMMAND ----------

def dicom_to_json(path: str, remove_key: str = None) -> str:
    local_path = path.replace("dbfs:", "")
    dcm = pydicom.dcmread(local_path)
    data = dcm.to_json_dict()
    if remove_key and remove_key in data:
        del data[remove_key]
    
    return json.dumps(data)

def make_compare_dicom_tags_udf(spark, dicom_tag_mapping: dict = None):
    """
    This function creates a PySpark Pandas UDF that compares two JSON-encoded
    DICOM metadata columns (original and masked) to identify differing and
    unchanged tags.

    Returns three fields:
      - diff_tags: JSON string of differing tags mapped to human-readable names
      - non_phi_metadata: JSON string of unchanged (non-PHI) tags
      - errors: list of error dicts
    """
    diff_schema = StructType([
        StructField("diff_tags", StringType(), True),
        StructField("non_phi_metadata", StringType(), True),
        StructField("errors", ArrayType(MapType(StringType(), StringType())), True),
    ])

    tag_mapping_bc = spark.sparkContext.broadcast(dicom_tag_mapping)

    @pandas_udf(diff_schema)
    def compare_dicom_tags_udf(meta_col: pd.Series, masked_col: pd.Series) -> pd.DataFrame:
        tag_mapping = tag_mapping_bc.value or {}
        diff_dicts, non_phi_dicts, errors_list = [], [], []

        for meta_str, masked_str in zip(meta_col, masked_col):
            row_diff, row_non_phi, row_errors = {}, {}, []

            try:
                meta_json = json.loads(meta_str or "{}")
                masked_json = json.loads(masked_str or "{}")

                for k, v in meta_json.items():
                    try:
                        if k in masked_json:
                            masked_val = masked_json[k].get("Value")
                            orig_val = v.get("Value")
                            if masked_val != orig_val:
                                row_diff[k] = tag_mapping.get(k, k)
                            else:
                                row_non_phi[k] = v
                        else:
                            row_diff[k] = tag_mapping.get(k, k)
                    except Exception as e:
                        row_errors.append({k: str(e)})

            except Exception as e:
                row_diff = {}
                row_non_phi = {}
                row_errors.append({"__row__": str(e)})

            diff_dicts.append(json.dumps(row_diff))
            non_phi_dicts.append(json.dumps(row_non_phi))
            errors_list.append(row_errors)

        return pd.DataFrame({
            "diff_tags": diff_dicts,
            "non_phi_metadata": non_phi_dicts,
            "errors": errors_list
        })

    return compare_dicom_tags_udf
            

# COMMAND ----------

compare_dicom_tags_udf = make_compare_dicom_tags_udf(spark, tag_mapping)

# Convert dicom to json string and
# ... remove the 7FE00010 key from the masked json, representing the binary file
dicom_to_json_udf = udf(lambda path: dicom_to_json(path, "7FE00010"), StringType())

compared_dicom_data = (
  joined_df
    .withColumn("masked_metadata", dicom_to_json_udf("path_masked"))
    .withColumn("comparison_struct", compare_dicom_tags_udf("meta", "masked_metadata"))
    .withColumn("non_phi_metadata", F.col("comparison_struct.non_phi_metadata"))
    .withColumn("diff_tags", F.col("comparison_struct.diff_tags"))
)

# COMMAND ----------

table_name = dbutils.widgets.get("intermediate_diffing_table_to_write")

(
    compared_dicom_data
      .write
      .format("delta")
      .mode("overwrite")
      .saveAsTable(table_name)
)

# COMMAND ----------

golden_data = (
    compared_dicom_data.withColumn("label", (F.rand() > 0.5).cast("int"))  # randomly 0 or 1
      .withColumn(
          "metadata",
          F.when(F.col("label") == 1, F.col("meta"))
           .otherwise(F.col("non_phi_metadata"))
      )
      .select(
        "metadata", 
        "label", 
        F.col("meta").alias('original_metadata'), 
        F.col("non_phi_metadata"), 
        F.col("path").alias("original_dicom_path"),
        F.col("path_masked").alias("masked_dicom_path")
      )
      .sample(
        fraction=0.15,
        seed=88
      )
)

(
    golden_data
      .write
      .format("delta")
      .mode("overwrite")
      .saveAsTable(dbutils.widgets.get("golden_data_table"))
)
