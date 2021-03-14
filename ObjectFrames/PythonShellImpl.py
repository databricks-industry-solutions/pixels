from __future__ import absolute_import
from __future__ import print_function

import errno
import linecache
import os
import pickle
import re
import resource
import signal
import six
import six.moves.queue
import subprocess
import sys
import time
import traceback
import traitlets
import warnings

from collections import OrderedDict
from distutils.version import LooseVersion
from six import StringIO  # cString does not support unicode well
from six.moves import range
from tempfile import NamedTemporaryFile
from py4j.java_collections import ListConverter
from AdviceGenerator import getAdviceGenerator
from CommandNotificationSender import CommandNotificationSender
from PostImportHook import when_imported

try:
    import matplotlib as mpl
except:
    pass

import IPython
from IPython.config.loader import Config
from IPython.core.compilerop import CachingCompiler, code_name
from IPython.core.displayhook import DisplayHook
from IPython.core.magic import Magics, magics_class, line_magic
from IPython.core.interactiveshell import InteractiveShell
from IPython.utils.strdispatch import StrDispatch
from IPython.utils.tokenutil import token_at_cursor
from py4j import clientserver
from py4j.java_gateway import JavaGateway, GatewayClient, GatewayParameters, java_import

print(time.asctime(), "py4j imported", file=sys.stderr)

from pyspark.context import SparkContext
from pyspark.conf import SparkConf
from pyspark.sql import DataFrame
from pyspark.sql import functions

from dbutils import DBUtils, stderr, Console
from RichCompleter import RichCompleter
from databricksCli import init_databricks_cli_config_provider
# We have inlined ansi2html to avoid depending on nbconvert
from databricks_nbconvert_5_31_ansi2html import ansi2html
from MlflowCreateRunHook import get_mlflow_create_run_hook, MlflowRunsCreatedNotification
from PostImportHook import when_imported
from TensorboardManager import makeCustomDisplay


class ConsoleBuffer(object):
    def __init__(self, limit, stream=None):
        self.io = StringIO()
        self.limit = limit
        self.stream = stream
        self._first_part = ''
        self._dropped = 0

    def getvalue(self):
        if not self.limit:
            return self.io.getvalue()
        if len(self._first_part) + self.io.tell() > self.limit:
            self._erase_middle()
        if self._dropped:
            # Keep in sync with overflowMessage() in StringUtils.scala
            mid = "\n*** WARNING: skipped %d bytes of output ***\n\n" % self._dropped
        else:
            mid = ""
        return self._first_part + mid + self.io.getvalue()

    def close(self):
        pass

    def clear(self):
        self.io = StringIO()
        self._first_part = ""
        self._dropped = 0

    def write(self, data):
        if isinstance(data, six.text_type):
            decoded = data
        else:
            decoded = data.decode('utf8')
        self.io.write(decoded)
        # Fork the output to the stream user provides as well so that it can be collected
        # in scala driver.
        if self.stream:
            self.stream.write(decoded.encode('utf8'))
        if 0 < self.limit < self.io.tell():
            self._erase_middle()

    def isatty(self):
        return False

    @property
    def encoding(self):
        # This must be hardcoded to 'UTF-8' so that repr() output with Unicode characters
        # is displayed properly under Python 2. In Python 2, __str__ and __repr__ methods
        # can only return `str` objects, not `unicode`. To work around this limitation,
        # many libraries perform a `.encode()` call and return encoded bytes from __str__
        # see https://stackoverflow.com/questions/1307014 for some discussion). This creates
        # ambiguity as to the bytes' encoding, so consumers of __str__ need to guess the
        # proper encoding to use when decoding.

        # IPython 3.2+ uses sys.stdout's encoding to decode these bytes:
        #   https://github.com/ipython/ipython/pull/8260
        # In Databricks' Python REPLs, sys.stdout points to an instance of this ConsoleBuffer
        # class, so the encoding returned below will be used. This needs to be an encoding
        # around sys.stdout, so the encoding returned below will be used.

        # IPython 4.x+ appears to hardcode 'UTF-8' as the default output encoding:
        #   https://github.com/ipython/ipykernel/commit/542b98110eaaaedf90ba6dec604f76955548f827
        # Therefore we match that default here.
        if IPython.version_info[0] < 4:
            # Compatibility with old DBR behaviors. This is an extremely conservative change which
            # is only present due to the Conda revert for DBR 5.x; we can probably remove this
            # branch and unconditionally return 'UTF-8' in DBR 6.x. See SC-12715.
            return sys.getdefaultencoding()
        else:
            # Change described above.
            return 'UTF-8'

    def _erase_middle(self):
        """
        erase the middle part of data to make sure the length
        do not go over limit.
        """
        if self.io.tell() < self.limit // 2:
            return

        total = self.io.tell()
        self.io.seek(total - self.limit // 2)
        self.io.readline()  # break at end of line
        pos = self.io.tell()
        last = self.io.read()
        if self._first_part:
            self._dropped += pos
        else:
            self.io.seek(self.limit // 2)
            self.io.readline()
            fpos = self.io.tell()
            self.io.seek(0)
            self._first_part = self.io.read(min(fpos, self.limit))
            self._dropped = pos - len(self._first_part)

        self.io.truncate(0)
        self.io.seek(0)  # truncate does not reset the seek position in Python 3
        self.io.write(last)

    def flush(self):
        self.io.flush()


# TODO(hossein) when old getArgument is deprecated remove this class
# Used to store argument names and values for each shell
# This is a stateful object that keeps track of two pieces of information:
# o the bindings (args dictionary): a mapping from argument names to values
# o accessed arguments (accessed dictionary): mapping from name of arguments that are accessed
# When initialized this object has clean state.
# When update() is called, both args and accessed dictionaries are cleared. Then bindings are
# stored in args. For every call to get(), accessed dictionary gets updated with accessed name
# and value. accessedArgs() returns accessed arguments dictionary.
class Arguments(object):
    def __init__(self, sc):
        self.args = {}
        self._jvm = sc._jvm
        self.accessed = self._jvm.java.util.HashMap()

    def set(self, name, value):
        self.args[name] = value

    def update(self, newargs):
        self.accessed = self._jvm.java.util.HashMap()
        self.args.clear()
        for name in six.iterkeys(newargs):
            self.set(name, newargs[name])

    def get(self, name, default):
        v = self.accessed[name] if self.accessed.containsKey(name) else self.args.get(name, default)
        self.accessed[name] = str(v)
        return str(v)

    def accessedArgs(self):
        return self.accessed


class Executor(object):
    def __init__(self, shell, console_buffer, entry_point, spark_conf):
        self.shell = shell
        self.queue = six.moves.queue.Queue(1)
        self.result = six.moves.queue.Queue()
        self.current_id = 0
        # The job group of the command that is currently running
        self.currentJobGroup = None
        self.console = Console(console_buffer)
        self.entry_point = entry_point

        # clusterUsageTags.sparkVersion is not available in all settings, i.e. driver local tests
        # so we check MLR using an environment variable
        isMLR = "MLR_PYTHONPATH" in os.environ
        self.advice_generator = getAdviceGenerator(entry_point, spark_conf, isMLR)

    def execute(self, cmd, jobGroup, command_id):
        """
        Run a command `cmd` with jobGroup used to uniquely identify this command.

        The `cmd` will be put in a queue, fetch the status by another queue `result`.

        It can only execute one command at a time, if some commands are blocked by
        failed canceling, it will raise Exception

        :return: Return True if if command finished in 1 seconds, or False, means
                 it's still running, the status can be polled by is_finished()
        """
        self.current_id += 1
        # if queue is full after waiting 1 seconds, it will raise exception,
        # tell Driver to detach it.
        self.queue.put((self.current_id, cmd, jobGroup, command_id), timeout=1)
        # TODO(SC-21407): there is a chance that if the exception handling in IPython takes more
        # than 1 seconds, this wait would leave the repl in unexpected state, as the exception
        # handling is executed in the same main thread for command execution.
        return self.is_finished(1)

    def run(self):
        try:
            self.advice_generator.init_hook()
        except Exception as e:
            # Defensively swallow any exceptions thrown by ML advice generation logic
            print(
                "PythonShellImpl.py: Unexpected internal error %s while initializing advice "
                "generation" % e,
                file=stderr)
            pass
        while True:
            try:
                # Resets the job group while waiting for the next command to come from the queue.
                # This point is reached after the previous command has completed.
                self.currentJobGroup = None
                try:
                    # Blocking on the next command to come from the queue.
                    cid, cmd, jobGroup, command_id = self.queue.get(timeout=1)
                except six.moves.queue.Empty:
                    # End this process if the parent process has died. This ensures that we kill the
                    # Python shell whenever we detach the notebook/restart the cluster (PROD-1541).
                    ppid = self.shell.parentPid
                    if not _process_still_alive(ppid):
                        print(
                            "Exiting PythonShell because parent process (PID %i) died" % ppid,
                            file=stderr)
                        break
                    continue

                if cmd is None:
                    print("Exiting because empty command was retrieved from queue", file=stderr)
                    break
                # IPython shell will handle KeyboardInterrupt
                # The command is about to be executed. Set the job group to indicate that we are
                # running this command currently.
                self.currentJobGroup = jobGroup
                # set the failure flag to be false before each command execution, check the PR
                # description to see why it's necessary to do it here.
                # https://github.com/databricks/universe/pull/40420
                self.shell.lastCommandFailed = False
                # clear last exception in current thread, or user can get the internal
                # exception by 'raise', which will leak our source code.
                # We only need to do this in Python 2. In Python 3, PEP 3100 removed sys.exc_clear()
                # because this cleanup is automatically handled by the `except` clause.
                # See https://mail.python.org/pipermail/python-3000/2007-February/005672.html
                if six.PY2:
                    sys.exc_clear()
                # Redirect the output while in this section
                with self.console:
                    self.shell.shell.run_cell(command_id, cmd, store_history=True)
                self.result.put(cid)
            except KeyboardInterrupt:
                pass  # interrupted outside of shell
            except:
                import traceback
                traceback.print_exc()
            finally:
                try:
                    self.advice_generator.command_finished_hook()
                except Exception as e:
                    # Defensively swallow any exceptions thrown by ML advice generation logic
                    print(
                        "PythonShellImpl.py: Unexpected internal error %s running post-command "
                        "execution hook for advice generation" % e,
                        file=stderr)
                    pass

    def is_finished(self, timeout=0):
        """
        Return the command has finished or not, wait at most `timeout` seconds
        """
        if not timeout and self.currentJobGroup is None:
            return True

        try:
            while True:
                if self.result.get(timeout=timeout) == self.current_id:
                    return True
                # result for previous command
        except six.moves.queue.Empty:
            # maybe interrupted without reply or consumed by others
            return self.currentJobGroup is None

    def cancel(self):
        """
        Cancel current command.

        It will send SIGINT to main thread to interrupt the IPython Shell. As os.kill in python only
        signals the main thread in python process. More info please check:

        https://www.g-loaded.eu/2016/11/24/how-to-terminate-running-python-threads-using-signals/

        """
        for i in range(10):
            # terminate the current running job group. There is a chance that the job group hasn't
            # been executed yet, so we retry 10 times here to make sure something actually get
            # canceled.
            if self.currentJobGroup is not None:
                os.kill(os.getpid(), signal.SIGINT)
                self.currentJobGroup = None
                # make sure we only send one SIGINT
                break
            else:
                time.sleep(0.1)


@magics_class
class IPythonMagicOverrides(Magics):
    """
    This class is defined for overriding IPython magic strings. Please do not blindly follow this pattern.
    If we start overriding many of these, we should have a followup to decide the best process moving forward.
    """

    def __init__(self, *args, condaMagicHandler=None, **kwargs):
        """
        :param condaMagicHandler: Define conda & pip magic behaviour
        :param args: see Magics
        :param kwargs: see Magics
        """
        super().__init__(*args, **kwargs)
        self.condaMagicHandler = condaMagicHandler

    @line_magic
    def matplotlib(self, command):
        shell = IPython.get_ipython()
        if shell and shell.user_ns and "sc" in shell.user_ns and shell.user_ns["sc"]._conf:
            spark_conf = shell.user_ns["sc"]._conf
            if spark_conf.get('spark.databricks.workspace.matplotlibInline.enabled',
                              'false') == 'true':
                if command == 'inline':
                    self.switch_to_inline_backend(shell)
                    return
                else:
                    # matplotlib specified with command other than 'inline' while inline is enabled
                    print('%matplotlib {command} is not supported in Databricks.\n'
                          'Try using \'%matplotlib inline\' instead.'.format(command=command))
                    return

        # Matplotlib inline is not enabled
        display_url = "https://docs.databricks.com/user-guide/visualizations/matplotlib-and-ggplot.html"
        print('%matplotlib {command} is not supported in Databricks.\n'
              'You can display matplotlib figures using display().\n'
              'For an example, see {display_url}.'.format(command=command, display_url=display_url))

    def switch_to_inline_backend(self, shell):
        try:
            import matplotlib
            import matplotlib.pyplot as plt

        # matplotlib is not installed
        except ImportError as e:
            self.print_import_error(e)
            return

        try:
            # Use plt.switch_backend after setting rcParam to get %matplotlib inline to
            # work on the current cell by preventing circular import error with pyplot
            new_backend = 'module://ipykernel.pylab.backend_inline'
            matplotlib.rcParams['backend'] = new_backend
            plt.switch_backend(new_backend)

            # Patch display function on the backend_inline backend
            # ML-13047 fix the figure display issue for Matplotlib 3.3.2 or above
            # `ipykernel.pylab.backend_inline` must import after switch to the backend_inline to
            # to make sure it's been activated. This is because the function
            # `_enable_matplotlib_integration` is only called when first time import the
            # backend_inline
            import ipykernel.pylab.backend_inline as backend_inline
            backend_inline.display = shell.user_ns['display']

        # Internally switch_backend will attempt to import backend_inline from
        # ipykernel, which may raise an ImportError if ipykernel is not installed.
        except ImportError as e:
            self.print_import_error(e)
            matplotlib.rcParams['backend'] = 'AGG'

            if shell.user_ns.entry_point:
                logger = shell.user_ns.entry_point.getLogger()
                logger.logDriverEvent({
                    'eventType': 'matplotlibInline',
                    'status': 'failed',
                    'error': 'importFailure'
                })
            return

        if shell.user_ns.entry_point:
            logger = shell.user_ns.entry_point.getLogger()
            logger.logDriverEvent({'eventType': 'matplotlibInline', 'status': 'success'})

    def print_import_error(self, error):
        library_url = 'https://docs.databricks.com/libraries.html'
        print(
            'Import error while trying to switch matplotlib backend:\n' + str(error) + '\n' +
            'Setting matplotlib backend to inline requires ipykernel and matplotlib dependencies.\n'
            'See {library_url} for details.'.format(library_url=library_url))

    @line_magic
    def conda(self, line):
        self.condaMagicHandler.runCmd("conda", line)

    @line_magic
    def pip(self, line):
        self.condaMagicHandler.runCmd("pip", line)


class CondaMagicHandler:
    def __init__(self, python_shell):
        self.python_shell = python_shell

    def runCmd(self, magicCmd, line):
        envState = self.python_shell.entry_point.getCondaEnvState()
        parsedResult = envState.parseCmd(magicCmd, line)
        if parsedResult.error():
            raise ValueError(parsedResult.error())
        if parsedResult.warning():
            sys.stderr.write(parsedResult.warning() + "\n")
            sys.stderr.flush()
        if parsedResult.isMutation():
            if not envState.getIsEnvCloned():
                parsedResult = envState.cloneEnv(parsedResult)
            print("Python interpreter will be restarted.")
            self.python_shell.entry_point.restartInterpAfterExecution()
        if parsedResult.rewrittenCommand():
            self.executeCondaCommand(parsedResult)
        envState.postExecute(parsedResult, self.python_shell.currentJobGroup)
        if parsedResult.isMutation():
            # double print this output is at the end so it is more
            # likely to be seen
            print("Python interpreter will be restarted.")
            # we mount NFS with actimeo=1 (ML-9900), so sleep a
            # second here to make sure by the time next command is run
            # actimeo is over
            time.sleep(1)

    def executeCondaCommand(self, result):
        envState = self.python_shell.entry_point.getCondaEnvState()
        cmd = result.magicCmd() + " " + result.rewrittenCommand()
        origCmd = cmd
        envScript = result.condaEnvScript()
        if envScript:
            # envScript is not executable so need to run with bash
            cmd = "bash " + envScript + " " + cmd

        # Run the magic command in a directory that is guaranteed to be readable, otherwise conda
        # will fail.
        cwd = envState.getCwdForProcessIsolation()

        p = None
        returncode = None
        start = time.time()
        # adapted from com.databricks.backend.common.rpc.Languages#evalShMacro
        # to stream output from command. Added cancellation handling
        try:
            p = subprocess.Popen(
                cmd,
                shell=True,
                cwd=cwd,
                executable='/bin/bash',
                stderr=subprocess.STDOUT,
                stdout=subprocess.PIPE,
                universal_newlines=True,
                # [ES-28099] We want the child process to inherit the env vars pythonShell was
                # started with. Otherwise horovod installation will fail.
                # Libraries like numpy will "corrupt" the environment variables sent to the child
                # process. Setting env to os.environ helps because the environment variables are
                # cached when we first import os and then not updated again.
                env=os.environ)
            for line in iter(p.stdout.readline, ''):
                sys.stdout.write(line)
                sys.stdout.flush()
            returncode = p.wait()
            p = None
            sys.stdout.flush()
            if returncode != 0:
                raise subprocess.CalledProcessError(returncode, origCmd)
        finally:
            end = time.time()
            if p is not None:
                p.terminate()
                p.wait()
            envState.logCondaCommandDuration(result, end - start, returncode)


class IPythonShellHooks(object):
    """
    Utility class for setting ipython shell custom hooks using the IPython Events API:
    http://ipython.readthedocs.io/en/stable/config/callbacks.html
    """

    def __init__(self, ip_shell):
        self.shell = ip_shell

    def pre_command_execute(self):
        """
        reset tracked new dataframe metadata before each command execution
        """
        self.shell.user_ns.reset_new_dataframes()

    def post_command_execute(self):
        """
        placeholder for post_execute callback
        """

    @staticmethod
    def load_ipython_hooks(ip):
        ipy_hooks = IPythonShellHooks(ip)
        hook_objs = [ipy_hooks]
        sc = ip.user_ns.get("sc")
        if sc is not None:
            command_notif_store = ip.user_ns.entry_point.getCommandNotificationStore()
            notification_sender = CommandNotificationSender(command_notif_store, sc)
            hook_objs.append(get_mlflow_create_run_hook(notification_sender))
        # Ipython runs preexecute & postexecute hooks in the order of registration (first to register
        # is first to run). We register preexecute hooks in the provided order, and postexecute in
        # the reverse order
        for hook_obj in hook_objs:
            ip.events.register('pre_execute', hook_obj.pre_command_execute)
        for hook_obj in reversed(hook_objs):
            ip.events.register('post_execute', hook_obj.post_command_execute)


class UserNamespaceDict(dict):
    """
    Databricks specific user namespace, subclass from python dict and add custom hooks to record
    metadata about newly created dataframes

    We pass an instance of this class to IPythonShell(inherited from iPython.core.InteractiveShell),
    which will internally use the passed in user_ns object to track all user declared variables.
    Inside ipython InteractiveShell, running a cell looks like: `exec(cmd, global_ns, user_ns)`.
    Since `exec` will call user_ns.__setitem__ internally when user code has declared a new var or
    reassigned to an existing val. The override of __setitem__ below allow us to add custom hook to
    monitor user defined vars
    """

    # If in the future we want to support more types to attach metadata to in python shell,
    # we could use reflection to get this string: e.g. str(type(val))
    PY_DATAFRAME_TYPE_STR = "pyspark.sql.dataframe.DataFrame"

    def __init__(self, initial_user_ns, driverConf, entry_point):
        self.conf_enable_notebook_dataset_info = driverConf.enableNotebookDatasetInfo()
        self.conf_max_dataset_info_json_length = driverConf.maxDatasetInfoJsonLength()
        self.entry_point = entry_point
        self.reset_new_dataframes()

        super(UserNamespaceDict, self).__init__(initial_user_ns)

    def __setitem__(self, key, value):
        """
        Override dict.__setitem__ to include custom hooks
        """

        # remove key from tracked new dataframes list if it is already in user namespace in order to
        # maintain the insert order
        if (self.new_dataframes.get(key) != None and self.conf_enable_notebook_dataset_info):
            self.new_dataframes.pop(key)

        if (isinstance(value, DataFrame) and self.conf_enable_notebook_dataset_info):
            self.new_dataframes[key] = value

*** WARNING: skipped 37906 bytes of output ***

        :param line: The line of code for a code hint
        :param cursorPosition: The position within the line that identifies the object of interest
        :param detailLevel: Set to 0 for default results
        """
        resultPlain = ""
        resultHtml = ""
        try:
            driver = self.sc._jvm.com.databricks.backend.daemon.driver
            name = token_at_cursor(line, cursorPosition)
            d = self.shell.object_inspect_mime(name, detailLevel)
            resultPlain = d.get("text/plain", "")
            resultHtml = ansi2html(resultPlain)
        except KeyError:
            print("InspectRequest: object not found for ", name, file=stderr)
            self.console_buffer.write(str(e))
        except Exception as e:
            print("InspectRequest: Exception: ", e, traceback.print_tb(e.__traceback__), file=stderr)
            self.console_buffer.write(str(e))
        finally:
            return driver.InspectReplyJava(resultPlain, resultHtml)

    def is_finished(self):
        return self.executor.is_finished()

    def _get_buffer(self, buffer, clear=False):
        try:
            ret = buffer.getvalue()
            if clear:
                buffer.clear()
            return '<div class="ansiout">%s</div>' % ansi2html(ret)
        except Exception as e:
            print("got exception in get", e, file=stderr)
            return str(e)

    def get(self, clear=False):
        return self._get_buffer(self.console_buffer, clear)

    def wasLastCommandException(self):
        return self.lastCommandFailed

    def display(self, input=None, *args, **kwargs):
        """
        Display plots or data.

        Display plot:
         - display() # if matplotlib current figure is set
         - display(matplotlib.figure.Figure)
         - display(ggplot.ggplot)

        Display dataset:
         - display(spark.DataFrame)
         - display(list) # if list can be converted to DataFrame, e.g., list of named tuples
         - display(pandas.DataFrame)
         - display(koalas.DataFrame)

        Display any other value that has a _repr_html_() method

        For Spark 2.0 and 2.1:
         - display(DataFrame, streamName='optional', trigger=optional pyspark.sql.streaming.Trigger,
                   checkpointLocation='optional')

        For Spark 2.2+:
         - display(DataFrame, streamName='optional', trigger=optional interval like '1 second',
                   checkpointLocation='optional')
        """
        genericErrorMsg =\
            "Cannot call display(%s)\n" % ", ".join([str(type(x)) for x in [input]+list(args)]) +\
            " Call help(display) for more info."
        # SC-10188: Still attempt to import ggplot in order to preserve any unknown side-effects,
        # but place it in a `try` to mitigate against broken behavior due to `six` upgrade.
        # See PR for more details.
        # SC-11062: Upgrading pandas lib would also break import ggplot, therefore we generalize
        # this to catch and ignore all ImportErrors
        # SC-14588: pandas 0.24.0 introduce further incompatibilities with the version of ggplot we
        # have and would throw AttributeError to prevent python shell to start. As I still assume
        # that numpy is more important than ggplot which no one actually use, I'm ignoring the new
        # error here. Hopefully we can have it resolved in DBR 6.0. TODO(yhuai)
        try:
            import ggplot
        except (TypeError, ImportError, AttributeError) as e:
            if isinstance(e, ImportError) or\
               isinstance(e, AttributeError) or\
                ("Error when calling the metaclass bases" in e.message and \
                "the metaclass of a derived class must be a (non-strict) subclass of the metaclasses of all its bases" in e.message):
                # Preserve indirect side-effects needed by the `mpl.figure.Figure`
                # check a few lines down:
                try:
                    import matplotlib.pyplot
                except ImportError as e:
                    pass
            else:
                raise  # Rethrow unexpected exception
        if input is None:
            if 'matplotlib.figure' in sys.modules:
                global mpl
                if mpl is None:
                    import matplotlib as mpl
                self.display(mpl.pyplot.gcf())
            else:
                raise ValueError("Nothing to display. Call help(display) for more info.")
        elif isinstance(input, DataFrame):
            # We have this problem of streaming only working in 2.0, but the PythonDriverLocal and
            # this file being shared with all versions of Spark. Therefore to display streaming
            # DataFrames, we need to hack around it. While all display methods work as setting some
            # buffer here and choosing what to display on the Scala side, we are going to directly
            # call the special StreamingDF display code from here. Then we're not going to set any
            # extra buffers so that the Scala treats it as regular code. However, once the stream
            # sends it's first data, it will populate the result view. Since previous versions of
            # Spark DataFrame's don't have the `isStreaming` method, we first check if the attribute
            # exists and then if it does, whether it is actually streaming.
            if hasattr(input, 'isStreaming') and input.isStreaming:
                jvm = self.sc._jvm
                if kwargs.get('trigger') is not None:
                    if self.sc.version.startswith("2.0") or self.sc.version.startswith("2.1"):
                        # Spark 2.0 and 2.1 has Python Trigger objects that can be passed as param
                        trigger = kwargs.get('trigger')._to_java_trigger(self.sqlContext)
                    else:
                        raise Exception(
                            "Keyword 'trigger' is not allowed in Spark 2.2+, see latest usage for details."
                        )

                elif kwargs.get('processingTime') is not None:
                    # Spark 2.2 onwards, this parameter is consistent with Spark DataFrameWriter.trigger().
                    # That is, it will take the trigger interval as a string with `keyword processingTime`.
                    interval = kwargs.get('processingTime')
                    if type(interval) is not str:
                        raise Exception("Value for 'processingTime' must be a string")
                    trigger = jvm.org.apache.spark.sql.streaming.Trigger.ProcessingTime(interval)

                else:
                    trigger = None

                name = kwargs.get('streamName', jvm.com.databricks.backend.daemon.driver \
                                  .DisplayHelper.getStreamName())

                self.driverSparkHooks.displayStreamingDataFrame(input._jdf, name, trigger,
                                                                kwargs.get('checkpointLocation'))
            else:
                if kwargs.get('streamName'):
                    raise Exception('Stream names can only be set for streaming queries.')
                if kwargs.get('trigger'):
                    raise Exception('Triggers can only be set for streaming queries.')

                if self.enableListResults:
                    self.appendResults("table", input._jdf)
                else:
                    self.displayRDD = input._jdf
        elif isinstance(input, list):
            listDisplay = self.sparkSession.createDataFrame(input)._jdf
            if self.enableListResults:
                self.appendResults("table", listDisplay)
            else:
                self.displayRDD = listDisplay
        elif type(input).__module__ == 'matplotlib.figure' and type(input).__name__ == 'Figure':
            # Display the figure if it is not empty
            if input.axes or input.lines:
                _format = 'png'
                extension = '.' + _format
                dpi = input.get_dpi()
                # The retina image will get twice dpi and `@2x.png` extension
                if matplotlib.rcParams['savefig.format'] == 'retina':
                    dpi = 2 * input.get_dpi()
                    extension = '@2x.' + _format
                figureFile = NamedTemporaryFile(delete=False, suffix=extension)
                transparent = self.sc._conf.get('spark.databricks.workspace.matplotlib.transparent',
                                                'false') == 'true'
                # Apply configuration values from the figure to the plot generated
                # bbox_inches, facecolor, edgecolor, and dpi are an exhaustive list of attributes
                # used in IPython.core.pylabtools.print_figure
                input.savefig(
                    figureFile,
                    format=_format,
                    transparent=transparent,
                    bbox_inches='tight',
                    facecolor=input.get_facecolor(),
                    edgecolor=input.get_edgecolor(),
                    dpi=dpi)
                figureFile.close()

                if self.enableListResults:
                    self.appendResults("image", figureFile.name)
                else:
                    self.figures.append(figureFile.name)
            # for pandasDF.plot to work well, need to close the figure, otherwise the same figure
            # will continued to be use across calls to pandasDF.plot.
            close = kwargs.get('close')
            if close is None or close:
                mpl.pyplot.close(input)
        elif type(input).__module__ == 'ggplot.ggplot' and type(input).__name__ == 'ggplot':
            # SC-10188: it's possible for ggplot import to fail due to dependency conflicts
            # caused by user-installed / upgraded libraries.  Therefore, we want to avoid triggering
            # ggplot imports in order to prevent display() from breaking for non-ggplot users.
            # The above condition is equivalent to `import ggplot; type(input) is ggplot.ggplot`.
            self.display(input.draw())
        elif type(input).__module__ == 'pandas.core.frame' and type(input).__name__ == 'DataFrame':
            # With Spark <2.0 we don't have a sparkSession, so let's guard against that just in case.
            if self.sparkSession is None:
                raise Exception('SparkSession is required for display(pandas.DataFrame).')
            self.display(self.sparkSession.createDataFrame(input))
        elif type(input).__module__ == 'databricks.koalas.frame' and type(
                input).__name__ == 'DataFrame':
            index_col = kwargs.get('index_col')
            self.display(input.to_spark(index_col=index_col), *args, **kwargs)
        elif type(input).__module__ == 'matplotlib.axes._subplots' and type(
                input).__name__ == 'AxesSubplot':
            self.display(input.figure)
        elif self.mlModelDisplayOn and type(input).__module__.startswith("pyspark.ml"):
            (mlModel, mlPlotType, displayRDD) = self.getMlUtils().display(input, *args, **kwargs)
            if mlModel:
                if self.enableListResults:
                    self.appendResults("mlModel", (mlModel, mlPlotType, displayRDD))
                else:
                    self.mlModel = mlModel
                    self.mlPlotType = mlPlotType
                    if displayRDD:
                        self.displayRDD = displayRDD
            else:
                raise Exception("ML model display does not yet support model type %s." \
                                % type(input))
        elif input is not None and "help" in dir(input):  # Is this object documented DBC-style?
            input.help()  # This is going to display the help as a side-effect
        elif input is not None and hasattr(input, '_repr_html_'):
            self.displayHTML(input._repr_html_())
        else:
            raise Exception(genericErrorMsg)

    def displayHTML(self, html):
        if self.enableListResults:
            self.appendResults("htmlSandbox", html)
        else:
            self.clearDisplay()
            self.htmlOutput = html

    def appendResults(self, type, data):
        assert self.enableListResults, "This method should only be called if enableListResults flag is on"
        # We flush and append any buffered stdout before appending the result.
        self.appendStdOut()
        self.listResults.append((type, data))

    def appendStdOut(self):
        # get the StdOut buffer and add to list results if not empty
        std_out = self.console_buffer.getvalue()
        if std_out:
            self.console_buffer.clear()
            self.listResults.append(("html", '<div class="ansiout">%s</div>' % ansi2html(std_out)))

    # TODO(hossein): when old getArgument is deprecated this can be removed
    def getAccessedArgs(self):
        return self.oldArgs.accessedArgs()

    def getExitVal(self):
        return self.exitVal

    def getDisplay(self):
        return self.displayRDD

    def getHTML(self):
        return self.htmlOutput or self.shell.output_html

    def getMLModel(self):
        return self.mlModel

    def getMLPlotType(self):
        return self.mlPlotType

    def getPlots(self):
        return ListConverter().convert(self.figures, self.sc._jvm._gateway_client)

    def flushConsoleBufferAndGetListResults(self):
        # we want to flush any last prints to std out and err
        if self.enableListResults:
            self.appendStdOut()
        return ListConverter().convert(self.listResults, self.sc._jvm._gateway_client)

    def addZippedFilePath(self, path):
        (dirname, filename) = os.path.split(path)
        self.sc.addClusterWideLibraryToPath(filename)

    def addIsolatedZippedLibraryPaths(self, addedLibs):
        for libName in addedLibs:
            self.sc.addIsolatedLibraryPath(libName)

    def setLocalProperty(self, key, value):
        self.sc.setLocalProperty(key, value)

    def setJobGroup(self, groupId, description, interruptible):
        self.currentJobGroup = groupId
        self.sc.setJobGroup(groupId, description, interruptible)

    def getReplClassLoader(self):
        return self.sc._jvm.Thread.currentThread().getContextClassLoader()

    def setReplClassLoader(self, java_class_loader):
        self.sc._jvm.Thread.currentThread().setContextClassLoader(java_class_loader)

    def cancelCurrentExecution(self):
        self.currentJobGroup = None
        self.executor.cancel()

    def getErrorBuffer(self):
        return self._get_buffer(self.error_buffer, clear=True)

    def getNewDatasetInfosJson(self):
        return self.shell.user_ns.get_new_dataframe_infos_json()

    class Java:
        implements = ['com.databricks.backend.daemon.driver.PythonShell']


class RemoteContext(SparkContext):
    def _initialize_context(self, conf):
        return self._gateway.entry_point.getSparkContext()


def _process_still_alive(pid):
    parent_exists = True
    try:
        # `kill -0` will not actually send any signal to the parent process, but the
        # result will tell us if the process exists.
        os.kill(pid, 0)
    except OSError as err:
        if err.errno == errno.ESRCH:
            # ESRCH = No such process --> the parent process was killed
            parent_exists = False
        elif err.errno == errno.EPERM:
            # EPERM = We don't have permission to send signals to the parent process
            # --> parent process still exists :)
            pass
        else:
            # We don't expect any other exceptions, so we should re-raise them
            raise
    return parent_exists


# copied from spark
def _daemonize_callback_server():
    """
    Hack Py4J to daemonize callback server

    The thread of callback server has daemon=False, it will block the driver
    from exiting if it's not shutdown. The following code replace `start()`
    of CallbackServer with a new version, which set daemon=True for this
    thread.

    Also, it will update the port number (0) with real port
    """
    # TODO (SC-28731): This is not required. See `daemonize` parameter for CallbackServer.
    import socket
    import py4j.java_gateway
    logger = py4j.java_gateway.logger
    from py4j.java_gateway import Py4JNetworkError
    from threading import Thread

    def start(self):
        """Starts the CallbackServer. This method should be called by the
        client instead of run()."""
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            self.server_socket.bind((self.address, self.port))
            if not self.port:
                # update port with real port
                self.port = self.server_socket.getsockname()[1]
        except Exception as e:
            msg = 'An error occurred while trying to start the callback server: %s' % e
            logger.exception(msg)
            raise Py4JNetworkError(msg)

        # Maybe thread needs to be cleanup up?
        self.thread = Thread(target=self.run)
        self.thread.daemon = True
        self.thread.start()

    py4j.java_gateway.CallbackServer.start = start


def set_up_mlflow_autologging(sc, entry_point):
    """
    Enables MLflow autologging for the REPL by default, if applicable.
    This "auto-autologging" capability is available on MLR 7.6+ and is gated by the
    `spark.databricks.mlflow.autologging.enabled` Spark configuration.
    """
    try:
        # Auto-autologging is only supported on MLR images (not DBR images or HLS images).
        # MLR *and* HLS images set the `MLR_PYTHONPATH` environment variable. Only HLS images set
        # the `DBNUCLEUS_HOME` environment variable. Accordingly, we determine whether or not
        # the driver / Python shell is running in MLR by checking for the *presence* of
        # `MLR_PYTHONPATH` and the *absence* of `DBNUCLEUS_HOME`
        is_supported_runtime = "MLR_PYTHONPATH" in os.environ and "DBNUCLEUS_HOME" not in os.environ
        autologging_is_enabled_on_cluster = sc._conf.get(
            'spark.databricks.mlflow.autologging.enabled', 'false') == 'true'

        if is_supported_runtime and autologging_is_enabled_on_cluster:
            import mlflow
            if LooseVersion(mlflow.__version__) >= LooseVersion("1.13.0"):
                mlflow.autolog(disable=False, exclusive=True)

                from mlflow.utils.autologging_utils import AutologgingEventLogger
                from DatabricksAutologgingEventLogger import DatabricksAutologgingEventLogger
                AutologgingEventLogger.set_logger(DatabricksAutologgingEventLogger(
                    entry_point.getLogger())
                )
    except Exception as e:
        print(
            "PythonShellImpl.py: Unexpected internal error when"
            " setting up MLflow autologging: {e}".format(e=e),
            file=stderr
        )


def get_existing_gateway(jvm_port, auto_convert, auth_token, pinned_mode):
    # It is assumed a Py4j gateway is already running, so we will attempt to
    # connect to it

    if pinned_mode:
        gateway = clientserver.ClientServer(
            java_parameters=clientserver.JavaParameters(
                port=jvm_port,
                auth_token=auth_token,
                auto_convert=auto_convert,
                auto_close=True,
                eager_load=True,
                daemonize_memory_management=True),
            python_parameters=clientserver.PythonParameters(
                port=0,
                auth_token=auth_token,
                eager_load=True,
                daemonize=True,
                daemonize_connections=True))
        port = gateway.get_callback_server().get_listening_port()
    else:
        # TODO(SC-28731): Set daemonize and remove _daemonize_callback_server() hack.
        _daemonize_callback_server()
        gatewayparams = GatewayParameters(port=jvm_port, auto_close=True, auth_token=auth_token)
        gateway = JavaGateway(
            GatewayClient(gateway_parameters=gatewayparams),
            auto_convert=auto_convert,
            start_callback_server=True,
            python_proxy_port=0)
        gateway._python_proxy_port = port = gateway._callback_server.port

    print(time.asctime(), 'Initialized gateway on port', port, file=stderr)

    # update the port of CallbackClient with real port
    gateway.entry_point.updatePythonProxyPort(port)

    # The reason to set this here is that pyspark/context.py requires the auth token to be set
    # in gateway_parameters.auth_token. This is subsequently used to validate client conns.
    gateway.gateway_parameters.auth_token = auth_token

    # Import the classes used by PySpark
    java_import(gateway.jvm, "org.apache.spark.SparkConf")
    java_import(gateway.jvm, "org.apache.spark.api.java.*")
    java_import(gateway.jvm, "org.apache.spark.api.python.*")
    java_import(gateway.jvm, "org.apache.spark.ml.python.*")
    java_import(gateway.jvm, "org.apache.spark.mllib.api.python.*")
    java_import(gateway.jvm, "scala.Tuple2")
    java_import(gateway.jvm, "org.apache.spark.sql.*")
    java_import(gateway.jvm, "org.apache.spark.sql.api.python.*")
    java_import(gateway.jvm, "org.apache.spark.sql.hive.*")

    return gateway


def _test_console():
    c = ConsoleBuffer(0)
    for i in range(100):
        c.write(' ' * 1023)
        c.write('\n')
    assert len(c.getvalue()) == 100 * 1024

    c = ConsoleBuffer(1000 * 10)
    for i in range(100):
        c.write(' ' * 1023)
        c.write('\n')
    s = c.getvalue()
    assert 1000 * 9 < len(s) < 1000 * 11
    assert " skipped " in s


def launch_process():
    if len(sys.argv) < 4:
        _test_console()
        sys.exit(0)

    # TODO (SC-28731): Use argparse
    gw_port = int(sys.argv[1])
    memoryLimit = int(sys.argv[2])
    buffLimit = int(sys.argv[3])
    parentPid = int(sys.argv[4])
    guid = sys.argv[5]
    # This is spark version.
    version = sys.argv[6]
    auth_token = sys.argv[7]
    pinned_mode = sys.argv[8] == "pinned"

    currentPid = os.getpid()
    print(time.asctime(), "Python shell started with PID ", currentPid,\
        " and guid ", guid, file=stderr)
    gateway = get_existing_gateway(
        jvm_port=gw_port,
        auto_convert=version >= '1.4',
        auth_token=auth_token,
        pinned_mode=pinned_mode)
    conf = SparkConf(_jconf=gateway.entry_point.getSparkConf())
    sc = RemoteContext(gateway=gateway, conf=conf)
    if sc.version < '3.0':
        from pyspark.sql import HiveContext
        sqlContext = HiveContext(sc, gateway.entry_point.getSQLContext())
    else:
        from pyspark.sql import SQLContext
        from pyspark.sql.session import SparkSession
        # Hive context is depracted in spark 2.0.0, and removed in open source pyspark.
        # Inline code of removed HiveContext
        jsqlContext = gateway.entry_point.getSQLContext()
        sqlContext = SQLContext(sc, SparkSession(sc, jsqlContext.sparkSession()), jsqlContext)
    if (version >= '2.0'):
        # If Spark is 2.0 or a higher version, we create a spark object
        # for SparkSession.
        sparkSession = sqlContext.sparkSession
    else:
        sparkSession = None
    console_buffer = ConsoleBuffer(
        buffLimit,
        # Python 2 and Python 3 have different implementations of sys.stdout. Basically you
        # can only write string but not byte array to sys.stdout in Python 3. This getattr()
        # returns sys.stdout.buffer in Python 3 so that we can write byte array to it.
        getattr(sys.stdout, 'buffer', sys.stdout))
    error_buffer = ConsoleBuffer(
        buffLimit,
        # Python 2 and Python 3 have different implementations of sys.stderr. Basically you
        # can only write string but not byte array to sys.stderr in Python 3. This getattr()
        # returns sys.stderr.buffer in Python 3 so that we can write byte array to it.
        getattr(sys.stderr, 'buffer', sys.stderr))
    shell = PythonShell(sc, sqlContext, sparkSession, parentPid, guid, gateway.entry_point,
                        console_buffer, error_buffer)
    gateway.entry_point.setInterp(guid, shell)
    # Set up the MLflow "auto-autologging" feature if applicable; this must occur after the REPL
    # has a handle to the shell (i.e. after `setInterp()` is called) in order for Spark datasource
    # autologging to function properly
    set_up_mlflow_autologging(sc, gateway.entry_point)
    # install default handler for SIGINT, it maybe changed by others
    signal.signal(signal.SIGINT, signal.default_int_handler)
    if memoryLimit:
        # limit the total virtual memory
        resource.setrlimit(resource.RLIMIT_AS, (memoryLimit << 20, memoryLimit << 20))
    print(time.asctime(), "Python shell executor start", file=stderr)
    shell.executor.run()