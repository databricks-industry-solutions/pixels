import mlflow
from mlflow.entities import SpanType

import logging
import os
import time

import json
import tempfile
import SimpleITK as sitk
from monailabel.interfaces.datastore import Datastore

import numpy as np

logger = logging.getLogger(__name__)

@mlflow.trace(span_type=SpanType.TOOL)
def to_nrrd(file_path, pixel_type="uint16"):

    if pixel_type.lower() == "uint8":
        output_pixel_type = sitk.sitkUInt8
    elif pixel_type.lower() == "uint16":
        output_pixel_type = sitk.sitkUInt16
    elif pixel_type.lower() == "float32":
        output_pixel_type = sitk.sitkFloat32
    else:
        raise Exception("Unsupported pixel type", pixel_type)

    if file_path.endswith(".nii.gz") or file_path.endswith(".nii") or file_path.endswith(".dcm"):
        img = sitk.ReadImage(file_path, outputPixelType=output_pixel_type)
        output_file = tempfile.NamedTemporaryFile(suffix=".nrrd").name
        sitk.WriteImage(img, output_file)
        return output_file
    else:
        raise Exception("Unable to convert file", file_path)

@mlflow.trace(span_type=SpanType.TOOL)
def calculate_volumes_and_overlays(nifti_file, seg_file, label_dict, export_overlays=False, export_metrics=False, output_dir='overlaps', num_slices=5,  keys=['image','label'], window_center = 50, window_width = 400):
    from monai.transforms import Compose, LoadImageD, OrientationD, ScaleIntensityRangeD
    import cupy as cp
    import nibabel as nib
    import skimage
    from cucim.skimage.color import label2rgb

    from vista3d_bundle.configs.utils import Dye

    os.makedirs(output_dir, exist_ok=True)

    composed = Compose([LoadImageD(keys=keys, ensure_channel_first=True),
                        OrientationD(keys=keys, axcodes="LAS"),
                        ScaleIntensityRangeD(
                        keys=['image'],
                        a_min=window_center - window_width / 2,
                        a_max=window_center + window_width / 2,
                        b_min=0,
                        b_max=255,
                        clip=True)
        ])({'image': nifti_file,'label': seg_file})

    nifti_seg_header = nib.load(seg_file).header

    nifti_data = cp.rot90(cp.array(composed['image'][0]), k=1)
    seg_data = cp.rot90(cp.array(composed['label'][0]), k=1)

    # Get unique labels
    unique_labels = cp.unique(seg_data)
    unique_labels = unique_labels[unique_labels != 0]

    # Get voxel dimensions from header
    voxel_dims = nifti_seg_header.get_zooms()
    voxel_volume = np.prod(voxel_dims)
    
    output = {}

    for label_num, label in enumerate(unique_labels):
        label_idx = int(label.get())
        label_name = label_dict.get(label_idx)

        logger.warn(f"Processing label: {label} - {label_name}")
        
        if label_name is None:
            logger.warn(f"No label name found for label: {label_num}, skipping")
            continue

        color_name = Dye.COLORS[label_num % len(Dye.COLORS)]

        output[label_name] = {}

        mask = seg_data == label
        z_indices = cp.where(cp.any(mask, axis=(0,1)))[0]
        
        if len(z_indices) > num_slices:
            positions = cp.linspace(0, len(z_indices) - 1, num_slices, dtype=int)
            indices = z_indices[positions]
        else:
            indices = z_indices
        
        if export_metrics:
            voxel_count = cp.sum(seg_data == label)
            volume = voxel_count * voxel_volume

            output[label_name]['voxel_count'] = int(voxel_count.get())
            output[label_name]['volume_cm3'] = float(volume.get()) / 1000
            output[label_name]['color'] = color_name

        if export_overlays:
            output[label_name]['overlay_paths'] = []
        
            for idx in indices:
                idx_val = idx.get()
                slice_img = nifti_data[:,:,idx_val]
                slice_img = (slice_img - slice_img.min()) / (slice_img.max() - slice_img.min())

                slice_mask = mask[:,:,idx]

                color_label = (
                    label2rgb(
                        slice_mask, colors=[color_name], image=slice_img, bg_label=0
                    )
                * 255
                )

                filename = f'label_{label_name.lower().replace(" ", "_")}_slice_{int(idx_val)}.jpg'
                filepath = os.path.join(output_dir, filename)
                skimage.io.imsave(filepath, color_label.get().astype(np.uint8))
                
                output[label_name]['overlay_paths'].append(filepath)
                
    return output

def init_dicomweb_datastore(host, access_token, sql_warehouse_id, table) -> Datastore:

        from monailabel.config import settings
        from monailabel.datastore.dicom import DICOMWebDatastore
        from monailabel.datastore.databricks_client import DatabricksClient

        if "databricks" in host:
            dw_client = DatabricksClient(url=host, 
                                         token=access_token, 
                                         warehouse_id=sql_warehouse_id, 
                                         table=table)

        cache_path = settings.MONAI_LABEL_DICOMWEB_CACHE_PATH
        cache_path = cache_path.strip() if cache_path else ""
        fetch_by_frame = settings.MONAI_LABEL_DICOMWEB_FETCH_BY_FRAME
        search_filter = settings.MONAI_LABEL_DICOMWEB_SEARCH_FILTER
        convert_to_nifti = settings.MONAI_LABEL_DICOMWEB_CONVERT_TO_NIFTI
        
        return DICOMWebDatastore(
            client=dw_client,
            search_filter=search_filter,
            cache_path=cache_path if cache_path else None,
            fetch_by_frame=fetch_by_frame,
            convert_to_nifti=convert_to_nifti,
        )

@mlflow.trace(span_type=SpanType.TOOL)
def series_to_nifti(datastore, series_uid):
    #get image in .cache folder
    image = datastore.get_image(series_uid)
    #get cached image uri
    nifti_path = datastore.get_image_uri(series_uid)
    #get cached image infos
    image_info = datastore.get_image_info(series_uid)
    return nifti_path, image_info

def itk_image_to_dicom_seg(itkbin_folder, label, series_dir, template) -> str:
    from monailabel.utils.others.generic import run_command

    output_file = tempfile.NamedTemporaryFile(suffix=".dcm").name
    meta_data = tempfile.NamedTemporaryFile(suffix=".json").name

    with open(meta_data, "w") as fp:
        json.dump(template, fp)

    command = itkbin_folder + "/itkimage2segimage"
    
    try:  os.chmod(command, 0o755)
    except Exception as e:
        pass
    
    args = [
        "--inputImageList",
        label,
        "--inputDICOMDirectory",
        series_dir,
        "--outputDICOM",
        output_file,
        "--inputMetadata",
        meta_data,
    ]

    run_command(command, args)
    os.unlink(meta_data)
    return output_file
      
@mlflow.trace(span_type=SpanType.TOOL)
def nifti_to_dicom_seg(itkbin_folder, series_dir, label, label_info, file_ext="*", use_itk=True, series_description="segmentation") -> str:
    import pathlib
    import pydicom_seg
    from pydicom.filereader import dcmread
    from monai.transforms import LoadImage
    from monailabel.datastore.utils.colors import GENERIC_ANATOMY_COLORS
    
    start = time.time()

    label_np, meta_dict = LoadImage(image_only=False)(label)
    unique_labels = np.unique(label_np.flatten()).astype(np.int_)
    unique_labels = unique_labels[unique_labels != 0]

    info = label_info[0] if label_info and 0 < len(label_info) else {}
    model_name = info.get("model_name", "AIName")

    segment_attributes = []
    for i, idx in enumerate(unique_labels):
        info = label_info[idx] if label_info and idx < len(label_info) else {}
        name = info.get("name", "unknown")
        description = info.get("description", "Unknown")
        rgb = list(info.get("color", GENERIC_ANATOMY_COLORS.get(name, (255, 0, 0))))[0:3]
        rgb = [int(x) for x in rgb]

        logger.info(f"{i} => {idx} => {name}")

        segment_attribute = info.get(
            "segmentAttribute",
            {
                "labelID": int(idx),
                "SegmentLabel": name,
                "SegmentDescription": description,
                "SegmentAlgorithmType": "AUTOMATIC",
                "SegmentAlgorithmName": "MONAILABEL",
                "SegmentedPropertyCategoryCodeSequence": {
                    "CodeValue": "123037004",
                    "CodingSchemeDesignator": "SCT",
                    "CodeMeaning": "Anatomical Structure",
                },
                "SegmentedPropertyTypeCodeSequence": {
                    "CodeValue": "78961009",
                    "CodingSchemeDesignator": "SCT",
                    "CodeMeaning": name,
                },
                "recommendedDisplayRGBValue": rgb,
            },
        )
        segment_attributes.append(segment_attribute)

    template = {
        "ContentCreatorName": "Reader1",
        "ClinicalTrialSeriesID": "Session1",
        "ClinicalTrialTimePointID": "1",
        "SeriesNumber": "9999",
        "SeriesDescription": series_description,
        "InstanceNumber": "1",
        "segmentAttributes": [segment_attributes],
        "ContentLabel": series_description,
        "ContentDescription": "Pixels - MONAI Label - Image segmentation",
        "ClinicalTrialCoordinatingCenterName": "Pixels - MONAI",
        "BodyPartExamined": "",
    }

    if not segment_attributes:
        logger.error("Missing Attributes/Empty Label provided")
        return ""

    logger.warning(f"PRE ITK_IMAGE_TO_DICOM_SEG: {time.time() - start} (sec)")
            
    if use_itk:
        output_file = itk_image_to_dicom_seg(itkbin_folder, label, series_dir, template)
    else:
        template = pydicom_seg.template.from_dcmqi_metainfo(template)
        writer = pydicom_seg.MultiClassWriter(
            template=template,
            inplane_cropping=False,
            skip_empty_slices=False,
            skip_missing_segment=False,
        )

        # Read source Images
        series_dir = pathlib.Path(series_dir)
        image_files = series_dir.glob(file_ext)
        image_datasets = [dcmread(str(f), stop_before_pixels=True) for f in image_files]
        logger.info(f"Total Source Images: {len(image_datasets)}")

        mask = sitk.ReadImage(label)
        mask = sitk.Cast(mask, sitk.sitkUInt16)

        output_file = tempfile.NamedTemporaryFile(suffix=".dcm").name
        dcm = writer.write(mask, image_datasets)
        dcm.save_as(output_file)

    logger.warning(f"nifti_to_dicom_seg latency : {time.time() - start} (sec)")
    return output_file
