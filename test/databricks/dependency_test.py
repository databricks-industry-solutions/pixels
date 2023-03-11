import pytest

@pytest.fixture

def test_s3fs_import():
  import s3fs # install as a cluster library to pass
  assert(True)

def test_pydicom_import():
  import pydicom # install as a cluster library to pass
  assert(True)
  
def test_pyspark_import():
  import pyspark.sql # install as a cluster library to pass
  assert(True)
  