from pyspark.sql import functions as f
from pyspark.sql.functions import udf, col, lit
from dbx.pixels import PlotResult

import pandas as pd
from typing import Iterator, Tuple
from pyspark.sql.functions import pandas_udf
from pyspark.sql.types import StringType
from pydicom import dcmread
from pydicom.errors import InvalidDicomError
from dbx.pixels.dicom.dicom_udfs import cloud_open
import hashlib
import os
import matplotlib.pyplot as plt

def dicom_plot_outer(iterator: Iterator[Tuple[pd.Series, pd.Series]]) -> Iterator[pd.Series]:
    """UDF Wrapper for plot pandas udf"""
    def dicom_plot(path:str, anon:bool = False, save_folder = "/dbfs/FileStore/plots/pixels", figsize=(20.0,20.0)) -> str:
        """Distributed function to render Dicom plot. 
        This UDF will generate .png image into the FileStore plots folder which then can be linked to by the href attributed in the <img> tag.
        """

        cmap = "gray"
        fmt = 'PNG'
        extension = fmt.lower()
        """Plot dicom image to file in {save_folder} then return translated path to plot"""
        save_file = ''
        if True:
            if ".dcm" != path[-4:]:
              return ""
            
            fp = cloud_open(path, anon)
            with dcmread(fp) as ds:
                pixel_hash = hashlib.sha1(ds.pixel_array).hexdigest()
                plot_file = F"{str(pixel_hash)}.{extension}"
                save_file = F"{save_folder}/{plot_file}"
                if not os.path.exists(save_file):
                    print(f"saving plot {save_file}")
                    fig, ax = plt.subplots()
                    ax.imshow(ds.pixel_array, cmap=cmap)
                    plt.savefig(save_file, format=fmt)
                    plt.close()
                return save_file
        #except Exception as err:
        #    err_str = F"function: dicom_plot, input: {path}, save_file: {save_file} err: {str(err)}"
        #    print(err_str)
        #    return err_str
    
    for path, anon, save_folder in iterator:
        #raise Exception(F"a {len(a)}, b {len(b)}")
        for i in range(len(path)):
          yield pd.Series(dicom_plot(path.get(i), anon.get(i),save_folder.get(i)))

class DicomPlot:
    """ Display Dicom images """

    def __init__(self, df, inputCol = 'local_path'):
        """
        df - Dataframe containing local_path to 
        inputCol - column name containing local_path to dicom file
        """
        self._df = df
        self._inputCol = inputCol

    def display(self):
        """Plot runs a distributed plotting function over all Dicom images returning plot and path_tags."""
        import os
        save_folder = "/dbfs/FileStore/plots/pixels"
        os.makedirs(save_folder, exist_ok=True)
        dicom_plot_pandas_udf = pandas_udf(dicom_plot_outer, returnType=StringType())

        lst = (self._df
                .repartition(128)
                .withColumn(
                    'plot',
                    dicom_plot_pandas_udf(col(self._inputCol), col('is_anon'), lit(save_folder))
                ).select('plot','path_tags').collect()
            )
        return PlotResult([y for y in map(lambda x: (x[0],x[1]), lst)])