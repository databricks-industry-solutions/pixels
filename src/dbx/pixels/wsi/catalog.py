"""WSICatalog — extends the base Catalog for all Whole Slide Image formats.

Unified catalog handler that discovers and indexes WSI files across all
OpenSlide-supported formats (Aperio SVS, Hamamatsu NDPI/VMS/VMU, Leica SCN,
MIRAX MRXS, Philips TIFF, Sakura SVSLIDE, Trestle TIF, Ventana BIF/TIF,
generic TIFF).

By default ``catalog()`` lists the source folder once and keeps the files whose
extension (in any case) is a WSI extension, so batch runs list the folder once and
streaming uses a single Auto Loader source with no de-duplication state.
"""

from __future__ import annotations

from pyspark.sql import DataFrame, functions as f

from dbx.pixels.catalog import Catalog
from dbx.pixels.wsi.wsi_phi_tags import OPENSLIDE_PATTERNS

# Lower-case WSI extensions without the dot ("svs", "ndpi", ...), matched against the
# catalog's ``extension`` column. Derived from OPENSLIDE_PATTERNS so ".dcm" (handled by
# the DICOM path) is not included.
WSI_EXTENSIONS = sorted({p.lstrip("*.").lower() for p in OPENSLIDE_PATTERNS})


class WSICatalog(Catalog):
    """Object catalog for Whole Slide Images (all OpenSlide-supported formats).

    Extends :class:`dbx.pixels.Catalog` with WSI-specific defaults:
    - ``catalog()`` discovers files matching all WSI extensions by default
    - Supports single-pattern or multi-pattern modes

    Args:
        spark: Active SparkSession.
        table: Fully qualified UC table name (e.g. ``main.pixels.wsi_object_catalog``).
        volume: Fully qualified UC volume for checkpoints and scratch files. Defaults
            to ``<catalog>.<schema>.pixels_volume`` from ``table``, the volume the
            bundle creates.
        cluster_by: Liquid-clustering columns, as for :class:`Catalog`. The default
            ``"auto"`` clusters WSI tables by ``case_id``, the column
            :class:`WSIMetaExtractor` adds (slide barcode, else the slide's folder).
            Pass a column name or list to cluster by something else, or ``None``.
    """

    def __init__(self, spark, table: str, volume: str = None, cluster_by="auto"):
        if volume is None:
            # Same catalog.schema as the table, bundle's default volume name
            catalog_name, schema_name, _ = table.split(".")
            volume = f"{catalog_name}.{schema_name}.pixels_volume"
        super().__init__(spark, table=table, volume=volume, cluster_by=cluster_by)

    def catalog(
        self,
        path: str,
        pattern: str = None,
        patterns: list[str] = None,
        **kwargs,
    ) -> DataFrame:
        """Catalog WSI files at the given path.

        Args:
            path:     Root directory to scan.
            pattern:  Single glob pattern (e.g. ``'*.svs'``), used exactly as given.
            patterns: List of glob patterns, used exactly as given. Each pattern is a
                      separate scan; results are unioned and de-duplicated by path.
            **kwargs: Additional arguments forwarded to
                      :meth:`Catalog.catalog` (recurse, streaming, etc.).

        Without ``pattern`` or ``patterns``, the folder is scanned once and filtered to
        files whose extension is in ``WSI_EXTENSIONS``, in any case
        (``SLIDE01.SVS``, ``case.Ndpi``).

        Returns:
            DataFrame with cataloged file metadata.

        Errors from the underlying scans (a missing path, no permission, a bad
        checkpoint) are raised, not hidden; no matching files simply gives no rows.
        """
        if pattern is not None:
            return super().catalog(path, pattern=pattern, **kwargs)

        if patterns is None:
            df = super().catalog(path, pattern="*", **kwargs)
            return df.filter(f.lower(f.col("extension")).isin(WSI_EXTENSIONS))

        dfs = [super().catalog(path, pattern=pat, **kwargs) for pat in patterns]
        if not dfs:
            raise ValueError("patterns is empty; pass None to scan all WSI extensions")
        result = dfs[0]
        for df in dfs[1:]:
            result = result.union(df)
        return result.dropDuplicates(["path"])
