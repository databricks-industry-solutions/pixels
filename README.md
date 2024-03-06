<img src=https://hls-eng-data-public.s3.amazonaws.com/img/Databricks_HLS.png width="600px">

[![DBR](https://img.shields.io/badge/DBR-13.3ML-red?logo=databricks&style=for-the-badge)](https://docs.databricks.com/release-notes/runtime/13.3ml.html)
[![CLOUD](https://img.shields.io/badge/CLOUD-ALL-blue?logo=googlecloud&style=for-the-badge)](https://cloud.google.com/databricks)
[![POC](https://img.shields.io/badge/POC-10_days-green?style=for-the-badge)](https://databricks.com/try-databricks)
---

# `dbx.pixels` Solution Accelerator
Analyze DICOM image metadata with SQL
![Analyze](images/DICOM-analyze-with-SQL.png?raw=true)
---

## About DICOM
![Dicom Image processing](https://dicom.offis.uni-oldenburg.de/images/dicomlogo.gif)
[Per OFFIS computer science institute](https://dicom.offis.uni-oldenburg.de/en/general/dicom-introduction/) 

DICOM® — Digital Imaging and Communications in Medicine — is the international standard for medical images and related information. It defines the formats for medical images that can be exchanged with the data and quality necessary for clinical use.

DICOM® is implemented in almost every radiology, cardiology imaging, and radiotherapy device (X-ray, CT, MRI, ultrasound, etc.), and increasingly in devices in other medical domains such as ophthalmology and dentistry. With hundreds of thousands of medical imaging devices in use, DICOM® is one of the most widely deployed healthcare messaging Standards in the world. There are literally billions of DICOM® images currently in use for clinical care.

Since its first publication in 1993, DICOM® has revolutionized the practice of radiology, allowing the replacement of X-ray film with a fully digital workflow. Much as the Internet has become the platform for new consumer information applications, DICOM® has enabled advanced medical imaging applications that have “changed the face of clinical medicine”. From the emergency department, to cardiac stress testing, to breast cancer detection, DICOM® is the standard that makes medical imaging work — for doctors and for patients.

DICOM® is recognized by the International Organization for Standardization as the ISO 12052 standard.

---
## About `dbx.pixels`
Relibly turn millions of image files into SQL accessible metadata, thumbnails; Enable Deep Learning

* Use `dbx.pixels` python package for simplicity
  - Catalog your images
  - Extract Metadata
  - Visualize thumbnails
<!-- -->
* Scale up Image processing over multiple-cores and multiple worker nodes
* Delta Lake & Delta Engine accelerate metadata analysis.
* Scales well maintained 'standard' python packages `python-gdcm` `pydicom`
<!-- -->
- tags: 
dicom, dcm, pre-processing, visualization, repos, sql, python, spark, pyspark, package, image catalog, mamograms, dcm file
---
## Quick Start
```python
# imports
from dbx.pixels import Catalog                       # 01
from dbx.pixels.dicom import *                       # 02

# catalog all your files
catalog = Catalog(spark)                                    # 03
catalog_df = catalog.catalog(<path>)                        # 04

# extract the Dicom metadata
meta_df = DicomMetaExtractor(catalog).transform(catalog_df) # 05
 
# extract thumbnails and display
thumbnail_df = DicomThumbnailExtractor().transform(meta_df) # 06
 
# save your work for SQL access
catalog.save(thumbnail_df)                                  # 07
```
---
## Design
Data Flow
<img width="100%" src="images/pixels-dataflow-diagram.svg?raw=true">

---
Python Class Diagram
```mermaid
classDiagram
    class Transformer {
        +transform(df): DataFrame
        -_with_path_meta(): DataFrame
    }
    Transformer <|-- DicomMetaExtractor
    Transformer <|-- DicomThumbnailExtractor
    Transformer <|-- DicomPillowThumbnailExtractor
    Transformer <|-- DicomPatcher
    Transformer <|-- PathExtractor
    Transformer <|-- TagExtractor

    PathExtractor: -check_input_type()
    TagExtractor: -check_input_type()
    DicomMetaExtractor: -check_input_type()
    DicomMetaExtractor: -_transform(DataFrame)
    DicomThumbnailExtractor: -check_input_type()
    DicomThumbnailExtractor: -_transform(DataFrame)
    DicomPillowThumbnailExtractor: -check_input_type()
    DicomPillowThumbnailExtractor: -_transform(DataFrame)
    DicomPatcher: -_transform(DataFrame)

    PathExtractor: -_transform(DataFrame)
    TagExtractor: -_transform(DataFrame)
    
    DicomMetaExtractor --> Catalog
    DicomMetaExtractor ..> dicom_meta_udf
    DicomThumbnailExtractor ..> dicom_matplotlib_thumbnail_udf
    DicomPillowThumbnailExtractor ..> dicom_pillow_thumbnail_udf
    DicomPatcher ..> dicom_patcher_udf

    dicom_meta_udf ..> pydicom
    dicom_matplotlib_thumbnail_udf ..> pydicom
    dicom_pillow_thumbnail_udf  ..> pydicom
    dicom_patcher_udf  ..> pydicom

    pydicom: +dcmread(fp)

    class Catalog {
        Catalog(path, table):Catalog
        +catalog(path): DataFrame
        +load(): DataFrame
        +save(df)
    }
```
---
ER Diagram
```mermaid
%%{init: { 'logLevel': 'debug', 'theme': 'forest' } }%%
erDiagram
    object_catalog
    object_catalog {
      bigint	rowId PK            "Generated unique id found when cataloging"
      string	path                "Absolute path to Object file"
      timestamp	modificationTime  "modification timestamp of object as found on cloud storage"
      bigint	length              "bytes of object file"
      string	relative_path       "Relative to cataloging base path"
      string	local_path          "Translated path used by python UDFs"
      string	extension           "last few characters following last dot"
      array_string	path_tags     "Path split by common file name separators"
      string	meta                "JSON string of File header metadata"
      boolean	is_anon             "'true' if access to storage has no credentials"
      binary  thumbnail           "binary or struct<<origin:string,height:int,width:int,nChannels:int,mode:int,data:binary>"
    }
```

___
>
    author: Douglas Moore
    email:  douglas.moore at databricks dot com
    date:   November 18, 2022
___

## Installation

To run this accelerator, clone this repo into a Databricks workspace. Attach the `RUNME` notebook to any cluster running a DBR 10.4 LTS or later runtime, and execute the notebook via Run-All. A multi-step-job describing the accelerator pipeline will be created, and the link will be provided. Execute the multi-step-job to see how the pipeline runs. The job configuration is written in the RUNME notebook in json format. The cost associated with running the accelerator is the user's responsibility.

___
## Working with Unity Catalog (as of October 18th, 2023)
Unity Catalog (UC) [volumes](https://docs.databricks.com/en/data-governance/unity-catalog/create-volumes.html) are the recommended approach for providing access to and governing non-tabular data assets in a cloud object storage locations, including DICOM files. Volumes are accessed by using the following format for the path that is passed to the pixels `Catalog` object - 
```
/Volumes/<catalog>/<schema>/<volume>/<path-level-1>/...
```
where `<catalog>`, `<schema>` and `<volume>` reflect the three-level namespace of Unity Catalog. The path field returned by the `Catalog` object reflects the volume file path listed above and subsequent metadata and thumbnail extraction operations will use volumes for accessing files.

To use `databricks.pixels` with UC volumes currently requires the use of [single-user access mode clusters](https://docs.databricks.com/en/clusters/configure.html#access-modes) since `databricks.pixels` leverages user-defined functions (UDFs) and shared access mode clusters do not currently allow UDFs to access UC volumes. This behavior is expected to change in the future. When working with a UC-enabled cluster, attempting to access the cloud object store path directly by using external locations may cause errors due to the access method used by `pixels`.

___
## Licensing

&copy; 2022 Databricks, Inc. All rights reserved. The source in this notebook is provided subject to the Databricks License [https://databricks.com/db-license-source].  All included or referenced third party libraries are subject to the licenses set forth below.

| library              | purpose                             | license                       | source                                                  |
|----------------------|-------------------------------------|-------------------------------|---------------------------------------------------------|
| dbx.pixels    | Scale out image processong Spark    | Databricks                    | https://github.com/databricks-industry-solutions/pixels |
| pydicom              | Reading Dicom file wrapper          | MIT                           | https://github.com/pydicom/pydicom                      |
| python-gdcm          | Install gdcm C++ libraries          | Apache Software License (BSD) | https://github.com/tfmoraes/python-gdcm                 |
| gdcm                 | Parse Dicom files                   | BSD                           | https://gdcm.sourceforge.net/wiki/index.php/Main_Page   |
| s3fs                 | Resolve s3:// paths                 | BSD 3-Clause                  | https://github.com/fsspec/s3fs                          |
| pandas               | Pandas UDFs                         | BSD License (BSD-3-Clause)    | https://github.com/pandas-dev/pandas                    |
