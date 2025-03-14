import mlflow
import pandas as pd
import sys

import logging
import os
import time
from uuid import uuid4

import json
import pathlib
import tempfile

import numpy as np
import pydicom_seg
import pydicom
import SimpleITK as sitk
import nibabel as nib
from pydicom.filereader import dcmread
from base64 import b64encode

from monailabel.datastore.utils.colors import GENERIC_ANATOMY_COLORS

import cupy as cp
from cucim.skimage.color import label2rgb
import skimage

from mlflow.entities import SpanType

logger = logging.getLogger(__name__)

IGNORE_PROMPT = set(
    [
        2,  # kidney
        16,  # prostate or uterus
        18,  # rectum
        20,  # lung
        21,  # bone
        23,  # lung tumor
        24,  # pancreatic tumor
        25,  # hepatic vessel
        26,  # hepatic tumor
        27,  # colon cancer primaries
        128,  # bone lesion
        129,  # kidney mass
        130,  # liver tumor
        131,  # vertebrae L6
        132,
    ]
)  # airway
EVERYTHING_PROMPT = list(set([i + 1 for i in range(133)]) - IGNORE_PROMPT)

class DBVISTA3DModel(mlflow.pyfunc.PythonModel):
    
    def __init__(self):
        mlflow.autolog(disable=True)
        self.logger = logging.getLogger(__name__)

        self.studies = os.environ["DATABRICKS_HOST"]
        self.app_dir = "./"

        os.putenv("MASTER_ADDR", "127.0.0.1")
        os.putenv("MASTER_PORT", "1234")
            
    def load_context(self, context):
        module_path = os.path.dirname(os.path.abspath(__file__))
        sys.path.append(module_path)

        from dblabelapp import DBMONAILabelApp
        from monai import bundle
                
        if f"{module_path}/bin" not in os.environ['PATH']:
            os.environ['PATH'] += f"{os.pathsep}{module_path}/bin"

        with open(f'{module_path}/vista3d_bundle/data/jsons/label_dict.json', 'r') as file:
            label_dict = json.load(file)       
            self.label_dict = {v: k for k, v in label_dict.items()}

        predef_labels = json.load(open(f'{module_path}/vista3d_bundle/data/jsons/label_dict.json'))
        
        self.conf = {
            "models": "segmentation",
            "preload": "false",
            "output": "dicom_seg",
            "labels": json.dumps(predef_labels),
            "table": os.environ["DATABRICKS_PIXELS_TABLE"]
        }

        self.conf_file = f"{module_path}/vista3d_bundle/configs/infer.yaml"

        self.dest_dir = os.environ["DEST_DIR"]

        parser = bundle.ConfigParser()
        parser.read_config(self.conf_file)

        self.logger.warning(f"VISTA3D - downloading model")
        bundle.download("vista3d",bundle_dir="/tmp/vista/bundles/")
        self.logger.warning(f"VISTA3D - model download completed")

        self.output_path = parser.get_parsed_content("infer")["output_path"]

        self.app = DBMONAILabelApp(self.app_dir, self.studies, self.conf)

    def upload_file(self, file_path, dest_path):
        from databricks.sdk import WorkspaceClient
        w = WorkspaceClient()
        w.files.upload(dest_path, open(file_path, mode="rb"))
        self.logger.warning(f"File uploaded to {dest_path}")

    @mlflow.trace(span_type=SpanType.TOOL)
    def handle_input(self, input_action):
        if "action" in input_action:
            if "info" == input_action["action"]:
                return self.app.info()
        else:
            raise Exception("Input not handled yet", input_action)

    @mlflow.trace(span_type="MONAI")
    def model_infer(self, series_uid, label_prompt=None, points=None, point_labels=None):
        from vista3d_bundle.scripts.infer import InferClass

        #get image in .cache folder
        image = self.app.datastore().get_image(series_uid)
        #get cached image uri
        nifti_path = self.app.datastore().get_image_uri(series_uid)
        #get cached image infos
        image_info = self.app.datastore().get_image_info(series_uid)

        vista3d_model = InferClass(self.conf_file)
        vista3d_model.infer(image_info['path'], label_prompt=label_prompt, point=points, point_label=point_labels, save_mask=True)

        self.logger.warning(f"Inference completed on image: {nifti_path}")

        suffixes = [".nii", ".nii.gz", ".nrrd"]
        dicom_path = [nifti_path.replace(suffix, "") for suffix in suffixes if nifti_path.endswith(suffix)][0]
        nifti_seg_path = self.output_path + "/" + series_uid + "/" + series_uid + "_seg.nii.gz"
        return dicom_path, nifti_path, nifti_seg_path, image_info
    
    @mlflow.trace(span_type=SpanType.TOOL)
    def to_dicom_seg(self, dicom_path, nifti_path, nifti_seg_path, image_info, dest_dir, label_prompt=None, points=None, point_labels=None, export_overlays=True, export_metrics=True):
        from lib.configs.colors import SOME_COLORS

        model_labels = [{} for _ in range(150)]

        for idx, label_name in enumerate(self.label_dict):
            model_labels[label_name] = {
                "name": self.label_dict[label_name],
                "model_name": "vista3d",
                "color": SOME_COLORS[idx+1]
            }

        if label_prompt:
            prompts = label_prompt
        elif point_labels:
            prompts = point_labels

        label_names = [model_labels[label_id] for label_id in prompts]

        self.logger.warning(f"Starting conversion on image: {nifti_seg_path}")
        dicom_seg_file = nifti_to_dicom_seg(dicom_path, nifti_seg_path, label_names, use_itk=True, series_description=image_info['SeriesDescription'])
        self.logger.warning(f"Conversion completed on image: {nifti_seg_path}, temp file path: {dicom_seg_file}")

        dicom_seg_path = os.path.join(dest_dir, image_info['StudyInstanceUID'], image_info['SeriesInstanceUID']+".dcm")
        self.logger.warning(f"Destination file path: {dicom_seg_path}")
        
        self.upload_file(dicom_seg_file, dicom_seg_path)

        print(f"++++ DICOM File: {dicom_path}")
        print(f"++++ DICOM SEG File: {dicom_seg_path}")
        
        return dicom_seg_path
    
    def handle_labels(self, input):
        label_prompt = None
        points = None
        point_labels = None

        if "points" in input:
            points = input["points"]
        
        if "point_labels" in input:
            point_labels = input["point_labels"]
        
        if points == None:
            label_prompt = EVERYTHING_PROMPT
            if "label_prompt" in input:
                label_prompt = input["label_prompt"]

        return label_prompt, points, point_labels

    def handle_params(self, input):
        export_metrics = None
        export_overlays = None
        dest_dir = self.dest_dir

        if "dest_dir" in input:
            dest_dir = input["dest_dir"]

        if "export_metrics" in input:
            export_metrics = input["export_metrics"]

        if "export_overlays" in input:
            export_overlays = input["export_overlays"]

        return dest_dir, export_overlays, export_metrics

    def predict(self, context, model_input, params=None):
        self.logger.warning(f"Processing {model_input.to_json()}")

        with mlflow.start_span(name="VISTA3D - INFERENCE", span_type="inference") as span:
            span.set_attribute("model_name", "vista3d")
            span.set_inputs(model_input.to_json())

            #handle multiple actions via input
            if "input" in model_input:
                #this avoids to trace file content in inference table
                if "get_file" in model_input['input'][0]:
                    result_dtype = "uint16"
                    file_path = model_input['input'][0]["get_file"]

                    if "result_dtype" in model_input['input'][0]:
                        result_dtype = model_input['input'][0]["result_dtype"]

                    if not file_path.startswith("/tmp/vista/bundles/vista3d/models/prediction/") or ".." in file_path:
                        raise Exception("Invalid file path", file_path)

                    to_return = {"file_content": b64encode(open(to_nrrd(file_path, result_dtype), "rb").read()).decode("ascii")}
                    span.set_outputs(" - REDACTED B64 FILE CONTENT - ")
                elif "infer" in model_input['input'][0]:
                    label_prompt, points, point_labels = self.handle_labels(model_input["input"][0]['infer'])
                            
                    dicom_path, nifti_path, nifti_seg_path, image_info = self.model_infer(model_input["input"][0]['infer']['image'], label_prompt, points, point_labels)
                    to_return = {"file_path": nifti_seg_path}
                    span.set_outputs(to_return)
                else:
                    to_return = self.handle_input(model_input['input'][0])
                    span.set_outputs(to_return)
            elif "series_uid" in model_input:
                label_prompt, points, point_labels = self.handle_labels(model_input['params'][0])
                dest_dir, export_overlays, export_metrics = self.handle_params(model_input['params'][0])

                dicom_path, nifti_path, nifti_seg_path, image_info = self.model_infer(model_input["series_uid"][0], label_prompt, points, point_labels)
                dicom_seg_path = self.to_dicom_seg(dicom_path, nifti_path, nifti_seg_path, image_info, dest_dir, label_prompt, points, point_labels, export_overlays, export_metrics)

                if export_overlays or export_metrics:
                    metrics = calculate_volumes_and_overlays(nifti_path, nifti_seg_path, self.label_dict, output_dir=dest_dir+"/overlays/"+image_info['StudyInstanceUID'] + "/" + image_info['SeriesInstanceUID'] + "/", export_overlays=export_overlays, export_metrics=export_metrics)
                else:
                    metrics = None

                to_return =  {"file_path": dicom_seg_path, "metrics": metrics}

                span.set_outputs(to_return)
            else:
                raise Exception("Unknown operation", model_input) 
        
        return json.dumps(to_return)
    
@mlflow.trace(span_type=SpanType.TOOL)
def to_nrrd(file_path, pixel_type="uint16"):
    import SimpleITK as sitk

    if pixel_type.lower() == "uint8":
        output_pixel_type = sitk.sitkUInt8
    elif pixel_type.lower() == "uint16":
        output_pixel_type = sitk.sitkUInt16
    elif pixel_type.lower() == "float32":
        output_pixel_type = sitk.sitkFloat32
    else:
        raise Exception("Unsupported pixel type", pixel_type)

    if file_path.endswith(".nii.gz") or file_path.endswith(".nii") or file_path.endswith(".dcm"):
        img = sitk.ReadImage(file_path, outputPixelType=output_pixel_type)
        output_file = tempfile.NamedTemporaryFile(suffix=".nrrd").name
        sitk.WriteImage(img, output_file)
        return output_file
    else:
        raise Exception("Unable to convert file", file_path)

@mlflow.trace(span_type=SpanType.TOOL)
def calculate_volumes_and_overlays(nifti_file, seg_file, label_dict, export_overlays=False, export_metrics=False, output_dir='overlaps', num_slices=5,  keys=['image','label'], window_center = 50, window_width = 400):
    from monai.transforms import Compose, LoadImageD, OrientationD, ScaleIntensityRangeD
    from vista3d_bundle.configs.utils import Dye

    os.makedirs(output_dir, exist_ok=True)

    composed = Compose([LoadImageD(keys=keys, ensure_channel_first=True),
                        OrientationD(keys=keys, axcodes="LAS"),
                        ScaleIntensityRangeD(
                        keys=['image'],
                        a_min=window_center - window_width / 2,
                        a_max=window_center + window_width / 2,
                        b_min=0,
                        b_max=255,
                        clip=True)
        ])({'image': nifti_file,'label': seg_file})

    nifti_seg_header = nib.load(seg_file).header

    nifti_data = cp.rot90(cp.array(composed['image'][0]), k=1)
    seg_data = cp.rot90(cp.array(composed['label'][0]), k=1)

    # Get unique labels
    unique_labels = cp.unique(seg_data)
    unique_labels = unique_labels[unique_labels != 0]

    # Get voxel dimensions from header
    voxel_dims = nifti_seg_header.get_zooms()
    voxel_volume = np.prod(voxel_dims)
    
    output = {}

    for label_num, label in enumerate(unique_labels):
        label_idx = int(label.get())
        label_name = label_dict.get(label_idx)

        logger.warn(f"Processing label: {label} - {label_name}")
        
        if label_name is None:
            logger.warn(f"No label name found for label: {label_num}, skipping")
            continue

        color_name = Dye.COLORS[label_num % len(Dye.COLORS)]

        output[label_name] = {}

        mask = seg_data == label
        z_indices = cp.where(cp.any(mask, axis=(0,1)))[0]
        
        if len(z_indices) > num_slices:
            positions = cp.linspace(0, len(z_indices) - 1, num_slices, dtype=int)
            indices = z_indices[positions]
        else:
            indices = z_indices
        
        if export_metrics:
            voxel_count = cp.sum(seg_data == label)
            volume = voxel_count * voxel_volume

            output[label_name]['voxel_count'] = int(voxel_count.get())
            output[label_name]['volume_mm3'] = float(volume.get())
            output[label_name]['color'] = color_name

        if export_overlays:
            output[label_name]['overlay_paths'] = []
        
            for idx in indices:
                idx_val = idx.get()
                slice_img = nifti_data[:,:,idx_val]
                slice_img = (slice_img - slice_img.min()) / (slice_img.max() - slice_img.min())

                slice_mask = mask[:,:,idx]

                color_label = (
                    label2rgb(
                        slice_mask, colors=[color_name], image=slice_img, bg_label=0
                    )
                * 255
                )

                filename = f'label_{label_name.lower().replace(" ", "_")}_slice_{int(idx_val)}.jpg'
                filepath = os.path.join(output_dir, filename)
                skimage.io.imsave(filepath, color_label.get().astype(np.uint8))
                
                output[label_name]['overlay_paths'].append(filepath)
                
    return output

def nifti_to_dicom_seg(series_dir, label, label_info, file_ext="*", use_itk=True, series_description="vista3d") -> str:
    from monailabel.datastore.utils.convert import itk_image_to_dicom_seg
    from monai.transforms import LoadImage
    
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

    if not segment_attributes:
        logger.error("Missing Attributes/Empty Label provided")
        return ""

    logger.warning(f"PRE ITK_IMAGE_TO_DICOM_SEG: {time.time() - start} (sec)")
            
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

        mask = sitk.ReadImage(label)
        mask = sitk.Cast(mask, sitk.sitkUInt16)

        output_file = tempfile.NamedTemporaryFile(suffix=".dcm").name
        dcm = writer.write(mask, image_datasets)
        dcm.save_as(output_file)

    logger.warning(f"nifti_to_dicom_seg latency : {time.time() - start} (sec)")
    return output_file