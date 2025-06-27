from dbx.pixels.dicom.dicom_vlm_phi_detector import VLMPhiDetector
from dbx.pixels.dicom.dicom_easyocr_redactor import OcrRedactor, FilterTransformer
from pyspark.ml import Pipeline


class DicomPhiPipeline(Pipeline):
    """
    A pipeline for detecting and redacting PHI in DICOM files.

    Args:
        endpoint: name of the Databricks serving endpoint for the VLM model for detecting PHI.
        output_dir: output directory where the redacted files will be saved (as .dcm files).
        redact_even_if_undetected: whether to redact more text even if PHI is not detected. Default is False.
        inputCol: input column name (default to path)
        outputCol: output column name (default to path_redacted)
        input_type: dicom, image or base64 for .dcm file path, image path or image base64 string respectively
        system_prompt: override default system prompt with custom prompt if any
        temperature: temperature of the VLM detector.
        num_output_tokens: number of output tokens for the VLM model
        max_width: max width of image in pixels allowed. Resized to this dimension if max_width>0. Set to 0 to disable resizing
    """

    def __init__(
        self,
        endpoint: str,
        output_dir: str,
        redact_even_if_undetected: bool = False,
        inputCol: str = "path",
        outputCol: str = "path_redacted",
        input_type: str = "dicom",
        system_prompt: str = None,
        temperature: float = 0.0,
        num_output_tokens: int = 200,
        max_width: int = 768,
    ):
        super().__init__()
        self.redact_even_if_undetected = redact_even_if_undetected

        self.detector = VLMPhiDetector(
            endpoint=endpoint,
            inputCol=inputCol,
            input_type=input_type,
            system_prompt=system_prompt,
            temperature=temperature,
            num_output_tokens=num_output_tokens,
            outputCol=outputCol,
            max_width=max_width,
        )

        if self.redact_even_if_undetected:
            # Add a postdetector filter to nullify the rows without PHI detected by vlm_detector
            # Update the redactor to use the filtered column as input instead of the original path
            self.filterTransformer = FilterTransformer(
                inputCol=inputCol, outputCol="filtered"
            )
            self.redactor = OcrRedactor(
                inputCol="filtered",
                outputCol=outputCol,
                output_dir=output_dir,
            )
            self.stages = [self.detector, self.filterTransformer, self.redactor]
        else:
            self.filterTransformer = None
            self.redactor = OcrRedactor(
                inputCol=inputCol,
                outputCol=outputCol,
                output_dir=output_dir,
            )
            self.stages = [self.detector, self.redactor]

    def create_pipeline(self):
        """
        Create a pipeline with the detector, filter transformer (optional), and redactor.
        If redact_even_if_undetected is False (default), then add the filter transformer.
        If redact_even_if_undetected is True, then remove the filter transformer.
        The latter may risk overredacting even non-PHI text.
        """
        return self.Pipeline(stages=self.stages)
