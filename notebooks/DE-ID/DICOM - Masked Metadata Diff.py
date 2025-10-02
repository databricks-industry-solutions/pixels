# Databricks notebook source
# MAGIC %md
# MAGIC ## Create PHI Golden Data for PHI-Detection Evaluation
# MAGIC
# MAGIC Customers are requesting a dataset from which we can evaluate performance of various DICOM-related PHI-detection and masking tasks. This notebook is meant to create this golden data. To do this, we will:
# MAGIC
# MAGIC 1. Gather original DICOM metadata from `object_catalog`
# MAGIC 2. Gather corresponding masked metadata gathered from the `midi_b_val` dataset
# MAGIC 3. Diff the original and masked metadata to identify all tags assumed to be PHI
# MAGIC 4. Reverse engineer half of the data to be just the allowable data (that not presumed to be PHI)
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

dbutils.widgets.text("golden_data_table", "hls_radiology.tcia.phi_detection_golden")
dbutils.widgets.text("original_dicom_data", "hls_radiology.tcia.object_catalog")
dbutils.widgets.text("masked_dicom_data", "hls_radiology.tcia.midi_b_val")
dbutils.widgets.text("dicom_tag_mapping_table", "hls_radiology.ddsm.dicom_tags")
dbutils.widgets.text("table_to_write", "hls_radiology.tcia.masked_dicom_diffing_results")

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

def make_get_diff_tag_udf(spark, dicom_tag_mapping: dict):
    diff_schema = StructType([
        StructField("result", ArrayType(MapType(StringType(), StringType())), True),
        StructField("errors", ArrayType(MapType(StringType(), StringType())), True)
    ])

    tag_mapping_bc = spark.sparkContext.broadcast(dicom_tag_mapping)
    dicom_tag_mapping = spark.sparkContext.broadcast(dicom_tag_mapping)

    @pandas_udf(diff_schema)
    def find_diff_tags_udf(meta_col: pd.Series, masked_col: pd.Series) -> pd.DataFrame:
        """
        Returns a list of {tag_key: mapping} dicts for tags that differ,
        plus a list of {tag_key: error_message} dicts for errors.
        """
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
                                row_results.append({k: tag_mapping.get(k, k)})
                        except Exception as e:
                            row_errors.append({k: str(e)})
                    else:
                        row_results.append({k: tag_mapping.get(k, k)})

            except Exception as e:
                row_results = []
                row_errors.append({"__row__": str(e)})

            results.append(row_results)
            errors_list.append(row_errors)

        return pd.DataFrame({"result": results, "errors": errors_list})

    return find_diff_tags_udf

@pandas_udf(StringType())
def remove_tags_from_json(json_str_series, tags_to_remove_series):
    """
    Removes the specified tags from the json string.
    """
    results = []
    for json_str, tags_to_remove in zip(json_str_series, tags_to_remove_series):
        try:
            json_dict = json.loads(json_str or "{}")
            if tags_to_remove is None:
                tags_to_remove = []
            elif not isinstance(tags_to_remove, list):
                tags_to_remove = list(tags_to_remove)

            tags = [next(iter(item.keys())) for item in tags_to_remove]

            for tag in tags:
                json_dict.pop(tag, None)

            results.append(json.dumps(json_dict))

        except Exception as e:
            results.append(json.dumps({"__error__": str(e), "__original__": json_str}))

    return pd.Series(results)

# COMMAND ----------

find_diff_tags_udf = make_get_diff_tag_udf(spark, tag_mapping)

# Removing the 7FE00010 key from the masked json, representing the binary file
dicom_to_json_udf = udf(lambda path: dicom_to_json(path, "7FE00010"), StringType())

diffed_dicom_data = (
  joined_df
    .withColumn("masked_json", dicom_to_json_udf("path_masked"))
    .withColumn("diff_tags", find_diff_tags_udf("meta", "masked_json"))
    .withColumn("diffing_tag_list", F.col("diff_tags.result"))
    .withColumn("diffing_errors", F.col("diff_tags.errors"))
    .withColumn("negative_values", remove_tags_from_json("meta", "diffing_tag_list"))
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

# COMMAND ----------

golden_data = (
    diffed_dicom_data.withColumn("label", (F.rand() > 0.5).cast("int"))  # randomly 0 or 1
      .withColumn(
          "metadata",
          F.when(F.col("label") == 1, F.col("meta"))
           .otherwise(F.col("negative_values"))
      )
      .select(
        "metadata", 
        "label", 
        F.col("meta").alias('original_metadata'), 
        F.col("negative_values").alias('non_phi_metadata'), 
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
