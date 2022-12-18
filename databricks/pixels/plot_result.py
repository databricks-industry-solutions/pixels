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

    basepath = "./databricks/pixels/resources"
    import os

    def init_plot_css(self):
        with open(self._path_css, 'r') as f:
            self._plot_css = f.read()

    def init_plot_js(self):
        with open(self._path_js, 'r') as f:
            self._plot_js = f.read()

    def init_plot_html(self):
        with open(self._path_html, 'r') as f:
            self._html_template = f.read()

    def __init__(self, files):
        assert isinstance(files,list)
        self._files = files
        self.root = os.path.dirname(os.path.abspath(__file__))
        self._path_css  = os.path.join(self.root,'resources/plot.css')
        self._path_js   = os.path.join(self.root,'resources/plot.js')
        self._path_html = os.path.join(self.root,'resources/plot.html')
        self.init_plot_html()
        self.init_plot_js()
        self.init_plot_css()
        self.most_common_limit = 14

    def __len__(self):
      return len(self._files)
    
    def _get_buttons(self) -> str:
        """
        Turns path_tags into facets into buttons
            input: self._files
            returns: button html source code
        """
        n_files = len(self._files)
        # look for files and path tags
        if  (n_files <= 0 or len(self._files[0]) <= 1):
            return ''

        from collections import Counter
        lst = [item for sublist in [y for y in map(lambda x: x[1], self._files)] for item in sublist]
        c = Counter(lst).most_common(self.most_common_limit)

        start = c[0][1]
        print("start {}, l_size {}".format(start, n_files))
        button_src = ''
        for i,v in enumerate(c):
            b = v[0]
            l = 100.0*(v[1]/n_files) # frequency %
            button_src = button_src + \
                F'''<div class="btn"><div class="gauge" style="height:{l}%;"></div><button onclick="filterSelection('{b}')">{b}</button></div>'''
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
        if self.__len__() == 0:
            return "<div>No results</div>"
        return self._html_template.format(
                plot_css   = self._plot_css,
                plot_js    = self._plot_js,
                button_src = self._get_buttons(),
                row_src    = self._get_rows()
            )

if __name__ == "__main__":
    items = [
        ('/dbfs/FileStore/shared_uploads/douglas.moore@databricks.com/benigns/patient4927/4927.RIGHT_CC.dcm',
            ['benigns', 'patient4927', '4927', 'RIGHT', 'CC']),
        ('/dbfs/FileStore/shared_uploads/douglas.moore@databricks.com/benigns/patient0786/0786.RIGHT_CC.dcm',
            ['benigns', 'patient0786', '0786', 'RIGHT', 'CC']),
        ('/dbfs/FileStore/shared_uploads/douglas.moore@databricks.com/benigns/patient0786/0786.LEFT_CC.dcm',
            ['benigns', 'patient0786', '0786', 'LEFT', 'CC']),
        ('/dbfs/FileStore/shared_uploads/douglas.moore@databricks.com/benigns/patient0787/0787.LEFT_CC.dcm',
            ['benigns', 'patient0787', '0787', 'RIGHT', 'CC']),
        ('/dbfs/FileStore/shared_uploads/douglas.moore@databricks.com/benigns/patient0788/0788.LEFT_CC.dcm',
            ['benigns', 'patient0788', '0788', 'RIGHT', 'CC']),
        ('/dbfs/FileStore/shared_uploads/douglas.moore@databricks.com/benigns/patient0789/0789.LEFT_CC.dcm',
            ['benigns', 'patient0789', '0789', 'RIGHT', 'CC']),
        ]
    pr = PlotResult(items)
    html = pr._repr_html_()
    print(html)

if __name__ == '__main__':
    print(F">>>>>>>>>>>{__file__}")