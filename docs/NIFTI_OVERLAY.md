# NIfTI Segmentation Overlay - Architecture and Developer Reference

This document describes the read-only NIfTI segmentation overlay feature
that lets the OHIF viewer list and render `.nii.gz` segmentation masks for
a given DICOM (study, series) pair.

It is the companion to `[DICOMWEB.md](DICOMWEB.md)` which covers the core
DICOMweb (QIDO/WADO/STOW) surface; this document focuses exclusively on
the NIfTI overlay extension that sits on top of that gateway.

---

## Table of Contents

1. [Overview](#1-overview)
2. [End-to-End Architecture](#2-end-to-end-architecture)
3. [Data Plane Components](#3-data-plane-components)
4. [Browser / OHIF Extension](#4-browser--ohif-extension)
5. [Viewer App Reverse Proxy](#5-viewer-app-reverse-proxy)
6. [Gateway App Routes](#6-gateway-app-routes)
7. [HTTP API Reference](#7-http-api-reference)
8. [Delta Table Schema](#8-delta-table-schema)
9. [UC Volume Layout](#9-uc-volume-layout)
10. [Authentication and Authorization](#10-authentication-and-authorization)
11. [Configuration Reference](#11-configuration-reference)
12. [Deployment](#12-deployment)
13. [Operational Notes](#13-operational-notes)
14. [Troubleshooting](#14-troubleshooting)
15. [File Inventory](#15-file-inventory)

---

## 1. Overview

The NIfTI overlay feature lets a clinician open a DICOM series in the OHIF
viewer and load one or more pre-computed `.nii.gz` segmentation masks
(produced by Vista3D, MONAI Label, manual contouring, etc.) as labelmaps
overlaid on the DICOM volume.

Key properties:


| Property             | Value                                                                      |
| -------------------- | -------------------------------------------------------------------------- |
| Direction            | Read-only — the gateway never writes overlays; an external pipeline does   |
| Storage              | Raw `.nii.gz` files on a UC Volume + metadata in a Delta table             |
| Discovery            | `GET /api/dicomweb/nifti/related?study=...&series=...`                     |
| Retrieval            | `GET /api/dicomweb/nifti/fetch?study=...&series=...&id=...`                |
| Auth                 | Same OBO chain as QIDO/WADO — UC ACLs apply on both Delta table and Volume |
| Feature gate         | `NIFTI_SEGMENTATION_TABLE` env var (set by the install widget)             |
| Append-only contract | New rows for every change; existing rows are never UPDATED or DELETED      |
| Liquid clustering    | `CLUSTER BY (study_instance_uid, series_instance_uid)`                     |


When the feature gate is unset, both routes return HTTP 404 with a clear
"feature disabled" detail and the rest of the gateway is unaffected.

---

## 2. End-to-End Architecture

```
+-------------------------------------------------------------------+
|  Browser - OHIF SPA                                               |
|                                                                   |
|  @ohif/extension-nifti-segmentation                               |
|    NiftiOverlayPanel  -> lists overlays for active series         |
|    NiftiOverlayClient -> axios GET /related, GET /fetch           |
|    parseNifti         -> nifti-reader-js + pako (gunzip + parse)  |
|    alignNiftiToDicom  -> header check / VTK.js resample           |
|    injectLabelmap     -> Cornerstone segmentationService          |
+-------------------------------+-----------------------------------+
                                | HTTPS (Bearer token from OHIF
                                |  userAuthenticationService)
                                v
+-------------------------------------------------------------------+
|  pixels-dicomweb (Viewer App)                                     |
|    catch-all proxy: /api/dicomweb/{path:path} -> Gateway          |
|    httpx HTTP/2 client, X-Forwarded-Access-Token -> Bearer        |
+-------------------------------+-----------------------------------+
                                | HTTP/2
                                v
+-------------------------------------------------------------------+
|  pixels-dicomweb-gateway (Gateway App)                            |
|                                                                   |
|  FastAPI routes (app.py)                                          |
|    GET /api/dicomweb/nifti/related  -> nifti_related()            |
|    GET /api/dicomweb/nifti/fetch    -> nifti_fetch()              |
|                                                                   |
|  utils/handlers/_nifti.py                                         |
|    1. _resolve_table()       feature gate check                   |
|    2. resolve_user_token()   OBO Bearer (same as QIDO)            |
|    3. queries_nifti.build_*  parameterized SQL builders           |
|    4. DatabricksSQLClient    execute against SQL Warehouse        |
|    5. _stream_volume_file    GET /api/2.0/fs/files/<path>         |
|                                                                   |
+--------+----------------------------+-----------------------------+
         |                            |
         v                            v
+----------------------+   +----------------------------------------+
| Databricks SQL       |   | Databricks Files API                   |
| Warehouse            |   | (UC Volume)                            |
|                      |   |                                        |
| {catalog}.{schema}   |   | /Volumes/{catalog}/{schema}/{volume}/  |
|   .nifti_segmenta-   |   |   nifti/.../<overlay>.nii.gz           |
|   tions (Delta)      |   |                                        |
+----------------------+   +----------------------------------------+
```

The gateway is a thin orchestration layer: every overlay byte the browser
receives travels Volumes -> Files API -> gateway streaming response ->
viewer reverse proxy -> browser, never landing on the gateway disk.

---

## 3. Data Plane Components


| Layer               | Component                                          | Source location                                               |
| ------------------- | -------------------------------------------------- | ------------------------------------------------------------- |
| Storage (raw bytes) | UC Volume `.nii.gz` files                          | `/Volumes/<catalog>/<schema>/<volume>/...`                    |
| Storage (metadata)  | Delta table `nifti_segmentations`                  | `src/dbx/pixels/resources/sql/CREATE_NIFTI_SEGMENTATIONS.sql` |
| SQL builders        | `build_find_for_series`, `build_resolve_for_fetch` | `apps/dicom-web-gateway/utils/queries_nifti.py`               |
| HTTP handlers       | `nifti_related`, `nifti_fetch`                     | `apps/dicom-web-gateway/utils/handlers/_nifti.py`             |
| FastAPI routes      | `GET /api/dicomweb/nifti/{related,fetch}`          | `apps/dicom-web-gateway/app.py`                               |
| Reverse proxy       | `/api/dicomweb/{path:path}` catch-all              | `apps/dicom-web/app.py`                                       |
| OHIF extension      | `@ohif/extension-nifti-segmentation`               | Pre-built into `apps/dicom-web/ohif/9605.bundle.*.js`         |
| OHIF panel config   | `niftiOverlay` block                               | `apps/dicom-web/ohif/app-config.js`                           |
| Bundle variable     | `nifti_segmentation_table`                         | `databricks.yml`                                              |
| Install widget      | "7.0 (optional) UC Delta table for NIfTI..."       | `install/deploy-gateway.ipynb`                                |
| App env wiring      | `NIFTI_SEGMENTATION_TABLE`                         | `apps/dicom-web-gateway/app-config.yml` -> `app.yml`          |


---

## 4. Browser / OHIF Extension

The viewer ships with a pre-built `@ohif/extension-nifti-segmentation`
extension baked into the OHIF static bundles
(`apps/dicom-web/ohif/9605.bundle.*.js`). The configuration block lives in
`apps/dicom-web/ohif/app-config.js` under `window.config.niftiOverlay`.

### Extension responsibilities


| Component                  | Role                                                                                               |
| -------------------------- | -------------------------------------------------------------------------------------------------- |
| `NiftiOverlayPanel.tsx`    | Right-side panel listing available overlays for the active series; load / resample / toggle UI     |
| `NiftiOverlayClient.ts`    | Browser HTTP client (axios). Resolves base URL + injects auth headers. Handles `related` + `fetch` |
| `parseNifti`               | Decompresses (`pako`) and parses NIfTI header + voxel data via `nifti-reader-js`                   |
| `alignNiftiToDicom`        | Header-equality fast path, then VTK.js resample fallback when the affine differs                   |
| `injectLabelmap`           | Writes the aligned voxel array into the Cornerstone `segmentationService` labelmap                 |
| `loadNiftiOverlay` command | Glue: `client.fetch -> parseNifti -> alignNiftiToDicom -> injectLabelmap`                          |


### Base URL resolution

`NiftiOverlayClient.resolveBaseUrl()` resolves in this order:

1. Explicit `window.config.niftiOverlay.baseUrl` (if set).
2. `qidoRoot` of the **active** OHIF data source (lazy resolution per call).
3. Throws if neither is present.

In the standard Pixels deployment the active data source is
`pixelsdicomweb` whose `qidoRoot` is `{DICOMWEB_ROOT}` (substituted to
`/api/dicomweb` by the viewer's `TokenMiddleware`). The full URL becomes
`<viewer-app>/api/dicomweb/nifti/{related|fetch}` which the catch-all
proxy forwards to the gateway untouched.

### Auth header

When `niftiOverlay.auth.mode === 'inherit'` (the default), every request
inherits the header object returned by
`servicesManager.services.userAuthenticationService.getAuthorizationHeader()`,
which the `DatabricksPixelsDicom` data source populates with
`{ Authorization: 'Bearer <token>' }`. The token is the same one OHIF uses
for QIDO/WADO calls, so UC permissions are evaluated identically across
all routes.

### Alignment behaviour

The extension supports three modes:


| Mode              | Trigger                                                                                    | Cost                                                   |
| ----------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| Fast path         | NIfTI affine matches DICOM affine within tolerance (`spacingTolerance`, `originTolerance`) | Negligible — direct copy of the voxel buffer           |
| Assume DICOM grid | `alignment.assumeDicomGrid: true` (or panel toggle)                                        | Negligible — voxel array written as-is, header ignored |
| Resample          | Fast path fails and `assumeDicomGrid` is false                                             | Slow — VTK.js trilinear resample on the GPU/CPU        |


`alignment.promptOnResample` shows a confirmation dialog before kicking
off the slow path so users do not get blocked unexpectedly.

---

## 5. Viewer App Reverse Proxy

`apps/dicom-web/app.py` registers a single catch-all route that forwards
**every** `/api/dicomweb/`* request to the gateway:

```python
@app.api_route(
    "/api/dicomweb/{path:path}",
    methods=["GET", "POST", "PUT", "DELETE"],
    tags=["DICOMweb Proxy"],
)
```

The proxy:

1. Strips `host`, `content-length`, and `transfer-encoding` from inbound headers.
2. Promotes `X-Forwarded-Access-Token` -> `Authorization: Bearer <token>` so the gateway sees a valid OBO token.
3. Adds `User-Agent: DatabricksPixels/<version>_dicomweb` for gateway-side identification.
4. Returns a `StreamingResponse` wrapping `resp.aiter_bytes()` — overlay bytes flow straight through without buffering on the viewer.

The NIfTI routes therefore inherit all viewer-side proxy behaviour
(HTTP/2, keepalive pool, gzip handling) **for free** — nothing in the
viewer needs to be aware of them.

---

## 6. Gateway App Routes

Two read-only endpoints, registered in `apps/dicom-web-gateway/app.py`:

```python
@app.get("/api/dicomweb/nifti/related", tags=["NIfTI Overlay"])
def get_nifti_related(
    request: Request,
    study: str = Query(..., description="StudyInstanceUID"),
    series: str = Query(..., description="SeriesInstanceUID"),
):
    return nifti_related(request, study, series)


@app.get("/api/dicomweb/nifti/fetch", tags=["NIfTI Overlay"])
def get_nifti_fetch(
    request: Request,
    study: str = Query(..., description="StudyInstanceUID"),
    series: str = Query(..., description="SeriesInstanceUID"),
    id: str = Query(..., description="Overlay id returned by /nifti/related"),
):
    return nifti_fetch(request, study, series, id)
```

Both delegate to `utils/handlers/_nifti.py`. The handler module:


| Step | Function                                            | Notes                                                                                                   |
| ---- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 1    | `_resolve_table()`                                  | Reads `NIFTI_SEGMENTATION_TABLE`; raises HTTP 404 if unset (feature gate)                               |
| 2    | `resolve_user_token(request)` (OBO)                 | Same precedence as QIDO: `X-Forwarded-Access-Token` -> `X-Pixels-User-Token` -> `Authorization: Bearer` |
| 3    | `build_find_for_series` / `build_resolve_for_fetch` | Parameterized SQL via `IDENTIFIER()` clause for the table name                                          |
| 4    | `DatabricksSQLClient.execute`                       | Same pooled connection class used by every other DICOMweb route                                         |
| 5    | `_stream_volume_file`                               | `GET /api/2.0/fs/files/<path>` with the same Bearer token used for the SQL query                        |
| 6    | `StreamingResponse`                                 | 64 KiB chunks, `Content-Length` and `Last-Modified` passed through, `ETag: "<sha256>"` when available   |


Streaming is end-to-end: the gateway never reads an overlay into memory.

---

## 7. HTTP API Reference

### `GET /api/dicomweb/nifti/related`

List non-archived overlays for a `(study, series)`, newest first.

Query parameters:


| Name     | Required | Description                         |
| -------- | -------- | ----------------------------------- |
| `study`  | yes      | StudyInstanceUID (DICOM 0020,000D)  |
| `series` | yes      | SeriesInstanceUID (DICOM 0020,000E) |


Response (`application/json`, array — empty array when nothing matches):

```json
[
  {
    "id": "9c0e5d0f-3c1c-4f8c-94f0-3a8b2b84a6f1",
    "name": "Vista3D lungs",
    "description": "Auto-segmented thoracic structures",
    "label_info": {
      "20":  {"name": "lung",        "color": [220,  20,  60]},
      "23":  {"name": "lung_tumor",  "color": [255, 215,   0]},
      "132": {"name": "airway",      "color": [ 70, 130, 180]}
    },
    "file_size_bytes": 1843267,
    "sha256": "8a2b1d...",
    "annotator": "vista3d-auto",
    "source": "monai-vista3d",
    "version": 3,
    "status": "approved",
    "created_at": "2026-05-14 18:32:10.123"
  }
]
```

Ordering: `version DESC NULLS LAST, created_at DESC`. Rows with
`status = 'archived'` are excluded.

The internal `path` column is intentionally **not** projected — clients
only ever see opaque `id` values and resolve them via `/fetch`.

### `GET /api/dicomweb/nifti/fetch`

Stream the raw `.nii.gz` bytes for one overlay.

Query parameters:


| Name     | Required | Description                                             |
| -------- | -------- | ------------------------------------------------------- |
| `study`  | yes      | StudyInstanceUID — required for liquid-cluster pruning  |
| `series` | yes      | SeriesInstanceUID — required for liquid-cluster pruning |
| `id`     | yes      | Overlay id from `/nifti/related`                        |


`(study, series)` are required even though `id` is unique by contract:
the Delta table is liquid-clustered on `(study_instance_uid, series_instance_uid)`, so passing those predicates lets the warehouse
prune clustered files **before** applying the `id` equality. Without
them every clustered file has to be scanned.

Response:


| Header           | Value                                                      |
| ---------------- | ---------------------------------------------------------- |
| `Content-Type`   | `application/octet-stream`                                 |
| `Content-Length` | Forwarded from the Files API when present                  |
| `Cache-Control`  | `private, max-age=3600`                                    |
| `ETag`           | `"<sha256>"` when the row carries a hash; absent otherwise |


Errors:


| Status | When                                                                                                                                             |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 401    | OBO mode and no usable token in `X-Forwarded-Access-Token`, `X-Pixels-User-Token`, or `Authorization: Bearer`                                    |
| 404    | Feature disabled (`NIFTI_SEGMENTATION_TABLE` unset), or no row matches `(study, series, id)`, or the UC Volume returns 404 for the resolved path |
| 502    | SQL execution failed, or the Files API returned a non-2xx response                                                                               |


---

## 8. Delta Table Schema

DDL is shipped as
`src/dbx/pixels/resources/sql/CREATE_NIFTI_SEGMENTATIONS.sql`. The full
fully-qualified name passed to the gateway via
`NIFTI_SEGMENTATION_TABLE` should match the conventions of the
`object_catalog` table (`{catalog}.{schema}.nifti_segmentations`).


| Column                | Type        | Nullable | Purpose                                                                                                  |
| --------------------- | ----------- | -------- | -------------------------------------------------------------------------------------------------------- |
| `id`                  | `STRING`    | NOT NULL | Stable overlay identifier (UUID). Used by `/nifti/fetch?id=...`                                          |
| `study_instance_uid`  | `STRING`    | NOT NULL | DICOM Study Instance UID — joins to `object_catalog`                                                     |
| `series_instance_uid` | `STRING`    | NOT NULL | DICOM Series Instance UID — joins to `object_catalog`                                                    |
| `path`                | `STRING`    | NOT NULL | Full `/Volumes/...` path to the `.nii.gz` file. **Server-internal**, never projected by `/nifti/related` |
| `file_size_bytes`     | `BIGINT`    |          | Used for `Content-Length` on `/nifti/fetch`                                                              |
| `sha256`              | `STRING`    |          | Hex-encoded SHA-256 of the overlay file. Used as `ETag` on `/nifti/fetch`                                |
| `name`                | `STRING`    |          | Short human-readable label set name (e.g. "Vista3D lungs")                                               |
| `description`         | `STRING`    |          | Free-form description shown in the OHIF panel                                                            |
| `label_info`          | `VARIANT`   |          | JSON object mapping `label_index (int) -> {name, color, ...}`. Consumed verbatim by the OHIF extension   |
| `annotator`           | `STRING`    |          | Human or system identifier (user email, `vista3d-auto`, ...)                                             |
| `source`              | `STRING`    |          | Pipeline / model that emitted the overlay (`monai-vista3d`, `manual`, ...)                               |
| `version`             | `INT`       |          | Monotonic per-(study, series) revision counter. **Primary** sort key                                     |
| `status`              | `STRING`    |          | `NULL` / `approved` / `draft` -> visible; `archived` -> hidden from `/nifti/related`                     |
| `created_at`          | `TIMESTAMP` |          | When the row was inserted. **Secondary** sort key (tie-breaker for equal `version`)                      |


Storage:

```sql
USING delta
CLUSTER BY (study_instance_uid, series_instance_uid)
TBLPROPERTIES (
  'delta.enableChangeDataFeed' = 'true',
  'delta.enableDeletionVectors' = 'true',
  'delta.feature.deletionVectors' = 'supported',
  'delta.feature.variantType-preview' = 'supported',
  'delta.minReaderVersion' = '3',
  'delta.minWriterVersion' = '7',
  'delta.targetFileSize' = '64mb',
  'delta.autoOptimize.autoCompact' = 'true',
  'delta.autoOptimize.optimizeWrite' = 'true'
);
```

### Append-only contract

The gateway **never** writes to this table. To change anything about an
overlay (status flip, label remap, new file), write a new row with a
higher `version`. The `/related` query relies on this:

```sql
ORDER BY version DESC NULLS LAST, created_at DESC
```

so the most recent revision always surfaces first while the audit trail
remains intact. Hiding an overlay is achieved by inserting a new row with
`status = 'archived'`; deletion is not part of the contract.

### Liquid clustering rationale

Most workloads filter by `(study_instance_uid, series_instance_uid)`
because the OHIF panel only ever asks for overlays for the currently
loaded series. Clustering on those two columns:

- Makes the `/related` predicate (two equality filters) prune to a single
small set of files.
- Makes the `/fetch` predicate (three equality filters, `id` last) also
prune effectively — the warehouse picks the same small set, then a
single equality on `id` walks one file.

---

## 9. UC Volume Layout

The gateway treats the `path` column as opaque — any path under any UC
Volume the calling identity can read works. Recommended layout (matches
the rest of the Pixels accelerator):

```
/Volumes/<catalog>/<schema>/<volume>/
  nifti/
    <study_instance_uid>/
      <series_instance_uid>/
        <id>.nii.gz
```

Reads happen via the Databricks Files API
(`GET /api/2.0/fs/files/<path>`) so the file does not need to be on the
same Volume as the DICOM frames — any Volume readable by the calling
identity works, which is convenient for separating ML output from raw
imaging data.

The Files API call uses the **same Bearer token** as the SQL query (the
user's OBO token in OBO mode, the service principal's token otherwise),
so Volume ACLs and Delta table ACLs always agree.

---

## 10. Authentication and Authorization

Auth follows the same `DICOMWEB_USE_USER_AUTH` switch the rest of the
gateway uses (default: `true`).

### OBO mode (default, `DICOMWEB_USE_USER_AUTH=true`)

`_resolve_token(request)` resolves the user's Bearer token from headers,
in this order:

1. `X-Forwarded-Access-Token` — injected by the Databricks Apps proxy on direct browser -> app calls.
2. `X-Pixels-User-Token` — used for cross-app OBO (e.g. when an SP-authenticated app forwards the user's token explicitly).
3. `Authorization: Bearer <token>` — set by the viewer's reverse proxy when promoting `X-Forwarded-Access-Token`.

The same token is used for **both** the SQL warehouse query and the
Files API stream, so Unity Catalog evaluates ACLs uniformly across the
two access paths. There is no scope where one is permitted and the other
is not.

`401` is returned when no usable token is found; the failure path also
emits a redacted dump of inbound headers to the gateway log to make
diagnosing missing-header bugs straightforward without leaking secrets.

### App-auth mode (`DICOMWEB_USE_USER_AUTH=false`)

The service-principal credentials minted at app creation
(`DATABRICKS_CLIENT_ID` / `DATABRICKS_CLIENT_SECRET`) are used. The SDK
`Config` handles token refresh; `app_token_provider()` proactively
forces a refresh once when the cached token is within 5 minutes of
expiry.

In app-auth mode all users see the same overlays. If overlay visibility
should depend on the caller, leave `DICOMWEB_USE_USER_AUTH=true` and
manage permissions through standard UC grants on the Delta table and
Volume.

### Required user_api_scopes

The gateway is deployed (in `install/deploy-gateway.ipynb`) with:

```python
GATEWAY_USER_API_SCOPES = ["sql", "files.files"]
```

`files.files` is required for the Files API stream to succeed in OBO
mode. Without it, `/nifti/fetch` will return 502 even when the SQL query
succeeded.

---

## 11. Configuration Reference

### Bundle variable (`databricks.yml`)


| Variable                   | Default | Description                                                                               |
| -------------------------- | ------- | ----------------------------------------------------------------------------------------- |
| `nifti_segmentation_table` | `""`    | Optional UC Delta table for NIfTI overlay metadata. Empty disables the `/nifti/*` routes. |


Override on the CLI like any other bundle variable:

```bash
databricks bundle deploy -t prod \
  --var catalog=my_catalog \
  --var schema=my_schema \
  --var nifti_segmentation_table=my_catalog.my_schema.nifti_segmentations
```

### Install job parameter (`resources/install-job.yml`)

The bundle variable is forwarded to the install job as a job parameter:

```yaml
parameters:
  - name: nifti_segmentation_table
    default: ${var.nifti_segmentation_table}
```

### Install widget (`install/deploy-gateway.ipynb`)

The `deploy_gateway` task has a per-run override widget:

```
7.0 (optional) UC Delta table for NIfTI segmentation overlays — leave empty to disable /nifti routes
```

When non-empty the value is substituted into `app.yml` as
`NIFTI_SEGMENTATION_TABLE`; when empty the placeholder is left in
`app.yml` and `_resolve_table()` returns 404 on every request.

### Gateway env vars (`apps/dicom-web-gateway/app-config.yml`)

```yaml
env:
  - name: "NIFTI_SEGMENTATION_TABLE"
    value: "{NIFTI_SEGMENTATION_TABLE}"   # substituted by deploy-gateway.ipynb
```


| Variable                   | Required by NIfTI feature | Notes                                                     |
| -------------------------- | ------------------------- | --------------------------------------------------------- |
| `NIFTI_SEGMENTATION_TABLE` | yes                       | Empty / unset disables the routes                         |
| `DATABRICKS_WAREHOUSE_ID`  | yes                       | Same warehouse used by the rest of the gateway            |
| `DICOMWEB_USE_USER_AUTH`   | optional                  | `true` (default) for OBO; `false` for SP                  |
| `DATABRICKS_HOST`          | derived                   | Resolved from the SDK `Config`; explicit override allowed |


### OHIF viewer (`apps/dicom-web/ohif/app-config.js`)

```js
niftiOverlay: {
  enabled: true,            // master switch — set to false to hide the panel
  baseUrl: null,            // null -> inherit from active data source's qidoRoot
  pathPrefix: '/nifti',
  endpoints: {
    related: '/related',
    fetch:   '/fetch',
  },
  auth: { mode: 'inherit' },// inherit Bearer from the data source
  alignment: {
    spacingTolerance: 1e-4,
    originTolerance:  1e-4,
    promptOnResample: false,
    // assumeDicomGrid: true,   // set when the NIfTI affine doesn't match
  },
  autoLoadOnSeriesOpen: false,
  maxOverlaysListed:    25,
}
```

`enabled: true` is the shipping default. The panel appears on the right
of the viewport and the extension automatically calls `/related` on
every series open. Set to `false` to hide the panel without removing
the backend routes.

---

## 12. Deployment

The feature is **opt-in**: a fresh install with no extra flags deploys
the table DDL alongside the rest of the schema but leaves the gateway
routes disabled.

### Step-by-step

1. **Create the table.** Apply
  `src/dbx/pixels/resources/sql/CREATE_NIFTI_SEGMENTATIONS.sql` against
   your `{catalog}.{schema}` (a future `init-schema.ipynb` revision will
   automate this; today it is a one-off).
2. **Set the bundle variable.** Either pass on the CLI or override in
  `targets.yml`:
3. **Run the install job.** `deploy_gateway` picks up the parameter,
  substitutes it into `app.yml`, and prints either:
   or
4. **Smoke-test the routes.**
  ```bash
   APP_URL=$(databricks apps get pixels-dicomweb-gateway -p MY_WORKSPACE \
     | python3 -c "import sys,json; print(json.load(sys.stdin)['url'])")
   TOKEN=$(databricks auth token -p MY_WORKSPACE \
     | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

   curl -s -H "Authorization: Bearer $TOKEN" \
     "$APP_URL/api/dicomweb/nifti/related?study=<STUDY>&series=<SERIES>"
  ```
   Expected: empty array on a fresh table; populated array once an
   ingest pipeline has written rows.
5. **Enable the OHIF panel.** Edit
  `apps/dicom-web/ohif/app-config.js`, set `niftiOverlay.enabled: true`,
   then rebuild the OHIF tarball (`make build`) and re-run the install
   job (or `deploy_prep` + `deploy_viewer`).

### Disabling

Set `nifti_segmentation_table` back to the empty string and re-run
`deploy_gateway`. Both routes will return 404 on the next request — no
restart of the rest of the gateway is required beyond the redeploy.

---

## 13. Operational Notes

### Caching

- Browser: `Cache-Control: private, max-age=3600` plus `ETag: "<sha256>"`
on `/nifti/fetch` enables conditional revalidation. Repeated
`If-None-Match` requests for the same overlay return 304 from any
caching proxy in the chain.
- Gateway: no in-process cache. Every request hits the SQL warehouse
and the Files API — both are sub-second when the warehouse is warm.

### Logging

`utils/handlers/_nifti.py` logs to the `DICOMweb.Gateway` logger:

- `nifti_related: SQL execution failed for study=... series=...` (502)
- `nifti_fetch: SQL execution failed for study=... series=... id=...` (502)
- `nifti_fetch: Files API stream failed for ... path=...` (502)
- `Unparseable label_info for overlay id=...; defaulting to {}` (warning, recoverable)

The redaction-aware token failure log (`RESOLVE_USER_TOKEN_FAIL ... inbound_headers=...`) emits when no Bearer token is found and is shared
with QIDO/WADO/STOW.

### Failure modes the schema prevents

- **Stale visibility.** Status changes are new rows with higher
`version`, so a slow reader cannot accidentally promote an archived
overlay back to visible.
- **Path leakage.** `path` is excluded from the `/related` projection
and only consumed server-side by `/fetch`. Browsers never receive the
`/Volumes/...` path of an overlay.
- **SQL injection.** All user-supplied values flow through `%(name)s`
bind parameters; the table identifier flows through the
`IDENTIFIER()` clause and is additionally validated by
`validate_table_name()` as defence-in-depth.

---

## 14. Troubleshooting


| Symptom                                                                                  | Likely cause                                                                                                 | Fix                                                                                                                         |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `404 NIfTI overlay routes are disabled (NIFTI_SEGMENTATION_TABLE is not configured ...)` | Bundle variable empty or widget left blank                                                                   | Re-run `deploy_gateway` with `nifti_segmentation_table` set                                                                 |
| `404 No overlay with id=... under study=... series=...`                                  | Row missing or `(study, series, id)` mismatch                                                                | Confirm the row exists in the Delta table; remember `id` alone is unique but the query requires the cluster keys            |
| `404` from `/nifti/fetch` even though `/nifti/related` returns rows                      | UC Volume ACL denies the calling identity, or the row's `path` is stale                                      | Grant `READ VOLUME` on the relevant Volume; verify the file exists                                                          |
| `502 Upstream Files API error`                                                           | Files API returned a non-2xx (e.g. transient 5xx, missing scope)                                             | Confirm `user_api_scopes` includes `files.files`; check workspace status                                                    |
| `401 User authorization (OBO) is enabled but no X-Forwarded-Access-Token header`         | Direct call to the gateway that bypasses the viewer (curl without a token, or app-to-app without forwarding) | Either send the user's token in `Authorization: Bearer ...`, or set `DICOMWEB_USE_USER_AUTH=false` for SP-only environments |
| Panel shows nothing on a study with rows in the table                                    | OHIF `niftiOverlay.enabled` is `false`, or the active data source doesn't expose `qidoRoot`                  | Set `enabled: true`; if using `databricksPixelsDicom` as the active source, set `niftiOverlay.baseUrl` explicitly           |
| Resample dialog every series open                                                        | NIfTI exporter writes an affine that disagrees with the DICOM grid                                           | Either fix the exporter, or set `niftiOverlay.alignment.assumeDicomGrid: true`                                              |


---

## 15. File Inventory

```
src/dbx/pixels/resources/sql/
  CREATE_NIFTI_SEGMENTATIONS.sql          # Delta DDL (clustering + tblproperties)

apps/dicom-web-gateway/
  app.py                                  # Two FastAPI routes (NIfTI Overlay tag)
  app-config.yml                          # NIFTI_SEGMENTATION_TABLE env var template
  utils/queries_nifti.py                  # Parameterized SQL builders
  utils/handlers/__init__.py              # Re-exports nifti_related, nifti_fetch
  utils/handlers/_nifti.py                # Handler implementation

apps/dicom-web/
  app.py                                  # Catch-all reverse proxy (no NIfTI-specific code)
  ohif/app-config.js                      # niftiOverlay block
  ohif/9605.bundle.*.js                   # Pre-built @ohif/extension-nifti-segmentation

databricks.yml                            # nifti_segmentation_table bundle variable
resources/install-job.yml                 # nifti_segmentation_table job parameter
install/deploy-gateway.ipynb              # Widget + app.yml substitution
```

For the broader DICOMweb architecture (QIDO/WADO/STOW, caching tiers,
Lakebase, metrics), see `[DICOMWEB.md](DICOMWEB.md)`. For end-to-end
deployment instructions, see `[INSTALL.md](INSTALL.md)`.