from pyspark.sql import DataFrame
from pyspark.sql import functions as f
from databricks.pixels import ObjectFrames

class Catalog:

    def _with_path_meta(df, basePath:str = 'dbfs:/', inputCol:str = 'path', num_trailing_path_items:int = 5):
        """ break path up into usable information """
        return (            
                df
                .withColumn("relative_path", f.regexp_replace(inputCol, basePath+"(.*)$",r"$1"))
                .withColumn("local_path", f.regexp_replace(inputCol,"^dbfs:(.*$)",r"/dbfs$1"))
                .withColumn("extension",f.regexp_replace(inputCol, ".*\.(\w+)$", r"$1"))
                .withColumn("path_tags",
                                f.slice(
                                    f.split(
                                        f.regexp_replace(
                                            "relative_path",
                                            r"([0-9a-zA-Z]+)([\_\.\/\:\@])",
                                            r"$1,"),
                                        ","
                                    ),
                                    -num_trailing_path_items,
                                    num_trailing_path_items
                                )
                            )
                
            )

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
        df = Catalog._with_path_meta(df)
        return ObjectFrames(df)

if __name__ == "__main__":
    from pyspark.sql import SparkSession

    spark = (SparkSession
                .builder
                .appName("ObjectFrames")
                .config('spark.ui.enabled','false')
                .getOrCreate())
    df1 = spark.createDataFrame([[1],[2],[3]],"a int")
    df = ObjectFrames(df1)
    print(df.take(5))