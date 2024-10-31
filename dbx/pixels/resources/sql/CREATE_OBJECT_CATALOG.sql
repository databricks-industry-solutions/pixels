CREATE TABLE IF NOT EXISTS {UC_TABLE} (
  path STRING,
  modificationTime TIMESTAMP,
  length BIGINT,
  original_path STRING,
  relative_path STRING,
  local_path STRING,
  extension STRING,
  file_type STRING,
  path_tags ARRAY<STRING>,
  is_anon BOOLEAN,
  meta STRING,
  thumbnail STRUCT<origin: STRING, height: INT, width: INT, nChannels: INT, mode: INT, data: BINARY>)
USING delta
TBLPROPERTIES (
  'delta.enableDeletionVectors' = 'true',
  'delta.feature.deletionVectors' = 'supported',
  'delta.minReaderVersion' = '3',
  'delta.minWriterVersion' = '7')