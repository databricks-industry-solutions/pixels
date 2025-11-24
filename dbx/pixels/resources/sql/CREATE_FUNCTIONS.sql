CREATE or replace FUNCTION {UC_SCHEMA}.extract_tags(dicom_tags ARRAY<STRUCT<TAG STRING, KEYWORD STRING, VM STRING>>, meta STRING)
  RETURNS MAP<STRING,STRING>
  LANGUAGE PYTHON
  AS $$
    import json
    results = {}

    def extract_tags(dicom_tag, meta):
      result = {}

      meta_json = json.loads(meta)
      dicom_tag_json = {"TAG": dicom_tag[0], "keyword": dicom_tag[1], "VM": dicom_tag[2]}
      
      key = dicom_tag_json["TAG"]
      if key in meta_json and 'Value' in meta_json[key]:
        if(dicom_tag_json['VM'] != '1'):
          result[dicom_tag_json['keyword']] = "<SEP>".join(meta_json[key]['Value'])
        else:
          result[dicom_tag_json['keyword']] = str(meta_json[key]['Value'][0])

      return result

    for tag in dicom_tags:
      results = results | extract_tags(tag, meta) 

    return results
  $$;

CREATE or replace FUNCTION {UC_SCHEMA}.extract_tag_value(dicom_tag STRUCT<TAG STRING, KEYWORD STRING, VM STRING>, meta STRING)
  RETURNS STRING
  LANGUAGE PYTHON
  AS $$
    import json

    meta_json = json.loads(meta)
    dicom_tag_json = {"TAG": dicom_tag[0], "keyword": dicom_tag[1], "VM": dicom_tag[2]}
      
    key = dicom_tag_json["TAG"]
    if key in meta_json and 'Value' in meta_json[key]:
      if(dicom_tag_json['VM'] != '1'):
        return "<SEP>".join(meta_json[key]['Value'])
      else:
        return str(meta_json[key]['Value'][0])

  $$;
