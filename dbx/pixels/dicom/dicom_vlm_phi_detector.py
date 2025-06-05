import pandas as pd
from pyspark.sql.functions import pandas_udf, col
from pyspark.ml.pipeline import Transformer
from typing import List, Tuple, Iterator

from openai import OpenAI
from mlflow.utils.databricks_utils import get_databricks_host_creds


SYSTEM_PROMPT = "You are an expert in privacy and personal health information (PHI). Per HIPAA rules there are 18 fields considered PHI. Please identify all of the PHI fields found in the image and return a list of pipe-separated named entities, e.g. 'John Smith'|'04-31-1954'|'123 Drury Lane' and nothing else. Don't be fooled by text fields especially acronyms that are not PHI. If there's no PHI detect, return 'No PHI' and nothing else. Answer concisely as requested without explanations."


class VLMPhiExtractor:
    """
    Initialize a VLM for PHI extraction, setting the endpoint, system_prompt and model parameters temperature, num_output_tokens
    """
    def __init__(
        self, endpoint, system_prompt,
        temperature:float = 0.0, num_output_tokens:int = 200
    ):
        creds = get_databricks_host_creds("databricks")
        self.endpoint = endpoint
        self.system_prompt = system_prompt
        self.temperature = temperature
        self.num_output_tokens = num_output_tokens
        self.client = OpenAI(
            api_key=creds.token,
            base_url=f"{creds.host}/serving-endpoints",
            timeout=300,
            max_retries=3,
        )
        
    def extract(self, image_base64:str) -> Tuple[List[str], int, int, int, str]:
        """
        Do VLM inferencing with one input (image in base64 string) to return a list of named entities and metadata (e.g. total tokens)
        """
        try:
            response = self.client.chat.completions.create(
                model=self.endpoint,
                messages=[
                {
                    "role": "system",
                    "content": self.system_prompt  # Added self.
                },
                {
                    "role": "user", 
                    "content": [
                      {
                          "type": "image_url",
                          "image_url": { "url": f"data:image/png;base64,{image_base64}", "detail": "low"} 
                      }
                    ]
                }
                ],
                temperature=float(self.temperature),  # Added self.
                max_tokens=int(self.num_output_tokens),  # Added self.
            )

            # clean up responses
            content = response.choices[0].message.content
            # multiple PHI
            if "|" in content:
                ans = content.split("|")
            # No PHI
            elif content.strip().lower()=="no phi":
                ans = []
            # single PHI
            else:
                ans = list(content)

            return (
                ans,
                response.usage.completion_tokens,
                response.usage.prompt_tokens,
                response.usage.total_tokens,
                None
            )

        except Exception as e:
            return None, 0, 0, 0, str(e)
        


class VLMTransformer(Transformer):
    """
    Transformer class to detect PHI in DICOM image using VLM
    """
    def __init__(self, endpoint, system_prompt, 
                 temperature:float = 0.0, num_output_tokens:int = 200,
                 inputCol:str = "img_base64", outputCol:str = "response"):
        self.inputCol = inputCol
        self.outputCol = outputCol
        self.endpoint = endpoint
        self.system_prompt = system_prompt
        self.temperature = temperature
        self.num_output_tokens = num_output_tokens

    def _transform(self, df):
        """
        Pandas UDF wrapper around VLMPhiExtractor.extract to apply on pyspark DF
        """
        @pandas_udf(
            "content array<string>, completion_tokens int, prompt_tokens int, total_tokens int, error string"
        )
        def extract_udf(imgs_base64: Iterator[pd.Series]) -> Iterator[pd.DataFrame]:
            extractor = VLMPhiExtractor(self.endpoint, self.system_prompt, self.temperature, self.num_output_tokens)
            for batch in imgs_base64:
                # Process each image in the batch
                results = []
                for img_base64 in batch:
                    try:
                        response = extractor.extract(img_base64)
                    except Exception as e:
                        response = (None, 0, 0, 0, str(e))
                    results.append(response)
                yield pd.DataFrame(results)
        return df.withColumn(self.outputCol, extract_udf(col(self.inputCol)))
    
