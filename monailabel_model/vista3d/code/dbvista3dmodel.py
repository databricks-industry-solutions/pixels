import mlflow
import logging
import os

from common.abstractmodel import DBModel
from common.utils import series_to_nifti

logger = logging.getLogger(__name__)

class DBVISTA3DModel(DBModel):
    """
    VISTA3D Model for MONAI Label compatible with Databricks' serving endpoint.
    """

    IGNORE_PROMPT = set(
        [
            2,  # kidney
            16,  # prostate or uterus
            18,  # rectum
            20,  # lung
            21,  # bone
            129,  # kidney mass
            130,  # liver tumor
            131,  # vertebrae L6
        ]
    )  
    EVERYTHING_PROMPT = list(set([i + 1 for i in range(133)]) - IGNORE_PROMPT)

    def __init__(self):
        super().__init__()
    
    def load_context(self, context):
        import json
        import sys
        from monai import bundle

        self.model_name = "vista3d"

        self.module_path = os.path.dirname(os.path.abspath(__file__))
        sys.path.append(self.module_path)

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

    @mlflow.trace(span_type="MONAI")
    def model_infer(self, datastore, series_uid, label_prompt=None, points=None, point_labels=None):
        from vista3d_bundle.scripts.infer import InferClass

        nifti_path, image_info = series_to_nifti(datastore, series_uid)

        vista3d_model = InferClass(self.conf_file)
        vista3d_model.infer(image_info['path'], label_prompt=label_prompt, point=points, point_label=point_labels, save_mask=True)

        self.logger.warning(f"Inference completed on image: {nifti_path}")

        suffixes = [".nii", ".nii.gz", ".nrrd"]
        dicom_path = [nifti_path.replace(suffix, "") for suffix in suffixes if nifti_path.endswith(suffix)][0]
        nifti_seg_path = self.output_path + "/" + series_uid + "/" + series_uid + "_seg.nii.gz"
        return dicom_path, nifti_path, nifti_seg_path, image_info
