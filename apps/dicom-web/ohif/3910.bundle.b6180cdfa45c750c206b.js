"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[3910],{

/***/ 3910
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ viewports_OHIFDicomECGViewport)
});

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../../node_modules/prop-types/index.js
var prop_types = __webpack_require__(97598);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
// EXTERNAL MODULE: ../../../node_modules/dcmjs/build/dcmjs.es.js
var dcmjs_es = __webpack_require__(5842);
// EXTERNAL MODULE: ../../core/src/index.ts + 69 modules
var src = __webpack_require__(42356);
// EXTERNAL MODULE: ../../../node_modules/dicomweb-client/build/dicomweb-client.es.js
var dicomweb_client_es = __webpack_require__(83562);
;// ../../../../../../../plugins/ohifv3/extensions/default/src/DatabricksPixelsDicom/findIndexOfString.ts
function checkToken(token, data, dataOffset) {
  if (dataOffset + token.length > data.length) {
    return false;
  }
  let endIndex = dataOffset;
  for (let i = 0; i < token.length; i++) {
    if (token[i] !== data[endIndex++]) {
      return false;
    }
  }
  return true;
}
function stringToUint8Array(str) {
  const uint = new Uint8Array(str.length);
  for (let i = 0, j = str.length; i < j; i++) {
    uint[i] = str.charCodeAt(i);
  }
  return uint;
}
function findIndexOfString(data, str, offset) {
  offset = offset || 0;
  const token = stringToUint8Array(str);
  for (let i = offset; i < data.length; i++) {
    if (token[0] === data[i]) {
      // console.log('match @', i);
      if (checkToken(token, data, i)) {
        return i;
      }
    }
  }
  return -1;
}
/* harmony default export */ const DatabricksPixelsDicom_findIndexOfString = (findIndexOfString);
;// ../../../../../../../plugins/ohifv3/extensions/default/src/DatabricksPixelsDicom/fixMultipart.ts


/**
 * Fix multipart data coming back from the retrieve bulkdata request, but
 * incorrectly tagged as application/octet-stream.  Some servers don't handle
 * the response type correctly, and this method is relatively robust about
 * detecting multipart data correctly.  It will only extract one value.
 */
function fixMultipart(arrayData) {
  const data = new Uint8Array(arrayData[0]);
  // Don't know the exact minimum length, but it is at least 25 to encode multipart
  if (data.length < 25) {
    return arrayData;
  }
  const dashIndex = DatabricksPixelsDicom_findIndexOfString(data, '--');
  if (dashIndex > 6) {
    return arrayData;
  }
  const tokenIndex = DatabricksPixelsDicom_findIndexOfString(data, '\r\n\r\n', dashIndex);
  if (tokenIndex > 512) {
    // Allow for 512 characters in the header - there is no apriori limit, but
    // this seems ok for now as we only expect it to have content type in it.
    return arrayData;
  }
  const header = uint8ArrayToString(data, 0, tokenIndex);
  // Now find the boundary  marker
  const responseHeaders = header.split('\r\n');
  const boundary = findBoundary(responseHeaders);
  if (!boundary) {
    return arrayData;
  }
  // Start of actual data is 4 characters after the token
  const offset = tokenIndex + 4;
  const endIndex = DatabricksPixelsDicom_findIndexOfString(data, boundary, offset);
  if (endIndex === -1) {
    return arrayData;
  }
  return [data.slice(offset, endIndex - 2).buffer];
}
function findBoundary(header) {
  for (let i = 0; i < header.length; i++) {
    if (header[i].substr(0, 2) === '--') {
      return header[i];
    }
  }
}
function findContentType(header) {
  for (let i = 0; i < header.length; i++) {
    if (header[i].substr(0, 13) === 'Content-Type:') {
      return header[i].substr(13).trim();
    }
  }
}
function uint8ArrayToString(data, offset, length) {
  offset = offset || 0;
  length = length || data.length - offset;
  let str = '';
  for (let i = offset; i < offset + length; i++) {
    str += String.fromCharCode(data[i]);
  }
  return str;
}
;// ../../../../../../../plugins/ohifv3/extensions/default/src/DatabricksPixelsDicom/StaticWadoClient.ts


const {
  DicomMetadataStore
} = __webpack_require__(42356);
const {
  DICOMwebClient
} = dicomweb_client_es/* api */.FH;
const anyDicomwebClient = DICOMwebClient;

// Ugly over-ride, but the internals aren't otherwise accessible.
if (!anyDicomwebClient._orig_buildMultipartAcceptHeaderFieldValue) {
  anyDicomwebClient._orig_buildMultipartAcceptHeaderFieldValue = anyDicomwebClient._buildMultipartAcceptHeaderFieldValue;
  anyDicomwebClient._buildMultipartAcceptHeaderFieldValue = function (mediaTypes, acceptableTypes) {
    if (mediaTypes.length === 1 && mediaTypes[0].mediaType.endsWith('/*')) {
      return '*/*';
    } else {
      return anyDicomwebClient._orig_buildMultipartAcceptHeaderFieldValue(mediaTypes, acceptableTypes);
    }
  };
}

/**
 * An implementation of the static wado client, that fetches data from
 * a static response rather than actually doing real queries.  This allows
 * fast encoding of test data, but because it is static, anything actually
 * performing searches doesn't work.  This version fixes the query issue
 * by manually implementing a query option.
 */

class StaticWadoClient extends dicomweb_client_es/* api */.FH.DICOMwebClient {
  constructor(config, servicesManager) {
    super(config);
    this.config = void 0;
    this.staticWado = void 0;
    this.servicesManager = void 0;
    this.staticWado = config.staticWado;
    this.config = config;
    this.servicesManager = servicesManager;
  }

  /**
   * Handle improperly specified multipart/related return type.
   * Note if the response is SUPPOSED to be multipart encoded already, then this
   * will double-decode it.
   *
   * @param options
   * @returns De-multiparted response data.
   *
   */
  retrieveBulkData(options) {
    const shouldFixMultipart = this.config.fixBulkdataMultipart !== false;
    const useOptions = {
      ...options
    };
    if (this.staticWado) {
      useOptions.mediaTypes = [{
        mediaType: 'application/*'
      }];
    }
    return super.retrieveBulkData(useOptions).then(result => shouldFixMultipart ? fixMultipart(result) : result);
  }

  /**
   * Retrieves instance frames using the image/* media type when configured
   * to do so (static wado back end).
   */
  retrieveInstanceFrames(options) {
    console.log("retrieveInstanceFrames", options);

    // Retrieve instance from DicomMetadataStore
    const storedInstance = DicomMetadataStore.getInstance(options.studyInstanceUID, options.seriesInstanceUID, options.sopInstanceUID);
    if (storedInstance) {
      console.log("Retrieved context info from DicomMetadataStore:");
      console.log("- URL:", storedInstance.url);
      console.log("- WADO URI:", storedInstance.wadoUri);
      console.log("- Image ID:", storedInstance.imageId);
      console.log("- Volume Root:", storedInstance.volumeRoot);
      console.log("- Instance Metadata:", storedInstance);
    }
    return this._httpGetMultipartApplicationOctetStream(storedInstance.wadoUri.replace("/files/", "/files_wsi/") + "?frames=" + options.frameNumbers.toString(), false, false, false, false, false);
    // removed by dead control flow

  }

  /**
   * Replace the search for studies remote query with a local version which
   * retrieves a complete query list and then sub-selects from it locally.
   * @param {*} options
   * @returns
   */
  async searchForStudies(options) {
    if (!this.staticWado) {
      return super.searchForStudies(options);
    }
    const searchResult = await super.searchForStudies(options);
    const {
      queryParams
    } = options;
    if (!queryParams) {
      return searchResult;
    }
    const lowerParams = this.toLowerParams(queryParams);
    const filtered = searchResult.filter(study => {
      for (const key of Object.keys(StaticWadoClient.studyFilterKeys)) {
        if (!this.filterItem(key, lowerParams, study, StaticWadoClient.studyFilterKeys)) {
          return false;
        }
      }
      return true;
    });
    return filtered;
  }
  async searchForSeries(options) {
    if (!this.staticWado) {
      return super.searchForSeries(options);
    }
    const searchResult = await super.searchForSeries(options);
    const {
      queryParams
    } = options;
    if (!queryParams) {
      return searchResult;
    }
    const lowerParams = this.toLowerParams(queryParams);
    const filtered = searchResult.filter(series => {
      for (const key of Object.keys(StaticWadoClient.seriesFilterKeys)) {
        if (!this.filterItem(key, lowerParams, series, StaticWadoClient.seriesFilterKeys)) {
          return false;
        }
      }
      return true;
    });
    return filtered;
  }

  /**
   * Compares values, matching any instance of desired to any instance of
   * actual by recursively go through the paired set of values.  That is,
   * this is O(m*n) where m is how many items in desired and n is the length of actual
   * Then, at the individual item node, compares the Alphabetic name if present,
   * and does a sub-string matching on string values, and otherwise does an
   * exact match comparison.
   *
   * @param {*} desired
   * @param {*} actual
   * @param {*} options - fuzzyMatching: if true, then do a sub-string match
   * @returns true if the values match
   */
  compareValues(desired, actual, options) {
    const {
      fuzzyMatching
    } = options;
    if (Array.isArray(desired)) {
      return desired.find(item => this.compareValues(item, actual, options));
    }
    if (Array.isArray(actual)) {
      return actual.find(actualItem => this.compareValues(desired, actualItem, options));
    }
    if (actual?.Alphabetic) {
      actual = actual.Alphabetic;
    }
    if (fuzzyMatching && typeof actual === 'string' && typeof desired === 'string') {
      const normalizeValue = str => {
        return str.toLowerCase();
      };
      const normalizedDesired = normalizeValue(desired);
      const normalizedActual = normalizeValue(actual);
      const tokenizeAndNormalize = str => str.split(/[\s^]+/).filter(Boolean);
      const desiredTokens = tokenizeAndNormalize(normalizedDesired);
      const actualTokens = tokenizeAndNormalize(normalizedActual);
      return desiredTokens.every(desiredToken => actualTokens.some(actualToken => actualToken.startsWith(desiredToken)));
    }
    if (typeof actual == 'string') {
      if (actual.length === 0) {
        return true;
      }
      if (desired.length === 0 || desired === '*') {
        return true;
      }
      if (desired[0] === '*' && desired[desired.length - 1] === '*') {
        // console.log(`Comparing ${actual} to ${desired.substring(1, desired.length - 1)}`)
        return actual.indexOf(desired.substring(1, desired.length - 1)) != -1;
      } else if (desired[desired.length - 1] === '*') {
        return actual.indexOf(desired.substring(0, desired.length - 1)) != -1;
      } else if (desired[0] === '*') {
        return actual.indexOf(desired.substring(1)) === actual.length - desired.length + 1;
      }
    }
    return desired === actual;
  }

  /** Compares a pair of dates to see if the value is within the range */
  compareDateRange(range, value) {
    if (!value) {
      return true;
    }
    const dash = range.indexOf('-');
    if (dash === -1) {
      return this.compareValues(range, value, {});
    }
    const start = range.substring(0, dash);
    const end = range.substring(dash + 1);
    return (!start || value >= start) && (!end || value <= end);
  }

  /**
   * Filters the return list by the query parameters.
   *
   * @param anyCaseKey - a possible search key
   * @param queryParams -
   * @param {*} study
   * @param {*} sourceFilterMap
   * @returns
   */
  filterItem(key, queryParams, study, sourceFilterMap) {
    const isName = key => key.indexOf('name') !== -1;
    const {
      supportsFuzzyMatching = false
    } = this.config;
    const options = {
      fuzzyMatching: isName(key) && supportsFuzzyMatching
    };
    const altKey = sourceFilterMap[key] || key;
    if (!queryParams) {
      return true;
    }
    const testValue = queryParams[key] || queryParams[altKey];
    if (!testValue) {
      return true;
    }
    const valueElem = study[key] || study[altKey];
    if (!valueElem) {
      return false;
    }
    if (valueElem.vr === 'DA' && valueElem.Value?.[0]) {
      return this.compareDateRange(testValue, valueElem.Value[0]);
    }
    const value = valueElem.Value;
    return this.compareValues(testValue, value, options);
  }

  /** Converts the query parameters to lower case query parameters */
  toLowerParams(queryParams) {
    const lowerParams = {};
    Object.entries(queryParams).forEach(([key, value]) => {
      lowerParams[key.toLowerCase()] = value;
    });
    return lowerParams;
  }
}
StaticWadoClient.studyFilterKeys = {
  studyinstanceuid: '0020000D',
  patientname: '00100010',
  '00100020': 'mrn',
  studydescription: '00081030',
  studydate: '00080020',
  modalitiesinstudy: '00080061',
  accessionnumber: '00080050'
};
StaticWadoClient.seriesFilterKeys = {
  seriesinstanceuid: '0020000E',
  seriesnumber: '00200011',
  modality: '00080060'
};
;// ../../../../../../../plugins/ohifv3/extensions/dicom-ecg/src/utils/dicomWebClient.ts




/**
 * Build a DICOMweb client compatible with the currently-active OHIF data source.
 *
 * Used as a fallback path by the ECG viewport when a direct WADO-URI or local
 * reconstruction isn't possible.
 */
function getDicomWebClient({
  extensionManager,
  servicesManager
}) {
  const dataSourceConfig = window.config.dataSources.find(ds => ds.sourceName === extensionManager.activeDataSourceName);
  if (!dataSourceConfig) {
    throw new Error(`dicom-ecg: cannot find active data source "${extensionManager.activeDataSourceName}"`);
  }
  const {
    userAuthenticationService
  } = servicesManager.services;
  const {
    wadoRoot,
    staticWado,
    singlepart
  } = dataSourceConfig.configuration || {};
  const wadoConfig = {
    url: wadoRoot || '/dicomlocal',
    staticWado,
    singlepart,
    headers: userAuthenticationService?.getAuthorizationHeader?.() || {},
    errorInterceptor: src.errorHandler.getHTTPErrorHandler()
  };
  let client;
  try {
    client = new StaticWadoClient(wadoConfig);
  } catch (e) {
    client = new dicomweb_client_es/* api */.FH.DICOMwebClient(wadoConfig);
  }
  // @ts-ignore
  client.wadoURL = wadoConfig.url;
  return client;
}
;// ../../../../../../../plugins/ohifv3/extensions/dicom-ecg/src/utils/loadEcgBytes.ts
// @ts-ignore - dcmjs has no published types



/**
 * The ecg-dicom-web-viewer library expects a raw DICOM Part-10 ArrayBuffer
 * (128-byte preamble + "DICM" magic + dataset). OHIF v3 doesn't ship a single
 * helper that returns that buffer for every data source, so this function
 * walks three strategies (best-first) and returns the first one that yields
 * a valid DICM-prefixed buffer.
 *
 * Strategy A (Databricks Pixels): instance.wadoUri is a direct URL to the
 *   raw DICOM file on a Databricks Volume; fetch it with the OHIF auth header.
 *
 * Strategy B (standard DICOMweb): call client.retrieveInstance(...) which goes
 *   to WADO-RS GET /studies/.../series/.../instances/... and returns a clean
 *   ArrayBuffer (multipart parsing is handled by dicomweb-client).
 *
 * Strategy C (dicomlocal / fallback): the instance is already a naturalized
 *   dcmjs dataset in memory; re-serialize it to a Part-10 buffer with
 *   dcmjs.data.datasetToBlob.
 *
 * Each strategy is wrapped in a try/catch so that a single-strategy failure
 * doesn't block the next one. Verbose console.debug output makes triage easy.
 */

const DICM_OFFSET = 128;
const DICM = [0x44, 0x49, 0x43, 0x4d]; // 'D','I','C','M'

function hasDicmHeader(bytes) {
  if (!bytes || bytes.length < DICM_OFFSET + 4) {
    return false;
  }
  return bytes[DICM_OFFSET] === DICM[0] && bytes[DICM_OFFSET + 1] === DICM[1] && bytes[DICM_OFFSET + 2] === DICM[2] && bytes[DICM_OFFSET + 3] === DICM[3];
}
function describe(bytes) {
  if (!bytes) return '<null>';
  const head = Array.from(bytes.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join(' ');
  const dicmAt128 = hasDicmHeader(bytes) ? 'yes' : 'no';
  return `length=${bytes.length}, head=${head}, DICM@128=${dicmAt128}`;
}
function toUint8Array(value) {
  if (!value) return null;
  if (value instanceof Uint8Array) return value;
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (Array.isArray(value) && value.length > 0) {
    const part = value[0];
    if (part instanceof Uint8Array) return part;
    if (part instanceof ArrayBuffer) return new Uint8Array(part);
  }
  if (value.buffer instanceof ArrayBuffer) {
    return new Uint8Array(value.buffer);
  }
  return null;
}
async function tryFetchWadoUri(wadoUri, servicesManager) {
  const {
    userAuthenticationService
  } = servicesManager?.services || {};
  const headers = {
    Accept: 'application/dicom',
    ...(userAuthenticationService?.getAuthorizationHeader?.() || {})
  };

  // eslint-disable-next-line no-console
  console.debug('dicom-ecg: strategy A - fetching wadoUri', wadoUri);
  const response = await fetch(wadoUri, {
    headers
  });
  if (!response.ok) {
    throw new Error(`wadoUri fetch failed: HTTP ${response.status} ${response.statusText}`);
  }
  const contentType = response.headers.get('content-type') || '';
  const buffer = await response.arrayBuffer();
  let bytes = new Uint8Array(buffer);

  // If the server returned multipart/related, strip the boundary headers and
  // keep only the binary payload.
  if (/multipart\//i.test(contentType)) {
    // eslint-disable-next-line no-console
    console.debug('dicom-ecg: response is multipart, decoding');
    bytes = decodeFirstMultipartPart(bytes, contentType) || bytes;
  }
  return bytes;
}
function decodeFirstMultipartPart(bytes, contentType) {
  const boundaryMatch = /boundary="?([^";]+)"?/i.exec(contentType);
  if (!boundaryMatch) return null;
  const boundary = `--${boundaryMatch[1]}`;
  const text = new TextDecoder('latin1').decode(bytes);
  const partStart = text.indexOf(boundary);
  if (partStart < 0) return null;
  const headerEnd = text.indexOf('\r\n\r\n', partStart);
  if (headerEnd < 0) return null;
  const payloadStart = headerEnd + 4;
  const payloadEnd = text.indexOf(`\r\n${boundary}`, payloadStart);
  const end = payloadEnd < 0 ? bytes.length : payloadEnd;
  return bytes.slice(payloadStart, end);
}
async function tryRetrieveInstance(displaySet, extensionManager, servicesManager) {
  const {
    StudyInstanceUID,
    SeriesInstanceUID,
    SOPInstanceUID
  } = displaySet;
  if (!StudyInstanceUID || !SeriesInstanceUID || !SOPInstanceUID) {
    return null;
  }

  // eslint-disable-next-line no-console
  console.debug('dicom-ecg: strategy B - WADO-RS retrieveInstance', {
    StudyInstanceUID,
    SeriesInstanceUID,
    SOPInstanceUID
  });
  const client = getDicomWebClient({
    extensionManager,
    servicesManager
  });
  if (typeof client.retrieveInstance !== 'function') {
    throw new Error('DICOMweb client has no retrieveInstance method');
  }
  const result = await client.retrieveInstance({
    studyInstanceUID: StudyInstanceUID,
    seriesInstanceUID: SeriesInstanceUID,
    sopInstanceUID: SOPInstanceUID
  });
  return toUint8Array(result);
}
async function tryReconstructFromInstanceAsync(displaySet) {
  const instance = displaySet.instances?.[0] || displaySet.instance;
  if (!instance) return null;

  // eslint-disable-next-line no-console
  console.debug('dicom-ecg: strategy C - re-serializing in-memory dataset via dcmjs');

  // datasetToBlob expects an OHIF-style naturalized dataset that already has
  // `_meta` populated (TransferSyntaxUID, MediaStorageSOPClassUID, etc). If it
  // doesn't, set sensible defaults so dcmjs can write a valid P10 file.
  if (!instance._meta) {
    instance._meta = {
      FileMetaInformationVersion: {
        Value: new Uint8Array([0, 1]).buffer,
        vr: 'OB'
      },
      MediaStorageSOPClassUID: {
        Value: [instance.SOPClassUID],
        vr: 'UI'
      },
      MediaStorageSOPInstanceUID: {
        Value: [instance.SOPInstanceUID],
        vr: 'UI'
      },
      TransferSyntaxUID: {
        Value: [instance.TransferSyntaxUID || '1.2.840.10008.1.2.1'],
        vr: 'UI'
      },
      ImplementationClassUID: {
        Value: ['1.2.840.10008.5.1.4.1.1.9.1.1'],
        vr: 'UI'
      },
      ImplementationVersionName: {
        Value: ['OHIF-DICOM-ECG'],
        vr: 'SH'
      }
    };
  }
  const blob = dcmjs_es/* default.data */.Ay.data.datasetToBlob(instance);
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
}
async function loadEcgBytes(displaySet, extensionManager, servicesManager) {
  const instance = displaySet.instances?.[0] || displaySet.instance || {};
  const dataSourceName = extensionManager?.activeDataSourceName;

  // eslint-disable-next-line no-console
  console.debug('dicom-ecg: loadEcgBytes', {
    dataSource: dataSourceName,
    StudyInstanceUID: displaySet.StudyInstanceUID,
    SOPInstanceUID: displaySet.SOPInstanceUID,
    SOPClassUID: displaySet.SOPClassUID,
    wadoUri: instance.wadoUri || instance.wadouri
  });
  const errors = [];

  // Strategy A: direct wadoUri fetch (works for Databricks Pixels and any
  // data source that surfaces a single-binary URL on the instance).
  const wadoUri = instance.wadoUri || instance.wadouri;
  if (wadoUri) {
    try {
      const bytes = await tryFetchWadoUri(wadoUri, servicesManager);
      // eslint-disable-next-line no-console
      console.debug('dicom-ecg: strategy A result -', describe(bytes));
      if (hasDicmHeader(bytes)) {
        return bytes;
      }
      // Even without DICM header it might be a raw dataset; keep as candidate.
      if (bytes && bytes.length > 132) {
        // eslint-disable-next-line no-console
        console.warn('dicom-ecg: strategy A returned bytes without DICM magic, will still try parser');
        return bytes;
      }
      errors.push('A: returned empty buffer');
    } catch (e) {
      errors.push(`A: ${e?.message || e}`);
      // eslint-disable-next-line no-console
      console.warn('dicom-ecg: strategy A failed', e);
    }
  } else {
    errors.push('A: no wadoUri on instance');
  }

  // Strategy B: standard WADO-RS retrieveInstance
  if (dataSourceName !== 'dicomlocal') {
    try {
      const bytes = await tryRetrieveInstance(displaySet, extensionManager, servicesManager);
      // eslint-disable-next-line no-console
      console.debug('dicom-ecg: strategy B result -', describe(bytes));
      if (hasDicmHeader(bytes)) {
        return bytes;
      }
      if (bytes && bytes.length > 132) {
        // eslint-disable-next-line no-console
        console.warn('dicom-ecg: strategy B returned bytes without DICM magic, will still try parser');
        return bytes;
      }
      errors.push('B: returned empty/invalid buffer');
    } catch (e) {
      errors.push(`B: ${e?.message || e}`);
      // eslint-disable-next-line no-console
      console.warn('dicom-ecg: strategy B failed', e);
    }
  } else {
    errors.push('B: skipped (dicomlocal data source)');
  }

  // Strategy C: reconstruct from already-parsed in-memory instance
  try {
    const bytes = await tryReconstructFromInstanceAsync(displaySet);
    // eslint-disable-next-line no-console
    console.debug('dicom-ecg: strategy C result -', describe(bytes));
    if (bytes && bytes.length > 0) {
      return bytes;
    }
    errors.push('C: returned empty buffer');
  } catch (e) {
    errors.push(`C: ${e?.message || e}`);
    // eslint-disable-next-line no-console
    console.warn('dicom-ecg: strategy C failed', e);
  }
  throw new Error(`Unable to load ECG bytes. Tried: ${errors.join(' | ')}`);
}
;// ../../../../../../../plugins/ohifv3/extensions/dicom-ecg/src/ecg/parseEcgWaveform.ts
// @ts-ignore - dcmjs ships no types


/**
 * Lightweight, dependency-free DICOM ECG waveform parser.
 *
 * Replaces the upstream `ecg-dicom-web-viewer` `ReadECG` class so we don't
 * have to vendor or patch the npm package. Uses `dcmjs` (already an OHIF
 * dependency) for DICOM Part-10 decoding, then walks the WaveformSequence
 * the way the DICOM standard (PS3.4 B.5, PS3.6 Annex A) describes:
 *
 *   1. Pick the best WaveformSequence item - 16-bit signed samples,
 *      most samples.
 *   2. Read raw multiplexed Int16 samples and split per channel.
 *   3. Apply ChannelBaseline + ChannelSensitivity * ChannelSensitivityCorrectionFactor.
 *   4. Convert to millivolts using ChannelSensitivityUnitsSequence
 *      (handles µV, mV, mmHg).
 *   5. Optionally low-pass filter at 40 Hz to clean line noise.
 *   6. Sort leads into the canonical 12-lead order
 *      (I, II, III, aVR, aVL, aVF, V1-V6) by ChannelSourceSequence
 *      CodeMeaning, falling back to MDC / SCPECG code-value lookups.
 *
 * Returns the patient header, waveform info annotations, and per-lead
 * Float32Array signals in millivolts. Callers feed the result into
 * `drawEcg.ts` to render. Designed to be small, allocation-light, and
 * forgiving of malformed inputs.
 */

const STANDARD_LEAD_ORDER = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];
const MDC_SCPECG_CODES = [{
  mdc: '2:1',
  scpEcg: '5.6.3-9-1',
  label: 'I'
}, {
  mdc: '2:2',
  scpEcg: '5.6.3-9-2',
  label: 'II'
}, {
  mdc: '2:61',
  scpEcg: '5.6.3-9-61',
  label: 'III'
}, {
  mdc: '2:62',
  scpEcg: '5.6.3-9-62',
  label: 'aVR'
}, {
  mdc: '2:63',
  scpEcg: '5.6.3-9-63',
  label: 'aVL'
}, {
  mdc: '2:64',
  scpEcg: '5.6.3-9-64',
  label: 'aVF'
}, {
  mdc: '2:3',
  scpEcg: '5.6.3-9-3',
  label: 'V1'
}, {
  mdc: '2:4',
  scpEcg: '5.6.3-9-4',
  label: 'V2'
}, {
  mdc: '2:5',
  scpEcg: '5.6.3-9-5',
  label: 'V3'
}, {
  mdc: '2:6',
  scpEcg: '5.6.3-9-6',
  label: 'V4'
}, {
  mdc: '2:7',
  scpEcg: '5.6.3-9-7',
  label: 'V5'
}, {
  mdc: '2:8',
  scpEcg: '5.6.3-9-8',
  label: 'V6'
}];
const INFO_KEYS_OF_INTEREST = [{
  key: 'HEART RATE',
  unit: 'BPM'
}, {
  key: 'HR',
  unit: 'BPM'
}, {
  key: 'P DURATION',
  unit: 'ms'
}, {
  key: 'QT INTERVAL',
  unit: 'ms'
}, {
  key: 'QTC INTERVAL',
  unit: 'ms'
}, {
  key: 'RR INTERVAL',
  unit: 'ms'
}, {
  key: 'VRATE',
  unit: 'BPM'
}, {
  key: 'QRS DURATION',
  unit: 'ms'
}, {
  key: 'QRS AXIS',
  unit: '°'
}, {
  key: 'T AXIS',
  unit: '°'
}, {
  key: 'P AXIS',
  unit: '°'
}, {
  key: 'PR INTERVAL',
  unit: 'ms'
}];
function parseEcgWaveform(arrayBuffer, options = {}) {
  const elements = readDicomDataset(arrayBuffer);
  const waveformSequence = coerceSequence(elements.WaveformSequence || elements['54000100'] || elements['5400,0100']);
  if (waveformSequence.length === 0) {
    throw new Error('DICOM ECG has no WaveformSequence');
  }
  const wf = pickBestWaveformItem(waveformSequence);
  if (wf.WaveformSampleInterpretation !== 'SS') {
    throw new Error(`Unsupported WaveformSampleInterpretation: ${wf.WaveformSampleInterpretation}`);
  }
  if (wf.WaveformBitsAllocated !== 16) {
    throw new Error(`Unsupported WaveformBitsAllocated: ${wf.WaveformBitsAllocated}`);
  }
  const channels = Number(wf.NumberOfWaveformChannels);
  const samples = Number(wf.NumberOfWaveformSamples);
  const samplingFrequency = Number(wf.SamplingFrequency);
  if (!channels || !samples || !samplingFrequency) {
    throw new Error(`Invalid waveform shape: channels=${channels} samples=${samples} fs=${samplingFrequency}`);
  }
  const channelDefs = coerceSequence(wf.ChannelDefinitionSequence);
  if (channelDefs.length === 0) {
    throw new Error('DICOM ECG has empty ChannelDefinitionSequence');
  }
  const {
    signals,
    labels
  } = decodeChannels(wf.WaveformData, channels, samples, channelDefs);
  if (options.applyLowPassFilter) {
    for (const sig of signals) {
      lowPassFilter40Hz(sig, samplingFrequency);
    }
  }
  const leads = signals.map((signal, i) => {
    let min = Infinity;
    let max = -Infinity;
    for (let j = 0; j < signal.length; j++) {
      const v = signal[j];
      if (v < min) min = v;
      if (v > max) max = v;
    }
    return {
      label: labels[i] || `Ch${i + 1}`,
      signal,
      min,
      max
    };
  });
  leads.sort((a, b) => {
    const ai = STANDARD_LEAD_ORDER.indexOf(a.label);
    const bi = STANDARD_LEAD_ORDER.indexOf(b.label);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
  let absMax = 0;
  for (const lead of leads) {
    const m = Math.max(Math.abs(lead.min), Math.abs(lead.max));
    if (m > absMax) absMax = m;
  }
  if (absMax === 0) {
    absMax = 1; // avoid divide-by-zero in renderer
  }
  const durationSec = samples / samplingFrequency;
  const patient = extractPatient(elements);
  const {
    info,
    annotations
  } = extractInfoAndAnnotations(elements, samples, durationSec);
  return {
    leads,
    samplingFrequency,
    samples,
    durationSec,
    patient,
    info,
    annotations,
    absMax
  };
}

// ---------- DICOM parsing helpers ----------

function readDicomDataset(arrayBuffer) {
  // Normal Part-10 read first.
  try {
    const dict = dcmjs_es/* default.data */.Ay.data.DicomMessage.readFile(arrayBuffer, {
      ignoreErrors: true
    });
    return dcmjs_es/* default.data */.Ay.data.DicomMetaDictionary.naturalizeDataset(dict.dict || {});
  } catch (e) {
    // Some servers send naked datasets without the 128-byte preamble + DICM.
    // Try each common transfer syntax until one parses.
    const syntaxCandidates = ['1.2.840.10008.1.2',
    // Implicit VR Little Endian
    '1.2.840.10008.1.2.1',
    // Explicit VR Little Endian
    '1.2.840.10008.1.2.2' // Explicit VR Big Endian
    ];
    for (const ts of syntaxCandidates) {
      try {
        const stream = new dcmjs_es/* default.data */.Ay.data.ReadBufferStream(arrayBuffer);
        const denat = dcmjs_es/* default.data */.Ay.data.DicomMessage._read(stream, ts, {
          ignoreErrors: true
        });
        if (denat && Object.keys(denat).length > 0) {
          return dcmjs_es/* default.data */.Ay.data.DicomMetaDictionary.naturalizeDataset(denat);
        }
      } catch (_) {
        /* try next */
      }
    }
    throw e;
  }
}
function coerceSequence(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (raw.Value && Array.isArray(raw.Value)) return raw.Value;
  if (raw.Items && Array.isArray(raw.Items)) return raw.Items;
  return [raw];
}
function pickBestWaveformItem(sequence) {
  const candidates = sequence.filter(item => item && item.WaveformSampleInterpretation === 'SS' && item.WaveformBitsAllocated === 16);
  if (candidates.length > 0) {
    return candidates.sort((a, b) => (Number(b.NumberOfWaveformSamples) || 0) - (Number(a.NumberOfWaveformSamples) || 0))[0];
  }
  return sequence.find(item => item);
}
function decodeChannels(rawWaveformData, channels, samples, channelDefs) {
  // rawWaveformData may be Uint8Array, ArrayBuffer, or an array wrapper.
  let bytes;
  let pick = rawWaveformData;
  if (Array.isArray(pick)) pick = pick.find(x => x);
  if (pick instanceof Uint8Array) {
    bytes = pick;
  } else if (pick instanceof ArrayBuffer) {
    bytes = new Uint8Array(pick);
  } else if (pick && pick.buffer instanceof ArrayBuffer) {
    bytes = new Uint8Array(pick.buffer);
  } else {
    throw new Error('Unsupported WaveformData layout');
  }

  // DICOM waveform samples are interleaved channel-major: s0c0, s0c1, ...,
  // s0c(n-1), s1c0, s1c1, ... Split into per-channel arrays.
  const totalShorts = Math.floor(bytes.byteLength / 2);
  if (totalShorts < channels * samples) {
    throw new Error(`WaveformData too short: have ${totalShorts} shorts, need ${channels * samples}`);
  }
  const view = new Int16Array(bytes.buffer, bytes.byteOffset, totalShorts);

  // Per-channel scaling factors + labels.
  const baselines = new Float64Array(channels);
  const factors = new Float64Array(channels);
  const divisors = new Float64Array(channels);
  const labels = new Array(channels);
  for (let c = 0; c < channels; c++) {
    const def = channelDefs[c] || {};
    baselines[c] = Number(def.ChannelBaseline) || 0;
    factors[c] = def.ChannelSensitivity !== undefined && def.ChannelSensitivityCorrectionFactor !== undefined ? Number(def.ChannelSensitivity) * Number(def.ChannelSensitivityCorrectionFactor) : 1;
    divisors[c] = unitDivisorToMillivolts(def);
    labels[c] = extractLeadLabel(def);
  }

  // Allocate per-channel signals.
  const signals = [];
  for (let c = 0; c < channels; c++) {
    signals.push(new Float32Array(samples));
  }
  for (let s = 0; s < samples; s++) {
    const off = s * channels;
    for (let c = 0; c < channels; c++) {
      signals[c][s] = (view[off + c] + baselines[c]) * factors[c] / divisors[c];
    }
  }
  return {
    signals,
    labels
  };
}
function unitDivisorToMillivolts(channelDef) {
  const seq = coerceSequence(channelDef.ChannelSensitivityUnitsSequence);
  if (seq.length === 0) return 1;
  const codeRaw = (seq[0].CodeValue || '').toString().toLowerCase();
  if (codeRaw === 'uv' || codeRaw === 'μv') return 1000;
  if (codeRaw === 'mmhg') return 200; // matches upstream heuristic
  if (codeRaw === 'mv') {
    // Some vendors mis-tag microvolts as 'mV'. Sensitivity ~ a few units
    // strongly suggests microvolts (real mV sensitivities are <<1).
    const sensitivity = Number(channelDef.ChannelSensitivity) || 1;
    return sensitivity > 1 && sensitivity < 10 ? 1000 : 1;
  }
  return 1;
}
function extractLeadLabel(channelDef) {
  const sourceSeq = coerceSequence(channelDef.ChannelSourceSequence);
  for (const src of sourceSeq) {
    let title = (src.CodeMeaning || '').toString().replace(/\u0000/g, '');
    if (!title && src.CodeValue && src.CodingSchemeDesignator) {
      const codeValue = src.CodeValue.toString().replace(/[^0-9\-:\.]/g, '');
      const scheme = src.CodingSchemeDesignator.toString();
      const match = MDC_SCPECG_CODES.find(c => scheme === 'MDC' ? c.mdc === codeValue : scheme === 'SCPECG' ? c.scpEcg === codeValue : false);
      if (match) title = match.label;
    }
    title = title.replace(/[^a-zA-Z0-9_ ]/g, '').replace(/lead/i, '').replace(/\(?einthoven\)?/i, '').trim();
    if (title) return title;
  }
  return '';
}
function lowPassFilter40Hz(signal, sampleRate) {
  const cutoff = 40.0;
  const rc = 1.0 / (cutoff * 2.0 * Math.PI);
  const dt = 1.0 / sampleRate;
  const alpha = dt / (rc + dt);
  let prev = signal[0];
  for (let i = 0; i < signal.length; i++) {
    prev = prev + alpha * (signal[i] - prev);
    signal[i] = prev;
  }
}

// ---------- Patient + waveform info extraction ----------

function extractPatient(elements) {
  return {
    name: stringify(elements.PatientName),
    sex: stringify(elements.PatientSex),
    size: stringify(elements.PatientSize),
    id: stringify(elements.PatientID),
    age: stringify(elements.PatientAge),
    weight: stringify(elements.PatientWeight),
    date: stringify(elements.StudyDate),
    birth: stringify(elements.PatientBirthDate)
  };
}
function stringify(v) {
  if (v === undefined || v === null) return '';
  if (typeof v === 'string') return v.replace(/\u0000/g, '').trim();
  if (typeof v === 'object' && v.Alphabetic) return String(v.Alphabetic);
  return String(v);
}
function extractInfoAndAnnotations(elements, samples, durationSec) {
  const annotationSequence = coerceSequence(elements.WaveformAnnotationSequence);
  if (annotationSequence.length === 0) {
    return {
      info: [],
      annotations: []
    };
  }
  const info = [];
  const annotations = [];
  for (const item of annotationSequence) {
    if (item.UnformattedTextValue !== undefined) {
      annotations.push(stringify(item.UnformattedTextValue));
    }
    const cnSeq = coerceSequence(item.ConceptNameCodeSequence);
    for (const cn of cnSeq) {
      if (cn.CodeMeaning === undefined) continue;
      const cleaned = normalizeCodeMeaning(stringify(cn.CodeMeaning));
      const keyInfo = INFO_KEYS_OF_INTEREST.find(k => k.key === cleaned);
      if (keyInfo && item.NumericValue !== undefined && item.NumericValue !== '') {
        info.push({
          key: cleaned,
          value: item.NumericValue,
          unit: keyInfo.unit
        });
      }
    }
  }

  // Derive VRATE from RR INTERVAL if missing.
  const rr = info.find(i => i.key === 'RR INTERVAL');
  if (rr && !info.find(i => i.key === 'VRATE') && durationSec > 0) {
    info.push({
      key: 'VRATE',
      value: Math.trunc(60.0 / durationSec * samples / Number(rr.value)),
      unit: 'BPM'
    });
  }
  return {
    info,
    annotations
  };
}
function normalizeCodeMeaning(raw) {
  if (!raw) return '';
  let v = raw.toUpperCase().trim().replace(/\s{2,}/g, ' ');
  const direct = {
    'VENTRICULAR HEART RATE': 'VRATE',
    'QTC GLOBAL USING FREDERICIA FORMULA': 'QTC INTERVAL',
    'QTC INTERVAL GLOBAL': 'QTC INTERVAL',
    'QT INTERVAL GLOBAL': 'QT INTERVAL',
    'RR INTERVAL GLOBAL': 'RR INTERVAL',
    'PR INTERVAL GLOBAL': 'PR INTERVAL',
    'P DURATION GLOBAL': 'P DURATION',
    'QRS DURATION GLOBAL': 'QRS DURATION'
  };
  if (direct[v]) return direct[v];
  v = v.replace(/ (INTERVAL )?GLOBAL$/, '');
  return v;
}
;// ../../../../../../../plugins/ohifv3/extensions/dicom-ecg/src/ecg/drawEcg.ts
/**
 * Pure ECG renderer. Takes a parsed waveform plus rendering options and
 * paints a clinical-style ECG into the supplied canvas in a single-column,
 * one-lead-per-row layout. The canvas pixel buffer is sized for the device
 * pixel ratio so the grid is sharp on HiDPI displays.
 *
 * No event listeners, no React, no DOM injection - call `drawEcg` whenever
 * settings change (speed, amplitude, container size, etc.) and let it
 * repaint. Pre-allocations are kept minimal so per-frame redraws stay cheap.
 *
 * Coordinate model:
 *   - X axis: time. `speedMmPerSec` controls how many pixels per second
 *     (`speedMmPerSec * MM_PER_PX`).
 *   - Y axis: voltage. `amplitudeMmPerMv` controls vertical pixels per mV.
 *
 * The drawing window clamps to the first `displayWidthPx` worth of samples;
 * any waveform overflow is intentionally ignored (the panel doesn't need
 * horizontal scrolling - the user can crank up `speedMmPerSec` to fit a
 * longer ECG into the available width).
 */

/**
 * ~96 DPI assumption (matches clinical printers). Exported so the
 * viewport can convert millimetre-denominated UI controls (row offset,
 * etc.) into the same pixel space the renderer uses.
 */
const PIXELS_PER_MM = 3.78;
const MINOR_GRID_MM = 1; // 1 mm small squares
const MAJOR_GRID_MM = 5; // 5 mm bold every-5th squares
const LABEL_PADDING_PX = 6;
/**
 * Width reserved on the left of the chart for the lead label. Exported
 * so the viewport can include the gutter when computing the natural
 * chart width needed to fit the full recording at the current speed.
 */
const LEFT_LABEL_GUTTER_MM = 8;
function drawEcg(canvas, ecg, options) {
  const speedMmPerSec = options.speedMmPerSec ?? 25;
  const amplitudeMmPerMv = options.amplitudeMmPerMv ?? 10;
  const zoom = Math.max(options.zoom ?? 1, 0.01);
  const signalColor = options.signalColor ?? '#1a1a2e';
  const gridColor = options.gridColor ?? '#f08080';
  const backgroundColor = options.backgroundColor ?? '#f9f8f2';
  const labelColor = options.labelColor ?? '#1a1a2e';

  // Zoom scales the physical-mm-to-pixel ratio uniformly, so every
  // millimetre quantity (gutter, grid spacing, sample spacing, gain)
  // becomes bigger or smaller in lockstep. This is what makes the
  // *traces themselves* enlarge, not just the canvas area.
  const pxPerMm = PIXELS_PER_MM * zoom;
  const dpr = window.devicePixelRatio || 1;
  const cssWidth = Math.max(options.cssWidth, 200);
  const cssHeight = Math.max(options.cssHeight, 200);

  // Re-size both the backing pixel buffer (for HiDPI sharpness) and the
  // CSS display size; only re-allocate the buffer when something actually
  // changed so repeated redraws are cheap.
  const targetPixelW = Math.round(cssWidth * dpr);
  const targetPixelH = Math.round(cssHeight * dpr);
  if (canvas.width !== targetPixelW) canvas.width = targetPixelW;
  if (canvas.height !== targetPixelH) canvas.height = targetPixelH;
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, cssWidth, cssHeight);

  // Decide which leads are actually drawn. When the caller doesn't
  // restrict the list, we render every parsed lead.
  const totalLeads = ecg.leads.length;
  const requestedIndices = options.visibleLeadIndices && options.visibleLeadIndices.length > 0 ? options.visibleLeadIndices.filter(idx => idx >= 0 && idx < totalLeads && !!ecg.leads[idx]) : ecg.leads.map((_, idx) => idx);

  // Fallback: if the caller filtered everything out we still want to
  // show *something* rather than a blank chart with just the grid.
  const drawableIndices = requestedIndices.length > 0 ? requestedIndices : ecg.leads.map((_, idx) => idx);

  // Each visible lead gets an equal vertical slice of the canvas. We
  // reserve a small left gutter for the lead label so the trace doesn't
  // run into it.
  const leadCount = drawableIndices.length;
  const rowHeightPx = cssHeight / leadCount;
  const leftGutterPx = LEFT_LABEL_GUTTER_MM * pxPerMm;
  const xPxPerSec = speedMmPerSec * pxPerMm;
  const xPxPerSample = xPxPerSec / ecg.samplingFrequency;
  const yPxPerMv = amplitudeMmPerMv * pxPerMm;
  drawGrid(ctx, cssWidth, cssHeight, leftGutterPx, gridColor, leadCount, rowHeightPx, pxPerMm);

  // Per-lead trace + label. Stroke and font scale with zoom so the
  // entire chart visually grows/shrinks, including labels and line
  // weight. Font is clamped so it stays readable at extreme zoom levels.
  ctx.lineWidth = Math.max(0.5, 1.2 * Math.sqrt(zoom));
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const fontPx = Math.max(9, Math.min(28, 12 * zoom));
  ctx.font = `bold ${fontPx}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
  ctx.textBaseline = 'middle';
  const labelPaddingPx = LABEL_PADDING_PX * Math.max(zoom, 0.75);
  const usableWidthPx = cssWidth - leftGutterPx;
  for (let row = 0; row < leadCount; row++) {
    const lead = ecg.leads[drawableIndices[row]];
    if (!lead) continue;
    const rowTop = row * rowHeightPx;
    const rowMid = rowTop + rowHeightPx / 2;

    // Label.
    ctx.fillStyle = labelColor;
    ctx.fillText(lead.label, labelPaddingPx, rowMid);

    // Trace. Use the requested gain directly so every GAIN +/- click
    // produces a visible change. Tall waveforms are allowed to overflow
    // into neighbouring rows rather than being clipped at the row edge.
    ctx.strokeStyle = signalColor;
    ctx.beginPath();
    const signal = lead.signal;
    const maxSamples = Math.min(signal.length, Math.floor(usableWidthPx / xPxPerSample) + 1);
    if (maxSamples > 1) {
      let x = leftGutterPx;
      let y = rowMid - signal[0] * yPxPerMv;
      ctx.moveTo(x, y);
      for (let s = 1; s < maxSamples; s++) {
        x = leftGutterPx + s * xPxPerSample;
        y = rowMid - signal[s] * yPxPerMv;
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }
}

/**
 * Draws the standard pink ECG grid - 1 mm minor squares, 5 mm major squares
 * - plus a subtle horizontal divider line between each lead row. The
 * `pxPerMm` argument carries the zoom-scaled mm-to-px ratio so the grid
 * grows and shrinks with the rest of the chart.
 */
function drawGrid(ctx, width, height, leftGutterPx, color, leadCount, rowHeightPx, pxPerMm) {
  const minorPx = MINOR_GRID_MM * pxPerMm;
  const majorPx = MAJOR_GRID_MM * pxPerMm;
  ctx.save();
  ctx.strokeStyle = color;

  // Minor vertical lines
  ctx.lineWidth = 0.3;
  ctx.beginPath();
  for (let x = leftGutterPx; x <= width; x += minorPx) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  // Minor horizontal lines
  for (let y = 0; y <= height; y += minorPx) {
    ctx.moveTo(leftGutterPx, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  // Major vertical lines (every 5 mm)
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  for (let x = leftGutterPx; x <= width; x += majorPx) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = 0; y <= height; y += majorPx) {
    ctx.moveTo(leftGutterPx, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  // Row dividers (between leads). Slightly darker so the eye can latch
  // onto each lead's swim lane.
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  for (let i = 1; i < leadCount; i++) {
    const y = Math.round(i * rowHeightPx);
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();
  ctx.restore();
}
;// ../../../../../../../plugins/ohifv3/extensions/dicom-ecg/src/ecg/measurements.ts


/**
 * Tools available inside the ECG viewport. `pointer` is the no-op default
 * that lets the canvas-host scroll freely; the calipers consume mouse events
 * to create measurements stored in DATA space (time/voltage), not pixels,
 * so they survive zoom/speed/amplitude/visible-lead changes.
 *
 * `zoom` and `pan` are click-and-drag tools that mirror Cornerstone3D's
 * standard Zoom / Pan tools so the OHIF top-toolbar Zoom and Pan buttons
 * give the same affordance on ECG viewports as on cornerstone viewports
 * (dragging vertically scales the chart around the cursor; dragging in any
 * direction scrolls the canvas-host).
 */

/**
 * A single ECG measurement, anchored to a specific lead by its ORIGINAL
 * index into `ecg.leads[]`. When the user toggles that lead off the
 * measurement is hidden but kept around so it reappears on toggle-on.
 */

/**
 * The pixel-space layout used by `drawEcg` for the current frame. We mirror
 * the renderer's math here so caliper hit-testing/drawing stays in lock-step
 * with the chart even when the user changes speed, gain, zoom, etc.
 */

/**
 * Compute the chart layout from the same inputs `drawEcg` consumes. Kept as
 * a pure helper so the viewport, caliper hit-testing, and overlay drawing
 * all share one source of truth. `zoom` mirrors the `zoom` option of
 * `drawEcg`: it scales the mm→px ratio uniformly, so every per-mm quantity
 * (gutter, sample spacing, gain) is multiplied by it.
 */
function buildEcgChartLayout(params) {
  const {
    cssWidth,
    cssHeight,
    speedMmPerSec,
    amplitudeMmPerMv,
    zoom,
    drawableIndices
  } = params;
  const leadCount = drawableIndices.length || 1;
  const pxPerMm = PIXELS_PER_MM * Math.max(zoom, 0.01);
  return {
    cssWidth,
    cssHeight,
    leftGutterPx: LEFT_LABEL_GUTTER_MM * pxPerMm,
    xPxPerSec: speedMmPerSec * pxPerMm,
    yPxPerMv: amplitudeMmPerMv * pxPerMm,
    rowHeightPx: cssHeight / leadCount,
    drawableIndices
  };
}

/** Convert a CSS-pixel point on the chart into (time-seconds, mV, leadIdx). */
function pixelToData(pixelX, pixelY, layout) {
  const tSec = Math.max(0, (pixelX - layout.leftGutterPx) / layout.xPxPerSec);
  const rawRow = Math.floor(pixelY / layout.rowHeightPx);
  const row = Math.max(0, Math.min(layout.drawableIndices.length - 1, rawRow));
  const rowMid = row * layout.rowHeightPx + layout.rowHeightPx / 2;
  const mV = (rowMid - pixelY) / layout.yPxPerMv;
  return {
    tSec,
    mV,
    leadIdx: layout.drawableIndices[row],
    row
  };
}

/**
 * Convert a measurement endpoint (in data space) back to pixels. Returns
 * `null` when the lead the measurement is anchored to isn't currently
 * visible - callers should treat this as "skip drawing this measurement".
 */
function dataToPixel(point, leadIdx, layout) {
  const row = layout.drawableIndices.indexOf(leadIdx);
  if (row < 0) return null;
  const rowMid = row * layout.rowHeightPx + layout.rowHeightPx / 2;
  return {
    x: layout.leftGutterPx + point.tSec * layout.xPxPerSec,
    y: rowMid - point.mV * layout.yPxPerMv,
    row
  };
}
const TIME_COLOR = '#0c4a6e'; // deep teal; reads against pink grid + cream bg
const AMP_COLOR = '#7c2d12'; // burnt sienna
const DRAFT_OPACITY = 0.7;

/**
 * Render every measurement (committed + the in-progress draft) onto the
 * supplied overlay canvas. The overlay sits exactly on top of the chart
 * canvas and shares its CSS dimensions / DPR scaling.
 */
function drawMeasurementsOverlay(canvas, layout, measurements, draft) {
  const dpr = window.devicePixelRatio || 1;
  const targetW = Math.round(layout.cssWidth * dpr);
  const targetH = Math.round(layout.cssHeight * dpr);
  if (canvas.width !== targetW) canvas.width = targetW;
  if (canvas.height !== targetH) canvas.height = targetH;
  canvas.style.width = `${layout.cssWidth}px`;
  canvas.style.height = `${layout.cssHeight}px`;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, layout.cssWidth, layout.cssHeight);
  for (const m of measurements) {
    drawSingleMeasurement(ctx, layout, m, /*opacity*/1);
  }
  if (draft) {
    drawSingleMeasurement(ctx, layout, draft, DRAFT_OPACITY);
  }
}
function drawSingleMeasurement(ctx, layout, m, opacity) {
  const a = dataToPixel(m.p1, m.leadIdx, layout);
  const b = dataToPixel(m.p2, m.leadIdx, layout);
  if (!a || !b) return;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.lineWidth = 1.4;
  ctx.font = 'bold 11px "Helvetica Neue", Helvetica, Arial, sans-serif';
  ctx.textBaseline = 'middle';
  const row = a.row;
  const rowTop = row * layout.rowHeightPx;
  const rowBottom = rowTop + layout.rowHeightPx;
  const rowMid = rowTop + layout.rowHeightPx / 2;
  if (m.type === 'time') {
    ctx.strokeStyle = TIME_COLOR;
    ctx.fillStyle = TIME_COLOR;

    // Vertical pins span the row so the user can see the slice clearly.
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(a.x, rowTop + 2);
    ctx.lineTo(a.x, rowBottom - 2);
    ctx.moveTo(b.x, rowTop + 2);
    ctx.lineTo(b.x, rowBottom - 2);
    ctx.stroke();

    // Solid horizontal connector at row centre with terminal caps.
    ctx.setLineDash([]);
    const yLine = rowMid;
    ctx.beginPath();
    ctx.moveTo(a.x, yLine);
    ctx.lineTo(b.x, yLine);
    ctx.stroke();
    drawCap(ctx, a.x, yLine, /*horizontal*/false);
    drawCap(ctx, b.x, yLine, /*horizontal*/false);

    // Δt label.
    const dtSec = Math.abs(m.p2.tSec - m.p1.tSec);
    const dtMs = dtSec * 1000;
    const bpm = dtSec > 0 ? 60 / dtSec : 0;
    const label = dtMs >= 1 ? `Δt ${dtMs.toFixed(0)} ms${bpm >= 20 && bpm <= 400 ? `  ${bpm.toFixed(0)} bpm` : ''}` : 'Δt —';
    drawLabel(ctx, label, (a.x + b.x) / 2, rowTop + 12, TIME_COLOR);
  } else {
    ctx.strokeStyle = AMP_COLOR;
    ctx.fillStyle = AMP_COLOR;

    // Horizontal pins at each amplitude.
    ctx.setLineDash([5, 4]);
    const xLeft = Math.min(a.x, b.x) - 8;
    const xRight = Math.max(a.x, b.x) + 8;
    const xMid = (a.x + b.x) / 2;
    ctx.beginPath();
    ctx.moveTo(xLeft, a.y);
    ctx.lineTo(xRight, a.y);
    ctx.moveTo(xLeft, b.y);
    ctx.lineTo(xRight, b.y);
    ctx.stroke();

    // Solid vertical connector with end caps.
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(xMid, a.y);
    ctx.lineTo(xMid, b.y);
    ctx.stroke();
    drawCap(ctx, xMid, a.y, /*horizontal*/true);
    drawCap(ctx, xMid, b.y, /*horizontal*/true);

    // ΔmV label.
    const dmV = Math.abs(m.p2.mV - m.p1.mV);
    const label = `Δ ${dmV.toFixed(2)} mV`;
    drawLabel(ctx, label, xMid + 6, (a.y + b.y) / 2, AMP_COLOR);
  }
  ctx.restore();
}
function drawCap(ctx, x, y, horizontal) {
  const half = 5;
  ctx.save();
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  if (horizontal) {
    ctx.moveTo(x - half, y);
    ctx.lineTo(x + half, y);
  } else {
    ctx.moveTo(x, y - half);
    ctx.lineTo(x, y + half);
  }
  ctx.stroke();
  ctx.restore();
}
function drawLabel(ctx, text, x, y, color) {
  const padding = 4;
  const metrics = ctx.measureText(text);
  const w = metrics.width + padding * 2;
  const h = 16;
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  const rectX = Math.round(x - w / 2);
  const rectY = Math.round(y - h / 2);
  roundRect(ctx, rectX, rectY, w, h, 3);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y + 0.5);
  ctx.restore();
}
function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
}

/** Generate a stable-ish id for a new measurement. */
function newMeasurementId() {
  return `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
;// ../../../../../../../plugins/ohifv3/extensions/dicom-ecg/src/ecg/exportEcg.ts
/**
 * Produce a flat PNG/JPEG snapshot that combines the chart canvas with the
 * measurement overlay (overlay drawn on top). Returns a data URL ready to
 * download or embed in a print window.
 */
function composeEcgImage(chartCanvas, overlayCanvas, format, background = '#f9f8f2') {
  const w = chartCanvas.width;
  const h = chartCanvas.height;
  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const ctx = out.getContext('2d');
  if (!ctx) {
    return chartCanvas.toDataURL(format === 'png' ? 'image/png' : 'image/jpeg', 0.95);
  }
  // JPEG has no alpha channel - paint a chart-coloured background first so
  // the export matches what's on screen instead of going pure black.
  if (format === 'jpeg') {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.drawImage(chartCanvas, 0, 0);
  if (overlayCanvas) ctx.drawImage(overlayCanvas, 0, 0);
  return format === 'png' ? out.toDataURL('image/png') : out.toDataURL('image/jpeg', 0.95);
}

/** Trigger a browser download of `dataUrl` under `filename`. */
function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
  }, 0);
}

/**
 * Build a sensible filename stem from the patient id / name + date so the
 * three exports (PNG/JPEG/PDF) all line up. Falls back to `ecg-<timestamp>`
 * when the metadata is missing.
 */
function buildEcgFilenameStem(ecg) {
  const pid = ecg?.patient?.id?.trim();
  const pname = ecg?.patient?.name?.trim();
  const date = ecg?.patient?.date?.trim();
  const parts = [];
  if (pid) parts.push(pid);else if (pname) parts.push(pname);
  if (date) parts.push(date);
  if (parts.length === 0) parts.push(`ecg-${new Date().toISOString().slice(0, 19)}`);
  const safe = parts.join('_').replace(/[^A-Za-z0-9_\-.]/g, '_');
  return safe || 'ecg';
}

/**
 * Open a print-ready window containing the ECG image plus a metadata header
 * and trigger the browser's print dialog. The user can then pick "Save as
 * PDF" as the destination - this avoids pulling jsPDF (and its 200kB+
 * footprint) into the bundle while still giving every browser a clean
 * route to a vector-quality PDF leave-behind.
 */
function openPrintableEcgWindow(imageDataUrl, ecg, options) {
  const win = window.open('', '_blank', 'width=1100,height=850');
  if (!win) {
    // eslint-disable-next-line no-alert
    alert('The browser blocked the PDF export pop-up. Please allow pop-ups for this site and try again.');
    return;
  }
  const patientRows = ecg ? [['Name', ecg.patient.name], ['Patient ID', ecg.patient.id], ['Sex', ecg.patient.sex], ['Age', ecg.patient.age], ['Birth', ecg.patient.birth], ['Date', ecg.patient.date], ['Weight', ecg.patient.weight], ['Size', ecg.patient.size]].filter(([, v]) => v && v.length > 0) : [];
  const waveformRows = ecg ? [...ecg.info, {
    key: 'Sampling',
    value: `${ecg.samplingFrequency}`,
    unit: 'Hz'
  }, {
    key: 'Duration',
    value: ecg.durationSec.toFixed(1),
    unit: 'sec'
  }, {
    key: 'Speed',
    value: `${options.speedMmPerSec}`,
    unit: 'mm/s'
  }, {
    key: 'Gain',
    value: `${options.amplitudeMmPerMv}`,
    unit: 'mm/mV'
  }] : [];
  const annotationsLine = ecg && ecg.annotations.length > 0 ? `<div class="annotation"><strong>Annotation:</strong> ${escapeHtml(ecg.annotations.join(' · '))}</div>` : '';
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>ECG Report${ecg?.patient?.name ? ' – ' + escapeHtml(ecg.patient.name) : ''}</title>
<style>
  @page { size: A4 landscape; margin: 12mm; }
  html, body { background: #fff; color: #1a1a2e; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
  body { margin: 0; padding: 16px; font-size: 11px; }
  h1 { font-size: 14px; margin: 0 0 8px 0; }
  table.meta { border-collapse: collapse; width: 100%; margin-bottom: 8px; }
  table.meta td { padding: 2px 8px 2px 0; vertical-align: top; }
  table.meta td.k { font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; white-space: nowrap; }
  .row { display: flex; flex-wrap: wrap; gap: 4px 24px; margin-bottom: 6px; }
  .cell { white-space: nowrap; }
  .cell .k { font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; }
  .annotation { margin: 4px 0 8px 0; font-style: italic; }
  .chart { width: 100%; }
  .chart img { width: 100%; height: auto; display: block; border: 1px solid rgba(0,0,0,0.2); }
  footer { margin-top: 8px; font-size: 9px; color: #555; display: flex; justify-content: space-between; }
  @media print { .no-print { display: none !important; } }
  .toolbar { position: sticky; top: 0; background: #fff; padding: 8px 0 12px; border-bottom: 1px solid #ddd; margin-bottom: 12px; }
  .toolbar button { font: inherit; padding: 6px 12px; margin-right: 8px; cursor: pointer; }
</style>
</head>
<body>
  <div class="toolbar no-print">
    <button onclick="window.print()">Print / Save as PDF</button>
    <button onclick="window.close()">Close</button>
    <span style="font-size:11px;color:#555">Tip: choose <em>Save as PDF</em> as the destination in the print dialog.</span>
  </div>
  <h1>ECG Report</h1>
  ${patientRows.length > 0 ? `<div class="row">${patientRows.map(([k, v]) => `<div class="cell"><span class="k">${escapeHtml(k)}:</span> ${escapeHtml(v)}</div>`).join('')}</div>` : ''}
  ${waveformRows.length > 0 ? `<div class="row">${waveformRows.map(it => `<div class="cell"><span class="k">${escapeHtml(it.key)}:</span> ${escapeHtml(String(it.value))} ${escapeHtml(it.unit || '')}</div>`).join('')}</div>` : ''}
  ${annotationsLine}
  <div class="chart"><img src="${imageDataUrl}" alt="ECG"/></div>
  <footer>
    <span>Generated by MONAI Label OHIF · @ohif/extension-dicom-ecg</span>
    <span>${new Date().toLocaleString()}</span>
  </footer>
  <script>
    // Auto-open the print dialog once the image has loaded so the user
    // doesn't have to click twice for the common "save as PDF" flow.
    var img = document.querySelector('.chart img');
    if (img && !img.complete) {
      img.addEventListener('load', function () { setTimeout(function () { window.print(); }, 100); });
    } else {
      setTimeout(function () { window.print(); }, 200);
    }
  </script>
</body>
</html>`;
  win.document.open();
  win.document.write(html);
  win.document.close();
}
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
// EXTERNAL MODULE: ../../../../../../../plugins/ohifv3/extensions/dicom-ecg/src/ecgViewportRegistry.ts
var ecgViewportRegistry = __webpack_require__(22826);
;// ../../../../../../../plugins/ohifv3/extensions/dicom-ecg/src/viewports/OHIFDicomECGViewport.css
// extracted by mini-css-extract-plugin

;// ../../../../../../../plugins/ohifv3/extensions/dicom-ecg/src/viewports/OHIFDicomECGViewport.tsx









const DEFAULT_SPEED_MM_PER_SEC = 25;
const DEFAULT_AMPLITUDE_MM_PER_MV = 10;
const DEFAULT_ZOOM = 1;
// 10 mm of extra vertical space between leads matches the standard
// clinical 12-lead print layout (one big-grid square between rows) and
// gives every lead enough headroom that adjacent QRS complexes don't
// overlap on default speed/gain.
const DEFAULT_ROW_OFFSET_MM = 10;
const MIN_SPEED = 5;
const MAX_SPEED = 100;
const SPEED_STEP = 5;
const MIN_AMPLITUDE = 2.5;
const MAX_AMPLITUDE = 40;
const AMPLITUDE_STEP = 2.5;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.25;
const MIN_ROW_OFFSET_MM = -5;
const MAX_ROW_OFFSET_MM = 25;
const ROW_OFFSET_STEP_MM = 2.5;

/**
 * OHIF v3 viewport that displays a DICOM ECG waveform instance using a
 * vendored, single-column 12-lead renderer (`drawEcg`) backed by an
 * in-house DICOM waveform parser (`parseEcgWaveform`).
 *
 * This component is intentionally free of the upstream `ecg-dicom-web-viewer`
 * dependency - it owns the entire visual stack (info bar, canvas, controls)
 * as plain React, so there's no need for `window.innerWidth/innerHeight`
 * monkey-patching, no `innerHTML` injection, no event-listener hijacking,
 * and no fragile patches against minified vendor code. Resizing, speed,
 * and amplitude changes trigger a fresh `drawEcg` call into the same canvas
 * - cached `ParsedEcg` keeps redraws cheap.
 */
function OHIFDicomECGViewport(props) {
  const {
    displaySets,
    servicesManager,
    extensionManager,
    viewportId
  } = props;
  if (!displaySets || displaySets.length === 0) {
    return null;
  }
  if (displaySets.length > 1) {
    throw new Error('OHIFDicomECGViewport: only one display set is supported for DICOM ECG at a time');
  }
  const displaySet = displaySets[0];
  const canvasRef = (0,react.useRef)(null);
  const overlayCanvasRef = (0,react.useRef)(null);
  const canvasHostRef = (0,react.useRef)(null);
  const ecgRef = (0,react.useRef)(null);
  // Layout from the latest paint, used by the overlay + caliper hit-testing
  // so they stay in lock-step with whatever the chart was last drawn at.
  const layoutRef = (0,react.useRef)(null);
  const [loading, setLoading] = (0,react.useState)(true);
  const [error, setError] = (0,react.useState)(null);
  const [ecg, setEcg] = (0,react.useState)(null);
  const [speedMmPerSec, setSpeedMmPerSec] = (0,react.useState)(DEFAULT_SPEED_MM_PER_SEC);
  const [amplitudeMmPerMv, setAmplitudeMmPerMv] = (0,react.useState)(DEFAULT_AMPLITUDE_MM_PER_MV);
  // Indices (into `ecg.leads`) of the leads the user wants to see. `null`
  // means "show everything" - this lets us defer the decision until the
  // ECG has actually loaded and we know how many leads there are.
  const [visibleLeads, setVisibleLeads] = (0,react.useState)(null);
  // Multiplier applied to both axes when rendering. Values >1 enlarge the
  // chart and the canvas host scrolls; <1 shrinks it inside the host.
  const [zoom, setZoom] = (0,react.useState)(DEFAULT_ZOOM);
  // Extra vertical space, in millimetres, added to every lead row.
  // Positive values pull the leads apart (host scrolls vertically once
  // the chart no longer fits); small negative values pack them closer.
  const [rowOffsetMm, setRowOffsetMm] = (0,react.useState)(DEFAULT_ROW_OFFSET_MM);
  // Active in-viewport tool. `pointer` lets the canvas-host scroll freely;
  // the calipers consume mouse events to create a measurement.
  const [tool, setTool] = (0,react.useState)('pointer');
  const [measurements, setMeasurements] = (0,react.useState)([]);
  const [draftMeasurement, setDraftMeasurement] = (0,react.useState)(null);
  // Stack of measurements that were just undone, so the OHIF Redo button
  // can put them back. Cleared whenever a fresh measurement is committed -
  // mirrors the standard undo/redo model where any new edit invalidates
  // the redo history.
  const [redoStack, setRedoStack] = (0,react.useState)([]);

  // Snapshot of state read by the registry-exposed API. Toolbar commands
  // run outside the React tree, so they can't subscribe to state - they
  // see whatever is in this ref at call time.
  const stateRef = (0,react.useRef)({
    tool,
    measurements,
    redoStack,
    speedMmPerSec,
    amplitudeMmPerMv
  });
  stateRef.current.tool = tool;
  stateRef.current.measurements = measurements;
  stateRef.current.redoStack = redoStack;
  stateRef.current.speedMmPerSec = speedMmPerSec;
  stateRef.current.amplitudeMmPerMv = amplitudeMmPerMv;

  // Fetch + parse on display-set change.
  (0,react.useEffect)(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setEcg(null);
    setVisibleLeads(null);
    setMeasurements([]);
    setDraftMeasurement(null);
    setRedoStack([]);
    ecgRef.current = null;
    layoutRef.current = null;
    (async () => {
      try {
        const bytes = await loadEcgBytes(displaySet, extensionManager, servicesManager);
        if (cancelled) return;
        if (!bytes || bytes.length === 0) {
          throw new Error('Empty DICOM byte stream');
        }
        // Slice into a tight ArrayBuffer in case `bytes` is a view into a
        // larger buffer (multipart parsers do this); dcmjs reads from
        // offset 0 of whatever buffer it's given.
        const ab = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
        const parsed = parseEcgWaveform(ab, {
          applyLowPassFilter: true
        });
        if (cancelled) return;
        ecgRef.current = parsed;
        setEcg(parsed);
        setVisibleLeads(new Set(parsed.leads.map((_, idx) => idx)));
        setLoading(false);
      } catch (e) {
        if (!cancelled) {
          // eslint-disable-next-line no-console
          console.error('dicom-ecg: failed to load/parse ECG', e);
          setError(e?.message || String(e));
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displaySet.displaySetInstanceUID]);

  // Repaint whenever the waveform or render settings change. useLayoutEffect
  // so the paint happens before the browser shows the next frame.
  const repaint = (0,react.useCallback)(() => {
    const canvas = canvasRef.current;
    const host = canvasHostRef.current;
    const current = ecgRef.current;
    if (!canvas || !host || !current) return;
    const hostWidth = host.clientWidth;
    const hostHeight = host.clientHeight;
    if (hostWidth < 50 || hostHeight < 50) return;
    const visibleLeadIndices = visibleLeads ? current.leads.map((_, idx) => idx).filter(idx => visibleLeads.has(idx)) : undefined;
    const visibleLeadCount = (visibleLeadIndices ? visibleLeadIndices.length : current.leads.length) || 1;

    // Zoom is now applied *inside* drawEcg (it scales the px-per-mm
    // ratio so the grid, traces, gutter and labels all grow together),
    // so every mm-denominated size we compute here must also be in the
    // zoomed pixel space - otherwise the canvas would be smaller than
    // the chart and the right/bottom edges would clip.
    const pxPerMm = PIXELS_PER_MM * zoom;

    // Width: grow the canvas so the FULL recording fits at the current
    // speed *and* the current zoom. drawEcg truncates the trace at
    // `cssWidth`, so when speed/zoom push the chart past the host we
    // need the canvas to be wider than the host so `overflow: auto`
    // produces a horizontal scrollbar. We still respect host width as a
    // lower bound so the canvas never has empty space at the right when
    // the recording is short.
    const gutterPx = LEFT_LABEL_GUTTER_MM * pxPerMm;
    const naturalChartWidthPx = gutterPx + current.durationSec * speedMmPerSec * pxPerMm;
    const cssWidth = Math.round(Math.max(hostWidth, naturalChartWidthPx));

    // Height: each visible lead occupies one row of an evenly-divided
    // cssHeight. We pick cssHeight so that at zoom=1 each row matches
    // its share of the host; zoom enlarges each row proportionally, and
    // the per-row offset adds an extra `rowOffsetMm * pxPerMm` of space
    // on top. A 5mm floor stops rows from collapsing when the user
    // pushes offset negative at low zoom.
    const baseHeight = hostHeight * zoom;
    const offsetPxPerRow = rowOffsetMm * pxPerMm;
    const minRowHeightPx = Math.max(20, pxPerMm * 5);
    const minTotalHeight = minRowHeightPx * visibleLeadCount;
    const cssHeight = Math.round(Math.max(baseHeight + offsetPxPerRow * visibleLeadCount, minTotalHeight));
    drawEcg(canvas, current, {
      cssWidth,
      cssHeight,
      speedMmPerSec,
      amplitudeMmPerMv,
      zoom,
      visibleLeadIndices
    });

    // Mirror the renderer's pixel-space layout so the overlay + caliper
    // hit-testing stay in lock-step with the chart at all zoom/speed/gain
    // combinations.
    const drawableIndices = visibleLeadIndices && visibleLeadIndices.length > 0 ? visibleLeadIndices : current.leads.map((_, idx) => idx);
    const layout = buildEcgChartLayout({
      cssWidth,
      cssHeight,
      speedMmPerSec,
      amplitudeMmPerMv,
      zoom,
      drawableIndices
    });
    layoutRef.current = layout;
    const overlay = overlayCanvasRef.current;
    if (overlay) {
      drawMeasurementsOverlay(overlay, layout, measurements, draftMeasurement);
    }
  }, [speedMmPerSec, amplitudeMmPerMv, visibleLeads, zoom, rowOffsetMm, measurements, draftMeasurement]);
  (0,react.useLayoutEffect)(() => {
    repaint();
  }, [ecg, repaint]);

  // Repaint on container resize. ResizeObserver is debounced via rAF to
  // coalesce burst resizes (e.g. dragging the panel).
  (0,react.useEffect)(() => {
    const host = canvasHostRef.current;
    if (!host || typeof ResizeObserver === 'undefined') return undefined;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        repaint();
      });
    });
    observer.observe(host);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [repaint]);
  const onResetView = (0,react.useCallback)(() => {
    setSpeedMmPerSec(DEFAULT_SPEED_MM_PER_SEC);
    setAmplitudeMmPerMv(DEFAULT_AMPLITUDE_MM_PER_MV);
    setZoom(DEFAULT_ZOOM);
    setRowOffsetMm(DEFAULT_ROW_OFFSET_MM);
    setTool('pointer');
    setMeasurements([]);
    setDraftMeasurement(null);
    setRedoStack([]);
    const host = canvasHostRef.current;
    if (host) {
      host.scrollLeft = 0;
      host.scrollTop = 0;
    }
    const current = ecgRef.current;
    if (current) {
      setVisibleLeads(new Set(current.leads.map((_, idx) => idx)));
    }
  }, []);
  const adjustSpeed = (0,react.useCallback)(delta => {
    setSpeedMmPerSec(prev => clamp(round(prev + delta), MIN_SPEED, MAX_SPEED));
  }, []);
  const adjustAmplitude = (0,react.useCallback)(delta => {
    setAmplitudeMmPerMv(prev => clamp(round(prev + delta), MIN_AMPLITUDE, MAX_AMPLITUDE));
  }, []);
  const adjustRowOffset = (0,react.useCallback)(delta => {
    setRowOffsetMm(prev => clamp(round(prev + delta), MIN_ROW_OFFSET_MM, MAX_ROW_OFFSET_MM));
  }, []);

  // Pending scroll position to apply after the next zoom-driven repaint.
  // Used by both the buttons (centered on host) and the wheel handler
  // (centered on the cursor) so the point of interest stays put.
  const pendingScrollRef = (0,react.useRef)(null);

  // After every zoom-driven repaint, restore the desired scroll position
  // so the focal point under the cursor (or the centre of the host for
  // button zoom) doesn't drift.
  (0,react.useLayoutEffect)(() => {
    const host = canvasHostRef.current;
    const target = pendingScrollRef.current;
    if (!host || !target) return;
    host.scrollLeft = target.left;
    host.scrollTop = target.top;
    pendingScrollRef.current = null;
  }, [zoom]);

  // Internal helper shared by the wheel handler and the drag-zoom tool.
  // `compute` receives the previous zoom and must return the desired next
  // zoom; we clamp + round, adjust scroll so the focal point under the
  // cursor stays put, and commit via setZoom. Pulling the math out of
  // `zoomAround` lets the drag tool jump straight to an absolute target
  // value (computed from the initial zoom at pointerdown + the cumulative
  // drag delta) without accumulating per-frame rounding error.
  const zoomFocused = (0,react.useCallback)((compute, focusClientX, focusClientY) => {
    const host = canvasHostRef.current;
    if (!host) {
      setZoom(prev => clamp(round(compute(prev)), MIN_ZOOM, MAX_ZOOM));
      return;
    }
    const rect = host.getBoundingClientRect();
    const focusX = focusClientX !== undefined ? focusClientX - rect.left : rect.width / 2;
    const focusY = focusClientY !== undefined ? focusClientY - rect.top : rect.height / 2;
    setZoom(prev => {
      const next = clamp(round(compute(prev)), MIN_ZOOM, MAX_ZOOM);
      if (next === prev) return prev;
      const ratio = next / prev;
      const newScrollLeft = (host.scrollLeft + focusX) * ratio - focusX;
      const newScrollTop = (host.scrollTop + focusY) * ratio - focusY;
      pendingScrollRef.current = {
        left: Math.max(0, newScrollLeft),
        top: Math.max(0, newScrollTop)
      };
      return next;
    });
  }, []);
  const zoomAround = (0,react.useCallback)((delta, focusClientX, focusClientY) => {
    zoomFocused(prev => prev + delta, focusClientX, focusClientY);
  }, [zoomFocused]);

  // Ctrl/Cmd + wheel zooms; plain wheel scrolls the canvas-host normally.
  (0,react.useEffect)(() => {
    const host = canvasHostRef.current;
    if (!host) return undefined;
    const onWheel = e => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
      zoomAround(delta, e.clientX, e.clientY);
    };
    host.addEventListener('wheel', onWheel, {
      passive: false
    });
    return () => host.removeEventListener('wheel', onWheel);
  }, [zoomAround]);
  const toggleLead = (0,react.useCallback)(idx => {
    setVisibleLeads(prev => {
      const current = ecgRef.current;
      if (!current) return prev;
      const base = prev ?? new Set(current.leads.map((_, i) => i));
      const next = new Set(base);
      if (next.has(idx)) {
        // Don't let the user hide the last visible lead - the chart would
        // collapse to a blank grid and there'd be no way to recover
        // without using "All".
        if (next.size <= 1) return base;
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  }, []);
  const setAllLeadsVisible = (0,react.useCallback)(visible => {
    const current = ecgRef.current;
    if (!current) return;
    if (visible) {
      setVisibleLeads(new Set(current.leads.map((_, idx) => idx)));
    } else if (current.leads.length > 0) {
      // Same guard as `toggleLead`: keep at least one lead visible.
      setVisibleLeads(new Set([0]));
    }
  }, []);

  // ---------- Tool interactions: calipers, pan, zoom ----------
  // The interaction uses pointer events on the canvas itself (not the
  // host) so we can call setPointerCapture and keep tracking even if the
  // pointer leaves the viewport. Coordinates are converted to data space
  // immediately so measurements survive zoom/speed/gain changes.
  const computeLocalPoint = (0,react.useCallback)((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    // Map from CSS pixels (which may differ from canvas.width when DPR
    // scaling is active) to the chart's CSS coordinate space, which is
    // what `layoutRef` is measured in.
    const px = (clientX - rect.left) / rect.width * (canvas.style.width ? parseFloat(canvas.style.width) : rect.width);
    const py = (clientY - rect.top) / rect.height * (canvas.style.height ? parseFloat(canvas.style.height) : rect.height);
    return {
      px,
      py
    };
  }, []);

  // Pan-tool drag state. Captured at pointerdown so the move handler can
  // compute the absolute scroll position from the initial scroll + the
  // cumulative pointer delta - this is more stable than incrementally
  // mutating scrollLeft/scrollTop on each frame.
  const panDragRef = (0,react.useRef)(null);
  // Zoom-tool drag state. We anchor zoom to the click point (`focusClientX/Y`)
  // and scale exponentially with vertical drag so the cursor lands on the
  // same data point at every zoom level. Captured at pointerdown so the
  // move handler can compute zoom = startZoom * exp(-dy * k) independent
  // of previous frames.
  const zoomDragRef = (0,react.useRef)(null);
  const onCanvasPointerDown = (0,react.useCallback)(e => {
    if (tool === 'pointer') return;

    // Pan: lock onto initial scroll + cursor; move handler subtracts
    // the cumulative drag delta to move the canvas with the cursor.
    if (tool === 'pan') {
      const host = canvasHostRef.current;
      if (!host) return;
      panDragRef.current = {
        startClientX: e.clientX,
        startClientY: e.clientY,
        startScrollLeft: host.scrollLeft,
        startScrollTop: host.scrollTop
      };
      try {
        e.target.setPointerCapture(e.pointerId);
      } catch {
        // ignore - non-fatal
      }
      e.preventDefault();
      return;
    }

    // Zoom: snapshot the click point + current zoom; move handler
    // scales exponentially so the data point under the cursor at
    // pointerdown stays under the cursor through the entire drag.
    if (tool === 'zoom') {
      zoomDragRef.current = {
        startClientX: e.clientX,
        startClientY: e.clientY,
        startZoom: zoom
      };
      try {
        e.target.setPointerCapture(e.pointerId);
      } catch {
        // ignore - non-fatal
      }
      e.preventDefault();
      return;
    }

    // Calipers: convert the click into data space and seed a draft
    // measurement that the move handler will extend.
    const layout = layoutRef.current;
    if (!layout) return;
    const local = computeLocalPoint(e.clientX, e.clientY);
    if (!local) return;
    // Reject clicks in the left label gutter - those are not part of
    // the chart so calipers there would be meaningless.
    if (local.px < layout.leftGutterPx) return;
    const start = pixelToData(local.px, local.py, layout);
    const draft = {
      id: newMeasurementId(),
      type: tool === 'time-caliper' ? 'time' : 'amplitude',
      leadIdx: start.leadIdx,
      p1: {
        tSec: start.tSec,
        mV: start.mV
      },
      p2: {
        tSec: start.tSec,
        mV: start.mV
      }
    };
    setDraftMeasurement(draft);
    try {
      e.target.setPointerCapture(e.pointerId);
    } catch {
      // Some browsers throw if the element is detached; non-fatal.
    }
    e.preventDefault();
  }, [tool, zoom, computeLocalPoint]);
  const onCanvasPointerMove = (0,react.useCallback)(e => {
    // Pan: write the new scroll position directly. We avoid React state
    // because scroll is a DOM property and rerendering on each frame
    // would be wasteful (the chart itself doesn't change).
    if (panDragRef.current) {
      const host = canvasHostRef.current;
      if (!host) return;
      const dx = e.clientX - panDragRef.current.startClientX;
      const dy = e.clientY - panDragRef.current.startClientY;
      host.scrollLeft = panDragRef.current.startScrollLeft - dx;
      host.scrollTop = panDragRef.current.startScrollTop - dy;
      return;
    }

    // Zoom: compute the absolute target zoom from the initial zoom and
    // the cumulative drag delta. Vertical drag up (dy < 0) zooms in;
    // the exponential factor gives a feel that's roughly linear in
    // perceived "scale per pixel" across the whole zoom range.
    if (zoomDragRef.current) {
      const {
        startClientX,
        startClientY,
        startZoom
      } = zoomDragRef.current;
      const dy = e.clientY - startClientY;
      // 0.005 / pixel ≈ 1.65× per 100px of drag. Feels close to
      // cornerstone's Zoom tool sensitivity without being twitchy.
      const factor = Math.exp(-dy * 0.005);
      zoomFocused(() => startZoom * factor, startClientX, startClientY);
      return;
    }

    // Calipers: extend the in-flight draft.
    if (!draftMeasurement) return;
    const layout = layoutRef.current;
    if (!layout) return;
    const local = computeLocalPoint(e.clientX, e.clientY);
    if (!local) return;
    // Keep the second point anchored to the same lead as the first so
    // the caliper stays inside one swim-lane while the user drags.
    const moved = pixelToData(local.px, local.py, layout);
    setDraftMeasurement({
      ...draftMeasurement,
      p2: {
        tSec: draftMeasurement.type === 'amplitude' ? draftMeasurement.p1.tSec : moved.tSec,
        mV: draftMeasurement.type === 'time' ? draftMeasurement.p1.mV : moved.mV
      }
    });
  }, [draftMeasurement, computeLocalPoint, zoomFocused]);
  const onCanvasPointerUp = (0,react.useCallback)(e => {
    // Pan/Zoom: release the pointer capture and clear the drag state.
    if (panDragRef.current || zoomDragRef.current) {
      try {
        e.target.releasePointerCapture(e.pointerId);
      } catch {
        // ignore - capture may already be released
      }
      panDragRef.current = null;
      zoomDragRef.current = null;
      return;
    }
    if (!draftMeasurement) return;
    try {
      e.target.releasePointerCapture(e.pointerId);
    } catch {
      // ignore - capture may already be released
    }
    // Reject zero-length drags (a plain click) so the user doesn't end
    // up with invisible 0 ms / 0 mV measurements cluttering the chart.
    const dt = Math.abs(draftMeasurement.p2.tSec - draftMeasurement.p1.tSec);
    const dv = Math.abs(draftMeasurement.p2.mV - draftMeasurement.p1.mV);
    const isReal = draftMeasurement.type === 'time' && dt > 0.005 || draftMeasurement.type === 'amplitude' && dv > 0.01;
    if (isReal) {
      setMeasurements(prev => [...prev, draftMeasurement]);
      // A fresh measurement invalidates anything previously undone -
      // OHIF's standard undo/redo model assumes a linear history.
      setRedoStack([]);
    }
    setDraftMeasurement(null);
  }, [draftMeasurement]);

  // ---------- Export ----------
  // These read latest speed/gain via stateRef so they stay stable across
  // renders - critical because they're registered with the toolbar
  // registry once on mount.
  const exportImage = (0,react.useCallback)(format => {
    const chart = canvasRef.current;
    if (!chart) return;
    const overlay = overlayCanvasRef.current;
    const dataUrl = composeEcgImage(chart, overlay, format);
    const stem = buildEcgFilenameStem(ecgRef.current);
    const ext = format === 'png' ? 'png' : 'jpg';
    downloadDataUrl(dataUrl, `${stem}.${ext}`);
  }, []);
  const exportPdf = (0,react.useCallback)(() => {
    const chart = canvasRef.current;
    if (!chart) return;
    const overlay = overlayCanvasRef.current;
    // PNG inside the print HTML keeps line art crisp at any DPI; JPEG
    // would soften the grid and trace.
    const dataUrl = composeEcgImage(chart, overlay, 'png');
    openPrintableEcgWindow(dataUrl, ecgRef.current, {
      speedMmPerSec: stateRef.current.speedMmPerSec,
      amplitudeMmPerMv: stateRef.current.amplitudeMmPerMv
    });
  }, []);

  // ---------- Toolbar registry ----------
  // Publish a stable API once on mount so OHIF top-toolbar buttons can
  // dispatch into this viewport instance from outside the React tree.
  // Each method reads latest state via refs / stable setters, so the API
  // never goes stale even though we don't re-register on state change.
  (0,react.useEffect)(() => {
    if (!viewportId) return undefined;
    const api = {
      getTool: () => stateRef.current.tool,
      setTool: t => {
        // Mirror the new tool into the registry-visible ref BEFORE
        // queuing the React state update. OHIF's `recordInteraction`
        // calls `refreshToolbarState` synchronously after our
        // `setEcgTool` command returns, and the `evaluate.ecgTool`
        // evaluator reads the active tool from `stateRef.current.tool`.
        // If we only called React's `setTool`, the ref would still
        // hold the previous value at evaluation time and the button's
        // active highlight would lag by a click. Updating the ref
        // first keeps the toolbar in sync on the very first click.
        stateRef.current.tool = t;
        setTool(t);
      },
      // Reset wipes ECG-side state to match what the in-viewport Reset
      // button does (speed, gain, zoom, lead visibility, tool, every
      // measurement, scroll position) - i.e. the OHIF top-toolbar Reset
      // button means "Reset ECG view" when an ECG viewport is active,
      // and "Reset cornerstone viewport" otherwise.
      resetView: onResetView,
      undoMeasurement: () => {
        // Pop the most recent measurement and stash it on the redo stack
        // so the OHIF Redo button can put it back. Match cornerstone's
        // history-memo semantics where redo is invalidated by any new
        // edit (handled in the pointer-up handler).
        setMeasurements(prev => {
          if (prev.length === 0) return prev;
          const last = prev[prev.length - 1];
          setRedoStack(stack => [...stack, last]);
          return prev.slice(0, -1);
        });
      },
      redoMeasurement: () => {
        setRedoStack(stack => {
          if (stack.length === 0) return stack;
          const top = stack[stack.length - 1];
          setMeasurements(prev => [...prev, top]);
          return stack.slice(0, -1);
        });
      },
      measurementCount: () => stateRef.current.measurements.length,
      redoCount: () => stateRef.current.redoStack.length,
      exportImage,
      exportPdf
    };
    (0,ecgViewportRegistry/* registerEcgViewport */.xP)(viewportId, api);
    return () => (0,ecgViewportRegistry/* unregisterEcgViewport */.G7)(viewportId);
  }, [viewportId, exportImage, exportPdf, onResetView]);

  // Belt-and-braces: ask OHIF to re-evaluate the toolbar whenever the
  // active tool changes. The synchronous `stateRef.current.tool` write
  // in `api.setTool` already keeps the *click-driven* path correct, but
  // internal state changes (the in-viewport Reset clears tool to
  // 'pointer', for instance) don't go through `recordInteraction`, so
  // without this effect the button's active highlight could go stale.
  (0,react.useEffect)(() => {
    const toolbarService = servicesManager?.services?.toolbarService;
    if (!viewportId || !toolbarService?.refreshToolbarState) return;
    toolbarService.refreshToolbarState({
      viewportId
    });
  }, [tool, viewportId, servicesManager]);
  const canvasCursor = tool === 'pointer' ? 'default' : tool === 'time-caliper' ? 'col-resize' : tool === 'amplitude-caliper' ? 'row-resize' : tool === 'pan' ? 'grab' : tool === 'zoom' ? 'ns-resize' : 'default';
  return /*#__PURE__*/react.createElement("div", {
    className: "ohif-dicom-ecg-viewport"
  }, /*#__PURE__*/react.createElement(EcgInfoBar, {
    ecg: ecg
  }), /*#__PURE__*/react.createElement("div", {
    ref: canvasHostRef,
    className: "ohif-dicom-ecg-viewport__canvas-host"
  }, /*#__PURE__*/react.createElement("canvas", {
    ref: canvasRef,
    className: "ohif-dicom-ecg-viewport__canvas"
  }), /*#__PURE__*/react.createElement("canvas", {
    ref: overlayCanvasRef,
    className: "ohif-dicom-ecg-viewport__overlay-canvas",
    style: {
      cursor: canvasCursor,
      // The chart canvas is positioned in normal flow inside the
      // host; the overlay sits on top of it at the same CSS size,
      // so absolute positioning at (0,0) lines them up exactly. We
      // disable pointer events on the overlay only when no tool is
      // active so plain wheel-scroll, native text selection, and
      // Ctrl/Cmd + wheel zoom keep working as before. Every other
      // tool (calipers, pan, zoom) needs the overlay to capture
      // pointer events so it can drive its drag-based interaction.
      pointerEvents: tool === 'pointer' ? 'none' : 'auto'
    },
    onPointerDown: onCanvasPointerDown,
    onPointerMove: onCanvasPointerMove,
    onPointerUp: onCanvasPointerUp,
    onPointerCancel: onCanvasPointerUp
  })), /*#__PURE__*/react.createElement("div", {
    className: "ohif-dicom-ecg-viewport__bottom-bar"
  }, /*#__PURE__*/react.createElement(LeadVisibilityControls, {
    ecg: ecg,
    visibleLeads: visibleLeads,
    onToggleLead: toggleLead,
    onSetAll: setAllLeadsVisible,
    disabled: !ecg
  }), /*#__PURE__*/react.createElement(EcgControls, {
    speedMmPerSec: speedMmPerSec,
    amplitudeMmPerMv: amplitudeMmPerMv,
    rowOffsetMm: rowOffsetMm,
    onSpeedDown: () => adjustSpeed(-SPEED_STEP),
    onSpeedUp: () => adjustSpeed(SPEED_STEP),
    onAmplitudeDown: () => adjustAmplitude(-AMPLITUDE_STEP),
    onAmplitudeUp: () => adjustAmplitude(AMPLITUDE_STEP),
    onRowOffsetDown: () => adjustRowOffset(-ROW_OFFSET_STEP_MM),
    onRowOffsetUp: () => adjustRowOffset(ROW_OFFSET_STEP_MM),
    onReset: onResetView,
    disabled: !ecg
  })), loading && !error && /*#__PURE__*/react.createElement("div", {
    className: "ohif-dicom-ecg-viewport__overlay"
  }, "Loading ECG\u2026"), error && /*#__PURE__*/react.createElement("div", {
    className: "ohif-dicom-ecg-viewport__overlay ohif-dicom-ecg-viewport__overlay--error"
  }, /*#__PURE__*/react.createElement("div", null, "Failed to load ECG"), /*#__PURE__*/react.createElement("div", {
    style: {
      fontSize: 12,
      opacity: 0.8
    }
  }, error)));
}

// ---------- Sub-components ----------

function EcgInfoBar({
  ecg
}) {
  if (!ecg) {
    return /*#__PURE__*/react.createElement("div", {
      className: "ohif-dicom-ecg-viewport__info"
    });
  }
  const patientCells = [['NAME', ecg.patient.name], ['SEX', ecg.patient.sex], ['PATIENT ID', ecg.patient.id], ['PATIENT AGE', ecg.patient.age], ['PATIENT WEIGHT', ecg.patient.weight], ['PATIENT SIZE', ecg.patient.size], ['BIRTH', ecg.patient.birth], ['DATE', ecg.patient.date]];
  const waveformCells = [...ecg.info, {
    key: 'SAMPLING',
    value: `${ecg.samplingFrequency}`,
    unit: 'Hz'
  }, {
    key: 'DURATION',
    value: ecg.durationSec.toFixed(1),
    unit: 'sec'
  }];
  return /*#__PURE__*/react.createElement("div", {
    className: "ohif-dicom-ecg-viewport__info"
  }, /*#__PURE__*/react.createElement("div", {
    className: "ohif-dicom-ecg-viewport__info-row"
  }, patientCells.filter(([, v]) => v && v.length > 0).map(([k, v]) => /*#__PURE__*/react.createElement("div", {
    key: k,
    className: "ohif-dicom-ecg-viewport__info-cell"
  }, /*#__PURE__*/react.createElement("span", {
    className: "ohif-dicom-ecg-viewport__info-key"
  }, k, ":"), ' ', /*#__PURE__*/react.createElement("span", {
    className: "ohif-dicom-ecg-viewport__info-val"
  }, v)))), waveformCells.length > 0 && /*#__PURE__*/react.createElement("div", {
    className: "ohif-dicom-ecg-viewport__info-row"
  }, waveformCells.map(item => /*#__PURE__*/react.createElement("div", {
    key: item.key,
    className: "ohif-dicom-ecg-viewport__info-cell"
  }, /*#__PURE__*/react.createElement("span", {
    className: "ohif-dicom-ecg-viewport__info-key"
  }, item.key, ":"), ' ', /*#__PURE__*/react.createElement("span", {
    className: "ohif-dicom-ecg-viewport__info-val"
  }, item.value, " ", item.unit)))), ecg.annotations.length > 0 && /*#__PURE__*/react.createElement("div", {
    className: "ohif-dicom-ecg-viewport__info-row ohif-dicom-ecg-viewport__info-row--annotation"
  }, /*#__PURE__*/react.createElement("span", {
    className: "ohif-dicom-ecg-viewport__info-key"
  }, "ANNOTATION:"), ' ', /*#__PURE__*/react.createElement("span", {
    className: "ohif-dicom-ecg-viewport__info-val"
  }, ecg.annotations.join(' · '))));
}
function LeadVisibilityControls(props) {
  const {
    ecg,
    visibleLeads,
    onToggleLead,
    onSetAll,
    disabled
  } = props;
  if (!ecg || ecg.leads.length === 0) {
    return /*#__PURE__*/react.createElement("div", {
      className: "ohif-dicom-ecg-viewport__lead-toggles"
    });
  }
  const totalLeads = ecg.leads.length;
  const visibleCount = visibleLeads ? visibleLeads.size : totalLeads;
  const allVisible = visibleCount >= totalLeads;
  return /*#__PURE__*/react.createElement("div", {
    className: "ohif-dicom-ecg-viewport__lead-toggles"
  }, /*#__PURE__*/react.createElement("span", {
    className: "ohif-dicom-ecg-viewport__control-label"
  }, "LEADS"), /*#__PURE__*/react.createElement("label", {
    className: "ohif-dicom-ecg-viewport__lead-toggle ohif-dicom-ecg-viewport__lead-toggle--all",
    title: allVisible ? 'Hide all leads' : 'Show all leads'
  }, /*#__PURE__*/react.createElement("input", {
    type: "checkbox",
    checked: allVisible,
    onChange: () => onSetAll(!allVisible),
    disabled: disabled
  }), /*#__PURE__*/react.createElement("span", null, "All")), ecg.leads.map((lead, idx) => {
    const checked = visibleLeads ? visibleLeads.has(idx) : true;
    return /*#__PURE__*/react.createElement("label", {
      key: `${lead.label}-${idx}`,
      className: "ohif-dicom-ecg-viewport__lead-toggle",
      title: `Toggle lead ${lead.label}`
    }, /*#__PURE__*/react.createElement("input", {
      type: "checkbox",
      checked: checked,
      onChange: () => onToggleLead(idx),
      disabled: disabled
    }), /*#__PURE__*/react.createElement("span", null, lead.label));
  }));
}
function EcgControls(props) {
  return /*#__PURE__*/react.createElement("div", {
    className: "ohif-dicom-ecg-viewport__controls"
  }, /*#__PURE__*/react.createElement("div", {
    className: "ohif-dicom-ecg-viewport__control"
  }, /*#__PURE__*/react.createElement("span", {
    className: "ohif-dicom-ecg-viewport__control-label"
  }, "SPEED"), /*#__PURE__*/react.createElement("button", {
    type: "button",
    onClick: props.onSpeedDown,
    disabled: props.disabled,
    title: "Slower (fewer mm per second)"
  }, "\u2212"), /*#__PURE__*/react.createElement("span", {
    className: "ohif-dicom-ecg-viewport__control-value"
  }, props.speedMmPerSec, " mm/s"), /*#__PURE__*/react.createElement("button", {
    type: "button",
    onClick: props.onSpeedUp,
    disabled: props.disabled,
    title: "Faster (more mm per second)"
  }, "+")), /*#__PURE__*/react.createElement("div", {
    className: "ohif-dicom-ecg-viewport__control"
  }, /*#__PURE__*/react.createElement("span", {
    className: "ohif-dicom-ecg-viewport__control-label"
  }, "GAIN"), /*#__PURE__*/react.createElement("button", {
    type: "button",
    onClick: props.onAmplitudeDown,
    disabled: props.disabled,
    title: "Smaller amplitude"
  }, "\u2212"), /*#__PURE__*/react.createElement("span", {
    className: "ohif-dicom-ecg-viewport__control-value"
  }, props.amplitudeMmPerMv, " mm/mV"), /*#__PURE__*/react.createElement("button", {
    type: "button",
    onClick: props.onAmplitudeUp,
    disabled: props.disabled,
    title: "Larger amplitude"
  }, "+")), /*#__PURE__*/react.createElement("div", {
    className: "ohif-dicom-ecg-viewport__control"
  }, /*#__PURE__*/react.createElement("span", {
    className: "ohif-dicom-ecg-viewport__control-label"
  }, "OFFSET"), /*#__PURE__*/react.createElement("button", {
    type: "button",
    onClick: props.onRowOffsetDown,
    disabled: props.disabled,
    title: "Pack leads closer together"
  }, "\u2212"), /*#__PURE__*/react.createElement("span", {
    className: "ohif-dicom-ecg-viewport__control-value"
  }, formatOffset(props.rowOffsetMm)), /*#__PURE__*/react.createElement("button", {
    type: "button",
    onClick: props.onRowOffsetUp,
    disabled: props.disabled,
    title: "Spread leads further apart"
  }, "+")), /*#__PURE__*/react.createElement("button", {
    type: "button",
    className: "ohif-dicom-ecg-viewport__reset",
    onClick: props.onReset,
    disabled: props.disabled
  }, "Reset"));
}
function formatOffset(mm) {
  const sign = mm > 0 ? '+' : '';
  return `${sign}${mm} mm`;
}

// ---------- helpers ----------

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function round(v) {
  return Math.round(v * 100) / 100;
}
OHIFDicomECGViewport.propTypes = {
  displaySets: prop_types_default().arrayOf((prop_types_default()).object).isRequired,
  viewportId: (prop_types_default()).string
};
/* harmony default export */ const viewports_OHIFDicomECGViewport = (OHIFDicomECGViewport);

/***/ }

}]);