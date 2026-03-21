-- Databricks notebook source
-- MAGIC %md
-- MAGIC # Initialize Unity Catalog Schema, Volume, and Tables
-- MAGIC
-- MAGIC Lightweight setup task that creates the UC catalog, schema, volume, and
-- MAGIC empty tables if they don't already exist. Delegates all table and function
-- MAGIC creation to `Catalog.init_tables()`, which reads the `.sql` scripts in
-- MAGIC `dbx/pixels/resources/sql/`.
-- MAGIC
-- MAGIC This notebook is self-contained — requires only `dbx.pixels`.

-- COMMAND ----------

-- DBTITLE 1,Install missing dependency
-- MAGIC %pip install fsspec --quiet

-- COMMAND ----------

-- DBTITLE 1,Define input widgets
-- MAGIC %python
-- MAGIC dbutils.widgets.text("table", "main.pixels_solacc.object_catalog", "UC Table")
-- MAGIC dbutils.widgets.text("volume", "main.pixels_solacc.pixels_volume", "UC Volume")

-- COMMAND ----------

-- DBTITLE 1,Derive Parameters
-- MAGIC %python
-- MAGIC # Job parameters (table, volume) are injected via dbutils widgets.
-- MAGIC table = dbutils.widgets.get("table")
-- MAGIC volume = dbutils.widgets.get("volume")
-- MAGIC uc_schema = ".".join(table.split(".")[:2])
-- MAGIC
-- MAGIC # Create schema and volume (Catalog.init_tables does not handle these)
-- MAGIC spark.sql(f"CREATE DATABASE IF NOT EXISTS {uc_schema}")
-- MAGIC spark.sql(f"CREATE VOLUME IF NOT EXISTS {volume}")
-- MAGIC
-- MAGIC # Delegate all table and function creation to the .sql scripts
-- MAGIC from dbx.pixels import Catalog
-- MAGIC
-- MAGIC catalog = Catalog(spark, table=table, volume=volume)
-- MAGIC catalog.init_tables()
-- MAGIC
-- MAGIC print(f"All UC objects created successfully. table={table}, volume={volume}")
