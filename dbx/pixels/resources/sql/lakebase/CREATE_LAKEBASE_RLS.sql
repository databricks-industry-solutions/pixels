-- =====================================================================================
-- Row-Level Security (RLS) Infrastructure for Pixels Lakebase Cache
-- =====================================================================================
--
-- Purpose:
--   Prevents cross-user data exfiltration when the in-memory and Lakebase
--   caches bypass Unity Catalog row filters.
--
-- How it works:
--   1. Each cached row carries an ``allowed_groups`` array listing which
--      Databricks account groups may access it.
--   2. Before every Lakebase query the application sets a transaction-local
--      variable:  SET LOCAL app.user_groups = 'group1,group2,...'
--   3. PostgreSQL RLS policies check that the user's groups overlap with
--      the row's allowed_groups — rows without overlap are invisible.
--
-- Sync workflow (admin-driven):
--   1. Admin populates ``<schema>.access_rules`` with group → filter mappings
--      that mirror the Unity Catalog row filter logic.
--   2. Admin populates ``<schema>.user_groups`` (manually or via
--      ``LakebaseUtils.sync_user_groups_from_databricks()``).
--   3. Admin runs the sync job: ``LakebaseUtils.sync_uc_row_filters(...)``
--      which queries UC for each rule, computes allowed_groups per cached
--      row, and updates the Lakebase tables.
--
-- Backward compatibility:
--   Rows with ``allowed_groups = '{}'`` (empty array) are treated as
--   unrestricted — visible to all users.  This means pre-existing cached
--   data remains accessible until the sync job tags it properly.
--
-- Prerequisites:
--   Run AFTER CREATE_LAKEBASE_SCHEMA.sql and CREATE_LAKEBASE_DICOM_FRAMES.sql.
--   instance_paths is created by the Reverse ETL pipeline (not at init time).
--
-- Activation:
--   Set env var LAKEBASE_RLS_ENABLED=true on the Databricks App.
--
-- Schema Alignment:
--   The schema name is derived from the UC table's schema portion so that
--   Reverse ETL Sync can map catalog.schema.table → lakebase schema.table.
--
-- Usage:  .format(schema_name=<uc_schema>)  before executing.
-- =====================================================================================


-- =====================================================================================
-- 1. Access Rules — admin-managed mirror of UC row filter logic
-- =====================================================================================

CREATE TABLE IF NOT EXISTS {schema_name}.access_rules (
    uc_table_name   TEXT    NOT NULL,
    group_name      TEXT    NOT NULL,
    access_type     TEXT    NOT NULL DEFAULT 'full',
    uc_filter_sql   TEXT,
    description     TEXT,
    PRIMARY KEY (uc_table_name, group_name)
);

COMMENT ON TABLE {schema_name}.access_rules IS
'Admin-managed mapping of Databricks account groups to UC table access patterns. '
'Mirrors Unity Catalog row filter logic for Lakebase RLS enforcement.';

COMMENT ON COLUMN {schema_name}.access_rules.uc_table_name IS
'Fully qualified Unity Catalog table name (catalog.schema.table).';

COMMENT ON COLUMN {schema_name}.access_rules.group_name IS
'Databricks account group name (must match the group used in UC row filters).';

COMMENT ON COLUMN {schema_name}.access_rules.access_type IS
'''full'' = group can see ALL rows in the UC table. '
'''conditional'' = group can only see rows matching uc_filter_sql.';

COMMENT ON COLUMN {schema_name}.access_rules.uc_filter_sql IS
'Unity Catalog SQL WHERE clause for conditional access.  Used by the sync job '
'to compute per-row allowed_groups.  '
'Example for de-identified data only:  meta:[''00120063''].Value[0] IS NOT NULL';


-- =====================================================================================
-- 2. User Groups — maps Databricks user emails to group memberships
-- =====================================================================================

CREATE TABLE IF NOT EXISTS {schema_name}.user_groups (
    user_email  TEXT        NOT NULL,
    group_name  TEXT        NOT NULL,
    synced_at   TIMESTAMP   NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_email, group_name)
);

CREATE INDEX IF NOT EXISTS idx_user_groups_email
    ON {schema_name}.user_groups (user_email);

COMMENT ON TABLE {schema_name}.user_groups IS
'Maps Databricks user emails to their account group memberships.  '
'Populated by LakebaseUtils.sync_user_groups_from_databricks() or manually.  '
'Queried at request time to resolve the current user''s groups for RLS.';


-- =====================================================================================
-- 3. Add allowed_groups column to existing cache tables
-- =====================================================================================
-- Default is '{}' (empty array) = unrestricted for backward compatibility.
-- NOTE: instance_paths is created by Reverse ETL; only dicom_frames is altered here.

ALTER TABLE {schema_name}.dicom_frames
    ADD COLUMN IF NOT EXISTS allowed_groups TEXT[] NOT NULL DEFAULT '{}';

-- GIN indexes accelerate the && (array overlap) operator used in RLS policies.
CREATE INDEX IF NOT EXISTS idx_dicom_frames_groups
    ON {schema_name}.dicom_frames USING GIN (allowed_groups);


-- =====================================================================================
-- 4. Enable Row-Level Security on cache tables
-- =====================================================================================
-- FORCE ensures even the table owner (service principal) is subject to RLS.

ALTER TABLE {schema_name}.dicom_frames ENABLE ROW LEVEL SECURITY;
ALTER TABLE {schema_name}.dicom_frames FORCE ROW LEVEL SECURITY;


-- =====================================================================================
-- 5. RLS Policies
-- =====================================================================================
-- The application sets before each query:
--   SET LOCAL app.user_groups = 'group1,group2,...'
--
-- Policy logic:
--   ALLOW if allowed_groups is empty (backward-compat / unrestricted rows)
--   OR    if the user's groups overlap with the row's allowed_groups.
--
-- When no SET LOCAL was done, current_setting returns '' (empty string),
-- which yields no overlap → synced rows are invisible.  Secure by default.

-- ── dicom_frames ────────────────────────────────────────────────────────

DROP POLICY IF EXISTS rls_select_dicom_frames ON {schema_name}.dicom_frames;
CREATE POLICY rls_select_dicom_frames ON {schema_name}.dicom_frames
    FOR SELECT
    USING (
        allowed_groups = '{}'::text[]
        OR allowed_groups && string_to_array(
            current_setting('app.user_groups', true), ','
        )::text[]
    );

DROP POLICY IF EXISTS rls_insert_dicom_frames ON {schema_name}.dicom_frames;
CREATE POLICY rls_insert_dicom_frames ON {schema_name}.dicom_frames
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS rls_update_dicom_frames ON {schema_name}.dicom_frames;
CREATE POLICY rls_update_dicom_frames ON {schema_name}.dicom_frames
    FOR UPDATE
    USING (true);
