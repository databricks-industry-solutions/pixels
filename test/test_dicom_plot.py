import unittest

from spark import get_spark
spark = get_spark()

path = 'dbfs:/FileStore/shared_uploads/douglas.moore@databricks.com/benigns'

def get_object_frame(spark):
    from databricks.pixels import Catalog

    df = Catalog.catalog(spark, path)
    return df

class TestDicomFramesPlot(unittest.TestCase):

    def test_dicom_plot(self):
        from databricks.pixels import DicomFrames
        dcm_df = DicomFrames(get_object_frame(spark).limit(4))
        dcm_df.withMeta().plot()


if __name__ == '__main__':
    import sys, os
    # fix sys path to include adjacent source code
    sys.path.insert(0, os.path.dirname(__file__)+"/..")
    unittest.main()