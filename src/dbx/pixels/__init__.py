"""This package facilitates handling Object, Document, Image and HLS Image data sets as Spark Dataframes."""

# ── Lightweight imports (no PySpark dependency) ──────────────────────
from dbx.pixels.databricks_file import DatabricksFile
from dbx.pixels.logging import LoggerProvider

# ── Heavy (PySpark-dependent) imports are deferred via PEP 562 ──────
_LAZY_IMPORTS = {
    "Catalog": "dbx.pixels.catalog",
    "ObjectFrames": "dbx.pixels.objects",
    "PathExtractor": "dbx.pixels.path_extractor",
    "PlotResult": "dbx.pixels.plot_result",
    "TagExtractor": "dbx.pixels.tag_extractor",
}

__all__ = [
    "Catalog",
    "DatabricksFile",
    "LoggerProvider",
    "ObjectFrames",
    "PathExtractor",
    "PlotResult",
    "TagExtractor",
]


def __getattr__(name: str):
    if name in _LAZY_IMPORTS:
        import importlib

        module = importlib.import_module(_LAZY_IMPORTS[name])
        value = getattr(module, name)
        globals()[name] = value  # cache so __getattr__ is called only once
        return value
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
