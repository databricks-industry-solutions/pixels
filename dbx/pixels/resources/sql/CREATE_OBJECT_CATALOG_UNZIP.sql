CREATE TABLE IF NOT EXISTS object_catalog_unzip (
  path STRING NOT NULL COMMENT 'Path of the extracted file from the zip in original_path',
  modificationTime TIMESTAMP NOT NULL COMMENT 'Creation timestamp of the zip file',
  length BIGINT NOT NULL COMMENT 'Size of the zip file',
  original_path STRING NOT NULL COMMENT 'Path of the zip file'
)
USING delta
COMMENT 'This table maintains a detailed mapping of each zip file and all the files extracted from it, providing insights into the contents and origins of the zip files.'
TBLPROPERTIES (
  'delta.enableDeletionVectors' = 'true',
  'delta.feature.deletionVectors' = 'supported',
  'delta.minReaderVersion' = '3',
  'delta.minWriterVersion' = '7',
  'delta.targetFileSize' = '1mb',
  'delta.autoOptimize.autoCompact' = 'false')