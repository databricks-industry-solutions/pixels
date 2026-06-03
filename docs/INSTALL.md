# Pixels Installation Guide

Deploy the complete Pixels Medical Imaging stack using Databricks Asset Bundles (DAB).

## Prerequisites

### Local Tools

- **Git** — to clone the repository
- **Python 3.10+** — required by the Databricks CLI and `make build`
- **GNU make** — drives the local build (`make build`, `make clean`, `make dev`, `make style`, `make test`)
- **Python `build` package** — `pip install build` (used by `make build` to produce the wheel)
- **Databricks CLI** >= v0.230 — install via:
  ```bash
  # macOS / Linux
  brew tap databricks/tap && brew install databricks

  # Or via pip
  pip install databricks-cli

  # Or direct binary download
  # See https://docs.databricks.com/en/dev-tools/cli/install.html
  ```

### Local Build Targets

| Target | Purpose |
|--------|---------|
| `make dev` | Create `.venv`, install runtime + editable dev deps |
| `make build` | Build `dist/databricks_pixels-*.whl`, `dist/ohif.tar.gz`, `dist/vista3d.tar.gz` (required before `databricks bundle deploy`) |
| `make render-dashboard` | Render `dist/Pixels Object Catalog dashboard.lvdash.json` from the `.tmpl` source (catalog/schema/viewer_host substituted) — runs implicitly as part of `make deploy` |
| `make deploy` | `build` + `render-dashboard` + `databricks bundle deploy` (forwards `CATALOG`/`SCHEMA`/`PROFILE`/`TARGET`) |
| `make style` | Run pre-commit (autoflake, isort, black) — run before pushing |
| `make test` | Build wheel and run pytest |
| `make check` | `style` + `test` |
| `make clean` | Remove `dist/`, `build/`, `htmlcov/`, caches |

### Workspace Requirements

Your Databricks workspace must have the following services enabled:

| Service | How to Enable | Notes |
|---------|--------------|-------|
| **Unity Catalog** | Workspace admin console | Required for all catalog objects |
| **Serverless Compute** | Workspace admin → Compute settings | All install tasks run serverless |
| **Serverless SQL Warehouse** | Auto-created or admin console | Used by dashboard, apps, Genie at query time |
| **Model Serving (GPU)** | Workspace admin → Serving settings | GPU workload types must be enabled for Vista3D |
| **Databricks Apps** | Workspace admin → Preview settings | Hosts the OHIF viewer and DICOMweb gateway |
| **Apps User Token Passthrough** | Org-level feature flag — contact your Databricks account team | Required for apps to act on behalf of users |
| **Lakebase (Postgres)** | Preview — contact your Databricks account team | Backs fast DICOMweb lookups |
| **Vector Search** | Workspace admin → Preview settings | Powers semantic search over DICOM tags |
| **AI/BI Genie** | Workspace admin → Preview settings | Natural language queries over DICOM metadata |
| **Foundation Model APIs** | Workspace admin → Serving settings | `databricks-bge-large-en` used for vector search embeddings |
| **Reverse ETL** | Preview — contact your Databricks account team | Syncs UC view data into Lakebase for sub-10ms lookups |

> **Note on preview features (as of April 2, 2026):** Lakebase, Apps User Token Passthrough, and Reverse ETL are gated preview features that typically require a support request or account team enablement. Vector Search, AI/BI Genie, and Foundation Model APIs may be available as self-service toggles in the admin console depending on your workspace tier. Check your workspace admin settings first; if a feature is not visible, contact your Databricks account team.

## Compute Requirements

All install tasks run on **serverless compute**. No GPU clusters are required — the model serving endpoint uses Databricks-managed GPU infrastructure.

| Component | Compute Type | Details |
|-----------|-------------|---------|
| Install job (15 tasks) | Serverless notebook | End-to-end wall time ~30–45 min on a fresh workspace |
| Model serving endpoint | Databricks-managed GPU | GPU_MEDIUM, scale-to-zero, ~15–30 min initial provisioning |
| Lakebase instance | Auto-created | Min 0.5 CU / Max 2.0 CU, autoscaling |
| Runtime (apps, dashboard, Genie) | Serverless SQL Warehouse | Used at query time |

`validate_model` retries up to 10× (3-min intervals) while the GPU endpoint provisions; `validate_install` retries up to 12× (3-min intervals) to allow services to stabilize.

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/databricks-industry-solutions/pixels.git
cd pixels

# 2. Build the bundle artifacts (wheel + OHIF tarball + vista3d tarball)
#    DAB sync includes dist/*.whl, dist/ohif.tar.gz, dist/vista3d.tar.gz —
#    they MUST exist before `bundle deploy` or apps and Vista3D will fail.
make build

# 3. Authenticate to your target workspace
databricks auth login --profile MY_WORKSPACE

# 4. Validate — override catalog if "main" is not accessible in your workspace
databricks bundle validate -t prod -p MY_WORKSPACE \
  --var catalog=my_catalog

# 5. Deploy the bundle
databricks bundle deploy -t prod -p MY_WORKSPACE --auto-approve \
  --var catalog=my_catalog

# 6. Run the install job
databricks bundle run pixels_install -t prod -p MY_WORKSPACE \
  --var catalog=my_catalog
```

> **Shortcut**: steps 2, 5, and 6 collapse into `make deploy` + `databricks bundle run`, since `make deploy` runs `build` and `render-dashboard` as Make dependencies and forwards `CATALOG`/`SCHEMA`/`PROFILE`/`TARGET`:
> ```bash
> make deploy SCHEMA=pixels CATALOG=my_catalog TARGET=prod PROFILE=MY_WORKSPACE
> databricks bundle run pixels_install -t prod -p MY_WORKSPACE --var catalog=my_catalog
> ```
> Use the explicit form above when you need to override bundle vars that `make deploy` doesn't forward (e.g. `lakebase_instance_name`).

> **Re-deploys**: run `make clean && make build` to rebuild artifacts after editing `src/dbx/pixels/`, the OHIF tree, or the Vista3D model.

> **Note**: Use `-t prod` for clean resource names (no `[dev username]` prefix).
> Use `-t dev` for iterative development and testing.

> **Tip**: To find available catalogs in your workspace, run:
> ```bash
> databricks catalogs list -p MY_WORKSPACE
> ```

## Configuration Variables

All variables have sensible defaults. Override with `--var key=value` on the CLI.

| Variable | Default | Description |
|----------|---------|-------------|
| `catalog` | `main` | Unity Catalog name |
| `schema` | `pixels` | Schema name |
| `table` | `${catalog}.${schema}.object_catalog` | Fully qualified table name |
| `volume_name` | `pixels_volume` | Volume name for DICOM files |
| `volume` | `${catalog}.${schema}.${volume_name}` | Fully qualified volume name |
| `serving_endpoint_name` | `pixels-monai-uc` | Model serving endpoint name |
| `scale_to_zero_enabled` | `true` | Whether the serving endpoint scales to zero when idle |
| `model_uc_name` | `${catalog}.${schema}.monai_pixels_model` | UC model path |
| `lakebase_instance_name` | `pixels-lakebase` | Lakebase instance name |
| `sql_warehouse` | Serverless Starter Warehouse | SQL warehouse (lookup by name) |

## What Gets Deployed

The install job runs 15 tasks. The deploy-apps work is split across `create_apps` (Apps shells) plus `deploy_prep`, `deploy_lakebase`, `deploy_gateway`, `deploy_viewer`, `deploy_grants` so packaging, infra, and per-app deploys can fan out and retry independently.

```
init_schema
├── dcm_ingest
│   ├── genie_space ─────────────────────────────────────────────┐
│   └── deploy_lakebase ─────────────────────────────────┐       │
├── create_apps ─────────────────────────────────────────┤       │
├── deploy_prep                                          │       │
│   └── deploy_gateway ──────────────────────────┐       │       │
├── register_model → deploy_endpoint             │       │       │
│                └── validate_model              │       │       │
│                    └── deploy_viewer ───────────┤       │       │
│                                         deploy_grants          │
│                                            ├── stow_processor ─┤
│                                            └──────────────┴────┴── post_install_update
│                                                                        └── validate_install
```

Per-task runtimes below are typical wall times on a fresh workspace. Critical-path total: ~30–45 min, dominated by `validate_model` waiting on the Vista3D GPU endpoint.

### Foundation

- **`init_schema`** (~1 min) — UC schema, volume, empty `object_catalog` table, UDFs (`extract_tags`, `extract_tag_value`), views (`object_catalog_unzip`, `instance_paths_vw`).
- **`dcm_ingest`** (~3–5 min) — catalogs demo DICOM files from `s3://hls-eng-data-public/dicom/landing_zone/*.zip` and writes metadata to `object_catalog`.

### Model serving (parallel branch)

- **`register_model`** (~3–5 min) — wraps Vista3D in an MLflow pyfunc and registers it in UC with a `champion` alias.
- **`deploy_endpoint`** (~1 min, plus 15–30 min async provisioning) — creates/updates GPU serving endpoint `pixels-monai-uc` (reads `scale_to_zero_enabled`).
- **`validate_model`** (up to 30 min) — polls and inferences against the endpoint; retries up to 10× at 3-min intervals while the GPU endpoint warms.

### Apps (parallel branch)

- **`create_apps`** (<1 min) — creates the Databricks Apps shells (`pixels-dicomweb`, `pixels-dicomweb-gateway`) so `deploy_grants` can grant on real app principals. The shells are populated by `deploy_gateway` / `deploy_viewer`.
- **`deploy_prep`** (~1–2 min) — uploads wheel + OHIF tarball to the UC Volume so apps can install them at startup. (OHIF `.wasm` files exceed DAB sync limits, so apps are deployed via SDK rather than DAB `apps:` sections.)
- **`deploy_lakebase`** (~5–10 min) — provisions the `pixels-lakebase` Postgres instance, creates schema/tables, and configures the Reverse ETL synced table.
- **`deploy_gateway`** (~1–2 min) — deploys `pixels-dicomweb-gateway` (DICOMweb QIDO/WADO/STOW server).
- **`deploy_viewer`** (~1–2 min) — deploys `pixels-dicomweb` (OHIF viewer + MONAI proxy). Depends on `validate_model` so the serving endpoint can be wired as an app resource.
- **`deploy_grants`** (<1 min) — grants UC + Lakebase permissions to apps and the running user.

### Genie + STOW

- **`genie_space`** (~5 min) — creates `dicom_tags` table, vector search endpoint + delta sync index (`databricks-bge-large-en`), VS function, and the Genie space via REST API.
- **`stow_processor`** (<1 min) — creates the STOW-RS processor job and grants permissions.

### Finalize

- **`post_install_update`** (<1 min) — applies dashboard parameter defaults and app thumbnails. Joins all three branches.
- **`validate_install`** (1 min on success, up to 36 min on cold start) — end-to-end health checks across all surfaces; retries up to 12× at 3-min intervals.

### Resources Created

- **Unity Catalog**: schema, volume, `object_catalog` table, `dicom_tags` table, UDFs, views
- **Lakebase**: `pixels-lakebase` instance with `dicom_frames`, `endpoint_metrics`, and `instance_paths` (Reverse ETL sync) tables
- **Apps**: `pixels-dicomweb` (OHIF viewer), `pixels-dicomweb-gateway` (DICOMweb server)
- **Model Serving**: `pixels-monai-uc` endpoint (Vista3D segmentation, GPU_MEDIUM)
- **Jobs**: STOW-RS processor job (created by `stow_processor`)
- **Dashboard**: "Pixels Medical Imaging Cohorts" Lakeview dashboard
- **Genie Space**: "Pixels - Genie" with vector search over DICOM tags
- **Vector Search**: `pixels_vs_endpoint` endpoint + `dicom_tags_vs` delta sync index

## Testing & Validation

The install job's final task `validate_install` runs end-to-end health checks across every deployed surface. For manual verification, run these checks against the deployed workspace.

### Pre-flight

```bash
# Profile + host shortcuts used in subsequent calls
TOKEN=$(databricks auth token -p MY_WORKSPACE | jq -r .access_token)
HOST=$(databricks auth env -p MY_WORKSPACE | jq -r .env.DATABRICKS_HOST)
```

### 1. Dashboard

```bash
# Find the Pixels dashboard
databricks api get /api/2.0/lakeview/dashboards -p MY_WORKSPACE \
  | jq '.dashboards[] | select(.display_name | contains("Pixels")) | {dashboard_id, display_name, lifecycle_state}'
```

Expected: `lifecycle_state: ACTIVE`, 3 pages, 4 datasets.

### 2. Genie Space

```bash
databricks api post /api/2.0/genie/spaces/<space_id>/start-conversation -p MY_WORKSPACE \
  --json '{"content": "How many DICOM studies are there?"}'
# Then poll the returned message_id until status: COMPLETED
```

Expected answer: **9 DICOM studies**.

### 3. Viewer App (`pixels-dicomweb`)

```bash
APP_URL=$(databricks apps get pixels-dicomweb -p MY_WORKSPACE --output json | jq -r .url)
open "$APP_URL/ohif/monai-label?StudyInstanceUIDs=1.2.156.14702.1.1000.16.0.20200311113603875"
```

Expected: OHIF viewer loads the COVID lung CT in MONAI Label mode.

### 3b. Viewer App — MONAI Proxy

```bash
curl -s "$APP_URL/api/monai/"
```

Expected: JSON with `name`, `version`, `labels`, `models` from MONAI Label v0.8.5 (Vista3D, 132 segments). Validates the viewer-to-serving proxy end-to-end.

### 4. Gateway App (`pixels-dicomweb-gateway`)

```bash
GW_URL=$(databricks apps get pixels-dicomweb-gateway -p MY_WORKSPACE --output json | jq -r .url)
curl -s "$GW_URL/health"
curl -s "$GW_URL/api/dicomweb/studies?limit=2"
```

Expected: `/health` OK, `/api/dicomweb/studies` returns JSON with study UIDs. Note the path prefix is `/api/dicomweb/`, **not** `/dicomweb/`.

### 5. Model Serving — Info

```bash
curl -s "$HOST/serving-endpoints/pixels-monai-uc/invocations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"dataframe_records": [{"input": {"action": "info"}}]}'
```

Expected: MONAI Label v0.8.5, Vista3D, 132 anatomical segments, <1s response when warm.

### 6. Model Serving — Inference

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

Labels: lung(20), lung_tumor(23), left_upper(28), left_lower(29), right_upper(30), right_middle(31), right_lower(32), airway(132). Expected: ~30–60s, returns `file_path` and `metrics`.

### 7. Log Checks

```bash
# Query history (GET only — do NOT POST)
curl -s "$HOST/api/2.0/sql/history/queries?max_results=50" \
  -H "Authorization: Bearer $TOKEN"

# Model serving build/runtime logs (entity name from endpoint config)
curl -s "$HOST/api/2.0/serving-endpoints/pixels-monai-uc/served-models/<entity_name>/logs" \
  -H "Authorization: Bearer $TOKEN"

# App logs
databricks apps logs pixels-dicomweb-gateway -p MY_WORKSPACE
databricks apps logs pixels-dicomweb -p MY_WORKSPACE
```

Known benign warnings in serving logs: CloudPickle version mismatch, missing `HF_TOKEN`, PyTorch affine dim mismatch.

## Optional Steps

After the install job completes:

1. **Governed Tags** (optional) — Set up Unity Catalog tags for PHI governance if needed.

## Known Limitations

- **OHIF app .wasm files** — The OHIF viewer contains `.wasm` files >10MB (154MB total) which breaks DAB's workspace filesystem sync. Apps are deployed via SDK calls inside notebook tasks rather than DAB `apps:` sections.
- **Lakebase role race condition** — The service principal role grant can fail immediately after Lakebase instance creation. Task 02 has `max_retries: 1` to handle this automatically.
- **Vista3D serving endpoint** — The serving endpoint uses GPU infrastructure managed by Model Serving; no user-managed GPU cluster is required. Initial provisioning takes 15–30 minutes.

## Troubleshooting

**`init_env()` fails with "table does not exist"**
Check that `00_init_schema` succeeded. If running notebooks interactively outside the job, ensure the table has been created first (run `00-init-schema.ipynb`).

**Schema creation fails with "Catalog 'main' is not accessible"**
The default catalog `main` may not exist or be accessible in your workspace. Override with `--var catalog=<your_catalog>` using a managed catalog visible in your workspace:
```bash
databricks catalogs list -p MY_WORKSPACE
```

**Vista3D endpoint fails to become ready**
The GPU serving endpoint may take 15–30 min to provision. Tasks 03c and 10 retry automatically. Check Model Serving UI for endpoint status and errors.

**Apps fail with "user token passthrough feature is not enabled"**
The workspace needs the Databricks Apps user token passthrough feature flag enabled at the org level. Contact your workspace admin or Databricks account team.

**Apps fail to create**
Ensure Databricks Apps is enabled on your workspace. Check that the `dbx.pixels` package is installed (it provides the app source code at runtime).

**Genie space creation returns 403**
The Genie API requires workspace admin or appropriate permissions. Ensure the running user has access to create Genie spaces.

**Bundle validate fails on sql_warehouse lookup**
The default lookup targets "Serverless Starter Warehouse". If your warehouse has a different name, override with the warehouse ID:
```bash
databricks bundle validate -t prod -p MY_WORKSPACE \
  --var catalog=my_catalog \
  --var sql_warehouse=<warehouse-id>
```

**`pip install` fails on serverless with immutable package constraints**
Some packages (pandas, numpy, pyarrow) are provided by the serverless runtime and cannot be overridden. The `requirements.txt` uses `>=` for runtime-provided packages to avoid conflicts.

**Bundle deploy uploads a stale wheel or skips OHIF/Vista3D**
DAB sync includes `dist/*.whl`, `dist/ohif.tar.gz`, and `dist/vista3d.tar.gz`. If these are missing or stale, run `make clean && make build` before re-deploying.

### Genie returns wrong answers or unhelpful SQL

Open the Genie space and run the slash command **`/diagnose`** in the chat panel. It returns the parsed intent, the SQL Genie generated, the warehouse it ran against, and the raw error (if any). Copy that output when filing a bug — it tells you whether the issue is in the data, the SQL, or the Genie context.

### Filing a bug

If you hit something not covered above, open an issue at **[github.com/databricks-industry-solutions/pixels/issues](https://github.com/databricks-industry-solutions/pixels/issues)**. Use the **Bug** template and include:

- Workspace target, profile, target (`-t dev` / `-t prod`), and the `--var` overrides you used
- Failing task name (e.g., `deploy_lakebase`) and the run URL from `databricks bundle run`
- Relevant log excerpts: task driver logs, app logs (`databricks apps logs <app_name>`), serving build logs, or `/diagnose` output for Genie issues
- `databricks --version` and CLI profile host

## Teardown

To remove all deployed resources:
```bash
databricks bundle destroy -t prod -p MY_WORKSPACE --auto-approve \
  --var catalog=my_catalog
```

> **Note**: This removes the UC schema, volume, job, and dashboard. Lakebase instances, apps, model serving endpoints, vector search endpoints, and Genie spaces are created via SDK/API and must be deleted separately if desired.

## Targets

- **dev** (default): Development mode — resource names prefixed with `[dev username]`
- **prod**: Production mode — clean resource names for stable deployments

```bash
# Deploy to production
databricks bundle deploy -t prod -p MY_WORKSPACE
databricks bundle run pixels_install -t prod -p MY_WORKSPACE
```
