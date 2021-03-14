import pyspark
class ObjectFrames(pyspark.sql.dataframe.DataFrame):

    def __init__(self, path:str, pattern:str = "*", recurse:bool = True, partitions:int = 64):
        """
            Init
        """
        self._path = path
        self._pattern = pattern
        self._partitions = partitions
        self._recurse = str(recurse).lower()

    def toDF(self) -> pyspark.sql.dataframe.DataFrame:
        from pyspark.sql import SparkSession

        spark = (SparkSession
            .builder
            .appName("ObjectFrames")
            .config('spark.ui.enabled','false')
            .getOrCreate())
        return (
            spark.read
            .format("binaryFile")
            .option("pathGlobFilter",      self._pattern)
            .option("recursiveFileLookup", self._recurse)
            .load(self._path)
            .drop('content')
            .repartition(self._partitions)
        )

    def isStreaming(self):
        return False

    def _repr_html_(self):
        """Display state as html"""
        return self.toDF().toPandas()._repr_html_()
    
    def __repr__(self):
        return self.toDF().__repr__()

if __name__ == "__main__":
    from ObjectFrames import ObjectFrames

    image_path = 'dbfs:/mnt/databricks-datasets-private/HLS/melanoma/training/data/'
    o = ObjectFrames(image_path)
    df = o.toDF()
    print(
        '\n',
        df.count()
        )
    #print(df.take(10))
    #print(o._repr_html_())
    print(o.__repr__())
    print(o.isStreaming())