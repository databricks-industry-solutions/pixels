<div bgcolor="white">
  <img src=https://hls-eng-data-public.s3.amazonaws.com/img/Databricks_HLS.png width="380px" align="right">
</div>

# `pixels` Solution Accelerator
✅  Ingest and index DICOM image metadata (.dcm and from zip archives)
</br> ✅  Analyze DICOM image metadata with SQL and Machine Learing.
</br> ✅  View, segment, label DICOM Images with OHIF viewer integrated into Lakehouse Apps and Databricks security model. 
</br> ✅  One button push to lauch model training from OHIF viewer.
</br> ✅  NVIDIA's [MONAI](https://docs.nvidia.com/monai/index.html) Integration, AI to automatically segment medical images and train custom models.
</br> ✅  Leverage Databricks' [Model Serving](https://docs.databricks.com/en/machine-learning/model-serving/index.html), hosting NVIDIA's MONAI in serverless GPU enabled clusters for real-time segmentation.

---
## Secure Lakehouse integrated DICOM Viewer powered by OHIF
<img src="https://github.com/databricks-industry-solutions/pixels/blob/main/images/LHA_AUTOSEG.gif?raw=true" alt="MONAI_AUTOSEG" height="650"/></br>

---
## Run SQL queries over DICOM metadata
![Analyze](https://github.com/databricks-industry-solutions/pixels/blob/main/images/DICOM-analyze-with-SQL.png?raw=true)

---
## DICOM data ingestion is easy

```python
# import Pixels Catalog (indexer) and DICOM transformers & utilities
from dbx.pixels import Catalog                              # 01
from dbx.pixels.dicom import *                              # 02

# catalog all your files
catalog = Catalog(spark)                                    # 03
catalog_df = catalog.catalog(<path>)                        # 04

# extract the DICOM metadata
meta_df = DicomMetaExtractor(catalog).transform(catalog_df) # 05
 
# extract DICOM image thumbnails (optional)
thumbnail_df = DicomThumbnailExtractor().transform(meta_df) # 06
 
# save your work for SQL access
catalog.save(thumbnail_df)                                  # 07
```
You'll find this example in [01-dcm-demo](https://github.com/databricks-industry-solutions/pixels/blob/main/01-dcm-demo.py) which does:


---
## Architecture
![image](https://github.com/user-attachments/assets/ae5e27e0-1add-4db8-99d1-9c35adb90cbf)

---
## Getting started

To run this accelerator, clone this repo into a Databricks workspace. Attach the `RUNME` notebook to Serverless Compute or any cluster running a DBR 14.3 LTS or later runtime, and execute the notebook via Run-All. A multi-step-job describing the accelerator pipeline will be created, and the link will be provided. Execute the multi-step-job to see how the pipeline runs. The job configuration is written in the RUNME notebook in json format. The cost associated with running the accelerator is the user's responsibility.

## Incremental processing
Pixels allows you to ingest DICOM files in a streaming fashion using [autoloader](https://docs.databricks.com/en/ingestion/auto-loader/unity-catalog.html) capability.
To enable incremental processing you need to set `streaming` and `streamCheckpointBasePath` as follows:
```python
catalog_df = catalog.catalog(path, streaming=True, streamCheckpointBasePath=<checkpointPath>)
```

## Built-in unzip
Automatically extracts zip files in the defined volume path.
If extractZip is not enabled then zip files will be ignored.
To enable unzip capability you need to set `extractZip`. The parameter `extractZipBasePath` is optional and the default path will be volume + /unzipped/
```python
catalog_df = catalog.catalog(path, extractZip=True, extractZipBasePath=<unzipPath>)
```
---
## OHIF Viewer
Inside `dbx.pixel` resources folder, a pre-built version of [OHIF Viewer](https://github.com/OHIF/Viewers) with Databricks and [Unity Catalog Volumes](https://docs.databricks.com/en/sql/language-manual/sql-ref-volumes.html) extension is provided. 

All the catalog entries will be available in an easy to use study list.
![Catalog](https://github.com/databricks-industry-solutions/pixels/blob/main/images/ohif_catalog_view.png?raw=true)
Fast and multiple-layer visualization capability.
![CT_View](https://github.com/databricks-industry-solutions/pixels/blob/main/images/ohif_mr_view.png?raw=true)

To start the OHIF Viewer web app you need to:
 - Execute the [06-OHIF-Viewer](https://github.com/databricks-industry-solutions/pixels/blob/main/06-OHIF-Viewer.py) inside a Databricks workspace.
 - Set `table` parameter with full name of you pixels catalog table. Ex: `main.pixels_solacc.object_catalog`
 - Set `sqlWarehouseID`parameter to execute the queries required to collect the records. It's the final section of the `HTTP path` in the `Connection details` tab. Use [Serverless](https://docs.databricks.com/en/admin/sql/warehouse-types.html#sql-warehouse-types) for best performance.

    <img src="https://github.com/databricks-industry-solutions/pixels/blob/main/images/sqlWarehouseID.png?raw=true" alt="sqlWarehouseID"/>

 - Use the link generated in the last notebook to access the OHIF viewer page.

## Save measurements and segmentations
The OHIF Viewer allows you to save back in databricks the measurements and the segmentations created in the viewer.
The metadata will be stored in the object_catalog, and the generated dicom files in the volume under the path `/ohif/exports/`.

<img src="https://github.com/databricks-industry-solutions/pixels/blob/main/images/ohif_save_segm.png?raw=true" alt="OHIF_SAVE_SEG" height="300"/>
<img src="https://github.com/databricks-industry-solutions/pixels/blob/main/images/ohif_save_meas.png?raw=true" alt="OHIF_SAVE_MEAS" height="300"/>
<img src="https://github.com/databricks-industry-solutions/pixels/blob/main/images/ohif_save_result.png?raw=true" alt="OHIF_SAVED" height="300"/>


## MONAILabel Integration

[MONAILabel](https://monai.io/label.html) is an open-source tool designed for interactive medical image labeling. It supports various annotation tasks such as segmentation and classification, providing a seamless experience when integrated with viewers like OHIF that is already available in this solution accelerator.

![MONAI_BTN](https://github.com/databricks-industry-solutions/pixels/blob/main/images/monailabel_result.png?raw=true)
Once the server is running, you can use the OHIF Viewer to interact with your medical images. This integration allows you to leverage advanced annotation capabilities directly within your Databricks environment.

### Key Features
 - Interactive Annotation: Use AI-assisted tools for efficient labeling.
 - Seamless Integration: Work directly within Databricks using a web-based viewer.
 - Customizable Workflows: Tailor the annotation process to fit specific research needs.

### MONAILabel Setup Instructions
To execute the MONAILabel server is mandatory to use a cluster with Databricks Runtime Version of `14.3 LTS ML`. For the best performance use a [GPU-Enabled compute](https://docs.databricks.com/en/compute/gpu.html#gpu-enabled-compute).
#### Start the MONAILabel server
 - Execute the [05-MONAILabel](https://github.com/databricks-industry-solutions/pixels/blob/main/05-MONAILabel.py) inside a Databricks workspace.
 - Set `table` parameter with full name of you pixels catalog table. Ex: `main.pixels_solacc.object_catalog`
 - Set `sqlWarehouseID`parameter to execute the queries required to collect the records. Use [Serverless](https://docs.databricks.com/en/admin/sql/warehouse-types.html#sql-warehouse-types) for best performance.
    <img src="https://github.com/databricks-industry-solutions/pixels/blob/main/images/sqlWarehouseID.png?raw=true" alt="sqlWarehouseID">
#### Open the OHIF Viewer
 - Execute the notebook [06-OHIF-Viewer](https://github.com/databricks-industry-solutions/pixels/blob/main/06-OHIF-Viewer.py) to start the OHIF Viewer with the MONAILabel extension and open the generated link.
 - Select the preferred CT scan study and press on `MONAI Label` button.

    <img src="https://github.com/databricks-industry-solutions/pixels/blob/main/images/monailabel_btn.png?raw=true" alt="MONAI_BTN" height="250"/></br>
#### Connect, execute and save
 - Connect the MONAILabel server using the refresh button.

    <img src="https://github.com/databricks-industry-solutions/pixels/blob/main/images/monailabel_server.png?raw=true" alt="MONAI_SERVER" height="200"/></br>
 - Execute an auto-segmentation task using the Run button and wait for the results to be displayed.

    <img src="https://github.com/databricks-industry-solutions/pixels/blob/main/images/monailabel_autosegm.png?raw=true" alt="MONAI_AUTOSEG" height="650"/></br>
 - Save the final result metadata in the catalog and the generated dicom file in the volume under the path `/ohif/exports/` using the button `Export DICOM SEG`.

This setup enhances your medical image analysis workflow by combining Databricks' computing power with MONAILabel's sophisticated annotation tools.

### Model Serving Instructions

To deploy the MONAILabel server in a Model Serving endpoint we prepared [ModelServing](https://github.com/databricks-industry-solutions/pixels/blob/main/monailabel_model/ModelServing.py), a Databricks notebook designed to initialize the Databricks customized version of the **MONAILabel server** that wraps the server in an **MLflow Python custom model** and registers it for use in a **serving endpoint**.

#### Key Features

- **Model Creation**: Utilizes the MONAILabel auto segmentation model on CT AXIAL images.
- **Unity Catalog Integration**: Adds the model to the Unity Catalog for organized management.
- **Serving Endpoint Deployment**: Deploys the model in a serving endpoint for real-time inference.

#### Auto Segmentation with Lakehouse App and Serving Endpoint

https://github.com/user-attachments/assets/8cf62378-ab39-4a89-86ad-c2f231b7a524

#### Active Learning

https://github.com/user-attachments/assets/17142752-d9b9-434b-b893-b6bc05080f54


## Working with Unity Catalog
Unity Catalog (UC) [volumes](https://docs.databricks.com/en/data-governance/unity-catalog/create-volumes.html) are the recommended approach for providing access to and governing non-tabular data assets in a cloud object storage locations, including DICOM files. Volumes are accessed by using the following format for the path that is passed to the pixels `Catalog` object - 
```
/Volumes/<catalog>/<schema>/<volume>/<path-level-1>/...
```
where `<catalog>`, `<schema>` and `<volume>` reflect the three-level namespace of Unity Catalog. The path field returned by the `Catalog` object reflects the volume file path listed above and subsequent metadata and thumbnail extraction operations will use volumes for accessing files.

DICOM file Ingestion works with Shared, Dedicated and Serverless Compute types.

---
## Contributors
- Douglas Moore @ Databricks
- Emanuele Rinaldi @ Databricks
- Nicole Jingting Lu @ Databricks
- Krishanu Nandy @ Databricks
- May Merkle-Tan @ Databricks
- Ben Russoniello @ Prominence Advisors
- Cal Reynolds @ Databricks


## About `dbx.pixels`
Relibly turn millions of image files into SQL accessible metadata, thumbnails; Enable Deep Learning, AI/BI Dashboarding, Genie Spaces.

- tags: 
dicom, dcm, pre-processing, visualization, repos, sql, python, spark, pyspark, package, image catalog, mamograms, dcm file
---

## About DICOM
![DICOM Image processing](https://dicom.offis.uni-oldenburg.de/images/dicomlogo.gif)
[Per OFFIS computer science institute](https://dicom.offis.uni-oldenburg.de/en/general/dicom-introduction/) 

DICOM® — Digital Imaging and Communications in Medicine — is the international standard for medical images and related information. It defines the formats for medical images that can be exchanged with the data and quality necessary for clinical use.

DICOM® is implemented in almost every radiology, cardiology imaging, and radiotherapy device (X-ray, CT, MRI, ultrasound, etc.), and increasingly in devices in other medical domains such as ophthalmology and dentistry. With hundreds of thousands of medical imaging devices in use, DICOM® is one of the most widely deployed healthcare messaging Standards in the world. There are literally billions of DICOM® images currently in use for clinical care.

Since its first publication in 1993, DICOM® has revolutionized the practice of radiology, allowing the replacement of X-ray film with a fully digital workflow. Much as the Internet has become the platform for new consumer information applications, DICOM® has enabled advanced medical imaging applications that have “changed the face of clinical medicine”. From the emergency department, to cardiac stress testing, to breast cancer detection, DICOM® is the standard that makes medical imaging work — for doctors and for patients.

DICOM® is recognized by the International Organization for Standardization as the ISO 12052 standard.

## Licensing

&copy; 2024 Databricks, Inc. All rights reserved. The source in this notebook is provided subject to the Databricks License [https://databricks.com/db-license-source].  All included or referenced third party libraries are subject to the licenses set forth below.

| library              | purpose                             | license                       | source                                                  |
|----------------------|-------------------------------------|-------------------------------|---------------------------------------------------------|
| dbx.pixels           | Scale out image processong Spark    | Databricks                    | https://github.com/databricks-industry-solutions/pixels |
| pydicom              | Python api for DICOM files          | MIT                           | https://github.com/pydicom/pydicom                      |
| python-gdcm          | Install gdcm C++ libraries          | Apache Software License (BSD) | https://github.com/tfmoraes/python-gdcm                 |
| gdcm                 | Parse DICOM files                   | BSD                           | https://sourceforge.net/projects/gdcm                   |
| s3fs                 | Resolve s3:// paths                 | BSD 3-Clause                  | https://github.com/fsspec/s3fs                          |
| pandas               | Pandas UDFs                         | BSD License (BSD-3-Clause)    | https://github.com/pandas-dev/pandas                    |
| OHIF Viewer          | Medical image viewer                | MIT                           | https://github.com/OHIF/Viewers                         |
| MONAILabel           | Intelligent open source image labeling and learning tool | Apache-2.0 license  | https://github.com/Project-MONAI/MONAILabel |

