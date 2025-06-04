import mlflow
import logging
import os
import time

from common.abstractmodel import DBModel
from common.utils import series_to_nifti
from mlflow.entities import SpanType

logger = logging.getLogger(__name__)

class DBBundlesModel(DBModel):
    """
    Basic Model Class for MONAI Label models and bundles compatible with Databricks' serving endpoint.
    """
    
    def __init__(self, volumes_compatible=False):
        super().__init__(volumes_compatible=volumes_compatible)
            
    def load_context(self, context=None):
        super().load_context(context)

    @mlflow.trace(span_type=SpanType.TOOL)
    def handle_input(self, input_action):
        if "action" in input_action:
            if "info" == input_action["action"]:
                return self.app.info()
            
            #send activelearning/random string to retrieve next series url
            elif "activelearning" in input_action["action"]:
                strategy = input_action["action"].split("/")[1]
                request = {"strategy": strategy}
                config = self.app.info().get("config", {}).get("activelearning", {})
                request.update(config)
                result = self.app.next_sample(request)
                if not result:
                    return {}

                image_id = result["id"]
                image_info = self.app.datastore().get_image_info(image_id)

                strategy_info = image_info.get("strategy", {})
                strategy_info[strategy] = {"ts": int(time.time())}
                try:
                    self.app.datastore().update_image_info(image_id, {"strategy": strategy_info})
                except:
                    logger.warning(f"Failed to update Image info for {image_id}")

                result.update(image_info)
                return result
            
        #send activelearning/random string to retrieve next series url
        elif "train" in input_action:
            return self.app.train(request=input_action["train"])
        else:
            raise Exception("Input not handled yet", input_action)
    
    @mlflow.trace(span_type="MONAI")
    def model_infer(self, datastore, series_uid, label_prompt=None, points=None, point_labels=None, torch_device=None, file_ext=".nii.gz"):
        nifti_path, image_info = series_to_nifti(datastore, series_uid)

        result = self.app.infer(request={'model': self.model_name, 'image': series_uid, 'largest_cc': False, 'device': torch_device, 'result_extension': file_ext, 'result_dtype': 'uint16', 'result_compress': False, 'restore_label_idx': False})

        self.logger.warning(f"Inference completed on image: {nifti_path}")

        suffixes = [".nii", ".nii.gz", ".nrrd"]
        dicom_path = [nifti_path.replace(suffix, "") for suffix in suffixes if nifti_path.endswith(suffix)][0]
        nifti_seg_path = result.get("file") if result.get("file") else result.get("label")
        return dicom_path, nifti_path, nifti_seg_path, image_info
    
    def security_path_check(self, file_path):
        if not file_path.startswith("/tmp/") or ".." in file_path:
            raise Exception("Invalid file path", file_path)
