# Databricks notebook source
# MAGIC %md
# MAGIC ## Eval `ai_query()` AI for PHI Detection
# MAGIC
# MAGIC This notebook aims to evaluate a model's ability to detect PHI, leveraging a golden dataset created in a separate notebook. The dataset requires two key pieces:
# MAGIC
# MAGIC 1. `metadata`: the json string to be evaluated
# MAGIC 2. `label`: the target label

# COMMAND ----------

dbutils.widgets.text(
  name='golden_data',
  defaultValue='hls_radiology.tcia.phi_detection_golden',
  label = '0. Golden Dataset'
)
golden_data = dbutils.widgets.get('golden_data')

dbutils.widgets.dropdown(
  name='endpoint',
  defaultValue='databricks-gpt-oss-120b',
  choices = sorted([ 'databricks-gpt-oss-20b',
                    'databricks-gpt-oss-120b',
                    'databricks-gemma-3-12b',
                    'databricks-llama-4-maverick',
                    'databricks-meta-llama-3-3-70b-instruct',
                    'databricks-meta-llama-3-1-8b-instruct']),
  label = '1. Endpoint'
)
endpoint = dbutils.widgets.get('endpoint')

dbutils.widgets.text(
  name='max_queries',
  defaultValue="100",
  label='2. Maximum queries allowed (ie, row limit for ai_query())'
)

max_queries = int(dbutils.widgets.get('max_queries'))

# COMMAND ----------

prompt = """
You are an expert in Protected Health Information (PHI) detection. You will classify a given DICOM metadata json string as having PHI or not so that we are able to mask downstream.

Qualifying PHI includes:
1. Names;
2. All geographical subdivisions smaller than a State, including street address, city, county, precinct, zip code, and their equivalent geocodes, except for the initial three digits of a zip code, if according to the current publicly available data from the Bureau of the Census: (1) The geographic unit formed by combining all zip codes with the same three initial digits contains more than 20,000 people; and (2) The initial three digits of a zip code for all such geographic units containing 20,000 or fewer people is changed to 000.
3. All elements of dates (except year) for dates directly related to an individual, including birth date, admission date, discharge date, date of death; and all ages over 89 and all elements of dates (including year) indicative of such age, except that such ages and elements may be aggregated into a single category of age 90 or older;
4. Phone numbers;
5. Fax numbers;
6. Electronic mail addresses;
7. Social Security numbers;
8. Medical record numbers;
9. Health plan beneficiary numbers;
10. Account numbers;
11. Certificate/license numbers;
12. Vehicle identifiers and serial numbers, including license plate numbers;
13. Device identifiers and serial numbers;
14. Web Universal Resource Locators (URLs);
15. Internet Protocol (IP) address numbers;
16. Biometric identifiers, including finger and voice prints;
17. Full face photographic images and any comparable images; and
18. Any other unique identifying number, characteristic, or code (note this does not mean the unique code assigned by the investigator to code the data)

There are also additional standards and criteria to protect individuals from re-identification. Any code used to replace the identifiers in data sets cannot be derived from any information related to the individual and the master codes, nor can the method to derive the codes be disclosed. For example, a subject’s initials cannot be used to code their data because the initials are derived from their name. Additionally, the researcher must not have actual knowledge that the research subject could be re-identified from the remaining identifiers in the PHI used in the research study. In other words, the information would still be considered identifiable if there was a way to identify the individual even though all of the 18 identifiers were removed.

The DICOM Metatadata is listed here: 
<METADATA>
{metadata}
<METADATA/>

Please respond with a json in the structure:
has_phi: boolean, offending_tags: List[string]

EXAMPLE: 
metadata: {{PatientName: Brennan Beal}}
response: {has_phi: True, offending_tags: [PatientName]}
"""

# COMMAND ----------

import pandas as pd
import json
from pyspark.sql.functions import pandas_udf
from pyspark.sql import functions as F
from pyspark.sql.types import StructType, StructField, StringType, ArrayType, BooleanType, IntegerType, FloatType

result_schema = StructType([
    StructField("has_phi", BooleanType()),
    StructField("offending_tags", ArrayType(StringType())),
])

query = f"""
  WITH data_with_prompting AS (
      SELECT *,
            REPLACE('{prompt}', '{{metadata}}', CAST(metadata AS STRING)) AS prompt
      FROM {golden_data}
      LIMIT {max_queries}
  )
  SELECT *,
        ai_query(
          endpoint => '{endpoint}',
          request => prompt,
          responseFormat => 'STRUCT<response: STRUCT<has_phi:BOOLEAN,offending_tags:ARRAY<STRING>>>',
          failOnError => false,
          modelParameters => named_struct('reasoning_effort', 'low')
        ) AS response
  FROM data_with_prompting
  """

df = (
  spark
    .sql(query)
    .withColumn(
      "parsed_result",
      F.from_json(F.expr("response.result"), result_schema)
    )
)

df = (
  df.select(
      "*",
      F.col("parsed_result.has_phi").alias("has_phi_prediction"),
      F.col("parsed_result.offending_tags").alias("offending_tags"),
      F.col("response.errorMessage").alias("api_error")
    )
)

# COMMAND ----------

predictions = df.toPandas()
predictions['label'] = predictions['label'].astype(bool)

# Some predictions are None d/t JSON parsing errors
filtered_predictions = predictions[~predictions['has_phi_prediction'].isna()]
filtered_predictions['has_phi_prediction'] = filtered_predictions['has_phi_prediction'].astype(bool)

# COMMAND ----------

from sklearn.metrics import f1_score, recall_score, precision_score, accuracy_score
import json

print("F1 Score: ", f1_score(filtered_predictions['label'], filtered_predictions['has_phi_prediction']))
print("Recall Score: ", recall_score(filtered_predictions['label'], filtered_predictions['has_phi_prediction']))
print("Precision Score: ", precision_score(filtered_predictions['label'], filtered_predictions['has_phi_prediction']))
print("Accuracy Score: ", accuracy_score(filtered_predictions['label'], filtered_predictions['has_phi_prediction']))



# COMMAND ----------

from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
import matplotlib.pyplot as plt


cm = confusion_matrix(filtered_predictions['label'], filtered_predictions['has_phi_prediction'])
disp = ConfusionMatrixDisplay(confusion_matrix=cm)
disp.plot()
plt.show()

# COMMAND ----------

errors = df[df['label'] != df['has_phi_prediction']]
