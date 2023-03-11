from pyspark.sql import SparkSession
import pytest

@pytest.fixture
def spark() -> SparkSession:
  # Create a SparkSession (the entry point to Spark functionality) on
  # the cluster in the remote Databricks workspace. Unit tests do not
  # have access to this SparkSession by default.
  return SparkSession.builder.getOrCreate()

# Now add your unit tests.

# For example, here is a unit test that must be run on the
# cluster in the remote Databricks workspace.
# This example determines whether the specified cell in the
# specified table contains the specified value. For example,
# the third colum in the first row should contain the word "Ideal":
#
# +----+-------+-------+-------+---------+-------+-------+-------+------+-------+------+
# |_c0 | carat | cut   | color | clarity | depth | table | price | x    | y     | z    |
# +----+-------+-------+-------+---------+-------+-------+-------+------+-------+------+
# | 1  | 0.23  | Ideal | E     | SI2     | 61.5  | 55    | 326   | 3.95 | 3. 98 | 2.43 |
# +----+-------+-------+-------+---------+-------+-------+-------+------+-------+------+
# ...
#

def test_spark_type(spark):
  assert spark is not None
  assert type(spark) == SparkSession
    
def test_spark(spark):
  spark.sql('USE default')
  data = spark.sql('SELECT * FROM diamonds')
  assert data.collect()[0][2] == 'Ideal'