"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[9162],{

/***/ 38007:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Ne: () => (/* reexport */ useViewportDisplaySets/* useViewportDisplaySets */.N),
  uY: () => (/* reexport */ useViewportHover),
  eH: () => (/* reexport */ useViewportRendering/* useViewportRendering */.e),
  Lt: () => (/* reexport */ useViewportSegmentations/* useViewportSegmentations */.L)
});

// UNUSED EXPORTS: useActiveViewportSegmentationRepresentations, useMeasurementTracking, useMeasurements, useSegmentations

// EXTERNAL MODULE: ../../../extensions/cornerstone/src/hooks/useActiveViewportSegmentationRepresentations.ts
var useActiveViewportSegmentationRepresentations = __webpack_require__(9234);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/hooks/useMeasurements.ts
var useMeasurements = __webpack_require__(19214);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/hooks/useSegmentations.ts
var useSegmentations = __webpack_require__(73421);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/hooks/useViewportSegmentations.ts
var useViewportSegmentations = __webpack_require__(79063);
// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../ui-next/src/index.ts + 3073 modules
var src = __webpack_require__(17130);
;// ../../../extensions/cornerstone/src/hooks/useViewportHover.ts



/**
 * Hook to track whether the mouse is hovering over a specific viewport
 * and whether the viewport is active
 *
 * @param viewportId - The ID of the viewport to track
 * @returns { isHovered, isActive } - Whether the viewport is hovered and active
 */
function useViewportHover(viewportId) {
  const [isHovered, setIsHovered] = (0,react.useState)(false);
  const [viewportGrid] = (0,src/* useViewportGrid */.ihW)();
  const {
    activeViewportId
  } = viewportGrid;
  const isActive = activeViewportId === viewportId;
  const setupListeners = (0,react.useCallback)(() => {
    const viewportElement = document.querySelector(`[data-viewportid="${viewportId}"]`);
    const element = viewportElement?.closest('.viewport-wrapper') || viewportElement;
    if (!element) {
      return null;
    }
    let elementRect = element.getBoundingClientRect();
    let lastIsInside = false;

    // Update rectangle when window is resized
    const updateRect = () => {
      elementRect = element.getBoundingClientRect();
    };
    const isPointInViewport = (x, y) => {
      return x >= elementRect.left && x <= elementRect.right && y >= elementRect.top && y <= elementRect.bottom;
    };
    const handleMouseMove = event => {
      const isInside = isPointInViewport(event.clientX, event.clientY);
      if (isInside !== lastIsInside) {
        lastIsInside = isInside;
        setIsHovered(isInside);
      }
    };
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateRect, 10);
    };
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousemove', handleMouseMove);
    updateRect();
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(resizeTimeout);
    };
  }, [viewportId]);
  (0,react.useEffect)(() => {
    const cleanup = setupListeners();
    return cleanup;
  }, [setupListeners]);

  // Memoize the return value to prevent unnecessary re-renders
  return (0,react.useMemo)(() => ({
    isHovered,
    isActive
  }), [isHovered, isActive]);
}
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/hooks/useViewportDisplaySets.ts + 1 modules
var useViewportDisplaySets = __webpack_require__(10225);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/hooks/useMeasurementTracking.ts
var useMeasurementTracking = __webpack_require__(84535);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/hooks/useViewportRendering.tsx
var useViewportRendering = __webpack_require__(47488);
;// ../../../extensions/cornerstone/src/hooks/index.ts









/***/ }),

/***/ 9234:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: () => (/* binding */ useActiveViewportSegmentationRepresentations)
/* harmony export */ });
/* harmony import */ var _ohif_ui_next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17130);
/* harmony import */ var _useViewportSegmentations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(79063);


function useActiveViewportSegmentationRepresentations() {
  const [viewportGrid] = (0,_ohif_ui_next__WEBPACK_IMPORTED_MODULE_0__/* .useViewportGrid */ .ihW)();
  const viewportId = viewportGrid?.activeViewportId;
  const segmentations = (0,_useViewportSegmentations__WEBPACK_IMPORTED_MODULE_1__/* .useViewportSegmentations */ .L)({
    viewportId
  });
  return segmentations;
}


/***/ }),

/***/ 84535:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   R: () => (/* binding */ useMeasurementTracking)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(86326);
/* harmony import */ var _ohif_core_src__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15871);
/* harmony import */ var _useViewportDisplaySets__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(10225);
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(15327);





/**
 * Hook that provides measurement tracking information for a viewport
 *
 * @param options - The hook options
 * @param options.viewportId - The ID of the viewport to track
 * @returns An object containing the tracking state, related information, and tracked measurement UIDs
 */
function useMeasurementTracking({
  viewportId
}) {
  const {
    servicesManager
  } = (0,_ohif_core_src__WEBPACK_IMPORTED_MODULE_1__.useSystem)();
  const {
    cornerstoneViewportService,
    trackedMeasurementsService,
    measurementService
  } = servicesManager.services;
  const {
    backgroundDisplaySet
  } = (0,_useViewportDisplaySets__WEBPACK_IMPORTED_MODULE_2__/* .useViewportDisplaySets */ .N)(viewportId);

  // Tracking states
  const [isTracked, setIsTracked] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isLocked, setIsLocked] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [trackedMeasurementUIDs, setTrackedMeasurementUIDs] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const updateTrackedMeasurements = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (!measurementService || !backgroundDisplaySet?.SeriesInstanceUID || !isTracked) {
      setTrackedMeasurementUIDs([]);
      return;
    }
    const seriesInstanceUID = backgroundDisplaySet.SeriesInstanceUID;
    const seriesMeasurements = measurementService.getMeasurements(measurement => measurement.referenceSeriesUID === seriesInstanceUID);
    const uids = seriesMeasurements.map(measurement => measurement.uid);
    setTrackedMeasurementUIDs(uids);
  }, [measurementService, backgroundDisplaySet, isTracked]);
  const updateIsTracked = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (!trackedMeasurementsService || !backgroundDisplaySet?.SeriesInstanceUID) {
      setIsTracked(false);
      return;
    }
    const trackedSeries = trackedMeasurementsService.getTrackedSeries();
    if (!trackedSeries?.length) {
      setIsTracked(false);
      return;
    }
    const viewport = cornerstoneViewportService?.getCornerstoneViewport(viewportId);
    const SeriesInstanceUID = backgroundDisplaySet.SeriesInstanceUID;
    if (viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.BaseVolumeViewport) {
      const currentImageId = viewport?.getCurrentImageId();
      if (!currentImageId) {
        setIsTracked(false);
        return;
      }
    }
    const seriesIsTracked = trackedSeries.includes(SeriesInstanceUID);
    setIsTracked(seriesIsTracked);
  }, [viewportId, backgroundDisplaySet, cornerstoneViewportService, trackedMeasurementsService]);

  // Update tracked measurements whenever tracking state changes
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    updateTrackedMeasurements();
  }, [isTracked, updateTrackedMeasurements]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!trackedMeasurementsService) {
      return;
    }
    setIsLocked(trackedMeasurementsService.isTrackingEnabled());
    updateIsTracked();
    const subscriptions = [trackedMeasurementsService.subscribe(trackedMeasurementsService.EVENTS.TRACKING_ENABLED, () => setIsLocked(true)), trackedMeasurementsService.subscribe(trackedMeasurementsService.EVENTS.TRACKING_DISABLED, () => setIsLocked(false)), trackedMeasurementsService.subscribe(trackedMeasurementsService.EVENTS.TRACKED_SERIES_CHANGED, () => updateIsTracked()), trackedMeasurementsService.subscribe(trackedMeasurementsService.EVENTS.SERIES_ADDED, () => updateIsTracked()), trackedMeasurementsService.subscribe(trackedMeasurementsService.EVENTS.SERIES_REMOVED, () => updateIsTracked())];

    // Subscribe to measurement service events to update trackedMeasurementUIDs
    if (measurementService) {
      [measurementService.EVENTS.MEASUREMENT_ADDED, measurementService.EVENTS.RAW_MEASUREMENT_ADDED, measurementService.EVENTS.MEASUREMENT_UPDATED, measurementService.EVENTS.MEASUREMENT_REMOVED, measurementService.EVENTS.MEASUREMENTS_CLEARED].forEach(eventType => {
        subscriptions.push(measurementService.subscribe(eventType, () => updateTrackedMeasurements()));
      });
    }
    return () => {
      subscriptions.forEach(sub => sub.unsubscribe());
    };
  }, [trackedMeasurementsService, measurementService, updateIsTracked, updateTrackedMeasurements]);
  return {
    isTracked,
    isLocked,
    seriesInstanceUID: backgroundDisplaySet?.SeriesInstanceUID,
    trackedMeasurementUIDs
  };
}
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (useMeasurementTracking)));

/***/ }),

/***/ 19214:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   d: () => (/* binding */ useMeasurements)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(86326);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62051);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ohif_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(15871);



function mapMeasurementToDisplay(measurement, displaySetService) {
  const {
    referenceSeriesUID
  } = measurement;
  const displaySets = displaySetService.getDisplaySetsForSeries(referenceSeriesUID);
  if (!displaySets[0]?.instances) {
    throw new Error('The tracked measurements panel should only be tracking "stack" displaySets.');
  }
  const {
    findingSites,
    finding,
    label: baseLabel,
    displayText: baseDisplayText
  } = measurement;
  const firstSite = findingSites?.[0];
  const label = baseLabel || finding?.text || firstSite?.text || '(empty)';

  // Initialize displayText with the structure used in Length.ts and CobbAngle.ts
  const displayText = {
    primary: [],
    secondary: baseDisplayText?.secondary || []
  };

  // Add baseDisplayText to primary if it exists
  if (baseDisplayText) {
    displayText.primary.push(...baseDisplayText.primary);
  }

  // Add finding sites to primary
  if (findingSites) {
    findingSites.forEach(site => {
      if (site?.text && site.text !== label) {
        displayText.primary.push(site.text);
      }
    });
  }

  // Add finding to primary if it's different from the label
  if (finding && finding.text && finding.text !== label) {
    displayText.primary.push(finding.text);
  }
  return {
    ...measurement,
    displayText,
    label
  };
}

/**
 * A custom hook that provides mapped measurements based on the given services and filters.
 *
 * @param {Object} servicesManager - The services manager object.
 * @param {Object} options - The options for filtering and mapping measurements.
 * @param {Function} options.measurementFilter - Optional function to filter measurements.
 * @param {Object} options.valueTypes - The value types for mapping measurements.
 * @returns {Array} An array of mapped and filtered measurements.
 */
function useMeasurements({
  measurementFilter
} = {
  measurementFilter: () => true
}) {
  const {
    servicesManager
  } = (0,_ohif_core__WEBPACK_IMPORTED_MODULE_2__.useSystem)();
  const {
    measurementService,
    displaySetService
  } = servicesManager.services;
  const [displayMeasurements, setDisplayMeasurements] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const updateDisplayMeasurements = () => {
      const measurements = measurementService.getMeasurements(measurementFilter);
      const mappedMeasurements = measurements.map(m => mapMeasurementToDisplay(m, displaySetService));
      setDisplayMeasurements(prevMeasurements => {
        if (JSON.stringify(prevMeasurements) !== JSON.stringify(mappedMeasurements)) {
          return mappedMeasurements;
        }
        return prevMeasurements;
      });
    };
    const debouncedUpdate = lodash_debounce__WEBPACK_IMPORTED_MODULE_1___default()(updateDisplayMeasurements, 100);
    updateDisplayMeasurements();
    const events = [measurementService.EVENTS.MEASUREMENT_ADDED, measurementService.EVENTS.RAW_MEASUREMENT_ADDED, measurementService.EVENTS.MEASUREMENT_UPDATED, measurementService.EVENTS.MEASUREMENT_REMOVED, measurementService.EVENTS.MEASUREMENTS_CLEARED];
    const subscriptions = events.map(evt => measurementService.subscribe(evt, debouncedUpdate).unsubscribe);
    return () => {
      subscriptions.forEach(unsub => unsub());
      debouncedUpdate.cancel();
    };
  }, [measurementService, measurementFilter, displaySetService]);
  return displayMeasurements;
}

/***/ }),

/***/ 73421:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   j: () => (/* binding */ useSegmentations)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(86326);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62051);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ohif_core_src_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(80735);
/* harmony import */ var _ohif_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(15871);




function mapSegmentationToDisplay(segmentation, customizationService) {
  const {
    label,
    segments
  } = segmentation;

  // Get the readable text mapping once
  const readableTextMap = customizationService.getCustomization('panelSegmentation.readableText');

  // Helper function to recursively map cachedStats to readable display text
  function mapStatsToDisplay(stats, indent = 0) {
    const primary = [];
    const indentation = '  '.repeat(indent);
    for (const key in stats) {
      if (Object.prototype.hasOwnProperty.call(stats, key)) {
        const value = stats[key];
        const readableText = readableTextMap?.[key];
        if (!readableText) {
          continue;
        }
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Add empty row before category (except for the first category)
          if (primary.length > 0) {
            primary.push('');
          }
          // Add category title
          primary.push(`${indentation}${readableText}`);
          // Recursively handle nested objects
          primary.push(...mapStatsToDisplay(value, indent + 1));
        } else {
          // For non-nested values, don't add empty rows
          primary.push(`${indentation}${readableText}: ${(0,_ohif_core_src_utils__WEBPACK_IMPORTED_MODULE_2__/* .roundNumber */ .Wf)(value, 2)}`);
        }
      }
    }
    return primary;
  }

  // Get customization for display text mapping
  const displayTextMapper = segment => {
    const defaultDisplay = {
      primary: [],
      secondary: []
    };

    // If the segment has cachedStats, map it to readable text
    if (segment.cachedStats) {
      const primary = mapStatsToDisplay(segment.cachedStats);
      defaultDisplay.primary = primary;
    }
    return defaultDisplay;
  };
  const updatedSegments = {};
  Object.entries(segments).forEach(([segmentIndex, segment]) => {
    updatedSegments[segmentIndex] = {
      ...segment,
      displayText: displayTextMapper(segment)
    };
  });

  // Map the segments and apply the display text mapper
  return {
    ...segmentation,
    label,
    segments: updatedSegments
  };
}

/**
 * Custom hook that provides segmentation data.
 * @param options - The options object.
 * @param options.servicesManager - The services manager object.
 * @param options.subscribeToDataModified - Whether to subscribe to segmentation data modifications.
 * @param options.debounceTime - Debounce time in milliseconds for updates.
 * @returns An array of segmentation data.
 */
function useSegmentations(options) {
  const {
    subscribeToDataModified = false,
    debounceTime = 0
  } = options || {};
  const {
    servicesManager
  } = (0,_ohif_core__WEBPACK_IMPORTED_MODULE_3__.useSystem)();
  const {
    segmentationService,
    customizationService
  } = servicesManager.services;
  const [segmentations, setSegmentations] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const update = () => {
      const segmentations = segmentationService.getSegmentations();
      if (!segmentations?.length) {
        setSegmentations([]);
        return;
      }
      const mappedSegmentations = segmentations.map(segmentation => mapSegmentationToDisplay(segmentation, customizationService));
      setSegmentations(mappedSegmentations);
    };
    const debouncedUpdate = debounceTime > 0 ? lodash_debounce__WEBPACK_IMPORTED_MODULE_1___default()(update, debounceTime, {
      leading: true,
      trailing: true
    }) : update;
    update();
    const subscriptions = [segmentationService.subscribe(segmentationService.EVENTS.SEGMENTATION_MODIFIED, debouncedUpdate), segmentationService.subscribe(segmentationService.EVENTS.SEGMENTATION_REMOVED, debouncedUpdate)];
    if (subscribeToDataModified) {
      subscriptions.push(segmentationService.subscribe(segmentationService.EVENTS.SEGMENTATION_DATA_MODIFIED, debouncedUpdate));
    }
    return () => {
      subscriptions.forEach(subscription => subscription.unsubscribe());
      if (debounceTime > 0) {
        debouncedUpdate.cancel();
      }
    };
  }, [segmentationService, customizationService, debounceTime, subscribeToDataModified]);
  return segmentations;
}

/***/ }),

/***/ 10225:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  N: () => (/* binding */ useViewportDisplaySets)
});

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../core/src/index.ts + 68 modules
var src = __webpack_require__(15871);
// EXTERNAL MODULE: ../../ui-next/src/index.ts + 3073 modules
var ui_next_src = __webpack_require__(17130);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
;// ../../../extensions/cornerstone/src/components/ViewportDataOverlaySettingMenu/utils.ts

const DEFAULT_COLORMAP = 'hsv';
const DEFAULT_OPACITY = 0.5;
const DEFAULT_OPACITY_PERCENT = DEFAULT_OPACITY * 100;
const DERIVED_OVERLAY_MODALITIES = ['SEG', 'RTSTRUCT'];

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
 * Identifies display sets that can be used as overlays for a specific viewport.
 *
 * "Enhanced" display sets are those that:
 * 1. Are not already in the viewport
 * 2. Are evaluated for their ability to be overlaid onto the background display set
 * 3. Have an "isOverlayable" flag indicating if they're compatible with the viewport
 *
 * A display set is considered overlayable when:
 * - The background display set is reconstructable
 * - The display set is not unsupported
 * - The Frame of Reference matches the background display set
 * - For non-derived modalities: background can be a volume and display set is either multiframe or valid volume
 *
 * @returns {Object} Object containing:
 *   - viewportDisplaySets: Display sets already in the viewport
 *   - enhancedDisplaySets: Other display sets with overlayability assessment
 */
function getEnhancedDisplaySets({
  viewportId,
  services
}) {
  const {
    displaySetService,
    viewportGridService
  } = services;
  const displaySetsUIDs = viewportGridService.getDisplaySetsUIDsForViewport(viewportId);
  if (!displaySetsUIDs?.length) {
    return {
      viewportDisplaySets: [],
      enhancedDisplaySets: []
    };
  }
  const allDisplaySets = displaySetService.getActiveDisplaySets();
  const otherDisplaySets = allDisplaySets.filter(displaySet => !displaySetsUIDs.includes(displaySet.displaySetInstanceUID));
  const viewportDisplaySets = displaySetsUIDs.map(displaySetUID => displaySetService.getDisplaySetByUID(displaySetUID));
  const backgroundCanBeVolume = esm.utilities.isValidVolume(viewportDisplaySets[0].imageIds || []);
  const backgroundDisplaySet = viewportDisplaySets[0];
  const enhancedDisplaySets = otherDisplaySets.map(displaySet => {
    if (!backgroundDisplaySet.isReconstructable) {
      return {
        ...displaySet,
        isOverlayable: false
      };
    }
    if (displaySet.unsupported) {
      return {
        ...displaySet,
        isOverlayable: false
      };
    }

    // Check if Frame of Reference matches
    if (displaySet.FrameOfReferenceUID && displaySet.FrameOfReferenceUID !== backgroundDisplaySet.FrameOfReferenceUID) {
      return {
        ...displaySet,
        isOverlayable: false
      };
    }

    // Special handling for derived modalities
    if (!DERIVED_OVERLAY_MODALITIES.includes(displaySet.Modality)) {
      if (!backgroundCanBeVolume) {
        return {
          ...displaySet,
          isOverlayable: false
        };
      }
      const imageIds = displaySet.imageIds || displaySet.images?.map(image => image.imageId);
      const isMultiframe = displaySet.isMultiFrame;
      if (!isMultiframe && imageIds?.length > 0 && !esm.utilities.isValidVolume(imageIds)) {
        return {
          ...displaySet,
          isOverlayable: false
        };
      }
    }
    return {
      ...displaySet,
      isOverlayable: true
    };
  });
  return {
    viewportDisplaySets,
    enhancedDisplaySets
  };
}

/**
 * Sort function: puts disabled items (isOverlayable: false) at the end
 */
const sortByOverlayable = (a, b) => {
  if (a.isOverlayable === b.isOverlayable) {
    return 0;
  }
  return a.isOverlayable ? -1 : 1;
};

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
 * Get segmentations that can be added as overlays to the viewport
 *
 * Note: This function is deprecated as we now use display sets for segmentations
 */
function getAvailableSegmentations(segmentationService) {
  const segmentations = segmentationService.getSegmentations() || [];
  return segmentations.map(segmentation => ({
    segmentationId: segmentation.segmentationId,
    label: segmentation.label || 'Segmentation',
    segments: segmentation.segments,
    frameOfReferenceUID: segmentation.frameOfReferenceUID
  }));
}
;// ../../../extensions/cornerstone/src/hooks/useViewportDisplaySets.ts




const sortByPriority = (a, b) => {
  if (src.utils.isLowPriorityModality(a.Modality)) {
    return 1;
  }
  return -1;
};

/**
 * Options for the useViewportDisplaySets hook
 */

/**
 * Return type for useViewportDisplaySets
 */

/**
 * Hook to provide display sets and overlay information for a viewport based on options.
 *
 * @param viewportId - The viewport ID to get display sets for
 * @param options - Options to control which display sets to compute
 * @returns Object containing requested display set collections based on options
 */
function useViewportDisplaySets(viewportId, options) {
  const {
    servicesManager
  } = (0,src.useSystem)();
  const {
    displaySetService,
    segmentationService
  } = servicesManager.services;

  // Note: this is very important we should use the useViewportGrid hook here,
  // since if the viewport displaySet is changed we should re-run this hook
  // to get the latest displaySets
  const [viewportGridState, viewportGridService] = (0,ui_next_src/* useViewportGrid */.ihW)();
  const viewportIdToUse = viewportId || viewportGridState.activeViewportId;

  // Apply defaults - include everything if no options specified
  const {
    includeBackground = true,
    includeForeground = true,
    includeOverlay = true,
    includePotentialOverlay = true,
    includePotentialForeground = true,
    includePotentialBackground = true
  } = options || {};

  // Get all available display sets (only if needed)
  const needsAllDisplaySets = includePotentialBackground;
  const allDisplaySets = (0,react.useMemo)(() => needsAllDisplaySets ? displaySetService.getActiveDisplaySets() : [], [displaySetService, needsAllDisplaySets]);

  // Get all available segmentations (only if needed)
  const needsSegmentations = includeOverlay;
  const [segmentationRepresentations, setSegmentationRepresentations] = (0,react.useState)(needsSegmentations ? segmentationService.getSegmentationRepresentations(viewportIdToUse) : []);
  (0,react.useEffect)(() => {
    setSegmentationRepresentations(needsSegmentations ? segmentationService.getSegmentationRepresentations(viewportIdToUse) : []);
    const unsubscribeArr = needsSegmentations ? [segmentationService.EVENTS.SEGMENTATION_REPRESENTATION_MODIFIED, segmentationService.EVENTS.SEGMENTATION_REPRESENTATION_REMOVED].map(event => segmentationService.subscribe(event, () => {
      setSegmentationRepresentations(segmentationService.getSegmentationRepresentations(viewportIdToUse));
    })) : [];
    return () => {
      unsubscribeArr.forEach(item => item.unsubscribe());
    };
  }, [segmentationService, viewportIdToUse, needsSegmentations]);
  const overlayDisplaySets = (0,react.useMemo)(() => {
    if (!includeOverlay) {
      return [];
    }
    return segmentationRepresentations.map(repr => {
      const displaySet = displaySetService.getDisplaySetByUID(repr.segmentationId);
      return displaySet;
    });
  }, [includeOverlay, segmentationRepresentations, displaySetService]);
  const overlayDisplaySetUIDs = (0,react.useMemo)(() => {
    return overlayDisplaySets.map(ds => ds.displaySetInstanceUID);
  }, [overlayDisplaySets]);

  // Get enhanced display sets (only if needed)
  const needsEnhancedDisplaySets = includeBackground || includeForeground || includePotentialOverlay || includePotentialForeground;
  const {
    viewportDisplaySets = [],
    enhancedDisplaySets = []
  } = (0,react.useMemo)(() => {
    if (!needsEnhancedDisplaySets) {
      return {
        viewportDisplaySets: [],
        enhancedDisplaySets: []
      };
    }
    return getEnhancedDisplaySets({
      viewportId: viewportIdToUse,
      services: {
        displaySetService,
        viewportGridService
      }
    }) || {
      viewportDisplaySets: [],
      enhancedDisplaySets: []
    };
  }, [viewportIdToUse, displaySetService, viewportGridService, needsEnhancedDisplaySets]);
  const backgroundDisplaySet = (0,react.useMemo)(() => includeBackground && viewportDisplaySets.length > 0 ? viewportDisplaySets[0] : undefined, [includeBackground, viewportDisplaySets]);
  const foregroundDisplaySets = (0,react.useMemo)(() => {
    if (!includeForeground || !backgroundDisplaySet) {
      return [];
    }
    return viewportDisplaySets.filter(ds => !DERIVED_OVERLAY_MODALITIES.includes(ds.Modality) && ds.displaySetInstanceUID !== backgroundDisplaySet.displaySetInstanceUID);
  }, [includeForeground, viewportDisplaySets, backgroundDisplaySet]);
  const foregroundDisplaySetUIDs = (0,react.useMemo)(() => foregroundDisplaySets.map(ds => ds.displaySetInstanceUID), [foregroundDisplaySets]);
  const potentialOverlayDisplaySets = (0,react.useMemo)(() => {
    if (!includePotentialOverlay) {
      return [];
    }
    return enhancedDisplaySets.filter(ds => DERIVED_OVERLAY_MODALITIES.includes(ds.Modality) && !overlayDisplaySetUIDs.includes(ds.displaySetInstanceUID) && ds.isOverlayable).sort(sortByOverlayable);
  }, [includePotentialOverlay, enhancedDisplaySets, overlayDisplaySetUIDs]);
  const potentialForegroundDisplaySets = (0,react.useMemo)(() => {
    if (!includePotentialForeground) {
      return [];
    }
    return enhancedDisplaySets.filter(ds => !DERIVED_OVERLAY_MODALITIES.includes(ds.Modality) && !foregroundDisplaySetUIDs.includes(ds.displaySetInstanceUID) && ds.isOverlayable).sort(sortByPriority);
  }, [includePotentialForeground, enhancedDisplaySets, foregroundDisplaySetUIDs]);
  const potentialBackgroundDisplaySets = (0,react.useMemo)(() => {
    if (!includePotentialBackground || !backgroundDisplaySet) {
      return [];
    }
    return allDisplaySets.filter(ds => !DERIVED_OVERLAY_MODALITIES.includes(ds.Modality) && ds.displaySetInstanceUID !== backgroundDisplaySet.displaySetInstanceUID && !overlayDisplaySetUIDs.includes(ds.displaySetInstanceUID) && !foregroundDisplaySetUIDs.includes(ds.displaySetInstanceUID)).sort(sortByPriority);
  }, [includePotentialBackground, allDisplaySets, backgroundDisplaySet, overlayDisplaySetUIDs, foregroundDisplaySetUIDs]);
  const result = {
    allDisplaySets: allDisplaySets || [],
    viewportDisplaySets: viewportDisplaySets || []
  };
  if (includeBackground) {
    result.backgroundDisplaySet = backgroundDisplaySet;
  }
  if (includeForeground) {
    result.foregroundDisplaySets = foregroundDisplaySets;
  }
  if (includeOverlay) {
    result.overlayDisplaySets = overlayDisplaySets;
  }
  if (includePotentialOverlay) {
    result.potentialOverlayDisplaySets = potentialOverlayDisplaySets;
  }
  if (includePotentialForeground) {
    result.potentialForegroundDisplaySets = potentialForegroundDisplaySets;
  }
  if (includePotentialBackground) {
    result.potentialBackgroundDisplaySets = potentialBackgroundDisplaySets;
  }
  return result;
}

/***/ }),

/***/ 47488:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   e: () => (/* binding */ useViewportRendering)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(86326);
/* harmony import */ var _ohif_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15871);
/* harmony import */ var _useViewportDisplaySets__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(10225);
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(15327);
/* harmony import */ var _ohif_core_src_services_ToolBarService_ToolbarService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(93813);





const getPosition = location => {
  switch (location) {
    case _ohif_core_src_services_ToolBarService_ToolbarService__WEBPACK_IMPORTED_MODULE_4__/* .ButtonLocation */ .ij.LeftMiddle:
      return 'left';
    case _ohif_core_src_services_ToolBarService_ToolbarService__WEBPACK_IMPORTED_MODULE_4__/* .ButtonLocation */ .ij.RightMiddle:
      return 'right';
    case _ohif_core_src_services_ToolBarService_ToolbarService__WEBPACK_IMPORTED_MODULE_4__/* .ButtonLocation */ .ij.BottomMiddle:
      return 'bottom';
    case _ohif_core_src_services_ToolBarService_ToolbarService__WEBPACK_IMPORTED_MODULE_4__/* .ButtonLocation */ .ij.TopMiddle:
      return 'top';
    default:
      return 'bottom';
    // Default to bottom if location doesn't match a middle position
  }
};
const GAMMA = 1 / 5;
const linearToOpacity = linearValue => {
  return Math.pow(linearValue, GAMMA);
};
const opacityToLinear = opacityValue => {
  return Math.pow(opacityValue, 1.0 / GAMMA);
};
const is3DViewport = ({
  viewportId,
  cornerstoneViewportService
}) => {
  const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
  return viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.VolumeViewport3D;
};

/**
 * Hook to access window level functionality for a specific viewport
 *
 * @param viewportId - The ID of the viewport to get window level functionality for
 * @param options - Options for the hook, including location and displaySetInstanceUID
 * @returns Window level API for the specified viewport
 */
function useViewportRendering(viewportId, options) {
  const {
    servicesManager,
    commandsManager
  } = (0,_ohif_core__WEBPACK_IMPORTED_MODULE_1__.useSystem)();
  const {
    cornerstoneViewportService,
    colorbarService,
    customizationService
  } = servicesManager.services;
  const [is3DVolume, setIs3DVolume] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(is3DViewport({
    viewportId,
    cornerstoneViewportService
  }));
  const [hasColorbar, setHasColorbar] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(colorbarService.hasColorbar(viewportId));
  const [colorbarPosition, setColorbarPosition] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(options?.location ? getPosition(options.location) : 'bottom');
  const [voiRange, setVoiRange] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const voiRangeRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef();
  const [opacity, setOpacityState] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [opacityLinear, setOpacityLinearState] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [threshold, setThresholdState] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [pixelValueRange, setPixelValueRange] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    min: 0,
    max: 255
  });
  const {
    viewportDisplaySets
  } = (0,_useViewportDisplaySets__WEBPACK_IMPORTED_MODULE_2__/* .useViewportDisplaySets */ .N)(viewportId);
  const {
    displaySetService
  } = servicesManager.services;

  // Determine the active display set instance UID (internal only, not exposed)
  const activeDisplaySetInstanceUID = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (options?.displaySetInstanceUID) {
      return options.displaySetInstanceUID;
    }
    if (viewportDisplaySets && viewportDisplaySets.length > 0) {
      return viewportDisplaySets[0].displaySetInstanceUID;
    }
    return undefined;
  }, [options?.displaySetInstanceUID, viewportDisplaySets]);
  const viewportInfo = viewportId ? cornerstoneViewportService.getViewportInfo(viewportId) : null;
  const {
    presets,
    colorbarProperties,
    volumeRenderingPresets,
    volumeRenderingQualityRange
  } = getCustomizationData(customizationService);
  const backgroundColor = viewportInfo?.getViewportOptions().background;
  const isViewportBackgroundLight = backgroundColor ? _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.utilities.isEqual(backgroundColor, [1, 1, 1]) : false;
  const allWindowLevelPresets = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return viewportDisplaySets?.filter(displaySet => presets?.[displaySet.Modality]).map(displaySet => {
      return {
        displaySetInstanceUID: displaySet.displaySetInstanceUID,
        modality: displaySet.Modality,
        presets: presets[displaySet.Modality]
      };
    }) || [];
  }, [viewportDisplaySets, presets]);

  // Calculate pixel value range for the active display set
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!activeDisplaySetInstanceUID) {
      return;
    }
    const selectedDisplaySet = displaySetService.getDisplaySetByUID(activeDisplaySetInstanceUID);
    if (!selectedDisplaySet?.imageIds?.length) {
      return;
    }
    const csViewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
    if (!csViewport) {
      return;
    }
    if (!(csViewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.BaseVolumeViewport)) {
      return;
    }
    const volumeIds = csViewport.getAllVolumeIds();
    const volumeId = volumeIds.find(id => id.includes(activeDisplaySetInstanceUID));
    if (!volumeId) {
      return;
    }

    // only handle volume viewports for now
    const imageData = csViewport.getImageData(volumeId);
    if (!imageData) {
      return;
    }
    const imageDataVtk = imageData.imageData;
    const {
      voxelManager
    } = imageDataVtk.get('voxelManager');
    const range = voxelManager.getRange();
    setPixelValueRange({
      min: range[0],
      max: range[1]
    });
  }, [activeDisplaySetInstanceUID, displaySetService, cornerstoneViewportService, viewportId]);

  // Get the presets specifically for the active display set
  const activeDisplaySetPresets = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!activeDisplaySetInstanceUID || allWindowLevelPresets.length === 0) {
      return [];
    }
    const activePresetData = allWindowLevelPresets.find(preset => preset.displaySetInstanceUID === activeDisplaySetInstanceUID);
    if (!activePresetData) {
      return [];
    }
    return activePresetData.presets;
  }, [allWindowLevelPresets, activeDisplaySetInstanceUID]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setIs3DVolume(is3DViewport({
      viewportId,
      cornerstoneViewportService
    }));
    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);

    // Initialize the VOI range from the viewport
    if (viewport && activeDisplaySetInstanceUID) {
      try {
        let properties;
        if (viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.StackViewport) {
          properties = viewport.getProperties();
          if (properties.voiRange) {
            setVoiRange(properties.voiRange);
            voiRangeRef.current = properties.voiRange;
          }
        } else if (viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.BaseVolumeViewport) {
          // For volume viewports, find the actor for the active display set
          const volumeIds = viewport.getAllVolumeIds();
          const volumeId = volumeIds.find(id => id.includes(activeDisplaySetInstanceUID));
          if (volumeId) {
            properties = viewport.getProperties(volumeId);
            if (properties?.voiRange) {
              setVoiRange(properties.voiRange);
              voiRangeRef.current = properties.voiRange;
            }

            // Get opacity from colormap if available
            if (properties?.colormap?.opacity !== undefined) {
              const isArray = Array.isArray(properties.colormap.opacity);
              const opacity = isArray ? properties.colormap.opacity.reduce((max, current) => Math.max(max, current), 0) : properties.colormap.opacity;
              setOpacityState(opacity);
              setOpacityLinearState(opacityToLinear(opacity));
            }

            // Get threshold from colormap if available
            if (properties?.colormap && properties.colormap.threshold !== undefined) {
              setThresholdState(properties.colormap.threshold);
            }
          }
        }
      } catch (error) {
        console.error('Error initializing VOI range:', error);
      }
    }
  }, [cornerstoneViewportService, viewportId, activeDisplaySetInstanceUID]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!viewportId) {
      return;
    }
    const updateColorbarState = () => {
      const hasColorbarValue = colorbarService.hasColorbar(viewportId);
      setHasColorbar(hasColorbarValue);
    };
    updateColorbarState();
    const {
      unsubscribe
    } = colorbarService.subscribe(colorbarService.EVENTS.STATE_CHANGED, updateColorbarState);
    return () => {
      unsubscribe();
    };
  }, [colorbarService, viewportId]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!viewportId || !activeDisplaySetInstanceUID) {
      return;
    }
    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
    if (!viewport) {
      return;
    }
    const element = viewport.element;
    if (!element) {
      return;
    }
    const updateVOI = eventDetail => {
      const {
        range
      } = eventDetail.detail;
      if (!range) {
        return;
      }

      // Check if this update is coming from our own setVOIRange or setWindowLevel call
      // If so, we already updated our state and don't need to do it again
      const isInternalUpdate = voiRangeRef.current && areVoiRangesClose(voiRangeRef.current, range);
      if (!isInternalUpdate) {
        voiRangeRef.current = range;
        setVoiRange(range);
      }
    };
    const updateColormap = eventDetail => {
      const {
        colormap
      } = eventDetail.detail;
      if (!colormap) {
        return;
      }

      // Extract threshold from colormap in the event detail
      if (colormap.threshold !== undefined) {
        setThresholdState(colormap.threshold);
      }
      if (colormap.opacity !== undefined) {
        setOpacityState(colormap.opacity);
        setOpacityLinearState(opacityToLinear(colormap.opacity));
      }
    };
    element.addEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.Enums.Events.VOI_MODIFIED, updateVOI);
    element.addEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.Enums.Events.COLORMAP_MODIFIED, updateColormap);
    return () => {
      element.removeEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.Enums.Events.VOI_MODIFIED, updateVOI);
      element.removeEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.Enums.Events.COLORMAP_MODIFIED, updateColormap);
    };
  }, [viewportId, activeDisplaySetInstanceUID, cornerstoneViewportService, opacityToLinear]);
  const validateActiveDisplaySet = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (!activeDisplaySetInstanceUID) {
      throw new Error('No active display set instance UID is available');
    }
    if (viewportDisplaySets?.length === 0) {
      throw new Error('No display sets are available for this viewport');
    }

    // Verify the active display set is in the viewport
    const isDisplaySetInViewport = viewportDisplaySets?.some(ds => ds.displaySetInstanceUID === activeDisplaySetInstanceUID);
    if (!isDisplaySetInViewport) {
      throw new Error(`Display set with UID ${activeDisplaySetInstanceUID} is not present in the viewport`);
    }
    return activeDisplaySetInstanceUID;
  }, [activeDisplaySetInstanceUID, viewportDisplaySets]);
  const setWindowLevel = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(preset => {
    if (!viewportId) {
      return;
    }
    const displaySetInstanceUID = validateActiveDisplaySet();

    // Update voiRange as well, to ensure immediate UI updates
    const {
      lower,
      upper
    } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.utilities.windowLevel.toLowHighRange(preset.windowWidth, preset.windowCenter);
    const newVoiRange = {
      lower,
      upper
    };
    if (!voiRangeRef.current || !areVoiRangesClose(voiRangeRef.current, newVoiRange)) {
      voiRangeRef.current = newVoiRange;
      setVoiRange(newVoiRange);
      commandsManager.run({
        commandName: 'setViewportWindowLevel',
        commandOptions: {
          ...preset,
          viewportId,
          displaySetInstanceUID
        },
        context: 'CORNERSTONE'
      });
    }
  }, [commandsManager, viewportId, validateActiveDisplaySet]);
  const setVOIRange = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(params => {
    if (!viewportId) {
      return;
    }

    // Only update if VOI values have actually changed
    if (!voiRangeRef.current || !areVoiRangesClose(voiRangeRef.current, params)) {
      // Update the ref and state immediately to avoid race conditions with the event listener
      voiRangeRef.current = params;
      setVoiRange(params);
      const windowLevel = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.utilities.windowLevel.toWindowLevel(params.lower, params.upper);

      // Set window level using the command manager directly to avoid circular calls
      const displaySetInstanceUID = validateActiveDisplaySet();
      commandsManager.run({
        commandName: 'setViewportWindowLevel',
        commandOptions: {
          ...windowLevel,
          viewportId,
          displaySetInstanceUID
        },
        context: 'CORNERSTONE'
      });
    }
  }, [viewportId, commandsManager, validateActiveDisplaySet]);
  const toggleColorbar = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(options => {
    if (!viewportId) {
      return;
    }
    if (viewportDisplaySets?.length === 0) {
      return;
    }
    if (!colorbarProperties) {
      return;
    }
    const {
      width: colorbarWidth,
      colorbarTickPosition,
      colorbarInitialColormap
    } = colorbarProperties;
    let appropriateTickPosition = colorbarTickPosition || 'top';
    if (colorbarPosition === 'left' || colorbarPosition === 'right') {
      appropriateTickPosition = colorbarPosition === 'left' ? 'right' : 'left';
    } else {
      appropriateTickPosition = colorbarPosition === 'top' ? 'bottom' : 'top';
    }
    const colorbarOptions = {
      viewportId,
      colormaps: colorbarProperties.colormaps || {},
      ticks: {
        position: appropriateTickPosition
      },
      width: colorbarWidth,
      position: colorbarPosition,
      activeColormapName: colorbarInitialColormap || 'Grayscale',
      ...options
    };

    // If light background, adjust tick style but keep the appropriate position
    if (isViewportBackgroundLight) {
      colorbarOptions.ticks = {
        position: appropriateTickPosition,
        style: {
          font: '13px Inter',
          color: '#000000',
          maxNumTicks: 8,
          tickSize: 5,
          tickWidth: 1,
          labelMargin: 3
        }
      };
    }
    const displaySetInstanceUIDs = viewportDisplaySets.map(ds => ds.displaySetInstanceUID);
    try {
      commandsManager.run('toggleViewportColorbar', {
        viewportId,
        options: colorbarOptions,
        displaySetInstanceUIDs
      });
    } catch (error) {
      console.error('Error toggling colorbar:', error);
    }
  }, [commandsManager, viewportId, colorbarProperties, isViewportBackgroundLight, viewportDisplaySets, colorbarPosition]);
  const setColormap = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(({
    colormap,
    opacity = 1,
    immediate = false
  }) => {
    if (!viewportId) {
      return;
    }
    const displaySetInstanceUID = validateActiveDisplaySet();

    // Update local opacity state
    if (opacity !== undefined) {
      setOpacityState(opacity);
    }
    commandsManager.run({
      commandName: 'setViewportColormap',
      commandOptions: {
        viewportId,
        colormap,
        displaySetInstanceUID,
        opacity,
        immediate
      },
      context: 'CORNERSTONE'
    });
  }, [commandsManager, viewportId, validateActiveDisplaySet]);
  const setOpacity = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(opacityValue => {
    if (!viewportId) {
      return;
    }
    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
    if (!viewport || !(viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.BaseVolumeViewport)) {
      return;
    }

    // Apply the actual opacity value
    setOpacityState(opacityValue);
    // Update the linear value for UI
    setOpacityLinearState(opacityToLinear(opacityValue));
    const displaySetInstanceUID = validateActiveDisplaySet();
    const volumeIds = viewport.getAllVolumeIds();
    const volumeId = volumeIds.find(id => id.includes(displaySetInstanceUID));
    if (!volumeId) {
      return;
    }

    // Get current properties including colormap
    const properties = viewport.getProperties(volumeId);
    const currentColormap = properties.colormap || {};

    // Update colormap with new opacity
    const updatedColormap = {
      ...currentColormap,
      opacity: opacityValue
    };

    // Apply updated colormap
    viewport.setProperties({
      colormap: updatedColormap
    }, volumeId);
    viewport.render();
  }, [cornerstoneViewportService, viewportId, validateActiveDisplaySet, opacityToLinear]);
  const setOpacityLinear = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(linearValue => {
    // Convert linear UI value to actual opacity value and apply it
    const actualOpacity = linearToOpacity(linearValue);
    setOpacity(actualOpacity);
  }, [linearToOpacity, setOpacity]);
  const setThreshold = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(thresholdValue => {
    if (!viewportId) {
      return;
    }
    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
    if (!viewport || !(viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.BaseVolumeViewport)) {
      return;
    }
    setThresholdState(thresholdValue);
    const displaySetInstanceUID = validateActiveDisplaySet();
    const volumeIds = viewport.getAllVolumeIds();
    const volumeId = volumeIds.find(id => id.includes(displaySetInstanceUID));
    if (!volumeId) {
      return;
    }
    console.debug('🚀 ~ thresholdValue:', thresholdValue);
    viewport.setProperties({
      colormap: {
        threshold: thresholdValue
      }
    }, volumeId);
    viewport.render();
  }, [cornerstoneViewportService, viewportId, validateActiveDisplaySet]);

  // Get the current colormap for the active display set
  const colormap = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!viewportId || !activeDisplaySetInstanceUID || !viewportDisplaySets?.length) {
      return null;
    }
    try {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (!viewport) {
        return null;
      }
      if (viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.StackViewport) {
        const {
          colormap
        } = viewport.getProperties();
        if (!colormap) {
          return colorbarProperties?.colormaps?.find(c => c.Name === 'Grayscale') || colorbarProperties?.colormaps?.[0];
        }
        return colormap;
      }
      const actorEntries = viewport.getActors();
      const actorEntry = actorEntries?.find(entry => entry.referencedId.includes(activeDisplaySetInstanceUID));
      if (!actorEntry) {
        return colorbarProperties?.colormaps?.find(c => c.Name === 'Grayscale') || colorbarProperties?.colormaps?.[0];
      }
      const {
        colormap
      } = viewport.getProperties(actorEntry.referencedId);
      if (!colormap) {
        return colorbarProperties?.colormaps?.find(c => c.Name === 'Grayscale') || colorbarProperties?.colormaps?.[0];
      }
      return colormap;
    } catch (error) {
      console.error('Error getting viewport colormap:', error);
      return colorbarProperties?.colormaps?.find(c => c.Name === 'Grayscale') || colorbarProperties?.colormaps?.[0];
    }
  }, [cornerstoneViewportService, viewportId, activeDisplaySetInstanceUID, viewportDisplaySets, colorbarProperties?.colormaps]);

  // 3D volume rendering functions
  const setVolumeRenderingPreset = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(preset => {
    if (!viewportId) {
      return;
    }
    const displaySetInstanceUID = validateActiveDisplaySet();
    commandsManager.run({
      commandName: 'setVolumesPreset',
      commandOptions: {
        preset,
        viewportId,
        displaySetInstanceUID
      }
    });
  }, [commandsManager, viewportId, validateActiveDisplaySet]);
  const setVolumeRenderingQuality = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(quality => {
    if (!viewportId) {
      return;
    }
    commandsManager.run({
      commandName: 'setVolumeRenderingQuality',
      commandOptions: {
        quality,
        viewportId
      }
    });
  }, [commandsManager, viewportId]);
  const setVolumeLighting = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(({
    ambient,
    diffuse,
    specular
  }) => {
    if (!viewportId) {
      return;
    }
    commandsManager.run({
      commandName: 'setVolumeLighting',
      commandOptions: {
        ambient,
        diffuse,
        specular,
        viewportId
      }
    });
  }, [commandsManager, viewportId]);
  const setVolumeShading = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(enabled => {
    if (!viewportId) {
      return;
    }
    commandsManager.run({
      commandName: 'setVolumeShading',
      commandOptions: {
        enabled,
        viewportId
      }
    });
  }, [commandsManager, viewportId]);
  return {
    is3DVolume,
    isViewportBackgroundLight,
    // Window level functions
    setWindowLevel,
    setVOIRange,
    voiRange,
    windowLevel: _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.utilities.windowLevel.toWindowLevel(voiRange?.lower, voiRange?.upper),
    // Colorbar functions
    hasColorbar,
    toggleColorbar,
    // Colormap functions
    setColormap,
    colormap,
    // Opacity functions
    opacity,
    setOpacity,
    opacityLinear,
    setOpacityLinear,
    // Threshold functions
    threshold,
    setThreshold,
    pixelValueRange,
    // 3D volume rendering functions
    setVolumeRenderingPreset,
    setVolumeRenderingQuality,
    setVolumeLighting,
    setVolumeShading,
    // Display sets
    viewportDisplaySets,
    // Colorbar properties
    colorbarProperties,
    colorbarPosition,
    setColorbarPosition,
    // Presets
    windowLevelPresets: activeDisplaySetPresets,
    allWindowLevelPresets,
    volumeRenderingPresets,
    volumeRenderingQualityRange
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useViewportRendering);

/**
 * Helper function to compare two VOI ranges with a small tolerance.
 * @param rangeA - The first VOI range { lower, upper }.
 * @param rangeB - The second VOI range { lower, upper }.
 * @param epsilon - The tolerance for comparison.
 * @returns True if the ranges are considered close, false otherwise.
 */
function areVoiRangesClose(rangeA, rangeB, epsilon = 0.001) {
  if (!rangeA || !rangeB) {
    return false;
  }
  return Math.abs(rangeA.lower - rangeB.lower) < epsilon && Math.abs(rangeA.upper - rangeB.upper) < epsilon;
}
function getCustomizationData(customizationService) {
  const presets = customizationService.getCustomization('cornerstone.windowLevelPresets');
  const colorbarProperties = customizationService.getCustomization('cornerstone.colorbar');
  const {
    volumeRenderingPresets = [],
    volumeRenderingQualityRange = {
      min: 0,
      max: 1,
      step: 0.1
    }
  } = customizationService.getCustomization('cornerstone.3dVolumeRendering') || {};
  return {
    presets,
    colorbarProperties,
    volumeRenderingPresets,
    volumeRenderingQualityRange
  };
}

/***/ }),

/***/ 79063:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   L: () => (/* binding */ useViewportSegmentations)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(86326);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62051);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ohif_core_src_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(80735);
/* harmony import */ var _ohif_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(15871);




const excludedModalities = ['SM', 'OT', 'DOC', 'ECG'];
function mapSegmentationToDisplay(segmentation, customizationService) {
  const {
    label,
    segments
  } = segmentation;

  // Get the readable text mapping once
  const readableTextMap = customizationService.getCustomization('panelSegmentation.readableText');

  // Helper function to recursively map cachedStats to readable display text
  function mapStatsToDisplay(stats, indent = 0) {
    const primary = [];
    const indentation = '  '.repeat(indent);
    for (const key in stats) {
      if (Object.prototype.hasOwnProperty.call(stats, key)) {
        const value = stats[key];
        const readableText = readableTextMap?.[key];
        if (!readableText) {
          continue;
        }
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Add empty row before category (except for the first category)
          if (primary.length > 0) {
            primary.push('');
          }
          // Add category title
          primary.push(`${indentation}${readableText}`);
          // Recursively handle nested objects
          primary.push(...mapStatsToDisplay(value, indent + 1));
        } else {
          // For non-nested values, don't add empty rows
          primary.push(`${indentation}${readableText}: ${(0,_ohif_core_src_utils__WEBPACK_IMPORTED_MODULE_2__/* .roundNumber */ .Wf)(value, 2)}`);
        }
      }
    }
    return primary;
  }

  // Get customization for display text mapping
  const displayTextMapper = segment => {
    const defaultDisplay = {
      primary: [],
      secondary: []
    };

    // If the segment has cachedStats, map it to readable text
    if (segment.cachedStats) {
      const primary = mapStatsToDisplay(segment.cachedStats);
      defaultDisplay.primary = primary;
    }
    return defaultDisplay;
  };
  const updatedSegments = {};
  Object.entries(segments).forEach(([segmentIndex, segment]) => {
    updatedSegments[segmentIndex] = {
      ...segment,
      displayText: displayTextMapper(segment)
    };
  });

  // Map the segments and apply the display text mapper
  return {
    ...segmentation,
    label,
    segments: updatedSegments
  };
}

/**
 * Represents the combination of segmentation data and its representation in a viewport.
 */

/**
 * Custom hook that provides segmentation data and their representations for the active viewport.
 * @param options - The options object.
 * @param options.servicesManager - The services manager object.
 * @param options.subscribeToDataModified - Whether to subscribe to segmentation data modifications.
 * @param options.debounceTime - Debounce time in milliseconds for updates.
 * @returns An array of segmentation data and their representations for the active viewport.
 */
function useViewportSegmentations({
  viewportId,
  subscribeToDataModified = false,
  debounceTime = 0
}) {
  const {
    servicesManager
  } = (0,_ohif_core__WEBPACK_IMPORTED_MODULE_3__.useSystem)();
  const {
    segmentationService,
    viewportGridService,
    customizationService,
    displaySetService
  } = servicesManager.services;
  const [segmentationsWithRepresentations, setSegmentationsWithRepresentations] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    segmentationsWithRepresentations: [],
    disabled: false
  });
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const update = () => {
      const displaySetUIDs = viewportGridService.getDisplaySetsUIDsForViewport(viewportId);
      if (!displaySetUIDs?.length) {
        return;
      }
      const displaySet = displaySetService.getDisplaySetByUID(displaySetUIDs[0]);
      if (!displaySet) {
        return;
      }
      if (excludedModalities.includes(displaySet.Modality)) {
        setSegmentationsWithRepresentations(prev => ({
          segmentationsWithRepresentations: [],
          disabled: true
        }));
        return;
      }
      const segmentations = segmentationService.getSegmentations();
      if (!segmentations?.length) {
        setSegmentationsWithRepresentations(prev => ({
          segmentationsWithRepresentations: [],
          disabled: false
        }));
        return;
      }
      const representations = segmentationService.getSegmentationRepresentations(viewportId);
      const newSegmentationsWithRepresentations = representations.map(representation => {
        const segmentation = segmentationService.getSegmentation(representation.segmentationId);
        const mappedSegmentation = mapSegmentationToDisplay(segmentation, customizationService);
        return {
          representation,
          segmentation: mappedSegmentation
        };
      });
      setSegmentationsWithRepresentations({
        segmentationsWithRepresentations: newSegmentationsWithRepresentations,
        disabled: false
      });
    };
    const debouncedUpdate = debounceTime > 0 ? lodash_debounce__WEBPACK_IMPORTED_MODULE_1___default()(update, debounceTime, {
      leading: true,
      trailing: true
    }) : update;
    update();
    const subscriptions = [segmentationService.subscribe(segmentationService.EVENTS.SEGMENTATION_MODIFIED, debouncedUpdate), segmentationService.subscribe(segmentationService.EVENTS.SEGMENTATION_REMOVED, debouncedUpdate), segmentationService.subscribe(segmentationService.EVENTS.SEGMENTATION_REPRESENTATION_MODIFIED, debouncedUpdate), viewportGridService.subscribe(viewportGridService.EVENTS.ACTIVE_VIEWPORT_ID_CHANGED, debouncedUpdate), viewportGridService.subscribe(viewportGridService.EVENTS.GRID_STATE_CHANGED, debouncedUpdate)];
    if (subscribeToDataModified) {
      subscriptions.push(segmentationService.subscribe(segmentationService.EVENTS.SEGMENTATION_DATA_MODIFIED, debouncedUpdate));
    }
    return () => {
      subscriptions.forEach(subscription => subscription.unsubscribe());
      if (debounceTime > 0) {
        debouncedUpdate.cancel();
      }
    };
  }, [segmentationService, viewportGridService, customizationService, displaySetService, debounceTime, subscribeToDataModified, viewportId]);
  return segmentationsWithRepresentations;
}

/***/ }),

/***/ 39162:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  AccordionGroup: () => (/* reexport */ AccordionGroup),
  CloneChildren: () => (/* reexport */ CloneChildren),
  Colorbar: () => (/* reexport */ Colorbar),
  Colormap: () => (/* reexport */ Colormap),
  CornerstoneVLMViewportForm: () => (/* reexport */ utils_CornerstoneVLMViewportForm),
  CornerstoneViewportDownloadForm: () => (/* reexport */ utils_CornerstoneViewportDownloadForm),
  DYNAMIC_VOLUME_LOADER_SCHEME: () => (/* reexport */ DYNAMIC_VOLUME_LOADER_SCHEME),
  DicomUpload: () => (/* reexport */ DicomUpload_DicomUpload),
  Enums: () => (/* reexport */ enums),
  ImageOverlayViewerTool: () => (/* reexport */ tools_ImageOverlayViewerTool),
  MeasumentsMenu: () => (/* reexport */ MeasumentsMenu),
  MeasurementOrAdditionalFindingSets: () => (/* reexport */ MeasurementOrAdditionalFindingSets),
  MeasurementsOrAdditionalFindings: () => (/* reexport */ MeasurementsOrAdditionalFindings),
  OHIFCornerstoneViewport: () => (/* binding */ OHIFCornerstoneViewport),
  PanelMeasurement: () => (/* reexport */ PanelMeasurement),
  PanelSegmentation: () => (/* reexport */ PanelSegmentation),
  PlanarFreehandROI: () => (/* reexport */ measurementServiceMappings_PlanarFreehandROI),
  RectangleROI: () => (/* reexport */ measurementServiceMappings_RectangleROI),
  SeriesMeasurementTrigger: () => (/* reexport */ SeriesMeasurementTrigger),
  SeriesMeasurements: () => (/* reexport */ SeriesMeasurements),
  StudyMeasurements: () => (/* reexport */ StudyMeasurements),
  StudyMeasurementsActions: () => (/* reexport */ StudyMeasurementsActions),
  StudySummaryFromMetadata: () => (/* reexport */ StudySummaryFromMetadata),
  Types: () => (/* reexport */ types_namespaceObject),
  VOLUME_LOADER_SCHEME: () => (/* reexport */ VOLUME_LOADER_SCHEME),
  VolumeLighting: () => (/* reexport */ VolumeLighting),
  VolumeRenderingOptions: () => (/* reexport */ VolumeRenderingOptions),
  VolumeRenderingPresets: () => (/* reexport */ VolumeRenderingPresets),
  VolumeRenderingQuality: () => (/* reexport */ VolumeRenderingQuality),
  VolumeShade: () => (/* reexport */ VolumeShade),
  VolumeShift: () => (/* reexport */ VolumeShift),
  WindowLevel: () => (/* reexport */ WindowLevel),
  WindowLevelActionMenu: () => (/* reexport */ WindowLevelActionMenu),
  WindowLevelActionMenuContent: () => (/* reexport */ WindowLevelActionMenuContent),
  WindowLevelActionMenuWrapper: () => (/* reexport */ WindowLevelActionMenuWrapper),
  "default": () => (/* binding */ cornerstone_src),
  dicomLoaderService: () => (/* reexport */ utils_dicomLoaderService),
  findNearbyToolData: () => (/* reexport */ findNearbyToolData),
  getActiveViewportEnabledElement: () => (/* reexport */ getActiveViewportEnabledElement),
  getEnabledElement: () => (/* reexport */ state/* getEnabledElement */.kJ),
  getSOPInstanceAttributes: () => (/* reexport */ getSOPInstanceAttributes),
  groupByDisplaySet: () => (/* reexport */ groupByDisplaySet),
  groupByNamedSets: () => (/* reexport */ groupByNamedSets),
  groupByStudy: () => (/* reexport */ groupByStudy),
  measurementMappingUtils: () => (/* reexport */ utils_namespaceObject),
  setEnabledElement: () => (/* reexport */ state/* setEnabledElement */.ye),
  toolNames: () => (/* reexport */ toolNames),
  useActiveViewportSegmentationRepresentations: () => (/* reexport */ useActiveViewportSegmentationRepresentations/* useActiveViewportSegmentationRepresentations */.c),
  useLutPresentationStore: () => (/* reexport */ useLutPresentationStore/* useLutPresentationStore */.I),
  useMeasurementTracking: () => (/* reexport */ useMeasurementTracking/* useMeasurementTracking */.R),
  useMeasurements: () => (/* reexport */ useMeasurements/* useMeasurements */.d),
  usePositionPresentationStore: () => (/* reexport */ usePositionPresentationStore/* usePositionPresentationStore */.q),
  useSegmentationPresentationStore: () => (/* reexport */ useSegmentationPresentationStore/* useSegmentationPresentationStore */.v),
  useSegmentations: () => (/* reexport */ useSegmentations/* useSegmentations */.j),
  useSynchronizersStore: () => (/* reexport */ useSynchronizersStore/* useSynchronizersStore */.U),
  utils: () => (/* reexport */ src_utils)
});

// NAMESPACE OBJECT: ../../../extensions/cornerstone/src/enums.ts
var enums_namespaceObject = {};
__webpack_require__.r(enums_namespaceObject);
__webpack_require__.d(enums_namespaceObject, {
  rM: () => (CORNERSTONE_3D_TOOLS_SOURCE_NAME),
  yK: () => (CORNERSTONE_3D_TOOLS_SOURCE_VERSION),
  Ay: () => (enums)
});

// NAMESPACE OBJECT: ../../../extensions/cornerstone/src/utils/measurementServiceMappings/utils/index.ts
var utils_namespaceObject = {};
__webpack_require__.r(utils_namespaceObject);
__webpack_require__.d(utils_namespaceObject, {
  getDisplayUnit: () => (utils_getDisplayUnit),
  getFirstAnnotationSelected: () => (getFirstAnnotationSelected),
  getHandlesFromPoints: () => (getHandlesFromPoints),
  getSOPInstanceAttributes: () => (getSOPInstanceAttributes),
  isAnnotationSelected: () => (isAnnotationSelected),
  setAnnotationSelected: () => (setAnnotationSelected)
});

// NAMESPACE OBJECT: ../../../extensions/cornerstone/src/types/index.ts
var types_namespaceObject = {};
__webpack_require__.r(types_namespaceObject);

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/index.js
var dist_esm = __webpack_require__(4667);
;// ../../../extensions/cornerstone/src/enums.ts
const CORNERSTONE_3D_TOOLS_SOURCE_NAME = 'Cornerstone3DTools';
const CORNERSTONE_3D_TOOLS_SOURCE_VERSION = '0.1';
const Enums = {
  CORNERSTONE_3D_TOOLS_SOURCE_NAME,
  CORNERSTONE_3D_TOOLS_SOURCE_VERSION
};
/* harmony default export */ const enums = (Enums);
// EXTERNAL MODULE: ../../core/src/index.ts + 68 modules
var src = __webpack_require__(15871);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/loaders/index.js
var loaders = __webpack_require__(19742);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/RequestType.js
var RequestType = __webpack_require__(43213);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/dicom-image-loader/dist/esm/index.js + 76 modules
var dicom_image_loader_dist_esm = __webpack_require__(79453);
;// ../../../extensions/cornerstone/src/initWADOImageLoader.js




const {
  registerVolumeLoader
} = esm.volumeLoader;
function initWADOImageLoader(userAuthenticationService, appConfig, extensionManager) {
  registerVolumeLoader('cornerstoneStreamingImageVolume', loaders/* cornerstoneStreamingImageVolumeLoader */.FC);
  registerVolumeLoader('cornerstoneStreamingDynamicImageVolume', loaders/* cornerstoneStreamingDynamicImageVolumeLoader */.Mr);
  dicom_image_loader_dist_esm/* default.init */.Ay.init({
    maxWebWorkers: Math.min(Math.max(navigator.hardwareConcurrency - 1, 1), appConfig.maxNumberOfWebWorkers),
    beforeSend: function (xhr) {
      //TODO should be removed in the future and request emitted by DicomWebDataSource
      const sourceConfig = extensionManager.getActiveDataSource()?.[0].getConfig() ?? {};
      const headers = userAuthenticationService.getAuthorizationHeader();
      const acceptHeader = src.utils.generateAcceptHeader(sourceConfig.acceptHeader, sourceConfig.requestTransferSyntaxUID, sourceConfig.omitQuotationForMultipartRequest);
      const xhrRequestHeaders = {
        Accept: acceptHeader
      };
      if (headers) {
        Object.assign(xhrRequestHeaders, headers);
      }
      return xhrRequestHeaders;
    },
    errorInterceptor: error => {
      src.errorHandler.getHTTPErrorHandler(error);
    }
  });
}
function destroy() {
  console.debug('Destroying WADO Image Loader');
}
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/ai/dist/esm/index.js + 6 modules
var ai_dist_esm = __webpack_require__(75165);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/polymorphic-segmentation/dist/esm/index.js + 14 modules
var polymorphic_segmentation_dist_esm = __webpack_require__(56983);
// EXTERNAL MODULE: ../../../extensions/default/src/index.ts + 131 modules
var default_src = __webpack_require__(72069);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/state.ts
var state = __webpack_require__(71353);
;// ../../../extensions/cornerstone/src/utils/getViewportEnabledElement.ts


function getViewportEnabledElement(viewportId) {
  const {
    element
  } = (0,state/* getEnabledElement */.kJ)(viewportId) || {};
  const enabledElement = (0,esm.getEnabledElement)(element);
  return enabledElement;
}
;// ../../../extensions/cornerstone/src/utils/getActiveViewportEnabledElement.ts

function getActiveViewportEnabledElement(viewportGridService) {
  const {
    activeViewportId
  } = viewportGridService.getState();
  return getViewportEnabledElement(activeViewportId);
}
;// ../../../extensions/cornerstone/src/tools/CalibrationLineTool.ts



const {
  calibrateImageSpacing
} = dist_esm.utilities;

/**
 * Calibration Line tool works almost the same as the
 */
class CalibrationLineTool extends dist_esm.LengthTool {
  constructor(...args) {
    super(...args);
    this._renderingViewport = void 0;
    this._lengthToolRenderAnnotation = this.renderAnnotation;
    this.renderAnnotation = (enabledElement, svgDrawingHelper) => {
      const {
        viewport
      } = enabledElement;
      this._renderingViewport = viewport;
      return this._lengthToolRenderAnnotation(enabledElement, svgDrawingHelper);
    };
  }
  _getTextLines(data, targetId) {
    const [canvasPoint1, canvasPoint2] = data.handles.points.map(p => this._renderingViewport.worldToCanvas(p));
    // for display, round to 2 decimal points
    const lengthPx = Math.round(calculateLength2(canvasPoint1, canvasPoint2) * 100) / 100;
    const textLines = [`${lengthPx}px`];
    return textLines;
  }
}
CalibrationLineTool.toolName = 'CalibrationLine';
function calculateLength2(point1, point2) {
  const dx = point1[0] - point2[0];
  const dy = point1[1] - point2[1];
  return Math.sqrt(dx * dx + dy * dy);
}
function calculateLength3(pos1, pos2) {
  const dx = pos1[0] - pos2[0];
  const dy = pos1[1] - pos2[1];
  const dz = pos1[2] - pos2[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
/* harmony default export */ const tools_CalibrationLineTool = (CalibrationLineTool);
function onCompletedCalibrationLine(servicesManager, csToolsEvent) {
  const {
    uiDialogService,
    viewportGridService
  } = servicesManager.services;

  // calculate length (mm) with the current Pixel Spacing
  const annotationAddedEventDetail = csToolsEvent.detail;
  const {
    annotation: {
      metadata,
      data: annotationData
    }
  } = annotationAddedEventDetail;
  const {
    referencedImageId: imageId
  } = metadata;
  const enabledElement = getActiveViewportEnabledElement(viewportGridService);
  const {
    viewport
  } = enabledElement;
  const length = Math.round(calculateLength3(annotationData.handles.points[0], annotationData.handles.points[1]) * 100) / 100;
  const adjustCalibration = newLength => {
    const spacingScale = newLength / length;

    // trigger resize of the viewport to adjust the world/pixel mapping
    calibrateImageSpacing(imageId, viewport.getRenderingEngine(), {
      type: 'User',
      scale: 1 / spacingScale
    });
  };
  return new Promise((resolve, reject) => {
    if (!uiDialogService) {
      reject('UIDialogService is not initiated');
      return;
    }
    (0,default_src.callInputDialog)({
      uiDialogService,
      title: 'Calibration',
      placeholder: 'Actual Physical distance (mm)',
      defaultValue: `${length}`
    }).then(newValue => {
      adjustCalibration(Number.parseFloat(newValue));
      resolve(true);
    });
  });
}
// EXTERNAL MODULE: ../../core/src/utils/index.ts + 29 modules
var utils = __webpack_require__(80735);
;// ../../../extensions/cornerstone/src/tools/OverlayPlaneModuleProvider.ts

const _cachedOverlayMetadata = new Map();

/**
 * Image Overlay Viewer tool is not a traditional tool that requires user interactin.
 * But it is used to display Pixel Overlays. And it will provide toggling capability.
 *
 * The documentation for Overlay Plane Module of DICOM can be found in [C.9.2 of
 * Part-3 of DICOM standard](https://dicom.nema.org/medical/dicom/2018b/output/chtml/part03/sect_C.9.2.html)
 *
 * Image Overlay rendered by this tool can be toggled on and off using
 * toolGroup.setToolEnabled() and toolGroup.setToolDisabled()
 */
const OverlayPlaneModuleProvider = {
  /** Adds the metadata for overlayPlaneModule */
  add: (imageId, metadata) => {
    if (_cachedOverlayMetadata.get(imageId) === metadata) {
      // This is a no-op here as the tool re-caches the data
      return;
    }
    _cachedOverlayMetadata.set(imageId, metadata);
  },
  /** Standard getter for metadata */
  get: (type, query) => {
    if (Array.isArray(query)) {
      return;
    }
    if (type !== 'overlayPlaneModule') {
      return;
    }
    return _cachedOverlayMetadata.get(query);
  }
};

// Needs to be higher priority than default provider
esm.metaData.addProvider(OverlayPlaneModuleProvider.get, 10_000);
/* harmony default export */ const tools_OverlayPlaneModuleProvider = (OverlayPlaneModuleProvider);
;// ../../../extensions/cornerstone/src/tools/ImageOverlayViewerTool.tsx




/**
 * Image Overlay Viewer tool is not a traditional tool that requires user interactin.
 * But it is used to display Pixel Overlays. And it will provide toggling capability.
 *
 * The documentation for Overlay Plane Module of DICOM can be found in [C.9.2 of
 * Part-3 of DICOM standard](https://dicom.nema.org/medical/dicom/2018b/output/chtml/part03/sect_C.9.2.html)
 *
 * Image Overlay rendered by this tool can be toggled on and off using
 * toolGroup.setToolEnabled() and toolGroup.setToolDisabled()
 */
class ImageOverlayViewerTool extends dist_esm.AnnotationDisplayTool {
  constructor(toolProps = {}, defaultToolProps = {
    supportedInteractionTypes: [],
    configuration: {
      fillColor: [255, 127, 127, 255]
    }
  }) {
    super(toolProps, defaultToolProps);
    this.onSetToolDisabled = () => {};
    this.renderAnnotation = (enabledElement, svgDrawingHelper) => {
      const {
        viewport
      } = enabledElement;
      const imageId = this.getReferencedImageId(viewport);
      if (!imageId) {
        return;
      }
      const overlayMetadata = esm.metaData.get('overlayPlaneModule', imageId);
      const overlays = overlayMetadata?.overlays;

      // no overlays
      if (!overlays?.length) {
        return;
      }

      // Fix the x, y positions
      overlays.forEach(overlay => {
        overlay.x ||= 0;
        overlay.y ||= 0;
      });

      // Will clear cached stat data when the overlay data changes
      ImageOverlayViewerTool.addOverlayPlaneModule(imageId, overlayMetadata);
      this._getCachedStat(imageId, overlayMetadata, this.configuration.fillColor).then(cachedStat => {
        cachedStat.overlays.forEach(overlay => {
          this._renderOverlay(enabledElement, svgDrawingHelper, overlay);
        });
      });
      return true;
    };
  }
  getReferencedImageId(viewport) {
    if (viewport instanceof esm.VolumeViewport) {
      return;
    }
    const targetId = this.getTargetId(viewport);
    return targetId.split('imageId:')[1];
  }
  /**
   * Render to DOM
   *
   * @param enabledElement
   * @param svgDrawingHelper
   * @param overlayData
   * @returns
   */
  _renderOverlay(enabledElement, svgDrawingHelper, overlayData) {
    const {
      viewport
    } = enabledElement;
    const imageId = this.getReferencedImageId(viewport);
    if (!imageId) {
      return;
    }

    // Decide the rendering position of the overlay image on the current canvas
    const {
      _id,
      columns: width,
      rows: height,
      x,
      y
    } = overlayData;
    const overlayTopLeftWorldPos = esm.utilities.imageToWorldCoords(imageId, [x - 1,
    // Remind that top-left corner's (x, y) is be (1, 1)
    y - 1]);
    const overlayTopLeftOnCanvas = viewport.worldToCanvas(overlayTopLeftWorldPos);
    const overlayBottomRightWorldPos = esm.utilities.imageToWorldCoords(imageId, [width, height]);
    const overlayBottomRightOnCanvas = viewport.worldToCanvas(overlayBottomRightWorldPos);

    // add image to the annotations svg layer
    const svgns = 'http://www.w3.org/2000/svg';
    const svgNodeHash = `image-overlay-${_id}`;
    const existingImageElement = svgDrawingHelper.getSvgNode(svgNodeHash);
    const attributes = {
      'data-id': svgNodeHash,
      width: overlayBottomRightOnCanvas[0] - overlayTopLeftOnCanvas[0],
      height: overlayBottomRightOnCanvas[1] - overlayTopLeftOnCanvas[1],
      x: overlayTopLeftOnCanvas[0],
      y: overlayTopLeftOnCanvas[1],
      href: overlayData.dataUrl
    };
    if (isNaN(attributes.x) || isNaN(attributes.y) || isNaN(attributes.width) || isNaN(attributes.height)) {
      console.warn('Invalid rendering attribute for image overlay', attributes['data-id']);
      return false;
    }
    if (existingImageElement) {
      dist_esm.drawing.setAttributesIfNecessary(attributes, existingImageElement);
      svgDrawingHelper.setNodeTouched(svgNodeHash);
    } else {
      const newImageElement = document.createElementNS(svgns, 'image');
      dist_esm.drawing.setNewAttributesIfValid(attributes, newImageElement);
      svgDrawingHelper.appendNode(newImageElement, svgNodeHash);
    }
    return true;
  }
  async _getCachedStat(imageId, overlayMetadata, color) {
    const missingOverlay = overlayMetadata.overlays.filter(overlay => overlay.pixelData && !overlay.dataUrl);
    if (missingOverlay.length === 0) {
      return overlayMetadata;
    }
    const overlays = await Promise.all(overlayMetadata.overlays.filter(overlay => overlay.pixelData).map(async (overlay, idx) => {
      let pixelData = null;
      if (overlay.pixelData.Value) {
        pixelData = overlay.pixelData.Value;
      } else if (overlay.pixelData instanceof Array) {
        pixelData = overlay.pixelData[0];
      } else if (overlay.pixelData.retrieveBulkData) {
        pixelData = await overlay.pixelData.retrieveBulkData();
      } else if (overlay.pixelData.InlineBinary) {
        const blob = (0,utils/* b64toBlob */.Vk)(overlay.pixelData.InlineBinary);
        const arrayBuffer = await blob.arrayBuffer();
        pixelData = arrayBuffer;
      }
      if (!pixelData) {
        return;
      }
      const dataUrl = this._renderOverlayToDataUrl({
        width: overlay.columns,
        height: overlay.rows
      }, overlay.color || color, pixelData);
      return {
        ...overlay,
        _id: (0,utils/* guid */.Os)(),
        dataUrl,
        // this will be a data url expression of the rendered image
        color
      };
    }));
    overlayMetadata.overlays = overlays;
    return overlayMetadata;
  }

  /**
   * compare two RGBA expression of colors.
   *
   * @param color1
   * @param color2
   * @returns
   */
  _isSameColor(color1, color2) {
    return color1 && color2 && color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2] && color1[3] === color2[3];
  }

  /**
   * pixelData of overlayPlane module is an array of bits corresponding
   * to each of the underlying pixels of the image.
   * Let's create pixel data from bit array of overlay data
   *
   * @param pixelDataRaw
   * @param color
   * @returns
   */
  _renderOverlayToDataUrl({
    width,
    height
  }, color, pixelDataRaw) {
    const pixelDataView = new DataView(pixelDataRaw);
    const totalBits = width * height;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height); // make it transparent
    ctx.globalCompositeOperation = 'copy';
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0, bitIdx = 0, byteIdx = 0; i < totalBits; i++) {
      if (pixelDataView.getUint8(byteIdx) & 1 << bitIdx) {
        data[i * 4] = color[0];
        data[i * 4 + 1] = color[1];
        data[i * 4 + 2] = color[2];
        data[i * 4 + 3] = color[3];
      }

      // next bit, byte
      if (bitIdx >= 7) {
        bitIdx = 0;
        byteIdx++;
      } else {
        bitIdx++;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  }
}
ImageOverlayViewerTool.toolName = 'ImageOverlayViewer';
/**
 * The overlay plane module provider add method is exposed here to be used
 * when updating the overlay for this tool to use for displaying data.
 */
ImageOverlayViewerTool.addOverlayPlaneModule = tools_OverlayPlaneModuleProvider.add;
/* harmony default export */ const tools_ImageOverlayViewerTool = (ImageOverlayViewerTool);
;// ../../../extensions/cornerstone/src/initCornerstoneTools.js





function initCornerstoneTools(configuration = {}) {
  dist_esm.CrosshairsTool.isAnnotation = false;
  ai_dist_esm/* LabelmapSlicePropagationTool */.Bj.isAnnotation = false;
  ai_dist_esm/* MarkerLabelmapTool */.pY.isAnnotation = false;
  dist_esm.ReferenceLinesTool.isAnnotation = false;
  dist_esm.AdvancedMagnifyTool.isAnnotation = false;
  dist_esm.PlanarFreehandContourSegmentationTool.isAnnotation = false;
  (0,dist_esm.init)({
    addons: {
      polySeg: polymorphic_segmentation_dist_esm
    },
    computeWorker: {
      autoTerminateOnIdle: {
        enabled: false
      }
    }
  });
  (0,dist_esm.addTool)(dist_esm.PanTool);
  (0,dist_esm.addTool)(dist_esm.SegmentBidirectionalTool);
  (0,dist_esm.addTool)(dist_esm.WindowLevelTool);
  (0,dist_esm.addTool)(dist_esm.StackScrollTool);
  (0,dist_esm.addTool)(dist_esm.VolumeRotateTool);
  (0,dist_esm.addTool)(dist_esm.ZoomTool);
  (0,dist_esm.addTool)(dist_esm.ProbeTool);
  (0,dist_esm.addTool)(dist_esm.MIPJumpToClickTool);
  (0,dist_esm.addTool)(dist_esm.LengthTool);
  (0,dist_esm.addTool)(dist_esm.RectangleROITool);
  (0,dist_esm.addTool)(dist_esm.RectangleROIThresholdTool);
  (0,dist_esm.addTool)(dist_esm.EllipticalROITool);
  (0,dist_esm.addTool)(dist_esm.CircleROITool);
  (0,dist_esm.addTool)(dist_esm.BidirectionalTool);
  (0,dist_esm.addTool)(dist_esm.ArrowAnnotateTool);
  (0,dist_esm.addTool)(dist_esm.DragProbeTool);
  (0,dist_esm.addTool)(dist_esm.AngleTool);
  (0,dist_esm.addTool)(dist_esm.CobbAngleTool);
  (0,dist_esm.addTool)(dist_esm.MagnifyTool);
  (0,dist_esm.addTool)(dist_esm.CrosshairsTool);
  (0,dist_esm.addTool)(dist_esm.RectangleScissorsTool);
  (0,dist_esm.addTool)(dist_esm.SphereScissorsTool);
  (0,dist_esm.addTool)(dist_esm.CircleScissorsTool);
  (0,dist_esm.addTool)(dist_esm.BrushTool);
  (0,dist_esm.addTool)(dist_esm.PaintFillTool);
  (0,dist_esm.addTool)(dist_esm.ReferenceLinesTool);
  (0,dist_esm.addTool)(tools_CalibrationLineTool);
  (0,dist_esm.addTool)(dist_esm.TrackballRotateTool);
  (0,dist_esm.addTool)(tools_ImageOverlayViewerTool);
  (0,dist_esm.addTool)(dist_esm.AdvancedMagnifyTool);
  (0,dist_esm.addTool)(dist_esm.UltrasoundDirectionalTool);
  (0,dist_esm.addTool)(dist_esm.UltrasoundPleuraBLineTool);
  (0,dist_esm.addTool)(dist_esm.PlanarFreehandROITool);
  (0,dist_esm.addTool)(dist_esm.SplineROITool);
  (0,dist_esm.addTool)(dist_esm.LivewireContourTool);
  (0,dist_esm.addTool)(dist_esm.OrientationMarkerTool);
  (0,dist_esm.addTool)(dist_esm.WindowLevelRegionTool);
  (0,dist_esm.addTool)(dist_esm.PlanarFreehandContourSegmentationTool);
  (0,dist_esm.addTool)(dist_esm.SegmentSelectTool);
  (0,dist_esm.addTool)(dist_esm.SegmentLabelTool);
  (0,dist_esm.addTool)(ai_dist_esm/* LabelmapSlicePropagationTool */.Bj);
  (0,dist_esm.addTool)(ai_dist_esm/* MarkerLabelmapTool */.pY);
  (0,dist_esm.addTool)(dist_esm.RegionSegmentPlusTool);
  // Modify annotation tools to use dashed lines on SR
  const annotationStyle = {
    textBoxFontSize: '15px',
    lineWidth: '1.5'
  };
  const defaultStyles = dist_esm.annotation.config.style.getDefaultToolStyles();
  dist_esm.annotation.config.style.setDefaultToolStyles({
    global: {
      ...defaultStyles.global,
      ...annotationStyle
    }
  });
}
const toolNames = {
  Pan: dist_esm.PanTool.toolName,
  ArrowAnnotate: dist_esm.ArrowAnnotateTool.toolName,
  WindowLevel: dist_esm.WindowLevelTool.toolName,
  StackScroll: dist_esm.StackScrollTool.toolName,
  Zoom: dist_esm.ZoomTool.toolName,
  VolumeRotate: dist_esm.VolumeRotateTool.toolName,
  MipJumpToClick: dist_esm.MIPJumpToClickTool.toolName,
  Length: dist_esm.LengthTool.toolName,
  DragProbe: dist_esm.DragProbeTool.toolName,
  Probe: dist_esm.ProbeTool.toolName,
  RectangleROI: dist_esm.RectangleROITool.toolName,
  RectangleROIThreshold: dist_esm.RectangleROIThresholdTool.toolName,
  EllipticalROI: dist_esm.EllipticalROITool.toolName,
  CircleROI: dist_esm.CircleROITool.toolName,
  Bidirectional: dist_esm.BidirectionalTool.toolName,
  Angle: dist_esm.AngleTool.toolName,
  CobbAngle: dist_esm.CobbAngleTool.toolName,
  Magnify: dist_esm.MagnifyTool.toolName,
  Crosshairs: dist_esm.CrosshairsTool.toolName,
  Brush: dist_esm.BrushTool.toolName,
  PaintFill: dist_esm.PaintFillTool.toolName,
  ReferenceLines: dist_esm.ReferenceLinesTool.toolName,
  CalibrationLine: tools_CalibrationLineTool.toolName,
  TrackballRotateTool: dist_esm.TrackballRotateTool.toolName,
  CircleScissors: dist_esm.CircleScissorsTool.toolName,
  RectangleScissors: dist_esm.RectangleScissorsTool.toolName,
  SphereScissors: dist_esm.SphereScissorsTool.toolName,
  ImageOverlayViewer: tools_ImageOverlayViewerTool.toolName,
  AdvancedMagnify: dist_esm.AdvancedMagnifyTool.toolName,
  UltrasoundDirectional: dist_esm.UltrasoundDirectionalTool.toolName,
  UltrasoundAnnotation: dist_esm.UltrasoundPleuraBLineTool.toolName,
  SplineROI: dist_esm.SplineROITool.toolName,
  LivewireContour: dist_esm.LivewireContourTool.toolName,
  PlanarFreehandROI: dist_esm.PlanarFreehandROITool.toolName,
  OrientationMarker: dist_esm.OrientationMarkerTool.toolName,
  WindowLevelRegion: dist_esm.WindowLevelRegionTool.toolName,
  PlanarFreehandContourSegmentation: dist_esm.PlanarFreehandContourSegmentationTool.toolName,
  SegmentBidirectional: dist_esm.SegmentBidirectionalTool.toolName,
  SegmentSelect: dist_esm.SegmentSelectTool.toolName,
  SegmentLabel: dist_esm.SegmentLabelTool.toolName,
  LabelmapSlicePropagation: ai_dist_esm/* LabelmapSlicePropagationTool */.Bj.toolName,
  MarkerLabelmap: ai_dist_esm/* MarkerLabelmapTool */.pY.toolName,
  RegionSegmentPlus: dist_esm.RegionSegmentPlusTool.toolName
};

;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/constants/supportedTools.js
const supportedTools = ['Length', 'EllipticalROI', 'CircleROI', 'Bidirectional', 'ArrowAnnotate', 'Angle', 'CobbAngle', 'Probe', 'RectangleROI', 'PlanarFreehandROI', 'SplineROI', 'LivewireContour', 'UltrasoundDirectionalTool', 'UltrasoundPleuraBLineTool', 'SCOORD3DPoint', 'SegmentBidirectional'];
/* harmony default export */ const constants_supportedTools = (supportedTools);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/index.js + 1 modules
var annotation = __webpack_require__(47807);
;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/utils/getIsLocked.ts

const getIsLocked = annotationUID => {
  return annotation.locking.isAnnotationLocked(annotationUID);
};
;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/utils/getIsVisible.ts

const getIsVisible = annotationUID => {
  const isVisible = annotation.visibility.isAnnotationVisible(annotationUID);
  return isVisible;
};
;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/utils/getSOPInstanceAttributes.js

function getDisplaySet({
  metadata,
  displaySetService
}) {
  const {
    volumeId
  } = metadata;
  if (volumeId) {
    const displaySet = displaySetService.getDisplaySetsBy(displaySet => volumeId.includes(displaySet.uid))[0];
    if (displaySet) {
      return displaySet;
    }
    console.warn("Unable to find volumeId", volumeId);
    metadata.volumeId = null;
  }
  if (!metadata.FrameOfReferenceUID) {
    throw new Error('No volumeId and no FrameOfReferenceUID provided. Could not find matching displaySet.');
  }
  const displaySet = Array.from(displaySetService.getDisplaySetCache().values()).find(ds => ds.instance?.FrameOfReferenceUID === metadata.FrameOfReferenceUID);
  if (!displaySet) {
    throw new Error('Could not find matching displaySet for the provided FrameOfReferenceUID.');
  }
  return displaySet;
}

/**
 * It checks if the imageId is provided then it uses it to query
 * the metadata and get the SOPInstanceUID, SeriesInstanceUID and StudyInstanceUID.
 * If the imageId is not provided then undefined is returned.
 * @param {string} imageId The image id of the referenced image
 * @returns
 */
function getSOPInstanceAttributes(imageId, displaySetService, annotation) {
  if (imageId) {
    return _getUIDFromImageID(imageId);
  }
  const {
    metadata
  } = annotation;
  const displaySet = getDisplaySet({
    metadata,
    displaySetService
  });
  const {
    StudyInstanceUID,
    SeriesInstanceUID
  } = displaySet;
  return {
    SOPInstanceUID: undefined,
    SeriesInstanceUID,
    StudyInstanceUID
  };
}
function _getUIDFromImageID(imageId) {
  const instance = esm.metaData.get('instance', imageId);
  return {
    SOPInstanceUID: instance.SOPInstanceUID,
    SeriesInstanceUID: instance.SeriesInstanceUID,
    StudyInstanceUID: instance.StudyInstanceUID,
    frameNumber: instance.frameNumber || 1
  };
}
;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/Length.ts





const Length = {
  toAnnotation: measurement => {},
  /**
   * Maps cornerstone annotation event data to measurement service format.
   *
   * @param {Object} cornerstone Cornerstone event data
   * @return {Measurement} Measurement instance
   */
  toMeasurement: (csToolsEventDetail, displaySetService, cornerstoneViewportService, getValueTypeFromToolType, customizationService) => {
    const {
      annotation
    } = csToolsEventDetail;
    const {
      metadata,
      data,
      annotationUID
    } = annotation;
    const isLocked = getIsLocked(annotationUID);
    const isVisible = getIsVisible(annotationUID);
    // const colorString = config.style.getStyleProperty('color', { annotationUID });

    // color string is like 'rgb(255, 255, 255)' we need them to be in RGBA array [255, 255, 255, 255]
    // Todo: this should be in a utility
    // const color = colorString.replace('rgb(', '').replace(')', '').split(',').map(Number);

    if (!metadata || !data) {
      console.warn('Length tool: Missing metadata or data');
      return null;
    }
    const {
      toolName,
      referencedImageId,
      FrameOfReferenceUID
    } = metadata;
    const validToolType = constants_supportedTools.includes(toolName);
    if (!validToolType) {
      throw new Error('Tool not supported');
    }
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      StudyInstanceUID
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    let displaySet;
    if (SOPInstanceUID) {
      displaySet = displaySetService.getDisplaySetForSOPInstanceUID(SOPInstanceUID, SeriesInstanceUID);
    } else {
      displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
    }
    const {
      points,
      textBox
    } = data.handles;
    const mappedAnnotations = getMappedAnnotations(annotation, displaySetService);
    const displayText = getDisplayText(mappedAnnotations, displaySet);
    const getReport = () => _getReport(mappedAnnotations, points, FrameOfReferenceUID, customizationService);
    return {
      uid: annotationUID,
      SOPInstanceUID,
      FrameOfReferenceUID,
      points,
      textBox,
      isLocked,
      isVisible,
      metadata,
      referenceSeriesUID: SeriesInstanceUID,
      referenceStudyUID: StudyInstanceUID,
      referencedImageId,
      frameNumber: mappedAnnotations[0]?.frameNumber || 1,
      toolName: metadata.toolName,
      displaySetInstanceUID: displaySet.displaySetInstanceUID,
      label: data.label,
      displayText: displayText,
      data: data.cachedStats,
      type: getValueTypeFromToolType(toolName),
      getReport
    };
  }
};
function getMappedAnnotations(annotation, displaySetService) {
  const {
    metadata,
    data
  } = annotation;
  const {
    cachedStats
  } = data;
  const {
    referencedImageId
  } = metadata;
  const targets = Object.keys(cachedStats);
  if (!targets.length) {
    return [];
  }
  const annotations = [];
  Object.keys(cachedStats).forEach(targetId => {
    const targetStats = cachedStats[targetId];
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      frameNumber
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    const displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
    const {
      SeriesNumber
    } = displaySet;
    const {
      length,
      unit = 'mm'
    } = targetStats;
    annotations.push({
      SeriesInstanceUID,
      SOPInstanceUID,
      SeriesNumber,
      frameNumber,
      unit,
      length
    });
  });
  return annotations;
}

/*
This function is used to convert the measurement data to a format that is
suitable for the report generation (e.g. for the csv report). The report
returns a list of columns and corresponding values.
*/
function _getReport(mappedAnnotations, points, FrameOfReferenceUID, customizationService) {
  const columns = [];
  const values = [];

  // Add Type
  columns.push('AnnotationType');
  values.push('Cornerstone:Length');
  mappedAnnotations.forEach(annotation => {
    const {
      length,
      unit
    } = annotation;
    columns.push(`Length`);
    values.push(length);
    columns.push('Unit');
    values.push(unit);
  });
  if (FrameOfReferenceUID) {
    columns.push('FrameOfReferenceUID');
    values.push(FrameOfReferenceUID);
  }
  if (points) {
    columns.push('points');
    // points has the form of [[x1, y1, z1], [x2, y2, z2], ...]
    // convert it to string of [[x1 y1 z1];[x2 y2 z2];...]
    // so that it can be used in the csv report
    values.push(points.map(p => p.join(' ')).join(';'));
  }
  return {
    columns,
    values
  };
}
function getDisplayText(mappedAnnotations, displaySet) {
  const displayText = {
    primary: [],
    secondary: []
  };
  if (!mappedAnnotations || !mappedAnnotations.length) {
    return displayText;
  }

  // Length is the same for all series
  const {
    length,
    SeriesNumber,
    SOPInstanceUID,
    frameNumber,
    unit
  } = mappedAnnotations[0];
  const instance = displaySet.instances.find(image => image.SOPInstanceUID === SOPInstanceUID);
  let InstanceNumber;
  if (instance) {
    InstanceNumber = instance.InstanceNumber;
  }
  const instanceText = InstanceNumber ? ` I: ${InstanceNumber}` : '';
  const frameText = displaySet.isMultiFrame ? ` F: ${frameNumber}` : '';
  if (length === null || length === undefined) {
    return displayText;
  }
  const roundedLength = src.utils.roundNumber(length, 2);
  displayText.primary.push(`${roundedLength} ${unit}`);
  displayText.secondary.push(`S: ${SeriesNumber}${instanceText}${frameText}`);
  return displayText;
}
/* harmony default export */ const measurementServiceMappings_Length = (Length);
;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/utils/getHandlesFromPoints.js
function getHandlesFromPoints(points) {
  if (points.longAxis && points.shortAxis) {
    const handles = {};
    handles.start = points.longAxis[0];
    handles.end = points.longAxis[1];
    handles.perpendicularStart = points.longAxis[0];
    handles.perpendicularEnd = points.longAxis[1];
    return handles;
  }
  return points.map((p, i) => i % 10 === 0 ? {
    start: p
  } : {
    end: p
  }).reduce((obj, item) => Object.assign(obj, {
    ...item
  }), {});
}
;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/utils/selection.ts


/**
 * Check whether an annotation from imaging library is selected or not.
 * @param {string} annotationUID uid of imaging library annotation
 * @returns boolean
 */
function isAnnotationSelected(annotationUID) {
  return dist_esm.annotation.selection.isAnnotationSelected(annotationUID);
}

/**
 * Change an annotation from imaging library's selected property.
 * @param annotationUID - uid of imaging library annotation
 * @param selected - new value for selected
 */
function setAnnotationSelected(annotationUID, selected) {
  const isCurrentSelected = isAnnotationSelected(annotationUID);
  // branch cut, avoid invoking imaging library unnecessarily.
  if (isCurrentSelected !== selected) {
    dist_esm.annotation.selection.setAnnotationSelected(annotationUID, selected);
  }
}
function getFirstAnnotationSelected(element) {
  const [selectedAnnotationUID] = dist_esm.annotation.selection.getAnnotationsSelected() || [];
  if (selectedAnnotationUID) {
    return dist_esm.annotation.state.getAnnotation(selectedAnnotationUID);
  }
}

;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/utils/getDisplayUnit.js
const getDisplayUnit = unit => unit == null ? '' : unit;
/* harmony default export */ const utils_getDisplayUnit = (getDisplayUnit);
;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/utils/index.ts





;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/Bidirectional.ts






const Bidirectional = {
  toAnnotation: measurement => {},
  toMeasurement: (csToolsEventDetail, displaySetService, cornerstoneViewportService, getValueTypeFromToolType, customizationService) => {
    const {
      annotation
    } = csToolsEventDetail;
    const {
      metadata,
      data,
      annotationUID
    } = annotation;
    const isLocked = getIsLocked(annotationUID);
    const isVisible = getIsVisible(annotationUID);
    if (!metadata || !data) {
      console.warn('Length tool: Missing metadata or data');
      return null;
    }
    const {
      toolName,
      referencedImageId,
      FrameOfReferenceUID
    } = metadata;
    const validToolType = constants_supportedTools.includes(toolName);
    if (!validToolType) {
      throw new Error('Tool not supported');
    }
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      StudyInstanceUID
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    let displaySet;
    if (SOPInstanceUID) {
      displaySet = displaySetService.getDisplaySetForSOPInstanceUID(SOPInstanceUID, SeriesInstanceUID);
    } else {
      displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
    }
    const {
      points,
      textBox
    } = data.handles;
    const mappedAnnotations = Bidirectional_getMappedAnnotations(annotation, displaySetService);
    const displayText = Bidirectional_getDisplayText(mappedAnnotations, displaySet);
    const getReport = () => Bidirectional_getReport(mappedAnnotations, points, FrameOfReferenceUID, customizationService);
    return {
      uid: annotationUID,
      SOPInstanceUID,
      FrameOfReferenceUID,
      points,
      textBox,
      isLocked,
      isVisible,
      metadata,
      referenceSeriesUID: SeriesInstanceUID,
      referenceStudyUID: StudyInstanceUID,
      referencedImageId,
      frameNumber: mappedAnnotations[0]?.frameNumber || 1,
      toolName: metadata.toolName,
      displaySetInstanceUID: displaySet.displaySetInstanceUID,
      label: data.label,
      displayText: displayText,
      data: data.cachedStats,
      type: getValueTypeFromToolType(toolName),
      getReport
    };
  }
};
function Bidirectional_getMappedAnnotations(annotation, displaySetService) {
  const {
    metadata,
    data
  } = annotation;
  const {
    cachedStats = {}
  } = data;
  const {
    referencedImageId
  } = metadata;
  const targets = Object.keys(cachedStats);
  if (!targets.length) {
    return [];
  }
  const annotations = [];
  Object.keys(cachedStats).forEach(targetId => {
    const targetStats = cachedStats[targetId];
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      frameNumber
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    const displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
    const {
      SeriesNumber
    } = displaySet;
    const {
      length,
      width,
      unit
    } = targetStats;
    annotations.push({
      SeriesInstanceUID,
      SOPInstanceUID,
      SeriesNumber,
      frameNumber,
      unit,
      length,
      width
    });
  });
  return annotations;
}

/*
This function is used to convert the measurement data to a format that is
suitable for the report generation (e.g. for the csv report). The report
returns a list of columns and corresponding values.
*/
function Bidirectional_getReport(mappedAnnotations, points, FrameOfReferenceUID, customizationService) {
  const columns = [];
  const values = [];

  // Add Type
  columns.push('AnnotationType');
  values.push('Cornerstone:Bidirectional');
  mappedAnnotations.forEach(annotation => {
    const {
      length,
      width,
      unit
    } = annotation;
    columns.push(`Length`, `Width`, 'Unit');
    values.push(length, width, unit);
  });
  if (FrameOfReferenceUID) {
    columns.push('FrameOfReferenceUID');
    values.push(FrameOfReferenceUID);
  }
  if (points) {
    columns.push('points');
    // points has the form of [[x1, y1, z1], [x2, y2, z2], ...]
    // convert it to string of [[x1 y1 z1];[x2 y2 z2];...]
    // so that it can be used in the csv report
    values.push(points.map(p => p.join(' ')).join(';'));
  }
  return {
    columns,
    values
  };
}
function Bidirectional_getDisplayText(mappedAnnotations, displaySet) {
  const displayText = {
    primary: [],
    secondary: []
  };
  if (!mappedAnnotations || !mappedAnnotations.length) {
    return displayText;
  }

  // Area is the same for all series
  const {
    length,
    width,
    unit,
    SeriesNumber,
    SOPInstanceUID,
    frameNumber
  } = mappedAnnotations[0];
  const roundedLength = src.utils.roundNumber(length, 2);
  const roundedWidth = src.utils.roundNumber(width, 2);
  const instance = displaySet.instances.find(image => image.SOPInstanceUID === SOPInstanceUID);
  let InstanceNumber;
  if (instance) {
    InstanceNumber = instance.InstanceNumber;
  }
  const instanceText = InstanceNumber ? ` I: ${InstanceNumber}` : '';
  const frameText = displaySet.isMultiFrame ? ` F: ${frameNumber}` : '';
  displayText.primary.push(`L: ${roundedLength} ${utils_getDisplayUnit(unit)}`);
  displayText.primary.push(`W: ${roundedWidth} ${utils_getDisplayUnit(unit)}`);
  displayText.secondary.push(`S: ${SeriesNumber}${instanceText}${frameText}`);
  return displayText;
}
/* harmony default export */ const measurementServiceMappings_Bidirectional = (Bidirectional);
;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/utils/getValueDisplayString.js


const getStatisticDisplayString = (numbers, unit, key) => {
  if (Array.isArray(numbers) && numbers.length > 0) {
    const results = numbers.map(number => src.utils.roundNumber(number, 2));
    return `${key.charAt(0).toUpperCase() + key.slice(1)}: ${results.join(', ')} ${utils_getDisplayUnit(unit)}`;
  }
  const result = src.utils.roundNumber(numbers, 2);
  return `${key.charAt(0).toUpperCase() + key.slice(1)}: ${result} ${utils_getDisplayUnit(unit)}`;
};
;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/EllipticalROI.ts







const EllipticalROI = {
  toAnnotation: measurement => {},
  toMeasurement: (csToolsEventDetail, displaySetService, cornerstoneViewportService, getValueTypeFromToolType, customizationService) => {
    const {
      annotation
    } = csToolsEventDetail;
    const {
      metadata,
      data,
      annotationUID
    } = annotation;
    const isLocked = getIsLocked(annotationUID);
    const isVisible = getIsVisible(annotationUID);
    if (!metadata || !data) {
      console.warn('Length tool: Missing metadata or data');
      return null;
    }
    const {
      toolName,
      referencedImageId,
      FrameOfReferenceUID
    } = metadata;
    const validToolType = constants_supportedTools.includes(toolName);
    if (!validToolType) {
      throw new Error('Tool not supported');
    }
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      StudyInstanceUID
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    let displaySet;
    if (SOPInstanceUID) {
      displaySet = displaySetService.getDisplaySetForSOPInstanceUID(SOPInstanceUID, SeriesInstanceUID);
    } else {
      displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
    }
    const {
      points,
      textBox
    } = data.handles;
    const mappedAnnotations = EllipticalROI_getMappedAnnotations(annotation, displaySetService);
    const displayText = EllipticalROI_getDisplayText(mappedAnnotations, displaySet, customizationService);
    const getReport = () => EllipticalROI_getReport(mappedAnnotations, points, FrameOfReferenceUID, customizationService);
    return {
      uid: annotationUID,
      SOPInstanceUID,
      FrameOfReferenceUID,
      points,
      textBox,
      metadata,
      isLocked,
      isVisible,
      referenceSeriesUID: SeriesInstanceUID,
      referenceStudyUID: StudyInstanceUID,
      referencedImageId,
      frameNumber: mappedAnnotations[0]?.frameNumber || 1,
      toolName: metadata.toolName,
      displaySetInstanceUID: displaySet.displaySetInstanceUID,
      label: data.label,
      displayText: displayText,
      data: data.cachedStats,
      type: getValueTypeFromToolType(toolName),
      getReport
    };
  }
};
function EllipticalROI_getMappedAnnotations(annotation, displaySetService) {
  const {
    metadata,
    data
  } = annotation;
  const {
    cachedStats
  } = data;
  const {
    referencedImageId
  } = metadata;
  const targets = Object.keys(cachedStats);
  if (!targets.length) {
    return [];
  }
  const annotations = [];
  const addedModalities = new Set();
  Object.keys(cachedStats).forEach(targetId => {
    const targetStats = cachedStats[targetId];
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      frameNumber
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    const displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
    const {
      SeriesNumber
    } = displaySet;
    const {
      mean,
      stdDev,
      max,
      area,
      Modality,
      areaUnit,
      modalityUnit
    } = targetStats;

    // Skip if we've already added this modality
    if (Modality && addedModalities.has(Modality)) {
      return;
    }

    // Add modality to the set if it exists
    if (Modality) {
      addedModalities.add(Modality);
    }
    annotations.push({
      SeriesInstanceUID,
      SOPInstanceUID,
      SeriesNumber,
      frameNumber,
      Modality,
      unit: modalityUnit,
      areaUnit,
      mean,
      stdDev,
      max,
      area
    });
  });
  return annotations;
}

/*
This function is used to convert the measurement data to a format that is
suitable for the report generation (e.g. for the csv report). The report
returns a list of columns and corresponding values.
*/
function EllipticalROI_getReport(mappedAnnotations, points, FrameOfReferenceUID, customizationService) {
  const columns = [];
  const values = [];

  // Add Type
  columns.push('AnnotationType');
  values.push('Cornerstone:EllipticalROI');
  mappedAnnotations.forEach(annotation => {
    const {
      mean,
      stdDev,
      max,
      area,
      unit,
      areaUnit
    } = annotation;
    if (!mean || !unit || !max || !area) {
      return;
    }
    columns.push(`max (${unit})`, `mean (${unit})`, `std (${unit})`, 'Area', 'Unit');
    values.push(max, mean, stdDev, area, areaUnit);
  });
  if (FrameOfReferenceUID) {
    columns.push('FrameOfReferenceUID');
    values.push(FrameOfReferenceUID);
  }
  if (points) {
    columns.push('points');
    // points has the form of [[x1, y1, z1], [x2, y2, z2], ...]
    // convert it to string of [[x1 y1 z1];[x2 y2 z2];...]
    // so that it can be used in the csv report
    values.push(points.map(p => p.join(' ')).join(';'));
  }
  return {
    columns,
    values
  };
}
function EllipticalROI_getDisplayText(mappedAnnotations, displaySet, customizationService) {
  const displayText = {
    primary: [],
    secondary: []
  };
  if (!mappedAnnotations || !mappedAnnotations.length) {
    return displayText;
  }

  // Area is the same for all series
  const {
    area,
    SOPInstanceUID,
    frameNumber,
    areaUnit
  } = mappedAnnotations[0];
  const instance = displaySet.instances.find(image => image.SOPInstanceUID === SOPInstanceUID);
  let InstanceNumber;
  if (instance) {
    InstanceNumber = instance.InstanceNumber;
  }
  const instanceText = InstanceNumber ? ` I: ${InstanceNumber}` : '';
  const frameText = displaySet.isMultiFrame ? ` F: ${frameNumber}` : '';
  const roundedArea = src.utils.roundNumber(area, 2);
  displayText.primary.push(`${roundedArea} ${utils_getDisplayUnit(areaUnit)}`);

  // Todo: we need a better UI for displaying all these information
  mappedAnnotations.forEach(mappedAnnotation => {
    const {
      unit,
      max,
      SeriesNumber
    } = mappedAnnotation;
    const maxStr = getStatisticDisplayString(max, unit, 'max');
    displayText.primary.push(maxStr);
    displayText.secondary.push(`S: ${SeriesNumber}${instanceText}${frameText}`);
  });
  return displayText;
}
/* harmony default export */ const measurementServiceMappings_EllipticalROI = (EllipticalROI);
;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/CircleROI.ts







const CircleROI = {
  toAnnotation: measurement => {},
  toMeasurement: (csToolsEventDetail, displaySetService, CornerstoneViewportService, getValueTypeFromToolType, customizationService) => {
    const {
      annotation
    } = csToolsEventDetail;
    const {
      metadata,
      data,
      annotationUID
    } = annotation;
    const isLocked = getIsLocked(annotationUID);
    const isVisible = getIsVisible(annotationUID);
    if (!metadata || !data) {
      console.warn('Length tool: Missing metadata or data');
      return null;
    }
    const {
      toolName,
      referencedImageId,
      FrameOfReferenceUID
    } = metadata;
    const validToolType = constants_supportedTools.includes(toolName);
    if (!validToolType) {
      throw new Error('Tool not supported');
    }
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      StudyInstanceUID
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    let displaySet;
    if (SOPInstanceUID) {
      displaySet = displaySetService.getDisplaySetForSOPInstanceUID(SOPInstanceUID, SeriesInstanceUID);
    } else {
      displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
    }
    const {
      points,
      textBox
    } = data.handles;
    const mappedAnnotations = CircleROI_getMappedAnnotations(annotation, displaySetService);
    const displayText = CircleROI_getDisplayText(mappedAnnotations, displaySet);
    const getReport = () => CircleROI_getReport(mappedAnnotations, points, FrameOfReferenceUID, customizationService);
    return {
      uid: annotationUID,
      SOPInstanceUID,
      FrameOfReferenceUID,
      points,
      textBox,
      isLocked,
      isVisible,
      metadata,
      referenceSeriesUID: SeriesInstanceUID,
      referenceStudyUID: StudyInstanceUID,
      referencedImageId,
      frameNumber: mappedAnnotations[0]?.frameNumber || 1,
      toolName: metadata.toolName,
      displaySetInstanceUID: displaySet.displaySetInstanceUID,
      label: data.label,
      displayText: displayText,
      data: data.cachedStats,
      type: getValueTypeFromToolType(toolName),
      getReport
    };
  }
};
function CircleROI_getMappedAnnotations(annotation, displaySetService) {
  const {
    metadata,
    data
  } = annotation;
  const {
    cachedStats = {}
  } = data;
  const {
    referencedImageId
  } = metadata;
  const targets = Object.keys(cachedStats);
  if (!targets.length) {
    return [];
  }
  const annotations = [];
  const addedModalities = new Set();
  Object.keys(cachedStats).forEach(targetId => {
    const targetStats = cachedStats[targetId];
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      frameNumber
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    const displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
    const {
      SeriesNumber
    } = displaySet;
    const {
      mean,
      stdDev,
      max,
      area,
      Modality,
      areaUnit,
      modalityUnit,
      perimeter,
      radiusUnit
    } = targetStats;
    if (Modality && addedModalities.has(Modality)) {
      return;
    }
    addedModalities.add(Modality);
    annotations.push({
      SeriesInstanceUID,
      SOPInstanceUID,
      SeriesNumber,
      frameNumber,
      Modality,
      unit: modalityUnit,
      mean,
      stdDev,
      max,
      area,
      areaUnit,
      perimeter,
      radiusUnit
    });
  });
  return annotations;
}

/*
This function is used to convert the measurement data to a format that is
suitable for the report generation (e.g. for the csv report). The report
returns a list of columns and corresponding values.
*/
function CircleROI_getReport(mappedAnnotations, points, FrameOfReferenceUID, customizationService) {
  const columns = [];
  const values = [];

  // Add Type
  columns.push('AnnotationType');
  values.push('Cornerstone:CircleROI');
  mappedAnnotations.forEach(annotation => {
    const {
      mean,
      stdDev,
      max,
      area,
      unit,
      areaUnit
    } = annotation;
    if (!mean || !unit || !max || !area) {
      return;
    }
    columns.push(`max (${unit})`, `mean (${unit})`, `std (${unit})`, 'Area', 'Unit');
    values.push(max, mean, stdDev, area, areaUnit);
  });
  if (FrameOfReferenceUID) {
    columns.push('FrameOfReferenceUID');
    values.push(FrameOfReferenceUID);
  }
  if (points) {
    columns.push('points');
    // points has the form of [[x1, y1, z1], [x2, y2, z2], ...]
    // convert it to string of [[x1 y1 z1];[x2 y2 z2];...]
    // so that it can be used in the csv report
    values.push(points.map(p => p.join(' ')).join(';'));
  }
  return {
    columns,
    values
  };
}
function CircleROI_getDisplayText(mappedAnnotations, displaySet) {
  const displayText = {
    primary: [],
    secondary: []
  };
  if (!mappedAnnotations || !mappedAnnotations.length) {
    return displayText;
  }

  // Area is the same for all series
  const {
    area,
    SOPInstanceUID,
    frameNumber,
    areaUnit
  } = mappedAnnotations[0];
  const instance = displaySet.instances.find(image => image.SOPInstanceUID === SOPInstanceUID);
  let InstanceNumber;
  if (instance) {
    InstanceNumber = instance.InstanceNumber;
  }
  const instanceText = InstanceNumber ? ` I: ${InstanceNumber}` : '';
  const frameText = displaySet.isMultiFrame ? ` F: ${frameNumber}` : '';

  // Area sometimes becomes undefined if `preventHandleOutsideImage` is off.
  if (!isNaN(area)) {
    const roundedArea = src.utils.roundNumber(area || 0, 2);
    displayText.primary.push(`${roundedArea} ${utils_getDisplayUnit(areaUnit)}`);
  }

  // Todo: we need a better UI for displaying all these information
  mappedAnnotations.forEach(mappedAnnotation => {
    const {
      unit,
      perimeter,
      radiusUnit,
      max,
      SeriesNumber
    } = mappedAnnotation;
    if (!isNaN(max)) {
      const maxStr = getStatisticDisplayString(max, unit, 'max');
      displayText.primary.push(maxStr);
    } else if (perimeter && !isNaN(perimeter)) {
      const perimeterStr = getStatisticDisplayString(perimeter, radiusUnit, 'perimeter');
      displayText.primary.push(perimeterStr);
    }
    displayText.secondary.push(`S: ${SeriesNumber}${instanceText}${frameText}`);
  });
  return displayText;
}
/* harmony default export */ const measurementServiceMappings_CircleROI = (CircleROI);
;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/ArrowAnnotate.ts




const ArrowAnnotate = {
  toAnnotation: measurement => {},
  /**
   * Maps cornerstone annotation event data to measurement service format.
   *
   * @param {Object} cornerstone Cornerstone event data
   * @return {Measurement} Measurement instance
   */
  toMeasurement: (csToolsEventDetail, displaySetService, cornerstoneViewportService, getValueTypeFromToolType, customizationService) => {
    const {
      annotation
    } = csToolsEventDetail;
    const {
      metadata,
      data,
      annotationUID
    } = annotation;
    const isLocked = getIsLocked(annotationUID);
    const isVisible = getIsVisible(annotationUID);
    if (!metadata || !data) {
      console.warn('Length tool: Missing metadata or data');
      return null;
    }
    const {
      toolName,
      referencedImageId,
      FrameOfReferenceUID
    } = metadata;
    const validToolType = constants_supportedTools.includes(toolName);
    if (!validToolType) {
      throw new Error('Tool not supported');
    }
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      StudyInstanceUID
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    let displaySet;
    if (SOPInstanceUID) {
      displaySet = displaySetService.getDisplaySetForSOPInstanceUID(SOPInstanceUID, SeriesInstanceUID);
    } else {
      displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
    }
    const {
      points,
      textBox
    } = data.handles;
    const mappedAnnotations = ArrowAnnotate_getMappedAnnotations(annotation, displaySetService);
    const displayText = ArrowAnnotate_getDisplayText(mappedAnnotations, displaySet);
    const getReport = () => ArrowAnnotate_getReport(mappedAnnotations, points, FrameOfReferenceUID);
    return {
      uid: annotationUID,
      SOPInstanceUID,
      FrameOfReferenceUID,
      points,
      textBox,
      isLocked,
      isVisible,
      metadata,
      referenceSeriesUID: SeriesInstanceUID,
      referenceStudyUID: StudyInstanceUID,
      referencedImageId,
      frameNumber: mappedAnnotations[0]?.frameNumber || 1,
      toolName: metadata.toolName,
      displaySetInstanceUID: displaySet.displaySetInstanceUID,
      label: data.label,
      displayText: displayText,
      data: data.cachedStats,
      type: getValueTypeFromToolType(toolName),
      getReport
    };
  }
};
function ArrowAnnotate_getMappedAnnotations(annotation, displaySetService) {
  const {
    metadata,
    data
  } = annotation;
  const {
    text
  } = data;
  const {
    referencedImageId
  } = metadata;
  const annotations = [];
  const {
    SOPInstanceUID,
    SeriesInstanceUID,
    frameNumber
  } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
  const displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
  const {
    SeriesNumber
  } = displaySet;
  annotations.push({
    SeriesInstanceUID,
    SOPInstanceUID,
    SeriesNumber,
    frameNumber,
    text
  });
  return annotations;
}
function ArrowAnnotate_getDisplayText(mappedAnnotations, displaySet) {
  const displayText = {
    primary: [],
    secondary: []
  };
  if (!mappedAnnotations || !mappedAnnotations.length) {
    return displayText;
  }
  const {
    SeriesNumber,
    SOPInstanceUID,
    frameNumber,
    text
  } = mappedAnnotations[0];
  const instance = displaySet.instances.find(image => image.SOPInstanceUID === SOPInstanceUID);
  let InstanceNumber;
  if (instance) {
    InstanceNumber = instance.InstanceNumber;
  }
  const instanceText = InstanceNumber ? ` I: ${InstanceNumber}` : '';
  const frameText = displaySet.isMultiFrame ? ` F: ${frameNumber}` : '';

  // Add the annotation text to the primary array
  if (text) {
    displayText.primary.push(text);
  }

  // Add the series information to the secondary array
  displayText.secondary.push(`S: ${SeriesNumber}${instanceText}${frameText}`);
  return displayText;
}
function ArrowAnnotate_getReport(mappedAnnotations, points, FrameOfReferenceUID) {
  const columns = [];
  const values = [];
  columns.push('AnnotationType');
  values.push('Cornerstone:ArrowAnnote');
  mappedAnnotations.forEach(annotation => {
    const {
      text
    } = annotation;
    columns.push(`Text`);
    values.push(text);
  });
  if (FrameOfReferenceUID) {
    columns.push('FrameOfReferenceUID');
    values.push(FrameOfReferenceUID);
  }
  if (points) {
    columns.push('points');
    values.push(points.map(p => p.join(' ')).join(';'));
  }
  return {
    columns,
    values
  };
}
/* harmony default export */ const measurementServiceMappings_ArrowAnnotate = (ArrowAnnotate);
;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/CobbAngle.ts






const CobbAngle = {
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
    const isLocked = getIsLocked(annotationUID);
    const isVisible = getIsVisible(annotationUID);
    if (!metadata || !data) {
      console.warn('Cobb Angle tool: Missing metadata or data');
      return null;
    }
    const {
      toolName,
      referencedImageId,
      FrameOfReferenceUID
    } = metadata;
    const validToolType = constants_supportedTools.includes(toolName);
    if (!validToolType) {
      throw new Error('Tool not supported');
    }
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      StudyInstanceUID
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    let displaySet;
    if (SOPInstanceUID) {
      displaySet = displaySetService.getDisplaySetForSOPInstanceUID(SOPInstanceUID, SeriesInstanceUID);
    } else {
      displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
    }
    const {
      points,
      textBox
    } = data.handles;
    const mappedAnnotations = CobbAngle_getMappedAnnotations(annotation, displaySetService);
    const displayText = CobbAngle_getDisplayText(mappedAnnotations, displaySet);
    const getReport = () => CobbAngle_getReport(mappedAnnotations, points, FrameOfReferenceUID, customizationService);
    return {
      uid: annotationUID,
      SOPInstanceUID,
      FrameOfReferenceUID,
      points,
      textBox,
      isLocked,
      isVisible,
      metadata,
      referenceSeriesUID: SeriesInstanceUID,
      referenceStudyUID: StudyInstanceUID,
      referencedImageId,
      frameNumber: mappedAnnotations?.[0]?.frameNumber || 1,
      toolName: metadata.toolName,
      displaySetInstanceUID: displaySet.displaySetInstanceUID,
      label: data.label,
      displayText: displayText,
      data: data.cachedStats,
      type: getValueTypeFromToolType(toolName),
      getReport
    };
  }
};
function CobbAngle_getMappedAnnotations(annotation, displaySetService) {
  const {
    metadata,
    data
  } = annotation;
  const {
    cachedStats
  } = data;
  const {
    referencedImageId
  } = metadata;
  if (!cachedStats) {
    return;
  }
  const targets = Object.keys(cachedStats);
  if (!targets.length) {
    return;
  }
  const annotations = [];
  Object.keys(cachedStats).forEach(targetId => {
    const targetStats = cachedStats[targetId];
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      frameNumber
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    const displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
    const {
      SeriesNumber
    } = displaySet;
    const {
      angle
    } = targetStats;
    const unit = '\u00B0';
    annotations.push({
      SeriesInstanceUID,
      SOPInstanceUID,
      SeriesNumber,
      frameNumber,
      unit,
      angle
    });
  });
  return annotations;
}

/*
This function is used to convert the measurement data to a format that is
suitable for the report generation (e.g. for the csv report). The report
returns a list of columns and corresponding values.
*/
function CobbAngle_getReport(mappedAnnotations, points, FrameOfReferenceUID, customizationService) {
  const columns = [];
  const values = [];

  // Add Type
  columns.push('AnnotationType');
  values.push('Cornerstone:CobbAngle');
  mappedAnnotations.forEach(annotation => {
    const {
      angle,
      unit
    } = annotation;
    columns.push(`Angle (${unit})`);
    values.push(angle);
  });
  if (FrameOfReferenceUID) {
    columns.push('FrameOfReferenceUID');
    values.push(FrameOfReferenceUID);
  }
  if (points) {
    columns.push('points');
    // points has the form of [[x1, y1, z1], [x2, y2, z2], ...]
    // convert it to string of [[x1 y1 z1];[x2 y2 z2];...]
    // so that it can be used in the csv report
    values.push(points.map(p => p.join(' ')).join(';'));
  }
  return {
    columns,
    values
  };
}
function CobbAngle_getDisplayText(mappedAnnotations, displaySet) {
  const displayText = {
    primary: [],
    secondary: []
  };
  if (!mappedAnnotations || !mappedAnnotations.length) {
    return displayText;
  }

  // Angle is the same for all series
  const {
    angle,
    unit,
    SeriesNumber,
    SOPInstanceUID,
    frameNumber
  } = mappedAnnotations[0];
  const instance = displaySet.instances.find(image => image.SOPInstanceUID === SOPInstanceUID);
  let InstanceNumber;
  if (instance) {
    InstanceNumber = instance.InstanceNumber;
  }
  const instanceText = InstanceNumber ? ` I: ${InstanceNumber}` : '';
  const frameText = displaySet.isMultiFrame ? ` F: ${frameNumber}` : '';
  if (angle === undefined) {
    return displayText;
  }
  const roundedAngle = src.utils.roundNumber(angle, 2);
  displayText.primary.push(`${roundedAngle} ${utils_getDisplayUnit(unit)}`);
  displayText.secondary.push(`S: ${SeriesNumber}${instanceText}${frameText}`);
  return displayText;
}
/* harmony default export */ const measurementServiceMappings_CobbAngle = (CobbAngle);
;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/Angle.ts






const Angle = {
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
    const isLocked = getIsLocked(annotationUID);
    const isVisible = getIsVisible(annotationUID);
    if (!metadata || !data) {
      console.warn('Length tool: Missing metadata or data');
      return null;
    }
    const {
      toolName,
      referencedImageId,
      FrameOfReferenceUID
    } = metadata;
    const validToolType = constants_supportedTools.includes(toolName);
    if (!validToolType) {
      throw new Error('Tool not supported');
    }
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      StudyInstanceUID
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    let displaySet;
    if (SOPInstanceUID) {
      displaySet = displaySetService.getDisplaySetForSOPInstanceUID(SOPInstanceUID, SeriesInstanceUID);
    } else {
      displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
    }
    const {
      points,
      textBox
    } = data.handles;
    const mappedAnnotations = Angle_getMappedAnnotations(annotation, displaySetService);
    const displayText = Angle_getDisplayText(mappedAnnotations, displaySet);
    const getReport = () => Angle_getReport(mappedAnnotations, points, FrameOfReferenceUID, customizationService);
    return {
      uid: annotationUID,
      SOPInstanceUID,
      FrameOfReferenceUID,
      points,
      textBox,
      isLocked,
      isVisible,
      metadata,
      referenceSeriesUID: SeriesInstanceUID,
      referenceStudyUID: StudyInstanceUID,
      frameNumber: mappedAnnotations?.[0]?.frameNumber || 1,
      toolName: metadata.toolName,
      displaySetInstanceUID: displaySet.displaySetInstanceUID,
      label: data.label,
      displayText: displayText,
      data: data.cachedStats,
      type: getValueTypeFromToolType(toolName),
      getReport,
      referencedImageId
    };
  }
};
function Angle_getMappedAnnotations(annotation, displaySetService) {
  const {
    metadata,
    data
  } = annotation;
  const {
    cachedStats
  } = data;
  const {
    referencedImageId
  } = metadata;
  const targets = Object.keys(cachedStats);
  if (!targets.length) {
    return;
  }
  const annotations = [];
  Object.keys(cachedStats).forEach(targetId => {
    const targetStats = cachedStats[targetId];
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      frameNumber
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    const displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
    const {
      SeriesNumber
    } = displaySet;
    const {
      angle
    } = targetStats;
    const unit = '\u00B0';
    annotations.push({
      SeriesInstanceUID,
      SOPInstanceUID,
      SeriesNumber,
      frameNumber,
      unit,
      angle
    });
  });
  return annotations;
}

/*
This function is used to convert the measurement data to a format that is
suitable for the report generation (e.g. for the csv report). The report
returns a list of columns and corresponding values.
*/
function Angle_getReport(mappedAnnotations, points, FrameOfReferenceUID, customizationService) {
  const columns = [];
  const values = [];

  // Add Type
  columns.push('AnnotationType');
  values.push('Cornerstone:Angle');
  mappedAnnotations.forEach(annotation => {
    const {
      angle,
      unit
    } = annotation;
    columns.push(`Angle (${unit})`);
    values.push(angle);
  });
  if (FrameOfReferenceUID) {
    columns.push('FrameOfReferenceUID');
    values.push(FrameOfReferenceUID);
  }
  if (points) {
    columns.push('points');
    // points has the form of [[x1, y1, z1], [x2, y2, z2], ...]
    // convert it to string of [[x1 y1 z1];[x2 y2 z2];...]
    // so that it can be used in the csv report
    values.push(points.map(p => p.join(' ')).join(';'));
  }
  return {
    columns,
    values
  };
}
function Angle_getDisplayText(mappedAnnotations, displaySet) {
  const displayText = {
    primary: [],
    secondary: []
  };
  if (!mappedAnnotations || !mappedAnnotations.length) {
    return displayText;
  }

  // Area is the same for all series
  const {
    angle,
    unit,
    SeriesNumber,
    SOPInstanceUID,
    frameNumber
  } = mappedAnnotations[0];
  const instance = displaySet.instances.find(image => image.SOPInstanceUID === SOPInstanceUID);
  let InstanceNumber;
  if (instance) {
    InstanceNumber = instance.InstanceNumber;
  }
  const instanceText = InstanceNumber ? ` I: ${InstanceNumber}` : '';
  const frameText = displaySet.isMultiFrame ? ` F: ${frameNumber}` : '';
  if (angle === undefined) {
    return displayText;
  }
  const roundedAngle = src.utils.roundNumber(angle, 2);
  displayText.primary.push(`${roundedAngle} ${utils_getDisplayUnit(unit)}`);
  displayText.secondary.push(`S: ${SeriesNumber}${instanceText}${frameText}`);
  return displayText;
}
/* harmony default export */ const measurementServiceMappings_Angle = (Angle);
;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/PlanarFreehandROI.ts







/**
 * Represents a mapping utility for Planar Freehand ROI measurements.
 */
const PlanarFreehandROI = {
  toAnnotation: measurement => {},
  /**
   * Maps cornerstone annotation event data to measurement service format.
   *
   * @param {Object} csToolsEventDetail Cornerstone event data
   * @param {DisplaySetService} displaySetService Service for managing display sets
   * @param {CornerstoneViewportService} CornerstoneViewportService Service for managing viewports
   * @param {Function} getValueTypeFromToolType Function to get value type from tool type
   * @param {CustomizationService} customizationService Service for customization
   * @returns {Measurement | null} Measurement instance or null if invalid
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
    const isLocked = getIsLocked(annotationUID);
    const isVisible = getIsVisible(annotationUID);
    if (!metadata || !data) {
      console.debug('PlanarFreehandROI tool: Missing metadata or data');
      return null;
    }
    const {
      toolName,
      referencedImageId,
      FrameOfReferenceUID
    } = metadata;
    const validToolType = constants_supportedTools.includes(toolName);
    if (!validToolType) {
      throw new Error(`Tool ${toolName} not supported`);
    }
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      frameNumber,
      StudyInstanceUID
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    let displaySet;
    if (SOPInstanceUID) {
      displaySet = displaySetService.getDisplaySetForSOPInstanceUID(SOPInstanceUID, SeriesInstanceUID);
    } else {
      displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
    }
    const mappedAnnotations = PlanarFreehandROI_getMappedAnnotations(annotation, displaySetService);
    const displayText = PlanarFreehandROI_getDisplayText(mappedAnnotations, displaySet);
    return {
      uid: annotationUID,
      SOPInstanceUID,
      FrameOfReferenceUID,
      points: data.contour.polyline,
      textBox: data.handles.textBox,
      metadata,
      frameNumber,
      referenceSeriesUID: SeriesInstanceUID,
      referenceStudyUID: StudyInstanceUID,
      referencedImageId,
      toolName: metadata.toolName,
      displaySetInstanceUID: displaySet.displaySetInstanceUID,
      label: data.label,
      displayText: displayText,
      data: data.cachedStats,
      type: getValueTypeFromToolType(toolName),
      getReport: () => getColumnValueReport(annotation, customizationService),
      isLocked,
      isVisible
    };
  }
};

/**
 * Maps annotations to a structured format with relevant attributes.
 *
 * @param {Object} annotation The annotation object.
 * @param {DisplaySetService} displaySetService Service for managing display sets.
 * @returns {Array} Mapped annotations.
 */
function PlanarFreehandROI_getMappedAnnotations(annotation, displaySetService) {
  const {
    metadata,
    data
  } = annotation;
  const {
    cachedStats
  } = data;
  const {
    referencedImageId
  } = metadata;
  if (!cachedStats) {
    return;
  }
  const targets = Object.keys(cachedStats);
  if (!targets.length) {
    return [];
  }
  const annotations = [];
  Object.keys(cachedStats).forEach(targetId => {
    const targetStats = cachedStats[targetId];
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      frameNumber
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    const displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
    const {
      SeriesNumber
    } = displaySet;
    const {
      mean,
      stdDev,
      max,
      area,
      Modality,
      areaUnit,
      modalityUnit
    } = targetStats;
    annotations.push({
      SeriesInstanceUID,
      SOPInstanceUID,
      SeriesNumber,
      frameNumber,
      Modality,
      unit: modalityUnit,
      mean,
      stdDev,
      max,
      area,
      areaUnit
    });
  });
  return annotations;
}

/**
 * Converts the measurement data to a format suitable for report generation.
 *
 * @param {object} annotation The annotation object.
 * @param {CustomizationService} customizationService Service for customization.
 * @returns {object} Report's content.
 */
function getColumnValueReport(annotation, customizationService) {
  const {
    PlanarFreehandROI
  } = customizationService.getCustomization('cornerstone.measurements');
  const {
    report
  } = PlanarFreehandROI;
  const columns = [];
  const values = [];

  /** Add type */
  columns.push('AnnotationType');
  values.push('Cornerstone:PlanarFreehandROI');

  /** Add cachedStats */
  const {
    metadata,
    data
  } = annotation;
  const stats = data.cachedStats[`imageId:${metadata.referencedImageId}`];
  report.forEach(({
    name,
    value
  }) => {
    columns.push(name);
    stats[value] ? values.push(stats[value]) : values.push('not available');
  });

  /** Add FOR */
  if (metadata.FrameOfReferenceUID) {
    columns.push('FrameOfReferenceUID');
    values.push(metadata.FrameOfReferenceUID);
  }

  /** Add points */
  if (data.contour.polyline) {
    columns.push('points');
    values.push(data.contour.polyline.map(p => p.join(' ')).join(';'));
  }
  return {
    columns,
    values
  };
}

/**
 * Retrieves the display text for an annotation in a display set.
 *
 * @param {Array} mappedAnnotations The mapped annotations.
 * @param {Object} displaySet The display set object.
 * @returns {Object} Display text with primary and secondary information.
 */
function PlanarFreehandROI_getDisplayText(mappedAnnotations, displaySet) {
  const displayText = {
    primary: [],
    secondary: []
  };
  if (!mappedAnnotations || !mappedAnnotations.length) {
    return displayText;
  }

  // Area is the same for all series
  const {
    area,
    SOPInstanceUID,
    frameNumber,
    areaUnit
  } = mappedAnnotations[0];
  const instance = displaySet.instances.find(image => image.SOPInstanceUID === SOPInstanceUID);
  let InstanceNumber;
  if (instance) {
    InstanceNumber = instance.InstanceNumber;
  }
  const instanceText = InstanceNumber ? ` I: ${InstanceNumber}` : '';
  const frameText = displaySet.isMultiFrame ? ` F: ${frameNumber}` : '';
  const roundedArea = src.utils.roundNumber(area || 0, 2);
  displayText.primary.push(`${roundedArea} ${utils_getDisplayUnit(areaUnit)}`);
  mappedAnnotations.forEach(mappedAnnotation => {
    const {
      unit,
      max,
      SeriesNumber
    } = mappedAnnotation;
    const maxStr = getStatisticDisplayString(max, unit, 'max');
    displayText.primary.push(maxStr);
    displayText.secondary.push(`S: ${SeriesNumber}${instanceText}${frameText}`);
  });
  return displayText;
}
/* harmony default export */ const measurementServiceMappings_PlanarFreehandROI = (PlanarFreehandROI);
;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/RectangleROI.ts







const RectangleROI = {
  toAnnotation: measurement => {},
  toMeasurement: (csToolsEventDetail, displaySetService, CornerstoneViewportService, getValueTypeFromToolType, customizationService) => {
    const {
      annotation
    } = csToolsEventDetail;
    const {
      metadata,
      data,
      annotationUID
    } = annotation;
    const isLocked = getIsLocked(annotationUID);
    const isVisible = getIsVisible(annotationUID);
    if (!metadata || !data) {
      console.warn('Rectangle ROI tool: Missing metadata or data');
      return null;
    }
    const {
      toolName,
      referencedImageId,
      FrameOfReferenceUID
    } = metadata;
    const validToolType = constants_supportedTools.includes(toolName);
    if (!validToolType) {
      throw new Error('Tool not supported');
    }
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      StudyInstanceUID
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    let displaySet;
    if (SOPInstanceUID) {
      displaySet = displaySetService.getDisplaySetForSOPInstanceUID(SOPInstanceUID, SeriesInstanceUID);
    } else {
      displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
    }
    const {
      points,
      textBox
    } = data.handles;
    const mappedAnnotations = RectangleROI_getMappedAnnotations(annotation, displaySetService);
    const displayText = RectangleROI_getDisplayText(mappedAnnotations, displaySet, customizationService);
    const getReport = () => RectangleROI_getReport(mappedAnnotations, points, FrameOfReferenceUID, customizationService);
    return {
      uid: annotationUID,
      SOPInstanceUID,
      FrameOfReferenceUID,
      points,
      textBox,
      metadata,
      referenceSeriesUID: SeriesInstanceUID,
      referenceStudyUID: StudyInstanceUID,
      referencedImageId,
      frameNumber: mappedAnnotations[0]?.frameNumber || 1,
      toolName: metadata.toolName,
      displaySetInstanceUID: displaySet.displaySetInstanceUID,
      label: data.label,
      displayText: displayText,
      data: data.cachedStats,
      type: getValueTypeFromToolType(toolName),
      getReport,
      isLocked,
      isVisible
    };
  }
};
function RectangleROI_getMappedAnnotations(annotation, displaySetService) {
  const {
    metadata,
    data
  } = annotation;
  const {
    cachedStats
  } = data;
  const {
    referencedImageId
  } = metadata;
  const targets = Object.keys(cachedStats);
  if (!targets.length) {
    return [];
  }
  const annotations = [];
  const addedModalities = new Set();
  Object.keys(cachedStats).forEach(targetId => {
    const targetStats = cachedStats[targetId];
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      frameNumber
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    const displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
    const {
      SeriesNumber
    } = displaySet;
    const {
      mean,
      stdDev,
      max,
      area,
      Modality,
      modalityUnit,
      areaUnit
    } = targetStats;

    // Skip if we've already added this modality
    if (Modality && addedModalities.has(Modality)) {
      return;
    }

    // Add modality to the set if it exists
    if (Modality) {
      addedModalities.add(Modality);
    }
    annotations.push({
      SeriesInstanceUID,
      SOPInstanceUID,
      SeriesNumber,
      frameNumber,
      Modality,
      unit: modalityUnit,
      mean,
      stdDev,
      metadata,
      max,
      area,
      areaUnit
    });
  });
  return annotations;
}

/*
This function is used to convert the measurement data to a format that is
suitable for the report generation (e.g. for the csv report). The report
returns a list of columns and corresponding values.
*/
function RectangleROI_getReport(mappedAnnotations, points, FrameOfReferenceUID, customizationService) {
  const columns = [];
  const values = [];

  // Add Type
  columns.push('AnnotationType');
  values.push('Cornerstone:RectangleROI');
  mappedAnnotations.forEach(annotation => {
    const {
      mean,
      stdDev,
      max,
      area,
      unit,
      areaUnit
    } = annotation;
    if (!mean || !unit || !max || !area) {
      return;
    }
    columns.push(`Maximum`, `Mean`, `Std Dev`, 'Pixel Unit', `Area`, 'Unit');
    values.push(max, mean, stdDev, unit, area, areaUnit);
  });
  if (FrameOfReferenceUID) {
    columns.push('FrameOfReferenceUID');
    values.push(FrameOfReferenceUID);
  }
  if (points) {
    columns.push('points');
    // points has the form of [[x1, y1, z1], [x2, y2, z2], ...]
    // convert it to string of [[x1 y1 z1];[x2 y2 z2];...]
    // so that it can be used in the csv report
    values.push(points.map(p => p.join(' ')).join(';'));
  }
  return {
    columns,
    values
  };
}
function RectangleROI_getDisplayText(mappedAnnotations, displaySet, customizationService) {
  const displayText = {
    primary: [],
    secondary: []
  };
  if (!mappedAnnotations || !mappedAnnotations.length) {
    return displayText;
  }

  // Area is the same for all series
  const {
    area,
    SOPInstanceUID,
    frameNumber,
    areaUnit
  } = mappedAnnotations[0];
  const instance = displaySet.instances.find(image => image.SOPInstanceUID === SOPInstanceUID);
  let InstanceNumber;
  if (instance) {
    InstanceNumber = instance.InstanceNumber;
  }
  const instanceText = InstanceNumber ? ` I: ${InstanceNumber}` : '';
  const frameText = displaySet.isMultiFrame ? ` F: ${frameNumber}` : '';

  // Area sometimes becomes undefined if `preventHandleOutsideImage` is off.
  const roundedArea = src.utils.roundNumber(area || 0, 2);
  displayText.primary.push(`${roundedArea} ${utils_getDisplayUnit(areaUnit)}`);

  // Todo: we need a better UI for displaying all these information
  mappedAnnotations.forEach(mappedAnnotation => {
    const {
      unit,
      max,
      SeriesNumber
    } = mappedAnnotation;
    if (Number.isFinite(max)) {
      const maxStr = getStatisticDisplayString(max, unit, 'max');
      displayText.primary.push(maxStr);
    }
    displayText.secondary.push(`S: ${SeriesNumber}${instanceText}${frameText}`);
  });
  return displayText;
}
/* harmony default export */ const measurementServiceMappings_RectangleROI = (RectangleROI);
;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/SplineROI.ts






/**
 * Represents a mapping utility for Spline ROI measurements.
 */
const SplineROI = {
  toAnnotation: measurement => {
    // Implementation for converting measurement to annotation
  },
  /**
   * Maps cornerstone annotation event data to measurement service format.
   *
   * @param {Object} csToolsEventDetail - Cornerstone event data
   * @param {DisplaySetService} displaySetService - Service for managing display sets
   * @param {CornerstoneViewportService} CornerstoneViewportService - Service for managing viewports
   * @param {Function} getValueTypeFromToolType - Function to get value type from tool type
   * @param {CustomizationService} customizationService - Service for customization
   * @returns {Measurement | null} Measurement instance or null if invalid
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
    const isLocked = getIsLocked(annotationUID);
    const isVisible = getIsVisible(annotationUID);
    if (!metadata || !data) {
      console.warn('SplineROI tool: Missing metadata or data');
      return null;
    }
    const {
      toolName,
      referencedImageId,
      FrameOfReferenceUID
    } = metadata;
    const validToolType = constants_supportedTools.includes(toolName);
    if (!validToolType) {
      throw new Error(`Tool ${toolName} not supported`);
    }
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      frameNumber,
      StudyInstanceUID
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    let displaySet;
    if (SOPInstanceUID) {
      displaySet = displaySetService.getDisplaySetForSOPInstanceUID(SOPInstanceUID, SeriesInstanceUID);
    } else {
      displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
    }
    const mappedAnnotations = SplineROI_getMappedAnnotations(annotation, displaySetService);
    const displayText = SplineROI_getDisplayText(mappedAnnotations, displaySet);
    return {
      uid: annotationUID,
      SOPInstanceUID,
      FrameOfReferenceUID,
      points: data.contour.polyline,
      textBox: data.handles.textBox,
      metadata,
      frameNumber,
      referenceSeriesUID: SeriesInstanceUID,
      referenceStudyUID: StudyInstanceUID,
      referencedImageId,
      toolName: metadata.toolName,
      displaySetInstanceUID: displaySet.displaySetInstanceUID,
      label: data.label,
      displayText: displayText,
      data: data.cachedStats,
      type: getValueTypeFromToolType(toolName),
      getReport: () => SplineROI_getColumnValueReport(annotation, customizationService),
      isLocked,
      isVisible
    };
  }
};

/**
 * Maps annotations to a structured format with relevant attributes.
 *
 * @param {Object} annotation - The annotation object.
 * @param {DisplaySetService} displaySetService - Service for managing display sets.
 * @returns {Array} Mapped annotations.
 */
function SplineROI_getMappedAnnotations(annotation, displaySetService) {
  const {
    metadata,
    data
  } = annotation;
  const {
    cachedStats
  } = data;
  const {
    referencedImageId
  } = metadata;
  const targets = Object.keys(cachedStats);
  if (!targets.length) {
    return [];
  }
  const annotations = [];
  Object.keys(cachedStats).forEach(targetId => {
    const targetStats = cachedStats[targetId];
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      frameNumber
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    const displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
    const {
      SeriesNumber
    } = displaySet;
    const {
      mean,
      stdDev,
      max,
      area,
      Modality,
      areaUnit,
      modalityUnit
    } = targetStats;
    annotations.push({
      SeriesInstanceUID,
      SOPInstanceUID,
      SeriesNumber,
      frameNumber,
      Modality,
      unit: modalityUnit,
      mean,
      stdDev,
      max,
      area,
      areaUnit
    });
  });
  return annotations;
}

/**
 * Converts the measurement data to a format suitable for report generation.
 *
 * @param {object} annotation - The annotation object.
 * @param {CustomizationService} customizationService - Service for customization.
 * @returns {object} Report's content.
 */
function SplineROI_getColumnValueReport(annotation, customizationService) {
  const {
    SplineROI
  } = customizationService.getCustomization('cornerstone.measurements');
  const {
    report
  } = SplineROI;
  const columns = [];
  const values = [];

  /** Add type */
  columns.push('AnnotationType');
  values.push('Cornerstone:SplineROI');

  /** Add cachedStats */
  const {
    metadata,
    data
  } = annotation;
  const stats = data.cachedStats[`imageId:${metadata.referencedImageId}`];
  report.forEach(({
    name,
    value
  }) => {
    columns.push(name);
    stats[value] ? values.push(stats[value]) : values.push('not available');
  });

  /** Add FOR */
  if (metadata.FrameOfReferenceUID) {
    columns.push('FrameOfReferenceUID');
    values.push(metadata.FrameOfReferenceUID);
  }

  /** Add points */
  if (data.contour.polyline) {
    columns.push('points');
    values.push(data.contour.polyline.map(p => p.join(' ')).join(';'));
  }
  return {
    columns,
    values
  };
}

/**
 * Retrieves the display text for an annotation in a display set.
 *
 * @param {Array} mappedAnnotations - The mapped annotations.
 * @param {Object} displaySet - The display set object.
 * @returns {Object} Display text with primary and secondary information.
 */
function SplineROI_getDisplayText(mappedAnnotations, displaySet) {
  const displayText = {
    primary: [],
    secondary: []
  };
  if (!mappedAnnotations || !mappedAnnotations.length) {
    return displayText;
  }

  // Area is the same for all series
  const {
    area,
    SOPInstanceUID,
    frameNumber,
    areaUnit
  } = mappedAnnotations[0];
  const instance = displaySet.instances.find(image => image.SOPInstanceUID === SOPInstanceUID);
  let InstanceNumber;
  if (instance) {
    InstanceNumber = instance.InstanceNumber;
  }
  const instanceText = InstanceNumber ? ` I: ${InstanceNumber}` : '';
  const frameText = displaySet.isMultiFrame ? ` F: ${frameNumber}` : '';
  const roundedArea = src.utils.roundNumber(area || 0, 2);
  displayText.primary.push(`${roundedArea} ${utils_getDisplayUnit(areaUnit)}`);

  // we don't have max yet for splines rois
  // mappedAnnotations.forEach(mappedAnnotation => {
  //   const { unit, max, SeriesNumber } = mappedAnnotation;

  //   const maxStr = getStatisticDisplayString(max, unit, 'max');

  //   displayText.primary.push(maxStr);
  //   displayText.secondary.push(`S: ${SeriesNumber}${instanceText}${frameText}`);
  // });

  return displayText;
}
/* harmony default export */ const measurementServiceMappings_SplineROI = (SplineROI);
;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/LivewireContour.ts






/**
 * Represents a mapping utility for Livewire measurements.
 */
const LivewireContour = {
  toAnnotation: measurement => {},
  /**
   * Maps cornerstone annotation event data to measurement service format.
   *
   * @param {Object} csToolsEventDetail Cornerstone event data
   * @param {DisplaySetService} DisplaySetService Service for managing display sets
   * @param {CornerstoneViewportService} CornerstoneViewportService Service for managing viewports
   * @param {Function} getValueTypeFromToolType Function to get value type from tool type
   * @returns {Measurement} Measurement instance
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
    const isLocked = getIsLocked(annotationUID);
    const isVisible = getIsVisible(annotationUID);
    if (!metadata || !data) {
      console.warn('Livewire tool: Missing metadata or data');
      return null;
    }
    const {
      toolName,
      referencedImageId,
      FrameOfReferenceUID
    } = metadata;
    const validToolType = constants_supportedTools.includes(toolName);
    if (!validToolType) {
      throw new Error(`Tool ${toolName} not supported`);
    }
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      frameNumber,
      StudyInstanceUID
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    let displaySet;
    if (SOPInstanceUID) {
      displaySet = displaySetService.getDisplaySetForSOPInstanceUID(SOPInstanceUID, SeriesInstanceUID);
    } else {
      displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID);
    }
    return {
      uid: annotationUID,
      SOPInstanceUID,
      FrameOfReferenceUID,
      points: data.contour.polyline,
      textBox: data.handles.textBox,
      metadata,
      frameNumber,
      referenceSeriesUID: SeriesInstanceUID,
      referencedImageId,
      referenceStudyUID: StudyInstanceUID,
      toolName: metadata.toolName,
      displaySetInstanceUID: displaySet.displaySetInstanceUID,
      label: data.label,
      isLocked,
      isVisible,
      displayText: LivewireContour_getDisplayText(annotation, displaySet, displaySetService),
      data: data.cachedStats,
      type: getValueTypeFromToolType(toolName),
      getReport: () => LivewireContour_getColumnValueReport(annotation, customizationService)
    };
  }
};

/**
 * This function is used to convert the measurement data to a
 * format that is suitable for report generation (e.g. for the csv report).
 * The report returns a list of columns and corresponding values.
 *
 * @param {object} annotation
 * @returns {object} Report's content from this tool
 */
function LivewireContour_getColumnValueReport(annotation, customizationService) {
  const columns = [];
  const values = [];

  /** Add type */
  columns.push('AnnotationType');
  values.push('Cornerstone:Livewire');

  /** Add cachedStats */
  const {
    metadata,
    data
  } = annotation;

  /** Add FOR */
  if (metadata.FrameOfReferenceUID) {
    columns.push('FrameOfReferenceUID');
    values.push(metadata.FrameOfReferenceUID);
  }

  /** Add points */
  if (data.contour.polyline) {
    /**
     * Points has the form of [[x1, y1, z1], [x2, y2, z2], ...]
     * convert it to string of [[x1 y1 z1];[x2 y2 z2];...]
     * so that it can be used in the CSV report
     */
    columns.push('points');
    values.push(data.contour.polyline.map(p => p.join(' ')).join(';'));
  }
  return {
    columns,
    values
  };
}

/**
 * Retrieves the display text for an annotation in a display set.
 *
 * @param {Object} annotation - The annotation object.
 * @param {Object} displaySet - The display set object.
 * @returns {object} - An object with primary and secondary text arrays.
 */
function LivewireContour_getDisplayText(annotation, displaySet, displaySetService) {
  const {
    metadata,
    data
  } = annotation;
  const displayText = {
    primary: [],
    secondary: []
  };
  if (!data.cachedStats || !data.cachedStats[`imageId:${metadata.referencedImageId}`]) {
    return displayText;
  }
  const {
    area,
    areaUnit
  } = data.cachedStats[`imageId:${metadata.referencedImageId}`];
  const {
    SOPInstanceUID,
    frameNumber
  } = getSOPInstanceAttributes(metadata.referencedImageId, displaySetService, annotation);
  const instance = displaySet.instances.find(image => image.SOPInstanceUID === SOPInstanceUID);
  let InstanceNumber;
  if (instance) {
    InstanceNumber = instance.InstanceNumber;
  }
  const instanceText = InstanceNumber ? ` I: ${InstanceNumber}` : '';
  const frameText = displaySet.isMultiFrame ? ` F: ${frameNumber}` : '';
  const {
    SeriesNumber
  } = displaySet;
  let seriesText = null;
  if (SeriesNumber !== undefined) {
    seriesText = `S: ${SeriesNumber}${instanceText}${frameText}`;
  }
  if (area) {
    const roundedArea = src.utils.roundNumber(area || 0, 2);
    displayText.primary.push(`${roundedArea} ${utils_getDisplayUnit(areaUnit)}`);
  }
  if (seriesText) {
    displayText.secondary.push(seriesText);
  }
  return displayText;
}
/* harmony default export */ const measurementServiceMappings_LivewireContour = (LivewireContour);
;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/Probe.ts






const Probe = {
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
    const isLocked = getIsLocked(annotationUID);
    const isVisible = getIsVisible(annotationUID);
    if (!metadata || !data) {
      console.warn('Probe tool: Missing metadata or data');
      return null;
    }
    const {
      toolName,
      referencedImageId,
      FrameOfReferenceUID
    } = metadata;
    const validToolType = constants_supportedTools.includes(toolName);
    if (!validToolType) {
      throw new Error('Tool not supported');
    }
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      StudyInstanceUID
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    let displaySet;
    if (SOPInstanceUID) {
      displaySet = displaySetService.getDisplaySetForSOPInstanceUID(SOPInstanceUID, SeriesInstanceUID);
    } else {
      displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
    }
    const {
      points
    } = data.handles;
    const mappedAnnotations = Probe_getMappedAnnotations(annotation, displaySetService);
    const displayText = Probe_getDisplayText(mappedAnnotations, displaySet, customizationService);
    const getReport = () => Probe_getReport(mappedAnnotations, points, FrameOfReferenceUID, customizationService);
    return {
      uid: annotationUID,
      SOPInstanceUID,
      FrameOfReferenceUID,
      points,
      metadata,
      isLocked,
      isVisible,
      referenceSeriesUID: SeriesInstanceUID,
      referenceStudyUID: StudyInstanceUID,
      referencedImageId,
      frameNumber: mappedAnnotations?.[0]?.frameNumber || 1,
      toolName: metadata.toolName,
      displaySetInstanceUID: displaySet.displaySetInstanceUID,
      label: data.label,
      displayText: displayText,
      data: data.cachedStats,
      type: getValueTypeFromToolType(toolName),
      getReport
    };
  }
};
function Probe_getMappedAnnotations(annotation, displaySetService) {
  const {
    metadata,
    data
  } = annotation;
  const {
    cachedStats
  } = data;
  const {
    referencedImageId
  } = metadata;
  const targets = Object.keys(cachedStats);
  if (!targets.length) {
    return;
  }
  const annotations = [];
  Object.keys(cachedStats).forEach(targetId => {
    const targetStats = cachedStats[targetId];
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      frameNumber
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    const displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
    const {
      SeriesNumber
    } = displaySet;
    const {
      value
    } = targetStats;
    const unit = 'HU';
    annotations.push({
      SeriesInstanceUID,
      SOPInstanceUID,
      SeriesNumber,
      frameNumber,
      unit,
      value
    });
  });
  return annotations;
}

/*
This function is used to convert the measurement data to a format that is
suitable for the report generation (e.g. for the csv report). The report
returns a list of columns and corresponding values.
*/
function Probe_getReport(mappedAnnotations, points, FrameOfReferenceUID, customizationService) {
  const columns = [];
  const values = [];

  // Add Type
  columns.push('AnnotationType');
  values.push('Cornerstone:Probe');
  mappedAnnotations.forEach(annotation => {
    const {
      value,
      unit
    } = annotation;
    columns.push(`Probe (${unit})`);
    values.push(value);
  });
  if (FrameOfReferenceUID) {
    columns.push('FrameOfReferenceUID');
    values.push(FrameOfReferenceUID);
  }
  if (points) {
    columns.push('points');
    values.push(points.map(p => p.join(' ')).join(';'));
  }
  return {
    columns,
    values
  };
}
function Probe_getDisplayText(mappedAnnotations, displaySet, customizationService) {
  const displayText = {
    primary: [],
    secondary: []
  };
  if (!mappedAnnotations || !mappedAnnotations.length) {
    return displayText;
  }
  const {
    value,
    unit,
    SeriesNumber,
    SOPInstanceUID,
    frameNumber
  } = mappedAnnotations[0];
  const instance = displaySet.instances.find(image => image.SOPInstanceUID === SOPInstanceUID);
  let InstanceNumber;
  if (instance) {
    InstanceNumber = instance.InstanceNumber;
  }
  const instanceText = InstanceNumber ? ` I: ${InstanceNumber}` : '';
  const frameText = displaySet.isMultiFrame ? ` F: ${frameNumber}` : '';
  if (value !== undefined) {
    const roundedValue = src.utils.roundNumber(value, 2);
    displayText.primary.push(`${roundedValue} ${utils_getDisplayUnit(unit)}`);
    displayText.secondary.push(`S: ${SeriesNumber}${instanceText}${frameText}`);
  }
  return displayText;
}
/* harmony default export */ const measurementServiceMappings_Probe = (Probe);
;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/UltrasoundDirectional.ts





const UltrasoundDirectional = {
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
    const isLocked = getIsLocked(annotationUID);
    const isVisible = getIsVisible(annotationUID);
    if (!metadata || !data) {
      console.warn('Length tool: Missing metadata or data');
      return null;
    }
    const {
      toolName,
      referencedImageId,
      FrameOfReferenceUID
    } = metadata;
    const validToolType = constants_supportedTools.includes(toolName);
    if (!validToolType) {
      throw new Error('Tool not supported');
    }
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      StudyInstanceUID
    } = getSOPInstanceAttributes(referencedImageId);
    let displaySet;
    if (SOPInstanceUID) {
      displaySet = displaySetService.getDisplaySetForSOPInstanceUID(SOPInstanceUID, SeriesInstanceUID);
    } else {
      displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID);
    }
    const {
      points
    } = data.handles;
    const mappedAnnotations = UltrasoundDirectional_getMappedAnnotations(annotation, displaySetService);
    const displayText = UltrasoundDirectional_getDisplayText(mappedAnnotations, displaySet, customizationService);
    const getReport = () => UltrasoundDirectional_getReport(mappedAnnotations, points, FrameOfReferenceUID, customizationService);
    return {
      uid: annotationUID,
      SOPInstanceUID,
      FrameOfReferenceUID,
      points,
      metadata,
      referenceSeriesUID: SeriesInstanceUID,
      referenceStudyUID: StudyInstanceUID,
      frameNumber: mappedAnnotations?.[0]?.frameNumber || 1,
      toolName: metadata.toolName,
      displaySetInstanceUID: displaySet.displaySetInstanceUID,
      label: data.label,
      displayText: displayText,
      data: data.cachedStats,
      type: getValueTypeFromToolType(toolName),
      getReport,
      isLocked,
      isVisible
    };
  }
};
function UltrasoundDirectional_getMappedAnnotations(annotation, DisplaySetService) {
  const {
    metadata,
    data
  } = annotation;
  const {
    cachedStats
  } = data;
  const {
    referencedImageId
  } = metadata;
  const targets = Object.keys(cachedStats);
  if (!targets.length) {
    return;
  }
  const annotations = [];
  Object.keys(cachedStats).forEach(targetId => {
    const targetStats = cachedStats[targetId];
    if (!referencedImageId) {
      throw new Error('Non-acquisition plane measurement mapping not supported');
    }
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      frameNumber
    } = getSOPInstanceAttributes(referencedImageId);
    const displaySet = DisplaySetService.getDisplaySetForSOPInstanceUID(SOPInstanceUID, SeriesInstanceUID, frameNumber);
    const {
      SeriesNumber
    } = displaySet;
    const {
      xValues,
      yValues,
      units,
      isUnitless,
      isHorizontal
    } = targetStats;
    annotations.push({
      SeriesInstanceUID,
      SOPInstanceUID,
      SeriesNumber,
      frameNumber,
      xValues,
      yValues,
      units,
      isUnitless,
      isHorizontal
    });
  });
  return annotations;
}

/*
This function is used to convert the measurement data to a format that is
suitable for the report generation (e.g. for the csv report). The report
returns a list of columns and corresponding values.
*/
function UltrasoundDirectional_getReport(mappedAnnotations, points, FrameOfReferenceUID, customizationService) {
  const columns = [];
  const values = [];

  // Add Type
  columns.push('AnnotationType');
  values.push('Cornerstone:UltrasoundDirectional');
  mappedAnnotations.forEach(annotation => {
    const {
      xValues,
      yValues,
      units,
      isUnitless
    } = annotation;
    if (isUnitless) {
      columns.push('Length' + units[0]);
      values.push(src.utils.roundNumber(xValues[0], 2));
    } else {
      const dist1 = Math.abs(xValues[1] - xValues[0]);
      const dist2 = Math.abs(yValues[1] - yValues[0]);
      columns.push('Time' + units[0]);
      values.push(src.utils.roundNumber(dist1, 2));
      columns.push('Length' + units[1]);
      values.push(src.utils.roundNumber(dist2, 2));
    }
  });
  if (FrameOfReferenceUID) {
    columns.push('FrameOfReferenceUID');
    values.push(FrameOfReferenceUID);
  }
  if (points) {
    columns.push('points');
    values.push(points.map(p => p.join(' ')).join(';'));
  }
  return {
    columns,
    values
  };
}
function UltrasoundDirectional_getDisplayText(mappedAnnotations, displaySet, customizationService) {
  const displayText = {
    primary: [],
    secondary: []
  };
  if (!mappedAnnotations || !mappedAnnotations.length) {
    return displayText;
  }
  const {
    xValues,
    yValues,
    units,
    isUnitless,
    SeriesNumber,
    SOPInstanceUID,
    frameNumber
  } = mappedAnnotations[0];
  const instance = displaySet.instances.find(image => image.SOPInstanceUID === SOPInstanceUID);
  let InstanceNumber;
  if (instance) {
    InstanceNumber = instance.InstanceNumber;
  }
  const instanceText = InstanceNumber ? ` I: ${InstanceNumber}` : '';
  const frameText = displaySet.isMultiFrame ? ` F: ${frameNumber}` : '';
  const seriesText = `S: ${SeriesNumber}${instanceText}${frameText}`;
  if (xValues === undefined || yValues === undefined) {
    return displayText;
  }
  if (isUnitless) {
    displayText.primary.push(`${src.utils.roundNumber(xValues[0], 2)} ${units[0]}`);
  } else {
    const dist1 = Math.abs(xValues[1] - xValues[0]);
    const dist2 = Math.abs(yValues[1] - yValues[0]);
    displayText.primary.push(`${src.utils.roundNumber(dist1)} ${units[0]}`);
    displayText.primary.push(`${src.utils.roundNumber(dist2)} ${units[1]}`);
  }
  displayText.secondary.push(seriesText);
  return displayText;
}
/* harmony default export */ const measurementServiceMappings_UltrasoundDirectional = (UltrasoundDirectional);
;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/SegmentBidirectional.ts






const SegmentBidirectional = {
  toAnnotation: measurement => {},
  toMeasurement: (csToolsEventDetail, displaySetService, cornerstoneViewportService, getValueTypeFromToolType, customizationService) => {
    const {
      annotation
    } = csToolsEventDetail;
    const {
      metadata,
      data,
      annotationUID
    } = annotation;
    const isLocked = getIsLocked(annotationUID);
    const isVisible = getIsVisible(annotationUID);
    if (!metadata || !data) {
      console.debug('SegmentBidirectional tool: Missing metadata or data');
      return null;
    }
    const {
      toolName,
      referencedImageId,
      FrameOfReferenceUID
    } = metadata;
    const validToolType = constants_supportedTools.includes(toolName);
    if (!validToolType) {
      throw new Error('Tool not supported');
    }
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      StudyInstanceUID
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    let displaySet;
    if (SOPInstanceUID) {
      displaySet = displaySetService.getDisplaySetForSOPInstanceUID(SOPInstanceUID, SeriesInstanceUID);
    } else {
      displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
    }
    const {
      points,
      textBox
    } = data.handles;
    const mappedAnnotations = SegmentBidirectional_getMappedAnnotations(annotation, displaySetService);
    const displayText = SegmentBidirectional_getDisplayText(mappedAnnotations, displaySet);
    const getReport = () => SegmentBidirectional_getReport(mappedAnnotations, points, FrameOfReferenceUID, customizationService);
    return {
      uid: annotationUID,
      SOPInstanceUID,
      FrameOfReferenceUID,
      points,
      textBox,
      isLocked,
      isVisible,
      metadata,
      referenceSeriesUID: SeriesInstanceUID,
      referenceStudyUID: StudyInstanceUID,
      referencedImageId,
      frameNumber: mappedAnnotations[0]?.frameNumber || 1,
      toolName: metadata.toolName,
      displaySetInstanceUID: displaySet.displaySetInstanceUID,
      label: data.label,
      displayText: displayText,
      data: data.cachedStats,
      type: getValueTypeFromToolType(toolName),
      getReport
    };
  }
};
function SegmentBidirectional_getMappedAnnotations(annotation, displaySetService) {
  const {
    metadata,
    data
  } = annotation;
  const {
    cachedStats
  } = data;
  const {
    referencedImageId
  } = metadata;
  const targets = Object.keys(cachedStats);
  if (!targets.length) {
    return [];
  }
  const annotations = [];
  Object.keys(cachedStats).forEach(targetId => {
    const targetStats = cachedStats[targetId];
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      frameNumber
    } = getSOPInstanceAttributes(referencedImageId, displaySetService, annotation);
    const displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];
    const {
      SeriesNumber
    } = displaySet;
    const {
      length,
      width,
      unit
    } = targetStats;
    annotations.push({
      SeriesInstanceUID,
      SOPInstanceUID,
      SeriesNumber,
      frameNumber,
      unit,
      length,
      width
    });
  });
  return annotations;
}
function SegmentBidirectional_getReport(mappedAnnotations, points, FrameOfReferenceUID, customizationService) {
  const columns = [];
  const values = [];

  // Add Type
  columns.push('AnnotationType');
  values.push('Cornerstone:SegmentBidirectional');
  mappedAnnotations.forEach(annotation => {
    const {
      length,
      width,
      unit
    } = annotation;
    columns.push(`Length`, `Width`, 'Unit');
    values.push(length, width, unit);
  });
  if (FrameOfReferenceUID) {
    columns.push('FrameOfReferenceUID');
    values.push(FrameOfReferenceUID);
  }
  if (points) {
    columns.push('points');
    values.push(points.map(p => p.join(' ')).join(';'));
  }
  return {
    columns,
    values
  };
}
function SegmentBidirectional_getDisplayText(mappedAnnotations, displaySet) {
  const displayText = {
    primary: [],
    secondary: []
  };
  if (!mappedAnnotations || !mappedAnnotations.length) {
    return displayText;
  }

  // Area is the same for all series
  const {
    length,
    width,
    unit,
    SeriesNumber,
    SOPInstanceUID,
    frameNumber
  } = mappedAnnotations[0];
  const roundedLength = src.utils.roundNumber(length, 2);
  const roundedWidth = src.utils.roundNumber(width, 2);
  const instance = displaySet.instances.find(image => image.SOPInstanceUID === SOPInstanceUID);
  let InstanceNumber;
  if (instance) {
    InstanceNumber = instance.InstanceNumber;
  }
  const instanceText = InstanceNumber ? ` I: ${InstanceNumber}` : '';
  const frameText = displaySet.isMultiFrame ? ` F: ${frameNumber}` : '';
  displayText.primary.push(`L: ${roundedLength} ${utils_getDisplayUnit(unit)}`);
  displayText.primary.push(`W: ${roundedWidth} ${utils_getDisplayUnit(unit)}`);
  displayText.secondary.push(`S: ${SeriesNumber}${instanceText}${frameText}`);
  return displayText;
}
/* harmony default export */ const measurementServiceMappings_SegmentBidirectional = (SegmentBidirectional);
;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/UltrasoundPleuraBLine.ts




const UltrasoundPleuraBLine = {
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
    const isLocked = getIsLocked(annotationUID);
    const isVisible = getIsVisible(annotationUID);
    if (!metadata || !data) {
      console.warn('UltrasoundPleuraBLine tool: Missing metadata or data');
      return null;
    }
    const {
      toolName,
      referencedImageId,
      FrameOfReferenceUID
    } = metadata;
    const validToolType = constants_supportedTools.includes(toolName);
    if (!validToolType) {
      throw new Error('Tool not supported');
    }
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      StudyInstanceUID
    } = getSOPInstanceAttributes(referencedImageId);
    let displaySet;
    if (SOPInstanceUID) {
      displaySet = displaySetService.getDisplaySetForSOPInstanceUID(SOPInstanceUID, SeriesInstanceUID);
    } else {
      displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID);
    }
    const {
      points
    } = data.handles;
    const mappedAnnotations = UltrasoundPleuraBLine_getMappedAnnotations(annotation, displaySetService);
    const displayText = UltrasoundPleuraBLine_getDisplayText(mappedAnnotations, displaySet, customizationService);
    const getReport = () => UltrasoundPleuraBLine_getReport(mappedAnnotations, points, FrameOfReferenceUID, customizationService);
    return {
      uid: annotationUID,
      SOPInstanceUID,
      FrameOfReferenceUID,
      points,
      metadata,
      referenceSeriesUID: SeriesInstanceUID,
      referenceStudyUID: StudyInstanceUID,
      frameNumber: mappedAnnotations?.[0]?.frameNumber || 1,
      toolName: metadata.toolName,
      displaySetInstanceUID: displaySet.displaySetInstanceUID,
      label: data.label,
      displayText: displayText,
      data: data.cachedStats,
      type: getValueTypeFromToolType(toolName),
      getReport,
      isLocked,
      isVisible
    };
  }
};
function UltrasoundPleuraBLine_getMappedAnnotations(annotation, DisplaySetService) {
  const {
    metadata
  } = annotation;
  const {
    annotationType
  } = annotation.data;
  const {
    referencedImageId
  } = metadata;
  const annotations = [];
  if (!referencedImageId) {
    throw new Error('Non-acquisition plane measurement mapping not supported');
  }
  const {
    SOPInstanceUID,
    SeriesInstanceUID,
    frameNumber
  } = getSOPInstanceAttributes(referencedImageId);
  const displaySet = DisplaySetService.getDisplaySetForSOPInstanceUID(SOPInstanceUID, SeriesInstanceUID, frameNumber);
  const {
    SeriesNumber
  } = displaySet;
  annotations.push({
    SeriesInstanceUID,
    SOPInstanceUID,
    SeriesNumber,
    frameNumber,
    annotationType
  });
  return annotations;
}

/*
This function is used to convert the measurement data to a format that is
suitable for the report generation (e.g. for the csv report). The report
returns a list of columns and corresponding values.
*/
function UltrasoundPleuraBLine_getReport(mappedAnnotations, points, FrameOfReferenceUID, customizationService) {
  const columns = [];
  const values = [];

  // Add Type
  columns.push('AnnotationType');
  values.push('Cornerstone:UltrasoundPleuraBLine');
  mappedAnnotations.forEach(annotation => {
    const {
      annotationType
    } = annotation;
    columns.push('AnnotationType');
    values.push(annotationType);
  });
  if (FrameOfReferenceUID) {
    columns.push('FrameOfReferenceUID');
    values.push(FrameOfReferenceUID);
  }
  if (points) {
    columns.push('points');
    values.push(points.map(p => p.join(' ')).join(';'));
  }
  return {
    columns,
    values
  };
}
function UltrasoundPleuraBLine_getDisplayText(mappedAnnotations, displaySet, customizationService) {
  const displayText = {
    primary: [],
    secondary: []
  };
  if (!mappedAnnotations || !mappedAnnotations.length) {
    return displayText;
  }
  const {
    annotationType,
    SeriesNumber,
    SOPInstanceUID,
    frameNumber
  } = mappedAnnotations[0];
  const instance = displaySet.instances.find(image => image.SOPInstanceUID === SOPInstanceUID);
  let InstanceNumber;
  if (instance) {
    InstanceNumber = instance.InstanceNumber;
  }
  const instanceText = InstanceNumber ? ` I: ${InstanceNumber}` : '';
  const frameText = displaySet.isMultiFrame ? ` F: ${frameNumber}` : '';
  const seriesText = `S: ${SeriesNumber}${instanceText}${frameText}`;
  displayText.primary.push(`Annotation : ${annotationType}`);
  displayText.secondary.push(seriesText);
  return displayText;
}
/* harmony default export */ const measurementServiceMappings_UltrasoundPleuraBLine = (UltrasoundPleuraBLine);
;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/measurementServiceMappingsFactory.ts
















const measurementServiceMappingsFactory = (measurementService, displaySetService, cornerstoneViewportService, customizationService) => {
  /**
   * Maps measurement service format object to cornerstone annotation object.
   *
   * @param measurement The measurement instance
   * @param definition The source definition
   * @return Cornerstone annotation data
   */

  const _getValueTypeFromToolType = toolType => {
    const {
      POLYLINE,
      ELLIPSE,
      CIRCLE,
      RECTANGLE,
      BIDIRECTIONAL,
      POINT,
      ANGLE
    } = src.MeasurementService.VALUE_TYPES;

    // TODO -> I get why this was attempted, but its not nearly flexible enough.
    // A single measurement may have an ellipse + a bidirectional measurement, for instances.
    // You can't define a bidirectional tool as a single type..
    const TOOL_TYPE_TO_VALUE_TYPE = {
      Length: POLYLINE,
      EllipticalROI: ELLIPSE,
      CircleROI: CIRCLE,
      RectangleROI: RECTANGLE,
      PlanarFreehandROI: POLYLINE,
      Bidirectional: BIDIRECTIONAL,
      ArrowAnnotate: POINT,
      CobbAngle: ANGLE,
      Angle: ANGLE,
      SplineROI: POLYLINE,
      LivewireContour: POLYLINE,
      Probe: POINT,
      UltrasoundDirectional: POLYLINE,
      SegmentBidirectional: BIDIRECTIONAL
    };
    return TOOL_TYPE_TO_VALUE_TYPE[toolType];
  };
  const factories = {
    Length: {
      toAnnotation: measurementServiceMappings_Length.toAnnotation,
      toMeasurement: csToolsAnnotation => measurementServiceMappings_Length.toMeasurement(csToolsAnnotation, displaySetService, cornerstoneViewportService, _getValueTypeFromToolType, customizationService),
      matchingCriteria: [{
        valueType: src.MeasurementService.VALUE_TYPES.POLYLINE,
        points: 2
      }]
    },
    Bidirectional: {
      toAnnotation: measurementServiceMappings_Bidirectional.toAnnotation,
      toMeasurement: csToolsAnnotation => measurementServiceMappings_Bidirectional.toMeasurement(csToolsAnnotation, displaySetService, cornerstoneViewportService, _getValueTypeFromToolType, customizationService),
      matchingCriteria: [
      // TODO -> We should eventually do something like shortAxis + longAxis,
      // But its still a little unclear how these automatic interpretations will work.
      {
        valueType: src.MeasurementService.VALUE_TYPES.POLYLINE,
        points: 2
      }, {
        valueType: src.MeasurementService.VALUE_TYPES.POLYLINE,
        points: 2
      }]
    },
    SegmentBidirectional: {
      toAnnotation: measurementServiceMappings_SegmentBidirectional.toAnnotation,
      toMeasurement: csToolsAnnotation => measurementServiceMappings_SegmentBidirectional.toMeasurement(csToolsAnnotation, displaySetService, cornerstoneViewportService, _getValueTypeFromToolType, customizationService),
      matchingCriteria: [{
        valueType: src.MeasurementService.VALUE_TYPES.POLYLINE,
        points: 2
      }, {
        valueType: src.MeasurementService.VALUE_TYPES.POLYLINE,
        points: 2
      }]
    },
    EllipticalROI: {
      toAnnotation: measurementServiceMappings_EllipticalROI.toAnnotation,
      toMeasurement: csToolsAnnotation => measurementServiceMappings_EllipticalROI.toMeasurement(csToolsAnnotation, displaySetService, cornerstoneViewportService, _getValueTypeFromToolType, customizationService),
      matchingCriteria: [{
        valueType: src.MeasurementService.VALUE_TYPES.ELLIPSE
      }]
    },
    CircleROI: {
      toAnnotation: measurementServiceMappings_CircleROI.toAnnotation,
      toMeasurement: csToolsAnnotation => measurementServiceMappings_CircleROI.toMeasurement(csToolsAnnotation, displaySetService, cornerstoneViewportService, _getValueTypeFromToolType, customizationService),
      matchingCriteria: [{
        valueType: src.MeasurementService.VALUE_TYPES.CIRCLE
      }]
    },
    RectangleROI: {
      toAnnotation: measurementServiceMappings_RectangleROI.toAnnotation,
      toMeasurement: csToolsAnnotation => measurementServiceMappings_RectangleROI.toMeasurement(csToolsAnnotation, displaySetService, cornerstoneViewportService, _getValueTypeFromToolType, customizationService),
      matchingCriteria: [{
        valueType: src.MeasurementService.VALUE_TYPES.POLYLINE
      }]
    },
    PlanarFreehandROI: {
      toAnnotation: measurementServiceMappings_PlanarFreehandROI.toAnnotation,
      toMeasurement: csToolsAnnotation => measurementServiceMappings_PlanarFreehandROI.toMeasurement(csToolsAnnotation, displaySetService, cornerstoneViewportService, _getValueTypeFromToolType, customizationService),
      matchingCriteria: [{
        valueType: src.MeasurementService.VALUE_TYPES.POLYLINE
      }]
    },
    SplineROI: {
      toAnnotation: measurementServiceMappings_SplineROI.toAnnotation,
      toMeasurement: csToolsAnnotation => measurementServiceMappings_SplineROI.toMeasurement(csToolsAnnotation, displaySetService, cornerstoneViewportService, _getValueTypeFromToolType, customizationService),
      matchingCriteria: [{
        valueType: src.MeasurementService.VALUE_TYPES.POLYLINE
      }]
    },
    LivewireContour: {
      toAnnotation: measurementServiceMappings_LivewireContour.toAnnotation,
      toMeasurement: csToolsAnnotation => measurementServiceMappings_LivewireContour.toMeasurement(csToolsAnnotation, displaySetService, cornerstoneViewportService, _getValueTypeFromToolType, customizationService),
      matchingCriteria: [{
        valueType: src.MeasurementService.VALUE_TYPES.POLYLINE
      }]
    },
    ArrowAnnotate: {
      toAnnotation: measurementServiceMappings_ArrowAnnotate.toAnnotation,
      toMeasurement: csToolsAnnotation => measurementServiceMappings_ArrowAnnotate.toMeasurement(csToolsAnnotation, displaySetService, cornerstoneViewportService, _getValueTypeFromToolType, customizationService),
      matchingCriteria: [{
        valueType: src.MeasurementService.VALUE_TYPES.POINT,
        points: 1
      }]
    },
    Probe: {
      toAnnotation: measurementServiceMappings_Probe.toAnnotation,
      toMeasurement: csToolsAnnotation => measurementServiceMappings_Probe.toMeasurement(csToolsAnnotation, displaySetService, cornerstoneViewportService, _getValueTypeFromToolType, customizationService),
      matchingCriteria: [{
        valueType: src.MeasurementService.VALUE_TYPES.POINT,
        points: 1
      }]
    },
    CobbAngle: {
      toAnnotation: measurementServiceMappings_CobbAngle.toAnnotation,
      toMeasurement: csToolsAnnotation => measurementServiceMappings_CobbAngle.toMeasurement(csToolsAnnotation, displaySetService, cornerstoneViewportService, _getValueTypeFromToolType, customizationService),
      matchingCriteria: [{
        valueType: src.MeasurementService.VALUE_TYPES.ANGLE
      }]
    },
    Angle: {
      toAnnotation: measurementServiceMappings_Angle.toAnnotation,
      toMeasurement: csToolsAnnotation => measurementServiceMappings_Angle.toMeasurement(csToolsAnnotation, displaySetService, cornerstoneViewportService, _getValueTypeFromToolType, customizationService),
      matchingCriteria: [{
        valueType: src.MeasurementService.VALUE_TYPES.ANGLE
      }]
    },
    UltrasoundDirectional: {
      toAnnotation: measurementServiceMappings_UltrasoundDirectional.toAnnotation,
      toMeasurement: csToolsAnnotation => measurementServiceMappings_UltrasoundDirectional.toMeasurement(csToolsAnnotation, displaySetService, cornerstoneViewportService, _getValueTypeFromToolType, customizationService),
      matchingCriteria: [{
        valueType: src.MeasurementService.VALUE_TYPES.POLYLINE,
        points: 2
      }]
    },
    UltrasoundPleuraBLine: {
      toAnnotation: measurementServiceMappings_UltrasoundPleuraBLine.toAnnotation,
      toMeasurement: csToolsAnnotation => measurementServiceMappings_UltrasoundPleuraBLine.toMeasurement(csToolsAnnotation, displaySetService, cornerstoneViewportService, _getValueTypeFromToolType, customizationService),
      matchingCriteria: [{
        valueType: src.MeasurementService.VALUE_TYPES.POLYLINE,
        points: 2
      }]
    }
  };
  return factories;
};
/* harmony default export */ const measurementServiceMappings_measurementServiceMappingsFactory = (measurementServiceMappingsFactory);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/index.js
var utilities = __webpack_require__(53860);
;// ../../../extensions/cornerstone/src/initMeasurementService.ts










const {
  /* CORNERSTONE_3D_TOOLS_SOURCE_NAME */ "rM": initMeasurementService_CORNERSTONE_3D_TOOLS_SOURCE_NAME,
  /* CORNERSTONE_3D_TOOLS_SOURCE_VERSION */ "yK": initMeasurementService_CORNERSTONE_3D_TOOLS_SOURCE_VERSION
} = enums_namespaceObject;
const {
  removeAnnotation
} = dist_esm.annotation.state;
const csToolsEvents = dist_esm.Enums.Events;
const initMeasurementService = (measurementService, displaySetService, cornerstoneViewportService, customizationService) => {
  /* Initialization */
  const {
    Length,
    Bidirectional,
    EllipticalROI,
    CircleROI,
    ArrowAnnotate,
    Angle,
    CobbAngle,
    RectangleROI,
    PlanarFreehandROI,
    SplineROI,
    LivewireContour,
    Probe,
    UltrasoundDirectional,
    UltrasoundPleuraBLine,
    SegmentBidirectional
  } = measurementServiceMappings_measurementServiceMappingsFactory(measurementService, displaySetService, cornerstoneViewportService, customizationService);
  const csTools3DVer1MeasurementSource = measurementService.createSource(initMeasurementService_CORNERSTONE_3D_TOOLS_SOURCE_NAME, initMeasurementService_CORNERSTONE_3D_TOOLS_SOURCE_VERSION);

  /* Mappings */
  measurementService.addMapping(csTools3DVer1MeasurementSource, 'Length', Length.matchingCriteria, Length.toAnnotation, Length.toMeasurement);
  measurementService.addMapping(csTools3DVer1MeasurementSource, 'Crosshairs', Length.matchingCriteria, () => {
    return null;
  }, () => {
    return null;
  });
  measurementService.addMapping(csTools3DVer1MeasurementSource, 'Bidirectional', Bidirectional.matchingCriteria, Bidirectional.toAnnotation, Bidirectional.toMeasurement);
  measurementService.addMapping(csTools3DVer1MeasurementSource, 'EllipticalROI', EllipticalROI.matchingCriteria, EllipticalROI.toAnnotation, EllipticalROI.toMeasurement);
  measurementService.addMapping(csTools3DVer1MeasurementSource, 'CircleROI', CircleROI.matchingCriteria, CircleROI.toAnnotation, CircleROI.toMeasurement);
  measurementService.addMapping(csTools3DVer1MeasurementSource, 'ArrowAnnotate', ArrowAnnotate.matchingCriteria, ArrowAnnotate.toAnnotation, ArrowAnnotate.toMeasurement);
  measurementService.addMapping(csTools3DVer1MeasurementSource, 'CobbAngle', CobbAngle.matchingCriteria, CobbAngle.toAnnotation, CobbAngle.toMeasurement);
  measurementService.addMapping(csTools3DVer1MeasurementSource, 'Angle', Angle.matchingCriteria, Angle.toAnnotation, Angle.toMeasurement);
  measurementService.addMapping(csTools3DVer1MeasurementSource, 'RectangleROI', RectangleROI.matchingCriteria, RectangleROI.toAnnotation, RectangleROI.toMeasurement);
  measurementService.addMapping(csTools3DVer1MeasurementSource, 'PlanarFreehandROI', PlanarFreehandROI.matchingCriteria, PlanarFreehandROI.toAnnotation, PlanarFreehandROI.toMeasurement);
  measurementService.addMapping(csTools3DVer1MeasurementSource, 'SplineROI', SplineROI.matchingCriteria, SplineROI.toAnnotation, SplineROI.toMeasurement);

  // On the UI side, the Calibration Line tool will work almost the same as the
  // Length tool
  measurementService.addMapping(csTools3DVer1MeasurementSource, 'CalibrationLine', Length.matchingCriteria, Length.toAnnotation, Length.toMeasurement);
  measurementService.addMapping(csTools3DVer1MeasurementSource, 'LivewireContour', LivewireContour.matchingCriteria, LivewireContour.toAnnotation, LivewireContour.toMeasurement);
  measurementService.addMapping(csTools3DVer1MeasurementSource, 'Probe', Probe.matchingCriteria, Probe.toAnnotation, Probe.toMeasurement);
  measurementService.addMapping(csTools3DVer1MeasurementSource, 'UltrasoundDirectionalTool', UltrasoundDirectional.matchingCriteria, UltrasoundDirectional.toAnnotation, UltrasoundDirectional.toMeasurement);
  measurementService.addMapping(csTools3DVer1MeasurementSource, 'UltrasoundPleuraBLineTool', UltrasoundPleuraBLine.matchingCriteria, UltrasoundPleuraBLine.toAnnotation, UltrasoundPleuraBLine.toMeasurement);
  measurementService.addMapping(csTools3DVer1MeasurementSource, 'SegmentBidirectional', SegmentBidirectional.matchingCriteria, SegmentBidirectional.toAnnotation, SegmentBidirectional.toMeasurement);
  return csTools3DVer1MeasurementSource;
};
const connectToolsToMeasurementService = ({
  commandsManager,
  servicesManager,
  extensionManager
}) => {
  const {
    measurementService,
    displaySetService,
    cornerstoneViewportService,
    customizationService
  } = servicesManager.services;
  const csTools3DVer1MeasurementSource = initMeasurementService(measurementService, displaySetService, cornerstoneViewportService, customizationService);
  connectMeasurementServiceToTools({
    servicesManager,
    commandsManager,
    extensionManager
  });
  const {
    annotationToMeasurement,
    remove
  } = csTools3DVer1MeasurementSource;

  //
  function addMeasurement(csToolsEvent) {
    try {
      const annotationAddedEventDetail = csToolsEvent.detail;
      const {
        annotation: {
          metadata,
          annotationUID
        }
      } = annotationAddedEventDetail;
      const {
        toolName
      } = metadata;
      if (csToolsEvent.type === completedEvt && toolName === toolNames.CalibrationLine) {
        // show modal to input the measurement (mm)
        onCompletedCalibrationLine(servicesManager, csToolsEvent).then(() => {
          console.log('Calibration applied.');
        }, () => true).finally(() => {
          // we don't need the calibration line lingering around, remove the
          // annotation from the display
          removeAnnotation(annotationUID);
          removeMeasurement(csToolsEvent);
          // this will ensure redrawing of annotations
          cornerstoneViewportService.resize();
        });
      } else {
        // To force the measurementUID be the same as the annotationUID
        // Todo: this should be changed when a measurement can include multiple annotations
        // in the future
        annotationAddedEventDetail.uid = annotationUID;
        annotationToMeasurement(toolName, annotationAddedEventDetail);
      }
    } catch (error) {
      console.warn('Failed to add measurement:', error);
    }
  }
  function updateMeasurement(csToolsEvent) {
    try {
      const annotationModifiedEventDetail = csToolsEvent.detail;
      const {
        annotation: {
          metadata,
          annotationUID
        }
      } = annotationModifiedEventDetail;

      // If the measurement hasn't been added, don't modify it
      const measurement = measurementService.getMeasurement(annotationUID);
      if (!measurement) {
        return;
      }
      const {
        toolName
      } = metadata;
      annotationModifiedEventDetail.uid = annotationUID;
      // Passing true to indicate this is an update and NOT a annotation (start) completion.
      annotationToMeasurement(toolName, annotationModifiedEventDetail, true);
    } catch (error) {
      console.warn('Failed to update measurement:', error);
    }
  }
  function selectMeasurement(csToolsEvent) {
    try {
      const annotationSelectionEventDetail = csToolsEvent.detail;
      const {
        added: addedSelectedAnnotationUIDs,
        removed: removedSelectedAnnotationUIDs
      } = annotationSelectionEventDetail;
      if (removedSelectedAnnotationUIDs) {
        removedSelectedAnnotationUIDs.forEach(annotationUID => measurementService.setMeasurementSelected(annotationUID, false));
      }
      if (addedSelectedAnnotationUIDs) {
        addedSelectedAnnotationUIDs.forEach(annotationUID => measurementService.setMeasurementSelected(annotationUID, true));
      }
    } catch (error) {
      console.warn('Failed to select/unselect measurements:', error);
    }
  }

  /**
   * When csTools fires a removed event, remove the same measurement
   * from the measurement service
   *
   * @param {*} csToolsEvent
   */
  function removeMeasurement(csToolsEvent) {
    try {
      const annotationRemovedEventDetail = csToolsEvent.detail;
      const {
        annotation: {
          annotationUID
        }
      } = annotationRemovedEventDetail;
      const measurement = measurementService.getMeasurement(annotationUID);
      if (measurement) {
        remove(annotationUID, annotationRemovedEventDetail);
      }
    } catch (error) {
      console.warn('Failed to remove measurement:', error);
    }
  }

  // on display sets added, check if there are any measurements in measurement service that need to be
  // put into cornerstone tools
  const addedEvt = csToolsEvents.ANNOTATION_ADDED;
  const completedEvt = csToolsEvents.ANNOTATION_COMPLETED;
  const updatedEvt = csToolsEvents.ANNOTATION_MODIFIED;
  const removedEvt = csToolsEvents.ANNOTATION_REMOVED;
  const selectionEvt = csToolsEvents.ANNOTATION_SELECTION_CHANGE;
  esm.eventTarget.addEventListener(addedEvt, addMeasurement);
  esm.eventTarget.addEventListener(completedEvt, addMeasurement);
  esm.eventTarget.addEventListener(updatedEvt, updateMeasurement);
  esm.eventTarget.addEventListener(removedEvt, removeMeasurement);
  esm.eventTarget.addEventListener(selectionEvt, selectMeasurement);
  return csTools3DVer1MeasurementSource;
};
const connectMeasurementServiceToTools = ({
  servicesManager,
  commandsManager,
  extensionManager
}) => {
  const {
    measurementService,
    cornerstoneViewportService,
    viewportGridService
  } = servicesManager.services;
  const {
    MEASUREMENT_REMOVED,
    MEASUREMENTS_CLEARED,
    MEASUREMENT_UPDATED,
    RAW_MEASUREMENT_ADDED
  } = measurementService.EVENTS;
  measurementService.subscribe(MEASUREMENTS_CLEARED, ({
    measurements
  }) => {
    if (!Object.keys(measurements).length) {
      return;
    }
    commandsManager.run('startRecordingForAnnotationGroup');
    for (const measurement of Object.values(measurements)) {
      const {
        uid,
        source
      } = measurement;
      if (source.name !== initMeasurementService_CORNERSTONE_3D_TOOLS_SOURCE_NAME) {
        continue;
      }
      const removedAnnotation = dist_esm.annotation.state.getAnnotation(uid);
      removeAnnotation(uid);
      commandsManager.run('triggerCreateAnnotationMemo', {
        annotation: removedAnnotation,
        FrameOfReferenceUID: removedAnnotation.metadata.FrameOfReferenceUID,
        options: {
          deleting: true
        }
      });
    }
    commandsManager.run('endRecordingForAnnotationGroup');

    // trigger a render
    cornerstoneViewportService.getRenderingEngine().render();
  });
  measurementService.subscribe(MEASUREMENT_UPDATED, ({
    source,
    measurement,
    notYetUpdatedAtSource
  }) => {
    if (!source) {
      return;
    }
    if (source.name !== initMeasurementService_CORNERSTONE_3D_TOOLS_SOURCE_NAME) {
      return;
    }
    if (notYetUpdatedAtSource === false) {
      // This event was fired by cornerstone telling the measurement service to sync.
      // Already in sync.
      return;
    }
    const {
      uid,
      label,
      isLocked,
      isVisible
    } = measurement;
    const sourceAnnotation = dist_esm.annotation.state.getAnnotation(uid);
    const {
      data,
      metadata
    } = sourceAnnotation;
    if (!data) {
      return;
    }
    if (data.label !== label) {
      const element = getActiveViewportEnabledElement(viewportGridService)?.viewport.element;
      (0,utilities.setAnnotationLabel)(sourceAnnotation, element, label);
    }

    // update the isLocked state
    dist_esm.annotation.locking.setAnnotationLocked(uid, isLocked);

    // update the isVisible state
    dist_esm.annotation.visibility.setAnnotationVisibility(uid, isVisible);

    // annotation.config.style.setAnnotationStyles(uid, {
    //   color: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
    // });

    // I don't like this but will fix later
    const renderingEngine = cornerstoneViewportService.getRenderingEngine();
    // Note: We could do a better job by triggering the render on the
    // viewport itself, but the removeAnnotation does not include that info...
    const viewportIds = renderingEngine.getViewports().map(viewport => viewport.id);
    (0,utilities.triggerAnnotationRenderForViewportIds)(viewportIds);
  });
  measurementService.subscribe(RAW_MEASUREMENT_ADDED, ({
    source,
    measurement,
    data,
    dataSource
  }) => {
    if (source.name !== initMeasurementService_CORNERSTONE_3D_TOOLS_SOURCE_NAME) {
      return;
    }
    const {
      referenceSeriesUID,
      referenceStudyUID,
      SOPInstanceUID,
      metadata
    } = measurement;
    const instance = src.DicomMetadataStore.getInstance(referenceStudyUID, referenceSeriesUID, SOPInstanceUID);
    let imageId;
    let frameNumber = 1;
    if (measurement?.metadata?.referencedImageId) {
      imageId = measurement.metadata.referencedImageId;
      frameNumber = getSOPInstanceAttributes(measurement.metadata.referencedImageId).frameNumber;
    } else {
      imageId = dataSource.getImageIdsForInstance({
        instance
      });
    }

    /**
     * This annotation is used by the cornerstone viewport.
     * This is not the read-only annotation rendered by the SR viewport.
     */
    const annotationManager = dist_esm.annotation.state.getAnnotationManager();
    const newAnnotation = {
      annotationUID: measurement.uid,
      highlighted: false,
      isLocked: false,
      // This is used to force a re-render of the annotation to
      // re-calculate cached stats since sometimes in SR we
      // get empty cached stats
      invalidated: true,
      metadata: {
        ...metadata,
        toolName: measurement.toolName,
        FrameOfReferenceUID: measurement.FrameOfReferenceUID,
        referencedImageId: imageId
      },
      data: {
        /**
         * Don't remove this destructuring of data here.
         * This is used to pass annotation specific data forward e.g. contour
         */
        ...(data.annotation.data || {}),
        text: data.annotation.data.text,
        handles: {
          ...data.annotation.data.handles
        },
        cachedStats: {
          ...data.annotation.data.cachedStats
        },
        label: data.annotation.data.label,
        frameNumber
      }
    };
    annotationManager.addAnnotation(newAnnotation);
    commandsManager.run('triggerCreateAnnotationMemo', {
      annotation: newAnnotation,
      FrameOfReferenceUID: newAnnotation.metadata.FrameOfReferenceUID,
      options: {
        newAnnotation: true
      }
    });
  });
  measurementService.subscribe(MEASUREMENT_REMOVED, ({
    source,
    measurement: removedMeasurementId
  }) => {
    if (source?.name && source.name !== initMeasurementService_CORNERSTONE_3D_TOOLS_SOURCE_NAME) {
      return;
    }
    const removedAnnotation = dist_esm.annotation.state.getAnnotation(removedMeasurementId);
    removeAnnotation(removedMeasurementId);
    commandsManager.run('triggerCreateAnnotationMemo', {
      annotation: removedAnnotation,
      FrameOfReferenceUID: removedAnnotation.metadata.FrameOfReferenceUID,
      options: {
        deleting: true
      }
    });
    const renderingEngine = cornerstoneViewportService.getRenderingEngine();
    // Note: We could do a better job by triggering the render on the
    // viewport itself, but the removeAnnotation does not include that info...
    renderingEngine.render();
  });
};

;// ../../../extensions/cornerstone/src/initCineService.ts


function _getVolumeFromViewport(viewport) {
  const volumeIds = viewport.getAllVolumeIds();
  const volumes = volumeIds.map(id => esm.cache.getVolume(id));
  const dynamicVolume = volumes.find(volume => volume.isDynamicVolume());
  return dynamicVolume ?? volumes[0];
}

/**
 * Return all viewports that needs to be synchronized with the source
 * viewport passed as parameter when cine is updated.
 * @param servicesManager ServiceManager
 * @param srcViewportIndex Source viewport index
 * @returns array with viewport information.
 */
function _getSyncedViewports(servicesManager, srcViewportId) {
  const {
    viewportGridService,
    cornerstoneViewportService
  } = servicesManager.services;
  const {
    viewports: viewportsStates
  } = viewportGridService.getState();
  const srcViewportState = viewportsStates.get(srcViewportId);
  if (srcViewportState?.viewportOptions?.viewportType !== 'volume') {
    return [];
  }
  const srcViewport = cornerstoneViewportService.getCornerstoneViewport(srcViewportId);
  const srcVolume = srcViewport ? _getVolumeFromViewport(srcViewport) : null;
  if (!srcVolume?.isDynamicVolume()) {
    return [];
  }
  const {
    volumeId: srcVolumeId
  } = srcVolume;
  return Array.from(viewportsStates.values()).filter(({
    viewportId
  }) => {
    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
    return viewportId !== srcViewportId && viewport?.hasVolumeId?.(srcVolumeId);
  }).map(({
    viewportId
  }) => ({
    viewportId
  }));
}
function initCineService(servicesManager) {
  const {
    cineService
  } = servicesManager.services;
  const getSyncedViewports = viewportId => {
    return _getSyncedViewports(servicesManager, viewportId);
  };
  const playClip = (element, playClipOptions) => {
    return dist_esm.utilities.cine.playClip(element, playClipOptions);
  };
  const stopClip = (element, stopClipOptions) => {
    return dist_esm.utilities.cine.stopClip(element, stopClipOptions);
  };
  cineService.setServiceImplementation({
    getSyncedViewports,
    playClip,
    stopClip
  });
}
/* harmony default export */ const src_initCineService = (initCineService);
;// ../../../extensions/cornerstone/src/initStudyPrefetcherService.ts

function initStudyPrefetcherService(servicesManager) {
  const {
    studyPrefetcherService
  } = servicesManager.services;
  studyPrefetcherService.requestType = esm.Enums.RequestType.Prefetch;
  studyPrefetcherService.imageLoadPoolManager = esm.imageLoadPoolManager;
  studyPrefetcherService.imageLoader = esm.imageLoader;
  studyPrefetcherService.cache = {
    isImageCached(imageId) {
      return !!esm.cache.getImageLoadObject(imageId);
    }
  };
  studyPrefetcherService.imageLoadEventsManager = {
    addEventListeners(onImageLoaded, onImageLoadFailed) {
      esm.eventTarget.addEventListener(esm.EVENTS.IMAGE_LOADED, onImageLoaded);
      esm.eventTarget.addEventListener(esm.EVENTS.IMAGE_LOAD_FAILED, onImageLoadFailed);
      return [{
        unsubscribe: () => esm.eventTarget.removeEventListener(esm.EVENTS.IMAGE_LOADED, onImageLoaded)
      }, {
        unsubscribe: () => esm.eventTarget.removeEventListener(esm.EVENTS.IMAGE_LOAD_FAILED, onImageLoadFailed)
      }];
    }
  };
}
/* harmony default export */ const src_initStudyPrefetcherService = (initStudyPrefetcherService);
;// ../../../extensions/cornerstone/src/utils/getInterleavedFrames.js
function getInterleavedFrames(imageIds) {
  const minImageIdIndex = 0;
  const maxImageIdIndex = imageIds.length - 1;
  const middleImageIdIndex = Math.floor(imageIds.length / 2);
  let lowerImageIdIndex = middleImageIdIndex;
  let upperImageIdIndex = middleImageIdIndex;

  // Build up an array of images to prefetch, starting with the current image.
  const imageIdsToPrefetch = [{
    imageId: imageIds[middleImageIdIndex],
    imageIdIndex: middleImageIdIndex
  }];
  const prefetchQueuedFilled = {
    currentPositionDownToMinimum: false,
    currentPositionUpToMaximum: false
  };

  // Check if on edges and some criteria is already fulfilled

  if (middleImageIdIndex === minImageIdIndex) {
    prefetchQueuedFilled.currentPositionDownToMinimum = true;
  } else if (middleImageIdIndex === maxImageIdIndex) {
    prefetchQueuedFilled.currentPositionUpToMaximum = true;
  }
  while (!prefetchQueuedFilled.currentPositionDownToMinimum || !prefetchQueuedFilled.currentPositionUpToMaximum) {
    if (!prefetchQueuedFilled.currentPositionDownToMinimum) {
      // Add imageId below
      lowerImageIdIndex--;
      imageIdsToPrefetch.push({
        imageId: imageIds[lowerImageIdIndex],
        imageIdIndex: lowerImageIdIndex
      });
      if (lowerImageIdIndex === minImageIdIndex) {
        prefetchQueuedFilled.currentPositionDownToMinimum = true;
      }
    }
    if (!prefetchQueuedFilled.currentPositionUpToMaximum) {
      // Add imageId above
      upperImageIdIndex++;
      imageIdsToPrefetch.push({
        imageId: imageIds[upperImageIdIndex],
        imageIdIndex: upperImageIdIndex
      });
      if (upperImageIdIndex === maxImageIdIndex) {
        prefetchQueuedFilled.currentPositionUpToMaximum = true;
      }
    }
  }
  return imageIdsToPrefetch;
}
// EXTERNAL MODULE: ../../../node_modules/lodash.zip/index.js
var lodash_zip = __webpack_require__(19863);
var lodash_zip_default = /*#__PURE__*/__webpack_require__.n(lodash_zip);
// EXTERNAL MODULE: ../../../node_modules/lodash.compact/index.js
var lodash_compact = __webpack_require__(15257);
var lodash_compact_default = /*#__PURE__*/__webpack_require__.n(lodash_compact);
// EXTERNAL MODULE: ../../../node_modules/lodash.flatten/index.js
var lodash_flatten = __webpack_require__(6446);
var lodash_flatten_default = /*#__PURE__*/__webpack_require__.n(lodash_flatten);
;// ../../../extensions/cornerstone/src/utils/interleaveCenterLoader.ts






// Map of volumeId and SeriesInstanceId
const volumeIdMapsToLoad = new Map();
const viewportIdVolumeInputArrayMap = new Map();

/**
 * This function caches the volumeUIDs until all the volumes inside the
 * hanging protocol are initialized. Then it goes through the imageIds
 * of the volumes, and interleave them, in order for the volumes to be loaded
 * together from middle to the start and the end.
 * @param {Object} props image loading properties from Cornerstone ViewportService
 * @returns
 */
function interleaveCenterLoader({
  data: {
    viewportId,
    volumeInputArray
  },
  displaySetsMatchDetails,
  viewportMatchDetails: matchDetails
}) {
  viewportIdVolumeInputArrayMap.set(viewportId, volumeInputArray);

  // Based on the volumeInputs store the volumeIds and SeriesInstanceIds
  // to keep track of the volumes being loaded
  for (const volumeInput of volumeInputArray) {
    const {
      volumeId
    } = volumeInput;
    const volume = esm.cache.getVolume(volumeId);
    if (!volume) {
      return;
    }

    // if the volumeUID is not in the volumeUIDs array, add it
    if (!volumeIdMapsToLoad.has(volumeId)) {
      const {
        metadata
      } = volume;
      volumeIdMapsToLoad.set(volumeId, metadata.SeriesInstanceUID);
    }
  }

  /**
   * The following is checking if all the viewports that were matched in the HP has been
   * successfully created their cornerstone viewport or not. Todo: This can be
   * improved by not checking it, and as soon as the matched DisplaySets have their
   * volume loaded, we start the loading, but that comes at the cost of viewports
   * not being created yet (e.g., in a 10 viewport ptCT fusion, when one ct viewport and one
   * pt viewport are created we have a guarantee that the volumes are created in the cache
   * but the rest of the viewports (fusion, mip etc.) are not created yet. So
   * we can't initiate setting the volumes for those viewports. One solution can be
   * to add an event when a viewport is created (not enabled element event) and then
   * listen to it and as the other viewports are created we can set the volumes for them
   * since volumes are already started loading.
   */
  const uniqueViewportVolumeDisplaySetUIDs = new Set();
  viewportIdVolumeInputArrayMap.forEach((volumeInputArray, viewportId) => {
    volumeInputArray.forEach(volumeInput => {
      const {
        volumeId
      } = volumeInput;
      uniqueViewportVolumeDisplaySetUIDs.add(volumeId);
    });
  });
  const uniqueMatchedDisplaySetUIDs = new Set();
  matchDetails.forEach(matchDetail => {
    const {
      displaySetsInfo
    } = matchDetail;
    displaySetsInfo.forEach(({
      displaySetInstanceUID
    }) => {
      uniqueMatchedDisplaySetUIDs.add(displaySetInstanceUID);
    });
  });
  if (uniqueViewportVolumeDisplaySetUIDs.size !== uniqueMatchedDisplaySetUIDs.size) {
    return;
  }
  const volumeIds = Array.from(volumeIdMapsToLoad.keys()).slice();
  // get volumes from cache
  const volumes = volumeIds.map(volumeId => {
    return esm.cache.getVolume(volumeId);
  });

  // iterate over all volumes, and get their imageIds, and interleave
  // the imageIds and save them in AllRequests for later use
  const AllRequests = [];
  volumes.forEach(volume => {
    const requests = volume.getImageLoadRequests();
    if (!requests.length || !requests[0] || !requests[0].imageId) {
      return;
    }
    const requestImageIds = requests.map(request => {
      return request.imageId;
    });
    const imageIds = getInterleavedFrames(requestImageIds);
    const reOrderedRequests = imageIds.map(({
      imageId
    }) => {
      const request = requests.find(req => req.imageId === imageId);
      return request;
    });
    AllRequests.push(reOrderedRequests);
  });

  // flatten the AllRequests array, which will result in a list of all the
  // imageIds for all the volumes but interleaved
  const interleavedRequests = lodash_compact_default()(lodash_flatten_default()(lodash_zip_default()(...AllRequests)));

  // set the finalRequests to the imageLoadPoolManager
  const finalRequests = [];
  interleavedRequests.forEach(request => {
    const {
      imageId
    } = request;
    AllRequests.forEach(volumeRequests => {
      const volumeImageIdRequest = volumeRequests.find(req => req.imageId === imageId);
      if (volumeImageIdRequest) {
        finalRequests.push(volumeImageIdRequest);
      }
    });
  });
  const requestType = esm.Enums.RequestType.Prefetch;
  const priority = 0;
  finalRequests.forEach(({
    callLoadImage,
    additionalDetails,
    imageId,
    imageIdIndex,
    options
  }) => {
    const callLoadImageBound = callLoadImage.bind(null, imageId, imageIdIndex, options);
    esm.imageLoadPoolManager.addRequest(callLoadImageBound, requestType, additionalDetails, priority);
  });

  // clear the volumeIdMapsToLoad
  volumeIdMapsToLoad.clear();

  // copy the viewportIdVolumeInputArrayMap
  const viewportIdVolumeInputArrayMapCopy = new Map(viewportIdVolumeInputArrayMap);

  // reset the viewportIdVolumeInputArrayMap
  viewportIdVolumeInputArrayMap.clear();
  return viewportIdVolumeInputArrayMapCopy;
}
;// ../../../extensions/cornerstone/src/utils/getNthFrames.js
/**
 * Returns a re-ordered array consisting of, in order:
 *    1. First few objects
 *    2. Center objects
 *    3. Last few objects
 *    4. nth Objects (n=7), set 2
 *    5. nth Objects set 5,
 *    6. Remaining objects
 * What this does is return the first/center/start objects, as those
 * are often used first, then a selection of objects scattered over the
 * instances in order to allow making requests over a set of image instances.
 *
 * @param {[]} imageIds
 * @returns [] reordered to be an nth selection
 */
function getNthFrames(imageIds) {
  const frames = [[], [], [], [], []];
  const centerStart = imageIds.length / 2 - 3;
  const centerEnd = centerStart + 6;
  for (let i = 0; i < imageIds.length; i++) {
    if (i < 2 || i > imageIds.length - 4 || i > centerStart && i < centerEnd) {
      frames[0].push(imageIds[i]);
    } else if (i % 7 === 2) {
      frames[1].push(imageIds[i]);
    } else if (i % 7 === 5) {
      frames[2].push(imageIds[i]);
    } else {
      frames[i % 2 + 3].push(imageIds[i]);
    }
  }
  const ret = [...frames[0], ...frames[1], ...frames[2], ...frames[3], ...frames[4]];
  return ret;
}
;// ../../../extensions/cornerstone/src/utils/interleave.js
/**
 * Interleave the items from all the lists so that the first items are first
 * in the returned list, the second items are next etc.
 * Does this in a O(n) fashion, and return lists[0] if there is only one list.
 *
 * @param {[]} lists
 * @returns [] reordered to be breadth first traversal of lists
 */
function interleave(lists) {
  if (!lists || !lists.length) {
    return [];
  }
  if (lists.length === 1) {
    return lists[0];
  }
  console.time('interleave');
  const useLists = [...lists];
  const ret = [];
  for (let i = 0; useLists.length > 0; i++) {
    for (const list of useLists) {
      if (i >= list.length) {
        useLists.splice(useLists.indexOf(list), 1);
        continue;
      }
      ret.push(list[i]);
    }
  }
  console.timeEnd('interleave');
  return ret;
}
;// ../../../extensions/cornerstone/src/utils/nthLoader.ts




// Map of volumeId and SeriesInstanceId
const nthLoader_volumeIdMapsToLoad = new Map();
const nthLoader_viewportIdVolumeInputArrayMap = new Map();

/**
 * This function caches the volumeUIDs until all the volumes inside the
 * hanging protocol are initialized. Then it goes through the requests and
 * chooses a sub-selection starting the the first few objects, center objects
 * and last objects, and then the remaining nth images until all instances are
 * retrieved.  This causes the image to have a progressive load order and looks
 * visually much better.
 * @param {Object} props image loading properties from Cornerstone ViewportService
 */
function interleaveNthLoader({
  data: {
    viewportId,
    volumeInputArray
  },
  displaySetsMatchDetails
}) {
  nthLoader_viewportIdVolumeInputArrayMap.set(viewportId, volumeInputArray);

  // Based on the volumeInputs store the volumeIds and SeriesInstanceIds
  // to keep track of the volumes being loaded
  for (const volumeInput of volumeInputArray) {
    const {
      volumeId
    } = volumeInput;
    const volume = esm.cache.getVolume(volumeId);
    if (!volume) {
      console.log("interleaveNthLoader::No volume, can't load it");
      return;
    }

    // if the volumeUID is not in the volumeUIDs array, add it
    if (!nthLoader_volumeIdMapsToLoad.has(volumeId)) {
      const {
        metadata
      } = volume;
      nthLoader_volumeIdMapsToLoad.set(volumeId, metadata.SeriesInstanceUID);
    }
  }
  const volumeIds = Array.from(nthLoader_volumeIdMapsToLoad.keys()).slice();
  // get volumes from cache
  const volumes = volumeIds.map(volumeId => {
    return esm.cache.getVolume(volumeId);
  });

  // iterate over all volumes, and get their imageIds, and interleave
  // the imageIds and save them in AllRequests for later use
  const originalRequests = volumes.map(volume => volume.getImageLoadRequests?.() ?? []).filter(requests => requests?.[0]?.imageId);
  const orderedRequests = originalRequests.map(request => getNthFrames(request));

  // set the finalRequests to the imageLoadPoolManager
  const finalRequests = interleave(orderedRequests);
  const requestType = esm.Enums.RequestType.Prefetch;
  const priority = 0;
  finalRequests.forEach(({
    callLoadImage,
    additionalDetails,
    imageId,
    imageIdIndex,
    options
  }) => {
    const callLoadImageBound = callLoadImage.bind(null, imageId, imageIdIndex, options);
    esm.imageLoadPoolManager.addRequest(callLoadImageBound, requestType, additionalDetails, priority);
  });

  // clear the volumeIdMapsToLoad
  nthLoader_volumeIdMapsToLoad.clear();

  // copy the viewportIdVolumeInputArrayMap
  const viewportIdVolumeInputArrayMapCopy = new Map(nthLoader_viewportIdVolumeInputArrayMap);

  // reset the viewportIdVolumeInputArrayMap
  nthLoader_viewportIdVolumeInputArrayMap.clear();
  return viewportIdVolumeInputArrayMapCopy;
}
;// ../../../extensions/cornerstone/src/utils/interleaveTopToBottom.ts





// Map of volumeId and SeriesInstanceId
const interleaveTopToBottom_volumeIdMapsToLoad = new Map();
const interleaveTopToBottom_viewportIdVolumeInputArrayMap = new Map();

/**
 * This function caches the volumeIds until all the volumes inside the
 * hanging protocol are initialized. Then it goes through the imageIds
 * of the volumes, and interleave them, in order for the volumes to be loaded
 * together from middle to the start and the end.
 * @param {Object} {viewportData, displaySetMatchDetails}
 * @returns
 */
function interleaveTopToBottom({
  data: {
    viewportId,
    volumeInputArray
  },
  displaySetsMatchDetails,
  viewportMatchDetails: matchDetails
}) {
  interleaveTopToBottom_viewportIdVolumeInputArrayMap.set(viewportId, volumeInputArray);

  // Based on the volumeInputs store the volumeIds and SeriesInstanceIds
  // to keep track of the volumes being loaded
  for (const volumeInput of volumeInputArray) {
    const {
      volumeId
    } = volumeInput;
    const volume = esm.cache.getVolume(volumeId);
    if (!volume) {
      return;
    }

    // if the volumeUID is not in the volumeUIDs array, add it
    if (!interleaveTopToBottom_volumeIdMapsToLoad.has(volumeId)) {
      const {
        metadata
      } = volume;
      interleaveTopToBottom_volumeIdMapsToLoad.set(volumeId, metadata.SeriesInstanceUID);
    }
  }
  const filteredMatchDetails = [];
  const displaySetsToLoad = new Set();

  // Check all viewports that have a displaySet to be loaded. In some cases
  // (eg: line chart viewports which is not a Cornerstone viewport) the
  // displaySet is created on the client and there are no instances to be
  // downloaded. For those viewports the displaySet may have the `skipLoading`
  // option set to true otherwise it may block the download of all other
  // instances resulting in blank viewports.
  Array.from(matchDetails.values()).forEach(curMatchDetails => {
    const {
      displaySetsInfo
    } = curMatchDetails;
    let numDisplaySetsToLoad = 0;
    displaySetsInfo.forEach(({
      displaySetInstanceUID,
      displaySetOptions
    }) => {
      if (!displaySetOptions?.options?.skipLoading) {
        numDisplaySetsToLoad++;
        displaySetsToLoad.add(displaySetInstanceUID);
      }
    });
    if (numDisplaySetsToLoad) {
      filteredMatchDetails.push(curMatchDetails);
    }
  });

  /**
   * The following is checking if all the viewports that were matched in the HP has been
   * successfully created their cornerstone viewport or not. Todo: This can be
   * improved by not checking it, and as soon as the matched DisplaySets have their
   * volume loaded, we start the loading, but that comes at the cost of viewports
   * not being created yet (e.g., in a 10 viewport ptCT fusion, when one ct viewport and one
   * pt viewport are created we have a guarantee that the volumes are created in the cache
   * but the rest of the viewports (fusion, mip etc.) are not created yet. So
   * we can't initiate setting the volumes for those viewports. One solution can be
   * to add an event when a viewport is created (not enabled element event) and then
   * listen to it and as the other viewports are created we can set the volumes for them
   * since volumes are already started loading.
   */
  const uniqueViewportVolumeDisplaySetUIDs = new Set();
  interleaveTopToBottom_viewportIdVolumeInputArrayMap.forEach((volumeInputArray, viewportId) => {
    volumeInputArray.forEach(volumeInput => {
      const {
        volumeId
      } = volumeInput;
      uniqueViewportVolumeDisplaySetUIDs.add(volumeId);
    });
  });
  const uniqueMatchedDisplaySetUIDs = new Set();
  matchDetails.forEach(matchDetail => {
    const {
      displaySetsInfo
    } = matchDetail;
    displaySetsInfo.forEach(({
      displaySetInstanceUID
    }) => {
      uniqueMatchedDisplaySetUIDs.add(displaySetInstanceUID);
    });
  });
  if (uniqueViewportVolumeDisplaySetUIDs.size !== uniqueMatchedDisplaySetUIDs.size) {
    return;
  }
  const volumeIds = Array.from(interleaveTopToBottom_volumeIdMapsToLoad.keys()).slice();
  // get volumes from cache
  const volumes = volumeIds.map(volumeId => {
    return esm.cache.getVolume(volumeId);
  });

  // iterate over all volumes, and get their imageIds, and interleave
  // the imageIds and save them in AllRequests for later use
  const AllRequests = [];
  volumes.forEach(volume => {
    const requests = volume.getImageLoadRequests();
    if (!requests?.[0]?.imageId) {
      return;
    }

    // reverse the requests
    AllRequests.push(requests.reverse());
  });

  // flatten the AllRequests array, which will result in a list of all the
  // imageIds for all the volumes but interleaved
  const interleavedRequests = lodash_compact_default()(lodash_flatten_default()(lodash_zip_default()(...AllRequests)));

  // set the finalRequests to the imageLoadPoolManager
  const finalRequests = [];
  interleavedRequests.forEach(request => {
    const {
      imageId
    } = request;
    AllRequests.forEach(volumeRequests => {
      const volumeImageIdRequest = volumeRequests.find(req => req.imageId === imageId);
      if (volumeImageIdRequest) {
        finalRequests.push(volumeImageIdRequest);
      }
    });
  });
  const requestType = esm.Enums.RequestType.Prefetch;
  const priority = 0;
  finalRequests.forEach(({
    callLoadImage,
    additionalDetails,
    imageId,
    imageIdIndex,
    options
  }) => {
    const callLoadImageBound = callLoadImage.bind(null, imageId, imageIdIndex, options);
    esm.imageLoadPoolManager.addRequest(callLoadImageBound, requestType, additionalDetails, priority);
  });

  // clear the volumeIdMapsToLoad
  interleaveTopToBottom_volumeIdMapsToLoad.clear();

  // copy the viewportIdVolumeInputArrayMap
  const viewportIdVolumeInputArrayMapCopy = new Map(interleaveTopToBottom_viewportIdVolumeInputArrayMap);

  // reset the viewportIdVolumeInputArrayMap
  interleaveTopToBottom_viewportIdVolumeInputArrayMap.clear();
  return viewportIdVolumeInputArrayMapCopy;
}
;// ../../../extensions/cornerstone/src/utils/findNearbyToolData.ts
/**
 * Finds tool nearby event position triggered.
 *
 * @param {Object} commandsManager mannager of commands
 * @param {Object} event that has being triggered
 * @returns cs toolData or undefined if not found.
 */
const findNearbyToolData = (commandsManager, evt) => {
  if (!evt?.detail) {
    return;
  }
  const {
    element,
    currentPoints
  } = evt.detail;
  return commandsManager.runCommand('getNearbyAnnotation', {
    element,
    canvasCoordinates: currentPoints?.canvas
  }, 'CORNERSTONE');
};
;// ../../../extensions/cornerstone/src/initContextMenu.ts




const cs3DToolsEvents = dist_esm.Enums.Events;

/**
 * Generates a name, consisting of:
 *    * alt when the alt key is down
 *    * ctrl when the cctrl key is down
 *    * shift when the shift key is down
 *    * 'button' followed by the button number (1 left, 3 right etc)
 */
function getEventName(evt) {
  const button = evt.detail.event.which;
  const nameArr = [];
  if (evt.detail.event.altKey) {
    nameArr.push('alt');
  }
  if (evt.detail.event.ctrlKey) {
    nameArr.push('ctrl');
  }
  if (evt.detail.event.shiftKey) {
    nameArr.push('shift');
  }
  nameArr.push('button');
  nameArr.push(button);
  return nameArr.join('');
}
function initContextMenu({
  cornerstoneViewportService,
  customizationService,
  commandsManager
}) {
  /*
   * Run the commands associated with the given button press,
   * defaults on button1 and button2
   */
  const cornerstoneViewportHandleEvent = (name, evt) => {
    const customizations = customizationService.getCustomization('cornerstoneViewportClickCommands');
    const toRun = customizations[name];
    if (!toRun) {
      return;
    }

    // only find nearbyToolData if required, for the click (which closes the context menu
    // we don't need to find nearbyToolData)
    let nearbyToolData = null;
    if (toRun.some(command => command.commandOptions?.requireNearbyToolData)) {
      nearbyToolData = findNearbyToolData(commandsManager, evt);
    }
    const options = {
      nearbyToolData,
      event: evt
    };
    commandsManager.run(toRun, options);
  };
  const cornerstoneViewportHandleClick = evt => {
    const name = getEventName(evt);
    cornerstoneViewportHandleEvent(name, evt);
  };
  function elementEnabledHandler(evt) {
    const {
      viewportId,
      element
    } = evt.detail;
    const viewportInfo = cornerstoneViewportService.getViewportInfo(viewportId);
    if (!viewportInfo) {
      return;
    }
    // TODO check update upstream
    (0,state/* setEnabledElement */.ye)(viewportId, element);
    element.addEventListener(cs3DToolsEvents.MOUSE_CLICK, cornerstoneViewportHandleClick);
  }
  function elementDisabledHandler(evt) {
    const {
      element
    } = evt.detail;
    element.removeEventListener(cs3DToolsEvents.MOUSE_CLICK, cornerstoneViewportHandleClick);
  }
  esm.eventTarget.addEventListener(esm.EVENTS.ELEMENT_ENABLED, elementEnabledHandler.bind(null));
  esm.eventTarget.addEventListener(esm.EVENTS.ELEMENT_DISABLED, elementDisabledHandler.bind(null));
}
/* harmony default export */ const src_initContextMenu = (initContextMenu);
;// ../../../extensions/cornerstone/src/initDoubleClick.ts



const initDoubleClick_cs3DToolsEvents = dist_esm.Enums.Events;

/**
 * Generates a double click event name, consisting of:
 *    * alt when the alt key is down
 *    * ctrl when the cctrl key is down
 *    * shift when the shift key is down
 *    * 'doubleClick'
 */
function getDoubleClickEventName(evt) {
  const nameArr = [];
  if (evt.detail.event.altKey) {
    nameArr.push('alt');
  }
  if (evt.detail.event.ctrlKey) {
    nameArr.push('ctrl');
  }
  if (evt.detail.event.shiftKey) {
    nameArr.push('shift');
  }
  nameArr.push('doubleClick');
  return nameArr.join('');
}
function initDoubleClick({
  customizationService,
  commandsManager
}) {
  const cornerstoneViewportHandleDoubleClick = evt => {
    // Do not allow double click on a tool.
    const nearbyToolData = findNearbyToolData(commandsManager, evt);
    if (nearbyToolData) {
      return;
    }
    const eventName = getDoubleClickEventName(evt);

    // Allows for the customization of the double click on a viewport.
    const customizations = customizationService.getCustomization('cornerstoneViewportClickCommands');
    const toRun = customizations[eventName];
    if (!toRun) {
      return;
    }
    commandsManager.run(toRun);
  };
  function elementEnabledHandler(evt) {
    const {
      element
    } = evt.detail;
    element.addEventListener(initDoubleClick_cs3DToolsEvents.MOUSE_DOUBLE_CLICK, cornerstoneViewportHandleDoubleClick);
  }
  function elementDisabledHandler(evt) {
    const {
      element
    } = evt.detail;
    element.removeEventListener(initDoubleClick_cs3DToolsEvents.MOUSE_DOUBLE_CLICK, cornerstoneViewportHandleDoubleClick);
  }
  esm.eventTarget.addEventListener(esm.EVENTS.ELEMENT_ENABLED, elementEnabledHandler.bind(null));
  esm.eventTarget.addEventListener(esm.EVENTS.ELEMENT_DISABLED, elementDisabledHandler.bind(null));
}
/* harmony default export */ const src_initDoubleClick = (initDoubleClick);
;// ../../../extensions/cornerstone/src/utils/initViewTiming.ts


const IMAGE_TIMING_KEYS = [];
const imageTiming = {
  viewportsWaiting: 0
};

/**
 * Defines the initial view timing reporting.
 * This allows knowing how many viewports are waiting for initial views and
 * when the IMAGE_RENDERED gets sent out.
 * The first image rendered will fire the FIRST_IMAGE timeEnd logs, while
 * the last of the enabled viewport will fire the ALL_IMAGES timeEnd logs.
 *
 */

function initViewTiming({
  element
}) {
  if (!IMAGE_TIMING_KEYS.length) {
    // Work around a bug in WebPack that doesn't getting the enums initialized
    // quite fast enough to be declared statically.
    const {
      TimingEnum
    } = src.Enums;
    IMAGE_TIMING_KEYS.push(TimingEnum.DISPLAY_SETS_TO_ALL_IMAGES, TimingEnum.DISPLAY_SETS_TO_FIRST_IMAGE, TimingEnum.STUDY_TO_FIRST_IMAGE);
  }
  if (!IMAGE_TIMING_KEYS.find(key => src.log.timingKeys[key])) {
    return;
  }
  imageTiming.viewportsWaiting += 1;
  element.addEventListener(esm.EVENTS.IMAGE_RENDERED, imageRenderedListener);
}
function imageRenderedListener(evt) {
  if (evt.detail.viewportStatus === 'preRender') {
    return;
  }
  const {
    TimingEnum
  } = src.Enums;
  src.log.timeEnd(TimingEnum.DISPLAY_SETS_TO_FIRST_IMAGE);
  src.log.timeEnd(TimingEnum.STUDY_TO_FIRST_IMAGE);
  src.log.timeEnd(TimingEnum.SCRIPT_TO_VIEW);
  imageTiming.viewportsWaiting -= 1;
  evt.detail.element.removeEventListener(esm.EVENTS.IMAGE_RENDERED, imageRenderedListener);
  if (!imageTiming.viewportsWaiting) {
    src.log.timeEnd(TimingEnum.DISPLAY_SETS_TO_ALL_IMAGES);
  }
}
;// ../../../extensions/cornerstone/src/utils/colormaps.js
const colormaps = [{
  ColorSpace: 'RGB',
  Name: 'Grayscale',
  NanColor: [1, 0, 0],
  RGBPoints: [0, 0, 0, 0, 1, 1, 1, 1],
  description: 'Grayscale'
}, {
  ColorSpace: 'RGB',
  Name: 'X Ray',
  NanColor: [1, 0, 0],
  RGBPoints: [0, 1, 1, 1, 1, 0, 0, 0],
  description: 'X Ray'
}, {
  ColorSpace: 'RGB',
  Name: 'Isodose',
  NanColor: [1, 0, 0],
  RGBPoints: [0, 0, 1, 0, 0.1, 0.5, 1, 0, 0.2, 1, 1, 0, 0.3, 1, 0.66, 0, 0.4, 1, 0.33, 0, 0.5, 1, 0, 0],
  description: 'Isodose'
}, {
  ColorSpace: 'RGB',
  Name: 'hsv',
  RGBPoints: [-1, 1, 0, 0, -0.666666, 1, 0, 1, -0.333333, 0, 0, 1, 0, 0, 1, 1, 0.33333, 0, 1, 0, 0.66666, 1, 1, 0, 1, 1, 0, 0],
  description: 'HSV'
}, {
  ColorSpace: 'RGB',
  Name: 'hot_iron',
  RGBPoints: [0.0, 0.0039215686, 0.0039215686, 0.0156862745, 0.00392156862745098, 0.0039215686, 0.0039215686, 0.0156862745, 0.00784313725490196, 0.0039215686, 0.0039215686, 0.031372549, 0.011764705882352941, 0.0039215686, 0.0039215686, 0.0470588235, 0.01568627450980392, 0.0039215686, 0.0039215686, 0.062745098, 0.0196078431372549, 0.0039215686, 0.0039215686, 0.0784313725, 0.023529411764705882, 0.0039215686, 0.0039215686, 0.0941176471, 0.027450980392156862, 0.0039215686, 0.0039215686, 0.1098039216, 0.03137254901960784, 0.0039215686, 0.0039215686, 0.1254901961, 0.03529411764705882, 0.0039215686, 0.0039215686, 0.1411764706, 0.0392156862745098, 0.0039215686, 0.0039215686, 0.1568627451, 0.043137254901960784, 0.0039215686, 0.0039215686, 0.1725490196, 0.047058823529411764, 0.0039215686, 0.0039215686, 0.1882352941, 0.050980392156862744, 0.0039215686, 0.0039215686, 0.2039215686, 0.054901960784313725, 0.0039215686, 0.0039215686, 0.2196078431, 0.05882352941176471, 0.0039215686, 0.0039215686, 0.2352941176, 0.06274509803921569, 0.0039215686, 0.0039215686, 0.2509803922, 0.06666666666666667, 0.0039215686, 0.0039215686, 0.262745098, 0.07058823529411765, 0.0039215686, 0.0039215686, 0.2784313725, 0.07450980392156863, 0.0039215686, 0.0039215686, 0.2941176471, 0.0784313725490196, 0.0039215686, 0.0039215686, 0.3098039216, 0.08235294117647059, 0.0039215686, 0.0039215686, 0.3254901961, 0.08627450980392157, 0.0039215686, 0.0039215686, 0.3411764706, 0.09019607843137255, 0.0039215686, 0.0039215686, 0.3568627451, 0.09411764705882353, 0.0039215686, 0.0039215686, 0.3725490196, 0.09803921568627451, 0.0039215686, 0.0039215686, 0.3882352941, 0.10196078431372549, 0.0039215686, 0.0039215686, 0.4039215686, 0.10588235294117647, 0.0039215686, 0.0039215686, 0.4196078431, 0.10980392156862745, 0.0039215686, 0.0039215686, 0.4352941176, 0.11372549019607843, 0.0039215686, 0.0039215686, 0.4509803922, 0.11764705882352942, 0.0039215686, 0.0039215686, 0.4666666667, 0.12156862745098039, 0.0039215686, 0.0039215686, 0.4823529412, 0.12549019607843137, 0.0039215686, 0.0039215686, 0.4980392157, 0.12941176470588237, 0.0039215686, 0.0039215686, 0.5137254902, 0.13333333333333333, 0.0039215686, 0.0039215686, 0.5294117647, 0.13725490196078433, 0.0039215686, 0.0039215686, 0.5450980392, 0.1411764705882353, 0.0039215686, 0.0039215686, 0.5607843137, 0.1450980392156863, 0.0039215686, 0.0039215686, 0.5764705882, 0.14901960784313725, 0.0039215686, 0.0039215686, 0.5921568627, 0.15294117647058825, 0.0039215686, 0.0039215686, 0.6078431373, 0.1568627450980392, 0.0039215686, 0.0039215686, 0.6235294118, 0.1607843137254902, 0.0039215686, 0.0039215686, 0.6392156863, 0.16470588235294117, 0.0039215686, 0.0039215686, 0.6549019608, 0.16862745098039217, 0.0039215686, 0.0039215686, 0.6705882353, 0.17254901960784313, 0.0039215686, 0.0039215686, 0.6862745098, 0.17647058823529413, 0.0039215686, 0.0039215686, 0.7019607843, 0.1803921568627451, 0.0039215686, 0.0039215686, 0.7176470588, 0.1843137254901961, 0.0039215686, 0.0039215686, 0.7333333333, 0.18823529411764706, 0.0039215686, 0.0039215686, 0.7490196078, 0.19215686274509805, 0.0039215686, 0.0039215686, 0.7607843137, 0.19607843137254902, 0.0039215686, 0.0039215686, 0.7764705882, 0.2, 0.0039215686, 0.0039215686, 0.7921568627, 0.20392156862745098, 0.0039215686, 0.0039215686, 0.8078431373, 0.20784313725490197, 0.0039215686, 0.0039215686, 0.8235294118, 0.21176470588235294, 0.0039215686, 0.0039215686, 0.8392156863, 0.21568627450980393, 0.0039215686, 0.0039215686, 0.8549019608, 0.2196078431372549, 0.0039215686, 0.0039215686, 0.8705882353, 0.2235294117647059, 0.0039215686, 0.0039215686, 0.8862745098, 0.22745098039215686, 0.0039215686, 0.0039215686, 0.9019607843, 0.23137254901960785, 0.0039215686, 0.0039215686, 0.9176470588, 0.23529411764705885, 0.0039215686, 0.0039215686, 0.9333333333, 0.23921568627450984, 0.0039215686, 0.0039215686, 0.9490196078, 0.24313725490196078, 0.0039215686, 0.0039215686, 0.9647058824, 0.24705882352941178, 0.0039215686, 0.0039215686, 0.9803921569, 0.25098039215686274, 0.0039215686, 0.0039215686, 0.9960784314, 0.2549019607843137, 0.0039215686, 0.0039215686, 0.9960784314, 0.25882352941176473, 0.0156862745, 0.0039215686, 0.9803921569, 0.2627450980392157, 0.031372549, 0.0039215686, 0.9647058824, 0.26666666666666666, 0.0470588235, 0.0039215686, 0.9490196078, 0.27058823529411763, 0.062745098, 0.0039215686, 0.9333333333, 0.27450980392156865, 0.0784313725, 0.0039215686, 0.9176470588, 0.2784313725490196, 0.0941176471, 0.0039215686, 0.9019607843, 0.2823529411764706, 0.1098039216, 0.0039215686, 0.8862745098, 0.28627450980392155, 0.1254901961, 0.0039215686, 0.8705882353, 0.2901960784313726, 0.1411764706, 0.0039215686, 0.8549019608, 0.29411764705882354, 0.1568627451, 0.0039215686, 0.8392156863, 0.2980392156862745, 0.1725490196, 0.0039215686, 0.8235294118, 0.30196078431372547, 0.1882352941, 0.0039215686, 0.8078431373, 0.3058823529411765, 0.2039215686, 0.0039215686, 0.7921568627, 0.30980392156862746, 0.2196078431, 0.0039215686, 0.7764705882, 0.3137254901960784, 0.2352941176, 0.0039215686, 0.7607843137, 0.3176470588235294, 0.2509803922, 0.0039215686, 0.7490196078, 0.3215686274509804, 0.262745098, 0.0039215686, 0.7333333333, 0.3254901960784314, 0.2784313725, 0.0039215686, 0.7176470588, 0.32941176470588235, 0.2941176471, 0.0039215686, 0.7019607843, 0.3333333333333333, 0.3098039216, 0.0039215686, 0.6862745098, 0.33725490196078434, 0.3254901961, 0.0039215686, 0.6705882353, 0.3411764705882353, 0.3411764706, 0.0039215686, 0.6549019608, 0.34509803921568627, 0.3568627451, 0.0039215686, 0.6392156863, 0.34901960784313724, 0.3725490196, 0.0039215686, 0.6235294118, 0.35294117647058826, 0.3882352941, 0.0039215686, 0.6078431373, 0.3568627450980392, 0.4039215686, 0.0039215686, 0.5921568627, 0.3607843137254902, 0.4196078431, 0.0039215686, 0.5764705882, 0.36470588235294116, 0.4352941176, 0.0039215686, 0.5607843137, 0.3686274509803922, 0.4509803922, 0.0039215686, 0.5450980392, 0.37254901960784315, 0.4666666667, 0.0039215686, 0.5294117647, 0.3764705882352941, 0.4823529412, 0.0039215686, 0.5137254902, 0.3803921568627451, 0.4980392157, 0.0039215686, 0.4980392157, 0.3843137254901961, 0.5137254902, 0.0039215686, 0.4823529412, 0.38823529411764707, 0.5294117647, 0.0039215686, 0.4666666667, 0.39215686274509803, 0.5450980392, 0.0039215686, 0.4509803922, 0.396078431372549, 0.5607843137, 0.0039215686, 0.4352941176, 0.4, 0.5764705882, 0.0039215686, 0.4196078431, 0.403921568627451, 0.5921568627, 0.0039215686, 0.4039215686, 0.40784313725490196, 0.6078431373, 0.0039215686, 0.3882352941, 0.4117647058823529, 0.6235294118, 0.0039215686, 0.3725490196, 0.41568627450980394, 0.6392156863, 0.0039215686, 0.3568627451, 0.4196078431372549, 0.6549019608, 0.0039215686, 0.3411764706, 0.4235294117647059, 0.6705882353, 0.0039215686, 0.3254901961, 0.42745098039215684, 0.6862745098, 0.0039215686, 0.3098039216, 0.43137254901960786, 0.7019607843, 0.0039215686, 0.2941176471, 0.43529411764705883, 0.7176470588, 0.0039215686, 0.2784313725, 0.4392156862745098, 0.7333333333, 0.0039215686, 0.262745098, 0.44313725490196076, 0.7490196078, 0.0039215686, 0.2509803922, 0.4470588235294118, 0.7607843137, 0.0039215686, 0.2352941176, 0.45098039215686275, 0.7764705882, 0.0039215686, 0.2196078431, 0.4549019607843137, 0.7921568627, 0.0039215686, 0.2039215686, 0.4588235294117647, 0.8078431373, 0.0039215686, 0.1882352941, 0.4627450980392157, 0.8235294118, 0.0039215686, 0.1725490196, 0.4666666666666667, 0.8392156863, 0.0039215686, 0.1568627451, 0.4705882352941177, 0.8549019608, 0.0039215686, 0.1411764706, 0.4745098039215686, 0.8705882353, 0.0039215686, 0.1254901961, 0.4784313725490197, 0.8862745098, 0.0039215686, 0.1098039216, 0.48235294117647065, 0.9019607843, 0.0039215686, 0.0941176471, 0.48627450980392156, 0.9176470588, 0.0039215686, 0.0784313725, 0.49019607843137253, 0.9333333333, 0.0039215686, 0.062745098, 0.49411764705882355, 0.9490196078, 0.0039215686, 0.0470588235, 0.4980392156862745, 0.9647058824, 0.0039215686, 0.031372549, 0.5019607843137255, 0.9803921569, 0.0039215686, 0.0156862745, 0.5058823529411764, 0.9960784314, 0.0039215686, 0.0039215686, 0.5098039215686274, 0.9960784314, 0.0156862745, 0.0039215686, 0.5137254901960784, 0.9960784314, 0.031372549, 0.0039215686, 0.5176470588235295, 0.9960784314, 0.0470588235, 0.0039215686, 0.5215686274509804, 0.9960784314, 0.062745098, 0.0039215686, 0.5254901960784314, 0.9960784314, 0.0784313725, 0.0039215686, 0.5294117647058824, 0.9960784314, 0.0941176471, 0.0039215686, 0.5333333333333333, 0.9960784314, 0.1098039216, 0.0039215686, 0.5372549019607843, 0.9960784314, 0.1254901961, 0.0039215686, 0.5411764705882353, 0.9960784314, 0.1411764706, 0.0039215686, 0.5450980392156862, 0.9960784314, 0.1568627451, 0.0039215686, 0.5490196078431373, 0.9960784314, 0.1725490196, 0.0039215686, 0.5529411764705883, 0.9960784314, 0.1882352941, 0.0039215686, 0.5568627450980392, 0.9960784314, 0.2039215686, 0.0039215686, 0.5607843137254902, 0.9960784314, 0.2196078431, 0.0039215686, 0.5647058823529412, 0.9960784314, 0.2352941176, 0.0039215686, 0.5686274509803921, 0.9960784314, 0.2509803922, 0.0039215686, 0.5725490196078431, 0.9960784314, 0.262745098, 0.0039215686, 0.5764705882352941, 0.9960784314, 0.2784313725, 0.0039215686, 0.5803921568627451, 0.9960784314, 0.2941176471, 0.0039215686, 0.5843137254901961, 0.9960784314, 0.3098039216, 0.0039215686, 0.5882352941176471, 0.9960784314, 0.3254901961, 0.0039215686, 0.592156862745098, 0.9960784314, 0.3411764706, 0.0039215686, 0.596078431372549, 0.9960784314, 0.3568627451, 0.0039215686, 0.6, 0.9960784314, 0.3725490196, 0.0039215686, 0.6039215686274509, 0.9960784314, 0.3882352941, 0.0039215686, 0.6078431372549019, 0.9960784314, 0.4039215686, 0.0039215686, 0.611764705882353, 0.9960784314, 0.4196078431, 0.0039215686, 0.615686274509804, 0.9960784314, 0.4352941176, 0.0039215686, 0.6196078431372549, 0.9960784314, 0.4509803922, 0.0039215686, 0.6235294117647059, 0.9960784314, 0.4666666667, 0.0039215686, 0.6274509803921569, 0.9960784314, 0.4823529412, 0.0039215686, 0.6313725490196078, 0.9960784314, 0.4980392157, 0.0039215686, 0.6352941176470588, 0.9960784314, 0.5137254902, 0.0039215686, 0.6392156862745098, 0.9960784314, 0.5294117647, 0.0039215686, 0.6431372549019608, 0.9960784314, 0.5450980392, 0.0039215686, 0.6470588235294118, 0.9960784314, 0.5607843137, 0.0039215686, 0.6509803921568628, 0.9960784314, 0.5764705882, 0.0039215686, 0.6549019607843137, 0.9960784314, 0.5921568627, 0.0039215686, 0.6588235294117647, 0.9960784314, 0.6078431373, 0.0039215686, 0.6627450980392157, 0.9960784314, 0.6235294118, 0.0039215686, 0.6666666666666666, 0.9960784314, 0.6392156863, 0.0039215686, 0.6705882352941176, 0.9960784314, 0.6549019608, 0.0039215686, 0.6745098039215687, 0.9960784314, 0.6705882353, 0.0039215686, 0.6784313725490196, 0.9960784314, 0.6862745098, 0.0039215686, 0.6823529411764706, 0.9960784314, 0.7019607843, 0.0039215686, 0.6862745098039216, 0.9960784314, 0.7176470588, 0.0039215686, 0.6901960784313725, 0.9960784314, 0.7333333333, 0.0039215686, 0.6941176470588235, 0.9960784314, 0.7490196078, 0.0039215686, 0.6980392156862745, 0.9960784314, 0.7607843137, 0.0039215686, 0.7019607843137254, 0.9960784314, 0.7764705882, 0.0039215686, 0.7058823529411765, 0.9960784314, 0.7921568627, 0.0039215686, 0.7098039215686275, 0.9960784314, 0.8078431373, 0.0039215686, 0.7137254901960784, 0.9960784314, 0.8235294118, 0.0039215686, 0.7176470588235294, 0.9960784314, 0.8392156863, 0.0039215686, 0.7215686274509804, 0.9960784314, 0.8549019608, 0.0039215686, 0.7254901960784313, 0.9960784314, 0.8705882353, 0.0039215686, 0.7294117647058823, 0.9960784314, 0.8862745098, 0.0039215686, 0.7333333333333333, 0.9960784314, 0.9019607843, 0.0039215686, 0.7372549019607844, 0.9960784314, 0.9176470588, 0.0039215686, 0.7411764705882353, 0.9960784314, 0.9333333333, 0.0039215686, 0.7450980392156863, 0.9960784314, 0.9490196078, 0.0039215686, 0.7490196078431373, 0.9960784314, 0.9647058824, 0.0039215686, 0.7529411764705882, 0.9960784314, 0.9803921569, 0.0039215686, 0.7568627450980392, 0.9960784314, 0.9960784314, 0.0039215686, 0.7607843137254902, 0.9960784314, 0.9960784314, 0.0196078431, 0.7647058823529411, 0.9960784314, 0.9960784314, 0.0352941176, 0.7686274509803922, 0.9960784314, 0.9960784314, 0.0509803922, 0.7725490196078432, 0.9960784314, 0.9960784314, 0.0666666667, 0.7764705882352941, 0.9960784314, 0.9960784314, 0.0823529412, 0.7803921568627451, 0.9960784314, 0.9960784314, 0.0980392157, 0.7843137254901961, 0.9960784314, 0.9960784314, 0.1137254902, 0.788235294117647, 0.9960784314, 0.9960784314, 0.1294117647, 0.792156862745098, 0.9960784314, 0.9960784314, 0.1450980392, 0.796078431372549, 0.9960784314, 0.9960784314, 0.1607843137, 0.8, 0.9960784314, 0.9960784314, 0.1764705882, 0.803921568627451, 0.9960784314, 0.9960784314, 0.1921568627, 0.807843137254902, 0.9960784314, 0.9960784314, 0.2078431373, 0.8117647058823529, 0.9960784314, 0.9960784314, 0.2235294118, 0.8156862745098039, 0.9960784314, 0.9960784314, 0.2392156863, 0.8196078431372549, 0.9960784314, 0.9960784314, 0.2509803922, 0.8235294117647058, 0.9960784314, 0.9960784314, 0.2666666667, 0.8274509803921568, 0.9960784314, 0.9960784314, 0.2823529412, 0.8313725490196079, 0.9960784314, 0.9960784314, 0.2980392157, 0.8352941176470589, 0.9960784314, 0.9960784314, 0.3137254902, 0.8392156862745098, 0.9960784314, 0.9960784314, 0.3333333333, 0.8431372549019608, 0.9960784314, 0.9960784314, 0.3490196078, 0.8470588235294118, 0.9960784314, 0.9960784314, 0.3647058824, 0.8509803921568627, 0.9960784314, 0.9960784314, 0.3803921569, 0.8549019607843137, 0.9960784314, 0.9960784314, 0.3960784314, 0.8588235294117647, 0.9960784314, 0.9960784314, 0.4117647059, 0.8627450980392157, 0.9960784314, 0.9960784314, 0.4274509804, 0.8666666666666667, 0.9960784314, 0.9960784314, 0.4431372549, 0.8705882352941177, 0.9960784314, 0.9960784314, 0.4588235294, 0.8745098039215686, 0.9960784314, 0.9960784314, 0.4745098039, 0.8784313725490196, 0.9960784314, 0.9960784314, 0.4901960784, 0.8823529411764706, 0.9960784314, 0.9960784314, 0.5058823529, 0.8862745098039215, 0.9960784314, 0.9960784314, 0.5215686275, 0.8901960784313725, 0.9960784314, 0.9960784314, 0.537254902, 0.8941176470588236, 0.9960784314, 0.9960784314, 0.5529411765, 0.8980392156862745, 0.9960784314, 0.9960784314, 0.568627451, 0.9019607843137255, 0.9960784314, 0.9960784314, 0.5843137255, 0.9058823529411765, 0.9960784314, 0.9960784314, 0.6, 0.9098039215686274, 0.9960784314, 0.9960784314, 0.6156862745, 0.9137254901960784, 0.9960784314, 0.9960784314, 0.631372549, 0.9176470588235294, 0.9960784314, 0.9960784314, 0.6470588235, 0.9215686274509803, 0.9960784314, 0.9960784314, 0.6666666667, 0.9254901960784314, 0.9960784314, 0.9960784314, 0.6823529412, 0.9294117647058824, 0.9960784314, 0.9960784314, 0.6980392157, 0.9333333333333333, 0.9960784314, 0.9960784314, 0.7137254902, 0.9372549019607843, 0.9960784314, 0.9960784314, 0.7294117647, 0.9411764705882354, 0.9960784314, 0.9960784314, 0.7450980392, 0.9450980392156864, 0.9960784314, 0.9960784314, 0.7568627451, 0.9490196078431372, 0.9960784314, 0.9960784314, 0.7725490196, 0.9529411764705882, 0.9960784314, 0.9960784314, 0.7882352941, 0.9568627450980394, 0.9960784314, 0.9960784314, 0.8039215686, 0.9607843137254903, 0.9960784314, 0.9960784314, 0.8196078431, 0.9647058823529413, 0.9960784314, 0.9960784314, 0.8352941176, 0.9686274509803922, 0.9960784314, 0.9960784314, 0.8509803922, 0.9725490196078431, 0.9960784314, 0.9960784314, 0.8666666667, 0.9764705882352941, 0.9960784314, 0.9960784314, 0.8823529412, 0.9803921568627451, 0.9960784314, 0.9960784314, 0.8980392157, 0.984313725490196, 0.9960784314, 0.9960784314, 0.9137254902, 0.9882352941176471, 0.9960784314, 0.9960784314, 0.9294117647, 0.9921568627450981, 0.9960784314, 0.9960784314, 0.9450980392, 0.996078431372549, 0.9960784314, 0.9960784314, 0.9607843137, 1.0, 0.9960784314, 0.9960784314, 0.9607843137],
  description: 'Hot Iron'
}, {
  ColorSpace: 'RGB',
  Name: 'red_hot',
  RGBPoints: [0.0, 0.0, 0.0, 0.0, 0.00392156862745098, 0.0, 0.0, 0.0, 0.00784313725490196, 0.0, 0.0, 0.0, 0.011764705882352941, 0.0, 0.0, 0.0, 0.01568627450980392, 0.0039215686, 0.0039215686, 0.0039215686, 0.0196078431372549, 0.0039215686, 0.0039215686, 0.0039215686, 0.023529411764705882, 0.0039215686, 0.0039215686, 0.0039215686, 0.027450980392156862, 0.0039215686, 0.0039215686, 0.0039215686, 0.03137254901960784, 0.0039215686, 0.0039215686, 0.0039215686, 0.03529411764705882, 0.0156862745, 0.0, 0.0, 0.0392156862745098, 0.0274509804, 0.0, 0.0, 0.043137254901960784, 0.0392156863, 0.0, 0.0, 0.047058823529411764, 0.0509803922, 0.0, 0.0, 0.050980392156862744, 0.062745098, 0.0, 0.0, 0.054901960784313725, 0.0784313725, 0.0, 0.0, 0.05882352941176471, 0.0901960784, 0.0, 0.0, 0.06274509803921569, 0.1058823529, 0.0, 0.0, 0.06666666666666667, 0.1176470588, 0.0, 0.0, 0.07058823529411765, 0.1294117647, 0.0, 0.0, 0.07450980392156863, 0.1411764706, 0.0, 0.0, 0.0784313725490196, 0.1529411765, 0.0, 0.0, 0.08235294117647059, 0.1647058824, 0.0, 0.0, 0.08627450980392157, 0.1764705882, 0.0, 0.0, 0.09019607843137255, 0.1882352941, 0.0, 0.0, 0.09411764705882353, 0.2039215686, 0.0, 0.0, 0.09803921568627451, 0.2156862745, 0.0, 0.0, 0.10196078431372549, 0.2274509804, 0.0, 0.0, 0.10588235294117647, 0.2392156863, 0.0, 0.0, 0.10980392156862745, 0.2549019608, 0.0, 0.0, 0.11372549019607843, 0.2666666667, 0.0, 0.0, 0.11764705882352942, 0.2784313725, 0.0, 0.0, 0.12156862745098039, 0.2901960784, 0.0, 0.0, 0.12549019607843137, 0.3058823529, 0.0, 0.0, 0.12941176470588237, 0.3176470588, 0.0, 0.0, 0.13333333333333333, 0.3294117647, 0.0, 0.0, 0.13725490196078433, 0.3411764706, 0.0, 0.0, 0.1411764705882353, 0.3529411765, 0.0, 0.0, 0.1450980392156863, 0.3647058824, 0.0, 0.0, 0.14901960784313725, 0.3764705882, 0.0, 0.0, 0.15294117647058825, 0.3882352941, 0.0, 0.0, 0.1568627450980392, 0.4039215686, 0.0, 0.0, 0.1607843137254902, 0.4156862745, 0.0, 0.0, 0.16470588235294117, 0.431372549, 0.0, 0.0, 0.16862745098039217, 0.4431372549, 0.0, 0.0, 0.17254901960784313, 0.4588235294, 0.0, 0.0, 0.17647058823529413, 0.4705882353, 0.0, 0.0, 0.1803921568627451, 0.4823529412, 0.0, 0.0, 0.1843137254901961, 0.4941176471, 0.0, 0.0, 0.18823529411764706, 0.5098039216, 0.0, 0.0, 0.19215686274509805, 0.5215686275, 0.0, 0.0, 0.19607843137254902, 0.5333333333, 0.0, 0.0, 0.2, 0.5450980392, 0.0, 0.0, 0.20392156862745098, 0.5568627451, 0.0, 0.0, 0.20784313725490197, 0.568627451, 0.0, 0.0, 0.21176470588235294, 0.5803921569, 0.0, 0.0, 0.21568627450980393, 0.5921568627, 0.0, 0.0, 0.2196078431372549, 0.6078431373, 0.0, 0.0, 0.2235294117647059, 0.6196078431, 0.0, 0.0, 0.22745098039215686, 0.631372549, 0.0, 0.0, 0.23137254901960785, 0.6431372549, 0.0, 0.0, 0.23529411764705885, 0.6588235294, 0.0, 0.0, 0.23921568627450984, 0.6705882353, 0.0, 0.0, 0.24313725490196078, 0.6823529412, 0.0, 0.0, 0.24705882352941178, 0.6941176471, 0.0, 0.0, 0.25098039215686274, 0.7098039216, 0.0, 0.0, 0.2549019607843137, 0.7215686275, 0.0, 0.0, 0.25882352941176473, 0.7333333333, 0.0, 0.0, 0.2627450980392157, 0.7450980392, 0.0, 0.0, 0.26666666666666666, 0.7568627451, 0.0, 0.0, 0.27058823529411763, 0.768627451, 0.0, 0.0, 0.27450980392156865, 0.7843137255, 0.0, 0.0, 0.2784313725490196, 0.7960784314, 0.0, 0.0, 0.2823529411764706, 0.8117647059, 0.0, 0.0, 0.28627450980392155, 0.8235294118, 0.0, 0.0, 0.2901960784313726, 0.8352941176, 0.0, 0.0, 0.29411764705882354, 0.8470588235, 0.0, 0.0, 0.2980392156862745, 0.862745098, 0.0, 0.0, 0.30196078431372547, 0.8745098039, 0.0, 0.0, 0.3058823529411765, 0.8862745098, 0.0, 0.0, 0.30980392156862746, 0.8980392157, 0.0, 0.0, 0.3137254901960784, 0.9137254902, 0.0, 0.0, 0.3176470588235294, 0.9254901961, 0.0, 0.0, 0.3215686274509804, 0.937254902, 0.0, 0.0, 0.3254901960784314, 0.9490196078, 0.0, 0.0, 0.32941176470588235, 0.9607843137, 0.0, 0.0, 0.3333333333333333, 0.968627451, 0.0, 0.0, 0.33725490196078434, 0.9803921569, 0.0039215686, 0.0, 0.3411764705882353, 0.9882352941, 0.0078431373, 0.0, 0.34509803921568627, 1.0, 0.0117647059, 0.0, 0.34901960784313724, 1.0, 0.0235294118, 0.0, 0.35294117647058826, 1.0, 0.0352941176, 0.0, 0.3568627450980392, 1.0, 0.0470588235, 0.0, 0.3607843137254902, 1.0, 0.062745098, 0.0, 0.36470588235294116, 1.0, 0.0745098039, 0.0, 0.3686274509803922, 1.0, 0.0862745098, 0.0, 0.37254901960784315, 1.0, 0.0980392157, 0.0, 0.3764705882352941, 1.0, 0.1137254902, 0.0, 0.3803921568627451, 1.0, 0.1254901961, 0.0, 0.3843137254901961, 1.0, 0.137254902, 0.0, 0.38823529411764707, 1.0, 0.1490196078, 0.0, 0.39215686274509803, 1.0, 0.1647058824, 0.0, 0.396078431372549, 1.0, 0.1764705882, 0.0, 0.4, 1.0, 0.1882352941, 0.0, 0.403921568627451, 1.0, 0.2, 0.0, 0.40784313725490196, 1.0, 0.2156862745, 0.0, 0.4117647058823529, 1.0, 0.2274509804, 0.0, 0.41568627450980394, 1.0, 0.2392156863, 0.0, 0.4196078431372549, 1.0, 0.2509803922, 0.0, 0.4235294117647059, 1.0, 0.2666666667, 0.0, 0.42745098039215684, 1.0, 0.2784313725, 0.0, 0.43137254901960786, 1.0, 0.2901960784, 0.0, 0.43529411764705883, 1.0, 0.3019607843, 0.0, 0.4392156862745098, 1.0, 0.3176470588, 0.0, 0.44313725490196076, 1.0, 0.3294117647, 0.0, 0.4470588235294118, 1.0, 0.3411764706, 0.0, 0.45098039215686275, 1.0, 0.3529411765, 0.0, 0.4549019607843137, 1.0, 0.368627451, 0.0, 0.4588235294117647, 1.0, 0.3803921569, 0.0, 0.4627450980392157, 1.0, 0.3921568627, 0.0, 0.4666666666666667, 1.0, 0.4039215686, 0.0, 0.4705882352941177, 1.0, 0.4156862745, 0.0, 0.4745098039215686, 1.0, 0.4274509804, 0.0, 0.4784313725490197, 1.0, 0.4392156863, 0.0, 0.48235294117647065, 1.0, 0.4509803922, 0.0, 0.48627450980392156, 1.0, 0.4666666667, 0.0, 0.49019607843137253, 1.0, 0.4784313725, 0.0, 0.49411764705882355, 1.0, 0.4941176471, 0.0, 0.4980392156862745, 1.0, 0.5058823529, 0.0, 0.5019607843137255, 1.0, 0.5215686275, 0.0, 0.5058823529411764, 1.0, 0.5333333333, 0.0, 0.5098039215686274, 1.0, 0.5450980392, 0.0, 0.5137254901960784, 1.0, 0.5568627451, 0.0, 0.5176470588235295, 1.0, 0.568627451, 0.0, 0.5215686274509804, 1.0, 0.5803921569, 0.0, 0.5254901960784314, 1.0, 0.5921568627, 0.0, 0.5294117647058824, 1.0, 0.6039215686, 0.0, 0.5333333333333333, 1.0, 0.6196078431, 0.0, 0.5372549019607843, 1.0, 0.631372549, 0.0, 0.5411764705882353, 1.0, 0.6431372549, 0.0, 0.5450980392156862, 1.0, 0.6549019608, 0.0, 0.5490196078431373, 1.0, 0.6705882353, 0.0, 0.5529411764705883, 1.0, 0.6823529412, 0.0, 0.5568627450980392, 1.0, 0.6941176471, 0.0, 0.5607843137254902, 1.0, 0.7058823529, 0.0, 0.5647058823529412, 1.0, 0.7215686275, 0.0, 0.5686274509803921, 1.0, 0.7333333333, 0.0, 0.5725490196078431, 1.0, 0.7450980392, 0.0, 0.5764705882352941, 1.0, 0.7568627451, 0.0, 0.5803921568627451, 1.0, 0.7725490196, 0.0, 0.5843137254901961, 1.0, 0.7843137255, 0.0, 0.5882352941176471, 1.0, 0.7960784314, 0.0, 0.592156862745098, 1.0, 0.8078431373, 0.0, 0.596078431372549, 1.0, 0.8196078431, 0.0, 0.6, 1.0, 0.831372549, 0.0, 0.6039215686274509, 1.0, 0.8470588235, 0.0, 0.6078431372549019, 1.0, 0.8588235294, 0.0, 0.611764705882353, 1.0, 0.8745098039, 0.0, 0.615686274509804, 1.0, 0.8862745098, 0.0, 0.6196078431372549, 1.0, 0.8980392157, 0.0, 0.6235294117647059, 1.0, 0.9098039216, 0.0, 0.6274509803921569, 1.0, 0.9254901961, 0.0, 0.6313725490196078, 1.0, 0.937254902, 0.0, 0.6352941176470588, 1.0, 0.9490196078, 0.0, 0.6392156862745098, 1.0, 0.9607843137, 0.0, 0.6431372549019608, 1.0, 0.9764705882, 0.0, 0.6470588235294118, 1.0, 0.9803921569, 0.0039215686, 0.6509803921568628, 1.0, 0.9882352941, 0.0117647059, 0.6549019607843137, 1.0, 0.9921568627, 0.0156862745, 0.6588235294117647, 1.0, 1.0, 0.0235294118, 0.6627450980392157, 1.0, 1.0, 0.0352941176, 0.6666666666666666, 1.0, 1.0, 0.0470588235, 0.6705882352941176, 1.0, 1.0, 0.0588235294, 0.6745098039215687, 1.0, 1.0, 0.0745098039, 0.6784313725490196, 1.0, 1.0, 0.0862745098, 0.6823529411764706, 1.0, 1.0, 0.0980392157, 0.6862745098039216, 1.0, 1.0, 0.1098039216, 0.6901960784313725, 1.0, 1.0, 0.1254901961, 0.6941176470588235, 1.0, 1.0, 0.137254902, 0.6980392156862745, 1.0, 1.0, 0.1490196078, 0.7019607843137254, 1.0, 1.0, 0.1607843137, 0.7058823529411765, 1.0, 1.0, 0.1764705882, 0.7098039215686275, 1.0, 1.0, 0.1882352941, 0.7137254901960784, 1.0, 1.0, 0.2, 0.7176470588235294, 1.0, 1.0, 0.2117647059, 0.7215686274509804, 1.0, 1.0, 0.2274509804, 0.7254901960784313, 1.0, 1.0, 0.2392156863, 0.7294117647058823, 1.0, 1.0, 0.2509803922, 0.7333333333333333, 1.0, 1.0, 0.262745098, 0.7372549019607844, 1.0, 1.0, 0.2784313725, 0.7411764705882353, 1.0, 1.0, 0.2901960784, 0.7450980392156863, 1.0, 1.0, 0.3019607843, 0.7490196078431373, 1.0, 1.0, 0.3137254902, 0.7529411764705882, 1.0, 1.0, 0.3294117647, 0.7568627450980392, 1.0, 1.0, 0.3411764706, 0.7607843137254902, 1.0, 1.0, 0.3529411765, 0.7647058823529411, 1.0, 1.0, 0.3647058824, 0.7686274509803922, 1.0, 1.0, 0.3803921569, 0.7725490196078432, 1.0, 1.0, 0.3921568627, 0.7764705882352941, 1.0, 1.0, 0.4039215686, 0.7803921568627451, 1.0, 1.0, 0.4156862745, 0.7843137254901961, 1.0, 1.0, 0.431372549, 0.788235294117647, 1.0, 1.0, 0.4431372549, 0.792156862745098, 1.0, 1.0, 0.4549019608, 0.796078431372549, 1.0, 1.0, 0.4666666667, 0.8, 1.0, 1.0, 0.4784313725, 0.803921568627451, 1.0, 1.0, 0.4901960784, 0.807843137254902, 1.0, 1.0, 0.5019607843, 0.8117647058823529, 1.0, 1.0, 0.5137254902, 0.8156862745098039, 1.0, 1.0, 0.5294117647, 0.8196078431372549, 1.0, 1.0, 0.5411764706, 0.8235294117647058, 1.0, 1.0, 0.5568627451, 0.8274509803921568, 1.0, 1.0, 0.568627451, 0.8313725490196079, 1.0, 1.0, 0.5843137255, 0.8352941176470589, 1.0, 1.0, 0.5960784314, 0.8392156862745098, 1.0, 1.0, 0.6078431373, 0.8431372549019608, 1.0, 1.0, 0.6196078431, 0.8470588235294118, 1.0, 1.0, 0.631372549, 0.8509803921568627, 1.0, 1.0, 0.6431372549, 0.8549019607843137, 1.0, 1.0, 0.6549019608, 0.8588235294117647, 1.0, 1.0, 0.6666666667, 0.8627450980392157, 1.0, 1.0, 0.6823529412, 0.8666666666666667, 1.0, 1.0, 0.6941176471, 0.8705882352941177, 1.0, 1.0, 0.7058823529, 0.8745098039215686, 1.0, 1.0, 0.7176470588, 0.8784313725490196, 1.0, 1.0, 0.7333333333, 0.8823529411764706, 1.0, 1.0, 0.7450980392, 0.8862745098039215, 1.0, 1.0, 0.7568627451, 0.8901960784313725, 1.0, 1.0, 0.768627451, 0.8941176470588236, 1.0, 1.0, 0.7843137255, 0.8980392156862745, 1.0, 1.0, 0.7960784314, 0.9019607843137255, 1.0, 1.0, 0.8078431373, 0.9058823529411765, 1.0, 1.0, 0.8196078431, 0.9098039215686274, 1.0, 1.0, 0.8352941176, 0.9137254901960784, 1.0, 1.0, 0.8470588235, 0.9176470588235294, 1.0, 1.0, 0.8588235294, 0.9215686274509803, 1.0, 1.0, 0.8705882353, 0.9254901960784314, 1.0, 1.0, 0.8823529412, 0.9294117647058824, 1.0, 1.0, 0.8941176471, 0.9333333333333333, 1.0, 1.0, 0.9098039216, 0.9372549019607843, 1.0, 1.0, 0.9215686275, 0.9411764705882354, 1.0, 1.0, 0.937254902, 0.9450980392156864, 1.0, 1.0, 0.9490196078, 0.9490196078431372, 1.0, 1.0, 0.9607843137, 0.9529411764705882, 1.0, 1.0, 0.9725490196, 0.9568627450980394, 1.0, 1.0, 0.9882352941, 0.9607843137254903, 1.0, 1.0, 0.9882352941, 0.9647058823529413, 1.0, 1.0, 0.9921568627, 0.9686274509803922, 1.0, 1.0, 0.9960784314, 0.9725490196078431, 1.0, 1.0, 1.0, 0.9764705882352941, 1.0, 1.0, 1.0, 0.9803921568627451, 1.0, 1.0, 1.0, 0.984313725490196, 1.0, 1.0, 1.0, 0.9882352941176471, 1.0, 1.0, 1.0, 0.9921568627450981, 1.0, 1.0, 1.0, 0.996078431372549, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
  description: 'Red Hot'
}, {
  ColorSpace: 'RGB',
  Name: 's_pet',
  RGBPoints: [0.0, 0.0156862745, 0.0039215686, 0.0156862745, 0.00392156862745098, 0.0156862745, 0.0039215686, 0.0156862745, 0.00784313725490196, 0.0274509804, 0.0039215686, 0.031372549, 0.011764705882352941, 0.0352941176, 0.0039215686, 0.0509803922, 0.01568627450980392, 0.0392156863, 0.0039215686, 0.0666666667, 0.0196078431372549, 0.0509803922, 0.0039215686, 0.0823529412, 0.023529411764705882, 0.062745098, 0.0039215686, 0.0980392157, 0.027450980392156862, 0.0705882353, 0.0039215686, 0.1176470588, 0.03137254901960784, 0.0745098039, 0.0039215686, 0.1333333333, 0.03529411764705882, 0.0862745098, 0.0039215686, 0.1490196078, 0.0392156862745098, 0.0980392157, 0.0039215686, 0.1647058824, 0.043137254901960784, 0.1058823529, 0.0039215686, 0.1843137255, 0.047058823529411764, 0.1098039216, 0.0039215686, 0.2, 0.050980392156862744, 0.1215686275, 0.0039215686, 0.2156862745, 0.054901960784313725, 0.1333333333, 0.0039215686, 0.231372549, 0.05882352941176471, 0.137254902, 0.0039215686, 0.2509803922, 0.06274509803921569, 0.1490196078, 0.0039215686, 0.262745098, 0.06666666666666667, 0.1607843137, 0.0039215686, 0.2784313725, 0.07058823529411765, 0.168627451, 0.0039215686, 0.2941176471, 0.07450980392156863, 0.1725490196, 0.0039215686, 0.3137254902, 0.0784313725490196, 0.1843137255, 0.0039215686, 0.3294117647, 0.08235294117647059, 0.1960784314, 0.0039215686, 0.3450980392, 0.08627450980392157, 0.2039215686, 0.0039215686, 0.3607843137, 0.09019607843137255, 0.2078431373, 0.0039215686, 0.3803921569, 0.09411764705882353, 0.2196078431, 0.0039215686, 0.3960784314, 0.09803921568627451, 0.231372549, 0.0039215686, 0.4117647059, 0.10196078431372549, 0.2392156863, 0.0039215686, 0.4274509804, 0.10588235294117647, 0.2431372549, 0.0039215686, 0.4470588235, 0.10980392156862745, 0.2509803922, 0.0039215686, 0.462745098, 0.11372549019607843, 0.262745098, 0.0039215686, 0.4784313725, 0.11764705882352942, 0.2666666667, 0.0039215686, 0.4980392157, 0.12156862745098039, 0.2666666667, 0.0039215686, 0.4980392157, 0.12549019607843137, 0.262745098, 0.0039215686, 0.5137254902, 0.12941176470588237, 0.2509803922, 0.0039215686, 0.5294117647, 0.13333333333333333, 0.2431372549, 0.0039215686, 0.5450980392, 0.13725490196078433, 0.2392156863, 0.0039215686, 0.5607843137, 0.1411764705882353, 0.231372549, 0.0039215686, 0.5764705882, 0.1450980392156863, 0.2196078431, 0.0039215686, 0.5921568627, 0.14901960784313725, 0.2078431373, 0.0039215686, 0.6078431373, 0.15294117647058825, 0.2039215686, 0.0039215686, 0.6235294118, 0.1568627450980392, 0.1960784314, 0.0039215686, 0.6392156863, 0.1607843137254902, 0.1843137255, 0.0039215686, 0.6549019608, 0.16470588235294117, 0.1725490196, 0.0039215686, 0.6705882353, 0.16862745098039217, 0.168627451, 0.0039215686, 0.6862745098, 0.17254901960784313, 0.1607843137, 0.0039215686, 0.7019607843, 0.17647058823529413, 0.1490196078, 0.0039215686, 0.7176470588, 0.1803921568627451, 0.137254902, 0.0039215686, 0.7333333333, 0.1843137254901961, 0.1333333333, 0.0039215686, 0.7490196078, 0.18823529411764706, 0.1215686275, 0.0039215686, 0.7607843137, 0.19215686274509805, 0.1098039216, 0.0039215686, 0.7764705882, 0.19607843137254902, 0.1058823529, 0.0039215686, 0.7921568627, 0.2, 0.0980392157, 0.0039215686, 0.8078431373, 0.20392156862745098, 0.0862745098, 0.0039215686, 0.8235294118, 0.20784313725490197, 0.0745098039, 0.0039215686, 0.8392156863, 0.21176470588235294, 0.0705882353, 0.0039215686, 0.8549019608, 0.21568627450980393, 0.062745098, 0.0039215686, 0.8705882353, 0.2196078431372549, 0.0509803922, 0.0039215686, 0.8862745098, 0.2235294117647059, 0.0392156863, 0.0039215686, 0.9019607843, 0.22745098039215686, 0.0352941176, 0.0039215686, 0.9176470588, 0.23137254901960785, 0.0274509804, 0.0039215686, 0.9333333333, 0.23529411764705885, 0.0156862745, 0.0039215686, 0.9490196078, 0.23921568627450984, 0.0078431373, 0.0039215686, 0.9647058824, 0.24313725490196078, 0.0039215686, 0.0039215686, 0.9960784314, 0.24705882352941178, 0.0039215686, 0.0039215686, 0.9960784314, 0.25098039215686274, 0.0039215686, 0.0196078431, 0.9647058824, 0.2549019607843137, 0.0039215686, 0.0392156863, 0.9490196078, 0.25882352941176473, 0.0039215686, 0.0549019608, 0.9333333333, 0.2627450980392157, 0.0039215686, 0.0745098039, 0.9176470588, 0.26666666666666666, 0.0039215686, 0.0901960784, 0.9019607843, 0.27058823529411763, 0.0039215686, 0.1098039216, 0.8862745098, 0.27450980392156865, 0.0039215686, 0.1254901961, 0.8705882353, 0.2784313725490196, 0.0039215686, 0.1450980392, 0.8549019608, 0.2823529411764706, 0.0039215686, 0.1607843137, 0.8392156863, 0.28627450980392155, 0.0039215686, 0.1803921569, 0.8235294118, 0.2901960784313726, 0.0039215686, 0.1960784314, 0.8078431373, 0.29411764705882354, 0.0039215686, 0.2156862745, 0.7921568627, 0.2980392156862745, 0.0039215686, 0.231372549, 0.7764705882, 0.30196078431372547, 0.0039215686, 0.2509803922, 0.7607843137, 0.3058823529411765, 0.0039215686, 0.262745098, 0.7490196078, 0.30980392156862746, 0.0039215686, 0.2823529412, 0.7333333333, 0.3137254901960784, 0.0039215686, 0.2980392157, 0.7176470588, 0.3176470588235294, 0.0039215686, 0.3176470588, 0.7019607843, 0.3215686274509804, 0.0039215686, 0.3333333333, 0.6862745098, 0.3254901960784314, 0.0039215686, 0.3529411765, 0.6705882353, 0.32941176470588235, 0.0039215686, 0.368627451, 0.6549019608, 0.3333333333333333, 0.0039215686, 0.3882352941, 0.6392156863, 0.33725490196078434, 0.0039215686, 0.4039215686, 0.6235294118, 0.3411764705882353, 0.0039215686, 0.4235294118, 0.6078431373, 0.34509803921568627, 0.0039215686, 0.4392156863, 0.5921568627, 0.34901960784313724, 0.0039215686, 0.4588235294, 0.5764705882, 0.35294117647058826, 0.0039215686, 0.4745098039, 0.5607843137, 0.3568627450980392, 0.0039215686, 0.4941176471, 0.5450980392, 0.3607843137254902, 0.0039215686, 0.5098039216, 0.5294117647, 0.36470588235294116, 0.0039215686, 0.5294117647, 0.5137254902, 0.3686274509803922, 0.0039215686, 0.5450980392, 0.4980392157, 0.37254901960784315, 0.0039215686, 0.5647058824, 0.4784313725, 0.3764705882352941, 0.0039215686, 0.5803921569, 0.462745098, 0.3803921568627451, 0.0039215686, 0.6, 0.4470588235, 0.3843137254901961, 0.0039215686, 0.6156862745, 0.4274509804, 0.38823529411764707, 0.0039215686, 0.6352941176, 0.4117647059, 0.39215686274509803, 0.0039215686, 0.6509803922, 0.3960784314, 0.396078431372549, 0.0039215686, 0.6705882353, 0.3803921569, 0.4, 0.0039215686, 0.6862745098, 0.3607843137, 0.403921568627451, 0.0039215686, 0.7058823529, 0.3450980392, 0.40784313725490196, 0.0039215686, 0.7215686275, 0.3294117647, 0.4117647058823529, 0.0039215686, 0.7411764706, 0.3137254902, 0.41568627450980394, 0.0039215686, 0.7529411765, 0.2941176471, 0.4196078431372549, 0.0039215686, 0.7960784314, 0.2784313725, 0.4235294117647059, 0.0039215686, 0.7960784314, 0.262745098, 0.42745098039215684, 0.0392156863, 0.8039215686, 0.2509803922, 0.43137254901960786, 0.0745098039, 0.8117647059, 0.231372549, 0.43529411764705883, 0.1098039216, 0.8196078431, 0.2156862745, 0.4392156862745098, 0.1450980392, 0.8274509804, 0.2, 0.44313725490196076, 0.1803921569, 0.8352941176, 0.1843137255, 0.4470588235294118, 0.2156862745, 0.8431372549, 0.1647058824, 0.45098039215686275, 0.2509803922, 0.8509803922, 0.1490196078, 0.4549019607843137, 0.2823529412, 0.8588235294, 0.1333333333, 0.4588235294117647, 0.3176470588, 0.8666666667, 0.1176470588, 0.4627450980392157, 0.3529411765, 0.8745098039, 0.0980392157, 0.4666666666666667, 0.3882352941, 0.8823529412, 0.0823529412, 0.4705882352941177, 0.4235294118, 0.8901960784, 0.0666666667, 0.4745098039215686, 0.4588235294, 0.8980392157, 0.0509803922, 0.4784313725490197, 0.4941176471, 0.9058823529, 0.0431372549, 0.48235294117647065, 0.5294117647, 0.9137254902, 0.031372549, 0.48627450980392156, 0.5647058824, 0.9215686275, 0.0196078431, 0.49019607843137253, 0.6, 0.9294117647, 0.0078431373, 0.49411764705882355, 0.6352941176, 0.937254902, 0.0039215686, 0.4980392156862745, 0.6705882353, 0.9450980392, 0.0039215686, 0.5019607843137255, 0.7058823529, 0.9490196078, 0.0039215686, 0.5058823529411764, 0.7411764706, 0.9568627451, 0.0039215686, 0.5098039215686274, 0.7725490196, 0.9607843137, 0.0039215686, 0.5137254901960784, 0.8078431373, 0.968627451, 0.0039215686, 0.5176470588235295, 0.8431372549, 0.9725490196, 0.0039215686, 0.5215686274509804, 0.8784313725, 0.9803921569, 0.0039215686, 0.5254901960784314, 0.9137254902, 0.9843137255, 0.0039215686, 0.5294117647058824, 0.9490196078, 0.9921568627, 0.0039215686, 0.5333333333333333, 0.9960784314, 0.9960784314, 0.0039215686, 0.5372549019607843, 0.9960784314, 0.9960784314, 0.0039215686, 0.5411764705882353, 0.9960784314, 0.9921568627, 0.0039215686, 0.5450980392156862, 0.9960784314, 0.9843137255, 0.0039215686, 0.5490196078431373, 0.9960784314, 0.9764705882, 0.0039215686, 0.5529411764705883, 0.9960784314, 0.968627451, 0.0039215686, 0.5568627450980392, 0.9960784314, 0.9607843137, 0.0039215686, 0.5607843137254902, 0.9960784314, 0.9529411765, 0.0039215686, 0.5647058823529412, 0.9960784314, 0.9450980392, 0.0039215686, 0.5686274509803921, 0.9960784314, 0.937254902, 0.0039215686, 0.5725490196078431, 0.9960784314, 0.9294117647, 0.0039215686, 0.5764705882352941, 0.9960784314, 0.9215686275, 0.0039215686, 0.5803921568627451, 0.9960784314, 0.9137254902, 0.0039215686, 0.5843137254901961, 0.9960784314, 0.9058823529, 0.0039215686, 0.5882352941176471, 0.9960784314, 0.8980392157, 0.0039215686, 0.592156862745098, 0.9960784314, 0.8901960784, 0.0039215686, 0.596078431372549, 0.9960784314, 0.8823529412, 0.0039215686, 0.6, 0.9960784314, 0.8745098039, 0.0039215686, 0.6039215686274509, 0.9960784314, 0.8666666667, 0.0039215686, 0.6078431372549019, 0.9960784314, 0.8588235294, 0.0039215686, 0.611764705882353, 0.9960784314, 0.8509803922, 0.0039215686, 0.615686274509804, 0.9960784314, 0.8431372549, 0.0039215686, 0.6196078431372549, 0.9960784314, 0.8352941176, 0.0039215686, 0.6235294117647059, 0.9960784314, 0.8274509804, 0.0039215686, 0.6274509803921569, 0.9960784314, 0.8196078431, 0.0039215686, 0.6313725490196078, 0.9960784314, 0.8117647059, 0.0039215686, 0.6352941176470588, 0.9960784314, 0.8039215686, 0.0039215686, 0.6392156862745098, 0.9960784314, 0.7960784314, 0.0039215686, 0.6431372549019608, 0.9960784314, 0.7882352941, 0.0039215686, 0.6470588235294118, 0.9960784314, 0.7803921569, 0.0039215686, 0.6509803921568628, 0.9960784314, 0.7725490196, 0.0039215686, 0.6549019607843137, 0.9960784314, 0.7647058824, 0.0039215686, 0.6588235294117647, 0.9960784314, 0.7568627451, 0.0039215686, 0.6627450980392157, 0.9960784314, 0.7490196078, 0.0039215686, 0.6666666666666666, 0.9960784314, 0.7450980392, 0.0039215686, 0.6705882352941176, 0.9960784314, 0.737254902, 0.0039215686, 0.6745098039215687, 0.9960784314, 0.7294117647, 0.0039215686, 0.6784313725490196, 0.9960784314, 0.7215686275, 0.0039215686, 0.6823529411764706, 0.9960784314, 0.7137254902, 0.0039215686, 0.6862745098039216, 0.9960784314, 0.7058823529, 0.0039215686, 0.6901960784313725, 0.9960784314, 0.6980392157, 0.0039215686, 0.6941176470588235, 0.9960784314, 0.6901960784, 0.0039215686, 0.6980392156862745, 0.9960784314, 0.6823529412, 0.0039215686, 0.7019607843137254, 0.9960784314, 0.6745098039, 0.0039215686, 0.7058823529411765, 0.9960784314, 0.6666666667, 0.0039215686, 0.7098039215686275, 0.9960784314, 0.6588235294, 0.0039215686, 0.7137254901960784, 0.9960784314, 0.6509803922, 0.0039215686, 0.7176470588235294, 0.9960784314, 0.6431372549, 0.0039215686, 0.7215686274509804, 0.9960784314, 0.6352941176, 0.0039215686, 0.7254901960784313, 0.9960784314, 0.6274509804, 0.0039215686, 0.7294117647058823, 0.9960784314, 0.6196078431, 0.0039215686, 0.7333333333333333, 0.9960784314, 0.6117647059, 0.0039215686, 0.7372549019607844, 0.9960784314, 0.6039215686, 0.0039215686, 0.7411764705882353, 0.9960784314, 0.5960784314, 0.0039215686, 0.7450980392156863, 0.9960784314, 0.5882352941, 0.0039215686, 0.7490196078431373, 0.9960784314, 0.5803921569, 0.0039215686, 0.7529411764705882, 0.9960784314, 0.5725490196, 0.0039215686, 0.7568627450980392, 0.9960784314, 0.5647058824, 0.0039215686, 0.7607843137254902, 0.9960784314, 0.5568627451, 0.0039215686, 0.7647058823529411, 0.9960784314, 0.5490196078, 0.0039215686, 0.7686274509803922, 0.9960784314, 0.5411764706, 0.0039215686, 0.7725490196078432, 0.9960784314, 0.5333333333, 0.0039215686, 0.7764705882352941, 0.9960784314, 0.5254901961, 0.0039215686, 0.7803921568627451, 0.9960784314, 0.5176470588, 0.0039215686, 0.7843137254901961, 0.9960784314, 0.5098039216, 0.0039215686, 0.788235294117647, 0.9960784314, 0.5019607843, 0.0039215686, 0.792156862745098, 0.9960784314, 0.4941176471, 0.0039215686, 0.796078431372549, 0.9960784314, 0.4862745098, 0.0039215686, 0.8, 0.9960784314, 0.4784313725, 0.0039215686, 0.803921568627451, 0.9960784314, 0.4705882353, 0.0039215686, 0.807843137254902, 0.9960784314, 0.462745098, 0.0039215686, 0.8117647058823529, 0.9960784314, 0.4549019608, 0.0039215686, 0.8156862745098039, 0.9960784314, 0.4470588235, 0.0039215686, 0.8196078431372549, 0.9960784314, 0.4392156863, 0.0039215686, 0.8235294117647058, 0.9960784314, 0.431372549, 0.0039215686, 0.8274509803921568, 0.9960784314, 0.4235294118, 0.0039215686, 0.8313725490196079, 0.9960784314, 0.4156862745, 0.0039215686, 0.8352941176470589, 0.9960784314, 0.4078431373, 0.0039215686, 0.8392156862745098, 0.9960784314, 0.4, 0.0039215686, 0.8431372549019608, 0.9960784314, 0.3921568627, 0.0039215686, 0.8470588235294118, 0.9960784314, 0.3843137255, 0.0039215686, 0.8509803921568627, 0.9960784314, 0.3764705882, 0.0039215686, 0.8549019607843137, 0.9960784314, 0.368627451, 0.0039215686, 0.8588235294117647, 0.9960784314, 0.3607843137, 0.0039215686, 0.8627450980392157, 0.9960784314, 0.3529411765, 0.0039215686, 0.8666666666666667, 0.9960784314, 0.3450980392, 0.0039215686, 0.8705882352941177, 0.9960784314, 0.337254902, 0.0039215686, 0.8745098039215686, 0.9960784314, 0.3294117647, 0.0039215686, 0.8784313725490196, 0.9960784314, 0.3215686275, 0.0039215686, 0.8823529411764706, 0.9960784314, 0.3137254902, 0.0039215686, 0.8862745098039215, 0.9960784314, 0.3058823529, 0.0039215686, 0.8901960784313725, 0.9960784314, 0.2980392157, 0.0039215686, 0.8941176470588236, 0.9960784314, 0.2901960784, 0.0039215686, 0.8980392156862745, 0.9960784314, 0.2823529412, 0.0039215686, 0.9019607843137255, 0.9960784314, 0.2705882353, 0.0039215686, 0.9058823529411765, 0.9960784314, 0.2588235294, 0.0039215686, 0.9098039215686274, 0.9960784314, 0.2509803922, 0.0039215686, 0.9137254901960784, 0.9960784314, 0.2431372549, 0.0039215686, 0.9176470588235294, 0.9960784314, 0.231372549, 0.0039215686, 0.9215686274509803, 0.9960784314, 0.2196078431, 0.0039215686, 0.9254901960784314, 0.9960784314, 0.2117647059, 0.0039215686, 0.9294117647058824, 0.9960784314, 0.2, 0.0039215686, 0.9333333333333333, 0.9960784314, 0.1882352941, 0.0039215686, 0.9372549019607843, 0.9960784314, 0.1764705882, 0.0039215686, 0.9411764705882354, 0.9960784314, 0.168627451, 0.0039215686, 0.9450980392156864, 0.9960784314, 0.1568627451, 0.0039215686, 0.9490196078431372, 0.9960784314, 0.1450980392, 0.0039215686, 0.9529411764705882, 0.9960784314, 0.1333333333, 0.0039215686, 0.9568627450980394, 0.9960784314, 0.1254901961, 0.0039215686, 0.9607843137254903, 0.9960784314, 0.1137254902, 0.0039215686, 0.9647058823529413, 0.9960784314, 0.1019607843, 0.0039215686, 0.9686274509803922, 0.9960784314, 0.0901960784, 0.0039215686, 0.9725490196078431, 0.9960784314, 0.0823529412, 0.0039215686, 0.9764705882352941, 0.9960784314, 0.0705882353, 0.0039215686, 0.9803921568627451, 0.9960784314, 0.0588235294, 0.0039215686, 0.984313725490196, 0.9960784314, 0.0470588235, 0.0039215686, 0.9882352941176471, 0.9960784314, 0.0392156863, 0.0039215686, 0.9921568627450981, 0.9960784314, 0.0274509804, 0.0039215686, 0.996078431372549, 0.9960784314, 0.0156862745, 0.0039215686, 1.0, 0.9960784314, 0.0156862745, 0.0039215686],
  description: 'S PET'
}, {
  ColorSpace: 'RGB',
  Name: 'perfusion',
  RGBPoints: [0.0, 0.0, 0.0, 0.0, 0.00392156862745098, 0.0078431373, 0.0235294118, 0.0235294118, 0.00784313725490196, 0.0078431373, 0.031372549, 0.0470588235, 0.011764705882352941, 0.0078431373, 0.0392156863, 0.062745098, 0.01568627450980392, 0.0078431373, 0.0470588235, 0.0862745098, 0.0196078431372549, 0.0078431373, 0.0549019608, 0.1019607843, 0.023529411764705882, 0.0078431373, 0.0549019608, 0.1254901961, 0.027450980392156862, 0.0078431373, 0.062745098, 0.1411764706, 0.03137254901960784, 0.0078431373, 0.0705882353, 0.1647058824, 0.03529411764705882, 0.0078431373, 0.0784313725, 0.1803921569, 0.0392156862745098, 0.0078431373, 0.0862745098, 0.2039215686, 0.043137254901960784, 0.0078431373, 0.0862745098, 0.2196078431, 0.047058823529411764, 0.0078431373, 0.0941176471, 0.2431372549, 0.050980392156862744, 0.0078431373, 0.1019607843, 0.2666666667, 0.054901960784313725, 0.0078431373, 0.1098039216, 0.2823529412, 0.05882352941176471, 0.0078431373, 0.1176470588, 0.3058823529, 0.06274509803921569, 0.0078431373, 0.1176470588, 0.3215686275, 0.06666666666666667, 0.0078431373, 0.1254901961, 0.3450980392, 0.07058823529411765, 0.0078431373, 0.1333333333, 0.3607843137, 0.07450980392156863, 0.0078431373, 0.1411764706, 0.3843137255, 0.0784313725490196, 0.0078431373, 0.1490196078, 0.4, 0.08235294117647059, 0.0078431373, 0.1490196078, 0.4235294118, 0.08627450980392157, 0.0078431373, 0.1568627451, 0.4392156863, 0.09019607843137255, 0.0078431373, 0.1647058824, 0.462745098, 0.09411764705882353, 0.0078431373, 0.1725490196, 0.4784313725, 0.09803921568627451, 0.0078431373, 0.1803921569, 0.5019607843, 0.10196078431372549, 0.0078431373, 0.1803921569, 0.5254901961, 0.10588235294117647, 0.0078431373, 0.1882352941, 0.5411764706, 0.10980392156862745, 0.0078431373, 0.1960784314, 0.5647058824, 0.11372549019607843, 0.0078431373, 0.2039215686, 0.5803921569, 0.11764705882352942, 0.0078431373, 0.2117647059, 0.6039215686, 0.12156862745098039, 0.0078431373, 0.2117647059, 0.6196078431, 0.12549019607843137, 0.0078431373, 0.2196078431, 0.6431372549, 0.12941176470588237, 0.0078431373, 0.2274509804, 0.6588235294, 0.13333333333333333, 0.0078431373, 0.2352941176, 0.6823529412, 0.13725490196078433, 0.0078431373, 0.2431372549, 0.6980392157, 0.1411764705882353, 0.0078431373, 0.2431372549, 0.7215686275, 0.1450980392156863, 0.0078431373, 0.2509803922, 0.737254902, 0.14901960784313725, 0.0078431373, 0.2588235294, 0.7607843137, 0.15294117647058825, 0.0078431373, 0.2666666667, 0.7843137255, 0.1568627450980392, 0.0078431373, 0.2745098039, 0.8, 0.1607843137254902, 0.0078431373, 0.2745098039, 0.8235294118, 0.16470588235294117, 0.0078431373, 0.2823529412, 0.8392156863, 0.16862745098039217, 0.0078431373, 0.2901960784, 0.862745098, 0.17254901960784313, 0.0078431373, 0.2980392157, 0.8784313725, 0.17647058823529413, 0.0078431373, 0.3058823529, 0.9019607843, 0.1803921568627451, 0.0078431373, 0.3058823529, 0.9176470588, 0.1843137254901961, 0.0078431373, 0.2980392157, 0.9411764706, 0.18823529411764706, 0.0078431373, 0.3058823529, 0.9568627451, 0.19215686274509805, 0.0078431373, 0.2980392157, 0.9803921569, 0.19607843137254902, 0.0078431373, 0.2980392157, 0.9882352941, 0.2, 0.0078431373, 0.2901960784, 0.9803921569, 0.20392156862745098, 0.0078431373, 0.2901960784, 0.9647058824, 0.20784313725490197, 0.0078431373, 0.2823529412, 0.9568627451, 0.21176470588235294, 0.0078431373, 0.2823529412, 0.9411764706, 0.21568627450980393, 0.0078431373, 0.2745098039, 0.9333333333, 0.2196078431372549, 0.0078431373, 0.2666666667, 0.9176470588, 0.2235294117647059, 0.0078431373, 0.2666666667, 0.9098039216, 0.22745098039215686, 0.0078431373, 0.2588235294, 0.9019607843, 0.23137254901960785, 0.0078431373, 0.2588235294, 0.8862745098, 0.23529411764705885, 0.0078431373, 0.2509803922, 0.8784313725, 0.23921568627450984, 0.0078431373, 0.2509803922, 0.862745098, 0.24313725490196078, 0.0078431373, 0.2431372549, 0.8549019608, 0.24705882352941178, 0.0078431373, 0.2352941176, 0.8392156863, 0.25098039215686274, 0.0078431373, 0.2352941176, 0.831372549, 0.2549019607843137, 0.0078431373, 0.2274509804, 0.8235294118, 0.25882352941176473, 0.0078431373, 0.2274509804, 0.8078431373, 0.2627450980392157, 0.0078431373, 0.2196078431, 0.8, 0.26666666666666666, 0.0078431373, 0.2196078431, 0.7843137255, 0.27058823529411763, 0.0078431373, 0.2117647059, 0.7764705882, 0.27450980392156865, 0.0078431373, 0.2039215686, 0.7607843137, 0.2784313725490196, 0.0078431373, 0.2039215686, 0.7529411765, 0.2823529411764706, 0.0078431373, 0.1960784314, 0.7450980392, 0.28627450980392155, 0.0078431373, 0.1960784314, 0.7294117647, 0.2901960784313726, 0.0078431373, 0.1882352941, 0.7215686275, 0.29411764705882354, 0.0078431373, 0.1882352941, 0.7058823529, 0.2980392156862745, 0.0078431373, 0.1803921569, 0.6980392157, 0.30196078431372547, 0.0078431373, 0.1803921569, 0.6823529412, 0.3058823529411765, 0.0078431373, 0.1725490196, 0.6745098039, 0.30980392156862746, 0.0078431373, 0.1647058824, 0.6666666667, 0.3137254901960784, 0.0078431373, 0.1647058824, 0.6509803922, 0.3176470588235294, 0.0078431373, 0.1568627451, 0.6431372549, 0.3215686274509804, 0.0078431373, 0.1568627451, 0.6274509804, 0.3254901960784314, 0.0078431373, 0.1490196078, 0.6196078431, 0.32941176470588235, 0.0078431373, 0.1490196078, 0.6039215686, 0.3333333333333333, 0.0078431373, 0.1411764706, 0.5960784314, 0.33725490196078434, 0.0078431373, 0.1333333333, 0.5882352941, 0.3411764705882353, 0.0078431373, 0.1333333333, 0.5725490196, 0.34509803921568627, 0.0078431373, 0.1254901961, 0.5647058824, 0.34901960784313724, 0.0078431373, 0.1254901961, 0.5490196078, 0.35294117647058826, 0.0078431373, 0.1176470588, 0.5411764706, 0.3568627450980392, 0.0078431373, 0.1176470588, 0.5254901961, 0.3607843137254902, 0.0078431373, 0.1098039216, 0.5176470588, 0.36470588235294116, 0.0078431373, 0.1019607843, 0.5098039216, 0.3686274509803922, 0.0078431373, 0.1019607843, 0.4941176471, 0.37254901960784315, 0.0078431373, 0.0941176471, 0.4862745098, 0.3764705882352941, 0.0078431373, 0.0941176471, 0.4705882353, 0.3803921568627451, 0.0078431373, 0.0862745098, 0.462745098, 0.3843137254901961, 0.0078431373, 0.0862745098, 0.4470588235, 0.38823529411764707, 0.0078431373, 0.0784313725, 0.4392156863, 0.39215686274509803, 0.0078431373, 0.0705882353, 0.431372549, 0.396078431372549, 0.0078431373, 0.0705882353, 0.4156862745, 0.4, 0.0078431373, 0.062745098, 0.4078431373, 0.403921568627451, 0.0078431373, 0.062745098, 0.3921568627, 0.40784313725490196, 0.0078431373, 0.0549019608, 0.3843137255, 0.4117647058823529, 0.0078431373, 0.0549019608, 0.368627451, 0.41568627450980394, 0.0078431373, 0.0470588235, 0.3607843137, 0.4196078431372549, 0.0078431373, 0.0470588235, 0.3529411765, 0.4235294117647059, 0.0078431373, 0.0392156863, 0.337254902, 0.42745098039215684, 0.0078431373, 0.031372549, 0.3294117647, 0.43137254901960786, 0.0078431373, 0.031372549, 0.3137254902, 0.43529411764705883, 0.0078431373, 0.0235294118, 0.3058823529, 0.4392156862745098, 0.0078431373, 0.0235294118, 0.2901960784, 0.44313725490196076, 0.0078431373, 0.0156862745, 0.2823529412, 0.4470588235294118, 0.0078431373, 0.0156862745, 0.2745098039, 0.45098039215686275, 0.0078431373, 0.0078431373, 0.2588235294, 0.4549019607843137, 0.0235294118, 0.0078431373, 0.2509803922, 0.4588235294117647, 0.0078431373, 0.0078431373, 0.2352941176, 0.4627450980392157, 0.0078431373, 0.0078431373, 0.2274509804, 0.4666666666666667, 0.0078431373, 0.0078431373, 0.2117647059, 0.4705882352941177, 0.0078431373, 0.0078431373, 0.2039215686, 0.4745098039215686, 0.0078431373, 0.0078431373, 0.1960784314, 0.4784313725490197, 0.0078431373, 0.0078431373, 0.1803921569, 0.48235294117647065, 0.0078431373, 0.0078431373, 0.1725490196, 0.48627450980392156, 0.0078431373, 0.0078431373, 0.1568627451, 0.49019607843137253, 0.0078431373, 0.0078431373, 0.1490196078, 0.49411764705882355, 0.0078431373, 0.0078431373, 0.1333333333, 0.4980392156862745, 0.0078431373, 0.0078431373, 0.1254901961, 0.5019607843137255, 0.0078431373, 0.0078431373, 0.1176470588, 0.5058823529411764, 0.0078431373, 0.0078431373, 0.1019607843, 0.5098039215686274, 0.0078431373, 0.0078431373, 0.0941176471, 0.5137254901960784, 0.0078431373, 0.0078431373, 0.0784313725, 0.5176470588235295, 0.0078431373, 0.0078431373, 0.0705882353, 0.5215686274509804, 0.0078431373, 0.0078431373, 0.0549019608, 0.5254901960784314, 0.0078431373, 0.0078431373, 0.0470588235, 0.5294117647058824, 0.0235294118, 0.0078431373, 0.0392156863, 0.5333333333333333, 0.031372549, 0.0078431373, 0.0235294118, 0.5372549019607843, 0.0392156863, 0.0078431373, 0.0156862745, 0.5411764705882353, 0.0549019608, 0.0078431373, 0.0, 0.5450980392156862, 0.062745098, 0.0078431373, 0.0, 0.5490196078431373, 0.0705882353, 0.0078431373, 0.0, 0.5529411764705883, 0.0862745098, 0.0078431373, 0.0, 0.5568627450980392, 0.0941176471, 0.0078431373, 0.0, 0.5607843137254902, 0.1019607843, 0.0078431373, 0.0, 0.5647058823529412, 0.1098039216, 0.0078431373, 0.0, 0.5686274509803921, 0.1254901961, 0.0078431373, 0.0, 0.5725490196078431, 0.1333333333, 0.0078431373, 0.0, 0.5764705882352941, 0.1411764706, 0.0078431373, 0.0, 0.5803921568627451, 0.1568627451, 0.0078431373, 0.0, 0.5843137254901961, 0.1647058824, 0.0078431373, 0.0, 0.5882352941176471, 0.1725490196, 0.0078431373, 0.0, 0.592156862745098, 0.1882352941, 0.0078431373, 0.0, 0.596078431372549, 0.1960784314, 0.0078431373, 0.0, 0.6, 0.2039215686, 0.0078431373, 0.0, 0.6039215686274509, 0.2117647059, 0.0078431373, 0.0, 0.6078431372549019, 0.2274509804, 0.0078431373, 0.0, 0.611764705882353, 0.2352941176, 0.0078431373, 0.0, 0.615686274509804, 0.2431372549, 0.0078431373, 0.0, 0.6196078431372549, 0.2588235294, 0.0078431373, 0.0, 0.6235294117647059, 0.2666666667, 0.0078431373, 0.0, 0.6274509803921569, 0.2745098039, 0.0, 0.0, 0.6313725490196078, 0.2901960784, 0.0156862745, 0.0, 0.6352941176470588, 0.2980392157, 0.0235294118, 0.0, 0.6392156862745098, 0.3058823529, 0.0392156863, 0.0, 0.6431372549019608, 0.3137254902, 0.0470588235, 0.0, 0.6470588235294118, 0.3294117647, 0.0549019608, 0.0, 0.6509803921568628, 0.337254902, 0.0705882353, 0.0, 0.6549019607843137, 0.3450980392, 0.0784313725, 0.0, 0.6588235294117647, 0.3607843137, 0.0862745098, 0.0, 0.6627450980392157, 0.368627451, 0.1019607843, 0.0, 0.6666666666666666, 0.3764705882, 0.1098039216, 0.0, 0.6705882352941176, 0.3843137255, 0.1176470588, 0.0, 0.6745098039215687, 0.4, 0.1333333333, 0.0, 0.6784313725490196, 0.4078431373, 0.1411764706, 0.0, 0.6823529411764706, 0.4156862745, 0.1490196078, 0.0, 0.6862745098039216, 0.431372549, 0.1647058824, 0.0, 0.6901960784313725, 0.4392156863, 0.1725490196, 0.0, 0.6941176470588235, 0.4470588235, 0.1803921569, 0.0, 0.6980392156862745, 0.462745098, 0.1960784314, 0.0, 0.7019607843137254, 0.4705882353, 0.2039215686, 0.0, 0.7058823529411765, 0.4784313725, 0.2117647059, 0.0, 0.7098039215686275, 0.4862745098, 0.2274509804, 0.0, 0.7137254901960784, 0.5019607843, 0.2352941176, 0.0, 0.7176470588235294, 0.5098039216, 0.2431372549, 0.0, 0.7215686274509804, 0.5176470588, 0.2588235294, 0.0, 0.7254901960784313, 0.5333333333, 0.2666666667, 0.0, 0.7294117647058823, 0.5411764706, 0.2745098039, 0.0, 0.7333333333333333, 0.5490196078, 0.2901960784, 0.0, 0.7372549019607844, 0.5647058824, 0.2980392157, 0.0, 0.7411764705882353, 0.5725490196, 0.3058823529, 0.0, 0.7450980392156863, 0.5803921569, 0.3215686275, 0.0, 0.7490196078431373, 0.5882352941, 0.3294117647, 0.0, 0.7529411764705882, 0.6039215686, 0.337254902, 0.0, 0.7568627450980392, 0.6117647059, 0.3529411765, 0.0, 0.7607843137254902, 0.6196078431, 0.3607843137, 0.0, 0.7647058823529411, 0.6352941176, 0.368627451, 0.0, 0.7686274509803922, 0.6431372549, 0.3843137255, 0.0, 0.7725490196078432, 0.6509803922, 0.3921568627, 0.0, 0.7764705882352941, 0.6588235294, 0.4, 0.0, 0.7803921568627451, 0.6745098039, 0.4156862745, 0.0, 0.7843137254901961, 0.6823529412, 0.4235294118, 0.0, 0.788235294117647, 0.6901960784, 0.431372549, 0.0, 0.792156862745098, 0.7058823529, 0.4470588235, 0.0, 0.796078431372549, 0.7137254902, 0.4549019608, 0.0, 0.8, 0.7215686275, 0.462745098, 0.0, 0.803921568627451, 0.737254902, 0.4784313725, 0.0, 0.807843137254902, 0.7450980392, 0.4862745098, 0.0, 0.8117647058823529, 0.7529411765, 0.4941176471, 0.0, 0.8156862745098039, 0.7607843137, 0.5098039216, 0.0, 0.8196078431372549, 0.7764705882, 0.5176470588, 0.0, 0.8235294117647058, 0.7843137255, 0.5254901961, 0.0, 0.8274509803921568, 0.7921568627, 0.5411764706, 0.0, 0.8313725490196079, 0.8078431373, 0.5490196078, 0.0, 0.8352941176470589, 0.8156862745, 0.5568627451, 0.0, 0.8392156862745098, 0.8235294118, 0.5725490196, 0.0, 0.8431372549019608, 0.8392156863, 0.5803921569, 0.0, 0.8470588235294118, 0.8470588235, 0.5882352941, 0.0, 0.8509803921568627, 0.8549019608, 0.6039215686, 0.0, 0.8549019607843137, 0.862745098, 0.6117647059, 0.0, 0.8588235294117647, 0.8784313725, 0.6196078431, 0.0, 0.8627450980392157, 0.8862745098, 0.6352941176, 0.0, 0.8666666666666667, 0.8941176471, 0.6431372549, 0.0, 0.8705882352941177, 0.9098039216, 0.6509803922, 0.0, 0.8745098039215686, 0.9176470588, 0.6666666667, 0.0, 0.8784313725490196, 0.9254901961, 0.6745098039, 0.0, 0.8823529411764706, 0.9411764706, 0.6823529412, 0.0, 0.8862745098039215, 0.9490196078, 0.6980392157, 0.0, 0.8901960784313725, 0.9568627451, 0.7058823529, 0.0, 0.8941176470588236, 0.9647058824, 0.7137254902, 0.0, 0.8980392156862745, 0.9803921569, 0.7294117647, 0.0, 0.9019607843137255, 0.9882352941, 0.737254902, 0.0, 0.9058823529411765, 0.9960784314, 0.7450980392, 0.0, 0.9098039215686274, 0.9960784314, 0.7607843137, 0.0, 0.9137254901960784, 0.9960784314, 0.768627451, 0.0, 0.9176470588235294, 0.9960784314, 0.7764705882, 0.0, 0.9215686274509803, 0.9960784314, 0.7921568627, 0.0, 0.9254901960784314, 0.9960784314, 0.8, 0.0, 0.9294117647058824, 0.9960784314, 0.8078431373, 0.0, 0.9333333333333333, 0.9960784314, 0.8235294118, 0.0, 0.9372549019607843, 0.9960784314, 0.831372549, 0.0, 0.9411764705882354, 0.9960784314, 0.8392156863, 0.0, 0.9450980392156864, 0.9960784314, 0.8549019608, 0.0, 0.9490196078431372, 0.9960784314, 0.862745098, 0.0549019608, 0.9529411764705882, 0.9960784314, 0.8705882353, 0.1098039216, 0.9568627450980394, 0.9960784314, 0.8862745098, 0.1647058824, 0.9607843137254903, 0.9960784314, 0.8941176471, 0.2196078431, 0.9647058823529413, 0.9960784314, 0.9019607843, 0.2666666667, 0.9686274509803922, 0.9960784314, 0.9176470588, 0.3215686275, 0.9725490196078431, 0.9960784314, 0.9254901961, 0.3764705882, 0.9764705882352941, 0.9960784314, 0.9333333333, 0.431372549, 0.9803921568627451, 0.9960784314, 0.9490196078, 0.4862745098, 0.984313725490196, 0.9960784314, 0.9568627451, 0.5333333333, 0.9882352941176471, 0.9960784314, 0.9647058824, 0.5882352941, 0.9921568627450981, 0.9960784314, 0.9803921569, 0.6431372549, 0.996078431372549, 0.9960784314, 0.9882352941, 0.6980392157, 1.0, 0.9960784314, 0.9960784314, 0.7450980392],
  description: 'Perfusion'
}, {
  ColorSpace: 'RGB',
  Name: 'rainbow_2',
  RGBPoints: [0.0, 0.0, 0.0, 0.0, 0.00392156862745098, 0.0156862745, 0.0, 0.0117647059, 0.00784313725490196, 0.0352941176, 0.0, 0.0274509804, 0.011764705882352941, 0.0509803922, 0.0, 0.0392156863, 0.01568627450980392, 0.0705882353, 0.0, 0.0549019608, 0.0196078431372549, 0.0862745098, 0.0, 0.0745098039, 0.023529411764705882, 0.1058823529, 0.0, 0.0901960784, 0.027450980392156862, 0.1215686275, 0.0, 0.1098039216, 0.03137254901960784, 0.1411764706, 0.0, 0.1254901961, 0.03529411764705882, 0.1568627451, 0.0, 0.1490196078, 0.0392156862745098, 0.1764705882, 0.0, 0.168627451, 0.043137254901960784, 0.1960784314, 0.0, 0.1882352941, 0.047058823529411764, 0.2117647059, 0.0, 0.2078431373, 0.050980392156862744, 0.2274509804, 0.0, 0.231372549, 0.054901960784313725, 0.2392156863, 0.0, 0.2470588235, 0.05882352941176471, 0.2509803922, 0.0, 0.2666666667, 0.06274509803921569, 0.2666666667, 0.0, 0.2823529412, 0.06666666666666667, 0.2705882353, 0.0, 0.3019607843, 0.07058823529411765, 0.2823529412, 0.0, 0.3176470588, 0.07450980392156863, 0.2901960784, 0.0, 0.337254902, 0.0784313725490196, 0.3019607843, 0.0, 0.3568627451, 0.08235294117647059, 0.3098039216, 0.0, 0.3725490196, 0.08627450980392157, 0.3137254902, 0.0, 0.3921568627, 0.09019607843137255, 0.3215686275, 0.0, 0.4078431373, 0.09411764705882353, 0.3254901961, 0.0, 0.4274509804, 0.09803921568627451, 0.3333333333, 0.0, 0.4431372549, 0.10196078431372549, 0.3294117647, 0.0, 0.462745098, 0.10588235294117647, 0.337254902, 0.0, 0.4784313725, 0.10980392156862745, 0.3411764706, 0.0, 0.4980392157, 0.11372549019607843, 0.3450980392, 0.0, 0.5176470588, 0.11764705882352942, 0.337254902, 0.0, 0.5333333333, 0.12156862745098039, 0.3411764706, 0.0, 0.5529411765, 0.12549019607843137, 0.3411764706, 0.0, 0.568627451, 0.12941176470588237, 0.3411764706, 0.0, 0.5882352941, 0.13333333333333333, 0.3333333333, 0.0, 0.6039215686, 0.13725490196078433, 0.3294117647, 0.0, 0.6235294118, 0.1411764705882353, 0.3294117647, 0.0, 0.6392156863, 0.1450980392156863, 0.3294117647, 0.0, 0.6588235294, 0.14901960784313725, 0.3254901961, 0.0, 0.6784313725, 0.15294117647058825, 0.3098039216, 0.0, 0.6941176471, 0.1568627450980392, 0.3058823529, 0.0, 0.7137254902, 0.1607843137254902, 0.3019607843, 0.0, 0.7294117647, 0.16470588235294117, 0.2980392157, 0.0, 0.7490196078, 0.16862745098039217, 0.2784313725, 0.0, 0.7647058824, 0.17254901960784313, 0.2745098039, 0.0, 0.7843137255, 0.17647058823529413, 0.2666666667, 0.0, 0.8, 0.1803921568627451, 0.2588235294, 0.0, 0.8196078431, 0.1843137254901961, 0.2352941176, 0.0, 0.8392156863, 0.18823529411764706, 0.2274509804, 0.0, 0.8549019608, 0.19215686274509805, 0.2156862745, 0.0, 0.8745098039, 0.19607843137254902, 0.2078431373, 0.0, 0.8901960784, 0.2, 0.1803921569, 0.0, 0.9098039216, 0.20392156862745098, 0.168627451, 0.0, 0.9254901961, 0.20784313725490197, 0.1568627451, 0.0, 0.9450980392, 0.21176470588235294, 0.1411764706, 0.0, 0.9607843137, 0.21568627450980393, 0.1294117647, 0.0, 0.9803921569, 0.2196078431372549, 0.0980392157, 0.0, 1.0, 0.2235294117647059, 0.0823529412, 0.0, 1.0, 0.22745098039215686, 0.062745098, 0.0, 1.0, 0.23137254901960785, 0.0470588235, 0.0, 1.0, 0.23529411764705885, 0.0156862745, 0.0, 1.0, 0.23921568627450984, 0.0, 0.0, 1.0, 0.24313725490196078, 0.0, 0.0156862745, 1.0, 0.24705882352941178, 0.0, 0.031372549, 1.0, 0.25098039215686274, 0.0, 0.062745098, 1.0, 0.2549019607843137, 0.0, 0.0823529412, 1.0, 0.25882352941176473, 0.0, 0.0980392157, 1.0, 0.2627450980392157, 0.0, 0.1137254902, 1.0, 0.26666666666666666, 0.0, 0.1490196078, 1.0, 0.27058823529411763, 0.0, 0.1647058824, 1.0, 0.27450980392156865, 0.0, 0.1803921569, 1.0, 0.2784313725490196, 0.0, 0.2, 1.0, 0.2823529411764706, 0.0, 0.2156862745, 1.0, 0.28627450980392155, 0.0, 0.2470588235, 1.0, 0.2901960784313726, 0.0, 0.262745098, 1.0, 0.29411764705882354, 0.0, 0.2823529412, 1.0, 0.2980392156862745, 0.0, 0.2980392157, 1.0, 0.30196078431372547, 0.0, 0.3294117647, 1.0, 0.3058823529411765, 0.0, 0.3490196078, 1.0, 0.30980392156862746, 0.0, 0.3647058824, 1.0, 0.3137254901960784, 0.0, 0.3803921569, 1.0, 0.3176470588235294, 0.0, 0.4156862745, 1.0, 0.3215686274509804, 0.0, 0.431372549, 1.0, 0.3254901960784314, 0.0, 0.4470588235, 1.0, 0.32941176470588235, 0.0, 0.4666666667, 1.0, 0.3333333333333333, 0.0, 0.4980392157, 1.0, 0.33725490196078434, 0.0, 0.5137254902, 1.0, 0.3411764705882353, 0.0, 0.5294117647, 1.0, 0.34509803921568627, 0.0, 0.5490196078, 1.0, 0.34901960784313724, 0.0, 0.5647058824, 1.0, 0.35294117647058826, 0.0, 0.5960784314, 1.0, 0.3568627450980392, 0.0, 0.6156862745, 1.0, 0.3607843137254902, 0.0, 0.631372549, 1.0, 0.36470588235294116, 0.0, 0.6470588235, 1.0, 0.3686274509803922, 0.0, 0.6823529412, 1.0, 0.37254901960784315, 0.0, 0.6980392157, 1.0, 0.3764705882352941, 0.0, 0.7137254902, 1.0, 0.3803921568627451, 0.0, 0.7333333333, 1.0, 0.3843137254901961, 0.0, 0.7647058824, 1.0, 0.38823529411764707, 0.0, 0.7803921569, 1.0, 0.39215686274509803, 0.0, 0.7960784314, 1.0, 0.396078431372549, 0.0, 0.8156862745, 1.0, 0.4, 0.0, 0.8470588235, 1.0, 0.403921568627451, 0.0, 0.862745098, 1.0, 0.40784313725490196, 0.0, 0.8823529412, 1.0, 0.4117647058823529, 0.0, 0.8980392157, 1.0, 0.41568627450980394, 0.0, 0.9137254902, 1.0, 0.4196078431372549, 0.0, 0.9490196078, 1.0, 0.4235294117647059, 0.0, 0.9647058824, 1.0, 0.42745098039215684, 0.0, 0.9803921569, 1.0, 0.43137254901960786, 0.0, 1.0, 1.0, 0.43529411764705883, 0.0, 1.0, 0.9647058824, 0.4392156862745098, 0.0, 1.0, 0.9490196078, 0.44313725490196076, 0.0, 1.0, 0.9333333333, 0.4470588235294118, 0.0, 1.0, 0.9137254902, 0.45098039215686275, 0.0, 1.0, 0.8823529412, 0.4549019607843137, 0.0, 1.0, 0.862745098, 0.4588235294117647, 0.0, 1.0, 0.8470588235, 0.4627450980392157, 0.0, 1.0, 0.831372549, 0.4666666666666667, 0.0, 1.0, 0.7960784314, 0.4705882352941177, 0.0, 1.0, 0.7803921569, 0.4745098039215686, 0.0, 1.0, 0.7647058824, 0.4784313725490197, 0.0, 1.0, 0.7490196078, 0.48235294117647065, 0.0, 1.0, 0.7333333333, 0.48627450980392156, 0.0, 1.0, 0.6980392157, 0.49019607843137253, 0.0, 1.0, 0.6823529412, 0.49411764705882355, 0.0, 1.0, 0.6666666667, 0.4980392156862745, 0.0, 1.0, 0.6470588235, 0.5019607843137255, 0.0, 1.0, 0.6156862745, 0.5058823529411764, 0.0, 1.0, 0.5960784314, 0.5098039215686274, 0.0, 1.0, 0.5803921569, 0.5137254901960784, 0.0, 1.0, 0.5647058824, 0.5176470588235295, 0.0, 1.0, 0.5294117647, 0.5215686274509804, 0.0, 1.0, 0.5137254902, 0.5254901960784314, 0.0, 1.0, 0.4980392157, 0.5294117647058824, 0.0, 1.0, 0.4823529412, 0.5333333333333333, 0.0, 1.0, 0.4470588235, 0.5372549019607843, 0.0, 1.0, 0.431372549, 0.5411764705882353, 0.0, 1.0, 0.4156862745, 0.5450980392156862, 0.0, 1.0, 0.4, 0.5490196078431373, 0.0, 1.0, 0.3803921569, 0.5529411764705883, 0.0, 1.0, 0.3490196078, 0.5568627450980392, 0.0, 1.0, 0.3294117647, 0.5607843137254902, 0.0, 1.0, 0.3137254902, 0.5647058823529412, 0.0, 1.0, 0.2980392157, 0.5686274509803921, 0.0, 1.0, 0.262745098, 0.5725490196078431, 0.0, 1.0, 0.2470588235, 0.5764705882352941, 0.0, 1.0, 0.231372549, 0.5803921568627451, 0.0, 1.0, 0.2156862745, 0.5843137254901961, 0.0, 1.0, 0.1803921569, 0.5882352941176471, 0.0, 1.0, 0.1647058824, 0.592156862745098, 0.0, 1.0, 0.1490196078, 0.596078431372549, 0.0, 1.0, 0.1333333333, 0.6, 0.0, 1.0, 0.0980392157, 0.6039215686274509, 0.0, 1.0, 0.0823529412, 0.6078431372549019, 0.0, 1.0, 0.062745098, 0.611764705882353, 0.0, 1.0, 0.0470588235, 0.615686274509804, 0.0, 1.0, 0.031372549, 0.6196078431372549, 0.0, 1.0, 0.0, 0.6235294117647059, 0.0156862745, 1.0, 0.0, 0.6274509803921569, 0.031372549, 1.0, 0.0, 0.6313725490196078, 0.0470588235, 1.0, 0.0, 0.6352941176470588, 0.0823529412, 1.0, 0.0, 0.6392156862745098, 0.0980392157, 1.0, 0.0, 0.6431372549019608, 0.1137254902, 1.0, 0.0, 0.6470588235294118, 0.1294117647, 1.0, 0.0, 0.6509803921568628, 0.1647058824, 1.0, 0.0, 0.6549019607843137, 0.1803921569, 1.0, 0.0, 0.6588235294117647, 0.2, 1.0, 0.0, 0.6627450980392157, 0.2156862745, 1.0, 0.0, 0.6666666666666666, 0.2470588235, 1.0, 0.0, 0.6705882352941176, 0.262745098, 1.0, 0.0, 0.6745098039215687, 0.2823529412, 1.0, 0.0, 0.6784313725490196, 0.2980392157, 1.0, 0.0, 0.6823529411764706, 0.3137254902, 1.0, 0.0, 0.6862745098039216, 0.3490196078, 1.0, 0.0, 0.6901960784313725, 0.3647058824, 1.0, 0.0, 0.6941176470588235, 0.3803921569, 1.0, 0.0, 0.6980392156862745, 0.3960784314, 1.0, 0.0, 0.7019607843137254, 0.431372549, 1.0, 0.0, 0.7058823529411765, 0.4470588235, 1.0, 0.0, 0.7098039215686275, 0.4666666667, 1.0, 0.0, 0.7137254901960784, 0.4823529412, 1.0, 0.0, 0.7176470588235294, 0.5137254902, 1.0, 0.0, 0.7215686274509804, 0.5294117647, 1.0, 0.0, 0.7254901960784313, 0.5490196078, 1.0, 0.0, 0.7294117647058823, 0.5647058824, 1.0, 0.0, 0.7333333333333333, 0.6, 1.0, 0.0, 0.7372549019607844, 0.6156862745, 1.0, 0.0, 0.7411764705882353, 0.631372549, 1.0, 0.0, 0.7450980392156863, 0.6470588235, 1.0, 0.0, 0.7490196078431373, 0.662745098, 1.0, 0.0, 0.7529411764705882, 0.6980392157, 1.0, 0.0, 0.7568627450980392, 0.7137254902, 1.0, 0.0, 0.7607843137254902, 0.7333333333, 1.0, 0.0, 0.7647058823529411, 0.7490196078, 1.0, 0.0, 0.7686274509803922, 0.7803921569, 1.0, 0.0, 0.7725490196078432, 0.7960784314, 1.0, 0.0, 0.7764705882352941, 0.8156862745, 1.0, 0.0, 0.7803921568627451, 0.831372549, 1.0, 0.0, 0.7843137254901961, 0.8666666667, 1.0, 0.0, 0.788235294117647, 0.8823529412, 1.0, 0.0, 0.792156862745098, 0.8980392157, 1.0, 0.0, 0.796078431372549, 0.9137254902, 1.0, 0.0, 0.8, 0.9490196078, 1.0, 0.0, 0.803921568627451, 0.9647058824, 1.0, 0.0, 0.807843137254902, 0.9803921569, 1.0, 0.0, 0.8117647058823529, 1.0, 1.0, 0.0, 0.8156862745098039, 1.0, 0.9803921569, 0.0, 0.8196078431372549, 1.0, 0.9490196078, 0.0, 0.8235294117647058, 1.0, 0.9333333333, 0.0, 0.8274509803921568, 1.0, 0.9137254902, 0.0, 0.8313725490196079, 1.0, 0.8980392157, 0.0, 0.8352941176470589, 1.0, 0.8666666667, 0.0, 0.8392156862745098, 1.0, 0.8470588235, 0.0, 0.8431372549019608, 1.0, 0.831372549, 0.0, 0.8470588235294118, 1.0, 0.8156862745, 0.0, 0.8509803921568627, 1.0, 0.7803921569, 0.0, 0.8549019607843137, 1.0, 0.7647058824, 0.0, 0.8588235294117647, 1.0, 0.7490196078, 0.0, 0.8627450980392157, 1.0, 0.7333333333, 0.0, 0.8666666666666667, 1.0, 0.6980392157, 0.0, 0.8705882352941177, 1.0, 0.6823529412, 0.0, 0.8745098039215686, 1.0, 0.6666666667, 0.0, 0.8784313725490196, 1.0, 0.6470588235, 0.0, 0.8823529411764706, 1.0, 0.631372549, 0.0, 0.8862745098039215, 1.0, 0.6, 0.0, 0.8901960784313725, 1.0, 0.5803921569, 0.0, 0.8941176470588236, 1.0, 0.5647058824, 0.0, 0.8980392156862745, 1.0, 0.5490196078, 0.0, 0.9019607843137255, 1.0, 0.5137254902, 0.0, 0.9058823529411765, 1.0, 0.4980392157, 0.0, 0.9098039215686274, 1.0, 0.4823529412, 0.0, 0.9137254901960784, 1.0, 0.4666666667, 0.0, 0.9176470588235294, 1.0, 0.431372549, 0.0, 0.9215686274509803, 1.0, 0.4156862745, 0.0, 0.9254901960784314, 1.0, 0.4, 0.0, 0.9294117647058824, 1.0, 0.3803921569, 0.0, 0.9333333333333333, 1.0, 0.3490196078, 0.0, 0.9372549019607843, 1.0, 0.3333333333, 0.0, 0.9411764705882354, 1.0, 0.3137254902, 0.0, 0.9450980392156864, 1.0, 0.2980392157, 0.0, 0.9490196078431372, 1.0, 0.2823529412, 0.0, 0.9529411764705882, 1.0, 0.2470588235, 0.0, 0.9568627450980394, 1.0, 0.231372549, 0.0, 0.9607843137254903, 1.0, 0.2156862745, 0.0, 0.9647058823529413, 1.0, 0.2, 0.0, 0.9686274509803922, 1.0, 0.1647058824, 0.0, 0.9725490196078431, 1.0, 0.1490196078, 0.0, 0.9764705882352941, 1.0, 0.1333333333, 0.0, 0.9803921568627451, 1.0, 0.1137254902, 0.0, 0.984313725490196, 1.0, 0.0823529412, 0.0, 0.9882352941176471, 1.0, 0.0666666667, 0.0, 0.9921568627450981, 1.0, 0.0470588235, 0.0, 0.996078431372549, 1.0, 0.031372549, 0.0, 1.0, 1.0, 0.0, 0.0],
  description: 'Rainbow'
}, {
  ColorSpace: 'RGB',
  Name: 'suv',
  RGBPoints: [0.0, 1.0, 1.0, 1.0, 0.00392156862745098, 1.0, 1.0, 1.0, 0.00784313725490196, 1.0, 1.0, 1.0, 0.011764705882352941, 1.0, 1.0, 1.0, 0.01568627450980392, 1.0, 1.0, 1.0, 0.0196078431372549, 1.0, 1.0, 1.0, 0.023529411764705882, 1.0, 1.0, 1.0, 0.027450980392156862, 1.0, 1.0, 1.0, 0.03137254901960784, 1.0, 1.0, 1.0, 0.03529411764705882, 1.0, 1.0, 1.0, 0.0392156862745098, 1.0, 1.0, 1.0, 0.043137254901960784, 1.0, 1.0, 1.0, 0.047058823529411764, 1.0, 1.0, 1.0, 0.050980392156862744, 1.0, 1.0, 1.0, 0.054901960784313725, 1.0, 1.0, 1.0, 0.05882352941176471, 1.0, 1.0, 1.0, 0.06274509803921569, 1.0, 1.0, 1.0, 0.06666666666666667, 1.0, 1.0, 1.0, 0.07058823529411765, 1.0, 1.0, 1.0, 0.07450980392156863, 1.0, 1.0, 1.0, 0.0784313725490196, 1.0, 1.0, 1.0, 0.08235294117647059, 1.0, 1.0, 1.0, 0.08627450980392157, 1.0, 1.0, 1.0, 0.09019607843137255, 1.0, 1.0, 1.0, 0.09411764705882353, 1.0, 1.0, 1.0, 0.09803921568627451, 1.0, 1.0, 1.0, 0.10196078431372549, 0.737254902, 0.737254902, 0.737254902, 0.10588235294117647, 0.737254902, 0.737254902, 0.737254902, 0.10980392156862745, 0.737254902, 0.737254902, 0.737254902, 0.11372549019607843, 0.737254902, 0.737254902, 0.737254902, 0.11764705882352942, 0.737254902, 0.737254902, 0.737254902, 0.12156862745098039, 0.737254902, 0.737254902, 0.737254902, 0.12549019607843137, 0.737254902, 0.737254902, 0.737254902, 0.12941176470588237, 0.737254902, 0.737254902, 0.737254902, 0.13333333333333333, 0.737254902, 0.737254902, 0.737254902, 0.13725490196078433, 0.737254902, 0.737254902, 0.737254902, 0.1411764705882353, 0.737254902, 0.737254902, 0.737254902, 0.1450980392156863, 0.737254902, 0.737254902, 0.737254902, 0.14901960784313725, 0.737254902, 0.737254902, 0.737254902, 0.15294117647058825, 0.737254902, 0.737254902, 0.737254902, 0.1568627450980392, 0.737254902, 0.737254902, 0.737254902, 0.1607843137254902, 0.737254902, 0.737254902, 0.737254902, 0.16470588235294117, 0.737254902, 0.737254902, 0.737254902, 0.16862745098039217, 0.737254902, 0.737254902, 0.737254902, 0.17254901960784313, 0.737254902, 0.737254902, 0.737254902, 0.17647058823529413, 0.737254902, 0.737254902, 0.737254902, 0.1803921568627451, 0.737254902, 0.737254902, 0.737254902, 0.1843137254901961, 0.737254902, 0.737254902, 0.737254902, 0.18823529411764706, 0.737254902, 0.737254902, 0.737254902, 0.19215686274509805, 0.737254902, 0.737254902, 0.737254902, 0.19607843137254902, 0.737254902, 0.737254902, 0.737254902, 0.2, 0.737254902, 0.737254902, 0.737254902, 0.20392156862745098, 0.431372549, 0.0, 0.568627451, 0.20784313725490197, 0.431372549, 0.0, 0.568627451, 0.21176470588235294, 0.431372549, 0.0, 0.568627451, 0.21568627450980393, 0.431372549, 0.0, 0.568627451, 0.2196078431372549, 0.431372549, 0.0, 0.568627451, 0.2235294117647059, 0.431372549, 0.0, 0.568627451, 0.22745098039215686, 0.431372549, 0.0, 0.568627451, 0.23137254901960785, 0.431372549, 0.0, 0.568627451, 0.23529411764705885, 0.431372549, 0.0, 0.568627451, 0.23921568627450984, 0.431372549, 0.0, 0.568627451, 0.24313725490196078, 0.431372549, 0.0, 0.568627451, 0.24705882352941178, 0.431372549, 0.0, 0.568627451, 0.25098039215686274, 0.431372549, 0.0, 0.568627451, 0.2549019607843137, 0.431372549, 0.0, 0.568627451, 0.25882352941176473, 0.431372549, 0.0, 0.568627451, 0.2627450980392157, 0.431372549, 0.0, 0.568627451, 0.26666666666666666, 0.431372549, 0.0, 0.568627451, 0.27058823529411763, 0.431372549, 0.0, 0.568627451, 0.27450980392156865, 0.431372549, 0.0, 0.568627451, 0.2784313725490196, 0.431372549, 0.0, 0.568627451, 0.2823529411764706, 0.431372549, 0.0, 0.568627451, 0.28627450980392155, 0.431372549, 0.0, 0.568627451, 0.2901960784313726, 0.431372549, 0.0, 0.568627451, 0.29411764705882354, 0.431372549, 0.0, 0.568627451, 0.2980392156862745, 0.431372549, 0.0, 0.568627451, 0.30196078431372547, 0.431372549, 0.0, 0.568627451, 0.3058823529411765, 0.2509803922, 0.3333333333, 0.6509803922, 0.30980392156862746, 0.2509803922, 0.3333333333, 0.6509803922, 0.3137254901960784, 0.2509803922, 0.3333333333, 0.6509803922, 0.3176470588235294, 0.2509803922, 0.3333333333, 0.6509803922, 0.3215686274509804, 0.2509803922, 0.3333333333, 0.6509803922, 0.3254901960784314, 0.2509803922, 0.3333333333, 0.6509803922, 0.32941176470588235, 0.2509803922, 0.3333333333, 0.6509803922, 0.3333333333333333, 0.2509803922, 0.3333333333, 0.6509803922, 0.33725490196078434, 0.2509803922, 0.3333333333, 0.6509803922, 0.3411764705882353, 0.2509803922, 0.3333333333, 0.6509803922, 0.34509803921568627, 0.2509803922, 0.3333333333, 0.6509803922, 0.34901960784313724, 0.2509803922, 0.3333333333, 0.6509803922, 0.35294117647058826, 0.2509803922, 0.3333333333, 0.6509803922, 0.3568627450980392, 0.2509803922, 0.3333333333, 0.6509803922, 0.3607843137254902, 0.2509803922, 0.3333333333, 0.6509803922, 0.36470588235294116, 0.2509803922, 0.3333333333, 0.6509803922, 0.3686274509803922, 0.2509803922, 0.3333333333, 0.6509803922, 0.37254901960784315, 0.2509803922, 0.3333333333, 0.6509803922, 0.3764705882352941, 0.2509803922, 0.3333333333, 0.6509803922, 0.3803921568627451, 0.2509803922, 0.3333333333, 0.6509803922, 0.3843137254901961, 0.2509803922, 0.3333333333, 0.6509803922, 0.38823529411764707, 0.2509803922, 0.3333333333, 0.6509803922, 0.39215686274509803, 0.2509803922, 0.3333333333, 0.6509803922, 0.396078431372549, 0.2509803922, 0.3333333333, 0.6509803922, 0.4, 0.2509803922, 0.3333333333, 0.6509803922, 0.403921568627451, 0.2509803922, 0.3333333333, 0.6509803922, 0.40784313725490196, 0.0, 0.8, 1.0, 0.4117647058823529, 0.0, 0.8, 1.0, 0.41568627450980394, 0.0, 0.8, 1.0, 0.4196078431372549, 0.0, 0.8, 1.0, 0.4235294117647059, 0.0, 0.8, 1.0, 0.42745098039215684, 0.0, 0.8, 1.0, 0.43137254901960786, 0.0, 0.8, 1.0, 0.43529411764705883, 0.0, 0.8, 1.0, 0.4392156862745098, 0.0, 0.8, 1.0, 0.44313725490196076, 0.0, 0.8, 1.0, 0.4470588235294118, 0.0, 0.8, 1.0, 0.45098039215686275, 0.0, 0.8, 1.0, 0.4549019607843137, 0.0, 0.8, 1.0, 0.4588235294117647, 0.0, 0.8, 1.0, 0.4627450980392157, 0.0, 0.8, 1.0, 0.4666666666666667, 0.0, 0.8, 1.0, 0.4705882352941177, 0.0, 0.8, 1.0, 0.4745098039215686, 0.0, 0.8, 1.0, 0.4784313725490197, 0.0, 0.8, 1.0, 0.48235294117647065, 0.0, 0.8, 1.0, 0.48627450980392156, 0.0, 0.8, 1.0, 0.49019607843137253, 0.0, 0.8, 1.0, 0.49411764705882355, 0.0, 0.8, 1.0, 0.4980392156862745, 0.0, 0.8, 1.0, 0.5019607843137255, 0.0, 0.8, 1.0, 0.5058823529411764, 0.0, 0.6666666667, 0.5333333333, 0.5098039215686274, 0.0, 0.6666666667, 0.5333333333, 0.5137254901960784, 0.0, 0.6666666667, 0.5333333333, 0.5176470588235295, 0.0, 0.6666666667, 0.5333333333, 0.5215686274509804, 0.0, 0.6666666667, 0.5333333333, 0.5254901960784314, 0.0, 0.6666666667, 0.5333333333, 0.5294117647058824, 0.0, 0.6666666667, 0.5333333333, 0.5333333333333333, 0.0, 0.6666666667, 0.5333333333, 0.5372549019607843, 0.0, 0.6666666667, 0.5333333333, 0.5411764705882353, 0.0, 0.6666666667, 0.5333333333, 0.5450980392156862, 0.0, 0.6666666667, 0.5333333333, 0.5490196078431373, 0.0, 0.6666666667, 0.5333333333, 0.5529411764705883, 0.0, 0.6666666667, 0.5333333333, 0.5568627450980392, 0.0, 0.6666666667, 0.5333333333, 0.5607843137254902, 0.0, 0.6666666667, 0.5333333333, 0.5647058823529412, 0.0, 0.6666666667, 0.5333333333, 0.5686274509803921, 0.0, 0.6666666667, 0.5333333333, 0.5725490196078431, 0.0, 0.6666666667, 0.5333333333, 0.5764705882352941, 0.0, 0.6666666667, 0.5333333333, 0.5803921568627451, 0.0, 0.6666666667, 0.5333333333, 0.5843137254901961, 0.0, 0.6666666667, 0.5333333333, 0.5882352941176471, 0.0, 0.6666666667, 0.5333333333, 0.592156862745098, 0.0, 0.6666666667, 0.5333333333, 0.596078431372549, 0.0, 0.6666666667, 0.5333333333, 0.6, 0.0, 0.6666666667, 0.5333333333, 0.6039215686274509, 0.0, 0.6666666667, 0.5333333333, 0.6078431372549019, 0.4, 1.0, 0.4, 0.611764705882353, 0.4, 1.0, 0.4, 0.615686274509804, 0.4, 1.0, 0.4, 0.6196078431372549, 0.4, 1.0, 0.4, 0.6235294117647059, 0.4, 1.0, 0.4, 0.6274509803921569, 0.4, 1.0, 0.4, 0.6313725490196078, 0.4, 1.0, 0.4, 0.6352941176470588, 0.4, 1.0, 0.4, 0.6392156862745098, 0.4, 1.0, 0.4, 0.6431372549019608, 0.4, 1.0, 0.4, 0.6470588235294118, 0.4, 1.0, 0.4, 0.6509803921568628, 0.4, 1.0, 0.4, 0.6549019607843137, 0.4, 1.0, 0.4, 0.6588235294117647, 0.4, 1.0, 0.4, 0.6627450980392157, 0.4, 1.0, 0.4, 0.6666666666666666, 0.4, 1.0, 0.4, 0.6705882352941176, 0.4, 1.0, 0.4, 0.6745098039215687, 0.4, 1.0, 0.4, 0.6784313725490196, 0.4, 1.0, 0.4, 0.6823529411764706, 0.4, 1.0, 0.4, 0.6862745098039216, 0.4, 1.0, 0.4, 0.6901960784313725, 0.4, 1.0, 0.4, 0.6941176470588235, 0.4, 1.0, 0.4, 0.6980392156862745, 0.4, 1.0, 0.4, 0.7019607843137254, 0.4, 1.0, 0.4, 0.7058823529411765, 1.0, 0.9490196078, 0.0, 0.7098039215686275, 1.0, 0.9490196078, 0.0, 0.7137254901960784, 1.0, 0.9490196078, 0.0, 0.7176470588235294, 1.0, 0.9490196078, 0.0, 0.7215686274509804, 1.0, 0.9490196078, 0.0, 0.7254901960784313, 1.0, 0.9490196078, 0.0, 0.7294117647058823, 1.0, 0.9490196078, 0.0, 0.7333333333333333, 1.0, 0.9490196078, 0.0, 0.7372549019607844, 1.0, 0.9490196078, 0.0, 0.7411764705882353, 1.0, 0.9490196078, 0.0, 0.7450980392156863, 1.0, 0.9490196078, 0.0, 0.7490196078431373, 1.0, 0.9490196078, 0.0, 0.7529411764705882, 1.0, 0.9490196078, 0.0, 0.7568627450980392, 1.0, 0.9490196078, 0.0, 0.7607843137254902, 1.0, 0.9490196078, 0.0, 0.7647058823529411, 1.0, 0.9490196078, 0.0, 0.7686274509803922, 1.0, 0.9490196078, 0.0, 0.7725490196078432, 1.0, 0.9490196078, 0.0, 0.7764705882352941, 1.0, 0.9490196078, 0.0, 0.7803921568627451, 1.0, 0.9490196078, 0.0, 0.7843137254901961, 1.0, 0.9490196078, 0.0, 0.788235294117647, 1.0, 0.9490196078, 0.0, 0.792156862745098, 1.0, 0.9490196078, 0.0, 0.796078431372549, 1.0, 0.9490196078, 0.0, 0.8, 1.0, 0.9490196078, 0.0, 0.803921568627451, 1.0, 0.9490196078, 0.0, 0.807843137254902, 0.9490196078, 0.6509803922, 0.2509803922, 0.8117647058823529, 0.9490196078, 0.6509803922, 0.2509803922, 0.8156862745098039, 0.9490196078, 0.6509803922, 0.2509803922, 0.8196078431372549, 0.9490196078, 0.6509803922, 0.2509803922, 0.8235294117647058, 0.9490196078, 0.6509803922, 0.2509803922, 0.8274509803921568, 0.9490196078, 0.6509803922, 0.2509803922, 0.8313725490196079, 0.9490196078, 0.6509803922, 0.2509803922, 0.8352941176470589, 0.9490196078, 0.6509803922, 0.2509803922, 0.8392156862745098, 0.9490196078, 0.6509803922, 0.2509803922, 0.8431372549019608, 0.9490196078, 0.6509803922, 0.2509803922, 0.8470588235294118, 0.9490196078, 0.6509803922, 0.2509803922, 0.8509803921568627, 0.9490196078, 0.6509803922, 0.2509803922, 0.8549019607843137, 0.9490196078, 0.6509803922, 0.2509803922, 0.8588235294117647, 0.9490196078, 0.6509803922, 0.2509803922, 0.8627450980392157, 0.9490196078, 0.6509803922, 0.2509803922, 0.8666666666666667, 0.9490196078, 0.6509803922, 0.2509803922, 0.8705882352941177, 0.9490196078, 0.6509803922, 0.2509803922, 0.8745098039215686, 0.9490196078, 0.6509803922, 0.2509803922, 0.8784313725490196, 0.9490196078, 0.6509803922, 0.2509803922, 0.8823529411764706, 0.9490196078, 0.6509803922, 0.2509803922, 0.8862745098039215, 0.9490196078, 0.6509803922, 0.2509803922, 0.8901960784313725, 0.9490196078, 0.6509803922, 0.2509803922, 0.8941176470588236, 0.9490196078, 0.6509803922, 0.2509803922, 0.8980392156862745, 0.9490196078, 0.6509803922, 0.2509803922, 0.9019607843137255, 0.9490196078, 0.6509803922, 0.2509803922, 0.9058823529411765, 0.9490196078, 0.6509803922, 0.2509803922, 0.9098039215686274, 1.0, 0.0, 0.0, 0.9137254901960784, 1.0, 0.0, 0.0, 0.9176470588235294, 1.0, 0.0, 0.0, 0.9215686274509803, 1.0, 0.0, 0.0, 0.9254901960784314, 1.0, 0.0, 0.0, 0.9294117647058824, 1.0, 0.0, 0.0, 0.9333333333333333, 1.0, 0.0, 0.0, 0.9372549019607843, 1.0, 0.0, 0.0, 0.9411764705882354, 1.0, 0.0, 0.0, 0.9450980392156864, 1.0, 0.0, 0.0, 0.9490196078431372, 1.0, 0.0, 0.0, 0.9529411764705882, 1.0, 0.0, 0.0, 0.9568627450980394, 1.0, 0.0, 0.0, 0.9607843137254903, 1.0, 0.0, 0.0, 0.9647058823529413, 1.0, 0.0, 0.0, 0.9686274509803922, 1.0, 0.0, 0.0, 0.9725490196078431, 1.0, 0.0, 0.0, 0.9764705882352941, 1.0, 0.0, 0.0, 0.9803921568627451, 1.0, 0.0, 0.0, 0.984313725490196, 1.0, 0.0, 0.0, 0.9882352941176471, 1.0, 0.0, 0.0, 0.9921568627450981, 1.0, 0.0, 0.0, 0.996078431372549, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0],
  description: 'SUV'
}, {
  ColorSpace: 'RGB',
  Name: 'ge_256',
  RGBPoints: [0.0, 0.0039215686, 0.0078431373, 0.0078431373, 0.00392156862745098, 0.0039215686, 0.0078431373, 0.0078431373, 0.00784313725490196, 0.0039215686, 0.0078431373, 0.0117647059, 0.011764705882352941, 0.0039215686, 0.0117647059, 0.0156862745, 0.01568627450980392, 0.0039215686, 0.0117647059, 0.0196078431, 0.0196078431372549, 0.0039215686, 0.0156862745, 0.0235294118, 0.023529411764705882, 0.0039215686, 0.0156862745, 0.0274509804, 0.027450980392156862, 0.0039215686, 0.0196078431, 0.031372549, 0.03137254901960784, 0.0039215686, 0.0196078431, 0.0352941176, 0.03529411764705882, 0.0039215686, 0.0235294118, 0.0392156863, 0.0392156862745098, 0.0039215686, 0.0235294118, 0.0431372549, 0.043137254901960784, 0.0039215686, 0.0274509804, 0.0470588235, 0.047058823529411764, 0.0039215686, 0.0274509804, 0.0509803922, 0.050980392156862744, 0.0039215686, 0.031372549, 0.0549019608, 0.054901960784313725, 0.0039215686, 0.031372549, 0.0588235294, 0.05882352941176471, 0.0039215686, 0.0352941176, 0.062745098, 0.06274509803921569, 0.0039215686, 0.0352941176, 0.0666666667, 0.06666666666666667, 0.0039215686, 0.0392156863, 0.0705882353, 0.07058823529411765, 0.0039215686, 0.0392156863, 0.0745098039, 0.07450980392156863, 0.0039215686, 0.0431372549, 0.0784313725, 0.0784313725490196, 0.0039215686, 0.0431372549, 0.0823529412, 0.08235294117647059, 0.0039215686, 0.0470588235, 0.0862745098, 0.08627450980392157, 0.0039215686, 0.0470588235, 0.0901960784, 0.09019607843137255, 0.0039215686, 0.0509803922, 0.0941176471, 0.09411764705882353, 0.0039215686, 0.0509803922, 0.0980392157, 0.09803921568627451, 0.0039215686, 0.0549019608, 0.1019607843, 0.10196078431372549, 0.0039215686, 0.0549019608, 0.1058823529, 0.10588235294117647, 0.0039215686, 0.0588235294, 0.1098039216, 0.10980392156862745, 0.0039215686, 0.0588235294, 0.1137254902, 0.11372549019607843, 0.0039215686, 0.062745098, 0.1176470588, 0.11764705882352942, 0.0039215686, 0.062745098, 0.1215686275, 0.12156862745098039, 0.0039215686, 0.0666666667, 0.1254901961, 0.12549019607843137, 0.0039215686, 0.0666666667, 0.1294117647, 0.12941176470588237, 0.0039215686, 0.0705882353, 0.1333333333, 0.13333333333333333, 0.0039215686, 0.0705882353, 0.137254902, 0.13725490196078433, 0.0039215686, 0.0745098039, 0.1411764706, 0.1411764705882353, 0.0039215686, 0.0745098039, 0.1450980392, 0.1450980392156863, 0.0039215686, 0.0784313725, 0.1490196078, 0.14901960784313725, 0.0039215686, 0.0784313725, 0.1529411765, 0.15294117647058825, 0.0039215686, 0.0823529412, 0.1568627451, 0.1568627450980392, 0.0039215686, 0.0823529412, 0.1607843137, 0.1607843137254902, 0.0039215686, 0.0862745098, 0.1647058824, 0.16470588235294117, 0.0039215686, 0.0862745098, 0.168627451, 0.16862745098039217, 0.0039215686, 0.0901960784, 0.1725490196, 0.17254901960784313, 0.0039215686, 0.0901960784, 0.1764705882, 0.17647058823529413, 0.0039215686, 0.0941176471, 0.1803921569, 0.1803921568627451, 0.0039215686, 0.0941176471, 0.1843137255, 0.1843137254901961, 0.0039215686, 0.0980392157, 0.1882352941, 0.18823529411764706, 0.0039215686, 0.0980392157, 0.1921568627, 0.19215686274509805, 0.0039215686, 0.1019607843, 0.1960784314, 0.19607843137254902, 0.0039215686, 0.1019607843, 0.2, 0.2, 0.0039215686, 0.1058823529, 0.2039215686, 0.20392156862745098, 0.0039215686, 0.1058823529, 0.2078431373, 0.20784313725490197, 0.0039215686, 0.1098039216, 0.2117647059, 0.21176470588235294, 0.0039215686, 0.1098039216, 0.2156862745, 0.21568627450980393, 0.0039215686, 0.1137254902, 0.2196078431, 0.2196078431372549, 0.0039215686, 0.1137254902, 0.2235294118, 0.2235294117647059, 0.0039215686, 0.1176470588, 0.2274509804, 0.22745098039215686, 0.0039215686, 0.1176470588, 0.231372549, 0.23137254901960785, 0.0039215686, 0.1215686275, 0.2352941176, 0.23529411764705885, 0.0039215686, 0.1215686275, 0.2392156863, 0.23921568627450984, 0.0039215686, 0.1254901961, 0.2431372549, 0.24313725490196078, 0.0039215686, 0.1254901961, 0.2470588235, 0.24705882352941178, 0.0039215686, 0.1294117647, 0.2509803922, 0.25098039215686274, 0.0039215686, 0.1294117647, 0.2509803922, 0.2549019607843137, 0.0078431373, 0.1254901961, 0.2549019608, 0.25882352941176473, 0.0156862745, 0.1254901961, 0.2588235294, 0.2627450980392157, 0.0235294118, 0.1215686275, 0.262745098, 0.26666666666666666, 0.031372549, 0.1215686275, 0.2666666667, 0.27058823529411763, 0.0392156863, 0.1176470588, 0.2705882353, 0.27450980392156865, 0.0470588235, 0.1176470588, 0.2745098039, 0.2784313725490196, 0.0549019608, 0.1137254902, 0.2784313725, 0.2823529411764706, 0.062745098, 0.1137254902, 0.2823529412, 0.28627450980392155, 0.0705882353, 0.1098039216, 0.2862745098, 0.2901960784313726, 0.0784313725, 0.1098039216, 0.2901960784, 0.29411764705882354, 0.0862745098, 0.1058823529, 0.2941176471, 0.2980392156862745, 0.0941176471, 0.1058823529, 0.2980392157, 0.30196078431372547, 0.1019607843, 0.1019607843, 0.3019607843, 0.3058823529411765, 0.1098039216, 0.1019607843, 0.3058823529, 0.30980392156862746, 0.1176470588, 0.0980392157, 0.3098039216, 0.3137254901960784, 0.1254901961, 0.0980392157, 0.3137254902, 0.3176470588235294, 0.1333333333, 0.0941176471, 0.3176470588, 0.3215686274509804, 0.1411764706, 0.0941176471, 0.3215686275, 0.3254901960784314, 0.1490196078, 0.0901960784, 0.3254901961, 0.32941176470588235, 0.1568627451, 0.0901960784, 0.3294117647, 0.3333333333333333, 0.1647058824, 0.0862745098, 0.3333333333, 0.33725490196078434, 0.1725490196, 0.0862745098, 0.337254902, 0.3411764705882353, 0.1803921569, 0.0823529412, 0.3411764706, 0.34509803921568627, 0.1882352941, 0.0823529412, 0.3450980392, 0.34901960784313724, 0.1960784314, 0.0784313725, 0.3490196078, 0.35294117647058826, 0.2039215686, 0.0784313725, 0.3529411765, 0.3568627450980392, 0.2117647059, 0.0745098039, 0.3568627451, 0.3607843137254902, 0.2196078431, 0.0745098039, 0.3607843137, 0.36470588235294116, 0.2274509804, 0.0705882353, 0.3647058824, 0.3686274509803922, 0.2352941176, 0.0705882353, 0.368627451, 0.37254901960784315, 0.2431372549, 0.0666666667, 0.3725490196, 0.3764705882352941, 0.2509803922, 0.0666666667, 0.3764705882, 0.3803921568627451, 0.2549019608, 0.062745098, 0.3803921569, 0.3843137254901961, 0.262745098, 0.062745098, 0.3843137255, 0.38823529411764707, 0.2705882353, 0.0588235294, 0.3882352941, 0.39215686274509803, 0.2784313725, 0.0588235294, 0.3921568627, 0.396078431372549, 0.2862745098, 0.0549019608, 0.3960784314, 0.4, 0.2941176471, 0.0549019608, 0.4, 0.403921568627451, 0.3019607843, 0.0509803922, 0.4039215686, 0.40784313725490196, 0.3098039216, 0.0509803922, 0.4078431373, 0.4117647058823529, 0.3176470588, 0.0470588235, 0.4117647059, 0.41568627450980394, 0.3254901961, 0.0470588235, 0.4156862745, 0.4196078431372549, 0.3333333333, 0.0431372549, 0.4196078431, 0.4235294117647059, 0.3411764706, 0.0431372549, 0.4235294118, 0.42745098039215684, 0.3490196078, 0.0392156863, 0.4274509804, 0.43137254901960786, 0.3568627451, 0.0392156863, 0.431372549, 0.43529411764705883, 0.3647058824, 0.0352941176, 0.4352941176, 0.4392156862745098, 0.3725490196, 0.0352941176, 0.4392156863, 0.44313725490196076, 0.3803921569, 0.031372549, 0.4431372549, 0.4470588235294118, 0.3882352941, 0.031372549, 0.4470588235, 0.45098039215686275, 0.3960784314, 0.0274509804, 0.4509803922, 0.4549019607843137, 0.4039215686, 0.0274509804, 0.4549019608, 0.4588235294117647, 0.4117647059, 0.0235294118, 0.4588235294, 0.4627450980392157, 0.4196078431, 0.0235294118, 0.462745098, 0.4666666666666667, 0.4274509804, 0.0196078431, 0.4666666667, 0.4705882352941177, 0.4352941176, 0.0196078431, 0.4705882353, 0.4745098039215686, 0.4431372549, 0.0156862745, 0.4745098039, 0.4784313725490197, 0.4509803922, 0.0156862745, 0.4784313725, 0.48235294117647065, 0.4588235294, 0.0117647059, 0.4823529412, 0.48627450980392156, 0.4666666667, 0.0117647059, 0.4862745098, 0.49019607843137253, 0.4745098039, 0.0078431373, 0.4901960784, 0.49411764705882355, 0.4823529412, 0.0078431373, 0.4941176471, 0.4980392156862745, 0.4901960784, 0.0039215686, 0.4980392157, 0.5019607843137255, 0.4980392157, 0.0117647059, 0.4980392157, 0.5058823529411764, 0.5058823529, 0.0156862745, 0.4901960784, 0.5098039215686274, 0.5137254902, 0.0235294118, 0.4823529412, 0.5137254901960784, 0.5215686275, 0.0274509804, 0.4745098039, 0.5176470588235295, 0.5294117647, 0.0352941176, 0.4666666667, 0.5215686274509804, 0.537254902, 0.0392156863, 0.4588235294, 0.5254901960784314, 0.5450980392, 0.0470588235, 0.4509803922, 0.5294117647058824, 0.5529411765, 0.0509803922, 0.4431372549, 0.5333333333333333, 0.5607843137, 0.0588235294, 0.4352941176, 0.5372549019607843, 0.568627451, 0.062745098, 0.4274509804, 0.5411764705882353, 0.5764705882, 0.0705882353, 0.4196078431, 0.5450980392156862, 0.5843137255, 0.0745098039, 0.4117647059, 0.5490196078431373, 0.5921568627, 0.0823529412, 0.4039215686, 0.5529411764705883, 0.6, 0.0862745098, 0.3960784314, 0.5568627450980392, 0.6078431373, 0.0941176471, 0.3882352941, 0.5607843137254902, 0.6156862745, 0.0980392157, 0.3803921569, 0.5647058823529412, 0.6235294118, 0.1058823529, 0.3725490196, 0.5686274509803921, 0.631372549, 0.1098039216, 0.3647058824, 0.5725490196078431, 0.6392156863, 0.1176470588, 0.3568627451, 0.5764705882352941, 0.6470588235, 0.1215686275, 0.3490196078, 0.5803921568627451, 0.6549019608, 0.1294117647, 0.3411764706, 0.5843137254901961, 0.662745098, 0.1333333333, 0.3333333333, 0.5882352941176471, 0.6705882353, 0.1411764706, 0.3254901961, 0.592156862745098, 0.6784313725, 0.1450980392, 0.3176470588, 0.596078431372549, 0.6862745098, 0.1529411765, 0.3098039216, 0.6, 0.6941176471, 0.1568627451, 0.3019607843, 0.6039215686274509, 0.7019607843, 0.1647058824, 0.2941176471, 0.6078431372549019, 0.7098039216, 0.168627451, 0.2862745098, 0.611764705882353, 0.7176470588, 0.1764705882, 0.2784313725, 0.615686274509804, 0.7254901961, 0.1803921569, 0.2705882353, 0.6196078431372549, 0.7333333333, 0.1882352941, 0.262745098, 0.6235294117647059, 0.7411764706, 0.1921568627, 0.2549019608, 0.6274509803921569, 0.7490196078, 0.2, 0.2509803922, 0.6313725490196078, 0.7529411765, 0.2039215686, 0.2431372549, 0.6352941176470588, 0.7607843137, 0.2117647059, 0.2352941176, 0.6392156862745098, 0.768627451, 0.2156862745, 0.2274509804, 0.6431372549019608, 0.7764705882, 0.2235294118, 0.2196078431, 0.6470588235294118, 0.7843137255, 0.2274509804, 0.2117647059, 0.6509803921568628, 0.7921568627, 0.2352941176, 0.2039215686, 0.6549019607843137, 0.8, 0.2392156863, 0.1960784314, 0.6588235294117647, 0.8078431373, 0.2470588235, 0.1882352941, 0.6627450980392157, 0.8156862745, 0.2509803922, 0.1803921569, 0.6666666666666666, 0.8235294118, 0.2549019608, 0.1725490196, 0.6705882352941176, 0.831372549, 0.2588235294, 0.1647058824, 0.6745098039215687, 0.8392156863, 0.2666666667, 0.1568627451, 0.6784313725490196, 0.8470588235, 0.2705882353, 0.1490196078, 0.6823529411764706, 0.8549019608, 0.2784313725, 0.1411764706, 0.6862745098039216, 0.862745098, 0.2823529412, 0.1333333333, 0.6901960784313725, 0.8705882353, 0.2901960784, 0.1254901961, 0.6941176470588235, 0.8784313725, 0.2941176471, 0.1176470588, 0.6980392156862745, 0.8862745098, 0.3019607843, 0.1098039216, 0.7019607843137254, 0.8941176471, 0.3058823529, 0.1019607843, 0.7058823529411765, 0.9019607843, 0.3137254902, 0.0941176471, 0.7098039215686275, 0.9098039216, 0.3176470588, 0.0862745098, 0.7137254901960784, 0.9176470588, 0.3254901961, 0.0784313725, 0.7176470588235294, 0.9254901961, 0.3294117647, 0.0705882353, 0.7215686274509804, 0.9333333333, 0.337254902, 0.062745098, 0.7254901960784313, 0.9411764706, 0.3411764706, 0.0549019608, 0.7294117647058823, 0.9490196078, 0.3490196078, 0.0470588235, 0.7333333333333333, 0.9568627451, 0.3529411765, 0.0392156863, 0.7372549019607844, 0.9647058824, 0.3607843137, 0.031372549, 0.7411764705882353, 0.9725490196, 0.3647058824, 0.0235294118, 0.7450980392156863, 0.9803921569, 0.3725490196, 0.0156862745, 0.7490196078431373, 0.9882352941, 0.3725490196, 0.0039215686, 0.7529411764705882, 0.9960784314, 0.3843137255, 0.0156862745, 0.7568627450980392, 0.9960784314, 0.3921568627, 0.031372549, 0.7607843137254902, 0.9960784314, 0.4039215686, 0.0470588235, 0.7647058823529411, 0.9960784314, 0.4117647059, 0.062745098, 0.7686274509803922, 0.9960784314, 0.4235294118, 0.0784313725, 0.7725490196078432, 0.9960784314, 0.431372549, 0.0941176471, 0.7764705882352941, 0.9960784314, 0.4431372549, 0.1098039216, 0.7803921568627451, 0.9960784314, 0.4509803922, 0.1254901961, 0.7843137254901961, 0.9960784314, 0.462745098, 0.1411764706, 0.788235294117647, 0.9960784314, 0.4705882353, 0.1568627451, 0.792156862745098, 0.9960784314, 0.4823529412, 0.1725490196, 0.796078431372549, 0.9960784314, 0.4901960784, 0.1882352941, 0.8, 0.9960784314, 0.5019607843, 0.2039215686, 0.803921568627451, 0.9960784314, 0.5098039216, 0.2196078431, 0.807843137254902, 0.9960784314, 0.5215686275, 0.2352941176, 0.8117647058823529, 0.9960784314, 0.5294117647, 0.2509803922, 0.8156862745098039, 0.9960784314, 0.5411764706, 0.262745098, 0.8196078431372549, 0.9960784314, 0.5490196078, 0.2784313725, 0.8235294117647058, 0.9960784314, 0.5607843137, 0.2941176471, 0.8274509803921568, 0.9960784314, 0.568627451, 0.3098039216, 0.8313725490196079, 0.9960784314, 0.5803921569, 0.3254901961, 0.8352941176470589, 0.9960784314, 0.5882352941, 0.3411764706, 0.8392156862745098, 0.9960784314, 0.6, 0.3568627451, 0.8431372549019608, 0.9960784314, 0.6078431373, 0.3725490196, 0.8470588235294118, 0.9960784314, 0.6196078431, 0.3882352941, 0.8509803921568627, 0.9960784314, 0.6274509804, 0.4039215686, 0.8549019607843137, 0.9960784314, 0.6392156863, 0.4196078431, 0.8588235294117647, 0.9960784314, 0.6470588235, 0.4352941176, 0.8627450980392157, 0.9960784314, 0.6588235294, 0.4509803922, 0.8666666666666667, 0.9960784314, 0.6666666667, 0.4666666667, 0.8705882352941177, 0.9960784314, 0.6784313725, 0.4823529412, 0.8745098039215686, 0.9960784314, 0.6862745098, 0.4980392157, 0.8784313725490196, 0.9960784314, 0.6980392157, 0.5137254902, 0.8823529411764706, 0.9960784314, 0.7058823529, 0.5294117647, 0.8862745098039215, 0.9960784314, 0.7176470588, 0.5450980392, 0.8901960784313725, 0.9960784314, 0.7254901961, 0.5607843137, 0.8941176470588236, 0.9960784314, 0.737254902, 0.5764705882, 0.8980392156862745, 0.9960784314, 0.7450980392, 0.5921568627, 0.9019607843137255, 0.9960784314, 0.7529411765, 0.6078431373, 0.9058823529411765, 0.9960784314, 0.7607843137, 0.6235294118, 0.9098039215686274, 0.9960784314, 0.7725490196, 0.6392156863, 0.9137254901960784, 0.9960784314, 0.7803921569, 0.6549019608, 0.9176470588235294, 0.9960784314, 0.7921568627, 0.6705882353, 0.9215686274509803, 0.9960784314, 0.8, 0.6862745098, 0.9254901960784314, 0.9960784314, 0.8117647059, 0.7019607843, 0.9294117647058824, 0.9960784314, 0.8196078431, 0.7176470588, 0.9333333333333333, 0.9960784314, 0.831372549, 0.7333333333, 0.9372549019607843, 0.9960784314, 0.8392156863, 0.7490196078, 0.9411764705882354, 0.9960784314, 0.8509803922, 0.7607843137, 0.9450980392156864, 0.9960784314, 0.8588235294, 0.7764705882, 0.9490196078431372, 0.9960784314, 0.8705882353, 0.7921568627, 0.9529411764705882, 0.9960784314, 0.8784313725, 0.8078431373, 0.9568627450980394, 0.9960784314, 0.8901960784, 0.8235294118, 0.9607843137254903, 0.9960784314, 0.8980392157, 0.8392156863, 0.9647058823529413, 0.9960784314, 0.9098039216, 0.8549019608, 0.9686274509803922, 0.9960784314, 0.9176470588, 0.8705882353, 0.9725490196078431, 0.9960784314, 0.9294117647, 0.8862745098, 0.9764705882352941, 0.9960784314, 0.937254902, 0.9019607843, 0.9803921568627451, 0.9960784314, 0.9490196078, 0.9176470588, 0.984313725490196, 0.9960784314, 0.9568627451, 0.9333333333, 0.9882352941176471, 0.9960784314, 0.968627451, 0.9490196078, 0.9921568627450981, 0.9960784314, 0.9764705882, 0.9647058824, 0.996078431372549, 0.9960784314, 0.9882352941, 0.9803921569, 1.0, 0.9960784314, 0.9882352941, 0.9803921569],
  description: 'GE 256'
}, {
  ColorSpace: 'RGB',
  Name: 'ge',
  RGBPoints: [0.0, 0.0078431373, 0.0078431373, 0.0078431373, 0.00392156862745098, 0.0078431373, 0.0078431373, 0.0078431373, 0.00784313725490196, 0.0078431373, 0.0078431373, 0.0078431373, 0.011764705882352941, 0.0078431373, 0.0078431373, 0.0078431373, 0.01568627450980392, 0.0078431373, 0.0078431373, 0.0078431373, 0.0196078431372549, 0.0078431373, 0.0078431373, 0.0078431373, 0.023529411764705882, 0.0078431373, 0.0078431373, 0.0078431373, 0.027450980392156862, 0.0078431373, 0.0078431373, 0.0078431373, 0.03137254901960784, 0.0078431373, 0.0078431373, 0.0078431373, 0.03529411764705882, 0.0078431373, 0.0078431373, 0.0078431373, 0.0392156862745098, 0.0078431373, 0.0078431373, 0.0078431373, 0.043137254901960784, 0.0078431373, 0.0078431373, 0.0078431373, 0.047058823529411764, 0.0078431373, 0.0078431373, 0.0078431373, 0.050980392156862744, 0.0078431373, 0.0078431373, 0.0078431373, 0.054901960784313725, 0.0078431373, 0.0078431373, 0.0078431373, 0.05882352941176471, 0.0117647059, 0.0078431373, 0.0078431373, 0.06274509803921569, 0.0078431373, 0.0156862745, 0.0156862745, 0.06666666666666667, 0.0078431373, 0.0235294118, 0.0235294118, 0.07058823529411765, 0.0078431373, 0.031372549, 0.031372549, 0.07450980392156863, 0.0078431373, 0.0392156863, 0.0392156863, 0.0784313725490196, 0.0078431373, 0.0470588235, 0.0470588235, 0.08235294117647059, 0.0078431373, 0.0549019608, 0.0549019608, 0.08627450980392157, 0.0078431373, 0.062745098, 0.062745098, 0.09019607843137255, 0.0078431373, 0.0705882353, 0.0705882353, 0.09411764705882353, 0.0078431373, 0.0784313725, 0.0784313725, 0.09803921568627451, 0.0078431373, 0.0901960784, 0.0862745098, 0.10196078431372549, 0.0078431373, 0.0980392157, 0.0941176471, 0.10588235294117647, 0.0078431373, 0.1058823529, 0.1019607843, 0.10980392156862745, 0.0078431373, 0.1137254902, 0.1098039216, 0.11372549019607843, 0.0078431373, 0.1215686275, 0.1176470588, 0.11764705882352942, 0.0078431373, 0.1294117647, 0.1254901961, 0.12156862745098039, 0.0078431373, 0.137254902, 0.1333333333, 0.12549019607843137, 0.0078431373, 0.1450980392, 0.1411764706, 0.12941176470588237, 0.0078431373, 0.1529411765, 0.1490196078, 0.13333333333333333, 0.0078431373, 0.1647058824, 0.1568627451, 0.13725490196078433, 0.0078431373, 0.1725490196, 0.1647058824, 0.1411764705882353, 0.0078431373, 0.1803921569, 0.1725490196, 0.1450980392156863, 0.0078431373, 0.1882352941, 0.1803921569, 0.14901960784313725, 0.0078431373, 0.1960784314, 0.1882352941, 0.15294117647058825, 0.0078431373, 0.2039215686, 0.1960784314, 0.1568627450980392, 0.0078431373, 0.2117647059, 0.2039215686, 0.1607843137254902, 0.0078431373, 0.2196078431, 0.2117647059, 0.16470588235294117, 0.0078431373, 0.2274509804, 0.2196078431, 0.16862745098039217, 0.0078431373, 0.2352941176, 0.2274509804, 0.17254901960784313, 0.0078431373, 0.2470588235, 0.2352941176, 0.17647058823529413, 0.0078431373, 0.2509803922, 0.2431372549, 0.1803921568627451, 0.0078431373, 0.2549019608, 0.2509803922, 0.1843137254901961, 0.0078431373, 0.262745098, 0.2509803922, 0.18823529411764706, 0.0078431373, 0.2705882353, 0.2588235294, 0.19215686274509805, 0.0078431373, 0.2784313725, 0.2666666667, 0.19607843137254902, 0.0078431373, 0.2862745098, 0.2745098039, 0.2, 0.0078431373, 0.2941176471, 0.2823529412, 0.20392156862745098, 0.0078431373, 0.3019607843, 0.2901960784, 0.20784313725490197, 0.0078431373, 0.3137254902, 0.2980392157, 0.21176470588235294, 0.0078431373, 0.3215686275, 0.3058823529, 0.21568627450980393, 0.0078431373, 0.3294117647, 0.3137254902, 0.2196078431372549, 0.0078431373, 0.337254902, 0.3215686275, 0.2235294117647059, 0.0078431373, 0.3450980392, 0.3294117647, 0.22745098039215686, 0.0078431373, 0.3529411765, 0.337254902, 0.23137254901960785, 0.0078431373, 0.3607843137, 0.3450980392, 0.23529411764705885, 0.0078431373, 0.368627451, 0.3529411765, 0.23921568627450984, 0.0078431373, 0.3764705882, 0.3607843137, 0.24313725490196078, 0.0078431373, 0.3843137255, 0.368627451, 0.24705882352941178, 0.0078431373, 0.3960784314, 0.3764705882, 0.25098039215686274, 0.0078431373, 0.4039215686, 0.3843137255, 0.2549019607843137, 0.0078431373, 0.4117647059, 0.3921568627, 0.25882352941176473, 0.0078431373, 0.4196078431, 0.4, 0.2627450980392157, 0.0078431373, 0.4274509804, 0.4078431373, 0.26666666666666666, 0.0078431373, 0.4352941176, 0.4156862745, 0.27058823529411763, 0.0078431373, 0.4431372549, 0.4235294118, 0.27450980392156865, 0.0078431373, 0.4509803922, 0.431372549, 0.2784313725490196, 0.0078431373, 0.4588235294, 0.4392156863, 0.2823529411764706, 0.0078431373, 0.4705882353, 0.4470588235, 0.28627450980392155, 0.0078431373, 0.4784313725, 0.4549019608, 0.2901960784313726, 0.0078431373, 0.4862745098, 0.462745098, 0.29411764705882354, 0.0078431373, 0.4941176471, 0.4705882353, 0.2980392156862745, 0.0078431373, 0.5019607843, 0.4784313725, 0.30196078431372547, 0.0117647059, 0.5098039216, 0.4862745098, 0.3058823529411765, 0.0196078431, 0.5019607843, 0.4941176471, 0.30980392156862746, 0.0274509804, 0.4941176471, 0.5058823529, 0.3137254901960784, 0.0352941176, 0.4862745098, 0.5137254902, 0.3176470588235294, 0.0431372549, 0.4784313725, 0.5215686275, 0.3215686274509804, 0.0509803922, 0.4705882353, 0.5294117647, 0.3254901960784314, 0.0588235294, 0.462745098, 0.537254902, 0.32941176470588235, 0.0666666667, 0.4549019608, 0.5450980392, 0.3333333333333333, 0.0745098039, 0.4470588235, 0.5529411765, 0.33725490196078434, 0.0823529412, 0.4392156863, 0.5607843137, 0.3411764705882353, 0.0901960784, 0.431372549, 0.568627451, 0.34509803921568627, 0.0980392157, 0.4235294118, 0.5764705882, 0.34901960784313724, 0.1058823529, 0.4156862745, 0.5843137255, 0.35294117647058826, 0.1137254902, 0.4078431373, 0.5921568627, 0.3568627450980392, 0.1215686275, 0.4, 0.6, 0.3607843137254902, 0.1294117647, 0.3921568627, 0.6078431373, 0.36470588235294116, 0.137254902, 0.3843137255, 0.6156862745, 0.3686274509803922, 0.1450980392, 0.3764705882, 0.6235294118, 0.37254901960784315, 0.1529411765, 0.368627451, 0.631372549, 0.3764705882352941, 0.1607843137, 0.3607843137, 0.6392156863, 0.3803921568627451, 0.168627451, 0.3529411765, 0.6470588235, 0.3843137254901961, 0.1764705882, 0.3450980392, 0.6549019608, 0.38823529411764707, 0.1843137255, 0.337254902, 0.662745098, 0.39215686274509803, 0.1921568627, 0.3294117647, 0.6705882353, 0.396078431372549, 0.2, 0.3215686275, 0.6784313725, 0.4, 0.2078431373, 0.3137254902, 0.6862745098, 0.403921568627451, 0.2156862745, 0.3058823529, 0.6941176471, 0.40784313725490196, 0.2235294118, 0.2980392157, 0.7019607843, 0.4117647058823529, 0.231372549, 0.2901960784, 0.7098039216, 0.41568627450980394, 0.2392156863, 0.2823529412, 0.7176470588, 0.4196078431372549, 0.2470588235, 0.2745098039, 0.7254901961, 0.4235294117647059, 0.2509803922, 0.2666666667, 0.7333333333, 0.42745098039215684, 0.2509803922, 0.2588235294, 0.7411764706, 0.43137254901960786, 0.2588235294, 0.2509803922, 0.7490196078, 0.43529411764705883, 0.2666666667, 0.2509803922, 0.7490196078, 0.4392156862745098, 0.2745098039, 0.2431372549, 0.7568627451, 0.44313725490196076, 0.2823529412, 0.2352941176, 0.7647058824, 0.4470588235294118, 0.2901960784, 0.2274509804, 0.7725490196, 0.45098039215686275, 0.2980392157, 0.2196078431, 0.7803921569, 0.4549019607843137, 0.3058823529, 0.2117647059, 0.7882352941, 0.4588235294117647, 0.3137254902, 0.2039215686, 0.7960784314, 0.4627450980392157, 0.3215686275, 0.1960784314, 0.8039215686, 0.4666666666666667, 0.3294117647, 0.1882352941, 0.8117647059, 0.4705882352941177, 0.337254902, 0.1803921569, 0.8196078431, 0.4745098039215686, 0.3450980392, 0.1725490196, 0.8274509804, 0.4784313725490197, 0.3529411765, 0.1647058824, 0.8352941176, 0.48235294117647065, 0.3607843137, 0.1568627451, 0.8431372549, 0.48627450980392156, 0.368627451, 0.1490196078, 0.8509803922, 0.49019607843137253, 0.3764705882, 0.1411764706, 0.8588235294, 0.49411764705882355, 0.3843137255, 0.1333333333, 0.8666666667, 0.4980392156862745, 0.3921568627, 0.1254901961, 0.8745098039, 0.5019607843137255, 0.4, 0.1176470588, 0.8823529412, 0.5058823529411764, 0.4078431373, 0.1098039216, 0.8901960784, 0.5098039215686274, 0.4156862745, 0.1019607843, 0.8980392157, 0.5137254901960784, 0.4235294118, 0.0941176471, 0.9058823529, 0.5176470588235295, 0.431372549, 0.0862745098, 0.9137254902, 0.5215686274509804, 0.4392156863, 0.0784313725, 0.9215686275, 0.5254901960784314, 0.4470588235, 0.0705882353, 0.9294117647, 0.5294117647058824, 0.4549019608, 0.062745098, 0.937254902, 0.5333333333333333, 0.462745098, 0.0549019608, 0.9450980392, 0.5372549019607843, 0.4705882353, 0.0470588235, 0.9529411765, 0.5411764705882353, 0.4784313725, 0.0392156863, 0.9607843137, 0.5450980392156862, 0.4862745098, 0.031372549, 0.968627451, 0.5490196078431373, 0.4941176471, 0.0235294118, 0.9764705882, 0.5529411764705883, 0.4980392157, 0.0156862745, 0.9843137255, 0.5568627450980392, 0.5058823529, 0.0078431373, 0.9921568627, 0.5607843137254902, 0.5137254902, 0.0156862745, 0.9803921569, 0.5647058823529412, 0.5215686275, 0.0235294118, 0.9647058824, 0.5686274509803921, 0.5294117647, 0.0352941176, 0.9490196078, 0.5725490196078431, 0.537254902, 0.0431372549, 0.9333333333, 0.5764705882352941, 0.5450980392, 0.0509803922, 0.9176470588, 0.5803921568627451, 0.5529411765, 0.062745098, 0.9019607843, 0.5843137254901961, 0.5607843137, 0.0705882353, 0.8862745098, 0.5882352941176471, 0.568627451, 0.0784313725, 0.8705882353, 0.592156862745098, 0.5764705882, 0.0901960784, 0.8549019608, 0.596078431372549, 0.5843137255, 0.0980392157, 0.8392156863, 0.6, 0.5921568627, 0.1098039216, 0.8235294118, 0.6039215686274509, 0.6, 0.1176470588, 0.8078431373, 0.6078431372549019, 0.6078431373, 0.1254901961, 0.7921568627, 0.611764705882353, 0.6156862745, 0.137254902, 0.7764705882, 0.615686274509804, 0.6235294118, 0.1450980392, 0.7607843137, 0.6196078431372549, 0.631372549, 0.1529411765, 0.7490196078, 0.6235294117647059, 0.6392156863, 0.1647058824, 0.737254902, 0.6274509803921569, 0.6470588235, 0.1725490196, 0.7215686275, 0.6313725490196078, 0.6549019608, 0.1843137255, 0.7058823529, 0.6352941176470588, 0.662745098, 0.1921568627, 0.6901960784, 0.6392156862745098, 0.6705882353, 0.2, 0.6745098039, 0.6431372549019608, 0.6784313725, 0.2117647059, 0.6588235294, 0.6470588235294118, 0.6862745098, 0.2196078431, 0.6431372549, 0.6509803921568628, 0.6941176471, 0.2274509804, 0.6274509804, 0.6549019607843137, 0.7019607843, 0.2392156863, 0.6117647059, 0.6588235294117647, 0.7098039216, 0.2470588235, 0.5960784314, 0.6627450980392157, 0.7176470588, 0.2509803922, 0.5803921569, 0.6666666666666666, 0.7254901961, 0.2588235294, 0.5647058824, 0.6705882352941176, 0.7333333333, 0.2666666667, 0.5490196078, 0.6745098039215687, 0.7411764706, 0.2784313725, 0.5333333333, 0.6784313725490196, 0.7490196078, 0.2862745098, 0.5176470588, 0.6823529411764706, 0.7490196078, 0.2941176471, 0.5019607843, 0.6862745098039216, 0.7529411765, 0.3058823529, 0.4862745098, 0.6901960784313725, 0.7607843137, 0.3137254902, 0.4705882353, 0.6941176470588235, 0.768627451, 0.3215686275, 0.4549019608, 0.6980392156862745, 0.7764705882, 0.3333333333, 0.4392156863, 0.7019607843137254, 0.7843137255, 0.3411764706, 0.4235294118, 0.7058823529411765, 0.7921568627, 0.3529411765, 0.4078431373, 0.7098039215686275, 0.8, 0.3607843137, 0.3921568627, 0.7137254901960784, 0.8078431373, 0.368627451, 0.3764705882, 0.7176470588235294, 0.8156862745, 0.3803921569, 0.3607843137, 0.7215686274509804, 0.8235294118, 0.3882352941, 0.3450980392, 0.7254901960784313, 0.831372549, 0.3960784314, 0.3294117647, 0.7294117647058823, 0.8392156863, 0.4078431373, 0.3137254902, 0.7333333333333333, 0.8470588235, 0.4156862745, 0.2980392157, 0.7372549019607844, 0.8549019608, 0.4274509804, 0.2823529412, 0.7411764705882353, 0.862745098, 0.4352941176, 0.2666666667, 0.7450980392156863, 0.8705882353, 0.4431372549, 0.2509803922, 0.7490196078431373, 0.8784313725, 0.4549019608, 0.2431372549, 0.7529411764705882, 0.8862745098, 0.462745098, 0.2274509804, 0.7568627450980392, 0.8941176471, 0.4705882353, 0.2117647059, 0.7607843137254902, 0.9019607843, 0.4823529412, 0.1960784314, 0.7647058823529411, 0.9098039216, 0.4901960784, 0.1803921569, 0.7686274509803922, 0.9176470588, 0.4980392157, 0.1647058824, 0.7725490196078432, 0.9254901961, 0.5098039216, 0.1490196078, 0.7764705882352941, 0.9333333333, 0.5176470588, 0.1333333333, 0.7803921568627451, 0.9411764706, 0.5294117647, 0.1176470588, 0.7843137254901961, 0.9490196078, 0.537254902, 0.1019607843, 0.788235294117647, 0.9568627451, 0.5450980392, 0.0862745098, 0.792156862745098, 0.9647058824, 0.5568627451, 0.0705882353, 0.796078431372549, 0.9725490196, 0.5647058824, 0.0549019608, 0.8, 0.9803921569, 0.5725490196, 0.0392156863, 0.803921568627451, 0.9882352941, 0.5843137255, 0.0235294118, 0.807843137254902, 0.9921568627, 0.5921568627, 0.0078431373, 0.8117647058823529, 0.9921568627, 0.6039215686, 0.0274509804, 0.8156862745098039, 0.9921568627, 0.6117647059, 0.0509803922, 0.8196078431372549, 0.9921568627, 0.6196078431, 0.0745098039, 0.8235294117647058, 0.9921568627, 0.631372549, 0.0980392157, 0.8274509803921568, 0.9921568627, 0.6392156863, 0.1215686275, 0.8313725490196079, 0.9921568627, 0.6470588235, 0.1411764706, 0.8352941176470589, 0.9921568627, 0.6588235294, 0.1647058824, 0.8392156862745098, 0.9921568627, 0.6666666667, 0.1882352941, 0.8431372549019608, 0.9921568627, 0.6784313725, 0.2117647059, 0.8470588235294118, 0.9921568627, 0.6862745098, 0.2352941176, 0.8509803921568627, 0.9921568627, 0.6941176471, 0.2509803922, 0.8549019607843137, 0.9921568627, 0.7058823529, 0.2705882353, 0.8588235294117647, 0.9921568627, 0.7137254902, 0.2941176471, 0.8627450980392157, 0.9921568627, 0.7215686275, 0.3176470588, 0.8666666666666667, 0.9921568627, 0.7333333333, 0.3411764706, 0.8705882352941177, 0.9921568627, 0.7411764706, 0.3647058824, 0.8745098039215686, 0.9921568627, 0.7490196078, 0.3843137255, 0.8784313725490196, 0.9921568627, 0.7529411765, 0.4078431373, 0.8823529411764706, 0.9921568627, 0.7607843137, 0.431372549, 0.8862745098039215, 0.9921568627, 0.7725490196, 0.4549019608, 0.8901960784313725, 0.9921568627, 0.7803921569, 0.4784313725, 0.8941176470588236, 0.9921568627, 0.7882352941, 0.4980392157, 0.8980392156862745, 0.9921568627, 0.8, 0.5215686275, 0.9019607843137255, 0.9921568627, 0.8078431373, 0.5450980392, 0.9058823529411765, 0.9921568627, 0.8156862745, 0.568627451, 0.9098039215686274, 0.9921568627, 0.8274509804, 0.5921568627, 0.9137254901960784, 0.9921568627, 0.8352941176, 0.6156862745, 0.9176470588235294, 0.9921568627, 0.8470588235, 0.6352941176, 0.9215686274509803, 0.9921568627, 0.8549019608, 0.6588235294, 0.9254901960784314, 0.9921568627, 0.862745098, 0.6823529412, 0.9294117647058824, 0.9921568627, 0.8745098039, 0.7058823529, 0.9333333333333333, 0.9921568627, 0.8823529412, 0.7294117647, 0.9372549019607843, 0.9921568627, 0.8901960784, 0.7490196078, 0.9411764705882354, 0.9921568627, 0.9019607843, 0.7647058824, 0.9450980392156864, 0.9921568627, 0.9098039216, 0.7882352941, 0.9490196078431372, 0.9921568627, 0.9215686275, 0.8117647059, 0.9529411764705882, 0.9921568627, 0.9294117647, 0.8352941176, 0.9568627450980394, 0.9921568627, 0.937254902, 0.8588235294, 0.9607843137254903, 0.9921568627, 0.9490196078, 0.8784313725, 0.9647058823529413, 0.9921568627, 0.9568627451, 0.9019607843, 0.9686274509803922, 0.9921568627, 0.9647058824, 0.9254901961, 0.9725490196078431, 0.9921568627, 0.9764705882, 0.9490196078, 0.9764705882352941, 0.9921568627, 0.9843137255, 0.9725490196, 0.9803921568627451, 0.9921568627, 0.9921568627, 0.9921568627, 0.984313725490196, 0.9921568627, 0.9921568627, 0.9921568627, 0.9882352941176471, 0.9921568627, 0.9921568627, 0.9921568627, 0.9921568627450981, 0.9921568627, 0.9921568627, 0.9921568627, 0.996078431372549, 0.9921568627, 0.9921568627, 0.9921568627, 1.0, 0.9921568627, 0.9921568627, 0.9921568627],
  description: 'GE'
}, {
  ColorSpace: 'RGB',
  Name: 'siemens',
  RGBPoints: [0.0, 0.0078431373, 0.0039215686, 0.1254901961, 0.00392156862745098, 0.0078431373, 0.0039215686, 0.1254901961, 0.00784313725490196, 0.0078431373, 0.0039215686, 0.1882352941, 0.011764705882352941, 0.0117647059, 0.0039215686, 0.2509803922, 0.01568627450980392, 0.0117647059, 0.0039215686, 0.3098039216, 0.0196078431372549, 0.0156862745, 0.0039215686, 0.3725490196, 0.023529411764705882, 0.0156862745, 0.0039215686, 0.3725490196, 0.027450980392156862, 0.0156862745, 0.0039215686, 0.3725490196, 0.03137254901960784, 0.0156862745, 0.0039215686, 0.3725490196, 0.03529411764705882, 0.0156862745, 0.0039215686, 0.3725490196, 0.0392156862745098, 0.0156862745, 0.0039215686, 0.3725490196, 0.043137254901960784, 0.0156862745, 0.0039215686, 0.3725490196, 0.047058823529411764, 0.0156862745, 0.0039215686, 0.3725490196, 0.050980392156862744, 0.0156862745, 0.0039215686, 0.3725490196, 0.054901960784313725, 0.0156862745, 0.0039215686, 0.3725490196, 0.05882352941176471, 0.0156862745, 0.0039215686, 0.3725490196, 0.06274509803921569, 0.0156862745, 0.0039215686, 0.3882352941, 0.06666666666666667, 0.0156862745, 0.0039215686, 0.4078431373, 0.07058823529411765, 0.0156862745, 0.0039215686, 0.4235294118, 0.07450980392156863, 0.0156862745, 0.0039215686, 0.4431372549, 0.0784313725490196, 0.0156862745, 0.0039215686, 0.462745098, 0.08235294117647059, 0.0156862745, 0.0039215686, 0.4784313725, 0.08627450980392157, 0.0156862745, 0.0039215686, 0.4980392157, 0.09019607843137255, 0.0196078431, 0.0039215686, 0.5137254902, 0.09411764705882353, 0.0196078431, 0.0039215686, 0.5333333333, 0.09803921568627451, 0.0196078431, 0.0039215686, 0.5529411765, 0.10196078431372549, 0.0196078431, 0.0039215686, 0.568627451, 0.10588235294117647, 0.0196078431, 0.0039215686, 0.5882352941, 0.10980392156862745, 0.0196078431, 0.0039215686, 0.6039215686, 0.11372549019607843, 0.0196078431, 0.0039215686, 0.6235294118, 0.11764705882352942, 0.0196078431, 0.0039215686, 0.6431372549, 0.12156862745098039, 0.0235294118, 0.0039215686, 0.6588235294, 0.12549019607843137, 0.0235294118, 0.0039215686, 0.6784313725, 0.12941176470588237, 0.0235294118, 0.0039215686, 0.6980392157, 0.13333333333333333, 0.0235294118, 0.0039215686, 0.7137254902, 0.13725490196078433, 0.0235294118, 0.0039215686, 0.7333333333, 0.1411764705882353, 0.0235294118, 0.0039215686, 0.7490196078, 0.1450980392156863, 0.0235294118, 0.0039215686, 0.7647058824, 0.14901960784313725, 0.0235294118, 0.0039215686, 0.7843137255, 0.15294117647058825, 0.0274509804, 0.0039215686, 0.8, 0.1568627450980392, 0.0274509804, 0.0039215686, 0.8196078431, 0.1607843137254902, 0.0274509804, 0.0039215686, 0.8352941176, 0.16470588235294117, 0.0274509804, 0.0039215686, 0.8549019608, 0.16862745098039217, 0.0274509804, 0.0039215686, 0.8745098039, 0.17254901960784313, 0.0274509804, 0.0039215686, 0.8901960784, 0.17647058823529413, 0.0274509804, 0.0039215686, 0.9098039216, 0.1803921568627451, 0.031372549, 0.0039215686, 0.9294117647, 0.1843137254901961, 0.031372549, 0.0039215686, 0.9254901961, 0.18823529411764706, 0.0509803922, 0.0039215686, 0.9098039216, 0.19215686274509805, 0.0705882353, 0.0039215686, 0.8901960784, 0.19607843137254902, 0.0901960784, 0.0039215686, 0.8705882353, 0.2, 0.1137254902, 0.0039215686, 0.8509803922, 0.20392156862745098, 0.1333333333, 0.0039215686, 0.831372549, 0.20784313725490197, 0.1529411765, 0.0039215686, 0.8117647059, 0.21176470588235294, 0.1725490196, 0.0039215686, 0.7921568627, 0.21568627450980393, 0.1960784314, 0.0039215686, 0.7725490196, 0.2196078431372549, 0.2156862745, 0.0039215686, 0.7529411765, 0.2235294117647059, 0.2352941176, 0.0039215686, 0.737254902, 0.22745098039215686, 0.2509803922, 0.0039215686, 0.7176470588, 0.23137254901960785, 0.2745098039, 0.0039215686, 0.6980392157, 0.23529411764705885, 0.2941176471, 0.0039215686, 0.6784313725, 0.23921568627450984, 0.3137254902, 0.0039215686, 0.6588235294, 0.24313725490196078, 0.3333333333, 0.0039215686, 0.6392156863, 0.24705882352941178, 0.3568627451, 0.0039215686, 0.6196078431, 0.25098039215686274, 0.3764705882, 0.0039215686, 0.6, 0.2549019607843137, 0.3960784314, 0.0039215686, 0.5803921569, 0.25882352941176473, 0.4156862745, 0.0039215686, 0.5607843137, 0.2627450980392157, 0.4392156863, 0.0039215686, 0.5411764706, 0.26666666666666666, 0.4588235294, 0.0039215686, 0.5215686275, 0.27058823529411763, 0.4784313725, 0.0039215686, 0.5019607843, 0.27450980392156865, 0.4980392157, 0.0039215686, 0.4823529412, 0.2784313725490196, 0.5215686275, 0.0039215686, 0.4666666667, 0.2823529411764706, 0.5411764706, 0.0039215686, 0.4470588235, 0.28627450980392155, 0.5607843137, 0.0039215686, 0.4274509804, 0.2901960784313726, 0.5803921569, 0.0039215686, 0.4078431373, 0.29411764705882354, 0.6039215686, 0.0039215686, 0.3882352941, 0.2980392156862745, 0.6235294118, 0.0039215686, 0.368627451, 0.30196078431372547, 0.6431372549, 0.0039215686, 0.3490196078, 0.3058823529411765, 0.662745098, 0.0039215686, 0.3294117647, 0.30980392156862746, 0.6862745098, 0.0039215686, 0.3098039216, 0.3137254901960784, 0.7058823529, 0.0039215686, 0.2901960784, 0.3176470588235294, 0.7254901961, 0.0039215686, 0.2705882353, 0.3215686274509804, 0.7450980392, 0.0039215686, 0.2509803922, 0.3254901960784314, 0.7647058824, 0.0039215686, 0.2352941176, 0.32941176470588235, 0.7843137255, 0.0039215686, 0.2156862745, 0.3333333333333333, 0.8039215686, 0.0039215686, 0.1960784314, 0.33725490196078434, 0.8235294118, 0.0039215686, 0.1764705882, 0.3411764705882353, 0.8470588235, 0.0039215686, 0.1568627451, 0.34509803921568627, 0.8666666667, 0.0039215686, 0.137254902, 0.34901960784313724, 0.8862745098, 0.0039215686, 0.1176470588, 0.35294117647058826, 0.9058823529, 0.0039215686, 0.0980392157, 0.3568627450980392, 0.9294117647, 0.0039215686, 0.0784313725, 0.3607843137254902, 0.9490196078, 0.0039215686, 0.0588235294, 0.36470588235294116, 0.968627451, 0.0039215686, 0.0392156863, 0.3686274509803922, 0.9921568627, 0.0039215686, 0.0235294118, 0.37254901960784315, 0.9529411765, 0.0039215686, 0.0588235294, 0.3764705882352941, 0.9529411765, 0.0078431373, 0.0549019608, 0.3803921568627451, 0.9529411765, 0.0156862745, 0.0549019608, 0.3843137254901961, 0.9529411765, 0.0235294118, 0.0549019608, 0.38823529411764707, 0.9529411765, 0.031372549, 0.0549019608, 0.39215686274509803, 0.9529411765, 0.0352941176, 0.0549019608, 0.396078431372549, 0.9529411765, 0.0431372549, 0.0549019608, 0.4, 0.9529411765, 0.0509803922, 0.0549019608, 0.403921568627451, 0.9529411765, 0.0588235294, 0.0549019608, 0.40784313725490196, 0.9529411765, 0.062745098, 0.0549019608, 0.4117647058823529, 0.9529411765, 0.0705882353, 0.0549019608, 0.41568627450980394, 0.9529411765, 0.0784313725, 0.0509803922, 0.4196078431372549, 0.9529411765, 0.0862745098, 0.0509803922, 0.4235294117647059, 0.9568627451, 0.0941176471, 0.0509803922, 0.42745098039215684, 0.9568627451, 0.0980392157, 0.0509803922, 0.43137254901960786, 0.9568627451, 0.1058823529, 0.0509803922, 0.43529411764705883, 0.9568627451, 0.1137254902, 0.0509803922, 0.4392156862745098, 0.9568627451, 0.1215686275, 0.0509803922, 0.44313725490196076, 0.9568627451, 0.1254901961, 0.0509803922, 0.4470588235294118, 0.9568627451, 0.1333333333, 0.0509803922, 0.45098039215686275, 0.9568627451, 0.1411764706, 0.0509803922, 0.4549019607843137, 0.9568627451, 0.1490196078, 0.0470588235, 0.4588235294117647, 0.9568627451, 0.1568627451, 0.0470588235, 0.4627450980392157, 0.9568627451, 0.1607843137, 0.0470588235, 0.4666666666666667, 0.9568627451, 0.168627451, 0.0470588235, 0.4705882352941177, 0.9607843137, 0.1764705882, 0.0470588235, 0.4745098039215686, 0.9607843137, 0.1843137255, 0.0470588235, 0.4784313725490197, 0.9607843137, 0.1882352941, 0.0470588235, 0.48235294117647065, 0.9607843137, 0.1960784314, 0.0470588235, 0.48627450980392156, 0.9607843137, 0.2039215686, 0.0470588235, 0.49019607843137253, 0.9607843137, 0.2117647059, 0.0470588235, 0.49411764705882355, 0.9607843137, 0.2196078431, 0.0431372549, 0.4980392156862745, 0.9607843137, 0.2235294118, 0.0431372549, 0.5019607843137255, 0.9607843137, 0.231372549, 0.0431372549, 0.5058823529411764, 0.9607843137, 0.2392156863, 0.0431372549, 0.5098039215686274, 0.9607843137, 0.2470588235, 0.0431372549, 0.5137254901960784, 0.9607843137, 0.2509803922, 0.0431372549, 0.5176470588235295, 0.9647058824, 0.2549019608, 0.0431372549, 0.5215686274509804, 0.9647058824, 0.262745098, 0.0431372549, 0.5254901960784314, 0.9647058824, 0.2705882353, 0.0431372549, 0.5294117647058824, 0.9647058824, 0.2745098039, 0.0431372549, 0.5333333333333333, 0.9647058824, 0.2823529412, 0.0392156863, 0.5372549019607843, 0.9647058824, 0.2901960784, 0.0392156863, 0.5411764705882353, 0.9647058824, 0.2980392157, 0.0392156863, 0.5450980392156862, 0.9647058824, 0.3058823529, 0.0392156863, 0.5490196078431373, 0.9647058824, 0.3098039216, 0.0392156863, 0.5529411764705883, 0.9647058824, 0.3176470588, 0.0392156863, 0.5568627450980392, 0.9647058824, 0.3254901961, 0.0392156863, 0.5607843137254902, 0.9647058824, 0.3333333333, 0.0392156863, 0.5647058823529412, 0.9647058824, 0.337254902, 0.0392156863, 0.5686274509803921, 0.968627451, 0.3450980392, 0.0392156863, 0.5725490196078431, 0.968627451, 0.3529411765, 0.0352941176, 0.5764705882352941, 0.968627451, 0.3607843137, 0.0352941176, 0.5803921568627451, 0.968627451, 0.368627451, 0.0352941176, 0.5843137254901961, 0.968627451, 0.3725490196, 0.0352941176, 0.5882352941176471, 0.968627451, 0.3803921569, 0.0352941176, 0.592156862745098, 0.968627451, 0.3882352941, 0.0352941176, 0.596078431372549, 0.968627451, 0.3960784314, 0.0352941176, 0.6, 0.968627451, 0.4, 0.0352941176, 0.6039215686274509, 0.968627451, 0.4078431373, 0.0352941176, 0.6078431372549019, 0.968627451, 0.4156862745, 0.0352941176, 0.611764705882353, 0.968627451, 0.4235294118, 0.031372549, 0.615686274509804, 0.9725490196, 0.431372549, 0.031372549, 0.6196078431372549, 0.9725490196, 0.4352941176, 0.031372549, 0.6235294117647059, 0.9725490196, 0.4431372549, 0.031372549, 0.6274509803921569, 0.9725490196, 0.4509803922, 0.031372549, 0.6313725490196078, 0.9725490196, 0.4588235294, 0.031372549, 0.6352941176470588, 0.9725490196, 0.462745098, 0.031372549, 0.6392156862745098, 0.9725490196, 0.4705882353, 0.031372549, 0.6431372549019608, 0.9725490196, 0.4784313725, 0.031372549, 0.6470588235294118, 0.9725490196, 0.4862745098, 0.031372549, 0.6509803921568628, 0.9725490196, 0.4941176471, 0.0274509804, 0.6549019607843137, 0.9725490196, 0.4980392157, 0.0274509804, 0.6588235294117647, 0.9725490196, 0.5058823529, 0.0274509804, 0.6627450980392157, 0.9764705882, 0.5137254902, 0.0274509804, 0.6666666666666666, 0.9764705882, 0.5215686275, 0.0274509804, 0.6705882352941176, 0.9764705882, 0.5254901961, 0.0274509804, 0.6745098039215687, 0.9764705882, 0.5333333333, 0.0274509804, 0.6784313725490196, 0.9764705882, 0.5411764706, 0.0274509804, 0.6823529411764706, 0.9764705882, 0.5490196078, 0.0274509804, 0.6862745098039216, 0.9764705882, 0.5529411765, 0.0274509804, 0.6901960784313725, 0.9764705882, 0.5607843137, 0.0235294118, 0.6941176470588235, 0.9764705882, 0.568627451, 0.0235294118, 0.6980392156862745, 0.9764705882, 0.5764705882, 0.0235294118, 0.7019607843137254, 0.9764705882, 0.5843137255, 0.0235294118, 0.7058823529411765, 0.9764705882, 0.5882352941, 0.0235294118, 0.7098039215686275, 0.9764705882, 0.5960784314, 0.0235294118, 0.7137254901960784, 0.9803921569, 0.6039215686, 0.0235294118, 0.7176470588235294, 0.9803921569, 0.6117647059, 0.0235294118, 0.7215686274509804, 0.9803921569, 0.6156862745, 0.0235294118, 0.7254901960784313, 0.9803921569, 0.6235294118, 0.0235294118, 0.7294117647058823, 0.9803921569, 0.631372549, 0.0196078431, 0.7333333333333333, 0.9803921569, 0.6392156863, 0.0196078431, 0.7372549019607844, 0.9803921569, 0.6470588235, 0.0196078431, 0.7411764705882353, 0.9803921569, 0.6509803922, 0.0196078431, 0.7450980392156863, 0.9803921569, 0.6588235294, 0.0196078431, 0.7490196078431373, 0.9803921569, 0.6666666667, 0.0196078431, 0.7529411764705882, 0.9803921569, 0.6745098039, 0.0196078431, 0.7568627450980392, 0.9803921569, 0.6784313725, 0.0196078431, 0.7607843137254902, 0.9843137255, 0.6862745098, 0.0196078431, 0.7647058823529411, 0.9843137255, 0.6941176471, 0.0196078431, 0.7686274509803922, 0.9843137255, 0.7019607843, 0.0156862745, 0.7725490196078432, 0.9843137255, 0.7098039216, 0.0156862745, 0.7764705882352941, 0.9843137255, 0.7137254902, 0.0156862745, 0.7803921568627451, 0.9843137255, 0.7215686275, 0.0156862745, 0.7843137254901961, 0.9843137255, 0.7294117647, 0.0156862745, 0.788235294117647, 0.9843137255, 0.737254902, 0.0156862745, 0.792156862745098, 0.9843137255, 0.7411764706, 0.0156862745, 0.796078431372549, 0.9843137255, 0.7490196078, 0.0156862745, 0.8, 0.9843137255, 0.7529411765, 0.0156862745, 0.803921568627451, 0.9843137255, 0.7607843137, 0.0156862745, 0.807843137254902, 0.9882352941, 0.768627451, 0.0156862745, 0.8117647058823529, 0.9882352941, 0.768627451, 0.0156862745, 0.8156862745098039, 0.9843137255, 0.7843137255, 0.0117647059, 0.8196078431372549, 0.9843137255, 0.8, 0.0117647059, 0.8235294117647058, 0.9843137255, 0.8156862745, 0.0117647059, 0.8274509803921568, 0.9803921569, 0.831372549, 0.0117647059, 0.8313725490196079, 0.9803921569, 0.8431372549, 0.0117647059, 0.8352941176470589, 0.9803921569, 0.8588235294, 0.0078431373, 0.8392156862745098, 0.9803921569, 0.8745098039, 0.0078431373, 0.8431372549019608, 0.9764705882, 0.8901960784, 0.0078431373, 0.8470588235294118, 0.9764705882, 0.9058823529, 0.0078431373, 0.8509803921568627, 0.9764705882, 0.9176470588, 0.0078431373, 0.8549019607843137, 0.9764705882, 0.9333333333, 0.0039215686, 0.8588235294117647, 0.9725490196, 0.9490196078, 0.0039215686, 0.8627450980392157, 0.9725490196, 0.9647058824, 0.0039215686, 0.8666666666666667, 0.9725490196, 0.9803921569, 0.0039215686, 0.8705882352941177, 0.9725490196, 0.9960784314, 0.0039215686, 0.8745098039215686, 0.9725490196, 0.9960784314, 0.0039215686, 0.8784313725490196, 0.9725490196, 0.9960784314, 0.0352941176, 0.8823529411764706, 0.9725490196, 0.9960784314, 0.0666666667, 0.8862745098039215, 0.9725490196, 0.9960784314, 0.0980392157, 0.8901960784313725, 0.9725490196, 0.9960784314, 0.1294117647, 0.8941176470588236, 0.9725490196, 0.9960784314, 0.1647058824, 0.8980392156862745, 0.9764705882, 0.9960784314, 0.1960784314, 0.9019607843137255, 0.9764705882, 0.9960784314, 0.2274509804, 0.9058823529411765, 0.9764705882, 0.9960784314, 0.2549019608, 0.9098039215686274, 0.9764705882, 0.9960784314, 0.2901960784, 0.9137254901960784, 0.9764705882, 0.9960784314, 0.3215686275, 0.9176470588235294, 0.9803921569, 0.9960784314, 0.3529411765, 0.9215686274509803, 0.9803921569, 0.9960784314, 0.3843137255, 0.9254901960784314, 0.9803921569, 0.9960784314, 0.4156862745, 0.9294117647058824, 0.9803921569, 0.9960784314, 0.4509803922, 0.9333333333333333, 0.9803921569, 0.9960784314, 0.4823529412, 0.9372549019607843, 0.9843137255, 0.9960784314, 0.5137254902, 0.9411764705882354, 0.9843137255, 0.9960784314, 0.5450980392, 0.9450980392156864, 0.9843137255, 0.9960784314, 0.5803921569, 0.9490196078431372, 0.9843137255, 0.9960784314, 0.6117647059, 0.9529411764705882, 0.9843137255, 0.9960784314, 0.6431372549, 0.9568627450980394, 0.9882352941, 0.9960784314, 0.6745098039, 0.9607843137254903, 0.9882352941, 0.9960784314, 0.7058823529, 0.9647058823529413, 0.9882352941, 0.9960784314, 0.7411764706, 0.9686274509803922, 0.9882352941, 0.9960784314, 0.768627451, 0.9725490196078431, 0.9882352941, 0.9960784314, 0.8, 0.9764705882352941, 0.9921568627, 0.9960784314, 0.831372549, 0.9803921568627451, 0.9921568627, 0.9960784314, 0.8666666667, 0.984313725490196, 0.9921568627, 0.9960784314, 0.8980392157, 0.9882352941176471, 0.9921568627, 0.9960784314, 0.9294117647, 0.9921568627450981, 0.9921568627, 0.9960784314, 0.9607843137, 0.996078431372549, 0.9960784314, 0.9960784314, 0.9607843137, 1.0, 0.9960784314, 0.9960784314, 0.9607843137],
  description: 'Siemens'
}];

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js + 2 modules
var esm_enums = __webpack_require__(99737);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/stores/useLutPresentationStore.ts
var useLutPresentationStore = __webpack_require__(10182);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/stores/usePositionPresentationStore.ts
var usePositionPresentationStore = __webpack_require__(44646);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/stores/useSegmentationPresentationStore.ts + 1 modules
var useSegmentationPresentationStore = __webpack_require__(2847);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/index.js + 46 modules
var esm_utilities = __webpack_require__(33592);
;// ../../../extensions/cornerstone/src/utils/initWebWorkerProgressHandler.ts



/**
 * Initializes a handler for web worker progress events.
 * Tracks active worker tasks and shows notifications for their progress.
 *
 * @param uiNotificationService - The UI notification service for showing progress notifications
 */
function initializeWebWorkerProgressHandler(uiNotificationService) {
  // Use a single map to track all active worker tasks
  const activeWorkerTasks = new Map();

  // Create a normalized task key that doesn't include the random ID
  // This helps us identify and deduplicate the same type of task
  const getNormalizedTaskKey = type => {
    return `worker-task-${type.toLowerCase().replace(/\s+/g, '-')}`;
  };
  esm.eventTarget.addEventListener(esm.EVENTS.WEB_WORKER_PROGRESS, ({
    detail
  }) => {
    let normalizedKey;
    let shouldCleanup = false;
    try {
      const {
        progress,
        type,
        id
      } = detail;

      // Skip notifications for compute statistics
      if (type === dist_esm.Enums.WorkerTypes.COMPUTE_STATISTICS) {
        return;
      }
      normalizedKey = getNormalizedTaskKey(type);
      if (progress === 0) {
        // Check if we're already tracking a task of this type
        if (!activeWorkerTasks.has(normalizedKey)) {
          const progressPromise = new Promise((resolve, reject) => {
            try {
              activeWorkerTasks.set(normalizedKey, {
                resolve,
                reject,
                originalId: id,
                type
              });
            } catch (error) {
              console.error(`Error setting active worker task for type "${type}":`, error);
              reject(error);
              throw error; // Re-throw to trigger outer catch and cleanup
            }
          });
          try {
            uiNotificationService.show({
              id: normalizedKey,
              // Use the normalized key as ID for better deduplication
              title: `${type}`,
              message: `Computing...`,
              autoClose: false,
              allowDuplicates: false,
              deduplicationInterval: 60000,
              // 60 seconds - prevent frequent notifications of same type
              promise: progressPromise,
              promiseMessages: {
                loading: `Computing...`,
                success: `Completed successfully`,
                error: 'Web Worker failed'
              }
            });
          } catch (error) {
            console.error(`Error showing web worker notification for type "${type}":`, error);
            shouldCleanup = true;
            throw error;
          }
        } else {
          // Already tracking this type of task, just let it continue
          console.debug(`Already tracking a "${type}" task, skipping duplicate notification`);
        }
      }
      // Task completed
      else if (progress === 100) {
        // Check if we have this task type in our tracking map
        const taskData = activeWorkerTasks.get(normalizedKey);
        if (taskData) {
          // Resolve the promise to update the notification
          const {
            resolve
          } = taskData;
          resolve({
            progress,
            type
          });

          // Mark for cleanup
          shouldCleanup = true;
          console.debug(`Worker task "${type}" completed successfully`);
        }
      }
    } catch (error) {
      console.error(`Error in web worker progress handler for type "${detail?.type}":`, error);
      shouldCleanup = true;
    } finally {
      // Clean up if needed
      if (shouldCleanup && normalizedKey) {
        try {
          activeWorkerTasks.delete(normalizedKey);
        } catch (cleanupError) {
          console.error(`Error cleaning up active worker task for type "${detail?.type}":`, cleanupError);
        }
      }
    }
  });
}
;// ../../../extensions/cornerstone/src/init.tsx

























const {
  registerColormap
} = esm.utilities.colormap;

// TODO: Cypress tests are currently grabbing this from the window?
window.cornerstone = esm;
window.cornerstoneTools = dist_esm;
/**
 *
 */
async function init({
  servicesManager,
  commandsManager,
  extensionManager,
  appConfig
}) {
  // Note: this should run first before initializing the cornerstone
  // DO NOT CHANGE THE ORDER

  await (0,esm.init)({
    peerImport: appConfig.peerImport
  });

  // For debugging e2e tests that are failing on CI
  esm.setUseCPURendering(Boolean(appConfig.useCPURendering));
  esm.setConfiguration({
    ...esm.getConfiguration(),
    rendering: {
      ...esm.getConfiguration().rendering,
      strictZSpacingForVolumeViewport: appConfig.strictZSpacingForVolumeViewport
    }
  });

  // For debugging large datasets, otherwise prefer the defaults
  const {
    maxCacheSize
  } = appConfig;
  if (maxCacheSize) {
    esm.cache.setMaxCacheSize(maxCacheSize);
  }
  initCornerstoneTools();
  esm.Settings.getRuntimeSettings().set('useCursors', Boolean(appConfig.useCursors));
  const {
    userAuthenticationService,
    customizationService,
    uiModalService,
    uiNotificationService,
    cornerstoneViewportService,
    hangingProtocolService,
    viewportGridService,
    segmentationService,
    measurementService,
    colorbarService,
    displaySetService,
    toolbarService
  } = servicesManager.services;
  toolbarService.registerEventForToolbarUpdate(colorbarService, [colorbarService.EVENTS.STATE_CHANGED]);
  window.services = servicesManager.services;
  window.extensionManager = extensionManager;
  window.commandsManager = commandsManager;
  if (appConfig.showCPUFallbackMessage && esm.getShouldUseCPURendering()) {
    _showCPURenderingModal(uiModalService, hangingProtocolService);
  }
  const {
    getPresentationId: getLutPresentationId
  } = useLutPresentationStore/* useLutPresentationStore */.I.getState();
  const {
    getPresentationId: getSegmentationPresentationId
  } = useSegmentationPresentationStore/* useSegmentationPresentationStore */.v.getState();
  const {
    getPresentationId: getPositionPresentationId
  } = usePositionPresentationStore/* usePositionPresentationStore */.q.getState();

  // register presentation id providers
  viewportGridService.addPresentationIdProvider('positionPresentationId', getPositionPresentationId);
  viewportGridService.addPresentationIdProvider('lutPresentationId', getLutPresentationId);
  viewportGridService.addPresentationIdProvider('segmentationPresentationId', getSegmentationPresentationId);
  dist_esm.segmentation.config.style.setStyle({
    type: esm_enums.SegmentationRepresentations.Contour
  }, {
    renderFill: false
  });
  const metadataProvider = src["default"].classes.MetadataProvider;
  esm.volumeLoader.registerVolumeLoader('cornerstoneStreamingImageVolume', loaders/* cornerstoneStreamingImageVolumeLoader */.FC);
  esm.volumeLoader.registerVolumeLoader('cornerstoneStreamingDynamicImageVolume', loaders/* cornerstoneStreamingDynamicImageVolumeLoader */.Mr);

  // Register strategies using the wrapper
  const imageLoadStrategies = {
    interleaveCenter: interleaveCenterLoader,
    interleaveTopToBottom: interleaveTopToBottom,
    nth: interleaveNthLoader
  };
  Object.entries(imageLoadStrategies).forEach(([name, strategyFn]) => {
    hangingProtocolService.registerImageLoadStrategy(name, createMetadataWrappedStrategy(strategyFn));
  });

  // add metadata providers
  esm.metaData.addProvider(esm.utilities.calibratedPixelSpacingMetadataProvider.get.bind(esm.utilities.calibratedPixelSpacingMetadataProvider)); // this provider is required for Calibration tool
  esm.metaData.addProvider(metadataProvider.get.bind(metadataProvider), 9999);

  // These are set reasonably low to allow for interleaved retrieves and slower
  // connections.
  esm.imageLoadPoolManager.maxNumRequests = {
    [RequestType/* default */.A.Interaction]: appConfig?.maxNumRequests?.interaction || 10,
    [RequestType/* default */.A.Thumbnail]: appConfig?.maxNumRequests?.thumbnail || 5,
    [RequestType/* default */.A.Prefetch]: appConfig?.maxNumRequests?.prefetch || 5,
    [RequestType/* default */.A.Compute]: appConfig?.maxNumRequests?.compute || 10
  };
  initWADOImageLoader(userAuthenticationService, appConfig, extensionManager);

  /* Measurement Service */
  this.measurementServiceSource = connectToolsToMeasurementService({
    servicesManager,
    commandsManager,
    extensionManager
  });
  src_initCineService(servicesManager);
  src_initStudyPrefetcherService(servicesManager);
  measurementService.subscribe(measurementService.EVENTS.JUMP_TO_MEASUREMENT, evt => {
    const {
      measurement
    } = evt;
    const {
      uid: annotationUID
    } = measurement;
    commandsManager.runCommand('jumpToMeasurementViewport', {
      measurement,
      annotationUID,
      evt
    });
  });

  // When a custom image load is performed, update the relevant viewports
  hangingProtocolService.subscribe(hangingProtocolService.EVENTS.CUSTOM_IMAGE_LOAD_PERFORMED, volumeInputArrayMap => {
    const {
      lutPresentationStore
    } = useLutPresentationStore/* useLutPresentationStore */.I.getState();
    const {
      segmentationPresentationStore
    } = useSegmentationPresentationStore/* useSegmentationPresentationStore */.v.getState();
    const {
      positionPresentationStore
    } = usePositionPresentationStore/* usePositionPresentationStore */.q.getState();
    for (const entry of volumeInputArrayMap.entries()) {
      const [viewportId, volumeInputArray] = entry;
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      const ohifViewport = cornerstoneViewportService.getViewportInfo(viewportId);
      const {
        presentationIds
      } = ohifViewport.getViewportOptions();
      const presentations = {
        positionPresentation: positionPresentationStore[presentationIds?.positionPresentationId],
        lutPresentation: lutPresentationStore[presentationIds?.lutPresentationId],
        segmentationPresentation: segmentationPresentationStore[presentationIds?.segmentationPresentationId]
      };
      cornerstoneViewportService.setVolumesForViewport(viewport, volumeInputArray, presentations);
    }
  });
  src_initContextMenu({
    cornerstoneViewportService,
    customizationService,
    commandsManager
  });
  src_initDoubleClick({
    customizationService,
    commandsManager
  });

  /**
   * Runs error handler for failed requests.
   * @param event
   */
  const imageLoadFailedHandler = ({
    detail
  }) => {
    const handler = src.errorHandler.getHTTPErrorHandler();
    handler(detail.error);
  };
  esm.eventTarget.addEventListener(esm.EVENTS.IMAGE_LOAD_FAILED, imageLoadFailedHandler);
  esm.eventTarget.addEventListener(esm.EVENTS.IMAGE_LOAD_ERROR, imageLoadFailedHandler);
  const getDisplaySetFromVolumeId = volumeId => {
    const allDisplaySets = displaySetService.getActiveDisplaySets();
    const volume = esm.cache.getVolume(volumeId);
    const imageIds = volume.imageIds;
    return allDisplaySets.find(ds => ds.imageIds?.some(id => imageIds.includes(id)));
  };
  function elementEnabledHandler(evt) {
    const {
      element
    } = evt.detail;
    const {
      viewport
    } = (0,esm.getEnabledElement)(element);
    initViewTiming({
      element
    });
    element.addEventListener(esm.EVENTS.CAMERA_RESET, evt => {
      const {
        element
      } = evt.detail;
      const enabledElement = (0,esm.getEnabledElement)(element);
      if (!enabledElement) {
        return;
      }
      const {
        viewportId
      } = enabledElement;
      commandsManager.runCommand('resetCrosshairs', {
        viewportId
      });
    });

    // limitation: currently supporting only volume viewports with fusion
    if (viewport.type !== esm.Enums.ViewportType.ORTHOGRAPHIC) {
      return;
    }
  }
  esm.eventTarget.addEventListener(esm.EVENTS.ELEMENT_ENABLED, elementEnabledHandler.bind(null));
  colormaps.forEach(registerColormap);

  // Event listener
  esm.eventTarget.addEventListenerDebounced(esm.EVENTS.ERROR_EVENT, ({
    detail
  }) => {
    // Create a stable ID for deduplication based on error type and message
    const errorId = `cornerstone-error-${detail.type}-${detail.message.substring(0, 50)}`;
    uiNotificationService.show({
      title: detail.type,
      message: detail.message,
      type: 'error',
      id: errorId,
      allowDuplicates: false,
      // Prevent duplicate error notifications
      deduplicationInterval: 30000 // 30 seconds deduplication window
    });
  }, 100);

  // Subscribe to actor events to dynamically update colorbars

  // Call this function when initializing
  initializeWebWorkerProgressHandler(servicesManager.services.uiNotificationService);
}

/**
 * Creates a wrapped image load strategy with metadata handling
 * @param strategyFn - The image loading strategy function to wrap
 * @returns A wrapped strategy function that handles metadata configuration
 */
const createMetadataWrappedStrategy = strategyFn => {
  return args => {
    const clonedConfig = esm_utilities.imageRetrieveMetadataProvider.clone();
    esm_utilities.imageRetrieveMetadataProvider.clear();
    try {
      const result = strategyFn(args);
      return result;
    } finally {
      // Ensure metadata is always restored, even if there's an error
      setTimeout(() => {
        esm_utilities.imageRetrieveMetadataProvider.restore(clonedConfig);
      }, 10);
    }
  };
};
function CPUModal() {
  return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement("p", null, "Your computer does not have enough GPU power to support the default GPU rendering mode. OHIF has switched to CPU rendering mode. Please note that CPU rendering does not support all features such as Volume Rendering, Multiplanar Reconstruction, and Segmentation Overlays."));
}
function _showCPURenderingModal(uiModalService, hangingProtocolService) {
  const callback = progress => {
    if (progress === 100) {
      uiModalService.show({
        content: CPUModal,
        title: 'OHIF Fell Back to CPU Rendering'
      });
      return true;
    }
  };
  const {
    unsubscribe
  } = hangingProtocolService.subscribe(hangingProtocolService.EVENTS.PROTOCOL_CHANGED, () => {
    const done = callback(100);
    if (done) {
      unsubscribe();
    }
  });
}
;// ../../../extensions/cornerstone/src/customizations/viewportOverlayCustomization.tsx
/* harmony default export */ const viewportOverlayCustomization = ({
  'viewportOverlay.topLeft': [{
    id: 'StudyDate',
    inheritsFrom: 'ohif.overlayItem',
    label: '',
    title: 'Study date',
    condition: ({
      referenceInstance
    }) => referenceInstance?.StudyDate,
    contentF: ({
      referenceInstance,
      formatters: {
        formatDate
      }
    }) => formatDate(referenceInstance.StudyDate)
  }, {
    id: 'SeriesDescription',
    inheritsFrom: 'ohif.overlayItem',
    label: '',
    title: 'Series description',
    condition: ({
      referenceInstance
    }) => {
      return referenceInstance && referenceInstance.SeriesDescription;
    },
    contentF: ({
      referenceInstance
    }) => referenceInstance.SeriesDescription
  }],
  'viewportOverlay.topRight': [],
  'viewportOverlay.bottomLeft': [{
    id: 'WindowLevel',
    inheritsFrom: 'ohif.overlayItem.windowLevel'
  }, {
    id: 'ZoomLevel',
    inheritsFrom: 'ohif.overlayItem.zoomLevel',
    condition: props => {
      const activeToolName = props.toolGroupService.getActiveToolForViewport(props.viewportId);
      return activeToolName === 'Zoom';
    }
  }],
  'viewportOverlay.bottomRight': [{
    id: 'InstanceNumber',
    inheritsFrom: 'ohif.overlayItem.instanceNumber'
  }]
});
// EXTERNAL MODULE: ../../ui-next/src/index.ts + 3073 modules
var ui_next_src = __webpack_require__(17130);
// EXTERNAL MODULE: ../../../node_modules/react-i18next/dist/es/index.js + 15 modules
var es = __webpack_require__(99993);
;// ../../../extensions/cornerstone/src/customizations/CustomDropdownMenuContent.tsx





/**
 * Custom dropdown menu component for segmentation panel that uses context for data
 */
const CustomDropdownMenuContent = () => {
  const {
    commandsManager
  } = (0,src.useSystem)();
  const {
    t
  } = (0,es/* useTranslation */.Bd)('SegmentationTable');
  const {
    onSegmentationAdd,
    onSegmentationRemoveFromViewport,
    onSegmentationEdit,
    onSegmentationDelete,
    exportOptions,
    activeSegmentation,
    activeSegmentationId
  } = (0,ui_next_src/* useSegmentationTableContext */.dQ$)('CustomDropdownMenu');

  // Try to get segmentation data from expanded context first, fall back to table context
  let segmentation;
  let segmentationId;
  let allowExport = false;
  try {
    // Try to get from expanded context
    const context = (0,ui_next_src/* useSegmentationExpanded */.dPM)();
    segmentation = context.segmentation;
    segmentationId = segmentation.segmentationId;
  } catch (e) {
    // If not in expanded context, fallback to active segmentation from table context
    segmentation = activeSegmentation;
    segmentationId = activeSegmentationId;
  }

  // Determine if export is allowed for this segmentation
  if (exportOptions && segmentationId) {
    const exportOption = exportOptions.find(opt => opt.segmentationId === segmentationId);
    allowExport = exportOption?.isExportable || false;
  }
  if (!segmentation || !segmentationId) {
    return null;
  }
  const actions = {
    storeSegmentation: async segmentationId => {
      commandsManager.run({
        commandName: 'storeSegmentation',
        commandOptions: {
          segmentationId
        },
        context: 'CORNERSTONE'
      });
    },
    onSegmentationDownloadRTSS: segmentationId => {
      commandsManager.run('downloadRTSS', {
        segmentationId
      });
    },
    onSegmentationDownload: segmentationId => {
      commandsManager.run('downloadSegmentation', {
        segmentationId
      });
    },
    downloadCSVSegmentationReport: segmentationId => {
      commandsManager.run('downloadCSVSegmentationReport', {
        segmentationId
      });
    }
  };
  return /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuContent */.SQm, {
    align: "start"
  }, /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuItem */._26, {
    onClick: () => onSegmentationAdd(segmentationId)
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Add, {
    className: "text-foreground"
  }), /*#__PURE__*/react.createElement("span", {
    className: "pl-2"
  }, t('Create New Segmentation'))), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuSeparator */.mBJ, null), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuLabel */.lpj, null, t('Manage Current Segmentation')), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuItem */._26, {
    onClick: () => onSegmentationRemoveFromViewport(segmentationId)
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Series, {
    className: "text-foreground"
  }), /*#__PURE__*/react.createElement("span", {
    className: "pl-2"
  }, t('Remove from Viewport'))), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuItem */._26, {
    onClick: () => onSegmentationEdit(segmentationId)
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Rename, {
    className: "text-foreground"
  }), /*#__PURE__*/react.createElement("span", {
    className: "pl-2"
  }, t('Rename'))), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuSub */.lvB, null, /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuSubTrigger */.nVd, {
    className: "pl-1"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Export, {
    className: "text-foreground"
  }), /*#__PURE__*/react.createElement("span", {
    className: "pl-2"
  }, t('Download & Export'))), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuPortal */.dce, null, /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuSubContent */.M56, null, /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuLabel */.lpj, {
    className: "flex items-center pl-0"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Download, {
    className: "h-5 w-5"
  }), /*#__PURE__*/react.createElement("span", {
    className: "pl-1"
  }, t('Download'))), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuItem */._26, {
    onClick: e => {
      e.preventDefault();
      actions.downloadCSVSegmentationReport(segmentationId);
    },
    disabled: !allowExport
  }, t('CSV Report')), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuItem */._26, {
    onClick: e => {
      e.preventDefault();
      actions.onSegmentationDownload(segmentationId);
    },
    disabled: !allowExport
  }, t('DICOM SEG')), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuItem */._26, {
    onClick: e => {
      e.preventDefault();
      actions.onSegmentationDownloadRTSS(segmentationId);
    },
    disabled: !allowExport
  }, t('DICOM RTSS')), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuSeparator */.mBJ, null), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuLabel */.lpj, {
    className: "flex items-center pl-0"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Export, {
    className: "h-5 w-5"
  }), /*#__PURE__*/react.createElement("span", {
    className: "pl-1 pt-1"
  }, t('Export'))), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuItem */._26, {
    onClick: e => {
      e.preventDefault();
      actions.storeSegmentation(segmentationId);
    },
    disabled: !allowExport
  }, t('DICOM SEG'))))), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuSeparator */.mBJ, null), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuItem */._26, {
    onClick: () => onSegmentationDelete(segmentationId)
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Delete, {
    className: "text-red-600"
  }), /*#__PURE__*/react.createElement("span", {
    className: "pl-2 text-red-600"
  }, t('Delete'))));
};
;// ../../../extensions/cornerstone/src/customizations/CustomSegmentStatisticsHeader.tsx






/**
 * Custom header component for segment statistics
 */
const CustomSegmentStatisticsHeader = ({
  segmentationId,
  segmentIndex
}) => {
  const {
    servicesManager,
    commandsManager
  } = (0,src.useSystem)();
  const {
    segmentationService
  } = servicesManager.services;
  const {
    t
  } = (0,es/* useTranslation */.Bd)('SegmentationTable');
  const segmentation = segmentationService.getSegmentation(segmentationId);
  const segment = segmentation.segments[segmentIndex];
  const cachedStats = segment.cachedStats;
  const namedStats = cachedStats.namedStats;
  if (!namedStats) {
    return null;
  }
  const bidirectional = namedStats.bidirectional;
  if (!bidirectional) {
    return /*#__PURE__*/react.createElement("div", {
      className: "-mt-2 space-y-2"
    }, /*#__PURE__*/react.createElement("div", {
      className: "flex"
    }, /*#__PURE__*/react.createElement(ui_next_src/* Tooltip */.m_M, null, /*#__PURE__*/react.createElement(ui_next_src/* TooltipTrigger */.k$k, {
      asChild: true
    }, /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
      variant: "ghost",
      size: "sm",
      className: "text-primary flex items-center gap-2",
      onClick: () => {
        commandsManager.run('runSegmentBidirectional', {
          segmentationId,
          segmentIndex
        });
      }
    }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ToolBidirectionalSegment, {
      className: "h-5 w-5"
    }), /*#__PURE__*/react.createElement("span", null, t('Compute Largest Bidirectional')))), /*#__PURE__*/react.createElement(ui_next_src/* TooltipContent */.ZIw, {
      side: "bottom"
    }, t('Add bidirectional measurement')))), /*#__PURE__*/react.createElement(ui_next_src/* Separator */.wvv, {
      className: "bg-input"
    }));
  }
  const {
    value,
    unit
  } = bidirectional;
  const maxMajor = value.maxMajor;
  const maxMinor = value.maxMinor;
  const max = Math.max(maxMajor, maxMinor);
  const min = Math.min(maxMajor, maxMinor);
  const isVisible = dist_esm.annotation.visibility.isAnnotationVisible(bidirectional.annotationUID);
  return /*#__PURE__*/react.createElement("div", {
    className: "-mt-2 space-y-2"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/react.createElement("div", {
    className: "text-foreground"
  }, /*#__PURE__*/react.createElement("div", null, "L: ", (0,utils/* roundNumber */.Wf)(max), " ", unit), /*#__PURE__*/react.createElement("div", null, "W: ", (0,utils/* roundNumber */.Wf)(min), " ", unit)), /*#__PURE__*/react.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Tooltip */.m_M, null, /*#__PURE__*/react.createElement(ui_next_src/* TooltipTrigger */.k$k, {
    asChild: true
  }, /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    size: "icon",
    variant: "ghost",
    className: `h-6 w-6 transition-opacity`,
    onClick: e => {
      e.stopPropagation();
      dist_esm.annotation.visibility.setAnnotationVisibility(bidirectional.annotationUID, !isVisible);
      segmentationService.addOrUpdateSegmentation({
        segmentationId,
        segmentIndex
      });
    }
  }, isVisible ? /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Hide, {
    className: "h-6 w-6"
  }) : /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Show, {
    className: "h-6 w-6"
  }))), /*#__PURE__*/react.createElement(ui_next_src/* TooltipContent */.ZIw, {
    side: "bottom"
  }, t('Toggle visibility'))), /*#__PURE__*/react.createElement(ui_next_src/* Tooltip */.m_M, null, /*#__PURE__*/react.createElement(ui_next_src/* TooltipTrigger */.k$k, {
    asChild: true
  }, /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    size: "icon",
    onClick: () => {
      if (bidirectional.annotationUID) {
        commandsManager.run('jumpToMeasurement', {
          uid: bidirectional.annotationUID
        });
      }
    }
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.JumpToSlice, null))), /*#__PURE__*/react.createElement(ui_next_src/* TooltipContent */.ZIw, {
    side: "bottom"
  }, t('Jump to measurement'))))), /*#__PURE__*/react.createElement(ui_next_src/* Separator */.wvv, {
    className: "bg-input"
  }));
};
;// ../../../extensions/cornerstone/src/customizations/segmentationPanelCustomization.tsx




function getSegmentationPanelCustomization({
  commandsManager,
  servicesManager
}) {
  return {
    'panelSegmentation.customDropdownMenuContent': CustomDropdownMenuContent,
    'panelSegmentation.customSegmentStatisticsHeader': CustomSegmentStatisticsHeader,
    'panelSegmentation.disableEditing': false,
    'panelSegmentation.showAddSegment': true,
    'panelSegmentation.onSegmentationAdd': () => {
      const {
        viewportGridService
      } = servicesManager.services;
      const viewportId = viewportGridService.getState().activeViewportId;
      commandsManager.run('createLabelmapForViewport', {
        viewportId
      });
    },
    'panelSegmentation.tableMode': 'collapsed',
    'panelSegmentation.readableText': {
      // the values will appear in this order
      min: 'Min Value',
      minLPS: 'Min Coord',
      max: 'Max Value',
      maxLPS: 'Max Coord',
      mean: 'Mean Value',
      stdDev: 'Standard Deviation',
      count: 'Voxel Count',
      median: 'Median',
      skewness: 'Skewness',
      kurtosis: 'Kurtosis',
      peakValue: 'Peak Value',
      peakLPS: 'Peak Coord',
      volume: 'Volume',
      lesionGlycolysis: 'Lesion Glycolysis',
      center: 'Center'
    },
    'segmentationToolbox.config': () => {
      // Get initial states based on current configuration
      const [previewEdits, setPreviewEdits] = (0,react.useState)(false);
      const [toggleSegmentEnabled, setToggleSegmentEnabled] = (0,react.useState)(false);
      const [useCenterAsSegmentIndex, setUseCenterAsSegmentIndex] = (0,react.useState)(false);
      const handlePreviewEditsChange = checked => {
        setPreviewEdits(checked);
        commandsManager.run('toggleSegmentPreviewEdit', {
          toggle: checked
        });
      };
      const handleToggleSegmentEnabledChange = checked => {
        setToggleSegmentEnabled(checked);
        commandsManager.run('toggleSegmentSelect', {
          toggle: checked
        });
      };
      const handleUseCenterAsSegmentIndexChange = checked => {
        setUseCenterAsSegmentIndex(checked);
        commandsManager.run('toggleUseCenterSegmentIndex', {
          toggle: checked
        });
      };
      return /*#__PURE__*/react.createElement("div", {
        className: "bg-muted flex flex-col gap-4 border-b border-b-[2px] border-black px-2 py-3"
      }, /*#__PURE__*/react.createElement("div", {
        className: "flex items-center gap-2"
      }, /*#__PURE__*/react.createElement(ui_next_src/* Switch */.dOG, {
        checked: previewEdits,
        onCheckedChange: handlePreviewEditsChange
      }), /*#__PURE__*/react.createElement("span", {
        className: "text-base text-white"
      }, "Preview edits before creating")), /*#__PURE__*/react.createElement("div", {
        className: "flex items-center gap-2"
      }, /*#__PURE__*/react.createElement(ui_next_src/* Switch */.dOG, {
        checked: useCenterAsSegmentIndex,
        onCheckedChange: handleUseCenterAsSegmentIndexChange
      }), /*#__PURE__*/react.createElement("span", {
        className: "text-base text-white"
      }, "Use center as segment index")), /*#__PURE__*/react.createElement("div", {
        className: "flex items-center gap-2"
      }, /*#__PURE__*/react.createElement(ui_next_src/* Switch */.dOG, {
        checked: toggleSegmentEnabled,
        onCheckedChange: handleToggleSegmentEnabledChange
      }), /*#__PURE__*/react.createElement("span", {
        className: "text-base text-white"
      }, "Hover on segment border to activate")));
    }
  };
}
;// ../../../extensions/cornerstone/src/customizations/layoutSelectorCustomization.ts
/* harmony default export */ const layoutSelectorCustomization = ({
  'layoutSelector.advancedPresetGenerator': ({
    servicesManager
  }) => {
    const _areSelectorsValid = (hp, displaySets, hangingProtocolService) => {
      if (!hp.displaySetSelectors || Object.values(hp.displaySetSelectors).length === 0) {
        return true;
      }
      return hangingProtocolService.areRequiredSelectorsValid(Object.values(hp.displaySetSelectors), displaySets[0]);
    };
    const generateAdvancedPresets = ({
      servicesManager
    }) => {
      const {
        hangingProtocolService,
        viewportGridService,
        displaySetService
      } = servicesManager.services;
      const hangingProtocols = Array.from(hangingProtocolService.protocols.values());
      const viewportId = viewportGridService.getActiveViewportId();
      if (!viewportId) {
        return [];
      }
      const displaySetInstanceUIDs = viewportGridService.getDisplaySetsUIDsForViewport(viewportId);
      if (!displaySetInstanceUIDs) {
        return [];
      }
      const displaySets = displaySetInstanceUIDs.map(uid => {
        const displaySet = displaySetService.getDisplaySetByUID(uid);
        const referencedDisplaySetUID = displaySet?.measurements?.[0]?.displaySetInstanceUID;
        if (displaySet.Modality === 'SR' && referencedDisplaySetUID) {
          return displaySetService.getDisplaySetByUID(referencedDisplaySetUID);
        }
        return displaySet;
      });
      return hangingProtocols.map(hp => {
        if (!hp.isPreset) {
          return null;
        }
        const areValid = _areSelectorsValid(hp, displaySets, hangingProtocolService);
        return {
          icon: hp.icon,
          title: hp.name,
          commandOptions: {
            protocolId: hp.id
          },
          disabled: !areValid
        };
      }).filter(preset => preset !== null);
    };
    return generateAdvancedPresets({
      servicesManager
    });
  },
  'layoutSelector.commonPresets': [{
    icon: 'layout-common-1x1',
    commandOptions: {
      numRows: 1,
      numCols: 1
    }
  }, {
    icon: 'layout-common-1x2',
    commandOptions: {
      numRows: 1,
      numCols: 2
    }
  }, {
    icon: 'layout-common-2x2',
    commandOptions: {
      numRows: 2,
      numCols: 2
    }
  }, {
    icon: 'layout-common-2x3',
    commandOptions: {
      numRows: 2,
      numCols: 3
    }
  }]
});
;// ../../../extensions/cornerstone/src/customizations/viewportToolsCustomization.ts


/* harmony default export */ const viewportToolsCustomization = ({
  'cornerstone.overlayViewportTools': {
    active: [{
      toolName: toolNames.WindowLevel,
      bindings: [{
        mouseButton: dist_esm.Enums.MouseBindings.Primary
      }]
    }, {
      toolName: toolNames.Pan,
      bindings: [{
        mouseButton: dist_esm.Enums.MouseBindings.Auxiliary
      }]
    }, {
      toolName: toolNames.Zoom,
      bindings: [{
        mouseButton: dist_esm.Enums.MouseBindings.Secondary
      }, {
        numTouchPoints: 2
      }]
    }, {
      toolName: toolNames.StackScroll,
      bindings: [{
        mouseButton: dist_esm.Enums.MouseBindings.Wheel
      }, {
        numTouchPoints: 3
      }]
    }],
    enabled: [{
      toolName: toolNames.PlanarFreehandContourSegmentation,
      configuration: {
        displayOnePointAsCrosshairs: true
      }
    }]
  }
});
;// ../../../extensions/cornerstone/src/customizations/viewportClickCommandsCustomization.ts
/* harmony default export */ const viewportClickCommandsCustomization = ({
  cornerstoneViewportClickCommands: {
    doubleClick: ['toggleOneUp'],
    button1: ['closeContextMenu'],
    button3: [{
      commandName: 'showCornerstoneContextMenu',
      commandOptions: {
        requireNearbyToolData: true,
        menuId: 'measurementsContextMenu'
      }
    }]
  }
});
;// ../../../extensions/cornerstone/src/customizations/measurementsCustomization.ts
/* harmony default export */ const measurementsCustomization = ({
  'cornerstone.measurements': {
    Angle: {
      displayText: [],
      report: []
    },
    CobbAngle: {
      displayText: [],
      report: []
    },
    ArrowAnnotate: {
      displayText: [],
      report: []
    },
    RectangleROi: {
      displayText: [],
      report: []
    },
    CircleROI: {
      displayText: [],
      report: []
    },
    EllipticalROI: {
      displayText: [],
      report: []
    },
    Bidirectional: {
      displayText: [],
      report: []
    },
    Length: {
      displayText: [],
      report: []
    },
    LivewireContour: {
      displayText: [],
      report: []
    },
    SplineROI: {
      displayText: [{
        displayName: 'Areas',
        value: 'area',
        type: 'value'
      }, {
        value: 'areaUnits',
        for: ['area'],
        type: 'unit'
      }],
      report: [{
        displayName: 'Area',
        value: 'area',
        type: 'value'
      }, {
        displayName: 'Unit',
        value: 'areaUnits',
        type: 'value'
      }]
    },
    PlanarFreehandROI: {
      displayTextOpen: [{
        displayName: 'Length',
        value: 'length',
        type: 'value'
      }],
      displayText: [{
        displayName: 'Mean',
        value: 'mean',
        type: 'value'
      }, {
        displayName: 'Max',
        value: 'max',
        type: 'value'
      }, {
        displayName: 'Area',
        value: 'area',
        type: 'value'
      }, {
        value: 'pixelValueUnits',
        for: ['mean', 'max'],
        type: 'unit'
      }, {
        value: 'areaUnits',
        for: ['area'],
        type: 'unit'
      }],
      report: [{
        displayName: 'Mean',
        value: 'mean',
        type: 'value'
      }, {
        displayName: 'Max',
        value: 'max',
        type: 'value'
      }, {
        displayName: 'Area',
        value: 'area',
        type: 'value'
      }, {
        displayName: 'Unit',
        value: 'unit',
        type: 'value'
      }]
    }
  }
});
;// ../../../extensions/cornerstone/src/customizations/volumeRenderingCustomization.ts

const {
  VIEWPORT_PRESETS
} = esm.CONSTANTS;
/* harmony default export */ const volumeRenderingCustomization = ({
  'cornerstone.3dVolumeRendering': {
    volumeRenderingPresets: VIEWPORT_PRESETS,
    volumeRenderingQualityRange: {
      min: 1,
      max: 4,
      step: 1
    }
  }
});
;// ../../../extensions/cornerstone/src/customizations/colorbarCustomization.ts

const defaultPosition = 'bottom';
const DefaultColormap = 'Grayscale';
const positionStyles = {
  left: {
    width: '15px'
  },
  right: {
    width: '15px'
  },
  bottom: {
    height: '15px'
  }
};

// Typed position-specific tick styles
const positionTickStyles = {
  bottom: {
    position: 'top',
    style: {
      labelOffset: 5,
      labelMargin: 13
    }
  },
  right: {
    position: 'left',
    style: {
      labelMargin: 5
    }
  },
  left: {
    position: 'right',
    style: {
      labelMargin: 5
    }
  },
  top: {
    position: 'bottom',
    style: {
      labelMargin: 5
    }
  }
};

// Get recommended tick position for a given colorbar position
const getTickPositionForPosition = position => {
  if (position === 'bottom') {
    return 'top';
  } else if (position === 'top') {
    return 'bottom';
  } else if (position === 'left') {
    return 'right';
  } else if (position === 'right') {
    return 'left';
  }
  return positionTickStyles[position]?.position || 'top';
};

// Container styles for colorbar
const containerStyles = {
  cursor: 'initial'
};

// Tick styling
const tickStyles = {
  font: '12px Arial',
  color: '#fff',
  maxNumTicks: 6,
  tickSize: 5,
  tickWidth: 1
};
const colorbarConfig = {
  colorbarTickPosition: getTickPositionForPosition(defaultPosition),
  colormaps: colormaps,
  colorbarContainerPosition: defaultPosition,
  colorbarInitialColormap: DefaultColormap,
  positionStyles,
  positionTickStyles,
  containerStyles,
  tickStyles
};
/* harmony default export */ const colorbarCustomization = ({
  'cornerstone.colorbar': colorbarConfig
});
;// ../../../extensions/cornerstone/src/customizations/modalityColorMapCustomization.ts
/* harmony default export */ const modalityColorMapCustomization = ({
  'cornerstone.modalityOverlayDefaultColorMaps': {
    defaultSettings: {
      PT: {
        colormap: 'hsv',
        // Note: Right now, there is a nonlinear relationship between the opacity value
        // below and how it will get applied to the image. The limitation is in rendering.
        // We are working on this and will remove this note when it's fixed.
        // But don't expect 0.5 to be 50% opacity, but rather close to that.
        opacity: 0.5
      },
      RTDOSE: {
        colormap: 'Isodose',
        // Note: Right now, there is a nonlinear relationship between the opacity value
        // below and how it will get applied to the image. The limitation is in rendering.
        // We are working on this and will remove this note when it's fixed.
        // But don't expect 0.5 to be 50% opacity, but rather close to that.

        opacity: 0.5
      }
    }
  }
});
;// ../../../extensions/cornerstone/src/components/WindowLevelActionMenu/defaultWindowLevelPresets.ts
// The following are the default window level presets and can be further
// configured via the customization service.
const defaultWindowLevelPresets = {
  CT: [{
    id: 'ct-soft-tissue',
    description: 'Soft tissue',
    window: '400',
    level: '40'
  }, {
    id: 'ct-lung',
    description: 'Lung',
    window: '1500',
    level: '-600'
  }, {
    id: 'ct-liver',
    description: 'Liver',
    window: '150',
    level: '90'
  }, {
    id: 'ct-bone',
    description: 'Bone',
    window: '2500',
    level: '480'
  }, {
    id: 'ct-brain',
    description: 'Brain',
    window: '80',
    level: '40'
  }],
  PT: [{
    id: 'pt-default',
    description: 'Default',
    window: '5',
    level: '2.5'
  }, {
    id: 'pt-suv-3',
    description: 'SUV',
    window: '0',
    level: '3'
  }, {
    id: 'pt-suv-5',
    description: 'SUV',
    window: '0',
    level: '5'
  }, {
    id: 'pt-suv-7',
    description: 'SUV',
    window: '0',
    level: '7'
  }, {
    id: 'pt-suv-8',
    description: 'SUV',
    window: '0',
    level: '8'
  }, {
    id: 'pt-suv-10',
    description: 'SUV',
    window: '0',
    level: '10'
  }, {
    id: 'pt-suv-15',
    description: 'SUV',
    window: '0',
    level: '15'
  }]
};
/* harmony default export */ const WindowLevelActionMenu_defaultWindowLevelPresets = (defaultWindowLevelPresets);
;// ../../../extensions/cornerstone/src/customizations/windowLevelPresetsCustomization.ts

/* harmony default export */ const windowLevelPresetsCustomization = ({
  'cornerstone.windowLevelPresets': WindowLevelActionMenu_defaultWindowLevelPresets
});
// EXTERNAL MODULE: ../../../node_modules/react-dropzone/dist/es/index.js + 4 modules
var dist_es = __webpack_require__(85252);
// EXTERNAL MODULE: ../../../node_modules/prop-types/index.js
var prop_types = __webpack_require__(97598);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
// EXTERNAL MODULE: ../../../node_modules/classnames/index.js
var classnames = __webpack_require__(55530);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
;// ../../../extensions/cornerstone/src/utils/DicomFileUploader.ts


const EVENTS = {
  PROGRESS: 'event:DicomFileUploader:progress'
};
let UploadStatus = /*#__PURE__*/function (UploadStatus) {
  UploadStatus[UploadStatus["NotStarted"] = 0] = "NotStarted";
  UploadStatus[UploadStatus["InProgress"] = 1] = "InProgress";
  UploadStatus[UploadStatus["Success"] = 2] = "Success";
  UploadStatus[UploadStatus["Failed"] = 3] = "Failed";
  UploadStatus[UploadStatus["Cancelled"] = 4] = "Cancelled";
  return UploadStatus;
}({});
class UploadRejection {
  constructor(status, message) {
    this.message = void 0;
    this.status = void 0;
    this.message = message;
    this.status = status;
  }
}
class DicomFileUploader extends src.PubSubService {
  constructor(file, dataSource) {
    super(EVENTS);
    this._file = void 0;
    this._fileId = void 0;
    this._dataSource = void 0;
    this._loadPromise = void 0;
    this._abortController = new AbortController();
    this._status = UploadStatus.NotStarted;
    this._percentComplete = 0;
    this._file = file;
    this._fileId = dicom_image_loader_dist_esm/* default.wadouri */.Ay.wadouri.fileManager.add(file);
    this._dataSource = dataSource;
  }
  getFileId() {
    return this._fileId;
  }
  getFileName() {
    return this._file.name;
  }
  getFileSize() {
    return this._file.size;
  }
  cancel() {
    this._abortController.abort();
  }
  getStatus() {
    return this._status;
  }
  getPercentComplete() {
    return this._percentComplete;
  }
  async load() {
    if (this._loadPromise) {
      // Already started loading, return the load promise.
      return this._loadPromise;
    }
    this._loadPromise = new Promise((resolve, reject) => {
      // The upload listeners: fire progress events and/or settle the promise.
      const uploadCallbacks = {
        progress: evt => {
          if (!evt.lengthComputable) {
            // Progress computation is not possible.
            return;
          }
          this._status = UploadStatus.InProgress;
          this._percentComplete = Math.round(100 * evt.loaded / evt.total);
          this._broadcastEvent(EVENTS.PROGRESS, {
            fileId: this._fileId,
            percentComplete: this._percentComplete
          });
        },
        timeout: () => {
          this._reject(reject, new UploadRejection(UploadStatus.Failed, 'The request timed out.'));
        },
        abort: () => {
          this._reject(reject, new UploadRejection(UploadStatus.Cancelled, 'Cancelled'));
        },
        error: () => {
          this._reject(reject, new UploadRejection(UploadStatus.Failed, 'The request failed.'));
        }
      };

      // First try to load the file.
      dicom_image_loader_dist_esm/* default.wadouri */.Ay.wadouri.loadFileRequest(this._fileId).then(dicomFile => {
        if (this._abortController.signal.aborted) {
          this._reject(reject, new UploadRejection(UploadStatus.Cancelled, 'Cancelled'));
          return;
        }
        if (!this._checkDicomFile(dicomFile)) {
          // The file is not DICOM
          this._reject(reject, new UploadRejection(UploadStatus.Failed, 'Not a valid DICOM file.'));
          return;
        }
        const request = new XMLHttpRequest();
        this._addRequestCallbacks(request, uploadCallbacks);

        // Do the actual upload by supplying the DICOM file and upload callbacks/listeners.
        return this._dataSource.store.dicom(dicomFile, request).then(() => {
          this._status = UploadStatus.Success;
          resolve();
        }).catch(reason => {
          this._reject(reject, reason);
        });
      }).catch(reason => {
        this._reject(reject, reason);
      });
    });
    return this._loadPromise;
  }
  _isRejected() {
    return this._status === UploadStatus.Failed || this._status === UploadStatus.Cancelled;
  }
  _reject(reject, reason) {
    if (this._isRejected()) {
      return;
    }
    if (reason instanceof UploadRejection) {
      this._status = reason.status;
      reject(reason);
      return;
    }
    this._status = UploadStatus.Failed;
    if (reason.message) {
      reject(new UploadRejection(UploadStatus.Failed, reason.message));
      return;
    }
    reject(new UploadRejection(UploadStatus.Failed, reason));
  }
  _addRequestCallbacks(request, uploadCallbacks) {
    const abortCallback = () => request.abort();
    this._abortController.signal.addEventListener('abort', abortCallback);
    for (const [eventName, callback] of Object.entries(uploadCallbacks)) {
      request.upload.addEventListener(eventName, callback);
    }
    const cleanUpCallback = () => {
      this._abortController.signal.removeEventListener('abort', abortCallback);
      for (const [eventName, callback] of Object.entries(uploadCallbacks)) {
        request.upload.removeEventListener(eventName, callback);
      }
      request.removeEventListener('loadend', cleanUpCallback);
    };
    request.addEventListener('loadend', cleanUpCallback);
  }
  _checkDicomFile(arrayBuffer) {
    if (arrayBuffer.length <= 132) {
      return false;
    }
    const arr = new Uint8Array(arrayBuffer.slice(128, 132));
    // bytes from 128 to 132 must be "DICM"
    return Array.from('DICM').every((char, i) => char.charCodeAt(0) === arr[i]);
  }
}
// EXTERNAL MODULE: ../../ui/src/index.js + 91 modules
var ui_src = __webpack_require__(39078);
;// ../../../extensions/cornerstone/src/components/DicomUpload/DicomUploadProgressItem.tsx




// eslint-disable-next-line react/display-name
const DicomUploadProgressItem = /*#__PURE__*/(0,react.memo)(({
  dicomFileUploader
}) => {
  const [percentComplete, setPercentComplete] = (0,react.useState)(dicomFileUploader.getPercentComplete());
  const [failedReason, setFailedReason] = (0,react.useState)('');
  const [status, setStatus] = (0,react.useState)(dicomFileUploader.getStatus());
  const isComplete = (0,react.useCallback)(() => {
    return status === UploadStatus.Failed || status === UploadStatus.Cancelled || status === UploadStatus.Success;
  }, [status]);
  (0,react.useEffect)(() => {
    const progressSubscription = dicomFileUploader.subscribe(EVENTS.PROGRESS, dicomFileUploaderProgressEvent => {
      setPercentComplete(dicomFileUploaderProgressEvent.percentComplete);
    });
    dicomFileUploader.load().catch(reason => {
      setStatus(reason.status);
      setFailedReason(reason.message ?? '');
    }).finally(() => setStatus(dicomFileUploader.getStatus()));
    return () => progressSubscription.unsubscribe();
  }, []);
  const cancelUpload = (0,react.useCallback)(() => {
    dicomFileUploader.cancel();
  }, []);
  const getStatusIcon = () => {
    switch (dicomFileUploader.getStatus()) {
      case UploadStatus.Success:
        return /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ByName, {
          name: "status-tracked",
          className: "text-primary-light"
        });
      case UploadStatus.InProgress:
        return /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ByName, {
          name: "icon-transferring"
        });
      case UploadStatus.Failed:
        return /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ByName, {
          name: "icon-alert-small"
        });
      case UploadStatus.Cancelled:
        return /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ByName, {
          name: "icon-alert-outline"
        });
      default:
        return /*#__PURE__*/react.createElement(react.Fragment, null);
    }
  };
  return /*#__PURE__*/react.createElement("div", {
    className: "min-h-14 border-secondary-light flex w-full items-center overflow-hidden border-b p-2.5 text-lg"
  }, /*#__PURE__*/react.createElement("div", {
    className: "self-top flex w-0 shrink grow flex-col gap-1"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex gap-4"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex w-6 shrink-0 items-center justify-center"
  }, getStatusIcon()), /*#__PURE__*/react.createElement("div", {
    className: "overflow-hidden text-ellipsis whitespace-nowrap text-white"
  }, dicomFileUploader.getFileName())), failedReason && /*#__PURE__*/react.createElement("div", {
    className: "pl-10"
  }, failedReason)), /*#__PURE__*/react.createElement("div", {
    className: "flex w-24 items-center"
  }, !isComplete() && /*#__PURE__*/react.createElement(react.Fragment, null, dicomFileUploader.getStatus() === UploadStatus.InProgress && /*#__PURE__*/react.createElement("div", {
    className: "w-10 text-right"
  }, percentComplete, "%"), /*#__PURE__*/react.createElement("div", {
    className: "ml-auto flex cursor-pointer"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Close, {
    className: "text-primary self-center",
    onClick: cancelUpload
  })))));
});
DicomUploadProgressItem.propTypes = {
  dicomFileUploader: prop_types_default().instanceOf(DicomFileUploader).isRequired
};
/* harmony default export */ const DicomUpload_DicomUploadProgressItem = (DicomUploadProgressItem);
;// ../../../extensions/cornerstone/src/components/DicomUpload/DicomUploadProgress.tsx








const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;

// The base/initial interval time length used to calculate the
// rate of the upload and in turn estimate the
// the amount of time remaining for the upload. This is the length
// of the very first interval to get a reasonable estimate on screen in
// a reasonable amount of time. The length of each interval after the first
// is based on the upload rate calculated. Faster rates use this base interval
// length. Slower rates below UPLOAD_RATE_THRESHOLD get longer interval times
// to obtain more accurate upload rates.
const BASE_INTERVAL_TIME = 15000;

// The upload rate threshold to determine the length of the interval to
// calculate the upload rate.
const UPLOAD_RATE_THRESHOLD = 75;
const NO_WRAP_ELLIPSIS_CLASS_NAMES = 'text-ellipsis whitespace-nowrap overflow-hidden';
function DicomUploadProgress({
  dicomFileUploaderArr,
  onComplete
}) {
  const {
    servicesManager
  } = (0,src.useSystem)();
  const ProgressLoadingBar = servicesManager.services.customizationService.getCustomization('ui.progressLoadingBar');
  const [totalUploadSize] = (0,react.useState)(dicomFileUploaderArr.reduce((acc, fileUploader) => acc + fileUploader.getFileSize(), 0));
  const currentUploadSizeRef = (0,react.useRef)(0);
  const uploadRateRef = (0,react.useRef)(0);
  const [timeRemaining, setTimeRemaining] = (0,react.useState)(null);
  const [percentComplete, setPercentComplete] = (0,react.useState)(0);
  const [numFilesCompleted, setNumFilesCompleted] = (0,react.useState)(0);
  const [numFails, setNumFails] = (0,react.useState)(0);
  const [showFailedOnly, setShowFailedOnly] = (0,react.useState)(false);
  const progressBarContainerRef = (0,react.useRef)();

  /**
   * The effect for measuring and setting the current upload rate. This is
   * done by measuring the amount of data uploaded in a set interval time.
   */
  (0,react.useEffect)(() => {
    let timeoutId;

    // The amount of data already uploaded at the start of the interval.
    let intervalStartUploadSize = 0;

    // The starting time of the interval.
    let intervalStartTime = Date.now();
    const setUploadRateRef = () => {
      const uploadSizeFromStartOfInterval = currentUploadSizeRef.current - intervalStartUploadSize;
      const now = Date.now();
      const timeSinceStartOfInterval = now - intervalStartTime;

      // Calculate and set the upload rate (ref)
      uploadRateRef.current = uploadSizeFromStartOfInterval / timeSinceStartOfInterval;

      // Reset the interval starting values.
      intervalStartUploadSize = currentUploadSizeRef.current;
      intervalStartTime = now;

      // Only start a new interval if there is more to upload.
      if (totalUploadSize - currentUploadSizeRef.current > 0) {
        if (uploadRateRef.current >= UPLOAD_RATE_THRESHOLD) {
          timeoutId = setTimeout(setUploadRateRef, BASE_INTERVAL_TIME);
        } else {
          // The current upload rate is relatively slow, so use a larger
          // time interval to get a better upload rate estimate.
          timeoutId = setTimeout(setUploadRateRef, BASE_INTERVAL_TIME * 2);
        }
      }
    };

    // The very first interval is just the base time interval length.
    timeoutId = setTimeout(setUploadRateRef, BASE_INTERVAL_TIME);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  /**
   * The effect for: updating the overall percentage complete; setting the
   * estimated time remaining; updating the number of files uploaded; and
   * detecting if any error has occurred.
   */
  (0,react.useEffect)(() => {
    let currentTimeRemaining = null;

    // For each uploader, listen for the progress percentage complete and
    // add promise catch/finally callbacks to detect errors and count number
    // of uploads complete.
    const subscriptions = dicomFileUploaderArr.map(fileUploader => {
      let currentFileUploadSize = 0;
      const updateProgress = percentComplete => {
        const previousFileUploadSize = currentFileUploadSize;
        currentFileUploadSize = Math.round(percentComplete / 100 * fileUploader.getFileSize());
        currentUploadSizeRef.current = Math.min(totalUploadSize, currentUploadSizeRef.current - previousFileUploadSize + currentFileUploadSize);
        setPercentComplete(currentUploadSizeRef.current / totalUploadSize * 100);
        if (uploadRateRef.current !== 0) {
          const uploadSizeRemaining = totalUploadSize - currentUploadSizeRef.current;
          const timeRemaining = Math.round(uploadSizeRemaining / uploadRateRef.current);
          if (currentTimeRemaining === null) {
            currentTimeRemaining = timeRemaining;
            setTimeRemaining(currentTimeRemaining);
            return;
          }

          // Do not show an increase in the time remaining by two seconds or minutes
          // so as to prevent jumping the time remaining up and down constantly
          // due to rounding, inaccuracies in the estimate and slight variations
          // in upload rates over time.
          if (timeRemaining < ONE_MINUTE) {
            const currentSecondsRemaining = Math.ceil(currentTimeRemaining / ONE_SECOND);
            const secondsRemaining = Math.ceil(timeRemaining / ONE_SECOND);
            const delta = secondsRemaining - currentSecondsRemaining;
            if (delta < 0 || delta > 2) {
              currentTimeRemaining = timeRemaining;
              setTimeRemaining(currentTimeRemaining);
            }
            return;
          }
          if (timeRemaining < ONE_HOUR) {
            const currentMinutesRemaining = Math.ceil(currentTimeRemaining / ONE_MINUTE);
            const minutesRemaining = Math.ceil(timeRemaining / ONE_MINUTE);
            const delta = minutesRemaining - currentMinutesRemaining;
            if (delta < 0 || delta > 2) {
              currentTimeRemaining = timeRemaining;
              setTimeRemaining(currentTimeRemaining);
            }
            return;
          }

          // Hours remaining...
          currentTimeRemaining = timeRemaining;
          setTimeRemaining(currentTimeRemaining);
        }
      };
      const progressCallback = progressEvent => {
        updateProgress(progressEvent.percentComplete);
      };

      // Use the uploader promise to flag any error and count the number of
      // uploads completed.
      fileUploader.load().catch(rejection => {
        if (rejection.status === UploadStatus.Failed) {
          setNumFails(numFails => numFails + 1);
        }
      }).finally(() => {
        // If any error occurred, the percent complete progress stops firing
        // but this call to updateProgress nicely puts all finished uploads at 100%.
        updateProgress(100);
        setNumFilesCompleted(numCompleted => numCompleted + 1);
      });
      return fileUploader.subscribe(EVENTS.PROGRESS, progressCallback);
    });
    return () => {
      subscriptions.forEach(subscription => subscription.unsubscribe());
    };
  }, []);
  const cancelAllUploads = (0,react.useCallback)(async () => {
    for (const dicomFileUploader of dicomFileUploaderArr) {
      // Important: we need a non-blocking way to cancel every upload,
      // otherwise the UI will freeze and the user will not be able
      // to interact with the app and progress will not be updated.
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          dicomFileUploader.cancel();
          resolve();
        }, 0);
      });
    }
  }, []);
  const getFormattedTimeRemaining = (0,react.useCallback)(() => {
    if (timeRemaining == null) {
      return '';
    }
    if (timeRemaining < ONE_MINUTE) {
      const secondsRemaining = Math.ceil(timeRemaining / ONE_SECOND);
      return `${secondsRemaining} ${secondsRemaining === 1 ? 'second' : 'seconds'}`;
    }
    if (timeRemaining < ONE_HOUR) {
      const minutesRemaining = Math.ceil(timeRemaining / ONE_MINUTE);
      return `${minutesRemaining} ${minutesRemaining === 1 ? 'minute' : 'minutes'}`;
    }
    const hoursRemaining = Math.ceil(timeRemaining / ONE_HOUR);
    return `${hoursRemaining} ${hoursRemaining === 1 ? 'hour' : 'hours'}`;
  }, [timeRemaining]);
  const getPercentCompleteRounded = (0,react.useCallback)(() => Math.min(100, Math.round(percentComplete)), [percentComplete]);

  /**
   * Determines if the progress bar should show the infinite animation or not.
   * Show the infinite animation for progress less than 1% AND if less than
   * one pixel of the progress bar would be displayed.
   */
  const showInfiniteProgressBar = (0,react.useCallback)(() => {
    return getPercentCompleteRounded() < 1 && (progressBarContainerRef?.current?.offsetWidth ?? 0) * (percentComplete / 100) < 1;
  }, [getPercentCompleteRounded, percentComplete]);

  /**
   * Gets the CSS style for the 'n of m' (files completed) text.
   * The width changes according to numFilesCompleted and can vary,
   * e.g. "1 of 200", "10 of 200", "100 of 200" all have differents width.
   */
  const getNofMFilesStyle = (0,react.useCallback)(() => {
    // the number of digits accounts for the digits being on each side of the ' of '
    const numDigits = numFilesCompleted.toString().length + dicomFileUploaderArr.length.toString().length;
    // The number of digits + 3 additional characters (accounts for ' of ').
    // Even though intuitively 4 should be better, this is the most accurate width.
    // The font may play a part in this discrepancy.
    const numChars = numDigits + 3;
    return {
      width: `${numChars}ch`
    };
  }, [numFilesCompleted]);
  const getNumCompletedAndTimeRemainingComponent = () => {
    return /*#__PURE__*/react.createElement("div", {
      className: "bg-primary-dark flex h-14 items-center px-1 pb-4 text-lg text-white"
    }, numFilesCompleted === dicomFileUploaderArr.length ? /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("span", {
      className: NO_WRAP_ELLIPSIS_CLASS_NAMES
    }, `${dicomFileUploaderArr.length} ${dicomFileUploaderArr.length > 1 ? 'files' : 'file'} completed.`), /*#__PURE__*/react.createElement(ui_src/* Button */.$n, {
      disabled: false,
      className: "ml-auto",
      onClick: onComplete
    }, 'Close')) : /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
      className: "flex flex-wrap"
    }, /*#__PURE__*/react.createElement("span", {
      style: getNofMFilesStyle(),
      className: classnames_default()(NO_WRAP_ELLIPSIS_CLASS_NAMES, 'text-right')
    }, `${numFilesCompleted} of ${dicomFileUploaderArr.length}`, "\xA0"), /*#__PURE__*/react.createElement("span", {
      className: NO_WRAP_ELLIPSIS_CLASS_NAMES
    }, ' files completed.'), /*#__PURE__*/react.createElement("br", null), /*#__PURE__*/react.createElement("span", null, timeRemaining ? `Less than ${getFormattedTimeRemaining()} remaining. ` : '')), /*#__PURE__*/react.createElement("span", {
      className: 'text-primary hover:text-primary-lightactive:text-aqua-pale ml-auto cursor-pointer whitespace-nowrap',
      onClick: cancelAllUploads
    }, "Cancel All Uploads")));
  };
  const getShowFailedOnlyIconComponent = () => {
    return /*#__PURE__*/react.createElement("div", {
      className: "ml-auto flex w-6 justify-center"
    }, numFails > 0 && /*#__PURE__*/react.createElement("div", {
      onClick: () => setShowFailedOnly(currentShowFailedOnly => !currentShowFailedOnly)
    }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ByName, {
      className: "cursor-pointer",
      name: "icon-status-alert"
    })));
  };
  const getPercentCompleteComponent = () => {
    return /*#__PURE__*/react.createElement("div", {
      className: "ohif-scrollbar border-secondary-light overflow-y-scroll border-b px-2"
    }, /*#__PURE__*/react.createElement("div", {
      className: "min-h-14 flex w-full items-center p-2.5"
    }, numFilesCompleted === dicomFileUploaderArr.length ? /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
      className: "text-primary-light text-xl"
    }, numFails > 0 ? `Completed with ${numFails} ${numFails > 1 ? 'errors' : 'error'}!` : 'Completed!'), getShowFailedOnlyIconComponent()) : /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
      ref: progressBarContainerRef,
      className: "flex-grow"
    }, /*#__PURE__*/react.createElement(ProgressLoadingBar, {
      progress: showInfiniteProgressBar() ? undefined : Math.min(100, percentComplete)
    })), /*#__PURE__*/react.createElement("div", {
      className: "ml-1 flex w-24 items-center"
    }, /*#__PURE__*/react.createElement("div", {
      className: "w-10 text-right text-foreground"
    }, `${getPercentCompleteRounded()}%`), getShowFailedOnlyIconComponent()))));
  };
  return /*#__PURE__*/react.createElement("div", {
    className: "flex grow flex-col"
  }, getNumCompletedAndTimeRemainingComponent(), /*#__PURE__*/react.createElement("div", {
    className: "flex grow flex-col overflow-hidden bg-black text-lg"
  }, getPercentCompleteComponent(), /*#__PURE__*/react.createElement("div", {
    className: "ohif-scrollbar h-1 grow overflow-y-scroll px-2"
  }, dicomFileUploaderArr.filter(dicomFileUploader => !showFailedOnly || dicomFileUploader.getStatus() === UploadStatus.Failed).map(dicomFileUploader => /*#__PURE__*/react.createElement(DicomUpload_DicomUploadProgressItem, {
    key: dicomFileUploader.getFileId(),
    dicomFileUploader: dicomFileUploader
  })))));
}
DicomUploadProgress.propTypes = {
  dicomFileUploaderArr: prop_types_default().arrayOf(prop_types_default().instanceOf(DicomFileUploader)).isRequired,
  onComplete: (prop_types_default()).func.isRequired
};
/* harmony default export */ const DicomUpload_DicomUploadProgress = (DicomUploadProgress);
;// ../../../extensions/cornerstone/src/components/DicomUpload/DicomUpload.css
// extracted by mini-css-extract-plugin

;// ../../../extensions/cornerstone/src/components/DicomUpload/DicomUpload.tsx
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }








function DicomUpload({
  dataSource,
  onComplete,
  onStarted
}) {
  const baseClassNames = 'min-h-[480px] flex flex-col bg-black select-none';
  const [dicomFileUploaderArr, setDicomFileUploaderArr] = (0,react.useState)([]);
  const onDrop = (0,react.useCallback)(async acceptedFiles => {
    onStarted();
    setDicomFileUploaderArr(acceptedFiles.map(file => new DicomFileUploader(file, dataSource)));
  }, []);
  const getDropZoneComponent = () => {
    return /*#__PURE__*/react.createElement(dist_es/* default */.A, {
      onDrop: acceptedFiles => {
        onDrop(acceptedFiles);
      },
      noClick: true
    }, ({
      getRootProps
    }) => /*#__PURE__*/react.createElement("div", _extends({}, getRootProps(), {
      className: "dicom-upload-drop-area-border-dash m-5 flex h-full flex-col items-center justify-center"
    }), /*#__PURE__*/react.createElement("div", {
      className: "flex gap-3"
    }, /*#__PURE__*/react.createElement(dist_es/* default */.A, {
      onDrop: onDrop,
      noDrag: true
    }, ({
      getRootProps,
      getInputProps
    }) => /*#__PURE__*/react.createElement("div", getRootProps(), /*#__PURE__*/react.createElement(ui_src/* Button */.$n, {
      disabled: false,
      onClick: () => {}
    }, 'Add files', /*#__PURE__*/react.createElement("input", getInputProps())))), /*#__PURE__*/react.createElement(dist_es/* default */.A, {
      onDrop: onDrop,
      noDrag: true
    }, ({
      getRootProps,
      getInputProps
    }) => /*#__PURE__*/react.createElement("div", getRootProps(), /*#__PURE__*/react.createElement(ui_src/* Button */.$n, {
      type: ui_src/* ButtonEnums.type */.Ny.NW.secondary,
      disabled: false,
      onClick: () => {}
    }, 'Add folder', /*#__PURE__*/react.createElement("input", _extends({}, getInputProps(), {
      webkitdirectory: "true",
      mozdirectory: "true"
    })))))), /*#__PURE__*/react.createElement("div", {
      className: "pt-5"
    }, "or drag images or folders here"), /*#__PURE__*/react.createElement("div", {
      className: "text-aqua-pale pt-3 text-lg"
    }, "(DICOM files supported)")));
  };
  return /*#__PURE__*/react.createElement(react.Fragment, null, dicomFileUploaderArr.length ? /*#__PURE__*/react.createElement("div", {
    className: classnames_default()('h-[calc(100vh-300px)]', baseClassNames)
  }, /*#__PURE__*/react.createElement(DicomUpload_DicomUploadProgress, {
    dicomFileUploaderArr: Array.from(dicomFileUploaderArr),
    onComplete: onComplete
  })) : /*#__PURE__*/react.createElement("div", {
    className: classnames_default()('h-[480px]', baseClassNames)
  }, getDropZoneComponent()));
}
DicomUpload.propTypes = {
  dataSource: (prop_types_default()).object.isRequired,
  onComplete: (prop_types_default()).func.isRequired,
  onStarted: (prop_types_default()).func.isRequired
};
/* harmony default export */ const DicomUpload_DicomUpload = (DicomUpload);
;// ../../../extensions/cornerstone/src/customizations/miscCustomization.ts


/* harmony default export */ const miscCustomization = ({
  cinePlayer: ui_next_src/* CinePlayer */.F05,
  autoCineModalities: ['OT', 'US'],
  'panelMeasurement.disableEditing': false,
  onBeforeSRAddMeasurement: ({
    measurement,
    StudyInstanceUID,
    SeriesInstanceUID
  }) => {
    return measurement;
  },
  onBeforeDicomStore: ({
    dicomDict,
    measurementData,
    naturalizedReport
  }) => {
    return dicomDict;
  },
  dicomUploadComponent: DicomUpload_DicomUpload,
  codingValues: {}
});
;// ../../../extensions/cornerstone/src/customizations/captureViewportModalCustomization.tsx


const MAX_TEXTURE_SIZE = 10000;
const DEFAULT_FILENAME = 'image';
function ViewportDownloadFormNew({
  onClose,
  defaultSize,
  fileTypeOptions,
  viewportId,
  showAnnotations,
  onAnnotationsChange,
  dimensions,
  warningState,
  onDimensionsChange,
  onEnableViewport,
  onDisableViewport,
  onDownload
}) {
  const [viewportElement, setViewportElement] = (0,react.useState)(null);
  const [showWarningMessage, setShowWarningMessage] = (0,react.useState)(true);
  const [filename, setFilename] = (0,react.useState)(DEFAULT_FILENAME);
  const [fileType, setFileType] = (0,react.useState)('jpg');
  (0,react.useEffect)(() => {
    if (!viewportElement) {
      return;
    }
    onEnableViewport(viewportElement);
    return () => {
      onDisableViewport();
    };
  }, [onDisableViewport, onEnableViewport, viewportElement]);
  return /*#__PURE__*/react.createElement(ui_next_src/* ImageModal */.jiK, null, /*#__PURE__*/react.createElement(ui_next_src/* ImageModal */.jiK.Body, null, /*#__PURE__*/react.createElement(ui_next_src/* ImageModal */.jiK.ImageVisual, null, /*#__PURE__*/react.createElement("div", {
    style: {
      height: dimensions.height,
      width: dimensions.width,
      position: 'relative'
    },
    "data-viewport-uid": viewportId,
    ref: setViewportElement
  }, warningState.enabled && showWarningMessage && /*#__PURE__*/react.createElement("div", {
    className: "text-foreground absolute left-1/2 bottom-[5px] z-[1000] -translate-x-1/2 whitespace-nowrap rounded bg-black p-3 text-xs font-bold",
    style: {
      fontSize: '12px'
    }
  }, warningState.value))), /*#__PURE__*/react.createElement(ui_next_src/* ImageModal */.jiK.ImageOptions, null, /*#__PURE__*/react.createElement("div", {
    className: "flex items-end space-x-2"
  }, /*#__PURE__*/react.createElement(ui_next_src/* ImageModal */.jiK.Filename, {
    value: filename,
    onChange: e => setFilename(e.target.value)
  }, "File name"), /*#__PURE__*/react.createElement(ui_next_src/* ImageModal */.jiK.Filetype, {
    selected: fileType,
    onSelect: setFileType,
    options: fileTypeOptions
  })), /*#__PURE__*/react.createElement(ui_next_src/* ImageModal */.jiK.ImageSize, {
    width: dimensions.width.toString(),
    height: dimensions.height.toString(),
    onWidthChange: e => {
      onDimensionsChange({
        ...dimensions,
        width: parseInt(e.target.value) || defaultSize
      });
    },
    onHeightChange: e => {
      onDimensionsChange({
        ...dimensions,
        height: parseInt(e.target.value) || defaultSize
      });
    },
    maxWidth: MAX_TEXTURE_SIZE.toString(),
    maxHeight: MAX_TEXTURE_SIZE.toString()
  }, "Image size ", /*#__PURE__*/react.createElement("span", {
    className: "text-muted-foreground"
  }, "px")), /*#__PURE__*/react.createElement(ui_next_src/* ImageModal */.jiK.SwitchOption, {
    defaultChecked: showAnnotations,
    checked: showAnnotations,
    onCheckedChange: onAnnotationsChange
  }, "Include annotations"), warningState.enabled && /*#__PURE__*/react.createElement(ui_next_src/* ImageModal */.jiK.SwitchOption, {
    defaultChecked: showWarningMessage,
    checked: showWarningMessage,
    onCheckedChange: setShowWarningMessage
  }, "Include warning message"), /*#__PURE__*/react.createElement(ui_next_src/* FooterAction */.esu, {
    className: "mt-2"
  }, /*#__PURE__*/react.createElement(ui_next_src/* FooterAction */.esu.Right, null, /*#__PURE__*/react.createElement(ui_next_src/* FooterAction */.esu.Secondary, {
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/react.createElement(ui_next_src/* FooterAction */.esu.Primary, {
    onClick: () => {
      onDownload(filename || DEFAULT_FILENAME, fileType);
      onClose();
    }
  }, "Save"))))));
}
/* harmony default export */ const captureViewportModalCustomization = ({
  'ohif.captureViewportModal': ViewportDownloadFormNew
});
;// ../../../extensions/cornerstone/src/customizations/viewportDownloadWarningCustomization.tsx
/* harmony default export */ const viewportDownloadWarningCustomization = ({
  'viewportDownload.warningMessage': {
    enabled: true,
    value: 'Not For Diagnostic Use'
  }
});
;// ../../../extensions/cornerstone/src/getCustomizationModule.tsx













function getCustomizationModule({
  commandsManager,
  servicesManager,
  extensionManager
}) {
  return [{
    name: 'default',
    value: {
      ...viewportOverlayCustomization,
      ...getSegmentationPanelCustomization({
        commandsManager,
        servicesManager,
        extensionManager
      }),
      ...layoutSelectorCustomization,
      ...viewportToolsCustomization,
      ...viewportClickCommandsCustomization,
      ...measurementsCustomization,
      ...volumeRenderingCustomization,
      ...colorbarCustomization,
      ...modalityColorMapCustomization,
      ...windowLevelPresetsCustomization,
      ...miscCustomization,
      ...captureViewportModalCustomization,
      ...viewportDownloadWarningCustomization
    }
  }];
}
/* harmony default export */ const src_getCustomizationModule = (getCustomizationModule);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/labelmap-interpolation/dist/esm/index.js + 2 modules
var labelmap_interpolation_dist_esm = __webpack_require__(7927);
// EXTERNAL MODULE: ../../i18n/src/index.js + 197 modules
var i18n_src = __webpack_require__(89806);
// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/index.js + 1 modules
var gl_matrix_esm = __webpack_require__(3823);
;// ../../../extensions/cornerstone/src/utils/imageSliceSync/toggleImageSliceSync.ts
const IMAGE_SLICE_SYNC_NAME = 'IMAGE_SLICE_SYNC';
function toggleImageSliceSync({
  servicesManager,
  viewports: providedViewports,
  syncId
}) {
  const {
    syncGroupService,
    viewportGridService,
    displaySetService,
    cornerstoneViewportService
  } = servicesManager.services;
  syncId ||= IMAGE_SLICE_SYNC_NAME;
  const viewports = providedViewports || getReconstructableStackViewports(viewportGridService, displaySetService);

  // Todo: right now we don't have a proper way to define specific
  // viewports to add to synchronizers, and right now it is global or not
  // after we do that, we should do fine grained control of the synchronizers
  const someViewportHasSync = viewports.some(viewport => {
    const syncStates = syncGroupService.getSynchronizersForViewport(viewport.viewportOptions.viewportId);
    const imageSync = syncStates.find(syncState => syncState.id === syncId);
    return !!imageSync;
  });
  if (someViewportHasSync) {
    return disableSync(syncId, servicesManager);
  }

  // create synchronization group and add the viewports to it.
  viewports.forEach(gridViewport => {
    const {
      viewportId
    } = gridViewport.viewportOptions;
    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
    if (!viewport) {
      return;
    }
    syncGroupService.addViewportToSyncGroup(viewportId, viewport.getRenderingEngine().id, {
      type: 'imageSlice',
      id: syncId,
      source: true,
      target: true
    });
  });
}
function disableSync(syncName, servicesManager) {
  const {
    syncGroupService,
    viewportGridService,
    displaySetService,
    cornerstoneViewportService
  } = servicesManager.services;
  const viewports = getReconstructableStackViewports(viewportGridService, displaySetService);
  viewports.forEach(gridViewport => {
    const {
      viewportId
    } = gridViewport.viewportOptions;
    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
    if (!viewport) {
      return;
    }
    syncGroupService.removeViewportFromSyncGroup(viewport.id, viewport.getRenderingEngine().id, syncName);
  });
}

/**
 * Gets the consistent spacing stack viewport types, which are the ones which
 * can be navigated using the stack image sync right now.
 */
function getReconstructableStackViewports(viewportGridService, displaySetService) {
  let {
    viewports
  } = viewportGridService.getState();
  viewports = [...viewports.values()];
  // filter empty viewports
  viewports = viewports.filter(viewport => viewport.displaySetInstanceUIDs && viewport.displaySetInstanceUIDs.length);

  // filter reconstructable viewports
  viewports = viewports.filter(viewport => {
    const {
      displaySetInstanceUIDs
    } = viewport;
    for (const displaySetInstanceUID of displaySetInstanceUIDs) {
      const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);

      // TODO - add a better test than isReconstructable
      if (displaySet && displaySet.isReconstructable) {
        return true;
      }
      return false;
    }
  });
  return viewports;
}
;// ../../../extensions/cornerstone/src/utils/toggleVOISliceSync.ts
const VOI_SYNC_NAME = 'VOI_SYNC';
const getSyncId = modality => `${VOI_SYNC_NAME}_${modality}`;
function toggleVOISliceSync({
  servicesManager,
  viewports: providedViewports,
  syncId
}) {
  const {
    syncGroupService,
    viewportGridService,
    displaySetService,
    cornerstoneViewportService
  } = servicesManager.services;
  const viewports = providedViewports || groupViewportsByModality(viewportGridService, displaySetService);

  // Todo: right now we don't have a proper way to define specific
  // viewports to add to synchronizers, and right now it is global or not
  // after we do that, we should do fine grained control of the synchronizers

  // we can apply voi sync within each modality group
  for (const [modality, modalityViewports] of Object.entries(viewports)) {
    const syncIdToUse = syncId || getSyncId(modality);
    const someViewportHasSync = modalityViewports.some(viewport => {
      const syncStates = syncGroupService.getSynchronizersForViewport(viewport.viewportOptions.viewportId);
      const imageSync = syncStates.find(syncState => syncState.id === syncIdToUse);
      return !!imageSync;
    });
    if (someViewportHasSync) {
      return toggleVOISliceSync_disableSync(modalityViewports, syncIdToUse, servicesManager);
    }

    // create synchronization group and add the modalityViewports to it.
    modalityViewports.forEach(gridViewport => {
      const {
        viewportId
      } = gridViewport.viewportOptions;
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (!viewport) {
        return;
      }
      syncGroupService.addViewportToSyncGroup(viewportId, viewport.getRenderingEngine().id, {
        type: 'voi',
        id: syncIdToUse,
        source: true,
        target: true
      });
    });
  }
}
function toggleVOISliceSync_disableSync(modalityViewports, syncId, servicesManager) {
  const {
    syncGroupService,
    cornerstoneViewportService
  } = servicesManager.services;
  const viewports = modalityViewports;
  viewports.forEach(gridViewport => {
    const {
      viewportId
    } = gridViewport.viewportOptions;
    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
    if (!viewport) {
      return;
    }
    syncGroupService.removeViewportFromSyncGroup(viewport.id, viewport.getRenderingEngine().id, syncId);
  });
}
function groupViewportsByModality(viewportGridService, displaySetService) {
  let {
    viewports
  } = viewportGridService.getState();
  viewports = [...viewports.values()];

  // group the viewports by modality
  return viewports.reduce((acc, viewport) => {
    const {
      displaySetInstanceUIDs
    } = viewport;
    // Todo: add proper fusion support
    const displaySetInstanceUID = displaySetInstanceUIDs[0];
    const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
    const modality = displaySet.Modality;
    if (!acc[modality]) {
      acc[modality] = [];
    }
    acc[modality].push(viewport);
    return acc;
  }, {});
}
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/stores/useSynchronizersStore.ts
var useSynchronizersStore = __webpack_require__(68578);
;// ../../../extensions/cornerstone/src/stores/index.ts




// EXTERNAL MODULE: ../../../node_modules/html2canvas/dist/html2canvas.esm.js
var html2canvas_esm = __webpack_require__(91037);
;// ../../../extensions/cornerstone/src/utils/CornerstoneViewportDownloadForm.tsx






const DEFAULT_SIZE = 512;
const CornerstoneViewportDownloadForm_MAX_TEXTURE_SIZE = 10000;
const VIEWPORT_ID = 'cornerstone-viewport-download-form';
const FILE_TYPE_OPTIONS = [{
  value: 'jpg',
  label: 'JPG'
}, {
  value: 'png',
  label: 'PNG'
}];
const CornerstoneViewportDownloadForm = ({
  hide,
  activeViewportId: activeViewportIdProp
}) => {
  const {
    servicesManager
  } = (0,src.useSystem)();
  const {
    customizationService,
    cornerstoneViewportService
  } = servicesManager.services;
  const [showAnnotations, setShowAnnotations] = (0,react.useState)(true);
  const [viewportDimensions, setViewportDimensions] = (0,react.useState)({
    width: DEFAULT_SIZE,
    height: DEFAULT_SIZE
  });
  const warningState = customizationService.getCustomization('viewportDownload.warningMessage');
  const refViewportEnabledElementOHIF = (0,state/* getEnabledElement */.kJ)(activeViewportIdProp);
  const activeViewportElement = refViewportEnabledElementOHIF?.element;
  const {
    viewportId: activeViewportId,
    renderingEngineId
  } = (0,esm.getEnabledElement)(activeViewportElement);
  const renderingEngine = cornerstoneViewportService.getRenderingEngine();
  const toolGroup = dist_esm.ToolGroupManager.getToolGroupForViewport(activeViewportId, renderingEngineId);
  (0,react.useEffect)(() => {
    const toolModeAndBindings = Object.keys(toolGroup.toolOptions).reduce((acc, toolName) => {
      const tool = toolGroup.toolOptions[toolName];
      const {
        mode,
        bindings
      } = tool;
      return {
        ...acc,
        [toolName]: {
          mode,
          bindings
        }
      };
    }, {});
    return () => {
      Object.keys(toolModeAndBindings).forEach(toolName => {
        const {
          mode,
          bindings
        } = toolModeAndBindings[toolName];
        toolGroup.setToolMode(toolName, mode, {
          bindings
        });
      });
    };
  }, []);
  const handleEnableViewport = viewportElement => {
    if (!viewportElement) {
      return;
    }
    const {
      viewport
    } = (0,esm.getEnabledElement)(activeViewportElement);
    const viewportInput = {
      viewportId: VIEWPORT_ID,
      element: viewportElement,
      type: viewport.type,
      defaultOptions: {
        background: viewport.defaultOptions.background,
        orientation: viewport.defaultOptions.orientation
      }
    };
    renderingEngine.enableElement(viewportInput);
  };
  const handleDisableViewport = async () => {
    renderingEngine.disableElement(VIEWPORT_ID);
  };
  const handleLoadImage = async (width, height) => {
    if (!activeViewportElement) {
      return;
    }
    const activeViewportEnabledElement = (0,esm.getEnabledElement)(activeViewportElement);
    if (!activeViewportEnabledElement) {
      return;
    }
    const segmentationRepresentations = dist_esm.segmentation.state.getViewportSegmentationRepresentations(activeViewportId);
    const {
      viewport
    } = activeViewportEnabledElement;
    const downloadViewport = renderingEngine.getViewport(VIEWPORT_ID);
    try {
      if (downloadViewport instanceof esm.StackViewport) {
        const imageId = viewport.getCurrentImageId();
        const properties = viewport.getProperties();
        await downloadViewport.setStack([imageId]);
        downloadViewport.setProperties(properties);
      } else if (downloadViewport instanceof esm.BaseVolumeViewport) {
        const volumeIds = viewport.getAllVolumeIds();
        downloadViewport.setVolumes([{
          volumeId: volumeIds[0]
        }]);
      }
      if (segmentationRepresentations.length > 0) {
        segmentationRepresentations.forEach(segRepresentation => {
          const {
            segmentationId,
            colorLUTIndex,
            type
          } = segRepresentation;
          if (type === dist_esm.Enums.SegmentationRepresentations.Labelmap) {
            dist_esm.segmentation.addLabelmapRepresentationToViewportMap({
              [downloadViewport.id]: [{
                segmentationId,
                type: dist_esm.Enums.SegmentationRepresentations.Labelmap,
                config: {
                  colorLUTOrIndex: colorLUTIndex
                }
              }]
            });
          }
          if (type === dist_esm.Enums.SegmentationRepresentations.Contour) {
            dist_esm.segmentation.addContourRepresentationToViewportMap({
              [downloadViewport.id]: [{
                segmentationId,
                type: dist_esm.Enums.SegmentationRepresentations.Contour,
                config: {
                  colorLUTOrIndex: colorLUTIndex
                }
              }]
            });
          }
        });
      }
      return {
        width: Math.min(width || DEFAULT_SIZE, CornerstoneViewportDownloadForm_MAX_TEXTURE_SIZE),
        height: Math.min(height || DEFAULT_SIZE, CornerstoneViewportDownloadForm_MAX_TEXTURE_SIZE)
      };
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };
  const handleToggleAnnotations = show => {
    const activeViewportEnabledElement = (0,esm.getEnabledElement)(activeViewportElement);
    if (!activeViewportEnabledElement) {
      return;
    }
    const downloadViewport = renderingEngine.getViewport(VIEWPORT_ID);
    if (!downloadViewport) {
      return;
    }
    const {
      viewportId: activeViewportId,
      renderingEngineId
    } = activeViewportEnabledElement;
    const {
      id: downloadViewportId
    } = downloadViewport;
    const toolGroup = dist_esm.ToolGroupManager.getToolGroupForViewport(activeViewportId, renderingEngineId);
    toolGroup.addViewport(downloadViewportId, renderingEngineId);
    const toolInstances = toolGroup.getToolInstances();
    const toolInstancesArray = Object.values(toolInstances);
    toolInstancesArray.forEach(toolInstance => {
      if (toolInstance.constructor.isAnnotation !== false) {
        if (show) {
          toolGroup.setToolEnabled(toolInstance.toolName);
        } else {
          toolGroup.setToolDisabled(toolInstance.toolName);
        }
      }
    });
  };
  (0,react.useEffect)(() => {
    if (viewportDimensions.width && viewportDimensions.height) {
      setTimeout(() => {
        handleLoadImage(viewportDimensions.width, viewportDimensions.height);
        handleToggleAnnotations(showAnnotations);
        // we need a resize here to make suer annotations world to canvas
        // are properly calculated
        renderingEngine.resize();
        renderingEngine.render();
      }, 100);
    }
  }, [viewportDimensions, showAnnotations]);
  const handleDownload = async (filename, fileType) => {
    const divForDownloadViewport = document.querySelector(`div[data-viewport-uid="${VIEWPORT_ID}"]`);
    if (!divForDownloadViewport) {
      console.debug('No viewport found for download');
      return;
    }
    const canvas = await (0,html2canvas_esm/* default */.A)(divForDownloadViewport);
    const link = document.createElement('a');
    link.download = `${filename}.${fileType}`;
    link.href = canvas.toDataURL(`image/${fileType}`, 1.0);
    link.click();
  };
  const ViewportDownloadFormNew = customizationService.getCustomization('ohif.captureViewportModal');
  return /*#__PURE__*/react.createElement(ViewportDownloadFormNew, {
    onClose: hide,
    defaultSize: DEFAULT_SIZE,
    fileTypeOptions: FILE_TYPE_OPTIONS,
    viewportId: VIEWPORT_ID,
    showAnnotations: showAnnotations,
    onAnnotationsChange: setShowAnnotations,
    dimensions: viewportDimensions,
    onDimensionsChange: setViewportDimensions,
    onEnableViewport: handleEnableViewport,
    onDisableViewport: handleDisableViewport,
    onDownload: handleDownload,
    warningState: warningState
  });
};
/* harmony default export */ const utils_CornerstoneViewportDownloadForm = (CornerstoneViewportDownloadForm);
// EXTERNAL MODULE: ../../../node_modules/axios/index.js + 49 modules
var axios = __webpack_require__(17739);
;// ../../../extensions/cornerstone/src/utils/CornerstoneVLMViewportForm.tsx







const VLM_VIEWPORT_ID = 'cornerstone-vlm-viewport-form';
const CornerstoneVLMViewportForm = ({
  hide,
  activeViewportId: activeViewportIdProp
}) => {
  const {
    servicesManager
  } = (0,src.useSystem)();
  const {
    uiNotificationService,
    cornerstoneViewportService,
    displaySetService,
    viewportGridService,
    segmentationService
  } = servicesManager.services;

  // Get configuration from window.config
  const getConfig = () => {
    return window.config || {};
  };
  const [prompt, setPrompt] = (0,react.useState)('');
  const [isAnalyzing, setIsAnalyzing] = (0,react.useState)(false);
  const [capturedImage, setCapturedImage] = (0,react.useState)(null);
  const [isCapturing, setIsCapturing] = (0,react.useState)(false);
  const [analysisResult, setAnalysisResult] = (0,react.useState)(null);
  const [imageMetadata, setImageMetadata] = (0,react.useState)(null);
  const [showExamplePrompts, setShowExamplePrompts] = (0,react.useState)(true);
  const [showPromptDropdown, setShowPromptDropdown] = (0,react.useState)(false);
  const refViewportEnabledElementOHIF = (0,state/* getEnabledElement */.kJ)(activeViewportIdProp);
  const activeViewportElement = refViewportEnabledElementOHIF?.element;
  const {
    viewportId: activeViewportId,
    renderingEngineId
  } = (0,esm.getEnabledElement)(activeViewportElement);
  const renderingEngine = cornerstoneViewportService.getRenderingEngine();
  const toolGroup = dist_esm.ToolGroupManager.getToolGroupForViewport(activeViewportId, renderingEngineId);
  const captureViewportImage = async () => {
    if (!activeViewportElement) {
      return null;
    }
    setIsCapturing(true);
    try {
      const canvas = await (0,html2canvas_esm/* default */.A)(activeViewportElement, {
        backgroundColor: null,
        scale: 1,
        useCORS: true,
        allowTaint: true
      });
      return canvas.toDataURL('image/jpeg', .90);
    } catch (error) {
      console.error('Error capturing viewport:', error);
      return null;
    } finally {
      setIsCapturing(false);
    }
  };
  const examplePrompts = {
    radiologist: ['Identify any abnormalities or lesions in this medical image', 'Describe the anatomical structures visible in this scan', 'Assess the image quality and diagnostic value', 'Is there a non-biological foreign object present in this image? Do not identify the object, just confirm its presence', 'Provide differential diagnosis based on the imaging findings', "Retrieve this patient's history and create a simplified timeline of their hospitalization"],
    medicalDirector: ['Analyze the clinical significance of these imaging findings', 'Assess the urgency level and recommend next steps', 'Evaluate the technical quality and diagnostic confidence', 'Provide guidance on patient management based on these images', 'Review compliance with imaging protocols and standards'],
    general: ['What do you see in this medical image?', 'Explain the key findings in simple terms', 'What should I look for in this type of scan?', 'Scan this image for any visible PHI in the image or in the metadata', 'Help me understand what this image shows']
  };

  // Auto-capture image when component mounts
  (0,react.useEffect)(() => {
    const autoCapture = async () => {
      const imageDataUrl = await captureViewportImage();
      if (imageDataUrl) {
        setCapturedImage(imageDataUrl);
        // Extract metadata from the viewport
        extractImageMetadata();
      }
    };
    autoCapture();
  }, []);
  const extractImageMetadata = () => {
    try {
      // Get the viewport state to find the display set instance UID
      const {
        viewports
      } = viewportGridService.getState();
      const viewportInfo = viewports.get(activeViewportIdProp);
      if (!viewportInfo) {
        console.warn('No viewport info found for:', activeViewportIdProp);
        return;
      }
      const displaySetInstanceUID = viewportInfo.displaySetInstanceUIDs?.[0];
      if (!displaySetInstanceUID) {
        console.warn('No display set instance UID found for viewport:', activeViewportIdProp);
        return;
      }

      // Get the current display sets from the display set service
      const displaySets = displaySetService.getActiveDisplaySets();
      const activeDisplaySet = displaySets.find(ds => ds.displaySetInstanceUID === displaySetInstanceUID);
      if (activeDisplaySet) {
        // Get metadata from the current instance
        const metadata = activeDisplaySet.instance || activeDisplaySet;

        // Extract segmentation information
        const segmentationInfo = extractSegmentationInfo();
        const dicomMetadata = {
          imageId: metadata.imageId,
          patientName: metadata.PatientName,
          patientId: metadata.PatientID,
          studyDate: metadata.StudyDate,
          studyTime: metadata.StudyTime,
          //studyDescription: metadata.StudyDescription,
          seriesDescription: metadata.SeriesDescription,
          modality: metadata.Modality,
          instanceNumber: metadata.InstanceNumber,
          seriesNumber: metadata.SeriesNumber,
          studyInstanceUID: metadata.StudyInstanceUID,
          seriesInstanceUID: metadata.SeriesInstanceUID,
          sopInstanceUID: metadata.SOPInstanceUID,
          sopClassUID: metadata.SOPClassUID,
          segmentationInfo: segmentationInfo,
          timestamp: new Date().toISOString()
        };
        setImageMetadata(dicomMetadata);
      }
    } catch (error) {
      console.error('Error extracting DICOM metadata:', error);
    }
  };
  const extractSegmentationInfo = () => {
    try {
      const allSegmentations = segmentationService.getSegmentations();
      if (!allSegmentations?.length) {
        return {
          hasSegmentation: false,
          segmentationCount: 0,
          segmentations: []
        };
      }
      const activeSegmentation = segmentationService.getActiveSegmentation(activeViewportIdProp);
      const activeSegment = segmentationService.getActiveSegment(activeViewportIdProp);

      // Get segmentation representations for this viewport using OHIF 3.9+ API
      let segmentationRepresentations = [];
      try {
        // Use the viewport-specific segmentation service methods
        const viewportIdsWithSegmentation = segmentationService.getViewportIdsWithSegmentation();
        const hasSegmentationInViewport = viewportIdsWithSegmentation.includes(activeViewportIdProp);
        if (hasSegmentationInViewport) {
          // Get all segmentations and check which ones are represented in this viewport
          segmentationRepresentations = allSegmentations.map(seg => ({
            segmentationId: seg.id,
            viewportId: activeViewportIdProp,
            hasRepresentation: true
          }));
        }
      } catch (error) {
        console.warn('Could not get segmentation representations:', error);
      }

      // Extract all segments with representation status
      const visibleSegments = [];
      allSegmentations.forEach(segmentation => {
        if (!segmentation) return;

        // Handle different segment data structures
        const segments = segmentation.segments;
        if (!segments) return;

        // Handle OHIF 3.9+ segment structure (object with numeric keys)
        const segmentEntries = Object.values(segments);
        segmentEntries.forEach(segment => {
          if (!segment) return;

          // Check if segmentation has representation in this viewport
          const hasRepresentation = segmentationRepresentations.some(rep => rep.segmentationId === segmentation.id);
          const isActive = activeSegmentation?.id === segmentation.id && activeSegment?.segmentIndex === segment.segmentIndex;
          visibleSegments.push({
            segmentationId: segmentation.id,
            segmentationLabel: segmentation.label || 'Unnamed Segmentation',
            segmentIndex: segment.segmentIndex,
            segmentLabel: segment.label || `Segment ${segment.segmentIndex}`,
            color: segment.color,
            locked: segment.locked || false,
            active: segment.active || false,
            hasRepresentation,
            isActive,
            cachedStats: segment.cachedStats || {}
          });
        });
      });
      return {
        hasSegmentation: true,
        segmentationCount: allSegmentations.length,
        visibleSegmentsCount: visibleSegments.length,
        visibleSegments,
        segmentationRepresentations,
        activeSegmentation: activeSegmentation ? {
          id: activeSegmentation.id,
          label: activeSegmentation.label,
          activeSegmentIndex: activeSegment?.segmentIndex
        } : null,
        viewportId: activeViewportIdProp,
        renderingEngineId
      };
    } catch (error) {
      console.error('Error extracting segmentation info:', error);
      return {
        hasSegmentation: false,
        segmentationCount: 0,
        segmentations: [],
        error: 'Failed to extract segmentation data'
      };
    }
  };
  const handleAnalyze = async () => {
    if (!prompt.trim()) {
      uiNotificationService.show({
        title: 'VLM Analyzer',
        message: 'Please enter a prompt for analysis',
        type: 'warning'
      });
      return;
    }
    setIsAnalyzing(true);
    //setShowExamplePrompts(false);

    try {
      // Capture the current viewport image
      const imageDataUrl = await captureViewportImage();
      if (!imageDataUrl) {
        throw new Error('Failed to capture viewport image');
      }
      setCapturedImage(imageDataUrl);
      const base64Data = imageDataUrl.split(',')[1];
      const apiPayload = {
        model: 'databricks-claude-sonnet-4',
        prompt,
        image: base64Data,
        metadata: {
          ...imageMetadata,
          imageFormat: 'jpeg',
          timestamp: new Date().toISOString(),
          userType: 'medical_professional'
        },
        max_tokens: 1000,
        temperature: 0.7
      };

      // Build API URL from configuration
      const config = getConfig();
      const dataSource = config.dataSources?.find(ds => ds.sourceName === 'databricksPixelsDicom');
      const serverHostname = dataSource?.configuration?.serverHostname || 'http://localhost:8010';
      const apiUrl = `${serverHostname.replace("/sqlwarehouse", "")}/vlm/analyze`;

      // Make API call to VLM service
      const response = await axios/* default */.Ay.post(apiUrl, apiPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status !== 200) {
        throw new Error(`API request failed: ${response.status}`);
      }
      const result = response.data;
      console.log(result);
      setAnalysisResult(result.analysis || result || 'Analysis completed successfully.');
      uiNotificationService.show({
        title: 'VLM Analyzer',
        message: `Analysis completed for prompt: "${prompt}"`,
        type: 'success'
      });
    } catch (error) {
      console.error('VLM Analysis Error:', error);

      // Fallback to mock response for development
      const mockResult = `Based on the analysis of the medical image with the prompt "${prompt}", here are the findings:

• The image appears to show anatomical structures consistent with the requested analysis
• Key features have been identified and analyzed according to the specified criteria
• The analysis suggests normal anatomical presentation within expected parameters
• No significant abnormalities were detected in the current view

Note: This is a simulated response. API endpoint not available or configured.`;
      setAnalysisResult(mockResult);
      uiNotificationService.show({
        title: 'VLM Analyzer',
        message: 'Using simulated response (API not configured)',
        type: 'warning'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  const handleExamplePrompt = promptText => {
    setPrompt(promptText);
    //setShowExamplePrompts(false);
    setShowPromptDropdown(false);
  };
  return /*#__PURE__*/react.createElement("div", {
    className: "p-4"
  }, /*#__PURE__*/react.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/react.createElement("h3", {
    className: "text-lg font-semibold mb-2 text-white"
  }, "Analyze image via VLM"), /*#__PURE__*/react.createElement("p", {
    className: "text-sm text-white mb-4"
  }, "Analyze the current viewport image using AI vision language models.")), isCapturing && /*#__PURE__*/react.createElement("div", {
    className: "mb-4 p-4 border border-gray-300 rounded-md bg-gray-50"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex items-center justify-center"
  }, /*#__PURE__*/react.createElement("div", {
    className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
  }), /*#__PURE__*/react.createElement("span", {
    className: "ml-3 text-sm text-gray-600"
  }, "Capturing viewport image..."))), capturedImage && /*#__PURE__*/react.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex justify-center"
  }, /*#__PURE__*/react.createElement("div", {
    className: "inline-block border border-gray-300 rounded-md bg-white"
  }, /*#__PURE__*/react.createElement("img", {
    src: capturedImage,
    alt: "Captured viewport",
    className: "max-w-full h-auto max-h-64 object-contain block bg-white"
  })))), /*#__PURE__*/react.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/react.createElement("label", {
    htmlFor: "vlm-prompt",
    className: "block text-sm font-medium mb-2 text-white"
  }, "Analysis Prompt"), showExamplePrompts && /*#__PURE__*/react.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/react.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/react.createElement("button", {
    onClick: () => setShowPromptDropdown(!showPromptDropdown),
    className: "w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-between",
    disabled: isAnalyzing || isCapturing
  }, /*#__PURE__*/react.createElement("span", null, "\uD83D\uDCDD Quick Prompts"), /*#__PURE__*/react.createElement("span", {
    className: "text-xs"
  }, showPromptDropdown ? '▲' : '▼')), showPromptDropdown && /*#__PURE__*/react.createElement("div", {
    className: "absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-64 overflow-y-auto"
  }, /*#__PURE__*/react.createElement("div", {
    className: "p-2"
  }, /*#__PURE__*/react.createElement("div", {
    className: "text-xs font-semibold text-gray-600 mb-2"
  }, "For Radiologists:"), examplePrompts.radiologist.map((examplePrompt, index) => /*#__PURE__*/react.createElement("button", {
    key: `rad-${index}`,
    onClick: () => handleExamplePrompt(examplePrompt),
    className: "w-full text-left px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded mb-1",
    disabled: isAnalyzing || isCapturing
  }, examplePrompt)), /*#__PURE__*/react.createElement("div", {
    className: "text-xs font-semibold text-gray-600 mb-2 mt-3"
  }, "For Medical Directors:"), examplePrompts.medicalDirector.map((examplePrompt, index) => /*#__PURE__*/react.createElement("button", {
    key: `md-${index}`,
    onClick: () => handleExamplePrompt(examplePrompt),
    className: "w-full text-left px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded mb-1",
    disabled: isAnalyzing || isCapturing
  }, examplePrompt)), /*#__PURE__*/react.createElement("div", {
    className: "text-xs font-semibold text-gray-600 mb-2 mt-3"
  }, "General:"), examplePrompts.general.map((examplePrompt, index) => /*#__PURE__*/react.createElement("button", {
    key: `gen-${index}`,
    onClick: () => handleExamplePrompt(examplePrompt),
    className: "w-full text-left px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded mb-1",
    disabled: isAnalyzing || isCapturing
  }, examplePrompt)))))), /*#__PURE__*/react.createElement("textarea", {
    id: "vlm-prompt",
    value: prompt,
    onChange: e => setPrompt(e.target.value),
    placeholder: "Describe what you want to analyze in the image...",
    className: "w-full p-3 border border-gray-300 rounded-md resize-none",
    rows: 4,
    disabled: isAnalyzing || isCapturing
  })), analysisResult && /*#__PURE__*/react.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex justify-between items-center mb-2"
  }, /*#__PURE__*/react.createElement("label", {
    className: "block text-sm font-medium text-white"
  }, "Analysis Results"), /*#__PURE__*/react.createElement("button", {
    onClick: () => setAnalysisResult(null),
    className: "text-xs text-gray-400 hover:text-gray-300 underline",
    disabled: isAnalyzing || isCapturing
  }, "Clear Results")), /*#__PURE__*/react.createElement("div", {
    className: "bg-white border border-gray-300 rounded-md p-4 max-h-64 overflow-y-auto"
  }, /*#__PURE__*/react.createElement("div", {
    className: "text-sm text-gray-800 whitespace-pre-wrap"
  }, analysisResult))), /*#__PURE__*/react.createElement("div", {
    className: "flex justify-end space-x-2"
  }, /*#__PURE__*/react.createElement("button", {
    onClick: hide,
    className: "px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200",
    disabled: isAnalyzing || isCapturing
  }, "Cancel"), /*#__PURE__*/react.createElement("button", {
    onClick: handleAnalyze,
    disabled: isAnalyzing || isCapturing || !prompt.trim(),
    className: "px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
  }, isAnalyzing ? 'Analyzing...' : 'Analyze Image')));
};
/* harmony default export */ const utils_CornerstoneVLMViewportForm = (CornerstoneVLMViewportForm);
;// ../../../extensions/cornerstone/src/utils/updateSegmentationStats.ts

/**
 * Updates the statistics for a segmentation by calculating stats for each segment
 * and storing them in the segment's cachedStats property
 *
 * @param segmentation - The segmentation object containing segments to update stats for
 * @param segmentationId - The ID of the segmentation
 * @returns The updated segmentation object with new stats, or null if no updates were made
 */
async function updateSegmentationStats({
  segmentation,
  segmentationId,
  readableText
}) {
  if (!segmentation) {
    console.debug('No segmentation found for id:', segmentationId);
    return null;
  }
  const segmentIndices = Object.keys(segmentation.segments).map(index => parseInt(index)).filter(index => index > 0); // Filter out segment 0 which is typically background

  if (segmentIndices.length === 0) {
    console.debug('No segments found in segmentation:', segmentationId);
    return null;
  }
  const stats = await dist_esm.utilities.segmentation.getStatistics({
    segmentationId,
    segmentIndices,
    mode: 'individual'
  });
  if (!stats) {
    return null;
  }
  const updatedSegmentation = {
    ...segmentation
  };
  let hasUpdates = false;

  // Loop through each segment's stats
  Object.entries(stats).forEach(([segmentIndex, segmentStats]) => {
    const index = parseInt(segmentIndex);
    if (!updatedSegmentation.segments[index].cachedStats) {
      updatedSegmentation.segments[index].cachedStats = {};
      hasUpdates = true;
    }

    // Get existing namedStats or initialize if not present
    const namedStats = updatedSegmentation.segments[index].cachedStats.namedStats || {};
    if (segmentStats.array) {
      segmentStats.array.forEach(stat => {
        // only gather stats that are in the readableText
        if (!readableText[stat.name]) {
          return;
        }
        if (stat && stat.name) {
          namedStats[stat.name] = {
            name: stat.name,
            label: readableText[stat.name],
            value: stat.value,
            unit: stat.unit,
            order: Object.keys(readableText).indexOf(stat.name)
          };
        }
      });
      if (readableText.volume) {
        // Add volume if it exists but isn't in the array
        if (segmentStats.volume && !namedStats.volume) {
          namedStats.volume = {
            name: 'volume',
            label: 'Volume',
            value: segmentStats.volume.value,
            unit: segmentStats.volume.unit,
            order: Object.keys(readableText).indexOf('volume')
          };
        }
      }

      // Update the segment's cachedStats with namedStats
      updatedSegmentation.segments[index].cachedStats.namedStats = namedStats;
      hasUpdates = true;
    }
  });
  return hasUpdates ? updatedSegmentation : null;
}

/**
 * Updates a segment's statistics with bidirectional measurement data
 *
 * @param segmentationId - The ID of the segmentation
 * @param segmentIndex - The index of the segment to update
 * @param bidirectionalData - The bidirectional measurement data to add
 * @param segmentationService - The segmentation service to use for updating the segment
 * @returns Whether the update was successful
 */
function updateSegmentBidirectionalStats({
  segmentationId,
  segmentIndex,
  bidirectionalData,
  segmentationService,
  annotation
}) {
  if (!segmentationId || segmentIndex === undefined || !bidirectionalData) {
    console.debug('Missing required data for bidirectional stats update');
    return null;
  }
  const segmentation = segmentationService.getSegmentation(segmentationId);
  if (!segmentation || !segmentation.segments[segmentIndex]) {
    console.debug('Segment not found:', segmentIndex, 'in segmentation:', segmentationId);
    return null;
  }
  const updatedSegmentation = {
    ...segmentation
  };
  const segment = updatedSegmentation.segments[segmentIndex];
  if (!segment.cachedStats) {
    segment.cachedStats = {
      namedStats: {}
    };
  }
  if (!segment.cachedStats.namedStats) {
    segment.cachedStats.namedStats = {};
  }
  const {
    majorAxis,
    minorAxis,
    maxMajor,
    maxMinor
  } = bidirectionalData;
  if (!majorAxis || !minorAxis) {
    console.debug('Missing major or minor axis data');
    return null;
  }
  let hasUpdates = false;
  const namedStats = segment.cachedStats.namedStats;

  // Only calculate and update if we have valid measurements
  if (maxMajor > 0 && maxMinor > 0) {
    namedStats.bidirectional = {
      name: 'bidirectional',
      label: 'Bidirectional',
      annotationUID: annotation.annotationUID,
      value: {
        maxMajor,
        maxMinor,
        majorAxis,
        minorAxis
      },
      unit: 'mm'
    };
    hasUpdates = true;
  }
  if (hasUpdates) {
    return updatedSegmentation;
  }
  return null;
}
;// ../../../extensions/cornerstone/src/utils/generateSegmentationCSVReport.ts
function generateSegmentationCSVReport(segmentationData, info) {
  // Initialize the rows for our CSV
  const csvRows = [];

  // Add segmentation-level information
  csvRows.push(['Segmentation ID', segmentationData.segmentationId || '']);
  csvRows.push(['Segmentation Label', segmentationData.label || '']);
  csvRows.push([]);
  const additionalInfo = info.reference;
  // Add reference information
  const referenceKeys = [['Series Number', additionalInfo.SeriesNumber], ['Series Instance UID', additionalInfo.SeriesInstanceUID], ['Study Instance UID', additionalInfo.StudyInstanceUID], ['Series Date', additionalInfo.SeriesDate], ['Series Time', additionalInfo.SeriesTime], ['Series Description', additionalInfo.SeriesDescription]];
  referenceKeys.forEach(([key, value]) => {
    if (value) {
      csvRows.push([`reference ${key}`, value]);
    }
  });

  // Add a blank row for separation
  csvRows.push([]);
  csvRows.push(['Segments Statistics']);

  // Add segment information in columns
  if (segmentationData.segments) {
    // First row: Segment headers
    const segmentHeaderRow = ['Label'];
    for (const segmentId in segmentationData.segments) {
      const segment = segmentationData.segments[segmentId];
      segmentHeaderRow.push(`${segment.label || ''}`);
    }
    csvRows.push(segmentHeaderRow);

    // Add segment properties
    csvRows.push(['Segment Index', ...Object.values(segmentationData.segments).map(s => s.segmentIndex || '')]);
    csvRows.push(['Locked', ...Object.values(segmentationData.segments).map(s => s.locked ? 'Yes' : 'No')]);
    csvRows.push(['Active', ...Object.values(segmentationData.segments).map(s => s.active ? 'Yes' : 'No')]);

    // Add segment statistics
    // First, collect all unique statistics across all segments
    const allStats = new Set();
    for (const segment of Object.values(segmentationData.segments)) {
      if (segment.cachedStats && segment.cachedStats.namedStats) {
        for (const statKey in segment.cachedStats.namedStats) {
          const stat = segment.cachedStats.namedStats[statKey];
          const statLabel = stat.label || stat.name;
          const statUnit = stat.unit ? ` (${stat.unit})` : '';
          allStats.add(`${statLabel}${statUnit}`);
        }
      }
    }

    // Then create a row for each statistic
    for (const statName of allStats) {
      const statRow = [statName];
      for (const segment of Object.values(segmentationData.segments)) {
        let statValue = '';
        if (segment.cachedStats && segment.cachedStats.namedStats) {
          for (const statKey in segment.cachedStats.namedStats) {
            const stat = segment.cachedStats.namedStats[statKey];
            const currentStatName = `${stat.label || stat.name}${stat.unit ? ` (${stat.unit})` : ''}`;
            if (currentStatName === statName) {
              statValue = stat.value !== undefined ? stat.value : '';
              break;
            }
          }
        }
        statRow.push(statValue);
      }
      csvRows.push(statRow);
    }
  }

  // Convert to CSV string
  let csvString = '';
  for (const row of csvRows) {
    const formattedRow = row.map(cell => {
      // Handle values that need to be quoted (contain commas, quotes, or newlines)
      const cellValue = cell !== undefined && cell !== null ? cell.toString() : '';
      if (cellValue.includes(',') || cellValue.includes('"') || cellValue.includes('\n')) {
        // Escape quotes and wrap in quotes
        return '"' + cellValue.replace(/"/g, '""') + '"';
      }
      return cellValue;
    });
    csvString += formattedRow.join(',') + '\n';
  }

  // Create a download link and trigger the download
  const blob = new Blob([csvString], {
    type: 'text/csv;charset=utf-8;'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${segmentationData.label || 'Segmentation'}_Report_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
;// ../../../extensions/cornerstone/src/utils/hydrationUtils.ts
function getUpdatedViewportsForSegmentation({
  viewportId,
  servicesManager,
  displaySetInstanceUIDs
}) {
  const {
    hangingProtocolService,
    viewportGridService
  } = servicesManager.services;
  const {
    isHangingProtocolLayout
  } = viewportGridService.getState();
  const viewport = getTargetViewport({
    viewportId,
    viewportGridService
  });
  const targetViewportId = viewport.viewportOptions.viewportId;
  const updatedViewports = hangingProtocolService.getViewportsRequireUpdate(targetViewportId, displaySetInstanceUIDs[0], isHangingProtocolLayout);
  return updatedViewports.filter(v => v.viewportOptions?.viewportType !== 'volume3d');
}
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

;// ../../../extensions/cornerstone/src/commandsModule.ts






















const {
  DefaultHistoryMemo
} = esm.utilities.HistoryMemo;
const toggleSyncFunctions = {
  imageSlice: toggleImageSliceSync,
  voi: toggleVOISliceSync
};
const {
  segmentation: segmentationUtils
} = dist_esm.utilities;
const getLabelmapTools = ({
  toolGroupService
}) => {
  const labelmapTools = [];
  const toolGroupIds = toolGroupService.getToolGroupIds();
  toolGroupIds.forEach(toolGroupId => {
    const toolGroup = dist_esm.ToolGroupManager.getToolGroup(toolGroupId);
    const tools = toolGroup.getToolInstances();
    // tools is an object with toolName as the key and tool as the value
    Object.keys(tools).forEach(toolName => {
      const tool = tools[toolName];
      if (tool instanceof dist_esm.LabelmapBaseTool && tool.shouldResolvePreviewRequests()) {
        labelmapTools.push(tool);
      }
    });
  });
  return labelmapTools;
};
const getPreviewTools = ({
  toolGroupService
}) => {
  const labelmapTools = getLabelmapTools({
    toolGroupService
  });
  const previewTools = labelmapTools.filter(tool => tool.acceptPreview || tool.rejectPreview);
  return previewTools;
};
const segmentAI = new ai_dist_esm/* ONNXSegmentationController */.OU({
  autoSegmentMode: true,
  models: {
    sam_b: [{
      name: 'sam-b-encoder',
      url: 'https://huggingface.co/schmuell/sam-b-fp16/resolve/main/sam_vit_b_01ec64.encoder-fp16.onnx',
      size: 180,
      key: 'encoder'
    }, {
      name: 'sam-b-decoder',
      url: 'https://huggingface.co/schmuell/sam-b-fp16/resolve/main/sam_vit_b_01ec64.decoder.onnx',
      size: 17,
      key: 'decoder'
    }]
  },
  modelName: 'sam_b'
});
let segmentAIEnabled = false;
function commandsModule({
  servicesManager,
  commandsManager,
  extensionManager
}) {
  const {
    viewportGridService,
    toolGroupService,
    cineService,
    uiDialogService,
    cornerstoneViewportService,
    uiNotificationService,
    measurementService,
    customizationService,
    colorbarService,
    hangingProtocolService,
    syncGroupService,
    segmentationService,
    displaySetService
  } = servicesManager.services;
  function _getActiveViewportEnabledElement() {
    return getActiveViewportEnabledElement(viewportGridService);
  }
  function _getViewportEnabledElement(viewportId) {
    return getViewportEnabledElement(viewportId);
  }
  function _getActiveViewportToolGroupId() {
    const viewport = _getActiveViewportEnabledElement();
    return toolGroupService.getToolGroupForViewport(viewport.id);
  }
  function _getActiveSegmentationInfo() {
    const viewportId = viewportGridService.getActiveViewportId();
    const activeSegmentation = segmentationService.getActiveSegmentation(viewportId);
    const segmentationId = activeSegmentation?.segmentationId;
    const activeSegmentIndex = segmentationService.getActiveSegment(viewportId).segmentIndex;
    return {
      segmentationId,
      segmentIndex: activeSegmentIndex
    };
  }
  const actions = {
    jumpToMeasurementViewport: ({
      annotationUID,
      measurement
    }) => {
      dist_esm.annotation.selection.setAnnotationSelected(annotationUID, true);
      const {
        metadata
      } = measurement;
      const activeViewportId = viewportGridService.getActiveViewportId();
      // Finds the best viewport to jump to for showing the annotation view reference
      // This may be different from active if there is a viewport already showing the display set.
      const viewportId = cornerstoneViewportService.findNavigationCompatibleViewportId(activeViewportId, metadata);
      if (viewportId) {
        const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
        viewport.setViewReference(metadata);
        viewport.render();
        return;
      }
      const {
        displaySetInstanceUID: referencedDisplaySetInstanceUID
      } = measurement;
      if (!referencedDisplaySetInstanceUID) {
        console.warn('ViewportGrid::No display set found in', measurement);
        return;
      }

      // Finds the viewport to update to show the given displayset/orientation.
      // This will choose a view already containing the measurement display set
      // if possible, otherwise will fallback to the active.
      const viewportToUpdate = cornerstoneViewportService.findUpdateableViewportConfiguration(activeViewportId, measurement);
      if (!viewportToUpdate) {
        console.warn('Unable to find a viewport to show this in');
        return;
      }
      const updatedViewports = hangingProtocolService.getViewportsRequireUpdate(viewportToUpdate.viewportId, referencedDisplaySetInstanceUID);
      if (!updatedViewports?.[0]) {
        console.warn('ViewportGrid::Unable to navigate to viewport containing', referencedDisplaySetInstanceUID);
        return;
      }
      updatedViewports[0].viewportOptions = viewportToUpdate.viewportOptions;

      // Update stored position presentation
      commandsManager.run('updateStoredPositionPresentation', {
        viewportId: viewportToUpdate.viewportId,
        displaySetInstanceUIDs: [referencedDisplaySetInstanceUID],
        referencedImageId: measurement.referencedImageId,
        options: {
          ...measurement.metadata
        }
      });
      commandsManager.run('setDisplaySetsForViewports', {
        viewportsToUpdate: updatedViewports
      });
    },
    hydrateSecondaryDisplaySet: async ({
      displaySet,
      viewportId
    }) => {
      if (!displaySet) {
        return;
      }
      if (displaySet.isOverlayDisplaySet) {
        // update the previously stored segmentationPresentation with the new viewportId
        // presentation so that when we put the referencedDisplaySet back in the viewport
        // it will have the correct segmentation representation hydrated
        commandsManager.runCommand('updateStoredSegmentationPresentation', {
          displaySet,
          type: displaySet.Modality === 'SEG' ? esm_enums.SegmentationRepresentations.Labelmap : esm_enums.SegmentationRepresentations.Contour
        });
      }
      const referencedDisplaySetInstanceUID = displaySet.referencedDisplaySetInstanceUID;
      const storePositionPresentation = refDisplaySet => {
        // update the previously stored positionPresentation with the new viewportId
        // presentation so that when we put the referencedDisplaySet back in the viewport
        // it will be in the correct position zoom and pan
        commandsManager.runCommand('updateStoredPositionPresentation', {
          viewportId,
          displaySetInstanceUIDs: [refDisplaySet.displaySetInstanceUID]
        });
      };
      if (displaySet.Modality === 'SEG' || displaySet.Modality === 'RTSTRUCT') {
        const referencedDisplaySet = displaySetService.getDisplaySetByUID(referencedDisplaySetInstanceUID);
        storePositionPresentation(referencedDisplaySet);
        const results = commandsManager.runCommand('loadSegmentationDisplaySetsForViewport', {
          viewportId,
          displaySetInstanceUIDs: [referencedDisplaySet.displaySetInstanceUID]
        });
        const disableEditing = customizationService.getCustomization('panelSegmentation.disableEditing');
        if (disableEditing) {
          const segmentationRepresentations = segmentationService.getSegmentationRepresentations(viewportId, {
            segmentationId: displaySet.displaySetInstanceUID
          });
          segmentationRepresentations.forEach(representation => {
            const segmentIndices = Object.keys(representation.segments);
            segmentIndices.forEach(segmentIndex => {
              segmentationService.setSegmentLocked(representation.segmentationId, parseInt(segmentIndex), true);
            });
          });
        }
        return results;
      } else if (displaySet.Modality === 'SR') {
        const results = commandsManager.runCommand('hydrateStructuredReport', {
          displaySetInstanceUID: displaySet.displaySetInstanceUID
        });
        const {
          SeriesInstanceUIDs
        } = results;
        const referencedDisplaySets = displaySetService.getDisplaySetsForSeries(SeriesInstanceUIDs[0]);
        referencedDisplaySets.forEach(storePositionPresentation);
        if (referencedDisplaySets.length) {
          actions.setDisplaySetsForViewports({
            viewportsToUpdate: [{
              viewportId: viewportGridService.getActiveViewportId(),
              displaySetInstanceUIDs: [referencedDisplaySets[0].displaySetInstanceUID]
            }]
          });
        }
        return results;
      }
    },
    runSegmentBidirectional: async ({
      segmentationId,
      segmentIndex
    } = {}) => {
      // Get active segmentation if not specified
      const targetSegmentation = segmentationId && segmentIndex ? {
        segmentationId,
        segmentIndex
      } : _getActiveSegmentationInfo();
      const {
        segmentationId: targetId,
        segmentIndex: targetIndex
      } = targetSegmentation;

      // Get bidirectional measurement data
      const bidirectionalData = await dist_esm.utilities.segmentation.getSegmentLargestBidirectional({
        segmentationId: targetId,
        segmentIndices: [targetIndex]
      });
      const activeViewportId = viewportGridService.getActiveViewportId();

      // Process each bidirectional measurement
      bidirectionalData.forEach(measurement => {
        const {
          segmentIndex,
          majorAxis,
          minorAxis
        } = measurement;

        // Create annotation
        const annotation = dist_esm.SegmentBidirectionalTool.hydrate(activeViewportId, [majorAxis, minorAxis], {
          segmentIndex,
          segmentationId: targetId
        });
        measurement.annotationUID = annotation.annotationUID;

        // Update segmentation stats
        const updatedSegmentation = updateSegmentBidirectionalStats({
          segmentationId: targetId,
          segmentIndex: targetIndex,
          bidirectionalData: measurement,
          segmentationService,
          annotation
        });

        // Save changes if needed
        if (updatedSegmentation) {
          segmentationService.addOrUpdateSegmentation({
            segmentationId: targetId,
            segments: updatedSegmentation.segments
          });
        }
      });

      // get the active segmentIndex bidirectional annotation and jump to it
      const activeBidirectional = bidirectionalData.find(measurement => measurement.segmentIndex === targetIndex);
      commandsManager.run('jumpToMeasurement', {
        uid: activeBidirectional.annotationUID
      });
    },
    interpolateLabelmap: () => {
      const {
        segmentationId,
        segmentIndex
      } = _getActiveSegmentationInfo();
      labelmap_interpolation_dist_esm/* interpolate */.G({
        segmentationId,
        segmentIndex
      });
    },
    /**
     * Generates the selector props for the context menu, specific to
     * the cornerstone viewport, and then runs the context menu.
     */
    showCornerstoneContextMenu: options => {
      const element = _getActiveViewportEnabledElement()?.viewport?.element;
      const optionsToUse = {
        ...options,
        element
      };
      const {
        useSelectedAnnotation,
        nearbyToolData,
        event
      } = optionsToUse;

      // This code is used to invoke the context menu via keyboard shortcuts
      if (useSelectedAnnotation && !nearbyToolData) {
        const firstAnnotationSelected = getFirstAnnotationSelected(element);
        // filter by allowed selected tools from config property (if there is any)
        const isToolAllowed = !optionsToUse.allowedSelectedTools || optionsToUse.allowedSelectedTools.includes(firstAnnotationSelected?.metadata?.toolName);
        if (isToolAllowed) {
          optionsToUse.nearbyToolData = firstAnnotationSelected;
        } else {
          return;
        }
      }
      optionsToUse.defaultPointsPosition = [];
      // if (optionsToUse.nearbyToolData) {
      //   optionsToUse.defaultPointsPosition = commandsManager.runCommand(
      //     'getToolDataActiveCanvasPoints',
      //     { toolData: optionsToUse.nearbyToolData }
      //   );
      // }

      // TODO - make the selectorProps richer by including the study metadata and display set.
      optionsToUse.selectorProps = {
        toolName: optionsToUse.nearbyToolData?.metadata?.toolName,
        value: optionsToUse.nearbyToolData,
        uid: optionsToUse.nearbyToolData?.annotationUID,
        nearbyToolData: optionsToUse.nearbyToolData,
        event,
        ...optionsToUse.selectorProps
      };
      commandsManager.run(options, optionsToUse);
    },
    updateStoredSegmentationPresentation: ({
      displaySet,
      type
    }) => {
      const {
        addSegmentationPresentationItem
      } = useSegmentationPresentationStore/* useSegmentationPresentationStore */.v.getState();
      const referencedDisplaySetInstanceUID = displaySet.referencedDisplaySetInstanceUID;
      addSegmentationPresentationItem(referencedDisplaySetInstanceUID, {
        segmentationId: displaySet.displaySetInstanceUID,
        hydrated: true,
        type
      });
    },
    /** Stores the changed position presentation */
    updateStoredPositionPresentation: ({
      viewportId,
      displaySetInstanceUIDs,
      referencedImageId,
      options
    }) => {
      const presentations = cornerstoneViewportService.getPresentations(viewportId);
      const {
        positionPresentationStore,
        setPositionPresentation,
        getPositionPresentationId
      } = usePositionPresentationStore/* usePositionPresentationStore */.q.getState();

      // Look inside positionPresentationStore and find the key that includes ALL the displaySetInstanceUIDs
      // and the value has viewportId as activeViewportId.
      let previousReferencedDisplaySetStoreKey;
      if (displaySetInstanceUIDs && Array.isArray(displaySetInstanceUIDs) && displaySetInstanceUIDs.length > 0) {
        previousReferencedDisplaySetStoreKey = Object.entries(positionPresentationStore).find(([key, value]) => {
          return displaySetInstanceUIDs.every(uid => key.includes(uid)) && value?.viewportId === viewportId;
        })?.[0];
      }

      // Create presentation data with referencedImageId and options if provided
      const presentationData = referencedImageId || options?.FrameOfReferenceUID ? {
        ...presentations.positionPresentation,
        viewReference: {
          referencedImageId,
          ...options
        }
      } : presentations.positionPresentation;
      if (previousReferencedDisplaySetStoreKey) {
        setPositionPresentation(previousReferencedDisplaySetStoreKey, presentationData);
        return;
      }

      // if not found means we have not visited that referencedDisplaySetInstanceUID before
      // so we need to grab the positionPresentationId directly from the store,
      // Todo: this is really hacky, we should have a better way for this
      const positionPresentationId = getPositionPresentationId({
        displaySetInstanceUIDs,
        viewportId
      });
      setPositionPresentation(positionPresentationId, presentationData);
    },
    getNearbyToolData({
      nearbyToolData,
      element,
      canvasCoordinates
    }) {
      return nearbyToolData ?? dist_esm.utilities.getAnnotationNearPoint(element, canvasCoordinates);
    },
    getNearbyAnnotation({
      element,
      canvasCoordinates
    }) {
      const nearbyToolData = actions.getNearbyToolData({
        nearbyToolData: null,
        element,
        canvasCoordinates
      });
      const isAnnotation = toolName => {
        const enabledElement = (0,esm.getEnabledElement)(element);
        if (!enabledElement) {
          return;
        }
        const {
          renderingEngineId,
          viewportId
        } = enabledElement;
        const toolGroup = dist_esm.ToolGroupManager.getToolGroupForViewport(viewportId, renderingEngineId);
        const toolInstance = toolGroup.getToolInstance(toolName);
        return toolInstance?.constructor?.isAnnotation ?? true;
      };
      return nearbyToolData?.metadata?.toolName && isAnnotation(nearbyToolData.metadata.toolName) ? nearbyToolData : null;
    },
    /**
     * Common logic for handling measurement label updates through dialog
     * @param uid - measurement uid
     * @returns Promise that resolves when the label is updated
     */
    _handleMeasurementLabelDialog: async uid => {
      const labelConfig = customizationService.getCustomization('measurementLabels');
      const renderContent = customizationService.getCustomization('ui.labellingComponent');
      const measurement = measurementService.getMeasurement(uid);
      if (!measurement) {
        console.debug('No measurement found for label editing');
        return;
      }
      if (!labelConfig) {
        const label = await (0,default_src.callInputDialog)({
          uiDialogService,
          title: 'Edit Measurement Label',
          placeholder: measurement.label || 'Enter new label',
          defaultValue: measurement.label
        });
        if (label !== undefined && label !== null) {
          measurementService.update(uid, {
            ...measurement,
            label
          }, true);
        }
        return;
      }
      const val = await (0,default_src.callInputDialogAutoComplete)({
        measurement,
        uiDialogService,
        labelConfig,
        renderContent
      });
      if (val !== undefined && val !== null) {
        measurementService.update(uid, {
          ...measurement,
          label: val
        }, true);
      }
    },
    /**
     * Show the measurement labelling input dialog and update the label
     * on the measurement with a response if not cancelled.
     */
    setMeasurementLabel: async ({
      uid
    }) => {
      await actions._handleMeasurementLabelDialog(uid);
    },
    renameMeasurement: async ({
      uid
    }) => {
      await actions._handleMeasurementLabelDialog(uid);
    },
    /**
     *
     * @param props - containing the updates to apply
     * @param props.measurementKey - chooses the measurement key to apply the
     *        code to.  This will typically be finding or site to apply a
     *        finding code or a findingSites code.
     * @param props.code - A coding scheme value from DICOM, including:
     *       * CodeValue - the language independent code, for example '1234'
     *       * CodingSchemeDesignator - the issue of the code value
     *       * CodeMeaning - the text value shown to the user
     *       * ref - a string reference in the form `<designator>:<codeValue>`
     *       * type - defaulting to 'finding'.  Will replace other codes of same type
     *       * style - a styling object to use
     *       * Other fields
     *     Note it is a valid option to remove the finding or site values by
     *     supplying null for the code.
     * @param props.uid - the measurement UID to find it with
     * @param props.label - the text value for the code.  Has NOTHING to do with
     *        the measurement label, which can be set with textLabel
     * @param props.textLabel is the measurement label to apply.  Set to null to
     *            delete.
     *
     * If the measurementKey is `site`, then the code will also be added/replace
     * the 0 element of findingSites.  This behaviour is expected to be enhanced
     * in the future with ability to set other site information.
     */
    updateMeasurement: props => {
      const {
        code,
        uid,
        textLabel,
        label
      } = props;
      let {
        style
      } = props;
      const measurement = measurementService.getMeasurement(uid);
      if (!measurement) {
        console.warn('No measurement found to update', uid);
        return;
      }
      const updatedMeasurement = {
        ...measurement
      };
      // Call it textLabel as the label value
      // TODO - remove the label setting when direct rendering of findingSites is enabled
      if (textLabel !== undefined) {
        updatedMeasurement.label = textLabel;
      }
      if (code !== undefined) {
        const measurementKey = code.type || 'finding';
        if (code.ref && !code.CodeValue) {
          const split = code.ref.indexOf(':');
          code.CodeValue = code.ref.substring(split + 1);
          code.CodeMeaning = code.text || label;
          code.CodingSchemeDesignator = code.ref.substring(0, split);
        }
        updatedMeasurement[measurementKey] = code;
        if (measurementKey !== 'finding') {
          if (updatedMeasurement.findingSites) {
            updatedMeasurement.findingSites = updatedMeasurement.findingSites.filter(it => it.type !== measurementKey);
            updatedMeasurement.findingSites.push(code);
          } else {
            updatedMeasurement.findingSites = [code];
          }
        }
      }
      style ||= updatedMeasurement.finding?.style;
      style ||= updatedMeasurement.findingSites?.find(site => site?.style)?.style;
      if (style) {
        // Reset the selected values to preserve appearance on selection
        style.lineDashSelected ||= style.lineDash;
        dist_esm.annotation.config.style.setAnnotationStyles(measurement.uid, style);

        // this is a bit ugly, but given the underlying behavior, this is how it needs to work.
        switch (measurement.toolName) {
          case toolNames.PlanarFreehandROI:
            {
              const targetAnnotation = dist_esm.annotation.state.getAnnotation(measurement.uid);
              targetAnnotation.data.isOpenUShapeContour = !!style.isOpenUShapeContour;
              break;
            }
          default:
            break;
        }
      }
      measurementService.update(updatedMeasurement.uid, updatedMeasurement, true);
    },
    /**
     * Jumps to the specified (by uid) measurement in the active viewport.
     * Also marks any provided display measurements isActive value
     */
    jumpToMeasurement: ({
      uid,
      displayMeasurements = []
    }) => {
      measurementService.jumpToMeasurement(viewportGridService.getActiveViewportId(), uid);
      for (const measurement of displayMeasurements) {
        measurement.isActive = measurement.uid === uid;
      }
    },
    removeMeasurement: ({
      uid
    }) => {
      if (Array.isArray(uid)) {
        measurementService.removeMany(uid);
      } else {
        measurementService.remove(uid);
      }
    },
    toggleLockMeasurement: ({
      uid
    }) => {
      measurementService.toggleLockMeasurement(uid);
    },
    toggleVisibilityMeasurement: ({
      uid,
      items,
      visibility
    }) => {
      if (visibility === undefined && items?.length) {
        visibility = !items[0].isVisible;
      }
      if (Array.isArray(uid)) {
        measurementService.toggleVisibilityMeasurementMany(uid, visibility);
      } else {
        measurementService.toggleVisibilityMeasurement(uid, visibility);
      }
    },
    /**
     * Download the CSV report for the measurements.
     */
    downloadCSVMeasurementsReport: ({
      measurementFilter
    }) => {
      src.utils.downloadCSVReport(measurementService.getMeasurements(measurementFilter));
    },
    downloadCSVSegmentationReport: ({
      segmentationId
    }) => {
      const segmentation = segmentationService.getSegmentation(segmentationId);
      const {
        representationData
      } = segmentation;
      const {
        Labelmap
      } = representationData;
      const {
        referencedImageIds
      } = Labelmap;
      const firstImageId = referencedImageIds[0];

      // find displaySet for firstImageId
      const displaySet = displaySetService.getActiveDisplaySets().find(ds => ds.imageIds?.some(i => i === firstImageId));
      const {
        SeriesNumber,
        SeriesInstanceUID,
        StudyInstanceUID,
        SeriesDate,
        SeriesTime,
        SeriesDescription
      } = displaySet;
      const additionalInfo = {
        reference: {
          SeriesNumber,
          SeriesInstanceUID,
          StudyInstanceUID,
          SeriesDate,
          SeriesTime,
          SeriesDescription
        }
      };
      generateSegmentationCSVReport(segmentation, additionalInfo);
    },
    // Retrieve value commands
    getActiveViewportEnabledElement: _getActiveViewportEnabledElement,
    setViewportActive: ({
      viewportId
    }) => {
      const viewportInfo = cornerstoneViewportService.getViewportInfo(viewportId);
      if (!viewportInfo) {
        console.warn('No viewport found for viewportId:', viewportId);
        return;
      }
      viewportGridService.setActiveViewportId(viewportId);
    },
    arrowTextCallback: async ({
      callback,
      data
    }) => {
      const labelConfig = customizationService.getCustomization('measurementLabels');
      const renderContent = customizationService.getCustomization('ui.labellingComponent');
      if (!labelConfig) {
        const label = await (0,default_src.callInputDialog)({
          uiDialogService,
          title: 'Edit Arrow Text',
          placeholder: data?.data?.label || 'Enter new text',
          defaultValue: data?.data?.label || ''
        });
        callback?.(label);
        return;
      }
      const value = await (0,default_src.callInputDialogAutoComplete)({
        uiDialogService,
        labelConfig,
        renderContent
      });
      callback?.(value);
    },
    toggleCine: () => {
      const {
        viewports
      } = viewportGridService.getState();
      const {
        isCineEnabled
      } = cineService.getState();
      cineService.setIsCineEnabled(!isCineEnabled);
      viewports.forEach((_, index) => cineService.setCine({
        id: index,
        isPlaying: false
      }));
    },
    setViewportWindowLevel({
      viewportId,
      windowWidth,
      windowCenter,
      displaySetInstanceUID
    }) {
      // convert to numbers
      const windowWidthNum = Number(windowWidth);
      const windowCenterNum = Number(windowCenter);

      // get actor from the viewport
      const renderingEngine = cornerstoneViewportService.getRenderingEngine();
      const viewport = renderingEngine.getViewport(viewportId);
      const {
        lower,
        upper
      } = esm.utilities.windowLevel.toLowHighRange(windowWidthNum, windowCenterNum);
      if (viewport instanceof esm.BaseVolumeViewport) {
        const volumeId = actions.getVolumeIdForDisplaySet({
          viewportId,
          displaySetInstanceUID
        });
        viewport.setProperties({
          voiRange: {
            upper,
            lower
          }
        }, volumeId);
      } else {
        viewport.setProperties({
          voiRange: {
            upper,
            lower
          }
        });
      }
      viewport.render();
    },
    toggleViewportColorbar: ({
      viewportId,
      displaySetInstanceUIDs,
      options = {}
    }) => {
      const hasColorbar = colorbarService.hasColorbar(viewportId);
      if (hasColorbar) {
        colorbarService.removeColorbar(viewportId);
        return;
      }
      colorbarService.addColorbar(viewportId, displaySetInstanceUIDs, options);
    },
    setWindowLevel(props) {
      const {
        toolGroupId
      } = props;
      const {
        viewportId
      } = _getActiveViewportEnabledElement();
      const viewportToolGroupId = toolGroupService.getToolGroupForViewport(viewportId);
      if (toolGroupId && toolGroupId !== viewportToolGroupId) {
        return;
      }
      actions.setViewportWindowLevel({
        ...props,
        viewportId
      });
    },
    setWindowLevelPreset: ({
      presetName,
      presetIndex
    }) => {
      const windowLevelPresets = customizationService.getCustomization('cornerstone.windowLevelPresets');
      const activeViewport = viewportGridService.getActiveViewportId();
      const viewport = cornerstoneViewportService.getCornerstoneViewport(activeViewport);
      const metadata = viewport.getImageData().metadata;
      const modality = metadata.Modality;
      if (!modality) {
        return;
      }
      const windowLevelPresetForModality = windowLevelPresets[modality];
      if (!windowLevelPresetForModality) {
        return;
      }
      const windowLevelPreset = windowLevelPresetForModality[presetName] ?? Object.values(windowLevelPresetForModality)[presetIndex];
      actions.setViewportWindowLevel({
        viewportId: activeViewport,
        windowWidth: windowLevelPreset.window,
        windowCenter: windowLevelPreset.level
      });
    },
    getVolumeIdForDisplaySet: ({
      viewportId,
      displaySetInstanceUID
    }) => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (viewport instanceof esm.BaseVolumeViewport) {
        const volumeIds = viewport.getAllVolumeIds();
        const volumeId = volumeIds.find(id => id.includes(displaySetInstanceUID));
        return volumeId;
      }
      return null;
    },
    setToolEnabled: ({
      toolName,
      toggle,
      toolGroupId
    }) => {
      const {
        viewports
      } = viewportGridService.getState();
      if (!viewports.size) {
        return;
      }
      const toolGroup = toolGroupService.getToolGroup(toolGroupId ?? null);
      if (!toolGroup || !toolGroup.hasTool(toolName)) {
        return;
      }
      const toolIsEnabled = toolGroup.getToolOptions(toolName).mode === dist_esm.Enums.ToolModes.Enabled;

      // Toggle the tool's state only if the toggle is true
      if (toggle) {
        toolIsEnabled ? toolGroup.setToolDisabled(toolName) : toolGroup.setToolEnabled(toolName);
      } else {
        toolGroup.setToolEnabled(toolName);
      }
      const renderingEngine = cornerstoneViewportService.getRenderingEngine();
      renderingEngine.render();
    },
    toggleEnabledDisabledToolbar({
      value,
      itemId,
      toolGroupId
    }) {
      const toolName = itemId || value;
      toolGroupId = toolGroupId ?? _getActiveViewportToolGroupId();
      const toolGroup = toolGroupService.getToolGroup(toolGroupId);
      if (!toolGroup || !toolGroup.hasTool(toolName)) {
        return;
      }
      const toolIsEnabled = toolGroup.getToolOptions(toolName).mode === dist_esm.Enums.ToolModes.Enabled;
      toolIsEnabled ? toolGroup.setToolDisabled(toolName) : toolGroup.setToolEnabled(toolName);
    },
    toggleActiveDisabledToolbar({
      value,
      itemId,
      toolGroupId
    }) {
      const toolName = itemId || value;
      toolGroupId = toolGroupId ?? _getActiveViewportToolGroupId();
      const toolGroup = toolGroupService.getToolGroup(toolGroupId);
      if (!toolGroup || !toolGroup.hasTool(toolName)) {
        return;
      }
      const toolIsActive = [dist_esm.Enums.ToolModes.Active, dist_esm.Enums.ToolModes.Enabled, dist_esm.Enums.ToolModes.Passive].includes(toolGroup.getToolOptions(toolName).mode);
      toolIsActive ? toolGroup.setToolDisabled(toolName) : actions.setToolActive({
        toolName,
        toolGroupId
      });

      // we should set the previously active tool to active after we set the
      // current tool disabled
      if (toolIsActive) {
        const prevToolName = toolGroup.getPrevActivePrimaryToolName();
        if (prevToolName !== toolName) {
          actions.setToolActive({
            toolName: prevToolName,
            toolGroupId
          });
        }
      }
    },
    setToolActiveToolbar: ({
      value,
      itemId,
      toolName,
      toolGroupIds = []
    }) => {
      // Sometimes it is passed as value (tools with options), sometimes as itemId (toolbar buttons)
      toolName = toolName || itemId || value;
      toolGroupIds = toolGroupIds.length ? toolGroupIds : toolGroupService.getToolGroupIds();
      toolGroupIds.forEach(toolGroupId => {
        actions.setToolActive({
          toolName,
          toolGroupId
        });
      });
    },
    setToolActive: ({
      toolName,
      toolGroupId = null
    }) => {
      const {
        viewports
      } = viewportGridService.getState();
      if (!viewports.size) {
        return;
      }
      const toolGroup = toolGroupService.getToolGroup(toolGroupId);
      if (!toolGroup) {
        return;
      }
      if (!toolGroup?.hasTool(toolName)) {
        return;
      }
      const activeToolName = toolGroup.getActivePrimaryMouseButtonTool();
      if (activeToolName) {
        const activeToolOptions = toolGroup.getToolConfiguration(activeToolName);
        activeToolOptions?.disableOnPassive ? toolGroup.setToolDisabled(activeToolName) : toolGroup.setToolPassive(activeToolName);
      }

      // Set the new toolName to be active
      toolGroup.setToolActive(toolName, {
        bindings: [{
          mouseButton: dist_esm.Enums.MouseBindings.Primary
        }]
      });
    },
    // AI VLM viewport
    showDownloadVLMViewportModal: () => {
      const {
        activeViewportId
      } = viewportGridService.getState();
      if (!cornerstoneViewportService.getCornerstoneViewport(activeViewportId)) {
        uiNotificationService.show({
          title: 'VLM Analyzer',
          message: 'Image cannot be analyzed',
          type: 'error'
        });
        return;
      }
      const {
        uiModalService
      } = servicesManager.services;
      if (uiModalService) {
        uiModalService.show({
          content: utils_CornerstoneVLMViewportForm,
          title: 'VLM Analyzer',
          contentProps: {
            activeViewportId,
            cornerstoneViewportService
          },
          containerClassName: 'max-w-4xl p-4'
        });
      }
    },
    // capture viewport
    showDownloadViewportModal: () => {
      const {
        activeViewportId
      } = viewportGridService.getState();
      if (!cornerstoneViewportService.getCornerstoneViewport(activeViewportId)) {
        // Cannot download a non-cornerstone viewport (image).
        uiNotificationService.show({
          title: 'Download Image',
          message: 'Image cannot be downloaded',
          type: 'error'
        });
        return;
      }
      const {
        uiModalService
      } = servicesManager.services;
      if (uiModalService) {
        uiModalService.show({
          content: utils_CornerstoneViewportDownloadForm,
          title: 'Download High Quality Image',
          contentProps: {
            activeViewportId,
            cornerstoneViewportService
          },
          containerClassName: 'max-w-4xl p-4'
        });
      }
    },
    /**
     * Rotates the viewport by `rotation` relative to its current rotation.
     */
    rotateViewportBy: ({
      rotation,
      viewportId
    }) => {
      actions._rotateViewport({
        rotation,
        viewportId,
        rotationMode: 'apply'
      });
    },
    /**
     * Sets the viewport rotation to an absolute value `rotation`.
     */
    setViewportRotation: ({
      rotation,
      viewportId
    }) => {
      actions._rotateViewport({
        rotation,
        viewportId,
        rotationMode: 'set'
      });
    },
    flipViewportHorizontal: ({
      viewportId,
      newValue = 'toggle'
    }) => {
      const enabledElement = viewportId ? _getViewportEnabledElement(viewportId) : _getActiveViewportEnabledElement();
      if (!enabledElement) {
        return;
      }
      const {
        viewport
      } = enabledElement;
      let flipHorizontal;
      if (newValue === 'toggle') {
        const {
          flipHorizontal: currentHorizontalFlip
        } = viewport.getCamera();
        flipHorizontal = !currentHorizontalFlip;
      } else {
        flipHorizontal = newValue;
      }
      viewport.setCamera({
        flipHorizontal
      });
      viewport.render();
    },
    flipViewportVertical: ({
      viewportId,
      newValue = 'toggle'
    }) => {
      const enabledElement = viewportId ? _getViewportEnabledElement(viewportId) : _getActiveViewportEnabledElement();
      if (!enabledElement) {
        return;
      }
      const {
        viewport
      } = enabledElement;
      let flipVertical;
      if (newValue === 'toggle') {
        const {
          flipVertical: currentVerticalFlip
        } = viewport.getCamera();
        flipVertical = !currentVerticalFlip;
      } else {
        flipVertical = newValue;
      }
      viewport.setCamera({
        flipVertical
      });
      viewport.render();
    },
    invertViewport: ({
      element
    }) => {
      let enabledElement;
      if (element === undefined) {
        enabledElement = _getActiveViewportEnabledElement();
      } else {
        enabledElement = element;
      }
      if (!enabledElement) {
        return;
      }
      const {
        viewport
      } = enabledElement;
      const {
        invert
      } = viewport.getProperties();
      viewport.setProperties({
        invert: !invert
      });
      viewport.render();
    },
    resetViewport: () => {
      const enabledElement = _getActiveViewportEnabledElement();
      if (!enabledElement) {
        return;
      }
      const {
        viewport
      } = enabledElement;
      viewport.resetProperties?.();
      viewport.resetCamera();
      viewport.render();
    },
    scaleViewport: ({
      direction
    }) => {
      const enabledElement = _getActiveViewportEnabledElement();
      const scaleFactor = direction > 0 ? 0.9 : 1.1;
      if (!enabledElement) {
        return;
      }
      const {
        viewport
      } = enabledElement;
      if (viewport instanceof esm.StackViewport) {
        if (direction) {
          const {
            parallelScale
          } = viewport.getCamera();
          viewport.setCamera({
            parallelScale: parallelScale * scaleFactor
          });
          viewport.render();
        } else {
          viewport.resetCamera();
          viewport.render();
        }
      }
    },
    /** Jumps the active viewport or the specified one to the given slice index */
    jumpToImage: ({
      imageIndex,
      viewport: gridViewport
    }) => {
      // Get current active viewport (return if none active)
      let viewport;
      if (!gridViewport) {
        const enabledElement = _getActiveViewportEnabledElement();
        if (!enabledElement) {
          return;
        }
        viewport = enabledElement.viewport;
      } else {
        viewport = cornerstoneViewportService.getCornerstoneViewport(gridViewport.id);
      }

      // Get number of slices
      // -> Copied from cornerstone3D jumpToSlice\_getImageSliceData()
      let numberOfSlices = 0;
      if (viewport instanceof esm.StackViewport) {
        numberOfSlices = viewport.getImageIds().length;
      } else if (viewport instanceof esm.VolumeViewport) {
        numberOfSlices = esm.utilities.getImageSliceDataForVolumeViewport(viewport).numberOfSlices;
      } else {
        throw new Error('Unsupported viewport type');
      }
      const jumpIndex = imageIndex < 0 ? numberOfSlices + imageIndex : imageIndex;
      if (jumpIndex >= numberOfSlices || jumpIndex < 0) {
        throw new Error(`Can't jump to ${imageIndex}`);
      }

      // Set slice to last slice
      const options = {
        imageIndex: jumpIndex
      };
      esm.utilities.jumpToSlice(viewport.element, options);
    },
    scroll: options => {
      const enabledElement = _getActiveViewportEnabledElement();
      // Allow either or direction for consistency in scroll implementation
      options.delta ??= options.direction || 1;
      options.direction ??= options.delta;
      if (!enabledElement) {
        return;
      }
      const {
        viewport
      } = enabledElement;
      esm.utilities.scroll(viewport, options);
    },
    setViewportColormap: ({
      viewportId,
      displaySetInstanceUID,
      colormap,
      opacity = 1,
      immediate = false
    }) => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      let hpOpacity;
      // Retrieve active protocol's viewport match details
      const {
        viewportMatchDetails
      } = hangingProtocolService.getActiveProtocol();
      // Get display set options for the specified viewport ID
      const displaySetsInfo = viewportMatchDetails.get(viewportId)?.displaySetsInfo;
      if (displaySetsInfo) {
        // Find the display set that matches the given UID
        const matchingDisplaySet = displaySetsInfo.find(displaySet => displaySet.displaySetInstanceUID === displaySetInstanceUID);
        // If a matching display set is found, update the opacity with its value
        hpOpacity = matchingDisplaySet?.displaySetOptions?.options?.colormap?.opacity;
      }

      // HP takes priority over the default opacity
      colormap = {
        ...colormap,
        opacity: hpOpacity || opacity
      };
      if (viewport instanceof esm.StackViewport) {
        viewport.setProperties({
          colormap
        });
      }
      if (viewport instanceof esm.VolumeViewport) {
        if (!displaySetInstanceUID) {
          const {
            viewports
          } = viewportGridService.getState();
          displaySetInstanceUID = viewports.get(viewportId)?.displaySetInstanceUIDs[0];
        }

        // ToDo: Find a better way of obtaining the volumeId that corresponds to the displaySetInstanceUID
        const volumeId = viewport.getAllVolumeIds().find(_volumeId => _volumeId.includes(displaySetInstanceUID)) ?? viewport.getVolumeId();
        viewport.setProperties({
          colormap
        }, volumeId);
      }
      if (immediate) {
        viewport.render();
      }
    },
    changeActiveViewport: ({
      direction = 1
    }) => {
      const {
        activeViewportId,
        viewports
      } = viewportGridService.getState();
      const viewportIds = Array.from(viewports.keys());
      const currentIndex = viewportIds.indexOf(activeViewportId);
      const nextViewportIndex = (currentIndex + direction + viewportIds.length) % viewportIds.length;
      viewportGridService.setActiveViewportId(viewportIds[nextViewportIndex]);
    },
    /**
     * If the syncId is given and a synchronizer with that ID already exists, it will
     * toggle it on/off for the provided viewports. If not, it will attempt to create
     * a new synchronizer using the given syncId and type for the specified viewports.
     * If no viewports are provided, you may notice some default behavior.
     * - 'voi' type, we will aim to synchronize all viewports with the same modality
     * -'imageSlice' type, we will aim to synchronize all viewports with the same orientation.
     *
     * @param options
     * @param options.viewports - The viewports to synchronize
     * @param options.syncId - The synchronization group ID
     * @param options.type - The type of synchronization to perform
     */
    toggleSynchronizer: ({
      type,
      viewports,
      syncId
    }) => {
      const synchronizer = syncGroupService.getSynchronizer(syncId);
      if (synchronizer) {
        synchronizer.isDisabled() ? synchronizer.setEnabled(true) : synchronizer.setEnabled(false);
        return;
      }
      const fn = toggleSyncFunctions[type];
      if (fn) {
        fn({
          servicesManager,
          viewports,
          syncId
        });
      }
    },
    setViewportForToolConfiguration: ({
      viewportId,
      toolName
    }) => {
      if (!viewportId) {
        const {
          activeViewportId
        } = viewportGridService.getState();
        viewportId = activeViewportId ?? 'default';
      }
      const toolGroup = toolGroupService.getToolGroupForViewport(viewportId);
      if (!toolGroup?.hasTool(toolName)) {
        return;
      }
      const prevConfig = toolGroup?.getToolConfiguration(toolName);
      toolGroup?.setToolConfiguration(toolName, {
        ...prevConfig,
        sourceViewportId: viewportId
      }, true // overwrite
      );
      const renderingEngine = cornerstoneViewportService.getRenderingEngine();
      renderingEngine.render();
    },
    storePresentation: ({
      viewportId
    }) => {
      cornerstoneViewportService.storePresentation({
        viewportId
      });
    },
    updateVolumeData: ({
      volume
    }) => {
      // update vtkOpenGLTexture and imageData of computed volume
      const {
        imageData,
        vtkOpenGLTexture
      } = volume;
      const numSlices = imageData.getDimensions()[2];
      const slicesToUpdate = [...Array(numSlices).keys()];
      slicesToUpdate.forEach(i => {
        vtkOpenGLTexture.setUpdatedFrame(i);
      });
      imageData.modified();
    },
    attachProtocolViewportDataListener: ({
      protocol,
      stageIndex
    }) => {
      const EVENT = cornerstoneViewportService.EVENTS.VIEWPORT_DATA_CHANGED;
      const command = protocol.callbacks.onViewportDataInitialized;
      const numPanes = protocol.stages?.[stageIndex]?.viewports.length ?? 1;
      let numPanesWithData = 0;
      const {
        unsubscribe
      } = cornerstoneViewportService.subscribe(EVENT, evt => {
        numPanesWithData++;
        if (numPanesWithData === numPanes) {
          commandsManager.run(...command);

          // Unsubscribe from the event
          unsubscribe(EVENT);
        }
      });
    },
    setViewportPreset: ({
      viewportId,
      preset
    }) => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (!viewport) {
        return;
      }
      viewport.setProperties({
        preset
      });
      viewport.render();
    },
    /**
     * Sets the volume quality for a given viewport.
     * @param {string} viewportId - The ID of the viewport to set the volume quality.
     * @param {number} volumeQuality - The desired quality level of the volume rendering.
     */

    setVolumeRenderingQulaity: ({
      viewportId,
      volumeQuality
    }) => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      const {
        actor
      } = viewport.getActors()[0];
      const mapper = actor.getMapper();
      const image = mapper.getInputData();
      const dims = image.getDimensions();
      const spacing = image.getSpacing();
      const spatialDiagonal = gl_matrix_esm/* vec3.length */.eR.length(gl_matrix_esm/* vec3.fromValues */.eR.fromValues(dims[0] * spacing[0], dims[1] * spacing[1], dims[2] * spacing[2]));
      let sampleDistance = spacing.reduce((a, b) => a + b) / 3.0;
      sampleDistance /= volumeQuality > 1 ? 0.5 * volumeQuality ** 2 : 1.0;
      const samplesPerRay = spatialDiagonal / sampleDistance + 1;
      mapper.setMaximumSamplesPerRay(samplesPerRay);
      mapper.setSampleDistance(sampleDistance);
      viewport.render();
    },
    /**
     * Shifts opacity points for a given viewport id.
     * @param {string} viewportId - The ID of the viewport to set the mapping range.
     * @param {number} shift - The shift value to shift the points by.
     */
    shiftVolumeOpacityPoints: ({
      viewportId,
      shift
    }) => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      const {
        actor
      } = viewport.getActors()[0];
      const ofun = actor.getProperty().getScalarOpacity(0);
      const opacityPointValues = []; // Array to hold values
      // Gather Existing Values
      const size = ofun.getSize();
      for (let pointIdx = 0; pointIdx < size; pointIdx++) {
        const opacityPointValue = [0, 0, 0, 0];
        ofun.getNodeValue(pointIdx, opacityPointValue);
        // opacityPointValue now holds [xLocation, opacity, midpoint, sharpness]
        opacityPointValues.push(opacityPointValue);
      }
      // Add offset
      opacityPointValues.forEach(opacityPointValue => {
        opacityPointValue[0] += shift; // Change the location value
      });
      // Set new values
      ofun.removeAllPoints();
      opacityPointValues.forEach(opacityPointValue => {
        ofun.addPoint(...opacityPointValue);
      });
      viewport.render();
    },
    /**
     * Sets the volume lighting settings for a given viewport.
     * @param {string} viewportId - The ID of the viewport to set the lighting settings.
     * @param {Object} options - The lighting settings to be set.
     * @param {boolean} options.shade - The shade setting for the lighting.
     * @param {number} options.ambient - The ambient setting for the lighting.
     * @param {number} options.diffuse - The diffuse setting for the lighting.
     * @param {number} options.specular - The specular setting for the lighting.
     **/

    setVolumeLighting: ({
      viewportId,
      options
    }) => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      const {
        actor
      } = viewport.getActors()[0];
      const property = actor.getProperty();
      if (options.shade !== undefined) {
        property.setShade(options.shade);
      }
      if (options.ambient !== undefined) {
        property.setAmbient(options.ambient);
      }
      if (options.diffuse !== undefined) {
        property.setDiffuse(options.diffuse);
      }
      if (options.specular !== undefined) {
        property.setSpecular(options.specular);
      }
      viewport.render();
    },
    resetCrosshairs: ({
      viewportId
    }) => {
      const crosshairInstances = [];
      const getCrosshairInstances = toolGroupId => {
        const toolGroup = toolGroupService.getToolGroup(toolGroupId);
        crosshairInstances.push(toolGroup.getToolInstance('Crosshairs'));
      };
      if (!viewportId) {
        const toolGroupIds = toolGroupService.getToolGroupIds();
        toolGroupIds.forEach(getCrosshairInstances);
      } else {
        const toolGroup = toolGroupService.getToolGroupForViewport(viewportId);
        getCrosshairInstances(toolGroup.id);
      }
      crosshairInstances.forEach(ins => {
        ins?.computeToolCenter();
      });
    },
    /**
     * Creates a labelmap for the active viewport
     *
     * The created labelmap will be registered as a display set and also added
     * as a segmentation representation to the viewport.
     */
    createLabelmapForViewport: async ({
      viewportId,
      options = {}
    }) => {
      const {
        viewportGridService,
        displaySetService,
        segmentationService
      } = servicesManager.services;
      const {
        viewports
      } = viewportGridService.getState();
      const targetViewportId = viewportId;
      const viewport = viewports.get(targetViewportId);

      // Todo: add support for multiple display sets
      const displaySetInstanceUID = options.displaySetInstanceUID || viewport.displaySetInstanceUIDs[0];
      const segs = segmentationService.getSegmentations();
      const label = options.label || `Segmentation ${segs.length + 1}`;
      const segmentationId = options.segmentationId || `${esm.utilities.uuidv4()}`;
      const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);

      // This will create the segmentation and register it as a display set
      const generatedSegmentationId = await segmentationService.createLabelmapForDisplaySet(displaySet, {
        label,
        segmentationId,
        segments: options.createInitialSegment ? {
          1: {
            label: `${i18n_src/* default */.A.t('Segment')} 1`,
            active: true
          }
        } : {}
      });

      // Also add the segmentation representation to the viewport
      await segmentationService.addSegmentationRepresentation(viewportId, {
        segmentationId,
        type: dist_esm.Enums.SegmentationRepresentations.Labelmap
      });
      return generatedSegmentationId;
    },
    /**
     * Sets the active segmentation for a viewport
     * @param props.segmentationId - The ID of the segmentation to set as active
     */
    setActiveSegmentation: ({
      segmentationId
    }) => {
      const {
        viewportGridService,
        segmentationService
      } = servicesManager.services;
      segmentationService.setActiveSegmentation(viewportGridService.getActiveViewportId(), segmentationId);
    },
    /**
     * Adds a new segment to a segmentation
     * @param props.segmentationId - The ID of the segmentation to add the segment to
     */
    addSegmentCommand: ({
      segmentationId
    }) => {
      const {
        segmentationService
      } = servicesManager.services;
      segmentationService.addSegment(segmentationId);
    },
    /**
     * Sets the active segment and jumps to its center
     * @param props.segmentationId - The ID of the segmentation
     * @param props.segmentIndex - The index of the segment to activate
     */
    setActiveSegmentAndCenterCommand: ({
      segmentationId,
      segmentIndex
    }) => {
      const {
        segmentationService,
        viewportGridService
      } = servicesManager.services;
      // set both active segmentation and active segment
      segmentationService.setActiveSegmentation(viewportGridService.getActiveViewportId(), segmentationId);
      segmentationService.setActiveSegment(segmentationId, segmentIndex);
      segmentationService.jumpToSegmentCenter(segmentationId, segmentIndex);
    },
    /**
     * Toggles the visibility of a segment
     * @param props.segmentationId - The ID of the segmentation
     * @param props.segmentIndex - The index of the segment
     * @param props.type - The type of visibility to toggle
     */
    toggleSegmentVisibilityCommand: ({
      segmentationId,
      segmentIndex,
      type
    }) => {
      const {
        segmentationService,
        viewportGridService
      } = servicesManager.services;
      segmentationService.toggleSegmentVisibility(viewportGridService.getActiveViewportId(), segmentationId, segmentIndex, type);
    },
    /**
     * Toggles the lock state of a segment
     * @param props.segmentationId - The ID of the segmentation
     * @param props.segmentIndex - The index of the segment
     */
    toggleSegmentLockCommand: ({
      segmentationId,
      segmentIndex
    }) => {
      const {
        segmentationService
      } = servicesManager.services;
      segmentationService.toggleSegmentLocked(segmentationId, segmentIndex);
    },
    /**
     * Toggles the visibility of a segmentation representation
     * @param props.segmentationId - The ID of the segmentation
     * @param props.type - The type of representation
     */
    toggleSegmentationVisibilityCommand: ({
      segmentationId,
      type
    }) => {
      const {
        segmentationService,
        viewportGridService
      } = servicesManager.services;
      segmentationService.toggleSegmentationRepresentationVisibility(viewportGridService.getActiveViewportId(), {
        segmentationId,
        type
      });
    },
    /**
     * Downloads a segmentation
     * @param props.segmentationId - The ID of the segmentation to download
     */
    downloadSegmentationCommand: ({
      segmentationId
    }) => {
      const {
        segmentationService
      } = servicesManager.services;
      segmentationService.downloadSegmentation(segmentationId);
    },
    /**
     * Stores a segmentation and shows it in the viewport
     * @param props.segmentationId - The ID of the segmentation to store
     */
    storeSegmentationCommand: async ({
      segmentationId
    }) => {
      const {
        segmentationService,
        viewportGridService
      } = servicesManager.services;
      const displaySetInstanceUIDs = await (0,default_src.createReportAsync)({
        servicesManager,
        getReport: () => commandsManager.runCommand('storeSegmentation', {
          segmentationId
        }),
        reportType: 'Segmentation'
      });
      if (displaySetInstanceUIDs) {
        segmentationService.remove(segmentationId);
        viewportGridService.setDisplaySetsForViewport({
          viewportId: viewportGridService.getActiveViewportId(),
          displaySetInstanceUIDs
        });
      }
    },
    /**
     * Downloads a segmentation as RTSS
     * @param props.segmentationId - The ID of the segmentation
     */
    downloadRTSSCommand: ({
      segmentationId
    }) => {
      const {
        segmentationService
      } = servicesManager.services;
      segmentationService.downloadRTSS(segmentationId);
    },
    /**
     * Sets the style for a segmentation
     * @param props.segmentationId - The ID of the segmentation
     * @param props.type - The type of style
     * @param props.key - The style key to set
     * @param props.value - The style value
     */
    setSegmentationStyleCommand: ({
      type,
      key,
      value
    }) => {
      const {
        segmentationService
      } = servicesManager.services;
      segmentationService.setStyle({
        type
      }, {
        [key]: value
      });
    },
    /**
     * Deletes a segment from a segmentation
     * @param props.segmentationId - The ID of the segmentation
     * @param props.segmentIndex - The index of the segment to delete
     */
    deleteSegmentCommand: ({
      segmentationId,
      segmentIndex
    }) => {
      const {
        segmentationService
      } = servicesManager.services;
      segmentationService.removeSegment(segmentationId, segmentIndex);
    },
    /**
     * Deletes an entire segmentation
     * @param props.segmentationId - The ID of the segmentation to delete
     */
    deleteSegmentationCommand: ({
      segmentationId
    }) => {
      const {
        segmentationService
      } = servicesManager.services;
      segmentationService.remove(segmentationId);
    },
    /**
     * Removes a segmentation from the viewport
     * @param props.segmentationId - The ID of the segmentation to remove
     */
    removeSegmentationFromViewportCommand: ({
      segmentationId
    }) => {
      const {
        segmentationService,
        viewportGridService
      } = servicesManager.services;
      segmentationService.removeSegmentationRepresentations(viewportGridService.getActiveViewportId(), {
        segmentationId
      });
    },
    /**
     * Toggles rendering of inactive segmentations
     */
    toggleRenderInactiveSegmentationsCommand: () => {
      const {
        segmentationService,
        viewportGridService
      } = servicesManager.services;
      const viewportId = viewportGridService.getActiveViewportId();
      const renderInactive = segmentationService.getRenderInactiveSegmentations(viewportId);
      segmentationService.setRenderInactiveSegmentations(viewportId, !renderInactive);
    },
    /**
     * Sets the fill alpha value for a segmentation type
     * @param props.type - The type of segmentation
     * @param props.value - The alpha value to set
     */
    setFillAlphaCommand: ({
      type,
      value
    }) => {
      const {
        segmentationService
      } = servicesManager.services;
      segmentationService.setStyle({
        type
      }, {
        fillAlpha: value
      });
    },
    /**
     * Sets the outline width for a segmentation type
     * @param props.type - The type of segmentation
     * @param props.value - The width value to set
     */
    setOutlineWidthCommand: ({
      type,
      value
    }) => {
      const {
        segmentationService
      } = servicesManager.services;
      segmentationService.setStyle({
        type
      }, {
        outlineWidth: value
      });
    },
    /**
     * Sets whether to render fill for a segmentation type
     * @param props.type - The type of segmentation
     * @param props.value - Whether to render fill
     */
    setRenderFillCommand: ({
      type,
      value
    }) => {
      const {
        segmentationService
      } = servicesManager.services;
      segmentationService.setStyle({
        type
      }, {
        renderFill: value
      });
    },
    /**
     * Sets whether to render outline for a segmentation type
     * @param props.type - The type of segmentation
     * @param props.value - Whether to render outline
     */
    setRenderOutlineCommand: ({
      type,
      value
    }) => {
      const {
        segmentationService
      } = servicesManager.services;
      segmentationService.setStyle({
        type
      }, {
        renderOutline: value
      });
    },
    /**
     * Sets the fill alpha for inactive segmentations
     * @param props.type - The type of segmentation
     * @param props.value - The alpha value to set
     */
    setFillAlphaInactiveCommand: ({
      type,
      value
    }) => {
      const {
        segmentationService
      } = servicesManager.services;
      segmentationService.setStyle({
        type
      }, {
        fillAlphaInactive: value
      });
    },
    editSegmentLabel: async ({
      segmentationId,
      segmentIndex
    }) => {
      const {
        segmentationService,
        uiDialogService
      } = servicesManager.services;
      const segmentation = segmentationService.getSegmentation(segmentationId);
      if (!segmentation) {
        return;
      }
      const segment = segmentation.segments[segmentIndex];
      (0,default_src.callInputDialog)({
        uiDialogService,
        title: 'Edit Segment Label',
        placeholder: 'Enter new label',
        defaultValue: segment.label
      }).then(label => {
        segmentationService.setSegmentLabel(segmentationId, segmentIndex, label);
      });
    },
    editSegmentationLabel: ({
      segmentationId
    }) => {
      const {
        segmentationService,
        uiDialogService
      } = servicesManager.services;
      const segmentation = segmentationService.getSegmentation(segmentationId);
      if (!segmentation) {
        return;
      }
      const {
        label
      } = segmentation;
      (0,default_src.callInputDialog)({
        uiDialogService,
        title: 'Edit Segmentation Label',
        placeholder: 'Enter new label',
        defaultValue: label
      }).then(label => {
        segmentationService.addOrUpdateSegmentation({
          segmentationId,
          label
        });
      });
    },
    editSegmentColor: ({
      segmentationId,
      segmentIndex
    }) => {
      const {
        segmentationService,
        uiDialogService,
        viewportGridService
      } = servicesManager.services;
      const viewportId = viewportGridService.getActiveViewportId();
      const color = segmentationService.getSegmentColor(viewportId, segmentationId, segmentIndex);
      const rgbaColor = {
        r: color[0],
        g: color[1],
        b: color[2],
        a: color[3] / 255.0
      };
      uiDialogService.show({
        content: default_src.colorPickerDialog,
        title: 'Segment Color',
        contentProps: {
          value: rgbaColor,
          onSave: newRgbaColor => {
            const color = [newRgbaColor.r, newRgbaColor.g, newRgbaColor.b, newRgbaColor.a * 255.0];
            segmentationService.setSegmentColor(viewportId, segmentationId, segmentIndex, color);
          }
        }
      });
    },
    getRenderInactiveSegmentations: () => {
      const {
        segmentationService,
        viewportGridService
      } = servicesManager.services;
      return segmentationService.getRenderInactiveSegmentations(viewportGridService.getActiveViewportId());
    },
    deleteActiveAnnotation: () => {
      const activeAnnotationsUID = dist_esm.annotation.selection.getAnnotationsSelected();
      activeAnnotationsUID.forEach(activeAnnotationUID => {
        measurementService.remove(activeAnnotationUID);
      });
    },
    setDisplaySetsForViewports: ({
      viewportsToUpdate
    }) => {
      const {
        cineService,
        viewportGridService
      } = servicesManager.services;
      // Stopping the cine of modified viewports before changing the viewports to
      // avoid inconsistent state and lost references
      viewportsToUpdate.forEach(viewport => {
        const state = cineService.getState();
        const currentCineState = state.cines?.[viewport.viewportId];
        cineService.setCine({
          id: viewport.viewportId,
          frameRate: currentCineState?.frameRate ?? state.default?.frameRate ?? 24,
          isPlaying: false
        });
      });
      viewportGridService.setDisplaySetsForViewports(viewportsToUpdate);
    },
    undo: () => {
      DefaultHistoryMemo.undo();
    },
    redo: () => {
      DefaultHistoryMemo.redo();
    },
    toggleSegmentPreviewEdit: ({
      toggle
    }) => {
      let labelmapTools = getLabelmapTools({
        toolGroupService
      });
      labelmapTools = labelmapTools.filter(tool => !tool.toolName.includes('Eraser'));
      labelmapTools.forEach(tool => {
        tool.configuration = {
          ...tool.configuration,
          preview: {
            ...tool.configuration.preview,
            enabled: toggle
          }
        };
      });
    },
    toggleSegmentSelect: ({
      toggle
    }) => {
      const toolGroupIds = toolGroupService.getToolGroupIds();
      toolGroupIds.forEach(toolGroupId => {
        const toolGroup = dist_esm.ToolGroupManager.getToolGroup(toolGroupId);
        if (toggle) {
          toolGroup.setToolActive(dist_esm.SegmentSelectTool.toolName);
        } else {
          toolGroup.setToolDisabled(dist_esm.SegmentSelectTool.toolName);
        }
      });
    },
    toggleSegmentLabel: () => {
      const toolName = dist_esm.SegmentLabelTool.toolName;
      const toolGroupIds = toolGroupService.getToolGroupIds();
      const isOn = toolGroupIds.some(toolGroupId => {
        const toolGroup = dist_esm.ToolGroupManager.getToolGroup(toolGroupId);
        const mode = toolGroup.getToolInstance(toolName)?.mode;
        return mode === 'Active';
      });
      toolGroupIds.forEach(toolGroupId => {
        const toolGroup = dist_esm.ToolGroupManager.getToolGroup(toolGroupId);
        if (isOn) {
          toolGroup.setToolDisabled(toolName);
        } else {
          toolGroup.setToolActive(toolName);
        }
      });
    },
    /**
     * Used to sync the apps initial state with the config file settings.
     *
     * Will mutate the tools object of the given tool group and add the segmentLabelTool to the proper place.
     *
     * Use it before initializing the toolGroup with the tools.
     */
    initializeSegmentLabelTool: ({
      tools
    }) => {
      const appConfig = extensionManager.appConfig;
      const segmentLabelConfig = appConfig.segmentation?.segmentLabel;
      if (segmentLabelConfig?.enabledByDefault) {
        const activeTools = tools?.active ?? [];
        activeTools.push({
          toolName: toolNames.SegmentLabel,
          configuration: {
            hoverTimeout: segmentLabelConfig?.hoverTimeout ?? 1,
            color: segmentLabelConfig?.labelColor,
            background: segmentLabelConfig?.background
          }
        });
        tools.active = activeTools;
        return tools;
      }
      const disabledTools = tools?.disabled ?? [];
      disabledTools.push({
        toolName: toolNames.SegmentLabel,
        configuration: {
          hoverTimeout: segmentLabelConfig?.hoverTimeout ?? 1,
          color: segmentLabelConfig?.labelColor
        }
      });
      tools.disabled = disabledTools;
      return tools;
    },
    toggleUseCenterSegmentIndex: ({
      toggle
    }) => {
      let labelmapTools = getLabelmapTools({
        toolGroupService
      });
      labelmapTools = labelmapTools.filter(tool => !tool.toolName.includes('Eraser'));
      labelmapTools.forEach(tool => {
        tool.configuration = {
          ...tool.configuration,
          useCenterSegmentIndex: toggle
        };
      });
    },
    _handlePreviewAction: action => {
      const {
        viewport
      } = _getActiveViewportEnabledElement();
      const previewTools = getPreviewTools({
        toolGroupService
      });
      previewTools.forEach(tool => {
        try {
          tool[`${action}Preview`]();
        } catch (error) {
          console.debug('Error accepting preview for tool', tool.toolName);
        }
      });
      if (segmentAI.enabled) {
        segmentAI[`${action}Preview`](viewport.element);
      }
    },
    acceptPreview: () => {
      actions._handlePreviewAction('accept');
    },
    rejectPreview: () => {
      actions._handlePreviewAction('reject');
    },
    clearMarkersForMarkerLabelmap: () => {
      const {
        viewport
      } = _getActiveViewportEnabledElement();
      const toolGroup = dist_esm.ToolGroupManager.getToolGroupForViewport(viewport.id);
      const toolInstance = toolGroup.getToolInstance('MarkerLabelmap');
      if (!toolInstance) {
        return;
      }
      toolInstance.clearMarkers(viewport);
    },
    interpolateScrollForMarkerLabelmap: () => {
      const {
        viewport
      } = _getActiveViewportEnabledElement();
      const toolGroup = dist_esm.ToolGroupManager.getToolGroupForViewport(viewport.id);
      const toolInstance = toolGroup.getToolInstance('MarkerLabelmap');
      if (!toolInstance) {
        return;
      }
      toolInstance.interpolateScroll(viewport, 1);
    },
    toggleLabelmapAssist: async () => {
      const {
        viewport
      } = _getActiveViewportEnabledElement();
      const newState = !segmentAI.enabled;
      segmentAI.enabled = newState;
      if (!segmentAIEnabled) {
        await segmentAI.initModel();
        segmentAIEnabled = true;
      }

      // set the brush tool to active
      const toolGroupIds = toolGroupService.getToolGroupIds();
      if (newState) {
        actions.setToolActiveToolbar({
          toolName: 'CircularBrushForAutoSegmentAI',
          toolGroupIds: toolGroupIds
        });
      } else {
        toolGroupIds.forEach(toolGroupId => {
          const toolGroup = dist_esm.ToolGroupManager.getToolGroup(toolGroupId);
          toolGroup.setToolPassive('CircularBrushForAutoSegmentAI');
        });
      }
      if (segmentAI.enabled) {
        segmentAI.initViewport(viewport);
      }
    },
    setBrushSize: ({
      value,
      toolNames
    }) => {
      const brushSize = Number(value);
      toolGroupService.getToolGroupIds()?.forEach(toolGroupId => {
        if (toolNames?.length === 0) {
          segmentationUtils.setBrushSizeForToolGroup(toolGroupId, brushSize);
        } else {
          toolNames?.forEach(toolName => {
            segmentationUtils.setBrushSizeForToolGroup(toolGroupId, brushSize, toolName);
          });
        }
      });
    },
    setThresholdRange: ({
      value,
      toolNames = ['ThresholdCircularBrush', 'ThresholdSphereBrush', 'ThresholdCircularBrushDynamic', 'ThresholdSphereBrushDynamic']
    }) => {
      const toolGroupIds = toolGroupService.getToolGroupIds();
      if (!toolGroupIds?.length) {
        return;
      }
      for (const toolGroupId of toolGroupIds) {
        const toolGroup = toolGroupService.getToolGroup(toolGroupId);
        toolNames?.forEach(toolName => {
          toolGroup.setToolConfiguration(toolName, {
            threshold: {
              range: value
            }
          });
        });
      }
    },
    increaseBrushSize: () => {
      const toolGroupIds = toolGroupService.getToolGroupIds();
      if (!toolGroupIds?.length) {
        return;
      }
      for (const toolGroupId of toolGroupIds) {
        const brushSize = segmentationUtils.getBrushSizeForToolGroup(toolGroupId);
        segmentationUtils.setBrushSizeForToolGroup(toolGroupId, brushSize + 3);
      }
    },
    decreaseBrushSize: () => {
      const toolGroupIds = toolGroupService.getToolGroupIds();
      if (!toolGroupIds?.length) {
        return;
      }
      for (const toolGroupId of toolGroupIds) {
        const brushSize = segmentationUtils.getBrushSizeForToolGroup(toolGroupId);
        segmentationUtils.setBrushSizeForToolGroup(toolGroupId, brushSize - 3);
      }
    },
    addNewSegment: () => {
      const {
        segmentationService
      } = servicesManager.services;
      const {
        activeViewportId
      } = viewportGridService.getState();
      const activeSegmentation = segmentationService.getActiveSegmentation(activeViewportId);
      if (!activeSegmentation) {
        return;
      }
      segmentationService.addSegment(activeSegmentation.segmentationId);
    },
    loadSegmentationDisplaySetsForViewport: ({
      viewportId,
      displaySetInstanceUIDs
    }) => {
      const updatedViewports = getUpdatedViewportsForSegmentation({
        viewportId,
        servicesManager,
        displaySetInstanceUIDs
      });
      actions.setDisplaySetsForViewports({
        viewportsToUpdate: updatedViewports.map(viewport => ({
          viewportId: viewport.viewportId,
          displaySetInstanceUIDs: viewport.displaySetInstanceUIDs
        }))
      });
    },
    setViewportOrientation: ({
      viewportId,
      orientation
    }) => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (!viewport || viewport.type !== esm.Enums.ViewportType.ORTHOGRAPHIC) {
        console.warn('Orientation can only be set on volume viewports');
        return;
      }

      // Get display sets for this viewport to verify at least one is reconstructable
      const displaySetUIDs = viewportGridService.getDisplaySetsUIDsForViewport(viewportId);
      const displaySets = displaySetUIDs.map(uid => displaySetService.getDisplaySetByUID(uid));
      if (!displaySets.some(ds => ds.isReconstructable)) {
        console.warn('Cannot change orientation: No reconstructable display sets in viewport');
        return;
      }
      viewport.setOrientation(orientation);
      viewport.render();

      // update the orientation in the viewport info
      const viewportInfo = cornerstoneViewportService.getViewportInfo(viewportId);
      viewportInfo.setOrientation(orientation);
    },
    /**
     * Toggles the horizontal flip state of the viewport.
     */
    toggleViewportHorizontalFlip: ({
      viewportId
    } = {}) => {
      actions.flipViewportHorizontal({
        viewportId,
        newValue: 'toggle'
      });
    },
    /**
     * Explicitly sets the horizontal flip state of the viewport.
     */
    setViewportHorizontalFlip: ({
      flipped,
      viewportId
    }) => {
      actions.flipViewportHorizontal({
        viewportId,
        newValue: flipped
      });
    },
    /**
     * Toggles the vertical flip state of the viewport.
     */
    toggleViewportVerticalFlip: ({
      viewportId
    } = {}) => {
      actions.flipViewportVertical({
        viewportId,
        newValue: 'toggle'
      });
    },
    /**
     * Explicitly sets the vertical flip state of the viewport.
     */
    setViewportVerticalFlip: ({
      flipped,
      viewportId
    }) => {
      actions.flipViewportVertical({
        viewportId,
        newValue: flipped
      });
    },
    /**
     * Internal helper to rotate or set absolute rotation for a viewport.
     */
    _rotateViewport: ({
      rotation,
      viewportId,
      rotationMode = 'apply'
    }) => {
      const enabledElement = viewportId ? _getViewportEnabledElement(viewportId) : _getActiveViewportEnabledElement();
      if (!enabledElement) {
        return;
      }
      const {
        viewport
      } = enabledElement;
      if (viewport instanceof esm.BaseVolumeViewport) {
        const camera = viewport.getCamera();
        const rotAngle = rotation * Math.PI / 180;
        const rotMat = gl_matrix_esm/* mat4.identity */.pB.identity(new Float32Array(16));
        gl_matrix_esm/* mat4.rotate */.pB.rotate(rotMat, rotMat, rotAngle, camera.viewPlaneNormal);
        const rotatedViewUp = gl_matrix_esm/* vec3.transformMat4 */.eR.transformMat4(gl_matrix_esm/* vec3.create */.eR.create(), camera.viewUp, rotMat);
        viewport.setCamera({
          viewUp: rotatedViewUp
        });
        viewport.render();
        return;
      }
      if (viewport.getRotation !== undefined) {
        const {
          rotation: currentRotation
        } = viewport.getViewPresentation();
        const newRotation = rotationMode === 'apply' ? (currentRotation + rotation + 360) % 360 : (() => {
          // In 'set' mode, account for the effect horizontal/vertical flips
          // have on the perceived rotation direction. A single flip mirrors
          // the image and inverses rotation direction, while two flips
          // restore the original parity. We therefore invert the rotation
          // angle when an odd number of flips are applied so that the
          // requested absolute rotation matches the user expectation.
          const {
            flipHorizontal = false,
            flipVertical = false
          } = viewport.getViewPresentation();
          const flipsParity = (flipHorizontal ? 1 : 0) + (flipVertical ? 1 : 0);
          const effectiveRotation = flipsParity % 2 === 1 ? -rotation : rotation;
          return (effectiveRotation + 360) % 360;
        })();
        viewport.setViewPresentation({
          rotation: newRotation
        });
        viewport.render();
      }
    },
    startRecordingForAnnotationGroup: () => {
      dist_esm.AnnotationTool.startGroupRecording();
    },
    endRecordingForAnnotationGroup: () => {
      dist_esm.AnnotationTool.endGroupRecording();
    },
    triggerCreateAnnotationMemo: ({
      annotation,
      FrameOfReferenceUID,
      options
    }) => {
      const {
        newAnnotation,
        deleting
      } = options;
      const renderingEngines = (0,esm.getRenderingEngines)();
      const viewports = renderingEngines.flatMap(re => re.getViewports());
      const validViewport = viewports.find(vp => vp.getFrameOfReferenceUID() === FrameOfReferenceUID);
      if (!validViewport) {
        return;
      }
      dist_esm.AnnotationTool.createAnnotationMemo(validViewport.element, annotation, {
        newAnnotation,
        deleting
      });
    }
  };
  const definitions = {
    // The command here is to show the viewer context menu, as being the
    // context menu
    showCornerstoneContextMenu: {
      commandFn: actions.showCornerstoneContextMenu,
      options: {
        menuCustomizationId: 'measurementsContextMenu',
        commands: [{
          commandName: 'showContextMenu'
        }]
      }
    },
    getNearbyToolData: {
      commandFn: actions.getNearbyToolData
    },
    getNearbyAnnotation: {
      commandFn: actions.getNearbyAnnotation,
      storeContexts: [],
      options: {}
    },
    toggleViewportColorbar: {
      commandFn: actions.toggleViewportColorbar
    },
    setMeasurementLabel: {
      commandFn: actions.setMeasurementLabel
    },
    renameMeasurement: {
      commandFn: actions.renameMeasurement
    },
    updateMeasurement: {
      commandFn: actions.updateMeasurement
    },
    jumpToMeasurement: actions.jumpToMeasurement,
    removeMeasurement: {
      commandFn: actions.removeMeasurement
    },
    toggleLockMeasurement: {
      commandFn: actions.toggleLockMeasurement
    },
    toggleVisibilityMeasurement: {
      commandFn: actions.toggleVisibilityMeasurement
    },
    downloadCSVMeasurementsReport: {
      commandFn: actions.downloadCSVMeasurementsReport
    },
    setViewportWindowLevel: {
      commandFn: actions.setViewportWindowLevel
    },
    setWindowLevel: {
      commandFn: actions.setWindowLevel
    },
    setWindowLevelPreset: {
      commandFn: actions.setWindowLevelPreset
    },
    setToolActive: {
      commandFn: actions.setToolActive
    },
    setToolActiveToolbar: {
      commandFn: actions.setToolActiveToolbar
    },
    setToolEnabled: {
      commandFn: actions.setToolEnabled
    },
    rotateViewportCW: {
      commandFn: actions.rotateViewportBy,
      options: {
        rotation: 90
      }
    },
    rotateViewportCCW: {
      commandFn: actions.rotateViewportBy,
      options: {
        rotation: -90
      }
    },
    rotateViewportCWSet: {
      commandFn: actions.setViewportRotation,
      options: {
        rotation: 90
      }
    },
    incrementActiveViewport: {
      commandFn: actions.changeActiveViewport
    },
    decrementActiveViewport: {
      commandFn: actions.changeActiveViewport,
      options: {
        direction: -1
      }
    },
    flipViewportHorizontal: {
      commandFn: actions.toggleViewportHorizontalFlip
    },
    flipViewportVertical: {
      commandFn: actions.toggleViewportVerticalFlip
    },
    setViewportHorizontalFlip: {
      commandFn: actions.setViewportHorizontalFlip,
      options: {
        flipped: true
      }
    },
    setViewportVerticalFlip: {
      commandFn: actions.setViewportVerticalFlip,
      options: {
        flipped: true
      }
    },
    invertViewport: {
      commandFn: actions.invertViewport
    },
    resetViewport: {
      commandFn: actions.resetViewport
    },
    scaleUpViewport: {
      commandFn: actions.scaleViewport,
      options: {
        direction: 1
      }
    },
    scaleDownViewport: {
      commandFn: actions.scaleViewport,
      options: {
        direction: -1
      }
    },
    fitViewportToWindow: {
      commandFn: actions.scaleViewport,
      options: {
        direction: 0
      }
    },
    nextImage: {
      commandFn: actions.scroll,
      options: {
        direction: 1
      }
    },
    previousImage: {
      commandFn: actions.scroll,
      options: {
        direction: -1
      }
    },
    firstImage: {
      commandFn: actions.jumpToImage,
      options: {
        imageIndex: 0
      }
    },
    lastImage: {
      commandFn: actions.jumpToImage,
      options: {
        imageIndex: -1
      }
    },
    jumpToImage: {
      commandFn: actions.jumpToImage
    },
    showDownloadViewportModal: {
      commandFn: actions.showDownloadViewportModal
    },
    showDownloadVLMViewportModal: {
      commandFn: actions.showDownloadVLMViewportModal
    },
    toggleCine: {
      commandFn: actions.toggleCine
    },
    arrowTextCallback: {
      commandFn: actions.arrowTextCallback
    },
    setViewportActive: {
      commandFn: actions.setViewportActive
    },
    setViewportColormap: {
      commandFn: actions.setViewportColormap
    },
    setViewportForToolConfiguration: {
      commandFn: actions.setViewportForToolConfiguration
    },
    storePresentation: {
      commandFn: actions.storePresentation
    },
    attachProtocolViewportDataListener: {
      commandFn: actions.attachProtocolViewportDataListener
    },
    setViewportPreset: {
      commandFn: actions.setViewportPreset
    },
    setVolumeRenderingQulaity: {
      commandFn: actions.setVolumeRenderingQulaity
    },
    shiftVolumeOpacityPoints: {
      commandFn: actions.shiftVolumeOpacityPoints
    },
    setVolumeLighting: {
      commandFn: actions.setVolumeLighting
    },
    resetCrosshairs: {
      commandFn: actions.resetCrosshairs
    },
    toggleSynchronizer: {
      commandFn: actions.toggleSynchronizer
    },
    updateVolumeData: {
      commandFn: actions.updateVolumeData
    },
    toggleEnabledDisabledToolbar: {
      commandFn: actions.toggleEnabledDisabledToolbar
    },
    toggleActiveDisabledToolbar: {
      commandFn: actions.toggleActiveDisabledToolbar
    },
    updateStoredPositionPresentation: {
      commandFn: actions.updateStoredPositionPresentation
    },
    updateStoredSegmentationPresentation: {
      commandFn: actions.updateStoredSegmentationPresentation
    },
    createLabelmapForViewport: {
      commandFn: actions.createLabelmapForViewport
    },
    setActiveSegmentation: {
      commandFn: actions.setActiveSegmentation
    },
    addSegment: {
      commandFn: actions.addSegmentCommand
    },
    setActiveSegmentAndCenter: {
      commandFn: actions.setActiveSegmentAndCenterCommand
    },
    toggleSegmentVisibility: {
      commandFn: actions.toggleSegmentVisibilityCommand
    },
    toggleSegmentLock: {
      commandFn: actions.toggleSegmentLockCommand
    },
    toggleSegmentationVisibility: {
      commandFn: actions.toggleSegmentationVisibilityCommand
    },
    downloadSegmentation: {
      commandFn: actions.downloadSegmentationCommand
    },
    storeSegmentation: {
      commandFn: actions.storeSegmentationCommand
    },
    downloadRTSS: {
      commandFn: actions.downloadRTSSCommand
    },
    setSegmentationStyle: {
      commandFn: actions.setSegmentationStyleCommand
    },
    deleteSegment: {
      commandFn: actions.deleteSegmentCommand
    },
    deleteSegmentation: {
      commandFn: actions.deleteSegmentationCommand
    },
    removeSegmentationFromViewport: {
      commandFn: actions.removeSegmentationFromViewportCommand
    },
    toggleRenderInactiveSegmentations: {
      commandFn: actions.toggleRenderInactiveSegmentationsCommand
    },
    setFillAlpha: {
      commandFn: actions.setFillAlphaCommand
    },
    setOutlineWidth: {
      commandFn: actions.setOutlineWidthCommand
    },
    setRenderFill: {
      commandFn: actions.setRenderFillCommand
    },
    setRenderOutline: {
      commandFn: actions.setRenderOutlineCommand
    },
    setFillAlphaInactive: {
      commandFn: actions.setFillAlphaInactiveCommand
    },
    editSegmentLabel: {
      commandFn: actions.editSegmentLabel
    },
    editSegmentationLabel: {
      commandFn: actions.editSegmentationLabel
    },
    editSegmentColor: {
      commandFn: actions.editSegmentColor
    },
    getRenderInactiveSegmentations: {
      commandFn: actions.getRenderInactiveSegmentations
    },
    deleteActiveAnnotation: {
      commandFn: actions.deleteActiveAnnotation
    },
    setDisplaySetsForViewports: actions.setDisplaySetsForViewports,
    undo: actions.undo,
    redo: actions.redo,
    interpolateLabelmap: actions.interpolateLabelmap,
    runSegmentBidirectional: actions.runSegmentBidirectional,
    downloadCSVSegmentationReport: actions.downloadCSVSegmentationReport,
    toggleSegmentPreviewEdit: actions.toggleSegmentPreviewEdit,
    toggleSegmentSelect: actions.toggleSegmentSelect,
    acceptPreview: actions.acceptPreview,
    rejectPreview: actions.rejectPreview,
    toggleUseCenterSegmentIndex: actions.toggleUseCenterSegmentIndex,
    toggleLabelmapAssist: actions.toggleLabelmapAssist,
    interpolateScrollForMarkerLabelmap: actions.interpolateScrollForMarkerLabelmap,
    clearMarkersForMarkerLabelmap: actions.clearMarkersForMarkerLabelmap,
    setBrushSize: actions.setBrushSize,
    setThresholdRange: actions.setThresholdRange,
    increaseBrushSize: actions.increaseBrushSize,
    decreaseBrushSize: actions.decreaseBrushSize,
    addNewSegment: actions.addNewSegment,
    loadSegmentationDisplaySetsForViewport: actions.loadSegmentationDisplaySetsForViewport,
    setViewportOrientation: actions.setViewportOrientation,
    hydrateSecondaryDisplaySet: actions.hydrateSecondaryDisplaySet,
    getVolumeIdForDisplaySet: actions.getVolumeIdForDisplaySet,
    triggerCreateAnnotationMemo: actions.triggerCreateAnnotationMemo,
    startRecordingForAnnotationGroup: actions.startRecordingForAnnotationGroup,
    endRecordingForAnnotationGroup: actions.endRecordingForAnnotationGroup,
    toggleSegmentLabel: actions.toggleSegmentLabel,
    jumpToMeasurementViewport: actions.jumpToMeasurementViewport,
    initializeSegmentLabelTool: actions.initializeSegmentLabelTool
  };
  return {
    actions,
    definitions,
    defaultContext: 'CORNERSTONE'
  };
}
/* harmony default export */ const src_commandsModule = (commandsModule);
;// ../../../extensions/cornerstone/src/hps/mpr.ts
const VOI_SYNC_GROUP = {
  type: 'voi',
  id: 'mpr',
  source: true,
  target: true,
  options: {
    syncColormap: true
  }
};
const HYDRATE_SEG_SYNC_GROUP = {
  type: 'hydrateseg',
  id: 'sameFORId',
  source: true,
  target: true,
  options: {
    matchingRules: ['sameFOR']
  }
};
const mpr = {
  id: 'mpr',
  name: 'MPR',
  locked: true,
  icon: 'layout-advanced-mpr',
  isPreset: true,
  createdDate: '2021-02-23',
  modifiedDate: '2023-08-15',
  availableTo: {},
  editableBy: {},
  numberOfPriorsReferenced: 0,
  protocolMatchingRules: [],
  imageLoadStrategy: 'nth',
  callbacks: {},
  displaySetSelectors: {
    activeDisplaySet: {
      seriesMatchingRules: [{
        weight: 1,
        attribute: 'isReconstructable',
        constraint: {
          equals: {
            value: true
          }
        },
        required: true
      }]
    }
  },
  stages: [{
    name: 'MPR 1x3',
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 1,
        columns: 3,
        layoutOptions: [{
          x: 0,
          y: 0,
          width: 1 / 3,
          height: 1
        }, {
          x: 1 / 3,
          y: 0,
          width: 1 / 3,
          height: 1
        }, {
          x: 2 / 3,
          y: 0,
          width: 1 / 3,
          height: 1
        }]
      }
    },
    viewports: [{
      viewportOptions: {
        viewportId: 'mpr-axial',
        toolGroupId: 'mpr',
        viewportType: 'volume',
        orientation: 'axial',
        initialImageOptions: {
          preset: 'middle'
        },
        syncGroups: [VOI_SYNC_GROUP, HYDRATE_SEG_SYNC_GROUP]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        viewportId: 'mpr-sagittal',
        toolGroupId: 'mpr',
        viewportType: 'volume',
        orientation: 'sagittal',
        initialImageOptions: {
          preset: 'middle'
        },
        syncGroups: [VOI_SYNC_GROUP, HYDRATE_SEG_SYNC_GROUP]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        viewportId: 'mpr-coronal',
        toolGroupId: 'mpr',
        viewportType: 'volume',
        orientation: 'coronal',
        initialImageOptions: {
          preset: 'middle'
        },
        syncGroups: [VOI_SYNC_GROUP, HYDRATE_SEG_SYNC_GROUP]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }]
  }]
};
;// ../../../extensions/cornerstone/src/hps/fourUp.ts

const fourUp = {
  id: 'fourUp',
  locked: true,
  name: '3D four up',
  icon: 'layout-advanced-3d-four-up',
  isPreset: true,
  createdDate: '2023-03-15T10:29:44.894Z',
  modifiedDate: '2023-03-15T10:29:44.894Z',
  availableTo: {},
  editableBy: {},
  protocolMatchingRules: [],
  imageLoadStrategy: 'interleaveCenter',
  displaySetSelectors: {
    activeDisplaySet: {
      seriesMatchingRules: [{
        weight: 1,
        attribute: 'isReconstructable',
        constraint: {
          equals: {
            value: true
          }
        },
        required: true
      }]
    }
  },
  stages: [{
    id: 'fourUpStage',
    name: 'fourUp',
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 2,
        columns: 2
      }
    },
    viewports: [{
      viewportOptions: {
        toolGroupId: 'mpr',
        viewportType: 'volume',
        orientation: 'axial',
        initialImageOptions: {
          preset: 'middle'
        },
        syncGroups: [VOI_SYNC_GROUP, HYDRATE_SEG_SYNC_GROUP]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'volume3d',
        viewportType: 'volume3d',
        orientation: 'coronal',
        customViewportProps: {
          hideOverlays: true
        },
        syncGroups: [HYDRATE_SEG_SYNC_GROUP]
      },
      displaySets: [{
        id: 'activeDisplaySet',
        options: {
          displayPreset: {
            CT: 'CT-Bone',
            MR: 'MR-Default',
            default: 'CT-Bone'
          }
        }
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'mpr',
        viewportType: 'volume',
        orientation: 'coronal',
        initialImageOptions: {
          preset: 'middle'
        },
        syncGroups: [VOI_SYNC_GROUP, HYDRATE_SEG_SYNC_GROUP]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'mpr',
        viewportType: 'volume',
        orientation: 'sagittal',
        initialImageOptions: {
          preset: 'middle'
        },
        syncGroups: [VOI_SYNC_GROUP, HYDRATE_SEG_SYNC_GROUP]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }]
  }]
};
;// ../../../extensions/cornerstone/src/hps/main3D.ts

const main3D = {
  id: 'main3D',
  locked: true,
  name: '3D main',
  icon: 'layout-advanced-3d-main',
  isPreset: true,
  createdDate: '2023-03-15T10:29:44.894Z',
  modifiedDate: '2023-03-15T10:29:44.894Z',
  availableTo: {},
  editableBy: {},
  protocolMatchingRules: [],
  imageLoadStrategy: 'interleaveCenter',
  displaySetSelectors: {
    activeDisplaySet: {
      seriesMatchingRules: [{
        weight: 1,
        attribute: 'isReconstructable',
        constraint: {
          equals: {
            value: true
          }
        },
        required: true
      }]
    }
  },
  stages: [{
    id: 'main3DStage',
    name: 'main3D',
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 2,
        columns: 3,
        layoutOptions: [{
          x: 0,
          y: 0,
          width: 1,
          height: 1 / 2
        }, {
          x: 0,
          y: 1 / 2,
          width: 1 / 3,
          height: 1 / 2
        }, {
          x: 1 / 3,
          y: 1 / 2,
          width: 1 / 3,
          height: 1 / 2
        }, {
          x: 2 / 3,
          y: 1 / 2,
          width: 1 / 3,
          height: 1 / 2
        }]
      }
    },
    viewports: [{
      viewportOptions: {
        toolGroupId: 'volume3d',
        viewportType: 'volume3d',
        orientation: 'coronal',
        customViewportProps: {
          hideOverlays: true
        }
      },
      displaySets: [{
        id: 'activeDisplaySet',
        options: {
          displayPreset: {
            CT: 'CT-Bone',
            MR: 'MR-Default',
            default: 'CT-Bone'
          }
        }
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'mpr',
        viewportType: 'volume',
        orientation: 'axial',
        initialImageOptions: {
          preset: 'middle'
        },
        syncGroups: [VOI_SYNC_GROUP, HYDRATE_SEG_SYNC_GROUP]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'mpr',
        viewportType: 'volume',
        orientation: 'coronal',
        initialImageOptions: {
          preset: 'middle'
        },
        syncGroups: [VOI_SYNC_GROUP, HYDRATE_SEG_SYNC_GROUP]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'mpr',
        viewportType: 'volume',
        orientation: 'sagittal',
        initialImageOptions: {
          preset: 'middle'
        },
        syncGroups: [VOI_SYNC_GROUP, HYDRATE_SEG_SYNC_GROUP]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }]
  }]
};
;// ../../../extensions/cornerstone/src/hps/mprAnd3DVolumeViewport.ts

const mprAnd3DVolumeViewport = {
  id: 'mprAnd3DVolumeViewport',
  locked: true,
  name: 'mpr',
  createdDate: '2023-03-15T10:29:44.894Z',
  modifiedDate: '2023-03-15T10:29:44.894Z',
  availableTo: {},
  editableBy: {},
  protocolMatchingRules: [],
  imageLoadStrategy: 'interleaveCenter',
  displaySetSelectors: {
    activeDisplaySet: {
      seriesMatchingRules: [{
        weight: 1,
        attribute: 'isReconstructable',
        constraint: {
          equals: {
            value: true
          }
        },
        required: true
      }, {
        attribute: 'Modality',
        constraint: {
          equals: {
            value: 'CT'
          }
        },
        required: true
      }]
    }
  },
  stages: [{
    id: 'mpr3Stage',
    name: 'mpr',
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 2,
        columns: 2
      }
    },
    viewports: [{
      viewportOptions: {
        toolGroupId: 'mpr',
        viewportType: 'volume',
        orientation: 'axial',
        initialImageOptions: {
          preset: 'middle'
        },
        syncGroups: [VOI_SYNC_GROUP, HYDRATE_SEG_SYNC_GROUP]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'volume3d',
        viewportType: 'volume3d',
        orientation: 'coronal',
        customViewportProps: {
          hideOverlays: true
        },
        syncGroups: [HYDRATE_SEG_SYNC_GROUP]
      },
      displaySets: [{
        id: 'activeDisplaySet',
        options: {
          displayPreset: {
            CT: 'CT-Bone',
            MR: 'MR-Default',
            default: 'CT-Bone'
          }
        }
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'mpr',
        viewportType: 'volume',
        orientation: 'coronal',
        initialImageOptions: {
          preset: 'middle'
        },
        syncGroups: [VOI_SYNC_GROUP, HYDRATE_SEG_SYNC_GROUP]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'mpr',
        viewportType: 'volume',
        orientation: 'sagittal',
        initialImageOptions: {
          preset: 'middle'
        },
        syncGroups: [VOI_SYNC_GROUP, HYDRATE_SEG_SYNC_GROUP]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }]
  }]
};
;// ../../../extensions/cornerstone/src/hps/only3D.ts

const only3D = {
  id: 'only3D',
  locked: true,
  name: '3D only',
  icon: 'layout-advanced-3d-only',
  isPreset: true,
  createdDate: '2023-03-15T10:29:44.894Z',
  modifiedDate: '2023-03-15T10:29:44.894Z',
  availableTo: {},
  editableBy: {},
  protocolMatchingRules: [],
  imageLoadStrategy: 'interleaveCenter',
  displaySetSelectors: {
    activeDisplaySet: {
      seriesMatchingRules: [{
        weight: 1,
        attribute: 'isReconstructable',
        constraint: {
          equals: {
            value: true
          }
        },
        required: true
      }]
    }
  },
  stages: [{
    id: 'only3DStage',
    name: 'only3D',
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 1,
        columns: 1
      }
    },
    viewports: [{
      viewportOptions: {
        toolGroupId: 'volume3d',
        viewportType: 'volume3d',
        orientation: 'coronal',
        customViewportProps: {
          hideOverlays: true,
          syncGroups: [HYDRATE_SEG_SYNC_GROUP]
        }
      },
      displaySets: [{
        id: 'activeDisplaySet',
        options: {
          displayPreset: {
            CT: 'CT-Bone',
            MR: 'MR-Default',
            default: 'CT-Bone'
          }
        }
      }]
    }]
  }]
};
;// ../../../extensions/cornerstone/src/hps/primary3D.ts

const primary3D = {
  id: 'primary3D',
  locked: true,
  name: '3D primary',
  icon: 'layout-advanced-3d-primary',
  isPreset: true,
  createdDate: '2023-03-15T10:29:44.894Z',
  modifiedDate: '2023-03-15T10:29:44.894Z',
  availableTo: {},
  editableBy: {},
  protocolMatchingRules: [],
  imageLoadStrategy: 'interleaveCenter',
  displaySetSelectors: {
    activeDisplaySet: {
      seriesMatchingRules: [{
        weight: 1,
        attribute: 'isReconstructable',
        constraint: {
          equals: {
            value: true
          }
        },
        required: true
      }]
    }
  },
  stages: [{
    id: 'primary3DStage',
    name: 'primary3D',
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 3,
        columns: 3,
        layoutOptions: [{
          x: 0,
          y: 0,
          width: 2 / 3,
          height: 1
        }, {
          x: 2 / 3,
          y: 0,
          width: 1 / 3,
          height: 1 / 3
        }, {
          x: 2 / 3,
          y: 1 / 3,
          width: 1 / 3,
          height: 1 / 3
        }, {
          x: 2 / 3,
          y: 2 / 3,
          width: 1 / 3,
          height: 1 / 3
        }]
      }
    },
    viewports: [{
      viewportOptions: {
        toolGroupId: 'volume3d',
        viewportType: 'volume3d',
        orientation: 'coronal',
        customViewportProps: {
          hideOverlays: true
        }
      },
      displaySets: [{
        id: 'activeDisplaySet',
        options: {
          displayPreset: {
            CT: 'CT-Bone',
            MR: 'MR-Default',
            default: 'CT-Bone'
          }
        }
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'mpr',
        viewportType: 'volume',
        orientation: 'axial',
        initialImageOptions: {
          preset: 'middle'
        },
        syncGroups: [VOI_SYNC_GROUP, HYDRATE_SEG_SYNC_GROUP]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'mpr',
        viewportType: 'volume',
        orientation: 'coronal',
        initialImageOptions: {
          preset: 'middle'
        },
        syncGroups: [VOI_SYNC_GROUP, HYDRATE_SEG_SYNC_GROUP]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'mpr',
        viewportType: 'volume',
        orientation: 'sagittal',
        initialImageOptions: {
          preset: 'middle'
        },
        syncGroups: [VOI_SYNC_GROUP, HYDRATE_SEG_SYNC_GROUP]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }]
  }]
};
;// ../../../extensions/cornerstone/src/hps/primaryAxial.ts

const primaryAxial = {
  id: 'primaryAxial',
  locked: true,
  name: 'Axial Primary',
  icon: 'layout-advanced-axial-primary',
  isPreset: true,
  createdDate: '2023-03-15T10:29:44.894Z',
  modifiedDate: '2023-03-15T10:29:44.894Z',
  availableTo: {},
  editableBy: {},
  protocolMatchingRules: [],
  imageLoadStrategy: 'interleaveCenter',
  displaySetSelectors: {
    activeDisplaySet: {
      seriesMatchingRules: [{
        weight: 1,
        attribute: 'isReconstructable',
        constraint: {
          equals: {
            value: true
          }
        },
        required: true
      }]
    }
  },
  stages: [{
    id: 'primaryAxialStage',
    name: 'primaryAxial',
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 2,
        columns: 3,
        layoutOptions: [{
          x: 0,
          y: 0,
          width: 2 / 3,
          height: 1
        }, {
          x: 2 / 3,
          y: 0,
          width: 1 / 3,
          height: 1 / 2
        }, {
          x: 2 / 3,
          y: 1 / 2,
          width: 1 / 3,
          height: 1 / 2
        }]
      }
    },
    viewports: [{
      viewportOptions: {
        toolGroupId: 'mpr',
        viewportType: 'volume',
        orientation: 'axial',
        initialImageOptions: {
          preset: 'middle'
        },
        syncGroups: [VOI_SYNC_GROUP, HYDRATE_SEG_SYNC_GROUP]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'mpr',
        viewportType: 'volume',
        orientation: 'sagittal',
        initialImageOptions: {
          preset: 'middle'
        },
        syncGroups: [VOI_SYNC_GROUP, HYDRATE_SEG_SYNC_GROUP]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'mpr',
        viewportType: 'volume',
        orientation: 'coronal',
        initialImageOptions: {
          preset: 'middle'
        },
        syncGroups: [VOI_SYNC_GROUP, HYDRATE_SEG_SYNC_GROUP]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }]
  }]
};
;// ../../../extensions/cornerstone/src/hps/frameView.ts
const frameView = {
  id: '@ohif/frameView',
  description: 'Frame view for the active series',
  name: 'Frame View',
  icon: 'tool-stack-scroll',
  isPreset: true,
  toolGroupIds: ['default'],
  protocolMatchingRules: [],
  displaySetSelectors: {
    activeDisplaySet: {
      seriesMatchingRules: [{
        attribute: 'numImageFrames',
        constraint: {
          greaterThan: {
            value: 16
          }
        },
        required: true
      }, {
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
      allowUnmatchedView: true
    },
    displaySets: [{
      id: 'activeDisplaySet'
    }]
  },
  stages: [{
    name: 'frameView',
    id: '4x4',
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 4,
        columns: 4
      }
    },
    viewports: [{
      viewportOptions: {
        viewportId: 'custom_R0_C0',
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 0
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        viewportId: 'custom_R0_C1',
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 1
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        viewportId: 'custom_R0_C2',
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 2
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        viewportId: 'custom_R0_C3',
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 3
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        viewportId: 'custom_R1_C0',
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 4
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        viewportId: 'custom_R1_C1',
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 5
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        viewportId: 'custom_R1_C2',
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 6
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        viewportId: 'custom_R1_C3',
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 7
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        viewportId: 'custom_R2_C0',
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 8
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        viewportId: 'custom_R2_C1',
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 9
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        viewportId: 'custom_R2_C2',
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 10
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        viewportId: 'custom_R2_C3',
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 11
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        viewportId: 'custom_R3_C0',
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 12
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        viewportId: 'custom_R3_C1',
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 13
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        viewportId: 'custom_R3_C2',
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 14
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        viewportId: 'custom_R3_C3',
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 15
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }]
  }, {
    name: 'frameView',
    id: '3x3',
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 3,
        columns: 3
      }
    },
    viewports: [{
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 0
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 1
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 2
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 3
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 4
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 5
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 6
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 7
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 8
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }]
  }, {
    name: 'frameView',
    id: '3x2',
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 2,
        columns: 3
      }
    },
    viewports: [{
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 0
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 1
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 2
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 3
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 4
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 5
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }]
  }, {
    name: 'frameView',
    id: '2x2',
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 2,
        columns: 2
      }
    },
    viewports: [{
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 0
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 1
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 2
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 3
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }]
  }, {
    name: 'frameView',
    id: '1x3',
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 1,
        columns: 3
      }
    },
    viewports: [{
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 0
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 1
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 2
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }]
  }, {
    name: 'frameView',
    id: '1x2',
    viewportStructure: {
      layoutType: 'grid',
      properties: {
        rows: 1,
        columns: 2
      }
    },
    viewports: [{
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 0
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }, {
      viewportOptions: {
        toolGroupId: 'default',
        syncGroups: [{
          type: 'zoompan',
          id: 'zoompansync',
          source: true,
          target: true
        }, {
          type: 'voi',
          id: 'wlsync',
          source: true,
          target: true,
          options: {
            syncColormap: true
          }
        }, {
          type: 'frameview',
          id: 'frameViewSync',
          source: true,
          target: true,
          options: {
            viewportIndex: 1
          }
        }]
      },
      displaySets: [{
        id: 'activeDisplaySet'
      }]
    }]
  }]
};

;// ../../../extensions/cornerstone/src/getHangingProtocolModule.ts








function getHangingProtocolModule() {
  return [{
    name: mpr.id,
    protocol: mpr
  }, {
    name: mprAnd3DVolumeViewport.id,
    protocol: mprAnd3DVolumeViewport
  }, {
    name: fourUp.id,
    protocol: fourUp
  }, {
    name: main3D.id,
    protocol: main3D
  }, {
    name: primaryAxial.id,
    protocol: primaryAxial
  }, {
    name: only3D.id,
    protocol: only3D
  }, {
    name: primary3D.id,
    protocol: primary3D
  }, {
    name: frameView.id,
    protocol: frameView
  }];
}
/* harmony default export */ const src_getHangingProtocolModule = (getHangingProtocolModule);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/hooks/useViewportDisplaySets.ts + 1 modules
var useViewportDisplaySets = __webpack_require__(10225);
;// ../../../extensions/cornerstone/src/components/SelectItemWithModality.tsx


// should be used in a Select component
const SelectItemWithModality = ({
  displaySet,
  showModality = true,
  dataCY = `${displaySet.label}-${displaySet.Modality}`
}) => /*#__PURE__*/react.createElement("div", {
  className: "flex w-[90%] items-center justify-between",
  "data-cy": dataCY
}, /*#__PURE__*/react.createElement("span", {
  className: "text-foreground truncate text-base"
}, displaySet.label), showModality && displaySet.Modality && /*#__PURE__*/react.createElement("span", {
  className: "text-muted-foreground flex-shrink-0 whitespace-nowrap text-xs"
}, displaySet.Modality));
/* harmony default export */ const components_SelectItemWithModality = (SelectItemWithModality);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/hooks/index.ts + 1 modules
var hooks = __webpack_require__(38007);
;// ../../../extensions/cornerstone/src/components/ViewportDataOverlaySettingMenu/ViewportDataOverlayMenu.tsx






function ViewportDataOverlayMenu({
  viewportId
}) {
  const {
    commandsManager,
    servicesManager
  } = (0,src.useSystem)();
  const [pendingForegrounds, setPendingForegrounds] = (0,react.useState)([]);
  const [pendingSegmentations, setPendingSegmentations] = (0,react.useState)([]);
  const {
    toggleColorbar
  } = (0,hooks/* useViewportRendering */.eH)(viewportId);
  const {
    hangingProtocolService,
    toolbarService
  } = servicesManager.services;
  const {
    backgroundDisplaySet,
    potentialOverlayDisplaySets,
    potentialForegroundDisplaySets,
    potentialBackgroundDisplaySets,
    overlayDisplaySets,
    foregroundDisplaySets
  } = (0,useViewportDisplaySets/* useViewportDisplaySets */.N)(viewportId);
  const [optimisticOverlayDisplaySets, setOptimisticOverlayDisplaySets] = (0,react.useState)(overlayDisplaySets);
  const [thresholdOpacityEnabled, setThresholdOpacityEnabled] = (0,react.useState)(false);

  /**
   * Change the background display set
   */
  const handleBackgroundSelection = newBackgroundDisplaySet => {
    const updatedViewports = hangingProtocolService.getViewportsRequireUpdate(viewportId, newBackgroundDisplaySet.displaySetInstanceUID);
    commandsManager.run('setDisplaySetsForViewports', {
      viewportsToUpdate: updatedViewports
    });
  };

  /**
   * Replace a display set layer with a new one
   */
  const handleReplaceDisplaySetLayer = (currentDisplaySetInstanceUID, newDisplaySetInstanceUID) => {
    // Remove current display set
    commandsManager.runCommand('removeDisplaySetLayer', {
      viewportId,
      displaySetInstanceUID: currentDisplaySetInstanceUID
    });
    setTimeout(() => {
      commandsManager.runCommand('addDisplaySetAsLayer', {
        viewportId,
        displaySetInstanceUID: newDisplaySetInstanceUID
      });
    }, 0);
  };

  /**
   * Remove a display set layer
   */
  const handleRemoveDisplaySetLayer = displaySetInstanceUID => {
    const optimisticOverlayDisplaySetsIndex = optimisticOverlayDisplaySets.findIndex(displaySet => displaySet.displaySetInstanceUID === displaySetInstanceUID);
    if (optimisticOverlayDisplaySetsIndex !== -1) {
      setOptimisticOverlayDisplaySets(prevOptimisticOverlayDisplaySets => {
        return prevOptimisticOverlayDisplaySets.filter(displaySet => displaySet.displaySetInstanceUID !== displaySetInstanceUID);
      });
    }
    commandsManager.runCommand('removeDisplaySetLayer', {
      viewportId,
      displaySetInstanceUID
    });
  };

  /**
   * Add a display set as a layer
   */
  const handleAddDisplaySetAsLayer = displaySetInstanceUID => {
    commandsManager.runCommand('addDisplaySetAsLayer', {
      viewportId,
      displaySetInstanceUID
    });
  };

  /**
   * Handle overlay display set selection change
   */
  const handleOverlaySelectionChange = (currentDisplaySet, newDisplaySetInstanceUID) => {
    if (newDisplaySetInstanceUID === currentDisplaySet.displaySetInstanceUID) {
      return;
    }

    // Find the selected display set
    const selectedDisplaySet = potentialOverlayDisplaySets.find(ds => ds.displaySetInstanceUID === newDisplaySetInstanceUID);
    if (selectedDisplaySet) {
      setOptimisticOverlayDisplaySets(prevOptimisticOverlayDisplaySets => {
        const currentDisplaySetIndex = prevOptimisticOverlayDisplaySets.findIndex(displaySet => displaySet.displaySetInstanceUID === currentDisplaySet.displaySetInstanceUID);
        return [...prevOptimisticOverlayDisplaySets.slice(0, currentDisplaySetIndex), selectedDisplaySet, ...prevOptimisticOverlayDisplaySets.slice(currentDisplaySetIndex + 1)];
      });
      handleReplaceDisplaySetLayer(currentDisplaySet.displaySetInstanceUID, selectedDisplaySet.displaySetInstanceUID);
    }
  };

  /**
   * Handle foreground display set selection change
   */
  const handleForegroundSelectionChange = (currentDisplaySet, newDisplaySetInstanceUID) => {
    if (newDisplaySetInstanceUID === currentDisplaySet.displaySetInstanceUID) {
      return;
    }

    // Find the selected display set
    const selectedDisplaySet = potentialForegroundDisplaySets.find(ds => ds.displaySetInstanceUID === newDisplaySetInstanceUID);
    if (selectedDisplaySet) {
      handleReplaceDisplaySetLayer(currentDisplaySet.displaySetInstanceUID, selectedDisplaySet.displaySetInstanceUID);
    }
  };

  /**
   * Handle pending segmentation selection
   */
  const handlePendingSegmentationSelection = (pendingId, displaySetInstanceUID) => {
    const selectedDisplaySet = potentialOverlayDisplaySets.find(ds => ds.displaySetInstanceUID === displaySetInstanceUID);
    if (selectedDisplaySet) {
      setOptimisticOverlayDisplaySets(prevOptimisticOverlayDisplaySets => [...prevOptimisticOverlayDisplaySets, selectedDisplaySet]);
      handleAddDisplaySetAsLayer(selectedDisplaySet.displaySetInstanceUID);
      // Remove this pending segmentation from the list
      setPendingSegmentations(pendingSegmentations.filter(id => id !== pendingId));
    }
  };

  /**
   * Handle pending foreground selection
   */
  const handlePendingForegroundSelection = (pendingId, displaySetInstanceUID) => {
    const selectedDisplaySet = potentialForegroundDisplaySets.find(ds => ds.displaySetInstanceUID === displaySetInstanceUID);
    if (selectedDisplaySet) {
      handleAddDisplaySetAsLayer(selectedDisplaySet.displaySetInstanceUID);
      // Remove this pending foreground from the list
      setPendingForegrounds(pendingForegrounds.filter(id => id !== pendingId));
    }
  };

  // Check if the advanced window level components exist in toolbar
  const hasAdvancedRenderingControls = !!toolbarService.getButton('AdvancedRenderingControls');
  const hasOpacityMenu = !!toolbarService.getButton('opacityMenu');
  const handleThresholdOpacityToggle = () => {
    const newValue = !thresholdOpacityEnabled;
    if (hasAdvancedRenderingControls) {
      toggleColorbar();
    }
    setThresholdOpacityEnabled(newValue);
  };
  return /*#__PURE__*/react.createElement("div", {
    className: "bg-popover flex h-full w-[275px] flex-col rounded rounded-md p-1.5",
    "data-cy": `viewport-data-overlay-menu-${viewportId}`
  }, /*#__PURE__*/react.createElement("div", {
    className: `flex`
  }, /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    className: "text-primary flex items-center p-1",
    onClick: () => {
      // Add a new pending foreground slot with a unique ID
      setPendingForegrounds([...pendingForegrounds, `pending-${Date.now()}`]);
    },
    disabled: potentialForegroundDisplaySets.length === 0
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Plus, {
    className: "h-4 w-4"
  }), "Foreground"), /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    className: "text-primary ml-2 flex items-center",
    disabled: potentialOverlayDisplaySets.length === 0,
    onClick: () => {
      setPendingSegmentations([...pendingSegmentations, `seg-${Date.now()}`]);
    },
    dataCY: `AddSegmentationDataOverlay-${viewportId}`
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Plus, {
    className: "h-4 w-4"
  }), "Segmentation")), /*#__PURE__*/react.createElement("div", {
    className: ""
  }, /*#__PURE__*/react.createElement("div", {
    className: "my-2 ml-1"
  }, optimisticOverlayDisplaySets.map(displaySet => /*#__PURE__*/react.createElement("div", {
    key: displaySet.displaySetInstanceUID,
    className: "mb-1 flex items-center"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.LayerSegmentation, {
    className: "text-muted-foreground mr-1 h-6 w-6 flex-shrink-0"
  }), /*#__PURE__*/react.createElement(ui_next_src/* Select */.l6P, {
    value: displaySet.displaySetInstanceUID,
    onValueChange: value => handleOverlaySelectionChange(displaySet, value)
  }, /*#__PURE__*/react.createElement(ui_next_src/* SelectTrigger */.bqE, {
    className: "flex-1"
  }, /*#__PURE__*/react.createElement(ui_next_src/* SelectValue */.yvm, {
    "data-cy": `overlay-ds-select-value-${displaySet.label?.toUpperCase()}`
  }, displaySet.label?.toUpperCase())), /*#__PURE__*/react.createElement(ui_next_src/* SelectContent */.gCo, null, /*#__PURE__*/react.createElement(ui_next_src/* SelectItem */.ebT, {
    key: displaySet.displaySetInstanceUID,
    value: displaySet.displaySetInstanceUID,
    className: "pr-2"
  }, /*#__PURE__*/react.createElement(components_SelectItemWithModality, {
    displaySet: displaySet
  })), potentialOverlayDisplaySets.map(item => /*#__PURE__*/react.createElement(ui_next_src/* SelectItem */.ebT, {
    key: item.displaySetInstanceUID,
    value: item.displaySetInstanceUID,
    className: "pr-2"
  }, /*#__PURE__*/react.createElement(components_SelectItemWithModality, {
    displaySet: item
  }))))), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenu */.rId, null, /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuTrigger */.tyb, {
    asChild: true
  }, /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    size: "icon",
    className: "ml-2 flex-shrink-0",
    dataCY: `overlay-ds-more-button-${displaySet.label?.toUpperCase()}`
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.More, {
    className: "h-4 w-4"
  }))), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuContent */.SQm, {
    align: "start"
  }, /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuItem */._26, {
    "data-cy": `overlay-ds-remove-button-${displaySet.label?.toUpperCase()}`,
    onClick: () => handleRemoveDisplaySetLayer(displaySet.displaySetInstanceUID)
  }, "Remove"))))), pendingSegmentations.map(pendingId => /*#__PURE__*/react.createElement("div", {
    key: pendingId,
    className: "mb-2 flex items-center"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.LayerSegmentation, {
    className: "text-muted-foreground mr-1 h-6 w-6 flex-shrink-0"
  }), /*#__PURE__*/react.createElement(ui_next_src/* Select */.l6P, {
    value: "",
    onValueChange: value => handlePendingSegmentationSelection(pendingId, value)
  }, /*#__PURE__*/react.createElement(ui_next_src/* SelectTrigger */.bqE, {
    className: "flex-1"
  }, /*#__PURE__*/react.createElement(ui_next_src/* SelectValue */.yvm, {
    placeholder: "SELECT A SEGMENTATION"
  })), /*#__PURE__*/react.createElement(ui_next_src/* SelectContent */.gCo, null, potentialOverlayDisplaySets.map(item => /*#__PURE__*/react.createElement(ui_next_src/* SelectItem */.ebT, {
    key: item.displaySetInstanceUID,
    value: item.displaySetInstanceUID,
    className: "pr-2"
  }, /*#__PURE__*/react.createElement(components_SelectItemWithModality, {
    displaySet: item,
    dataCY: `${item.label}`
  }))))), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenu */.rId, null, /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuTrigger */.tyb, {
    asChild: true
  }, /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    size: "icon",
    className: "ml-2 flex-shrink-0"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.More, {
    className: "h-4 w-4"
  }))), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuContent */.SQm, {
    align: "start"
  }, /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuItem */._26, {
    onClick: () => {
      // Remove this pending segmentation
      setPendingSegmentations(pendingSegmentations.filter(id => id !== pendingId));
    }
  }, "Cancel")))))), /*#__PURE__*/react.createElement("div", {
    className: "my-2 px-1"
  }, foregroundDisplaySets.map((displaySet, index) => /*#__PURE__*/react.createElement("div", {
    key: displaySet.displaySetInstanceUID,
    className: "mb-1 flex items-center"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.LayerForeground, {
    className: "text-muted-foreground mr-1 h-6 w-6 flex-shrink-0"
  }), /*#__PURE__*/react.createElement(ui_next_src/* Select */.l6P, {
    value: displaySet.displaySetInstanceUID,
    onValueChange: value => handleForegroundSelectionChange(displaySet, value)
  }, /*#__PURE__*/react.createElement(ui_next_src/* SelectTrigger */.bqE, {
    className: "flex-1"
  }, /*#__PURE__*/react.createElement(ui_next_src/* SelectValue */.yvm, null, displaySet.label?.toUpperCase())), /*#__PURE__*/react.createElement(ui_next_src/* SelectContent */.gCo, null, /*#__PURE__*/react.createElement(ui_next_src/* SelectItem */.ebT, {
    key: displaySet.displaySetInstanceUID,
    value: displaySet.displaySetInstanceUID,
    className: "pr-2"
  }, /*#__PURE__*/react.createElement(components_SelectItemWithModality, {
    displaySet: displaySet
  })), potentialForegroundDisplaySets.map(item => /*#__PURE__*/react.createElement(ui_next_src/* SelectItem */.ebT, {
    key: item.displaySetInstanceUID,
    value: item.displaySetInstanceUID,
    className: "pr-2"
  }, /*#__PURE__*/react.createElement(components_SelectItemWithModality, {
    displaySet: item
  }))))), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenu */.rId, null, /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuTrigger */.tyb, {
    asChild: true
  }, /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    size: "icon",
    className: "ml-2 flex-shrink-0"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.More, {
    className: "h-4 w-4"
  }))), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuContent */.SQm, {
    align: "start"
  }, /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuItem */._26, {
    onClick: () => handleRemoveDisplaySetLayer(displaySet.displaySetInstanceUID)
  }, "Remove"))))), pendingForegrounds.map(pendingId => /*#__PURE__*/react.createElement("div", {
    key: pendingId,
    className: "mb-2 flex items-center"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.LayerForeground, {
    className: "text-muted-foreground mr-1 h-6 w-6 flex-shrink-0"
  }), /*#__PURE__*/react.createElement(ui_next_src/* Select */.l6P, {
    value: "",
    onValueChange: value => handlePendingForegroundSelection(pendingId, value)
  }, /*#__PURE__*/react.createElement(ui_next_src/* SelectTrigger */.bqE, {
    className: "flex-1"
  }, /*#__PURE__*/react.createElement(ui_next_src/* SelectValue */.yvm, {
    placeholder: "SELECT A FOREGROUND"
  })), /*#__PURE__*/react.createElement(ui_next_src/* SelectContent */.gCo, null, potentialForegroundDisplaySets.map(item => /*#__PURE__*/react.createElement(ui_next_src/* SelectItem */.ebT, {
    key: item.displaySetInstanceUID,
    value: item.displaySetInstanceUID,
    className: "pr-2"
  }, /*#__PURE__*/react.createElement(components_SelectItemWithModality, {
    displaySet: item
  }))))), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenu */.rId, null, /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuTrigger */.tyb, {
    asChild: true
  }, /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    size: "icon",
    className: "ml-2 flex-shrink-0"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.More, {
    className: "h-4 w-4"
  }))), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuContent */.SQm, {
    align: "start"
  }, /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuItem */._26, {
    onClick: () => {
      // Remove this pending foreground
      setPendingForegrounds(pendingForegrounds.filter(id => id !== pendingId));
    }
  }, "Cancel")))))), /*#__PURE__*/react.createElement("div", {
    className: "mt-1 mb-1 flex items-center px-1"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.LayerBackground, {
    className: "text-muted-foreground mr-1 h-6 w-6 flex-shrink-0"
  }), /*#__PURE__*/react.createElement(ui_next_src/* Select */.l6P, {
    value: backgroundDisplaySet?.displaySetInstanceUID,
    onValueChange: value => {
      const selectedDisplaySet = potentialBackgroundDisplaySets.find(ds => ds.displaySetInstanceUID === value);
      if (selectedDisplaySet) {
        handleBackgroundSelection(selectedDisplaySet);
      }
    }
  }, /*#__PURE__*/react.createElement(ui_next_src/* SelectTrigger */.bqE, {
    className: "flex-1"
  }, /*#__PURE__*/react.createElement(ui_next_src/* SelectValue */.yvm, null, (backgroundDisplaySet?.SeriesDescription || backgroundDisplaySet?.label || 'background').toUpperCase())), /*#__PURE__*/react.createElement(ui_next_src/* SelectContent */.gCo, null, potentialBackgroundDisplaySets.map(displaySet => /*#__PURE__*/react.createElement(ui_next_src/* SelectItem */.ebT, {
    key: displaySet.displaySetInstanceUID,
    value: displaySet.displaySetInstanceUID,
    className: "pr-2"
  }, /*#__PURE__*/react.createElement(components_SelectItemWithModality, {
    displaySet: displaySet
  }))))))), foregroundDisplaySets.length > 0 && (hasAdvancedRenderingControls || hasOpacityMenu) && /*#__PURE__*/react.createElement("div", {
    className: "mt-1 ml-7"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Switch */.dOG, {
    id: "threshold-opacity-switch",
    className: "mr-2",
    checked: thresholdOpacityEnabled,
    onCheckedChange: handleThresholdOpacityToggle
  }), /*#__PURE__*/react.createElement("label", {
    htmlFor: "threshold-opacity-switch",
    className: "text-muted-foreground cursor-pointer text-sm",
    onClick: () => setThresholdOpacityEnabled(!thresholdOpacityEnabled)
  }, "Control threshold & opacity"))));
}
/* harmony default export */ const ViewportDataOverlaySettingMenu_ViewportDataOverlayMenu = (ViewportDataOverlayMenu);
;// ../../../extensions/cornerstone/src/components/ViewportDataOverlaySettingMenu/ViewportDataOverlayMenuWrapper.tsx
function ViewportDataOverlayMenuWrapper_extends() { return ViewportDataOverlayMenuWrapper_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, ViewportDataOverlayMenuWrapper_extends.apply(null, arguments); }





function ViewportDataOverlayMenuWrapper(props) {
  const {
    viewportId,
    location,
    isOpen = false,
    onOpen,
    onClose,
    disabled,
    ...rest
  } = props;
  const {
    viewportDisplaySets: displaySets
  } = (0,useViewportDisplaySets/* useViewportDisplaySets */.N)(viewportId);
  const {
    IconContainer,
    className: iconClassName,
    containerProps
  } = (0,ui_next_src/* useIconPresentation */.n1D)();
  const handleOpenChange = openState => {
    if (openState) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };
  const {
    servicesManager
  } = (0,src.useSystem)();
  const {
    toolbarService
  } = servicesManager.services;
  const {
    align,
    side
  } = toolbarService.getAlignAndSide(location);
  const Icon = /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ViewportViews, {
    className: iconClassName
  });
  const idProp = rest.id ? {
    id: `${rest.id}-${viewportId}`
  } : {};
  return /*#__PURE__*/react.createElement(ui_next_src/* Popover */.AMh, {
    open: isOpen,
    onOpenChange: handleOpenChange
  }, /*#__PURE__*/react.createElement(ui_next_src/* PopoverTrigger */.Wvm, {
    asChild: true,
    className: "flex items-center justify-center"
  }, /*#__PURE__*/react.createElement("div", null, IconContainer ? /*#__PURE__*/react.createElement(IconContainer, ViewportDataOverlayMenuWrapper_extends({
    disabled: disabled,
    icon: "ViewportViews"
  }, rest, containerProps, idProp), Icon) : /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    size: "icon",
    disabled: disabled
  }, Icon))), /*#__PURE__*/react.createElement(ui_next_src/* PopoverContent */.hlN, {
    className: "border-none bg-transparent p-0 shadow-none",
    side: side,
    align: align,
    alignOffset: 0,
    sideOffset: 5
  }, /*#__PURE__*/react.createElement(ViewportDataOverlaySettingMenu_ViewportDataOverlayMenu, {
    className: "w-full",
    viewportId: viewportId,
    displaySets: displaySets
  })));
}
;// ../../../extensions/cornerstone/src/components/ViewportOrientationMenu/ViewportOrientationMenu.tsx
function ViewportOrientationMenu_extends() { return ViewportOrientationMenu_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, ViewportOrientationMenu_extends.apply(null, arguments); }





function ViewportOrientationMenu({
  location,
  viewportId,
  displaySets,
  isOpen = false,
  onOpen,
  onClose,
  disabled,
  ...props
}) {
  const {
    servicesManager,
    commandsManager
  } = (0,src.useSystem)();
  const {
    cornerstoneViewportService,
    toolbarService
  } = servicesManager.services;
  const viewportInfo = cornerstoneViewportService.getViewportInfo(viewportId);
  const viewportOrientation = viewportInfo.getOrientation();
  const [gridState] = (0,ui_next_src/* useViewportGrid */.ihW)();
  const viewportIdToUse = viewportId || gridState.activeViewportId;
  const {
    IconContainer,
    className: iconClassName,
    containerProps
  } = (0,ui_next_src/* useIconPresentation */.n1D)();
  const [currentOrientation, setCurrentOrientation] = react.useState(typeof viewportOrientation === 'string' ? viewportOrientation : 'axial');
  const handleOrientationChange = orientation => {
    setCurrentOrientation(orientation);
    const viewportInfo = cornerstoneViewportService.getViewportInfo(viewportIdToUse);
    const currentViewportType = viewportInfo?.getViewportType();
    if (!displaySets.length) {
      return;
    }

    // Check if at least one displaySet is reconstructable
    const hasReconstructableDisplaySet = displaySets.some(ds => ds.isReconstructable);
    if (!hasReconstructableDisplaySet) {
      console.warn('Cannot change orientation: No reconstructable display sets in viewport');
      return;
    }

    // Set the orientation enum based on the selected orientation
    let orientationEnum;
    switch (orientation.toLowerCase()) {
      case 'axial':
        orientationEnum = esm.Enums.OrientationAxis.AXIAL;
        break;
      case 'sagittal':
        orientationEnum = esm.Enums.OrientationAxis.SAGITTAL;
        break;
      case 'coronal':
        orientationEnum = esm.Enums.OrientationAxis.CORONAL;
        break;
      case 'reformat':
        orientationEnum = esm.Enums.OrientationAxis.REFORMAT;
        break;
      default:
        orientationEnum = esm.Enums.OrientationAxis.ACQUISITION;
    }
    const displaySetUIDs = displaySets.map(ds => ds.displaySetInstanceUID);

    // If viewport is not already a volume type, we need to convert it
    if (currentViewportType !== esm.Enums.ViewportType.ORTHOGRAPHIC) {
      // Configure the viewport to be a volume viewport with current display sets
      const updatedViewport = {
        viewportId: viewportIdToUse,
        displaySetInstanceUIDs: displaySetUIDs,
        viewportOptions: {
          viewportType: esm.Enums.ViewportType.ORTHOGRAPHIC,
          orientation: orientationEnum
        },
        displaySetOptions: displaySetUIDs.map(() => ({}))
      };

      // Update the viewport to be a volume viewport
      commandsManager.run('setDisplaySetsForViewports', {
        viewportsToUpdate: [updatedViewport]
      });
    } else {
      // Set the viewport orientation
      commandsManager.runCommand('setViewportOrientation', {
        viewportId: viewportIdToUse,
        orientation: orientationEnum
      });
    }

    // Close the menu after selection
    onClose?.();
  };
  const handleOpenChange = openState => {
    if (openState) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };
  if (!displaySets.length) {
    return null;
  }

  // Get proper alignment and side based on the location using toolbar service
  const {
    align,
    side
  } = toolbarService.getAlignAndSide(Number(location));
  const Icon = /*#__PURE__*/react.createElement(getIcon(currentOrientation), {
    className: iconClassName
  });
  return /*#__PURE__*/react.createElement(ui_next_src/* Popover */.AMh, {
    open: isOpen,
    onOpenChange: handleOpenChange
  }, /*#__PURE__*/react.createElement(ui_next_src/* PopoverTrigger */.Wvm, {
    asChild: true,
    className: (0,ui_next_src.cn)('flex items-center justify-center')
  }, /*#__PURE__*/react.createElement("div", null, IconContainer ? /*#__PURE__*/react.createElement(IconContainer, ViewportOrientationMenu_extends({
    disabled: disabled,
    icon: "OrientationSwitch"
  }, props, containerProps), Icon) : /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    size: "icon",
    disabled: disabled,
    onClick: () => {}
  }, Icon))), /*#__PURE__*/react.createElement(ui_next_src/* PopoverContent */.hlN, {
    className: "h-[170px] w-[130px] flex-shrink-0 flex-col items-start rounded p-1",
    align: align,
    side: side,
    style: {
      left: 0
    }
  }, /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    className: "flex h-7 w-full flex-shrink-0 items-center justify-start self-stretch px-1 py-0",
    onClick: () => handleOrientationChange('axial')
  }, /*#__PURE__*/react.createElement("div", {
    className: "mr-1 flex w-6 items-center justify-start"
  }, currentOrientation === 'axial' ? /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Checked, {
    className: "text-primary h-6 w-6"
  }) : null), /*#__PURE__*/react.createElement("div", {
    className: "flex-1 text-left"
  }, "Axial")), /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    className: "flex h-7 w-full flex-shrink-0 items-center justify-start self-stretch px-1 py-0",
    onClick: () => handleOrientationChange('sagittal')
  }, /*#__PURE__*/react.createElement("div", {
    className: "mr-1 flex w-6 items-center justify-start"
  }, currentOrientation === 'sagittal' ? /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Checked, {
    className: "text-primary h-6 w-6"
  }) : null), /*#__PURE__*/react.createElement("div", {
    className: "flex-1 text-left"
  }, "Sagittal")), /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    className: "flex h-7 w-full flex-shrink-0 items-center justify-start self-stretch px-1 py-0",
    onClick: () => handleOrientationChange('coronal')
  }, /*#__PURE__*/react.createElement("div", {
    className: "mr-1 flex w-6 items-center justify-start"
  }, currentOrientation === 'coronal' ? /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Checked, {
    className: "text-primary h-6 w-6"
  }) : null), /*#__PURE__*/react.createElement("div", {
    className: "flex-1 text-left"
  }, "Coronal")), /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    className: "flex h-7 w-full flex-shrink-0 items-center justify-start self-stretch px-1 py-0",
    onClick: () => handleOrientationChange('acquisition')
  }, /*#__PURE__*/react.createElement("div", {
    className: "mr-1 flex w-6 items-center justify-start"
  }, currentOrientation === 'acquisition' ? /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Checked, {
    className: "text-primary h-6 w-6"
  }) : null), /*#__PURE__*/react.createElement("div", {
    className: "flex-1 text-left"
  }, "Acquisition")), /*#__PURE__*/react.createElement("div", {
    className: "mx-1 my-2 border-t border-white/20"
  }), /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    className: "flex h-7 w-full flex-shrink-0 items-center justify-start self-stretch px-1 py-0",
    onClick: () => handleOrientationChange('reformat')
  }, /*#__PURE__*/react.createElement("div", {
    className: "mr-1 flex w-6 items-center justify-start"
  }, currentOrientation === 'reformat' ? /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Checked, {
    className: "text-primary h-6 w-6"
  }) : null), /*#__PURE__*/react.createElement("div", {
    className: "flex-1 text-left"
  }, "Reformat"))));
}
const getIcon = orientationName => {
  switch (orientationName.toLowerCase()) {
    case 'axial':
      return ui_next_src/* Icons */.FI1.OrientationSwitchA;
    case 'sagittal':
      return ui_next_src/* Icons */.FI1.OrientationSwitchS;
    case 'coronal':
      return ui_next_src/* Icons */.FI1.OrientationSwitchC;
    case 'reformat':
      return ui_next_src/* Icons */.FI1.OrientationSwitchR;
    case 'acquisition':
      return ui_next_src/* Icons */.FI1.OrientationSwitch;
    default:
      return ui_next_src/* Icons */.FI1.OrientationSwitch;
  }
};
/* harmony default export */ const ViewportOrientationMenu_ViewportOrientationMenu = (ViewportOrientationMenu);
;// ../../../extensions/cornerstone/src/components/ViewportOrientationMenu/ViewportOrientationMenuWrapper.tsx
function ViewportOrientationMenuWrapper_extends() { return ViewportOrientationMenuWrapper_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, ViewportOrientationMenuWrapper_extends.apply(null, arguments); }



function ViewportOrientationMenuWrapper(props) {
  const {
    viewportId
  } = props;
  const {
    viewportDisplaySets
  } = (0,useViewportDisplaySets/* useViewportDisplaySets */.N)(viewportId);
  if (!viewportDisplaySets.length) {
    return null;
  }
  return /*#__PURE__*/react.createElement(ViewportOrientationMenu_ViewportOrientationMenu, ViewportOrientationMenuWrapper_extends({}, props, {
    displaySets: viewportDisplaySets
  }));
}
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/hooks/useViewportRendering.tsx
var useViewportRendering = __webpack_require__(47488);
;// ../../../extensions/cornerstone/src/components/WindowLevelActionMenu/Colormap.tsx



function Colormap({
  viewportId
} = {}) {
  const {
    viewportDisplaySets
  } = (0,useViewportRendering/* useViewportRendering */.e)(viewportId);
  const [activeDisplaySetUID, setActiveDisplaySetUID] = (0,react.useState)(viewportDisplaySets?.[0]?.displaySetInstanceUID);

  // Use the hook with the active display set
  const {
    colorbarProperties,
    setColormap
  } = (0,useViewportRendering/* useViewportRendering */.e)(viewportId, {
    displaySetInstanceUID: activeDisplaySetUID
  });
  const {
    colormaps
  } = colorbarProperties;
  const [showPreview, setShowPreview] = (0,react.useState)(false);
  const [prePreviewColormap, setPrePreviewColormap] = (0,react.useState)(null);
  const [currentColormap, setCurrentColormap] = (0,react.useState)(null);
  const showPreviewRef = (0,react.useRef)(showPreview);
  showPreviewRef.current = showPreview;
  const prePreviewColormapRef = (0,react.useRef)(prePreviewColormap);
  prePreviewColormapRef.current = prePreviewColormap;
  const currentColormapRef = (0,react.useRef)(currentColormap);
  currentColormapRef.current = currentColormap;
  (0,react.useEffect)(() => {
    setCurrentColormap(null);
    setPrePreviewColormap(null);
  }, [activeDisplaySetUID]);
  const handleSetColorLUT = (colormap, immediate = true) => {
    // Check if it's a fusion viewport
    const oneOpacityColormaps = ['Grayscale', 'X Ray'];
    const opacity = viewportDisplaySets.length > 1 && !oneOpacityColormaps.includes(colormap.name) ? 0.5 : 1;
    setColormap({
      colormap,
      opacity,
      immediate
    });
  };
  return /*#__PURE__*/react.createElement(react.Fragment, null, viewportDisplaySets && viewportDisplaySets.length > 1 && /*#__PURE__*/react.createElement("div", {
    className: "flex h-8 w-full flex-shrink-0 items-center justify-center px-2 text-base"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Tabs */.tUM, {
    value: activeDisplaySetUID,
    onValueChange: displaySetUID => {
      setActiveDisplaySetUID(displaySetUID);
      setPrePreviewColormap(null);
    }
  }, /*#__PURE__*/react.createElement(ui_next_src/* TabsList */.j7C, null, viewportDisplaySets.map(ds => /*#__PURE__*/react.createElement(ui_next_src/* TabsTrigger */.Xib, {
    key: ds.displaySetInstanceUID,
    value: ds.displaySetInstanceUID
  }, ds.Modality))))), /*#__PURE__*/react.createElement("div", {
    className: "hover:bg-accent flex h-8 w-full flex-shrink-0 cursor-pointer items-center px-2 text-base hover:rounded",
    onClick: () => setShowPreview(!showPreview)
  }, /*#__PURE__*/react.createElement("span", {
    className: "flex-shrink-0"
  }, "Preview in viewport"), /*#__PURE__*/react.createElement(ui_next_src/* Switch */.dOG, {
    className: "ml-auto flex-shrink-0",
    checked: showPreview,
    onCheckedChange: checked => {
      setShowPreview(checked);
      if (!checked && currentColormapRef.current) {
        handleSetColorLUT(currentColormapRef.current);
      }
    }
  })), /*#__PURE__*/react.createElement(ui_next_src/* AllInOneMenu */.se.DividerItem, null), /*#__PURE__*/react.createElement("div", {
    className: "h-[300px] flex-grow"
  }, /*#__PURE__*/react.createElement(ui_next_src/* ScrollArea */.FKN, {
    className: "h-full w-full"
  }, /*#__PURE__*/react.createElement("div", {
    className: "p-1"
  }, colormaps.map((colormap, index) => /*#__PURE__*/react.createElement(ui_next_src/* AllInOneMenu */.se.Item, {
    key: index,
    label: colormap.description,
    useIconSpace: false,
    onClick: () => {
      setCurrentColormap(colormap);
      handleSetColorLUT(colormap);
      setPrePreviewColormap(null);
    },
    onMouseEnter: () => {
      if (showPreviewRef.current) {
        if (!prePreviewColormapRef.current) {
          setPrePreviewColormap(colormap);
        }
        handleSetColorLUT(colormap);
      }
    },
    onMouseLeave: () => {
      if (showPreviewRef.current && prePreviewColormapRef.current) {
        handleSetColorLUT(prePreviewColormapRef.current);
      }
    }
  }))))));
}
;// ../../../extensions/cornerstone/src/components/WindowLevelActionMenu/Colorbar.tsx



function Colorbar({
  viewportId
} = {}) {
  const {
    hasColorbar,
    toggleColorbar
  } = (0,useViewportRendering/* useViewportRendering */.e)(viewportId);
  const handleToggle = (0,react.useCallback)(() => {
    toggleColorbar();
  }, [toggleColorbar]);
  return /*#__PURE__*/react.createElement("div", {
    className: "hover:bg-accent flex h-8 w-full flex-shrink-0 cursor-pointer items-center px-2 text-base hover:rounded"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex w-7 flex-shrink-0 items-center justify-center"
  }), /*#__PURE__*/react.createElement("span", {
    className: "flex-grow",
    onClick: handleToggle
  }, "Display Color bar"), /*#__PURE__*/react.createElement(ui_next_src/* Switch */.dOG, {
    className: "ml-2 flex-shrink-0",
    checked: !!hasColorbar,
    onCheckedChange: handleToggle
  }));
}
;// ../../../extensions/cornerstone/src/components/WindowLevelActionMenu/WindowLevel.tsx



function WindowLevel({
  viewportId
} = {}) {
  const {
    viewportDisplaySets
  } = (0,useViewportRendering/* useViewportRendering */.e)(viewportId);
  const [activeDisplaySetUID, setActiveDisplaySetUID] = (0,react.useState)(viewportDisplaySets?.[0]?.displaySetInstanceUID);

  // Use the hook with the active display set
  const {
    windowLevelPresets,
    setWindowLevel
  } = (0,useViewportRendering/* useViewportRendering */.e)(viewportId, {
    displaySetInstanceUID: activeDisplaySetUID
  });
  const [showPreview, setShowPreview] = (0,react.useState)(false);
  const [prePreviewPreset, setPrePreviewPreset] = (0,react.useState)(null);
  const [currentPreset, setCurrentPreset] = (0,react.useState)(null);
  const showPreviewRef = (0,react.useRef)(showPreview);
  showPreviewRef.current = showPreview;
  const prePreviewPresetRef = (0,react.useRef)(prePreviewPreset);
  prePreviewPresetRef.current = prePreviewPreset;
  const currentPresetRef = (0,react.useRef)(currentPreset);
  currentPresetRef.current = currentPreset;

  // Reset presets when active display set changes
  (0,react.useEffect)(() => {
    setCurrentPreset(null);
    setPrePreviewPreset(null);
  }, [activeDisplaySetUID]);

  // Handle applying window level preset
  const handleSetWindowLevel = (preset, immediate = false) => {
    setWindowLevel({
      windowWidth: Number(preset.window),
      windowCenter: Number(preset.level),
      immediate
    });
  };
  return /*#__PURE__*/react.createElement(react.Fragment, null, viewportDisplaySets && viewportDisplaySets.length > 1 && /*#__PURE__*/react.createElement("div", {
    className: "flex h-8 w-full flex-shrink-0 items-center justify-center px-2 text-base"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Tabs */.tUM, {
    value: activeDisplaySetUID,
    onValueChange: displaySetUID => {
      setActiveDisplaySetUID(displaySetUID);
    }
  }, /*#__PURE__*/react.createElement(ui_next_src/* TabsList */.j7C, null, viewportDisplaySets.map(ds => /*#__PURE__*/react.createElement(ui_next_src/* TabsTrigger */.Xib, {
    key: ds.displaySetInstanceUID,
    value: ds.displaySetInstanceUID
  }, ds.Modality))))), /*#__PURE__*/react.createElement("div", {
    className: "hover:bg-accent flex h-8 w-full flex-shrink-0 cursor-pointer items-center px-2 text-base hover:rounded",
    onClick: () => setShowPreview(!showPreview)
  }, /*#__PURE__*/react.createElement("span", {
    className: "flex-shrink-0"
  }, "Preview in viewport"), /*#__PURE__*/react.createElement(ui_next_src/* Switch */.dOG, {
    className: "ml-auto flex-shrink-0",
    checked: showPreview,
    onCheckedChange: checked => {
      setShowPreview(checked);

      // When turning off preview, restore the current preset if one exists
      if (!checked && currentPresetRef.current) {
        handleSetWindowLevel(currentPresetRef.current, true);
      }
    }
  })), /*#__PURE__*/react.createElement(ui_next_src/* AllInOneMenu */.se.DividerItem, null), /*#__PURE__*/react.createElement("div", {
    className: "h-[175px] flex-grow"
  }, /*#__PURE__*/react.createElement(ui_next_src/* ScrollArea */.FKN, {
    className: "h-full w-full"
  }, /*#__PURE__*/react.createElement("div", {
    className: "p-1"
  }, windowLevelPresets.map((preset, index) => /*#__PURE__*/react.createElement(ui_next_src/* AllInOneMenu */.se.Item, {
    key: index,
    label: preset.description,
    secondaryLabel: `${preset.window} / ${preset.level}`,
    useIconSpace: false,
    onClick: () => {
      setCurrentPreset(preset);
      handleSetWindowLevel(preset, true);
      setPrePreviewPreset(null);
    },
    onMouseEnter: () => {
      if (showPreviewRef.current) {
        if (!prePreviewPresetRef.current) {
          setPrePreviewPreset(currentPresetRef.current || preset);
        }
        handleSetWindowLevel(preset, true);
      }
    },
    onMouseLeave: () => {
      if (showPreviewRef.current && prePreviewPresetRef.current) {
        handleSetWindowLevel(prePreviewPresetRef.current, true);
      }
    }
  }))))));
}
;// ../../../extensions/cornerstone/src/components/WindowLevelActionMenu/VolumeRenderingPresetsContent.tsx




function VolumeRenderingPresetsContent({
  presets,
  viewportId,
  hide
}) {
  const {
    commandsManager
  } = (0,src.useSystem)();
  const [searchValue, setSearchValue] = (0,react.useState)('');
  const [selectedPreset, setSelectedPreset] = (0,react.useState)(null);
  const handleSearchChange = (0,react.useCallback)(event => {
    setSearchValue(event.target.value);
  }, []);
  const handleApply = (0,react.useCallback)(props => {
    commandsManager.runCommand('setViewportPreset', {
      ...props
    });
  }, [commandsManager]);
  const filteredPresets = searchValue ? presets.filter(preset => preset.name.toLowerCase().includes(searchValue.toLowerCase())) : presets;
  const formatLabel = (label, maxChars) => {
    return label.length > maxChars ? `${label.slice(0, maxChars)}...` : label;
  };
  return /*#__PURE__*/react.createElement(ui_next_src/* PresetDialog */.MUF, {
    className: "h-[500px]"
  }, /*#__PURE__*/react.createElement(ui_next_src/* PresetDialog */.MUF.PresetBody, null, /*#__PURE__*/react.createElement(ui_next_src/* PresetDialog */.MUF.PresetFilter, null, /*#__PURE__*/react.createElement(ui_next_src/* PresetDialog */.MUF.PresetSearch, {
    value: searchValue,
    onChange: handleSearchChange,
    placeholder: "Search all"
  })), /*#__PURE__*/react.createElement(ui_next_src/* PresetDialog */.MUF.PresetGrid, null, filteredPresets.map((preset, index) => /*#__PURE__*/react.createElement("div", {
    key: index,
    className: "flex cursor-pointer flex-col items-start",
    onClick: () => {
      setSelectedPreset(preset);
      handleApply({
        preset: preset.name,
        viewportId
      });
    }
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ByName, {
    name: preset.name,
    className: selectedPreset?.name === preset.name ? 'border-highlight h-[75px] w-[95px] max-w-none rounded border-2' : 'hover:border-highlight h-[75px] w-[95px] max-w-none rounded border-2 border-black'
  }), /*#__PURE__*/react.createElement("label", {
    className: "text-muted-foreground mt-1 text-left text-xs"
  }, formatLabel(preset.name, 11)))))), /*#__PURE__*/react.createElement(ui_next_src/* FooterAction */.esu, {
    className: "mt-4 flex-shrink-0"
  }, /*#__PURE__*/react.createElement(ui_next_src/* FooterAction */.esu.Right, null, /*#__PURE__*/react.createElement(ui_next_src/* FooterAction */.esu.Secondary, {
    onClick: hide
  }, "Cancel"))));
}
;// ../../../extensions/cornerstone/src/components/WindowLevelActionMenu/VolumeRenderingPresets.tsx






function VolumeRenderingPresets({
  viewportId
} = {}) {
  const {
    volumeRenderingPresets
  } = (0,useViewportRendering/* useViewportRendering */.e)(viewportId);
  const {
    servicesManager
  } = (0,src.useSystem)();
  const {
    uiDialogService
  } = servicesManager.services;
  const onClickPresets = () => {
    uiDialogService.show({
      id: 'volume-rendering-presets',
      content: VolumeRenderingPresetsContent,
      title: 'Rendering Presets',
      isDraggable: true,
      contentProps: {
        presets: volumeRenderingPresets,
        viewportId
      }
    });
  };
  return /*#__PURE__*/react.createElement(ui_next_src/* AllInOneMenu */.se.Item, {
    label: "Rendering Presets",
    icon: /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.VolumeRendering, null),
    rightIcon: /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ByName, {
      name: "action-new-dialog"
    }),
    onClick: onClickPresets
  });
}
;// ../../../extensions/cornerstone/src/components/WindowLevelActionMenu/VolumeRenderingQuality.tsx



function VolumeRenderingQuality({
  volumeRenderingQualityRange,
  viewportId
}) {
  const {
    servicesManager,
    commandsManager
  } = (0,src.useSystem)();
  const {
    cornerstoneViewportService
  } = servicesManager.services;
  const {
    min,
    max,
    step
  } = volumeRenderingQualityRange;
  const [quality, setQuality] = (0,react.useState)(null);
  const onChange = (0,react.useCallback)(value => {
    commandsManager.runCommand('setVolumeRenderingQulaity', {
      viewportId,
      volumeQuality: value
    });
    setQuality(value);
  }, [commandsManager, viewportId]);
  (0,react.useEffect)(() => {
    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
    const {
      actor
    } = viewport.getActors()[0];
    const mapper = actor.getMapper();
    const image = mapper.getInputData();
    const spacing = image.getSpacing();
    const sampleDistance = mapper.getSampleDistance();
    const averageSpacing = spacing.reduce((a, b) => a + b) / 3.0;
    if (sampleDistance === averageSpacing) {
      setQuality(1);
    } else {
      setQuality(Math.sqrt(averageSpacing / (sampleDistance * 0.5)));
    }
  }, [cornerstoneViewportService, viewportId]);
  return /*#__PURE__*/react.createElement("div", {
    className: "my-1 mt-2 flex flex-col space-y-2"
  }, quality !== null && /*#__PURE__*/react.createElement("div", {
    className: "w-full pl-2 pr-1"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Numeric */.ewR.Container, {
    mode: "singleRange",
    min: min,
    max: max,
    step: step,
    value: quality,
    onChange: onChange
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex flex-row items-center"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Numeric */.ewR.Label, {
    className: "w-16"
  }, "Quality"), /*#__PURE__*/react.createElement(ui_next_src/* Numeric */.ewR.SingleRange, {
    sliderClassName: "mx-2 flex-grow"
  })))));
}
;// ../../../extensions/cornerstone/src/components/WindowLevelActionMenu/VolumeShift.tsx



function VolumeShift({
  viewportId
}) {
  const {
    servicesManager,
    commandsManager
  } = (0,src.useSystem)();
  const {
    cornerstoneViewportService
  } = servicesManager.services;
  const [minShift, setMinShift] = (0,react.useState)(null);
  const [maxShift, setMaxShift] = (0,react.useState)(null);
  const [shift, setShift] = (0,react.useState)(cornerstoneViewportService.getCornerstoneViewport(viewportId)?.shiftedBy || 0);
  const [step, setStep] = (0,react.useState)(null);
  const [isBlocking, setIsBlocking] = (0,react.useState)(false);
  const prevShiftRef = (0,react.useRef)(shift);
  const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
  const {
    actor
  } = viewport.getActors()[0];
  const ofun = actor.getProperty().getScalarOpacity(0);
  (0,react.useEffect)(() => {
    if (isBlocking) {
      return;
    }
    const range = ofun.getRange();
    const transferFunctionWidth = range[1] - range[0];
    const minShift = -transferFunctionWidth;
    const maxShift = transferFunctionWidth;
    setMinShift(minShift);
    setMaxShift(maxShift);
    setStep(Math.pow(10, Math.floor(Math.log10(transferFunctionWidth / 500))));
  }, [cornerstoneViewportService, viewportId, actor, ofun, isBlocking]);
  const onChangeRange = (0,react.useCallback)(newShift => {
    const shiftDifference = newShift - prevShiftRef.current;
    prevShiftRef.current = newShift;
    viewport.shiftedBy = newShift;
    commandsManager.runCommand('shiftVolumeOpacityPoints', {
      viewportId,
      shift: shiftDifference
    });
    setShift(newShift);
  }, [commandsManager, viewportId, viewport]);
  return /*#__PURE__*/react.createElement("div", {
    className: "my-1 mt-2 flex flex-col space-y-2"
  }, step !== null && minShift !== null && maxShift !== null && /*#__PURE__*/react.createElement("div", {
    className: "w-full pl-2 pr-1"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Numeric */.ewR.Container, {
    mode: "singleRange",
    min: minShift,
    max: maxShift,
    step: step,
    value: shift,
    onChange: onChangeRange,
    onMouseDown: () => setIsBlocking(true),
    onMouseUp: () => setIsBlocking(false)
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex flex-row items-center"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Numeric */.ewR.Label, {
    className: "w-16"
  }, "Shift"), /*#__PURE__*/react.createElement(ui_next_src/* Numeric */.ewR.SingleRange, {
    sliderClassName: "mx-2 flex-grow"
  })))));
}
;// ../../../extensions/cornerstone/src/components/WindowLevelActionMenu/VolumeLighting.tsx



function VolumeLighting({
  viewportId,
  hasShade
}) {
  const {
    servicesManager,
    commandsManager
  } = (0,src.useSystem)();
  const {
    cornerstoneViewportService
  } = servicesManager.services;
  const [lightingValues, setLightingValues] = (0,react.useState)({
    ambient: null,
    diffuse: null,
    specular: null
  });

  // Single callback to handle all lighting property changes
  const onLightingChange = (0,react.useCallback)((property, value) => {
    commandsManager.runCommand('setVolumeLighting', {
      viewportId,
      options: {
        [property]: value
      }
    });
    setLightingValues(prev => ({
      ...prev,
      [property]: value
    }));
  }, [commandsManager, viewportId]);
  (0,react.useEffect)(() => {
    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
    const {
      actor
    } = viewport.getActors()[0];
    const property = actor.getProperty();
    const values = {
      ambient: property.getAmbient(),
      diffuse: property.getDiffuse(),
      specular: property.getSpecular()
    };
    setLightingValues(values);
  }, [viewportId, cornerstoneViewportService]);
  const disableOption = hasShade ? '' : 'ohif-disabled !opacity-40';

  // Configuration for our lighting properties
  const lightingProperties = [{
    key: 'ambient',
    label: 'Ambient'
  }, {
    key: 'diffuse',
    label: 'Diffuse'
  }, {
    key: 'specular',
    label: 'Specular'
  }];
  return /*#__PURE__*/react.createElement("div", {
    className: "my-1 mt-2 flex flex-col space-y-2"
  }, lightingProperties.map(({
    key,
    label
  }) => lightingValues[key] !== null && /*#__PURE__*/react.createElement("div", {
    key: key,
    className: `w-full pl-2 pr-1 ${disableOption}`
  }, /*#__PURE__*/react.createElement(ui_next_src/* Numeric */.ewR.Container, {
    mode: "singleRange",
    min: 0,
    max: 1,
    step: 0.1,
    value: lightingValues[key],
    onChange: value => onLightingChange(key, value)
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex flex-row items-center"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Numeric */.ewR.Label, {
    className: "w-16"
  }, label), /*#__PURE__*/react.createElement(ui_next_src/* Numeric */.ewR.SingleRange, {
    sliderClassName: "mx-2 flex-grow"
  }))))));
}
;// ../../../extensions/cornerstone/src/components/WindowLevelActionMenu/VolumeShade.tsx



function VolumeShade({
  viewportId,
  onClickShade = bool => {}
}) {
  const {
    servicesManager,
    commandsManager
  } = (0,src.useSystem)();
  const {
    cornerstoneViewportService
  } = servicesManager.services;
  const [shade, setShade] = (0,react.useState)(true);
  const [key, setKey] = (0,react.useState)(0);
  const onShadeChange = (0,react.useCallback)(checked => {
    commandsManager.runCommand('setVolumeLighting', {
      viewportId,
      options: {
        shade: checked
      }
    });
  }, [commandsManager, viewportId]);
  (0,react.useEffect)(() => {
    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
    const {
      actor
    } = viewport.getActors()[0];
    const shade = actor.getProperty().getShade();
    setShade(shade);
    onClickShade(shade);
    setKey(key + 1);
  }, [viewportId, cornerstoneViewportService]);
  return /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("span", {
    className: "flex-grow"
  }, "Shade"), /*#__PURE__*/react.createElement(ui_next_src/* Switch */.dOG, {
    className: "ml-2 flex-shrink-0",
    key: key,
    checked: shade,
    onCheckedChange: () => {
      setShade(!shade);
      onClickShade(!shade);
      onShadeChange(!shade);
    }
  }));
}
;// ../../../extensions/cornerstone/src/components/WindowLevelActionMenu/VolumeRenderingOptions.tsx







function VolumeRenderingOptions({
  viewportId
} = {}) {
  const {
    volumeRenderingQualityRange
  } = (0,useViewportRendering/* useViewportRendering */.e)(viewportId);
  const [hasShade, setShade] = (0,react.useState)(false);
  return /*#__PURE__*/react.createElement(ui_next_src/* AllInOneMenu */.se.ItemPanel, null, /*#__PURE__*/react.createElement(VolumeRenderingQuality, {
    viewportId: viewportId,
    volumeRenderingQualityRange: volumeRenderingQualityRange
  }), /*#__PURE__*/react.createElement(VolumeShift, {
    viewportId: viewportId
  }), /*#__PURE__*/react.createElement("div", {
    className: "mt-2 flex h-8 !h-[20px] w-full flex-shrink-0 items-center justify-start px-2 text-base"
  }, /*#__PURE__*/react.createElement("div", {
    className: "text-muted-foreground text-sm"
  }, "Lighting")), /*#__PURE__*/react.createElement("div", {
    className: "bg-background mt-1 mb-1 h-px w-full"
  }), /*#__PURE__*/react.createElement("div", {
    className: "hover:bg-accent flex h-8 w-full flex-shrink-0 items-center px-2 text-base hover:rounded"
  }, /*#__PURE__*/react.createElement(VolumeShade, {
    viewportId: viewportId,
    onClickShade: setShade
  })), /*#__PURE__*/react.createElement(VolumeLighting, {
    viewportId: viewportId,
    hasShade: hasShade
  }));
}
;// ../../../extensions/cornerstone/src/components/WindowLevelActionMenu/WindowLevelActionMenu.tsx









function WindowLevelActionMenu({
  viewportId,
  element,
  align,
  side
}) {
  return /*#__PURE__*/react.createElement(WindowLevelActionMenuContent, {
    viewportId: viewportId,
    align: align,
    side: side
  });
}
function WindowLevelActionMenuContent({
  viewportId,
  align,
  side
}) {
  const {
    t
  } = (0,es/* useTranslation */.Bd)('WindowLevelActionMenu');
  // Use a stable key for the menu to avoid infinite re-renders
  const menuKey = (0,react.useMemo)(() => `${viewportId}`, [viewportId]);
  const {
    is3DVolume,
    colorbarProperties,
    windowLevelPresets,
    volumeRenderingPresets,
    volumeRenderingQualityRange
  } = (0,useViewportRendering/* useViewportRendering */.e)(viewportId);
  return /*#__PURE__*/react.createElement(ui_next_src/* AllInOneMenu */.se.Menu, {
    key: menuKey
    // the visibility is handled by the parent component
    ,
    isVisible: true,
    align: align,
    side: side
  }, /*#__PURE__*/react.createElement(ui_next_src/* AllInOneMenu */.se.ItemPanel, null, !is3DVolume && /*#__PURE__*/react.createElement(Colorbar, {
    viewportId: viewportId
  }), colorbarProperties?.colormaps && !is3DVolume && /*#__PURE__*/react.createElement(ui_next_src/* AllInOneMenu */.se.SubMenu, {
    key: "colorLUTPresets",
    itemLabel: "Color LUT",
    itemIcon: "icon-color-lut",
    className: "flex h-[calc(100%-32px)] flex-col"
  }, /*#__PURE__*/react.createElement(Colormap, {
    viewportId: viewportId
  })), windowLevelPresets?.length > 0 && !is3DVolume && /*#__PURE__*/react.createElement(ui_next_src/* AllInOneMenu */.se.SubMenu, {
    key: "windowLevelPresets",
    itemLabel: t('Modality Window Presets'),
    itemIcon: "viewport-window-level"
  }, /*#__PURE__*/react.createElement(WindowLevel, {
    viewportId: viewportId
  })), volumeRenderingPresets && is3DVolume && /*#__PURE__*/react.createElement(VolumeRenderingPresets, {
    viewportId: viewportId
  }), volumeRenderingQualityRange && is3DVolume && /*#__PURE__*/react.createElement(ui_next_src/* AllInOneMenu */.se.SubMenu, {
    itemLabel: "Rendering Options"
  }, /*#__PURE__*/react.createElement(VolumeRenderingOptions, {
    viewportId: viewportId
  }))));
}
;// ../../../extensions/cornerstone/src/components/WindowLevelActionMenu/WindowLevelActionMenuWrapper.tsx
function WindowLevelActionMenuWrapper_extends() { return WindowLevelActionMenuWrapper_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, WindowLevelActionMenuWrapper_extends.apply(null, arguments); }






function WindowLevelActionMenuWrapper(props) {
  const {
    viewportId,
    element,
    location,
    isOpen = false,
    onOpen,
    onClose,
    disabled,
    isEmbedded = false,
    onInteraction: onInteractionProps,
    hasEmbeddedVariantToUse,
    ...rest
  } = props;
  const [gridState] = (0,ui_next_src/* useViewportGrid */.ihW)();
  const viewportIdToUse = viewportId || gridState.activeViewportId;
  const {
    viewportDisplaySets: displaySets
  } = (0,useViewportDisplaySets/* useViewportDisplaySets */.N)(viewportIdToUse);
  const {
    servicesManager
  } = (0,src.useSystem)();
  const {
    toolbarService
  } = servicesManager.services;
  const {
    IconContainer,
    className: iconClassName,
    containerProps
  } = (0,ui_next_src/* useIconPresentation */.n1D)();
  const {
    hasColorbar,
    toggleColorbar
  } = (0,hooks/* useViewportRendering */.eH)(viewportId);
  const handleOpenChange = openState => {
    const shouldToggleColorbar = hasColorbar && !isEmbedded;
    if (isOpen && shouldToggleColorbar && openState) {
      toggleColorbar();
      onClose?.();
      return;
    }
    if (!isOpen && openState && shouldToggleColorbar) {
      toggleColorbar();
      return;
    }
    if (openState) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };
  const {
    align,
    side
  } = toolbarService.getAlignAndSide(location);
  const modalities = displaySets.map(displaySet => displaySet.supportsWindowLevel);
  if (modalities.length === 0) {
    return null;
  }
  const Icon = hasColorbar && !isEmbedded && hasEmbeddedVariantToUse ? /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Close, {
    className: iconClassName
  }) : /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ViewportWindowLevel, {
    className: iconClassName
  });
  return /*#__PURE__*/react.createElement(ui_next_src/* Popover */.AMh, {
    open: isOpen,
    onOpenChange: handleOpenChange
  }, /*#__PURE__*/react.createElement(ui_next_src/* PopoverTrigger */.Wvm, {
    asChild: true,
    className: "flex items-center justify-center"
  }, /*#__PURE__*/react.createElement("div", null, IconContainer ? /*#__PURE__*/react.createElement(IconContainer, WindowLevelActionMenuWrapper_extends({
    disabled: disabled
  }, rest, containerProps), Icon) : /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    size: "icon",
    disabled: disabled
  }, Icon))), /*#__PURE__*/react.createElement(ui_next_src/* PopoverContent */.hlN, {
    className: "border-none bg-transparent p-0 shadow-none",
    side: side,
    align: align,
    alignOffset: 0,
    sideOffset: 5
  }, /*#__PURE__*/react.createElement(WindowLevelActionMenu, {
    viewportId: viewportIdToUse,
    element: element,
    align: align,
    side: side
  })));
}
;// ../../../extensions/cornerstone/src/components/VOIManualControlMenu/VOIManualControlMenu.tsx






const TABS = {
  MINMAX: 'minmax',
  MANUAL: 'manual'
};
function VOIManualControlMenu({
  viewportId,
  className
}) {
  const {
    servicesManager
  } = (0,src.useSystem)();
  const {
    displaySetService
  } = servicesManager.services;
  const [activeTab, setActiveTab] = (0,react.useState)(TABS.MINMAX);
  const {
    viewportDisplaySets
  } = (0,useViewportDisplaySets/* useViewportDisplaySets */.N)(viewportId);
  const [selectedDisplaySetUID, setSelectedDisplaySetUID] = (0,react.useState)(viewportDisplaySets.length > 0 ? viewportDisplaySets[0].displaySetInstanceUID : undefined);
  const {
    voiRange,
    setVOIRange,
    windowLevel,
    setWindowLevel
  } = (0,useViewportRendering/* useViewportRendering */.e)(viewportId, {
    displaySetInstanceUID: selectedDisplaySetUID
  });
  (0,react.useEffect)(() => {
    if (viewportDisplaySets.length > 0 && !selectedDisplaySetUID) {
      setSelectedDisplaySetUID(viewportDisplaySets[0].displaySetInstanceUID);
    }
  }, [viewportDisplaySets, selectedDisplaySetUID]);
  if (!voiRange) {
    return null;
  }
  const {
    upper,
    lower
  } = voiRange;
  const {
    windowWidth,
    windowCenter
  } = windowLevel;
  const selectedViewportImageIds = displaySetService.getDisplaySetByUID(selectedDisplaySetUID)?.imageIds;
  let min = Infinity;
  let max = -Infinity;
  if (selectedViewportImageIds) {
    for (const imageId of selectedViewportImageIds) {
      const image = esm.cache.getImage(imageId);
      if (image) {
        min = Math.min(min, image.minPixelValue);
        max = Math.max(max, image.maxPixelValue);
      }
    }
  }

  // Provide reasonable defaults if min/max couldn't be determined
  if (min === Infinity || max === -Infinity) {
    min = 0;
    max = 255;
  }
  const selectedDisplaySet = viewportDisplaySets.find(ds => ds.displaySetInstanceUID === selectedDisplaySetUID);
  return /*#__PURE__*/react.createElement("div", {
    className: className
  }, /*#__PURE__*/react.createElement("div", {
    className: "bg-popover w-72 rounded-lg p-4 shadow-md"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Tabs */.tUM, {
    defaultValue: activeTab,
    onValueChange: setActiveTab
  }, /*#__PURE__*/react.createElement("div", {
    className: "mb-4 flex items-center space-x-2"
  }, viewportDisplaySets.length > 1 && /*#__PURE__*/react.createElement(ui_next_src/* Select */.l6P, {
    value: selectedDisplaySetUID,
    onValueChange: setSelectedDisplaySetUID
  }, /*#__PURE__*/react.createElement(ui_next_src/* SelectTrigger */.bqE, null, /*#__PURE__*/react.createElement(ui_next_src/* SelectValue */.yvm, null, selectedDisplaySet?.label || 'Select Display Set')), /*#__PURE__*/react.createElement(ui_next_src/* SelectContent */.gCo, null, viewportDisplaySets.map(ds => /*#__PURE__*/react.createElement(ui_next_src/* SelectItem */.ebT, {
    key: ds.displaySetInstanceUID,
    value: ds.displaySetInstanceUID
  }, `${ds.SeriesDescription || ''}`.trim())))), /*#__PURE__*/react.createElement(ui_next_src/* TabsList */.j7C, {
    className: "w-full flex-1"
  }, /*#__PURE__*/react.createElement(ui_next_src/* TabsTrigger */.Xib, {
    value: TABS.MINMAX,
    className: "flex-1"
  }, "Min/Max"), /*#__PURE__*/react.createElement(ui_next_src/* TabsTrigger */.Xib, {
    value: TABS.MANUAL,
    className: "flex-1"
  }, "Manual"))), /*#__PURE__*/react.createElement(ui_next_src/* TabsContent */.avX, {
    value: TABS.MINMAX
  }, /*#__PURE__*/react.createElement(ui_next_src/* Numeric */.ewR.Container, {
    mode: "doubleRange",
    min: min,
    max: max,
    values: [lower, upper],
    step: 1,
    className: "space-y-1",
    onChange: vals => {
      const [newLower, newUpper] = vals;
      if (newLower !== lower || newUpper !== upper) {
        setVOIRange({
          lower: newLower,
          upper: newUpper
        });
      }
    }
  }, /*#__PURE__*/react.createElement(ui_next_src/* Numeric */.ewR.DoubleRange, {
    showNumberInputs: true
  }))), /*#__PURE__*/react.createElement(ui_next_src/* TabsContent */.avX, {
    value: TABS.MANUAL
  }, /*#__PURE__*/react.createElement("div", {
    className: "space-y-1"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Numeric */.ewR.Container, {
    mode: "singleRange",
    min: 0,
    max: max,
    step: 1,
    value: windowWidth,
    className: "space-y-1",
    onChange: val => {
      if (val !== windowWidth) {
        setWindowLevel({
          windowWidth: val,
          windowCenter
        });
      }
    }
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Numeric */.ewR.Label, null, "W:"), /*#__PURE__*/react.createElement(ui_next_src/* Numeric */.ewR.SingleRange, {
    showNumberInput: true
  }))), /*#__PURE__*/react.createElement(ui_next_src/* Numeric */.ewR.Container, {
    mode: "singleRange",
    min: min,
    max: max,
    step: 1,
    value: windowCenter,
    className: "space-y-1",
    onChange: val => {
      if (val !== windowCenter) {
        setWindowLevel({
          windowWidth,
          windowCenter: val
        });
      }
    }
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Numeric */.ewR.Label, null, "L:"), /*#__PURE__*/react.createElement(ui_next_src/* Numeric */.ewR.SingleRange, {
    showNumberInput: true
  }))))))));
}
/* harmony default export */ const VOIManualControlMenu_VOIManualControlMenu = (VOIManualControlMenu);
;// ../../../extensions/cornerstone/src/components/VOIManualControlMenu/VOIManualControlMenuWrapper.tsx
function VOIManualControlMenuWrapper_extends() { return VOIManualControlMenuWrapper_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, VOIManualControlMenuWrapper_extends.apply(null, arguments); }




function VOIManualControlMenuWrapper(props) {
  const {
    viewportId,
    location,
    isOpen = false,
    onOpen,
    onClose,
    disabled,
    ...rest
  } = props;
  const {
    IconContainer,
    className: iconClassName,
    containerProps
  } = (0,ui_next_src/* useIconPresentation */.n1D)();
  const handleOpenChange = openState => {
    if (openState) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };
  const {
    servicesManager
  } = (0,src.useSystem)();
  const {
    toolbarService
  } = servicesManager.services;
  const {
    align,
    side
  } = toolbarService.getAlignAndSide(location);
  const Icon = /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.WindowLevelAdvanced, {
    className: iconClassName
  });
  return /*#__PURE__*/react.createElement(ui_next_src/* Popover */.AMh, {
    open: isOpen,
    onOpenChange: handleOpenChange
  }, /*#__PURE__*/react.createElement(ui_next_src/* PopoverTrigger */.Wvm, {
    asChild: true,
    className: "flex items-center justify-center"
  }, /*#__PURE__*/react.createElement("div", null, IconContainer ? /*#__PURE__*/react.createElement(IconContainer, VOIManualControlMenuWrapper_extends({
    disabled: disabled,
    icon: "WindowLevelAdvanced"
  }, rest, containerProps), Icon) : /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    size: "icon",
    disabled: disabled
  }, Icon))), /*#__PURE__*/react.createElement(ui_next_src/* PopoverContent */.hlN, {
    className: "border-none bg-transparent p-0 shadow-none",
    side: side,
    align: align,
    alignOffset: 0,
    sideOffset: 5
  }, /*#__PURE__*/react.createElement(VOIManualControlMenu_VOIManualControlMenu, {
    className: "w-full",
    viewportId: viewportId
  })));
}
;// ../../../extensions/cornerstone/src/components/VOIManualControlMenu/index.ts


;// ../../../extensions/cornerstone/src/components/ThresholdMenu/ThresholdMenu.tsx





function ThresholdMenu({
  viewportId,
  className
}) {
  const {
    viewportDisplaySets,
    foregroundDisplaySets
  } = (0,useViewportDisplaySets/* useViewportDisplaySets */.N)(viewportId);
  const [selectedDisplaySetUID, setSelectedDisplaySetUID] = (0,react.useState)(foregroundDisplaySets.length > 0 ? foregroundDisplaySets[0].displaySetInstanceUID : undefined);
  const {
    threshold,
    setThreshold,
    pixelValueRange
  } = (0,hooks/* useViewportRendering */.eH)(viewportId, {
    displaySetInstanceUID: selectedDisplaySetUID
  });
  const {
    min,
    max
  } = pixelValueRange;
  const thresholdValue = threshold ?? min;
  (0,react.useEffect)(() => {
    if (foregroundDisplaySets.length > 0 && !selectedDisplaySetUID) {
      setSelectedDisplaySetUID(foregroundDisplaySets[0].displaySetInstanceUID);
    }
  }, [foregroundDisplaySets, selectedDisplaySetUID]);
  const selectedDisplaySet = viewportDisplaySets.find(ds => ds.displaySetInstanceUID === selectedDisplaySetUID);
  return /*#__PURE__*/react.createElement("div", {
    className: className
  }, /*#__PURE__*/react.createElement("div", {
    className: "bg-popover w-72 rounded-lg p-4 shadow-md"
  }, /*#__PURE__*/react.createElement("div", {
    className: "mb-4 flex items-center justify-between"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/react.createElement("span", {
    className: "text-muted-foreground text-base"
  }, "Threshold"), viewportDisplaySets.length > 1 && /*#__PURE__*/react.createElement("div", {
    className: "w-32"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Select */.l6P, {
    value: selectedDisplaySetUID,
    onValueChange: setSelectedDisplaySetUID
  }, /*#__PURE__*/react.createElement(ui_next_src/* SelectTrigger */.bqE, null, /*#__PURE__*/react.createElement(ui_next_src/* SelectValue */.yvm, null, selectedDisplaySet?.label || 'Select Display Set')), /*#__PURE__*/react.createElement(ui_next_src/* SelectContent */.gCo, null, viewportDisplaySets.map(ds => /*#__PURE__*/react.createElement(ui_next_src/* SelectItem */.ebT, {
    key: ds.displaySetInstanceUID,
    value: ds.displaySetInstanceUID
  }, /*#__PURE__*/react.createElement(components_SelectItemWithModality, {
    displaySet: ds
  }))))))), /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    size: "sm",
    variant: "ghost",
    onClick: () => setThreshold(min),
    className: "text-sm"
  }, "Reset")), /*#__PURE__*/react.createElement(ui_next_src/* Numeric */.ewR.Container, {
    mode: "singleRange",
    value: thresholdValue,
    onChange: val => {
      if (typeof val === 'number') {
        setThreshold(val);
      }
    },
    min: min,
    max: max,
    step: 0.01
  }, /*#__PURE__*/react.createElement(ui_next_src/* Numeric */.ewR.SingleRange, null), /*#__PURE__*/react.createElement("div", {
    className: "mt-1 flex justify-between"
  }, /*#__PURE__*/react.createElement("span", {
    className: "text-muted-foreground text-sm"
  }, min.toFixed(0)), /*#__PURE__*/react.createElement("span", {
    className: "text-muted-foreground text-sm"
  }, max.toFixed(0))))));
}
/* harmony default export */ const ThresholdMenu_ThresholdMenu = (ThresholdMenu);
;// ../../../extensions/cornerstone/src/components/ThresholdMenu/ThresholdMenuWrapper.tsx
function ThresholdMenuWrapper_extends() { return ThresholdMenuWrapper_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, ThresholdMenuWrapper_extends.apply(null, arguments); }




function ThresholdMenuWrapper(props) {
  const {
    viewportId,
    location,
    isOpen = false,
    onOpen,
    onClose,
    disabled,
    ...rest
  } = props;
  const {
    IconContainer,
    className: iconClassName,
    containerProps
  } = (0,ui_next_src/* useIconPresentation */.n1D)();
  const handleOpenChange = openState => {
    if (openState) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };
  const {
    servicesManager
  } = (0,src.useSystem)();
  const {
    toolbarService
  } = servicesManager.services;
  const {
    align,
    side
  } = toolbarService.getAlignAndSide(location);
  const Icon = /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Threshold, {
    className: iconClassName
  });
  return /*#__PURE__*/react.createElement(ui_next_src/* Popover */.AMh, {
    open: isOpen,
    onOpenChange: handleOpenChange
  }, /*#__PURE__*/react.createElement(ui_next_src/* PopoverTrigger */.Wvm, {
    asChild: true,
    className: "flex items-center justify-center"
  }, /*#__PURE__*/react.createElement("div", null, IconContainer ? /*#__PURE__*/react.createElement(IconContainer, ThresholdMenuWrapper_extends({
    disabled: disabled,
    icon: "Threshold"
  }, rest, containerProps), Icon) : /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    size: "icon",
    disabled: disabled
  }, Icon))), /*#__PURE__*/react.createElement(ui_next_src/* PopoverContent */.hlN, {
    className: "border-none bg-transparent p-0 shadow-none",
    side: side,
    align: align,
    alignOffset: 0,
    sideOffset: 5
  }, /*#__PURE__*/react.createElement(ThresholdMenu_ThresholdMenu, {
    className: "w-full",
    viewportId: viewportId
  })));
}
;// ../../../extensions/cornerstone/src/components/OpacityMenu/OpacityMenu.tsx



function OpacityMenu({
  viewportId,
  className
}) {
  const {
    backgroundDisplaySet,
    foregroundDisplaySets
  } = (0,hooks/* useViewportDisplaySets */.Ne)(viewportId, {
    includeForeground: true,
    includeBackground: true
  });
  const {
    opacityLinear,
    setOpacityLinear
  } = (0,hooks/* useViewportRendering */.eH)(viewportId, {
    displaySetInstanceUID: foregroundDisplaySets[0].displaySetInstanceUID
  });
  const opacityValue = opacityLinear !== undefined ? opacityLinear : 0;
  const backgroundModality = backgroundDisplaySet?.Modality || '';
  const foregroundModality = foregroundDisplaySets[0]?.Modality || '';
  return /*#__PURE__*/react.createElement("div", {
    className: className
  }, /*#__PURE__*/react.createElement("div", {
    className: "bg-popover w-72 rounded-lg p-3"
  }, /*#__PURE__*/react.createElement("div", {
    className: "mb-2 flex items-center justify-center"
  }, /*#__PURE__*/react.createElement("span", {
    className: "text-muted-foreground text-base"
  }, "Opacity")), /*#__PURE__*/react.createElement("div", {
    className: ""
  }, /*#__PURE__*/react.createElement(ui_next_src/* Numeric */.ewR.Container, {
    mode: "singleRange",
    value: opacityValue,
    onChange: val => {
      if (typeof val === 'number') {
        setOpacityLinear(val);
      }
    },
    min: 0,
    max: 1,
    step: 0.0001
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/react.createElement("span", {
    className: "text-foreground mr-2 text-sm"
  }, backgroundModality), /*#__PURE__*/react.createElement(ui_next_src/* Numeric */.ewR.SingleRange, {
    showNumberInput: false
  }), /*#__PURE__*/react.createElement("span", {
    className: "text-foreground ml-2 text-sm"
  }, foregroundModality))))));
}
/* harmony default export */ const OpacityMenu_OpacityMenu = (OpacityMenu);
;// ../../../extensions/cornerstone/src/components/OpacityMenu/OpacityMenuWrapper.tsx
function OpacityMenuWrapper_extends() { return OpacityMenuWrapper_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, OpacityMenuWrapper_extends.apply(null, arguments); }




function OpacityMenuWrapper(props) {
  const {
    viewportId,
    location,
    isOpen = false,
    onOpen,
    onClose,
    disabled,
    ...rest
  } = props;
  const {
    IconContainer,
    className: iconClassName,
    containerProps
  } = (0,ui_next_src/* useIconPresentation */.n1D)();
  const handleOpenChange = openState => {
    if (openState) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };
  const {
    servicesManager
  } = (0,src.useSystem)();
  const {
    toolbarService
  } = servicesManager.services;
  const {
    align,
    side
  } = toolbarService.getAlignAndSide(location);
  const Icon = /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Opacity, {
    className: iconClassName
  });
  return /*#__PURE__*/react.createElement(ui_next_src/* Popover */.AMh, {
    open: isOpen,
    onOpenChange: handleOpenChange
  }, /*#__PURE__*/react.createElement(ui_next_src/* PopoverTrigger */.Wvm, {
    asChild: true,
    className: "flex items-center justify-center"
  }, /*#__PURE__*/react.createElement("div", null, IconContainer ? /*#__PURE__*/react.createElement(IconContainer, OpacityMenuWrapper_extends({
    disabled: disabled,
    icon: "Opacity"
  }, rest, containerProps), Icon) : /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    size: "icon",
    disabled: disabled
  }, Icon))), /*#__PURE__*/react.createElement(ui_next_src/* PopoverContent */.hlN, {
    className: "border-none bg-transparent p-0 shadow-none",
    side: side,
    align: align,
    alignOffset: 0,
    sideOffset: 5
  }, /*#__PURE__*/react.createElement(OpacityMenu_OpacityMenu, {
    className: "w-full",
    viewportId: viewportId
  })));
}
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/hooks/useMeasurementTracking.ts
var useMeasurementTracking = __webpack_require__(84535);
;// ../../../extensions/cornerstone/src/components/ModalityLoadBadge/ModalityLoadBadge.tsx








/**
 * ModalityLoadBadge displays the status and actionable buttons for viewports containing
 * special displaySets (SR, SEG, RTSTRUCT) or when tracking measurements
 */
function ModalityLoadBadge({
  viewportId
}) {
  const {
    commandsManager
  } = (0,src.useSystem)();
  const {
    t
  } = (0,es/* useTranslation */.Bd)('Common');
  const loadStr = t('LOAD');
  const {
    isTracked,
    isLocked
  } = (0,useMeasurementTracking/* useMeasurementTracking */.R)({
    viewportId
  });
  const {
    backgroundDisplaySet
  } = (0,useViewportDisplaySets/* useViewportDisplaySets */.N)(viewportId);
  const [specialDisplaySet, setSpecialDisplaySet] = (0,react.useState)(null);
  const allDisplaySets = (0,react.useMemo)(() => {
    return [backgroundDisplaySet].filter(Boolean);
  }, [backgroundDisplaySet]);
  (0,react.useEffect)(() => {
    const displaySet = allDisplaySets.find(ds => ds.isOverlayDisplaySet || ds?.Modality === 'SR');
    setSpecialDisplaySet(displaySet || null);
  }, [allDisplaySets]);
  const statusInfo = (0,react.useMemo)(() => {
    if (isTracked && !specialDisplaySet) {
      return {
        type: 'SR',
        isHydrated: true,
        isTracked,
        displaySet: null,
        tooltip: 'Currently tracking measurements in this viewport'
      };
    }
    if (!specialDisplaySet) {
      return {
        type: null
      };
    }
    const type = specialDisplaySet.Modality;
    const isHydrated = specialDisplaySet.isHydrated || false;
    let tooltip = null;
    const isRehydratable = specialDisplaySet.isRehydratable || false;
    if (type === 'SEG') {
      tooltip = isHydrated ? 'This Segmentation is loaded in the segmentation panel' : 'Click LOAD to load segmentation.';
    } else if (type === 'RTSTRUCT') {
      tooltip = isHydrated ? 'This RTSTRUCT is loaded in the segmentation panel' : 'Click LOAD to load RTSTRUCT.';
    } else if (type === 'SR') {
      if (!isRehydratable) {
        tooltip = 'This structured report is not compatible with this application.';
      } else if (isRehydratable && isLocked) {
        tooltip = 'This structured report is currently read-only because you are tracking measurements in another viewport.';
      } else {
        tooltip = `Click ${loadStr} to restore measurements.`;
      }
    }
    return {
      type,
      isHydrated,
      displaySet: specialDisplaySet,
      isRehydratable,
      tooltip
    };
  }, [specialDisplaySet, loadStr, isLocked, isTracked]);

  // Nothing to show if there's no special display set type or tracking
  if (!statusInfo.type && !isTracked) {
    return null;
  }
  const StatusIcon = () => {
    if (statusInfo.type === 'SR') {
      if (statusInfo.isRehydratable && !isLocked) {
        return /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ByName, {
          className: "text-muted-foreground h-4 w-4",
          name: "status-untracked"
        });
      }
      if (statusInfo.isRehydratable && isLocked) {
        return /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ByName, {
          name: "status-locked",
          className: "h-4 w-4"
        });
      } else {
        return /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ByName, {
          name: "status-alert",
          className: "h-4 w-4"
        });
      }
    } else {
      return /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.StatusUntracked, {
        className: "h-4 w-4"
      });
    }
  };
  const StatusArea = () => {
    if (!statusInfo.isHydrated) {
      return /*#__PURE__*/react.createElement("div", {
        "data-cy": `ModalityLoadBadge-${viewportId}`,
        className: "flex h-6 cursor-default text-sm leading-6 text-white"
      }, /*#__PURE__*/react.createElement("div", {
        className: "bg-customgray-100 flex min-w-[45px] items-center rounded-l-xl rounded-r p-1"
      }, /*#__PURE__*/react.createElement(StatusIcon, null), /*#__PURE__*/react.createElement("span", {
        className: "ml-1"
      }, statusInfo.type)), statusInfo.type !== 'SR' && /*#__PURE__*/react.createElement(ui_next_src/* ViewportActionButton */.N8H, {
        onInteraction: () => {
          commandsManager.runCommand('hydrateSecondaryDisplaySet', {
            displaySet: statusInfo.displaySet,
            viewportId
          });
        }
      }, loadStr));
    }
    return null;
  };
  return /*#__PURE__*/react.createElement(react.Fragment, null, statusInfo.tooltip && /*#__PURE__*/react.createElement(ui_next_src/* Tooltip */.m_M, null, /*#__PURE__*/react.createElement(ui_next_src/* TooltipTrigger */.k$k, {
    asChild: true
  }, /*#__PURE__*/react.createElement("span", null, /*#__PURE__*/react.createElement(StatusArea, null))), /*#__PURE__*/react.createElement(ui_next_src/* TooltipContent */.ZIw, {
    side: "bottom"
  }, /*#__PURE__*/react.createElement("div", null, statusInfo.tooltip))), !statusInfo.tooltip && /*#__PURE__*/react.createElement(StatusArea, null));
}
/* harmony default export */ const ModalityLoadBadge_ModalityLoadBadge = (ModalityLoadBadge);
;// ../../../extensions/cornerstone/src/components/NavigationComponent/NavigationComponent.tsx








/**
 * NavigationComponent provides navigation controls for viewports containing
 * special displaySets (SR, SEG, RTSTRUCT) to navigate between segments or measurements
 */
function NavigationComponent({
  viewportId
}) {
  const {
    servicesManager
  } = (0,src.useSystem)();
  const {
    segmentationService,
    cornerstoneViewportService,
    measurementService
  } = servicesManager.services;

  // Get tracking information
  const {
    isTracked,
    trackedMeasurementUIDs
  } = (0,useMeasurementTracking/* useMeasurementTracking */.R)({
    viewportId
  });
  const {
    viewportDisplaySets
  } = (0,useViewportDisplaySets/* useViewportDisplaySets */.N)(viewportId);
  const [measurementSelected, setMeasurementSelected] = (0,react.useState)(0);
  const isSRDisplaySet = viewportDisplaySets.some(displaySet => displaySet?.Modality === 'SR');
  const cornerstoneViewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);

  // Get segmentation information
  const {
    segmentationsWithRepresentations
  } = (0,hooks/* useViewportSegmentations */.Lt)({
    viewportId
  });
  const hasSegmentations = segmentationsWithRepresentations.length > 0;

  // prefer segment navigation if available
  const navigationMode = hasSegmentations ? 'segment' : isSRDisplaySet ? 'measurement' : isTracked ? 'measurement' : null;
  const handleMeasurementNavigation = (0,react.useCallback)(direction => {
    const measurementDisplaySet = viewportDisplaySets.find(displaySet => displaySet?.Modality === 'SR');
    if (measurementDisplaySet) {
      const measurements = measurementDisplaySet.measurements;
      if (measurements.length <= 0) {
        return;
      }
      const newIndex = getNextIndex(measurementSelected, direction, measurements.length);
      setMeasurementSelected(newIndex);
      const measurement = measurements[newIndex];
      cornerstoneViewport.setViewReference({
        referencedImageId: measurement.imageId
      });
      return;
    }
    if (isTracked && trackedMeasurementUIDs.length > 0) {
      const newIndex = getNextIndex(measurementSelected, direction, trackedMeasurementUIDs.length);
      setMeasurementSelected(newIndex);
      measurementService.jumpToMeasurement(viewportId, trackedMeasurementUIDs[newIndex]);
    }
  }, [viewportId, cornerstoneViewport, measurementSelected, measurementService, isTracked, trackedMeasurementUIDs, viewportDisplaySets]);
  const handleSegmentNavigation = (0,react.useCallback)(direction => {
    if (!segmentationsWithRepresentations.length) {
      return;
    }
    const segmentationId = segmentationsWithRepresentations[0].segmentation.segmentationId;
    src_utils.handleSegmentChange({
      direction,
      segmentationId,
      viewportId,
      selectedSegmentObjectIndex: 0,
      segmentationService
    });
  }, [segmentationsWithRepresentations, viewportId, segmentationService]);

  // Handle navigation between segments/measurements
  const handleNavigate = (0,react.useCallback)(direction => {
    if (navigationMode === 'segment') {
      handleSegmentNavigation(direction);
    } else if (navigationMode === 'measurement') {
      handleMeasurementNavigation(direction);
    }
  }, [navigationMode, handleSegmentNavigation, handleMeasurementNavigation]);

  // Only render if we have a navigation mode
  if (!navigationMode) {
    return null;
  }
  return /*#__PURE__*/react.createElement(ui_next_src/* ViewportActionArrows */.$IX, {
    onArrowsClick: handleNavigate,
    className: "h-6"
  });
}

/**
 * Calculate the next index with circular navigation support
 * @param currentIndex Current index position
 * @param direction Direction of movement (1 for next, -1 for previous)
 * @param totalItems Total number of items to navigate through
 * @returns The next index with wrap-around support
 */
function getNextIndex(currentIndex, direction, totalItems) {
  if (totalItems <= 0) {
    return 0;
  }

  // Use modulo to handle circular navigation
  let nextIndex = (currentIndex + direction) % totalItems;

  // Handle negative index when going backwards from index 0
  if (nextIndex < 0) {
    nextIndex = totalItems - 1;
  }
  return nextIndex;
}
/* harmony default export */ const NavigationComponent_NavigationComponent = (NavigationComponent);
;// ../../../extensions/cornerstone/src/components/TrackingStatus/TrackingStatus.tsx




/**
 * TrackingStatus displays an indicator icon for viewports that have
 * tracked measurements
 */
function TrackingStatus({
  viewportId
}) {
  const {
    isTracked
  } = (0,useMeasurementTracking/* useMeasurementTracking */.R)({
    viewportId
  });
  if (!isTracked) {
    return null;
  }
  return /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement(ui_next_src/* Tooltip */.m_M, null, /*#__PURE__*/react.createElement(ui_next_src/* TooltipTrigger */.k$k, {
    asChild: true
  }, /*#__PURE__*/react.createElement("span", null, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.StatusTracking, {
    className: "h-4 w-4"
  }))), /*#__PURE__*/react.createElement(ui_next_src/* TooltipContent */.ZIw, {
    side: "bottom"
  }, /*#__PURE__*/react.createElement("div", null, "Tracking"))));
}
/* harmony default export */ const TrackingStatus_TrackingStatus = (TrackingStatus);
;// ../../../extensions/cornerstone/src/components/ViewportColorbar/ViewportColorbar.tsx



const {
  ViewportColorbar: CornerstoneViewportColorbar
} = dist_esm.utilities.voi.colorbar;
const isHorizontal = position => position === 'top' || position === 'bottom';

/**
 * ViewportColorbar Component
 * A React wrapper for the cornerstone ViewportColorbar that adds a close button
 * positioned appropriately based on the colorbar position.
 */
const ViewportColorbar = /*#__PURE__*/(0,react.memo)(function ViewportColorbar({
  viewportId,
  displaySetInstanceUID,
  colormaps,
  activeColormapName,
  volumeId,
  position,
  tickPosition,
  tickStyles,
  numColorbars
}) {
  const containerRef = (0,react.useRef)(null);
  const {
    servicesManager
  } = (0,src.useSystem)();
  const {
    customizationService
  } = servicesManager.services;
  const viewportElementRef = (0,src.useViewportRef)(viewportId);
  const {
    height,
    width
  } = (0,src.useViewportSize)(viewportId);

  // Memoize colorbar customization to prevent rerenders from unrelated customization changes
  const colorbarCustomization = (0,react.useMemo)(() => {
    return customizationService.getCustomization('cornerstone.colorbar');
  }, [customizationService]);
  const appropriateTickPosition = (0,react.useMemo)(() => {
    let tickPos = tickPosition;
    if (position === 'left' || position === 'right') {
      tickPos = position === 'left' ? 'right' : 'left';
    } else {
      tickPos = position === 'top' ? 'bottom' : 'top';
    }
    return tickPos;
  }, [position, tickPosition]);
  const positionTickStyles = (0,react.useMemo)(() => {
    return colorbarCustomization?.positionTickStyles?.[position];
  }, [colorbarCustomization, position]);
  const positionStylesFromConfig = (0,react.useMemo)(() => {
    return colorbarCustomization?.positionStyles?.[position] || {};
  }, [colorbarCustomization, position]);
  const mergedTickStyles = (0,react.useMemo)(() => {
    return {
      ...(colorbarCustomization?.tickStyles || {}),
      ...(positionTickStyles?.style || {}),
      ...(tickStyles || {})
    };
  }, [colorbarCustomization, positionTickStyles, tickStyles]);
  const colorbarId = (0,react.useMemo)(() => {
    return `Colorbar-${viewportId}-${displaySetInstanceUID}`;
  }, [viewportId, displaySetInstanceUID]);
  (0,react.useEffect)(() => {
    if (!containerRef.current || !colormaps || !activeColormapName) {
      return;
    }
    const viewportElement = viewportElementRef?.current;
    if (!viewportElement || !colormaps?.length) {
      return;
    }

    // Using stable references from memoized values
    const csColorbar = new CornerstoneViewportColorbar({
      id: colorbarId,
      element: viewportElement,
      container: containerRef.current,
      colormaps: colormaps,
      activeColormapName: activeColormapName,
      volumeId,
      ticks: {
        position: appropriateTickPosition,
        style: mergedTickStyles
      }
    });
    return () => {
      if (csColorbar) {
        csColorbar.destroy();
      }
    };
  }, [viewportId, displaySetInstanceUID, colormaps, activeColormapName, volumeId, colorbarId, appropriateTickPosition, mergedTickStyles, viewportElementRef]);
  if (!height || !width) {
    return null;
  }
  return /*#__PURE__*/react.createElement("div", {
    id: `colorbar-container-${viewportId}-${displaySetInstanceUID}`,
    ref: containerRef,
    style: {
      position: 'relative',
      zIndex: 1000,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      pointerEvents: 'auto',
      minWidth: isHorizontal(position) ? width / 2.5 : '17px',
      minHeight: isHorizontal(position) ? '20px' : numColorbars === 1 ? height / 3 : height / 4,
      height: '1px',
      // sometimes flex items with min-height need a starting point for its height calculation
      ...positionStylesFromConfig
    }
  });
});
/* harmony default export */ const ViewportColorbar_ViewportColorbar = (ViewportColorbar);
;// ../../../extensions/cornerstone/src/components/ViewportColorbar/ViewportColorbarsContainer.tsx





/**
 * Container component that manages multiple colorbars for a viewport
 * It interacts with the colorbarService to get/set colorbar states
 */
const ViewportColorbarsContainer = /*#__PURE__*/(0,react.memo)(function ViewportColorbarsContainer({
  viewportId,
  location
}) {
  const [colorbars, setColorbars] = (0,react.useState)([]);
  const {
    servicesManager
  } = (0,src.useSystem)();
  const {
    colorbarService,
    customizationService,
    displaySetService
  } = servicesManager.services;
  const {
    viewportDisplaySets,
    backgroundDisplaySet,
    foregroundDisplaySets
  } = (0,useViewportDisplaySets/* useViewportDisplaySets */.N)(viewportId);
  const {
    colorbarPosition: position,
    opacity
  } = (0,useViewportRendering/* default */.A)(viewportId, {
    location
  });

  // Memoize the customization to prevent recomputation
  const colorbarCustomization = (0,react.useMemo)(() => {
    return customizationService.getCustomization('cornerstone.colorbar');
  }, [customizationService]);

  // Memoize tick position
  const tickPosition = (0,react.useMemo)(() => {
    const defaultTickPosition = colorbarCustomization?.colorbarTickPosition;
    return colorbarCustomization?.colorbarTickPosition || defaultTickPosition;
  }, [colorbarCustomization]);

  // Initial load of colorbars
  (0,react.useEffect)(() => {
    setColorbars(colorbarService.getViewportColorbar(viewportId) || []);
  }, [viewportId, colorbarService]);

  // Subscribe to colorbar state changes
  (0,react.useEffect)(() => {
    const {
      unsubscribe
    } = colorbarService.subscribe(colorbarService.EVENTS.STATE_CHANGED, event => {
      if (event.viewportId === viewportId) {
        setColorbars(colorbarService.getViewportColorbar(viewportId) || []);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [viewportId, colorbarService]);
  if (!colorbars.length) {
    return null;
  }
  const isSingleViewport = viewportDisplaySets.length === 1;
  const showFullList = isSingleViewport || !isHorizontal(position);
  const colorbarsToUse = showFullList ? colorbars : colorbars.filter(({
    displaySetInstanceUID
  }) => {
    const {
      displaySetInstanceUID: dsUID
    } = displaySetService.getDisplaySetByUID(displaySetInstanceUID) ?? {};
    const targetUID = opacity === 0 || opacity == null ? backgroundDisplaySet?.displaySetInstanceUID : foregroundDisplaySets[0].displaySetInstanceUID;
    return dsUID === targetUID;
  });
  return /*#__PURE__*/react.createElement("div", {
    style: {
      pointerEvents: 'auto'
    }
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex h-full flex-col items-center justify-center",
    style: {
      pointerEvents: 'auto'
    }
  }, colorbarsToUse.map(colorbarInfo => {
    const {
      colorbar,
      displaySetInstanceUID
    } = colorbarInfo;
    return /*#__PURE__*/react.createElement(ViewportColorbar_ViewportColorbar, {
      key: `colorbar-${viewportId}-${displaySetInstanceUID}`,
      viewportId: viewportId,
      displaySetInstanceUID: displaySetInstanceUID,
      colormaps: colorbar.colormaps,
      activeColormapName: colorbar.activeColormapName,
      volumeId: colorbar.volumeId,
      position: position,
      tickPosition: tickPosition,
      tickStyles: colorbarCustomization?.tickStyles,
      numColorbars: colorbars.length
    });
  })));
});
/* harmony default export */ const ViewportColorbar_ViewportColorbarsContainer = (ViewportColorbarsContainer);
;// ../../../extensions/cornerstone/src/components/ViewportColorbar/index.ts



/* harmony default export */ const components_ViewportColorbar = (ViewportColorbar_ViewportColorbarsContainer);
// EXTERNAL MODULE: ../../core/src/hooks/index.ts + 3 modules
var src_hooks = __webpack_require__(69419);
// EXTERNAL MODULE: ../../core/src/services/ToolBarService/ToolbarService.ts
var ToolbarService = __webpack_require__(93813);
;// ../../../extensions/cornerstone/src/components/AdvancedRenderingControls/AdvancedRenderingControls.tsx
function AdvancedRenderingControls_extends() { return AdvancedRenderingControls_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, AdvancedRenderingControls_extends.apply(null, arguments); }





const mouseNearControlsRanges = {
  [ToolbarService/* ButtonLocation */.ij.TopMiddle]: {
    minX: 0,
    minY: 0,
    maxX: 1,
    maxY: 0.1
  },
  [ToolbarService/* ButtonLocation */.ij.BottomMiddle]: {
    minX: 0,
    minY: 0.9,
    maxX: 1,
    maxY: 1
  },
  [ToolbarService/* ButtonLocation */.ij.LeftMiddle]: {
    minX: 0,
    minY: 0,
    maxX: 0.1,
    maxY: 1
  },
  [ToolbarService/* ButtonLocation */.ij.RightMiddle]: {
    minX: 0.9,
    minY: 0,
    maxX: 1,
    maxY: 1
  }
};
const getFlexDirectionClassName = location => location === ToolbarService/* ButtonLocation */.ij.LeftMiddle || location === ToolbarService/* ButtonLocation */.ij.RightMiddle ? 'flex-col' : 'flex-row';
function AdvancedRenderingControls({
  viewportId,
  location,
  buttonSection
}) {
  const {
    onInteraction,
    toolbarButtons,
    isItemOpen,
    isItemLocked,
    openItem,
    closeItem,
    toggleLock
  } = (0,src_hooks/* useToolbar */.tR)({
    buttonSection
  });
  const mousePosition = (0,src_hooks/* useViewportMousePosition */.Yk)(viewportId);
  const [isMouseNearControls, setIsMouseNearControls] = (0,react.useState)(false);
  const [showAllIcons, setShowAllIcons] = (0,react.useState)(true);
  const firstMountRef = (0,react.useRef)(true);
  const {
    hasColorbar
  } = (0,hooks/* useViewportRendering */.eH)(viewportId);
  const [isAnItemOpen, setIsAnItemOpen] = (0,react.useState)(false);
  (0,react.useEffect)(() => {
    if (firstMountRef.current) {
      firstMountRef.current = false;
      const timer = setTimeout(() => {
        setShowAllIcons(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);
  (0,react.useEffect)(() => {
    if (!showAllIcons && mousePosition.isInViewport) {
      const mouseHoverLocation = mouseNearControlsRanges[location];
      if (mousePosition.isWithinNormalizedBox(mouseHoverLocation)) {
        setIsMouseNearControls(true);
      } else {
        setIsMouseNearControls(false);
      }
    }
  }, [location, mousePosition, showAllIcons]);
  const handleOnItemOpen = (0,react.useCallback)((id, viewportId) => {
    openItem(id, viewportId);
    setIsAnItemOpen(true);
  }, [openItem, setIsAnItemOpen]);
  const handleOnItemClose = (0,react.useCallback)((id, viewportId) => {
    closeItem(id, viewportId);
    setIsAnItemOpen(false);
  }, [closeItem, setIsAnItemOpen]);
  if (!toolbarButtons?.length) {
    return null;
  }
  if (!hasColorbar) {
    return null;
  }
  return /*#__PURE__*/react.createElement("div", {
    className: classnames_default()('flex gap-2', getFlexDirectionClassName(location))
  }, toolbarButtons.map(toolDef => {
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
      onOpen: () => handleOnItemOpen(id, viewportId),
      onClose: () => handleOnItemClose(id, viewportId),
      onToggleLock: () => toggleLock(id, viewportId),
      viewportId
    };
    const tool = /*#__PURE__*/react.createElement(Component, AdvancedRenderingControls_extends({
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

    // Always show all icons on first mount for 3 seconds
    // After that, always show Colorbar, show others only when mouse is at bottom
    const shouldBeVisible = isAnItemOpen || showAllIcons || id === 'Colorbar' || isMouseNearControls;
    return /*#__PURE__*/react.createElement("div", {
      key: id,
      className: shouldBeVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
      style: {
        transition: 'opacity 0.2s ease-in-out'
      }
    }, tool);
  }));
}
/* harmony default export */ const AdvancedRenderingControls_AdvancedRenderingControls = (AdvancedRenderingControls);
;// ../../../extensions/cornerstone/src/components/AdvancedRenderingControls/index.ts

;// ../../../extensions/cornerstone/src/getToolbarModule.tsx













const getDisabledState = disabledText => ({
  disabled: true,
  disabledText: disabledText ?? 'Not available on the current viewport'
});
function getToolbarModule({
  servicesManager,
  extensionManager
}) {
  const {
    toolGroupService,
    toolbarService,
    syncGroupService,
    cornerstoneViewportService,
    colorbarService,
    displaySetService,
    viewportGridService,
    segmentationService
  } = servicesManager.services;
  return [{
    name: 'ohif.advancedRenderingControls',
    defaultComponent: AdvancedRenderingControls_AdvancedRenderingControls
  }, {
    name: 'evaluate.advancedRenderingControls',
    evaluate: ({
      viewportId
    }) => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (!viewport) {
        return {
          disabled: true
        };
      }
      const hasColorbar = colorbarService?.hasColorbar(viewportId) || false;
      return {
        disabled: !hasColorbar
      };
    }
  }, {
    name: 'ohif.colorbar',
    defaultComponent: components_ViewportColorbar
  }, {
    name: 'ohif.trackingStatus',
    defaultComponent: TrackingStatus_TrackingStatus
  }, {
    name: 'evaluate.trackingStatus',
    evaluate: ({
      viewportId
    }) => {
      const displaySetUIDs = viewportGridService.getDisplaySetsUIDsForViewport(viewportId);
      if (!displaySetUIDs?.length) {
        return {
          disabled: true
        };
      }
      return {
        disabled: false
      };
    }
  },
  // ModalityLoadBadge
  {
    name: 'ohif.modalityLoadBadge',
    defaultComponent: ModalityLoadBadge_ModalityLoadBadge
  }, {
    name: 'evaluate.modalityLoadBadge',
    evaluate: ({
      viewportId
    }) => {
      // We can't use useViewportDisplaySets hook here since we're in a non-React context,
      // but we'll follow the same pattern by getting only the display sets for this viewport
      const displaySetUIDs = viewportGridService.getDisplaySetsUIDsForViewport(viewportId);
      if (!displaySetUIDs?.length) {
        return {
          disabled: true
        };
      }

      // Get the display sets that are specifically in this viewport
      const viewportDisplaySets = displaySetUIDs.map(uid => displaySetService.getDisplaySetByUID(uid));

      // Only show status for supported types like SR, SEG, RTSTRUCT
      const isSupportedType = viewportDisplaySets.some(displaySet => displaySet?.Modality === 'SR' || displaySet?.Modality === 'SEG' || displaySet?.Modality === 'RTSTRUCT');
      return {
        disabled: !isSupportedType
      };
    }
  },
  // NavigationComponent
  {
    name: 'ohif.navigationComponent',
    defaultComponent: NavigationComponent_NavigationComponent
  }, {
    name: 'evaluate.navigationComponent',
    evaluate: ({
      viewportId
    }) => {
      const {
        trackedMeasurementsService
      } = servicesManager.services;
      // Same logic as statusComponent - only show for SR, SEG, RTSTRUCT
      const displaySetUIDs = viewportGridService.getDisplaySetsUIDsForViewport(viewportId);
      if (!displaySetUIDs?.length) {
        return {
          disabled: true
        };
      }

      // Get the display sets that are specifically in this viewport
      const viewportDisplaySets = displaySetUIDs.map(uid => displaySetService.getDisplaySetByUID(uid));

      // Check if there's a need for navigation:
      // 1. Segmentations are present (for SEG/RTSTRUCT navigation)
      // 2. There are tracked measurements in the viewport (for SR navigation)

      // Check for SEG/RTSTRUCT navigation
      const hasSegmentation = segmentationService.getSegmentationRepresentations(viewportId).length > 0;
      if (!trackedMeasurementsService) {
        return {
          disabled: !hasSegmentation
        };
      }

      // Check if any of the viewport's series are being tracked
      const hasTrackedInViewport = viewportDisplaySets.some(displaySet => displaySet?.SeriesInstanceUID && trackedMeasurementsService.isSeriesTracked(displaySet.SeriesInstanceUID));
      const isSRDisplaySet = viewportDisplaySets.some(displaySet => displaySet?.Modality === 'SR');

      // Enable navigation if:
      // - There's a segmentation to navigate (SEG/RTSTRUCT)
      // - OR there are tracked measurements in the viewport (SR/etc.)
      const needsNavigation = hasSegmentation || hasTrackedInViewport || isSRDisplaySet;
      return {
        disabled: !needsNavigation
      };
    }
  }, {
    name: 'ohif.dataOverlayMenu',
    defaultComponent: ViewportDataOverlayMenuWrapper
  }, {
    name: 'evaluate.dataOverlayMenu',
    evaluate: ({
      viewportId
    }) => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (!viewport) {
        return {
          disabled: true
        };
      }

      // Example: Show data overlay menu only for certain modalities
      const displaySetUIDs = viewportGridService.getDisplaySetsUIDsForViewport(viewportId);
      if (!displaySetUIDs?.length) {
        return {
          disabled: true
        };
      }
      return {
        disabled: false
      };
    }
  }, {
    name: 'ohif.orientationMenu',
    defaultComponent: ViewportOrientationMenuWrapper
  }, {
    name: 'evaluate.orientationMenu',
    evaluate: ({
      viewportId
    }) => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (!viewport) {
        return {
          disabled: true
        };
      }

      // Only show orientation menu for 3D capable viewports
      const displaySetUIDs = viewportGridService.getDisplaySetsUIDsForViewport(viewportId);
      const displaySets = displaySetUIDs.map(displaySetService.getDisplaySetByUID);
      const isNotReconstructable = displaySets.some(displaySet => !displaySet?.isReconstructable);
      const disabled = isNotReconstructable;
      return {
        disabled
      };
    }
  }, {
    name: 'ohif.windowLevelMenu',
    defaultComponent: WindowLevelActionMenuWrapper
  }, {
    name: 'ohif.voiManualControlMenu',
    defaultComponent: VOIManualControlMenuWrapper
  }, {
    name: 'ohif.windowLevelMenuEmbedded',
    defaultComponent: WindowLevelActionMenuWrapper
  }, {
    name: 'evaluate.windowLevelMenuEmbedded',
    evaluate: () => {
      return {
        isEmbedded: true
      };
    }
  }, {
    name: 'ohif.thresholdMenu',
    defaultComponent: ThresholdMenuWrapper
  }, {
    name: 'ohif.opacityMenu',
    defaultComponent: OpacityMenuWrapper
  }, {
    name: 'evaluate.windowLevelMenu',
    evaluate: ({
      viewportId
    }) => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (!viewport) {
        return {
          disabled: true
        };
      }
      const displaySetUIDs = viewportGridService.getDisplaySetsUIDsForViewport(viewportId);
      const displaySets = displaySetUIDs.map(displaySetService.getDisplaySetByUID);
      const supportWindowLevel = displaySets.some(displaySet => displaySet?.supportsWindowLevel);
      const isInAnySection = toolbarService.isInAnySection('windowLevelMenuEmbedded');
      return {
        disabled: !supportWindowLevel,
        hasEmbeddedVariantToUse: !!isInAnySection
      };
    }
  }, {
    name: 'evaluate.voiManualControlMenu',
    evaluate: ({
      viewportId
    }) => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (!viewport) {
        return {
          disabled: true
        };
      }
      const displaySetUIDs = viewportGridService.getDisplaySetsUIDsForViewport(viewportId);
      const displaySets = displaySetUIDs.map(displaySetService.getDisplaySetByUID);
      const supportWindowLevel = displaySets.some(displaySet => displaySet?.supportsWindowLevel);
      return {
        disabled: !supportWindowLevel
      };
    }
  }, {
    name: 'evaluate.thresholdMenu',
    evaluate: ({
      viewportId
    }) => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (!viewport) {
        return {
          disabled: true
        };
      }
      if (viewport.type !== 'orthographic') {
        return {
          disabled: true
        };
      }
      const displaySetUIDs = viewportGridService.getDisplaySetsUIDsForViewport(viewportId);
      if (!displaySetUIDs.length) {
        return {
          disabled: true
        };
      }
      return {
        disabled: false
      };
    }
  }, {
    name: 'evaluate.opacityMenu',
    evaluate: ({
      viewportId
    }) => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (!viewport || viewport.type !== 'orthographic') {
        return {
          disabled: true
        };
      }
      const displaySetUIDs = viewportGridService.getDisplaySetsUIDsForViewport(viewportId);
      if (displaySetUIDs.length <= 1) {
        return {
          disabled: true
        };
      }
      const displaySets = displaySetUIDs.map(displaySetService.getDisplaySetByUID);
      const hasOverlayable = displaySets.some(displaySet => displaySet?.isOverlayDisplaySet);
      return {
        disabled: hasOverlayable
      };
    }
  },
  // functions/helpers to be used by the toolbar buttons to decide if they should
  // enabled or not
  {
    name: 'evaluate.viewport.supported',
    evaluate: ({
      viewportId,
      unsupportedViewportTypes,
      disabledText
    }) => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (viewport && unsupportedViewportTypes?.includes(viewport.type)) {
        return getDisabledState(disabledText);
      }
      return undefined;
    }
  }, {
    name: 'evaluate.modality.supported',
    evaluate: ({
      viewportId,
      unsupportedModalities,
      supportedModalities,
      disabledText
    }) => {
      const displaySetUIDs = viewportGridService.getDisplaySetsUIDsForViewport(viewportId);
      if (!displaySetUIDs?.length) {
        return;
      }
      const displaySets = displaySetUIDs.map(displaySetService.getDisplaySetByUID);

      // Check for unsupported modalities (exclusion)
      if (unsupportedModalities?.length) {
        const hasUnsupportedModality = displaySets.some(displaySet => unsupportedModalities.includes(displaySet?.Modality));
        if (hasUnsupportedModality) {
          return getDisabledState(disabledText);
        }
      }

      // Check for supported modalities (inclusion)
      if (supportedModalities?.length) {
        const hasAnySupportedModality = displaySets.some(displaySet => supportedModalities.includes(displaySet?.Modality));
        if (!hasAnySupportedModality) {
          return getDisabledState(disabledText || 'Tool not available for this modality');
        }
      }
    }
  }, {
    name: 'evaluate.cornerstoneTool',
    evaluate: ({
      viewportId,
      button,
      toolNames,
      disabledText
    }) => {
      const toolGroup = toolGroupService.getToolGroupForViewport(viewportId);
      if (!toolGroup) {
        return;
      }
      const toolName = toolbarService.getToolNameForButton(button);
      if (!toolGroup || !toolGroup.hasTool(toolName) && !toolNames) {
        return getDisabledState(disabledText);
      }
      const isPrimaryActive = toolNames ? toolNames.includes(toolGroup.getActivePrimaryMouseButtonTool()) : toolGroup.getActivePrimaryMouseButtonTool() === toolName;
      return {
        disabled: false,
        isActive: isPrimaryActive
      };
    }
  }, {
    name: 'evaluate.action',
    evaluate: () => {
      return {
        disabled: false
      };
    }
  }, {
    name: 'evaluate.cornerstoneTool.toggle.ifStrictlyDisabled',
    evaluate: ({
      viewportId,
      button,
      disabledText
    }) => _evaluateToggle({
      viewportId,
      button,
      toolbarService,
      disabledText,
      offModes: [dist_esm.Enums.ToolModes.Disabled],
      toolGroupService
    })
  }, {
    name: 'evaluate.cornerstoneTool.toggle',
    evaluate: ({
      viewportId,
      button,
      disabledText
    }) => _evaluateToggle({
      viewportId,
      button,
      toolbarService,
      disabledText,
      offModes: [dist_esm.Enums.ToolModes.Disabled, dist_esm.Enums.ToolModes.Passive],
      toolGroupService
    })
  }, {
    name: 'evaluate.cornerstone.synchronizer',
    evaluate: ({
      viewportId,
      button
    }) => {
      let synchronizers = syncGroupService.getSynchronizersForViewport(viewportId);
      if (!synchronizers?.length || synchronizers.length <= 1) {
        return {
          className: ui_next_src/* utils.getToggledClassName */.WpD.getToggledClassName(false)
        };
      }
      const isArray = Array.isArray(button.props?.commands);
      const synchronizerType = isArray ? button.props?.commands?.[0].commandOptions.type : button.props?.commands?.commandOptions.type;
      synchronizers = syncGroupService.getSynchronizersOfType(synchronizerType);
      if (!synchronizers?.length) {
        return {
          className: ui_next_src/* utils.getToggledClassName */.WpD.getToggledClassName(false)
        };
      }

      // Todo: we need a better way to find the synchronizers based on their
      // type, but for now we just check the first one and see if it is
      // enabled
      const synchronizer = synchronizers[0];
      const isEnabled = synchronizer?._enabled;
      return {
        className: ui_next_src/* utils.getToggledClassName */.WpD.getToggledClassName(isEnabled)
      };
    }
  }, {
    name: 'evaluate.viewportProperties.toggle',
    evaluate: ({
      viewportId,
      button
    }) => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (!viewport || viewport.isDisabled) {
        return;
      }
      const propId = button.id;
      const properties = viewport.getProperties();
      const camera = viewport.getCamera();
      const prop = camera?.[propId] || properties?.[propId];
      if (!prop) {
        return {
          disabled: false
        };
      }
      const isToggled = prop;
      return {
        className: ui_next_src/* utils.getToggledClassName */.WpD.getToggledClassName(isToggled)
      };
    }
  }, {
    name: 'evaluate.displaySetIsReconstructable',
    evaluate: ({
      viewportId,
      disabledText = 'Selected viewport is not reconstructable'
    }) => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (!viewport) {
        return;
      }
      const displaySetUIDs = viewportGridService.getDisplaySetsUIDsForViewport(viewportId);
      const displaySets = displaySetUIDs.map(displaySetService.getDisplaySetByUID);
      const areReconstructable = displaySets.every(displaySet => {
        return displaySet?.isReconstructable;
      });
      if (!areReconstructable) {
        return getDisabledState(disabledText);
      }
      return {
        disabled: false
      };
    }
  }];
}
function _evaluateToggle({
  viewportId,
  toolbarService,
  button,
  disabledText,
  offModes,
  toolGroupService
}) {
  const toolGroup = toolGroupService.getToolGroupForViewport(viewportId);
  if (!toolGroup) {
    return;
  }
  const toolName = toolbarService.getToolNameForButton(button);
  if (!toolGroup?.hasTool(toolName)) {
    return getDisabledState(disabledText);
  }
  const isOff = offModes.includes(toolGroup.getToolOptions(toolName).mode);
  return {
    className: ui_next_src/* utils.getToggledClassName */.WpD.getToggledClassName(!isOff)
  };
}
;// ../../../extensions/cornerstone/src/services/ToolGroupService/ToolGroupService.ts
var _ToolGroupService;




const ToolGroupService_EVENTS = {
  VIEWPORT_ADDED: 'event::cornerstone::toolgroupservice:viewportadded',
  TOOLGROUP_CREATED: 'event::cornerstone::toolgroupservice:toolgroupcreated',
  TOOL_ACTIVATED: 'event::cornerstone::toolgroupservice:toolactivated',
  PRIMARY_TOOL_ACTIVATED: 'event::cornerstone::toolgroupservice:primarytoolactivated'
};
class ToolGroupService {
  constructor(servicesManager) {
    this.servicesManager = void 0;
    this.cornerstoneViewportService = void 0;
    this.viewportGridService = void 0;
    this.uiNotificationService = void 0;
    this.toolGroupIds = new Set();
    /**
     * Service-specific
     */
    this.listeners = void 0;
    this.EVENTS = void 0;
    this._onToolActivated = evt => {
      const {
        toolGroupId,
        toolName,
        toolBindingsOptions
      } = evt.detail;
      const isPrimaryTool = toolBindingsOptions.bindings?.some(binding => binding.mouseButton === dist_esm.Enums.MouseBindings.Primary);
      const callbackProps = {
        toolGroupId,
        toolName,
        toolBindingsOptions
      };
      this._broadcastEvent(ToolGroupService_EVENTS.TOOL_ACTIVATED, callbackProps);
      if (isPrimaryTool) {
        this._broadcastEvent(ToolGroupService_EVENTS.PRIMARY_TOOL_ACTIVATED, callbackProps);
      }
    };
    const {
      cornerstoneViewportService,
      viewportGridService,
      uiNotificationService
    } = servicesManager.services;
    this.cornerstoneViewportService = cornerstoneViewportService;
    this.viewportGridService = viewportGridService;
    this.uiNotificationService = uiNotificationService;
    this.listeners = {};
    this.EVENTS = ToolGroupService_EVENTS;
    Object.assign(this, src.pubSubServiceInterface);
    this._init();
  }
  onModeExit() {
    this.destroy();
  }
  _init() {
    esm.eventTarget.addEventListener(dist_esm.Enums.Events.TOOL_ACTIVATED, this._onToolActivated);
  }

  /**
   * Retrieves a tool group from the ToolGroupManager by tool group ID.
   * If no tool group ID is provided, it retrieves the tool group of the active viewport.
   * @param toolGroupId - Optional ID of the tool group to retrieve.
   * @returns The tool group or undefined if it is not found.
   */
  getToolGroup(toolGroupId) {
    let toolGroupIdToUse = toolGroupId;
    if (!toolGroupIdToUse) {
      // Use the active viewport's tool group if no tool group id is provided
      const enabledElement = getActiveViewportEnabledElement(this.viewportGridService);
      if (!enabledElement) {
        return;
      }
      const {
        renderingEngineId,
        viewportId
      } = enabledElement;
      const toolGroup = dist_esm.ToolGroupManager.getToolGroupForViewport(viewportId, renderingEngineId);
      if (!toolGroup) {
        console.warn('No tool group found for viewportId:', viewportId, 'and renderingEngineId:', renderingEngineId);
        return;
      }
      toolGroupIdToUse = toolGroup.id;
    }
    const toolGroup = dist_esm.ToolGroupManager.getToolGroup(toolGroupIdToUse);
    return toolGroup;
  }
  getToolGroupIds() {
    return Array.from(this.toolGroupIds);
  }
  getToolGroupForViewport(viewportId) {
    const renderingEngine = this.cornerstoneViewportService.getRenderingEngine();
    return dist_esm.ToolGroupManager.getToolGroupForViewport(viewportId, renderingEngine.id);
  }
  getActiveToolForViewport(viewportId) {
    const toolGroup = this.getToolGroupForViewport(viewportId);
    if (!toolGroup) {
      return;
    }
    return toolGroup.getActivePrimaryMouseButtonTool();
  }
  destroy() {
    dist_esm.ToolGroupManager.destroy();
    this.toolGroupIds = new Set();
    esm.eventTarget.removeEventListener(dist_esm.Enums.Events.TOOL_ACTIVATED, this._onToolActivated);
  }
  destroyToolGroup(toolGroupId) {
    dist_esm.ToolGroupManager.destroyToolGroup(toolGroupId);
    this.toolGroupIds.delete(toolGroupId);
  }
  removeViewportFromToolGroup(viewportId, renderingEngineId, deleteToolGroupIfEmpty) {
    const toolGroup = dist_esm.ToolGroupManager.getToolGroupForViewport(viewportId, renderingEngineId);
    if (!toolGroup) {
      return;
    }
    toolGroup.removeViewports(renderingEngineId, viewportId);
    const viewportIds = toolGroup.getViewportIds();
    if (viewportIds.length === 0 && deleteToolGroupIfEmpty) {
      dist_esm.ToolGroupManager.destroyToolGroup(toolGroup.id);
    }
  }
  addViewportToToolGroup(viewportId, renderingEngineId, toolGroupId) {
    if (!toolGroupId) {
      // If toolGroupId is not provided, add the viewport to all toolGroups
      const toolGroups = dist_esm.ToolGroupManager.getAllToolGroups();
      toolGroups.forEach(toolGroup => {
        toolGroup.addViewport(viewportId, renderingEngineId);
      });
    } else {
      let toolGroup = dist_esm.ToolGroupManager.getToolGroup(toolGroupId);
      if (!toolGroup) {
        toolGroup = this.createToolGroup(toolGroupId);
      }
      toolGroup.addViewport(viewportId, renderingEngineId);
    }
    this._broadcastEvent(ToolGroupService_EVENTS.VIEWPORT_ADDED, {
      viewportId,
      toolGroupId
    });
  }
  createToolGroup(toolGroupId) {
    if (this.getToolGroup(toolGroupId)) {
      throw new Error(`ToolGroup ${toolGroupId} already exists`);
    }

    // if the toolGroup doesn't exist, create it
    const toolGroup = dist_esm.ToolGroupManager.createToolGroup(toolGroupId);
    this.toolGroupIds.add(toolGroupId);
    this._broadcastEvent(ToolGroupService_EVENTS.TOOLGROUP_CREATED, {
      toolGroupId
    });
    return toolGroup;
  }
  addToolsToToolGroup(toolGroupId, tools, configs = {}) {
    const toolGroup = dist_esm.ToolGroupManager.getToolGroup(toolGroupId);
    // this.changeConfigurationIfNecessary(toolGroup, volumeId);
    this._addTools(toolGroup, tools, configs);
    this._setToolsMode(toolGroup, tools);
  }
  createToolGroupAndAddTools(toolGroupId, tools) {
    const toolGroup = this.createToolGroup(toolGroupId);
    this.addToolsToToolGroup(toolGroupId, tools);
    return toolGroup;
  }
  /**
   * Get the tool's configuration based on the tool name and tool group id
   * @param toolGroupId - The id of the tool group that the tool instance belongs to.
   * @param toolName - The name of the tool
   * @returns The configuration of the tool.
   */
  getToolConfiguration(toolGroupId, toolName) {
    const toolGroup = dist_esm.ToolGroupManager.getToolGroup(toolGroupId);
    if (!toolGroup) {
      return null;
    }
    const tool = toolGroup.getToolInstance(toolName);
    if (!tool) {
      return null;
    }
    return tool.configuration;
  }

  /**
   * Set the tool instance configuration. This will update the tool instance configuration
   * on the toolGroup
   * @param toolGroupId - The id of the tool group that the tool instance belongs to.
   * @param toolName - The name of the tool
   * @param config - The configuration object that you want to set.
   */
  setToolConfiguration(toolGroupId, toolName, config) {
    const toolGroup = dist_esm.ToolGroupManager.getToolGroup(toolGroupId);
    const toolInstance = toolGroup.getToolInstance(toolName);
    toolInstance.configuration = config;
  }
  getActivePrimaryMouseButtonTool(toolGroupId) {
    return this.getToolGroup(toolGroupId)?.getActivePrimaryMouseButtonTool();
  }
  _setToolsMode(toolGroup, tools) {
    const {
      active,
      passive,
      enabled,
      disabled
    } = tools;
    if (active) {
      active.forEach(({
        toolName,
        bindings
      }) => {
        toolGroup.setToolActive(toolName, {
          bindings
        });
      });
    }
    if (passive) {
      passive.forEach(({
        toolName
      }) => {
        toolGroup.setToolPassive(toolName);
      });
    }
    if (enabled) {
      enabled.forEach(({
        toolName
      }) => {
        toolGroup.setToolEnabled(toolName);
      });
    }
    if (disabled) {
      disabled.forEach(({
        toolName
      }) => {
        toolGroup.setToolDisabled(toolName);
      });
    }
  }
  _addTools(toolGroup, tools) {
    const addTools = tools => {
      tools.forEach(({
        toolName,
        parentTool,
        configuration
      }) => {
        if (parentTool) {
          toolGroup.addToolInstance(toolName, parentTool, {
            ...configuration
          });
        } else {
          toolGroup.addTool(toolName, {
            ...configuration
          });
        }
      });
    };
    if (tools.active) {
      addTools(tools.active);
    }
    if (tools.passive) {
      addTools(tools.passive);
    }
    if (tools.enabled) {
      addTools(tools.enabled);
    }
    if (tools.disabled) {
      addTools(tools.disabled);
    }
  }
}
_ToolGroupService = ToolGroupService;
ToolGroupService.REGISTRATION = {
  name: 'toolGroupService',
  altName: 'ToolGroupService',
  create: ({
    servicesManager
  }) => {
    return new _ToolGroupService(servicesManager);
  }
};
;// ../../../extensions/cornerstone/src/services/ToolGroupService/index.js

/* harmony default export */ const services_ToolGroupService = (ToolGroupService);
;// ../../../extensions/cornerstone/src/services/SyncGroupService/createHydrateSegmentationSynchronizer.ts


const {
  createSynchronizer
} = dist_esm.SynchronizerManager;
const {
  SEGMENTATION_REPRESENTATION_MODIFIED
} = dist_esm.Enums.Events;
const {
  BlendModes
} = esm.Enums;
function createHydrateSegmentationSynchronizer(synchronizerName, {
  servicesManager,
  ...options
}) {
  const stackImageSynchronizer = createSynchronizer(synchronizerName, SEGMENTATION_REPRESENTATION_MODIFIED, (synchronizerInstance, sourceViewport, targetViewport, sourceEvent) => {
    return segmentationRepresentationModifiedCallback(synchronizerInstance, sourceViewport, targetViewport, sourceEvent, {
      servicesManager,
      options
    });
  }, {
    eventSource: 'eventTarget'
  });
  return stackImageSynchronizer;
}
const segmentationRepresentationModifiedCallback = async (synchronizerInstance, sourceViewport, targetViewport, sourceEvent, {
  servicesManager,
  options
}) => {
  const event = sourceEvent;
  const {
    segmentationId
  } = event.detail;
  const {
    segmentationService
  } = servicesManager.services;
  const targetViewportId = targetViewport.viewportId;
  const {
    viewport
  } = (0,esm.getEnabledElementByViewportId)(targetViewportId);
  const targetFrameOfReferenceUID = viewport.getFrameOfReferenceUID();
  if (!targetFrameOfReferenceUID) {
    return;
  }
  const targetViewportRepresentation = segmentationService.getSegmentationRepresentations(targetViewportId, {
    segmentationId
  });
  if (targetViewportRepresentation.length > 0) {
    return;
  }

  // whatever type the source viewport has, we need to add that to the target viewport
  const sourceViewportRepresentation = segmentationService.getSegmentationRepresentations(sourceViewport.viewportId, {
    segmentationId
  });
  const type = sourceViewportRepresentation[0].type;
  await segmentationService.addSegmentationRepresentation(targetViewportId, {
    segmentationId,
    type,
    config: {
      blendMode: viewport.getBlendMode() === 1 ? BlendModes.LABELMAP_EDGE_PROJECTION_BLEND : undefined
    }
  });
};
;// ../../../extensions/cornerstone/src/services/SyncGroupService/SyncGroupService.ts
var _SyncGroupService;




const SyncGroupService_EVENTS = {
  TOOL_GROUP_CREATED: 'event::cornerstone::syncgroupservice:toolgroupcreated'
};

/**
 * @params options - are an optional set of options associated with the first
 * sync group declared.
 */

const POSITION = 'cameraposition';
const VOI = 'voi';
const ZOOMPAN = 'zoompan';
const STACKIMAGE = 'stackimage';
const IMAGE_SLICE = 'imageslice';
const HYDRATE_SEG = 'hydrateseg';
const asSyncGroup = syncGroup => typeof syncGroup === 'string' ? {
  type: syncGroup
} : syncGroup;
class SyncGroupService {
  constructor(servicesManager) {
    this.servicesManager = void 0;
    this.listeners = {};
    this.EVENTS = void 0;
    this.synchronizerCreators = {
      [POSITION]: dist_esm.synchronizers.createCameraPositionSynchronizer,
      [VOI]: dist_esm.synchronizers.createVOISynchronizer,
      [ZOOMPAN]: dist_esm.synchronizers.createZoomPanSynchronizer,
      // todo: remove stack image since it is legacy now and the image_slice
      // handles both stack and volume viewports
      [STACKIMAGE]: dist_esm.synchronizers.createImageSliceSynchronizer,
      [IMAGE_SLICE]: dist_esm.synchronizers.createImageSliceSynchronizer,
      [HYDRATE_SEG]: createHydrateSegmentationSynchronizer
    };
    this.synchronizersByType = {};
    this.servicesManager = servicesManager;
    this.listeners = {};
    this.EVENTS = SyncGroupService_EVENTS;
    //
    Object.assign(this, src.pubSubServiceInterface);
  }
  _createSynchronizer(type, id, options) {
    // Initialize if not already done
    this.synchronizersByType[type] = this.synchronizersByType[type] || [];
    const syncCreator = this.synchronizerCreators[type.toLowerCase()];
    if (syncCreator) {
      // Pass the servicesManager along with other parameters
      const synchronizer = syncCreator(id, {
        ...options,
        servicesManager: this.servicesManager
      });
      if (synchronizer) {
        this.synchronizersByType[type].push(synchronizer);
        return synchronizer;
      }
    } else {
      console.debug(`Unknown synchronizer type: ${type}, id: ${id}`);
    }
  }
  getSyncCreatorForType(type) {
    return this.synchronizerCreators[type.toLowerCase()];
  }

  /**
   * Creates a synchronizer type.
   * @param type is the type of the synchronizer to create
   * @param creator
   */
  addSynchronizerType(type, creator) {
    this.synchronizerCreators[type.toLowerCase()] = creator;
  }
  getSynchronizer(id) {
    return dist_esm.SynchronizerManager.getSynchronizer(id);
  }

  /**
   * Registers a custom synchronizer.
   * @param id - The id of the synchronizer.
   * @param createFunction - The function that creates the synchronizer.
   */
  registerCustomSynchronizer(id, createFunction) {
    this.synchronizerCreators[id] = createFunction;
  }

  /**
   * Retrieves an array of synchronizers of a specific type.
   * @param type - The type of synchronizers to retrieve.
   * @returns An array of synchronizers of the specified type.
   */
  getSynchronizersOfType(type) {
    return this.synchronizersByType[type];
  }
  _getOrCreateSynchronizer(type, id, options) {
    let synchronizer = dist_esm.SynchronizerManager.getSynchronizer(id);
    if (!synchronizer) {
      synchronizer = this._createSynchronizer(type, id, options);
    }
    return synchronizer;
  }
  addViewportToSyncGroup(viewportId, renderingEngineId, syncGroups) {
    if (!syncGroups) {
      return;
    }
    const syncGroupsArray = Array.isArray(syncGroups) ? syncGroups : [syncGroups];
    syncGroupsArray.forEach(syncGroup => {
      const syncGroupObj = asSyncGroup(syncGroup);
      const {
        type,
        target = true,
        source = true,
        options = {},
        id = type
      } = syncGroupObj;
      const synchronizer = this._getOrCreateSynchronizer(type, id, options);
      if (!synchronizer) {
        return;
      }
      synchronizer.setOptions(viewportId, options);
      const viewportInfo = {
        viewportId,
        renderingEngineId
      };
      if (target && source) {
        synchronizer.add(viewportInfo);
        return;
      } else if (source) {
        synchronizer.addSource(viewportInfo);
      } else if (target) {
        synchronizer.addTarget(viewportInfo);
      }
    });
  }
  destroy() {
    dist_esm.SynchronizerManager.destroy();
  }
  getSynchronizersForViewport(viewportId) {
    const renderingEngine = (0,esm.getRenderingEngines)().find(re => {
      return re.getViewports().find(vp => vp.id === viewportId);
    }) || (0,esm.getRenderingEngines)()[0];
    const synchronizers = dist_esm.SynchronizerManager.getAllSynchronizers();
    return synchronizers.filter(s => s.hasSourceViewport(renderingEngine.id, viewportId) || s.hasTargetViewport(renderingEngine.id, viewportId));
  }
  removeViewportFromSyncGroup(viewportId, renderingEngineId, syncGroupId) {
    const synchronizers = dist_esm.SynchronizerManager.getAllSynchronizers();
    const filteredSynchronizers = syncGroupId ? synchronizers.filter(s => s.id === syncGroupId) : synchronizers;
    filteredSynchronizers.forEach(synchronizer => {
      if (!synchronizer) {
        return;
      }

      // Only image slice synchronizer register spatial registration
      if (this.isImageSliceSyncronizer(synchronizer)) {
        this.unRegisterSpatialRegistration(synchronizer);
      }
      synchronizer.remove({
        viewportId,
        renderingEngineId
      });

      // check if any viewport is left in any of the sync groups, if not, delete that sync group
      const sourceViewports = synchronizer.getSourceViewports();
      const targetViewports = synchronizer.getTargetViewports();
      if (!sourceViewports.length && !targetViewports.length) {
        dist_esm.SynchronizerManager.destroySynchronizer(synchronizer.id);
      }
    });
  }
  /**
   * Clean up the spatial registration metadata created by synchronizer
   * This is needed to be able to re-sync images slices if needed
   * @param synchronizer
   */
  unRegisterSpatialRegistration(synchronizer) {
    const sourceViewports = synchronizer.getSourceViewports().map(vp => vp.viewportId);
    const targetViewports = synchronizer.getTargetViewports().map(vp => vp.viewportId);

    // Create an array of pair of viewports to remove from spatialRegistrationMetadataProvider
    // All sourceViewports combined with all targetViewports
    const toUnregister = sourceViewports.map(sourceViewportId => {
      return targetViewports.map(targetViewportId => [targetViewportId, sourceViewportId]);
    }).reduce((acc, c) => acc.concat(c), []);
    toUnregister.forEach(viewportIdPair => {
      esm.utilities.spatialRegistrationMetadataProvider.add(viewportIdPair, undefined);
    });
  }
  /**
   * Check if the synchronizer type is IMAGE_SLICE
   * Need to convert to lowercase here because the types are lowercase
   * e.g: synchronizerCreators
   * @param synchronizer
   */
  isImageSliceSyncronizer(synchronizer) {
    return this.getSynchronizerType(synchronizer).toLowerCase() === IMAGE_SLICE;
  }
  /**
   * Returns the syncronizer type
   * @param synchronizer
   */
  getSynchronizerType(synchronizer) {
    const synchronizerTypes = Object.keys(this.synchronizersByType);
    const syncType = synchronizerTypes.find(syncType => this.getSynchronizersOfType(syncType).includes(synchronizer));
    return syncType;
  }
}
_SyncGroupService = SyncGroupService;
SyncGroupService.REGISTRATION = {
  name: 'syncGroupService',
  altName: 'SyncGroupService',
  create: ({
    servicesManager
  }) => {
    return new _SyncGroupService(servicesManager);
  }
};
;// ../../../extensions/cornerstone/src/services/SyncGroupService/index.js

/* harmony default export */ const services_SyncGroupService = (SyncGroupService);
;// ../../../extensions/cornerstone/src/utils/transitions.ts
/**
 * It is a bell curved function that uses ease in out quadratic for css
 * transition timing function for each side of the curve.
 *
 * @param {number} x - The current time, in the range [0, 1].
 * @param {number} baseline - The baseline value to start from and return to.
 * @returns the value of the transition at time x.
 */
function easeInOutBell(x, baseline) {
  const alpha = 1 - baseline;

  // prettier-ignore
  if (x < 1 / 4) {
    return 4 * Math.pow(2 * x, 3) * alpha + baseline;
  } else if (x < 1 / 2) {
    return (1 - Math.pow(-4 * x + 2, 3) / 2) * alpha + baseline;
  } else if (x < 3 / 4) {
    return (1 - Math.pow(4 * x - 2, 3) / 2) * alpha + baseline;
  } else {
    return -4 * Math.pow(2 * x - 2, 3) * alpha + baseline;
  }
}

/**
 * A reversed bell curved function that starts from 1 and goes to baseline and
 * come back to 1 again. It uses ease in out quadratic for css transition
 * timing function for each side of the curve.
 *
 * @param {number} x - The current time, in the range [0, 1].
 * @param {number} baseline - The baseline value to start from and return to.
 * @returns the value of the transition at time x.
 */
function reverseEaseInOutBell(x, baseline) {
  const y = easeInOutBell(x, baseline);
  return -y + 1 + baseline;
}
function easeInOutBellRelative(x, baseline, prevOutlineWidth) {
  const range = baseline - prevOutlineWidth;
  if (x < 1 / 4) {
    return prevOutlineWidth + 4 * Math.pow(2 * x, 3) * range;
  } else if (x < 1 / 2) {
    return prevOutlineWidth + (1 - Math.pow(-4 * x + 2, 3) / 2) * range;
  } else if (x < 3 / 4) {
    return prevOutlineWidth + (1 - Math.pow(4 * x - 2, 3) / 2) * range;
  } else {
    return prevOutlineWidth + -4 * Math.pow(2 * x - 2, 3) * range;
  }
}
function reverseEaseInOutBellRelative(x, baseline, prevOutlineWidth) {
  const y = easeInOutBellRelative(x, baseline, prevOutlineWidth);
  return y;
}
;// ../../../extensions/cornerstone/src/services/SegmentationService/RTSTRUCT/mapROIContoursToRTStructData.ts
/**
 * Maps a DICOM RT Struct ROI Contour to a RTStruct data that can be used
 * in Segmentation Service
 *
 * @param structureSet - A DICOM RT Struct ROI Contour
 * @param rtDisplaySetUID - A CornerstoneTools DisplaySet UID
 * @returns An array of object that includes data, id, segmentIndex, color
 * and geometry Id
 */
function mapROIContoursToRTStructData(structureSet, rtDisplaySetUID) {
  return structureSet.ROIContours.map(({
    contourPoints,
    ROINumber,
    ROIName,
    colorArray,
    ROIGroup
  }) => {
    const data = contourPoints.map(({
      points,
      ...rest
    }) => {
      const newPoints = points.map(({
        x,
        y,
        z
      }) => {
        return [x, y, z];
      });
      return {
        ...rest,
        points: newPoints
      };
    });
    const id = ROIName || ROINumber;
    return {
      data,
      id,
      segmentIndex: ROINumber,
      color: colorArray,
      group: ROIGroup,
      geometryId: `${rtDisplaySetUID}:${id}:segmentIndex-${ROINumber}`
    };
  });
}
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/addColorLUT.js
var addColorLUT = __webpack_require__(4714);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getNextColorLUTIndex.js
var getNextColorLUTIndex = __webpack_require__(70906);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/index.js + 1 modules
var dist_esm_enums = __webpack_require__(71851);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/updateLabelmapSegmentationImageReferences.js
var updateLabelmapSegmentationImageReferences = __webpack_require__(78231);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/triggerSegmentationEvents.js
var triggerSegmentationEvents = __webpack_require__(49906);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/convertStackToVolumeLabelmap.js
var convertStackToVolumeLabelmap = __webpack_require__(6273);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/index.js + 9 modules
var stateManagement_segmentation = __webpack_require__(55126);
;// ../../../extensions/cornerstone/src/constants/index.ts
// Volume loader schemes
const VOLUME_LOADER_SCHEME = 'cornerstoneStreamingImageVolume';
const DYNAMIC_VOLUME_LOADER_SCHEME = 'cornerstoneStreamingDynamicImageVolume';
;// ../../../extensions/cornerstone/src/services/SegmentationService/SegmentationService.ts
var _SegmentationService;















const LABELMAP = dist_esm.Enums.SegmentationRepresentations.Labelmap;
const CONTOUR = dist_esm.Enums.SegmentationRepresentations.Contour;
const SegmentationService_EVENTS = {
  SEGMENTATION_MODIFIED: 'event::segmentation_modified',
  // fired when the segmentation is added
  SEGMENTATION_ADDED: 'event::segmentation_added',
  //
  SEGMENTATION_DATA_MODIFIED: 'event::segmentation_data_modified',
  // fired when the segmentation is removed
  SEGMENTATION_REMOVED: 'event::segmentation_removed',
  //
  // fired when segmentation representation is added
  SEGMENTATION_REPRESENTATION_MODIFIED: 'event::segmentation_representation_modified',
  // fired when segmentation representation is removed
  SEGMENTATION_REPRESENTATION_REMOVED: 'event::segmentation_representation_removed',
  //
  // LOADING EVENTS
  // fired when the active segment is loaded in SEG or RTSTRUCT
  SEGMENT_LOADING_COMPLETE: 'event::segment_loading_complete',
  // loading completed for all segments
  SEGMENTATION_LOADING_COMPLETE: 'event::segmentation_loading_complete'
};
const VALUE_TYPES = {};
class SegmentationService extends src.PubSubService {
  constructor({
    servicesManager
  }) {
    super(SegmentationService_EVENTS);
    this._segmentationIdToColorLUTIndexMap = void 0;
    this._segmentationGroupStatsMap = void 0;
    this.servicesManager = void 0;
    this.highlightIntervalId = null;
    this.EVENTS = SegmentationService_EVENTS;
    this.destroy = () => {
      esm.eventTarget.removeEventListener(dist_esm.Enums.Events.SEGMENTATION_MODIFIED, this._onSegmentationModifiedFromSource);
      esm.eventTarget.removeEventListener(dist_esm.Enums.Events.SEGMENTATION_REMOVED, this._onSegmentationModifiedFromSource);
      esm.eventTarget.removeEventListener(dist_esm.Enums.Events.SEGMENTATION_DATA_MODIFIED, this._onSegmentationDataModifiedFromSource);
      esm.eventTarget.removeEventListener(dist_esm.Enums.Events.SEGMENTATION_REPRESENTATION_ADDED, this._onSegmentationModifiedFromSource);
      esm.eventTarget.removeEventListener(dist_esm.Enums.Events.SEGMENTATION_ADDED, this._onSegmentationAddedFromSource);
      this.reset();
    };
    this.getStyle = specifier => {
      const style = dist_esm.segmentation.config.style.getStyle(specifier);
      return style;
    };
    this.setStyle = (specifier, style) => {
      dist_esm.segmentation.config.style.setStyle(specifier, style);
    };
    this.resetToGlobalStyle = () => {
      dist_esm.segmentation.config.style.resetToGlobalStyle();
    };
    /**
     * Toggles the visibility of a segmentation in the state, and broadcasts the event.
     * Note: this method does not update the segmentation state in the source. It only
     * updates the state, and there should be separate listeners for that.
     * @param ids segmentation ids
     */
    this.toggleSegmentationRepresentationVisibility = (viewportId, {
      segmentationId,
      type
    }) => {
      this._toggleSegmentationRepresentationVisibility(viewportId, segmentationId, type);
    };
    this.getViewportIdsWithSegmentation = segmentationId => {
      const viewportIds = dist_esm.segmentation.state.getViewportIdsWithSegmentation(segmentationId);
      return viewportIds;
    };
    this._toggleSegmentationRepresentationVisibility = (viewportId, segmentationId, type) => {
      const representations = this.getSegmentationRepresentations(viewportId, {
        segmentationId,
        type
      });
      const representation = representations[0];
      const segmentsHidden = dist_esm.segmentation.config.visibility.getHiddenSegmentIndices(viewportId, {
        segmentationId,
        type: representation.type
      });
      const currentVisibility = segmentsHidden.size === 0;
      this._setSegmentationRepresentationVisibility(viewportId, segmentationId, representation.type, !currentVisibility);
    };
    this._onSegmentationDataModifiedFromSource = evt => {
      const {
        segmentationId
      } = evt.detail;
      this._broadcastEvent(this.EVENTS.SEGMENTATION_DATA_MODIFIED, {
        segmentationId
      });
    };
    this._onSegmentationRepresentationModifiedFromSource = evt => {
      const {
        segmentationId,
        viewportId
      } = evt.detail;
      this._broadcastEvent(this.EVENTS.SEGMENTATION_REPRESENTATION_MODIFIED, {
        segmentationId,
        viewportId
      });
    };
    this._onSegmentationModifiedFromSource = evt => {
      const {
        segmentationId
      } = evt.detail;
      this._broadcastEvent(this.EVENTS.SEGMENTATION_MODIFIED, {
        segmentationId
      });
    };
    this._onSegmentationAddedFromSource = evt => {
      const {
        segmentationId
      } = evt.detail;
      this._broadcastEvent(this.EVENTS.SEGMENTATION_ADDED, {
        segmentationId
      });
    };
    this._segmentationIdToColorLUTIndexMap = new Map();
    this.servicesManager = servicesManager;
    this._segmentationGroupStatsMap = new Map();
  }
  onModeEnter() {
    this._initSegmentationService();
  }
  onModeExit() {
    this.destroy();
  }

  /**
   * Retrieves a segmentation by its ID.
   *
   * @param segmentationId - The unique identifier of the segmentation to retrieve.
   * @returns The segmentation object if found, or undefined if not found.
   *
   * @remarks
   * This method directly accesses the cornerstone tools segmentation state to fetch
   * the segmentation data. It's useful when you need to access specific properties
   * or perform operations on a particular segmentation.
   */
  getSegmentation(segmentationId) {
    return dist_esm.segmentation.state.getSegmentation(segmentationId);
  }

  /**
   * Retrieves all segmentations from the cornerstone tools segmentation state.
   *
   * @returns An array of all segmentations currently stored in the state
   *
   * @remarks
   * This is a convenience method that directly accesses the cornerstone tools
   * segmentation state to get all available segmentations. It returns the raw
   * segmentation objects without any additional processing or filtering.
   */
  getSegmentations() {
    return dist_esm.segmentation.state.getSegmentations();
  }
  getPresentation(viewportId) {
    const segmentationPresentations = [];
    const segmentationsMap = new Map();
    const representations = this.getSegmentationRepresentations(viewportId);
    for (const representation of representations) {
      const {
        segmentationId
      } = representation;
      if (!representation) {
        continue;
      }
      const {
        type
      } = representation;
      segmentationsMap.set(segmentationId, {
        segmentationId,
        type,
        hydrated: true,
        config: representation.config || {}
      });
    }

    // Check inside the removedDisplaySetAndRepresentationMaps to see if any of the representations are not hydrated
    // const hydrationMap = this._segmentationRepresentationHydrationMaps.get(presentationId);

    // if (hydrationMap) {
    //   hydrationMap.forEach(rep => {
    //     segmentationsMap.set(rep.segmentationId, {
    //       segmentationId: rep.segmentationId,
    //       type: rep.type,
    //       hydrated: rep.hydrated,
    //       config: rep.config || {},
    //     });
    //   });
    // }

    // // Convert the Map to an array
    segmentationPresentations.push(...segmentationsMap.values());
    return segmentationPresentations;
  }
  getRepresentationsForSegmentation(segmentationId) {
    const representations = dist_esm.segmentation.state.getSegmentationRepresentationsBySegmentationId(segmentationId);
    return representations;
  }

  /**
   * Retrieves segmentation representations (labelmap, contour, surface) based on specified criteria.
   *
   * @param viewportId - The ID of the viewport.
   * @param specifier - An object containing optional `segmentationId` and `type` to filter the representations.
   * @returns An array of `SegmentationRepresentation` matching the criteria, or an empty array if none are found.
   *
   * @remarks
   * This method filters the segmentation representations according to the provided `specifier`:
   * - **No `segmentationId` or `type` provided**: Returns all representations associated with the given `viewportId`.
   * - **Only `segmentationId` provided**: Returns all representations with that `segmentationId`, regardless of `viewportId`.
   * - **Only `type` provided**: Returns all representations of that `type` associated with the given `viewportId`.
   * - **Both `segmentationId` and `type` provided**: Returns representations matching both criteria, regardless of `viewportId`.
   */
  getSegmentationRepresentations(viewportId, specifier = {}) {
    // Get all representations for the viewportId
    const representations = dist_esm.segmentation.state.getSegmentationRepresentations(viewportId, specifier);

    // Map to our SegmentationRepresentation type
    const ohifRepresentations = representations.map(repr => this._toOHIFSegmentationRepresentation(viewportId, repr));
    return ohifRepresentations;
  }
  async addSegmentationRepresentation(viewportId, {
    segmentationId,
    type,
    config,
    suppressEvents = false
  }) {
    const segmentation = this.getSegmentation(segmentationId);
    const csViewport = this.getAndValidateViewport(viewportId);
    if (!csViewport) {
      return;
    }
    const colorLUTIndex = this._segmentationIdToColorLUTIndexMap.get(segmentationId);
    const defaultRepresentationType = dist_esm.Enums.SegmentationRepresentations.Labelmap;
    let representationTypeToUse = type || defaultRepresentationType;
    let isConverted = false;
    if (type === dist_esm.Enums.SegmentationRepresentations.Labelmap) {
      const {
        isVolumeViewport,
        isVolumeSegmentation
      } = this.determineViewportAndSegmentationType(csViewport, segmentation) || {
        isVolumeViewport: false,
        isVolumeSegmentation: false
      };
      ({
        representationTypeToUse,
        isConverted
      } = await this.handleViewportConversion(isVolumeViewport, isVolumeSegmentation, csViewport, segmentation, viewportId, segmentationId, representationTypeToUse));
    }
    await this._addSegmentationRepresentation(viewportId, segmentationId, representationTypeToUse, colorLUTIndex, isConverted, config);
    if (!suppressEvents) {
      this._broadcastEvent(this.EVENTS.SEGMENTATION_REPRESENTATION_MODIFIED, {
        segmentationId
      });
    }
  }

  /**
   * Creates an labelmap segmentation for a given display set
   *
   * @param displaySet - The display set to create the segmentation for.
   * @param options - Optional parameters for creating the segmentation.
   * @param options.segmentationId - Custom segmentation ID. If not provided, a UUID will be generated.
   * @param options.FrameOfReferenceUID - Frame of reference UID for the segmentation.
   * @param options.label - Label for the segmentation.
   * @returns A promise that resolves to the created segmentation ID.
   */
  async createLabelmapForDisplaySet(displaySet, options) {
    // Todo: random does not makes sense, make this better, like
    // labelmap 1, 2, 3 etc
    const segmentationId = options?.segmentationId ?? `${esm.utilities.uuidv4()}`;
    const isDynamicVolume = displaySet.isDynamicVolume;
    let referenceImageIds = displaySet.imageIds;
    if (isDynamicVolume) {
      // get the middle timepoint for referenceImageIds
      const timePoints = displaySet.dynamicVolumeInfo.timePoints;
      const middleTimePoint = timePoints[Math.floor(timePoints.length / 2)];
      referenceImageIds = middleTimePoint;
    }
    const derivedImages = await esm.imageLoader.createAndCacheDerivedLabelmapImages(referenceImageIds);
    const segs = this.getSegmentations();
    const label = options.label || `Segmentation ${segs.length + 1}`;
    const segImageIds = derivedImages.map(image => image.imageId);
    const segmentationPublicInput = {
      segmentationId,
      representation: {
        type: LABELMAP,
        data: {
          imageIds: segImageIds,
          // referencedVolumeId: this._getVolumeIdForDisplaySet(displaySet),
          referencedImageIds: referenceImageIds
        }
      },
      config: {
        label,
        segments: options.segments && Object.keys(options.segments).length > 0 ? options.segments : {
          1: {
            label: `${i18n_src/* default */.A.t('Segment')} 1`,
            active: true
          }
        },
        cachedStats: {
          info: `S${displaySet.SeriesNumber}: ${displaySet.SeriesDescription}`
        }
      }
    };
    this.addOrUpdateSegmentation(segmentationPublicInput);
    return segmentationId;
  }
  async createSegmentationForSEGDisplaySet(segDisplaySet, options = {
    type: LABELMAP
  }) {
    const {
      type
    } = options;
    let {
      segmentationId
    } = options;
    const {
      labelMapImages
    } = segDisplaySet;
    if (type !== LABELMAP) {
      throw new Error('Only labelmap type is supported for SEG display sets right now');
    }
    if (!labelMapImages || !labelMapImages.length) {
      throw new Error('SEG reading failed');
    }
    segmentationId = segmentationId ?? segDisplaySet.displaySetInstanceUID;
    const referencedDisplaySetInstanceUID = segDisplaySet.referencedDisplaySetInstanceUID;
    const referencedDisplaySet = this.servicesManager.services.displaySetService.getDisplaySetByUID(referencedDisplaySetInstanceUID);
    const images = referencedDisplaySet.instances;
    if (!images.length) {
      throw new Error('No instances were provided for the referenced display set of the SEG');
    }
    const imageIds = images.map(image => image.imageId);
    const derivedImages = labelMapImages?.flat();
    const derivedImageIds = derivedImages.map(image => image.imageId);
    segDisplaySet.images = derivedImages.map(image => ({
      ...image,
      ...esm.metaData.get('instance', image.referencedImageId)
    }));
    segDisplaySet.imageIds = derivedImageIds;

    // We should parse the segmentation as separate slices to support overlapping segments.
    // This parsing should occur in the CornerstoneJS library adapters.
    // For now, we use the volume returned from the library and chop it here.
    let firstSegmentedSliceImageId = null;
    for (let i = 0; i < derivedImages.length; i++) {
      const voxelManager = derivedImages[i].voxelManager;
      const scalarData = voxelManager.getScalarData();
      voxelManager.setScalarData(scalarData);

      // Check if this slice has any non-zero voxels and we haven't found one yet
      if (!firstSegmentedSliceImageId && scalarData.some(value => value !== 0)) {
        firstSegmentedSliceImageId = derivedImages[i].referencedImageId;
      }
    }

    // assign the first non zero voxel image id to the segDisplaySet
    segDisplaySet.firstSegmentedSliceImageId = firstSegmentedSliceImageId;
    const segmentsInfo = segDisplaySet.segMetadata.data;
    const segments = {};
    const colorLUT = [];
    segmentsInfo.forEach((segmentInfo, index) => {
      if (index === 0) {
        colorLUT.push([0, 0, 0, 0]);
        return;
      }
      const {
        SegmentedPropertyCategoryCodeSequence,
        SegmentNumber,
        SegmentLabel,
        SegmentAlgorithmType,
        SegmentAlgorithmName,
        SegmentedPropertyTypeCodeSequence,
        rgba
      } = segmentInfo;
      colorLUT.push(rgba);
      const segmentIndex = Number(SegmentNumber);
      const centroid = segDisplaySet.centroids?.get(index);
      const imageCentroidXYZ = centroid?.image || {
        x: 0,
        y: 0,
        z: 0
      };
      const worldCentroidXYZ = centroid?.world || {
        x: 0,
        y: 0,
        z: 0
      };
      segments[segmentIndex] = {
        segmentIndex,
        label: SegmentLabel || `Segment ${SegmentNumber}`,
        locked: false,
        active: false,
        cachedStats: {
          center: {
            image: [imageCentroidXYZ.x, imageCentroidXYZ.y, imageCentroidXYZ.z],
            world: [worldCentroidXYZ.x, worldCentroidXYZ.y, worldCentroidXYZ.z]
          },
          modifiedTime: segDisplaySet.SeriesDate,
          category: SegmentedPropertyCategoryCodeSequence ? SegmentedPropertyCategoryCodeSequence.CodeMeaning : '',
          type: SegmentedPropertyTypeCodeSequence ? SegmentedPropertyTypeCodeSequence.CodeMeaning : '',
          algorithmType: SegmentAlgorithmType,
          algorithmName: SegmentAlgorithmName
        }
      };
    });

    // get next color lut index
    const colorLUTIndex = (0,getNextColorLUTIndex/* getNextColorLUTIndex */.u)();
    (0,addColorLUT/* addColorLUT */.u)(colorLUT, colorLUTIndex);
    this._segmentationIdToColorLUTIndexMap.set(segmentationId, colorLUTIndex);
    this._broadcastEvent(SegmentationService_EVENTS.SEGMENTATION_LOADING_COMPLETE, {
      segmentationId,
      segDisplaySet
    });
    const seg = {
      segmentationId,
      representation: {
        type: LABELMAP,
        data: {
          imageIds: derivedImageIds,
          // referencedVolumeId: this._getVolumeIdForDisplaySet(referencedDisplaySet),
          referencedImageIds: imageIds
        }
      },
      config: {
        label: segDisplaySet.SeriesDescription,
        segments
      }
    };
    segDisplaySet.isLoaded = true;
    this.addOrUpdateSegmentation(seg);
    return segmentationId;
  }
  async createSegmentationForRTDisplaySet(rtDisplaySet, options = {
    type: CONTOUR
  }) {
    const {
      type
    } = options;
    let {
      segmentationId
    } = options;

    // Currently, only contour representation is supported for RT display
    if (type !== CONTOUR) {
      throw new Error('Only contour type is supported for RT display sets right now');
    }

    // Assign segmentationId if not provided
    segmentationId = segmentationId ?? rtDisplaySet.displaySetInstanceUID;
    const {
      structureSet
    } = rtDisplaySet;
    if (!structureSet) {
      throw new Error('To create the contours from RT displaySet, the displaySet should be loaded first. You can perform rtDisplaySet.load() before calling this method.');
    }
    const rtDisplaySetUID = rtDisplaySet.displaySetInstanceUID;
    const referencedDisplaySet = this.servicesManager.services.displaySetService.getDisplaySetByUID(rtDisplaySet.referencedDisplaySetInstanceUID);
    const referencedImageIdsWithGeometry = Array.from(structureSet.ReferencedSOPInstanceUIDsSet);
    const referencedImageIds = referencedDisplaySet.imageIds;
    // find the first image id that contains a referenced SOP instance UID
    const firstSegmentedSliceImageId = referencedImageIds?.find(imageId => referencedImageIdsWithGeometry.some(referencedId => imageId.includes(referencedId))) || null;
    rtDisplaySet.firstSegmentedSliceImageId = firstSegmentedSliceImageId;
    // Map ROI contours to RT Struct Data
    const allRTStructData = mapROIContoursToRTStructData(structureSet, rtDisplaySetUID);

    // Sort by segmentIndex for consistency
    allRTStructData.sort((a, b) => a.segmentIndex - b.segmentIndex);
    const geometryIds = allRTStructData.map(({
      geometryId
    }) => geometryId);

    // Initialize SegmentationPublicInput similar to SEG function
    const segmentation = {
      segmentationId,
      representation: {
        type: CONTOUR,
        data: {
          geometryIds
        }
      },
      config: {
        label: rtDisplaySet.SeriesDescription
      }
    };
    if (!structureSet.ROIContours?.length) {
      throw new Error('The structureSet does not contain any ROIContours. Please ensure the structureSet is loaded first.');
    }
    const segments = {};
    let segmentsCachedStats = {};

    // Create colorLUT array for RT structures
    const colorLUT = [[0, 0, 0, 0]]; // First entry is transparent for index 0

    // Process each segment similarly to the SEG function
    for (const rtStructData of allRTStructData) {
      const {
        data,
        id,
        color,
        segmentIndex,
        geometryId,
        group
      } = rtStructData;

      // Add the color to the colorLUT array
      colorLUT.push(color);
      try {
        const geometry = await esm.geometryLoader.createAndCacheGeometry(geometryId, {
          geometryData: {
            data,
            id,
            color,
            frameOfReferenceUID: structureSet.frameOfReferenceUID,
            segmentIndex
          },
          type: esm.Enums.GeometryType.CONTOUR
        });
        const contourSet = geometry.data;
        const centroid = contourSet.centroid;
        segmentsCachedStats = {
          center: {
            world: centroid
          },
          modifiedTime: rtDisplaySet.SeriesDate // Using SeriesDate as modifiedTime
        };
        segments[segmentIndex] = {
          label: id,
          segmentIndex,
          cachedStats: segmentsCachedStats,
          locked: false,
          active: false,
          group
        };

        // Broadcast segment loading progress
        const numInitialized = Object.keys(segmentsCachedStats).length;
        const percentComplete = Math.round(numInitialized / allRTStructData.length * 100);
        this._broadcastEvent(SegmentationService_EVENTS.SEGMENT_LOADING_COMPLETE, {
          percentComplete,
          numSegments: allRTStructData.length
        });
      } catch (e) {
        console.warn(`Error initializing contour for segment ${segmentIndex}:`, e);
        continue; // Continue processing other segments even if one fails
      }
    }

    // Create and register the colorLUT
    const colorLUTIndex = (0,getNextColorLUTIndex/* getNextColorLUTIndex */.u)();
    (0,addColorLUT/* addColorLUT */.u)(colorLUT, colorLUTIndex);
    this._segmentationIdToColorLUTIndexMap.set(segmentationId, colorLUTIndex);

    // Assign processed segments to segmentation config
    segmentation.config.segments = segments;

    // Broadcast segmentation loading complete event
    this._broadcastEvent(SegmentationService_EVENTS.SEGMENTATION_LOADING_COMPLETE, {
      segmentationId,
      rtDisplaySet
    });

    // Mark the RT display set as loaded
    rtDisplaySet.isLoaded = true;
    // Add or update the segmentation in the state
    this.addOrUpdateSegmentation(segmentation);
    return segmentationId;
  }

  /**
   * Adds or updates a segmentation in the state
   * @param segmentationId - The ID of the segmentation to add or update
   * @param data - The data to add or update the segmentation with
   *
   * @remarks
   * This method handles the addition or update of a segmentation in the state.
   * If the segmentation already exists, it updates the existing segmentation.
   * If the segmentation does not exist, it adds a new segmentation.
   */
  addOrUpdateSegmentation(data) {
    const segmentationId = data.segmentationId;
    const existingSegmentation = dist_esm.segmentation.state.getSegmentation(segmentationId);
    if (existingSegmentation) {
      // Update the existing segmentation
      this.updateSegmentationInSource(segmentationId, data);
    } else {
      // Add a new segmentation
      this.addSegmentationToSource(data);
    }
  }
  setActiveSegmentation(viewportId, segmentationId) {
    dist_esm.segmentation.activeSegmentation.setActiveSegmentation(viewportId, segmentationId);
  }

  /**
   * Gets the active segmentation for a viewport
   * @param viewportId - The ID of the viewport to get the active segmentation for
   * @returns The active segmentation object, or null if no segmentation is active
   *
   * @remarks
   * This method retrieves the currently active segmentation for the specified viewport.
   * The active segmentation is the one that is currently selected for editing operations.
   * Returns null if no segmentation is active in the viewport.
   */
  getActiveSegmentation(viewportId) {
    return dist_esm.segmentation.activeSegmentation.getActiveSegmentation(viewportId);
  }

  /**
   * Gets the active segment from the active segmentation in a viewport
   * @param viewportId - The ID of the viewport to get the active segment from
   * @returns The active segment object, or undefined if no segment is active
   *
   * @remarks
   * This method retrieves the currently active segment from the active segmentation
   * in the specified viewport. The active segment is the one that is currently
   * selected for editing operations. Returns undefined if no segment is active or
   * if there is no active segmentation.
   */
  getActiveSegment(viewportId) {
    const activeSegmentation = this.getActiveSegmentation(viewportId);
    if (!activeSegmentation) {
      return;
    }
    const {
      segments
    } = activeSegmentation;
    let activeSegment;
    for (const segment of Object.values(segments)) {
      if (segment.active) {
        activeSegment = segment;
        break;
      }
    }
    return activeSegment;
  }
  hasCustomStyles(specifier) {
    return dist_esm.segmentation.config.style.hasCustomStyle(specifier);
  }
  /**
   * Adds a new segment to the specified segmentation.
   * @param segmentationId - The ID of the segmentation to add the segment to.
   * @param viewportId: The ID of the viewport to add the segment to, it is used to get the representation, if it is not
   * provided, the first available representation for the segmentationId will be used.
   * @param config - An object containing the configuration options for the new segment.
   *   - segmentIndex: (optional) The index of the segment to add. If not provided, the next available index will be used.
   *   - properties: (optional) An object containing the properties of the new segment.
   *     - label: (optional) The label of the new segment. If not provided, a default label will be used.
   *     - color: (optional) The color of the new segment in RGB format. If not provided, a default color will be used.
   *     - visibility: (optional) Whether the new segment should be visible. If not provided, the segment will be visible by default.
   *     - isLocked: (optional) Whether the new segment should be locked for editing. If not provided, the segment will not be locked by default.
   *     - active: (optional) Whether the new segment should be the active segment to be edited. If not provided, the segment will not be active by default.
   */
  addSegment(segmentationId, config = {}) {
    if (config?.segmentIndex === 0) {
      throw new Error(i18n_src/* default */.A.t('Segment') + ' index 0 is reserved for "no label"');
    }
    const csSegmentation = this.getCornerstoneSegmentation(segmentationId);
    let segmentIndex = config.segmentIndex;
    if (!segmentIndex) {
      // grab the next available segment index based on the object keys,
      // so basically get the highest segment index value + 1
      const segmentKeys = Object.keys(csSegmentation.segments);
      segmentIndex = segmentKeys.length === 0 ? 1 : Math.max(...segmentKeys.map(Number)) + 1;
    }

    // update the segmentation
    if (!config.label) {
      config.label = `${i18n_src/* default */.A.t('Segment')} ${segmentIndex}`;
    }
    const currentSegments = csSegmentation.segments;
    dist_esm.segmentation.updateSegmentations([{
      segmentationId,
      payload: {
        segments: {
          ...currentSegments,
          [segmentIndex]: {
            ...currentSegments[segmentIndex],
            segmentIndex,
            cachedStats: {},
            locked: false,
            ...config
          }
        }
      }
    }]);
    this.setActiveSegment(segmentationId, segmentIndex);

    // Apply additional configurations
    if (config.isLocked !== undefined) {
      this._setSegmentLockedStatus(segmentationId, segmentIndex, config.isLocked);
    }

    // Get all viewports that have this segmentation
    const viewportIds = this.getViewportIdsWithSegmentation(segmentationId);
    viewportIds.forEach(viewportId => {
      // Set color if provided
      if (config.color !== undefined) {
        this.setSegmentColor(viewportId, segmentationId, segmentIndex, config.color);
      }

      // Set visibility if provided
      if (config.visibility !== undefined) {
        this.setSegmentVisibility(viewportId, segmentationId, segmentIndex, config.visibility);
      }
    });
  }

  /**
   * Removes a segment from a segmentation and updates the active segment index if necessary.
   *
   * @param segmentationId - The ID of the segmentation containing the segment to remove.
   * @param segmentIndex - The index of the segment to remove.
   *
   * @remarks
   * This method performs the following actions:
   * 1. Clears the segment value in the Cornerstone segmentation.
   * 2. Updates all related segmentation representations to remove the segment.
   * 3. If the removed segment was the active segment, it updates the active segment index.
   *
   */
  removeSegment(segmentationId, segmentIndex) {
    dist_esm.segmentation.removeSegment(segmentationId, segmentIndex);
  }
  setSegmentVisibility(viewportId, segmentationId, segmentIndex, isVisible, type) {
    this._setSegmentVisibility(viewportId, segmentationId, segmentIndex, isVisible, type);
  }

  /**
   * Sets the locked status of a segment in a segmentation.
   *
   * @param segmentationId - The ID of the segmentation containing the segment.
   * @param segmentIndex - The index of the segment to set the locked status for.
   * @param isLocked - The new locked status of the segment.
   *
   * @remarks
   * This method updates the locked status of a specific segment within a segmentation.
   * A locked segment cannot be modified or edited.
   */
  setSegmentLocked(segmentationId, segmentIndex, isLocked) {
    this._setSegmentLockedStatus(segmentationId, segmentIndex, isLocked);
  }

  /**
   * Toggles the locked state of a segment in a segmentation.
   * @param segmentationId - The ID of the segmentation.
   * @param segmentIndex - The index of the segment to toggle.
   */
  toggleSegmentLocked(segmentationId, segmentIndex) {
    const isLocked = dist_esm.segmentation.segmentLocking.isSegmentIndexLocked(segmentationId, segmentIndex);
    this._setSegmentLockedStatus(segmentationId, segmentIndex, !isLocked);
  }
  toggleSegmentVisibility(viewportId, segmentationId, segmentIndex, type) {
    const isVisible = dist_esm.segmentation.config.visibility.getSegmentIndexVisibility(viewportId, {
      segmentationId,
      type
    }, segmentIndex);
    this._setSegmentVisibility(viewportId, segmentationId, segmentIndex, !isVisible, type);
  }

  /**
   * Sets the color of a specific segment in a segmentation.
   *
   * @param viewportId - The ID of the viewport containing the segmentation
   * @param segmentationId - The ID of the segmentation containing the segment
   * @param segmentIndex - The index of the segment to set the color for
   * @param color - The new color to apply to the segment as an array of RGBA values
   *
   * @remarks
   * This method updates the color of a specific segment within a segmentation.
   * The color parameter should be an array of 4 numbers representing RGBA values.
   */
  setSegmentColor(viewportId, segmentationId, segmentIndex, color) {
    dist_esm.segmentation.config.color.setSegmentIndexColor(viewportId, segmentationId, segmentIndex, color);
  }

  /**
   * Gets the current color of a specific segment in a segmentation.
   *
   * @param viewportId - The ID of the viewport containing the segmentation
   * @param segmentationId - The ID of the segmentation containing the segment
   * @param segmentIndex - The index of the segment to get the color for
   * @returns An array of 4 numbers representing the RGBA color values of the segment
   *
   * @remarks
   * This method retrieves the current color of a specific segment within a segmentation.
   * The returned color is an array of 4 numbers representing RGBA values.
   */
  getSegmentColor(viewportId, segmentationId, segmentIndex) {
    return dist_esm.segmentation.config.color.getSegmentIndexColor(viewportId, segmentationId, segmentIndex);
  }

  /**
   * Gets the labelmap volume for a segmentation
   * @param segmentationId - The ID of the segmentation to get the labelmap volume for
   * @returns The labelmap volume for the segmentation, or null if not found
   *
   * @remarks
   * This method retrieves the labelmap volume data for a specific segmentation.
   * The labelmap volume contains the actual segmentation data in the form of a 3D volume.
   * Returns null if the segmentation does not have valid labelmap volume data.
   */
  getLabelmapVolume(segmentationId) {
    const csSegmentation = dist_esm.segmentation.state.getSegmentation(segmentationId);
    const labelmapData = csSegmentation.representationData[esm_enums.SegmentationRepresentations.Labelmap];
    if (!labelmapData || !labelmapData.volumeId) {
      return null;
    }
    const {
      volumeId
    } = labelmapData;
    const labelmapVolume = esm.cache.getVolume(volumeId);
    return labelmapVolume;
  }

  /**
   * Sets the label for a specific segment in a segmentation
   * @param segmentationId - The ID of the segmentation containing the segment
   * @param segmentIndex - The index of the segment to set the label for
   * @param label - The new label to apply to the segment
   *
   * @remarks
   * This method updates the text label of a specific segment within a segmentation.
   * The label is used to identify and describe the segment in the UI.
   */
  setSegmentLabel(segmentationId, segmentIndex, label) {
    this._setSegmentLabel(segmentationId, segmentIndex, label);
  }

  /**
   * Sets the active segment for a segmentation
   * @param segmentationId - The ID of the segmentation containing the segment
   * @param segmentIndex - The index of the segment to set as active
   *
   * @remarks
   * This method updates which segment is considered "active" within a segmentation.
   * The active segment is typically highlighted and available for editing operations.
   */
  setActiveSegment(segmentationId, segmentIndex) {
    this._setActiveSegment(segmentationId, segmentIndex);
  }

  /**
   * Controls whether inactive segmentations should be rendered in a viewport
   * @param viewportId - The ID of the viewport to update
   * @param renderInactive - Whether inactive segmentations should be rendered
   *
   * @remarks
   * This method configures if segmentations that are not currently active
   * should still be visible in the specified viewport. This can be useful
   * for comparing or viewing multiple segmentations simultaneously.
   */
  setRenderInactiveSegmentations(viewportId, renderInactive) {
    dist_esm.segmentation.config.style.setRenderInactiveSegmentations(viewportId, renderInactive);
  }

  /**
   * Gets whether inactive segmentations are being rendered for a viewport
   * @param viewportId - The ID of the viewport to check
   * @returns boolean indicating if inactive segmentations are rendered
   *
   * @remarks
   * This method retrieves the current rendering state for inactive segmentations
   * in the specified viewport. Returns true if inactive segmentations are visible.
   */
  getRenderInactiveSegmentations(viewportId) {
    return dist_esm.segmentation.config.style.getRenderInactiveSegmentations(viewportId);
  }
  /**
   * Sets statistics for a group of segmentations
   * @param segmentationIds - Array of segmentation IDs that form the group
   * @param stats - Statistics object containing metrics for the segmentation group
   *
   * @remarks
   * This method stores statistical data for a group of related segmentations.
   * The stats are stored using a composite key created from the sorted and joined
   */
  setSegmentationGroupStats(segmentationIds, stats) {
    const groupId = this.getGroupId(segmentationIds);
    this._segmentationGroupStatsMap.set(groupId, stats);
  }

  /**
   * Gets statistics for a group of segmentations
   * @param segmentationIds - Array of segmentation IDs that form the group
   * @returns The stored statistics object for the segmentation group if found, undefined otherwise
   */
  getSegmentationGroupStats(segmentationIds) {
    const groupId = this.getGroupId(segmentationIds);
    return this._segmentationGroupStatsMap.get(groupId);
  }
  getGroupId(segmentationIds) {
    return segmentationIds.sort().join(',');
  }
  /**
   * Clears segmentation representations from the viewport.
   * Unlike removeSegmentationRepresentations, this doesn't update
   * removed display set and representation maps.
   * We track removed segmentations manually to avoid re-adding them
   * when the display set is added again.
   * @param viewportId - The viewport ID to clear segmentation representations from.
   */
  clearSegmentationRepresentations(viewportId) {
    this.removeSegmentationRepresentations(viewportId);
  }

  /**
   * Completely removes a segmentation from the state
   * @param segmentationId - The ID of the segmentation to remove.
   */
  remove(segmentationId) {
    dist_esm.segmentation.state.removeSegmentation(segmentationId);
  }
  removeAllSegmentations() {
    dist_esm.segmentation.state.removeAllSegmentations();
  }

  /**
   * It removes the segmentation representations from the viewport.
   * @param viewportId - The viewport id to remove the segmentation representations from.
   * @param specifier - The specifier to remove the segmentation representations.
   *
   * @remarks
   * If no specifier is provided, all segmentation representations for the viewport are removed.
   * If a segmentationId specifier is provided, only the segmentation representation with the specified segmentationId and type are removed.
   * If a type specifier is provided, only the segmentation representation with the specified type are removed.
   * If both a segmentationId and type specifier are provided, only the segmentation representation with the specified segmentationId and type are removed.
   */
  removeSegmentationRepresentations(viewportId, specifier = {}) {
    dist_esm.segmentation.removeSegmentationRepresentations(viewportId, specifier);
  }
  jumpToSegmentCenter(segmentationId, segmentIndex, viewportId, highlightAlpha = 0.9, highlightSegment = true, animationLength = 750, highlightHideOthers = false, highlightFunctionType = 'ease-in-out' // todo: make animation functions configurable from outside
  ) {
    const center = this._getSegmentCenter(segmentationId, segmentIndex);
    if (!center) {
      console.warn('No center found for segmentation', segmentationId, segmentIndex);
      return;
    }
    const {
      world
    } = center;

    // need to find which viewports are displaying the segmentation
    const viewportIds = viewportId ? [viewportId] : this.getViewportIdsWithSegmentation(segmentationId);
    viewportIds.forEach(viewportId => {
      const {
        viewport
      } = (0,esm.getEnabledElementByViewportId)(viewportId);
      viewport.jumpToWorld(world);
      highlightSegment && this.highlightSegment(segmentationId, segmentIndex, viewportId, highlightAlpha, animationLength, highlightHideOthers);
    });
  }
  highlightSegment(segmentationId, segmentIndex, viewportId, alpha = 0.9, animationLength = 750, hideOthers = true, highlightFunctionType = 'ease-in-out') {
    if (this.highlightIntervalId) {
      clearInterval(this.highlightIntervalId);
    }
    const csSegmentation = this.getCornerstoneSegmentation(segmentationId);
    const viewportIds = viewportId ? [viewportId] : this.getViewportIdsWithSegmentation(segmentationId);
    viewportIds.forEach(viewportId => {
      const segmentationRepresentation = this.getSegmentationRepresentations(viewportId, {
        segmentationId
      });
      const representation = segmentationRepresentation[0];
      const {
        type
      } = representation;
      const segments = csSegmentation.segments;
      const highlightFn = type === LABELMAP ? this._highlightLabelmap.bind(this) : this._highlightContour.bind(this);
      const adjustedAlpha = type === LABELMAP ? alpha : 1 - alpha;
      highlightFn(segmentIndex, adjustedAlpha, hideOthers, segments, viewportId, animationLength, representation);
    });
  }
  getAndValidateViewport(viewportId) {
    const csViewport = this.servicesManager.services.cornerstoneViewportService.getCornerstoneViewport(viewportId);
    if (!csViewport) {
      console.warn(`Viewport with id ${viewportId} not found.`);
      return null;
    }
    return csViewport;
  }

  /**
   * Sets the visibility of a segmentation representation.
   *
   * @param viewportId - The ID of the viewport.
   * @param segmentationId - The ID of the segmentation.
   * @param isVisible - The new visibility state.
   */
  _setSegmentationRepresentationVisibility(viewportId, segmentationId, type, isVisible) {
    const representations = this.getSegmentationRepresentations(viewportId, {
      segmentationId,
      type
    });
    const representation = representations[0];
    if (!representation) {
      console.debug('No segmentation representation found for the given viewportId and segmentationId');
      return;
    }
    dist_esm.segmentation.config.visibility.setSegmentationRepresentationVisibility(viewportId, {
      segmentationId,
      type
    }, isVisible);
  }
  determineViewportAndSegmentationType(csViewport, segmentation) {
    const isVolumeViewport = csViewport.type === dist_esm_enums.ViewportType.ORTHOGRAPHIC || csViewport.type === dist_esm_enums.ViewportType.VOLUME_3D;
    const isVolumeSegmentation = 'volumeId' in segmentation.representationData[LABELMAP];
    return {
      isVolumeViewport,
      isVolumeSegmentation
    };
  }
  async handleViewportConversion(isVolumeViewport, isVolumeSegmentation, csViewport, segmentation, viewportId, segmentationId, representationType) {
    let representationTypeToUse = representationType;
    let isConverted = false;
    const handler = isVolumeViewport ? this.handleVolumeViewportCase : this.handleStackViewportCase;
    ({
      representationTypeToUse,
      isConverted
    } = await handler.apply(this, [csViewport, segmentation, isVolumeSegmentation, viewportId, segmentationId]));
    return {
      representationTypeToUse,
      isConverted
    };
  }
  async handleVolumeViewportCase(csViewport, segmentation, isVolumeSegmentation) {
    if (csViewport.type === dist_esm_enums.ViewportType.VOLUME_3D) {
      return {
        representationTypeToUse: esm_enums.SegmentationRepresentations.Surface,
        isConverted: false
      };
    } else {
      await this.handleVolumeViewport(csViewport, segmentation, isVolumeSegmentation);
      return {
        representationTypeToUse: esm_enums.SegmentationRepresentations.Labelmap,
        isConverted: false
      };
    }
  }
  async handleStackViewportCase(csViewport, segmentation, isVolumeSegmentation, viewportId, segmentationId) {
    if (isVolumeSegmentation) {
      const isConverted = await this.convertStackToVolumeViewport(csViewport);
      return {
        representationTypeToUse: esm_enums.SegmentationRepresentations.Labelmap,
        isConverted
      };
    }
    if ((0,updateLabelmapSegmentationImageReferences/* updateLabelmapSegmentationImageReferences */.t)(viewportId, segmentationId)) {
      return {
        representationTypeToUse: esm_enums.SegmentationRepresentations.Labelmap,
        isConverted: false
      };
    }
    const isConverted = await this.attemptStackToVolumeConversion(csViewport, segmentation, viewportId, segmentationId);
    return {
      representationTypeToUse: esm_enums.SegmentationRepresentations.Labelmap,
      isConverted
    };
  }
  async _addSegmentationRepresentation(viewportId, segmentationId, representationType, colorLUTIndex, isConverted, config) {
    const representation = {
      type: representationType,
      segmentationId,
      config: {
        colorLUTOrIndex: colorLUTIndex,
        ...config
      }
    };
    const addRepresentation = () => dist_esm.segmentation.addSegmentationRepresentations(viewportId, [representation]);
    if (isConverted) {
      const {
        viewportGridService
      } = this.servicesManager.services;
      await new Promise(resolve => {
        const {
          unsubscribe
        } = viewportGridService.subscribe(viewportGridService.EVENTS.GRID_STATE_CHANGED, () => {
          addRepresentation();
          unsubscribe();
          resolve();
        });
      });
    } else {
      addRepresentation();
    }
  }
  async handleVolumeViewport(viewport, segmentation, isVolumeSegmentation) {
    if (isVolumeSegmentation) {
      return; // Volume Labelmap on Volume Viewport is natively supported
    }
    const frameOfReferenceUID = viewport.getFrameOfReferenceUID();
    const imageIds = (0,stateManagement_segmentation.getLabelmapImageIds)(segmentation.segmentationId);
    const segImage = esm.cache.getImage(imageIds[0]);
    if (segImage?.FrameOfReferenceUID === frameOfReferenceUID) {
      await (0,convertStackToVolumeLabelmap/* convertStackToVolumeLabelmap */.p)(segmentation);
    }
  }
  async convertStackToVolumeViewport(viewport) {
    const {
      viewportGridService,
      cornerstoneViewportService
    } = this.servicesManager.services;
    const state = viewportGridService.getState();
    const gridViewport = state.viewports.get(viewport.id);
    const prevViewPresentation = viewport.getViewPresentation();
    const prevViewReference = viewport.getViewReference();
    const stackViewport = cornerstoneViewportService.getCornerstoneViewport(viewport.id);
    const {
      element
    } = stackViewport;
    const volumeViewportNewVolumeHandler = () => {
      const volumeViewport = cornerstoneViewportService.getCornerstoneViewport(viewport.id);
      volumeViewport.setViewPresentation(prevViewPresentation);
      volumeViewport.setViewReference(prevViewReference);
      volumeViewport.render();
      element.removeEventListener(esm.Enums.Events.VOLUME_VIEWPORT_NEW_VOLUME, volumeViewportNewVolumeHandler);
    };
    element.addEventListener(esm.Enums.Events.VOLUME_VIEWPORT_NEW_VOLUME, volumeViewportNewVolumeHandler);
    viewportGridService.setDisplaySetsForViewport({
      viewportId: viewport.id,
      displaySetInstanceUIDs: gridViewport.displaySetInstanceUIDs,
      viewportOptions: {
        ...gridViewport.viewportOptions,
        viewportType: dist_esm_enums.ViewportType.ORTHOGRAPHIC
      }
    });
    return true;
  }
  async attemptStackToVolumeConversion(viewport, segmentation, viewportId, segmentationId) {
    const imageIds = (0,stateManagement_segmentation.getLabelmapImageIds)(segmentation.segmentationId);
    const frameOfReferenceUID = viewport.getFrameOfReferenceUID();
    const segImage = esm.cache.getImage(imageIds[0]);
    if (segImage?.FrameOfReferenceUID && frameOfReferenceUID && segImage.FrameOfReferenceUID === frameOfReferenceUID) {
      const isConverted = await this.convertStackToVolumeViewport(viewport);
      (0,triggerSegmentationEvents.triggerSegmentationRepresentationModified)(viewportId, segmentationId, esm_enums.SegmentationRepresentations.Labelmap);
      return isConverted;
    }
  }
  addSegmentationToSource(segmentationPublicInput) {
    dist_esm.segmentation.addSegmentations([segmentationPublicInput]);
  }
  updateSegmentationInSource(segmentationId, payload) {
    dist_esm.segmentation.updateSegmentations([{
      segmentationId,
      payload
    }]);
  }
  _toOHIFSegmentationRepresentation(viewportId, csRepresentation) {
    const {
      segmentationId,
      type,
      active,
      visible
    } = csRepresentation;
    const {
      colorLUTIndex
    } = csRepresentation;
    const segmentsRepresentations = {};
    const segmentation = dist_esm.segmentation.state.getSegmentation(segmentationId);
    if (!segmentation) {
      throw new Error(`Segmentation with ID ${segmentationId} not found.`);
    }
    const segmentIds = Object.keys(segmentation.segments);
    for (const segmentId of segmentIds) {
      const segmentIndex = parseInt(segmentId, 10);
      const color = dist_esm.segmentation.config.color.getSegmentIndexColor(viewportId, segmentationId, segmentIndex);
      const isVisible = dist_esm.segmentation.config.visibility.getSegmentIndexVisibility(viewportId, {
        segmentationId,
        type
      }, segmentIndex);
      segmentsRepresentations[segmentIndex] = {
        color,
        segmentIndex,
        opacity: color[3],
        visible: isVisible
      };
    }
    const styles = dist_esm.segmentation.config.style.getStyle({
      viewportId,
      segmentationId,
      type
    });
    const id = `${segmentationId}-${type}-${viewportId}`;
    return {
      id: id,
      segmentationId,
      label: segmentation.label,
      active,
      type,
      visible,
      segments: segmentsRepresentations,
      styles,
      viewportId,
      colorLUTIndex,
      config: {}
    };
  }
  _initSegmentationService() {
    esm.eventTarget.addEventListener(dist_esm.Enums.Events.SEGMENTATION_MODIFIED, this._onSegmentationModifiedFromSource);
    esm.eventTarget.addEventListener(dist_esm.Enums.Events.SEGMENTATION_REMOVED, this._onSegmentationModifiedFromSource);
    esm.eventTarget.addEventListener(dist_esm.Enums.Events.SEGMENTATION_DATA_MODIFIED, this._onSegmentationDataModifiedFromSource);
    esm.eventTarget.addEventListener(dist_esm.Enums.Events.SEGMENTATION_REPRESENTATION_MODIFIED, this._onSegmentationRepresentationModifiedFromSource);
    esm.eventTarget.addEventListener(dist_esm.Enums.Events.SEGMENTATION_REPRESENTATION_ADDED, this._onSegmentationRepresentationModifiedFromSource);
    esm.eventTarget.addEventListener(dist_esm.Enums.Events.SEGMENTATION_REPRESENTATION_REMOVED, this._onSegmentationRepresentationModifiedFromSource);
    esm.eventTarget.addEventListener(dist_esm.Enums.Events.SEGMENTATION_ADDED, this._onSegmentationAddedFromSource);
  }
  getCornerstoneSegmentation(segmentationId) {
    return dist_esm.segmentation.state.getSegmentation(segmentationId);
  }
  _highlightLabelmap(segmentIndex, alpha, hideOthers, segments, viewportId, animationLength, representation) {
    const {
      segmentationId
    } = representation;
    const newSegmentSpecificConfig = {
      fillAlpha: alpha
    };
    if (hideOthers) {
      throw new Error('hideOthers is not working right now');
      for (let i = 0; i < segments.length; i++) {
        if (i !== segmentIndex) {
          newSegmentSpecificConfig[i] = {
            fillAlpha: 0
          };
        }
      }
    }
    const {
      fillAlpha
    } = this.getStyle({
      viewportId,
      segmentationId,
      type: LABELMAP,
      segmentIndex
    });
    let startTime = null;
    const animation = timestamp => {
      if (startTime === null) {
        startTime = timestamp;
      }
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / animationLength, 1);
      dist_esm.segmentation.config.style.setStyle({
        segmentationId,
        segmentIndex,
        type: LABELMAP
      }, {
        fillAlpha: easeInOutBell(progress, fillAlpha)
      });
      if (progress < 1) {
        requestAnimationFrame(animation);
      } else {
        dist_esm.segmentation.config.style.setStyle({
          segmentationId,
          segmentIndex,
          type: LABELMAP
        }, {});
      }
    };
    requestAnimationFrame(animation);
  }
  _highlightContour(segmentIndex, alpha, hideOthers, segments, viewportId, animationLength, representation) {
    const {
      segmentationId
    } = representation;
    const startTime = performance.now();
    const prevStyle = dist_esm.segmentation.config.style.getStyle({
      type: CONTOUR
    });
    const prevOutlineWidth = prevStyle.outlineWidth;
    // make this configurable
    const baseline = Math.max(prevOutlineWidth * 3.5, 5);
    const animate = currentTime => {
      const progress = (currentTime - startTime) / animationLength;
      if (progress >= 1) {
        dist_esm.segmentation.config.style.resetToGlobalStyle();
        return;
      }
      const reversedProgress = easeInOutBellRelative(progress, baseline, prevOutlineWidth);
      dist_esm.segmentation.config.style.setStyle({
        segmentationId,
        segmentIndex,
        type: CONTOUR
      }, {
        outlineWidth: reversedProgress
      });
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
  _setActiveSegment(segmentationId, segmentIndex) {
    dist_esm.segmentation.segmentIndex.setActiveSegmentIndex(segmentationId, segmentIndex);
  }
  _getVolumeIdForDisplaySet(displaySet) {
    const volumeLoaderSchema = displaySet.volumeLoaderSchema ?? VOLUME_LOADER_SCHEME;
    return `${volumeLoaderSchema}:${displaySet.displaySetInstanceUID}`;
  }
  _getSegmentCenter(segmentationId, segmentIndex) {
    const segmentation = this.getSegmentation(segmentationId);
    if (!segmentation) {
      return;
    }
    const {
      segments
    } = segmentation;
    const {
      cachedStats
    } = segments[segmentIndex];
    if (cachedStats?.center) {
      const {
        center
      } = cachedStats;
      return center;
    }
    if (cachedStats?.namedStats?.center) {
      return {
        world: cachedStats.namedStats.center.value
      };
    }
  }
  _setSegmentLockedStatus(segmentationId, segmentIndex, isLocked) {
    dist_esm.segmentation.segmentLocking.setSegmentIndexLocked(segmentationId, segmentIndex, isLocked);
  }
  _setSegmentVisibility(viewportId, segmentationId, segmentIndex, isVisible, type) {
    dist_esm.segmentation.config.visibility.setSegmentIndexVisibility(viewportId, {
      segmentationId,
      type
    }, segmentIndex, isVisible);
  }
  _setSegmentLabel(segmentationId, segmentIndex, segmentLabel) {
    const segmentation = this.getCornerstoneSegmentation(segmentationId);
    const {
      segments
    } = segmentation;
    segments[segmentIndex].label = segmentLabel;
    dist_esm.segmentation.updateSegmentations([{
      segmentationId,
      payload: {
        segments
      }
    }]);
  }
}
_SegmentationService = SegmentationService;
SegmentationService.REGISTRATION = {
  name: 'segmentationService',
  altName: 'SegmentationService',
  create: ({
    servicesManager
  }) => {
    return new _SegmentationService({
      servicesManager
    });
  }
};
/* harmony default export */ const SegmentationService_SegmentationService = (SegmentationService);

;// ../../../extensions/cornerstone/src/services/SegmentationService/index.ts

/* harmony default export */ const services_SegmentationService = (SegmentationService_SegmentationService);
;// ../../../extensions/cornerstone/src/utils/getCornerstoneViewportType.ts

const STACK = 'stack';
const VOLUME = 'volume';
const ORTHOGRAPHIC = 'orthographic';
const VOLUME_3D = 'volume3d';
const VIDEO = 'video';
const WHOLESLIDE = 'wholeslide';
function getCornerstoneViewportType(viewportType, displaySets) {
  const lowerViewportType = displaySets?.[0]?.viewportType?.toLowerCase() || viewportType.toLowerCase();
  if (lowerViewportType === STACK) {
    return esm.Enums.ViewportType.STACK;
  }
  if (lowerViewportType === VIDEO) {
    return esm.Enums.ViewportType.VIDEO;
  }
  if (lowerViewportType === WHOLESLIDE) {
    return esm.Enums.ViewportType.WHOLE_SLIDE;
  }
  if (lowerViewportType === VOLUME || lowerViewportType === ORTHOGRAPHIC) {
    return esm.Enums.ViewportType.ORTHOGRAPHIC;
  }
  if (lowerViewportType === VOLUME_3D) {
    return esm.Enums.ViewportType.VOLUME_3D;
  }
  throw new Error(`Invalid viewport type: ${viewportType}. Valid types are: stack, volume, video, wholeslide`);
}
;// ../../../extensions/cornerstone/src/services/CornerstoneCacheService/CornerstoneCacheService.ts
var _CornerstoneCacheService;



class CornerstoneCacheService {
  constructor(servicesManager) {
    this.stackImageIds = new Map();
    this.volumeImageIds = new Map();
    this.servicesManager = void 0;
    this.servicesManager = servicesManager;
  }
  getCacheSize() {
    return esm.cache.getCacheSize();
  }
  getCacheFreeSpace() {
    return esm.cache.getBytesAvailable();
  }
  async createViewportData(displaySets, viewportOptions, dataSource, initialImageIndex) {
    const viewportType = viewportOptions.viewportType;
    const cs3DViewportType = getCornerstoneViewportType(viewportType, displaySets);
    let viewportData;
    if (cs3DViewportType === esm.Enums.ViewportType.ORTHOGRAPHIC || cs3DViewportType === esm.Enums.ViewportType.VOLUME_3D) {
      viewportData = await this._getVolumeViewportData(dataSource, displaySets, cs3DViewportType);
    } else if (cs3DViewportType === esm.Enums.ViewportType.STACK) {
      // Everything else looks like a stack
      viewportData = await this._getStackViewportData(dataSource, displaySets, initialImageIndex, cs3DViewportType);
    } else {
      viewportData = await this._getOtherViewportData(dataSource, displaySets, initialImageIndex, cs3DViewportType);
    }
    viewportData.viewportType = cs3DViewportType;
    return viewportData;
  }
  async invalidateViewportData(viewportData, invalidatedDisplaySetInstanceUID, dataSource, displaySetService) {
    if (viewportData.viewportType === esm.Enums.ViewportType.STACK) {
      const displaySet = displaySetService.getDisplaySetByUID(invalidatedDisplaySetInstanceUID);
      const imageIds = this._getCornerstoneStackImageIds(displaySet, dataSource);

      // remove images from the cache to be able to re-load them
      imageIds.forEach(imageId => {
        if (esm.cache.getImageLoadObject(imageId)) {
          esm.cache.removeImageLoadObject(imageId);
        }
      });
      return {
        viewportType: esm.Enums.ViewportType.STACK,
        data: {
          StudyInstanceUID: displaySet.StudyInstanceUID,
          displaySetInstanceUID: invalidatedDisplaySetInstanceUID,
          imageIds
        }
      };
    }

    // Todo: grab the volume and get the id from the viewport itself
    const volumeId = `${VOLUME_LOADER_SCHEME}:${invalidatedDisplaySetInstanceUID}`;
    const volume = esm.cache.getVolume(volumeId);
    if (volume) {
      if (volume.imageIds) {
        // also for each imageId in the volume, remove the imageId from the cache
        // since that will hold the old metadata as well

        volume.imageIds.forEach(imageId => {
          if (esm.cache.getImageLoadObject(imageId)) {
            esm.cache.removeImageLoadObject(imageId, {
              force: true
            });
          }
        });
      }

      // this shouldn't be via removeVolumeLoadObject, since that will
      // remove the texture as well, but here we really just need a remove
      // from registry so that we load it again
      esm.cache._volumeCache.delete(volumeId);
      this.volumeImageIds.delete(volumeId);
    }
    const displaySets = viewportData.data.map(({
      displaySetInstanceUID
    }) => displaySetService.getDisplaySetByUID(displaySetInstanceUID));
    const newViewportData = await this._getVolumeViewportData(dataSource, displaySets, viewportData.viewportType);
    return newViewportData;
  }
  async _getOtherViewportData(dataSource, displaySets, _initialImageIndex, viewportType) {
    // TODO - handle overlays and secondary display sets, but for now assume
    // the 1st display set is the one of interest
    const [displaySet] = displaySets;
    if (!displaySet.imageIds) {
      displaySet.imagesIds = this._getCornerstoneStackImageIds(displaySet, dataSource);
    }
    const {
      imageIds: data,
      viewportType: dsViewportType
    } = displaySet;
    return {
      viewportType: dsViewportType || viewportType,
      data: displaySets
    };
  }
  async _getStackViewportData(dataSource, displaySets, initialImageIndex, viewportType) {
    const {
      uiNotificationService
    } = this.servicesManager.services;
    const overlayDisplaySets = displaySets.filter(ds => ds.isOverlayDisplaySet);
    for (const overlayDisplaySet of overlayDisplaySets) {
      if (overlayDisplaySet.load && overlayDisplaySet.load instanceof Function) {
        const {
          userAuthenticationService
        } = this.servicesManager.services;
        const headers = userAuthenticationService.getAuthorizationHeader();
        try {
          await overlayDisplaySet.load({
            headers
          });
        } catch (e) {
          uiNotificationService.show({
            title: 'Error loading displaySet',
            message: e.message,
            type: 'error'
          });
          console.error(e);
        }
      }
    }

    // Ensuring the first non-overlay `displaySet` is always the primary one
    const StackViewportData = [];
    for (const displaySet of displaySets) {
      const {
        displaySetInstanceUID,
        StudyInstanceUID,
        isCompositeStack
      } = displaySet;
      if (displaySet.load && displaySet.load instanceof Function) {
        const {
          userAuthenticationService
        } = this.servicesManager.services;
        const headers = userAuthenticationService.getAuthorizationHeader();
        try {
          await displaySet.load({
            headers
          });
        } catch (e) {
          uiNotificationService.show({
            title: 'Error loading displaySet',
            message: e.message,
            type: 'error'
          });
          console.error(e);
        }
      }
      let stackImageIds = this.stackImageIds.get(displaySet.displaySetInstanceUID);
      if (!stackImageIds) {
        stackImageIds = this._getCornerstoneStackImageIds(displaySet, dataSource);
        // assign imageIds to the displaySet
        displaySet.imageIds = stackImageIds;
        this.stackImageIds.set(displaySet.displaySetInstanceUID, stackImageIds);
      }
      StackViewportData.push({
        StudyInstanceUID,
        displaySetInstanceUID,
        isCompositeStack,
        imageIds: stackImageIds,
        initialImageIndex
      });
    }
    return {
      viewportType,
      data: StackViewportData
    };
  }
  async _getVolumeViewportData(dataSource, displaySets, viewportType) {
    // Todo: Check the cache for multiple scenarios to see if we need to
    // decache the volume data from other viewports or not

    const volumeData = [];
    for (const displaySet of displaySets) {
      const {
        Modality
      } = displaySet;
      const isParametricMap = Modality === 'PMAP';
      const isSeg = Modality === 'SEG';

      // Don't create volumes for the displaySets that have custom load
      // function (e.g., SEG, RT, since they rely on the reference volumes
      // and they take care of their own loading after they are created in their
      // getSOPClassHandler method

      if (displaySet.load && displaySet.load instanceof Function) {
        const {
          userAuthenticationService
        } = this.servicesManager.services;
        const headers = userAuthenticationService.getAuthorizationHeader();
        try {
          await displaySet.load({
            headers
          });
        } catch (e) {
          const {
            uiNotificationService
          } = this.servicesManager.services;
          uiNotificationService.show({
            title: 'Error loading displaySet',
            message: e.message,
            type: 'error'
          });
          console.error(e);
        }

        // Parametric maps have a `load` method but it should not be loaded in the
        // same way as SEG and RTSTRUCT but like a normal volume
        if (!isParametricMap) {
          volumeData.push({
            studyInstanceUID: displaySet.StudyInstanceUID,
            displaySetInstanceUID: displaySet.displaySetInstanceUID
          });

          // Todo: do some cache check and empty the cache if needed
          continue;
        }
      }
      const volumeLoaderSchema = displaySet.volumeLoaderSchema ?? VOLUME_LOADER_SCHEME;
      const volumeId = `${volumeLoaderSchema}:${displaySet.displaySetInstanceUID}`;
      let volumeImageIds = this.volumeImageIds.get(displaySet.displaySetInstanceUID);
      let volume = esm.cache.getVolume(volumeId);

      // Parametric maps do not have image ids but they already have volume data
      // therefore a new volume should not be created.
      if (!isParametricMap && !isSeg && (!volumeImageIds || !volume)) {
        volumeImageIds = this._getCornerstoneVolumeImageIds(displaySet, dataSource);
        volume = await esm.volumeLoader.createAndCacheVolume(volumeId, {
          imageIds: volumeImageIds
        });
        this.volumeImageIds.set(displaySet.displaySetInstanceUID, volumeImageIds);

        // Add imageIds to the displaySet for volumes
        displaySet.imageIds = volumeImageIds;
      }
      volumeData.push({
        StudyInstanceUID: displaySet.StudyInstanceUID,
        displaySetInstanceUID: displaySet.displaySetInstanceUID,
        volume,
        volumeId,
        imageIds: volumeImageIds,
        isDynamicVolume: displaySet.isDynamicVolume
      });
    }
    return {
      viewportType,
      data: volumeData
    };
  }
  _getCornerstoneStackImageIds(displaySet, dataSource) {
    return dataSource.getImageIdsForDisplaySet(displaySet);
  }
  _getCornerstoneVolumeImageIds(displaySet, dataSource) {
    if (displaySet.imageIds) {
      return displaySet.imageIds;
    }
    const stackImageIds = this._getCornerstoneStackImageIds(displaySet, dataSource);
    return stackImageIds;
  }
}
_CornerstoneCacheService = CornerstoneCacheService;
CornerstoneCacheService.REGISTRATION = {
  name: 'cornerstoneCacheService',
  altName: 'CornerstoneCacheService',
  create: ({
    servicesManager
  }) => {
    return new _CornerstoneCacheService(servicesManager);
  }
};
/* harmony default export */ const CornerstoneCacheService_CornerstoneCacheService = (CornerstoneCacheService);
;// ../../../extensions/cornerstone/src/services/CornerstoneCacheService/index.js

/* harmony default export */ const services_CornerstoneCacheService = (CornerstoneCacheService_CornerstoneCacheService);
;// ../../../extensions/cornerstone/src/services/ViewportService/constants.ts
const RENDERING_ENGINE_ID = 'OHIFCornerstoneRenderingEngine';

;// ../../../extensions/cornerstone/src/utils/getCornerstoneBlendMode.ts

const MIP = 'mip';
const MINIP = 'minip';
const AVG = 'avg';
function getCornerstoneBlendMode(blendMode) {
  if (!blendMode) {
    return esm.Enums.BlendModes.COMPOSITE;
  }
  if (blendMode.toLowerCase() === MIP) {
    return esm.Enums.BlendModes.MAXIMUM_INTENSITY_BLEND;
  }
  if (blendMode.toLowerCase() === MINIP) {
    return esm.Enums.BlendModes.MINIMUM_INTENSITY_BLEND;
  }
  if (blendMode.toLowerCase() === AVG) {
    return esm.Enums.BlendModes.AVERAGE_INTENSITY_BLEND;
  }
  throw new Error(`Unsupported blend mode: ${blendMode}`);
}
;// ../../../extensions/cornerstone/src/utils/getCornerstoneOrientation.ts

const AXIAL = 'axial';
const SAGITTAL = 'sagittal';
const CORONAL = 'coronal';
function getCornerstoneOrientation(orientation) {
  if (orientation) {
    switch (orientation.toLowerCase()) {
      case AXIAL:
        return esm.Enums.OrientationAxis.AXIAL;
      case SAGITTAL:
        return esm.Enums.OrientationAxis.SAGITTAL;
      case CORONAL:
        return esm.Enums.OrientationAxis.CORONAL;
      default:
        return esm.Enums.OrientationAxis.ACQUISITION;
    }
  }
  return esm.Enums.OrientationAxis.ACQUISITION;
}
;// ../../../extensions/cornerstone/src/services/ViewportService/Viewport.ts




const Viewport_STACK = 'stack';
const DEFAULT_TOOLGROUP_ID = 'default';

// Return true if the data contains the given display set UID OR the imageId
// if it is a composite object.
const dataContains = ({
  data,
  displaySetUID,
  imageId,
  viewport
}) => {
  if (imageId && data.isCompositeStack && data.imageIds) {
    return !!data.imageIds.find(dataId => dataId === imageId);
  }
  if (imageId && (data.volumeId || viewport instanceof esm.VolumeViewport)) {
    const isAcquisition = !!viewport.getCurrentImageId();
    if (!isAcquisition) {
      return false;
    }
    const imageURI = esm.utilities.imageIdToURI(imageId);
    const hasImageId = viewport.hasImageURI(imageURI);
    if (hasImageId) {
      return true;
    }
  }
  if (data.displaySetInstanceUID === displaySetUID) {
    return true;
  }
  return false;
};
class ViewportInfo {
  constructor(viewportId) {
    this.viewportId = '';
    this.element = void 0;
    this.viewportOptions = void 0;
    this.displaySetOptions = void 0;
    this.viewportData = void 0;
    this.renderingEngineId = void 0;
    this.viewReference = void 0;
    this.destroy = () => {
      this.element = null;
      this.viewportData = null;
      this.viewportOptions = null;
      this.displaySetOptions = null;
    };
    this.viewportId = viewportId;
    this.setPublicViewportOptions({});
    this.setPublicDisplaySetOptions([{}]);
  }

  /**
   * Return true if the viewport contains the given display set UID,
   * OR if it is a composite stack and contains the given imageId
   */
  contains(displaySetUID, imageId) {
    if (!this.viewportData?.data) {
      return false;
    }
    const {
      viewport
    } = (0,esm.getEnabledElementByViewportId)(this.viewportId) || {};
    if (this.viewportData.data.length) {
      return !!this.viewportData.data.find(data => dataContains({
        data,
        displaySetUID,
        imageId,
        viewport
      }));
    }
    return dataContains({
      data: this.viewportData.data,
      displaySetUID,
      imageId,
      viewport
    });
  }
  setRenderingEngineId(renderingEngineId) {
    this.renderingEngineId = renderingEngineId;
  }
  getRenderingEngineId() {
    return this.renderingEngineId;
  }
  setViewportId(viewportId) {
    this.viewportId = viewportId;
  }
  setElement(element) {
    this.element = element;
  }
  setViewportData(viewportData) {
    this.viewportData = viewportData;
  }
  getViewportData() {
    return this.viewportData;
  }
  getElement() {
    return this.element;
  }
  getViewportId() {
    return this.viewportId;
  }
  getViewReference() {
    return this.viewportOptions?.viewReference;
  }
  setPublicDisplaySetOptions(publicDisplaySetOptions) {
    // map the displaySetOptions and check if they are undefined then set them to default values
    const displaySetOptions = this.mapDisplaySetOptions(publicDisplaySetOptions);
    this.setDisplaySetOptions(displaySetOptions);
    return this.displaySetOptions;
  }
  hasDisplaySet(displaySetInstanceUID) {
    // Todo: currently this does not work for non image & referenceImage displaySets.
    // Since SEG and other derived displaySets are loaded in a different way, and not
    // via cornerstoneViewportService
    let viewportData = this.getViewportData();
    if (viewportData.viewportType === esm.Enums.ViewportType.ORTHOGRAPHIC || viewportData.viewportType === esm.Enums.ViewportType.VOLUME_3D) {
      viewportData = viewportData;
      return viewportData.data.some(({
        displaySetInstanceUID: dsUID
      }) => dsUID === displaySetInstanceUID);
    }
    viewportData = viewportData;
    return viewportData.data.displaySetInstanceUID === displaySetInstanceUID;
  }

  /**
   *
   * @param viewportOptionsEntry - the base values for the options
   * @param viewportTypeDisplaySet  - allows overriding the viewport type
   */
  setPublicViewportOptions(viewportOptionsEntry, viewportTypeDisplaySet) {
    const ohifViewportType = viewportTypeDisplaySet || viewportOptionsEntry.viewportType || Viewport_STACK;
    const {
      presentationIds
    } = viewportOptionsEntry;
    let {
      toolGroupId = DEFAULT_TOOLGROUP_ID
    } = viewportOptionsEntry;
    // Just assign the orientation for any viewport type and let the viewport deal with it
    const orientation = getCornerstoneOrientation(viewportOptionsEntry.orientation);
    const viewportType = getCornerstoneViewportType(ohifViewportType);
    if (!toolGroupId) {
      toolGroupId = DEFAULT_TOOLGROUP_ID;
    }
    this.setViewportOptions({
      ...viewportOptionsEntry,
      viewportId: this.viewportId,
      viewportType: viewportType,
      orientation,
      toolGroupId,
      presentationIds
    });
    return this.viewportOptions;
  }
  setViewportOptions(viewportOptions) {
    this.viewportOptions = viewportOptions;
  }
  getViewportOptions() {
    return this.viewportOptions;
  }
  getPresentationIds() {
    const {
      presentationIds
    } = this.viewportOptions;
    return presentationIds;
  }
  setDisplaySetOptions(displaySetOptions) {
    this.displaySetOptions = displaySetOptions;
  }
  getSyncGroups() {
    this.viewportOptions.syncGroups ||= [];
    return this.viewportOptions.syncGroups;
  }
  getDisplaySetOptions() {
    return this.displaySetOptions;
  }
  getViewportType() {
    return this.viewportOptions.viewportType || esm.Enums.ViewportType.STACK;
  }
  getToolGroupId() {
    return this.viewportOptions.toolGroupId;
  }
  getBackground() {
    return this.viewportOptions.background || [0, 0, 0];
  }
  getOrientation() {
    return this.viewportOptions.orientation;
  }
  setOrientation(orientation) {
    this.viewportOptions.orientation = orientation;
  }
  getDisplayArea() {
    return this.viewportOptions.displayArea;
  }
  getInitialImageOptions() {
    return this.viewportOptions.initialImageOptions;
  }

  // Handle incoming public display set options or a display set select
  // with a contained options.
  mapDisplaySetOptions(options = [{}]) {
    const displaySetOptions = [];
    options.forEach(item => {
      let option = item?.options || item;
      if (!option) {
        option = {
          blendMode: undefined,
          slabThickness: undefined,
          colormap: undefined,
          voi: {},
          voiInverted: false
        };
      }
      const blendMode = getCornerstoneBlendMode(option.blendMode);
      displaySetOptions.push({
        voi: option.voi,
        voiInverted: option.voiInverted,
        colormap: option.colormap,
        slabThickness: option.slabThickness,
        blendMode,
        displayPreset: option.displayPreset
      });
    });
    return displaySetOptions;
  }
}
/* harmony default export */ const Viewport = (ViewportInfo);
;// ../../../extensions/cornerstone/src/utils/JumpPresets.ts
/**
 * Jump Presets - This enum defines the 3 jump states which are available
 * to be used with the jumpToSlice utility function.
 */
var JumpPresets = /*#__PURE__*/function (JumpPresets) {
  /** Jumps to first slice */
  JumpPresets["First"] = "first";
  /** Jumps to last slice */
  JumpPresets["Last"] = "last";
  /** Jumps to the middle slice */
  JumpPresets["Middle"] = "middle";
  return JumpPresets;
}(JumpPresets || {});
/* harmony default export */ const utils_JumpPresets = (JumpPresets);
;// ../../../extensions/cornerstone/src/services/ViewportService/CornerstoneViewportService.ts
var _CornerstoneViewportService;










const CornerstoneViewportService_EVENTS = {
  VIEWPORT_DATA_CHANGED: 'event::cornerstoneViewportService:viewportDataChanged',
  VIEWPORT_VOLUMES_CHANGED: 'event::cornerstoneViewportService:viewportVolumesChanged'
};
const MIN_STACK_VIEWPORTS_TO_ENQUEUE_RESIZE = 12;
const MIN_VOLUME_VIEWPORTS_TO_ENQUEUE_RESIZE = 6;
const WITH_NAVIGATION = {
  withNavigation: true,
  withOrientation: false
};
const WITH_ORIENTATION = {
  withNavigation: true,
  withOrientation: true
};

/**
 * Handles cornerstone viewport logic including enabling, disabling, and
 * updating the viewport.
 */
class CornerstoneViewportService extends src.PubSubService {
  constructor(servicesManager) {
    super(CornerstoneViewportService_EVENTS);
    this.renderingEngine = void 0;
    this.viewportsById = new Map();
    this.viewportGridResizeObserver = void 0;
    this.viewportsDisplaySets = new Map();
    this.beforeResizePositionPresentations = new Map();
    // Some configs
    this.servicesManager = null;
    this.resizeQueue = [];
    this.viewportResizeTimer = null;
    this.gridResizeDelay = 50;
    this.gridResizeTimeOut = null;
    this.hangingProtocolService = void 0;
    this.viewportsInfo = void 0;
    this.sceneVolumeInputs = void 0;
    this.viewportDivElements = void 0;
    this.ViewportPropertiesMap = void 0;
    this.volumeUIDs = void 0;
    this.displaySetsNeedRerendering = void 0;
    this.viewportDisplaySets = void 0;
    this.renderingEngine = null;
    this.viewportGridResizeObserver = null;
    this.servicesManager = servicesManager;
  }
  /**
   * Adds the HTML element to the viewportService
   * @param {*} viewportId
   * @param {*} elementRef
   */
  enableViewport(viewportId, elementRef) {
    const viewportInfo = new Viewport(viewportId);
    viewportInfo.setElement(elementRef);
    this.viewportsById.set(viewportId, viewportInfo);
  }
  getViewportIds() {
    return Array.from(this.viewportsById.keys());
  }

  /**
   * It retrieves the renderingEngine if it does exist, or creates one otherwise
   * @returns {RenderingEngine} rendering engine
   */
  getRenderingEngine() {
    // get renderingEngine from cache if it exists
    const renderingEngine = (0,esm.getRenderingEngine)(RENDERING_ENGINE_ID);
    if (renderingEngine) {
      this.renderingEngine = renderingEngine;
      return this.renderingEngine;
    }
    if (!renderingEngine || renderingEngine.hasBeenDestroyed) {
      this.renderingEngine = new esm.RenderingEngine(RENDERING_ENGINE_ID);
    }
    return this.renderingEngine;
  }

  /**
   * It triggers the resize on the rendering engine, and renders the viewports
   *
   */
  resize() {
    // https://stackoverflow.com/a/26279685
    // This resize() call, among other things, rerenders the viewports. But when the entire viewer is
    // display: none'd, it makes the size of all hidden elements 0, including the viewport canvas and its containers.
    // Even if the viewer is later displayed again, trying to render when the size is 0 permanently "breaks" the
    // viewport, making it fully black even after the size is normal again. So just ignore resize events when hidden:
    const areViewportsHidden = Array.from(this.viewportsById.values()).every(viewportInfo => {
      const element = viewportInfo.getElement();
      return element.clientWidth === 0 && element.clientHeight === 0;
    });
    if (areViewportsHidden) {
      console.warn('Ignoring resize when viewports have size 0');
      return;
    }
    const numStackViewportsInViewportGrid = Array.from(this.viewportsById.values()).filter(viewportInfo => viewportInfo.getViewportType() === esm.Enums.ViewportType.STACK).length;
    const numVolumeViewportsInViewportGrid = Array.from(this.viewportsById.values()).filter(viewportInfo => viewportInfo.getViewportType() === esm.Enums.ViewportType.ORTHOGRAPHIC).length;
    const isEasyResize = numStackViewportsInViewportGrid <= MIN_STACK_VIEWPORTS_TO_ENQUEUE_RESIZE && numVolumeViewportsInViewportGrid <= MIN_VOLUME_VIEWPORTS_TO_ENQUEUE_RESIZE;

    // if there is a grid resize happening, it means the viewport grid
    // has been manipulated (e.g., panels closed, added, etc.) and we need
    // to resize all viewports, so we will add a timeout here to make sure
    // we don't double resize the viewports when viewports in the grid are
    // resized individually
    if (isEasyResize) {
      this.performResize();
      this.resetGridResizeTimeout();
      this.resizeQueue = [];
      clearTimeout(this.viewportResizeTimer);
    } else {
      this.enqueueViewportResizeRequest();
    }
  }

  /**
   * Removes the viewport from cornerstone, and destroys the rendering engine
   */
  destroy() {
    this._removeResizeObserver();
    this.viewportGridResizeObserver = null;
    try {
      this.renderingEngine?.destroy?.();
    } catch (e) {
      console.warn('Rendering engine not destroyed', e);
    }
    this.viewportsDisplaySets.clear();
    this.renderingEngine = null;
    esm.cache.purgeCache();
  }

  /**
   * Disables the viewport inside the renderingEngine, if no viewport is left
   * it destroys the renderingEngine.
   *
   * This is called when the element goes away entirely - with new viewportId's
   * created for every new viewport, this will be called whenever the set of
   * viewports is changed, but NOT when the viewport position changes only.
   *
   * @param viewportId - The viewportId to disable
   */
  disableElement(viewportId) {
    this.renderingEngine?.disableElement(viewportId);

    // clean up
    this.viewportsById.delete(viewportId);
    this.viewportsDisplaySets.delete(viewportId);
  }

  /**
   * Sets the presentations for a given viewport. Presentations is an object
   * that can define the lut or position for a viewport.
   *
   * @param viewportId - The ID of the viewport.
   * @param presentations - The presentations to apply to the viewport.
   * @param viewportInfo - Contains a view reference for immediate application
   */
  setPresentations(viewportId, presentations) {
    const viewport = this.getCornerstoneViewport(viewportId);
    if (!viewport || !presentations) {
      return;
    }
    const {
      lutPresentation,
      positionPresentation,
      segmentationPresentation
    } = presentations;

    // Always set the segmentation presentation first, since there might be some
    // lutpresentation states that need to be set on the segmentation
    // Todo: i think we should even await this
    this._setSegmentationPresentation(viewport, segmentationPresentation);
    this._setLutPresentation(viewport, lutPresentation);
    this._setPositionPresentation(viewport, {
      ...positionPresentation,
      viewportId
    });
  }

  /**
   * Stores the presentation state for a given viewport inside the
   * each store. This is used to persist the presentation state
   * across different scenarios e.g., when the viewport is changing the
   * display set, or when the viewport is moving to a different layout.
   *
   * @param viewportId The ID of the viewport.
   */
  storePresentation({
    viewportId
  }) {
    const presentationIds = this.getPresentationIds(viewportId);
    const {
      syncGroupService
    } = this.servicesManager.services;
    const synchronizers = syncGroupService.getSynchronizersForViewport(viewportId);
    if (!presentationIds || Object.keys(presentationIds).length === 0) {
      return null;
    }
    const {
      lutPresentationId,
      positionPresentationId,
      segmentationPresentationId
    } = presentationIds;
    const positionPresentation = this._getPositionPresentation(viewportId);
    const lutPresentation = this._getLutPresentation(viewportId);
    const segmentationPresentation = this._getSegmentationPresentation(viewportId);
    const {
      setLutPresentation
    } = useLutPresentationStore/* useLutPresentationStore */.I.getState();
    const {
      setPositionPresentation
    } = usePositionPresentationStore/* usePositionPresentationStore */.q.getState();
    const {
      setSynchronizers
    } = useSynchronizersStore/* useSynchronizersStore */.U.getState();
    const {
      setSegmentationPresentation
    } = useSegmentationPresentationStore/* useSegmentationPresentationStore */.v.getState();
    if (lutPresentationId) {
      setLutPresentation(lutPresentationId, lutPresentation);
    }
    if (positionPresentationId) {
      setPositionPresentation(positionPresentationId, positionPresentation);
    }
    if (segmentationPresentationId) {
      setSegmentationPresentation(segmentationPresentationId, segmentationPresentation);
    }
    if (synchronizers?.length) {
      setSynchronizers(viewportId, synchronizers.map(synchronizer => ({
        id: synchronizer.id,
        sourceViewports: [...synchronizer.getSourceViewports()],
        targetViewports: [...synchronizer.getTargetViewports()]
      })));
    }
  }

  /**
   * Retrieves the presentations for a given viewport.
   * @param viewportId - The ID of the viewport.
   * @returns The presentations for the viewport.
   */
  getPresentations(viewportId) {
    const positionPresentation = this._getPositionPresentation(viewportId);
    const lutPresentation = this._getLutPresentation(viewportId);
    const segmentationPresentation = this._getSegmentationPresentation(viewportId);
    return {
      positionPresentation,
      lutPresentation,
      segmentationPresentation
    };
  }
  getPresentationIds(viewportId) {
    const viewportInfo = this.viewportsById.get(viewportId);
    if (!viewportInfo) {
      return null;
    }
    return viewportInfo.getPresentationIds();
  }
  _getPositionPresentation(viewportId) {
    const csViewport = this.getCornerstoneViewport(viewportId);
    if (!csViewport) {
      return;
    }
    const viewportInfo = this.viewportsById.get(viewportId);
    return {
      viewportType: viewportInfo.getViewportType(),
      viewReference: csViewport instanceof esm.VolumeViewport3D ? null : csViewport.getViewReference(),
      viewPresentation: csViewport.getViewPresentation({
        pan: true,
        zoom: true
      }),
      viewportId
    };
  }
  _getLutPresentation(viewportId) {
    const csViewport = this.getCornerstoneViewport(viewportId);
    if (!csViewport) {
      return;
    }
    const cleanProperties = properties => {
      if (properties?.isComputedVOI) {
        delete properties?.voiRange;
        delete properties?.VOILUTFunction;
      }
      if (properties?.colormap) {
        if (properties.colormap?.opacity?.length === 0) {
          delete properties.colormap.opacity;
        }
      }
      return properties;
    };
    const properties = csViewport instanceof esm.BaseVolumeViewport ? new Map() : cleanProperties(csViewport.getProperties());
    if (properties instanceof Map) {
      const volumeIds = csViewport.getAllVolumeIds();
      volumeIds?.forEach(volumeId => {
        const csProps = cleanProperties(csViewport.getProperties(volumeId));
        properties.set(volumeId, csProps);
      });
    }
    const viewportInfo = this.viewportsById.get(viewportId);
    return {
      viewportType: viewportInfo.getViewportType(),
      properties
    };
  }
  _getSegmentationPresentation(viewportId) {
    const {
      segmentationService
    } = this.servicesManager.services;
    const presentation = segmentationService.getPresentation(viewportId);
    return presentation;
  }

  /**
   * Sets the viewport data for a viewport.
   * @param viewportId - The ID of the viewport to set the data for.
   * @param viewportData - The viewport data to set.
   * @param publicViewportOptions - The public viewport options.
   * @param publicDisplaySetOptions - The public display set options.
   * @param presentations - The presentations to set.
   */
  setViewportData(viewportId, viewportData, publicViewportOptions, publicDisplaySetOptions, presentations) {
    const renderingEngine = this.getRenderingEngine();

    // if not valid viewportData then return early
    if (viewportData.viewportType === esm.Enums.ViewportType.STACK) {
      // check if imageIds is valid
      if (!viewportData.data[0].imageIds?.length) {
        return;
      }
    }

    // This is the old viewportInfo, which may have old options but we might be
    // using its viewport (same viewportId as the new viewportInfo)
    const viewportInfo = this.viewportsById.get(viewportId);

    // We should store the presentation for the current viewport since we can't only
    // rely to store it WHEN the viewport is disabled since we might keep around the
    // same viewport/element and just change the viewportData for it (drag and drop etc.)
    // the disableElement storePresentation handle would not be called in this case
    // and we would lose the presentation.
    this.storePresentation({
      viewportId: viewportInfo.getViewportId()
    });
    if (!viewportInfo) {
      throw new Error('element is not enabled for the given viewportId');
    }

    // override the viewportOptions and displaySetOptions with the public ones
    // since those are the newly set ones, we set them here so that it handles defaults
    const displaySetOptions = viewportInfo.setPublicDisplaySetOptions(publicDisplaySetOptions);
    // Specify an over-ride for the viewport type, even though it is in the public
    // viewport options, because the one in the viewportData is a requirement based on the
    // type of data being displayed.
    const viewportOptions = viewportInfo.setPublicViewportOptions(publicViewportOptions, viewportData.viewportType);
    const element = viewportInfo.getElement();
    const type = viewportInfo.getViewportType();
    const background = viewportInfo.getBackground();
    const orientation = viewportInfo.getOrientation();
    const displayArea = viewportInfo.getDisplayArea();
    const viewportInput = {
      viewportId,
      element,
      type,
      defaultOptions: {
        background,
        orientation,
        displayArea
      }
    };

    // Rendering Engine Id set should happen before enabling the element
    // since there are callbacks that depend on the renderingEngine id
    // Todo: however, this is a limitation which means that we can't change
    // the rendering engine id for a given viewport which might be a super edge
    // case
    viewportInfo.setRenderingEngineId(renderingEngine.id);

    // Todo: this is not optimal at all, we are re-enabling the already enabled
    // element which is not what we want. But enabledElement as part of the
    // renderingEngine is designed to be used like this. This will trigger
    // ENABLED_ELEMENT again and again, which will run onEnableElement callbacks
    renderingEngine.enableElement(viewportInput);
    viewportInfo.setViewportOptions(viewportOptions);
    viewportInfo.setDisplaySetOptions(displaySetOptions);
    viewportInfo.setViewportData(viewportData);
    viewportInfo.setViewportId(viewportId);
    this.viewportsById.set(viewportId, viewportInfo);
    const viewport = renderingEngine.getViewport(viewportId);
    const displaySetPromise = this._setDisplaySets(viewport, viewportData, viewportInfo, presentations);

    // The broadcast event here ensures that listeners have a valid, up to date
    // viewport to access.  Doing it too early can result in exceptions or
    // invalid data.
    displaySetPromise.then(() => {
      this._broadcastEvent(this.EVENTS.VIEWPORT_DATA_CHANGED, {
        viewportData,
        viewportId
      });
    });
  }
  getViewportOptions(viewportId) {
    return this.viewportsById.get(viewportId).getViewportOptions();
  }

  /**
   * Retrieves the Cornerstone viewport with the specified ID.
   *
   * @param viewportId - The ID of the viewport.
   * @returns The Cornerstone viewport object if found, otherwise null.
   */
  getCornerstoneViewport(viewportId) {
    const viewportInfo = this.getViewportInfo(viewportId);
    if (!viewportInfo || !this.renderingEngine || this.renderingEngine.hasBeenDestroyed) {
      return null;
    }
    const viewport = this.renderingEngine.getViewport(viewportId);
    return viewport;
  }

  /**
   * Retrieves the viewport information for a given viewport ID. The viewport information
   * is the OHIF construct that holds different options and data for a given viewport and
   * is different from the cornerstone viewport.
   *
   * @param viewportId The ID of the viewport.
   * @returns The viewport information.
   */
  getViewportInfo(viewportId) {
    return this.viewportsById.get(viewportId);
  }
  getOrientation(viewportId) {
    const viewportInfo = this.getViewportInfo(viewportId);
    return viewportInfo.getOrientation();
  }

  /**
   * Looks through the viewports to see if the specified measurement can be
   * displayed in one of the viewports. This function tries to get a "best fit"
   * viewport to display the image in where it matches, in order:
   *   * Active viewport that can be navigated to the given image without orientation change
   *   * Other viewport that can be navigated to the given image without orientation change
   *   * Active viewport that can change orientation to display the image
   *   * Other viewport that can change orientation to display the image
   *
   * It returns `null` otherwise, indicating that a viewport needs display set/type
   * changes in order to display the image.
   *
   * Notes:
   *   * If the display set is displayed in multiple viewports all needing orientation change,
   *     then the active one or first one listed will be modified.  This can create unexpected
   *     behaviour for MPR views.
   *   * If the image is contained in multiple display sets, then the first one
   *     found will be navigated (active first, followed by first found)
   *
   * @param measurement - The measurement that is desired to view.
   * @param activeViewportId - the index that was active at the time the jump
   *          was initiated.
   * @return the viewportId that the measurement should be displayed in.
   */
  findNavigationCompatibleViewportId(activeViewportId, metadata) {
    // First check if the active viewport can just be navigated to show the given item
    const activeViewport = this.getCornerstoneViewport(activeViewportId);
    if (!activeViewport) {
      console.warn('No active viewport found for', activeViewportId);
    }
    if (activeViewport?.isReferenceViewable(metadata, {
      withNavigation: true
    })) {
      return activeViewportId;
    }

    // Next, see if any viewport could be navigated to show the given item,
    // without considering orientation changes.
    for (const id of this.viewportsById.keys()) {
      const viewport = this.getCornerstoneViewport(id);
      if (viewport?.isReferenceViewable(metadata, {
        withNavigation: true
      })) {
        return id;
      }
    }

    // No viewport is in the right display set/orientation to show this, so see if
    // the active viewport could change orientations to show this
    if (activeViewport?.isReferenceViewable(metadata, {
      withNavigation: true,
      withOrientation: true
    })) {
      return activeViewportId;
    }

    // See if any viewport could show this with an orientation change
    for (const id of this.viewportsById.keys()) {
      const viewport = this.getCornerstoneViewport(id);
      if (viewport?.isReferenceViewable(metadata, {
        withNavigation: true,
        withOrientation: true
      })) {
        return id;
      }
    }

    // No luck, need to update the viewport itself
    return null;
  }

  /**
   * Figures out which viewport to update when the viewport type needs to change.
   * This may not be the active viewport if there is already a viewport showing
   * the display set, but in the wrong orientation.
   *
   * The viewport will need to update the viewport type and/or display set to
   * display the resulting data.
   *
   * The first choice will be a viewport already showing the correct display set,
   * but showing it as a stack.
   *
   * Second choice is to see if there is a viewport already showing the right
   * orientation for the image, but the wrong display set.  This fixes the
   * case where the user is in MPR and a viewport other than active should be
   * the one to change to display the iamge.
   *
   * Final choice is to use the provide activeViewportId.  This will cover
   * changes to/from video and wsi viewports and other cases where no
   * viewport is really even close to being able to display the measurement.
   */
  findUpdateableViewportConfiguration(activeViewportId, measurement) {
    const {
      metadata,
      displaySetInstanceUID
    } = measurement;
    const {
      volumeId,
      referencedImageId
    } = metadata;
    const {
      displaySetService,
      viewportGridService
    } = this.servicesManager.services;
    const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
    let {
      viewportType
    } = displaySet;
    if (!viewportType) {
      if (referencedImageId && !displaySet.isReconstructable) {
        viewportType = esm.Enums.ViewportType.STACK;
      } else if (volumeId) {
        viewportType = 'volume';
      }
    }

    // Find viewports that could be updated to be volumes to show this view
    // That prefers a viewport already showing the right display set.
    if (volumeId) {
      for (const id of this.viewportsById.keys()) {
        const viewport = this.getCornerstoneViewport(id);
        if (viewport?.isReferenceViewable(metadata, {
          asVolume: true,
          withNavigation: true
        })) {
          return {
            viewportId: id,
            displaySetInstanceUID,
            viewportOptions: {
              viewportType
            }
          };
        }
      }
    }

    // Find a viewport in the correct orientation showing a different display set
    // which could be used to display the annotation.
    const altMetadata = {
      ...metadata,
      volumeId: null,
      referencedImageId: null
    };
    for (const id of this.viewportsById.keys()) {
      const viewport = this.getCornerstoneViewport(id);
      const viewportDisplaySetUID = viewportGridService.getDisplaySetsUIDsForViewport(id)?.[0];
      if (!viewportDisplaySetUID || !viewport) {
        continue;
      }
      if (volumeId) {
        altMetadata.volumeId = viewportDisplaySetUID;
      }
      altMetadata.FrameOfReferenceUID = this._getFrameOfReferenceUID(viewportDisplaySetUID);
      if (viewport.isReferenceViewable(altMetadata, {
        asVolume: true,
        withNavigation: true
      })) {
        return {
          viewportId: id,
          displaySetInstanceUID,
          viewportOptions: {
            viewportType
          }
        };
      }
    }

    // Just display in the active viewport
    return {
      viewportId: activeViewportId,
      displaySetInstanceUID,
      viewportOptions: {
        viewportType
      }
    };
  }

  /**
   * Sets the image data for the given viewport.
   */
  async _setOtherViewport(viewport, viewportData, viewportInfo, _presentations = {}) {
    const [displaySet] = viewportData.data;
    return viewport.setDataIds(displaySet.imageIds, {
      groupId: displaySet.displaySetInstanceUID,
      viewReference: viewportInfo.getViewReference()
    });
  }
  async _setStackViewport(viewport, viewportData, viewportInfo, presentations = {}) {
    const displaySetOptions = viewportInfo.getDisplaySetOptions();
    const displaySetInstanceUIDs = viewportData.data.map(data => data.displaySetInstanceUID);

    // based on the cache service construct always the first one is the non-overlay
    // and the rest are overlays

    this.viewportsDisplaySets.set(viewport.id, [...displaySetInstanceUIDs]);
    const {
      initialImageIndex,
      imageIds
    } = viewportData.data[0];

    // Use the slice index from any provided view reference, as the view reference
    // is being used to navigate to the initial view position for measurement
    // navigation and other navigation forcing specific views.
    let initialImageIndexToUse = presentations?.positionPresentation?.initialImageIndex ?? initialImageIndex;
    const {
      rotation,
      flipHorizontal,
      displayArea
    } = viewportInfo.getViewportOptions();
    const properties = {
      ...presentations.lutPresentation?.properties
    };
    if (!presentations.lutPresentation?.properties) {
      const {
        voi,
        voiInverted,
        colormap
      } = displaySetOptions[0];
      if (voi && (voi.windowWidth || voi.windowCenter)) {
        const {
          lower,
          upper
        } = esm.utilities.windowLevel.toLowHighRange(voi.windowWidth, voi.windowCenter);
        properties.voiRange = {
          lower,
          upper
        };
      }
      properties.invert = voiInverted ?? properties.invert;
      properties.colormap = colormap ?? properties.colormap;
    }
    viewport.element.addEventListener(esm.Enums.Events.VIEWPORT_NEW_IMAGE_SET, evt => {
      const {
        element
      } = evt.detail;
      if (element !== viewport.element) {
        return;
      }
      dist_esm.utilities.stackContextPrefetch.enable(element);
    });
    const overlayProcessingResults = this._processExtraDisplaySetsForViewport(viewport);
    const referencedImageId = presentations?.positionPresentation?.viewReference?.referencedImageId;
    if (referencedImageId) {
      initialImageIndexToUse = imageIds.indexOf(referencedImageId);
    }
    if (initialImageIndexToUse === undefined || initialImageIndexToUse === null || initialImageIndexToUse < 0) {
      initialImageIndexToUse = this._getInitialImageIndexForViewport(viewportInfo, imageIds) || 0;
    }
    return viewport.setStack(imageIds, initialImageIndexToUse).then(() => {
      viewport.setProperties({
        ...properties
      });
      this.setPresentations(viewport.id, presentations, viewportInfo);
      if (overlayProcessingResults?.length) {
        overlayProcessingResults.forEach(overlayProcessingResult => {
          if (overlayProcessingResult?.addOverlayFn) {
            overlayProcessingResult.addOverlayFn();
          }
        });
      }
      if (displayArea) {
        viewport.setDisplayArea(displayArea);
      }
      if (rotation) {
        viewport.setProperties({
          rotation
        });
      }
      if (flipHorizontal) {
        viewport.setCamera({
          flipHorizontal: true
        });
      }
    });
  }
  _getInitialImageIndexForViewport(viewportInfo, imageIds) {
    const initialImageOptions = viewportInfo.getInitialImageOptions();
    if (!initialImageOptions) {
      return;
    }
    const {
      index,
      preset
    } = initialImageOptions;
    const viewportType = viewportInfo.getViewportType();
    let numberOfSlices;
    if (viewportType === esm.Enums.ViewportType.STACK) {
      numberOfSlices = imageIds.length;
    } else if (viewportType === esm.Enums.ViewportType.ORTHOGRAPHIC) {
      const viewport = this.getCornerstoneViewport(viewportInfo.getViewportId());
      const imageSliceData = esm.utilities.getImageSliceDataForVolumeViewport(viewport);
      if (!imageSliceData) {
        return;
      }
      ({
        numberOfSlices
      } = imageSliceData);
    } else {
      return;
    }
    return this._getInitialImageIndex(numberOfSlices, index, preset);
  }
  _getInitialImageIndex(numberOfSlices, imageIndex, preset) {
    const lastSliceIndex = numberOfSlices - 1;
    if (imageIndex !== undefined) {
      return esm.utilities.clip(imageIndex, 0, lastSliceIndex);
    }
    if (preset === utils_JumpPresets.First) {
      return 0;
    }
    if (preset === utils_JumpPresets.Last) {
      return lastSliceIndex;
    }
    if (preset === utils_JumpPresets.Middle) {
      // Note: this is a simple but yet very important formula.
      // since viewport reset works with the middle slice
      // if the below formula is not correct, on a viewport reset
      // it will jump to a different slice than the middle one which
      // was the initial slice, and we have some tools such as Crosshairs
      // which rely on a relative camera modifications and those will break.
      return lastSliceIndex % 2 === 0 ? lastSliceIndex / 2 : (lastSliceIndex + 1) / 2;
    }
    return 0;
  }
  async _setVolumeViewport(viewport, viewportData, viewportInfo, presentations = {}) {
    // TODO: We need to overhaul the way data sources work so requests can be made
    // async. I think we should follow the image loader pattern which is async and
    // has a cache behind it.
    // The problem is that to set this volume, we need the metadata, but the request is
    // already in-flight, and the promise is not cached, so we have no way to wait for
    // it and know when it has fully arrived.
    // loadStudyMetadata(StudyInstanceUID) => Promise([instances for study])
    // loadSeriesMetadata(StudyInstanceUID, SeriesInstanceUID) => Promise([instances for series])
    // If you call loadStudyMetadata and it's not in the DicomMetadataStore cache, it should fire
    // a request through the data source?
    // (This call may or may not create sub-requests for series metadata)
    const {
      displaySetService
    } = this.servicesManager.services;
    const volumeInputArray = [];
    const displaySetOptionsArray = viewportInfo.getDisplaySetOptions();
    const {
      hangingProtocolService
    } = this.servicesManager.services;
    const volumeToLoad = [];
    const displaySetInstanceUIDs = [];
    for (const [index, data] of viewportData.data.entries()) {
      const {
        imageIds,
        displaySetInstanceUID
      } = data;
      let volume = data.volume;
      const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
      if (!volume && displaySet.images) {
        volume = dist_esm.utilities.getOrCreateImageVolume(displaySet.images.map(image => image.imageId));
      }
      displaySetInstanceUIDs.push(displaySetInstanceUID);
      if (!volume) {
        console.log('Volume display set not found');
        continue;
      }
      volumeToLoad.push(volume);
      const displaySetOptions = displaySetOptionsArray[index];
      const {
        volumeId
      } = volume;
      volumeInputArray.push({
        imageIds,
        volumeId,
        modality: displaySet.Modality,
        displaySetInstanceUID,
        blendMode: displaySetOptions.blendMode,
        slabThickness: this._getSlabThickness(displaySetOptions, volumeId)
      });
    }
    this.viewportsDisplaySets.set(viewport.id, displaySetInstanceUIDs);
    const volumesNotLoaded = volumeToLoad.filter(volume => !volume.loadStatus?.loaded);
    if (volumesNotLoaded.length) {
      if (hangingProtocolService.getShouldPerformCustomImageLoad()) {
        // delegate the volume loading to the hanging protocol service if it has a custom image load strategy
        return hangingProtocolService.runImageLoadStrategy({
          viewportId: viewport.id,
          volumeInputArray
        });
      }
      volumesNotLoaded.forEach(volume => {
        if (!volume.loadStatus?.loading && volume.load instanceof Function) {
          volume.load();
        }
      });
    }

    // It's crucial not to return here because the volume may be loaded,
    // but the viewport also needs to set the volume.
    // if (!volumesNotLoaded.length) {
    //   return;
    // }

    // This returns the async continuation only
    return this.setVolumesForViewport(viewport, volumeInputArray, presentations);
  }
  async setVolumesForViewport(viewport, volumeInputArray, presentations) {
    const {
      displaySetService,
      viewportGridService
    } = this.servicesManager.services;
    const viewportInfo = this.getViewportInfo(viewport.id);
    const displaySetOptions = viewportInfo.getDisplaySetOptions();
    const displaySetUIDs = viewportGridService.getDisplaySetsUIDsForViewport(viewport.id);
    const displaySet = displaySetService.getDisplaySetByUID(displaySetUIDs[0]);
    const displaySetModality = displaySet?.Modality;

    // filter overlay display sets (e.g. segmentation) since they will get handled below via the segmentation service
    const filteredVolumeInputArray = volumeInputArray.map((volumeInput, index) => {
      return {
        volumeInput,
        displaySetOptions: displaySetOptions[index]
      };
    }).filter(({
      volumeInput
    }) => {
      const displaySet = displaySetService.getDisplaySetByUID(volumeInput.displaySetInstanceUID);
      return !displaySet?.isOverlayDisplaySet;
    });

    // Todo: use presentations states
    const volumesProperties = filteredVolumeInputArray.map(({
      volumeInput,
      displaySetOptions
    }) => {
      const {
        volumeId
      } = volumeInput;
      const {
        voi,
        voiInverted,
        colormap,
        displayPreset
      } = displaySetOptions;
      const properties = {};
      if (voi && (voi.windowWidth || voi.windowCenter)) {
        const {
          lower,
          upper
        } = esm.utilities.windowLevel.toLowHighRange(voi.windowWidth, voi.windowCenter);
        properties.voiRange = {
          lower,
          upper
        };
      }
      if (voiInverted !== undefined) {
        properties.invert = voiInverted;
      }
      if (colormap !== undefined) {
        properties.colormap = colormap;
      }
      if (displayPreset !== undefined) {
        properties.preset = displayPreset[displaySetModality] || displayPreset.default;
      }
      return {
        properties,
        volumeId
      };
    });

    // For SEG and RT viewports
    const overlayProcessingResults = this._processExtraDisplaySetsForViewport(viewport) || [];
    if (!filteredVolumeInputArray.length && overlayProcessingResults?.length) {
      overlayProcessingResults.forEach(({
        imageIds,
        addOverlayFn
      }) => {
        if (addOverlayFn) {
          // if there is no volume input array, and there is an addOverlayFn, means we need to take
          // care of the background overlay display set first then the addOverlayFn will add the
          // SEG displaySet
          const sampleImageId = imageIds[0];
          const backgroundDisplaySet = displaySetService.getDisplaySetsBy(displaySet => !displaySet.isOverlayDisplaySet && displaySet.images.some(image => image.imageId === sampleImageId));
          if (backgroundDisplaySet.length !== 1) {
            throw new Error('Background display set not found');
          }
        }
      });
    }
    await viewport.setVolumes(volumeInputArray);
    if (overlayProcessingResults?.length) {
      overlayProcessingResults.forEach(({
        addOverlayFn
      }) => {
        if (addOverlayFn) {
          addOverlayFn();
        }
      });
    }
    viewport.render();
    volumesProperties.forEach(({
      properties,
      volumeId
    }) => {
      setTimeout(() => {
        // seems like a hack but we need the actor to be ready first before
        // we set the properties
        viewport.setProperties(properties, volumeId);
        viewport.render();
      }, 0);
    });
    this.setPresentations(viewport.id, presentations, viewportInfo);
    if (!presentations.positionPresentation) {
      const imageIndex = this._getInitialImageIndexForViewport(viewportInfo);
      if (imageIndex !== undefined) {
        esm.utilities.jumpToSlice(viewport.element, {
          imageIndex
        });
      }
    }
    this._broadcastEvent(this.EVENTS.VIEWPORT_VOLUMES_CHANGED, {
      viewportInfo
    });
  }
  _processExtraDisplaySetsForViewport(viewport) {
    const {
      displaySetService
    } = this.servicesManager.services;

    // load any secondary displaySets
    const displaySetInstanceUIDs = this.viewportsDisplaySets.get(viewport.id);

    // Find overlay display sets (e.g. SEG, RTSTRUCT)
    const overlayDisplaySets = displaySetInstanceUIDs.map(displaySetService.getDisplaySetByUID).filter(displaySet => displaySet?.isOverlayDisplaySet);

    // if it is only the overlay displaySet, then we need to get the reference
    // displaySet imageIds and set them as the imageIds for the viewport,
    // here we can do some logic if the reference is missing
    // then find the most similar match of displaySet instead
    if (!overlayDisplaySets?.length) {
      return;
    }
    return overlayDisplaySets.map(overlayDisplaySet => {
      let imageIds;
      if (overlayDisplaySet.referencedDisplaySetInstanceUID) {
        const referenceDisplaySet = displaySetService.getDisplaySetByUID(overlayDisplaySet.referencedDisplaySetInstanceUID);
        imageIds = referenceDisplaySet.images.map(image => image.imageId);
      }
      return {
        imageIds,
        addOverlayFn: () => this.addOverlayRepresentationForDisplaySet(overlayDisplaySet, viewport)
      };
    });
  }
  addOverlayRepresentationForDisplaySet(displaySet, viewport) {
    const {
      segmentationService
    } = this.servicesManager.services;
    const segmentationId = displaySet.displaySetInstanceUID;
    const representationType = displaySet.Modality === 'SEG' ? dist_esm.Enums.SegmentationRepresentations.Labelmap : dist_esm.Enums.SegmentationRepresentations.Contour;
    segmentationService.addSegmentationRepresentation(viewport.id, {
      segmentationId,
      type: representationType
    });

    // store the segmentation presentation id in the viewport info
    this.storePresentation({
      viewportId: viewport.id
    });
  }

  // Todo: keepCamera is an interim solution until we have a better solution for
  // keeping the camera position when the viewport data is changed
  updateViewport(viewportId, viewportData, keepCamera = false) {
    const viewportInfo = this.getViewportInfo(viewportId);
    const viewport = this.getCornerstoneViewport(viewportId);
    const viewportCamera = viewport.getCamera();
    let displaySetPromise;
    if (viewport instanceof esm.VolumeViewport || viewport instanceof esm.VolumeViewport3D) {
      displaySetPromise = this._setVolumeViewport(viewport, viewportData, viewportInfo).then(() => {
        if (keepCamera) {
          viewport.setCamera(viewportCamera);
          viewport.render();
        }
      });
    }
    if (viewport instanceof esm.StackViewport) {
      displaySetPromise = this._setStackViewport(viewport, viewportData, viewportInfo);
    }
    displaySetPromise.then(() => {
      this._broadcastEvent(this.EVENTS.VIEWPORT_DATA_CHANGED, {
        viewportData,
        viewportId
      });
    });
  }
  _setDisplaySets(viewport, viewportData, viewportInfo, presentations = {}) {
    if (viewport instanceof esm.StackViewport) {
      return this._setStackViewport(viewport, viewportData, viewportInfo, presentations);
    }
    if ([esm.VolumeViewport, esm.VolumeViewport3D].some(type => viewport instanceof type)) {
      return this._setVolumeViewport(viewport, viewportData, viewportInfo, presentations);
    }
    return this._setOtherViewport(viewport, viewportData, viewportInfo, presentations);
  }

  /**
   * Removes the resize observer from the viewport element
   */
  _removeResizeObserver() {
    if (this.viewportGridResizeObserver) {
      this.viewportGridResizeObserver.disconnect();
    }
  }
  _getSlabThickness(displaySetOptions, volumeId) {
    const {
      blendMode
    } = displaySetOptions;
    if (blendMode === undefined || displaySetOptions.slabThickness === undefined) {
      return;
    }

    // if there is a slabThickness set as a number then use it
    if (typeof displaySetOptions.slabThickness === 'number') {
      return displaySetOptions.slabThickness;
    }
    if (displaySetOptions.slabThickness.toLowerCase() === 'fullvolume') {
      // calculate the slab thickness based on the volume dimensions
      const imageVolume = esm.cache.getVolume(volumeId);
      const {
        dimensions,
        spacing
      } = imageVolume;
      const slabThickness = Math.sqrt(Math.pow(dimensions[0] * spacing[0], 2) + Math.pow(dimensions[1] * spacing[1], 2) + Math.pow(dimensions[2] * spacing[2], 2));
      return slabThickness;
    }
  }
  _getFrameOfReferenceUID(displaySetInstanceUID) {
    const {
      displaySetService
    } = this.servicesManager.services;
    const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
    if (!displaySet) {
      return;
    }
    if (displaySet.frameOfReferenceUID) {
      return displaySet.frameOfReferenceUID;
    }
    if (displaySet.Modality === 'SEG') {
      const {
        instance
      } = displaySet;
      return instance.FrameOfReferenceUID;
    }
    if (displaySet.Modality === 'RTSTRUCT') {
      const {
        instance
      } = displaySet;
      return instance.ReferencedFrameOfReferenceSequence.FrameOfReferenceUID;
    }
    const {
      images
    } = displaySet;
    if (images && images.length) {
      return images[0].FrameOfReferenceUID;
    }
  }
  enqueueViewportResizeRequest() {
    this.resizeQueue.push(false); // false indicates viewport resize

    clearTimeout(this.viewportResizeTimer);
    this.viewportResizeTimer = setTimeout(() => {
      this.processViewportResizeQueue();
    }, this.gridResizeDelay);
  }
  processViewportResizeQueue() {
    const isGridResizeInQueue = this.resizeQueue.some(isGridResize => isGridResize);
    if (this.resizeQueue.length > 0 && !isGridResizeInQueue && !this.gridResizeTimeOut) {
      this.performResize();
    }

    // Clear the queue after processing viewport resizes
    this.resizeQueue = [];
  }
  performResize() {
    const isImmediate = false;
    try {
      const viewports = this.getRenderingEngine().getViewports();

      // Store the current position presentations for each viewport.
      viewports.forEach(({
        id: viewportId
      }) => {
        const presentation = this._getPositionPresentation(viewportId);

        // During a resize, the slice index should remain unchanged. This is a temporary fix for
        // a larger issue regarding the definition of slice index with slab thickness.
        // We need to revisit this to make it more robust and understandable.
        delete presentation.viewReference?.sliceIndex;
        this.beforeResizePositionPresentations.set(viewportId, presentation);
      });

      // Resize the rendering engine and render.
      const renderingEngine = this.renderingEngine;
      renderingEngine.resize(isImmediate);
      renderingEngine.render();

      // Reset the camera for all viewports using position presentation to maintain relative size/position
      // which means only those viewports that have a zoom level of 1.
      this.beforeResizePositionPresentations.forEach((positionPresentation, viewportId) => {
        this.setPresentations(viewportId, {
          positionPresentation
        });
      });

      // Resize and render the rendering engine again.
      renderingEngine.resize(isImmediate);
      renderingEngine.render();
    } catch (e) {
      // This can happen if the resize is too close to navigation or shutdown
      console.warn('Caught resize exception', e);
    }
  }
  resetGridResizeTimeout() {
    clearTimeout(this.gridResizeTimeOut);
    this.gridResizeTimeOut = setTimeout(() => {
      this.gridResizeTimeOut = null;
    }, this.gridResizeDelay);
  }
  _setLutPresentation(viewport, lutPresentation) {
    if (!lutPresentation) {
      return;
    }
    const {
      properties
    } = lutPresentation;
    if (viewport instanceof esm.BaseVolumeViewport) {
      if (properties instanceof Map) {
        properties.forEach((propertiesEntry, volumeId) => {
          viewport.setProperties(propertiesEntry, volumeId);
        });
      } else {
        viewport.setProperties(properties);
      }
    } else {
      viewport.setProperties(properties);
    }
  }
  _setPositionPresentation(viewport, positionPresentation) {
    const viewRef = positionPresentation?.viewReference;
    if (viewRef) {
      // The orientation can be updated here to navigate to the specified
      // measurement or previous item, but this will not switch to volume
      // or to stack from the other type
      if (viewport.isReferenceViewable(viewRef, WITH_ORIENTATION)) {
        viewport.setViewReference(viewRef);
      } else {
        console.warn('Unable to apply reference viewable', viewRef);
      }
    }
    const viewPresentation = positionPresentation?.viewPresentation;
    if (viewPresentation) {
      viewport.setViewPresentation(viewPresentation);
    }
  }
  _setSegmentationPresentation(viewport, segmentationPresentation) {
    if (!segmentationPresentation) {
      return;
    }
    const {
      segmentationService
    } = this.servicesManager.services;
    segmentationPresentation.forEach(presentationItem => {
      const {
        segmentationId,
        type,
        hydrated
      } = presentationItem;
      if (hydrated) {
        segmentationService.addSegmentationRepresentation(viewport.id, {
          segmentationId,
          type
        });
      }
    });
  }

  /**
   * Gets the display sets for a given viewport
   * @param viewportId - The ID of the viewport to get display sets for
   * @returns Array of display sets for the viewport
   */
  getViewportDisplaySets(viewportId) {
    const {
      displaySetService
    } = this.servicesManager.services;
    const displaySetInstanceUIDs = this.viewportsDisplaySets.get(viewportId) || [];
    return displaySetInstanceUIDs.map(uid => displaySetService.getDisplaySetByUID(uid)).filter(Boolean);
  }
}
_CornerstoneViewportService = CornerstoneViewportService;
CornerstoneViewportService.REGISTRATION = {
  name: 'cornerstoneViewportService',
  altName: 'CornerstoneViewportService',
  create: ({
    servicesManager
  }) => {
    return new _CornerstoneViewportService(servicesManager);
  }
};
/* harmony default export */ const ViewportService_CornerstoneViewportService = (CornerstoneViewportService);
;// ../../../extensions/cornerstone/src/types/Colorbar.ts
// Position options

// Tick position options

// CSS style properties for ticks

// Position-specific styles

// Styles for a specific position (like bottom)

// Map of position to position-specific styles

// Map of position to position-specific CSS

// Container styles

// Dimension configuration

// Tick configuration

// Base options for colorbar

// Props for the Colorbar component

// Extended properties with styling options

// Type for the customization object from the customization service

// Event types for colorbar changes
let ChangeTypes = /*#__PURE__*/function (ChangeTypes) {
  ChangeTypes["Removed"] = "removed";
  ChangeTypes["Added"] = "added";
  ChangeTypes["Modified"] = "modified";
  return ChangeTypes;
}({});
;// ../../../extensions/cornerstone/src/services/ColorbarService/ColorbarService.ts
var _ColorbarService;




class ColorbarService extends src.PubSubService {
  constructor(servicesManager) {
    super(ColorbarService.EVENTS);
    /**
     * Structure of colorbars state:
     * {
     *   [viewportId]: [
     *     {
     *       displaySetInstanceUID: string,
     *       colorbar: {
     *         activeColormapName: string,
     *         colormaps: array,
     *         volumeId: string (optional),
     *       }
     *     }
     *   ]
     * }
     */
    this.colorbars = {};
    this.servicesManager = void 0;
    this.servicesManager = servicesManager;
  }

  /**
   * Gets the appropriate data ID for a viewport and display set
   * @param viewport - The viewport instance
   * @param displaySetInstanceUID - The display set instance UID to identify data
   * @returns The appropriate data ID for the viewport type (volumeId for volume viewports, undefined for stack)
   */
  getDataIdForViewport(viewport, displaySetInstanceUID) {
    // For volume viewports, find the matching volumeId
    if (viewport.getAllVolumeIds) {
      const volumeIds = viewport.getAllVolumeIds() || [];
      return volumeIds.length > 0 ? volumeIds.find(id => id.includes(displaySetInstanceUID)) || undefined : undefined;
    }

    // For other viewports, no specific dataId is needed for now
    return undefined;
  }

  /**
   * Adds a colorbar to a specific viewport identified by `viewportId`, using the provided `displaySetInstanceUIDs` and `options`.
   * This method prepares the colorbar state that will be used by the ViewportColorbarsContainer component.
   *
   * @param viewportId The identifier for the viewport where the colorbar will be added.
   * @param displaySetInstanceUIDs An array of display set instance UIDs to associate with the colorbar.
   * @param options Configuration options for the colorbar, including position, colormaps, active colormap name, ticks, and width.
   */
  addColorbar(viewportId, displaySetInstanceUIDs, options = {}) {
    const {
      displaySetService
    } = this.servicesManager.services;
    const renderingEngine = (0,esm.getRenderingEngine)(RENDERING_ENGINE_ID);
    const viewport = renderingEngine.getViewport(viewportId);
    if (!viewport) {
      return;
    }
    const actorEntries = viewport.getActors();
    if (!actorEntries || actorEntries.length === 0) {
      return;
    }
    const {
      activeColormapName,
      colormaps
    } = options;
    displaySetInstanceUIDs.forEach(displaySetInstanceUID => {
      // don't show colorbar for overlay display sets (e.g. segmentation)
      const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
      if (displaySet.isOverlayDisplaySet) {
        return;
      }
      const dataId = this.getDataIdForViewport(viewport, displaySetInstanceUID);
      const properties = dataId ? viewport.getProperties(dataId) : viewport.getProperties();
      const colormap = properties?.colormap;
      if (activeColormapName && !colormap) {
        this.setViewportColormap(viewportId, displaySetInstanceUID, colormaps[activeColormapName], true);
      }

      // Prepare colorbar data for the React component
      const colorbarData = {
        activeColormapName: colormap?.name || options?.activeColormapName || 'Grayscale',
        colormaps: options.colormaps ? Object.values(options.colormaps) : [],
        volumeId: dataId,
        dataId
      };

      // Store the colorbar data in the service state
      if (this.colorbars[viewportId]) {
        // Check if there's already an entry for this displaySetInstanceUID
        const existingIndex = this.colorbars[viewportId].findIndex(item => item.displaySetInstanceUID === displaySetInstanceUID);
        if (existingIndex !== -1) {
          // Update existing colorbar
          this.colorbars[viewportId][existingIndex].colorbar = colorbarData;
        } else {
          // Add new colorbar
          this.colorbars[viewportId].push({
            colorbar: colorbarData,
            displaySetInstanceUID
          });
        }
      } else {
        // Create new colorbar array for this viewport
        this.colorbars[viewportId] = [{
          colorbar: colorbarData,
          displaySetInstanceUID
        }];
      }
    });

    // Notify listeners about the state change
    this._broadcastEvent(ColorbarService.EVENTS.STATE_CHANGED, {
      viewportId,
      changeType: ChangeTypes.Added
    });
  }

  /**
   * Removes a colorbar from a specific viewport. If displaySetInstanceUID is provided,
   * only the colorbar associated with that specific displaySetInstanceUID will be removed.
   * Otherwise, all colorbars for the given viewport will be removed.
   *
   * @param viewportId The identifier for the viewport from which the colorbar will be removed.
   * @param displaySetInstanceUID Optional. The specific display set instance UID associated with the colorbar to remove.
   */
  removeColorbar(viewportId, displaySetInstanceUID) {
    const colorbarInfo = this.colorbars[viewportId];
    if (!colorbarInfo) {
      return;
    }
    if (displaySetInstanceUID) {
      // Find the index of the colorbar with the matching displaySetInstanceUID
      const index = colorbarInfo.findIndex(info => info.displaySetInstanceUID === displaySetInstanceUID);
      if (index !== -1) {
        // Remove the colorbar from the array
        colorbarInfo.splice(index, 1);

        // If there are no more colorbars for this viewport, remove the entry
        if (colorbarInfo.length === 0) {
          delete this.colorbars[viewportId];
        }
      }
    } else {
      delete this.colorbars[viewportId];
    }
    this._broadcastEvent(ColorbarService.EVENTS.STATE_CHANGED, {
      viewportId,
      displaySetInstanceUID,
      changeType: ChangeTypes.Removed
    });
  }

  /**
   * Checks whether a colorbar is associated with a given viewport ID.
   *
   * @param viewportId The identifier for the viewport to check.
   * @returns `true` if a colorbar exists for the specified viewport, otherwise `false`.
   */
  hasColorbar(viewportId) {
    return this.colorbars[viewportId] ? true : false;
  }

  /**
   * Retrieves the current state of colorbars, including all active colorbars and their configurations.
   *
   * @returns An object representing the current state of all colorbars managed by this service.
   */
  getState() {
    return this.colorbars;
  }

  /**
   * Retrieves colorbar information for a specific viewport ID.
   *
   * @param viewportId The identifier for the viewport to retrieve colorbar information for.
   * @returns The colorbar information associated with the specified viewport, if available.
   */
  getViewportColorbar(viewportId) {
    return this.colorbars[viewportId];
  }

  /**
   * Handles the cleanup and removal of all colorbars from the viewports. This is typically called
   * when exiting the mode or context in which the colorbars are used, ensuring that no DOM
   * elements or references are left behind.
   */
  onModeExit() {
    const viewportIds = Object.keys(this.colorbars);
    viewportIds.forEach(viewportId => {
      this.removeColorbar(viewportId);
    });
  }

  /**
   * Sets the colormap for a viewport. This function is used internally to update the colormap the viewport
   *
   * @param viewportId The identifier of the viewport to update.
   * @param displaySetInstanceUID The display set instance UID associated with the viewport.
   * @param colormap The colormap object to set on the viewport.
   * @param immediate A boolean indicating whether the viewport should be re-rendered immediately after setting the colormap.
   */
  setViewportColormap(viewportId, displaySetInstanceUID, colormap, immediate = false) {
    const renderingEngine = (0,esm.getRenderingEngine)(RENDERING_ENGINE_ID);
    const viewport = renderingEngine.getViewport(viewportId);
    const actorEntries = viewport?.getActors();
    if (!viewport || !actorEntries || actorEntries.length === 0) {
      return;
    }

    // Get the appropriate dataId for this viewport/displaySet combination
    const dataId = this.getDataIdForViewport(viewport, displaySetInstanceUID);

    // Set properties with or without dataId based on what the viewport supports
    viewport.setProperties({
      colormap
    }, dataId);
    if (immediate) {
      viewport.render();
    }
  }
}
_ColorbarService = ColorbarService;
ColorbarService.EVENTS = {
  STATE_CHANGED: 'event::ColorbarService:stateChanged'
};
ColorbarService.REGISTRATION = {
  name: 'colorbarService',
  create: ({
    servicesManager
  }) => {
    return new _ColorbarService(servicesManager);
  }
};
;// ../../../extensions/cornerstone/src/services/ColorbarService/index.ts

/* harmony default export */ const services_ColorbarService = (ColorbarService);
;// ../../../extensions/cornerstone/src/types/Presentation.ts

;// ../../../extensions/cornerstone/src/types/ViewportPresets.ts

;// ../../../extensions/cornerstone/src/types/WindowLevel.ts

;// ../../../extensions/cornerstone/src/types/VolumeRenderingConfig.ts

;// ../../../extensions/cornerstone/src/types/VolumeLighting.ts

;// ../../../extensions/cornerstone/src/types/index.ts






// EXTERNAL MODULE: ../../../node_modules/dicomweb-client/build/dicomweb-client.es.js
var dicomweb_client_es = __webpack_require__(83562);
;// ../../../extensions/cornerstone/src/utils/dicomLoaderService.js




const getImageId = imageObj => {
  if (!imageObj) {
    return;
  }
  return typeof imageObj.getImageId === 'function' ? imageObj.getImageId() : imageObj.url;
};
const findImageIdOnStudies = (studies, displaySetInstanceUID) => {
  const study = studies.find(study => {
    const displaySet = study.displaySets.some(displaySet => displaySet.displaySetInstanceUID === displaySetInstanceUID);
    return displaySet;
  });
  const {
    series = []
  } = study;
  const {
    instances = []
  } = series[0] || {};
  const instance = instances[0];
  return getImageId(instance);
};
const someInvalidStrings = strings => {
  const stringsArray = Array.isArray(strings) ? strings : [strings];
  const emptyString = string => !string;
  let invalid = stringsArray.some(emptyString);
  return invalid;
};
const getImageInstance = dataset => {
  return dataset && dataset.images && dataset.images[0];
};
const getNonImageInstance = dataset => {
  return dataset && dataset.instance;
};
const getImageInstanceId = imageInstance => {
  return getImageId(imageInstance);
};
const fetchIt = (url, headers = src.DICOMWeb.getAuthorizationHeader()) => {
  return fetch(url, headers).then(response => response.arrayBuffer());
};
const cornerstoneRetriever = imageId => {
  return esm.imageLoader.loadAndCacheImage(imageId).then(image => {
    return image && image.data && image.data.byteArray.buffer;
  });
};
const wadorsRetriever = (url, studyInstanceUID, seriesInstanceUID, sopInstanceUID, headers = src.DICOMWeb.getAuthorizationHeader(), errorInterceptor = src.errorHandler.getHTTPErrorHandler()) => {
  const config = {
    url,
    headers,
    errorInterceptor
  };
  const dicomWeb = new dicomweb_client_es/* api */.FH.DICOMwebClient(config);
  return dicomWeb.retrieveInstance({
    studyInstanceUID,
    seriesInstanceUID,
    sopInstanceUID
  });
};
const getImageLoaderType = imageId => {
  const loaderRegExp = /^\w+\:/;
  const loaderType = loaderRegExp.exec(imageId);
  return loaderRegExp.lastIndex === 0 && loaderType && loaderType[0] && loaderType[0].replace(':', '') || '';
};
class DicomLoaderService {
  getLocalData(dataset, studies) {
    // Use referenced imageInstance
    const imageInstance = getImageInstance(dataset);
    const nonImageInstance = getNonImageInstance(dataset);
    if (!imageInstance && !nonImageInstance || !nonImageInstance.imageId?.startsWith('dicomfile')) {
      return;
    }
    const instance = imageInstance || nonImageInstance;
    let imageId = getImageInstanceId(instance);

    // or Try to get it from studies
    if (someInvalidStrings(imageId)) {
      imageId = findImageIdOnStudies(studies, dataset.displaySetInstanceUID);
    }
    if (!someInvalidStrings(imageId)) {
      return dicom_image_loader_dist_esm/* default.wadouri */.Ay.wadouri.loadFileRequest(imageId);
    }
  }
  getDataByImageType(dataset) {
    const imageInstance = getImageInstance(dataset);
    if (imageInstance) {
      let imageId = getImageInstanceId(imageInstance);
      let getDicomDataMethod = fetchIt;
      const loaderType = getImageLoaderType(imageId);
      switch (loaderType) {
        case 'dicomfile':
          getDicomDataMethod = cornerstoneRetriever.bind(this, imageId);
          break;
        case 'wadors':
          const url = imageInstance.getData().wadoRoot;
          const studyInstanceUID = imageInstance.getStudyInstanceUID();
          const seriesInstanceUID = imageInstance.getSeriesInstanceUID();
          const sopInstanceUID = imageInstance.getSOPInstanceUID();
          const invalidParams = someInvalidStrings([url, studyInstanceUID, seriesInstanceUID, sopInstanceUID]);
          if (invalidParams) {
            return;
          }
          getDicomDataMethod = wadorsRetriever.bind(this, url, studyInstanceUID, seriesInstanceUID, sopInstanceUID);
          break;
        case 'wadouri':
          // Strip out the image loader specifier
          imageId = imageId.substring(imageId.indexOf(':') + 1);
          if (someInvalidStrings(imageId)) {
            return;
          }
          getDicomDataMethod = fetchIt.bind(this, imageId);
          break;
        default:
          return;
      }
      return getDicomDataMethod();
    }
  }
  getDataByDatasetType(dataset) {
    const {
      StudyInstanceUID,
      SeriesInstanceUID,
      SOPInstanceUID,
      authorizationHeaders,
      wadoRoot,
      wadoUri,
      instance
    } = dataset;
    // Retrieve wadors or just try to fetch wadouri
    if (!someInvalidStrings(wadoRoot)) {
      return wadorsRetriever(wadoRoot, StudyInstanceUID, SeriesInstanceUID, SOPInstanceUID, authorizationHeaders);
    } else if (!someInvalidStrings(wadoUri)) {
      return fetchIt(wadoUri, {
        headers: authorizationHeaders
      });
    } else if (!someInvalidStrings(instance?.url)) {
      // make sure the url is absolute, remove the scope
      // from it if it is not absolute. For instance it might be dicomweb:http://....
      // and we need to remove the dicomweb: part
      const url = instance.url;
      const absoluteUrl = url.startsWith('http') ? url : url.substring(url.indexOf(':') + 1);
      return fetchIt(absoluteUrl, {
        headers: authorizationHeaders
      });
    }
  }
  *getLoaderIterator(dataset, studies, headers) {
    yield this.getLocalData(dataset, studies);
    yield this.getDataByImageType(dataset);
    yield this.getDataByDatasetType(dataset);
  }
  findDicomDataPromise(dataset, studies, headers) {
    dataset.authorizationHeaders = headers;
    const loaderIterator = this.getLoaderIterator(dataset, studies);
    // it returns first valid retriever method.
    for (const loader of loaderIterator) {
      if (loader) {
        return loader;
      }
    }

    // in case of no valid loader
    throw new Error('Invalid dicom data loader');
  }
}
const dicomLoaderService = new DicomLoaderService();
/* harmony default export */ const utils_dicomLoaderService = (dicomLoaderService);
;// ../../../extensions/cornerstone/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/extension-cornerstone"}');
;// ../../../extensions/cornerstone/src/id.js

const id = package_namespaceObject.UU;

;// ../../../extensions/cornerstone/src/utils/measurementServiceMappings/index.ts


;// ../../../extensions/cornerstone/src/synchronizers/frameViewSynchronizer.ts


const frameViewSyncCallback = (synchronizerInstance, sourceViewport, targetViewport) => {
  const renderingEngine = (0,esm.getRenderingEngine)(targetViewport.renderingEngineId);
  if (!renderingEngine) {
    throw new Error(`No RenderingEngine for Id: ${targetViewport.renderingEngineId}`);
  }
  const sViewport = renderingEngine.getViewport(sourceViewport.viewportId);
  const {
    viewportIndex: targetViewportIndex
  } = synchronizerInstance.getOptions(targetViewport.viewportId);
  const {
    viewportIndex: sourceViewportIndex
  } = synchronizerInstance.getOptions(sourceViewport.viewportId);
  if (targetViewportIndex === undefined || sourceViewportIndex === undefined) {
    throw new Error('No viewportIndex provided');
  }
  const tViewport = renderingEngine.getViewport(targetViewport.viewportId);
  const sourceSliceIndex = sViewport.getSliceIndex();
  const sliceDifference = Number(targetViewportIndex) - Number(sourceViewportIndex);
  const targetSliceIndex = sourceSliceIndex + sliceDifference;
  if (targetSliceIndex === tViewport.getSliceIndex()) {
    return;
  }
  esm.utilities.jumpToSlice(tViewport.element, {
    imageIndex: targetSliceIndex
  });
};
const createFrameViewSynchronizer = synchronizerName => {
  const synchronizer = dist_esm.SynchronizerManager.createSynchronizer(synchronizerName, esm.EVENTS.STACK_VIEWPORT_SCROLL, frameViewSyncCallback, {
    auxiliaryEvents: [{
      name: esm.EVENTS.CAMERA_MODIFIED,
      source: 'element'
    }]
  });
  return synchronizer;
};

// EXTERNAL MODULE: ../../../node_modules/dcmjs/build/dcmjs.es.js
var dcmjs_es = __webpack_require__(5842);
;// ../../../extensions/cornerstone/src/getSopClassHandlerModule.js





const {
  MetadataModules
} = esm.Enums;
const {
  utils: getSopClassHandlerModule_utils
} = src["default"];
const {
  denaturalizeDataset
} = dcmjs_es/* default.data */.Ay.data.DicomMetaDictionary;
const {
  transferDenaturalizedDataset,
  fixMultiValueKeys
} = default_src.dicomWebUtils;
const SOP_CLASS_UIDS = {
  VL_WHOLE_SLIDE_MICROSCOPY_IMAGE_STORAGE: '1.2.840.10008.5.1.4.1.1.77.1.6'
};
const SOPClassHandlerId = '@ohif/extension-cornerstone.sopClassHandlerModule.DicomMicroscopySopClassHandler';
function _getDisplaySetsFromSeries(instances, servicesManager, extensionManager) {
  const dataSource = extensionManager.getActiveDataSource()[0];
  // If the series has no instances, stop here
  if (!instances || !instances.length) {
    throw new Error('No instances were provided');
  }
  const instance = instances[0];
  let singleFrameInstance = instance;
  let currentFrames = +singleFrameInstance.NumberOfFrames || 1;
  for (const instanceI of instances) {
    const framesI = +instanceI.NumberOfFrames || 1;
    if (framesI < currentFrames) {
      singleFrameInstance = instanceI;
      currentFrames = framesI;
    }
  }
  const {
    FrameOfReferenceUID,
    SeriesDescription,
    ContentDate,
    ContentTime,
    SeriesNumber,
    StudyInstanceUID,
    SeriesInstanceUID,
    SOPInstanceUID,
    SOPClassUID
  } = instance;
  instances = instances.map(inst => {
    // NOTE: According to DICOM standard a series should have a FrameOfReferenceUID
    // When the Microscopy file was built by certain tool from multiple image files,
    // each instance's FrameOfReferenceUID is sometimes different.
    // Even though this means the file was not well formatted DICOM VL Whole Slide Microscopy Image,
    // the case is so often, so let's override this value manually here.
    //
    // https://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_C.7.4.html#sect_C.7.4.1.1.1

    inst.FrameOfReferenceUID = instance.FrameOfReferenceUID;
    return inst;
  });
  const othersFrameOfReferenceUID = instances.filter(v => v).map(inst => inst.FrameOfReferenceUID).filter((value, index, array) => array.indexOf(value) === index);
  if (othersFrameOfReferenceUID.length > 1) {
    console.warn('Expected FrameOfReferenceUID of difference instances within a series to be the same, found multiple different values', othersFrameOfReferenceUID);
  }
  const displaySet = {
    plugin: 'microscopy',
    Modality: 'SM',
    viewportType: esm.Enums.ViewportType.WHOLE_SLIDE,
    altImageText: 'Microscopy',
    displaySetInstanceUID: getSopClassHandlerModule_utils.guid(),
    SOPInstanceUID,
    SeriesInstanceUID,
    StudyInstanceUID,
    FrameOfReferenceUID,
    SOPClassHandlerId,
    SOPClassUID,
    SeriesDescription: SeriesDescription || 'Microscopy Data',
    // Map ContentDate/Time to SeriesTime for series list sorting.
    SeriesDate: ContentDate,
    SeriesTime: ContentTime,
    SeriesNumber,
    firstInstance: singleFrameInstance,
    // top level instance in the image Pyramid
    instance,
    numImageFrames: 0,
    numInstances: 1,
    others: instances,
    // all other level instances in the image Pyramid
    instances,
    othersFrameOfReferenceUID,
    imageIds: instances.map(instance => instance.imageId),
    getThumbnailSrc: dataSource.retrieve.getGetThumbnailSrc?.(singleFrameInstance, singleFrameInstance.imageId),
    label: SeriesDescription || `${i18n_src/* default */.A.t('Series')} ${SeriesNumber} - ${i18n_src/* default */.A.t('SM')}`
  };
  // The microscopy viewer directly accesses the metadata already loaded, and
  // uses the DICOMweb client library directly for loading, so it has to be
  // provided here.
  const dicomWebClient = dataSource.retrieve.getWadoDicomWebClient?.();
  const instanceMap = new Map();
  instances.forEach(instance => instanceMap.set(instance.imageId, instance));
  if (dicomWebClient) {
    const webClient = Object.create(dicomWebClient);
    // This replaces just the dicom web metadata call with one which retrieves
    // internally.
    webClient.getDICOMwebMetadata = getDICOMwebMetadata.bind(webClient, instanceMap);
    esm.utilities.genericMetadataProvider.addRaw(displaySet.imageIds[0], {
      type: MetadataModules.WADO_WEB_CLIENT,
      metadata: webClient
    });
  } else {
    // Might have some other way of getting the data in the future or internally?
    // throw new Error('Unable to provide a DICOMWeb client library, microscopy will fail to view');
  }
  return [displaySet];
}

/**
 * This method provides access to the internal DICOMweb metadata, used to avoid
 * refetching the DICOMweb data.  It gets assigned as a member function to the
 * dicom web client.
 */
function getDICOMwebMetadata(instanceMap, imageId) {
  const instance = instanceMap.get(imageId);
  if (!instance) {
    console.warn('Metadata not already found for', imageId, 'in', instanceMap);
    return this.super.getDICOMwebMetadata(imageId);
  }
  return transferDenaturalizedDataset(denaturalizeDataset(fixMultiValueKeys(instanceMap.get(imageId))));
}
function getDicomMicroscopySopClassHandler({
  servicesManager,
  extensionManager
}) {
  const getDisplaySetsFromSeries = instances => {
    return _getDisplaySetsFromSeries(instances, servicesManager, extensionManager);
  };
  return {
    name: 'DicomMicroscopySopClassHandler',
    sopClassUids: [SOP_CLASS_UIDS.VL_WHOLE_SLIDE_MICROSCOPY_IMAGE_STORAGE],
    getDisplaySetsFromSeries
  };
}
function getSopClassHandlerModule(params) {
  return [getDicomMicroscopySopClassHandler(params)];
}
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/hooks/useActiveViewportSegmentationRepresentations.ts
var useActiveViewportSegmentationRepresentations = __webpack_require__(9234);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/hooks/useMeasurements.ts
var useMeasurements = __webpack_require__(19214);
;// ../../../extensions/cornerstone/src/panels/PanelSegmentation.tsx





function PanelSegmentation({
  children
}) {
  const {
    commandsManager,
    servicesManager
  } = (0,src.useSystem)();
  const {
    customizationService,
    displaySetService
  } = servicesManager.services;
  const {
    segmentationsWithRepresentations,
    disabled
  } = (0,useActiveViewportSegmentationRepresentations/* useActiveViewportSegmentationRepresentations */.c)();

  // Extract customization options
  const segmentationTableMode = customizationService.getCustomization('panelSegmentation.tableMode');
  const onSegmentationAdd = customizationService.getCustomization('panelSegmentation.onSegmentationAdd');
  const disableEditing = customizationService.getCustomization('panelSegmentation.disableEditing');
  const showAddSegment = customizationService.getCustomization('panelSegmentation.showAddSegment');
  const CustomDropdownMenuContent = customizationService.getCustomization('panelSegmentation.customDropdownMenuContent');
  const CustomSegmentStatisticsHeader = customizationService.getCustomization('panelSegmentation.customSegmentStatisticsHeader');

  // Create handlers object for all command runs
  const handlers = {
    onSegmentationClick: segmentationId => {
      commandsManager.run('setActiveSegmentation', {
        segmentationId
      });
    },
    onSegmentAdd: segmentationId => {
      commandsManager.run('addSegment', {
        segmentationId
      });
    },
    onSegmentClick: (segmentationId, segmentIndex) => {
      commandsManager.run('setActiveSegmentAndCenter', {
        segmentationId,
        segmentIndex
      });
    },
    onSegmentEdit: (segmentationId, segmentIndex) => {
      commandsManager.run('editSegmentLabel', {
        segmentationId,
        segmentIndex
      });
    },
    onSegmentationEdit: segmentationId => {
      commandsManager.run('editSegmentationLabel', {
        segmentationId
      });
    },
    onSegmentColorClick: (segmentationId, segmentIndex) => {
      commandsManager.run('editSegmentColor', {
        segmentationId,
        segmentIndex
      });
    },
    onSegmentDelete: (segmentationId, segmentIndex) => {
      commandsManager.run('deleteSegment', {
        segmentationId,
        segmentIndex
      });
    },
    onToggleSegmentVisibility: (segmentationId, segmentIndex, type) => {
      commandsManager.run('toggleSegmentVisibility', {
        segmentationId,
        segmentIndex,
        type
      });
    },
    onToggleSegmentLock: (segmentationId, segmentIndex) => {
      commandsManager.run('toggleSegmentLock', {
        segmentationId,
        segmentIndex
      });
    },
    onToggleSegmentationRepresentationVisibility: (segmentationId, type) => {
      commandsManager.run('toggleSegmentationVisibility', {
        segmentationId,
        type
      });
    },
    onSegmentationDownload: segmentationId => {
      commandsManager.run('downloadSegmentation', {
        segmentationId
      });
    },
    setStyle: (segmentationId, type, key, value) => {
      commandsManager.run('setSegmentationStyle', {
        segmentationId,
        type,
        key,
        value
      });
    },
    toggleRenderInactiveSegmentations: () => {
      commandsManager.run('toggleRenderInactiveSegmentations');
    },
    onSegmentationRemoveFromViewport: segmentationId => {
      commandsManager.run('removeSegmentationFromViewport', {
        segmentationId
      });
    },
    onSegmentationDelete: segmentationId => {
      commandsManager.run('deleteSegmentation', {
        segmentationId
      });
    },
    setFillAlpha: ({
      type
    }, value) => {
      commandsManager.run('setFillAlpha', {
        type,
        value
      });
    },
    setOutlineWidth: ({
      type
    }, value) => {
      commandsManager.run('setOutlineWidth', {
        type,
        value
      });
    },
    setRenderFill: ({
      type
    }, value) => {
      commandsManager.run('setRenderFill', {
        type,
        value
      });
    },
    setRenderOutline: ({
      type
    }, value) => {
      commandsManager.run('setRenderOutline', {
        type,
        value
      });
    },
    setFillAlphaInactive: ({
      type
    }, value) => {
      commandsManager.run('setFillAlphaInactive', {
        type,
        value
      });
    },
    getRenderInactiveSegmentations: () => {
      return commandsManager.run('getRenderInactiveSegmentations');
    }
  };

  // Generate export options
  const exportOptions = segmentationsWithRepresentations.map(({
    segmentation
  }) => {
    const {
      representationData,
      segmentationId
    } = segmentation;
    const {
      Labelmap
    } = representationData;
    if (!Labelmap) {
      return {
        segmentationId,
        isExportable: true
      };
    }

    // Check if any segments have anything drawn in any of the viewports
    const hasAnySegmentData = (() => {
      const imageIds = Labelmap.imageIds;
      if (!imageIds?.length) return false;
      for (const imageId of imageIds) {
        const pixelData = esm.cache.getImage(imageId)?.getPixelData();
        if (!pixelData) continue;
        for (let i = 0; i < pixelData.length; i++) {
          if (pixelData[i] !== 0) return true;
        }
      }
      return false;
    })();
    if (!hasAnySegmentData) {
      return {
        segmentationId,
        isExportable: false
      };
    }
    const referencedImageIds = Labelmap.referencedImageIds;
    const firstImageId = referencedImageIds[0];
    const instance = esm.metaData.get('instance', firstImageId);
    if (!instance) {
      return {
        segmentationId,
        isExportable: false
      };
    }
    const SOPInstanceUID = instance.SOPInstanceUID || instance.SopInstanceUID;
    const SeriesInstanceUID = instance.SeriesInstanceUID;
    const displaySet = displaySetService.getDisplaySetForSOPInstanceUID(SOPInstanceUID, SeriesInstanceUID);
    return {
      segmentationId,
      isExportable: displaySet?.isReconstructable
    };
  });

  // Common props for SegmentationTable
  const tableProps = {
    disabled,
    data: segmentationsWithRepresentations,
    mode: segmentationTableMode,
    title: 'Segmentations',
    exportOptions,
    disableEditing,
    onSegmentationAdd,
    showAddSegment,
    renderInactiveSegmentations: handlers.getRenderInactiveSegmentations(),
    ...handlers
  };
  const renderSegments = () => {
    return /*#__PURE__*/react.createElement(ui_next_src/* SegmentationTable */.R4h.Segments, null, /*#__PURE__*/react.createElement(ui_next_src/* SegmentationTable */.R4h.SegmentStatistics.Header, null, /*#__PURE__*/react.createElement(CustomSegmentStatisticsHeader, null)), /*#__PURE__*/react.createElement(ui_next_src/* SegmentationTable */.R4h.SegmentStatistics.Body, null));
  };

  // Render content based on mode
  const renderModeContent = () => {
    if (tableProps.mode === 'collapsed') {
      return /*#__PURE__*/react.createElement(ui_next_src/* SegmentationTable */.R4h.Collapsed, null, /*#__PURE__*/react.createElement(ui_next_src/* SegmentationTable */.R4h.Collapsed.Header, null, /*#__PURE__*/react.createElement(ui_next_src/* SegmentationTable */.R4h.Collapsed.DropdownMenu, null, /*#__PURE__*/react.createElement(CustomDropdownMenuContent, null)), /*#__PURE__*/react.createElement(ui_next_src/* SegmentationTable */.R4h.Collapsed.Selector, null), /*#__PURE__*/react.createElement(ui_next_src/* SegmentationTable */.R4h.Collapsed.Info, null)), /*#__PURE__*/react.createElement(ui_next_src/* SegmentationTable */.R4h.Collapsed.Content, null, /*#__PURE__*/react.createElement(ui_next_src/* SegmentationTable */.R4h.AddSegmentRow, null), renderSegments()));
    }
    return /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement(ui_next_src/* SegmentationTable */.R4h.Expanded, null, /*#__PURE__*/react.createElement(ui_next_src/* SegmentationTable */.R4h.Expanded.Header, null, /*#__PURE__*/react.createElement(ui_next_src/* SegmentationTable */.R4h.Expanded.DropdownMenu, null, /*#__PURE__*/react.createElement(CustomDropdownMenuContent, null)), /*#__PURE__*/react.createElement(ui_next_src/* SegmentationTable */.R4h.Expanded.Label, null), /*#__PURE__*/react.createElement(ui_next_src/* SegmentationTable */.R4h.Expanded.Info, null)), /*#__PURE__*/react.createElement(ui_next_src/* SegmentationTable */.R4h.Expanded.Content, null, /*#__PURE__*/react.createElement(ui_next_src/* SegmentationTable */.R4h.AddSegmentRow, null), renderSegments())));
  };
  return /*#__PURE__*/react.createElement(ui_next_src/* SegmentationTable */.R4h, tableProps, children, /*#__PURE__*/react.createElement(ui_next_src/* SegmentationTable */.R4h.Config, null), /*#__PURE__*/react.createElement(ui_next_src/* SegmentationTable */.R4h.AddSegmentationRow, null), renderModeContent());
}
// EXTERNAL MODULE: ../../../node_modules/lodash.debounce/index.js
var lodash_debounce = __webpack_require__(62051);
var lodash_debounce_default = /*#__PURE__*/__webpack_require__.n(lodash_debounce);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps.js + 1 modules
var ColorMaps = __webpack_require__(660);
;// ../../../extensions/cornerstone/src/components/ViewportWindowLevel/getViewportVolumeHistogram.ts

const workerManager = (0,esm.getWebWorkerManager)();
const WorkerOptions = {
  maxWorkerInstances: 1,
  autoTerminateOnIdle: {
    enabled: true,
    idleTimeThreshold: 1000
  }
};

// Register the task
const workerFn = () => {
  return new Worker(new URL(/* worker import */ __webpack_require__.p + __webpack_require__.u(3054), __webpack_require__.b), {
    name: 'histogram-worker' // name used by the browser to name the worker
  });
};
const getViewportVolumeHistogram = async (viewport, volume, options) => {
  workerManager.registerWorker('histogram-worker', workerFn, WorkerOptions);
  const volumeImageData = viewport.getImageData(volume.volumeId);
  if (!volumeImageData) {
    return undefined;
  }
  let scalarData = volume.scalarData;
  if (volume.numTimePoints > 1) {
    const targetTimePoint = volume.numTimePoints - 1; // or any other time point you need
    scalarData = volume.voxelManager.getTimePointScalarData(targetTimePoint);
  } else {
    scalarData = volume.voxelManager.getCompleteScalarDataArray();
  }
  if (!scalarData?.length) {
    return undefined;
  }
  const {
    dimensions,
    origin,
    direction,
    spacing
  } = volume;
  const range = await workerManager.executeTask('histogram-worker', 'getRange', {
    dimensions,
    origin,
    direction,
    spacing,
    scalarData
  });
  const {
    minimum: min,
    maximum: max
  } = range;
  if (min === Infinity || max === -Infinity) {
    return undefined;
  }
  const calcHistOptions = {
    numBins: 256,
    min: Math.max(min, options?.min ?? min),
    max: Math.min(max, options?.max ?? max)
  };
  const histogram = await workerManager.executeTask('histogram-worker', 'calcHistogram', {
    data: scalarData,
    options: calcHistOptions
  });
  return histogram;
};

;// ../../../extensions/cornerstone/src/components/ViewportWindowLevel/utils.ts





/**
 * Gets node opacity from volume actor
 */
const getNodeOpacity = (volumeActor, nodeIndex) => {
  const volumeOpacity = volumeActor.getProperty().getScalarOpacity(0);
  const nodeValue = [];
  volumeOpacity.getNodeValue(nodeIndex, nodeValue);
  return nodeValue[1];
};

/**
 * Checks if the opacity applied to the PET volume follows a specific pattern
 */
const isPetVolumeWithDefaultOpacity = (volumeId, volumeActor) => {
  const volume = esm.cache.getVolume(volumeId);
  if (!volume || volume.metadata.Modality !== 'PT') {
    return false;
  }
  const volumeOpacity = volumeActor.getProperty().getScalarOpacity(0);
  if (volumeOpacity.getSize() < 2) {
    return false;
  }
  const node1Value = [];
  const node2Value = [];
  volumeOpacity.getNodeValue(0, node1Value);
  volumeOpacity.getNodeValue(1, node2Value);
  if (node1Value[0] !== 0 || node1Value[1] !== 0 || node2Value[0] !== 0.1) {
    return false;
  }
  const expectedOpacity = node2Value[1];
  const opacitySize = volumeOpacity.getSize();
  const currentNodeValue = [];
  for (let i = 2; i < opacitySize; i++) {
    volumeOpacity.getNodeValue(i, currentNodeValue);
    if (currentNodeValue[1] !== expectedOpacity) {
      return false;
    }
  }
  return true;
};

/**
 * Checks if volume has constant opacity
 */
const isVolumeWithConstantOpacity = volumeActor => {
  const volumeOpacity = volumeActor.getProperty().getScalarOpacity(0);
  const opacitySize = volumeOpacity.getSize();
  const firstNodeValue = [];
  volumeOpacity.getNodeValue(0, firstNodeValue);
  const firstNodeOpacity = firstNodeValue[1];
  for (let i = 0; i < opacitySize; i++) {
    const currentNodeValue = [];
    volumeOpacity.getNodeValue(0, currentNodeValue);
    if (currentNodeValue[1] !== firstNodeOpacity) {
      return false;
    }
  }
  return true;
};

/**
 * Gets window levels data for a viewport
 */
const getWindowLevelsData = async (viewport, viewportInfo, getVolumeOpacity) => {
  if (!viewport) {
    return [];
  }
  const volumeIds = viewport.getAllVolumeIds();
  const viewportProperties = viewport.getProperties();
  const {
    voiRange
  } = viewportProperties;
  const viewportVoi = voiRange ? {
    windowWidth: voiRange.upper - voiRange.lower,
    windowCenter: voiRange.lower + (voiRange.upper - voiRange.lower) / 2
  } : undefined;
  const windowLevels = await Promise.all(volumeIds.map(async (volumeId, volumeIndex) => {
    const volume = esm.cache.getVolume(volumeId);
    const opacity = getVolumeOpacity(viewport, volumeId);
    const {
      metadata,
      scaling
    } = volume;
    const modality = metadata.Modality;
    const options = {
      min: modality === 'PT' ? 0.1 : -999,
      max: modality === 'PT' ? 5 : 10000
    };
    const histogram = await getViewportVolumeHistogram(viewport, volume, options);
    if (!histogram || histogram.range.min === histogram.range.max) {
      return null;
    }
    if (!viewportInfo.displaySetOptions || !viewportInfo.displaySetOptions[volumeIndex]) {
      return null;
    }
    const {
      voi: displaySetVOI,
      colormap: displaySetColormap
    } = viewportInfo.displaySetOptions[volumeIndex];
    let colormap;
    if (displaySetColormap) {
      colormap = esm.utilities.colormap.getColormap(displaySetColormap.name) ?? ColorMaps/* default */.A.getPresetByName(displaySetColormap.name);
    }
    const voi = !volumeIndex ? viewportVoi ?? displaySetVOI : displaySetVOI;
    return {
      viewportId: viewportInfo.viewportId,
      modality,
      volumeId,
      volumeIndex,
      voi,
      histogram,
      colormap,
      step: scaling?.PT ? 0.05 : 1,
      opacity,
      showOpacitySlider: volumeIndex === 1 && opacity !== undefined
    };
  }));
  return windowLevels.filter(Boolean);
};
;// ../../../extensions/cornerstone/src/components/ViewportWindowLevel/ViewportWindowLevel.tsx







const {
  Events
} = esm.Enums;
const ViewportWindowLevel = ({
  servicesManager,
  viewportId
}) => {
  const {
    cornerstoneViewportService
  } = servicesManager.services;
  const [windowLevels, setWindowLevels] = (0,react.useState)([]);
  const [isLoading, setIsLoading] = (0,react.useState)(true);
  const displaySets = (0,src.useActiveViewportDisplaySets)();
  const getViewportsWithVolumeIds = (0,react.useCallback)(volumeIds => {
    const renderingEngine = cornerstoneViewportService.getRenderingEngine();
    const viewports = renderingEngine.getVolumeViewports();
    return viewports.filter(vp => {
      const viewportVolumeIds = vp instanceof esm.BaseVolumeViewport ? vp.getAllVolumeIds() : [];
      return volumeIds.length === viewportVolumeIds.length && volumeIds.every(volumeId => viewportVolumeIds.includes(volumeId));
    });
  }, [cornerstoneViewportService]);
  const getVolumeOpacity = (0,react.useCallback)((viewport, volumeId) => {
    const volumeActor = viewport.getActors().find(actor => actor.referencedId === volumeId)?.actor;
    if (isPetVolumeWithDefaultOpacity(volumeId, volumeActor)) {
      return getNodeOpacity(volumeActor, 1);
    } else if (isVolumeWithConstantOpacity(volumeActor)) {
      return getNodeOpacity(volumeActor, 0);
    }
    return undefined;
  }, []);
  const updateViewportHistograms = (0,react.useCallback)(() => {
    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
    const viewportInfo = cornerstoneViewportService.getViewportInfo(viewportId);
    getWindowLevelsData(viewport, viewportInfo, getVolumeOpacity).then(data => {
      setWindowLevels(data);
    });
  }, [viewportId, cornerstoneViewportService, getVolumeOpacity]);
  const handleCornerstoneVOIModified = (0,react.useCallback)(e => {
    const {
      detail
    } = e;
    const {
      volumeId,
      range
    } = detail;
    const oldWindowLevel = windowLevels.find(wl => wl.volumeId === volumeId);
    if (!oldWindowLevel) {
      return;
    }
    const oldVOI = oldWindowLevel.voi;
    const windowWidth = range.upper - range.lower;
    const windowCenter = range.lower + windowWidth / 2;
    if (windowWidth === oldVOI.windowWidth && windowCenter === oldVOI.windowCenter) {
      return;
    }
    const newWindowLevel = {
      ...oldWindowLevel,
      voi: {
        windowWidth,
        windowCenter
      }
    };
    setWindowLevels(windowLevels.map(windowLevel => windowLevel === oldWindowLevel ? newWindowLevel : windowLevel));
  }, [windowLevels]);
  const debouncedHandleCornerstoneVOIModified = (0,react.useMemo)(() => lodash_debounce_default()(handleCornerstoneVOIModified, 100), [handleCornerstoneVOIModified]);
  const handleVOIChange = (0,react.useCallback)((volumeId, voi) => {
    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
    const newRange = {
      lower: voi.windowCenter - voi.windowWidth / 2,
      upper: voi.windowCenter + voi.windowWidth / 2
    };
    viewport.setProperties({
      voiRange: newRange
    }, volumeId);
    viewport.render();
  }, [cornerstoneViewportService, viewportId]);
  const handleOpacityChange = (0,react.useCallback)((viewportId, _volumeIndex, volumeId, opacity) => {
    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
    if (!viewport) {
      return;
    }
    const viewportVolumeIds = viewport instanceof esm.BaseVolumeViewport ? viewport.getAllVolumeIds() : [];
    const viewports = getViewportsWithVolumeIds(viewportVolumeIds);
    viewports.forEach(vp => {
      vp.setProperties({
        colormap: {
          opacity
        }
      }, volumeId);
      vp.render();
    });
  }, [getViewportsWithVolumeIds, cornerstoneViewportService]);

  // New function to handle image volume loading completion
  const handleImageVolumeLoadingCompleted = (0,react.useCallback)(() => {
    setIsLoading(false);
    updateViewportHistograms();
  }, [updateViewportHistograms]);

  // Listen to cornerstone events and set up interval for histogram updates
  (0,react.useEffect)(() => {
    document.addEventListener(Events.VOI_MODIFIED, debouncedHandleCornerstoneVOIModified, true);
    esm.eventTarget.addEventListener(Events.IMAGE_VOLUME_LOADING_COMPLETED, handleImageVolumeLoadingCompleted);
    const intervalId = setInterval(() => {
      if (isLoading) {
        updateViewportHistograms();
      }
    }, 1000);
    return () => {
      document.removeEventListener(Events.VOI_MODIFIED, debouncedHandleCornerstoneVOIModified, true);
      esm.eventTarget.removeEventListener(Events.IMAGE_VOLUME_LOADING_COMPLETED, handleImageVolumeLoadingCompleted);
      clearInterval(intervalId);
    };
  }, [updateViewportHistograms, debouncedHandleCornerstoneVOIModified, handleImageVolumeLoadingCompleted, isLoading]);

  // Create a memoized version of displaySet IDs for comparison
  const displaySetIds = (0,react.useMemo)(() => {
    return displaySets?.map(ds => ds.displaySetInstanceUID).sort() || [];
  }, [displaySets]);
  (0,react.useEffect)(() => {
    const {
      unsubscribe
    } = cornerstoneViewportService.subscribe(cornerstoneViewportService.EVENTS.VIEWPORT_VOLUMES_CHANGED, ({
      viewportInfo
    }) => {
      if (viewportInfo.viewportId === viewportId) {
        updateViewportHistograms();
      }
    });

    // Only update if displaySets actually changed and are loaded
    if (displaySetIds.length && !isLoading) {
      updateViewportHistograms();
    }
    return () => {
      unsubscribe();
    };
  }, [viewportId, cornerstoneViewportService, updateViewportHistograms, displaySetIds, isLoading]);
  return /*#__PURE__*/react.createElement(ui_next_src/* PanelSection */.aUM, {
    defaultOpen: true
  }, /*#__PURE__*/react.createElement(ui_next_src/* PanelSection */.aUM.Header, null, "Window Level"), /*#__PURE__*/react.createElement(ui_next_src/* PanelSection */.aUM.Content, {
    className: "bg-muted py-1"
  }, windowLevels.map((windowLevel, i) => {
    if (!windowLevel.histogram) {
      return null;
    }
    return /*#__PURE__*/react.createElement(ui_next_src/* WindowLevel */.bLr, {
      key: windowLevel.volumeId,
      histogram: windowLevel.histogram,
      voi: windowLevel.voi,
      step: windowLevel.step,
      showOpacitySlider: windowLevel.showOpacitySlider,
      colormap: windowLevel.colormap,
      onVOIChange: voi => handleVOIChange(windowLevel.volumeId, voi),
      opacity: windowLevel.opacity,
      onOpacityChange: opacity => handleOpacityChange(windowLevel.viewportId, i, windowLevel.volumeId, opacity)
    });
  }), windowLevels.length === 0 && !isLoading && /*#__PURE__*/react.createElement("div", {
    className: "text-muted-foreground py-2 text-center text-sm"
  }, "No window level data available")));
};
ViewportWindowLevel.propTypes = {
  servicesManager: (prop_types_default()).object.isRequired,
  viewportId: (prop_types_default()).string.isRequired
};
/* harmony default export */ const ViewportWindowLevel_ViewportWindowLevel = (ViewportWindowLevel);
;// ../../../extensions/cornerstone/src/components/ActiveViewportWindowLevel/ActiveViewportWindowLevel.tsx




const ActiveViewportWindowLevel = ({
  servicesManager
}) => {
  const [viewportGrid] = (0,ui_next_src/* useViewportGrid */.ihW)();
  const {
    activeViewportId
  } = viewportGrid;
  return /*#__PURE__*/react.createElement(react.Fragment, null, activeViewportId && /*#__PURE__*/react.createElement(ViewportWindowLevel_ViewportWindowLevel, {
    servicesManager: servicesManager,
    viewportId: activeViewportId
  }));
};
ActiveViewportWindowLevel.propTypes = {
  servicesManager: (prop_types_default()).object.isRequired
};
/* harmony default export */ const ActiveViewportWindowLevel_ActiveViewportWindowLevel = (ActiveViewportWindowLevel);
;// ../../../extensions/cornerstone/src/components/ActiveViewportWindowLevel/index.js

// EXTERNAL MODULE: ../../../node_modules/@radix-ui/react-icons/dist/react-icons.esm.js
var react_icons_esm = __webpack_require__(65939);
;// ../../../extensions/cornerstone/src/components/AccordionGroup/AccordionGroup.tsx




/**
 * Searches for the required type from the provided allChildren list and
 * renders them.
 */
const CloneChildren = props => {
  const {
    group,
    allChildren,
    children,
    childType,
    defaultTypes
  } = props;
  const subType = group?.subType;
  for (const child of allChildren) {
    if (subType && child.props?.subType !== subType) {
      continue;
    }
    if (childType && child.type === childType) {
      return /*#__PURE__*/react.cloneElement(child, {
        ...props,
        children: child.props.children
      });
    }
    if (defaultTypes?.indexOf(child.type) === -1) {
      return childType({
        ...props,
        children: child
      });
    }
  }
  if (!children) {
    throw new Error(`No children defined for ${props.name} CloneChildren in group ${group?.name}`);
  }
  return /*#__PURE__*/react.cloneElement(children, props);
};

/** Used to exclude defaults */
const DEFAULT_TYPES = [GroupAccordion, Content, Trigger];

/**
 * An AccordionGroup is a component that splits a set of items into different
 * groups according to a set of grouping rules.  It then puts the groups
 * into a set of accordion folds selected from the body of the accordion group,
 * looking for matching trigger/content sections according to the type definition
 * in the group with first one found being used.
 *
 * This design allows for easy customization of the component by declaring grouping
 * functions with default grouping setups and then only overriding the specific
 * children needing to be changed.  See the PanelMeasurement for some example
 * possibilities of how to modify the default grouping, or the test-extension
 * measurements panel for a practical, working example.
 */
function AccordionGroup(props) {
  const {
    grouping,
    items,
    children,
    sourceChildren,
    type
  } = props;
  const childProps = (0,src.useSystem)();
  let defaultValue = props.defaultValue;
  const groups = grouping.groupingFunction(items, grouping, childProps);
  if (!defaultValue) {
    const defaultGroup = groups.values().find(group => group.isSelected);
    defaultValue = defaultGroup?.key || defaultGroup?.title;
  }
  const valueArr = Array.isArray(defaultValue) && defaultValue || defaultValue && [defaultValue] || [];
  const sourceChildrenArr = sourceChildren ? react.Children.toArray(sourceChildren) : [];
  const childrenArr = children ? react.Children.toArray(children) : [];
  const allChildren = sourceChildrenArr.concat(childrenArr);
  return /*#__PURE__*/react.createElement(CloneChildren, {
    allChildren: allChildren,
    groups: groups,
    childType: GroupAccordion,
    grouping: grouping,
    defaultValue: valueArr,
    name: 'grouping ' + grouping.name
  }, /*#__PURE__*/react.createElement(DefaultAccordion, {
    name: "DefaultAccordion"
  }));
}
function DefaultAccordion(props) {
  const {
    groups,
    defaultValue,
    grouping,
    allChildren,
    asChild
  } = props;
  if (!allChildren || !groups) {
    return null;
  }
  if (Boolean(asChild)) {
    return /*#__PURE__*/react.cloneElement(props.children, props);
  }
  return /*#__PURE__*/react.createElement(ui_next_src/* Accordion */.nD3, {
    type: grouping.type || 'multiple',
    className: "text-white",
    defaultValue: defaultValue
  }, [...groups.entries()].map(([key, group]) => {
    return /*#__PURE__*/react.createElement(ui_next_src/* AccordionItem */.AsP, {
      key: group.key + '-i',
      value: group.key
    }, /*#__PURE__*/react.createElement(CloneChildren, {
      allChildren: allChildren,
      group: group,
      childType: Trigger,
      name: "AccordionGroup.Trigger"
    }), /*#__PURE__*/react.createElement(CloneChildren, {
      allChildren: allChildren,
      group: group,
      childType: Content,
      defaultTypes: DEFAULT_TYPES,
      name: "AccordionGroup.Content"
    }));
  }));
}
function GroupAccordion(props) {
  const {
    groups,
    children
  } = props;
  if (!groups) {
    return null;
  }
  return [...groups.values()].map(group => /*#__PURE__*/react.cloneElement(children, {
    ...props,
    children: children.props.children,
    group,
    ...group,
    key: group.title
  }));
}
function Content(props) {
  const {
    children,
    asChild,
    ...childProps
  } = props;
  const {
    group
  } = props;
  Object.assign(childProps, group);
  if (!group) {
    return null;
  }
  if (asChild) {
    return /*#__PURE__*/react.cloneElement(children, {
      ...group,
      ...props,
      children: children.props.children
    });
  }
  return /*#__PURE__*/react.createElement(ui_next_src/* AccordionContent */.ub_, null, /*#__PURE__*/react.cloneElement(children, {
    ...group,
    ...props,
    children: children.props.children
  }));
}
function Trigger(props) {
  const {
    children,
    asChild,
    ...childProps
  } = props;
  const {
    group
  } = props;
  Object.assign(childProps, group);
  if (!group) {
    return null;
  }
  if (asChild) {
    return /*#__PURE__*/react.cloneElement(children, childProps);
  }
  return /*#__PURE__*/react.createElement(ui_next_src/* AccordionTrigger */.$m7, {
    value: group.value,
    asChild: true
  }, /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.cloneElement(children, childProps), /*#__PURE__*/react.createElement(react_icons_esm/* ChevronDownIcon */.D3D, {
    key: "chevronDown",
    className: "text-primary h-4 w-4 shrink-0 transition-transform duration-200"
  })));
}
AccordionGroup.Content = Content;
AccordionGroup.Trigger = Trigger;
AccordionGroup.Accordion = GroupAccordion;
/* harmony default export */ const AccordionGroup_AccordionGroup = (AccordionGroup);
;// ../../../extensions/cornerstone/src/components/AccordionGroup/index.ts


/* harmony default export */ const components_AccordionGroup = (AccordionGroup_AccordionGroup);
;// ../../../extensions/cornerstone/src/components/MeasurementTableNested.tsx
function MeasurementTableNested_extends() { return MeasurementTableNested_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, MeasurementTableNested_extends.apply(null, arguments); }




/**
 * This is a measurement table that is designed to be nested inside
 * the accordion groups.
 */
function MeasurementTableNested(props) {
  const {
    title,
    items,
    group,
    customHeader
  } = props;
  const {
    commandsManager
  } = (0,src.useSystem)();
  const onAction = (e, command, uid) => {
    commandsManager.run(command, {
      uid,
      annotationUID: uid,
      displayMeasurements: items
    });
  };
  return /*#__PURE__*/react.createElement(ui_next_src/* MeasurementTable */.VaM, MeasurementTableNested_extends({
    title: title ? title : `Measurements`,
    data: items,
    onAction: onAction
  }, group, {
    key: group.key
  }), /*#__PURE__*/react.createElement(ui_next_src/* MeasurementTable */.VaM.Header, {
    key: "measurementTableHeader"
  }, customHeader && group.isFirst && customHeader({
    ...props,
    items: props.allItems
  })), /*#__PURE__*/react.createElement(ui_next_src/* MeasurementTable */.VaM.Body, {
    key: "measurementTableBody"
  }));
}
;// ../../../extensions/cornerstone/src/components/MeasurementsOrAdditionalFindings.tsx




const {
  filterNot,
  filterAdditionalFindings
} = src.utils.MeasurementFilters;
const MeasurementOrAdditionalFindingSets = [{
  title: 'Measurements',
  filter: filterNot(filterAdditionalFindings)
}, {
  title: 'Additional Findings',
  filter: filterAdditionalFindings
}];

/**
 * Groups measurements by study in order to allow display and saving by study
 * @param {Object} servicesManager
 */
const groupByNamedSets = (items, grouping) => {
  const groups = new Map();
  const {
    namedSets
  } = grouping;
  for (const namedSet of namedSets) {
    const name = namedSet.id || namedSet.title;
    groups.set(name, {
      ...grouping,
      ...namedSet,
      items: [],
      isFirst: groups.size === 0,
      title: name,
      key: name
    });
  }
  items.forEach(item => {
    for (const namedSet of namedSets) {
      if (namedSet.filter(item)) {
        const name = namedSet.id || namedSet.title;
        groups.get(name).items.push(item);
        return;
      }
    }
  });
  for (const namedSet of namedSets) {
    const name = namedSet.id || namedSet.title;
    if (!groups.get(name).items.length) {
      groups.delete(name);
    }
  }
  return groups;
};
function MeasurementsOrAdditionalFindings(props) {
  const {
    items,
    children,
    grouping = {},
    customHeader,
    group,
    actions
  } = props;
  return /*#__PURE__*/react.createElement(components_AccordionGroup, {
    grouping: {
      groupingFunction: groupByNamedSets,
      name: 'measurementsOrAdditional',
      namedSets: MeasurementOrAdditionalFindingSets,
      StudyInstanceUID: group?.StudyInstanceUID,
      ...grouping
    },
    items: items,
    sourceChildren: children
  }, /*#__PURE__*/react.createElement(components_AccordionGroup.Accordion, {
    noWrapper: "true"
  }, /*#__PURE__*/react.createElement(MeasurementTableNested, {
    customHeader: customHeader,
    allItems: items,
    actions: actions
  })));
}
/* harmony default export */ const components_MeasurementsOrAdditionalFindings = (MeasurementsOrAdditionalFindings);
;// ../../../extensions/cornerstone/src/components/StudySummaryFromMetadata.tsx



const {
  formatDate
} = src.utils;
function StudySummaryFromMetadata(props) {
  const {
    StudyInstanceUID
  } = props;
  if (!StudyInstanceUID) {
    return null;
  }
  const studyMeta = src.DicomMetadataStore.getStudy(StudyInstanceUID);
  if (!studyMeta?.series?.length) {
    return null;
  }
  const instanceMeta = studyMeta.series[0].instances[0];
  const {
    StudyDate,
    StudyDescription
  } = instanceMeta;
  return /*#__PURE__*/react.createElement(ui_next_src/* StudySummary */.u3f, {
    date: formatDate(StudyDate),
    description: StudyDescription
  });
}
;// ../../../extensions/cornerstone/src/components/StudyMeasurementsActions.tsx



function StudyMeasurementsActions({
  items,
  StudyInstanceUID,
  measurementFilter,
  actions
}) {
  const {
    commandsManager
  } = (0,src.useSystem)();
  const disabled = !items?.length;
  if (disabled) {
    return null;
  }
  return /*#__PURE__*/react.createElement("div", {
    className: "bg-background flex h-9 w-full items-center rounded pr-0.5"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex space-x-1"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    size: "sm",
    variant: "ghost",
    className: "pl-1.5",
    onClick: () => {
      commandsManager.runCommand('downloadCSVMeasurementsReport', {
        StudyInstanceUID,
        measurementFilter
      });
    }
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Download, {
    className: "h-5 w-5"
  }), /*#__PURE__*/react.createElement("span", {
    className: "pl-1"
  }, "CSV")), /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    size: "sm",
    variant: "ghost",
    className: "pl-0.5",
    onClick: e => {
      e.stopPropagation();
      if (actions?.createSR) {
        actions.createSR({
          StudyInstanceUID,
          measurementFilter
        });
        return;
      }
      commandsManager.run('promptSaveReport', {
        StudyInstanceUID,
        measurementFilter
      });
    }
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Add, null), "Create SR"), /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    size: "sm",
    variant: "ghost",
    className: "pl-0.5",
    onClick: e => {
      e.stopPropagation();
      if (actions?.onDelete) {
        actions.onDelete();
        return;
      }
      commandsManager.runCommand('clearMeasurements', {
        measurementFilter
      });
    }
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Delete, null), "Delete")));
}
/* harmony default export */ const components_StudyMeasurementsActions = (StudyMeasurementsActions);
;// ../../../extensions/cornerstone/src/components/StudySummaryWithActions.tsx



function StudySummaryWithActions(props) {
  return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(StudySummaryFromMetadata, props), /*#__PURE__*/react.createElement(components_StudyMeasurementsActions, props));
}
/* harmony default export */ const components_StudySummaryWithActions = (StudySummaryWithActions);
;// ../../../extensions/cornerstone/src/components/StudyMeasurements.tsx


// import { AccordionContent, AccordionItem, AccordionTrigger } from '@ohif/ui-next';




const {
  MeasurementFilters
} = src.utils;

/**
 * Groups measurements by study in order to allow display and saving by study
 * @param {Object} servicesManager
 */
const groupByStudy = (items, grouping, childProps) => {
  const groups = new Map();
  const {
    activeStudyUID
  } = grouping;
  const {
    displaySetService
  } = childProps.servicesManager.services;
  const getItemStudyInstanceUID = item => {
    const displaySet = displaySetService.getDisplaySetByUID(item.displaySetInstanceUID);
    return displaySet.instances[0].StudyInstanceUID;
  };
  let firstSelected, firstGroup;
  items.filter(item => item.displaySetInstanceUID).forEach(item => {
    const studyUID = getItemStudyInstanceUID(item);
    if (!groups.has(studyUID)) {
      const items = [];
      const filter = MeasurementFilters.filterAnd(MeasurementFilters.filterMeasurementsByStudyUID(studyUID), grouping.filter);
      const group = {
        ...grouping,
        items,
        displayMeasurements: items,
        key: studyUID,
        isSelected: studyUID === activeStudyUID,
        StudyInstanceUID: studyUID,
        filter,
        measurementFilter: filter
      };
      if (group.isSelected && !firstSelected) {
        firstSelected = group;
      }
      firstGroup ||= group;
      groups.set(studyUID, group);
    }
    if (!firstSelected && firstGroup) {
      firstGroup.isSelected = true;
    }
    const group = groups.get(studyUID);
    group.items.push(item);
  });
  return groups;
};
function StudyMeasurements(props) {
  const {
    items,
    grouping = {},
    children
  } = props;
  const system = (0,src.useSystem)();
  const activeDisplaySets = (0,src.useActiveViewportDisplaySets)(system);
  const activeStudyUID = activeDisplaySets?.[0]?.StudyInstanceUID;
  return /*#__PURE__*/react.createElement(AccordionGroup, {
    grouping: {
      name: 'groupByStudy',
      groupingFunction: groupByStudy,
      activeStudyUID,
      ...grouping
    },
    items: items,
    value: [activeStudyUID],
    sourceChildren: children
  }, /*#__PURE__*/react.createElement(AccordionGroup.Trigger, null, /*#__PURE__*/react.createElement(components_StudySummaryWithActions, null)), /*#__PURE__*/react.createElement(components_MeasurementsOrAdditionalFindings, {
    activeStudyUID: activeStudyUID
  }));
}
/* harmony default export */ const components_StudyMeasurements = (StudyMeasurements);
;// ../../../extensions/cornerstone/src/panels/PanelMeasurement.tsx



/**
 * The PanelMeasurement is a fairly simple wrapper that gets the filtered
 * measurements and then passes it on to the children component, default to
 * the StudyMeasurements sub-component if no children are specified.
 * Some example customizations that could work:
 *
 *
 * Creates a default study measurements panel with default children:
 * ```
 * <PanelMeasurement>
 *   <StudyMeasurements />
 * </PanelMeasurement>
 * ```
 *
 * A study measurements with body replacement
 * ```
 * <StudyMeasurements>
 *   <SeriesMeasurements />
 * </StudyMeasurements>
 * ```
 *
 * A study measurements replacing just the trigger, leaving the default body
 * ```
 * <StudyMeasurements>
 *    <AccordionGroup.Trigger>
 *        This is a new custom trigger
 *    </AccordionGroup.Trigger>
 *</StudyMeasurements>
 * ```
 *
 * A study measurements with the trigger and body replaced
 * ```
 * <StudyMeasurements>
 *    <AccordionGroup.Trigger>
 *        This is a new custom trigger
 *    </AccordionGroup.Trigger>
 *    <SeriesMeasurements />
 * </StudyMeasurements>
 * ```
 *
 * A study measurements with a custom header for the additional findings
 * ```
 * <StudyMeasurements>
 *    <MeasurementOrAdditionalFindings>
 *        <AccordionGroup.Trigger groupName="additionalFindings">
 *            <CustomAdditionalFindingsHeader />
 *        </AccordionGroup.Trigger>
 *        <AccordionGroup.Trigger groupName="measurements">
 *            <CustomMeasurementsHeader />
 *        </AccordionGroup.Trigger>
 *    </MeasurementOrAdditionalFindings>
 * </StudyMeasurements>
 *```
 */
function PanelMeasurement(props) {
  const {
    measurementFilter,
    emptyComponent: EmptyComponent,
    children
  } = props;
  const displayMeasurements = (0,useMeasurements/* useMeasurements */.d)({
    measurementFilter
  });
  if (!displayMeasurements.length) {
    return EmptyComponent ? /*#__PURE__*/react.createElement(EmptyComponent, {
      items: displayMeasurements
    }) : /*#__PURE__*/react.createElement("span", {
      className: "text-white"
    }, "No Measurements");
  }
  if (children) {
    const cloned = react.Children.map(children, child => /*#__PURE__*/react.cloneElement(child, {
      items: displayMeasurements,
      filter: measurementFilter
    }));
    return cloned;
  }
  // Need to merge defaults on the content props to ensure they get passed to children
  return /*#__PURE__*/react.createElement(components_StudyMeasurements, {
    items: displayMeasurements
  });
}
;// ../../../extensions/cornerstone/src/getPanelModule.tsx





const getPanelModule = ({
  commandsManager,
  servicesManager,
  extensionManager
}) => {
  const wrappedPanelSegmentation = ({
    configuration
  }) => {
    return /*#__PURE__*/react.createElement(PanelSegmentation, {
      commandsManager: commandsManager,
      servicesManager: servicesManager,
      extensionManager: extensionManager,
      configuration: {
        ...configuration
      }
    });
  };
  const wrappedPanelSegmentationNoHeader = ({
    configuration
  }) => {
    return /*#__PURE__*/react.createElement(PanelSegmentation, {
      commandsManager: commandsManager,
      servicesManager: servicesManager,
      extensionManager: extensionManager,
      configuration: {
        ...configuration
      }
    });
  };
  const wrappedPanelSegmentationWithTools = ({
    configuration
  }) => {
    const {
      toolbarService
    } = servicesManager.services;
    return /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement(default_src.Toolbox, {
      buttonSectionId: toolbarService.sections.segmentationToolbox,
      title: "Segmentation Tools"
    }), /*#__PURE__*/react.createElement(PanelSegmentation, {
      commandsManager: commandsManager,
      servicesManager: servicesManager,
      extensionManager: extensionManager,
      configuration: {
        ...configuration
      }
    }));
  };
  return [{
    name: 'activeViewportWindowLevel',
    component: () => {
      return /*#__PURE__*/react.createElement(ActiveViewportWindowLevel_ActiveViewportWindowLevel, {
        servicesManager: servicesManager
      });
    }
  }, {
    name: 'panelMeasurement',
    iconName: 'tab-linear',
    iconLabel: 'Measure',
    label: 'Measurement',
    component: PanelMeasurement
  }, {
    name: 'panelSegmentation',
    iconName: 'tab-segmentation',
    iconLabel: 'Segmentation',
    label: 'Segmentation',
    component: wrappedPanelSegmentation
  }, {
    name: 'panelSegmentationNoHeader',
    iconName: 'tab-segmentation',
    iconLabel: 'Segmentation',
    label: 'Segmentation',
    component: wrappedPanelSegmentationNoHeader
  }, {
    name: 'panelSegmentationWithTools',
    iconName: 'tab-segmentation',
    iconLabel: 'Segmentation',
    label: 'Segmentation',
    component: wrappedPanelSegmentationWithTools
  }];
};
/* harmony default export */ const src_getPanelModule = (getPanelModule);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/hooks/useSegmentations.ts
var useSegmentations = __webpack_require__(73421);
;// ../../../extensions/cornerstone/src/utils/segmentUtils.ts
const handleSegmentChange = ({
  direction,
  segmentationId,
  viewportId,
  selectedSegmentObjectIndex,
  segmentationService
}) => {
  const segmentation = segmentationService.getSegmentation(segmentationId);
  const {
    segments
  } = segmentation;
  const numberOfSegments = Object.keys(segments).length;

  // Get activeSegment each time because the user can select any segment from the list and thus the index should be updated
  const activeSegment = segmentationService.getActiveSegment(viewportId);
  if (activeSegment) {
    // from the activeSegment get the actual object array index to be used
    selectedSegmentObjectIndex = Object.values(segments).findIndex(segment => segment.segmentIndex === activeSegment.segmentIndex);
  }
  let newSelectedSegmentIndex = selectedSegmentObjectIndex + direction;

  // Handle looping through list of segments
  if (newSelectedSegmentIndex > numberOfSegments - 1) {
    newSelectedSegmentIndex = 0;
  } else if (newSelectedSegmentIndex < 0) {
    newSelectedSegmentIndex = numberOfSegments - 1;
  }

  // Convert segmentationId from object array index to property value of type Segment
  // Functions below use the segmentIndex object attribute so we have to do the conversion
  const segmentIndex = Object.values(segments)[newSelectedSegmentIndex]?.segmentIndex;
  segmentationService.setActiveSegment(segmentationId, segmentIndex);
  segmentationService.jumpToSegmentCenter(segmentationId, segmentIndex, viewportId);
  selectedSegmentObjectIndex = newSelectedSegmentIndex;
};
;// ../../../extensions/cornerstone/src/utils/isReferenceViewable.ts


var OrientationAxis = esm.Enums.OrientationAxis;
const isReferenceViewable = (servicesManager, viewportId, reference, viewportOptions) => {
  const {
    cornerstoneViewportService,
    displaySetService
  } = servicesManager.services;
  if (!viewportOptions) {
    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);

    // we can make a customization for this to allow specific settings
    // The annotation can be seen either via navigation or by changing to a volume
    const isViewable = viewport.isReferenceViewable(reference, {
      withNavigation: true,
      asVolume: true
    });
    return isViewable;
  }
  if (viewportOptions.viewportType === 'stack') {
    // we only need the viewport to include the referenced imageId
    const displaySet = displaySetService.getDisplaySetByUID(reference.displaySetInstanceUID);
    const imageIds = displaySet.instances.map(instance => instance.imageId);
    return imageIds.includes(reference.referencedImageId);
  }

  // for the volume viewports, we need to check orientation
  const {
    orientation
  } = viewportOptions;

  // Todo: handle hanging protocols that have acquisition orientation
  const closestOrientation = getClosestOrientationFromIOP(displaySetService, reference.displaySetInstanceUID);
  return closestOrientation === orientation;
};

/**
 * Get the plane (orientation) to which the ImageOrientationPatient is most closely aligned
 *
 * @param displaySetService
 * @param displaySetInstanceUID
 * @returns orientation
 */
function getClosestOrientationFromIOP(displaySetService, displaySetInstanceUID) {
  const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
  const imageOrientationPatient = displaySet.instances[0].ImageOrientationPatient;
  // ImageOrientationPatient must be an array of length 6.
  if (imageOrientationPatient?.length !== 6) {
    return;
  }

  // Take cross product to get vector coming "out" of image plane
  const rowCosineVec = gl_matrix_esm/* vec3.fromValues */.eR.fromValues(imageOrientationPatient[0], imageOrientationPatient[1], imageOrientationPatient[2]);
  const colCosineVec = gl_matrix_esm/* vec3.fromValues */.eR.fromValues(imageOrientationPatient[3], imageOrientationPatient[4], imageOrientationPatient[5]);
  const scanAxisNormal = gl_matrix_esm/* vec3.cross */.eR.cross(gl_matrix_esm/* vec3.create */.eR.create(), rowCosineVec, colCosineVec);

  // Define the reference vectors for axial, coronal, and sagittal planes
  const unitVectors = {
    [OrientationAxis.AXIAL]: gl_matrix_esm/* vec3.fromValues */.eR.fromValues(0, 0, 1),
    [OrientationAxis.CORONAL]: gl_matrix_esm/* vec3.fromValues */.eR.fromValues(0, 1, 0),
    [OrientationAxis.SAGITTAL]: gl_matrix_esm/* vec3.fromValues */.eR.fromValues(1, 0, 0)
  };

  // Compute dot products for each reference plane
  // Because all vectors are normalized, dot product is bounded between -1 and 1
  let maxDot = 0;
  let maxOrientation = '';
  for (const [k, v] of Object.entries(unitVectors)) {
    // Absolute value of dot product because we only care about alignment with the axis
    // For example, dot product of -1 for a given axis means perfect alignment
    // but the image is pointing in the "opposite" direction
    const res = Math.abs(gl_matrix_esm/* vec3.dot */.eR.dot(scanAxisNormal, v));
    if (res > maxDot) {
      maxDot = res;
      maxOrientation = k;
    }
  }
  return maxOrientation;
}
;// ../../../extensions/cornerstone/src/utils/segmentationHandlers.ts



/**
 * Sets up the handler for segmentation data modification events
 */
function setupSegmentationDataModifiedHandler({
  segmentationService,
  customizationService,
  commandsManager
}) {
  // A flag to indicate if the event is unsubscribed to. This is important because
  // the debounced callback does an await and in that period of time the event may have
  // been unsubscribed.
  let isUnsubscribed = false;
  const {
    unsubscribe: debouncedUnsubscribe
  } = segmentationService.subscribeDebounced(segmentationService.EVENTS.SEGMENTATION_DATA_MODIFIED, async ({
    segmentationId
  }) => {
    const segmentation = segmentationService.getSegmentation(segmentationId);
    if (!segmentation) {
      return;
    }
    const readableText = customizationService.getCustomization('panelSegmentation.readableText');

    // Check for segments with bidirectional measurements and update them
    const segmentIndices = Object.keys(segmentation.segments).map(index => parseInt(index)).filter(index => index > 0);
    for (const segmentIndex of segmentIndices) {
      const segment = segmentation.segments[segmentIndex];
      if (segment?.cachedStats?.namedStats?.bidirectional) {
        // Run the command to update the bidirectional measurement
        commandsManager.runCommand('runSegmentBidirectional', {
          segmentationId,
          segmentIndex
        });
      }
    }
    const updatedSegmentation = await updateSegmentationStats({
      segmentation,
      segmentationId,
      readableText
    });
    if (!isUnsubscribed && updatedSegmentation) {
      segmentationService.addOrUpdateSegmentation({
        segmentationId,
        segments: updatedSegmentation.segments
      });
    }
  }, 1000);
  const unsubscribe = () => {
    isUnsubscribed = true;
    debouncedUnsubscribe();
  };
  return {
    unsubscribe
  };
}

/**
 * Sets up the handler for segmentation modification events
 */
function setupSegmentationModifiedHandler({
  segmentationService
}) {
  const {
    unsubscribe
  } = segmentationService.subscribe(segmentationService.EVENTS.SEGMENTATION_MODIFIED, async ({
    segmentationId
  }) => {
    const segmentation = segmentationService.getSegmentation(segmentationId);
    if (!segmentation) {
      return;
    }
    const annotationState = dist_esm.annotation.state.getAllAnnotations();
    const bidirectionalAnnotations = annotationState.filter(annotation => annotation.metadata.toolName === dist_esm.SegmentBidirectionalTool.toolName);
    let toRemoveUIDs = [];
    if (!segmentation) {
      toRemoveUIDs = bidirectionalAnnotations.map(annotation => annotation.metadata.segmentationId === segmentationId);
      return;
    } else {
      const segmentIndices = Object.keys(segmentation.segments).map(index => parseInt(index)).filter(index => index > 0);

      // check if there is a bidirectional data that exists but the segment
      // does not exists anymore we need to remove the bidirectional data
      const bidirectionalAnnotationsToRemove = bidirectionalAnnotations.filter(annotation => annotation.metadata.segmentationId === segmentationId && !segmentIndices.includes(annotation.metadata.segmentIndex));
      toRemoveUIDs = bidirectionalAnnotationsToRemove.map(annotation => annotation.annotationUID);
    }
    toRemoveUIDs.forEach(uid => {
      dist_esm.annotation.state.removeAnnotation(uid);
    });
  });
  return {
    unsubscribe
  };
}
;// ../../../extensions/cornerstone/src/utils/promptHydrationDialog.ts
const HydrationType = {
  SEG: 'SEG',
  SR: 'SR',
  RTSTRUCT: 'RTSTRUCT'
};
const RESPONSE = {
  NO_NEVER: -1,
  CANCEL: 0,
  CREATE_REPORT: 1,
  ADD_SERIES: 2,
  SET_STUDY_AND_SERIES: 3,
  NO_NOT_FOR_SERIES: 4,
  HYDRATE: 5
};
function getCustomizationMessageKey(type) {
  switch (type) {
    case HydrationType.RTSTRUCT:
      return 'viewportNotification.hydrateRTMessage';
    case HydrationType.SEG:
      return 'viewportNotification.hydrateSEGMessage';
    case HydrationType.SR:
      return 'viewportNotification.hydrateSRMessage';
    default:
      return 'viewportNotification.hydrateMessage';
  }
}
function getDialogId(type) {
  switch (type) {
    case HydrationType.RTSS:
      return 'promptHydrateRT';
    case HydrationType.SEG:
      return 'promptHydrateSEG';
    case HydrationType.SR:
      return 'promptHydrateSR';
    default:
      return 'promptHydrate';
  }
}
function promptHydrationDialog({
  servicesManager,
  viewportId,
  displaySet,
  preHydrateCallbacks = [],
  hydrateCallback,
  type
}) {
  const {
    uiViewportDialogService,
    customizationService
  } = servicesManager.services;
  const extensionManager = servicesManager._extensionManager;
  const appConfig = extensionManager._appConfig;

  // Todo: make this use enum from the extension, we should move the enum
  const standardMode = appConfig?.measurementTrackingMode === 'standard';
  return new Promise(async function (resolve, reject) {
    // For RT and SEG, we check disableConfirmationPrompts
    // For SR, we check if standardMode is true
    const shouldPrompt = type === HydrationType.SR ? standardMode : !appConfig?.disableConfirmationPrompts;
    const promptResult = shouldPrompt ? await _askHydrate(uiViewportDialogService, customizationService, viewportId, type) : RESPONSE.HYDRATE;
    if (promptResult === RESPONSE.HYDRATE) {
      // Execute preHydrate callbacks
      preHydrateCallbacks?.forEach(callback => {
        callback();
      });
      if (type === HydrationType.SEG) {
        // SEG needs setTimeout
        window.setTimeout(async () => {
          const isHydrated = await hydrateCallback({
            segDisplaySet: displaySet,
            viewportId
          });
          resolve(isHydrated);
        }, 0);
      } else if (type === HydrationType.RTSTRUCT) {
        // RT hydration
        const isHydrated = await hydrateCallback({
          rtDisplaySet: displaySet,
          viewportId,
          servicesManager
        });
        resolve(isHydrated);
      } else if (type === HydrationType.SR) {
        // SR has a different result structure
        const hydrationResult = await hydrateCallback(displaySet);
        resolve({
          userResponse: promptResult,
          displaySetInstanceUID: displaySet.displaySetInstanceUID,
          srSeriesInstanceUID: displaySet.SeriesInstanceUID,
          viewportId,
          StudyInstanceUID: hydrationResult?.StudyInstanceUID,
          SeriesInstanceUIDs: hydrationResult?.SeriesInstanceUIDs
        });
      }
    } else {
      if (type === HydrationType.SR) {
        resolve({
          userResponse: promptResult,
          displaySetInstanceUID: displaySet.displaySetInstanceUID,
          srSeriesInstanceUID: displaySet.SeriesInstanceUID,
          viewportId
        });
      } else {
        resolve(false);
      }
    }
  });
}
function _askHydrate(uiViewportDialogService, customizationService, viewportId, type) {
  return new Promise(function (resolve, reject) {
    const messageKey = getCustomizationMessageKey(type);
    const message = customizationService.getCustomization(messageKey);
    const actions = [{
      id: 'no-hydrate',
      type: 'secondary',
      text: 'No',
      value: RESPONSE.CANCEL
    }, {
      id: 'yes-hydrate',
      type: 'primary',
      text: 'Yes',
      value: RESPONSE.HYDRATE
    }];
    const onSubmit = result => {
      uiViewportDialogService.hide();
      resolve(result);
    };
    uiViewportDialogService.show({
      id: getDialogId(type),
      viewportId,
      type: 'info',
      message,
      actions,
      onSubmit,
      onOutsideClick: () => {
        uiViewportDialogService.hide();
        resolve(RESPONSE.CANCEL);
      },
      onKeyPress: event => {
        if (event.key === 'Enter') {
          onSubmit(RESPONSE.HYDRATE);
        }
      }
    });
  });
}
/* harmony default export */ const utils_promptHydrationDialog = (promptHydrationDialog);
;// ../../../extensions/cornerstone/src/utils/index.ts




const utils_utils = {
  handleSegmentChange: handleSegmentChange,
  isReferenceViewable: isReferenceViewable,
  setupSegmentationDataModifiedHandler: setupSegmentationDataModifiedHandler,
  setupSegmentationModifiedHandler: setupSegmentationModifiedHandler,
  promptHydrationDialog: utils_promptHydrationDialog
};
/* harmony default export */ const src_utils = (utils_utils);
;// ../../../extensions/cornerstone/src/utils/setUpSegmentationEventHandlers.ts

const setUpSegmentationEventHandlers = ({
  servicesManager,
  commandsManager
}) => {
  const {
    segmentationService,
    customizationService,
    displaySetService
  } = servicesManager.services;
  const {
    unsubscribe: unsubscribeSegmentationDataModifiedHandler
  } = setupSegmentationDataModifiedHandler({
    segmentationService,
    customizationService,
    commandsManager
  });
  const {
    unsubscribe: unsubscribeSegmentationModifiedHandler
  } = setupSegmentationModifiedHandler({
    segmentationService
  });
  const {
    unsubscribe: unsubscribeSegmentationCreated
  } = segmentationService.subscribe(segmentationService.EVENTS.SEGMENTATION_ADDED, evt => {
    const {
      segmentationId
    } = evt;
    const displaySet = displaySetService.getDisplaySetByUID(segmentationId);
    if (displaySet) {
      return;
    }
    const segmentation = segmentationService.getSegmentation(segmentationId);
    const label = segmentation.cachedStats.info;
    const imageIds = segmentation.representationData.Labelmap.imageIds;

    // Create a display set for the segmentation
    const segmentationDisplaySet = {
      displaySetInstanceUID: segmentationId,
      SOPClassUID: '1.2.840.10008.5.1.4.1.1.66.4',
      SOPClassHandlerId: '@ohif/extension-cornerstone-dicom-seg.sopClassHandlerModule.dicom-seg',
      SeriesDescription: label,
      Modality: 'SEG',
      numImageFrames: imageIds.length,
      imageIds,
      isOverlayDisplaySet: true,
      label,
      madeInClient: true,
      segmentationId: segmentationId,
      isDerived: true
    };
    displaySetService.addDisplaySets(segmentationDisplaySet);
  });
  const unsubscriptions = [unsubscribeSegmentationDataModifiedHandler, unsubscribeSegmentationModifiedHandler, unsubscribeSegmentationCreated];
  return {
    unsubscriptions
  };
};
;// ../../../extensions/cornerstone/src/components/MeasurementsMenu.tsx



function MeasumentsMenu(props) {
  const {
    group,
    classNames
  } = props;
  if (!group.items?.length) {
    console.log('No items to iterate', group.items);
    return null;
  }
  const {
    items
  } = group;
  const [item] = items;
  const {
    isSelected,
    isVisible
  } = item;
  const system = (0,src.useSystem)();
  const onAction = (event, command, args) => {
    const uid = items.map(item => item.uid);
    // Some commands use displayMeasurements and some use items
    system.commandsManager.run(command, {
      ...args,
      uid,
      displayMeasurements: items,
      items,
      event
    });
  };
  const [isDropdownOpen, setIsDropdownOpen] = (0,react.useState)(false);
  return /*#__PURE__*/react.createElement("div", {
    className: `relative ml-2 inline-flex items-center space-x-1 ${classNames}`
  }, /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    size: "icon",
    variant: "ghost",
    className: `h-6 w-6 transition-opacity ${isSelected || !isVisible ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`,
    "aria-label": isVisible ? 'Hide' : 'Show',
    onClick: e => {
      e.stopPropagation();
      onAction(e, ['jumpToMeasurement', 'toggleVisibilityMeasurement']);
    }
  }, isVisible ? /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Hide, {
    className: "h-6 w-6"
  }) : /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Show, {
    className: "h-6 w-6"
  })), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenu */.rId, {
    onOpenChange: open => setIsDropdownOpen(open)
  }, /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuTrigger */.tyb, {
    asChild: true
  }, /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    size: "icon",
    variant: "ghost",
    className: `h-6 w-6 transition-opacity ${isSelected || isDropdownOpen ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`,
    "aria-label": "Actions",
    onClick: e => e.stopPropagation() // Prevent row selection on button click
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.More, {
    className: "h-6 w-6"
  }))), /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuContent */.SQm, {
    align: "end"
  }, /*#__PURE__*/react.createElement(ui_next_src/* DropdownMenuItem */._26, {
    onClick: e => onAction(e, 'removeMeasurement')
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Delete, {
    className: "text-foreground"
  }), /*#__PURE__*/react.createElement("span", {
    className: "pl-2"
  }, "Delete")))));
}
/* harmony default export */ const MeasurementsMenu = (MeasumentsMenu);
;// ../../../extensions/cornerstone/src/components/PanelAccordionTrigger.tsx
function PanelAccordionTrigger_extends() { return PanelAccordionTrigger_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, PanelAccordionTrigger_extends.apply(null, arguments); }



function onClickDefault(e) {
  const {
    group,
    onClick = group?.onClick
  } = this;
  if (!onClick) {
    console.log('No onClick function', group);
    return;
  }
  console.log('onClickDefault');
  e.preventDefault();
  e.stopPropagation();
  onClick(e, group);
  return false;
}
function PanelAccordionTrigger(props) {
  const {
    marginLeft = 8,
    isActive = false,
    colorHex,
    count,
    text,
    menu: Menu = null
  } = props;
  return /*#__PURE__*/react.createElement(ui_next_src/* AccordionTrigger */.$m7, {
    style: {
      marginLeft: `${marginLeft}px`,
      padding: 0
    },
    asChild: true
  }, /*#__PURE__*/react.createElement("div", {
    className: `inline-flex text-base ${isActive ? 'bg-popover' : 'bg-muted'} flex-grow`
  }, /*#__PURE__*/react.createElement("button", {
    onClick: onClickDefault.bind(props)
  }, /*#__PURE__*/react.createElement("span", {
    className: `inline-flex rounded-l border-r border-black ${isActive ? 'bg-highlight' : 'bg-muted'}`
  }, count !== undefined ? /*#__PURE__*/react.createElement("span", {
    className: "px-2"
  }, count) : null, colorHex && /*#__PURE__*/react.createElement(ui_next_src/* ColorCircle */.cd8, {
    colorHex: colorHex
  })), /*#__PURE__*/react.createElement("span", null, text)), Menu && /*#__PURE__*/react.createElement(Menu, PanelAccordionTrigger_extends({}, props, {
    classNames: "justify-end flex-grow"
  })), /*#__PURE__*/react.createElement(react_icons_esm/* ChevronDownIcon */.D3D, {
    className: "text-primary h-4 w-4 shrink-0 transition-transform duration-200"
  })));
}
;// ../../../extensions/cornerstone/src/components/MeasurementItems.tsx





function MeasurementItem(props) {
  const {
    index,
    item
  } = props;
  return /*#__PURE__*/react.createElement(PanelAccordionTrigger, {
    count: index + 1,
    text: item.toolName || item.label || item.title,
    colorHex: "#f00",
    isActive: item.isSelected,
    menu: MeasurementsMenu,
    group: {
      items: [item],
      onClick: props.onClick
    }
  });
}
function MeasurementAccordion(props) {
  const {
    items
  } = props;
  const system = (0,src.useSystem)();
  const onClick = (e, group) => {
    const {
      items
    } = group;
    // Just jump to the first measurement in the set, and mark that one as active
    // with the set of items.
    system.commandsManager.run('jumpToMeasurement', {
      uid: items[0].uid,
      displayMeasurements: items,
      group
    });
  };
  return /*#__PURE__*/react.createElement(ui_next_src/* Accordion */.nD3, {
    type: "multiple",
    className: "flex-shrink-0 overflow-hidden"
  }, items.map((item, index) => {
    const {
      displayText: details = {}
    } = item;
    return /*#__PURE__*/react.createElement(ui_next_src/* AccordionItem */.AsP, {
      key: `measurementAccordion:${item.uid}`,
      value: item.uid
    }, /*#__PURE__*/react.createElement(MeasurementItem, {
      item: item,
      key: `measurementItem:${item.uid}`,
      index: index,
      onClick: onClick
    }), /*#__PURE__*/react.createElement(ui_next_src/* AccordionContent */.ub_, {
      key: `measurementContent:${item.uid}`
    }, /*#__PURE__*/react.createElement("div", {
      className: "ml-7 px-2 py-2"
    }, /*#__PURE__*/react.createElement("div", {
      className: "text-secondary-foreground flex items-center gap-1 text-base leading-normal"
    }, details.primary?.length > 0 && details.primary.map((detail, index) => /*#__PURE__*/react.createElement("span", {
      key: `details:${item.uid}:${index}`
    }, detail))))));
  }));
}
;// ../../../extensions/cornerstone/src/components/SeriesMeasurements.tsx







/**
 * Groups measurements by study in order to allow display and saving by study
 * @param {Object} servicesManager
 */
const groupByDisplaySet = (items, grouping, childProps) => {
  const groups = new Map();
  const {
    displaySetService
  } = childProps.servicesManager.services;
  const {
    activeDisplaySetInstanceUID
  } = grouping;
  items.forEach(item => {
    const {
      displaySetInstanceUID
    } = item;
    if (!groups.has(displaySetInstanceUID)) {
      const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
      groups.set(displaySetInstanceUID, {
        header: null,
        isSelected: displaySetInstanceUID == activeDisplaySetInstanceUID,
        ...grouping,
        items: [],
        key: displaySetInstanceUID,
        title: 'Series Measurements',
        displaySet
      });
    }
    groups.get(displaySetInstanceUID).items.push(item);
  });
  return groups;
};
function SeriesMeasurementTrigger(props) {
  const {
    group,
    isSelected,
    displaySet,
    menu
  } = props;
  const {
    SeriesNumber = 1,
    SeriesDescription
  } = displaySet;
  return /*#__PURE__*/react.createElement(PanelAccordionTrigger, {
    text: `Series #${SeriesNumber} ${SeriesDescription}`,
    count: group.items.length,
    isActive: isSelected,
    group: group,
    menu: menu,
    marginLeft: "0"
  });
}
function SeriesMeasurements(props) {
  const {
    items,
    grouping = {},
    children
  } = props;
  const system = (0,src.useSystem)();
  const activeDisplaySets = (0,src.useActiveViewportDisplaySets)(system);
  const activeDisplaySetInstanceUID = activeDisplaySets?.[0]?.displaySetInstanceUID;
  const onClick = (_e, group) => {
    const {
      items
    } = group;
    system.commandsManager.run('jumpToMeasurement', {
      uid: items[0].uid,
      displayMeasurements: items,
      group
    });
  };

  // The content of the accordion group will default to the children of the
  // parent declaration if present, otherwise to MeasurementItems
  return /*#__PURE__*/react.createElement(components_AccordionGroup, {
    grouping: {
      groupingFunction: groupByDisplaySet,
      activeDisplaySetInstanceUID,
      ...grouping,
      onClick
    },
    items: items,
    sourceChildren: children
  }, /*#__PURE__*/react.createElement(components_AccordionGroup.Trigger, {
    asChild: true
  }, /*#__PURE__*/react.createElement(SeriesMeasurementTrigger, {
    menu: MeasurementsMenu
  })), /*#__PURE__*/react.createElement(MeasurementAccordion, null));
}
/* harmony default export */ const components_SeriesMeasurements = ((/* unused pure expression or super */ null && (SeriesMeasurements)));
;// ../../../extensions/cornerstone/src/components/WindowLevelActionMenu/index.ts











;// ../../../extensions/cornerstone/src/components/ModalityLoadBadge/index.ts

;// ../../../extensions/cornerstone/src/components/index.ts











;// ../../../extensions/cornerstone/src/index.tsx
function src_extends() { return src_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, src_extends.apply(null, arguments); }















































const {
  imageRetrieveMetadataProvider
} = esm.utilities;
const Component = /*#__PURE__*/react.lazy(() => {
  return __webpack_require__.e(/* import() */ 147).then(__webpack_require__.bind(__webpack_require__, 30147));
});
const OHIFCornerstoneViewport = props => {
  return /*#__PURE__*/react.createElement(react.Suspense, {
    fallback: /*#__PURE__*/react.createElement("div", null, "Loading...")
  }, /*#__PURE__*/react.createElement(Component, props));
};
const stackRetrieveOptions = {
  retrieveOptions: {
    single: {
      streaming: true,
      decodeLevel: 1
    }
  }
};
const unsubscriptions = [];
/**
 *
 */
const cornerstoneExtension = {
  /**
   * Only required property. Should be a unique value across all extensions.
   */
  id: id,
  onModeEnter: ({
    servicesManager,
    commandsManager
  }) => {
    const {
      cornerstoneViewportService,
      toolbarService,
      segmentationService
    } = servicesManager.services;
    const {
      unsubscriptions: segmentationUnsubscriptions
    } = setUpSegmentationEventHandlers({
      servicesManager,
      commandsManager
    });
    unsubscriptions.push(...segmentationUnsubscriptions);
    toolbarService.registerEventForToolbarUpdate(cornerstoneViewportService, [cornerstoneViewportService.EVENTS.VIEWPORT_DATA_CHANGED]);
    toolbarService.registerEventForToolbarUpdate(segmentationService, [segmentationService.EVENTS.SEGMENTATION_REMOVED, segmentationService.EVENTS.SEGMENTATION_MODIFIED]);
    toolbarService.registerEventForToolbarUpdate(esm.eventTarget, [dist_esm.Enums.Events.TOOL_ACTIVATED]);

    // Configure the interleaved/HTJ2K loader
    imageRetrieveMetadataProvider.clear();
    // The default volume interleaved options are to interleave the
    // image retrieve, but don't perform progressive loading per image
    // This interleaves images and replicates them for low-resolution depth volume
    // reconstruction, which progressively improves
    imageRetrieveMetadataProvider.add('volume', esm.ProgressiveRetrieveImages.interleavedRetrieveStages);
    // The default stack loading option is to progressive load HTJ2K images
    // There are other possible options, but these need more thought about
    // how to define them.
    imageRetrieveMetadataProvider.add('stack', stackRetrieveOptions);
  },
  getPanelModule: src_getPanelModule,
  onModeExit: ({
    servicesManager
  }) => {
    unsubscriptions.forEach(unsubscribe => unsubscribe());
    // Clear the unsubscriptions
    unsubscriptions.length = 0;
    const {
      cineService,
      segmentationService
    } = servicesManager.services;
    // Empty out the image load and retrieval pools to prevent memory leaks
    // on the mode exits
    Object.values(esm.Enums.RequestType).forEach(type => {
      esm.imageLoadPoolManager.clearRequestStack(type);
      esm.imageRetrievalPoolManager.clearRequestStack(type);
    });
    cineService.setIsCineEnabled(false);
    (0,state/* reset */.cL)();
    useLutPresentationStore/* useLutPresentationStore */.I.getState().clearLutPresentationStore();
    usePositionPresentationStore/* usePositionPresentationStore */.q.getState().clearPositionPresentationStore();
    useSynchronizersStore/* useSynchronizersStore */.U.getState().clearSynchronizersStore();
    default_src.useToggleOneUpViewportGridStore.getState().clearToggleOneUpViewportGridStore();
    useSegmentationPresentationStore/* useSegmentationPresentationStore */.v.getState().clearSegmentationPresentationStore();
    segmentationService.removeAllSegmentations();
  },
  /**
   * Register the Cornerstone 3D services and set them up for use.
   *
   * @param configuration.csToolsConfig - Passed directly to `initCornerstoneTools`
   */
  preRegistration: async function (props) {
    const {
      servicesManager
    } = props;
    servicesManager.registerService(ViewportService_CornerstoneViewportService.REGISTRATION);
    servicesManager.registerService(services_ToolGroupService.REGISTRATION);
    servicesManager.registerService(services_SyncGroupService.REGISTRATION);
    servicesManager.registerService(services_SegmentationService.REGISTRATION);
    servicesManager.registerService(services_CornerstoneCacheService.REGISTRATION);
    servicesManager.registerService(services_ColorbarService.REGISTRATION);
    const {
      syncGroupService
    } = servicesManager.services;
    syncGroupService.registerCustomSynchronizer('frameview', createFrameViewSynchronizer);
    await init.call(this, props);
  },
  getToolbarModule: getToolbarModule,
  getHangingProtocolModule: src_getHangingProtocolModule,
  getViewportModule({
    servicesManager,
    commandsManager
  }) {
    const ExtendedOHIFCornerstoneViewport = props => {
      const {
        toolbarService
      } = servicesManager.services;
      return /*#__PURE__*/react.createElement(OHIFCornerstoneViewport, src_extends({}, props, {
        toolbarService: toolbarService,
        servicesManager: servicesManager,
        commandsManager: commandsManager
      }));
    };
    return [{
      name: 'cornerstone',
      component: ExtendedOHIFCornerstoneViewport,
      isReferenceViewable: src_utils.isReferenceViewable.bind(null, servicesManager)
    }];
  },
  getCommandsModule: src_commandsModule,
  getCustomizationModule: src_getCustomizationModule,
  getUtilityModule({
    servicesManager
  }) {
    return [{
      name: 'common',
      exports: {
        getCornerstoneLibraries: () => {
          return {
            cornerstone: esm,
            cornerstoneTools: dist_esm
          };
        },
        getEnabledElement: state/* getEnabledElement */.kJ,
        dicomLoaderService: utils_dicomLoaderService
      }
    }, {
      name: 'core',
      exports: {
        Enums: esm.Enums
      }
    }, {
      name: 'tools',
      exports: {
        toolNames: toolNames,
        Enums: dist_esm.Enums
      }
    }, {
      name: 'volumeLoader',
      exports: {
        getDynamicVolumeInfo: esm_utilities.getDynamicVolumeInfo
      }
    }];
  },
  getSopClassHandlerModule: getSopClassHandlerModule
};


// Export constants

/* harmony default export */ const cornerstone_src = (cornerstoneExtension);

/***/ }),

/***/ 71353:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cL: () => (/* binding */ reset),
/* harmony export */   kJ: () => (/* binding */ getEnabledElement),
/* harmony export */   ye: () => (/* binding */ setEnabledElement)
/* harmony export */ });
const state = {
  // The `defaultContext` of an extension's commandsModule
  DEFAULT_CONTEXT: 'CORNERSTONE',
  enabledElements: {}
};

/**
 * Sets the enabled element `dom` reference for an active viewport.
 * @param {HTMLElement} dom Active viewport element.
 * @return void
 */
const setEnabledElement = (viewportId, element, context) => {
  const targetContext = context || state.DEFAULT_CONTEXT;
  state.enabledElements[viewportId] = {
    element,
    context: targetContext
  };
};

/**
 * Grabs the enabled element `dom` reference of an active viewport.
 *
 * @return {HTMLElement} Active viewport element.
 */
const getEnabledElement = viewportId => {
  return state.enabledElements[viewportId];
};
const reset = () => {
  state.enabledElements = {};
};


/***/ }),

/***/ 46026:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FG: () => (/* binding */ JOIN_STR),
/* harmony export */   H7: () => (/* binding */ addUniqueIndex),
/* harmony export */   gS: () => (/* binding */ DEFAULT_STR)
/* harmony export */ });
const JOIN_STR = '&';

// The default lut presentation id if none defined
const DEFAULT_STR = 'default';

// This code finds the first unique index to add to the presentation id so that
// two viewports containing the same display set in the same type of viewport
// can have different presentation information.  This allows comparison of
// a single display set in two or more viewports, when the user has simply
// dragged and dropped the view in twice.  For example, it allows displaying
// bone, brain and soft tissue views of a single display set, and to still
// remember the specific changes to each viewport.
const addUniqueIndex = (arr, key, viewports, isUpdatingSameViewport) => {
  arr.push(0);

  // If we are updating the viewport, we should not increment the index
  if (isUpdatingSameViewport) {
    return;
  }

  // The 128 is just a value that is larger than how many viewports we
  // display at once, used as an upper bound on how many unique presentation
  // ID's might exist for a single display set at once.
  for (let displayInstance = 0; displayInstance < 128; displayInstance++) {
    arr[arr.length - 1] = displayInstance;
    const testId = arr.join(JOIN_STR);
    if (!Array.from(viewports.values()).find(viewport => viewport.viewportOptions?.presentationIds?.[key] === testId)) {
      break;
    }
  }
};


/***/ }),

/***/ 10182:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   I: () => (/* binding */ useLutPresentationStore)
/* harmony export */ });
/* harmony import */ var zustand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(78713);
/* harmony import */ var zustand_middleware__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(21978);
/* harmony import */ var _presentationUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(46026);




/**
 * Identifier for the LUT Presentation store type.
 */
const PRESENTATION_TYPE_ID = 'lutPresentationId';

/**
 * Flag to enable or disable debug mode for the store.
 * Set to `true` to enable zustand devtools.
 */
const DEBUG_STORE = false;

/**
 * Represents the state and actions for managing LUT presentations.
 */

/**
 * Generates a presentation ID for LUT based on the viewport configuration.
 *
 * @param id - The ID to check.
 * @param options - Configuration options.
 * @param options.viewport - The current viewport.
 * @param options.viewports - All available viewports.
 * @param options.isUpdatingSameViewport - Indicates if the same viewport is being updated.
 * @returns The LUT presentation ID or undefined.
 */
const getLutPresentationId = (id, {
  viewport,
  viewports,
  isUpdatingSameViewport
}) => {
  if (id !== PRESENTATION_TYPE_ID) {
    return;
  }
  const getLutId = ds => {
    if (!ds || !ds.options) {
      return _presentationUtils__WEBPACK_IMPORTED_MODULE_2__/* .DEFAULT_STR */ .gS;
    }
    if (ds.options.id) {
      return ds.options.id;
    }
    const arr = Object.entries(ds.options).map(([key, val]) => `${key}=${val}`);
    if (!arr.length) {
      return _presentationUtils__WEBPACK_IMPORTED_MODULE_2__/* .DEFAULT_STR */ .gS;
    }
    return arr.join(_presentationUtils__WEBPACK_IMPORTED_MODULE_2__/* .JOIN_STR */ .FG);
  };
  if (!viewport || !viewport.viewportOptions || !viewport.displaySetInstanceUIDs?.length) {
    return;
  }
  const {
    displaySetOptions,
    displaySetInstanceUIDs
  } = viewport;
  const lutId = getLutId(displaySetOptions[0]);
  const lutPresentationArr = [lutId];
  for (const uid of displaySetInstanceUIDs) {
    lutPresentationArr.push(uid);
  }
  (0,_presentationUtils__WEBPACK_IMPORTED_MODULE_2__/* .addUniqueIndex */ .H7)(lutPresentationArr, PRESENTATION_TYPE_ID, viewports, isUpdatingSameViewport);
  return lutPresentationArr.join(_presentationUtils__WEBPACK_IMPORTED_MODULE_2__/* .JOIN_STR */ .FG);
};

/**
 * Creates the LUT Presentation store.
 *
 * @param set - The zustand set function.
 * @returns The LUT Presentation store state and actions.
 */
const createLutPresentationStore = set => ({
  type: PRESENTATION_TYPE_ID,
  lutPresentationStore: {},
  /**
   * Sets the LUT presentation for a given key.
   */
  setLutPresentation: (key, value) => set(state => ({
    lutPresentationStore: {
      ...state.lutPresentationStore,
      [key]: value
    }
  }), false, 'setLutPresentation'),
  /**
   * Clears all LUT presentations from the store.
   */
  clearLutPresentationStore: () => set({
    lutPresentationStore: {}
  }, false, 'clearLutPresentationStore'),
  /**
   * Retrieves the presentation ID based on the provided parameters.
   */
  getPresentationId: getLutPresentationId
});

/**
 * Zustand store for managing LUT presentations.
 * Applies devtools middleware when DEBUG_STORE is enabled.
 */
const useLutPresentationStore = (0,zustand__WEBPACK_IMPORTED_MODULE_0__/* .create */ .vt)()(DEBUG_STORE ? (0,zustand_middleware__WEBPACK_IMPORTED_MODULE_1__/* .devtools */ .lt)(createLutPresentationStore, {
  name: 'LutPresentationStore'
}) : createLutPresentationStore);

/***/ }),

/***/ 44646:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   q: () => (/* binding */ usePositionPresentationStore)
/* harmony export */ });
/* harmony import */ var zustand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(78713);
/* harmony import */ var zustand_middleware__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(21978);
/* harmony import */ var _presentationUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(46026);



const PRESENTATION_TYPE_ID = 'positionPresentationId';
const DEBUG_STORE = false;

/**
 * Represents the state and actions for managing position presentations.
 */

/**
 * Generates a position presentation ID based on the viewport configuration.
 *
 * @param id - The ID to check.
 * @param options - Configuration options.
 * @param options.viewport - The current viewport.
 * @param options.viewports - All available viewports.
 * @param options.isUpdatingSameViewport - Indicates if the same viewport is being updated.
 * @returns The position presentation ID or undefined.
 */
const getPresentationId = (id, {
  viewport,
  viewports,
  isUpdatingSameViewport
}) => {
  if (id !== PRESENTATION_TYPE_ID) {
    return;
  }
  if (!viewport?.viewportOptions || !viewport.displaySetInstanceUIDs?.length) {
    return;
  }
  return getPositionPresentationId(viewport, viewports, isUpdatingSameViewport);
};
function getPositionPresentationId(viewport, viewports, isUpdatingSameViewport) {
  const {
    viewportOptions = {},
    displaySetInstanceUIDs = [],
    displaySetOptions = []
  } = viewport;
  const {
    id: viewportOptionId,
    orientation
  } = viewportOptions;
  const positionPresentationArr = [orientation || 'acquisition'];
  if (viewportOptionId) {
    positionPresentationArr.push(viewportOptionId);
  }
  if (displaySetOptions?.some(ds => ds.options?.blendMode || ds.options?.displayPreset)) {
    positionPresentationArr.push(`custom`);
  }
  for (const uid of displaySetInstanceUIDs) {
    positionPresentationArr.push(uid);
  }
  if (viewports && viewports.length && isUpdatingSameViewport !== undefined) {
    (0,_presentationUtils__WEBPACK_IMPORTED_MODULE_2__/* .addUniqueIndex */ .H7)(positionPresentationArr, PRESENTATION_TYPE_ID, viewports, isUpdatingSameViewport);
  } else {
    positionPresentationArr.push(0);
  }
  return positionPresentationArr.join(_presentationUtils__WEBPACK_IMPORTED_MODULE_2__/* .JOIN_STR */ .FG);
}

/**
 * Creates the Position Presentation store.
 *
 * @param set - The zustand set function.
 * @returns The Position Presentation store state and actions.
 */
const createPositionPresentationStore = set => ({
  type: PRESENTATION_TYPE_ID,
  positionPresentationStore: {},
  /**
   * Sets the position presentation for a given key.
   */
  setPositionPresentation: (key, value) => set(state => ({
    positionPresentationStore: {
      ...state.positionPresentationStore,
      [key]: value
    }
  }), false, 'setPositionPresentation'),
  /**
   * Clears all position presentations from the store.
   */
  clearPositionPresentationStore: () => set({
    positionPresentationStore: {}
  }, false, 'clearPositionPresentationStore'),
  /**
   * Retrieves the presentation ID based on the provided parameters.
   */
  getPresentationId,
  getPositionPresentationId: getPositionPresentationId
});

/**
 * Zustand store for managing position presentations.
 * Applies devtools middleware when DEBUG_STORE is enabled.
 */
const usePositionPresentationStore = (0,zustand__WEBPACK_IMPORTED_MODULE_0__/* .create */ .vt)()(DEBUG_STORE ? (0,zustand_middleware__WEBPACK_IMPORTED_MODULE_1__/* .devtools */ .lt)(createPositionPresentationStore, {
  name: 'PositionPresentationStore'
}) : createPositionPresentationStore);

/***/ }),

/***/ 2847:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  v: () => (/* binding */ useSegmentationPresentationStore)
});

// EXTERNAL MODULE: ../../../node_modules/zustand/esm/index.mjs + 1 modules
var esm = __webpack_require__(78713);
// EXTERNAL MODULE: ../../../node_modules/zustand/esm/middleware.mjs
var middleware = __webpack_require__(21978);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/stores/presentationUtils.ts
var presentationUtils = __webpack_require__(46026);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var dist_esm = __webpack_require__(15327);
;// ../../../extensions/cornerstone/src/utils/getViewportOrientationFromImageOrientationPatient.ts

const {
  MPR_CAMERA_VALUES
} = dist_esm.CONSTANTS;

/**
 * Determines the viewport orientation (axial, sagittal, or coronal) based on the image orientation patient values.
 * This is done by comparing the view vectors with predefined MPR camera values.
 *
 * @param imageOrientationPatient - Array of 6 numbers representing the image orientation patient values.
 * The first 3 numbers represent the direction cosines of the first row and the second 3 numbers
 * represent the direction cosines of the first column.
 *
 * @returns The viewport orientation as a string ('axial', 'sagittal', 'coronal') or undefined if
 * the orientation cannot be determined or if the input is invalid.
 *
 * @example
 * ```typescript
 * const orientation = getViewportOrientationFromImageOrientationPatient([1,0,0,0,1,0]);
 * console.debug(orientation); // 'axial'
 * ```
 */
const getViewportOrientationFromImageOrientationPatient = imageOrientationPatient => {
  if (!imageOrientationPatient || imageOrientationPatient.length !== 6) {
    return undefined;
  }
  const viewRight = imageOrientationPatient.slice(0, 3);
  const viewDown = imageOrientationPatient.slice(3, 6);
  const viewUp = [-viewDown[0], -viewDown[1], -viewDown[2]];

  // Compare vectors with MPR camera values using utilities.isEqual
  if (dist_esm.utilities.isEqual(viewRight, MPR_CAMERA_VALUES.axial.viewRight) && dist_esm.utilities.isEqual(viewUp, MPR_CAMERA_VALUES.axial.viewUp)) {
    return 'axial';
  }
  if (dist_esm.utilities.isEqual(viewRight, MPR_CAMERA_VALUES.sagittal.viewRight) && dist_esm.utilities.isEqual(viewUp, MPR_CAMERA_VALUES.sagittal.viewUp)) {
    return 'sagittal';
  }
  if (dist_esm.utilities.isEqual(viewRight, MPR_CAMERA_VALUES.coronal.viewRight) && dist_esm.utilities.isEqual(viewUp, MPR_CAMERA_VALUES.coronal.viewUp)) {
    return 'coronal';
  }
  return undefined;
};
;// ../../../extensions/cornerstone/src/stores/useSegmentationPresentationStore.ts




const PRESENTATION_TYPE_ID = 'segmentationPresentationId';
const DEBUG_STORE = false;

/**
 * The keys are the presentationId.
 */

/**
 * Generates a segmentation presentation ID based on the viewport configuration.
 *
 * @param id - The ID to check.
 * @param options - Configuration options.
 * @param options.viewport - The current viewport.
 * @param options.viewports - All available viewports.
 * @param options.isUpdatingSameViewport - Indicates if the same viewport is being updated.
 * @param options.servicesManager - The services manager instance.
 * @returns The segmentation presentation ID or undefined.
 */
const getPresentationId = (id, {
  viewport,
  viewports,
  isUpdatingSameViewport,
  servicesManager
}) => {
  if (id !== PRESENTATION_TYPE_ID) {
    return;
  }
  return _getSegmentationPresentationId({
    viewport,
    servicesManager
  });
};

/**
 * Helper function to generate the segmentation presentation ID.
 *
 * @param params - Parameters for generating the segmentation presentation ID.
 * @param params.viewport - The current viewport.
 * @param params.servicesManager - The services manager instance.
 * @returns The segmentation presentation ID or undefined.
 */
const _getSegmentationPresentationId = ({
  viewport,
  servicesManager
}) => {
  if (!viewport?.viewportOptions || !viewport.displaySetInstanceUIDs?.length) {
    return;
  }
  const {
    displaySetInstanceUIDs,
    viewportOptions
  } = viewport;
  let orientation = viewportOptions.orientation;
  if (!orientation) {
    // Calculate orientation from the viewport sample image
    const displaySet = servicesManager.services.displaySetService.getDisplaySetByUID(displaySetInstanceUIDs[0]);
    const sampleImage = displaySet.images?.[0];
    const imageOrientationPatient = sampleImage?.ImageOrientationPatient;
    orientation = getViewportOrientationFromImageOrientationPatient(imageOrientationPatient);
  }
  const segmentationPresentationArr = [];
  segmentationPresentationArr.push(...displaySetInstanceUIDs);

  // Uncomment if unique indexing is needed
  // addUniqueIndex(
  //   segmentationPresentationArr,
  //   'segmentationPresentationId',
  //   viewports,
  //   isUpdatingSameViewport
  // );

  return segmentationPresentationArr.join(presentationUtils/* JOIN_STR */.FG);
};

/**
 * Creates the Segmentation Presentation store.
 *
 * @param set - The zustand set function.
 * @returns The Segmentation Presentation store state and actions.
 */
const createSegmentationPresentationStore = set => ({
  type: PRESENTATION_TYPE_ID,
  segmentationPresentationStore: {},
  /**
   * Clears all segmentation presentations from the store.
   */
  clearSegmentationPresentationStore: () => set({
    segmentationPresentationStore: {}
  }, false, 'clearSegmentationPresentationStore'),
  /**
   * Adds a new segmentation presentation item to the store.
   *
   * segmentationPresentationItem: {
   *   segmentationId: string;
   *   type: SegmentationRepresentations;
   *   hydrated: boolean | null;
   *   config?: unknown;
   * }
   */
  addSegmentationPresentationItem: (presentationId, segmentationPresentationItem) => set(state => ({
    segmentationPresentationStore: {
      ...state.segmentationPresentationStore,
      [presentationId]: [...(state.segmentationPresentationStore[presentationId] || []), segmentationPresentationItem]
    }
  }), false, 'addSegmentationPresentationItem'),
  /**
   * Sets the segmentation presentation for a given presentation ID. A segmentation
   * presentation is an array of SegmentationPresentationItem.
   *
   * segmentationPresentationItem: {
   *   segmentationId: string;
   *   type: SegmentationRepresentations;
   *   hydrated: boolean | null;
   *   config?: unknown;
   * }
   *
   * segmentationPresentation: SegmentationPresentationItem[]
   */
  setSegmentationPresentation: (presentationId, values) => set(state => ({
    segmentationPresentationStore: {
      ...state.segmentationPresentationStore,
      [presentationId]: values
    }
  }), false, 'setSegmentationPresentation'),
  /**
   * Retrieves the presentation ID based on the provided parameters.
   */
  getPresentationId,
  /**
   * Retrieves the current segmentation presentation ID.
   */
  getSegmentationPresentationId: _getSegmentationPresentationId
});

/**
 * Zustand store for managing segmentation presentations.
 * Applies devtools middleware when DEBUG_STORE is enabled.
 */
const useSegmentationPresentationStore = (0,esm/* create */.vt)()(DEBUG_STORE ? (0,middleware/* devtools */.lt)(createSegmentationPresentationStore, {
  name: 'Segmentation Presentation Store'
}) : createSegmentationPresentationStore);

/***/ }),

/***/ 68578:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   U: () => (/* binding */ useSynchronizersStore)
/* harmony export */ });
/* harmony import */ var zustand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(78713);
/* harmony import */ var zustand_middleware__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(21978);



/**
 * Identifier for the synchronizers store type.
 */
const PRESENTATION_TYPE_ID = 'synchronizersStoreId';

/**
 * Flag to enable or disable debug mode for the store.
 * Set to `true` to enable zustand devtools.
 */
const DEBUG_STORE = false;

/**
 * Information about a single synchronizer.
 */

/**
 * State shape for the Synchronizers store.
 */

/**
 * Creates the Synchronizers store.
 *
 * @param set - The zustand set function.
 * @returns The synchronizers store state and actions.
 */
const createSynchronizersStore = set => ({
  synchronizersStore: {},
  type: PRESENTATION_TYPE_ID,
  setSynchronizers: (viewportId, synchronizers) => {
    set(state => ({
      synchronizersStore: {
        ...state.synchronizersStore,
        [viewportId]: synchronizers
      }
    }), false, 'setSynchronizers');
  },
  clearSynchronizersStore: () => {
    set({
      synchronizersStore: {}
    }, false, 'clearSynchronizersStore');
  }
});

/**
 * Zustand store for managing synchronizers.
 * Applies devtools middleware when DEBUG_STORE is enabled.
 */
const useSynchronizersStore = (0,zustand__WEBPACK_IMPORTED_MODULE_0__/* .create */ .vt)()(DEBUG_STORE ? (0,zustand_middleware__WEBPACK_IMPORTED_MODULE_1__/* .devtools */ .lt)(createSynchronizersStore, {
  name: 'SynchronizersStore'
}) : createSynchronizersStore);

/***/ })

}]);