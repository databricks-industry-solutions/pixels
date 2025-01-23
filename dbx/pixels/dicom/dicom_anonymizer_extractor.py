import pyspark.sql.types as t
from pyspark.ml.pipeline import Transformer
from pyspark.sql.functions import col, lit, udf, replace
import hashlib
import os

from dbx.pixels.dicom.dicom_utils import cloud_open, extract_metadata, anonymize_metadata

class DicomAnonymizerExtractor(Transformer):
    
    """
    Transformer class to transform paths to Dicom files to Dicom metadata in JSON format.
    
    This class provides functionality to extract metadata from Dicom files, anonymize the metadata based on specified modes, 
    and optionally save the anonymized Dicom files. The metadata extraction excludes pixel data for performance optimization.

    Parameters:
    - catalog: The catalog object containing configuration and utility methods.
    - inputCol: The input column name containing the local paths to Dicom files.
    - outputCol: The output column name where the extracted metadata in JSON format will be stored.
    - basePath: The base path for accessing Dicom files.
    - anonym_mode: The mode of anonymization to apply. Options are "COMPLETE", "METADATA", "IMAGE", "NONE".
    - fp_key: A format-preserving key used for encryption during the anonymization process.
    - tweak: A tweak string used for encryption during the anonymization process.
    - encrypt_tags: A tuple of Dicom tags to be encrypted during anonymization.
    - keep_tags: A tuple of Dicom tags to be retained during anonymization.
    - anonymization_base_path: The base path where anonymized Dicom files will be saved.
    - save_anonymized_dicom: Boolean flag to save anonymized Dicom files.

    Methods:
    - check_input_type: Validates the input schema to ensure the input column is of StringType.
    - _transform: Transforms the input DataFrame by extracting and optionally anonymizing Dicom metadata.
    """
    ANONYMIZATION_MODES = ["COMPLETE", "METADATA", "IMAGE"]

    def __init__(
        self, catalog, inputCol="local_path", outputCol="meta", basePath="dbfs:/", 
        anonym_mode:str=None, fp_key:str=None, tweak:str="CBD09280979564",
        encrypt_tags:tuple=("StudyInstanceUID", "SeriesInstanceUID", "SOPInstanceUID", "AccessionNumber", "PatientID"),
        keep_tags:tuple=("StudyDate","StudyTime","SeriesDate"),
        anonymization_base_path:str=None,
        save_anonymized_dicom:bool=True
    ):
        self.inputCol = inputCol  
        self.outputCol = outputCol  
        self.basePath = basePath
        self.catalog = catalog

        self.anonym_mode = anonym_mode
        self.fp_key = fp_key
        self.tweak = tweak
        self.encrypt_tags = encrypt_tags
        self.keep_tags = keep_tags

        if anonym_mode not in self.ANONYMIZATION_MODES:
            raise Exception(f"Invalid anonymization mode {anonym_mode}, must be one of {self.ANONYMIZATION_MODES}")

        if anonymization_base_path is not None:
            self.anonymization_base_path = anonymization_base_path
        else:
            self.anonymization_base_path = catalog._anonymization_base_path

        self.save_anonymized_dicom = save_anonymized_dicom

    def check_input_type(self, schema):
        field = schema[self.inputCol]
        # assert that field is a datetype
        if field.dataType != t.StringType():
            raise Exception(
                f"DicomMetaExtractor field {self.inputCol}, input type {field.dataType} did not match input type StringType"
            )

        field = schema["extension"]  # file extension
        # assert that field is a datetype
        if field.dataType != t.StringType():
            raise Exception(
                f"DicomMetaExtractor field {field.name}, input type {field.dataType} did not match input type StringType"
            )

    def _transform(self, df):
        """
        Perform Dicom to metadata transformation.
        Input:
          col('extension')
          col('is_anon')
        Output:
          col(self.outputCol) # Dicom metadata header in JSON format
        """

        fp_key = self.fp_key
        tweak = self.tweak
        encrypt_tags = self.encrypt_tags
        keep_tags = self.keep_tags
        anonym_mode = self.anonym_mode
        save_anonymized_dicom = self.save_anonymized_dicom
        anonymization_base_path = self.anonymization_base_path

        @udf(returnType=t.MapType(t.StringType(), t.StringType()))
        def dicom_meta_anonym_udf(path: str, anon: bool = False) -> dict:
            """Extract metadata from header of dicom image file
            params:
            path -- local path like /dbfs/mnt/... or s3://<bucket>/path/to/object.dcm
            anon -- Set to True if accessing S3 and the bucket is public
            """
            from pydicom import dcmread
            import json

            try:
                fp, fsize = cloud_open(path, anon)
                with dcmread(fp, defer_size=1000, stop_before_pixels=False) as dataset:
                    match anonym_mode:
                        case "COMPLETE":
                            anonymize_metadata(dataset, fp_key=fp_key, tweak=tweak, encrypt_tags=encrypt_tags, keep_tags=keep_tags)
                            #APPLY IMAGE READACTION
                            #dataset.PixelData = anonymize_image(dataset.PixelData, ...)
                        case "METADATA":
                            anonymize_metadata(dataset, fp_key=fp_key, tweak=tweak, encrypt_tags=encrypt_tags, keep_tags=keep_tags)
                        case "IMAGE":
                            #APPLY IMAGE READACTION
                            #dataset.PixelData = anonymize_image(dataset.PixelData, ...)
                            print("Not implemented yet")

                    if anonym_mode is not None and save_anonymized_dicom:
                        anonymized_path = f"{anonymization_base_path}{dataset['StudyInstanceUID'].value}/{dataset['SeriesInstanceUID'].value}"
                        anonymized_file_path = f"{anonymized_path}/{dataset['SOPInstanceUID'].value}.dcm"

                        if not os.path.exists(anonymized_path):
                            os.makedirs(anonymized_path)

                        dataset.save_as(anonymized_file_path)
                        
                    meta_js = extract_metadata(dataset, deep=False)
                    meta_js["hash"] = hashlib.sha1(fp.read()).hexdigest()
                    meta_js["file_size"] = fsize
                    return {"meta":json.dumps(meta_js), "path": "dbfs:"+anonymized_file_path}
            except Exception as err:
                except_str = {"meta":{"udf": "dicom_meta_anonym_udf", "error": str(err), "args": str(err.args), "path": path}, "path": "dbfs:"+path}
                return except_str

        self.check_input_type(df.schema)
        return (df
                .withColumn("is_anon", lit(self.catalog.is_anon()))
                .withColumn("anonym_res", dicom_meta_anonym_udf(col(self.inputCol), col("is_anon")))
                .withColumn("path", col("anonym_res.path"))
                .withColumn("local_path", replace(col("path"), lit("dbfs:"),lit("")))
                .withColumn("relative_path", replace(col("local_path"), lit("/Volumes/"),lit("Volumes/")))
                .withColumn("meta", col("anonym_res.meta"))
                .drop("anonym_res")
        )
