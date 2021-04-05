import os


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
        return ""


class PlotResult():
    """ Result holder object to get triggered by notebook's display.
    This class is responisble for formatting the HTML of the result. """

    def init_plot_css(self):
        relative_path = F"./resources/plot.css"
        path = os.path.abspath(relative_path)
        with open(path, 'r') as f:
            self._plot_css = f.read()

    def init_plot_js(self):
        relative_path = F"./resources/plot.js"
        path = os.path.abspath(relative_path)
        with open(path, 'r') as f:
            self._plot_js = f.read()

    def init_plot_html(self):
        relative_path = F"./resources/plot.html"
        path = os.path.abspath(relative_path)
        with open(path, 'r') as f:
            self._html_template = f.read()

    def __init__(self, files):
        assert isinstance(files,list)
        self._files = files
        self.init_plot_html()
        self.init_plot_js()
        self.init_plot_css()

    def _repr_html_(self):
        base_url = get_base_url()
        row_src = ""
        for file in self._files:
            if 'FileStore' in file:
                _src = file.replace('/dbfs/FileStore','files')
                row_src = row_src + F'<div class="column content"><img src="{base_url}/{_src}"></div>\n' 
        return self._html_template.format(
                plot_css=self._plot_css,
                plot_js =self._plot_js,
                row_src =row_src
            )

if __name__ == "__main__":
    pr = PlotResult(['/dbfs/FileStore/plots/pixels/abc.png','/dbfs/FileStore/efg.png'])
    html = pr._repr_html_()
    print(html)
