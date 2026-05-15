-- =====================================================================================
-- Instance Paths View for Reverse ETL Sync
-- =====================================================================================
--
-- Purpose:
--   Creates a Unity Catalog view that projects the DICOM metadata from the
--   object_catalog table into the flat shape expected by the Lakebase
--   instance_paths table.  Databricks Reverse ETL Sync uses this view as
--   the source to materialise the instance_paths table in Lakebase,
--   keeping it continuously up-to-date without application-level writes.
--
-- DICOM tags used:
--   00080018  SOPInstanceUID          — primary cache key
--   0020000D  StudyInstanceUID        — study-level grouping
--   0020000E  SeriesInstanceUID       — series-level grouping
--   00280008  NumberOfFrames          — defaults to 1 for single-frame
--
-- Namespace alignment:
--   The view is created inside the same UC catalog.schema as the source
--   table so that Reverse ETL can sync it into the matching Lakebase
--   database.schema (catalog → database, schema → schema).
--
-- Usage:
--   Execute via spark.sql() after formatting with:
--     .format(catalog=<catalog>, schema=<schema>, table=<table>)
--
-- Example:
--   spark.sql(sql.format(
--       catalog="pixels_dicomweb", schema="tcia", table="object_catalog"
--   ))
--   → creates pixels_dicomweb.tcia.instance_paths_vw
-- =====================================================================================

CREATE OR REPLACE VIEW {catalog}.{schema}.instance_paths_vw AS
SELECT
    meta:['00080018'].Value[0]::STRING          AS sop_instance_uid,
    meta:['0020000D'].Value[0]::STRING          AS study_instance_uid,
    meta:['0020000E'].Value[0]::STRING          AS series_instance_uid,
    local_path,
    IFNULL(meta:['00280008'].Value[0]::INT, 1)  AS num_frames,
    '{catalog}.{schema}.{table}'                AS uc_table_name
FROM `{catalog}`.`{schema}`.`{table}`
WHERE meta:['00080018'].Value[0]::STRING IS NOT NULL;

