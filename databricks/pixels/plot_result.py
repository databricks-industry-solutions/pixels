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

    def _get_buttons(self):
        from collections import Counter

        tag_set = set([item for sublist in [y for y in map(lambda x: x[1], self._files)] for item in sublist])
    
        start = c[0][1]
        l_size = len(lst)
        print(start)
        button_src = '<div class="panel">'

        for i,v in enumerate(c):
            if v[1] < start:
                b = v[0]
                l = 100*(v[1]/l_size)
                l = 0
                style_str = ' style="z-index: -1; background:yellow; height=3px; width:{l}%"'
                button_src = button_src + F'''  <button class="btn" onclick="filterSelection('{b}')"><div{style_str}>{b}</div></button>\n'''
            else:
                l_size = l_size - v[1]
            button_src = button_src + '</div'
        return button_src

    def _get_rows(self):
        base_url = get_base_url()
        row_src = ""
        for item in self._files:
            file = item[0]
            tags = item[1]
            if 'FileStore' in file:
                tag_str = ' '.join(tags)
                _src = file.replace('/dbfs/FileStore','files')
                row_src = row_src + F'<div class="column {tag_str} content"><img src="{base_url}/{_src}"><p>{tag_str}</p></div>\n'
        return row_src
  
    def _repr_html_(self):
        """Render results as HTML. This method called by notebook if found on object"""
       
        return self._html_template.format(
                plot_css   = self._plot_css,
                plot_js    = self._plot_js,
                button_src = self._get_buttons(),
                row_src    = self._get_rows()
            )

if __name__ == "__main__":
    items = [('/dbfs/FileStore/shared_uploads/douglas.moore@databricks.com/benigns/patient4927/4927.RIGHT_CC.dcm',
        ['benigns', 'patient4927', '4927', 'RIGHT', 'CC']),
        ('/dbfs/FileStore/shared_uploads/douglas.moore@databricks.com/benigns/patient0786/0786.RIGHT_CC.dcm',
        ['benigns', 'patient0786', '0786', 'RIGHT', 'CC'])]
    pr = PlotResult(items)
    html = pr._repr_html_()
    print(html)
