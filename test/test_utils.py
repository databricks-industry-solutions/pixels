import unittest

from spark import get_spark
spark = get_spark()

path = "dbfs:/FileStore/shared_uploads/douglas.moore@databricks.com/benigns"


class TestUtils(unittest.TestCase):

    def test_get_image(self):

        from databricks.pixels import utils
        import struct
        from binascii import hexlify
        import zlib
        from binascii import unhexlify
        def chunk(type, data):
            return (struct.pack('>I', len(data)) + type + data
                + struct.pack('>I', zlib.crc32(type + data)))

        png = (b'\x89PNG\r\n\x1A\n'
            + chunk(b'IHDR', struct.pack('>IIBBBBB', 1, 1, 8, 6, 0, 0, 0))
            + chunk(b'IDAT', unhexlify(b'789c6300010000050001'))
            + chunk(b'IEND', b''))
        
        r = utils.to_image(png)
        print(r)

    def test_get_image_spark(self):
        from databricks.pixels import Catalog
        o_df = Catalog.catalog(spark, path=path)

    
if __name__ == '__main__':
    import sys, os
    # fix sys path to include adjacent source code
    sys.path.insert(0, os.path.dirname(__file__)+"/..")
    unittest.main()