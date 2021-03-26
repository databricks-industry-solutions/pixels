import unittest

from spark import get_spark
spark = get_spark()

path = 'dbfs:/FileStore/shared_uploads/douglas.moore@databricks.com/benigns'

class TestPathExtractor(unittest.TestCase):

    def test_pathextractor_class(self):
        from databricks.pixels import PathExtractor
        assert PathExtractor
    
    def test_path_extractor(self):
        from databricks.pixels import PathExtractor

        rel_path = 'patient123/39203_RIGHT_LO.dcm'
        paths = [[path+rel_path]]
        df = spark.createDataFrame(paths, "path STRING")
       
        pe = PathExtractor()
        assert pe
        r = pe._transform_impl(df, path, 'path')
        assert r
        rx = r.collect()
        self.assertIsNotNone(rx)
        print('\n', rx)

        self.assertEqual(rx[0][0], path+rel_path)
        self.assertEqual(rx[0][1], rel_path)
        self.assertEqual(rx[0][2], (path+rel_path).replace('dbfs:','/dbfs'))
        self.assertEqual(rx[0][3],'dcm')
        self.assertEqual(len(rx[0][3]), 3)
        
        self.assertTrue( 'patient123' in rx[0][4] )
        self.assertTrue( '39203' in rx[0][4] )
        self.assertTrue( 'RIGHT' in rx[0][4] )
        self.assertTrue( 'dcm' in rx[0][4] )
        self.assertTrue( 'LO' in rx[0][4] )
        print(r.show())

if __name__ == '__main__':
    import sys, os
    # fix sys path to include adjacent source code
    sys.path.insert(0, os.path.dirname(__file__)+"/..")
    unittest.main()