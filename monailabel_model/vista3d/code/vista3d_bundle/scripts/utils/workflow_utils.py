import copy
import random

import monai
import numpy as np
import torch
import torch.nn.functional as F

from .trans_utils import erode3d

ENABLE_SPECIAL = True
SPECIAL_INDEX = [23, 24, 25, 26, 27, 57, 128]
MERGE_LIST = {
    1: [25, 26],  # hepatic tumor and vessel merge into liver
    4: [24],  # pancreatic tumor merge into pancreas
    132: [57],  # overlap with trachea merge into airway
}
USE_SV_GT_LIST = [
    "TotalSegmentatorV2",
    "Covid19",
    "NLST",
    "LIDC",
    "StonyBrook-CT",
    "TCIA_Colon",
]


def get_point_label(id):
    """Get point label from class index"""
    # [B, N]
    if id in SPECIAL_INDEX and ENABLE_SPECIAL:
        return 2, 3
    else:
        return 0, 1


def convert_point_label(point_label, label_set=None):
    if label_set is None or not ENABLE_SPECIAL:
        return point_label
    assert point_label.shape[0] == len(label_set)
    for i in range(len(label_set)):
        if label_set[i] in SPECIAL_INDEX:
            for j in range(len(point_label[i])):
                point_label[i, j] = (
                    point_label[i, j] + 2
                    if point_label[i, j] > -1
                    else point_label[i, j]
                )
    return point_label


def none_cat(point, point_pseudo):
    """Concatenate point and point_pseudo and allow None input and padding."""
    _point = None
    if point is not None:
        if point_pseudo is not None:
            if len(point.shape) == 3:
                pad_n = max(point.shape[1], point_pseudo.shape[1])
                point = F.pad(point, (0, 0, 0, pad_n - point.shape[1], 0, 0))
                point_pseudo = F.pad(
                    point_pseudo, (0, 0, 0, pad_n - point_pseudo.shape[1], 0, 0)
                )
            elif len(point.shape) == 2:
                pad_n = max(point.shape[1], point_pseudo.shape[1])
                point = F.pad(point, (0, pad_n - point.shape[1], 0, 0), value=-1)
                point_pseudo = F.pad(
                    point_pseudo, (0, pad_n - point_pseudo.shape[1], 0, 0), value=-1
                )
            elif len(point.shape) == 1:
                pad_n = max(point.shape[0], point_pseudo.shape[0])
                point = F.pad(point, (0, pad_n - point.shape[1]), value=-1)
                point_pseudo = F.pad(
                    point_pseudo, (0, pad_n - point_pseudo.shape[1]), value=-1
                )
            _point = torch.cat([point, point_pseudo], dim=0)
        else:
            _point = point
    elif point_pseudo is not None:
        _point = point_pseudo
    return _point


def sample_points_patch_val(
    labels,
    patch_coords,
    label_set,
    use_center=True,
    mapped_label_set=None,
    max_ppoint=1,
    max_npoint=0,
    **kwargs
):
    """Sample points for patch during sliding window validation. Only used for point only validation.
    Args:
        labels: [1, 1, H, W, D]
        patch_coords: sliding window slice object
        label_set: local index, must match values in labels
        use_center: sample points from the center
        mapped_label_set: global index, it is used to identify special classes.
        max_ppoint/max_npoint: positive points and negative points to sample.
    """
    point_coords, point_labels = generate_prompt_pairs_val(
        labels[patch_coords],
        label_set,
        max_ppoint=max_ppoint,
        max_npoint=max_npoint,
        device=labels.device,
        use_center=use_center,
    )
    point_labels = convert_point_label(point_labels, mapped_label_set)
    return (
        point_coords,
        point_labels,
        torch.tensor(mapped_label_set).to(point_coords.device).unsqueeze(-1),
    )


def generate_prompt_pairs_val(
    labels, label_set=None, max_ppoint=1, max_npoint=0, device="cpu", use_center=False
):
    """Sample points from labels. This function is only used for validation and did not map point label to 2, 3.
    For zero-shot point evaluation, this function will be called directly. Otherwise see sample_points_patch_val.
    Args:
        labels: [1, 1, H, W, D]
        label_set: local index, must match values in labels
    Returns:
        point: [B, N, 3]
        point_label: [B, N]
    """
    assert labels.shape[0] == 1, "only support batch size 1"
    labels = labels[0, 0]
    unique_labels = labels.unique().cpu().numpy().tolist()
    _point = []
    _point_label = []
    Nn = max_npoint
    Np = max_ppoint
    for id in label_set:
        if id in unique_labels:
            plabels = labels == int(id)
            nlabels = ~plabels
            _plabels = erode3d(plabels)
            _plabels = monai.transforms.utils.get_largest_connected_component_mask(
                _plabels
            )
            plabelpoints = torch.nonzero(_plabels).to(device)
            if len(plabelpoints) == 0:
                plabelpoints = torch.nonzero(plabels).to(device)
            nlabelpoints = torch.nonzero(nlabels).to(device)
            if use_center:
                pmean = plabelpoints.float().mean(0)
                pdis = ((plabelpoints - pmean) ** 2).sum(-1)
                _, sorted_indices = torch.sort(pdis)
                _point.append(
                    torch.stack(
                        [
                            plabelpoints[sorted_indices[i]]
                            for i in range(min(len(plabelpoints), Np))
                        ]
                        + random.choices(nlabelpoints, k=min(len(nlabelpoints), Nn))
                        + [torch.tensor([0, 0, 0], device=device)]
                        * (
                            Np
                            + Nn
                            - min(len(plabelpoints), Np)
                            - min(len(nlabelpoints), Nn)
                        )
                    )
                )
                _point_label.append(
                    torch.tensor(
                        [1] * min(len(plabelpoints), Np)
                        + [0.0] * min(len(nlabelpoints), Nn)
                        + [-1]
                        * (
                            Np
                            + Nn
                            - min(len(plabelpoints), Np)
                            - min(len(nlabelpoints), Nn)
                        )
                    ).to(device)
                )

            else:
                _point.append(
                    torch.stack(
                        random.choices(plabelpoints, k=min(len(plabelpoints), Np))
                        + random.choices(nlabelpoints, k=min(len(nlabelpoints), Nn))
                        + [torch.tensor([0, 0, 0], device=device)]
                        * (
                            Np
                            + Nn
                            - min(len(plabelpoints), Np)
                            - min(len(nlabelpoints), Nn)
                        )
                    )
                )
                _point_label.append(
                    torch.tensor(
                        [1] * min(len(plabelpoints), Np)
                        + [0.0] * min(len(nlabelpoints), Nn)
                        + [-1]
                        * (
                            Np
                            + Nn
                            - min(len(plabelpoints), Np)
                            - min(len(nlabelpoints), Nn)
                        )
                    ).to(device)
                )
        else:
            # pad the background labels
            _point.append(torch.zeros(Np + Nn, 3).to(device))  # all 0
            _point_label.append(torch.zeros(Np + Nn).to(device) - 1)  # -1 not a point
    point = torch.stack(_point)
    point_label = torch.stack(_point_label)
    return point, point_label


def generate_prompt_pairs(
    labels,
    label_set=None,
    max_prompt=None,
    max_foreprompt=None,
    max_backprompt=1,
    max_point=20,
    include_background=False,
    drop_label_prob=0.2,
    drop_point_prob=0.2,
    point_sampler=None,
):
    """This is the main function sampling training pairs for point branch. Only used in training.
    Args:
        labels: [1, 1, H, W, D]
        label_set: the label list for the specific dataset.
        max_prompt: int, max number of total prompt, including foreground and background.
        max_foreprompt: int, max number of prompt from foreground.
        max_backprompt: int, max number of prompt from background.
        max_point: maximum number of points for each object
        include_background: if include label=0 into training prompt. May casue issue in partial label
                            trainig.
        drop_label_prob: probablity to drop label prompt
        drop_point_prob: probablity to drop point prompt
        point_sampler: sampler to augment masks with supervoxel.
    Returns:
        label_prompt: [b, 1]
        point: [b, N, 3]
        point_label: [b, N]
        prompt_class: [b, 1], exactly the same with label_prompt for label indexing for training loss.

    """
    # class label number
    assert labels.shape[0] == 1, "only support batch size 1"
    labels = labels[0, 0]
    device = labels.device
    unique_labels = labels.unique().cpu().numpy().tolist()
    if include_background:
        unique_labels = list(set(unique_labels) - (set(unique_labels) - set(label_set)))
    else:
        unique_labels = list(
            set(unique_labels) - (set(unique_labels) - set(label_set)) - set([0])
        )
    background_labels = list(set(label_set) - set(unique_labels))
    # during training, balance background and foreground prompts
    if max_backprompt is not None:
        if len(background_labels) > max_backprompt:
            random.shuffle(background_labels)
            background_labels = background_labels[:max_backprompt]

    if max_foreprompt is not None:
        if len(unique_labels) > max_foreprompt:
            random.shuffle(unique_labels)
            unique_labels = unique_labels[:max_foreprompt]

    if max_prompt is not None:
        if len(unique_labels) + len(background_labels) > max_prompt:
            if len(unique_labels) > max_prompt:
                unique_labels = random.sample(unique_labels, max_prompt)
                background_labels = []
            else:
                background_labels = random.sample(
                    background_labels, max_prompt - len(unique_labels)
                )
    _point = []
    _point_label = []
    # if use regular sampling
    if point_sampler is None:
        Np = min(max_point, int(np.abs(random.gauss(mu=0, sigma=max_point // 2))) + 1)
        Nn = min(max_point, int(np.abs(random.gauss(mu=0, sigma=max_point // 2))))
        for id in unique_labels:
            neg_id, pos_id = get_point_label(id)
            plabels = labels == int(id)
            nlabels = ~plabels
            plabelpoints = torch.nonzero(plabels)
            nlabelpoints = torch.nonzero(nlabels)
            _point.append(
                torch.stack(
                    random.choices(plabelpoints, k=min(len(plabelpoints), Np))
                    + random.choices(nlabelpoints, k=min(len(nlabelpoints), Nn))
                    + [torch.tensor([0, 0, 0], device=device)]
                    * (
                        Np
                        + Nn
                        - min(len(plabelpoints), Np)
                        - min(len(nlabelpoints), Nn)
                    )
                )
            )
            _point_label.append(
                torch.tensor(
                    [pos_id] * min(len(plabelpoints), Np)
                    + [neg_id] * min(len(nlabelpoints), Nn)
                    + [-1]
                    * (
                        Np
                        + Nn
                        - min(len(plabelpoints), Np)
                        - min(len(nlabelpoints), Nn)
                    )
                ).to(device)
            )
        for id in background_labels:
            # pad the background labels
            _point.append(torch.zeros(Np + Nn, 3).to(device))  # all 0
            _point_label.append(torch.zeros(Np + Nn).to(device) - 1)  # -1 not a point
    else:
        Np = max_point
        Nn = 0
        _point, _point_label = point_sampler(unique_labels, Np=Np, Nn=Nn)
        for id in background_labels:
            # pad the background labels
            _point.append(torch.zeros(len(_point_label[0]), 3).to(device))  # all 0
            _point_label.append(
                torch.zeros(len(_point_label[0])).to(device) - 1
            )  # -1 not a point
    if len(unique_labels) == 0 and len(background_labels) == 0:
        # the iteration should be skipped
        label_prompt, point, point_label, prompt_class = None, None, None, None
    else:
        label_prompt = (
            torch.tensor(unique_labels + background_labels)
            .unsqueeze(-1)
            .to(device)
            .long()
        )
        point = torch.stack(_point)
        point_label = torch.stack(_point_label)
        prompt_class = copy.deepcopy(label_prompt)
    if random.uniform(0, 1) < drop_label_prob and len(unique_labels) > 0:
        label_prompt = None
        # If label prompt is dropped, there is no need to pad with points with label -1.
        pad = len(background_labels)
        point = point[: len(point) - pad]
        point_label = point_label[: len(point_label) - pad]
        prompt_class = prompt_class[: len(prompt_class) - pad]
    else:
        if random.uniform(0, 1) < drop_point_prob:
            point = None
            point_label = None
    return label_prompt, point, point_label, prompt_class


def get_next_points_val(
    pred,
    gt,
    prompt_class,
    point,
    point_label,
    pred_thresh=0.5,
    mapped=True,
    include_background=False,
    use_center=False,
    erosion2d=False,
    **kwargs
):
    """This function is used to sample points for iterative point evaluation. Each time only 1 point
    is sampled. background index will be ignored.
    mapped: If the input prompt_class are mapped to the global index, we will use special index. If not mapped (zero-shot),
    the special index will not be enabled.
    """
    new_points = []
    new_points_label = []
    for id in range(len(prompt_class)):
        if prompt_class[id] == 0 and not include_background:
            new_points.append(torch.tensor([0, 0, 0], device=pred.device))
            new_points_label.append(torch.tensor(-1, device=pred.device))
            continue
        neg_id, pos_id = get_point_label(-1)
        _gt = (gt == prompt_class[id])[0, 0]
        if mapped:
            # if in the global index, some supported classes need modification.
            neg_id, pos_id = get_point_label(prompt_class[id])
            if prompt_class[id].item() in MERGE_LIST.keys():
                for m in MERGE_LIST[prompt_class[id].item()]:
                    _gt = torch.logical_or(_gt, (gt == m)[0, 0])
        fn_mask = torch.logical_and(_gt, pred[id][0] < pred_thresh)
        if erosion2d:
            fn_mask = erode3d(fn_mask, erosion=(3, 3, 1))
        else:
            fn_mask = erode3d(fn_mask, erosion=(3, 3, 3))
        fn_mask = monai.transforms.utils.get_largest_connected_component_mask(fn_mask)
        fp_mask = torch.logical_and(torch.logical_not(_gt), pred[id][0] > pred_thresh)
        if erosion2d:
            fp_mask = erode3d(fp_mask, erosion=(3, 3, 1))
        else:
            fp_mask = erode3d(fp_mask, erosion=(3, 3, 3))
        fp_mask = monai.transforms.utils.get_largest_connected_component_mask(fp_mask)
        if fn_mask.sum() >= fp_mask.sum():
            plabelpoints = torch.nonzero(fn_mask)
            if len(plabelpoints) > 0:
                if use_center:
                    pdis = ((plabelpoints - plabelpoints.float().mean(0)) ** 2).sum(-1)
                    _, sorted_indices = torch.sort(pdis)
                    new_points.append(plabelpoints[sorted_indices[0]])
                    new_points_label.append(torch.tensor(pos_id, device=pred.device))
                else:
                    new_points.append(random.choices(plabelpoints, k=1)[0])
                    new_points_label.append(torch.tensor(pos_id, device=pred.device))
                print("sampled pos")
            else:
                new_points.append(torch.tensor([0, 0, 0], device=pred.device))
                new_points_label.append(torch.tensor(-1, device=pred.device))
        else:
            plabelpoints = torch.nonzero(fp_mask)
            if len(plabelpoints) > 0:
                if use_center:
                    pdis = ((plabelpoints - plabelpoints.float().mean(0)) ** 2).sum(-1)
                    _, sorted_indices = torch.sort(pdis)
                    new_points.append(plabelpoints[sorted_indices[0]])
                    new_points_label.append(torch.tensor(neg_id, device=pred.device))
                else:
                    new_points.append(random.choices(plabelpoints, k=1)[0])
                    new_points_label.append(torch.tensor(neg_id, device=pred.device))
                print("sampled neg")
            else:
                new_points.append(torch.tensor([0, 0, 0], device=pred.device))
                new_points_label.append(torch.tensor(-1, device=pred.device))
    new_points = torch.stack(new_points).unsqueeze(1)
    new_points_label = torch.stack(new_points_label).unsqueeze(1)
    point = torch.cat([point, new_points], dim=1)
    point_label = torch.cat([point_label, new_points_label], dim=1)
    return point, point_label


def get_next_points_auto_point(
    pred,
    gt,
    prompt_class,
    class_vector=None,
    pred_thresh=0.5,
    mapped=True,
    include_background=False,
    use_fg=False,
    **kwargs
):
    """sample points from foreground or error region. This function is only used during patch based auto + point evaluation. mapped is always true if
    evaluate dataset with automatic, which requires global index.
    """
    new_points = []
    new_points_label = []
    for id in range(len(prompt_class)):
        neg_id, pos_id = get_point_label(-1)
        _gt = (gt == prompt_class[id])[0, 0]
        if mapped:
            # if in the global index, some supported classes need modification. prompt_class is the local index
            if class_vector is not None:
                neg_id, pos_id = get_point_label(class_vector[id])
                if class_vector[id].item() in MERGE_LIST.keys():
                    for m in MERGE_LIST[class_vector[id].item()]:
                        _gt = torch.logical_or(_gt, (gt == m)[0, 0])
            else:
                neg_id, pos_id = get_point_label(prompt_class[id])
                if prompt_class[id].item() in MERGE_LIST.keys():
                    for m in MERGE_LIST[prompt_class[id].item()]:
                        _gt = torch.logical_or(_gt, (gt == m)[0, 0])
        if (prompt_class[id] == 0 and not include_background) or _gt.sum() == 0:
            # if background or no foreground and no false positive
            if _gt.sum() == 0 and (pred[id][0] > pred_thresh).sum() > 0:
                fp_mask = pred[id][0] > pred_thresh
                new_points.append(random.choices(torch.nonzero(fp_mask), k=1))
                new_points_label.append([torch.tensor(neg_id, device=pred.device)])
            else:
                new_points.append([torch.tensor([0, 0, 0], device=pred.device)])
                new_points_label.append([torch.tensor(-1, device=pred.device)])
            continue

            # DO NOT MERGE HERE. The merge classs evaluation will not perform merge.
        if use_fg:
            plabelpoints = torch.nonzero(_gt)
            new_points.append(random.choices(plabelpoints, k=1))
            new_points_label.append([torch.tensor(pos_id, device=pred.device)])
            continue
        _new_points, _new_points_label = [], []
        fn_mask = torch.logical_and(_gt, pred[id][0] < pred_thresh)
        fn_mask = erode3d(fn_mask)
        fn_mask = monai.transforms.utils.get_largest_connected_component_mask(fn_mask)
        fp_mask = torch.logical_and(torch.logical_not(_gt), pred[id][0] > pred_thresh)
        fp_mask = erode3d(fp_mask)
        fp_mask = monai.transforms.utils.get_largest_connected_component_mask(fp_mask)
        if fn_mask.sum() <= fp_mask.sum():
            # if false positive is larger than false negative, we will sample a negative point and one from foreground.
            # if all of them are 0, will sample a foreground
            plabelpoints = torch.nonzero(_gt)
            _new_points.extend(random.choices(plabelpoints, k=1))
            _new_points_label.extend([torch.tensor(pos_id, device=pred.device)])
            plabelpoints = torch.nonzero(fp_mask)
            if len(plabelpoints) > 0:
                _new_points.extend(random.choices(plabelpoints, k=1))
                _new_points_label.extend([torch.tensor(neg_id, device=pred.device)])
            else:
                _new_points.extend([torch.tensor([0, 0, 0], device=pred.device)])
                _new_points_label.extend([torch.tensor(-1, device=pred.device)])
        else:
            plabelpoints = torch.nonzero(fn_mask)
            if len(plabelpoints) > 0:
                _new_points.extend(random.choices(plabelpoints, k=1))
                _new_points_label.extend([torch.tensor(pos_id, device=pred.device)])
            else:
                _new_points.extend([torch.tensor([0, 0, 0], device=pred.device)])
                _new_points_label.extend([torch.tensor(-1, device=pred.device)])
        new_points.append(_new_points)
        new_points_label.append(_new_points_label)

    max_len = max([len(_) for _ in new_points])
    x = []
    for _ in new_points:
        x.append(_ + [torch.tensor([0, 0, 0]).to(pred.device)] * (max_len - len(_)))
    new_points = torch.stack([torch.stack(_) for _ in x])
    # new_points = torch.stack([torch.stack(_) for _ in [x + [torch.tensor([0,0,0]).to(pred.device)] * (max_len - len(x)) for x in new_points]])
    x = []
    for _ in new_points_label:
        x.append(_ + [torch.tensor(-1).to(pred.device)] * (max_len - len(_)))
    new_points_label = torch.vstack([torch.stack(_) for _ in x])

    return new_points, new_points_label


def get_next_points(
    pred,
    gt,
    prompt_class,
    point,
    point_label,
    pred_thresh=0.5,
    mapped=True,
    include_background=False,
    **kwargs
):
    """Iterative training. Sample points from false positve or false negative. This is used in training.
    pred [bs, 1, h, w, d]
    gt [1,1,h,w,d]
    point [bs, n, 3]
    Args:
    mapped: If the input prompt_class are mapped to the global index, we will use special index. If not mapped (zero-shot),
    the special index will not be enabled.
    """
    new_points = []
    new_points_label = []
    offset = 10
    window = torch.ones_like(pred[0, 0], dtype=torch.bool)
    window[offset:-offset, offset:-offset, :] = False
    for id in range(len(prompt_class)):
        if prompt_class[id] == 0 and not include_background:
            new_points.append(torch.tensor([0, 0, 0], device=pred.device))
            new_points_label.append(torch.tensor(-1, device=pred.device))
            continue
        neg_id, pos_id = get_point_label(-1)
        _gt = (gt == prompt_class[id])[0, 0]
        if mapped:
            # if in the global index, some supported classes need modification.
            neg_id, pos_id = get_point_label(prompt_class[id])
            if prompt_class[id].item() in MERGE_LIST.keys():
                for m in MERGE_LIST[prompt_class[id].item()]:
                    _gt = torch.logical_or(_gt, (gt == m)[0, 0])
        fn_mask = torch.logical_and(_gt, pred[id][0] < pred_thresh)
        fn_mask = erode3d(fn_mask)
        fn_mask[window] = 0
        fp_mask = torch.logical_and(torch.logical_not(_gt), pred[id][0] > pred_thresh)
        fp_mask = erode3d(fp_mask)
        fp_mask[window] = 0
        # random select a false negative
        fnlabelpoints = torch.nonzero(fn_mask)
        fplabelpoints = torch.nonzero(fp_mask)
        _new_points = []
        _new_points_label = []
        if len(fnlabelpoints) > 0:
            _new_points.append(random.choices(fnlabelpoints, k=1)[0])
            _new_points_label.append(torch.tensor(pos_id, device=pred.device))
        else:
            _new_points.append(torch.tensor([0, 0, 0], device=pred.device))
            _new_points_label.append(torch.tensor(-1, device=pred.device))
        if len(fplabelpoints) > 0:
            _new_points.append(random.choices(fplabelpoints, k=1)[0])
            _new_points_label.append(torch.tensor(neg_id, device=pred.device))
        else:
            _new_points.append(torch.tensor([0, 0, 0], device=pred.device))
            _new_points_label.append(torch.tensor(-1, device=pred.device))
        new_points.append(torch.stack(_new_points))
        new_points_label.append(torch.stack(_new_points_label))
    if len(new_points) > 0:
        new_points = torch.stack(new_points)
        new_points_label = torch.stack(new_points_label)
        if point is not None:
            point = torch.cat([point, new_points], dim=1)
            point_label = torch.cat([point_label, new_points_label], dim=1)
        else:
            point = new_points
            point_label = new_points_label

    return point, point_label
