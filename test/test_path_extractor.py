import unittest

def get_spark():
    from pyspark.sql import SparkSession
    return (SparkSession
                .builder
                .appName("ObjectFrames")
                .config('spark.ui.enabled','false')
                .getOrCreate()
                )

class TestPathExtractor(unittest.TestCase):

    def test_pathextractor_class(self):
        from databricks.pixel import PathExtractor
        assert PathExtractor
    
    def test_path_extractor(self):
        from databricks.pixel import PathExtractor
        path = 'dbfs:/databricks-datasets/med-images/camelyon16/'
        rel_path = 'patient123/39203_RIGHT_LO.dcm'
        spark = get_spark()
        paths = [[path+rel_path]]
        df = spark.createDataFrame(paths, "path STRING")
       
        pe = PathExtractor()
        assert pe
        r = pe._transform_impl(df, path, 'path')
        assert r
        rx = r.collect()
        self.assertIsNotNone(rx)
        print('\n', rx[1])

        self.assertEqual(rx[0][0], path+rel_path)
        self.assertEqual(rx['relative_path'][0][0], rel_path)
        self.assertEqual(rx['local_path'][0][0], (path+rel_path).replace('dbfs:','/dbfs'))
        self.assertEqual(len(rx['path_tags'][0][0]), 6)
        
        self.assertTrue( 'patient123' in rx['path_tags'][0] )
        self.assertTrue( '39203' in rx['path_tags'][0] )
        self.assertTrue( 'RIGHT' in rx['path_tags'][0] )
        self.assertTrue( 'dcm' in rx['path_tags'][0] )
        self.assertTrue( 'LO' in rx['path_tags'][0] )
        print(r.show())

if __name__ == '__main__':
    import sys, os
    # fix sys path to include adjacent source code
    sys.path.insert(0, os.path.dirname(__file__)+"/..")
    unittest.main()