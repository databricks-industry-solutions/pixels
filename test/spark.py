def get_spark():
    import warnings
    from pyspark.sql import SparkSession
    warnings.simplefilter('ignore', DeprecationWarning)
    return (SparkSession.builder.appName("pixels").getOrCreate())

spark = get_spark()