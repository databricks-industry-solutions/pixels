    
    
class PlotResult():
    """ Result holder object to get triggered by notebook's display. 
    This class is responisble for formatting the HTML of the result. """

    def __init__(self, files):
        assert isinstance(files,list)
        self._files = files

    def _repr_html_(self):
        html = ""
        for file in self._files:
            if 'FileStore' in file:
                _src = file.replace('/dbfs/FileStore','files')
                html = html + F'<div class="figure"><img src="{_src}"></div>\n' 

            # <div class="figure"><img src="files/plots/pixels/{plot_file}"></div>
        return html