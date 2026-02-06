(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[7647],{

/***/ 52675:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ MoreDropdownMenu)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(86326);
/* harmony import */ var _ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(17130);
/* harmony import */ var _ohif_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(15871);
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }




/**
 * The default sub-menu appearance and setup is defined here, but this can be
 * replaced by
 */
const getMenuItemsDefault = ({
  commandsManager,
  items,
  ...props
}) => {
  const {
    servicesManager
  } = (0,_ohif_core__WEBPACK_IMPORTED_MODULE_2__.useSystem)();
  const {
    customizationService
  } = servicesManager.services;

  // This allows replacing the default child item for menus, whereas the entire
  // getMenuItems can also be replaced by providing it to the MoreDropdownMenu
  const menuContent = customizationService.getCustomization('ohif.menuContent');

  // Default menu item component if none is provided through customization

  const DefaultMenuItem = ({
    item
  }) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__/* .DropdownMenuItem */ ._26, {
    onClick: () => item.onClick({
      commandsManager,
      servicesManager,
      ...props
    })
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "flex items-center gap-2"
  }, item.iconName && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__/* .Icons */ .FI1.ByName, {
    name: item.iconName
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null, item.label)));
  const MenuItemComponent = menuContent ?? DefaultMenuItem;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__/* .DropdownMenuContent */ .SQm, {
    hideWhenDetached: true,
    align: "start",
    onClick: e => {
      e.stopPropagation();
      e.preventDefault();
    }
  }, items?.map((item, index) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(MenuItemComponent, _extends({
    key: item.id || `menu-item-${index}`,
    item: item,
    commandsManager: commandsManager,
    servicesManager: servicesManager
  }, props))));
};

/**
 * The component provides a ... sub-menu for various components which appears
 * on hover over the main component.
 *
 * @param bindProps - properties to define the sub-menu
 * @returns Component bound to the bindProps
 */
function MoreDropdownMenu(bindProps) {
  const {
    menuItemsKey,
    getMenuItems = getMenuItemsDefault,
    commandsManager
  } = bindProps;
  const {
    servicesManager
  } = (0,_ohif_core__WEBPACK_IMPORTED_MODULE_2__.useSystem)();
  const {
    customizationService
  } = servicesManager.services;
  const items = customizationService.getCustomization(menuItemsKey);
  if (!items?.length) {
    return null;
  }
  function BoundMoreDropdownMenu(props) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__/* .DropdownMenu */ .rId, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__/* .DropdownMenuTrigger */ .tyb, {
      asChild: true
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__/* .Button */ .$nd, {
      variant: "ghost",
      size: "icon",
      className: "hidden group-hover:inline-flex data-[state=open]:inline-flex",
      onClick: e => {
        e.preventDefault();
        e.stopPropagation();
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__/* .Icons */ .FI1.More, null))), getMenuItems({
      ...props,
      commandsManager: commandsManager,
      servicesManager: servicesManager,
      items
    }));
  }
  return BoundMoreDropdownMenu;
}

/***/ }),

/***/ 34551:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ StaticWadoClient)
});

// EXTERNAL MODULE: ../../../node_modules/dicomweb-client/build/dicomweb-client.es.js
var dicomweb_client_es = __webpack_require__(83562);
;// ../../../extensions/default/src/DatabricksPixelsDicom/findIndexOfString.ts
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
;// ../../../extensions/default/src/DatabricksPixelsDicom/fixMultipart.ts


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
;// ../../../extensions/default/src/DatabricksPixelsDicom/StaticWadoClient.ts


const {
  DicomMetadataStore
} = __webpack_require__(15871);
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
    if (this.staticWado) {
      return super.retrieveInstanceFrames({
        ...options,
        mediaTypes: [{
          mediaType: 'image/*'
        }]
      });
    } else {
      return super.retrieveInstanceFrames(options);
    }
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

/***/ }),

/***/ 40565:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ StudyBrowser_PanelStudyBrowser)
});

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../ui-next/src/index.ts + 3073 modules
var src = __webpack_require__(17130);
// EXTERNAL MODULE: ../../core/src/index.ts + 68 modules
var core_src = __webpack_require__(15871);
// EXTERNAL MODULE: ../../../node_modules/react-router-dom/dist/index.js
var dist = __webpack_require__(4194);
// EXTERNAL MODULE: ../../../extensions/default/src/Panels/StudyBrowser/PanelStudyBrowserHeader.tsx
var PanelStudyBrowserHeader = __webpack_require__(3329);
;// ../../../extensions/default/src/Panels/StudyBrowser/constants/actionIcons.ts
const defaultActionIcons = [{
  id: 'settings',
  iconName: 'Settings',
  value: false
}];

;// ../../../extensions/default/src/Panels/StudyBrowser/constants/viewPresets.ts
const defaultViewPresets = [{
  id: 'list',
  iconName: 'ListView',
  selected: false
}, {
  id: 'thumbnails',
  iconName: 'ThumbnailView',
  selected: true
}];

;// ../../../extensions/default/src/Panels/StudyBrowser/constants/index.ts



// EXTERNAL MODULE: ../../../extensions/default/src/Components/MoreDropdownMenu.tsx
var MoreDropdownMenu = __webpack_require__(52675);
;// ../../../extensions/default/src/Panels/StudyBrowser/PanelStudyBrowser.tsx








const {
  sortStudyInstances,
  formatDate,
  createStudyBrowserTabs
} = core_src.utils;
const thumbnailNoImageModalities = ['SR', 'SEG', 'RTSTRUCT', 'RTPLAN', 'RTDOSE', 'DOC', 'PMAP'];

/**
 * Study Browser component that displays and manages studies and their display sets
 */
function PanelStudyBrowser({
  getImageSrc,
  getStudiesForPatientByMRN,
  requestDisplaySetCreationForStudy,
  dataSource,
  customMapDisplaySets,
  onClickUntrack,
  onDoubleClickThumbnailHandlerCallBack
}) {
  const {
    servicesManager,
    commandsManager,
    extensionManager
  } = (0,core_src.useSystem)();
  const {
    displaySetService,
    customizationService
  } = servicesManager.services;
  const navigate = (0,dist/* useNavigate */.Zp)();
  const studyMode = customizationService.getCustomization('studyBrowser.studyMode') || 'all';
  const internalImageViewer = (0,src/* useImageViewer */.Bzx)();
  const StudyInstanceUIDs = internalImageViewer.StudyInstanceUIDs;
  const fetchedStudiesRef = (0,react.useRef)(new Set());
  const [{
    activeViewportId,
    viewports,
    isHangingProtocolLayout
  }] = (0,src/* useViewportGrid */.ihW)();
  const [activeTabName, setActiveTabName] = (0,react.useState)(studyMode);
  const [expandedStudyInstanceUIDs, setExpandedStudyInstanceUIDs] = (0,react.useState)([...StudyInstanceUIDs]);
  const [hasLoadedViewports, setHasLoadedViewports] = (0,react.useState)(false);
  const [studyDisplayList, setStudyDisplayList] = (0,react.useState)([]);
  const [displaySets, setDisplaySets] = (0,react.useState)([]);
  const [displaySetsLoadingState, setDisplaySetsLoadingState] = (0,react.useState)({});
  const [thumbnailImageSrcMap, setThumbnailImageSrcMap] = (0,react.useState)({});
  const [jumpToDisplaySet, setJumpToDisplaySet] = (0,react.useState)(null);
  const [viewPresets, setViewPresets] = (0,react.useState)(customizationService.getCustomization('studyBrowser.viewPresets'));
  const [actionIcons, setActionIcons] = (0,react.useState)(defaultActionIcons);

  // multiple can be true or false
  const updateActionIconValue = actionIcon => {
    actionIcon.value = !actionIcon.value;
    const newActionIcons = [...actionIcons];
    setActionIcons(newActionIcons);
  };

  // only one is true at a time
  const updateViewPresetValue = viewPreset => {
    if (!viewPreset) {
      return;
    }
    const newViewPresets = viewPresets.map(preset => {
      preset.selected = preset.id === viewPreset.id;
      return preset;
    });
    setViewPresets(newViewPresets);
  };
  const mapDisplaySetsWithState = customMapDisplaySets || _mapDisplaySets;
  const onDoubleClickThumbnailHandler = (0,react.useCallback)(async displaySetInstanceUID => {
    const customHandler = customizationService.getCustomization('studyBrowser.thumbnailDoubleClickCallback');
    const setupArgs = {
      activeViewportId,
      commandsManager,
      servicesManager,
      isHangingProtocolLayout,
      appConfig: extensionManager._appConfig
    };
    const handlers = customHandler?.callbacks.map(callback => callback(setupArgs));
    for (const handler of handlers) {
      await handler(displaySetInstanceUID);
    }
    onDoubleClickThumbnailHandlerCallBack?.(displaySetInstanceUID);
  }, [activeViewportId, commandsManager, servicesManager, isHangingProtocolLayout, customizationService]);

  // ~~ studyDisplayList
  (0,react.useEffect)(() => {
    // Fetch all studies for the patient in each primary study
    async function fetchStudiesForPatient(StudyInstanceUID) {
      // Skip fetching if we've already fetched this study
      if (fetchedStudiesRef.current.has(StudyInstanceUID)) {
        return;
      }
      fetchedStudiesRef.current.add(StudyInstanceUID);

      // current study qido
      const qidoForStudyUID = await dataSource.query.studies.search({
        studyInstanceUid: StudyInstanceUID
      });
      if (!qidoForStudyUID?.length) {
        navigate('/notfoundstudy', '_self');
        throw new Error('Invalid study URL');
      }
      let qidoStudiesForPatient = qidoForStudyUID;

      // try to fetch the prior studies based on the patientID if the
      // server can respond.
      try {
        qidoStudiesForPatient = await getStudiesForPatientByMRN(qidoForStudyUID);
      } catch (error) {
        console.warn(error);
      }
      const mappedStudies = _mapDataSourceStudies(qidoStudiesForPatient);
      const actuallyMappedStudies = mappedStudies.map(qidoStudy => {
        return {
          studyInstanceUid: qidoStudy.StudyInstanceUID,
          date: formatDate(qidoStudy.StudyDate) || '',
          description: qidoStudy.StudyDescription,
          modalities: qidoStudy.ModalitiesInStudy,
          numInstances: Number(qidoStudy.NumInstances)
        };
      });
      setStudyDisplayList(prevArray => {
        const ret = [...prevArray];
        for (const study of actuallyMappedStudies) {
          if (!prevArray.find(it => it.studyInstanceUid === study.studyInstanceUid)) {
            ret.push(study);
          }
        }
        return ret;
      });
    }
    StudyInstanceUIDs.forEach(sid => fetchStudiesForPatient(sid));
  }, [StudyInstanceUIDs, dataSource, getStudiesForPatientByMRN, navigate]);

  // ~~ Initial Thumbnails
  (0,react.useEffect)(() => {
    if (!hasLoadedViewports) {
      if (activeViewportId) {
        // Once there is an active viewport id, it means the layout is ready
        // so wait a bit of time to allow the viewports preferential loading
        // which improves user experience of responsiveness significantly on slower
        // systems.
        const delayMs = 250 + displaySetService.getActiveDisplaySets().length * 10;
        window.setTimeout(() => setHasLoadedViewports(true), delayMs);
      }
      return;
    }
    let currentDisplaySets = displaySetService.activeDisplaySets;
    // filter non based on the list of modalities that are supported by cornerstone
    currentDisplaySets = currentDisplaySets.filter(ds => !thumbnailNoImageModalities.includes(ds.Modality) || ds.thumbnailSrc === null);
    if (!currentDisplaySets.length) {
      return;
    }
    currentDisplaySets.forEach(async dSet => {
      const newImageSrcEntry = {};
      const displaySet = displaySetService.getDisplaySetByUID(dSet.displaySetInstanceUID);
      const imageIds = dataSource.getImageIdsForDisplaySet(dSet);
      const imageId = getImageIdForThumbnail(displaySet, imageIds);

      // TODO: Is it okay that imageIds are not returned here for SR displaySets?
      if (displaySet?.unsupported) {
        return;
      }
      // When the image arrives, render it and store the result in the thumbnailImgSrcMap
      let {
        thumbnailSrc
      } = displaySet;
      if (!thumbnailSrc && displaySet.getThumbnailSrc) {
        thumbnailSrc = await displaySet.getThumbnailSrc({
          getImageSrc
        });
      }
      if (!thumbnailSrc && imageId) {
        const thumbnailSrc = await getImageSrc(imageId);
        displaySet.thumbnailSrc = thumbnailSrc;
      }
      newImageSrcEntry[dSet.displaySetInstanceUID] = thumbnailSrc;
      setThumbnailImageSrcMap(prevState => {
        return {
          ...prevState,
          ...newImageSrcEntry
        };
      });
    });
  }, [displaySetService, dataSource, getImageSrc, activeViewportId, hasLoadedViewports]);

  // ~~ displaySets
  (0,react.useEffect)(() => {
    const currentDisplaySets = displaySetService.activeDisplaySets;
    if (!currentDisplaySets.length) {
      return;
    }
    const mappedDisplaySets = mapDisplaySetsWithState(currentDisplaySets, displaySetsLoadingState, thumbnailImageSrcMap, viewports);
    if (!customMapDisplaySets) {
      sortStudyInstances(mappedDisplaySets);
    }
    setDisplaySets(mappedDisplaySets);
  }, [displaySetService.activeDisplaySets, displaySetsLoadingState, viewports, thumbnailImageSrcMap, customMapDisplaySets]);

  // ~~ subscriptions --> displaySets
  (0,react.useEffect)(() => {
    // DISPLAY_SETS_ADDED returns an array of DisplaySets that were added
    const SubscriptionDisplaySetsAdded = displaySetService.subscribe(displaySetService.EVENTS.DISPLAY_SETS_ADDED, data => {
      if (!hasLoadedViewports) {
        return;
      }
      const {
        displaySetsAdded,
        options
      } = data;
      displaySetsAdded.forEach(async dSet => {
        const displaySetInstanceUID = dSet.displaySetInstanceUID;
        const newImageSrcEntry = {};
        const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
        if (displaySet?.unsupported) {
          return;
        }
        if (options?.madeInClient) {
          setJumpToDisplaySet(displaySetInstanceUID);
        }
        const imageIds = dataSource.getImageIdsForDisplaySet(displaySet);
        const imageId = getImageIdForThumbnail(displaySet, imageIds);

        // TODO: Is it okay that imageIds are not returned here for SR displaysets?
        if (!imageId) {
          return;
        }

        // When the image arrives, render it and store the result in the thumbnailImgSrcMap
        let {
          thumbnailSrc
        } = displaySet;
        if (!thumbnailSrc && displaySet.getThumbnailSrc) {
          thumbnailSrc = await displaySet.getThumbnailSrc({
            getImageSrc
          });
        }
        if (!thumbnailSrc) {
          thumbnailSrc = await getImageSrc(imageId);
          displaySet.thumbnailSrc = thumbnailSrc;
        }
        newImageSrcEntry[displaySetInstanceUID] = thumbnailSrc;
        setThumbnailImageSrcMap(prevState => {
          return {
            ...prevState,
            ...newImageSrcEntry
          };
        });
      });
    });
    return () => {
      SubscriptionDisplaySetsAdded.unsubscribe();
    };
  }, [displaySetService, dataSource, getImageSrc, hasLoadedViewports]);
  (0,react.useEffect)(() => {
    // TODO: Will this always hold _all_ the displaySets we care about?
    // DISPLAY_SETS_CHANGED returns `DisplaySerService.activeDisplaySets`
    const SubscriptionDisplaySetsChanged = displaySetService.subscribe(displaySetService.EVENTS.DISPLAY_SETS_CHANGED, changedDisplaySets => {
      const mappedDisplaySets = mapDisplaySetsWithState(changedDisplaySets, displaySetsLoadingState, thumbnailImageSrcMap, viewports);
      if (!customMapDisplaySets) {
        sortStudyInstances(mappedDisplaySets);
      }
      setDisplaySets(mappedDisplaySets);
    });
    const SubscriptionDisplaySetMetaDataInvalidated = displaySetService.subscribe(displaySetService.EVENTS.DISPLAY_SET_SERIES_METADATA_INVALIDATED, () => {
      const mappedDisplaySets = mapDisplaySetsWithState(displaySetService.getActiveDisplaySets(), displaySetsLoadingState, thumbnailImageSrcMap, viewports);
      if (!customMapDisplaySets) {
        sortStudyInstances(mappedDisplaySets);
      }
      setDisplaySets(mappedDisplaySets);
    });
    return () => {
      SubscriptionDisplaySetsChanged.unsubscribe();
      SubscriptionDisplaySetMetaDataInvalidated.unsubscribe();
    };
  }, [displaySetsLoadingState, thumbnailImageSrcMap, viewports, displaySetService, customMapDisplaySets]);
  const tabs = createStudyBrowserTabs(StudyInstanceUIDs, studyDisplayList, displaySets);

  // TODO: Should not fire this on "close"
  function _handleStudyClick(StudyInstanceUID) {
    const shouldCollapseStudy = expandedStudyInstanceUIDs.includes(StudyInstanceUID);
    const updatedExpandedStudyInstanceUIDs = shouldCollapseStudy ? [...expandedStudyInstanceUIDs.filter(stdyUid => stdyUid !== StudyInstanceUID)] : [...expandedStudyInstanceUIDs, StudyInstanceUID];
    setExpandedStudyInstanceUIDs(updatedExpandedStudyInstanceUIDs);
    if (!shouldCollapseStudy) {
      const madeInClient = true;
      requestDisplaySetCreationForStudy(displaySetService, StudyInstanceUID, madeInClient);
    }
  }
  (0,react.useEffect)(() => {
    if (jumpToDisplaySet) {
      // Get element by displaySetInstanceUID
      const displaySetInstanceUID = jumpToDisplaySet;
      const element = document.getElementById(`thumbnail-${displaySetInstanceUID}`);
      if (element && typeof element.scrollIntoView === 'function') {
        // TODO: Any way to support IE here?
        element.scrollIntoView({
          behavior: 'smooth'
        });
        setJumpToDisplaySet(null);
      }
    }
  }, [jumpToDisplaySet, expandedStudyInstanceUIDs, activeTabName]);
  (0,react.useEffect)(() => {
    if (!jumpToDisplaySet) {
      return;
    }
    const displaySetInstanceUID = jumpToDisplaySet;
    // Set the activeTabName and expand the study
    const thumbnailLocation = _findTabAndStudyOfDisplaySet(displaySetInstanceUID, tabs);
    if (!thumbnailLocation) {
      return;
    }
    const {
      tabName,
      StudyInstanceUID
    } = thumbnailLocation;
    setActiveTabName(tabName);
    const studyExpanded = expandedStudyInstanceUIDs.includes(StudyInstanceUID);
    if (!studyExpanded) {
      const updatedExpandedStudyInstanceUIDs = [...expandedStudyInstanceUIDs, StudyInstanceUID];
      setExpandedStudyInstanceUIDs(updatedExpandedStudyInstanceUIDs);
    }
  }, [expandedStudyInstanceUIDs, jumpToDisplaySet, tabs]);
  const activeDisplaySetInstanceUIDs = viewports.get(activeViewportId)?.displaySetInstanceUIDs;
  return /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement(PanelStudyBrowserHeader/* PanelStudyBrowserHeader */.T, {
    viewPresets: viewPresets,
    updateViewPresetValue: updateViewPresetValue,
    actionIcons: actionIcons,
    updateActionIconValue: updateActionIconValue
  }), /*#__PURE__*/react.createElement(src/* Separator */.wvv, {
    orientation: "horizontal",
    className: "bg-black",
    thickness: "2px"
  })), /*#__PURE__*/react.createElement(src/* StudyBrowser */.M4o, {
    tabs: tabs,
    servicesManager: servicesManager,
    activeTabName: activeTabName,
    expandedStudyInstanceUIDs: expandedStudyInstanceUIDs,
    onClickStudy: _handleStudyClick,
    onClickTab: clickedTabName => {
      setActiveTabName(clickedTabName);
    },
    onClickUntrack: onClickUntrack,
    onClickThumbnail: () => {},
    onDoubleClickThumbnail: onDoubleClickThumbnailHandler,
    activeDisplaySetInstanceUIDs: activeDisplaySetInstanceUIDs,
    showSettings: actionIcons.find(icon => icon.id === 'settings')?.value,
    viewPresets: viewPresets,
    ThumbnailMenuItems: (0,MoreDropdownMenu/* default */.A)({
      commandsManager,
      servicesManager,
      menuItemsKey: 'studyBrowser.thumbnailMenuItems'
    }),
    StudyMenuItems: (0,MoreDropdownMenu/* default */.A)({
      commandsManager,
      servicesManager,
      menuItemsKey: 'studyBrowser.studyMenuItems'
    })
  }));
}
/* harmony default export */ const StudyBrowser_PanelStudyBrowser = (PanelStudyBrowser);

/**
 * Maps from the DataSource's format to a naturalized object
 *
 * @param {*} studies
 */
function _mapDataSourceStudies(studies) {
  return studies.map(study => {
    // TODO: Why does the data source return in this format?
    return {
      AccessionNumber: study.accession,
      StudyDate: study.date,
      StudyDescription: study.description,
      NumInstances: study.instances,
      ModalitiesInStudy: study.modalities,
      PatientID: study.mrn,
      PatientName: study.patientName,
      StudyInstanceUID: study.studyInstanceUid,
      StudyTime: study.time
    };
  });
}
function _mapDisplaySets(displaySets, displaySetLoadingState, thumbnailImageSrcMap, viewports) {
  const thumbnailDisplaySets = [];
  const thumbnailNoImageDisplaySets = [];
  displaySets.filter(ds => !ds.excludeFromThumbnailBrowser).forEach(ds => {
    const {
      thumbnailSrc,
      displaySetInstanceUID
    } = ds;
    const componentType = _getComponentType(ds);
    const array = componentType === 'thumbnail' ? thumbnailDisplaySets : thumbnailNoImageDisplaySets;
    const loadingProgress = displaySetLoadingState?.[displaySetInstanceUID];
    array.push({
      displaySetInstanceUID,
      description: ds.SeriesDescription || '',
      seriesNumber: ds.SeriesNumber,
      modality: ds.Modality,
      seriesDate: formatDate(ds.SeriesDate),
      numInstances: ds.numImageFrames,
      loadingProgress,
      countIcon: ds.countIcon,
      messages: ds.messages,
      StudyInstanceUID: ds.StudyInstanceUID,
      componentType,
      imageSrc: thumbnailSrc || thumbnailImageSrcMap[displaySetInstanceUID],
      dragData: {
        type: 'displayset',
        displaySetInstanceUID
        // .. Any other data to pass
      },
      isHydratedForDerivedDisplaySet: ds.isHydrated
    });
  });
  return [...thumbnailDisplaySets, ...thumbnailNoImageDisplaySets];
}
function _getComponentType(ds) {
  if (thumbnailNoImageModalities.includes(ds.Modality) || ds?.unsupported || ds.thumbnailSrc === null) {
    return 'thumbnailNoImage';
  }
  return 'thumbnail';
}
function getImageIdForThumbnail(displaySet, imageIds) {
  let imageId;
  if (displaySet.isDynamicVolume) {
    const timePoints = displaySet.dynamicVolumeInfo.timePoints;
    const middleIndex = Math.floor(timePoints.length / 2);
    const middleTimePointImageIds = timePoints[middleIndex];
    imageId = middleTimePointImageIds[Math.floor(middleTimePointImageIds.length / 2)];
  } else {
    imageId = imageIds[Math.floor(imageIds.length / 2)];
  }
  return imageId;
}
function _findTabAndStudyOfDisplaySet(displaySetInstanceUID, tabs) {
  for (let t = 0; t < tabs.length; t++) {
    const {
      studies
    } = tabs[t];
    for (let s = 0; s < studies.length; s++) {
      const {
        displaySets
      } = studies[s];
      for (let d = 0; d < displaySets.length; d++) {
        const displaySet = displaySets[d];
        if (displaySet.displaySetInstanceUID === displaySetInstanceUID) {
          return {
            tabName: tabs[t].name,
            StudyInstanceUID: studies[s].studyInstanceUid
          };
        }
      }
    }
  }
}

/***/ }),

/***/ 3329:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   T: () => (/* binding */ PanelStudyBrowserHeader)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(86326);
/* harmony import */ var _ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(17130);



function PanelStudyBrowserHeader({
  viewPresets,
  updateViewPresetValue,
  actionIcons,
  updateActionIconValue
}) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "bg-muted flex h-[40px] select-none rounded-t p-2"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: 'flex h-[24px] w-full select-none justify-center self-center text-[14px]'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "flex w-full items-center gap-[10px]"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "flex items-center justify-center"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "text-primary flex items-center space-x-1"
  }, actionIcons.map((icon, index) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__/* .Icons */ .FI1[icon.iconName] || _ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__/* .Icons */ .FI1.MissingIcon, {
    key: index,
    onClick: () => updateActionIconValue(icon),
    className: `cursor-pointer`
  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "ml-auto flex h-full items-center justify-center"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__/* .ToggleGroup */ .OY8, {
    type: "single",
    value: viewPresets.filter(preset => preset.selected)[0].id,
    onValueChange: value => {
      const selectedViewPreset = viewPresets.find(preset => preset.id === value);
      updateViewPresetValue(selectedViewPreset);
    }
  }, viewPresets.map((viewPreset, index) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__/* .ToggleGroupItem */ .dzE, {
    key: index,
    "aria-label": viewPreset.id,
    value: viewPreset.id,
    className: "text-actions-primary"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__/* .Icons */ .FI1[viewPreset.iconName] || _ohif_ui_next__WEBPACK_IMPORTED_MODULE_1__/* .Icons */ .FI1.MissingIcon)))))))));
}


/***/ }),

/***/ 20528:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   M: () => (/* binding */ Toolbar)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(86326);
/* harmony import */ var _ohif_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15871);
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }


function Toolbar({
  buttonSection = 'primary',
  viewportId,
  location
}) {
  const {
    toolbarButtons,
    onInteraction,
    isItemOpen,
    isItemLocked,
    openItem,
    closeItem,
    toggleLock
  } = (0,_ohif_core__WEBPACK_IMPORTED_MODULE_1__.useToolbar)({
    buttonSection
  });
  if (!toolbarButtons.length) {
    return null;
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, toolbarButtons?.map(toolDef => {
    if (!toolDef) {
      return null;
    }
    const {
      id,
      Component,
      componentProps
    } = toolDef;

    // Enhanced props with state and actions - respecting viewport specificity
    const enhancedProps = {
      ...componentProps,
      isOpen: isItemOpen(id, viewportId),
      isLocked: isItemLocked(id, viewportId),
      onOpen: () => openItem(id, viewportId),
      onClose: () => closeItem(id, viewportId),
      onToggleLock: () => toggleLock(id, viewportId),
      viewportId
    };
    const tool = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component, _extends({
      key: id,
      id: id,
      location: location,
      onInteraction: args => {
        onInteraction({
          ...args,
          itemId: id,
          viewportId
        });
      }
    }, enhancedProps));
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
      key: id
    }, tool);
  }));
}

/***/ }),

/***/ 72069:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  ContextMenuController: () => (/* reexport */ ContextMenuController),
  CustomizableContextMenuTypes: () => (/* reexport */ types_namespaceObject),
  MoreDropdownMenu: () => (/* reexport */ MoreDropdownMenu/* default */.A),
  PanelStudyBrowserHeader: () => (/* reexport */ PanelStudyBrowserHeader/* PanelStudyBrowserHeader */.T),
  StaticWadoClient: () => (/* reexport */ StaticWadoClient_StaticWadoClient),
  Toolbar: () => (/* reexport */ Toolbar/* Toolbar */.M),
  Toolbox: () => (/* reexport */ Toolbox),
  callInputDialog: () => (/* reexport */ callInputDialog),
  callInputDialogAutoComplete: () => (/* reexport */ callInputDialogAutoComplete),
  cleanDenaturalizedDataset: () => (/* reexport */ cleanDenaturalizedDataset),
  colorPickerDialog: () => (/* reexport */ colorPickerDialog),
  createReportAsync: () => (/* reexport */ Actions_createReportAsync),
  createReportDialogPrompt: () => (/* reexport */ CreateReportDialogPrompt),
  "default": () => (/* binding */ default_src),
  dicomWebUtils: () => (/* reexport */ DicomWebDataSource_utils_namespaceObject),
  getStudiesForPatientByMRN: () => (/* reexport */ Panels_getStudiesForPatientByMRN),
  promptLabelAnnotation: () => (/* reexport */ utils_promptLabelAnnotation),
  promptSaveReport: () => (/* reexport */ utils_promptSaveReport),
  requestDisplaySetCreationForStudy: () => (/* reexport */ Panels_requestDisplaySetCreationForStudy),
  useDisplaySetSelectorStore: () => (/* reexport */ useDisplaySetSelectorStore),
  useHangingProtocolStageIndexStore: () => (/* reexport */ useHangingProtocolStageIndexStore),
  usePatientInfo: () => (/* reexport */ hooks_usePatientInfo),
  useToggleHangingProtocolStore: () => (/* reexport */ useToggleHangingProtocolStore),
  useToggleOneUpViewportGridStore: () => (/* reexport */ useToggleOneUpViewportGridStore),
  useUIStateStore: () => (/* reexport */ useUIStateStore),
  useViewportGridStore: () => (/* reexport */ useViewportGridStore),
  useViewportsByPositionStore: () => (/* reexport */ useViewportsByPositionStore),
  utils: () => (/* reexport */ src_utils_namespaceObject)
});

// NAMESPACE OBJECT: ../../../extensions/default/src/CustomizableContextMenu/types.ts
var types_namespaceObject = {};
__webpack_require__.r(types_namespaceObject);

// NAMESPACE OBJECT: ../../../extensions/default/src/DicomWebDataSource/utils/index.ts
var DicomWebDataSource_utils_namespaceObject = {};
__webpack_require__.r(DicomWebDataSource_utils_namespaceObject);
__webpack_require__.d(DicomWebDataSource_utils_namespaceObject, {
  cleanDenaturalizedDataset: () => (cleanDenaturalizedDataset),
  fixBulkDataURI: () => (fixBulkDataURI),
  fixMultiValueKeys: () => (fixMultiValueKeys),
  transferDenaturalizedDataset: () => (transferDenaturalizedDataset)
});

// NAMESPACE OBJECT: ../../../extensions/default/src/utils/index.ts
var src_utils_namespaceObject = {};
__webpack_require__.r(src_utils_namespaceObject);
__webpack_require__.d(src_utils_namespaceObject, {
  Toolbox: () => (Toolbox),
  addIcon: () => (addIcon)
});

// EXTERNAL MODULE: ../../core/src/index.ts + 68 modules
var src = __webpack_require__(15871);
// EXTERNAL MODULE: ../../../node_modules/query-string/index.js
var query_string = __webpack_require__(98985);
;// ../../../extensions/default/src/DicomWebDataSource/utils/getWADORSImageId.js
function buildInstanceWadoRsUri(instance, config) {
  const {
    StudyInstanceUID,
    SeriesInstanceUID,
    SOPInstanceUID
  } = instance;
  return `${config.wadoRoot}/studies/${StudyInstanceUID}/series/${SeriesInstanceUID}/instances/${SOPInstanceUID}`;
}
function buildInstanceFrameWadoRsUri(instance, config, frame) {
  const baseWadoRsUri = buildInstanceWadoRsUri(instance, config);
  frame = frame || 1;
  return `${baseWadoRsUri}/frames/${frame}`;
}

// function getWADORSImageUrl(instance, frame) {
//   const wadorsuri = buildInstanceFrameWadoRsUri(instance, config, frame);

//   if (!wadorsuri) {
//     return;
//   }

//   // Use null to obtain an imageId which represents the instance
//   if (frame === null) {
//     wadorsuri = wadorsuri.replace(/frames\/(\d+)/, '');
//   } else {
//     // We need to sum 1 because WADO-RS frame number is 1-based
//     frame = frame ? parseInt(frame) + 1 : 1;

//     // Replaces /frame/1 by /frame/{frame}
//     wadorsuri = wadorsuri.replace(/frames\/(\d+)/, `frames/${frame}`);
//   }

//   return wadorsuri;
// }

/**
 * Obtain an imageId for Cornerstone based on the WADO-RS scheme
 *
 * @param {object} instanceMetada metadata object (InstanceMetadata)
 * @param {(string\|number)} [frame] the frame number
 * @returns {string} The imageId to be used by Cornerstone
 */
function getWADORSImageId(instance, config, frame) {
  //const uri = getWADORSImageUrl(instance, frame);
  const uri = buildInstanceFrameWadoRsUri(instance, config, frame);
  if (!uri) {
    return;
  }
  return `wadors:${uri}`;
}
;// ../../../extensions/default/src/DicomWebDataSource/utils/getImageId.js

function buildInstanceWadoUrl(config, instance) {
  const {
    StudyInstanceUID,
    SeriesInstanceUID,
    SOPInstanceUID
  } = instance;
  const params = [];
  params.push('requestType=WADO');
  params.push(`studyUID=${StudyInstanceUID}`);
  params.push(`seriesUID=${SeriesInstanceUID}`);
  params.push(`objectUID=${SOPInstanceUID}`);
  params.push('contentType=application/dicom');
  params.push('transferSyntax=*');
  const paramString = params.join('&');
  return `${config.wadoUriRoot}?${paramString}`;
}

/**
 * Obtain an imageId for Cornerstone from an image instance
 *
 * @param instance
 * @param frame
 * @param thumbnail
 * @returns {string} The imageId to be used by Cornerstone
 */
function getImageId({
  instance,
  frame,
  config,
  thumbnail = false
}) {
  if (!instance) {
    return;
  }
  if (instance.imageId && frame === undefined) {
    return instance.imageId;
  }
  if (instance.url) {
    return instance.url;
  }
  const renderingAttr = thumbnail ? 'thumbnailRendering' : 'imageRendering';
  if (!config[renderingAttr] || config[renderingAttr] === 'wadouri') {
    const wadouri = buildInstanceWadoUrl(config, instance);
    let imageId = 'dicomweb:' + wadouri;
    if (frame !== undefined) {
      imageId += '&frame=' + frame;
    }
    return imageId;
  } else {
    return getWADORSImageId(instance, config, frame); // WADO-RS Retrieve Frame
  }
}
;// ../../../extensions/default/src/utils/getBulkdataValue.js
/**
 * Generates a URL that can be used for direct retrieve of the bulkdata.
 *
 * @param {object} config - The configuration object.
 * @param {object} params - The parameters object.
 * @param {string} params.tag - The tag name of the URL to retrieve.
 * @param {string} params.defaultPath - The path for the pixel data URL.
 * @param {object} params.instance - The instance object that the tag is in.
 * @param {string} params.defaultType - The mime type of the response.
 * @param {string} params.singlepart - The type of the part to retrieve.
 * @param {string} params.fetchPart - Unknown.
 * @returns {string|Promise<string>} - An absolute URL to the resource, if the absolute URL can be retrieved as singlepart,
 *    or is already retrieved, or a promise to a URL for such use if a BulkDataURI.
 */
const getBulkdataValue = (config, params) => {
  const {
    instance,
    tag = 'PixelData',
    defaultPath = '/pixeldata',
    defaultType = 'video/mp4'
  } = params;
  const value = instance[tag];
  const {
    StudyInstanceUID,
    SeriesInstanceUID,
    SOPInstanceUID
  } = instance;
  const BulkDataURI = value && value.BulkDataURI || `series/${SeriesInstanceUID}/instances/${SOPInstanceUID}${defaultPath}`;
  const hasQuery = BulkDataURI.indexOf('?') !== -1;
  const hasAccept = BulkDataURI.indexOf('accept=') !== -1;
  const acceptUri = BulkDataURI + (hasAccept ? '' : (hasQuery ? '&' : '?') + `accept=${defaultType}`);
  if (acceptUri.startsWith('series/')) {
    const {
      wadoRoot
    } = config;
    return `${wadoRoot}/studies/${StudyInstanceUID}/${acceptUri}`;
  }

  // The DICOMweb standard states that the default is multipart related, and then
  // separately states that the accept parameter is the URL parameter equivalent of the accept header.
  return acceptUri;
};
/* harmony default export */ const utils_getBulkdataValue = (getBulkdataValue);
;// ../../../extensions/default/src/utils/createRenderedRetrieve.js
/**
 * Generates the rendered URL that can be used for direct retrieve of the pixel data binary stream.
 *
 * @param {object} config - The configuration object.
 * @param {string} config.wadoRoot - The root URL for the WADO service.
 * @param {object} params - The parameters object.
 * @param {string} params.tag - The tag name of the URL to retrieve.
 * @param {string} params.defaultPath - The path for the pixel data URL.
 * @param {object} params.instance - The instance object that the tag is in.
 * @param {string} params.defaultType - The mime type of the response.
 * @param {string} params.singlepart - The type of the part to retrieve.
 * @param {string} params.fetchPart - Unknown parameter.
 * @param {string} params.url - Unknown parameter.
 * @returns {string|Promise<string>} - An absolute URL to the binary stream.
 */
const createRenderedRetrieve = (config, params) => {
  const {
    wadoRoot
  } = config;
  const {
    instance,
    tag = 'PixelData'
  } = params;
  const {
    StudyInstanceUID,
    SeriesInstanceUID,
    SOPInstanceUID
  } = instance;
  const bulkDataURI = instance[tag]?.BulkDataURI ?? '';
  if (bulkDataURI?.indexOf('?') !== -1) {
    // The value instance has parameters, so it should not revert to the rendered
    return;
  }
  if (tag === 'PixelData' || tag === 'EncapsulatedDocument') {
    return `${wadoRoot}/studies/${StudyInstanceUID}/series/${SeriesInstanceUID}/instances/${SOPInstanceUID}/rendered`;
  }
};
/* harmony default export */ const utils_createRenderedRetrieve = (createRenderedRetrieve);
;// ../../../extensions/default/src/utils/getDirectURL.ts




/**
 * Generates a URL that can be used for direct retrieve of the bulkdata
 *
 * @param {object} params
 * @param {string} params.tag is the tag name of the URL to retrieve
 * @param {string} params.defaultPath path for the pixel data url
 * @param {object} params.instance is the instance object that the tag is in
 * @param {string} params.defaultType is the mime type of the response
 * @param {string} params.singlepart is the type of the part to retrieve
 * @param {string} params.fetchPart unknown?
 * @param {string} params.url unknown?
 * @returns an absolute URL to the resource, if the absolute URL can be retrieved as singlepart,
 *    or is already retrieved, or a promise to a URL for such use if a BulkDataURI
 */
const getDirectURL = (config, params) => {
  const {
    singlepart
  } = config;
  const {
    instance,
    tag = 'PixelData',
    defaultType = 'video/mp4',
    singlepart: fetchPart = 'video',
    url = null
  } = params;
  if (url) {
    return url;
  }
  const value = instance[tag];
  if (value) {
    if (value.DirectRetrieveURL) {
      return value.DirectRetrieveURL;
    }
    if (value.InlineBinary) {
      const blob = src.utils.b64toBlob(value.InlineBinary, defaultType);
      value.DirectRetrieveURL = URL.createObjectURL(blob);
      return value.DirectRetrieveURL;
    }
    if (!singlepart || singlepart !== true && singlepart.indexOf(fetchPart) === -1) {
      if (value.retrieveBulkData) {
        // Try the specified retrieve type.
        const options = {
          mediaType: defaultType
        };
        return value.retrieveBulkData(options).then(arr => {
          value.DirectRetrieveURL = URL.createObjectURL(new Blob([arr], {
            type: defaultType
          }));
          return value.DirectRetrieveURL;
        });
      }
      console.warn('Unable to retrieve', tag, 'from', instance);
      return undefined;
    }
  }
  return utils_createRenderedRetrieve(config, params) || utils_getBulkdataValue(config, params);
};
/* harmony default export */ const utils_getDirectURL = (getDirectURL);
;// ../../../extensions/default/src/DicomJSONDataSource/index.js





const metadataProvider = src["default"].classes.MetadataProvider;
const mappings = {
  studyInstanceUid: 'StudyInstanceUID',
  patientId: 'PatientID'
};
let _store = {
  urls: [],
  studyInstanceUIDMap: new Map() // map of urls to array of study instance UIDs
  // {
  //   url: url1
  //   studies: [Study1, Study2], // if multiple studies
  // }
  // {
  //   url: url2
  //   studies: [Study1],
  // }
  // }
};
function wrapSequences(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Recursively wrap sequences for nested objects
      acc[key] = wrapSequences(obj[key]);
    } else {
      acc[key] = obj[key];
    }
    if (key.endsWith('Sequence')) {
      acc[key] = src["default"].utils.addAccessors(acc[key]);
    }
    return acc;
  }, Array.isArray(obj) ? [] : {});
}
const getMetaDataByURL = url => {
  return _store.urls.find(metaData => metaData.url === url);
};
const findStudies = (key, value) => {
  let studies = [];
  _store.urls.map(metaData => {
    metaData.studies.map(aStudy => {
      if (aStudy[key] === value) {
        studies.push(aStudy);
      }
    });
  });
  return studies;
};
function createDicomJSONApi(dicomJsonConfig) {
  const implementation = {
    initialize: async ({
      query,
      url
    }) => {
      if (!url) {
        url = query.get('url');
      }
      let metaData = getMetaDataByURL(url);

      // if we have already cached the data from this specific url
      // We are only handling one StudyInstanceUID to run; however,
      // all studies for patientID will be put in the correct tab
      if (metaData) {
        return metaData.studies.map(aStudy => {
          return aStudy.StudyInstanceUID;
        });
      }
      const response = await fetch(url);
      const data = await response.json();
      let StudyInstanceUID;
      let SeriesInstanceUID;
      data.studies.forEach(study => {
        StudyInstanceUID = study.StudyInstanceUID;
        study.series.forEach(series => {
          SeriesInstanceUID = series.SeriesInstanceUID;
          series.instances.forEach(instance => {
            const {
              metadata: naturalizedDicom
            } = instance;
            const imageId = getImageId({
              instance,
              config: dicomJsonConfig
            });
            const {
              query
            } = query_string.parseUrl(instance.url);

            // Add imageId specific mapping to this data as the URL isn't necessarily WADO-URI.
            metadataProvider.addImageIdToUIDs(imageId, {
              StudyInstanceUID,
              SeriesInstanceUID,
              SOPInstanceUID: naturalizedDicom.SOPInstanceUID,
              frameNumber: query.frame ? parseInt(query.frame) : undefined
            });
          });
        });
      });
      _store.urls.push({
        url,
        studies: [...data.studies]
      });
      _store.studyInstanceUIDMap.set(url, data.studies.map(study => study.StudyInstanceUID));
    },
    query: {
      studies: {
        mapParams: () => {},
        search: async param => {
          const [key, value] = Object.entries(param)[0];
          const mappedParam = mappings[key];

          // todo: should fetch from dicomMetadataStore
          const studies = findStudies(mappedParam, value);
          return studies.map(aStudy => {
            return {
              accession: aStudy.AccessionNumber,
              date: aStudy.StudyDate,
              description: aStudy.StudyDescription,
              instances: aStudy.NumInstances,
              modalities: aStudy.Modalities,
              mrn: aStudy.PatientID,
              patientName: aStudy.PatientName,
              studyInstanceUid: aStudy.StudyInstanceUID,
              NumInstances: aStudy.NumInstances,
              time: aStudy.StudyTime
            };
          });
        },
        processResults: () => {
          console.warn(' DICOMJson QUERY processResults not implemented');
        }
      },
      series: {
        // mapParams: mapParams.bind(),
        search: () => {
          console.warn(' DICOMJson QUERY SERIES SEARCH not implemented');
        }
      },
      instances: {
        search: () => {
          console.warn(' DICOMJson QUERY instances SEARCH not implemented');
        }
      }
    },
    retrieve: {
      /**
       * Generates a URL that can be used for direct retrieve of the bulkdata
       *
       * @param {object} params
       * @param {string} params.tag is the tag name of the URL to retrieve
       * @param {string} params.defaultPath path for the pixel data url
       * @param {object} params.instance is the instance object that the tag is in
       * @param {string} params.defaultType is the mime type of the response
       * @param {string} params.singlepart is the type of the part to retrieve
       * @param {string} params.fetchPart unknown?
       * @returns an absolute URL to the resource, if the absolute URL can be retrieved as singlepart,
       *    or is already retrieved, or a promise to a URL for such use if a BulkDataURI
       */
      directURL: params => {
        return utils_getDirectURL(dicomJsonConfig, params);
      },
      series: {
        metadata: async ({
          filters,
          StudyInstanceUID,
          madeInClient = false,
          customSort
        } = {}) => {
          if (!StudyInstanceUID) {
            throw new Error('Unable to query for SeriesMetadata without StudyInstanceUID');
          }
          const study = findStudies('StudyInstanceUID', StudyInstanceUID)[0];
          let series;
          if (customSort) {
            series = customSort(study.series);
          } else {
            series = study.series;
          }
          const seriesKeys = ['SeriesInstanceUID', 'SeriesInstanceUIDs', 'seriesInstanceUID', 'seriesInstanceUIDs'];
          const seriesFilter = seriesKeys.find(key => filters[key]);
          if (seriesFilter) {
            const seriesUIDs = filters[seriesFilter];
            series = series.filter(s => seriesUIDs.includes(s.SeriesInstanceUID));
          }
          const seriesSummaryMetadata = series.map(series => {
            const seriesSummary = {
              StudyInstanceUID: study.StudyInstanceUID,
              ...series
            };
            delete seriesSummary.instances;
            return seriesSummary;
          });

          // Async load series, store as retrieved
          function storeInstances(naturalizedInstances) {
            src.DicomMetadataStore.addInstances(naturalizedInstances, madeInClient);
          }
          src.DicomMetadataStore.addSeriesMetadata(seriesSummaryMetadata, madeInClient);
          function setSuccessFlag() {
            const study = src.DicomMetadataStore.getStudy(StudyInstanceUID, madeInClient);
            study.isLoaded = true;
          }
          const numberOfSeries = series.length;
          series.forEach((series, index) => {
            const instances = series.instances.map(instance => {
              // for instance.metadata if the key ends with sequence then
              // we need to add a proxy to the first item in the sequence
              // so that we can access the value of the sequence
              // by using sequenceName.value
              const modifiedMetadata = wrapSequences(instance.metadata);
              const obj = {
                ...modifiedMetadata,
                url: instance.url,
                imageId: getImageId({
                  instance,
                  config: dicomJsonConfig
                }),
                ...series,
                ...study
              };
              delete obj.instances;
              delete obj.series;
              return obj;
            });
            storeInstances(instances);
            if (index === numberOfSeries - 1) {
              setSuccessFlag();
            }
          });
        }
      }
    },
    store: {
      dicom: () => {
        console.warn(' DICOMJson store dicom not implemented');
      }
    },
    getImageIdsForDisplaySet(displaySet) {
      const images = displaySet.images;
      const imageIds = [];
      if (!images) {
        return imageIds;
      }
      const {
        StudyInstanceUID,
        SeriesInstanceUID
      } = displaySet;
      const study = findStudies('StudyInstanceUID', StudyInstanceUID)[0];
      const series = study.series.find(s => s.SeriesInstanceUID === SeriesInstanceUID) || {};
      const instanceMap = new Map();
      if (series.instances) {
        series.instances.forEach(instance => {
          if (instance?.metadata?.SOPInstanceUID) {
            const {
              metadata,
              url
            } = instance;
            const existingInstances = instanceMap.get(metadata.SOPInstanceUID) || [];
            existingInstances.push({
              ...metadata,
              url
            });
            instanceMap.set(metadata.SOPInstanceUID, existingInstances);
          }
        });
      }
      displaySet.images.forEach(instance => {
        const NumberOfFrames = instance.NumberOfFrames || 1;
        const instances = instanceMap.get(instance.SOPInstanceUID) || [instance];
        for (let i = 0; i < NumberOfFrames; i++) {
          const imageId = getImageId({
            instance: instances[Math.min(i, instances.length - 1)],
            frame: NumberOfFrames > 1 ? i : undefined,
            config: dicomJsonConfig
          });
          imageIds.push(imageId);
        }
      });
      return imageIds;
    },
    getImageIdsForInstance({
      instance,
      frame
    }) {
      const imageIds = getImageId({
        instance,
        frame
      });
      return imageIds;
    },
    getStudyInstanceUIDs: ({
      params,
      query
    }) => {
      const url = query.get('url');
      return _store.studyInstanceUIDMap.get(url);
    }
  };
  return src.IWebApiDataSource.create(implementation);
}

// EXTERNAL MODULE: ../../../node_modules/dcmjs/build/dcmjs.es.js
var dcmjs_es = __webpack_require__(5842);
;// ../../../extensions/default/src/DicomLocalDataSource/index.js



const DicomLocalDataSource_metadataProvider = src["default"].classes.MetadataProvider;
const {
  EVENTS
} = src.DicomMetadataStore;
const END_MODALITIES = {
  SR: true,
  SEG: true,
  DOC: true
};
const compareValue = (v1, v2, def = 0) => {
  if (v1 === v2) {
    return def;
  }
  if (v1 < v2) {
    return -1;
  }
  return 1;
};

// Sorting SR modalities to be at the end of series list
const customSort = (seriesA, seriesB) => {
  const instanceA = seriesA.instances[0];
  const instanceB = seriesB.instances[0];
  const modalityA = instanceA.Modality;
  const modalityB = instanceB.Modality;
  const isEndA = END_MODALITIES[modalityA];
  const isEndB = END_MODALITIES[modalityB];
  if (isEndA && isEndB) {
    // Compare by series date
    return compareValue(instanceA.SeriesNumber, instanceB.SeriesNumber);
  }
  if (!isEndA && !isEndB) {
    return compareValue(instanceB.SeriesNumber, instanceA.SeriesNumber);
  }
  return isEndA ? -1 : 1;
};
function createDicomLocalApi(dicomLocalConfig) {
  const {
    name
  } = dicomLocalConfig;
  const implementation = {
    initialize: ({
      params,
      query
    }) => {},
    query: {
      studies: {
        mapParams: () => {},
        search: params => {
          const studyUIDs = src.DicomMetadataStore.getStudyInstanceUIDs();
          return studyUIDs.map(StudyInstanceUID => {
            let numInstances = 0;
            const modalities = new Set();

            // Calculating the number of instances in the study and modalities
            // present in the study
            const study = src.DicomMetadataStore.getStudy(StudyInstanceUID);
            study.series.forEach(aSeries => {
              numInstances += aSeries.instances.length;
              modalities.add(aSeries.instances[0].Modality);
            });

            // first instance in the first series
            const firstInstance = study?.series[0]?.instances[0];
            if (firstInstance) {
              return {
                accession: firstInstance.AccessionNumber,
                date: firstInstance.StudyDate,
                description: firstInstance.StudyDescription,
                mrn: firstInstance.PatientID,
                patientName: src.utils.formatPN(firstInstance.PatientName),
                studyInstanceUid: firstInstance.StudyInstanceUID,
                time: firstInstance.StudyTime,
                //
                instances: numInstances,
                modalities: Array.from(modalities).join('/'),
                NumInstances: numInstances
              };
            }
          });
        },
        processResults: () => {
          console.warn(' DICOMLocal QUERY processResults not implemented');
        }
      },
      series: {
        search: studyInstanceUID => {
          const study = src.DicomMetadataStore.getStudy(studyInstanceUID);
          return study.series.map(aSeries => {
            const firstInstance = aSeries?.instances[0];
            return {
              studyInstanceUid: studyInstanceUID,
              seriesInstanceUid: firstInstance.SeriesInstanceUID,
              modality: firstInstance.Modality,
              seriesNumber: firstInstance.SeriesNumber,
              seriesDate: firstInstance.SeriesDate,
              numSeriesInstances: aSeries.instances.length,
              description: firstInstance.SeriesDescription
            };
          });
        }
      },
      instances: {
        search: () => {
          console.warn(' DICOMLocal QUERY instances SEARCH not implemented');
        }
      }
    },
    retrieve: {
      directURL: params => {
        const {
          instance,
          tag,
          defaultType
        } = params;
        const value = instance[tag];
        if (value instanceof Array && value[0] instanceof ArrayBuffer) {
          return URL.createObjectURL(new Blob([value[0]], {
            type: defaultType
          }));
        }
      },
      series: {
        metadata: async ({
          StudyInstanceUID,
          madeInClient = false
        } = {}) => {
          if (!StudyInstanceUID) {
            throw new Error('Unable to query for SeriesMetadata without StudyInstanceUID');
          }

          // Instances metadata already added via local upload
          const study = src.DicomMetadataStore.getStudy(StudyInstanceUID, madeInClient);

          // Series metadata already added via local upload
          src.DicomMetadataStore._broadcastEvent(EVENTS.SERIES_ADDED, {
            StudyInstanceUID,
            madeInClient
          });
          study.series.forEach(aSeries => {
            const {
              SeriesInstanceUID
            } = aSeries;
            const isMultiframe = aSeries.instances[0].NumberOfFrames > 1;
            aSeries.instances.forEach((instance, index) => {
              const {
                url: imageId,
                StudyInstanceUID,
                SeriesInstanceUID,
                SOPInstanceUID
              } = instance;
              instance.imageId = imageId;

              // Add imageId specific mapping to this data as the URL isn't necessarily WADO-URI.
              DicomLocalDataSource_metadataProvider.addImageIdToUIDs(imageId, {
                StudyInstanceUID,
                SeriesInstanceUID,
                SOPInstanceUID,
                frameIndex: isMultiframe ? index : 1
              });
            });
            src.DicomMetadataStore._broadcastEvent(EVENTS.INSTANCES_ADDED, {
              StudyInstanceUID,
              SeriesInstanceUID,
              madeInClient
            });
          });
        }
      }
    },
    store: {
      dicom: naturalizedReport => {
        const reportBlob = dcmjs_es/* default.data */.Ay.data.datasetToBlob(naturalizedReport);

        //Create a URL for the binary.
        var objectUrl = URL.createObjectURL(reportBlob);
        window.location.assign(objectUrl);
      }
    },
    getImageIdsForDisplaySet(displaySet) {
      const images = displaySet.images;
      const imageIds = [];
      if (!images) {
        return imageIds;
      }
      displaySet.images.forEach(instance => {
        const NumberOfFrames = instance.NumberOfFrames;
        if (NumberOfFrames > 1) {
          // in multiframe we start at frame 1
          for (let i = 1; i <= NumberOfFrames; i++) {
            const imageId = this.getImageIdsForInstance({
              instance,
              frame: i
            });
            imageIds.push(imageId);
          }
        } else {
          const imageId = this.getImageIdsForInstance({
            instance
          });
          imageIds.push(imageId);
        }
      });
      return imageIds;
    },
    getImageIdsForInstance({
      instance,
      frame
    }) {
      // Important: Never use instance.imageId because it might be multiframe,
      // which would make it an invalid imageId.
      // if (instance.imageId) {
      //   return instance.imageId;
      // }

      const {
        StudyInstanceUID,
        SeriesInstanceUID
      } = instance;
      const SOPInstanceUID = instance.SOPInstanceUID || instance.SopInstanceUID;
      const storedInstance = src.DicomMetadataStore.getInstance(StudyInstanceUID, SeriesInstanceUID, SOPInstanceUID);
      let imageId = storedInstance.url;
      if (frame !== undefined) {
        imageId += `&frame=${frame}`;
      }
      return imageId;
    },
    deleteStudyMetadataPromise() {
      console.log('deleteStudyMetadataPromise not implemented');
    },
    getStudyInstanceUIDs: ({
      params,
      query
    }) => {
      const {
        StudyInstanceUIDs: paramsStudyInstanceUIDs
      } = params;
      const queryStudyInstanceUIDs = query.getAll('StudyInstanceUIDs');
      const StudyInstanceUIDs = queryStudyInstanceUIDs || paramsStudyInstanceUIDs;
      const StudyInstanceUIDsAsArray = StudyInstanceUIDs && Array.isArray(StudyInstanceUIDs) ? StudyInstanceUIDs : [StudyInstanceUIDs];

      // Put SRs at the end of series list to make sure images are loaded first
      let isStudyInCache = false;
      StudyInstanceUIDsAsArray.forEach(StudyInstanceUID => {
        const study = src.DicomMetadataStore.getStudy(StudyInstanceUID);
        if (study) {
          study.series = study.series.sort(customSort);
          isStudyInCache = true;
        }
      });
      return isStudyInCache ? StudyInstanceUIDsAsArray : [];
    }
  };
  return src.IWebApiDataSource.create(implementation);
}

// EXTERNAL MODULE: ../../../node_modules/axios/index.js + 49 modules
var axios = __webpack_require__(17739);
// EXTERNAL MODULE: ../../../node_modules/crypto-js/sha1.js
var sha1 = __webpack_require__(66297);
var sha1_default = /*#__PURE__*/__webpack_require__.n(sha1);
// EXTERNAL MODULE: ../../core/src/utils/sortStudy.ts
var sortStudy = __webpack_require__(45476);
;// ../../../extensions/default/src/DatabricksPixelsDicom/utils.js


const {
  getString,
  getName,
  getModalities
} = src.DICOMWeb;
const SQL_STATEMENT_API = "sql/statements/";
function processResults(qidoStudies) {
  if (!qidoStudies || !qidoStudies.length) {
    return [];
  }
  const studies = [];
  qidoStudies.forEach(qidoStudy => {
    studies.push({
      studyInstanceUid: getString(JSON.parse(qidoStudy[0])),
      date: qidoStudy[1] || '',
      // YYYYMMDD
      accession: qidoStudy[2] || '',
      // short string, probably a number?
      mrn: qidoStudy[3] || '',
      // medicalRecordNumber
      patientName: qidoStudy[4] && qidoStudy[4].includes("Alphabetic") ? src.utils.formatPN(getName(JSON.parse(qidoStudy[4]))) : "",
      description: getString(JSON.parse(qidoStudy[5])) || '',
      modalities: qidoStudy[6] + qidoStudy[7],
      instances: Number(JSON.parse(qidoStudy[8])) || 1 // number
    });
  });
  return studies;
}
function processSeriesMetadataResults(qidoSeriesMetadata) {
  if (!qidoSeriesMetadata || !qidoSeriesMetadata.length) {
    return [];
  }
  const series = [];
  qidoSeriesMetadata.forEach(currentSerie => {
    var serie = {
      StudyInstanceUid: currentSerie[0],
      SeriesInstanceUid: currentSerie[1],
      instances: JSON.parse(currentSerie[2])
    };
    serie.instances.sort((a, b) => {
      const sliceLocA = parseInt(JSON.parse(a.meta)['00201041']?.Value?.[0]) || 0;
      const sliceLocB = parseInt(JSON.parse(b.meta)['00201041']?.Value?.[0]) || 0;
      return sliceLocA - sliceLocB;
    });
    serie.instances.forEach((instance, index) => {
      instance.StudyInstanceUID = serie.StudyInstanceUid;
      instance.SeriesInstanceUID = serie.SeriesInstanceUid;
      instance.GeneratedInstanceNumber = index;
      instance.numImageFrames = serie.instances.length;
      instance.meta = JSON.parse(instance.meta);
    });
    series.push(serie);
  });
  return series;
}
function processSeriesResults(qidoSeries) {
  const series = [];
  if (qidoSeries && qidoSeries.length) {
    qidoSeries.forEach(qidoSeries => series.push({
      studyInstanceUid: getString(JSON.parse(qidoSeries[0])),
      seriesInstanceUid: getString(JSON.parse(qidoSeries[1])),
      modality: getString(JSON.parse(qidoSeries[2])),
      seriesNumber: getString(JSON.parse(qidoSeries[3])),
      description: getString(JSON.parse(qidoSeries[4])),
      numSeriesInstances: Number(JSON.parse(qidoSeries[5]))
    }));
  }
  (0,sortStudy/* sortStudySeries */.LM)(series);
  return series;
}
async function qidoStudiesSearch(databricksClient, warehouseId, pixelsTable, origParams) {
  //var limit = origParams.resultsPerPage ? `LIMIT ${origParams.resultsPerPage}` : "";
  //var offset = origParams.offset ? `OFFSET ${origParams.offset}` : "";

  let filters = ["meta:[ '0020000D' ]::String is not Null"];
  if ("patientName" in origParams) {
    filters.push(`lower(meta:['00100010'].Value::String) like lower('%${origParams.patientName}%')`);
  }
  if ("patientId" in origParams && "pageNumber" in origParams) {
    filters.push(`meta:['00100020'].Value[0]::String like '${origParams.patientId}%'`);
  }
  if ("accessionNumber" in origParams) {
    filters.push(`meta:['00080050'].Value[0]::String like '${origParams.accessionNumber}%'`);
  }
  if ("studyDescription" in origParams) {
    filters.push(`lower(meta:['00081030'].Value::String) like lower('%${origParams.studyDescription}%')`);
  }
  if ("modalitiesInStudy" in origParams) {
    filters.push(`(meta:['00080060'].Value[0]::String in ('${origParams.modalitiesInStudy.join("','")}') OR
                  meta:['00080061'].Value[0]::String in ('${origParams.modalitiesInStudy.join("','")}'))`);
  }
  if ("startDate" in origParams) {
    filters.push(`'${origParams.startDate}' <= meta:['00080020'].Value[0]::String`);
  }
  if ("endDate" in origParams) {
    filters.push(`'${origParams.endDate}' >= meta:['00080020'].Value[0]::String`);
  }
  let body = {
    "warehouse_id": warehouseId,
    "statement": `select
        meta: ['0020000D']::String as studyInstanceUid,
        nullif(meta: ['00080020'].Value[0]::String, '') as date,
        nullif(meta: ['00080050'].Value[0]::String, '') as accession,
        nullif(meta: ['00100020'].Value[0]::String, '') as mrn,
        first(meta: ['00100010']::String, true) as patientName,
        first(meta: ['00081030']::String, true) as description,
        array_join(collect_set(nullif(meta:['00080060'].Value[0]::String, '')), '/') as modalities1,
        array_join(collect_set(nullif(meta:['00080061'].Value[0]::String, '')), '/') as modalities2,
        count(*) as instances
       FROM ${pixelsTable}
       WHERE ${filters.join(" AND ")}
       GROUP BY studyInstanceUid, date, accession, mrn
       `,
    "wait_timeout": "30s",
    "on_wait_timeout": "CANCEL"
  };
  const result = await databricksClient.post(SQL_STATEMENT_API, body);
  if (result.data.status.state === "FAILED") {
    throw new Error(result.data.status.error.message);
  }
  return result.data.result.data_array;
}
async function qidoSeriesSearch(databricksClient, warehouseId, studyInstanceUid, pixelsTable) {
  let body = {
    "warehouse_id": warehouseId,
    "statement": `SELECT *, count(*) as numSeriesInstances from (
      SELECT
        meta:['0020000D']::String as studyInstanceUid,
        meta:['0020000E']::String as seriesInstanceUid,
        meta:['00080060']::String as modality,
        meta:['00200011']::String as seriesNumber,
        meta:['0008103E']::String as description
        FROM ${pixelsTable}
        WHERE meta:['0020000D'].Value[0]::String = '${studyInstanceUid}')
      group by studyInstanceUid, seriesInstanceUid, modality, seriesNumber, seriesInstanceUid, description`,
    "wait_timeout": "30s",
    "on_wait_timeout": "CANCEL"
  };
  const result = await databricksClient.post(SQL_STATEMENT_API, body);
  if (result.data.status.state === "FAILED") {
    throw new Error(result.data.status.error.message);
  }
  return result.data.result.data_array;
}
async function qidoSeriesMetadataSearch(databricksClient, warehouseId, studyInstanceUid, pixelsTable) {
  var to_return = [];
  let body = {
    "warehouse_id": warehouseId,
    "statement": `
      with qico(
        SELECT
              meta:['0020000D'].Value[0]::String as StudyInstanceUID,
              meta:['0020000E'].Value[0]::String as SeriesInstanceUID,
              meta:['00080018'].Value[0]::String as SOPInstanceUID,
              meta:['00080016'].Value[0]::String as SOPClassUID,
              meta,
              relative_path
        FROM ${pixelsTable}
      )

      select StudyInstanceUID, SeriesInstanceUID, collect_list(
        struct(SOPInstanceUID,
              SOPClassUID,
              meta,
              relative_path)
      ) from qico
        WHERE studyInstanceUid = '${studyInstanceUid}'
        group by studyInstanceUid, seriesInstanceUid`,
    "wait_timeout": "30s",
    "on_wait_timeout": "CANCEL"
  };
  var result = await databricksClient.post(SQL_STATEMENT_API, body);
  if (result.data.status.state === "FAILED") {
    throw new Error(result.data.status.error.message);
  }
  to_return = result.data.result.data_array;
  while (result.data.result?.next_chunk_internal_link) {
    result = await databricksClient.get(result.data.result.next_chunk_internal_link.split("/api/2.0/")[1]);
    to_return = to_return.concat(result.data.data_array);
  }
  return to_return;
}
async function persistMetadata(databricksClient, warehouseId, pixelsTable, dataset) {
  let body = {
    "warehouse_id": warehouseId,
    "statement": `INSERT INTO ${pixelsTable}
  (path, modificationTime, length, original_path, relative_path, local_path,
   extension, file_type, path_tags, is_anon, meta)
  VALUES (
   'dbfs:/${dataset.path}',  to_timestamp(unix_timestamp('${dataset.datetime}', 'yyyyMMddHHmmss')), '${dataset.length}', 'dbfs:/${dataset.path}', '${dataset.path}', '/${dataset.path}',
   'dcm', '', array(), 'true', parse_json('${dataset.meta}'))`,
    "wait_timeout": "30s",
    "on_wait_timeout": "CANCEL"
  };

  //console.log(body)
  const result = await databricksClient.post(SQL_STATEMENT_API, body);
  if (result.data.status.state === "FAILED") {
    throw new Error(result.data.status.error.message);
  }
  return result;
}

/**
 *
 * @param {string} studyInstanceUID - ID of study to return a list of series for
 * @returns {Promise} - Resolves SeriesMetadata[] in study
 */
function seriesInStudy(dicomWebClient, studyInstanceUID) {
  // Series Description
  // Already included?
  const commaSeparatedFields = ['0008103E', '00080021'].join(',');
  const queryParams = {
    includefield: commaSeparatedFields
  };
  return dicomWebClient.searchForSeries({
    studyInstanceUID,
    queryParams
  });
}

/**
 * Produces a QIDO URL given server details and a set of specified search filter
 * items
 *
 * @param filter
 * @param serverSupportsQIDOIncludeField
 * @returns {string} The URL with encoded filter query data
 */
function mapParams(params, options = {}) {
  if (!params) {
    return;
  }
  const commaSeparatedFields = ['00081030',
  // Study Description
  '00080060' // Modality
  // Add more fields here if you want them in the result
  ].join(',');
  const {
    supportsWildcard
  } = options;
  const withWildcard = value => {
    return supportsWildcard && value ? `*${value}*` : value;
  };
  const parameters = {
    // Named
    PatientName: withWildcard(params.patientName),
    //PatientID: withWildcard(params.patientId),
    '00100020': withWildcard(params.patientId),
    // Temporarily to make the tests pass with dicomweb-server.. Apparently it's broken?
    AccessionNumber: withWildcard(params.accessionNumber),
    StudyDescription: withWildcard(params.studyDescription),
    ModalitiesInStudy: params.modalitiesInStudy,
    // Other
    limit: params.limit || 101,
    offset: params.offset || 0,
    fuzzymatching: options.supportsFuzzyMatching === true,
    includefield: commaSeparatedFields // serverSupportsQIDOIncludeField ? commaSeparatedFields : 'all',
  };

  // build the StudyDate range parameter
  if (params.startDate && params.endDate) {
    parameters.StudyDate = `${params.startDate}-${params.endDate}`;
  } else if (params.startDate) {
    const today = new Date();
    const DD = String(today.getDate()).padStart(2, '0');
    const MM = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const YYYY = today.getFullYear();
    const todayStr = `${YYYY}${MM}${DD}`;
    parameters.StudyDate = `${params.startDate}-${todayStr}`;
  } else if (params.endDate) {
    const oldDateStr = `19700102`;
    parameters.StudyDate = `${oldDateStr}-${params.endDate}`;
  }

  // Build the StudyInstanceUID parameter
  if (params.studyInstanceUid) {
    let studyUids = params.studyInstanceUid;
    studyUids = Array.isArray(studyUids) ? studyUids.join() : studyUids;
    studyUids = studyUids.replace(/[^0-9.]+/g, '\\');
    parameters.StudyInstanceUID = studyUids;
  }

  // Clean query params of undefined values.
  const final = {};
  Object.keys(parameters).forEach(key => {
    if (parameters[key] !== undefined && parameters[key] !== '') {
      final[key] = parameters[key];
    }
  });
  return final;
}

// EXTERNAL MODULE: ../../../extensions/default/src/DatabricksPixelsDicom/StaticWadoClient.ts + 2 modules
var StaticWadoClient = __webpack_require__(34551);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/dicom-image-loader/dist/esm/index.js + 76 modules
var dist_esm = __webpack_require__(79453);
;// ../../../extensions/default/src/DatabricksPixelsDicom/multiframeImageLoader.js
/**
 * Multiframe DICOM Image Loader for Cornerstone3D
 * 
 * This loader fetches DICOM frames from a custom data source (Databricks)
 * and uses @cornerstonejs/dicom-image-loader to decode pixel data.
 * 
 * METADATA HANDLING:
 * ==================
 * - Uses dcmjs to naturalize DICOM metadata (converts tag format to friendly property names)
 * - Registers metadata with Cornerstone's metadata provider
 * - Supports both 'instance' and 'imagePlaneModule' metadata types
 * - Extracts Transfer Syntax UID from metadata
 * 
 * PIXEL DATA DECODING:
 * ====================
 * - All decoding is performed by @cornerstonejs/dicom-image-loader
 * - Uses Transfer Syntax UID from metadata to determine decoding method
 * - Supports all standard DICOM transfer syntaxes including compressed formats
 * - The dicom-image-loader handles codec initialization and web worker management
 */





// Extract dcmjs utilities
const {
  DicomMetaDictionary
} = dcmjs_es/* default.data */.Ay.data;
const {
  naturalizeDataset,
  denaturalizeDataset
} = DicomMetaDictionary;
function lowercaseFirstLetterOfKeys(obj) {
  const newObj = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const firstCharLowercased = key.charAt(0).toLowerCase();
      const restOfString = key.slice(1);
      const newKey = firstCharLowercased + restOfString;
      newObj[newKey] = obj[key];
    }
  }
  return newObj;
}

/**
 * Create pixel data info from naturalized DICOM metadata
 * @param {Object} metadata - Naturalized DICOM metadata from dcmjs
 * @param {string} imageId - The image identifier
 * @returns {Object} - Pixel data info object compatible with Cornerstone
 */
function determinePixelDataInfo(metadata, imageId) {
  const {
    bitsAllocated,
    bitsStored,
    pixelRepresentation,
    photometricInterpretation,
    samplesPerPixel,
    rows,
    columns,
    rescaleSlope,
    rescaleIntercept,
    windowCenter,
    windowWidth,
    pixelSpacing,
    smallestImagePixelValue,
    largestImagePixelValue,
    modality
  } = metadata;

  // Determine TypedArray constructor based on bits allocated and pixel representation
  let TypedArrayConstructor;
  let dataType;
  if (bitsAllocated === 8) {
    TypedArrayConstructor = pixelRepresentation === 0 ? Uint8Array : Int8Array;
    dataType = pixelRepresentation === 0 ? 'Uint8Array' : 'Int8Array';
  } else if (bitsAllocated === 16) {
    TypedArrayConstructor = pixelRepresentation === 0 ? Uint16Array : Int16Array;
    dataType = pixelRepresentation === 0 ? 'Uint16Array' : 'Int16Array';
  } else if (bitsAllocated === 32) {
    TypedArrayConstructor = pixelRepresentation === 0 ? Uint32Array : Int32Array;
    dataType = pixelRepresentation === 0 ? 'Uint32Array' : 'Int32Array';
  } else {
    throw new Error(`Unsupported BitsAllocated: ${bitsAllocated}`);
  }

  // Image dimensions
  const pixelsPerFrame = rows * columns;
  const bytesPerPixel = bitsAllocated / 8;
  const sizeInBytes = pixelsPerFrame * bytesPerPixel * samplesPerPixel;

  // Color vs grayscale
  const isColor = samplesPerPixel > 1;

  // Pixel spacing
  const rowPixelSpacing = pixelSpacing?.[0] || 1.0;
  const columnPixelSpacing = pixelSpacing?.[1] || 1.0;

  // Rescale slope and intercept (default to 1 and 0 if not present)
  const slope = rescaleSlope !== undefined ? rescaleSlope : 1;
  const intercept = rescaleIntercept !== undefined ? rescaleIntercept : 0;

  // Window/Level - extract first value if array, otherwise use as-is
  const windowCenterValue = Array.isArray(windowCenter) ? windowCenter[0] : windowCenter;
  const windowWidthValue = Array.isArray(windowWidth) ? windowWidth[0] : windowWidth;

  // Min/Max pixel values
  const minPixelValue = smallestImagePixelValue !== undefined ? smallestImagePixelValue : undefined;
  const maxPixelValue = largestImagePixelValue !== undefined ? largestImagePixelValue : undefined;

  // Prescaling information
  const preScale = {
    enabled: slope !== 1 || intercept !== 0,
    scalingParameters: {
      rescaleSlope: slope,
      rescaleIntercept: intercept,
      modality: modality
    },
    scaled: true
  };

  // Shared cache key
  const sharedCacheKey = imageId.replace(/^[^:]+:/, '');

  // Create imageFrame object for dicom-image-loader
  const imageFrame = {
    samplesPerPixel: samplesPerPixel,
    photometricInterpretation: photometricInterpretation,
    rows: rows,
    columns: columns,
    bitsAllocated: bitsAllocated,
    bitsStored: bitsStored,
    pixelRepresentation: pixelRepresentation,
    smallestPixelValue: minPixelValue,
    largestPixelValue: maxPixelValue,
    imageId: imageId,
    pixelDataLength: pixelsPerFrame,
    preScale: preScale
  };

  // Main pixel data info object compatible with Cornerstone
  const pixelDataInfo = {
    imageId: imageId,
    dataType: dataType,
    color: isColor,
    columnPixelSpacing: columnPixelSpacing,
    columns: columns,
    height: rows,
    preScale: preScale,
    intercept: intercept,
    slope: slope,
    invert: photometricInterpretation === 'MONOCHROME1',
    minPixelValue: minPixelValue,
    maxPixelValue: maxPixelValue,
    rowPixelSpacing: rowPixelSpacing,
    rows: rows,
    sizeInBytes: sizeInBytes,
    width: columns,
    windowCenter: windowCenterValue,
    windowWidth: windowWidthValue,
    imageFrame: imageFrame,
    numberOfComponents: samplesPerPixel,
    sharedCacheKey: sharedCacheKey,
    TypedArrayConstructor: TypedArrayConstructor,
    bytesPerPixel: bytesPerPixel,
    pixelsPerFrame: pixelsPerFrame,
    imageQualityStatus: 8 // 8 = FULLY_QUALITY quality
  };
  return pixelDataInfo;
}

/**
 * Decode pixel data using dicom-image-loader
 * @param {ArrayBuffer} rawPixelData - The raw pixel data
 * @param {Object} metadata - Naturalized DICOM metadata
 * @returns {Promise<Uint8Array|Uint16Array|Int16Array>} - Decoded pixel data
 */
async function decodePixelData(rawPixelData, metadata) {
  const transferSyntaxUID = metadata.transferSyntaxUID;

  // Convert to Uint8Array for decoding
  const pixelDataAsUint8Array = new Uint8Array(rawPixelData);

  // Prescaling information
  const preScale = {
    enabled: metadata.rescaleSlope !== 1 || metadata.rescaleIntercept !== 0,
    scalingParameters: {
      rescaleSlope: metadata.rescaleSlope,
      rescaleIntercept: metadata.rescaleIntercept,
      modality: metadata.modality
    },
    scaled: true
  };
  try {
    // Use dicom-image-loader's decodeImageFrame function
    const decodedImageFrame = await dist_esm/* decodeImageFrame */.pM(metadata,
    // Frame metadata object
    transferSyntaxUID,
    // Transfer syntax UID
    pixelDataAsUint8Array,
    // Pixel data as Uint8Array
    undefined,
    // Canvas (optional)
    {
      // Options object
      preScale: preScale
    });

    // Extract the decoded pixel data
    return decodedImageFrame.pixelData || decodedImageFrame;
  } catch (error) {
    console.error('Failed to decode DICOM image:', {
      error: error.message,
      transferSyntaxUID,
      dataSize: rawPixelData.byteLength,
      dimensions: `${metadata.rows}x${metadata.columns}`,
      bitsAllocated: metadata.bitsAllocated,
      photometricInterpretation: metadata.photometricInterpretation
    });
    throw new Error(`Failed to decode image: ${error.message}. Transfer Syntax: ${transferSyntaxUID}`);
  }
}
function applyRescaling(pixelData, slope, intercept) {
  if (slope === 1 && intercept === 0) {
    return pixelData;
  }
  const scaledData = new Float32Array(pixelData.length);
  for (let i = 0; i < pixelData.length; i++) {
    scaledData[i] = pixelData[i] * slope + intercept;
  }
  return scaledData;
}
class MultiframeImageLoaderService {
  constructor() {
    this.name = 'MultiframeImageLoaderService';
    this.cache = new Map();
  }
  initialize() {
    // Registra il loader quando il servizio viene inizializzato
    esm.registerImageLoader('multiframe', this.loadImage.bind(this));
    console.log('Multiframe Image Loader registered');
  }
  loadImage(imageId) {
    return new Promise((resolve, reject) => {
      const [fileUrl, frameNumber] = imageId.split('&frame=');

      // Check cache first
      const cacheKey = `${fileUrl}_${frameNumber}`;
      if (this.cache.has(cacheKey)) {
        resolve(this.cache.get(cacheKey));
        return;
      }

      // Fetch frame data
      this.fetchFrame(fileUrl, frameNumber).then(image => {
        this.cache.set(cacheKey, image);
        resolve(image);
      }).catch(reject);
    });
  }
  async fetchFrame(fileUrl, frameNumber) {
    try {
      const fullImageId = `${fileUrl}&frame=${frameNumber}`;

      // Check if metadata already loaded for this imageId
      let metadata = esm.metaData.get('full_instance', fullImageId);
      if (!metadata || !metadata.transferSyntaxUID) {
        // Fetch raw metadata from Databricks
        const metadataUrl = fileUrl.replace('multiframe:', '').replace("/files/", "/files_metadata/");
        const metadataResponse = await fetch(metadataUrl);
        if (!metadataResponse.ok) {
          throw new Error(`Failed to fetch metadata: ${metadataResponse.status} ${metadataResponse.statusText}`);
        }
        const rawMetadata = await metadataResponse.json();

        // Naturalize metadata using dcmjs
        // This converts DICOM tag format to friendly property names
        metadata = lowercaseFirstLetterOfKeys(naturalizeDataset(rawMetadata));
        if (!metadata.transferSyntaxUID) {
          throw new Error('TransferSyntaxUID not found in metadata');
        }

        // Register metadata provider with Cornerstone
        // This makes metadata available for all frames of this multiframe image
        esm.metaData.addProvider((type, imageId) => {
          // Match imageIds that start with this fileUrl
          if (imageId && imageId.startsWith(fileUrl)) {
            if (type === 'full_instance') {
              return metadata;
            }
            if (type === 'transferSyntax') {
              return metadata.transferSyntaxUID;
            }
            return undefined;
          }
        });
      }
      const pixelDataInfo = determinePixelDataInfo(metadata, `${fileUrl}&frame=${frameNumber}`);

      // Fetch pixel data from Databricks
      const pixelDataUrl = `${fileUrl.replace('multiframe:', '')}&frame=${frameNumber}`;
      const frameResponse = await fetch(pixelDataUrl);
      if (!frameResponse.ok) {
        throw new Error(`Failed to fetch pixel data: ${frameResponse.status} ${frameResponse.statusText}`);
      }
      const rawPixelData = await frameResponse.arrayBuffer();

      // Convert raw pixel data to the correct typed array
      // This will automatically decode compressed data using dicom-image-loader
      const typedPixelData = await decodePixelData(rawPixelData, metadata);
      let processedPixelData = typedPixelData;
      if (pixelDataInfo.preScale.enabled) {
        processedPixelData = applyRescaling(typedPixelData, pixelDataInfo.slope, pixelDataInfo.intercept);
      }
      pixelDataInfo.getPixelData = () => processedPixelData;
      return pixelDataInfo;
    } catch (error) {
      console.error('Error in fetchFrame:', {
        fileUrl,
        frameNumber,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
}
/* harmony default export */ const multiframeImageLoader = (MultiframeImageLoaderService);
;// ../../../extensions/default/src/DatabricksPixelsDicom/index.js









const DatabricksPixelsDicom_metadataProvider = src["default"].classes.MetadataProvider;
const {
  DicomMetaDictionary: DatabricksPixelsDicom_DicomMetaDictionary,
  DicomDict
} = dcmjs_es/* default.data */.Ay.data;
const {
  naturalizeDataset: DatabricksPixelsDicom_naturalizeDataset,
  denaturalizeDataset: DatabricksPixelsDicom_denaturalizeDataset
} = DatabricksPixelsDicom_DicomMetaDictionary;
const DatabricksPixelsDicom_END_MODALITIES = {
  SR: true,
  SEG: true,
  DOC: true
};
const DatabricksPixelsDicom_compareValue = (v1, v2, def = 0) => {
  if (v1 === v2) {
    return def;
  }
  if (v1 < v2) {
    return -1;
  }
  return 1;
};

// Sorting SR modalities to be at the end of series list
const DatabricksPixelsDicom_customSort = (seriesA, seriesB) => {
  const instanceA = seriesA.instances[0];
  const instanceB = seriesB.instances[0];
  const modalityA = instanceA.Modality;
  const modalityB = instanceB.Modality;
  const isEndA = DatabricksPixelsDicom_END_MODALITIES[modalityA];
  const isEndB = DatabricksPixelsDicom_END_MODALITIES[modalityB];
  if (isEndA && isEndB) {
    // Compare by series date
    return DatabricksPixelsDicom_compareValue(instanceA.SeriesNumber, instanceB.SeriesNumber);
  }
  if (!isEndA && !isEndB) {
    return DatabricksPixelsDicom_compareValue(instanceB.SeriesNumber, instanceA.SeriesNumber);
  }
  return isEndA ? -1 : 1;
};
function createDatabricksPixelsDicom(dcmConfig, servicesManager) {
  let dicomConfig, databricksClient, warehouseId, wadoDicomWebClient;
  console.info("createDatabricksPixelsDicom");
  const implementation = {
    initialize: async ({
      params,
      query
    }) => {
      esm.registerImageLoader('multiframe', (imageId, options) => {
        const loader = new multiframeImageLoader();
        return {
          promise: loader.loadImage(imageId)
        };
      });
      console.info("createDatabricksPixelsDicom - Initialize");
      dicomConfig = JSON.parse(JSON.stringify(dcmConfig));
      if (!dicomConfig.token || !dicomConfig.serverHostname || !dicomConfig.httpPath || !dicomConfig.pixelsTable) {
        throw new Error("Cannot find Server Hostname, HTTP Path, or " + "personal access token. " + "Check the environment variables DATABRICKS_SERVER_HOSTNAME, " + "DATABRICKS_HTTP_PATH, DATABRICKS_TOKEN and pixelsTable.");
      }
      const connectOptions = {
        token: dicomConfig.token,
        host: dicomConfig.serverHostname,
        path: dicomConfig.httpPath
      };
      databricksClient = axios/* default */.Ay.create({
        baseURL: connectOptions.host + "/api/2.0/"
      });
      databricksClient.defaults.headers.common['Authorization'] = `Bearer ${connectOptions.token}`;
      const userAuthenticationService = servicesManager.services.userAuthenticationService;
      userAuthenticationService.getAuthorizationHeader = () => {
        return {
          'Authorization': `Bearer ${connectOptions.token}`
        };
      };
      warehouseId = dicomConfig.httpPath.split("/")[4];
      dicomConfig.url = connectOptions.host;
      wadoDicomWebClient = new StaticWadoClient/* default */.A(dicomConfig, servicesManager);
      wadoDicomWebClient.baseURL = "wado";
    },
    query: {
      studies: {
        mapParams: mapParams.bind(),
        search: async function (origParams) {
          console.info("createDatabricksPixelsDicom - query studies");
          const results = await qidoStudiesSearch(databricksClient, warehouseId, dicomConfig.pixelsTable, origParams);
          return processResults(results);
        },
        processResults: processResults.bind()
      },
      series: {
        search: async studyInstanceUID => {
          console.info("createDatabricksPixelsDicom - query series", studyInstanceUID);
          const series = await qidoSeriesSearch(databricksClient, warehouseId, studyInstanceUID, dicomConfig.pixelsTable);
          const result = processSeriesResults(series);
          return result;
        }
      },
      instances: {
        search: () => {
          console.warn(' QUERY instances SEARCH not implemented');
        }
      }
    },
    retrieve: {
      directURL: params => {
        const {
          instance,
          tag,
          defaultType
        } = params;
        console.log("retrieve direct url");
        const value = instance[tag];
        if (value instanceof Array && value[0] instanceof ArrayBuffer) {
          return URL.createObjectURL(new Blob([value[0]], {
            type: defaultType
          }));
        }
      },
      getWadoDicomWebClient: () => {
        console.log("getWadoDicomWebClient", wadoDicomWebClient);
        return wadoDicomWebClient;
      },
      bulkDataURI: async ({
        StudyInstanceUID,
        BulkDataURI
      }) => {
        console.warn(' Retrieve bulkDataURI not implemented');
      },
      series: {
        metadata: async ({
          StudyInstanceUID,
          madeInClient = false
        } = {}) => {
          if (!StudyInstanceUID) {
            throw new Error('Unable to query for SeriesMetadata without StudyInstanceUID');
          }
          const study = await qidoSeriesMetadataSearch(databricksClient, warehouseId, StudyInstanceUID, dicomConfig.pixelsTable);
          const result = processSeriesMetadataResults(study);
          const seriesSummaryMetadata = {};
          const instancesPerSeries = {};
          result.forEach(aSeries => {
            aSeries.instances.forEach((instance, index) => {
              const naturalizedInstancesMetadata = DatabricksPixelsDicom_naturalizeDataset(instance.meta);
              naturalizedInstancesMetadata.InstanceNumber = instance.GeneratedInstanceNumber;
              //delete naturalizedInstancesMetadata.InstanceNumber
              if (naturalizedInstancesMetadata.NumberOfFrames > 1) {
                naturalizedInstancesMetadata.url = "dicomweb:" + databricksClient.defaults.baseURL + "fs/files/" + instance.relative_path;
              } else {
                naturalizedInstancesMetadata.url = "dicomweb:" + databricksClient.defaults.baseURL + "fs/files/" + instance.relative_path;
                naturalizedInstancesMetadata.NumberOfFrames = 1;
              }
              const {
                url: imageId,
                StudyInstanceUID,
                SeriesInstanceUID,
                SOPInstanceUID
              } = naturalizedInstancesMetadata;
              naturalizedInstancesMetadata.imageId = imageId;
              naturalizedInstancesMetadata.wadoUri = databricksClient.defaults.baseURL + "fs/files/" + instance.relative_path;
              naturalizedInstancesMetadata.volumeRoot = instance.relative_path.split("/").slice(0, 4).join("/");
              if (!seriesSummaryMetadata[naturalizedInstancesMetadata.SeriesInstanceUID]) {
                seriesSummaryMetadata[naturalizedInstancesMetadata.SeriesInstanceUID] = {
                  StudyInstanceUID: naturalizedInstancesMetadata.StudyInstanceUID,
                  StudyDescription: naturalizedInstancesMetadata.studyDescription,
                  SeriesInstanceUID: naturalizedInstancesMetadata.SeriesInstanceUID,
                  SeriesDescription: naturalizedInstancesMetadata.seriesDescription,
                  SOPInstanceUID: naturalizedInstancesMetadata.SOPInstanceUID,
                  SeriesNumber: naturalizedInstancesMetadata.seriesNumber,
                  SeriesTime: naturalizedInstancesMetadata.seriesTime,
                  SOPClassUID: naturalizedInstancesMetadata.sopClassUID,
                  ProtocolName: naturalizedInstancesMetadata.protocolName,
                  Modality: naturalizedInstancesMetadata.modality
                };
              }
              if (!instancesPerSeries[naturalizedInstancesMetadata.SeriesInstanceUID]) {
                instancesPerSeries[naturalizedInstancesMetadata.SeriesInstanceUID] = [];
              }
              for (let i = 1; i <= naturalizedInstancesMetadata.NumberOfFrames; i++) {
                DatabricksPixelsDicom_metadataProvider.addImageIdToUIDs(imageId, {
                  StudyInstanceUID,
                  SeriesInstanceUID,
                  SOPInstanceUID,
                  frameIndex: i
                });
              }
              instancesPerSeries[naturalizedInstancesMetadata.SeriesInstanceUID].push(naturalizedInstancesMetadata);
            });

            // grab all the series metadata
            const seriesMetadata = Object.values(seriesSummaryMetadata);
            src.DicomMetadataStore.addSeriesMetadata(seriesMetadata, madeInClient);
            Object.keys(instancesPerSeries).forEach(SeriesInstanceUID => src.DicomMetadataStore.addInstances(instancesPerSeries[SeriesInstanceUID], madeInClient));
          });
        }
      }
    },
    store: {
      dicom: async naturalizedReport => {
        // naturalizedReport.SeriesNumber = "9999" //hack for monailabel ordering fix
        const reportBlob = dcmjs_es/* default.data */.Ay.data.datasetToBlob(naturalizedReport);
        var instance = {};
        if (naturalizedReport.ConceptNameCodeSequence?.CodeValue == '126000') {
          //this is a measurement
          instance = src.DicomMetadataStore.getInstance(naturalizedReport.StudyInstanceUID, naturalizedReport.CurrentRequestedProcedureEvidenceSequence[0].ReferencedSeriesSequence.SeriesInstanceUID, naturalizedReport.CurrentRequestedProcedureEvidenceSequence[0].ReferencedSeriesSequence.ReferencedSOPSequence.ReferencedSOPInstanceUID);
        } else {
          //this is a segmentation
          instance = src.DicomMetadataStore.getInstance(naturalizedReport.StudyInstanceUID, naturalizedReport.ReferencedSeriesSequence.SeriesInstanceUID, naturalizedReport.ReferencedSeriesSequence.ReferencedInstanceSequence[0].ReferencedSOPInstanceUID);
        }
        const volumePath = instance.volumeRoot;
        const filePath = volumePath + "/ohif/exports/" + naturalizedReport.StudyInstanceUID + "/" + naturalizedReport.SeriesInstanceUID + "/" + naturalizedReport.SOPInstanceUID + ".dcm";
        const response = await databricksClient.put("fs/files/" + filePath, reportBlob, {
          headers: {
            'Content-Type': 'application/octet-stream'
          },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          responseType: 'json'
        });
        if (response.status == 204) {
          console.log("File saved correclty in volume path", filePath);
        }
        var meta = DatabricksPixelsDicom_denaturalizeDataset(naturalizedReport);
        delete meta['7FE00010'];
        delete meta['60003000'];
        meta['fileSize'] = reportBlob.size;
        meta['hash'] = sha1_default()(reportBlob).toString();
        naturalizedReport.meta = meta;
        console.log(naturalizedReport);
        const result = await persistMetadata(databricksClient, warehouseId, dicomConfig.pixelsTable, {
          path: filePath,
          meta: JSON.stringify(naturalizedReport.meta),
          datetime: "" + naturalizedReport.ContentDate + naturalizedReport.ContentTime,
          length: reportBlob.size
        });
      }
    },
    getImageIdsForDisplaySet(displaySet) {
      const images = displaySet.images;
      const imageIds = [];
      if (!images) {
        return imageIds;
      }
      displaySet.images.forEach(instance => {
        const NumberOfFrames = instance.NumberOfFrames;
        if (NumberOfFrames > 1) {
          // in multiframe we start at frame 1
          for (let i = 1; i <= NumberOfFrames; i++) {
            const imageId = this.getImageIdsForInstance({
              instance,
              frame: i
            });
            imageIds.push(imageId);
          }
        } else {
          const imageId = this.getImageIdsForInstance({
            instance
          });
          imageIds.push(imageId);
        }
      });
      return imageIds;
    },
    getImageIdsForInstance({
      instance,
      frame
    }) {
      const {
        StudyInstanceUID,
        SeriesInstanceUID,
        SOPInstanceUID
      } = instance;
      const storedInstance = src.DicomMetadataStore.getInstance(StudyInstanceUID, SeriesInstanceUID, SOPInstanceUID);
      let imageId = storedInstance.url;
      if (frame !== undefined) {
        imageId += `&frame=${frame}`;
      }
      return imageId;
    },
    deleteStudyMetadataPromise() {
      console.log('deleteStudyMetadataPromise not implemented');
    },
    getStudyInstanceUIDs: ({
      params,
      query
    }) => {
      console.log("getStudyInstanceUIDs", params, query);
      const {
        StudyInstanceUIDs: paramsStudyInstanceUIDs
      } = params;
      const queryStudyInstanceUIDs = src.utils.splitComma(query.getAll('StudyInstanceUIDs'));
      const StudyInstanceUIDs = queryStudyInstanceUIDs.length && queryStudyInstanceUIDs || paramsStudyInstanceUIDs;
      const StudyInstanceUIDsAsArray = StudyInstanceUIDs && Array.isArray(StudyInstanceUIDs) ? StudyInstanceUIDs : [StudyInstanceUIDs];
      StudyInstanceUIDsAsArray.forEach(StudyInstanceUID => {
        const study = src.DicomMetadataStore.getStudy(StudyInstanceUID);
        if (study) {
          study.series = study.series.sort(DatabricksPixelsDicom_customSort);
        }
      });
      return StudyInstanceUIDsAsArray;
    }
  };
  return src.IWebApiDataSource.create(implementation);
}

;// ../../../extensions/default/src/getDataSourcesModule.js
// TODO: Pull in IWebClientApi from @ohif/core
// TODO: Use constructor to create an instance of IWebClientApi
// TODO: Use existing DICOMWeb configuration (previously, appConfig, to configure instance)





/**
 *
 */
function getDataSourcesModule() {
  return [{
    name: 'dicomjson',
    type: 'jsonApi',
    createDataSource: createDicomJSONApi
  }, {
    name: 'dicomlocal',
    type: 'localApi',
    createDataSource: createDicomLocalApi
  }, {
    name: 'databricksPixelsDicom',
    type: 'webApi',
    createDataSource: createDatabricksPixelsDicom
  }];
}
/* harmony default export */ const src_getDataSourcesModule = (getDataSourcesModule);
// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../../node_modules/prop-types/index.js
var prop_types = __webpack_require__(97598);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
// EXTERNAL MODULE: ../../ui-next/src/index.ts + 3073 modules
var ui_next_src = __webpack_require__(17130);
// EXTERNAL MODULE: ./state/index.js + 1 modules
var state = __webpack_require__(45981);
// EXTERNAL MODULE: ../../../node_modules/react-router-dom/dist/index.js
var dist = __webpack_require__(4194);
// EXTERNAL MODULE: ../../../node_modules/react-i18next/dist/es/index.js + 15 modules
var es = __webpack_require__(99993);
// EXTERNAL MODULE: ../../../extensions/default/src/Toolbar/Toolbar.tsx
var Toolbar = __webpack_require__(20528);
;// ../../../extensions/default/src/hooks/usePatientInfo.tsx


const {
  formatPN,
  formatDate
} = src.utils;
function usePatientInfo() {
  const {
    servicesManager
  } = (0,src.useSystem)();
  const {
    displaySetService
  } = servicesManager.services;
  const [patientInfo, setPatientInfo] = (0,react.useState)({
    PatientName: '',
    PatientID: '',
    PatientSex: '',
    PatientDOB: ''
  });
  const [isMixedPatients, setIsMixedPatients] = (0,react.useState)(false);
  const checkMixedPatients = PatientID => {
    const displaySets = displaySetService.getActiveDisplaySets();
    let isMixedPatients = false;
    displaySets.forEach(displaySet => {
      const instance = displaySet?.instances?.[0] || displaySet?.instance;
      if (!instance) {
        return;
      }
      if (instance.PatientID !== PatientID) {
        isMixedPatients = true;
      }
    });
    setIsMixedPatients(isMixedPatients);
  };
  const updatePatientInfo = ({
    displaySetsAdded
  }) => {
    if (!displaySetsAdded.length) {
      return;
    }
    const displaySet = displaySetsAdded[0];
    const instance = displaySet?.instances?.[0] || displaySet?.instance;
    if (!instance) {
      return;
    }
    setPatientInfo({
      PatientID: instance.PatientID || null,
      PatientName: instance.PatientName ? formatPN(instance.PatientName) : null,
      PatientSex: instance.PatientSex || null,
      PatientDOB: formatDate(instance.PatientBirthDate) || null
    });
    checkMixedPatients(instance.PatientID || null);
  };
  (0,react.useEffect)(() => {
    const subscription = displaySetService.subscribe(displaySetService.EVENTS.DISPLAY_SETS_ADDED, props => updatePatientInfo(props));
    return () => subscription.unsubscribe();
  }, []);
  return {
    patientInfo,
    isMixedPatients
  };
}
/* harmony default export */ const hooks_usePatientInfo = (usePatientInfo);
;// ../../../extensions/default/src/ViewerLayout/HeaderPatientInfo/HeaderPatientInfo.tsx



let PatientInfoVisibility = /*#__PURE__*/function (PatientInfoVisibility) {
  PatientInfoVisibility["VISIBLE"] = "visible";
  PatientInfoVisibility["VISIBLE_COLLAPSED"] = "visibleCollapsed";
  PatientInfoVisibility["DISABLED"] = "disabled";
  PatientInfoVisibility["VISIBLE_READONLY"] = "visibleReadOnly";
  return PatientInfoVisibility;
}({});
const formatWithEllipsis = (str, maxLength) => {
  if (str?.length > maxLength) {
    return str.substring(0, maxLength) + '...';
  }
  return str;
};
function HeaderPatientInfo({
  servicesManager,
  appConfig
}) {
  const initialExpandedState = appConfig.showPatientInfo === PatientInfoVisibility.VISIBLE || appConfig.showPatientInfo === PatientInfoVisibility.VISIBLE_READONLY;
  const [expanded, setExpanded] = (0,react.useState)(initialExpandedState);
  const {
    patientInfo,
    isMixedPatients
  } = hooks_usePatientInfo(servicesManager);
  (0,react.useEffect)(() => {
    if (isMixedPatients && expanded) {
      setExpanded(false);
    }
  }, [isMixedPatients, expanded]);
  const handleOnClick = () => {
    if (!isMixedPatients && appConfig.showPatientInfo !== PatientInfoVisibility.VISIBLE_READONLY) {
      setExpanded(!expanded);
    }
  };
  const formattedPatientName = formatWithEllipsis(patientInfo.PatientName, 27);
  const formattedPatientID = formatWithEllipsis(patientInfo.PatientID, 15);
  return /*#__PURE__*/react.createElement("div", {
    className: "hover:bg-primary-dark flex cursor-pointer items-center justify-center gap-1 rounded-lg",
    onClick: handleOnClick
  }, isMixedPatients ? /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.MultiplePatients, {
    className: "text-primary"
  }) : /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Patient, {
    className: "text-primary"
  }), /*#__PURE__*/react.createElement("div", {
    className: "flex flex-col justify-center"
  }, expanded ? /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
    className: "self-start text-[13px] font-bold text-white"
  }, formattedPatientName), /*#__PURE__*/react.createElement("div", {
    className: "text-aqua-pale flex gap-2 text-[11px]"
  }, /*#__PURE__*/react.createElement("div", null, formattedPatientID), /*#__PURE__*/react.createElement("div", null, patientInfo.PatientSex), /*#__PURE__*/react.createElement("div", null, patientInfo.PatientDOB))) : /*#__PURE__*/react.createElement("div", {
    className: "text-primary self-center text-[13px]"
  }, isMixedPatients ? 'Multiple Patients' : 'Patient')), /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ArrowLeft, {
    className: `text-primary ${expanded ? 'rotate-180' : ''}`
  }));
}
/* harmony default export */ const HeaderPatientInfo_HeaderPatientInfo = (HeaderPatientInfo);
;// ../../../extensions/default/src/ViewerLayout/HeaderPatientInfo/index.js

/* harmony default export */ const ViewerLayout_HeaderPatientInfo = (HeaderPatientInfo_HeaderPatientInfo);
// EXTERNAL MODULE: ./index.js + 44 modules
var index = __webpack_require__(7984);
;// ../../../extensions/default/src/ViewerLayout/ViewerHeader.tsx









function ViewerHeader({
  appConfig
}) {
  const {
    servicesManager,
    extensionManager,
    commandsManager
  } = (0,src.useSystem)();
  const {
    customizationService
  } = servicesManager.services;
  const navigate = (0,dist/* useNavigate */.Zp)();
  const location = (0,dist/* useLocation */.zy)();
  const onClickReturnButton = () => {
    const {
      pathname
    } = location;
    const dataSourceIdx = pathname.indexOf('/', 1);
    const dataSourceName = pathname.substring(dataSourceIdx + 1);
    const existingDataSource = extensionManager.getDataSources(dataSourceName);
    const searchQuery = new URLSearchParams();
    if (dataSourceIdx !== -1 && existingDataSource) {
      searchQuery.append('datasources', pathname.substring(dataSourceIdx + 1));
    }
    (0,index/* preserveQueryParameters */.Nn)(searchQuery);
    navigate({
      pathname: '/',
      search: decodeURIComponent(searchQuery.toString())
    });
  };
  const {
    t
  } = (0,es/* useTranslation */.Bd)();
  const {
    show
  } = (0,ui_next_src/* useModal */.hSE)();
  const AboutModal = customizationService.getCustomization('ohif.aboutModal');
  const UserPreferencesModal = customizationService.getCustomization('ohif.userPreferencesModal');
  const menuOptions = [{
    title: AboutModal?.menuTitle ?? t('Header:About'),
    icon: 'info',
    onClick: () => show({
      content: AboutModal,
      title: AboutModal?.title ?? t('AboutModal:About OHIF Viewer'),
      containerClassName: AboutModal?.containerClassName ?? 'max-w-md'
    })
  }, {
    title: UserPreferencesModal.menuTitle ?? t('Header:Preferences'),
    icon: 'settings',
    onClick: () => show({
      content: UserPreferencesModal,
      title: UserPreferencesModal.title ?? t('UserPreferencesModal:User preferences'),
      containerClassName: UserPreferencesModal?.containerClassName ?? 'flex max-w-4xl p-6 flex-col'
    })
  }];
  if (appConfig.oidc) {
    menuOptions.push({
      title: t('Header:Logout'),
      icon: 'power-off',
      onClick: async () => {
        navigate(`/logout?redirect_uri=${encodeURIComponent(window.location.href)}`);
      }
    });
  }
  return /*#__PURE__*/react.createElement(ui_next_src/* Header */.Y9Y, {
    menuOptions: menuOptions,
    isReturnEnabled: !!appConfig.showStudyList,
    onClickReturnButton: onClickReturnButton,
    WhiteLabeling: appConfig.whiteLabeling,
    Secondary: /*#__PURE__*/react.createElement(Toolbar/* Toolbar */.M, {
      buttonSection: "secondary"
    }),
    PatientInfo: appConfig.showPatientInfo !== PatientInfoVisibility.DISABLED && /*#__PURE__*/react.createElement(ViewerLayout_HeaderPatientInfo, {
      servicesManager: servicesManager,
      appConfig: appConfig
    }),
    UndoRedo: /*#__PURE__*/react.createElement("div", {
      className: "text-primary flex cursor-pointer items-center"
    }, /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
      variant: "ghost",
      className: "hover:bg-primary-dark",
      onClick: () => {
        commandsManager.run('undo');
      }
    }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Undo, {
      className: ""
    })), /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
      variant: "ghost",
      className: "hover:bg-primary-dark",
      onClick: () => {
        commandsManager.run('redo');
      }
    }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Redo, {
      className: ""
    })))
  }, /*#__PURE__*/react.createElement("div", {
    className: "relative flex justify-center gap-[4px]"
  }, /*#__PURE__*/react.createElement(Toolbar/* Toolbar */.M, {
    buttonSection: "primary"
  })));
}
/* harmony default export */ const ViewerLayout_ViewerHeader = (ViewerHeader);
;// ../../../extensions/default/src/Components/SidePanelWithServices.tsx
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }


const SidePanelWithServices = ({
  servicesManager,
  side,
  activeTabIndex: activeTabIndexProp,
  isExpanded,
  tabs: tabsProp,
  onOpen,
  onClose,
  ...props
}) => {
  const panelService = servicesManager?.services?.panelService;

  // Tracks whether this SidePanel has been opened at least once since this SidePanel was inserted into the DOM.
  // Thus going to the Study List page and back to the viewer resets this flag for a SidePanel.
  const [sidePanelExpanded, setSidePanelExpanded] = (0,react.useState)(isExpanded);
  const [activeTabIndex, setActiveTabIndex] = (0,react.useState)(activeTabIndexProp ?? 0);
  const [closedManually, setClosedManually] = (0,react.useState)(false);
  const [tabs, setTabs] = (0,react.useState)(tabsProp ?? panelService.getPanels(side));
  const handleActiveTabIndexChange = (0,react.useCallback)(({
    activeTabIndex
  }) => {
    setActiveTabIndex(activeTabIndex);
  }, []);
  const handleOpen = (0,react.useCallback)(() => {
    setSidePanelExpanded(true);
    onOpen?.();
  }, [onOpen]);
  const handleClose = (0,react.useCallback)(() => {
    setSidePanelExpanded(false);
    setClosedManually(true);
    onClose?.();
  }, [onClose]);
  (0,react.useEffect)(() => {
    setSidePanelExpanded(isExpanded);
  }, [isExpanded]);

  /** update the active tab index from outside */
  (0,react.useEffect)(() => {
    setActiveTabIndex(activeTabIndexProp ?? 0);
  }, [activeTabIndexProp]);
  (0,react.useEffect)(() => {
    const {
      unsubscribe
    } = panelService.subscribe(panelService.EVENTS.PANELS_CHANGED, panelChangedEvent => {
      if (panelChangedEvent.position !== side) {
        return;
      }
      setTabs(panelService.getPanels(side));
    });
    return () => {
      unsubscribe();
    };
  }, [panelService, side]);
  (0,react.useEffect)(() => {
    const activatePanelSubscription = panelService.subscribe(panelService.EVENTS.ACTIVATE_PANEL, activatePanelEvent => {
      if (sidePanelExpanded || activatePanelEvent.forceActive) {
        const tabIndex = tabs.findIndex(tab => tab.id === activatePanelEvent.panelId);
        if (tabIndex !== -1) {
          if (!closedManually) {
            setSidePanelExpanded(true);
          }
          setActiveTabIndex(tabIndex);
        }
      }
    });
    return () => {
      activatePanelSubscription.unsubscribe();
    };
  }, [tabs, sidePanelExpanded, panelService, closedManually]);
  return /*#__PURE__*/react.createElement(ui_next_src/* SidePanel */.wv, _extends({}, props, {
    side: side,
    tabs: tabs,
    activeTabIndex: activeTabIndex,
    isExpanded: sidePanelExpanded,
    onOpen: handleOpen,
    onClose: handleClose,
    onActiveTabIndexChange: handleActiveTabIndexChange
  }));
};
/* harmony default export */ const Components_SidePanelWithServices = (SidePanelWithServices);
// EXTERNAL MODULE: ../../../node_modules/react-resizable-panels/dist/react-resizable-panels.browser.esm.js
var react_resizable_panels_browser_esm = __webpack_require__(17825);
;// ../../../extensions/default/src/ViewerLayout/constants/panels.ts
const expandedInsideBorderSize = 0;
const collapsedInsideBorderSize = 4;
const collapsedOutsideBorderSize = 4;
const collapsedWidth = 25;
const getPanelGroupDefinition = ({
  leftPanelInitialExpandedWidth = 282,
  rightPanelInitialExpandedWidth = 280,
  leftPanelMinimumExpandedWidth = 145,
  rightPanelMinimumExpandedWidth = 280
}) => {
  return {
    groupId: 'viewerLayoutResizablePanelGroup',
    shared: {
      expandedInsideBorderSize,
      collapsedInsideBorderSize,
      collapsedOutsideBorderSize,
      collapsedWidth
    },
    left: {
      // id
      panelId: 'viewerLayoutResizableLeftPanel',
      // expanded width
      initialExpandedWidth: leftPanelInitialExpandedWidth,
      // expanded width + expanded inside border
      minimumExpandedOffsetWidth: leftPanelMinimumExpandedWidth + expandedInsideBorderSize,
      // initial expanded width
      initialExpandedOffsetWidth: leftPanelInitialExpandedWidth + expandedInsideBorderSize,
      // collapsed width + collapsed inside border + collapsed outside border
      collapsedOffsetWidth: collapsedWidth + collapsedInsideBorderSize + collapsedOutsideBorderSize
    },
    right: {
      panelId: 'viewerLayoutResizableRightPanel',
      initialExpandedWidth: rightPanelInitialExpandedWidth,
      minimumExpandedOffsetWidth: rightPanelMinimumExpandedWidth + expandedInsideBorderSize,
      initialExpandedOffsetWidth: rightPanelInitialExpandedWidth + expandedInsideBorderSize,
      collapsedOffsetWidth: collapsedWidth + collapsedInsideBorderSize + collapsedOutsideBorderSize
    }
  };
};

;// ../../../extensions/default/src/ViewerLayout/ResizablePanelsHook.tsx




/**
 * Set the minimum and maximum css style width attributes for the given element.
 * The two style attributes are cleared whenever the width
 * argument is undefined.
 * <p>
 * This utility is used as part of a HACK throughout the ViewerLayout component as
 * the means of restricting the side panel widths during the resizing of the
 * browser window. In general, the widths are always set unless the resize
 * handle for either side panel is being dragged (i.e. a side panel is being resized).
 *
 * @param elem the element
 * @param width the max and min width to set on the element
 */
const setMinMaxWidth = (elem, width) => {
  if (!elem) {
    return;
  }
  elem.style.minWidth = width === undefined ? '' : `${width}px`;
  elem.style.maxWidth = elem.style.minWidth;
};
const useResizablePanels = (leftPanelClosed, setLeftPanelClosed, rightPanelClosed, setRightPanelClosed, hasLeftPanels, hasRightPanels, leftPanelInitialExpandedWidth, rightPanelInitialExpandedWidth, leftPanelMinimumExpandedWidth, rightPanelMinimumExpandedWidth) => {
  const [panelGroupDefinition] = (0,react.useState)(getPanelGroupDefinition({
    leftPanelInitialExpandedWidth,
    rightPanelInitialExpandedWidth,
    leftPanelMinimumExpandedWidth,
    rightPanelMinimumExpandedWidth
  }));
  const [leftPanelExpandedWidth, setLeftPanelExpandedWidth] = (0,react.useState)(panelGroupDefinition.left.initialExpandedWidth);
  const [rightPanelExpandedWidth, setRightPanelExpandedWidth] = (0,react.useState)(panelGroupDefinition.right.initialExpandedWidth);
  const [leftResizablePanelMinimumSize, setLeftResizablePanelMinimumSize] = (0,react.useState)(0);
  const [rightResizablePanelMinimumSize, setRightResizablePanelMinimumSize] = (0,react.useState)(0);
  const [leftResizablePanelCollapsedSize, setLeftResizePanelCollapsedSize] = (0,react.useState)(0);
  const [rightResizePanelCollapsedSize, setRightResizePanelCollapsedSize] = (0,react.useState)(0);
  const resizablePanelGroupElemRef = (0,react.useRef)(null);
  const resizableLeftPanelElemRef = (0,react.useRef)(null);
  const resizableRightPanelElemRef = (0,react.useRef)(null);
  const resizableLeftPanelAPIRef = (0,react.useRef)(null);
  const resizableRightPanelAPIRef = (0,react.useRef)(null);
  const isResizableHandleDraggingRef = (0,react.useRef)(false);

  // The total width of both handles.
  const resizableHandlesWidth = (0,react.useRef)(null);

  // This useLayoutEffect is used to...
  // - Grab a reference to the various resizable panel elements needed for
  //   converting between percentages and pixels in various callbacks.
  // - Expand those panels that are initially expanded.
  (0,react.useLayoutEffect)(() => {
    const panelGroupElem = (0,react_resizable_panels_browser_esm/* getPanelGroupElement */.Gx)(panelGroupDefinition.groupId);
    resizablePanelGroupElemRef.current = panelGroupElem;
    const leftPanelElem = (0,react_resizable_panels_browser_esm/* getPanelElement */.PV)(panelGroupDefinition.left.panelId);
    resizableLeftPanelElemRef.current = leftPanelElem;
    const rightPanelElem = (0,react_resizable_panels_browser_esm/* getPanelElement */.PV)(panelGroupDefinition.right.panelId);
    resizableRightPanelElemRef.current = rightPanelElem;

    // Calculate and set the width of both handles combined.
    const resizeHandles = document.querySelectorAll('[data-panel-resize-handle-id]');
    resizableHandlesWidth.current = 0;
    resizeHandles.forEach(resizeHandle => {
      resizableHandlesWidth.current += resizeHandle.offsetWidth;
    });

    // Since both resizable panels are collapsed by default (i.e. their default size is zero),
    // on the very first render check if either/both side panels should be expanded.
    // we use the initialExpandedOffsetWidth on the first render incase the panel has min width but we want the initial state to be larger than that

    if (!leftPanelClosed) {
      const leftResizablePanelExpandedSize = getPercentageSize(panelGroupDefinition.left.initialExpandedOffsetWidth);
      resizableLeftPanelAPIRef?.current?.expand(leftResizablePanelExpandedSize);
      setMinMaxWidth(leftPanelElem, panelGroupDefinition.left.initialExpandedOffsetWidth);
    }
    if (!rightPanelClosed) {
      const rightResizablePanelExpandedSize = getPercentageSize(panelGroupDefinition.right.initialExpandedOffsetWidth);
      resizableRightPanelAPIRef?.current?.expand(rightResizablePanelExpandedSize);
      setMinMaxWidth(rightPanelElem, panelGroupDefinition.right.initialExpandedOffsetWidth);
    }
  }, []); // no dependencies because this useLayoutEffect is only needed on the very first render

  // This useLayoutEffect follows the pattern prescribed by the react-resizable-panels
  // readme for converting between pixel values and percentages. An example of
  // the pattern can be found here:
  // https://github.com/bvaughn/react-resizable-panels/issues/46#issuecomment-1368108416
  // This useLayoutEffect is used to...
  // - Ensure that the percentage size is up-to-date with the pixel sizes
  // - Add a resize observer to the resizable panel group to reset various state
  //   values whenever the resizable panel group is resized (e.g. whenever the
  //   browser window is resized).
  (0,react.useLayoutEffect)(() => {
    // Ensure the side panels' percentage size is in synch with the pixel width of the
    // expanded side panels. In general the two get out-of-sync during a browser
    // window resize. Note that this code is here and NOT in the ResizeObserver
    // because it has to be done AFTER the minimum percentage size for a panel is
    // updated which occurs only AFTER the render following a browser window resize.
    // And by virtue of the dependency on the minimum size state variables, this code
    // is executed on the render following an update of the minimum percentage sizes
    // for a panel.
    if (!resizableLeftPanelAPIRef.current?.isCollapsed()) {
      const leftSize = getPercentageSize(leftPanelExpandedWidth + panelGroupDefinition.shared.expandedInsideBorderSize);
      resizableLeftPanelAPIRef.current?.resize(leftSize);
    }
    if (!resizableRightPanelAPIRef?.current?.isCollapsed()) {
      const rightSize = getPercentageSize(rightPanelExpandedWidth + panelGroupDefinition.shared.expandedInsideBorderSize);
      resizableRightPanelAPIRef?.current?.resize(rightSize);
    }

    // This observer kicks in when the ViewportLayout resizable panel group
    // component is resized. This typically occurs when the browser window resizes.
    const observer = new ResizeObserver(() => {
      const minimumLeftSize = getPercentageSize(panelGroupDefinition.left.minimumExpandedOffsetWidth);
      const minimumRightSize = getPercentageSize(panelGroupDefinition.right.minimumExpandedOffsetWidth);

      // Set the new minimum and collapsed resizable panel sizes.
      setLeftResizablePanelMinimumSize(minimumLeftSize);
      setRightResizablePanelMinimumSize(minimumRightSize);
      setLeftResizePanelCollapsedSize(getPercentageSize(panelGroupDefinition.left.collapsedOffsetWidth));
      setRightResizePanelCollapsedSize(getPercentageSize(panelGroupDefinition.right.collapsedOffsetWidth));
    });
    observer.observe(resizablePanelGroupElemRef.current);
    return () => {
      observer.disconnect();
    };
  }, [leftPanelExpandedWidth, rightPanelExpandedWidth, leftResizablePanelMinimumSize, rightResizablePanelMinimumSize, hasLeftPanels, hasRightPanels]);

  /**
   * Handles dragging of either side panel resize handle.
   */
  const onHandleDragging = (0,react.useCallback)(isStartDrag => {
    if (isStartDrag) {
      isResizableHandleDraggingRef.current = true;
      setMinMaxWidth(resizableLeftPanelElemRef.current);
      setMinMaxWidth(resizableRightPanelElemRef.current);
    } else {
      isResizableHandleDraggingRef.current = false;
      if (resizableLeftPanelAPIRef?.current?.isExpanded()) {
        setMinMaxWidth(resizableLeftPanelElemRef.current, leftPanelExpandedWidth + panelGroupDefinition.shared.expandedInsideBorderSize);
      }
      if (resizableRightPanelAPIRef?.current?.isExpanded()) {
        setMinMaxWidth(resizableRightPanelElemRef.current, rightPanelExpandedWidth + panelGroupDefinition.shared.expandedInsideBorderSize);
      }
    }
  }, [leftPanelExpandedWidth, rightPanelExpandedWidth]);
  const onLeftPanelClose = (0,react.useCallback)(() => {
    setLeftPanelClosed(true);
    setMinMaxWidth(resizableLeftPanelElemRef.current);
    resizableLeftPanelAPIRef?.current?.collapse();
  }, [setLeftPanelClosed]);
  const onLeftPanelOpen = (0,react.useCallback)(() => {
    resizableLeftPanelAPIRef?.current?.expand(getPercentageSize(panelGroupDefinition.left.initialExpandedOffsetWidth));
    setLeftPanelClosed(false);
  }, [setLeftPanelClosed]);
  const onLeftPanelResize = (0,react.useCallback)(size => {
    if (!resizablePanelGroupElemRef?.current || resizableLeftPanelAPIRef.current?.isCollapsed()) {
      return;
    }
    const newExpandedWidth = getExpandedPixelWidth(size);
    setLeftPanelExpandedWidth(newExpandedWidth);
    if (!isResizableHandleDraggingRef.current) {
      // This typically gets executed when the left panel is expanded via one of the UI
      // buttons. It is done here instead of in the onLeftPanelOpen method
      // because here we know the size of the expanded panel.
      setMinMaxWidth(resizableLeftPanelElemRef.current, newExpandedWidth);
    }
  }, []);
  const onRightPanelClose = (0,react.useCallback)(() => {
    setRightPanelClosed(true);
    setMinMaxWidth(resizableRightPanelElemRef.current);
    resizableRightPanelAPIRef?.current?.collapse();
  }, [setRightPanelClosed]);
  const onRightPanelOpen = (0,react.useCallback)(() => {
    resizableRightPanelAPIRef?.current?.expand(getPercentageSize(panelGroupDefinition.right.initialExpandedOffsetWidth));
    setRightPanelClosed(false);
  }, [setRightPanelClosed]);
  const onRightPanelResize = (0,react.useCallback)(size => {
    if (!resizablePanelGroupElemRef?.current || resizableRightPanelAPIRef?.current?.isCollapsed()) {
      return;
    }
    const newExpandedWidth = getExpandedPixelWidth(size);
    setRightPanelExpandedWidth(newExpandedWidth);
    if (!isResizableHandleDraggingRef.current) {
      // This typically gets executed when the right panel is expanded via one of the UI
      // buttons. It is done here instead of in the onRightPanelOpen method
      // because here we know the size of the expanded panel.
      setMinMaxWidth(resizableRightPanelElemRef.current, newExpandedWidth);
    }
  }, []);

  /**
   * Gets the percentage size corresponding to the given pixel size.
   * Note that the width attributed to the handles must be taken into account.
   */
  const getPercentageSize = pixelSize => {
    const {
      width: panelGroupWidth
    } = resizablePanelGroupElemRef.current?.getBoundingClientRect();
    return pixelSize / (panelGroupWidth - resizableHandlesWidth.current) * 100;
  };

  /**
   * Gets the width in pixels for an expanded panel given its percentage size/width.
   * Note that the width attributed to the handles must be taken into account.
   */
  const getExpandedPixelWidth = percentageSize => {
    const {
      width: panelGroupWidth
    } = resizablePanelGroupElemRef.current?.getBoundingClientRect();
    const expandedWidth = percentageSize / 100 * (panelGroupWidth - resizableHandlesWidth.current) - panelGroupDefinition.shared.expandedInsideBorderSize;
    return expandedWidth;
  };
  return [{
    expandedWidth: leftPanelExpandedWidth,
    collapsedWidth: panelGroupDefinition.shared.collapsedWidth,
    collapsedInsideBorderSize: panelGroupDefinition.shared.collapsedInsideBorderSize,
    collapsedOutsideBorderSize: panelGroupDefinition.shared.collapsedOutsideBorderSize,
    expandedInsideBorderSize: panelGroupDefinition.shared.expandedInsideBorderSize,
    onClose: onLeftPanelClose,
    onOpen: onLeftPanelOpen
  }, {
    expandedWidth: rightPanelExpandedWidth,
    collapsedWidth: panelGroupDefinition.shared.collapsedWidth,
    collapsedInsideBorderSize: panelGroupDefinition.shared.collapsedInsideBorderSize,
    collapsedOutsideBorderSize: panelGroupDefinition.shared.collapsedOutsideBorderSize,
    expandedInsideBorderSize: panelGroupDefinition.shared.expandedInsideBorderSize,
    onClose: onRightPanelClose,
    onOpen: onRightPanelOpen
  }, {
    direction: 'horizontal',
    id: panelGroupDefinition.groupId
  }, {
    defaultSize: leftResizablePanelMinimumSize,
    minSize: leftResizablePanelMinimumSize,
    onResize: onLeftPanelResize,
    collapsible: true,
    collapsedSize: leftResizablePanelCollapsedSize,
    onCollapse: () => setLeftPanelClosed(true),
    onExpand: () => setLeftPanelClosed(false),
    ref: resizableLeftPanelAPIRef,
    order: 0,
    id: panelGroupDefinition.left.panelId
  }, {
    order: 1,
    id: 'viewerLayoutResizableViewportGridPanel'
  }, {
    defaultSize: rightResizablePanelMinimumSize,
    minSize: rightResizablePanelMinimumSize,
    onResize: onRightPanelResize,
    collapsible: true,
    collapsedSize: rightResizePanelCollapsedSize,
    onCollapse: () => setRightPanelClosed(true),
    onExpand: () => setRightPanelClosed(false),
    ref: resizableRightPanelAPIRef,
    order: 2,
    id: panelGroupDefinition.right.panelId
  }, onHandleDragging];
};
/* harmony default export */ const ResizablePanelsHook = (useResizablePanels);
;// ../../../extensions/default/src/ViewerLayout/index.tsx
function ViewerLayout_extends() { return ViewerLayout_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, ViewerLayout_extends.apply(null, arguments); }









const resizableHandleClassName = 'mt-[1px] bg-black';
function ViewerLayout({
  // From Extension Module Params
  extensionManager,
  servicesManager,
  hotkeysManager,
  commandsManager,
  // From Modes
  viewports,
  ViewportGridComp,
  leftPanelClosed = false,
  rightPanelClosed = false,
  leftPanelResizable = false,
  rightPanelResizable = false,
  leftPanelInitialExpandedWidth,
  rightPanelInitialExpandedWidth,
  leftPanelMinimumExpandedWidth,
  rightPanelMinimumExpandedWidth
}) {
  const [appConfig] = (0,state/* useAppConfig */.r)();
  const {
    panelService,
    hangingProtocolService,
    customizationService
  } = servicesManager.services;
  const [showLoadingIndicator, setShowLoadingIndicator] = (0,react.useState)(appConfig.showLoadingIndicator);
  const hasPanels = (0,react.useCallback)(side => !!panelService.getPanels(side).length, [panelService]);
  const [hasRightPanels, setHasRightPanels] = (0,react.useState)(hasPanels('right'));
  const [hasLeftPanels, setHasLeftPanels] = (0,react.useState)(hasPanels('left'));
  const [leftPanelClosedState, setLeftPanelClosed] = (0,react.useState)(leftPanelClosed);
  const [rightPanelClosedState, setRightPanelClosed] = (0,react.useState)(rightPanelClosed);
  const [leftPanelProps, rightPanelProps, resizablePanelGroupProps, resizableLeftPanelProps, resizableViewportGridPanelProps, resizableRightPanelProps, onHandleDragging] = ResizablePanelsHook(leftPanelClosed, setLeftPanelClosed, rightPanelClosed, setRightPanelClosed, hasLeftPanels, hasRightPanels, leftPanelInitialExpandedWidth, rightPanelInitialExpandedWidth, leftPanelMinimumExpandedWidth, rightPanelMinimumExpandedWidth);
  const handleMouseEnter = () => {
    document.activeElement?.blur();
  };
  const LoadingIndicatorProgress = customizationService.getCustomization('ui.loadingIndicatorProgress');

  /**
   * Set body classes (tailwindcss) that don't allow vertical
   * or horizontal overflow (no scrolling). Also guarantee window
   * is sized to our viewport.
   */
  (0,react.useEffect)(() => {
    document.body.classList.add('bg-black');
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('bg-black');
      document.body.classList.remove('overflow-hidden');
    };
  }, []);
  const getComponent = id => {
    const entry = extensionManager.getModuleEntry(id);
    if (!entry || !entry.component) {
      throw new Error(`${id} is not valid for an extension module or no component found from extension ${id}. Please verify your configuration or ensure that the extension is properly registered. It's also possible that your mode is utilizing a module from an extension that hasn't been included in its dependencies (add the extension to the "extensionDependencies" array in your mode's index.js file). Check the reference string to the extension in your Mode configuration`);
    }
    return {
      entry
    };
  };
  (0,react.useEffect)(() => {
    const {
      unsubscribe
    } = hangingProtocolService.subscribe(src.HangingProtocolService.EVENTS.PROTOCOL_CHANGED,
    // Todo: right now to set the loading indicator to false, we need to wait for the
    // hangingProtocolService to finish applying the viewport matching to each viewport,
    // however, this might not be the only approach to set the loading indicator to false. we need to explore this further.
    () => {
      setShowLoadingIndicator(false);
    });
    return () => {
      unsubscribe();
    };
  }, [hangingProtocolService]);
  const getViewportComponentData = viewportComponent => {
    const {
      entry
    } = getComponent(viewportComponent.namespace);
    return {
      component: entry.component,
      isReferenceViewable: entry.isReferenceViewable,
      displaySetsToDisplay: viewportComponent.displaySetsToDisplay
    };
  };
  (0,react.useEffect)(() => {
    const {
      unsubscribe
    } = panelService.subscribe(panelService.EVENTS.PANELS_CHANGED, ({
      options
    }) => {
      setHasLeftPanels(hasPanels('left'));
      setHasRightPanels(hasPanels('right'));
      if (options?.leftPanelClosed !== undefined) {
        setLeftPanelClosed(options.leftPanelClosed);
      }
      if (options?.rightPanelClosed !== undefined) {
        setRightPanelClosed(options.rightPanelClosed);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [panelService, hasPanels]);
  const viewportComponents = viewports.map(getViewportComponentData);
  return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(ViewerLayout_ViewerHeader, {
    hotkeysManager: hotkeysManager,
    extensionManager: extensionManager,
    servicesManager: servicesManager,
    appConfig: appConfig
  }), /*#__PURE__*/react.createElement("div", {
    className: "relative flex w-full flex-row flex-nowrap items-stretch overflow-hidden bg-black",
    style: {
      height: 'calc(100vh - 52px'
    }
  }, /*#__PURE__*/react.createElement(react.Fragment, null, showLoadingIndicator && /*#__PURE__*/react.createElement(LoadingIndicatorProgress, {
    className: "h-full w-full bg-black"
  }), /*#__PURE__*/react.createElement(ui_next_src/* ResizablePanelGroup */.HKS, resizablePanelGroupProps, hasLeftPanels ? /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement(ui_next_src/* ResizablePanel */.wVo, resizableLeftPanelProps, /*#__PURE__*/react.createElement(Components_SidePanelWithServices, ViewerLayout_extends({
    side: "left",
    isExpanded: !leftPanelClosedState,
    servicesManager: servicesManager
  }, leftPanelProps))), /*#__PURE__*/react.createElement(ui_next_src/* ResizableHandle */.WM_, {
    onDragging: onHandleDragging,
    disabled: !leftPanelResizable,
    className: resizableHandleClassName
  })) : null, /*#__PURE__*/react.createElement(ui_next_src/* ResizablePanel */.wVo, resizableViewportGridPanelProps, /*#__PURE__*/react.createElement("div", {
    className: "flex h-full flex-1 flex-col"
  }, /*#__PURE__*/react.createElement("div", {
    className: "relative flex h-full flex-1 items-center justify-center overflow-hidden bg-black",
    onMouseEnter: handleMouseEnter
  }, /*#__PURE__*/react.createElement(ViewportGridComp, {
    servicesManager: servicesManager,
    viewportComponents: viewportComponents,
    commandsManager: commandsManager
  })))), hasRightPanels ? /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement(ui_next_src/* ResizableHandle */.WM_, {
    onDragging: onHandleDragging,
    disabled: !rightPanelResizable,
    className: resizableHandleClassName
  }), /*#__PURE__*/react.createElement(ui_next_src/* ResizablePanel */.wVo, resizableRightPanelProps, /*#__PURE__*/react.createElement(Components_SidePanelWithServices, ViewerLayout_extends({
    side: "right",
    isExpanded: !rightPanelClosedState,
    servicesManager: servicesManager
  }, rightPanelProps)))) : null))), /*#__PURE__*/react.createElement(ui_next_src/* Onboarding */.M7w, {
    tours: customizationService.getCustomization('ohif.tours')
  }), /*#__PURE__*/react.createElement(ui_next_src/* InvestigationalUseDialog */.jaF, {
    dialogConfiguration: appConfig?.investigationalUseDialog
  }));
}
ViewerLayout.propTypes = {
  // From extension module params
  extensionManager: prop_types_default().shape({
    getModuleEntry: (prop_types_default()).func.isRequired
  }).isRequired,
  commandsManager: prop_types_default().instanceOf(src.CommandsManager),
  servicesManager: (prop_types_default()).object.isRequired,
  // From modes
  leftPanels: (prop_types_default()).array,
  rightPanels: (prop_types_default()).array,
  leftPanelClosed: (prop_types_default()).bool.isRequired,
  rightPanelClosed: (prop_types_default()).bool.isRequired,
  /** Responsible for rendering our grid of viewports; provided by consuming application */
  children: prop_types_default().oneOfType([(prop_types_default()).node, (prop_types_default()).func]).isRequired,
  viewports: (prop_types_default()).array
};
/* harmony default export */ const src_ViewerLayout = (ViewerLayout);
;// ../../../extensions/default/src/getLayoutTemplateModule.js

/*
- Define layout for the viewer in mode configuration.
- Pass in the viewport types that can populate the viewer.
- Init layout based on the displaySets and the objects.
*/

/* harmony default export */ function getLayoutTemplateModule({
  servicesManager,
  extensionManager,
  commandsManager,
  hotkeysManager
}) {
  function ViewerLayoutWithServices(props) {
    return src_ViewerLayout({
      servicesManager,
      extensionManager,
      commandsManager,
      hotkeysManager,
      ...props
    });
  }
  return [
  // Layout Template Definition
  // TODO: this is weird naming
  {
    name: 'viewerLayout',
    id: 'viewerLayout',
    component: ViewerLayoutWithServices
  }];
}
// EXTERNAL MODULE: ../../../extensions/default/src/Panels/StudyBrowser/PanelStudyBrowser.tsx + 3 modules
var PanelStudyBrowser = __webpack_require__(40565);
;// ../../../extensions/default/src/Panels/getImageSrcFromImageId.js
/**
 * @param {*} cornerstone
 * @param {*} imageId
 */
function getImageSrcFromImageId(cornerstone, imageId) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    cornerstone.utilities.loadImageToCanvas({
      canvas,
      imageId,
      thumbnail: true
    }).then(imageId => {
      resolve(canvas.toDataURL());
    }).catch(reject);
  });
}
/* harmony default export */ const Panels_getImageSrcFromImageId = (getImageSrcFromImageId);
;// ../../../extensions/default/src/Panels/getStudiesForPatientByMRN.js
async function getStudiesForPatientByMRN(dataSource, qidoForStudyUID) {
  if (!qidoForStudyUID?.length) {
    return [];
  }
  const mrn = qidoForStudyUID[0].mrn;

  // if not defined or empty, return the original qidoForStudyUID
  if (!mrn) {
    return qidoForStudyUID;
  }
  return dataSource.query.studies.search({
    patientId: mrn,
    disableWildcard: true
  });
}
/* harmony default export */ const Panels_getStudiesForPatientByMRN = (getStudiesForPatientByMRN);
;// ../../../extensions/default/src/Panels/requestDisplaySetCreationForStudy.js
function requestDisplaySetCreationForStudy(dataSource, displaySetService, StudyInstanceUID, madeInClient) {
  // TODO: is this already short-circuited by the map of Retrieve promises?
  if (displaySetService.activeDisplaySets.some(displaySet => displaySet.StudyInstanceUID === StudyInstanceUID)) {
    return;
  }
  return dataSource.retrieve.series.metadata({
    StudyInstanceUID,
    madeInClient
  });
}
/* harmony default export */ const Panels_requestDisplaySetCreationForStudy = (requestDisplaySetCreationForStudy);
;// ../../../extensions/default/src/Panels/WrappedPanelStudyBrowser.tsx

//






/**
 * Wraps the PanelStudyBrowser and provides features afforded by managers/services
 *
 * @param {object} params
 * @param {object} commandsManager
 * @param {object} extensionManager
 */
function WrappedPanelStudyBrowser() {
  const {
    extensionManager
  } = (0,src.useSystem)();
  // TODO: This should be made available a different way; route should have
  // already determined our datasource
  const [dataSource] = extensionManager.getActiveDataSource();
  const _getStudiesForPatientByMRN = Panels_getStudiesForPatientByMRN.bind(null, dataSource);
  const _getImageSrcFromImageId = (0,react.useCallback)(_createGetImageSrcFromImageIdFn(extensionManager), []);
  const _requestDisplaySetCreationForStudy = Panels_requestDisplaySetCreationForStudy.bind(null, dataSource);
  return /*#__PURE__*/react.createElement(PanelStudyBrowser/* default */.A, {
    dataSource: dataSource,
    getImageSrc: _getImageSrcFromImageId,
    getStudiesForPatientByMRN: _getStudiesForPatientByMRN,
    requestDisplaySetCreationForStudy: _requestDisplaySetCreationForStudy
  });
}

/**
 * Grabs cornerstone library reference using a dependent command from
 * the @ohif/extension-cornerstone extension. Then creates a helper function
 * that can take an imageId and return an image src.
 *
 * @param {func} getCommand - CommandManager's getCommand method
 * @returns {func} getImageSrcFromImageId - A utility function powered by
 * cornerstone
 */
function _createGetImageSrcFromImageIdFn(extensionManager) {
  const utilities = extensionManager.getModuleEntry('@ohif/extension-cornerstone.utilityModule.common');
  try {
    const {
      cornerstone
    } = utilities.exports.getCornerstoneLibraries();
    return Panels_getImageSrcFromImageId.bind(null, cornerstone);
  } catch (ex) {
    throw new Error('Required command not found');
  }
}
/* harmony default export */ const Panels_WrappedPanelStudyBrowser = (WrappedPanelStudyBrowser);
// EXTERNAL MODULE: ../../../extensions/default/src/utils/_shared/PROMPT_RESPONSES.ts
var PROMPT_RESPONSES = __webpack_require__(96357);
;// ../../../extensions/default/src/Panels/createReportDialogPrompt.tsx

function CreateReportDialogPrompt({
  title = 'Create Report',
  extensionManager,
  servicesManager
}) {
  const {
    uiDialogService,
    customizationService
  } = servicesManager.services;
  const dataSources = extensionManager.getDataSourcesForUI();
  const ReportDialog = customizationService.getCustomization('ohif.createReportDialog');
  const allowMultipleDataSources = window.config.allowMultiSelectExport;
  return new Promise(function (resolve, reject) {
    uiDialogService.show({
      id: 'report-dialog',
      title,
      content: ReportDialog,
      contentProps: {
        dataSources: allowMultipleDataSources ? dataSources : undefined,
        onSave: async ({
          reportName,
          dataSource: selectedDataSource,
          series
        }) => {
          resolve({
            value: reportName,
            dataSourceName: selectedDataSource,
            series,
            action: PROMPT_RESPONSES/* default */.A.CREATE_REPORT
          });
        },
        onCancel: () => {
          resolve({
            action: PROMPT_RESPONSES/* default */.A.CANCEL,
            value: undefined,
            series: undefined,
            dataSourceName: undefined
          });
        },
        defaultValue: title
      }
    });
  });
}
;// ../../../extensions/default/src/Panels/index.js




// EXTERNAL MODULE: ../../../node_modules/i18next/dist/esm/i18next.js
var i18next = __webpack_require__(40680);
;// ../../../extensions/default/src/getPanelModule.tsx
function getPanelModule_extends() { return getPanelModule_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, getPanelModule_extends.apply(null, arguments); }




// TODO:
// - No loading UI exists yet
// - cancel promises when component is destroyed
// - show errors in UI for thumbnails if promise fails

function getPanelModule({
  commandsManager,
  extensionManager,
  servicesManager
}) {
  return [{
    name: 'seriesList',
    iconName: 'tab-studies',
    iconLabel: 'Studies',
    label: i18next/* default */.A.t('SidePanel:Studies'),
    component: props => /*#__PURE__*/react.createElement(Panels_WrappedPanelStudyBrowser, getPanelModule_extends({}, props, {
      commandsManager: commandsManager,
      extensionManager: extensionManager,
      servicesManager: servicesManager
    }))
  }];
}
/* harmony default export */ const src_getPanelModule = (getPanelModule);
// EXTERNAL MODULE: ../../i18n/src/index.js + 197 modules
var i18n_src = __webpack_require__(89806);
;// ../../../extensions/default/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/extension-default"}');
;// ../../../extensions/default/src/id.js

const id = package_namespaceObject.UU;

// EXTERNAL MODULE: ../../core/src/utils/sortInstancesByPosition.ts
var sortInstancesByPosition = __webpack_require__(44563);
// EXTERNAL MODULE: ../../core/src/utils/isDisplaySetReconstructable.js
var isDisplaySetReconstructable = __webpack_require__(67803);
;// ../../../extensions/default/src/utils/validations/checkMultiframe.ts



/**
 * Check various multi frame issues. It calls OHIF core functions
 * @param {*} multiFrameInstance
 * @param {*} warnings
 */
function checkMultiFrame(multiFrameInstance, messages) {
  if (!(0,isDisplaySetReconstructable/* hasPixelMeasurements */.Yt)(multiFrameInstance)) {
    messages.addMessage(src.DisplaySetMessage.CODES.MULTIFRAME_NO_PIXEL_MEASUREMENTS);
  }
  if (!(0,isDisplaySetReconstructable/* hasOrientation */.VX)(multiFrameInstance)) {
    messages.addMessage(src.DisplaySetMessage.CODES.MULTIFRAME_NO_ORIENTATION);
  }
  if (!(0,isDisplaySetReconstructable/* hasPosition */.sL)(multiFrameInstance)) {
    messages.addMessage(src.DisplaySetMessage.CODES.MULTIFRAME_NO_POSITION_INFORMATION);
  }
}
;// ../../../extensions/default/src/utils/validations/areAllImageDimensionsEqual.ts

const {
  toNumber
} = src.utils;

/**
 * Check if the frames in a series has different dimensions
 * @param {*} instances
 * @returns
 */
function areAllImageDimensionsEqual(instances) {
  if (!instances?.length) {
    return false;
  }
  const firstImage = instances[0];
  const firstImageRows = toNumber(firstImage.Rows);
  const firstImageColumns = toNumber(firstImage.Columns);
  for (let i = 1; i < instances.length; i++) {
    const instance = instances[i];
    const {
      Rows,
      Columns
    } = instance;
    if (toNumber(Rows) !== firstImageRows || toNumber(Columns) !== firstImageColumns) {
      return false;
    }
  }
  return true;
}
// EXTERNAL MODULE: ../../core/src/utils/toNumber.js
var utils_toNumber = __webpack_require__(37827);
;// ../../../extensions/default/src/utils/validations/areAllImageComponentsEqual.ts


/**
 * Check if all voxels in series images has same number of components (samplesPerPixel)
 * @param {*} instances
 * @returns
 */
function areAllImageComponentsEqual(instances) {
  if (!instances?.length) {
    return false;
  }
  const firstImage = instances[0];
  const firstImageSamplesPerPixel = (0,utils_toNumber/* default */.A)(firstImage.SamplesPerPixel);
  for (let i = 1; i < instances.length; i++) {
    const instance = instances[i];
    const {
      SamplesPerPixel
    } = instance;
    if (SamplesPerPixel !== firstImageSamplesPerPixel) {
      return false;
    }
  }
  return true;
}
// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/index.js + 1 modules
var gl_matrix_esm = __webpack_require__(3823);
;// ../../../extensions/default/src/utils/validations/areAllImagePositionsEqual.ts




const {
  calculateScanAxisNormal
} = src.utils;

/**
 * Checks if there is a position shift between consecutive frames
 * @param {*} previousPosition
 * @param {*} actualPosition
 * @param {*} scanAxisNormal
 * @param {*} averageSpacingBetweenFrames
 * @returns
 */
function _checkSeriesPositionShift(previousPosition, actualPosition, scanAxisNormal, averageSpacingBetweenFrames) {
  // predicted position should be the previous position added by the multiplication
  // of the scanAxisNormal and the average spacing between frames
  const predictedPosition = gl_matrix_esm/* vec3.scaleAndAdd */.eR.scaleAndAdd(gl_matrix_esm/* vec3.create */.eR.create(), previousPosition, scanAxisNormal, averageSpacingBetweenFrames);
  return gl_matrix_esm/* vec3.distance */.eR.distance(actualPosition, predictedPosition) > averageSpacingBetweenFrames;
}

/**
 * Checks if a series has position shifts between consecutive frames
 * @param {*} instances
 * @returns
 */
function areAllImagePositionsEqual(instances) {
  if (!instances?.length) {
    return false;
  }
  const firstImageOrientationPatient = (0,utils_toNumber/* default */.A)(instances[0].ImageOrientationPatient);
  if (!firstImageOrientationPatient) {
    return false;
  }
  const scanAxisNormal = calculateScanAxisNormal(firstImageOrientationPatient);
  const firstImagePositionPatient = (0,utils_toNumber/* default */.A)(instances[0].ImagePositionPatient);
  const lastIpp = (0,utils_toNumber/* default */.A)(instances[instances.length - 1].ImagePositionPatient);
  if (!firstImagePositionPatient || !lastIpp) {
    return false;
  }
  const averageSpacingBetweenFrames = (0,isDisplaySetReconstructable/* _getPerpendicularDistance */.jj)(firstImagePositionPatient, lastIpp) / (instances.length - 1);
  let previousImagePositionPatient = firstImagePositionPatient;
  for (let i = 1; i < instances.length; i++) {
    const instance = instances[i];
    const imagePositionPatient = (0,utils_toNumber/* default */.A)(instance.ImagePositionPatient);
    if (_checkSeriesPositionShift(previousImagePositionPatient, imagePositionPatient, scanAxisNormal, averageSpacingBetweenFrames)) {
      return false;
    }
    previousImagePositionPatient = imagePositionPatient;
  }
  return true;
}
;// ../../../extensions/default/src/utils/validations/areAllImageSpacingEqual.ts



/**
 * Checks if series has spacing issues
 * @param {*} instances
 * @param {*} warnings
 */
function areAllImageSpacingEqual(instances, messages) {
  if (!instances?.length) {
    return;
  }
  const firstImagePositionPatient = (0,utils_toNumber/* default */.A)(instances[0].ImagePositionPatient);
  if (!firstImagePositionPatient) {
    return;
  }
  const lastIpp = (0,utils_toNumber/* default */.A)(instances[instances.length - 1].ImagePositionPatient);
  const averageSpacingBetweenFrames = (0,isDisplaySetReconstructable/* _getPerpendicularDistance */.jj)(firstImagePositionPatient, lastIpp) / (instances.length - 1);
  let previousImagePositionPatient = firstImagePositionPatient;
  const issuesFound = [];
  for (let i = 1; i < instances.length; i++) {
    const instance = instances[i];
    const imagePositionPatient = (0,utils_toNumber/* default */.A)(instance.ImagePositionPatient);
    const spacingBetweenFrames = (0,isDisplaySetReconstructable/* _getPerpendicularDistance */.jj)(imagePositionPatient, previousImagePositionPatient);
    const spacingIssue = (0,isDisplaySetReconstructable/* _getSpacingIssue */.Op)(spacingBetweenFrames, averageSpacingBetweenFrames);
    if (spacingIssue) {
      const issue = spacingIssue.issue;

      // avoid multiple warning of the same thing
      if (!issuesFound.includes(issue)) {
        issuesFound.push(issue);
        if (issue === isDisplaySetReconstructable/* reconstructionIssues */.JG.MISSING_FRAMES) {
          messages.addMessage(src.DisplaySetMessage.CODES.MISSING_FRAMES);
        } else if (issue === isDisplaySetReconstructable/* reconstructionIssues */.JG.IRREGULAR_SPACING) {
          messages.addMessage(src.DisplaySetMessage.CODES.IRREGULAR_SPACING);
        }
      }
      // we just want to find issues not how many
      if (issuesFound.length > 1) {
        break;
      }
    }
    previousImagePositionPatient = imagePositionPatient;
  }
}
;// ../../../extensions/default/src/utils/validations/checkSingleFrames.ts





const {
  areAllImageOrientationsEqual
} = src.utils;

/**
 * Runs various checks in a single frame series
 * @param {*} instances
 * @param {*} warnings
 */
function checkSingleFrames(instances, messages) {
  if (instances.length > 2) {
    if (!areAllImageDimensionsEqual(instances)) {
      messages.addMessage(src.DisplaySetMessage.CODES.INCONSISTENT_DIMENSIONS);
    }
    if (!areAllImageComponentsEqual(instances)) {
      messages.addMessage(src.DisplaySetMessage.CODES.INCONSISTENT_COMPONENTS);
    }
    if (!areAllImageOrientationsEqual(instances)) {
      messages.addMessage(src.DisplaySetMessage.CODES.INCONSISTENT_ORIENTATIONS);
    }
    if (!areAllImagePositionsEqual(instances)) {
      messages.addMessage(src.DisplaySetMessage.CODES.INCONSISTENT_POSITION_INFORMATION);
    }
    areAllImageSpacingEqual(instances, messages);
  }
}
;// ../../../extensions/default/src/getDisplaySetMessages.ts





/**
 * Checks if a series is reconstructable to a 3D volume.
 *
 * @param {Object[]} instances An array of `OHIFInstanceMetadata` objects.
 */
function getDisplaySetMessages(instances, isReconstructable, isDynamicVolume) {
  const messages = new src.DisplaySetMessageList();
  if (isDynamicVolume) {
    return messages;
  }
  if (!instances.length) {
    messages.addMessage(src.DisplaySetMessage.CODES.NO_VALID_INSTANCES);
    return;
  }
  const firstInstance = instances[0];
  const {
    Modality,
    ImageType,
    NumberOfFrames
  } = firstInstance;
  // Due to current requirements, LOCALIZER series doesn't have any messages
  if (ImageType?.includes('LOCALIZER')) {
    return messages;
  }
  if (!isDisplaySetReconstructable/* constructableModalities */.Hf.includes(Modality)) {
    return messages;
  }
  const isMultiframe = NumberOfFrames > 1;
  // Can't reconstruct if all instances don't have the ImagePositionPatient.
  if (!isMultiframe && !instances.every(instance => instance.ImagePositionPatient)) {
    messages.addMessage(src.DisplaySetMessage.CODES.NO_POSITION_INFORMATION);
  }
  const sortedInstances = (0,sortInstancesByPosition/* default */.A)(instances);
  isMultiframe ? checkMultiFrame(sortedInstances[0], messages) : checkSingleFrames(sortedInstances, messages);
  if (!isReconstructable) {
    messages.addMessage(src.DisplaySetMessage.CODES.NOT_RECONSTRUCTABLE);
  }
  return messages;
}
// EXTERNAL MODULE: ../../core/src/classes/ImageSet.ts
var ImageSet = __webpack_require__(14169);
;// ../../../extensions/default/src/getDisplaySetsFromUnsupportedSeries.js


/**
 * Default handler for a instance list with an unsupported sopClassUID
 */
function getDisplaySetsFromUnsupportedSeries(instances) {
  const imageSet = new ImageSet/* default */.A(instances);
  const messages = new src.DisplaySetMessageList();
  const instance = instances[0];
  if (!instances.length) {
    messages.addMessage(src.DisplaySetMessage.CODES.NO_VALID_INSTANCES);
  } else {
    const sopClassUid = instance.SOPClassUID;
    if (sopClassUid) {
      messages.addMessage(src.DisplaySetMessage.CODES.UNSUPPORTED_SOP_CLASS_UID, {
        sopClassUid
      });
    } else {
      messages.addMessage(src.DisplaySetMessage.CODES.MISSING_SOP_CLASS_UID);
    }
  }
  imageSet.setAttributes({
    displaySetInstanceUID: imageSet.uid,
    // create a local alias for the imageSet UID
    SeriesDate: instance.SeriesDate,
    SeriesTime: instance.SeriesTime,
    SeriesInstanceUID: instance.SeriesInstanceUID,
    StudyInstanceUID: instance.StudyInstanceUID,
    SeriesNumber: instance.SeriesNumber || 0,
    FrameRate: instance.FrameTime,
    SOPClassUID: instance.SOPClassUID,
    SeriesDescription: instance.SeriesDescription || '',
    Modality: instance.Modality,
    numImageFrames: instances.length,
    unsupported: true,
    SOPClassHandlerId: 'unsupported',
    isReconstructable: false,
    messages
  });
  return [imageSet];
}
;// ../../../extensions/default/src/SOPClassHandlers/chartSOPClassHandler.ts


const SOPClassHandlerName = 'chart';
const CHART_MODALITY = 'CHT';

// Private SOPClassUid for chart data
const ChartDataSOPClassUid = '1.9.451.13215.7.3.2.7.6.1';
const sopClassUids = [ChartDataSOPClassUid];
const makeChartDataDisplaySet = (instance, sopClassUids) => {
  const {
    StudyInstanceUID,
    SeriesInstanceUID,
    SOPInstanceUID,
    SeriesDescription,
    SeriesNumber,
    SeriesDate,
    SOPClassUID
  } = instance;
  return {
    Modality: CHART_MODALITY,
    loading: false,
    isReconstructable: false,
    displaySetInstanceUID: src.utils.guid(),
    SeriesDescription,
    SeriesNumber,
    SeriesDate,
    SOPInstanceUID,
    SeriesInstanceUID,
    StudyInstanceUID,
    SOPClassHandlerId: `${id}.sopClassHandlerModule.${SOPClassHandlerName}`,
    SOPClassUID,
    isDerivedDisplaySet: true,
    isLoaded: true,
    sopClassUids,
    instance,
    instances: [instance],
    /**
     * Adds instances to the chart displaySet, rather than creating a new one
     * when user moves to a different workflow step and gets back to a step that
     * recreates the chart
     */
    addInstances: function (instances, _displaySetService) {
      this.instances.push(...instances);
      this.instance = this.instances[this.instances.length - 1];
      return this;
    }
  };
};
function getSopClassUids(instances) {
  const uniqueSopClassUidsInSeries = new Set();
  instances.forEach(instance => {
    uniqueSopClassUidsInSeries.add(instance.SOPClassUID);
  });
  const sopClassUids = Array.from(uniqueSopClassUidsInSeries);
  return sopClassUids;
}
function _getDisplaySetsFromSeries(instances) {
  // If the series has no instances, stop here
  if (!instances || !instances.length) {
    throw new Error('No instances were provided');
  }
  const sopClassUids = getSopClassUids(instances);
  const displaySets = instances.map(instance => {
    if (instance.Modality === CHART_MODALITY) {
      return makeChartDataDisplaySet(instance, sopClassUids);
    }
    throw new Error('Unsupported modality');
  });
  return displaySets;
}
const chartHandler = {
  name: SOPClassHandlerName,
  sopClassUids,
  getDisplaySetsFromSeries: instances => {
    return _getDisplaySetsFromSeries(instances);
  }
};

;// ../../../extensions/default/src/getSopClassHandlerModule.js






const {
  isImage,
  sortStudyInstances,
  instancesSortCriteria,
  sopClassDictionary,
  isDisplaySetReconstructable: getSopClassHandlerModule_isDisplaySetReconstructable
} = src.utils;
const {
  ImageSet: getSopClassHandlerModule_ImageSet
} = src.classes;
const DEFAULT_VOLUME_LOADER_SCHEME = 'cornerstoneStreamingImageVolume';
const DYNAMIC_VOLUME_LOADER_SCHEME = 'cornerstoneStreamingDynamicImageVolume';
const sopClassHandlerName = 'stack';
let appContext = {};
const getDynamicVolumeInfo = instances => {
  const {
    extensionManager
  } = appContext;
  if (!extensionManager) {
    throw new Error('extensionManager is not available');
  }
  const imageIds = instances.map(({
    imageId
  }) => imageId);
  const volumeLoaderUtility = extensionManager.getModuleEntry('@ohif/extension-cornerstone.utilityModule.volumeLoader');
  const {
    getDynamicVolumeInfo: csGetDynamicVolumeInfo
  } = volumeLoaderUtility.exports;
  return csGetDynamicVolumeInfo(imageIds);
};
const isMultiFrame = instance => {
  return instance.NumberOfFrames > 1;
};
function getDisplaySetInfo(instances) {
  const dynamicVolumeInfo = getDynamicVolumeInfo(instances);
  const {
    isDynamicVolume,
    timePoints
  } = dynamicVolumeInfo;
  let displaySetInfo;
  const {
    appConfig
  } = appContext;
  if (isDynamicVolume) {
    const timePoint = timePoints[0];
    const instancesMap = new Map();

    // O(n) to convert it into a map and O(1) to find each instance
    instances.forEach(instance => instancesMap.set(instance.imageId, instance));
    const firstTimePointInstances = timePoint.map(imageId => instancesMap.get(imageId));
    displaySetInfo = getSopClassHandlerModule_isDisplaySetReconstructable(firstTimePointInstances, appConfig);
  } else {
    displaySetInfo = getSopClassHandlerModule_isDisplaySetReconstructable(instances, appConfig);
  }
  return {
    isDynamicVolume,
    ...displaySetInfo,
    dynamicVolumeInfo
  };
}
const makeDisplaySet = instances => {
  // Need to sort the instances in order to get a consistent instance/thumbnail
  sortStudyInstances(instances);
  const instance = instances[0];
  const imageSet = new getSopClassHandlerModule_ImageSet(instances);
  const {
    extensionManager
  } = appContext;
  const dataSource = extensionManager.getActiveDataSource()[0];
  const {
    isDynamicVolume,
    value: isReconstructable,
    averageSpacingBetweenFrames,
    dynamicVolumeInfo
  } = getDisplaySetInfo(instances);
  const volumeLoaderSchema = isDynamicVolume ? DYNAMIC_VOLUME_LOADER_SCHEME : DEFAULT_VOLUME_LOADER_SCHEME;

  // set appropriate attributes to image set...
  const messages = getDisplaySetMessages(instances, isReconstructable, isDynamicVolume);
  const imageIds = dataSource.getImageIdsForDisplaySet(imageSet);
  let imageId = imageIds[Math.floor(imageIds.length / 2)];
  let thumbnailInstance = instances[Math.floor(instances.length / 2)];
  if (isDynamicVolume) {
    const timePoints = dynamicVolumeInfo.timePoints;
    const middleIndex = Math.floor(timePoints.length / 2);
    const middleTimePointImageIds = timePoints[middleIndex];
    imageId = middleTimePointImageIds[Math.floor(middleTimePointImageIds.length / 2)];
  }
  imageSet.setAttributes({
    volumeLoaderSchema,
    displaySetInstanceUID: imageSet.uid,
    // create a local alias for the imageSet UID
    SeriesDate: instance.SeriesDate,
    SeriesTime: instance.SeriesTime,
    SeriesInstanceUID: instance.SeriesInstanceUID,
    StudyInstanceUID: instance.StudyInstanceUID,
    SeriesNumber: instance.SeriesNumber || 0,
    FrameRate: instance.FrameTime,
    SOPClassUID: instance.SOPClassUID,
    SeriesDescription: instance.SeriesDescription || '',
    Modality: instance.Modality,
    isMultiFrame: isMultiFrame(instance),
    countIcon: isReconstructable ? 'icon-mpr' : undefined,
    numImageFrames: instances.length,
    SOPClassHandlerId: `${id}.sopClassHandlerModule.${sopClassHandlerName}`,
    isReconstructable,
    messages,
    averageSpacingBetweenFrames: averageSpacingBetweenFrames || null,
    isDynamicVolume,
    dynamicVolumeInfo,
    getThumbnailSrc: dataSource.retrieve.getGetThumbnailSrc?.(thumbnailInstance, imageId),
    supportsWindowLevel: true,
    label: instance.SeriesDescription || `${i18n_src/* default */.A.t('Series')} ${instance.SeriesNumber} - ${i18n_src/* default */.A.t(instance.Modality)}`,
    FrameOfReferenceUID: instance.FrameOfReferenceUID
  });
  const {
    servicesManager
  } = appContext;
  const {
    customizationService
  } = servicesManager.services;
  imageSet.sort(customizationService);

  // Include the first image instance number (after sorted)
  /*imageSet.setAttribute(
    'instanceNumber',
    imageSet.getImage(0).InstanceNumber
  );*/

  /*const isReconstructable = isDisplaySetReconstructable(series, instances);
   imageSet.isReconstructable = isReconstructable.value;
   if (isReconstructable.missingFrames) {
    // TODO -> This is currently unused, but may be used for reconstructing
    // Volumes with gaps later on.
    imageSet.missingFrames = isReconstructable.missingFrames;
  }*/

  return imageSet;
};
const isSingleImageModality = modality => {
  return modality === 'CR' || modality === 'MG' || modality === 'DX';
};
function getSopClassHandlerModule_getSopClassUids(instances) {
  const uniqueSopClassUidsInSeries = new Set();
  instances.forEach(instance => {
    uniqueSopClassUidsInSeries.add(instance.SOPClassUID);
  });
  const sopClassUids = Array.from(uniqueSopClassUidsInSeries);
  return sopClassUids;
}

/**
 * Basic SOPClassHandler:
 * - For all Image types that are stackable, create
 *   a displaySet with a stack of images
 *
 * @param {SeriesMetadata} series The series metadata object from which the display sets will be created
 * @returns {Array} The list of display sets created for the given series object
 */
function getDisplaySetsFromSeries(instances) {
  // If the series has no instances, stop here
  if (!instances || !instances.length) {
    throw new Error('No instances were provided');
  }
  const displaySets = [];
  const sopClassUids = getSopClassHandlerModule_getSopClassUids(instances);

  // Search through the instances (InstanceMetadata object) of this series
  // Split Multi-frame instances and Single-image modalities
  // into their own specific display sets. Place the rest of each
  // series into another display set.
  const stackableInstances = [];
  instances.forEach(instance => {
    // All imaging modalities must have a valid value for sopClassUid (x00080016) or rows (x00280010)
    if (!isImage(instance.SOPClassUID) && !instance.Rows) {
      return;
    }
    let displaySet;
    if (isMultiFrame(instance)) {
      displaySet = makeDisplaySet([instance]);
      displaySet.setAttributes({
        sopClassUids,
        numImageFrames: instance.NumberOfFrames,
        instanceNumber: instance.InstanceNumber,
        acquisitionDatetime: instance.AcquisitionDateTime
      });
      displaySets.push(displaySet);
    } else if (isSingleImageModality(instance.Modality)) {
      displaySet = makeDisplaySet([instance]);
      displaySet.setAttributes({
        sopClassUids,
        instanceNumber: instance.InstanceNumber,
        acquisitionDatetime: instance.AcquisitionDateTime
      });
      displaySets.push(displaySet);
    } else {
      stackableInstances.push(instance);
    }
  });
  if (stackableInstances.length) {
    const displaySet = makeDisplaySet(stackableInstances);
    displaySet.setAttribute('studyInstanceUid', instances[0].StudyInstanceUID);
    displaySet.setAttributes({
      sopClassUids
    });
    displaySets.push(displaySet);
  }
  return displaySets;
}
const getSopClassHandlerModule_sopClassUids = [sopClassDictionary.ComputedRadiographyImageStorage, sopClassDictionary.DigitalXRayImageStorageForPresentation, sopClassDictionary.DigitalXRayImageStorageForProcessing, sopClassDictionary.DigitalMammographyXRayImageStorageForPresentation, sopClassDictionary.DigitalMammographyXRayImageStorageForProcessing, sopClassDictionary.DigitalIntraOralXRayImageStorageForPresentation, sopClassDictionary.DigitalIntraOralXRayImageStorageForProcessing, sopClassDictionary.CTImageStorage, sopClassDictionary.EnhancedCTImageStorage, sopClassDictionary.LegacyConvertedEnhancedCTImageStorage, sopClassDictionary.UltrasoundMultiframeImageStorage, sopClassDictionary.MRImageStorage, sopClassDictionary.EnhancedMRImageStorage, sopClassDictionary.EnhancedMRColorImageStorage, sopClassDictionary.LegacyConvertedEnhancedMRImageStorage, sopClassDictionary.UltrasoundImageStorage, sopClassDictionary.UltrasoundImageStorageRET, sopClassDictionary.SecondaryCaptureImageStorage, sopClassDictionary.MultiframeSingleBitSecondaryCaptureImageStorage, sopClassDictionary.MultiframeGrayscaleByteSecondaryCaptureImageStorage, sopClassDictionary.MultiframeGrayscaleWordSecondaryCaptureImageStorage, sopClassDictionary.MultiframeTrueColorSecondaryCaptureImageStorage, sopClassDictionary.XRayAngiographicImageStorage, sopClassDictionary.EnhancedXAImageStorage, sopClassDictionary.XRayRadiofluoroscopicImageStorage, sopClassDictionary.EnhancedXRFImageStorage, sopClassDictionary.XRay3DAngiographicImageStorage, sopClassDictionary.XRay3DCraniofacialImageStorage, sopClassDictionary.BreastTomosynthesisImageStorage, sopClassDictionary.BreastProjectionXRayImageStorageForPresentation, sopClassDictionary.BreastProjectionXRayImageStorageForProcessing, sopClassDictionary.IntravascularOpticalCoherenceTomographyImageStorageForPresentation, sopClassDictionary.IntravascularOpticalCoherenceTomographyImageStorageForProcessing, sopClassDictionary.NuclearMedicineImageStorage, sopClassDictionary.VLEndoscopicImageStorage, sopClassDictionary.VideoEndoscopicImageStorage, sopClassDictionary.VLMicroscopicImageStorage, sopClassDictionary.VideoMicroscopicImageStorage, sopClassDictionary.VLSlideCoordinatesMicroscopicImageStorage, sopClassDictionary.VLPhotographicImageStorage, sopClassDictionary.VideoPhotographicImageStorage, sopClassDictionary.OphthalmicPhotography8BitImageStorage, sopClassDictionary.OphthalmicPhotography16BitImageStorage, sopClassDictionary.OphthalmicTomographyImageStorage,
// Handled by another sop class module
// sopClassDictionary.VLWholeSlideMicroscopyImageStorage,
sopClassDictionary.PositronEmissionTomographyImageStorage, sopClassDictionary.EnhancedPETImageStorage, sopClassDictionary.LegacyConvertedEnhancedPETImageStorage, sopClassDictionary.RTImageStorage, sopClassDictionary.EnhancedUSVolumeStorage, sopClassDictionary.RTDoseStorage];
function getSopClassHandlerModule(appContextParam) {
  appContext = appContextParam;
  return [{
    name: sopClassHandlerName,
    sopClassUids: getSopClassHandlerModule_sopClassUids,
    getDisplaySetsFromSeries
  }, {
    name: 'not-supported-display-sets-handler',
    sopClassUids: [],
    getDisplaySetsFromSeries: getDisplaySetsFromUnsupportedSeries
  }, {
    name: chartHandler.name,
    sopClassUids: chartHandler.sopClassUids,
    getDisplaySetsFromSeries: chartHandler.getDisplaySetsFromSeries
  }];
}
/* harmony default export */ const src_getSopClassHandlerModule = (getSopClassHandlerModule);
;// ../../../extensions/default/src/Toolbar/ToolbarLayoutSelector.tsx
function ToolbarLayoutSelector_extends() { return ToolbarLayoutSelector_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, ToolbarLayoutSelector_extends.apply(null, arguments); }
// Updated ToolbarLayoutSelector.tsx




function ToolbarLayoutSelectorWithServices({
  commandsManager,
  servicesManager,
  rows = 3,
  columns = 4,
  ...props
}) {
  const {
    customizationService
  } = servicesManager.services;

  // Get the presets from the customization service
  const commonPresets = customizationService?.getCustomization('layoutSelector.commonPresets') || [{
    icon: 'layout-single',
    commandOptions: {
      numRows: 1,
      numCols: 1
    }
  }, {
    icon: 'layout-side-by-side',
    commandOptions: {
      numRows: 1,
      numCols: 2
    }
  }, {
    icon: 'layout-four-up',
    commandOptions: {
      numRows: 2,
      numCols: 2
    }
  }, {
    icon: 'layout-three-row',
    commandOptions: {
      numRows: 3,
      numCols: 1
    }
  }];

  // Get the advanced presets generator from the customization service
  const advancedPresetsGenerator = customizationService?.getCustomization('layoutSelector.advancedPresetGenerator');

  // Generate the advanced presets
  const advancedPresets = advancedPresetsGenerator ? advancedPresetsGenerator({
    servicesManager
  }) : [{
    title: 'MPR',
    icon: 'layout-three-col',
    commandOptions: {
      protocolId: 'mpr'
    }
  }, {
    title: '3D four up',
    icon: 'layout-four-up',
    commandOptions: {
      protocolId: '3d-four-up'
    }
  }, {
    title: '3D main',
    icon: 'layout-three-row',
    commandOptions: {
      protocolId: '3d-main'
    }
  }, {
    title: 'Axial Primary',
    icon: 'layout-side-by-side',
    commandOptions: {
      protocolId: 'axial-primary'
    }
  }, {
    title: '3D only',
    icon: 'layout-single',
    commandOptions: {
      protocolId: '3d-only'
    }
  }, {
    title: '3D primary',
    icon: 'layout-side-by-side',
    commandOptions: {
      protocolId: '3d-primary'
    }
  }, {
    title: 'Frame View',
    icon: 'icon-stack',
    commandOptions: {
      protocolId: 'frame-view'
    }
  }];

  // Unified selection handler that dispatches to the appropriate command
  const handleSelectionChange = (0,react.useCallback)((commandOptions, isPreset) => {
    if (isPreset) {
      // Advanced preset selection
      commandsManager.run({
        commandName: 'setHangingProtocol',
        commandOptions
      });
    } else {
      // Common preset or custom grid selection
      commandsManager.run({
        commandName: 'setViewportGridLayout',
        commandOptions
      });
    }
  }, [commandsManager]);
  return /*#__PURE__*/react.createElement("div", {
    id: "Layout",
    "data-cy": "Layout"
  }, /*#__PURE__*/react.createElement(ui_next_src/* LayoutSelector */.sG4, ToolbarLayoutSelector_extends({
    onSelectionChange: handleSelectionChange
  }, props), /*#__PURE__*/react.createElement(ui_next_src/* LayoutSelector */.sG4.Trigger, {
    tooltip: "Change layout"
  }), /*#__PURE__*/react.createElement(ui_next_src/* LayoutSelector */.sG4.Content, null, (commonPresets.length > 0 || advancedPresets.length > 0) && /*#__PURE__*/react.createElement("div", {
    className: "bg-popover flex flex-col gap-2.5 rounded-lg p-2"
  }, commonPresets.length > 0 && /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement(ui_next_src/* LayoutSelector */.sG4.PresetSection, {
    title: "Common"
  }, commonPresets.map((preset, index) => /*#__PURE__*/react.createElement(ui_next_src/* LayoutSelector */.sG4.Preset, {
    key: `common-preset-${index}`,
    icon: preset.icon,
    commandOptions: preset.commandOptions,
    isPreset: false
  }))), /*#__PURE__*/react.createElement(ui_next_src/* LayoutSelector */.sG4.Divider, null)), advancedPresets.length > 0 && /*#__PURE__*/react.createElement(ui_next_src/* LayoutSelector */.sG4.PresetSection, {
    title: "Advanced"
  }, advancedPresets.map((preset, index) => /*#__PURE__*/react.createElement(ui_next_src/* LayoutSelector */.sG4.Preset, {
    key: `advanced-preset-${index}`,
    title: preset.title,
    icon: preset.icon,
    commandOptions: preset.commandOptions,
    disabled: preset.disabled,
    isPreset: true
  })))), /*#__PURE__*/react.createElement("div", {
    className: "bg-muted flex flex-col gap-2.5 border-l-2 border-solid border-black p-2"
  }, /*#__PURE__*/react.createElement("div", {
    className: "text-muted-foreground text-xs"
  }, "Custom"), /*#__PURE__*/react.createElement(ui_next_src/* LayoutSelector */.sG4.GridSelector, {
    rows: rows,
    columns: columns
  }), /*#__PURE__*/react.createElement(ui_next_src/* LayoutSelector */.sG4.HelpText, null, "Hover to select ", /*#__PURE__*/react.createElement("br", null), "rows and columns ", /*#__PURE__*/react.createElement("br", null), " Click to apply")))));
}
ToolbarLayoutSelectorWithServices.propTypes = {
  commandsManager: prop_types_default().instanceOf(src.CommandsManager),
  servicesManager: (prop_types_default()).object,
  rows: (prop_types_default()).number,
  columns: (prop_types_default()).number
};
/* harmony default export */ const ToolbarLayoutSelector = (ToolbarLayoutSelectorWithServices);
;// ../../../extensions/default/src/Components/ProgressDropdownWithService.tsx



const workflowStepsToDropdownOptions = (steps = []) => steps.map(step => ({
  label: step.name,
  value: step.id,
  info: step.info,
  activated: false,
  completed: false
}));
function ProgressDropdownWithService() {
  const {
    servicesManager
  } = (0,src.useSystem)();
  const {
    workflowStepsService
  } = servicesManager.services;
  const [activeStepId, setActiveStepId] = (0,react.useState)(workflowStepsService.activeWorkflowStep?.id);
  const [dropdownOptions, setDropdownOptions] = (0,react.useState)(workflowStepsToDropdownOptions(workflowStepsService.workflowSteps));
  const setCurrentAndPreviousOptionsAsCompleted = (0,react.useCallback)(currentOption => {
    if (currentOption.completed) {
      return;
    }
    setDropdownOptions(prevOptions => {
      const newOptionsState = [...prevOptions];
      const startIndex = newOptionsState.findIndex(option => option.value === currentOption.value);
      for (let i = startIndex; i >= 0; i--) {
        const option = newOptionsState[i];
        if (option.completed) {
          break;
        }
        newOptionsState[i] = {
          ...option,
          completed: true
        };
      }
      return newOptionsState;
    });
  }, []);
  const handleDropdownChange = (0,react.useCallback)(({
    selectedOption
  }) => {
    if (!selectedOption) {
      return;
    }

    // TODO: Steps should be marked as completed after user has
    // completed some action when required (not implemented)
    setCurrentAndPreviousOptionsAsCompleted(selectedOption);
    setActiveStepId(selectedOption.value);
  }, [setCurrentAndPreviousOptionsAsCompleted]);
  (0,react.useEffect)(() => {
    let timeoutId;
    if (activeStepId) {
      // We've used setTimeout to give it more time to update the UI since
      // create3DFilterableFromDataArray from Texture.js may take 600+ ms to run
      // when there is a new series to load in the next step but that resulted
      // in the followed React error when updating the content from left/right panels
      // and all component states were being lost:
      //   Error: Can't perform a React state update on an unmounted component
      workflowStepsService.setActiveWorkflowStep(activeStepId);
    }
    return () => clearTimeout(timeoutId);
  }, [activeStepId, workflowStepsService]);
  (0,react.useEffect)(() => {
    const {
      unsubscribe: unsubStepsChanged
    } = workflowStepsService.subscribe(workflowStepsService.EVENTS.STEPS_CHANGED, () => setDropdownOptions(workflowStepsToDropdownOptions(workflowStepsService.workflowSteps)));
    const {
      unsubscribe: unsubActiveStepChanged
    } = workflowStepsService.subscribe(workflowStepsService.EVENTS.ACTIVE_STEP_CHANGED, () => setActiveStepId(workflowStepsService.activeWorkflowStep.id));
    return () => {
      unsubStepsChanged();
      unsubActiveStepChanged();
    };
  }, [servicesManager, workflowStepsService]);
  return /*#__PURE__*/react.createElement(ui_next_src/* ProgressDropdown */.LWY, {
    options: dropdownOptions,
    value: activeStepId,
    onChange: handleDropdownChange
  });
}
;// ../../../extensions/default/src/Toolbar/ToolButtonListWrapper.tsx
function ToolButtonListWrapper_extends() { return ToolButtonListWrapper_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, ToolButtonListWrapper_extends.apply(null, arguments); }



/**
 * Wraps the ToolButtonList component to handle the OHIF toolbar button structure
 * @param props - Component props
 * @returns Component
 * // test
 */
function ToolButtonListWrapper({
  buttonSection,
  id
}) {
  const {
    onInteraction,
    toolbarButtons
  } = (0,src.useToolbar)({
    buttonSection
  });
  if (!toolbarButtons?.length) {
    return null;
  }
  const primary = toolbarButtons.find(button => button.componentProps.isActive)?.componentProps || toolbarButtons[0].componentProps;
  const items = toolbarButtons.map(button => button.componentProps);
  return /*#__PURE__*/react.createElement(ui_next_src/* ToolButtonList */.XI3, null, /*#__PURE__*/react.createElement(ui_next_src/* ToolButtonListDefault */.mkO, null, /*#__PURE__*/react.createElement("div", {
    "data-cy": `${id}-split-button-primary`,
    "data-tool": primary.id,
    "data-active": primary.isActive
  }, /*#__PURE__*/react.createElement(ui_next_src/* ToolButton */.T0e, ToolButtonListWrapper_extends({}, primary, {
    onInteraction: ({
      itemId
    }) => onInteraction?.({
      id,
      itemId,
      commands: primary.commands
    }),
    className: primary.className
  })))), /*#__PURE__*/react.createElement(ui_next_src/* ToolButtonListDivider */.ItI, {
    className: primary.isActive ? 'opacity-0' : 'opacity-100'
  }), /*#__PURE__*/react.createElement("div", {
    "data-cy": `${id}-split-button-secondary`
  }, /*#__PURE__*/react.createElement(ui_next_src/* ToolButtonListDropDown */.oID, null, items.map(item => {
    return /*#__PURE__*/react.createElement(ui_next_src/* ToolButtonListItem */.U$I, ToolButtonListWrapper_extends({
      key: item.id
    }, item, {
      "data-cy": item.id,
      "data-tool": item.id,
      "data-active": item.isActive,
      onSelect: () => onInteraction?.({
        id,
        itemId: item.id,
        commands: item.commands
      })
    }), /*#__PURE__*/react.createElement("span", {
      className: "pl-1"
    }, item.label || item.tooltip || item.id));
  }))));
}
;// ../../../extensions/default/src/Toolbar/ToolRowWrapper.tsx
function ToolRowWrapper_extends() { return ToolRowWrapper_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, ToolRowWrapper_extends.apply(null, arguments); }


function ToolRowWrapper({
  buttonSection,
  className = '',
  show = true
}) {
  const {
    onInteraction,
    toolbarButtons
  } = (0,src.useToolbar)({
    buttonSection
  });

  // No need for debugger statement
  if (!toolbarButtons?.length) {
    return null;
  }
  return /*#__PURE__*/react.createElement("div", {
    className: `space-x-1} flex flex-row items-center ${className}`
  }, toolbarButtons.map((button, index) => {
    const {
      id,
      Component,
      componentProps
    } = button;
    return /*#__PURE__*/react.createElement("div", {
      key: id || index,
      className: "flex-shrink-0"
    }, /*#__PURE__*/react.createElement(Component, ToolRowWrapper_extends({}, componentProps, {
      onInteraction: onInteraction,
      location: componentProps.location || buttonSection
    })));
  }));
}
/* harmony default export */ const Toolbar_ToolRowWrapper = (ToolRowWrapper);
// EXTERNAL MODULE: ../../../node_modules/classnames/index.js
var classnames = __webpack_require__(55530);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ../../core/src/hooks/useToolbar.tsx
var useToolbar = __webpack_require__(8992);
;// ../../../extensions/default/src/Toolbar/ToolBoxWrapper.tsx
function ToolBoxWrapper_extends() { return ToolBoxWrapper_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, ToolBoxWrapper_extends.apply(null, arguments); }





/**
 * Wraps the ToolButtonList component to handle the OHIF toolbar button structure
 * @param props - Component props
 * @returns Component
 */
function ToolBoxButtonGroupWrapper({
  buttonSection,
  id
}) {
  const {
    onInteraction,
    toolbarButtons
  } = (0,useToolbar/* useToolbar */.t)({
    buttonSection
  });
  if (!buttonSection) {
    return null;
  }
  const items = toolbarButtons.map(button => button.componentProps);
  return /*#__PURE__*/react.createElement("div", {
    className: "bg-popover flex flex-row space-x-1 rounded-md px-0 py-0"
  }, items.map(item => /*#__PURE__*/react.createElement(ui_next_src/* ToolButton */.T0e, ToolBoxWrapper_extends({}, item, {
    key: item.id,
    size: "small",
    className: item.disabled && 'text-foreground/70',
    onInteraction: event => {
      onInteraction?.({
        event,
        id,
        commands: item.commands,
        itemId: item.id,
        item
      });
    }
  }))));
}
function ToolBoxButtonWrapper({
  onInteraction,
  className,
  options,
  ...props
}) {
  return /*#__PURE__*/react.createElement("div", {
    className: "bg-popover flex flex-row rounded-md px-0 py-0"
  }, /*#__PURE__*/react.createElement(ui_next_src/* ToolButton */.T0e, ToolBoxWrapper_extends({}, props, {
    id: props.id,
    size: "small",
    className: classnames_default()(props.disabled && 'text-foreground/70', className),
    onInteraction: event => {
      onInteraction?.({
        event,
        itemId: props.id,
        commands: props.commands,
        options
      });
    }
  })));
}
;// ../../../extensions/default/src/Toolbar/ToolButtonWrapper.tsx
function ToolButtonWrapper_extends() { return ToolButtonWrapper_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, ToolButtonWrapper_extends.apply(null, arguments); }


function ToolButtonWrapper(props) {
  const {
    IconContainer,
    containerProps
  } = (0,ui_next_src/* useIconPresentation */.n1D)();
  const Icon = /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ByName, {
    name: props.icon
  });
  return /*#__PURE__*/react.createElement("div", null, IconContainer ? /*#__PURE__*/react.createElement(IconContainer, ToolButtonWrapper_extends({
    disabled: props.disabled
  }, props, containerProps), Icon) : /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    size: "icon",
    disabled: props.disabled
  }, Icon));
}

;// ../../../extensions/default/src/getToolbarModule.tsx



// legacy


// new




function getToolbarModule({
  commandsManager,
  servicesManager
}) {
  const {
    cineService
  } = servicesManager.services;
  return [
  // new
  {
    name: 'ohif.toolButton',
    defaultComponent: ToolButtonWrapper
  }, {
    name: 'ohif.toolButtonList',
    defaultComponent: ToolButtonListWrapper
  }, {
    name: 'ohif.row',
    defaultComponent: Toolbar_ToolRowWrapper
  }, {
    name: 'ohif.toolBoxButtonGroup',
    defaultComponent: ToolBoxButtonGroupWrapper
  }, {
    name: 'ohif.toolBoxButton',
    defaultComponent: ToolBoxButtonWrapper
  },
  // others
  {
    name: 'ohif.layoutSelector',
    defaultComponent: props => ToolbarLayoutSelector({
      ...props,
      commandsManager,
      servicesManager
    })
  }, {
    name: 'ohif.progressDropdown',
    defaultComponent: ProgressDropdownWithService
  }, {
    name: 'evaluate.cine',
    evaluate: () => {
      const isToggled = cineService.getState().isCineEnabled;
      return {
        className: ui_next_src/* utils.getToggledClassName */.WpD.getToggledClassName(isToggled)
      };
    }
  }];
}
;// ../../../extensions/default/src/CustomizableContextMenu/ContextMenuItemsBuilder.ts
/**
 * Finds menu by menu id
 *
 * @returns Menu having the menuId
 */
function findMenuById(menus, menuId) {
  if (!menuId) {
    return;
  }
  return menus.find(menu => menu.id === menuId);
}

/**
 * Default finding menu method.  This method will go through
 * the list of menus until it finds the first one which
 * has no selector, OR has the selector, when applied to the
 * check props, return true.
 * The selectorProps are a set of provided properties which can be
 * passed into the selector function to determine when to display a menu.
 * For example, a selector function of:
 * `({displayset}) => displaySet?.SeriesDescription?.indexOf?.('Left')!==-1
 * would match series descriptions containing 'Left'.
 *
 * @param {Object[]} menus List of menus
 * @param {*} subProps
 * @returns
 */
function findMenuDefault(menus, subProps) {
  if (!menus) {
    return null;
  }
  return menus.find(menu => !menu.selector || menu.selector(subProps.selectorProps));
}

/**
 * Finds the menu to be used for different scenarios:
 * This will first look for a subMenu with the specified subMenuId
 * Next it will look for the first menu whose selector returns true.
 *
 * @param menus - List of menus
 * @param props - root props
 * @param menuIdFilter - menu id identifier (to be considered on selection)
 *      This is intended to support other types of filtering in the future.
 */
function findMenu(menus, props, menuIdFilter) {
  const {
    subMenu
  } = props;
  function* findMenuIterator() {
    yield findMenuById(menus, menuIdFilter || subMenu);
    yield findMenuDefault(menus, props);
  }
  const findIt = findMenuIterator();
  let current = findIt.next();
  let menu = current.value;
  while (!current.done) {
    menu = current.value;
    if (menu) {
      findIt.return();
    }
    current = findIt.next();
  }
  return menu;
}

/**
 * Returns the menu from a list of possible menus, based on the actual state of component props and tool data nearby.
 * This uses the findMenu command above to first find the appropriate
 * menu, and then it chooses the actual contents of that menu.
 * A menu item can be optional by implementing the 'selector',
 * which will be called with the selectorProps, and if it does not return true,
 * then the item is excluded.
 *
 * Other menus can be delegated to by setting the delegating value to
 * a string id for another menu.  That menu's content will replace the
 * current menu item (only if the item would be included).
 *
 * This allows single id menus to be chosen by id, but have varying contents
 * based on the delegated menus.
 *
 * Finally, for each item, the adaptItem call is made.  This allows
 * items to modify themselves before being displayed, such as
 * incorporating additional information from translation sources.
 * See the `test-mode` examples for details.
 *
 * @param selectorProps
 * @param {*} event event that originates the context menu
 * @param {*} menus List of menus
 * @param {*} menuIdFilter
 * @returns
 */
function getMenuItems(selectorProps, event, menus, menuIdFilter) {
  // Include both the check props and the ...check props as one is used
  // by the child menu and the other used by the selector function
  const subProps = {
    selectorProps,
    event
  };
  const menu = findMenu(menus, subProps, menuIdFilter);
  if (!menu) {
    return undefined;
  }
  if (!menu.items) {
    console.warn('Must define items in menu', menu);
    return [];
  }
  let menuItems = [];
  menu.items.forEach(item => {
    const {
      delegating,
      selector,
      subMenu
    } = item;
    if (!selector || selector(selectorProps)) {
      if (delegating) {
        menuItems = [...menuItems, ...getMenuItems(selectorProps, event, menus, subMenu)];
      } else {
        const toAdd = adaptItem(item, subProps);
        menuItems.push(toAdd);
      }
    }
  });
  return menuItems;
}

/**
 * Returns item adapted to be consumed by ContextMenu component
 * and then goes through the item to add action behaviour for clicking the item,
 * making it compatible with the default ContextMenu display.
 *
 * @param {Object} item
 * @param {Object} subProps
 * @returns a MenuItem that is compatible with the base ContextMenu
 *    This requires having a label and set of actions to be called.
 */
function adaptItem(item, subProps) {
  const newItem = {
    ...item,
    value: subProps.selectorProps?.value
  };
  if (item.actionType === 'ShowSubMenu' && !newItem.iconRight) {
    newItem.iconRight = 'chevron-down';
  }
  if (!item.action) {
    newItem.action = (itemRef, componentProps) => {
      const {
        event = {}
      } = componentProps;
      const {
        detail = {}
      } = event;
      newItem.element = detail.element;
      componentProps.onClose();
      const action = componentProps[`on${itemRef.actionType || 'Default'}`];
      if (action) {
        action.call(componentProps, newItem, itemRef, subProps);
      } else {
        console.warn('No action defined for', itemRef);
      }
    };
  }
  return newItem;
}
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/index.js
var tools_dist_esm = __webpack_require__(4667);
;// ../../../extensions/default/src/CustomizableContextMenu/ContextMenuController.tsx
var _ContextMenuController;


/**
 * The context menu controller is a helper class that knows how
 * to manage context menus based on the UI Customization Service.
 * There are a few parts to this:
 *    1. Basic controls to manage displaying and hiding context menus
 *    2. Menu selection services, which use the UI customization service
 *       to choose which menu to display
 *    3. Menu item adapter services to convert menu items into displayable and actionable items.
 *
 * The format for a menu is defined in the exported type MenuItem
 */
class ContextMenuController {
  constructor(servicesManager, commandsManager) {
    this.commandsManager = void 0;
    this.services = void 0;
    this.menuItems = void 0;
    this.services = servicesManager.services;
    this.commandsManager = commandsManager;
  }
  closeContextMenu() {
    this.services.uiDialogService.hide('context-menu');
  }

  /**
   * Figures out which context menu is appropriate to display and shows it.
   *
   * @param contextMenuProps - the context menu properties, see ./types.ts
   * @param viewportElement - the DOM element this context menu is related to
   * @param defaultPointsPosition - a default position to show the context menu
   */
  showContextMenu(contextMenuProps, viewportElement, defaultPointsPosition) {
    if (!this.services.uiDialogService) {
      console.warn('Unable to show dialog; no UI Dialog Service available.');
      return;
    }
    const {
      event,
      subMenu,
      menuId,
      menus,
      selectorProps
    } = contextMenuProps;
    if (!menus) {
      console.warn('No menus found for', menuId);
      return;
    }
    const {
      locking,
      visibility
    } = tools_dist_esm.annotation;
    const targetAnnotationId = selectorProps?.nearbyToolData?.annotationUID;
    if (targetAnnotationId) {
      const isLocked = locking.isAnnotationLocked(targetAnnotationId);
      const isVisible = visibility.isAnnotationVisible(targetAnnotationId);
      if (isLocked || !isVisible) {
        console.warn(`Annotation is ${isLocked ? 'locked' : 'not visible'}.`);
        return;
      }
    }
    const items = getMenuItems(selectorProps || contextMenuProps, event, menus, menuId);
    if (!items) {
      return;
    }
    const ContextMenu = this.services.customizationService.getCustomization('ui.contextMenu');
    this.services.uiDialogService.hide('context-menu');
    this.services.uiDialogService.show({
      id: 'context-menu',
      showOverlay: false,
      defaultPosition: ContextMenuController._getDefaultPosition(defaultPointsPosition, event?.detail || event, viewportElement),
      content: ContextMenu,
      shouldCloseOnEsc: true,
      shouldCloseOnOverlayClick: true,
      unstyled: true,
      contentProps: {
        items,
        selectorProps,
        menus,
        event,
        subMenu,
        eventData: event?.detail || event,
        onClose: () => {
          this.services.uiDialogService.hide('context-menu');
        },
        /**
         * Displays a sub-menu, removing this menu
         * @param {*} item
         * @param {*} itemRef
         * @param {*} subProps
         */
        onShowSubMenu: (item, itemRef, subProps) => {
          if (!itemRef.subMenu) {
            console.warn('No submenu defined for', item, itemRef, subProps);
            return;
          }
          this.showContextMenu({
            ...contextMenuProps,
            menuId: itemRef.subMenu
          }, viewportElement, defaultPointsPosition);
        },
        // Default is to run the specified commands.
        onDefault: (item, itemRef, subProps) => {
          this.commandsManager.run(item, {
            ...selectorProps,
            ...itemRef,
            subProps
          });
        }
      }
    });
  }
}
_ContextMenuController = ContextMenuController;
ContextMenuController.getDefaultPosition = () => {
  return {
    x: 0,
    y: 0
  };
};
ContextMenuController._getEventDefaultPosition = eventDetail => ({
  x: eventDetail?.currentPoints?.client[0] ?? eventDetail?.pageX,
  y: eventDetail?.currentPoints?.client[1] ?? eventDetail?.pageY
});
ContextMenuController._getElementDefaultPosition = element => {
  if (element) {
    const boundingClientRect = element.getBoundingClientRect();
    return {
      x: boundingClientRect.x,
      y: boundingClientRect.y
    };
  }
  return {
    x: undefined,
    y: undefined
  };
};
ContextMenuController._getCanvasPointsPosition = (points = [], element) => {
  const viewerPos = _ContextMenuController._getElementDefaultPosition(element);
  for (let pointIndex = 0; pointIndex < points.length; pointIndex++) {
    const point = {
      x: points[pointIndex][0] || points[pointIndex]['x'],
      y: points[pointIndex][1] || points[pointIndex]['y']
    };
    if (_ContextMenuController._isValidPosition(point) && _ContextMenuController._isValidPosition(viewerPos)) {
      return {
        x: point.x + viewerPos.x,
        y: point.y + viewerPos.y
      };
    }
  }
};
ContextMenuController._isValidPosition = source => {
  return source && typeof source.x === 'number' && typeof source.y === 'number';
};
/**
 * Returns the context menu default position. It look for the positions of: canvasPoints (got from selected), event that triggers it, current viewport element
 */
ContextMenuController._getDefaultPosition = (canvasPoints, eventDetail, viewerElement) => {
  function* getPositionIterator() {
    yield _ContextMenuController._getCanvasPointsPosition(canvasPoints, viewerElement);
    yield _ContextMenuController._getEventDefaultPosition(eventDetail);
    yield _ContextMenuController._getElementDefaultPosition(viewerElement);
    yield _ContextMenuController.getDefaultPosition();
  }
  const positionIterator = getPositionIterator();
  let current = positionIterator.next();
  let position = current.value;
  while (!current.done) {
    position = current.value;
    if (_ContextMenuController._isValidPosition(position)) {
      positionIterator.return();
    }
    current = positionIterator.next();
  }
  return position;
};
;// ../../../extensions/default/src/CustomizableContextMenu/types.ts

;// ../../../extensions/default/src/CustomizableContextMenu/index.ts




// EXTERNAL MODULE: ../../../node_modules/moment/moment.js
var moment = __webpack_require__(14867);
var moment_default = /*#__PURE__*/__webpack_require__.n(moment);
// EXTERNAL MODULE: ../../../node_modules/react-window/dist/index.esm.js
var index_esm = __webpack_require__(28271);
// EXTERNAL MODULE: ../../../node_modules/lodash.debounce/index.js
var lodash_debounce = __webpack_require__(62051);
var lodash_debounce_default = /*#__PURE__*/__webpack_require__.n(lodash_debounce);
;// ../../../extensions/default/src/DicomTagBrowser/DicomTagTable.tsx





const lineHeightPx = 20;
const lineHeightClassName = `leading-[${lineHeightPx}px]`;
const rowVerticalPaddingPx = 10;
const rowBottomBorderPx = 1;
const rowVerticalPaddingStyle = {
  padding: `${rowVerticalPaddingPx}px 0`
};
const rowStyle = {
  borderBottomWidth: `${rowBottomBorderPx}px`,
  ...rowVerticalPaddingStyle
};
const indentationPadding = 8;
const RowComponent = ({
  row,
  style,
  keyPrefix,
  onToggle
}) => {
  const handleToggle = (0,react.useCallback)(() => {
    onToggle(!row.areChildrenVisible);
  }, [row.areChildrenVisible, onToggle]);
  const hasChildren = row.children && row.children.length > 0;
  const isChildOrParent = hasChildren || row.depth > 0;
  const padding = indentationPadding * (1 + 2 * row.depth);
  return /*#__PURE__*/react.createElement("div", {
    style: {
      ...style,
      ...rowStyle
    },
    className: classnames_default()('hover:bg-secondary-main border-secondary-light text-foreground flex w-full flex-row items-center break-all bg-black text-base transition duration-300', lineHeightClassName),
    key: keyPrefix
  }, isChildOrParent && /*#__PURE__*/react.createElement("div", {
    style: {
      paddingLeft: `${padding}px`,
      opacity: onToggle ? 1 : 0
    }
  }, row.areChildrenVisible ? /*#__PURE__*/react.createElement("div", {
    className: "cursor-pointer p-1",
    onClick: handleToggle
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ChevronDown, null)) : /*#__PURE__*/react.createElement("div", {
    className: "cursor-pointer p-1",
    onClick: handleToggle
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ChevronRight, null))), /*#__PURE__*/react.createElement("div", {
    className: "w-4/24 px-3"
  }, row.tag), /*#__PURE__*/react.createElement("div", {
    className: "w-2/24 px-3"
  }, row.valueRepresentation), /*#__PURE__*/react.createElement("div", {
    className: "w-6/24 px-3"
  }, row.keyword), /*#__PURE__*/react.createElement("div", {
    className: "w-5/24 grow px-3"
  }, row.value));
};
function ColumnHeaders({
  tagRef,
  vrRef,
  keywordRef,
  valueRef
}) {
  return /*#__PURE__*/react.createElement("div", {
    className: classnames_default()('bg-secondary-dark ohif-scrollbar flex w-full flex-row overflow-y-scroll'),
    style: rowVerticalPaddingStyle
  }, /*#__PURE__*/react.createElement("div", {
    className: "w-4/24 px-3"
  }, /*#__PURE__*/react.createElement("label", {
    ref: tagRef,
    className: "flex flex-1 select-none flex-col pl-1 text-lg text-white"
  }, /*#__PURE__*/react.createElement("span", {
    className: "flex flex-row items-center focus:outline-none"
  }, "Tag"))), /*#__PURE__*/react.createElement("div", {
    className: "w-2/24 px-3"
  }, /*#__PURE__*/react.createElement("label", {
    ref: vrRef,
    className: "flex flex-1 select-none flex-col pl-1 text-lg text-white"
  }, /*#__PURE__*/react.createElement("span", {
    className: "flex flex-row items-center focus:outline-none"
  }, "VR"))), /*#__PURE__*/react.createElement("div", {
    className: "w-6/24 px-3"
  }, /*#__PURE__*/react.createElement("label", {
    ref: keywordRef,
    className: "flex flex-1 select-none flex-col pl-1 text-lg text-white"
  }, /*#__PURE__*/react.createElement("span", {
    className: "flex flex-row items-center focus:outline-none"
  }, "Keyword"))), /*#__PURE__*/react.createElement("div", {
    className: "w-5/24 grow px-3"
  }, /*#__PURE__*/react.createElement("label", {
    ref: valueRef,
    className: "flex flex-1 select-none flex-col pl-1 text-lg text-white"
  }, /*#__PURE__*/react.createElement("span", {
    className: "flex flex-row items-center focus:outline-none"
  }, "Value"))));
}
function DicomTagTable({
  rows
}) {
  const listRef = (0,react.useRef)();
  const canvasRef = (0,react.useRef)();
  const [tagHeaderElem, setTagHeaderElem] = (0,react.useState)(null);
  const [vrHeaderElem, setVrHeaderElem] = (0,react.useState)(null);
  const [keywordHeaderElem, setKeywordHeaderElem] = (0,react.useState)(null);
  const [valueHeaderElem, setValueHeaderElem] = (0,react.useState)(null);
  const [internalRows, setInternalRows] = (0,react.useState)(rows);

  // Here the refs are inturn stored in state to trigger a render of the table.
  // This virtualized table does NOT render until the header is rendered because the header column widths are used to determine the row heights in the table.
  // Therefore whenever the refs change (in particular the first time the refs are set), we want to trigger a render of the table.
  const tagRef = elem => {
    if (elem) {
      setTagHeaderElem(elem);
    }
  };
  const vrRef = elem => {
    if (elem) {
      setVrHeaderElem(elem);
    }
  };
  const keywordRef = elem => {
    if (elem) {
      setKeywordHeaderElem(elem);
    }
  };
  const valueRef = elem => {
    if (elem) {
      setValueHeaderElem(elem);
    }
  };
  (0,react.useEffect)(() => {
    setInternalRows(rows);
  }, [rows]);
  const visibleRows = (0,react.useMemo)(() => {
    return internalRows.filter(row => row.isVisible);
  }, [internalRows]);

  /**
   * When new rows are set, scroll to the top and reset the virtualization.
   */
  (0,react.useEffect)(() => {
    if (!listRef?.current) {
      return;
    }
    listRef.current.scrollTo(0);
    listRef.current.resetAfterIndex(0);
  }, [rows]);

  /**
   * When the browser window resizes, update the row virtualization (i.e. row heights)
   */
  (0,react.useEffect)(() => {
    const debouncedResize = lodash_debounce_default()(() => listRef.current.resetAfterIndex(0), 100);
    window.addEventListener('resize', debouncedResize);
    return () => {
      debouncedResize.cancel();
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);
  const getOneRowHeight = (0,react.useCallback)(row => {
    const headerWidths = [tagHeaderElem.offsetWidth, vrHeaderElem.offsetWidth, keywordHeaderElem.offsetWidth, valueHeaderElem.offsetWidth];
    const context = canvasRef.current.getContext('2d');
    context.font = getComputedStyle(canvasRef.current).font;
    const propertiesToCheck = ['tag', 'valueRepresentation', 'keyword', 'value'];
    return Object.entries(row).filter(([key]) => propertiesToCheck.includes(key)).map(([, colText], index) => {
      const colOneLineWidth = context.measureText(colText).width;
      const numLines = Math.ceil(colOneLineWidth / headerWidths[index]);
      return numLines * lineHeightPx + 2 * rowVerticalPaddingPx + rowBottomBorderPx;
    }).reduce((maxHeight, colHeight) => Math.max(maxHeight, colHeight), 0);
  }, [keywordHeaderElem, tagHeaderElem, valueHeaderElem, vrHeaderElem]);

  /**
   * Get the item/row size. We use the header column widths to calculate the various row heights.
   * @param index the row index
   * @returns the row height
   */
  const getItemSize = (0,react.useCallback)(rows => index => {
    const row = rows[index];
    const height = getOneRowHeight(row);
    return height;
  }, [getOneRowHeight]);
  const onToggle = (0,react.useCallback)(sourceRow => {
    if (!sourceRow.children) {
      return undefined;
    }
    return areChildrenVisible => {
      const newInternalRows = internalRows.map(internalRow => {
        if (sourceRow.uid === internalRow.uid) {
          return {
            ...internalRow,
            areChildrenVisible
          };
        }
        if (sourceRow.children.includes(internalRow.uid)) {
          return {
            ...internalRow,
            isVisible: areChildrenVisible,
            areChildrenVisible
          };
        }
        return internalRow;
      });
      setInternalRows(newInternalRows);
      listRef?.current?.resetAfterIndex(0);
    };
  }, [internalRows, listRef]);
  const getRowComponent = (0,react.useCallback)(({
    rows
  }) => function RowList({
    index,
    style
  }) {
    const row = (0,react.useMemo)(() => rows[index], [index]);
    return /*#__PURE__*/react.createElement(RowComponent, {
      style: style,
      row: row,
      keyPrefix: `DICOMTagRow-${index}`,
      onToggle: onToggle(row)
    });
  }, [onToggle]);

  /**
   * Whenever any one of the column headers is set, then the header is rendered.
   * Here we chose the tag header.
   */
  const isHeaderRendered = (0,react.useCallback)(() => tagHeaderElem !== null, [tagHeaderElem]);
  return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement("canvas", {
    style: {
      visibility: 'hidden',
      position: 'absolute'
    },
    className: "text-base",
    ref: canvasRef
  }), /*#__PURE__*/react.createElement(ColumnHeaders, {
    tagRef: tagRef,
    vrRef: vrRef,
    keywordRef: keywordRef,
    valueRef: valueRef
  }), /*#__PURE__*/react.createElement("div", {
    className: "relative m-auto border-2 border-black bg-black",
    style: {
      height: '32rem'
    }
  }, isHeaderRendered() && /*#__PURE__*/react.createElement(index_esm/* VariableSizeList */._m, {
    ref: listRef,
    height: 500,
    itemCount: visibleRows.length,
    itemSize: getItemSize(visibleRows),
    width: '100%',
    className: "ohif-scrollbar text-foreground"
  }, getRowComponent({
    rows: visibleRows
  }))));
}
/* harmony default export */ const DicomTagBrowser_DicomTagTable = (/*#__PURE__*/react.memo(DicomTagTable));
;// ../../../extensions/default/src/DicomTagBrowser/DicomTagBrowser.css
// extracted by mini-css-extract-plugin

;// ../../../extensions/default/src/DicomTagBrowser/DicomTagBrowser.tsx








let rowCounter = 0;
const generateRowId = () => `row_${++rowCounter}`;
const {
  ImageSet: DicomTagBrowser_ImageSet
} = src.classes;
const {
  DicomMetaDictionary: DicomTagBrowser_DicomMetaDictionary
} = dcmjs_es/* default.data */.Ay.data;
const {
  nameMap
} = DicomTagBrowser_DicomMetaDictionary;
const DicomTagBrowser = ({
  displaySets,
  displaySetInstanceUID
}) => {
  const [selectedDisplaySetInstanceUID, setSelectedDisplaySetInstanceUID] = (0,react.useState)(displaySetInstanceUID);
  const [instanceNumber, setInstanceNumber] = (0,react.useState)(1);
  const [shouldShowInstanceList, setShouldShowInstanceList] = (0,react.useState)(false);
  const [filterValue, setFilterValue] = (0,react.useState)('');
  const onSelectChange = value => {
    setSelectedDisplaySetInstanceUID(value.value);
    setInstanceNumber(1);
  };
  const activeDisplaySet = displaySets.find(ds => ds.displaySetInstanceUID === selectedDisplaySetInstanceUID);
  const displaySetList = (0,react.useMemo)(() => {
    displaySets.sort((a, b) => a.SeriesNumber - b.SeriesNumber);
    return displaySets.map(displaySet => {
      const {
        displaySetInstanceUID,
        SeriesDate,
        SeriesTime,
        SeriesNumber,
        SeriesDescription,
        Modality
      } = displaySet;

      /* Map to display representation */
      const dateStr = `${SeriesDate}:${SeriesTime}`.split('.')[0];
      const date = moment_default()(dateStr, 'YYYYMMDD:HHmmss');
      const displayDate = date.format('ddd, MMM Do YYYY');
      return {
        value: displaySetInstanceUID,
        label: `${SeriesNumber} (${Modality}):  ${SeriesDescription}`,
        description: displayDate
      };
    });
  }, [displaySets]);
  const getMetadata = (0,react.useCallback)(isImageStack => {
    if (isImageStack) {
      return activeDisplaySet.images[instanceNumber - 1];
    }
    return activeDisplaySet.instance || activeDisplaySet;
  }, [activeDisplaySet, instanceNumber]);
  const rows = (0,react.useMemo)(() => {
    const isImageStack = activeDisplaySet instanceof DicomTagBrowser_ImageSet;
    const metadata = getMetadata(isImageStack);
    setShouldShowInstanceList(isImageStack && activeDisplaySet.images.length > 1);
    const tags = getSortedTags(metadata);
    const rows = getFormattedRowsFromTags({
      tags,
      metadata
    });
    return rows;
  }, [getMetadata, activeDisplaySet]);
  const filteredRows = (0,react.useMemo)(() => {
    if (!filterValue) {
      return rows;
    }
    const matchedRowIds = new Set();
    const propertiesToCheck = ['tag', 'valueRepresentation', 'keyword', 'value'];
    const setIsMatched = row => {
      const isDirectMatch = propertiesToCheck.some(propertyName => row[propertyName]?.toLowerCase().includes(filterValueLowerCase));
      if (!isDirectMatch) {
        return;
      }
      matchedRowIds.add(row.uid);
      [...(row.parents ?? []), ...(row.children ?? [])].forEach(uid => matchedRowIds.add(uid));
    };
    const filterValueLowerCase = filterValue.toLowerCase();
    rows.forEach(setIsMatched);
    return rows.filter(row => matchedRowIds.has(row.uid));
  }, [rows, filterValue]);
  return /*#__PURE__*/react.createElement("div", {
    className: "dicom-tag-browser-content bg-muted"
  }, /*#__PURE__*/react.createElement("div", {
    className: "mb-6 flex flex-row items-start pl-1"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex w-full flex-row items-start gap-4"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex w-1/3 flex-col"
  }, /*#__PURE__*/react.createElement("span", {
    className: "text-muted-foreground flex h-6 items-center pb-2 text-base"
  }, "Series"), /*#__PURE__*/react.createElement(ui_next_src/* Select */.l6P, {
    value: selectedDisplaySetInstanceUID,
    onValueChange: value => onSelectChange({
      value
    })
  }, /*#__PURE__*/react.createElement(ui_next_src/* SelectTrigger */.bqE, null, displaySetList.find(ds => ds.value === selectedDisplaySetInstanceUID)?.label || 'Select Series'), /*#__PURE__*/react.createElement(ui_next_src/* SelectContent */.gCo, null, displaySetList.map(item => {
    return /*#__PURE__*/react.createElement(ui_next_src/* SelectItem */.ebT, {
      key: item.value,
      value: item.value
    }, item.label, /*#__PURE__*/react.createElement("span", {
      className: "text-muted-foreground ml-1 text-xs"
    }, item.description));
  })))), shouldShowInstanceList && /*#__PURE__*/react.createElement("div", {
    className: "mx-auto mt-0.5 flex w-1/4 flex-col"
  }, /*#__PURE__*/react.createElement("span", {
    className: "text-muted-foreground flex h-6 items-center pb-2 text-base"
  }, "Instance Number (", instanceNumber, " of ", activeDisplaySet?.images?.length, ")"), /*#__PURE__*/react.createElement(ui_next_src/* Slider */.Apm, {
    value: [instanceNumber],
    onValueChange: ([value]) => {
      setInstanceNumber(value);
    },
    min: 1,
    max: activeDisplaySet?.images?.length,
    step: 1,
    className: "pt-4"
  })), /*#__PURE__*/react.createElement("div", {
    className: "ml-auto mr-1 flex w-1/3 flex-col"
  }, /*#__PURE__*/react.createElement("span", {
    className: "text-muted-foreground flex h-6 items-center pb-2 text-base"
  }, "Search metadata"), /*#__PURE__*/react.createElement(ui_next_src/* InputFilter */.zbB, {
    className: "text-muted-foreground",
    onChange: setFilterValue
  }, /*#__PURE__*/react.createElement(ui_next_src/* InputFilter */.zbB.SearchIcon, null), /*#__PURE__*/react.createElement(ui_next_src/* InputFilter */.zbB.Input, {
    placeholder: "Search metadata",
    className: "pl-9 pr-9"
  }), /*#__PURE__*/react.createElement(ui_next_src/* InputFilter */.zbB.ClearButton, {
    className: "text-primary mr-0.5 p-0.5"
  }))))), /*#__PURE__*/react.createElement(DicomTagBrowser_DicomTagTable, {
    rows: filteredRows
  }));
};
function getFormattedRowsFromTags({
  tags,
  metadata
}) {
  const rows = [];
  const stack = [{
    tags,
    depth: 0,
    parents: null,
    index: 0,
    children: []
  }];
  const parentChildMap = new Map();
  while (stack.length > 0) {
    const current = stack.pop();
    const {
      tags,
      depth,
      parents,
      index,
      children
    } = current;
    for (let i = index; i < tags.length; i++) {
      const tagInfo = tags[i];
      const uid = tagInfo.uid ?? generateRowId();
      if (parents?.length > 0) {
        parents.forEach(parent => {
          parentChildMap.get(parent).push(uid);
        });
      }
      if (tagInfo.vr === 'SQ') {
        const row = {
          uid,
          tag: tagInfo.tag,
          valueRepresentation: tagInfo.vr,
          keyword: tagInfo.keyword,
          value: '',
          depth,
          isVisible: true,
          areChildrenVisible: true,
          children: [],
          parents
        };
        rows.push(row);
        parentChildMap.set(uid, row.children);
        const newParents = parents ? [...parents, uid] : [uid];
        if (tagInfo.values.length > 0) {
          stack.push({
            tags,
            depth,
            parents,
            index: i + 1,
            children
          });
          for (let j = tagInfo.values.length - 1, values = tagInfo.values[j]; j >= 0; values = tagInfo.values[--j]) {
            const itemUid = generateRowId();
            stack.push({
              tags: values,
              depth: depth + 2,
              parents: [...newParents, itemUid],
              index: 0,
              children: []
            });
            const itemTagInfo = {
              tags: [{
                tag: '(FFFE,E000)',
                vr: '',
                keyword: `Item #${j}`,
                value: '',
                uid: itemUid
              }],
              depth: depth + 1,
              parents: newParents,
              index: 0,
              children: []
            };
            stack.push(itemTagInfo);
            parentChildMap.set(itemUid, itemTagInfo.children);
          }
          break;
        }
      } else {
        if (tagInfo.vr === 'xs') {
          try {
            const tag = dcmjs_es/* default.data */.Ay.data.Tag.fromPString(tagInfo.tag).toCleanString();
            const originalTagInfo = metadata[tag];
            tagInfo.vr = originalTagInfo.vr;
          } catch (error) {
            console.warn(`Failed to parse value representation for tag '${tagInfo.keyword}'`);
          }
        }
        const row = {
          uid,
          tag: tagInfo.tag,
          valueRepresentation: tagInfo.vr,
          keyword: tagInfo.keyword,
          value: tagInfo.value,
          depth,
          isVisible: true,
          parents
        };
        rows.push(row);
        if (row.tag === '(FFFE,E000)') {
          row.areChildrenVisible = true;
          row.children = [];
        }
      }
    }
  }
  return rows;
}
function getSortedTags(metadata) {
  const tagList = getRows(metadata);

  // Sort top level tags, sequence groups are sorted when created.
  _sortTagList(tagList);
  return tagList;
}
function getRows(metadata, depth = 0) {
  // Tag, Type, Value, Keyword

  const keywords = Object.keys(metadata);
  const rows = [];
  for (let i = 0; i < keywords.length; i++) {
    let keyword = keywords[i];
    if (keyword === '_vrMap') {
      continue;
    }
    const tagInfo = nameMap[keyword];
    let value = metadata[keyword];
    if (tagInfo && tagInfo.vr === 'SQ') {
      const sequenceAsArray = toArray(value);

      // Push line defining the sequence

      const sequence = {
        tag: tagInfo.tag,
        vr: tagInfo.vr,
        keyword,
        values: []
      };
      rows.push(sequence);
      if (value === null) {
        // Type 2 Sequence
        continue;
      }
      sequenceAsArray.forEach(item => {
        const sequenceRows = getRows(item, depth + 1);
        if (sequenceRows.length) {
          // Sort the sequence group.
          _sortTagList(sequenceRows);
          sequence.values.push(sequenceRows);
        }
      });
      continue;
    }
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] != 'object') {
        value = value.join('\\');
      }
    }
    if (typeof value === 'number') {
      value = value.toString();
    }
    if (typeof value !== 'string') {
      if (value === null) {
        value = ' ';
      } else {
        if (typeof value === 'object') {
          if (value.InlineBinary) {
            value = 'Inline Binary';
          } else if (value.BulkDataURI) {
            value = `Bulk Data URI`; //: ${value.BulkDataURI}`;
          } else if (value.Alphabetic) {
            value = value.Alphabetic;
          } else {
            console.warn(`Unrecognised Value: ${value} for ${keyword}:`);
            console.warn(value);
            value = ' ';
          }
        } else {
          console.warn(`Unrecognised Value: ${value} for ${keyword}:`);
          value = ' ';
        }
      }
    }

    // tag / vr/ keyword/ value

    // Remove retired tags
    keyword = keyword.replace('RETIRED_', '');
    if (tagInfo) {
      rows.push({
        tag: tagInfo.tag,
        vr: tagInfo.vr,
        keyword,
        value
      });
    } else {
      // skip properties without hex tag numbers
      const regex = /[0-9A-Fa-f]{6}/g;
      if (keyword.match(regex)) {
        const tag = `(${keyword.substring(0, 4)},${keyword.substring(4, 8)})`;
        rows.push({
          tag,
          vr: '',
          keyword: 'Private Tag',
          value
        });
      }
    }
  }
  return rows;
}
function toArray(objectOrArray) {
  return Array.isArray(objectOrArray) ? objectOrArray : [objectOrArray];
}
function _sortTagList(tagList) {
  tagList.sort((a, b) => {
    if (a.tag < b.tag) {
      return -1;
    }
    return 1;
  });
}
/* harmony default export */ const DicomTagBrowser_DicomTagBrowser = (DicomTagBrowser);
// EXTERNAL MODULE: ../../../node_modules/zustand/esm/index.mjs + 1 modules
var zustand_esm = __webpack_require__(78713);
// EXTERNAL MODULE: ../../../node_modules/zustand/esm/middleware.mjs
var middleware = __webpack_require__(21978);
;// ../../../extensions/default/src/stores/useViewportGridStore.ts



/**
 * Identifier for the viewport grid store type.
 */
const PRESENTATION_TYPE_ID = 'viewportGridId';

/**
 * Flag to enable or disable debug mode for the store.
 * Set to `true` to enable zustand devtools.
 */
const DEBUG_STORE = false;

/**
 * Represents the state of the viewport grid.
 */

/**
 * State shape for the Viewport Grid store.
 */

/**
 * Creates the Viewport Grid store.
 *
 * @param set - The zustand set function.
 * @returns The Viewport Grid store state and actions.
 */
const createViewportGridStore = set => ({
  type: PRESENTATION_TYPE_ID,
  viewportGridState: {},
  /**
   * Sets the viewport grid state for a given key.
   */
  setViewportGridState: (key, value) => set(state => ({
    viewportGridState: {
      ...state.viewportGridState,
      [key]: value
    }
  }), false, 'setViewportGridState'),
  /**
   * Clears the entire viewport grid state.
   */
  clearViewportGridState: () => set({
    viewportGridState: {}
  }, false, 'clearViewportGridState')
});

/**
 * Zustand store for managing viewport grid state.
 * Applies devtools middleware when DEBUG_STORE is enabled.
 */
const useViewportGridStore = (0,zustand_esm/* create */.vt)()(DEBUG_STORE ? (0,middleware/* devtools */.lt)(createViewportGridStore, {
  name: 'ViewportGridStore'
}) : createViewportGridStore);
;// ../../../extensions/default/src/stores/useDisplaySetSelectorStore.ts



/**
 * Identifier for the display set selector store type.
 */
const useDisplaySetSelectorStore_PRESENTATION_TYPE_ID = 'displaySetSelectorId';

/**
 * Flag to enable or disable debug mode for the store.
 * Set to `true` to enable zustand devtools.
 */
const useDisplaySetSelectorStore_DEBUG_STORE = false;

/**
 * State shape for the Display Set Selector store.
 */

/**
 * Creates the Display Set Selector store.
 *
 * @param set - The zustand set function.
 * @returns The display set selector store state and actions.
 */
const createDisplaySetSelectorStore = set => ({
  type: useDisplaySetSelectorStore_PRESENTATION_TYPE_ID,
  displaySetSelectorMap: {},
  /**
   * Sets the display set selector for a given key.
   */
  setDisplaySetSelector: (key, value) => set(state => ({
    displaySetSelectorMap: {
      ...state.displaySetSelectorMap,
      [key]: value
    }
  }), false, 'setDisplaySetSelector'),
  /**
   * Clears the entire display set selector map.
   */
  clearDisplaySetSelectorMap: () => set({
    displaySetSelectorMap: {}
  }, false, 'clearDisplaySetSelectorMap')
});

/**
 * Zustand store for managing display set selectors.
 * Applies devtools middleware when DEBUG_STORE is enabled.
 */
const useDisplaySetSelectorStore = (0,zustand_esm/* create */.vt)()(useDisplaySetSelectorStore_DEBUG_STORE ? (0,middleware/* devtools */.lt)(createDisplaySetSelectorStore, {
  name: 'DisplaySetSelectorStore'
}) : createDisplaySetSelectorStore);
;// ../../../extensions/default/src/stores/useHangingProtocolStageIndexStore.ts


const useHangingProtocolStageIndexStore_PRESENTATION_TYPE_ID = 'hangingProtocolStageIndexId';
const useHangingProtocolStageIndexStore_DEBUG_STORE = false;

/**
 * Represents the state and actions for managing hanging protocol stage indexes.
 */

/**
 * Creates the Hanging Protocol Stage Index store.
 *
 * @param set - The zustand set function.
 * @returns The hanging protocol stage index store state and actions.
 */
const createHangingProtocolStageIndexStore = set => ({
  hangingProtocolStageIndexMap: {},
  type: useHangingProtocolStageIndexStore_PRESENTATION_TYPE_ID,
  /**
   * Sets the hanging protocol stage index for a given key.
   */
  setHangingProtocolStageIndex: (key, value) => set(state => ({
    hangingProtocolStageIndexMap: {
      ...state.hangingProtocolStageIndexMap,
      [key]: value
    }
  }), false, 'setHangingProtocolStageIndex'),
  /**
   * Clears all hanging protocol stage indexes.
   */
  clearHangingProtocolStageIndexMap: () => set({
    hangingProtocolStageIndexMap: {}
  }, false, 'clearHangingProtocolStageIndexMap')
});

/**
 * Zustand store for managing hanging protocol stage indexes.
 * Applies devtools middleware when DEBUG_STORE is enabled.
 */
const useHangingProtocolStageIndexStore = (0,zustand_esm/* create */.vt)()(useHangingProtocolStageIndexStore_DEBUG_STORE ? (0,middleware/* devtools */.lt)(createHangingProtocolStageIndexStore, {
  name: 'HangingProtocolStageIndexStore'
}) : createHangingProtocolStageIndexStore);
;// ../../../extensions/default/src/utils/reuseCachedLayouts.ts



/**
 * Calculates a set of state information for hanging protocols and viewport grid
 * which defines the currently applied hanging protocol state.
 * @param state is the viewport grid state
 * @param syncService is the state sync service to use for getting existing state
 * @returns Set of states that can be applied to the state sync to remember
 *   the current view state.
 */
const reuseCachedLayout = (state, hangingProtocolService) => {
  const {
    activeViewportId
  } = state;
  const {
    protocol
  } = hangingProtocolService.getActiveProtocol();
  if (!protocol) {
    return;
  }
  const hpInfo = hangingProtocolService.getState();
  const {
    protocolId,
    stageIndex,
    activeStudyUID
  } = hpInfo;
  const {
    viewportGridState,
    setViewportGridState
  } = useViewportGridStore.getState();
  const {
    displaySetSelectorMap,
    setDisplaySetSelector
  } = useDisplaySetSelectorStore.getState();
  const {
    hangingProtocolStageIndexMap,
    setHangingProtocolStageIndex
  } = useHangingProtocolStageIndexStore.getState();
  const stage = protocol.stages[stageIndex];
  const storeId = `${activeStudyUID}:${protocolId}:${stageIndex}`;
  const cacheId = `${activeStudyUID}:${protocolId}`;
  const {
    rows,
    columns
  } = stage.viewportStructure.properties;
  const custom = stage.viewports.length !== state.viewports.size || state.layout.numRows !== rows || state.layout.numCols !== columns;
  hangingProtocolStageIndexMap[cacheId] = hpInfo;
  if (storeId && custom) {
    setViewportGridState(storeId, {
      ...state
    });
  }
  state.viewports.forEach((viewport, viewportId) => {
    const {
      displaySetOptions,
      displaySetInstanceUIDs
    } = viewport;
    if (!displaySetOptions) {
      return;
    }
    const activeDisplaySetUIDs = [];
    for (let i = 0; i < displaySetOptions.length; i++) {
      const displaySetUID = displaySetInstanceUIDs[i];
      if (!displaySetUID) {
        continue;
      }
      if (viewportId === activeViewportId) {
        activeDisplaySetUIDs.push(displaySetUID);
      }

      // The activeDisplaySet selector should only be set once (i.e. for the actual active display set)
      if (displaySetOptions[i]?.id && displaySetOptions[i].id !== 'activeDisplaySet') {
        // TODO: handle multiple layers/display sets for the non-active viewports
        setDisplaySetSelector(`${activeStudyUID}:${displaySetOptions[i].id}:${displaySetOptions[i].matchedDisplaySetsIndex || 0}`, [displaySetUID]);
      }
    }
    if (viewportId === activeViewportId) {
      // After going through all the display set options for the active viewport, store the display set selector array
      setDisplaySetSelector(`${activeStudyUID}:activeDisplaySet:0`, activeDisplaySetUIDs);
    }
  });
  setHangingProtocolStageIndex(cacheId, hpInfo);
  return {
    hangingProtocolStageIndexMap,
    viewportGridStore: viewportGridState,
    displaySetSelectorMap
  };
};
/* harmony default export */ const reuseCachedLayouts = (reuseCachedLayout);
;// ../../../extensions/default/src/utils/layerConfigurationUtils.ts
const DERIVED_OVERLAY_MODALITIES = ['SEG', 'RTSTRUCT'];
const DEFAULT_COLORMAP = 'hsv';
const DEFAULT_OPACITY = 0.9;
const DEFAULT_OPACITY_PERCENT = DEFAULT_OPACITY * 100;

/**
 * Get modality-specific color and opacity settings from the customization service
 */
function getModalityOverlayColormap(customizationService, modality) {
  const modalityOverlayDefaultColorMaps = customizationService?.getCustomization('cornerstone.modalityOverlayDefaultColorMaps') || {
    defaultSettings: {}
  };
  return modalityOverlayDefaultColorMaps.defaultSettings[modality] || {
    colormap: DEFAULT_COLORMAP,
    opacity: DEFAULT_OPACITY
  };
}

/**
 * Create display set options based on modality and opacity settings
 */
function createColormapOverlayDisplaySetOptions(displaySet, opacity, customizationService) {
  if (displaySet.Modality === 'SEG') {
    return {};
  }
  const modalitySettings = getModalityOverlayColormap(customizationService, displaySet.Modality);
  return {
    colormap: {
      name: modalitySettings.colormap || DEFAULT_COLORMAP,
      opacity: opacity / 100 // Convert from percentage to 0-1 range
    }
  };
}

/**
 * Configure viewport for adding a display set layer
 */
function configureViewportForLayerAddition(params) {
  const {
    viewport,
    displaySetInstanceUID,
    currentDisplaySetUIDs,
    servicesManager
  } = params;
  const {
    cornerstoneViewportService,
    displaySetService,
    customizationService
  } = servicesManager.services;
  const {
    viewportId
  } = viewport;

  // Set the display set UIDs for the viewport
  const allDisplaySetInstanceUIDs = [...currentDisplaySetUIDs, displaySetInstanceUID];
  viewport.displaySetInstanceUIDs = allDisplaySetInstanceUIDs;
  if (!viewport.viewportOptions) {
    viewport.viewportOptions = {};
  }
  const requestedLayerDisplaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
  if (!viewport.viewportOptions.orientation) {
    viewport.viewportOptions.orientation = cornerstoneViewportService.getOrientation(viewportId);
  }

  // If a viewport type was already set do not reset it.
  if (!viewport.viewportOptions.viewportType) {
    // Special handling for overlay display sets
    if (requestedLayerDisplaySet.isOverlayDisplaySet) {
      // Do not force volume for SEG and RTSTRUCT if it and all the current display sets are for the same display set
      const isSameDisplaySet = currentDisplaySetUIDs.every(uid => {
        const currentDisplaySet = displaySetService.getDisplaySetByUID(uid);
        return currentDisplaySet.isOverlayDisplaySet ? currentDisplaySet.referencedDisplaySetInstanceUID === requestedLayerDisplaySet.referencedDisplaySetInstanceUID : uid === requestedLayerDisplaySet.referencedDisplaySetInstanceUID;
      });
      if (isSameDisplaySet) {
        viewport.viewportOptions.viewportType = 'stack';
      } else {
        viewport.viewportOptions.viewportType = 'volume';
      }
    } else {
      viewport.viewportOptions.viewportType = 'volume';
    }
  }

  // create same amount of display set options as the number of display set UIDs
  const displaySetOptions = allDisplaySetInstanceUIDs.map((uid, index) => {
    // There is already a display set option for this display set, so return it.
    if (viewport.displaySetOptions?.[index]) {
      return viewport.displaySetOptions[index];
    }
    if (index === 0) {
      // no colormap for background
      return {};
    }
    const displaySet = displaySetService.getDisplaySetByUID(uid);
    return createColormapOverlayDisplaySetOptions(displaySet, 90, customizationService);
  });
  viewport.displaySetOptions = displaySetOptions;
  return viewport;
}

/**
 * Configure viewport for removing a display set layer
 */
function configureViewportForLayerRemoval(params) {
  const {
    viewport,
    displaySetInstanceUID,
    currentDisplaySetUIDs,
    servicesManager
  } = params;
  const {
    cornerstoneViewportService,
    displaySetService
  } = servicesManager.services;
  const {
    viewportId
  } = viewport;

  // Filter out the display set to remove
  viewport.displaySetInstanceUIDs = currentDisplaySetUIDs.filter(uid => uid !== displaySetInstanceUID);
  if (!viewport.viewportOptions) {
    viewport.viewportOptions = {};
  }
  viewport.viewportOptions.viewportType = 'volume';

  // orientation
  if (!viewport.viewportOptions.orientation) {
    viewport.viewportOptions.orientation = cornerstoneViewportService.getOrientation(viewportId);
  }

  // Recreate the display set options
  viewport.displaySetOptions = viewport.displaySetInstanceUIDs.map(() => {
    // For simplicity, we're returning empty options for now
    // In a more complete implementation, we would need to preserve existing display set options
    return {};
  });
  return viewport;
}

/**
 * Check if a display set can be added as a layer to the specified viewport
 */
function canAddDisplaySetToViewport(params) {
  const {
    viewportId,
    displaySetInstanceUID,
    servicesManager
  } = params;
  const {
    displaySetService,
    viewportGridService
  } = servicesManager.services;

  // Check if the display set exists
  const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
  if (!displaySet) {
    return false;
  }

  // Get current display sets in the viewport
  const currentDisplaySetUIDs = viewportGridService.getDisplaySetsUIDsForViewport(viewportId);

  // Check if the display set is already in the viewport
  if (currentDisplaySetUIDs.includes(displaySetInstanceUID)) {
    return false;
  }
  return true;
}
;// ../../../extensions/default/src/stores/useViewportsByPositionStore.ts


const useViewportsByPositionStore_PRESENTATION_TYPE_ID = 'viewportsByPositionId';
const useViewportsByPositionStore_DEBUG_STORE = false;

/**
 * Represents the state and actions for managing viewports by position.
 */

/**
 * Creates the Viewports By Position store.
 *
 * @param set - The zustand set function.
 * @returns The Viewports By Position store state and actions.
 */
const createViewportsByPositionStore = set => ({
  type: useViewportsByPositionStore_PRESENTATION_TYPE_ID,
  viewportsByPosition: {},
  initialInDisplay: [],
  /**
   * Sets the viewport for a given key.
   */
  setViewportsByPosition: (key, value) => set(state => ({
    viewportsByPosition: {
      ...state.viewportsByPosition,
      [key]: value
    }
  }), false, 'setViewportsByPosition'),
  /**
   * Clears all viewports by position.
   */
  clearViewportsByPosition: () => set({
    viewportsByPosition: {}
  }, false, 'clearViewportsByPosition'),
  /**
   * Adds an initial display viewport.
   */
  addInitialInDisplay: value => set(state => ({
    initialInDisplay: [...state.initialInDisplay, value]
  }), false, 'addInitialInDisplay')
});

/**
 * Zustand store for managing viewports by position.
 * Applies devtools middleware when DEBUG_STORE is enabled.
 */
const useViewportsByPositionStore = (0,zustand_esm/* create */.vt)()(useViewportsByPositionStore_DEBUG_STORE ? (0,middleware/* devtools */.lt)(createViewportsByPositionStore, {
  name: 'ViewportsByPositionStore'
}) : createViewportsByPositionStore);
;// ../../../extensions/default/src/findViewportsByPosition.ts


/**
 * This find or create viewport is paired with the reduce results from
 * below, and the action of this viewport is to look for previously filled
 * viewports, and to reuse by position id.  If there is no filled viewport,
 * then one can be re-used from the display set if it isn't going to be displayed.
 * @param hangingProtocolService - bound parameter supplied before using this
 * @param viewportsByPosition - bound parameter supplied before using this
 * @param position - the position in the grid to retrieve
 * @param positionId - the current position on screen to retrieve
 * @param options - the set of options used, so that subsequent calls can
 *                  store state that is reset by the setLayout.
 *                  This class uses the options to store the already viewed
 *                  display sets, filling it initially with the pre-existing viewports.
 */
const findViewportsByPosition_findOrCreateViewport = (hangingProtocolService, isHangingProtocolLayout, viewportsByPosition, position, positionId, options) => {
  const byPositionViewport = viewportsByPosition?.[positionId];
  if (byPositionViewport) {
    return {
      ...byPositionViewport
    };
  }
  const {
    protocolId,
    stageIndex
  } = hangingProtocolService.getState();

  // Setup the initial in display correctly for initial view/select
  if (!options.inDisplay) {
    options.inDisplay = [...viewportsByPosition.initialInDisplay];
  }

  // See if there is a default viewport for new views
  const missing = hangingProtocolService.getMissingViewport(isHangingProtocolLayout ? protocolId : 'default', stageIndex, options);
  if (missing) {
    const displaySetInstanceUIDs = missing.displaySetsInfo.map(it => it.displaySetInstanceUID);
    options.inDisplay.push(...displaySetInstanceUIDs);
    return {
      displaySetInstanceUIDs,
      displaySetOptions: missing.displaySetsInfo.map(it => it.displaySetOptions),
      viewportOptions: {
        ...missing.viewportOptions
      }
    };
  }

  // and lastly if there is no default viewport, then we see if we can grab the
  // viewportsByPosition at the position index and use that
  // const candidate = Object.values(viewportsByPosition)[position];

  // // if it has something to display, then we can use it
  // return candidate?.displaySetInstanceUIDs ? candidate : {};
  return {};
};

/**
 * Records the information on what viewports are displayed in which position.
 * Also records what instances from the existing positions are going to be in
 * view initially.
 * @param state is the viewport grid state
 * @param syncService is the state sync service to use for getting existing state
 * @returns Set of states that can be applied to the state sync to remember
 *   the current view state.
 */
const findViewportsByPosition = (state, {
  numRows,
  numCols
}) => {
  const {
    viewports
  } = state;
  const {
    setViewportsByPosition,
    addInitialInDisplay
  } = useViewportsByPositionStore.getState();
  const initialInDisplay = [];
  const viewportsByPosition = {};
  viewports.forEach(viewport => {
    if (viewport.positionId) {
      const storedViewport = {
        ...viewport,
        viewportOptions: {
          ...viewport.viewportOptions
        }
      };
      viewportsByPosition[viewport.positionId] = storedViewport;
      setViewportsByPosition(viewport.positionId, storedViewport);
    }
  });
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const positionId = `${col}-${row}`;
      const viewport = viewportsByPosition[positionId];
      if (viewport?.displaySetInstanceUIDs) {
        initialInDisplay.push(...viewport.displaySetInstanceUIDs);
      }
    }
  }
  initialInDisplay.forEach(displaySetInstanceUID => addInitialInDisplay(displaySetInstanceUID));
};
/* harmony default export */ const src_findViewportsByPosition = (findViewportsByPosition);
;// ../../../extensions/default/src/stores/useToggleHangingProtocolStore.ts


const useToggleHangingProtocolStore_PRESENTATION_TYPE_ID = 'toggleHangingProtocolId';
const useToggleHangingProtocolStore_DEBUG_STORE = false;

/**
 * Represents the state and actions for managing toggle hanging protocols.
 */

/**
 * Creates the Toggle Hanging Protocol store.
 *
 * @param set - The zustand set function.
 * @returns The toggle hanging protocol store state and actions.
 */
const createToggleHangingProtocolStore = set => ({
  toggleHangingProtocol: {},
  type: useToggleHangingProtocolStore_PRESENTATION_TYPE_ID,
  /**
   * Sets the toggle hanging protocol for a given key.
   */
  setToggleHangingProtocol: (key, value) => set(state => ({
    toggleHangingProtocol: {
      ...state.toggleHangingProtocol,
      [key]: value
    }
  }), false, 'setToggleHangingProtocol'),
  /**
   * Clears all toggle hanging protocols.
   */
  clearToggleHangingProtocol: () => set({
    toggleHangingProtocol: {}
  }, false, 'clearToggleHangingProtocol')
});

/**
 * Zustand store for managing toggle hanging protocols.
 * Applies devtools middleware when DEBUG_STORE is enabled.
 */
const useToggleHangingProtocolStore = (0,zustand_esm/* create */.vt)()(useToggleHangingProtocolStore_DEBUG_STORE ? (0,middleware/* devtools */.lt)(createToggleHangingProtocolStore, {
  name: 'ToggleHangingProtocolStore'
}) : createToggleHangingProtocolStore);
;// ../../../extensions/default/src/stores/useToggleOneUpViewportGridStore.ts

const useToggleOneUpViewportGridStore_PRESENTATION_TYPE_ID = 'toggleOneUpViewportGridId';
// Stores the entire ViewportGridService getState when toggling to one up
// (e.g. via a double click) so that it can be restored when toggling back.
const useToggleOneUpViewportGridStore = (0,zustand_esm/* create */.vt)(set => ({
  toggleOneUpViewportGridStore: null,
  type: useToggleOneUpViewportGridStore_PRESENTATION_TYPE_ID,
  setToggleOneUpViewportGridStore: state => set({
    toggleOneUpViewportGridStore: state
  }),
  clearToggleOneUpViewportGridStore: () => set({
    toggleOneUpViewportGridStore: null
  })
}));
;// ../../../extensions/default/src/Actions/createReportAsync.tsx


/**
 *
 * @param {*} servicesManager
 */
async function createReportAsync({
  servicesManager,
  getReport,
  reportType = 'measurement'
}) {
  const {
    displaySetService,
    uiNotificationService,
    uiDialogService
  } = servicesManager.services;
  try {
    const naturalizedReport = await getReport();
    if (!naturalizedReport) {
      return;
    }

    // The "Mode" route listens for DicomMetadataStore changes
    // When a new instance is added, it listens and
    // automatically calls makeDisplaySets
    src.DicomMetadataStore.addInstances([naturalizedReport], true);
    const displaySet = displaySetService.getMostRecentDisplaySet();
    const displaySetInstanceUID = displaySet.displaySetInstanceUID;
    uiNotificationService.show({
      title: 'Create Report',
      message: `${reportType} saved successfully`,
      type: 'success'
    });
    return [displaySetInstanceUID];
  } catch (error) {
    uiNotificationService.show({
      title: 'Create Report',
      message: error.message || `Failed to store ${reportType}`,
      type: 'error'
    });
    throw new Error(`Failed to store ${reportType}. Error: ${error.message || 'Unknown error'}`);
  } finally {
    uiDialogService.hide('loading-dialog');
  }
}
/* harmony default export */ const Actions_createReportAsync = (createReportAsync);
;// ../../../extensions/default/src/utils/getSRSeriesAndInstanceNumber.js
const MIN_SR_SERIES_NUMBER = 4700;
function getNextSeriesNumber({
  displaySetService,
  modality,
  minSeriesNumber
}) {
  const activeDisplaySets = displaySetService.getActiveDisplaySets();
  const modalityDisplaySets = activeDisplaySets.filter(ds => ds.Modality === modality);
  const modalitySeriesNumbers = modalityDisplaySets.map(ds => ds.SeriesNumber);
  const maxSeriesNumber = Math.max(...modalitySeriesNumbers, minSeriesNumber);
  const allSeriesNumbers = activeDisplaySets.map(ds => ds.SeriesNumber);
  let finalSeriesNumber = maxSeriesNumber + 1;
  while (allSeriesNumbers.includes(finalSeriesNumber)) {
    finalSeriesNumber++;
  }
  return {
    SeriesNumber: finalSeriesNumber,
    InstanceNumber: 1
  };
}
function getSRSeriesAndInstanceNumber({
  displaySetService,
  SeriesInstanceUid
}) {
  if (!SeriesInstanceUid) {
    return getNextSeriesNumber({
      displaySetService,
      modality: 'SR',
      minSeriesNumber: MIN_SR_SERIES_NUMBER
    });
  }
  const displaySetsMap = displaySetService.getDisplaySetCache();
  const displaySets = Array.from(displaySetsMap.values());
  const srDisplaySet = displaySets.find(ds => ds.Modality === 'SR' && ds.SeriesInstanceUID === SeriesInstanceUid);
  const InstanceNumber = srDisplaySet.instances?.length + 1;
  if (!srDisplaySet?.SeriesNumber || !InstanceNumber) {
    return getNextSeriesNumber({
      displaySetService,
      modality: 'SR',
      minSeriesNumber: MIN_SR_SERIES_NUMBER
    });
  }
  return {
    SeriesNumber: srDisplaySet.SeriesNumber,
    InstanceNumber,
    referenceDisplaySet: srDisplaySet
  };
}
;// ../../../extensions/default/src/utils/getCurrentDicomDateTime.ts
const getSeriesDateTime = (jsDate = new Date()) => {
  const dicomDateTime = getDicomDateTime(jsDate);
  return {
    SeriesDate: dicomDateTime.date,
    SeriesTime: dicomDateTime.time
  };
};
const getDicomDateTime = (jsDate = new Date()) => {
  const month = String(jsDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(jsDate.getUTCDate()).padStart(2, '0');
  const year = String(jsDate.getUTCFullYear()).padStart(4, '0');
  const date = `${year}${month}${day}`;
  const hours = String(jsDate.getUTCHours()).padStart(2, '0');
  const minutes = String(jsDate.getUTCMinutes()).padStart(2, '0');
  const seconds = String(jsDate.getUTCSeconds()).padStart(2, '0');
  const time = `${hours}${minutes}${seconds}`;
  return {
    date,
    time
  };
};
;// ../../../extensions/default/src/utils/promptSaveReport.tsx






const {
  filterAnd,
  filterMeasurementsByStudyUID,
  filterMeasurementsBySeriesUID
} = src.utils.MeasurementFilters;
async function promptSaveReport({
  servicesManager,
  commandsManager,
  extensionManager
}, ctx, evt) {
  const {
    measurementService,
    displaySetService
  } = servicesManager.services;
  const viewportId = evt.viewportId === undefined ? evt.data.viewportId : evt.viewportId;
  const isBackupSave = evt.isBackupSave === undefined ? evt.data.isBackupSave : evt.isBackupSave;
  const StudyInstanceUID = evt?.data?.StudyInstanceUID || ctx.trackedStudy;
  const SeriesInstanceUID = evt?.data?.SeriesInstanceUID;
  const {
    displaySetInstanceUID
  } = evt.data ?? evt;
  const {
    trackedSeries,
    measurementFilter = filterAnd(filterMeasurementsByStudyUID(StudyInstanceUID), filterMeasurementsBySeriesUID(trackedSeries)),
    defaultSaveTitle = 'Create Report'
  } = ctx;
  let displaySetInstanceUIDs;
  try {
    const promptResult = await CreateReportDialogPrompt({
      title: defaultSaveTitle,
      extensionManager,
      servicesManager
    });
    if (promptResult.action === PROMPT_RESPONSES/* default */.A.CREATE_REPORT) {
      const dataSources = extensionManager.getDataSources(promptResult.dataSourceName);
      const dataSource = dataSources[0];
      const measurementData = measurementService.getMeasurements(measurementFilter);
      const SeriesDescription = promptResult.value || defaultSaveTitle;
      const {
        SeriesNumber,
        InstanceNumber,
        referenceDisplaySet
      } = getSRSeriesAndInstanceNumber({
        displaySetService,
        SeriesInstanceUid: promptResult.series
      });
      const {
        SeriesDate,
        SeriesTime
      } = referenceDisplaySet ?? getSeriesDateTime();
      const getReport = async () => {
        return commandsManager.runCommand('storeMeasurements', {
          measurementData,
          dataSource,
          additionalFindingTypes: ['ArrowAnnotate'],
          options: {
            SeriesDescription,
            SeriesNumber,
            InstanceNumber,
            SeriesInstanceUID: promptResult.series,
            SeriesDate,
            SeriesTime
          }
        }, 'CORNERSTONE_STRUCTURED_REPORT');
      };
      displaySetInstanceUIDs = await Actions_createReportAsync({
        servicesManager,
        getReport
      });
    } else if (promptResult.action === RESPONSE.CANCEL) {
      // Do nothing
    }
    return {
      userResponse: promptResult.action,
      createdDisplaySetInstanceUIDs: displaySetInstanceUIDs,
      StudyInstanceUID,
      SeriesInstanceUID,
      viewportId,
      isBackupSave,
      displaySetInstanceUID
    };
  } catch (error) {
    console.warn('Unable to save report', error);
    return null;
  }
}
/* harmony default export */ const utils_promptSaveReport = (promptSaveReport);
;// ../../../extensions/default/src/commandsModule.ts















const commandsModule = ({
  servicesManager,
  commandsManager,
  extensionManager
}) => {
  const {
    customizationService,
    measurementService,
    hangingProtocolService,
    uiNotificationService,
    viewportGridService,
    displaySetService,
    multiMonitorService
  } = servicesManager.services;

  // Define a context menu controller for use with any context menus
  const contextMenuController = new ContextMenuController(servicesManager, commandsManager);
  const actions = {
    /**
     * Adds a display set as a layer to the specified viewport
     *
     * @param options.viewportId - The ID of the viewport to add the layer to
     * @param options.displaySetInstanceUID - The UID of the display set to add as a layer
     * @param options.removeFirst - Optional flag to remove the display set first if it's already added
     */
    addDisplaySetAsLayer: ({
      viewportId,
      displaySetInstanceUID,
      removeFirst = false
    }) => {
      if (!viewportId) {
        const {
          activeViewportId
        } = servicesManager.services.viewportGridService.getState();
        viewportId = activeViewportId;
      }
      if (!viewportId || !displaySetInstanceUID) {
        console.warn('Missing required parameters for addDisplaySetAsLayer command');
        return;
      }
      const {
        displaySetService,
        viewportGridService,
        hangingProtocolService
      } = servicesManager.services;

      // Get the display set
      const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
      if (!displaySet) {
        return;
      }

      // Get current display sets for the viewport
      const currentDisplaySetUIDs = viewportGridService.getDisplaySetsUIDsForViewport(viewportId);

      // Check if we can add this display set to the viewport
      const canAdd = canAddDisplaySetToViewport({
        viewportId,
        displaySetInstanceUID,
        servicesManager
      });
      if (!canAdd) {
        return;
      }

      // Add the display set to the viewport
      const updatedViewports = hangingProtocolService.getViewportsRequireUpdate(viewportId, displaySetInstanceUID);

      // Configure each viewport for layer addition
      updatedViewports.forEach(viewport => {
        configureViewportForLayerAddition({
          viewport,
          displaySetInstanceUID,
          currentDisplaySetUIDs,
          servicesManager
        });
      });

      // Update position presentation
      commandsManager.runCommand('updateStoredPositionPresentation', {
        viewportId,
        displaySetInstanceUIDs: updatedViewports[0].displaySetInstanceUIDs
      });

      // Run command to update viewports
      commandsManager.run('setDisplaySetsForViewports', {
        viewportsToUpdate: updatedViewports
      });
    },
    /**
     * Removes a display set layer from the specified viewport
     *
     * @param options.viewportId - The ID of the viewport to remove the layer from
     * @param options.displaySetInstanceUID - The UID of the display set to remove
     */
    removeDisplaySetLayer: ({
      viewportId,
      displaySetInstanceUID
    }) => {
      if (!viewportId || !displaySetInstanceUID) {
        console.warn('Missing required parameters for removeDisplaySetLayer command');
        return;
      }
      const {
        displaySetService,
        viewportGridService,
        hangingProtocolService,
        segmentationService
      } = servicesManager.services;

      // Get the display set
      const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
      if (!displaySet) {
        return;
      }

      // Get current display sets for the viewport
      const currentDisplaySetUIDs = viewportGridService.getDisplaySetsUIDsForViewport(viewportId);

      // If the display set is not in the viewport, no need to remove it
      if (!currentDisplaySetUIDs.includes(displaySetInstanceUID)) {
        return;
      }

      // Check if it's a segmentation and handle accordingly
      const isSegmentation = DERIVED_OVERLAY_MODALITIES.includes(displaySet.Modality);
      if (isSegmentation) {
        segmentationService.removeSegmentationRepresentations(viewportId, {
          segmentationId: displaySetInstanceUID
        });
      }
      const updatedViewports = hangingProtocolService.getViewportsRequireUpdate(viewportId, displaySetInstanceUID);

      // Configure each viewport for layer removal
      updatedViewports.forEach(viewport => {
        configureViewportForLayerRemoval({
          viewport,
          displaySetInstanceUID,
          currentDisplaySetUIDs,
          servicesManager
        });
      });

      // Update position presentation
      commandsManager.runCommand('updateStoredPositionPresentation', {
        viewportId,
        displaySetInstanceUIDs: updatedViewports[0].displaySetInstanceUIDs
      });

      // Update the viewports
      commandsManager.run('setDisplaySetsForViewports', {
        viewportsToUpdate: updatedViewports
      });
    },
    /**
     * Runs a command in multi-monitor mode.  No-op if not multi-monitor.
     */
    multimonitor: async options => {
      const {
        screenDelta,
        StudyInstanceUID,
        commands,
        hashParams
      } = options;
      if (multiMonitorService.numberOfScreens < 2) {
        return options.fallback?.(options);
      }
      const newWindow = await multiMonitorService.launchWindow(StudyInstanceUID, screenDelta, hashParams);

      // Only run commands if we successfully got a window with a commands manager
      if (newWindow && commands) {
        // Todo: fix this properly, but it takes time for the new window to load
        // and then the commandsManager is available for it
        setTimeout(() => {
          multiMonitorService.run(screenDelta, commands, options);
        }, 1000);
      }
    },
    /** Displays a prompt and then save the report if relevant */
    promptSaveReport: props => {
      const {
        StudyInstanceUID
      } = props;
      utils_promptSaveReport({
        servicesManager,
        commandsManager,
        extensionManager
      }, props, {
        data: {
          StudyInstanceUID
        }
      });
    },
    /**
     * Ensures that the specified study is available for display
     * Then, if commands is specified, runs the given commands list/instance
     */
    loadStudy: async options => {
      const {
        StudyInstanceUID
      } = options;
      const displaySets = displaySetService.getActiveDisplaySets();
      const isActive = displaySets.find(ds => ds.StudyInstanceUID === StudyInstanceUID);
      if (isActive) {
        return;
      }
      const [dataSource] = extensionManager.getActiveDataSource();
      await Panels_requestDisplaySetCreationForStudy(dataSource, displaySetService, StudyInstanceUID);
      const study = src.DicomMetadataStore.getStudy(StudyInstanceUID);
      hangingProtocolService.addStudy(study);
    },
    /**
     * Show the context menu.
     * @param options.menuId defines the menu name to lookup, from customizationService
     * @param options.defaultMenu contains the default menu set to use
     * @param options.element is the element to show the menu within
     * @param options.event is the event that caused the context menu
     * @param options.selectorProps is the set of selection properties to use
     */
    showContextMenu: options => {
      const {
        menuCustomizationId,
        element,
        event,
        selectorProps,
        defaultPointsPosition = []
      } = options;
      const optionsToUse = {
        ...options
      };
      if (menuCustomizationId) {
        Object.assign(optionsToUse, customizationService.getCustomization(menuCustomizationId));
      }

      // TODO - make the selectorProps richer by including the study metadata and display set.
      const {
        protocol,
        stage
      } = hangingProtocolService.getActiveProtocol();
      optionsToUse.selectorProps = {
        event,
        protocol,
        stage,
        ...selectorProps
      };
      contextMenuController.showContextMenu(optionsToUse, element, defaultPointsPosition);
    },
    /** Close a context menu currently displayed */
    closeContextMenu: () => {
      contextMenuController.closeContextMenu();
    },
    displayNotification: ({
      text,
      title,
      type
    }) => {
      uiNotificationService.show({
        title: title,
        message: text,
        type: type
      });
    },
    clearMeasurements: options => {
      measurementService.clearMeasurements(options.measurementFilter);
    },
    /**
     *  Sets the specified protocol
     *    1. Records any existing state using the viewport grid service
     *    2. Finds the destination state - this can be one of:
     *       a. The specified protocol stage
     *       b. An alternate (toggled or restored) protocol stage
     *       c. A restored custom layout
     *    3. Finds the parameters for the specified state
     *       a. Gets the displaySetSelectorMap
     *       b. Gets the map by position
     *       c. Gets any toggle mapping to map position to/from current view
     *    4. If restore, then sets layout
     *       a. Maps viewport position by currently displayed viewport map id
     *       b. Uses toggle information to map display set id
     *    5. Else applies the hanging protocol
     *       a. HP Service is provided displaySetSelectorMap
     *       b. HP Service will throw an exception if it isn't applicable
     * @param options - contains information on the HP to apply
     * @param options.activeStudyUID - the updated study to apply the HP to
     * @param options.protocolId - the protocol ID to change to
     * @param options.stageId - the stageId to apply
     * @param options.stageIndex - the index of the stage to go to.
     * @param options.reset - flag to indicate if the HP should be reset to its original and not restored to a previous state
     *
     * commandsManager.run('setHangingProtocol', {
     *   activeStudyUID: '1.2.3',
     *   protocolId: 'myProtocol',
     *   stageId: 'myStage',
     *   stageIndex: 0,
     *   reset: false,
     * });
     */
    setHangingProtocol: ({
      activeStudyUID = '',
      StudyInstanceUID = '',
      protocolId,
      stageId,
      stageIndex,
      reset = false
    }) => {
      const toUseStudyInstanceUID = activeStudyUID || StudyInstanceUID;
      try {
        // Stores in the state the display set selector id to displaySetUID mapping
        // Pass in viewportId for the active viewport.  This item will get set as
        // the activeViewportId
        const state = viewportGridService.getState();
        const hpInfo = hangingProtocolService.getState();
        reuseCachedLayouts(state, hangingProtocolService);
        const {
          hangingProtocolStageIndexMap
        } = useHangingProtocolStageIndexStore.getState();
        const {
          displaySetSelectorMap
        } = useDisplaySetSelectorStore.getState();
        if (!protocolId) {
          // Reuse the previous protocol id, and optionally stage
          protocolId = hpInfo.protocolId;
          if (stageId === undefined && stageIndex === undefined) {
            stageIndex = hpInfo.stageIndex;
          }
        } else if (stageIndex === undefined && stageId === undefined) {
          // Re-set the same stage as was previously used
          const hangingId = `${toUseStudyInstanceUID || hpInfo.activeStudyUID}:${protocolId}`;
          stageIndex = hangingProtocolStageIndexMap[hangingId]?.stageIndex;
        }
        const useStageIdx = stageIndex ?? hangingProtocolService.getStageIndex(protocolId, {
          stageId,
          stageIndex
        });
        const activeStudyChanged = hangingProtocolService.setActiveStudyUID(toUseStudyInstanceUID);
        const storedHanging = `${toUseStudyInstanceUID || hangingProtocolService.getState().activeStudyUID}:${protocolId}:${useStageIdx || 0}`;
        const {
          viewportGridState
        } = useViewportGridStore.getState();
        const restoreProtocol = !reset && viewportGridState[storedHanging];
        if (reset || activeStudyChanged && !viewportGridState[storedHanging] && stageIndex === undefined && stageId === undefined) {
          // Run the hanging protocol fresh, re-using the existing study data
          // This is done on reset or when the study changes and we haven't yet
          // applied it, and don't specify exact stage to use.
          const displaySets = displaySetService.getActiveDisplaySets();
          const activeStudy = {
            StudyInstanceUID: toUseStudyInstanceUID,
            displaySets
          };
          hangingProtocolService.run(activeStudy, protocolId);
        } else if (protocolId === hpInfo.protocolId && useStageIdx === hpInfo.stageIndex && !toUseStudyInstanceUID) {
          // Clear the HP setting to reset them
          hangingProtocolService.setProtocol(protocolId, {
            stageId,
            stageIndex: useStageIdx,
            displaySetSelectorMap
          });
        } else {
          hangingProtocolService.setProtocol(protocolId, {
            displaySetSelectorMap,
            stageId,
            stageIndex: useStageIdx,
            restoreProtocol
          });
          if (restoreProtocol) {
            viewportGridService.set(viewportGridState[storedHanging]);
          }
        }
        // Do this after successfully applying the update
        const {
          setDisplaySetSelector
        } = useDisplaySetSelectorStore.getState();
        setDisplaySetSelector(`${toUseStudyInstanceUID || hpInfo.activeStudyUID}:activeDisplaySet:0`, null);
        return true;
      } catch (e) {
        console.error(e);
        uiNotificationService.show({
          title: 'Apply Hanging Protocol',
          message: 'The hanging protocol could not be applied.',
          type: 'error',
          duration: 3000
        });
        return false;
      }
    },
    toggleHangingProtocol: ({
      protocolId,
      stageIndex
    }) => {
      const {
        protocol,
        stageIndex: desiredStageIndex,
        activeStudy
      } = hangingProtocolService.getActiveProtocol();
      const {
        toggleHangingProtocol,
        setToggleHangingProtocol
      } = useToggleHangingProtocolStore.getState();
      const storedHanging = `${activeStudy.StudyInstanceUID}:${protocolId}:${stageIndex | 0}`;
      if (protocol.id === protocolId && (stageIndex === undefined || stageIndex === desiredStageIndex)) {
        // Toggling off - restore to previous state
        const previousState = toggleHangingProtocol[storedHanging] || {
          protocolId: 'default'
        };
        return actions.setHangingProtocol(previousState);
      } else {
        setToggleHangingProtocol(storedHanging, {
          protocolId: protocol.id,
          stageIndex: desiredStageIndex
        });
        return actions.setHangingProtocol({
          protocolId,
          stageIndex,
          reset: true
        });
      }
    },
    deltaStage: ({
      direction
    }) => {
      const {
        protocolId,
        stageIndex: oldStageIndex
      } = hangingProtocolService.getState();
      const {
        protocol
      } = hangingProtocolService.getActiveProtocol();
      for (let stageIndex = oldStageIndex + direction; stageIndex >= 0 && stageIndex < protocol.stages.length; stageIndex += direction) {
        if (protocol.stages[stageIndex].status !== 'disabled') {
          return actions.setHangingProtocol({
            protocolId,
            stageIndex
          });
        }
      }
      uiNotificationService.show({
        title: 'Change Stage',
        message: 'The hanging protocol has no more applicable stages',
        type: 'info',
        duration: 3000
      });
    },
    /**
     * Changes the viewport grid layout in terms of the MxN layout.
     */
    setViewportGridLayout: ({
      numRows,
      numCols,
      isHangingProtocolLayout = false
    }) => {
      const {
        protocol
      } = hangingProtocolService.getActiveProtocol();
      const onLayoutChange = protocol.callbacks?.onLayoutChange;
      if (commandsManager.run(onLayoutChange, {
        numRows,
        numCols
      }) === false) {
        // Don't apply the layout if the run command returns false
        return;
      }
      const completeLayout = () => {
        const state = viewportGridService.getState();
        src_findViewportsByPosition(state, {
          numRows,
          numCols
        });
        const {
          viewportsByPosition,
          initialInDisplay
        } = useViewportsByPositionStore.getState();
        const findOrCreateViewport = findViewportsByPosition_findOrCreateViewport.bind(null, hangingProtocolService, isHangingProtocolLayout, {
          ...viewportsByPosition,
          initialInDisplay
        });
        viewportGridService.setLayout({
          numRows,
          numCols,
          findOrCreateViewport,
          isHangingProtocolLayout
        });
      };
      // Need to finish any work in the callback
      window.setTimeout(completeLayout, 0);
    },
    toggleOneUp() {
      const viewportGridState = viewportGridService.getState();
      const {
        activeViewportId,
        viewports,
        layout,
        isHangingProtocolLayout
      } = viewportGridState;
      const {
        displaySetInstanceUIDs,
        displaySetOptions,
        viewportOptions
      } = viewports.get(activeViewportId);
      if (layout.numCols === 1 && layout.numRows === 1) {
        // The viewer is in one-up. Check if there is a state to restore/toggle back to.
        const {
          toggleOneUpViewportGridStore
        } = useToggleOneUpViewportGridStore.getState();
        if (!toggleOneUpViewportGridStore) {
          return;
        }
        // There is a state to toggle back to. The viewport that was
        // originally toggled to one up was the former active viewport.
        const viewportIdToUpdate = toggleOneUpViewportGridStore.activeViewportId;

        // We are restoring the previous layout but taking into the account that
        // the current one up viewport might have a new displaySet dragged and dropped on it.
        // updatedViewportsViaHP below contains the viewports applicable to the HP that existed
        // prior to the toggle to one-up - including the updated viewports if a display
        // set swap were to have occurred.
        const updatedViewportsViaHP = displaySetInstanceUIDs.length > 1 ? [] : displaySetInstanceUIDs.map(displaySetInstanceUID => hangingProtocolService.getViewportsRequireUpdate(viewportIdToUpdate, displaySetInstanceUID, isHangingProtocolLayout)).flat();

        // findOrCreateViewport returns either one of the updatedViewportsViaHP
        // returned from the HP service OR if there is not one from the HP service then
        // simply returns what was in the previous state for a given position in the layout.
        const findOrCreateViewport = (position, positionId) => {
          // Find the viewport for the given position prior to the toggle to one-up.
          const preOneUpViewport = Array.from(toggleOneUpViewportGridStore.viewports.values()).find(viewport => viewport.positionId === positionId);

          // Use the viewport id from before the toggle to one-up to find any updates to the viewport.
          const viewport = updatedViewportsViaHP.find(viewport => viewport.viewportId === preOneUpViewport.viewportId);
          return viewport ?
          // Use the applicable viewport from the HP updated viewports
          {
            viewportOptions,
            displaySetOptions,
            ...viewport
          } :
          // Use the previous viewport for the given position
          preOneUpViewport;
        };
        const layoutOptions = viewportGridService.getLayoutOptionsFromState(toggleOneUpViewportGridStore);

        // Restore the previous layout including the active viewport.
        viewportGridService.setLayout({
          numRows: toggleOneUpViewportGridStore.layout.numRows,
          numCols: toggleOneUpViewportGridStore.layout.numCols,
          activeViewportId: viewportIdToUpdate,
          layoutOptions,
          findOrCreateViewport,
          isHangingProtocolLayout: true
        });

        // Reset crosshairs after restoring the layout
        setTimeout(() => {
          commandsManager.runCommand('resetCrosshairs');
        }, 0);
      } else {
        // We are not in one-up, so toggle to one up.

        // Store the current viewport grid state so we can toggle it back later.
        const {
          setToggleOneUpViewportGridStore
        } = useToggleOneUpViewportGridStore.getState();
        setToggleOneUpViewportGridStore(viewportGridState);

        // one being toggled to one up.
        const findOrCreateViewport = () => {
          return {
            displaySetInstanceUIDs,
            displaySetOptions,
            viewportOptions
          };
        };

        // Set the layout to be 1x1/one-up.
        viewportGridService.setLayout({
          numRows: 1,
          numCols: 1,
          findOrCreateViewport,
          isHangingProtocolLayout: true
        });
      }
    },
    /**
     * Exposes the browser history navigation used by OHIF. This command can be used to either replace or
     * push a new entry into the browser history. For example, the following will replace the current
     * browser history entry with the specified relative URL which changes the study displayed to the
     * study with study instance UID 1.2.3. Note that as a result of using `options.replace = true`, the
     * page prior to invoking this command cannot be returned to via the browser back button.
     *
     * navigateHistory({
     *   to: 'viewer?StudyInstanceUIDs=1.2.3',
     *   options: { replace: true },
     * });
     *
     * @param historyArgs - arguments for the history function;
     *                      the `to` property is the URL;
     *                      the `options.replace` is a boolean indicating if the current browser history entry
     *                      should be replaced or a new entry pushed onto the history (stack); the default value
     *                      for `replace` is false
     */
    navigateHistory(historyArgs) {
      index/* history */.b6.navigate(historyArgs.to, historyArgs.options);
    },
    openDICOMTagViewer({
      displaySetInstanceUID
    }) {
      const {
        activeViewportId,
        viewports
      } = viewportGridService.getState();
      const activeViewportSpecificData = viewports.get(activeViewportId);
      const {
        displaySetInstanceUIDs
      } = activeViewportSpecificData;
      const displaySets = displaySetService.activeDisplaySets;
      const {
        UIModalService
      } = servicesManager.services;
      const defaultDisplaySetInstanceUID = displaySetInstanceUID || displaySetInstanceUIDs[0];
      UIModalService.show({
        content: DicomTagBrowser_DicomTagBrowser,
        contentProps: {
          displaySets,
          displaySetInstanceUID: defaultDisplaySetInstanceUID
        },
        title: 'DICOM Tag Browser',
        containerClassName: 'max-w-3xl'
      });
    },
    /**
     * Toggle viewport overlay (the information panel shown on the four corners
     * of the viewport)
     * @see ViewportOverlay and CustomizableViewportOverlay components
     */
    toggleOverlays: () => {
      const overlays = document.getElementsByClassName('viewport-overlay');
      for (let i = 0; i < overlays.length; i++) {
        overlays.item(i).classList.toggle('hidden');
      }
    },
    scrollActiveThumbnailIntoView: () => {
      const {
        activeViewportId,
        viewports
      } = viewportGridService.getState();
      const activeViewport = viewports.get(activeViewportId);
      const activeDisplaySetInstanceUID = activeViewport?.displaySetInstanceUIDs?.[0];
      if (!activeDisplaySetInstanceUID) {
        return;
      }
      const thumbnailList = document.querySelector('#ohif-thumbnail-list');
      if (!thumbnailList) {
        return;
      }
      const thumbnail = document.querySelector(`#thumbnail-${activeDisplaySetInstanceUID}`);
      if (!thumbnail) {
        return;
      }
      thumbnail.scrollIntoView({
        behavior: 'smooth'
      });
    },
    updateViewportDisplaySet: ({
      direction,
      excludeNonImageModalities
    }) => {
      const nonImageModalities = ['SR', 'SEG', 'SM', 'RTSTRUCT', 'RTPLAN', 'RTDOSE'];
      const currentDisplaySets = [...displaySetService.activeDisplaySets];
      const {
        activeViewportId,
        viewports,
        isHangingProtocolLayout
      } = viewportGridService.getState();
      const {
        displaySetInstanceUIDs
      } = viewports.get(activeViewportId);
      const activeDisplaySetIndex = currentDisplaySets.findIndex(displaySet => displaySetInstanceUIDs.includes(displaySet.displaySetInstanceUID));
      let displaySetIndexToShow;
      for (displaySetIndexToShow = activeDisplaySetIndex + direction; displaySetIndexToShow > -1 && displaySetIndexToShow < currentDisplaySets.length; displaySetIndexToShow += direction) {
        if (!excludeNonImageModalities || !nonImageModalities.includes(currentDisplaySets[displaySetIndexToShow].Modality)) {
          break;
        }
      }
      if (displaySetIndexToShow < 0 || displaySetIndexToShow >= currentDisplaySets.length) {
        return;
      }
      const {
        displaySetInstanceUID
      } = currentDisplaySets[displaySetIndexToShow];
      let updatedViewports = [];
      try {
        updatedViewports = hangingProtocolService.getViewportsRequireUpdate(activeViewportId, displaySetInstanceUID, isHangingProtocolLayout);
      } catch (error) {
        console.warn(error);
        uiNotificationService.show({
          title: 'Navigate Viewport Display Set',
          message: 'The requested display sets could not be added to the viewport due to a mismatch in the Hanging Protocol rules.',
          type: 'info',
          duration: 3000
        });
      }
      commandsManager.run('setDisplaySetsForViewports', {
        viewportsToUpdate: updatedViewports
      });
      setTimeout(() => actions.scrollActiveThumbnailIntoView(), 0);
    }
  };
  const definitions = {
    multimonitor: actions.multimonitor,
    promptSaveReport: actions.promptSaveReport,
    loadStudy: actions.loadStudy,
    showContextMenu: actions.showContextMenu,
    closeContextMenu: actions.closeContextMenu,
    clearMeasurements: actions.clearMeasurements,
    displayNotification: actions.displayNotification,
    setHangingProtocol: actions.setHangingProtocol,
    toggleHangingProtocol: actions.toggleHangingProtocol,
    navigateHistory: actions.navigateHistory,
    nextStage: {
      commandFn: actions.deltaStage,
      options: {
        direction: 1
      }
    },
    previousStage: {
      commandFn: actions.deltaStage,
      options: {
        direction: -1
      }
    },
    setViewportGridLayout: actions.setViewportGridLayout,
    toggleOneUp: actions.toggleOneUp,
    openDICOMTagViewer: actions.openDICOMTagViewer,
    updateViewportDisplaySet: actions.updateViewportDisplaySet,
    scrollActiveThumbnailIntoView: actions.scrollActiveThumbnailIntoView,
    addDisplaySetAsLayer: actions.addDisplaySetAsLayer,
    removeDisplaySetLayer: actions.removeDisplaySetLayer
  };
  return {
    actions,
    definitions,
    defaultContext: 'DEFAULT'
  };
};
/* harmony default export */ const src_commandsModule = (commandsModule);
;// ../../../extensions/default/src/hangingprotocols/utils/studySelectors.ts
const studyWithImages = [{
  id: 'OneOrMoreSeries',
  weight: 25,
  attribute: 'numberOfDisplaySetsWithImages',
  constraint: {
    greaterThan: 0
  }
}];
;// ../../../extensions/default/src/hangingprotocols/utils/seriesSelectors.ts
const seriesWithImages = [{
  attribute: 'numImageFrames',
  constraint: {
    greaterThan: {
      value: 0
    }
  },
  weight: 1,
  required: true
},
// This display set will select the specified items by preference
// It has no affect if nothing is specified in the URL.
{
  attribute: 'isDisplaySetFromUrl',
  weight: 20,
  constraint: {
    equals: true
  }
}];
;// ../../../extensions/default/src/hangingprotocols/utils/viewportOptions.ts
/** A default viewport options */
const viewportOptions = {
  toolGroupId: 'default',
  allowUnmatchedView: true,
  syncGroups: [{
    type: 'hydrateseg',
    id: 'sameFORId',
    source: true,
    target: true,
    options: {
      matchingRules: ['sameFOR']
    }
  }]
};
const hydrateSegDefault = (/* unused pure expression or super */ null && (viewportOptions));
;// ../../../extensions/default/src/hangingprotocols/hpMNGrid.ts




/**
 * Sync group configuration for hydrating segmentations across viewports
 * that share the same frame of reference
 * @type {Types.HangingProtocol.SyncGroup}
 */
const HYDRATE_SEG_SYNC_GROUP = {
  type: 'hydrateseg',
  id: 'sameFORId',
  source: true,
  target: true,
  options: {
    matchingRules: ['sameFOR']
  }
};

/**
 * This hanging protocol can be activated on the primary mode by directly
 * referencing it in a URL or by directly including it within a mode, e.g.:
 * `&hangingProtocolId=@ohif/mnGrid` added to the viewer URL
 * It is not included in the viewer mode by default.
 */
const hpMN = {
  id: '@ohif/mnGrid',
  description: 'Has various hanging protocol grid layouts',
  name: '2x2',
  protocolMatchingRules: studyWithImages,
  toolGroupIds: ['default'],
  displaySetSelectors: {
    defaultDisplaySetId: {
      allowUnmatchedView: true,
      seriesMatchingRules: seriesWithImages
    }
  },
  defaultViewport: {
    viewportOptions: {
      viewportType: 'stack',
      toolGroupId: 'default',
      syncGroups: [HYDRATE_SEG_SYNC_GROUP]
    },
    displaySets: [{
      id: 'defaultDisplaySetId',
      matchedDisplaySetsIndex: -1
    }]
  },
  stages: [{
    id: '2x2',
    name: '2x2',
    stageActivation: {
      enabled: {
        minViewportsMatched: 4
      }
    },
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 2,
        columns: 2
      }
    },
    viewports: [{
      viewportOptions: viewportOptions,
      displaySets: [{
        id: 'defaultDisplaySetId'
      }]
    }, {
      viewportOptions: viewportOptions,
      displaySets: [{
        matchedDisplaySetsIndex: 1,
        id: 'defaultDisplaySetId'
      }]
    }, {
      viewportOptions: viewportOptions,
      displaySets: [{
        matchedDisplaySetsIndex: 2,
        id: 'defaultDisplaySetId'
      }]
    }, {
      viewportOptions: viewportOptions,
      displaySets: [{
        matchedDisplaySetsIndex: 3,
        id: 'defaultDisplaySetId'
      }]
    }]
  },
  // 3x1 stage
  {
    name: '3x1',
    stageActivation: {
      enabled: {
        minViewportsMatched: 3
      }
    },
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 1,
        columns: 3
      }
    },
    viewports: [{
      viewportOptions: viewportOptions,
      displaySets: [{
        id: 'defaultDisplaySetId'
      }]
    }, {
      viewportOptions: viewportOptions,
      displaySets: [{
        id: 'defaultDisplaySetId',
        matchedDisplaySetsIndex: 1
      }]
    }, {
      viewportOptions: viewportOptions,
      displaySets: [{
        id: 'defaultDisplaySetId',
        matchedDisplaySetsIndex: 2
      }]
    }]
  },
  // A 2x1 stage
  {
    name: '2x1',
    stageActivation: {
      enabled: {
        minViewportsMatched: 2
      }
    },
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 1,
        columns: 2
      }
    },
    viewports: [{
      viewportOptions: viewportOptions,
      displaySets: [{
        id: 'defaultDisplaySetId'
      }]
    }, {
      viewportOptions: viewportOptions,
      displaySets: [{
        matchedDisplaySetsIndex: 1,
        id: 'defaultDisplaySetId'
      }]
    }]
  },
  // A 1x1 stage - should be automatically activated if there is only 1 viewable instance
  {
    name: '1x1',
    stageActivation: {
      enabled: {
        minViewportsMatched: 1
      }
    },
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 1,
        columns: 1
      }
    },
    viewports: [{
      viewportOptions: viewportOptions,
      displaySets: [{
        id: 'defaultDisplaySetId'
      }]
    }]
  }],
  numberOfPriorsReferenced: -1
};

/**
 * This hanging protocol can be activated on the primary mode by directly
 * referencing it in a URL or by directly including it within a mode, e.g.:
 * `&hangingProtocolId=@ohif/mnGrid8` added to the viewer URL
 * It is not included in the viewer mode by default.
 */
const hpMN8 = {
  ...hpMN,
  id: '@ohif/mnGrid8',
  description: 'Has various hanging protocol grid layouts up to 4x2',
  name: '4x2',
  stages: [{
    id: '4x2',
    name: '4x2',
    stageActivation: {
      enabled: {
        minViewportsMatched: 7
      }
    },
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 2,
        columns: 4
      }
    },
    viewports: [{
      viewportOptions: viewportOptions,
      displaySets: [{
        id: 'defaultDisplaySetId'
      }]
    }, {
      viewportOptions: viewportOptions,
      displaySets: [{
        matchedDisplaySetsIndex: 1,
        id: 'defaultDisplaySetId'
      }]
    }, {
      viewportOptions: viewportOptions,
      displaySets: [{
        matchedDisplaySetsIndex: 2,
        id: 'defaultDisplaySetId'
      }]
    }, {
      viewportOptions: viewportOptions,
      displaySets: [{
        matchedDisplaySetsIndex: 3,
        id: 'defaultDisplaySetId'
      }]
    }, {
      viewportOptions: viewportOptions,
      displaySets: [{
        matchedDisplaySetsIndex: 4,
        id: 'defaultDisplaySetId'
      }]
    }, {
      viewportOptions: viewportOptions,
      displaySets: [{
        matchedDisplaySetsIndex: 5,
        id: 'defaultDisplaySetId'
      }]
    }, {
      viewportOptions: viewportOptions,
      displaySets: [{
        matchedDisplaySetsIndex: 6,
        id: 'defaultDisplaySetId'
      }]
    }, {
      viewportOptions: viewportOptions,
      displaySets: [{
        matchedDisplaySetsIndex: 7,
        id: 'defaultDisplaySetId'
      }]
    }]
  }, {
    id: '3x2',
    name: '3x2',
    stageActivation: {
      enabled: {
        minViewportsMatched: 5
      }
    },
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 2,
        columns: 3
      }
    },
    viewports: [{
      viewportOptions: viewportOptions,
      displaySets: [{
        id: 'defaultDisplaySetId'
      }]
    }, {
      viewportOptions: viewportOptions,
      displaySets: [{
        matchedDisplaySetsIndex: 1,
        id: 'defaultDisplaySetId'
      }]
    }, {
      viewportOptions: viewportOptions,
      displaySets: [{
        matchedDisplaySetsIndex: 2,
        id: 'defaultDisplaySetId'
      }]
    }, {
      viewportOptions: viewportOptions,
      displaySets: [{
        matchedDisplaySetsIndex: 3,
        id: 'defaultDisplaySetId'
      }]
    }, {
      viewportOptions: viewportOptions,
      displaySets: [{
        matchedDisplaySetsIndex: 4,
        id: 'defaultDisplaySetId'
      }]
    }, {
      viewportOptions: viewportOptions,
      displaySets: [{
        matchedDisplaySetsIndex: 5,
        id: 'defaultDisplaySetId'
      }]
    }]
  }, ...hpMN.stages]
};
/* harmony default export */ const hpMNGrid = ((/* unused pure expression or super */ null && (hpMN)));
;// ../../../extensions/default/src/hangingprotocols/hpCompare.ts
const defaultDisplaySetSelector = {
  studyMatchingRules: [{
    // The priorInstance is a study counter that indicates what position this study is in
    // and the value comes from the options parameter.
    attribute: 'studyInstanceUIDsIndex',
    from: 'options',
    required: true,
    constraint: {
      equals: {
        value: 0
      }
    }
  }],
  seriesMatchingRules: [{
    attribute: 'numImageFrames',
    constraint: {
      greaterThan: {
        value: 0
      }
    }
  },
  // This display set will select the specified items by preference
  // It has no affect if nothing is specified in the URL.
  {
    attribute: 'isDisplaySetFromUrl',
    weight: 20,
    constraint: {
      equals: true
    }
  }]
};
const priorDisplaySetSelector = {
  studyMatchingRules: [{
    // The priorInstance is a study counter that indicates what position this study is in
    // and the value comes from the options parameter.
    attribute: 'studyInstanceUIDsIndex',
    from: 'options',
    required: true,
    constraint: {
      equals: {
        value: 1
      }
    }
  }],
  seriesMatchingRules: [{
    attribute: 'numImageFrames',
    constraint: {
      greaterThan: {
        value: 0
      }
    }
  },
  // This display set will select the specified items by preference
  // It has no affect if nothing is specified in the URL.
  {
    attribute: 'isDisplaySetFromUrl',
    weight: 20,
    constraint: {
      equals: true
    }
  }]
};
const currentDisplaySet = {
  id: 'defaultDisplaySetId'
};
const priorDisplaySet = {
  id: 'priorDisplaySetId'
};
const currentViewport0 = {
  viewportOptions: {
    toolGroupId: 'default',
    allowUnmatchedView: true
  },
  displaySets: [currentDisplaySet]
};
const currentViewport1 = {
  ...currentViewport0,
  displaySets: [{
    ...currentDisplaySet,
    matchedDisplaySetsIndex: 1
  }]
};
const priorViewport0 = {
  ...currentViewport0,
  displaySets: [priorDisplaySet]
};
const priorViewport1 = {
  ...priorViewport0,
  displaySets: [{
    ...priorDisplaySet,
    matchedDisplaySetsIndex: 1
  }]
};

/**
 * This hanging protocol can be activated on the primary mode by directly
 * referencing it in a URL or by directly including it within a mode, e.g.:
 * `&hangingProtocolId=@ohif/mnGrid` added to the viewer URL
 * It is not included in the viewer mode by default.
 */
const hpMNCompare = {
  id: '@ohif/hpCompare',
  description: 'Compare two studies in various layouts',
  name: 'Compare Two Studies',
  numberOfPriorsReferenced: 1,
  protocolMatchingRules: [{
    id: 'Two Studies',
    weight: 1000,
    // is there a second study or in another work the attribute
    // studyInstanceUIDsIndex that we get from prior should not be null
    attribute: 'StudyInstanceUID',
    from: 'prior',
    required: true,
    constraint: {
      notNull: true
    }
  }],
  toolGroupIds: ['default'],
  displaySetSelectors: {
    defaultDisplaySetId: defaultDisplaySetSelector,
    priorDisplaySetId: priorDisplaySetSelector
  },
  defaultViewport: {
    viewportOptions: {
      viewportType: 'stack',
      toolGroupId: 'default',
      allowUnmatchedView: true
    },
    displaySets: [{
      id: 'defaultDisplaySetId',
      matchedDisplaySetsIndex: -1
    }]
  },
  stages: [{
    name: '2x2',
    stageActivation: {
      enabled: {
        minViewportsMatched: 4
      }
    },
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 2,
        columns: 2
      }
    },
    viewports: [currentViewport0, priorViewport0, currentViewport1, priorViewport1]
  }, {
    name: '2x1',
    stageActivation: {
      enabled: {
        minViewportsMatched: 2
      }
    },
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 1,
        columns: 2
      }
    },
    viewports: [currentViewport0, priorViewport0]
  }]
};
/* harmony default export */ const hpCompare = (hpMNCompare);
;// ../../../extensions/default/src/hangingprotocols/utils/mammoDisplaySetSelector.ts
const priorStudyMatchingRules = [{
  // The priorInstance is a study counter that indicates what position this study is in
  // and the value comes from the options parameter.
  attribute: 'studyInstanceUIDsIndex',
  from: 'options',
  required: true,
  constraint: {
    equals: {
      value: 1
    }
  }
}];
const currentStudyMatchingRules = [{
  // The priorInstance is a study counter that indicates what position this study is in
  // and the value comes from the options parameter.
  attribute: 'studyInstanceUIDsIndex',
  from: 'options',
  required: true,
  constraint: {
    equals: {
      value: 0
    }
  }
}];
const LCCSeriesMatchingRules = [{
  weight: 10,
  attribute: 'ViewCode',
  constraint: {
    contains: 'SCT:399162004'
  }
}, {
  weight: 5,
  attribute: 'PatientOrientation',
  constraint: {
    contains: 'L'
  }
}, {
  weight: 20,
  attribute: 'SeriesDescription',
  constraint: {
    contains: 'L CC'
  }
}];
const RCCSeriesMatchingRules = [{
  weight: 10,
  attribute: 'ViewCode',
  constraint: {
    contains: 'SCT:399162004'
  }
}, {
  weight: 5,
  attribute: 'PatientOrientation',
  constraint: {
    equals: ['P', 'L']
  }
}, {
  attribute: 'PatientOrientation',
  constraint: {
    doesNotEqual: ['A', 'R']
  },
  required: true
}, {
  weight: 20,
  attribute: 'SeriesDescription',
  constraint: {
    contains: 'CC'
  }
}];
const LMLOSeriesMatchingRules = [{
  weight: 10,
  attribute: 'ViewCode',
  constraint: {
    contains: 'SCT:399368009'
  }
}, {
  weight: 0,
  attribute: 'ViewCode',
  constraint: {
    doesNotEqual: 'SCT:399162004'
  },
  required: true
}, {
  weight: 5,
  attribute: 'PatientOrientation',
  constraint: {
    equals: ['A', 'R']
  }
}, {
  weight: 20,
  attribute: 'SeriesDescription',
  constraint: {
    contains: 'L MLO'
  }
}];
const RMLOSeriesMatchingRules = [{
  weight: 10,
  attribute: 'ViewCode',
  constraint: {
    contains: 'SCT:399368009'
  }
}, {
  attribute: 'ViewCode',
  constraint: {
    doesNotEqual: 'SCT:399162004'
  },
  required: true
}, {
  attribute: 'PatientOrientation',
  constraint: {
    doesNotContain: ['P', 'FL']
  },
  required: true
}, {
  weight: 5,
  attribute: 'PatientOrientation',
  constraint: {
    equals: ['P', 'L']
  }
}, {
  weight: 5,
  attribute: 'PatientOrientation',
  constraint: {
    equals: ['A', 'FR']
  }
}, {
  weight: 20,
  attribute: 'SeriesDescription',
  constraint: {
    contains: 'R MLO'
  }
}, {
  attribute: 'SeriesDescription',
  required: true,
  constraint: {
    doesNotContain: 'CC'
  }
}, {
  attribute: 'SeriesDescription',
  required: true,
  constraint: {
    doesNotEqual: 'L MLO'
  },
  required: true
}];
const RCC = {
  seriesMatchingRules: RCCSeriesMatchingRules,
  studyMatchingRules: currentStudyMatchingRules
};
const RCCPrior = {
  seriesMatchingRules: RCCSeriesMatchingRules,
  studyMatchingRules: priorStudyMatchingRules
};
const LCC = {
  seriesMatchingRules: LCCSeriesMatchingRules,
  studyMatchingRules: currentStudyMatchingRules
};
const LCCPrior = {
  seriesMatchingRules: LCCSeriesMatchingRules,
  studyMatchingRules: priorStudyMatchingRules
};
const RMLO = {
  seriesMatchingRules: RMLOSeriesMatchingRules,
  studyMatchingRules: currentStudyMatchingRules
};
const RMLOPrior = {
  seriesMatchingRules: RMLOSeriesMatchingRules,
  studyMatchingRules: priorStudyMatchingRules
};
const LMLO = {
  seriesMatchingRules: LMLOSeriesMatchingRules,
  studyMatchingRules: currentStudyMatchingRules
};
const LMLOPrior = {
  seriesMatchingRules: LMLOSeriesMatchingRules,
  studyMatchingRules: priorStudyMatchingRules
};

;// ../../../extensions/default/src/hangingprotocols/hpMammo.ts

const rightDisplayArea = {
  storeAsInitialCamera: true,
  imageArea: [0.8, 0.8],
  imageCanvasPoint: {
    imagePoint: [0, 0.5],
    canvasPoint: [0, 0.5]
  }
};
const leftDisplayArea = {
  storeAsInitialCamera: true,
  imageArea: [0.8, 0.8],
  imageCanvasPoint: {
    imagePoint: [1, 0.5],
    canvasPoint: [1, 0.5]
  }
};
const hpMammography = {
  id: '@ohif/hpMammo',
  hasUpdatedPriorsInformation: false,
  name: 'Mammography Breast Screening',
  protocolMatchingRules: [{
    id: 'Mammography',
    weight: 150,
    attribute: 'ModalitiesInStudy',
    constraint: {
      contains: 'MG'
    },
    required: true
  }, {
    id: 'numberOfImages',
    attribute: 'numberOfDisplaySetsWithImages',
    constraint: {
      greaterThan: 2
    },
    required: true
  }],
  toolGroupIds: ['default'],
  displaySetSelectors: {
    RCC: RCC,
    LCC: LCC,
    RMLO: RMLO,
    LMLO: LMLO,
    RCCPrior: RCCPrior,
    LCCPrior: LCCPrior,
    RMLOPrior: RMLOPrior,
    LMLOPrior: LMLOPrior
  },
  stages: [{
    name: 'CC/MLO',
    viewportStructure: {
      type: 'grid',
      layoutType: 'grid',
      properties: {
        rows: 2,
        columns: 2
      }
    },
    viewports: [{
      viewportOptions: {
        toolGroupId: 'default',
        displayArea: leftDisplayArea,
        // flipHorizontal: true,
        // rotation: 180,
        allowUnmatchedView: true
      },
      displaySets: [{
        id: 'RCC'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        // flipHorizontal: true,
        displayArea: rightDisplayArea,
        allowUnmatchedView: true
      },
      displaySets: [{
        id: 'LCC'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        displayArea: leftDisplayArea,
        // rotation: 180,
        // flipHorizontal: true,
        allowUnmatchedView: true
      },
      displaySets: [{
        id: 'RMLO'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        displayArea: rightDisplayArea,
        // flipHorizontal: true,
        allowUnmatchedView: true
      },
      displaySets: [{
        id: 'LMLO'
      }]
    }]
  },
  // Compare CC current/prior top/bottom
  {
    name: 'CC compare',
    viewportStructure: {
      type: 'grid',
      layoutType: 'grid',
      properties: {
        rows: 2,
        columns: 2
      }
    },
    viewports: [{
      viewportOptions: {
        toolGroupId: 'default',
        displayArea: leftDisplayArea,
        flipHorizontal: true,
        rotation: 180
      },
      displaySets: [{
        id: 'RCC'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        flipHorizontal: true,
        displayArea: rightDisplayArea
      },
      displaySets: [{
        id: 'LCC'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        displayArea: leftDisplayArea,
        flipHorizontal: true
      },
      displaySets: [{
        id: 'RCCPrior'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        displayArea: rightDisplayArea
      },
      displaySets: [{
        id: 'LCCPrior'
      }]
    }]
  }],
  // Indicates it is prior aware, but will work with no priors
  numberOfPriorsReferenced: 0
};
/* harmony default export */ const hpMammo = (hpMammography);
;// ../../../extensions/default/src/hangingprotocols/hpScale.ts
const displayAreaScale1 = {
  type: 'SCALE',
  scale: 1,
  storeAsInitialCamera: true
};
const displayAreaScale15 = {
  ...displayAreaScale1,
  scale: 15
};

/**
 * This hanging protocol can be activated on the primary mode by directly
 * referencing it in a URL or by directly including it within a mode, e.g.:
 * `&hangingProtocolId=@ohif/mnGrid` added to the viewer URL
 * It is not included in the viewer mode by default.
 */
const hpScale = {
  id: '@ohif/hpScale',
  description: 'Has various hanging protocol grid layouts',
  name: 'Scale Images',
  protocolMatchingRules: [{
    id: 'OneOrMoreSeries',
    weight: 25,
    attribute: 'numberOfDisplaySetsWithImages',
    constraint: {
      greaterThan: 0
    }
  }],
  toolGroupIds: ['default'],
  displaySetSelectors: {
    defaultDisplaySetId: {
      seriesMatchingRules: [{
        weight: 1,
        attribute: 'numImageFrames',
        constraint: {
          greaterThan: {
            value: 0
          }
        },
        required: true
      },
      // This display set will select the specified items by preference
      // It has no affect if nothing is specified in the URL.
      {
        attribute: 'isDisplaySetFromUrl',
        weight: 20,
        constraint: {
          equals: true
        }
      }]
    }
  },
  defaultViewport: {
    viewportOptions: {
      viewportType: 'stack',
      toolGroupId: 'default',
      displayArea: displayAreaScale1,
      allowUnmatchedView: true
    },
    displaySets: [{
      id: 'defaultDisplaySetId',
      matchedDisplaySetsIndex: -1
    }]
  },
  stages: [
  // A 1x1 stage - should be automatically activated if there is only 1 viewable instance
  {
    name: 'Scale 1:1',
    stageActivation: {
      enabled: {
        minViewportsMatched: 1
      }
    },
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 1,
        columns: 1
      }
    },
    viewports: [{
      viewportOptions: {
        toolGroupId: 'default',
        allowUnmatchedView: true,
        displayArea: displayAreaScale1
      },
      displaySets: [{
        id: 'defaultDisplaySetId'
      }]
    }]
  }, {
    name: 'Scale 1:15',
    stageActivation: {
      enabled: {
        minViewportsMatched: 1
      }
    },
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 1,
        columns: 1
      }
    },
    viewports: [{
      viewportOptions: {
        toolGroupId: 'default',
        allowUnmatchedView: true,
        displayArea: displayAreaScale15
      },
      displaySets: [{
        id: 'defaultDisplaySetId'
      }]
    }]
  }],
  numberOfPriorsReferenced: -1
};
/* harmony default export */ const hangingprotocols_hpScale = (hpScale);
;// ../../../extensions/default/src/getHangingProtocolModule.js




const defaultProtocol = {
  id: 'default',
  locked: true,
  // Don't store this hanging protocol as it applies to the currently active
  // display set by default
  // cacheId: null,
  name: 'Default',
  createdDate: '2021-02-23T19:22:08.894Z',
  modifiedDate: '2023-04-01',
  availableTo: {},
  editableBy: {},
  protocolMatchingRules: [],
  toolGroupIds: ['default'],
  // -1 would be used to indicate active only, whereas other values are
  // the number of required priors referenced - so 0 means active with
  // 0 or more priors.
  numberOfPriorsReferenced: 0,
  // Default viewport is used to define the viewport when
  // additional viewports are added using the layout tool
  defaultViewport: {
    viewportOptions: {
      viewportType: 'stack',
      toolGroupId: 'default',
      allowUnmatchedView: true,
      syncGroups: [{
        type: 'hydrateseg',
        id: 'sameFORId',
        source: true,
        target: true,
        options: {
          matchingRules: ['sameFOR']
        }
      }]
    },
    displaySets: [{
      id: 'defaultDisplaySetId',
      matchedDisplaySetsIndex: -1
    }]
  },
  displaySetSelectors: {
    defaultDisplaySetId: {
      // Matches displaysets, NOT series
      seriesMatchingRules: [
      // Try to match series with images by default, to prevent weird display
      // on SEG/SR containing studies
      {
        weight: 10,
        attribute: 'numImageFrames',
        constraint: {
          greaterThan: {
            value: 0
          }
        }
      },
      // This display set will select the specified items by preference
      // It has no affect if nothing is specified in the URL.
      {
        attribute: 'isDisplaySetFromUrl',
        weight: 20,
        constraint: {
          equals: true
        }
      }]
    }
  },
  stages: [{
    name: 'default',
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 1,
        columns: 1
      }
    },
    viewports: [{
      viewportOptions: {
        viewportType: 'stack',
        viewportId: 'default',
        toolGroupId: 'default',
        // This will specify the initial image options index if it matches in the URL
        // and will otherwise not specify anything.
        initialImageOptions: {
          custom: 'sopInstanceLocation'
        },
        // Other options for initialImageOptions, which can be included in the default
        // custom attribute, or can be provided directly.
        //   index: 180,
        //   preset: 'middle', // 'first', 'last', 'middle'
        // },
        syncGroups: [{
          type: 'hydrateseg',
          id: 'sameFORId',
          source: true,
          target: true
          // options: {
          //   matchingRules: ['sameFOR'],
          // },
        }]
      },
      displaySets: [{
        id: 'defaultDisplaySetId'
      }]
    }],
    createdDate: '2021-02-23T18:32:42.850Z'
  }]
};
function getHangingProtocolModule() {
  return [{
    name: defaultProtocol.id,
    protocol: defaultProtocol
  },
  // Create a MxN comparison hanging protocol available by default
  {
    name: hpCompare.id,
    protocol: hpCompare
  }, {
    name: hpMammo.id,
    protocol: hpMammo
  }, {
    name: hangingprotocols_hpScale.id,
    protocol: hangingprotocols_hpScale
  },
  // Create a MxN hanging protocol available by default
  {
    name: hpMN.id,
    protocol: hpMN
  }, {
    name: hpMN8.id,
    protocol: hpMN8
  }];
}
/* harmony default export */ const src_getHangingProtocolModule = (getHangingProtocolModule);
;// ../../../extensions/default/src/customizations/defaultContextMenuCustomization.ts
/* harmony default export */ const defaultContextMenuCustomization = ({
  measurementsContextMenu: {
    inheritsFrom: 'ohif.contextMenu',
    menus: [
    // Get the items from the UI Customization for the menu name (and have a custom name)
    {
      id: 'forExistingMeasurement',
      selector: ({
        nearbyToolData
      }) => !!nearbyToolData,
      items: [{
        label: 'Delete measurement',
        commands: 'removeMeasurement'
      }, {
        label: 'Add Label',
        commands: 'setMeasurementLabel'
      }]
    }]
  }
});
;// ../../../extensions/default/src/customizations/helloPageCustomization.tsx

/* harmony default export */ const helloPageCustomization = ({
  'routes.customRoutes': {
    routes: {
      $push: [{
        path: '/custom',
        children: () => /*#__PURE__*/react.createElement("h1", {
          style: {
            color: 'white'
          }
        }, "Hello Custom Route")
      }]
    }
  }
});
// EXTERNAL MODULE: ../../ui/src/index.js + 91 modules
var ui_src = __webpack_require__(39078);
;// ../../../extensions/default/src/Panels/DataSourceSelector.tsx





function DataSourceSelector() {
  const [appConfig] = (0,state/* useAppConfig */.r)();
  const navigate = (0,dist/* useNavigate */.Zp)();

  // This is frowned upon, but the raw config is needed here to provide
  // the selector
  const dsConfigs = appConfig.dataSources;
  return /*#__PURE__*/react.createElement("div", {
    style: {
      width: '100%',
      height: '100%'
    }
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex h-screen w-screen items-center justify-center"
  }, /*#__PURE__*/react.createElement("div", {
    className: "bg-secondary-dark mx-auto space-y-2 rounded-lg py-8 px-8 drop-shadow-md"
  }, /*#__PURE__*/react.createElement("img", {
    className: "mx-auto block h-14",
    src: "./ohif-logo.svg",
    alt: "OHIF"
  }), /*#__PURE__*/react.createElement("div", {
    className: "space-y-2 pt-4 text-center"
  }, dsConfigs.filter(it => it.sourceName !== 'dicomjson' && it.sourceName !== 'dicomlocal').map(ds => /*#__PURE__*/react.createElement("div", {
    key: ds.sourceName
  }, /*#__PURE__*/react.createElement("h1", {
    className: "text-white"
  }, ds.configuration?.friendlyName || ds.friendlyName), /*#__PURE__*/react.createElement(ui_src/* Button */.$n, {
    type: ui_src/* ButtonEnums.type */.Ny.NW.primary,
    className: classnames_default()('ml-2'),
    onClick: () => {
      navigate({
        pathname: '/',
        search: `datasources=${ds.sourceName}`
      });
    }
  }, ds.sourceName), /*#__PURE__*/react.createElement("br", null)))))));
}
/* harmony default export */ const Panels_DataSourceSelector = (DataSourceSelector);
;// ../../../extensions/default/src/customizations/datasourcesCustomization.tsx

/* harmony default export */ const datasourcesCustomization = ({
  'routes.customRoutes': {
    routes: {
      $push: [{
        path: '/datasources',
        children: Panels_DataSourceSelector
      }]
    }
  }
});
;// ../../../extensions/default/src/customizations/multimonitorCustomization.ts
/* harmony default export */ const multimonitorCustomization = ({
  'studyBrowser.studyMenuItems': {
    $push: [{
      id: 'applyHangingProtocol',
      label: 'Apply Hanging Protocol',
      iconName: 'ViewportViews',
      items: [{
        id: 'applyDefaultProtocol',
        label: 'Default',
        commands: ['loadStudy', {
          commandName: 'setHangingProtocol',
          commandOptions: {
            protocolId: 'default'
          }
        }]
      }, {
        id: 'applyMPRProtocol',
        label: '2x2 Grid',
        commands: ['loadStudy', {
          commandName: 'setHangingProtocol',
          commandOptions: {
            protocolId: '@ohif/mnGrid'
          }
        }]
      }]
    }, {
      id: 'showInOtherMonitor',
      label: 'Launch On Second Monitor',
      iconName: 'DicomTagBrowser',
      selector: ({
        servicesManager
      }) => {
        const {
          multiMonitorService
        } = servicesManager.services;
        return multiMonitorService.isMultimonitor;
      },
      commands: {
        commandName: 'multimonitor',
        commandOptions: {
          hashParams: '&hangingProtocolId=@ohif/mnGrid8',
          commands: ['loadStudy', {
            commandName: 'setHangingProtocol',
            commandOptions: {
              protocolId: '@ohif/mnGrid8'
            }
          }]
        }
      }
    }]
  }
});
;// ../../../extensions/default/src/customizations/customRoutesCustomization.ts
/* harmony default export */ const customRoutesCustomization = ({
  'routes.customRoutes': {
    routes: [],
    notFoundRoute: null
  }
});
;// ../../../extensions/default/src/customizations/studyBrowserCustomization.ts

const {
  formatDate: studyBrowserCustomization_formatDate
} = src.utils;
/* harmony default export */ const studyBrowserCustomization = ({
  'studyBrowser.studyMenuItems': [],
  'studyBrowser.thumbnailMenuItems': [{
    id: 'tagBrowser',
    label: 'Tag Browser',
    iconName: 'DicomTagBrowser',
    commands: 'openDICOMTagViewer'
  }, {
    id: 'addAsLayer',
    label: 'Add as Layer',
    iconName: 'ViewportViews',
    commands: 'addDisplaySetAsLayer'
  }],
  'studyBrowser.sortFunctions': [{
    label: 'Series Number',
    sortFunction: (a, b) => {
      return a?.SeriesNumber - b?.SeriesNumber;
    }
  }, {
    label: 'Series Date',
    sortFunction: (a, b) => {
      const dateA = new Date(studyBrowserCustomization_formatDate(a?.SeriesDate));
      const dateB = new Date(studyBrowserCustomization_formatDate(b?.SeriesDate));
      return dateB.getTime() - dateA.getTime();
    }
  }],
  'studyBrowser.viewPresets': [{
    id: 'list',
    iconName: 'ListView',
    selected: false
  }, {
    id: 'thumbnails',
    iconName: 'ThumbnailView',
    selected: true
  }],
  'studyBrowser.studyMode': 'all',
  'studyBrowser.thumbnailDoubleClickCallback': {
    callbacks: [({
      activeViewportId,
      servicesManager,
      commandsManager,
      isHangingProtocolLayout
    }) => async displaySetInstanceUID => {
      const {
        hangingProtocolService,
        uiNotificationService
      } = servicesManager.services;
      let updatedViewports = [];
      const viewportId = activeViewportId;
      try {
        updatedViewports = hangingProtocolService.getViewportsRequireUpdate(viewportId, displaySetInstanceUID, isHangingProtocolLayout);
      } catch (error) {
        console.warn(error);
        uiNotificationService.show({
          title: 'Thumbnail Double Click',
          message: 'The selected display sets could not be added to the viewport.',
          type: 'error',
          duration: 3000
        });
      }
      commandsManager.run('setDisplaySetsForViewports', {
        viewportsToUpdate: updatedViewports
      });
    }]
  }
});
;// ../../../extensions/default/src/customizations/overlayItemCustomization.tsx

/* harmony default export */ const overlayItemCustomization = ({
  'ohif.overlayItem': function (props) {
    if (this.condition && !this.condition(props)) {
      return null;
    }
    const {
      instance
    } = props;
    const value = instance && this.attribute ? instance[this.attribute] : this.contentF && typeof this.contentF === 'function' ? this.contentF(props) : null;
    if (!value) {
      return null;
    }
    return /*#__PURE__*/react.createElement("span", {
      className: "overlay-item flex flex-row",
      style: {
        color: this.color || undefined
      },
      title: this.title || ''
    }, this.label && /*#__PURE__*/react.createElement("span", {
      className: "mr-1 shrink-0"
    }, this.label), /*#__PURE__*/react.createElement("span", {
      className: "font-light"
    }, value));
  }
});
;// ../../../extensions/default/src/customizations/contextMenuCustomization.ts
/* harmony default export */ const contextMenuCustomization = ({
  'ohif.contextMenu': {
    $transform: function (customizationService) {
      /**
       * Applies the inheritsFrom to all the menu items.
       * This function clones the object and child objects to prevent
       * changes to the original customization object.
       */
      // Don't modify the children, as those are copied by reference
      const clonedObject = {
        ...this
      };
      clonedObject.menus = this.menus.map(menu => ({
        ...menu
      }));
      for (const menu of clonedObject.menus) {
        const {
          items: originalItems
        } = menu;
        menu.items = [];
        for (const item of originalItems) {
          menu.items.push(customizationService.transform(item));
        }
      }
      return clonedObject;
    }
  }
});
;// ../../../extensions/default/src/customizations/contextMenuUICustomization.ts

/* harmony default export */ const contextMenuUICustomization = ({
  'ui.contextMenu': ui_src/* ContextMenu */.tz
});
;// ../../../extensions/default/src/customizations/menuContentCustomization.tsx


/* harmony default export */ const menuContentCustomization = ({
  'ohif.menuContent': function (props) {
    const {
      item: topLevelItem,
      commandsManager,
      servicesManager,
      ...rest
    } = props;
    const content = function (subProps) {
      const {
        item: subItem
      } = subProps;

      // Regular menu item
      const isDisabled = subItem.selector && !subItem.selector({
        servicesManager
      });
      return /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuItem */._26, {
        disabled: isDisabled,
        onSelect: () => {
          commandsManager.runAsync(subItem.commands, {
            ...subItem.commandOptions,
            ...rest
          });
        },
        className: "gap-[6px]"
      }, subItem.iconName && /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ByName, {
        name: subItem.iconName,
        className: "-ml-1"
      }), subItem.label);
    };

    // If item has sub-items, render a submenu
    if (topLevelItem.items) {
      return /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuSub */.lvB, null, /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuSubTrigger */.nVd, {
        className: "gap-[6px]"
      }, topLevelItem.iconName && /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ByName, {
        name: topLevelItem.iconName,
        className: "-ml-1"
      }), topLevelItem.label), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuPortal */.dce, null, /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuSubContent */.M56, null, topLevelItem.items.map(subItem => content({
        ...props,
        item: subItem
      })))));
    }
    return content({
      ...props,
      item: topLevelItem
    });
  }
});
;// ../../../extensions/default/src/Components/ItemListComponent.tsx






function ItemListComponent({
  itemLabel,
  itemList,
  onItemClicked
}) {
  const {
    servicesManager
  } = (0,src.useSystem)();
  const {
    t
  } = (0,es/* useTranslation */.Bd)('DataSourceConfiguration');
  const [filterValue, setFilterValue] = (0,react.useState)('');
  (0,react.useEffect)(() => {
    setFilterValue('');
  }, [itemList]);
  const LoadingIndicatorProgress = servicesManager.services.customizationService.getCustomization('ui.loadingIndicatorProgress');
  return /*#__PURE__*/react.createElement("div", {
    className: "flex min-h-[1px] grow flex-col gap-4"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/react.createElement("div", {
    className: "text-primary-light text-[20px]"
  }, t(`Select ${itemLabel}`)), /*#__PURE__*/react.createElement(ui_src/* InputFilterText */.Cv, {
    className: "max-w-[40%] grow",
    value: filterValue,
    onDebounceChange: setFilterValue,
    placeholder: t(`Search ${itemLabel} list`)
  })), /*#__PURE__*/react.createElement("div", {
    className: "relative flex min-h-[1px] grow flex-col bg-black text-[14px]"
  }, itemList == null ? /*#__PURE__*/react.createElement(LoadingIndicatorProgress, {
    className: 'h-full w-full'
  }) : itemList.length === 0 ? /*#__PURE__*/react.createElement("div", {
    className: "text-primary-light flex h-full flex-col items-center justify-center px-6 py-4"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ToolMagnify, {
    className: "mb-4"
  }), /*#__PURE__*/react.createElement("span", null, t(`No ${itemLabel} available`))) : /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
    className: "bg-secondary-dark px-3 py-1.5 text-white"
  }, t(itemLabel)), /*#__PURE__*/react.createElement("div", {
    className: "ohif-scrollbar overflow-auto"
  }, itemList.filter(item => !filterValue || item.name.toLowerCase().includes(filterValue.toLowerCase())).map(item => {
    const border = 'rounded border-transparent border-b-secondary-light border-[1px] hover:border-primary-light';
    return /*#__PURE__*/react.createElement("div", {
      className: classnames_default()('hover:text-primary-light hover:bg-primary-dark group mx-2 flex items-center justify-between px-6 py-2', border),
      key: item.id
    }, /*#__PURE__*/react.createElement("div", null, item.name), /*#__PURE__*/react.createElement(ui_src/* Button */.$n, {
      onClick: () => onItemClicked(item),
      className: "invisible group-hover:visible",
      endIcon: /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ByName, {
        name: "arrow-left"
      })
    }, t('Select')));
  })))));
}
/* harmony default export */ const Components_ItemListComponent = (ItemListComponent);
;// ../../../extensions/default/src/Components/DataSourceConfigurationModalComponent.tsx





const NO_WRAP_ELLIPSIS_CLASS_NAMES = 'text-ellipsis whitespace-nowrap overflow-hidden';
function DataSourceConfigurationModalComponent({
  configurationAPI,
  configuredItems,
  onHide
}) {
  const {
    t
  } = (0,es/* useTranslation */.Bd)('DataSourceConfiguration');
  const [itemList, setItemList] = (0,react.useState)();
  const [selectedItems, setSelectedItems] = (0,react.useState)(configuredItems);
  const [errorMessage, setErrorMessage] = (0,react.useState)();
  const [itemLabels] = (0,react.useState)(configurationAPI.getItemLabels());

  // Determines whether to show the full/existing configuration for the data source.
  // A full or complete configuration is one where the data source (path) has the
  // maximum/required number of path items. Anything less is considered not complete and
  // the configuration starts from scratch (i.e. as if no items are configured at all).
  // TODO: consider configuration starting from a partial (i.e. non-empty) configuration
  const [showFullConfig, setShowFullConfig] = (0,react.useState)(itemLabels.length === configuredItems.length);

  /**
   * The index of the selected item that is considered current and for which
   * its sub-items should be displayed in the items list component. When the
   * full/existing configuration for a data source is to be shown, the current
   * selected item is the second to last in the `selectedItems` list.
   */
  const currentSelectedItemIndex = showFullConfig ? selectedItems.length - 2 : selectedItems.length - 1;
  (0,react.useEffect)(() => {
    let shouldUpdate = true;
    setErrorMessage(null);

    // Clear out the former/old list while we fetch the next sub item list.
    setItemList(null);
    if (selectedItems.length === 0) {
      configurationAPI.initialize().then(items => {
        if (shouldUpdate) {
          setItemList(items);
        }
      }).catch(error => setErrorMessage(error.message));
    } else if (!showFullConfig && selectedItems.length === itemLabels.length) {
      // The last item to configure the data source (path) has been selected.
      configurationAPI.setCurrentItem(selectedItems[selectedItems.length - 1]);
      // We can hide the modal dialog now.
      onHide();
    } else {
      configurationAPI.setCurrentItem(selectedItems[currentSelectedItemIndex]).then(items => {
        if (shouldUpdate) {
          setItemList(items);
        }
      }).catch(error => setErrorMessage(error.message));
    }
    return () => {
      shouldUpdate = false;
    };
  }, [selectedItems, configurationAPI, onHide, itemLabels, showFullConfig, currentSelectedItemIndex]);
  const getSelectedItemCursorClasses = itemIndex => itemIndex !== itemLabels.length - 1 && itemIndex < selectedItems.length ? 'cursor-pointer' : 'cursor-auto';
  const getSelectedItemBackgroundClasses = itemIndex => itemIndex < selectedItems.length ? classnames_default()('bg-black/[.4]', itemIndex !== itemLabels.length - 1 ? 'hover:bg-transparent active:bg-secondary-dark' : '') : 'bg-transparent';
  const getSelectedItemBorderClasses = itemIndex => itemIndex === currentSelectedItemIndex + 1 ? classnames_default()('border-2', 'border-solid', 'border-primary-light') : itemIndex < selectedItems.length ? 'border border-solid border-primary-active hover:border-primary-light active:border-white' : 'border border-dashed border-secondary-light';
  const getSelectedItemTextClasses = itemIndex => itemIndex <= selectedItems.length ? 'text-primary-light' : 'text-primary';
  const getErrorComponent = () => {
    return /*#__PURE__*/react.createElement("div", {
      className: "flex min-h-[1px] grow flex-col gap-4"
    }, /*#__PURE__*/react.createElement("div", {
      className: "text-primary-light text-[20px]"
    }, t(`Error fetching ${itemLabels[selectedItems.length]} list`)), /*#__PURE__*/react.createElement("div", {
      className: "grow bg-black p-4 text-[14px]"
    }, errorMessage));
  };
  const getSelectedItemsComponent = () => {
    return /*#__PURE__*/react.createElement("div", {
      className: "flex gap-4"
    }, itemLabels.map((itemLabel, itemLabelIndex) => {
      return /*#__PURE__*/react.createElement("div", {
        key: itemLabel,
        className: classnames_default()('flex min-w-[1px] shrink basis-[200px] flex-col gap-1 rounded-md p-3.5', getSelectedItemCursorClasses(itemLabelIndex), getSelectedItemBackgroundClasses(itemLabelIndex), getSelectedItemBorderClasses(itemLabelIndex), getSelectedItemTextClasses(itemLabelIndex)),
        onClick: showFullConfig && itemLabelIndex < currentSelectedItemIndex || itemLabelIndex <= currentSelectedItemIndex ? () => {
          setShowFullConfig(false);
          setSelectedItems(theList => theList.slice(0, itemLabelIndex));
        } : undefined
      }, /*#__PURE__*/react.createElement("div", {
        className: "text- flex items-center gap-2"
      }, itemLabelIndex < selectedItems.length ? /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ByName, {
        name: "status-tracked"
      }) : /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ByName, {
        name: "status-untracked"
      }), /*#__PURE__*/react.createElement("div", {
        className: classnames_default()(NO_WRAP_ELLIPSIS_CLASS_NAMES)
      }, t(itemLabel))), itemLabelIndex < selectedItems.length ? /*#__PURE__*/react.createElement("div", {
        className: classnames_default()('text-[14px] text-white', NO_WRAP_ELLIPSIS_CLASS_NAMES)
      }, selectedItems[itemLabelIndex].name) : /*#__PURE__*/react.createElement("br", null));
    }));
  };
  return /*#__PURE__*/react.createElement("div", {
    className: "flex h-[calc(100vh-300px)] select-none flex-col gap-4 pt-0.5"
  }, getSelectedItemsComponent(), /*#__PURE__*/react.createElement("div", {
    className: "h-0.5 w-full shrink-0 bg-black"
  }), errorMessage ? getErrorComponent() : /*#__PURE__*/react.createElement(Components_ItemListComponent, {
    itemLabel: itemLabels[currentSelectedItemIndex + 1],
    itemList: itemList,
    onItemClicked: item => {
      setShowFullConfig(false);
      setSelectedItems(theList => [...theList.slice(0, currentSelectedItemIndex + 1), item]);
    }
  }));
}
/* harmony default export */ const Components_DataSourceConfigurationModalComponent = (DataSourceConfigurationModalComponent);
;// ../../../extensions/default/src/Components/DataSourceConfigurationComponent.tsx




function DataSourceConfigurationComponent({
  servicesManager,
  extensionManager
}) {
  const {
    t
  } = (0,es/* useTranslation */.Bd)('DataSourceConfiguration');
  const {
    show,
    hide
  } = (0,ui_next_src/* useModal */.hSE)();
  const {
    customizationService
  } = servicesManager.services;
  const [configurationAPI, setConfigurationAPI] = (0,react.useState)();
  const [configuredItems, setConfiguredItems] = (0,react.useState)();
  (0,react.useEffect)(() => {
    let shouldUpdate = true;
    const dataSourceChangedCallback = async () => {
      const activeDataSourceDef = extensionManager.getActiveDataSourceDefinition();
      if (!activeDataSourceDef?.configuration?.configurationAPI) {
        return;
      }
      const {
        factory: configurationAPIFactory
      } = customizationService.getCustomization(activeDataSourceDef.configuration.configurationAPI) ?? {
        factory: () => null
      };
      if (!configurationAPIFactory) {
        return;
      }
      const configAPI = configurationAPIFactory(activeDataSourceDef.sourceName);
      setConfigurationAPI(configAPI);

      // New configuration API means that the existing configured items must be cleared.
      setConfiguredItems(null);
      configAPI.getConfiguredItems().then(list => {
        if (shouldUpdate) {
          setConfiguredItems(list);
        }
      });
    };
    const sub = extensionManager.subscribe(extensionManager.EVENTS.ACTIVE_DATA_SOURCE_CHANGED, dataSourceChangedCallback);
    dataSourceChangedCallback();
    return () => {
      shouldUpdate = false;
      sub.unsubscribe();
    };
  }, []);
  const showConfigurationModal = (0,react.useCallback)(() => {
    show({
      content: Components_DataSourceConfigurationModalComponent,
      title: t('Configure Data Source'),
      contentProps: {
        configurationAPI,
        configuredItems,
        onHide: hide
      }
    });
  }, [configurationAPI, configuredItems]);
  (0,react.useEffect)(() => {
    if (!configurationAPI || !configuredItems) {
      return;
    }
    if (configuredItems.length !== configurationAPI.getItemLabels().length) {
      // Not the correct number of configured items, so show the modal to configure the data source.
      showConfigurationModal();
    }
  }, [configurationAPI, configuredItems, showConfigurationModal]);
  return configuredItems ? /*#__PURE__*/react.createElement("div", {
    className: "text-aqua-pale flex items-center overflow-hidden"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Settings, {
    className: "mr-2.5 h-3.5 w-3.5 shrink-0 cursor-pointer",
    onClick: showConfigurationModal
  }), configuredItems.map((item, itemIndex) => {
    return /*#__PURE__*/react.createElement("div", {
      key: itemIndex,
      className: "flex overflow-hidden"
    }, /*#__PURE__*/react.createElement("div", {
      key: itemIndex,
      className: "overflow-hidden text-ellipsis whitespace-nowrap"
    }, item.name), itemIndex !== configuredItems.length - 1 && /*#__PURE__*/react.createElement("div", {
      className: "px-2.5"
    }, "|"));
  })) : /*#__PURE__*/react.createElement(react.Fragment, null);
}
/* harmony default export */ const Components_DataSourceConfigurationComponent = (DataSourceConfigurationComponent);
;// ../../../extensions/default/src/DataSourceConfigurationAPI/GoogleCloudDataSourceConfigurationAPI.ts
/**
 * This file contains the implementations of BaseDataSourceConfigurationAPIItem
 * and BaseDataSourceConfigurationAPI for the Google cloud healthcare API. To
 * better understand this implementation and/or to implement custom implementations,
 * see the platform\core\src\types\DataSourceConfigurationAPI.ts and its JS doc
 * comments as a guide.
 */
/**
 * The various Google Cloud Healthcare path item types.
 */
var ItemType = /*#__PURE__*/function (ItemType) {
  ItemType[ItemType["projects"] = 0] = "projects";
  ItemType[ItemType["locations"] = 1] = "locations";
  ItemType[ItemType["datasets"] = 2] = "datasets";
  ItemType[ItemType["dicomStores"] = 3] = "dicomStores";
  return ItemType;
}(ItemType || {});
const initialUrl = 'https://cloudresourcemanager.googleapis.com/v1';
const baseHealthcareUrl = 'https://healthcare.googleapis.com/v1';
class GoogleCloudDataSourceConfigurationAPIItem {
  constructor() {
    this.id = void 0;
    this.name = void 0;
    this.url = void 0;
    this.itemType = void 0;
  }
}
class GoogleCloudDataSourceConfigurationAPI {
  constructor(dataSourceName, servicesManager, extensionManager) {
    this._extensionManager = void 0;
    this._fetchOptions = void 0;
    this._dataSourceName = void 0;
    this.getItemLabels = () => ['Project', 'Location', 'Data set', 'DICOM store'];
    this._dataSourceName = dataSourceName;
    this._extensionManager = extensionManager;
    const userAuthenticationService = servicesManager.services.userAuthenticationService;
    this._fetchOptions = {
      method: 'GET',
      headers: userAuthenticationService.getAuthorizationHeader()
    };
  }
  async initialize() {
    const url = `${initialUrl}/projects`;
    const projects = await GoogleCloudDataSourceConfigurationAPI._doFetch(url, ItemType.projects, this._fetchOptions);
    if (!projects?.length) {
      return [];
    }
    const projectItems = projects.map(project => {
      return {
        id: project.projectId,
        name: project.name,
        itemType: ItemType.projects,
        url: `${baseHealthcareUrl}/projects/${project.projectId}`
      };
    });
    return projectItems;
  }
  async setCurrentItem(anItem) {
    const googleCloudItem = anItem;
    if (googleCloudItem.itemType === ItemType.dicomStores) {
      // Last configurable item, so update the data source configuration.
      const url = `${googleCloudItem.url}/dicomWeb`;
      const dataSourceDefCopy = JSON.parse(JSON.stringify(this._extensionManager.getDataSourceDefinition(this._dataSourceName)));
      dataSourceDefCopy.configuration = {
        ...dataSourceDefCopy.configuration,
        wadoUriRoot: url,
        qidoRoot: url,
        wadoRoot: url
      };
      this._extensionManager.updateDataSourceConfiguration(dataSourceDefCopy.sourceName, dataSourceDefCopy.configuration);
      return [];
    }
    const subItemType = googleCloudItem.itemType + 1;
    const subItemField = `${ItemType[subItemType]}`;
    const url = `${googleCloudItem.url}/${subItemField}`;
    const fetchedSubItems = await GoogleCloudDataSourceConfigurationAPI._doFetch(url, subItemType, this._fetchOptions);
    if (!fetchedSubItems?.length) {
      return [];
    }
    const subItems = fetchedSubItems.map(subItem => {
      const nameSplit = subItem.name.split('/');
      return {
        id: subItem.name,
        name: nameSplit[nameSplit.length - 1],
        itemType: subItemType,
        url: `${baseHealthcareUrl}/${subItem.name}`
      };
    });
    return subItems;
  }
  async getConfiguredItems() {
    const dataSourceDefinition = this._extensionManager.getDataSourceDefinition(this._dataSourceName);
    const url = dataSourceDefinition.configuration.wadoUriRoot;
    const projectsIndex = url.indexOf('projects');
    // Split the configured URL into (essentially) pairs (i.e. item type followed by item)
    // Explicitly: ['projects','aProject','locations','aLocation','datasets','aDataSet','dicomStores','aDicomStore']
    // Note that a partial configuration will have a subset of the above.
    const urlSplit = url.substring(projectsIndex).split('/');
    const configuredItems = [];
    for (let itemType = 0;
    // the number of configured items is either the max (4) or the number extracted from the url split
    itemType < 4 && (itemType + 1) * 2 < urlSplit.length; itemType += 1) {
      if (itemType === ItemType.projects) {
        const projectId = urlSplit[1];
        const projectUrl = `${initialUrl}/projects/${projectId}`;
        const data = await GoogleCloudDataSourceConfigurationAPI._doFetch(projectUrl, ItemType.projects, this._fetchOptions);
        const project = data[0];
        configuredItems.push({
          id: project.projectId,
          name: project.name,
          itemType: itemType,
          url: `${baseHealthcareUrl}/projects/${project.projectId}`
        });
      } else {
        const relativePath = urlSplit.slice(0, itemType * 2 + 2).join('/');
        configuredItems.push({
          id: relativePath,
          name: urlSplit[itemType * 2 + 1],
          itemType: itemType,
          url: `${baseHealthcareUrl}/${relativePath}`
        });
      }
    }
    return configuredItems;
  }

  /**
   * Fetches an array of items the specified item type.
   * @param urlStr the fetch url
   * @param fetchItemType the type to fetch
   * @param fetchOptions the header options for the fetch (e.g. authorization header)
   * @param fetchSearchParams any search query params; currently only used for paging results
   * @returns an array of items of the specified type
   */
  static async _doFetch(urlStr, fetchItemType, fetchOptions = {}, fetchSearchParams = {}) {
    try {
      const url = new URL(urlStr);
      url.search = new URLSearchParams(fetchSearchParams).toString();
      const response = await fetch(url, fetchOptions);
      const data = await response.json();
      if (response.status >= 200 && response.status < 300 && data != null) {
        if (data.nextPageToken != null) {
          fetchSearchParams.pageToken = data.nextPageToken;
          const subPageData = await this._doFetch(urlStr, fetchItemType, fetchOptions, fetchSearchParams);
          data[ItemType[fetchItemType]] = data[ItemType[fetchItemType]].concat(subPageData);
        }
        if (data[ItemType[fetchItemType]]) {
          return data[ItemType[fetchItemType]];
        } else if (data.name) {
          return [data];
        } else {
          return [];
        }
      } else {
        const message = data?.error?.message || `Error returned from Google Cloud Healthcare: ${response.status} - ${response.statusText}`;
        throw new Error(message);
      }
    } catch (err) {
      const message = err?.message || 'Error occurred during fetch request.';
      throw new Error(message);
    }
  }
}

;// ../../../extensions/default/src/customizations/dataSourceConfigurationCustomization.ts


function getDataSourceConfigurationCustomization({
  servicesManager,
  extensionManager
}) {
  return {
    // the generic GUI component to configure a data source using an instance of a BaseDataSourceConfigurationAPI
    'ohif.dataSourceConfigurationComponent': Components_DataSourceConfigurationComponent.bind(null, {
      servicesManager,
      extensionManager
    }),
    // The factory for creating an instance of a BaseDataSourceConfigurationAPI for Google Cloud Healthcare
    'ohif.dataSourceConfigurationAPI.google': dataSourceName => new GoogleCloudDataSourceConfigurationAPI(dataSourceName, servicesManager, extensionManager)
  };
}
;// ../../../extensions/default/src/customizations/progressDropdownCustomization.ts

/* harmony default export */ const progressDropdownCustomization = ({
  progressDropdownWithServiceComponent: ProgressDropdownWithService
});
;// ../../../extensions/default/src/customizations/sortingCriteriaCustomization.ts

const {
  sortingCriteria
} = src.utils;
/* harmony default export */ const sortingCriteriaCustomization = ({
  sortingCriteria: sortingCriteria.seriesSortCriteria.seriesInfoSortingCriteria
});
;// ../../../extensions/default/src/customizations/onDropHandlerCustomization.ts
/* harmony default export */ const onDropHandlerCustomization = ({
  customOnDropHandler: () => {
    return Promise.resolve({
      handled: false
    });
  }
});
;// ../../../extensions/default/src/customizations/loadingIndicatorProgressCustomization.tsx

/* harmony default export */ const loadingIndicatorProgressCustomization = ({
  'ui.loadingIndicatorProgress': ui_next_src/* LoadingIndicatorProgress */.JxG
});
;// ../../../extensions/default/src/customizations/loadingIndicatorTotalPercentCustomization.tsx

/* harmony default export */ const loadingIndicatorTotalPercentCustomization = ({
  'ui.loadingIndicatorTotalPercent': ui_next_src/* LoadingIndicatorTotalPercent */.pTz
});
;// ../../../extensions/default/src/customizations/progressLoadingBarCustomization.tsx

/* harmony default export */ const progressLoadingBarCustomization = ({
  'ui.progressLoadingBar': ui_next_src/* ProgressLoadingBar */.dDv
});
;// ../../../extensions/default/src/customizations/labellingFlowCustomization.tsx

/* harmony default export */ const labellingFlowCustomization = ({
  'ui.labellingComponent': ui_next_src/* LabellingFlow */.ndl
});
;// ../../../extensions/default/src/customizations/notificationCustomization.ts


const beginTrackingMessage = i18n_src/* default */.A.t('MeasurementTable:Track measurements for this series?');
const trackNewSeriesMessage = i18n_src/* default */.A.t('Do you want to add this measurement to the existing report?');
const discardSeriesMessage = i18n_src/* default */.A.t('You have existing tracked measurements. What would you like to do with your existing tracked measurements?');
const trackNewStudyMessage = i18n_src/* default */.A.t('MeasurementTable:Track measurements for this series?');
const discardStudyMessage = i18n_src/* default */.A.t('Measurements cannot span across multiple studies. Do you want to save your tracked measurements?');
const hydrateSRMessage = i18n_src/* default */.A.t('Do you want to continue tracking measurements for this study?');
const hydrateRTMessage = i18n_src/* default */.A.t('Do you want to open this Segmentation?');
const hydrateSEGMessage = i18n_src/* default */.A.t('Do you want to open this Segmentation?');
const discardDirtyMessage = i18n_src/* default */.A.t('There are unsaved measurements. Do you want to save it?');
/* harmony default export */ const notificationCustomization = ({
  'ui.notificationComponent': ui_next_src/* ViewportDialog */.Tqg,
  'viewportNotification.beginTrackingMessage': beginTrackingMessage,
  'viewportNotification.trackNewSeriesMessage': trackNewSeriesMessage,
  'viewportNotification.discardSeriesMessage': discardSeriesMessage,
  'viewportNotification.trackNewStudyMessage': trackNewStudyMessage,
  'viewportNotification.discardStudyMessage': discardStudyMessage,
  'viewportNotification.hydrateSRMessage': hydrateSRMessage,
  'viewportNotification.hydrateRTMessage': hydrateRTMessage,
  'viewportNotification.hydrateSEGMessage': hydrateSEGMessage,
  'viewportNotification.discardDirtyMessage': discardDirtyMessage
});
// EXTERNAL MODULE: ../../../node_modules/browser-detect/dist/browser-detect.es5.js
var browser_detect_es5 = __webpack_require__(88123);
;// ../../../extensions/default/src/customizations/aboutModalCustomization.tsx



function AboutModalDefault() {
  const {
    os,
    version,
    name
  } = (0,browser_detect_es5/* default */.A)();
  const browser = `${name[0].toUpperCase()}${name.substr(1)} ${version}`;
  const versionNumber = "3.11.1";
  const commitHash = "93dabb380574e96fc9d2495978f1ee75acaa6f02";
  const [main, beta] = versionNumber.split('-');
  return /*#__PURE__*/react.createElement(ui_next_src/* AboutModal */.VTU, {
    className: "w-[400px]"
  }, /*#__PURE__*/react.createElement(ui_next_src/* AboutModal */.VTU.ProductName, null, "OHIF Viewer"), /*#__PURE__*/react.createElement(ui_next_src/* AboutModal */.VTU.ProductVersion, null, main), beta && /*#__PURE__*/react.createElement(ui_next_src/* AboutModal */.VTU.ProductBeta, null, beta), /*#__PURE__*/react.createElement(ui_next_src/* AboutModal */.VTU.Body, null, /*#__PURE__*/react.createElement(ui_next_src/* AboutModal */.VTU.DetailItem, {
    label: "Commit Hash",
    value: commitHash
  }), /*#__PURE__*/react.createElement(ui_next_src/* AboutModal */.VTU.DetailItem, {
    label: "Current Browser & OS",
    value: `${browser}, ${os}`
  }), /*#__PURE__*/react.createElement(ui_next_src/* AboutModal */.VTU.SocialItem, {
    icon: "SocialGithub",
    url: "OHIF/Viewers",
    text: "github.com/OHIF/Viewers"
  })));
}
/* harmony default export */ const aboutModalCustomization = ({
  'ohif.aboutModal': AboutModalDefault
});
;// ../../../extensions/default/src/customizations/userPreferencesCustomization.tsx






const {
  availableLanguages,
  defaultLanguage,
  currentLanguage: currentLanguageFn
} = i18n_src/* default */.A;
function UserPreferencesModalDefault({
  hide
}) {
  const {
    hotkeysManager
  } = (0,src.useSystem)();
  const {
    t
  } = (0,es/* useTranslation */.Bd)('UserPreferencesModal');
  const {
    hotkeyDefinitions = {},
    hotkeyDefaults = {}
  } = hotkeysManager;
  const currentLanguage = currentLanguageFn();
  const [state, setState] = (0,react.useState)({
    hotkeyDefinitions: hotkeyDefinitions,
    languageValue: currentLanguage.value
  });
  const onLanguageChangeHandler = value => {
    setState(state => ({
      ...state,
      languageValue: value
    }));
  };
  const onHotkeyChangeHandler = (id, newKeys) => {
    setState(state => ({
      ...state,
      hotkeyDefinitions: {
        ...state.hotkeyDefinitions,
        [id]: {
          ...state.hotkeyDefinitions[id],
          keys: newKeys
        }
      }
    }));
  };
  const onResetHandler = () => {
    setState(state => ({
      ...state,
      languageValue: defaultLanguage.value,
      hotkeyDefinitions: hotkeyDefaults
    }));
    hotkeysManager.restoreDefaultBindings();
  };
  return /*#__PURE__*/react.createElement(ui_next_src/* UserPreferencesModal */.xMy, null, /*#__PURE__*/react.createElement(ui_next_src/* UserPreferencesModal */.xMy.Body, null, /*#__PURE__*/react.createElement("div", {
    className: "mb-3 flex items-center space-x-14"
  }, /*#__PURE__*/react.createElement(ui_next_src/* UserPreferencesModal */.xMy.SubHeading, null, t('Language')), /*#__PURE__*/react.createElement(ui_next_src/* Select */.l6P, {
    defaultValue: state.languageValue,
    onValueChange: onLanguageChangeHandler
  }, /*#__PURE__*/react.createElement(ui_next_src/* SelectTrigger */.bqE, {
    className: "w-60",
    "aria-label": "Language"
  }, /*#__PURE__*/react.createElement(ui_next_src/* SelectValue */.yvm, {
    placeholder: t('Select language')
  })), /*#__PURE__*/react.createElement(ui_next_src/* SelectContent */.gCo, null, availableLanguages.map(lang => /*#__PURE__*/react.createElement(ui_next_src/* SelectItem */.ebT, {
    key: lang.value,
    value: lang.value
  }, lang.label))))), /*#__PURE__*/react.createElement(ui_next_src/* UserPreferencesModal */.xMy.SubHeading, null, t('Hotkeys')), /*#__PURE__*/react.createElement(ui_next_src/* UserPreferencesModal */.xMy.HotkeysGrid, null, Object.entries(state.hotkeyDefinitions).map(([id, definition]) => /*#__PURE__*/react.createElement(ui_next_src/* UserPreferencesModal */.xMy.Hotkey, {
    key: id,
    label: t(definition.label),
    value: definition.keys,
    onChange: newKeys => onHotkeyChangeHandler(id, newKeys),
    placeholder: definition.keys,
    hotkeys: src.hotkeys
  })))), /*#__PURE__*/react.createElement(ui_next_src/* FooterAction */.esu, null, /*#__PURE__*/react.createElement(ui_next_src/* FooterAction */.esu.Left, null, /*#__PURE__*/react.createElement(ui_next_src/* FooterAction */.esu.Auxiliary, {
    onClick: onResetHandler
  }, t('Reset to defaults'))), /*#__PURE__*/react.createElement(ui_next_src/* FooterAction */.esu.Right, null, /*#__PURE__*/react.createElement(ui_next_src/* FooterAction */.esu.Secondary, {
    onClick: () => {
      src.hotkeys.stopRecord();
      src.hotkeys.unpause();
      hide();
    }
  }, t('Cancel')), /*#__PURE__*/react.createElement(ui_next_src/* FooterAction */.esu.Primary, {
    onClick: () => {
      if (state.languageValue !== currentLanguage.value) {
        i18n_src/* default */.A.changeLanguage(state.languageValue);
      }
      hotkeysManager.setHotkeys(state.hotkeyDefinitions);
      src.hotkeys.stopRecord();
      src.hotkeys.unpause();
      hide();
    }
  }, t('Save')))));
}
/* harmony default export */ const userPreferencesCustomization = ({
  'ohif.userPreferencesModal': UserPreferencesModalDefault
});
;// ../../../extensions/default/src/customizations/reportDialogCustomization.tsx




function ReportDialog({
  dataSources,
  hide,
  onSave,
  onCancel
}) {
  const {
    servicesManager
  } = (0,src.useSystem)();
  const [selectedDataSource, setSelectedDataSource] = (0,react.useState)(dataSources?.[0]?.value ?? null);
  const [selectedSeries, setSelectedSeries] = (0,react.useState)(null);
  const [reportName, setReportName] = (0,react.useState)('');
  const {
    displaySetService
  } = servicesManager.services;
  const seriesOptions = (0,react.useMemo)(() => {
    const displaySetsMap = displaySetService.getDisplaySetCache();
    const displaySets = Array.from(displaySetsMap.values());
    const options = displaySets.filter(ds => ds.Modality === 'SR').map(ds => ({
      value: ds.SeriesInstanceUID,
      description: ds.SeriesDescription,
      label: `${ds.SeriesDescription} ${ds.SeriesDate}/${ds.SeriesTime} ${ds.SeriesNumber}`
    }));
    return [{
      value: null,
      description: null,
      label: 'Create new series'
    }, ...options];
  }, [displaySetService]);
  (0,react.useEffect)(() => {
    const seriesOption = seriesOptions.find(s => s.value === selectedSeries);
    const newReportName = selectedSeries && seriesOption?.description ? seriesOption.description : '';
    setReportName(newReportName);
  }, [selectedSeries, seriesOptions]);
  const handleSave = (0,react.useCallback)(() => {
    onSave({
      reportName,
      dataSource: selectedDataSource,
      series: selectedSeries
    });
    hide();
  }, [selectedDataSource, selectedSeries, reportName, hide, onSave]);
  const handleCancel = (0,react.useCallback)(() => {
    onCancel();
    hide();
  }, [onCancel, hide]);
  const showDataSourceSelect = dataSources?.length > 1;
  return /*#__PURE__*/react.createElement("div", {
    className: "text-foreground flex min-w-[400px] max-w-md flex-col"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex flex-col gap-4"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex gap-4"
  }, showDataSourceSelect && /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
    className: "mt-1 w-1/2"
  }, /*#__PURE__*/react.createElement("div", {
    className: "mb-1 pl-1 text-base"
  }, "Data source"), /*#__PURE__*/react.createElement(ui_next_src/* Select */.l6P, {
    value: selectedDataSource,
    onValueChange: setSelectedDataSource
  }, /*#__PURE__*/react.createElement(ui_next_src/* SelectTrigger */.bqE, null, /*#__PURE__*/react.createElement(ui_next_src/* SelectValue */.yvm, {
    placeholder: "Select a data source"
  })), /*#__PURE__*/react.createElement(ui_next_src/* SelectContent */.gCo, null, dataSources.map(source => /*#__PURE__*/react.createElement(ui_next_src/* SelectItem */.ebT, {
    key: source.value,
    value: source.value
  }, source.label))))), /*#__PURE__*/react.createElement("div", {
    className: showDataSourceSelect ? 'mt-1 w-1/2' : 'mt-1 w-full'
  }, /*#__PURE__*/react.createElement("div", {
    className: "mb-1 pl-1 text-base"
  }, "Series"), /*#__PURE__*/react.createElement(ui_next_src/* Select */.l6P, {
    value: selectedSeries,
    onValueChange: setSelectedSeries
  }, /*#__PURE__*/react.createElement(ui_next_src/* SelectTrigger */.bqE, null, /*#__PURE__*/react.createElement(ui_next_src/* SelectValue */.yvm, {
    placeholder: "Select a series"
  })), /*#__PURE__*/react.createElement(ui_next_src/* SelectContent */.gCo, null, seriesOptions.map(series => /*#__PURE__*/react.createElement(ui_next_src/* SelectItem */.ebT, {
    key: series.value,
    value: series.value
  }, series.label))))))), /*#__PURE__*/react.createElement("div", {
    className: "flex items-end gap-4"
  }, !showDataSourceSelect && /*#__PURE__*/react.createElement("div", {
    className: "w-1/3"
  }, /*#__PURE__*/react.createElement("div", {
    className: "mb-1 pl-1 text-base"
  }, "Series"), /*#__PURE__*/react.createElement(ui_next_src/* Select */.l6P, {
    value: selectedSeries,
    onValueChange: setSelectedSeries
  }, /*#__PURE__*/react.createElement(ui_next_src/* SelectTrigger */.bqE, null, /*#__PURE__*/react.createElement(ui_next_src/* SelectValue */.yvm, {
    placeholder: "Select a series"
  })), /*#__PURE__*/react.createElement(ui_next_src/* SelectContent */.gCo, null, seriesOptions.map(series => /*#__PURE__*/react.createElement(ui_next_src/* SelectItem */.ebT, {
    key: series.value,
    value: series.value
  }, series.label))))), /*#__PURE__*/react.createElement(ui_next_src/* InputDialog */.fa0, {
    value: reportName,
    onChange: setReportName,
    submitOnEnter: true,
    className: "flex-1"
  }, /*#__PURE__*/react.createElement(ui_next_src/* InputDialog */.fa0.Field, {
    className: "mb-0"
  }, /*#__PURE__*/react.createElement(ui_next_src/* InputDialog */.fa0.Input, {
    placeholder: "Report name",
    disabled: !!selectedSeries
  })))), /*#__PURE__*/react.createElement("div", {
    className: "flex justify-end gap-2"
  }, /*#__PURE__*/react.createElement(ui_next_src/* InputDialog */.fa0, null, /*#__PURE__*/react.createElement(ui_next_src/* InputDialog */.fa0.Actions, null, /*#__PURE__*/react.createElement(ui_next_src/* InputDialog */.fa0.ActionsSecondary, {
    onClick: handleCancel
  }, "Cancel"), /*#__PURE__*/react.createElement(ui_next_src/* InputDialog */.fa0.ActionsPrimary, {
    onClick: handleSave
  }, "Save"))))));
}

/* harmony default export */ const reportDialogCustomization = ({
  'ohif.createReportDialog': ReportDialog
});
;// ../../../extensions/default/src/customizations/hotkeyBindingsCustomization.ts

/* harmony default export */ const hotkeyBindingsCustomization = ({
  'ohif.hotkeyBindings': src.defaults.hotkeyBindings
});
;// ../../../extensions/default/src/customizations/onboardingCustomization.ts
function waitForElement(selector, maxAttempts = 20, interval = 25) {
  return new Promise(resolve => {
    let attempts = 0;
    const checkForElement = setInterval(() => {
      const element = document.querySelector(selector);
      if (element || attempts >= maxAttempts) {
        clearInterval(checkForElement);
        resolve();
      }
      attempts++;
    }, interval);
  });
}
/* harmony default export */ const onboardingCustomization = ({
  'ohif.tours': [{
    id: 'basicViewerTour',
    route: '/viewer',
    steps: [{
      id: 'scroll',
      title: 'Scrolling Through Images',
      text: 'You can scroll through the images using the mouse wheel or scrollbar.',
      attachTo: {
        element: '.viewport-element',
        on: 'top'
      },
      advanceOn: {
        selector: '.cornerstone-viewport-element',
        event: 'CORNERSTONE_TOOLS_MOUSE_WHEEL'
      },
      beforeShowPromise: () => waitForElement('.viewport-element')
    }, {
      id: 'zoom',
      title: 'Zooming In and Out',
      text: 'You can zoom the images using the right click.',
      attachTo: {
        element: '.viewport-element',
        on: 'left'
      },
      advanceOn: {
        selector: '.cornerstone-viewport-element',
        event: 'CORNERSTONE_TOOLS_MOUSE_UP'
      },
      beforeShowPromise: () => waitForElement('.viewport-element')
    }, {
      id: 'pan',
      title: 'Panning the Image',
      text: 'You can pan the images using the middle click.',
      attachTo: {
        element: '.viewport-element',
        on: 'top'
      },
      advanceOn: {
        selector: '.cornerstone-viewport-element',
        event: 'CORNERSTONE_TOOLS_MOUSE_UP'
      },
      beforeShowPromise: () => waitForElement('.viewport-element')
    }, {
      id: 'windowing',
      title: 'Adjusting Window Level',
      text: 'You can modify the window level using the left click.',
      attachTo: {
        element: '.viewport-element',
        on: 'left'
      },
      advanceOn: {
        selector: '.cornerstone-viewport-element',
        event: 'CORNERSTONE_TOOLS_MOUSE_UP'
      },
      beforeShowPromise: () => waitForElement('.viewport-element')
    }, {
      id: 'length',
      title: 'Using the Measurement Tools',
      text: 'You can measure the length of a region using the Length tool.',
      attachTo: {
        element: '[data-cy="MeasurementTools-split-button-primary"]',
        on: 'bottom'
      },
      advanceOn: {
        selector: '[data-cy="MeasurementTools-split-button-primary"]',
        event: 'click'
      },
      beforeShowPromise: () => waitForElement('[data-cy="MeasurementTools-split-button-primary]')
    }, {
      id: 'drawAnnotation',
      title: 'Drawing Length Annotations',
      text: 'Use the length tool on the viewport to measure the length of a region.',
      attachTo: {
        element: '.viewport-element',
        on: 'right'
      },
      advanceOn: {
        selector: 'body',
        event: 'event::measurement_added'
      },
      beforeShowPromise: () => waitForElement('.viewport-element')
    }, {
      id: 'trackMeasurement',
      title: 'Tracking Measurements in the Panel',
      text: 'Click yes to track the measurements in the measurement panel.',
      attachTo: {
        element: '[data-cy="prompt-begin-tracking-yes-btn"]',
        on: 'bottom'
      },
      advanceOn: {
        selector: '[data-cy="prompt-begin-tracking-yes-btn"]',
        event: 'click'
      },
      beforeShowPromise: () => waitForElement('[data-cy="prompt-begin-tracking-yes-btn"]')
    }, {
      id: 'openMeasurementPanel',
      title: 'Opening the Measurements Panel',
      text: 'Click the measurements button to open the measurements panel.',
      attachTo: {
        element: '#trackedMeasurements-btn',
        on: 'left-start'
      },
      advanceOn: {
        selector: '#trackedMeasurements-btn',
        event: 'click'
      },
      beforeShowPromise: () => waitForElement('#trackedMeasurements-btn')
    }, {
      id: 'scrollAwayFromMeasurement',
      title: 'Scrolling Away from a Measurement',
      text: 'Scroll the images using the mouse wheel away from the measurement.',
      attachTo: {
        element: '.viewport-element',
        on: 'left'
      },
      advanceOn: {
        selector: '.cornerstone-viewport-element',
        event: 'CORNERSTONE_TOOLS_MOUSE_WHEEL'
      },
      beforeShowPromise: () => waitForElement('.viewport-element')
    }, {
      id: 'jumpToMeasurement',
      title: 'Jumping to Measurements in the Panel',
      text: 'Click the measurement in the measurement panel to jump to it.',
      attachTo: {
        element: '[data-cy="data-row"]',
        on: 'left-start'
      },
      advanceOn: {
        selector: '[data-cy="data-row"]',
        event: 'click'
      },
      beforeShowPromise: () => waitForElement('[data-cy="data-row"]')
    }, {
      id: 'changeLayout',
      title: 'Changing Layout',
      text: 'You can change the layout of the viewer using the layout button.',
      attachTo: {
        element: '[data-cy="Layout"]',
        on: 'bottom'
      },
      advanceOn: {
        selector: '[data-cy="Layout"]',
        event: 'click'
      },
      beforeShowPromise: () => waitForElement('[data-cy="Layout"]')
    }, {
      id: 'selectLayout',
      title: 'Selecting the MPR Layout',
      text: 'Select the MPR layout to view the images in MPR mode.',
      attachTo: {
        element: '[data-cy="MPR"]',
        on: 'left-start'
      },
      advanceOn: {
        selector: '[data-cy="MPR"]',
        event: 'click'
      },
      beforeShowPromise: () => waitForElement('[data-cy="MPR"]')
    }],
    tourOptions: {
      useModalOverlay: true,
      defaultStepOptions: {
        buttons: [{
          text: 'Skip all',
          action() {
            this.complete();
          },
          secondary: true
        }]
      }
    }
  }]
});
;// ../../../extensions/default/src/customizations/instanceSortingCriteriaCustomization.ts
/* harmony default export */ const instanceSortingCriteriaCustomization = ({
  instanceSortingCriteria: {
    sortFunctions: {},
    defaultSortFunctionName: ''
  }
});
;// ../../../extensions/default/src/getCustomizationModule.tsx

























/**
 *
 * Note: this is an example of how the customization module can be used
 * using the customization module. Below, we are adding a new custom route
 * to the application at the path /custom and rendering a custom component
 * Real world use cases of the having a custom route would be to add a
 * custom page for the user to view their profile, or to add a custom
 * page for login etc.
 */
function getCustomizationModule({
  servicesManager,
  extensionManager
}) {
  return [{
    name: 'helloPage',
    value: helloPageCustomization
  }, {
    name: 'datasources',
    value: datasourcesCustomization
  }, {
    name: 'multimonitor',
    value: multimonitorCustomization
  }, {
    name: 'default',
    value: {
      ...customRoutesCustomization,
      ...studyBrowserCustomization,
      ...overlayItemCustomization,
      ...contextMenuCustomization,
      ...menuContentCustomization,
      ...getDataSourceConfigurationCustomization({
        servicesManager,
        extensionManager
      }),
      ...progressDropdownCustomization,
      ...sortingCriteriaCustomization,
      ...defaultContextMenuCustomization,
      ...onDropHandlerCustomization,
      ...loadingIndicatorProgressCustomization,
      ...loadingIndicatorTotalPercentCustomization,
      ...progressLoadingBarCustomization,
      ...labellingFlowCustomization,
      ...contextMenuUICustomization,
      ...notificationCustomization,
      ...aboutModalCustomization,
      ...userPreferencesCustomization,
      ...reportDialogCustomization,
      ...hotkeyBindingsCustomization,
      ...onboardingCustomization,
      ...instanceSortingCriteriaCustomization
    }
  }];
}
;// ../../../extensions/default/src/Components/LineChartViewport/LineChartViewport.tsx


const LineChartViewport = ({
  displaySets
}) => {
  const displaySet = displaySets[0];
  const {
    axis: chartAxis,
    series: chartSeries
  } = displaySet.instance.chartData;
  return /*#__PURE__*/react.createElement(ui_next_src/* LineChart */.bl6, {
    showLegend: true,
    legendWidth: 150,
    axis: {
      x: {
        label: chartAxis.x.label,
        indexRef: 0,
        type: 'x',
        range: {
          min: 0
        }
      },
      y: {
        label: chartAxis.y.label,
        indexRef: 1,
        type: 'y'
      }
    },
    series: chartSeries
  });
};

;// ../../../extensions/default/src/Components/LineChartViewport/index.ts

;// ../../../extensions/default/src/getViewportModule.tsx

const getViewportModule = () => {
  return [{
    name: 'chartViewport',
    component: LineChartViewport
  }];
};

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/calculate-suv/dist/calculate-suv.esm.js
var calculate_suv_esm = __webpack_require__(48405);
;// ../../../extensions/default/src/getPTImageIdInstanceMetadata.ts

const getPTImageIdInstanceMetadata_metadataProvider = src["default"].classes.MetadataProvider;
function getPTImageIdInstanceMetadata(imageId) {
  const dicomMetaData = getPTImageIdInstanceMetadata_metadataProvider.get('instance', imageId);
  if (!dicomMetaData) {
    throw new Error('dicom metadata are required');
  }
  if (dicomMetaData.SeriesDate === undefined || dicomMetaData.SeriesTime === undefined || dicomMetaData.CorrectedImage === undefined || dicomMetaData.Units === undefined || !dicomMetaData.RadiopharmaceuticalInformationSequence || dicomMetaData.RadiopharmaceuticalInformationSequence.RadionuclideHalfLife === undefined || dicomMetaData.RadiopharmaceuticalInformationSequence.RadionuclideTotalDose === undefined || dicomMetaData.DecayCorrection === undefined || dicomMetaData.AcquisitionDate === undefined || dicomMetaData.AcquisitionTime === undefined || dicomMetaData.RadiopharmaceuticalInformationSequence.RadiopharmaceuticalStartDateTime === undefined && dicomMetaData.RadiopharmaceuticalInformationSequence.RadiopharmaceuticalStartTime === undefined) {
    throw new Error('required metadata are missing');
  }
  if (dicomMetaData.PatientWeight === undefined) {
    console.warn('PatientWeight missing from PT instance metadata');
  }
  const instanceMetadata = {
    CorrectedImage: dicomMetaData.CorrectedImage,
    Units: dicomMetaData.Units,
    RadionuclideHalfLife: dicomMetaData.RadiopharmaceuticalInformationSequence.RadionuclideHalfLife,
    RadionuclideTotalDose: dicomMetaData.RadiopharmaceuticalInformationSequence.RadionuclideTotalDose,
    RadiopharmaceuticalStartDateTime: dicomMetaData.RadiopharmaceuticalInformationSequence.RadiopharmaceuticalStartDateTime,
    RadiopharmaceuticalStartTime: dicomMetaData.RadiopharmaceuticalInformationSequence.RadiopharmaceuticalStartTime,
    DecayCorrection: dicomMetaData.DecayCorrection,
    PatientWeight: dicomMetaData.PatientWeight,
    SeriesDate: dicomMetaData.SeriesDate,
    SeriesTime: dicomMetaData.SeriesTime,
    AcquisitionDate: dicomMetaData.AcquisitionDate,
    AcquisitionTime: dicomMetaData.AcquisitionTime
  };
  if (dicomMetaData['70531000'] || dicomMetaData['70531000'] !== undefined || dicomMetaData['70531009'] || dicomMetaData['70531009'] !== undefined) {
    const philipsPETPrivateGroup = {
      SUVScaleFactor: dicomMetaData['70531000'],
      ActivityConcentrationScaleFactor: dicomMetaData['70531009']
    };
    instanceMetadata.PhilipsPETPrivateGroup = philipsPETPrivateGroup;
  }
  if (dicomMetaData['0009100d'] && dicomMetaData['0009100d'] !== undefined) {
    instanceMetadata.GEPrivatePostInjectionDateTime = dicomMetaData['0009100d'];
  }
  if (dicomMetaData.FrameReferenceTime && dicomMetaData.FrameReferenceTime !== undefined) {
    instanceMetadata.FrameReferenceTime = dicomMetaData.FrameReferenceTime;
  }
  if (dicomMetaData.ActualFrameDuration && dicomMetaData.ActualFrameDuration !== undefined) {
    instanceMetadata.ActualFrameDuration = dicomMetaData.ActualFrameDuration;
  }
  if (dicomMetaData.PatientSex && dicomMetaData.PatientSex !== undefined) {
    instanceMetadata.PatientSex = dicomMetaData.PatientSex;
  }
  if (dicomMetaData.PatientSize && dicomMetaData.PatientSize !== undefined) {
    instanceMetadata.PatientSize = dicomMetaData.PatientSize;
  }
  return instanceMetadata;
}
function convertInterfaceTimeToString(time) {
  const hours = `${time.hours || '00'}`.padStart(2, '0');
  const minutes = `${time.minutes || '00'}`.padStart(2, '0');
  const seconds = `${time.seconds || '00'}`.padStart(2, '0');
  const fractionalSeconds = `${time.fractionalSeconds || '000000'}`.padEnd(6, '0');
  const timeString = `${hours}${minutes}${seconds}.${fractionalSeconds}`;
  return timeString;
}
function convertInterfaceDateToString(date) {
  const month = `${date.month}`.padStart(2, '0');
  const day = `${date.day}`.padStart(2, '0');
  const dateString = `${date.year}${month}${day}`;
  return dateString;
}

;// ../../../extensions/default/src/hangingprotocols/utils/viewCode.ts
/* harmony default export */ const viewCode = (displaySet => {
  const ViewCodeSequence = displaySet?.images[0]?.ViewCodeSequence[0];
  if (!ViewCodeSequence) {
    return undefined;
  }
  const {
    CodingSchemeDesignator,
    CodeValue
  } = ViewCodeSequence;
  if (!CodingSchemeDesignator || !CodeValue) {
    return undefined;
  }
  return `${CodingSchemeDesignator}:${CodeValue}`;
});
;// ../../../extensions/default/src/hangingprotocols/utils/laterality.ts
/* harmony default export */ const laterality = (displaySet => {
  const frameAnatomy = displaySet?.images?.[0]?.SharedFunctionalGroupsSequence?.[0]?.FrameAnatomySequence?.[0];
  if (!frameAnatomy) {
    return undefined;
  }
  const laterality = frameAnatomy?.FrameLaterality;
  return laterality;
});
;// ../../../extensions/default/src/hangingprotocols/utils/registerHangingProtocolAttributes.ts


function registerHangingProtocolAttributes({
  servicesManager
}) {
  const {
    hangingProtocolService
  } = servicesManager.services;
  hangingProtocolService.addCustomAttribute('ViewCode', 'View Code Designator:Value', viewCode);
  hangingProtocolService.addCustomAttribute('Laterality', 'Laterality of object', laterality);
}
;// ../../../extensions/default/src/hangingprotocols/index.ts








;// ../../../extensions/default/src/init.ts





const init_metadataProvider = src.classes.MetadataProvider;

/**
 *
 * @param {Object} servicesManager
 * @param {Object} configuration
 */
function init({
  servicesManager,
  commandsManager,
  hotkeysManager
}) {
  const {
    toolbarService,
    cineService,
    viewportGridService
  } = servicesManager.services;
  toolbarService.registerEventForToolbarUpdate(cineService, [cineService.EVENTS.CINE_STATE_CHANGED]);
  toolbarService.registerEventForToolbarUpdate(hotkeysManager, [src.HotkeysManager.EVENTS.HOTKEY_PRESSED]);

  // Add
  src.DicomMetadataStore.subscribe(src.DicomMetadataStore.EVENTS.INSTANCES_ADDED, handleScalingModules);

  // If the metadata for PET has changed by the user (e.g. manually changing the PatientWeight)
  // we need to recalculate the SUV Scaling Factors
  src.DicomMetadataStore.subscribe(src.DicomMetadataStore.EVENTS.SERIES_UPDATED, handleScalingModules);

  // Adds extra custom attributes for use by hanging protocols
  registerHangingProtocolAttributes({
    servicesManager
  });

  // Function to process and subscribe to events for a given set of commands and listeners
  const eventSubscriptions = [];
  const subscribeToEvents = listeners => {
    Object.entries(listeners).forEach(([event, commands]) => {
      const supportedEvents = [viewportGridService.EVENTS.ACTIVE_VIEWPORT_ID_CHANGED, viewportGridService.EVENTS.VIEWPORTS_READY];
      if (supportedEvents.includes(event)) {
        const subscriptionKey = `${event}_${JSON.stringify(commands)}`;
        if (eventSubscriptions.includes(subscriptionKey)) {
          return;
        }
        viewportGridService.subscribe(event, eventData => {
          const viewportId = eventData?.viewportId ?? viewportGridService.getActiveViewportId();
          commandsManager.run(commands, {
            viewportId
          });
        });
        eventSubscriptions.push(subscriptionKey);
      }
    });
  };
  toolbarService.subscribe(toolbarService.EVENTS.TOOL_BAR_MODIFIED, state => {
    const {
      buttons
    } = state;
    for (const [id, button] of Object.entries(buttons)) {
      const {
        buttonSection,
        items,
        listeners
      } = button.props || {};

      // Handle group items' listeners
      if (buttonSection && items) {
        items.forEach(item => {
          if (item.listeners) {
            subscribeToEvents(item.listeners);
          }
        });
      }

      // Handle button listeners
      if (listeners) {
        subscribeToEvents(listeners);
      }
    }
  });
}
const handleScalingModules = ({
  SeriesInstanceUID,
  StudyInstanceUID
}) => {
  const {
    instances
  } = src.DicomMetadataStore.getSeries(StudyInstanceUID, SeriesInstanceUID);
  if (!instances?.length) {
    return;
  }
  const modality = instances[0].Modality;
  const allowedModality = ['PT', 'RTDOSE'];
  if (!allowedModality.includes(modality)) {
    return;
  }
  const imageIds = instances.map(instance => instance.imageId);
  const instanceMetadataArray = [];
  if (modality === 'RTDOSE') {
    const DoseGridScaling = instances[0].DoseGridScaling;
    const DoseSummation = instances[0].DoseSummation;
    const DoseType = instances[0].DoseType;
    const DoseUnit = instances[0].DoseUnit;
    const NumberOfFrames = instances[0].NumberOfFrames;
    const imageId = imageIds[0];

    // add scaling module to the metadata
    // since RTDOSE is always a multiframe we should add the scaling module to each frame
    for (let i = 0; i < NumberOfFrames; i++) {
      const frameIndex = i + 1;

      // Todo: we should support other things like wadouri, local etc
      const newImageId = `${imageId.replace(/\/frames\/\d+$/, '')}/frames/${frameIndex}`;
      init_metadataProvider.addCustomMetadata(newImageId, 'scalingModule', {
        DoseGridScaling,
        DoseSummation,
        DoseType,
        DoseUnit
      });
    }
    return;
  }

  // try except block to prevent errors when the metadata is not correct
  try {
    imageIds.forEach(imageId => {
      const instanceMetadata = getPTImageIdInstanceMetadata(imageId);
      if (instanceMetadata) {
        instanceMetadataArray.push(instanceMetadata);
      }
    });
    if (!instanceMetadataArray.length) {
      return;
    }
    const suvScalingFactors = (0,calculate_suv_esm/* calculateSUVScalingFactors */.C)(instanceMetadataArray);
    instanceMetadataArray.forEach((instanceMetadata, index) => {
      init_metadataProvider.addCustomMetadata(imageIds[index], 'scalingModule', suvScalingFactors[index]);
    });
  } catch (error) {
    console.log(error);
  }
};
;// ../../../extensions/default/src/DicomWebDataSource/utils/fixBulkDataURI.ts
/**
 * Modifies a bulkDataURI to ensure it is absolute based on the DICOMWeb configuration and
 * instance data. The modification is in-place.
 *
 * If the bulkDataURI is relative to the series or study (according to the DICOM standard),
 * it is made absolute by prepending the relevant paths.
 *
 * In scenarios where the bulkDataURI is a server-relative path (starting with '/'), the function
 * handles two cases:
 *
 * 1. If the wado root is absolute (starts with 'http'), it prepends the wado root to the bulkDataURI.
 * 2. If the wado root is relative, no changes are needed as the bulkDataURI is already correctly relative to the server root.
 *
 * @param value - The object containing BulkDataURI to be fixed.
 * @param instance - The object (DICOM instance data) containing StudyInstanceUID and SeriesInstanceUID.
 * @param dicomWebConfig - The DICOMWeb configuration object, containing wadoRoot and potentially bulkDataURI.relativeResolution.
 * @returns The function modifies `value` in-place, it does not return a value.
 */
function fixBulkDataURI(value, instance, dicomWebConfig) {
  // in case of the relative path, make it absolute. The current DICOM standard says
  // the bulkdataURI is relative to the series. However, there are situations where
  // it can be relative to the study too
  let {
    BulkDataURI
  } = value;
  const {
    bulkDataURI: uriConfig = {}
  } = dicomWebConfig;
  BulkDataURI = uriConfig.transform?.(BulkDataURI) || BulkDataURI;

  // Handle incorrectly prefixed origins
  const {
    startsWith,
    prefixWith = ''
  } = uriConfig;
  if (startsWith && BulkDataURI.startsWith(startsWith)) {
    BulkDataURI = prefixWith + BulkDataURI.substring(startsWith.length);
    value.BulkDataURI = BulkDataURI;
  }
  if (!BulkDataURI.startsWith('http') && !value.BulkDataURI.startsWith('/')) {
    const {
      StudyInstanceUID,
      SeriesInstanceUID
    } = instance;
    const isInstanceStart = BulkDataURI.startsWith('instances/') || BulkDataURI.startsWith('../');
    if (BulkDataURI.startsWith('series/') || BulkDataURI.startsWith('bulkdata/') || uriConfig.relativeResolution === 'studies' && !isInstanceStart) {
      value.BulkDataURI = `${dicomWebConfig.wadoRoot}/studies/${StudyInstanceUID}/${BulkDataURI}`;
    } else if (isInstanceStart || uriConfig.relativeResolution === 'series' || !uriConfig.relativeResolution) {
      value.BulkDataURI = `${dicomWebConfig.wadoRoot}/studies/${StudyInstanceUID}/series/${SeriesInstanceUID}/${BulkDataURI}`;
    }
    return;
  }

  // in case it is relative path but starts at the server (e.g., /bulk/1e, note the missing http
  // in the beginning and the first character is /) There are two scenarios, whether the wado root
  // is absolute or relative. In case of absolute, we need to prepend the wado root to the bulkdata
  // uri (e.g., bulkData: /bulk/1e, wado root: http://myserver.com/dicomweb, output: http://myserver.com/bulk/1e)
  // and in case of relative wado root, we need to prepend the bulkdata uri to the wado root (e.g,. bulkData: /bulk/1e
  // wado root: /dicomweb, output: /bulk/1e)
  if (BulkDataURI[0] === '/') {
    if (dicomWebConfig.wadoRoot.startsWith('http')) {
      // Absolute wado root
      const url = new URL(dicomWebConfig.wadoRoot);
      value.BulkDataURI = `${url.origin}${BulkDataURI}`;
    } else {
      // Relative wado root, we don't need to do anything, bulkdata uri is already correct
    }
  }
}

;// ../../../extensions/default/src/DicomWebDataSource/utils/cleanDenaturalizedDataset.ts

function isPrimitive(v) {
  return !(typeof v == 'object' || Array.isArray(v));
}
const vrNumerics = new Set(['DS', 'FL', 'FD', 'IS', 'OD', 'OF', 'OL', 'OV', 'SL', 'SS', 'SV', 'UL', 'US', 'UV']);

/**
 * Specialized for DICOM JSON format dataset cleaning.
 * @param obj
 * @returns
 */
function cleanDenaturalizedDataset(obj, options) {
  if (Array.isArray(obj)) {
    const newAry = obj.map(o => isPrimitive(o) ? o : cleanDenaturalizedDataset(o, options));
    return newAry;
  }
  if (isPrimitive(obj)) {
    return obj;
  }
  Object.keys(obj).forEach(key => {
    if (obj[key].Value === null && obj[key].vr) {
      delete obj[key].Value;
    } else if (Array.isArray(obj[key].Value) && obj[key].vr) {
      if (obj[key].Value.length === 1 && obj[key].Value[0].BulkDataURI) {
        if (options?.dataSourceConfig) {
          // Not needed unless data source is directly used for loading data.
          fixBulkDataURI(obj[key].Value[0], options, options.dataSourceConfig);
        }
        obj[key].BulkDataURI = obj[key].Value[0].BulkDataURI;

        // prevent mixed-content blockage
        if (window.location.protocol === 'https:' && obj[key].BulkDataURI.startsWith('http:')) {
          obj[key].BulkDataURI = obj[key].BulkDataURI.replace('http:', 'https:');
        }
        delete obj[key].Value;
      } else if (vrNumerics.has(obj[key].vr)) {
        obj[key].Value = obj[key].Value.map(v => +v);
      } else {
        obj[key].Value = obj[key].Value.map(entry => cleanDenaturalizedDataset(entry, options));
      }
    }
  });
  return obj;
}

/**
 * This is required to make the denaturalized data transferrable when it has
 * added proxy values.
 */
function transferDenaturalizedDataset(dataset) {
  const noNull = cleanDenaturalizedDataset(dataset);
  return JSON.parse(JSON.stringify(noNull));
}
;// ../../../extensions/default/src/DicomWebDataSource/utils/fixMultiValueKeys.ts
/**
 * Fix multi-valued keys so that those which are strings split by
 * a backslash are returned as arrays.
 */
function fixMultiValueKeys(naturalData, keys = ['ImageType']) {
  for (const key of keys) {
    if (typeof naturalData[key] === 'string') {
      naturalData[key] = naturalData[key].split('\\');
    }
  }
  return naturalData;
}
;// ../../../extensions/default/src/DicomWebDataSource/utils/index.ts




// EXTERNAL MODULE: ../../../node_modules/dicomweb-client/build/dicomweb-client.es.js
var dicomweb_client_es = __webpack_require__(83562);
;// ../../../extensions/default/src/DicomWebDataSource/utils/findIndexOfString.ts
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
/* harmony default export */ const utils_findIndexOfString = (findIndexOfString);
;// ../../../extensions/default/src/DicomWebDataSource/utils/fixMultipart.ts


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
  const dashIndex = utils_findIndexOfString(data, '--');
  if (dashIndex > 6) {
    return arrayData;
  }
  const tokenIndex = utils_findIndexOfString(data, '\r\n\r\n', dashIndex);
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
  const endIndex = utils_findIndexOfString(data, boundary, offset);
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
;// ../../../extensions/default/src/DicomWebDataSource/utils/StaticWadoClient.ts


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

class StaticWadoClient_StaticWadoClient extends dicomweb_client_es/* api */.FH.DICOMwebClient {
  constructor(config) {
    super(config);
    this.config = void 0;
    this.staticWado = void 0;
    this.staticWado = config.staticWado;
    this.config = config;
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
    if (this.staticWado) {
      return super.retrieveInstanceFrames({
        ...options,
        mediaTypes: [{
          mediaType: 'image/*'
        }]
      });
    } else {
      return super.retrieveInstanceFrames(options);
    }
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
      for (const key of Object.keys(StaticWadoClient_StaticWadoClient.studyFilterKeys)) {
        if (!this.filterItem(key, lowerParams, study, StaticWadoClient_StaticWadoClient.studyFilterKeys)) {
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
      for (const key of Object.keys(StaticWadoClient_StaticWadoClient.seriesFilterKeys)) {
        if (!this.filterItem(key, lowerParams, series, StaticWadoClient_StaticWadoClient.seriesFilterKeys)) {
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
StaticWadoClient_StaticWadoClient.studyFilterKeys = {
  studyinstanceuid: '0020000D',
  patientname: '00100010',
  '00100020': 'mrn',
  studydescription: '00081030',
  studydate: '00080020',
  modalitiesinstudy: '00080061',
  accessionnumber: '00080050'
};
StaticWadoClient_StaticWadoClient.seriesFilterKeys = {
  seriesinstanceuid: '0020000E',
  seriesnumber: '00200011',
  modality: '00080060'
};
;// ../../../extensions/default/src/stores/useUIStateStore.ts



/**
 * Identifier for the UI State store type.
 */
const useUIStateStore_PRESENTATION_TYPE_ID = 'uiStateId';

/**
 * Flag to enable or disable debug mode for the store.
 * Set to `true` to enable zustand devtools.
 */
const useUIStateStore_DEBUG_STORE = false;

/**
 * Represents the UI state.
 */

/**
 * State shape for the UI State store.
 */

/**
 * Creates the UI State store.
 *
 * @param set - The zustand set function.
 * @returns The UI State store state and actions.
 */
const createUIStateStore = set => ({
  type: useUIStateStore_PRESENTATION_TYPE_ID,
  uiState: {},
  /**
   * Sets the UI state for a given key.
   */
  setUIState: (key, value) => set(state => ({
    uiState: {
      ...state.uiState,
      [key]: value
    }
  }), false, 'setUIState'),
  /**
   * Clears all UI state.
   */
  clearUIState: () => set({
    uiState: {}
  }, false, 'clearUIState')
});

/**
 * Zustand store for managing UI state.
 * Applies devtools middleware when DEBUG_STORE is enabled.
 */
const useUIStateStore = (0,zustand_esm/* create */.vt)()(useUIStateStore_DEBUG_STORE ? (0,middleware/* devtools */.lt)(createUIStateStore, {
  name: 'UIStateStore'
}) : createUIStateStore);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/index.js
var utilities = __webpack_require__(53860);
;// ../../../extensions/default/src/utils/callInputDialog.tsx





function InputDialogDefault({
  hide,
  onSave,
  placeholder = 'Enter value',
  defaultValue = '',
  submitOnEnter
}) {
  return /*#__PURE__*/react.createElement(ui_next_src/* InputDialog */.fa0, {
    submitOnEnter: submitOnEnter,
    defaultValue: defaultValue
  }, /*#__PURE__*/react.createElement(ui_next_src/* InputDialog */.fa0.Field, null, /*#__PURE__*/react.createElement(ui_next_src/* InputDialog */.fa0.Input, {
    placeholder: placeholder
  })), /*#__PURE__*/react.createElement(ui_next_src/* InputDialog */.fa0.Actions, null, /*#__PURE__*/react.createElement(ui_next_src/* InputDialog */.fa0.ActionsSecondary, {
    onClick: hide
  }, "Cancel"), /*#__PURE__*/react.createElement(ui_next_src/* InputDialog */.fa0.ActionsPrimary, {
    onClick: value => {
      onSave(value);
      hide();
    }
  }, "Save")));
}

/**
 * Shows an input dialog for entering text with customizable options
 * @param uiDialogService - Service for showing UI dialogs
 * @param onSave - Callback function called when save button is clicked with entered value
 * @param defaultValue - Initial value to show in input field
 * @param title - Title text to show in dialog header
 * @param placeholder - Placeholder text for input field
 * @param submitOnEnter - Whether to submit dialog when Enter key is pressed
 */
async function callInputDialog({
  uiDialogService,
  defaultValue = '',
  title = 'Annotation',
  placeholder = '',
  submitOnEnter = true
}) {
  const dialogId = 'dialog-enter-annotation';
  const value = await new Promise(resolve => {
    uiDialogService.show({
      id: dialogId,
      content: InputDialogDefault,
      title: title,
      shouldCloseOnEsc: true,
      contentProps: {
        onSave: value => {
          resolve(value);
        },
        placeholder,
        defaultValue,
        submitOnEnter
      }
    });
  });
  return value;
}
async function callInputDialogAutoComplete({
  measurement,
  uiDialogService,
  labelConfig,
  renderContent = ui_next_src/* LabellingFlow */.ndl,
  element
}) {
  const exclusive = labelConfig ? labelConfig.exclusive : false;
  const dropDownItems = labelConfig ? labelConfig.items : [];
  const value = await new Promise((resolve, reject) => {
    const labellingDoneCallback = newValue => {
      uiDialogService.hide('select-annotation');
      if (measurement && typeof newValue === 'string') {
        const sourceAnnotation = tools_dist_esm.annotation.state.getAnnotation(measurement.uid);
        (0,utilities.setAnnotationLabel)(sourceAnnotation, element, newValue);
      }
      resolve(newValue);
    };
    uiDialogService.show({
      id: 'select-annotation',
      title: 'Annotation',
      content: renderContent,
      contentProps: {
        labellingDoneCallback: labellingDoneCallback,
        measurementData: measurement,
        componentClassName: {},
        labelData: dropDownItems,
        exclusive: exclusive
      }
    });
  });
  return value;
}
/* harmony default export */ const utils_callInputDialog = ((/* unused pure expression or super */ null && (callInputDialog)));
// EXTERNAL MODULE: ../../../node_modules/react-color/es/index.js + 219 modules
var react_color_es = __webpack_require__(69175);
;// ../../../extensions/default/src/utils/colorPickerDialog.css
// extracted by mini-css-extract-plugin

;// ../../../extensions/default/src/utils/colorPickerDialog.tsx




function ColorPickerDialog({
  value,
  hide,
  onSave
}) {
  const [color, setColor] = (0,react.useState)(value);
  const handleChange = color => {
    setColor(color.rgb);
  };
  return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(react_color_es/* ChromePicker */.xk, {
    color: color,
    onChange: handleChange,
    presetColors: [],
    width: 300
  }), /*#__PURE__*/react.createElement(ui_next_src/* FooterAction */.esu, null, /*#__PURE__*/react.createElement(ui_next_src/* FooterAction */.esu.Right, null, /*#__PURE__*/react.createElement(ui_next_src/* FooterAction */.esu.Secondary, {
    onClick: hide
  }, "Cancel"), /*#__PURE__*/react.createElement(ui_next_src/* FooterAction */.esu.Primary, {
    onClick: () => {
      hide();
      onSave(color);
    }
  }, "Save"))));
}
/* harmony default export */ const colorPickerDialog = (ColorPickerDialog);
;// ../../../extensions/default/src/utils/promptLabelAnnotation.js

function promptLabelAnnotation({
  servicesManager
}, ctx, evt) {
  const {
    measurementService,
    customizationService,
    toolGroupService,
    uiDialogService
  } = servicesManager.services;
  const {
    viewportId,
    StudyInstanceUID,
    SeriesInstanceUID,
    measurementId,
    toolName
  } = evt;
  return new Promise(resolve => {
    (async () => {
      const toolGroup = toolGroupService.getToolGroupForViewport(viewportId);
      const activeToolOptions = toolGroup.getToolConfiguration(toolName);
      if (activeToolOptions.getTextCallback) {
        resolve({
          StudyInstanceUID,
          SeriesInstanceUID,
          viewportId
        });
      } else {
        const labelConfig = customizationService.getCustomization('measurementLabels');
        const measurement = measurementService.getMeasurement(measurementId);
        const renderContent = customizationService.getCustomization('ui.labellingComponent');
        const value = await callInputDialogAutoComplete({
          measurement,
          uiDialogService,
          labelConfig,
          renderContent
        });
        measurementService.update(measurementId, {
          ...value
        }, true);
        resolve({
          StudyInstanceUID,
          SeriesInstanceUID,
          viewportId
        });
      }
    })();
  });
}
/* harmony default export */ const utils_promptLabelAnnotation = (promptLabelAnnotation);
// EXTERNAL MODULE: ../../../extensions/default/src/Panels/StudyBrowser/PanelStudyBrowserHeader.tsx
var PanelStudyBrowserHeader = __webpack_require__(3329);
;// ../../../extensions/default/src/utils/addIcon.ts


/** Adds the icon to both ui and ui-next */
function addIcon(name, icon) {
  ui_next_src/* Icons */.FI1.addIcon(name, icon);
}
;// ../../../extensions/default/src/utils/Toolbox.tsx
function Toolbox_extends() { return Toolbox_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, Toolbox_extends.apply(null, arguments); }





/**
 * A toolbox is a collection of buttons and commands that they invoke, used to provide
 * custom control panels to users. This component is a generic UI component that
 * interacts with services and commands in a generic fashion. While it might
 * seem unconventional to import it from the UI and integrate it into the JSX,
 * it belongs in the UI components as there isn't anything in this component that
 * couldn't be used for a completely different type of app. It plays a crucial
 * role in enhancing the app with a toolbox by providing a way to integrate
 * and display various tools and their corresponding options
 */
function Toolbox({
  buttonSectionId,
  title
}) {
  const {
    servicesManager
  } = (0,src.useSystem)();
  const {
    t
  } = (0,es/* useTranslation */.Bd)();
  const {
    toolbarService,
    customizationService
  } = servicesManager.services;
  const [showConfig, setShowConfig] = (0,react.useState)(false);
  const {
    toolbarButtons: toolboxSections,
    onInteraction
  } = (0,src.useToolbar)({
    buttonSection: buttonSectionId
  });
  if (!toolboxSections.length) {
    return null;
  }

  // Ensure we have proper button sections at the top level.
  if (!toolboxSections.every(section => section.componentProps.buttonSection)) {
    throw new Error('Toolbox accepts only button sections at the top level, not buttons. Create at least one button section.');
  }

  // Helper to check a list of buttons for an active tool.
  const findActiveOptions = buttons => {
    for (const tool of buttons) {
      if (tool.componentProps.isActive) {
        return tool.componentProps.options;
      }
      if (tool.componentProps.buttonSection) {
        const nestedButtons = toolbarService.getButtonPropsInButtonSection(tool.componentProps.buttonSection);
        const activeNested = nestedButtons.find(nested => nested.isActive);
        if (activeNested) {
          return activeNested.options;
        }
      }
    }
    return null;
  };

  // Look for active tool options across all sections.
  const activeToolOptions = toolboxSections.reduce((activeOptions, section) => {
    if (activeOptions) {
      return activeOptions;
    }
    const sectionId = section.componentProps.buttonSection;
    const buttons = toolbarService.getButtonSection(sectionId);
    return findActiveOptions(buttons);
  }, null);

  // Define the interaction handler once.
  const handleInteraction = ({
    itemId
  }) => {
    onInteraction?.({
      itemId
    });
  };
  const CustomConfigComponent = customizationService.getCustomization(`${buttonSectionId}.config`);
  return /*#__PURE__*/react.createElement(ui_next_src/* PanelSection */.aUM, null, /*#__PURE__*/react.createElement(ui_next_src/* PanelSection */.aUM.Header, {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/react.createElement("span", null, t(title)), CustomConfigComponent && /*#__PURE__*/react.createElement("div", {
    className: "ml-auto mr-2"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Settings, {
    className: "text-primary h-4 w-4",
    onClick: e => {
      e.stopPropagation();
      setShowConfig(!showConfig);
    }
  }))), /*#__PURE__*/react.createElement(ui_next_src/* PanelSection */.aUM.Content, {
    className: "bg-muted flex-shrink-0 border-none"
  }, showConfig && /*#__PURE__*/react.createElement(CustomConfigComponent, null), toolboxSections.map(section => {
    const sectionId = section.componentProps.buttonSection;
    const buttons = toolbarService.getButtonSection(sectionId);
    return /*#__PURE__*/react.createElement("div", {
      key: sectionId,
      className: "bg-muted flex flex-wrap space-x-2 py-2 px-1"
    }, buttons.map(tool => {
      if (!tool) {
        return null;
      }
      const {
        id,
        Component,
        componentProps
      } = tool;
      return /*#__PURE__*/react.createElement("div", {
        key: id,
        className: classnames_default()('ml-1')
      }, /*#__PURE__*/react.createElement(Component, Toolbox_extends({}, componentProps, {
        id: id,
        onInteraction: handleInteraction,
        size: "toolbox",
        servicesManager: servicesManager
      })));
    }));
  }), activeToolOptions && /*#__PURE__*/react.createElement("div", {
    className: "bg-primary-dark mt-1 h-auto px-2"
  }, /*#__PURE__*/react.createElement(ui_next_src/* ToolSettings */.k_3, {
    options: activeToolOptions
  }))));
}
;// ../../../extensions/default/src/utils/index.ts


// EXTERNAL MODULE: ../../../extensions/default/src/Components/MoreDropdownMenu.tsx
var MoreDropdownMenu = __webpack_require__(52675);
;// ../../../extensions/default/src/index.ts




































const defaultExtension = {
  /**
   * Only required property. Should be a unique value across all extensions.
   */
  id: id,
  preRegistration: init,
  onModeExit() {
    useViewportGridStore.getState().clearViewportGridState();
    useUIStateStore.getState().clearUIState();
    useDisplaySetSelectorStore.getState().clearDisplaySetSelectorMap();
    useHangingProtocolStageIndexStore.getState().clearHangingProtocolStageIndexMap();
    useToggleHangingProtocolStore.getState().clearToggleHangingProtocol();
    useViewportsByPositionStore.getState().clearViewportsByPosition();
  },
  getDataSourcesModule: src_getDataSourcesModule,
  getViewportModule: getViewportModule,
  getLayoutTemplateModule: getLayoutTemplateModule,
  getPanelModule: src_getPanelModule,
  getHangingProtocolModule: src_getHangingProtocolModule,
  getSopClassHandlerModule: src_getSopClassHandlerModule,
  getToolbarModule: getToolbarModule,
  getCommandsModule: src_commandsModule,
  getUtilityModule({
    servicesManager
  }) {
    return [{
      name: 'common',
      exports: {
        getStudiesForPatientByMRN: Panels_getStudiesForPatientByMRN
      }
    }];
  },
  getCustomizationModule: getCustomizationModule
};
/* harmony default export */ const default_src = (defaultExtension);


/***/ }),

/***/ 96357:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const RESPONSE = {
  NO_NEVER: -1,
  CANCEL: 0,
  CREATE_REPORT: 1,
  ADD_SERIES: 2,
  SET_STUDY_AND_SERIES: 3,
  NO_NOT_FOR_SERIES: 4
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RESPONSE);

/***/ }),

/***/ 75443:
/***/ (() => {

/* (ignored) */

/***/ })

}]);