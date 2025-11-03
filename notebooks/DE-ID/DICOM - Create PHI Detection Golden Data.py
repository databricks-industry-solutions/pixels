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
# MAGIC
# MAGIC
# MAGIC ## Requirements:
# MAGIC Tested on the following runtimes:
# MAGIC
# MAGIC 1. Serverless (v17.3, CPU)
# MAGIC 2. DBR 16.4
# MAGIC
# MAGIC With `pydicom` and `pandas` as requirements

# COMMAND ----------

# MAGIC %run ../../config/setup

# COMMAND ----------

from pyspark.sql import functions as F
from pyspark.sql.types import ArrayType, StringType, StructType, StructField, MapType
from pyspark.sql.functions import pandas_udf
from pydicom.tag import Tag
from pydicom.datadict import keyword_for_tag, dictionary_description
import json
import pydicom
import pandas as pd


dbutils.widgets.text(
  name="original_dicom_data",
  defaultValue="hls_radiology.tcia.object_catalog",
  label="1. Table containing original DICOM data"
)

# The midi_b_val table contains medical imaging DICOM files. It includes information such as patient identifiers, body parts examined, and details about the imaging collection. This is joined using the Synthetic Validation dataset and Curated Validation table from https://www.cancerimagingarchive.net/collection/midi-b-test-midi-b-validation/
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

# COMMAND ----------

dicom_data = spark.read.table(dbutils.widgets.get("original_dicom_data"))
masked_data = spark.read.table(dbutils.widgets.get("masked_dicom_data")).drop("pixel_hash")
joined_df = masked_data.join(dicom_data, "path")

# COMMAND ----------

def get_tag_dictionary_desc(tag_input):
    """
    Accepts tag in several forms:
      - hex string (e.g. '#00100030' or '00100030')
      - tuple (0x0010, 0x0030)
      - int (0x00100030)
    Returns a dict with tag, keyword, and description.
    """
    if isinstance(tag_input, str):
        tag_input = tag_input.strip().replace("#", "").replace("0x", "")
        tag = Tag(int(tag_input, 16))
    elif isinstance(tag_input, tuple):
        tag = Tag(tag_input)
    else:
        tag = Tag(tag_input)

    return dictionary_description(tag)

def dicom_to_json(path: str) -> str:
    local_path = path.replace("dbfs:", "")
    dcm = pydicom.dcmread(local_path, stop_before_pixels=True)
    data = dcm.to_json_dict() 
    return json.dumps(data)

def make_compare_dicom_tags_udf(spark):
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
        StructField("masked_meta", StringType(), True),
        StructField("diff_tags", StringType(), True),
        StructField("non_phi_metadata", StringType(), True),
        StructField("errors", ArrayType(MapType(StringType(), StringType())), True),
    ])

    @pandas_udf(diff_schema)
    def compare_dicom_tags_udf(meta_col: pd.Series, masked_file_path: pd.Series) -> pd.DataFrame:
        masked_meta, diff_dicts, non_phi_dicts, errors_list = [], [], [], []
        for meta_str, masked_str in zip(meta_col, masked_file_path):
            masked_str = dicom_to_json(masked_str)
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
                                row_diff[k] = get_tag_dictionary_desc(k)
                            else:
                                row_non_phi[k] = v
                        else:
                            row_diff[k] = get_tag_dictionary_desc(k)
                    except Exception as e:
                        row_errors.append({k: str(e)})
            except Exception as e:
                row_diff = {}
                row_non_phi = {}
                row_errors.append({"__row__": str(e)})
            
            masked_meta.append(masked_str)
            diff_dicts.append(json.dumps(row_diff))
            non_phi_dicts.append(json.dumps(row_non_phi))
            errors_list.append(row_errors)
            
        return pd.DataFrame({
            "masked_meta": masked_meta,
            "diff_tags": diff_dicts,
            "non_phi_metadata": non_phi_dicts,
            "errors": errors_list
        })
    return compare_dicom_tags_udf
            

# COMMAND ----------

# MAGIC %md
# MAGIC
# MAGIC Parsing metadata from the masked dicom filepaths, and comparing those json strings to their corresponding unmasked jsons. This allows us to know what, specifically, is considered PHI versus Non-PHI. The `diff_tags` here represent a JSON of `{tag: tag_description}`.

# COMMAND ----------

compare_dicom_tags_udf = make_compare_dicom_tags_udf(spark)

compared_dicom_data = (
  joined_df
    .withColumn("comparison_struct", compare_dicom_tags_udf("meta","path_masked"))
    .withColumn("masked_meta", F.col("comparison_struct.masked_meta"))
    .withColumn("non_phi_metadata", F.col("comparison_struct.non_phi_metadata"))
    .withColumn("diff_tags", F.col("comparison_struct.diff_tags"))
    .drop("comparison_struct")
)

# COMMAND ----------

# MAGIC %md
# MAGIC
# MAGIC Writing the intermediate table with the masked DICOM metadata as this is a relatively expensive UDF that should be persisted.

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

# MAGIC %md
# MAGIC
# MAGIC Creating and persisting a "golden data" table that contains either the original metadata (with PHI) or the non-PHI metadata derived above. 

# COMMAND ----------

dicom_data = spark.table(table_name)

golden_data = (
    dicom_data.withColumn("label", (F.rand() > 0.5).cast("int"))  # randomly 0 or 1
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

# COMMAND ----------

display(golden_data.limit(5))

# COMMAND ----------

# MAGIC %md
# MAGIC Displaying the label counts:

# COMMAND ----------

golden_data.groupBy("label").count().display()

