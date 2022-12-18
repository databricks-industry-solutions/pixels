from pyspark.sql.functions import udf
import pandas as pd

def cloud_open(path:str, anon:bool = False):
    if path.startswith("s3://"):
      """Read from S3 directly"""
      import s3fs
      fs = s3fs.S3FileSystem(anon)
      fp = fs.open(path)
    else:
      """Read from local filesystem"""
      fp = open(path, 'rb')
    return fp

@udf
def dicom_meta_udf(path:str, deep:bool = True, anon:bool = False) -> dict:
    """
      Purpose: Extract metadata from header of dicom image file
      @param path: local path like /dbfs/mnt/... or s3://<bucket>/path/to/object.dcm
      @param deep: True if deep inspection of the Dicom header is required
      @param anon: Set to True if accessing S3 and the bucket is public
    """
    import numpy as np
    from pydicom import dcmread
    from pydicom.errors import InvalidDicomError

    #try:
    if True:
        fp = cloud_open(path, anon)
        with dcmread(fp, defer_size=1000, stop_before_pixels=(not deep)) as ds:
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
                js['img_shape_x'] = a.shape[0]
                js['img_shape_y'] = a.shape[1]
            
            return str(js)
    #except Exception as err:
    #    except_str =  str({
    #        'udf': 'dicom_meta_udf',
    #        'error': str(err),
    #        'args': str(err.args),
    #        'path': path
    #    })
    #    print(except_str)
    #    return except_str

@udf
def dicom_plot_udf(local_path:str, figsize=(20.0,20.0), anon:bool = False) -> str:
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
    import s3fs
    import os
    import os.path
    
    save_folder = "/dbfs/FileStore/plots/pixels"
    #os.mkdirs(save_folder)

    cmap = "gray"
    fmt = 'PNG'
    extension = fmt.lower()
    """Plot dicom image to file in dbfs:/FileStore/plots folder then return translated path to plot"""
    save_file = ''
    try:
        fp = cloud_open(path, anon)
        with dcmread(fp) as ds:
            fig, ax = plt.subplots()
            ax.imshow(ds.pixel_array, cmap=cmap)
            #plt.title(local_path[-14:])
            plot_file = F"{str(uuid.uuid4())}.{extension}"
            save_file = F"{save_folder}/{plot_file}"
            plt.savefig(save_file, format=fmt)
            plt.close()
            return save_file
    except Exception as err:
        err_str = F"function: dicom_plot_udf, input: {local_path}, save_file: {save_file} err: {str(err)}"
        print(err_str)
        return err_str