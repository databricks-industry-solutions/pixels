# Whole Slide Imaging: `dbx.pixels.wsi`

`dbx.pixels.wsi` brings digital pathology into the object catalog. It discovers **whole slide images** (WSI) in a Unity Catalog Volume, extracts their metadata into a `meta` VARIANT column, saves them to Delta, and detects PHI in slide labels and metadata.

A whole slide image is a scanned glass pathology slide: one very large 2D image (often tens of thousands of pixels on a side) stored as a multi-resolution pyramid, usually with a small **label** image (the printed slide label) and a **macro** image (an overview photo of the whole slide).

Viewing slides (tile serving and a slide viewer) isn't part of the package yet. See [Known limitations](#known-limitations).

---

## The flow

It follows the same steps as the [DICOM flow](Home#the-core-flow):

```python
from dbx.pixels.wsi import WSICatalog, WSIMetaExtractor

catalog = WSICatalog(spark, table="main.pixels.wsi_object_catalog")   # 1. configure

catalog_df = catalog.catalog("/Volumes/main/pixels/pixels_volume/wsi")  # 2. discover slides
meta_df = WSIMetaExtractor(catalog).transform(catalog_df)              # 3. extract metadata

catalog.save(meta_df, mode="overwrite")                                # persist to Delta
```

| Step | Class | What it does |
|------|-------|--------------|
| Discover | `WSICatalog.catalog()` | Lists slide files of every supported extension (any case), one row per file |
| Extract | `WSIMetaExtractor` | Reads each slide's header with OpenSlide (or tifffile) and adds `meta` and `case_id` |
| Persist | `WSICatalog.save()` | Writes to Delta. See [Clustering](#clustering) |
| Detect PHI (optional) | `WSIVLMPhiDetector` | Sends label, macro and tissue images to a vision model and returns the PHI it finds |

Metadata extraction reads slide headers and small associated images only. It never loads full-resolution pixel data, so slide size doesn't affect ingest memory.

---

## Supported formats

Slides are discovered by extension, in any case (`slide.svs`, `SLIDE01.SVS`): `.svs`, `.tif`, `.tiff`, `.ndpi`, `.mrxs`, `.vms`, `.vmu`, `.scn`, `.svslide`, `.bif`.

Each file is read with **OpenSlide** when it recognizes the format (Aperio, Hamamatsu, Leica, MIRAX, Philips, Sakura, Trestle, Ventana, tiled generic TIFF). Files OpenSlide can't open, such as plain non-tiled TIFFs, fall back to **tifffile**. The `_wsi_backend` field in `meta` records which reader was used.

| Format | Tested in Pixels |
|--------|------------------|
| Aperio SVS | Yes |
| Hamamatsu NDPI | Yes (up to 6.9 GB) |
| Philips TIFF | Yes (3.3 GB) |
| Ventana BIF | Yes (3.9 GB) |
| Generic TIFF (`.tiff`, `.tif`), tiled and plain | Yes |
| Leica SCN, MIRAX MRXS, Sakura SVSLIDE, Trestle | Supported by OpenSlide, not yet tested |

MRXS slides span several files; keep the companion folder next to the `.mrxs` file.

---

## Installation

The WSI libraries are an optional extra, so the DICOM deployment stays lean:

| Extra | Packages | Needed for |
|-------|----------|-----------|
| `wsi` | `openslide-python`, `openslide-bin`, `tifffile` | Everything on this page. Installs cleanly on serverless. |
| `wsi-codecs` | `imagecodecs` | Only decoding pixels of **compressed generic TIFFs** (label, macro or thumbnail extraction on non-OpenSlide TIFFs). Not needed for OpenSlide formats or metadata. May not build on serverless environment 5. |

```bash
pip install databricks-pixels[wsi]     # or databricks-pixels[wsi,wsi-codecs]
```

The notebooks in [`notebooks/wsi/`](https://github.com/databricks-industry-solutions/pixels/tree/main/notebooks/wsi) load the code from the repo's `src/` folder and install only the WSI libraries, so they work from a Git folder checkout.

---

## Ingesting slides

### With the notebook

Open [`notebooks/wsi/01-ingest-wsi.py`](https://github.com/databricks-industry-solutions/pixels/blob/main/notebooks/wsi/01-ingest-wsi.py) and set the widgets at the top, or pass them as job parameters:

| Widget | Default | Meaning |
|--------|---------|---------|
| `table` | `main.pixels.wsi_object_catalog` | Delta table to write slide metadata to |
| `volume` | `main.pixels.pixels_volume` | UC Volume for checkpoints and scratch files |
| `source_paths` | `/Volumes/main/pixels/pixels_volume/wsi` | Folder(s) containing slides, comma-separated |

Run all cells. The notebook catalogs every slide in the source folders, extracts metadata, overwrites the table, and shows a vendor breakdown.

### `WSICatalog`

```python
from dbx.pixels.wsi import WSICatalog

catalog = WSICatalog(spark, table="main.pixels.wsi_object_catalog",
                     volume="main.pixels.pixels_volume")
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `spark` | `SparkSession` | *required* | Active Spark session. |
| `table` | `str` | *required* | Fully qualified name of the WSI catalog table. |
| `volume` | `str` | `<catalog>.<schema>.pixels_volume` | UC Volume for checkpoints and scratch files, in the table's catalog and schema by default. Slides themselves can live anywhere. |

`WSICatalog` extends [`Catalog`](Ingestion), so everything on the Ingestion page applies: batch vs streaming vs managed file events, `save()`, `load()`.

### `catalog()`

```python
df = catalog.catalog("/Volumes/main/pixels/pixels_volume/wsi")          # all WSI extensions
df = catalog.catalog(path, pattern="*.svs")                            # one pattern
df = catalog.catalog(path, patterns=["*.svs", "*.ndpi"])               # several patterns
df = catalog.catalog(path, streaming=True)                             # Auto Loader
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `path` | `str` | *required* | Folder to scan (recursively by default). |
| `pattern` | `str` | `None` | A single glob pattern. Used exactly as given. |
| `patterns` | `list[str]` | all WSI extensions, any case | Glob patterns to scan. Each pattern is a separate scan and the results are unioned. Patterns you pass are used exactly as given. |
| `**kwargs` | | | Any [`Catalog.catalog()`](Ingestion#catalog-discover-files) option: `recurse`, `streaming`, trigger and Auto Loader options. |

Errors from a scan (a missing path, no permission) are raised. An extension with no matching files adds no rows.

### Re-running after adding slides

A batch `catalog()` lists the whole folder again on every run. When you re-run in the **same attached notebook session** after adding files, the listing can come from the session's earlier scan and miss the new files, with no error. Detach and re-attach the notebook, or run it as a job, before re-running.

For folders that keep receiving slides, use `streaming=True`. The checkpoint records processed files, so each run picks up only the new ones (tested: a second run in a new session wrote only the one added slide). See [Streaming](Ingestion#streaming-auto-loader-directory-listing) for the caveats at scale.

---

## What gets written

One row per slide, with the standard catalog columns (see [Output columns](Ingestion#output-columns)) plus `meta` and `case_id` (see [Clustering](#clustering)). `modificationTime` is the file's last-modified time on the volume, not when the row was written. Use `DESCRIBE HISTORY` on the table to see write times.

`meta` holds every property the reader exposes (for OpenSlide, vendor keys such as `aperio.*` and `hamamatsu.*`), plus these derived fields:

| Field | Description |
|-------|-------------|
| `_wsi_vendor`, `_wsi_format` | Vendor (e.g. `aperio`) and readable format (e.g. `Aperio SVS`) |
| `_wsi_backend` | `openslide` or `tifffile` |
| `_wsi_width`, `_wsi_height` | Full-resolution size in pixels |
| `_wsi_level_count`, `_wsi_level_dimensions`, `_wsi_level_downsamples` | Pyramid levels |
| `_wsi_mpp_x`, `_wsi_mpp_y` | Microns per pixel, when the file provides it |
| `_wsi_objective_power` | Scanner objective magnification, when provided |
| `_wsi_has_label`, `_wsi_has_macro`, `_wsi_has_thumbnail`, `_wsi_associated_images` | Associated images present in the file |
| `phi_tag_report` | Metadata keys classified as PHI or questionable (see [PHI detection](#phi-detection)) |
| `error` | Present instead of the fields above when a file couldn't be read |

```sql
SELECT element_at(split(path, '/'), -1) AS file,
       meta:_wsi_format::string          AS format,
       meta:_wsi_backend::string         AS reader,
       meta:_wsi_width::int              AS w,
       meta:_wsi_height::int             AS h,
       meta:_wsi_level_count::int        AS levels,
       meta:_wsi_mpp_x::double           AS microns_per_px
FROM main.pixels.wsi_object_catalog
ORDER BY file;
```

Find files that couldn't be read:

```sql
SELECT path, meta:error::string AS error
FROM main.pixels.wsi_object_catalog
WHERE meta:error IS NOT NULL;
```

### Clustering

`WSIMetaExtractor` adds a **`case_id`** column, the WSI counterpart of DICOM's `study_uid`, so a case's slides can be stored together:

1. the slide **barcode**, when the file has one (`openslide.barcode`, e.g. Philips; labs often encode the accession number in it), otherwise
2. the name of the **folder that contains the slide**, so `/Volumes/…/S26-10457/A2-1.svs` gets `S26-10457`.

The folder rule assumes slides are stored in a folder per case. Slides from many cases in one flat folder all get that folder's name. Files that can't be read still get a `case_id` from their folder.

`WSICatalog` and `Catalog` take a `cluster_by` argument, `"auto"` by default (see [Ingestion](Ingestion#constructor)). `"auto"` clusters by `study_uid` when the column exists (DICOM), else by `case_id` (WSI), else not at all. Pass a column name or list to choose other columns, or `None` to disable clustering.

To derive the case differently, for example with your lab's naming pattern, replace the column before saving:

```python
from pyspark.sql import functions as F
from dbx.pixels.wsi import WSICatalog, WSIMetaExtractor

catalog = WSICatalog(spark, table="main.pixels.wsi_object_catalog")
df = WSIMetaExtractor(catalog).transform(catalog.catalog("/Volumes/main/pixels/pixels_volume/wsi"))

# Case number anywhere in the path, e.g. .../2026/S26-10457_A2-1.svs -> S26-10457
df = df.withColumn("case_id", F.expr(r"nullif(regexp_extract(path, '(S[0-9]{2}-[0-9]+)', 1), '')"))

catalog.save(df, mode="overwrite")
```

Clustering columns are set when the table is created; use `mode="overwrite"` (or `ALTER TABLE … CLUSTER BY`) to change them on an existing table. Case and accession numbers are PHI, so treat `case_id` accordingly.

---

## PHI detection

Slides can carry PHI in two places.

**Metadata.** `phi_tag_report` in `meta` lists keys classified as `PHI` (for example `aperio.Patient`) or `QUESTIONABLE`. Classification fails closed: any key that isn't a known technical field (OpenSlide's own `openslide.*` keys, structural TIFF tags, listed scanner settings) is reported as `QUESTIONABLE`. That includes vendor keys the package doesn't know and `tiff.ImageDescription`, which holds the full Aperio header.

```sql
SELECT element_at(split(path, '/'), -1) AS file,
       r.tag, r.classification
FROM main.pixels.wsi_object_catalog,
     LATERAL variant_explode(meta:phi_tag_report) AS t(pos, key, value),
     LATERAL (SELECT value:tag::string AS tag, value:classification::string AS classification) AS r
ORDER BY file, r.classification;
```

`scrub_image_description(desc)` keeps only technical values in an Aperio description (`AppMag`, `MPP`, scan geometry), replaces every other value with `REDACTED`, and returns `REDACTED` for free-text descriptions.

**Images.** The printed label, and sometimes the macro image, can show a patient's name, date of birth, MRN, accession number or a barcode. [`notebooks/wsi/02-phi-pixel-detection.py`](https://github.com/databricks-industry-solutions/pixels/blob/main/notebooks/wsi/02-phi-pixel-detection.py) sends them to a vision-capable model serving endpoint:

| Widget | Default | Meaning |
|--------|---------|---------|
| `table` | `main.pixels.wsi_object_catalog` | The table written by `01-ingest-wsi` |
| `vlm_endpoint` | `databricks-claude-sonnet-4-5` | Any vision-capable serving endpoint |
| `results_table` | `<table>_phi_results` | Delta table the scan results are written to |

For each slide it scans the **label** and **macro** images (only when the slide has them) and the **tissue** thumbnail, and records the PHI it finds per image. Results are written to `results_table` once and the summary reads from that table, so each image goes to the model once per run. Foundation Model API endpoint names change as models are released and retired; if the default is missing, pick another vision model from **Serving** in your workspace.

This step **detects** PHI. It doesn't remove it yet.

---

## Testing

[`tests/dbx/test_wsi.py`](https://github.com/databricks-industry-solutions/pixels/blob/main/tests/dbx/test_wsi.py) covers PHI tag classification, scrubbing, image extraction, metadata extraction (OpenSlide and tifffile), discovery patterns and parsing of the model's answer. It needs no Spark session or workspace, and prepares its own samples: it downloads one small public slide (`CMU-1-Small-Region.svs`, 1.8 MB) and generates two TIFFs. Without network access, the SVS-based tests skip.

```bash
pip install -e '.[wsi]' pytest
pytest tests/dbx/test_wsi.py --noconftest --import-mode=append -v
```

`--noconftest` skips the repo-level conftest (it opens a Databricks Connect session), and `--import-mode=append` stops `tests/dbx` from shadowing the `dbx` package in `src/`. To test your own slides, set `PIXELS_WSI_SVS_DIR` and `PIXELS_WSI_TIFF_DIRS` (comma-separated) to their folders. More public samples: [OpenSlide test data](https://openslide.cs.cmu.edu/download/openslide-testdata/).

---

## Large slides

Measured on Databricks serverless with public OpenSlide test slides read from a UC Volume:

| Slide | Size | Levels | Metadata extraction | Tissue thumbnail (768 px) | Peak memory |
|-------|------|--------|---------------------|---------------------------|-------------|
| Hamamatsu NDPI (`Hamamatsu-1.ndpi`) | 6.9 GB | 9 | 3.1 s | 140 s | 259 MB |
| Ventana BIF (`OS-1.bif`) | 3.9 GB | 10 | 1.8 s | 0.3 s | 271 MB |
| Philips TIFF (`Philips-3.tiff`) | 3.3 GB | 9 | 2.2 s | 0.2 s | 228 MB |
| Hamamatsu NDPI (`OS-1.ndpi`) | 2.0 GB | 13 | 1.9 s | 11 s | 242 MB |

- **Ingest doesn't depend on slide size.** Metadata extraction reads headers only, so it takes a few seconds and about 250 MB per slide whether the file is 2 GB or 7 GB. The Spark pipeline (`WSICatalog` + `WSIMetaExtractor` + `save()`) cataloged all four slides (16 GB) in 48 s. Files over Spark's 2 GB `binaryFile` limit are fine, because file contents are never read into the table.
- **Thumbnails of large NDPI slides are slow.** NDPI files store few real pyramid levels, so OpenSlide decodes large JPEG strips to build a small image: about 11 s for a 2 GB slide and over 2 minutes for a 7 GB one. Memory stays flat. Label and macro images are unaffected (an NDPI macro takes 0.2 s). Plan for this when scanning NDPI tissue thumbnails for PHI.

---

## Known limitations

- **No viewing yet.** No tile-serving routes in the gateway and no slide viewer. A follow-up will choose between a tile adapter in the gateway and storing slides as DICOM-WSI for the OHIF microscopy viewer.
- **PHI is detected, not removed.** Nothing yet strips label or macro images, scrubs metadata in the files, or writes de-identified copies.
- **Not part of the bundle install.** The install job doesn't create a WSI table or ingest sample slides, and WSI metadata isn't synced to Lakebase. When WSI joins the bundle, it should also create a dedicated WSI volume; until then WSI uses `pixels_volume`.
- **Re-running in the same session can miss new files.** See [Re-running after adding slides](#re-running-after-adding-slides).
- **Streaming at scale.** `WSICatalog` runs one Auto Loader source per extension (10 in total), so each trigger lists the folder 10 times, and the de-duplication step keeps state that grows with every file seen. Managed file events (`useManagedFileEvents=True`) avoid the repeated listing.
- **Microns per pixel can be wrong for generic TIFFs.** The value comes from the file's own resolution tags, which some converters fill with placeholders (OpenSlide's `CMU-1.tiff` sample reports 1000 µm/px).
- **Missing label or macro images fall back to the tissue thumbnail.** `wsi_to_image(series="label")` returns the tissue thumbnail, with a warning, when a slide has no label. Check `_wsi_has_label` / `_wsi_has_macro` first, as the PHI notebook does.
- **Compressed generic TIFF pixels need `imagecodecs`**, which may not install on serverless.
- **Slow tissue thumbnails for large NDPI slides.** See [Large slides](#large-slides).
- **No case or study key in the files.** Native WSI formats have no equivalent of DICOM's `study_uid`; only some carry a slide barcode (Philips does; NDPI, Ventana, Aperio and generic TIFF don't). `case_id` therefore falls back to the slide's folder, which only identifies the case when slides are stored in a folder per case. See [Clustering](#clustering).
