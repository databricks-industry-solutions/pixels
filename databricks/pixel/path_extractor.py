from pyspark.ml.pipeline import Transformer
import pyspark.sql.functions as f
import pyspark.sql.types as t
from pyspark.sql import DataFrame

class PathExtractor(Transformer):
    # Day extractor inherit of property of Transformer 
    def __init__(self, inputCol='path', tagsCol = "tags", basePath='dbfs:/'):
        self.inputCol = inputCol #the name of your columns
        self.basePath = basePath
    def this():
        #define an unique ID
        this(Identifiable.randomUID("PathExtractor"))
    def copy(extra):
        defaultCopy(extra)
    def check_input_type(self, schema):
        field = schema[self.inputCol]
        #assert that field is a datetype 
        if (field.dataType != t.StringType()):
            raise Exception('PathExtractor input type %s did not match input type StringType' % field.dataType)
    
    def _transform(self, df):
        self.check_input_type(df.schema)
        return self._transform_impl(df, self.basePath, self.inputCol)

    @staticmethod
    def _transform_impl(df:DataFrame, basePath:str, inputCol:str):
        """ User overridable """
        return (df
                .withColumn("relative_path", f.regexp_replace(inputCol, basePath+"(.*)$",r"$1"))
                .withColumn("local_path", f.regexp_replace(inputCol,"^dbfs:(.*$)",r"/dbfs$1"))
                .withColumn("extension",f.regexp_replace(inputCol, "\.(\w+)$", r"$1"))
                .withColumn("path_tags",
                            f.split(
                            f.regexp_replace(
                                "relative_path",
                                "([0-9a-zA-Z]+)([\_\.\/\:])",
                                r"$1,"),
                            ",")
                            )
            )