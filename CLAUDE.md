# Pixels — CLAUDE.md

## Project Overview

Pixels is a Databricks Industry Solutions accelerator for medical imaging (DICOM). It deploys a complete stack via Databricks Asset Bundles (DAB): Unity Catalog tables, Lakebase (Postgres), DICOMweb apps, Vista3D model serving, Lakeview dashboard, vector search, and AI/BI Genie.

## Repository Structure

```
databricks.yml          # Bundle config — variables, sync rules
targets.yml             # dev (default) and prod targets
resources/
  install-job.yml       # Install job: 8-task DAG
  dashboard.yml         # Lakeview dashboard resource
  unity-catalog.yml     # UC schema, volume, table, UDFs, views
  dabs/                 # Notebook tasks for model + validation (03a, 03b, 03c, 10)
config/
  proxy_prep.py         # Shared widget init (init_env, init_model_serving_widgets)
dbx/pixels/             # Python package — core library (catalog, dicomweb apps)
monailabel_model/       # Vista3D model: conda envs, MLflow wrapper, bundle assets
ai-bi/                  # Lakeview dashboard JSON
tests/                  # pytest test suite
notebooks/              # Supplementary notebooks
```

Root-level `.ipynb` / `.py` files (00–08, RUNME) are the install job task notebooks.

## Build & Development

```bash
make dev      # Create .venv, install requirements + editable dev install
make test     # Build wheel, run pytest
make style    # Run pre-commit (autoflake, isort, black)
make check    # style + test
make clean    # Remove build artifacts and caches
```

## Code Style

Pre-commit hooks enforce formatting on `dbx/`, `tests/`, and `setup.py`:

- **black** — line length 100
- **isort** — profile=black, combine-as
- **autoflake** — remove unused imports and variables

Always run `make style` before committing.

## Deployment

```bash
# Authenticate
databricks auth login --profile MY_WORKSPACE

# Validate, deploy, run
databricks bundle validate -t prod -p MY_WORKSPACE --var catalog=my_catalog
databricks bundle deploy -t prod -p MY_WORKSPACE --auto-approve --var catalog=my_catalog
databricks bundle run pixels_install -t prod -p MY_WORKSPACE --var catalog=my_catalog
```

Use `-t dev` for development (resource names get `[dev username]` prefix).

## Bundle Variables

Defined in `databricks.yml`. Override with `--var key=value`.

| Variable | Default |
|----------|---------|
| `catalog` | `main` |
| `schema` | `pixels` |
| `volume_name` | `pixels_volume` |
| `serving_endpoint_name` | `pixels-monai-uc` |
| `scale_to_zero_enabled` | `true` |
| `model_uc_name` | `${catalog}.${schema}.monai_pixels_model` |
| `lakebase_instance_name` | `pixels-lakebase` |

## Install Job Task DAG

```
00_init_schema
    ├── 01_dcm_ingest ────────────────────┐
    │       └── 04_genie_space ───────────┐│
    └── 03a → 03b → 03c ─────────────────┤│
                                          │└── 02_deploy_apps ──┐
                                          └────────────────────┴── 10_validate
```

## Key Conventions

- **Serverless compute**: All install tasks run serverless. Packages pinned in `requirements.txt` with `>=` for runtime-provided packages (pandas, numpy, typing_extensions) and `==` for everything else.
- **Widget init**: `config/proxy_prep.py` centralizes widget creation. `init_env()` returns `(catalog, schema, table, volume)`. `init_model_serving_widgets()` returns `(model_uc_name, serving_endpoint_name, scale_to_zero_enabled)`.
- **Apps deployed via SDK**: OHIF `.wasm` files exceed DAB sync limits, so apps are deployed programmatically in notebook task 02 rather than via DAB `apps:` sections.
- **Model registration**: Vista3D is wrapped as an MLflow pyfunc and registered in Unity Catalog with a `champion` alias.

## Testing

### Unit Tests

```bash
make test
```

Tests live in `tests/` and run with `pytest -s --import-mode=importlib`.

### Post-Install Integration Tests

After the install job completes, validate all 7 user surfaces. Replace `MY_WORKSPACE` with your CLI profile and adjust catalog/schema to match your `--var` overrides.

#### 1. Dashboard

```bash
# List dashboards to find the Pixels dashboard ID
databricks api get /api/2.0/lakeview/dashboards -p MY_WORKSPACE \
  | python3 -c "import sys,json; [print(d['dashboard_id'], d['display_name']) for d in json.load(sys.stdin).get('dashboards',[]) if 'Pixels' in d.get('display_name','')]"

# Check dashboard status
databricks api get /api/2.0/lakeview/dashboards/<dashboard_id> -p MY_WORKSPACE
```

Expected: `lifecycle_state: ACTIVE`, 3 pages, 4 datasets, warehouse assigned.

#### 2. Genie Space

```bash
# Start a conversation
databricks api post /api/2.0/genie/spaces/<space_id>/start-conversation -p MY_WORKSPACE \
  --json '{"content": "How many DICOM studies are there?"}'

# Poll for result (status: FILTERING_CONTEXT → ASKING_AI → EXECUTING_QUERY → COMPLETED)
databricks api get /api/2.0/genie/spaces/<space_id>/conversations/<conv_id>/messages/<msg_id> \
  -p MY_WORKSPACE
```

Expected: answer "9 DICOM studies".

#### 3. Viewer App (`pixels-dicomweb`)

```bash
# Get app URL
databricks apps get pixels-dicomweb -p MY_WORKSPACE

# Open OHIF viewer with a test study (MONAI Label mode)
open <app_url>/ohif/monai-label?StudyInstanceUIDs=1.2.156.14702.1.1000.16.0.20200311113603875
```

Expected: OHIF viewer loads with the COVID lung CT study in MONAI Label mode.

#### 3b. Viewer App — MONAI Proxy (`/api/monai/`)

```bash
# MONAI info via the viewer app's reverse proxy (proxies to the model serving endpoint)
curl -s <app_url>/api/monai/
```

Expected: JSON with MONAI Label info — `name`, `version`, `labels`, `models`. Same data as test 5 but validates the viewer-to-serving proxy is working end-to-end.

#### 4. Gateway App (`pixels-dicomweb-gateway`)

```bash
# Get app URL
databricks apps get pixels-dicomweb-gateway -p MY_WORKSPACE

# Health check
curl -s <app_url>/health

# DICOMweb QIDO-RS (correct prefix is /api/dicomweb/, NOT /dicomweb/)
curl -s <app_url>/api/dicomweb/studies?limit=2
```

Expected: `/health` returns OK, `/api/dicomweb/studies` returns study JSON with UIDs.

#### 5. Model Serving — Info

```bash
# Get auth token
TOKEN=$(databricks auth token -p MY_WORKSPACE | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")
HOST=$(databricks auth env -p MY_WORKSPACE | python3 -c "import sys,json; print(json.load(sys.stdin)['env']['DATABRICKS_HOST'])")

# Info request
curl -s "$HOST/serving-endpoints/pixels-monai-uc/invocations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"dataframe_records": [{"input": {"action": "info"}}]}'
```

Expected: MONAI Label v0.8.5, Vista3D model, 132 anatomical segments, <1s response.

#### 6. Model Serving — Inference

```bash
curl -s "$HOST/serving-endpoints/pixels-monai-uc/invocations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dataframe_records": [{
      "series_uid": "1.2.156.14702.1.1000.16.1.2020031111365289000020001",
      "params": {
        "label_prompt": [20, 23, 28, 29, 30, 31, 32, 132],
        "export_metrics": false,
        "export_overlays": false,
        "dest_dir": "/Volumes/<catalog>/<schema>/pixels_volume/monai_serving/vista3d",
        "pixels_table": "<catalog>.<schema>.object_catalog",
        "torch_device": 0
      }
    }]
  }'
```

Labels: lung(20), lung_tumor(23), left_upper(28), left_lower(29), right_upper(30), right_middle(31), right_lower(32), airway(132). Expected: ~48–60s, returns `file_path` and `metrics`.

#### 7. Log Checks

```bash
# Query history (GET only — do NOT use POST)
curl -s "$HOST/api/2.0/sql/history/queries?max_results=50" \
  -H "Authorization: Bearer $TOKEN"

# Model serving logs (get entity name from endpoint config)
curl -s "$HOST/api/2.0/serving-endpoints/pixels-monai-uc/served-models/<entity_name>/logs" \
  -H "Authorization: Bearer $TOKEN"

# App logs
databricks apps logs pixels-dicomweb-gateway -p MY_WORKSPACE
databricks apps logs pixels-dicomweb -p MY_WORKSPACE
```

Known benign warnings in serving logs: CloudPickle version mismatch, missing HF_TOKEN, PyTorch affine dim mismatch.

## Git Workflow

- Branch from `main`, PR back to `main`
- Run `make style` before pushing — pre-commit hooks will catch formatting issues
- The repo uses Databricks pre-commit git hooks for secret scanning
