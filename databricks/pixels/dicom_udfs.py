from typing import Iterator
import pandas as pd
from pyspark.sql.types import DoubleType, StructType, StructField, StringType, IntegerType, BinaryType
from pyspark.sql.functions import spark_partition_id, udf

#
# mapInPandas UDF
#

def read_dcm(pdfs: Iterator[pd.DataFrame]) -> Iterator[pd.DataFrame]:
    from pydicom.errors import InvalidDicomError
    from pydicom import dcmread
    import numpy as np
    import pandas as pd
    local_path = ''
    for pdf in pdfs:
        assert 'local_path' in pdf.columns
        for i in range(pdf.shape[0]):
            local_path = pdf['local_path'][i]
            try:
                with dcmread(local_path) as ds:
                    js = ds.to_json_dict()
                    # remove binary images
                    if '60003000' in js:
                        del js['60003000']
                    if '7FE00010' in js:
                        del js['7FE00010']

                    a = ds.pixel_array
                    pdf = pd.DataFrame({
                        'meta':    str(js),
                        'shape':   a.shape,
                        'dtype':   type(a.dtype),
                        'data':    a.tobytes(),
                        'img_min': np.min(a),
                        'img_max': np.max(a),
                        'img_avg': np.average(a)
                    })
                    yield pdf
            except InvalidDicomError as err:
                return pd.DataFrame({
                        'error': str(err),
                        'path': local_path
                    })

read_dcm_schema = StructType([
    StructField('meta',StringType(),False),
    StructField('shape',StringType(),False),
    StructField('dtype', StringType(),False),
    StructField('data',BinaryType(),True),
    StructField('img_min',DoubleType(),True),
    StructField('img_max',DoubleType(),True),
    StructField('img_avg',DoubleType(),True)
])

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

if "__main__" == __name__:
    x = dicom_meta_udf


#
def dicom_meta(pdfs: Iterator[pd.DataFrame]) -> Iterator[pd.DataFrame]:
    j = 0
    for pdf in pdfs:
        for local_path, i in patcher_input(pdf):
            from pydicom import dcmread
            patch = b"bytes"
            #yield local_path, offset_x, offset_y, i, patch

dicom_patcher_schema = StructType([
    StructField('local_path',StringType(),False),
    StructField('offset_x',IntegerType(),False),
    StructField('offset_y',IntegerType(),False),
    StructField('i',IntegerType(),False),
    StructField('patch',BinaryType(),False)
])

def patcher_input(pdf):
    for i in range(pdf.shape[0]):
        (
            yield
                pdf['local_path'][i],
                i
        )
