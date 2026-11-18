CREATE TABLE IF NOT EXISTS {UC_TABLE} (
  path STRING NOT NULL COMMENT 'File path',
  study_uid STRING COMMENT 'DICOM Study Instance UID (0020,000D) - a globally unique identifier that identifies a specific study, linking all series and images acquired during a single imaging examination',
  series_uid STRING COMMENT 'DICOM Series Instance UID (0020,000E) - a globally unique identifier that identifies a specific series within a study, grouping all images acquired in a single continuous scan or acquisition sequence', 
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
COMMENT "The 'object_catalog' table is used to index all DICOM images and zip files containing series of images. The table contains metadata about various objects in the 'pixels_solacc' dataset. It includes details such as the file path, modification time, file size, and file extension. Additionally, it provides information about the object's tags and metadata. This table can be used to manage and organize the catalog of objects, as well as to perform various analyses on the data. For instance, it can be used to identify the most recently modified objects or to filter objects based on their tags."
CLUSTER BY (study_uid)
TBLPROPERTIES (
  'delta.enableDeletionVectors' = 'true',
  'delta.feature.deletionVectors' = 'supported',
  'delta.minReaderVersion' = '3',
  'delta.minWriterVersion' = '7')