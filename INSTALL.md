# Pixels Installation Guide

Deploy the complete Pixels Medical Imaging stack using Databricks Asset Bundles (DAB).

## Prerequisites

- Databricks workspace with **Unity Catalog** enabled
- **Serverless compute** enabled (for notebooks and SQL warehouse)
- **Databricks Apps** enabled on workspace, including **user token passthrough** feature flag (org-level)
- **Lakebase** (Postgres) feature enabled
- **Vector Search** enabled (for Genie space)
- **Model Serving** with GPU workload types enabled
- [Databricks CLI](https://docs.databricks.com/dev-tools/cli/install.html) >= v0.230 installed locally

## Compute Requirements

All install tasks run on **serverless compute**. No GPU clusters are required.

| Component | Compute Type | Details |
|-----------|-------------|---------|
| Init schema (task 00) | Serverless notebook | Creates UC objects, ~1 min |
| Demo ingest (task 01) | Serverless notebook | DICOM catalog from S3, ~10 min |
| Deploy apps (task 02) | Serverless notebook | Lakebase + apps via SDK, ~10 min |
| Register model (task 03a) | Serverless notebook | Wraps Vista3D in MLflow, registers in UC |
| Deploy endpoint (task 03b) | Serverless notebook | Creates GPU serving endpoint via REST API |
| Validate model (task 03c) | Serverless notebook | Test inference, retries up to 10x |
| Genie space (task 04) | Serverless notebook | Vector search + genie, ~5 min |
| Validate all (task 10) | Serverless notebook | End-to-end service health checks |
| Runtime (apps, dashboard, genie) | Serverless SQL Warehouse | Used at query time |
| Lakebase instance | Auto-created | Min 0.5 CU / Max 2.0 CU |

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/databricks-industry-solutions/pixels.git
cd pixels

# 2. Authenticate to your target workspace
databricks auth login --profile MY_WORKSPACE

# 3. Validate — override catalog/schema for your workspace
#    (the default catalog "main" may not be accessible)
DATABRICKS_CONFIG_PROFILE=MY_WORKSPACE \
  databricks bundle validate -t prod \
  --var catalog=my_catalog \
  --var schema=my_schema

# 4. Deploy the bundle
DATABRICKS_CONFIG_PROFILE=MY_WORKSPACE \
  databricks bundle deploy -t prod --auto-approve \
  --var catalog=my_catalog \
  --var schema=my_schema

# 5. Run the install job
DATABRICKS_CONFIG_PROFILE=MY_WORKSPACE \
  databricks bundle run pixels_install -t prod \
  --var catalog=my_catalog \
  --var schema=my_schema
```

> **Note**: Use `-t prod` for clean resource names (no `[dev username]` prefix).
> Use `-t dev` for iterative development and testing.

## Configuration Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `catalog` | `main` | Unity Catalog name |
| `schema` | `pixels` | Schema name |
| `table` | `${catalog}.${schema}.object_catalog` | Fully qualified table name |
| `volume_name` | `pixels_volume` | Volume name for DICOM files |
| `volume` | `${catalog}.${schema}.${volume_name}` | Fully qualified volume name |
| `serving_endpoint_name` | `pixels-monai-uc` | Model serving endpoint name |
| `model_uc_name` | `${catalog}.${schema}.monai_pixels_model` | UC model path |
| `lakebase_instance_name` | `pixels-lakebase` | Lakebase instance name |
| `sql_warehouse` | Serverless Starter Warehouse | SQL warehouse (lookup) |

## What Gets Deployed

The install job runs 8 tasks in dependency order (all serverless):

```
                                  ┌── 02_deploy_apps ──────────────────────┐
00_init_schema ── 01_dcm_ingest ──┼── 03a ── 03b ── 03c (model serving) ──┼── 10_validate
                                  └── 04_genie_space ──────────────────────┘
```

**Task 00 — Init Schema**: Creates UC schema, volume, empty `object_catalog` table, UDFs (`extract_tags`, `extract_tag_value`), and views (`object_catalog_unzip`, `instance_paths_vw`).

**Task 01 — Demo Data Ingest**: Catalogs demo DICOM files from `s3://hls-eng-data-public/dicom/landing_zone/*.zip`, extracts metadata, saves to `object_catalog` table. Runs first so data is available for apps and genie.

**Task 02 — Deploy Apps**: Creates Lakebase instance, sets up Lakebase schema/tables, deploys `pixels-dicomweb-gateway` and `pixels-dicomweb` apps via SDK, grants UC + Lakebase permissions to app service principals.

**Task 03a — Register Model**: Wraps Vista3D in an MLflow pyfunc model and registers it in Unity Catalog.

**Task 03b — Deploy Endpoint**: Creates (or updates) the GPU model serving endpoint `pixels-monai-uc` via REST API.

**Task 03c — Validate Model**: Sends a test inference request to the serving endpoint. Retries up to 10 times (3-min intervals) while the endpoint scales up.

**Task 04 — Genie Space**: Creates `dicom_tags` table from NDJSON, creates vector search endpoint + delta sync index, creates VS function, creates Genie space via REST API.

**Task 10 — Validate**: End-to-end health checks across all deployed services (apps, model serving, Lakebase, vector search, Genie). Retries up to 12 times (3-min intervals) to allow services to stabilize.

### Resources Created

- **Unity Catalog**: schema, volume, `object_catalog` table, `dicom_tags` table, UDFs, views
- **Lakebase**: `pixels-lakebase` instance with `dicom_frames` and `endpoint_metrics` tables (`instance_paths` created via Reverse ETL sync — see Manual Steps)
- **Apps**: `pixels-dicomweb` (OHIF viewer), `pixels-dicomweb-gateway` (DICOMweb server)
- **Model Serving**: `pixels-monai-uc` endpoint (Vista3D segmentation)
- **Dashboard**: "Pixels Medical Imaging Cohorts" Lakeview dashboard
- **Genie Space**: "Pixels - Genie" with vector search over DICOM tags

## Manual Steps

After the install job completes:

1. **Reverse ETL Synced Table** — Database sync with Postgres autoscaling is not yet available via the Python SDK. Create the synced table via the Databricks UI:
   - Navigate to **Catalog** > `{catalog}.{schema}.instance_paths_vw`
   - Click **Create** > **Synced table**
   - Destination: your Lakebase instance (`pixels-lakebase`)
   - Target table name: `instance_paths`
   - Sync mode: Snapshot
   - Primary key: `local_path`

   See: [Create a synced table (UI)](https://docs.databricks.com/aws/en/oltp/projects/reverse-etl#create-a-synced-table-ui)

2. **Governed Tags** (optional) — Set up Unity Catalog tags for PHI governance if needed.

## Known Limitations

- **OHIF app .wasm files** — The OHIF viewer contains `.wasm` files >10MB (154MB total) which breaks DAB's workspace filesystem sync. Apps are deployed via SDK calls inside notebook tasks rather than DAB `apps:` sections.
- **Vista3D serving endpoint** — The serving endpoint uses GPU infrastructure managed by Model Serving; no user-managed GPU cluster is required.
- **Reverse ETL sync** — Not yet available via SDK; requires manual UI step (see above).

## Troubleshooting

**`init_env()` fails with "table does not exist"**
Check that `00_init_schema` succeeded. If running notebooks interactively outside the job, ensure the table has been created first (run `00-init-schema.ipynb`).

**Vista3D endpoint fails to become ready**
The GPU serving endpoint may take 15–30 min to provision. Tasks 03c and 10 retry automatically. Check Model Serving UI for endpoint status and errors.

**Apps fail with "user token passthrough feature is not enabled"**
The workspace needs the Databricks Apps user token passthrough feature flag enabled at the org level. Contact your workspace admin or Databricks account team to enable this for your org ID.

**Apps fail to create**
Ensure Databricks Apps is enabled on your workspace. Check that the `dbx.pixels` package is installed (it provides the app source code at runtime).

**Schema creation fails with "Catalog 'main' is not accessible"**
The default catalog `main` may not exist or be accessible in your workspace. Override with `--var catalog=<your_catalog>` using a managed catalog visible in your workspace (`databricks catalogs list`).

**Genie space creation returns 403**
The Genie API requires workspace admin or appropriate permissions. Ensure the running user has access to create Genie spaces.

**Bundle validate fails on sql_warehouse lookup**
The default lookup targets "Serverless Starter Warehouse". Override with `--var sql_warehouse=<warehouse-id>` if your warehouse has a different name.

## Targets

- **dev** (default): Development mode, suitable for testing
- **prod**: Production mode, for stable deployments

```bash
# Deploy to production
databricks bundle deploy -t prod
databricks bundle run pixels_install -t prod
```
