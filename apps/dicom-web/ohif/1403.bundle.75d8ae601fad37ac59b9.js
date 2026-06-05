"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[1403],{

/***/ 75183
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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


/***/ },

/***/ 94021
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
    Events["VOLUMECROPPINGCONTROL_TOOL_CHANGED"] = "CORNERSTONE_TOOLS_VOLUMECROPPINGCONTROL_TOOL_CHANGED";
    Events["VOLUMECROPPING_TOOL_CHANGED"] = "CORNERSTONE_TOOLS_VOLUMECROPPING_TOOL_CHANGED";
    Events["STACK_PREFETCH_COMPLETE"] = "CORNERSTONE_TOOLS_STACK_PREFETCH_COMPLETE";
    Events["ANNOTATION_ADDED"] = "CORNERSTONE_TOOLS_ANNOTATION_ADDED";
    Events["ANNOTATION_COMPLETED"] = "CORNERSTONE_TOOLS_ANNOTATION_COMPLETED";
    Events["ANNOTATION_MODIFIED"] = "CORNERSTONE_TOOLS_ANNOTATION_MODIFIED";
    Events["ANNOTATION_REMOVED"] = "CORNERSTONE_TOOLS_ANNOTATION_REMOVED";
    Events["ANNOTATION_SELECTION_CHANGE"] = "CORNERSTONE_TOOLS_ANNOTATION_SELECTION_CHANGE";
    Events["ANNOTATION_LOCK_CHANGE"] = "CORNERSTONE_TOOLS_ANNOTATION_LOCK_CHANGE";
    Events["ANNOTATION_VISIBILITY_CHANGE"] = "CORNERSTONE_TOOLS_ANNOTATION_VISIBILITY_CHANGE";
    Events["ANNOTATION_RENDERED"] = "CORNERSTONE_TOOLS_ANNOTATION_RENDERED";
    Events["ANNOTATION_CUT_MERGE_PROCESS_COMPLETED"] = "CORNERSTONE_TOOLS_ANNOTATION_CUT_MERGE_PROCESS_COMPLETED";
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


/***/ },

/***/ 18682
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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


/***/ },

/***/ 84093
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var StrategyCallbacks;
(function (StrategyCallbacks) {
    StrategyCallbacks["CalculateCursorGeometry"] = "calculateCursorGeometry";
    StrategyCallbacks["RenderCursor"] = "renderCursor";
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


/***/ },

/***/ 66452
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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



/***/ },

/***/ 49892
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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


/***/ },

/***/ 10401
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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



/***/ },

/***/ 29857
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  AnnotationStyleStates: () => (/* reexport */ enums_AnnotationStyleStates),
  ChangeTypes: () => (/* reexport */ ChangeTypes/* default */.A),
  Events: () => (/* reexport */ Events/* default */.A),
  KeyboardBindings: () => (/* reexport */ ToolBindings/* KeyboardBindings */.q),
  MeasurementType: () => (/* reexport */ MeasurementType),
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
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/AnnotationStyleStates.js
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
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/WorkerTypes.js
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

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/MeasurementType.js
var MeasurementType;
(function (MeasurementType) {
    MeasurementType["Linear"] = "Linear";
    MeasurementType["Area"] = "Area";
    MeasurementType["Volume"] = "Volume";
    MeasurementType["Pixel"] = "Pixel";
})(MeasurementType || (MeasurementType = {}));

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js













/***/ },

/***/ 28024
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ setShowPercentage),
/* harmony export */   w: () => (/* binding */ showPercentage)
/* harmony export */ });
// Global state to control whether to show the percentage in the overlay
let showPercentage = true;

/**
 * Sets whether to show the pleura percentage in the viewport overlay
 * @param value - Boolean indicating whether to show the percentage
 */
function setShowPercentage(value) {
  showPercentage = value;
}

/***/ },

/***/ 94507
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ usAnnotation_src)
});

// UNUSED EXPORTS: initToolGroups, toolbarButtons

// EXTERNAL MODULE: ../../../node_modules/i18next/dist/esm/i18next.js
var i18next = __webpack_require__(40680);
;// ../../../modes/usAnnotation/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/mode-ultrasound-pleura-bline"}');
;// ../../../modes/usAnnotation/src/id.js

const id = package_namespaceObject.UU;

;// ../../../modes/usAnnotation/src/initToolGroups.js
const colours = {
  'viewport-0': 'rgb(200, 0, 0)',
  'viewport-1': 'rgb(200, 200, 0)',
  'viewport-2': 'rgb(0, 200, 0)'
};
const colorsByOrientation = {
  axial: 'rgb(200, 0, 0)',
  sagittal: 'rgb(200, 200, 0)',
  coronal: 'rgb(0, 200, 0)'
};
function initDefaultToolGroup(extensionManager, toolGroupService, commandsManager, toolGroupId) {
  const utilityModule = extensionManager.getModuleEntry('@ohif/extension-cornerstone.utilityModule.tools');
  const {
    toolNames,
    Enums
  } = utilityModule.exports;
  const tools = {
    active: [{
      toolName: toolNames.UltrasoundAnnotation,
      bindings: [{
        mouseButton: Enums.MouseBindings.Primary
      }]
    }, {
      toolName: toolNames.Pan,
      bindings: [{
        mouseButton: Enums.MouseBindings.Auxiliary
      }]
    }, {
      toolName: toolNames.Zoom,
      bindings: [{
        mouseButton: Enums.MouseBindings.Secondary
      }]
    }, {
      toolName: toolNames.StackScroll,
      bindings: [{
        mouseButton: Enums.MouseBindings.Wheel
      }]
    }],
    passive: [{
      toolName: toolNames.Length
    }, {
      toolName: toolNames.ArrowAnnotate,
      configuration: {
        getTextCallback: (callback, eventDetails) => {
          commandsManager.runCommand('arrowTextCallback', {
            callback,
            eventDetails
          });
        },
        changeTextCallback: (data, eventDetails, callback) => {
          commandsManager.runCommand('arrowTextCallback', {
            callback,
            data,
            eventDetails
          });
        }
      }
    }, {
      toolName: toolNames.SegmentBidirectional
    }, {
      toolName: toolNames.Bidirectional
    }, {
      toolName: toolNames.DragProbe
    }, {
      toolName: toolNames.Probe
    }, {
      toolName: toolNames.EllipticalROI
    }, {
      toolName: toolNames.CircleROI
    }, {
      toolName: toolNames.RectangleROI
    }, {
      toolName: toolNames.StackScroll
    }, {
      toolName: toolNames.Angle
    }, {
      toolName: toolNames.CobbAngle
    }, {
      toolName: toolNames.Magnify
    }, {
      toolName: toolNames.CalibrationLine
    }, {
      toolName: toolNames.PlanarFreehandContourSegmentation,
      configuration: {
        displayOnePointAsCrosshairs: true
      }
    }, {
      toolName: toolNames.UltrasoundDirectional
    }, {
      toolName: toolNames.WindowLevel
    }, {
      toolName: toolNames.PlanarFreehandROI
    }, {
      toolName: toolNames.SplineROI
    }, {
      toolName: toolNames.LivewireContour
    }, {
      toolName: toolNames.WindowLevelRegion
    }],
    enabled: [{
      toolName: toolNames.ImageOverlayViewer
    }, {
      toolName: toolNames.ReferenceLines
    }],
    disabled: [{
      toolName: toolNames.AdvancedMagnify
    }]
  };
  toolGroupService.createToolGroupAndAddTools(toolGroupId, tools);
}
function initSRToolGroup(extensionManager, toolGroupService) {
  const SRUtilityModule = extensionManager.getModuleEntry('@ohif/extension-cornerstone-dicom-sr.utilityModule.tools');
  if (!SRUtilityModule) {
    return;
  }
  const CS3DUtilityModule = extensionManager.getModuleEntry('@ohif/extension-cornerstone.utilityModule.tools');
  const {
    toolNames: SRToolNames
  } = SRUtilityModule.exports;
  const {
    toolNames,
    Enums
  } = CS3DUtilityModule.exports;
  const tools = {
    active: [{
      toolName: toolNames.WindowLevel,
      bindings: [{
        mouseButton: Enums.MouseBindings.Primary
      }]
    }, {
      toolName: toolNames.Pan,
      bindings: [{
        mouseButton: Enums.MouseBindings.Auxiliary
      }]
    }, {
      toolName: toolNames.Zoom,
      bindings: [{
        mouseButton: Enums.MouseBindings.Secondary
      }]
    }, {
      toolName: toolNames.StackScroll,
      bindings: [{
        mouseButton: Enums.MouseBindings.Wheel
      }]
    }],
    passive: [{
      toolName: SRToolNames.SRLength
    }, {
      toolName: SRToolNames.SRArrowAnnotate
    }, {
      toolName: SRToolNames.SRBidirectional
    }, {
      toolName: SRToolNames.SREllipticalROI
    }, {
      toolName: SRToolNames.SRCircleROI
    }, {
      toolName: SRToolNames.SRPlanarFreehandROI
    }, {
      toolName: SRToolNames.SRRectangleROI
    }, {
      toolName: toolNames.WindowLevelRegion
    }],
    enabled: [{
      toolName: SRToolNames.DICOMSRDisplay
    }]
    // disabled
  };
  const toolGroupId = 'SRToolGroup';
  toolGroupService.createToolGroupAndAddTools(toolGroupId, tools);
}
function initMPRToolGroup(extensionManager, toolGroupService, commandsManager) {
  const utilityModule = extensionManager.getModuleEntry('@ohif/extension-cornerstone.utilityModule.tools');
  const serviceManager = extensionManager._servicesManager;
  const {
    cornerstoneViewportService
  } = serviceManager.services;
  const {
    toolNames,
    Enums
  } = utilityModule.exports;
  const tools = {
    active: [{
      toolName: toolNames.WindowLevel,
      bindings: [{
        mouseButton: Enums.MouseBindings.Primary
      }]
    }, {
      toolName: toolNames.Pan,
      bindings: [{
        mouseButton: Enums.MouseBindings.Auxiliary
      }]
    }, {
      toolName: toolNames.Zoom,
      bindings: [{
        mouseButton: Enums.MouseBindings.Secondary
      }]
    }, {
      toolName: toolNames.StackScroll,
      bindings: [{
        mouseButton: Enums.MouseBindings.Wheel
      }]
    }],
    passive: [{
      toolName: toolNames.Length
    }, {
      toolName: toolNames.ArrowAnnotate,
      configuration: {
        getTextCallback: (callback, eventDetails) => {
          commandsManager.runCommand('arrowTextCallback', {
            callback,
            eventDetails
          });
        },
        changeTextCallback: (data, eventDetails, callback) => {
          commandsManager.runCommand('arrowTextCallback', {
            callback,
            data,
            eventDetails
          });
        }
      }
    }, {
      toolName: toolNames.Bidirectional
    }, {
      toolName: toolNames.DragProbe
    }, {
      toolName: toolNames.Probe
    }, {
      toolName: toolNames.EllipticalROI
    }, {
      toolName: toolNames.CircleROI
    }, {
      toolName: toolNames.RectangleROI
    }, {
      toolName: toolNames.StackScroll
    }, {
      toolName: toolNames.Angle
    }, {
      toolName: toolNames.CobbAngle
    }, {
      toolName: toolNames.PlanarFreehandROI
    }, {
      toolName: toolNames.SplineROI
    }, {
      toolName: toolNames.LivewireContour
    }, {
      toolName: toolNames.WindowLevelRegion
    }, {
      toolName: toolNames.PlanarFreehandContourSegmentation,
      configuration: {
        displayOnePointAsCrosshairs: true
      }
    }],
    disabled: [{
      toolName: toolNames.Crosshairs,
      configuration: {
        viewportIndicators: true,
        viewportIndicatorsConfig: {
          circleRadius: 5,
          xOffset: 0.95,
          yOffset: 0.05
        },
        disableOnPassive: true,
        autoPan: {
          enabled: false,
          panSize: 10
        },
        getReferenceLineColor: viewportId => {
          const viewportInfo = cornerstoneViewportService.getViewportInfo(viewportId);
          const viewportOptions = viewportInfo?.viewportOptions;
          if (viewportOptions) {
            return colours[viewportOptions.id] || colorsByOrientation[viewportOptions.orientation] || '#0c0';
          } else {
            console.warn('missing viewport?', viewportId);
            return '#0c0';
          }
        }
      }
    }, {
      toolName: toolNames.AdvancedMagnify
    }, {
      toolName: toolNames.ReferenceLines
    }]
  };
  toolGroupService.createToolGroupAndAddTools('mpr', tools);
}
function initVolume3DToolGroup(extensionManager, toolGroupService) {
  const utilityModule = extensionManager.getModuleEntry('@ohif/extension-cornerstone.utilityModule.tools');
  const {
    toolNames,
    Enums
  } = utilityModule.exports;
  const tools = {
    active: [{
      toolName: toolNames.TrackballRotateTool,
      bindings: [{
        mouseButton: Enums.MouseBindings.Primary
      }]
    }, {
      toolName: toolNames.Zoom,
      bindings: [{
        mouseButton: Enums.MouseBindings.Secondary
      }]
    }, {
      toolName: toolNames.Pan,
      bindings: [{
        mouseButton: Enums.MouseBindings.Auxiliary
      }]
    }]
  };
  toolGroupService.createToolGroupAndAddTools('volume3d', tools);
}
function initToolGroups(extensionManager, toolGroupService, commandsManager) {
  initDefaultToolGroup(extensionManager, toolGroupService, commandsManager, 'default');
  initSRToolGroup(extensionManager, toolGroupService);
  initMPRToolGroup(extensionManager, toolGroupService, commandsManager);
  initVolume3DToolGroup(extensionManager, toolGroupService);
}
/* harmony default export */ const src_initToolGroups = (initToolGroups);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
// EXTERNAL MODULE: ../../core/src/index.ts + 69 modules
var src = __webpack_require__(42356);
;// ../../../modes/usAnnotation/src/toolbarButtons.ts



const callbacks = toolName => [{
  commandName: 'setViewportForToolConfiguration',
  commandOptions: {
    toolName
  }
}];
const setToolActiveToolbar = {
  commandName: 'setToolActiveToolbar',
  commandOptions: {
    toolGroupIds: ['default', 'mpr', 'SRToolGroup', 'volume3d']
  }
};
const toolbarButtons = [
// sections
{
  id: 'MeasurementTools',
  uiType: 'ohif.toolButtonList',
  props: {
    buttonSection: 'measurementSection'
  }
}, {
  id: 'MoreTools',
  uiType: 'ohif.toolButtonList',
  props: {
    buttonSection: 'moreToolsSection'
  }
}, {
  id: 'AdvancedRenderingControls',
  uiType: 'ohif.advancedRenderingControls',
  props: {
    buttonSection: 'advancedRenderingControlsSection'
  }
},
// tool defs
{
  id: 'modalityLoadBadge',
  uiType: 'ohif.modalityLoadBadge',
  props: {
    icon: 'Status',
    label: i18next/* default */.A.t('Buttons:Status'),
    tooltip: i18next/* default */.A.t('Buttons:Status'),
    evaluate: {
      name: 'evaluate.modalityLoadBadge',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'navigationComponent',
  uiType: 'ohif.navigationComponent',
  props: {
    icon: 'Navigation',
    label: i18next/* default */.A.t('Buttons:Navigation'),
    tooltip: i18next/* default */.A.t('Buttons:Navigate between segments/measurements and manage their visibility'),
    evaluate: {
      name: 'evaluate.navigationComponent',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'trackingStatus',
  uiType: 'ohif.trackingStatus',
  props: {
    icon: 'TrackingStatus',
    label: i18next/* default */.A.t('Buttons:Tracking Status'),
    tooltip: i18next/* default */.A.t('Buttons:View and manage tracking status of measurements and annotations'),
    evaluate: {
      name: 'evaluate.trackingStatus',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'dataOverlayMenu',
  uiType: 'ohif.dataOverlayMenu',
  props: {
    icon: 'ViewportViews',
    label: i18next/* default */.A.t('Buttons:Data Overlay'),
    tooltip: i18next/* default */.A.t('Buttons:Configure data overlay options and manage foreground/background display sets'),
    evaluate: 'evaluate.dataOverlayMenu'
  }
}, {
  id: 'orientationMenu',
  uiType: 'ohif.orientationMenu',
  props: {
    icon: 'OrientationSwitch',
    label: i18next/* default */.A.t('Buttons:Orientation'),
    tooltip: i18next/* default */.A.t('Buttons:Change viewport orientation between axial, sagittal, coronal and reformat planes'),
    evaluate: {
      name: 'evaluate.orientationMenu'
      // hideWhenDisabled: true,
    }
  }
}, {
  id: 'windowLevelMenuEmbedded',
  uiType: 'ohif.windowLevelMenuEmbedded',
  props: {
    icon: 'WindowLevel',
    label: i18next/* default */.A.t('Buttons:Window Level'),
    tooltip: i18next/* default */.A.t('Buttons:Adjust window/level presets and customize image contrast settings'),
    evaluate: {
      name: 'evaluate.windowLevelMenuEmbedded',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'windowLevelMenu',
  uiType: 'ohif.windowLevelMenu',
  props: {
    icon: 'WindowLevel',
    label: i18next/* default */.A.t('Buttons:Window Level'),
    tooltip: i18next/* default */.A.t('Buttons:Adjust window/level presets and customize image contrast settings'),
    evaluate: {
      name: 'evaluate.windowLevelMenu'
    }
  }
}, {
  id: 'voiManualControlMenu',
  uiType: 'ohif.voiManualControlMenu',
  props: {
    icon: 'WindowLevelAdvanced',
    label: i18next/* default */.A.t('Buttons:Advanced Window Level'),
    tooltip: i18next/* default */.A.t('Buttons:Advanced window/level settings with manual controls and presets'),
    evaluate: 'evaluate.voiManualControlMenu'
  }
}, {
  id: 'thresholdMenu',
  uiType: 'ohif.thresholdMenu',
  props: {
    icon: 'Threshold',
    label: i18next/* default */.A.t('Buttons:Threshold'),
    tooltip: i18next/* default */.A.t('Buttons:Image threshold settings'),
    evaluate: {
      name: 'evaluate.thresholdMenu',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'opacityMenu',
  uiType: 'ohif.opacityMenu',
  props: {
    icon: 'Opacity',
    label: i18next/* default */.A.t('Buttons:Opacity'),
    tooltip: i18next/* default */.A.t('Buttons:Image opacity settings'),
    evaluate: {
      name: 'evaluate.opacityMenu',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'Colorbar',
  uiType: 'ohif.colorbar',
  props: {
    type: 'tool',
    label: i18next/* default */.A.t('Buttons:Colorbar')
  }
}, {
  id: 'Reset',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-reset',
    label: i18next/* default */.A.t('Buttons:Reset View'),
    tooltip: i18next/* default */.A.t('Buttons:Reset View'),
    commands: 'resetViewport',
    evaluate: 'evaluate.action'
  }
}, {
  id: 'rotate-right',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-rotate-right',
    label: i18next/* default */.A.t('Buttons:Rotate Right'),
    tooltip: i18next/* default */.A.t('Buttons:Rotate +90'),
    commands: 'rotateViewportCW',
    evaluate: ['evaluate.action', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video']
    }]
  }
}, {
  id: 'flipHorizontal',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-flip-horizontal',
    label: i18next/* default */.A.t('Buttons:Flip Horizontal'),
    tooltip: i18next/* default */.A.t('Buttons:Flip Horizontally'),
    commands: 'flipViewportHorizontal',
    evaluate: ['evaluate.viewportProperties.toggle', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video', 'volume3d']
    }]
  }
}, {
  id: 'ImageSliceSync',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'link',
    label: i18next/* default */.A.t('Buttons:Image Slice Sync'),
    tooltip: i18next/* default */.A.t('Buttons:Enable position synchronization on stack viewports'),
    commands: {
      commandName: 'toggleSynchronizer',
      commandOptions: {
        type: 'imageSlice'
      }
    },
    listeners: {
      [esm.EVENTS.VIEWPORT_NEW_IMAGE_SET]: {
        commandName: 'toggleImageSliceSync',
        commandOptions: {
          toggledState: true
        }
      }
    },
    evaluate: ['evaluate.cornerstone.synchronizer', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video', 'volume3d']
    }]
  }
}, {
  id: 'ReferenceLines',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-referenceLines',
    label: i18next/* default */.A.t('Buttons:Reference Lines'),
    tooltip: i18next/* default */.A.t('Buttons:Show Reference Lines'),
    commands: 'toggleEnabledDisabledToolbar',
    listeners: {
      [src.ViewportGridService.EVENTS.ACTIVE_VIEWPORT_ID_CHANGED]: callbacks('ReferenceLines'),
      [src.ViewportGridService.EVENTS.VIEWPORTS_READY]: callbacks('ReferenceLines')
    },
    evaluate: ['evaluate.cornerstoneTool.toggle', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video']
    }]
  }
}, {
  id: 'ImageOverlayViewer',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'toggle-dicom-overlay',
    label: i18next/* default */.A.t('Buttons:Image Overlay'),
    tooltip: i18next/* default */.A.t('Buttons:Toggle Image Overlay'),
    commands: 'toggleEnabledDisabledToolbar',
    evaluate: ['evaluate.cornerstoneTool.toggle', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video']
    }]
  }
}, {
  id: 'StackScroll',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-stack-scroll',
    label: i18next/* default */.A.t('Buttons:Stack Scroll'),
    tooltip: i18next/* default */.A.t('Buttons:Stack Scroll'),
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'invert',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-invert',
    label: i18next/* default */.A.t('Buttons:Invert'),
    tooltip: i18next/* default */.A.t('Buttons:Invert Colors'),
    commands: 'invertViewport',
    evaluate: ['evaluate.viewportProperties.toggle', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video']
    }]
  }
}, {
  id: 'Probe',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-probe',
    label: i18next/* default */.A.t('Buttons:Probe'),
    tooltip: i18next/* default */.A.t('Buttons:Probe'),
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'Cine',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-cine',
    label: i18next/* default */.A.t('Buttons:Cine'),
    tooltip: i18next/* default */.A.t('Buttons:Cine'),
    commands: 'toggleCine',
    evaluate: ['evaluate.cine', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['volume3d']
    }]
  }
}, {
  id: 'Angle',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-angle',
    label: i18next/* default */.A.t('Buttons:Angle'),
    tooltip: i18next/* default */.A.t('Buttons:Angle'),
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'CobbAngle',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'icon-tool-cobb-angle',
    label: i18next/* default */.A.t('Buttons:Cobb Angle'),
    tooltip: i18next/* default */.A.t('Buttons:Cobb Angle'),
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'Magnify',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-magnify',
    label: i18next/* default */.A.t('Buttons:Zoom-in'),
    tooltip: i18next/* default */.A.t('Buttons:Zoom-in'),
    commands: setToolActiveToolbar,
    evaluate: ['evaluate.cornerstoneTool', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video']
    }]
  }
}, {
  id: 'CalibrationLine',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-calibration',
    label: i18next/* default */.A.t('Buttons:Calibration'),
    tooltip: i18next/* default */.A.t('Buttons:Calibration Line'),
    commands: setToolActiveToolbar,
    evaluate: ['evaluate.cornerstoneTool', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video']
    }]
  }
}, {
  id: 'TagBrowser',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'dicom-tag-browser',
    label: i18next/* default */.A.t('Buttons:Dicom Tag Browser'),
    tooltip: i18next/* default */.A.t('Buttons:Dicom Tag Browser'),
    commands: 'openDICOMTagViewer'
  }
}, {
  id: 'AdvancedMagnify',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'icon-tool-loupe',
    label: i18next/* default */.A.t('Buttons:Magnify Probe'),
    tooltip: i18next/* default */.A.t('Buttons:Magnify Probe'),
    commands: 'toggleActiveDisabledToolbar',
    evaluate: ['evaluate.cornerstoneTool.toggle.ifStrictlyDisabled', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video']
    }]
  }
}, {
  id: 'UltrasoundDirectionalTool',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'icon-tool-ultrasound-bidirectional',
    label: i18next/* default */.A.t('Buttons:Ultrasound Directional'),
    tooltip: i18next/* default */.A.t('Buttons:Ultrasound Directional'),
    commands: setToolActiveToolbar,
    evaluate: ['evaluate.cornerstoneTool', {
      name: 'evaluate.modality.supported',
      supportedModalities: ['US']
    }]
  }
}, {
  id: 'UltrasoundPleuraBLineTool',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'icon-tool-ultrasound-bidirectional',
    label: i18next/* default */.A.t('Buttons:US Pleura B-line Annotation'),
    tooltip: i18next/* default */.A.t('Buttons:US Pleura B-line Annotation'),
    commands: setToolActiveToolbar,
    evaluate: ['evaluate.cornerstoneTool', {
      name: 'evaluate.modality.supported',
      supportedModalities: ['US']
    }]
  }
}, {
  id: 'WindowLevelRegion',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'icon-tool-window-region',
    label: i18next/* default */.A.t('Buttons:Window Level Region'),
    tooltip: i18next/* default */.A.t('Buttons:Window Level Region'),
    commands: setToolActiveToolbar,
    evaluate: ['evaluate.cornerstoneTool', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video']
    }]
  }
}, {
  id: 'Length',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-length',
    label: i18next/* default */.A.t('Buttons:Length'),
    tooltip: i18next/* default */.A.t('Buttons:Length Tool'),
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'Bidirectional',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-bidirectional',
    label: i18next/* default */.A.t('Buttons:Bidirectional'),
    tooltip: i18next/* default */.A.t('Buttons:Bidirectional Tool'),
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'ArrowAnnotate',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-annotate',
    label: i18next/* default */.A.t('Buttons:Annotation'),
    tooltip: i18next/* default */.A.t('Buttons:Arrow Annotate'),
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'EllipticalROI',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-ellipse',
    label: i18next/* default */.A.t('Buttons:Ellipse'),
    tooltip: i18next/* default */.A.t('Buttons:Ellipse ROI'),
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'RectangleROI',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-rectangle',
    label: i18next/* default */.A.t('Buttons:Rectangle'),
    tooltip: i18next/* default */.A.t('Buttons:Rectangle ROI'),
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'CircleROI',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-circle',
    label: i18next/* default */.A.t('Buttons:Circle'),
    tooltip: i18next/* default */.A.t('Buttons:Circle Tool'),
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'PlanarFreehandROI',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'icon-tool-freehand-roi',
    label: i18next/* default */.A.t('Buttons:Freehand ROI'),
    tooltip: i18next/* default */.A.t('Buttons:Freehand ROI'),
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'SplineROI',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'icon-tool-spline-roi',
    label: i18next/* default */.A.t('Buttons:Spline ROI'),
    tooltip: i18next/* default */.A.t('Buttons:Spline ROI'),
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'LivewireContour',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'icon-tool-livewire',
    label: i18next/* default */.A.t('Buttons:Livewire tool'),
    tooltip: i18next/* default */.A.t('Buttons:Livewire tool'),
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
},
// Window Level
{
  id: 'WindowLevel',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-window-level',
    label: i18next/* default */.A.t('Buttons:Window Level'),
    commands: setToolActiveToolbar,
    evaluate: ['evaluate.cornerstoneTool', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['wholeSlide']
    }]
  }
}, {
  id: 'Pan',
  uiType: 'ohif.toolButton',
  props: {
    type: 'tool',
    icon: 'tool-move',
    label: i18next/* default */.A.t('Buttons:Pan'),
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'Zoom',
  uiType: 'ohif.toolButton',
  props: {
    type: 'tool',
    icon: 'tool-zoom',
    label: i18next/* default */.A.t('Buttons:Zoom'),
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'TrackballRotate',
  uiType: 'ohif.toolButton',
  props: {
    type: 'tool',
    icon: 'tool-3d-rotate',
    label: i18next/* default */.A.t('Buttons:3D Rotate'),
    commands: setToolActiveToolbar,
    evaluate: {
      name: 'evaluate.cornerstoneTool',
      disabledText: i18next/* default */.A.t('Buttons:Select a 3D viewport to enable this tool')
    }
  }
}, {
  id: 'Capture',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-capture',
    label: i18next/* default */.A.t('Buttons:Capture'),
    commands: 'showDownloadViewportModal',
    evaluate: ['evaluate.action', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video', 'wholeSlide']
    }]
  }
}, {
  id: 'Layout',
  uiType: 'ohif.layoutSelector',
  props: {
    rows: 3,
    columns: 4,
    evaluate: 'evaluate.action'
  }
}, {
  id: 'Crosshairs',
  uiType: 'ohif.toolButton',
  props: {
    type: 'tool',
    icon: 'tool-crosshair',
    label: i18next/* default */.A.t('Buttons:Crosshairs'),
    commands: {
      commandName: 'setToolActiveToolbar',
      commandOptions: {
        toolGroupIds: ['mpr']
      }
    },
    evaluate: {
      name: 'evaluate.cornerstoneTool',
      disabledText: i18next/* default */.A.t('Buttons:Select an MPR viewport to enable this tool')
    }
  }
}
// {
//   id: 'Undo',
//   uiType: 'ohif.toolButton',
//   props: {
//     type: 'tool',
//     icon: 'prev-arrow',
//     label: 'Undo',
//     commands: {
//       commandName: 'undo',
//     },
//     evaluate: 'evaluate.action',
//   },
// },
// {
//   id: 'Redo',
//   uiType: 'ohif.toolButton',
//   props: {
//     type: 'tool',
//     icon: 'next-arrow',
//     label: 'Redo',
//     commands: {
//       commandName: 'redo',
//     },
//     evaluate: 'evaluate.action',
//   },
// },
];
/* harmony default export */ const src_toolbarButtons = (toolbarButtons);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/index.js
var dist_esm = __webpack_require__(4667);
// EXTERNAL MODULE: ../../../extensions/usAnnotation/src/PleuraBlinePercentage.ts
var PleuraBlinePercentage = __webpack_require__(28024);
;// ../../../modes/usAnnotation/src/index.ts






const ohif = {
  layout: '@ohif/extension-default.layoutTemplateModule.viewerLayout',
  sopClassHandler: '@ohif/extension-default.sopClassHandlerModule.stack',
  thumbnailList: '@ohif/extension-default.panelModule.seriesList',
  wsiSopClassHandler: '@ohif/extension-cornerstone.sopClassHandlerModule.DicomMicroscopySopClassHandler'
};
const cornerstone = {
  measurements: '@ohif/extension-cornerstone.panelModule.panelMeasurement',
  segmentation: '@ohif/extension-cornerstone.panelModule.panelSegmentation'
};
const tracked = {
  measurements: '@ohif/extension-measurement-tracking.panelModule.trackedMeasurements',
  thumbnailList: '@ohif/extension-measurement-tracking.panelModule.seriesList',
  viewport: '@ohif/extension-measurement-tracking.viewportModule.cornerstone-tracked'
};
const dicomsr = {
  sopClassHandler: '@ohif/extension-cornerstone-dicom-sr.sopClassHandlerModule.dicom-sr',
  sopClassHandler3D: '@ohif/extension-cornerstone-dicom-sr.sopClassHandlerModule.dicom-sr-3d',
  viewport: '@ohif/extension-cornerstone-dicom-sr.viewportModule.dicom-sr'
};
const dicomvideo = {
  sopClassHandler: '@ohif/extension-dicom-video.sopClassHandlerModule.dicom-video',
  viewport: '@ohif/extension-dicom-video.viewportModule.dicom-video'
};
const dicompdf = {
  sopClassHandler: '@ohif/extension-dicom-pdf.sopClassHandlerModule.dicom-pdf',
  viewport: '@ohif/extension-dicom-pdf.viewportModule.dicom-pdf'
};
const dicomSeg = {
  sopClassHandler: '@ohif/extension-cornerstone-dicom-seg.sopClassHandlerModule.dicom-seg',
  viewport: '@ohif/extension-cornerstone-dicom-seg.viewportModule.dicom-seg'
};
const dicomPmap = {
  sopClassHandler: '@ohif/extension-cornerstone-dicom-pmap.sopClassHandlerModule.dicom-pmap',
  viewport: '@ohif/extension-cornerstone-dicom-pmap.viewportModule.dicom-pmap'
};
const dicomRT = {
  viewport: '@ohif/extension-cornerstone-dicom-rt.viewportModule.dicom-rt',
  sopClassHandler: '@ohif/extension-cornerstone-dicom-rt.sopClassHandlerModule.dicom-rt'
};
const usAnnotation = {
  panel: '@ohif/extension-ultrasound-pleura-bline.panelModule.USAnnotationPanel'
};
let settingsSaved = {};
const extensionDependencies = {
  // Can derive the versions at least process.env.from npm_package_version
  '@ohif/extension-default': '^3.0.0',
  '@ohif/extension-cornerstone': '^3.0.0',
  '@ohif/extension-measurement-tracking': '^3.0.0',
  '@ohif/extension-cornerstone-dicom-sr': '^3.0.0',
  '@ohif/extension-cornerstone-dicom-seg': '^3.0.0',
  '@ohif/extension-cornerstone-dicom-pmap': '^3.0.0',
  '@ohif/extension-cornerstone-dicom-rt': '^3.0.0',
  '@ohif/extension-dicom-pdf': '^3.0.1',
  '@ohif/extension-dicom-video': '^3.0.1',
  '@ohif/extension-ultrasound-pleura-bline': '^3.0.0'
};
function modeFactory({
  modeConfiguration
}) {
  let _activatePanelTriggersSubscriptions = [];
  return {
    // TODO: We're using this as a route segment
    // We should not be.
    id: id,
    routeName: 'usAnnotation',
    displayName: i18next/* default */.A.t('US Pleura B-line Annotations'),
    /**
     * Lifecycle hooks
     */
    onModeEnter: function ({
      servicesManager,
      extensionManager,
      commandsManager,
      appConfig
    }) {
      settingsSaved = {
        disableConfirmationPrompts: appConfig?.disableConfirmationPrompts,
        measurementTrackingMode: appConfig?.measurementTrackingMode
      };
      appConfig.disableConfirmationPrompts = true;
      appConfig.measurementTrackingMode = 'simplified';
      const {
        measurementService,
        toolbarService,
        toolGroupService,
        customizationService
      } = servicesManager.services;
      measurementService.clearMeasurements();

      // Init Default and SR ToolGroups
      src_initToolGroups(extensionManager, toolGroupService, commandsManager);
      toolbarService.register(src_toolbarButtons);
      toolbarService.updateSection(toolbarService.sections.primary, ['MeasurementTools', 'Zoom', 'Pan', 'TrackballRotate', 'WindowLevel', 'Capture', 'Layout', 'Crosshairs', 'MoreTools']);
      toolbarService.updateSection(toolbarService.sections.viewportActionMenu.topLeft, ['orientationMenu', 'dataOverlayMenu']);
      toolbarService.updateSection(toolbarService.sections.viewportActionMenu.bottomMiddle, ['AdvancedRenderingControls']);
      toolbarService.updateSection(toolbarService.sections.advancedRenderingControlsSection, ['windowLevelMenuEmbedded', 'voiManualControlMenu', 'Colorbar', 'opacityMenu', 'thresholdMenu']);
      toolbarService.updateSection(toolbarService.sections.viewportActionMenu.topRight, ['modalityLoadBadge', 'trackingStatus', 'navigationComponent']);
      toolbarService.updateSection(toolbarService.sections.viewportActionMenu.bottomLeft, ['windowLevelMenu']);
      toolbarService.updateSection(toolbarService.sections.measurementSection, ['Length', 'Bidirectional', 'ArrowAnnotate', 'EllipticalROI', 'RectangleROI', 'CircleROI', 'PlanarFreehandROI', 'SplineROI', 'LivewireContour']);
      toolbarService.updateSection(toolbarService.sections.moreToolsSection, ['Reset', 'rotate-right', 'flipHorizontal', 'ImageSliceSync', 'ReferenceLines', 'ImageOverlayViewer', 'StackScroll', 'invert', 'Probe', 'Cine', 'Angle', 'CobbAngle', 'Magnify', 'CalibrationLine', 'TagBrowser', 'AdvancedMagnify', 'UltrasoundDirectionalTool', 'UltrasoundPleuraBLineTool', 'WindowLevelRegion']);
      customizationService.setCustomizations({
        'panelSegmentation.disableEditing': {
          $set: true
        },
        autoCineModalities: {
          $set: []
        },
        'ohif.hotkeyBindings': {
          $push: [{
            commandName: 'switchUSAnnotationToPleuraLine',
            label: 'Add new pleura line',
            keys: ['W']
          }, {
            commandName: 'switchUSAnnotationToBLine',
            label: 'Add new B-line',
            keys: ['S']
          }, {
            commandName: 'deleteLastPleuraAnnotation',
            label: 'Delete last pleura line',
            keys: ['E']
          }, {
            commandName: 'deleteLastBLineAnnotation',
            label: 'Delete last B-line',
            keys: ['D']
          }, {
            commandName: 'toggleDisplayFanAnnotation',
            label: 'Toggle overlay',
            keys: ['O']
          }]
        },
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
              label: 'Delete annotation',
              commands: 'removeMeasurement'
            }]
          }]
        },
        'viewportOverlay.topLeft': [{
          id: 'BLinePleuraPercentage',
          inheritsFrom: 'ohif.overlayItem',
          label: '',
          title: 'BLinePleuraPercentage',
          condition: ({
            referenceInstance
          }) => referenceInstance?.Modality.includes('US') && PleuraBlinePercentage/* showPercentage */.w,
          contentF: () => {
            const {
              viewportGridService,
              toolGroupService,
              cornerstoneViewportService
            } = servicesManager.services;
            const activeViewportId = viewportGridService.getActiveViewportId();
            const toolGroup = toolGroupService.getToolGroupForViewport(activeViewportId);
            if (!toolGroup) {
              return 'B-Line/Pleura : N/A';
            }
            const usAnnotation = toolGroup.getToolInstance(dist_esm.UltrasoundPleuraBLineTool.toolName);
            if (usAnnotation) {
              const viewport = cornerstoneViewportService.getCornerstoneViewport(activeViewportId);
              const percentage = usAnnotation.calculateBLinePleuraPercentage(viewport);
              if (percentage !== undefined) {
                return `B-Line/Pleura : ${percentage.toFixed(2)} %`;
              } else {
                return 'B-Line/Pleura : N/A';
              }
            }
            return 'B-Line/Pleura : N/A';
          }
        }]
      }, 'mode');
    },
    onModeExit: ({
      servicesManager
    }) => {
      appConfig.disableConfirmationPrompts = settingsSaved.disableConfirmationPrompts;
      appConfig.measurementTrackingMode = settingsSaved.measurementTrackingMode;
      const {
        toolGroupService,
        syncGroupService,
        segmentationService,
        cornerstoneViewportService,
        uiDialogService,
        uiModalService
      } = servicesManager.services;
      _activatePanelTriggersSubscriptions.forEach(sub => sub.unsubscribe());
      _activatePanelTriggersSubscriptions = [];
      uiDialogService.hideAll();
      uiModalService.hide();
      toolGroupService.destroy();
      syncGroupService.destroy();
      segmentationService.destroy();
      cornerstoneViewportService.destroy();
    },
    validationTags: {
      study: [],
      series: []
    },
    isValidMode: function ({
      modalities
    }) {
      const modalities_list = modalities.split('\\');
      return {
        valid: modalities_list.includes('US'),
        description: 'Pleura b-lines annotation mode when the study involves US modality series'
      };
    },
    routes: [{
      path: 'longitudinal',
      /*init: ({ servicesManager, extensionManager }) => {
        //defaultViewerRouteInit
      },*/
      layoutTemplate: () => {
        return {
          id: ohif.layout,
          props: {
            leftPanels: [tracked.thumbnailList],
            leftPanelResizable: true,
            rightPanels: [usAnnotation.panel, cornerstone.segmentation, tracked.measurements],
            rightPanelResizable: true,
            viewports: [{
              namespace: tracked.viewport,
              displaySetsToDisplay: [ohif.sopClassHandler, dicomvideo.sopClassHandler, dicomsr.sopClassHandler3D, ohif.wsiSopClassHandler]
            }, {
              namespace: dicomsr.viewport,
              displaySetsToDisplay: [dicomsr.sopClassHandler]
            }, {
              namespace: dicompdf.viewport,
              displaySetsToDisplay: [dicompdf.sopClassHandler]
            }, {
              namespace: dicomSeg.viewport,
              displaySetsToDisplay: [dicomSeg.sopClassHandler]
            }, {
              namespace: dicomPmap.viewport,
              displaySetsToDisplay: [dicomPmap.sopClassHandler]
            }, {
              namespace: dicomRT.viewport,
              displaySetsToDisplay: [dicomRT.sopClassHandler]
            }]
          }
        };
      }
    }],
    extensions: extensionDependencies,
    // Default protocol gets self-registered by default in the init
    hangingProtocol: 'default',
    // Order is important in sop class handlers when two handlers both use
    // the same sop class under different situations.  In that case, the more
    // general handler needs to come last.  For this case, the dicomvideo must
    // come first to remove video transfer syntax before ohif uses images
    sopClassHandlers: [dicomvideo.sopClassHandler, dicomSeg.sopClassHandler, dicomPmap.sopClassHandler, ohif.sopClassHandler, ohif.wsiSopClassHandler, dicompdf.sopClassHandler, dicomsr.sopClassHandler3D, dicomsr.sopClassHandler, dicomRT.sopClassHandler],
    ...modeConfiguration
  };
}
const mode = {
  id: id,
  modeFactory,
  extensionDependencies
};
/* harmony default export */ const usAnnotation_src = (mode);


/***/ }

}]);