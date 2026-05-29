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

import json
import logging
import os
import sys
from datetime import timedelta
from functools import partial
from typing import Optional, Sequence, Union

import monai
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

from vista3d import vista_model_registry

from ..sliding_window import sliding_window_inference
from ..train import CONFIG, infer_wrapper
from ..utils.workflow_utils import generate_prompt_pairs_val, get_next_points_val


def run(config_file: Optional[Union[str, Sequence[str]]] = None, **override):
    # Initialize distributed and scale parameters based on GPU memory
    if torch.cuda.device_count() > 1:
        dist.init_process_group(
            backend="nccl", init_method="env://", timeout=timedelta(seconds=10000)
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
    transforms_infer = parser.get_parsed_content("transforms_infer")
    list_key = parser.get_parsed_content("list_key", default="testing")
    five_fold = parser.get_parsed_content("five_fold", default=True)
    remove_out = parser.get_parsed_content("remove_out", default=True)
    use_center = parser.get_parsed_content("use_center", default=True)
    MAX_ITER = parser.get_parsed_content("max_iter", default=10)

    if label_set is None:
        label_mapping = parser.get_parsed_content(
            "label_mapping", default="./data/jsons_final_update/label_mappings.json"
        )
        dataset_name = parser.get_parsed_content("dataset_name", default=None)
        with open(label_mapping, "r") as f:
            label_mapping = json.load(f)
        label_set = [0] + [_xx[0] for _xx in label_mapping[dataset_name]]

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
        nearest_interp=False,
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
    max_iters = MAX_ITER
    metric_dim = len(label_set) - 1
    model_inferer = partial(infer_wrapper, model=model)
    log_string = []
    with torch.no_grad():
        obj_num = len(val_loader)
        if torch.cuda.device_count() > 1:
            size_tensor = torch.tensor(obj_num, device=device)
            output_tensor = [torch.zeros_like(size_tensor) for _ in range(world_size)]
            dist.barrier()
            dist.all_gather(output_tensor, size_tensor)
            # total_size_tensor = sum(output_tensor)
            obj_num = max(output_tensor)
        metric = (
            torch.zeros(
                obj_num, metric_dim, max_iters, dtype=torch.float, device=device
            )
            + torch.nan
        )
        point_num = (
            torch.zeros(obj_num, metric_dim, dtype=torch.float, device=device)
            + torch.nan
        )
        _index = 0
        for val_data in val_loader:
            val_filename = val_data["image"].meta["filename_or_obj"][0]
            _index += 1

            val_outputs = None
            for idx in range(max_iters):
                if idx == 0:
                    point, point_label = generate_prompt_pairs_val(
                        val_data["label"].to(device),
                        label_set,
                        max_ppoint=1,
                        use_center=use_center,
                    )
                    point = point.to(device)
                    point_label = point_label.to(device)
                else:
                    # val_outputs is from model_inferer which moved the batch_dim to 0.
                    _point, _point_label = get_next_points_val(
                        val_outputs.transpose(1, 0),
                        val_data["label"].to(device),
                        torch.tensor(label_set).to(device),
                        point,
                        point_label,
                        use_center=False,
                    )
                    # if labels other than 0 didn't get new points, skip
                    skip_this_iter = torch.all(_point_label[1:, -1] == -1)
                    if skip_this_iter:
                        if idx < 10:
                            _point, _point_label = get_next_points_val(
                                val_outputs.transpose(1, 0),
                                val_data["label"].to(device),
                                torch.tensor(label_set).to(device),
                                point,
                                point_label,
                                use_center=False,
                                erosion2d=True,
                            )
                            skip_this_iter = torch.all(_point_label[1:, -1] == -1)
                            if skip_this_iter:
                                print(f"iteration end at {idx}")
                                break
                    point, point_label = _point, _point_label

                with autocast(enabled=amp):
                    val_outputs = None
                    val_outputs = sliding_window_inference(
                        inputs=val_data["image"].to(device),
                        roi_size=patch_size,
                        sw_batch_size=1,
                        predictor=model_inferer,
                        mode="gaussian",
                        overlap=overlap,
                        sw_device=device,
                        device=device,
                        point_coords=point,  # not None
                        point_labels=point_label,
                        class_vector=None,
                        prompt_class=torch.ones(len(label_set), 1).to(device)
                        * 600,  # will not be used when val_point_sampler is not None
                        labels=None,
                        label_set=None,
                        use_cfp=True,
                        brush_radius=None,
                        prev_mask=None,
                        val_point_sampler=None,
                    )  # making sure zero-shot
                # val_outputs = get_largest_connected_component_point(val_outputs, point_coords=point, point_labels=point_label, post_idx=post_idx)
                val_pred = post_transform(
                    {"image": val_data["image"][0], "pred": val_outputs[0]}
                )["pred"]
                val_pred = post_pred(val_pred)[None, ...]
                val_outputs = post_pred(val_outputs[0, ...])
                val_outputs = val_outputs[None, ...]
                if remove_out:
                    # remove false positive in slices with no gt
                    for i in range(1, len(label_set)):
                        gt = val_data["label"].to(val_outputs.device) == label_set[i]
                        remove_slice = gt[0, 0].sum(0).sum(0) == 0
                        val_outputs[:, i, :, :, remove_slice] = 0
                for i in range(1, len(label_set)):
                    gt = val_data["label_gt"].to(val_outputs.device) == label_set[i]
                    y_pred = val_pred[:, [i]]
                    remove_slice = gt[0, 0].sum(0).sum(0) == 0
                    y_pred[:, :, :, :, remove_slice] = 0

                    metric[_index - 1, i - 1, idx] = compute_dice(
                        y_pred=y_pred, y=gt, include_background=False
                    )
                    point_num[_index - 1, i - 1] = idx + 1
                string = f"Validation Dice score : {idx} / {_index} / {len(val_loader)}/ {val_filename}: {metric[_index-1,:,idx]}"
                print(string)
                log_string.append(string)
                # move all to cpu to avoid potential out memory in invert transform
                torch.cuda.empty_cache()
        log_string = sorted(log_string)
        for _ in log_string:
            logger.debug(_)

        if torch.cuda.device_count() > 1:
            dist.barrier()
            global_combined_tensor = [
                torch.zeros_like(metric) for _ in range(world_size)
            ]
            dist.all_gather(tensor_list=global_combined_tensor, tensor=metric)
            metric = torch.vstack(global_combined_tensor)
            dist.barrier()
            global_combined_tensor = [
                torch.zeros_like(point_num) for _ in range(world_size)
            ]
            dist.all_gather(tensor_list=global_combined_tensor, tensor=point_num)
            point_num = torch.vstack(global_combined_tensor)

        if torch.cuda.device_count() == 1 or dist.get_rank() == 0:
            # remove metric that's all NaN
            keep_index = ~torch.isnan(metric).all(1).all(1)
            metric = metric[keep_index]
            point_num = point_num[keep_index]
            if max_iters > 1:
                metric_best = torch.nan_to_num(metric, 0).max(2)[0]
            else:
                metric_best = metric[:, :, 0]
            for i in range(metric.shape[0]):
                logger.debug(f"object {i}: {metric[i].tolist()}")
                logger.debug(f"object {i}: {metric_best[i].tolist()}")
            print("point_number", point_num, point_num.nanmean(0))
            torch.save(
                {"metric": metric.cpu(), "point": point_num.cpu()},
                parser.get_parsed_content("log_output_file").replace("log", "pt"),
            )
            logger.debug(
                f"Best metric {metric_best.nanmean(0).tolist()}, best avg {metric_best.nanmean(0).nanmean().tolist()}"
            )
            logger.debug(
                f"point needed, {point_num.tolist()}, mean is {point_num.nanmean(0).tolist()}"
            )
            """ Note: the zero-shot plots in the paper is using the saved pt file. For the j-th point, the results might be worse due to random point selection. We chose
            the best dice from point 1 to j, e.g. point i and treat i as the point click number.
            data = torch.load(path_to_pt_file)['metric']
            for j in range(1, max_iters):
                data_notnan = torch.nan_to_num(data_[:,:j],0)
                data_notnan = data_notnan.max(1)[0]
                y.append(data_notnan.mean())
                x.append((~torch.isnan(data_[:,:j])).sum()/data_.shape[0])
            plot(x, y)
            """
    torch.cuda.empty_cache()
    if torch.cuda.device_count() > 1:
        dist.barrier()
        dist.destroy_process_group()

    return


if __name__ == "__main__":
    from monai.utils import optional_import

    fire, _ = optional_import("fire")
    fire.Fire()
