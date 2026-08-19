-- =====================================================================================
-- Lakebase Schema (aligned to Unity Catalog schema)
-- =====================================================================================
--
-- The schema name is derived from the UC table's schema portion so that
-- Reverse ETL Sync can map catalog.schema.table → lakebase schema.table
-- directly.
--
-- All Lakebase cache tables live under this schema to avoid relying on
-- the default 'public' schema, which may have restricted permissions.
--
-- Usage:  .format(schema_name=<uc_schema>)  before executing.
-- =====================================================================================

CREATE SCHEMA IF NOT EXISTS {schema_name};

COMMENT ON SCHEMA {schema_name} IS
'Databricks Pixels cache schema — stores persistent DICOM frame offsets and instance path mappings for PACS-style sub-second retrieval. Schema aligned to Unity Catalog for Reverse ETL Sync support.';

