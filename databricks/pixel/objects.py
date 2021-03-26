from pyspark.sql import DataFrame
class ObjectFrames(DataFrame):

    def __init__(self, df):
        super().__init__(df._jdf, df.sql_ctx)