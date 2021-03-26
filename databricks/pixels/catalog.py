from pyspark.sql import DataFrame
from databricks.pixels import ObjectFrames

class Catalog:

    def catalog(spark, path:str, pattern:str = "*", recurse:bool = True, partitions:int = 64) -> DataFrame:
        """
            Catalog the objects
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
    from pyspark.sql import SparkSession
    spark = (SparkSession
                .builder
                .appName("ObjectFrames")
                .config('spark.ui.enabled','false')
                .getOrCreate())
    df1 = spark.createDataFrame([[1],[2],[3]],"a int")
    df = objects.ObjectFrames(df1)
    print(df.take(5))