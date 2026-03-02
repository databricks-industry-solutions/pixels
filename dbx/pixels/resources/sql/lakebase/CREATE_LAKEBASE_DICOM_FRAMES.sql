-- =====================================================================================
-- DICOM_FRAMES Table Definition
-- =====================================================================================
--
-- Purpose:
--   Stores frame-level metadata for DICOM (Digital Imaging and Communications in Medicine)
--   files to enable efficient random access to individual frames within multi-frame DICOM images.
--   This table supports the lakehouse architecture for medical imaging data by providing
--   byte-level positioning information for frame extraction.
--
-- Use Cases:
--   - Fast frame retrieval from multi-frame DICOM files without full file parsing
--   - Support for OHIF viewer partial frame loading
--   - Optimization of medical image streaming and display
--   - Integration with Databricks lakehouse for scalable medical imaging workflows
--
-- Data Flow:
--   1. DICOM files are ingested and parsed
--   2. Frame boundaries and pixel data positions are extracted
--   3. Metadata is stored in this table for efficient frame access
--   4. Applications can directly seek to specific frame positions
--
-- Performance Considerations:
--   - Composite primary key (filename, frame, uc_table_name) enables efficient frame lookups
--   - Integer positions allow for fast byte-range operations
--   - The (uc_table_name, filename) index accelerates batch lookups by series
--     (WHERE uc_table_name = ... AND filename IN (...)) used during BOT preloading
--   - transfer_syntax_uid is denormalized per-frame to avoid an extra HTTP
--     round-trip per file when populating the in-memory BOT cache from Lakebase
--   - Table supports high-volume medical imaging workloads
--
-- Schema Alignment:
--   The schema name is derived from the UC table's schema portion so that
--   Reverse ETL Sync can map catalog.schema.table → lakebase schema.table.
--
-- Usage:  .format(schema_name=<uc_schema>)  before executing.
-- =====================================================================================

CREATE TABLE IF NOT EXISTS {schema_name}.dicom_frames (
    filename TEXT NOT NULL,
    frame INTEGER NOT NULL,
    start_pos BIGINT NOT NULL,
    end_pos BIGINT NOT NULL,
    pixel_data_pos INTEGER NOT NULL,
    uc_table_name TEXT NOT NULL,
    transfer_syntax_uid TEXT,
    -- Cache-metadata columns — used by CachePriorityScorer for in-memory preload ranking.
    inserted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ,
    access_count BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (filename, frame, uc_table_name)
);

-- Add columns to existing tables that predate this definition.
ALTER TABLE {schema_name}.dicom_frames
    ADD COLUMN IF NOT EXISTS transfer_syntax_uid TEXT;

ALTER TABLE {schema_name}.dicom_frames
    ADD COLUMN IF NOT EXISTS inserted_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE {schema_name}.dicom_frames
    ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMPTZ;

ALTER TABLE {schema_name}.dicom_frames
    ADD COLUMN IF NOT EXISTS access_count BIGINT NOT NULL DEFAULT 0;

-- Optimised for the batch BOT preload query pattern:
--   WHERE uc_table_name = %s AND filename IN (%s, %s, ...)
-- The uc_table_name prefix lets PostgreSQL satisfy both conditions
-- from a single index prefix scan instead of N scans with post-filters.
CREATE INDEX IF NOT EXISTS idx_dicom_frames_uc_filename
    ON {schema_name}.dicom_frames (uc_table_name, filename);

-- Accelerates the CachePriorityScorer preload query:
--   GROUP BY filename, ORDER BY priority_score DESC, WHERE uc_table_name = %s
-- Storing (uc_table_name, last_used_at, access_count) lets PostgreSQL satisfy
-- the WHERE and provide statistics for the decay ordering from a single scan.
CREATE INDEX IF NOT EXISTS idx_dicom_frames_uc_cache_meta
    ON {schema_name}.dicom_frames (uc_table_name, last_used_at, access_count);


-- =====================================================================================
-- PostgreSQL Native Comments for dicom_frames Table and Columns
-- =====================================================================================

COMMENT ON TABLE {schema_name}.dicom_frames IS
'Stores frame-level metadata for DICOM (Digital Imaging and Communications in Medicine) files to enable efficient random access to individual frames within multi-frame DICOM images. This table supports the lakehouse architecture for medical imaging data by providing byte-level positioning information for frame extraction. Used for fast frame retrieval, OHIF viewer partial frame loading, and integration with Databricks lakehouse for scalable medical imaging workflows.';

COMMENT ON COLUMN {schema_name}.dicom_frames.filename IS
'File identifier: Full path or unique name of the DICOM file. Used to associate frame metadata with the source DICOM file for efficient lookups and data organization.';

COMMENT ON COLUMN {schema_name}.dicom_frames.frame IS
'Frame number: Zero-based index of the frame within the DICOM file. Multi-frame DICOM files can contain hundreds or thousands of frames, each uniquely identified by this sequential number.';

COMMENT ON COLUMN {schema_name}.dicom_frames.start_pos IS
'Start position: Byte offset where the frame data begins in the DICOM file. Enables direct seeking to frame start for efficient partial reads without parsing the entire file.';

COMMENT ON COLUMN {schema_name}.dicom_frames.end_pos IS
'End position: Byte offset where the frame data ends in the DICOM file. Combined with start_pos, defines the exact byte range for frame extraction and streaming operations.';

COMMENT ON COLUMN {schema_name}.dicom_frames.pixel_data_pos IS
'Pixel data position: Byte offset of the actual pixel data within the frame. Points to the compressed or uncompressed image data, skipping DICOM headers and metadata for direct image access.';

COMMENT ON COLUMN {schema_name}.dicom_frames.uc_table_name IS
'Unity Catalog table name: Fully qualified catalog.schema.table name of the source Unity Catalog table this frame data originates from. Enables multi-table support within the same Lakebase cache.';

COMMENT ON COLUMN {schema_name}.dicom_frames.transfer_syntax_uid IS
'DICOM Transfer Syntax UID (0002,0010) for the file. Denormalized per frame (same value for all frames in a file) so the in-memory BOT cache can be populated from Lakebase without an extra HTTP round-trip to read the DICOM file meta header.';

COMMENT ON COLUMN {schema_name}.dicom_frames.inserted_at IS
'Timestamp when this BOT row was first written to Lakebase by the BOTCacheBuilder Spark job. Used in CachePriorityScorer: recently inserted files receive a mild recency bonus (half-life ~1 week).';

COMMENT ON COLUMN {schema_name}.dicom_frames.last_used_at IS
'Timestamp of the last time this file''s BOT was retrieved by the DICOMweb server from Lakebase. NULL when pre-populated by the Spark job but never yet served. Used in CachePriorityScorer with a 1-day half-life decay.';

COMMENT ON COLUMN {schema_name}.dicom_frames.access_count IS
'Cumulative number of times this file''s BOT has been served from Lakebase. Incremented atomically by LakebaseUtils.touch_frame_ranges(). Used in CachePriorityScorer via log10(1 + access_count).';
