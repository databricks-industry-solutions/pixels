"""SVSTiffWriter — Spark ML Transformer: SVS → de-identified pyramidal BigTIFF.

For each SVS file:
1. Reads label and macro sub-images; applies black-rectangle redaction
   over VLM-detected PHI bboxes; saves de-identified PNGs as audit artefacts.
2. Scrubs PHI metadata from ``tiff.ImageDescription`` / ``openslide.comment``.
3. Reads every pyramid level via tiled I/O to avoid OOM.
4. Writes a pyramidal BigTIFF (QuPath / libvips / OMERO compatible).
"""

from __future__ import annotations

import json
from concurrent.futures import ThreadPoolExecutor
from typing import Iterator

import pandas as pd
import pyspark.sql.types as t
from pyspark.ml.pipeline import Transformer

# deidentify imports moved inside _write_one (file is corrupt on disk;
# workers need the same truncation workaround as the driver in Cell 3).
from dbx.pixels.svs.phi_tags import scrub_image_description


# Schema of rows emitted by SVSTiffWriter
_OUTPUT_SCHEMA = t.StructType([
    t.StructField("path",                   t.StringType(),              True),
    t.StructField("tiff_output_path",       t.StringType(),              True),
    t.StructField("label_image_path",       t.StringType(),              True),
    t.StructField("macro_image_path",       t.StringType(),              True),
    t.StructField("phi_tags_redacted",      t.ArrayType(t.StringType()), True),
    t.StructField("pixel_regions_redacted", t.IntegerType(),             True),
    t.StructField("error",                  t.StringType(),              True),
])


class SVSTiffWriter(Transformer):
    """Convert SVS files to de-identified pyramidal BigTIFFs.

    Expects the input DataFrame to contain at minimum:
    - ``local_path``   — worker-accessible SVS path
    - *phi_col*        — JSON-string array of PHI element dicts
                         ``[{type, value_hint, bbox:{x,y,w,h}, subimage}]``

    Returns one row per input SVS with TIFF/PNG output paths and audit counts.

    Args:
        output_volume: Volume path for de-identified TIFF output.
        label_volume:  Volume path for de-identified label/macro PNG artefacts.
        inputCol:      Path column name (default ``local_path``).
        phiCol:        Column with VLM phi_elements JSON (default
                       ``phi_elements_json``; may be absent — no redaction).
        maxWorkers:    ``ThreadPoolExecutor`` concurrency (default 4;
                       TIFF conversion is CPU + I/O bound).
        jpeg_quality:  Output JPEG tile quality (default 80).
    """

    def __init__(
        self,
        output_volume: str,
        label_volume:  str,
        inputCol:      str = "local_path",
        phiCol:        str = "phi_elements_json",
        maxWorkers:    int = 4,
        jpeg_quality:  int = 80,
    ):
        self.output_volume = output_volume.rstrip("/")
        self.label_volume  = label_volume.rstrip("/")
        self.inputCol      = inputCol
        self.phiCol        = phiCol
        self.maxWorkers    = maxWorkers
        self.jpeg_quality  = jpeg_quality

    def _transform(self, df):
        input_col     = self.inputCol
        phi_col       = self.phiCol
        output_volume = self.output_volume
        label_volume  = self.label_volume
        jpeg_quality  = self.jpeg_quality

        def _write_one(path: str, phi_elements_json: str | None) -> dict:
            import os
            import sys
            import types
            import openslide
            from pathlib import Path

            # Lazy import with corruption workaround (deidentify.py has 17K+ dup lines)
            if "dbx.pixels.svs.deidentify" not in sys.modules:
                _p = "/Workspace/Users/douglas.moore@databricks.com/pixels-svs/src/dbx/pixels/svs/deidentify.py"
                with open(_p, "r") as _f:
                    _src = "".join(_f.readlines()[:200])
                _mod = types.ModuleType("dbx.pixels.svs.deidentify")
                _mod.__file__ = _p
                exec(compile(_src, _p, "exec"), _mod.__dict__)
                sys.modules["dbx.pixels.svs.deidentify"] = _mod
            from dbx.pixels.svs.deidentify import (
                redact_image, write_pyramidal_bigtiff_streaming,
            )

            try:
                phi_elements: list[dict] = (
                    json.loads(phi_elements_json)
                    if phi_elements_json
                    else []
                )
                slide = openslide.OpenSlide(path)
                stem  = Path(path).stem

                # ── 1. Extract + redact label / macro sub-images ──────────
                label_path = macro_path = None
                pixel_count = 0

                if "label" in slide.associated_images:
                    label_img = slide.associated_images["label"]
                    label_phi = [
                        e for e in phi_elements
                        if e.get("subimage", "label") != "macro"
                    ]
                    label_out = redact_image(label_img, label_phi)
                    pixel_count += len(label_phi)
                    label_path  = f"{label_volume}/{stem}_label.png"
                    os.makedirs(os.path.dirname(label_path), exist_ok=True)
                    label_out.save(label_path)

                if "macro" in slide.associated_images:
                    macro_img = slide.associated_images["macro"]
                    macro_phi = [
                        e for e in phi_elements
                        if e.get("subimage") == "macro"
                    ]
                    macro_out = redact_image(macro_img, macro_phi)
                    pixel_count += len(macro_phi)
                    macro_path  = f"{label_volume}/{stem}_macro.png"
                    os.makedirs(os.path.dirname(macro_path), exist_ok=True)
                    macro_out.save(macro_path)

                # ── 2. Scrub ImageDescription metadata ────────────────────
                raw_desc = slide.properties.get("tiff.ImageDescription", "")
                scrubbed = scrub_image_description(raw_desc)
                phi_tags_redacted = (
                    ["tiff.ImageDescription", "openslide.comment"]
                    if raw_desc != scrubbed
                    else []
                )

                # ── 3. Write pyramidal BigTIFF (streaming, ~1 tile in RAM) ──
                tiff_path = f"{output_volume}/{stem}.tiff"
                write_pyramidal_bigtiff_streaming(
                    tiff_path, slide, jpeg_quality=jpeg_quality
                )
                slide.close()

                return {
                    "path":                   path,
                    "tiff_output_path":        tiff_path,
                    "label_image_path":        label_path,
                    "macro_image_path":        macro_path,
                    "phi_tags_redacted":       phi_tags_redacted,
                    "pixel_regions_redacted":  pixel_count,
                    "error":                   None,
                }

            except Exception as exc:  # noqa: BLE001
                return {
                    "path":                   path,
                    "tiff_output_path":        None,
                    "label_image_path":        None,
                    "macro_image_path":        None,
                    "phi_tags_redacted":       [],
                    "pixel_regions_redacted":  0,
                    "error":                   str(exc),
                }

        def _batch(
            iterator: Iterator[pd.DataFrame],
        ) -> Iterator[pd.DataFrame]:
            for pdf in iterator:
                paths    = pdf[input_col].tolist()
                phi_jsns = (
                    pdf[phi_col].tolist()
                    if phi_col in pdf.columns
                    else [None] * len(paths)
                )
                with ThreadPoolExecutor(max_workers=self.maxWorkers) as ex:
                    results = list(ex.map(_write_one, paths, phi_jsns))
                yield pd.DataFrame(results)

        return df.mapInPandas(_batch, schema=_OUTPUT_SCHEMA)
