-- Unified redaction tracking table for all imaging formats (DICOM, SVS, CZI, ...)
--
-- Extends CREATE_OBJECT_CATALOG_REDACTION.sql from the base dbx-pixels package:
--   * Three DICOM columns renamed to remove format-specific semantics:
--       redaction_json             → redaction_config
--       global_redactions_count    → metadata_redactions_count
--       frame_specific_redactions_count → pixel_redactions_count
--   * New columns added (all nullable for backward compatibility with existing DICOM rows):
--       path, extension            — generic FK + format discriminator
--       has_phi, phi_elements,
--       vlm_raw_response,
--       model_endpoint             — VLM PHI detection results (applicable to all formats)
--       phi_tags_redacted          — metadata tags scrubbed (applicable to all formats)
--       label_image_path,
--       macro_image_path           — SVS sub-image audit artefacts (NULL for DICOM)
--
-- Format conventions:
--   DICOM rows: populate study/series UIDs, output_file_paths has one entry per .dcm slice,
--               label_image_path and macro_image_path are NULL
--   SVS rows:   study/series UIDs are NULL, output_file_paths[0] is the single TIFF output,
--               modality = 'WSI', label_image_path / macro_image_path point to audit PNGs

CREATE TABLE IF NOT EXISTS {UC_TABLE}_redaction (

  -- -----------------------------------------------------------------------
  -- Primary identifiers (format-agnostic)
  -- -----------------------------------------------------------------------
  redaction_id   STRING    NOT NULL COMMENT 'UUID assigned at job creation time',
  path           STRING             COMMENT 'Source file path — FK to object_catalog.path',
  extension      STRING             COMMENT 'Source format discriminator: dcm | svs | czi | …',

  -- -----------------------------------------------------------------------
  -- DICOM identifiers (NULL for non-DICOM formats)
  -- -----------------------------------------------------------------------
  study_instance_uid   STRING COMMENT 'DICOM Study Instance UID',
  series_instance_uid  STRING COMMENT 'DICOM Series Instance UID',
  modality             STRING COMMENT 'DICOM modality (CT, MR, US …) or WSI for whole-slide images',

  -- -----------------------------------------------------------------------
  -- Redaction configuration (format-agnostic VARIANT)
  -- Renamed from redaction_json → redaction_config for cross-format clarity
  -- -----------------------------------------------------------------------
  redaction_config VARIANT COMMENT 'Format-specific redaction instructions as VARIANT',

  -- -----------------------------------------------------------------------
  -- PHI detection results — VLM output, applicable to all formats
  -- -----------------------------------------------------------------------
  has_phi          BOOLEAN          COMMENT 'True if VLM detected PHI in pixel data',
  phi_elements     VARIANT          COMMENT 'Array of detected PHI regions: {type, value_hint, bbox}',
  vlm_raw_response STRING           COMMENT 'Raw response text from the VLM model',
  model_endpoint   STRING           COMMENT 'Name of the model serving endpoint used',
  phi_tags_redacted ARRAY<STRING>   COMMENT 'Metadata tag names whose values were scrubbed',

  -- -----------------------------------------------------------------------
  -- Redaction counts
  -- Renamed from DICOM-specific frame model to generic pixel/metadata model
  -- -----------------------------------------------------------------------
  metadata_redactions_count  INT COMMENT 'Number of metadata tag values overwritten (was global_redactions_count)',
  pixel_redactions_count     INT COMMENT 'Number of pixel-level redaction regions applied (was frame_specific_redactions_count)',
  total_redaction_areas      INT COMMENT 'Total redaction areas across metadata and pixels',

  -- -----------------------------------------------------------------------
  -- Output paths
  -- DICOM: one .dcm path per slice/frame
  -- SVS:   single-element array — output_file_paths[0] is the TIFF path
  -- -----------------------------------------------------------------------
  output_file_paths    ARRAY<STRING> COMMENT 'Output file paths. DICOM: one per slice. SVS: [tiff_path].',
  new_series_instance_uid STRING     COMMENT 'New Series Instance UID for redacted DICOM series (NULL for SVS)',

  -- -----------------------------------------------------------------------
  -- SVS-specific audit artefacts (NULL for DICOM)
  -- -----------------------------------------------------------------------
  label_image_path STRING COMMENT 'Path to de-identified label sub-image PNG (SVS only)',
  macro_image_path STRING COMMENT 'Path to de-identified macro sub-image PNG (SVS only)',

  -- -----------------------------------------------------------------------
  -- Processing status (format-agnostic — unchanged from DICOM original)
  -- -----------------------------------------------------------------------
  status                       STRING    NOT NULL COMMENT 'PENDING | PROCESSING | SUCCESS | FAILED',
  error_messages               ARRAY<STRING>      COMMENT 'Error details if processing failed',

  -- -----------------------------------------------------------------------
  -- Timestamps (format-agnostic — unchanged from DICOM original)
  -- -----------------------------------------------------------------------
  insert_timestamp             TIMESTAMP NOT NULL COMMENT 'When the record was initially created',
  update_timestamp             TIMESTAMP          COMMENT 'When the record was last updated',
  processing_start_timestamp   TIMESTAMP          COMMENT 'When processing started',
  processing_end_timestamp     TIMESTAMP          COMMENT 'When processing completed',
  processing_duration_seconds  DOUBLE             COMMENT 'Wall-clock processing time in seconds',

  -- -----------------------------------------------------------------------
  -- Audit (format-agnostic — unchanged from DICOM original)
  -- -----------------------------------------------------------------------
  created_by       STRING COMMENT 'User who created the redaction job',
  export_timestamp TIMESTAMP COMMENT 'When redaction annotations were exported'

)
USING delta
CLUSTER BY (redaction_id)
COMMENT 'Unified redaction tracking table for all imaging formats (DICOM, SVS, CZI, …). Extends the base object_catalog_redaction schema with VLM PHI detection results and SVS sub-image artefacts.'
TBLPROPERTIES (
  'delta.enableChangeDataFeed'           = 'true',
  'delta.enableDeletionVectors'          = 'true',
  'delta.feature.deletionVectors'        = 'supported',
  'delta.minReaderVersion'               = '3',
  'delta.minWriterVersion'               = '7',
  'delta.targetFileSize'                 = '256mb',
  'delta.autoOptimize.autoCompact'       = 'true',
  'delta.autoOptimize.optimizeWrite'     = 'true'
);
