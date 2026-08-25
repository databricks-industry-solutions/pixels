import sys
from pathlib import Path

# ``tests/dbx/`` can shadow the installed ``dbx`` package when pytest prepends
# ``tests/`` to sys.path. Ensure ``src/`` wins import resolution.
_SRC = str(Path(__file__).resolve().parent.parent / "src")
if _SRC not in sys.path:
    sys.path.insert(0, _SRC)
