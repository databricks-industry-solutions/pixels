-- =====================================================================================
-- INSTANCE_PATHS Table Definition
-- =====================================================================================
--
-- Purpose:
--   Persistent cache for SOP Instance UID → file path mappings.
--   After a QIDO-RS query resolves instance paths from the SQL warehouse,
--   the results are stored here so that subsequent WADO-RS requests
--   (even after an app restart) can skip the warehouse query entirely.
--
-- Cache hierarchy (mirrors the DICOM_FRAMES pattern):
--   Tier 1 — In-memory InstancePathCache  (µs)
--   Tier 2 — This Lakebase table          (ms)
--   Tier 3 — SQL warehouse query          (~300 ms)
--
-- Data Flow:
--   1. QIDO-RS returns instance metadata from the SQL warehouse
--   2. Paths are written here in bulk (batch insert)
--   3. WADO-RS checks this table on an in-memory cache miss
--   4. On a hit the result is promoted to the in-memory cache
--
-- Performance Considerations:
--   - Primary key on sop_instance_uid enables O(1) lookups
--   - Composite index on (study_uid, series_uid) accelerates series-level bulk loads
--   - ON CONFLICT DO NOTHING makes batch inserts idempotent
-- =====================================================================================

CREATE TABLE IF NOT EXISTS pixels.instance_paths (
    sop_instance_uid    TEXT    NOT NULL,
    study_instance_uid  TEXT    NOT NULL,
    series_instance_uid TEXT    NOT NULL,
    local_path          TEXT    NOT NULL,
    num_frames          INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (sop_instance_uid)
);

CREATE INDEX IF NOT EXISTS idx_instance_paths_series
    ON pixels.instance_paths (study_instance_uid, series_instance_uid);

-- =====================================================================================
-- PostgreSQL Native Comments
-- =====================================================================================

COMMENT ON TABLE pixels.instance_paths IS
'Persistent cache mapping DICOM SOP Instance UIDs to their file paths on Databricks Volumes. Eliminates SQL warehouse queries for repeated WADO-RS instance retrieval, surviving app restarts.';

COMMENT ON COLUMN pixels.instance_paths.sop_instance_uid IS
'Globally unique DICOM SOP Instance UID — primary cache key.';

COMMENT ON COLUMN pixels.instance_paths.study_instance_uid IS
'Study Instance UID the instance belongs to. Used for series-level index lookups.';

COMMENT ON COLUMN pixels.instance_paths.series_instance_uid IS
'Series Instance UID the instance belongs to. Used with study UID for series-level bulk lookups.';

COMMENT ON COLUMN pixels.instance_paths.local_path IS
'Full file path on Databricks Volumes (e.g. /Volumes/catalog/schema/volume/path/file.dcm).';

COMMENT ON COLUMN pixels.instance_paths.num_frames IS
'Number of frames in the DICOM file (default 1 for single-frame images).';
