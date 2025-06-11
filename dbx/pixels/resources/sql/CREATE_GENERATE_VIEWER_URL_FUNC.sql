CREATE OR REPLACE FUNCTION generate_viewer_url(modality STRING, viewer_host STRING, StudyInstanceUID STRING) RETURNS STRING
RETURN
CASE 
    WHEN modality = 'CT' THEN concat('<a target="_blank" rel="noopener noreferrer" href="',viewer_host,'/ohif/monai-label?StudyInstanceUIDs=',StudyInstanceUID,'">view</a>')
    ELSE concat('<a target="_blank" rel="noopener noreferrer" href="',viewer_host,'/ohif/viewer?StudyInstanceUIDs=',StudyInstanceUID,'">view</a>') 
END