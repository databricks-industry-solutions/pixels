CREATE TABLE IF NOT EXISTS {UC_SCHEMA}.nifti_segmentations (
  id                  STRING    NOT NULL  COMMENT 'Stable overlay identifier (UUID). Used by GET /nifti/fetch?id=...',
  study_instance_uid  STRING    NOT NULL  COMMENT 'DICOM Study Instance UID (0020,000D). Joins to object_catalog.',
  series_instance_uid STRING    NOT NULL  COMMENT 'DICOM Series Instance UID (0020,000E). Joins to object_catalog.',
  path                STRING    NOT NULL  COMMENT 'Full /Volumes/... path to the .nii.gz overlay file. Server-internal — never projected by /nifti/related.',
  file_size_bytes     BIGINT             COMMENT 'Size of the overlay file in bytes. Used for Content-Length on /nifti/fetch.',
  sha256              STRING             COMMENT 'Hex-encoded SHA-256 of the overlay file. Used as the ETag header on /nifti/fetch.',
  name                STRING             COMMENT 'Short human-readable label set name (e.g. "Vista3D lungs").',
  description         STRING             COMMENT 'Free-form description of the overlay shown in the OHIF panel.',
  label_info          VARIANT            COMMENT 'JSON object mapping label_index (int) → {name, color, ...}. Consumed verbatim by the OHIF NIfTI extension.',
  annotator           STRING             COMMENT 'Human or system identifier that produced the overlay (e.g. user email, "vista3d-auto").',
  source              STRING             COMMENT 'Pipeline / model that emitted the overlay (e.g. "monai-vista3d", "manual").',
  version             INT                COMMENT 'Monotonic per-(study,series) revision counter. Primary sort key for /nifti/related (DESC NULLS LAST).',
  status              STRING             COMMENT 'Lifecycle state: NULL or "approved" → visible; "draft" → visible; "archived" → hidden from /nifti/related. To change status, insert a new row with a higher version rather than updating in place.',
  created_at          TIMESTAMP          COMMENT 'When the overlay row was first inserted. Secondary sort key for /nifti/related (DESC) — tie-breaker when two rows share the same version.'
)
USING delta
CLUSTER BY (study_instance_uid, series_instance_uid)
COMMENT 'NIfTI segmentation overlays linked to DICOM (study, series) pairs. **Append-only** by contract: every change (new overlay, status flip, label re-mapping) is a new row with a higher version; existing rows are never UPDATEd or DELETEd by the application layer. Read-only surface for the DICOMweb gateway routes /api/dicomweb/nifti/related and /api/dicomweb/nifti/fetch. Rows are written by an external ingest pipeline (MONAI auto-seg, manual upload, etc.) — the gateway never writes to this table.'
TBLPROPERTIES (
  'delta.enableChangeDataFeed' = 'true',
  'delta.enableDeletionVectors' = 'true',
  'delta.feature.deletionVectors' = 'supported',
  'delta.feature.variantType-preview' = 'supported',
  'delta.minReaderVersion' = '3',
  'delta.minWriterVersion' = '7',
  'delta.targetFileSize' = '64mb',
  'delta.autoOptimize.autoCompact' = 'true',
  'delta.autoOptimize.optimizeWrite' = 'true'
);
