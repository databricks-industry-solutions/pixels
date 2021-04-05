
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
        relative_path = F"./resources/plot.html"
        import os
        path = os.path.abspath(relative_path)
        with open(path,'r') as f:
            self._html_template = f.read()
        print(path)
        print(self._html_template)

    def _repr_html_(self):
        base_url = get_base_url()
        row_src = ""
        for file in self._files:
            if 'FileStore' in file:
                _src = file.replace('/dbfs/FileStore','files')
                row_src = row_src + F'<div class="column content"><img alt="{file}" src="{base_url}/{_src}"></div>\n' 
        return self._html_template.format(row_src=row_src)