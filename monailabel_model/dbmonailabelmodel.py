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
import pydicom
import SimpleITK
from monai.transforms import LoadImage
from pydicom.filereader import dcmread
from base64 import b64encode

from monailabel.datastore.utils.colors import GENERIC_ANATOMY_COLORS

logger = logging.getLogger(__name__)


class DBMONAILabelModel(mlflow.pyfunc.PythonModel):

    def __init__(self, model="segmentation", labels=None):
        self.logger = logging.getLogger(__name__)
        if f"{os.getcwd()}/bin" not in os.environ['PATH']:
            os.environ['PATH'] += f"{os.pathsep}{os.getcwd()}/bin"

        self.studies = os.environ["DATABRICKS_HOST"]
        self.app_dir = "./"
        self.test = "infer"

        os.putenv("MASTER_ADDR", "127.0.0.1")
        os.putenv("MASTER_PORT", "1234")
        
        self.conf = {
            "models": model,
            "preload": "false",
            "table": os.environ["DATABRICKS_PIXELS_TABLE"],
            "output": "dicom_seg"
        }

        if labels:
            self.conf.labels = labels

        self.dest_dir = os.environ["DEST_DIR"]

    def handle_input(self, app, model_input):
        if "info" == model_input["input"]:
            return json.dumps(app.info())
        
        #send activelearning/random string to retrieve next series url
        elif "activelearning" in model_input["input"]:
            strategy = model_input["input"].split("/")[1]
            request = {"strategy": strategy}
            config = app.info().get("config", {}).get("activelearning", {})
            request.update(config)
            result = app.next_sample(request)
            if not result:
                return {}

            image_id = result["id"]
            image_info = app.datastore().get_image_info(image_id)

            strategy_info = image_info.get("strategy", {})
            strategy_info[strategy] = {"ts": int(time.time())}
            try:
                app.datastore().update_image_info(image_id, {"strategy": strategy_info})
            except:
                logger.warning(f"Failed to update Image info for {image_id}")

            result.update(image_info)
            return result
            
        #send activelearning/random string to retrieve next series url
        elif "train" in model_input["input"]:
            return app.train(request=model_input["input"]["train"])
            
        elif "infer" in model_input["input"]:
            return app.infer(request=model_input["input"]["infer"])
            
        #can this be a security issue?
        elif "get_file" in model_input["input"]:
            return {"file_content": b64encode(open(model_input["input"]["get_file"], "rb").read()).decode("ascii")}
        else:
            raise Exception("Input not handled yet", model_input)
        

    def predict(self, context, model_input, params=None):
        self.logger.warning(f"Processing {model_input}")

        app = DBMONAILabelApp(self.app_dir, self.studies, self.conf)

        #send info string to retrieve MONAILabel server info
        if "input" in model_input:
            return self.handle_input(app, model_input)

        def upload_file(self, file_path, dest_path):
            from databricks.sdk import WorkspaceClient
            w = WorkspaceClient()
            w.files.upload(dest_path, open(file_path, mode="rb"))
            self.logger.warning(f"File uploaded to {dest_path}")

        #TODO Complete optional step to avoid additional task in workflow
        def insert_seg_catalog(self, file_path, dest_path):
            import hashlib
            from databricks.sdk import WorkspaceClient

            w = WorkspaceClient()

            fp = open(file_path, "rb")
            with pydicom.dcmread(fp, defer_size=1000, stop_before_pixels=True) as ds:
                js = ds.to_json_dict()
                js["file_size"] = os.stat(file_path).st_size
                js["hash"] = hashlib.sha1(fp.read()).hexdigest()

                body = {
                    "warehouse_id": os.environ["DATABRICKS_WAREHOUSE_ID"],
                    "statement": f"""INSERT INTO ${os.environ["DATABRICKS_PIXELS_TABLE"]}
                (path, modificationTime, length, original_path, relative_path, local_path,
                extension, file_type, path_tags, is_anon, meta)
                VALUES (
                'dbfs:/${dest_path}',  current_timestamp(), '${js["hash"]}', 'dbfs:/${dest_path}', '${dest_path}', '/${dest_path}',
                'dcm', '', array(), 'true', '${json.dumps(js)}'
                )""",
                    "wait_timeout": "30s",
                    "on_wait_timeout": "CANCEL"
                }

        def infer_autosegmentation(series_uid):
            from monailabel.utils.others.generic import device_list, file_ext
            from lib.configs.colors import SOME_COLORS
            
            #get image in .cache folder
            image = app.datastore().get_image(series_uid)
            #get cached image uri
            image_uri = app.datastore().get_image_uri(series_uid)
            #get cached image infos
            image_info = app.datastore().get_image_info(series_uid)

            self.logger.warning(f"Processing image URI: {image_uri}")

            result = app.infer(request={'model': 'segmentation', 'image': series_uid, 'largest_cc': False, 'device': device_list()[0], 'result_extension': '.nrrd', 'result_dtype': 'uint16', 'result_compress': False, 'restore_label_idx': False})
            
            self.logger.warning(f"Inference completed on image: {image_uri}")

            suffixes = [".nii", ".nii.gz", ".nrrd"]
            image_path = [image_uri.replace(suffix, "") for suffix in suffixes if image_uri.endswith(suffix)][0]
            res_img = result.get("file") if result.get("file") else result.get("label")

            model_labels = []
            for idx, label_name in enumerate(app.info()['models'][self.conf["models"]]["labels"]):
                model_labels.append({
                    "name": label_name.replace("_"," "),
                    "model_name": self.conf["models"],
                    "color": SOME_COLORS[idx+1]
                })

            label_names = [model_labels[int(centroid.split("_")[1])-1] for centroid in result.get("params").get("centroids").keys()]

            self.logger.warning(f"Starting conversion on image: {res_img}")
            dicom_seg_file = nifti_to_dicom_seg(image_path, res_img, label_names, use_itk=True, series_description=image_info['SeriesDescription'])
            self.logger.warning(f"Conversion completed on image: {res_img}, temp file path: {dicom_seg_file}")

            label_json = result["params"]

            label_file = os.path.join(self.dest_dir, image_info['StudyInstanceUID'], series_uid+".dcm")
            self.logger.warning(f"Destination file path: {label_file}")
            
            upload_file(self, dicom_seg_file, label_file)

            print(f"++++ Image File: {image_path}")
            print(f"++++ Label File: {label_file}")
            return label_file

        return model_input.apply(lambda x: infer_autosegmentation(x['series_uid']), axis=1)
    
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
        "SeriesNumber": "9999",
        "SeriesDescription": series_description,
        "InstanceNumber": "1",
        "segmentAttributes": [segment_attributes],
        "ContentLabel": series_description,
        "ContentDescription": "Pixels - MONAI Label - Image segmentation",
        "ClinicalTrialCoordinatingCenterName": "Pixels - MONAI",
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
