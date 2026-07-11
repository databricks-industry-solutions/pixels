"""SVSMetaExtractor — Spark ML Transformer that reads OpenSlide metadata into meta VARIANT.

Mirrors ``DicomMetaExtractor`` from the pixels SA:
- Extends ``pyspark.ml.pipeline.Transformer``
- Implements ``_transform(df)``
- Uses ``mapInPandas`` with ``ThreadPoolExecutor`` for concurrent network I/O
- Outputs a single ``meta`` column as a parsed VARIANT

All SVS-specific derived fields (width, height, level_count, has_label_image,
has_macro_image, phi_tag_report) are merged into the OpenSlide properties dict
before JSON serialisation, so no schema change to ``object_catalog`` is required.
"""

from __future__ import annotations

import json
from concurrent.futures import ThreadPoolExecutor
from typing import Iterator

import pandas as pd
import pyspark.sql.types as t
from pyspark.ml.pipeline import Transformer
from pyspark.sql.functions import expr

from dbx.pixels.svs.phi_tags import classify_tags


class SVSMetaExtractor(Transformer):
    """Extract OpenSlide metadata from SVS files into the ``meta VARIANT`` column.

    Args:
        catalog:    :class:`SVSCatalog` instance (used for ``is_anon`` flag).
        inputCol:   Column with worker-accessible file paths (default ``local_path``).
        outputCol:  Output column name (default ``meta``).
        maxWorkers: ``ThreadPoolExecutor`` concurrency (default 32).
        useVariant: Parse JSON string to VARIANT via ``parse_json()`` (default True).
    """

    MAX_WORKERS = 32

    def __init__(
        self,
        catalog,
        inputCol:   str  = "local_path",
        outputCol:  str  = "meta",
        maxWorkers: int  = None,
        useVariant: bool = True,
    ):
        self.catalog    = catalog
        self.inputCol   = inputCol
        self.outputCol  = outputCol
        self.maxWorkers = maxWorkers or self.MAX_WORKERS
        self.useVariant = useVariant

    def _transform(self, df):
        """Apply SVS metadata extraction using mapInPandas with concurrent I/O."""
        input_col   = self.inputCol
        output_col  = self.outputCol
        max_workers = self.maxWorkers

        out_schema = t.StructType(
            list(df.schema.fields)
            + [t.StructField(output_col, t.StringType(), True)]
        )

        def _extract_meta_batch(
            iterator: Iterator[pd.DataFrame],
        ) -> Iterator[pd.DataFrame]:
            import openslide
            from dbx.pixels.svs.phi_tags import classify_tags  # noqa: direct import avoids __init__ chain

            def _process_file(path: str) -> str:
                try:
                    slide = openslide.OpenSlide(path)
                    props = dict(slide.properties)
                    associated = list(slide.associated_images.keys())

                    meta = {
                        **props,
                        # --- derived SVS fields ---
                        "width":             slide.dimensions[0],
                        "height":            slide.dimensions[1],
                        "level_count":       slide.level_count,
                        "level_dimensions":  [
                            list(d) for d in slide.level_dimensions
                        ],
                        "level_downsamples": list(slide.level_downsamples),
                        "has_label_image":   "label" in associated,
                        "has_macro_image":   "macro" in associated,
                        "associated_images": associated,
                        "phi_tag_report":    classify_tags(props),
                    }
                    slide.close()
                    return json.dumps(meta)
                except Exception as err:
                    return json.dumps(
                        {"error": str(err), "udf": "svs_meta_extractor", "path": path}
                    )

            for pdf in iterator:
                paths = pdf[input_col].tolist()
                with ThreadPoolExecutor(max_workers=max_workers) as executor:
                    results = list(executor.map(_process_file, paths))
                pdf[output_col] = results
                yield pdf

        df = df.mapInPandas(_extract_meta_batch, schema=out_schema)

        if self.useVariant:
            df = df.withColumn(
                self.outputCol,
                expr(f"parse_json(`{self.outputCol}`)"),
            )

        return df
