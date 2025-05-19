from __future__ import annotations

import numpy as np
import torch
import torch.nn as nn
from monai.utils import optional_import

from .sam_blocks import MLP, PositionEmbeddingRandom, TwoWayTransformer

rearrange, _ = optional_import("einops", name="rearrange")


class Point_Mapping_SAM(nn.Module):
    def __init__(
        self,
        feature_size,
        max_prompt=32,
        num_add_mask_tokens=2,
        n_classes=512,
        last_supported=132,
    ):
        super().__init__()
        transformer_dim = feature_size
        self.max_prompt = max_prompt
        self.feat_downsample = nn.Sequential(
            nn.Conv3d(
                in_channels=feature_size,
                out_channels=feature_size,
                kernel_size=3,
                stride=2,
                padding=1,
            ),
            nn.InstanceNorm3d(feature_size),
            nn.GELU(),
            nn.Conv3d(
                in_channels=feature_size,
                out_channels=transformer_dim,
                kernel_size=3,
                stride=1,
                padding=1,
            ),
            nn.InstanceNorm3d(feature_size),
        )

        self.mask_downsample = nn.Conv3d(
            in_channels=2, out_channels=2, kernel_size=3, stride=2, padding=1
        )

        self.transformer = TwoWayTransformer(
            depth=2,
            embedding_dim=transformer_dim,
            mlp_dim=512,
            num_heads=4,
        )
        self.pe_layer = PositionEmbeddingRandom(transformer_dim // 2)
        self.point_embeddings = nn.ModuleList(
            [nn.Embedding(1, transformer_dim), nn.Embedding(1, transformer_dim)]
        )
        self.not_a_point_embed = nn.Embedding(1, transformer_dim)
        self.special_class_embed = nn.Embedding(1, transformer_dim)
        self.mask_tokens = nn.Embedding(1, transformer_dim)

        self.output_upscaling = nn.Sequential(
            nn.ConvTranspose3d(
                transformer_dim,
                transformer_dim,
                kernel_size=3,
                stride=2,
                padding=1,
                output_padding=1,
            ),
            nn.InstanceNorm3d(transformer_dim),
            nn.GELU(),
            nn.Conv3d(
                transformer_dim, transformer_dim, kernel_size=3, stride=1, padding=1
            ),
        )

        self.output_hypernetworks_mlps = MLP(
            transformer_dim, transformer_dim, transformer_dim, 3
        )

        ## MultiMask output
        self.num_add_mask_tokens = num_add_mask_tokens
        self.output_add_hypernetworks_mlps = nn.ModuleList(
            [
                MLP(transformer_dim, transformer_dim, transformer_dim, 3)
                for i in range(self.num_add_mask_tokens)
            ]
        )
        # class embedding
        self.n_classes = n_classes
        self.last_supported = last_supported
        self.class_embeddings = nn.Embedding(n_classes, feature_size)
        self.zeroshot_embed = nn.Embedding(1, transformer_dim)
        self.supported_embed = nn.Embedding(1, transformer_dim)

    def forward(self, out, point_coords, point_labels, class_vector=None):
        # downsample out
        out_low = self.feat_downsample(out)
        out_shape = out.shape[-3:]
        out = None
        torch.cuda.empty_cache()
        # embed points
        points = point_coords + 0.5  # Shift to center of pixel
        point_embedding = self.pe_layer.forward_with_coords(points, out_shape)
        point_embedding[point_labels == -1] = 0.0
        point_embedding[point_labels == -1] += self.not_a_point_embed.weight
        point_embedding[point_labels == 0] += self.point_embeddings[0].weight
        point_embedding[point_labels == 1] += self.point_embeddings[1].weight
        point_embedding[point_labels == 2] += (
            self.point_embeddings[0].weight + self.special_class_embed.weight
        )
        point_embedding[point_labels == 3] += (
            self.point_embeddings[1].weight + self.special_class_embed.weight
        )
        output_tokens = self.mask_tokens.weight

        output_tokens = output_tokens.unsqueeze(0).expand(
            point_embedding.size(0), -1, -1
        )
        if class_vector is None:
            tokens_all = torch.cat(
                (
                    output_tokens,
                    point_embedding,
                    self.supported_embed.weight.unsqueeze(0).expand(
                        point_embedding.size(0), -1, -1
                    ),
                ),
                dim=1,
            )
            # tokens_all = torch.cat((output_tokens, point_embedding), dim=1)
        else:
            class_embeddings = []
            for i in class_vector:
                if i > self.last_supported:
                    class_embeddings.append(self.zeroshot_embed.weight)
                else:
                    class_embeddings.append(self.supported_embed.weight)
            class_embeddings = torch.stack(class_embeddings)
            tokens_all = torch.cat(
                (output_tokens, point_embedding, class_embeddings), dim=1
            )
        # cross attention
        masks = []
        max_prompt = self.max_prompt
        for i in range(int(np.ceil(tokens_all.shape[0] / max_prompt))):
            # remove variables in previous for loops to save peak memory for self.transformer
            src, upscaled_embedding, hyper_in = None, None, None
            torch.cuda.empty_cache()
            idx = (i * max_prompt, min((i + 1) * max_prompt, tokens_all.shape[0]))
            tokens = tokens_all[idx[0] : idx[1]]
            src = torch.repeat_interleave(out_low, tokens.shape[0], dim=0)
            pos_src = torch.repeat_interleave(
                self.pe_layer(out_low.shape[-3:]).unsqueeze(0), tokens.shape[0], dim=0
            )
            b, c, h, w, d = src.shape
            hs, src = self.transformer(src, pos_src, tokens)
            mask_tokens_out = hs[:, :1, :]
            hyper_in = self.output_hypernetworks_mlps(mask_tokens_out)
            src = src.transpose(1, 2).view(b, c, h, w, d)
            upscaled_embedding = self.output_upscaling(src)
            b, c, h, w, d = upscaled_embedding.shape
            masks.append(
                (hyper_in @ upscaled_embedding.view(b, c, h * w * d)).view(
                    b, -1, h, w, d
                )
            )
        masks = torch.vstack(masks)
        return masks
