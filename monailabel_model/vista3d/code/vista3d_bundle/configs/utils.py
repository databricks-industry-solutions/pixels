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

import base64
import itertools
import logging
import os
import re
from io import BytesIO
from pathlib import Path
from shutil import copyfile, rmtree

import nibabel as nib
import numpy as np
import requests
import skimage
from monai.transforms import Compose, LoadImageD, MapTransform, OrientationD, ScaleIntensityD, ScaleIntensityRangeD
from PIL import Image
from PIL import Image as PILImage
from PIL.Image import Image
from tqdm import tqdm

logger = logging.getLogger("gradio_m3")


MODALITY_MAP = {
    "cxr": "CXR",
    "chest x-ray": "CXR",
    "ct image": "CT",
    "mri": "MRI",
    "magnetic resonance imaging": "MRI",
    "ultrasound": "US",
    "cell imaging": "cell imaging",
}


class Dye(MapTransform):
    """
    Dye the label map with predefined colors and write the image and label to disk.

    Args:
        slice_index: the index of the slice to be dyed. If None, the middle slice will be picked.
        axis: the axis of the slice.
        image_key: the key to extract the image data.
        label_key: the key to extract the label data.
        image_filename: the filename to save the image.
        label_filename: the filename to save the label.
        output_dir: the directory to save the image and label.
        bg_label: the label value for the background.
    """

    COLORS = [
        "red",
        "blue",
        "yellow",
        "magenta",
        "green",
        "indigo",
        "darkorange",
        "cyan",
        "pink",
        "brown",
        "orange",
        "lime",
        "orange",
        "gold",
        "yellowgreen",
        "darkgreen",
    ]

    def __init__(
        self,
        slice_index: int | None = None,
        axis: int = 2,
        image_key: str = "image",
        label_key: str = "label",
        image_filename: str = "image.jpg",
        label_filename: str = "label.jpg",
        output_dir: Path = Path("."),
        bg_label: int = 0,
    ):
        """Initialize the dye transform."""
        self.slice_index = slice_index
        self.axis = axis
        self.image_key = image_key
        self.label_key = label_key
        self.image_filename = image_filename
        self.label_filename = label_filename
        self.output_dir = Path(output_dir)
        self.bg_label = bg_label
        self.keys = [self.image_key, self.label_key]
        self.allow_missing_keys = True

    def __call__(self, data):
        """Dye the label map with predefined colors and write the image and label to disk."""
        d = dict(data)
        for key in self.key_iterator(d):
            np_array = np.squeeze(d.get(key))
            slice_index = np_array.shape[2] // 2 if self.slice_index is None else self.slice_index
            slice = np.take(np_array, slice_index, axis=self.axis)
            d[key] = np.rot90(np.swapaxes(slice.astype(np.uint8), 0, 1), k=2)

        os.makedirs(self.output_dir, exist_ok=True)
        skimage.io.imsave(self.output_dir / self.image_filename, np.stack([d[self.image_key]] * 3, axis=-1))

        if self.label_key in d:
            color_label = (
                skimage.color.label2rgb(
                    d[self.label_key], colors=self.COLORS, image=d[self.image_key], bg_label=self.bg_label
                )
                * 255
            )

            skimage.io.imsave(self.output_dir / self.label_filename, color_label.astype(np.uint8))

            unique_labels = np.unique(d[self.label_key])
            color_cyle = itertools.cycle(Dye.COLORS)

            colormap = {}
            unique_labels = unique_labels[unique_labels != self.bg_label]  # remove background label
            for label_id, label_color in zip(unique_labels, color_cyle):
                colormap[label_id] = label_color
            d["colormap"] = colormap
        return d


def get_filename_from_cd(url, cd):
    """Get filename from content-disposition"""
    if not cd:
        if url.find("/"):
            return url.rsplit("/", 1)[1]
        return None

    fname = re.findall("filename=(.+)", cd)
    if len(fname) == 0:
        return None
    return fname[0].strip('"').strip("'")


def get_slice_filenames(image_file: str, slice_index: int, ext: str = "jpg"):
    """Small helper function to get the slice filenames"""
    base_name = os.path.basename(image_file)
    return base_name.replace(".nii.gz", f"_slice{slice_index}_img.{ext}")


def _get_modality_url(image_url_or_path: str | None):
    """
    Extract image modality by checking the URL or file path.
    If the URL or file path contains ".nii.gz" and contain "mri_", then it is MRI, else it is CT.
    If it contains "cxr_" then it is CXR, otherwise it is Unknown.
    """
    if isinstance(image_url_or_path, list) and len(image_url_or_path) > 0:
        image_url_or_path = image_url_or_path[0]
    if not isinstance(image_url_or_path, str):
        return "Unknown"
    if image_url_or_path.startswith("data:image"):
        return "Unknown"
    if ".nii.gz" in image_url_or_path.lower():
        if "mri_" in image_url_or_path.lower():
            return "MRI"
        return "CT"
    if "cxr_" in image_url_or_path.lower():
        return "CXR"
    return "Unknown"


def _get_modality_text(text: str):
    """Get the modality from the text"""
    if not text:
        return "Unknown"
    for keyword, modality in MODALITY_MAP.items():
        if keyword.lower() in text.lower():
            return modality
    return "Unknown"


def get_modality(image_url: str | None, text: str | None = None):
    """Get the modality from the image URL or text"""
    logger.debug(f"Getting modality from image URL or text")
    modality = _get_modality_url(image_url)
    if modality != "Unknown":
        return modality
    return _get_modality_text(text)


def get_monai_transforms(
    keys,
    output_dir: Path | str,
    image_key="image",
    modality: str = "CT",
    slice_index: int | None = None,
    axis: int = 2,
    image_filename: str = "image.jpg",
    label_filename: str = "label.jpg",
):
    """
    Get the MONAI transforms for the modality.

    Args:
        keys: the keys.
        output_dir: the output directory.
        image_key: the image key.
        modality: the modality.
        slice_index: the slice index.
        axis: the axis.
    """
    logger.debug(f"Getting MONAI transforms for modality: {modality}")
    if image_key not in keys:
        raise ValueError(f"Image key {image_key} not found in the keys: {keys}")

    if modality == "CT":
        # abdomen soft tissue https://radiopaedia.org/articles/windowing-ct
        window_center = 50
        window_width = 400
        scaler = ScaleIntensityRangeD(
            keys=[image_key],
            a_min=window_center - window_width / 2,
            a_max=window_center + window_width / 2,
            b_min=0,
            b_max=255,
            clip=True,
        )
    elif modality == "MRI":
        scaler = ScaleIntensityD(keys=[image_key], minv=0, maxv=255, channel_wise=True)
    else:
        raise ValueError(f"Unsupported modality: {modality}. Supported modalities are 'CT' and 'MRI'.")

    return Compose(
        [
            LoadImageD(keys=keys, ensure_channel_first=True),
            OrientationD(keys=keys, axcodes="RAS"),
            scaler,
            Dye(
                slice_index=slice_index,
                axis=axis,
                output_dir=output_dir,
                image_filename=image_filename,
                label_filename=label_filename,
            ),
        ]
    )


def save_image_url_to_file(image_url: str, output_dir: Path) -> str:
    """Save the image from the URL to the output directory"""
    try:
        url_response = requests.get(image_url, allow_redirects=True)
    except requests.exceptions.RequestException as e:
        raise requests.exceptions.RequestException(f"Failed to download the image: {e}")

    if url_response.status_code != 200:
        raise requests.exceptions.RequestException(f"Failed to download the image: {e}")

    content_disposition = url_response.headers.get("Content-Disposition")
    file_name = os.path.join(output_dir, get_filename_from_cd(image_url, content_disposition))
    with open(file_name, "wb") as f:
        f.write(url_response.content)
    return file_name


def load_image(image_path_or_data_url: str) -> Image:
    """
    Load the image from the URL.

    Args:
        image: the image URL or the base64 encoded image that starts with "data:image".

    Returns:
        PIL.Image: the loaded image.
    """
    logger.debug(f"Loading image from URL")

    if os.path.exists(image_path_or_data_url):
        try:
            return PILImage.open(image_path_or_data_url).convert("RGB")
        except Exception as e:
            raise ValueError(f"Failed to load the image: {e}")
    else:
        image_base64_regex = re.compile(r"^data:image/(png|jpe?g);base64,(.*)$")
        match_results = image_base64_regex.match(image_path_or_data_url)
        if match_results:
            image_base64 = match_results.groups()[1]
            return PILImage.open(BytesIO(base64.b64decode(image_base64))).convert("RGB")

    raise ValueError(f"Unable to load the image from {image_path_or_data_url[:50]}")


def image_to_data_url(image, format="JPEG", max_size=None):
    """
    Convert an image to a data URL.

    Args:
        image (str | np.Array): The image to convert. If a string, it is treated as a file path.
        format (str): The format to save the image in. Default is "JPEG".
        max_size (tuple): The maximum size of the image. Default is None.
    """
    if isinstance(image, str) and os.path.exists(image):
        img = PILImage.open(image)
    else:
        raise ValueError(f"Invalid image type: {type(image)}")
    if max_size is not None:
        # Resize the image to the specified maximum height
        img.thumbnail(max_size)
    # Create a BytesIO buffer to save the image
    buffered = BytesIO()
    # Save the image to the buffer in the specified format
    img.save(buffered, format=format)
    # Convert the buffer content into bytes
    img_byte = buffered.getvalue()
    # Encode the bytes to base64
    img_base64 = base64.b64encode(img_byte).decode()
    # Convert the base64 bytes to string and format the data URL
    return f"data:image/{format.lower()};base64,{img_base64}"


def resize_data_url(data_url, max_size):
    """
    Resize a data URL image to a maximum size.

    Args:
        data_url (str): The data URL of the image.
        max_size (tuple): The maximum size of the image.
    """
    logger.debug(f"Resizing data URL image")
    # Convert the data URL to an image
    img = Image.open(BytesIO(base64.b64decode(data_url.split(",")[1])))
    # Resize the image
    img.thumbnail(max_size)
    # Create a BytesIO buffer to save the image
    buffered = BytesIO()
    # Save the image to the buffer in the specified format
    img.save(buffered, format="JPEG")
    # Convert the buffer content into bytes
    img_byte = buffered.getvalue()
    # Encode the bytes to base64
    img_base64 = base64.b64encode(img_byte).decode()
    # Convert the base64 bytes to string and format the data URL
    return f"data:image/jpeg;base64,{img_base64}"


class ImageCache:
    """A simple image cache to store images and data URLs."""

    def __init__(self, cache_dir: Path):
        """Initialize the image cache."""
        cache_dir = Path(cache_dir)
        if not cache_dir.exists():
            cache_dir.mkdir(parents=True)
        self.cache_dir = cache_dir
        self.cache_images = {}

    def cache(self, image_urls_or_paths):
        """Cache the images from the URLs or paths."""
        logger.debug(f"Caching the image to {self.cache_dir}")
        for _, items in image_urls_or_paths.items():
            items = items if isinstance(items, list) else [items]
            for item in items:
                if item.startswith("http"):
                    self.cache_images[item] = save_image_url_to_file(item, self.cache_dir)
                elif os.path.exists(item):
                    # move the file to the cache directory
                    file_name = os.path.basename(item)
                    self.cache_images[item] = os.path.join(self.cache_dir, file_name)
                    if not os.path.isfile(self.cache_images[item]):
                        copyfile(item, self.cache_images[item])

                if self.cache_images[item].endswith(".nii.gz"):
                    data = nib.load(self.cache_images[item]).get_fdata()
                    for slice_index in tqdm(range(data.shape[2])):
                        image_filename = get_slice_filenames(self.cache_images[item], slice_index)
                        if not os.path.exists(os.path.join(self.cache_dir, image_filename)):
                            compose = get_monai_transforms(
                                ["image"],
                                self.cache_dir,
                                modality=get_modality(item),
                                slice_index=slice_index,
                                image_filename=image_filename,
                            )
                            compose({"image": self.cache_images[item]})

    def cleanup(self):
        """Clean up the cache directory."""
        logger.debug(f"Cleaning up the cache")
        rmtree(self.cache_dir)

    def dir(self):
        """Return the cache directory."""
        return str(self.cache_dir)

    def get(self, key: str | list, default=None, list_return=False):
        """Get the image or data URL from the cache."""
        if isinstance(key, list):
            items = [self.cache_images.get(k) for k in key]
            return items if list_return else items[0]
        return self.cache_images.get(key, default)

def label_id_to_name(label_id: int, label_dict: dict):
        """
        Get the label name from the label ID.

        Args:
            label_id: the label ID.
            label_dict: the label dictionary.
        """
        for group_dict in list(label_dict.values()):
            if isinstance(group_dict, dict):
                # this will skip str type value, such as "everything": <path>
                for label_name, label_id_ in group_dict.items():
                    if label_id == label_id_:
                        return label_name
        return None

def segmentation_to_string(
        output_dir: Path,
        img_file: str,
        seg_file: str,
        label_groups: dict,
        modality: str = "CT",
        slice_index: int | None = None,
        axis: int = 2,
        image_filename: str = "image.jpg",
        label_filename: str = "label.jpg",
        output_prefix="The results are <segmentation>. The colors in this image describe ",
    ):
        """
        Format the segmentation response to a string.

        Args:
            response: the response.
            output_dir: the output directory.
            img_file: the image file path.
            modality: the modality.
            slice_index: the slice index.
            axis: the axis.
            image_filename: the image filename for the sliced image.
            label_filename: the label filename for the sliced image.
            group_label_names: the group label names to filter the label names.
            output_prefix: the output prefix.
            label_groups_path: the label groups path for VISTA-3D.
        """
        output_dir = Path(output_dir)

        transforms = get_monai_transforms(
            ["image", "label"],
            output_dir,
            modality=modality,
            slice_index=slice_index,
            axis=axis,
            image_filename=image_filename,
            label_filename=label_filename,
        )
        data = transforms({"image": img_file, "label": seg_file})

        formatted_items = []

        for label_id in data["colormap"]:
            label_name = label_id_to_name(label_id, label_groups)
            if label_name is not None:
                color = data["colormap"][label_id]
                formatted_items.append(f"{color}: {label_name}")

        return output_prefix + ", ".join(formatted_items) + ". "