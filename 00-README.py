# Databricks notebook source
# MAGIC %md 
# MAGIC You may find this solution accelerator at https://github.com/databricks-industry-solutions/pixels. 

# COMMAND ----------

# MAGIC %md # Analytics on DICOM images should be simple
# MAGIC <!-- -->
# MAGIC &nbsp;
# MAGIC - Catalog all of your files in parallel and scale with Spark
# MAGIC - Spark SQL on top of Delta Lake powers fast metadata analytics
# MAGIC - Python based Transformers / pandas udfs form building blocks for:
# MAGIC   - Metadata & Thumbnail extraction
# MAGIC   - Uses proven `gdcm`, `python-gdcm` & `pydicom` python packages & C++ libraries
# MAGIC   - Simple composing and extension into De-Identification and Deep Learing
# MAGIC <!-- -->
# MAGIC 
# MAGIC The `dbx.pixels` solution accelerator turns DICOM images into SQL data

# COMMAND ----------

# MAGIC %md
# MAGIC Navigate:
# MAGIC - For more information see the project [README.md](https://raw.github.com/databricks-industry-solutions/pixels/main/README.md)
# MAGIC - <a href="$./01-dcm-demo">DICOM Ingest and Analytics demo</a>
# MAGIC - <a href="$./02-dcm-browser">DICOM Image Browser</a>

# COMMAND ----------

# MAGIC %md ## Licensing
# MAGIC 
# MAGIC &copy; 2022 Databricks, Inc. All rights reserved. The source in this notebook is provided subject to the Databricks License [https://databricks.com/db-license-source].  All included or referenced third party libraries are subject to the licenses set forth below.
# MAGIC 
# MAGIC | library              | purpose                             | license                       | source                                                  |
# MAGIC |----------------------|-------------------------------------|-------------------------------|---------------------------------------------------------|
# MAGIC | dbx.pixels    | Scale out image processong Spark    | Databricks                    | https://github.com/databricks-industry-solutions/pixels |
# MAGIC | pydicom              | Reading Dicom file wrapper          | MIT                           | https://github.com/pydicom/pydicom                      |
# MAGIC | python-gdcm          | Install gdcm C++ libraries          | Apache Software License (BSD) | https://github.com/tfmoraes/python-gdcm                 |
# MAGIC | gdcm                 | Parse Dicom files.                  | BSD                           | https://gdcm.sourceforge.net/wiki/index.php/Main_Page   |
# MAGIC | s3fs                 | Resolve s3:// paths                 | BSD 3-Clause                  | https://github.com/fsspec/s3fs                          |
# MAGIC | pandas               | Pandas UDFs                         | BSD License (BSD-3-Clause)    | https://github.com/pandas-dev/pandas                    |

# COMMAND ----------


