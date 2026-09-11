"use strict";
(globalThis["rspackChunk"] = globalThis["rspackChunk"] || []).push([[3500], {
87479(__unused_rspack_module, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ cornerstone_dicom_rt_src)
});

;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-rt/package.json
var package_namespaceObject = JSON.parse('{"UU":"@ohif/extension-cornerstone-dicom-rt"}')
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-rt/src/id.js

const id = package_namespaceObject.UU;
const SOPClassHandlerName = 'dicom-rt';
const SOPClassHandlerId = `${id}.sopClassHandlerModule.${SOPClassHandlerName}`;

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../core/src/index.ts + 75 modules
var src = __webpack_require__(50679);
// EXTERNAL MODULE: ../../i18n/src/index.js + 289 modules
var i18n_src = __webpack_require__(78919);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/index.js
var esm = __webpack_require__(55526);
// EXTERNAL MODULE: ../../../node_modules/dcmjs/build/dcmjs.es.js
var dcmjs_es = __webpack_require__(5842);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-rt/src/loadRTStruct.js

const {
  DicomMessage,
  DicomMetaDictionary
} = dcmjs_es/* ["default"].data */.Ay.data;
const dicomlab2RGB = dcmjs_es/* ["default"].data.Colors.dicomlab2RGB */.Ay.data.Colors.dicomlab2RGB;

/**
 * Checks and loads contour data for RT Structure Set, handling both inline and bulk data URIs.
 * Processes ROIContourSequence to extract contour data and resolve any bulk data references.
 *
 * @async
 * @function checkAndLoadContourData
 * @param {Object} params - Parameters object
 * @param {Object} params.instance - Initial RT Structure instance
 * @param {Object} params.dataSource - Data source for retrieving bulk data
 * @param {Object} params.extensionManager - OHIF extension manager
 * @param {Object} params.rtStructDisplaySet - RT Structure display set
 * @param {Object} params.headers - HTTP headers for requests
 * @returns {Promise<Object>} Promise that resolves to the processed RT Structure instance with loaded contour data
 * @throws {Promise<string>} Rejects with error message if instance is invalid or data retrieval fails
 */
async function checkAndLoadContourData({
  instance: initialInstance,
  dataSource,
  extensionManager,
  rtStructDisplaySet,
  headers
}) {
  let instance = initialInstance;
  if (!instance || !instance.ROIContourSequence) {
    instance = await getRTStructInstance({
      extensionManager,
      rtStructDisplaySet,
      headers
    });
    if (!instance || !instance.ROIContourSequence) {
      return Promise.reject('Invalid instance object or ROIContourSequence');
    }
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
        if (!dataSource || !dataSource.retrieve || !dataSource.retrieve.bulkDataURI) {
          return Promise.reject('Invalid dataSource object or retrieve function');
        }
        const bulkDataPromise = dataSource.retrieve.bulkDataURI({
          BulkDataURI: bulkDataURI,
          StudyInstanceUID: instance.StudyInstanceUID,
          SeriesInstanceUID: instance.SeriesInstanceUID,
          SOPInstanceUID: instance.SOPInstanceUID
        });
        promisesMap.has(referencedROINumber) ? promisesMap.get(referencedROINumber).push(bulkDataPromise) : promisesMap.set(referencedROINumber, [bulkDataPromise]);
      } else if (contourData && contourData.InlineBinary) {
        // Contour data is still in binary format, conversion needed
        const base64String = contourData.InlineBinary;
        const decodedText = atob(base64String);
        const rawValues = decodedText.split('\\');
        const result = [];

        // Ensure strictly that we have a full set of 3 coordinates
        if (rawValues.length % 3 !== 0) {
          return Promise.reject('ContourData raw values not divisible by 3');
        }
        for (let i = 0; i < rawValues.length; i += 3) {
          if (i + 2 < rawValues.length) {
            const x = parseFloat(rawValues[i]);
            const y = parseFloat(rawValues[i + 1]);
            const z = parseFloat(rawValues[i + 2]);

            // Only push if all three are valid numbers (filters out trailing empty splits)
            if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
              result.push(x);
              result.push(y);
              result.push(z);
            } else {
              return Promise.reject('Error parsing contourData from InlineBinary format');
            }
          }
        }
        promisesMap.has(referencedROINumber) ? promisesMap.get(referencedROINumber).push(result) : promisesMap.set(referencedROINumber, [result]);
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
            if (Array.isArray(promise.value) && promise.value.every(it => Number.isFinite(Number(it)))) {
              // If promise.value is already an array of numbers, use it directly
              Contour.ContourData = promise.value.map(Number);
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
  return instance;
}

/**
 * Retrieves and parses RT Structure Set instance from DICOM data.
 * Uses the cornerstone utility module to load DICOM data and converts it to a naturalized dataset.
 *
 * @async
 * @function getRTStructInstance
 * @param {Object} params - Parameters object
 * @param {Object} params.extensionManager - OHIF extension manager
 * @param {Object} params.rtStructDisplaySet - RT Structure display set
 * @param {Object} params.headers - HTTP headers for requests
 * @returns {Promise<Object>} Promise that resolves to the parsed RT Structure dataset
 */
const getRTStructInstance = async ({
  extensionManager,
  rtStructDisplaySet,
  headers
}) => {
  const utilityModule = extensionManager.getModuleEntry('@ohif/extension-cornerstone.utilityModule.common');
  const {
    dicomLoaderService
  } = utilityModule.exports;
  const segArrayBuffer = await dicomLoaderService.findDicomDataPromise(rtStructDisplaySet, null, headers);
  const dicomData = DicomMessage.readFile(segArrayBuffer);
  const rtStructDataset = DicomMetaDictionary.naturalizeDataset(dicomData.dict);
  rtStructDataset._meta = DicomMetaDictionary.namifyDataset(dicomData.meta);
  return rtStructDataset;
};

/**
 * Main function to load and process RT Structure Set data.
 * Creates a structure set object with ROI contours, metadata, and visualization properties.
 * Handles both bulk data URI and inline contour data scenarios.
 *
 * @async
 * @function loadRTStruct
 * @param {Object} extensionManager - OHIF extension manager
 * @param {Object} rtStructDisplaySet - RT Structure display set to process
 * @param {Object} headers - HTTP headers for data requests
 * @returns {Promise<Object>} Promise that resolves to a structure set object containing:
 *   - StructureSetLabel: Label of the structure set
 *   - SeriesInstanceUID: Series instance UID
 *   - ROIContours: Array of ROI contour data with points and metadata
 *   - visible: Visibility state
 *   - ReferencedSOPInstanceUIDsSet: Set of referenced SOP instance UIDs
 */
async function loadRTStruct(extensionManager, rtStructDisplaySet, headers) {
  const dataSource = extensionManager.getActiveDataSource()[0];
  const {
    bulkDataURI
  } = dataSource.getConfig?.() || {};

  // Set here is loading is asynchronous.
  // If this function throws its set back to false.
  rtStructDisplaySet.isLoaded = true;
  let instance = rtStructDisplaySet.instance;
  if (!bulkDataURI || !bulkDataURI.enabled) {
    instance = await getRTStructInstance({
      extensionManager,
      rtStructDisplaySet,
      headers
    });
  } else {
    instance = await checkAndLoadContourData({
      instance,
      dataSource,
      extensionManager,
      rtStructDisplaySet,
      headers
    });
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
    const ContourSequenceArray = _toArray(ContourSequence);
    const contourPoints = [];
    for (const ContourSequenceItem of ContourSequenceArray) {
      const {
        ContourData,
        NumberOfContourPoints,
        ContourGeometricType,
        ContourImageSequence
      } = ContourSequenceItem;
      const points = [];
      for (let p = 0; p < NumberOfContourPoints * 3; p += 3) {
        points.push({
          x: ContourData[p],
          y: ContourData[p + 1],
          z: ContourData[p + 2]
        });
      }
      const supportedContourTypesMap = new Map([['CLOSED_PLANAR', false], ['OPEN_NONPLANAR', false], ['OPEN_PLANAR', false], ['POINT', true]]);
      contourPoints.push({
        numberOfPoints: NumberOfContourPoints,
        points,
        type: ContourGeometricType,
        isSupported: supportedContourTypesMap.get(ContourGeometricType) ?? false
      });
      if (ContourImageSequence?.ReferencedSOPInstanceUID) {
        structureSet.ReferencedSOPInstanceUIDsSet.add(ContourImageSequence?.ReferencedSOPInstanceUID);
      }
    }
    _setROIContourMetadata(structureSet, StructureSetROISequence, RTROIObservationsSequence, ROIContour, contourPoints);
  }
  return structureSet;
}

/**
 * Sets metadata for ROI contour data and adds it to the structure set.
 * Extracts ROI information from StructureSetROISequence and RTROIObservationsSequence,
 * then creates a complete ROI contour data object with visualization properties.
 *
 * @function _setROIContourMetadata
 * @param {Object} structureSet - The structure set object to add ROI contour to
 * @param {Array} StructureSetROISequence - Array of structure set ROI definitions
 * @param {Array} RTROIObservationsSequence - Array of RT ROI observations
 * @param {Object} ROIContour - ROI contour object containing contour data
 * @param {Array} contourPoints - Array of processed contour points
 */
function _setROIContourMetadata(structureSet, StructureSetROISequence, RTROIObservationsSequence, ROIContour, contourPoints) {
  const StructureSetROI = StructureSetROISequence.find(structureSetROI => structureSetROI.ROINumber === ROIContour.ReferencedROINumber);
  const ROIContourData = {
    ROINumber: StructureSetROI.ROINumber,
    ROIName: StructureSetROI.ROIName,
    ROIGenerationAlgorithm: StructureSetROI.ROIGenerationAlgorithm,
    ROIDescription: StructureSetROI.ROIDescription,
    contourPoints,
    visible: true,
    colorArray: []
  };
  _setROIContourDataColor(ROIContour, ROIContourData);
  if (RTROIObservationsSequence) {
    // If present, add additional RTROIObservations metadata.
    _setROIContourRTROIObservations(ROIContourData, RTROIObservationsSequence, ROIContour.ReferencedROINumber);
  }
  structureSet.ROIContours.push(ROIContourData);
}

/**
 * Sets the display color for ROI contour data.
 * Uses ROIDisplayColor if available, otherwise converts RecommendedDisplayCIELabValue to RGB.
 *
 * @function _setROIContourDataColor
 * @param {Object} ROIContour - ROI contour object containing color information
 * @param {Object} ROIContourData - ROI contour data object to set color on
 */
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

/**
 * Sets RT ROI observations metadata for ROI contour data.
 * Finds matching RTROIObservations by ROINumber and adds observation details to contour data.
 *
 * @function _setROIContourRTROIObservations
 * @param {Object} ROIContourData - ROI contour data object to add observations to
 * @param {Array} RTROIObservationsSequence - Array of RT ROI observations
 * @param {number} ROINumber - ROI number to match observations
 */
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

/**
 * Converts a single object or array to an array.
 * Utility function to ensure consistent array handling for DICOM sequences.
 *
 * @function _toArray
 * @param {*} objOrArray - Object or array to convert
 * @returns {Array} Array containing the input (if already array) or wrapped in array
 */
function _toArray(objOrArray) {
  return Array.isArray(objOrArray) ? objOrArray : [objOrArray];
}
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-rt/src/getSopClassHandlerModule.ts





const {
  sopClassDictionary
} = src/* .utils */.Wp;
const sopClassUids = [sopClassDictionary.RTStructureSetStorage];
const loadPromises = {};
function _getDisplaySetsFromSeries(instances, servicesManager, extensionManager) {
  src/* .utils.sortStudyInstances */.Wp.sortStudyInstances(instances);
  // Choose the LAST instance in the list as the most recently created one.
  const instance = instances[instances.length - 1];
  const {
    StudyInstanceUID,
    SeriesInstanceUID,
    SOPInstanceUID,
    SeriesDescription = '',
    SeriesNumber,
    SeriesDate,
    SeriesTime,
    StructureSetDate,
    StructureSetTime,
    SOPClassUID,
    wadoRoot,
    wadoUri,
    wadoUriRoot,
    imageId: predecessorImageId
  } = instance;
  const displaySet = {
    Modality: 'RTSTRUCT',
    loading: false,
    isReconstructable: false,
    displaySetInstanceUID: src/* .utils.guid */.Wp.guid(),
    SeriesDescription,
    SeriesNumber,
    /**
     * The "SeriesDate" for a display set is really the display set date, which
     * should be the date of the instance being used, which will be the structure
     * set date in this case.
     */
    SeriesDate: StructureSetDate || SeriesDate,
    SeriesTime: StructureSetTime || SeriesTime,
    SOPInstanceUID,
    SeriesInstanceUID,
    StudyInstanceUID,
    SOPClassHandlerId: SOPClassHandlerId,
    SOPClassUID,
    FrameOfReferenceUID: null,
    referencedImages: null,
    referencedSeriesInstanceUID: null,
    referencedDisplaySetInstanceUID: null,
    isDerivedDisplaySet: true,
    isLoaded: false,
    isHydrated: false,
    structureSet: null,
    sopClassUids,
    instance,
    instances,
    predecessorImageId,
    wadoRoot,
    wadoUriRoot,
    wadoUri,
    isOverlayDisplaySet: true,
    label: SeriesDescription || `${i18n_src/* ["default"].t */.A.t('Series')} ${SeriesNumber} - ${i18n_src/* ["default"].t */.A.t('RTSTRUCT')}`
  };
  let referencedSeriesSequence = instance.ReferencedSeriesSequence;
  if (instance.ReferencedFrameOfReferenceSequence?.RTReferencedStudySequence && !instance.ReferencedSeriesSequence) {
    instance.ReferencedSeriesSequence = _deriveReferencedSeriesSequenceFromFrameOfReferenceSequence(instance.ReferencedFrameOfReferenceSequence);
    referencedSeriesSequence = instance.ReferencedSeriesSequence;
  }
  if (!referencedSeriesSequence) {
    console.error('ReferencedSeriesSequence is missing for the RTSTRUCT');
    return;
  }
  const referencedSeries = referencedSeriesSequence[0];
  displaySet.referencedImages = instance.ReferencedSeriesSequence.ReferencedInstanceSequence;
  displaySet.referencedSeriesInstanceUID = referencedSeries.SeriesInstanceUID;
  displaySet.FrameOfReferenceUID = instance.ReferencedFrameOfReferenceSequence?.[0]?.FrameOfReferenceUID;
  const {
    displaySetService
  } = servicesManager.services;
  const referencedDisplaySets = displaySetService.getDisplaySetsForReferences(referencedSeriesSequence);
  if (referencedDisplaySets?.length > 1) {
    console.warn('Reference applies to more than 1 display set for Contours, applying only to first display set');
  }
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
        displaySet.isReconstructable = addedDisplaySet.isReconstructable;
        displaySet.FrameOfReferenceUID = addedDisplaySet.FrameOfReferenceUID;
        unsubscribe();
      }
    });
  } else {
    const [referencedDisplaySet] = referencedDisplaySets;
    displaySet.referencedDisplaySetInstanceUID = referencedDisplaySet.displaySetInstanceUID;
    displaySet.isReconstructable = referencedDisplaySet.isReconstructable;
    displaySet.FrameOfReferenceUID = referencedDisplaySet.FrameOfReferenceUID;
  }
  displaySet.load = ({
    headers,
    createSegmentation = true
  }) => _load(displaySet, servicesManager, extensionManager, headers, createSegmentation);
  return [displaySet];
}
function _load(rtDisplaySet, servicesManager, extensionManager, headers, createSegmentation = true) {
  const {
    SOPInstanceUID
  } = rtDisplaySet;
  const {
    segmentationService
  } = servicesManager.services;
  if ((rtDisplaySet.loading || rtDisplaySet.isLoaded) && loadPromises[SOPInstanceUID] && _segmentationExists(rtDisplaySet)) {
    return loadPromises[SOPInstanceUID];
  }
  rtDisplaySet.loading = true;

  // We don't want to fire multiple loads, so we'll wait for the first to finish
  // and also return the same promise to any other callers.
  loadPromises[SOPInstanceUID] = new Promise(async (resolve, reject) => {
    try {
      if (!rtDisplaySet.structureSet) {
        const structureSet = await loadRTStruct(extensionManager, rtDisplaySet, headers);
        rtDisplaySet.structureSet = structureSet;
      }
      if (createSegmentation) {
        await segmentationService.createSegmentationForRTDisplaySet(rtDisplaySet);
      }
      resolve();
    } catch (error) {
      reject(error);
    } finally {
      rtDisplaySet.loading = false;
    }
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
function _segmentationExists(segDisplaySet) {
  return !!esm.segmentation.state.getSegmentation(segDisplaySet.displaySetInstanceUID);
}
function getSopClassHandlerModule(params) {
  const {
    servicesManager,
    extensionManager
  } = params;
  return [{
    name: 'dicom-rt',
    sopClassUids,
    getDisplaySetsFromSeries: instances => {
      return _getDisplaySetsFromSeries(instances, servicesManager, extensionManager);
    }
  }];
}
/* export default */ const src_getSopClassHandlerModule = (getSopClassHandlerModule);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js + 3 modules
var enums = __webpack_require__(53870);
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
        displaySetInstanceUIDs: [referencedDisplaySet.displaySetInstanceUID]
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
/* export default */ const getCommandsModule = (commandsModule);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-rt/src/index.tsx
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }




const Component = /*#__PURE__*/react.lazy(() => {
  return Promise.all(/* import() */ [__webpack_require__.e(5537), __webpack_require__.e(3930), __webpack_require__.e(4730), __webpack_require__.e(9015), __webpack_require__.e(5910)]).then(__webpack_require__.bind(__webpack_require__, 67329));
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
/* export default */ const cornerstone_dicom_rt_src = (extension);

},

}]);