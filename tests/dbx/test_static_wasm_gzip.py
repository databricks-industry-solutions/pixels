"""Tests for serving pre-compressed static assets (*.wasm.gz, *.js.gz)."""

import gzip
from pathlib import Path

import pytest
from httpx import ASGITransport, AsyncClient

from dbx.pixels.common.middleware import DBStaticFiles

_OHIF_ROOT = Path(__file__).resolve().parents[2] / "apps" / "dicom-web" / "ohif"
_OHIF_ORT = _OHIF_ROOT / "ort"


@pytest.fixture
def gzip_asset_dir(tmp_path):
    """Minimal OHIF tree with gz-only wasm and js assets."""
    wasm_bytes = b"\x00asm\x01\x00\x00\x00" + b"\x00" * 64
    js_bytes = b"console.log('pixels');\n"

    wasm_gz = tmp_path / "ort" / "test.wasm.gz"
    wasm_gz.parent.mkdir(parents=True)
    with gzip.open(wasm_gz, "wb") as f:
        f.write(wasm_bytes)

    js_gz = tmp_path / "app.bundle.test.js.gz"
    with gzip.open(js_gz, "wb") as f:
        f.write(js_bytes)

    return tmp_path


@pytest.mark.asyncio
async def test_serves_wasm_from_gz(gzip_asset_dir):
    app = DBStaticFiles(directory=str(gzip_asset_dir), html=True)
    scope = {
        "type": "http",
        "method": "GET",
        "path": "/ohif/ort/test.wasm",
        "headers": [],
    }
    response = await app.get_response("ort/test.wasm", scope)

    assert response.status_code == 200
    assert response.media_type == "application/wasm"
    assert response.headers["content-encoding"] == "gzip"
    body = b"".join([chunk async for chunk in response.body_iterator])
    assert gzip.decompress(body).startswith(b"\x00asm")


@pytest.mark.asyncio
async def test_serves_js_from_gz(gzip_asset_dir):
    app = DBStaticFiles(directory=str(gzip_asset_dir), html=True)
    scope = {
        "type": "http",
        "method": "GET",
        "path": "/ohif/app.bundle.test.js",
        "headers": [],
    }
    response = await app.get_response("app.bundle.test.js", scope)

    assert response.status_code == 200
    assert response.media_type == "text/javascript"
    assert response.headers["content-encoding"] == "gzip"
    body = b"".join([chunk async for chunk in response.body_iterator])
    assert gzip.decompress(body) == b"console.log('pixels');\n"


@pytest.mark.asyncio
async def test_wasm_mount_integration(gzip_asset_dir):
    from fastapi import FastAPI

    app = FastAPI()
    app.mount("/ohif/", DBStaticFiles(directory=str(gzip_asset_dir), html=True), name="ohif")

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/ohif/ort/test.wasm")

    assert resp.status_code == 200
    assert resp.headers["content-type"].startswith("application/wasm")
    assert resp.headers["content-encoding"] == "gzip"
    assert gzip.decompress(resp.content).startswith(b"\x00asm")


@pytest.mark.asyncio
async def test_js_mount_integration(gzip_asset_dir):
    from fastapi import FastAPI

    app = FastAPI()
    app.mount("/ohif/", DBStaticFiles(directory=str(gzip_asset_dir), html=True), name="ohif")

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/ohif/app.bundle.test.js")

    assert resp.status_code == 200
    assert resp.headers["content-type"].startswith("text/javascript")
    assert resp.headers["content-encoding"] == "gzip"
    assert gzip.decompress(resp.content) == b"console.log('pixels');\n"


@pytest.mark.skipif(not _OHIF_ORT.is_dir(), reason="OHIF ort assets not present")
@pytest.mark.asyncio
async def test_real_ort_wasm_assets_are_gz_only():
    """Repo ships ort/*.wasm.gz without matching *.wasm files."""
    wasm_files = sorted(_OHIF_ORT.glob("*.wasm"))
    gz_files = sorted(_OHIF_ORT.glob("*.wasm.gz"))
    assert not wasm_files, "uncompressed .wasm files should not be committed"
    assert gz_files, "expected ort/*.wasm.gz assets"


@pytest.mark.skipif(not _OHIF_ORT.is_dir(), reason="OHIF ort assets not present")
@pytest.mark.asyncio
async def test_real_ort_wasm_served_from_gz():
    from fastapi import FastAPI

    ohif_root = _OHIF_ORT.parent
    app = FastAPI()
    app.mount("/ohif/", DBStaticFiles(directory=str(ohif_root), html=True), name="ohif")

    sample = next(_OHIF_ORT.glob("*.wasm.gz"))
    wasm_name = sample.name.removesuffix(".gz")

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get(f"/ohif/ort/{wasm_name}")

    assert resp.status_code == 200
    assert resp.headers["content-type"].startswith("application/wasm")
    assert resp.headers["content-encoding"] == "gzip"
    assert gzip.decompress(resp.content).startswith(b"\x00asm")


@pytest.mark.skipif(
    not (_OHIF_ROOT / "app.bundle.0b070945c1ae7c80c19b.js.gz").is_file(),
    reason="OHIF app bundle gzip asset not present",
)
@pytest.mark.asyncio
async def test_real_app_bundle_served_from_gz(tmp_path):
    from fastapi import FastAPI

    bundle_name = "app.bundle.0b070945c1ae7c80c19b.js"
    gz_src = _OHIF_ROOT / f"{bundle_name}.gz"
    # Simulate deploy layout: only the .js.gz file on disk.
    gz_dst = tmp_path / f"{bundle_name}.gz"
    gz_dst.write_bytes(gz_src.read_bytes())

    app = FastAPI()
    app.mount("/ohif/", DBStaticFiles(directory=str(tmp_path), html=True), name="ohif")

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get(f"/ohif/{bundle_name}")

    assert resp.status_code == 200
    assert resp.headers["content-type"].startswith("text/javascript")
    assert resp.headers["content-encoding"] == "gzip"
    assert gzip.decompress(resp.content).startswith(b"/*!")
