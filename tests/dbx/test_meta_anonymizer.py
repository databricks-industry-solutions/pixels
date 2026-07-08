import sys
import types

import pytest
from pydicom.dataset import Dataset, FileDataset
from pydicom.tag import Tag

from dbx.pixels.dicom.dicom_utils import anonymize_metadata, fp_tweak_from_path

UID_ALPHABET = "0123456789"
TEXT_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,^_-"


def _decrypt_uid(fp_key: str, tweak: str, uid_value: str) -> str:
    from fastfpe import ff1

    return ".".join(
        [
            ff1.decrypt(fp_key, tweak, UID_ALPHABET, part) if len(part) > 5 else part
            for part in uid_value.split(".")
        ]
    )


def _decrypt_text(fp_key: str, tweak: str, value: str) -> str:
    from fastfpe import ff1

    if len(value) <= 5:
        return value
    return ff1.decrypt(fp_key, tweak, TEXT_ALPHABET, value)


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

    def fake_encrypt(key, tweak, alphabet, value):
        return f"ENC[{value}]"

    class FakeAnonymizer:
        def anonymize(self, ds):
            anonymize_called["value"] = True
            # Simulate generic de-identification pass changing fields.
            ds.PatientName = "MASKED^NAME"
            ds.StudyDate = "19000101"

    ff1_module = types.ModuleType("fastfpe.ff1")
    ff1_module.encrypt = fake_encrypt

    fastfpe_module = types.ModuleType("fastfpe")
    fastfpe_module.ff1 = ff1_module

    dicognito_module = types.ModuleType("dicognito")
    dicognito_anonymizer_module = types.ModuleType("dicognito.anonymizer")
    dicognito_anonymizer_module.Anonymizer = FakeAnonymizer
    dicognito_module.anonymizer = dicognito_anonymizer_module

    monkeypatch.setitem(sys.modules, "fastfpe", fastfpe_module)
    monkeypatch.setitem(sys.modules, "fastfpe.ff1", ff1_module)
    monkeypatch.setitem(sys.modules, "dicognito", dicognito_module)
    monkeypatch.setitem(sys.modules, "dicognito.anonymizer", dicognito_anonymizer_module)
    return anonymize_called


def test_anonymize_metadata_encrypts_and_keeps_expected_tags(monkeypatch):
    anonymize_called = _mock_crypto_and_dicognito(monkeypatch)
    ds = _build_dataset()
    file_path = "/Volumes/catalog/schema/vol/study/series/file.dcm"

    original_study_date = ds.StudyDate

    anonymize_metadata(
        ds=ds,
        fp_key="00112233445566778899aabbccddeeff",
        keep_tags=("StudyDate", "StudyTime", "SeriesDate"),
        encrypt_tags=(
            "StudyInstanceUID",
            "SeriesInstanceUID",
            "SOPInstanceUID",
            "AccessionNumber",
            "PatientID",
        ),
        file_path=file_path,
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
            keep_tags=("StudyDate",),
            encrypt_tags=("AccessionNumber",),
            file_path="/Volumes/catalog/schema/vol/study/series/file.dcm",
        )


def test_anonymize_metadata_with_real_dicognito_and_ff1():
    pytest.importorskip("dicognito.anonymizer")
    pytest.importorskip("fastfpe")

    from fastfpe import ff1

    ds = _build_dataset()
    file_path = "/Volumes/catalog/schema/vol/study/series/file.dcm"
    original_study_instance_uid = str(ds.StudyInstanceUID)
    original_patient_id = str(ds.PatientID)
    original_study_date = str(ds.StudyDate)

    key = "00112233445566778899aabbccddeeff"
    tweak = fp_tweak_from_path(file_path)
    uid_alphabet = "0123456789"
    text_alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,^_-"

    expected_uid = ".".join(
        [
            ff1.encrypt(key, tweak, uid_alphabet, part) if len(part) > 5 else part
            for part in original_study_instance_uid.split(".")
        ]
    )
    expected_patient_id = ff1.encrypt(key, tweak, text_alphabet, original_patient_id)

    anonymize_metadata(
        ds=ds,
        fp_key=key,
        keep_tags=("StudyDate",),
        encrypt_tags=("StudyInstanceUID", "PatientID"),
        file_path=file_path,
    )

    assert ds.StudyInstanceUID == expected_uid
    assert ds.PatientID == expected_patient_id
    assert ds.StudyDate == original_study_date
    assert _decrypt_uid(key, tweak, ds.StudyInstanceUID) == original_study_instance_uid
    assert _decrypt_text(key, tweak, ds.PatientID) == original_patient_id


def test_anonymize_metadata_uses_explicit_fp_tweak():
    pytest.importorskip("fastfpe")

    from fastfpe import ff1

    ds = _build_dataset()
    file_path = "/Volumes/catalog/schema/vol/study/series/file.dcm"
    key = "00112233445566778899aabbccddeeff"
    tweak = "a1b2c3d4e5f60708"
    uid_alphabet = "0123456789"
    original_study_instance_uid = str(ds.StudyInstanceUID)

    expected_uid = ".".join(
        [
            ff1.encrypt(key, tweak, uid_alphabet, part) if len(part) > 5 else part
            for part in str(ds.StudyInstanceUID).split(".")
        ]
    )

    anonymize_metadata(
        ds=ds,
        fp_key=key,
        keep_tags=(),
        encrypt_tags=("StudyInstanceUID",),
        file_path=file_path,
        fp_tweak=tweak,
    )

    assert ds.StudyInstanceUID == expected_uid
    assert ds.StudyInstanceUID != ".".join(
        [
            (
                ff1.encrypt(key, fp_tweak_from_path(file_path), uid_alphabet, part)
                if len(part) > 5
                else part
            )
            for part in "1.2.840.123456.9".split(".")
        ]
    )
    assert _decrypt_uid(key, tweak, ds.StudyInstanceUID) == original_study_instance_uid


def test_anonymize_metadata_ff1_roundtrip_decrypt():
    pytest.importorskip("dicognito.anonymizer")
    pytest.importorskip("fastfpe")

    ds = _build_dataset()
    file_path = "/Volumes/catalog/schema/vol/study/series/file.dcm"
    key = "00112233445566778899aabbccddeeff"
    tweak = fp_tweak_from_path(file_path)

    originals = {
        "StudyInstanceUID": str(ds.StudyInstanceUID),
        "SeriesInstanceUID": str(ds.SeriesInstanceUID),
        "SOPInstanceUID": str(ds.SOPInstanceUID),
        "PatientID": str(ds.PatientID),
        "AccessionNumber": str(ds.AccessionNumber),
    }

    anonymize_metadata(
        ds=ds,
        fp_key=key,
        keep_tags=("StudyDate",),
        encrypt_tags=(
            "StudyInstanceUID",
            "SeriesInstanceUID",
            "SOPInstanceUID",
            "PatientID",
            "AccessionNumber",
        ),
        file_path=file_path,
    )

    assert ds.StudyInstanceUID != originals["StudyInstanceUID"]
    assert ds.PatientID != originals["PatientID"]
    assert ds.AccessionNumber == ""  # too short to encrypt; irreversibly blanked

    assert _decrypt_uid(key, tweak, ds.StudyInstanceUID) == originals["StudyInstanceUID"]
    assert _decrypt_uid(key, tweak, ds.SeriesInstanceUID) == originals["SeriesInstanceUID"]
    assert _decrypt_uid(key, tweak, ds.SOPInstanceUID) == originals["SOPInstanceUID"]
    assert _decrypt_text(key, tweak, ds.PatientID) == originals["PatientID"]


def test_anonymize_metadata_ff1_roundtrip_decrypt_with_explicit_tweak():
    pytest.importorskip("fastfpe")

    ds = _build_dataset()
    file_path = "/Volumes/catalog/schema/vol/study/series/other.dcm"
    key = "00112233445566778899aabbccddeeff"
    tweak = "a1b2c3d4e5f60708"
    original_patient_id = str(ds.PatientID)

    anonymize_metadata(
        ds=ds,
        fp_key=key,
        keep_tags=(),
        encrypt_tags=("PatientID",),
        file_path=file_path,
        fp_tweak=tweak,
    )

    assert _decrypt_text(key, tweak, ds.PatientID) == original_patient_id
    assert _decrypt_text(key, fp_tweak_from_path(file_path), ds.PatientID) != original_patient_id
