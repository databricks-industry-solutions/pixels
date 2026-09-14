"""Tests for serving pre-compressed static assets (*.wasm.gz, *.js.gz).

Large OHIF/ONNX-Runtime assets are stored gzip-compressed to stay under git /
DAB size limits.  ``DBStaticFiles`` serves the ``*.gz`` file (with
``Content-Encoding: gzip``) when the uncompressed original is absent, and never
falls back to ``index.html`` for asset requests.
"""

import gzip
from pathlib import Path

import pytest
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient

from dbx.pixels.common.middleware import DBStaticFiles

_OHIF_ROOT = Path(__file__).resolve().parents[2] / "apps" / "dicom-web" / "ohif"
_OHIF_ORT = _OHIF_ROOT / "ort"

_WASM_MAGIC = b"\x00asm"


@pytest.fixture
def gzip_asset_dir(tmp_path):
    """Minimal OHIF tree with gz-only wasm and js assets and an index.html."""
    (tmp_path / "index.html").write_text("<html>SPA SHELL</html>")

    wasm_gz = tmp_path / "ort" / "test.wasm.gz"
    wasm_gz.parent.mkdir(parents=True)
    with gzip.open(wasm_gz, "wb") as f:
        f.write(_WASM_MAGIC + b"\x01\x00\x00\x00" + b"\x00" * 64)

    js_gz = tmp_path / "app.bundle.test.js.gz"
    with gzip.open(js_gz, "wb") as f:
        f.write(b"/*! app bundle */\nconsole.log('pixels');\n")

    return tmp_path


def _mount(directory) -> FastAPI:
    app = FastAPI()
    app.mount("/ohif/", DBStaticFiles(directory=str(directory), html=True), name="ohif")
    return app


async def _get(app: FastAPI, url: str):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        return await client.get(url)


@pytest.mark.asyncio
async def test_serves_wasm_from_gz(gzip_asset_dir):
    resp = await _get(_mount(gzip_asset_dir), "/ohif/ort/test.wasm")

    assert resp.status_code == 200
    assert resp.headers["content-type"].startswith("application/wasm")
    assert resp.headers["content-encoding"] == "gzip"
    # httpx transparently decodes gzip; verify we got real wasm, not index.html.
    assert resp.content.startswith(_WASM_MAGIC)


@pytest.mark.asyncio
async def test_serves_js_from_gz(gzip_asset_dir):
    resp = await _get(_mount(gzip_asset_dir), "/ohif/app.bundle.test.js")

    assert resp.status_code == 200
    assert resp.headers["content-type"].startswith("text/javascript")
    assert resp.headers["content-encoding"] == "gzip"
    assert resp.content.startswith(b"/*!")
    assert b"SPA SHELL" not in resp.content


@pytest.mark.asyncio
async def test_prefers_uncompressed_when_present(gzip_asset_dir):
    """An uncompressed file on disk wins over the .gz sibling."""
    (gzip_asset_dir / "app.bundle.test.js").write_text("PLAIN JS")

    resp = await _get(_mount(gzip_asset_dir), "/ohif/app.bundle.test.js")

    assert resp.status_code == 200
    assert "content-encoding" not in resp.headers
    assert resp.content == b"PLAIN JS"


@pytest.mark.asyncio
async def test_missing_asset_404s_not_index_html(gzip_asset_dir):
    """Missing assets must 404 rather than return the SPA shell."""
    resp = await _get(_mount(gzip_asset_dir), "/ohif/does-not-exist.js")
    assert resp.status_code == 404
    assert b"SPA SHELL" not in resp.content


@pytest.mark.asyncio
async def test_spa_route_still_falls_back_to_index(gzip_asset_dir):
    """Non-asset (SPA) routes still fall back to index.html."""
    resp = await _get(_mount(gzip_asset_dir), "/ohif/viewer")
    assert resp.status_code == 200
    assert b"SPA SHELL" in resp.content


@pytest.mark.skipif(not _OHIF_ORT.is_dir(), reason="OHIF ort assets not present")
@pytest.mark.asyncio
async def test_real_ort_wasm_served_from_gz():
    sample = next(_OHIF_ORT.glob("*.wasm.gz"))
    wasm_name = sample.name.removesuffix(".gz")

    resp = await _get(_mount(_OHIF_ROOT), f"/ohif/ort/{wasm_name}")

    assert resp.status_code == 200
    assert resp.headers["content-type"].startswith("application/wasm")
    assert resp.headers["content-encoding"] == "gzip"
    assert resp.content.startswith(_WASM_MAGIC)


@pytest.mark.skipif(
    not next(_OHIF_ROOT.glob("app.bundle.*.js.gz"), None),
    reason="OHIF app bundle gzip asset not present",
)
@pytest.mark.asyncio
async def test_real_app_bundle_served_from_gz(tmp_path):
    gz_src = next(_OHIF_ROOT.glob("app.bundle.*.js.gz"))
    bundle_name = gz_src.name.removesuffix(".gz")

    # Simulate a deploy layout where only the .js.gz exists.
    (tmp_path / gz_src.name).write_bytes(gz_src.read_bytes())

    resp = await _get(_mount(tmp_path), f"/ohif/{bundle_name}")

    assert resp.status_code == 200
    assert resp.headers["content-type"].startswith("text/javascript")
    assert resp.headers["content-encoding"] == "gzip"
