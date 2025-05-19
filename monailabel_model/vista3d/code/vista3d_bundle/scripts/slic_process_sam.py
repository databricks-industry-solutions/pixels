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
import time

import monai
import numpy as np
import torch
import torch.distributed as dist
from monai import transforms
from monai.auto3dseg.utils import datafold_read
from monai.data import partition_dataset
from monai.utils import optional_import
from segment_anything import SamPredictor, sam_model_registry
from skimage.segmentation import slic
from tqdm import tqdm

from .train import CONFIG
from .utils.trans_utils import dilate3d, erode3d

rearrange, _ = optional_import("einops", name="rearrange")
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))


def pad_to_divisible_by_16(image):
    # Get the dimensions of the input image
    depth, height, width = image.shape[-3:]

    # Calculate the padding required to make the dimensions divisible by 16
    pad_depth = (16 - (depth % 16)) % 16
    pad_height = (16 - (height % 16)) % 16
    pad_width = (16 - (width % 16)) % 16

    # Create a tuple with the padding values for each dimension
    padding = (0, pad_width, 0, pad_height, 0, pad_depth)

    # Pad the image
    padded_image = torch.nn.functional.pad(image, padding)

    return padded_image, padding


class InferClass:
    def __init__(self):
        logging.basicConfig(stream=sys.stdout, level=logging.INFO)
        output_path = "./supervoxel_sam"
        if not os.path.exists(output_path):
            os.makedirs(output_path, exist_ok=True)
        self.amp = True
        CONFIG["handlers"]["file"]["filename"] = f"{output_path}/log.log"
        logging.config.dictConfig(CONFIG)
        self.device = torch.device("cuda:0")
        self.sam = sam_model_registry["vit_h"](checkpoint="sam_vit_h_4b8939.pth").to(
            self.device
        )
        self.model = SamPredictor(self.sam)
        return

    @torch.no_grad()
    @torch.cuda.amp.autocast()
    def infer(
        self,
        image_file="example/s1238.nii.gz",
        rank=0,
        output_dir="./supervoxel_sam/",
        data_root_dir=None,
        n_segments=400,
    ):
        """Infer a single image_file. If save_mask is true, save the argmax prediction to disk. If false,
        do not save and return the probability maps (usually used by autorunner emsembler).
        """
        pixel_mean = torch.Tensor([123.675, 116.28, 103.53]).view(1, 3, 1, 1)
        pixel_std = torch.Tensor([58.395, 57.12, 57.375]).view(1, 3, 1, 1)
        if not isinstance(image_file, list):
            image_file = [image_file]

        permute_pairs = [
            [(2, 0, 1), None],
            [(1, 0, 2), (0, 1, 3, 2)],
            [(0, 1, 2), (0, 3, 1, 2)],
        ]
        for file in image_file:
            if data_root_dir is not None:
                savefolder = os.path.join(
                    output_dir,
                    file.replace(data_root_dir, "").split("/")[0],
                    file.replace(data_root_dir, "")
                    .split("/")[1]
                    .replace(".nii.gz", ""),
                )
            else:
                savefolder = os.path.join(
                    output_dir, file.split("/")[-1].replace(".nii.gz", "")
                )
            if os.path.isdir(savefolder):
                print(f"{file} already exist. Skipped")
                continue
            try:
                batch_data = None
                batch_data = transforms.LoadImage(image_only=True)(file)
                orig_data = batch_data.clone()
                batch_data = transforms.ScaleIntensityRange(
                    a_max=1000, a_min=-1000, b_max=255, b_min=0, clip=True
                )(batch_data)
                print(f"[{rank}] working on {file}")
                outputs = None
                torch.cuda.empty_cache()
                features_ = 0
                for views in permute_pairs:
                    data = batch_data.permute(*views[0])
                    features = []
                    max_slice = 8
                    for i in tqdm(range(int(np.ceil(data.shape[0] / max_slice)))):
                        idx = (i * max_slice, min((i + 1) * max_slice, data.shape[0]))
                        image = data[idx[0] : idx[1]]
                        d, h, w = image.shape
                        pad_h = 0 if h > w else w - h
                        pad_w = 0 if w > h else h - w
                        image = torch.nn.functional.pad(
                            image, (0, pad_w, 0, pad_h, 0, 0)
                        )
                        image = monai.transforms.Resize(
                            [d, 1024, 1024], mode="bilinear"
                        )(image.unsqueeze(0)).squeeze(0)
                        image = (
                            torch.stack([image, image, image], -1)
                            .permute(0, 3, 1, 2)
                            .contiguous()
                        )
                        image = (image - pixel_mean) / pixel_std
                        feature = self.model.get_feature_upsampled(
                            image.to(f"cuda:{rank}")
                        )
                        feature = monai.transforms.Resize(
                            [h + pad_h, w + pad_w, d], mode="bilinear"
                        )(feature.permute(1, 2, 3, 0))[:, :h, :w]
                        features.append(feature.cpu())
                    features = torch.cat(features, -1)
                    if views[1] is not None:
                        features = features.permute(*views[1])
                    features_ += features
                    features = None
                start = time.time()
                outputs = slic(
                    features_.numpy(),
                    channel_axis=0,
                    compactness=0.01,
                    n_segments=n_segments,
                    sigma=3,
                )
                features_ = None
                outputs = torch.from_numpy(outputs).cuda()
                print("slic took", time.time() - start)
                mask = monai.transforms.utils.get_largest_connected_component_mask(
                    orig_data < -800, connectivity=None, num_components=1
                ).cuda()
                mask = dilate3d(mask, erosion=3)
                mask = erode3d(mask, erosion=3)
                outputs[mask.to(torch.bool)] = 0
                outputs = monai.data.MetaTensor(
                    outputs, affine=batch_data.affine, meta=batch_data.meta
                )
                monai.transforms.SaveImage(
                    output_dir=output_dir,
                    output_postfix="seg",
                    data_root_dir=data_root_dir,
                )(outputs.unsqueeze(0).cpu().to(torch.int16))
            except BaseException:
                print(f"{file} failed. Skipped.")

    @torch.no_grad()
    @torch.cuda.amp.autocast()
    def batch_infer(
        self,
        datalist=str,
        basedir=str,
        output_dir="./supervoxel_sam/",
        data_root_dir=None,
        n_segments=400,
    ):
        train_files, _ = datafold_read(datalist=datalist, basedir=basedir, fold=0)
        train_files = [_["image"] for _ in train_files]
        dist.init_process_group(backend="nccl", init_method="env://")
        world_size = dist.get_world_size()
        rank = dist.get_rank()
        # no need to wrap model with DistributedDataParallel
        self.model = SamPredictor(self.sam.to(f"cuda:{rank}"))
        infer_files = partition_dataset(
            data=train_files,
            shuffle=False,
            num_partitions=world_size,
            even_divisible=False,
        )[rank]
        self.infer(
            infer_files,
            rank=rank,
            output_dir=output_dir,
            data_root_dir=data_root_dir,
            n_segments=n_segments,
        )


if __name__ == "__main__":
    from monai.utils import optional_import

    inferer = InferClass()
    fire, _ = optional_import("fire")
    fire.Fire(inferer)
