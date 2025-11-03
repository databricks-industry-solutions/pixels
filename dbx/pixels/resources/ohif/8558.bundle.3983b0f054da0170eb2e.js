"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[8558],{

/***/ 75183:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var ChangeTypes;
(function (ChangeTypes) {
    ChangeTypes["Interaction"] = "Interaction";
    ChangeTypes["HandlesUpdated"] = "HandlesUpdated";
    ChangeTypes["StatsUpdated"] = "StatsUpdated";
    ChangeTypes["InitialSetup"] = "InitialSetup";
    ChangeTypes["Completed"] = "Completed";
    ChangeTypes["InterpolationUpdated"] = "InterpolationUpdated";
    ChangeTypes["History"] = "History";
    ChangeTypes["MetadataReferenceModified"] = "MetadataReferenceModified";
    ChangeTypes["LabelChange"] = "LabelChange";
})(ChangeTypes || (ChangeTypes = {}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChangeTypes);


/***/ }),

/***/ 94021:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var Events;
(function (Events) {
    Events["TOOL_ACTIVATED"] = "CORNERSTONE_TOOLS_TOOL_ACTIVATED";
    Events["TOOLGROUP_VIEWPORT_ADDED"] = "CORNERSTONE_TOOLS_TOOLGROUP_VIEWPORT_ADDED";
    Events["TOOLGROUP_VIEWPORT_REMOVED"] = "CORNERSTONE_TOOLS_TOOLGROUP_VIEWPORT_REMOVED";
    Events["TOOL_MODE_CHANGED"] = "CORNERSTONE_TOOLS_TOOL_MODE_CHANGED";
    Events["CROSSHAIR_TOOL_CENTER_CHANGED"] = "CORNERSTONE_TOOLS_CROSSHAIR_TOOL_CENTER_CHANGED";
    Events["ANNOTATION_ADDED"] = "CORNERSTONE_TOOLS_ANNOTATION_ADDED";
    Events["ANNOTATION_COMPLETED"] = "CORNERSTONE_TOOLS_ANNOTATION_COMPLETED";
    Events["ANNOTATION_MODIFIED"] = "CORNERSTONE_TOOLS_ANNOTATION_MODIFIED";
    Events["ANNOTATION_REMOVED"] = "CORNERSTONE_TOOLS_ANNOTATION_REMOVED";
    Events["ANNOTATION_SELECTION_CHANGE"] = "CORNERSTONE_TOOLS_ANNOTATION_SELECTION_CHANGE";
    Events["ANNOTATION_LOCK_CHANGE"] = "CORNERSTONE_TOOLS_ANNOTATION_LOCK_CHANGE";
    Events["ANNOTATION_VISIBILITY_CHANGE"] = "CORNERSTONE_TOOLS_ANNOTATION_VISIBILITY_CHANGE";
    Events["ANNOTATION_RENDERED"] = "CORNERSTONE_TOOLS_ANNOTATION_RENDERED";
    Events["ANNOTATION_INTERPOLATION_PROCESS_COMPLETED"] = "CORNERSTONE_TOOLS_ANNOTATION_INTERPOLATION_PROCESS_COMPLETED";
    Events["INTERPOLATED_ANNOTATIONS_REMOVED"] = "CORNERSTONE_TOOLS_INTERPOLATED_ANNOTATIONS_REMOVED";
    Events["SEGMENTATION_MODIFIED"] = "CORNERSTONE_TOOLS_SEGMENTATION_MODIFIED";
    Events["SEGMENTATION_RENDERED"] = "CORNERSTONE_TOOLS_SEGMENTATION_RENDERED";
    Events["SEGMENTATION_REPRESENTATION_ADDED"] = "CORNERSTONE_TOOLS_SEGMENTATION_REPRESENTATION_ADDED";
    Events["SEGMENTATION_ADDED"] = "CORNERSTONE_TOOLS_SEGMENTATION_ADDED";
    Events["SEGMENTATION_REPRESENTATION_MODIFIED"] = "CORNERSTONE_TOOLS_SEGMENTATION_REPRESENTATION_MODIFIED";
    Events["SEGMENTATION_REMOVED"] = "CORNERSTONE_TOOLS_SEGMENTATION_REMOVED";
    Events["SEGMENTATION_REPRESENTATION_REMOVED"] = "CORNERSTONE_TOOLS_SEGMENTATION_REPRESENTATION_REMOVED";
    Events["SEGMENTATION_DATA_MODIFIED"] = "CORNERSTONE_TOOLS_SEGMENTATION_DATA_MODIFIED";
    Events["HISTORY_UNDO"] = "CORNERSTONE_TOOLS_HISTORY_UNDO";
    Events["HISTORY_REDO"] = "CORNERSTONE_TOOLS_HISTORY_REDO";
    Events["KEY_DOWN"] = "CORNERSTONE_TOOLS_KEY_DOWN";
    Events["KEY_UP"] = "CORNERSTONE_TOOLS_KEY_UP";
    Events["MOUSE_DOWN"] = "CORNERSTONE_TOOLS_MOUSE_DOWN";
    Events["MOUSE_UP"] = "CORNERSTONE_TOOLS_MOUSE_UP";
    Events["MOUSE_DOWN_ACTIVATE"] = "CORNERSTONE_TOOLS_MOUSE_DOWN_ACTIVATE";
    Events["MOUSE_DRAG"] = "CORNERSTONE_TOOLS_MOUSE_DRAG";
    Events["MOUSE_MOVE"] = "CORNERSTONE_TOOLS_MOUSE_MOVE";
    Events["MOUSE_CLICK"] = "CORNERSTONE_TOOLS_MOUSE_CLICK";
    Events["MOUSE_DOUBLE_CLICK"] = "CORNERSTONE_TOOLS_MOUSE_DOUBLE_CLICK";
    Events["MOUSE_WHEEL"] = "CORNERSTONE_TOOLS_MOUSE_WHEEL";
    Events["TOUCH_START"] = "CORNERSTONE_TOOLS_TOUCH_START";
    Events["TOUCH_START_ACTIVATE"] = "CORNERSTONE_TOOLS_TOUCH_START_ACTIVATE";
    Events["TOUCH_PRESS"] = "CORNERSTONE_TOOLS_TOUCH_PRESS";
    Events["TOUCH_DRAG"] = "CORNERSTONE_TOOLS_TOUCH_DRAG";
    Events["TOUCH_END"] = "CORNERSTONE_TOOLS_TOUCH_END";
    Events["TOUCH_TAP"] = "CORNERSTONE_TOOLS_TAP";
    Events["TOUCH_SWIPE"] = "CORNERSTONE_TOOLS_SWIPE";
})(Events || (Events = {}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Events);


/***/ }),

/***/ 18682:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var SegmentationRepresentations;
(function (SegmentationRepresentations) {
    SegmentationRepresentations["Labelmap"] = "Labelmap";
    SegmentationRepresentations["Contour"] = "Contour";
    SegmentationRepresentations["Surface"] = "Surface";
})(SegmentationRepresentations || (SegmentationRepresentations = {}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SegmentationRepresentations);


/***/ }),

/***/ 84093:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var StrategyCallbacks;
(function (StrategyCallbacks) {
    StrategyCallbacks["OnInteractionStart"] = "onInteractionStart";
    StrategyCallbacks["OnInteractionEnd"] = "onInteractionEnd";
    StrategyCallbacks["Preview"] = "preview";
    StrategyCallbacks["RejectPreview"] = "rejectPreview";
    StrategyCallbacks["AcceptPreview"] = "acceptPreview";
    StrategyCallbacks["Fill"] = "fill";
    StrategyCallbacks["Interpolate"] = "interpolate";
    StrategyCallbacks["StrategyFunction"] = "strategyFunction";
    StrategyCallbacks["CreateIsInThreshold"] = "createIsInThreshold";
    StrategyCallbacks["Initialize"] = "initialize";
    StrategyCallbacks["INTERNAL_setValue"] = "setValue";
    StrategyCallbacks["AddPreview"] = "addPreview";
    StrategyCallbacks["ComputeInnerCircleRadius"] = "computeInnerCircleRadius";
    StrategyCallbacks["GetStatistics"] = "getStatistics";
    StrategyCallbacks["EnsureImageVolumeFor3DManipulation"] = "ensureImageVolumeFor3DManipulation";
    StrategyCallbacks["EnsureSegmentationVolumeFor3DManipulation"] = "ensureSegmentationVolumeFor3DManipulation";
})(StrategyCallbacks || (StrategyCallbacks = {}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StrategyCallbacks);


/***/ }),

/***/ 66452:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   i: () => (/* binding */ MouseBindings),
/* harmony export */   q: () => (/* binding */ KeyboardBindings)
/* harmony export */ });
var MouseBindings;
(function (MouseBindings) {
    MouseBindings[MouseBindings["Primary"] = 1] = "Primary";
    MouseBindings[MouseBindings["Secondary"] = 2] = "Secondary";
    MouseBindings[MouseBindings["Primary_And_Secondary"] = 3] = "Primary_And_Secondary";
    MouseBindings[MouseBindings["Auxiliary"] = 4] = "Auxiliary";
    MouseBindings[MouseBindings["Primary_And_Auxiliary"] = 5] = "Primary_And_Auxiliary";
    MouseBindings[MouseBindings["Secondary_And_Auxiliary"] = 6] = "Secondary_And_Auxiliary";
    MouseBindings[MouseBindings["Primary_And_Secondary_And_Auxiliary"] = 7] = "Primary_And_Secondary_And_Auxiliary";
    MouseBindings[MouseBindings["Fourth_Button"] = 8] = "Fourth_Button";
    MouseBindings[MouseBindings["Fifth_Button"] = 16] = "Fifth_Button";
    MouseBindings[MouseBindings["Wheel"] = 524288] = "Wheel";
    MouseBindings[MouseBindings["Wheel_Primary"] = 524289] = "Wheel_Primary";
})(MouseBindings || (MouseBindings = {}));
var KeyboardBindings;
(function (KeyboardBindings) {
    KeyboardBindings[KeyboardBindings["Shift"] = 16] = "Shift";
    KeyboardBindings[KeyboardBindings["Ctrl"] = 17] = "Ctrl";
    KeyboardBindings[KeyboardBindings["Alt"] = 18] = "Alt";
    KeyboardBindings[KeyboardBindings["Meta"] = 91] = "Meta";
    KeyboardBindings[KeyboardBindings["ShiftCtrl"] = 1617] = "ShiftCtrl";
    KeyboardBindings[KeyboardBindings["ShiftAlt"] = 1618] = "ShiftAlt";
    KeyboardBindings[KeyboardBindings["ShiftMeta"] = 1691] = "ShiftMeta";
    KeyboardBindings[KeyboardBindings["CtrlAlt"] = 1718] = "CtrlAlt";
    KeyboardBindings[KeyboardBindings["CtrlMeta"] = 1791] = "CtrlMeta";
    KeyboardBindings[KeyboardBindings["AltMeta"] = 1891] = "AltMeta";
})(KeyboardBindings || (KeyboardBindings = {}));



/***/ }),

/***/ 49892:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var ToolModes;
(function (ToolModes) {
    ToolModes["Active"] = "Active";
    ToolModes["Passive"] = "Passive";
    ToolModes["Enabled"] = "Enabled";
    ToolModes["Disabled"] = "Disabled";
})(ToolModes || (ToolModes = {}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ToolModes);


/***/ }),

/***/ 10401:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   H: () => (/* binding */ Swipe)
/* harmony export */ });
var Swipe;
(function (Swipe) {
    Swipe["UP"] = "UP";
    Swipe["DOWN"] = "DOWN";
    Swipe["LEFT"] = "LEFT";
    Swipe["RIGHT"] = "RIGHT";
})(Swipe || (Swipe = {}));



/***/ }),

/***/ 99737:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  AnnotationStyleStates: () => (/* reexport */ enums_AnnotationStyleStates),
  ChangeTypes: () => (/* reexport */ ChangeTypes/* default */.A),
  Events: () => (/* reexport */ Events/* default */.A),
  KeyboardBindings: () => (/* reexport */ ToolBindings/* KeyboardBindings */.q),
  MouseBindings: () => (/* reexport */ ToolBindings/* MouseBindings */.i),
  SegmentationRepresentations: () => (/* reexport */ SegmentationRepresentations/* default */.A),
  StrategyCallbacks: () => (/* reexport */ StrategyCallbacks/* default */.A),
  Swipe: () => (/* reexport */ Touch/* Swipe */.H),
  ToolModes: () => (/* reexport */ ToolModes/* default */.A),
  WorkerTypes: () => (/* reexport */ WorkerTypes)
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/ToolBindings.js
var ToolBindings = __webpack_require__(66452);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/ToolModes.js
var ToolModes = __webpack_require__(49892);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/AnnotationStyleStates.js
var AnnotationStyleStates;
(function (AnnotationStyleStates) {
    AnnotationStyleStates["Default"] = "";
    AnnotationStyleStates["Highlighted"] = "Highlighted";
    AnnotationStyleStates["Selected"] = "Selected";
    AnnotationStyleStates["Locked"] = "Locked";
    AnnotationStyleStates["AutoGenerated"] = "AutoGenerated";
})(AnnotationStyleStates || (AnnotationStyleStates = {}));
/* harmony default export */ const enums_AnnotationStyleStates = (AnnotationStyleStates);

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/Events.js
var Events = __webpack_require__(94021);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/SegmentationRepresentations.js
var SegmentationRepresentations = __webpack_require__(18682);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/Touch.js
var Touch = __webpack_require__(10401);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/StrategyCallbacks.js
var StrategyCallbacks = __webpack_require__(84093);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/ChangeTypes.js
var ChangeTypes = __webpack_require__(75183);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/WorkerTypes.js
var WorkerTypes_ChangeTypes;
(function (ChangeTypes) {
    ChangeTypes["POLYSEG_CONTOUR_TO_LABELMAP"] = "Converting Contour to Labelmap";
    ChangeTypes["POLYSEG_SURFACE_TO_LABELMAP"] = "Converting Surfaces to Labelmap";
    ChangeTypes["POLYSEG_CONTOUR_TO_SURFACE"] = "Converting Contour to Surface";
    ChangeTypes["POLYSEG_LABELMAP_TO_SURFACE"] = "Converting Labelmap to Surface";
    ChangeTypes["SURFACE_CLIPPING"] = "Clipping Surfaces";
    ChangeTypes["COMPUTE_STATISTICS"] = "Computing Statistics";
    ChangeTypes["INTERPOLATE_LABELMAP"] = "Interpolating Labelmap";
    ChangeTypes["COMPUTE_LARGEST_BIDIRECTIONAL"] = "Computing Largest Bidirectional";
    ChangeTypes["GENERATE_CONTOUR_SETS"] = "Generating Contour Sets";
})(WorkerTypes_ChangeTypes || (WorkerTypes_ChangeTypes = {}));
/* harmony default export */ const WorkerTypes = (WorkerTypes_ChangeTypes);

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js












/***/ }),

/***/ 78558:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ cornerstone_dicom_rt_src)
});

;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-rt/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/extension-cornerstone-dicom-rt"}');
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-rt/src/id.js

const id = package_namespaceObject.UU;
const SOPClassHandlerName = 'dicom-rt';
const SOPClassHandlerId = `${id}.sopClassHandlerModule.${SOPClassHandlerName}`;

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../core/src/index.ts + 69 modules
var src = __webpack_require__(62037);
// EXTERNAL MODULE: ../../../node_modules/dcmjs/build/dcmjs.es.js
var dcmjs_es = __webpack_require__(5842);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-rt/src/loadRTStruct.js

const {
  DicomMessage,
  DicomMetaDictionary
} = dcmjs_es/* default.data */.Ay.data;
const dicomlab2RGB = dcmjs_es/* default.data */.Ay.data.Colors.dicomlab2RGB;
async function checkAndLoadContourData(instance, datasource) {
  if (!instance || !instance.ROIContourSequence) {
    return Promise.reject('Invalid instance object or ROIContourSequence');
  }
  const promisesMap = new Map();
  for (const ROIContour of instance.ROIContourSequence) {
    const referencedROINumber = ROIContour.ReferencedROINumber;
    if (!ROIContour || !ROIContour.ContourSequence) {
      promisesMap.set(referencedROINumber, [Promise.resolve([])]);
      continue;
    }
    for (const Contour of ROIContour.ContourSequence) {
      if (!Contour || !Contour.ContourData) {
        return Promise.reject('Invalid Contour or ContourData');
      }
      const contourData = Contour.ContourData;
      if (Array.isArray(contourData)) {
        promisesMap.has(referencedROINumber) ? promisesMap.get(referencedROINumber).push(Promise.resolve(contourData)) : promisesMap.set(referencedROINumber, [Promise.resolve(contourData)]);
      } else if (contourData && contourData.BulkDataURI) {
        const bulkDataURI = contourData.BulkDataURI;
        if (!datasource || !datasource.retrieve || !datasource.retrieve.bulkDataURI) {
          return Promise.reject('Invalid datasource object or retrieve function');
        }
        const bulkDataPromise = datasource.retrieve.bulkDataURI({
          BulkDataURI: bulkDataURI,
          StudyInstanceUID: instance.StudyInstanceUID,
          SeriesInstanceUID: instance.SeriesInstanceUID,
          SOPInstanceUID: instance.SOPInstanceUID
        });
        promisesMap.has(referencedROINumber) ? promisesMap.get(referencedROINumber).push(bulkDataPromise) : promisesMap.set(referencedROINumber, [bulkDataPromise]);
      } else {
        return Promise.reject(`Invalid ContourData: ${contourData}`);
      }
    }
  }
  const resolvedPromisesMap = new Map();
  for (const [key, promiseArray] of promisesMap.entries()) {
    resolvedPromisesMap.set(key, await Promise.allSettled(promiseArray));
  }
  instance.ROIContourSequence.forEach(ROIContour => {
    try {
      const referencedROINumber = ROIContour.ReferencedROINumber;
      const resolvedPromises = resolvedPromisesMap.get(referencedROINumber);
      if (ROIContour.ContourSequence) {
        ROIContour.ContourSequence.forEach((Contour, index) => {
          const promise = resolvedPromises[index];
          if (promise.status === 'fulfilled') {
            if (Array.isArray(promise.value) && promise.value.every(Number.isFinite)) {
              // If promise.value is already an array of numbers, use it directly
              Contour.ContourData = promise.value;
            } else {
              // If the resolved promise value is a byte array (Blob), it needs to be decoded
              const uint8Array = new Uint8Array(promise.value);
              const textDecoder = new TextDecoder();
              const dataUint8Array = textDecoder.decode(uint8Array);
              if (typeof dataUint8Array === 'string' && dataUint8Array.includes('\\')) {
                Contour.ContourData = dataUint8Array.split('\\').map(parseFloat);
              } else {
                Contour.ContourData = [];
              }
            }
          } else {
            console.error(promise.reason);
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  });
}
async function loadRTStruct(extensionManager, rtStructDisplaySet, headers) {
  const utilityModule = extensionManager.getModuleEntry('@ohif/extension-cornerstone.utilityModule.common');
  const dataSource = extensionManager.getActiveDataSource()[0];
  const {
    bulkDataURI
  } = dataSource.getConfig?.() || {};
  const {
    dicomLoaderService
  } = utilityModule.exports;

  // Set here is loading is asynchronous.
  // If this function throws its set back to false.
  rtStructDisplaySet.isLoaded = true;
  let instance = rtStructDisplaySet.instance;
  if (!bulkDataURI || !bulkDataURI.enabled) {
    const segArrayBuffer = await dicomLoaderService.findDicomDataPromise(rtStructDisplaySet, null, headers);
    const dicomData = DicomMessage.readFile(segArrayBuffer);
    const rtStructDataset = DicomMetaDictionary.naturalizeDataset(dicomData.dict);
    rtStructDataset._meta = DicomMetaDictionary.namifyDataset(dicomData.meta);
    instance = rtStructDataset;
  } else {
    await checkAndLoadContourData(instance, dataSource);
  }
  const {
    StructureSetROISequence,
    ROIContourSequence,
    RTROIObservationsSequence
  } = instance;

  // Define our structure set entry and add it to the rtstruct module state.
  const structureSet = {
    StructureSetLabel: instance.StructureSetLabel,
    SeriesInstanceUID: instance.SeriesInstanceUID,
    ROIContours: [],
    visible: true,
    ReferencedSOPInstanceUIDsSet: new Set()
  };
  for (let i = 0; i < ROIContourSequence.length; i++) {
    const ROIContour = ROIContourSequence[i];
    const {
      ContourSequence
    } = ROIContour;
    if (!ContourSequence) {
      continue;
    }
    const isSupported = false;
    const ContourSequenceArray = _toArray(ContourSequence);
    const contourPoints = [];
    for (let c = 0; c < ContourSequenceArray.length; c++) {
      const {
        ContourData,
        NumberOfContourPoints,
        ContourGeometricType,
        ContourImageSequence
      } = ContourSequenceArray[c];
      let isSupported = false;
      const points = [];
      for (let p = 0; p < NumberOfContourPoints * 3; p += 3) {
        points.push({
          x: ContourData[p],
          y: ContourData[p + 1],
          z: ContourData[p + 2]
        });
      }
      switch (ContourGeometricType) {
        case 'CLOSED_PLANAR':
        case 'OPEN_PLANAR':
        case 'POINT':
          isSupported = true;
          break;
        default:
          continue;
      }
      contourPoints.push({
        numberOfPoints: NumberOfContourPoints,
        points,
        type: ContourGeometricType,
        isSupported
      });
      if (ContourImageSequence?.ReferencedSOPInstanceUID) {
        structureSet.ReferencedSOPInstanceUIDsSet.add(ContourImageSequence?.ReferencedSOPInstanceUID);
      }
    }
    _setROIContourMetadata(structureSet, StructureSetROISequence, RTROIObservationsSequence, ROIContour, contourPoints, isSupported);
  }
  return structureSet;
}
function _setROIContourMetadata(structureSet, StructureSetROISequence, RTROIObservationsSequence, ROIContour, contourPoints, isSupported) {
  const StructureSetROI = StructureSetROISequence.find(structureSetROI => structureSetROI.ROINumber === ROIContour.ReferencedROINumber);
  const ROIContourData = {
    ROINumber: StructureSetROI.ROINumber,
    ROIName: StructureSetROI.ROIName,
    ROIGenerationAlgorithm: StructureSetROI.ROIGenerationAlgorithm,
    ROIDescription: StructureSetROI.ROIDescription,
    isSupported,
    contourPoints,
    visible: true
  };
  _setROIContourDataColor(ROIContour, ROIContourData);
  if (RTROIObservationsSequence) {
    // If present, add additional RTROIObservations metadata.
    _setROIContourRTROIObservations(ROIContourData, RTROIObservationsSequence, ROIContour.ReferencedROINumber);
  }
  structureSet.ROIContours.push(ROIContourData);
}
function _setROIContourDataColor(ROIContour, ROIContourData) {
  let {
    ROIDisplayColor,
    RecommendedDisplayCIELabValue
  } = ROIContour;
  if (!ROIDisplayColor && RecommendedDisplayCIELabValue) {
    // If ROIDisplayColor is absent, try using the RecommendedDisplayCIELabValue color.
    ROIDisplayColor = dicomlab2RGB(RecommendedDisplayCIELabValue);
  }
  if (ROIDisplayColor) {
    ROIContourData.colorArray = [...ROIDisplayColor];
  }
}
function _setROIContourRTROIObservations(ROIContourData, RTROIObservationsSequence, ROINumber) {
  const RTROIObservations = RTROIObservationsSequence.find(RTROIObservations => RTROIObservations.ReferencedROINumber === ROINumber);
  if (RTROIObservations) {
    // Deep copy so we don't keep the reference to the dcmjs dataset entry.
    const {
      ObservationNumber,
      ROIObservationDescription,
      RTROIInterpretedType,
      ROIInterpreter
    } = RTROIObservations;
    ROIContourData.RTROIObservations = {
      ObservationNumber,
      ROIObservationDescription,
      RTROIInterpretedType,
      ROIInterpreter
    };
  }
}
function _toArray(objOrArray) {
  return Array.isArray(objOrArray) ? objOrArray : [objOrArray];
}
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-rt/src/getSopClassHandlerModule.ts



const sopClassUids = ['1.2.840.10008.5.1.4.1.1.481.3'];
const loadPromises = {};
function _getDisplaySetsFromSeries(instances, servicesManager, extensionManager) {
  const instance = instances[0];
  const {
    StudyInstanceUID,
    SeriesInstanceUID,
    SOPInstanceUID,
    SeriesDescription,
    SeriesNumber,
    SeriesDate,
    SOPClassUID,
    wadoRoot,
    wadoUri,
    wadoUriRoot
  } = instance;
  const displaySet = {
    Modality: 'RTSTRUCT',
    loading: false,
    isReconstructable: false,
    // by default for now since it is a volumetric SEG currently
    displaySetInstanceUID: src.utils.guid(),
    SeriesDescription,
    SeriesNumber,
    SeriesDate,
    SOPInstanceUID,
    SeriesInstanceUID,
    StudyInstanceUID,
    SOPClassHandlerId: SOPClassHandlerId,
    SOPClassUID,
    referencedImages: null,
    referencedSeriesInstanceUID: null,
    referencedDisplaySetInstanceUID: null,
    isDerivedDisplaySet: true,
    isLoaded: false,
    isHydrated: false,
    structureSet: null,
    sopClassUids,
    instance,
    wadoRoot,
    wadoUriRoot,
    wadoUri,
    isOverlayDisplaySet: true
  };
  let referencedSeriesSequence = instance.ReferencedSeriesSequence;
  if (instance.ReferencedFrameOfReferenceSequence && !instance.ReferencedSeriesSequence) {
    instance.ReferencedSeriesSequence = _deriveReferencedSeriesSequenceFromFrameOfReferenceSequence(instance.ReferencedFrameOfReferenceSequence);
    referencedSeriesSequence = instance.ReferencedSeriesSequence;
  }
  if (!referencedSeriesSequence) {
    throw new Error('ReferencedSeriesSequence is missing for the RTSTRUCT');
  }
  const referencedSeries = referencedSeriesSequence[0];
  displaySet.referencedImages = instance.ReferencedSeriesSequence.ReferencedInstanceSequence;
  displaySet.referencedSeriesInstanceUID = referencedSeries.SeriesInstanceUID;
  const {
    displaySetService
  } = servicesManager.services;
  const referencedDisplaySets = displaySetService.getDisplaySetsForSeries(displaySet.referencedSeriesInstanceUID);
  if (!referencedDisplaySets || referencedDisplaySets.length === 0) {
    // Instead of throwing error, subscribe to display sets added
    const {
      unsubscribe
    } = displaySetService.subscribe(displaySetService.EVENTS.DISPLAY_SETS_ADDED, ({
      displaySetsAdded
    }) => {
      const addedDisplaySet = displaySetsAdded[0];
      if (addedDisplaySet.SeriesInstanceUID === displaySet.referencedSeriesInstanceUID) {
        displaySet.referencedDisplaySetInstanceUID = addedDisplaySet.displaySetInstanceUID;
        unsubscribe();
      }
    });
  } else {
    const referencedDisplaySet = referencedDisplaySets[0];
    displaySet.referencedDisplaySetInstanceUID = referencedDisplaySet.displaySetInstanceUID;
  }
  displaySet.load = ({
    headers
  }) => _load(displaySet, servicesManager, extensionManager, headers);
  return [displaySet];
}
function _load(rtDisplaySet, servicesManager, extensionManager, headers) {
  const {
    SOPInstanceUID
  } = rtDisplaySet;
  const {
    segmentationService
  } = servicesManager.services;
  if ((rtDisplaySet.loading || rtDisplaySet.isLoaded) && loadPromises[SOPInstanceUID] && _segmentationExistsInCache(rtDisplaySet, segmentationService)) {
    return loadPromises[SOPInstanceUID];
  }
  rtDisplaySet.loading = true;

  // We don't want to fire multiple loads, so we'll wait for the first to finish
  // and also return the same promise to any other callers.
  loadPromises[SOPInstanceUID] = new Promise(async (resolve, reject) => {
    if (!rtDisplaySet.structureSet) {
      const structureSet = await loadRTStruct(extensionManager, rtDisplaySet, headers);
      rtDisplaySet.structureSet = structureSet;
    }
    segmentationService.createSegmentationForRTDisplaySet(rtDisplaySet).then(() => {
      rtDisplaySet.loading = false;
      resolve();
    }).catch(error => {
      rtDisplaySet.loading = false;
      reject(error);
    });
  });
  return loadPromises[SOPInstanceUID];
}
function _deriveReferencedSeriesSequenceFromFrameOfReferenceSequence(ReferencedFrameOfReferenceSequence) {
  const ReferencedSeriesSequence = [];
  ReferencedFrameOfReferenceSequence.forEach(referencedFrameOfReference => {
    const {
      RTReferencedStudySequence
    } = referencedFrameOfReference;
    RTReferencedStudySequence.forEach(rtReferencedStudy => {
      const {
        RTReferencedSeriesSequence
      } = rtReferencedStudy;
      RTReferencedSeriesSequence.forEach(rtReferencedSeries => {
        const ReferencedInstanceSequence = [];
        const {
          ContourImageSequence,
          SeriesInstanceUID
        } = rtReferencedSeries;
        ContourImageSequence.forEach(contourImage => {
          ReferencedInstanceSequence.push({
            ReferencedSOPInstanceUID: contourImage.ReferencedSOPInstanceUID,
            ReferencedSOPClassUID: contourImage.ReferencedSOPClassUID
          });
        });
        const referencedSeries = {
          SeriesInstanceUID,
          ReferencedInstanceSequence
        };
        ReferencedSeriesSequence.push(referencedSeries);
      });
    });
  });
  return ReferencedSeriesSequence;
}
function _segmentationExistsInCache(rtDisplaySet, segmentationService) {
  // Todo: fix this
  return false;
  // This should be abstracted with the CornerstoneCacheService
  const rtContourId = rtDisplaySet.displaySetInstanceUID;
  const contour = segmentationService.getContour(rtContourId);
  return contour !== undefined;
}
function getSopClassHandlerModule({
  servicesManager,
  extensionManager
}) {
  return [{
    name: 'dicom-rt',
    sopClassUids,
    getDisplaySetsFromSeries: instances => {
      return _getDisplaySetsFromSeries(instances, servicesManager, extensionManager);
    }
  }];
}
/* harmony default export */ const src_getSopClassHandlerModule = (getSopClassHandlerModule);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js + 2 modules
var enums = __webpack_require__(99737);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-rt/src/getCommandsModule.ts

const commandsModule = ({
  commandsManager,
  servicesManager
}) => {
  const services = servicesManager.services;
  const {
    displaySetService,
    viewportGridService
  } = services;
  const actions = {
    hydrateRTSDisplaySet: ({
      displaySet,
      viewportId
    }) => {
      if (displaySet.Modality !== 'RTSTRUCT') {
        throw new Error('Display set is not an RTSTRUCT');
      }
      const referencedDisplaySet = displaySetService.getDisplaySetByUID(displaySet.referencedDisplaySetInstanceUID);

      // update the previously stored segmentationPresentation with the new viewportId
      // presentation so that when we put the referencedDisplaySet back in the viewport
      // it will have the correct segmentation representation hydrated
      commandsManager.runCommand('updateStoredSegmentationPresentation', {
        displaySet: displaySet,
        type: enums.SegmentationRepresentations.Contour
      });

      // update the previously stored positionPresentation with the new viewportId
      // presentation so that when we put the referencedDisplaySet back in the viewport
      // it will be in the correct position zoom and pan
      commandsManager.runCommand('updateStoredPositionPresentation', {
        viewportId,
        displaySetInstanceUID: referencedDisplaySet.displaySetInstanceUID
      });
      viewportGridService.setDisplaySetsForViewport({
        viewportId,
        displaySetInstanceUIDs: [referencedDisplaySet.displaySetInstanceUID]
      });
    }
  };
  const definitions = {
    hydrateRTSDisplaySet: {
      commandFn: actions.hydrateRTSDisplaySet,
      storeContexts: [],
      options: {}
    }
  };
  return {
    actions,
    definitions,
    defaultContext: 'cornerstone-dicom-rt'
  };
};
/* harmony default export */ const getCommandsModule = (commandsModule);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-rt/src/index.tsx
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }




const Component = /*#__PURE__*/react.lazy(() => {
  return Promise.all(/* import() */[__webpack_require__.e(2914), __webpack_require__.e(7739), __webpack_require__.e(3075), __webpack_require__.e(9977), __webpack_require__.e(7412), __webpack_require__.e(4613), __webpack_require__.e(8185), __webpack_require__.e(4822), __webpack_require__.e(2283), __webpack_require__.e(9890)]).then(__webpack_require__.bind(__webpack_require__, 23121));
});
const OHIFCornerstoneRTViewport = props => {
  return /*#__PURE__*/react.createElement(react.Suspense, {
    fallback: /*#__PURE__*/react.createElement("div", null, "Loading...")
  }, /*#__PURE__*/react.createElement(Component, props));
};

/**
 * You can remove any of the following modules if you don't need them.
 */
const extension = {
  /**
   * Only required property. Should be a unique value across all extensions.
   * You ID can be anything you want, but it should be unique.
   */
  id: id,
  getCommandsModule: getCommandsModule,
  /**
   * PanelModule should provide a list of panels that will be available in OHIF
   * for Modes to consume and render. Each panel is defined by a {name,
   * iconName, iconLabel, label, component} object. Example of a panel module
   * is the StudyBrowserPanel that is provided by the default extension in OHIF.
   */
  getViewportModule({
    servicesManager,
    extensionManager,
    commandsManager
  }) {
    const ExtendedOHIFCornerstoneRTViewport = props => {
      return /*#__PURE__*/react.createElement(OHIFCornerstoneRTViewport, _extends({
        servicesManager: servicesManager,
        extensionManager: extensionManager,
        commandsManager: commandsManager
      }, props));
    };
    return [{
      name: 'dicom-rt',
      component: ExtendedOHIFCornerstoneRTViewport
    }];
  },
  /**
   * SopClassHandlerModule should provide a list of sop class handlers that will be
   * available in OHIF for Modes to consume and use to create displaySets from Series.
   * Each sop class handler is defined by a { name, sopClassUids, getDisplaySetsFromSeries}.
   * Examples include the default sop class handler provided by the default extension
   */
  getSopClassHandlerModule: src_getSopClassHandlerModule
};
/* harmony default export */ const cornerstone_dicom_rt_src = (extension);

/***/ })

}]);