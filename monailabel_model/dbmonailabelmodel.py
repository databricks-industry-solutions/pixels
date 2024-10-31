import mlflow
import pandas as pd
import dblabelapp
from dblabelapp import DBMONAILabelApp
import logging
import os
import time

import json
import pathlib
import tempfile

import numpy as np
import pydicom_seg
import SimpleITK
from monai.transforms import LoadImage
from pydicom.filereader import dcmread

from monailabel.datastore.utils.colors import GENERIC_ANATOMY_COLORS

logger = logging.getLogger(__name__)

def nifti_to_dicom_seg(series_dir, label, label_info, file_ext="*", use_itk=True, series_description="segmentation") -> str:

    from monailabel.datastore.utils.convert import itk_image_to_dicom_seg
    start = time.time()

    label_np, meta_dict = LoadImage(image_only=False)(label)
    unique_labels = np.unique(label_np.flatten()).astype(np.int_)
    unique_labels = unique_labels[unique_labels != 0]

    info = label_info[0] if label_info and 0 < len(label_info) else {}
    model_name = info.get("model_name", "AIName")

    segment_attributes = []
    for i, idx in enumerate(unique_labels):
        info = label_info[i] if label_info and i < len(label_info) else {}
        name = info.get("name", "unknown")
        description = info.get("description", "Unknown")
        rgb = list(info.get("color", GENERIC_ANATOMY_COLORS.get(name, (255, 0, 0))))[0:3]
        rgb = [int(x) for x in rgb]

        logger.info(f"{i} => {idx} => {name}")

        segment_attribute = info.get(
            "segmentAttribute",
            {
                "labelID": int(idx),
                "SegmentLabel": name,
                "SegmentDescription": description,
                "SegmentAlgorithmType": "AUTOMATIC",
                "SegmentAlgorithmName": "MONAILABEL",
                "SegmentedPropertyCategoryCodeSequence": {
                    "CodeValue": "123037004",
                    "CodingSchemeDesignator": "SCT",
                    "CodeMeaning": "Anatomical Structure",
                },
                "SegmentedPropertyTypeCodeSequence": {
                    "CodeValue": "78961009",
                    "CodingSchemeDesignator": "SCT",
                    "CodeMeaning": name,
                },
                "recommendedDisplayRGBValue": rgb,
            },
        )
        segment_attributes.append(segment_attribute)

    template = {
        "ContentCreatorName": "Reader1",
        "ClinicalTrialSeriesID": "Session1",
        "ClinicalTrialTimePointID": "1",
        "SeriesNumber": "300",
        "SeriesDescription": series_description,
        "InstanceNumber": "1",
        "segmentAttributes": [segment_attributes],
        "ContentLabel": series_description,
        "ContentDescription": "MONAI Label - Image segmentation",
        "ClinicalTrialCoordinatingCenterName": "MONAI",
        "BodyPartExamined": "",
    }

    logger.info(json.dumps(template, indent=2))
    if not segment_attributes:
        logger.error("Missing Attributes/Empty Label provided")
        return ""

    if use_itk:
        output_file = itk_image_to_dicom_seg(label, series_dir, template)
    else:
        template = pydicom_seg.template.from_dcmqi_metainfo(template)
        writer = pydicom_seg.MultiClassWriter(
            template=template,
            inplane_cropping=False,
            skip_empty_slices=False,
            skip_missing_segment=False,
        )

        # Read source Images
        series_dir = pathlib.Path(series_dir)
        image_files = series_dir.glob(file_ext)
        image_datasets = [dcmread(str(f), stop_before_pixels=True) for f in image_files]
        logger.info(f"Total Source Images: {len(image_datasets)}")

        mask = SimpleITK.ReadImage(label)
        mask = SimpleITK.Cast(mask, SimpleITK.sitkUInt16)

        output_file = tempfile.NamedTemporaryFile(suffix=".dcm").name
        dcm = writer.write(mask, image_datasets)
        dcm.save_as(output_file)

    logger.info(f"nifti_to_dicom_seg latency : {time.time() - start} (sec)")
    return output_file

class DBMONAILabelModel(mlflow.pyfunc.PythonModel):

    def __init__(self):
        self.logger = logging.getLogger(__name__)
        if f"{os.getcwd()}/bin" not in os.environ['PATH']:
            os.environ['PATH'] += f"{os.pathsep}{os.getcwd()}/bin"

    def predict(self, context, model_input, params=None):
        studies = os.environ["DATABRICKS_HOST"]
        app_dir = "./"
        test = "infer"
        model_nv = "segmentation"

        os.putenv("MASTER_ADDR", "127.0.0.1")
        os.putenv("MASTER_PORT", "1234")
        
        conf = {
            "models": model_nv,
            "preload": "false",
            "table": os.environ["DATABRICKS_PIXELS_TABLE"],
            "output": "dicom_seg"
        }

        dest_dir = os.environ["DEST_DIR"]
        app = DBMONAILabelApp(app_dir, studies, conf)

        self.logger.warning(f"Processing {model_input}")

        def upload_file(self, file_path, dest_path):
            from databricks.sdk import WorkspaceClient
            w = WorkspaceClient()
            w.files.upload(dest_path, open(file_path, mode="rb"))
            self.logger.warning(f"File uploaded to {dest_path}")

        def infer_autosegmentation(image_id):
            from monailabel.utils.others.generic import device_list, file_ext
            from lib.configs.colors import SOME_COLORS
            
            #get image in .cache folder
            image = app.datastore().get_image(image_id)
            #get cached image uri
            image_uri = app.datastore().get_image_uri(image_id)
            #get cached image infos
            image_info = app.datastore().get_image_info(image_id)

            self.logger.warning(f"Processing image URI: {image_uri}")

            result = app.infer(request={'model': 'segmentation', 'image': image_id, 'largest_cc': False, 'device': device_list()[0], 'result_extension': '.nrrd', 'result_dtype': 'uint16', 'result_compress': False, 'restore_label_idx': False})
            
            self.logger.warning(f"Inference completed on image: {image_uri}")

            suffixes = [".nii", ".nii.gz", ".nrrd"]
            image_path = [image_uri.replace(suffix, "") for suffix in suffixes if image_uri.endswith(suffix)][0]
            res_img = result.get("file") if result.get("file") else result.get("label")

            model_labels = []
            for idx, label_name in enumerate(app.info()['models'][model_nv]["labels"]):
                model_labels.append({
                    "name": label_name.replace("_"," "),
                    "model_name": model_nv,
                    "color": SOME_COLORS[idx+1]
                })

            label_names = [model_labels[int(centroid.split("_")[1])-1] for centroid in result.get("params").get("centroids").keys()]

            self.logger.warning(f"Starting conversion on image: {res_img}")
            dicom_seg_file = nifti_to_dicom_seg(image_path, res_img, label_names, use_itk=True, series_description=image_info['SeriesDescription'])
            self.logger.warning(f"Conversion completed on image: {res_img}, temp file path: {dicom_seg_file}")

            label_json = result["params"]

            label_file = os.path.join(dest_dir, image_id+".dcm")
            self.logger.warning(f"Destination file path: {label_file}")
            
            upload_file(self, dicom_seg_file, label_file)

            print(f"++++ Image File: {image_path}")
            print(f"++++ Label File: {label_file}")
            return label_file

        return model_input.apply(lambda x: infer_autosegmentation(x['image_id']), axis=1)