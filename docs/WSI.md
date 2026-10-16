# Whole Slide Imaging (WSI)

The `dbx.pixels.wsi` package catalogs digital pathology whole slide images (SVS,
NDPI, TIFF and other OpenSlide formats) into Delta, extracts their metadata into a
`meta` VARIANT column, and detects PHI in slide labels and metadata.

The guide lives in the wiki: **[Whole Slide Imaging](https://github.com/databricks-industry-solutions/pixels/wiki/Whole-Slide-Imaging)**
(source: [`wiki/Whole-Slide-Imaging.md`](../wiki/Whole-Slide-Imaging.md)). It covers
supported formats, installation (`databricks-pixels[wsi]`), ingesting slides with the
notebook or from Python, the columns and `meta` fields written, clustering, PHI
detection, testing, and known limitations.

## File inventory

| Path | Purpose |
|------|---------|
| `src/dbx/pixels/wsi/catalog.py` | `WSICatalog`: discovery across all WSI extensions |
| `src/dbx/pixels/wsi/wsi_meta_extractor.py` | `WSIMetaExtractor`: metadata into `meta` |
| `src/dbx/pixels/wsi/wsi_utils.py` | `wsi_to_image`, format detection, property reading |
| `src/dbx/pixels/wsi/wsi_phi_tags.py` | PHI tag classification and scrubbing, supported extensions |
| `src/dbx/pixels/wsi/wsi_vlm_phi_detector.py` | `WSIVLMPhiDetector`: PHI detection with a vision model |
| `notebooks/wsi/01-ingest-wsi.py` | Ingestion notebook |
| `notebooks/wsi/02-phi-pixel-detection.py` | PHI detection notebook |
| `tests/dbx/test_wsi.py` | Unit tests (prepare their own sample slides) |
| `wiki/Whole-Slide-Imaging.md` | User guide |
