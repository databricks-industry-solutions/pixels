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
--   1. Admin populates ``pixels.access_rules`` with group → filter mappings
--      that mirror the Unity Catalog row filter logic.
--   2. Admin populates ``pixels.user_groups`` (manually or via
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
--   Run AFTER CREATE_LAKEBASE_SCHEMA.sql, CREATE_LAKEBASE_DICOM_FRAMES.sql,
--   and CREATE_LAKEBASE_INSTANCE_PATHS.sql.
--
-- Activation:
--   Set env var LAKEBASE_RLS_ENABLED=true on the Databricks App.
-- =====================================================================================


-- =====================================================================================
-- 1. Access Rules — admin-managed mirror of UC row filter logic
-- =====================================================================================

CREATE TABLE IF NOT EXISTS pixels.access_rules (
    uc_table_name   TEXT    NOT NULL,
    group_name      TEXT    NOT NULL,
    access_type     TEXT    NOT NULL DEFAULT 'full',
    uc_filter_sql   TEXT,
    description     TEXT,
    PRIMARY KEY (uc_table_name, group_name)
);

COMMENT ON TABLE pixels.access_rules IS
'Admin-managed mapping of Databricks account groups to UC table access patterns. '
'Mirrors Unity Catalog row filter logic for Lakebase RLS enforcement.';

COMMENT ON COLUMN pixels.access_rules.uc_table_name IS
'Fully qualified Unity Catalog table name (catalog.schema.table).';

COMMENT ON COLUMN pixels.access_rules.group_name IS
'Databricks account group name (must match the group used in UC row filters).';

COMMENT ON COLUMN pixels.access_rules.access_type IS
'''full'' = group can see ALL rows in the UC table. '
'''conditional'' = group can only see rows matching uc_filter_sql.';

COMMENT ON COLUMN pixels.access_rules.uc_filter_sql IS
'Unity Catalog SQL WHERE clause for conditional access.  Used by the sync job '
'to compute per-row allowed_groups.  '
'Example for de-identified data only:  meta:[''00120063''].Value[0] IS NOT NULL';


-- =====================================================================================
-- 2. User Groups — maps Databricks user emails to group memberships
-- =====================================================================================

CREATE TABLE IF NOT EXISTS pixels.user_groups (
    user_email  TEXT        NOT NULL,
    group_name  TEXT        NOT NULL,
    synced_at   TIMESTAMP   NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_email, group_name)
);

CREATE INDEX IF NOT EXISTS idx_user_groups_email
    ON pixels.user_groups (user_email);

COMMENT ON TABLE pixels.user_groups IS
'Maps Databricks user emails to their account group memberships.  '
'Populated by LakebaseUtils.sync_user_groups_from_databricks() or manually.  '
'Queried at request time to resolve the current user''s groups for RLS.';


-- =====================================================================================
-- 3. Add allowed_groups column to existing cache tables
-- =====================================================================================
-- Default is '{}' (empty array) = unrestricted for backward compatibility.

ALTER TABLE pixels.instance_paths
    ADD COLUMN IF NOT EXISTS allowed_groups TEXT[] NOT NULL DEFAULT '{}';

ALTER TABLE pixels.dicom_frames
    ADD COLUMN IF NOT EXISTS allowed_groups TEXT[] NOT NULL DEFAULT '{}';

-- GIN indexes accelerate the && (array overlap) operator used in RLS policies.
CREATE INDEX IF NOT EXISTS idx_instance_paths_groups
    ON pixels.instance_paths USING GIN (allowed_groups);

CREATE INDEX IF NOT EXISTS idx_dicom_frames_groups
    ON pixels.dicom_frames USING GIN (allowed_groups);


-- =====================================================================================
-- 4. Enable Row-Level Security on cache tables
-- =====================================================================================
-- FORCE ensures even the table owner (service principal) is subject to RLS.

ALTER TABLE pixels.instance_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE pixels.instance_paths FORCE ROW LEVEL SECURITY;

ALTER TABLE pixels.dicom_frames ENABLE ROW LEVEL SECURITY;
ALTER TABLE pixels.dicom_frames FORCE ROW LEVEL SECURITY;


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

-- ── instance_paths ──────────────────────────────────────────────────────

DROP POLICY IF EXISTS rls_select_instance_paths ON pixels.instance_paths;
CREATE POLICY rls_select_instance_paths ON pixels.instance_paths
    FOR SELECT
    USING (
        allowed_groups = '{}'::text[]
        OR allowed_groups && string_to_array(
            current_setting('app.user_groups', true), ','
        )::text[]
    );

-- Allow all writes (the application writes on behalf of authorized users).
DROP POLICY IF EXISTS rls_insert_instance_paths ON pixels.instance_paths;
CREATE POLICY rls_insert_instance_paths ON pixels.instance_paths
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS rls_update_instance_paths ON pixels.instance_paths;
CREATE POLICY rls_update_instance_paths ON pixels.instance_paths
    FOR UPDATE
    USING (true);

-- ── dicom_frames ────────────────────────────────────────────────────────

DROP POLICY IF EXISTS rls_select_dicom_frames ON pixels.dicom_frames;
CREATE POLICY rls_select_dicom_frames ON pixels.dicom_frames
    FOR SELECT
    USING (
        allowed_groups = '{}'::text[]
        OR allowed_groups && string_to_array(
            current_setting('app.user_groups', true), ','
        )::text[]
    );

DROP POLICY IF EXISTS rls_insert_dicom_frames ON pixels.dicom_frames;
CREATE POLICY rls_insert_dicom_frames ON pixels.dicom_frames
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS rls_update_dicom_frames ON pixels.dicom_frames;
CREATE POLICY rls_update_dicom_frames ON pixels.dicom_frames
    FOR UPDATE
    USING (true);

