"""WSIVLMPhiDetector — Spark ML Transformer for pixel-level PHI detection in WSI files.

Fully self-contained: no dependency on ``dbx.pixels.dicom`` or ``pydicom``.
Uses OpenSlide (via ``wsi_to_image()``) as the primary backend for all WSI formats.

Supported formats (via OpenSlide):
- Aperio SVS
- Hamamatsu NDPI / VMS / VMU
- Leica SCN
- MIRAX MRXS
- Philips TIFF
- Sakura SVSLIDE
- Trestle TIF
- Ventana BIF / TIF
- Generic TIFF

Architecture:
- Extends ``pyspark.ml.base.Transformer``
- Applies ``wsi_to_image()`` to extract the label/macro/tissue sub-image as a
  JPEG thumbnail (uses OpenSlide's pyramid — never loads full-res data), then
  calls a Databricks VLM serving endpoint via the OpenAI-compatible API.
- Output column schema mirrors ``VLMPhiDetector`` from the DICOM module
  (content array<string>, completion_tokens int, prompt_tokens int,
  total_tokens int, error string).
"""

from __future__ import annotations

import base64
from dataclasses import dataclass
from typing import Iterator, List, Optional

import pandas as pd
from pyspark.ml.base import Transformer
from pyspark.sql.functions import col, pandas_udf

from dbx.pixels.logging import LoggerProvider

logger = LoggerProvider()

__all__ = ["WSIVLMPhiDetector", "VlmResult"]


DEFAULT_SYSTEM_PROMPT = (
    "You are an expert in privacy and personal health information (PHI). "
    "Per HIPAA rules there are 18 fields considered PHI. "
    "Please identify all of the PHI fields found in the image and return a "
    "list of pipe-separated named entities, e.g. 'John Smith'|'04-31-1954'|'123 Drury Lane' "
    "and nothing else. "
    "Don't be fooled by text fields especially acronyms that are not PHI. "
    "If there's no PHI detected, return 'No PHI' and nothing else. "
    "Answer concisely as requested without explanations."
)


@dataclass
class VlmResult:
    """Per-image result returned by the VLM PHI detector."""

    content: Optional[List[str]]
    completion_tokens: int
    prompt_tokens: int
    total_tokens: int
    error: Optional[str]


# ---------------------------------------------------------------------------
# Module-level UDF factory
# ---------------------------------------------------------------------------
# Defined outside the class so Spark Connect can serialise the closure
# without capturing ``self``.  Only primitive types are closed over.


def _make_wsi_phi_detector_udf(
    endpoint: str,
    system_prompt: str,
    temperature: float,
    num_output_tokens: int,
    input_type: str,
    max_width: int,
    series: str,
):
    """Return a ``pandas_udf`` configured with the given inference parameters.

    Uses ``wsi_to_image()`` (OpenSlide primary, tifffile fallback) for image
    extraction from any WSI format.
    """

    @pandas_udf(
        "content array<string>, completion_tokens int, "
        "prompt_tokens int, total_tokens int, error string"
    )
    def _extract_udf(paths: Iterator[pd.Series]) -> Iterator[pd.DataFrame]:
        from dataclasses import replace as dc_replace

        from mlflow.utils.databricks_utils import get_databricks_host_creds
        from openai import OpenAI

        from dbx.pixels.wsi.wsi_utils import wsi_to_image

        creds = get_databricks_host_creds("databricks")
        client = OpenAI(
            api_key=creds.token,
            base_url=f"{creds.host}/serving-endpoints",
            timeout=300,
            max_retries=3,
        )
        _null = VlmResult(None, 0, 0, 0, None)

        for batch in paths:
            results = []
            for path in batch:
                try:
                    # --- 1. Get image as base64 JPEG ---
                    if input_type == "wsi":
                        # OpenSlide-backed: handles SVS, NDPI, MRXS, SCN, BIF,
                        # Philips TIFF, generic TIFF, etc.
                        b64 = wsi_to_image(
                            path,
                            max_width=max_width,
                            return_type="str",
                            series=series,
                        )
                        if b64 is None:
                            results.append(
                                dc_replace(
                                    _null,
                                    error=f"wsi_to_image returned None: {path}",
                                )
                            )
                            continue
                    elif input_type == "image":
                        # Raw image file (JPEG/PNG) — read and base64-encode
                        local = path[5:] if path.startswith("dbfs:") else path
                        with open(local, "rb") as fh:
                            b64 = base64.b64encode(fh.read()).decode("utf-8")
                    else:  # "base64" — already encoded
                        b64 = path

                    # --- 2. VLM inference ---
                    response = client.chat.completions.create(
                        model=endpoint,
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {
                                "role": "user",
                                "content": [
                                    {
                                        "type": "image_url",
                                        "image_url": {
                                            "url": f"data:image/jpeg;base64,{b64}",
                                            "detail": "low",
                                        },
                                    }
                                ],
                            },
                        ],
                        temperature=float(temperature),
                        max_tokens=int(num_output_tokens),
                    )

                    # --- 3. Parse response ---
                    content = response.choices[0].message.content
                    if "|" in content:
                        phi_list = content.split("|")
                    elif content.strip().lower() == "no phi":
                        phi_list = []
                    else:
                        phi_list = [content]

                    results.append(
                        VlmResult(
                            phi_list,
                            response.usage.completion_tokens,
                            response.usage.prompt_tokens,
                            response.usage.total_tokens,
                            None,
                        )
                    )

                except Exception as exc:
                    logger.error(f"Error processing {path}: {exc}")
                    results.append(dc_replace(_null, error=str(exc)))

            yield pd.DataFrame(results)

    return _extract_udf


# ---------------------------------------------------------------------------
# Transformer
# ---------------------------------------------------------------------------


class WSIVLMPhiDetector(Transformer):
    """Detect pixel-level PHI in Whole Slide Images using a Databricks VLM endpoint.

    Supports all OpenSlide-recognized formats (SVS, NDPI, MRXS, SCN, BIF,
    Philips TIFF, generic TIFF, etc.) via ``wsi_to_image()`` which uses
    OpenSlide as primary backend with tifffile fallback.

    No dependency on ``dbx.pixels.dicom`` or ``pydicom`` — fully self-contained.

    Args:
        endpoint:          Databricks serving endpoint name for the VLM.
        system_prompt:     Override the default HIPAA PHI detection prompt.
        temperature:       VLM sampling temperature (default 0.0).
        num_output_tokens: Maximum tokens in the VLM response (default 200).
        inputCol:          Input column name (default ``local_path``).
        outputCol:         Output column name (default ``response``).
        input_type:        ``"wsi"``    — path to any WSI file (default).
                           ``"image"``  — path to a JPEG/PNG file.
                           ``"base64"`` — already base64-encoded image string.
        max_width:         Resize thumbnail width before VLM (default 768).
                           Set to 0 to disable.
        series:            Sub-image to extract from WSI files (default ``"label"``):
                           ``"label"``     — label associated image (rendered PHI text; recommended).
                           ``"macro"``     — macro/overview associated image.
                           ``"thumbnail"`` — built-in thumbnail if available.
                           ``"tissue"``    — smallest tissue pyramid level.
                           Falls back to tissue if the requested sub-image is absent.
    """

    def __init__(
        self,
        endpoint: str,
        system_prompt: str = None,
        temperature: float = 0.0,
        num_output_tokens: int = 200,
        inputCol: str = "local_path",
        outputCol: str = "response",
        input_type: str = "wsi",
        max_width: int = 768,
        series: str = "label",
    ):
        super().__init__()
        self.endpoint = endpoint
        self.system_prompt = system_prompt
        self.temperature = temperature
        self.num_output_tokens = num_output_tokens
        self.inputCol = inputCol
        self.outputCol = outputCol
        self.input_type = input_type
        self.max_width = max_width
        self.series = series

    def _transform(self, df):
        """Apply VLM PHI detection via ``pandas_udf``."""
        _udf = _make_wsi_phi_detector_udf(
            endpoint=self.endpoint,
            system_prompt=self.system_prompt or DEFAULT_SYSTEM_PROMPT,
            temperature=self.temperature,
            num_output_tokens=self.num_output_tokens,
            input_type=self.input_type,
            max_width=self.max_width,
            series=self.series,
        )
        return df.withColumn(self.outputCol, _udf(col(self.inputCol)))
