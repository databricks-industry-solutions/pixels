from pyspark.sql.functions import udf
import pandas as pd

@udf
def dicom_meta_udf(path:str, deep:bool = True) -> dict:
    """Extract metadata from header of dicom image file"""
    from pydicom import dcmread
    from pydicom.errors import InvalidDicomError
    import numpy as np
    try:
        with dcmread(path) as ds:
            js = ds.to_json_dict()
            # remove binary images
            if '60003000' in js:
                del js['60003000']
            if '7FE00010' in js:
                del js['7FE00010']

            if deep:
                a = ds.pixel_array
                a.flags.writeable = False
                js['hash'] = hash(a.data.tobytes())
                js['img_min'] = np.min(a)
                js['img_max'] = np.max(a)
                js['img_avg'] = np.average(a)
            
            return str(js)
    except InvalidDicomError as err:
        return str({
            'error': str(err),
            'path': path
        })

@udf
def dicom_plot_udf(local_path:str, figsize=(20.0,20.0)) -> str:
    """Distributed function to render Dicom plot. 
    This UDF will generate .png image into the FileStore plots folder which then can be linked to by the href attributed in the <img> tag.
    To assist with pretty rendering, this function utilizes:
        resources/plot.html
        resources/plot.css
        resources/plot.js
    """
    import uuid
    import matplotlib.pyplot as plt
    from pydicom import dcmread
    from pydicom.errors import InvalidDicomError
    save_folder = "/dbfs/FileStore/plots/pixels"
    cmap = "gray"
    fmt = 'PNG'
    extension = fmt.lower()
    """Plot dicom image to file in dbfs:/FileStore/plots folder then return translated path to plot"""
    save_file = ''
    try:
        ds = dcmread(local_path)
        fig, ax = plt.subplots()
        ax.imshow(ds.pixel_array, cmap=cmap)
        #plt.title(local_path[-14:])
        plot_file = F"{str(uuid.uuid4())}.{extension}"
        save_file = F"{save_folder}/{plot_file}"
        plt.savefig(save_file, format=fmt)
        plt.close()
        return save_file
    except Exception as err:
        err_str = F"input: {local_path}, save_file: {save_file} err: {str(err)}"
        print(err_str)
        return err_str


"""
def patcher_input(pdf):
    for i in range(pdf.shape[0]):
        (
            yield
                pdf['local_path'][i],
                i
        )
"""

from typing import Iterator
import pandas as pd
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, BinaryType


dicom_patcher_schema = StructType([
    StructField('local_path',StringType(),False),
    StructField('offset_x',IntegerType(),False),
    StructField('offset_y',IntegerType(),False),
    StructField('i',IntegerType(),False),
    StructField('patch',BinaryType(),False)
])

#
# mapInPandas UDF
#
def dicom_patcher(meta: Iterator[pd.DataFrame]) -> Iterator[pd.DataFrame]:
    def patcher_input(pdf):
        for i in range(pdf.shape[0]):
            (
                yield
                    pdf['local_path'][i],
                    pdf['width'][i],
                    pdf['height'][i],
                    pdf['x_size'][i],
                    pdf['x_size'][i],
                    pdf['x_stride'][i],
                    pdf['y_stride'][i]
            )
    print("dicom_patcher call")
    j = 0
    for pdf in meta:
      for local_path, width, height, x_size, y_size, x_stride, y_stride, i in patcher_input(pdf):
          for offset_x in range(0, width, x_stride):
              for offset_y in range(0,height, y_stride):
                  patch = b"bytes"
                  yield local_path, offset_x, offset_y, i, patch



