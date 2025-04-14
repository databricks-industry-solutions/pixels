import mlflow
import sys

import logging
import os
import time

import json

import numpy as np
from base64 import b64encode

from mlflow.entities import SpanType

from abc import abstractmethod

from common.utils import init_dicomweb_datastore, nifti_to_dicom_seg, to_nrrd, calculate_volumes_and_overlays, series_to_nifti

logger = logging.getLogger(__name__)

class DBModel(mlflow.pyfunc.PythonModel):

    IGNORE_PROMPT = set([])  
    EVERYTHING_PROMPT = list(set([i + 1 for i in range(1)]) - IGNORE_PROMPT)
    
    def __init__(self):
        mlflow.autolog(disable=True)
        self.logger = logging.getLogger(__name__)

        self.studies = os.environ["DATABRICKS_HOST"]
        self.app_dir = "./"

        self.model_name = "GENERIC"
        self.labels = None

        self.module_path = os.path.dirname(os.path.abspath(__file__))
        sys.path.append(self.module_path)

        os.putenv("MASTER_ADDR", "127.0.0.1")
        os.putenv("MASTER_PORT", "1234")
            
    def load_context(self, context):
        from dblabelapp import DBMONAILabelApp
     
        self.conf = {
            "models": "segmentation",
            "preload": "false",
            "output": "dicom_seg",
            "labels": self.labels,
            "table": os.environ["DATABRICKS_PIXELS_TABLE"]
        }

        self.dest_dir = os.environ["DEST_DIR"]
        self.app = DBMONAILabelApp(self.app_dir, self.studies, self.conf)

    def upload_file(self, file_path, dest_path):
        from databricks.sdk import WorkspaceClient
        w = WorkspaceClient()
        w.files.upload(dest_path, open(file_path, mode="rb"))
        self.logger.warning(f"File uploaded to {dest_path}")

    @abstractmethod
    def override_model_info(self, monailabel_info):
      pass

    @mlflow.trace(span_type=SpanType.TOOL)
    def handle_input(self, input_action):
        if "action" in input_action:
            if "info" == input_action["action"]:
                monailabel_info = self.app.info()
                self.override_model_info(monailabel_info)
                return monailabel_info
        else:
            raise Exception("Input not handled yet", input_action)
    
    @mlflow.trace(span_type="MONAI")
    @abstractmethod
    def model_infer(self, datastore, series_uid, label_prompt=None, points=None, point_labels=None):
        pass
    
    @mlflow.trace(span_type=SpanType.TOOL)
    def to_dicom_seg(self, dicom_path, nifti_path, nifti_seg_path, image_info, dest_dir, label_prompt=None, points=None, point_labels=None, export_overlays=True, export_metrics=True):
        from lib.configs.colors import SOME_COLORS

        prompts = None
        model_labels = [{} for _ in range(150)]

        for idx, label_name in enumerate(self.label_dict):
            model_labels[label_name] = {
                "name": self.label_dict[label_name],
                "model_name": self.model_name,
                "color": SOME_COLORS[idx+1]
            }

        if label_prompt:
            prompts = label_prompt
        elif point_labels:
            prompts = point_labels

        self.logger.warning(f"Starting conversion on image: {nifti_seg_path}")
        dicom_seg_file = nifti_to_dicom_seg(self.module_path+"/bin/", dicom_path, nifti_seg_path, model_labels, use_itk=True, series_description=image_info['SeriesDescription'])
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

        if "points" in input and input["points"] is not None:
            points = input["points"]
        
        if "point_labels" in input and input["point_labels"] is not None:
            point_labels = input["point_labels"]
        
        if points == None:
            label_prompt = self.EVERYTHING_PROMPT
            if "label_prompt" in input and input["label_prompt"] is not None:
                label_prompt = input["label_prompt"]
        
        if "pixels_table" in input and input["pixels_table"] is not None:
            table = input["pixels_table"]
            self.logger.warn(f"Overriding pixels table {table}")
        else:
            table = os.environ["DATABRICKS_PIXELS_TABLE"]
        
        datastore = init_dicomweb_datastore(os.environ["DATABRICKS_HOST"], os.environ['DATABRICKS_TOKEN'], os.environ["DATABRICKS_WAREHOUSE_ID"], table)

        return label_prompt, points, point_labels, datastore

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
    
    @abstractmethod
    def security_path_check(self, file_path):
        pass

    def predict(self, context, model_input, params=None):
        self.logger.warning(f"Processing {model_input.to_json()}")

        with mlflow.start_span(name=f"{self.model_name} - Inference", span_type="inference") as span:
            span.set_attribute("model_name", self.model_name)
            span.set_inputs(model_input.to_json())

            #handle multiple actions via input
            if "input" in model_input:
                #this avoids to trace file content in inference table
                if "get_file" in model_input['input'][0]:
                    result_dtype = "uint16"
                    file_path = model_input['input'][0]["get_file"]

                    self.security_path_check(file_path)

                    if "result_dtype" in model_input['input'][0]:
                        result_dtype = model_input['input'][0]["result_dtype"]

                    to_return = {"file_content": b64encode(open(to_nrrd(file_path, result_dtype), "rb").read()).decode("ascii")}
                    span.set_outputs(" - REDACTED B64 FILE CONTENT - ")
                elif "infer" in model_input['input'][0]:
                    label_prompt, points, point_labels, datastore = self.handle_labels(model_input["input"][0]['infer'])
                            
                    dicom_path, nifti_path, nifti_seg_path, image_info = self.model_infer(datastore, model_input["input"][0]['infer']['image'], label_prompt, points, point_labels)
                    to_return = {"file": nifti_seg_path, 'params' : { 'centroids' : {}}} #ohif 3.8 compatibility
                    span.set_outputs(to_return)
                else:
                    to_return = self.handle_input(model_input['input'][0])
                    span.set_outputs(to_return)
            elif "series_uid" in model_input:
                if "params" in model_input:
                    input_params = model_input["params"][0]
                else:
                    input_params = {}
                
                label_prompt, points, point_labels, datastore = self.handle_labels(input_params)
                dest_dir, export_overlays, export_metrics = self.handle_params(input_params)

                dicom_path, nifti_path, nifti_seg_path, image_info = self.model_infer(datastore, model_input["series_uid"][0], label_prompt, points, point_labels)
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
