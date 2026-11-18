"""Tests for dbx.pixels.wsi — Unified WSI handler.

Runs against real SVS and TIFF files. By default the tests prepare their own samples in a
temporary folder: they download one small public Aperio slide (CMU-1-Small-Region.svs,
1.8 MB, from the OpenSlide test data) and generate two TIFFs (a plain one for the tifffile
fallback and a tiled pyramid that OpenSlide reads as generic-tiff). If the download isn't
possible (no network), the SVS-based tests skip.

To use your own slides instead, set (local paths or UC Volume paths):

- PIXELS_WSI_SVS_DIR:   folder containing .svs files
- PIXELS_WSI_TIFF_DIRS: comma-separated folder(s) containing .tif/.tiff files

Requires: openslide-python, openslide-bin, tifffile (the `wsi` extra)

Usage (from project root). These tests don't need Spark or a workspace, so skip the
repo-level conftest (it opens a Databricks Connect session) with ``--noconftest``, and use
``--import-mode=append`` so ``tests/dbx`` doesn't shadow the ``dbx`` package in ``src/``:

    pip install -e '.[wsi]' pytest
    pytest tests/dbx/test_wsi.py --noconftest --import-mode=append -v
"""

import json
import os
import sys
import urllib.request
from pathlib import Path

import pytest

# Ensure src is on path
SRC_PATH = str(Path(__file__).resolve().parents[2] / "src")
if SRC_PATH not in sys.path:
    sys.path.insert(0, SRC_PATH)


# ---------------------------------------------------------------------------
# Test fixtures: sample files (your folders via env vars, or generated samples)
# ---------------------------------------------------------------------------

SVS_DIR = os.environ.get("PIXELS_WSI_SVS_DIR", "")
TIFF_DIRS = [d.strip() for d in os.environ.get("PIXELS_WSI_TIFF_DIRS", "").split(",") if d.strip()]

SAMPLE_SVS_URL = (
    "https://openslide.cs.cmu.edu/download/openslide-testdata/Aperio/CMU-1-Small-Region.svs"
)


def _write_sample_tiffs(dest: Path) -> None:
    """Write a plain multi-page TIFF (label/macro pages) and a tiled 3-level pyramid."""
    import numpy as np
    import tifffile

    rng = np.random.default_rng(0)
    with tifffile.TiffWriter(dest / "plain.tiff") as tw:
        tw.write(
            rng.integers(0, 255, (512, 512, 3), dtype=np.uint8),
            photometric="rgb",
            description="main",
        )
        tw.write(
            rng.integers(0, 255, (64, 128, 3), dtype=np.uint8),
            photometric="rgb",
            description="label",
        )
        tw.write(
            rng.integers(0, 255, (96, 128, 3), dtype=np.uint8),
            photometric="rgb",
            description="macro",
        )

    y, x = np.mgrid[0:1024, 0:1024]
    base = np.stack([x % 256, y % 256, (x + y) // 8 % 256], axis=-1).astype(np.uint8)
    with tifffile.TiffWriter(dest / "pyramid.tif") as tw:
        tw.write(base, photometric="rgb", tile=(256, 256), compression="zlib")
        for f in (2, 4):
            tw.write(
                np.ascontiguousarray(base[::f, ::f]),
                photometric="rgb",
                tile=(256, 256),
                compression="zlib",
                subfiletype=1,
            )


@pytest.fixture(scope="session")
def generated_samples(tmp_path_factory):
    """Folder with generated sample slides; used when the env vars aren't set."""
    dest = tmp_path_factory.mktemp("wsi_samples")
    try:
        _write_sample_tiffs(dest)
    except ImportError:
        pass  # tifffile not installed: TIFF-based tests will skip
    try:
        urllib.request.urlretrieve(SAMPLE_SVS_URL, dest / "CMU-1-Small-Region.svs")
    except Exception as exc:  # no network, proxy, host down
        print(f"Could not download sample SVS ({exc}); SVS-based tests will skip")
    return str(dest)


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
def svs_files(request):
    """All SVS test files."""
    svs_dir = SVS_DIR or request.getfixturevalue("generated_samples")
    files = _discover_files(svs_dir, (".svs",))
    if not files:
        pytest.skip(f"No SVS files found in {svs_dir}")
    return files


@pytest.fixture(scope="module")
def tiff_files(request):
    """All TIFF test files."""
    tiff_dirs = TIFF_DIRS or [request.getfixturevalue("generated_samples")]
    files = []
    for d in tiff_dirs:
        files.extend(_discover_files(d, (".tiff", ".tif")))
    if not files:
        pytest.skip(f"No TIFF files found in {tiff_dirs}")
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
        assert classify_tag("openslide.level[0].width") == "NOT_PHI"  # OpenSlide-generated
        assert classify_tag("ImageWidth") == "NOT_PHI"
        assert classify_tag("tiff.XResolution") == "NOT_PHI"
        assert classify_tag("TileOffsets") == "NOT_PHI"

    def test_classify_lens_magnification_not_phi(self):
        from dbx.pixels.wsi.wsi_phi_tags import classify_tag

        assert classify_tag("hamamatsu.SourceLens") == "NOT_PHI"
        assert classify_tag("sakura.NominalLensMagnification") == "NOT_PHI"

    def test_classify_unknown_keys_fail_closed(self):
        from dbx.pixels.wsi.wsi_phi_tags import classify_tag

        # Not listed anywhere -> flagged for review, not silently treated as safe.
        assert classify_tag("SomeUnknownTag") == "QUESTIONABLE"
        assert classify_tag("ventana.CaseID") == "QUESTIONABLE"
        assert classify_tag("hamamatsu.SomeNewField") == "QUESTIONABLE"
        # OpenSlide exposes the full Aperio header as tiff.ImageDescription.
        assert classify_tag("tiff.ImageDescription") == "QUESTIONABLE"
        assert classify_tag("tiff.DateTime") == "QUESTIONABLE"
        # openslide.comment copies the description, so it stays flagged.
        assert classify_tag("openslide.comment") == "QUESTIONABLE"
        # Only OpenSlide's documented technical keys are safe; new ones are flagged.
        assert classify_tag("openslide.some-future-key") == "QUESTIONABLE"

    def test_classify_tiff_prefix_like_bare_tag(self):
        from dbx.pixels.wsi.wsi_phi_tags import classify_tag

        # OpenSlide reports TIFF tags as tiff.<Name>; they must classify like <Name>.
        assert classify_tag("Artist") == classify_tag("tiff.Artist") == "PHI"
        assert classify_tag("HostComputer") == classify_tag("tiff.HostComputer") == "PHI"
        assert classify_tag("tiff.ImageDescription") == "QUESTIONABLE"
        assert classify_tag("tiff.XResolution") == "NOT_PHI"

    def test_classify_leica_device_model_questionable(self):
        from dbx.pixels.wsi.wsi_phi_tags import classify_tag

        assert classify_tag("leica.device-model") == "QUESTIONABLE"

    def test_classify_barcodes_are_phi(self):
        from dbx.pixels.wsi.wsi_phi_tags import classify_tag

        # Seen on a real Philips slide: OpenSlide exposes the label barcode here.
        assert classify_tag("openslide.barcode") == "PHI"
        assert classify_tag("philips.PIM_DP_UFS_BARCODE") == "PHI"

    def test_classify_openslide_technical_keys(self):
        from dbx.pixels.wsi.wsi_phi_tags import classify_tag

        for key in (
            "openslide.level-count",
            "openslide.level[3].tile-width",
            "openslide.region[0].x",
            "openslide.bounds-height",
            "openslide.mpp-y",
            "openslide.objective-power",
            "openslide.vendor",
            "openslide.quickhash-1",
            "openslide.icc-size",
            "openslide.background-color",
            "openslide.associated.label.width",
        ):
            assert classify_tag(key) == "NOT_PHI", key

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

    def test_scrub_image_description_keeps_only_technical_aperio_values(self):
        from dbx.pixels.wsi.wsi_phi_tags import scrub_image_description

        desc = (
            "Aperio Image Library v10.0.50|AppMag = 20|MPP = 0.4990|Left = 25.69"
            "|Filename = CMU-1|User = b414003d|CaseRef = S26-10457"
        )
        parts = scrub_image_description(desc).split("|")
        assert parts[0] == "Aperio Image Library v10.0.50"  # header kept
        assert "AppMag = 20" in parts and "MPP = 0.4990" in parts and "Left = 25.69" in parts
        # Questionable and unknown keys are redacted, not passed through.
        assert "Filename = REDACTED" in parts
        assert "User = REDACTED" in parts
        assert "CaseRef = REDACTED" in parts

    def test_scrub_image_description_redacts_free_text(self):
        from dbx.pixels.wsi.wsi_phi_tags import scrub_image_description

        assert scrub_image_description("Patient: John Doe DOB 1954-04-01") == "REDACTED"
        assert scrub_image_description("") == ""
        assert scrub_image_description(None) is None

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

    def test_plain_tiff_thumbnail_respects_decode_limit(self, tiff_files, monkeypatch):
        """Over MAX_DECODE_PIXELS the thumbnail is skipped; metadata is unaffected."""
        import openslide

        from dbx.pixels.wsi import wsi_utils
        from dbx.pixels.wsi.wsi_meta_extractor import WSIMetaExtractor

        plain = next((f for f in tiff_files if openslide.OpenSlide.detect_format(f) is None), None)
        if plain is None:
            pytest.skip("No plain TIFF available")
        assert wsi_utils.wsi_to_image(plain) is not None  # default limit
        monkeypatch.setattr(wsi_utils, "MAX_DECODE_PIXELS", 1000)
        assert wsi_utils.wsi_to_image(plain) is None
        meta = json.loads(WSIMetaExtractor._process_file(plain))
        assert "error" not in meta and meta["_wsi_width"] > 0

    def test_wsi_to_image_missing_label_without_fallback(self, tiff_files):
        import openslide

        from dbx.pixels.wsi.wsi_utils import wsi_to_image

        no_label = []
        for f in tiff_files:
            if openslide.OpenSlide.detect_format(f) is None:
                continue
            with openslide.OpenSlide(f) as slide:
                if "label" not in slide.associated_images:
                    no_label.append(f)
        if not no_label:
            pytest.skip("No OpenSlide-readable slide without a label image")
        for f in no_label:
            assert wsi_to_image(f, series="label") is not None  # default: tissue fallback
            assert wsi_to_image(f, series="label", fallback_to_tissue=False) is None

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

    def test_wsi_to_image_no_resize_uses_smallest_level(self, all_wsi_files):
        """max_width=0 returns the smallest pyramid level, never the full-resolution slide."""
        import base64
        import io

        import openslide
        from PIL import Image

        from dbx.pixels.wsi.wsi_utils import wsi_to_image

        checked = 0
        for f in all_wsi_files:
            if openslide.OpenSlide.detect_format(f) is None:
                continue
            with openslide.OpenSlide(f) as slide:
                smallest = slide.level_dimensions[-1]
            img = Image.open(io.BytesIO(base64.b64decode(wsi_to_image(f, max_width=0))))
            assert img.size == smallest, f
            checked += 1
        if not checked:
            pytest.skip("No OpenSlide-readable files available")

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

    def test_derive_case_id(self):
        from dbx.pixels.wsi import derive_case_id

        # Barcode wins when the slide has one.
        assert (
            derive_case_id("/Volumes/c/s/v/S26-10457/A2-1.svs", {"openslide.barcode": "4012590"})
            == "4012590"
        )
        # Otherwise the folder that contains the slide.
        assert derive_case_id("/Volumes/c/s/v/S26-10457/A2-1.svs") == "S26-10457"
        assert derive_case_id("dbfs:/Volumes/c/s/v/S26-10457/A2-1.svs", {}) == "S26-10457"
        assert (
            derive_case_id("/Volumes/c/s/v/S26-10457/A2-1.svs", {"openslide.barcode": "  "})
            == "S26-10457"
        )
        # Nothing to use.
        assert derive_case_id("slide.svs") is None
        assert derive_case_id("/slide.svs") is None

    def test_process_file_falls_back_when_openslide_read_fails(self, tiff_files, monkeypatch):
        import openslide

        from dbx.pixels.wsi.wsi_meta_extractor import WSIMetaExtractor

        plain = next((f for f in tiff_files if openslide.OpenSlide.detect_format(f) is None), None)
        if plain is None:
            pytest.skip("No plain TIFF available")
        # Pretend OpenSlide recognizes the file but fails while reading it.
        monkeypatch.setattr(openslide.OpenSlide, "detect_format", staticmethod(lambda p: "x"))
        openslide_error = json.dumps({"error": "simulated OpenSlide read failure"})
        monkeypatch.setattr(
            WSIMetaExtractor, "_process_openslide", staticmethod(lambda p: openslide_error)
        )
        meta = json.loads(WSIMetaExtractor._process_file(plain))
        assert meta.get("_wsi_backend") == "tifffile" and "error" not in meta
        # When tifffile can't read it either, OpenSlide's error is kept.
        assert json.loads(WSIMetaExtractor._process_file("/no/such/x.svs")) == json.loads(
            openslide_error
        )

    def test_extracted_meta_includes_case_id(self, all_wsi_files):
        from dbx.pixels.wsi import derive_case_id
        from dbx.pixels.wsi.wsi_meta_extractor import WSIMetaExtractor

        for f in all_wsi_files:
            meta = json.loads(WSIMetaExtractor._process_file(f))
            assert meta["_wsi_case_id"] == derive_case_id(f, meta), f
        # Unreadable files still get a case_id from their folder.
        bad = json.loads(WSIMetaExtractor._process_file("/no/such/S26-1/x.svs"))
        assert bad.get("error") and bad["_wsi_case_id"] == "S26-1"

    def test_wsicatalog_accepts_cluster_by(self):
        import inspect

        from dbx.pixels.wsi.catalog import WSICatalog

        param = inspect.signature(WSICatalog.__init__).parameters["cluster_by"]
        assert param.default == "auto"

    def test_cluster_by_resolution(self):
        """auto -> study_uid only when present; explicit columns kept if present."""
        from types import SimpleNamespace

        from dbx.pixels.catalog import Catalog

        def resolve(setting, columns):
            cat = Catalog.__new__(Catalog)  # skip __init__ (it needs a workspace)
            cat._cluster_by = setting
            return cat._resolve_cluster_cols(SimpleNamespace(columns=columns))

        wsi_cols = ["path", "local_path", "meta"]
        assert resolve("auto", wsi_cols) == []  # e.g. raw catalog() output
        assert resolve("auto", wsi_cols + ["case_id"]) == ["case_id"]  # WSI
        assert resolve("auto", wsi_cols + ["study_uid"]) == ["study_uid"]  # DICOM
        assert resolve("auto", wsi_cols + ["case_id", "study_uid"]) == ["study_uid"]
        assert resolve(["case_id"], wsi_cols + ["case_id"]) == ["case_id"]
        assert resolve("case_id", wsi_cols) == []  # missing -> skipped with a warning
        assert resolve(None, wsi_cols + ["study_uid"]) == []

    def test_wsi_extensions_for_single_scan(self):
        from dbx.pixels.wsi.catalog import WSI_EXTENSIONS
        from dbx.pixels.wsi.wsi_phi_tags import OPENSLIDE_PATTERNS

        # Lower-case, no dot, one per OpenSlide pattern; DICOM is left to the DICOM path.
        assert len(WSI_EXTENSIONS) == len(OPENSLIDE_PATTERNS) == 10
        assert all(e == e.lower() and not e.startswith(".") for e in WSI_EXTENSIONS)
        assert {"svs", "ndpi", "tif", "tiff", "bif", "mrxs"} <= set(WSI_EXTENSIONS)
        assert "dcm" not in WSI_EXTENSIONS

    def test_imports(self):
        """Verify the package imports cleanly."""
        from dbx.pixels.wsi import (
            WSICatalog,
            WSIMetaExtractor,
        )

        assert WSICatalog is not None
        assert WSIMetaExtractor is not None


# ---------------------------------------------------------------------------
# Test: VLM PHI response parsing (no LLM call, no sample files)
# ---------------------------------------------------------------------------


class TestParsePhiResponse:
    """Verify the VLM answer is parsed into clean PHI entities."""

    @staticmethod
    def _parse(content):
        from dbx.pixels.wsi.wsi_vlm_phi_detector import _parse_phi_response

        return _parse_phi_response(content)

    def test_pipe_separated(self):
        assert self._parse("JANE Q. SAMPLE|03/14/1962|4471923") == [
            "JANE Q. SAMPLE",
            "03/14/1962",
            "4471923",
        ]

    def test_strips_special_tokens(self):
        # Observed from a real endpoint: the end-of-text token's pipes leaked into the split.
        content = "JANE Q. SAMPLE|03/14/1962|ST. EXAMPLE GENERAL HOSPITAL\n<|end_of_text|>"
        assert self._parse(content) == [
            "JANE Q. SAMPLE",
            "03/14/1962",
            "ST. EXAMPLE GENERAL HOSPITAL",
        ]

    def test_strips_xml_style_tags(self):
        # Also observed from a real endpoint, appended after a line break.
        content = "J. SAMPLE|4471923\n<budget:token_budget>199969</budget:token_budget>"
        assert self._parse(content) == ["J. SAMPLE", "4471923"]
        assert self._parse("MRN 4471923<br/>") == ["MRN 4471923"]

    def test_keeps_text_inside_unknown_tags(self):
        # Fail closed: PHI wrapped in an unexpected tag must still be reported.
        assert self._parse("<answer>JANE DOE|03/14/1962</answer>") == ["JANE DOE", "03/14/1962"]

    def test_drops_reasoning_blocks(self):
        assert self._parse("<think>looking at the label</think>JANE DOE|MRN 4471923") == [
            "JANE DOE",
            "MRN 4471923",
        ]

    def test_says_no_phi_distinguishes_empty_answers(self):
        from dbx.pixels.wsi.wsi_vlm_phi_detector import _says_no_phi

        assert _says_no_phi("No PHI") and _says_no_phi("<answer>'no phi'</answer>")
        # These parse to [] but aren't a "No PHI" answer, so the detector reports an error.
        for content in ("<think>hmm</think>", "", None, "<|end_of_text|>"):
            assert self._parse(content) == [] and not _says_no_phi(content), content

    def test_splits_on_line_breaks(self):
        assert self._parse("John Smith\n04-31-1954\r\n123 Drury Lane") == [
            "John Smith",
            "04-31-1954",
            "123 Drury Lane",
        ]

    def test_keeps_angle_brackets_that_are_not_tags(self):
        assert self._parse("Age <90|John Smith") == ["Age <90", "John Smith"]

    def test_strips_quotes_and_whitespace(self):
        assert self._parse("'John Smith' | '04-31-1954' |\"123 Drury Lane\"") == [
            "John Smith",
            "04-31-1954",
            "123 Drury Lane",
        ]

    def test_drops_empty_entries(self):
        assert self._parse("|John Smith||  |") == ["John Smith"]

    def test_no_phi(self):
        assert self._parse("No PHI") == []
        assert self._parse("'no phi'<|eot_id|>") == []

    def test_single_entity_without_pipe(self):
        assert self._parse("MRN 4471923") == ["MRN 4471923"]

    def test_empty_or_none(self):
        assert self._parse("") == []
        assert self._parse(None) == []
