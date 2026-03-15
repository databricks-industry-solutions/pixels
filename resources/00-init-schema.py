# Databricks notebook source
# MAGIC %md
# MAGIC # Initialize Unity Catalog Schema, Volume, and Tables
# MAGIC
# MAGIC Lightweight setup task that creates the UC catalog, schema, volume, and
# MAGIC empty `object_catalog` table if they don't already exist. This must run
# MAGIC before any other install tasks so that notebooks calling `init_env()`
# MAGIC (which checks `spark.catalog.tableExists(table)`) don't fail.

# COMMAND ----------

%run ../config/setup

# COMMAND ----------

path, table, volume, write_mode = init_widgets()

# COMMAND ----------

# Create catalog, schema, and volume if they don't exist
init_catalog_schema_volume()

# COMMAND ----------

from dbx.pixels import Catalog

catalog = Catalog(spark, table=table, volume=volume)
catalog.init_tables()
print(f"Initialized: table={table}, volume={volume}")
