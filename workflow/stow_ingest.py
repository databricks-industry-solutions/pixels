# Databricks notebook source
# MAGIC %pip install -r ../requirements.txt

# COMMAND ----------

dbutils.library.restartPython()

# COMMAND ----------

from dbx.pixels import Catalog
from dbx.pixels.dicom import StowProcessor

# COMMAND ----------

# Parameters passed by the STOW-RS handler via notebook_params in run-now.
catalog_table = dbutils.widgets.get("catalog_table")
volume = dbutils.widgets.get("volume")

assert catalog_table, "catalog_table is required"
assert volume, "volume is required"

# Derive the stow_operations table from the catalog table's catalog.schema
_parts = catalog_table.split(".")
assert len(_parts) == 3, "catalog_table must be catalog.schema.table"
stow_table = f"{_parts[0]}.{_parts[1]}.stow_operations"

# Derive the volume path for checkpoints
volume_path = f"/Volumes/{volume.replace('.', '/')}"
checkpoint_location = f"{volume_path}/_checkpoints/stow_ingest/"

print(f"Catalog table       : {catalog_table}")
print(f"STOW tracking table : {stow_table}")
print(f"Volume              : {volume}")
print(f"Checkpoint location : {checkpoint_location}")

# COMMAND ----------

processor = StowProcessor(spark=spark)

query = processor.process_from_table(
    source_table=stow_table,
    catalog_table=catalog_table,
    volume=volume,
    checkpoint_location=checkpoint_location,
    trigger_available_now=True,
)

query.awaitTermination()
