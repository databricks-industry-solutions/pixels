from pyspark.sql.functions import udf
import numpy

@udf
def dicom_meta_udf(path:str) -> dict:
    from pydicom import dcmread
    from pydicom.errors import InvalidDicomError
    try:
        with dcmread(path) as ds:
            js = ds.to_json_dict()
            # remove binary images
            if '60003000' in js:
                del js['60003000']
            if '7FE00010' in js:
                del js['7FE00010']
            a = ds.pixel_array
            js['img_min'] = numpy.min(a)
            js['img_max'] = numpy.max(a)
            return str(js)
    except InvalidDicomError as err:
        return str({
            'error': str(err),
            'path': path
        })

@udf
def dicom_plot_udf(local_path:str, figsize=(20.0,20.0)) -> str:
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
        plt.title(local_path[-14:])
        plot_file = F"{str(uuid.uuid4())}.{extension}"
        save_file = F"{save_folder}/{plot_file}"
        plt.savefig(save_file, format=fmt)
        plt.close()
        return save_file
    except Exception as err:
        err_str = F"input: {local_path}, save_file: {save_file} err: {str(err)}"
        print(err_str)
        return err_str