import os

from mlflow.deployments import get_deploy_client


class MONAILabelClient:
    def __init__(self, endpoint_name, max_retries=3, request_timeout_sec=300):
        os.environ["MLFLOW_HTTP_REQUEST_MAX_RETRIES"] = str(max_retries)
        os.environ["MLFLOW_HTTP_REQUEST_TIMEOUT"] = str(request_timeout_sec)
        os.environ["MLFLOW_DEPLOYMENT_PREDICT_TIMEOUT"] = str(request_timeout_sec)

        self.client = get_deploy_client("databricks")
        self.endpoint = endpoint_name
        self.max_retries = max_retries

    def predict(self, series_uid, iteration=0, prev_error=None):
        if iteration > self.max_retries:
            return ("", str(prev_error))

        try:
            response = self.client.predict(
                endpoint=self.endpoint,
                inputs={"dataframe_split": {"columns": ["series_uid"], "data": [[series_uid]]}},
            )
            return (response.predictions[0]["0"], "")
        except Exception as e:
            if "torch.OutOfMemoryError: CUDA out of memory" in str(e):
                return ("", str(e))
            return self.predict(series_uid, iteration + 1, prev_error=str(e))
