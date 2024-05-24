from pyspark.errors import PySparkValueError
from pyspark.sql import DataFrame, functions as f
from pyspark.sql.streaming.query import StreamingQuery

from dbx.pixels.utils import DICOM_MAGIC_STRING, identify_type_udf, unzip_pandas_udf

# dfZipWithIndex helper function


class Catalog:
    """Build object catalog of files on s3 dbfs or local storage.
    Save catalog to Delta Lake table by path or table name"""

    CATALOG_PARTITIONS = 2000
    DEFAULT_VOLUME = "main.pixels_solacc.pixel_volume"

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

    def __streamReader(self, path: str, pattern: str = "*", recurse: bool = True):
        return (
            self._spark.readStream.format("cloudFiles")
            .option("cloudFiles.format", "binaryFile")
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
    ) -> DataFrame:
        """Perform the catalog action and return a spark dataframe

        Parameters
        ----------

            path : str
                Root location of objects
            pattern : str, optional
                file name pattern. Defaults to "*"
            recurse : bool, optional
                True means recurse folder structure. Defaults to True
            extractZip : bool, optional
                True means extract all the zip files from the path location.
                False means ignore the zip files.
                Defaults to False
            extractZipBasePath : str, optional
                The base path where zip files are extracted. Defaults to volume location + "/unzipped/"
            streaming : bool, optional
                If True, the function will catalog data in a streaming manner. Defaults to False.
                The default trigger is availableNow.
            streamCheckpointBasePath : str, optional
                The path where progress of streaming data is saved. Defaults to volume location + /checkpoints/".
            triggerProcessingTime : str, optional
                a processing time interval as a string, e.g. '5 seconds', '1 minute'.
                Set a trigger that runs a microbatch query periodically based on the
                processing time. Only one trigger can be set.
            triggerAvailableNow : bool, optional
                if set to True, set a trigger that processes all available data in multiple
                batches then terminates the query. Only one trigger can be set.

        Returns
        -------
            DataFrame: A DataFrame of the cataloged data.
        """
        assert self._spark is not None
        assert self._spark.version is not None

        self._anon = self._is_anon(path)
        self._spark

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
            df = self.__streamReader(path, pattern, recurse)
        else:
            df = self.__reader(path, pattern, recurse)

        df = df.withColumn("original_path", f.col("path"))

        # Extract zip files in extractZipBasePath
        if extractZip:
            df = df.withColumn(
                "path", f.explode(unzip_pandas_udf("path", f.lit(extractZipBasePath)))
            )

        # Generate paths and remove all non DICOM files
        df = Catalog._with_path_meta(df).filter(f"file_type == '{DICOM_MAGIC_STRING}'")
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
            .withColumn("file_type", identify_type_udf("path"))
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
