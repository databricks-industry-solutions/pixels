import pyspark.sql.types as t
from pyspark.ml.pipeline import Transformer
from pyspark.sql.functions import col, lit, udf

from ff3 import FF3Cipher


class DicomMetaAnonymizer(Transformer):
    """
    Transformer class to anonymize metadata of DICOM files.

    This class uses the FF3 encryption algorithm to anonymize specific DICOM metadata fields.
    It retains certain fields as specified in the keep_list and encrypts fields listed in the encryption_list.
    All the other critical fieldsd are randomized.
    The anonymized DICOM files are saved to a specified destination path.

    Attributes:
        catalog: Pixels Catalog Object.
        fp_key (str): Key for encryption.
        dest_path (str): Destination path to save the anonymized DICOM files.
        input_col (str): Column name for the input file paths.
        output_col (str): Column name for the output file paths.
        tweak (str): Tweak for encryption.
        encryption_list (list): List of DICOM fields to be encrypted.
        keep_list (list): List of DICOM fields to be retained without encryption.
    """

    def __init__(self, catalog, fp_key:str, dest_path:str, input_col="local_path", output_col="local_path", tweak:str="CBD09280979564",
                 encryption_list:list=["StudyInstanceUID", "SeriesInstanceUID", "SOPInstanceUID", "AccessionNumber", "PatientID"],
                 keep_list:list=["StudyDate","StudyTime","SeriesDate"]):
        
        self.catalog = catalog
        self.input_col = input_col
        self.output_col = output_col

        if dest_path is None:
            self.dest_path = f"{catalog._volume_path}/anonymized/"

        self.fp_key = fp_key
        self.tweak = tweak
        self.encryption_list = encryption_list
        self.keep_list = keep_list

    def check_input_type(self, schema):
        field = schema[self.input_col]
        
        if field.dataType != t.StringType():
            raise Exception(
                f"DicomMetaAnonymizer field {self.input_col}, input type {field.dataType} did not match input type StringType"
            )

    def _transform(self, df):

        @udf()
        def anonymize_dicom_file(path: str, dest_path:str, fp_key:str, tweak:str) -> str:
            """
            UDF to anonymize a DICOM file.
            Args:
                path (str): Path to the DICOM file.
                dest_path (str): Destination path to save the anonymized DICOM file.
                fp_key (str): Key for encryption.
                tweak (str): Tweak for encryption.
            Returns:
                str: Path to the anonymized DICOM file.
            """
            import dicognito.anonymizer
            from pydicom import Dataset, dcmread
            import os
            import copy

            c = FF3Cipher(fp_key, tweak)
            anonymizer = dicognito.anonymizer.Anonymizer()

            ds = dcmread(path)

            keep_values = [copy.deepcopy(ds[element]) for element in self.keep_list if element in ds]

            encrypted_values = []

            for element in self.encryption_list:
                if element in ds:
                    if("UID" in element):
                        c.alphabet = "0123456789"
                        ds[element].value = ".".join([c.encrypt(element) if len(element) > 5 else element for element in ds[element].value.split(".")])
                    else:
                        c.alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,^"
                        ds[element].value = c.encrypt(ds[element].value) if len(ds[element].value) > 5 else ""
                
                encrypted_values.append(copy.deepcopy(ds[element]))

            anonymizer.anonymize(ds)

            with Dataset() as dataset:
                for values in encrypted_values + keep_values:
                    dataset.add(values)

                ds.update(dataset)

            anonymized_path = f"{dest_path}{ds['StudyInstanceUID']}/{ds['SeriesInstanceUID']}"
            anonymized_file_path = f"{anonymized_path}/{ds['SOPInstanceUID']}.dcm"

            if not os.path.exists(anonymized_path):
                os.makedirs(anonymized_path)

            ds.save_as(anonymized_file_path)

            return anonymized_file_path

        self.check_input_type(df.schema)
        return df.withColumn(self.output_col, anonymize_dicom_file(col(self.input_col), lit(self.dest_path), lit(self.fp_key), lit(self.tweak)))
