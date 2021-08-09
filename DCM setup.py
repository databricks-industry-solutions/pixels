# Databricks notebook source
# MAGIC %md ## DCM Setup
# MAGIC Need to install gdcm from conda. gdcm provides near universal conversion of pixel data from Dicom images

# COMMAND ----------

# MAGIC %fs ls dbfs:/databricks/scripts/

# COMMAND ----------

init_script_path = "dbfs:/Users/douglas.moore@databricks.com/scripts/gdcm-install.sh"

# COMMAND ----------

dbutils.fs.put(init_script_path, 
"""#!/bin/bash
set -ex
/databricks/python/bin/python -V
. /databricks/conda/etc/profile.d/conda.sh
conda activate /databricks/python
conda install -c conda-forge gdcm -y
""", 
overwrite = True)
dbutils.fs.ls(init_script_path)

# COMMAND ----------

dbutils.fs.head(init_script_path)

# COMMAND ----------

# MAGIC %sh cat /dbfs/Users/douglas.moore@databricks.com/scripts/gdcm-install.sh

# COMMAND ----------

# MAGIC %sh bash /dbfs/Users/douglas.moore@databricks.com/scripts/gdcm-install.sh

# COMMAND ----------

import gdcm

# COMMAND ----------

# MAGIC %sh python -m pip install git+https://github.com/dmoore247/pixels.git

# COMMAND ----------


