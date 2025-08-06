CREATE TABLE IF NOT EXISTS object_catalog_autoseg_result (
  series_uid STRING NOT NULL COMMENT 'Unique identifier of the DICOM series used',
  result STRING COMMENT 'File location of the generated DICOM segmentation file',
  error STRING COMMENT 'Error message if the segmentation process fails')
USING delta
COMMENT 'Table storing results of the automatic segmentation process from the serving endpoint for DICOM series'
TBLPROPERTIES (
  'delta.enableDeletionVectors' = 'true',
  'delta.feature.deletionVectors' = 'supported',
  'delta.minReaderVersion' = '3',
  'delta.minWriterVersion' = '7',
  'delta.targetFileSize' = '1mb',
  'delta.autoOptimize.autoCompact' = 'false')