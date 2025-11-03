"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[6027],{

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

/***/ 84867:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ src)
});

;// CONCATENATED MODULE: ../../../../../../../plugins/ohifv3/extensions/image-redactor/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/extension-image-redactor"}');
;// CONCATENATED MODULE: ../../../../../../../plugins/ohifv3/extensions/image-redactor/src/id.js
/*
OHIF Image Redactor Extension Copyright (2025) Databricks, Inc.
Author: Emanuele Rinaldi <emanuele.rinaldi@databricks.com>

This library (the "Software") may not be used except in connection with the Licensee's use of the Databricks Platform Services pursuant to an Agreement (defined below) between Licensee (defined below) and Databricks, Inc. ("Databricks"). The Object Code version of the Software shall be deemed part of the Downloadable Services under the Agreement, or if the Agreement does not define Downloadable Services, Subscription Services, or if neither are defined then the term in such Agreement that refers to the applicable Databricks Platform Services (as defined below) shall be substituted herein for "Downloadable Services." Licensee's use of the Software must comply at all times with any restrictions applicable to the Downlodable Services and Subscription Services, generally, and must be used in accordance with any applicable documentation. For the avoidance of doubt, the Software constitutes Databricks Confidential Information under the Agreement. Additionally, and notwithstanding anything in the Agreement to the contrary:
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
* you may view, make limited copies of, and may compile the Source Code version of the Software into an Object Code version of the Software. For the avoidance of doubt, you may not make derivative works of Software (or make any any changes to the Source Code version of the unless you have agreed to separate terms with Databricks permitting such modifications (e.g., a contribution license agreement)).
If you have not agreed to an Agreement or otherwise do not agree to these terms, you may not use the Software or view, copy or compile the Source Code of the Software. This license terminates automatically upon the termination of the Agreement or Licensee's breach of these terms. Additionally, Databricks may terminate this license at any time on notice. Upon termination, you must permanently delete the Software and all copies thereof (including the Source Code).
*/


const id = package_namespaceObject.UU;

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/index.js
var dist_esm = __webpack_require__(4667);
;// CONCATENATED MODULE: ../../../../../../../plugins/ohifv3/extensions/image-redactor/src/tools/RedactionRectangleTool.ts
/*
OHIF Image Redactor Extension Copyright (2025) Databricks, Inc.
Author: Emanuele Rinaldi <emanuele.rinaldi@databricks.com>

This library (the "Software") may not be used except in connection with the Licensee's use of the Databricks Platform Services pursuant to an Agreement (defined below) between Licensee (defined below) and Databricks, Inc. ("Databricks"). The Object Code version of the Software shall be deemed part of the Downloadable Services under the Agreement, or if the Agreement does not define Downloadable Services, Subscription Services, or if neither are defined then the term in such Agreement that refers to the applicable Databricks Platform Services (as defined below) shall be substituted herein for "Downloadable Services." Licensee's use of the Software must comply at all times with any restrictions applicable to the Downlodable Services and Subscription Services, generally, and must be used in accordance with any applicable documentation. For the avoidance of doubt, the Software constitutes Databricks Confidential Information under the Agreement. Additionally, and notwithstanding anything in the Agreement to the contrary:
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
* you may view, make limited copies of, and may compile the Source Code version of the Software into an Object Code version of the Software. For the avoidance of doubt, you may not make derivative works of Software (or make any any changes to the Source Code version of the unless you have agreed to separate terms with Databricks permitting such modifications (e.g., a contribution license agreement)).
If you have not agreed to an Agreement or otherwise do not agree to these terms, you may not use the Software or view, copy or compile the Source Code of the Software. This license terminates automatically upon the termination of the Agreement or Licensee's breach of these terms. Additionally, Databricks may terminate this license at any time on notice. Upon termination, you must permanently delete the Software and all copies thereof (including the Source Code).
*/


const {
  getAnnotations
} = dist_esm.annotation.state;

/**
 * RedactionRectangleTool - A custom tool for marking areas to be redacted
 * Extends RectangleROITool with custom styling for redaction visualization
 */
class RedactionRectangleTool extends dist_esm.RectangleROITool {
  constructor(toolProps = {}, defaultToolProps = {
    supportedInteractionTypes: ['Mouse', 'Touch'],
    configuration: {
      shadow: true,
      preventHandleOutsideImage: false,
      getTextLines: (data, targetId) => {
        return [];
      }
    }
  }) {
    super(toolProps, defaultToolProps);
  }

  /**
   * Override getStyle to apply red color when highlighted
   */
  getStyle(property, specs, annotation) {
    // Check if this annotation is highlighted
    const isHighlighted = annotation?.metadata?.highlighted;
    if (isHighlighted && property === 'color') {
      return 'rgb(255, 0, 0)'; // Red when highlighted
    }
    if (isHighlighted && property === 'lineWidth') {
      return 3; // Thicker when highlighted
    }

    // Fall back to parent implementation
    return super.getStyle(property, specs, annotation);
  }

  /**
   * Get the coordinates of all redaction rectangles in world coordinates
   */
  static getRedactionAreas(element) {
    const annotations = getAnnotations(RedactionRectangleTool.toolName, element);
    if (!annotations?.length) {
      return [];
    }
    return annotations.map(annotation => {
      const {
        points
      } = annotation.data.handles;

      // RectangleROI stores 4 corner points
      // Extract all X, Y, Z coordinates to find the bounding box
      const allX = points.map(p => p[0]);
      const allY = points.map(p => p[1]);
      const z = points[0][2]; // All points have the same Z coordinate

      // Calculate actual top-left and bottom-right from all corner points
      const topLeft = [Math.min(...allX), Math.min(...allY), z];
      const bottomRight = [Math.max(...allX), Math.max(...allY), z];
      return {
        annotationUID: annotation.annotationUID,
        topLeft: topLeft,
        bottomRight: bottomRight,
        worldCoordinates: points
      };
    });
  }

  /**
   * Convert world coordinates to image pixel coordinates
   */
  static worldToPixelCoordinates(worldCoords, viewport) {
    return worldCoords.map(coord => {
      const canvasCoord = viewport.worldToCanvas(coord);
      // Canvas coordinates are already in pixel space for 2D viewports
      // Just return the canvas coordinates as pixel coordinates
      return [Math.round(canvasCoord[0]), Math.round(canvasCoord[1])];
    });
  }

  /**
   * Clear all redaction areas
   */
  static clearAllRedactionAreas(element) {
    const annotationManager = dist_esm.annotation.state.getAnnotationManager();
    let annotations = getAnnotations(RedactionRectangleTool.toolName, element);
    if (annotations?.length) {
      // Create a copy of the array to avoid modification during iteration
      const annotationsCopy = [...annotations];

      // Remove all annotations
      annotationsCopy.forEach(ann => {
        try {
          annotationManager.removeAnnotation(ann.annotationUID);
        } catch (error) {
          console.error('Error removing annotation:', error);
        }
      });

      // Force re-render
      element.dispatchEvent(new CustomEvent('annotationsCleared'));
    }
  }

  /**
   * Delete a single redaction area by annotation UID
   */
  static deleteRedactionArea(annotationUID, element) {
    const annotationManager = dist_esm.annotation.state.getAnnotationManager();
    annotationManager.removeAnnotation(annotationUID);

    // Trigger re-render
    element.dispatchEvent(new CustomEvent('annotationRemoved', {
      detail: {
        annotationUID
      }
    }));
  }

  /**
   * Highlight a specific redaction area by setting metadata flag
   * The getStyle() method will read this flag and apply red color
   */
  static highlightRedactionArea(annotationUID, element, highlight = true) {
    const annotations = getAnnotations(RedactionRectangleTool.toolName, element);
    const targetAnnotation = annotations?.find(ann => ann.annotationUID === annotationUID);
    if (targetAnnotation) {
      // Store highlight state in metadata
      // The getStyle() method will read this and apply red color
      if (!targetAnnotation.metadata) {
        targetAnnotation.metadata = {
          toolName: RedactionRectangleTool.toolName
        };
      }
      targetAnnotation.metadata.highlighted = highlight;
    }
  }
}
RedactionRectangleTool.toolName = 'RedactionRectangle';
;// CONCATENATED MODULE: ../../../../../../../plugins/ohifv3/extensions/image-redactor/src/models/RedactionArea.js
/*
OHIF Image Redactor Extension Copyright (2025) Databricks, Inc.
Author: Emanuele Rinaldi <emanuele.rinaldi@databricks.com>

This library (the "Software") may not be used except in connection with the Licensee's use of the Databricks Platform Services pursuant to an Agreement (defined below) between Licensee (defined below) and Databricks, Inc. ("Databricks"). The Object Code version of the Software shall be deemed part of the Downloadable Services under the Agreement, or if the Agreement does not define Downloadable Services, Subscription Services, or if neither are defined then the term in such Agreement that refers to the applicable Databricks Platform Services (as defined below) shall be substituted herein for "Downloadable Services." Licensee's use of the Software must comply at all times with any restrictions applicable to the Downlodable Services and Subscription Services, generally, and must be used in accordance with any applicable documentation. For the avoidance of doubt, the Software constitutes Databricks Confidential Information under the Agreement. Additionally, and notwithstanding anything in the Agreement to the contrary:
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
* you may view, make limited copies of, and may compile the Source Code version of the Software into an Object Code version of the Software. For the avoidance of doubt, you may not make derivative works of Software (or make any any changes to the Source Code version of the unless you have agreed to separate terms with Databricks permitting such modifications (e.g., a contribution license agreement)).
If you have not agreed to an Agreement or otherwise do not agree to these terms, you may not use the Software or view, copy or compile the Source Code of the Software. This license terminates automatically upon the termination of the Agreement or Licensee's breach of these terms. Additionally, Databricks may terminate this license at any time on notice. Upon termination, you must permanently delete the Software and all copies thereof (including the Source Code).
*/



/**
 * RedactionArea - Represents a single redaction area with all its metadata
 * Fully self-contained with DICOM metadata and coordinate information
 */
class RedactionArea {
  constructor(annotationData, viewport, frameIndex = 0, isGlobal = false) {
    // Annotation data
    this.annotationUID = annotationData.annotationUID;
    this.topLeft = annotationData.topLeft;
    this.bottomRight = annotationData.bottomRight;
    this.worldCoordinates = annotationData.worldCoordinates;
    this.cornerstoneAnnotation = annotationData;

    // Frame information
    this.frameIndex = isGlobal ? null : frameIndex;
    this.isGlobal = isGlobal;

    // Extract DICOM metadata
    this.extractDICOMMetadata(viewport);

    // Timestamp
    this.timestamp = new Date().toISOString();
  }

  /**
   * Extract Databricks Volume path from imageId
   * Format: .../Volumes/{catalog}/{schema}/{volume}/{file_path}
   * Returns: /Volumes/{catalog}/{schema}/{volume}/{file_path}
   */
  extractVolumePath(imageId) {
    if (!imageId) return null;
    try {
      // Remove protocol prefix (dicomweb:, wadouri:, multiframe:, etc.)
      let cleanUrl = imageId;
      if (imageId.includes(':')) {
        cleanUrl = imageId.split(':').slice(1).join(':');
      }

      // For multiframe, remove frame parameter
      if (cleanUrl.includes('&frame=')) {
        cleanUrl = cleanUrl.split('&frame=')[0];
      }

      // Decode URL encoding
      cleanUrl = decodeURIComponent(cleanUrl);

      // Extract everything from /Volumes/ onwards
      const volumesIndex = cleanUrl.indexOf('/Volumes/');
      if (volumesIndex !== -1) {
        return cleanUrl.substring(volumesIndex);
      }
      return null;
    } catch (error) {
      console.error('Error extracting volume path:', error);
      return null;
    }
  }

  /**
   * Extract DICOM metadata from viewport
   */
  extractDICOMMetadata(viewport) {
    const imageId = viewport.getCurrentImageId();
    const image = esm.cache.getImage(imageId);

    // Extract imageId components
    this.imageId = imageId;
    this.fileName = 'unknown.dcm';
    this.filePath = null;
    if (imageId.startsWith('multiframe:')) {
      const parts = imageId.substring('multiframe:'.length).split('&frame=');
      const dicomUrl = parts[0];
      this.fileName = dicomUrl.split('/').pop().split('?')[0];
    } else if (imageId.startsWith('dicomweb:')) {
      const dicomUrl = imageId.substring('dicomweb:'.length);
      this.fileName = dicomUrl.split('/').pop().split('?')[0];
    } else if (imageId.startsWith('wadouri:')) {
      const dicomUrl = imageId.substring('wadouri:'.length);
      this.fileName = dicomUrl.split('/').pop().split('?')[0];
    }

    // Extract Databricks Volume path
    this.filePath = this.extractVolumePath(imageId);

    // Get DICOM metadata from cache
    const generalSeriesModule = esm.metaData.get('generalSeriesModule', imageId) || {};
    const sopCommonModule = esm.metaData.get('sopCommonModule', imageId) || {};
    const imagePixelModule = esm.metaData.get('imagePixelModule', imageId) || {};

    // Store DICOM identifiers
    this.studyInstanceUID = generalSeriesModule.studyInstanceUID || 'unknown';
    this.seriesInstanceUID = generalSeriesModule.seriesInstanceUID || 'unknown';
    this.sopInstanceUID = sopCommonModule.sopInstanceUID || 'unknown';
    this.sopClassUID = sopCommonModule.sopClassUID || 'unknown';
    this.modality = generalSeriesModule.modality || 'unknown';

    // Image dimensions
    this.rows = image?.height || image?.rows || imagePixelModule.rows || 0;
    this.columns = image?.width || image?.columns || imagePixelModule.columns || 0;
    this.numberOfFrames = esm.metaData.get('NumberOfFrames', imageId) || 1;
  }

  /**
   * Update coordinates from a new annotation (when user resizes/moves)
   */
  updateCoordinates(annotationData) {
    this.topLeft = annotationData.topLeft;
    this.bottomRight = annotationData.bottomRight;
    this.worldCoordinates = annotationData.worldCoordinates;
    this.cornerstoneAnnotation = annotationData;
    this.timestamp = new Date().toISOString(); // Update timestamp
  }

  /**
   * Check if coordinates have changed compared to another annotation
   */
  hasCoordinatesChanged(annotationData) {
    return this.topLeft[0] !== annotationData.topLeft[0] || this.topLeft[1] !== annotationData.topLeft[1] || this.topLeft[2] !== annotationData.topLeft[2] || this.bottomRight[0] !== annotationData.bottomRight[0] || this.bottomRight[1] !== annotationData.bottomRight[1] || this.bottomRight[2] !== annotationData.bottomRight[2];
  }

  /**
   * Get the Cornerstone annotation object for rendering
   */
  getCornerstoneAnnotation() {
    return this.cornerstoneAnnotation;
  }

  /**
   * Check if this area belongs to a specific frame
   */
  belongsToFrame(frameIndex) {
    if (this.isGlobal) return true;
    return this.frameIndex === frameIndex;
  }

  /**
   * Get a display label for this area
   */
  getDisplayLabel() {
    if (this.isGlobal) {
      return `Global - ${this.fileName}`;
    }
    return `Frame ${this.frameIndex + 1} - ${this.fileName}`;
  }

  /**
   * Get a short identifier for display
   */
  getShortUID() {
    return this.annotationUID.substring(0, 8);
  }

  /**
   * Export to JSON format with full metadata
   */
  toJSON() {
    return {
      annotationUID: this.annotationUID,
      imageId: this.imageId,
      fileName: this.fileName,
      filePath: this.filePath,
      studyInstanceUID: this.studyInstanceUID,
      seriesInstanceUID: this.seriesInstanceUID,
      sopInstanceUID: this.sopInstanceUID,
      sopClassUID: this.sopClassUID,
      modality: this.modality,
      frameIndex: this.frameIndex,
      numberOfFrames: this.numberOfFrames,
      rows: this.rows,
      columns: this.columns,
      isGlobal: this.isGlobal,
      topLeft: this.topLeft,
      bottomRight: this.bottomRight,
      worldCoordinates: this.worldCoordinates,
      timestamp: this.timestamp
    };
  }
}

/**
 * RedactionAreaManager - Manages all redaction areas across frames
 */
class RedactionAreaManager {
  constructor() {
    this.areas = new Map(); // Map<annotationUID, RedactionArea>
    this.frameIndex = new Map(); // Map<frameIndex, Set<annotationUID>>
    this.globalAreas = new Set(); // Set<annotationUID> for global areas
  }

  /**
   * Add a new redaction area
   */
  addArea(annotationData, viewport, frameIndex, isGlobal = false) {
    const area = new RedactionArea(annotationData, viewport, frameIndex, isGlobal);
    this.areas.set(area.annotationUID, area);
    if (isGlobal) {
      this.globalAreas.add(area.annotationUID);
    } else {
      if (!this.frameIndex.has(frameIndex)) {
        this.frameIndex.set(frameIndex, new Set());
      }
      this.frameIndex.get(frameIndex).add(area.annotationUID);
    }
    return area;
  }

  /**
   * Get a redaction area by its UID
   */
  getAreaByUID(annotationUID) {
    return this.areas.get(annotationUID);
  }

  /**
   * Update an existing redaction area's coordinates
   */
  updateArea(annotationUID, annotationData) {
    const area = this.areas.get(annotationUID);
    if (area) {
      area.updateCoordinates(annotationData);
      return true;
    }
    return false;
  }

  /**
   * Check if an area exists and if its coordinates have changed
   */
  hasAreaChanged(annotationUID, annotationData) {
    const area = this.areas.get(annotationUID);
    if (!area) return false;
    return area.hasCoordinatesChanged(annotationData);
  }

  /**
   * Remove a redaction area
   */
  removeArea(annotationUID) {
    const area = this.areas.get(annotationUID);
    if (!area) return false;
    this.areas.delete(annotationUID);
    if (area.isGlobal) {
      this.globalAreas.delete(annotationUID);
    } else if (area.frameIndex !== null) {
      const frameSet = this.frameIndex.get(area.frameIndex);
      if (frameSet) {
        frameSet.delete(annotationUID);
        if (frameSet.size === 0) {
          this.frameIndex.delete(area.frameIndex);
        }
      }
    }
    return true;
  }

  /**
   * Get all areas for a specific frame
   */
  getAreasForFrame(frameIndex) {
    const areas = [];

    // Add global areas
    for (const uid of this.globalAreas) {
      const area = this.areas.get(uid);
      if (area) areas.push(area);
    }

    // Add frame-specific areas
    const frameSet = this.frameIndex.get(frameIndex);
    if (frameSet) {
      for (const uid of frameSet) {
        const area = this.areas.get(uid);
        if (area) areas.push(area);
      }
    }
    return areas;
  }

  /**
   * Get all areas across all frames
   */
  getAllAreas() {
    return Array.from(this.areas.values());
  }

  /**
   * Get all frames that have redaction areas
   */
  getFramesWithAreas() {
    return Array.from(this.frameIndex.keys()).sort((a, b) => a - b);
  }

  /**
   * Clear all areas
   */
  clearAll() {
    this.areas.clear();
    this.frameIndex.clear();
    this.globalAreas.clear();
  }

  /**
   * Clear areas for a specific frame
   */
  clearFrame(frameIndex) {
    const frameSet = this.frameIndex.get(frameIndex);
    if (frameSet) {
      for (const uid of frameSet) {
        this.areas.delete(uid);
      }
      this.frameIndex.delete(frameIndex);
    }
  }

  /**
   * Clear global areas
   */
  clearGlobal() {
    for (const uid of this.globalAreas) {
      this.areas.delete(uid);
    }
    this.globalAreas.clear();
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      totalAreas: this.areas.size,
      globalAreas: this.globalAreas.size,
      framesWithAreas: this.frameIndex.size,
      framesList: this.getFramesWithAreas()
    };
  }

  /**
   * Export all areas to JSON
   */
  exportToJSON() {
    return {
      globalAreas: Array.from(this.globalAreas).map(uid => {
        const area = this.areas.get(uid);
        return area ? area.toJSON() : null;
      }).filter(a => a !== null),
      frameSpecificAreas: Array.from(this.frameIndex.entries()).map(([frameIdx, uids]) => ({
        frameIndex: frameIdx,
        areas: Array.from(uids).map(uid => {
          const area = this.areas.get(uid);
          return area ? area.toJSON() : null;
        }).filter(a => a !== null)
      }))
    };
  }
}
;// CONCATENATED MODULE: ../../../../../../../plugins/ohifv3/extensions/image-redactor/src/services/RedactionService.js
/*
OHIF Image Redactor Extension Copyright (2025) Databricks, Inc.
Author: Emanuele Rinaldi <emanuele.rinaldi@databricks.com>

This library (the "Software") may not be used except in connection with the Licensee's use of the Databricks Platform Services pursuant to an Agreement (defined below) between Licensee (defined below) and Databricks, Inc. ("Databricks"). The Object Code version of the Software shall be deemed part of the Downloadable Services under the Agreement, or if the Agreement does not define Downloadable Services, Subscription Services, or if neither are defined then the term in such Agreement that refers to the applicable Databricks Platform Services (as defined below) shall be substituted herein for "Downloadable Services." Licensee's use of the Software must comply at all times with any restrictions applicable to the Downlodable Services and Subscription Services, generally, and must be used in accordance with any applicable documentation. For the avoidance of doubt, the Software constitutes Databricks Confidential Information under the Agreement. Additionally, and notwithstanding anything in the Agreement to the contrary:
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
* you may view, make limited copies of, and may compile the Source Code version of the Software into an Object Code version of the Software. For the avoidance of doubt, you may not make derivative works of Software (or make any any changes to the Source Code version of the unless you have agreed to separate terms with Databricks permitting such modifications (e.g., a contribution license agreement)).
If you have not agreed to an Agreement or otherwise do not agree to these terms, you may not use the Software or view, copy or compile the Source Code of the Software. This license terminates automatically upon the termination of the Agreement or Licensee's breach of these terms. Additionally, Databricks may terminate this license at any time on notice. Upon termination, you must permanently delete the Software and all copies thereof (including the Source Code).
*/





const {
  ViewportType
} = esm.Enums;
class RedactionService {
  constructor() {
    this.areaManager = new RedactionAreaManager(); // Centralized area management
    this.viewportManagers = new Map(); // Map<viewportId, RedactionAreaManager>
    this.frameSpecificAreas = new Map(); // Map<viewportId, Map<frameIndex, Array<RedactionArea>>>
    this.globalRedactionAreas = []; // Array<RedactionArea>
  }

  /**
   * Get or create area manager for a viewport
   */
  getAreaManager(viewportId) {
    if (!this.viewportManagers.has(viewportId)) {
      this.viewportManagers.set(viewportId, new RedactionAreaManager());
    }
    return this.viewportManagers.get(viewportId);
  }

  /**
   * Get all frame-specific redaction areas across all frames
   * @param {string} viewportId - The viewport ID
   * @returns {Array} All redaction areas from all frames
   */
  getAllFrameSpecificAreas(viewportId) {
    const manager = this.getAreaManager(viewportId);
    return manager.getAllAreas().map(area => ({
      annotationUID: area.annotationUID,
      topLeft: area.topLeft,
      bottomRight: area.bottomRight,
      worldCoordinates: area.worldCoordinates,
      frameIndex: area.frameIndex,
      isGlobal: area.isGlobal
    }));
  }

  /**
   * Check if a specific frame has stored redaction areas
   * @param {string} viewportId - The viewport ID
   * @param {number} frameIndex - The frame index to check
   * @returns {boolean} True if frame has stored areas
   */
  hasFrameAreas(viewportId, frameIndex) {
    const manager = this.getAreaManager(viewportId);
    return manager.getAreasForFrame(frameIndex).length > 0;
  }

  /**
   * Get stored redaction areas for a specific frame
   * @param {string} viewportId - The viewport ID
   * @param {number} frameIndex - The frame index
   * @returns {Array} Stored areas for the frame
   */
  getStoredFrameAreas(viewportId, frameIndex) {
    const manager = this.getAreaManager(viewportId);
    return manager.getAreasForFrame(frameIndex).map(area => ({
      annotationUID: area.annotationUID,
      topLeft: area.topLeft,
      bottomRight: area.bottomRight,
      worldCoordinates: area.worldCoordinates,
      frameIndex: area.frameIndex,
      isGlobal: area.isGlobal
    }));
  }

  /**
   * Store specific redaction areas for a frame (without reading from element)
   * @param {string} viewportId - The viewport ID
   * @param {object} viewport - The viewport object
   * @param {Array} areas - The areas to store
   * @param {number} frameIndex - The frame index
   * @param {boolean} isGlobal - Whether areas should be global
   */
  storeSpecificAreas(viewportId, viewport, areas, frameIndex, isGlobal = false) {
    const manager = this.getAreaManager(viewportId);
    areas.forEach(annotationData => {
      manager.addArea(annotationData, viewport, frameIndex, isGlobal);
    });
    const stats = manager.getStats();
    console.log(`Stored ${areas.length} areas for frame ${frameIndex}. Total areas: ${stats.totalAreas}, Frames: ${stats.framesWithAreas}`);
    return areas;
  }

  /**
   * Update redaction areas for a specific frame
   * Checks each annotation and updates only if coordinates changed
   * @param {string} viewportId - The viewport ID
   * @param {object} viewport - The viewport object
   * @param {Array} areas - The current areas from viewport
   * @param {number} frameIndex - The frame index
   * @param {boolean} isGlobal - Whether areas should be global
   */
  updateFrameAreas(viewportId, viewport, areas, frameIndex, isGlobal = false) {
    const manager = this.getAreaManager(viewportId);
    let updatedCount = 0;
    areas.forEach(annotationData => {
      if (manager.hasAreaChanged(annotationData.annotationUID, annotationData)) {
        manager.updateArea(annotationData.annotationUID, annotationData);
        updatedCount++;
      }
    });
    console.log(`Updated ${updatedCount} modified area(s) for frame ${frameIndex}`);
    return areas;
  }

  /**
   * Get redaction areas from element and sync global annotations
   * @param {string} viewportId - The viewport ID
   * @param {HTMLElement} element - The viewport element
   * @param {object} viewport - The viewport object
   * @param {number} frameIndex - The current frame index
   * @param {boolean} includeGlobal - Whether to include and sync global areas
   * @returns {Array} All redaction areas (current frame + global if enabled)
   */
  getRedactionAreas(viewportId, element, viewport, frameIndex, includeGlobal = false) {
    // First, sync global annotations if needed
    if (includeGlobal && viewport) {
      this.syncGlobalAnnotationsToFrame(viewportId, element, viewport);
    }

    // Get all annotations from the element
    return RedactionRectangleTool.getRedactionAreas(element);
  }

  /**
   * Sync global redaction annotations to the current frame
   * Updates the z-coordinate of global annotations to match current frame
   * @param {string} viewportId - The viewport ID
   * @param {HTMLElement} element - The viewport element
   * @param {object} viewport - The viewport object
   */
  syncGlobalAnnotationsToFrame(viewportId, element, viewport) {
    const manager = this.getAreaManager(viewportId);

    // Get all global areas
    const globalAreas = manager.getAllAreas().filter(area => area.isGlobal);
    if (globalAreas.length === 0) {
      return;
    }

    // Get current imageId and calculate the z-index for this frame
    const currentImageId = viewport.getCurrentImageId ? viewport.getCurrentImageId() : '';
    const imageData = viewport.getImageData();
    if (!imageData) {
      return;
    }

    // Get the z-coordinate for the current slice/frame
    // Use the image's indexToWorld to get the current frame's z position
    const indexToWorld = imageData.imageData?.indexToWorld;
    if (!indexToWorld) {
      console.warn('Could not get indexToWorld transform');
      return;
    }

    // Get center of the current slice in world coordinates to extract z
    const centerIndex = [Math.floor(imageData.dimensions[0] / 2), Math.floor(imageData.dimensions[1] / 2), 0 // Current slice is always at index 0 in the viewport
    ];
    const centerWorld = indexToWorld(centerIndex);
    const currentZ = centerWorld[2];

    // Get all annotations from the element
    const annotations = RedactionRectangleTool.getRedactionAreas(element);
    if (!annotations || annotations.length === 0) {
      return;
    }

    // Get the full annotation objects from Cornerstone state
    // @ts-ignore - Element type is compatible at runtime
    const fullAnnotations = dist_esm.annotation.state.getAnnotations(RedactionRectangleTool.toolName, element);
    if (!fullAnnotations || fullAnnotations.length === 0) {
      return;
    }

    // Update z-coordinates of global annotations
    let updatedCount = 0;
    globalAreas.forEach(area => {
      // Find the annotation in the viewport
      const annotation = fullAnnotations.find(a => a.annotationUID === area.annotationUID);
      if (annotation && annotation.data?.handles?.points) {
        // Update the z-coordinate of all points to match current frame
        const points = annotation.data.handles.points;
        let needsUpdate = false;
        points.forEach((point, index) => {
          if (point[2] !== currentZ) {
            points[index] = [point[0], point[1], currentZ];
            needsUpdate = true;
          }
        });
        if (needsUpdate) {
          // Update the referenced imageId
          if (annotation.metadata) {
            annotation.metadata.referencedImageId = currentImageId;
          }

          // Mark as invalidated so it re-renders
          annotation.invalidated = true;
          updatedCount++;
        }
      }
    });
    if (updatedCount > 0) {
      console.log(`Updated z-coordinates for ${updatedCount} global annotation(s) to z=${currentZ.toFixed(3)}`);

      // Trigger render to show the updated annotations
      if (viewport.getRenderingEngine) {
        const renderingEngine = viewport.getRenderingEngine();
        if (renderingEngine) {
          renderingEngine.render();
        }
      }
    }
  }

  /**
   * Toggle a redaction area between global and frame-specific
   * @param {string} viewportId - The viewport ID
   * @param {string} annotationUID - The annotation UID to toggle
   * @param {HTMLElement} element - The viewport element
   * @param {object} viewport - The viewport object
   * @returns {boolean} - True if toggled successfully
   */
  toggleRedactionGlobal(viewportId, annotationUID, element, viewport) {
    const manager = this.getAreaManager(viewportId);
    const area = manager.getAreaByUID(annotationUID);
    if (!area) {
      console.warn(`Area with UID ${annotationUID} not found`);
      return false;
    }
    const previouslyGlobal = area.isGlobal;
    const frameIndex = area.frameIndex;

    // Toggle the isGlobal flag
    area.isGlobal = !area.isGlobal;

    // Update the manager's internal tracking
    if (area.isGlobal) {
      // Changing from frame-specific to global
      area.frameIndex = null;
      manager.globalAreas.add(annotationUID);

      // Remove from frame index
      if (frameIndex !== null && manager.frameIndex.has(frameIndex)) {
        manager.frameIndex.get(frameIndex).delete(annotationUID);
      }
      console.log(`Redaction ${annotationUID} is now global (applies to all frames)`);

      // Sync to all frames
      if (viewport && element) {
        this.syncGlobalAnnotationsToFrame(viewportId, element, viewport);
      }
    } else {
      // Changing from global to frame-specific
      // Set to current frame
      const currentFrameIndex = viewport && typeof viewport.getCurrentImageIdIndex === 'function' ? viewport.getCurrentImageIdIndex() : 0;
      area.frameIndex = currentFrameIndex;
      manager.globalAreas.delete(annotationUID);

      // Add to frame index
      if (!manager.frameIndex.has(currentFrameIndex)) {
        manager.frameIndex.set(currentFrameIndex, new Set());
      }
      manager.frameIndex.get(currentFrameIndex).add(annotationUID);
      console.log(`Redaction ${annotationUID} is now frame-specific (Frame ${currentFrameIndex + 1})`);
    }

    // Trigger re-render
    if (viewport && viewport.getRenderingEngine) {
      const renderingEngine = viewport.getRenderingEngine();
      if (renderingEngine) {
        renderingEngine.render();
      }
    }
    return true;
  }

  /**
   * Get the frame index for a specific annotation UID
   * @param {string} annotationUID - The annotation UID
   * @param {string} viewportId - The viewport ID
   * @returns {number|null} The frame index or null if not found
   */
  getFrameForAnnotation(viewportId, annotationUID) {
    const manager = this.getAreaManager(viewportId);
    const area = manager.areas.get(annotationUID);
    return area ? area.frameIndex : null;
  }

  /**
   * Convert world coordinates to pixel coordinates for redaction
   */
  worldToPixelBounds(worldCoords, viewport) {
    const pixelCoords = RedactionRectangleTool.worldToPixelCoordinates(worldCoords, viewport);
    const [topLeft, bottomRight] = pixelCoords;
    return {
      minX: Math.min(topLeft[0], bottomRight[0]),
      maxX: Math.max(topLeft[0], bottomRight[0]),
      minY: Math.min(topLeft[1], bottomRight[1]),
      maxY: Math.max(topLeft[1], bottomRight[1])
    };
  }

  /**
   * Apply redaction to image pixels (burn pixels to black)
   */
  async applyRedaction(redaction_metadata, serverHostname) {
    console.log('Applying redaction to image pixels');
    const endpoint_url = `${serverHostname.replace("/sqlwarehouse", "")}/api/redaction/insert`;
    const response = await fetch(endpoint_url, {
      method: 'POST',
      body: JSON.stringify(redaction_metadata)
    });
    const result = await response.json();
    console.log('Redaction metadata saved successfully!', result);
    return result;
  }

  /**
   * Clear all redaction areas for a viewport
   * @param {string} viewportId - The viewport ID
   * @param {HTMLElement} element - The viewport element
   * @param {boolean} clearBoth - If true, clears both global and frame-specific (default: true)
   */
  clearRedactionAreas(viewportId, element, clearBoth = true) {
    RedactionRectangleTool.clearAllRedactionAreas(element);
    const manager = this.getAreaManager(viewportId);
    manager.clearAll(); // Always clear all stored areas

    console.log('Cleared all redaction areas (global and frame-specific)');
  }

  /**
   * Delete a single redaction area by annotation UID
   */
  deleteRedactionArea(viewportId, annotationUID, element) {
    RedactionRectangleTool.deleteRedactionArea(annotationUID, element);
    const manager = this.getAreaManager(viewportId);
    manager.removeArea(annotationUID);
  }

  /**
   * Highlight a specific redaction area
   */
  highlightRedactionArea(annotationUID, element, highlight = true) {
    RedactionRectangleTool.highlightRedactionArea(annotationUID, element, highlight);
  }

  /**
   * Get viewport from ID (helper method)
   */
  getViewportFromId(viewportId) {
    // This would need to be implemented based on how OHIF manages viewports
    // For now, return null and handle in the calling code
    return null;
  }

  /**
   * Export redacted image data with redaction areas burned as black rectangles
   * Works directly with the image pixel data, independent of zoom/pan
   */
  async exportRedactedImage(viewportId, viewport, format = 'png') {
    const element = viewport.element;
    const redactionAreas = RedactionRectangleTool.getRedactionAreas(element);
    return this.exportRedactedImageWithAreas(viewportId, viewport, redactionAreas, format);
  }

  /**
   * Export redacted image with specific areas (not from element annotations)
   * @param {string} viewportId - The viewport ID
   * @param {object} viewport - The viewport object
   * @param {Array} redactionAreas - Specific redaction areas to apply
   * @param {string} format - Output format (default 'png')
   */
  async exportRedactedImageWithAreas(viewportId, viewport, redactionAreas, format = 'png') {
    const offscreenRenderingEngineId = 'redaction-export-rendering-engine';
    const offscreenViewportId = 'redaction-export-viewport';
    try {
      // Get the current imageId from the viewport
      const imageId = viewport.getCurrentImageId();
      if (!imageId) {
        throw new Error('No image loaded in viewport');
      }

      // Get the cached image to get dimensions
      const image = esm.cache.getImage(imageId);
      if (!image) {
        throw new Error('Failed to get image from cache');
      }
      const width = image.width;
      const height = image.height;

      // Create an off-screen div and canvas for rendering
      const offscreenDiv = document.createElement('div');
      offscreenDiv.style.width = `${width}px`;
      offscreenDiv.style.height = `${height}px`;
      offscreenDiv.style.position = 'absolute';
      offscreenDiv.style.left = '-10000px';
      document.body.appendChild(offscreenDiv);

      // Create or get the off-screen rendering engine
      let renderingEngine = (0,esm.getRenderingEngine)(offscreenRenderingEngineId);
      if (!renderingEngine) {
        renderingEngine = new esm.RenderingEngine(offscreenRenderingEngineId);
      }

      // Enable the viewport
      const viewportInput = {
        viewportId: offscreenViewportId,
        type: ViewportType.STACK,
        element: offscreenDiv,
        defaultOptions: {
          background: viewport.defaultOptions?.background || [0, 0, 0]
        }
      };

      // @ts-ignore - background type is correct at runtime
      renderingEngine.enableElement(viewportInput);
      const offscreenViewport = renderingEngine.getViewport(offscreenViewportId);

      // Load the image and copy properties from the original viewport
      if (offscreenViewport instanceof esm.StackViewport) {
        await offscreenViewport.setStack([imageId]);

        // Copy viewport properties (window/level, etc.) but not zoom/pan
        const properties = viewport.getProperties();
        offscreenViewport.setProperties({
          voiRange: properties.voiRange,
          invert: properties.invert
        });

        // Reset camera to 1:1 scale (no zoom/pan)
        offscreenViewport.resetCamera();
      }

      // Render the viewport
      renderingEngine.render();

      // Wait for the render to complete - give the GPU time to finish rendering
      await new Promise(resolve => {
        // Use requestAnimationFrame to wait for the next frame
        requestAnimationFrame(() => {
          // Wait one more frame to ensure rendering is complete
          requestAnimationFrame(resolve);
        });
      });

      // Get the rendered canvas
      const offscreenCanvas = offscreenDiv.querySelector('canvas');
      if (!offscreenCanvas) {
        throw new Error('Failed to get rendered canvas');
      }

      // Create export canvas and copy the rendered image
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = offscreenCanvas.width;
      exportCanvas.height = offscreenCanvas.height;
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      // Copy the rendered image
      ctx.drawImage(offscreenCanvas, 0, 0);

      // Calculate scale factor between canvas and image (for device pixel ratio)
      const scaleX = offscreenCanvas.width / width;
      const scaleY = offscreenCanvas.height / height;
      if (redactionAreas.length === 0) {
        // Clean up - destroy the rendering engine completely
        renderingEngine.disableElement(offscreenViewportId);
        renderingEngine.destroy();
        document.body.removeChild(offscreenDiv);

        // No redaction areas, just export the original image
        const dataUrl = exportCanvas.toDataURL(`image/${format}`);
        return {
          success: true,
          dataUrl: dataUrl,
          format: format,
          message: 'No redaction areas found. Draw rectangles with the Redaction tool first.'
        };
      }

      // Draw white rectangles over redaction areas
      ctx.fillStyle = 'rgba(255, 255, 255, 1.0)'; // Solid white for redaction

      // Get canvas bounds for clamping
      const maxWidth = offscreenCanvas.width;
      const maxHeight = offscreenCanvas.height;

      // Store clamped rectangles for DICOM pixel burning
      const clampedRectangles = [];
      redactionAreas.forEach((area, index) => {
        // Use worldCoordinates array (4 corner points) if available, otherwise use topLeft/bottomRight
        const worldCoords = area.worldCoordinates || [area.topLeft, area.bottomRight];

        // Convert all world coordinates to offscreen canvas coordinates
        const canvasCoords = worldCoords.map(coord => offscreenViewport.worldToCanvas(coord));

        // Find bounding box in canvas space
        const allX = canvasCoords.map(coord => coord[0]);
        const allY = canvasCoords.map(coord => coord[1]);

        // Scale to actual canvas pixel space (accounting for device pixel ratio)
        let x = Math.round(Math.min(...allX) * scaleX);
        let y = Math.round(Math.min(...allY) * scaleY);
        let w = Math.round((Math.max(...allX) - Math.min(...allX)) * scaleX);
        let h = Math.round((Math.max(...allY) - Math.min(...allY)) * scaleY);

        // Store original values before clamping for reference
        const originalRect = {
          x,
          y,
          w,
          h
        };

        // Clamp rectangle to image bounds - CRITICAL for DICOM pixel burning
        // Ensure the rectangle is always within [0, 0, maxWidth, maxHeight]
        if (x < 0) {
          w += x; // Reduce width by the amount we're shifting
          x = 0;
        }
        if (y < 0) {
          h += y; // Reduce height by the amount we're shifting
          y = 0;
        }

        // Clamp width and height to not exceed image boundaries
        if (x + w > maxWidth) {
          w = maxWidth - x;
        }
        if (y + h > maxHeight) {
          h = maxHeight - y;
        }

        // Draw white rectangle at clamped coordinates
        // Only draw if the rectangle has valid dimensions after clamping
        if (w > 0 && h > 0) {
          ctx.fillRect(x, y, w, h);

          // Store clamped rectangle in image pixel coordinates (divide by scale to get original image coordinates)
          clampedRectangles.push({
            annotationUID: area.annotationUID,
            canvasCoords: {
              x,
              y,
              w,
              h
            },
            imageCoords: {
              x: Math.round(x / scaleX),
              y: Math.round(y / scaleY),
              w: Math.round(w / scaleX),
              h: Math.round(h / scaleY)
            },
            wasClamped: originalRect.x !== x || originalRect.y !== y || originalRect.w !== w || originalRect.h !== h
          });
        }
      });

      // Clean up - destroy the rendering engine completely to prevent it from trying to load frames later
      renderingEngine.disableElement(offscreenViewportId);
      renderingEngine.destroy();
      document.body.removeChild(offscreenDiv);

      // Convert to data URL
      const dataUrl = exportCanvas.toDataURL(`image/${format}`);
      return {
        success: true,
        dataUrl: dataUrl,
        format: format,
        redactedAreas: redactionAreas.length,
        clampedRectangles: clampedRectangles,
        // Clamped rectangles for DICOM pixel burning
        imageDimensions: {
          width: width,
          height: height
        }
      };
    } catch (error) {
      console.error('Error exporting redacted image:', error);

      // Clean up offscreen resources if they exist
      try {
        const renderingEngine = (0,esm.getRenderingEngine)(offscreenRenderingEngineId);
        if (renderingEngine) {
          renderingEngine.disableElement(offscreenViewportId);
          renderingEngine.destroy();
        }
        const offscreenDiv = document.querySelector(`div[style*="left: -10000px"]`);
        if (offscreenDiv && offscreenDiv.parentNode) {
          document.body.removeChild(offscreenDiv);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up offscreen resources:', cleanupError);
      }
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get redaction statistics
   * @param {string} viewportId - The viewport ID
   * @param {boolean} isGlobal - Whether to include global areas
   */
  getRedactionStats(viewportId, isGlobal = false) {
    const manager = this.getAreaManager(viewportId);
    const allAreas = manager.getAllAreas();
    return {
      totalAreas: allAreas.length,
      areas: allAreas.map((area, index) => ({
        id: index + 1,
        annotationUID: area.annotationUID,
        coordinates: area.worldCoordinates,
        frameIndex: area.frameIndex,
        isGlobal: area.isGlobal
      }))
    };
  }

  /**
   * Export redaction metadata grouped by file
   * All metadata is already stored in RedactionArea objects
   * @param {string} viewportId - The viewport ID
   * @param {object} viewport - The viewport object
   */
  async exportRedactedDICOM(viewportId, viewport) {
    try {
      // Get all RedactionArea objects from the manager
      const manager = this.getAreaManager(viewportId);
      const allAreas = manager.getAllAreas();
      if (allAreas.length === 0) {
        throw new Error('No redaction areas to export');
      }

      // Get all imageIds in the series from the viewport
      let allImageIds = [];
      if (viewport && typeof viewport.getImageIds === 'function') {
        allImageIds = viewport.getImageIds();
      } else if (viewport && viewport.imageIds) {
        allImageIds = viewport.imageIds;
      }
      console.log(`Found ${allImageIds.length} total images in series`);

      // Build complete file list from all imageIds in series
      const allFilesInSeries = new Map(); // sopInstanceUID -> file metadata

      for (const imageId of allImageIds) {
        try {
          const metadata = esm.metaData.get('instance', imageId);
          if (metadata) {
            const sopUID = metadata.SOPInstanceUID || metadata.sopInstanceUID;
            if (sopUID && !allFilesInSeries.has(sopUID)) {
              // Extract file name from imageId
              let filePath = 'unknown.dcm';
              // Files will always be part of /Volumes/...
              const match = imageId.match(/\/Volumes\/[^?]+/);
              if (match) {
                filePath = match[0].split("&")[0];
              }
              allFilesInSeries.set(sopUID, {
                filePath: filePath,
                sopInstanceUID: sopUID,
                studyInstanceUID: metadata.StudyInstanceUID || metadata.studyInstanceUID,
                seriesInstanceUID: metadata.SeriesInstanceUID || metadata.seriesInstanceUID,
                modality: metadata.Modality || metadata.modality,
                numberOfFrames: metadata.NumberOfFrames || metadata.numberOfFrames || 1,
                rows: metadata.Rows || metadata.rows,
                columns: metadata.Columns || metadata.columns,
                imageId: imageId
              });
            }
          }
        } catch (error) {
          console.warn(`Failed to get metadata for imageId: ${imageId}`, error);
        }
      }
      console.log(`Built file list with ${allFilesInSeries.size} unique files`);

      // Group areas by file (sopInstanceUID is unique per file/frame)
      const fileGroups = new Map();
      allAreas.forEach(area => {
        const fileKey = area.sopInstanceUID || area.fileName;
        if (!fileGroups.has(fileKey)) {
          fileGroups.set(fileKey, {
            // Common file metadata
            filePath: area.filePath,
            imageId: area.imageId,
            studyInstanceUID: area.studyInstanceUID,
            seriesInstanceUID: area.seriesInstanceUID,
            sopInstanceUID: area.sopInstanceUID,
            sopClassUID: area.sopClassUID,
            modality: area.modality,
            numberOfFrames: area.numberOfFrames,
            rows: area.rows,
            columns: area.columns,
            redactionAreas: []
          });
        }

        // Add this area to the file's redaction list (store full area object, not JSON yet)
        fileGroups.get(fileKey).redactionAreas.push(area);
      });

      // Helper function to convert world coordinates to image pixel coordinates
      const worldCoordsToImagePixels = (worldCoords, imageId) => {
        try {
          // Get the image from cache
          const image = esm.cache.getImage(imageId);
          if (!image) return null;

          // Get viewport data
          const imageData = viewport.getImageData();
          if (!imageData?.imageData?.worldToIndex) return null;
          const worldToIndex = imageData.imageData.worldToIndex;

          // Convert world coordinates to image pixel indices
          const pixelCoords = worldCoords.map(coord => worldToIndex(coord));

          // Get bounding box
          const allX = pixelCoords.map(c => c[0]);
          const allY = pixelCoords.map(c => c[1]);
          return {
            topLeft: [Math.round(Math.min(...allX)), Math.round(Math.min(...allY))],
            bottomRight: [Math.round(Math.max(...allX)), Math.round(Math.max(...allY))],
            width: Math.round(Math.max(...allX) - Math.min(...allX)),
            height: Math.round(Math.max(...allY) - Math.min(...allY))
          };
        } catch (error) {
          console.warn('Failed to convert world coords to pixels:', error);
          return null;
        }
      };

      // Extract study and series metadata from first file (all files should have same study/series)
      let studyInstanceUID = null;
      let seriesInstanceUID = null;
      let modality = null;
      if (allAreas.length > 0) {
        const firstArea = allAreas[0];
        studyInstanceUID = firstArea.studyInstanceUID;
        seriesInstanceUID = firstArea.seriesInstanceUID;
        modality = firstArea.modality;
      }

      // Collect all global redactions (they apply to ALL files in the series)
      const globalAreas = allAreas.filter(a => a.isGlobal);
      const globalRedactions = globalAreas.map((area, index) => {
        // Convert world coordinates to image pixel coordinates
        const imagePixels = worldCoordsToImagePixels(area.worldCoordinates, area.imageId);
        return {
          id: index + 1,
          imagePixelCoordinates: imagePixels,
          annotationUID: area.annotationUID,
          timestamp: area.timestamp
        };
      });

      // Build files dictionary: filePath -> array of frame redactions
      const files = {};
      fileGroups.forEach(fileData => {
        const filePath = fileData.filePath;
        const frameRedactions = [];
        fileData.redactionAreas.forEach(area => {
          // Skip global redactions - they're at root level
          if (area.isGlobal) return;

          // Convert world coordinates to image pixel coordinates
          const imagePixels = worldCoordsToImagePixels(area.worldCoordinates, area.imageId);
          frameRedactions.push({
            frameIndex: area.frameIndex,
            imagePixelCoordinates: imagePixels,
            annotationUID: area.annotationUID,
            timestamp: area.timestamp
          });
        });

        // Sort by frame index
        frameRedactions.sort((a, b) => a.frameIndex - b.frameIndex);

        // Only add files that have frame-specific redactions
        if (frameRedactions.length > 0) {
          files[filePath] = frameRedactions;
        }
      });

      // Count totals
      const totalGlobalRedactions = globalAreas.length;
      const totalFrameSpecificRedactions = allAreas.filter(a => !a.isGlobal).length;

      // Build list of file paths to edit
      // Include all files in the series since single frame redaction without overwrite will require
      // to rebuild all the files in the series with new series uid
      const filesToEdit = Array.from(allFilesInSeries.values()).map(file => file.filePath);
      console.log(`files dictionary contains ${Object.keys(files).length} files`);

      // Build final JSON metadata with study/series info and global redactions at root level
      const jsonMetadata = {
        exportTimestamp: new Date().toISOString(),
        studyInstanceUID: studyInstanceUID,
        seriesInstanceUID: seriesInstanceUID,
        modality: modality,
        totalFilesInSeries: allFilesInSeries.size,
        // Total files in the series
        totalRedactionAreas: allAreas.length,
        totalGlobalRedactions: totalGlobalRedactions,
        totalFrameSpecificRedactions: totalFrameSpecificRedactions,
        globalRedactions: globalRedactions,
        // Apply to ALL files in filesToEdit
        filesToEdit: filesToEdit,
        // All files if global redactions exist, otherwise only files with frame-specific redactions
        frameRedactions: files // Dictionary: filePath -> array of frame redactions
      };
      return {
        success: true,
        metadata: jsonMetadata
      };
    } catch (error) {
      console.error('Error exporting redaction metadata:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
/* harmony default export */ const services_RedactionService = (new RedactionService());
;// CONCATENATED MODULE: ../../../../../../../plugins/ohifv3/extensions/image-redactor/src/components/RedactionPanel.tsx
/*
OHIF Image Redactor Extension Copyright (2025) Databricks, Inc.
Author: Emanuele Rinaldi <emanuele.rinaldi@databricks.com>

This library (the "Software") may not be used except in connection with the Licensee's use of the Databricks Platform Services pursuant to an Agreement (defined below) between Licensee (defined below) and Databricks, Inc. ("Databricks"). The Object Code version of the Software shall be deemed part of the Downloadable Services under the Agreement, or if the Agreement does not define Downloadable Services, Subscription Services, or if neither are defined then the term in such Agreement that refers to the applicable Databricks Platform Services (as defined below) shall be substituted herein for "Downloadable Services." Licensee's use of the Software must comply at all times with any restrictions applicable to the Downlodable Services and Subscription Services, generally, and must be used in accordance with any applicable documentation. For the avoidance of doubt, the Software constitutes Databricks Confidential Information under the Agreement. Additionally, and notwithstanding anything in the Agreement to the contrary:
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
* you may view, make limited copies of, and may compile the Source Code version of the Software into an Object Code version of the Software. For the avoidance of doubt, you may not make derivative works of Software (or make any any changes to the Source Code version of the unless you have agreed to separate terms with Databricks permitting such modifications (e.g., a contribution license agreement)).
If you have not agreed to an Agreement or otherwise do not agree to these terms, you may not use the Software or view, copy or compile the Source Code of the Software. This license terminates automatically upon the termination of the Agreement or Licensee's breach of these terms. Additionally, Databricks may terminate this license at any time on notice. Upon termination, you must permanently delete the Software and all copies thereof (including the Source Code).
*/




const RedactionPanel = ({
  servicesManager
}) => {
  const [redactionAreas, setRedactionAreas] = (0,react.useState)([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = (0,react.useState)(false);
  const [previewFrames, setPreviewFrames] = (0,react.useState)([]);
  const [previewPopupOpen, setPreviewPopupOpen] = (0,react.useState)(false);
  const [previewPopupImage, setPreviewPopupImage] = (0,react.useState)(null);
  const [previewPopupFrameIndex, setPreviewPopupFrameIndex] = (0,react.useState)(0);
  const [stats, setStats] = (0,react.useState)({
    totalAreas: 0,
    areas: []
  });
  const [applyToAllFrames, setApplyToAllFrames] = (0,react.useState)(false);
  const [currentFrameIndex, setCurrentFrameIndex] = (0,react.useState)(0);
  const [enableFileOverwrite, setEnableFileOverwrite] = (0,react.useState)(false);

  // Track the number of annotations and frame index to detect changes
  const [previousAnnotationCount, setPreviousAnnotationCount] = (0,react.useState)(0);
  const [previousFrameIndex, setPreviousFrameIndex] = (0,react.useState)(0);
  const [currentSeriesUID, setCurrentSeriesUID] = (0,react.useState)(null);
  const {
    viewportGridService,
    cornerstoneViewportService
  } = servicesManager.services;

  // Get current viewport info including series metadata
  const getCurrentViewport = () => {
    const {
      activeViewportId
    } = viewportGridService.getState();
    const cornerstoneViewport = cornerstoneViewportService.getCornerstoneViewport(activeViewportId);

    // Extract frame index from imageId or viewport
    let frameIndex = 0;
    let seriesInstanceUID = null;
    let studyInstanceUID = null;
    if (cornerstoneViewport) {
      // Method 1: For stack viewports, use getCurrentImageIdIndex
      if (typeof cornerstoneViewport.getCurrentImageIdIndex === 'function') {
        frameIndex = cornerstoneViewport.getCurrentImageIdIndex();
      }
      // Method 2: For multiframe images, parse from imageId
      else {
        const imageId = cornerstoneViewport.getCurrentImageId();
        if (imageId && imageId.startsWith('multiframe:')) {
          const parts = imageId.substring('multiframe:'.length).split('&frame=');
          frameIndex = parseInt(parts[1]) || 0;
        }
      }

      // Get series metadata from the current imageId
      try {
        const imageId = cornerstoneViewport.getCurrentImageId();
        if (imageId) {
          const metadata = esm.metaData.get('instance', imageId);
          if (metadata) {
            seriesInstanceUID = metadata.SeriesInstanceUID;
            studyInstanceUID = metadata.StudyInstanceUID;
          }
        }
      } catch (error) {
        console.warn('Failed to get series metadata:', error);
      }
    }
    return {
      viewportId: activeViewportId,
      viewport: cornerstoneViewport,
      element: cornerstoneViewport?.element,
      frameIndex: frameIndex,
      seriesInstanceUID: seriesInstanceUID,
      studyInstanceUID: studyInstanceUID
    };
  };

  // Update stats from stored areas
  const updateStats = () => {
    const {
      viewportId
    } = getCurrentViewport();
    const currentStats = services_RedactionService.getRedactionStats(viewportId, applyToAllFrames);
    setStats(currentStats);
  };

  // Clear all redaction areas
  const clearAllAreas = () => {
    const {
      viewportId,
      element,
      viewport
    } = getCurrentViewport();
    if (element && viewport) {
      services_RedactionService.clearRedactionAreas(viewportId, element, applyToAllFrames);

      // Get rendering engine and force full re-render
      const renderingEngine = viewport.getRenderingEngine();
      if (renderingEngine) {
        renderingEngine.render();
      } else {
        viewport.render();
      }

      // Update stats
      updateStats();
    }
  };

  // Toggle redaction between global and frame-specific
  const toggleRedactionGlobal = annotationUID => {
    const {
      viewportId,
      element,
      viewport
    } = getCurrentViewport();
    if (element && viewport) {
      services_RedactionService.toggleRedactionGlobal(viewportId, annotationUID, element, viewport);
      updateStats();
    }
  };

  // Delete individual redaction area
  const deleteRedactionArea = annotationUID => {
    const {
      viewportId,
      element,
      viewport
    } = getCurrentViewport();
    if (element && viewport) {
      services_RedactionService.deleteRedactionArea(viewportId, annotationUID, element);
      viewport.render();
      updateStats();
    }
  };

  // Handle mouse enter on area item - highlight the annotation
  const handleAreaHover = (annotationUID, isHovering) => {
    const {
      element,
      viewport
    } = getCurrentViewport();
    if (element && viewport) {
      services_RedactionService.highlightRedactionArea(annotationUID, element, isHovering);
      viewport.render();
    }
  };

  // Navigate to a specific frame
  const navigateToFrame = targetFrameIndex => {
    const {
      viewport
    } = getCurrentViewport();
    if (!viewport || typeof viewport.setImageIdIndex !== 'function') return;
    viewport.setImageIdIndex(targetFrameIndex);
    viewport.render();
    setTimeout(() => {
      setCurrentFrameIndex(targetFrameIndex);
    }, 200);
  };

  // Handle clicking on a redaction area to navigate to its frame
  const handleAreaClick = area => {
    // Only navigate for frame-specific redactions that are not on the current frame
    if (!area.isGlobal && area.frameIndex !== undefined && area.frameIndex !== currentFrameIndex) {
      navigateToFrame(area.frameIndex);
    }
  };

  // Apply redaction with confirmation - generate preview for current frame only
  const handleApplyRedaction = async () => {
    if (stats.totalAreas === 0) {
      alert('No redaction areas defined. Please draw redaction rectangles first.');
      return;
    }
    const {
      viewportId,
      viewport
    } = getCurrentViewport();
    if (!viewport) return;
    try {
      // Separate global and frame-specific areas
      const globalAreas = stats.areas.filter(area => area.isGlobal);
      const frameSpecificAreas = stats.areas.filter(area => !area.isGlobal);

      // Create preview list: one row for global, individual rows for frame-specific
      const previews = [];

      // Add one row for all global redactions (if any)
      if (globalAreas.length > 0) {
        previews.push({
          frameIndex: null,
          // null indicates this is the global row
          areaCount: globalAreas.length,
          isGlobal: true,
          isCurrentFrame: false
        });
      }

      // Add individual rows for each frame with frame-specific redactions
      const framesWithAreas = new Map(); // frameIndex -> count
      frameSpecificAreas.forEach(area => {
        const frameIdx = area.frameIndex !== undefined ? area.frameIndex : 0;
        framesWithAreas.set(frameIdx, (framesWithAreas.get(frameIdx) || 0) + 1);
      });

      // Sort by frame index and add to previews
      for (const [frameIdx, count] of Array.from(framesWithAreas.entries()).sort((a, b) => a[0] - b[0])) {
        previews.push({
          frameIndex: frameIdx,
          areaCount: count,
          isGlobal: false,
          isCurrentFrame: frameIdx === currentFrameIndex
        });
      }
      if (previews.length > 0) {
        setPreviewFrames(previews);
        setConfirmDialogOpen(true);
      } else {
        alert('No redaction areas found');
      }
    } catch (error) {
      alert('Error preparing preview: ' + error.message);
    }
  };

  // Confirm and apply redaction - download metadata JSON only
  const confirmApplyRedaction = async () => {
    const {
      viewportId,
      viewport,
      element
    } = getCurrentViewport();
    if (!viewport || !element) return;
    setConfirmDialogOpen(false);
    try {
      // Export redaction metadata
      const result = await services_RedactionService.exportRedactedDICOM(viewportId, viewport);
      if (!result.success) {
        alert(`Error: ${result.error}`);
        return;
      }
      if (!result.metadata) {
        alert('Failed to generate redaction metadata');
        return;
      }

      // Download metadata JSON
      result.metadata['enableFileOverwrite'] = enableFileOverwrite;

      // Retrieve serverHostname from config
      let serverHostname = '';
      serverHostname = window.config.dataSources.find(ds => ds.namespace.includes('databricksPixelsDicom'))?.configuration?.serverHostname || '';
      // Mark as applied in service
      const applyResult = await services_RedactionService.applyRedaction(result.metadata, serverHostname);
      if (applyResult.status === 'inserted') {
        alert(`Redaction metadata saved successfully!\n
          Total redacted areas: ${stats.totalAreas}
          Redaction ID: ${applyResult['redaction_id']}`);
        updateStats();
      } else {
        alert(`Error: ${applyResult.message}`);
      }

      // Clear preview
      setPreviewFrames([]);
    } catch (error) {
      console.error('Error applying redaction:', error);
      alert(`Error applying redaction: ${error.message}`);
      setPreviewFrames([]);
    }
  };

  // Cancel dialog and clear preview
  const cancelApplyRedaction = () => {
    setConfirmDialogOpen(false);
    setPreviewFrames([]);
  };

  // Show preview for a specific frame or global redactions
  const showFramePreview = async (frameIdx, isGlobal) => {
    const {
      viewportId,
      viewport,
      element
    } = getCurrentViewport();
    if (!viewport || !element) return;
    try {
      const originalFrameIndex = currentFrameIndex;

      // For global preview, use current frame; for frame-specific, navigate to that frame
      const targetFrameIndex = isGlobal ? currentFrameIndex : frameIdx;

      // Navigate to the target frame
      if (typeof viewport.setImageIdIndex === 'function') {
        viewport.setImageIdIndex(targetFrameIndex);
        await new Promise(resolve => setTimeout(resolve, 300)); // Wait for frame to load
      }
      let combinedAnnotations = [];
      if (isGlobal) {
        // For global preview, show only global annotations
        const allStoredAreas = services_RedactionService.getAreaManager(viewportId).getAllAreas();
        combinedAnnotations = allStoredAreas.filter(area => area.isGlobal).map(area => ({
          annotationUID: area.annotationUID,
          topLeft: area.topLeft,
          bottomRight: area.bottomRight,
          worldCoordinates: area.worldCoordinates
        }));
      } else {
        // For frame-specific preview, show frame-specific + global annotations
        const frameSpecificAnnotations = services_RedactionService.getStoredFrameAreas(viewportId, targetFrameIndex);
        const allStoredAreas = services_RedactionService.getAreaManager(viewportId).getAllAreas();
        const globalAnnotations = allStoredAreas.filter(area => area.isGlobal).map(area => ({
          annotationUID: area.annotationUID,
          topLeft: area.topLeft,
          bottomRight: area.bottomRight,
          worldCoordinates: area.worldCoordinates
        }));
        combinedAnnotations = [...frameSpecificAnnotations, ...globalAnnotations];
      }

      // Generate preview
      const result = await services_RedactionService.exportRedactedImageWithAreas(viewportId, viewport, combinedAnnotations);

      // Navigate back to original frame
      if (typeof viewport.setImageIdIndex === 'function') {
        viewport.setImageIdIndex(originalFrameIndex);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Force viewport render
      viewport.render();
      if (result.success && result.dataUrl) {
        setPreviewPopupImage(result.dataUrl);
        setPreviewPopupFrameIndex(targetFrameIndex);
        setPreviewPopupOpen(true);
      } else {
        alert('Failed to generate preview: ' + (result.error || result.message));
      }
    } catch (error) {
      alert('Error generating preview: ' + error.message);
    }
  };

  // Close preview popup
  const closePreviewPopup = () => {
    setPreviewPopupOpen(false);
    setPreviewPopupImage(null);
  };

  // Watch for annotation and frame changes
  (0,react.useEffect)(() => {
    updateStats(); // Initial load

    // Sync global annotations on initial load
    const {
      element,
      viewport,
      viewportId,
      seriesInstanceUID
    } = getCurrentViewport();
    if (element && viewport) {
      services_RedactionService.syncGlobalAnnotationsToFrame(viewportId, element, viewport);
    }

    // Initialize series UID tracking
    if (seriesInstanceUID && !currentSeriesUID) {
      setCurrentSeriesUID(seriesInstanceUID);
    }
    const intervalId = setInterval(() => {
      const {
        element,
        frameIndex,
        viewportId,
        viewport,
        seriesInstanceUID
      } = getCurrentViewport();
      if (!element || !viewport) return;

      // Detect series change (different DICOM series loaded)
      if (seriesInstanceUID && seriesInstanceUID !== currentSeriesUID) {
        console.log(`Series changed: ${currentSeriesUID} → ${seriesInstanceUID}`);
        clearAllAreas();
        console.log('Cleared redaction areas due to series change');

        // Update series UID
        setCurrentSeriesUID(seriesInstanceUID);
        setPreviousFrameIndex(0);
        setCurrentFrameIndex(0);
        setPreviousAnnotationCount(0);
        updateStats();
        return;
      }

      // Detect frame change
      if (frameIndex !== previousFrameIndex) {
        console.log(`Frame changed: ${previousFrameIndex} → ${frameIndex}`);
        setPreviousFrameIndex(frameIndex);
        setCurrentFrameIndex(frameIndex);

        // Always sync global annotations on frame change (updates z-coordinates)
        services_RedactionService.syncGlobalAnnotationsToFrame(viewportId, element, viewport);
        const areas = services_RedactionService.getRedactionAreas(viewportId, element, viewport, frameIndex, applyToAllFrames);
        setPreviousAnnotationCount(areas.length);
        updateStats();
        return;
      }

      // Detect annotation changes
      const areas = services_RedactionService.getRedactionAreas(viewportId, element, viewport, frameIndex, applyToAllFrames);
      const currentCount = areas.length;
      if (currentCount > previousAnnotationCount) {
        // New annotations added
        const newAnnotations = areas.slice(-(currentCount - previousAnnotationCount));
        console.log(`Storing ${newAnnotations.length} new annotation(s) for frame ${frameIndex}`);
        services_RedactionService.storeSpecificAreas(viewportId, viewport, newAnnotations, frameIndex, applyToAllFrames);
        setPreviousAnnotationCount(currentCount);
        updateStats();
      } else if (currentCount < previousAnnotationCount) {
        // Annotation deleted
        console.log(`Annotation deleted on frame ${frameIndex}`);
        setPreviousAnnotationCount(currentCount);
        updateStats();
      } else if (currentCount > 0) {
        // Check for modifications on current frame's annotations only
        const storedAreas = services_RedactionService.getStoredFrameAreas(viewportId, frameIndex);
        if (storedAreas.length > 0) {
          const storedUIDs = new Set(storedAreas.map(a => a.annotationUID));
          const currentFrameAreas = areas.filter(a => storedUIDs.has(a.annotationUID));

          // Check if any coordinates changed
          const hasChanges = currentFrameAreas.some(area => {
            const stored = storedAreas.find(s => s.annotationUID === area.annotationUID);
            return stored && (area.topLeft[0] !== stored.topLeft[0] || area.topLeft[1] !== stored.topLeft[1] || area.bottomRight[0] !== stored.bottomRight[0] || area.bottomRight[1] !== stored.bottomRight[1]);
          });
          if (hasChanges) {
            console.log(`Annotation(s) modified on frame ${frameIndex}`);
            services_RedactionService.updateFrameAreas(viewportId, viewport, currentFrameAreas, frameIndex, applyToAllFrames);
            updateStats();
          }
        }
      }
    }, 300);
    return () => clearInterval(intervalId);
  }, [previousAnnotationCount, previousFrameIndex, applyToAllFrames, currentSeriesUID, stats.totalAreas]);
  return /*#__PURE__*/react.createElement("div", {
    className: "redaction-panel",
    style: {
      padding: '16px',
      fontFamily: 'Arial, sans-serif'
    }
  }, /*#__PURE__*/react.createElement("h3", {
    style: {
      marginBottom: '16px',
      color: '#333'
    }
  }, "Image Redactor"), /*#__PURE__*/react.createElement("div", {
    style: {
      marginBottom: '16px',
      padding: '12px',
      backgroundColor: '#f8f9fa',
      borderRadius: '4px'
    }
  }, /*#__PURE__*/react.createElement("h4", {
    style: {
      marginBottom: '8px',
      fontSize: '14px',
      color: '#495057',
      fontWeight: 'bold'
    }
  }, "Export Settings"), /*#__PURE__*/react.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      fontSize: '13px'
    }
  }, /*#__PURE__*/react.createElement("input", {
    type: "checkbox",
    checked: enableFileOverwrite,
    onChange: e => setEnableFileOverwrite(e.target.checked),
    style: {
      marginRight: '8px',
      width: '16px',
      height: '16px',
      cursor: 'pointer'
    }
  }), /*#__PURE__*/react.createElement("span", {
    style: {
      color: '#495057'
    }
  }, "Enable File Overwrite")), /*#__PURE__*/react.createElement("p", {
    style: {
      margin: '4px 0 0 24px',
      fontSize: '11px',
      color: '#6c757d',
      fontStyle: 'italic'
    }
  }, enableFileOverwrite ? '⚠️ Existing files will be overwritten without confirmation' : 'Downloaded files will have unique timestamps to prevent overwrites')), /*#__PURE__*/react.createElement("div", {
    style: {
      marginBottom: '16px'
    }
  }, /*#__PURE__*/react.createElement("button", {
    onClick: clearAllAreas,
    disabled: stats.totalAreas === 0,
    style: {
      width: '100%',
      padding: '10px',
      backgroundColor: stats.totalAreas === 0 ? '#e9ecef' : '#dc3545',
      color: stats.totalAreas === 0 ? '#6c757d' : 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: stats.totalAreas === 0 ? 'not-allowed' : 'pointer',
      fontSize: '14px'
    }
  }, "Clear All Areas (", stats.totalAreas, ")")), /*#__PURE__*/react.createElement("hr", {
    style: {
      margin: '16px 0',
      border: 'none',
      borderTop: '1px solid #dee2e6'
    }
  }), /*#__PURE__*/react.createElement("div", {
    style: {
      margin: '16px 0'
    }
  }, /*#__PURE__*/react.createElement("h4", {
    style: {
      marginBottom: '8px',
      fontSize: '14px',
      color: '#495057'
    }
  }, "Redaction Areas (", stats.totalAreas, ")"), stats.totalAreas > 0 && /*#__PURE__*/react.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#6c757d',
      marginBottom: '8px',
      marginLeft: '4px'
    }
  }, "\uD83C\uDF10 Global: ", stats.areas.filter(a => a.isGlobal).length, " | \uD83D\uDCCD Frame-specific: ", stats.areas.filter(a => !a.isGlobal).length), stats.areas.length > 0 ? /*#__PURE__*/react.createElement("div", {
    style: {
      maxHeight: '200px',
      overflow: 'auto',
      border: '1px solid #dee2e6',
      borderRadius: '4px'
    }
  }, stats.areas.sort((a, b) => {
    // Sort: global first, then frame-specific by frame index
    if (a.isGlobal && !b.isGlobal) return -1;
    if (!a.isGlobal && b.isGlobal) return 1;

    // Both are frame-specific, sort by frame index
    if (!a.isGlobal && !b.isGlobal) {
      if (a.frameIndex !== b.frameIndex) {
        return (a.frameIndex || 0) - (b.frameIndex || 0);
      }
    }

    // Same type and frame, sort by id
    return a.id - b.id;
  }).map(area => /*#__PURE__*/react.createElement("div", {
    key: area.id,
    style: {
      padding: '8px',
      borderBottom: '1px solid #f8f9fa',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: !area.isGlobal && area.frameIndex !== currentFrameIndex ? 'pointer' : 'default',
      transition: 'background-color 0.2s',
      backgroundColor: !area.isGlobal && area.frameIndex === currentFrameIndex ? '#e7f3ff' : area.isGlobal ? '#f0f9ff' : 'transparent'
    },
    onClick: () => handleAreaClick(area),
    onMouseEnter: () => handleAreaHover(area.annotationUID, true),
    onMouseLeave: () => handleAreaHover(area.annotationUID, false),
    onMouseOver: e => {
      if (!area.isGlobal && area.frameIndex !== currentFrameIndex) {
        e.currentTarget.style.backgroundColor = '#fff3cd';
      } else if (area.isGlobal) {
        e.currentTarget.style.backgroundColor = '#e0f2fe';
      } else {
        e.currentTarget.style.backgroundColor = e.currentTarget.style.backgroundColor || '#f8f9fa';
      }
    },
    onMouseOut: e => {
      if (!area.isGlobal && area.frameIndex === currentFrameIndex) {
        e.currentTarget.style.backgroundColor = '#e7f3ff';
      } else if (area.isGlobal) {
        e.currentTarget.style.backgroundColor = '#f0f9ff';
      } else {
        e.currentTarget.style.backgroundColor = 'transparent';
      }
    }
  }, /*#__PURE__*/react.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/react.createElement("div", {
    style: {
      fontSize: '12px',
      color: '#495057',
      fontWeight: 'bold'
    }
  }, area.isGlobal ? /*#__PURE__*/react.createElement("span", null, "\uD83C\uDF10 Area ", area.id, " (Global)") : /*#__PURE__*/react.createElement("span", null, "\uD83D\uDCCD Frame ", area.frameIndex !== undefined ? area.frameIndex + 1 : '?', " - Area ", area.id, area.frameIndex === currentFrameIndex && ' ⭐')), /*#__PURE__*/react.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#6c757d',
      marginTop: '2px'
    }
  }, area.isGlobal ? /*#__PURE__*/react.createElement("span", null, "Applies to all frames") : /*#__PURE__*/react.createElement("span", null, area.frameIndex === currentFrameIndex ? 'Current frame only' : 'Click to navigate'))), /*#__PURE__*/react.createElement("div", {
    style: {
      display: 'flex',
      gap: '4px'
    }
  }, /*#__PURE__*/react.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      toggleRedactionGlobal(area.annotationUID);
    },
    style: {
      padding: '4px 8px',
      backgroundColor: area.isGlobal ? '#0ea5e9' : '#64748b',
      color: 'white',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
      fontSize: '11px',
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      whiteSpace: 'nowrap'
    },
    title: area.isGlobal ? 'Make frame-specific' : 'Make global'
  }, area.isGlobal ? '🌐→📍' : '📍→🌐'), /*#__PURE__*/react.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      deleteRedactionArea(area.annotationUID);
    },
    style: {
      padding: '4px 8px',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    title: "Delete this redaction area"
  }, "X"))))) : /*#__PURE__*/react.createElement("p", {
    style: {
      fontSize: '12px',
      color: '#6c757d',
      fontStyle: 'italic'
    }
  }, "No redaction areas defined. Use the redaction tool to draw rectangles.")), /*#__PURE__*/react.createElement("hr", {
    style: {
      margin: '16px 0',
      border: 'none',
      borderTop: '1px solid #dee2e6'
    }
  }), /*#__PURE__*/react.createElement("div", {
    style: {
      marginTop: '16px'
    }
  }, /*#__PURE__*/react.createElement("button", {
    onClick: handleApplyRedaction,
    disabled: stats.totalAreas === 0,
    style: {
      width: '100%',
      padding: '12px',
      marginBottom: '8px',
      backgroundColor: stats.totalAreas === 0 ? '#e9ecef' : '#28a745',
      color: stats.totalAreas === 0 ? '#6c757d' : 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: stats.totalAreas === 0 ? 'not-allowed' : 'pointer',
      fontSize: '14px',
      fontWeight: 'bold'
    }
  }, "Apply Redaction (", stats.totalAreas, " areas)")), confirmDialogOpen && /*#__PURE__*/react.createElement("div", {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      overflow: 'auto',
      padding: '20px'
    }
  }, /*#__PURE__*/react.createElement("div", {
    style: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '8px',
      maxWidth: '800px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto'
    }
  }, /*#__PURE__*/react.createElement("h4", {
    style: {
      marginBottom: '16px',
      fontSize: '18px',
      fontWeight: 'bold'
    }
  }, "Confirm Redaction"), previewFrames.length > 0 && /*#__PURE__*/react.createElement("div", {
    style: {
      marginBottom: '16px',
      border: '2px solid #dee2e6',
      borderRadius: '4px',
      overflow: 'hidden',
      backgroundColor: '#f8f9fa'
    }
  }, /*#__PURE__*/react.createElement("div", {
    style: {
      padding: '12px',
      backgroundColor: '#e9ecef',
      borderBottom: '1px solid #dee2e6',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#495057'
    }
  }, "Redaction Summary"), /*#__PURE__*/react.createElement("div", {
    style: {
      maxHeight: '300px',
      overflow: 'auto',
      padding: '12px'
    }
  }, previewFrames.map((frame, index) => /*#__PURE__*/react.createElement("div", {
    key: frame.isGlobal ? 'global' : `frame-${frame.frameIndex}`,
    style: {
      padding: '12px',
      marginBottom: '8px',
      backgroundColor: frame.isGlobal ? '#f0f9ff' : frame.isCurrentFrame ? '#fff3cd' : 'white',
      border: frame.isGlobal ? '2px solid #0ea5e9' : frame.isCurrentFrame ? '2px solid #ffc107' : '1px solid #dee2e6',
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/react.createElement("div", {
    style: {
      flex: 1
    }
  }, frame.isGlobal ? /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
    style: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#0ea5e9'
    }
  }, "\uD83C\uDF10 Global Redactions"), /*#__PURE__*/react.createElement("div", {
    style: {
      fontSize: '12px',
      color: '#6c757d',
      marginTop: '4px'
    }
  }, frame.areaCount, " redaction", frame.areaCount > 1 ? 's' : '', " \u2022 Apply to all frames"), /*#__PURE__*/react.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#6c757d',
      marginTop: '2px',
      fontStyle: 'italic'
    }
  }, "Preview shows current frame (Frame ", currentFrameIndex + 1, ")")) : /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
    style: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#495057'
    }
  }, "\uD83D\uDCCD Frame ", frame.frameIndex + 1, frame.isCurrentFrame && ' ⭐ (Current)'), /*#__PURE__*/react.createElement("div", {
    style: {
      fontSize: '12px',
      color: '#6c757d',
      marginTop: '4px'
    }
  }, frame.areaCount, " frame-specific redaction", frame.areaCount > 1 ? 's' : ''))), /*#__PURE__*/react.createElement("button", {
    onClick: () => showFramePreview(frame.frameIndex, frame.isGlobal),
    style: {
      padding: '8px 16px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      cursor: 'pointer'
    }
  }, "Preview"))))), /*#__PURE__*/react.createElement("p", {
    style: {
      marginBottom: '8px',
      fontSize: '14px'
    }
  }, "Are you sure you want to apply redaction to ", /*#__PURE__*/react.createElement("strong", null, stats.totalAreas, " area(s)"), "?"), /*#__PURE__*/react.createElement("div", {
    style: {
      fontSize: '12px',
      color: '#495057',
      marginBottom: '8px',
      padding: '8px',
      backgroundColor: '#f8f9fa',
      borderRadius: '4px'
    }
  }, /*#__PURE__*/react.createElement("div", null, "\uD83C\uDF10 ", /*#__PURE__*/react.createElement("strong", null, stats.areas.filter(a => a.isGlobal).length), " global redaction(s) (visible on all frames)"), /*#__PURE__*/react.createElement("div", null, "\uD83D\uDCCD ", /*#__PURE__*/react.createElement("strong", null, stats.areas.filter(a => !a.isGlobal).length), " frame-specific redaction(s) across ", /*#__PURE__*/react.createElement("strong", null, new Set(stats.areas.filter(a => !a.isGlobal).map(a => a.frameIndex)).size), " frame(s)")), /*#__PURE__*/react.createElement("p", {
    style: {
      fontSize: '12px',
      color: '#6c757d',
      marginBottom: '20px'
    }
  }, "Review the redacted areas above. Click Preview to see how each will look. Metadata JSON will be downloaded."), /*#__PURE__*/react.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/react.createElement("button", {
    onClick: cancelApplyRedaction,
    style: {
      padding: '10px 20px',
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px'
    }
  }, "Cancel"), /*#__PURE__*/react.createElement("button", {
    onClick: confirmApplyRedaction,
    style: {
      padding: '10px 20px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '14px'
    }
  }, "Confirm")))), previewPopupOpen && previewPopupImage && /*#__PURE__*/react.createElement("div", {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    },
    onClick: closePreviewPopup
  }, /*#__PURE__*/react.createElement("div", {
    style: {
      backgroundColor: 'white',
      borderRadius: '8px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/react.createElement("div", {
    style: {
      padding: '16px',
      backgroundColor: '#e9ecef',
      borderBottom: '2px solid #dee2e6',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px'
    }
  }, /*#__PURE__*/react.createElement("div", {
    style: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#495057'
    }
  }, "Preview: Frame ", previewPopupFrameIndex + 1), /*#__PURE__*/react.createElement("button", {
    onClick: closePreviewPopup,
    style: {
      padding: '4px 12px',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold'
    }
  }, "\u2715 Close")), /*#__PURE__*/react.createElement("div", {
    style: {
      padding: '20px',
      backgroundColor: '#000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }, /*#__PURE__*/react.createElement("img", {
    src: previewPopupImage,
    alt: `Frame ${previewPopupFrameIndex + 1} Preview`,
    style: {
      maxWidth: '100%',
      maxHeight: '70vh',
      objectFit: 'contain',
      display: 'block'
    }
  })))));
};
/* harmony default export */ const components_RedactionPanel = (RedactionPanel);
;// CONCATENATED MODULE: ../../../../../../../plugins/ohifv3/extensions/image-redactor/src/getPanelModule.tsx
/*
OHIF Image Redactor Extension Copyright (2025) Databricks, Inc.
Author: Emanuele Rinaldi <emanuele.rinaldi@databricks.com>

This library (the "Software") may not be used except in connection with the Licensee's use of the Databricks Platform Services pursuant to an Agreement (defined below) between Licensee (defined below) and Databricks, Inc. ("Databricks"). The Object Code version of the Software shall be deemed part of the Downloadable Services under the Agreement, or if the Agreement does not define Downloadable Services, Subscription Services, or if neither are defined then the term in such Agreement that refers to the applicable Databricks Platform Services (as defined below) shall be substituted herein for "Downloadable Services." Licensee's use of the Software must comply at all times with any restrictions applicable to the Downlodable Services and Subscription Services, generally, and must be used in accordance with any applicable documentation. For the avoidance of doubt, the Software constitutes Databricks Confidential Information under the Agreement. Additionally, and notwithstanding anything in the Agreement to the contrary:
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
* you may view, make limited copies of, and may compile the Source Code version of the Software into an Object Code version of the Software. For the avoidance of doubt, you may not make derivative works of Software (or make any any changes to the Source Code version of the unless you have agreed to separate terms with Databricks permitting such modifications (e.g., a contribution license agreement)).
If you have not agreed to an Agreement or otherwise do not agree to these terms, you may not use the Software or view, copy or compile the Source Code of the Software. This license terminates automatically upon the termination of the Agreement or Licensee's breach of these terms. Additionally, Databricks may terminate this license at any time on notice. Upon termination, you must permanently delete the Software and all copies thereof (including the Source Code).
*/



function getPanelModule({
  commandsManager,
  extensionManager,
  servicesManager
}) {
  const WrappedRedactionPanel = () => {
    return /*#__PURE__*/react.createElement(components_RedactionPanel, {
      commandsManager: commandsManager,
      servicesManager: servicesManager,
      extensionManager: extensionManager
    });
  };
  return [{
    name: 'redactionPanel',
    iconName: 'icon-tool-rectangle',
    iconLabel: 'Redactor',
    label: 'Image Redactor',
    secondaryLabel: 'Image Redactor',
    component: WrappedRedactionPanel
  }];
}
/* harmony default export */ const src_getPanelModule = (getPanelModule);
;// CONCATENATED MODULE: ../../../../../../../plugins/ohifv3/extensions/image-redactor/src/getCommandsModule.ts
/*
OHIF Image Redactor Extension Copyright (2025) Databricks, Inc.
Author: Emanuele Rinaldi <emanuele.rinaldi@databricks.com>

This library (the "Software") may not be used except in connection with the Licensee's use of the Databricks Platform Services pursuant to an Agreement (defined below) between Licensee (defined below) and Databricks, Inc. ("Databricks"). The Object Code version of the Software shall be deemed part of the Downloadable Services under the Agreement, or if the Agreement does not define Downloadable Services, Subscription Services, or if neither are defined then the term in such Agreement that refers to the applicable Databricks Platform Services (as defined below) shall be substituted herein for "Downloadable Services." Licensee's use of the Software must comply at all times with any restrictions applicable to the Downlodable Services and Subscription Services, generally, and must be used in accordance with any applicable documentation. For the avoidance of doubt, the Software constitutes Databricks Confidential Information under the Agreement. Additionally, and notwithstanding anything in the Agreement to the contrary:
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
* you may view, make limited copies of, and may compile the Source Code version of the Software into an Object Code version of the Software. For the avoidance of doubt, you may not make derivative works of Software (or make any any changes to the Source Code version of the unless you have agreed to separate terms with Databricks permitting such modifications (e.g., a contribution license agreement)).
If you have not agreed to an Agreement or otherwise do not agree to these terms, you may not use the Software or view, copy or compile the Source Code of the Software. This license terminates automatically upon the termination of the Agreement or Licensee's breach of these terms. Additionally, Databricks may terminate this license at any time on notice. Upon termination, you must permanently delete the Software and all copies thereof (including the Source Code).
*/


function getCommandsModule({
  servicesManager
}) {
  const {
    viewportGridService,
    cornerstoneViewportService
  } = servicesManager.services;
  const actions = {
    activateRedactionTool: () => {
      const {
        activeViewportId
      } = viewportGridService.getState();
      const viewport = cornerstoneViewportService.getCornerstoneViewport(activeViewportId);
      if (viewport) {
        const toolGroupId = viewport.viewportOptions?.toolGroupId || 'default';
        servicesManager.services.toolGroupService.setToolActive(toolGroupId, 'RedactionRectangle', {
          bindings: [{
            mouseButton: 1
          }]
        });
      }
    },
    deactivateRedactionTool: () => {
      const {
        activeViewportId
      } = viewportGridService.getState();
      const viewport = cornerstoneViewportService.getCornerstoneViewport(activeViewportId);
      if (viewport) {
        const toolGroupId = viewport.viewportOptions?.toolGroupId || 'default';
        servicesManager.services.toolGroupService.setToolPassive(toolGroupId, 'RedactionRectangle');
      }
    },
    applyRedaction: async () => {
      const {
        activeViewportId
      } = viewportGridService.getState();
      const viewport = cornerstoneViewportService.getCornerstoneViewport(activeViewportId);
      if (viewport && viewport.element) {
        const areas = services_RedactionService.getRedactionAreas(activeViewportId, viewport.element);
        return await services_RedactionService.applyRedaction(activeViewportId, viewport, areas);
      }
      return {
        success: false,
        error: 'No active viewport found'
      };
    },
    clearRedactionAreas: () => {
      const {
        activeViewportId
      } = viewportGridService.getState();
      const viewport = cornerstoneViewportService.getCornerstoneViewport(activeViewportId);
      if (viewport && viewport.element) {
        services_RedactionService.clearRedactionAreas(activeViewportId, viewport.element);
      }
    },
    exportRedactedImage: async () => {
      const {
        activeViewportId
      } = viewportGridService.getState();
      const viewport = cornerstoneViewportService.getCornerstoneViewport(activeViewportId);
      if (viewport) {
        return await services_RedactionService.exportRedactedImage(activeViewportId, viewport);
      }
      return {
        success: false,
        error: 'No active viewport found'
      };
    }
  };
  const definitions = {
    activateRedactionTool: {
      commandFn: actions.activateRedactionTool,
      storeContexts: [],
      options: {}
    },
    deactivateRedactionTool: {
      commandFn: actions.deactivateRedactionTool,
      storeContexts: [],
      options: {}
    },
    applyRedaction: {
      commandFn: actions.applyRedaction,
      storeContexts: [],
      options: {}
    },
    clearRedactionAreas: {
      commandFn: actions.clearRedactionAreas,
      storeContexts: [],
      options: {}
    },
    exportRedactedImage: {
      commandFn: actions.exportRedactedImage,
      storeContexts: [],
      options: {}
    }
  };
  return {
    actions,
    definitions,
    defaultContext: 'ACTIVE_VIEWPORT::CORNERSTONE'
  };
}
;// CONCATENATED MODULE: ../../../../../../../plugins/ohifv3/extensions/image-redactor/src/init.ts
/*
OHIF Image Redactor Extension Copyright (2025) Databricks, Inc.
Author: Emanuele Rinaldi <emanuele.rinaldi@databricks.com>

This library (the "Software") may not be used except in connection with the Licensee's use of the Databricks Platform Services pursuant to an Agreement (defined below) between Licensee (defined below) and Databricks, Inc. ("Databricks"). The Object Code version of the Software shall be deemed part of the Downloadable Services under the Agreement, or if the Agreement does not define Downloadable Services, Subscription Services, or if neither are defined then the term in such Agreement that refers to the applicable Databricks Platform Services (as defined below) shall be substituted herein for "Downloadable Services." Licensee's use of the Software must comply at all times with any restrictions applicable to the Downlodable Services and Subscription Services, generally, and must be used in accordance with any applicable documentation. For the avoidance of doubt, the Software constitutes Databricks Confidential Information under the Agreement. Additionally, and notwithstanding anything in the Agreement to the contrary:
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
* you may view, make limited copies of, and may compile the Source Code version of the Software into an Object Code version of the Software. For the avoidance of doubt, you may not make derivative works of Software (or make any any changes to the Source Code version of the unless you have agreed to separate terms with Databricks permitting such modifications (e.g., a contribution license agreement)).
If you have not agreed to an Agreement or otherwise do not agree to these terms, you may not use the Software or view, copy or compile the Source Code of the Software. This license terminates automatically upon the termination of the Agreement or Licensee's breach of these terms. Additionally, Databricks may terminate this license at any time on notice. Upon termination, you must permanently delete the Software and all copies thereof (including the Source Code).
*/




/**
 * @param {object} configuration
 */
function init({
  servicesManager,
  configuration = {}
}) {
  (0,dist_esm.addTool)(RedactionRectangleTool);
}
;// CONCATENATED MODULE: ../../../../../../../plugins/ohifv3/extensions/image-redactor/src/index.tsx
/*
OHIF Image Redactor Extension Copyright (2025) Databricks, Inc.
Author: Emanuele Rinaldi <emanuele.rinaldi@databricks.com>

This library (the "Software") may not be used except in connection with the Licensee's use of the Databricks Platform Services pursuant to an Agreement (defined below) between Licensee (defined below) and Databricks, Inc. ("Databricks"). The Object Code version of the Software shall be deemed part of the Downloadable Services under the Agreement, or if the Agreement does not define Downloadable Services, Subscription Services, or if neither are defined then the term in such Agreement that refers to the applicable Databricks Platform Services (as defined below) shall be substituted herein for "Downloadable Services." Licensee's use of the Software must comply at all times with any restrictions applicable to the Downlodable Services and Subscription Services, generally, and must be used in accordance with any applicable documentation. For the avoidance of doubt, the Software constitutes Databricks Confidential Information under the Agreement. Additionally, and notwithstanding anything in the Agreement to the contrary:
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
* you may view, make limited copies of, and may compile the Source Code version of the Software into an Object Code version of the Software. For the avoidance of doubt, you may not make derivative works of Software (or make any any changes to the Source Code version of the unless you have agreed to separate terms with Databricks permitting such modifications (e.g., a contribution license agreement)).
If you have not agreed to an Agreement or otherwise do not agree to these terms, you may not use the Software or view, copy or compile the Source Code of the Software. This license terminates automatically upon the termination of the Agreement or Licensee's breach of these terms. Additionally, Databricks may terminate this license at any time on notice. Upon termination, you must permanently delete the Software and all copies thereof (including the Source Code).
*/





/* harmony default export */ const src = ({
  id: id,
  preRegistration: init,
  getPanelModule: src_getPanelModule,
  getCommandsModule: getCommandsModule
});

/***/ })

}]);