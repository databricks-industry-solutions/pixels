from typing import Iterator

import pandas as pd
from pyspark.ml.pipeline import Transformer
from pyspark.sql.functions import col, pandas_udf

class PresidioTransformer(Transformer):
    """
    Transformer class to detect PII / PHI burned into DICOM pixel data
    """

    def __init__(self, inputCol="path", outputCol="pii_analysis", padding_width = 25, use_metadata=True):
        self.inputCol = inputCol
        self.outputCol = outputCol
        self.padding_width = padding_width
        self.use_metadata = use_metadata

    def safe_slice(self, arr, index, property):
        return arr[index][property] if (0 <= index < len(arr) and arr[index].get(property) is not None) else None

    def _transform(self, df):
        from presidio_image_redactor import DicomImagePiiVerifyEngine

        @pandas_udf("array<struct<label string, is_PII boolean, conf float, analyzer_entity_type string, analyzer_score float, analyzer_is_PII boolean, left int, top int, width int, height int>>")
        def presidio_verify_udf(paths: pd.Series) -> pd.Series:
            from presidio_analyzer import AnalyzerEngine
            import pytesseract
            from pydicom import dcmread
            import logging
            logger = logging.getLogger('dbx.pixels')

            # Initialize Presidio engine
            analyzer = DicomImagePiiVerifyEngine()

            # Analyze text for PII entities
            def detect_phi(dcm_path:str):
                logger.info(f"Path: {dcm_path}")
                instance = dcmread(dcm_path.replace("dbfs:",""))
                # Get OCR and NER results
                verification_image, ocr_results, analyzer_results = analyzer.verify_dicom_instance(instance, self.padding_width, use_metadata=self.use_metadata)

                #logger.debug(f"ocr_results: {ocr_results}, analyzer_results: {analyzer_results}")
                results = []
                for i,r in enumerate(ocr_results):
                    results.append({
                                    "label": r['label'],
                                    "is_PII": bool(r.get('is_PII', False)),
                                    "conf": float(r['conf']),
                                    "analyzer_entity_type": self.safe_slice(analyzer_results,i, 'entity_type'),
                                    "analyzer_score": self.safe_slice(analyzer_results,i, 'score'),
                                    "analyzer_is_PII": bool(self.safe_slice(analyzer_results,i, 'is_PII')),
                                    "left": int(r['left']),
                                    "top": int(r['top']),
                                    "width": int(r['width']),
                                    "height": int(r['height'])
                    })
                return results
            return paths.apply(detect_phi)

        return df.withColumn(self.outputCol, presidio_verify_udf(col(self.inputCol)))