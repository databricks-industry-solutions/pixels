# DICOMweb on Databricks — Architecture & Developer Reference

This document covers the two Databricks App components that together deliver a
fully compliant DICOMweb service on top of Databricks SQL, Lakebase, and Unity
Catalog Volumes:


| Component                           | Directory                                 | Role                                                                                                                |
| ----------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **dicom_web** (Viewer App)          | `dbx/pixels/resources/dicom_web/`         | Serves the OHIF viewer, MONAI, redaction and VLM APIs; reverse-proxies all DICOMweb protocol traffic to the gateway |
| **dicom_web_gateway** (Gateway App) | `dbx/pixels/resources/dicom_web_gateway/` | Full DICOMweb server (QIDO-RS, WADO-RS, WADO-URI, STOW-RS) backed by Databricks SQL, Lakebase, and Volumes          |


The DICOMweb handler library lives inside `dicom_web_gateway/utils/` and is
imported directly by the gateway app (no network boundary between routing and
handler execution).

---

## Table of Contents

1. [High-Level Architecture](#1-high-level-architecture)
2. [Component: dicom_web (Viewer App)](#2-component-dicom_web-viewer-app)
3. [Component: dicom_web_gateway (Gateway App)](#3-component-dicom_web_gateway-gateway-app)
4. [Shared Handler Library](#4-shared-handler-library)
5. [DICOMweb Protocol Support](#5-dicomweb-protocol-support)
6. [Caching Architecture — 3-Tier PACS-Style](#6-caching-architecture--3-tier-pacs-style)
7. [STOW-RS — Dual-Path Upload](#7-stow-rs--dual-path-upload)
8. [Direct Cloud Upload](#8-direct-cloud-upload)
9. [Security & Authentication](#9-security--authentication)
10. [Metrics & Observability](#10-metrics--observability)
11. [Configuration Reference](#11-configuration-reference)
12. [File Inventory](#12-file-inventory)

---

## 1. High-Level Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│  Browser / OHIF / DICOM client                                     │
└──────────────┬─────────────────────────────────────────────────────┘
               │  HTTPS
               ▼
┌─────────────────────────────────────────────────────────────────┐
│  dicom_web  (Databricks App — Viewer)                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Middleware stack (outermost → innermost)                │    │
│  │  1. SelectiveGZipMiddleware                             │    │
│  │  2. TokenMiddleware  — injects OHIF config tokens       │    │
│  │  3. LoggingMiddleware — per-request structured logs     │    │
│  └──────────────┬──────────────────────────────────────────┘    │
│                 │                                               │
│  ┌──────────────▼──────────────────────────────────────────┐    │
│  │ Routes                                                  │    │
│  │  • /ohif/**         → static OHIF SPA (DBStaticFiles)   │    │
│  │  • /api/monai/**    → MONAI Model Serving proxy         │    │
│  │  • /api/redaction/** → Redaction job API                │    │
│  │  • /vlm/analyze     → VLM serving endpoint              │    │
│  │  • /api/dicomweb/** → reverse proxy ──────────────────┐ │    │
│  │  • /api/metrics     → reverse proxy ──────────────────┤ │    │
│  └────────────────────────────────────────────────────── │ ┘    │
│                                                          │      │
│  httpx.AsyncClient (HTTP/2, keepalive pool, streaming)   │      │
└──────────────────────────────────────────────────────────┼──────┘
                                                           │ HTTP/2
                                                           ▼
┌────────────────────────────────────────────────────────────────────────┐
│  dicom_web_gateway  (Databricks App — Gateway)                         │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────┐          │
│  │ _InstrumentMiddleware  (pure ASGI — latency + errors)    │          │
│  └──────────────┬───────────────────────────────────────────┘          │
│                 │                                                      │
│  ┌──────────────▼───────────────────────────────────────────┐          │
│  │ DICOMweb Routes                                          │          │
│  │  QIDO-RS  │  WADO-RS  │  WADO-URI  │  STOW-RS            │          │
│  │  /resolve_paths  /resolve_frame_ranges  /prime           │          │
│  └──────────────┬───────────────────────────────────────────┘          │
│                 │                                                      │
│  ┌──────────────▼──────────────────────────────────────────────────┐   │
│  │ DICOMwebDatabricksWrapper  (dicom_web_gateway/utils/wrapper.py) │   │
│  │  • Parameterized SQL via DatabricksSQLClient                    │   │
│  │  • 3-tier BOT cache (RAM → Lakebase → recompute)                │   │
│  │  • Streaming byte-range reads from Volumes                      │   │
│  └──────┬──────────────┬────────────────┬──────────────────────────┘   │
│         │              │                │                              │
│    SQL Warehouse    Lakebase          Volumes API                      │
│    (QIDO-RS)       (BOT cache,        (WADO-RS frames,                 │
│                    path cache,        STOW-RS files)                   │
│                    metrics)                                            │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions


| Decision                                | Rationale                                                                                                                                                                                                                                                 |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Split Viewer / Gateway**              | The viewer app can be restarted or scaled independently. The gateway holds warm caches that are expensive to rebuild — isolation prevents viewer restarts from flushing them.                                                                             |
| **HTTP/2 proxy**                        | The viewer uses `httpx` with HTTP/2 and connection multiplexing so hundreds of concurrent frame requests share a small pool of TCP+TLS connections rather than opening a new socket per request.                                                          |
| **Handler library imported in-process** | The gateway calls handlers directly without a network hop. This avoids serialization overhead and keeps request latency in the single-digit millisecond range.                                                                                            |
| **Lakebase as persistent tier-2 cache** | Lakebase is a PostgreSQL-compatible managed database on Databricks. Storing BOT (frame offsets) and instance paths there means the gateway survives restarts with a warm cache, eliminating the cold-start penalty of recomputing offsets for every file. |
| **Streaming everywhere**                | All WADO-RS responses are `StreamingResponse` objects — frames are yielded to the client as soon as each byte-range read completes. No file is buffered in server memory.                                                                                 |
| **STOW-RS dual-path**                   | Small uploads are split in-process (zero Spark overhead, immediate response). Large uploads fall back to a Spark job for robustness. The threshold is controlled by `STOW_STREAMING_MAX_BYTES`.                                                           |


---

## 2. Component: `dicom_web` (Viewer App)

### Purpose

Hosts the OHIF 3D viewer and auxiliary APIs (MONAI, redaction, VLM). All
DICOMweb protocol requests are **reverse-proxied** to the gateway app — this
component contains **no DICOMweb business logic**.

### Startup Lifecycle

```python
# lifespan (app.py)
httpx.AsyncClient(
    http2=True,
    follow_redirects=True,
    timeout=Timeout(300s, connect=30s),
    limits=Limits(max_connections=200, max_keepalive=100),
)
```

The `AsyncClient` is created once at startup and reused for every proxy
request. HTTP/2 allows multiplexing of hundreds of concurrent frame requests
over a small number of connections.

### Reverse Proxy

`_proxy_to_gateway()` handles all DICOMweb forwarding:

1. Strips `host`, `content-length`, and `transfer-encoding` from inbound headers.
2. Promotes `X-Forwarded-Access-Token` → `Authorization: Bearer …` so the gateway receives a valid user token in OBO mode.
3. Adds a `User-Agent: DatabricksPixels/<version>_dicomweb` header for gateway-side request identification.
4. POSTs/PUTs buffer the body in memory before forwarding (small non-streaming requests only — multipart STOW bodies are large and handled by the gateway's streaming parser directly).
5. Returns a `StreamingResponse` wrapping `resp.aiter_bytes()` — response data flows directly from the gateway to the browser without re-buffering.

### Middleware Stack


| Layer     | Class               | Effect                                                                                                                                                                                                                           |
| --------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Outermost | `TokenMiddleware`   | Intercepts `app-config-custom.js` to inject `{PIXELS_TABLE}`, `{ROUTER_BASENAME}`, `{DEFAULT_DATA_SOURCE}`, `{DICOMWEB_ROOT}`. Intercepts `/local` for local file browsing. Patches the HTJ2K WASM decoder path in OHIF bundles. |
| Middle    | `LoggingMiddleware` | Structured per-request log: method, path, status, elapsed ms, `X-Forwarded-Email`.                                                                                                                                               |
| Inner     | `CORSMiddleware`    | Standard CORS headers.                                                                                                                                                                                                           |


### Common Routes

Registered via `register_all_common_routes()` from `dbx.pixels.resources.common.routes`:


| Route                          | Handler                                                       |
| ------------------------------ | ------------------------------------------------------------- |
| `GET /`                        | Config page (table selector)                                  |
| `POST /set_cookie`             | Set `pixels_table` and `seg_dest_dir` cookies                 |
| `GET /ohif/**`                 | Static SPA with `DBStaticFiles` (404 → `index.html` fallback) |
| `GET/POST /api/monai/**`       | Proxy to Databricks Model Serving (MONAI Label)               |
| `POST /api/redaction/insert`   | Create redaction job in SQL Warehouse                         |
| `POST /redaction/ai_redaction` | AI-assisted redaction via LLM serving endpoint                |
| `POST /vlm/analyze`            | Vision-Language Model analysis                                |


### Configuration


| Variable                   | Default | Description                                             |
| -------------------------- | ------- | ------------------------------------------------------- |
| `DICOMWEB_GATEWAY_URL`     | —       | **Required.** Base URL of the gateway app               |
| `DATABRICKS_WAREHOUSE_ID`  | —       | SQL Warehouse for MONAI / redaction queries             |
| `DATABRICKS_PIXELS_TABLE`  | —       | Fully-qualified UC table (`catalog.schema.table`)       |
| `MONAI_SERVING_ENDPOINT`   | —       | MONAI Label model serving endpoint name                 |
| `DICOMWEB_USE_USER_AUTH`   | `false` | Use user OBO auth instead of app service-principal auth |
| `DICOMWEB_MAX_CONNECTIONS` | `200`   | Max outbound HTTP connections to gateway                |
| `DICOMWEB_MAX_KEEPALIVE`   | `100`   | Max keepalive connections in the pool                   |
| `DB_PIXELS_LOG_LEVEL`      | `INFO`  | Python log level                                        |


---

## 3. Component: `dicom_web_gateway` (Gateway App)

### Purpose

Full DICOMweb server implementing QIDO-RS, WADO-RS, WADO-URI, and STOW-RS.
Backed by Databricks SQL Warehouse (queries), Lakebase (persistent cache +
metrics), and Databricks Volumes (file storage).

### Startup Lifecycle (`_lifespan`)

```
1. ThreadPoolExecutor(64 workers)  →  asyncio default executor
   (prevents blocking SQL/Lakebase calls from stalling the event loop)

2. httpx.AsyncClient(http2=True)   →  shared async HTTP client

3. asyncio.create_task(_metrics_reporter)
   →  background task: snapshot counters → Lakebase → WebSocket every 1 s

4. probe_direct_upload()  [if STOW_DIRECT_CLOUD_UPLOAD=true]
   →  validates UC credential vending + caches cloud credentials

5. ThreadPoolExecutor(1 worker).submit(_startup_bot_preload)
   →  non-blocking background preload of BOT + instance-path caches
      from Lakebase (priority-ordered: most recently/frequently accessed first)

Graceful shutdown:
  • _stow_record_buffer.stop()  — flush buffered SQL audit rows
  • Cancel metrics reporter task
  • Shutdown executors
  • Close httpx client
```

### `_InstrumentMiddleware`

A pure ASGI middleware (not Starlette `BaseHTTPMiddleware`, so no double-body
buffering). For every request **not** matching `/health`, `/ws/`, `/api/metrics`,
or `/api/dashboard`:

- Calls `_record_request_start()` to increment the in-flight gauge.
- Wraps `send` to capture the HTTP status code.
- On completion calls `_record_request(elapsed, is_error)` to update the
rolling counters that `_metrics_reporter` reads every second.

### API Routes

#### QIDO-RS


| Method | Path                                                      | Description                                 |
| ------ | --------------------------------------------------------- | ------------------------------------------- |
| `GET`  | `/api/dicomweb/studies`                                   | Search studies with DICOM attribute filters |
| `GET`  | `/api/dicomweb/all_series`                                | Flat list of all series (custom extension)  |
| `GET`  | `/api/dicomweb/studies/{study}/series`                    | Search series within a study                |
| `GET`  | `/api/dicomweb/studies/{study}/series/{series}/instances` | Search instances within a series            |


All QIDO-RS handlers execute parameterized SQL against the Pixels UC table and
return `application/dicom+json` arrays. Query parameters map 1:1 to DICOM
attribute filters via `utils/queries.py`.

#### WADO-RS


| Method | Path                                                                               | Description                                                           |
| ------ | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `GET`  | `/api/dicomweb/studies/{study}/series/{series}/metadata`                           | Streaming JSON metadata (Arrow → JSON, no parse/serialize round-trip) |
| `GET`  | `/api/dicomweb/studies/{study}/series/{series}/instances/{sop}`                    | Full DICOM file stream from Volumes                                   |
| `GET`  | `/api/dicomweb/studies/{study}/series/{series}/instances/{sop}/frames/{frameList}` | Streaming multipart/related frame response                            |


Frame retrieval uses the 3-tier BOT cache (see §6). Each frame is yielded to
the client as soon as its byte-range read completes — no "collect all then
send" buffering.

#### WADO-URI (Legacy)


| Method | Path                                                                     | Description                               |
| ------ | ------------------------------------------------------------------------ | ----------------------------------------- |
| `GET`  | `/api/dicomweb/wado?requestType=WADO&studyUID=…&seriesUID=…&objectUID=…` | Legacy DICOM PS3.18 §6.2 object retrieval |
| `GET`  | `/api/dicomweb?requestType=WADO&…`                                       | Alternate base path for WADO-URI          |


Supports optional `frameNumber` (returns a single-frame multipart response)
and `contentType` negotiation (only `application/dicom` is supported; returns
HTTP 406 for other types).

#### STOW-RS


| Method | Path                                | Description                                  |
| ------ | ----------------------------------- | -------------------------------------------- |
| `POST` | `/api/dicomweb/studies`             | Store DICOM instances (any study)            |
| `POST` | `/api/dicomweb/studies/{study_uid}` | Store DICOM instances constrained to a study |


See §7 for the detailed dual-path design.

#### Auxiliary Endpoints


| Method | Path                                 | Description                                                                                                       |
| ------ | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `POST` | `/api/dicomweb/resolve_paths`        | Returns SOP UID → Volumes file path mapping for a series                                                          |
| `POST` | `/api/dicomweb/resolve_frame_ranges` | Returns per-frame byte offsets for an instance (enables direct Volumes reads without routing through the gateway) |
| `POST` | `/api/dicomweb/prime`                | Pre-warms all caches for an entire series (path resolution + file prefetch + BOT computation)                     |


#### Monitoring


| Method      | Path                               | Description                                                             |
| ----------- | ---------------------------------- | ----------------------------------------------------------------------- |
| `GET`       | `/api/stow/status`                 | STOW upload mode diagnostics (Files API vs. direct cloud)               |
| `GET`       | `/api/metrics?window=5m|30m|1h|8h` | Time-series gateway metrics from Lakebase (downsampled to ≤ 300 points) |
| `GET`       | `/api/dashboard`                   | Live metrics dashboard (Chart.js, static HTML)                          |
| `WebSocket` | `/ws/metrics`                      | Real-time metric push (1-second interval)                               |
| `GET`       | `/health`                          | Health check — returns `{"status": "ok"}`                               |


### Configuration


| Variable                        | Default                                               | Description                                                                        |
| ------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `DATABRICKS_WAREHOUSE_ID`       | —                                                     | **Required.** SQL Warehouse ID                                                     |
| `DATABRICKS_PIXELS_TABLE`       | —                                                     | **Required.** UC table (`catalog.schema.table`)                                    |
| `LAKEBASE_INSTANCE_NAME`        | `pixels-lakebase`                                     | Lakebase instance name                                                             |
| `LAKEBASE_INIT_DB`              | `false`                                               | Run DDL migrations on startup (set `true` on first deploy or after schema changes) |
| `DATABRICKS_STOW_VOLUME_PATH`   | —                                                     | Base Volumes path for STOW-RS uploads (e.g. `/Volumes/catalog/schema/volume/stow`) |
| `STOW_DIRECT_CLOUD_UPLOAD`      | `false`                                               | Enable direct S3/ADLS/GCS upload via UC credential vending                         |
| `STOW_STREAMING_MAX_BYTES`      | `5242880` in `app.yml` (`524288000` fallback in code) | Uploads above this use the legacy Spark path                                       |
| `STOW_THREAD_POOL_SIZE`         | `64`                                                  | Default executor pool (blocking SQL + Lakebase calls)                              |
| `STOW_SQL_BATCH_SIZE`           | `100`                                                 | Max STOW audit records per SQL batch INSERT                                        |
| `STOW_SQL_FLUSH_INTERVAL_S`     | `2.0`                                                 | Max seconds between STOW audit record flushes                                      |
| `STOW_VOLUMES_CONCURRENCY`      | `8`                                                   | Semaphore limit for concurrent Volumes PUT requests                                |
| `PIXELS_BOT_CACHE_MAX_ENTRIES`  | `100000`                                              | In-memory BOT cache capacity                                                       |
| `PIXELS_PATH_CACHE_MAX_ENTRIES` | `100000`                                              | In-memory instance-path cache capacity                                             |
| `PIXELS_PREFETCH_ENABLED`       | `false`                                               | Enable background file prefetch into RAM                                           |
| `PIXELS_PREFETCH_RAM_RATIO`     | `0.50`                                                | Fraction of total RAM for prefetch buffer (when no explicit cap)                   |
| `PIXELS_PREFETCH_MAX_MEMORY_MB` | —                                                     | Hard cap on prefetch buffer in MB                                                  |
| `PIXELS_PREFETCH_MAX_FILE_MB`   | `512`                                                 | Skip prefetching files larger than this                                            |
| `PIXELS_FRAME_CACHE_DIR`        | `/tmp/pixels_frame_cache`                             | Directory for on-disk frame cache                                                  |
| `PIXELS_FRAME_CACHE_MAX_GB`     | `10`                                                  | Max size of on-disk frame cache                                                    |
| `DICOMWEB_MAX_CONNECTIONS`      | `200`                                                 | Max concurrent outbound HTTP connections to Volumes                                |
| `DICOMWEB_MAX_KEEPALIVE`        | `100`                                                 | Max keepalive connections                                                          |
| `DICOMWEB_METRICS_INTERVAL`     | `1`                                                   | Seconds between metrics snapshots                                                  |


---

## 4. Shared Handler Library

All DICOMweb business logic lives in `dicom_web_gateway/utils/` and is imported
in-process by the gateway. The library has no dependency on FastAPI routing —
handlers receive a `fastapi.Request` and return a `Response`.

### Module Map

```
dicom_web_gateway/utils/
├── __init__.py               timing_decorator (perf logging)
├── wrapper.py                DICOMwebDatabricksWrapper — main service class
├── sql_client.py             DatabricksSQLClient — parameterized SQL execution
├── queries.py                SQL query builders (QIDO, WADO, STOW)
├── dicom_io.py               Byte-range reads, streaming, BOT computation,
│                             file prefetcher, progressive streamer
├── multipart_stream.py       Async multipart/related parser for STOW-RS
├── cloud_direct_upload.py    Direct S3/ADLS/GCS upload via UC credential vending
├── cache.py                  BOTCache + InstancePathCache (in-memory LRU)
├── dicom_tags.py             Tag constants, VR mappings, JSON formatting
├── metrics.py                Metrics collection helpers
└── handlers/
    ├── __init__.py           Public handler exports
    ├── _common.py            Singletons, auth, wrapper factory
    ├── _qido.py              QIDO-RS handlers
    ├── _wado.py              WADO-RS, WADO-URI, resolve_paths, prime handlers
    └── _stow.py              STOW-RS dual-path handler
```

### `DICOMwebDatabricksWrapper` (wrapper.py)

The central service class. One instance is shared per-process in app-auth mode;
a new instance is created per-request in OBO mode.

Key methods:


| Method                                                 | Description                                    |
| ------------------------------------------------------ | ---------------------------------------------- |
| `retrieve_series_metadata(study, series)`              | Arrow → streaming JSON metadata                |
| `retrieve_instance(study, series, sop)`                | Stream full DICOM file from Volumes            |
| `retrieve_instance_frames(study, series, sop, frames)` | BOT lookup → byte-range reads → frame iterator |
| `resolve_instance_paths(study, series)`                | SQL query → SOP UID → file path map            |
| `resolve_frame_ranges(study, series, sop)`             | BOT computation → per-frame byte ranges        |


### `DatabricksSQLClient` (sql_client.py)

Thin wrapper around the Databricks SQL Connector. Supports:

- **App auth**: singleton connection, bearer token auto-refreshed via SDK `Config`.
- **OBO auth**: per-request connection using the user's forwarded bearer token.
- Parameterized queries only — no string interpolation of user-supplied values.

### `dicom_io.py` — I/O Deep Dive

#### HTTP Connection Pool

A persistent `requests.Session` with:

- `pool_connections=20`, `pool_maxsize=50` — reuses TCP+TLS connections
- Retry strategy: 3 retries, exponential backoff, on 502/503/504

This eliminates the ~100 ms TCP+TLS handshake per request that would otherwise
dominate latency for small frame reads.

#### BOT Computation — Tiered Strategy

When computing frame byte offsets for a compressed multi-frame DICOM file:

```
Tier A: Extended Offset Table (7FE0,0001) + (7FE0,0002)
  → Zero extra I/O. Offsets are in the header already.
  → Used when the file was written with DICOM EOT.

Tier B: Item-tag streaming scan
  → HTTP range stream reads only 8-byte Item headers.
  → Memory O(num_frames × 50 B) — works for files with thousands of frames.
  → Used when EOT is absent but file is properly encapsulated.

Tier C: Full file download + pydicom parse
  → Legacy fallback for malformed or non-standard files.
  → Expensive — results are aggressively cached so it only runs once per file.
```

#### Progressive Streamer

For frame requests that arrive before the BOT is warm, a `ProgressiveStreamer`
reads the file sequentially while parsing frame boundaries on-the-fly, yielding
each frame to the client as it is found. This delivers first-frame latency
comparable to the cached path even on a cold cache.

#### File Prefetcher

When `PIXELS_PREFETCH_ENABLED=true`, a background thread pool downloads DICOM
files from Volumes into a RAM buffer capped at `PIXELS_PREFETCH_RAM_RATIO × total_RAM`
(or `PIXELS_PREFETCH_MAX_MEMORY_MB`). Files larger than `PIXELS_PREFETCH_MAX_FILE_MB`
are skipped. Subsequent reads from the same file are served from RAM without a
network call.

---

## 5. DICOMweb Protocol Support

### QIDO-RS (Query Based on ID for DICOM Objects by RESTful Services)

- Full study / series / instance hierarchy
- Attribute filters mapped to parameterized SQL `WHERE` clauses
- Response formatted as `application/dicom+json` arrays
- Custom extension: `GET /all_series` for flat cross-study series listing

### WADO-RS (Web Access to DICOM Objects by RESTful Services)

- Series metadata — streamed directly from Arrow result without JSON
parse/serialize round-trip
- Instance retrieval — full DICOM Part-10 file, streamed, with
`Content-Length` when available and `Cache-Control: private, max-age=3600`
- Frame retrieval — `multipart/related` response, one part per frame:
  - MIME type resolved from Transfer Syntax UID via `TRANSFER_SYNTAX_TO_MIME` map
  - `Content-Type` header per part includes `transfer-syntax=<UID>`
  - Frames yielded progressively as byte-range reads complete

### WADO-URI (PS3.18 §6.2 — Legacy)

Supports the classic query-parameter style. Required parameters:
`requestType=WADO`, `studyUID`, `seriesUID`, `objectUID`.
Optional `frameNumber` triggers a single-frame multipart response.
Content-type negotiation: only `application/dicom` accepted (406 otherwise).

### STOW-RS (Store Over the Web)

See §7 for the full dual-path design.

---

## 6. Caching Architecture — 3-Tier PACS-Style

Traditional PACS systems pre-index frame byte offsets at ingest time, enabling
instant random frame access via a single byte-range read. This system replicates
that behaviour with a three-tier hierarchy:

```
Request for frames
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  Tier 1: In-Memory LRU Cache  (microseconds)             │
│                                                          │
│  BOTCache          — filename+table → frame offsets      │
│  InstancePathCache — SOP UID+table  → file path          │
│                                                          │
│  Both implemented as OrderedDict with a threading.Lock.  │
│  Thread-safe, evicts LRU entries when max_entries hit.   │
└──────────────────────┬───────────────────────────────────┘
                       │ miss
                       ▼
┌──────────────────────────────────────────────────────────┐
│  Tier 2: Lakebase Persistent Cache  (milliseconds)       │
│                                                          │
│  Tables:                                                 │
│  • dicom_frames     — per-file frame offset table        │
│  • instance_paths   — SOP UID → local_path + num_frames  │
│  • endpoint_metrics — gateway metrics time series        │
│                                                          │
│  Survives gateway restarts. Pre-warmed at startup.       │
│  Aligned with UC namespace (catalog.schema → DB.schema). │
└──────────────────────┬───────────────────────────────────┘
                       │ miss
                       ▼
┌──────────────────────────────────────────────────────────┐
│  Tier 3: Live Compute  (seconds, first access only)      │
│                                                          │
│  BOT: EOT scan → item-tag scan → full download           │
│  Path: SQL Warehouse query (300–500 ms)                  │
│                                                          │
│  Result immediately written back to Tier 1 + Tier 2.     │
└──────────────────────────────────────────────────────────┘
```

### Startup Preload

On gateway startup, `_startup_bot_preload()` runs in a background thread:

1. Queries Lakebase `get_preload_priority_list()` — returns files ordered by
  `last_used_at DESC, access_count DESC` up to `PIXELS_BOT_CACHE_MAX_ENTRIES`.
2. Populates `bot_cache` (Tier 1) from Lakebase results.
3. Queries `retrieve_instance_paths_by_local_paths()` for the same file list.
4. Batch-populates `instance_path_cache` (Tier 1).

The server starts accepting requests immediately while the preload runs
concurrently — typically completes within seconds for most deployments.

### RLS-Aware Cache Keys

When `LAKEBASE_RLS_ENABLED=true` and `DICOMWEB_USE_USER_AUTH=true`:

- `InstancePathCache` keys include a SHA-256 hash (first 12 hex chars) of the
user's Databricks group list (`sorted → join → hash`).
- Users with different group memberships get independent cache entries — cross-user
data leakage through the cache is impossible.
- `BOTCache` is **not** user-scoped: byte offsets are only accessible after the
secured `InstancePathCache` lookup succeeds, so access control is enforced upstream.

### Cache Statistics

Both caches expose a `.stats` property returning:

```json
{
  "entries": 42000,
  "max_entries": 100000,
  "hits": 1200000,
  "misses": 42000,
  "hit_rate": "96.6%"
}
```

Stats are included in every `/api/metrics` response and pushed to WebSocket
clients every second.

### Cache Priming (`POST /api/dicomweb/prime`)

For workflows that need guaranteed sub-100 ms frame latency from the start
(e.g., before a radiologist opens a study), the prime endpoint pre-warms all
tiers for an entire series in parallel:

```
1. resolve_instance_paths  → populates instance_path_cache (Tier 1 + 2)
2. file_prefetcher.schedule → downloads files into RAM buffer
3. ThreadPoolExecutor(8)    → compute BOT for every instance concurrently
   └─ bot_cache.put         → Tier 1
   └─ lb_utils.insert_frame_ranges → Tier 2
```

Response includes per-instance status (`already_cached`, `computed`, `error`)
and aggregate timing.

---

## 7. STOW-RS — Dual-Path Upload

### Path Selection

```
Incoming POST /api/dicomweb/studies[/{study_uid}]
                         │
               Content-Length known?
                    ┌────┴────┐
                   yes        no
                    │          │
              size > STOW_STREAMING_MAX_BYTES? │
                ┌───┴───┐      │
               yes       no    │
                │         └────┤
                │         Streaming path
                │
          Legacy Spark path
```

The `STOW_STREAMING_MAX_BYTES` threshold is compared to `Content-Length`
(`5242880` in `app.yml`, `524288000` fallback in code). If the header is
absent the streaming path is always used.

### Streaming Path (default)

For uploads at or below the threshold:

```
Client multipart/related body
  │
  ▼
asyncio.Queue (unbounded) ◄── body drain coroutine
  │
  ▼ (per part, as boundaries are found)
async_stream_split_to_volumes()
  ├─ scan first 64 KB → extract StudyUID, SeriesUID, SOPUID, NumberOfFrames
  │   (raw DICOM tag scanner — no pydicom dependency)
  ├─ stream part bytes → PUT /Volumes/…/stow/{Study}/{Series}/{SOP}.dcm
  │   (with STOW_VOLUMES_CONCURRENCY semaphore)
  └─ return PartResult{status, output_path, sop_uid, series_uid, study_uid,
                        num_frames, file_size}
  │
  ├─ INSERT stow_operations (status='completed', output_paths pre-populated)
  ├─ Fire Spark job for Phase 2 only (metadata extraction)
  ├─ _cache_streaming_results → instance_path_cache (Tier 1) + Lakebase (Tier 2)
  └─ Return JSON receipt immediately
```

Memory usage is `O(header_buf + chunk_size)` per part (~128 KB typical).

**Back-pressure prevention**: the body is drained into an `asyncio.Queue`
immediately, decoupled from the Volumes PUT writes. This prevents the
Databricks Apps reverse proxy from timing out an idle inbound connection when
cloud writes are slower than the client's upload rate.

**Direct cloud upload** (optional): when `STOW_DIRECT_CLOUD_UPLOAD=true`, the
streaming path writes parts directly to S3/ADLS/GCS via UC credential vending
instead of through the Volumes Files API (see §8).

### Legacy Spark Path (large uploads)

For uploads above the threshold:

```
Client body
  │
  ▼
async_stream_to_volumes()
  → PUT /Volumes/…/stow/{date}/{uuid}.mpr   (single concatenated file)
  │
  ├─ Buffer STOW audit record in _StowRecordBuffer
  │   (flushed every 2s or every 100 records via background thread)
  ├─ asyncio.create_task(_background_fire())
  │   → trigger {APP_NAME}_stow_processor Spark job
  │       Task 1 (split): .mpr → individual .dcm files
  │       Task 2 (meta):  extract DICOM metadata → catalog
  └─ Return JSON receipt immediately (status='accepted')
```

**Run coalescing**: at most one running + one queued Spark run is allowed.
If two are already active, the trigger is skipped — the queued run will pick
up the new `.mpr` file.

### STOW Audit Table

Both paths write to `{catalog}.{schema}.stow_operations`:


| Column         | Streaming path                         | Legacy path                  |
| -------------- | -------------------------------------- | ---------------------------- |
| `file_id`      | UUID                                   | UUID                         |
| `volume_path`  | Base STOW path                         | `.mpr` file path             |
| `file_size`    | Total bytes across all parts           | Total `.mpr` bytes           |
| `status`       | `completed` (immediate)                | `pending` → updated by Spark |
| `output_paths` | Array of `.dcm` paths                  | Populated by Spark Task 1    |
| `user_email`   | From `X-Forwarded-Email` or SCIM `/Me` | Same                         |


The `_StowRecordBuffer` coalesces concurrent uploads into batch INSERTs,
capped at `STOW_SQL_BATCH_SIZE` rows and flushed every `STOW_SQL_FLUSH_INTERVAL_S`
seconds. This is flushed to zero during graceful shutdown.

### User Email Resolution

```
X-Forwarded-Email header (Databricks Apps proxy)  ← fast path
         ↓ missing
Authorization: Bearer <token> → GET /api/2.0/preview/scim/v2/Me  ← SCIM fallback
         (result cached by first 16 chars of token)
```

---

## 8. Direct Cloud Upload

When `STOW_DIRECT_CLOUD_UPLOAD=true` and the target volume is an **External Volume**:

```
Gateway ──(1) POST /api/2.1/unity-catalog/temporary-path-credentials──▶ Databricks
         ◄── SAS / presigned URL + short-lived cloud credentials ────────
         
         (credentials cached for ~55 min; refreshed 5 min before expiry)

Gateway ──(2) PutObject / UploadBlob / upload_from_file ──────────────▶ S3 / ADLS / GCS
         (native cloud SDK — no Databricks API rate limiting in data path)
```

### Provider Support


| Cloud | SDK                    | Upload method                                |
| ----- | ---------------------- | -------------------------------------------- |
| AWS   | `boto3`                | `upload_fileobj` (auto-multipart for > 8 MB) |
| Azure | `azure-storage-blob`   | `upload_blob`                                |
| GCP   | `google-cloud-storage` | `upload_from_file`                           |


The provider is auto-detected from the cloud URL prefix returned by credential
vending (`s3://`, `abfss://`, `gs://`).

### Diagnostics

`GET /api/stow/status` returns:

```json
{
  "direct_upload_enabled": true,
  "mode": "direct_cloud",
  "provider": "aws",
  "cloud_url": "s3://my-bucket/dicom/",
  "volumes_concurrency": 8,
  "probe_error": null
}
```

---

## 9. Security & Authentication

### Auth Modes

#### App Auth (default, `DICOMWEB_USE_USER_AUTH=false`)

- A single `DICOMwebDatabricksWrapper` is created at module load time and
reused for all requests.
- The Databricks SDK `Config` auto-refreshes the service-principal bearer
token. The `app_token_provider()` function checks the JWT `exp` claim with a
5-minute buffer and forces a re-auth if the token is near expiry.
- All SQL queries, Volumes reads, and Lakebase calls use the app's
service-principal identity.

#### User OBO Auth (`DICOMWEB_USE_USER_AUTH=true`)

- A new `DICOMwebDatabricksWrapper` is created for **every request** because
the token, group memberships, and `pixels_table` (from cookie) can differ
per user.
- The user's bearer token is taken from the `X-Forwarded-Access-Token` header
(set by the Databricks Apps proxy). Missing token → HTTP 401.
- `pixels_table` is resolved from `pixels_table` cookie → `DATABRICKS_PIXELS_TABLE`
env var (in that priority order).

### Row-Level Security (RLS)

When `LAKEBASE_RLS_ENABLED=true` (feature flag in `dbx.pixels.lakebase`):

1. `resolve_user_groups(request)` resolves the user's Databricks account groups:
  - Fast path: in-memory `_user_groups_cache` (keyed by email).
  - Slow path: `lb_utils.get_user_groups(email)` — Lakebase query.
2. `user_groups` is passed to wrapper methods and cache operations.
3. Lakebase queries filter results by `allowed_groups` (array overlap).
4. `InstancePathCache` keys include a hash of the group set — users with
  different group memberships never share cache entries.

### SQL Injection Prevention

All queries use parameterized execution via the Databricks SQL Connector.
Table names are validated with `validate_table_name()` (regex: `^[\w.]+$`)
before use. No user input is ever string-interpolated into SQL.

---

## 10. Metrics & Observability

### Gateway Counters

`_InstrumentMiddleware` maintains four process-global counters (not metrics
library — plain Python ints for zero-overhead per-request cost):


| Counter               | Description                                |
| --------------------- | ------------------------------------------ |
| `_gw_req_count`       | Total requests since last snapshot         |
| `_gw_req_errors`      | 4xx/5xx responses since last snapshot      |
| `_gw_req_latency_sum` | Sum of elapsed seconds since last snapshot |
| `_gw_req_in_flight`   | Current in-flight requests (gauge)         |


### Metrics Reporter

`_metrics_reporter()` runs every `DICOMWEB_METRICS_INTERVAL` seconds:

1. Calls `_snapshot_and_reset()` — captures and zeroes the counters.
2. Collects system metrics via `psutil` (CPU %, RSS, available RAM, thread count, network connections).
3. Collects cache statistics (`bot_cache.stats`, `instance_path_cache.stats`, `file_prefetcher.stats`).
4. Writes the snapshot to Lakebase `endpoint_metrics` table.
5. Pushes the payload to all connected WebSocket clients.

### MetricsStore (`utils/metrics_store.py`)

A standalone Lakebase client (independent of the main `LakebaseUtils`) that
handles only the `endpoint_metrics` table:

- Credentials via Databricks SDK `WorkspaceClient` — auto-refreshed 5 min
before the 1-hour token expiry.
- `INSERT ... ON CONFLICT DO UPDATE` for idempotent writes.
- Auto-purges rows older than 7 days (`_RETENTION_HOURS = 168`).
- `get_latest_metrics()` supports time-window filtering and uniform
downsampling to ≤ `max_points` (default 300) for lean responses.

### Live Dashboard

`GET /api/dashboard` serves a Chart.js dashboard that connects to
`WS /ws/metrics` and renders real-time charts for:

- Request rate and error rate
- Average latency
- In-flight requests
- CPU and memory usage
- BOT cache and instance-path cache hit rates
- Prefetcher buffer utilization

---

## 11. Configuration Reference

### Environment Variables Summary

#### dicom_web (Viewer)


| Variable                   | Required | Default | Notes                     |
| -------------------------- | -------- | ------- | ------------------------- |
| `DICOMWEB_GATEWAY_URL`     | Yes      | —       | URL of the gateway app    |
| `DATABRICKS_WAREHOUSE_ID`  | Yes      | —       | SQL Warehouse ID          |
| `DATABRICKS_PIXELS_TABLE`  | Yes      | —       | `catalog.schema.table`    |
| `MONAI_SERVING_ENDPOINT`   | No       | —       | MONAI Label endpoint name |
| `DICOMWEB_USE_USER_AUTH`   | No       | `false` | OBO user auth             |
| `DICOMWEB_MAX_CONNECTIONS` | No       | `200`   | Proxy connection pool     |
| `DICOMWEB_MAX_KEEPALIVE`   | No       | `100`   | Proxy keepalive pool      |
| `DB_PIXELS_LOG_LEVEL`      | No       | `INFO`  | Log level                 |


#### dicom_web_gateway


| Variable                              | Required       | Default                   | Notes                                                         |
| ------------------------------------- | -------------- | ------------------------- | ------------------------------------------------------------- |
| `DATABRICKS_WAREHOUSE_ID`             | Yes            | —                         | SQL Warehouse ID                                              |
| `DATABRICKS_PIXELS_TABLE`             | Yes            | —                         | `catalog.schema.table`                                        |
| `LAKEBASE_INSTANCE_NAME`              | No             | `pixels-lakebase`         | Lakebase instance                                             |
| `LAKEBASE_INIT_DB`                    | No             | `false`                   | Run DDL on startup                                            |
| `DATABRICKS_STOW_VOLUME_PATH`         | Yes (for STOW) | —                         | Base path for uploads                                         |
| `STOW_DIRECT_CLOUD_UPLOAD`            | No             | `false`                   | Bypass Files API                                              |
| `STOW_STREAMING_MAX_BYTES`            | No             | `5242880`                 | Streaming threshold in `app.yml` (code fallback: `524288000`) |
| `STOW_THREAD_POOL_SIZE`               | No             | `64`                      | Default executor workers                                      |
| `STOW_SQL_BATCH_SIZE`                 | No             | `100`                     | Audit record batch size                                       |
| `STOW_SQL_FLUSH_INTERVAL_S`           | No             | `2.0`                     | Audit record flush interval                                   |
| `STOW_VOLUMES_CONCURRENCY`            | No             | `8`                       | Concurrent Volumes PUTs                                       |
| `PIXELS_BOT_CACHE_MAX_ENTRIES`        | No             | `1000000`                 | BOT cache capacity                                            |
| `PIXELS_PATH_CACHE_MAX_ENTRIES`       | No             | `1000000`                 | Path cache capacity                                           |
| `PIXELS_PREFETCH_ENABLED`             | No             | `false`                   | RAM prefetch                                                  |
| `PIXELS_PREFETCH_RAM_RATIO`           | No             | `0.50`                    | RAM budget fraction                                           |
| `PIXELS_PREFETCH_MAX_MEMORY_MB`       | No             | —                         | Hard RAM cap                                                  |
| `PIXELS_PREFETCH_MAX_FILE_MB`         | No             | `512`                     | Per-file prefetch cap                                         |
| `PIXELS_FRAME_CACHE_DIR`              | No             | `/tmp/pixels_frame_cache` | Disk cache dir                                                |
| `PIXELS_FRAME_CACHE_MAX_GB`           | No             | `50`                      | Disk cache cap                                                |
| `DICOMWEB_MAX_CONNECTIONS`            | No             | `200`                     | Volumes connection pool                                       |
| `DICOMWEB_MAX_KEEPALIVE`              | No             | `100`                     | Volumes keepalive pool                                        |
| `DICOMWEB_METRICS_INTERVAL`           | No             | `1`                       | Metrics push interval (s)                                     |
| `DICOMWEB_ANYIO_THREAD_TOKENS`        | No             | `128`                     | AnyIO thread limiter for sync workloads                       |
| `DICOMWEB_ENABLE_WADO_SERIES_PRIMING` | No             | `false`                   | Enable opportunistic series-level pre-priming                 |
| `PIXELS_WADO_PREFETCH_WAIT_S`         | No             | `0.05`                    | Max wait to consume prefetched bytes before fallback          |
| `PIXELS_BACKGROUND_POOL_WORKERS`      | No             | `16`                      | Worker count for background frame reads                       |
| `PIXELS_FILES_POOL_CONNECTIONS`       | No             | `20`                      | Requests adapter pooled host entries                          |
| `PIXELS_FILES_POOL_MAXSIZE`           | No             | `200`                     | Requests adapter max connections per pool                     |
| `PIXELS_PREFETCH_POOL_CONNECTIONS`    | No             | `20`                      | Prefetch session pooled host entries                          |
| `PIXELS_PREFETCH_POOL_MAXSIZE`        | No             | `50`                      | Prefetch session max connections per pool                     |
| `DICOMWEB_USE_USER_AUTH`              | No             | `false`                   | OBO user auth                                                 |


### BOT Cache Memory Sizing Guide


| Modality                  | Avg frames/file | Memory per entry | 100k entries |
| ------------------------- | --------------- | ---------------- | ------------ |
| X-ray / CR (single frame) | 1               | ~1.7 KB          | ~170 MB      |
| Ultrasound (10-frame avg) | 10              | ~7 KB            | ~700 MB      |
| CT (50-frame avg)         | 50              | ~31 KB           | ~3 GB        |


Each entry stores the frame list plus a `frame_number → frame_dict` index for
O(1) single-frame lookup.

---

## 12. File Inventory

### `dicom_web/`


| File                   | Purpose                                                |
| ---------------------- | ------------------------------------------------------ |
| `app.py`               | FastAPI app: reverse proxy + common route registration |
| `app-config.yml`       | Databricks App environment config (templated)          |
| `app.yml`              | Default environment variable values                    |
| `requirements.txt`     | Python dependencies                                    |
| `pages/dashboard.html` | Live metrics dashboard                                 |
| `pages/benchmark.html` | WADO-RS vs. WADO-URI latency benchmark UI              |


### `dicom_web_gateway/utils/`


| File                     | Purpose                                                       |
| ------------------------ | ------------------------------------------------------------- |
| `__init__.py`            | `timing_decorator` — logs handler duration at DEBUG level     |
| `wrapper.py`             | `DICOMwebDatabricksWrapper` — orchestrates SQL + cache + I/O  |
| `sql_client.py`          | `DatabricksSQLClient` — parameterized SQL, app/OBO auth       |
| `queries.py`             | SQL query builders for QIDO-RS, WADO-RS, STOW-RS              |
| `dicom_io.py`            | Byte-range reads, BOT computation, streaming, prefetcher      |
| `multipart_stream.py`    | Async multipart/related parser for STOW streaming path        |
| `cloud_direct_upload.py` | Direct S3/ADLS/GCS upload via UC credential vending           |
| `cache.py`               | `BOTCache` + `InstancePathCache` — thread-safe LRU            |
| `dicom_tags.py`          | Tag constants, VR type maps, JSON response formatter          |
| `metrics.py`             | Metrics collection helpers                                    |
| `handlers/__init__.py`   | Public handler function exports                               |
| `handlers/_common.py`    | Singletons (SQL client, Lakebase), auth, wrapper factory      |
| `handlers/_qido.py`      | QIDO-RS request handlers                                      |
| `handlers/_wado.py`      | WADO-RS, WADO-URI, resolve_paths, resolve_frame_ranges, prime |
| `handlers/_stow.py`      | STOW-RS dual-path handler + audit buffer                      |


### `dicom_web_gateway/`


| File                     | Purpose                                                           |
| ------------------------ | ----------------------------------------------------------------- |
| `app.py`                 | FastAPI gateway app — routes, middleware, metrics, lifespan       |
| `app-config.yml`         | Databricks App environment config                                 |
| `app.yml`                | Default environment variable values                               |
| `requirements.txt`       | Python dependencies                                               |
| `pages/dashboard.html`   | Live Chart.js dashboard with WebSocket feed                       |
| `utils/metrics_store.py` | `MetricsStore` — Lakebase client for `endpoint_metrics`           |
| `tests/`                 | Gateway-focused unit/integration tests for handlers and utilities |


### `common/`


| File                 | Purpose                                                 |
| -------------------- | ------------------------------------------------------- |
| `__init__.py`        | Package docstring                                       |
| `middleware.py`      | `TokenMiddleware`, `LoggingMiddleware`, `DBStaticFiles` |
| `routes.py`          | OHIF, MONAI, redaction, VLM route registration          |
| `redaction_utils.py` | Redaction job SQL helpers                               |
| `pages.py`           | Configuration page HTML                                 |
| `config.py`          | Shared configuration helpers                            |


---

## External Service Dependencies


| Service                      | Usage                                                      | Protocol                            |
| ---------------------------- | ---------------------------------------------------------- | ----------------------------------- |
| **Databricks SQL Warehouse** | QIDO-RS queries, STOW audit inserts, path resolution       | JDBC/ODBC (SQL Connector)           |
| **Databricks Volumes API**   | DICOM file reads (WADO-RS) and writes (STOW-RS)            | HTTPS (Files API)                   |
| **Lakebase**                 | BOT cache, instance paths, metrics time series, RLS groups | PostgreSQL wire protocol (psycopg2) |
| **Databricks Model Serving** | MONAI Label inference, LLM redaction, VLM analysis         | HTTPS (REST)                        |
| **Databricks Jobs API**      | STOW Spark job trigger (Phase 1 split + Phase 2 meta)      | HTTPS (REST)                        |
| **Databricks SCIM API**      | User email resolution for STOW audit records               | HTTPS (REST)                        |
| **S3 / ADLS Gen2 / GCS**     | Direct cloud upload (optional, external volumes only)      | Native SDK                          |
| **UC Credential Vending**    | Temporary cloud credentials for direct upload              | HTTPS (REST)                        |


