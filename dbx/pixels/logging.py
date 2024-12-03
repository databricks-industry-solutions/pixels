import logging
import sys


class LoggerProvider:
    """
    This class provides a logger instance for logging messages.
    """

    def __new__(self):
        """
        This method is a constructor that creates a new instance of the LoggerProvider class.
        It overrides the default __new__ method to ensure that only one instance of the class is created.
        """
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
