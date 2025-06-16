import base64
from typing import Iterator, List, Optional, Tuple

import pandas as pd
from mlflow.utils.databricks_utils import get_databricks_host_creds
from pyspark.ml.pipeline import Transformer
from pyspark.sql.functions import col, pandas_udf

from dbx.pixels.dicom.dicom_utils import dicom_to_image
from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider()


class VLMPhiExtractor:
    """
    Initialize a VLM for PHI extraction, setting the endpoint, system_prompt and model parameters temperature, num_output_tokens
    """

    def __init__(
        self,
        endpoint,
        system_prompt: str = None,
        temperature: float = 0.0,
        num_output_tokens: int = 200,
    ):
        creds = get_databricks_host_creds("databricks")
        self.endpoint = endpoint
        self.temperature = temperature
        self.num_output_tokens = num_output_tokens
        try:
            from openai import OpenAI
            self.client = OpenAI(
                api_key=creds.token,
                base_url=f"{creds.host}/serving-endpoints",
                timeout=300,
                max_retries=3
            )
        except Exception as e:
            logger.error(f"Error initializing OpenAI client: {creds.host} / {endpoint}: {str(e)}")
            raise e


        if system_prompt:
            self.system_prompt = system_prompt
        else:
            self.system_prompt = """You are an expert in privacy and personal health information (PHI). 
Per HIPAA rules there are 18 fields considered PHI. 
Please identify all of the PHI fields found in the image and return a list of pipe-separated named entities, e.g. 'John Smith'|'04-31-1954'|'123 Drury Lane' and nothing else. 
Don't be fooled by text fields especially acronyms that are not PHI. 
If there's no PHI detect, return 'No PHI' and nothing else. 
Answer concisely as requested without explanations."""

    def extract(
        self, path: str, input_type: str = "dicom", max_width: int = 768
    ) -> Tuple[Optional[List[str]], int, int, int, Optional[str]]:
        """
        Do VLM inferencing with one input (image in base64 string) to return a list of named entities and metadata (e.g. total tokens)

        Args:
            path: dicom file path ending with .dcm
            input_type: dicom, image or base64 for .dcm file path, image path or image base64 string respectively
            max_width: max width of image in pixels allowed. Resized to this dimension if max_width>0. Set to 0 to disable resizing

        Returns:
            Tuple containing:
            - List of detected PHI strings (or None if error)
            - Number of completion tokens
            - Number of prompt tokens
            - Total number of tokens
            - Error message (or None if successful)
        """

        try:
            # if dicom path, convert to image then base64 string
            if input_type == "dicom":
                try:
                    image_base64 = dicom_to_image(path, max_width=768, return_type="str")
                except Exception as e:
                    logger.error(f"Error converting dicom to image: {str(e)}")
                    return None, 0, 0, 0, str(e)
            # if image path, convert to base64 string
            elif input_type == "image":
                with open(path, "rb") as image_file:
                    image_binary = image_file.read()
                    base64_str = base64.b64encode(image_binary).decode("utf-8")
                image_base64 = base64_str
            # if base64 str provided, use as is
            elif input_type == "base64":
                image_base64 = path
            else:
                error_msg = f"Invalid input_type: {input_type}. Valid values are: dicom, image, base64 for dicom file path, image path or image base64 string respectively"
                logger.error(error_msg)
                return None, 0, 0, 0, error_msg

            response = self.client.chat.completions.create(
                model=self.endpoint,
                messages=[
                    {
                        "role": "system",
                        "content": self.system_prompt,
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/png;base64,{image_base64}",
                                    "detail": "low",
                                },
                            }
                        ],
                    },
                ],
                temperature=float(self.temperature),
                max_tokens=int(self.num_output_tokens),
            )

            # clean up responses
            content = response.choices[0].message.content
            # multiple PHI
            if "|" in content:
                ans = content.split("|")
            # No PHI
            elif content.strip().lower() == "no phi":
                ans = []
            # single PHI
            else:
                ans = list(content)

            return (
                ans,
                response.usage.completion_tokens,
                response.usage.prompt_tokens,
                response.usage.total_tokens,
                None,
            )

        except Exception as e:
            msg = f"Possible VLM failure: {str(e)}. Check inputs: {path}, {endpoint}, {input_type}, {system_prompt}, {temperature}, {num_output_tokens}"
            logger.error(msg)
            return None, 0, 0, 0, msg


class VLMTransformer(Transformer):
    """
    Transformer class to detect PHI in DICOM image using VLM

    Args:
        endpoint: model endpoint name for VLM
        system_prompt: override default system prompt with custom prompt if any
        temperature: temperature for VLM
        num_output_tokens: number of output tokens for VLM
        inputCol: input column name (default to path)
        outputCol: output column name (default to response)
        input_type: dicom, image or base64 for .dcm file path, image path or image base64 string respectively
        max_width: max width of image in pixels allowed. Resized to this dimension if max_width>0. Set to 0 to disable resizing
    """

    def __init__(
        self,
        endpoint,
        system_prompt: str = None,
        temperature: float = 0.0,
        num_output_tokens: int = 200,
        inputCol: str = "path",
        outputCol: str = "response",
        input_type: str = "dicom",
        max_width: int = 768,
    ):
        self.inputCol = inputCol
        self.outputCol = outputCol
        self.endpoint = endpoint
        self.system_prompt = system_prompt
        self.temperature = temperature
        self.num_output_tokens = num_output_tokens
        self.input_type = input_type
        self.max_width = max_width

    def _transform(self, df):
        """
        Pandas UDF wrapper around VLMPhiExtractor.extract to apply on pyspark DF
        """

        @pandas_udf(
            "content array<string>, completion_tokens int, prompt_tokens int, total_tokens int, error string"
        )
        def extract_udf(paths: Iterator[pd.Series]) -> Iterator[pd.DataFrame]:
            extractor = VLMPhiExtractor(
                self.endpoint,
                self.system_prompt,
                self.temperature,
                self.num_output_tokens,
            )
            for batch in paths:
                # Process each image in the batch
                results = []
                for path in batch:
                    try:
                        response = extractor.extract(
                            path, input_type=self.input_type, max_width=self.max_width
                        )
                    except Exception as e:
                        response = (None, 0, 0, 0, str(e))
                    results.append(response)
                yield pd.DataFrame(results)

        return df.withColumn(self.outputCol, extract_udf(col(self.inputCol)))
