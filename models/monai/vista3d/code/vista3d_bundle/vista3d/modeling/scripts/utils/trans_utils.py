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

from collections.abc import Hashable, Mapping

import numpy as np
import torch
import torch.nn.functional as F
from monai.config import DtypeLike, KeysCollection
from monai.config.type_definitions import NdarrayOrTensor, NdarrayTensor
from monai.data.meta_obj import get_track_meta
from monai.data.meta_tensor import MetaTensor
from monai.transforms import (
    MapLabelValue,
    MapTransform,
    RandCropByLabelClasses,
    RandCropByLabelClassesd,
    SpatialCrop,
)
from monai.utils import ImageMetaKey as Key
from monai.utils import (
    convert_data_type,
    ensure_tuple_rep,
    fall_back_tuple,
    look_up_option,
    min_version,
    optional_import,
)
from monai.utils.type_conversion import convert_to_dst_type

measure, has_measure = optional_import("skimage.measure", "0.14.2", min_version)
morphology, has_morphology = optional_import("skimage.morphology")
ndimage, _ = optional_import("scipy.ndimage")
cp, has_cp = optional_import("cupy")
cp_ndarray, _ = optional_import("cupy", name="ndarray")
exposure, has_skimage = optional_import("skimage.exposure")

__all__ = [
    "get_largest_connected_component_mask",
    "RandCropByLabelClassesShiftd",
    "erode3d",
    "erode2d",
    "dilate3d",
    "VistaPostTransform",
    "convert_points_to_disc",
]


def convert_points_to_disc(image_size, point, point_label, radius=2, disc=False):
    # [b, N, 3], [b, N]
    # generate masks [b,2,h,w,d]
    if not torch.is_tensor(point):
        point = torch.from_numpy(point)
    masks = torch.zeros(
        [point.shape[0], 2, image_size[0], image_size[1], image_size[2]],
        device=point.device,
    )
    row_array = torch.arange(
        start=0, end=image_size[0], step=1, dtype=torch.float32, device=point.device
    )
    col_array = torch.arange(
        start=0, end=image_size[1], step=1, dtype=torch.float32, device=point.device
    )
    z_array = torch.arange(
        start=0, end=image_size[2], step=1, dtype=torch.float32, device=point.device
    )
    coord_rows, coord_cols, coord_z = torch.meshgrid(z_array, col_array, row_array)
    # [1,3,h,w,d] -> [b, 2, 3, h,w,d]
    coords = (
        torch.stack((coord_rows, coord_cols, coord_z), dim=0)
        .unsqueeze(0)
        .unsqueeze(0)
        .repeat(point.shape[0], 2, 1, 1, 1, 1)
    )
    for b in range(point.shape[0]):
        for n in range(point.shape[1]):
            if point_label[b, n] > -1:
                channel = 0 if (point_label[b, n] == 0 or point_label[b, n] == 2) else 1
                if disc:
                    masks[b, channel] += (
                        torch.pow(
                            coords[b, channel]
                            - point[b, n].unsqueeze(-1).unsqueeze(-1).unsqueeze(-1),
                            2,
                        ).sum(0)
                        < radius**2
                    )
                else:
                    masks[b, channel] += torch.exp(
                        -torch.pow(
                            coords[b, channel]
                            - point[b, n].unsqueeze(-1).unsqueeze(-1).unsqueeze(-1),
                            2,
                        ).sum(0)
                        / (2 * radius**2)
                    )
    # masks[masks>1] = 1
    return masks


def erode3d(input_tensor, erosion=3):
    # Define the structuring element
    erosion = ensure_tuple_rep(erosion, 3)
    structuring_element = torch.ones(1, 1, erosion[0], erosion[1], erosion[2]).to(
        input_tensor.device
    )

    # Pad the input tensor to handle border pixels
    input_padded = F.pad(
        input_tensor.float().unsqueeze(0).unsqueeze(0),
        (
            erosion[2] // 2,
            erosion[2] // 2,
            erosion[1] // 2,
            erosion[1] // 2,
            erosion[0] // 2,
            erosion[0] // 2,
        ),
        mode="constant",
        value=1.0,
    )

    # Apply erosion operation
    output = F.conv3d(input_padded, structuring_element, padding=0)

    # Set output values based on the minimum value within the structuring element
    output = torch.where(output == torch.sum(structuring_element), 1.0, 0.0)

    return output.squeeze(0).squeeze(0)


def erode2d(input_tensor, erosion=3):
    # Define the structuring element
    erosion = ensure_tuple_rep(erosion, 2)
    structuring_element = torch.ones(1, 1, erosion[0], erosion[1]).to(
        input_tensor.device
    )

    # Pad the input tensor to handle border pixels
    input_padded = F.pad(
        input_tensor.float().unsqueeze(0).unsqueeze(0),
        (erosion[1] // 2, erosion[1] // 2, erosion[0] // 2, erosion[0] // 2),
        mode="constant",
        value=1.0,
    )

    # Apply erosion operation
    output = F.conv2d(input_padded, structuring_element, padding=0)

    # Set output values based on the minimum value within the structuring element
    output = torch.where(output == torch.sum(structuring_element), 1.0, 0.0)

    return output.squeeze(0).squeeze(0)


def dilate3d(input_tensor, erosion=3):
    # Define the structuring element
    erosion = ensure_tuple_rep(erosion, 3)
    structuring_element = torch.ones(1, 1, erosion[0], erosion[1], erosion[2]).to(
        input_tensor.device
    )

    # Pad the input tensor to handle border pixels
    input_padded = F.pad(
        input_tensor.float().unsqueeze(0).unsqueeze(0),
        (
            erosion[2] // 2,
            erosion[2] // 2,
            erosion[1] // 2,
            erosion[1] // 2,
            erosion[0] // 2,
            erosion[0] // 2,
        ),
        mode="constant",
        value=0.0,
    )

    # Apply erosion operation
    output = F.conv3d(input_padded, structuring_element, padding=0)

    # Set output values based on the minimum value within the structuring element
    output = torch.where(output > 0, 1.0, 0.0)

    return output.squeeze(0).squeeze(0)


def get_largest_connected_component_point(
    img: NdarrayTensor, point_coords=None, point_labels=None
) -> NdarrayTensor:
    """
    Gets the largest connected component mask of an image. img is before post process! And will include NaN values.
    Args:
        img: [1, B, H, W, D]
        point_coords [B, N, 3]
        point_labels [B, N]
    """
    outs = torch.zeros_like(img)
    for c in range(len(point_coords)):
        if not ((point_labels[c] == 3).any() or (point_labels[c] == 1).any()):
            continue
        coords = (
            point_coords[c, point_labels[c] == 3].tolist()
            + point_coords[c, point_labels[c] == 1].tolist()
        )
        not_nan_mask = ~torch.isnan(img[0, c])
        img_ = torch.nan_to_num(img[0, c] > 0, 0)
        img_, *_ = convert_data_type(img_, np.ndarray)
        label = measure.label
        features = label(img_, connectivity=3)
        pos_mask = torch.from_numpy(img_).to(img.device) > 0
        # if num features less than max desired, nothing to do.
        features = torch.from_numpy(features).to(img.device)
        # generate a map with all pos points
        idx = []
        for p in coords:
            idx.append(features[round(p[0]), round(p[1]), round(p[2])].item())
        idx = list(set(idx))
        for i in idx:
            if i == 0:
                continue
            outs[0, c] += features == i
        outs = outs > 0
        # find negative mean value
        fill_in = img[0, c][torch.logical_and(~outs[0, c], not_nan_mask)].mean()
        img[0, c][torch.logical_and(pos_mask, ~outs[0, c])] = fill_in
    return img


def get_largest_connected_component_mask(
    img_pos: NdarrayTensor,
    img_neg: NdarrayTensor,
    connectivity: int | None = None,
    num_components: int = 1,
    point_coords=None,
    point_labels=None,
    margins=3,
) -> NdarrayTensor:
    """
    Gets the largest connected component mask of an image that include the point_coords.
    Args:
        img_pos: [1, B, H, W, D]
        point_coords [B, N, 3]
        point_labels [B, N]
    """
    # use skimage/cucim.skimage and np/cp depending on whether packages are
    # available and input is non-cpu torch.tensor
    #     cucim, has_cucim = optional_import("cucim")

    #     use_cp = has_cp and has_cucim and isinstance(img_pos, torch.Tensor) and img_pos.device != torch.device("cpu")
    #     if use_cp:
    #         img_pos_ = convert_to_cupy(img_pos.short())  # type: ignore
    #         img_neg_ = convert_to_cupy(img_neg.short())  # type: ignore
    #         label = cucim.skimage.measure.label
    #         lib = cp
    #     else:
    #         if not has_measure:
    #             raise RuntimeError("Skimage.measure required.")
    #         img_pos_, *_ = convert_data_type(img_pos, np.ndarray)
    #         img_neg_, *_ = convert_data_type(img_neg, np.ndarray)
    #         label = measure.label
    #         lib = np
    img_pos_, *_ = convert_data_type(img_pos, np.ndarray)
    img_neg_, *_ = convert_data_type(img_neg, np.ndarray)
    label = measure.label
    lib = np
    # features will be an image -- 0 for background and then each different
    # feature will have its own index.
    # features, num_features = label(img_, connectivity=connectivity, return_num=True)

    features_pos, num_features = label(img_pos_, connectivity=3, return_num=True)
    features_neg, num_features = label(img_neg_, connectivity=3, return_num=True)
    # if num features less than max desired, nothing to do.
    outs = np.zeros_like(img_pos_)
    for bs in range(point_coords.shape[0]):
        for i, p in enumerate(point_coords[bs]):
            if point_labels[bs, i] == 1 or point_labels[bs, i] == 3:
                features = features_pos
            elif point_labels[bs, i] == 0 or point_labels[bs, i] == 2:
                features = features_neg
            else:
                # if -1 padding point, skip
                continue
            for margin in range(margins):
                left, right = max(p[0].round().int().item() - margin, 0), min(
                    p[0].round().int().item() + margin + 1, features.shape[-3]
                )
                t, d = max(p[1].round().int().item() - margin, 0), min(
                    p[1].round().int().item() + margin + 1, features.shape[-2]
                )
                f, b = max(p[2].round().int().item() - margin, 0), min(
                    p[2].round().int().item() + margin + 1, features.shape[-1]
                )
                if (features[bs, 0, left:right, t:d, f:b] > 0).any():
                    index = features[bs, 0, left:right, t:d, f:b].max()
                    outs[[bs]] += lib.isin(features[[bs]], index)
                    break
    outs[outs > 1] = 1
    outs = convert_to_dst_type(outs, dst=img_pos, dtype=outs.dtype)[0]
    return outs


class VistaPostTransform(MapTransform):
    def __init__(
        self,
        keys: KeysCollection,
        allow_missing_keys: bool = False,
    ) -> None:
        """
        Args:
            keys: keys of the corresponding items to be transformed.
            dataset_transforms: a dictionary specifies the transform for corresponding dataset:
                key: dataset name, value: list of data transforms.
            dataset_key: key to get the dataset name from the data dictionary, default to "dataset_name".
            allow_missing_keys: don't raise exception if key is missing.

        """
        super().__init__(keys, allow_missing_keys)

    def __call__(
        self, data: Mapping[Hashable, NdarrayOrTensor]
    ) -> dict[Hashable, NdarrayOrTensor]:
        for keys in self.keys:
            if keys in data:
                pred = data[keys]
                object_num = pred.shape[0]
                # device = pred.device
                pred[pred < 0] = 0.0
                # if it's multichannel, perform argmax
                if object_num > 1:
                    # concate background channel. Make sure user did not provide 0 as prompt.
                    is_bk = torch.all(pred <= 0, dim=0, keepdim=True)
                    pred = pred.argmax(0).unsqueeze(0).float() + 1.0
                    pred[is_bk] = 0.0
                else:
                    # AsDiscrete will remove NaN
                    # pred = monai.transforms.AsDiscrete(threshold=0.5)(pred)
                    pred[pred > 0] = 1.0
                if "label_prompt" in data and data["label_prompt"] is not None:
                    pred += 0.5  # inplace mapping to avoid cloning pred
                    for i in range(1, object_num + 1):
                        frac = i + 0.5
                        pred[pred == frac] = torch.tensor(
                            data["label_prompt"][i - 1]
                        ).to(pred.dtype)
                    pred[pred == 0.5] = 0.0
                data[keys] = pred
        return data


class RandCropByLabelClassesShift(RandCropByLabelClasses):
    def __call__(
        self,
        img: torch.Tensor,
        label: torch.Tensor | None = None,
        image: torch.Tensor | None = None,
        indices: list[NdarrayOrTensor] | None = None,
        randomize: bool = True,
        lazy: bool | None = None,
    ) -> list[torch.Tensor]:
        """
        Args:
            img: input data to crop samples from based on the ratios of every class, assumes `img` is a
                channel-first array.
            label: the label image that is used for finding indices of every class, if None, use `self.label`.
            image: optional image data to help select valid area, can be same as `img` or another image array.
                use ``image > image_threshold`` to select the centers only in valid region. if None, use `self.image`.
            indices: list of indices for every class in the image, used to randomly select crop centers.
            randomize: whether to execute the random operations, default to `True`.
            lazy: a flag to override the lazy behaviour for this call, if set. Defaults to None.
        """
        if image is None:
            image = self.image
        if randomize:
            if label is None:
                label = self.label
            self.randomize(label, indices, image)
        results: list[torch.Tensor] = []
        if self.centers is not None:
            img_shape = (
                img.peek_pending_shape()
                if isinstance(img, MetaTensor)
                else img.shape[1:]
            )
            roi_size = fall_back_tuple(self.spatial_size, default=img_shape)
            lazy_ = self.lazy if lazy is None else lazy
            for i, center in enumerate(self.centers):
                for i in range(3):
                    center[i] = min(
                        img_shape[i],
                        max(
                            0,
                            np.random.randint(-roi_size[i] // 3, roi_size[i] // 3)
                            + center[i],
                        ),
                    )
                cropper = SpatialCrop(
                    roi_center=tuple(center), roi_size=roi_size, lazy=lazy_
                )
                cropped = cropper(img)
                if get_track_meta():
                    ret_: MetaTensor = cropped  # type: ignore
                    ret_.meta[Key.PATCH_INDEX] = i
                    ret_.meta["crop_center"] = center
                    self.push_transform(ret_, replace=True, lazy=lazy_)
                results.append(cropped)

        return results


class RandCropByLabelClassesShiftd(RandCropByLabelClassesd):
    backend = RandCropByLabelClassesShift.backend


class RelabelD(MapTransform):
    def __init__(
        self,
        keys: KeysCollection,
        label_mappings: dict[str, list[tuple[int, int]]],
        dtype: DtypeLike = np.int16,
        dataset_key: str = "dataset_name",
        allow_missing_keys: bool = False,
    ) -> None:
        """
        Args:
            keys: keys of the corresponding items to be transformed.
            label_mappings: a dictionary specifies how local dataset class indices are mapped to the
                global class indices, format:
                key: dataset name, value: list of (local label, global label) pairs
                set this argument to "{}" to disable relabeling.
            dtype: convert the output data to dtype, default to float32.
            dataset_key: key to get the dataset name from the data dictionary, default to "dataset_name".
            allow_missing_keys: don't raise exception if key is missing.

        """
        super().__init__(keys, allow_missing_keys)
        self.mappers = {}
        self.dataset_key = dataset_key
        for name, mapping in label_mappings.items():
            self.mappers[name] = MapLabelValue(
                orig_labels=[pair[0] for pair in mapping],
                target_labels=[pair[1] for pair in mapping],
                dtype=dtype,
            )

    def __call__(
        self, data: Mapping[Hashable, NdarrayOrTensor]
    ) -> dict[Hashable, NdarrayOrTensor]:
        d = dict(data)
        dataset_name = d.get(self.dataset_key, "default")
        _m = look_up_option(dataset_name, self.mappers, default=None)
        if not _m:
            return d
        for key in self.key_iterator(d):
            d[key] = _m(d[key])
        return d


class DatasetSelectTansformd(MapTransform):
    def __init__(
        self,
        keys: KeysCollection,
        dataset_transforms,
        dataset_key: str = "dataset_name",
        allow_missing_keys: bool = False,
    ) -> None:
        """
        Args:
            keys: keys of the corresponding items to be transformed.
            dataset_transforms: a dictionary specifies the transform for corresponding dataset:
                key: dataset name, value: list of data transforms.
            dataset_key: key to get the dataset name from the data dictionary, default to "dataset_name".
            allow_missing_keys: don't raise exception if key is missing.

        """
        super().__init__(keys, allow_missing_keys)
        self.dataset_transforms = dataset_transforms
        self.dataset_key = dataset_key

    def __call__(
        self, data: Mapping[Hashable, NdarrayOrTensor]
    ) -> dict[Hashable, NdarrayOrTensor]:
        d = dict(data)
        dataset_name = d[self.dataset_key]
        _m = self.dataset_transforms[dataset_name]
        if _m is None:
            return d
        return _m(d)
