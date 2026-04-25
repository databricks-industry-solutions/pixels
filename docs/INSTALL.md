# Pixels Installation Guide

Deploy the complete Pixels Medical Imaging stack using Databricks Asset Bundles (DAB).

## Prerequisites

### Local Tools

- **Git** — to clone the repository
- **Python 3.10+** — required by the Databricks CLI
- **Databricks CLI** >= v0.230 — install via:
  ```bash
  # macOS / Linux
  brew tap databricks/tap && brew install databricks

  # Or via pip
  pip install databricks-cli

  # Or direct binary download
  # See https://docs.databricks.com/en/dev-tools/cli/install.html
  ```

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
| Init schema (task 00) | Serverless notebook | Creates UC objects, ~1 min |
| Demo ingest (task 01) | Serverless notebook | DICOM catalog from S3, ~4 min |
| Deploy apps (task 02) | Serverless notebook | Lakebase + apps via SDK, ~10 min |
| Register model (task 03a) | Serverless notebook | Wraps Vista3D in MLflow, registers in UC |
| Deploy endpoint (task 03b) | Serverless notebook | Creates GPU serving endpoint via REST API |
| Validate model (task 03c) | Serverless notebook | Test inference, retries up to 10x (3-min intervals) |
| Genie space (task 04) | Serverless notebook | Vector search + Genie, ~5 min |
| Validate all (task 10) | Serverless notebook | End-to-end service health checks, retries up to 12x |
| Runtime (apps, dashboard, Genie) | Serverless SQL Warehouse | Used at query time |
| Lakebase instance | Auto-created | Min 0.5 CU / Max 2.0 CU, autoscaling |

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/databricks-industry-solutions/pixels.git
cd pixels

# 2. Authenticate to your target workspace
databricks auth login --profile MY_WORKSPACE

# 3. Validate — override catalog if "main" is not accessible in your workspace
databricks bundle validate -t prod -p MY_WORKSPACE \
  --var catalog=my_catalog

# 4. Deploy the bundle
databricks bundle deploy -t prod -p MY_WORKSPACE --auto-approve \
  --var catalog=my_catalog

# 5. Run the install job
databricks bundle run pixels_install -t prod -p MY_WORKSPACE \
  --var catalog=my_catalog
```

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

The install job runs 8 tasks. Tasks `01_dcm_ingest` and `03a_register_model` run in parallel after `00_init_schema`:

```
00_init_schema
    ├── 01_dcm_ingest ────────────────────┐
    │       └── 04_genie_space ───────────┐│
    └── 03a → 03b → 03c ─────────────────┤│
                                          │└── 02_deploy_apps ──┐
                                          └────────────────────┴── 10_validate
```

**Task 00 — Init Schema**: Creates UC schema, volume, empty `object_catalog` table, UDFs (`extract_tags`, `extract_tag_value`), and views (`object_catalog_unzip`, `instance_paths_vw`).

**Task 01 — Demo Data Ingest**: Catalogs demo DICOM files from `s3://hls-eng-data-public/dicom/landing_zone/*.zip`, extracts metadata, saves to `object_catalog` table.

**Task 03a — Register Model** (parallel with 01): Wraps Vista3D in an MLflow pyfunc model and registers it in Unity Catalog with a `champion` alias. Only needs the schema/volume from task 00.

**Task 03b — Deploy Endpoint**: Creates (or updates) the GPU model serving endpoint `pixels-monai-uc`. Reads `scale_to_zero_enabled` from the bundle variable.

**Task 03c — Validate Model**: Sends a test inference request to the serving endpoint. Retries up to 10 times (3-min intervals) while the GPU endpoint provisions (~15–30 min).

**Task 02 — Deploy Apps** (after 03c + 01): Creates Lakebase instance, sets up Lakebase schema/tables, creates Reverse ETL synced table, deploys `pixels-dicomweb-gateway` and `pixels-dicomweb` apps via SDK, grants UC + Lakebase permissions. Runs after model serving is ready so the serving endpoint can be wired as an app resource.

**Task 04 — Genie Space** (after 01): Creates `dicom_tags` table from NDJSON, creates vector search endpoint + delta sync index using `databricks-bge-large-en` embeddings, creates VS function, creates Genie space via REST API.

**Task 10 — Validate** (after 02 + 04): End-to-end health checks across all deployed services. Retries up to 12 times (3-min intervals) to allow services to stabilize.

### Resources Created

- **Unity Catalog**: schema, volume, `object_catalog` table, `dicom_tags` table, UDFs, views
- **Lakebase**: `pixels-lakebase` instance with `dicom_frames`, `endpoint_metrics`, and `instance_paths` (Reverse ETL sync) tables
- **Apps**: `pixels-dicomweb` (OHIF viewer), `pixels-dicomweb-gateway` (DICOMweb server)
- **Model Serving**: `pixels-monai-uc` endpoint (Vista3D segmentation, GPU_MEDIUM)
- **Dashboard**: "Pixels Medical Imaging Cohorts" Lakeview dashboard
- **Genie Space**: "Pixels - Genie" with vector search over DICOM tags
- **Vector Search**: `pixels_vs_endpoint` endpoint + `dicom_tags_vs` delta sync index

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
