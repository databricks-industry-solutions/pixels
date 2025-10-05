"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[934,4759,5674,8402],{

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

/***/ 94285:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ test_extension_src)
});

;// CONCATENATED MODULE: ../../../extensions/test-extension/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/extension-test"}');
;// CONCATENATED MODULE: ../../../extensions/test-extension/src/id.js

const id = package_namespaceObject.UU;

;// CONCATENATED MODULE: ../../../extensions/test-extension/src/hpTestSwitch.ts
const viewport0a = {
  viewportOptions: {
    viewportId: 'viewportA',
    toolGroupId: 'default',
    allowUnmatchedView: true
  },
  displaySets: [{
    id: 'defaultDisplaySetId'
  }]
};
const viewport1b = {
  viewportOptions: {
    viewportId: 'viewportB',
    toolGroupId: 'default',
    allowUnmatchedView: true
  },
  displaySets: [{
    matchedDisplaySetsIndex: 1,
    id: 'defaultDisplaySetId'
  }]
};
const viewport2c = {
  viewportOptions: {
    viewportId: 'viewportC',
    toolGroupId: 'default',
    allowUnmatchedView: true
  },
  displaySets: [{
    matchedDisplaySetsIndex: 2,
    id: 'defaultDisplaySetId'
  }]
};
const viewport3d = {
  viewportOptions: {
    viewportId: 'viewportD',
    toolGroupId: 'default',
    allowUnmatchedView: true
  },
  displaySets: [{
    matchedDisplaySetsIndex: 3,
    id: 'defaultDisplaySetId'
  }]
};
const viewport4e = {
  viewportOptions: {
    viewportId: 'viewportE',
    toolGroupId: 'default',
    allowUnmatchedView: true
  },
  displaySets: [{
    matchedDisplaySetsIndex: 4,
    id: 'defaultDisplaySetId'
  }]
};
const viewport5f = {
  viewportOptions: {
    viewportId: 'viewportF',
    toolGroupId: 'default',
    allowUnmatchedView: true
  },
  displaySets: [{
    matchedDisplaySetsIndex: 5,
    id: 'defaultDisplaySetId'
  }]
};
const viewport3a = {
  viewportOptions: {
    viewportId: 'viewportA',
    toolGroupId: 'default',
    allowUnmatchedView: true
  },
  displaySets: [{
    matchedDisplaySetsIndex: 3,
    id: 'defaultDisplaySetId'
  }]
};
const viewport2b = {
  viewportOptions: {
    viewportId: 'viewportB',
    toolGroupId: 'default',
    allowUnmatchedView: true
  },
  displaySets: [{
    matchedDisplaySetsIndex: 2,
    id: 'defaultDisplaySetId'
  }]
};
const viewport1c = {
  viewportOptions: {
    viewportId: 'viewportC',
    toolGroupId: 'default',
    allowUnmatchedView: true
  },
  displaySets: [{
    matchedDisplaySetsIndex: 1,
    id: 'defaultDisplaySetId'
  }]
};
const viewport0d = {
  viewportOptions: {
    viewportId: 'viewportD',
    toolGroupId: 'default',
    allowUnmatchedView: true
  },
  displaySets: [{
    matchedDisplaySetsIndex: 0,
    id: 'defaultDisplaySetId'
  }]
};
const viewportStructure = {
  layoutType: 'grid',
  properties: {
    rows: 2,
    columns: 2
  }
};
const viewportStructure32 = {
  layoutType: 'grid',
  properties: {
    rows: 2,
    columns: 3
  }
};

/**
 * This hanging protocol is a test hanging protocol used to apply various
 * layouts in different positions for display, re-using earlier names in
 * various orders.
 */
const hpTestSwitch = {
  hasUpdatedPriorsInformation: false,
  id: '@ohif/mnTestSwitch',
  description: 'Has various hanging protocol grid layouts',
  name: 'Test Switch',
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
    name: '2x2 0a1b2c3d',
    viewportStructure,
    viewports: [viewport0a, viewport1b, viewport2c, viewport3d]
  }, {
    name: '3x2 0a1b4e2c3d5f',
    viewportStructure: viewportStructure32,
    // Note the following structure simply preserves the viewportId for
    // a given screen position
    viewports: [viewport0a, viewport1b, viewport4e, viewport2c, viewport3d, viewport5f]
  }, {
    name: '2x2 1c0d3a2b',
    viewportStructure,
    viewports: [viewport1c, viewport0d, viewport3a, viewport2b]
  }, {
    name: '2x2 3a2b1c0d',
    viewportStructure,
    viewports: [viewport3a, viewport2b, viewport1c, viewport0d]
  }],
  numberOfPriorsReferenced: -1
};
/* harmony default export */ const src_hpTestSwitch = (hpTestSwitch);
;// CONCATENATED MODULE: ../../../extensions/test-extension/src/custom-context-menu/codingValues.ts
/**
 * Coding values is a map of simple string coding values to a set of
 * attributes associated with the coding value.
 *
 * The simple string is in the format `<codingSchemeDesignator>:<codingValue>`
 * That allows extracting the DICOM attributes from the designator/value, and
 * allows for passing around the simple string.
 * The additional attributes contained in the object include:
 *       * text - this is the coding scheme text display value, and may be language specific
 *       * type - this defines a named type, typically 'site'.  Different names can be used
 *                to allow setting different findingSites values in order to define a hierarchy.
 *       * color - used to apply annotation color
 * It is also possible to define additional attributes here, used by custom
 * extensions.
 *
 * See https://dicom.nema.org/medical/dicom/current/output/html/part16.html
 * for definitions of SCT and other code values.
 */
/* harmony default export */ const codingValues = ({
  codingValues: {
    // Sites
    'SCT:69536005': {
      text: 'Head',
      type: 'site',
      style: {
        color: 'red'
      }
    },
    'SCT:45048000': {
      text: 'Neck',
      type: 'site',
      style: {
        color: 'blue'
      }
    },
    'SCT:818981001': {
      text: 'Abdomen',
      type: 'site',
      style: {
        color: 'orange'
      }
    },
    'SCT:816092008': {
      text: 'Pelvis',
      type: 'site',
      style: {
        color: 'cyan'
      }
    },
    // Findings
    'SCT:371861004': {
      text: 'Mild intimal coronary irregularities',
      style: {
        color: 'green'
      }
    },
    'SCT:194983005': {
      text: 'Aortic insufficiency',
      style: {
        color: 'darkred'
      }
    },
    'SCT:399232001': {
      text: '2-chamber'
    },
    'SCT:103340004': {
      text: 'SAX'
    },
    'SCT:91134007': {
      text: 'MV'
    },
    'SCT:122972007': {
      text: 'PV'
    },
    // Orientations
    'SCT:24422004': {
      text: 'Axial',
      color: '#000000',
      type: 'orientation'
    },
    'SCT:81654009': {
      text: 'Coronal',
      color: '#000000',
      type: 'orientation'
    },
    'SCT:30730003': {
      text: 'Sagittal',
      color: '#000000',
      type: 'orientation'
    }
  }
});
;// CONCATENATED MODULE: ../../../extensions/test-extension/src/custom-context-menu/contextMenuCodeItem.ts
/* harmony default export */ const contextMenuCodeItem = ({
  '@ohif/contextMenuAnnotationCode': {
    /** Applies the code value setup for this item */
    $transform: function (customizationService) {
      const {
        code: codeRef
      } = this;
      if (!codeRef) {
        throw new Error(`item ${this} has no code ref`);
      }
      const codingValues = customizationService.getCustomization('codingValues');
      const code = codingValues[codeRef];
      return {
        ...this,
        codeRef,
        code: {
          ref: codeRef,
          ...code
        },
        label: this.label || code.text || codeRef,
        commands: [{
          commandName: 'updateMeasurement'
        }]
      };
    }
  }
});
;// CONCATENATED MODULE: ../../../extensions/test-extension/src/custom-context-menu/findingsContextMenu.ts
/* harmony default export */ const findingsContextMenu = ({
  measurementsContextMenu: {
    $set: {
      inheritsFrom: 'ohif.contextMenu',
      menus: [{
        // selector restricts context menu to when there is nearbyToolData
        selector: ({
          nearbyToolData
        }) => !!nearbyToolData,
        items: [{
          label: 'Site',
          actionType: 'ShowSubMenu',
          subMenu: 'siteSelectionSubMenu'
        }, {
          label: 'Finding',
          actionType: 'ShowSubMenu',
          subMenu: 'findingSelectionSubMenu'
        }, {
          // inheritsFrom is implicit here in the configuration setup
          label: 'Delete Measurement',
          commands: [{
            commandName: 'removeMeasurement'
          }]
        }, {
          label: 'Add Label',
          commands: [{
            commandName: 'setMeasurementLabel'
          }]
        },
        // The example below shows how to include a delegating sub-menu,
        // Only available on the @ohif/mnGrid hanging protocol
        // To demonstrate, select the 3x1 layout from the protocol menu
        // and right click on a measurement.
        {
          label: 'IncludeSubMenu',
          selector: ({
            protocol
          }) => protocol?.id === '@ohif/mnGrid',
          delegating: true,
          subMenu: 'orientationSelectionSubMenu'
        }]
      }, {
        id: 'orientationSelectionSubMenu',
        selector: ({
          nearbyToolData
        }) => !!nearbyToolData,
        items: [{
          inheritsFrom: '@ohif/contextMenuAnnotationCode',
          code: 'SCT:24422004'
        }, {
          inheritsFrom: '@ohif/contextMenuAnnotationCode',
          code: 'SCT:81654009'
        }]
      }, {
        id: 'findingSelectionSubMenu',
        selector: ({
          nearbyToolData
        }) => !!nearbyToolData,
        items: [{
          inheritsFrom: '@ohif/contextMenuAnnotationCode',
          code: 'SCT:371861004'
        }, {
          inheritsFrom: '@ohif/contextMenuAnnotationCode',
          code: 'SCT:194983005'
        }]
      }, {
        id: 'siteSelectionSubMenu',
        selector: ({
          nearbyToolData
        }) => !!nearbyToolData,
        items: [{
          inheritsFrom: '@ohif/contextMenuAnnotationCode',
          code: 'SCT:69536005'
        }, {
          inheritsFrom: '@ohif/contextMenuAnnotationCode',
          code: 'SCT:45048000'
        }]
      }]
    }
  }
});
;// CONCATENATED MODULE: ../../../extensions/test-extension/src/custom-context-menu/index.ts




;// CONCATENATED MODULE: ../../../extensions/test-extension/src/getCustomizationModule.ts

function getCustomizationModule() {
  return [{
    name: 'custom-context-menu',
    value: {
      ...codingValues,
      ...contextMenuCodeItem,
      ...findingsContextMenu
    }
  }, {
    name: 'contextMenuCodeItem',
    value: {
      ...contextMenuCodeItem
    }
  }];
}
;// CONCATENATED MODULE: ../../../extensions/test-extension/src/custom-attribute/sameAs.ts
/**
 * This function extracts an attribute from the already matched display sets, and
 * compares it to the attribute in the current display set, and indicates if they match.
 * From 'this', it uses:
 *    `sameAttribute` as the attribute name to look for
 *    `sameDisplaySetId` as the display set id to look for
 * From `options`, it looks for
 */
/* harmony default export */ function sameAs(displaySet, options) {
  const {
    sameAttribute,
    sameDisplaySetId
  } = this;
  if (!sameAttribute) {
    console.log('sameAttribute not defined in', this);
    return `sameAttribute not defined in ${this.id}`;
  }
  if (!sameDisplaySetId) {
    console.log('sameDisplaySetId not defined in', this);
    return `sameDisplaySetId not defined in ${this.id}`;
  }
  const {
    displaySetMatchDetails,
    displaySets
  } = options;
  const match = displaySetMatchDetails.get(sameDisplaySetId);
  if (!match) {
    console.log('No match for display set', sameDisplaySetId);
    return false;
  }
  const {
    displaySetInstanceUID
  } = match;
  const altDisplaySet = displaySets.find(it => it.displaySetInstanceUID == displaySetInstanceUID);
  if (!altDisplaySet) {
    console.log('No display set found with', displaySetInstanceUID, 'in', displaySets);
    return false;
  }
  const testValue = altDisplaySet[sameAttribute];
  return testValue === displaySet[sameAttribute];
}
;// CONCATENATED MODULE: ../../../extensions/test-extension/src/custom-attribute/numberOfDisplaySets.ts
/* harmony default export */ const numberOfDisplaySets = ((study, extraData) => extraData?.displaySets?.length);
;// CONCATENATED MODULE: ../../../extensions/test-extension/src/custom-attribute/maxNumImageFrames.ts
/* harmony default export */ const maxNumImageFrames = ((study, extraData) => Math.max(...(extraData?.displaySets?.map?.(ds => ds.numImageFrames ?? 0) || [0])));
// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/index.tsx + 135 modules
var src = __webpack_require__(78572);
;// CONCATENATED MODULE: ../../../extensions/test-extension/src/getPanelModule.tsx


function getPanelModule({
  commandsManager,
  servicesManager,
  extensionManager
}) {
  const childProps = {
    commandsManager,
    servicesManager,
    extensionManager
  };
  const wrappedPanelMeasurementSeries = () => {
    return /*#__PURE__*/react.createElement(src.PanelMeasurement, childProps, /*#__PURE__*/react.createElement(src.StudyMeasurements, null, /*#__PURE__*/react.createElement(src.SeriesMeasurements, null)));
  };
  return [{
    name: 'panelMeasurementSeries',
    iconName: 'tool-freehand-roi',
    iconLabel: 'Measure Series',
    label: 'Measurement Series',
    component: wrappedPanelMeasurementSeries
  }];
}
;// CONCATENATED MODULE: ../../../extensions/test-extension/src/index.tsx








/**
 * The test extension provides additional behavior for testing various
 * customizations and settings for OHIF.
 */
const testExtension = {
  /**
   * Only required property. Should be a unique value across all extensions.
   */
  id: id,
  /**
   * Register additional behavior:
   *   * HP custom attribute seriesDescriptions to retrieve an array of all series descriptions
   *   * HP custom attribute numberOfDisplaySets to retrieve the number of display sets
   *   * HP custom attribute numberOfDisplaySetsWithImages to retrieve the number of display sets containing images
   *   * HP custom attribute to return a boolean true, when the attribute sameAttribute has the same
   *     value as another series description in an already matched display set selector named with the value
   *     in `sameDisplaySetId`
   */
  preRegistration: ({
    servicesManager
  }) => {
    const {
      hangingProtocolService
    } = servicesManager.services;
    hangingProtocolService.addCustomAttribute('numberOfDisplaySets', 'Number of displays sets', numberOfDisplaySets);
    hangingProtocolService.addCustomAttribute('maxNumImageFrames', 'Maximum of number of image frames', maxNumImageFrames);
    hangingProtocolService.addCustomAttribute('sameAs', 'Match an attribute in an existing display set', sameAs);
  },
  /** Registers some customizations */
  getCustomizationModule: getCustomizationModule,
  getPanelModule: getPanelModule,
  getHangingProtocolModule: () => {
    return [
    // Create a MxN hanging protocol available by default
    {
      name: src_hpTestSwitch.id,
      protocol: src_hpTestSwitch
    }];
  }
};
/* harmony default export */ const test_extension_src = (testExtension);

/***/ })

}]);