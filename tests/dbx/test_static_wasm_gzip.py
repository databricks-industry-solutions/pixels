"""Tests for serving pre-compressed ONNX Runtime WASM files."""

import gzip
from pathlib import Path

import pytest
from httpx import ASGITransport, AsyncClient

from dbx.pixels.common.middleware import DBStaticFiles

_OHIF_ORT = Path(__file__).resolve().parents[2] / "apps" / "dicom-web" / "ohif" / "ort"


@pytest.fixture
def wasm_gz_dir(tmp_path):
    """Minimal OHIF tree: one .wasm.gz, no uncompressed .wasm."""
    wasm_bytes = b"\x00asm\x01\x00\x00\x00" + b"\x00" * 64
    gz_path = tmp_path / "ort" / "test.wasm.gz"
    gz_path.parent.mkdir(parents=True)
    with gzip.open(gz_path, "wb") as f:
        f.write(wasm_bytes)
    return tmp_path


@pytest.mark.asyncio
async def test_serves_wasm_from_gz(wasm_gz_dir):
    app = DBStaticFiles(directory=str(wasm_gz_dir), html=True)
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
async def test_wasm_mount_integration(wasm_gz_dir):
    from fastapi import FastAPI

    app = FastAPI()
    app.mount("/ohif/", DBStaticFiles(directory=str(wasm_gz_dir), html=True), name="ohif")

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/ohif/ort/test.wasm")

    assert resp.status_code == 200
    assert resp.headers["content-type"].startswith("application/wasm")
    assert resp.headers["content-encoding"] == "gzip"
    assert gzip.decompress(resp.content).startswith(b"\x00asm")


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
