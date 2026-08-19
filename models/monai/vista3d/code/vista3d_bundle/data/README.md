#### Aggregating multiple datasets

The training workflow requires one or multiple dataset JSON files to specifiy the image and segmentation pairs as well as dataset preprocessing transformations.
Example files are located in the `data/jsons` folder.

The JSON file has the following structure:
```python
{
    "training": [
        {
            "image": "img1.nii.gz",  # relative path to the primary image file
            "label": "label1.nii.gz",  # optional relative path to the primary label file
            "pseudo_label": "p_label1.nii.gz",  # optional relative path to the pseudo label file
            "pseudo_label_reliability": 1  # optional reliability score for pseudo label
            "label_sv": "label_sv1.nii.gz",  # optional relative path to the supervoxel label file
            "fold": 0  # optional fold index for cross validation, fold 0 is used for training
        },

        ...
    ],
    "training_transform": [
        # a set of monai transform configuration for dataset-specific loading
    ],
    "original_label_dict": {"1": "liver", ...},
    "label_dict": {"1": "liver", ...}
}
```

During training, the JSON files will be consumed along with additional configurations, for example:
```py
from data.datasets import get_datalist_with_dataset_name_and_transform

train_files, _, dataset_specific_transforms, dataset_specific_transforms_val = \
    get_datalist_with_dataset_name_and_transform(
        datasets=train_datasets,
        fold_idx=fold,
        image_key=image_key,
        label_key=label_key,
        label_sv_key=label_sv_key,
        pseudo_label_key=pseudo_label_key,
        num_patches_per_image=parser.get_parsed_content("num_patches_per_image"),
        patch_size=parser.get_parsed_content("patch_size"),
        json_dir=json_dir)
```

The following steps are necessary for creating a multi-dataset data loader for model training.
Step 1 and 2 generate persistent JSON files based on the original dataset (the `image` and `label` pairs; without the additional pseudo label or supervoxel-based label), and only need to be run once when the JSON files don't exist.

##### 1. Generate data list JSON file
```
python -m data.make_datalists
```

This script reads image and label folders, lists all the nii.gz files,
creates a JSON file in a format:

```json
{
    "training": [
        {"image": "img0001.nii.gz", "label": "label0001.nii.gz", "fold": 0},
        {"image": "img0002.nii.gz", "label": "label0002.nii.gz", "fold": 2},
        ...
    ],
    "testing": [
        {"image": "img0003.nii.gz", "label": "label0003.nii.gz"},
        {"image": "img0004.nii.gz", "label": "label0004.nii.gz"},
        ...
    ]
    "original_label_dict": {"1": "liver", ...},
    "label_dict": {"1": "liver", ...}
}
```

This step includes a 5-fold cross validation splitting and
some logic for 80-20 training/testing splitting. User need to modify the code in make_datalists.py for their own dataset. Meanwhile, the "training_transform" should manually added for each dataset.

The `original_label_dict` corresponds to the original dataset label definitions.
The `label_dict` modifies `original_label_dict` by simply rephrasing the terms.
For example in Task06, `cancer` is renamed to `lung tumor`.
The output of this step is multiple JSON files, each file corresponds
to one dataset.

##### 2. Add label_dict.json and label_mapping.json
Add new class indexes to `label_dict.json` and the local to global mapping to `label_mapping.json`.

## SupverVoxel Generation
1. Download the segment anything repo and download the ViT-H weights
```
git clone https://github.com/facebookresearch/segment-anything.git
mv segment-anything/segment_anything/ segment_anything/
wget https://dl.fbaipublicfiles.com/segment_anything/sam_vit_h_4b8939.pth
```
2. Modify the code for supervoxel generation
- Add this function to `predictor.py/SamPredictor`
```python
@torch.no_grad()
def get_feature_upsampled(self, input_image=None):
    if input_image is None:
        image_embeddings = self.model.mask_decoder.predict_masks_noprompt(self.features)
    else:
        image_embeddings = self.model.mask_decoder.predict_masks_noprompt(self.model.image_encoder(input_image))
    return image_embeddings
```
- Add this function to `modeling/mask_decoder.py/MaskDecoder`
```python
def predict_masks_noprompt(
    self,
    image_embeddings: torch.Tensor,
) -> Tuple[torch.Tensor, torch.Tensor]:
    """Predicts masks. See 'forward' for more details."""
    # Concatenate output tokens

    # Expand per-image data in batch direction to be per-mask
    src = image_embeddings
    # Upscale mask embeddings and predict masks using the mask tokens
    upscaled_embedding = self.output_upscaling(src)

    return upscaled_embedding
```
3. Run the supervoxel generation script. The processsing time is over 10 minutes, use `batch_infer` and multi-gpu for speed up.
```
python -m scripts.slic_process_sam infer --image_file xxxx
```
