import copy
import random

import monai
import numpy as np
import torch
from skimage import measure

from .trans_utils import dilate3d, erode3d
from .workflow_utils import ENABLE_SPECIAL, SPECIAL_INDEX, get_point_label


def open_lcc(plabels):
    plabels_org = plabels.clone()
    plabels = erode3d(plabels, erosion=3)
    plabels = monai.transforms.utils.get_largest_connected_component_mask(plabels)
    return dilate3d(plabels, erosion=3).to(torch.bool) * plabels_org


def find_lcc_label(plabels, region):
    plabels_org = plabels.clone()
    plabels = erode3d(plabels, erosion=3)
    label = measure.label
    features, num_features = label(
        plabels.cpu().numpy(), connectivity=3, return_num=True
    )
    features = torch.from_numpy(features).to(region.device)
    max_cc = torch.zeros_like(region)
    max_cc_count = 0
    region = dilate3d(region, erosion=5).to(torch.bool)
    for i in range(1, num_features):
        cc = features == i
        if torch.logical_and(cc, region).any():
            cc_sum = cc.sum()
            if cc_sum > max_cc_count:
                max_cc = cc
                max_cc_count = cc_sum
    return dilate3d(max_cc, erosion=5).to(torch.bool) * plabels_org


class Point_sampler:
    """Point sampler will take original manual label and supervoxel to perform augmentation.
    Args:
        label: manual label
        label_sv: supervoxel
        map_shift: this value must be larger than the last_supported value in vista3d.point_head. When a
                   mask is given a shift of id + map_shift, it will be identified as zero-shot.
        offset: remove patch boundary samples
        vrange: the probability range for different augmentations.
    """

    def __init__(
        self,
        label,
        label_sv,
        map_shift=512,
        offset=10,
        vrange=[0.6, 0.7, 0.8, 0.9],
    ):
        self.label = label
        self.label_sv = label_sv
        self.map_shift = map_shift
        self.shifted = {}
        self.device = self.label.device
        self.label_ = label.clone()
        self.window = torch.ones_like(label, dtype=torch.bool)
        self.window[offset:-offset, offset:-offset, offset:-offset] = False
        self.vrange = vrange
        self.zshot_rate = 0.5

    def reset(self):
        self.label = self.label_.clone()

    def skip_aug(self, id):
        if id in SPECIAL_INDEX and ENABLE_SPECIAL:
            return True
        return False

    def __call__(self, unique_labels, Np=1, Nn=0):
        _point = []
        _point_label = []
        vrange = self.vrange
        self.read_only_id = copy.deepcopy(unique_labels)
        for id in unique_labels:
            if self.skip_aug(id):
                v = 0
                print(f"{id} will use regular")
            else:
                v = np.random.rand()
            if v < vrange[0] or self.label_sv is None:
                _p, _pl = self.regular(id, Np, Nn)
            if v >= vrange[0] and v < vrange[1]:
                _p, _pl = self.organ_sub(id, Np, Nn)
            if v >= vrange[1] and v < vrange[2]:
                _p, _pl = self.organ_add(id, Np, Nn)
            if v >= vrange[2] and v < vrange[3]:
                _p, _pl = self.zeroshot_unseen(id, Np, Nn)
            if v >= vrange[3]:
                _p, _pl = self.zeroshot_random(id, Np, Nn)
            _point.append(_p)
            _point_label.append(_pl)
        return self._padding(_point, _point_label)

    def _padding(self, point, point_label):
        if len(point) > 0:
            max_len = max([len(_) for _ in point])
            point = [
                torch.stack(
                    _ + [torch.tensor([0, 0, 0]).to(self.device)] * (max_len - len(_))
                )
                for _ in point
            ]
            point_label = [
                torch.tensor(_ + [-1] * (max_len - len(_))).to(self.device)
                for _ in point_label
            ]
            # print(point, point_label)
        return point, point_label

    def regular(self, id, Np=1, Nn=0):
        print("regular")
        plabels = self.label == int(id)
        _plabels = erode3d(plabels)
        _plabels[self.window] = 0
        plabelpoints = torch.nonzero(_plabels)
        kp = min(len(plabelpoints), Np)
        if kp == 0:
            plabelpoints = torch.nonzero(plabels)
            kp = min(len(plabelpoints), Np)
        _point = random.choices(plabelpoints, k=kp)
        neg_id, pos_id = get_point_label(id)
        _point_label = [pos_id] * kp
        if Nn > 0:
            nlabels = ~plabels
            nlabels = erode3d(nlabels)
            nlabelpoints = torch.nonzero(nlabels)
            kn = min(len(nlabelpoints), Nn)
            if kn > 0:
                _point += random.choices(nlabelpoints, k=kn)
                _point_label += [neg_id] * kn
        return _point, _point_label

    def zeroshot_random(self, id, Np=1, Nn=0):
        min_size = 20 * 20 * 20
        region = self.label == 0
        sregion = self.label_sv[region]
        sid = torch.unique(sregion).cpu().numpy()
        random.shuffle(sid)
        for sid_p in sid:
            plabels = self.label_sv == sid_p
            plabels = open_lcc(plabels)
            ids = self.label[plabels].unique().cpu().numpy()
            if np.array([i in ids for i in self.read_only_id]).any():
                continue
            if plabels.sum() < min_size:
                continue
            _point = []
            _point_label = []
            random.shuffle(ids)
            count = 0
            max_merge = len(ids)
            for i in ids:
                if i == 0:
                    continue
                if count >= max_merge:
                    break
                fg = self.label == i
                overlap = torch.logical_and(plabels, fg)
                if 0.1 * fg.sum() < overlap.sum():
                    plabels = torch.logical_or(plabels, fg)
                    _plabels = erode3d(overlap)
                    _plabels[self.window] = 0
                    plabelpoints = torch.nonzero(_plabels)
                    kp = min(len(plabelpoints), 1)
                    if kp == 0:
                        continue
                    _point += random.choices(plabelpoints, k=kp)
                    _point_label += [1] * kp
                    count += 1
            _plabels = torch.logical_and(plabels, region)
            _plabels = erode3d(_plabels)
            _plabels[self.window] = 0
            plabelpoints = torch.nonzero(_plabels)
            kp = min(len(plabelpoints), Np)
            if kp == 0:
                continue
            _point += random.choices(plabelpoints, k=kp)
            _point_label += [1] * kp
            self.label[plabels.to(torch.bool)] = id + self.map_shift
            self.shifted[id] = id + self.map_shift
            self.read_only_id.append(id + self.map_shift)
            print("zeroshot_random")
            return _point, _point_label
        return self.regular(id, Np, Nn)

    def zeroshot_unseen(self, id, Np=1, Nn=0):
        # PASSED
        min_size = 20 * 20 * 20
        region = self.label == 0
        sregion = self.label_sv[region]
        sid = torch.unique(sregion).cpu().numpy()
        random.shuffle(sid)
        npoint = None
        for sid_p in sid:
            plabels = torch.logical_and(self.label_sv == sid_p, region)
            plabels = open_lcc(plabels)
            if plabels.sum() < min_size:
                continue
            ids = self.label[plabels].unique().cpu().numpy().tolist()
            if np.array([i in ids for i in self.read_only_id]).any():
                continue
            _plabels = erode3d(plabels)
            _plabels[self.window] = 0
            plabelpoints = torch.nonzero(_plabels)
            kp = min(len(plabelpoints), Np)
            if kp == 0:
                continue
            _point = random.choices(plabelpoints, k=kp)
            _point_label = [1] * kp
            if Nn > 0:
                nlabels = torch.logical_and(~plabels, region)
                nlabels = erode3d(nlabels)
                nlabelpoints = torch.nonzero(nlabels)
                kn = min(len(nlabelpoints), Nn)
                if kn > 0:
                    _point += random.choices(nlabelpoints, k=kn)
                    _point_label += [0] * kn
            if npoint is not None:
                _point += npoint
                _point_label += [0]
            self.label[plabels.to(torch.bool)] = id + self.map_shift
            self.shifted[id] = id + self.map_shift
            self.read_only_id.append(id + self.map_shift)
            print("zeroshot_unseen")
            return _point, _point_label
        return self.regular(id, Np, Nn)

    def remove_outside(self, plabels, region):
        """Remove the points that does not lay within region slices (3 views). Avoid sample far away points"""
        ps = torch.stack(torch.nonzero(region, as_tuple=True)).transpose(1, 0)
        index = torch.ones_like(plabels).to(torch.bool)
        index[
            ps[:, 0].min() : ps[:, 0].max(),
            ps[:, 1].min() : ps[:, 1].max(),
            ps[:, 2].min() : ps[:, 2].max(),
        ] = False
        plabels[index] = 0
        return plabels

    def organ_add(self, id, Np=1, Nn=0):
        """For class id, find a supvervoxel index sid that mostly inside id."""
        lower_size = 0.1  # times
        region = self.label == id
        region_size = region.sum()
        all_region = self.label == 0
        sid = torch.unique(self.label_sv[region]).cpu().numpy()
        random.shuffle(sid)
        for sid_p in sid:
            plabels = torch.logical_and(self.label_sv == int(sid_p), all_region)
            if not plabels.any():
                continue
            plabels = find_lcc_label(plabels, region)
            ids = self.label[plabels].unique().cpu().numpy().tolist()
            if np.array([i in ids for i in self.read_only_id]).any():
                continue
            psize = plabels.sum()
            if psize < lower_size * region_size:
                continue
            _plabels = erode3d(plabels)
            _plabels[self.window] = 0
            _plabels = self.remove_outside(_plabels, region)
            # only pick points at the slice with the organ
            plabelpoints = torch.nonzero(_plabels)
            kp = min(len(plabelpoints), Np)
            if kp == 0:
                continue
            _point = random.choices(plabelpoints, k=kp)
            plabels_ = erode3d(region)
            plabels_[self.window] = 0
            plabelpoints = torch.nonzero(plabels_)
            kp2 = min(len(plabelpoints), Np)
            if kp2 == 0:
                plabelpoints = torch.nonzero(region)
            kp2 = min(len(plabelpoints), Np)
            _point += random.choices(plabelpoints, k=kp2)
            self.label[plabels] = id
            _point_label = [1] * (kp + kp2)
            if np.random.rand() < self.zshot_rate:
                self.label[self.label == id] = id + self.map_shift
                self.shifted[id] = id + self.map_shift
                self.read_only_id.append(id + self.map_shift)
            print("organ add")
            return _point, _point_label
        return self.regular(id, Np, Nn)

    def organ_sub(self, id, Np=1, Nn=0):
        """Substract a sid that is not too big or too small. 10%-50% of the id area size. At least 1 pos in remaining region in id and 1 neg
        in subtracted region.
        """
        upper_size = 0.9  # times
        lower_size = 0.1  # times
        region = self.label == id
        region_size = region.sum()
        sregion = self.label_sv[region]
        sid = torch.unique(sregion).cpu().numpy()
        random.shuffle(sid)
        use_zs = np.random.rand() < 0.5
        for sid_p in sid:
            # must contain 2 points within id and 1 point within sid_p
            if use_zs:
                plabels = torch.logical_and(self.label_sv == int(sid_p), region)
                plabels = open_lcc(plabels)
                psize = plabels.sum()
                if psize < lower_size * region_size or psize > upper_size * region_size:
                    continue
                nlabels = torch.logical_and(~plabels, region)
            else:
                nlabels = torch.logical_and(self.label_sv == int(sid_p), region)
                nlabels = open_lcc(nlabels)
                nsize = nlabels.sum()
                if nsize < lower_size * region_size or nsize > upper_size * region_size:
                    continue
                plabels = torch.logical_and(~nlabels, region)

            _plabels = erode3d(plabels)
            _plabels[self.window] = 0
            plabelpoints = torch.nonzero(_plabels)
            _nlabels = erode3d(nlabels)
            _nlabels[self.window] = 0
            nlabelpoints = torch.nonzero(_nlabels)
            kp = min(len(plabelpoints), Np)
            kn = min(len(nlabelpoints), max(1, Nn))
            if kp == 0 or kn == 0:
                continue
            _point = random.choices(plabelpoints, k=kp) + random.choices(
                nlabelpoints, k=kn
            )
            _point_label = [1] * kp + [0] * kn
            if use_zs or np.random.rand() < self.zshot_rate:
                self.label[plabels.to(torch.bool)] = id + self.map_shift
                self.shifted[id] = id + self.map_shift
                self.read_only_id.append(id + self.map_shift)
            else:
                self.label[nlabels.to(torch.bool)] = 0
            print("organ_sub")
            return _point, _point_label
        _point, _point_label = self.regular(id, Np, Nn)
        return _point, _point_label
