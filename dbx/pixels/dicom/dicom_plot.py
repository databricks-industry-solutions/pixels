import hashlib
import os
from typing import Iterator, Tuple

import matplotlib.pyplot as plt
import pandas as pd
from pydicom import dcmread
from pyspark.sql.functions import col, lit, pandas_udf
from pyspark.sql.types import StringType

from dbx.pixels import PlotResult
from dbx.pixels.dicom.dicom_udfs import cloud_open


def dicom_plot_outer(iterator: Iterator[Tuple[pd.Series, pd.Series]]) -> Iterator[pd.Series]:
    """UDF Wrapper for plot pandas udf"""

    def dicom_plot(
        path: str,
        anon: bool = False,
        save_folder="/dbfs/FileStore/plots/pixels",
        figsize=(20.0, 20.0),
    ) -> str:
        """Distributed function to render Dicom plot.
        This UDF will generate .png image into the FileStore plots folder which then can be linked to by the href attributed in the <img> tag.
        """

        cmap = "gray"
        fmt = "PNG"
        extension = fmt.lower()
        """Plot dicom image to file in {save_folder} then return translated path to plot"""
        save_file = ""
        try:
            fp = cloud_open(path, anon)
            with dcmread(fp) as ds:
                pixel_hash = hashlib.sha1(ds.pixel_array).hexdigest()
                plot_file = f"{str(pixel_hash)}.{extension}"
                save_file = f"{save_folder}/{plot_file}"
                if not os.path.exists(save_file):
                    print(f"saving plot {save_file}")
                    fig, ax = plt.subplots()
                    ax.imshow(ds.pixel_array, cmap=cmap)
                    plt.savefig(save_file, format=fmt)
                    plt.close()
                return save_file
        except Exception as err:
            err_str = f"function: dicom_plot, input: {path}, save_file: {save_file} err: {str(err)}"
            return err_str

    for path, anon, save_folder in iterator:
        for i in range(len(path)):
            yield pd.Series(dicom_plot(path.get(i), anon.get(i), save_folder.get(i)))


class DicomPlot:
    """Display Dicom images"""

    def __init__(self, df, inputCol="local_path"):
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

        lst = (
            self._df.repartition(128)
            .withColumn(
                "plot", dicom_plot_pandas_udf(col(self._inputCol), col("is_anon"), lit(save_folder))
            )
            .select("plot", "path_tags")
            .collect()
        )
        return PlotResult([y for y in map(lambda x: (x[0], x[1]), lst)])
