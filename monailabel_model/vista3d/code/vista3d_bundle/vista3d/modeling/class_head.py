import monai
import torch
import torch.nn as nn


class Class_Mapping_Classify(nn.Module):
    def __init__(self, n_classes, feature_size, use_mlp=False):
        super().__init__()
        self.use_mlp = use_mlp
        if use_mlp:
            self.mlp = nn.Sequential(
                nn.Linear(feature_size, feature_size),
                nn.InstanceNorm1d(1),
                nn.GELU(),
                nn.Linear(feature_size, feature_size),
            )
        self.class_embeddings = nn.Embedding(n_classes, feature_size)
        self.image_post_mapping = nn.Sequential(
            monai.networks.blocks.UnetrBasicBlock(
                spatial_dims=3,
                in_channels=feature_size,
                out_channels=feature_size,
                kernel_size=3,
                stride=1,
                norm_name="instance",
                res_block=True,
            ),
            monai.networks.blocks.UnetrBasicBlock(
                spatial_dims=3,
                in_channels=feature_size,
                out_channels=feature_size,
                kernel_size=3,
                stride=1,
                norm_name="instance",
                res_block=True,
            ),
        )

    def forward(self, src, class_vector):
        b, c, h, w, d = src.shape
        src = self.image_post_mapping(src)
        class_embedding = self.class_embeddings(class_vector)
        if self.use_mlp:
            class_embedding = self.mlp(class_embedding)
        # [b,1,feat] @ [1,feat,dim], batch dimension become class_embedding batch dimension.
        masks = []
        for i in range(b):
            mask = (class_embedding @ src[[i]].view(1, c, h * w * d)).view(
                -1, 1, h, w, d
            )
            masks.append(mask)
        masks = torch.cat(masks, 1)
        return masks, class_embedding
