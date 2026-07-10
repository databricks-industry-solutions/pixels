# Copyright (c) MONAI Consortium
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#     http://www.apache.org/licenses/LICENSE-2.0
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import glob
import os
import unittest

from monai.apps.utils import get_logger
from monai.bundle import ConfigParser


class TestConfig(unittest.TestCase):
    def test_vista3d_configs_parsing(self):
        config_dir = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "configs"
        )
        get_logger("TestConfig").info(config_dir)

        configs = glob.glob(os.path.join(config_dir, "**", "*.yaml"), recursive=True)
        for x in configs:
            parser = ConfigParser()
            parser.read_config(x)
            keys = sorted(parser.config.keys())
            # verify parser key fetching
            get_logger("TestConfig").info(
                f"{parser[keys[0]]}, {keys[0]}, {parser[keys[-1]]}, {keys[-1]}"
            )


if __name__ == "__main__":
    unittest.main()
