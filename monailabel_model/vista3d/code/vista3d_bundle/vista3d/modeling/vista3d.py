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

import monai
import numpy as np
import torch
import torch.nn as nn
from monai.utils import optional_import
from .scripts.utils.trans_utils import convert_points_to_disc
from .scripts.utils.trans_utils import get_largest_connected_component_mask as lcc
from .scripts.utils.workflow_utils import sample_points_patch_val

rearrange, _ = optional_import("einops", name="rearrange")
NINF_VALUE = -9999
PINF_VALUE = 9999


class VISTA3D2(nn.Module):
    def __init__(self, image_encoder, class_head, point_head, feature_size):
        super().__init__()
        self.image_encoder = image_encoder
        self.class_head = class_head
        self.point_head = point_head
        self.image_embeddings = None
        self.weight_mapper = nn.Sequential(
            nn.Linear(feature_size, 4 * feature_size),
            nn.GELU(),
            nn.InstanceNorm1d(4 * feature_size),
            nn.Linear(4 * feature_size, 1),
        )
        self.auto_freeze = False
        self.point_freeze = False

    def precompute_embedding(self, input_images):
        """precompute image embedding, require sliding window inference"""
        raise NotImplementedError

    def clear_cache(self):
        self.image_embeddings = None

    def get_bs(self, class_vector, point_coords):
        if class_vector is None:
            assert point_coords is not None, "prompt is required"
            return point_coords.shape[0]
        else:
            return class_vector.shape[0]

    def update_point_to_patch(self, patch_coords, point_coords, point_labels):
        """Update point_coords with respect to patch coords.
        If point is outside of the patch, remove the coordinates and set label to -1
        """
        patch_ends = [
            patch_coords[-3].stop,
            patch_coords[-2].stop,
            patch_coords[-1].stop,
        ]
        patch_starts = [
            patch_coords[-3].start,
            patch_coords[-2].start,
            patch_coords[-1].start,
        ]
        # update point coords
        patch_starts = (
            torch.tensor(patch_starts, device=point_coords.device)
            .unsqueeze(0)
            .unsqueeze(0)
        )
        patch_ends = (
            torch.tensor(patch_ends, device=point_coords.device)
            .unsqueeze(0)
            .unsqueeze(0)
        )
        # [1 N 1]
        indices = torch.logical_and(
            ((point_coords - patch_starts) > 0).all(2),
            ((patch_ends - point_coords) > 0).all(2),
        )
        # check if it's within patch coords
        point_coords = point_coords.clone() - patch_starts
        point_labels = point_labels.clone()
        if indices.any():
            point_labels[~indices] = -1
            point_coords[~indices] = 0
            # also remove padded points, mainly used for inference.
            not_pad_indices = (point_labels != -1).any(0)
            point_coords = point_coords[:, not_pad_indices]
            point_labels = point_labels[:, not_pad_indices]
        else:
            point_coords = None
            point_labels = None
        return point_coords, point_labels

    def connected_components_combine(
        self, logits, point_logits, point_coords, point_labels, mapping_index, thred=0.5
    ):
        """Combine auto results with point click response, or combine previous mask with point click response.
        For mapping_index with point clicks, NaN values in logits will be replaced with point_logits. Meanwhile, the added/removed
        region in point clicks must be updated by the lcc function. Notice, if a positive point is within logits/prev_mask, the components containing the positive point
        will be added.
        """
        logits = (
            logits.as_tensor() if isinstance(logits, monai.data.MetaTensor) else logits
        )
        _logits = logits[mapping_index]
        inside = []
        for i in range(_logits.shape[0]):
            inside.append(
                np.any(
                    [
                        _logits[
                            i,
                            0,
                            round(p[0].item()),
                            round(p[1].item()),
                            round(p[2].item()),
                        ].item()
                        > 0
                        for p in point_coords[i]
                    ]
                )
            )
        inside = torch.tensor(inside).to(logits.device)
        nan_mask = torch.isnan(_logits)
        _logits = torch.nan_to_num(_logits, nan=NINF_VALUE).sigmoid()
        pos_region = point_logits.sigmoid() > thred
        diff_pos = torch.logical_and(
            torch.logical_or(
                (_logits <= thred),
                inside.unsqueeze(-1).unsqueeze(-1).unsqueeze(-1).unsqueeze(-1),
            ),
            pos_region,
        )
        diff_neg = torch.logical_and((_logits > thred), ~pos_region)
        cc = lcc(
            diff_pos, diff_neg, point_coords=point_coords, point_labels=point_labels
        )
        # cc is the region that can be updated by point_logits.
        cc = cc.to(logits.device)
        # Need to replace NaN with point_logits. diff_neg will never lie in nan_mask, only remove unconnected positive region.
        uc_pos_region = torch.logical_and(pos_region, ~cc)
        fill_mask = torch.logical_and(nan_mask, uc_pos_region)
        if fill_mask.any():
            # fill in the mean negative value
            point_logits[fill_mask] = -1
        # replace logits nan value and cc with point_logits
        cc = torch.logical_or(nan_mask, cc).to(logits.dtype)
        logits[mapping_index] *= 1 - cc
        logits[mapping_index] += cc * point_logits
        # debug_ccp(_logits, point_logits.sigmoid(), point_coords, point_labels, diff, cc, logits[mapping_index], np.random.randint(10000))
        return logits

    def gaussian_combine(
        self, logits, point_logits, point_coords, point_labels, mapping_index, radius
    ):
        """Combine point results with auto results using gaussian."""
        if radius is None:
            radius = min(point_logits.shape[-3:]) // 5  # empirical value 5
        weight = 1 - convert_points_to_disc(
            point_logits.shape[-3:], point_coords, point_labels, radius=radius
        ).sum(1, keepdims=True)
        weight[weight < 0] = 0
        logits = (
            logits.as_tensor() if isinstance(logits, monai.data.MetaTensor) else logits
        )
        logits[mapping_index] *= weight
        logits[mapping_index] += (1 - weight) * point_logits
        return logits

    def set_auto_grad(self, auto_freeze=False, point_freeze=False):
        """Freeze auto-branch or point-branch"""
        if auto_freeze != self.auto_freeze:
            if hasattr(self.image_encoder, "set_auto_grad"):
                self.image_encoder.set_auto_grad(
                    auto_freeze=auto_freeze, point_freeze=point_freeze
                )
            else:
                for param in self.image_encoder.parameters():
                    param.requires_grad = (not auto_freeze) and (not point_freeze)
            for param in self.class_head.parameters():
                param.requires_grad = not auto_freeze
            self.auto_freeze = auto_freeze

        if point_freeze != self.point_freeze:
            if hasattr(self.image_encoder, "set_auto_grad"):
                self.image_encoder.set_auto_grad(
                    auto_freeze=auto_freeze, point_freeze=point_freeze
                )
            else:
                for param in self.image_encoder.parameters():
                    param.requires_grad = (not auto_freeze) and (not point_freeze)
            for param in self.point_head.parameters():
                param.requires_grad = not point_freeze
            self.point_freeze = point_freeze

    def forward(
        self,
        input_images,
        point_coords=None,
        point_labels=None,
        class_vector=None,
        prompt_class=None,
        patch_coords=None,
        labels=None,
        label_set=None,
        prev_mask=None,
        radius=None,
        val_point_sampler=None,
        **kwargs,
    ):
        """
        The forward function for VISTA3D. We only support single patch in training and inference.
        One exception is allowing sliding window batch size > 1 for automatic segmentation only case.
        B represents number of objects, N represents number of points for each objects.
        Args:
            input_images: [1, 1, H, W, D]
            point_coords: [B, N, 3]
            point_labels: [B, N], -1 represents padding. 0/1 means negative/positive points for regular class.
                          2/3 means negative/postive ponits for special supported class like tumor.
            class_vector: [B, 1], the global class index
            prompt_class: [B, 1], the global class index. This value is associated with point_coords to identify if
                          the points are for zero-shot or supported class. When class_vector and point_coords are both
                          provided, prompt_class is the same as class_vector. For prompt_class[b] > 512, point_coords[b]
                          will be considered novel class.
            patch_coords: the python slice object representing the patch coordinates during sliding window inference. This value is
                          passed from monai_utils.sliding_window_inferer. This is an indicator for training phase or validation phase.
            labels: [1, 1, H, W, D], the groundtruth label tensor, only used for point-only evaluation
            label_set: the label index matching the indexes in labels. If labels are mapped to global index using RelabelID,
                       this label_set should be global mapped index. If labels are not mapped to global index, e.g. in zero-shot
                       evaluation, this label_set should be the original index.
            prev_mask: [B, N, H_fullsize, W_fullsize, D_fullsize]. This is the transposed raw output from sliding_window_inferer before
                       any postprocessing. When user click points to perform auto-results correction, this can be the auto-results.
            radius: single float value controling the gaussian blur when combining point and auto results. The gaussian combine is not used
                    in VISTA3D training but might be useful for finetuning purposes.
            val_point_sampler: function used to sample points from labels. This is only used for point-only evaluation.

        """
        image_size = input_images.shape[-3:]
        device = input_images.device
        if point_coords is None and class_vector is None:
            return NINF_VALUE + torch.zeros([1, 1, *image_size], device=device)

        bs = self.get_bs(class_vector, point_coords)
        if patch_coords is not None:
            # if during validation and perform enable based point-validation.
            if labels is not None and label_set is not None:
                # if labels is not None, sample from labels for each patch.
                if val_point_sampler is None:
                    val_point_sampler = sample_points_patch_val
                point_coords, point_labels, prompt_class = val_point_sampler(
                    labels, patch_coords, label_set
                )
                if prompt_class[0].item() == 0:
                    point_labels[0] = -1
                labels, prev_mask = None, None
            elif point_coords is not None:
                # If not performing patch-based point only validation, use user provided click points for inference.
                # the point clicks is in original image space, convert it to current patch-coordinate space.
                point_coords, point_labels = self.update_point_to_patch(
                    patch_coords, point_coords, point_labels
                )

        if point_coords is not None and point_labels is not None:
            # remove points that used for padding purposes (point_label = -1)
            mapping_index = ((point_labels != -1).sum(1) > 0).to(torch.bool)
            if mapping_index.any():
                point_coords = point_coords[mapping_index]
                point_labels = point_labels[mapping_index]
                if prompt_class is not None:
                    prompt_class = prompt_class[mapping_index]
            else:
                if self.auto_freeze or (class_vector is None and patch_coords is None):
                    # if auto_freeze, point prompt must exist to allow loss backward
                    # in training, class_vector and point cannot both be None due to loss.backward()
                    mapping_index.fill_(True)
                else:
                    point_coords, point_labels = None, None

        if point_coords is None and class_vector is None:
            return NINF_VALUE + torch.zeros([bs, 1, *image_size], device=device)

        if (
            self.image_embeddings is not None
            and kwargs.get("keep_cache", False)
            and class_vector is None
        ):
            out, out_auto = self.image_embeddings, None
        else:
            out, out_auto = self.image_encoder(
                input_images,
                with_point=point_coords is not None,
                with_label=class_vector is not None,
            )
        input_images = None

        # force releasing memories that set to None
        torch.cuda.empty_cache()
        if class_vector is not None:
            logits, _ = self.class_head(out_auto, class_vector)
            if point_coords is not None:
                point_logits = self.point_head(
                    out, point_coords, point_labels, class_vector=prompt_class
                )
                if patch_coords is None:
                    logits = self.gaussian_combine(
                        logits,
                        point_logits,
                        point_coords,
                        point_labels,
                        mapping_index,
                        radius,
                    )
                else:
                    # during validation use largest component
                    logits = self.connected_components_combine(
                        logits, point_logits, point_coords, point_labels, mapping_index
                    )
        else:
            logits = NINF_VALUE + torch.zeros(
                [bs, 1, *image_size], device=device, dtype=out.dtype
            )
            logits[mapping_index] = self.point_head(
                out, point_coords, point_labels, class_vector=prompt_class
            )
            if prev_mask is not None and patch_coords is not None:
                logits = self.connected_components_combine(
                    prev_mask[patch_coords].transpose(1, 0).to(logits.device),
                    logits[mapping_index],
                    point_coords,
                    point_labels,
                    mapping_index,
                )

        if kwargs.get("keep_cache", False) and class_vector is None:
            self.image_embeddings = out.detach()
        return logits
