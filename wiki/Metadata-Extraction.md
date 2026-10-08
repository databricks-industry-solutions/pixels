# Metadata Extraction: `DicomMetaExtractor`

`dbx.pixels.dicom.DicomMetaExtractor` is a Spark ML `Transformer`. It reads the DICOM header of every file in a catalog DataFrame and adds it as a `meta` column, a DICOM JSON model document stored as `VARIANT` by default.

It works with batch and streaming DataFrames alike, so you can place it between `catalog()` and `save()` in any of the [ingestion modes](Ingestion).

```python
from dbx.pixels import Catalog
from dbx.pixels.dicom import DicomMetaExtractor

catalog = Catalog(spark, table="main.pixels_solacc.object_catalog",
                  volume="main.pixels_solacc.pixels_volume")
catalog_df = catalog.catalog("/Volumes/main/pixels_solacc/landing/", streaming=True)

meta_df = DicomMetaExtractor(catalog).transform(catalog_df)
catalog.save(meta_df)
```

## How it works

- Rows are processed with `mapInPandas`. Inside each task a thread pool (`maxWorkers` threads) opens files concurrently, which keeps throughput high on network storage.
- Files are read with `pydicom.dcmread(..., stop_before_pixels=True)`, so only the header is read unless `deep=True`.
- Pixel Data (`7FE00010`) and Overlay Data (`60003000`) are always removed from the output. File meta group `0002` tags are included.
- `file_size` is always added to the metadata.
- `StudyInstanceUID` and `SeriesInstanceUID` are also written to the top-level `study_uid` and `series_uid` columns. The object catalog is liquid-clustered by `study_uid`, so study-level filters don't need to parse `meta`.
- A file that fails to parse doesn't fail the job. Its `meta` holds an error description instead (see [Handling failures](#handling-failures)).

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `catalog` | `Catalog` | *required* | The `Catalog` instance that produced the DataFrame. It supplies the anonymous-access flag for public S3 buckets, which is stored in the `is_anon` column. |
| `inputCol` | `str` | `"local_path"` | Column with the file path to open. It must be a `STRING`. Use `local_path` for Volumes and DBFS, and `path` for direct `s3://` access. |
| `outputCol` | `str` | `"meta"` | Name of the column that receives the metadata. |
| `deep` | `bool` | `False` | Also read pixel data and add image statistics (see below). This is much slower because the whole file is read. |
| `useVariant` | `bool` | `True` | Store `meta` as `VARIANT` (`parse_json`). If `False`, `meta` stays a JSON `STRING`. Keep it `True` when writing to a table created by `init_tables()`, where `meta` is `VARIANT`. |
| `maxWorkers` | `int` | `32` | Threads per Spark task for concurrent file reads. Raise it for high-latency storage and lower it if you see throttling or memory pressure. |
| `remove_un_tags` | `bool` | `False` | Recursively drop all elements with VR `UN` (Unknown), including those nested inside sequences. They are often large proprietary blobs that bloat the metadata or break JSON parsing. |
| `permissive` | `bool` | `False` | Use `try_parse_json` instead of `parse_json`. Rows whose JSON can't be parsed get `meta = NULL` and keep the raw string in a new `_corrupt_record` column, instead of failing the batch or stream with `MALFORMED_RECORD_IN_PARSING`. Only applies when `useVariant=True`. |
| `basePath` | `str` | `"dbfs:/"` | Legacy parameter, currently unused. |

**Input requirements:** the DataFrame must contain `inputCol` and `extension` as `STRING` columns. Any DataFrame returned by `Catalog.catalog()` qualifies.

**Columns added:**

| Column | Type | Description |
|--------|------|-------------|
| `is_anon` | `BOOLEAN` | Whether the file was read with anonymous (public S3) access |
| `study_uid` | `STRING` | Study Instance UID `(0020,000D)`. `NULL` if the tag is missing or the file failed to parse. Clustering key of the object catalog |
| `series_uid` | `STRING` | Series Instance UID `(0020,000E)`. `NULL` if the tag is missing or the file failed to parse |
| `outputCol` (`meta`) | `VARIANT` / `STRING` | Full DICOM header as DICOM JSON |
| `_corrupt_record` | `STRING` | Only when `permissive=True`: the raw JSON of rows that couldn't be parsed |

Because `Catalog.save()` clusters by `study_uid`, always run the extractor before saving.

### What `deep=True` adds

| Key | Description |
|-----|-------------|
| `has_pixel` | `true` if pixel data could be decoded |
| `img_min`, `img_max`, `img_avg` | Pixel value statistics |
| `img_shape_x`, `img_shape_y` | First two dimensions of the pixel array |
| `hash` | SHA-1 hex digest |

## Choosing options

| Situation | Recommended settings |
|-----------|----------------------|
| Standard ingestion (recommended starting point, as in the README) | `permissive=True, remove_un_tags=True` |
| Clean, well-formed data where any parse error should stop the pipeline | defaults |
| Vendor data with many private or unknown tags, or bloated metadata | `remove_un_tags=True` |
| Large heterogeneous archives where a few bad files must not stop the pipeline | `permissive=True` |
| You need image statistics or pixel presence checks | `deep=True` (expect a much longer runtime) |
| Remote S3 with high latency | increase `maxWorkers` (e.g. `64`) |

Options can be combined:

```python
meta_df = DicomMetaExtractor(
    catalog,
    remove_un_tags=True,
    permissive=True,
).transform(catalog_df)
```

## Querying the `meta` column

`meta` follows the [DICOM JSON model](https://dicom.nema.org/medical/dicom/current/output/chtml/part18/chapter_F.html). Keys are 8-digit hex tags, and each value has `vr` and `Value`, as shown in the query below.

Study and series UIDs are already available as columns. Prefer them in filters so the query benefits from clustering:

```sql
SELECT
  study_uid,
  series_uid,
  meta:['00080018'].Value[0]::STRING  AS sop_instance_uid,
  meta:['00080060'].Value[0]::STRING  AS modality,
  meta:['00100010'].Value[0].Alphabetic::STRING AS patient_name,
  meta:['file_size']::BIGINT          AS file_size
FROM main.pixels_solacc.object_catalog
WHERE study_uid = '1.2.156.14702.1.1000.16.0.20200311113603875'
```

## Handling failures

When a file can't be opened or parsed, `study_uid` and `series_uid` are `NULL` and `meta` holds a string with the error in place of a DICOM object:

```text
{'udf': 'dicom_meta_udf', 'error': '...', 'args': '...', 'path': '/Volumes/...'}
```

To find these rows:

```sql
SELECT path, meta
FROM main.pixels_solacc.object_catalog
WHERE schema_of_variant(meta) = 'STRING'
```

With `permissive=True`, rows whose JSON couldn't be converted to `VARIANT` have `meta IS NULL` and a non-null `_corrupt_record`:

```sql
SELECT path, _corrupt_record
FROM main.pixels_solacc.object_catalog
WHERE _corrupt_record IS NOT NULL
```

Non-DICOM files (for example, a stray `.txt` or `.jpg` in the landing zone) also show up as failures. Filter the catalog DataFrame first if the landing zone is mixed, e.g. `catalog.catalog(path, pattern="*.dcm")`.
