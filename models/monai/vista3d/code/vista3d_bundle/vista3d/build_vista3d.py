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


from .modeling import VISTA3D2, Class_Mapping_Classify, Point_Mapping_SAM, SegResNetDS2


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
    vista = VISTA3D2(
        image_encoder=segresnet,
        class_head=class_head,
        point_head=point_head,
        feature_size=encoder_embed_dim,
    )
    return vista


vista_model_registry = {"vista3d_segresnet_d": build_vista3d_segresnet_decoder}
