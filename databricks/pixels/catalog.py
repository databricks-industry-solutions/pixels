from pyspark.sql import DataFrame
from pyspark.sql import functions as f
from databricks.pixels import ObjectFrames

# dfZipWithIndex helper function
from pyspark.sql.types import LongType, StructField, StructType

class Catalog:

    def catalog(spark, path:str, pattern:str = "*", recurse:bool = True, partitions:int = 64) -> DataFrame:
        """
            Catalog the objects
            parms:
                spark - Spark context
                path  - Root location of objects
                pattern - file name pattern
                recurse - True means recurse folder structure
                partitions - Default # of partitions
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
        df = Catalog.dfZipWithIndex(spark, df)
        return ObjectFrames(df)

    def load(spark, table:str) -> DataFrame:
      return ObjectFrames(spark.table(table))
   
    def save(df:DataFrame, 
        path:str = None,
        catalog:str = "hive_metastore",
        database:str ="objects_catalog", 
        table:str ="objects", 
        mode:str ="append", 
        mergeSchema:bool = True, 
        hasBinary:bool = False,
        userMetadata = None):
        """Save Catalog dataframe to Delta table for later fast recall."""
        options = {}
        options['mergeSchema'] = mergeSchema
        options['delta.autoOptimize.optimizeWrite'] = "true"
        options["delta.autoOptimize.autoCompact"] = "true"
        if None != userMetadata:
          options["userMetadata"] = userMetadata
        if None != path:
          options["path"] = path
        return (
            df.write
                .format("delta")
                .mode(mode)
                .options(**options)
                .saveAsTable(f"{catalog}.{database}.{table}")
        )

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

    def dfZipWithIndex (spark, df, offset=1, colName="rowId"):
        '''
            Ref: https://stackoverflow.com/questions/30304810/dataframe-ified-zipwithindex
            Enumerates dataframe rows is native order, like rdd.ZipWithIndex(), but on a dataframe 
            and preserves a schema

            :param df: source dataframe
            :param offset: adjustment to zipWithIndex()'s index
            :param colName: name of the index column
        '''

        new_schema = StructType(
                        [StructField(colName,LongType(),True)]        # new added field in front
                        + df.schema.fields                            # previous schema
                    )

        zipped_rdd = df.rdd.zipWithIndex()

        new_rdd = zipped_rdd.map(lambda row: ([row[1] +offset] + list(row[0])))
        return spark.createDataFrame(new_rdd, new_schema)


if __name__ == "__main__":
    import sys
    import os
    sys.path.insert(0, os.path.dirname(__file__)+"/../..")
    from databricks.pixels import Catalog
    c = Catalog()
    #c.catalog("dbfs:/tmp")