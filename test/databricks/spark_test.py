from pyspark.sql import SparkSession
import pytest

@pytest.fixture
def spark() -> SparkSession:
  # Create a SparkSession (the entry point to Spark functionality) on
  # the cluster in the remote Databricks workspace. Unit tests do not
  # have access to this SparkSession by default.
  return SparkSession.builder.getOrCreate()


def test_spark_type(spark):
  assert spark is not None
  assert type(spark) == SparkSession
    
def test_spark(spark):
  spark.sql('USE default')
  data = spark.sql('SELECT id FROM range(100) order by id asc')
  assert data.collect()[2][0] == 2
