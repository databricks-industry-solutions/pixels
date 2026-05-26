# Code Review: `fix/install` branch

**Date**: 2026-04-23
**Branch**: `fix/install` vs `main`
**Scope**: 77 commits, 60 files, ~+4900/-3000 lines

---

## CRITICAL (3)

### C1. Use-before-assignment in `_handle_legacy_spark`

**File**: `dbx/pixels/resources/dicom_web_gateway/utils/handlers/_stow.py:~1155-1160`

`req_pixels_table` is referenced to build `table_scoped_base` before it's assigned by `_resolve_pixels_table(request)` a few lines later. Will crash on every legacy STOW upload.

```python
table_scoped_base = f"{stow_base}/{req_pixels_table}" if req_pixels_table else stow_base
dest_path = f"{table_scoped_base}/{current_date}/{file_id}.mpr"
now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
req_pixels_table = _resolve_pixels_table(request)   # <-- assigned AFTER first use
```

**Fix**: Move `_resolve_pixels_table(request)` and `_derive_stow_table()` calls above line 1157, matching `_handle_streaming`.

### C2. App requirements point to `@fix/install` branch

**Files**:
- `dbx/pixels/resources/dicom_web/requirements.txt`
- `dbx/pixels/resources/dicom_web_gateway/requirements.txt`
- `dbx/pixels/resources/lakehouse_app/requirements.txt`

All reference `git+https://...@fix/install`. Must update to `@main` before merge, or deployed apps will install from a stale branch.

### C3. PAT token created on every run in `03b-deploy-endpoint.py`

**File**: `resources/dabs/03b-deploy-endpoint.py:~97-108`

Each re-run creates a new PAT without cleaning up old ones. Orphaned tokens accumulate. The broad `except` also swallows real auth errors. Consider checking if a valid token already exists before creating a new one.

---

## WARNING (7)

### W1. pydicom version regression

Commit `d33128a` bumped pydicom to 3.0.2, but later commits overwrote files back to 3.0.1. Current branch has 3.0.1 everywhere. If 3.0.2 was intended, update:
- `requirements.txt`
- `monailabel_model/bundles/conda.yaml`
- `monailabel_model/bundles/requirements.txt`
- `monailabel_model/vista3d/conda.yaml`
- `monailabel_model/vista3d/requirements.txt`

### W2. SQL via f-strings (low risk)

Multiple notebooks construct SQL via f-strings with user-provided widget values:
- `resources/dabs/00-init-schema.ipynb`: `spark.sql(f"CREATE DATABASE IF NOT EXISTS {uc_schema}")`
- `resources/dabs/10-validate.py`: `spark.sql(f"SELECT COUNT(*) AS cnt FROM {_tables[0]}")`

Values come from DAB job parameters, so risk is limited to authorized users.

### W3. STOW volume path from user cookie without validation

**File**: `dbx/pixels/resources/dicom_web_gateway/utils/handlers/_stow.py:929`

```python
stow_base = request.cookies.get("seg_dest_dir", "").rstrip("/") or os.getenv(...)
```

No validation that the path is under the expected Volumes prefix. A user could write `.mpr` files to arbitrary paths accessible to the app service principal.

### W4. Dashboard lookup by name substring is fragile

**File**: `resources/dabs/09-post-install-update.py:35`

```python
_match = [d for d in _all_dashboards if "Pixels" in d.get("display_name", "")]
```

Matches any dashboard with "Pixels" in the name. Could match wrong dashboard if copies exist.

### W5. Dashboard list API does not paginate

**File**: `resources/dabs/09-post-install-update.py:32`

`page_size=100` will miss dashboards if the workspace has more than 100. `next_page_token` is not handled.

### W6. Redundant wait logic between 03b and 03c

`03b-deploy-endpoint.py` has a 40-minute wait loop. `install-job.yml` gives 03c `max_retries: 10` with 3-minute intervals (30 more minutes). Combined maximum is ~70 minutes. Consider simplifying: let 03b fire-and-forget, let 03c retries handle the full wait.

### W7. `_write_stow_records` silently drops errors

**File**: `dbx/pixels/resources/dicom_web_gateway/utils/handlers/_stow.py`

Refactored functions removed `raise_on_error` and now always swallow errors. Failed STOW tracking inserts return success to the client even though the upload is not tracked. Could cause data to be written to volumes but never processed.

---

## MINOR (8)

### M1. Unused variable `_filter_param_map`

**File**: `resources/dabs/09-post-install-update.py:72`

```python
_filter_param_map = {"table": "table", "viewer_host": "viewer_host"}
```

Defined but never read. Dead code.

### M2. `os.getcwd()` unreliable for notebook path resolution

**File**: `resources/dabs/09-post-install-update.py:109`

Other notebooks correctly use `notebookPath()` from the notebook context. This one uses `os.getcwd()`, which may not be the notebook directory on serverless compute.

### M3. `w` (WorkspaceClient) used implicitly from `%run`

**File**: `resources/dabs/09-post-install-update.py:51, 115`

`w` comes from `%run ../../config/proxy_prep`. A comment or local `w = WorkspaceClient()` would be more explicit.

### M4. Inconsistent `init_*` widget call pattern

**File**: `resources/dabs/09-post-install-update.py`

Does not call `init_model_serving_widgets()` unlike 03b, 03c, 10. Fine since this notebook doesn't need those vars, but inconsistent.

### M5. Emoji in print statements

**File**: `resources/dabs/09-post-install-update.py:38, 97, 98, 118`

May render incorrectly in Databricks job log output depending on terminal encoding.

### M6. numpy pinning inconsistency

`requirements.txt` uses `numpy==1.26.4` (exact) while `requirements-ai.txt` uses `numpy>=1.26.4` (floor). Could cause version conflicts when both are installed.

### M7. `DEFAULT_UNZIP_WORKERS = 1` makes ThreadPoolExecutor a no-op

**File**: `dbx/pixels/utils.py:14`

Default of 1 worker adds thread overhead without parallelism. Docstring in `catalog.py` says "Defaults to 16" but actual default is 1.

### M8. Dashboard JSON reformatting noise

**File**: `ai-bi/Pixels Object Catalog dashboard.lvdash.json`

Key reordering adds ~2500 lines of diff noise. Semantic changes (parameter defaults, global filters) are buried.

---

## SUGGESTIONS

- **S1**: Explicitly set `volume_type: MANAGED` in `resources/unity-catalog.yml`
- **S2**: Genie space validation requires both "Pixels" and "Genie" in title -- fragile if renamed
- **S3**: STOW job hardcodes `_PIXELS_GIT_BRANCH = "main"` -- not testable on feature branches
- **S4**: `03a` uses `os` before explicit import (depends on `%run` side effect)
- **S5**: Lakebase instance name hardcoded in `10-validate.py` instead of using bundle variable

---

## OVERALL ASSESSMENT

Solid, well-structured work. The task DAG design and idempotency logic (model registration tree hash fingerprinting, endpoint version checks) are thoughtful. The validation task (22 checks) is comprehensive.

**Must fix before merge**: C1 (crash), C2 (branch refs), C3 (PAT accumulation). W7 (silent error swallowing) also deserves attention for data integrity.
