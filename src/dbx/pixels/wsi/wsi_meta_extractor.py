"""WSIMetaExtractor — Spark ML Transformer that extracts metadata from any OpenSlide-supported WSI.

Unified handler for all Whole Slide Image formats:
- Aperio SVS
- Hamamatsu NDPI / VMS / VMU
- Leica SCN
- MIRAX MRXS
- Philips TIFF
- Sakura SVSLIDE
- Trestle TIF
- Ventana BIF / TIF
- Generic TIFF

Primary backend: ``openslide-python`` + ``openslide-bin``.
Fallback backend: ``tifffile`` (for non-WSI TIFFs that OpenSlide cannot open).

Architecture mirrors ``SVSMetaExtractor`` and ``TiffMetaExtractor``:
- Extends ``pyspark.ml.pipeline.Transformer``
- Implements ``_transform(df)``
- Uses ``mapInPandas`` with ``ThreadPoolExecutor`` for concurrent I/O
- Outputs a ``meta`` column (parsed VARIANT) and a top-level ``case_id`` column

All derived fields (vendor, dimensions, levels, associated images, mpp,
magnification, phi_tag_report) are merged into the properties dict before
JSON serialisation.
"""

from __future__ import annotations

import json
import os
from concurrent.futures import ThreadPoolExecutor
from typing import Iterator

import pandas as pd
import pyspark.sql.types as t
from pyspark.ml.pipeline import Transformer
from pyspark.sql.functions import expr


class WSIMetaExtractor(Transformer):
    """Extract metadata from any WSI file into the ``meta VARIANT`` column.

    Uses ``openslide`` as the primary backend; falls back to ``tifffile``
    for files that OpenSlide cannot detect (plain TIFFs, OME-TIFF without
    WSI structure).

    Also adds a top-level ``case_id`` column (see :func:`derive_case_id`): the
    slide barcode when the file has one, otherwise the name of the folder that
    contains the slide. ``Catalog``'s default ``cluster_by="auto"`` clusters the
    table by it.

    Args:
        catalog:         Catalog instance (provides path/anon context).
        inputCol:        Column with worker-accessible file paths (default ``local_path``).
        outputCol:       Output column name (default ``meta``).
        maxWorkers:      ``ThreadPoolExecutor`` concurrency per Spark task (default 32).
        useVariant:      Parse JSON string to VARIANT via ``parse_json()`` (default True).
        filterLargeTags: Drop large binary tags before JSON serialisation (default True).
    """

    MAX_WORKERS = 32

    def __init__(
        self,
        catalog,
        inputCol: str = "local_path",
        outputCol: str = "meta",
        maxWorkers: int = None,
        useVariant: bool = True,
        filterLargeTags: bool = True,
    ):
        self.catalog = catalog
        self.inputCol = inputCol
        self.outputCol = outputCol
        self.maxWorkers = maxWorkers or self.MAX_WORKERS
        self.useVariant = useVariant
        self.filterLargeTags = filterLargeTags

    # ------------------------------------------------------------------
    # Internal: OpenSlide backend (handles all WSI formats)
    # ------------------------------------------------------------------

    @staticmethod
    def _process_openslide(path: str) -> str:
        """Extract metadata using OpenSlide (primary backend)."""
        import openslide

        from dbx.pixels.wsi.wsi_phi_tags import classify_tags

        try:
            with openslide.OpenSlide(path) as slide:
                return WSIMetaExtractor._openslide_meta(slide, path, openslide, classify_tags)
        except Exception as err:
            return json.dumps(
                {
                    "error": str(err),
                    "udf": "wsi_meta_extractor_openslide",
                    "path": path,
                    "_wsi_case_id": derive_case_id(path),
                }
            )

    @staticmethod
    def _openslide_meta(slide, path, openslide, classify_tags) -> str:
        """Build the meta JSON for an open OpenSlide handle."""
        props = dict(slide.properties)
        associated = list(slide.associated_images.keys())

        # Vendor detection
        vendor = props.get("openslide.vendor", "unknown")

        # MPP (microns per pixel) — universal across vendors
        mpp_x = props.get(openslide.PROPERTY_NAME_MPP_X)
        mpp_y = props.get(openslide.PROPERTY_NAME_MPP_Y)
        objective_power = props.get(openslide.PROPERTY_NAME_OBJECTIVE_POWER)

        meta = {
            **props,
            # --- Derived WSI fields ---
            "_wsi_vendor": vendor,
            "_wsi_format": _detect_format_name(path, vendor),
            "_wsi_width": slide.dimensions[0],
            "_wsi_height": slide.dimensions[1],
            "_wsi_level_count": slide.level_count,
            "_wsi_level_dimensions": [list(d) for d in slide.level_dimensions],
            "_wsi_level_downsamples": list(slide.level_downsamples),
            "_wsi_mpp_x": float(mpp_x) if mpp_x else None,
            "_wsi_mpp_y": float(mpp_y) if mpp_y else None,
            "_wsi_objective_power": float(objective_power) if objective_power else None,
            "_wsi_has_label": "label" in associated,
            "_wsi_has_macro": "macro" in associated,
            "_wsi_has_thumbnail": "thumbnail" in associated,
            "_wsi_associated_images": associated,
            "_wsi_backend": "openslide",
            "_wsi_case_id": derive_case_id(path, props),
            "phi_tag_report": classify_tags(props),
        }
        return json.dumps(meta, default=str)

    # ------------------------------------------------------------------
    # Internal: tifffile fallback (non-WSI TIFFs)
    # ------------------------------------------------------------------

    @staticmethod
    def _process_tifffile(path: str, filter_large: bool = True) -> str:
        """Extract metadata with tifffile (fallback for non-WSI TIFFs)."""
        import tifffile

        from dbx.pixels.wsi.wsi_phi_tags import LARGE_TAGS, classify_tags

        try:
            with tifffile.TiffFile(path) as tif:
                page = tif.pages[0]

                tags: dict[str, str] = {
                    tag.name: str(tag.value)
                    for tag in page.tags.values()
                    if not filter_large or tag.name not in LARGE_TAGS
                }

                # Per-series summary
                series_info = []
                for s in tif.series:
                    entry: dict = {
                        "shape": list(s.shape),
                        "axes": s.axes,
                        "dtype": str(s.dtype),
                    }
                    if hasattr(s, "levels"):
                        entry["level_count"] = len(s.levels)
                    series_info.append(entry)

                meta = {
                    **tags,
                    "_wsi_vendor": "generic-tiff",
                    "_wsi_format": _detect_tifffile_format(tif),
                    "_wsi_width": page.imagewidth,
                    "_wsi_height": page.imagelength,
                    "_wsi_level_count": (
                        len(tif.series[0].levels)
                        if tif.series and hasattr(tif.series[0], "levels")
                        else len(tif.pages)
                    ),
                    "_wsi_level_dimensions": None,
                    "_wsi_level_downsamples": None,
                    "_wsi_mpp_x": None,
                    "_wsi_mpp_y": None,
                    "_wsi_objective_power": None,
                    "_wsi_has_label": _has_labeled_ifd(tif, "label"),
                    "_wsi_has_macro": _has_labeled_ifd(tif, "macro"),
                    "_wsi_has_thumbnail": False,
                    "_wsi_associated_images": [],
                    "_wsi_backend": "tifffile",
                    "_wsi_page_count": len(tif.pages),
                    "_wsi_series_count": len(tif.series),
                    "_wsi_is_bigtiff": tif.is_bigtiff,
                    "_wsi_is_ome": tif.is_ome,
                    "_wsi_is_svs": tif.is_svs,
                    "_wsi_is_ndpi": getattr(tif, "is_ndpi", False),
                    "_wsi_series": series_info,
                    "_wsi_case_id": derive_case_id(path, tags),
                    "phi_tag_report": classify_tags(tags),
                }
                return json.dumps(meta, default=str)

        except Exception as err:
            return json.dumps(
                {
                    "error": str(err),
                    "udf": "wsi_meta_extractor_tifffile",
                    "path": path,
                    "_wsi_case_id": derive_case_id(path),
                }
            )

    # ------------------------------------------------------------------
    # Internal: Dispatcher
    # ------------------------------------------------------------------

    @staticmethod
    def _process_file(path: str, filter_large: bool = True) -> str:
        """Dispatch to OpenSlide (primary) or tifffile (fallback)."""
        try:
            import openslide

            # Check if OpenSlide can detect the format
            try:
                fmt = openslide.OpenSlide.detect_format(path)
            except Exception:
                fmt = None

            if fmt is not None:
                result = WSIMetaExtractor._process_openslide(path)
                if "error" not in json.loads(result):
                    return result
                # OpenSlide recognized the file but couldn't read it; try tifffile and
                # keep OpenSlide's error if that fails too.
                fallback = WSIMetaExtractor._process_tifffile(path, filter_large)
                return result if "error" in json.loads(fallback) else fallback
            else:
                # OpenSlide doesn't recognize it; try tifffile
                return WSIMetaExtractor._process_tifffile(path, filter_large)

        except ImportError:
            # openslide not installed; fall back to tifffile
            return WSIMetaExtractor._process_tifffile(path, filter_large)

    # ------------------------------------------------------------------
    # Transformer entry point
    # ------------------------------------------------------------------

    def _transform(self, df):
        """Apply WSI metadata extraction using mapInPandas with concurrent I/O."""
        input_col = self.inputCol
        output_col = self.outputCol
        max_workers = self.maxWorkers
        filter_large = self.filterLargeTags

        out_schema = t.StructType(
            list(df.schema.fields) + [t.StructField(output_col, t.StringType(), True)]
        )

        def _extract_meta_batch(
            iterator: Iterator[pd.DataFrame],
        ) -> Iterator[pd.DataFrame]:
            for pdf in iterator:
                paths = pdf[input_col].tolist()
                with ThreadPoolExecutor(max_workers=max_workers) as executor:
                    results = list(
                        executor.map(
                            lambda p: WSIMetaExtractor._process_file(p, filter_large),
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
            case_id = f"`{self.outputCol}`:_wsi_case_id::string"
        else:
            case_id = f"get_json_object(`{self.outputCol}`, '$._wsi_case_id')"

        # Top-level grouping key, the WSI counterpart of DICOM's study_uid
        return df.withColumn("case_id", expr(case_id))


# ---------------------------------------------------------------------------
# Module-level helpers
# ---------------------------------------------------------------------------


def derive_case_id(path: str, properties: dict = None):
    """Case identifier for a slide, used to group a case's slides together.

    Uses the slide barcode when the file has one (``openslide.barcode``; labs often
    encode the accession number in it), otherwise the name of the folder that
    contains the slide, so ``.../S26-10457/A2-1.svs`` gives ``S26-10457``. Returns
    None when neither is available. The folder rule assumes slides are stored in a
    folder per case.

    Both sources usually carry the accession number, which is PHI.
    """
    barcode = str((properties or {}).get("openslide.barcode") or "").strip()
    if barcode:
        return barcode
    folder = os.path.basename(os.path.dirname(str(path).rstrip("/")))
    return folder or None


def _detect_format_name(path: str, vendor: str) -> str:
    """Return a human-readable format name based on vendor + extension."""
    ext = path.rsplit(".", 1)[-1].lower() if "." in path else ""
    _vendor_map = {
        "aperio": "Aperio SVS",
        "hamamatsu": "Hamamatsu NDPI" if ext == "ndpi" else "Hamamatsu VMS/VMU",
        "leica": "Leica SCN",
        "mirax": "MIRAX MRXS",
        "philips": "Philips TIFF",
        "sakura": "Sakura SVSLIDE",
        "trestle": "Trestle TIF",
        "ventana": "Ventana BIF" if ext == "bif" else "Ventana TIF",
        "generic-tiff": "Generic TIFF",
        "dicom": "DICOM WSI",
    }
    return _vendor_map.get(vendor, f"Unknown ({vendor})")


def _detect_tifffile_format(tif) -> str:
    """Detect format from tifffile attributes."""
    if tif.is_svs:
        return "Aperio SVS (tifffile)"
    if getattr(tif, "is_ndpi", False):
        return "Hamamatsu NDPI (tifffile)"
    if tif.is_ome:
        return "OME-TIFF"
    if tif.is_bigtiff:
        return "BigTIFF"
    return "Standard TIFF"


def _has_labeled_ifd(tif, target: str) -> bool:
    """Check if a tifffile TiffFile has an IFD with a matching ImageDescription."""
    target_lc = target.strip().lower()
    for page in tif.pages:
        try:
            desc = page.description
            if isinstance(desc, bytes):
                desc = desc.decode("utf-8", errors="replace")
            if desc.strip().strip("\x00").lower() == target_lc:
                return True
        except Exception:
            continue
    return False
