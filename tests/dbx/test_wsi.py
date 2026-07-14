"""Tests for dbx.pixels.wsi — Unified WSI handler.

Runs against real SVS and TIFF files in UC Volumes:
- SVS: /Volumes/hls_radiology_east/orthanc_demo/raw_images/Aperio/
- TIFF: /Volumes/hls_radiology_east/orthanc_demo/raw_images/Generic-TIFF/
        /Volumes/hls_radiology_east/orthanc_demo/raw_images/Philips-TIFF/
        /Volumes/hls_radiology_east/osuwmc/sample/

Requires: openslide-python, openslide-bin, tifffile

Usage (from project root):
    %pip install openslide-python openslide-bin tifffile imagecodecs -q
    pytest tests/dbx/test_wsi.py -v
"""

import json
import os
import sys
from pathlib import Path

import pytest

# Ensure src is on path
SRC_PATH = str(Path(__file__).resolve().parents[2] / "src")
if SRC_PATH not in sys.path:
    sys.path.insert(0, SRC_PATH)


# ---------------------------------------------------------------------------
# Test fixtures: real file paths from UC Volumes
# ---------------------------------------------------------------------------

SVS_DIR = "/Volumes/hls_radiology_east/orthanc_demo/raw_images/Aperio"
TIFF_DIRS = [
    "/Volumes/hls_radiology_east/orthanc_demo/raw_images/Generic-TIFF",
    "/Volumes/hls_radiology_east/orthanc_demo/raw_images/Philips-TIFF",
    "/Volumes/hls_radiology_east/osuwmc/sample",
]


def _discover_files(directory: str, extensions: tuple) -> list[str]:
    """Discover test files by extension."""
    if not os.path.isdir(directory):
        return []
    return sorted(
        os.path.join(directory, f)
        for f in os.listdir(directory)
        if f.lower().endswith(extensions) and not f.startswith(".")
    )


@pytest.fixture(scope="module")
def svs_files():
    """All SVS test files."""
    files = _discover_files(SVS_DIR, (".svs",))
    if not files:
        pytest.skip(f"No SVS files found in {SVS_DIR}")
    return files


@pytest.fixture(scope="module")
def tiff_files():
    """All TIFF test files."""
    files = []
    for d in TIFF_DIRS:
        files.extend(_discover_files(d, (".tiff", ".tif")))
    if not files:
        pytest.skip(f"No TIFF files found in {TIFF_DIRS}")
    return files


@pytest.fixture(scope="module")
def all_wsi_files(svs_files, tiff_files):
    """All WSI files (SVS + TIFF)."""
    return svs_files + tiff_files


# ---------------------------------------------------------------------------
# Test: phi_tags module
# ---------------------------------------------------------------------------


class TestPhiTags:
    """Tests for wsi_phi_tags.py"""

    def test_classify_phi_tag(self):
        from dbx.pixels.wsi.wsi_phi_tags import classify_tag

        assert classify_tag("aperio.Patient") == "PHI"
        assert classify_tag("Patient") == "PHI"
        assert classify_tag("Artist") == "PHI"
        assert classify_tag("HostComputer") == "PHI"

    def test_classify_questionable_tag(self):
        from dbx.pixels.wsi.wsi_phi_tags import classify_tag

        assert classify_tag("aperio.Date") == "QUESTIONABLE"
        assert classify_tag("DateTime") == "QUESTIONABLE"
        assert classify_tag("ImageDescription") == "QUESTIONABLE"
        assert classify_tag("ventana.ScanDate") == "QUESTIONABLE"

    def test_classify_not_phi_tag(self):
        from dbx.pixels.wsi.wsi_phi_tags import classify_tag

        assert classify_tag("openslide.mpp-x") == "NOT_PHI"
        assert classify_tag("ImageWidth") == "NOT_PHI"
        assert classify_tag("SomeUnknownTag") == "NOT_PHI"

    def test_classify_tags_returns_only_phi_and_questionable(self):
        from dbx.pixels.wsi.wsi_phi_tags import classify_tags

        props = {
            "aperio.Patient": "John Doe",
            "aperio.AppMag": "40",
            "openslide.mpp-x": "0.2525",
            "DateTime": "2024-01-01",
        }
        report = classify_tags(props)
        tags_in_report = {r["tag"] for r in report}
        assert "aperio.Patient" in tags_in_report
        assert "DateTime" in tags_in_report
        assert "aperio.AppMag" not in tags_in_report
        assert "openslide.mpp-x" not in tags_in_report

    def test_scrub_image_description_aperio_format(self):
        from dbx.pixels.wsi.wsi_phi_tags import scrub_image_description

        desc = "Aperio Image Library v12.0.15|Patient = John Doe|AppMag = 40|Date = 2024-01-01"
        scrubbed = scrub_image_description(desc)
        assert "John Doe" not in scrubbed
        assert "REDACTED" in scrubbed
        assert "AppMag = 40" in scrubbed  # NOT_PHI preserved

    def test_supported_extensions(self):
        from dbx.pixels.wsi.wsi_phi_tags import SUPPORTED_EXTENSIONS

        assert ".svs" in SUPPORTED_EXTENSIONS
        assert ".tiff" in SUPPORTED_EXTENSIONS
        assert ".bif" in SUPPORTED_EXTENSIONS
        assert ".ndpi" in SUPPORTED_EXTENSIONS
        assert ".mrxs" in SUPPORTED_EXTENSIONS

    def test_openslide_patterns(self):
        from dbx.pixels.wsi.wsi_phi_tags import OPENSLIDE_PATTERNS

        assert "*.svs" in OPENSLIDE_PATTERNS
        assert "*.tiff" in OPENSLIDE_PATTERNS


# ---------------------------------------------------------------------------
# Test: wsi_utils module
# ---------------------------------------------------------------------------


class TestWSIUtils:
    """Tests for wsi_utils.py — requires real files."""

    def test_detect_format_svs(self, svs_files):
        from dbx.pixels.wsi.wsi_utils import wsi_detect_format

        # All SVS files should be detected as 'aperio'
        for f in svs_files:
            fmt = wsi_detect_format(f)
            assert fmt == "aperio", f"Expected 'aperio' for {f}, got {fmt}"

    def test_detect_format_tiff(self, tiff_files):
        from dbx.pixels.wsi.wsi_utils import wsi_detect_format

        # TIFF files should be detected as some OpenSlide vendor or None
        for f in tiff_files:
            fmt = wsi_detect_format(f)
            # Philips TIFFs should be detected; generic may return None
            assert fmt is None or isinstance(fmt, str), f"Unexpected format for {f}: {fmt}"

    def test_get_properties_svs(self, svs_files):
        from dbx.pixels.wsi.wsi_utils import wsi_get_properties

        props = wsi_get_properties(svs_files[0])
        assert len(props) > 0
        assert "openslide.vendor" in props
        assert props["openslide.vendor"] == "aperio"

    def test_wsi_to_image_tissue_svs(self, svs_files):
        from dbx.pixels.wsi.wsi_utils import wsi_to_image

        result = wsi_to_image(svs_files[0], max_width=256, series="tissue")
        assert result is not None
        assert isinstance(result, str)  # base64 string
        assert len(result) > 100  # Non-trivial content

    def test_wsi_to_image_label_svs(self, svs_files):
        from dbx.pixels.wsi.wsi_utils import wsi_to_image

        # CMU-1.svs has a label image
        cmu1 = next((f for f in svs_files if "CMU-1.svs" in f), svs_files[0])
        result = wsi_to_image(cmu1, max_width=256, series="label")
        assert result is not None
        assert isinstance(result, str)

    def test_wsi_to_image_macro_svs(self, svs_files):
        from dbx.pixels.wsi.wsi_utils import wsi_to_image

        cmu1 = next((f for f in svs_files if "CMU-1.svs" in f), svs_files[0])
        result = wsi_to_image(cmu1, max_width=256, series="macro")
        assert result is not None
        assert isinstance(result, str)

    def test_wsi_to_image_binary_output(self, svs_files):
        from dbx.pixels.wsi.wsi_utils import wsi_to_image

        result = wsi_to_image(svs_files[0], max_width=128, return_type="binary")
        assert result is not None
        assert isinstance(result, bytes)
        assert result[:2] == b"\xff\xd8"  # JPEG magic bytes

    def test_wsi_to_image_tiff(self, tiff_files):
        from dbx.pixels.wsi.wsi_utils import wsi_to_image

        result = wsi_to_image(tiff_files[0], max_width=256, series="tissue")
        assert result is not None
        assert isinstance(result, str)


# ---------------------------------------------------------------------------
# Test: WSIMetaExtractor module (standalone, no Spark)
# ---------------------------------------------------------------------------


class TestWSIMetaExtractorStandalone:
    """Tests for the static extraction methods (no Spark required)."""

    def test_process_openslide_svs(self, svs_files):
        from dbx.pixels.wsi.wsi_meta_extractor import WSIMetaExtractor

        result = WSIMetaExtractor._process_openslide(svs_files[0])
        meta = json.loads(result)
        assert "error" not in meta, f"Error: {meta.get('error')}"
        assert meta["_wsi_vendor"] == "aperio"
        assert meta["_wsi_backend"] == "openslide"
        assert meta["_wsi_width"] > 0
        assert meta["_wsi_height"] > 0
        assert meta["_wsi_level_count"] >= 1
        assert isinstance(meta["_wsi_level_dimensions"], list)
        assert isinstance(meta["_wsi_associated_images"], list)
        assert isinstance(meta["phi_tag_report"], list)

    def test_process_openslide_has_mpp(self, svs_files):
        from dbx.pixels.wsi.wsi_meta_extractor import WSIMetaExtractor

        result = WSIMetaExtractor._process_openslide(svs_files[0])
        meta = json.loads(result)
        # CMU SVS files have MPP defined
        assert meta["_wsi_mpp_x"] is not None or meta.get("openslide.mpp-x") is not None

    def test_process_openslide_svs_associated_images(self, svs_files):
        from dbx.pixels.wsi.wsi_meta_extractor import WSIMetaExtractor

        # CMU-1.svs should have label and macro
        cmu1 = next((f for f in svs_files if "CMU-1.svs" in f), svs_files[0])
        result = WSIMetaExtractor._process_openslide(cmu1)
        meta = json.loads(result)
        assert meta["_wsi_has_label"] is True
        assert meta["_wsi_has_macro"] is True

    def test_process_file_dispatches_to_openslide_for_svs(self, svs_files):
        from dbx.pixels.wsi.wsi_meta_extractor import WSIMetaExtractor

        result = WSIMetaExtractor._process_file(svs_files[0])
        meta = json.loads(result)
        assert meta["_wsi_backend"] == "openslide"

    def test_process_tifffile_fallback(self, tiff_files):
        from dbx.pixels.wsi.wsi_meta_extractor import WSIMetaExtractor

        # Force tifffile path
        result = WSIMetaExtractor._process_tifffile(tiff_files[0])
        meta = json.loads(result)
        assert "error" not in meta, f"Error: {meta.get('error')}"
        assert meta["_wsi_backend"] == "tifffile"
        assert meta["_wsi_width"] > 0
        assert meta["_wsi_height"] > 0

    def test_process_file_tiff_uses_openslide_when_possible(self, tiff_files):
        import openslide

        from dbx.pixels.wsi.wsi_meta_extractor import WSIMetaExtractor

        # Find a TIFF that OpenSlide recognizes
        for f in tiff_files:
            fmt = openslide.OpenSlide.detect_format(f)
            if fmt is not None:
                result = WSIMetaExtractor._process_file(f)
                meta = json.loads(result)
                assert meta["_wsi_backend"] == "openslide"
                return
        pytest.skip("No TIFF files recognized by OpenSlide")

    def test_all_svs_files_extract_without_error(self, svs_files):
        from dbx.pixels.wsi.wsi_meta_extractor import WSIMetaExtractor

        for f in svs_files:
            result = WSIMetaExtractor._process_file(f)
            meta = json.loads(result)
            assert "error" not in meta, f"Error for {f}: {meta.get('error')}"

    def test_all_tiff_files_extract_without_error(self, tiff_files):
        from dbx.pixels.wsi.wsi_meta_extractor import WSIMetaExtractor

        for f in tiff_files:
            result = WSIMetaExtractor._process_file(f)
            meta = json.loads(result)
            assert "error" not in meta, f"Error for {f}: {meta.get('error')}"


# ---------------------------------------------------------------------------
# Test: Format constants and patterns
# ---------------------------------------------------------------------------


class TestConstants:
    """Verify module constants are consistent."""

    def test_openslide_patterns_match_extensions(self):
        from dbx.pixels.wsi.wsi_phi_tags import OPENSLIDE_PATTERNS, SUPPORTED_EXTENSIONS

        for pat in OPENSLIDE_PATTERNS:
            ext = "." + pat.lstrip("*.")
            assert ext in SUPPORTED_EXTENSIONS, f"Pattern {pat} not in SUPPORTED_EXTENSIONS"

    def test_imports(self):
        """Verify the package imports cleanly."""
        from dbx.pixels.wsi import (
            WSICatalog,
            WSIMetaExtractor,
        )

        assert WSICatalog is not None
        assert WSIMetaExtractor is not None
