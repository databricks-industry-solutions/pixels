import unittest

import pyspark.sql.functions as F
from pyspark.sql import SparkSession
from pyspark.sql.types import *


if __name__ == "__main__":

    import sys, os
    sys.path.insert(0, os.path.dirname(__file__)+"/..")

    print(sys.path)

    from databricks.pixel import *

    spark = (SparkSession
                .builder
                .appName("ObjectFrames")
                .config('spark.ui.enabled','false')
                .getOrCreate())

    path = 'dbfs:/databricks-datasets/med-images/camelyon16/'
    df = Catalog.catalog(spark, path)
    print(
        '\n',
        df.count()
        )
    print(df.take(10))
    print(df._repr_html_())
    print(df.__repr__())
    print(df.isStreaming)
