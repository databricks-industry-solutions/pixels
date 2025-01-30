# Databricks notebook source
# MAGIC %sh
# MAGIC export SETUPTOOLS_SCM_PRETEND_VERSION=1.0.0
# MAGIC python -m pip install build
# MAGIC python -m build --outdir .
# MAGIC python -m pip install -e .
# MAGIC pip install pytest

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

result = pytest.main(['--import-mode=importlib', 'tests/dbx/'])
print(result)
# COMMAND ----------
