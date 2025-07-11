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

import json
import logging
import os
from typing import Dict

import lib.configs
from lib.activelearning import Last
from lib.infers.deepgrow_pipeline import InferDeepgrowPipeline
from lib.infers.vertebra_pipeline import InferVertebraPipeline

import monailabel
from monailabel.interfaces.app import MONAILabelApp
from monailabel.interfaces.config import TaskConfig
from monailabel.interfaces.datastore import Datastore
from monailabel.interfaces.tasks.infer_v2 import InferTask
from monailabel.interfaces.tasks.scoring import ScoringMethod
from monailabel.interfaces.tasks.strategy import Strategy
from monailabel.interfaces.tasks.train import TrainTask
from monailabel.scribbles.infer import GMMBasedGraphCut, HistogramBasedGraphCut
from monailabel.tasks.activelearning.first import First
from monailabel.tasks.activelearning.random import Random

# bundle
from monailabel.tasks.infer.bundle import BundleInferTask
from monailabel.tasks.train.bundle import BundleTrainTask
from monailabel.utils.others.class_utils import get_class_names
from monailabel.utils.others.generic import get_bundle_models, strtobool
from monailabel.utils.others.planner import HeuristicPlanner

logger = logging.getLogger(__name__)

class DBMONAILabelApp(MONAILabelApp):
    def __init__(self, app_dir, studies, conf):
        self.model_dir = os.path.join(app_dir, "model")

        configs = {}
        for c in get_class_names(lib.configs, "TaskConfig"):
            name = c.split(".")[-2].lower()
            configs[name] = c

        configs = {k: v for k, v in sorted(configs.items())}
        print(configs)

        # Load models from bundle config files, local or released in Model-Zoo, e.g., --conf bundles <spleen_ct_segmentation>
        self.bundles = get_bundle_models(app_dir, conf, conf_key="bundles") if conf.get("bundles") else None

        # Use Heuristic Planner to determine target spacing and spatial size based on dataset+gpu
        spatial_size = json.loads(conf.get("spatial_size", "[48, 48, 32]"))
        target_spacing = json.loads(conf.get("target_spacing", "[1.0, 1.0, 1.0]"))
        self.heuristic_planner = strtobool(conf.get("heuristic_planner", "false"))
        self.planner = HeuristicPlanner(spatial_size=spatial_size, target_spacing=target_spacing)

        # Can be configured with --conf scribbles false or true
        self.scribbles = conf.get("scribbles", "false") == "true"

        # Load models from app model implementation, e.g., --conf models <segmentation_spleen>
        models = conf.get("models")
        if not models:
            print("")
            print("---------------------------------------------------------------------------------------")
            print("Provide --conf models <name>")
            print("Following are the available models.  You can pass comma (,) seperated names to pass multiple")
            print(f"    all, {', '.join(configs.keys())}")
            print("---------------------------------------------------------------------------------------")
            print("")
            models = []
            #exit(-1)
        else:
            models = models.split(",")
            models = [m.strip() for m in models]
            invalid = [m for m in models if m != "all" and not configs.get(m)]
            if invalid:
                print("")
                print("---------------------------------------------------------------------------------------")
                print(f"Invalid Model(s) are provided: {invalid}")
                print("Following are the available models.  You can pass comma (,) seperated names to pass multiple")
                print(f"    all, {', '.join(configs.keys())}")
                print("---------------------------------------------------------------------------------------")
                print("")
                exit(-1)

        # app models
        self.models: Dict[str, TaskConfig] = {}
        for n in models:
            for k, v in configs.items():
                if self.models.get(k):
                    continue
                if n == k or n == "all":
                    logger.info(f"+++ Adding Model: {k} => {v}")
                    self.models[k] = eval(f"{v}()")
                    self.models[k].init(k, self.model_dir, conf, self.planner)
        logger.info(f"+++ Using Models: {list(self.models.keys())}")

        super().__init__(
            app_dir=app_dir,
            studies=studies,
            conf=conf,
            name=f"MONAILabel - Radiology ({monailabel.__version__})",
            description="DeepLearning models for radiology",
            version=monailabel.__version__,
        )

    def init_datastore(self) -> Datastore:
        datastore = super().init_datastore()
        if self.heuristic_planner:
            self.planner.run(datastore)
        return datastore

    def init_infers(self) -> Dict[str, InferTask]:
        infers: Dict[str, InferTask] = {}

        #################################################
        # Models
        #################################################
        for n, task_config in self.models.items():
            c = task_config.infer()
            c = c if isinstance(c, dict) else {n: c}
            for k, v in c.items():
                logger.info(f"+++ Adding Inferer:: {k} => {v}")
                infers[k] = v

        #################################################
        # Bundle Models
        #################################################
        if self.bundles:
            for n, b in self.bundles.items():
                i = BundleInferTask(b, self.conf)
                logger.info(f"+++ Adding Bundle Inferer:: {n} => {i}")
                infers[n] = i

        #################################################
        # Scribbles
        #################################################
        if self.scribbles:
            infers.update(
                {
                    "Histogram+GraphCut": HistogramBasedGraphCut(
                        intensity_range=(-300, 200, 0.0, 1.0, True),
                        pix_dim=(2.5, 2.5, 5.0),
                        lamda=1.0,
                        sigma=0.1,
                        num_bins=64,
                        labels=task_config.labels,
                    ),
                    "GMM+GraphCut": GMMBasedGraphCut(
                        intensity_range=(-300, 200, 0.0, 1.0, True),
                        pix_dim=(2.5, 2.5, 5.0),
                        lamda=5.0,
                        sigma=0.5,
                        num_mixtures=20,
                        labels=task_config.labels,
                    ),
                }
            )

        #################################################
        # Pipeline based on existing infers
        #################################################
        if infers.get("deepgrow_2d") and infers.get("deepgrow_3d"):
            infers["deepgrow_pipeline"] = InferDeepgrowPipeline(
                path=self.models["deepgrow_2d"].path,
                network=self.models["deepgrow_2d"].network,
                model_3d=infers["deepgrow_3d"],
                description="Combines Clara Deepgrow 2D and 3D models",
            )

        #################################################
        # Pipeline based on existing infers for vertebra segmentation
        # Stages:
        # 1/ localization spine
        # 2/ localization vertebra
        # 3/ segmentation vertebra
        #################################################
        if (
            infers.get("localization_spine")
            and infers.get("localization_vertebra")
            and infers.get("segmentation_vertebra")
        ):
            infers["vertebra_pipeline"] = InferVertebraPipeline(
                task_loc_spine=infers["localization_spine"],  # first stage
                task_loc_vertebra=infers["localization_vertebra"],  # second stage
                task_seg_vertebra=infers["segmentation_vertebra"],  # third stage
                description="Combines three stage for vertebra segmentation",
            )
        logger.info(infers)
        return infers

    def init_trainers(self) -> Dict[str, TrainTask]:
        trainers: Dict[str, TrainTask] = {}
        if strtobool(self.conf.get("skip_trainers", "false")):
            return trainers
        #################################################
        # Models
        #################################################
        for n, task_config in self.models.items():
            t = task_config.trainer()
            if not t:
                continue

            logger.info(f"+++ Adding Trainer:: {n} => {t}")
            trainers[n] = t

        #################################################
        # Bundle Models
        #################################################
        if self.bundles:
            for n, b in self.bundles.items():
                t = BundleTrainTask(b, self.conf)
                if not t or not t.is_valid():
                    continue

                logger.info(f"+++ Adding Bundle Trainer:: {n} => {t}")
                trainers[n] = t

        return trainers

    def init_strategies(self) -> Dict[str, Strategy]:
        strategies: Dict[str, Strategy] = {
            "random": Random(),
            "first": First(),
            "last": Last(),
        }

        if strtobool(self.conf.get("skip_strategies", "true")):
            return strategies

        for n, task_config in self.models.items():
            s = task_config.strategy()
            if not s:
                continue
            s = s if isinstance(s, dict) else {n: s}
            for k, v in s.items():
                self.logger.info(f"+++ Adding Strategy:: {k} => {v}")
                strategies[k] = v

        logger.info(f"Active Learning Strategies:: {list(strategies.keys())}")
        return strategies

    def init_scoring_methods(self) -> Dict[str, ScoringMethod]:
        methods: Dict[str, ScoringMethod] = {}
        if strtobool(self.conf.get("skip_scoring", "true")):
            return methods

        for n, task_config in self.models.items():
            s = task_config.scoring_method()
            if not s:
                continue
            s = s if isinstance(s, dict) else {n: s}
            for k, v in s.items():
                self.logger.info(f"+++ Adding Scoring Method:: {k} => {v}")
                methods[k] = v

        logger.info(f"Active Learning Scoring Methods:: {list(methods.keys())}")
        return methods