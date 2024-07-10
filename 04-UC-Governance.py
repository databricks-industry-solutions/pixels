# Databricks notebook source
# MAGIC %md # RBAC and ABAC with Unity Catalog
# MAGIC
# MAGIC This notebook demonstrates how to implement access control using SQL in a database. Access control is an important aspect of database security, as it allows you to control who can access and perform operations on your data.
# MAGIC
# MAGIC In this notebook, we will explore how to grant specific privileges to users or roles using SQL statements. We will also discuss the concept of schemas and how they can be used to organize and manage database objects.
# MAGIC
# MAGIC By the end of this notebook, you will have a clear understanding of how to effectively manage access control in your database using SQL.

# COMMAND ----------

catalog = "main"
schema = "pixels_solacc"
volume = "pixels_volume"

table = "object_catalog"
row_filtered_view = "dicom_row_filtered"
column_masked_view = "dicom_column_masked"

# group_phi will be able to see the real value for the column with phi tag
# group_masked will be able to see only the anonymized value or column masked with [REDACTED]
group_phi = "pixels_phi"
group_masked = "pixels_deidentified"

# backtick ` is required for special characters
user_phi = "`emanuele.rinaldi@databricks.com`"
user_masked = "`emanuele.rinaldi+nonadmin@databricks.com`"

tag_phi = "phi"
tag_to_anonymize = "pixels_anonym"

# COMMAND ----------

# sample commands used to grant access to the catalog, schema and volume
spark.sql(f'GRANT USE CATALOG ON CATALOG {catalog} TO {user_masked};')
spark.sql(f'GRANT USE SCHEMA ON SCHEMA {catalog}.{schema} TO {user_masked};')
spark.sql(f'GRANT READ VOLUME ON VOLUME {catalog}.{schema}.{volume} TO {user_masked};')
spark.sql(f'GRANT SELECT ON TABLE {catalog}.{schema}.{table} TO {user_masked};')

# COMMAND ----------

# sample commands used to revoke access to the catalog, schema and volume
spark.sql(f'REVOKE ALL PRIVILEGES  ON CATALOG {catalog} FROM {user_masked};')
spark.sql(f'REVOKE ALL PRIVILEGES  ON SCHEMA {catalog}.{schema} FROM {user_masked};')
spark.sql(f'REVOKE READ VOLUME ON VOLUME {catalog}.{schema}.{volume} FROM {user_masked};')
spark.sql(f'REVOKE SELECT ON TABLE {catalog}.{schema}.{table} FROM {user_masked};')

# COMMAND ----------

# MAGIC %md #ABAC using Python
# MAGIC
# MAGIC The following command is granting permissions to a user or group on tables and volumes in a catalog based on a specific tag.
# MAGIC
# MAGIC First, it retrieves all the tables with the specified tag from the information_schema.table_tags table. It then iterates over each table and grants the necessary permissions to the user or group. These permissions include USE CATALOG on the catalog of the table, USE SCHEMA on the schema of the table, and SELECT on the table itself.
# MAGIC
# MAGIC Next, it retrieves all the volumes with the specified tag from the information_schema.volume_tags table. It then iterates over each volume and grants the READ VOLUME permission to the user or group on the volume.
# MAGIC
# MAGIC The code uses the spark.sql() function to execute SQL queries and grant the necessary permissions.
# MAGIC
# MAGIC The code in Cell 7 is similar to Cell 6 but grants permissions to a different user or group based on a different tag.
# MAGIC
# MAGIC Please note that the code assumes the existence of the specified catalog, tables, and volumes in the database.
# MAGIC
# MAGIC - Get all Tables and Volumes in the catalog **ema_rina** with tag **phi** and assign access to **pixels_phi** group
# MAGIC - Get all Tables and Volumes in the catalog **ema_rina** with tag **pixels_anonym** and assign access to **pixels_deidentified** group

# COMMAND ----------

# sample commands used to grant access to the catalog, schema and volume to a group using a tagged catalog, schema, volume and table

table_tags = spark.sql(f"select * from {catalog}.information_schema.table_tags where tag_name = '{tag_phi}'").collect()
for table in table_tags:
    table_dic = table.asDict()
    spark.sql(f"GRANT USE CATALOG ON CATALOG {table_dic['catalog_name']} TO `{group_phi}`;")
    spark.sql(f"GRANT USE SCHEMA ON SCHEMA {table_dic['catalog_name']}.{table_dic['schema_name']} TO `{group_phi}`;")
    spark.sql(f"GRANT SELECT ON TABLE {table_dic['catalog_name']}.{table_dic['schema_name']}.{table_dic['table_name']} TO `{group_phi}`;")

volume_tags = spark.sql(f"select * from {catalog}.information_schema.volume_tags where tag_name = '{tag_phi}'").collect()
for volume in volume_tags:
    volume_dic = volume.asDict()
    spark.sql(f"GRANT READ VOLUME ON VOLUME {volume_dic['catalog_name']}.{volume_dic['schema_name']}.{volume_dic['volume_name']} TO `{group_phi}`;")

# COMMAND ----------

# sample commands used to grant access to the catalog, schema and volume to a group using a tagged catalog, schema, volume and table

table_tags = spark.sql(f"select * from {catalog}.information_schema.table_tags where tag_name = '{tag_to_anonymize}'").collect()
for table in table_tags:
    table_dic = table.asDict()
    spark.sql(f"GRANT USE CATALOG ON CATALOG {table_dic['catalog_name']} TO `{user_masked}`;")
    spark.sql(f"GRANT USE SCHEMA ON SCHEMA {table_dic['catalog_name']}.{table_dic['schema_name']} TO `{user_masked}`;")
    spark.sql(f"GRANT SELECT ON TABLE {table_dic['catalog_name']}.{table_dic['schema_name']}.{table_dic['table_name']} TO `{user_masked}`;")

volume_tags = spark.sql(f"select * from {catalog}.information_schema.volume_tags where tag_name = '{tag_to_anonymize}'").collect()
for volume in volume_tags:
    volume_dic = volume.asDict()
    spark.sql(f"GRANT READ VOLUME ON VOLUME {volume_dic['catalog_name']}.{volume_dic['schema_name']}.{volume_dic['volume_name']} TO `{user_masked}`;")

# COMMAND ----------

# Shared clusters will not be able to process images in notebooks, remove thumbnail column
spark.sql(f"SELECT * EXCEPT (thumbnail) FROM {catalog}.{schema}.{table}")

# COMMAND ----------

# MAGIC %md #Row filters and Column Mask via Dynamic Views
# MAGIC
# MAGIC We are going to create a Dynamic View with row filter based on DeIdentification Method
# MAGIC https://dicom.innolitics.com/ciods/ultrasound-image/patient/00120063
# MAGIC
# MAGIC The user emanuele.rinaldi@databricks.com is part of group **pixels_phi**
# MAGIC
# MAGIC The user emanuele.rinaldi+nonadmin@databricks.com is part of group **pixels_deidentified**

# COMMAND ----------

# DBTITLE 1,Search all the DeIdentification Methods used in catalog
spark.sql(f"SELECT DISTINCT(meta:['00120063'].Value[0]) `DeIndentification Method` FROM {catalog}.{schema}.{table}")

# COMMAND ----------

# DBTITLE 1,Dynamic View with condition on rows
# Filter the data based on the access level of the group 
spark.sql(f"""
create or replace view {catalog}.{schema}.{row_filtered_view} as 
select * from {schema}.{catalog}.{table}
WHERE
   CASE
     WHEN is_account_group_member('{group_phi}') THEN TRUE                                      -- access to all the data
     WHEN is_account_group_member('{group_masked}') THEN meta:['00120063'].Value[0] is not null -- access only to deidentified data
     ELSE FALSE
   END;
""")

# COMMAND ----------

# DBTITLE 1,Dynamic view with column Masking
# Redact the column `meta` in the view for non pixels_phi groups
spark.sql(f"""
create or replace view {catalog}.{schema}.{column_masked_view} as 
select * except (meta),
  CASE 
    WHEN IS_ACCOUNT_GROUP_MEMBER('pixels_phi') THEN meta
    ELSE "[REDACTED]"
  END as meta
from {schema}.{catalog}.{table}
""")

# COMMAND ----------

# DBTITLE 1,Query the row filtered view
spark.sql(f"SELECT * EXCEPT (thumbnail) FROM {catalog}.{schema}.{row_filtered_view}")

# COMMAND ----------

# DBTITLE 1,query the column masked view
spark.sql(f"SELECT * EXCEPT (thumbnail) FROM {catalog}.{schema}.{column_masked_view}")
