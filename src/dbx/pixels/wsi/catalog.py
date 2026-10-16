"""WSICatalog — extends the base Catalog for all Whole Slide Image formats.

Unified catalog handler that discovers and indexes WSI files across all
OpenSlide-supported formats (Aperio SVS, Hamamatsu NDPI/VMS/VMU, Leica SCN,
MIRAX MRXS, Philips TIFF, Sakura SVSLIDE, Trestle TIF, Ventana BIF/TIF,
generic TIFF).

Overrides:
    - catalog() uses a multi-extension pattern by default
    - Supports per-format or all-format discovery

When multiple extensions are needed, WSICatalog issues one catalog() call per
extension and unions them. (Whether a single brace pattern such as
``*.{svs,tiff}`` would work instead is untested; see docs/WSI.md.)
"""

from __future__ import annotations

from pyspark.sql import DataFrame

from dbx.pixels.catalog import Catalog
from dbx.pixels.wsi.wsi_phi_tags import OPENSLIDE_PATTERNS


def _case_insensitive_glob(pattern: str) -> str:
    """Turn ``*.svs`` into ``*.[sS][vV][sS]`` so ``SLIDE01.SVS`` also matches.

    ``pathGlobFilter`` matching is case-sensitive, and scanner exports often use
    upper-case extensions.
    """
    return "".join(f"[{c.lower()}{c.upper()}]" if c.isalpha() else c for c in pattern)


# Default patterns for common WSI formats, matched regardless of case
_DEFAULT_PATTERNS = [_case_insensitive_glob(p) for p in OPENSLIDE_PATTERNS]


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
            ``"auto"`` clusters by ``study_uid`` when present, which WSI rows don't
            have, so WSI tables are written without clustering. Pass a column name
            or list (for example a ``case_id`` column you add) to cluster by it.
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
            pattern:  Single glob pattern (e.g. ``'*.svs'``). If provided,
                      only this pattern is used.
            patterns: List of glob patterns to scan. Defaults to all
                      OpenSlide-supported extensions, matched regardless of
                      case. Each pattern triggers a separate scan; results are
                      unioned. Patterns you pass are used exactly as given.
            **kwargs: Additional arguments forwarded to
                      :meth:`Catalog.catalog` (recurse, streaming, etc.).

        Returns:
            DataFrame with cataloged file metadata.

        Errors from the underlying scans (a missing path, no permission, a bad
        checkpoint) are raised, not hidden; a pattern that matches no files simply
        contributes no rows.
        """
        if pattern is not None:
            # Single pattern mode (backward-compatible)
            return super().catalog(path, pattern=pattern, **kwargs)

        if patterns is None:
            patterns = _DEFAULT_PATTERNS

        # Multi-pattern mode: scan each extension and union results
        dfs = [super().catalog(path, pattern=pat, **kwargs) for pat in patterns]

        if not dfs:
            # Return empty DataFrame with correct schema
            return super().catalog(path, pattern="*.NONEXISTENT_EXTENSION_PLACEHOLDER", **kwargs)

        result = dfs[0]
        for df in dfs[1:]:
            result = result.union(df)

        return result.dropDuplicates(["path"])
