-- Databricks notebook source
-- MAGIC %md
-- MAGIC # Initialize Unity Catalog Schema, Volume, and Tables
-- MAGIC
-- MAGIC Lightweight setup task that creates the UC catalog, schema, volume, and
-- MAGIC empty `object_catalog` table if they don't already exist. This must run
-- MAGIC before any other install tasks so that notebooks calling `init_env()`
-- MAGIC (which checks `spark.catalog.tableExists(table)`) don't fail.
-- MAGIC
-- MAGIC This notebook is self-contained — no dependency on `dbx.pixels`.

-- COMMAND ----------

-- DBTITLE 1,Derive Parameters
-- Job parameters (table, volume) are injected via ${param} interpolation.
-- No CREATE WIDGET needed — serverless does not support it.
DECLARE OR REPLACE VARIABLE uc_schema STRING DEFAULT split_part('${table}', '.', 1) || '.' || split_part('${table}', '.', 2);

SELECT uc_schema AS uc_schema, '${table}' AS `table`, '${volume}' AS volume;

-- COMMAND ----------

-- DBTITLE 1,Create Schema and Volume (catalog must already exist)
CREATE DATABASE IF NOT EXISTS IDENTIFIER(uc_schema);
CREATE VOLUME IF NOT EXISTS ${volume};

-- COMMAND ----------

-- DBTITLE 1,Create object_catalog table
CREATE TABLE IF NOT EXISTS ${table} (
  path STRING NOT NULL COMMENT 'File path',
  modificationTime TIMESTAMP NOT NULL COMMENT 'Last modification time',
  length BIGINT NOT NULL COMMENT 'File length in bytes',
  original_path STRING COMMENT 'Original file path, zip location in case of extractZip=True',
  relative_path STRING COMMENT 'Relative file path',
  local_path STRING NOT NULL COMMENT 'Local file path',
  extension STRING COMMENT 'File extension',
  file_type STRING COMMENT 'Type of file',
  path_tags ARRAY<STRING> COMMENT 'Tags associated with the file path',
  is_anon BOOLEAN COMMENT 'Indicates if the file is anonymized',
  meta VARIANT COMMENT 'DICOM header tags as VARIANT DATA TYPE'
)
USING delta
COMMENT "The 'object_catalog' table indexes DICOM images and zip files containing series of images."
TBLPROPERTIES (
  'delta.enableDeletionVectors' = 'true',
  'delta.feature.deletionVectors' = 'supported',
  'delta.minReaderVersion' = '3',
  'delta.minWriterVersion' = '7');

-- COMMAND ----------

-- DBTITLE 1,Create object_catalog_unzip table
CREATE TABLE IF NOT EXISTS ${table}_unzip (
  path STRING NOT NULL COMMENT 'Path of the extracted file from the zip in original_path',
  modificationTime TIMESTAMP NOT NULL COMMENT 'Creation timestamp of the zip file',
  length BIGINT NOT NULL COMMENT 'Size of the zip file',
  original_path STRING NOT NULL COMMENT 'Path of the zip file'
)
USING delta
COMMENT 'Mapping of each zip file and all the files extracted from it.'
TBLPROPERTIES (
  'delta.enableDeletionVectors' = 'true',
  'delta.feature.deletionVectors' = 'supported',
  'delta.minReaderVersion' = '3',
  'delta.minWriterVersion' = '7',
  'delta.targetFileSize' = '1mb',
  'delta.autoOptimize.autoCompact' = 'false');

-- COMMAND ----------

-- DBTITLE 1,Create object_catalog_autoseg_result table
CREATE TABLE IF NOT EXISTS ${table}_autoseg_result (
  series_uid STRING NOT NULL COMMENT 'Unique identifier of the DICOM series used',
  result STRING COMMENT 'File location of the generated DICOM segmentation file',
  error STRING COMMENT 'Error message if the segmentation process fails')
USING delta
COMMENT 'Results of the automatic segmentation process from the serving endpoint for DICOM series'
TBLPROPERTIES (
  'delta.enableDeletionVectors' = 'true',
  'delta.feature.deletionVectors' = 'supported',
  'delta.minReaderVersion' = '3',
  'delta.minWriterVersion' = '7',
  'delta.targetFileSize' = '1mb',
  'delta.autoOptimize.autoCompact' = 'false');

-- COMMAND ----------

-- DBTITLE 1,Create object_catalog_redaction table
CREATE TABLE IF NOT EXISTS ${table}_redaction (
  redaction_id STRING NOT NULL COMMENT 'Unique identifier for this redaction job',
  study_instance_uid STRING COMMENT 'DICOM Study Instance UID',
  series_instance_uid STRING COMMENT 'DICOM Series Instance UID',
  modality STRING COMMENT 'DICOM modality (e.g., CT, MR, US)',
  redaction_json VARIANT COMMENT 'JSON string containing redaction instructions',
  global_redactions_count INT COMMENT 'Number of global redactions to apply',
  frame_specific_redactions_count INT COMMENT 'Number of frame-specific redactions',
  total_redaction_areas INT COMMENT 'Total number of redaction areas',
  new_series_instance_uid STRING COMMENT 'New Series Instance UID for redacted files',
  output_file_paths ARRAY<STRING> COMMENT 'Paths to the redacted files',
  status STRING NOT NULL COMMENT 'Processing status: PENDING, SUCCESS, FAILED',
  error_messages ARRAY<STRING> COMMENT 'Error messages if processing failed',
  insert_timestamp TIMESTAMP NOT NULL COMMENT 'When the record was initially created',
  update_timestamp TIMESTAMP COMMENT 'When the record was last updated',
  processing_start_timestamp TIMESTAMP COMMENT 'When processing started',
  processing_end_timestamp TIMESTAMP COMMENT 'When processing completed',
  processing_duration_seconds DOUBLE COMMENT 'Processing duration in seconds',
  created_by STRING COMMENT 'User who created the redaction job',
  export_timestamp TIMESTAMP COMMENT 'When the redaction annotations were exported'
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

-- COMMAND ----------

-- DBTITLE 1,Create stow_operations table
CREATE TABLE IF NOT EXISTS IDENTIFIER(uc_schema || '.stow_operations') (
  file_id          STRING    NOT NULL  COMMENT 'UUID assigned at upload time',
  volume_path      STRING    NOT NULL  COMMENT 'Full /Volumes/... path to the temp multipart bundle (.mpr)',
  file_size        BIGINT    NOT NULL  COMMENT 'Size in bytes of the uploaded multipart bundle',
  upload_timestamp TIMESTAMP NOT NULL  COMMENT 'Server-side timestamp when the upload was received',
  study_constraint STRING               COMMENT 'Study Instance UID constraint from the STOW URL (if any)',
  content_type     STRING               COMMENT 'Full Content-Type header including boundary',
  client_ip        STRING               COMMENT 'Client IP address for auditing',
  user_email       STRING               COMMENT 'Email of the user who uploaded',
  user_agent       STRING               COMMENT 'User-Agent header of the uploading client',
  status           STRING    NOT NULL   COMMENT 'Processing state: pending -> completed | failed',
  processed_at     TIMESTAMP            COMMENT 'Timestamp when the Spark job finished processing this bundle',
  output_paths     ARRAY<STRING>        COMMENT 'Paths to individual DICOM files extracted from the multipart bundle',
  error_message    STRING               COMMENT 'Error details if processing failed'
)
USING delta
CLUSTER BY (file_id)
COMMENT 'Tracks every STOW-RS upload (one row per multipart request).'
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

-- COMMAND ----------

-- DBTITLE 1,Create extract_tags function
CREATE OR REPLACE FUNCTION IDENTIFIER(uc_schema || '.extract_tags')(dicom_tags ARRAY<STRUCT<TAG STRING, KEYWORD STRING, VM STRING>>, meta STRING)
  RETURNS MAP<STRING,STRING>
  LANGUAGE PYTHON
  AS $$
    import json
    results = {}
    def extract_tags(dicom_tag, meta):
      result = {}
      try:
        meta_json = json.loads(meta)
      except:
        return {}
      dicom_tag_json = {"TAG": dicom_tag[0], "keyword": dicom_tag[1], "VM": dicom_tag[2]}
      key = dicom_tag_json["TAG"]
      if key in meta_json and 'Value' in meta_json[key]:
        if(dicom_tag_json['VM'] != '1'):
          result[dicom_tag_json['keyword']] = "<SEP>".join(meta_json[key]['Value'])
        else:
          result[dicom_tag_json['keyword']] = str(meta_json[key]['Value'][0])
      return result
    for tag in dicom_tags:
      results = results | extract_tags(tag, meta)
    return results
  $$;

-- COMMAND ----------

-- DBTITLE 1,Create extract_tag_value function
CREATE OR REPLACE FUNCTION IDENTIFIER(uc_schema || '.extract_tag_value')(dicom_tag STRUCT<TAG STRING, KEYWORD STRING, VM STRING>, meta STRING)
  RETURNS STRING
  LANGUAGE PYTHON
  AS $$
    import json
    try:
      meta_json = json.loads(meta)
    except:
      return None
    dicom_tag_json = {"TAG": dicom_tag[0], "keyword": dicom_tag[1], "VM": dicom_tag[2]}
    key = dicom_tag_json["TAG"]
    if key in meta_json and 'Value' in meta_json[key]:
      if(dicom_tag_json['VM'] != '1'):
        return "<SEP>".join(meta_json[key]['Value'])
      else:
        return str(meta_json[key]['Value'][0])
  $$;

-- COMMAND ----------

-- DBTITLE 1,Tag All Assets
ALTER SCHEMA IDENTIFIER(uc_schema) SET TAGS ('accelerator' = 'pixels');
ALTER TABLE ${table} SET TAGS ('accelerator' = 'pixels');
ALTER TABLE ${table}_unzip SET TAGS ('accelerator' = 'pixels');
ALTER TABLE ${table}_autoseg_result SET TAGS ('accelerator' = 'pixels');
ALTER TABLE ${table}_redaction SET TAGS ('accelerator' = 'pixels');
ALTER TABLE IDENTIFIER(uc_schema || '.stow_operations') SET TAGS ('accelerator' = 'pixels');

-- COMMAND ----------

-- DBTITLE 1,Done
SELECT 'All UC objects created successfully.' AS status, '${table}' AS `table`, '${volume}' AS volume;
