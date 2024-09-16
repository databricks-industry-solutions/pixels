import logging
import sys


class LoggerProvider:
    def __new__(self):
        if not hasattr(self, "logger"):
            logger = logging.getLogger("dbx.pixels")
            logger.setLevel(logging.INFO)

            handler = logging.StreamHandler(sys.stdout)
            formatter = logging.Formatter(
                "%(asctime)s %(levelname)s PIXELS: %(message)s", datefmt="%y/%m/%d %H:%M:%S"
            )
            handler.setFormatter(formatter)
            logger.addHandler(handler)
            logger.propagate = False
            self.logger = logger

        return self.logger
