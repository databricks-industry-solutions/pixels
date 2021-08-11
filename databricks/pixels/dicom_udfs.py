from pyspark.sql.functions import udf
import pandas as pd


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