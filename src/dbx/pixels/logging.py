import logging
import os
import sys


class LoggerProvider:
    """
    This class provides a logger instance for logging messages.
    'DB_PIXELS_LOG_LEVEL' environment variable allows to define a common log level for all loggers used in dbx.pixels package.
    """

    def __new__(self, name: str = "dbx.pixels", log_level=logging.INFO):
        """
        This method is a constructor that creates a new instance of the LoggerProvider class.
        It overrides the default __new__ method to ensure that only one instance of the class is created.
        """
        if not hasattr(self, "list_loggers"):
            self.list_loggers = {}

        if name not in self.list_loggers:
            logger = logging.getLogger(name)
            logger.setLevel(os.environ.get("DB_PIXELS_LOG_LEVEL", log_level))

            handler = logging.StreamHandler(sys.stdout)
            formatter = logging.Formatter(
                f"%(asctime)s %(levelname)s [PIXELS] {name}: %(message)s",
                datefmt="%y/%m/%d %H:%M:%S",
            )
            handler.setFormatter(formatter)
            logger.addHandler(handler)
            logger.propagate = False
            self.list_loggers[name] = logger

            logger.debug("Logger created")

        return self.list_loggers[name]
