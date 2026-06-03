"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[2591,8305],{

/***/ 9099
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ cornerstone_dicom_seg_src)
});

;// ../../../extensions/cornerstone-dicom-seg/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/extension-cornerstone-dicom-seg"}');
;// ../../../extensions/cornerstone-dicom-seg/src/id.js

const id = package_namespaceObject.UU;
const SOPClassHandlerName = 'dicom-seg';
const SOPClassHandlerId = `${id}.sopClassHandlerModule.${SOPClassHandlerName}`;

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../core/src/index.ts + 69 modules
var src = __webpack_require__(42356);
// EXTERNAL MODULE: ../../i18n/src/index.js + 286 modules
var i18n_src = __webpack_require__(89010);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/index.js
var dist_esm = __webpack_require__(4667);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/index.js + 71 modules
var adapters_dist_esm = __webpack_require__(22031);
// EXTERNAL MODULE: ../../../node_modules/dcmjs/build/dcmjs.es.js
var dcmjs_es = __webpack_require__(5842);
;// ../../../extensions/cornerstone-dicom-seg/src/utils/dicomlabToRGB.ts


/**
 * Converts a CIELAB color to an RGB color using the dcmjs library.
 * @param cielab - The CIELAB color to convert.
 * @returns The RGB color as an array of three integers between 0 and 255.
 */
function dicomlabToRGB(cielab) {
  const rgb = dcmjs_es/* default.data */.Ay.data.Colors.dicomlab2RGB(cielab).map(x => Math.round(x * 255));
  return rgb;
}

;// ../../../extensions/cornerstone-dicom-seg/src/getSopClassHandlerModule.ts







const sopClassUids = ['1.2.840.10008.5.1.4.1.1.66.4', '1.2.840.10008.5.1.4.1.1.66.7'];
const loadPromises = {};
function _getDisplaySetsFromSeries(instances, servicesManager, extensionManager) {
  src.utils.sortStudyInstances(instances);

  // Choose the LAST instance in the list as the most recently created one.
  const instance = instances[instances.length - 1];
  const {
    StudyInstanceUID,
    SeriesInstanceUID,
    SOPInstanceUID,
    SeriesDescription = '',
    SeriesNumber,
    SeriesDate,
    StructureSetDate,
    SOPClassUID,
    wadoRoot,
    wadoUri,
    wadoUriRoot,
    imageId: predecessorImageId
  } = instance;
  const displaySet = {
    Modality: 'SEG',
    loading: false,
    isReconstructable: false,
    displaySetInstanceUID: src.utils.guid(),
    SeriesDescription,
    SeriesNumber,
    SeriesDate: SeriesDate || StructureSetDate || '',
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
    segments: {},
    sopClassUids,
    instance,
    predecessorImageId,
    instances: [instance],
    wadoRoot,
    wadoUriRoot,
    wadoUri,
    isOverlayDisplaySet: true,
    label: SeriesDescription || `${i18n_src/* default */.A.t('Series')} ${SeriesNumber} - ${i18n_src/* default */.A.t('SEG')}`
  };
  const referencedSeriesSequence = instance.ReferencedSeriesSequence;
  if (!referencedSeriesSequence) {
    console.error('ReferencedSeriesSequence is missing for the SEG');
    return;
  }
  const referencedSeries = referencedSeriesSequence[0] || referencedSeriesSequence;
  displaySet.referencedImages = instance.ReferencedSeriesSequence.ReferencedInstanceSequence;
  displaySet.referencedSeriesInstanceUID = referencedSeries.SeriesInstanceUID;
  const {
    displaySetService
  } = servicesManager.services;
  const referencedDisplaySets = displaySetService.getDisplaySetsForReferences(instance.ReferencedSeriesSequence);
  if (referencedDisplaySets?.length > 1) {
    console.warn('Segmentation does not currently handle references to multiple series, defaulting to first series');
  }
  const referencedDisplaySet = referencedDisplaySets[0];
  if (!referencedDisplaySet) {
    // subscribe to display sets added which means at some point it will be available
    const {
      unsubscribe
    } = displaySetService.subscribe(displaySetService.EVENTS.DISPLAY_SETS_ADDED, ({
      displaySetsAdded
    }) => {
      // here we can also do a little bit of search, since sometimes DICOM SEG
      // does not contain the referenced display set uid , and we can just
      // see which of the display sets added is more similar and assign it
      // to the referencedDisplaySet
      const addedDisplaySet = displaySetsAdded[0];
      if (addedDisplaySet.SeriesInstanceUID === displaySet.referencedSeriesInstanceUID) {
        displaySet.referencedDisplaySetInstanceUID = addedDisplaySet.displaySetInstanceUID;
        displaySet.isReconstructable = addedDisplaySet.isReconstructable;
        unsubscribe();
      }
    });
  } else {
    displaySet.referencedDisplaySetInstanceUID = referencedDisplaySet.displaySetInstanceUID;
    displaySet.isReconstructable = referencedDisplaySet.isReconstructable;
  }
  displaySet.load = async ({
    headers
  }) => await _load(displaySet, servicesManager, extensionManager, headers);
  return [displaySet];
}
function _load(segDisplaySet, servicesManager, extensionManager, headers) {
  const {
    SOPInstanceUID
  } = segDisplaySet;
  const {
    segmentationService
  } = servicesManager.services;
  if ((segDisplaySet.loading || segDisplaySet.isLoaded) && loadPromises[SOPInstanceUID] && _segmentationExists(segDisplaySet)) {
    return loadPromises[SOPInstanceUID];
  }
  segDisplaySet.loading = true;

  // We don't want to fire multiple loads, so we'll wait for the first to finish
  // and also return the same promise to any other callers.
  loadPromises[SOPInstanceUID] = new Promise(async (resolve, reject) => {
    if (!segDisplaySet.segments || Object.keys(segDisplaySet.segments).length === 0) {
      try {
        await _loadSegments({
          extensionManager,
          servicesManager,
          segDisplaySet,
          headers
        });
      } catch (e) {
        segDisplaySet.loading = false;
        return reject(e);
      }
    }
    segmentationService.createSegmentationForSEGDisplaySet(segDisplaySet).then(() => {
      segDisplaySet.loading = false;
      resolve();
    }).catch(error => {
      segDisplaySet.loading = false;
      reject(error);
    });
  });
  return loadPromises[SOPInstanceUID];
}
async function _loadSegments({
  extensionManager,
  servicesManager,
  segDisplaySet,
  headers
}) {
  const utilityModule = extensionManager.getModuleEntry('@ohif/extension-cornerstone.utilityModule.common');
  const {
    segmentationService,
    uiNotificationService
  } = servicesManager.services;
  const {
    dicomLoaderService
  } = utilityModule.exports;
  const arrayBuffer = await dicomLoaderService.findDicomDataPromise(segDisplaySet, null, headers);
  const referencedDisplaySet = servicesManager.services.displaySetService.getDisplaySetByUID(segDisplaySet.referencedDisplaySetInstanceUID);
  if (!referencedDisplaySet) {
    throw new Error('referencedDisplaySet is missing for SEG');
  }
  let {
    imageIds
  } = referencedDisplaySet;
  if (!imageIds) {
    // try images
    const {
      images
    } = referencedDisplaySet;
    imageIds = images.map(image => image.imageId);
  }

  // Todo: what should be defaults here
  const tolerance = 0.001;
  esm.eventTarget.addEventListener(adapters_dist_esm/* Enums.Events */.fX.s.SEGMENTATION_LOAD_PROGRESS, evt => {
    const {
      percentComplete
    } = evt.detail;
    segmentationService._broadcastEvent(segmentationService.EVENTS.SEGMENT_LOADING_COMPLETE, {
      percentComplete
    });
  });
  const results = await adapters_dist_esm/* adaptersSEG */.ql.Cornerstone3D.Segmentation.createFromDICOMSegBuffer(imageIds, arrayBuffer, {
    metadataProvider: esm.metaData,
    tolerance
  });
  let usedRecommendedDisplayCIELabValue = true;
  results.segMetadata.data.forEach((data, i) => {
    if (i > 0) {
      data.rgba = data.RecommendedDisplayCIELabValue;
      if (data.rgba) {
        data.rgba = dicomlabToRGB(data.rgba);
      } else {
        usedRecommendedDisplayCIELabValue = false;
        data.rgba = dist_esm.CONSTANTS.COLOR_LUT[i % dist_esm.CONSTANTS.COLOR_LUT.length];
      }
    }
  });
  if (!usedRecommendedDisplayCIELabValue) {
    // Display a notification about the non-utilization of RecommendedDisplayCIELabValue
    uiNotificationService.show({
      title: 'DICOM SEG import',
      message: 'RecommendedDisplayCIELabValue not found for one or more segments. The default color was used instead.',
      type: 'warning',
      duration: 5000
    });
  }
  Object.assign(segDisplaySet, results);
}
function _segmentationExists(segDisplaySet) {
  return dist_esm.segmentation.state.getSegmentation(segDisplaySet.displaySetInstanceUID);
}
function getSopClassHandlerModule(params) {
  const {
    servicesManager,
    extensionManager
  } = params;
  const getDisplaySetsFromSeries = instances => {
    return _getDisplaySetsFromSeries(instances, servicesManager, extensionManager);
  };
  return [{
    name: 'dicom-seg',
    sopClassUids,
    getDisplaySetsFromSeries
  }];
}
/* harmony default export */ const src_getSopClassHandlerModule = (getSopClassHandlerModule);
;// ../../../extensions/cornerstone-dicom-seg/src/getHangingProtocolModule.ts
const segProtocol = {
  id: '@ohif/seg',
  // Don't store this hanging protocol as it applies to the currently active
  // display set by default
  // cacheId: null,
  name: 'Segmentations',
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
      allowUnmatchedView: true,
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
      id: 'segDisplaySetId',
      matchedDisplaySetsIndex: -1
    }]
  },
  displaySetSelectors: {
    segDisplaySetId: {
      seriesMatchingRules: [{
        attribute: 'Modality',
        constraint: {
          equals: 'SEG'
        }
      }]
    }
  },
  stages: [{
    name: 'Segmentations',
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 1,
        columns: 1
      }
    },
    viewports: [{
      viewportOptions: {
        allowUnmatchedView: true,
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
        id: 'segDisplaySetId'
      }]
    }]
  }]
};
function getHangingProtocolModule() {
  return [{
    name: segProtocol.id,
    protocol: segProtocol
  }];
}
/* harmony default export */ const src_getHangingProtocolModule = (getHangingProtocolModule);

// EXTERNAL MODULE: ../../../extensions/default/src/index.ts + 141 modules
var default_src = __webpack_require__(37681);
// EXTERNAL MODULE: ../../../extensions/default/src/utils/_shared/PROMPT_RESPONSES.ts
var PROMPT_RESPONSES = __webpack_require__(96357);
;// ../../../extensions/cornerstone-dicom-seg/src/commandsModule.ts








const {
  datasetToBlob
} = dcmjs_es/* default.data */.Ay.data;
const getTargetViewport = ({
  viewportId,
  viewportGridService
}) => {
  const {
    viewports,
    activeViewportId
  } = viewportGridService.getState();
  const targetViewportId = viewportId || activeViewportId;
  const viewport = viewports.get(targetViewportId);
  return viewport;
};
const {
  Cornerstone3D: {
    Segmentation: {
      generateSegmentation
    }
  }
} = adapters_dist_esm/* adaptersSEG */.ql;
const {
  Cornerstone3D: {
    RTSS: {
      generateRTSSFromSegmentations
    }
  }
} = adapters_dist_esm/* adaptersRT */.f_;
const {
  /* downloadDICOMData */ "vk": downloadDICOMData
} = adapters_dist_esm/* helpers */._$;
const commandsModule = ({
  servicesManager,
  extensionManager
}) => {
  const {
    segmentationService,
    displaySetService,
    viewportGridService,
    toolGroupService
  } = servicesManager.services;
  const actions = {
    /**
     * Loads segmentations for a specified viewport.
     * The function prepares the viewport for rendering, then loads the segmentation details.
     * Additionally, if the segmentation has scalar data, it is set for the corresponding label map volume.
     *
     * @param {Object} params - Parameters for the function.
     * @param params.segmentations - Array of segmentations to be loaded.
     * @param params.viewportId - the target viewport ID.
     *
     */
    loadSegmentationsForViewport: async ({
      segmentations,
      viewportId
    }) => {
      // Todo: handle adding more than one segmentation
      const viewport = getTargetViewport({
        viewportId,
        viewportGridService
      });
      const displaySetInstanceUID = viewport.displaySetInstanceUIDs[0];
      const segmentation = segmentations[0];
      const segmentationId = segmentation.segmentationId;
      const label = segmentation.config.label;
      const segments = segmentation.config.segments;
      const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
      await segmentationService.createLabelmapForDisplaySet(displaySet, {
        segmentationId,
        segments,
        label
      });
      segmentationService.addOrUpdateSegmentation(segmentation);
      await segmentationService.addSegmentationRepresentation(viewport.viewportId, {
        segmentationId
      });
      return segmentationId;
    },
    /**
     * Generates a segmentation from a given segmentation ID.
     * This function retrieves the associated segmentation and
     * its referenced volume, extracts label maps from the
     * segmentation volume, and produces segmentation data
     * alongside associated metadata.
     *
     * @param {Object} params - Parameters for the function.
     * @param params.segmentationId - ID of the segmentation to be generated.
     * @param params.options - Optional configuration for the generation process.
     *
     * @returns Returns the generated segmentation data.
     */
    generateSegmentation: ({
      segmentationId,
      options = {}
    }) => {
      const segmentation = dist_esm.segmentation.state.getSegmentation(segmentationId);
      const {
        imageIds
      } = segmentation.representationData.Labelmap;
      const segImages = imageIds.map(imageId => esm.cache.getImage(imageId));
      const referencedImages = segImages.map(image => esm.cache.getImage(image.referencedImageId));
      const labelmaps2D = [];
      let z = 0;
      for (const segImage of segImages) {
        const segmentsOnLabelmap = new Set();
        const pixelData = segImage.getPixelData();
        const {
          rows,
          columns
        } = segImage;

        // Use a single pass through the pixel data
        for (let i = 0; i < pixelData.length; i++) {
          const segment = pixelData[i];
          if (segment !== 0) {
            segmentsOnLabelmap.add(segment);
          }
        }
        labelmaps2D[z++] = {
          segmentsOnLabelmap: Array.from(segmentsOnLabelmap),
          pixelData,
          rows,
          columns
        };
      }
      const allSegmentsOnLabelmap = labelmaps2D.map(labelmap => labelmap.segmentsOnLabelmap);
      const labelmap3D = {
        segmentsOnLabelmap: Array.from(new Set(allSegmentsOnLabelmap.flat())),
        metadata: [],
        labelmaps2D
      };
      const segmentationInOHIF = segmentationService.getSegmentation(segmentationId);
      const representations = segmentationService.getRepresentationsForSegmentation(segmentationId);
      Object.entries(segmentationInOHIF.segments).forEach(([segmentIndex, segment]) => {
        // segmentation service already has a color for each segment
        if (!segment) {
          return;
        }
        const {
          label
        } = segment;
        const firstRepresentation = representations[0];
        const color = segmentationService.getSegmentColor(firstRepresentation.viewportId, segmentationId, segment.segmentIndex);
        const RecommendedDisplayCIELabValue = dcmjs_es/* default.data */.Ay.data.Colors.rgb2DICOMLAB(color.slice(0, 3).map(value => value / 255)).map(value => Math.round(value));
        const segmentMetadata = {
          SegmentNumber: segmentIndex.toString(),
          SegmentLabel: label,
          SegmentAlgorithmType: segment?.algorithmType || 'MANUAL',
          SegmentAlgorithmName: segment?.algorithmName || 'OHIF Brush',
          RecommendedDisplayCIELabValue,
          SegmentedPropertyCategoryCodeSequence: {
            CodeValue: 'T-D0050',
            CodingSchemeDesignator: 'SRT',
            CodeMeaning: 'Tissue'
          },
          SegmentedPropertyTypeCodeSequence: {
            CodeValue: 'T-D0050',
            CodingSchemeDesignator: 'SRT',
            CodeMeaning: 'Tissue'
          }
        };
        labelmap3D.metadata[segmentIndex] = segmentMetadata;
      });
      const generatedSegmentation = generateSegmentation(referencedImages, labelmap3D, esm.metaData, options);
      return generatedSegmentation;
    },
    /**
     * Downloads a segmentation based on the provided segmentation ID.
     * This function retrieves the associated segmentation and
     * uses it to generate the corresponding DICOM dataset, which
     * is then downloaded with an appropriate filename.
     *
     * @param {Object} params - Parameters for the function.
     * @param params.segmentationId - ID of the segmentation to be downloaded.
     *
     */
    downloadSegmentation: ({
      segmentationId
    }) => {
      const segmentationInOHIF = segmentationService.getSegmentation(segmentationId);
      const generatedSegmentation = actions.generateSegmentation({
        segmentationId
      });
      downloadDICOMData(generatedSegmentation.dataset, `${segmentationInOHIF.label}`);
    },
    /**
     * Stores a segmentation based on the provided segmentationId into a specified data source.
     * The SeriesDescription is derived from user input or defaults to the segmentation label,
     * and in its absence, defaults to 'Research Derived Series'.
     *
     * @param {Object} params - Parameters for the function.
     * @param params.segmentationId - ID of the segmentation to be stored.
     * @param params.dataSource - Data source where the generated segmentation will be stored.
     *
     * @returns {Object|void} Returns the naturalized report if successfully stored,
     * otherwise throws an error.
     */
    storeSegmentation: async ({
      segmentationId,
      dataSource
    }) => {
      const segmentation = segmentationService.getSegmentation(segmentationId);
      if (!segmentation) {
        throw new Error('No segmentation found');
      }
      const {
        label
      } = segmentation;
      const defaultDataSource = dataSource ?? extensionManager.getActiveDataSource();
      const {
        value: reportName,
        dataSourceName: selectedDataSource,
        action
      } = await (0,default_src/* createReportDialogPrompt */.tc)({
        servicesManager,
        extensionManager,
        title: 'Store Segmentation'
      });
      if (action === PROMPT_RESPONSES/* default */.A.CREATE_REPORT) {
        try {
          const selectedDataSourceConfig = selectedDataSource ? extensionManager.getDataSources(selectedDataSource)[0] : defaultDataSource[0];
          const generatedData = actions.generateSegmentation({
            segmentationId,
            options: {
              SeriesDescription: reportName || label || 'Research Derived Series'
            }
          });
          if (!generatedData || !generatedData.dataset) {
            throw new Error('Error during segmentation generation');
          }
          const {
            dataset: naturalizedReport
          } = generatedData;
          await selectedDataSourceConfig.store.dicom(naturalizedReport);

          // add the information for where we stored it to the instance as well
          naturalizedReport.wadoRoot = selectedDataSourceConfig.getConfig().wadoRoot;
          const instance = src.DicomMetadataStore.getInstance(naturalizedReport.StudyInstanceUID, naturalizedReport.ReferencedSeriesSequence.SeriesInstanceUID, naturalizedReport.ReferencedSeriesSequence.ReferencedInstanceSequence[0].ReferencedSOPInstanceUID);
          const volumePath = instance.volumeRoot;
          if (volumePath !== undefined) {
            const filePath = instance.wadoUri.split("/Volumes/")[0] + "/" + volumePath + "/ohif/exports/" + naturalizedReport.StudyInstanceUID + "/" + naturalizedReport.SeriesInstanceUID + "/" + naturalizedReport.SOPInstanceUID + ".dcm";

            // Hack to retrieve later the saved file in Databricks Volumes
            naturalizedReport.wadoUri = filePath;
            naturalizedReport.volumeRoot = instance.volumeRoot;
          }
          src.DicomMetadataStore.addInstances([naturalizedReport], true);
          return naturalizedReport;
        } catch (error) {
          console.debug('Error storing segmentation:', error);
          throw error;
        }
      }
    },
    /**
     * Converts segmentations into RTSS for download.
     * This sample function retrieves all segentations and passes to
     * cornerstone tool adapter to convert to DICOM RTSS format. It then
     * converts dataset to downloadable blob.
     *
     */
    downloadRTSS: async ({
      segmentationId
    }) => {
      const segmentations = segmentationService.getSegmentation(segmentationId);

      // inject colors to the segmentIndex
      const firstRepresentation = segmentationService.getRepresentationsForSegmentation(segmentationId)[0];
      Object.entries(segmentations.segments).forEach(([segmentIndex, segment]) => {
        segment.color = segmentationService.getSegmentColor(firstRepresentation.viewportId, segmentationId, segmentIndex);
      });
      const RTSS = await generateRTSSFromSegmentations(segmentations, src.classes.MetadataProvider, src.DicomMetadataStore);
      try {
        const reportBlob = datasetToBlob(RTSS);

        //Create a URL for the binary.
        const objectUrl = URL.createObjectURL(reportBlob);
        window.location.assign(objectUrl);
      } catch (e) {
        console.warn(e);
      }
    }
  };
  const definitions = {
    loadSegmentationsForViewport: {
      commandFn: actions.loadSegmentationsForViewport
    },
    generateSegmentation: {
      commandFn: actions.generateSegmentation
    },
    downloadSegmentation: {
      commandFn: actions.downloadSegmentation
    },
    storeSegmentation: {
      commandFn: actions.storeSegmentation
    },
    downloadRTSS: {
      commandFn: actions.downloadRTSS
    }
  };
  return {
    actions,
    definitions,
    defaultContext: 'SEGMENTATION'
  };
};
/* harmony default export */ const src_commandsModule = (commandsModule);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/index.tsx + 194 modules
var cornerstone_src = __webpack_require__(82764);
// EXTERNAL MODULE: ../../ui-next/src/index.ts + 3077 modules
var ui_next_src = __webpack_require__(16546);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/index.js
var utilities = __webpack_require__(53860);
// EXTERNAL MODULE: ../../../node_modules/react-i18next/dist/es/index.js + 15 modules
var es = __webpack_require__(99993);
;// ../../../extensions/cornerstone-dicom-seg/src/components/LogicalContourOperationsOptions.tsx







const {
  LogicalOperation
} = utilities.contourSegmentation;
const options = [{
  value: 'merge',
  logicalOperation: LogicalOperation.Union,
  label: 'Merge',
  icon: 'actions-combine-merge',
  helperIcon: 'helper-combine-merge'
}, {
  value: 'intersect',
  logicalOperation: LogicalOperation.Intersect,
  label: 'Intersect',
  icon: 'actions-combine-intersect',
  helperIcon: 'helper-combine-intersect'
}, {
  value: 'subtract',
  logicalOperation: LogicalOperation.Subtract,
  label: 'Subtract',
  icon: 'actions-combine-subtract',
  helperIcon: 'helper-combine-subtract'
}];

// Shared component for segment selection
function SegmentSelector({
  label,
  value,
  onValueChange,
  segments,
  placeholder = 'Select a segment'
}) {
  const {
    t
  } = (0,es/* useTranslation */.Bd)('SegmentationPanel');
  return /*#__PURE__*/react.createElement("div", {
    className: "flex justify-between gap-6"
  }, /*#__PURE__*/react.createElement("div", null, label), /*#__PURE__*/react.createElement(ui_next_src/* Select */.l6P, {
    key: `select-segment-${label}`,
    onValueChange: onValueChange,
    value: value
  }, /*#__PURE__*/react.createElement(ui_next_src/* SelectTrigger */.bqE, {
    className: "overflow-hidden"
  }, /*#__PURE__*/react.createElement(ui_next_src/* SelectValue */.yvm, {
    placeholder: t(placeholder)
  })), /*#__PURE__*/react.createElement(ui_next_src/* SelectContent */.gCo, null, segments.map(segment => /*#__PURE__*/react.createElement(ui_next_src/* SelectItem */.ebT, {
    key: segment.segmentIndex,
    value: segment.segmentIndex.toString()
  }, segment.label)))));
}
function LogicalContourOperationOptions() {
  const {
    servicesManager
  } = (0,src.useSystem)();
  const {
    segmentationService
  } = servicesManager.services;
  const {
    t
  } = (0,es/* useTranslation */.Bd)('SegmentationPanel');
  const {
    segmentationsWithRepresentations
  } = (0,cornerstone_src/* useActiveViewportSegmentationRepresentations */.c3)();
  const activeRepresentation = segmentationsWithRepresentations?.find(({
    representation
  }) => representation?.active);
  const segments = activeRepresentation ? Object.values(activeRepresentation.segmentation.segments) : [];

  // Calculate the next available segment index
  const nextSegmentIndex = activeRepresentation ? segmentationService.getNextAvailableSegmentIndex(activeRepresentation.segmentation.segmentationId) : 1;
  const activeSegment = segments.find(segment => segment.active);
  const activeSegmentIndex = activeSegment?.segmentIndex || 0;
  const [operation, setOperation] = (0,react.useState)(options[0]);
  const [segmentA, setSegmentA] = (0,react.useState)(activeSegmentIndex?.toString() || '');
  const [segmentB, setSegmentB] = (0,react.useState)('');
  const [createNewSegment, setCreateNewSegment] = (0,react.useState)(false);
  const [newSegmentName, setNewSegmentName] = (0,react.useState)('');
  (0,react.useEffect)(() => {
    setSegmentA(activeSegmentIndex?.toString() || null);
  }, [activeSegmentIndex]);
  (0,react.useEffect)(() => {
    setNewSegmentName(`Segment ${nextSegmentIndex}`);
  }, [nextSegmentIndex]);
  const runCommand = (0,src.useRunCommand)();
  const applyLogicalContourOperation = (0,react.useCallback)(() => {
    let resultSegmentIndex = segmentA;
    if (createNewSegment) {
      resultSegmentIndex = nextSegmentIndex.toString();
      runCommand('addSegment', {
        segmentationId: activeRepresentation.segmentation.segmentationId,
        config: {
          label: newSegmentName,
          segmentIndex: nextSegmentIndex
        }
      });
    }
    runCommand('applyLogicalContourOperation', {
      segmentAInfo: {
        segmentationId: activeRepresentation.segmentation.segmentationId,
        segmentIndex: parseInt(segmentA)
      },
      segmentBInfo: {
        segmentationId: activeRepresentation.segmentation.segmentationId,
        segmentIndex: parseInt(segmentB)
      },
      resultSegmentInfo: {
        segmentationId: activeRepresentation.segmentation.segmentationId,
        segmentIndex: parseInt(resultSegmentIndex)
      },
      logicalOperation: operation.logicalOperation
    });
  }, [activeRepresentation?.segmentation?.segmentationId, createNewSegment, newSegmentName, nextSegmentIndex, operation.logicalOperation, runCommand, segmentA, segmentB]);
  return /*#__PURE__*/react.createElement("div", {
    className: "flex w-[245px] flex-col gap-4"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex items-start justify-between"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex w-auto flex-col items-center gap-2 text-base font-normal leading-none"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Tabs */.tUM, {
    value: operation.value
  }, /*#__PURE__*/react.createElement(ui_next_src/* TabsList */.j7C, {
    className: "inline-flex space-x-1"
  }, options.map(option => {
    const {
      value,
      icon
    } = option;
    return /*#__PURE__*/react.createElement(ui_next_src/* TabsTrigger */.Xib, {
      value: value,
      key: `logical-contour-operation-${value}`,
      onClick: () => setOperation(option)
    }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ByName, {
      name: icon
    }));
  }))), /*#__PURE__*/react.createElement("div", null, t(operation.label))), /*#__PURE__*/react.createElement("div", {
    className: "bg-primary-dark flex h-[62px] w-[88px] items-center justify-center rounded-lg"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ByName, {
    name: operation.helperIcon
  }))), /*#__PURE__*/react.createElement(SegmentSelector, {
    label: "A",
    value: segmentA,
    onValueChange: setSegmentA,
    segments: segments
  }), /*#__PURE__*/react.createElement(SegmentSelector, {
    label: "B",
    value: segmentB,
    onValueChange: setSegmentB,
    segments: segments
  }), /*#__PURE__*/react.createElement("div", {
    className: "flex justify-end pl-[34px]"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    className: "border-primary/60 grow border",
    variant: "ghost",
    onClick: () => {
      applyLogicalContourOperation();
    }
  }, t(operation.label))), /*#__PURE__*/react.createElement(ui_next_src/* Separator */.wvv, {
    className: "bg-input mt-2 h-[1px]"
  }), /*#__PURE__*/react.createElement("div", {
    className: "flex flex-col gap-2"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex items-center justify-start gap-2"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Switch */.dOG, {
    id: "logical-contour-operations-create-new-segment-switch",
    onCheckedChange: setCreateNewSegment
  }), /*#__PURE__*/react.createElement(ui_next_src/* Label */.JU7, {
    htmlFor: "logical-contour-operations-create-new-segment-switch"
  }, t('Create a new segment'))), /*#__PURE__*/react.createElement("div", {
    className: "pl-9"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Input */.pde, {
    className: (0,ui_next_src.cn)(createNewSegment ? 'visible' : 'hidden'),
    disabled: !createNewSegment,
    id: "logical-contour-operations-create-new-segment-input",
    type: "text",
    placeholder: t('New segment name'),
    value: newSegmentName,
    onChange: e => setNewSegmentName(e.target.value)
  }))));
}
/* harmony default export */ const LogicalContourOperationsOptions = (LogicalContourOperationOptions);
;// ../../../extensions/cornerstone-dicom-seg/src/components/SimplifyContourOptions.tsx




function SimplifyContourOptions() {
  const [areaThreshold, setAreaThreshold] = (0,react.useState)(10);
  const runCommand = (0,src.useRunCommand)();
  const {
    t
  } = (0,es/* useTranslation */.Bd)('SegmentationPanel');
  return /*#__PURE__*/react.createElement("div", {
    className: "flex w-auto w-[252px] flex-col gap-[8px] text-base font-normal leading-none"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex w-auto flex-col gap-[10px] text-base font-normal leading-none"
  }, /*#__PURE__*/react.createElement("div", null, t('Fill contour holes')), /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    className: "border-primary/60 border",
    variant: "ghost",
    onClick: () => {
      runCommand('removeContourHoles');
    }
  }, t('Fill Holes')), /*#__PURE__*/react.createElement(ui_next_src/* Separator */.wvv, {
    className: "bg-input mt-[20px] h-[1px]"
  })), /*#__PURE__*/react.createElement("div", {
    className: "flex w-auto flex-col gap-[10px] text-base font-normal leading-none"
  }, /*#__PURE__*/react.createElement("div", null, t('Remove Small Contours')), /*#__PURE__*/react.createElement("div", {
    className: "flex items-center gap-2 self-end"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Label */.JU7, {
    htmlFor: "simplify-contour-options",
    className: "text-muted-foreground"
  }, t('Area Threshold')), /*#__PURE__*/react.createElement(ui_next_src/* Input */.pde, {
    id: "simplify-contour-options",
    className: "w-20",
    type: "number",
    value: areaThreshold,
    onChange: e => setAreaThreshold(Number(e.target.value))
  })), /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    className: "border-primary/60 border",
    variant: "ghost",
    onClick: () => {
      runCommand('removeSmallContours', {
        areaThreshold
      });
    }
  }, t('Remove Small Contours')), /*#__PURE__*/react.createElement(ui_next_src/* Separator */.wvv, {
    className: "bg-input mt-[20px] h-[1px]"
  })), /*#__PURE__*/react.createElement("div", {
    className: "flex w-auto flex-col gap-[10px] text-base font-normal leading-none"
  }, /*#__PURE__*/react.createElement("div", null, t('Create New Segment from Holes')), /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    className: "border-primary/60 border",
    variant: "ghost",
    onClick: () => {
      runCommand('convertContourHoles');
    }
  }, t('Create New Segment'))));
}
/* harmony default export */ const components_SimplifyContourOptions = (SimplifyContourOptions);
;// ../../../extensions/cornerstone-dicom-seg/src/components/SmoothContoursOptions.tsx




function SmoothContoursOptions() {
  const runCommand = (0,src.useRunCommand)();
  const {
    t
  } = (0,es/* useTranslation */.Bd)('SegmentationPanel');
  return /*#__PURE__*/react.createElement("div", {
    className: "flex w-auto w-[245px] flex-col gap-[8px] text-base font-normal leading-none"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex w-auto flex-col gap-[10px] text-base font-normal leading-none"
  }, /*#__PURE__*/react.createElement("div", null, t('Smooth all edges')), /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    className: "border-primary/60 border",
    variant: "ghost",
    onClick: () => {
      runCommand('smoothContours');
    }
  }, t('Smooth Edges')), /*#__PURE__*/react.createElement(ui_next_src/* Separator */.wvv, {
    className: "bg-input mt-[20px] h-[1px]"
  })), /*#__PURE__*/react.createElement("div", {
    className: "flex w-auto flex-col gap-[10px] text-base font-normal leading-none"
  }, /*#__PURE__*/react.createElement("div", null, t('Remove extra points')), /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    className: "border-primary/60 border",
    variant: "ghost",
    onClick: () => {
      runCommand('decimateContours');
    }
  }, t('Remove Points'))));
}
/* harmony default export */ const components_SmoothContoursOptions = (SmoothContoursOptions);
;// ../../../extensions/cornerstone-dicom-seg/src/getToolbarModule.ts






function getToolbarModule({
  servicesManager
}) {
  const {
    segmentationService,
    toolbarService,
    toolGroupService
  } = servicesManager.services;
  return [{
    name: 'cornerstone.SimplifyContourOptions',
    defaultComponent: components_SimplifyContourOptions
  }, {
    name: 'cornerstone.LogicalContourOperationsOptions',
    defaultComponent: LogicalContourOperationsOptions
  }, {
    name: 'cornerstone.SmoothContoursOptions',
    defaultComponent: components_SmoothContoursOptions
  }, {
    name: 'cornerstone.isActiveSegmentationUtility',
    evaluate: ({
      button
    }) => {
      const {
        uiState
      } = default_src/* useUIStateStore */.FS.getState();
      return {
        isActive: uiState[`activeSegmentationUtility`] === button.id
      };
    }
  }, {
    name: 'evaluate.cornerstone.hasSegmentation',
    evaluate: ({
      viewportId
    }) => {
      const segmentations = segmentationService.getSegmentationRepresentations(viewportId);
      return {
        disabled: !segmentations?.length
      };
    }
  }, {
    name: 'evaluate.cornerstone.hasSegmentationOfType',
    evaluate: ({
      viewportId,
      segmentationRepresentationType
    }) => {
      const segmentations = segmentationService.getSegmentationRepresentations(viewportId);
      if (!segmentations?.length) {
        return {
          disabled: true,
          disabledText: i18n_src/* default */.A.t('SegmentationPanel:No segmentations available')
        };
      }
      if (!segmentations.some(segmentation => Boolean(segmentation.type === segmentationRepresentationType))) {
        return {
          disabled: true,
          disabledText: `No ${segmentationRepresentationType} segmentations available`
        };
      }
    }
  }, {
    name: 'evaluate.cornerstone.segmentation',
    evaluate: ({
      viewportId,
      button,
      toolNames,
      disabledText
    }) => {
      // Todo: we need to pass in the button section Id since we are kind of
      // forcing the button to have black background since initially
      // it is designed for the toolbox not the toolbar on top
      // we should then branch the buttonSectionId to have different styles
      const segmentations = segmentationService.getSegmentationRepresentations(viewportId);
      if (!segmentations?.length) {
        return {
          disabled: true,
          disabledText: disabledText ?? i18n_src/* default */.A.t('SegmentationPanel:No segmentations available')
        };
      }
      const activeSegmentation = segmentationService.getActiveSegmentation(viewportId);
      if (!Object.keys(activeSegmentation.segments).length) {
        return {
          disabled: true,
          disabledText: i18n_src/* default */.A.t('SegmentationPanel:Add segment to enable this tool')
        };
      }
      const toolGroup = toolGroupService.getToolGroupForViewport(viewportId);
      if (!toolGroup) {
        return {
          disabled: true,
          disabledText: disabledText ?? i18n_src/* default */.A.t('SegmentationPanel:Not available on the current viewport')
        };
      }
      if (!toolNames) {
        return {
          disabled: false
          // isActive: false,
        };
      }
      const toolName = toolbarService.getToolNameForButton(button);
      if (!toolGroup.hasTool(toolName) && !toolNames) {
        return {
          disabled: true,
          disabledText: disabledText ?? i18n_src/* default */.A.t('SegmentationPanel:Not available on the current viewport')
        };
      }
      const isPrimaryActive = toolNames ? toolNames.includes(toolGroup.getActivePrimaryMouseButtonTool()) : toolGroup.getActivePrimaryMouseButtonTool() === toolName;
      return {
        disabled: false,
        isActive: isPrimaryActive
      };
    }
  }, {
    name: 'evaluate.cornerstone.segmentation.synchronizeDrawingRadius',
    evaluate: ({
      button,
      radiusOptionId
    }) => {
      const toolGroupIds = toolGroupService.getToolGroupIds();
      if (!toolGroupIds?.length) {
        return;
      }
      for (const toolGroupId of toolGroupIds) {
        const brushSize = dist_esm.utilities.segmentation.getBrushSizeForToolGroup(toolGroupId);
        if (brushSize) {
          const option = toolbarService.getOptionById(button, radiusOptionId);
          option.value = brushSize;
        }
      }
    }
  }];
}
;// ../../../extensions/cornerstone-dicom-seg/src/index.tsx
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }






const Component = /*#__PURE__*/react.lazy(() => {
  return __webpack_require__.e(/* import() */ 9845).then(__webpack_require__.bind(__webpack_require__, 69845));
});
const OHIFCornerstoneSEGViewport = props => {
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
  getCommandsModule: src_commandsModule,
  getToolbarModule: getToolbarModule,
  getViewportModule({
    servicesManager,
    extensionManager,
    commandsManager
  }) {
    const ExtendedOHIFCornerstoneSEGViewport = props => {
      return /*#__PURE__*/react.createElement(OHIFCornerstoneSEGViewport, _extends({
        servicesManager: servicesManager,
        extensionManager: extensionManager,
        commandsManager: commandsManager
      }, props));
    };
    return [{
      name: 'dicom-seg',
      component: ExtendedOHIFCornerstoneSEGViewport
    }];
  },
  /**
   * SopClassHandlerModule should provide a list of sop class handlers that will be
   * available in OHIF for Modes to consume and use to create displaySets from Series.
   * Each sop class handler is defined by a { name, sopClassUids, getDisplaySetsFromSeries}.
   * Examples include the default sop class handler provided by the default extension
   */
  getSopClassHandlerModule: src_getSopClassHandlerModule,
  getHangingProtocolModule: src_getHangingProtocolModule
};
/* harmony default export */ const cornerstone_dicom_seg_src = (extension);

/***/ }

}]);