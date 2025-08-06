from pyspark.errors import PySparkValueError
from pyspark.sql import DataFrame, functions as f
from pyspark.sql.streaming.query import StreamingQuery

from dbx.pixels.logging import LoggerProvider
from dbx.pixels.utils import identify_type_udf, unzip_pandas_udf

# dfZipWithIndex helper function

logger = LoggerProvider()


class Catalog:
    """Build object catalog of files on s3 dbfs or local storage.
    Save catalog to Delta Lake table by path or table name"""

    CATALOG_PARTITIONS = 2000
    DEFAULT_VOLUME = "main.pixels_solacc.pixels_volume"

    def is_anon(self):
        return self._anon

    def _is_anon(self, path: str):
        """AWS access throws an exception of the bucket is public and you don't know that apriori

        Args:
            path (str): Cloud Storage path starting with scheme:// (e.g. s3://)

        Returns:
            bool: True if the bucket requires anonymous access
        """
        anon = True
        if path.startswith("s3://"):
            anon = False
            fs = None
            import s3fs
            from botocore.exceptions import NoCredentialsError

            fs = s3fs.S3FileSystem(anon=anon)
            try:
                fs.exists(path)
            except NoCredentialsError:
                # print(e, ": Likely a public bucket")
                anon = True

        return anon

    def __init__(
        self, spark, table: str = "main.pixels_solacc.object_catalog", volume: str = DEFAULT_VOLUME
    ):
        """Catalog objects and files, collect metadata and thumbnails. The catalog can be used with multiple object types.
        Parameters:
            spark - Spark context
            table - Delta table that stores the object catalog
            volume - The volume that will be used to store the catalog checkpoints and unzipped files.
        """
        assert spark is not None
        self._spark = spark
        self._table = table
        self._volume = volume
        self._volume_path = f"/Volumes/{volume.replace('.','/')}"
        self._anonymization_base_path = f"{self._volume_path}/anonymized/"

        # Check if the volume exist
        spark.sql(f"LIST '{self._volume_path}' limit 1").count()

        """Spark and Delta Table options for best performance"""
        self._userOptions = {
            "delta.autoOptimize.optimizeWrite": "true",
            "delta.autoOptimize.autoCompact": "true",
            "delta.targetFileSize": "16mb",
            "spark.sql.execution.arrow.maxRecordsPerBatch": "1000",
            "spark.sql.parquet.columnarReaderBatchSize": "1000",
            "spark.sql.execution.arrow.enabled": "true",
            "spark.sql.parquet.enableVectorizedReader": "false",
            "spark.sql.parquet.compression.codec": "uncompressed",
            "spark.databricks.delta.optimizeWrite.enabled": False,
        }


    def __repr__(self):
        return f'Catalog(spark, table="{self._table}")'

    def __reader(self, path: str, pattern: str = "*", recurse: bool = True):
        return (
            self._spark.read.format("binaryFile")
            .option("pathGlobFilter", pattern)
            .option("recursiveFileLookup", str(recurse).lower())
            .load(path)
            .drop("content")
        )

    def __streamReader(
        self, path: str, pattern: str = "*", recurse: bool = True, maxFilesPerTrigger: int = 1000
    ):
        return (
            self._spark.readStream.format("cloudFiles")
            .option("cloudFiles.format", "binaryFile")
            .option("cloudFiles.maxFilesPerTrigger", maxFilesPerTrigger)
            .option("pathGlobFilter", pattern)
            .option("recursiveFileLookup", str(recurse).lower())
            .load(path)
            .drop("content")
        )

    def catalog(
        self,
        path: str,
        pattern: str = "*",
        recurse: bool = True,
        streaming: bool = False,
        streamCheckpointBasePath: str = None,
        triggerProcessingTime: str = None,
        triggerAvailableNow: bool = None,
        extractZip: bool = False,
        extractZipBasePath: str = None,
        maxFilesPerTrigger: int = 1000,
        maxUnzippedRecordsPerFile: int = 102400,
        maxZipElementsPerPartition: int = 32,
        detectFileType: bool = False,
    ) -> DataFrame:
        """
        Catalogs files and directories at the specified path, optionally extracting zip files and handling streaming data.

        Parameters:
        - path (str): The root location of objects to catalog.
        - pattern (str, optional): File name pattern to match. Defaults to "*".
        - recurse (bool, optional): Whether to recurse through directories. Defaults to True.
        - streaming (bool, optional): Whether to catalog data in a streaming manner. Defaults to False.
        - streamCheckpointBasePath (str, optional): The path for saving streaming progress. Defaults to volume location + "/checkpoints/".
        - triggerProcessingTime (str, optional): The processing time interval for streaming triggers, e.g., '5 seconds', '1 minute'.
        - triggerAvailableNow (bool, optional): If True, processes all available data in multiple batches then terminates the query.
        - extractZip (bool, optional): Whether to extract zip files found in the path. Defaults to False.
        - extractZipBasePath (str, optional): The base path for extracted zip files. Defaults to volume location + "/unzipped/".
        - maxFilesPerTrigger (int, optional): The maximum number of files to process per trigger in streaming. Defaults to 1000.
        - maxUnzippedRecordsPerFile (int, optional): The maximum number of records per file when unzipping. Defaults to 102400.
        - maxZipElementsPerPartition (int, optional): The maximum number of zip elements per partition. Defaults to 32.
        - detectFileType (bool, optional): Whether to detect file types. Defaults to False.

        Returns:
        DataFrame: A DataFrame of the cataloged data, with metadata and optionally extracted contents from zip files.
        """

        assert self._spark is not None
        assert self._spark.version is not None

        self._anon = self._is_anon(path)
        self._spark

        #self._init_tables()

        # Used only for streaming
        self._queryName = f"pixels_{path}_{self._table}"
        self._isStreaming = streaming

        if streamCheckpointBasePath is None:
            streamCheckpointBasePath = f"{self._volume_path}/checkpoints/"

        if extractZipBasePath is None:
            extractZipBasePath = f"{self._volume_path}/unzipped/"

        self.streamCheckpointBasePath = streamCheckpointBasePath

        # Trigger handling, defaults to availableNow
        if self._isStreaming:
            triggerParams = [triggerProcessingTime, triggerAvailableNow]

            if triggerParams.count(None) == 2:
                triggerAvailableNow = True
            elif triggerParams.count(None) == 0:
                raise PySparkValueError(
                    error_class="ONLY_ALLOW_SINGLE_TRIGGER",
                    message_parameters={},
                )
            self._triggerProcessingTime = triggerProcessingTime
            self._triggerAvailableNow = triggerAvailableNow

        if self._isStreaming:
            df = self.__streamReader(path, pattern, recurse, maxFilesPerTrigger).withColumn(
                "original_path", f.col("path")
            )

            if extractZip:
                logger.info("Started unzip process")

                unzip_stream = (
                    df.withColumn(
                        "path", f.explode(unzip_pandas_udf("path", f.lit(extractZipBasePath)))
                    )
                    .writeStream.format("delta")
                    .outputMode("append")
                    .option(
                        "checkpointLocation", f"{self.streamCheckpointBasePath}/{self._table}_unzip"
                    )
                    .option("maxRecordsPerFile", maxUnzippedRecordsPerFile)
                    .option("mergeSchema", "true")
                    .trigger(
                        availableNow=self._triggerAvailableNow,
                        processingTime=self._triggerProcessingTime,
                    )
                    .queryName(self._queryName + "_unzip")
                    .toTable(f"{self._table}_unzip")
                )

                if self._triggerAvailableNow:
                    unzip_stream.awaitTermination()

                logger.info("Unzip process completed")

                df = self._spark.readStream.option("maxFilesPerTrigger", "1").table(
                    f"{self._table}_unzip"
                )

                # Rebalance the extracted files among workers
                df = df.repartition(int(maxUnzippedRecordsPerFile // maxZipElementsPerPartition))

        else:
            df = self.__reader(path, pattern, recurse).withColumn("original_path", f.col("path"))
            if extractZip:
                logger.info("Started unzip process")

                df.withColumn(
                    "path", f.explode(unzip_pandas_udf("path", f.lit(extractZipBasePath)))
                ).write.format("delta").mode("append").saveAsTable(f"{self._table}_unzip")

                logger.info("Unzip process completed")

                df = self._spark.read.table(f"{self._table}_unzip")

                records = df.count()
                df = df.repartition(
                    int(records // maxZipElementsPerPartition) | maxZipElementsPerPartition
                )

        # Generate paths
        df = Catalog._with_path_meta(df)

        if detectFileType:
            df = df.withColumn("file_type", identify_type_udf("path"))

        return df

    def load(self, table: str = None) -> DataFrame:
        """
        @return Spark dataframe representing the object Catalog
        """
        return self._spark.table(self._table if not table else table)

    def __writer(
        self,
        df: DataFrame,
        options: dict,
        table: str,
        mode: str = "append",
    ):
        return df.write.format("delta").mode(mode).options(**options).saveAsTable(table)

    def __streamWriter(
        self,
        df: DataFrame,
        options: dict,
        table: str,
        mode: str = "append",
    ) -> StreamingQuery:
        return (
            df.writeStream.format("delta")
            .outputMode(mode)
            .options(**options)
            .option("checkpointLocation", f"{self.streamCheckpointBasePath}/{table}")
            .queryName(self._queryName)
            .trigger(
                availableNow=self._triggerAvailableNow, processingTime=self._triggerProcessingTime
            )
            .toTable(table)
            .awaitTermination()
        )

    def save(
        self,
        df: DataFrame,
        path: str = None,
        table: str = None,
        mode: str = "append",
        mergeSchema: bool = True,
        hasBinary: bool = False,
        userMetadata=None,
        userOptions={},
    ):
        """
        Save Catalog dataframe to Delta table for later fast recall using .load()
        """
        options = {}
        options["mergeSchema"] = mergeSchema

        if None != userMetadata:
            options["userMetadata"] = userMetadata
        if None != path:
            options["path"] = path

        options.update(self._userOptions)
        options.update(userOptions)

        # print(options)
        self._spark
        if self._isStreaming:
            return self.__streamWriter(df, options, self._table if not table else table, mode)
        else:
            return self.__writer(df, options, self._table if not table else table, mode)

    def _with_path_meta(
        df, basePath: str = "dbfs:/", inputCol: str = "path", num_trailing_path_items: int = 5
    ):
        """break path up into usable information"""
        return (
            df.withColumn("relative_path", f.regexp_replace(inputCol, basePath + r"(.*)$", r"$1"))
            .withColumn("local_path", f.regexp_replace(inputCol, r"^dbfs:(.*$)", r"/dbfs$1"))
            .withColumn(
                "local_path", f.regexp_replace("local_path", r"/dbfs/Volumes/(.*$)", r"/Volumes/$1")
            )
            .withColumn("extension", f.regexp_replace(inputCol, r".*\.(\w+)$", r"$1"))
            .withColumn(
                "extension",
                f.when(f.col("extension") == f.col(inputCol), f.lit("")).otherwise(
                    f.col("extension")
                ),
            )
            .withColumn("file_type", f.lit(""))
            .withColumn(
                "path_tags",
                f.slice(
                    f.split(
                        f.regexp_replace("relative_path", r"([0-9a-zA-Z]+)([\_\.\/\:\@])", r"$1,"),
                        ",",
                    ),
                    -num_trailing_path_items,
                    num_trailing_path_items,
                ),
            )
        )


if __name__ == "__main__":
    import os
    import sys

    sys.path.insert(0, os.path.dirname(__file__) + "/../..")
    from dbx.pixels import Catalog

    c = Catalog()
    # c.catalog("dbfs:/tmp")
