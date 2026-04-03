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

```bash
make test
```

Tests live in `tests/` and run with `pytest -s --import-mode=importlib`.

## Git Workflow

- Branch from `main`, PR back to `main`
- Run `make style` before pushing — pre-commit hooks will catch formatting issues
- The repo uses Databricks pre-commit git hooks for secret scanning
