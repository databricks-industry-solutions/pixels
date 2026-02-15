CREATE TABLE IF NOT EXISTS {UC_SCHEMA}.stow_operations (
  file_id          STRING    NOT NULL  COMMENT 'UUID assigned at upload time — one per STOW-RS request',
  volume_path      STRING    NOT NULL  COMMENT 'Full /Volumes/... path to the temp multipart bundle (.mpr)',
  file_size        BIGINT    NOT NULL  COMMENT 'Size in bytes of the uploaded multipart bundle',
  upload_timestamp TIMESTAMP NOT NULL  COMMENT 'Server-side timestamp when the upload was received',
  study_constraint STRING               COMMENT 'Study Instance UID constraint from the STOW URL (if any)',
  content_type     STRING               COMMENT 'Full Content-Type header including boundary (e.g. multipart/related boundary=...)',
  client_ip        STRING               COMMENT 'Client IP address for auditing',
  user_email       STRING               COMMENT 'Email of the user who uploaded (from X-Forwarded-Email or SCIM /Me)',
  user_agent       STRING               COMMENT 'User-Agent header of the uploading client',
  status           STRING    NOT NULL   COMMENT 'Processing state: pending -> completed | failed',
  processed_at     TIMESTAMP            COMMENT 'Timestamp when the Spark job finished processing this bundle',
  error_message    STRING               COMMENT 'Error details if processing failed'
)
USING delta
CLUSTER BY (file_id)
COMMENT 'Tracks every STOW-RS upload (one row per multipart request) for auditing and as the input queue for the incremental Spark ingestion job. The Spark job splits the bundle, extracts DICOMs, saves them individually, and registers metadata in the catalog.'
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