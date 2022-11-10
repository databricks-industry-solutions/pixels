# databricks.pixels Package

This package facilitates handling Object, Document, Image and HLS Image data sets as Spark Dataframes


## Install
`%pip install -vv -e git+https://github.com/dmoore247/pixels#egg=databricks.pixels`

## Usage

```
from databricks.pixels import Catalog
display(
  Catalog.catalog(spark, 'dbfs:/databricks-datasets/med-images/camelyon16/', pattern='normal_???.tif')
)
```

Also
1. Add this repo to Databricks Repos
2. open up dcm_demo.py
3. Run the Catalog and DicomFrames metadata extraction and plotting on 10,000 Dicom sample files
