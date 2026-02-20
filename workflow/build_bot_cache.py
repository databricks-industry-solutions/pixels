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

# MAGIC %pip install psycopg2-binary pydicom --quiet
# MAGIC dbutils.library.restartPython()

# COMMAND ----------

dbutils.widgets.text("table", "main.pixels_solacc.object_catalog",
                     "UC pixels table (catalog.schema.table)")
dbutils.widgets.text("lakebase_instance", "pixels-lakebase",
                     "Lakebase instance name")
dbutils.widgets.text("skip_existing", "true",
                     "Skip files already cached (true/false)")
dbutils.widgets.text("priority_limit", "500",
                     "Top-N files to show in preload preview")

# COMMAND ----------

table = dbutils.widgets.get("table")
lakebase_instance = dbutils.widgets.get("lakebase_instance")
skip_existing = dbutils.widgets.get("skip_existing").lower() == "true"
priority_limit = int(dbutils.widgets.get("priority_limit"))

print(f"Target table     : {table}")
print(f"Lakebase instance: {lakebase_instance}")
print(f"Skip existing    : {skip_existing}")

# COMMAND ----------

# MAGIC %md ## Step 1 — Run BOTCacheBuilder

# COMMAND ----------

from dbx.pixels.dicom.cache import BOTCacheBuilder

df = spark.read.table(table)

result_df = (
    BOTCacheBuilder(
        uc_table_name=table,
        lakebase_instance_name=lakebase_instance,
        skip_existing=skip_existing,
    )
    .transform(df)
)

# Trigger computation and cache results for the summary below.
result_df.cache()
result_df.count()

# COMMAND ----------

# MAGIC %md ## Step 2 — Summary

# COMMAND ----------

from pyspark.sql.functions import col, get_json_object

summary = (
    result_df
    .withColumn("status", get_json_object(col("bot_cache_status"), "$.status"))
    .groupBy("status")
    .count()
    .orderBy("status")
)

display(summary)

# COMMAND ----------

# Error details — inspect any failures.
errors = (
    result_df
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

# MAGIC %md ## Step 3 — Persist cache log (optional)
# MAGIC
# MAGIC Append the per-file status to a Delta log table for auditing and
# MAGIC incremental re-runs. The `status` column can be used to filter only
# MAGIC failed files in a subsequent run.

# COMMAND ----------

log_table = table + "_bot_cache_log"

(
    result_df
    .select(
        col("local_path"),
        col("bot_cache_status"),
        col("modificationTime"),
    )
    .write
    .mode("append")
    .option("mergeSchema", "true")
    .saveAsTable(log_table)
)

print(f"Cache log written to: {log_table}")

# COMMAND ----------

# MAGIC %md ## Step 4 — Preload priority preview
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

priority_df = spark.createDataFrame(
    [
        {
            "filename":            p["filename"],
            "frame_count":         p["frame_count"],
            "transfer_syntax_uid": p["transfer_syntax_uid"],
            "last_used_at":        str(p["last_used_at"]) if p["last_used_at"] else None,
            "inserted_at":         str(p["inserted_at"]) if p["inserted_at"] else None,
            "access_count":        p["access_count"],
            "priority_score":      round(p["priority_score"], 4),
        }
        for p in priority_list
    ]
)

display(priority_df.orderBy(col("priority_score").desc()))

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
