
from databricks.pixel import ObjectFrames
from pydicom import dcmread

class DicomFrames(ObjectFrames):

    def __init__(self, df):
        super(self.__class__, self).__init__(df._jdf, df.sql_ctx)

    def _get_loc(self, tags) -> int:
        """ Imaage positioning logic for mamagrams. """
        if 'LEFT' in tags:
            if 'CC'  in tags:
            return 1
            else:
            return 3
        else:
            if 'CC'  in tags:
            return 2
            else:
            return 4
        return -1

    def plot(self, images):
        """ Given list of [path,tags[]] plot the images """
        import matplotlib.pyplot as plt

        fig = plt.figure(figsize=(20,20))  # sets the window to 8 x 6 inches

        for i in images:
            path = i[0].replace('dbfs:','/dbfs')
            ds = dcmread(path)
            print(ds)
            tags = i[1]
            loc = self._get_loc(tags)

            plt.subplot(2,2,loc)
            plt.imshow(ds.pixel_array, cmap="gray")
        
        plt.show()
        plt.close()
