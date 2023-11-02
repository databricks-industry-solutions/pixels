from pyspark.sql import SparkSession

spark:SparkSession = spark

spark.sql("SELECT * from RANGE(5)").show()