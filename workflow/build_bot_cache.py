# Databricks notebook source
# MAGIC %md
# MAGIC # BOT Cache Builder
# MAGIC
# MAGIC Pre-computes DICOM Basic Offset Tables (BOT) for every file in the pixels
# MAGIC table and persists them to Lakebase.
# MAGIC
# MAGIC **Why run this?**
# MAGIC
# MAGIC The DICOMweb server resolves frame byte offsets in a 3-tier cache:
# MAGIC 1. In-memory BOT cache (microseconds) — fastest, lost on restart
# MAGIC 2. Lakebase persistent cache (milliseconds) — survives restarts
# MAGIC 3. On-demand BOT computation (seconds) — only on first access
# MAGIC
# MAGIC By running this job after every ingest, tier-3 computation is avoided
# MAGIC entirely: the server always finds the BOT in Lakebase on first access.
# MAGIC
# MAGIC **Startup preload**
# MAGIC
# MAGIC The `CachePriorityScorer` at the end of this notebook shows how to
# MAGIC inspect which files will be front-loaded into the in-memory cache on
# MAGIC the next server restart, ranked by a weighted score of:
# MAGIC - Recency of last access (`last_used_at`, 1-day half-life)
# MAGIC - Recency of insertion (`inserted_at`, 1-week half-life)
# MAGIC - Access frequency (`access_count`, log-scaled)

# COMMAND ----------

# MAGIC %pip install psycopg2-binary pydicom databricks-sdk==0.88 --quiet
# MAGIC dbutils.library.restartPython()

# COMMAND ----------

dbutils.widgets.text("table", "main.pixels_solacc.object_catalog",
                     "UC pixels table (catalog.schema.table)")
dbutils.widgets.text("volume", "main.pixels_solacc.pixels_volume",
                     "UC pixels volume (catalog.schema.volume)")
dbutils.widgets.text("lakebase_instance", "pixels-lakebase",
                     "Lakebase instance name")
dbutils.widgets.text("priority_limit", "500",
                     "Top-N files to show in preload preview")

# COMMAND ----------

table = dbutils.widgets.get("table")
volume = dbutils.widgets.get("volume")
lakebase_instance = dbutils.widgets.get("lakebase_instance")
priority_limit = int(dbutils.widgets.get("priority_limit"))

volume_path = "/Volumes/" + volume.replace(".","/")

print(f"Target table     : {table}")
print(f"Lakebase instance: {lakebase_instance}")

# COMMAND ----------

# MAGIC %md ## Step 1 — Run BOTCacheBuilder

# COMMAND ----------

from dbx.pixels.dicom.cache import BOTCacheBuilder

host = dbutils.notebook.entry_point.getDbutils().notebook().getContext().apiUrl().get()
token = dbutils.notebook.entry_point.getDbutils().notebook().getContext().apiToken().get()

df = spark.readStream.table(table).select("local_path")

result_df = BOTCacheBuilder(
        uc_table_name=table,
        lakebase_instance_name=lakebase_instance,
        host=host,
        token=token
    ).transform(df).select("local_path","bot_cache_status")

result_df.writeStream \
    .option("checkpointLocation", f"{volume_path}/checkpoints/bot_lakebase_cache/{table}") \
    .trigger(availableNow=True) \
    .outputMode("append") \
    .toTable(table+"_bot_cache_result") \
    .awaitTermination()

# COMMAND ----------

# MAGIC %md ## Step 2 — Summary

# COMMAND ----------

from pyspark.sql.functions import col, get_json_object

summary = (
    spark.read.table(table+"_bot_cache_result")
    .withColumn("status", get_json_object(col("bot_cache_status"), "$.status"))
    .groupBy("status")
    .count()
    .orderBy("status")
)

display(summary)

# COMMAND ----------

# Error details — inspect any failures.
errors = (
    spark.read.table(table+"_bot_cache_result")
    .withColumn("status", get_json_object(col("bot_cache_status"), "$.status"))
    .filter(col("status") == "error")
    .select(
        col("local_path"),
        get_json_object(col("bot_cache_status"), "$.error").alias("error"),
    )
)

if errors.count() > 0:
    print(f"⚠ {errors.count()} file(s) failed — see details below:")
    display(errors.limit(50))
else:
    print("✓ All files processed without errors.")

# COMMAND ----------

# MAGIC %md ## Step 3 — Preload priority preview
# MAGIC
# MAGIC Shows which files will be front-loaded into the in-memory BOT cache on
# MAGIC the next server restart, based on the priority scoring algorithm:
# MAGIC
# MAGIC ```
# MAGIC score = 0.5 × recency(last_used_at,  half-life=24 h)
# MAGIC       + 0.2 × recency(inserted_at,   half-life=168 h)
# MAGIC       + 0.3 × log10(1 + access_count)
# MAGIC ```

# COMMAND ----------

from dbx.pixels.lakebase import LakebaseUtils

lb = LakebaseUtils(
    instance_name=lakebase_instance,
    uc_table_name=table,
    min_connections=1,
    max_connections=4,
)

priority_list = lb.get_preload_priority_list(
    uc_table_name=table,
    limit=priority_limit,
)

print(f"Top {len(priority_list)} files by preload priority:")

priority_df = spark.createDataFrame(priority_list)
display(priority_df)
import json

print(json.dumps(priority_list, indent=2, default=str))

# COMMAND ----------

# DBTITLE 1,Cell 12
from dbx.pixels.lakebase import LakebaseUtils
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, FloatType, TimestampType, ArrayType

lb = LakebaseUtils(
    instance_name=lakebase_instance,
    uc_table_name=table,
    min_connections=1,
    max_connections=4,
)

priority_list = lb.get_preload_priority_list(
    uc_table_name=table,
    limit=priority_limit,
)

print(f"Top {len(priority_list)} files by preload priority:")

# Define explicit schema for the DataFrame
frame_schema = StructType([
    StructField("frame_number", IntegerType(), True),
    StructField("start_pos", IntegerType(), True),
    StructField("end_pos", IntegerType(), True),
    StructField("pixel_data_pos", IntegerType(), True)
])

priority_schema = StructType([
    StructField("filename", StringType(), True),
    StructField("frame_count", IntegerType(), True),
    StructField("transfer_syntax_uid", StringType(), True),
    StructField("last_used_at", TimestampType(), True),
    StructField("inserted_at", TimestampType(), True),
    StructField("access_count", IntegerType(), True),
    StructField("priority_score", FloatType(), True),
    StructField("frames", ArrayType(frame_schema), True)
])

# Create DataFrame with explicit schema
priority_df = spark.createDataFrame(priority_list, schema=priority_schema)
display(priority_df)

# COMMAND ----------

# MAGIC %md
# MAGIC ### Understanding the priority score
# MAGIC
# MAGIC | Score range | Meaning |
# MAGIC |-------------|---------|
# MAGIC | > 1.0       | Frequently accessed AND recently used |
# MAGIC | 0.3 – 1.0   | Moderately used, recent access |
# MAGIC | 0.1 – 0.3   | Newly ingested, not yet accessed |
# MAGIC | < 0.1       | Old, infrequent, not recently accessed |
# MAGIC
# MAGIC Files in the **> 0.3** band should be preloaded first to cover the
# MAGIC majority of viewer requests after a server restart.

# COMMAND ----------

# MAGIC %md ## Done
# MAGIC
# MAGIC The Lakebase `dicom_frames` table is now populated.  On the next server
# MAGIC restart the DICOMweb gateway will:
# MAGIC 1. Call `get_preload_priority_list()` to retrieve the ranked file list.
# MAGIC 2. Load BOT entries into the in-memory `BOTCache` from Lakebase (tier 2)
# MAGIC    until the RAM budget is exhausted.
# MAGIC 3. Serve all subsequent frame requests from tier 1 or 2, never
# MAGIC    computing BOT on-demand again (tier 3 only for brand-new files).
