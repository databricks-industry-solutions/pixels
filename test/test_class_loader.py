import unittest

class TestClassLoader(unittest.TestCase):

    def test_object_frames(self):
        from databricks.pixel import ObjectFrames
        print(type(ObjectFrames))
        print(ObjectFrames.__module__)

    def test_catalog(self):
        from databricks.pixel.catalog import Catalog
        print(type(Catalog))
        print(Catalog.__module__)

    def test_o_frames(self):
        from databricks.pixel import ObjectFrames
        assert type(ObjectFrames)


if __name__ == '__main__':
    import sys, os
    # fix sys path to include adjacent source code
    sys.path.insert(0, os.path.dirname(__file__)+"/..")
    unittest.main()