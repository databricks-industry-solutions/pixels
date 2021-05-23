import unittest

from spark import get_spark
spark = get_spark()

class TestCatalog(unittest.TestCase):
    test_path = 'dbfs:/databricks-datasets/med-images/camelyon16/'
    test_path = "dbfs:/FileStore/shared_uploads/douglas.moore@databricks.com/benigns/"
    
    def test_catalog_class(self):
        from databricks.pixels import Catalog
        assert Catalog
    
    def test_catalog_load(self):
        from databricks.pixels import Catalog

        df = Catalog.catalog(spark, self.test_path)
        count = df.count()
        self.assertEqual(170, count )
        self.assertEqual (8, len(df.columns))
        
        print(df.columns)
        print(df.show())

    def test_catalog_save(self):
        from databricks.pixels import Catalog

        df = Catalog.catalog(spark, self.test_path)
        r = Catalog.save(df,mode="overwrite",userMetadata="Integration Test")
        print(r)


if __name__ == '__main__':
    import sys, os
    # fix sys path to include adjacent source code
    sys.path.insert(0, os.path.dirname(__file__)+"/..")
    unittest.main()