CREATE TABLE IF NOT EXISTS {UC_TABLE}_unzip (
  path STRING,
  modificationTime TIMESTAMP,
  length BIGINT,
  original_path STRING)
USING delta
TBLPROPERTIES (
  'delta.enableDeletionVectors' = 'true',
  'delta.feature.deletionVectors' = 'supported',
  'delta.minReaderVersion' = '3',
  'delta.minWriterVersion' = '7',
  'delta.targetFileSize' = '1mb',
  'delta.autoOptimize.autoCompact' = 'false')