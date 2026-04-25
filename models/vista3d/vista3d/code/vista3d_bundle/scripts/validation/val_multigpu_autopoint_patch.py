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

from __future__ import annotations

import copy
import glob
import json
import logging
import os
import sys
from datetime import timedelta
from functools import partial
from typing import Optional, Sequence, Union

import monai
import numpy as np
import torch
import torch.distributed as dist
from monai import transforms
from monai.apps.auto3dseg.auto_runner import logger
from monai.auto3dseg.utils import datafold_read
from monai.bundle import ConfigParser
from monai.bundle.scripts import _pop_args, _update_args
from monai.data import DataLoader, partition_dataset
from monai.metrics import compute_dice
from monai.utils import set_determinism
from torch.cuda.amp import autocast
from torch.nn.parallel import DistributedDataParallel

from ..sliding_window import sliding_window_inference
from ..train import CONFIG, infer_wrapper
from ..utils.trans_utils import VistaPostTransform
from .build_vista3d_eval_only import vista_model_registry


def run(config_file: Optional[Union[str, Sequence[str]]] = None, **override):
    # Initialize distributed and scale parameters based on GPU memory
    if torch.cuda.device_count() > 1:
        dist.init_process_group(
            backend="nccl", init_method="env://", timeout=timedelta(seconds=3600)
        )
        world_size = dist.get_world_size()
        dist.barrier()
    else:
        world_size = 1

    logging.basicConfig(stream=sys.stdout, level=logging.INFO)

    if isinstance(config_file, str) and "," in config_file:
        config_file = config_file.split(",")

    _args = _update_args(config_file=config_file, **override)
    config_file_ = _pop_args(_args, "config_file")[0]

    parser = ConfigParser()
    parser.read_config(config_file_)
    parser.update(pairs=_args)

    amp = parser.get_parsed_content("amp")
    data_file_base_dir = parser.get_parsed_content("data_file_base_dir")
    data_list_file_path = parser.get_parsed_content("data_list_file_path")
    ckpt = parser.get_parsed_content("ckpt")
    fold = parser.get_parsed_content("fold")
    patch_size = parser.get_parsed_content("patch_size")
    model_registry = parser.get_parsed_content("model")
    input_channels = parser.get_parsed_content("input_channels")
    label_set = parser.get_parsed_content("label_set", default=None)
    val_auto = parser.get_parsed_content("val_auto", default=False)
    argmax_first = parser.get_parsed_content("argmax_first", default=True)
    five_fold = parser.get_parsed_content("five_fold", default=True)
    mapped_label_set = parser.get_parsed_content(
        "mapped_label_set", default=copy.deepcopy(label_set)
    )
    transforms_infer = parser.get_parsed_content("transforms_infer")
    list_key = parser.get_parsed_content("list_key", default="testing")
    """ start_prompt and end_prompt are used to save memory. For 117 class prompts, it will go oom. Use these two to limit
    the prompt number and run the scripts multiple times to cover 117 classes.
    """
    start_prompt = parser.get_parsed_content("start_prompt", default=None)
    end_prompt = parser.get_parsed_content("end_prompt", default=None)
    dataset_name = parser.get_parsed_content("dataset_name", default=None)
    if label_set is None:
        label_mapping = parser.get_parsed_content(
            "label_mapping", default="./data/jsons/label_mappings.json"
        )

        with open(label_mapping, "r") as f:
            label_mapping = json.load(f)
        label_set = [_xx[0] for _xx in label_mapping[dataset_name]]
        mapped_label_set = [_xx[1] for _xx in label_mapping[dataset_name]]
        if start_prompt is not None:
            # this is used for dataset like totalseg with large number of prompts.
            label_set = label_set[start_prompt:end_prompt]
            mapped_label_set = mapped_label_set[start_prompt:end_prompt]

        label_set = [0] + label_set
        mapped_label_set = [0] + mapped_label_set
        if dataset_name == "Task07" or dataset_name == "Task03":
            # disable argmax if there is overlap.
            argmax_first = False
        if dataset_name == "Bone-NIH":
            mapped_label_set = mapped_label_set[:-1]
            label_set = label_set[:-1]

    random_seed = parser.get_parsed_content("random_seed", default=0)
    if random_seed is not None and (
        isinstance(random_seed, int) or isinstance(random_seed, float)
    ):
        set_determinism(seed=random_seed)

    CONFIG["handlers"]["file"]["filename"] = parser.get_parsed_content(
        "log_output_file"
    )
    logging.config.dictConfig(CONFIG)
    logging.getLogger("torch.distributed.distributed_c10d").setLevel(logging.WARNING)
    logger.debug(f"Number of GPUs: {torch.cuda.device_count()}")
    logger.debug(f"World_size: {world_size}")
    logger.debug(f"Validation using auto: {val_auto}")
    if five_fold:
        train_files, val_files = datafold_read(
            datalist=data_list_file_path,
            basedir=data_file_base_dir,
            fold=fold,
            key="training",
        )
        test_files, _ = datafold_read(
            datalist=data_list_file_path,
            basedir=data_file_base_dir,
            fold=-1,
            key="testing",
        )
    else:
        train_files, _ = datafold_read(
            datalist=data_list_file_path,
            basedir=data_file_base_dir,
            fold=-1,
            key="training",
        )
        val_files, _ = datafold_read(
            datalist=data_list_file_path,
            basedir=data_file_base_dir,
            fold=-1,
            key="validation",
        )
        test_files, _ = datafold_read(
            datalist=data_list_file_path,
            basedir=data_file_base_dir,
            fold=-1,
            key="testing",
        )
    process_dict = {
        "training": train_files,
        "validation": val_files,
        "testing": test_files,
        "all": train_files + val_files + test_files,
    }
    process_files = process_dict[list_key]

    save_metric = parser.get_parsed_content("save_metric", default=False)
    if save_metric:
        output_dirs = os.path.join(
            os.path.dirname(parser.get_parsed_content("log_output_file")), dataset_name
        )
        os.makedirs(output_dirs, exist_ok=True)
        generated_files = glob.glob(os.path.join(output_dirs, "*.json"))
        _process_files = []
        for i in process_files:
            not_finished = True
            for j in generated_files:
                if j.split(".json")[0].split("/")[-1] in i["image"]:
                    not_finished = False
                    break
            if not_finished:
                _process_files.append(i)
        logger.info(f"{len(_process_files)} is remained out from {len(process_files)}")
        print(f"{len(_process_files)} is remained out from {len(process_files)}")
        process_files = _process_files

    for i in range(len(process_files)):
        if (
            isinstance(process_files[i]["image"], list)
            and len(process_files[i]["image"]) > 1
        ):
            process_files[i]["image"] = process_files[i]["image"][0]
    if torch.cuda.device_count() == 1 or dist.get_rank() == 0:
        print(f"Total files {len(process_files)}")
        print(process_files)
    overlap = parser.get_parsed_content("overlap", default=0.0)
    if torch.cuda.device_count() > 1:
        process_files = partition_dataset(
            data=process_files,
            shuffle=False,
            num_partitions=world_size,
            even_divisible=False,
        )[dist.get_rank()]
    logger.debug(f"Val_files: {len(process_files)}")
    val_ds = monai.data.Dataset(data=process_files, transform=transforms_infer)
    val_loader = DataLoader(
        val_ds,
        num_workers=parser.get_parsed_content("num_workers_validation", default=2),
        batch_size=1,
        shuffle=False,
    )

    device = (
        torch.device(f"cuda:{os.environ['LOCAL_RANK']}")
        if world_size > 1
        else torch.device("cuda:0")
    )

    model = vista_model_registry[model_registry](
        in_channels=input_channels, image_size=patch_size
    )

    model = model.to(device)

    if torch.cuda.device_count() > 1:
        model = torch.nn.SyncBatchNorm.convert_sync_batchnorm(model)

    post_transform = transforms.Invertd(
        keys="pred",
        transform=transforms_infer,
        orig_keys="image",
        meta_keys="pred_meta_dict",
        orig_meta_keys="image_meta_dict",
        meta_key_postfix="meta_dict",
        nearest_interp=True,
        to_tensor=True,
    )

    post_pred = transforms.AsDiscrete(threshold=0.0, dtype=torch.uint8)

    if torch.cuda.device_count() > 1:
        model = DistributedDataParallel(
            model, device_ids=[device], find_unused_parameters=True
        )

    if torch.cuda.device_count() > 1:
        model.module.load_state_dict(
            torch.load(ckpt, map_location=device), strict=False
        )
    else:
        model.load_state_dict(torch.load(ckpt, map_location=device), strict=False)

    model.eval()
    metric_dim = len(label_set) - 1
    model_inferer = partial(infer_wrapper, model=model)
    with torch.no_grad():
        metric = torch.zeros(metric_dim * 2, dtype=torch.float, device=device)
        _index = 0
        _final_count = 0
        for val_data in val_loader:
            if dataset_name == "Bone-NIH":
                val_data["label_gt"][val_data["label_gt"] == 2] = 1
                val_data["label"][val_data["label"] == 2] = 1
            val_filename = val_data["image"].meta["filename_or_obj"][0]
            _index += 1
            with autocast(enabled=amp):
                val_outputs = None
                torch.cuda.empty_cache()
                for _device_in, _device_out in zip(
                    [device, device, "cpu"], [device, "cpu", "cpu"]
                ):
                    try:
                        with autocast(enabled=amp):
                            val_outputs = None
                            torch.cuda.empty_cache()
                            val_outputs = sliding_window_inference(
                                inputs=val_data["image"].to(_device_in),
                                roi_size=patch_size,
                                sw_batch_size=1,
                                predictor=model_inferer,
                                mode="gaussian",
                                overlap=overlap,
                                sw_device=device,
                                device=_device_out,
                                point_coords=None,
                                point_labels=None,
                                class_vector=torch.tensor(mapped_label_set)
                                .to(device)
                                .unsqueeze(0),
                                prompt_class=torch.tensor(label_set)
                                .to(device)
                                .unsqueeze(0),
                                labels=val_data["label"].to(_device_in),
                                label_set=label_set,
                                merge_with_trial=True,
                            )
                            finished = True
                            skipped = False
                    except RuntimeError as e:
                        if not any(
                            x in str(e).lower() for x in ("memory", "cuda", "cudnn")
                        ):
                            raise e
                        logger.warning(e)
                        finished = False
                        skipped = True

                    if finished:
                        break
                if skipped:
                    logger.debug(
                        f"{_index} / {len(val_loader)} / {val_filename}: skipped due to OOM with size {val_data['image'].shape}"
                    )
                    continue
            value = torch.full((1, metric_dim), float("nan")).to(device)
            if not skipped:
                if argmax_first:
                    try:
                        try:
                            val_outputs = VistaPostTransform(keys="pred")(
                                {
                                    "image": val_data["image"][0],
                                    "pred": val_outputs[0],
                                    "label_prompt": label_set,
                                }
                            )
                            val_outputs = post_transform(val_outputs)["pred"][None, ...]
                        except BaseException:
                            val_outputs = VistaPostTransform(keys="pred")(
                                {
                                    "image": val_data["image"][0].cpu(),
                                    "pred": val_outputs[0].cpu(),
                                    "label_prompt": label_set,
                                }
                            )
                            val_outputs = post_transform(val_outputs)["pred"][None, ...]
                        for i in range(1, len(label_set)):
                            gt = (
                                val_data["label_gt"].to(val_outputs.device)
                                == label_set[i]
                            )
                            ypred = val_outputs == label_set[i]
                            value[0, i - 1] = compute_dice(
                                y_pred=ypred, y=gt, include_background=False
                            )
                        _final_count += 1
                    except BaseException:
                        logger.debug(
                            f"{_index} / {len(val_loader)} / {val_filename}: Shape mismatch or OOM in postransform"
                        )
                        value = torch.full((1, metric_dim), float("nan")).to(device)
                else:
                    try:
                        val_outputs = post_pred(val_outputs[0])[None, ...]
                        try:
                            val_outputs = post_transform(
                                {"image": val_data["image"][0], "pred": val_outputs[0]}
                            )["pred"][None, ...]
                        except BaseException:
                            val_outputs = post_transform(
                                {
                                    "image": val_data["image"][0].cpu(),
                                    "pred": val_outputs[0].cpu(),
                                }
                            )["pred"][None, ...]
                        for i in range(1, len(label_set)):
                            gt = (
                                val_data["label_gt"].to(val_outputs.device)
                                == label_set[i]
                            )
                            y_pred = val_outputs[:, [i]]
                            if i == 1 and (
                                dataset_name == "Task07" or dataset_name == "Task03"
                            ):
                                y_pred = torch.logical_and(
                                    y_pred > 0.5, val_outputs[:, [i + 1]] < 0.5
                                )
                            value[0, i - 1] = compute_dice(
                                y_pred, y=gt, include_background=False
                            )
                        _final_count += 1
                        if save_metric:
                            output_json_path = os.path.join(
                                output_dirs,
                                os.path.dirname(val_filename).split("/")[-1] + ".json",
                            )
                            with open(output_json_path, "w") as f:
                                json.dump(value[0].cpu().numpy().tolist(), f)
                    except BaseException:
                        logger.debug(
                            f"{_index} / {len(val_loader)} / {val_filename}: Shape mismatch or OOM in postransform"
                        )
                        value = torch.full((1, metric_dim), float("nan")).to(device)
            val_outputs, val_data = None, None
            torch.cuda.empty_cache()
            print(f"{_index} / {len(val_loader)} / {val_filename}: {value}")
            logger.debug(f"{_index} / {len(val_loader)} / {val_filename}: {value}")
            for _c in range(metric_dim):
                val0 = torch.nan_to_num(value[0, _c], nan=0.0)
                val1 = 1.0 - torch.isnan(value[0, _c]).float()
                metric[2 * _c] += val0
                metric[2 * _c + 1] += val1

        if torch.cuda.device_count() > 1:
            dist.all_reduce(metric, op=torch.distributed.ReduceOp.SUM)

        metric = metric.tolist()
        metric_class = np.zeros(metric_dim)
        if torch.cuda.device_count() == 1 or dist.get_rank() == 0:
            avg_metric = 0
            valid = 0
            for _c in range(metric_dim):
                if metric[2 * _c + 1] > 0:
                    v = metric[2 * _c] / metric[2 * _c + 1]
                    avg_metric += v
                    valid += 1
                else:
                    v = torch.nan
                metric_class[_c] = v
                try:
                    logger.debug(f"Evaluation metric - class {_c + 1} : {v:.4f}")
                except BaseException:
                    logger.debug(f"Evaluation metric - class {_c + 1} : {v:.4f}")
            avg_metric = avg_metric / valid
            print(f"Avg_metric: {avg_metric}")
            logger.debug(f"Avg_metric: {avg_metric}")

    torch.cuda.empty_cache()
    if torch.cuda.device_count() > 1:
        dist.barrier()
        logger.debug(f"Final Evaluated Cases {_final_count}")
        dist.destroy_process_group()

    return


if __name__ == "__main__":
    from monai.utils import optional_import

    fire, _ = optional_import("fire")
    fire.Fire()
