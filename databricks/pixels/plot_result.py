
def get_dbutils(spark):
    try:
        print(">> get_dbutils.1")
        from pyspark.dbutils import DBUtils
        dbutils = DBUtils(spark)
    except ImportError:
        print(">> get_dbutils.2")
        import IPython
        dbutils = IPython.get_ipython().user_ns["dbutils"]
    return dbutils

def get_base_url():
        #url = get_dbutils(spark).entry_point.getDbutils().notebook().getContext().apiUrl().get()
        return "https://demo.cloud.databricks.com"

class PlotResult():
    """ Result holder object to get triggered by notebook's display. 
    This class is responisble for formatting the HTML of the result. """

    def __init__(self, files):
        assert isinstance(files,list)
        self._files = files

    def _repr_html_(self):
        base_url = get_base_url()
        html = ""
        for file in self._files:
            if 'FileStore' in file:
                _src = file.replace('/dbfs/FileStore','files')
                html = html + F'<div class="figure"><img src="{base_url}/{_src}"></div>\n' 
        return html