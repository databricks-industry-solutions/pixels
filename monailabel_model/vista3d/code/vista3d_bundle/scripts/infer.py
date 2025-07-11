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

import logging
import os
import sys
from functools import partial

import monai
import numpy as np
import torch
import torch.distributed as dist
from monai import transforms
from monai.apps.auto3dseg.auto_runner import logger
from monai.auto3dseg.utils import datafold_read
from monai.bundle import ConfigParser
from monai.bundle.scripts import _pop_args, _update_args
from monai.data import decollate_batch, list_data_collate, partition_dataset
from monai.utils import optional_import

from vista3d_bundle.vista3d import vista_model_registry

from .sliding_window import point_based_window_inferer, sliding_window_inference
from .train import CONFIG
from .utils.trans_utils import VistaPostTransform, get_largest_connected_component_point

rearrange, _ = optional_import("einops", name="rearrange")
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

IGNORE_PROMPT = set(
    [
        2,  # kidney
        16,  # prostate or uterus
        18,  # rectum
        20,  # lung
        21,  # bone
        23,  # lung tumor
        24,  # pancreatic tumor
        25,  # hepatic vessel
        26,  # hepatic tumor
        27,  # colon cancer primaries
        128,  # bone lesion
        129,  # kidney mass
        130,  # liver tumor
        131,  # vertebrae L6
        132,
    ]
)  # airway
EVERYTHING_PROMPT = list(set([i + 1 for i in range(133)]) - IGNORE_PROMPT)


def infer_wrapper(inputs, model, **kwargs):
    outputs = model(input_images=inputs, **kwargs)
    return outputs.transpose(1, 0)


class InferClass:
    def __init__(self, config_file="./configs/infer.yaml", **override):
        logging.basicConfig(stream=sys.stdout, level=logging.INFO)

        _args = _update_args(config_file=config_file, **override)
        config_file_ = _pop_args(_args, "config_file")[0]

        parser = ConfigParser()
        parser.read_config(config_file_)
        parser.update(pairs=_args)

        self.amp = parser.get_parsed_content("amp")
        input_channels = parser.get_parsed_content("input_channels")
        patch_size = parser.get_parsed_content("patch_size")
        self.patch_size = patch_size

        ckpt_name = parser.get_parsed_content("infer")["ckpt_name"]
        output_path = parser.get_parsed_content("infer")["output_path"]
        if not os.path.exists(output_path):
            os.makedirs(output_path, exist_ok=True)

        CONFIG["handlers"]["file"]["filename"] = parser.get_parsed_content("infer")[
            "log_output_file"
        ]
        logging.config.dictConfig(CONFIG)
        self.infer_transforms = parser.get_parsed_content("transforms_infer")

        torch_device = f'{parser.get("torch_device")}' if parser.get("torch_device") else "cuda"
        print(f"Using device {torch_device}")

        self.device = torch.device(torch_device)
        model_registry = parser.get_parsed_content("model")
        model = vista_model_registry[model_registry](
            in_channels=input_channels, image_size=patch_size
        )
        self.model = model.to(self.device)

        self.file_ext = parser.get("file_ext") if parser.get("file_ext") else ".nii.gz"

        pretrained_ckpt = torch.load(ckpt_name, map_location=self.device)
        self.model.load_state_dict(pretrained_ckpt, strict=False)
        logger.debug(f"[debug] checkpoint {ckpt_name:s} loaded")
        post_transforms = [
            VistaPostTransform(keys="pred"),
            transforms.Invertd(
                keys="pred",
                transform=self.infer_transforms,
                orig_keys="image",
                meta_keys="pred_meta_dict",
                orig_meta_keys="image_meta_dict",
                meta_key_postfix="meta_dict",
                nearest_interp=True,
                to_tensor=True,
            ),
        ]

        # For Vista3d, sigmoid is always used, but for visualization, argmax is needed
        save_transforms = [
            transforms.SaveImaged(
                keys="pred",
                meta_keys="pred_meta_dict",
                output_ext=self.file_ext,
                output_dir=output_path,
                output_postfix="seg",
                resample=False,
                data_root_dir=None,
                print_log=False,
            )
        ]
        self.post_transforms = transforms.Compose(post_transforms)
        self.save_transforms = transforms.Compose(save_transforms)
        self.prev_mask = None
        self.batch_data = None
        return

    def clear_cache(self):
        self.prev_mask = None
        self.batch_data = None

    def transform_points(self, point, affine):
        """transform point to the coordinates of the transformed image
        point: numpy array [bs, N, 3]
        """
        bs, N = point.shape[:2]
        point = np.concatenate((point, np.ones((bs, N, 1))), axis=-1)
        point = rearrange(point, "b n d -> d (b n)")
        point = affine @ point
        point = rearrange(point, "d (b n)-> b n d", b=bs)[:, :, :3]
        return point

    @torch.no_grad()
    def infer(
        self,
        image_file,
        point=None,
        point_label=None,
        label_prompt=None,
        prompt_class=None,
        save_mask=False,
        point_start=0,
    ):
        """Infer a single image_file. If save_mask is true, save the argmax prediction to disk. If false,
        do not save and return the probability maps (usually used by autorunner emsembler). point_start is
        used together with prev_mask. If prev_mask is generated by N points, point_start should be N+1 to save
        time and avoid repeated inference. This is by default disabled.
        """

        self.model.eval()
        if not isinstance(image_file, dict):
            image_file = {"image": image_file}
        if self.batch_data is not None:
            batch_data = self.batch_data
        else:
            batch_data = self.infer_transforms(image_file)
            if label_prompt is not None:
                batch_data["label_prompt"] = label_prompt
            batch_data = list_data_collate([batch_data])
            self.batch_data = batch_data
        if point is not None:
            if type(point) is list:
                point = np.array(point)[np.newaxis, ...]
                point_label = np.array(point_label)[np.newaxis, ...]
            point = self.transform_points(
                point,
                np.linalg.inv(batch_data["image"].affine[0])
                @ batch_data["image"].meta["original_affine"][0].numpy(),
            )
            self.sliding_window_inferer = partial(
                point_based_window_inferer, point_start=point_start
            )
        else:
            self.sliding_window_inferer = sliding_window_inference
        device_list_input = [self.device, self.device, "cpu"]
        device_list_output = [self.device, "cpu", "cpu"]
        for _device_in, _device_out in zip(device_list_input, device_list_output):
            try:
                with torch.cuda.amp.autocast(enabled=self.amp):
                    batch_data["pred"] = self.sliding_window_inferer(
                        inputs=batch_data["image"].to(_device_in),
                        roi_size=self.patch_size,
                        sw_batch_size=1,
                        predictor=partial(infer_wrapper, model=self.model),
                        mode="gaussian",
                        overlap=0.625,
                        progress=True,
                        sw_device=self.device,
                        device=_device_out,
                        point_coords=(
                            torch.tensor(point).to(_device_in)
                            if point is not None
                            else None
                        ),
                        point_labels=(
                            torch.tensor(point_label).to(_device_in)
                            if point_label is not None
                            else None
                        ),
                        class_vector=(
                            torch.tensor(label_prompt).to(_device_in)
                            if label_prompt is not None
                            else None
                        ),
                        prompt_class=(
                            torch.tensor(prompt_class).to(_device_in)
                            if prompt_class is not None
                            else None
                        ),
                        prev_mask=(
                            torch.tensor(self.prev_mask).to(_device_in)
                            if self.prev_mask is not None
                            else None
                        ),
                    )

                    if not hasattr(batch_data["pred"], "meta"):
                        batch_data["pred"] = monai.data.MetaTensor(
                            batch_data["pred"],
                            affine=batch_data["image"].meta["affine"],
                            meta=batch_data["image"].meta,
                        )
                self.prev_mask = batch_data["pred"]
                if label_prompt is None and point is not None:
                    batch_data["pred"] = get_largest_connected_component_point(
                        batch_data["pred"], point_coords=point, point_labels=point_label
                    )
                batch_data["image"] = batch_data["image"].to("cpu")
                batch_data["pred"] = batch_data["pred"].to("cpu")
                torch.cuda.empty_cache()
                batch_data = [
                    self.post_transforms(i) for i in decollate_batch(batch_data)
                ]
                if save_mask:
                    batch_data = [self.save_transforms(i) for i in batch_data]

                finished = True
            except RuntimeError as e:
                if not any(x in str(e).lower() for x in ("memory", "cuda", "cudnn")):
                    raise e
                finished = False
            if finished:
                break
        if not finished:
            raise RuntimeError("Infer not finished due to OOM.")
        return batch_data[0]["pred"]

    @torch.no_grad()
    def infer_everything(self, image_file, label_prompt=EVERYTHING_PROMPT, rank=0):
        self.model.eval()
        device = f"cuda:{rank}"
        if not isinstance(image_file, dict):
            image_file = {"image": image_file}
        batch_data = self.infer_transforms(image_file)
        batch_data["label_prompt"] = label_prompt
        batch_data = list_data_collate([batch_data])
        device_list_input = [device, device, "cpu"]
        device_list_output = [device, "cpu", "cpu"]
        for _device_in, _device_out in zip(device_list_input, device_list_output):
            try:
                with torch.cuda.amp.autocast(enabled=self.amp):
                    batch_data["pred"] = sliding_window_inference(
                        inputs=batch_data["image"].to(_device_in),
                        roi_size=self.patch_size,
                        sw_batch_size=1,
                        predictor=partial(infer_wrapper, model=self.model),
                        mode="gaussian",
                        overlap=0.625,
                        sw_device=device,
                        device=_device_out,
                        class_vector=torch.tensor(label_prompt).to(_device_in),
                    )
                    if not hasattr(batch_data["pred"], "meta"):
                        batch_data["pred"] = monai.data.MetaTensor(
                            batch_data["pred"],
                            affine=batch_data["image"].meta["affine"],
                            meta=batch_data["image"].meta,
                        )
                torch.cuda.empty_cache()
                batch_data = [
                    self.post_transforms(i) for i in decollate_batch(batch_data)
                ]
                batch_data = [self.save_transforms(i) for i in batch_data]
                finished = True
            except RuntimeError as e:
                if not any(x in str(e).lower() for x in ("memory", "cuda", "cudnn")):
                    raise e
                finished = False
            if finished:
                break
        if not finished:
            raise RuntimeError("Infer not finished due to OOM.")

    @torch.no_grad()
    def batch_infer_everything(self, datalist=str, basedir=str):
        train_files, _ = datafold_read(datalist=datalist, basedir=basedir, fold=0)
        train_files = [_["image"] for _ in train_files]
        dist.init_process_group(backend="nccl", init_method="env://")
        world_size = dist.get_world_size()
        rank = dist.get_rank()
        # no need to wrap model with DistributedDataParallel
        self.model = self.model.to(f"cuda:{rank}")
        infer_files = partition_dataset(
            data=train_files,
            shuffle=False,
            num_partitions=world_size,
            even_divisible=False,
        )[rank]
        self.infer(infer_files, label_prompt=EVERYTHING_PROMPT, rank=rank)


if __name__ == "__main__":
    fire, _ = optional_import("fire")
    fire.Fire(InferClass)
