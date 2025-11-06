"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[4113],{

/***/ 74137:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ay: () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   bY: () => (/* binding */ CodingSchemeDesignators),
/* harmony export */   n7: () => (/* binding */ CodeNameCodeSequenceValues),
/* harmony export */   sh: () => (/* binding */ SCOORDTypes)
/* harmony export */ });
/* unused harmony export RelationshipType */
/* harmony import */ var _cornerstonejs_adapters__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(93468);

const {
  CodeScheme: Cornerstone3DCodeScheme
} = _cornerstonejs_adapters__WEBPACK_IMPORTED_MODULE_0__/* .adaptersSR */ .QX.Cornerstone3D;
const SCOORDTypes = {
  POINT: 'POINT',
  MULTIPOINT: 'MULTIPOINT',
  POLYLINE: 'POLYLINE',
  CIRCLE: 'CIRCLE',
  ELLIPSE: 'ELLIPSE'
};
const CodeNameCodeSequenceValues = {
  ImagingMeasurementReport: '126000',
  ImageLibrary: '111028',
  ImagingMeasurements: '126010',
  MeasurementGroup: '125007',
  ImageLibraryGroup: '126200',
  TrackingUniqueIdentifier: '112040',
  TrackingIdentifier: '112039',
  Finding: '121071',
  FindingSite: 'G-C0E3',
  // SRT
  FindingSiteSCT: '363698007' // SCT
};
const CodingSchemeDesignators = {
  SRT: 'SRT',
  SCT: 'SCT',
  CornerstoneCodeSchemes: [Cornerstone3DCodeScheme.CodingSchemeDesignator, 'CST4']
};
const RelationshipType = {
  INFERRED_FROM: 'INFERRED FROM',
  CONTAINS: 'CONTAINS'
};
const enums = {
  CodeNameCodeSequenceValues,
  CodingSchemeDesignators,
  RelationshipType,
  SCOORDTypes
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (enums);

/***/ }),

/***/ 34113:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Enums: () => (/* reexport */ enums/* default */.Ay),
  createReferencedImageDisplaySet: () => (/* reexport */ createReferencedImageDisplaySet/* default */.A),
  "default": () => (/* binding */ cornerstone_dicom_sr_src),
  hydrateStructuredReport: () => (/* reexport */ hydrateStructuredReport),
  srProtocol: () => (/* reexport */ srProtocol),
  toolNames: () => (/* reexport */ tools_toolNames)
});

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../core/src/index.ts + 69 modules
var src = __webpack_require__(62037);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/index.tsx + 136 modules
var cornerstone_src = __webpack_require__(72283);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/index.js + 65 modules
var esm = __webpack_require__(93468);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/index.js
var dist_esm = __webpack_require__(4667);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var core_dist_esm = __webpack_require__(15327);
// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/index.js + 1 modules
var gl_matrix_esm = __webpack_require__(3823);
// EXTERNAL MODULE: ../../../extensions/cornerstone-dicom-sr/src/enums.ts
var enums = __webpack_require__(74137);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-sr/src/utils/getRenderableData.ts



const EPSILON = 1e-4;
const getRenderableCoords = ({
  GraphicData,
  ValueType,
  imageId
}) => {
  const renderableData = [];
  if (ValueType === 'SCOORD3D') {
    for (let i = 0; i < GraphicData.length; i += 3) {
      renderableData.push([GraphicData[i], GraphicData[i + 1], GraphicData[i + 2]]);
    }
  } else {
    for (let i = 0; i < GraphicData.length; i += 2) {
      const worldPos = core_dist_esm.utilities.imageToWorldCoords(imageId, [GraphicData[i], GraphicData[i + 1]]);
      renderableData.push(worldPos);
    }
  }
  return renderableData;
};
function getRenderableData({
  GraphicType,
  GraphicData,
  ValueType,
  imageId
}) {
  let renderableData = [];
  switch (GraphicType) {
    case enums/* SCOORDTypes */.sh.POINT:
    case enums/* SCOORDTypes */.sh.MULTIPOINT:
    case enums/* SCOORDTypes */.sh.POLYLINE:
      {
        renderableData = getRenderableCoords({
          GraphicData,
          ValueType,
          imageId
        });
        break;
      }
    case enums/* SCOORDTypes */.sh.CIRCLE:
      {
        const pointsWorld = getRenderableCoords({
          GraphicData,
          ValueType,
          imageId
        });
        // We do not have an explicit draw circle svg helper in Cornerstone3D at
        // this time, but we can use the ellipse svg helper to draw a circle, so
        // here we reshape the data for that purpose.
        const center = pointsWorld[0];
        const onPerimeter = pointsWorld[1];
        const radius = gl_matrix_esm/* vec3.distance */.eR.distance(center, onPerimeter);
        const imagePlaneModule = core_dist_esm.metaData.get('imagePlaneModule', imageId);
        if (!imagePlaneModule) {
          throw new Error('No imagePlaneModule found');
        }
        const {
          columnCosines,
          rowCosines
        } = imagePlaneModule;

        // we need to get major/minor axis (which are both the same size major = minor)

        const firstAxisStart = gl_matrix_esm/* vec3.create */.eR.create();
        gl_matrix_esm/* vec3.scaleAndAdd */.eR.scaleAndAdd(firstAxisStart, center, columnCosines, radius);
        const firstAxisEnd = gl_matrix_esm/* vec3.create */.eR.create();
        gl_matrix_esm/* vec3.scaleAndAdd */.eR.scaleAndAdd(firstAxisEnd, center, columnCosines, -radius);
        const secondAxisStart = gl_matrix_esm/* vec3.create */.eR.create();
        gl_matrix_esm/* vec3.scaleAndAdd */.eR.scaleAndAdd(secondAxisStart, center, rowCosines, radius);
        const secondAxisEnd = gl_matrix_esm/* vec3.create */.eR.create();
        gl_matrix_esm/* vec3.scaleAndAdd */.eR.scaleAndAdd(secondAxisEnd, center, rowCosines, -radius);
        renderableData = [firstAxisStart, firstAxisEnd, secondAxisStart, secondAxisEnd];
        break;
      }
    case enums/* SCOORDTypes */.sh.ELLIPSE:
      {
        // GraphicData is ordered as [majorAxisStartX, majorAxisStartY, majorAxisEndX, majorAxisEndY, minorAxisStartX, minorAxisStartY, minorAxisEndX, minorAxisEndY]
        // But Cornerstone3D points are ordered as top, bottom, left, right for the
        // ellipse so we need to identify if the majorAxis is horizontal or vertical
        // and then choose the correct points to use for the ellipse.
        const pointsWorld = getRenderableCoords({
          GraphicData,
          ValueType,
          imageId
        });
        const majorAxisStart = gl_matrix_esm/* vec3.fromValues */.eR.fromValues(...pointsWorld[0]);
        const majorAxisEnd = gl_matrix_esm/* vec3.fromValues */.eR.fromValues(...pointsWorld[1]);
        const minorAxisStart = gl_matrix_esm/* vec3.fromValues */.eR.fromValues(...pointsWorld[2]);
        const minorAxisEnd = gl_matrix_esm/* vec3.fromValues */.eR.fromValues(...pointsWorld[3]);
        const majorAxisVec = gl_matrix_esm/* vec3.create */.eR.create();
        gl_matrix_esm/* vec3.sub */.eR.sub(majorAxisVec, majorAxisEnd, majorAxisStart);

        // normalize majorAxisVec to avoid scaling issues
        gl_matrix_esm/* vec3.normalize */.eR.normalize(majorAxisVec, majorAxisVec);
        const minorAxisVec = gl_matrix_esm/* vec3.create */.eR.create();
        gl_matrix_esm/* vec3.sub */.eR.sub(minorAxisVec, minorAxisEnd, minorAxisStart);
        gl_matrix_esm/* vec3.normalize */.eR.normalize(minorAxisVec, minorAxisVec);
        const imagePlaneModule = core_dist_esm.metaData.get('imagePlaneModule', imageId);
        if (!imagePlaneModule) {
          throw new Error('imageId does not have imagePlaneModule metadata');
        }
        const {
          columnCosines
        } = imagePlaneModule;

        // find which axis is parallel to the columnCosines
        const columnCosinesVec = gl_matrix_esm/* vec3.fromValues */.eR.fromValues(...columnCosines);
        const projectedMajorAxisOnColVec = Math.abs(gl_matrix_esm/* vec3.dot */.eR.dot(columnCosinesVec, majorAxisVec));
        const projectedMinorAxisOnColVec = Math.abs(gl_matrix_esm/* vec3.dot */.eR.dot(columnCosinesVec, minorAxisVec));
        const absoluteOfMajorDotProduct = Math.abs(projectedMajorAxisOnColVec);
        const absoluteOfMinorDotProduct = Math.abs(projectedMinorAxisOnColVec);
        renderableData = [];
        if (Math.abs(absoluteOfMajorDotProduct - 1) < EPSILON) {
          renderableData = [pointsWorld[0], pointsWorld[1], pointsWorld[2], pointsWorld[3]];
        } else if (Math.abs(absoluteOfMinorDotProduct - 1) < EPSILON) {
          renderableData = [pointsWorld[2], pointsWorld[3], pointsWorld[0], pointsWorld[1]];
        } else {
          console.warn('OBLIQUE ELLIPSE NOT YET SUPPORTED');
        }
        break;
      }
    default:
      console.warn('Unsupported GraphicType:', GraphicType);
  }
  return renderableData;
}
/* harmony default export */ const utils_getRenderableData = (getRenderableData);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-sr/src/tools/toolNames.ts
const toolNames = {
  DICOMSRDisplay: 'DICOMSRDisplay',
  SRLength: 'SRLength',
  SRBidirectional: 'SRBidirectional',
  SREllipticalROI: 'SREllipticalROI',
  SRCircleROI: 'SRCircleROI',
  SRArrowAnnotate: 'SRArrowAnnotate',
  SRAngle: 'SRAngle',
  SRCobbAngle: 'SRCobbAngle',
  SRRectangleROI: 'SRRectangleROI',
  SRPlanarFreehandROI: 'SRPlanarFreehandROI',
  SRSCOORD3DPoint: 'SRSCOORD3DPoint'
};
/* harmony default export */ const tools_toolNames = (toolNames);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-sr/src/utils/addSRAnnotation.ts




function addSRAnnotation(measurement, imageId, frameNumber) {
  let toolName = tools_toolNames.DICOMSRDisplay;
  const renderableData = measurement.coords.reduce((acc, coordProps) => {
    acc[coordProps.GraphicType] = acc[coordProps.GraphicType] || [];
    acc[coordProps.GraphicType].push(utils_getRenderableData({
      ...coordProps,
      imageId
    }));
    return acc;
  }, {});
  const {
    TrackingUniqueIdentifier
  } = measurement;
  const {
    ValueType: valueType,
    GraphicType: graphicType
  } = measurement.coords[0];
  const graphicTypePoints = renderableData[graphicType];

  /** TODO: Read the tool name from the DICOM SR identification type in the future. */
  let frameOfReferenceUID = null;
  if (imageId) {
    const imagePlaneModule = core_dist_esm.metaData.get('imagePlaneModule', imageId);
    frameOfReferenceUID = imagePlaneModule?.frameOfReferenceUID;
  }
  if (valueType === 'SCOORD3D') {
    toolName = tools_toolNames.SRSCOORD3DPoint;

    // get the ReferencedFrameOfReferenceUID from the measurement
    frameOfReferenceUID = measurement.coords[0].ReferencedFrameOfReferenceSequence;
  }
  const SRAnnotation = {
    annotationUID: TrackingUniqueIdentifier,
    highlighted: false,
    isLocked: false,
    invalidated: false,
    metadata: {
      toolName,
      valueType,
      graphicType,
      FrameOfReferenceUID: frameOfReferenceUID,
      referencedImageId: imageId
    },
    data: {
      label: measurement.labels?.[0]?.value || undefined,
      displayText: measurement.displayText || undefined,
      handles: {
        textBox: measurement.textBox ?? {},
        points: graphicTypePoints[0]
      },
      cachedStats: {},
      frameNumber,
      renderableData,
      TrackingUniqueIdentifier,
      labels: measurement.labels
    }
  };

  /**
   * const annotationManager = annotation.annotationState.getAnnotationManager();
   * was not triggering annotation_added events.
   */
  dist_esm.annotation.state.addAnnotation(SRAnnotation);
  console.debug('Adding SR annotation:', SRAnnotation);
}
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-sr/src/utils/isRehydratable.ts

const {
  MeasurementReport
} = esm/* adaptersSR */.QX.Cornerstone3D;

/**
 * Checks if the given `displaySet`can be rehydrated into the `measurementService`.
 *
 * @param {object} displaySet The SR `displaySet` to check.
 * @param {object[]} mappings The CornerstoneTools 4 mappings to the `measurementService`.
 * @returns {boolean} True if the SR can be rehydrated into the `measurementService`.
 */
function isRehydratable(displaySet, mappings) {
  if (!mappings || !mappings.length) {
    return false;
  }
  const mappingDefinitions = new Set();
  for (const m of mappings) {
    mappingDefinitions.add(m.annotationType);
  }
  const {
    measurements
  } = displaySet;
  for (let i = 0; i < measurements.length; i++) {
    const {
      TrackingIdentifier
    } = measurements[i] || {};
    if (!TrackingIdentifier) {
      console.warn('No tracking identifier for measurement ', measurements[i]);
      continue;
    }
    const adapter = MeasurementReport.getAdapterForTrackingIdentifier(TrackingIdentifier);
    const hydratable = adapter && mappingDefinitions.has(adapter.toolType);
    if (hydratable) {
      return true;
    }
    console.log('Measurement is not rehydratable', TrackingIdentifier, measurements[i]);
  }
  console.log('No measurements found which were rehydratable');
  return false;
}
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-sr/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/extension-cornerstone-dicom-sr"}');
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-sr/src/id.js

const id = package_namespaceObject.UU;
const SOPClassHandlerName = 'dicom-sr';
const SOPClassHandlerId = `${id}.sopClassHandlerModule.${SOPClassHandlerName}`;
const SOPClassHandlerName3D = 'dicom-sr-3d';
const SOPClassHandlerId3D = `${id}.sopClassHandlerModule.${SOPClassHandlerName3D}`;

;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-sr/src/getSopClassHandlerModule.ts







const {
  sopClassDictionary
} = src.utils;
const {
  CORNERSTONE_3D_TOOLS_SOURCE_NAME,
  CORNERSTONE_3D_TOOLS_SOURCE_VERSION
} = cornerstone_src.Enums;
const {
  ImageSet,
  MetadataProvider: metadataProvider
} = src.classes;
const {
  CodeScheme: Cornerstone3DCodeScheme
} = esm/* adaptersSR */.QX.Cornerstone3D;
/**
 * TODO
 * - [ ] Add SR thumbnail
 * - [ ] Make viewport
 * - [ ] Get stacks from referenced displayInstanceUID and load into wrapped CornerStone viewport
 */

const sopClassUids = [sopClassDictionary.BasicTextSR, sopClassDictionary.EnhancedSR, sopClassDictionary.ComprehensiveSR];
const validateSameStudyUID = (uid, instances) => {
  instances.forEach(it => {
    if (it.StudyInstanceUID !== uid) {
      console.warn('Not all instances have the same UID', uid, it);
      throw new Error(`Instances ${it.SOPInstanceUID} does not belong to ${uid}`);
    }
  });
};

/**
 * Adds instances to the DICOM SR series, rather than creating a new
 * series, so that as SR's are saved, they append to the series, and the
 * key image display set gets updated as well, containing just the new series.
 * @param instances is a list of instances from THIS series that are not
 *     in this DICOM SR Display Set already.
 */
function addInstances(instances, displaySetService) {
  this.instances.push(...instances);
  src.utils.sortStudyInstances(this.instances);
  // The last instance is the newest one, so is the one most interesting.
  // Eventually, the SR viewer should have the ability to choose which SR
  // gets loaded, and to navigate among them.
  this.instance = this.instances[this.instances.length - 1];
  this.isLoaded = false;
  return this;
}

/**
 * DICOM SR SOP Class Handler
 * For all referenced images in the TID 1500/300 sections, add an image to the
 * display.
 * @param instances is a set of instances all from the same series
 * @param servicesManager is the services that can be used for creating
 * @returns The list of display sets created for the given instances object
 */
function _getDisplaySetsFromSeries(instances, servicesManager, extensionManager) {
  // If the series has no instances, stop here
  if (!instances || !instances.length) {
    throw new Error('No instances were provided');
  }
  src.utils.sortStudyInstances(instances);
  // The last instance is the newest one, so is the one most interesting.
  // Eventually, the SR viewer should have the ability to choose which SR
  // gets loaded, and to navigate among them.
  const instance = instances[instances.length - 1];
  const {
    StudyInstanceUID,
    SeriesInstanceUID,
    SOPInstanceUID,
    SeriesDescription,
    SeriesNumber,
    SeriesDate,
    SeriesTime,
    ConceptNameCodeSequence,
    SOPClassUID
  } = instance;
  validateSameStudyUID(instance.StudyInstanceUID, instances);
  const is3DSR = SOPClassUID === sopClassDictionary.Comprehensive3DSR;
  const isImagingMeasurementReport = ConceptNameCodeSequence?.CodeValue === enums/* CodeNameCodeSequenceValues */.n7.ImagingMeasurementReport;
  const displaySet = {
    Modality: 'SR',
    displaySetInstanceUID: src.utils.guid(),
    SeriesDescription,
    SeriesNumber,
    SeriesDate,
    SeriesTime,
    SOPInstanceUID,
    SeriesInstanceUID,
    StudyInstanceUID,
    SOPClassHandlerId: is3DSR ? SOPClassHandlerId3D : SOPClassHandlerId,
    SOPClassUID,
    instances,
    referencedImages: null,
    measurements: null,
    isDerivedDisplaySet: true,
    isLoaded: false,
    isImagingMeasurementReport,
    sopClassUids,
    instance,
    addInstances
  };
  displaySet.load = () => _load(displaySet, servicesManager, extensionManager);
  return [displaySet];
}

/**
 * Loads the display set with the given services and extension manager.
 * @param srDisplaySet - The display set to load.
 * @param servicesManager - The services manager containing displaySetService and measurementService.
 * @param extensionManager - The extension manager containing data sources.
 */
async function _load(srDisplaySet, servicesManager, extensionManager) {
  const {
    displaySetService,
    measurementService
  } = servicesManager.services;
  const dataSources = extensionManager.getDataSources();
  const dataSource = dataSources[0];
  const {
    ContentSequence
  } = srDisplaySet.instance;
  async function retrieveBulkData(obj, parentObj = null, key = null) {
    for (const prop in obj) {
      if (typeof obj[prop] === 'object' && obj[prop] !== null) {
        await retrieveBulkData(obj[prop], obj, prop);
      } else if (Array.isArray(obj[prop])) {
        await Promise.all(obj[prop].map(item => retrieveBulkData(item, obj, prop)));
      } else if (prop === 'BulkDataURI') {
        const value = await dataSource.retrieve.bulkDataURI({
          BulkDataURI: obj[prop],
          StudyInstanceUID: srDisplaySet.instance.StudyInstanceUID,
          SeriesInstanceUID: srDisplaySet.instance.SeriesInstanceUID,
          SOPInstanceUID: srDisplaySet.instance.SOPInstanceUID
        });
        if (parentObj && key) {
          parentObj[key] = new Float32Array(value);
        }
      }
    }
  }
  if (srDisplaySet.isLoaded !== true) {
    await retrieveBulkData(ContentSequence);
  }
  if (srDisplaySet.isImagingMeasurementReport) {
    srDisplaySet.referencedImages = _getReferencedImagesList(ContentSequence);
    srDisplaySet.measurements = _getMeasurements(ContentSequence);
  } else {
    srDisplaySet.referencedImages = [];
    srDisplaySet.measurements = [];
  }
  const mappings = measurementService.getSourceMappings(CORNERSTONE_3D_TOOLS_SOURCE_NAME, CORNERSTONE_3D_TOOLS_SOURCE_VERSION);
  srDisplaySet.isHydrated = false;
  srDisplaySet.isRehydratable = isRehydratable(srDisplaySet, mappings);
  srDisplaySet.isLoaded = true;

  /** Check currently added displaySets and add measurements if the sources exist */
  displaySetService.activeDisplaySets.forEach(activeDisplaySet => {
    _checkIfCanAddMeasurementsToDisplaySet(srDisplaySet, activeDisplaySet, dataSource, servicesManager);
  });

  /** Subscribe to new displaySets as the source may come in after */
  displaySetService.subscribe(displaySetService.EVENTS.DISPLAY_SETS_ADDED, data => {
    const {
      displaySetsAdded
    } = data;
    /**
     * If there are still some measurements that have not yet been loaded into cornerstone,
     * See if we can load them onto any of the new displaySets.
     */
    displaySetsAdded.forEach(newDisplaySet => {
      _checkIfCanAddMeasurementsToDisplaySet(srDisplaySet, newDisplaySet, dataSource, servicesManager);
    });
  });
}

/**
 * Checks if measurements can be added to a display set.
 *
 * @param srDisplaySet - The source display set containing measurements.
 * @param newDisplaySet - The new display set to check if measurements can be added.
 * @param dataSource - The data source used to retrieve image IDs.
 * @param servicesManager - The services manager.
 */
function _checkIfCanAddMeasurementsToDisplaySet(srDisplaySet, newDisplaySet, dataSource, servicesManager) {
  const {
    customizationService
  } = servicesManager.services;
  const unloadedMeasurements = srDisplaySet.measurements.filter(measurement => measurement.loaded === false);
  if (unloadedMeasurements.length === 0 || !(newDisplaySet instanceof ImageSet) || newDisplaySet.unsupported) {
    return;
  }

  // const { sopClassUids } = newDisplaySet;
  // Create a Set for faster lookups
  // const sopClassUidSet = new Set(sopClassUids);

  // Create a Map to efficiently look up ImageIds by SOPInstanceUID and frame number
  const imageIdMap = new Map();
  const imageIds = dataSource.getImageIdsForDisplaySet(newDisplaySet);
  for (const imageId of imageIds) {
    const {
      SOPInstanceUID,
      frameNumber
    } = metadataProvider.getUIDsFromImageID(imageId);
    const key = `${SOPInstanceUID}:${frameNumber || 1}`;
    imageIdMap.set(key, imageId);
  }
  if (!unloadedMeasurements?.length) {
    return;
  }
  const is3DSR = srDisplaySet.SOPClassUID === sopClassDictionary.Comprehensive3DSR;
  for (let j = unloadedMeasurements.length - 1; j >= 0; j--) {
    let measurement = unloadedMeasurements[j];
    const onBeforeSRAddMeasurement = customizationService.getCustomization('onBeforeSRAddMeasurement');
    if (typeof onBeforeSRAddMeasurement === 'function') {
      measurement = onBeforeSRAddMeasurement({
        measurement,
        StudyInstanceUID: srDisplaySet.StudyInstanceUID,
        SeriesInstanceUID: srDisplaySet.SeriesInstanceUID
      });
    }

    // if it is 3d SR we can just add the SR annotation
    if (is3DSR) {
      addSRAnnotation(measurement, null, null);
      measurement.loaded = true;
      continue;
    }
    const referencedSOPSequence = measurement.coords[0].ReferencedSOPSequence;
    if (!referencedSOPSequence) {
      continue;
    }
    const {
      ReferencedSOPInstanceUID
    } = referencedSOPSequence;
    const frame = referencedSOPSequence.ReferencedFrameNumber || 1;
    const key = `${ReferencedSOPInstanceUID}:${frame}`;
    const imageId = imageIdMap.get(key);
    if (imageId && _measurementReferencesSOPInstanceUID(measurement, ReferencedSOPInstanceUID, frame)) {
      addSRAnnotation(measurement, imageId, frame);

      // Update measurement properties
      measurement.loaded = true;
      measurement.imageId = imageId;
      measurement.displaySetInstanceUID = newDisplaySet.displaySetInstanceUID;
      measurement.ReferencedSOPInstanceUID = ReferencedSOPInstanceUID;
      measurement.frameNumber = frame;
      unloadedMeasurements.splice(j, 1);
    }
  }
}

/**
 * Checks if a measurement references a specific SOP Instance UID.
 * @param measurement - The measurement object.
 * @param SOPInstanceUID - The SOP Instance UID to check against.
 * @param frameNumber - The frame number to check against (optional).
 * @returns True if the measurement references the specified SOP Instance UID, false otherwise.
 */
function _measurementReferencesSOPInstanceUID(measurement, SOPInstanceUID, frameNumber) {
  const {
    coords
  } = measurement;

  /**
   * NOTE: The ReferencedFrameNumber can be multiple values according to the DICOM
   * Standard. But for now, we will support only one ReferenceFrameNumber.
   */
  const ReferencedFrameNumber = measurement.coords[0].ReferencedSOPSequence && measurement.coords[0].ReferencedSOPSequence?.ReferencedFrameNumber || 1;
  if (frameNumber && Number(frameNumber) !== Number(ReferencedFrameNumber)) {
    return false;
  }
  for (let j = 0; j < coords.length; j++) {
    const coord = coords[j];
    const {
      ReferencedSOPInstanceUID
    } = coord.ReferencedSOPSequence;
    if (ReferencedSOPInstanceUID === SOPInstanceUID) {
      return true;
    }
  }
  return false;
}

/**
 * Retrieves the SOP class handler module.
 *
 * @param {Object} options - The options for retrieving the SOP class handler module.
 * @param {Object} options.servicesManager - The services manager.
 * @param {Object} options.extensionManager - The extension manager.
 * @returns {Array} An array containing the SOP class handler module.
 */
function getSopClassHandlerModule({
  servicesManager,
  extensionManager
}) {
  const getDisplaySetsFromSeries = instances => {
    return _getDisplaySetsFromSeries(instances, servicesManager, extensionManager);
  };
  return [{
    name: SOPClassHandlerName,
    sopClassUids,
    getDisplaySetsFromSeries
  }, {
    name: SOPClassHandlerName3D,
    sopClassUids: [sopClassDictionary.Comprehensive3DSR],
    getDisplaySetsFromSeries
  }];
}

/**
 * Retrieves the measurements from the ImagingMeasurementReportContentSequence.
 *
 * @param {Array} ImagingMeasurementReportContentSequence - The ImagingMeasurementReportContentSequence array.
 * @returns {Array} - The array of measurements.
 */
function _getMeasurements(ImagingMeasurementReportContentSequence) {
  const ImagingMeasurements = ImagingMeasurementReportContentSequence.find(item => item.ConceptNameCodeSequence.CodeValue === enums/* CodeNameCodeSequenceValues */.n7.ImagingMeasurements);
  if (!ImagingMeasurements) {
    return [];
  }
  const MeasurementGroups = _getSequenceAsArray(ImagingMeasurements.ContentSequence).filter(item => item.ConceptNameCodeSequence.CodeValue === enums/* CodeNameCodeSequenceValues */.n7.MeasurementGroup);
  const mergedContentSequencesByTrackingUniqueIdentifiers = _getMergedContentSequencesByTrackingUniqueIdentifiers(MeasurementGroups);
  const measurements = [];
  Object.keys(mergedContentSequencesByTrackingUniqueIdentifiers).forEach(trackingUniqueIdentifier => {
    const mergedContentSequence = mergedContentSequencesByTrackingUniqueIdentifiers[trackingUniqueIdentifier];
    const measurement = _processMeasurement(mergedContentSequence);
    if (measurement) {
      measurements.push(measurement);
    }
  });
  return measurements;
}

/**
 * Retrieves merged content sequences by tracking unique identifiers.
 *
 * @param {Array} MeasurementGroups - The measurement groups.
 * @returns {Object} - The merged content sequences by tracking unique identifiers.
 */
function _getMergedContentSequencesByTrackingUniqueIdentifiers(MeasurementGroups) {
  const mergedContentSequencesByTrackingUniqueIdentifiers = {};
  MeasurementGroups.forEach(MeasurementGroup => {
    const ContentSequence = _getSequenceAsArray(MeasurementGroup.ContentSequence);
    const TrackingUniqueIdentifierItem = ContentSequence.find(item => item.ConceptNameCodeSequence.CodeValue === enums/* CodeNameCodeSequenceValues */.n7.TrackingUniqueIdentifier);
    if (!TrackingUniqueIdentifierItem) {
      console.warn('No Tracking Unique Identifier, skipping ambiguous measurement.');
    }
    const trackingUniqueIdentifier = TrackingUniqueIdentifierItem.UID;
    if (mergedContentSequencesByTrackingUniqueIdentifiers[trackingUniqueIdentifier] === undefined) {
      // Add the full ContentSequence
      mergedContentSequencesByTrackingUniqueIdentifiers[trackingUniqueIdentifier] = [...ContentSequence];
    } else {
      // Add the ContentSequence minus the tracking identifier, as we have this
      // Information in the merged ContentSequence anyway.
      ContentSequence.forEach(item => {
        if (item.ConceptNameCodeSequence.CodeValue !== enums/* CodeNameCodeSequenceValues */.n7.TrackingUniqueIdentifier) {
          mergedContentSequencesByTrackingUniqueIdentifiers[trackingUniqueIdentifier].push(item);
        }
      });
    }
  });
  return mergedContentSequencesByTrackingUniqueIdentifiers;
}

/**
 * Processes the measurement based on the merged content sequence.
 * If the merged content sequence contains SCOORD or SCOORD3D value types,
 * it calls the _processTID1410Measurement function.
 * Otherwise, it calls the _processNonGeometricallyDefinedMeasurement function.
 *
 * @param {Array<Object>} mergedContentSequence - The merged content sequence to process.
 * @returns {any} - The processed measurement result.
 */
function _processMeasurement(mergedContentSequence) {
  if (mergedContentSequence.some(group => group.ValueType === 'SCOORD' || group.ValueType === 'SCOORD3D')) {
    return _processTID1410Measurement(mergedContentSequence);
  }
  return _processNonGeometricallyDefinedMeasurement(mergedContentSequence);
}

/**
 * Processes TID 1410 style measurements from the mergedContentSequence.
 * TID 1410 style measurements have a SCOORD or SCOORD3D at the top level,
 * and non-geometric representations where each NUM has "INFERRED FROM" SCOORD/SCOORD3D.
 *
 * @param mergedContentSequence - The merged content sequence containing the measurements.
 * @returns The measurement object containing the loaded status, labels, coordinates, tracking unique identifier, and tracking identifier.
 */
function _processTID1410Measurement(mergedContentSequence) {
  // Need to deal with TID 1410 style measurements, which will have a SCOORD or SCOORD3D at the top level,
  // And non-geometric representations where each NUM has "INFERRED FROM" SCOORD/SCOORD3D

  const graphicItem = mergedContentSequence.find(group => group.ValueType === 'SCOORD' || group.ValueType === 'SCOORD3D');
  const UIDREFContentItem = mergedContentSequence.find(group => group.ValueType === 'UIDREF');
  const TrackingIdentifierContentItem = mergedContentSequence.find(item => item.ConceptNameCodeSequence.CodeValue === enums/* CodeNameCodeSequenceValues */.n7.TrackingIdentifier);
  if (!graphicItem) {
    console.warn(`graphic ValueType ${graphicItem.ValueType} not currently supported, skipping annotation.`);
    return;
  }
  const NUMContentItems = mergedContentSequence.filter(group => group.ValueType === 'NUM');
  const measurement = {
    loaded: false,
    labels: [],
    coords: [_getCoordsFromSCOORDOrSCOORD3D(graphicItem)],
    TrackingUniqueIdentifier: UIDREFContentItem.UID,
    TrackingIdentifier: TrackingIdentifierContentItem.TextValue
  };
  NUMContentItems.forEach(item => {
    const {
      ConceptNameCodeSequence,
      MeasuredValueSequence
    } = item;
    if (MeasuredValueSequence) {
      measurement.labels.push(_getLabelFromMeasuredValueSequence(ConceptNameCodeSequence, MeasuredValueSequence));
    }
  });
  const findingSites = mergedContentSequence.filter(item => item.ConceptNameCodeSequence.CodingSchemeDesignator === enums/* CodingSchemeDesignators */.bY.SCT && item.ConceptNameCodeSequence.CodeValue === enums/* CodeNameCodeSequenceValues */.n7.FindingSiteSCT);
  if (findingSites.length) {
    measurement.labels.push({
      label: enums/* CodeNameCodeSequenceValues */.n7.FindingSiteSCT,
      value: findingSites[0].ConceptCodeSequence.CodeMeaning
    });
  }
  return measurement;
}

/**
 * Processes the non-geometrically defined measurement from the merged content sequence.
 *
 * @param mergedContentSequence The merged content sequence containing the measurement data.
 * @returns The processed measurement object.
 */
function _processNonGeometricallyDefinedMeasurement(mergedContentSequence) {
  const NUMContentItems = mergedContentSequence.filter(group => group.ValueType === 'NUM');
  const UIDREFContentItem = mergedContentSequence.find(group => group.ValueType === 'UIDREF');
  const TrackingIdentifierContentItem = mergedContentSequence.find(item => item.ConceptNameCodeSequence.CodeValue === enums/* CodeNameCodeSequenceValues */.n7.TrackingIdentifier);
  const finding = mergedContentSequence.find(item => item.ConceptNameCodeSequence.CodeValue === enums/* CodeNameCodeSequenceValues */.n7.Finding);
  const findingSites = mergedContentSequence.filter(item => item.ConceptNameCodeSequence.CodingSchemeDesignator === enums/* CodingSchemeDesignators */.bY.SRT && item.ConceptNameCodeSequence.CodeValue === enums/* CodeNameCodeSequenceValues */.n7.FindingSite);
  const measurement = {
    loaded: false,
    labels: [],
    coords: [],
    TrackingUniqueIdentifier: UIDREFContentItem.UID,
    TrackingIdentifier: TrackingIdentifierContentItem.TextValue
  };
  if (finding && enums/* CodingSchemeDesignators */.bY.CornerstoneCodeSchemes.includes(finding.ConceptCodeSequence.CodingSchemeDesignator) && finding.ConceptCodeSequence.CodeValue === Cornerstone3DCodeScheme.codeValues.CORNERSTONEFREETEXT) {
    measurement.labels.push({
      label: Cornerstone3DCodeScheme.codeValues.CORNERSTONEFREETEXT,
      value: finding.ConceptCodeSequence.CodeMeaning
    });
  }

  // TODO -> Eventually hopefully support SNOMED or some proper code library, just free text for now.
  if (findingSites.length) {
    const cornerstoneFreeTextFindingSite = findingSites.find(FindingSite => enums/* CodingSchemeDesignators */.bY.CornerstoneCodeSchemes.includes(FindingSite.ConceptCodeSequence.CodingSchemeDesignator) && FindingSite.ConceptCodeSequence.CodeValue === Cornerstone3DCodeScheme.codeValues.CORNERSTONEFREETEXT);
    if (cornerstoneFreeTextFindingSite) {
      measurement.labels.push({
        label: Cornerstone3DCodeScheme.codeValues.CORNERSTONEFREETEXT,
        value: cornerstoneFreeTextFindingSite.ConceptCodeSequence.CodeMeaning
      });
    }
  }
  NUMContentItems.forEach(item => {
    const {
      ConceptNameCodeSequence,
      ContentSequence,
      MeasuredValueSequence
    } = item;
    const {
      ValueType
    } = ContentSequence;
    if (!ValueType === 'SCOORD') {
      console.warn(`Graphic ${ValueType} not currently supported, skipping annotation.`);
      return;
    }
    const coords = _getCoordsFromSCOORDOrSCOORD3D(ContentSequence);
    if (coords) {
      measurement.coords.push(coords);
    }
    if (MeasuredValueSequence) {
      measurement.labels.push(_getLabelFromMeasuredValueSequence(ConceptNameCodeSequence, MeasuredValueSequence));
    }
  });
  return measurement;
}

/**
 * Extracts coordinates from a graphic item of type SCOORD or SCOORD3D.
 * @param {object} graphicItem - The graphic item containing the coordinates.
 * @returns {object} - The extracted coordinates.
 */
const _getCoordsFromSCOORDOrSCOORD3D = graphicItem => {
  const {
    ValueType,
    GraphicType,
    GraphicData
  } = graphicItem;
  const coords = {
    ValueType,
    GraphicType,
    GraphicData
  };
  coords.ReferencedSOPSequence = graphicItem.ContentSequence?.ReferencedSOPSequence;
  coords.ReferencedFrameOfReferenceSequence = graphicItem.ReferencedFrameOfReferenceUID || graphicItem.ContentSequence?.ReferencedFrameOfReferenceSequence;
  return coords;
};

/**
 * Retrieves the label and value from the provided ConceptNameCodeSequence and MeasuredValueSequence.
 * @param {Object} ConceptNameCodeSequence - The ConceptNameCodeSequence object.
 * @param {Object} MeasuredValueSequence - The MeasuredValueSequence object.
 * @returns {Object} - An object containing the label and value.
 *                    The label represents the CodeMeaning from the ConceptNameCodeSequence.
 *                    The value represents the formatted NumericValue and CodeValue from the MeasuredValueSequence.
 *                    Example: { label: 'Long Axis', value: '31.00 mm' }
 */
function _getLabelFromMeasuredValueSequence(ConceptNameCodeSequence, MeasuredValueSequence) {
  const {
    CodeMeaning
  } = ConceptNameCodeSequence;
  const {
    NumericValue,
    MeasurementUnitsCodeSequence
  } = MeasuredValueSequence;
  const {
    CodeValue
  } = MeasurementUnitsCodeSequence;
  const formatedNumericValue = NumericValue ? Number(NumericValue).toFixed(2) : '';
  return {
    label: CodeMeaning,
    value: `${formatedNumericValue} ${CodeValue}`
  }; // E.g. Long Axis: 31.0 mm
}

/**
 * Retrieves a list of referenced images from the Imaging Measurement Report Content Sequence.
 *
 * @param {Array} ImagingMeasurementReportContentSequence - The Imaging Measurement Report Content Sequence.
 * @returns {Array} - The list of referenced images.
 */
function _getReferencedImagesList(ImagingMeasurementReportContentSequence) {
  const ImageLibrary = ImagingMeasurementReportContentSequence.find(item => item.ConceptNameCodeSequence.CodeValue === enums/* CodeNameCodeSequenceValues */.n7.ImageLibrary);
  if (!ImageLibrary) {
    return [];
  }
  const ImageLibraryGroup = _getSequenceAsArray(ImageLibrary.ContentSequence).find(item => item.ConceptNameCodeSequence.CodeValue === enums/* CodeNameCodeSequenceValues */.n7.ImageLibraryGroup);
  if (!ImageLibraryGroup) {
    return [];
  }
  const referencedImages = [];
  _getSequenceAsArray(ImageLibraryGroup.ContentSequence).forEach(item => {
    const {
      ReferencedSOPSequence
    } = item;
    if (!ReferencedSOPSequence) {
      return;
    }
    for (const ref of _getSequenceAsArray(ReferencedSOPSequence)) {
      if (ref.ReferencedSOPClassUID) {
        const {
          ReferencedSOPClassUID,
          ReferencedSOPInstanceUID
        } = ref;
        referencedImages.push({
          ReferencedSOPClassUID,
          ReferencedSOPInstanceUID
        });
      }
    }
  });
  return referencedImages;
}

/**
 * Converts a DICOM sequence to an array.
 * If the sequence is null or undefined, an empty array is returned.
 * If the sequence is already an array, it is returned as is.
 * Otherwise, the sequence is wrapped in an array and returned.
 *
 * @param {any} sequence - The DICOM sequence to convert.
 * @returns {any[]} - The converted array.
 */
function _getSequenceAsArray(sequence) {
  if (!sequence) {
    return [];
  }
  return Array.isArray(sequence) ? sequence : [sequence];
}
/* harmony default export */ const src_getSopClassHandlerModule = (getSopClassHandlerModule);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-sr/src/getHangingProtocolModule.ts
const srProtocol = {
  id: '@ohif/sr',
  // Don't store this hanging protocol as it applies to the currently active
  // display set by default
  // cacheId: null,
  name: 'SR Key Images',
  // Just apply this one when specifically listed
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
      allowUnmatchedView: true
    },
    displaySets: [{
      id: 'srDisplaySetId',
      matchedDisplaySetsIndex: -1
    }]
  },
  displaySetSelectors: {
    srDisplaySetId: {
      seriesMatchingRules: [{
        attribute: 'Modality',
        constraint: {
          equals: 'SR'
        }
      }]
    }
  },
  stages: [{
    name: 'SR Key Images',
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 1,
        columns: 1
      }
    },
    viewports: [{
      viewportOptions: {
        allowUnmatchedView: true
      },
      displaySets: [{
        id: 'srDisplaySetId'
      }]
    }]
  }]
};
function getHangingProtocolModule() {
  return [{
    name: srProtocol.id,
    protocol: srProtocol
  }];
}
/* harmony default export */ const src_getHangingProtocolModule = ((/* unused pure expression or super */ null && (getHangingProtocolModule)));

// EXTERNAL MODULE: ../../ui-next/src/index.ts + 1053 modules
var ui_next_src = __webpack_require__(2836);
// EXTERNAL MODULE: ../../i18n/src/index.js + 150 modules
var i18n_src = __webpack_require__(16076);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-sr/src/onModeEnter.tsx




function onModeEnter({
  servicesManager
}) {
  const {
    displaySetService,
    toolbarService
  } = servicesManager.services;
  const displaySetCache = displaySetService.getDisplaySetCache();
  const srDisplaySets = [...displaySetCache.values()].filter(ds => ds.SOPClassHandlerId === SOPClassHandlerId || ds.SOPClassHandlerId === SOPClassHandlerId3D);
  srDisplaySets.forEach(ds => {
    // New mode route, allow SRs to be hydrated again
    ds.isHydrated = false;
  });
  toolbarService.addButtons([{
    // A base/default button for loading measurements. It is added to the toolbar below.
    // Customizations to this button can be made in the mode or by another extension.
    // For example, the button label can be changed and/or the command to clear
    // the measurements can be dropped.
    id: 'loadSRMeasurements',
    component: props => /*#__PURE__*/react.createElement(ui_next_src/* ViewportActionButton */.N8H, props, i18n_src/* default */.A.t('Common:LOAD')),
    props: {
      commands: ['clearMeasurements', 'loadSRMeasurements']
    }
  }]);

  // The toolbar used in the viewport's status bar. Modes and extensions can further customize
  // it to optionally add other buttons.
  toolbarService.createButtonSection('loadSRMeasurements', ['loadSRMeasurements']);
}
// EXTERNAL MODULE: ../../../node_modules/dcmjs/build/dcmjs.es.js
var dcmjs_es = __webpack_require__(5842);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-sr/src/utils/getFilteredCornerstoneToolState.ts


const {
  log
} = src["default"];
function getFilteredCornerstoneToolState(measurementData, additionalFindingTypes) {
  const filteredToolState = {};
  function addToFilteredToolState(annotation, toolType) {
    if (!annotation.metadata?.referencedImageId) {
      log.warn(`[DICOMSR] No referencedImageId found for ${toolType} ${annotation.id}`);
      return;
    }
    const imageId = annotation.metadata.referencedImageId;
    if (!filteredToolState[imageId]) {
      filteredToolState[imageId] = {};
    }
    const imageIdSpecificToolState = filteredToolState[imageId];
    if (!imageIdSpecificToolState[toolType]) {
      imageIdSpecificToolState[toolType] = {
        data: []
      };
    }
    const measurementDataI = measurementData.find(md => md.uid === annotation.annotationUID);
    const toolData = imageIdSpecificToolState[toolType].data;
    let {
      finding
    } = measurementDataI;
    const findingSites = [];

    // NOTE -> We use the CORNERSTONEJS coding schemeDesignator which we have
    // defined in the @cornerstonejs/adapters
    if (measurementDataI.label) {
      if (additionalFindingTypes.includes(toolType)) {
        finding = {
          CodeValue: 'CORNERSTONEFREETEXT',
          CodingSchemeDesignator: 'CORNERSTONEJS',
          CodeMeaning: measurementDataI.label
        };
      } else {
        findingSites.push({
          CodeValue: 'CORNERSTONEFREETEXT',
          CodingSchemeDesignator: 'CORNERSTONEJS',
          CodeMeaning: measurementDataI.label
        });
      }
    }
    if (measurementDataI.findingSites) {
      findingSites.push(...measurementDataI.findingSites);
    }
    const measurement = Object.assign({}, annotation, {
      finding,
      findingSites
    });
    toolData.push(measurement);
  }
  const uidFilter = measurementData.map(md => md.uid);
  const uids = uidFilter.slice();
  const annotationManager = dist_esm.annotation.state.getAnnotationManager();
  const framesOfReference = annotationManager.getFramesOfReference();
  for (let i = 0; i < framesOfReference.length; i++) {
    const frameOfReference = framesOfReference[i];
    const frameOfReferenceAnnotations = annotationManager.getAnnotations(frameOfReference);
    const toolTypes = Object.keys(frameOfReferenceAnnotations);
    for (let j = 0; j < toolTypes.length; j++) {
      const toolType = toolTypes[j];
      const annotations = frameOfReferenceAnnotations[toolType];
      if (annotations) {
        for (let k = 0; k < annotations.length; k++) {
          const annotation = annotations[k];
          const uidIndex = uids.findIndex(uid => uid === annotation.annotationUID);
          if (uidIndex !== -1) {
            addToFilteredToolState(annotation, toolType);
            uids.splice(uidIndex, 1);
            if (!uids.length) {
              return filteredToolState;
            }
          }
        }
      }
    }
  }
  return filteredToolState;
}
/* harmony default export */ const utils_getFilteredCornerstoneToolState = (getFilteredCornerstoneToolState);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-sr/src/utils/getLabelFromDCMJSImportedToolData.js

const {
  CodeScheme: getLabelFromDCMJSImportedToolData_Cornerstone3DCodeScheme
} = esm/* adaptersSR */.QX.Cornerstone3D;

/**
 * Extracts the label from the toolData imported from dcmjs. We need to do this
 * as dcmjs does not depeend on OHIF/the measurementService, it just produces data for cornestoneTools.
 * This optional data is available for the consumer to process if they wish to.
 * @param {object} toolData The tooldata relating to the
 *
 * @returns {string} The extracted label.
 */
function getLabelFromDCMJSImportedToolData(toolData) {
  const {
    findingSites = [],
    finding
  } = toolData;
  let freeTextLabel = findingSites.find(fs => fs.CodeValue === getLabelFromDCMJSImportedToolData_Cornerstone3DCodeScheme.codeValues.CORNERSTONEFREETEXT);
  if (freeTextLabel) {
    return freeTextLabel.CodeMeaning;
  }
  if (finding && finding.CodeValue === getLabelFromDCMJSImportedToolData_Cornerstone3DCodeScheme.codeValues.CORNERSTONEFREETEXT) {
    return finding.CodeMeaning;
  }
}
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-sr/src/utils/hydrateStructuredReport.ts






const {
  locking
} = dist_esm.annotation;
const {
  guid
} = src["default"].utils;
const {
  MeasurementReport: hydrateStructuredReport_MeasurementReport,
  CORNERSTONE_3D_TAG
} = esm/* adaptersSR */.QX.Cornerstone3D;
const {
  CORNERSTONE_3D_TOOLS_SOURCE_NAME: hydrateStructuredReport_CORNERSTONE_3D_TOOLS_SOURCE_NAME,
  CORNERSTONE_3D_TOOLS_SOURCE_VERSION: hydrateStructuredReport_CORNERSTONE_3D_TOOLS_SOURCE_VERSION
} = cornerstone_src.Enums;
const supportedLegacyCornerstoneTags = (/* unused pure expression or super */ null && (['cornerstoneTools@^4.0.0']));
const convertCode = (codingValues, code) => {
  if (!code || code.CodingSchemeDesignator === 'CORNERSTONEJS') {
    return;
  }
  const ref = `${code.CodingSchemeDesignator}:${code.CodeValue}`;
  const ret = {
    ...codingValues[ref],
    ref,
    ...code,
    text: code.CodeMeaning
  };
  return ret;
};
const convertSites = (codingValues, sites) => {
  if (!sites || !sites.length) {
    return;
  }
  const ret = [];
  // Do as a loop to convert away from Proxy instances
  for (let i = 0; i < sites.length; i++) {
    // Deal with irregular conversion from dcmjs
    const site = convertCode(codingValues, sites[i][0] || sites[i]);
    if (site) {
      ret.push(site);
    }
  }
  return ret.length && ret || undefined;
};

/**
 * Hydrates a structured report, for default viewports.
 *
 */
function hydrateStructuredReport({
  servicesManager,
  extensionManager,
  commandsManager
}, displaySetInstanceUID) {
  const dataSource = extensionManager.getActiveDataSource()[0];
  const {
    measurementService,
    displaySetService,
    customizationService
  } = servicesManager.services;
  const codingValues = customizationService.getCustomization('codingValues');
  const disableEditing = customizationService.getCustomization('panelMeasurement.disableEditing');
  const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);

  // TODO -> We should define a strict versioning somewhere.
  const mappings = measurementService.getSourceMappings(hydrateStructuredReport_CORNERSTONE_3D_TOOLS_SOURCE_NAME, hydrateStructuredReport_CORNERSTONE_3D_TOOLS_SOURCE_VERSION);
  if (!mappings || !mappings.length) {
    throw new Error(`Attempting to hydrate measurements service when no mappings present. This shouldn't be reached.`);
  }
  const instance = src.DicomMetadataStore.getInstance(displaySet.StudyInstanceUID, displaySet.SeriesInstanceUID, displaySet.SOPInstanceUID);
  const sopInstanceUIDToImageId = {};
  const imageIdsForToolState = {};
  displaySet.measurements.forEach(measurement => {
    const {
      ReferencedSOPInstanceUID,
      imageId,
      frameNumber
    } = measurement;
    if (!sopInstanceUIDToImageId[ReferencedSOPInstanceUID]) {
      sopInstanceUIDToImageId[ReferencedSOPInstanceUID] = imageId;
      imageIdsForToolState[ReferencedSOPInstanceUID] = [];
    }
    if (!imageIdsForToolState[ReferencedSOPInstanceUID][frameNumber]) {
      imageIdsForToolState[ReferencedSOPInstanceUID][frameNumber] = imageId;
    }
  });

  // Mapping of legacy datasets is now directly handled by adapters module
  const datasetToUse = instance;

  // Use dcmjs to generate toolState.
  let storedMeasurementByAnnotationType = hydrateStructuredReport_MeasurementReport.generateToolState(datasetToUse,
  // NOTE: we need to pass in the imageIds to dcmjs since the we use them
  // for the imageToWorld transformation. The following assumes that the order
  // that measurements were added to the display set are the same order as
  // the measurementGroups in the instance.
  sopInstanceUIDToImageId, core_dist_esm.utilities.imageToWorldCoords, core_dist_esm.metaData);
  const onBeforeSRHydration = customizationService.getCustomization('onBeforeSRHydration')?.value;
  if (typeof onBeforeSRHydration === 'function') {
    storedMeasurementByAnnotationType = onBeforeSRHydration({
      storedMeasurementByAnnotationType,
      displaySet
    });
  }

  // Filter what is found by DICOM SR to measurements we support.
  const mappingDefinitions = mappings.map(m => m.annotationType);
  const hydratableMeasurementsInSR = {};
  Object.keys(storedMeasurementByAnnotationType).forEach(key => {
    if (mappingDefinitions.includes(key)) {
      hydratableMeasurementsInSR[key] = storedMeasurementByAnnotationType[key];
    }
  });

  // Set the series touched as tracked.
  const imageIds = [];

  // TODO: notification if no hydratable?
  Object.keys(hydratableMeasurementsInSR).forEach(annotationType => {
    const toolDataForAnnotationType = hydratableMeasurementsInSR[annotationType];
    toolDataForAnnotationType.forEach(toolData => {
      // Add the measurement to toolState
      // dcmjs and Cornerstone3D has structural defect in supporting multi-frame
      // files, and looking up the imageId from sopInstanceUIDToImageId results
      // in the wrong value.
      const frameNumber = toolData.annotation.data && toolData.annotation.data.frameNumber || 1;
      const imageId = imageIdsForToolState[toolData.sopInstanceUid][frameNumber] || sopInstanceUIDToImageId[toolData.sopInstanceUid];
      if (!imageIds.includes(imageId)) {
        imageIds.push(imageId);
      }
    });
  });
  let targetStudyInstanceUID;
  const SeriesInstanceUIDs = [];
  for (let i = 0; i < imageIds.length; i++) {
    const imageId = imageIds[i];
    const {
      SeriesInstanceUID,
      StudyInstanceUID
    } = core_dist_esm.metaData.get('instance', imageId);
    if (!SeriesInstanceUIDs.includes(SeriesInstanceUID)) {
      SeriesInstanceUIDs.push(SeriesInstanceUID);
    }
    if (!targetStudyInstanceUID) {
      targetStudyInstanceUID = StudyInstanceUID;
    } else if (targetStudyInstanceUID !== StudyInstanceUID) {
      console.warn('NO SUPPORT FOR SRs THAT HAVE MEASUREMENTS FROM MULTIPLE STUDIES.');
    }
  }
  Object.keys(hydratableMeasurementsInSR).forEach(annotationType => {
    const toolDataForAnnotationType = hydratableMeasurementsInSR[annotationType];
    toolDataForAnnotationType.forEach(toolData => {
      // Add the measurement to toolState
      // dcmjs and Cornerstone3D has structural defect in supporting multi-frame
      // files, and looking up the imageId from sopInstanceUIDToImageId results
      // in the wrong value.
      const frameNumber = toolData.annotation.data && toolData.annotation.data.frameNumber || 1;
      const imageId = imageIdsForToolState[toolData.sopInstanceUid][frameNumber] || sopInstanceUIDToImageId[toolData.sopInstanceUid];
      toolData.uid = guid();
      const instance = core_dist_esm.metaData.get('instance', imageId);
      const {
        FrameOfReferenceUID
        // SOPInstanceUID,
        // SeriesInstanceUID,
        // StudyInstanceUID,
      } = instance;
      const annotation = {
        annotationUID: toolData.annotation.annotationUID,
        data: toolData.annotation.data,
        metadata: {
          toolName: annotationType,
          referencedImageId: imageId,
          FrameOfReferenceUID
        }
      };
      const source = measurementService.getSource(hydrateStructuredReport_CORNERSTONE_3D_TOOLS_SOURCE_NAME, hydrateStructuredReport_CORNERSTONE_3D_TOOLS_SOURCE_VERSION);
      annotation.data.label = getLabelFromDCMJSImportedToolData(toolData);
      annotation.data.finding = convertCode(codingValues, toolData.finding?.[0]);
      annotation.data.findingSites = convertSites(codingValues, toolData.findingSites);
      annotation.data.findingSites?.forEach(site => {
        if (site.type) {
          annotation.data[site.type] = site;
        }
      });
      const matchingMapping = mappings.find(m => m.annotationType === annotationType);
      const newAnnotationUID = measurementService.addRawMeasurement(source, annotationType, {
        annotation
      }, matchingMapping.toMeasurementSchema, dataSource);
      commandsManager.runCommand('updateMeasurement', {
        uid: newAnnotationUID,
        code: annotation.data.finding
      });
      if (disableEditing) {
        locking.setAnnotationLocked(newAnnotationUID, true);
      }
      if (!imageIds.includes(imageId)) {
        imageIds.push(imageId);
      }
    });
  });
  displaySet.isHydrated = true;
  return {
    StudyInstanceUID: targetStudyInstanceUID,
    SeriesInstanceUIDs
  };
}
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-sr/src/commandsModule.ts






const {
  MeasurementReport: commandsModule_MeasurementReport
} = esm/* adaptersSR */.QX.Cornerstone3D;
const {
  log: commandsModule_log
} = src["default"];
/**
 * @param measurementData An array of measurements from the measurements service
 * that you wish to serialize.
 * @param additionalFindingTypes toolTypes that should be stored with labels as Findings
 * @param options Naturalized DICOM JSON headers to merge into the displaySet.
 *
 */
const _generateReport = (measurementData, additionalFindingTypes, options = {}) => {
  const filteredToolState = utils_getFilteredCornerstoneToolState(measurementData, additionalFindingTypes);
  const report = commandsModule_MeasurementReport.generateReport(filteredToolState, core_dist_esm.metaData, core_dist_esm.utilities.worldToImageCoords, options);
  const {
    dataset
  } = report;

  // Set the default character set as UTF-8
  // https://dicom.innolitics.com/ciods/nm-image/sop-common/00080005
  if (typeof dataset.SpecificCharacterSet === 'undefined') {
    dataset.SpecificCharacterSet = 'ISO_IR 192';
  }
  dataset.InstanceNumber = options.InstanceNumber ?? 1;
  return dataset;
};
const commandsModule = props => {
  const {
    servicesManager,
    extensionManager,
    commandsManager
  } = props;
  const {
    customizationService,
    viewportGridService,
    displaySetService
  } = servicesManager.services;
  const actions = {
    changeColorMeasurement: ({
      uid
    }) => {
      // When this gets supported, it probably belongs in cornerstone, not sr
      throw new Error('Unsupported operation: changeColorMeasurement');
      // const { color } = measurementService.getMeasurement(uid);
      // const rgbaColor = {
      //   r: color[0],
      //   g: color[1],
      //   b: color[2],
      //   a: color[3] / 255.0,
      // };
      // colorPickerDialog(uiDialogService, rgbaColor, (newRgbaColor, actionId) => {
      //   if (actionId === 'cancel') {
      //     return;
      //   }

      //   const color = [newRgbaColor.r, newRgbaColor.g, newRgbaColor.b, newRgbaColor.a * 255.0];
      // segmentationService.setSegmentColor(viewportId, segmentationId, segmentIndex, color);
      // });
    },
    /**
     *
     * @param measurementData An array of measurements from the measurements service
     * @param additionalFindingTypes toolTypes that should be stored with labels as Findings
     * @param options Naturalized DICOM JSON headers to merge into the displaySet.
     * as opposed to Finding Sites.
     * that you wish to serialize.
     */
    downloadReport: ({
      measurementData,
      additionalFindingTypes,
      options = {}
    }) => {
      const srDataset = _generateReport(measurementData, additionalFindingTypes, options);
      const reportBlob = dcmjs_es/* default.data */.Ay.data.datasetToBlob(srDataset);

      //Create a URL for the binary.
      const objectUrl = URL.createObjectURL(reportBlob);
      window.location.assign(objectUrl);
    },
    /**
     *
     * @param measurementData An array of measurements from the measurements service
     * that you wish to serialize.
     * @param dataSource The dataSource that you wish to use to persist the data.
     * @param additionalFindingTypes toolTypes that should be stored with labels as Findings
     * @param options Naturalized DICOM JSON headers to merge into the displaySet.
     * @return The naturalized report
     */
    storeMeasurements: async ({
      measurementData,
      dataSource,
      additionalFindingTypes,
      options = {}
    }) => {
      // Use the @cornerstonejs adapter for converting to/from DICOM
      // But it is good enough for now whilst we only have cornerstone as a datasource.
      commandsModule_log.info('[DICOMSR] storeMeasurements');
      if (!dataSource || !dataSource.store || !dataSource.store.dicom) {
        commandsModule_log.error('[DICOMSR] datasource has no dataSource.store.dicom endpoint!');
        return Promise.reject({});
      }
      try {
        const naturalizedReport = _generateReport(measurementData, additionalFindingTypes, options);
        const {
          StudyInstanceUID,
          ContentSequence
        } = naturalizedReport;
        // The content sequence has 5 or more elements, of which
        // the `[4]` element contains the annotation data, so this is
        // checking that there is some annotation data present.
        if (!ContentSequence?.[4].ContentSequence?.length) {
          console.log('naturalizedReport missing imaging content', naturalizedReport);
          throw new Error('Invalid report, no content');
        }
        const onBeforeDicomStore = customizationService.getCustomization('onBeforeDicomStore');
        let dicomDict;
        if (typeof onBeforeDicomStore === 'function') {
          dicomDict = onBeforeDicomStore({
            dicomDict,
            measurementData,
            naturalizedReport
          });
        }
        await dataSource.store.dicom(naturalizedReport, null, dicomDict);
        if (StudyInstanceUID) {
          dataSource.deleteStudyMetadataPromise(StudyInstanceUID);
        }

        // The "Mode" route listens for DicomMetadataStore changes
        // When a new instance is added, it listens and
        // automatically calls makeDisplaySets
        src.DicomMetadataStore.addInstances([naturalizedReport], true);
        return naturalizedReport;
      } catch (error) {
        console.warn(error);
        commandsModule_log.error(`[DICOMSR] Error while saving the measurements: ${error.message}`);
        throw new Error(error.message || 'Error while saving the measurements.');
      }
    },
    /**
     * Loads measurements by hydrating and loading the SR for the given display set instance UID
     * and displays it in the active viewport.
     */
    loadSRMeasurements: ({
      displaySetInstanceUID
    }) => {
      const {
        SeriesInstanceUIDs
      } = hydrateStructuredReport({
        servicesManager,
        extensionManager,
        commandsManager
      }, displaySetInstanceUID);
      const displaySets = displaySetService.getDisplaySetsForSeries(SeriesInstanceUIDs[0]);
      if (displaySets.length) {
        commandsManager.run('setDisplaySetsForViewports', {
          viewportsToUpdate: [{
            viewportId: viewportGridService.getActiveViewportId(),
            displaySetInstanceUIDs: [displaySets[0].displaySetInstanceUID]
          }]
        });
      }
    }
  };
  const definitions = {
    downloadReport: {
      commandFn: actions.downloadReport
    },
    storeMeasurements: {
      commandFn: actions.storeMeasurements
    },
    loadSRMeasurements: {
      commandFn: actions.loadSRMeasurements
    }
  };
  return {
    actions,
    definitions,
    defaultContext: 'CORNERSTONE_STRUCTURED_REPORT'
  };
};
/* harmony default export */ const src_commandsModule = (commandsModule);
// EXTERNAL MODULE: ../../../extensions/cornerstone-dicom-sr/src/tools/modules/dicomSRModule.js
var dicomSRModule = __webpack_require__(76654);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-sr/src/tools/DICOMSRDisplayTool.ts





class DICOMSRDisplayTool extends dist_esm.AnnotationTool {
  constructor(toolProps = {}, defaultToolProps = {
    configuration: {}
  }) {
    super(toolProps, defaultToolProps);
    // This tool should not inherit from AnnotationTool and we should not need
    // to add the following lines.
    this.isPointNearTool = () => null;
    this.getHandleNearImagePoint = () => null;
    this.renderAnnotation = (enabledElement, svgDrawingHelper) => {
      const {
        viewport
      } = enabledElement;
      const {
        element
      } = viewport;
      let annotations = dist_esm.annotation.state.getAnnotations(this.getToolName(), element);

      // Todo: We don't need this anymore, filtering happens in triggerAnnotationRender
      if (!annotations?.length) {
        return;
      }
      annotations = this.filterInteractableAnnotationsForElement(element, annotations);
      if (!annotations?.length) {
        return;
      }
      const trackingUniqueIdentifiersForElement = (0,dicomSRModule/* getTrackingUniqueIdentifiersForElement */.eF)(element);
      const {
        activeIndex,
        trackingUniqueIdentifiers
      } = trackingUniqueIdentifiersForElement;
      const activeTrackingUniqueIdentifier = trackingUniqueIdentifiers[activeIndex];

      // Filter toolData to only render the data for the active SR.
      const filteredAnnotations = annotations.filter(annotation => trackingUniqueIdentifiers.includes(annotation.data?.TrackingUniqueIdentifier));
      if (!viewport._actors?.size) {
        return;
      }
      const styleSpecifier = {
        toolGroupId: this.toolGroupId,
        toolName: this.getToolName(),
        viewportId: enabledElement.viewport.id
      };
      const {
        style: annotationStyle
      } = dist_esm.annotation.config;
      for (let i = 0; i < filteredAnnotations.length; i++) {
        const annotation = filteredAnnotations[i];
        const annotationUID = annotation.annotationUID;
        const {
          renderableData,
          TrackingUniqueIdentifier
        } = annotation.data;
        const {
          referencedImageId
        } = annotation.metadata;
        styleSpecifier.annotationUID = annotationUID;
        const groupStyle = annotationStyle.getToolGroupToolStyles(this.toolGroupId)[this.getToolName()];
        const lineWidth = this.getStyle('lineWidth', styleSpecifier, annotation);
        const lineDash = this.getStyle('lineDash', styleSpecifier, annotation);
        const color = TrackingUniqueIdentifier === activeTrackingUniqueIdentifier ? 'rgb(0, 255, 0)' : this.getStyle('color', styleSpecifier, annotation);
        const options = {
          color,
          lineDash,
          lineWidth,
          ...groupStyle
        };
        Object.keys(renderableData).forEach(GraphicType => {
          const renderableDataForGraphicType = renderableData[GraphicType];
          let renderMethod;
          let canvasCoordinatesAdapter;
          switch (GraphicType) {
            case enums/* SCOORDTypes */.sh.POINT:
              renderMethod = this.renderPoint;
              break;
            case enums/* SCOORDTypes */.sh.MULTIPOINT:
              renderMethod = this.renderMultipoint;
              break;
            case enums/* SCOORDTypes */.sh.POLYLINE:
              renderMethod = this.renderPolyLine;
              break;
            case enums/* SCOORDTypes */.sh.CIRCLE:
              renderMethod = this.renderEllipse;
              break;
            case enums/* SCOORDTypes */.sh.ELLIPSE:
              renderMethod = this.renderEllipse;
              canvasCoordinatesAdapter = dist_esm.utilities.math.ellipse.getCanvasEllipseCorners;
              break;
            default:
              throw new Error(`Unsupported GraphicType: ${GraphicType}`);
          }
          const canvasCoordinates = renderMethod(svgDrawingHelper, viewport, renderableDataForGraphicType, annotationUID, referencedImageId, options);
          this.renderTextBox(svgDrawingHelper, viewport, canvasCoordinates, canvasCoordinatesAdapter, annotation, styleSpecifier, options);
        });
      }
    };
  }
  _getTextBoxLinesFromLabels(labels) {
    // TODO -> max 5 for now (label + shortAxis + longAxis), need a generic solution for this!

    const labelLength = Math.min(labels.length, 5);
    const lines = [];
    for (let i = 0; i < labelLength; i++) {
      const labelEntry = labels[i];
      lines.push(`${_labelToShorthand(labelEntry.label)}: ${labelEntry.value}`);
    }
    return lines;
  }
  renderPolyLine(svgDrawingHelper, viewport, renderableData, annotationUID, referencedImageId, options) {
    const drawingOptions = {
      color: options.color,
      width: options.lineWidth,
      lineDash: options.lineDash
    };
    let allCanvasCoordinates = [];
    renderableData.map((data, index) => {
      const canvasCoordinates = data.map(p => viewport.worldToCanvas(p));
      const lineUID = `${index}`;
      if (canvasCoordinates.length === 2) {
        dist_esm.drawing.drawLine(svgDrawingHelper, annotationUID, lineUID, canvasCoordinates[0], canvasCoordinates[1], drawingOptions);
      } else {
        dist_esm.drawing.drawPolyline(svgDrawingHelper, annotationUID, lineUID, canvasCoordinates, drawingOptions);
      }
      allCanvasCoordinates = allCanvasCoordinates.concat(canvasCoordinates);
    });
    return allCanvasCoordinates; // used for drawing textBox
  }
  renderMultipoint(svgDrawingHelper, viewport, renderableData, annotationUID, referencedImageId, options) {
    let canvasCoordinates;
    renderableData.map((data, index) => {
      canvasCoordinates = data.map(p => viewport.worldToCanvas(p));
      const handleGroupUID = '0';
      dist_esm.drawing.drawHandles(svgDrawingHelper, annotationUID, handleGroupUID, canvasCoordinates, {
        color: options.color
      });
    });
  }
  renderPoint(svgDrawingHelper, viewport, renderableData, annotationUID, referencedImageId, options) {
    const canvasCoordinates = [];
    renderableData.map((data, index) => {
      const point = data[0];
      // This gives us one point for arrow
      canvasCoordinates.push(viewport.worldToCanvas(point));
      if (data[1] !== undefined) {
        canvasCoordinates.push(viewport.worldToCanvas(data[1]));
      } else {
        // We get the other point for the arrow by using the image size
        const imagePixelModule = core_dist_esm.metaData.get('imagePixelModule', referencedImageId);
        let xOffset = 10;
        let yOffset = 10;
        if (imagePixelModule) {
          const {
            columns,
            rows
          } = imagePixelModule;
          xOffset = columns / 10;
          yOffset = rows / 10;
        }
        const imagePoint = core_dist_esm.utilities.worldToImageCoords(referencedImageId, point);
        const arrowEnd = core_dist_esm.utilities.imageToWorldCoords(referencedImageId, [imagePoint[0] + xOffset, imagePoint[1] + yOffset]);
        canvasCoordinates.push(viewport.worldToCanvas(arrowEnd));
      }
      const arrowUID = `${index}`;

      // Todo: handle drawing probe as probe, currently we are drawing it as an arrow
      dist_esm.drawing.drawArrow(svgDrawingHelper, annotationUID, arrowUID, canvasCoordinates[1], canvasCoordinates[0], {
        color: options.color,
        width: options.lineWidth
      });
    });
    return canvasCoordinates; // used for drawing textBox
  }
  renderEllipse(svgDrawingHelper, viewport, renderableData, annotationUID, referencedImageId, options) {
    let canvasCoordinates;
    renderableData.map((data, index) => {
      if (data.length === 0) {
        // since oblique ellipse is not supported for hydration right now
        // we just return
        return;
      }
      const ellipsePointsWorld = data;
      const rotation = viewport.getRotation();
      canvasCoordinates = ellipsePointsWorld.map(p => viewport.worldToCanvas(p));
      let canvasCorners;
      if (rotation == 90 || rotation == 270) {
        canvasCorners = dist_esm.utilities.math.ellipse.getCanvasEllipseCorners([canvasCoordinates[2], canvasCoordinates[3], canvasCoordinates[0], canvasCoordinates[1]]);
      } else {
        canvasCorners = dist_esm.utilities.math.ellipse.getCanvasEllipseCorners(canvasCoordinates);
      }
      const lineUID = `${index}`;
      dist_esm.drawing.drawEllipse(svgDrawingHelper, annotationUID, lineUID, canvasCorners[0], canvasCorners[1], {
        color: options.color,
        width: options.lineWidth,
        lineDash: options.lineDash
      });
    });
    return canvasCoordinates;
  }
  renderTextBox(svgDrawingHelper, viewport, canvasCoordinates, canvasCoordinatesAdapter, annotation, styleSpecifier, options = {}) {
    if (!canvasCoordinates || !annotation) {
      return;
    }
    const {
      annotationUID,
      data = {}
    } = annotation;
    const {
      labels
    } = data;
    const {
      color
    } = options;
    let adaptedCanvasCoordinates = canvasCoordinates;
    // adapt coordinates if there is an adapter
    if (typeof canvasCoordinatesAdapter === 'function') {
      adaptedCanvasCoordinates = canvasCoordinatesAdapter(canvasCoordinates);
    }
    const textLines = this._getTextBoxLinesFromLabels(labels);
    const canvasTextBoxCoords = dist_esm.utilities.drawing.getTextBoxCoordsCanvas(adaptedCanvasCoordinates);
    if (!annotation.data?.handles?.textBox?.worldPosition) {
      annotation.data.handles.textBox.worldPosition = viewport.canvasToWorld(canvasTextBoxCoords);
    }
    const textBoxPosition = viewport.worldToCanvas(annotation.data.handles.textBox.worldPosition);
    const textBoxUID = '1';
    const textBoxOptions = this.getLinkedTextBoxStyle(styleSpecifier, annotation);
    const boundingBox = dist_esm.drawing.drawLinkedTextBox(svgDrawingHelper, annotationUID, textBoxUID, textLines, textBoxPosition, canvasCoordinates, {}, {
      ...textBoxOptions,
      color
    });
    const {
      x: left,
      y: top,
      width,
      height
    } = boundingBox;
    annotation.data.handles.textBox.worldBoundingBox = {
      topLeft: viewport.canvasToWorld([left, top]),
      topRight: viewport.canvasToWorld([left + width, top]),
      bottomLeft: viewport.canvasToWorld([left, top + height]),
      bottomRight: viewport.canvasToWorld([left + width, top + height])
    };
  }
}
DICOMSRDisplayTool.toolName = tools_toolNames.DICOMSRDisplay;
const SHORT_HAND_MAP = {
  'Short Axis': 'W: ',
  'Long Axis': 'L: ',
  AREA: 'Area: ',
  Length: '',
  CORNERSTONEFREETEXT: ''
};
function _labelToShorthand(label) {
  const shortHand = SHORT_HAND_MAP[label];
  if (shortHand !== undefined) {
    return shortHand;
  }
  return label;
}
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-sr/src/tools/SCOORD3DPointTool.ts


class SCOORD3DPointTool extends dist_esm.AnnotationDisplayTool {
  constructor(toolProps = {}, defaultToolProps = {
    configuration: {}
  }) {
    super(toolProps, defaultToolProps);
    // This tool should not inherit from AnnotationTool and we should not need
    // to add the following lines.
    this.isPointNearTool = () => null;
    this.getHandleNearImagePoint = () => null;
    this.renderAnnotation = (enabledElement, svgDrawingHelper) => {
      const {
        viewport
      } = enabledElement;
      const {
        element
      } = viewport;
      const annotations = dist_esm.annotation.state.getAnnotations(this.getToolName(), element);

      // Todo: We don't need this anymore, filtering happens in triggerAnnotationRender
      if (!annotations?.length) {
        return;
      }

      // Filter toolData to only render the data for the active SR.
      const filteredAnnotations = annotations;
      if (!viewport._actors?.size) {
        return;
      }
      const styleSpecifier = {
        toolGroupId: this.toolGroupId,
        toolName: this.getToolName(),
        viewportId: enabledElement.viewport.id
      };
      for (let i = 0; i < filteredAnnotations.length; i++) {
        const annotation = filteredAnnotations[i];
        const annotationUID = annotation.annotationUID;
        const {
          renderableData
        } = annotation.data;
        const {
          POINT: points
        } = renderableData;
        styleSpecifier.annotationUID = annotationUID;
        const lineWidth = this.getStyle('lineWidth', styleSpecifier, annotation);
        const lineDash = this.getStyle('lineDash', styleSpecifier, annotation);
        const color = this.getStyle('color', styleSpecifier, annotation);
        const options = {
          color,
          lineDash,
          lineWidth
        };
        const point = points[0][0];

        // check if viewport can render it
        const viewable = viewport.isReferenceViewable({
          FrameOfReferenceUID: annotation.metadata.FrameOfReferenceUID,
          cameraFocalPoint: point
        }, {
          asNearbyProjection: true
        });
        if (!viewable) {
          continue;
        }

        // render the point
        const arrowPointCanvas = viewport.worldToCanvas(point);
        // Todo: configure this
        const arrowEndCanvas = [arrowPointCanvas[0] + 20, arrowPointCanvas[1] + 20];
        const canvasCoordinates = [arrowPointCanvas, arrowEndCanvas];
        dist_esm.drawing.drawArrow(svgDrawingHelper, annotationUID, '1', canvasCoordinates[1], canvasCoordinates[0], {
          color: options.color,
          width: options.lineWidth
        });
        this.renderTextBox(svgDrawingHelper, viewport, canvasCoordinates, annotation, styleSpecifier, options);
      }
    };
  }
  _getTextBoxLinesFromLabels(labels) {
    // TODO -> max 5 for now (label + shortAxis + longAxis), need a generic solution for this!

    const labelLength = Math.min(labels.length, 5);
    const lines = [];
    return lines;
  }
  renderTextBox(svgDrawingHelper, viewport, canvasCoordinates, annotation, styleSpecifier, options = {}) {
    if (!canvasCoordinates || !annotation) {
      return;
    }
    const {
      annotationUID,
      data = {}
    } = annotation;
    const {
      labels
    } = data;
    const textLines = [];
    for (const label of labels) {
      // make this generic
      // fix this
      if (label.label === '363698007') {
        textLines.push(`Finding Site: ${label.value}`);
      }
    }
    const {
      color
    } = options;
    const adaptedCanvasCoordinates = canvasCoordinates;
    // adapt coordinates if there is an adapter
    const canvasTextBoxCoords = dist_esm.utilities.drawing.getTextBoxCoordsCanvas(adaptedCanvasCoordinates);
    if (!annotation.data?.handles?.textBox?.worldPosition) {
      annotation.data.handles.textBox.worldPosition = viewport.canvasToWorld(canvasTextBoxCoords);
    }
    const textBoxPosition = viewport.worldToCanvas(annotation.data.handles.textBox.worldPosition);
    const textBoxUID = '1';
    const textBoxOptions = this.getLinkedTextBoxStyle(styleSpecifier, annotation);
    const boundingBox = dist_esm.drawing.drawLinkedTextBox(svgDrawingHelper, annotationUID, textBoxUID, textLines, textBoxPosition, canvasCoordinates, {}, {
      ...textBoxOptions,
      color
    });
    const {
      x: left,
      y: top,
      width,
      height
    } = boundingBox;
    annotation.data.handles.textBox.worldBoundingBox = {
      topLeft: viewport.canvasToWorld([left, top]),
      topRight: viewport.canvasToWorld([left + width, top]),
      bottomLeft: viewport.canvasToWorld([left, top + height]),
      bottomRight: viewport.canvasToWorld([left + width, top + height])
    };
  }
  getLinkedTextBoxStyle(specifications, annotation) {
    // Todo: this function can be used to set different styles for different toolMode
    // for the textBox.

    return {
      visibility: this.getStyle('textBoxVisibility', specifications, annotation),
      fontFamily: this.getStyle('textBoxFontFamily', specifications, annotation),
      fontSize: this.getStyle('textBoxFontSize', specifications, annotation),
      color: this.getStyle('textBoxColor', specifications, annotation),
      shadow: this.getStyle('textBoxShadow', specifications, annotation),
      background: this.getStyle('textBoxBackground', specifications, annotation),
      lineWidth: this.getStyle('textBoxLinkLineWidth', specifications, annotation),
      lineDash: this.getStyle('textBoxLinkLineDash', specifications, annotation)
    };
  }
}
SCOORD3DPointTool.toolName = tools_toolNames.SRSCOORD3DPoint;
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-sr/src/utils/SRSCOOR3DProbeMapper.ts
const SRSCOOR3DProbe = {
  toAnnotation: measurement => {},
  /**
   * Maps cornerstone annotation event data to measurement service format.
   *
   * @param {Object} cornerstone Cornerstone event data
   * @return {Measurement} Measurement instance
   */
  toMeasurement: (csToolsEventDetail, displaySetService, CornerstoneViewportService, getValueTypeFromToolType, customizationService) => {
    const {
      annotation
    } = csToolsEventDetail;
    const {
      metadata,
      data,
      annotationUID
    } = annotation;
    if (!metadata || !data) {
      console.warn('Probe tool: Missing metadata or data');
      return null;
    }
    const {
      toolName
    } = metadata;
    const {
      points
    } = data.handles;
    const displayText = getDisplayText(annotation);
    return {
      uid: annotationUID,
      points,
      metadata,
      toolName: metadata.toolName,
      label: data.label,
      displayText: displayText,
      data: data.cachedStats,
      type: getValueTypeFromToolType?.(toolName) ?? null
    };
  }
};
function getDisplayText(annotation) {
  const {
    data
  } = annotation;
  if (!data) {
    return [''];
  }
  const {
    labels
  } = data;
  const displayText = [];
  for (const label of labels) {
    // make this generic
    if (label.label === '33636980076') {
      displayText.push(`Finding Site: ${label.value}`);
    }
  }
  return displayText;
}
/* harmony default export */ const SRSCOOR3DProbeMapper = (SRSCOOR3DProbe);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-sr/src/utils/addToolInstance.ts

function addToolInstance(name, toolClass, configuration = {}) {
  class InstanceClass extends toolClass {
    constructor(toolProps, defaultToolProps) {
      toolProps.configuration = toolProps.configuration ? {
        ...toolProps.configuration,
        ...configuration
      } : configuration;
      super(toolProps, defaultToolProps);
    }
  }
  InstanceClass.toolName = name;
  (0,dist_esm.addTool)(InstanceClass);
}
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-sr/src/init.ts







const {
  CORNERSTONE_3D_TOOLS_SOURCE_NAME: init_CORNERSTONE_3D_TOOLS_SOURCE_NAME,
  CORNERSTONE_3D_TOOLS_SOURCE_VERSION: init_CORNERSTONE_3D_TOOLS_SOURCE_VERSION
} = cornerstone_src.Enums;

/**
 * @param {object} configuration
 */
function init({
  configuration = {},
  servicesManager
}) {
  const {
    measurementService,
    cornerstoneViewportService
  } = servicesManager.services;
  addToolInstance(tools_toolNames.DICOMSRDisplay, DICOMSRDisplayTool);
  addToolInstance(tools_toolNames.SRLength, dist_esm.LengthTool);
  addToolInstance(tools_toolNames.SRBidirectional, dist_esm.BidirectionalTool);
  addToolInstance(tools_toolNames.SREllipticalROI, dist_esm.EllipticalROITool);
  addToolInstance(tools_toolNames.SRCircleROI, dist_esm.CircleROITool);
  addToolInstance(tools_toolNames.SRArrowAnnotate, dist_esm.ArrowAnnotateTool);
  addToolInstance(tools_toolNames.SRAngle, dist_esm.AngleTool);
  addToolInstance(tools_toolNames.SRPlanarFreehandROI, dist_esm.PlanarFreehandROITool);
  addToolInstance(tools_toolNames.SRRectangleROI, dist_esm.RectangleROITool);
  addToolInstance(tools_toolNames.SRSCOORD3DPoint, SCOORD3DPointTool);

  // TODO - fix the SR display of Cobb Angle, as it joins the two lines
  addToolInstance(tools_toolNames.SRCobbAngle, dist_esm.CobbAngleTool);
  const csTools3DVer1MeasurementSource = measurementService.getSource(init_CORNERSTONE_3D_TOOLS_SOURCE_NAME, init_CORNERSTONE_3D_TOOLS_SOURCE_VERSION);
  const {
    POINT
  } = measurementService.VALUE_TYPES;
  measurementService.addMapping(csTools3DVer1MeasurementSource, 'SRSCOORD3DPoint', POINT, SRSCOOR3DProbeMapper.toAnnotation, SRSCOOR3DProbeMapper.toMeasurement);

  // Modify annotation tools to use dashed lines on SR
  const dashedLine = {
    lineDash: '4,4'
  };
  dist_esm.annotation.config.style.setToolGroupToolStyles('SRToolGroup', {
    [tools_toolNames.DICOMSRDisplay]: dashedLine,
    SRLength: dashedLine,
    SRBidirectional: dashedLine,
    SREllipticalROI: dashedLine,
    SRCircleROI: dashedLine,
    SRArrowAnnotate: dashedLine,
    SRCobbAngle: dashedLine,
    SRAngle: dashedLine,
    SRPlanarFreehandROI: dashedLine,
    SRRectangleROI: dashedLine,
    global: {}
  });
}
// EXTERNAL MODULE: ../../../extensions/cornerstone-dicom-sr/src/utils/createReferencedImageDisplaySet.ts
var createReferencedImageDisplaySet = __webpack_require__(92643);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-sr/src/index.tsx
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }











const Component = /*#__PURE__*/react.lazy(() => {
  return __webpack_require__.e(/* import() */ 2701).then(__webpack_require__.bind(__webpack_require__, 62701));
});
const OHIFCornerstoneSRViewport = props => {
  return /*#__PURE__*/react.createElement(react.Suspense, {
    fallback: /*#__PURE__*/react.createElement("div", null, "Loading...")
  }, /*#__PURE__*/react.createElement(Component, props));
};

/**
 *
 */
const dicomSRExtension = {
  /**
   * Only required property. Should be a unique value across all extensions.
   */
  id: id,
  onModeEnter: onModeEnter,
  preRegistration: init,
  /**
   *
   *
   * @param {object} [configuration={}]
   * @param {object|array} [configuration.csToolsConfig] - Passed directly to `initCornerstoneTools`
   */
  getViewportModule({
    servicesManager,
    extensionManager
  }) {
    const ExtendedOHIFCornerstoneSRViewport = props => {
      return /*#__PURE__*/react.createElement(OHIFCornerstoneSRViewport, _extends({
        servicesManager: servicesManager,
        extensionManager: extensionManager
      }, props));
    };
    return [{
      name: 'dicom-sr',
      component: ExtendedOHIFCornerstoneSRViewport
    }];
  },
  getCommandsModule: src_commandsModule,
  getSopClassHandlerModule: src_getSopClassHandlerModule,
  // Include dynamically computed values such as toolNames not known till instantiation
  getUtilityModule({
    servicesManager
  }) {
    return [{
      name: 'tools',
      exports: {
        toolNames: tools_toolNames
      }
    }];
  }
};
/* harmony default export */ const cornerstone_dicom_sr_src = (dicomSRExtension);

// Put static exports here so they can be type checked


/***/ }),

/***/ 76654:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   eF: () => (/* binding */ getTrackingUniqueIdentifiersForElement),
/* harmony export */   m1: () => (/* binding */ setTrackingUniqueIdentifiersForElement)
/* harmony export */ });
/* unused harmony export setActiveTrackingUniqueIdentifierForElement */
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);

const state = {
  TrackingUniqueIdentifier: null,
  trackingIdentifiersByViewportId: {}
};

/**
 * This file is being used to store the per-viewport state of the SR tools,
 * Since, all the toolStates are added to the cornerstoneTools, when displaying the SRTools,
 * if there are two viewports rendering the same imageId, we don't want to show
 * the same SR annotation twice on irrelevant viewport, hence, we are storing the state
 * of the SR tools in state here, so that we can filter them later.
 */

function setTrackingUniqueIdentifiersForElement(element, trackingUniqueIdentifiers, activeIndex = 0) {
  const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
  const {
    viewport
  } = enabledElement;
  state.trackingIdentifiersByViewportId[viewport.id] = {
    trackingUniqueIdentifiers,
    activeIndex
  };
}
function setActiveTrackingUniqueIdentifierForElement(element, TrackingUniqueIdentifier) {
  const enabledElement = getEnabledElement(element);
  const {
    viewport
  } = enabledElement;
  const trackingIdentifiersForElement = state.trackingIdentifiersByViewportId[viewport.id];
  if (trackingIdentifiersForElement) {
    const activeIndex = trackingIdentifiersForElement.trackingUniqueIdentifiers.findIndex(tuid => tuid === TrackingUniqueIdentifier);
    trackingIdentifiersForElement.activeIndex = activeIndex;
  }
}
function getTrackingUniqueIdentifiersForElement(element) {
  const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
  const {
    viewport
  } = enabledElement;
  if (state.trackingIdentifiersByViewportId[viewport.id]) {
    return state.trackingIdentifiersByViewportId[viewport.id];
  }
  return {
    trackingUniqueIdentifiers: []
  };
}


/***/ }),

/***/ 92643:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ohif_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(62037);

const ImageSet = _ohif_core__WEBPACK_IMPORTED_MODULE_0__.classes.ImageSet;
const findInstance = (measurement, displaySetService) => {
  const {
    displaySetInstanceUID,
    ReferencedSOPInstanceUID: sopUid
  } = measurement;
  const referencedDisplaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
  if (!referencedDisplaySet.images) {
    return;
  }
  return referencedDisplaySet.images.find(it => it.SOPInstanceUID === sopUid);
};

/** Finds references to display sets inside the measurements
 * contained within the provided display set.
 * @return an array of instances referenced.
 */
const findReferencedInstances = (displaySetService, displaySet) => {
  const instances = [];
  const instanceById = {};
  for (const measurement of displaySet.measurements) {
    const {
      imageId
    } = measurement;
    if (!imageId) {
      continue;
    }
    if (instanceById[imageId]) {
      continue;
    }
    const instance = findInstance(measurement, displaySetService);
    if (!instance) {
      console.log('Measurement', measurement, 'had no instances found');
      continue;
    }
    instanceById[imageId] = instance;
    instances.push(instance);
  }
  return instances;
};

/**
 * Creates a new display set containing a single image instance for each
 * referenced image.
 *
 * @param displaySetService
 * @param displaySet - containing measurements referencing images.
 * @returns A new (registered/active) display set containing the referenced images
 */
const createReferencedImageDisplaySet = (displaySetService, displaySet) => {
  const instances = findReferencedInstances(displaySetService, displaySet);
  // This will be a  member function of the created image set
  const updateInstances = function () {
    this.images.splice(0, this.images.length, ...findReferencedInstances(displaySetService, displaySet));
    this.numImageFrames = this.images.length;
  };
  const imageSet = new ImageSet(instances);
  const instance = instances[0];
  if (!instance) {
    return;
  }
  imageSet.setAttributes({
    displaySetInstanceUID: imageSet.uid,
    // create a local alias for the imageSet UID
    SeriesDate: instance.SeriesDate,
    SeriesTime: instance.SeriesTime,
    SeriesInstanceUID: imageSet.uid,
    StudyInstanceUID: instance.StudyInstanceUID,
    SeriesNumber: instance.SeriesNumber || 0,
    SOPClassUID: instance.SOPClassUID,
    SeriesDescription: `${displaySet.SeriesDescription} KO ${displaySet.instance.SeriesNumber}`,
    Modality: 'KO',
    isMultiFrame: false,
    numImageFrames: instances.length,
    SOPClassHandlerId: `@ohif/extension-default.sopClassHandlerModule.stack`,
    isReconstructable: false,
    // This object is made of multiple instances from other series
    isCompositeStack: true,
    madeInClient: true,
    excludeFromThumbnailBrowser: true,
    updateInstances
  });
  displaySetService.addDisplaySets(imageSet);
  return imageSet;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createReferencedImageDisplaySet);

/***/ })

}]);