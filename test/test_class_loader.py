import unittest

class TestClassLoader(unittest.TestCase):

    def test_databricks_pixels(self):
        import databricks.pixels
        s = databricks.pixels.__doc__
        self.assertIsNotNone(s)

    def test_plot_result(self):
        from databricks.pixels import PlotResult
        print(type(PlotResult))
        print(PlotResult.__module__)

    def test_object_frames(self):
        from databricks.pixels import ObjectFrames
        print(type(ObjectFrames))
        print(ObjectFrames.__module__)

    def test_catalog(self):
        from databricks.pixels import Catalog
        print(type(Catalog))
        print(Catalog.__module__)

    def test_o_frames(self):
        from databricks.pixels import ObjectFrames
        assert type(ObjectFrames)

    def test_dcm_frames(self):
        from databricks.pixels import DicomFrames
        assert type(DicomFrames)


if __name__ == '__main__':
    import sys, os
    # fix sys path to include adjacent source code
    sys.path.insert(0, os.path.dirname(__file__)+"/..")
    unittest.main()