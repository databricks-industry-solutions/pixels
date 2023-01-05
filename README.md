<img src=https://hls-eng-data-public.s3.amazonaws.com/img/Databricks_HLS.png width="600px">

# Scale out Dicom image processing

[![DBR](https://img.shields.io/badge/DBR-10.4ML-red?logo=databricks&style=for-the-badge)](https://docs.databricks.com/release-notes/runtime/10.4ml.html)
[![CLOUD](https://img.shields.io/badge/CLOUD-ALL-blue?logo=googlecloud&style=for-the-badge)](https://cloud.google.com/databricks)
[![POC](https://img.shields.io/badge/POC-10_days-green?style=for-the-badge)](https://databricks.com/try-databricks)

---

![Dicom Image processing](https://dicom.offis.uni-oldenburg.de/images/dicomlogo.gif)

## About DICOM
[Per OFFIS computer science institute](https://dicom.offis.uni-oldenburg.de/dcmintro.php.en)

DICOM® — Digital Imaging and Communications in Medicine — is the international standard for medical images and related information. It defines the formats for medical images that can be exchanged with the data and quality necessary for clinical use.

DICOM® is implemented in almost every radiology, cardiology imaging, and radiotherapy device (X-ray, CT, MRI, ultrasound, etc.), and increasingly in devices in other medical domains such as ophthalmology and dentistry. With hundreds of thousands of medical imaging devices in use, DICOM® is one of the most widely deployed healthcare messaging Standards in the world. There are literally billions of DICOM® images currently in use for clinical care.

Since its first publication in 1993, DICOM® has revolutionized the practice of radiology, allowing the replacement of X-ray film with a fully digital workflow. Much as the Internet has become the platform for new consumer information applications, DICOM® has enabled advanced medical imaging applications that have “changed the face of clinical medicine”. From the emergency department, to cardiac stress testing, to breast cancer detection, DICOM® is the standard that makes medical imaging work — for doctors and for patients.

DICOM® is recognized by the International Organization for Standardization as the ISO 12052 standard.

---
## About databricks.pixels
Process millions of files with 10 lines of code or less

* Use `databricks.pixels` python package for simplicity
  - Catalog your images
  - Extract Metadata
  - Visualize thumbnails
<!-- -->
* Scale up Image processing over multiple-cores and nodes
* Delta lake & Delta Engine accelerate metadata analysis.
* Well maintained 'standard' python packages `python-gdcm` `pydicom` are for processing Dicom files.
<!-- -->
- tags: 
dicom, dcm, pre-processing, visualization, repos, python, spark, pyspark, package, image catalog, mamograms, dcm file
---
## Design
Data Flow
```mermaid
flowchart LR

subgraph bronze[<font size=6>Ingest]
  A[[Dicom Files]] -->|file reference|B([DicomMetadataExtractor])
  A -->|metadata|B
  B --> C[(object_catalog)]
end
subgraph silver[<font size=6>Analytics]
  C --> D1([SQL]) --> D(Metadata Analysis)
  C --> G1([DicomThumbnailExtractor]) --> G(Thumbnail Visualization)
  C --> G2([DicomPillowThumbnailExtractor]) --> G
  C -.-> E([DicomPatcher])
  E -.-> F(Deep Learning)
end
style C fill:#CD7F32, stroke:333, color:#333
style silver fill:#C0C0C0, stroke:333, color #333, font-size: 40px;
```
---
Python Class Diagram
```mermaid
classDiagram
    class Transformer {
        +transform(df): DataFrame
        -_with_path_meta(): DataFrame
    }
    Transformer <|-- DicomMetadataExtractor
    Transformer <|-- DicomThumbnailExtractor
    Transformer <|-- DicomPillowThumbnailExtractor
    Transformer <|-- DicomPatcher
    Transformer <|-- PathExtractor
    Transformer <|-- TagExtractor

    PathExtractor: -check_input_type()
    TagExtractor: -check_input_type()
    DicomMetadataExtractor: -check_input_type()
    DicomMetadataExtractor: -_transform(DataFrame)
    DicomThumbnailExtractor: -check_input_type()
    DicomThumbnailExtractor: -_transform(DataFrame)
    DicomPillowThumbnailExtractor: -check_input_type()
    DicomPillowThumbnailExtractor: -_transform(DataFrame)
    DicomPatcher: -_transform(DataFrame)

    PathExtractor: -_transform(DataFrame)
    TagExtractor: -_transform(DataFrame)
    
    DicomMetadataExtractor --> Catalog
    DicomMetadataExtractor ..> dicom_meta_udf
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
      bigint	rowId PK
      string	path
      timestamp	modificationTime
      bigint	length
      string	relative_path
      string	local_path
      string	extension
      array_string	path_tags
      string	meta
      boolean	is_anon
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
## Licensing

&copy; 2022 Databricks, Inc. All rights reserved. The source in this notebook is provided subject to the Databricks License [https://databricks.com/db-license-source].  All included or referenced third party libraries are subject to the licenses set forth below.

| library              | purpose                             | license                       | source                                                  |
|----------------------|-------------------------------------|-------------------------------|---------------------------------------------------------|
| databricks.pixels    | Scale out image processong Spark    | Databricks                    | https://github.com/databricks-industry-solutions/pixels |
| pydicom              | Reading Dicom file wrapper          | MIT                           | https://github.com/pydicom/pydicom                      |
| python-gdcm          | Install gdcm C++ libraries          | Apache Software License (BSD) | https://github.com/tfmoraes/python-gdcm                 |
| gdcm                 | Manage Dicom files.                 | BSD                           | https://gdcm.sourceforge.net/wiki/index.php/Main_Page   |
| s3fs                 | Resolve s3:// paths                 | BSD 3-Clause                  | https://github.com/fsspec/s3fs                          |
| pandas               | Pandas UDFs                         | BSD License (BSD-3-Clause)    | https://github.com/pandas-dev/pandas                    |
