# Databricks notebook source
# MAGIC %md #Access control using SQL

# COMMAND ----------

# MAGIC %sql
# MAGIC GRANT USE CATALOG ON CATALOG ema_rina TO `emanuele.rinaldi+nonadmin@databricks.com`;
# MAGIC GRANT USE SCHEMA ON SCHEMA ema_rina.pixels TO `emanuele.rinaldi+nonadmin@databricks.com`;
# MAGIC GRANT READ VOLUME ON VOLUME ema_rina.pixels.pixels_volume_anonym TO `emanuele.rinaldi+nonadmin@databricks.com`;

# COMMAND ----------

# MAGIC %sql
# MAGIC GRANT SELECT ON TABLE ema_rina.pixels.object_catalog TO `emanuele.rinaldi+nonadmin@databricks.com`;

# COMMAND ----------

# MAGIC %sql
# MAGIC REVOKE ALL PRIVILEGES  ON CATALOG ema_rina FROM `emanuele.rinaldi+nonadmin@databricks.com`;
# MAGIC REVOKE ALL PRIVILEGES  ON SCHEMA ema_rina.pixels FROM `emanuele.rinaldi+nonadmin@databricks.com`;
# MAGIC REVOKE SELECT ON TABLE ema_rina.pixels.object_catalog FROM `emanuele.rinaldi+nonadmin@databricks.com`;
# MAGIC REVOKE READ VOLUME ON VOLUME ema_rina.pixels.pixels_volume FROM `emanuele.rinaldi+nonadmin@databricks.com`;

# COMMAND ----------

# MAGIC %md #Access control using Python
# MAGIC
# MAGIC - Get all Tables and Volumes in the catalog **ema_rina** with tag **phi** and assign access to **pixels_phi** group
# MAGIC - Get all Tables and Volumes in the catalog **ema_rina** with tag **pixels_anonym** and assign access to **pixels_deidentified** group

# COMMAND ----------

catalog = "ema_rina"
user_or_group = "pixels_phi"
tag = "phi"

table_tags = spark.sql(f"select * from ema_rina.information_schema.table_tags where tag_name = '{tag}'").collect()
for table in table_tags:
    table_dic = table.asDict()
    spark.sql(f"GRANT USE CATALOG ON CATALOG {table_dic['catalog_name']} TO `{user_or_group}`;")
    spark.sql(f"GRANT USE SCHEMA ON SCHEMA {table_dic['catalog_name']}.{table_dic['schema_name']} TO `{user_or_group}`;")
    spark.sql(f"GRANT SELECT ON TABLE {table_dic['catalog_name']}.{table_dic['schema_name']}.{table_dic['table_name']} TO `{user_or_group}`;")

volume_tags = spark.sql(f"select * from ema_rina.information_schema.volume_tags where tag_name = '{tag}'").collect()
for volume in volume_tags:
    volume_dic = volume.asDict()
    spark.sql(f"GRANT READ VOLUME ON VOLUME {volume_dic['catalog_name']}.{volume_dic['schema_name']}.{volume_dic['volume_name']} TO `{user_or_group}`;")

# COMMAND ----------

catalog = "ema_rina"
user_or_group = "pixels_deidentified"
tag = "pixels_anonym"

table_tags = spark.sql(f"select * from ema_rina.information_schema.table_tags where tag_name = '{tag}'").collect()
for table in table_tags:
    table_dic = table.asDict()
    spark.sql(f"GRANT USE CATALOG ON CATALOG {table_dic['catalog_name']} TO `{user_or_group}`;")
    spark.sql(f"GRANT USE SCHEMA ON SCHEMA {table_dic['catalog_name']}.{table_dic['schema_name']} TO `{user_or_group}`;")
    spark.sql(f"GRANT SELECT ON TABLE {table_dic['catalog_name']}.{table_dic['schema_name']}.{table_dic['table_name']} TO `{user_or_group}`;")

volume_tags = spark.sql(f"select * from ema_rina.information_schema.volume_tags where tag_name = '{tag}'").collect()
for volume in volume_tags:
    volume_dic = volume.asDict()
    spark.sql(f"GRANT READ VOLUME ON VOLUME {volume_dic['catalog_name']}.{volume_dic['schema_name']}.{volume_dic['volume_name']} TO `{user_or_group}`;")

# COMMAND ----------

# MAGIC %sql 
# MAGIC -- Shared clusters will not be able to process images in notebooks, remove thumbnail column
# MAGIC select * except (thumbnail)  from ema_rina.pixels.object_catalog

# COMMAND ----------

# MAGIC %md #Row filters and Column Mask via Dynamic Views
# MAGIC
# MAGIC We are going to create a Dynamic View with row filter based on Institute Name Attribute
# MAGIC https://dicom.innolitics.com/ciods/rt-plan/rt-series/00081072/00080080
# MAGIC
# MAGIC The user emanuele.rinaldi@databricks.com is part of group **pixels_phi**
# MAGIC
# MAGIC The user emanuele.rinaldi+nonadmin@databricks.com is part of group **pixels_deidentified**

# COMMAND ----------

# DBTITLE 1,Search all the institute name available in catalog
# MAGIC %sql
# MAGIC select distinct(meta:['00120063'].Value[0]) `DeIndentification Method` from ema_rina.pixels.object_catalog

# COMMAND ----------

# DBTITLE 1,Dynamic View with condition on rows
# MAGIC %sql
# MAGIC create or replace view ema_rina.pixels.dicom_filtered as select * from ema_rina.pixels.object_catalog
# MAGIC WHERE
# MAGIC    CASE
# MAGIC      WHEN is_account_group_member('pixels_phi') THEN TRUE                                            -- access to all the data
# MAGIC      WHEN is_account_group_member('pixels_deidentified') THEN meta:['00120063'].Value[0] is not null -- access only to deidentified data
# MAGIC      ELSE FALSE
# MAGIC    END;

# COMMAND ----------

# DBTITLE 1,Dynamic view with column Masking
# MAGIC %sql
# MAGIC create or replace view ema_rina.pixels.dicom_filtered as 
# MAGIC select * except (meta), 
# MAGIC   CASE 
# MAGIC     WHEN IS_ACCOUNT_GROUP_MEMBER('pixels_phi') THEN meta
# MAGIC     ELSE "[REDACTED]"
# MAGIC   END as meta
# MAGIC from ema_rina.pixels.object_catalog;

# COMMAND ----------

# DBTITLE 1,Query the view
# MAGIC %sql
# MAGIC -- emanuele.rinaldi@databircks.com is part of group           pixels_phi
# MAGIC -- emanuele.rinaldi+noadmin@databricks.com is part of group   pixels_deidentified
# MAGIC select * except (thumbnail) from ema_rina.pixels.object_catalog

# COMMAND ----------

# MAGIC %sql
# MAGIC select  * except (thumbnail) from ema_rina.pixels.dicom_filtered
