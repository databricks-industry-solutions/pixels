"""WSICatalog — extends the base Catalog for all Whole Slide Image formats.

Unified catalog handler that discovers and indexes WSI files across all
OpenSlide-supported formats (Aperio SVS, Hamamatsu NDPI/VMS/VMU, Leica SCN,
MIRAX MRXS, Philips TIFF, Sakura SVSLIDE, Trestle TIF, Ventana BIF/TIF,
generic TIFF).

Overrides:
    - catalog() uses a multi-extension pattern by default
    - Supports per-format or all-format discovery

Note on glob limitations: Spark's binaryFile reader ``pathGlobFilter`` does
not support brace expansion (``{*.svs,*.tiff}``). When multiple extensions
are needed, WSICatalog issues multiple catalog() calls and unions them.
"""

from __future__ import annotations

from pyspark.sql import DataFrame

from dbx.pixels.catalog import Catalog
from dbx.pixels.wsi.wsi_phi_tags import OPENSLIDE_PATTERNS


# Default patterns for common WSI formats
_DEFAULT_PATTERNS = OPENSLIDE_PATTERNS


class WSICatalog(Catalog):
    """Object catalog for Whole Slide Images (all OpenSlide-supported formats).

    Extends :class:`dbx.pixels.Catalog` with WSI-specific defaults:
    - ``catalog()`` discovers files matching all WSI extensions by default
    - Supports single-pattern or multi-pattern modes

    Args:
        spark: Active SparkSession.
        table: Fully qualified UC table name (e.g. ``dmoore.wsi.object_catalog``).
        volume: Fully qualified UC volume name (e.g. ``dmoore.wsi.wsi_volume``).
    """

    def __init__(self, spark, table: str, volume: str = None):
        if volume is None:
            # Derive volume from catalog.schema
            catalog_name, schema_name, _ = table.split(".")
            volume = f"{catalog_name}.{schema_name}.wsi_volume"
        super().__init__(spark, table=table, volume=volume)

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
            pattern:  Single glob pattern (e.g. ``'*.svs'``). If provided,
                      only this pattern is used.
            patterns: List of glob patterns to scan. Defaults to all
                      OpenSlide-supported extensions. Each pattern triggers
                      a separate scan; results are unioned.
            **kwargs: Additional arguments forwarded to
                      :meth:`Catalog.catalog` (recurse, streaming, etc.).

        Returns:
            DataFrame with cataloged file metadata.
        """
        if pattern is not None:
            # Single pattern mode (backward-compatible)
            return super().catalog(path, pattern=pattern, **kwargs)

        if patterns is None:
            patterns = _DEFAULT_PATTERNS

        # Multi-pattern mode: scan each extension and union results
        dfs = []
        for pat in patterns:
            try:
                df = super().catalog(path, pattern=pat, **kwargs)
                dfs.append(df)
            except Exception:
                # Some patterns may match zero files — that's fine
                pass

        if not dfs:
            # Return empty DataFrame with correct schema
            return super().catalog(path, pattern="*.NONEXISTENT_EXTENSION_PLACEHOLDER", **kwargs)

        result = dfs[0]
        for df in dfs[1:]:
            result = result.union(df)

        return result.dropDuplicates(["path"])
