"""
Unit tests for gzip of WADO-RS frame responses.

Tests cover:
- _gzip_stream (incremental gzip round-trips to the original bytes)
- dicomweb_wado_instance_frames (gzip only for native transfer syntaxes
  and only when the client accepts it)
"""

# -- sys.path fix ----------------------------------------------------------
import sys
from pathlib import Path

_PROJECT_ROOT = str(Path(__file__).resolve().parents[2])
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)
_GATEWAY_APP = str(Path(__file__).resolve().parents[2] / "apps" / "dicom-web-gateway")
if _GATEWAY_APP not in sys.path:
    sys.path.insert(0, _GATEWAY_APP)
# --------------------------------------------------------------------------

import asyncio
import gzip

import pytest
from starlette.requests import Request
from utils.handlers import _wado

_FRAME = bytes(range(256)) * 4096  # 1 MiB, compressible


def _request(accept_encoding: str | None) -> Request:
    headers = [(b"accept-encoding", accept_encoding.encode())] if accept_encoding else []
    return Request({"type": "http", "method": "GET", "path": "/", "headers": headers})


class _FakeWrapper:
    def __init__(self, tsuid: str):
        self._tsuid = tsuid

    def retrieve_instance_frames(self, study, series, sop, frame_numbers):
        return iter([_FRAME for _ in frame_numbers]), self._tsuid


async def _read(response) -> bytes:
    return b"".join([chunk async for chunk in response.body_iterator])


def _frames_response(monkeypatch, tsuid: str, accept_encoding: str | None):
    monkeypatch.setattr(_wado, "get_dicomweb_wrapper", lambda request: _FakeWrapper(tsuid))
    response = _wado.dicomweb_wado_instance_frames(
        _request(accept_encoding), "1.2.3", "1.2.3.4", "1.2.3.4.5", "1,2"
    )
    return response, asyncio.run(_read(response))


def test_gzip_stream_round_trip():
    chunks = [b"--b\r\n", _FRAME, b"\r\n", _FRAME, b"--b--\r\n"]
    compressed = b"".join(_wado._gzip_stream(chunks, 1))
    assert gzip.decompress(compressed) == b"".join(chunks)
    assert len(compressed) < len(b"".join(chunks))


def test_native_frames_gzipped_when_accepted(monkeypatch):
    response, body = _frames_response(monkeypatch, "1.2.840.10008.1.2.1", "gzip, deflate, br")
    assert response.headers["content-encoding"] == "gzip"
    assert response.headers["vary"] == "Accept-Encoding"
    plain = gzip.decompress(body)
    assert plain.count(_FRAME) == 2
    assert len(body) < len(plain)


def test_native_frames_plain_without_accept_encoding(monkeypatch):
    response, body = _frames_response(monkeypatch, "1.2.840.10008.1.2.1", None)
    assert "content-encoding" not in response.headers
    assert body.count(_FRAME) == 2


@pytest.mark.parametrize("tsuid", ["1.2.840.10008.1.2.4.90", "1.2.840.10008.1.2.4.50"])
def test_encapsulated_frames_never_gzipped(monkeypatch, tsuid):
    response, body = _frames_response(monkeypatch, tsuid, "gzip")
    assert "content-encoding" not in response.headers
    assert body.count(_FRAME) == 2


def test_gzip_disabled_by_level_zero(monkeypatch):
    monkeypatch.setattr(_wado, "_FRAME_GZIP_LEVEL", 0)
    response, body = _frames_response(monkeypatch, "1.2.840.10008.1.2.1", "gzip")
    assert "content-encoding" not in response.headers
    assert body.count(_FRAME) == 2
