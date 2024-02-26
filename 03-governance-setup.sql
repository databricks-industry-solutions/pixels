-- Databricks notebook source
CREATE OR REPLACE VIEW douglas_moore.pixels_solacc.volume_catalog_vw AS
SELECT 
  path,
  meta,
  modificationTime,
  length,
  relative_path,
  local_path,
  extension,
  path_tags
FROM `douglas_moore`.`pixels_solacc`.`object_catalog`;

-- COMMAND ----------

select * FROM douglas_moore.pixels_solacc.volume_catalog_vw

-- COMMAND ----------


