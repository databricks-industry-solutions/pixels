def get_spark():
    import warnings
    from pyspark.sql import SparkSession
    warnings.simplefilter('ignore', DeprecationWarning)
    import os

    # 
    os.environ['DEBUG_IGNORE_VERSION_MISMATCH'] = "1"

    return (SparkSession.builder.appName("pixels").getOrCreate())

spark = get_spark()

if __name__ == "__main__":
    print(f"Spark Version: {spark.version}")