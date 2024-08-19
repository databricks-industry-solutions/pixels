from pyspark.sql import SparkSession
from typing import Optional
from pyspark.errors.exceptions.base import PySparkAttributeError
import sys
import logging

class LoggerProvider:
    def get_logger(self):
        logger = logging.getLogger("dbx.pixels")
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            "%(asctime)s %(levelname)s PIXELS: %(message)s", datefmt="%y/%m/%d %H:%M:%S"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.propagate = False
        return logger