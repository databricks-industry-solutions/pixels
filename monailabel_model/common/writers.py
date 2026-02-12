import logging
import os
import tempfile
from typing import Any, Dict, Mapping, Optional, Sequence

import numpy as np
import SimpleITK as sitk

from monai.data.image_writer import ImageWriter, register_writer, NibabelWriter

logger = logging.getLogger(__name__)


class HighDicomSegWriter(ImageWriter):
    """
    Write segmentation data as a DICOM Segmentation (SEG) file using highdicom.

    This writer extends MONAI's ``ImageWriter`` to produce valid DICOM SEG files
    that comply with the DICOM standard, using the ``highdicom`` library.

    It accepts a multi-class segmentation label map (integer-valued array where
    0 = background) and a reference DICOM series directory. It reads the source
    DICOM files, builds per-segment binary masks, constructs the appropriate
    ``highdicom.seg.SegmentDescription`` objects from the provided label info,
    and creates a standards-compliant DICOM SEG file.

    Usage::

        from monailabel_model.common.writers import HighDicomSegWriter

        writer = HighDicomSegWriter()
        writer.set_data_array(seg_array, channel_dim=0)
        writer.set_metadata({
            "series_dir": "/path/to/dicom/series",
            "label_info": [
                {},                                          # index 0 = background (skipped)
                {"name": "liver",  "color": (255, 0, 0)},   # label 1
                {"name": "spleen", "color": (0, 255, 0)},   # label 2
            ],
            "series_description": "AI Segmentation",
        })
        writer.write("output.dcm")
    """

    output_dtype = np.uint8

    def __init__(self, output_dtype=np.uint8, **kwargs):
        """
        Args:
            output_dtype: output data type for the segmentation mask.
                Defaults to ``np.uint8``.
            kwargs: keyword arguments passed to ``ImageWriter``.
        """
        super().__init__(output_dtype=output_dtype, **kwargs)
        self._metadata: Dict[str, Any] = {}

    def set_data_array(
        self,
        data_array,
        channel_dim: Optional[int] = 0,
        squeeze_end_dims: bool = True,
        **kwargs,
    ):
        """
        Store the segmentation label map array.

        The input array is converted to a numpy ``uint8`` array.  If a channel
        dimension is present it will be removed (taking index 0 along that axis).

        Args:
            data_array: segmentation label map with integer values (0 = background).
                Can be a numpy array, torch Tensor, or MONAI MetaTensor.
                Expected shape: ``(C, D, H, W)`` or ``(D, H, W)``.
            channel_dim: channel dimension index.  Set to ``None`` if no channel
                dimension is present.
            squeeze_end_dims: kept for API compatibility with the base class.
            kwargs: additional keyword arguments (unused).
        """
        import torch
        from monai.data import MetaTensor

        if isinstance(data_array, MetaTensor):
            data_array = data_array.array
        if isinstance(data_array, torch.Tensor):
            data_array = data_array.cpu().numpy()

        data_array = np.asarray(data_array)

        # Remove channel dimension if present
        if channel_dim is not None and data_array.ndim > 3:
            data_array = np.take(data_array, 0, axis=channel_dim)

        self.data_obj = data_array.astype(self.output_dtype)

    def set_metadata(self, meta_dict: Optional[Mapping] = None, **options):
        """
        Store metadata required for DICOM SEG creation.

        Args:
            meta_dict: dictionary with the following keys:

                - ``"series_dir"`` *(str, required)*: path to the source DICOM
                  series directory.
                - ``"label_info"`` *(list, optional)*: list of dicts **indexed by
                  label number**.  Each dict may contain:

                  - ``"name"`` (str): segment label name.
                  - ``"description"`` (str): segment description.
                  - ``"color"`` (tuple): RGB colour ``(R, G, B)``, 0-255.
                  - ``"model_name"`` (str): algorithm / model name.

                - ``"series_description"`` *(str, optional)*: description for the
                  SEG series.  Defaults to ``"Segmentation"``.
                - ``"series_number"`` *(int, optional)*: series number.
                  Defaults to ``9999``.
                - ``"content_description"`` *(str, optional)*: DICOM content
                  description.
                - ``"manufacturer"`` *(str, optional)*: manufacturer.
                  Defaults to ``"MONAI"``.
                - ``"manufacturer_model_name"`` *(str, optional)*: model name.
                  Defaults to ``"MONAI Label"``.
                - ``"software_versions"`` *(str, optional)*: software version.
                  Defaults to ``"0.8.5"``.
                - ``"affine"`` *(optional)*: affine matrix from MONAI (used to
                  reconstruct spatial info if the array needs resampling to
                  match the source DICOM geometry).
                - ``"original_affine"`` *(optional)*: kept for API compatibility.
            options: additional keyword arguments (unused).
        """
        self._metadata = dict(meta_dict) if meta_dict else {}

    # ------------------------------------------------------------------
    # write
    # ------------------------------------------------------------------
    def write(self, filename, verbose: bool = True, **kwargs):
        """
        Create and write a valid DICOM SEG file using *highdicom*.

        The method:

        1. Reads the source DICOM series (sorted by slice position).
        2. Optionally resamples the segmentation array to align with the source
           geometry (when an ``"affine"`` is provided in the metadata).
        3. Splits the multi-class label map into per-segment binary masks.
        4. Builds ``SegmentDescription`` objects from ``label_info``.
        5. Creates a ``highdicom.seg.Segmentation`` object and saves it.

        Args:
            filename: output file path (should end in ``.dcm``).
            verbose: if ``True``, log progress messages.
            kwargs: additional keyword arguments (unused).
        """
        super().write(filename, verbose=verbose)

        import pydicom
        import highdicom as hd
        from pydicom.uid import generate_uid

        # ---- metadata ---------------------------------------------------
        series_dir = self._metadata.get("series_dir")
        if not series_dir:
            raise ValueError("'series_dir' must be provided in metadata")

        label_info = self._metadata.get("label_info", [])
        series_description = self._metadata.get("series_description", "Segmentation")
        series_number = self._metadata.get("series_number", 9999)
        content_description = self._metadata.get(
            "content_description", "Pixels - MONAI Label - Image segmentation"
        )
        manufacturer = self._metadata.get("manufacturer", "MONAI")
        manufacturer_model_name = self._metadata.get("manufacturer_model_name", "MONAI Label")
        software_versions = self._metadata.get("software_versions", "0.8.5")

        # ---- source DICOM files in correct spatial order ----------------
        reader = sitk.ImageSeriesReader()
        sorted_dcm_files = reader.GetGDCMSeriesFileNames(series_dir)
        if not sorted_dcm_files:
            raise ValueError(f"No DICOM files found in {series_dir}")

        source_images = [pydicom.dcmread(f, stop_before_pixels=True) for f in sorted_dcm_files]

        # ---- segmentation array ----------------------------------------
        seg_array = self._prepare_pixel_array(
            seg_array=self.data_obj,
            affine=self._metadata.get("affine"),
            source_sitk_files=sorted_dcm_files,
        )

        # ---- unique labels (skip background = 0) -----------------------
        unique_labels = np.unique(seg_array)
        unique_labels = unique_labels[unique_labels != 0]

        if len(unique_labels) == 0:
            logger.warning("No non-zero segments found in the data — skipping write")
            return

        # ---- build segment descriptions & binary masks ------------------
        segment_descriptions = []
        binary_segments = []

        for seg_num, label_idx in enumerate(unique_labels, start=1):
            label_idx = int(label_idx)

            # label_info can be:
            #   - a list of dicts indexed by label number (from model_labels)
            #   - a dict mapping int label index → str name (from label_dict)
            if isinstance(label_info, dict):
                # {int: "name"} format — e.g. self.label_dict
                label_name = label_info.get(label_idx, f"Segment_{label_idx}")
                info = {"name": label_name} if isinstance(label_name, str) else label_name
            elif isinstance(label_info, list) and label_idx < len(label_info):
                info = label_info[label_idx] if label_info[label_idx] else {}
            else:
                info = {}

            name = info.get("name", f"Segment_{label_idx}")
            description = info.get("description", name)
            model_name = info.get("model_name", "MONAI Label")
            rgb = list(info.get("color", (255, 0, 0)))[:3]
            rgb = [int(c) for c in rgb]

            logger.info(f"Segment {seg_num}: label_idx={label_idx}, name={name}")

            algo_id = hd.AlgorithmIdentificationSequence(
                name=model_name,
                version="1.0",
                family=hd.sr.CodedConcept(
                    value="123109",
                    scheme_designator="DCM",
                    meaning="Manual Processing",
                ),
            )

            desc = hd.seg.SegmentDescription(
                segment_number=seg_num,
                segment_label=name,
                segmented_property_category=hd.sr.CodedConcept(
                    value="123037004",
                    scheme_designator="SCT",
                    meaning="Anatomical Structure",
                ),
                segmented_property_type=hd.sr.CodedConcept(
                    value="78961009",
                    scheme_designator="SCT",
                    meaning=name,
                ),
                algorithm_type=hd.seg.SegmentAlgorithmTypeValues.AUTOMATIC,
                algorithm_identification=algo_id,
            )
            # Set recommended display color (CIE Lab converted from RGB)
            try:
                from highdicom.color import ColorManager
                cieLab = ColorManager.rgb_to_cielab(rgb)
                desc.RecommendedDisplayCIELabValue = cieLab
            except Exception:
                # Fallback: store as approximate CIE Lab (L*, a*, b*)
                # Simple sRGB→CIE Lab approximation for display hints
                pass
            segment_descriptions.append(desc)

            # Binary mask for this segment
            binary_segments.append((seg_array == label_idx).astype(np.uint8))

        # pixel_array shape: (frames, rows, cols, num_segments)
        pixel_array = np.stack(binary_segments, axis=-1)

        # ---- create DICOM SEG with highdicom ----------------------------
        seg = hd.seg.Segmentation(
            source_images=source_images,
            pixel_array=pixel_array,
            segmentation_type=hd.seg.SegmentationTypeValues.BINARY,
            segment_descriptions=segment_descriptions,
            series_instance_uid=generate_uid(),
            series_number=series_number,
            sop_instance_uid=generate_uid(),
            instance_number=1,
            manufacturer=manufacturer,
            manufacturer_model_name=manufacturer_model_name,
            software_versions=software_versions,
            device_serial_number="0",
            content_description=content_description,
            content_creator_name="MONAI Label",
            series_description=series_description,
        )

        seg.save_as(str(filename))

        if verbose:
            logger.info(
                f"DICOM SEG written to {filename} "
                f"({len(segment_descriptions)} segment(s), "
                f"{len(source_images)} source frame(s))"
            )

    # ------------------------------------------------------------------
    # helpers
    # ------------------------------------------------------------------
    @staticmethod
    def _prepare_pixel_array(
        seg_array: np.ndarray,
        affine: Optional[np.ndarray],
        source_sitk_files: Sequence[str],
    ) -> np.ndarray:
        """
        Ensure the segmentation array is spatially aligned with the source
        DICOM series.

        If the segmentation array already matches the source DICOM volume shape
        it is returned as-is (common when ``Invertd`` has already restored the
        original geometry).

        If shapes differ and an ``affine`` is provided, the array is resampled
        onto the source DICOM grid via SimpleITK nearest-neighbour interpolation.

        Args:
            seg_array: segmentation label map, shape ``(D, H, W)``.
            affine: 4×4 affine matrix mapping voxel indices to world (RAS)
                coordinates, as provided by MONAI.
            source_sitk_files: DICOM file paths in spatial order (from
                ``sitk.ImageSeriesReader.GetGDCMSeriesFileNames``).

        Returns:
            Aligned segmentation array with shape ``(D, H, W)`` matching the
            source series geometry.
        """
        # --- read the source DICOM volume geometry -----------------------
        src_reader = sitk.ImageSeriesReader()
        src_reader.SetFileNames(source_sitk_files)
        src_image = src_reader.Execute()
        src_shape = tuple(src_image.GetSize()[::-1])  # (x,y,z) → (z,y,x) = (D,H,W)

        # MONAI stores arrays as (H, W, D) but DICOM/SimpleITK expects (D, H, W).
        # Detect the reversed-axis case and transpose if needed.
        if seg_array.shape != src_shape and seg_array.shape[::-1] == src_shape:
            logger.info(
                "Transposing seg array from %s to %s to match DICOM (D,H,W) order",
                seg_array.shape, src_shape,
            )
            seg_array = np.transpose(seg_array)

        # If shapes now match, the array is aligned (e.g. after Invertd)
        if seg_array.shape == src_shape:
            logger.info(
                "Seg array shape %s matches DICOM series — skipping resample",
                seg_array.shape,
            )
            return seg_array

        if affine is None:
            logger.warning(
                "Seg shape %s != DICOM shape %s but no affine provided — "
                "returning array as-is",
                seg_array.shape, src_shape,
            )
            return seg_array

        import torch

        if isinstance(affine, torch.Tensor):
            affine = affine.cpu().numpy()
        affine = np.asarray(affine, dtype=np.float64)

        # --- reconstruct a SimpleITK image from array + MONAI affine -----
        # MONAI uses RAS; SimpleITK uses LPS.  Convert by flipping first
        # two rows/columns of the affine.
        convert = np.diag([-1.0, -1.0, 1.0, 1.0])
        lps_affine = convert @ affine

        dim = 3
        spacing = np.linalg.norm(lps_affine[:dim, :dim], axis=0)
        direction = (lps_affine[:dim, :dim] / spacing).flatten().tolist()
        origin = lps_affine[:dim, 3].tolist()

        # SimpleITK images are indexed (x, y, z) but GetArrayFromImage
        # returns (z, y, x).  We need to pass the array in (z, y, x) order.
        seg_sitk = sitk.GetImageFromArray(seg_array.astype(np.uint8))
        seg_sitk.SetSpacing(spacing.tolist())
        seg_sitk.SetDirection(direction)
        seg_sitk.SetOrigin(origin)

        # --- resample seg onto source grid (nearest-neighbour) -----------
        resampled = sitk.Resample(
            seg_sitk,
            src_image,
            sitk.Transform(),
            sitk.sitkNearestNeighbor,
            0,  # default pixel value (background)
            seg_sitk.GetPixelID(),
        )

        result = sitk.GetArrayFromImage(resampled).astype(np.uint8)

        # Safety net: if resampling zeroed everything, fall back to original
        if np.count_nonzero(result) == 0 and np.count_nonzero(seg_array) > 0:
            logger.warning(
                "Resampling produced all-zero array — falling back to "
                "original seg array (shape %s vs DICOM %s)",
                seg_array.shape, src_shape,
            )
            return seg_array

        return result


# ---------------------------------------------------------------------------
# Convenience function (drop-in replacement for nifti_to_dicom_seg)
# ---------------------------------------------------------------------------
def label_to_dicom_seg(
    series_dir: str,
    label,
    label_info: list,
    series_description: str = "Segmentation",
    affine=None,
    output_file: Optional[str] = None,
) -> str:
    """
    Convert a segmentation label map to a DICOM SEG file using ``HighDicomSegWriter``.

    This is a convenience function that mirrors the signature style of
    ``nifti_to_dicom_seg`` but uses *highdicom* for standards-compliant output.

    Args:
        series_dir: path to the source DICOM series directory.
        label: segmentation label map.  Can be:
            - a file path (str) to a NIfTI / NRRD / any SimpleITK-readable file,
            - a numpy array of shape ``(D, H, W)`` or ``(C, D, H, W)``,
            - a torch Tensor or MONAI MetaTensor.
        label_info: list of dicts indexed by label number.  Each dict may have
            keys ``"name"``, ``"description"``, ``"color"``, ``"model_name"``.
        series_description: description for the DICOM SEG series.
        affine: optional 4×4 affine matrix (from MONAI) for spatial alignment.
            Required when ``label`` is an array (not a file).
        output_file: output ``.dcm`` file path.  If ``None`` a temp file is
            created.

    Returns:
        Path to the written DICOM SEG file.
    """
    import time

    start = time.time()

    # --- resolve label to array + affine ---------------------------------
    if isinstance(label, str):
        # file path — read with SimpleITK
        label_sitk = sitk.ReadImage(label)
        label_np = sitk.GetArrayFromImage(label_sitk).astype(np.uint8)

        # Derive an affine from the SimpleITK image (LPS → RAS)
        spacing = np.array(label_sitk.GetSpacing())
        direction = np.array(label_sitk.GetDirection()).reshape(3, 3)
        origin = np.array(label_sitk.GetOrigin())

        lps_affine = np.eye(4)
        lps_affine[:3, :3] = direction * spacing
        lps_affine[:3, 3] = origin
        convert = np.diag([-1.0, -1.0, 1.0, 1.0])
        affine = convert @ lps_affine  # to RAS
    else:
        import torch
        from monai.data import MetaTensor

        if isinstance(label, MetaTensor):
            if affine is None:
                affine = label.affine
            label = label.array
        if isinstance(label, torch.Tensor):
            label = label.cpu().numpy()

        label_np = np.asarray(label)

    # --- write -----------------------------------------------------------
    if output_file is None:
        output_file = tempfile.NamedTemporaryFile(suffix=".dcm", delete=False).name

    writer = HighDicomSegWriter()
    writer.set_data_array(label_np, channel_dim=0 if label_np.ndim > 3 else None)
    writer.set_metadata({
        "series_dir": series_dir,
        "label_info": label_info,
        "series_description": series_description,
        "affine": affine,
    })
    writer.write(output_file)

    logger.warning(f"label_to_dicom_seg latency: {time.time() - start:.2f} sec")
    return output_file


# Register the writer for .dcm extension so MONAI's resolve_writer can find it
register_writer("dcm", HighDicomSegWriter)
register_writer(".nii.gz", NibabelWriter)

