"""Image → DICOM converter package.

Provides :class:`ImageToDicomTransformer`, a Spark ML Pipeline
:class:`~pyspark.ml.pipeline.Transformer` that converts standard image files
(PNG, JPEG, TIFF, BMP, GIF, WebP) into DICOM Secondary Capture files.

Quick start::

    from dbx.pixels import Catalog
    from dbx.pixels.dicom.converter import ImageToDicomTransformer

    catalog = Catalog(spark, table="main.pixels.image_catalog",
                      volume="main.pixels.pixels_volume")
    df = catalog.catalog(path="/Volumes/main/pixels/pixels_volume/images")

    converter = ImageToDicomTransformer(
        output_dir="/Volumes/main/pixels/pixels_volume/dicom_output",
    )
    result_df = converter.transform(df)
"""

from dbx.pixels.dicom.converter.image_to_dicom_transformer import (
    ImageToDicomTransformer,
)
from dbx.pixels.dicom.converter.metadata import (
    DEFAULT_METADATA,
    METADATA_TEMPLATE,
    load_metadata,
)

__all__ = [
    "ImageToDicomTransformer",
    "DEFAULT_METADATA",
    "METADATA_TEMPLATE",
    "load_metadata",
]

