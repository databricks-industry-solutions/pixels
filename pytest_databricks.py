# Databricks notebook source
# MAGIC %sh
# MAGIC pwd
# MAGIC ls
# MAGIC python -m pip install -U pip
# MAGIC pip install setuptools==58.2.0
# MAGIC pip install -e '.[dev]'
# MAGIC pip wheel . -w wheels
# MAGIC cp ./wheels/databricks_pixels*.whl ./wheels/databricks_pixels.zip
# MAGIC restart_python

# COMMAND ----------

import logging
logging.getLogger('py4j.java_gateway').setLevel(logging.ERROR)

# COMMAND ----------

import pytest
import sys
import dbx.pixels
import os

os.environ['DATABRICKS_HOST'] = dbutils.notebook.entry_point.getDbutils().notebook().getContext().apiUrl().get()
os.environ['DATABRICKS_TOKEN'] = dbutils.notebook.entry_point.getDbutils().notebook().getContext().apiToken().get()

sys.dont_write_bytecode = True

pytest.main(['--import-mode=importlib', 'tests/dbx/'])