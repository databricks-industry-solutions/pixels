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
    PRIMARY KEY (filename, frame, uc_table_name)
);

-- Add the column to existing tables that predate this definition.
ALTER TABLE {schema_name}.dicom_frames
    ADD COLUMN IF NOT EXISTS transfer_syntax_uid TEXT;

-- Optimised for the batch BOT preload query pattern:
--   WHERE uc_table_name = %s AND filename IN (%s, %s, ...)
-- The uc_table_name prefix lets PostgreSQL satisfy both conditions
-- from a single index prefix scan instead of N scans with post-filters.
CREATE INDEX IF NOT EXISTS idx_dicom_frames_uc_filename
    ON {schema_name}.dicom_frames (uc_table_name, filename);

-- NOTE: The old idx_dicom_frames_filename (on filename alone) is a strict
-- prefix of the PK and is therefore redundant.  Drop it to save disk space
-- and insert overhead.
DROP INDEX IF EXISTS {schema_name}.idx_dicom_frames_filename;


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
