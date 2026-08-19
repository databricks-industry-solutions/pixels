import pyspark.sql.functions as f
import pyspark.sql.types as t
from pyspark.ml.pipeline import Transformer


class TagExtractor(Transformer):
    # Day extractor inherit of property of Transformer
    def __init__(self, inputCol="path", outputCol="tags", basePath="dbfs:/"):
        self.inputCol = inputCol  # the name of your columns
        self.outputCol = outputCol  # the name of your output column
        self.basePath = basePath

    def this():
        # define an unique ID
        this(Identifiable.randomUID("tagextractor"))

    def copy(extra):
        defaultCopy(extra)

    def check_input_type(self, schema):
        field = schema[self.inputCol]
        # assert that field is a datetype
        if field.dataType != t.StringType():
            raise Exception(
                "TagExtractor input type %s did not match input type StringType" % field.dataType
            )

    def _transform(self, df):
        self.check_input_type(df.schema)
        return df.withColumn(
            "relative_path", f.regexp_replace(self.inputCol, self.basePath + "(.*)$", r"$1")
        ).withColumn(
            self.outputCol,
            f.split(f.regexp_replace("relative_path", r"([0-9a-zA-Z]+)([\_\.\/\:])", r"$1,"), ","),
        )
