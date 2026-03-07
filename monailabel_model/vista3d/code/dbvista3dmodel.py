import mlflow
import logging
import os
from typing import Sequence

from common.abstractmodel import DBModel
from common.utils import series_to_nifti

logger = logging.getLogger(__name__)

class DBVISTA3DModel(DBModel):
    """
    VISTA3D Model for MONAI Label compatible with Databricks' serving endpoint.
    """

    IGNORE_PROMPT = set(
        [
            2,   # kidney
            16,  # prostate or uterus
            18,  # rectum
            20,  # lung
            21,  # bone
            129, # kidney mass
            130, # liver tumor
            131, # vertebrae L6
            132  # airway
        ]
    )  
    EVERYTHING_PROMPT = sorted(list(set([i + 1 for i in range(133)]) - IGNORE_PROMPT))

    def __init__(self, volumes_compatible=False):
        super().__init__(volumes_compatible=volumes_compatible)
    
    def load_context(self, context=None):
        import json
        import sys
        from monai import bundle

        self.module_path = os.path.dirname(os.path.abspath(__file__))
        sys.path.append(self.module_path)

        self.model_name = "vista3d"

        label_dict_path = f"{self.module_path}/vista3d_bundle/data/jsons/label_dict.json"
        label_ignore_dict_path = f"{self.module_path}/vista3d_bundle/data/jsons/label_ignore_dict.json"
        label_dict = json.load(open(label_dict_path))
        label_ignore_dict = json.load(open(label_ignore_dict_path))

        combined_dict = {**label_dict, **label_ignore_dict}
        sorted_combined_dict = dict(sorted(combined_dict.items(), key=lambda item: item[1]))
        self.labels = json.dumps(sorted_combined_dict)
        self.label_dict = {v: k for k, v in label_dict.items()}

        self.conf_file = f"{self.module_path}/vista3d_bundle/configs/infer.yaml"

        parser = bundle.ConfigParser()
        parser.read_config(self.conf_file)

        self.logger.warning(f"VISTA3D - downloading model")
        bundle.download("vista3d",bundle_dir="/tmp/vista/bundles/")
        self.logger.warning(f"VISTA3D - model download completed")

        self.output_path = parser.get_parsed_content("infer")["output_path"]

        super().load_context(context)

    def override_model_info(self, monailabel_info):
        monailabel_info['models'][self.model_name] = monailabel_info['models']['segmentation']
        del monailabel_info['models']['segmentation']
    
    def security_path_check(self, file_path):
        if not file_path.startswith("/tmp/vista/bundles/vista3d/models/prediction/") or ".." in file_path:
            raise Exception("Invalid file path", file_path)

    def _prune_segmentation_labels(self, seg_path: str, label_prompt: Sequence[int] | None = None) -> None:
        """
        Reduce segmentation payload size for OHIF by dropping tiny labels and capping
        the number of kept labels. This is especially important for VISTA3D auto mode,
        where dozens of low-volume classes can cause browser OOM during 3D conversion.
        """
        import numpy as np
        import SimpleITK as sitk

        max_labels = int(os.getenv("VISTA3D_MAX_OUTPUT_LABELS", "0"))
        min_voxels = int(os.getenv("VISTA3D_MIN_LABEL_VOXELS", "0"))

        if max_labels <= 0 and min_voxels <= 0:
            return

        img = sitk.ReadImage(seg_path)
        seg = sitk.GetArrayFromImage(img)

        labels, counts = np.unique(seg, return_counts=True)
        non_bg = labels != 0
        labels = labels[non_bg]
        counts = counts[non_bg]

        if labels.size == 0:
            return

        # Prefer labels explicitly requested by prompt when a cap is enabled.
        prompt_set = set(int(v) for v in (label_prompt or []))

        ranked = sorted(
            zip(labels.tolist(), counts.tolist()),
            key=lambda x: x[1],
            reverse=True,
        )

        keep_labels: list[int] = []
        for label_value, voxel_count in ranked:
            if min_voxels > 0 and voxel_count < min_voxels:
                continue
            if max_labels > 0 and len(keep_labels) >= max_labels:
                break
            if prompt_set and int(label_value) not in prompt_set:
                continue
            keep_labels.append(int(label_value))

        # If prompt filtering removed everything, fall back to size-based selection.
        if not keep_labels:
            for label_value, voxel_count in ranked:
                if min_voxels > 0 and voxel_count < min_voxels:
                    continue
                if max_labels > 0 and len(keep_labels) >= max_labels:
                    break
                keep_labels.append(int(label_value))

        if not keep_labels:
            return

        keep_set = set(keep_labels)
        all_label_set = set(int(v) for v in labels.tolist())
        if keep_set == all_label_set:
            return

        filtered = np.where(np.isin(seg, list(keep_set)), seg, 0).astype(seg.dtype, copy=False)
        out = sitk.GetImageFromArray(filtered)
        out.CopyInformation(img)
        sitk.WriteImage(out, seg_path, useCompression=True)

        logger.warning(
            "VISTA3D output pruned: kept=%d/%d labels (min_voxels=%d, max_labels=%d) at %s",
            len(keep_set),
            len(all_label_set),
            min_voxels,
            max_labels,
            seg_path,
        )

    def _downsample_segmentation(self, seg_path: str) -> None:
        """
        Downsample segmentation geometry to reduce OHIF labelmap->surface memory/CPU.
        Uses nearest-neighbor to preserve label IDs.
        """
        import numpy as np
        import SimpleITK as sitk

        factor = float(os.getenv("VISTA3D_OHIF_DOWNSAMPLE_FACTOR", "2.0"))
        if factor <= 1.0:
            return

        img = sitk.ReadImage(seg_path)
        old_size = np.array(img.GetSize(), dtype=np.int64)      # (x, y, z)
        old_spacing = np.array(img.GetSpacing(), dtype=np.float64)
        new_size = np.maximum(1, np.floor(old_size / factor).astype(np.int64))

        if np.array_equal(old_size, new_size):
            return

        # Keep the same physical extent: spacing scales with size ratio.
        new_spacing = old_spacing * (old_size / new_size)

        resampled = sitk.Resample(
            img,
            size=[int(v) for v in new_size.tolist()],
            transform=sitk.Transform(),
            interpolator=sitk.sitkNearestNeighbor,
            outputOrigin=img.GetOrigin(),
            outputSpacing=[float(v) for v in new_spacing.tolist()],
            outputDirection=img.GetDirection(),
            defaultPixelValue=0,
            outputPixelType=img.GetPixelID(),
        )

        sitk.WriteImage(resampled, seg_path, useCompression=True)
        logger.warning(
            "VISTA3D output downsampled by %.2fx: size %s -> %s (%s)",
            factor,
            tuple(int(v) for v in old_size.tolist()),
            tuple(int(v) for v in new_size.tolist()),
            seg_path,
        )

    @mlflow.trace(span_type="MONAI")
    def model_infer(self, datastore, series_uid, label_prompt=None, points=None, point_labels=None, torch_device=None, file_ext=".nii.gz"):
        from vista3d_bundle.scripts.infer import InferClass

        series_dir = datastore.get_image_uri(series_uid)

        vista3d_model = InferClass(self.conf_file, torch_device=torch_device, file_ext=file_ext)
        pred = vista3d_model.infer(series_dir, label_prompt=label_prompt, point=points, point_label=point_labels, save_mask=True, output_dir=self.output_path, label_info=self.label_dict)

        self.logger.warning(f"Inference completed on image: {series_dir}")

        out_seg_path = pred.meta['saved_to']
        self._prune_segmentation_labels(out_seg_path, label_prompt=label_prompt)
        # Downsample only for OHIF path (.nii/.nii.gz) to reduce browser-side OOM.
        if str(file_ext).lower() in (".nii", ".nii.gz"):
            self._downsample_segmentation(out_seg_path)
        return series_dir, out_seg_path
