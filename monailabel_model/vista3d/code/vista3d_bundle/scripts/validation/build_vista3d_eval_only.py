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

import numpy as np
import torch
from monai.metrics import compute_dice
from vista3d.modeling import (
    VISTA3D2,
    Class_Mapping_Classify,
    Point_Mapping_SAM,
    SegResNetDS2,
)

from ..utils.workflow_utils import get_next_points_auto_point


class VISTA3D2_eval_only(VISTA3D2):
    @torch.no_grad()
    def point_head_iterative_trial(
        self,
        logits,
        labels,
        out,
        point_coords,
        point_labels,
        class_vector,
        prompt_class,
        n_trials=3,
    ):
        """The prompt class is the local label set while class vector is the mapped global label set"""
        logits_update = logits.detach().clone()
        for trial_idx in range(n_trials):
            if trial_idx == 0:
                point_coords, point_labels = get_next_points_auto_point(
                    logits > 0, labels, prompt_class, class_vector, use_fg=True
                )
            else:
                point_coords, point_labels = get_next_points_auto_point(
                    logits > 0, labels, prompt_class, class_vector, use_fg=False
                )
            mapping_index = ((point_labels != -1).sum(1) > 0).to(torch.bool)
            point_coords = point_coords[mapping_index]
            point_labels = point_labels[mapping_index]
            if (torch.sum(mapping_index) == 1 and mapping_index[0]) or torch.sum(
                mapping_index
            ) == 0:
                return logits
            if trial_idx == 0:
                best_dice = []
                for i in range(len(prompt_class)):
                    dice = compute_dice(
                        y_pred=(logits[[i]] > 0).to(labels.device),
                        y=labels == prompt_class[i],
                    ).item()
                    if np.isnan(dice):
                        best_dice.append(-(logits[[i]] > 0).sum())
                    else:
                        best_dice.append(dice)

            point_logits = self.point_head(
                out,
                point_coords,
                point_labels,
                class_vector=class_vector[mapping_index],
            )

            target_logits = self.connected_components_combine(
                logits, point_logits, point_coords, point_labels, mapping_index
            )
            combine_dice = []
            for i in range(len(prompt_class)):
                if mapping_index[i]:
                    dice = compute_dice(
                        y_pred=(target_logits[[i]] > 0).to(labels.device),
                        y=(labels == prompt_class[i]),
                    ).item()
                    if np.isnan(dice):
                        combine_dice.append(-(target_logits[[i]] > 0).sum())
                    else:
                        combine_dice.append(dice)
                else:
                    combine_dice.append(-1)
            # check the dice for each label
            for i in range(len(prompt_class)):
                if prompt_class[i] == 0:
                    continue
                if combine_dice[i] > best_dice[i]:
                    # print(trial_idx, prompt_class[i], combine_dice[i], best_dice[i])
                    logits_update[i] = copy.deepcopy(target_logits[i])
                    best_dice[i] = copy.deepcopy(combine_dice[i])

        labels, target_logits, logits, best_dice, combine_dice = (
            None,
            None,
            None,
            None,
            None,
        )
        # force releasing memories that set to None
        torch.cuda.empty_cache()
        return logits_update

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
        out, out_auto = self.image_encoder(
            input_images, with_point=True, with_label=True
        )
        input_images = None
        # force releasing memories that set to None
        torch.cuda.empty_cache()
        logits, _ = self.class_head(out_auto, class_vector)
        logits = self.point_head_iterative_trial(
            logits,
            labels[patch_coords],
            out,
            point_coords,
            point_labels,
            class_vector[0],
            prompt_class[0],
            n_trials=3,
        )
        return logits


def build_vista3d_segresnet_decoder(
    encoder_embed_dim=48, in_channels=1, image_size=(96, 96, 96)
):
    segresnet = SegResNetDS2(
        in_channels=in_channels,
        blocks_down=(1, 2, 2, 4, 4),
        norm="instance",
        out_channels=encoder_embed_dim,
        init_filters=encoder_embed_dim,
        dsdepth=1,
    )
    point_head = Point_Mapping_SAM(feature_size=encoder_embed_dim, last_supported=132)
    class_head = Class_Mapping_Classify(
        n_classes=512, feature_size=encoder_embed_dim, use_mlp=True
    )
    vista = VISTA3D2_eval_only(
        image_encoder=segresnet,
        class_head=class_head,
        point_head=point_head,
        feature_size=encoder_embed_dim,
    )
    return vista


vista_model_registry = {"vista3d_segresnet_d": build_vista3d_segresnet_decoder}
