import mlflow
import sys
import logging
import os
import json
import shutil
from base64 import b64encode
from mlflow.entities import SpanType
from abc import abstractmethod
import datetime
from common.utils import init_dicomweb_datastore, nifti_to_dicom_seg, to_nrrd, calculate_volumes_and_overlays, create_token_from_service_principal
from monailabel.datastore.databricks_client import DatabricksClient

logger = logging.getLogger(__name__)

class DBModel(mlflow.pyfunc.PythonModel):
    """
    Abstract base class that extends `mlflow.pyfunc.PythonModel` to provide a framework for handling 
    medical imaging models, specifically for DICOM and NIfTI file formats. This class includes methods for loading 
    context, handling input, performing inference, and converting NIfTI segmentations to DICOM SEG format.
    """

    IGNORE_PROMPT = set([])
    EVERYTHING_PROMPT = list(set([i + 1 for i in range(1)]) - IGNORE_PROMPT)
    
    def __init__(self, volumes_compatible=False):
        mlflow.autolog(disable=True)
        self.logger = logging.getLogger(__name__)

        self.studies = os.environ["DATABRICKS_HOST"]
        self.app_dir = "./"

        self.model_name = "GENERIC"
        self.label_dict = None
        self.labels = None

        self.volumes_compatible = volumes_compatible

        os.putenv("MASTER_ADDR", "127.0.0.1")
        os.putenv("MASTER_PORT", "1234")
            
    def load_context(self, context=None):
        self.module_path = os.path.dirname(os.path.abspath(__file__))
        sys.path.append(self.module_path)

        self.bin_path = os.path.join(self.module_path, "bin")

        if context is not None:
            self.bin_path = context.artifacts["itkimage2segimage"]
            
            try:  os.chmod(self.bin_path, 0o755)
            except Exception as e:
                logger.warning(e)
        else:
            self.bin_path = os.path.join(self.module_path, "../artifacts/itkimage2segimage")

        from common.dblabelapp import DBMONAILabelApp
        import common.writers

        self.conf = {
            "models": "segmentation",
            "preload": "false",
            "output": "dicom_seg",
            "table": os.environ["DATABRICKS_PIXELS_TABLE"]
        }

        if self.labels is not None:
            self.conf['labels'] = self.labels

        if "MONAI_BUNDLES" in os.environ:
            self.conf['bundles'] = os.environ["MONAI_BUNDLES"]
            self.model_name = os.environ["MONAI_BUNDLES"]
            del self.conf['models']
        elif "MONAI_MODELS" in os.environ:
            self.conf['models'] = os.environ["MONAI_MODELS"]
            self.model_name = os.environ["MONAI_MODELS"]

        self.dest_dir = os.environ["DEST_DIR"]

        self.token_expiration: Optional[datetime.datetime] = None

        self.app = DBMONAILabelApp(self.app_dir, self.studies, self.conf)

        if "DATABRICKS_SCOPE" in os.environ and "CLIENT_APP_ID" in os.environ and "CLIENT_SECRET" in os.environ:
            self.logger.warning(f"Service principal credentials found. Will use service principal to authenticate.")
            self.refresh_token()
        else:
            self.logger.warning(f"No service principal credentials found. Will fallback to PAT.")

        if self.label_dict is None:
            labels = self.app.info()["models"][self.model_name]['labels']
            self.label_dict = {v: k for k, v in labels.items()}

    def refresh_token(self):
        token = create_token_from_service_principal(os.environ["DATABRICKS_HOST"], os.environ["DATABRICKS_SCOPE"], os.environ["CLIENT_APP_ID"], os.environ["CLIENT_SECRET"])
        os.environ["DATABRICKS_TOKEN"] = token['access_token']
        self.token_expiration = datetime.datetime.now() + datetime.timedelta(seconds=(token['expires_in'] * 0.9))
            
        #force refresh datastore with the new token
        self.app._datastore._client = DatabricksClient(
            url=os.environ["DATABRICKS_HOST"],
            token=token['access_token'],
            warehouse_id=os.environ["DATABRICKS_WAREHOUSE_ID"],
            table=os.environ["DATABRICKS_PIXELS_TABLE"],
        )

    def upload_file(self, file_path, dest_path):
        """
        Uploads a file to the specified destination path in Databricks.
        Args:
            file_path (str): The path to the file to be uploaded.
            dest_path (str): The destination path in Databricks.
        """
        if self.volumes_compatible:
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            shutil.copy(file_path, dest_path)
        else:
            from databricks.sdk import WorkspaceClient
            w = WorkspaceClient()
            w.files.upload(dest_path, open(file_path, mode="rb"))
        
        self.logger.warning(f"File uploaded to {dest_path}")

    @abstractmethod
    def override_model_info(self, monailabel_info):
        """
        Override model information based on MONAI Label info.
        Args:
            monailabel_info (dict): The MONAI Label information.
        """

        pass

    @mlflow.trace(span_type=SpanType.TOOL)
    def handle_input(self, input_action):
        """
        Handles input actions such as retrieving model information.
        Args:
            input_action (dict): The input action to be handled.
        Returns:
            dict: The result of the input action.
        """

        if "action" in input_action:
            if "info" == input_action["action"]:
                monailabel_info = self.app.info()
                self.override_model_info(monailabel_info)
                return monailabel_info
        else:
            raise Exception("Input not handled yet", input_action)
    
    @mlflow.trace(span_type="MONAI")
    @abstractmethod
    def model_infer(self, datastore, series_uid, label_prompt=None, points=None, point_labels=None, torch_device=None, file_ext=".nii.gz"):
        """
        Performs model inference on a given series.
        Args:
            datastore (object): The datastore object for accessing DICOM images.
            series_uid (str): The unique identifier for the series to be processed.
            label_prompt (str): The label prompt for inference.
            points (list): List of points for inference.
            point_labels (list): List of point labels for inference.
        Returns:
            tuple: The dicom file path, The NIfTI file path, NIfTI seg file path,  and image information.
        """
        pass
    
    @mlflow.trace(span_type=SpanType.TOOL)
    def to_dicom_seg(self, dicom_path, nifti_seg_path, series_description):
        """
        Converts a NIfTI segmentation file to a DICOM SEG file and uploads it to the destination.
        Args:
            dicom_path (str): The path to the DICOM file.
            nifti_seg_path (str): The path to the NIfTI segmentation file.
            series_description (str): The description of the series.
        Returns:
            str: The path to the DICOM SEG file.
        """

        from lib.configs.colors import SOME_COLORS

        model_labels = [{} for _ in range(150)]

        for idx, label_name in enumerate(self.label_dict):
            model_labels[label_name] = {
                "name": self.label_dict[label_name],
                "model_name": self.model_name,
                "color": SOME_COLORS[idx+1]
            }

        self.logger.warning(f"Starting conversion on image: {nifti_seg_path}")
        dicom_seg_file = nifti_to_dicom_seg(self.bin_path, dicom_path, nifti_seg_path, model_labels, use_itk=True, series_description=series_description)
        self.logger.warning(f"Conversion completed on image: {nifti_seg_path}, temp file path: {dicom_seg_file}")
        
        return dicom_seg_file
    
    def handle_labels(self, input):
        """
        Processes input to extract label prompts, points, and point labels, and initializes the datastore.
        Args:
            input (dict): The input dictionary containing label prompts and points.
        Returns:    
            tuple: The label prompt, points, point labels, and datastore.
        """

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
        """
        Processes input to extract parameters such as destination directory, export overlays, and export metrics.
        Args:
            input (dict): The input dictionary containing parameters.
        Returns:
            tuple: The destination directory, export overlays, and export metrics.
        """

        export_metrics = None
        export_overlays = None
        dest_dir = self.dest_dir
        torch_device = "cuda"

        if "dest_dir" in input and input["dest_dir"] is not None:
            dest_dir = input["dest_dir"]

        if "export_metrics" in input:
            export_metrics = input["export_metrics"]

        if "export_overlays" in input:
            export_overlays = input["export_overlays"]
        
        if "torch_device" in input:
            torch_device = input["torch_device"]
        
        return dest_dir, export_overlays, export_metrics, torch_device
    
    @abstractmethod
    def security_path_check(self, file_path):
        """
        Perform security checks on file paths.
        Args:
            file_path (str): The file path to be checked.
        Raises:
            Exception: Raised if the file path is invalid.
        """
        pass

    def predict(self, context, model_input, params=None):
        """
        Handles prediction requests, including inference, file retrieval, and input processing.
        Args:
            context (object): The context object for the prediction request.
            model_input (dict): The input data for the prediction.
            params (dict): Additional parameters for the prediction.
        Returns:
            str: The prediction result in JSON format.
        """

        self.logger.warning(f"Processing {model_input.to_json()}")

        if self.token_expiration is not None and datetime.datetime.now() > self.token_expiration:
            self.logger.warning(f"Token expired, refreshing...")
            self.refresh_token()

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
                            
                    series_dir, out_seg_path = self.model_infer(datastore, model_input["input"][0]['infer']['image'], label_prompt, points, point_labels, file_ext=".nii.gz")
                    to_return = {"file": out_seg_path, 'params' : { 'centroids' : {}}} #ohif 3.8 compatibility
                    span.set_outputs(to_return)
                else:
                    to_return = self.handle_input(model_input['input'][0])
                    span.set_outputs(to_return)
            elif "series_uid" in model_input:
                if "params" in model_input:
                    input_params = model_input["params"][0]
                else:
                    input_params = {}

                series_uid = model_input["series_uid"][0]
                
                label_prompt, points, point_labels, datastore = self.handle_labels(input_params)
                dest_dir, export_overlays, export_metrics, torch_device = self.handle_params(input_params)

                series_dir, out_seg_path = self.model_infer(datastore, series_uid, label_prompt, points, point_labels, torch_device=torch_device, file_ext=".dcm")
                final_path = dest_dir + "/segmentations/" + series_uid + ".dcm"
                
                self.upload_file(out_seg_path, final_path)

                if export_overlays or export_metrics:
                    metrics = calculate_volumes_and_overlays(series_dir, out_seg_path, self.label_dict, output_dir=dest_dir+"/overlays/" + series_uid+ "/", export_overlays=export_overlays, export_metrics=export_metrics)
                else:
                    metrics = None

                to_return =  {"file_path": final_path, "metrics": metrics}

                span.set_outputs(to_return)
            
            else:
                raise Exception("Unknown operation", model_input) 
        
        return json.dumps(to_return)
