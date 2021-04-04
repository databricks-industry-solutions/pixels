#!/usr/bin/env python

#
# Copyright (C) 2021 Databricks, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
from __future__ import print_function

from io import open
import sys
from setuptools import setup
from os import path

import os
with open('requirements.txt') as f:
    required = f.read().splitlines()

DESCRIPTION = "Pixels: pyspark dataframes for image (and object) processing"

this_directory = path.abspath(path.dirname(__file__))
with open(path.join(this_directory, 'README.md'), encoding='utf-8') as f:
    LONG_DESCRIPTION = f.read()

try:
    exec(open('databricks/pixels/version.py').read())
except IOError:
    print("Failed to load pixels version file for packaging. You must be in pixels root dir.",
          file=sys.stderr)
    sys.exit(-1)
VERSION = __version__  # noqa

import setuptools
from setuptools import find_packages



setup(
    name='databricks-pixels',
    version=VERSION,
    packages=find_packages(),
    platforms=['any'],
    python_requires='>=3.7',
    install_requires=required,
    author="Databricks",
    author_email="pixels@databricks.com",
    license='http://www.apache.org/licenses/LICENSE-2.0',
    url="https://github.com/databrickslabs/pixel",
    project_urls={
        'Bug Tracker': 'https://github.com/databrickslabs/pixels/issues',
        'Documentation': 'https://databricks-pixels.readthedocs.io/',
        'Source Code': 'https://github.com/databrickslabs/pixels'
    },
    description=DESCRIPTION,
    long_description=LONG_DESCRIPTION,
    long_description_content_type='text/markdown',
)