# Databricks notebook source
# MAGIC %sh
# MAGIC python -m pip install build
# MAGIC python -m build --outdir .
# MAGIC pip install pytest
# MAGIC find . -name "databricks_pixels*"
# MAGIC mv ./databricks_pixels*.whl ./databricks_pixels.zip

# COMMAND ----------
# MAGIC %restart_python

# COMMAND ----------

import logging
logging.getLogger('py4j.java_gateway').setLevel(logging.ERROR)

# COMMAND ----------

import dbx.pixels
import pytest
import sys
import os

os.environ['DATABRICKS_HOST'] = dbutils.notebook.entry_point.getDbutils().notebook().getContext().apiUrl().get()
os.environ['DATABRICKS_TOKEN'] = dbutils.notebook.entry_point.getDbutils().notebook().getContext().apiToken().get()

sys.dont_write_bytecode = True

pytest.main(['--import-mode=importlib', 'tests/dbx/'])
# COMMAND ----------
