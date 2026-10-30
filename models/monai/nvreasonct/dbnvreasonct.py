import mlflow
import os
import json
import logging
import tempfile
import time

logger = logging.getLogger(__name__)


class DBNVReasonCTModel(mlflow.pyfunc.PythonModel):
    """
    NVIDIA NV-Reason-CT (3D CT vision-language model) served on a Databricks GPU
    model-serving endpoint, Pixels-compatible.

    Mirrors the DBVISTA3DModel serving contract: a request references a DICOM
    series by ``series_uid``; the model pulls the series through the Pixels
    DICOMweb datastore (object_catalog + SQL warehouse — the same serving-safe
    path Vista3D uses, no POSIX Volume access), converts it to a NIfTI volume in
    Hounsfield units, and runs the VLM to produce a radiology report / answer.

    Request shapes (served as a pandas DataFrame, matching DBVISTA3DModel):
      {"series_uid": "<uid>", "study_uid": "<uid>",   # study_uid optional, skips a lookup
       "params": {"prompt": "...", "anatomy_region": "chest", "max_new_tokens": 1024}}
      {"series_uid": "<uid>"}                      # defaults: generic report, chest
      {"input": {"action": "info"}}                # model info, no GPU work

    Response: JSON string {"series_uid", "anatomy_region", "prompt", "report", "slices",
    "timings"}; timings splits the request into fetch_s (DICOM download), convert_s (NIfTI),
    inference_s (model) and total_s.
    """

    DEFAULT_PROMPT = (
        "You are an expert radiologist. Review this CT volume systematically and "
        "provide a concise, structured findings report."
    )
    MODEL_ID = "nvidia/NV-Reason-CT"

    def load_context(self, context=None):
        self.logger = logging.getLogger(__name__)
        self.model = None
        self.processor = None

        artifacts = getattr(context, "artifacts", None) or {}
        self.model_path = artifacts.get("nv_reason_ct") or os.environ.get(
            "NV_REASON_CT_MODEL", self.MODEL_ID
        )

        # Load eagerly only where a GPU exists (the serving container). MLflow can
        # call load_context at log time on a CPU-only, torch-less environment; the
        # model is then loaded lazily on the first predict instead.
        try:
            import torch

            if torch.cuda.is_available():
                self._ensure_loaded()
        except ImportError:
            self.logger.warning("NV-Reason-CT - torch unavailable, deferring model load")

    def _ensure_loaded(self):
        if self.model is not None:
            return
        import torch
        from transformers import AutoModelForImageTextToText, AutoProcessor

        self.logger.warning(f"NV-Reason-CT - loading model from {self.model_path}")
        self.model = (
            AutoModelForImageTextToText.from_pretrained(
                self.model_path,
                trust_remote_code=True,
                dtype=torch.bfloat16,
                attn_implementation="sdpa",
            )
            .eval()
            .to("cuda")
        )
        self.processor = AutoProcessor.from_pretrained(self.model_path, trust_remote_code=True)
        self.logger.warning("NV-Reason-CT - model loaded")

    def _datastore(self, table=None):
        from common.utils import init_dicomweb_datastore

        return init_dicomweb_datastore(
            os.environ["DATABRICKS_HOST"],
            os.environ["DATABRICKS_TOKEN"],
            os.environ["DATABRICKS_WAREHOUSE_ID"],
            table or os.environ["DATABRICKS_PIXELS_TABLE"],
        )

    def _series_to_nifti_hu(self, datastore, series_uid, study_uid=None):
        """
        Fetch a DICOM series via the Pixels datastore and write it as a NIfTI
        volume. ``init_dicomweb_datastore`` uses convert_to_nifti=False, so
        get_image_uri returns the series *directory*; GDCM applies the DICOM rescale
        slope/intercept, so voxel values are Hounsfield units as the model expects.
        """
        import SimpleITK as sitk
        from common.utils import prefetch_series

        t0 = time.time()
        prefetch_series(datastore, series_uid, study_uid)  # no-op without study_uid
        # get_image_uri downloads the series into the datastore cache and returns
        # its directory (as DBVISTA3DModel does). Don't use common.utils.series_to_nifti:
        # it calls get_image(), which reads that directory as bytes and fails.
        series_path = datastore.get_image_uri(series_uid)
        fetch_s = time.time() - t0
        if str(series_path).endswith((".nii", ".nii.gz")):
            return series_path, None, fetch_s, 0.0

        reader = sitk.ImageSeriesReader()
        files = reader.GetGDCMSeriesFileNames(series_path, series_uid)
        if not files:
            files = reader.GetGDCMSeriesFileNames(series_path)
        if not files:
            raise Exception(f"No DICOM slices found for series {series_uid} in {series_path}")
        # Scouts/topograms and dose sheets are single images, not 3D volumes. Reject
        # them with a stable prefix so callers (e.g. the viewer's VLM route) can
        # detect it and fall back to a 2D model.
        min_slices = int(os.environ.get("NVREASONCT_MIN_SLICES", "16"))
        if len(files) < min_slices:
            raise ValueError(
                f"INSUFFICIENT_SLICES: series {series_uid} has {len(files)} slice(s); "
                f"NV-Reason-CT needs a 3D CT volume (>= {min_slices} slices)"
            )
        t1 = time.time()
        reader.SetFileNames(files)
        image = sitk.Cast(reader.Execute(), sitk.sitkInt16)

        out = os.path.join(tempfile.mkdtemp(prefix="nvct_"), f"{series_uid}.nii.gz")
        sitk.WriteImage(image, out)
        self.logger.warning(
            f"NV-Reason-CT - {series_uid}: {len(files)} slices -> {out} size={image.GetSize()}"
        )
        return out, len(files), fetch_s, time.time() - t1

    def _infer(self, nifti_path, prompt, anatomy_region, max_new_tokens):
        import torch

        messages = [
            {"role": "user", "content": [{"type": "image"}, {"type": "text", "text": prompt}]}
        ]
        text = self.processor.apply_chat_template(
            messages, add_generation_prompt=True, tokenize=False
        )
        inputs = self.processor(
            text=text,
            images3d=[nifti_path],
            anatomy_region=anatomy_region,
            return_tensors="pt",
        ).to(self.model.device)
        with torch.no_grad():
            out = self.model.generate(
                **inputs, max_new_tokens=max_new_tokens, do_sample=False, use_cache=True
            )
        return self.processor.batch_decode(
            out[:, inputs.input_ids.shape[1]:], skip_special_tokens=True
        )[0]

    def predict(self, context, model_input, params=None):
        # Served input arrives as a pandas DataFrame (same as DBVISTA3DModel).
        if "input" in model_input:
            request = model_input["input"][0]
            if isinstance(request, dict) and request.get("action") == "info":
                return json.dumps(
                    {
                        "name": "NV-Reason-CT",
                        "model": self.model_path,
                        "task": "3D CT radiology report / QA / multi-step reasoning",
                        "input": "series_uid -> NIfTI (chest/abdomen CT, HU) + text prompt",
                        "output": "text",
                    }
                )
            raise Exception("Unhandled input action", request)

        if "series_uid" not in model_input:
            raise Exception("Request must include 'series_uid' or 'input'")

        series_uid = model_input["series_uid"][0]
        p = model_input["params"][0] if "params" in model_input else None
        if not isinstance(p, dict):  # absent / None / NaN from schema enforcement
            p = {}

        prompt = p.get("prompt") or self.DEFAULT_PROMPT
        anatomy_region = p.get("anatomy_region") or "chest"
        max_new_tokens = int(p.get("max_new_tokens") or 1024)
        study_uid = model_input["study_uid"][0] if "study_uid" in model_input else p.get("study_uid")
        study_uid = study_uid if isinstance(study_uid, str) and study_uid else None

        t0 = time.time()
        self._ensure_loaded()
        nifti_path, slices, fetch_s, convert_s = self._series_to_nifti_hu(
            self._datastore(p.get("pixels_table")), series_uid, study_uid
        )
        t_infer = time.time()
        report = self._infer(nifti_path, prompt, anatomy_region, max_new_tokens)
        inference_s = time.time() - t_infer

        return json.dumps(
            {
                "series_uid": series_uid,
                "anatomy_region": anatomy_region,
                "prompt": prompt,
                "report": report,
                "slices": slices,
                "timings": {
                    "fetch_s": round(fetch_s, 2),
                    "convert_s": round(convert_s, 2),
                    "inference_s": round(inference_s, 2),
                    "total_s": round(time.time() - t0, 2),
                },
            }
        )
