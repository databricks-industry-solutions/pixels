from pyspark.sql import DataFrame
from databricks.pixels import ObjectFrames
from pydicom import dcmread
from pydicom.errors import InvalidDicomError
from pyspark.sql import functions as f

from pyspark.sql.functions import udf, col
import uuid
import matplotlib.pyplot as plt
import gdcm


class DicomFrames(ObjectFrames):
    """ Specialized Dicom Image frame data structure """
    def dicom_meta(path:str) -> dict:
        try:
            with dcmread(path) as ds:
                js = ds.to_json_dict()
                # remove binary images
                if '60003000' in js:
                    del js['60003000']
                if '7FE00010' in js:
                    del js['7FE00010']
                return str(js)
        except InvalidDicomError as err:
            return str({
                'error': str(err),
                'path': path
            })

    def dicom_plot(local_path:str, figsize=(20.0,20.0)) -> str:
        """Plot dicom image to file in dbfs:/FileStore/plots folder then return translated path to plot"""
        try:
            ds = dcmread(local_path)
            fig, ax = plt.subplots()
            ax.imshow(ds.pixel_array, cmap="gray")
            plot_file = F"{str(uuid.uuid4())}.png"
            plt.savefig(F"/dbfs/FileStore/plots/pixels/{plot_file}", format='PNG')
            plt.close()
            return (F'<div class="figure"><img src="files/plots/pixels/{plot_file}"></div>')
        except Exception as err:
            return F"input: {local_path} {str(err)}"

    def __init__(self, df):
        super(self.__class__, self).__init__(df)
        self._df = df


    def _get_loc(self, tags) -> int:
        """ Imaage positioning logic for mamagrams. """
        if 'LEFT' in tags:
            if 'CC'  in tags:
                return 1
            else:
                return 3
        else:
            if 'CC'  in tags:
                return 2
            else:
                return 4
        return -1

    def plot(self):
        """This function runs a distributed plotting function over all Dicom images."""

        dicom_plot_udf = udf(DicomFrames.dicom_plot)

        lst = self._df.withColumn('plot',dicom_plot_udf(col('local_path'))).select('plot').collect()
        return ('\n'.join(map(lambda x: x[0], lst)))

    def toDF(self) -> DataFrame:
        return self._df

    def _with_meta(self, outputCol = 'meta', inputCol = 'local_path'):
        dicom_meta_udf = f.udf(DicomFrames.dicom_meta)
        return DicomFrames(self._df.withColumn(outputCol,dicom_meta_udf(col(inputCol))))

    def _with_path_meta(self, basePath:str = 'dbfs:/', inputCol:str = 'path'):
        """ User overridable """
        return (
            DicomFrames(self._df
                .withColumn("relative_path", f.regexp_replace(inputCol, basePath+"(.*)$",r"$1"))
                .withColumn("local_path", f.regexp_replace(inputCol,"^dbfs:(.*$)",r"/dbfs$1"))
                .withColumn("extension",f.regexp_replace(inputCol, ".*\.(\w+)$", r"$1"))
                .withColumn("path_tags",
                            f.split(
                            f.regexp_replace(
                                "relative_path",
                                "([0-9a-zA-Z]+)([\_\.\/\:])",
                                r"$1,"),
                            ",")
                            )
                )
            )
    
    def withMeta(self):
        return self._with_path_meta()._with_meta()

if __name__ == '__main__':
    o = DicomFrames(None)