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
import logging
import math
import os
import sys
import time
import warnings
from datetime import timedelta
from functools import partial
from typing import Optional, Sequence, Union

import monai
import nibabel as nib
import numpy as np
import torch
import torch.distributed as dist
import yaml
from monai import transforms
from monai.apps.auto3dseg.auto_runner import logger
from monai.auto3dseg.utils import datafold_read
from monai.bundle import ConfigParser
from monai.bundle.scripts import _pop_args, _update_args
from monai.data import DataLoader, DistributedSampler
from monai.metrics import compute_dice
from monai.utils import set_determinism
from torch.nn.parallel import DistributedDataParallel
from torch.utils.tensorboard import SummaryWriter
from tqdm import tqdm

from vista3d import vista_model_registry

from .sliding_window import sliding_window_inference
from .train import CONFIG, infer_wrapper, loss_wrapper
from .utils.workflow_utils import (
    MERGE_LIST,
    generate_prompt_pairs,
    get_next_points,
    sample_points_patch_val,
)

nib.imageglobals.logger.setLevel(40)


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

    # loggings and experiment pathes
    start_time = time.time()
    bundle_root = parser.get_parsed_content("bundle_root")
    ckpt_path = parser.get_parsed_content("ckpt_path")
    os.makedirs(ckpt_path, exist_ok=True)
    if world_size == 1 or dist.get_rank() == 0:
        writer = SummaryWriter(log_dir=os.path.join(ckpt_path, "Events"))
        with open(os.path.join(ckpt_path, "accuracy_history.csv"), "a") as f:
            f.write("epoch\tmetric\tloss\tlr\ttime\titer\n")
    random_seed = parser.get_parsed_content("random_seed")
    save_last = parser.get_parsed_content(
        "save_last", default=False
    )  # save the last checkpoint
    save_all = parser.get_parsed_content(
        "save_all", default=False
    )  # save all val-checkpoint
    if world_size == 1 or dist.get_rank() == 0:
        config_yaml = os.path.join(bundle_root, "configs.yaml")
        ConfigParser.export_config_file(
            parser.get(), config_yaml, fmt="yaml", default_flow_style=None
        )
    if random_seed is not None and (
        isinstance(random_seed, int) or isinstance(random_seed, float)
    ):
        set_determinism(seed=random_seed)
    CONFIG["handlers"]["file"]["filename"] = parser.get_parsed_content(
        "log_output_file"
    )
    logging.config.dictConfig(CONFIG)
    logging.getLogger("torch.distributed.distributed_c10d").setLevel(logging.WARNING)

    # training hyperparameters - workflow
    device = (
        torch.device(f"cuda:{os.environ['LOCAL_RANK']}")
        if world_size > 1
        else torch.device("cuda:0")
    )
    amp = parser.get_parsed_content("amp")
    if amp:
        from torch.cuda.amp import GradScaler, autocast

        scaler = GradScaler()
        logger.debug("Amp enabled")
    finetune = parser.get_parsed_content("finetune")
    num_epochs = parser.get_parsed_content("num_epochs")
    num_epochs_per_validation = parser.get_parsed_content("num_epochs_per_validation")
    skip_iter_prob = parser.get_parsed_content(
        "skip_iter_prob"
    )  # prob. to skip iterative point sampling, 1 for auto-training
    iter_num = parser.get_parsed_content(
        "iter_num"
    )  # total iter number in point branch training
    freeze_epoch = parser.get_parsed_content(
        "freeze_epoch", default=-1
    )  # freeze the whole branch epoch
    freeze_head = parser.get_parsed_content(
        "freeze_head", default="auto"
    )  # freeze which branch, "auto" or "point". We freeze point for auto-training.
    logger.debug(f"World_size: {world_size}")
    logger.debug(f"num_epochs: {num_epochs}")
    logger.debug(f"num_epochs_per_validation: {num_epochs_per_validation}")

    # training hyperparameters - model and optimizer
    input_channels = parser.get_parsed_content("input_channels")
    model_registry = parser.get_parsed_content("model")
    patch_size = parser.get_parsed_content("patch_size")
    model = vista_model_registry[model_registry](
        in_channels=input_channels, image_size=patch_size
    )
    model = model.to(device)
    optimizer_part = parser.get_parsed_content("optimizer", instantiate=False)
    optimizer = optimizer_part.instantiate(params=model.parameters())
    lr_scheduler_part = parser.get_parsed_content("lr_scheduler", instantiate=False)
    lr_scheduler = lr_scheduler_part.instantiate(optimizer=optimizer)
    if finetune["activate"] and os.path.isfile(finetune["pretrained_ckpt_name"]):
        logger.debug(
            "Fine-tuning pre-trained checkpoint {:s}".format(
                finetune["pretrained_ckpt_name"]
            )
        )
        pretrained_ckpt = torch.load(
            finetune["pretrained_ckpt_name"], map_location=device
        )
        model.load_state_dict(pretrained_ckpt)
        del pretrained_ckpt
    else:
        logger.debug("Training from scratch")

    if world_size > 1:
        model = DistributedDataParallel(
            model, device_ids=[device], find_unused_parameters=True
        )
    # training hyperparameters - sample
    num_images_per_batch = parser.get_parsed_content("num_images_per_batch")
    num_patches_per_iter = parser.get_parsed_content("num_patches_per_iter")
    overlap_ratio = parser.get_parsed_content("overlap_ratio")  # sliding window overlap
    max_prompt = parser.get_parsed_content("max_prompt", default=96)
    max_backprompt = parser.get_parsed_content("max_backprompt", default=96)
    max_foreprompt = parser.get_parsed_content("max_foreprompt", default=96)
    drop_label_prob = parser.get_parsed_content("drop_label_prob")
    drop_point_prob = parser.get_parsed_content("drop_point_prob")
    max_point = parser.get_parsed_content("max_point")

    # training hyperparameters - data and transforms
    label_set = parser.get_parsed_content("label_set", default=None)
    mapped_label_set = parser.get_parsed_content(
        "mapped_label_set", default=copy.deepcopy(label_set)
    )
    # user can define class names in the json config
    class_names = parser.get_parsed_content("class_names", default=None)
    label_mapping = {label_set[i]: mapped_label_set[i] for i in range(len(label_set))}
    metric_dim = len(label_set) - 1  # only affect dice calculation
    fold = parser.get_parsed_content("fold")
    use_folds = parser.get_parsed_content("use_folds", default=False)
    post_pred = transforms.Compose(
        [
            transforms.EnsureType(),
            transforms.AsDiscrete(threshold=0.0, dtype=torch.uint8),
        ]
    )
    data_file_base_dir = parser.get_parsed_content("data_file_base_dir")
    data_list_file_path = parser.get_parsed_content("data_list_file_path")
    train_number = parser.get_parsed_content("train_number", default=-1)
    train_transforms, val_transforms = None, None
    train_transforms = parser.get_parsed_content("transforms_train", default=None)
    val_transforms = parser.get_parsed_content("transforms_validate", default=None)
    post_transform = transforms.Invertd(
        keys="pred",
        transform=val_transforms,
        orig_keys="image",
        meta_keys="pred_meta_dict",
        orig_meta_keys="image_meta_dict",
        meta_key_postfix="meta_dict",
        nearest_interp=False,
        to_tensor=True,
    )
    if use_folds:
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
    train_files = train_files[:train_number]
    if world_size > 1:
        if len(val_files) < world_size:
            val_files = list(val_files) * math.ceil(
                float(world_size) / float(len(val_files))
            )
    logger.debug(f"Train_files: {len(train_files)}")
    logger.debug(f"Val_files: {len(val_files)}")
    with warnings.catch_warnings():
        warnings.simplefilter(action="ignore", category=FutureWarning)
        warnings.simplefilter(action="ignore", category=Warning)
        train_ds, val_ds, test_ds = None, None, None
        # for pact 118 use normal dataset to avoid crash.
        train_ds = monai.data.Dataset(
            data=train_files * num_epochs_per_validation, transform=train_transforms
        )
        val_ds = monai.data.Dataset(data=val_files, transform=val_transforms)
        test_ds = monai.data.Dataset(data=test_files, transform=val_transforms)
    train_sampler, val_sampler, test_sampler = None, None, None
    if world_size > 1:
        if train_ds is not None:
            train_sampler = DistributedSampler(train_ds, shuffle=True)
        if val_ds is not None:
            val_sampler = DistributedSampler(
                val_ds, shuffle=False, even_divisible=False
            )
        if test_ds is not None:
            test_sampler = DistributedSampler(
                test_ds, shuffle=False, even_divisible=False
            )
    train_loader = DataLoader(
        train_ds,
        num_workers=4,
        batch_size=num_images_per_batch,
        shuffle=(train_sampler is None),
        persistent_workers=True,
        pin_memory=True,
        sampler=train_sampler,
        prefetch_factor=1,
    )
    val_loader = DataLoader(
        val_ds,
        num_workers=4,
        batch_size=1,
        shuffle=False,
        sampler=val_sampler,
        prefetch_factor=1,
        persistent_workers=False,
    )
    test_loader = DataLoader(
        test_ds,
        num_workers=4,
        batch_size=1,
        shuffle=False,
        sampler=test_sampler,
        prefetch_factor=1,
        persistent_workers=False,
    )

    # ---------  Start training  ---------
    """ Notes: The training script is directly modified from auto3dseg.
        To increase speed, the training script is not based on epoch, but based on validation rounds.
        In each batch, num_images_per_batch=2 whole 3D images are loaded into CPU for data transformation
        num_patches_per_image=2*num_patches_per_iter is extracted from each 3D image, in each iteration,
        num_patches_per_iter patches is used for training (real batch size on each GPU).
    """
    num_rounds = int(np.ceil(float(num_epochs) // float(num_epochs_per_validation)))
    best_metric = -1
    best_metric_epoch = -1
    idx_iter = 0
    if num_rounds == 0:
        raise RuntimeError(
            "num_epochs_per_validation > num_epochs, modify hyper_parameters.yaml"
        )

    if world_size == 1 or dist.get_rank() == 0:
        progress_bar = tqdm(
            range(num_rounds),
            desc=f"{os.path.basename(bundle_root)} - training ...",
            unit="round",
        )
    for _round in (
        range(num_rounds) if world_size > 1 and dist.get_rank() != 0 else progress_bar
    ):
        model.train()
        epoch_loss = 0
        loss_torch_epoch = 0
        epoch = 0
        loss_torch = torch.zeros(2, dtype=torch.float, device=device) + 1e-5
        step = 0
        e_time = time.time()
        if world_size > 1:
            train_loader.sampler.set_epoch(_round)
        for batch_data in train_loader:
            # for batch_data in cycle_k(train_loader):
            s_time = time.time()
            # if step % (len(train_loader)) == 0:
            if step % (len(train_loader) // num_epochs_per_validation) == 0:
                epoch = _round * num_epochs_per_validation + step // (
                    len(train_loader) // num_epochs_per_validation
                )
                lr_scheduler.step()
                lr = lr_scheduler.get_last_lr()[0]
                if freeze_epoch > epoch:
                    # if automatic branch is frozen, drop label prompts
                    if freeze_head == "auto":
                        drop_label_prob_train = 1
                        drop_point_prob_train = 0
                        auto_freeze = True
                        point_freeze = False
                    elif freeze_head == "point":
                        drop_label_prob_train = 0
                        drop_point_prob_train = 1
                        auto_freeze = False
                        point_freeze = True
                    try:
                        model.module.set_auto_grad(
                            auto_freeze=auto_freeze, point_freeze=point_freeze
                        )
                    except BaseException:
                        model.set_auto_grad(
                            auto_freeze=auto_freeze, point_freeze=point_freeze
                        )
                    if world_size == 1 or dist.get_rank() == 0:
                        logger.debug(
                            f"Auto freeze {auto_freeze}, point freeze {point_freeze} at epoch {epoch}!"
                        )
                else:
                    drop_label_prob_train = drop_label_prob
                    drop_point_prob_train = drop_point_prob
                    try:
                        model.module.set_auto_grad(
                            auto_freeze=False, point_freeze=False
                        )
                    except BaseException:
                        model.set_auto_grad(auto_freeze=False, point_freeze=False)
                    if world_size == 1 or dist.get_rank() == 0:
                        logger.debug(
                            f"Auto freeze {False}, point freeze {False} at epoch {epoch}!"
                        )

                if world_size == 1 or dist.get_rank() == 0:
                    logger.debug("----------")
                    logger.debug(f"epoch {epoch}/{num_epochs}")
                    logger.debug(f"Learning rate is set to {lr}")
            step += 1
            inputs_l = batch_data["image"].as_subclass(torch.Tensor)
            if "label" not in batch_data:
                # this will only happen for unlabeled dataset
                batch_data["label"] = batch_data.pop("pseudo_label")
            labels_l = batch_data["label"].as_subclass(torch.Tensor)

            if len(inputs_l) > 1:
                _idx = torch.randperm(inputs_l.shape[0])
                inputs_l = inputs_l[_idx]
                labels_l = labels_l[_idx]

            for _k in range(inputs_l.shape[0] // num_patches_per_iter):
                inputs = inputs_l[
                    _k * num_patches_per_iter : (_k + 1) * num_patches_per_iter, ...
                ]
                labels = labels_l[
                    _k * num_patches_per_iter : (_k + 1) * num_patches_per_iter, ...
                ]
                inputs = inputs.to(device)
                labels = labels.to(device)
                train_label_set = label_set
                if world_size > 1:
                    if dist.get_rank() == 0:
                        skip_iter = (torch.rand(1) < skip_iter_prob).to(
                            dtype=torch.float, device=device
                        )
                    else:
                        skip_iter = torch.empty(1).to(dtype=torch.float, device=device)
                    dist.broadcast(skip_iter, src=0)
                else:
                    skip_iter = (torch.rand(1) < skip_iter_prob).float()
                if skip_iter > 0:
                    # if not using iterative
                    num_iters = 1
                else:
                    # if use iterative training
                    num_iters = max(iter_num, 1)

                # for dataset other than totalseg, use pseudolabel for zero-shot. for totalseg, if labels_p exist, use labels_p for zero-shot,
                # gt for regular sample. If labels_p does not exist, use gt for zero-shot.
                label_prompt, point, point_label, prompt_class = generate_prompt_pairs(
                    labels,
                    train_label_set,
                    max_point=max_point,
                    max_prompt=max_prompt,
                    max_backprompt=max_backprompt,
                    max_foreprompt=max_foreprompt,
                    drop_label_prob=drop_label_prob_train,
                    drop_point_prob=drop_point_prob_train,
                )
                # Skip the training if prompts are both None
                skip_update = torch.zeros(1, device=device)
                if label_prompt is None and point is None:
                    logger.debug("Iteration skipped due to None prompts")
                    skip_update = torch.ones(1, device=device)
                if world_size > 1:
                    dist.all_reduce(skip_update, op=dist.ReduceOp.SUM)
                if skip_update[0] > 0:
                    continue  # some rank has no foreground, skip this batch
                # clear image_embedding
                try:
                    model.module.clear_cache()
                except BaseException:
                    model.clear_cache()
                for click_indx in range(num_iters):
                    outputs = None
                    inputs = inputs.to(device)
                    labels = labels.to(device)
                    # only sinlge point prompt case activate multi-mask output
                    loss_function = partial(
                        loss_wrapper, loss_function=parser.get_parsed_content("loss")
                    )

                    # need to convert label_prompt to global index
                    label_prompt_global = []
                    for i in label_prompt[:, 0].cpu().tolist():
                        label_prompt_global.append(label_mapping[i])
                    with autocast():
                        outputs = model(
                            input_images=inputs,
                            point_coords=point,
                            point_labels=point_label,
                            class_vector=torch.tensor(label_prompt_global)
                            .to(device)
                            .unsqueeze(1),
                            prompt_class=prompt_class,
                        )
                    # cumulate loss
                    loss, loss_n = torch.tensor(0.0, device=device), torch.tensor(
                        0.0, device=device
                    )
                    for idx in range(len(prompt_class)):
                        if prompt_class[idx] == 0:
                            continue  # skip background class
                        loss_n += 1.0
                        gt = labels == prompt_class[idx]
                        if prompt_class[idx].item() in MERGE_LIST.keys():
                            for m in MERGE_LIST[prompt_class[idx].item()]:
                                gt = torch.logical_or(gt, labels == m)
                        loss += loss_function(outputs[[idx]].float(), gt)

                    loss /= max(loss_n, 1.0)

                    if num_iters > 1:
                        if click_indx != num_iters - 1:  # do not sample at last iter
                            outputs.sigmoid_()
                            if prompt_class is not None:
                                point, point_label = get_next_points(
                                    outputs[: len(prompt_class)],
                                    labels,
                                    prompt_class,
                                    point,
                                    point_label,
                                )
                            # stop iterative if no new points are added.
                            skip_this_iter = torch.tensor(False, device=device)
                            if prompt_class is not None:
                                if torch.all(point_label[:, -1] == -1) and torch.all(
                                    point_label[:, -2] == -1
                                ):
                                    skip_this_iter = torch.tensor(True, device=device)
                            if world_size > 1:
                                dist.all_reduce(
                                    skip_this_iter, op=dist.ReduceOp.PRODUCT
                                )
                                skip_this_iter = bool(skip_this_iter.item())
                            if skip_this_iter:
                                print(f"iteration end at {click_indx}")
                                logger.info(f"iteration end at {click_indx}")
                                break
                    del outputs
                    torch.cuda.empty_cache()

                    for param in model.parameters():
                        param.grad = None
                    inputs = inputs.to("cpu")
                    labels = labels.to("cpu")
                    scaler.scale(loss).backward()
                    scaler.unscale_(optimizer)
                    # clip_grad_norm_(model.parameters(), 0.5)
                    scaler.step(optimizer)
                    scaler.update()

                epoch_loss += loss.item()
                loss_torch[0] += loss.item()
                loss_torch[1] += 1.0
                epoch_len = len(train_loader)  # * num_epochs_per_validation
                idx_iter += 1
                if world_size == 1 or dist.get_rank() == 0:
                    logger.debug(
                        f"{time.time() - s_time:.4f} {step}/{epoch_len}, train_loss: {loss.item():.4f}"
                    )
                    writer.add_scalar(
                        "train/loss", loss.item(), epoch_len * _round + step
                    )

        if world_size > 1:
            dist.all_reduce(loss_torch, op=torch.distributed.ReduceOp.SUM)

        loss_torch = loss_torch.tolist()
        if world_size == 1 or dist.get_rank() == 0:
            loss_torch_epoch = loss_torch[0] / loss_torch[1]
            logger.debug(
                f"{time.time() - e_time:.4f} Epoch {epoch} average loss: {loss_torch_epoch:.4f}, "
                f"best mean dice: {best_metric:.4f} at epoch {best_metric_epoch}"
            )
        try:
            del inputs, labels, inputs_l, labels_l, batch_data
        except BaseException:
            pass
        torch.cuda.empty_cache()

        # ---------  Start Validation  ---------
        """ Note:
            In training transform, labels are mapped to global index with Relabel transform. However, there could be local index that are not used since it can excluded
            from label_mapping definition. In training sample generation, training pairs will only be sampled from label_set. In validation, the label_prompt
            will use global mapping, but the val label is not mapped to global index, so we need the val_orig_set. Notice the compute_dice assume gt label starts
            from 0,1,2,3,4,.... If some are index are not used (not defined in label_mapping.json thus label_set does not include them), compute_dice directly will give wrong
            number. We calculate dice for each class with a for loop.
        """
        model.eval()
        model_inferer = partial(infer_wrapper, model=model)
        data_loader = [val_loader, test_loader]
        log_info = ["Validation", "Testing"]
        for val_times in [0]:
            with torch.no_grad():
                # for metric, index 2*c is the dice for class c, and 2*c + 1 is the not-nan counts for class c
                metric = torch.zeros(metric_dim * 2, dtype=torch.float, device=device)
                val_data = None
                torch.cuda.empty_cache()
                for _index, val_data in enumerate(data_loader[val_times]):
                    val_filename = val_data["image"].meta["filename_or_obj"][0]
                    # one difference is that label_set in train.py does not include 0 but here we require user add 0 in
                    # the json config.
                    val_label_set = mapped_label_set
                    val_orig_set = label_set

                    for _device_in, _device_out in zip(
                        [device, device, "cpu"], [device, "cpu", "cpu"]
                    ):
                        try:
                            label_prompt = (
                                torch.tensor(val_label_set).to(device).unsqueeze(0)
                            )
                            promot_class = torch.ones(len(label_set), 1).to(
                                device
                            )  # supported class
                            if drop_label_prob > 0.99:
                                label_prompt = None
                            with autocast(enabled=amp):
                                val_outputs = None
                                torch.cuda.empty_cache()
                                val_outputs = sliding_window_inference(
                                    inputs=val_data["image"].to(_device_in),
                                    roi_size=patch_size,
                                    sw_batch_size=1,
                                    predictor=model_inferer,
                                    mode="gaussian",
                                    overlap=overlap_ratio,
                                    sw_device=device,
                                    device=_device_out,
                                    point_coords=None,
                                    point_labels=None,
                                    class_vector=label_prompt,
                                    prompt_class=promot_class,
                                    labels=val_data["label"].to(_device_in),
                                    label_set=val_orig_set,
                                    val_point_sampler=partial(
                                        sample_points_patch_val,
                                        mapped_label_set=val_label_set,
                                        max_ppoint=1,
                                        use_center=True,
                                    ),
                                )
                            try:
                                val_outputs = post_pred(val_outputs[0, ...])
                            except BaseException:
                                val_outputs = post_pred(val_outputs[0, ...].to("cpu"))
                            finished = True

                        except RuntimeError as e:
                            if not any(
                                x in str(e).lower() for x in ("memory", "cuda", "cudnn")
                            ):
                                raise e
                            logger.warning(e)
                            finished = False

                        if finished:
                            break

                    if finished:
                        value = torch.full((1, metric_dim), float("nan")).to(device)
                        val_outputs = val_outputs[None, ...]
                        if val_times > 0:
                            try:
                                val_outputs = post_transform(
                                    {
                                        "image": val_data["image"][0],
                                        "pred": val_outputs[0],
                                    }
                                )["pred"][None, ...]
                            except BaseException:
                                print(val_filename, "OOM", val_data["label_gt"].shape)
                                val_data["image"] = val_data["image"].cpu()
                                val_outputs = val_outputs.cpu()
                                val_outputs = post_transform(
                                    {
                                        "image": val_data["image"][0],
                                        "pred": val_outputs[0],
                                    }
                                )["pred"][None, ...]
                                print("finished OOM")
                        del val_data["image"]
                        value_l = []
                        for i in range(1, len(val_orig_set)):
                            if val_times == 0:
                                gt = (
                                    val_data["label"].to(val_outputs.device)
                                    == val_orig_set[i]
                                )
                            else:
                                gt = (
                                    val_data["label_gt"].to(val_outputs.device)
                                    == val_orig_set[i]
                                )
                            value_l.append(
                                compute_dice(
                                    y_pred=val_outputs[:, [i]],
                                    y=gt,
                                    include_background=False,
                                )
                            )
                        value = torch.hstack(value_l).to(device)
                    else:
                        # During training, allow validation OOM for some big data to avoid crush.
                        logger.debug(
                            f"{val_filename} is skipped due to OOM, using NaN dice values"
                        )
                        value = torch.full((1, metric_dim), float("nan")).to(device)

                    # remove temp variables to save memory.
                    val_outputs, val_data = None, None
                    torch.cuda.empty_cache()

                    logger.debug(
                        f"{_index + 1} / {len(val_loader)} / {val_filename}: {value}"
                    )

                    for _c in range(metric_dim):
                        val0 = torch.nan_to_num(value[0, _c], nan=0.0)
                        val1 = 1.0 - torch.isnan(value[0, _c]).float()
                        metric[2 * _c] += val0
                        metric[2 * _c + 1] += val1

                if world_size > 1:
                    dist.all_reduce(metric, op=torch.distributed.ReduceOp.SUM)

                metric = metric.tolist()
                metric_class = np.zeros(metric_dim)
                if world_size == 1 or dist.get_rank() == 0:
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
                            writer.add_scalar(
                                f"val_class/acc_{class_names[_c + 1]}", v, epoch
                            )
                            logger.debug(
                                f"Evaluation metric - class {_c + 1} {class_names[_c + 1]}: {v:.4f}"
                            )
                        except BaseException:
                            writer.add_scalar(f"val_class/acc_{_c}", v, epoch)
                            logger.debug(
                                f"Evaluation metric - class {_c + 1} : {v:.4f}"
                            )

                    avg_metric = avg_metric / valid
                    logger.debug(f"{log_info[val_times]} Avg_metric: {avg_metric}")
                    if val_times > 0:
                        continue
                    writer.add_scalar("val/acc", avg_metric, epoch)
                    if avg_metric > best_metric or save_last:
                        best_metric = avg_metric
                        best_metric_epoch = epoch
                        if save_all:
                            ckpt_name = f"best_metric_model_{epoch}.pt"
                        else:
                            ckpt_name = "best_metric_model.pt"
                        if world_size > 1:
                            torch.save(
                                model.module.state_dict(),
                                os.path.join(ckpt_path, ckpt_name),
                            )
                        else:
                            torch.save(
                                model.state_dict(), os.path.join(ckpt_path, ckpt_name)
                            )
                        logger.debug("Saved new best metric model")

                        dict_file = {}
                        dict_file["best_avg_dice_score"] = float(best_metric)
                        dict_file["best_avg_dice_score_epoch"] = int(best_metric_epoch)
                        dict_file["best_avg_dice_score_iteration"] = int(idx_iter)
                        with open(
                            os.path.join(ckpt_path, "progress.yaml"), "a"
                        ) as out_file:
                            yaml.dump([dict_file], stream=out_file)

                    logger.debug(
                        "Current epoch: {} current mean dice: {:.4f} best mean dice: {:.4f} at epoch {}".format(
                            epoch, avg_metric, best_metric, best_metric_epoch
                        )
                    )

                    current_time = time.time()
                    elapsed_time = (current_time - start_time) / 60.0
                    with open(
                        os.path.join(ckpt_path, "accuracy_history.csv"), "a"
                    ) as f:
                        f.write(
                            "{:d}\t{:.5f}\t{:.5f}\t{:.5f}\t{:.1f}\t{:d}\n".format(
                                epoch,
                                avg_metric,
                                loss_torch_epoch,
                                lr,
                                elapsed_time,
                                idx_iter,
                            )
                        )

                if world_size > 1:
                    dist.barrier()

            torch.cuda.empty_cache()

    if world_size == 1 or dist.get_rank() == 0:
        logger.debug(
            f"Training completed, best_metric: {best_metric:.4f} at epoch: {best_metric_epoch}."
        )

        writer.flush()
        writer.close()

        logger.warning(f"{os.path.basename(bundle_root)} - training: finished")

    if world_size > 1:
        dist.destroy_process_group()

    return


if __name__ == "__main__":
    from monai.utils import optional_import

    fire, _ = optional_import("fire")
    fire.Fire()
