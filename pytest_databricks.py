# Databricks notebook source
# MAGIC %pip install -r requirements.txt
# MAGIC %pip install pytest
# MAGIC %pip install openslide-python openslide-bin tifffile

# COMMAND ----------

dbutils.library.restartPython()

# COMMAND ----------

import logging
logging.getLogger('py4j.java_gateway').setLevel(logging.ERROR)

# COMMAND ----------

# Sample slides for tests/dbx/test_wsi.py. Downloads one small public Aperio SVS and
# generates two TIFFs (a plain one for the tifffile fallback, and a tiled pyramid that
# OpenSlide reads as generic-tiff). If this fails, the file-based WSI tests skip instead
# of failing the run.
import os
import urllib.request

import numpy as np
import tifffile

WSI_SAMPLE_DIR = "/tmp/pixels_wsi_samples"
WSI_SVS_URL = "https://openslide.cs.cmu.edu/download/openslide-testdata/Aperio/CMU-1-Small-Region.svs"
try:
    os.makedirs(WSI_SAMPLE_DIR, exist_ok=True)
    svs_path = os.path.join(WSI_SAMPLE_DIR, "CMU-1-Small-Region.svs")
    if not os.path.exists(svs_path):
        urllib.request.urlretrieve(WSI_SVS_URL, svs_path)

    rng = np.random.default_rng(0)
    with tifffile.TiffWriter(os.path.join(WSI_SAMPLE_DIR, "plain.tiff")) as tw:
        tw.write(rng.integers(0, 255, (512, 512, 3), dtype=np.uint8), photometric="rgb", description="main")
        tw.write(rng.integers(0, 255, (64, 128, 3), dtype=np.uint8), photometric="rgb", description="label")
        tw.write(rng.integers(0, 255, (96, 128, 3), dtype=np.uint8), photometric="rgb", description="macro")

    y, x = np.mgrid[0:1024, 0:1024]
    base = np.stack([x % 256, y % 256, (x + y) // 8 % 256], axis=-1).astype(np.uint8)
    with tifffile.TiffWriter(os.path.join(WSI_SAMPLE_DIR, "pyramid.tif")) as tw:
        tw.write(base, photometric="rgb", tile=(256, 256), compression="zlib")
        for f in (2, 4):
            tw.write(np.ascontiguousarray(base[::f, ::f]), photometric="rgb", tile=(256, 256), compression="zlib", subfiletype=1)

    os.environ["PIXELS_WSI_SVS_DIR"] = WSI_SAMPLE_DIR
    os.environ["PIXELS_WSI_TIFF_DIRS"] = WSI_SAMPLE_DIR
    print(f"WSI sample slides ready in {WSI_SAMPLE_DIR}: {sorted(os.listdir(WSI_SAMPLE_DIR))}")
except Exception as e:
    print(f"WARNING: could not prepare WSI sample slides ({e}); file-based WSI tests will skip")

# COMMAND ----------

import pytest
import sys
import os

# Add src/ to path so dbx.pixels is importable
_nb_ctx = dbutils.notebook.entry_point.getDbutils().notebook().getContext()
_nb_dir = "/Workspace" + os.path.dirname(_nb_ctx.notebookPath().get())
sys.path.insert(0, os.path.join(_nb_dir, "src"))

os.environ['DATABRICKS_HOST'] = dbutils.notebook.entry_point.getDbutils().notebook().getContext().apiUrl().get()
os.environ['DATABRICKS_TOKEN'] = dbutils.notebook.entry_point.getDbutils().notebook().getContext().apiToken().get()

sys.dont_write_bytecode = True

result = pytest.main(['--import-mode=importlib', 'tests/dbx/'])
if result != 0:
    raise Exception(f"Tests failed with exit code: {result}")