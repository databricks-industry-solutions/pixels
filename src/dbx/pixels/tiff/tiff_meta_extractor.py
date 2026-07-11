"""TiffMetaExtractor — Spark ML Transformer that reads TIFF metadata into a ``meta`` VARIANT.

Mirrors ``SVSMetaExtractor`` from the pixels SA:
- Extends ``pyspark.ml.pipeline.Transformer``
- Implements ``_transform(df)``
- Uses ``mapInPandas`` with ``ThreadPoolExecutor`` for concurrent I/O
- Outputs a single ``meta`` column as a parsed VARIANT

Primary backend: ``tifffile`` (handles standard TIFF, BigTIFF, OME-TIFF,
Aperio SVS-style TIFF, NDPI).  Falls back to ``Pillow`` if ``tifffile`` is
not installed.

All derived fields (page_count, is_ome, is_bigtiff, series info,
phi_tag_report) are merged into the tag dict before JSON serialisation, so
no schema change to ``object_catalog`` is required.
"""

from __future__ import annotations

import json
from concurrent.futures import ThreadPoolExecutor
from typing import Iterator

import pandas as pd
import pyspark.sql.types as t
from pyspark.ml.pipeline import Transformer
from pyspark.sql.functions import expr

from dbx.pixels.tiff.tiff_phi_tags import classify_tags


class TiffMetaExtractor(Transformer):
    """Extract TIFF metadata into the ``meta VARIANT`` column.

    Uses ``tifffile`` as the primary backend; falls back to ``Pillow`` when
    ``tifffile`` is not available on the executor.

    Args:
        catalog:    Catalog instance (provides path/anon context).
        inputCol:   Column with worker-accessible file paths (default ``local_path``).
        outputCol:  Output column name (default ``meta``).
        maxWorkers:      ``ThreadPoolExecutor`` concurrency per Spark task (default 32).
        useVariant:      Parse JSON string to VARIANT via ``parse_json()`` (default True).
        filterLargeTags: Drop tags in ``LARGE_TAGS`` (tile/strip offsets, JPEG tables,
                         ICC profile, XMP, etc.) before JSON serialisation (default True).
    """

    MAX_WORKERS = 32

    def __init__(
        self,
        catalog,
        inputCol:        str  = "local_path",
        outputCol:        str  = "meta",
        maxWorkers:       int  = None,
        useVariant:       bool = True,
        filterLargeTags:  bool = True,
    ):
        self.catalog         = catalog
        self.inputCol        = inputCol
        self.outputCol       = outputCol
        self.maxWorkers      = maxWorkers or self.MAX_WORKERS
        self.useVariant      = useVariant
        self.filterLargeTags = filterLargeTags

    # ------------------------------------------------------------------
    # Internal helpers (run on Spark executors inside mapInPandas)
    # ------------------------------------------------------------------

    @staticmethod
    def _process_tifffile(path: str, filter_large: bool = True) -> str:
        """Extract metadata with tifffile (primary backend)."""
        import tifffile

        from dbx.pixels.tiff.tiff_phi_tags import LARGE_TAGS, classify_tags

        try:
            with tifffile.TiffFile(path) as tif:
                page = tif.pages[0]

                # All page-0 TIFF tags as plain strings; skip large binary/offset tags
                tags: dict[str, str] = {
                    tag.name: str(tag.value)
                    for tag in page.tags.values()
                    if not filter_large or tag.name not in LARGE_TAGS
                }

                # Per-series summary (multi-level WSI awareness)
                series_info = []
                for s in tif.series:
                    entry: dict = {
                        "shape": list(s.shape),
                        "axes":  s.axes,
                        "dtype": str(s.dtype),
                    }
                    if hasattr(s, "levels"):
                        entry["level_count"] = len(s.levels)
                    series_info.append(entry)

                meta = {
                    **tags,
                    # --- derived fields ---
                    "page_count":        len(tif.pages),
                    "series_count":      len(tif.series),
                    "is_bigtiff":        tif.is_bigtiff,
                    "is_ome":            tif.is_ome,
                    "is_svs":            tif.is_svs,
                    "is_ndpi":           getattr(tif, "is_ndpi", False),
                    "width":             page.imagewidth,
                    "height":            page.imagelength,
                    "bits_per_sample":   page.bitspersample,
                    "samples_per_pixel": page.samplesperpixel,
                    "compression":       str(page.compression),
                    "photometric":       str(page.photometric),
                    "series":            series_info,
                    "phi_tag_report":    classify_tags(tags),
                }
                return json.dumps(meta)

        except Exception as err:
            return json.dumps(
                {"error": str(err), "udf": "tiff_meta_extractor_tifffile", "path": path}
            )

    @staticmethod
    def _process_pillow(path: str, filter_large: bool = True) -> str:
        """Extract metadata with Pillow (fallback when tifffile is absent)."""
        from PIL import Image

        from dbx.pixels.tiff.tiff_phi_tags import LARGE_TAGS

        try:
            # Lazy import: only available in Pillow >= 5.4
            try:
                from PIL.TiffImagePlugin import IFDRational
            except ImportError:
                IFDRational = None

            with Image.open(path) as img:
                raw_tags = img.tag_v2 if hasattr(img, "tag_v2") else {}
                tags: dict = {}

                # Use TAGS mapping when available for human-readable names
                try:
                    from PIL.ExifTags import TAGS as _TAGS
                except ImportError:
                    _TAGS = {}

                for k, v in raw_tags.items():
                    tag_name = _TAGS.get(k, str(k))
                    if filter_large and tag_name in LARGE_TAGS:
                        continue
                    # Coerce non-JSON-serialisable types
                    if IFDRational is not None and isinstance(v, IFDRational):
                        tags[tag_name] = float(v)
                    elif isinstance(v, tuple):
                        tags[tag_name] = [
                            float(x) if (IFDRational and isinstance(x, IFDRational)) else x
                            for x in v
                        ]
                    elif isinstance(v, bytes):
                        tags[tag_name] = v.decode("latin-1", errors="replace")
                    else:
                        tags[tag_name] = v

                meta = {
                    **tags,
                    "width":          img.width,
                    "height":         img.height,
                    "mode":           img.mode,
                    "n_frames":       getattr(img, "n_frames", 1),
                    "format":         img.format,
                    "phi_tag_report": classify_tags(
                        {str(k): str(v) for k, v in tags.items()}
                    ),
                }
                return json.dumps(meta, default=str)

        except Exception as err:
            return json.dumps(
                {"error": str(err), "udf": "tiff_meta_extractor_pillow", "path": path}
            )

    @staticmethod
    def _process_file(path: str, filter_large: bool = True) -> str:
        """Dispatch to tifffile or Pillow, whichever is available."""
        try:
            import tifffile  # noqa: F401
            return TiffMetaExtractor._process_tifffile(path, filter_large)
        except ImportError:
            return TiffMetaExtractor._process_pillow(path, filter_large)

    # ------------------------------------------------------------------
    # Transformer entry point
    # ------------------------------------------------------------------

    def _transform(self, df):
        """Apply TIFF metadata extraction using mapInPandas with concurrent I/O."""
        input_col   = self.inputCol
        output_col  = self.outputCol
        max_workers = self.maxWorkers

        out_schema = t.StructType(
            list(df.schema.fields)
            + [t.StructField(output_col, t.StringType(), True)]
        )

        filter_large = self.filterLargeTags

        def _extract_meta_batch(
            iterator: Iterator[pd.DataFrame],
        ) -> Iterator[pd.DataFrame]:
            for pdf in iterator:
                paths = pdf[input_col].tolist()
                with ThreadPoolExecutor(max_workers=max_workers) as executor:
                    results = list(
                        executor.map(
                            lambda p: TiffMetaExtractor._process_file(p, filter_large),
                            paths,
                        )
                    )
                pdf[output_col] = results
                yield pdf

        df = df.mapInPandas(_extract_meta_batch, schema=out_schema)

        if self.useVariant:
            df = df.withColumn(
                self.outputCol,
                expr(f"parse_json(`{self.outputCol}`)"),
            )

        return df
