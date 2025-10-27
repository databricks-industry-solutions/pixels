-- DICOM Redaction Processing Table
-- This table stores redaction jobs and tracks their processing status

CREATE TABLE IF NOT EXISTS {UC_TABLE}_redaction (
  -- Primary identifiers
  redaction_id STRING NOT NULL COMMENT 'Unique identifier for this redaction job',
  file_path STRING NOT NULL COMMENT 'Path to the DICOM file to be redacted',
  
  -- DICOM identifiers
  study_instance_uid STRING COMMENT 'DICOM Study Instance UID',
  series_instance_uid STRING COMMENT 'DICOM Series Instance UID',
  sop_instance_uid STRING COMMENT 'DICOM SOP Instance UID',
  modality STRING COMMENT 'DICOM modality (e.g., CT, MR, US)',
  
  -- Redaction configuration
  redaction_json STRING COMMENT 'JSON string containing redaction instructions',
  global_redactions_count INT COMMENT 'Number of global redactions to apply',
  frame_specific_redactions_count INT COMMENT 'Number of frame-specific redactions',
  total_redaction_areas INT COMMENT 'Total number of redaction areas',
  
  -- Output configuration
  volume_path STRING COMMENT 'Unity Catalog volume path for output',
  output_file_path STRING COMMENT 'Path to the redacted output file',
  new_series_instance_uid STRING COMMENT 'New Series Instance UID for redacted files',
  
  -- Processing status
  status STRING NOT NULL DEFAULT 'PENDING' COMMENT 'Processing status: PENDING, SUCCESS, FAILED',
  error_message STRING COMMENT 'Error message if processing failed',
  
  -- Timestamps
  insert_timestamp TIMESTAMP NOT NULL COMMENT 'When the record was initially created',
  update_timestamp TIMESTAMP COMMENT 'When the record was last updated',
  processing_start_timestamp TIMESTAMP COMMENT 'When processing started',
  processing_end_timestamp TIMESTAMP COMMENT 'When processing completed',
  processing_duration_seconds DOUBLE COMMENT 'Processing duration in seconds',
  
  -- Audit fields
  created_by STRING COMMENT 'User who created the redaction job',
  export_timestamp TIMESTAMP COMMENT 'When the redaction annotations were exported',
)
USING delta
CLUSTER BY (redaction_id)
COMMENT 'Table for managing DICOM redaction jobs with incremental processing and status tracking'
TBLPROPERTIES (
  'delta.enableChangeDataFeed' = 'true',
  'delta.enableDeletionVectors' = 'true',
  'delta.feature.deletionVectors' = 'supported',
  'delta.minReaderVersion' = '3',
  'delta.minWriterVersion' = '7',
  'delta.targetFileSize' = '256mb',
  'delta.autoOptimize.autoCompact' = 'true',
  'delta.autoOptimize.optimizeWrite' = 'true'
);