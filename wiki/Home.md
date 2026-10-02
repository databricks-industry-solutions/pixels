# Pixels Wiki

**Pixels** is a Databricks Industry Solutions accelerator for medical imaging (DICOM). It indexes imaging files stored in cloud storage or Unity Catalog Volumes into a Delta table (the **object catalog**), extracts DICOM headers as queryable `VARIANT` metadata, and on top of that ships DICOMweb apps, an OHIF viewer, Vista3D model serving, a Lakeview dashboard and an AI/BI Genie space.

This wiki is the reference for the Python library (`dbx.pixels`). For deploying the full stack, see [`docs/INSTALL.md`](https://github.com/databricks-industry-solutions/pixels/blob/main/docs/INSTALL.md).

## The core flow

Every Pixels pipeline follows the same three steps:

```python
from dbx.pixels import Catalog
from dbx.pixels.dicom import DicomMetaExtractor

catalog = Catalog(spark, table="main.pixels_solacc.object_catalog",
                  volume="main.pixels_solacc.pixels_volume")          # 1. configure

catalog_df = catalog.catalog("/Volumes/main/pixels_solacc/landing/")   # 2. discover files
meta_df = DicomMetaExtractor(catalog, permissive=True,
                             remove_un_tags=True).transform(catalog_df)  # 3. extract DICOM headers

catalog.save(meta_df)                                                 # persist to Delta
```

| Step | Class | What it does |
|------|-------|--------------|
| Discover | [`Catalog.catalog()`](Ingestion) | Lists files (batch, streaming or managed file events), optionally unzips archives, derives path columns |
| Extract | [`DicomMetaExtractor`](Metadata-Extraction) | Reads each DICOM header in parallel and adds `meta`, `study_uid` and `series_uid` columns |
| Persist | [`Catalog.save()`](Ingestion#saving-and-loading) | Writes the result to the object catalog Delta table, liquid-clustered by `study_uid` |

## Pages

- **[Ingestion](Ingestion)**: the `Catalog` class, how batch, streaming and managed file events differ, when to use each, and every parameter
- **[Metadata Extraction](Metadata-Extraction)**: the `DicomMetaExtractor` class, its parameters, output format, and how to query the `meta` column
- **[Release Notes](Release-Notes)**: what changed in each release, including unreleased changes on `main`

More pages are planned for anonymization, redaction, thumbnails, DICOMweb, OHIF/MONAI and NIfTI overlays.
