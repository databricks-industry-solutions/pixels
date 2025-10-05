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
--   - Composite primary key (filename, frame) enables efficient frame lookups
--   - Integer positions allow for fast byte-range operations
--   - Table supports high-volume medical imaging workloads
-- =====================================================================================

CREATE TABLE IF NOT EXISTS DICOM_FRAMES (
    filename TEXT NOT NULL,
    frame INTEGER NOT NULL,
    start_pos INTEGER NOT NULL,
    end_pos INTEGER NOT NULL,
    pixel_data_pos INTEGER NOT NULL,
    PRIMARY KEY (filename, frame)
);

-- =====================================================================================
-- PostgreSQL Native Comments for DICOM_FRAMES Table and Columns
-- =====================================================================================

-- Table-level comment describing the overall purpose and context
COMMENT ON TABLE DICOM_FRAMES IS 
'Stores frame-level metadata for DICOM (Digital Imaging and Communications in Medicine) files to enable efficient random access to individual frames within multi-frame DICOM images. This table supports the lakehouse architecture for medical imaging data by providing byte-level positioning information for frame extraction. Used for fast frame retrieval, OHIF viewer partial frame loading, and integration with Databricks lakehouse for scalable medical imaging workflows.';

-- Column-level comments providing detailed field descriptions
COMMENT ON COLUMN DICOM_FRAMES.filename IS 
'File identifier: Full path or unique name of the DICOM file. Used to associate frame metadata with the source DICOM file for efficient lookups and data organization.';

COMMENT ON COLUMN DICOM_FRAMES.frame IS 
'Frame number: Zero-based index of the frame within the DICOM file. Multi-frame DICOM files can contain hundreds or thousands of frames, each uniquely identified by this sequential number.';

COMMENT ON COLUMN DICOM_FRAMES.start_pos IS 
'Start position: Byte offset where the frame data begins in the DICOM file. Enables direct seeking to frame start for efficient partial reads without parsing the entire file.';

COMMENT ON COLUMN DICOM_FRAMES.end_pos IS 
'End position: Byte offset where the frame data ends in the DICOM file. Combined with start_pos, defines the exact byte range for frame extraction and streaming operations.';

COMMENT ON COLUMN DICOM_FRAMES.pixel_data_pos IS 
'Pixel data position: Byte offset of the actual pixel data within the frame. Points to the compressed or uncompressed image data, skipping DICOM headers and metadata for direct image access.';