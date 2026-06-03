"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[9605],{

/***/ 89605
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ src)
});

// UNUSED EXPORTS: id

;// ../../../../../../../plugins/ohifv3/extensions/nifti-segmentation/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/extension-nifti-segmentation"}');
;// ../../../../../../../plugins/ohifv3/extensions/nifti-segmentation/src/id.ts
/*
 * NIfTI Segmentation Overlay extension id.
 *
 * Modes reference panel/command modules via this id (e.g.
 * `${id}.panelModule.niftiOverlayPanel`), so it MUST equal
 * `packageJson.name` exactly — the same convention used by
 * @ohif/extension-image-redactor and @ohif/extension-monai-label.
 * Appending `@${version}` here would break those references.
 */

const id = package_namespaceObject.UU;

/* harmony default export */ const src_id = ((/* unused pure expression or super */ null && (id)));
// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
;// ../../../../../../../plugins/ohifv3/extensions/nifti-segmentation/src/components/NiftiOverlayPanel.css
// extracted by mini-css-extract-plugin

// EXTERNAL MODULE: ../../../node_modules/axios/index.js + 49 modules
var axios = __webpack_require__(17739);
;// ../../../../../../../plugins/ohifv3/extensions/nifti-segmentation/src/services/NiftiOverlayClient.ts
/*
 * NiftiOverlayClient
 * ──────────────────
 *
 * Browser-side gateway client for the NIfTI segmentation overlay feature.
 *
 * Implements decisions D13 (URL discovery) and D14 (auth) from
 * ../../../../../NIFTI_OVERLAY_PLAN.md:
 *
 *   - Base URL resolution:
 *       window.config.niftiOverlay.baseUrl
 *         ?? activeDataSource.getConfig().qidoRoot
 *         ?? activeDataSource.configuration.qidoRoot
 *   - Path joining: <baseUrl><pathPrefix><endpoints.related|fetch>
 *       defaults: pathPrefix='/nifti', related='/related', fetch='/fetch'
 *   - Auth: when auth.mode === 'inherit' (default), each request inherits the
 *     header object returned by
 *       servicesManager.services.userAuthenticationService.getAuthorizationHeader()
 *     which the DatabricksPixelsDicom data source populates with
 *       { Authorization: `Bearer ${token}` }
 *     (see ../../../default/src/DatabricksPixelsDicom/index.js).
 *
 * Resolution is intentionally lazy (per-call, not in the constructor) so the
 * client remains correct across data-source switches and token refreshes.
 *
 * Response shapes mirror what `nifti_overlay/routes.py` returns:
 *   - GET /related?study=…&series=…              → NiftiOverlayRecord[]
 *   - GET /fetch?study=…&series=…&id=…           → ArrayBuffer (.nii.gz bytes)
 *
 * Why `/fetch` requires `study` and `series` even though `id` is unique:
 * the backing Delta table uses
 * `CLUSTER BY (study_instance_uid, series_instance_uid)` (liquid clustering),
 * so passing those predicates lets the warehouse prune files before applying
 * the id lookup. Without them the warehouse has to scan every clustered
 * file to find the row.
 *
 * Smoke test (run from the browser console while local-dev is up):
 *
 *   const { extensionManager, servicesManager } = window.ohif; // or pull from a panel
 *   const { default: NiftiOverlayClient } =
 *     await import('@ohif/extension-nifti-segmentation/src/services/NiftiOverlayClient');
 *   const client = new NiftiOverlayClient({ extensionManager, servicesManager });
 *   console.log(await client.related('<studyUid>', '<seriesUid>'));
 */



// --------------------------------------------------------------------------- //
//  Public types                                                                //
// --------------------------------------------------------------------------- //

/** One entry in the Delta-table `label_info` VARIANT column. */

/** Response row from GET /nifti/related (no `path`, by design — see D12). */

/** Subset of `window.config.niftiOverlay` that the client cares about. */

/** Thin wrapper around the underlying axios/HTTP error with stable fields. */
class NiftiOverlayClientError extends Error {
  constructor(message, opts = {}) {
    super(message);
    this.status = void 0;
    this.url = void 0;
    this.name = 'NiftiOverlayClientError';
    this.status = opts.status;
    this.url = opts.url;
    if (opts.cause !== undefined) {
      this.cause = opts.cause;
    }
  }
}

// --------------------------------------------------------------------------- //
//  Defaults                                                                    //
// --------------------------------------------------------------------------- //

const DEFAULT_PATH_PREFIX = '/nifti';
const DEFAULT_RELATED_ENDPOINT = '/related';
const DEFAULT_FETCH_ENDPOINT = '/fetch';
const RELATED_TIMEOUT_MS = 30_000;
const FETCH_TIMEOUT_MS = 300_000;

// --------------------------------------------------------------------------- //
//  Client                                                                      //
// --------------------------------------------------------------------------- //

class NiftiOverlayClient {
  constructor({
    extensionManager,
    servicesManager,
    config
  }) {
    this.extensionManager = void 0;
    this.servicesManager = void 0;
    this.explicitConfig = void 0;
    if (!extensionManager) {
      throw new Error('NiftiOverlayClient: extensionManager is required');
    }
    if (!servicesManager) {
      throw new Error('NiftiOverlayClient: servicesManager is required');
    }
    this.extensionManager = extensionManager;
    this.servicesManager = servicesManager;
    this.explicitConfig = config ?? null;
  }

  /**
   * GET /nifti/related?study=…&series=…
   * Returns the list of overlays available for a (study, series) pair.
   * The server returns rows ordered by `version DESC NULLS LAST, created_at DESC`,
   * with archived rows excluded.
   */
  async related(studyInstanceUID, seriesInstanceUID) {
    if (!studyInstanceUID) {
      throw new Error('NiftiOverlayClient.related: studyInstanceUID is required');
    }
    if (!seriesInstanceUID) {
      throw new Error('NiftiOverlayClient.related: seriesInstanceUID is required');
    }
    const url = this.endpointUrl('related');
    const headers = {
      Accept: 'application/json',
      ...this.authHeaders()
    };
    try {
      const response = await axios/* default */.Ay.get(url, {
        headers,
        params: {
          study: studyInstanceUID,
          series: seriesInstanceUID
        },
        responseType: 'json',
        timeout: RELATED_TIMEOUT_MS
      });
      const data = response.data;
      if (!Array.isArray(data)) {
        throw new NiftiOverlayClientError(`NiftiOverlayClient.related: expected JSON array response, got ${typeof data}`, {
          url,
          status: response.status
        });
      }
      return data;
    } catch (err) {
      throw this.wrapError(err, url, 'related');
    }
  }

  /**
   * GET /nifti/fetch?study=…&series=…&id=…
   * Streams the raw `.nii.gz` bytes for an overlay row and returns them as an
   * ArrayBuffer ready to hand to nifti-reader-js / pako (Step 6).
   *
   * `studyInstanceUID` and `seriesInstanceUID` are required even though `id`
   * is unique: the backing Delta table is liquid-clustered by
   * `(study_instance_uid, series_instance_uid)`, so passing those predicates
   * lets the warehouse prune clustered files before the id lookup.
   */
  async fetch(studyInstanceUID, seriesInstanceUID, id) {
    if (!studyInstanceUID) {
      throw new Error('NiftiOverlayClient.fetch: studyInstanceUID is required');
    }
    if (!seriesInstanceUID) {
      throw new Error('NiftiOverlayClient.fetch: seriesInstanceUID is required');
    }
    if (!id) {
      throw new Error('NiftiOverlayClient.fetch: id is required');
    }
    const url = this.endpointUrl('fetch');
    const headers = {
      Accept: 'application/octet-stream',
      ...this.authHeaders()
    };
    try {
      const response = await axios/* default */.Ay.get(url, {
        headers,
        params: {
          study: studyInstanceUID,
          series: seriesInstanceUID,
          id
        },
        responseType: 'arraybuffer',
        timeout: FETCH_TIMEOUT_MS
      });
      const data = response.data;
      if (!(data instanceof ArrayBuffer)) {
        throw new NiftiOverlayClientError('NiftiOverlayClient.fetch: response was not an ArrayBuffer', {
          url,
          status: response.status
        });
      }
      return data;
    } catch (err) {
      throw this.wrapError(err, url, 'fetch');
    }
  }

  // ----------------------------------------------------------------------- //
  //  Internals                                                                //
  // ----------------------------------------------------------------------- //

  /** Resolve the active `niftiOverlay` config block, lazily, at call time. */
  getConfig() {
    if (this.explicitConfig) return this.explicitConfig;
    if (typeof window !== 'undefined') {
      const cfg = window.config?.niftiOverlay;
      if (cfg) return cfg;
    }
    return {};
  }

  /**
   * Resolve the base URL per D13: explicit override first, then the active
   * data source's `qidoRoot`. Throws a clear error if neither is available
   * (e.g. the active data source is `databricksPixelsDicom`, which exposes
   * `serverHostname` rather than `qidoRoot` — in that case the user must set
   * `niftiOverlay.baseUrl` explicitly).
   */
  resolveBaseUrl() {
    const cfg = this.getConfig();
    if (cfg.baseUrl) {
      return stripTrailingSlashes(String(cfg.baseUrl));
    }
    const qidoRoot = this.resolveQidoRoot();
    if (!qidoRoot) {
      throw new NiftiOverlayClientError('NiftiOverlayClient: cannot resolve base URL. niftiOverlay.baseUrl is null ' + 'and the active data source does not expose a qidoRoot. Set ' + 'niftiOverlay.baseUrl in the OHIF app-config or switch to a data source ' + 'that exposes qidoRoot (e.g. @ohif/extension-default.dataSourcesModule.dicomweb).');
    }
    return stripTrailingSlashes(qidoRoot);
  }
  resolveQidoRoot() {
    const em = this.extensionManager;
    if (!em) return undefined;
    let dataSource = null;
    try {
      if (typeof em.getActiveDataSource === 'function') {
        const result = em.getActiveDataSource();
        dataSource = Array.isArray(result) ? result[0] : result;
      }
    } catch {
      // ignore and try the fallback below
    }
    if (!dataSource && typeof em.getDataSources === 'function') {
      try {
        const sources = em.getDataSources();
        if (Array.isArray(sources) && sources.length > 0) {
          dataSource = sources[0];
        }
      } catch {
        // ignore
      }
    }
    if (!dataSource) return undefined;

    // Some data sources expose `getConfig()`; others store the raw config on
    // `.configuration`. Try both.
    let cfg = null;
    if (typeof dataSource.getConfig === 'function') {
      try {
        cfg = dataSource.getConfig();
      } catch {
        cfg = null;
      }
    }
    const qidoRoot = cfg?.qidoRoot ?? dataSource.configuration?.qidoRoot;
    return typeof qidoRoot === 'string' && qidoRoot.length > 0 ? qidoRoot : undefined;
  }

  /** Build the full URL for one of the configured endpoints. */
  endpointUrl(endpoint) {
    const cfg = this.getConfig();
    const baseUrl = this.resolveBaseUrl();
    const prefix = ensureLeadingSlash(stripTrailingSlashes(cfg.pathPrefix ?? DEFAULT_PATH_PREFIX));
    const endpointPath = ensureLeadingSlash(endpoint === 'related' ? cfg.endpoints?.related ?? DEFAULT_RELATED_ENDPOINT : cfg.endpoints?.fetch ?? DEFAULT_FETCH_ENDPOINT);
    return `${baseUrl}${prefix}${endpointPath}`;
  }

  /**
   * Resolve auth headers per D14. Mode 'inherit' (default) reads the current
   * Authorization header from OHIF's userAuthenticationService — the same
   * header the active DICOMweb data source uses for QIDO/WADO. Mode 'none'
   * sends no Authorization header.
   */
  authHeaders() {
    const cfg = this.getConfig();
    const mode = cfg.auth?.mode ?? 'inherit';
    if (mode === 'none') return {};
    const authService = this.servicesManager?.services?.userAuthenticationService;
    const getHeader = authService?.getAuthorizationHeader;
    if (typeof getHeader !== 'function') return {};
    let header;
    try {
      header = getHeader.call(authService);
    } catch {
      return {};
    }
    if (!header) return {};
    if (typeof header === 'string') {
      return {
        Authorization: header
      };
    }
    if (typeof header === 'object') {
      return {
        ...header
      };
    }
    return {};
  }
  wrapError(err, url, op) {
    if (err instanceof NiftiOverlayClientError) return err;
    if (axios/* default.isAxiosError */.Ay.isAxiosError(err)) {
      const status = err.response?.status;
      const detail = extractAxiosErrorDetail(err);
      const message = `NiftiOverlayClient.${op} failed: ${err.message}` + (status !== undefined ? ` (status ${status})` : '') + (detail ? ` — ${detail}` : '') + ` [url=${url}]`;
      return new NiftiOverlayClientError(message, {
        status,
        url,
        cause: err
      });
    }
    const message = err?.message ?? String(err);
    return new NiftiOverlayClientError(`NiftiOverlayClient.${op} failed unexpectedly: ${message} [url=${url}]`, {
      url,
      cause: err
    });
  }
}
/* harmony default export */ const services_NiftiOverlayClient = (NiftiOverlayClient);

// --------------------------------------------------------------------------- //
//  Small helpers                                                               //
// --------------------------------------------------------------------------- //

function stripTrailingSlashes(s) {
  return (s ?? '').replace(/\/+$/, '');
}
function ensureLeadingSlash(s) {
  if (!s) return '';
  return s.startsWith('/') ? s : `/${s}`;
}

/**
 * Try to surface the FastAPI `{detail: ...}` field (or any string body) without
 * dumping a giant binary response into the message.
 */
function extractAxiosErrorDetail(err) {
  const data = err?.response?.data;
  if (!data) return undefined;
  if (typeof data === 'string') {
    return data.length > 200 ? `${data.slice(0, 200)}…` : data;
  }
  if (typeof data === 'object' && typeof data.detail === 'string') {
    return data.detail;
  }
  return undefined;
}
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
// EXTERNAL MODULE: ../../../node_modules/nifti-reader-js/dist/src/nifti.js
var nifti = __webpack_require__(97071);
// EXTERNAL MODULE: ../../../node_modules/pako/dist/pako.esm.mjs
var pako_esm = __webpack_require__(41135);
;// ../../../../../../../plugins/ohifv3/extensions/nifti-segmentation/src/utils/affineUtils.ts
/*
 * affineUtils
 * ───────────
 *
 * Pure-math helpers for the NIfTI segmentation overlay feature. No DOM, no
 * Cornerstone3D, no VTK.js — these utilities operate on plain numbers and are
 * unit-testable in isolation.
 *
 * Key things this module owns:
 *
 *   - Affine flat-vs-nested conversion. `nifti-reader-js` exposes the affine
 *     as `number[4][4]` (row-major nested). The feature plan calls for
 *     `number[16]` row-major flat. We standardize on flat row-major
 *     internally; conversion helpers are exported.
 *
 *   - RAS↔LPS conversion. NIfTI is RAS+ (right/anterior/superior positive).
 *     DICOM and Cornerstone3D are LPS (left/posterior/superior positive).
 *     RAS→LPS is `diag(-1, -1, 1, 1) · A` — i.e. negate the first two rows of
 *     the affine. Forgetting this makes overlays appear mirrored on the X/Y
 *     axes and not on Z. See SESSION_CONTEXT.md "NIfTI is RAS+, DICOM/
 *     Cornerstone3D is LPS" for the long form.
 *
 *   - Grid decomposition. From a 4×4 affine we extract:
 *       - origin   = last column of the upper 3×4 block
 *       - spacing  = magnitudes of the three column vectors of the upper 3×3
 *       - direction = the three column vectors of the upper 3×3 normalized,
 *         stored row-major (`direction[r*3 + c]` = component r of column c)
 *
 *   - `gridsMatch(a, b, tol)` — element-wise tolerance comparison of `dims`,
 *     `spacing`, `origin`, and `direction`. Intended to gate the fast path
 *     ("NIfTI lines up with the DICOM volume — pass voxel buffer through
 *     unchanged") in Step 8 from the slow VTK.js resample path in Step 9.
 *
 * Tolerance defaults mirror the `niftiOverlay.alignment` block in
 * `plugins/ohifv3/config/databricks.js`:
 *
 *   - spacingTolerance:   1e-4   (mm)
 *   - originTolerance:    1e-4   (mm)
 *   - directionTolerance: 1e-4   (cosine difference)
 *   - dimsExact:          true   (integer dims must match exactly)
 */

// ─────────────────────────────────────────────────────────────────────────── //
//  Public types                                                                //
// ─────────────────────────────────────────────────────────────────────────── //

/** Row-major 3×3 matrix. `m[r * 3 + c]` = entry at row r, column c. */

/** Row-major 4×4 matrix. `m[r * 4 + c]` = entry at row r, column c. */

/**
 * Geometric description of a 3D voxel grid in world coordinates (LPS by
 * convention here, since that's what Cornerstone3D and the rest of the
 * overlay pipeline expect).
 */

/** Per-axis tolerances for {@link gridsMatch}. */

const DEFAULT_TOL = {
  spacing: 1e-4,
  origin: 1e-4,
  direction: 1e-4,
  dimsExact: true
};

// ─────────────────────────────────────────────────────────────────────────── //
//  Affine flat ↔ nested conversion                                             //
// ─────────────────────────────────────────────────────────────────────────── //

/**
 * Flatten a `number[4][4]` row-major affine (the shape `nifti-reader-js`
 * exposes on its header) to the flat `Mat4` row-major form used everywhere
 * else in this module.
 */
function flattenAffine(rows) {
  if (!rows || rows.length !== 4) {
    throw new Error(`affineUtils.flattenAffine: expected 4 rows, got ${rows ? rows.length : 'null'}`);
  }
  const out = new Array(16);
  for (let r = 0; r < 4; r++) {
    const row = rows[r];
    if (!row || row.length !== 4) {
      throw new Error(`affineUtils.flattenAffine: row ${r} must have 4 entries, got ${row ? row.length : 'null'}`);
    }
    for (let c = 0; c < 4; c++) {
      out[r * 4 + c] = row[c];
    }
  }
  return out;
}

/** Unflatten a row-major `Mat4` back to the `number[4][4]` shape. */
function unflattenAffine(m) {
  const out = [];
  for (let r = 0; r < 4; r++) {
    out.push([m[r * 4], m[r * 4 + 1], m[r * 4 + 2], m[r * 4 + 3]]);
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────── //
//  RAS ↔ LPS                                                                   //
// ─────────────────────────────────────────────────────────────────────────── //

/**
 * Convert a 4×4 affine from RAS+ (NIfTI convention) to LPS (DICOM /
 * Cornerstone3D convention) by negating the first two rows.
 *
 * Equivalent to left-multiplying by `diag(-1, -1, 1, 1)`. The bottom row
 * `[0 0 0 1]` is preserved.
 */
function rasToLps(affine) {
  return [-affine[0], -affine[1], -affine[2], -affine[3], -affine[4], -affine[5], -affine[6], -affine[7], affine[8], affine[9], affine[10], affine[11], affine[12], affine[13], affine[14], affine[15]];
}

/** Inverse of {@link rasToLps}. (`diag(-1,-1,1,1)` is its own inverse.) */
function lpsToRas(affine) {
  return rasToLps(affine);
}

// ─────────────────────────────────────────────────────────────────────────── //
//  Affine → grid decomposition                                                 //
// ─────────────────────────────────────────────────────────────────────────── //

/**
 * Decompose a 4×4 affine into `(origin, spacing, direction)`. Combined with
 * a `dims` triple this fully describes a 3D voxel grid.
 *
 * The affine is assumed to map (i, j, k, 1) voxel indices to (x, y, z, 1)
 * world coordinates. Spacing values are guaranteed non-negative; if a column
 * has zero magnitude (degenerate input), `spacing` is left at 0 for that axis
 * and the corresponding direction column is zeroed out (rather than NaN'd).
 */
function decomposeAffine(affine) {
  const origin = [affine[3], affine[7], affine[11]];

  // Columns of the upper 3x3.
  const cols = [[affine[0], affine[4], affine[8]], [affine[1], affine[5], affine[9]], [affine[2], affine[6], affine[10]]];
  const spacing = [0, 0, 0];
  const dirCols = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let c = 0; c < 3; c++) {
    const col = cols[c];
    const mag = Math.hypot(col[0], col[1], col[2]);
    spacing[c] = mag;
    if (mag > 0) {
      dirCols[c] = [col[0] / mag, col[1] / mag, col[2] / mag];
    }
  }

  // Pack into row-major 3x3: direction[r*3 + c] = component r of column c.
  const direction = [dirCols[0][0], dirCols[1][0], dirCols[2][0], dirCols[0][1], dirCols[1][1], dirCols[2][1], dirCols[0][2], dirCols[1][2], dirCols[2][2]];
  return {
    origin,
    spacing,
    direction
  };
}

// ─────────────────────────────────────────────────────────────────────────── //
//  Grid equality                                                               //
// ─────────────────────────────────────────────────────────────────────────── //

/**
 * True when two grids describe the same voxel lattice within the supplied
 * per-axis tolerances. All four pieces (`dims`, `spacing`, `origin`,
 * `direction`) must match for the result to be true.
 *
 * This is the gate between the fast path (direct buffer passthrough) and the
 * slow path (VTK.js resample) in the overlay pipeline.
 */
function gridsMatch(a, b, tol = {}) {
  const t = {
    ...DEFAULT_TOL,
    ...tol
  };
  if (t.dimsExact) {
    if (a.dims[0] !== b.dims[0] || a.dims[1] !== b.dims[1] || a.dims[2] !== b.dims[2]) {
      return false;
    }
  } else {
    if (Math.abs(a.dims[0] - b.dims[0]) > 0 || Math.abs(a.dims[1] - b.dims[1]) > 0 || Math.abs(a.dims[2] - b.dims[2]) > 0) {
      return false;
    }
  }
  for (let i = 0; i < 3; i++) {
    if (Math.abs(a.spacing[i] - b.spacing[i]) > t.spacing) return false;
    if (Math.abs(a.origin[i] - b.origin[i]) > t.origin) return false;
  }
  for (let i = 0; i < 9; i++) {
    if (Math.abs(a.direction[i] - b.direction[i]) > t.direction) return false;
  }
  return true;
}

// ─────────────────────────────────────────────────────────────────────────── //
//  Convenience constructors                                                    //
// ─────────────────────────────────────────────────────────────────────────── //

/**
 * Build a {@link Grid} from a 4×4 LPS affine and a `dims` triple. Convenience
 * wrapper around {@link decomposeAffine}.
 */
function gridFromAffine(affineLPS, dims) {
  const {
    origin,
    spacing,
    direction
  } = decomposeAffine(affineLPS);
  return {
    dims: [...dims],
    spacing,
    origin,
    direction
  };
}
;// ../../../../../../../plugins/ohifv3/extensions/nifti-segmentation/src/utils/NiftiReader.ts
/*
 * NiftiReader
 * ───────────
 *
 * Wraps `nifti-reader-js` (parsing) and `pako` (gzip decompression) into the
 * single high-level entry point `parseNifti(buffer)` that the overlay
 * pipeline consumes.
 *
 * Input:  raw `.nii` or `.nii.gz` bytes, exactly as
 *         `NiftiOverlayClient.fetch(study, series, id)` returns them.
 *
 * Output: a {@link ParsedNifti} — voxel data normalized to a single
 *         `Uint8Array` (segmentation label codes, 0–255), plus the geometric
 *         metadata needed to compare against the active Cornerstone3D volume:
 *
 *           - `affineRAS`   — flat row-major 4×4 in NIfTI's native RAS+ frame
 *           - `affineLPS`   — same affine flipped to DICOM/Cornerstone3D LPS
 *           - `dims`        — (x, y, z) voxel counts
 *           - `spacing`     — (x, y, z) voxel size in mm
 *           - `origin`      — world coord of voxel (0,0,0) in LPS
 *           - `direction`   — row-major 3×3 with normalized (i,j,k) direction
 *                             vectors as columns, in LPS
 *
 * Step-6 deliverable from `NIFTI_OVERLAY_PLAN.md`. Step 8 (`loadNiftiOverlay`)
 * will compare the returned grid to the active DICOM volume's grid using
 * `affineUtils.gridsMatch` to decide between fast-path passthrough and the
 * Step-9 VTK.js resample.
 *
 * Smoke test (browser console, with the local-dev viewer running):
 *
 *   const { default: NiftiOverlayClient } =
 *     await import('@ohif/extension-nifti-segmentation/src/services/NiftiOverlayClient');
 *   const { parseNifti } =
 *     await import('@ohif/extension-nifti-segmentation/src/utils/NiftiReader');
 *
 *   const client = new NiftiOverlayClient({ extensionManager, servicesManager });
 *   const recs   = await client.related(studyUid, seriesUid);
 *   const buf    = await client.fetch(studyUid, seriesUid, recs[0].id);
 *   const parsed = parseNifti(buf);
 *   console.log(parsed.dims, parsed.spacing, parsed.origin);
 */


// pako has no shipped types and we don't ship @types/pako; declare the bit we use.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore



// ─────────────────────────────────────────────────────────────────────────── //
//  Public types                                                                //
// ─────────────────────────────────────────────────────────────────────────── //

/** Thrown for any parse failure; preserves the original error as `cause`. */
class NiftiReaderError extends Error {
  constructor(message, opts = {}) {
    super(message);
    this.name = 'NiftiReaderError';
    if (opts.cause !== undefined) {
      this.cause = opts.cause;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────── //
//  Entry point                                                                 //
// ─────────────────────────────────────────────────────────────────────────── //

/**
 * Parse a `.nii` / `.nii.gz` ArrayBuffer into a {@link ParsedNifti}.
 *
 * Steps:
 *   1. gunzip the payload if the gzip magic (1f 8b) is present.
 *   2. confirm the result is a NIfTI file.
 *   3. read the header (NIFTI1 or NIFTI2).
 *   4. read the raw image bytes for the first volume (timeDim/statDim = 1).
 *   5. cast the bytes to per-voxel uint8 label codes.
 *   6. flatten the header's affine to row-major Mat4, derive the LPS affine,
 *      decompose into (origin, spacing, direction).
 *
 * Throws a {@link NiftiReaderError} on any failure (decompression, magic
 * mismatch, header read, unsupported datatype, dim sanity).
 */
function parseNifti(buffer) {
  if (!buffer || buffer.byteLength === 0) {
    throw new NiftiReaderError('parseNifti: input ArrayBuffer is empty or null');
  }
  let raw;
  try {
    raw = decompressIfGzipped(buffer);
  } catch (err) {
    throw new NiftiReaderError(`parseNifti: gzip decompression failed: ${err?.message ?? String(err)}`, {
      cause: err
    });
  }
  if (!nifti.isNIFTI(raw)) {
    throw new NiftiReaderError('parseNifti: payload is not a NIfTI file (NIFTI1/NIFTI2 magic missing)');
  }
  let header;
  try {
    header = nifti.readHeader(raw);
  } catch (err) {
    throw new NiftiReaderError(`parseNifti: nifti-reader-js failed to read header: ${err?.message ?? String(err)}`, {
      cause: err
    });
  }
  if (!header) {
    throw new NiftiReaderError('parseNifti: nifti-reader-js returned null header');
  }
  let imageBytes;
  try {
    imageBytes = nifti.readImage(header, raw);
  } catch (err) {
    throw new NiftiReaderError(`parseNifti: nifti-reader-js failed to read image: ${err?.message ?? String(err)}`, {
      cause: err
    });
  }
  const dims = [Number(header.dims?.[1] ?? 0), Number(header.dims?.[2] ?? 0), Number(header.dims?.[3] ?? 0)];
  if (dims[0] <= 0 || dims[1] <= 0 || dims[2] <= 0) {
    throw new NiftiReaderError(`parseNifti: invalid spatial dims ${JSON.stringify(dims)} ` + `(header.dims=${JSON.stringify(Array.from(header.dims ?? []))})`);
  }
  const expectedVoxelCount = dims[0] * dims[1] * dims[2];
  let dataU8;
  try {
    dataU8 = imageBytesToUint8(imageBytes, header.datatypeCode, header.numBitsPerVoxel, Boolean(header.littleEndian), expectedVoxelCount);
  } catch (err) {
    if (err instanceof NiftiReaderError) throw err;
    throw new NiftiReaderError(`parseNifti: voxel cast to Uint8 failed: ${err?.message ?? String(err)}`, {
      cause: err
    });
  }

  // The header's `affine` is `number[4][4]` in RAS+. Flatten and LPS-flip.
  let affineRAS;
  try {
    affineRAS = flattenAffine(header.affine);
  } catch (err) {
    throw new NiftiReaderError(`parseNifti: header affine had unexpected shape: ${err?.message ?? String(err)}`, {
      cause: err
    });
  }
  const affineLPS = rasToLps(affineRAS);
  const {
    origin,
    spacing,
    direction
  } = decomposeAffine(affineLPS);
  const out = {
    header: {
      littleEndian: Boolean(header.littleEndian),
      datatypeCode: Number(header.datatypeCode),
      numBitsPerVoxel: Number(header.numBitsPerVoxel),
      scl_slope: Number(header.scl_slope ?? 1),
      scl_inter: Number(header.scl_inter ?? 0),
      qform_code: Number(header.qform_code ?? 0),
      sform_code: Number(header.sform_code ?? 0),
      xyzt_units: Number(header.xyzt_units ?? 0),
      description: String(header.description ?? ''),
      raw: header
    },
    dataU8,
    affineRAS,
    affineLPS,
    dims,
    spacing,
    origin,
    direction
  };
  return out;
}
/* harmony default export */ const NiftiReader = (parseNifti);

// ─────────────────────────────────────────────────────────────────────────── //
//  Decompression                                                               //
// ─────────────────────────────────────────────────────────────────────────── //

/**
 * Detect the gzip magic (`1f 8b`) and pako-inflate when present. Otherwise
 * pass through. Returns a fresh `ArrayBuffer` either way (the inflated buffer
 * is sliced from the underlying `Uint8Array` when needed).
 */
function decompressIfGzipped(buffer) {
  const view = new Uint8Array(buffer);
  if (view.length < 2 || view[0] !== 0x1f || view[1] !== 0x8b) {
    return buffer;
  }
  const inflated = pako_esm/* default.inflate */.Ay.inflate(view);
  // pako returns a Uint8Array which may be a view over a larger buffer; slice
  // out exactly the bytes we need so downstream `new TypedArray(buffer)` calls
  // see a tightly-sized ArrayBuffer.
  return inflated.buffer.slice(inflated.byteOffset, inflated.byteOffset + inflated.byteLength);
}

// ─────────────────────────────────────────────────────────────────────────── //
//  Voxel cast                                                                  //
// ─────────────────────────────────────────────────────────────────────────── //

/**
 * Cast NIfTI image bytes to `Uint8Array` label codes. Supports the integer
 * NIfTI datatypes plus float32/float64 (treated as already-rounded label
 * codes). Multi-byte integer types are byte-swapped when the on-disk
 * endianness disagrees with the platform.
 *
 * Out-of-range values are clamped to [0, 255]. v1 supports up to 255 labels
 * (matches the locked-decision contract of the `label_info` map).
 */
function imageBytesToUint8(imageBytes, datatypeCode, numBitsPerVoxel, littleEndian, expectedVoxelCount) {
  const platformLE = isPlatformLittleEndian();
  const bytesPerVoxel = numBitsPerVoxel / 8;
  const declaredByteLength = expectedVoxelCount * bytesPerVoxel;

  // Some writers pad the image with extension/extra bytes; truncate, but
  // refuse if the declared count exceeds what we have.
  if (imageBytes.byteLength < declaredByteLength) {
    throw new NiftiReaderError(`imageBytesToUint8: image buffer is too short. expected ${declaredByteLength} bytes ` + `(${expectedVoxelCount} voxels × ${bytesPerVoxel} bytes), got ${imageBytes.byteLength}`);
  }
  const trimmed = imageBytes.byteLength === declaredByteLength ? imageBytes : imageBytes.slice(0, declaredByteLength);
  const out = new Uint8Array(expectedVoxelCount);
  switch (datatypeCode) {
    case 2:
      /* TYPE_UINT8 */{
        const src = new Uint8Array(trimmed);
        for (let i = 0; i < expectedVoxelCount; i++) out[i] = src[i];
        return out;
      }
    case 256:
      /* TYPE_INT8 */{
        const src = new Int8Array(trimmed);
        for (let i = 0; i < expectedVoxelCount; i++) {
          const v = src[i];
          out[i] = v < 0 ? 0 : v > 255 ? 255 : v;
        }
        return out;
      }
    case 4:
      /* TYPE_INT16 */{
        const src = readInt16(trimmed, expectedVoxelCount, littleEndian, platformLE);
        for (let i = 0; i < expectedVoxelCount; i++) {
          const v = src[i];
          out[i] = v < 0 ? 0 : v > 255 ? 255 : v;
        }
        return out;
      }
    case 512:
      /* TYPE_UINT16 */{
        const src = readUint16(trimmed, expectedVoxelCount, littleEndian, platformLE);
        for (let i = 0; i < expectedVoxelCount; i++) {
          const v = src[i];
          out[i] = v > 255 ? 255 : v;
        }
        return out;
      }
    case 8:
      /* TYPE_INT32 */{
        const src = readInt32(trimmed, expectedVoxelCount, littleEndian, platformLE);
        for (let i = 0; i < expectedVoxelCount; i++) {
          const v = src[i];
          out[i] = v < 0 ? 0 : v > 255 ? 255 : v;
        }
        return out;
      }
    case 768:
      /* TYPE_UINT32 */{
        const src = readUint32(trimmed, expectedVoxelCount, littleEndian, platformLE);
        for (let i = 0; i < expectedVoxelCount; i++) {
          const v = src[i];
          out[i] = v > 255 ? 255 : v;
        }
        return out;
      }
    case 16:
      /* TYPE_FLOAT32 */{
        const src = readFloat32(trimmed, expectedVoxelCount, littleEndian, platformLE);
        for (let i = 0; i < expectedVoxelCount; i++) {
          const v = Math.round(src[i]);
          out[i] = !Number.isFinite(v) ? 0 : v < 0 ? 0 : v > 255 ? 255 : v;
        }
        return out;
      }
    case 64:
      /* TYPE_FLOAT64 */{
        const src = readFloat64(trimmed, expectedVoxelCount, littleEndian, platformLE);
        for (let i = 0; i < expectedVoxelCount; i++) {
          const v = Math.round(src[i]);
          out[i] = !Number.isFinite(v) ? 0 : v < 0 ? 0 : v > 255 ? 255 : v;
        }
        return out;
      }
    default:
      throw new NiftiReaderError(`imageBytesToUint8: unsupported NIfTI datatypeCode=${datatypeCode}. ` + 'v1 supports UINT8, INT8, INT16, UINT16, INT32, UINT32, FLOAT32, FLOAT64.');
  }
}

// ─────────────────────────────────────────────────────────────────────────── //
//  Endian-aware typed-array readers                                            //
// ─────────────────────────────────────────────────────────────────────────── //

function isPlatformLittleEndian() {
  const buf = new ArrayBuffer(2);
  new DataView(buf).setUint16(0, 1, true);
  return new Uint16Array(buf)[0] === 1;
}
function readInt16(buffer, count, fileLE, platformLE) {
  if (fileLE === platformLE) return new Int16Array(buffer, 0, count);
  const dv = new DataView(buffer);
  const out = new Int16Array(count);
  for (let i = 0; i < count; i++) out[i] = dv.getInt16(i * 2, fileLE);
  return out;
}
function readUint16(buffer, count, fileLE, platformLE) {
  if (fileLE === platformLE) return new Uint16Array(buffer, 0, count);
  const dv = new DataView(buffer);
  const out = new Uint16Array(count);
  for (let i = 0; i < count; i++) out[i] = dv.getUint16(i * 2, fileLE);
  return out;
}
function readInt32(buffer, count, fileLE, platformLE) {
  if (fileLE === platformLE) return new Int32Array(buffer, 0, count);
  const dv = new DataView(buffer);
  const out = new Int32Array(count);
  for (let i = 0; i < count; i++) out[i] = dv.getInt32(i * 4, fileLE);
  return out;
}
function readUint32(buffer, count, fileLE, platformLE) {
  if (fileLE === platformLE) return new Uint32Array(buffer, 0, count);
  const dv = new DataView(buffer);
  const out = new Uint32Array(count);
  for (let i = 0; i < count; i++) out[i] = dv.getUint32(i * 4, fileLE);
  return out;
}
function readFloat32(buffer, count, fileLE, platformLE) {
  if (fileLE === platformLE) return new Float32Array(buffer, 0, count);
  const dv = new DataView(buffer);
  const out = new Float32Array(count);
  for (let i = 0; i < count; i++) out[i] = dv.getFloat32(i * 4, fileLE);
  return out;
}
function readFloat64(buffer, count, fileLE, platformLE) {
  if (fileLE === platformLE) return new Float64Array(buffer, 0, count);
  const dv = new DataView(buffer);
  const out = new Float64Array(count);
  for (let i = 0; i < count; i++) out[i] = dv.getFloat64(i * 8, fileLE);
  return out;
}
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/index.js
var dist_esm = __webpack_require__(4667);
;// ../../../../../../../plugins/ohifv3/extensions/nifti-segmentation/src/utils/injectLabelmap.ts
/*
 * injectLabelmap
 * ──────────────
 *
 * Take a `Uint8Array` of segmentation label codes that is **already on the
 * active Cornerstone3D volume's grid** (either because the NIfTI header
 * matched and we took the fast path, or because we resampled with VTK.js in
 * the slow path) and inject it into the OHIF segmentation service as a
 * displayable labelmap.
 *
 * Responsibilities:
 *
 *   1. Build a `segments` map from the overlay's `label_info` JSON (the shape
 *      `nifti_overlay/routes.py` returns on `GET /related`).
 *   2. If the requested `segmentationId` has no labelmap volume yet, create
 *      one against the active display set via the existing
 *      `loadSegmentationsForViewport` command (provided by
 *      `@ohif/extension-cornerstone-dicom-seg`).
 *   3. Wait for the labelmap volume to land in cache, then write the voxel
 *      data via `voxelManager.setCompleteScalarDataArray(...)`.
 *   4. Fire `Enums.Events.SEGMENTATION_DATA_MODIFIED` so the viewport
 *      repaints.
 *   5. Apply per-segment colors from `label_info` via
 *      `cornerstoneTools.segmentation.config.color.setSegmentIndexColor`.
 *
 * Non-goals (deferred):
 *
 *   - Multi-overlay co-display. v1 owns one `segmentationId` per call; the
 *     caller decides whether to reuse or rotate ids.
 *   - Label remapping. v1 trusts the `label_info` keys as the segment
 *     indices in the voxel buffer. If the NIfTI uses indices that collide
 *     with another loaded segmentation, the caller picks a fresh
 *     `segmentationId` rather than asking this util to remap.
 *   - Erasing labelmaps. There's no `clearLabelmap` here; if the caller
 *     loads a new overlay into the same id, the new voxel data fully
 *     replaces the old.
 *
 * Standalone: no imports from `@ohif/extension-monai-label`. The
 * `voxelManager.setCompleteScalarDataArray` + `SEGMENTATION_DATA_MODIFIED`
 * pattern is lifted from MONAI Label's `MonaiLabelPanel.updateView` (see
 * `../../../../../MONAILabel/plugins/ohifv3/extensions/monai-label/src/components/MonaiLabelPanel.tsx`),
 * but the implementation does not reference that module.
 *
 * Requires a volume viewport (MPR). On a stack viewport,
 * `segmentationService.createLabelmapForDisplaySet` succeeds but the
 * representation never paints anything visible — caller is responsible for
 * mounting the panel under a mode that loads its displaySets as volumes.
 *
 * Step-7 deliverable from `NIFTI_OVERLAY_PLAN.md`. The `loadNiftiOverlay`
 * command introduced in Step 8 is the primary caller.
 */

// `@cornerstonejs/core` / `@cornerstonejs/tools` are peer dependencies. They
// resolve at build time when the extension is symlinked under
// `MONAILabel/plugins/ohifv3/Viewers/extensions/`, but no `node_modules` is
// installed at the workspace-root source-of-truth folder. Silence the
// editor's module-resolution lints — same pattern as `pako` in NiftiReader.ts.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore


// ─────────────────────────────────────────────────────────────────────────── //
//  Public types                                                                //
// ─────────────────────────────────────────────────────────────────────────── //

/**
 * Color as RGBA tuple expected by `setSegmentIndexColor`.
 * Channel range: 0–255. Alpha defaults to 255 (fully opaque) when omitted.
 */

/** Thrown for any injection failure; preserves the original error as `cause`. */
class InjectLabelmapError extends Error {
  constructor(message, opts = {}) {
    super(message);
    this.name = 'InjectLabelmapError';
    if (opts.cause !== undefined) {
      this.cause = opts.cause;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────── //
//  Entry point                                                                 //
// ─────────────────────────────────────────────────────────────────────────── //

/**
 * Inject a `Uint8Array` labelmap into the OHIF segmentation service.
 *
 * Returns when the volume is in cache, the scalar data is written, and the
 * segmentation-data-modified event has been fired. Per-segment colors are
 * applied via the cornerstone-tools API once a representation exists on the
 * target viewport (the call is best-effort and won't throw if the
 * representation hasn't materialized yet — repaint still picks up the colors
 * once it does).
 */
async function injectLabelmap(options) {
  const {
    servicesManager,
    commandsManager,
    segmentationId,
    dataU8,
    labelInfo,
    label,
    viewportId: explicitViewportId,
    displaySetInstanceUID: explicitDisplaySetUID,
    labelmapWaitMs = 5000,
    labelmapPollIntervalMs = 50
  } = options;
  if (!servicesManager) {
    throw new InjectLabelmapError('injectLabelmap: servicesManager is required');
  }
  if (!commandsManager) {
    throw new InjectLabelmapError('injectLabelmap: commandsManager is required');
  }
  if (!segmentationId) {
    throw new InjectLabelmapError('injectLabelmap: segmentationId is required');
  }
  if (!dataU8 || !(dataU8 instanceof Uint8Array)) {
    throw new InjectLabelmapError('injectLabelmap: dataU8 must be a Uint8Array of label codes');
  }
  if (dataU8.length === 0) {
    throw new InjectLabelmapError('injectLabelmap: dataU8 is empty');
  }
  if (!labelInfo || typeof labelInfo !== 'object') {
    throw new InjectLabelmapError('injectLabelmap: labelInfo is required');
  }
  const services = servicesManager.services ?? {};
  const segmentationService = services.segmentationService;
  const viewportGridService = services.viewportGridService;
  const displaySetService = services.displaySetService;
  if (!segmentationService) {
    throw new InjectLabelmapError("injectLabelmap: servicesManager.services.segmentationService is missing. Confirm @ohif/extension-cornerstone-dicom-seg is registered.");
  }
  if (!viewportGridService || !displaySetService) {
    throw new InjectLabelmapError('injectLabelmap: viewportGridService or displaySetService is missing on servicesManager.services.');
  }

  // Resolve viewport + display set.
  let viewportId = explicitViewportId;
  let viewport = null;
  try {
    const state = viewportGridService.getState();
    const viewports = state?.viewports;
    if (!viewportId) {
      viewportId = state?.activeViewportId;
    }
    if (viewports && viewportId) {
      viewport = typeof viewports.get === 'function' ? viewports.get(viewportId) : viewports[viewportId];
    }
  } catch (err) {
    throw new InjectLabelmapError(`injectLabelmap: failed to resolve active viewport: ${err?.message ?? String(err)}`, {
      cause: err
    });
  }
  if (!viewport || !viewportId) {
    throw new InjectLabelmapError('injectLabelmap: could not resolve a target viewport. Pass `viewportId` explicitly or ensure a viewport is active.');
  }
  const displaySetInstanceUID = explicitDisplaySetUID ?? (Array.isArray(viewport.displaySetInstanceUIDs) ? viewport.displaySetInstanceUIDs[0] : undefined);
  if (!displaySetInstanceUID) {
    throw new InjectLabelmapError('injectLabelmap: could not resolve a target displaySetInstanceUID. Pass it explicitly or activate a viewport with a display set.');
  }
  const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
  if (!displaySet) {
    throw new InjectLabelmapError(`injectLabelmap: displaySetService has no entry for UID '${displaySetInstanceUID}'.`);
  }

  // Build the segments map from label_info.
  const {
    segments,
    sortedIndices,
    colorByIndex
  } = buildSegments(labelInfo);
  if (sortedIndices.length === 0) {
    throw new InjectLabelmapError('injectLabelmap: labelInfo has no entries — at least one segment is required.');
  }

  // Create the labelmap volume if it doesn't exist.
  const existedBefore = Boolean(safeGetLabelmapVolume(segmentationService, segmentationId));
  if (!existedBefore) {
    try {
      await commandsManager.runCommand('loadSegmentationsForViewport', {
        segmentations: [{
          segmentationId,
          representation: {
            type: dist_esm.Enums.SegmentationRepresentations.Labelmap
          },
          config: {
            label: label ?? `NIfTI Overlay ${segmentationId}`,
            segments
          }
        }],
        viewportId
      });
    } catch (err) {
      throw new InjectLabelmapError(`injectLabelmap: loadSegmentationsForViewport failed: ${err?.message ?? String(err)}`, {
        cause: err
      });
    }
  }

  // Wait for the labelmap volume to materialize in cache.
  const volume = await waitForLabelmapVolume(segmentationService, segmentationId, labelmapWaitMs, labelmapPollIntervalMs);
  if (!volume) {
    throw new InjectLabelmapError(`injectLabelmap: labelmap volume for segmentationId='${segmentationId}' never appeared in cache after ${labelmapWaitMs} ms.`);
  }
  const {
    voxelManager
  } = volume;
  if (!voxelManager || typeof voxelManager.setCompleteScalarDataArray !== 'function') {
    throw new InjectLabelmapError(`injectLabelmap: labelmap volume for segmentationId='${segmentationId}' has no voxelManager.setCompleteScalarDataArray.`);
  }

  // Sanity-check the voxel count.
  const expectedVoxelCount = resolveVoxelCount(volume);
  if (expectedVoxelCount !== null && expectedVoxelCount !== dataU8.length) {
    throw new InjectLabelmapError(`injectLabelmap: dataU8 length (${dataU8.length}) does not match labelmap voxel count (${expectedVoxelCount}). ` + 'The buffer must already be on the active DICOM volume grid; resampling is the caller\'s responsibility.');
  }
  voxelManager.setCompleteScalarDataArray(dataU8);
  (0,esm.triggerEvent)(esm.eventTarget, dist_esm.Enums.Events.SEGMENTATION_DATA_MODIFIED, {
    segmentationId
  });

  // Diagnostic: read back the labelmap geometry + roundtrip the data we just
  // wrote. If `readback.bbox` matches what we passed in, cs3d isn't quietly
  // reshuffling the buffer; if `labelmapGeometry.direction` differs from
  // the source DICOM volume's direction, that explains the on-screen flip.
  // Silence with `window.__NIFTI_OVERLAY_DEBUG = false`.
  if (typeof window === 'undefined' || window.__NIFTI_OVERLAY_DEBUG !== false) {
    try {
      const labelmapGeometry = {
        dimensions: Array.from(volume.dimensions ?? []),
        spacing: Array.from(volume.spacing ?? []),
        origin: Array.from(volume.origin ?? []),
        direction: Array.from(volume.direction ?? [])
      };
      let readback = null;
      if (typeof voxelManager.getCompleteScalarDataArray === 'function') {
        const arr = voxelManager.getCompleteScalarDataArray();
        if (arr && typeof arr.length === 'number') {
          const bbox = computeBBox(arr, labelmapGeometry.dimensions);
          readback = {
            length: arr.length,
            bbox
          };
        }
      }
      // Also fetch the source DICOM volume for direct geometry comparison.
      const displaySet2 = displaySet;
      const sourceVolumeId = `${displaySet2?.volumeLoaderSchema ?? 'cornerstoneStreamingImageVolume'}:${displaySetInstanceUID}`;
      let sourceGeometry = null;
      try {
        const sv = esm.cache.getVolume(sourceVolumeId);
        if (sv) {
          sourceGeometry = {
            dimensions: Array.from(sv.dimensions ?? []),
            spacing: Array.from(sv.spacing ?? []),
            origin: Array.from(sv.origin ?? []),
            direction: Array.from(sv.direction ?? [])
          };
        }
      } catch {
        // ignore
      }
      if (typeof window !== 'undefined') {
        window.__NIFTI_OVERLAY_LAST_INJECTED = {
          segmentationId,
          dataU8Length: dataU8.length,
          labelmapGeometry,
          sourceGeometry,
          readback
        };
      }
      // eslint-disable-next-line no-console
      console.log('[injectLabelmap] post-write geometry', {
        segmentationId,
        labelmapGeometry,
        sourceGeometry,
        readback
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[injectLabelmap] post-write diagnostic failed', err);
    }
  }

  // Apply per-segment colors. Match MonaiLabelPanel's small post-mount delay so
  // the representation has time to land on the viewport before we recolor it.
  applySegmentColors(viewportId, segmentationId, colorByIndex);
  return {
    segmentationId,
    segmentIndices: sortedIndices,
    voxelCount: dataU8.length,
    created: !existedBefore,
    viewportId
  };
}
/* harmony default export */ const utils_injectLabelmap = (injectLabelmap);

// ─────────────────────────────────────────────────────────────────────────── //
//  Helpers                                                                     //
// ─────────────────────────────────────────────────────────────────────────── //

function buildSegments(labelInfo) {
  const segments = {};
  const colorByIndex = new Map();
  const indices = [];
  for (const key of Object.keys(labelInfo)) {
    const segmentIndex = Number(key);
    if (!Number.isFinite(segmentIndex) || !Number.isInteger(segmentIndex)) {
      throw new InjectLabelmapError(`injectLabelmap: labelInfo key '${key}' is not an integer segment index.`);
    }
    if (segmentIndex <= 0 || segmentIndex > 255) {
      throw new InjectLabelmapError(`injectLabelmap: labelInfo key '${key}' must satisfy 1 <= index <= 255 ` + '(0 is reserved for background).');
    }
    indices.push(segmentIndex);
    const entry = labelInfo[key];
    const name = entry?.name ?? `label-${segmentIndex}`;
    const color = normalizeColor(entry?.color, segmentIndex);
    colorByIndex.set(segmentIndex, color);
    segments[segmentIndex] = {
      segmentIndex,
      label: name,
      active: false,
      locked: false,
      color
    };
  }
  indices.sort((a, b) => a - b);
  if (indices.length > 0) {
    // Mark the lowest-index segment active for parity with MonaiLabelPanel.
    segments[indices[0]].active = true;
  }
  return {
    segments,
    sortedIndices: indices,
    colorByIndex
  };
}
function normalizeColor(raw, segmentIndex) {
  if (Array.isArray(raw) && raw.length >= 3) {
    const r = clampByte(Number(raw[0]));
    const g = clampByte(Number(raw[1]));
    const b = clampByte(Number(raw[2]));
    const a = raw.length >= 4 ? clampByte(Number(raw[3])) : 255;
    return [r, g, b, a];
  }
  // Fallback: derive a deterministic color from the segment index so the
  // overlay is still visible if a row is missing its color.
  const fallback = deterministicColor(segmentIndex);
  return [fallback[0], fallback[1], fallback[2], 255];
}
function clampByte(n) {
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 255) return 255;
  return Math.round(n);
}
function deterministicColor(seed) {
  // Cheap, stable hash → HSL → RGB. Keeps colors distinct for adjacent indices.
  const hue = seed * 137 % 360 / 360; // golden-angle stride
  const s = 0.6;
  const l = 0.55;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hPrime = hue * 6;
  const x = c * (1 - Math.abs(hPrime % 2 - 1));
  let r1 = 0;
  let g1 = 0;
  let b1 = 0;
  if (hPrime < 1) [r1, g1, b1] = [c, x, 0];else if (hPrime < 2) [r1, g1, b1] = [x, c, 0];else if (hPrime < 3) [r1, g1, b1] = [0, c, x];else if (hPrime < 4) [r1, g1, b1] = [0, x, c];else if (hPrime < 5) [r1, g1, b1] = [x, 0, c];else [r1, g1, b1] = [c, 0, x];
  const m = l - c / 2;
  return [Math.round((r1 + m) * 255), Math.round((g1 + m) * 255), Math.round((b1 + m) * 255)];
}

/**
 * Diagnostic-only: bounding box of non-zero voxels in (i, j, k) coords.
 * Mirrors the helper of the same shape in `getCommandsModule.ts`; duplicated
 * here so this file stays standalone and the diagnostic can run even when
 * the caller bypassed `getCommandsModule.loadNiftiOverlay`.
 */
function computeBBox(data, dims) {
  const n0 = dims[0];
  const n1 = dims[1];
  const n2 = dims[2];
  let iMin = n0,
    iMax = -1;
  let jMin = n1,
    jMax = -1;
  let kMin = n2,
    kMax = -1;
  let voxelCount = 0;
  for (let k = 0; k < n2; k++) {
    const kOff = k * n1 * n0;
    for (let j = 0; j < n1; j++) {
      const jOff = kOff + j * n0;
      for (let i = 0; i < n0; i++) {
        if (data[jOff + i] !== 0) {
          if (i < iMin) iMin = i;
          if (i > iMax) iMax = i;
          if (j < jMin) jMin = j;
          if (j > jMax) jMax = j;
          if (k < kMin) kMin = k;
          if (k > kMax) kMax = k;
          voxelCount++;
        }
      }
    }
  }
  return {
    iMin,
    iMax,
    jMin,
    jMax,
    kMin,
    kMax,
    voxelCount
  };
}
function safeGetLabelmapVolume(segmentationService, id) {
  try {
    if (typeof segmentationService.getLabelmapVolume === 'function') {
      return segmentationService.getLabelmapVolume(id);
    }
  } catch {
    // ignore
  }
  // Fallback to the global Cornerstone3D cache.
  try {
    return esm.cache.getVolume(id) ?? null;
  } catch {
    return null;
  }
}
async function waitForLabelmapVolume(segmentationService, segmentationId, totalWaitMs, pollIntervalMs) {
  const deadline = Date.now() + Math.max(0, totalWaitMs);
  let attempt = 0;
  while (Date.now() <= deadline) {
    const v = safeGetLabelmapVolume(segmentationService, segmentationId);
    if (v && v.voxelManager) {
      return v;
    }
    attempt += 1;
    await sleep(pollIntervalMs);
  }
  // One last try at the deadline.
  const final = safeGetLabelmapVolume(segmentationService, segmentationId);
  return final && final.voxelManager ? final : null;
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Return the labelmap volume's voxel count, or `null` if the volume doesn't
 * expose any of the standard shape descriptors. Used for a defensive
 * sanity check on `dataU8.length` before we hand it to `setComplete…`.
 */
function resolveVoxelCount(volume) {
  if (!volume) return null;
  const {
    voxelManager
  } = volume;
  if (voxelManager) {
    if (typeof voxelManager.getScalarDataLength === 'function') {
      try {
        const n = Number(voxelManager.getScalarDataLength());
        if (Number.isFinite(n) && n > 0) return n;
      } catch {
        // ignore
      }
    }
    if (typeof voxelManager.getCompleteScalarDataArray === 'function') {
      try {
        const arr = voxelManager.getCompleteScalarDataArray();
        if (arr && typeof arr.length === 'number') return arr.length;
      } catch {
        // ignore
      }
    }
  }
  const dims = volume.dimensions;
  if (Array.isArray(dims) && dims.length === 3) {
    const [x, y, z] = dims.map(Number);
    if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)) {
      return x * y * z;
    }
  }
  return null;
}
function applySegmentColors(viewportId, segmentationId, colorByIndex) {
  const setColor = dist_esm.segmentation?.config?.color?.setSegmentIndexColor;
  if (typeof setColor !== 'function') {
    // Older / unexpected cornerstone-tools build — skip color application
    // rather than throwing; the labelmap still renders with default colors.
    return;
  }

  // Tiny deferral so the representation has time to mount on the viewport.
  // Mirrors the 1000 ms pattern in MonaiLabelPanel; we use a shorter delay
  // because the OHIF segmentation service has improved since 2023 and the
  // representation usually resolves within the next animation frame.
  const apply = () => {
    for (const [segmentIndex, color] of colorByIndex.entries()) {
      try {
        setColor(viewportId, segmentationId, segmentIndex, color);
      } catch {
        // Per-segment color failures are non-fatal: the labelmap is still
        // visible, just in the default palette. Swallow and continue.
      }
    }
  };
  apply();
  // Re-apply on the next macrotask in case the representation wasn't ready yet.
  setTimeout(apply, 150);
}
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/ImageData.js
var ImageData = __webpack_require__(26393);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/DataArray.js
var DataArray = __webpack_require__(445);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Imaging/Core/ImageReslice.js + 6 modules
var ImageReslice = __webpack_require__(92102);
;// ../../../../../../../plugins/ohifv3/extensions/nifti-segmentation/src/utils/alignToDicomGrid.ts
/*
 * alignToDicomGrid
 * ────────────────
 *
 * Slow-path resampler for the NIfTI segmentation overlay feature. When the
 * parsed NIfTI's grid does NOT match the active DICOM volume's grid within
 * tolerance (Step 8 fast-path check failed), call this util to resample the
 * voxel buffer onto the DICOM grid before handing it to `injectLabelmap`.
 *
 * Algorithm — VTK.js `vtkImageReslice` (locked decision D3):
 *
 *   1. Build a source `vtkImageData` with the NIfTI's LPS-converted geometry
 *      (dims, spacing, origin, direction) and the parsed `Uint8Array` voxel
 *      buffer attached as the point-data scalars.
 *   2. Configure a `vtkImageReslice` filter to produce an output with the
 *      target DICOM volume's geometry. Two non-negotiable settings:
 *
 *        - `setInterpolationMode(InterpolationMode.NEAREST)` — label maps
 *          must NOT be linearly interpolated. Linear interpolation creates
 *          intermediate voxel values between label codes (e.g. half-liver,
 *          half-tumor at boundaries), which silently corrupts the labelmap.
 *        - `setOutputScalarType('Uint8Array')` — keeps the output in the
 *          same domain as the input. Without this, vtk.js may pick a wider
 *          scalar type and downstream `injectLabelmap` would balk at the
 *          mismatch (or worse, clip silently).
 *
 *   3. Read the resampled `Uint8Array` out of the filter's output point
 *      data. Length must equal `target.dims[0] * dims[1] * dims[2]`.
 *
 * The resampler runs in world coordinates: vtk.js looks at the input's
 * `(direction, spacing, origin)` and the output's `(direction, spacing,
 * origin, extent)` and walks the output voxels one at a time, mapping each
 * output center to a world point, then to an input voxel, and copying the
 * label code.
 *
 * Both source and target grids must be in LPS. `parseNifti` already
 * delivers LPS; `gridFromCornerstoneVolume` (in `getCommandsModule.ts`)
 * delivers LPS by construction (Cornerstone3D's `direction` is LPS).
 *
 * Standalone: no imports from `@ohif/extension-monai-label`. The
 * `@kitware/vtk.js` peer-dep imports use the `@ts-ignore` pattern shared
 * with `injectLabelmap.ts` and `NiftiReader.ts` — no `node_modules/`
 * resolves at the workspace-root extension folder, but they resolve at
 * build time inside `MONAILabel/plugins/ohifv3/Viewers/node_modules/`.
 *
 * Step-9 deliverable from `NIFTI_OVERLAY_PLAN.md`. Step 8's
 * `loadNiftiOverlay` command is the primary caller: on grid mismatch it
 * now calls `alignToDicomGrid(...)` and feeds the resampled buffer into
 * `injectLabelmap` instead of throwing.
 */

// `@kitware/vtk.js` is a peer dependency. The editor's TS service can't
// resolve it from the workspace-root extension folder (no node_modules),
// but it resolves at build time inside the symlinked OHIF Viewers tree.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore


// ─────────────────────────────────────────────────────────────────────────── //
//  Public types                                                                //
// ─────────────────────────────────────────────────────────────────────────── //

/** Thrown for any resampler failure; preserves the original error as `cause`. */
class AlignToDicomGridError extends Error {
  constructor(message, opts = {}) {
    super(message);
    this.name = 'AlignToDicomGridError';
    if (opts.cause !== undefined) {
      this.cause = opts.cause;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────── //
//  Entry point                                                                 //
// ─────────────────────────────────────────────────────────────────────────── //

/**
 * Resample a NIfTI voxel buffer onto a target DICOM grid using nearest-
 * neighbor interpolation. Returns a fresh `Uint8Array` sized to the target.
 */
function alignToDicomGrid(options) {
  validateOptions(options);
  const {
    source,
    target
  } = options;
  const background = clampBackground(options.background ?? 0);

  // Build source vtkImageData.
  let inputImageData;
  try {
    inputImageData = buildVtkImageData(source);
  } catch (err) {
    throw new AlignToDicomGridError(`alignToDicomGrid: failed to build source vtkImageData: ${err?.message ?? String(err)}`, {
      cause: err
    });
  }

  // Configure reslice filter.
  let reslice;
  try {
    reslice = ImageReslice/* default.newInstance */.Ay.newInstance({
      transformInputSampling: true
    });
  } catch (err) {
    throw new AlignToDicomGridError(`alignToDicomGrid: vtkImageReslice.newInstance failed — confirm @kitware/vtk.js is installed: ${err?.message ?? String(err)}`, {
      cause: err
    });
  }
  reslice.setInputData(inputImageData);

  // Interpolation: NEAREST is non-negotiable for label maps. Linear
  // interpolation creates intermediate voxel values between label codes,
  // which silently corrupts the labelmap (smeared segment boundaries with
  // bogus "in-between" label codes).
  const NEAREST = resolveNearestInterpolationMode();
  callIfPresent(reslice, 'setInterpolationMode', [NEAREST]);

  // Output type: keep it `Uint8Array`. Otherwise downstream `injectLabelmap`
  // would balk at the mismatch (or worse, the labelmap volume would clip
  // silently when wider-int label codes are downcast).
  callIfPresent(reslice, 'setOutputScalarType', ['Uint8Array']);
  callIfPresent(reslice, 'setOutputDimensionality', [3]);
  callIfPresent(reslice, 'setOutputExtent', [[0, target.dims[0] - 1, 0, target.dims[1] - 1, 0, target.dims[2] - 1]]);
  callIfPresent(reslice, 'setOutputSpacing', [[target.spacing[0], target.spacing[1], target.spacing[2]]]);
  callIfPresent(reslice, 'setOutputOrigin', [[target.origin[0], target.origin[1], target.origin[2]]]);
  callIfPresent(reslice, 'setOutputDirection', [rowMajorMat3ToVtkDirection(target.direction)]);

  // Background voxels (output voxel maps outside the source bounds) get
  // filled with the configured label code. Default 0 = background.
  callIfPresent(reslice, 'setBackgroundColor', [[background, background, background, background]]);

  // Run the filter.
  try {
    if (typeof reslice.update === 'function') {
      reslice.update();
    }
  } catch (err) {
    throw new AlignToDicomGridError(`alignToDicomGrid: vtkImageReslice.update() threw: ${err?.message ?? String(err)}`, {
      cause: err
    });
  }

  // Pull the output buffer.
  const expectedLen = target.dims[0] * target.dims[1] * target.dims[2];
  const dataU8 = extractOutputBuffer(reslice, expectedLen);
  return {
    dataU8,
    dims: [target.dims[0], target.dims[1], target.dims[2]],
    spacing: [target.spacing[0], target.spacing[1], target.spacing[2]],
    origin: [target.origin[0], target.origin[1], target.origin[2]],
    direction: [target.direction[0], target.direction[1], target.direction[2], target.direction[3], target.direction[4], target.direction[5], target.direction[6], target.direction[7], target.direction[8]]
  };
}
/* harmony default export */ const utils_alignToDicomGrid = (alignToDicomGrid);

// ─────────────────────────────────────────────────────────────────────────── //
//  Helpers                                                                     //
// ─────────────────────────────────────────────────────────────────────────── //

function validateOptions(options) {
  if (!options) {
    throw new AlignToDicomGridError('alignToDicomGrid: options is required');
  }
  const {
    source,
    target
  } = options;
  if (!source) {
    throw new AlignToDicomGridError('alignToDicomGrid: options.source is required');
  }
  if (!target) {
    throw new AlignToDicomGridError('alignToDicomGrid: options.target is required');
  }
  if (!(source.dataU8 instanceof Uint8Array)) {
    throw new AlignToDicomGridError('alignToDicomGrid: source.dataU8 must be a Uint8Array');
  }
  validateVec3(source.dims, 'source.dims', {
    integer: true,
    positive: true
  });
  validateVec3(source.spacing, 'source.spacing', {
    positive: true
  });
  validateVec3(source.origin, 'source.origin');
  validateMat3(source.direction, 'source.direction');
  validateVec3(target.dims, 'target.dims', {
    integer: true,
    positive: true
  });
  validateVec3(target.spacing, 'target.spacing', {
    positive: true
  });
  validateVec3(target.origin, 'target.origin');
  validateMat3(target.direction, 'target.direction');
  const sourceVoxelCount = source.dims[0] * source.dims[1] * source.dims[2];
  if (source.dataU8.length !== sourceVoxelCount) {
    throw new AlignToDicomGridError(`alignToDicomGrid: source.dataU8 length (${source.dataU8.length}) does not ` + `match dims product (${sourceVoxelCount}; dims=${JSON.stringify(source.dims)}).`);
  }
}
function validateVec3(v, name, opts = {}) {
  if (!Array.isArray(v) || v.length !== 3) {
    throw new AlignToDicomGridError(`alignToDicomGrid: ${name} must be a length-3 array, got ${JSON.stringify(v)}`);
  }
  for (let i = 0; i < 3; i++) {
    const n = Number(v[i]);
    if (!Number.isFinite(n)) {
      throw new AlignToDicomGridError(`alignToDicomGrid: ${name}[${i}] is not finite (got ${v[i]}).`);
    }
    if (opts.integer && !Number.isInteger(n)) {
      throw new AlignToDicomGridError(`alignToDicomGrid: ${name}[${i}] must be an integer (got ${n}).`);
    }
    if (opts.positive && !(n > 0)) {
      throw new AlignToDicomGridError(`alignToDicomGrid: ${name}[${i}] must be > 0 (got ${n}).`);
    }
  }
}
function validateMat3(m, name) {
  if (!Array.isArray(m) || m.length !== 9) {
    throw new AlignToDicomGridError(`alignToDicomGrid: ${name} must be a length-9 array (row-major 3×3), got length ${Array.isArray(m) ? m.length : typeof m}.`);
  }
  for (let i = 0; i < 9; i++) {
    if (!Number.isFinite(Number(m[i]))) {
      throw new AlignToDicomGridError(`alignToDicomGrid: ${name}[${i}] is not finite (got ${m[i]}).`);
    }
  }
}
function clampBackground(n) {
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 255) return 255;
  return Math.round(n);
}

/**
 * Convert our row-major Mat3 (`direction[r*3 + c]` = component r of column c)
 * to the column-major 9-element layout VTK.js expects on `setDirection` /
 * `setOutputDirection` (consecutive triples are basis vectors).
 *
 * `dst[c*3 + r] = src[r*3 + c]`.
 *
 * Same transpose as `gridFromCornerstoneVolume` in `getCommandsModule.ts`,
 * applied in the opposite direction.
 */
function rowMajorMat3ToVtkDirection(rowMajor) {
  return [rowMajor[0], rowMajor[3], rowMajor[6], rowMajor[1], rowMajor[4], rowMajor[7], rowMajor[2], rowMajor[5], rowMajor[8]];
}
function buildVtkImageData(source) {
  const image = ImageData/* default.newInstance */.Ay.newInstance();
  // vtk.js setters accept either an array or three spread args; pass arrays
  // for fewer overload surprises across versions.
  image.setDimensions([source.dims[0], source.dims[1], source.dims[2]]);
  image.setSpacing([source.spacing[0], source.spacing[1], source.spacing[2]]);
  image.setOrigin([source.origin[0], source.origin[1], source.origin[2]]);
  // `setDirection` expects column-major-with-columns-as-basis-vectors.
  image.setDirection(rowMajorMat3ToVtkDirection(source.direction));
  const scalars = DataArray/* default.newInstance */.Ay.newInstance({
    name: 'NiftiOverlayLabels',
    values: source.dataU8,
    numberOfComponents: 1
  });
  image.getPointData().setScalars(scalars);
  return image;
}

/**
 * vtk.js' InterpolationMode enum is exposed in a few different places
 * depending on the version. Probe in order of likelihood; default to 0
 * which is `NEAREST` in every shipped version since 2018.
 */
function resolveNearestInterpolationMode() {
  const fromClass = ImageReslice/* default */.Ay?.InterpolationMode?.NEAREST;
  if (typeof fromClass === 'number') return fromClass;
  // Some builds attach Constants as a separate field:
  const fromConstants = ImageReslice/* default */.Ay?.Constants?.InterpolationMode?.NEAREST;
  if (typeof fromConstants === 'number') return fromConstants;
  return 0;
}

/**
 * Call a vtk.js setter only when it actually exists on the instance.
 * vtk.js has had minor naming churn between versions (e.g. `setOutputDirection`
 * landed mid-v20.x), so we degrade gracefully rather than throwing on a missing
 * method. If `setOutputDirection` is unavailable, vtk.js falls back to the
 * input's direction — which is wrong for the off-grid case but at least gives
 * a clearly-misaligned output that the caller can debug.
 */
function callIfPresent(target, method, args) {
  const fn = target?.[method];
  if (typeof fn !== 'function') return;
  fn.apply(target, args);
}

/**
 * Pull the resampled buffer out of the filter's output point data, normalize
 * to `Uint8Array`, and sanity-check the length against the expected target
 * voxel count.
 */
function extractOutputBuffer(reslice, expectedLen) {
  const output = reslice.getOutputData?.();
  if (!output) {
    throw new AlignToDicomGridError('alignToDicomGrid: vtkImageReslice produced no output data (filter rejected the input geometry?).');
  }
  const pointData = output.getPointData?.();
  const scalars = pointData?.getScalars?.();
  if (!scalars) {
    throw new AlignToDicomGridError('alignToDicomGrid: vtkImageReslice output has no scalar array.');
  }
  const raw = scalars.getData?.();
  if (!raw) {
    throw new AlignToDicomGridError('alignToDicomGrid: vtkImageReslice output scalar array has no underlying data.');
  }
  let dataU8;
  if (raw instanceof Uint8Array) {
    dataU8 = raw;
  } else if (raw instanceof Uint8ClampedArray || raw instanceof Int8Array || raw instanceof Int16Array || raw instanceof Uint16Array || raw instanceof Int32Array || raw instanceof Uint32Array || raw instanceof Float32Array || raw instanceof Float64Array) {
    // setOutputScalarType('Uint8Array') failed silently or the build doesn't
    // honor it. Clamp into Uint8 ourselves so the labelmap stays usable.
    dataU8 = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      const v = Number(raw[i]);
      dataU8[i] = !Number.isFinite(v) ? 0 : v < 0 ? 0 : v > 255 ? 255 : Math.round(v);
    }
  } else if (typeof raw.length === 'number') {
    dataU8 = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      const v = Number(raw[i]);
      dataU8[i] = !Number.isFinite(v) ? 0 : v < 0 ? 0 : v > 255 ? 255 : Math.round(v);
    }
  } else {
    throw new AlignToDicomGridError(`alignToDicomGrid: vtkImageReslice output scalars have unsupported type ${Object.prototype.toString.call(raw)}.`);
  }
  if (dataU8.length !== expectedLen) {
    throw new AlignToDicomGridError(`alignToDicomGrid: vtkImageReslice produced ${dataU8.length} voxels; expected ${expectedLen}. ` + 'The output extent / spacing / direction may not have been applied — confirm @kitware/vtk.js ' + 'is recent enough to honor setOutputDirection (v20+).');
  }
  return dataU8;
}
;// ../../../../../../../plugins/ohifv3/extensions/nifti-segmentation/src/utils/flipToDicomGrid.ts
/*
 * flipToDicomGrid
 * ───────────────
 *
 * Fast axis-aligned voxel remapping for the NIfTI segmentation overlay
 * feature. When source and target grids differ only by axis flips and/or
 * permutations (a "signed diagonal permutation" between them) we can
 * remap the buffer with O(N) memory copies and a handful of integer math
 * — much faster, and more reliable, than `vtkImageReslice` for this
 * common case.
 *
 * This is the "middle path" between Step 8's fast path (grids match
 * exactly → passthrough) and Step 9's slow path (truly oblique grids →
 * VTK.js resample with nearest-neighbor interpolation):
 *
 *   - fast path     : `gridsMatch(parsed, dicom) === true`           (no copy)
 *   - flip path     : `tryAxisAlignedRemap(...)` returns non-null     (one O(N) copy)
 *   - slow VTK path : neither of the above applies                    (VTK reslice)
 *
 * The flip path was added after observing that real-world NIfTI exports
 * frequently disagree with the DICOM volume on a single axis sign (the
 * NIfTI is in **LAS+** while DICOM is **LPS+** — the anterior/posterior
 * j-axis is flipped). vtkImageReslice should handle this in principle,
 * but the version shipped with OHIF v3.12.x silently drops
 * `setOutputDirection` on some builds, producing a mirrored overlay
 * (per `alignToDicomGrid.ts:381-391` comment). This helper provides a
 * version-independent fix for the axis-aligned subcase.
 *
 * Returns `null` when:
 *   - either grid has a direction column that is not aligned with a
 *     world axis (within tolerance),
 *   - the two grids don't cover the same set of world axes,
 *   - the voxel spacings disagree on the same world axis,
 *   - the dims disagree on the same world axis,
 *   - the origin shift along a world axis is not an integer multiple of
 *     the voxel spacing (the grids would have non-lattice-aligned voxel
 *     centers and a true resample is required).
 *
 * Step-9b — see `NIFTI_OVERLAY_PLAN.md` "Open questions / future work".
 */

// ─────────────────────────────────────────────────────────────────────────── //
//  Public types                                                                //
// ─────────────────────────────────────────────────────────────────────────── //

/** Per voxel-axis: which world axis it aligns with, and the sign. */

/** Default tolerance for "direction column is aligned with a world axis". */
const DIRECTION_EPSILON = 1e-4;
/**
 * Default tolerance for "origin shift is an integer voxel count". Looser
 * than `DIRECTION_EPSILON` because origin values are in mm — even a tiny
 * float-precision wobble in the affine can produce ~1e-6 mm noise.
 */
const OFFSET_EPSILON = 1e-3;

// ─────────────────────────────────────────────────────────────────────────── //
//  Entry point                                                                 //
// ─────────────────────────────────────────────────────────────────────────── //

/**
 * Try to remap `source.dataU8` onto `target`'s grid using only axis flips
 * and permutations. Returns the remapped buffer (sized to the product of
 * `target.dims`) on success, or `null` when the grids are not axis-aligned
 * compatible — in which case the caller should fall back to a full
 * resample (`alignToDicomGrid`).
 *
 * Background voxels (target indices that fall outside the source bounds)
 * are filled with the configured `background` value, default 0.
 */
function tryAxisAlignedRemap(source, target, options = {}) {
  const dirEps = options.directionEpsilon ?? DIRECTION_EPSILON;
  const offEps = options.offsetEpsilon ?? OFFSET_EPSILON;
  const background = flipToDicomGrid_clampByte(options.background ?? 0);
  const srcCols = colsOf(source.direction);
  const tgtCols = colsOf(target.direction);
  const srcAxes = [];
  const tgtAxes = [];
  for (let c = 0; c < 3; c++) {
    const a = axisOfColumn(srcCols[c], dirEps);
    if (!a) return null;
    srcAxes.push(a);
    const b = axisOfColumn(tgtCols[c], dirEps);
    if (!b) return null;
    tgtAxes.push(b);
  }

  // Both grids must cover all three world axes exactly once.
  const srcSet = srcAxes.map(a => a.worldAxis);
  const tgtSet = tgtAxes.map(a => a.worldAxis);
  if (new Set(srcSet).size !== 3 || new Set(tgtSet).size !== 3) {
    return null;
  }

  // worldAxis → voxel-axis index in source and target.
  const srcVoxelAxisForWorld = [-1, -1, -1];
  const tgtVoxelAxisForWorld = [-1, -1, -1];
  for (let c = 0; c < 3; c++) {
    srcVoxelAxisForWorld[srcAxes[c].worldAxis] = c;
    tgtVoxelAxisForWorld[tgtAxes[c].worldAxis] = c;
  }

  // Spacings and dims must match per world axis (they describe the same
  // voxel lattice — only the iteration order can differ).
  for (let a = 0; a < 3; a++) {
    const cs = srcVoxelAxisForWorld[a];
    const ct = tgtVoxelAxisForWorld[a];
    if (Math.abs(source.spacing[cs] - target.spacing[ct]) > offEps) {
      return null;
    }
    if (source.dims[cs] !== target.dims[ct]) {
      return null;
    }
  }

  // For each target voxel axis ct, derive: source voxel axis cs, integer
  // base offset, and ±1 sign factor such that
  //
  //     voxel_s[cs] = base + sign * voxel_t[ct]
  //
  // From the world-coord equality
  //
  //     source.origin[a] + voxel_s[cs] * sign_s * sp[a]
  //   = target.origin[a] + voxel_t[ct] * sign_t * sp[a]
  //
  // we get
  //
  //     voxel_s[cs] =  (target.origin[a] - source.origin[a]) / (sign_s * sp[a])
  //                 +  (sign_t / sign_s) * voxel_t[ct]
  const perTargetAxis = [];
  for (let ct = 0; ct < 3; ct++) {
    const worldAxis = tgtAxes[ct].worldAxis;
    const cs = srcVoxelAxisForWorld[worldAxis];
    const signS = srcAxes[cs].sign;
    const signT = tgtAxes[ct].sign;
    const sp = source.spacing[cs];
    const rawBase = (target.origin[worldAxis] - source.origin[worldAxis]) / (signS * sp);
    const base = Math.round(rawBase);
    if (Math.abs(rawBase - base) > offEps) {
      return null; // origin shift isn't an integer voxel count
    }
    const sign = signT * signS;
    perTargetAxis.push({
      sourceVoxelAxis: cs,
      base,
      sign
    });
  }

  // Allocate output buffer and walk it in target's i-fastest order.
  const tn0 = target.dims[0];
  const tn1 = target.dims[1];
  const tn2 = target.dims[2];
  const sn0 = source.dims[0];
  const sn1 = source.dims[1];
  const out = new Uint8Array(tn0 * tn1 * tn2);
  if (background !== 0) out.fill(background);
  const src_v = [0, 0, 0];
  for (let k_t = 0; k_t < tn2; k_t++) {
    const m2 = perTargetAxis[2];
    const v_k = m2.base + m2.sign * k_t;
    src_v[m2.sourceVoxelAxis] = v_k;
    if (v_k < 0 || v_k >= source.dims[m2.sourceVoxelAxis]) {
      continue; // entire (j, i) slice falls outside the source
    }
    for (let j_t = 0; j_t < tn1; j_t++) {
      const m1 = perTargetAxis[1];
      const v_j = m1.base + m1.sign * j_t;
      src_v[m1.sourceVoxelAxis] = v_j;
      if (v_j < 0 || v_j >= source.dims[m1.sourceVoxelAxis]) {
        continue;
      }
      for (let i_t = 0; i_t < tn0; i_t++) {
        const m0 = perTargetAxis[0];
        const v_i = m0.base + m0.sign * i_t;
        if (v_i < 0 || v_i >= source.dims[m0.sourceVoxelAxis]) {
          continue;
        }
        src_v[m0.sourceVoxelAxis] = v_i;
        const srcIdx = src_v[2] * sn1 * sn0 + src_v[1] * sn0 + src_v[0];
        const tgtIdx = k_t * tn1 * tn0 + j_t * tn0 + i_t;
        out[tgtIdx] = source.dataU8[srcIdx];
      }
    }
  }
  return out;
}
/* harmony default export */ const flipToDicomGrid = ((/* unused pure expression or super */ null && (tryAxisAlignedRemap)));

// ─────────────────────────────────────────────────────────────────────────── //
//  Helpers                                                                     //
// ─────────────────────────────────────────────────────────────────────────── //

/**
 * Extract the three columns of a row-major 3×3 matrix. Our convention is
 * `m[r*3 + c]` = component r of column c, so column c = `[m[c], m[3+c], m[6+c]]`.
 */
function colsOf(m) {
  return [[m[0], m[3], m[6]], [m[1], m[4], m[7]], [m[2], m[5], m[8]]];
}

/**
 * Decompose a 3-vector into (worldAxis, sign). Returns null when the
 * vector isn't aligned with a single world axis (i.e. it's oblique).
 *
 * "Aligned" means: the dominant component is within `epsilon` of ±1 and
 * the other two components are within `epsilon` of 0.
 */
function axisOfColumn(col, epsilon) {
  let maxAxis = -1;
  let maxAbs = -1;
  for (let a = 0; a < 3; a++) {
    const v = Math.abs(col[a]);
    if (v > maxAbs) {
      maxAbs = v;
      maxAxis = a;
    }
  }
  if (maxAxis < 0) return null;
  // Dominant axis must be ~±1.
  if (Math.abs(Math.abs(col[maxAxis]) - 1) > epsilon) return null;
  // Other axes must be ~0.
  for (let a = 0; a < 3; a++) {
    if (a !== maxAxis && Math.abs(col[a]) > epsilon) return null;
  }
  return {
    worldAxis: maxAxis,
    sign: col[maxAxis] > 0 ? 1 : -1
  };
}
function flipToDicomGrid_clampByte(n) {
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 255) return 255;
  return Math.round(n);
}
;// ../../../../../../../plugins/ohifv3/extensions/nifti-segmentation/src/getCommandsModule.ts
/*
 * getCommandsModule — NIfTI Segmentation Overlay
 * ──────────────────────────────────────────────
 *
 * Exposes the single command `loadNiftiOverlay({ id, ... })` that ties the
 * Step-5 service (`NiftiOverlayClient`), the Step-6 parser (`parseNifti`
 * + `affineUtils.gridsMatch`), the Step-7 injector (`injectLabelmap`), and
 * the Step-9 resampler (`alignToDicomGrid`) into one end-to-end overlay
 * loader.
 *
 *   Browser (panel button click)
 *     │
 *     ▼
 *   commandsManager.runCommand('loadNiftiOverlay', { id })
 *     │
 *     ▼
 *   1. Resolve active viewport + displaySet (or use explicit overrides).
 *   2. Look up the source DICOM volume in the Cornerstone3D cache and
 *      derive its grid (dims, spacing, origin, direction in LPS).
 *   3. In parallel:
 *        a. NiftiOverlayClient.fetch(study, series, id) → ArrayBuffer of
 *           `.nii.gz` bytes. (study + series are required so the warehouse
 *           can prune via liquid clustering before the id lookup.)
 *        b. NiftiOverlayClient.related(study, series) → look up the
 *           record's `label_info` (skipped if the caller passed a `record`).
 *   4. parseNifti(buffer) → ParsedNifti (Uint8 label codes + LPS grid).
 *   5. gridsMatch(parsedGrid, dicomGrid, tolerance) → boolean.
 *        - true  → injectLabelmap(...) on the fast path.
 *        - false → alignToDicomGrid(...) resamples onto the DICOM grid
 *                  (VTK.js vtkImageReslice, nearest-neighbor, Uint8) and
 *                  then injectLabelmap(...) on the resampled buffer.
 *   6. The `fastPath` field in the returned `LoadNiftiOverlayResult` tells
 *      the panel UI whether resampling happened.
 *
 * Tolerance comes from `window.config.niftiOverlay.alignment` (overridable
 * per-call via `alignment`). Defaults to the affineUtils built-in (1e-4 on
 * each of `spacing`, `origin`, `direction`).
 *
 * Defaults:
 *   - segmentationId  → the overlay `id` (per Step-7 design note: one
 *                       segmentationId per overlay slot, no collisions).
 *   - viewportId      → activeViewportId from viewportGridService.
 *   - displaySetUID   → first displaySetInstanceUIDs[] of that viewport.
 *
 * Standalone: no imports from `@ohif/extension-monai-label`. Peer-dep
 * imports from `@cornerstonejs/core` follow the `@ts-ignore` pattern used
 * elsewhere in this extension (no `node_modules/` at the workspace-root
 * source-of-truth folder; resolution happens at build time inside the
 * symlinked OHIF Viewers tree).
 *
 * Step-8 + Step-9 deliverables from `NIFTI_OVERLAY_PLAN.md`.
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore








// ─────────────────────────────────────────────────────────────────────────── //
//  Public types                                                                //
// ─────────────────────────────────────────────────────────────────────────── //

/**
 * Subset of `window.config.niftiOverlay.alignment` consumed by the
 * fast-path command. The config keys use longer "…Tolerance" names; we
 * translate to the affineUtils {@link GridMatchTolerance} shape on the way in.
 */

/**
 * Stages emitted by `loadNiftiOverlay` via the `onProgress` callback. The
 * panel UI binds to these to render a per-overlay progress affordance:
 *
 *   - `'fetching'`  — calling `NiftiOverlayClient.fetch(study, series, id)` (network).
 *   - `'parsing'`   — running `parseNifti(buffer)` (CPU, ~tens of ms for
 *                     small volumes, seconds for large).
 *   - `'aligning'`  — running VTK.js `vtkImageReslice` because the parsed
 *                     grid did not match the DICOM grid.
 *   - `'injecting'` — calling `injectLabelmap(...)` (creates the labelmap
 *                     volume on first use, writes voxel data, fires the
 *                     SEGMENTATION_DATA_MODIFIED event, applies colors).
 */

/**
 * Thrown when a caller-supplied {@link LoadNiftiOverlayOptions.onBeforeResample}
 * callback returns `false` (or throws).
 *
 * The Step-10 panel UI uses this to honor `niftiOverlay.alignment.promptOnResample`:
 * it confirms the resample with the user and rejects the load if they decline.
 */
class LoadNiftiOverlayCancelledError extends Error {
  constructor(message = 'loadNiftiOverlay: cancelled by onBeforeResample callback') {
    super(message);
    this.name = 'LoadNiftiOverlayCancelledError';
  }
}

/**
 * Thrown when the active OHIF viewport is not an MPR / volume viewport,
 * so Cornerstone3D never built a streaming image volume for the source
 * DICOM series. The overlay loader needs that volume to derive the target
 * grid, so it can't proceed — but this is a viewer-state issue (the user
 * can fix it by switching layouts), not a crash. The panel UI surfaces
 * this as a `'warning'` notification with just the recovery instructions
 * rather than as a red `'error'`.
 *
 * `viewportType` is the lower-cased string from the active viewport
 * (`'stack'`, `null` for unknown, etc.) — exposed for callers that want
 * to log it without re-parsing the message.
 */
class LoadNiftiOverlayWrongViewportError extends Error {
  constructor(message, viewportType) {
    super(message);
    /** Lower-cased viewport type as detected, or `null` when unknown. */
    this.viewportType = void 0;
    this.name = 'LoadNiftiOverlayWrongViewportError';
    this.viewportType = viewportType;
  }
}
// ─────────────────────────────────────────────────────────────────────────── //
//  Constants                                                                   //
// ─────────────────────────────────────────────────────────────────────────── //

/**
 * Volume id prefix used by `@ohif/extension-cornerstone` when it caches the
 * source DICOM volume for a streaming-image displaySet. The full id is
 * `${VOLUME_LOADER_SCHEME}:${displaySetInstanceUID}` (see
 * `MONAILabel/plugins/ohifv3/Viewers/extensions/cornerstone/src/services/CornerstoneCacheService/CornerstoneCacheService.ts`).
 *
 * Falls back to `displaySet.volumeLoaderSchema` when present so dynamic /
 * parametric volumes still resolve correctly.
 */
const DEFAULT_VOLUME_LOADER_SCHEME = 'cornerstoneStreamingImageVolume';

// ─────────────────────────────────────────────────────────────────────────── //
//  Entry point                                                                 //
// ─────────────────────────────────────────────────────────────────────────── //

function getCommandsModule({
  servicesManager,
  extensionManager,
  commandsManager
}) {
  const services = servicesManager?.services ?? {};
  const viewportGridService = services.viewportGridService;
  const displaySetService = services.displaySetService;
  async function loadNiftiOverlay(options) {
    if (!options || !options.id) {
      throw new InjectLabelmapError('loadNiftiOverlay: options.id is required');
    }
    if (!viewportGridService || !displaySetService) {
      throw new InjectLabelmapError('loadNiftiOverlay: viewportGridService or displaySetService is missing. ' + 'Confirm the extension is registered in a mode that loads the OHIF core services.');
    }
    const {
      viewport,
      viewportId,
      displaySet,
      displaySetInstanceUID
    } = resolveActiveContext({
      viewportGridService,
      displaySetService,
      explicitViewportId: options.viewportId,
      explicitDisplaySetUID: options.displaySetInstanceUID
    });

    // 1. Compute the DICOM grid for fast-path comparison.
    const dicomGrid = resolveDicomGrid(displaySet, viewport, viewportId);

    // 2. Kick off the bytes fetch and (optionally) the /related lookup in
    //    parallel. parsing is CPU-bound and waits for the bytes first.
    const client = new services_NiftiOverlayClient({
      extensionManager,
      servicesManager
    });

    // study + series are required for `/fetch` so the warehouse can prune
    // via liquid clustering before the id lookup. Resolve them up-front and
    // fail loudly if neither the caller nor the displaySet provides them —
    // previously they were only needed for the `/related` fallback and were
    // allowed to be null.
    const studyInstanceUID = options.studyInstanceUID ?? displaySet?.StudyInstanceUID ?? null;
    const seriesInstanceUID = options.seriesInstanceUID ?? displaySet?.SeriesInstanceUID ?? null;
    if (!studyInstanceUID || !seriesInstanceUID) {
      throw new InjectLabelmapError(`loadNiftiOverlay: could not resolve StudyInstanceUID + SeriesInstanceUID ` + `for id='${options.id}'. Pass them explicitly via ` + `options.studyInstanceUID / options.seriesInstanceUID, or ensure the ` + `active displaySet exposes both. They are required because the NIfTI ` + `Delta table is liquid-clustered by (study, series) and /nifti/fetch ` + `now uses both to prune.`);
    }
    safeProgress(options.onProgress, 'fetching');
    const bytesPromise = client.fetch(studyInstanceUID, seriesInstanceUID, options.id);
    let recordPromise;
    if (options.record) {
      recordPromise = Promise.resolve(options.record);
    } else if (options.labelInfo) {
      // Caller supplied labelInfo directly — skip the related lookup.
      recordPromise = Promise.resolve(null);
    } else {
      recordPromise = client.related(studyInstanceUID, seriesInstanceUID).then(rows => rows.find(r => r.id === options.id) ?? null);
    }
    const [bytes, record] = await Promise.all([bytesPromise, recordPromise]);
    const labelInfo = options.labelInfo ?? record?.label_info ?? undefined;
    if (!labelInfo) {
      throw new InjectLabelmapError(`loadNiftiOverlay: could not resolve label_info for id='${options.id}'. ` + '/related did not return a matching row for the active ' + '(StudyInstanceUID, SeriesInstanceUID). Pass `labelInfo` (or a full ' + '`record`) explicitly, or verify the overlay belongs to this series.');
    }

    // 3. Parse + compare.
    safeProgress(options.onProgress, 'parsing');
    let parsed;
    try {
      parsed = NiftiReader(bytes);
    } catch (err) {
      throw new InjectLabelmapError(`loadNiftiOverlay: NIfTI parse failed for id='${options.id}': ${err?.message ?? String(err)}`, {
        cause: err
      });
    }
    const parsedGrid = gridFromAffine(parsed.affineLPS, parsed.dims);
    const tolerance = resolveTolerance(options.alignment);
    const fastPath = gridsMatch(parsedGrid, dicomGrid, tolerance);

    // Diagnostic — prints the parsed NIfTI grid, the DICOM volume grid, and
    // which path is about to run. Useful when an overlay appears mirrored
    // / flipped on screen: compare `parsed.direction` vs `dicom.direction`
    // and `parsed.origin` vs `dicom.origin` to see which axis disagrees.
    // Set `window.__NIFTI_OVERLAY_DEBUG = false` in the console to silence.
    if (typeof window === 'undefined' || window.__NIFTI_OVERLAY_DEBUG !== false) {
      // eslint-disable-next-line no-console
      console.log('[loadNiftiOverlay] grid comparison', {
        id: options.id,
        fastPath,
        tolerance,
        parsed: {
          dims: parsedGrid.dims,
          spacing: parsedGrid.spacing,
          origin: parsedGrid.origin,
          direction: parsedGrid.direction,
          affineLPS: parsed.affineLPS,
          affineRAS: parsed.affineRAS,
          qform_code: parsed.header.qform_code,
          sform_code: parsed.header.sform_code
        },
        dicom: {
          dims: dicomGrid.dims,
          spacing: dicomGrid.spacing,
          origin: dicomGrid.origin,
          direction: dicomGrid.direction
        },
        deltas: {
          spacing: vec3Delta(parsedGrid.spacing, dicomGrid.spacing),
          origin: vec3Delta(parsedGrid.origin, dicomGrid.origin),
          direction: mat3Delta(parsedGrid.direction, dicomGrid.direction)
        }
      });
    }

    // 4. Three paths:
    //      - fastPath              : grids match exactly → passthrough.
    //      - flip path             : grids differ only by axis flips /
    //                                permutations → O(N) JS remap. Faster
    //                                than vtk and version-independent.
    //      - slow VTK reslice path : truly oblique grids → vtkImageReslice
    //                                with nearest-neighbor / Uint8.
    let dataU8 = parsed.dataU8;
    let resamplePath = 'fast';
    // Path selection precedence (highest wins):
    //   1. `window.__NIFTI_OVERLAY_FORCE_PATH = 'fast'|'flip'|'reslice'` —
    //      console-only debug knob, doesn't persist.
    //   2. `alignment.assumeDicomGrid === true` — config/panel toggle.
    //      Treats the NIfTI buffer as already on the DICOM grid and
    //      bypasses the affine entirely. Same effect as `force='fast'`
    //      but persisted via localStorage / window.config.
    //   3. Auto-detect via `gridsMatch(parsed, dicom, tolerance)`:
    //        match           → fast (no resample)
    //        no match        → flip (axis-aligned) → reslice (oblique)
    const forcedPath = typeof window !== 'undefined' ? window.__NIFTI_OVERLAY_FORCE_PATH : undefined;
    const assumeDicomGrid = resolveAssumeDicomGrid(options.alignment);
    if (forcedPath === 'fast' || forcedPath === undefined && assumeDicomGrid) {
      // Skip everything: use parsed.dataU8 as-is. Will only render correctly
      // if the source NIfTI happens to already be on the DICOM grid (dims
      // must match — verified below by injectLabelmap's sanity check).
      resamplePath = 'fast';
    } else if (!fastPath || forcedPath === 'flip' || forcedPath === 'reslice') {
      // Try the cheap JS remap first. Works for any axis-aligned lattice
      // (i.e. each direction column is ±e_x, ±e_y, or ±e_z and the origin
      // offsets are integer voxel counts). Returns null if the grids are
      // genuinely oblique, in which case we fall through to vtkImageReslice.
      const flipped = forcedPath === 'reslice' ? null : tryAxisAlignedRemap({
        dataU8: parsed.dataU8,
        dims: parsed.dims,
        spacing: parsed.spacing,
        origin: parsed.origin,
        direction: parsed.direction
      }, dicomGrid);
      if (flipped) {
        dataU8 = flipped;
        resamplePath = 'flip';
      } else {
        // Optional pre-resample prompt (the Step-10 panel UI binds this
        // to `window.confirm` when `niftiOverlay.alignment.promptOnResample`
        // is true). A `false` return cancels the load with a dedicated
        // error type so callers can distinguish user-cancellation from
        // genuine failures.
        if (typeof options.onBeforeResample === 'function') {
          let proceed;
          try {
            proceed = await options.onBeforeResample({
              parsed: parsedGrid,
              dicom: dicomGrid,
              tolerance
            });
          } catch (err) {
            throw new LoadNiftiOverlayCancelledError(`loadNiftiOverlay: onBeforeResample threw: ${err?.message ?? String(err)}`);
          }
          if (proceed === false) {
            throw new LoadNiftiOverlayCancelledError();
          }
        }
        safeProgress(options.onProgress, 'aligning');
        try {
          const aligned = utils_alignToDicomGrid({
            source: {
              dataU8: parsed.dataU8,
              dims: parsed.dims,
              spacing: parsed.spacing,
              origin: parsed.origin,
              direction: parsed.direction
            },
            target: dicomGrid
          });
          dataU8 = aligned.dataU8;
          resamplePath = 'reslice';
        } catch (err) {
          if (err instanceof AlignToDicomGridError) {
            throw new InjectLabelmapError(`loadNiftiOverlay: resampling failed for id='${options.id}' — ` + `${err.message}. ` + formatGridMismatchSummary(parsedGrid, dicomGrid, tolerance), {
              cause: err
            });
          }
          throw err;
        }
      }
    }
    if (typeof window === 'undefined' || window.__NIFTI_OVERLAY_DEBUG !== false) {
      // Compute the segment bounding box for both the source NIfTI buffer
      // and the remapped output buffer. If the flip path is doing its job,
      // these should bracket the *same anatomical region* — i.e. for a pure
      // j-axis flip, source.j and target.j should satisfy
      //   source.jMax + target.jMin ≈ dims_j - 1
      //   source.jMin + target.jMax ≈ dims_j - 1
      // (and similarly for any flipped axis). Mismatches surface bugs
      // immediately, no screen-capture comparison required.
      const srcBBox = computeSegmentBBox(parsed.dataU8, parsed.dims);
      const dstBBox = computeSegmentBBox(dataU8, dicomGrid.dims);
      // Stash on window so the user can poke at it in the console.
      if (typeof window !== 'undefined') {
        window.__NIFTI_OVERLAY_LAST = {
          id: options.id,
          path: resamplePath,
          parsed: {
            dims: parsed.dims,
            spacing: parsed.spacing,
            origin: parsed.origin,
            direction: parsed.direction
          },
          dicom: dicomGrid,
          srcBBox,
          dstBBox
        };
      }
      // eslint-disable-next-line no-console
      console.log('[loadNiftiOverlay] resample path', {
        id: options.id,
        path: resamplePath,
        voxelCount: dataU8.length,
        srcBBox,
        dstBBox
      });
    }

    // 5. Write the (possibly resampled) buffer into a labelmap volume.
    safeProgress(options.onProgress, 'injecting');
    const segmentationId = options.segmentationId ?? options.id;
    const labelText = options.label ?? record?.name ?? `NIfTI Overlay ${options.id}`;
    const injectResult = await utils_injectLabelmap({
      servicesManager,
      commandsManager,
      segmentationId,
      dataU8,
      labelInfo,
      label: labelText,
      viewportId,
      displaySetInstanceUID
    });
    return {
      ...injectResult,
      id: options.id,
      displaySetInstanceUID,
      // Report what actually happened, not what `gridsMatch` initially
      // detected. With `assumeDicomGrid`, we may take the fast path even
      // when the grids disagreed; with `__NIFTI_OVERLAY_FORCE_PATH` the
      // user can force any of the three. Panel badge uses this.
      fastPath: resamplePath === 'fast'
    };
  }
  const actions = {
    loadNiftiOverlay
  };
  return {
    actions,
    definitions: {
      loadNiftiOverlay: {
        commandFn: actions.loadNiftiOverlay
      }
    },
    defaultContext: 'NIFTI_SEGMENTATION'
  };
}

// ─────────────────────────────────────────────────────────────────────────── //
//  Helpers                                                                     //
// ─────────────────────────────────────────────────────────────────────────── //

function resolveActiveContext({
  viewportGridService,
  displaySetService,
  explicitViewportId,
  explicitDisplaySetUID
}) {
  const state = viewportGridService.getState();
  const viewportId = explicitViewportId ?? state?.activeViewportId;
  if (!viewportId) {
    throw new InjectLabelmapError('loadNiftiOverlay: no active viewport. Pass `viewportId` explicitly or activate a viewport first.');
  }
  const viewports = state?.viewports;
  const viewport = typeof viewports?.get === 'function' ? viewports.get(viewportId) : viewports?.[viewportId];
  if (!viewport) {
    throw new InjectLabelmapError(`loadNiftiOverlay: viewport '${viewportId}' not found in viewportGridService state.`);
  }
  const displaySetInstanceUID = explicitDisplaySetUID ?? (Array.isArray(viewport.displaySetInstanceUIDs) ? viewport.displaySetInstanceUIDs[0] : undefined);
  if (!displaySetInstanceUID) {
    throw new InjectLabelmapError('loadNiftiOverlay: could not resolve displaySetInstanceUID. ' + 'Pass `displaySetInstanceUID` explicitly or activate a viewport with a display set.');
  }
  const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
  if (!displaySet) {
    throw new InjectLabelmapError(`loadNiftiOverlay: displaySetService has no entry for UID '${displaySetInstanceUID}'.`);
  }
  return {
    viewport,
    viewportId,
    displaySet,
    displaySetInstanceUID
  };
}

/**
 * Look up the source DICOM volume in the Cornerstone3D cache and translate
 * its grid metadata into the affineUtils {@link Grid} shape (row-major
 * `direction` with columns as basis vectors).
 *
 * Throws an `InjectLabelmapError` (not silently null-returns) when the
 * volume isn't cached yet — Step 8 explicitly requires a volume viewport
 * (D15 in NIFTI_OVERLAY_PLAN.md). On a stack viewport, or before the
 * streaming volume has been requested, `cache.getVolume(...)` returns
 * undefined and we can't compute the grid.
 *
 * The thrown error surfaces the detected viewport type so the user knows
 * whether they need to switch layout (stack → MPR) or just wait for the
 * series to finish loading.
 */
function resolveDicomGrid(displaySet, viewport, viewportId) {
  const volumeLoaderSchema = displaySet?.volumeLoaderSchema ?? DEFAULT_VOLUME_LOADER_SCHEME;
  const displaySetInstanceUID = displaySet?.displaySetInstanceUID;
  if (!displaySetInstanceUID) {
    throw new InjectLabelmapError('loadNiftiOverlay: active displaySet has no displaySetInstanceUID.');
  }
  const volumeId = `${volumeLoaderSchema}:${displaySetInstanceUID}`;
  let volume = null;
  try {
    volume = esm.cache.getVolume(volumeId);
  } catch (err) {
    throw new InjectLabelmapError(`loadNiftiOverlay: cornerstone cache.getVolume('${volumeId}') threw: ${err?.message ?? String(err)}`, {
      cause: err
    });
  }
  if (!volume) {
    const detectedType = describeViewportType(viewport);
    if (detectedType !== 'volume') {
      // Non-MPR / unknown viewport: the user can fix this by switching to
      // an MPR layout, so surface it as a warning with just the recovery
      // instructions (no internal volumeId / viewportId noise).
      throw new LoadNiftiOverlayWrongViewportError('Switch the layout to MPR to load NIfTI overlays. ' + 'Use the top-bar Layout button → MPR / 3-panel preset, ' + 'or open the study in a mode whose hangingProtocol is "mpr" (e.g. MONAI Label).', detectedType);
    }
    // detectedType === 'volume' but the streaming image volume hasn't been
    // built yet — that's a transient loading state, not a layout issue.
    throw new InjectLabelmapError(`loadNiftiOverlay: source DICOM volume '${volumeId}' is not in the Cornerstone3D cache ` + `(viewportId='${viewportId}', viewportType='volume'). ` + 'The viewport reports itself as a volume viewport but the streaming image volume ' + 'has not been built yet. Wait for the series to finish loading and retry, ' + 'or check the OHIF console for cs3d streaming errors.');
  }
  return gridFromCornerstoneVolume(volume);
}

/**
 * Extract the active viewport's type from the viewportGridService state.
 * OHIF stores the type under `viewportOptions.viewportType` (set by the
 * mode's hangingProtocol — e.g. `'volume'` for the `'mpr'` protocol and
 * `'stack'` for the default basic layout). Returns `null` if the value
 * isn't present (older OHIF builds, custom viewports, etc.).
 */
function describeViewportType(viewport) {
  const raw = viewport?.viewportOptions?.viewportType ?? viewport?.viewportType ?? null;
  if (typeof raw !== 'string') return null;
  return raw.toLowerCase();
}

/**
 * Translate a Cornerstone3D `ImageVolume` (or any object exposing
 * `dimensions`, `spacing`, `origin`, `direction` in the cs3d convention)
 * to our affineUtils {@link Grid} shape.
 *
 * Cornerstone3D stores `direction` as a 9-element flat matrix where
 * consecutive triples are the i / j / k basis vectors (column-major with
 * columns-as-basis-vectors). Our affineUtils stores `direction` row-major,
 * still with columns as basis vectors — so the transpose flips it into
 * the shape `gridsMatch` expects.
 */
function gridFromCornerstoneVolume(volume) {
  const dims = toVec3(volume?.dimensions, 'volume.dimensions');
  const spacing = toVec3(volume?.spacing, 'volume.spacing');
  const origin = toVec3(volume?.origin, 'volume.origin');
  const direction = volume?.direction;
  if (!direction || (direction.length ?? 0) < 9) {
    throw new InjectLabelmapError('loadNiftiOverlay: source DICOM volume has no usable `direction` (expected 9 numbers).');
  }
  const csDir = [];
  for (let i = 0; i < 9; i++) csDir.push(Number(direction[i]));
  // Transpose column-major-flat → row-major-flat (cols stay as basis vectors).
  // dst[r*3 + c] = src[c*3 + r]
  const transposed = [csDir[0], csDir[3], csDir[6], csDir[1], csDir[4], csDir[7], csDir[2], csDir[5], csDir[8]];
  return {
    dims,
    spacing,
    origin,
    direction: transposed
  };
}
function toVec3(raw, name) {
  if (!raw || (raw.length ?? 0) < 3) {
    throw new InjectLabelmapError(`loadNiftiOverlay: ${name} must be a length-3 array, got ${raw === undefined ? 'undefined' : JSON.stringify(raw)}`);
  }
  const out = [Number(raw[0]), Number(raw[1]), Number(raw[2])];
  if (!Number.isFinite(out[0]) || !Number.isFinite(out[1]) || !Number.isFinite(out[2])) {
    throw new InjectLabelmapError(`loadNiftiOverlay: ${name} contains non-finite values: ${JSON.stringify(out)}`);
  }
  return out;
}
function resolveTolerance(override) {
  const fromGlobal = typeof window !== 'undefined' ? window.config?.niftiOverlay?.alignment ?? {} : {};
  const merged = {
    ...fromGlobal,
    ...(override ?? {})
  };
  const tol = {};
  if (typeof merged.spacingTolerance === 'number') tol.spacing = merged.spacingTolerance;
  if (typeof merged.originTolerance === 'number') tol.origin = merged.originTolerance;
  if (typeof merged.directionTolerance === 'number') tol.direction = merged.directionTolerance;
  return tol;
}

/**
 * Resolve the effective {@link NiftiOverlayAlignmentConfig.assumeDicomGrid}
 * for the current load. Precedence (highest wins):
 *
 *   1. per-call `override.assumeDicomGrid`
 *   2. `localStorage['niftiOverlay.assumeDicomGrid']` (panel toggle)
 *   3. `window.config.niftiOverlay.alignment.assumeDicomGrid` (deployment)
 *
 * `__NIFTI_OVERLAY_FORCE_PATH = 'fast'` (the debug knob) wins over all of
 * these in {@link loadNiftiOverlay} itself — kept as a separate hatch so
 * power users can still flip the behavior per-load from the console.
 */
function resolveAssumeDicomGrid(override) {
  if (override && typeof override.assumeDicomGrid === 'boolean') {
    return override.assumeDicomGrid;
  }
  if (typeof window !== 'undefined') {
    try {
      const ls = window.localStorage?.getItem('niftiOverlay.assumeDicomGrid');
      if (ls === 'true') return true;
      if (ls === 'false') return false;
    } catch {
      // SecurityError in private browsing, etc — ignore and fall through.
    }
    const fromGlobal = window.config?.niftiOverlay?.alignment;
    if (fromGlobal && typeof fromGlobal.assumeDicomGrid === 'boolean') {
      return fromGlobal.assumeDicomGrid;
    }
  }
  return false;
}

/**
 * Compact "grid-mismatch" descriptor — wrapped into resampler-failure
 * messages so the user can see at a glance which axis disagrees most.
 * The full message lives in {@link AlignToDicomGridError.message}.
 */
/**
 * Best-effort progress emitter. Errors thrown by the panel UI's progress
 * handler must never break the load itself — swallow and continue.
 */
function safeProgress(cb, stage) {
  if (typeof cb !== 'function') return;
  try {
    cb(stage);
  } catch {
    // ignore — progress reporting is non-essential
  }
}
function vec3Delta(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

/**
 * Bounding box of all non-zero voxels in a labelmap buffer, expressed in
 * `(i, j, k)` voxel coordinates. `null` axes mean "no non-zero voxels".
 * Pure diagnostic — only called when `__NIFTI_OVERLAY_DEBUG !== false`.
 */
function computeSegmentBBox(data, dims) {
  const n0 = dims[0];
  const n1 = dims[1];
  const n2 = dims[2];
  let iMin = n0,
    iMax = -1;
  let jMin = n1,
    jMax = -1;
  let kMin = n2,
    kMax = -1;
  let voxelCount = 0;
  // Single linear pass with division-free index unpacking.
  for (let k = 0; k < n2; k++) {
    const kOff = k * n1 * n0;
    for (let j = 0; j < n1; j++) {
      const jOff = kOff + j * n0;
      for (let i = 0; i < n0; i++) {
        if (data[jOff + i] !== 0) {
          if (i < iMin) iMin = i;
          if (i > iMax) iMax = i;
          if (j < jMin) jMin = j;
          if (j > jMax) jMax = j;
          if (k < kMin) kMin = k;
          if (k > kMax) kMax = k;
          voxelCount++;
        }
      }
    }
  }
  return {
    iMin,
    iMax,
    jMin,
    jMax,
    kMin,
    kMax,
    voxelCount
  };
}
function mat3Delta(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3], a[4] - b[4], a[5] - b[5], a[6] - b[6], a[7] - b[7], a[8] - b[8]];
}
function formatGridMismatchSummary(parsed, dicom, tol) {
  const fmtVec = v => `[${v.map(n => n.toPrecision(6)).join(', ')}]`;
  const fmtTol = (label, val) => `${label}=${val ?? '1e-4 (default)'}`;
  return `parsed.dims=${fmtVec(parsed.dims)} parsed.spacing=${fmtVec(parsed.spacing)} ` + `parsed.origin=${fmtVec(parsed.origin)} | ` + `dicom.dims=${fmtVec(dicom.dims)} dicom.spacing=${fmtVec(dicom.spacing)} ` + `dicom.origin=${fmtVec(dicom.origin)} | ` + `tolerance: ${fmtTol('spacing', tol.spacing)}, ${fmtTol('origin', tol.origin)}, ` + `${fmtTol('direction', tol.direction)}`;
}
;// ../../../../../../../plugins/ohifv3/extensions/nifti-segmentation/src/components/NiftiOverlayPanel.tsx
/*
 * NiftiOverlayPanel — Step 10
 * ───────────────────────────
 *
 * Side-panel UI for the NIfTI segmentation overlay feature.
 *
 * Responsibilities (mirroring the Step-10 deliverable in NIFTI_OVERLAY_PLAN.md):
 *
 *   1. On the active series changing, call
 *      `NiftiOverlayClient.related(study, series)` and list up to
 *      `niftiOverlay.maxOverlaysListed` returned `NiftiOverlayRecord`s.
 *   2. Show name / annotator / version / created_at + a swatch of the
 *      `label_info` colors so the user can confirm they're loading the
 *      right segmentation before clicking.
 *   3. Per-row "Load" button that runs
 *      `commandsManager.runCommand('loadNiftiOverlay', { id, record, … })`
 *      with progress + before-resample callbacks bound so the panel can
 *      render `Fetching… → Parsing… → Resampling… → Injecting…` and honor
 *      `alignment.promptOnResample` via `window.confirm`.
 *   4. After load: show a "fast-path" / "resampled" badge and the voxel count.
 *   5. Auto-load the first listed overlay on series open when
 *      `niftiOverlay.autoLoadOnSeriesOpen` is true. Each `(study, series)`
 *      pair is auto-loaded at most once per panel mount.
 *
 * Series-change detection:
 *   - Re-derive the active `(studyUID, seriesUID, displaySetUID, viewportId)`
 *     on every `viewportGridService.EVENTS.GRID_STATE_CHANGED` /
 *     `ACTIVE_VIEWPORT_ID_CHANGED` (the panel might mount before a viewport
 *     is active) and on every `displaySetService.EVENTS.DISPLAY_SETS_ADDED`
 *     (the panel might mount before the displaySets are populated).
 *   - Only refresh the overlay list when the `(studyUID, seriesUID)` pair
 *     actually changes.
 *
 * Hook usage (functional component) — fits the hooks-friendly subset of OHIF
 * panels (cf. `panelMeasurement` in @ohif/extension-cornerstone). Class
 * components are still allowed (cf. MonaiLabelPanel) but hooks make the
 * subscription bookkeeping less error-prone for the multi-event setup we need.
 */

// React resolves at build time from the Viewers tree (peer dep). The TS
// service at the workspace-root extension folder has no `node_modules/`,
// so silence the editor's module-resolution lint — same `@ts-ignore`
// pattern used for `pako`, `@cornerstonejs/*`, and `@kitware/vtk.js`
// elsewhere in this extension.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore





// ─────────────────────────────────────────────────────────────────────────── //
//  Types                                                                       //
// ─────────────────────────────────────────────────────────────────────────── //

const DEFAULT_MAX_LISTED = 25;
const STAGE_LABEL = {
  fetching: 'Fetching…',
  parsing: 'Parsing…',
  aligning: 'Resampling…',
  injecting: 'Injecting…'
};

// ─────────────────────────────────────────────────────────────────────────── //
//  Helpers                                                                     //
// ─────────────────────────────────────────────────────────────────────────── //

/**
 * `localStorage` key for the "Trust voxel order" panel toggle. Persisted
 * across reloads so the user doesn't have to re-set it every session.
 */
const ASSUME_DICOM_GRID_LS_KEY = 'niftiOverlay.assumeDicomGrid';
function readAssumeDicomGridInitial(cfgAssumeDicomGrid) {
  // Precedence: localStorage > window.config. Mirrors `resolveAssumeDicomGrid`
  // in getCommandsModule.ts so the toggle and the command see the same value.
  if (typeof window !== 'undefined') {
    try {
      const ls = window.localStorage?.getItem(ASSUME_DICOM_GRID_LS_KEY);
      if (ls === 'true') return true;
      if (ls === 'false') return false;
    } catch {
      // SecurityError in private browsing, etc.
    }
  }
  return cfgAssumeDicomGrid === true;
}
function readPanelConfig() {
  const raw = typeof window !== 'undefined' ? window.config?.niftiOverlay : null;
  const cfg = raw && typeof raw === 'object' ? raw : {};
  const alignmentRaw = cfg.alignment && typeof cfg.alignment === 'object' ? cfg.alignment : {};
  const max = Number(cfg.maxOverlaysListed);
  return {
    enabled: cfg.enabled === true,
    maxOverlaysListed: Number.isFinite(max) && max > 0 ? Math.floor(max) : DEFAULT_MAX_LISTED,
    autoLoadOnSeriesOpen: cfg.autoLoadOnSeriesOpen === true,
    alignment: {
      spacingTolerance: typeof alignmentRaw.spacingTolerance === 'number' ? alignmentRaw.spacingTolerance : undefined,
      originTolerance: typeof alignmentRaw.originTolerance === 'number' ? alignmentRaw.originTolerance : undefined,
      directionTolerance: typeof alignmentRaw.directionTolerance === 'number' ? alignmentRaw.directionTolerance : undefined,
      promptOnResample: alignmentRaw.promptOnResample === true,
      assumeDicomGrid: typeof alignmentRaw.assumeDicomGrid === 'boolean' ? alignmentRaw.assumeDicomGrid : undefined
    },
    raw: raw ?? null
  };
}
function deriveSeriesContext(servicesManager) {
  const services = servicesManager?.services ?? {};
  const viewportGridService = services.viewportGridService;
  const displaySetService = services.displaySetService;
  if (!viewportGridService || !displaySetService) return null;
  let state = null;
  try {
    state = viewportGridService.getState();
  } catch {
    return null;
  }
  const viewportId = state?.activeViewportId;
  if (!viewportId) return null;
  const viewports = state.viewports;
  const viewport = typeof viewports?.get === 'function' ? viewports.get(viewportId) : viewports?.[viewportId];
  if (!viewport) return null;
  const displaySetInstanceUID = Array.isArray(viewport.displaySetInstanceUIDs) ? viewport.displaySetInstanceUIDs[0] : undefined;
  if (!displaySetInstanceUID) return null;
  let displaySet = null;
  try {
    displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
  } catch {
    return null;
  }
  if (!displaySet) return null;
  const studyInstanceUID = displaySet.StudyInstanceUID;
  const seriesInstanceUID = displaySet.SeriesInstanceUID;
  if (!studyInstanceUID || !seriesInstanceUID) return null;
  return {
    studyInstanceUID,
    seriesInstanceUID,
    displaySetInstanceUID,
    viewportId
  };
}
function formatTimestamp(raw) {
  if (!raw) return '';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  // ISO is a fine default; YYYY-MM-DD HH:mm in local time is friendlier.
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` + `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function rowKey(seriesUID, id) {
  return `${seriesUID}::${id}`;
}
function colorToCss(color) {
  if (!Array.isArray(color) || color.length < 3) return '#444';
  const clamp = n => {
    const v = Number(n);
    if (!Number.isFinite(v)) return 0;
    return Math.max(0, Math.min(255, Math.round(v)));
  };
  return `rgb(${clamp(color[0])}, ${clamp(color[1])}, ${clamp(color[2])})`;
}
function describeRecord(r) {
  const parts = [];
  if (r.annotator) parts.push(`by ${r.annotator}`);
  if (r.version != null) parts.push(`v${r.version}`);
  if (r.source) parts.push(r.source);
  if (r.status && r.status !== 'approved') parts.push(`status: ${r.status}`);
  const created = formatTimestamp(r.created_at);
  if (created) parts.push(created);
  return parts;
}
function describeError(err) {
  if (err instanceof LoadNiftiOverlayCancelledError) return 'Cancelled.';
  if (err instanceof NiftiOverlayClientError) {
    const status = err.status !== undefined ? ` (HTTP ${err.status})` : '';
    return `${err.message}${status}`;
  }
  if (err instanceof Error) return err.message;
  return String(err);
}

// ─────────────────────────────────────────────────────────────────────────── //
//  Component                                                                   //
// ─────────────────────────────────────────────────────────────────────────── //

const NiftiOverlayPanel = ({
  commandsManager,
  servicesManager,
  extensionManager
}) => {
  const config = (0,react.useMemo)(() => readPanelConfig(), []);

  // Pre-instantiate the client once per (extensionManager, servicesManager) so
  // we don't re-construct on every render.
  const client = (0,react.useMemo)(() => new services_NiftiOverlayClient({
    extensionManager,
    servicesManager
  }), [extensionManager, servicesManager]);
  const [seriesContext, setSeriesContext] = (0,react.useState)(null);
  const [overlays, setOverlays] = (0,react.useState)([]);
  const [listingStatus, setListingStatus] = (0,react.useState)('idle');
  const [listingError, setListingError] = (0,react.useState)(null);
  // Map<rowKey, RowState>. Indexed by `${seriesUID}::${id}` so a row's state
  // doesn't bleed across series changes.
  const [rowState, setRowState] = (0,react.useState)({});

  // "Trust voxel order" toggle. When on, the loader skips affine-based
  // grid alignment and writes the NIfTI buffer into the labelmap as-is —
  // the right call for NIfTIs that copy DICOM data but advertise an
  // LAS/RAS affine that doesn't match the voxel layout. Persisted to
  // localStorage on every change so it survives reloads.
  const [assumeDicomGrid, setAssumeDicomGrid] = (0,react.useState)(() => readAssumeDicomGridInitial(config.alignment.assumeDicomGrid));
  const persistAssumeDicomGrid = (0,react.useCallback)(next => {
    setAssumeDicomGrid(next);
    if (typeof window === 'undefined') return;
    try {
      window.localStorage?.setItem(ASSUME_DICOM_GRID_LS_KEY, next ? 'true' : 'false');
    } catch {
      // localStorage may be unavailable (private browsing, etc); in-memory
      // state still applies for the rest of this session.
    }
  }, []);

  // Tracks which series have already auto-loaded so we don't re-auto-load
  // on every panel re-render or on transient grid-state changes.
  const autoLoadedSeriesRef = (0,react.useRef)(new Set());
  // Tracks the request id for the most recent /related call so stale
  // responses (user changed series mid-flight) don't overwrite a fresher list.
  const relatedRequestIdRef = (0,react.useRef)(0);

  // ─── series-context subscription ───────────────────────────────────── //
  (0,react.useEffect)(() => {
    if (!config.enabled) return undefined;
    const services = servicesManager?.services ?? {};
    const viewportGridService = services.viewportGridService;
    const displaySetService = services.displaySetService;
    if (!viewportGridService || !displaySetService) return undefined;
    const refresh = () => {
      const next = deriveSeriesContext(servicesManager);
      setSeriesContext(prev => {
        if (prev === next) return prev;
        if (prev && next && prev.studyInstanceUID === next.studyInstanceUID && prev.seriesInstanceUID === next.seriesInstanceUID && prev.displaySetInstanceUID === next.displaySetInstanceUID && prev.viewportId === next.viewportId) {
          return prev;
        }
        return next;
      });
    };
    refresh();
    const subs = [];
    const subscribe = (svc, evt) => {
      if (!evt || typeof svc?.subscribe !== 'function') return;
      try {
        const handle = svc.subscribe(evt, refresh);
        if (handle && typeof handle.unsubscribe === 'function') {
          subs.push(() => handle.unsubscribe());
        } else if (typeof handle === 'function') {
          subs.push(handle);
        }
      } catch {
        // ignore — older PubSubService variants
      }
    };
    const grid = viewportGridService.EVENTS ?? {};
    subscribe(viewportGridService, grid.ACTIVE_VIEWPORT_ID_CHANGED);
    subscribe(viewportGridService, grid.GRID_STATE_CHANGED);
    subscribe(viewportGridService, grid.VIEWPORTS_READY);
    const ds = displaySetService.EVENTS ?? {};
    subscribe(displaySetService, ds.DISPLAY_SETS_ADDED);
    subscribe(displaySetService, ds.DISPLAY_SETS_CHANGED);
    return () => {
      for (const unsub of subs) {
        try {
          unsub();
        } catch {
          // ignore
        }
      }
    };
  }, [config.enabled, servicesManager]);

  // ─── /related fetch on series change ──────────────────────────────── //
  const refetchOverlays = (0,react.useCallback)(async ctx => {
    const reqId = ++relatedRequestIdRef.current;
    if (!ctx) {
      setOverlays([]);
      setListingStatus('idle');
      setListingError(null);
      return;
    }
    setListingStatus('loading');
    setListingError(null);
    try {
      const rows = await client.related(ctx.studyInstanceUID, ctx.seriesInstanceUID);
      if (reqId !== relatedRequestIdRef.current) return; // stale
      setOverlays(Array.isArray(rows) ? rows : []);
      setListingStatus('ready');
    } catch (err) {
      if (reqId !== relatedRequestIdRef.current) return;
      setOverlays([]);
      setListingStatus('error');
      setListingError(describeError(err));
    }
  }, [client]);
  (0,react.useEffect)(() => {
    if (!config.enabled) return;
    refetchOverlays(seriesContext);
  }, [config.enabled, refetchOverlays, seriesContext]);

  // ─── auto-load first overlay on series open ────────────────────────── //
  (0,react.useEffect)(() => {
    if (!config.enabled || !config.autoLoadOnSeriesOpen) return;
    if (listingStatus !== 'ready' || overlays.length === 0 || !seriesContext) return;
    const seriesKey = seriesContext.seriesInstanceUID;
    if (autoLoadedSeriesRef.current.has(seriesKey)) return;
    autoLoadedSeriesRef.current.add(seriesKey);
    void loadOverlay(overlays[0]);
    // Note: loadOverlay is intentionally not in the deps — re-creating the
    // closure on rowState changes would re-fire the auto-load. The captured
    // `client` / `commandsManager` / `seriesContext` are stable across this
    // effect's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.enabled, config.autoLoadOnSeriesOpen, listingStatus, overlays, seriesContext]);

  // ─── per-row load action ────────────────────────────────────────────── //
  const loadOverlay = (0,react.useCallback)(async record => {
    if (!seriesContext) return;
    const key = rowKey(seriesContext.seriesInstanceUID, record.id);
    setRowState(prev => ({
      ...prev,
      [key]: {
        status: 'loading',
        stage: 'fetching'
      }
    }));
    const onProgress = stage => {
      setRowState(prev => {
        const cur = prev[key];
        if (!cur || cur.status !== 'loading') return prev;
        return {
          ...prev,
          [key]: {
            ...cur,
            stage
          }
        };
      });
    };
    const onBeforeResample = config.alignment.promptOnResample ? () => {
      if (typeof window === 'undefined') return true;
      const msg = `"${record.name ?? record.id}" does not match the active DICOM grid. ` + 'Resample on the client (nearest-neighbor)? This may take a moment for large volumes.';
      // window.confirm is synchronous; still wrap in Promise.resolve for
      // type compatibility with the async option.
      return window.confirm(msg);
    } : undefined;
    try {
      const result = await commandsManager.runCommand('loadNiftiOverlay', {
        id: record.id,
        record,
        viewportId: seriesContext.viewportId,
        displaySetInstanceUID: seriesContext.displaySetInstanceUID,
        studyInstanceUID: seriesContext.studyInstanceUID,
        seriesInstanceUID: seriesContext.seriesInstanceUID,
        alignment: {
          ...config.alignment,
          assumeDicomGrid
        },
        onProgress,
        onBeforeResample
      });
      if (!result) {
        throw new Error('loadNiftiOverlay returned no result');
      }
      setRowState(prev => ({
        ...prev,
        [key]: {
          status: 'done',
          fastPath: result.fastPath,
          voxelCount: result.voxelCount
        }
      }));
      showNotification(servicesManager, 'success', `${record.name ?? `Overlay ${record.id}`} loaded` + (result.fastPath ? ' (exact grid)' : ' (resampled)'));
    } catch (err) {
      const message = describeError(err);
      const isWrongViewport = err instanceof LoadNiftiOverlayWrongViewportError;
      const isCancelled = err instanceof LoadNiftiOverlayCancelledError;
      setRowState(prev => ({
        ...prev,
        [key]: {
          status: isWrongViewport ? 'warning' : 'error',
          error: message
        }
      }));
      let notificationType;
      let notificationMessage;
      if (isCancelled) {
        notificationType = 'info';
        notificationMessage = `Load cancelled for ${record.name ?? record.id}`;
      } else if (isWrongViewport) {
        // Layout issue, not a real failure — surface as a warning with
        // just the recovery instructions (no "Failed to load …" prefix).
        notificationType = 'warning';
        notificationMessage = message;
      } else {
        notificationType = 'error';
        notificationMessage = `Failed to load ${record.name ?? record.id}: ${message}`;
      }
      showNotification(servicesManager, notificationType, notificationMessage);
    }
  }, [assumeDicomGrid, commandsManager, config.alignment, seriesContext, servicesManager]);

  // ─── render ─────────────────────────────────────────────────────────── //

  if (!config.raw) {
    return /*#__PURE__*/react.createElement("div", {
      className: "niftiOverlayPanel"
    }, /*#__PURE__*/react.createElement("div", {
      className: "niftiOverlayPanel__header"
    }, /*#__PURE__*/react.createElement("h3", {
      className: "niftiOverlayPanel__title"
    }, "NIfTI Overlay")), /*#__PURE__*/react.createElement("div", {
      className: "niftiOverlayPanel__notice niftiOverlayPanel__notice--error"
    }, /*#__PURE__*/react.createElement("strong", null, "Not configured."), " Missing ", /*#__PURE__*/react.createElement("code", null, "window.config.niftiOverlay"), ' ', "block. Add it to ", /*#__PURE__*/react.createElement("code", null, "plugins/ohifv3/config/databricks.js"), " and", ' ', /*#__PURE__*/react.createElement("code", null, ".databricks_ohif_config"), "."));
  }
  if (!config.enabled) {
    return /*#__PURE__*/react.createElement("div", {
      className: "niftiOverlayPanel"
    }, /*#__PURE__*/react.createElement("div", {
      className: "niftiOverlayPanel__header"
    }, /*#__PURE__*/react.createElement("h3", {
      className: "niftiOverlayPanel__title"
    }, "NIfTI Overlay")), /*#__PURE__*/react.createElement("div", {
      className: "niftiOverlayPanel__notice niftiOverlayPanel__notice--warn"
    }, /*#__PURE__*/react.createElement("strong", null, "Disabled."), " Set", ' ', /*#__PURE__*/react.createElement("code", null, "window.config.niftiOverlay.enabled = true"), " to activate."));
  }
  const visibleOverlays = overlays.slice(0, config.maxOverlaysListed);
  const truncated = overlays.length > config.maxOverlaysListed;
  return /*#__PURE__*/react.createElement("div", {
    className: "niftiOverlayPanel"
  }, /*#__PURE__*/react.createElement("div", {
    className: "niftiOverlayPanel__header"
  }, /*#__PURE__*/react.createElement("h3", {
    className: "niftiOverlayPanel__title"
  }, "NIfTI Overlay"), /*#__PURE__*/react.createElement("button", {
    type: "button",
    className: "niftiOverlayPanel__refresh",
    disabled: listingStatus === 'loading' || !seriesContext,
    onClick: () => refetchOverlays(seriesContext),
    title: "Refetch the overlay list for the active series"
  }, listingStatus === 'loading' ? 'Refreshing…' : 'Refresh')), !seriesContext && /*#__PURE__*/react.createElement("div", {
    className: "niftiOverlayPanel__notice niftiOverlayPanel__notice--info"
  }, "Open a series in a viewport to see related NIfTI overlays."), seriesContext && /*#__PURE__*/react.createElement("div", {
    className: "niftiOverlayPanel__series"
  }, /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement("strong", null, "Series"), ' ', /*#__PURE__*/react.createElement("code", null, shortenUid(seriesContext.seriesInstanceUID))), /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement("strong", null, "Study"), ' ', /*#__PURE__*/react.createElement("code", null, shortenUid(seriesContext.studyInstanceUID)))), /*#__PURE__*/react.createElement("div", {
    className: "niftiOverlayPanel__options"
  }, /*#__PURE__*/react.createElement("label", {
    className: "niftiOverlayPanel__toggle",
    title: 'When ON, the NIfTI buffer is written into the labelmap as-is — its affine header is ignored. ' + 'Use this for NIfTIs whose voxel layout already matches the source DICOM grid even though the ' + 'file header advertises a different orientation (e.g. RAS+ / LAS+ exports of an LPS+ DICOM). ' + 'Leave OFF for well-formed NIfTIs.'
  }, /*#__PURE__*/react.createElement("input", {
    type: "checkbox",
    checked: assumeDicomGrid,
    onChange: e => persistAssumeDicomGrid(e.currentTarget.checked)
  }), /*#__PURE__*/react.createElement("span", null, "Trust voxel order (skip affine alignment)"))), listingStatus === 'error' && /*#__PURE__*/react.createElement("div", {
    className: "niftiOverlayPanel__notice niftiOverlayPanel__notice--error"
  }, /*#__PURE__*/react.createElement("strong", null, "Couldn't list overlays."), " ", listingError), seriesContext && listingStatus === 'ready' && overlays.length === 0 && /*#__PURE__*/react.createElement("div", {
    className: "niftiOverlayPanel__empty"
  }, "No overlays for this series."), visibleOverlays.length > 0 && /*#__PURE__*/react.createElement("ul", {
    className: "niftiOverlayPanel__list"
  }, visibleOverlays.map(record => /*#__PURE__*/react.createElement(OverlayRow, {
    key: record.id,
    record: record,
    state: rowState[rowKey(seriesContext.seriesInstanceUID, record.id)],
    onLoad: () => loadOverlay(record)
  }))), truncated && /*#__PURE__*/react.createElement("div", {
    className: "niftiOverlayPanel__footer"
  }, "Showing first ", config.maxOverlaysListed, " of ", overlays.length, " overlays. Raise", ' ', /*#__PURE__*/react.createElement("code", null, "niftiOverlay.maxOverlaysListed"), " to see more."), config.alignment.promptOnResample && /*#__PURE__*/react.createElement("div", {
    className: "niftiOverlayPanel__footer"
  }, /*#__PURE__*/react.createElement("em", null, "promptOnResample"), " is on: you'll be asked before any client-side resample."));
};
/* harmony default export */ const components_NiftiOverlayPanel = (NiftiOverlayPanel);

// ─────────────────────────────────────────────────────────────────────────── //
//  Sub-components                                                              //
// ─────────────────────────────────────────────────────────────────────────── //

const OverlayRow = ({
  record,
  state,
  onLoad
}) => {
  const status = state?.status ?? 'idle';
  const meta = describeRecord(record);
  const labelEntries = Object.entries(record.label_info ?? {});
  let cls = 'niftiOverlayPanel__row';
  if (status === 'done') cls += ' niftiOverlayPanel__row--loaded';else if (status === 'error') cls += ' niftiOverlayPanel__row--error';else if (status === 'warning') cls += ' niftiOverlayPanel__row--warning';
  return /*#__PURE__*/react.createElement("li", {
    className: cls
  }, /*#__PURE__*/react.createElement("div", {
    className: "niftiOverlayPanel__rowHeader"
  }, /*#__PURE__*/react.createElement("h4", {
    className: "niftiOverlayPanel__rowName"
  }, record.name?.trim() ? record.name : `Overlay ${shortenUid(record.id)}`, status === 'done' && state?.fastPath === true && /*#__PURE__*/react.createElement("span", {
    className: "niftiOverlayPanel__badge niftiOverlayPanel__badge--exact"
  }, "exact"), status === 'done' && state?.fastPath === false && /*#__PURE__*/react.createElement("span", {
    className: "niftiOverlayPanel__badge niftiOverlayPanel__badge--resampled"
  }, "resampled"))), meta.length > 0 && /*#__PURE__*/react.createElement("p", {
    className: "niftiOverlayPanel__rowMeta"
  }, meta.join(' · ')), record.description && /*#__PURE__*/react.createElement("p", {
    className: "niftiOverlayPanel__rowMeta"
  }, record.description), labelEntries.length > 0 && /*#__PURE__*/react.createElement("ul", {
    className: "niftiOverlayPanel__labelInfo"
  }, labelEntries.map(([idx, entry]) => /*#__PURE__*/react.createElement("li", {
    key: idx
  }, /*#__PURE__*/react.createElement("span", {
    className: "niftiOverlayPanel__legendDot",
    style: {
      background: colorToCss(entry?.color)
    },
    "aria-hidden": "true"
  }), entry?.name ?? `label ${idx}`))), /*#__PURE__*/react.createElement("div", {
    className: "niftiOverlayPanel__rowActions"
  }, /*#__PURE__*/react.createElement("button", {
    type: "button",
    className: "niftiOverlayPanel__loadButton",
    disabled: status === 'loading',
    onClick: onLoad
  }, status === 'done' ? 'Reload' : 'Load'), status === 'loading' && /*#__PURE__*/react.createElement("span", {
    className: "niftiOverlayPanel__status"
  }, /*#__PURE__*/react.createElement("span", {
    className: "niftiOverlayPanel__spinner",
    "aria-hidden": "true"
  }), STAGE_LABEL[state?.stage ?? 'fetching']), status === 'done' && state?.voxelCount != null && /*#__PURE__*/react.createElement("span", {
    className: "niftiOverlayPanel__status"
  }, state.voxelCount.toLocaleString(), " voxels")), status === 'error' && state?.error && /*#__PURE__*/react.createElement("p", {
    className: "niftiOverlayPanel__rowError",
    title: state.error
  }, state.error), status === 'warning' && state?.error && /*#__PURE__*/react.createElement("p", {
    className: "niftiOverlayPanel__rowWarning",
    title: state.error
  }, state.error));
};

// ─────────────────────────────────────────────────────────────────────────── //
//  Misc                                                                        //
// ─────────────────────────────────────────────────────────────────────────── //

function shortenUid(uid) {
  if (!uid) return '';
  if (uid.length <= 24) return uid;
  return `${uid.slice(0, 10)}…${uid.slice(-10)}`;
}
function showNotification(servicesManager, type, message, duration = 3500) {
  const ui = servicesManager?.services?.uiNotificationService;
  if (typeof ui?.show !== 'function') return;
  try {
    ui.show({
      title: 'NIfTI Overlay',
      message,
      type,
      duration
    });
  } catch {
    // ignore — notifications are non-essential
  }
}
;// ../../../../../../../plugins/ohifv3/extensions/nifti-segmentation/src/getPanelModule.tsx



/*
 * Side-panel registration.
 *
 * The panel name `nifti-segmentation.niftiOverlayPanel` is referenced by the
 * mode wiring (added in a later step) to mount this panel in the viewer's
 * right-side panel area.
 */
function getPanelModule({
  commandsManager,
  servicesManager,
  extensionManager
}) {
  const wrappedPanel = () => /*#__PURE__*/react.createElement(components_NiftiOverlayPanel, {
    commandsManager: commandsManager,
    servicesManager: servicesManager,
    extensionManager: extensionManager
  });
  return [{
    name: 'niftiOverlayPanel',
    // Custom icon — registered in OHIF's Icons.tsx via the patch
    // `viewers_platform_ui-next_src_components_Icons_Icons.tsx.patch`
    // (source at `plugins/ohifv3/platform/ui-next/src/components/Icons/Sources/NiftiOverlayIcon.tsx`).
    iconName: 'icon-nifti-overlay',
    iconLabel: 'NIfTI Overlay',
    label: 'NIfTI Overlay',
    component: wrappedPanel
  }];
}
/* harmony default export */ const src_getPanelModule = (getPanelModule);
;// ../../../../../../../plugins/ohifv3/extensions/nifti-segmentation/src/index.tsx
/*
 * @ohif/extension-nifti-segmentation
 *
 * Loads NIfTI (.nii.gz) segmentation masks fetched from a Delta-table-backed
 * gateway and overlays them on the active DICOM volume viewport.
 *
 * Reads its configuration from `window.config.niftiOverlay` (see
 * plugins/ohifv3/config/databricks.js and .databricks_ohif_config) and the
 * active data source's qidoRoot.
 *
 * Standalone: no dependency on @ohif/extension-monai-label.
 *
 * See also:
 *   - ../../../../nifti_overlay/README.md
 *   - ../../../../NIFTI_OVERLAY_PLAN.md
 */




const niftiSegmentationExtension = {
  id: id,
  getPanelModule: src_getPanelModule,
  getCommandsModule: getCommandsModule
};
/* harmony default export */ const src = (niftiSegmentationExtension);


/***/ }

}]);