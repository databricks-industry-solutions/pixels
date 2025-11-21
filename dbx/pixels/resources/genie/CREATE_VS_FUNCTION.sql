CREATE OR REPLACE FUNCTION {UC_SCHEMA}.retrieve_dicom_tag(keyword STRING) RETURNS STRUCT<TAG STRING, KEYWORD STRING, VM STRING>
LANGUAGE SQL RETURN (
    SELECT
      struct(tag,
      keyword,
      VM)
    FROM
      VECTOR_SEARCH(
        index => "{UC_DICOM_TAGS_VS}",
        query_text => retrieve_dicom_tag.keyword,
        num_results => 1
      )
    LIMIT 1
);