# Whole Slide Imaging (WSI) - Ingestion Guide

This document covers the `dbx.pixels.wsi` package: cataloging digital pathology
whole slide images (WSI) into Delta, extracting their metadata, and detecting PHI
in their label and macro images.

It is the pathology counterpart to the DICOM ingestion path. Viewing slides
(tile serving and a slide viewer) is **not** part of this package yet; see
[Known limitations](#8-known-limitations).

---

## Table of Contents

1. [Overview](#1-overview)
2. [Supported Formats](#2-supported-formats)
3. [Dependencies](#3-dependencies)
4. [Ingesting Slides](#4-ingesting-slides)
5. [What Gets Written](#5-what-gets-written)
6. [PHI Detection](#6-phi-detection)
7. [Testing](#7-testing)
8. [Known Limitations](#8-known-limitations)
9. [File Inventory](#9-file-inventory)

---

## 1. Overview

A whole slide image is a scanned glass pathology slide: one very large 2D image
(often tens of thousands of pixels on a side) stored as a multi-resolution
pyramid, usually with a small **label** image (the printed slide label) and a
**macro** image (an overview photo of the whole slide).

The pipeline mirrors the DICOM one:

```
UC Volume (slides)
  └─ WSICatalog.catalog()        find slide files, one row per file
       └─ WSIMetaExtractor        read metadata into a `meta` VARIANT column
            └─ WSICatalog.save()  write to a Delta table
                 └─ WSIVLMPhiDetector (optional)  scan label/macro/tissue images for PHI
```

Metadata extraction only reads slide headers and small associated images; it
never loads full-resolution pixel data.

## 2. Supported Formats

Files are discovered by extension: `.svs`, `.tif`, `.tiff`, `.ndpi`, `.mrxs`,
`.vms`, `.vmu`, `.scn`, `.svslide`, `.bif`.

Each file is read with **OpenSlide** when it recognizes the format (Aperio,
Hamamatsu, Leica, MIRAX, Philips, Sakura, Trestle, Ventana, tiled generic TIFF).
Files OpenSlide can't open (for example, plain non-tiled TIFFs) fall back to
**tifffile**. The `_wsi_backend` field in `meta` records which reader was used.

Tested end to end on Databricks serverless with Aperio SVS, Hamamatsu NDPI,
OpenSlide generic TIFF (`.tiff` and `.tif`), and plain TIFF. The other vendor
formats are supported by OpenSlide but haven't been tested in Pixels yet.

## 3. Dependencies

The WSI libraries are an optional extra so the DICOM deployment stays lean:

| Extra | Packages | Needed for |
|-------|----------|-----------|
| `wsi` | `openslide-python`, `openslide-bin`, `tifffile` | Everything in this guide. Installs cleanly on serverless. |
| `wsi-codecs` | `imagecodecs` | Only decoding pixels of **compressed generic TIFFs** (label/macro/thumbnail extraction on non-OpenSlide TIFFs). Not needed for OpenSlide formats or metadata. May not build on serverless environment v5. |

```bash
pip install databricks-pixels[wsi]            # or [wsi,wsi-codecs]
```

The notebooks in `notebooks/wsi/` load the Pixels code from this repo's `src/`
folder and install only the WSI libraries, so they work from a Git folder
checkout before a release that includes the `wsi` extra.

## 4. Ingesting Slides

### With the notebook

Open `notebooks/wsi/01-ingest-wsi.py` and set the widgets at the top (or pass
them as job parameters):

| Widget | Default | Meaning |
|--------|---------|---------|
| `table` | `main.pixels.wsi_object_catalog` | Delta table to write slide metadata to |
| `volume` | `main.pixels.pixels_volume` | UC Volume used for checkpoints and scratch files |
| `source_paths` | `/Volumes/main/pixels/pixels_volume/wsi` | Folder(s) containing slides, comma-separated |

Then run all cells. The notebook catalogs every slide in the source folders,
extracts metadata, overwrites the table, and shows a vendor breakdown.

### From Python

```python
from dbx.pixels.wsi import WSICatalog, WSIMetaExtractor

catalog = WSICatalog(spark, table="main.pixels.wsi_object_catalog",
                     volume="main.pixels.pixels_volume")
df = catalog.catalog("/Volumes/main/pixels/pixels_volume/wsi")   # all WSI extensions
df = WSIMetaExtractor(catalog).transform(df)
catalog.save(df, mode="overwrite")
```

`volume` is optional; it defaults to `pixels_volume` in the table's catalog and
schema, the volume the bundle creates.

Pass `pattern="*.svs"` (or `patterns=[...]`) to `catalog()` to limit the
extensions scanned. The default patterns match extensions in any case
(`SLIDE01.SVS`, `case.Ndpi`); patterns you pass are used exactly as given.
Errors from the scan (a missing path, no permission) are raised; an extension
with no matching files simply adds no rows. `WSICatalog` accepts the same options as the base
`Catalog` (`recurse`, `streaming`, trigger and Auto Loader options); see the
`Catalog.catalog()` docstring.

### Re-running after adding slides

A batch `catalog()` re-scans the whole folder. When you re-run in the **same
attached notebook session** after adding files, the scan can reuse the
session's earlier file listing and miss the new files without raising an
error. Detach and re-attach the notebook, or run it as a job, before
re-running. See [Known limitations](#8-known-limitations).

## 5. What Gets Written

One row per slide file, with the standard catalog columns (`path`,
`modificationTime`, `length`, `original_path`, `relative_path`, `local_path`,
`extension`, `file_type`, `path_tags`) plus a `meta` VARIANT column.
`modificationTime` is the file's last-modified time on the volume, not the time
the row was written; use `DESCRIBE HISTORY` on the table to see write times.

`meta` contains every property the reader exposes (for OpenSlide, the vendor
keys such as `aperio.*` and `hamamatsu.*`), plus derived fields:

| Field | Description |
|-------|-------------|
| `_wsi_vendor`, `_wsi_format` | Vendor (e.g. `aperio`) and human-readable format (e.g. `Aperio SVS`) |
| `_wsi_backend` | `openslide` or `tifffile` |
| `_wsi_width`, `_wsi_height` | Full-resolution size in pixels |
| `_wsi_level_count`, `_wsi_level_dimensions`, `_wsi_level_downsamples` | Pyramid levels |
| `_wsi_mpp_x`, `_wsi_mpp_y` | Microns per pixel, when the file provides it |
| `_wsi_objective_power` | Scanner objective magnification, when provided |
| `_wsi_has_label`, `_wsi_has_macro`, `_wsi_has_thumbnail`, `_wsi_associated_images` | Associated images present in the file |
| `phi_tag_report` | Metadata keys classified as PHI or questionable |
| `error` | Present instead of the fields above when a file couldn't be read |

```sql
SELECT element_at(split(path, '/'), -1) AS file,
       meta:_wsi_format::string  AS format,
       meta:_wsi_backend::string AS reader,
       meta:_wsi_width::int AS w, meta:_wsi_height::int AS h,
       meta:_wsi_level_count::int AS levels,
       meta:_wsi_mpp_x::double AS microns_per_px
FROM main.pixels.wsi_object_catalog;
```

**Clustering.** `Catalog` takes a `cluster_by` argument, default `"auto"`.
With `"auto"`, the table is liquid-clustered by `study_uid` when that column
exists (DICOM) and written without clustering when it doesn't (WSI). Pass a
column name or list to choose clustering columns, or `None` to disable it.

## 6. PHI Detection

Slides can carry PHI in two places:

- **Metadata.** `phi_tag_report` in `meta` lists keys classified as PHI (for
  example `aperio.Patient`) or questionable. Classification fails closed: any
  key that isn't a known technical field (OpenSlide's own `openslide.*` keys,
  structural TIFF tags, and listed scanner settings) is reported as
  `QUESTIONABLE`, including vendor keys the package doesn't know and
  `tiff.ImageDescription`, which holds the full Aperio header.
  `scrub_image_description()` keeps only technical values in an Aperio
  description and returns `REDACTED` for free-text descriptions.
- **Images.** The printed label, and sometimes the macro image, can show the
  patient's name, date of birth, MRN, accession number or a barcode.

`notebooks/wsi/02-phi-pixel-detection.py` scans images with a vision-capable
model serving endpoint. Widgets:

| Widget | Default | Meaning |
|--------|---------|---------|
| `table` | `main.pixels.wsi_object_catalog` | The table written by `01-ingest-wsi` |
| `vlm_endpoint` | `databricks-claude-sonnet-4-5` | Any vision-capable serving endpoint |
| `results_table` | `<table>_phi_results` | Delta table the scan results are written to |

For each slide it scans the **label** and **macro** images (only when the
slide has them) and the **tissue** thumbnail, and reports the PHI entities
found per image. Results are written to `results_table` once and the summary
reads from that table, so each image is sent to the model only once per run.
Foundation Model API endpoint names change as models are
released and retired; if the default is missing, pick another vision model
from **Serving** in your workspace.

This step **detects** PHI. It does not yet remove it (see
[Known limitations](#8-known-limitations)).

## 7. Testing

`tests/dbx/test_wsi.py` covers PHI tag classification, image extraction,
metadata extraction (OpenSlide and tifffile), and parsing of the model's PHI
answer. The tests don't need Spark or a workspace.

Point them at folders of sample slides with environment variables; tests that
need files skip when these are unset:

```bash
pip install -e '.[wsi]' pytest
PIXELS_WSI_SVS_DIR=/path/to/svs PIXELS_WSI_TIFF_DIRS=/path/to/tiff \
    pytest tests/dbx/test_wsi.py --noconftest --import-mode=append -v
```

`--noconftest` skips the repo-level conftest (it opens a Databricks Connect
session), and `--import-mode=append` stops `tests/dbx` from shadowing the
`dbx` package in `src/`. Public sample slides are available from the
[OpenSlide test data](https://openslide.cs.cmu.edu/download/openslide-testdata/);
`CMU-1-Small-Region.svs` (1.8 MB) is a good starting point. The CI test
notebook (`pytest_databricks.py`) downloads that file and generates two small
TIFFs before running the tests.

## 8. Known Limitations

- **No viewing yet.** There are no tile-serving routes in the gateway and no
  slide viewer. A follow-up will choose between a tile adapter in the gateway
  and storing slides as DICOM-WSI for the existing OHIF microscopy viewer.
- **PHI is detected, not removed.** Nothing yet strips label/macro images,
  scrubs PHI metadata, or writes de-identified copies of slides.
- **Not part of the bundle install.** The install job doesn't create a WSI
  table or ingest sample slides, and WSI metadata isn't synced to Lakebase.
  When WSI is added to the bundle, it should also create a dedicated WSI
  volume; until then WSI uses the bundle's `pixels_volume`.
- **Re-running in the same session can miss new files.** See
  [Re-running after adding slides](#re-running-after-adding-slides). For
  folders that keep receiving files, use streaming mode (`streaming=True`),
  which records processed files in a checkpoint and picks up only new ones on
  each run (tested: a second run in a new session wrote only the one added
  slide). Two caveats at scale: `WSICatalog` runs one Auto Loader source per
  file extension (10 in total), so each trigger lists the source folder 10
  times; and the `dropDuplicates(["path"])` step keeps a de-duplication state
  that grows with every file seen. Managed file events
  (`useManagedFileEvents=True`) avoid the repeated listing on large folders.
- **Microns per pixel can be wrong for generic TIFFs.** The value comes from the
  file's own TIFF resolution tags, which some converters fill with placeholders.
  For example, OpenSlide's `CMU-1.tiff` sample reports 1000 µm/px because it
  declares 10 pixels per centimeter.
- **Missing label/macro images fall back to the tissue thumbnail.**
  `wsi_to_image(series="label")` returns the tissue thumbnail (and logs a
  warning) when a slide has no label. The PHI notebook checks `_wsi_has_label`
  and `_wsi_has_macro` first; do the same when calling it directly.
- **Compressed generic TIFF pixels need `imagecodecs`**, which may not install
  on serverless (see [Dependencies](#3-dependencies)).
- **Vendor coverage.** Only SVS, NDPI and generic/plain TIFF have been tested.
  MRXS slides span multiple files and need their companion folder next to the
  `.mrxs` file.

## 9. File Inventory

| Path | Purpose |
|------|---------|
| `src/dbx/pixels/wsi/catalog.py` | `WSICatalog`: discovery across all WSI extensions |
| `src/dbx/pixels/wsi/wsi_meta_extractor.py` | `WSIMetaExtractor`: metadata into `meta` |
| `src/dbx/pixels/wsi/wsi_utils.py` | `wsi_to_image`, format detection, property reading |
| `src/dbx/pixels/wsi/wsi_phi_tags.py` | PHI tag classification, supported extensions |
| `src/dbx/pixels/wsi/wsi_vlm_phi_detector.py` | `WSIVLMPhiDetector`: PHI detection with a vision model |
| `notebooks/wsi/01-ingest-wsi.py` | Ingestion notebook |
| `notebooks/wsi/02-phi-pixel-detection.py` | PHI detection notebook |
| `tests/dbx/test_wsi.py` | Unit tests |
