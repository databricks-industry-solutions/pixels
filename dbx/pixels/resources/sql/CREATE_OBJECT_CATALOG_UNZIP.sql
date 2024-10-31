CREATE TABLE IF NOT EXISTS {UC_TABLE}_autoseg_result (
  image_id STRING,
  result STRING,
  error STRING)
USING delta
TBLPROPERTIES (
  'delta.enableDeletionVectors' = 'true',
  'delta.feature.deletionVectors' = 'supported',
  'delta.minReaderVersion' = '3',
  'delta.minWriterVersion' = '7',
  'delta.targetFileSize' = '1mb',
  'delta.autoOptimize.autoCompact' = 'false')