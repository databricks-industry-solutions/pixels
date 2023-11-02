import pytest
from databricks.connect import DatabricksSession
from pyspark.sql import SparkSession

@pytest.fixture
def spark() -> DatabricksSession:
  """  
  Create a SparkSession (the entry point to Spark functionality) on
  the cluster in the remote Databricks workspace. Unit tests do not
  have access to this SparkSession by default.
  """
  return DatabricksSession.builder.getOrCreate()

def test_spark_type(spark):
  assert spark is not None
  assert spark.version >= "3.4.1"
    
def test_spark(spark):
  data = spark.sql('SELECT id FROM range(100) order by id asc')
  assert data.collect()[2][0] == 2

def test_spark_catalog(spark):
  df = spark.sql('SHOW CATALOGS')
  count = df.count()
  assert count >= 2
