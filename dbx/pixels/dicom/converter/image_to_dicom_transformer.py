"""Spark ML Pipeline Transformer that converts images to DICOM files.

Usage::

    from dbx.pixels.dicom.converter import ImageToDicomTransformer

    converter = ImageToDicomTransformer(
        output_dir="/Volumes/catalog/schema/volume/dicom_output",
        metadata_json="/Volumes/catalog/schema/volume/metadata.json",  # optional
    )

    # *catalog_df* is the DataFrame produced by ``dbx.pixels.Catalog.catalog()``
    dicom_df = converter.transform(catalog_df)

All images that share the **same parent folder** are placed into the same
DICOM **Series** (they share a ``SeriesInstanceUID``).  A single
``StudyInstanceUID`` is generated per transformer invocation.

The transformer adds the following columns to the output DataFrame:

* ``dicom_path``  — path to the generated ``.dcm`` file (or ``None`` on error).
* ``conversion_status`` — ``"OK"`` on success, or an error message.
* ``study_instance_uid`` — the UID for the entire study.
* ``series_instance_uid`` — the UID for each folder / series.
* ``instance_number`` — 1-based index within the series.
"""

from __future__ import annotations

import logging
import os
from typing import Optional

import pyspark.sql.functions as F
import pyspark.sql.types as t
from pyspark.ml.pipeline import Transformer
from pyspark.sql import DataFrame, Window

from pydicom.uid import generate_uid

from dbx.pixels.dicom.converter.metadata import load_metadata

logger = logging.getLogger(__name__)


class ImageToDicomTransformer(Transformer):
    """Convert catalogued image files (PNG, JPEG, …) into DICOM files.

    This class follows the same Transformer contract used by other
    ``dbx.pixels.dicom`` components (``DicomMetaExtractor``,
    ``DicomThumbnailExtractor``, etc.) and is designed to slot into an
    existing Spark ML ``Pipeline``.

    Parameters
    ----------
    output_dir : str
        Root directory where the DICOM files will be written.  The folder
        hierarchy of the input images is mirrored under this path.
    metadata_json : str, optional
        Path to a JSON file with DICOM metadata overrides.  See
        :data:`~dbx.pixels.dicom.converter.metadata.METADATA_TEMPLATE`
        for the expected schema.  If ``None``, sensible defaults are used.
    input_col : str
        Column containing the local filesystem path to each image.
        Defaults to ``"local_path"`` (the column produced by ``Catalog``).
    input_base_path : str, optional
        The root path that was originally passed to ``Catalog.catalog()``.
        When set the converter mirrors the relative folder structure under
        *output_dir*.  If ``None`` the folder name alone is used.
    supported_extensions : set[str], optional
        Lower-case file extensions (without dot) to include.
        Defaults to ``{"png", "jpg", "jpeg", "tif", "tiff", "bmp", "gif", "webp"}``.

    Example
    -------
    ::

        from dbx.pixels import Catalog
        from dbx.pixels.dicom.converter import ImageToDicomTransformer

        catalog = Catalog(spark, table="main.pixels.image_catalog",
                          volume="main.pixels.pixels_volume")
        catalog_df = catalog.catalog(path="/Volumes/main/pixels/pixels_volume/images")

        converter = ImageToDicomTransformer(
            output_dir="/Volumes/main/pixels/pixels_volume/dicom_output",
            metadata_json="/Volumes/main/pixels/pixels_volume/dicom_metadata.json",
        )
        result_df = converter.transform(catalog_df)
        display(result_df.select("path", "dicom_path", "conversion_status"))
    """

    # Default set of image extensions to process (lower-case, no dot)
    _DEFAULT_EXTENSIONS = {"png", "jpg", "jpeg", "tif", "tiff", "bmp", "gif", "webp"}

    def __init__(
        self,
        output_dir: str,
        metadata_json: Optional[str] = None,
        input_col: str = "local_path",
        input_base_path: Optional[str] = None,
        supported_extensions: Optional[set] = None,
    ):
        super().__init__()
        self._output_dir = output_dir
        self._metadata_json = metadata_json
        self._input_col = input_col
        self._input_base_path = input_base_path
        self._supported_extensions = supported_extensions or self._DEFAULT_EXTENSIONS

    # ────────────────────────────────────────────────────────────────────
    # Schema validation
    # ────────────────────────────────────────────────────────────────────

    def check_input_type(self, schema) -> None:
        """Verify the input DataFrame has the expected columns and types."""
        field = schema[self._input_col]
        if field.dataType != t.StringType():
            raise TypeError(
                f"ImageToDicomTransformer: column '{self._input_col}' "
                f"has type {field.dataType}, expected StringType"
            )
        if "extension" not in schema.fieldNames():
            raise ValueError(
                "ImageToDicomTransformer: input DataFrame must contain an "
                "'extension' column (produced by Catalog)"
            )

    # ────────────────────────────────────────────────────────────────────
    # Transform
    # ────────────────────────────────────────────────────────────────────

    def _transform(self, df: DataFrame) -> DataFrame:
        """Execute the image → DICOM conversion.

        1. Filter the DataFrame to only supported image extensions.
        2. Derive parent folder from the file path (= series grouping key).
        3. Assign a ``StudyInstanceUID`` (one per run) and
           ``SeriesInstanceUID`` (one per folder).
        4. Compute ``instance_number`` (row number within each series).
        5. Call the worker UDF that builds the DICOM file on disk.
        6. Return the enriched DataFrame.
        """
        self.check_input_type(df.schema)

        # ── Load metadata (driver-side) ────────────────────────────────
        meta = load_metadata(self._metadata_json)
        study_instance_uid = generate_uid()

        # Broadcast values that the UDF will need
        bc_meta = df.sparkSession.sparkContext.broadcast(meta)
        bc_study_uid = df.sparkSession.sparkContext.broadcast(study_instance_uid)
        bc_output_dir = df.sparkSession.sparkContext.broadcast(self._output_dir)
        bc_input_base = df.sparkSession.sparkContext.broadcast(self._input_base_path)

        # ── Filter to supported image files ────────────────────────────
        ext_list = list(self._supported_extensions)
        image_df = df.filter(F.lower(F.col("extension")).isin(ext_list))

        # ── Derive the parent folder (= series key) ───────────────────
        image_df = image_df.withColumn(
            "_parent_folder",
            F.regexp_replace(F.col(self._input_col), r"/[^/]+$", ""),
        )

        # ── Assign one SeriesInstanceUID per folder ────────────────────
        # We use a deterministic UDF so every row in the same folder
        # receives the same UID.
        @F.udf(returnType=t.StringType())
        def _series_uid_udf(folder: str) -> str:
            # Hash-based UID generation: same folder → same UID within a run
            import hashlib
            from pydicom.uid import generate_uid as _gen

            # Combine folder + study UID to make it unique per run
            seed = hashlib.sha256(
                (folder + bc_study_uid.value).encode()
            ).hexdigest()[:16]
            return _gen(entropy_srcs=[seed])

        image_df = image_df.withColumn(
            "series_instance_uid",
            _series_uid_udf(F.col("_parent_folder")),
        )

        # ── Instance number (row number within each series) ────────────
        window = Window.partitionBy("_parent_folder").orderBy(self._input_col)
        image_df = image_df.withColumn(
            "instance_number", F.row_number().over(window)
        )

        # ── Study UID column ───────────────────────────────────────────
        image_df = image_df.withColumn(
            "study_instance_uid", F.lit(study_instance_uid)
        )

        # ── Worker UDF: build the DICOM file ───────────────────────────
        result_schema = t.StructType(
            [
                t.StructField("dicom_path", t.StringType(), True),
                t.StructField("conversion_status", t.StringType(), False),
            ]
        )

        @F.udf(returnType=result_schema)
        def _convert_udf(
            local_path: str,
            series_uid: str,
            instance_num: int,
            parent_folder: str,
        ) -> dict:
            """Worker-side: convert one image to DICOM."""
            import os as _os

            from dbx.pixels.dicom.converter.dicom_builder import build_dicom

            meta_val = bc_meta.value
            study_uid_val = bc_study_uid.value
            output_root = bc_output_dir.value
            input_base = bc_input_base.value

            # Mirror the relative path under output_dir
            if input_base:
                rel = _os.path.relpath(parent_folder, input_base)
            else:
                rel = _os.path.basename(parent_folder)
            dest_dir = _os.path.join(output_root, rel)

            try:
                dcm_path = build_dicom(
                    image_path=local_path,
                    output_dir=dest_dir,
                    meta=meta_val,
                    study_instance_uid=study_uid_val,
                    series_instance_uid=series_uid,
                    instance_number=instance_num,
                )
                return {"dicom_path": dcm_path, "conversion_status": "OK"}
            except Exception as exc:
                return {"dicom_path": None, "conversion_status": f"ERROR: {exc}"}

        # ── Apply the conversion UDF ───────────────────────────────────
        image_df = image_df.withColumn(
            "_conv_result",
            _convert_udf(
                F.col(self._input_col),
                F.col("series_instance_uid"),
                F.col("instance_number"),
                F.col("_parent_folder"),
            ),
        )

        # Flatten the struct and drop temporary columns
        image_df = (
            image_df
            .withColumn("dicom_path", F.col("_conv_result.dicom_path"))
            .withColumn("conversion_status", F.col("_conv_result.conversion_status"))
            .drop("_conv_result", "_parent_folder")
        )

        logger.info(
            "ImageToDicomTransformer: StudyInstanceUID=%s, output_dir=%s",
            study_instance_uid,
            self._output_dir,
        )

        return image_df

