import unittest

def get_spark():
    from pyspark.sql import SparkSession
    return (SparkSession
                .builder
                .appName("ObjectFrames")
                .config('spark.ui.enabled','false')
                .getOrCreate()
                )

class TestCatalog(unittest.TestCase):

    def test_catalog_class(self):
        from databricks.pixel import Catalog
        assert Catalog
    
    def test_catalog_load(self):
        from databricks.pixel import Catalog
        path = 'dbfs:/databricks-datasets/med-images/camelyon16/'
        spark = get_spark()
        df = Catalog.catalog(spark, path)
        count = df.count()
        assert 60 == count
        print(df['path'])
        print(df.columns)



if __name__ == '__main__':
    import sys, os
    # fix sys path to include adjacent source code
    sys.path.insert(0, os.path.dirname(__file__)+"/..")
    unittest.main()