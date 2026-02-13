-- =====================================================================================
-- PIXELS Schema
-- =====================================================================================
--
-- All Lakebase cache tables live under this schema to avoid relying on
-- the default 'public' schema, which may have restricted permissions.
-- =====================================================================================

CREATE SCHEMA IF NOT EXISTS pixels;

COMMENT ON SCHEMA pixels IS
'Databricks Pixels cache schema — stores persistent DICOM frame offsets and instance path mappings for PACS-style sub-second retrieval.';

