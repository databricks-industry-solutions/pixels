# Pixels Installation Guide

Deploy the complete Pixels Medical Imaging stack using Databricks Asset Bundles (DAB).

## Prerequisites

- Databricks workspace with **Unity Catalog** enabled
- **Serverless compute** enabled (for notebooks and SQL warehouse)
- **GPU compute** availability (`g5.2xlarge` or equivalent for Vista3D model serving)
- **Databricks Apps** enabled on workspace
- **Lakebase** (Postgres) feature enabled
- **Vector Search** enabled (for Genie space)
- **Model Serving** with GPU workload types enabled
- [Databricks CLI](https://docs.databricks.com/dev-tools/cli/install.html) >= v0.230 installed locally

## Compute Requirements

| Component | Compute Type | Details |
|-----------|-------------|---------|
| Init schema (task 00) | Serverless notebook | Creates UC objects, ~1 min |
| Demo ingest (task 01) | Serverless notebook | DICOM catalog from S3, ~10 min |
| Deploy apps (task 02) | Serverless notebook | Lakebase + apps via SDK, ~10 min |
| Vista3D model (task 03) | GPU single-node cluster | DBR 16.4 LTS ML, g5.2xlarge, ~30 min |
| Genie space (task 04) | Serverless notebook | Vector search + genie, ~5 min |
| Runtime (apps, dashboard, genie) | Serverless SQL Warehouse | Used at query time |
| Lakebase instance | Auto-created | Min 0.5 CU / Max 2.0 CU |

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/databricks-industry-solutions/pixels.git
cd pixels

# 2. Configure variables (optional — defaults to dmoore.pixels)
databricks bundle validate -t dev \
  --var catalog=my_catalog \
  --var schema=my_schema

# 3. Deploy the bundle
databricks bundle deploy -t dev

# 4. Run the install job
databricks bundle run pixels_install -t dev
```

## Configuration Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `catalog` | `dmoore` | Unity Catalog name |
| `schema` | `pixels` | Schema name |
| `table` | `${catalog}.${schema}.object_catalog` | Fully qualified table name |
| `volume_name` | `pixels_volume` | Volume name for DICOM files |
| `volume` | `${catalog}.${schema}.${volume_name}` | Fully qualified volume name |
| `serving_endpoint_name` | `pixels-monai-uc` | Model serving endpoint name |
| `model_uc_name` | `${catalog}.${schema}.monai_pixels_model` | UC model path |
| `lakebase_instance_name` | `pixels-lakebase` | Lakebase instance name |
| `sql_warehouse` | Serverless Starter Warehouse | SQL warehouse (lookup) |

## What Gets Deployed

The install job runs 5 tasks in dependency order:

```
                                  ┌── 02_deploy_apps (serverless)
00_init_schema ── 01_dcm_ingest ──┼── 03_vista3d_model (GPU)
                                  └── 04_genie_space (serverless)
```

**Task 00 — Init Schema**: Creates UC catalog, schema, volume, and empty `object_catalog` table.

**Task 01 — Demo Data Ingest**: Catalogs demo DICOM files from `s3://hls-eng-data-public/dicom/landing_zone/*.zip`, extracts metadata, saves to `object_catalog` table. Runs first so data is available for apps and genie.

**Task 02 — Deploy Apps**: Creates Lakebase instance, sets up Lakebase schema/tables, deploys `pixels-dicomweb-gateway` and `pixels-dicomweb` apps via SDK, grants UC + Lakebase permissions to app service principals.

**Task 03 — Vista3D Model Serving**: Installs MONAI, wraps Vista3D in MLflow model, registers in UC, creates GPU serving endpoint `pixels-monai-uc`.

**Task 04 — Genie Space**: Creates `dicom_tags` table from NDJSON, creates vector search endpoint + delta sync index, creates VS function, creates Genie space via REST API.

### Resources Created

- **Unity Catalog**: schema, volume, `object_catalog` table, `dicom_tags` table
- **Lakebase**: `pixels-lakebase` instance with `dicom_frames`, `instance_paths`, `endpoint_metrics` tables
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
- **Vista3D requires GPU** — The model serving task requires a GPU cluster (`g5.2xlarge`), not serverless-compatible.
- **Reverse ETL sync** — Not yet available via SDK; requires manual UI step (see above).

## Troubleshooting

**`init_env()` fails with "table does not exist"**
Task 00 must complete before tasks 01/03. Check that `00_init_schema` succeeded in the job run.

**Vista3D task fails with quota error**
GPU instances (`g5.2xlarge`) may need quota approval. Check your workspace's compute policies and cloud quotas.

**Apps fail to create**
Ensure Databricks Apps is enabled on your workspace. Check that the `dbx.pixels` package is installed (it provides the app source code at runtime).

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
