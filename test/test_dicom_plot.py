import unittest

from spark import get_spark
spark = get_spark()

path = 'dbfs:/FileStore/shared_uploads/douglas.moore@databricks.com/benigns'

def get_object_frame(spark):
    from databricks.pixels import Catalog

    df = Catalog.catalog(spark, path)
    return df

class TestDicomFramesPlot(unittest.TestCase):
    items = [('/dbfs/FileStore/shared_uploads/douglas.moore@databricks.com/benigns/patient4927/4927.RIGHT_CC.dcm',
  ['benigns', 'patient4927', '4927', 'RIGHT', 'CC']),
 ('/dbfs/FileStore/shared_uploads/douglas.moore@databricks.com/benigns/patient0786/0786.RIGHT_CC.dcm',
  ['benigns', 'patient0786', '0786', 'RIGHT', 'CC'])]
    
    def test_dicom_buttons(self):
        if True:
            from databricks.pixels import PlotResult
            res = PlotResult(TestDicomFramesPlot.items)
            self.assertIsNotNone(res)
            self.assertIsNotNone(res._get_buttons)
            print(res._get_buttons)

    def test_dicom_result(self):
        if False:
            from databricks.pixels import PlotResult
            res = PlotResult(['/dbfs/FileStore/plots/pixels/abc.png','/dbfs/FileStore/efg.png'])
            self.assertIsNotNone(res)
            self.assertIsNotNone(res._repr_html_())
            self.assertIn('abc',res._repr_html_())
            print(res._repr_html_())

    def test_dicom_plot(self):
        if False:
            from databricks.pixels import DicomFrames
            dcm_df = DicomFrames(get_object_frame(spark).limit(4))
            result = dcm_df.withMeta().plot()
            print(result)
            self.assertIsNotNone(result)
            print(result._repr_html_())

    def test_dicom_plotx(self):
        if True:
            from databricks.pixels import DicomFrames
            dcm_df = DicomFrames(get_object_frame(spark).limit(4))
            result = dcm_df.withMeta().plotx()
            print(result)
            self.assertIsNotNone(result)
            print(result._repr_html_())

if __name__ == '__main__':
    import sys, os
    # fix sys path to include adjacent source code
    sys.path.insert(0, os.path.dirname(__file__)+"/..")
    unittest.main()