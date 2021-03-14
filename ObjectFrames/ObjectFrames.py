from pyspark.sql import DataFrame
class ObjectFrames(DataFrame):

    def __init__(self, df):
        super(self.__class__, self).__init__(df._jdf, df.sql_ctx)

    def catalog(spark, path:str, pattern:str = "*", recurse:bool = True, partitions:int = 64) -> DataFrame:
        """
            Init
        """
        _path = path
        _pattern = pattern
        _partitions = partitions
        _recurse = str(recurse).lower()
        df = (spark.read
            .format("binaryFile")
            .option("pathGlobFilter",      _pattern)
            .option("recursiveFileLookup", _recurse)
            .load(path)
            .drop('content')
            .repartition(_partitions)     
        )
        return ObjectFrames(df)

if __name__ == "__main__":
    from ObjectFrames import ObjectFrames
    from pyspark.sql import SparkSession

    spark = (SparkSession
                .builder
                .appName("ObjectFrames")
                .config('spark.ui.enabled','false')
                .getOrCreate())
    path = 'dbfs:/mnt/databricks-datasets-private/HLS/melanoma/training/data/'
    df = ObjectFrames.catalog(spark, path)
    print(
        '\n',
        df.count()
        )
    print(df.take(10))
    print(df._repr_html_())
    print(df.__repr__())
    print(df.isStreaming)