from os import pipe
import unittest

import unittest

from spark import get_spark
spark = get_spark()


from spark import get_spark
spark = get_spark()

path = 'dbfs:/FileStore/shared_uploads/douglas.moore@databricks.com/benigns'

def get_object_frame(spark):
    from databricks.pixels import Catalog
    df = Catalog.catalog(spark, path)
    return df

class TestDicomPatcher(unittest.TestCase):

    def test_dicom_patcher2(self):
        from databricks.pixels import DicomFrames
        from databricks.pixels import DicomPatcher
        from pyspark.ml import Pipeline

        o_df = get_object_frame(spark)
        dicom_df = DicomFrames(o_df)

        patcher = DicomPatcher()
        patched_df = patcher.transform(dicom_df)
        self.assertIn('patch',patched_df.columns)
        print(patched_df.columns)
        print(patched_df.count())


    def test_dicom_class(self):
        from databricks.pixels import DicomPatcher
        assert DicomPatcher

    def test_dicom_init(self):
        from databricks.pixels import DicomFrames
        o_df = get_object_frame(spark)
        dicom_df = DicomFrames(o_df)
        count = dicom_df.count()
        self.assertEqual(170, count)

    def test_dicom_patcher(self):
        from databricks.pixels import DicomFrames
        from pyspark.ml import Pipeline
        from databricks.pixels import DicomPatcher

        patcher = DicomPatcher()
        pipeline = Pipeline(stages=[patcher])

        o_df = get_object_frame(spark)
        dicom_df = DicomFrames(o_df)

        model = pipeline.fit(dicom_df)
        fit_df = model.transform(dicom_df)
        print(fit_df.show())

    
    
if __name__ == '__main__':
    import sys, os
    # fix sys path to include adjacent source code
    sys.path.insert(0, os.path.dirname(__file__)+"/..")
    unittest.main()