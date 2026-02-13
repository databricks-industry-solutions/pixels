from torch.utils.data import IterableDataset, DataLoader
import logging
import os

logger = logging.getLogger("DICOMFileIterator")
logger.setLevel(logging.INFO)

class DICOMFileIterator(IterableDataset):
    """
    Iterable dataset for iterating over DICOM files in specified folders.

    Args:
        root (str): Root directory containing the folders.
        target (str): Target directory for output files.
        folders (list): List of folder names to search for DICOM files.

    Yields:
        tuple: (src_file, target_file) where src_file is the path to the DICOM file,
               and target_file is the corresponding target path.
    """
    def __init__(self, root:str, target: str, folders: list):
        """
        Initialize the DICOMFileIterator.

        Args:
            root (str): Root directory containing the folders.
            target (str): Target directory for output files.
            folders (list): List of folder names to search for DICOM files.
        """
        self.folders = folders
        self.target = target
        self.root = root
        logger.info(f"Initializing DICOMFileIterator with root: {self.root}, target: {self.target}, folders: {self.folders}")

    def __iter__(self):
        """
        Iterate over DICOM files in the specified folders.

        Yields:
            tuple: (src_file, target_file) for each DICOM file found.
        """
        for folder in self.folders:
            for root_dir, dirs, files in os.walk(os.path.join(self.root, folder)):
                for file in files:
                    if file.lower().endswith(".dcm"):
                        src_file = os.path.join(root_dir, file)
                        rel_path = os.path.relpath(src_file, self.root)
                        target_file = os.path.join(self.target, rel_path)
                        yield src_file, target_file
