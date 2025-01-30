# Databricks notebook source
# MAGIC %pip install -r requirements.txt
# MAGIC %pip install pytest

# COMMAND ----------

dbutils.library.restartPython()

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

result = pytest.main(['--import-mode=importlib', 'tests/dbx/'])
exit_code = pytest.main(['test_directory'])
if exit_code != 0:
    print(f"Tests failed with exit code: {exit_code}")