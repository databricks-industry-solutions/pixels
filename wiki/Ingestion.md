# Ingestion: the `Catalog` class

`dbx.pixels.Catalog` discovers files in a storage location and turns them into rows of the **object catalog**, a Delta table with one row per file. It supports three discovery modes:

| Mode | How it discovers files | Enabled with |
|------|------------------------|--------------|
| **Batch** | One-shot directory listing (`spark.read.format("binaryFile")`) | default |
| **Streaming** | Auto Loader (`cloudFiles`) with directory listing, progress tracked in a checkpoint | `streaming=True` |
| **Managed file events** | Auto Loader reading a file-event queue that Unity Catalog maintains, so it doesn't list the directory | `streaming=True, useManagedFileEvents=True` |

File contents are never loaded into the table. Only paths and file attributes are stored; the `content` column is dropped.

---

## When to use what

| Your situation | Use |
|----------------|-----|
| One-off load, a demo, or exploring a new dataset | **Batch** |
| Full rebuild of a catalog (with `save(..., mode="overwrite")`) | **Batch** |
| New files keep arriving and you run the job on a schedule | **Streaming** + `triggerAvailableNow` (the default) |
| Files must be indexed within seconds or minutes of landing | **Streaming** + `triggerProcessingTime` |
| Landing zone with millions of files, or directory listing is slow or expensive | **Managed file events** |
| Uploads arrive continuously into a large, deep folder tree | **Managed file events** + `triggerProcessingTime` |

Rules of thumb:

- **Batch does not remember what it already ingested.** Every run lists the whole path again, and `save()` appends by default, so running a batch job twice produces duplicate rows. If you'll run the job more than once, or are ingesting a large volume in one go (for example more than 100k files), use streaming.
- **Streaming processes each file exactly once.** The checkpoint records which files have been processed, so reruns only pick up new files. With the default `availableNow` trigger the job processes the backlog and then stops, which suits a scheduled Databricks job. Built-in checkpointing and write-ahead logs track metadata and offsets, providing end-to-end exactly-once processing guarantees even if nodes fail.
- **Managed file events** make discovery cheap: instead of listing the directory on every trigger, Auto Loader reads a change feed that Unity Catalog keeps for the external location. Consider it for production workloads.

---

## Constructor

```python
from dbx.pixels import Catalog

catalog = Catalog(
    spark,
    table="main.pixels_solacc.object_catalog",
    volume="main.pixels_solacc.pixels_volume",
)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `spark` | `SparkSession` | *required* | Active Spark session. |
| `table` | `str` | `"main.pixels_solacc.object_catalog"` | Fully qualified (`catalog.schema.table`) name of the object catalog table. Related tables (`<table>_unzip`, `<table>_redaction`, …) are derived from this name. |
| `volume` | `str` | `"main.pixels_solacc.pixels_volume"` | Fully qualified UC Volume used for checkpoints (`/checkpoints/`), unzipped files (`/unzipped/`), anonymized output (`/anonymized/`) and redacted output (`/redacted/`). If the volume doesn't exist, the constructor only logs a warning. |

### `init_tables()`

```python
catalog.init_tables()
```

Creates the object catalog and its companion tables and SQL functions if they don't exist yet. It runs every file in `dbx/pixels/resources/sql/` against `table` and its schema. Call it once before the first `save()` so the table gets the intended schema (`meta` as `VARIANT`, top-level `study_uid` / `series_uid` columns) and liquid clustering on `study_uid`.

---

## `catalog()`: discover files

```python
catalog_df = catalog.catalog(path, **options)
```

It returns a DataFrame, streaming or static depending on `streaming`. Nothing is written until you call `save()`.

> Pass the result through [`DicomMetaExtractor`](Metadata-Extraction) before saving. `save()` clusters the table by `study_uid`, a column that only the extractor adds, so saving the raw `catalog()` output fails.

### General parameters (all modes)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `path` | `str` | *required* | Root location to catalog: a UC Volume path (`/Volumes/...`), a cloud URI (`s3://`, `abfss://`, `gs://`) or `dbfs:/`. For `s3://`, Pixels detects public buckets automatically and uses anonymous access for them. |
| `pattern` | `str` | `"*"` | Glob applied to **file names** (Spark `pathGlobFilter`), e.g. `"*.dcm"`. With `extractZip=True`, the pattern must also match your `.zip` files (keep `"*"` or use `"*.{dcm,zip}"`). |
| `recurse` | `bool` | `True` | Walk subdirectories (`recursiveFileLookup`). |
| `detectFileType` | `bool` | `False` | Fills `file_type` using libmagic. Each file has to be read, so this adds I/O. Leave it off for DICOM-only landing zones. |
| `extractZip` | `bool` | `False` | Unzip archives found under `path` and catalog the extracted files instead. When this is off, zip files are catalogued as they are. See [Zip extraction](#zip-extraction). |
| `extractZipBasePath` | `str` | `<volume>/unzipped/` | Where extracted files are written. Each archive gets a subfolder named after the zip. |
| `zipRepartition` | `int` | `None` | Repartition the input before unzipping to spread large archives across more tasks. |
| `maxZipElementsPerPartition` | `int` | `32` | Target number of extracted files per partition when the unzipped files are rebalanced for downstream processing such as metadata extraction. |

### Streaming parameters

These only apply when `streaming=True`. Batch mode ignores them.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `streaming` | `bool` | `False` | Use Auto Loader (`cloudFiles`) instead of a batch listing. |
| `streamCheckpointBasePath` | `str` | `<volume>/checkpoints/` | Base folder for checkpoints. The actual checkpoint is `<base>/<table>`, plus `<base>/<table>_unzip` for the unzip stream. **Keep it stable across runs**, because a new path means everything is reprocessed. |
| `triggerAvailableNow` | `bool` | `None` → `True` | Process everything available in as many micro-batches as needed, then stop. This is the default when no trigger is given. |
| `triggerProcessingTime` | `str` | `None` | Run continuously with a micro-batch every interval, e.g. `"30 seconds"`, `"5 minutes"`. `save()` then blocks until the query is stopped. |
| `maxFilesPerTrigger` | `int` | `50000` | Maximum number of new files per micro-batch (`cloudFiles.maxFilesPerTrigger`). Lower it to keep micro-batches small, raise it to catch up faster on large backlogs. |
| `includeExistingFiles` | `bool` | `True` | On the **first** run of a checkpoint, also ingest files already present. Set it to `False` to ingest only files that arrive after the stream starts. It has no effect once the checkpoint exists. |
| `allowOverwrites` | `bool` | `False` | Reprocess a file when it is overwritten in place. Because the catalog is append-only, each reprocessing adds another row for the same path. |
| `maxFileAge` | `str` | `None` | Ignore files older than this, e.g. `"90 days"` (`cloudFiles.maxFileAge`). Useful to bound discovery on very large, long-lived landing zones. |
| `useManagedFileEvents` | `bool` | `False` | Discover files through Unity Catalog managed file events instead of directory listing. See [Managed file events](#managed-file-events). |

> Setting both `triggerAvailableNow` and `triggerProcessingTime` raises `ONLY_ALLOW_SINGLE_TRIGGER`.

### Zip parameters

| Parameter | Type | Default | Applies to | Description |
|-----------|------|---------|------------|-------------|
| `maxUnzipWorkers` | `int` | `1` | batch | Threads per task that download and extract archives in parallel. Raise it (e.g. `8`–`16`) for many small archives on remote storage. |
| `maxUnzippedRecordsPerFile` | `int` | `102400` | streaming | `maxRecordsPerFile` for the intermediate `<table>_unzip` Delta table. It is also divided by `maxZipElementsPerPartition` to size the repartition of the unzipped stream. |

---

## Batch

```python
from dbx.pixels import Catalog
from dbx.pixels.dicom import DicomMetaExtractor

catalog = Catalog(spark, table="main.pixels_solacc.object_catalog",
                  volume="main.pixels_solacc.pixels_volume")

catalog_df = catalog.catalog("/Volumes/main/pixels_solacc/landing/", pattern="*.dcm")
meta_df = DicomMetaExtractor(catalog).transform(catalog_df)

catalog.save(meta_df)                        # append
# catalog.save(meta_df, mode="overwrite")    # full refresh
```

Characteristics:

- Lists the whole `path` on every run and keeps no state between runs.
- Simple and fast for datasets up to a few million files.
- Use `mode="overwrite"` on `save()` if you re-run it to rebuild the catalog.

---

## Streaming (Auto Loader, directory listing)

```python
catalog_df = catalog.catalog(
    "/Volumes/main/pixels_solacc/landing/",
    streaming=True,
    streamCheckpointBasePath="/Volumes/main/pixels_solacc/pixels_volume/checkpoints/",
    # triggerAvailableNow=True is the default
)
meta_df = DicomMetaExtractor(catalog).transform(catalog_df)
catalog.save(meta_df)      # runs the stream and blocks until it finishes
```

Continuous variant:

```python
catalog_df = catalog.catalog(path, streaming=True, triggerProcessingTime="1 minute")
meta_df = DicomMetaExtractor(catalog).transform(catalog_df)
catalog.save(meta_df)      # runs until the query is stopped
```

Characteristics:

- Exactly-once ingestion, with progress stored in `<streamCheckpointBasePath>/<table>`.
- Auto Loader still lists the directory to find new files, so discovery cost grows with the total number of files under `path`.
- The streaming query is named `pixels_<path>_<table>`, which is how it appears in the Spark UI.

---

## Managed file events

```python
catalog_df = catalog.catalog(
    "/Volumes/main/pixels_solacc/landing/",
    streaming=True,
    streamCheckpointBasePath="/Volumes/main/pixels_solacc/pixels_volume/checkpoints/",
    useManagedFileEvents=True,
    includeExistingFiles=True,
    allowOverwrites=False,
    maxFileAge="90 days",
)
meta_df = DicomMetaExtractor(catalog).transform(catalog_df)
catalog.save(meta_df)
```

This sets `cloudFiles.useManagedFileEvents=true`. Auto Loader then reads file-arrival events that Unity Catalog records for the external location, so it doesn't need to list the directory.

Requirements:

- Databricks Runtime 14.3 LTS or later.
- `path` must be governed by a Unity Catalog **external location** with **file events enabled** (an external Volume on that location also works).

Best practices:

- Run the stream at least once every 7 days so the file-events cache doesn't expire.
- Keep `allowOverwrites=False` unless upstream systems overwrite files in place.
- Use `maxFileAge` to bound discovery on high-churn landing zones.
- Reuse the same checkpoint path across runs.

---

## Zip extraction

```python
catalog_df = catalog.catalog(path, extractZip=True)                      # batch
catalog_df = catalog.catalog(path, extractZip=True, streaming=True)      # streaming
```

How it works:

1. Discovered files go through a parallel unzip step. Non-zip files pass through unchanged, and each archive is expanded to one row per extracted file under `extractZipBasePath/<zip name>/`.
2. The expanded rows are written to an intermediate Delta table `<table>_unzip`.
3. The catalog DataFrame is read back from `<table>_unzip` and repartitioned so extracted files are spread evenly across tasks.

`original_path` keeps the location of the source zip, and `path` / `local_path` point to the extracted file.

> In batch mode `<table>_unzip` is appended to on every run and then read in full, so re-running a batch unzip re-catalogs earlier extractions. Use streaming for recurring zip ingestion.

With `triggerAvailableNow`, Pixels waits for the unzip stream to finish before it starts the catalog stream. With `triggerProcessingTime`, both streams run continuously.

---

## Saving and loading

### `save()`

```python
catalog.save(df, mode="append")
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `df` | `DataFrame` | *required* | Output of `catalog()` or of a transformer such as `DicomMetaExtractor`. |
| `table` | `str` | constructor `table` | Target table override. |
| `path` | `str` | `None` | Optional external storage path for the Delta table. |
| `mode` | `str` | `"append"` | Batch: `append` / `overwrite`. Streaming: the output mode (use `append`). |
| `mergeSchema` | `bool` | `True` | Allow new columns (e.g. `_corrupt_record` from permissive extraction). |
| `userMetadata` | `str` | `None` | Commit message stored in the Delta history. |
| `userOptions` | `dict` | `{}` | Extra writer options, which override Pixels' defaults (optimized writes, auto-compaction, 16 MB target file size). |

`save()` writes in streaming mode if the most recent `catalog()` call on this instance used `streaming=True`. For streaming it blocks until the query terminates.

Batch and streaming writes both apply **liquid clustering on `study_uid`** (`clusterBy("study_uid")`), so files from the same study are stored together and study-level lookups (e.g. from the DICOMweb gateway or the viewer) scan less data. The DataFrame therefore needs a `study_uid` column, which `DicomMetaExtractor` provides. This also applies when you pass a different `table`.

> **Upgrading an existing catalog?** Tables created before liquid clustering was introduced have no `study_uid` / `series_uid` columns. Run [`notebooks/UPGRADE_TO_LIQUID.ipynb`](https://github.com/databricks-industry-solutions/pixels/blob/main/notebooks/UPGRADE_TO_LIQUID.ipynb) once, with the `table` widget set to your catalog table, before writing to it again. It adds and backfills the columns, enables clustering on `study_uid`, and runs `OPTIMIZE`. See [Release Notes](Release-Notes).

### `load()`

```python
df = catalog.load()                  # the object catalog
df = catalog.load("main.x.other")    # any other table
```

---

## Output columns

| Column | Description |
|--------|-------------|
| `path` | File path as seen by Spark (e.g. `dbfs:/Volumes/...`, `s3://...`) |
| `modificationTime` | Last modification time |
| `length` | File size in bytes |
| `original_path` | Source path. With `extractZip`, this is the zip the file came from |
| `relative_path` | `path` without the `dbfs:/` prefix |
| `local_path` | POSIX path usable from Python (`/Volumes/...`) |
| `extension` | File extension, or empty if none |
| `file_type` | libmagic description when `detectFileType=True`, otherwise empty |
| `path_tags` | Last 5 tokens of the path, split on `/ _ . : @`. Useful for quick filtering |

`DicomMetaExtractor` then adds `is_anon`, `study_uid`, `series_uid` and `meta`. See [Metadata Extraction](Metadata-Extraction).
