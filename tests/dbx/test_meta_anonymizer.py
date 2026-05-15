import sys
import types

import pytest
from pydicom.dataset import Dataset, FileDataset
from pydicom.tag import Tag

from dbx.pixels.dicom.dicom_utils import anonymize_metadata


def _build_dataset() -> FileDataset:
    ds = FileDataset("unit-test", {}, file_meta=Dataset(), preamble=b"\0" * 128)
    ds.add_new(Tag(0x0010, 0x0010), "PN", "John^Doe")
    ds.add_new(Tag(0x0010, 0x0020), "LO", "PATIENT123")
    ds.add_new(Tag(0x0008, 0x0050), "SH", "1234")
    ds.add_new(Tag(0x0020, 0x000D), "UI", "1.2.840.123456.9")
    ds.add_new(Tag(0x0020, 0x000E), "UI", "1.2.840.654321.9")
    ds.add_new(Tag(0x0008, 0x0018), "UI", "1.2.840.777777.9")
    ds.add_new(Tag(0x0008, 0x0020), "DA", "20260303")
    return ds


def _mock_crypto_and_dicognito(monkeypatch):
    anonymize_called = {"value": False}

    class FakeFF3Cipher:
        def __init__(self, key, tweak):
            self.key = key
            self.tweak = tweak
            self.alphabet = ""

        def encrypt(self, value):
            return f"ENC[{value}]"

    class FakeAnonymizer:
        def anonymize(self, ds):
            anonymize_called["value"] = True
            # Simulate generic de-identification pass changing fields.
            ds.PatientName = "MASKED^NAME"
            ds.StudyDate = "19000101"

    ff3_module = types.ModuleType("ff3")
    ff3_module.FF3Cipher = FakeFF3Cipher

    dicognito_module = types.ModuleType("dicognito")
    dicognito_anonymizer_module = types.ModuleType("dicognito.anonymizer")
    dicognito_anonymizer_module.Anonymizer = FakeAnonymizer
    dicognito_module.anonymizer = dicognito_anonymizer_module

    monkeypatch.setitem(sys.modules, "ff3", ff3_module)
    monkeypatch.setitem(sys.modules, "dicognito", dicognito_module)
    monkeypatch.setitem(sys.modules, "dicognito.anonymizer", dicognito_anonymizer_module)
    return anonymize_called


def test_anonymize_metadata_encrypts_and_keeps_expected_tags(monkeypatch):
    anonymize_called = _mock_crypto_and_dicognito(monkeypatch)
    ds = _build_dataset()

    original_study_date = ds.StudyDate

    anonymize_metadata(
        ds=ds,
        fp_key="00112233445566778899aabbccddeeff",
        fp_tweak="a1b2c3d4e5f60708",
        keep_tags=("StudyDate", "StudyTime", "SeriesDate"),
        encrypt_tags=(
            "StudyInstanceUID",
            "SeriesInstanceUID",
            "SOPInstanceUID",
            "AccessionNumber",
            "PatientID",
        ),
    )

    assert anonymize_called["value"] is True
    assert ds.PatientID.startswith("ENC[")
    assert ds.AccessionNumber == ""  # non-UID shorter than 6 chars -> blank
    assert "ENC[" in ds.StudyInstanceUID and "." in ds.StudyInstanceUID
    assert ds.StudyDate == original_study_date  # restored from keep_tags
    assert ds.PatientName == "MASKED^NAME"


def test_anonymize_metadata_raises_when_encrypt_tag_missing(monkeypatch):
    _mock_crypto_and_dicognito(monkeypatch)
    ds = _build_dataset()
    del ds[Tag(0x0008, 0x0050)]  # AccessionNumber

    with pytest.raises(KeyError):
        anonymize_metadata(
            ds=ds,
            fp_key="00112233445566778899aabbccddeeff",
            fp_tweak="a1b2c3d4e5f60708",
            keep_tags=("StudyDate",),
            encrypt_tags=("AccessionNumber",),
        )


def test_anonymize_metadata_with_real_dicognito_and_ff3():
    pytest.importorskip("dicognito.anonymizer")
    ff3 = pytest.importorskip("ff3")

    ds = _build_dataset()
    original_study_instance_uid = str(ds.StudyInstanceUID)
    original_patient_id = str(ds.PatientID)
    original_study_date = str(ds.StudyDate)

    key = "00112233445566778899aabbccddeeff"
    tweak = "a1b2c3d4e5f60708"
    cipher = ff3.FF3Cipher(key, tweak)

    cipher.alphabet = "0123456789"
    expected_uid = ".".join(
        [
            cipher.encrypt(part) if len(part) > 5 else part
            for part in original_study_instance_uid.split(".")
        ]
    )
    cipher.alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,^_-"
    expected_patient_id = cipher.encrypt(original_patient_id)

    anonymize_metadata(
        ds=ds,
        fp_key=key,
        fp_tweak=tweak,
        keep_tags=("StudyDate",),
        encrypt_tags=("StudyInstanceUID", "PatientID"),
    )

    assert ds.StudyInstanceUID == expected_uid
    assert ds.PatientID == expected_patient_id
    assert ds.StudyDate == original_study_date
