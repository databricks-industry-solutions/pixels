CREATE OR REPLACE FUNCTION {UC_SCHEMA}.cohort_builder( )
  RETURNS TABLE(
    PatientName STRING COMMENT 'Patients Name'
    ,PatientID STRING COMMENT 'Patient ID'
    ,PatientBirthDate DATE COMMENT 'Patient Birth Date'
    ,PatientAge INT COMMENT 'Patient Age'
    ,PatientSex STRING COMMENT 'Patient Sex'
    ,PatientWeight FLOAT COMMENT 'Patient Weight'
    ,PatientSize FLOAT COMMENT 'Patient Size'
    ,StudyDate DATE COMMENT 'Study Date'
    ,StudyTime STRING COMMENT 'Study Time'
    ,AccessionNumber STRING COMMENT 'Accession Number'
    ,Modality STRING COMMENT 'Modality'
    ,ImageType STRING COMMENT 'Image Type'
    ,StudyDescription STRING COMMENT 'Study Description'
    ,SeriesDescription STRING COMMENT 'Series Description'
    ,StudyInstanceUID STRING COMMENT 'Study Instance UID'
    ,SeriesInstanceUID STRING COMMENT 'Series Instance UID'
    ,StudyID STRING COMMENT 'Study ID'
    ,SeriesNumber STRING COMMENT 'Series Number'
    ,InstanceNumber STRING COMMENT 'Instance Number'
    ,BodyPartExamined STRING COMMENT 'Body Part Examined'
    ,ProtocolName STRING COMMENT 'Protocol Name'
    ,Manufacturer STRING COMMENT 'Manufacturer'
    ,InstitutionName STRING COMMENT 'Institution Name'
    ,InstitutionAddress STRING COMMENT 'Institution Address'
    ,DetectorManufacturerName STRING COMMENT 'Detector Manufacturer Name'
    ,DetectorManufacturersModelName STRING COMMENT 'Detector Manufacturers Model Name'
    ,MRTransmitCoilManufacturerName STRING COMMENT 'MR Transmit Coil Manufacturer Name'
    ,ReceiveCoilManufacturerName STRING COMMENT 'Receive Coil Manufacturer Name'
    ,DeidentificationMethod STRING COMMENT 'Deidentification Method'
    ,SyntheticData STRING COMMENT 'Synthetic Data'
    ,CodingSchemeVersion STRING COMMENT 'Coding Scheme Version'
    ,LossyImageCompression STRING COMMENT 'Lossy Image Compression'
    ,Creator STRING COMMENT 'Creator'
    ,pixel_hash STRING COMMENT 'Pixel Hash'
    ,`hash` STRING COMMENT 'File Hash'
    ,`path` STRING COMMENT 'Object Path on cloud storage'
    ,length INT COMMENT 'Size in bytes of the object on cloud storage'
    ,modificationTime TIMESTAMP COMMENT 'Modification time of the object on cloud storage'
    ,meta STRING COMMENT 'DICOM header tags as JSON string')
  LANGUAGE SQL
  DETERMINISTIC
  COMMENT "TVF wrapper around object_catalog"
  RETURN SELECT
    meta:['00100010'].Value[0].Alphabetic as PatientName,
    meta:['00100020'].Value[0] PatientID,
    to_date(meta:['00100030'].Value[0],'yyyyMMdd') as PatientBirthDate,
    cast(left(meta:['00101010'].Value[0],3) as int) as PatientAge,
    meta:['00100040'].Value[0] PatientSex,
    TRY_CAST(meta:['00101030'].Value[0] as FLOAT) as PatientWeight,
    TRY_CAST(meta:['00101020'].Value[0] as FLOAT) as PatientSize,
    to_date(meta:['00080020'].Value[0],'yyyyMMdd') as StudyDate,
    meta:['00080030'].Value[0] StudyTime,
    meta:['00080050'].Value[0] AccessionNumber,
    meta:['00080060'].Value[0] Modality,
    meta:['00080008'].Value[0] ImageType,
    meta:['00081030'].Value[0] StudyDescription,
    meta:['0008103E'].Value[0] SeriesDescription,
    meta:['0020000D'].Value[0] StudyInstanceUID,
    meta:['0020000E'].Value[0] SeriesInstanceUID,
    meta:['00200010'].Value[0] StudyID,
    meta:['00200011'].Value[0] SeriesNumber,
    meta:['00200013'].Value[0] InstanceNumber,
    meta:['00180015'].Value[0] BodyPartExamined,
    meta:['00181030'].Value[0] ProtocolName,
    meta:['00080070'].Value[0] Manufacturer,
    meta:['00080080'].Value[0] InstitutionName,
    meta:['00080081'].Value[0] InstitutionAddress,
    meta:['0018700A'].Value[0] DetectorManufacturerName,
    meta:['0018700B'].Value[0] DetectorManufacturersModelName,
    meta:['00189024'].Value[0] MRTransmitCoilManufacturerName,
    meta:['00189025'].Value[0] ReceiveCoilManufacturerName,
    meta:['00120063'].Value[0] DeidentificationMethod,
    meta:['0008001C'].Value[0] SyntheticData,
    meta:['00120064'].Value[0] CodingSchemeVersion,
    meta:['00282110'].Value[0] LossyImageCompression,
    meta:['00131010'].Value[0] Creator,
    meta:['pixel_hash'] pixel_hash,
    meta:['hash'] `hash`,
    `path`,
    length,
    modificationTime,
    meta
  from {UC_TABLE}