#!/usr/bin/env python

#
# Copyright (C) 2021 Databricks, Inc.
#
# Licensed under the Databricks License;
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://github.com/databricks-industry-solutions/pixels/blob/main/LICENSE
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
from __future__ import print_function

import sys
from io import open
from os import path

from setuptools import setup

with open("requirements.txt") as f:
    required = f.read().splitlines()

DESCRIPTION = "Pixels: pyspark dataframes for image (and object) processing"

this_directory = path.abspath(path.dirname(__file__))
with open(path.join(this_directory, "README.md"), encoding="utf-8") as f:
    LONG_DESCRIPTION = f.read()

try:
    exec(open("dbx/pixels/version.py").read())
except IOError:
    print(
        "Failed to load pixels version file for packaging. You must be in pixels root dir.",
        file=sys.stderr,
    )
    sys.exit(-1)
VERSION = __version__  # noqa

from setuptools import find_packages

setup(
    name="databricks-pixels",
    author="Databricks",
    author_email="pixels@databricks.com",
    license="https://github.com/databricks-industry-solutions/pixels/blob/main/LICENSE",
    url="https://github.com/databricks-industry-solutions/pixels",
    project_urls={
        "Bug Tracker": "https://github.com/databricks-industry-solutions/pixels/issues",
        "Documentation": "https://databricks-pixels.readthedocs.io/",
        "Source Code": "https://github.com/databricks-industry-solutions/pixels",
    },
    description=DESCRIPTION,
    long_description=LONG_DESCRIPTION,
    long_description_content_type="text/markdown",
    version=VERSION,
    packages=find_packages(),
    platforms=["any"],
    python_requires=">=3.10",
    use_scm_version={
        "write_to": "dbx/pixels/version.py",
        "fallback_version": "0.0.0",
        "local_scheme": "no-local-version",
    },
    setup_requires=["setuptools_scm"],
    install_requires=required,
    package_data={"databricks": ["pixels/resources/*"]},
    extras_require={
        "dev": [
            "pyspark==3.4.1",
            "databricks-connect==13.3.0",
            "databricks-sdk==0.12.0",
            "autoflake",
            "black",
            "isort",
            "mypy>=0.990",
            "pdoc",
            "pre-commit",
            "coverage[toml]>=6.5",
            "pytest",
            "pytest-cov>=4.0.0,<5.0.0",
            "pytest-mock>=3.0.0,<4.0.0",
        ],
    },
)
