CREATE OR REPLACE FUNCTION {UC_SCHEMA}.generate_viewer_url(
  viewer_host STRING COMMENT "Databricks App URL for the viewer",
  modality STRING COMMENT "Modality type (e.g., CT, MRI)",
  ImageType STRING COMMENT "Image type (e.g. AXIAL)",
  StudyInstanceUID STRING COMMENT "Study Instance UID for the DICOM images, this is a viewer parameter"
  )
  RETURNS STRING
  COMMENT "Function to generate a viewer URL based on the image modality"
  RETURN CASE
    WHEN
      modality = 'CT' and ImageType LIKE '%AXIAL%'
    THEN
      concat(
        '<a target="_blank" rel="noopener noreferrer" href="',
        viewer_host,
        '/ohif/monai-label?StudyInstanceUIDs=',
        StudyInstanceUID,
        '">view</a>'
      )
    ELSE
      concat(
        '<a target="_blank" rel="noopener noreferrer" href="',
        viewer_host,
        '/ohif/viewer?StudyInstanceUIDs=',
        StudyInstanceUID,
        '">view</a>'
      )
  END