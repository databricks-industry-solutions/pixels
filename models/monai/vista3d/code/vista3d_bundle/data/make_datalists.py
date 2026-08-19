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


# Step 1.
# reading image and label folders, listing all the nii.gz files,
# creating a data_list.json for training and validation
# the data_list.json format is like ('testing' labels are optional):
# {
#     "training": [
#         {"image": "img0001.nii.gz", "label": "label0001.nii.gz", "fold": 0},
#         {"image": "img0002.nii.gz", "label": "label0002.nii.gz", "fold": 2},
#         ...
#     ],
#     "testing": [
#         {"image": "img0003.nii.gz", "label": "label0003.nii.gz"},
#         {"image": "img0004.nii.gz", "label": "label0004.nii.gz"},
#         ...
#     ]
# }

import os
import re
from glob import glob
from pprint import pprint

from monai.apps import get_logger
from monai.bundle import ConfigParser
from monai.data.utils import partition_dataset

logger = get_logger(__name__)
test_ratio = 0.2  # test split
n_folds = 5  # training and validation split
seed = 20230808  # random seed for data partition_dataset reproducibility
output_json_dir = os.path.join(os.path.dirname(__file__), "jsons")


def register_make(func):
    """
    register the function to make the data list
    """
    global _make_funcs
    if "_make_funcs" not in globals():
        _make_funcs = {}
    if func.__name__ in _make_funcs:
        raise ValueError(f"{func.__name__} already exists.")
    _make_funcs[func.__name__] = func
    return func


def search_image_files(base_dir, ext, regex=None):
    """returns a list of relative filenames with given extension in `base_dir`"""
    print(f"searching ext={ext} from base_dir={base_dir}")
    images = []
    for root, _, files in os.walk(base_dir):
        images.extend(
            os.path.join(root, filename) for filename in files if filename.endswith(ext)
        )
    if regex is not None:
        images = [x for x in images if re.compile(regex).search(x) is not None]
    print(f"found {len(images)} *.{ext} files")
    return sorted(images)


def create_splits_and_write_json(
    images,
    labels,
    ratio,
    num_folds,
    json_name,
    rng_seed,
    label_dict,
    original_label_dict=None,
):
    """
    first generate training/test split, then from the training part,
    generate training/validation num_folds
    """
    items = [{"image": img, "label": lab} for img, lab in zip(images, labels)]
    train_test = partition_dataset(
        items, ratios=[1 - ratio, ratio], shuffle=True, seed=rng_seed
    )
    print(f"training: {len(train_test[0])}, testing: {len(train_test[1])}")
    train_val = partition_dataset(
        train_test[0], num_partitions=num_folds, shuffle=True, seed=rng_seed
    )
    print(f"training validation folds sizes: {[len(x) for x in train_val]}")
    training = []
    for f, x in enumerate(train_val):
        for item in x:
            item["fold"] = f
            training.append(item)

    # write json
    parser = ConfigParser({})
    parser["training"] = training
    parser["testing"] = train_test[1]

    parser["label_dict"] = label_dict
    parser["original_label_dict"] = original_label_dict or label_dict

    print(f"writing {json_name}\n\n")
    if os.path.exists(json_name):
        logger.warning(f"rewrite existing datalist file: {json_name}")
    ConfigParser.export_config_file(parser.config, json_name, indent=4)


def filtering_files(base_url, image_names, label_names, idx=-1):
    """
    check the idx-th item in the lists of image and label filenames, remove:

        - image files without corresponding label files

    """
    _tmp_img = os.path.join(base_url, image_names[idx])
    _tmp_lab = os.path.join(base_url, label_names[idx])
    if not (os.path.exists(_tmp_img) and os.path.exists(_tmp_lab)):
        if not os.path.exists(_tmp_img):
            logger.warning(f"image file {_tmp_img} pair does not exist")
        if not os.path.exists(_tmp_lab):
            logger.warning(f"label file {_tmp_lab} pair does not exist")
        image_names.pop(idx)
        label_names.pop(idx)


####
@register_make
def make_abdomenct_1k():
    base_url = "/data/AbdomenCT-1K"
    dataset_name = "AbdomenCT-1K"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(os.path.join(base_url, "Mask"), ".nii.gz")
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        labels.append(rel_mask)
        idx = re.compile(r"Case_(\d+).nii.gz").search(rel_mask)[1]
        img_name = f"Case_{idx}_0000.nii.gz"
        for f in [
            "AbdomenCT-1K-ImagePart1",
            "AbdomenCT-1K-ImagePart2",
            "AbdomenCT-1K-ImagePart3",
        ]:
            if os.path.exists(os.path.join(base_url, f, img_name)):
                images.append(os.path.join(f, img_name))
                break
        # print(f"image: {images[-1]}, label: {labels[-1]}")
        filtering_files(base_url, images, labels)
    label_dict = {1: "liver", 2: "kidney", 3: "spleen", 4: "pancreas"}
    create_splits_and_write_json(
        images, labels, test_ratio, n_folds, json_name, seed, label_dict
    )


####
@register_make
def make_flare22():
    base_url = "/data/AbdomenCT-1K/FLARE22Train"
    dataset_name = "FLARE22"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(os.path.join(base_url, "labels"), ".nii.gz")
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        labels.append(rel_mask)
        idx = re.compile(r"FLARE22_Tr_(\d+).nii.gz").search(rel_mask)[1]
        img_name = f"FLARE22_Tr_{idx}_0000.nii.gz"
        images.append(os.path.join("images", img_name))
        filtering_files(base_url, images, labels)
    label_dict = {
        1: "liver",
        2: "right kidney",
        3: "spleen",
        4: "pancreas",
        5: "aorta",
        6: "inferior vena cava",
        7: "right adrenal gland",
        8: "left adrenal gland",
        9: "gallbladder",
        10: "esophagus",
        11: "stomach",
        12: "duodenum",
        13: "left kidney",
    }
    create_splits_and_write_json(
        images, labels, test_ratio, n_folds, json_name, seed, label_dict
    )


####
@register_make
def make_amos22():
    base_url = "/data/AMOS22"
    dataset_name = "AMOS22"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(os.path.join(base_url, "labelsTr"), ".nii.gz")
    masks += search_image_files(os.path.join(base_url, "labelsVa"), ".nii.gz")
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        labels.append(rel_mask)
        idx = re.compile(r"amos_(\d+).nii.gz").search(rel_mask)[1]
        if int(idx) >= 500:  # skip the MRI cases
            labels.pop()
            continue
        img_name = f"amos_{idx}.nii.gz"
        for f in ["imagesTr", "imagesVa"]:
            if os.path.exists(os.path.join(base_url, f, img_name)):
                images.append(os.path.join(f, img_name))
                break
        # print(f"image: {images[-1]}, label: {labels[-1]}")
        filtering_files(base_url, images, labels)
    original_label_dict = {
        1: "spleen",
        2: "right kidney",
        3: "left kidney",
        4: "gallbladder",
        5: "esophagus",
        6: "liver",
        7: "stomach",
        8: "aorta",
        9: "postcava",
        10: "pancreas",
        11: "right adrenal gland",
        12: "left adrenal gland",
        13: "duodenum",
        14: "bladder",
        15: "prostate or uterus",
    }
    label_dict = {
        1: "spleen",
        2: "right kidney",
        3: "left kidney",
        4: "gallbladder",
        5: "esophagus",
        6: "liver",
        7: "stomach",
        8: "aorta",
        9: "inferior vena cava",
        10: "pancreas",
        11: "right adrenal gland",
        12: "left adrenal gland",
        13: "duodenum",
        14: "bladder",
        15: "prostate or uterus",
    }
    create_splits_and_write_json(
        images,
        labels,
        test_ratio,
        n_folds,
        json_name,
        seed,
        label_dict,
        original_label_dict,
    )


####
@register_make
def make_btcv_abdomen():
    base_url = "/data/BTCV/Abdomen"
    dataset_name = "BTCV-Abdomen"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(
        os.path.join(base_url, "RawData", "Training", "label"), ".nii.gz"
    )
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        labels.append(rel_mask)
        idx = re.compile(r"label(\d+).nii.gz").search(rel_mask)[1]
        img_name = f"img{idx}.nii.gz"
        images.append(os.path.join("RawData", "Training", "img", img_name))
        filtering_files(base_url, images, labels)
    label_dict = {
        1: "spleen",
        2: "right kidney",
        3: "left kidney",
        4: "gallbladder",
        5: "esophagus",
        6: "liver",
        7: "stomach",
        8: "aorta",
        9: "inferior vena cava",
        10: "portal vein and splenic vein",
        11: "pancreas",
        12: "right adrenal gland",
        13: "left adrenal gland",
    }
    create_splits_and_write_json(
        images, labels, test_ratio, n_folds, json_name, seed, label_dict
    )


####
@register_make
def make_btcv_cervix():
    base_url = "/data/BTCV/Cervix"
    dataset_name = "BTCV-Cervix"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(
        os.path.join(base_url, "FixedDataV2", "Training", "label"), ".nii.gz"
    )
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        labels.append(rel_mask)
        idx = re.compile(r"(\d+)-Mask.nii.gz").search(rel_mask)[1]
        img_name = f"{idx}-Image.nii.gz"
        images.append(os.path.join("FixedData", "Training", "img", img_name))
        filtering_files(base_url, images, labels)
    original_label_dict = {1: "bladder", 2: "uterus", 3: "rectum", 4: "small bowel"}
    label_dict = {1: "bladder", 2: "prostate or uterus", 3: "rectum", 4: "small bowel"}
    create_splits_and_write_json(
        images,
        labels,
        test_ratio,
        n_folds,
        json_name,
        seed,
        label_dict,
        original_label_dict,
    )


####
@register_make
def make_chaos():
    base_url = "/data/CHAOS"
    dataset_name = "CHAOS"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(
        os.path.join(base_url, "Train_Sets_nifti_ct"), "segmentation.nii.gz"
    )
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        labels.append(rel_mask)
        idx = re.compile(r"(\d+)_segmentation.nii.gz").search(rel_mask)[1]
        img_name = f"{idx}_image.nii.gz"
        images.append(os.path.join("Train_Sets_nifti_ct", img_name))
        filtering_files(base_url, images, labels)
    label_dict = {1: "liver"}
    create_splits_and_write_json(
        images, labels, test_ratio, n_folds, json_name, seed, label_dict
    )


####
@register_make
def make_ct_org():
    base_url = "/data/CT-ORG"
    dataset_name = "CT-ORG"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(
        os.path.join(base_url, "OrganSegmentations"), ".nii.gz", regex=r"labels"
    )
    images, labels = [], []
    for mask in masks:
        idx = re.compile(r"labels-(\d+).nii.gz").search(mask)[1]
        if idx in {"19", "70", "74", "76"}:
            continue  # these are problematic cases
        _fixed_mask = os.path.join(base_url, "fixed_affine", f"labels-{idx}.nii.gz")
        img_name = f"volume-{idx}.nii.gz"
        mask_name = f"labels-{idx}.nii.gz"
        if os.path.exists(_fixed_mask):  # there are newer fixed files
            images.append(os.path.join("fixed_affine", img_name))
            labels.append(os.path.join("fixed_affine", mask_name))
        else:
            images.append(os.path.join("OrganSegmentations", img_name))
            labels.append(os.path.join("OrganSegmentations", mask_name))
        filtering_files(base_url, images, labels)
    original_label_dict = {
        1: "liver",
        2: "bladder",
        3: "lungs",
        4: "kidneys",
        5: "bone",
        6: "brain",
    }
    label_dict = {
        1: "liver",
        2: "bladder",
        3: "lung",
        4: "kidney",
        5: "bone",
        6: "brain",
    }
    create_splits_and_write_json(
        images,
        labels,
        test_ratio,
        n_folds,
        json_name,
        seed,
        label_dict,
        original_label_dict,
    )


####
@register_make
def make_kits23():
    base_url = "/data/KiTS23/dataset"
    dataset_name = "KiTS23"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(base_url, "segmentation.nii.gz")
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        labels.append(rel_mask)
        idx = re.compile(r"case_(\d+)").search(rel_mask)[1]
        img_name = f"case_{idx}"
        images.append(os.path.join(img_name, "imaging.nii.gz"))
        filtering_files(base_url, images, labels)
    original_label_dict = {1: "kidney", 2: "tumor", 3: "cyst"}
    label_dict = {1: "kidney", 2: "kidney tumor", 3: "kidney cyst"}
    create_splits_and_write_json(
        images,
        labels,
        test_ratio,
        n_folds,
        json_name,
        seed,
        label_dict,
        original_label_dict,
    )


####
@register_make
def make_lits23():
    base_url = "/data/LiTS/Training_Batch"
    dataset_name = "LiTS"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(base_url, ".nii", regex=r"segmentation")
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        labels.append(rel_mask)
        idx = re.compile(r"segmentation-(\d+).nii").search(rel_mask)[1]
        img_name = f"volume-{idx}.nii"
        images.append(img_name)
        filtering_files(base_url, images, labels)
    original_label_dict = {1: "liver", 2: "tumor"}
    label_dict = {1: "liver", 2: "liver tumor"}
    create_splits_and_write_json(
        images,
        labels,
        test_ratio,
        n_folds,
        json_name,
        seed,
        label_dict,
        original_label_dict,
    )


####
@register_make
def make_multi_organ_btcv():
    base_url = "/data/Multi-organ-Abdominal-CT/res_1.0mm_relabeled2"
    dataset_name = "Multi-organ-Abdominal-CT-btcv"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(os.path.join(base_url, "label_btcv_multiorgan"), ".nii")
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        labels.append(rel_mask)
        idx = re.compile(r"label(\d+).nii").search(rel_mask)[1]
        img_name = f"img{idx}.nii"
        images.append(os.path.join("images_btcv", img_name))
        filtering_files(base_url, images, labels)
    label_dict = {
        1: "spleen",
        2: "right kidney",
        3: "left kidney",
        4: "gallbladder",
        5: "esophagus",
        6: "liver",
        7: "stomach",
        8: "aorta",
        9: "inferior vena cava",
        10: "portal vein and splenic vein",
        11: "pancreas",
        12: "right adrenal gland",
        13: "left adrenal gland",
        14: "duodenum",
    }
    create_splits_and_write_json(
        images, labels, test_ratio, n_folds, json_name, seed, label_dict
    )


####
@register_make
def make_multi_organ_tcia():
    base_url = "/data/Multi-organ-Abdominal-CT/res_1.0mm_relabeled2"
    dataset_name = "Multi-organ-Abdominal-CT-tcia"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(
        os.path.join(base_url, "label_tcia_multiorgan+rkidney"), ".nii"
    )
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        labels.append(rel_mask)
        idx = re.compile(r"label(\d+).nii").search(rel_mask)[1]
        img_name = f"PANCREAS_{idx}.nii"
        images.append(os.path.join("images_tcia", img_name))
        filtering_files(base_url, images, labels)
    label_dict = {
        1: "spleen",
        2: "right kidney",
        3: "left kidney",
        4: "gallbladder",
        5: "esophagus",
        6: "liver",
        7: "stomach",
        8: "pancreas",
        9: "duodenum",
    }
    create_splits_and_write_json(
        images, labels, test_ratio, n_folds, json_name, seed, label_dict
    )


####
@register_make
def make_pancreas_ct():
    base_url = "/data/Pancreas-CT"
    dataset_name = "Pancreas-CT"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(
        os.path.join(base_url, "TCIA_pancreas_labels-02-05-2017"), ".nii.gz"
    )
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        labels.append(rel_mask)
        idx = re.compile(r"label(\d+).nii.gz").search(rel_mask)[1]
        img_name = f"PANCREAS_{idx}.nii.gz"
        images.append(os.path.join("manifest-1599750808610", "nifti", img_name))
        filtering_files(base_url, images, labels)
    label_dict = {1: "pancreas"}
    create_splits_and_write_json(
        images, labels, test_ratio, n_folds, json_name, seed, label_dict
    )


####
@register_make
def make_task06():
    base_url = "/data/Task06"
    dataset_name = "Task06"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(os.path.join(base_url, "labelsTr"), ".nii.gz")
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        labels.append(rel_mask)
        idx = re.compile(r"lung_(\d+).nii.gz").search(rel_mask)[1]
        img_name = f"lung_{idx}.nii.gz"
        images.append(os.path.join("imagesTr", img_name))
        filtering_files(base_url, images, labels)
    original_label_dict = {1: "cancer"}
    label_dict = {1: "lung tumor"}
    create_splits_and_write_json(
        images,
        labels,
        test_ratio,
        n_folds,
        json_name,
        seed,
        label_dict,
        original_label_dict,
    )


####
@register_make
def make_task07():
    base_url = "/data/Task07"
    dataset_name = "Task07"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(os.path.join(base_url, "labelsTr"), ".nii.gz")
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        labels.append(rel_mask)
        idx = re.compile(r"pancreas_(\d+).nii.gz").search(rel_mask)[1]
        img_name = f"pancreas_{idx}.nii.gz"
        images.append(os.path.join("imagesTr", img_name))
        filtering_files(base_url, images, labels)
    original_label_dict = {1: "pancreas", 2: "cancer"}
    label_dict = {1: "pancreas", 2: "pancreatic tumor"}
    create_splits_and_write_json(
        images,
        labels,
        test_ratio,
        n_folds,
        json_name,
        seed,
        label_dict,
        original_label_dict,
    )


####
@register_make
def make_task08():
    base_url = "/data/Task08"
    dataset_name = "Task08"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(os.path.join(base_url, "labelsTr"), ".nii.gz")
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        labels.append(rel_mask)
        idx = re.compile(r"hepaticvessel_(\d+).nii.gz").search(rel_mask)[1]
        img_name = f"hepaticvessel_{idx}.nii.gz"
        images.append(os.path.join("imagesTr", img_name))
        filtering_files(base_url, images, labels)
    original_label_dict = {1: "Vessel", 2: "Tumour"}
    label_dict = {1: "hepatic vessel", 2: "hepatic tumor"}
    create_splits_and_write_json(
        images,
        labels,
        test_ratio,
        n_folds,
        json_name,
        seed,
        label_dict,
        original_label_dict,
    )


####
@register_make
def make_task09():
    base_url = "/data/Task09"
    dataset_name = "Task09"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(os.path.join(base_url, "labelsTr"), ".nii.gz")
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        labels.append(rel_mask)
        idx = re.compile(r"spleen_(\d+).nii.gz").search(rel_mask)[1]
        img_name = f"spleen_{idx}.nii.gz"
        images.append(os.path.join("imagesTr", img_name))
        filtering_files(base_url, images, labels)
    label_dict = {1: "spleen"}
    create_splits_and_write_json(
        images, labels, test_ratio, n_folds, json_name, seed, label_dict
    )


####
@register_make
def make_task10():
    base_url = "/data/Task10"
    dataset_name = "Task10"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(os.path.join(base_url, "labelsTr"), ".nii.gz")
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        labels.append(rel_mask)
        idx = re.compile(r"colon_(\d+).nii.gz").search(rel_mask)[1]
        img_name = f"colon_{idx}.nii.gz"
        images.append(os.path.join("imagesTr", img_name))
        filtering_files(base_url, images, labels)
    label_dict = {1: "colon cancer primaries"}
    create_splits_and_write_json(
        images, labels, test_ratio, n_folds, json_name, seed, label_dict
    )


####
@register_make
def make_total_segmentator():
    base_url = "/data/TotalSegmentator"
    dataset_name = "TotalSegmentator"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(os.path.join(base_url, "labels"), ".nii.gz")
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        labels.append(rel_mask)
        idx = re.compile(r"s(\d+).nii.gz").search(rel_mask)[1]
        img_name = f"s{idx}.nii.gz"
        images.append(os.path.join("images", img_name))
        filtering_files(base_url, images, labels)
    original_label_dict = {  # https://github.com/wasserth/TotalSegmentator/blob/master/totalsegmentator/map_to_binary.py
        1: "spleen",
        2: "kidney_right",
        3: "kidney_left",
        4: "gallbladder",
        5: "liver",
        6: "stomach",
        7: "aorta",
        8: "inferior_vena_cava",
        9: "portal_vein_and_splenic_vein",
        10: "pancreas",
        11: "adrenal_gland_right",
        12: "adrenal_gland_left",
        13: "lung_upper_lobe_left",
        14: "lung_lower_lobe_left",
        15: "lung_upper_lobe_right",
        16: "lung_middle_lobe_right",
        17: "lung_lower_lobe_right",
        18: "vertebrae_L5",
        19: "vertebrae_L4",
        20: "vertebrae_L3",
        21: "vertebrae_L2",
        22: "vertebrae_L1",
        23: "vertebrae_T12",
        24: "vertebrae_T11",
        25: "vertebrae_T10",
        26: "vertebrae_T9",
        27: "vertebrae_T8",
        28: "vertebrae_T7",
        29: "vertebrae_T6",
        30: "vertebrae_T5",
        31: "vertebrae_T4",
        32: "vertebrae_T3",
        33: "vertebrae_T2",
        34: "vertebrae_T1",
        35: "vertebrae_C7",
        36: "vertebrae_C6",
        37: "vertebrae_C5",
        38: "vertebrae_C4",
        39: "vertebrae_C3",
        40: "vertebrae_C2",
        41: "vertebrae_C1",
        42: "esophagus",
        43: "trachea",
        44: "heart_myocardium",
        45: "heart_atrium_left",
        46: "heart_ventricle_left",
        47: "heart_atrium_right",
        48: "heart_ventricle_right",
        49: "pulmonary_artery",
        50: "brain",
        51: "iliac_artery_left",
        52: "iliac_artery_right",
        53: "iliac_vena_left",
        54: "iliac_vena_right",
        55: "small_bowel",
        56: "duodenum",
        57: "colon",
        58: "rib_left_1",
        59: "rib_left_2",
        60: "rib_left_3",
        61: "rib_left_4",
        62: "rib_left_5",
        63: "rib_left_6",
        64: "rib_left_7",
        65: "rib_left_8",
        66: "rib_left_9",
        67: "rib_left_10",
        68: "rib_left_11",
        69: "rib_left_12",
        70: "rib_right_1",
        71: "rib_right_2",
        72: "rib_right_3",
        73: "rib_right_4",
        74: "rib_right_5",
        75: "rib_right_6",
        76: "rib_right_7",
        77: "rib_right_8",
        78: "rib_right_9",
        79: "rib_right_10",
        80: "rib_right_11",
        81: "rib_right_12",
        82: "humerus_left",
        83: "humerus_right",
        84: "scapula_left",
        85: "scapula_right",
        86: "clavicula_left",
        87: "clavicula_right",
        88: "femur_left",
        89: "femur_right",
        90: "hip_left",
        91: "hip_right",
        92: "sacrum",
        93: "face",
        94: "gluteus_maximus_left",
        95: "gluteus_maximus_right",
        96: "gluteus_medius_left",
        97: "gluteus_medius_right",
        98: "gluteus_minimus_left",
        99: "gluteus_minimus_right",
        100: "autochthon_left",
        101: "autochthon_right",
        102: "iliopsoas_left",
        103: "iliopsoas_right",
        104: "urinary_bladder",
    }
    label_dict = {
        1: "spleen",
        2: "right kidney",
        3: "left kidney",
        4: "gallbladder",
        5: "liver",
        6: "stomach",
        7: "aorta",
        8: "inferior vena cava",
        9: "portal vein and splenic vein",
        10: "pancreas",
        11: "right adrenal gland",
        12: "left adrenal gland",
        13: "left lung upper lobe",
        14: "left lung lower lobe",
        15: "right lung upper lobe",
        16: "right lung middle lobe",
        17: "right lung lower lobe",
        18: "vertebrae L5",
        19: "vertebrae L4",
        20: "vertebrae L3",
        21: "vertebrae L2",
        22: "vertebrae L1",
        23: "vertebrae T12",
        24: "vertebrae T11",
        25: "vertebrae T10",
        26: "vertebrae T9",
        27: "vertebrae T8",
        28: "vertebrae T7",
        29: "vertebrae T6",
        30: "vertebrae T5",
        31: "vertebrae T4",
        32: "vertebrae T3",
        33: "vertebrae T2",
        34: "vertebrae T1",
        35: "vertebrae C7",
        36: "vertebrae C6",
        37: "vertebrae C5",
        38: "vertebrae C4",
        39: "vertebrae C3",
        40: "vertebrae C2",
        41: "vertebrae C1",
        42: "esophagus",
        43: "trachea",
        44: "heart myocardium",
        45: "left heart atrium",
        46: "left heart ventricle",
        47: "right heart atrium",
        48: "right heart ventricle",
        49: "pulmonary artery",
        50: "brain",
        51: "left iliac artery",
        52: "right iliac artery",
        53: "left iliac vena",
        54: "right iliac vena",
        55: "small bowel",
        56: "duodenum",
        57: "colon",
        58: "left rib 1",
        59: "left rib 2",
        60: "left rib 3",
        61: "left rib 4",
        62: "left rib 5",
        63: "left rib 6",
        64: "left rib 7",
        65: "left rib 8",
        66: "left rib 9",
        67: "left rib 10",
        68: "left rib 11",
        69: "left rib 12",
        70: "right rib 1",
        71: "right rib 2",
        72: "right rib 3",
        73: "right rib 4",
        74: "right rib 5",
        75: "right rib 6",
        76: "right rib 7",
        77: "right rib 8",
        78: "right rib 9",
        79: "right rib 10",
        80: "right rib 11",
        81: "right rib 12",
        82: "left humerus",
        83: "right humerus",
        84: "left scapula",
        85: "right scapula",
        86: "left clavicula",
        87: "right clavicula",
        88: "left femur",
        89: "right femur",
        90: "left hip",
        91: "right hip",
        92: "sacrum",
        93: "face",
        94: "left gluteus maximus",
        95: "right gluteus maximus",
        96: "left gluteus medius",
        97: "right gluteus medius",
        98: "left gluteus minimus",
        99: "right gluteus minimus",
        100: "left autochthon",
        101: "right autochthon",
        102: "left iliopsoas",
        103: "right iliopsoas",
        104: "bladder",
    }
    create_splits_and_write_json(
        images,
        labels,
        test_ratio,
        n_folds,
        json_name,
        seed,
        label_dict,
        original_label_dict,
    )


####
@register_make
def make_word():
    base_url = "/data/WORD"
    dataset_name = "WORD"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(os.path.join(base_url, "labelsTr"), ".nii.gz")
    masks += search_image_files(os.path.join(base_url, "labelsTs"), ".nii.gz")
    masks += search_image_files(os.path.join(base_url, "labelsVal"), ".nii.gz")
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        labels.append(rel_mask)
        idx = re.compile(r"word_(\d+).nii.gz").search(rel_mask)[1]
        img_name = f"word_{idx}.nii.gz"
        for f in ["imagesTr", "imagesTs", "imagesVal"]:
            if os.path.exists(os.path.join(base_url, f, img_name)):
                images.append(os.path.join(f, img_name))
                break
        filtering_files(base_url, images, labels)
    original_label_dict = {
        1: "liver",
        2: "spleen",
        3: "left_kidney",
        4: "right_kidney",
        5: "stomach",
        6: "gallbladder",
        7: "esophagus",
        8: "pancreas",
        9: "duodenum",
        10: "colon",
        11: "intestine",
        12: "adrenal",
        13: "rectum",
        14: "bladder",
        15: "Head_of_femur_L",
        16: "Head_of_femur_R",
    }
    label_dict = {
        1: "liver",
        2: "spleen",
        3: "left kidney",
        4: "right kidney",
        5: "stomach",
        6: "gallbladder",
        7: "esophagus",
        8: "pancreas",
        9: "duodenum",
        10: "colon",
        11: "intestine",
        12: "adrenal gland",
        13: "rectum",
        14: "bladder",
        15: "left head of femur",
        16: "right head of femur",
    }
    create_splits_and_write_json(
        images,
        labels,
        test_ratio,
        n_folds,
        json_name,
        seed,
        label_dict,
        original_label_dict,
    )


####
@register_make
def make_task03():
    base_url = "/data/Task03"
    dataset_name = "Task03"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(os.path.join(base_url, "labelsTr"), ".nii.gz")
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        labels.append(rel_mask)
        idx = re.compile(r"liver_(\d+).nii.gz").search(rel_mask)[1]
        img_name = f"liver_{idx}.nii.gz"
        images.append(os.path.join("imagesTr", img_name))
        filtering_files(base_url, images, labels)
    original_label_dict = {1: "liver", 2: "cancer"}
    label_dict = {1: "liver", 2: "hepatic tumor"}
    create_splits_and_write_json(
        images,
        labels,
        test_ratio,
        n_folds,
        json_name,
        seed,
        label_dict,
        original_label_dict,
    )


####
@register_make
def make_bone():
    base_url = "/data/Bone-NIH"
    dataset_name = "Bone-NIH"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(base_url, "enriched_3-class.nii.gz")
    full_ct = search_image_files(base_url, "CT.nii.gz")
    for x in full_ct:
        if x.endswith(os.path.join("anon_data", "BONE-017", "CT.nii.gz")):
            full_ct.remove(x)
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        idx = re.compile(r"BONE-(\d+)").search(rel_mask)[1]
        if idx in {"066"}:
            continue
        img_name = os.path.join(f"BONE-{idx}", "CT.nii.gz")
        for x in full_ct:
            if x.endswith(img_name):
                images.append(os.path.relpath(x, base_url))
                full_ct.remove(x)
                break
        labels.append(rel_mask)
        filtering_files(base_url, images, labels)
    if len(full_ct) > 1:
        raise ValueError("Remaining items in the full ct set.")
    original_label_dict = {1: "lesion 1", 2: "lesion 2"}
    label_dict = {1: "bone lesion", 2: "bone lesion"}  # merging 1 and 2
    create_splits_and_write_json(
        images,
        labels,
        test_ratio,
        n_folds,
        json_name,
        seed,
        label_dict,
        original_label_dict,
    )


####
@register_make
def make_total_segmentator_v2():
    base_url = "/data/TotalSegmentatorV2"
    dataset_name = "TotalSegmentatorV2"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(base_url, "seg.nii.gz")
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        if "s1104" in rel_mask or "s0992" in rel_mask or "s0248" in rel_mask:
            # using totalseg v2.0.0 list, although in v2.0.1 this has been fixed
            continue
        labels.append(rel_mask)
        img_name = os.path.join(os.path.dirname(rel_mask), "ct.nii.gz")
        images.append(img_name)
        filtering_files(base_url, images, labels)
    original_label_dict = {
        1: "spleen",
        2: "kidney_right",
        3: "kidney_left",
        4: "gallbladder",
        5: "liver",
        6: "stomach",
        7: "aorta",
        8: "inferior_vena_cava",
        9: "portal_vein_and_splenic_vein",
        10: "pancreas",
        11: "adrenal_gland_right",
        12: "adrenal_gland_left",
        13: "lung_upper_lobe_left",
        14: "lung_lower_lobe_left",
        15: "lung_upper_lobe_right",
        16: "lung_middle_lobe_right",
        17: "lung_lower_lobe_right",
        18: "vertebrae_L5",
        19: "vertebrae_L4",
        20: "vertebrae_L3",
        21: "vertebrae_L2",
        22: "vertebrae_L1",
        23: "vertebrae_T12",
        24: "vertebrae_T11",
        25: "vertebrae_T10",
        26: "vertebrae_T9",
        27: "vertebrae_T8",
        28: "vertebrae_T7",
        29: "vertebrae_T6",
        30: "vertebrae_T5",
        31: "vertebrae_T4",
        32: "vertebrae_T3",
        33: "vertebrae_T2",
        34: "vertebrae_T1",
        35: "vertebrae_C7",
        36: "vertebrae_C6",
        37: "vertebrae_C5",
        38: "vertebrae_C4",
        39: "vertebrae_C3",
        40: "vertebrae_C2",
        41: "vertebrae_C1",
        42: "esophagus",
        43: "trachea",
        44: "brain",
        45: "iliac_artery_left",
        46: "iliac_artery_right",
        47: "iliac_vena_left",
        48: "iliac_vena_right",
        49: "small_bowel",
        50: "duodenum",
        51: "colon",
        52: "rib_left_1",
        53: "rib_left_2",
        54: "rib_left_3",
        55: "rib_left_4",
        56: "rib_left_5",
        57: "rib_left_6",
        58: "rib_left_7",
        59: "rib_left_8",
        60: "rib_left_9",
        61: "rib_left_10",
        62: "rib_left_11",
        63: "rib_left_12",
        64: "rib_right_1",
        65: "rib_right_2",
        66: "rib_right_3",
        67: "rib_right_4",
        68: "rib_right_5",
        69: "rib_right_6",
        70: "rib_right_7",
        71: "rib_right_8",
        72: "rib_right_9",
        73: "rib_right_10",
        74: "rib_right_11",
        75: "rib_right_12",
        76: "humerus_left",
        77: "humerus_right",
        78: "scapula_left",
        79: "scapula_right",
        80: "clavicula_left",
        81: "clavicula_right",
        82: "femur_left",
        83: "femur_right",
        84: "hip_left",
        85: "hip_right",
        86: "sacrum",
        87: "gluteus_maximus_left",
        88: "gluteus_maximus_right",
        89: "gluteus_medius_left",
        90: "gluteus_medius_right",
        91: "gluteus_minimus_left",
        92: "gluteus_minimus_right",
        93: "autochthon_left",
        94: "autochthon_right",
        95: "iliopsoas_left",
        96: "iliopsoas_right",
        97: "urinary_bladder",
        98: "atrial_appendage_left",
        99: "brachiocephalic_trunk",
        100: "brachiocephalic_vein_left",
        101: "brachiocephalic_vein_right",
        102: "common_carotid_artery_left",
        103: "common_carotid_artery_right",
        104: "costal_cartilages",
        105: "heart",
        106: "kidney_cyst_left",
        107: "kidney_cyst_right",
        108: "prostate",
        109: "pulmonary_vein",
        110: "skull",
        111: "spinal_cord",
        112: "sternum",
        113: "subclavian_artery_left",
        114: "subclavian_artery_right",
        115: "superior_vena_cava",
        116: "thyroid_gland",
        117: "vertebrae_S1",
    }
    label_dict = {
        1: "spleen",
        2: "right kidney",
        3: "left kidney",
        4: "gallbladder",
        5: "liver",
        6: "stomach",
        7: "aorta",
        8: "inferior vena cava",
        9: "portal vein and splenic vein",
        10: "pancreas",
        11: "right adrenal gland",
        12: "left adrenal gland",
        13: "left lung upper lobe",
        14: "left lung lower lobe",
        15: "right lung upper lobe",
        16: "right lung middle lobe",
        17: "right lung lower lobe",
        18: "vertebrae L5",
        19: "vertebrae L4",
        20: "vertebrae L3",
        21: "vertebrae L2",
        22: "vertebrae L1",
        23: "vertebrae T12",
        24: "vertebrae T11",
        25: "vertebrae T10",
        26: "vertebrae T9",
        27: "vertebrae T8",
        28: "vertebrae T7",
        29: "vertebrae T6",
        30: "vertebrae T5",
        31: "vertebrae T4",
        32: "vertebrae T3",
        33: "vertebrae T2",
        34: "vertebrae T1",
        35: "vertebrae C7",
        36: "vertebrae C6",
        37: "vertebrae C5",
        38: "vertebrae C4",
        39: "vertebrae C3",
        40: "vertebrae C2",
        41: "vertebrae C1",
        42: "esophagus",
        43: "trachea",
        44: "brain",
        45: "left iliac artery",
        46: "right iliac artery",
        47: "left iliac vena",
        48: "right iliac vena",
        49: "small bowel",
        50: "duodenum",
        51: "colon",
        52: "left rib 1",
        53: "left rib 2",
        54: "left rib 3",
        55: "left rib 4",
        56: "left rib 5",
        57: "left rib 6",
        58: "left rib 7",
        59: "left rib 8",
        60: "left rib 9",
        61: "left rib 10",
        62: "left rib 11",
        63: "left rib 12",
        64: "right rib 1",
        65: "right rib 2",
        66: "right rib 3",
        67: "right rib 4",
        68: "right rib 5",
        69: "right rib 6",
        70: "right rib 7",
        71: "right rib 8",
        72: "right rib 9",
        73: "right rib 10",
        74: "right rib 11",
        75: "right rib 12",
        76: "left humerus",
        77: "right humerus",
        78: "left scapula",
        79: "right scapula",
        80: "left clavicula",
        81: "right clavicula",
        82: "left femur",
        83: "right femur",
        84: "left hip",
        85: "right hip",
        86: "sacrum",
        87: "left gluteus maximus",
        88: "right gluteus maximus",
        89: "left gluteus medius",
        90: "right gluteus medius",
        91: "left gluteus minimus",
        92: "right gluteus minimus",
        93: "left autochthon",
        94: "right autochthon",
        95: "left iliopsoas",
        96: "right iliopsoas",
        97: "bladder",
        98: "left atrial appendage",
        99: "brachiocephalic trunk",
        100: "left brachiocephalic vein",
        101: "right brachiocephalic vein",
        102: "left common carotid artery",
        103: "right common carotid artery",
        104: "costal cartilages",
        105: "heart",
        106: "left kidney cyst",
        107: "right kidney cyst",
        108: "prostate",
        109: "pulmonary vein",
        110: "skull",
        111: "spinal cord",
        112: "sternum",
        113: "left subclavian artery",
        114: "right subclavian artery",
        115: "superior vena cava",
        116: "thyroid gland",
        117: "vertebrae S1",
    }
    create_splits_and_write_json(
        images,
        labels,
        test_ratio,
        n_folds,
        json_name,
        seed,
        label_dict,
        original_label_dict,
    )


####
@register_make
def make_c4kc_kits():
    base_url = "/data/C4KC-KiTS/nifti"
    dataset_name = "C4KC-KiTS"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(base_url, "mask.nii.gz")
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        img_folder = os.path.dirname(mask)
        img_name = [
            s
            for s in sorted(glob(os.path.join(img_folder, "*.nii.gz")))
            if not ("seg" in os.path.basename(s) or "mask" in os.path.basename(s))
        ][0]
        rel_img = os.path.relpath(img_name, base_url)
        images.append(rel_img)
        labels.append(rel_mask)
        filtering_files(base_url, images, labels)
    original_label_dict = {1: "Kidney", 2: "Mass"}
    label_dict = {1: "kidney", 2: "kidney mass"}
    create_splits_and_write_json(
        images,
        labels,
        test_ratio,
        n_folds,
        json_name,
        seed,
        label_dict,
        original_label_dict,
    )


####
@register_make
def make_crlm_ct():
    base_url = "/data/CRLM-CT/nifti"
    dataset_name = "CRLM-CT"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(base_url, "mask.nii.gz")
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        img_folder = os.path.dirname(mask)
        img_name = [
            s
            for s in sorted(glob(os.path.join(img_folder, "*.nii.gz")))
            if not ("seg" in os.path.basename(s) or "mask" in os.path.basename(s))
        ][0]
        rel_img = os.path.relpath(img_name, base_url)
        images.append(rel_img)
        labels.append(rel_mask)
        filtering_files(base_url, images, labels)
    original_label_dict = {
        1: "Liver",
        2: "Liver Remnant",
        3: "Hepatic Vein",
        4: "Portal Vein",
        5: "Tumor",
    }
    label_dict = {
        3: "hepatic vessel",
        4: "portal vein and splenic vein",
        5: "liver tumor",
    }
    create_splits_and_write_json(
        images,
        labels,
        test_ratio,
        n_folds,
        json_name,
        seed,
        label_dict,
        original_label_dict,
    )


####
@register_make
def make_verse():
    base_url = "/data/VerSe/"
    dataset_name = "VerSe"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(
        os.path.join(base_url, "dataset-01training"), "_msk.nii.gz"
    )
    masks += search_image_files(
        os.path.join(base_url, "dataset-02validation"), "_msk.nii.gz"
    )
    masks += search_image_files(os.path.join(base_url, "dataset-03test"), "_msk.nii.gz")
    masks += search_image_files(
        os.path.join(base_url, "dataset-verse19test"), "_msk.nii.gz"
    )
    masks += search_image_files(
        os.path.join(base_url, "dataset-verse19training"), "_msk.nii.gz"
    )
    masks += search_image_files(
        os.path.join(base_url, "dataset-verse19validation"), "_msk.nii.gz"
    )
    masks = sorted(masks)
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        img_name = f"{mask}".replace("derivatives", "rawdata").replace(
            "_seg-vert_msk", "_ct"
        )
        rel_img = os.path.relpath(img_name, base_url)
        images.append(rel_img)
        labels.append(rel_mask)
        filtering_files(base_url, images, labels)
    label_dict = {
        1: "vertebrae C1",
        2: "vertebrae C2",
        3: "vertebrae C3",
        4: "vertebrae C4",
        5: "vertebrae C5",
        6: "vertebrae C6",
        7: "vertebrae C7",
        8: "vertebrae T1",
        9: "vertebrae T2",
        10: "vertebrae T3",
        11: "vertebrae T4",
        12: "vertebrae T5",
        13: "vertebrae T6",
        14: "vertebrae T7",
        15: "vertebrae T8",
        16: "vertebrae T9",
        17: "vertebrae T10",
        18: "vertebrae T11",
        19: "vertebrae T12",
        20: "vertebrae L1",
        21: "vertebrae L2",
        22: "vertebrae L3",
        23: "vertebrae L4",
        24: "vertebrae L5",
        25: "vertebrae L6",
    }
    create_splits_and_write_json(
        images, labels, test_ratio, n_folds, json_name, seed, label_dict
    )


####
@register_make
def make_aeropath():
    base_url = "/data/AeroPath/"
    dataset_name = "AeroPath"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(base_url, "_label.nii.gz")
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        img_folder = os.path.dirname(mask)
        img_name = [
            s
            for s in sorted(glob(os.path.join(img_folder, "*.nii.gz")))
            if "label" not in os.path.basename(s)
        ][0]
        rel_img = os.path.relpath(img_name, base_url)
        images.append(rel_img)
        labels.append(rel_mask)
        filtering_files(base_url, images, labels)
    original_label_dict = {1: "lung", 2: "airway"}
    label_dict = {2: "airway"}
    create_splits_and_write_json(
        images,
        labels,
        test_ratio,
        n_folds,
        json_name,
        seed,
        label_dict,
        original_label_dict,
    )


####
@register_make
def make_autopet23():
    base_url = "/data/Autopet23/"
    dataset_name = "Autopet23"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(base_url, "SEG.nii.gz")
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        img_folder = os.path.dirname(mask)
        img_name = os.path.join(img_folder, "CTres.nii.gz")
        rel_img = os.path.relpath(img_name, base_url)
        images.append(rel_img)
        labels.append(rel_mask)
        filtering_files(base_url, images, labels)
    label_dict = {1: "FDG-avid lesion"}
    create_splits_and_write_json(
        images, labels, test_ratio, n_folds, json_name, seed, label_dict
    )


####
@register_make
def make_LIDC_IDRI():
    base_url = "/data/LIDC-IDRI/"
    dataset_name = "LIDC-IDRI"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(os.path.join(base_url, "Mask"), ".nii.gz")
    images, labels = [], []
    for mask in masks:
        if "0985" in mask:
            continue
        rel_mask = os.path.relpath(mask, base_url)
        rel_img = rel_mask.replace("Mask", "Image")
        images.append(rel_img)
        labels.append(rel_mask)
        filtering_files(base_url, images, labels)
    label_dict = {1: "lung nodule"}
    create_splits_and_write_json(
        images, labels, test_ratio, n_folds, json_name, seed, label_dict
    )


####
@register_make
def make_ctpelvic1k_clinic():
    base_url = "/data/CTPelvic1K-CLINIC"
    dataset_name = "CTPelvic1K-CLINIC"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(
        os.path.join(base_url, "ipcai2021_dataset6_Anonymized"), ".nii.gz"
    )
    masks += search_image_files(
        os.path.join(base_url, "CTPelvic1K_dataset7_mask"), ".nii.gz"
    )
    images, labels = [], []
    for mask in masks:
        mask = os.path.relpath(mask, base_url)
        labels.append(mask)
        if "dataset7" in mask:
            img = (
                mask.replace("mask", "data")
                .replace("CLINIC_metal", "dataset7_CLINIC_metal")
                .replace("_4label", "")
            )
        if "dataset6" in mask:
            img = (
                mask.replace("ipcai2021", "CTPelvic1K")
                .replace("_Anonymized", "_data")
                .replace("mask_4label", "data")
            )
        images.append(img)
    label_dict = {1: "sacrum", 2: "left hip", 3: "right hip", 4: "lumbar spine"}
    create_splits_and_write_json(
        images, labels, test_ratio, n_folds, json_name, seed, label_dict
    )


####
@register_make
def make_colon_acrin6664():
    base_url = "/data/COLON_ACRIN6664"
    dataset_name = "COLON_ACRIN6664"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(os.path.join(base_url, "mask"), ".nii.gz")
    images, labels = [], []
    for mask in masks:
        mask = os.path.relpath(mask, base_url)
        labels.append(mask)
        img = "_".join(mask.split("_")[1:3]) + ".nii.gz"
        img = os.path.join("nifti", img)
        images.append(img)
    label_dict = {1: "sacrum", 2: "left hip", 3: "right hip", 4: "lumbar spine"}
    create_splits_and_write_json(
        images, labels, test_ratio, n_folds, json_name, seed, label_dict
    )


####
@register_make
def make_adrenal_ki67():
    base_url = "/data/Adrenal_Ki67"
    dataset_name = "Adrenal_Ki67"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(base_url, "seg-1__fix.nii.gz")
    images, labels = [], []
    for mask in masks:
        mask = os.path.relpath(mask, base_url)
        labels.append(mask)
        img_folder = os.path.join(base_url, os.path.dirname(mask))
        img_name = [
            s
            for s in sorted(glob(os.path.join(img_folder, "*.nii.gz")))
            if "seg" not in os.path.basename(s)
        ][0]
        img_name = os.path.relpath(img_name, base_url)
        if "Ki67_Seg_049" in img_name:
            img_name = os.path.join(
                "Adrenal_Ki67_Seg_049-Adrenal_Ki67_Seg_049",
                "3-CAP_W_O_5.0_I30f_3_3.nii.gz",
            )
        if "Ki67_Seg_053" in img_name:
            img_name = os.path.join(
                "Adrenal_Ki67_Seg_053-Adrenal_Ki67_Seg_053", "7-ABD_AX_3_PV_7.nii.gz"
            )
        images.append(img_name)
    label_dict = {1: "adrenocortical tumor"}
    create_splits_and_write_json(
        images, labels, test_ratio, n_folds, json_name, seed, label_dict
    )


####
@register_make
def make_hcc_tace():
    base_url = "/data/HCC-TACE-Seg"
    dataset_name = "HCC-TACE-Seg"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(base_url, "seg__fix.nii.gz")
    images, labels = [], []
    for mask in masks:
        mask = os.path.relpath(mask, base_url)
        if "089" in mask:
            mask = mask.replace("seg__fix.nii.gz", "seg_ori__fix_2.nii.gz", 1)
        labels.append(mask)
        img_folder = os.path.join(base_url, os.path.dirname(mask))
        img_name = [
            s
            for s in sorted(glob(os.path.join(img_folder, "*.nii.gz")))
            if "seg" not in os.path.basename(s)
        ][0]
        img_name = os.path.relpath(img_name, base_url)
        images.append(img_name)
    label_dict = {2: "hepatic tumor"}
    create_splits_and_write_json(
        images, labels, test_ratio, n_folds, json_name, seed, label_dict
    )


####
@register_make
def make_micro_ct_murine_native():
    base_url = "/data/micro-ct-murine/1_nativeCTdata_nifti"
    dataset_name = "micro-ct-murine-native"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(base_url, "seg.nii.gz")
    images, labels = [], []
    for mask in masks:
        mask = os.path.relpath(mask, base_url)
        labels.append(mask)
        img_name = mask.replace("seg.nii.gz", "CT140.nii.gz")
        images.append(img_name)
    label_dict = {1: "heart", 2: "spinal cord", 3: "right lung", 4: "left lung"}
    create_splits_and_write_json(
        images, labels, test_ratio, n_folds, json_name, seed, label_dict
    )


####
@register_make
def make_micro_ct_murine_contrast():
    base_url = "/data/micro-ct-murine/2_contrast-enhancedCTdata_nifti"
    dataset_name = "micro-ct-murine-contrast"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(base_url, "seg.nii.gz")
    images, labels = [], []
    for mask in masks:
        mask = os.path.relpath(mask, base_url)
        labels.append(mask)
        img_name = mask.replace("seg.nii.gz", "CT140.nii.gz")
        images.append(img_name)
    label_dict = {1: "heart", 2: "spinal cord", 3: "right lung", 4: "left lung"}
    create_splits_and_write_json(
        images, labels, test_ratio, n_folds, json_name, seed, label_dict
    )


####
@register_make
def make_segrap2023_task1():
    base_url = "/data/segrap23/"
    dataset_name = "segrap23-task1"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(
        os.path.join(
            base_url, "SegRap2023_Training_Set_120cases_OneHot_Labels", "Task001"
        ),
        ".nii.gz",
    )
    images, labels = [], []
    for mask in masks:
        mask = os.path.relpath(mask, base_url)
        labels.append(mask)
        s_id = os.path.basename(mask)[: -len(".nii.gz")]
        img_name = os.path.join(
            "SegRap2023_Training_Set_120cases", f"{s_id}", "image.nii.gz"
        )
        images.append(img_name)
    original_label_dict = {
        "1": "Brain",
        "2": "BrainStem",
        "3": "Chiasm",
        "4": "TemporalLobe_L",
        "5": "TemporalLobe_R",
        "6": "TemporalLobe_Hippocampus_OverLap_L",
        "7": "TemporalLobe_Hippocampus_OverLap_R",
        "8": "Hippocampus_L",
        "9": "Hippocampus_R",
        "10": "Eye_L",
        "11": "Eye_R",
        "12": "Lens_L",
        "13": "Lens_R",
        "14": "OpticNerve_L",
        "15": "OpticNerve_R",
        "16": "MiddleEar_L",
        "17": "MiddleEar_R",
        "18": "IAC_L",
        "19": "IAC_R",
        "20": "MiddleEar_TympanicCavity_OverLap_L",
        "21": "MiddleEar_TympanicCavity_OverLap_R",
        "22": "TympanicCavity_L",
        "23": "TympanicCavity_R",
        "24": "MiddleEar_VestibulSemi_OverLap_L",
        "25": "MiddleEar_VestibulSemi_OverLap_R",
        "26": "VestibulSemi_L",
        "27": "VestibulSemi_R",
        "28": "Cochlea_L",
        "29": "Cochlea_R",
        "30": "MiddleEar_ETbone_OverLap_L",
        "31": "MiddleEar_ETbone_OverLap_R",
        "32": "ETbone_L",
        "33": "ETbone_R",
        "34": "Pituitary",
        "35": "OralCavity",
        "36": "Mandible_L",
        "37": "Mandible_R",
        "38": "Submandibular_L",
        "39": "Submandibular_R",
        "40": "Parotid_L",
        "41": "Parotid_R",
        "42": "Mastoid_L",
        "43": "Mastoid_R",
        "44": "TMjoint_L",
        "45": "TMjoint_R",
        "46": "SpinalCord",
        "47": "Esophagus",
        "48": "Larynx",
        "49": "Larynx_Glottic",
        "50": "Larynx_Supraglot",
        "51": "Larynx_PharynxConst_OverLap",
        "52": "PharynxConst",
        "53": "Thyroid",
        "54": "Trachea",
    }
    label_dict = {
        "1": "brain",
        "2": "brain stem",
        "3": "optic chiasm",
        "4": "left temporal lobe",
        "5": "right temporal lobe",
        "6": "left temporal lobe hippocampus overlap",
        "7": "right temporal lobe hippocampus overlap",
        "8": "left hippocampus",
        "9": "right hippocampus",
        "10": "left eye",
        "11": "right eye",
        "12": "left lens",
        "13": "right lens",
        "14": "left optic nerve",
        "15": "right optic nerve",
        "16": "left middle ear",
        "17": "right middle ear",
        "18": "left internal auditory canal",
        "19": "right internal auditory canal",
        "20": "left middle ear tympanic cavity overlap",
        "21": "right middle ear tympanic cavity overlap",
        "22": "left tympanic cavity",
        "23": "right tympanic cavity",
        "24": "left middle ear vestibular semicircular canal overlap",
        "25": "right middle ear vestibular semicircular canal overlap",
        "26": "left vestibular semicircular canal",
        "27": "right vestibular semicircular canal",
        "28": "left cochlea",
        "29": "right cochlea",
        "30": "left middle ear eustachian tube bone overlap",
        "31": "right middle ear eustachian tube bone overlap",
        "32": "left eustachian tube bone",
        "33": "right eustachian tube bone",
        "34": "pituitary",
        "35": "oral cavity",
        "36": "left mandible",
        "37": "right mandible",
        "38": "left submandibular",
        "39": "right submandibular",
        "40": "left parotid",
        "41": "right parotid",
        "42": "left mastoid",
        "43": "right mastoid",
        "44": "left temporomandibular joint",
        "45": "right temporomandibular joint",
        "46": "spinal cord",
        "47": "esophagus",
        "48": "larynx",
        "49": "larynx glottic",
        "50": "larynx supraglottic",
        "51": "larynx pharynx const overlap",
        "52": "pharynx const",
        "53": "thyroid",
        "54": "trachea",
    }
    create_splits_and_write_json(
        images,
        labels,
        test_ratio,
        n_folds,
        json_name,
        seed,
        label_dict,
        original_label_dict,
    )


####
@register_make
def make_pediatric_ct_seg():
    base_url = "/data/Pediatric-CT-SEG/"
    dataset_name = "Pediatric-CT-SEG"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(base_url, "seg.nii.gz")
    images, labels = [], []
    for mask in masks:
        mask = os.path.relpath(mask, base_url)
        labels.append(mask)
        img_name = mask.replace("seg.nii.gz", "image.nii.gz")
        images.append(img_name)
    original_label_dict = {
        1: "bladder",
        2: "rectum",
        3: "gonads",
        4: "prostate",
        5: "uterocervix",
        6: "femoral-head-lef",
        7: "femoral-head-rig",
        8: "small-intestine",
        9: "large-intestine",
        10: "spinal-canal",
        11: "gall-bladder",
        12: "kidney-left",
        13: "kidney-right",
        14: "spleen",
        15: "liver",
        16: "stomach",
        17: "pancreas",
        18: "duodenum",
        19: "adrenal-left",
        20: "adrenal-right",
        21: "heart",
        22: "esophagus",
        23: "lung_l",
        24: "lung_r",
        25: "breast-left",
        26: "breast-right",
        27: "thymus",
        28: "skin",
        29: "bones",
    }

    label_dict = {
        1: "bladder",
        2: "rectum",
        3: "gonads",
        4: "prostate",
        5: "uterocervix",
        6: "left femoral head",
        7: "right femoral head",
        8: "small intestine",
        9: "large intestine",
        10: "spinal canal",
        11: "gallbladder",
        12: "left kidney",
        13: "right kidney",
        14: "spleen",
        15: "liver",
        16: "stomach",
        17: "pancreas",
        18: "duodenum",
        19: "left adrenal",
        20: "right adrenal",
        21: "heart",
        22: "esophagus",
        23: "left lung",
        24: "right lung",
        25: "left breast",
        26: "right breast",
        27: "thymus",
        28: "skin",
        29: "bones",
    }
    create_splits_and_write_json(
        images,
        labels,
        test_ratio,
        n_folds,
        json_name,
        seed,
        label_dict,
        original_label_dict,
    )


####
@register_make
def make_autopet_atlas():
    base_url = "/data/"
    dataset_name = "AutoPET-Atlas"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(os.path.join(base_url, "AutoPET-Atlas"), ".nii.gz")
    images, labels = [], []
    for mask in masks:
        mask = os.path.relpath(mask, base_url)
        labels.append(mask)
        pat_id = mask.split("_")[1]
        img_folder = os.path.join(
            base_url, "Autopet23", "FDG-PET-CT-Lesions", f"PETCT_{pat_id}"
        )
        image_nii = search_image_files(img_folder, "CT.nii.gz")[0]
        img_name = os.path.relpath(image_nii, base_url)
        images.append(img_name)
    label_dict = {
        2: "muscles",
        3: "fat",
        4: "abdominal tissue",
        5: "mediastinal tissue",
        6: "esophagus",
        7: "stomach",
        8: "small bowel",
        9: "duodenum",
        10: "colon",
        11: "rectum",
        12: "gallbladder",
        13: "liver",
        14: "pancreas",
        15: "left kidney",
        16: "right kidney",
        17: "bladder",
        18: "gonads",
        19: "prostate",
        20: "uterocervix",
        21: "uterus",
        22: "left breast",
        23: "right breast",
        24: "spinal canal",
        25: "brain",
        26: "spleen",
        27: "left adrenal gland",
        28: "right adrenal gland",
        29: "left thyroid",
        30: "right thyroid",
        31: "thymus",
        32: "left gluteus maximus",
        33: "right gluteus maximus",
        34: "left gluteus medius",
        35: "right gluteus medius",
        36: "left gluteus minimus",
        37: "right gluteus minimus",
        38: "left iliopsoas",
        39: "right iliopsoas",
        40: "left autochthon",
        41: "right autochthon",
        42: "skin",
        43: "vertebrae C1",
        44: "vertebrae C2",
        45: "vertebrae C3",
        46: "vertebrae C4",
        47: "vertebrae C5",
        48: "vertebrae C6",
        49: "vertebrae C7",
        50: "vertebrae T1",
        51: "vertebrae T2",
        52: "vertebrae T3",
        53: "vertebrae T4",
        54: "vertebrae T5",
        55: "vertebrae T6",
        56: "vertebrae T7",
        57: "vertebrae T8",
        58: "vertebrae T9",
        59: "vertebrae T10",
        60: "vertebrae T11",
        61: "vertebrae T12",
        62: "vertebrae L1",
        63: "vertebrae L2",
        64: "vertebrae L3",
        65: "vertebrae L4",
        66: "vertebrae L5",
        67: "left costa 1",
        68: "right costa 1",
        69: "left costa 2",
        70: "right costa 2",
        71: "left costa 3",
        72: "right costa 3",
        73: "left costa 4",
        74: "right costa 4",
        75: "left costa 5",
        76: "right costa 5",
        77: "left costa 6",
        78: "right costa 6",
        79: "left costa 7",
        80: "right costa 7",
        81: "left costa 8",
        82: "right costa 8",
        83: "left costa 9",
        84: "right costa 9",
        85: "left costa 10",
        86: "right costa 10",
        87: "left costa 11",
        88: "right costa 11",
        89: "left costa 12",
        90: "right costa 12",
        91: "rib_cartilage",
        92: "sternum",
        93: "left clavicle",
        94: "right clavicle",
        95: "left scapula",
        96: "right scapula",
        97: "left humerus",
        98: "right humerus",
        99: "skull",
        100: "left hip",
        101: "right hip",
        102: "sacrum",
        103: "left femur",
        104: "right femur",
        105: "heart   ",
        106: "left heart atrium",
        107: "heart tissue",
        108: "right heart atrium",
        109: "heart myocardium",
        110: "left heart ventricle",
        111: "right heart ventricle",
        112: "left iliac artery",
        113: "right iliac artery",
        114: "aorta",
        115: "left iliac vena",
        116: "right iliac vena",
        117: "inferior vena cava",
        118: "portal vein and splenic vein",
        119: "celiac trunk",
        120: "left lung lower lobe",
        121: "left lung upper lobe",
        122: "right lung lower lobe",
        123: "right lung middle lobe",
        124: "right lung upper lobe",
        125: "bronchie",
        126: "trachea",
        127: "pulmonary artery",
        128: "left cheek",
        129: "right cheek",
        130: "left eyeball",
        131: "right eyeball",
    }
    create_splits_and_write_json(
        images, labels, test_ratio, n_folds, json_name, seed, label_dict
    )


####
@register_make
def make_uls23():
    base_url = "/data/ULS23"
    dataset_name = "ULS23_DeepLesion"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    # data/ULS23/ULS23_annotations/processed_data/partially_annotated/DeepLesion/labels_grabcut
    seg_folder = [
        base_url,
        "ULS23_annotations",
        "processed_data",
        "partially_annotated",
        "DeepLesion",
        "labels_grabcut",
    ]
    masks = search_image_files(os.path.join(*seg_folder), ".nii.gz")
    images, labels = [], []
    for mask in masks:
        mask = os.path.relpath(mask, base_url)
        labels.append(mask)
        img_name = mask.replace("ULS23_annotations", "ULS23").replace(
            "labels_grabcut", "images"
        )
        images.append(img_name)
    label_dict = {1: "lesion"}
    create_splits_and_write_json(
        images, labels, test_ratio, n_folds, json_name, seed, label_dict
    )


####
@register_make
def make_uls23_deeplesion3d():
    base_url = "/data/ULS23"
    dataset_name = "ULS23_DeepLesion3D"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    # /data/ULS23/ULS23_annotations/novel_data/ULS23_DeepLesion3D/labels
    seg_folder = [
        base_url,
        "ULS23_annotations",
        "novel_data",
        "ULS23_DeepLesion3D",
        "labels",
    ]
    masks = search_image_files(os.path.join(*seg_folder), ".nii.gz")
    images, labels = [], []
    for mask in masks:
        mask = os.path.relpath(mask, base_url)
        labels.append(mask)
        img_name = mask.replace("ULS23_annotations", "ULS23").replace(
            "labels", "images"
        )
        images.append(img_name)
    label_dict = {1: "lesion"}
    create_splits_and_write_json(
        images, labels, test_ratio, n_folds, json_name, seed, label_dict
    )


####
@register_make
def make_uls23_bone():
    base_url = "/data/ULS23"
    dataset_name = "ULS23_Bone"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    # /data/ULS23/ULS23_annotations/novel_data/ULS23_Radboudumc_Bone/labels
    seg_folder = [
        base_url,
        "ULS23_annotations",
        "novel_data",
        "ULS23_Radboudumc_Bone",
        "labels",
    ]
    masks = search_image_files(os.path.join(*seg_folder), ".nii.gz")
    images, labels = [], []
    for mask in masks:
        mask = os.path.relpath(mask, base_url)
        labels.append(mask)
        img_name = mask.replace("ULS23_annotations", "ULS23").replace(
            "labels", "images"
        )
        images.append(img_name)
    label_dict = {1: "lesion"}
    create_splits_and_write_json(
        images, labels, test_ratio, n_folds, json_name, seed, label_dict
    )


####
@register_make
def make_uls23_pancreas():
    base_url = "/data/ULS23"
    dataset_name = "ULS23_Pancreas"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    # /data/ULS23/ULS23_annotations/novel_data/ULS23_Radboudumc_Pancreas/labels
    seg_folder = [
        base_url,
        "ULS23_annotations",
        "novel_data",
        "ULS23_Radboudumc_Pancreas",
        "labels",
    ]
    masks = search_image_files(os.path.join(*seg_folder), ".nii.gz")
    images, labels = [], []
    for mask in masks:
        mask = os.path.relpath(mask, base_url)
        labels.append(mask)
        img_name = mask.replace("ULS23_annotations", "ULS23").replace(
            "labels", "images"
        )
        images.append(img_name)
    label_dict = {1: "lesion"}
    create_splits_and_write_json(
        images, labels, test_ratio, n_folds, json_name, seed, label_dict
    )


####
@register_make
def make_mr_amos22():
    base_url = "/data/AMOS22"
    dataset_name = "MR_AMOS22"
    json_name = os.path.join(output_json_dir, f"{dataset_name}_{n_folds}_folds.json")
    masks = search_image_files(os.path.join(base_url, "labelsTr"), ".nii.gz")
    masks += search_image_files(os.path.join(base_url, "labelsVa"), ".nii.gz")
    images, labels = [], []
    for mask in masks:
        rel_mask = os.path.relpath(mask, base_url)
        labels.append(rel_mask)
        idx = re.compile(r"amos_(\d+).nii.gz").search(rel_mask)[1]
        if int(idx) < 500:  # skip the CT cases
            labels.pop()
            continue
        img_name = f"amos_{idx}.nii.gz"
        for f in ["imagesTr", "imagesVa"]:
            if os.path.exists(os.path.join(base_url, f, img_name)):
                images.append(os.path.join(f, img_name))
                break
        # print(f"image: {images[-1]}, label: {labels[-1]}")
        filtering_files(base_url, images, labels)
    original_label_dict = {
        1: "spleen",
        2: "right kidney",
        3: "left kidney",
        4: "gallbladder",
        5: "esophagus",
        6: "liver",
        7: "stomach",
        8: "aorta",
        9: "postcava",
        10: "pancreas",
        11: "right adrenal gland",
        12: "left adrenal gland",
        13: "duodenum",
        14: "bladder",
        15: "prostate or uterus",
    }
    label_dict = {
        1: "spleen",
        2: "right kidney",
        3: "left kidney",
        4: "gallbladder",
        5: "esophagus",
        6: "liver",
        7: "stomach",
        8: "aorta",
        9: "inferior vena cava",
        10: "pancreas",
        11: "right adrenal gland",
        12: "left adrenal gland",
        13: "duodenum",
        14: "bladder",
        15: "prostate or uterus",
    }
    create_splits_and_write_json(
        images,
        labels,
        test_ratio,
        n_folds,
        json_name,
        seed,
        label_dict,
        original_label_dict,
    )


if __name__ == "__main__":
    pprint(_make_funcs)
    for func_name, f in _make_funcs.items():
        print(f"running {func_name}")
        f()
