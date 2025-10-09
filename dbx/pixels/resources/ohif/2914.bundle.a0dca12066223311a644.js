"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[2914],{

/***/ 97181:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _getHash(annotationUID, drawingElementType, nodeUID) {
    return `${annotationUID}::${drawingElementType}::${nodeUID}`;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_getHash);


/***/ }),

/***/ 76910:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(99737);

const getMouseModifierKey = (evt) => {
    if (evt.shiftKey) {
        if (evt.ctrlKey) {
            return _enums__WEBPACK_IMPORTED_MODULE_0__.KeyboardBindings.ShiftCtrl;
        }
        if (evt.altKey) {
            return _enums__WEBPACK_IMPORTED_MODULE_0__.KeyboardBindings.ShiftAlt;
        }
        if (evt.metaKey) {
            return _enums__WEBPACK_IMPORTED_MODULE_0__.KeyboardBindings.ShiftMeta;
        }
        return _enums__WEBPACK_IMPORTED_MODULE_0__.KeyboardBindings.Shift;
    }
    if (evt.ctrlKey) {
        if (evt.altKey) {
            return _enums__WEBPACK_IMPORTED_MODULE_0__.KeyboardBindings.CtrlAlt;
        }
        if (evt.metaKey) {
            return _enums__WEBPACK_IMPORTED_MODULE_0__.KeyboardBindings.CtrlMeta;
        }
        return _enums__WEBPACK_IMPORTED_MODULE_0__.KeyboardBindings.Ctrl;
    }
    if (evt.altKey) {
        return (evt.metaKey && _enums__WEBPACK_IMPORTED_MODULE_0__.KeyboardBindings.AltMeta) || _enums__WEBPACK_IMPORTED_MODULE_0__.KeyboardBindings.Alt;
    }
    if (evt.metaKey) {
        return _enums__WEBPACK_IMPORTED_MODULE_0__.KeyboardBindings.Meta;
    }
    return undefined;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getMouseModifierKey);


/***/ }),

/***/ 97:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  c: () => (/* binding */ resetAnnotationManager)
});

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/utilities/defineProperties.js
const checkAndDefineTextBoxProperty = (annotation) => {
    if (!annotation.data) {
        annotation.data = {};
    }
    if (!annotation.data.handles) {
        annotation.data.handles = {};
    }
    if (!annotation.data.handles.textBox) {
        annotation.data.handles.textBox = {};
    }
    return annotation;
};
const checkAndDefineCachedStatsProperty = (annotation) => {
    if (!annotation.data) {
        annotation.data = {};
    }
    if (!annotation.data.cachedStats) {
        annotation.data.cachedStats = {};
    }
    return annotation;
};


// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/annotationLocking.js
var annotationLocking = __webpack_require__(2076);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/annotationVisibility.js
var annotationVisibility = __webpack_require__(29601);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/FrameOfReferenceSpecificAnnotationManager.js
var FrameOfReferenceSpecificAnnotationManager = __webpack_require__(67013);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/annotationState.js
var annotationState = __webpack_require__(82056);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/resetAnnotationManager.js





const defaultManager = FrameOfReferenceSpecificAnnotationManager/* defaultFrameOfReferenceSpecificAnnotationManager */.H;
const preprocessingFn = (annotation) => {
    annotation = checkAndDefineTextBoxProperty(annotation);
    annotation = checkAndDefineCachedStatsProperty(annotation);
    const uid = annotation.annotationUID;
    const isLocked = (0,annotationLocking.checkAndSetAnnotationLocked)(uid);
    annotation.isLocked = isLocked;
    const isVisible = (0,annotationVisibility.checkAndSetAnnotationVisibility)(uid);
    annotation.isVisible = isVisible;
    return annotation;
};
defaultManager.setPreprocessingFn(preprocessingFn);
(0,annotationState.setAnnotationManager)(defaultManager);
function resetAnnotationManager() {
    (0,annotationState.setAnnotationManager)(defaultManager);
}


/***/ }),

/***/ 75419:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   R: () => (/* binding */ triggerSegmentationAdded)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(99737);


function triggerSegmentationAdded(segmentationId) {
    const eventDetail = {
        segmentationId,
    };
    (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.triggerEvent)(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.eventTarget, _enums__WEBPACK_IMPORTED_MODULE_1__.Events.SEGMENTATION_ADDED, eventDetail);
}


/***/ }),

/***/ 9726:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   G: () => (/* binding */ triggerSegmentationModified)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(99737);


function triggerSegmentationModified(segmentationId) {
    const eventDetail = {
        segmentationId,
    };
    (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.triggerEvent)(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.eventTarget, _enums__WEBPACK_IMPORTED_MODULE_1__.Events.SEGMENTATION_MODIFIED, eventDetail);
}


/***/ }),

/***/ 1485:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   B: () => (/* binding */ triggerSegmentationRemoved)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(99737);


function triggerSegmentationRemoved(segmentationId) {
    const eventDetail = {
        segmentationId,
    };
    (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.triggerEvent)(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.eventTarget, _enums__WEBPACK_IMPORTED_MODULE_1__.Events.SEGMENTATION_REMOVED, eventDetail);
}


/***/ }),

/***/ 44951:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   r: () => (/* binding */ triggerSegmentationRepresentationModified)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(99737);


function triggerSegmentationRepresentationModified(viewportId, segmentationId, type) {
    const eventDetail = {
        segmentationId,
        type,
        viewportId,
    };
    (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.triggerEvent)(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.eventTarget, _enums__WEBPACK_IMPORTED_MODULE_1__.Events.SEGMENTATION_REPRESENTATION_MODIFIED, eventDetail);
}


/***/ }),

/***/ 65290:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   O: () => (/* binding */ triggerSegmentationRepresentationRemoved)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(99737);


function triggerSegmentationRepresentationRemoved(viewportId, segmentationId, type) {
    const eventDetail = {
        viewportId,
        segmentationId,
        type,
    };
    (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.triggerEvent)(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.eventTarget, _enums__WEBPACK_IMPORTED_MODULE_1__.Events.SEGMENTATION_REPRESENTATION_REMOVED, eventDetail);
}


/***/ }),

/***/ 47098:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   s: () => (/* binding */ internalGetHiddenSegmentIndices)
/* harmony export */ });
/* harmony import */ var _getSegmentationRepresentation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(93210);

function internalGetHiddenSegmentIndices(viewportId, specifier) {
    const representation = (0,_getSegmentationRepresentation__WEBPACK_IMPORTED_MODULE_0__/* .getSegmentationRepresentation */ .Ut)(viewportId, specifier);
    if (!representation) {
        return new Set();
    }
    const segmentsHidden = Object.entries(representation.segments).reduce((acc, [segmentIndex, segment]) => {
        if (!segment.visible) {
            acc.add(Number(segmentIndex));
        }
        return acc;
    }, new Set());
    return segmentsHidden;
}


/***/ }),

/***/ 9711:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(99737);
/* harmony import */ var _utilities_segmentation_validateLabelmap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(21345);


function validateSegmentationInput(segmentationInputArray) {
    if (!segmentationInputArray || segmentationInputArray.length === 0) {
        throw new Error('The segmentationInputArray is undefined or an empty array');
    }
    segmentationInputArray.forEach((segmentationInput) => {
        if (segmentationInput.segmentationId === undefined) {
            throw new Error('Undefined segmentationInput.segmentationId. Please provide a valid segmentationId');
        }
        if (segmentationInput.representation === undefined) {
            throw new Error('Undefined segmentationInput.representation. Please provide a valid representation');
        }
        if (segmentationInput.representation.type ===
            Enums.SegmentationRepresentations.Labelmap) {
            validatePublicLabelmap(segmentationInput);
        }
    });
}
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (validateSegmentationInput)));


/***/ }),

/***/ 88029:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(85204);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(99737);


const MODES = [_enums__WEBPACK_IMPORTED_MODULE_1__.ToolModes.Active, _enums__WEBPACK_IMPORTED_MODULE_1__.ToolModes.Passive, _enums__WEBPACK_IMPORTED_MODULE_1__.ToolModes.Enabled];
function getToolGroupsWithToolName(toolName) {
    return _state__WEBPACK_IMPORTED_MODULE_0__/* .state */ .wk.toolGroups.filter(({ toolOptions }) => {
        const toolGroupToolNames = Object.keys(toolOptions);
        for (let i = 0; i < toolGroupToolNames.length; i++) {
            if (toolName !== toolGroupToolNames[i]) {
                continue;
            }
            if (!toolOptions[toolName]) {
                continue;
            }
            if (MODES.includes(toolOptions[toolName].mode)) {
                return true;
            }
        }
        return false;
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getToolGroupsWithToolName);


/***/ }),

/***/ 57999:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15327);
/* harmony import */ var _store_state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(85204);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(99737);
/* harmony import */ var _cursors_elementCursor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7001);
/* harmony import */ var _utilities_math__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(95527);
/* harmony import */ var _types_ContourAnnotation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(93126);
/* harmony import */ var _utilities_planarFreehandROITool_smoothPoints__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(42797);
/* harmony import */ var _utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(58640);
/* harmony import */ var _utilities_contours_updateContourPolyline__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(72967);
/* harmony import */ var _stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(44049);











const { getSubPixelSpacingAndXYDirections, addCanvasPointsToArray, getArea } = _utilities_math__WEBPACK_IMPORTED_MODULE_5__.polyline;
function activateClosedContourEdit(evt, annotation, viewportIdsToRender) {
    this.isEditingClosed = true;
    const eventDetail = evt.detail;
    const { currentPoints, element } = eventDetail;
    const canvasPos = currentPoints.canvas;
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElement)(element);
    if (!enabledElement) {
        return;
    }
    const { viewport } = enabledElement;
    const prevCanvasPoints = annotation.data.contour.polyline.map(viewport.worldToCanvas);
    const { spacing, xDir, yDir } = getSubPixelSpacingAndXYDirections(viewport, this.configuration.subPixelResolution);
    this.editData = {
        prevCanvasPoints,
        editCanvasPoints: [canvasPos],
        startCrossingIndex: undefined,
        editIndex: 0,
        annotation,
    };
    this.commonData = {
        annotation,
        viewportIdsToRender,
        spacing,
        xDir,
        yDir,
        movingTextBox: false,
    };
    _store_state__WEBPACK_IMPORTED_MODULE_2__/* .state */ .wk.isInteractingWithTool = true;
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.MOUSE_UP, this.mouseUpClosedContourEditCallback);
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.MOUSE_DRAG, this.mouseDragClosedContourEditCallback);
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.MOUSE_CLICK, this.mouseUpClosedContourEditCallback);
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.TOUCH_END, this.mouseUpClosedContourEditCallback);
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.TOUCH_DRAG, this.mouseDragClosedContourEditCallback);
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.TOUCH_TAP, this.mouseUpClosedContourEditCallback);
    (0,_cursors_elementCursor__WEBPACK_IMPORTED_MODULE_4__.hideElementCursor)(element);
}
function deactivateClosedContourEdit(element) {
    _store_state__WEBPACK_IMPORTED_MODULE_2__/* .state */ .wk.isInteractingWithTool = false;
    element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.MOUSE_UP, this.mouseUpClosedContourEditCallback);
    element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.MOUSE_DRAG, this.mouseDragClosedContourEditCallback);
    element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.MOUSE_CLICK, this.mouseUpClosedContourEditCallback);
    element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.TOUCH_END, this.mouseUpClosedContourEditCallback);
    element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.TOUCH_DRAG, this.mouseDragClosedContourEditCallback);
    element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.TOUCH_TAP, this.mouseUpClosedContourEditCallback);
    (0,_cursors_elementCursor__WEBPACK_IMPORTED_MODULE_4__.resetElementCursor)(element);
}
function mouseDragClosedContourEditCallback(evt) {
    const eventDetail = evt.detail;
    const { currentPoints, element } = eventDetail;
    const worldPos = currentPoints.world;
    const canvasPos = currentPoints.canvas;
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElement)(element);
    const { viewport } = enabledElement;
    const { viewportIdsToRender, xDir, yDir, spacing } = this.commonData;
    const { editIndex, editCanvasPoints, startCrossingIndex, annotation } = this.editData;
    this.createMemo(element, annotation);
    const lastCanvasPoint = editCanvasPoints[editCanvasPoints.length - 1];
    const lastWorldPoint = viewport.canvasToWorld(lastCanvasPoint);
    const worldPosDiff = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.subtract */ .eR.subtract(worldPosDiff, worldPos, lastWorldPoint);
    const xDist = Math.abs(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(worldPosDiff, xDir));
    const yDist = Math.abs(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(worldPosDiff, yDir));
    if (xDist <= spacing[0] && yDist <= spacing[1]) {
        return;
    }
    if (startCrossingIndex !== undefined) {
        this.checkAndRemoveCrossesOnEditLine(evt);
    }
    const numPointsAdded = addCanvasPointsToArray(element, editCanvasPoints, canvasPos, this.commonData);
    const currentEditIndex = editIndex + numPointsAdded;
    this.editData.editIndex = currentEditIndex;
    if (startCrossingIndex === undefined && editCanvasPoints.length > 1) {
        this.checkForFirstCrossing(evt, true);
    }
    this.editData.snapIndex = this.findSnapIndex();
    if (this.editData.snapIndex === -1) {
        this.finishEditAndStartNewEdit(evt);
        return;
    }
    this.editData.fusedCanvasPoints = this.fuseEditPointsWithClosedContour(evt);
    if (startCrossingIndex !== undefined &&
        this.checkForSecondCrossing(evt, true)) {
        this.removePointsAfterSecondCrossing(true);
        this.finishEditAndStartNewEdit(evt);
    }
    (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .A)(viewportIdsToRender);
}
function finishEditAndStartNewEdit(evt) {
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElement)(element);
    const { viewport, renderingEngine } = enabledElement;
    const { annotation, viewportIdsToRender } = this.commonData;
    const { fusedCanvasPoints, editCanvasPoints } = this.editData;
    (0,_utilities_contours_updateContourPolyline__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .A)(annotation, {
        points: fusedCanvasPoints,
        closed: true,
        targetWindingDirection: _types_ContourAnnotation__WEBPACK_IMPORTED_MODULE_6__/* .ContourWindingDirection */ .W.Clockwise,
    }, viewport);
    if (annotation.autoGenerated) {
        annotation.autoGenerated = false;
    }
    (0,_stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_10__.triggerAnnotationModified)(annotation, element);
    const lastEditCanvasPoint = editCanvasPoints.pop();
    this.editData = {
        prevCanvasPoints: fusedCanvasPoints,
        editCanvasPoints: [lastEditCanvasPoint],
        startCrossingIndex: undefined,
        editIndex: 0,
        snapIndex: undefined,
        annotation,
    };
    (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .A)(viewportIdsToRender);
}
function fuseEditPointsWithClosedContour(evt) {
    const { prevCanvasPoints, editCanvasPoints, startCrossingIndex, snapIndex } = this.editData;
    if (startCrossingIndex === undefined || snapIndex === undefined) {
        return;
    }
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const augmentedEditCanvasPoints = [...editCanvasPoints];
    addCanvasPointsToArray(element, augmentedEditCanvasPoints, prevCanvasPoints[snapIndex], this.commonData);
    if (augmentedEditCanvasPoints.length > editCanvasPoints.length) {
        augmentedEditCanvasPoints.pop();
    }
    let lowIndex;
    let highIndex;
    if (startCrossingIndex > snapIndex) {
        lowIndex = snapIndex;
        highIndex = startCrossingIndex;
    }
    else {
        lowIndex = startCrossingIndex;
        highIndex = snapIndex;
    }
    const distanceBetweenLowAndFirstPoint = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.distance */ .Zc.distance(prevCanvasPoints[lowIndex], augmentedEditCanvasPoints[0]);
    const distanceBetweenLowAndLastPoint = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.distance */ .Zc.distance(prevCanvasPoints[lowIndex], augmentedEditCanvasPoints[augmentedEditCanvasPoints.length - 1]);
    const distanceBetweenHighAndFirstPoint = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.distance */ .Zc.distance(prevCanvasPoints[highIndex], augmentedEditCanvasPoints[0]);
    const distanceBetweenHighAndLastPoint = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.distance */ .Zc.distance(prevCanvasPoints[highIndex], augmentedEditCanvasPoints[augmentedEditCanvasPoints.length - 1]);
    const pointSet1 = [];
    for (let i = 0; i < lowIndex; i++) {
        const canvasPoint = prevCanvasPoints[i];
        pointSet1.push([canvasPoint[0], canvasPoint[1]]);
    }
    let inPlaceDistance = distanceBetweenLowAndFirstPoint + distanceBetweenHighAndLastPoint;
    let reverseDistance = distanceBetweenLowAndLastPoint + distanceBetweenHighAndFirstPoint;
    if (inPlaceDistance < reverseDistance) {
        for (let i = 0; i < augmentedEditCanvasPoints.length; i++) {
            const canvasPoint = augmentedEditCanvasPoints[i];
            pointSet1.push([canvasPoint[0], canvasPoint[1]]);
        }
    }
    else {
        for (let i = augmentedEditCanvasPoints.length - 1; i >= 0; i--) {
            const canvasPoint = augmentedEditCanvasPoints[i];
            pointSet1.push([canvasPoint[0], canvasPoint[1]]);
        }
    }
    for (let i = highIndex; i < prevCanvasPoints.length; i++) {
        const canvasPoint = prevCanvasPoints[i];
        pointSet1.push([canvasPoint[0], canvasPoint[1]]);
    }
    const pointSet2 = [];
    for (let i = lowIndex; i < highIndex; i++) {
        const canvasPoint = prevCanvasPoints[i];
        pointSet2.push([canvasPoint[0], canvasPoint[1]]);
    }
    inPlaceDistance =
        distanceBetweenHighAndFirstPoint + distanceBetweenLowAndLastPoint;
    reverseDistance =
        distanceBetweenHighAndLastPoint + distanceBetweenLowAndFirstPoint;
    if (inPlaceDistance < reverseDistance) {
        for (let i = 0; i < augmentedEditCanvasPoints.length; i++) {
            const canvasPoint = augmentedEditCanvasPoints[i];
            pointSet2.push([canvasPoint[0], canvasPoint[1]]);
        }
    }
    else {
        for (let i = augmentedEditCanvasPoints.length - 1; i >= 0; i--) {
            const canvasPoint = augmentedEditCanvasPoints[i];
            pointSet2.push([canvasPoint[0], canvasPoint[1]]);
        }
    }
    const areaPointSet1 = getArea(pointSet1);
    const areaPointSet2 = getArea(pointSet2);
    const pointsToRender = areaPointSet1 > areaPointSet2 ? pointSet1 : pointSet2;
    return pointsToRender;
}
function mouseUpClosedContourEditCallback(evt) {
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    this.completeClosedContourEdit(element);
}
function completeClosedContourEdit(element) {
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElement)(element);
    const { viewport } = enabledElement;
    const { annotation, viewportIdsToRender } = this.commonData;
    this.doneEditMemo();
    const { fusedCanvasPoints, prevCanvasPoints } = this.editData;
    if (fusedCanvasPoints) {
        const updatedPoints = (0,_utilities_planarFreehandROITool_smoothPoints__WEBPACK_IMPORTED_MODULE_7__/* .shouldSmooth */ .Q)(this.configuration, annotation)
            ? (0,_utilities_planarFreehandROITool_smoothPoints__WEBPACK_IMPORTED_MODULE_7__/* .getInterpolatedPoints */ .p)(this.configuration, fusedCanvasPoints, prevCanvasPoints)
            : fusedCanvasPoints;
        const decimateConfig = this.configuration?.decimate || {};
        (0,_utilities_contours_updateContourPolyline__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .A)(annotation, {
            points: updatedPoints,
            closed: true,
            targetWindingDirection: _types_ContourAnnotation__WEBPACK_IMPORTED_MODULE_6__/* .ContourWindingDirection */ .W.Clockwise,
        }, viewport, {
            decimate: {
                enabled: !!decimateConfig.enabled,
                epsilon: decimateConfig.epsilon,
            },
        });
        if (annotation.autoGenerated) {
            annotation.autoGenerated = false;
        }
        (0,_stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_10__.triggerAnnotationModified)(annotation, element);
    }
    this.isEditingClosed = false;
    this.editData = undefined;
    this.commonData = undefined;
    (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .A)(viewportIdsToRender);
    this.deactivateClosedContourEdit(element);
}
function cancelClosedContourEdit(element) {
    this.completeClosedContourEdit(element);
}
function registerClosedContourEditLoop(toolInstance) {
    toolInstance.activateClosedContourEdit =
        activateClosedContourEdit.bind(toolInstance);
    toolInstance.deactivateClosedContourEdit =
        deactivateClosedContourEdit.bind(toolInstance);
    toolInstance.mouseDragClosedContourEditCallback =
        mouseDragClosedContourEditCallback.bind(toolInstance);
    toolInstance.mouseUpClosedContourEditCallback =
        mouseUpClosedContourEditCallback.bind(toolInstance);
    toolInstance.finishEditAndStartNewEdit =
        finishEditAndStartNewEdit.bind(toolInstance);
    toolInstance.fuseEditPointsWithClosedContour =
        fuseEditPointsWithClosedContour.bind(toolInstance);
    toolInstance.cancelClosedContourEdit =
        cancelClosedContourEdit.bind(toolInstance);
    toolInstance.completeClosedContourEdit =
        completeClosedContourEdit.bind(toolInstance);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (registerClosedContourEditLoop);


/***/ }),

/***/ 55927:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _cursors_elementCursor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7001);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(99737);
/* harmony import */ var _store_state__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(85204);
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3823);
/* harmony import */ var _utilities_planarFreehandROITool_smoothPoints__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(42797);
/* harmony import */ var _eventDispatchers_shared_getMouseModifier__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(76910);
/* harmony import */ var _utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(58640);
/* harmony import */ var _stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(44049);
/* harmony import */ var _findOpenUShapedContourVectorToPeak__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(5403);
/* harmony import */ var _utilities_math__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(95527);
/* harmony import */ var _stateManagement_annotation_annotationState__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(82056);
/* harmony import */ var _types_ContourAnnotation__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(93126);













const { addCanvasPointsToArray, pointsAreWithinCloseContourProximity, getFirstLineSegmentIntersectionIndexes, getSubPixelSpacingAndXYDirections, } = _utilities_math__WEBPACK_IMPORTED_MODULE_10__.polyline;
function activateDraw(evt, annotation, viewportIdsToRender) {
    this.isDrawing = true;
    const eventDetail = evt.detail;
    const { currentPoints, element } = eventDetail;
    const canvasPos = currentPoints.canvas;
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
    const { viewport } = enabledElement;
    const contourHoleProcessingEnabled = (0,_eventDispatchers_shared_getMouseModifier__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A)(evt.detail.event) ===
        this.configuration.contourHoleAdditionModifierKey;
    const { spacing, xDir, yDir } = getSubPixelSpacingAndXYDirections(viewport, this.configuration.subPixelResolution) || {};
    if (!spacing || !xDir || !yDir) {
        return;
    }
    this.drawData = {
        canvasPoints: [canvasPos],
        polylineIndex: 0,
        contourHoleProcessingEnabled,
        newAnnotation: true,
    };
    this.commonData = {
        annotation,
        viewportIdsToRender,
        spacing,
        xDir,
        yDir,
        movingTextBox: false,
    };
    _store_state__WEBPACK_IMPORTED_MODULE_3__/* .state */ .wk.isInteractingWithTool = true;
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.MOUSE_UP, this.mouseUpDrawCallback);
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.MOUSE_DRAG, this.mouseDragDrawCallback);
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.MOUSE_CLICK, this.mouseUpDrawCallback);
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.TOUCH_END, this.mouseUpDrawCallback);
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.TOUCH_DRAG, this.mouseDragDrawCallback);
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.TOUCH_TAP, this.mouseUpDrawCallback);
    (0,_cursors_elementCursor__WEBPACK_IMPORTED_MODULE_1__.hideElementCursor)(element);
}
function deactivateDraw(element) {
    _store_state__WEBPACK_IMPORTED_MODULE_3__/* .state */ .wk.isInteractingWithTool = false;
    element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.MOUSE_UP, this.mouseUpDrawCallback);
    element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.MOUSE_DRAG, this.mouseDragDrawCallback);
    element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.MOUSE_CLICK, this.mouseUpDrawCallback);
    element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.TOUCH_END, this.mouseUpDrawCallback);
    element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.TOUCH_DRAG, this.mouseDragDrawCallback);
    element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.TOUCH_TAP, this.mouseUpDrawCallback);
    (0,_cursors_elementCursor__WEBPACK_IMPORTED_MODULE_1__.resetElementCursor)(element);
}
function mouseDragDrawCallback(evt) {
    const eventDetail = evt.detail;
    const { currentPoints, element } = eventDetail;
    const worldPos = currentPoints.world;
    const canvasPos = currentPoints.canvas;
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
    const { viewport } = enabledElement;
    const { annotation, viewportIdsToRender, xDir, yDir, spacing, movingTextBox, } = this.commonData;
    const { polylineIndex, canvasPoints, newAnnotation } = this.drawData;
    this.createMemo(element, annotation, { newAnnotation });
    const lastCanvasPoint = canvasPoints[canvasPoints.length - 1];
    const lastWorldPoint = viewport.canvasToWorld(lastCanvasPoint);
    const worldPosDiff = gl_matrix__WEBPACK_IMPORTED_MODULE_4__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_4__/* .vec3.subtract */ .eR.subtract(worldPosDiff, worldPos, lastWorldPoint);
    const xDist = Math.abs(gl_matrix__WEBPACK_IMPORTED_MODULE_4__/* .vec3.dot */ .eR.dot(worldPosDiff, xDir));
    const yDist = Math.abs(gl_matrix__WEBPACK_IMPORTED_MODULE_4__/* .vec3.dot */ .eR.dot(worldPosDiff, yDir));
    if (xDist <= spacing[0] && yDist <= spacing[1]) {
        return;
    }
    if (movingTextBox) {
        this.isDrawing = false;
        const { deltaPoints } = eventDetail;
        const worldPosDelta = deltaPoints.world;
        const { textBox } = annotation.data.handles;
        const { worldPosition } = textBox;
        worldPosition[0] += worldPosDelta[0];
        worldPosition[1] += worldPosDelta[1];
        worldPosition[2] += worldPosDelta[2];
        textBox.hasMoved = true;
    }
    else {
        const crossingIndex = this.findCrossingIndexDuringCreate(evt);
        if (crossingIndex !== undefined) {
            this.applyCreateOnCross(evt, crossingIndex);
        }
        else {
            const numPointsAdded = addCanvasPointsToArray(element, canvasPoints, canvasPos, this.commonData);
            this.drawData.polylineIndex = polylineIndex + numPointsAdded;
        }
        annotation.invalidated = true;
    }
    (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A)(viewportIdsToRender);
    if (annotation.invalidated) {
        (0,_stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_8__.triggerAnnotationModified)(annotation, element, _enums__WEBPACK_IMPORTED_MODULE_2__.ChangeTypes.HandlesUpdated);
    }
}
function mouseUpDrawCallback(evt) {
    const { allowOpenContours } = this.configuration;
    const { canvasPoints, contourHoleProcessingEnabled } = this.drawData;
    const firstPoint = canvasPoints[0];
    const lastPoint = canvasPoints[canvasPoints.length - 1];
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    this.doneEditMemo();
    this.drawData.newAnnotation = false;
    if (allowOpenContours &&
        !pointsAreWithinCloseContourProximity(firstPoint, lastPoint, this.configuration.closeContourProximity)) {
        this.completeDrawOpenContour(element, { contourHoleProcessingEnabled });
    }
    else {
        this.completeDrawClosedContour(element, { contourHoleProcessingEnabled });
    }
}
function completeDrawClosedContour(element, options) {
    this.removeCrossedLinesOnCompleteDraw();
    const { canvasPoints } = this.drawData;
    const { contourHoleProcessingEnabled, minPointsToSave } = options ?? {};
    if (minPointsToSave && canvasPoints.length < minPointsToSave) {
        return false;
    }
    if (this.haltDrawing(element, canvasPoints)) {
        return false;
    }
    const { annotation, viewportIdsToRender } = this.commonData;
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
    const { viewport, renderingEngine } = enabledElement;
    addCanvasPointsToArray(element, canvasPoints, canvasPoints[0], this.commonData);
    canvasPoints.pop();
    const updatedPoints = (0,_utilities_planarFreehandROITool_smoothPoints__WEBPACK_IMPORTED_MODULE_5__/* .shouldSmooth */ .Q)(this.configuration, annotation)
        ? (0,_utilities_planarFreehandROITool_smoothPoints__WEBPACK_IMPORTED_MODULE_5__/* .getInterpolatedPoints */ .p)(this.configuration, canvasPoints)
        : canvasPoints;
    this.updateContourPolyline(annotation, {
        points: updatedPoints,
        closed: true,
        targetWindingDirection: _types_ContourAnnotation__WEBPACK_IMPORTED_MODULE_12__/* .ContourWindingDirection */ .W.Clockwise,
    }, viewport);
    const { textBox } = annotation.data.handles;
    if (!textBox?.hasMoved) {
        (0,_stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_8__.triggerContourAnnotationCompleted)(annotation, contourHoleProcessingEnabled);
    }
    this.isDrawing = false;
    this.drawData = undefined;
    this.commonData = undefined;
    (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A)(viewportIdsToRender);
    this.deactivateDraw(element);
    return true;
}
function removeCrossedLinesOnCompleteDraw() {
    const { canvasPoints } = this.drawData;
    const numPoints = canvasPoints.length;
    const endToStart = [canvasPoints[0], canvasPoints[numPoints - 1]];
    const canvasPointsMinusEnds = canvasPoints.slice(0, -1).slice(1);
    const lineSegment = getFirstLineSegmentIntersectionIndexes(canvasPointsMinusEnds, endToStart[0], endToStart[1], false);
    if (lineSegment) {
        const indexToRemoveUpTo = lineSegment[1];
        if (indexToRemoveUpTo === 1) {
            this.drawData.canvasPoints = canvasPoints.splice(1);
        }
        else {
            this.drawData.canvasPoints = canvasPoints.splice(0, indexToRemoveUpTo);
        }
    }
}
function completeDrawOpenContour(element, options) {
    const { canvasPoints } = this.drawData;
    const { contourHoleProcessingEnabled } = options ?? {};
    if (this.haltDrawing(element, canvasPoints)) {
        return false;
    }
    const { annotation, viewportIdsToRender } = this.commonData;
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
    const { viewport, renderingEngine } = enabledElement;
    const updatedPoints = (0,_utilities_planarFreehandROITool_smoothPoints__WEBPACK_IMPORTED_MODULE_5__/* .shouldSmooth */ .Q)(this.configuration, annotation)
        ? (0,_utilities_planarFreehandROITool_smoothPoints__WEBPACK_IMPORTED_MODULE_5__/* .getInterpolatedPoints */ .p)(this.configuration, canvasPoints)
        : canvasPoints;
    this.updateContourPolyline(annotation, {
        points: updatedPoints,
        closed: false,
    }, viewport);
    const { textBox } = annotation.data.handles;
    const worldPoints = annotation.data.contour.polyline;
    annotation.data.handles.points = [
        worldPoints[0],
        worldPoints[worldPoints.length - 1],
    ];
    if (annotation.data.isOpenUShapeContour) {
        annotation.data.openUShapeContourVectorToPeak =
            (0,_findOpenUShapedContourVectorToPeak__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .A)(canvasPoints, viewport);
    }
    if (!textBox.hasMoved) {
        (0,_stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_8__.triggerContourAnnotationCompleted)(annotation, contourHoleProcessingEnabled);
    }
    this.isDrawing = false;
    this.drawData = undefined;
    this.commonData = undefined;
    (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A)(viewportIdsToRender);
    this.deactivateDraw(element);
    return true;
}
function findCrossingIndexDuringCreate(evt) {
    const eventDetail = evt.detail;
    const { currentPoints, lastPoints } = eventDetail;
    const canvasPos = currentPoints.canvas;
    const lastCanvasPoint = lastPoints.canvas;
    const { canvasPoints } = this.drawData;
    const pointsLessLastOne = canvasPoints.slice(0, -1);
    const lineSegment = getFirstLineSegmentIntersectionIndexes(pointsLessLastOne, canvasPos, lastCanvasPoint, false);
    if (lineSegment === undefined) {
        return;
    }
    const crossingIndex = lineSegment[0];
    return crossingIndex;
}
function applyCreateOnCross(evt, crossingIndex) {
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const { canvasPoints, contourHoleProcessingEnabled } = this.drawData;
    const { annotation, viewportIdsToRender } = this.commonData;
    addCanvasPointsToArray(element, canvasPoints, canvasPoints[crossingIndex], this.commonData);
    canvasPoints.pop();
    const remainingPoints = canvasPoints.slice(crossingIndex);
    const newArea = _utilities_math__WEBPACK_IMPORTED_MODULE_10__.polyline.getArea(remainingPoints);
    if (_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.isEqual(newArea, 0)) {
        canvasPoints.splice(crossingIndex + 1);
        return;
    }
    canvasPoints.splice(0, crossingIndex);
    const options = { contourHoleProcessingEnabled, minPointsToSave: 3 };
    if (this.completeDrawClosedContour(element, options)) {
        this.activateClosedContourEdit(evt, annotation, viewportIdsToRender);
    }
}
function cancelDrawing(element) {
    const { allowOpenContours } = this.configuration;
    const { canvasPoints, contourHoleProcessingEnabled } = this.drawData;
    const firstPoint = canvasPoints[0];
    const lastPoint = canvasPoints[canvasPoints.length - 1];
    if (allowOpenContours &&
        !pointsAreWithinCloseContourProximity(firstPoint, lastPoint, this.configuration.closeContourProximity)) {
        this.completeDrawOpenContour(element, { contourHoleProcessingEnabled });
    }
    else {
        this.completeDrawClosedContour(element, { contourHoleProcessingEnabled });
    }
}
function shouldHaltDrawing(canvasPoints, subPixelResolution) {
    const minPoints = Math.max(subPixelResolution * 3, 3);
    return canvasPoints.length < minPoints;
}
function haltDrawing(element, canvasPoints) {
    const { subPixelResolution } = this.configuration;
    if (shouldHaltDrawing(canvasPoints, subPixelResolution)) {
        const { annotation, viewportIdsToRender } = this.commonData;
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
        const { renderingEngine } = enabledElement;
        (0,_stateManagement_annotation_annotationState__WEBPACK_IMPORTED_MODULE_11__.removeAnnotation)(annotation.annotationUID);
        this.isDrawing = false;
        this.drawData = undefined;
        this.commonData = undefined;
        (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A)(viewportIdsToRender);
        this.deactivateDraw(element);
        return true;
    }
    return false;
}
function registerDrawLoop(toolInstance) {
    toolInstance.activateDraw = activateDraw.bind(toolInstance);
    toolInstance.deactivateDraw = deactivateDraw.bind(toolInstance);
    toolInstance.applyCreateOnCross = applyCreateOnCross.bind(toolInstance);
    toolInstance.findCrossingIndexDuringCreate =
        findCrossingIndexDuringCreate.bind(toolInstance);
    toolInstance.completeDrawOpenContour =
        completeDrawOpenContour.bind(toolInstance);
    toolInstance.removeCrossedLinesOnCompleteDraw =
        removeCrossedLinesOnCompleteDraw.bind(toolInstance);
    toolInstance.mouseDragDrawCallback = mouseDragDrawCallback.bind(toolInstance);
    toolInstance.mouseUpDrawCallback = mouseUpDrawCallback.bind(toolInstance);
    toolInstance.completeDrawClosedContour =
        completeDrawClosedContour.bind(toolInstance);
    toolInstance.cancelDrawing = cancelDrawing.bind(toolInstance);
    toolInstance.haltDrawing = haltDrawing.bind(toolInstance);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (registerDrawLoop);


/***/ }),

/***/ 92400:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);
/* harmony import */ var _utilities_math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(95527);


const { addCanvasPointsToArray, getFirstLineSegmentIntersectionIndexes } = _utilities_math__WEBPACK_IMPORTED_MODULE_1__.polyline;
function checkForFirstCrossing(evt, isClosedContour) {
    const eventDetail = evt.detail;
    const { element, currentPoints, lastPoints } = eventDetail;
    const canvasPos = currentPoints.canvas;
    const lastCanvasPoint = lastPoints.canvas;
    const { editCanvasPoints, prevCanvasPoints } = this.editData;
    const crossedLineSegment = getFirstLineSegmentIntersectionIndexes(prevCanvasPoints, canvasPos, lastCanvasPoint, isClosedContour);
    if (crossedLineSegment) {
        this.editData.startCrossingIndex = crossedLineSegment[0];
        this.removePointsUpUntilFirstCrossing(isClosedContour);
    }
    else if (prevCanvasPoints.length >= 2) {
        if (editCanvasPoints.length >
            this.configuration.checkCanvasEditFallbackProximity) {
            const firstEditCanvasPoint = editCanvasPoints[0];
            const distanceIndexPairs = [];
            for (let i = 0; i < prevCanvasPoints.length; i++) {
                const prevCanvasPoint = prevCanvasPoints[i];
                const distance = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.distance */ .Zc.distance(prevCanvasPoint, firstEditCanvasPoint);
                distanceIndexPairs.push({ distance, index: i });
            }
            distanceIndexPairs.sort((a, b) => a.distance - b.distance);
            const twoClosestDistanceIndexPairs = [
                distanceIndexPairs[0],
                distanceIndexPairs[1],
            ];
            const lowestIndex = Math.min(twoClosestDistanceIndexPairs[0].index, twoClosestDistanceIndexPairs[1].index);
            this.editData.startCrossingIndex = lowestIndex;
        }
        else {
            const dir = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.create */ .Zc.create();
            gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.subtract */ .Zc.subtract(dir, editCanvasPoints[1], editCanvasPoints[0]);
            gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.normalize */ .Zc.normalize(dir, dir);
            const proximity = 6;
            const extendedPoint = [
                editCanvasPoints[0][0] - dir[0] * proximity,
                editCanvasPoints[0][1] - dir[1] * proximity,
            ];
            const crossedLineSegmentFromExtendedPoint = getFirstLineSegmentIntersectionIndexes(prevCanvasPoints, extendedPoint, editCanvasPoints[0], isClosedContour);
            if (crossedLineSegmentFromExtendedPoint) {
                const pointsToPrepend = [extendedPoint];
                addCanvasPointsToArray(element, pointsToPrepend, editCanvasPoints[0], this.commonData);
                editCanvasPoints.unshift(...pointsToPrepend);
                this.removePointsUpUntilFirstCrossing(isClosedContour);
                this.editData.editIndex = editCanvasPoints.length - 1;
                this.editData.startCrossingIndex =
                    crossedLineSegmentFromExtendedPoint[0];
            }
        }
    }
}
function removePointsUpUntilFirstCrossing(isClosedContour) {
    const { editCanvasPoints, prevCanvasPoints } = this.editData;
    let numPointsToRemove = 0;
    for (let i = 0; i < editCanvasPoints.length - 1; i++) {
        const firstLine = [editCanvasPoints[i], editCanvasPoints[i + 1]];
        const didCrossLine = !!getFirstLineSegmentIntersectionIndexes(prevCanvasPoints, firstLine[0], firstLine[1], isClosedContour);
        numPointsToRemove++;
        if (didCrossLine) {
            break;
        }
    }
    editCanvasPoints.splice(0, numPointsToRemove);
    this.editData.editIndex = editCanvasPoints.length - 1;
}
function checkForSecondCrossing(evt, isClosedContour) {
    const eventDetail = evt.detail;
    const { currentPoints, lastPoints } = eventDetail;
    const canvasPos = currentPoints.canvas;
    const lastCanvasPoint = lastPoints.canvas;
    const { prevCanvasPoints } = this.editData;
    const crossedLineSegment = getFirstLineSegmentIntersectionIndexes(prevCanvasPoints, canvasPos, lastCanvasPoint, isClosedContour);
    if (!crossedLineSegment) {
        return false;
    }
    return true;
}
function removePointsAfterSecondCrossing(isClosedContour) {
    const { prevCanvasPoints, editCanvasPoints } = this.editData;
    for (let i = editCanvasPoints.length - 1; i > 0; i--) {
        const lastLine = [editCanvasPoints[i], editCanvasPoints[i - 1]];
        const didCrossLine = !!getFirstLineSegmentIntersectionIndexes(prevCanvasPoints, lastLine[0], lastLine[1], isClosedContour);
        editCanvasPoints.pop();
        if (didCrossLine) {
            break;
        }
    }
}
function findSnapIndex() {
    const { editCanvasPoints, prevCanvasPoints, startCrossingIndex } = this.editData;
    if (startCrossingIndex === undefined) {
        return;
    }
    const lastEditCanvasPoint = editCanvasPoints[editCanvasPoints.length - 1];
    const distanceIndexPairs = [];
    for (let i = 0; i < prevCanvasPoints.length; i++) {
        const prevCanvasPoint = prevCanvasPoints[i];
        const distance = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.distance */ .Zc.distance(prevCanvasPoint, lastEditCanvasPoint);
        distanceIndexPairs.push({ distance, index: i });
    }
    distanceIndexPairs.sort((a, b) => a.distance - b.distance);
    const editCanvasPointsLessLastOne = editCanvasPoints.slice(0, -1);
    for (let i = 0; i < distanceIndexPairs.length; i++) {
        const { index } = distanceIndexPairs[i];
        const snapCanvasPosition = prevCanvasPoints[index];
        const lastEditCanvasPoint = editCanvasPoints[editCanvasPoints.length - 1];
        const crossedLineSegment = getFirstLineSegmentIntersectionIndexes(editCanvasPointsLessLastOne, snapCanvasPosition, lastEditCanvasPoint, false);
        if (!crossedLineSegment) {
            return index;
        }
    }
    return -1;
}
function checkAndRemoveCrossesOnEditLine(evt) {
    const eventDetail = evt.detail;
    const { currentPoints, lastPoints } = eventDetail;
    const canvasPos = currentPoints.canvas;
    const lastCanvasPoint = lastPoints.canvas;
    const { editCanvasPoints } = this.editData;
    const editCanvasPointsLessLastOne = editCanvasPoints.slice(0, -2);
    const crossedLineSegment = getFirstLineSegmentIntersectionIndexes(editCanvasPointsLessLastOne, canvasPos, lastCanvasPoint, false);
    if (!crossedLineSegment) {
        return;
    }
    const editIndexCrossed = crossedLineSegment[0];
    const numPointsToRemove = editCanvasPoints.length - editIndexCrossed;
    for (let i = 0; i < numPointsToRemove; i++) {
        editCanvasPoints.pop();
    }
}
function registerEditLoopCommon(toolInstance) {
    toolInstance.checkForFirstCrossing = checkForFirstCrossing.bind(toolInstance);
    toolInstance.removePointsUpUntilFirstCrossing =
        removePointsUpUntilFirstCrossing.bind(toolInstance);
    toolInstance.checkForSecondCrossing =
        checkForSecondCrossing.bind(toolInstance);
    toolInstance.findSnapIndex = findSnapIndex.bind(toolInstance);
    toolInstance.removePointsAfterSecondCrossing =
        removePointsAfterSecondCrossing.bind(toolInstance);
    toolInstance.checkAndRemoveCrossesOnEditLine =
        checkAndRemoveCrossesOnEditLine.bind(toolInstance);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (registerEditLoopCommon);


/***/ }),

/***/ 5403:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ findOpenUShapedContourVectorToPeak),
/* harmony export */   h: () => (/* binding */ findOpenUShapedContourVectorToPeakOnRender)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);

function findOpenUShapedContourVectorToPeak(canvasPoints, viewport) {
    const first = canvasPoints[0];
    const last = canvasPoints[canvasPoints.length - 1];
    const firstToLastUnitVector = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.create */ .Zc.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.set */ .Zc.set(firstToLastUnitVector, last[0] - first[0], last[1] - first[1]);
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.normalize */ .Zc.normalize(firstToLastUnitVector, firstToLastUnitVector);
    const normalVector1 = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.create */ .Zc.create();
    const normalVector2 = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.create */ .Zc.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.set */ .Zc.set(normalVector1, -firstToLastUnitVector[1], firstToLastUnitVector[0]);
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.set */ .Zc.set(normalVector2, firstToLastUnitVector[1], -firstToLastUnitVector[0]);
    const centerOfFirstToLast = [
        (first[0] + last[0]) / 2,
        (first[1] + last[1]) / 2,
    ];
    const furthest = {
        dist: 0,
        index: null,
    };
    for (let i = 0; i < canvasPoints.length; i++) {
        const canvasPoint = canvasPoints[i];
        const distance = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.dist */ .Zc.dist(canvasPoint, centerOfFirstToLast);
        if (distance > furthest.dist) {
            furthest.dist = distance;
            furthest.index = i;
        }
    }
    const toFurthest = [
        canvasPoints[furthest.index],
        centerOfFirstToLast,
    ];
    const toFurthestWorld = toFurthest.map(viewport.canvasToWorld);
    return toFurthestWorld;
}
function findOpenUShapedContourVectorToPeakOnRender(enabledElement, annotation) {
    const { viewport } = enabledElement;
    const canvasPoints = annotation.data.contour.polyline.map(viewport.worldToCanvas);
    return findOpenUShapedContourVectorToPeak(canvasPoints, viewport);
}


/***/ }),

/***/ 69855:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15327);
/* harmony import */ var _store_state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(85204);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(99737);
/* harmony import */ var _cursors_elementCursor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7001);
/* harmony import */ var _utilities_math__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(95527);
/* harmony import */ var _utilities_planarFreehandROITool_smoothPoints__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(42797);
/* harmony import */ var _utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(58640);
/* harmony import */ var _utilities_contours_updateContourPolyline__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(72967);
/* harmony import */ var _findOpenUShapedContourVectorToPeak__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(5403);
/* harmony import */ var _stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(44049);











const { addCanvasPointsToArray, getSubPixelSpacingAndXYDirections } = _utilities_math__WEBPACK_IMPORTED_MODULE_5__.polyline;
function activateOpenContourEdit(evt, annotation, viewportIdsToRender) {
    this.isEditingOpen = true;
    const eventDetail = evt.detail;
    const { currentPoints, element } = eventDetail;
    const canvasPos = currentPoints.canvas;
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElement)(element);
    const { viewport } = enabledElement;
    this.doneEditMemo();
    const prevCanvasPoints = annotation.data.contour.polyline.map(viewport.worldToCanvas);
    const { spacing, xDir, yDir } = getSubPixelSpacingAndXYDirections(viewport, this.configuration.subPixelResolution);
    this.editData = {
        prevCanvasPoints,
        editCanvasPoints: [canvasPos],
        startCrossingIndex: undefined,
        editIndex: 0,
    };
    this.commonData = {
        annotation,
        viewportIdsToRender,
        spacing,
        xDir,
        yDir,
        movingTextBox: false,
    };
    _store_state__WEBPACK_IMPORTED_MODULE_2__/* .state */ .wk.isInteractingWithTool = true;
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.MOUSE_UP, this.mouseUpOpenContourEditCallback);
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.MOUSE_DRAG, this.mouseDragOpenContourEditCallback);
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.MOUSE_CLICK, this.mouseUpOpenContourEditCallback);
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.TOUCH_END, this.mouseUpOpenContourEditCallback);
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.TOUCH_DRAG, this.mouseDragOpenContourEditCallback);
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.TOUCH_TAP, this.mouseUpOpenContourEditCallback);
    (0,_cursors_elementCursor__WEBPACK_IMPORTED_MODULE_4__.hideElementCursor)(element);
}
function deactivateOpenContourEdit(element) {
    _store_state__WEBPACK_IMPORTED_MODULE_2__/* .state */ .wk.isInteractingWithTool = false;
    element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.MOUSE_UP, this.mouseUpOpenContourEditCallback);
    element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.MOUSE_DRAG, this.mouseDragOpenContourEditCallback);
    element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.MOUSE_CLICK, this.mouseUpOpenContourEditCallback);
    element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.TOUCH_END, this.mouseUpOpenContourEditCallback);
    element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.TOUCH_DRAG, this.mouseDragOpenContourEditCallback);
    element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_3__.Events.TOUCH_TAP, this.mouseUpOpenContourEditCallback);
    (0,_cursors_elementCursor__WEBPACK_IMPORTED_MODULE_4__.resetElementCursor)(element);
}
function mouseDragOpenContourEditCallback(evt) {
    const eventDetail = evt.detail;
    const { currentPoints, element } = eventDetail;
    const worldPos = currentPoints.world;
    const canvasPos = currentPoints.canvas;
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElement)(element);
    const { viewport } = enabledElement;
    const { viewportIdsToRender, xDir, yDir, spacing } = this.commonData;
    const { editIndex, editCanvasPoints, startCrossingIndex } = this.editData;
    const lastCanvasPoint = editCanvasPoints[editCanvasPoints.length - 1];
    const lastWorldPoint = viewport.canvasToWorld(lastCanvasPoint);
    const worldPosDiff = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
    this.createMemo(element, this.commonData.annotation);
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.subtract */ .eR.subtract(worldPosDiff, worldPos, lastWorldPoint);
    const xDist = Math.abs(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(worldPosDiff, xDir));
    const yDist = Math.abs(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(worldPosDiff, yDir));
    if (xDist <= spacing[0] && yDist <= spacing[1]) {
        return;
    }
    if (startCrossingIndex !== undefined) {
        this.checkAndRemoveCrossesOnEditLine(evt);
    }
    const numPointsAdded = addCanvasPointsToArray(element, editCanvasPoints, canvasPos, this.commonData);
    const currentEditIndex = editIndex + numPointsAdded;
    this.editData.editIndex = currentEditIndex;
    if (startCrossingIndex === undefined && editCanvasPoints.length > 1) {
        this.checkForFirstCrossing(evt, false);
    }
    this.editData.snapIndex = this.findSnapIndex();
    this.editData.fusedCanvasPoints = this.fuseEditPointsWithOpenContour(evt);
    if (startCrossingIndex !== undefined &&
        this.checkForSecondCrossing(evt, false)) {
        this.removePointsAfterSecondCrossing(false);
        this.finishEditOpenOnSecondCrossing(evt);
    }
    else if (this.checkIfShouldOverwriteAnEnd(evt)) {
        this.openContourEditOverwriteEnd(evt);
    }
    (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A)(viewportIdsToRender);
}
function openContourEditOverwriteEnd(evt) {
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElement)(element);
    const { viewport } = enabledElement;
    const { annotation, viewportIdsToRender } = this.commonData;
    const fusedCanvasPoints = this.fuseEditPointsForOpenContourEndEdit();
    (0,_utilities_contours_updateContourPolyline__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .A)(annotation, {
        points: fusedCanvasPoints,
        closed: false,
    }, viewport);
    const worldPoints = annotation.data.contour.polyline;
    annotation.data.handles.points = [
        worldPoints[0],
        worldPoints[worldPoints.length - 1],
    ];
    annotation.data.handles.activeHandleIndex = 1;
    (0,_stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_10__.triggerAnnotationModified)(annotation, element);
    this.isEditingOpen = false;
    this.editData = undefined;
    this.commonData = undefined;
    this.doneEditMemo();
    this.deactivateOpenContourEdit(element);
    this.activateOpenContourEndEdit(evt, annotation, viewportIdsToRender, null);
}
function checkIfShouldOverwriteAnEnd(evt) {
    const eventDetail = evt.detail;
    const { currentPoints, lastPoints } = eventDetail;
    const canvasPos = currentPoints.canvas;
    const lastCanvasPos = lastPoints.canvas;
    const { snapIndex, prevCanvasPoints, startCrossingIndex } = this.editData;
    if (startCrossingIndex === undefined || snapIndex === undefined) {
        return false;
    }
    if (snapIndex === -1) {
        return true;
    }
    if (snapIndex !== 0 && snapIndex !== prevCanvasPoints.length - 1) {
        return false;
    }
    const p1 = canvasPos;
    const p2 = lastCanvasPos;
    const p3 = prevCanvasPoints[snapIndex];
    const a = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.create */ .Zc.create();
    const b = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.create */ .Zc.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.set */ .Zc.set(a, p1[0] - p2[0], p1[1] - p2[1]);
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.set */ .Zc.set(b, p1[0] - p3[0], p1[1] - p3[1]);
    const aDotb = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.dot */ .Zc.dot(a, b);
    const magA = Math.sqrt(a[0] * a[0] + a[1] * a[1]);
    const magB = Math.sqrt(b[0] * b[0] + b[1] * b[1]);
    const theta = Math.acos(aDotb / (magA * magB));
    if (theta < Math.PI / 2) {
        return true;
    }
    return false;
}
function fuseEditPointsForOpenContourEndEdit() {
    const { snapIndex, prevCanvasPoints, editCanvasPoints, startCrossingIndex } = this.editData;
    const newCanvasPoints = [];
    if (snapIndex === 0) {
        for (let i = prevCanvasPoints.length - 1; i >= startCrossingIndex; i--) {
            const canvasPoint = prevCanvasPoints[i];
            newCanvasPoints.push([canvasPoint[0], canvasPoint[1]]);
        }
    }
    else {
        for (let i = 0; i < startCrossingIndex; i++) {
            const canvasPoint = prevCanvasPoints[i];
            newCanvasPoints.push([canvasPoint[0], canvasPoint[1]]);
        }
    }
    const distanceBetweenCrossingIndexAndFirstPoint = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.distance */ .Zc.distance(prevCanvasPoints[startCrossingIndex], editCanvasPoints[0]);
    const distanceBetweenCrossingIndexAndLastPoint = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.distance */ .Zc.distance(prevCanvasPoints[startCrossingIndex], editCanvasPoints[editCanvasPoints.length - 1]);
    if (distanceBetweenCrossingIndexAndFirstPoint <
        distanceBetweenCrossingIndexAndLastPoint) {
        for (let i = 0; i < editCanvasPoints.length; i++) {
            const canvasPoint = editCanvasPoints[i];
            newCanvasPoints.push([canvasPoint[0], canvasPoint[1]]);
        }
    }
    else {
        for (let i = editCanvasPoints.length - 1; i >= 0; i--) {
            const canvasPoint = editCanvasPoints[i];
            newCanvasPoints.push([canvasPoint[0], canvasPoint[1]]);
        }
    }
    return newCanvasPoints;
}
function fuseEditPointsWithOpenContour(evt) {
    const { prevCanvasPoints, editCanvasPoints, startCrossingIndex, snapIndex } = this.editData;
    if (startCrossingIndex === undefined || snapIndex === undefined) {
        return undefined;
    }
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const augmentedEditCanvasPoints = [...editCanvasPoints];
    addCanvasPointsToArray(element, augmentedEditCanvasPoints, prevCanvasPoints[snapIndex], this.commonData);
    if (augmentedEditCanvasPoints.length > editCanvasPoints.length) {
        augmentedEditCanvasPoints.pop();
    }
    let lowIndex;
    let highIndex;
    if (startCrossingIndex > snapIndex) {
        lowIndex = snapIndex;
        highIndex = startCrossingIndex;
    }
    else {
        lowIndex = startCrossingIndex;
        highIndex = snapIndex;
    }
    const distanceBetweenLowAndFirstPoint = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.distance */ .Zc.distance(prevCanvasPoints[lowIndex], augmentedEditCanvasPoints[0]);
    const distanceBetweenLowAndLastPoint = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.distance */ .Zc.distance(prevCanvasPoints[lowIndex], augmentedEditCanvasPoints[augmentedEditCanvasPoints.length - 1]);
    const distanceBetweenHighAndFirstPoint = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.distance */ .Zc.distance(prevCanvasPoints[highIndex], augmentedEditCanvasPoints[0]);
    const distanceBetweenHighAndLastPoint = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.distance */ .Zc.distance(prevCanvasPoints[highIndex], augmentedEditCanvasPoints[augmentedEditCanvasPoints.length - 1]);
    const pointsToRender = [];
    for (let i = 0; i < lowIndex; i++) {
        const canvasPoint = prevCanvasPoints[i];
        pointsToRender.push([canvasPoint[0], canvasPoint[1]]);
    }
    const inPlaceDistance = distanceBetweenLowAndFirstPoint + distanceBetweenHighAndLastPoint;
    const reverseDistance = distanceBetweenLowAndLastPoint + distanceBetweenHighAndFirstPoint;
    if (inPlaceDistance < reverseDistance) {
        for (let i = 0; i < augmentedEditCanvasPoints.length; i++) {
            const canvasPoint = augmentedEditCanvasPoints[i];
            pointsToRender.push([canvasPoint[0], canvasPoint[1]]);
        }
    }
    else {
        for (let i = augmentedEditCanvasPoints.length - 1; i >= 0; i--) {
            const canvasPoint = augmentedEditCanvasPoints[i];
            pointsToRender.push([canvasPoint[0], canvasPoint[1]]);
        }
    }
    for (let i = highIndex; i < prevCanvasPoints.length; i++) {
        const canvasPoint = prevCanvasPoints[i];
        pointsToRender.push([canvasPoint[0], canvasPoint[1]]);
    }
    return pointsToRender;
}
function finishEditOpenOnSecondCrossing(evt) {
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElement)(element);
    const { viewport, renderingEngine } = enabledElement;
    const { annotation, viewportIdsToRender } = this.commonData;
    const { fusedCanvasPoints, editCanvasPoints } = this.editData;
    (0,_utilities_contours_updateContourPolyline__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .A)(annotation, {
        points: fusedCanvasPoints,
        closed: false,
    }, viewport);
    const worldPoints = annotation.data.contour.polyline;
    annotation.data.handles.points = [
        worldPoints[0],
        worldPoints[worldPoints.length - 1],
    ];
    (0,_stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_10__.triggerAnnotationModified)(annotation, element);
    const lastEditCanvasPoint = editCanvasPoints.pop();
    this.editData = {
        prevCanvasPoints: fusedCanvasPoints,
        editCanvasPoints: [lastEditCanvasPoint],
        startCrossingIndex: undefined,
        editIndex: 0,
    };
    (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A)(viewportIdsToRender);
}
function mouseUpOpenContourEditCallback(evt) {
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    this.completeOpenContourEdit(element);
}
function completeOpenContourEdit(element) {
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElement)(element);
    const { viewport } = enabledElement;
    const { annotation, viewportIdsToRender } = this.commonData;
    this.doneEditMemo();
    const { fusedCanvasPoints, prevCanvasPoints } = this.editData;
    if (fusedCanvasPoints) {
        const updatedPoints = (0,_utilities_planarFreehandROITool_smoothPoints__WEBPACK_IMPORTED_MODULE_6__/* .shouldSmooth */ .Q)(this.configuration)
            ? (0,_utilities_planarFreehandROITool_smoothPoints__WEBPACK_IMPORTED_MODULE_6__/* .getInterpolatedPoints */ .p)(this.configuration, fusedCanvasPoints, prevCanvasPoints)
            : fusedCanvasPoints;
        const decimateConfig = this.configuration?.decimate || {};
        (0,_utilities_contours_updateContourPolyline__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .A)(annotation, {
            points: updatedPoints,
            closed: false,
        }, viewport, {
            decimate: {
                enabled: !!decimateConfig.enabled,
                epsilon: decimateConfig.epsilon,
            },
        });
        const worldPoints = annotation.data.contour.polyline;
        annotation.data.handles.points = [
            worldPoints[0],
            worldPoints[worldPoints.length - 1],
        ];
        if (annotation.data.isOpenUShapeContour) {
            annotation.data.openUShapeContourVectorToPeak =
                (0,_findOpenUShapedContourVectorToPeak__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .A)(fusedCanvasPoints, viewport);
        }
        (0,_stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_10__.triggerAnnotationModified)(annotation, element);
    }
    this.isEditingOpen = false;
    this.editData = undefined;
    this.commonData = undefined;
    (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A)(viewportIdsToRender);
    this.deactivateOpenContourEdit(element);
}
function cancelOpenContourEdit(element) {
    this.completeOpenContourEdit(element);
}
function registerOpenContourEditLoop(toolInstance) {
    toolInstance.activateOpenContourEdit =
        activateOpenContourEdit.bind(toolInstance);
    toolInstance.deactivateOpenContourEdit =
        deactivateOpenContourEdit.bind(toolInstance);
    toolInstance.mouseDragOpenContourEditCallback =
        mouseDragOpenContourEditCallback.bind(toolInstance);
    toolInstance.mouseUpOpenContourEditCallback =
        mouseUpOpenContourEditCallback.bind(toolInstance);
    toolInstance.fuseEditPointsWithOpenContour =
        fuseEditPointsWithOpenContour.bind(toolInstance);
    toolInstance.finishEditOpenOnSecondCrossing =
        finishEditOpenOnSecondCrossing.bind(toolInstance);
    toolInstance.checkIfShouldOverwriteAnEnd =
        checkIfShouldOverwriteAnEnd.bind(toolInstance);
    toolInstance.fuseEditPointsForOpenContourEndEdit =
        fuseEditPointsForOpenContourEndEdit.bind(toolInstance);
    toolInstance.openContourEditOverwriteEnd =
        openContourEditOverwriteEnd.bind(toolInstance);
    toolInstance.cancelOpenContourEdit = cancelOpenContourEdit.bind(toolInstance);
    toolInstance.completeOpenContourEdit =
        completeOpenContourEdit.bind(toolInstance);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (registerOpenContourEditLoop);


/***/ }),

/***/ 70734:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _store_state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(85204);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(99737);
/* harmony import */ var _cursors_elementCursor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7001);
/* harmony import */ var _utilities_math__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(95527);





const { getSubPixelSpacingAndXYDirections } = _utilities_math__WEBPACK_IMPORTED_MODULE_4__.polyline;
function activateOpenContourEndEdit(evt, annotation, viewportIdsToRender, handle) {
    this.isDrawing = true;
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
    const { viewport } = enabledElement;
    const { spacing, xDir, yDir } = getSubPixelSpacingAndXYDirections(viewport, this.configuration.subPixelResolution);
    const canvasPoints = annotation.data.contour.polyline.map(viewport.worldToCanvas);
    const handleIndexGrabbed = annotation.data.handles.activeHandleIndex;
    if (handleIndexGrabbed === 0) {
        canvasPoints.reverse();
    }
    let movingTextBox = false;
    if (handle?.worldPosition) {
        movingTextBox = true;
    }
    this.drawData = {
        canvasPoints: canvasPoints,
        polylineIndex: canvasPoints.length - 1,
    };
    this.commonData = {
        annotation,
        viewportIdsToRender,
        spacing,
        xDir,
        yDir,
        movingTextBox,
    };
    _store_state__WEBPACK_IMPORTED_MODULE_1__/* .state */ .wk.isInteractingWithTool = true;
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.MOUSE_UP, this.mouseUpDrawCallback);
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.MOUSE_DRAG, this.mouseDragDrawCallback);
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.MOUSE_CLICK, this.mouseUpDrawCallback);
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.TOUCH_END, this.mouseUpDrawCallback);
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.TOUCH_DRAG, this.mouseDragDrawCallback);
    element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.TOUCH_TAP, this.mouseUpDrawCallback);
    (0,_cursors_elementCursor__WEBPACK_IMPORTED_MODULE_3__.hideElementCursor)(element);
}
function registerOpenContourEndEditLoop(toolInstance) {
    toolInstance.activateOpenContourEndEdit =
        activateOpenContourEndEdit.bind(toolInstance);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (registerOpenContourEndEditLoop);


/***/ }),

/***/ 58161:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _drawingSvg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17328);
/* harmony import */ var _utilities_math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(95527);
/* harmony import */ var _findOpenUShapedContourVectorToPeak__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5403);
/* harmony import */ var _utilities_contours_getContourHolesDataCanvas__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(15451);




const { pointsAreWithinCloseContourProximity } = _utilities_math__WEBPACK_IMPORTED_MODULE_1__.polyline;
function _getRenderingOptions(enabledElement, annotation) {
    const styleSpecifier = {
        toolGroupId: this.toolGroupId,
        toolName: this.getToolName(),
        viewportId: enabledElement.viewport.id,
        annotationUID: annotation.annotationUID,
    };
    const { lineWidth, lineDash, color, fillColor, fillOpacity } = this.getAnnotationStyle({
        annotation,
        styleSpecifier,
    });
    const { closed: isClosedContour } = annotation.data.contour;
    const options = {
        color,
        width: lineWidth,
        lineDash,
        fillColor,
        fillOpacity,
        closePath: isClosedContour,
    };
    return options;
}
function renderContour(enabledElement, svgDrawingHelper, annotation) {
    if (!enabledElement?.viewport?.getImageData()) {
        return;
    }
    if (annotation.data.contour.closed) {
        this.renderClosedContour(enabledElement, svgDrawingHelper, annotation);
    }
    else {
        if (annotation.data.isOpenUShapeContour) {
            calculateUShapeContourVectorToPeakIfNotPresent(enabledElement, annotation);
            this.renderOpenUShapedContour(enabledElement, svgDrawingHelper, annotation);
        }
        else {
            this.renderOpenContour(enabledElement, svgDrawingHelper, annotation);
        }
    }
}
function calculateUShapeContourVectorToPeakIfNotPresent(enabledElement, annotation) {
    if (!annotation.data.openUShapeContourVectorToPeak) {
        annotation.data.openUShapeContourVectorToPeak =
            (0,_findOpenUShapedContourVectorToPeak__WEBPACK_IMPORTED_MODULE_2__/* .findOpenUShapedContourVectorToPeakOnRender */ .h)(enabledElement, annotation);
    }
}
function renderClosedContour(enabledElement, svgDrawingHelper, annotation) {
    if (annotation.parentAnnotationUID) {
        return;
    }
    const { viewport } = enabledElement;
    const options = this._getRenderingOptions(enabledElement, annotation);
    const canvasPolyline = annotation.data.contour.polyline.map((worldPos) => viewport.worldToCanvas(worldPos));
    const childContours = (0,_utilities_contours_getContourHolesDataCanvas__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)(annotation, viewport);
    const allContours = [canvasPolyline, ...childContours];
    const polylineUID = '1';
    (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_0__.drawPath)(svgDrawingHelper, annotation.annotationUID, polylineUID, allContours, options);
}
function renderOpenContour(enabledElement, svgDrawingHelper, annotation) {
    const { viewport } = enabledElement;
    const options = this._getRenderingOptions(enabledElement, annotation);
    const canvasPoints = annotation.data.contour.polyline.map((worldPos) => viewport.worldToCanvas(worldPos));
    const polylineUID = '1';
    (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_0__.drawPolyline)(svgDrawingHelper, annotation.annotationUID, polylineUID, canvasPoints, options);
    const activeHandleIndex = annotation.data.handles.activeHandleIndex;
    if (this.configuration.alwaysRenderOpenContourHandles?.enabled === true) {
        const radius = this.configuration.alwaysRenderOpenContourHandles.radius;
        const handleGroupUID = '0';
        const handlePoints = [
            canvasPoints[0],
            canvasPoints[canvasPoints.length - 1],
        ];
        if (activeHandleIndex === 0) {
            handlePoints.shift();
        }
        else if (activeHandleIndex === 1) {
            handlePoints.pop();
        }
        (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_0__.drawHandles)(svgDrawingHelper, annotation.annotationUID, handleGroupUID, handlePoints, {
            color: options.color,
            handleRadius: radius,
        });
    }
    if (activeHandleIndex !== null) {
        const handleGroupUID = '1';
        const indexOfCanvasPoints = activeHandleIndex === 0 ? 0 : canvasPoints.length - 1;
        const handlePoint = canvasPoints[indexOfCanvasPoints];
        (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_0__.drawHandles)(svgDrawingHelper, annotation.annotationUID, handleGroupUID, [handlePoint], { color: options.color });
    }
}
function renderOpenUShapedContour(enabledElement, svgDrawingHelper, annotation) {
    const { viewport } = enabledElement;
    const { openUShapeContourVectorToPeak } = annotation.data;
    const { polyline } = annotation.data.contour;
    this.renderOpenContour(enabledElement, svgDrawingHelper, annotation);
    if (!openUShapeContourVectorToPeak) {
        return;
    }
    const firstCanvasPoint = viewport.worldToCanvas(polyline[0]);
    const lastCanvasPoint = viewport.worldToCanvas(polyline[polyline.length - 1]);
    const openUShapeContourVectorToPeakCanvas = [
        viewport.worldToCanvas(openUShapeContourVectorToPeak[0]),
        viewport.worldToCanvas(openUShapeContourVectorToPeak[1]),
    ];
    const options = this._getRenderingOptions(enabledElement, annotation);
    (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_0__.drawPolyline)(svgDrawingHelper, annotation.annotationUID, 'first-to-last', [firstCanvasPoint, lastCanvasPoint], {
        color: options.color,
        width: options.width,
        closePath: false,
        lineDash: '2,2',
    });
    (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_0__.drawPolyline)(svgDrawingHelper, annotation.annotationUID, 'midpoint-to-open-contour', [
        openUShapeContourVectorToPeakCanvas[0],
        openUShapeContourVectorToPeakCanvas[1],
    ], {
        color: options.color,
        width: options.width,
        closePath: false,
        lineDash: '2,2',
    });
}
function renderContourBeingDrawn(enabledElement, svgDrawingHelper, annotation) {
    const options = this._getRenderingOptions(enabledElement, annotation);
    const { allowOpenContours } = this.configuration;
    const { canvasPoints } = this.drawData;
    options.closePath = false;
    (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_0__.drawPolyline)(svgDrawingHelper, annotation.annotationUID, '1', canvasPoints, options);
    if (allowOpenContours) {
        const firstPoint = canvasPoints[0];
        const lastPoint = canvasPoints[canvasPoints.length - 1];
        if (pointsAreWithinCloseContourProximity(firstPoint, lastPoint, this.configuration.closeContourProximity)) {
            (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_0__.drawPolyline)(svgDrawingHelper, annotation.annotationUID, '2', [lastPoint, firstPoint], options);
        }
        else {
            const handleGroupUID = '0';
            (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_0__.drawHandles)(svgDrawingHelper, annotation.annotationUID, handleGroupUID, [firstPoint], { color: options.color, handleRadius: 2 });
        }
    }
}
function renderClosedContourBeingEdited(enabledElement, svgDrawingHelper, annotation) {
    const { viewport } = enabledElement;
    const { fusedCanvasPoints } = this.editData;
    if (fusedCanvasPoints === undefined) {
        this.renderClosedContour(enabledElement, svgDrawingHelper, annotation);
        return;
    }
    const childContours = (0,_utilities_contours_getContourHolesDataCanvas__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)(annotation, viewport);
    const allContours = [fusedCanvasPoints, ...childContours];
    const options = this._getRenderingOptions(enabledElement, annotation);
    const polylineUIDToRender = 'preview-1';
    if (annotation.parentAnnotationUID && options.fillOpacity) {
        options.fillOpacity = 0;
    }
    (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_0__.drawPath)(svgDrawingHelper, annotation.annotationUID, polylineUIDToRender, allContours, options);
}
function renderOpenContourBeingEdited(enabledElement, svgDrawingHelper, annotation) {
    const { fusedCanvasPoints } = this.editData;
    if (fusedCanvasPoints === undefined) {
        this.renderOpenContour(enabledElement, svgDrawingHelper, annotation);
        return;
    }
    const options = this._getRenderingOptions(enabledElement, annotation);
    const polylineUIDToRender = 'preview-1';
    (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_0__.drawPolyline)(svgDrawingHelper, annotation.annotationUID, polylineUIDToRender, fusedCanvasPoints, options);
}
function renderPointContourWithMarker(enabledElement, svgDrawingHelper, annotation) {
    if (annotation.parentAnnotationUID) {
        return;
    }
    const { viewport } = enabledElement;
    const options = this._getRenderingOptions(enabledElement, annotation);
    const canvasPolyline = annotation.data.contour.polyline.map((worldPos) => viewport.worldToCanvas(worldPos));
    const childContours = (0,_utilities_contours_getContourHolesDataCanvas__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)(annotation, viewport);
    const polylineUID = '1';
    const center = canvasPolyline[0];
    const radius = 6;
    const numberOfPoints = 100;
    const circlePoints = [];
    for (let i = 0; i < numberOfPoints; i++) {
        const angle = (i / numberOfPoints) * 2 * Math.PI;
        const x = center[0] + radius * Math.cos(angle);
        const y = center[1] + radius * Math.sin(angle);
        circlePoints.push([x, y]);
    }
    const crosshair = [
        [center[0] - radius * 2, center[1]],
        [center[0] + radius * 2, center[1]],
        [center[0], center[1] - radius * 2],
        [center[0], center[1] + radius * 2],
    ];
    (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_0__.drawPath)(svgDrawingHelper, annotation.annotationUID, polylineUID + '-crosshair_v', [crosshair[0], crosshair[1]], options);
    (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_0__.drawPath)(svgDrawingHelper, annotation.annotationUID, polylineUID + '-crosshair_h', [crosshair[2], crosshair[3]], options);
    const allContours = [circlePoints, ...childContours];
    (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_0__.drawPath)(svgDrawingHelper, annotation.annotationUID, polylineUID, allContours, options);
}
function registerRenderMethods(toolInstance) {
    toolInstance.renderContour = renderContour.bind(toolInstance);
    toolInstance.renderClosedContour = renderClosedContour.bind(toolInstance);
    toolInstance.renderOpenContour = renderOpenContour.bind(toolInstance);
    toolInstance.renderPointContourWithMarker =
        renderPointContourWithMarker.bind(toolInstance);
    toolInstance.renderOpenUShapedContour =
        renderOpenUShapedContour.bind(toolInstance);
    toolInstance.renderContourBeingDrawn =
        renderContourBeingDrawn.bind(toolInstance);
    toolInstance.renderClosedContourBeingEdited =
        renderClosedContourBeingEdited.bind(toolInstance);
    toolInstance.renderOpenContourBeingEdited =
        renderOpenContourBeingEdited.bind(toolInstance);
    toolInstance._getRenderingOptions = _getRenderingOptions.bind(toolInstance);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (registerRenderMethods);


/***/ }),

/***/ 91350:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3823);
/* harmony import */ var _AnnotationDisplayTool__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6030);
/* harmony import */ var _stateManagement_annotation_annotationLocking__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2076);
/* harmony import */ var _stateManagement_annotation_annotationVisibility__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(29601);
/* harmony import */ var _stateManagement_annotation_annotationState__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(82056);
/* harmony import */ var _stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(44049);
/* harmony import */ var _enums_ChangeTypes__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(75183);
/* harmony import */ var _stateManagement_annotation_annotationSelection__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(17343);
/* harmony import */ var _utilities_contourSegmentation__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(64843);










const { DefaultHistoryMemo } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.HistoryMemo;
const { PointsManager } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities;
class AnnotationTool extends _AnnotationDisplayTool__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A {
    static createAnnotation(...annotationBaseData) {
        let annotation = {
            annotationUID: null,
            highlighted: true,
            invalidated: true,
            metadata: {
                toolName: this.toolName,
            },
            data: {
                text: '',
                handles: {
                    points: new Array(),
                    textBox: {
                        hasMoved: false,
                        worldPosition: [0, 0, 0],
                        worldBoundingBox: {
                            topLeft: [0, 0, 0],
                            topRight: [0, 0, 0],
                            bottomLeft: [0, 0, 0],
                            bottomRight: [0, 0, 0],
                        },
                    },
                },
                label: '',
            },
        };
        for (const baseData of annotationBaseData) {
            annotation = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.deepMerge(annotation, baseData);
        }
        return annotation;
    }
    static createAnnotationForViewport(viewport, ...annotationBaseData) {
        return this.createAnnotation({ metadata: viewport.getViewReference() }, ...annotationBaseData);
    }
    static createAndAddAnnotation(viewport, ...annotationBaseData) {
        const annotation = this.createAnnotationForViewport(viewport, ...annotationBaseData);
        (0,_stateManagement_annotation_annotationState__WEBPACK_IMPORTED_MODULE_5__.addAnnotation)(annotation, viewport.element);
        (0,_stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_6__.triggerAnnotationModified)(annotation, viewport.element);
    }
    constructor(toolProps, defaultToolProps) {
        super(toolProps, defaultToolProps);
        this.mouseMoveCallback = (evt, filteredAnnotations) => {
            if (!filteredAnnotations) {
                return false;
            }
            const { element, currentPoints } = evt.detail;
            const canvasCoords = currentPoints.canvas;
            let annotationsNeedToBeRedrawn = false;
            for (const annotation of filteredAnnotations) {
                if ((0,_stateManagement_annotation_annotationLocking__WEBPACK_IMPORTED_MODULE_3__.isAnnotationLocked)(annotation.annotationUID) ||
                    !(0,_stateManagement_annotation_annotationVisibility__WEBPACK_IMPORTED_MODULE_4__.isAnnotationVisible)(annotation.annotationUID)) {
                    continue;
                }
                const { data } = annotation;
                const activateHandleIndex = data.handles
                    ? data.handles.activeHandleIndex
                    : undefined;
                const near = this._imagePointNearToolOrHandle(element, annotation, canvasCoords, 6);
                const nearToolAndNotMarkedActive = near && !annotation.highlighted;
                const notNearToolAndMarkedActive = !near && annotation.highlighted;
                if (nearToolAndNotMarkedActive || notNearToolAndMarkedActive) {
                    annotation.highlighted = !annotation.highlighted;
                    annotationsNeedToBeRedrawn = true;
                }
                else if (data.handles &&
                    data.handles.activeHandleIndex !== activateHandleIndex) {
                    annotationsNeedToBeRedrawn = true;
                }
            }
            return annotationsNeedToBeRedrawn;
        };
        this.isSuvScaled = AnnotationTool.isSuvScaled;
        if (toolProps.configuration?.getTextLines) {
            this.configuration.getTextLines = toolProps.configuration.getTextLines;
        }
        if (toolProps.configuration?.statsCalculator) {
            this.configuration.statsCalculator =
                toolProps.configuration.statsCalculator;
        }
    }
    getHandleNearImagePoint(element, annotation, canvasCoords, proximity) {
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
        const { viewport } = enabledElement;
        const { data } = annotation;
        const { isCanvasAnnotation } = data;
        const { points, textBox } = data.handles;
        if (textBox) {
            const { worldBoundingBox } = textBox;
            if (worldBoundingBox) {
                const canvasBoundingBox = {
                    topLeft: viewport.worldToCanvas(worldBoundingBox.topLeft),
                    topRight: viewport.worldToCanvas(worldBoundingBox.topRight),
                    bottomLeft: viewport.worldToCanvas(worldBoundingBox.bottomLeft),
                    bottomRight: viewport.worldToCanvas(worldBoundingBox.bottomRight),
                };
                if (canvasCoords[0] >= canvasBoundingBox.topLeft[0] &&
                    canvasCoords[0] <= canvasBoundingBox.bottomRight[0] &&
                    canvasCoords[1] >= canvasBoundingBox.topLeft[1] &&
                    canvasCoords[1] <= canvasBoundingBox.bottomRight[1]) {
                    data.handles.activeHandleIndex = null;
                    return textBox;
                }
            }
        }
        for (let i = 0; i < points?.length; i++) {
            const point = points[i];
            const annotationCanvasCoordinate = isCanvasAnnotation
                ? point.slice(0, 2)
                : viewport.worldToCanvas(point);
            const near = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.distance */ .Zc.distance(canvasCoords, annotationCanvasCoordinate) < proximity;
            if (near === true) {
                data.handles.activeHandleIndex = i;
                return point;
            }
        }
        data.handles.activeHandleIndex = null;
    }
    getLinkedTextBoxStyle(specifications, annotation) {
        return {
            visibility: this.getStyle('textBoxVisibility', specifications, annotation),
            fontFamily: this.getStyle('textBoxFontFamily', specifications, annotation),
            fontSize: this.getStyle('textBoxFontSize', specifications, annotation),
            color: this.getStyle('textBoxColor', specifications, annotation),
            shadow: this.getStyle('textBoxShadow', specifications, annotation),
            background: this.getStyle('textBoxBackground', specifications, annotation),
            lineWidth: this.getStyle('textBoxLinkLineWidth', specifications, annotation),
            lineDash: this.getStyle('textBoxLinkLineDash', specifications, annotation),
        };
    }
    static isSuvScaled(viewport, targetId, imageId) {
        if (viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.BaseVolumeViewport) {
            const volumeId = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.getVolumeId(targetId);
            const volume = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.cache.getVolume(volumeId);
            return volume?.scaling?.PT !== undefined;
        }
        const scalingModule = imageId && _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.metaData.get('scalingModule', imageId);
        return typeof scalingModule?.suvbw === 'number';
    }
    getAnnotationStyle(context) {
        const { annotation, styleSpecifier } = context;
        const getStyle = (property) => this.getStyle(property, styleSpecifier, annotation);
        const { annotationUID } = annotation;
        const visibility = (0,_stateManagement_annotation_annotationVisibility__WEBPACK_IMPORTED_MODULE_4__.isAnnotationVisible)(annotationUID);
        const locked = (0,_stateManagement_annotation_annotationLocking__WEBPACK_IMPORTED_MODULE_3__.isAnnotationLocked)(annotationUID);
        const lineWidth = getStyle('lineWidth');
        const lineDash = getStyle('lineDash');
        const angleArcLineDash = getStyle('angleArcLineDash');
        const color = getStyle('color');
        const markerSize = getStyle('markerSize');
        const shadow = getStyle('shadow');
        const textboxStyle = this.getLinkedTextBoxStyle(styleSpecifier, annotation);
        return {
            visibility,
            locked,
            color,
            lineWidth,
            lineDash,
            lineOpacity: 1,
            fillColor: color,
            fillOpacity: 0,
            shadow,
            textbox: textboxStyle,
            markerSize,
            angleArcLineDash,
        };
    }
    _imagePointNearToolOrHandle(element, annotation, canvasCoords, proximity) {
        const handleNearImagePoint = this.getHandleNearImagePoint(element, annotation, canvasCoords, proximity);
        if (handleNearImagePoint) {
            return true;
        }
        const toolNewImagePoint = this.isPointNearTool(element, annotation, canvasCoords, proximity, 'mouse');
        if (toolNewImagePoint) {
            return true;
        }
    }
    static createAnnotationState(annotation, deleting) {
        const { data, annotationUID } = annotation;
        const cloneData = {
            ...data,
            cachedStats: {},
        };
        delete cloneData.contour;
        delete cloneData.spline;
        const state = {
            annotationUID,
            data: structuredClone(cloneData),
            deleting,
        };
        const contour = data.contour;
        if (contour) {
            state.data.contour = {
                ...contour,
                polyline: null,
                pointsManager: PointsManager.create3(contour.polyline.length, contour.polyline),
            };
        }
        return state;
    }
    static createAnnotationMemo(element, annotation, options) {
        if (!annotation) {
            return;
        }
        const { newAnnotation, deleting = newAnnotation ? false : undefined } = options || {};
        const { annotationUID } = annotation;
        const state = AnnotationTool.createAnnotationState(annotation, deleting);
        const annotationMemo = {
            restoreMemo: () => {
                const newState = AnnotationTool.createAnnotationState(annotation, deleting);
                const { viewport } = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element) || {};
                viewport?.setViewReference(annotation.metadata);
                if (state.deleting === true) {
                    state.deleting = false;
                    Object.assign(annotation.data, state.data);
                    if (annotation.data.contour) {
                        const annotationData = annotation.data;
                        annotationData.contour.polyline = state.data.contour.pointsManager.points;
                        delete state.data.contour.pointsManager;
                        if (annotationData.segmentation) {
                            (0,_utilities_contourSegmentation__WEBPACK_IMPORTED_MODULE_9__.addContourSegmentationAnnotation)(annotation);
                        }
                    }
                    state.data = newState.data;
                    (0,_stateManagement_annotation_annotationState__WEBPACK_IMPORTED_MODULE_5__.addAnnotation)(annotation, element);
                    (0,_stateManagement_annotation_annotationSelection__WEBPACK_IMPORTED_MODULE_8__.setAnnotationSelected)(annotation.annotationUID, true);
                    viewport?.render();
                    return;
                }
                if (state.deleting === false) {
                    state.deleting = true;
                    state.data = newState.data;
                    (0,_stateManagement_annotation_annotationSelection__WEBPACK_IMPORTED_MODULE_8__.setAnnotationSelected)(annotation.annotationUID);
                    (0,_stateManagement_annotation_annotationState__WEBPACK_IMPORTED_MODULE_5__.removeAnnotation)(annotation.annotationUID);
                    viewport?.render();
                    return;
                }
                const currentAnnotation = (0,_stateManagement_annotation_annotationState__WEBPACK_IMPORTED_MODULE_5__.getAnnotation)(annotationUID);
                if (!currentAnnotation) {
                    console.warn('No current annotation');
                    return;
                }
                Object.assign(currentAnnotation.data, state.data);
                if (currentAnnotation.data.contour) {
                    currentAnnotation.data
                        .contour.polyline = state.data.contour.pointsManager.points;
                }
                state.data = newState.data;
                currentAnnotation.invalidated = true;
                (0,_stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_6__.triggerAnnotationModified)(currentAnnotation, element, _enums_ChangeTypes__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A.History);
            },
            id: annotationUID,
            operationType: 'annotation',
        };
        DefaultHistoryMemo.push(annotationMemo);
        return annotationMemo;
    }
    createMemo(element, annotation, options) {
        this.memo ||= AnnotationTool.createAnnotationMemo(element, annotation, options);
    }
    static hydrateBase(ToolClass, enabledElement, points, options = {}) {
        if (!enabledElement) {
            return null;
        }
        const { viewport } = enabledElement;
        const FrameOfReferenceUID = viewport.getFrameOfReferenceUID();
        const camera = viewport.getCamera();
        const viewPlaneNormal = options.viewplaneNormal ?? camera.viewPlaneNormal;
        const viewUp = options.viewUp ?? camera.viewUp;
        const instance = options.toolInstance || new ToolClass();
        let referencedImageId;
        let finalViewPlaneNormal = viewPlaneNormal;
        let finalViewUp = viewUp;
        if (options.referencedImageId) {
            referencedImageId = options.referencedImageId;
            finalViewPlaneNormal = undefined;
            finalViewUp = undefined;
        }
        else {
            if (viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.StackViewport) {
                const closestImageIndex = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.getClosestStackImageIndexForPoint(points[0], viewport);
                if (closestImageIndex !== undefined) {
                    referencedImageId = viewport.getImageIds()[closestImageIndex];
                }
            }
            else if (viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.BaseVolumeViewport) {
                referencedImageId = instance.getReferencedImageId(viewport, points[0], viewPlaneNormal, viewUp);
            }
            else {
                throw new Error('Unsupported viewport type');
            }
        }
        return {
            FrameOfReferenceUID,
            referencedImageId,
            viewPlaneNormal: finalViewPlaneNormal,
            viewUp: finalViewUp,
            instance,
            viewport,
        };
    }
}
AnnotationTool.toolName = 'AnnotationTool';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AnnotationTool);


/***/ }),

/***/ 36320:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ ContourSegmentationBaseTool)
});

// UNUSED EXPORTS: ContourSegmentationBaseTool

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js + 2 modules
var enums = __webpack_require__(99737);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/annotationState.js
var annotationState = __webpack_require__(82056);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/index.js + 3 modules
var drawingSvg = __webpack_require__(17328);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/base/AnnotationTool.js
var AnnotationTool = __webpack_require__(91350);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contours/updateContourPolyline.js
var updateContourPolyline = __webpack_require__(72967);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contours/getContourHolesDataCanvas.js
var getContourHolesDataCanvas = __webpack_require__(15451);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/base/ContourBaseTool.js






class ContourBaseTool extends AnnotationTool/* default */.A {
    constructor(toolProps, defaultToolProps) {
        super(toolProps, defaultToolProps);
    }
    renderAnnotation(enabledElement, svgDrawingHelper) {
        let renderStatus = false;
        const { viewport } = enabledElement;
        const { element } = viewport;
        if (!viewport.getRenderingEngine()) {
            console.warn('Rendering Engine has been destroyed');
            return renderStatus;
        }
        let annotations = (0,annotationState.getAnnotations)(this.getToolName(), element);
        if (!annotations?.length) {
            return renderStatus;
        }
        annotations = this.filterInteractableAnnotationsForElement(element, annotations);
        if (!annotations?.length) {
            return renderStatus;
        }
        const targetId = this.getTargetId(viewport);
        const styleSpecifier = {
            toolGroupId: this.toolGroupId,
            toolName: this.getToolName(),
            viewportId: enabledElement.viewport.id,
        };
        for (let i = 0; i < annotations.length; i++) {
            const annotation = annotations[i];
            styleSpecifier.annotationUID = annotation.annotationUID;
            const annotationStyle = this.getAnnotationStyle({
                annotation,
                styleSpecifier,
            });
            if (!annotationStyle.visibility) {
                continue;
            }
            const annotationRendered = this.renderAnnotationInstance({
                enabledElement,
                targetId,
                annotation,
                annotationStyle,
                svgDrawingHelper,
            });
            renderStatus ||= annotationRendered;
            annotation.invalidated = false;
        }
        return renderStatus;
    }
    createAnnotation(evt) {
        const annotation = super.createAnnotation(evt);
        Object.assign(annotation.data, {
            contour: {
                polyline: [],
                closed: false,
            },
        });
        Object.assign(annotation, {
            interpolationUID: '',
            autoGenerated: false,
        });
        return annotation;
    }
    addAnnotation(annotation, element) {
        return (0,annotationState.addAnnotation)(annotation, element);
    }
    cancelAnnotation(annotation) {
    }
    moveAnnotation(annotation, worldPosDelta) {
        const { points } = annotation.data.handles;
        for (let i = 0, numPoints = points.length; i < numPoints; i++) {
            const point = points[i];
            point[0] += worldPosDelta[0];
            point[1] += worldPosDelta[1];
            point[2] += worldPosDelta[2];
        }
        annotation.invalidated = true;
        (0,annotationState.getChildAnnotations)(annotation).forEach((childAnnotation) => this.moveAnnotation(childAnnotation, worldPosDelta));
    }
    updateContourPolyline(annotation, polylineData, transforms, options) {
        const decimateConfig = this.configuration?.decimate || {};
        (0,updateContourPolyline/* default */.A)(annotation, polylineData, transforms, {
            decimate: {
                enabled: !!decimateConfig.enabled,
                epsilon: decimateConfig.epsilon,
            },
            updateWindingDirection: options?.updateWindingDirection,
        });
    }
    getPolylinePoints(annotation) {
        return annotation.data.contour?.polyline ?? annotation.data.polyline;
    }
    renderAnnotationInstance(renderContext) {
        const { enabledElement, annotationStyle, svgDrawingHelper } = renderContext;
        const annotation = renderContext.annotation;
        if (annotation.parentAnnotationUID) {
            return;
        }
        const { annotationUID } = annotation;
        const { viewport } = enabledElement;
        const { worldToCanvas } = viewport;
        const polylineCanvasPoints = this.getPolylinePoints(annotation).map((point) => worldToCanvas(point));
        const { lineWidth, lineDash, color, fillColor, fillOpacity } = annotationStyle;
        const childContours = (0,getContourHolesDataCanvas/* default */.A)(annotation, viewport);
        const allContours = [polylineCanvasPoints, ...childContours];
        (0,drawingSvg.drawPath)(svgDrawingHelper, annotationUID, 'contourPolyline', allContours, {
            color: color,
            lineDash: lineDash,
            lineWidth: Math.max(0.1, lineWidth),
            fillColor: fillColor,
            fillOpacity: fillOpacity,
        });
        return true;
    }
}


// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/triggerSegmentationEvents.js
var triggerSegmentationEvents = __webpack_require__(49906);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/InterpolationManager/InterpolationManager.js
var InterpolationManager = __webpack_require__(27740);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contourSegmentation/index.js
var contourSegmentation = __webpack_require__(64843);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/triggerAnnotationRenderForToolGroupIds.js
var triggerAnnotationRenderForToolGroupIds = __webpack_require__(94779);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/store/ToolGroupManager/index.js + 6 modules
var ToolGroupManager = __webpack_require__(77609);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getSegmentationRepresentation.js
var getSegmentationRepresentation = __webpack_require__(93210);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getActiveSegmentation.js
var getActiveSegmentation = __webpack_require__(67165);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getViewportIdsWithSegmentation.js
var getViewportIdsWithSegmentation = __webpack_require__(58859);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getActiveSegmentIndex.js
var getActiveSegmentIndex = __webpack_require__(60740);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/segmentLocking.js
var segmentLocking = __webpack_require__(26795);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getSVGStyleForSegment.js
var getSVGStyleForSegment = __webpack_require__(86644);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/base/ContourSegmentationBaseTool.js














class ContourSegmentationBaseTool extends ContourBaseTool {
    static { this.PreviewSegmentIndex = 255; }
    constructor(toolProps, defaultToolProps) {
        super(toolProps, defaultToolProps);
        if (this.configuration.interpolation?.enabled) {
            InterpolationManager/* default */.A.addTool(this.getToolName());
        }
    }
    isContourSegmentationTool() {
        return true;
    }
    createAnnotation(evt) {
        const eventDetail = evt.detail;
        const { element } = eventDetail;
        const enabledElement = (0,esm.getEnabledElement)(element);
        if (!enabledElement) {
            return;
        }
        const { viewport } = enabledElement;
        const contourAnnotation = super.createAnnotation(evt);
        if (!this.isContourSegmentationTool()) {
            return contourAnnotation;
        }
        const activeSeg = (0,getActiveSegmentation/* getActiveSegmentation */.T)(viewport.id);
        if (!activeSeg) {
            throw new Error('No active segmentation detected, create one before using scissors tool');
        }
        if (!activeSeg.representationData.Contour) {
            throw new Error(`A contour segmentation must be active`);
        }
        const { segmentationId } = activeSeg;
        const segmentIndex = (0,getActiveSegmentIndex/* getActiveSegmentIndex */.Q)(segmentationId);
        return esm.utilities.deepMerge(contourAnnotation, {
            data: {
                segmentation: {
                    segmentationId,
                    segmentIndex,
                },
            },
        });
    }
    addAnnotation(annotation, element) {
        const annotationUID = super.addAnnotation(annotation, element);
        if (this.isContourSegmentationTool()) {
            const contourSegAnnotation = annotation;
            (0,contourSegmentation.addContourSegmentationAnnotation)(contourSegAnnotation);
        }
        return annotationUID;
    }
    cancelAnnotation(annotation) {
        if (this.isContourSegmentationTool()) {
            (0,contourSegmentation.removeContourSegmentationAnnotation)(annotation);
        }
        super.cancelAnnotation(annotation);
    }
    getAnnotationStyle(context) {
        const annotationStyle = super.getAnnotationStyle(context);
        if (!this.isContourSegmentationTool()) {
            return annotationStyle;
        }
        const contourSegmentationStyle = this._getContourSegmentationStyle(context);
        return esm.utilities.deepMerge(annotationStyle, contourSegmentationStyle);
    }
    renderAnnotationInstance(renderContext) {
        const { annotation } = renderContext;
        const { invalidated } = annotation;
        const renderResult = super.renderAnnotationInstance(renderContext);
        if (invalidated && this.isContourSegmentationTool()) {
            const { segmentationId } = (annotation).data.segmentation;
            (0,triggerSegmentationEvents.triggerSegmentationDataModified)(segmentationId);
            const viewportIds = (0,getViewportIdsWithSegmentation/* getViewportIdsWithSegmentation */.P)(segmentationId);
            const toolGroupIds = viewportIds.map((viewportId) => {
                const toolGroup = (0,ToolGroupManager.getToolGroupForViewport)(viewportId);
                return toolGroup.id;
            });
            (0,triggerAnnotationRenderForToolGroupIds/* triggerAnnotationRenderForToolGroupIds */._)(toolGroupIds);
        }
        return renderResult;
    }
    _getContourSegmentationStyle(context) {
        const annotation = context.annotation;
        const { segmentationId, segmentIndex } = annotation.data.segmentation;
        const { viewportId } = context.styleSpecifier;
        const segmentationRepresentations = (0,getSegmentationRepresentation/* getSegmentationRepresentations */.r$)(viewportId, { segmentationId });
        if (!segmentationRepresentations?.length) {
            return {};
        }
        let segmentationRepresentation;
        if (segmentationRepresentations.length > 1) {
            segmentationRepresentation = segmentationRepresentations.find((rep) => rep.segmentationId === segmentationId &&
                rep.type === enums.SegmentationRepresentations.Contour);
        }
        else {
            segmentationRepresentation = segmentationRepresentations[0];
        }
        const { autoGenerated } = annotation;
        const segmentsLocked = (0,segmentLocking.getLockedSegmentIndices)(segmentationId);
        const annotationLocked = segmentsLocked.includes(segmentIndex);
        const { color, fillColor, lineWidth, fillOpacity, lineDash, visibility } = (0,getSVGStyleForSegment/* getSVGStyleForSegment */.u)({
            segmentationId,
            segmentIndex,
            viewportId,
            autoGenerated,
        });
        return {
            color,
            fillColor,
            lineWidth,
            fillOpacity,
            lineDash,
            textbox: {
                color,
            },
            visibility,
            locked: annotationLocked,
        };
    }
}



/***/ }),

/***/ 67772:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const defaultContourConfig = {
    renderOutline: true,
    outlineWidthAutoGenerated: 3,
    outlineWidth: 1,
    outlineWidthInactive: 1,
    outlineOpacity: 1,
    outlineOpacityInactive: 0.85,
    outlineDash: undefined,
    outlineDashInactive: undefined,
    outlineDashAutoGenerated: '5,3',
    activeSegmentOutlineWidthDelta: 0,
    renderFill: true,
    fillAlpha: 0.5,
    fillAlphaInactive: 0.3,
    fillAlphaAutoGenerated: 0.3,
};
function getDefaultContourStyle() {
    return defaultContourConfig;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getDefaultContourStyle);


/***/ }),

/***/ 22384:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  d: () => (/* binding */ handleContourSegmentation)
});

// UNUSED EXPORTS: addContourSetsToElement

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/annotationState.js
var annotationState = __webpack_require__(82056);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/annotationHydration.js
var annotationHydration = __webpack_require__(64485);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contourSegmentation/index.js
var contourSegmentation = __webpack_require__(64843);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/CellArray.js
var CellArray = __webpack_require__(35056);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/Points.js
var Points = __webpack_require__(74966);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/PolyData.js + 5 modules
var PolyData = __webpack_require__(87275);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Contour/contourHandler/utils.js




function validateGeometry(geometry) {
    if (!geometry) {
        throw new Error(`No contours found for geometryId ${geometry.id}`);
    }
    const geometryId = geometry.id;
    if (geometry.type !== esm.Enums.GeometryType.CONTOUR) {
        throw new Error(`Geometry type ${geometry.type} not supported for rendering.`);
    }
    if (!geometry.data) {
        console.warn(`No contours found for geometryId ${geometryId}. Skipping render.`);
        return;
    }
}
function getPolyData(contourSet) {
    const pointArray = [];
    const points = vtkPoints.newInstance();
    const lines = vtkCellArray.newInstance();
    let pointIndex = 0;
    contourSet.contours.forEach((contour) => {
        const pointList = contour.points;
        const flatPoints = contour.flatPointsArray;
        const type = contour.type;
        const pointIndexes = pointList.map((_, pointListIndex) => pointListIndex + pointIndex);
        if (type === Enums.ContourType.CLOSED_PLANAR) {
            pointIndexes.push(pointIndexes[0]);
        }
        const linePoints = Float32Array.from(flatPoints);
        pointArray.push(...linePoints);
        lines.insertNextCell([...pointIndexes]);
        pointIndex = pointIndex + pointList.length;
    });
    points.setData(pointArray, 3);
    const polygon = vtkPolyData.newInstance();
    polygon.setPoints(points);
    polygon.setLines(lines);
    return polygon;
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js + 2 modules
var enums = __webpack_require__(99737);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/SegmentationStyle.js
var SegmentationStyle = __webpack_require__(92686);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Contour/contourHandler/handleContourSegmentation.js







function handleContourSegmentation(viewport, geometryIds, annotationUIDsMap, contourRepresentation) {
    if (annotationUIDsMap.size) {
        viewport.render();
    }
    else {
        addContourSetsToElement(viewport, geometryIds, contourRepresentation);
    }
}
function addContourSetsToElement(viewport, geometryIds, contourRepresentation) {
    const { segmentationId } = contourRepresentation;
    const segmentSpecificMap = new Map();
    geometryIds.forEach((geometryId) => {
        const geometry = esm.cache.getGeometry(geometryId);
        if (!geometry) {
            console.warn(`No geometry found for geometryId ${geometryId}. Skipping render.`);
            return;
        }
        const segmentIndex = geometry.data.segmentIndex;
        validateGeometry(geometry);
        const segmentSpecificConfig = SegmentationStyle/* segmentationStyle */.Y.getStyle({
            viewportId: viewport.id,
            segmentationId,
            type: enums.SegmentationRepresentations.Contour,
            segmentIndex,
        });
        const contourSet = geometry.data;
        const viewPlaneNormal = viewport.getCamera().viewPlaneNormal;
        contourSet.contours.forEach((contour) => {
            const { points, color, id } = contour;
            const referencedImageId = (0,annotationHydration/* getClosestImageIdForStackViewport */.x)(viewport, points[0], viewPlaneNormal);
            const contourSegmentationAnnotation = {
                annotationUID: esm.utilities.uuidv4(),
                data: {
                    contour: {
                        closed: true,
                        polyline: points,
                    },
                    segmentation: {
                        segmentationId,
                        segmentIndex,
                        color,
                        id,
                    },
                    handles: {},
                },
                handles: {},
                highlighted: false,
                autoGenerated: false,
                invalidated: false,
                isLocked: true,
                isVisible: true,
                metadata: {
                    referencedImageId,
                    toolName: 'PlanarFreehandContourSegmentationTool',
                    FrameOfReferenceUID: viewport.getFrameOfReferenceUID(),
                    viewPlaneNormal: viewport.getCamera().viewPlaneNormal,
                },
            };
            const annotationGroupSelector = viewport.element;
            (0,annotationState.addAnnotation)(contourSegmentationAnnotation, annotationGroupSelector);
            (0,contourSegmentation.addContourSegmentationAnnotation)(contourSegmentationAnnotation);
        });
        if (segmentSpecificConfig) {
            segmentSpecificMap.set(segmentIndex, segmentSpecificConfig);
        }
    });
    viewport.resetCamera();
    viewport.render();
}



/***/ }),

/***/ 87420:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _stateManagement_segmentation_getSegmentation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(33283);
/* harmony import */ var _stateManagement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6802);


function removeContourFromElement(viewportId, segmentationId, removeFromCache = false) {
    const segmentation = (0,_stateManagement_segmentation_getSegmentation__WEBPACK_IMPORTED_MODULE_0__/* .getSegmentation */ .T)(segmentationId);
    const { annotationUIDsMap } = segmentation.representationData.Contour;
    annotationUIDsMap.forEach((annotationSet) => {
        annotationSet.forEach((annotationUID) => {
            (0,_stateManagement__WEBPACK_IMPORTED_MODULE_1__/* .removeAnnotation */ .O8)(annotationUID);
        });
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (removeContourFromElement);


/***/ }),

/***/ 63597:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ Labelmap_addLabelmapToElement)
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getCurrentLabelmapImageIdForViewport.js
var getCurrentLabelmapImageIdForViewport = __webpack_require__(97577);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getSegmentation.js
var getSegmentation = __webpack_require__(33283);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/triggerSegmentationEvents.js
var triggerSegmentationEvents = __webpack_require__(49906);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js + 2 modules
var enums = __webpack_require__(99737);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Labelmap/addVolumesAsIndependentComponents.js



const internalCache = new Map();
const load = ({ cfun, ofun, actor }) => {
    actor.getProperty().setRGBTransferFunction(1, cfun);
    actor.getProperty().setScalarOpacity(1, ofun);
};
async function addVolumesAsIndependentComponents({ viewport, volumeInputs, segmentationId, }) {
    const defaultActor = viewport.getDefaultActor();
    const { actor } = defaultActor;
    const { uid, callback } = defaultActor;
    const referenceVolumeId = viewport.getVolumeId();
    if (internalCache.get(uid)?.added) {
        return {
            uid,
            actor,
        };
    }
    const volumeInputArray = volumeInputs;
    const firstImageVolume = esm.cache.getVolume(volumeInputArray[0].volumeId);
    if (!firstImageVolume) {
        throw new Error(`imageVolume with id: ${firstImageVolume.volumeId} does not exist`);
    }
    const { volumeId } = volumeInputArray[0];
    const segImageVolume = await esm.volumeLoader.loadVolume(volumeId);
    if (!segImageVolume) {
        throw new Error(`segImageVolume with id: ${segImageVolume.volumeId} does not exist`);
    }
    const segVoxelManager = segImageVolume.voxelManager;
    const segData = segVoxelManager.getCompleteScalarDataArray();
    const { imageData: segImageData } = segImageVolume;
    const baseVolume = esm.cache.getVolume(referenceVolumeId);
    const baseVoxelManager = baseVolume.voxelManager;
    const baseData = baseVoxelManager.getCompleteScalarDataArray();
    const newComp = 2;
    const cubeData = new Float32Array(newComp * baseVolume.voxelManager.getScalarDataLength());
    const dims = segImageData.getDimensions();
    for (let z = 0; z < dims[2]; ++z) {
        for (let y = 0; y < dims[1]; ++y) {
            for (let x = 0; x < dims[0]; ++x) {
                const iTuple = x + dims[0] * (y + dims[1] * z);
                cubeData[iTuple * newComp + 0] = baseData[iTuple];
                cubeData[iTuple * newComp + 1] = segData[iTuple];
            }
        }
    }
    viewport.removeActors([uid]);
    const oldMapper = actor.getMapper();
    const mapper = (0,esm.convertMapperToNotSharedMapper)(oldMapper);
    actor.setMapper(mapper);
    mapper.setBlendMode(esm.Enums.BlendModes.LABELMAP_EDGE_PROJECTION_BLEND);
    const arrayAgain = mapper.getInputData().getPointData().getArray(0);
    arrayAgain.setData(cubeData);
    arrayAgain.setNumberOfComponents(2);
    actor.getProperty().setColorMixPreset(1);
    actor.getProperty().setForceNearestInterpolation(1, true);
    actor.getProperty().setIndependentComponents(true);
    viewport.addActor({
        actor,
        uid,
        callback,
        referencedId: referenceVolumeId,
        representationUID: `${segmentationId}-${enums.SegmentationRepresentations.Labelmap}`,
    });
    internalCache.set(uid, {
        added: true,
        segmentationRepresentationUID: `${segmentationId}`,
        originalBlendMode: viewport.getBlendMode(),
    });
    actor.set({
        preLoad: load,
    });
    function onSegmentationDataModified(evt) {
        const { segmentationId } = evt.detail;
        const { representationData } = (0,getSegmentation/* getSegmentation */.T)(segmentationId);
        const { volumeId: segVolumeId } = representationData.Labelmap;
        if (segVolumeId !== segImageVolume.volumeId) {
            return;
        }
        const segmentationVolume = esm.cache.getVolume(segVolumeId);
        const segVoxelManager = segmentationVolume.voxelManager;
        const imageData = mapper.getInputData();
        const array = imageData.getPointData().getArray(0);
        const baseData = array.getData();
        const newComp = 2;
        const dims = segImageData.getDimensions();
        const slices = Array.from({ length: dims[2] }, (_, i) => i);
        for (const z of slices) {
            for (let y = 0; y < dims[1]; ++y) {
                for (let x = 0; x < dims[0]; ++x) {
                    const iTuple = x + dims[0] * (y + dims[1] * z);
                    baseData[iTuple * newComp + 1] = segVoxelManager.getAtIndex(iTuple);
                }
            }
        }
        array.setData(baseData);
        imageData.modified();
        viewport.render();
    }
    esm.eventTarget.addEventListenerDebounced(enums.Events.SEGMENTATION_DATA_MODIFIED, onSegmentationDataModified, 200);
    esm.eventTarget.addEventListener(enums.Events.SEGMENTATION_REPRESENTATION_REMOVED, async (evt) => {
        esm.eventTarget.removeEventListener(enums.Events.SEGMENTATION_DATA_MODIFIED, onSegmentationDataModified);
        const actorEntry = viewport.getActor(uid);
        const { element, id } = viewport;
        viewport.removeActors([uid]);
        const actor = await (0,esm.createVolumeActor)({
            volumeId: uid,
            blendMode: esm.Enums.BlendModes.MAXIMUM_INTENSITY_BLEND,
            callback: ({ volumeActor }) => {
                if (actorEntry.callback) {
                    actorEntry.callback({
                        volumeActor,
                        volumeId,
                    });
                }
            },
        }, element, id);
        viewport.addActor({ actor, uid });
        viewport.render();
    });
    return {
        uid,
        actor,
    };
}

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Labelmap/addLabelmapToElement.js






const { uuidv4 } = esm.utilities;
async function addLabelmapToElement(element, labelMapData, segmentationId, config) {
    const enabledElement = (0,esm.getEnabledElement)(element);
    const { renderingEngine, viewport } = enabledElement;
    const { id: viewportId } = viewport;
    const visibility = true;
    const immediateRender = false;
    const suppressEvents = true;
    if (viewport instanceof esm.BaseVolumeViewport) {
        const volumeLabelMapData = labelMapData;
        const volumeId = _ensureVolumeHasVolumeId(volumeLabelMapData, segmentationId);
        if (!esm.cache.getVolume(volumeId)) {
            await _handleMissingVolume(labelMapData);
        }
        let blendMode = config?.blendMode ?? esm.Enums.BlendModes.MAXIMUM_INTENSITY_BLEND;
        let useIndependentComponents = blendMode === esm.Enums.BlendModes.LABELMAP_EDGE_PROJECTION_BLEND;
        if (useIndependentComponents) {
            const referenceVolumeId = viewport.getVolumeId();
            const baseVolume = esm.cache.getVolume(referenceVolumeId);
            const segVolume = esm.cache.getVolume(volumeId);
            const segDims = segVolume.dimensions;
            const refDims = baseVolume.dimensions;
            if (segDims[0] !== refDims[0] ||
                segDims[1] !== refDims[1] ||
                segDims[2] !== refDims[2]) {
                useIndependentComponents = false;
                blendMode = esm.Enums.BlendModes.MAXIMUM_INTENSITY_BLEND;
                console.debug('Dimensions mismatch - falling back to regular volume addition');
            }
        }
        const volumeInputs = [
            {
                volumeId,
                visibility,
                representationUID: `${segmentationId}-${enums.SegmentationRepresentations.Labelmap}`,
                useIndependentComponents,
                blendMode,
            },
        ];
        if (!volumeInputs[0].useIndependentComponents) {
            await (0,esm.addVolumesToViewports)(renderingEngine, volumeInputs, [viewportId], immediateRender, suppressEvents);
        }
        else {
            const result = await addVolumesAsIndependentComponents({
                viewport,
                volumeInputs,
                segmentationId,
            });
            return result;
        }
    }
    else {
        const segmentationImageIds = (0,getCurrentLabelmapImageIdForViewport/* getCurrentLabelmapImageIdsForViewport */.aF)(viewport.id, segmentationId);
        const stackInputs = segmentationImageIds.map((imageId) => ({
            imageId,
            representationUID: `${segmentationId}-${enums.SegmentationRepresentations.Labelmap}-${imageId}`,
        }));
        (0,esm.addImageSlicesToViewports)(renderingEngine, stackInputs, [viewportId]);
    }
    (0,triggerSegmentationEvents.triggerSegmentationDataModified)(segmentationId);
}
function _ensureVolumeHasVolumeId(labelMapData, segmentationId) {
    let { volumeId } = labelMapData;
    if (!volumeId) {
        volumeId = uuidv4();
        const segmentation = (0,getSegmentation/* getSegmentation */.T)(segmentationId);
        segmentation.representationData.Labelmap = {
            ...segmentation.representationData.Labelmap,
            volumeId,
        };
        labelMapData.volumeId = volumeId;
        (0,triggerSegmentationEvents.triggerSegmentationModified)(segmentationId);
    }
    return volumeId;
}
async function _handleMissingVolume(labelMapData) {
    const stackData = labelMapData;
    const hasImageIds = stackData.imageIds.length > 0;
    if (!hasImageIds) {
        throw new Error('cannot create labelmap, no imageIds found for the volume labelmap');
    }
    const volume = await esm.volumeLoader.createAndCacheVolumeFromImages(labelMapData.volumeId || uuidv4(), stackData.imageIds);
    return volume;
}
/* harmony default export */ const Labelmap_addLabelmapToElement = (addLabelmapToElement);


/***/ }),

/***/ 53486:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const defaultLabelmapConfig = {
    renderOutline: true,
    renderOutlineInactive: true,
    outlineWidth: 3,
    outlineWidthInactive: 2,
    activeSegmentOutlineWidthDelta: 0,
    renderFill: true,
    renderFillInactive: true,
    fillAlpha: 0.5,
    fillAlphaInactive: 0.4,
    outlineOpacity: 1,
    outlineOpacityInactive: 0.85,
};
function getDefaultLabelmapStyle() {
    return defaultLabelmapConfig;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getDefaultLabelmapStyle);


/***/ }),

/***/ 88234:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _stateManagement_segmentation_helpers_getSegmentationActor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(59452);


function removeLabelmapFromElement(element, segmentationId) {
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
    const { viewport } = enabledElement;
    viewport.removeActors([(0,_stateManagement_segmentation_helpers_getSegmentationActor__WEBPACK_IMPORTED_MODULE_1__/* .getLabelmapActorUID */ .Qe)(viewport.id, segmentationId)]);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (removeLabelmapFromElement);


/***/ }),

/***/ 18796:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _kitware_vtk_js_Rendering_Core_Mapper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(82409);
/* harmony import */ var _kitware_vtk_js_Rendering_Core_Actor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7019);
/* harmony import */ var _kitware_vtk_js_Common_DataModel_PolyData__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(87275);
/* harmony import */ var _kitware_vtk_js_Common_Core_CellArray__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(35056);
/* harmony import */ var _stateManagement_segmentation_helpers_getSegmentationActor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(59452);







function addOrUpdateSurfaceToElement(element, surface, segmentationId) {
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
    const { viewport } = enabledElement;
    const surfaceActorEntry = (0,_stateManagement_segmentation_helpers_getSegmentationActor__WEBPACK_IMPORTED_MODULE_5__/* .getSurfaceActorEntry */ .Th)(viewport.id, segmentationId, surface.segmentIndex);
    const surfaceActor = surfaceActorEntry?.actor;
    const isVisible = surface.visible;
    if (surfaceActor) {
        surfaceActor.setVisibility(isVisible);
        if (!isVisible) {
            return;
        }
        const surfaceMapper = surfaceActor.getMapper();
        const currentPolyData = surfaceMapper.getInputData();
        const newPoints = surface.points;
        const newPolys = surface.polys;
        const currentPoints = currentPolyData.getPoints().getData();
        const currentPolys = currentPolyData.getPolys().getData();
        if (newPoints.length === currentPoints.length &&
            newPolys.length === currentPolys.length) {
            return;
        }
        const polyData = _kitware_vtk_js_Common_DataModel_PolyData__WEBPACK_IMPORTED_MODULE_3__/* ["default"].newInstance */ .Ay.newInstance();
        polyData.getPoints().setData(newPoints, 3);
        const triangles = _kitware_vtk_js_Common_Core_CellArray__WEBPACK_IMPORTED_MODULE_4__/* ["default"].newInstance */ .Ay.newInstance({
            values: Float32Array.from(newPolys),
        });
        polyData.setPolys(triangles);
        surfaceMapper.setInputData(polyData);
        surfaceMapper.modified();
        viewport.getRenderer().resetCameraClippingRange();
        return;
    }
    const points = surface.points;
    const polys = surface.polys;
    const color = surface.color;
    const surfacePolyData = _kitware_vtk_js_Common_DataModel_PolyData__WEBPACK_IMPORTED_MODULE_3__/* ["default"].newInstance */ .Ay.newInstance();
    surfacePolyData.getPoints().setData(points, 3);
    const triangles = _kitware_vtk_js_Common_Core_CellArray__WEBPACK_IMPORTED_MODULE_4__/* ["default"].newInstance */ .Ay.newInstance({
        values: Float32Array.from(polys),
    });
    surfacePolyData.setPolys(triangles);
    const mapper = _kitware_vtk_js_Rendering_Core_Mapper__WEBPACK_IMPORTED_MODULE_1__/* ["default"].newInstance */ .Ay.newInstance({});
    let clippingFilter;
    mapper.setInputData(surfacePolyData);
    const actor = _kitware_vtk_js_Rendering_Core_Actor__WEBPACK_IMPORTED_MODULE_2__/* ["default"].newInstance */ .Ay.newInstance();
    actor.setMapper(mapper);
    actor.getProperty().setColor(color[0] / 255, color[1] / 255, color[2] / 255);
    actor.getProperty().setLineWidth(2);
    const representationUID = (0,_stateManagement_segmentation_helpers_getSegmentationActor__WEBPACK_IMPORTED_MODULE_5__/* .getSurfaceRepresentationUID */ .DU)(segmentationId, surface.segmentIndex);
    viewport.addActor({
        uid: _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.uuidv4(),
        actor: actor,
        clippingFilter,
        representationUID,
    });
    viewport.resetCamera();
    viewport.getRenderer().resetCameraClippingRange();
    viewport.render();
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (addOrUpdateSurfaceToElement);


/***/ }),

/***/ 20552:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);

function removeSurfaceFromElement(element, segmentationId) {
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
    const { viewport } = enabledElement;
    const actorEntries = viewport.getActors();
    const filteredSurfaceActors = actorEntries.filter((actor) => actor.representationUID &&
        typeof actor.representationUID === 'string' &&
        actor.representationUID.startsWith(segmentationId));
    viewport.removeActors(filteredSurfaceActors.map((actor) => actor.uid));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (removeSurfaceFromElement);


/***/ }),

/***/ 55887:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ BrushStrategy)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _stateManagement_segmentation_triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(49906);
/* harmony import */ var _compositions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11990);
/* harmony import */ var _utils_getStrategyData__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(40905);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(99737);





class BrushStrategy {
    static { this.COMPOSITIONS = _compositions__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A; }
    static { this.childFunctions = {
        [_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.OnInteractionStart]: addListMethod(_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.OnInteractionStart, _enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.Initialize),
        [_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.OnInteractionEnd]: addListMethod(_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.OnInteractionEnd, _enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.Initialize),
        [_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.Fill]: addListMethod(_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.Fill),
        [_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.Initialize]: addListMethod(_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.Initialize),
        [_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.CreateIsInThreshold]: addSingletonMethod(_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.CreateIsInThreshold),
        [_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.Interpolate]: addListMethod(_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.Interpolate, _enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.Initialize),
        [_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.AcceptPreview]: addListMethod(_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.AcceptPreview, _enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.Initialize),
        [_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.RejectPreview]: addListMethod(_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.RejectPreview, _enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.Initialize),
        [_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.INTERNAL_setValue]: addSingletonMethod(_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.INTERNAL_setValue),
        [_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.Preview]: addSingletonMethod(_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.Preview, false),
        [_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.ComputeInnerCircleRadius]: addListMethod(_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.ComputeInnerCircleRadius),
        [_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.EnsureSegmentationVolumeFor3DManipulation]: addListMethod(_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.EnsureSegmentationVolumeFor3DManipulation),
        [_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.EnsureImageVolumeFor3DManipulation]: addListMethod(_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.EnsureImageVolumeFor3DManipulation),
        [_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.AddPreview]: addListMethod(_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.AddPreview),
        [_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.GetStatistics]: addSingletonMethod(_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.GetStatistics),
        compositions: null,
    }; }
    constructor(name, ...initializers) {
        this._initialize = [];
        this._fill = [];
        this._onInteractionStart = [];
        this.fill = (enabledElement, operationData) => {
            const initializedData = this.initialize(enabledElement, operationData, _enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.Fill);
            if (!initializedData) {
                return;
            }
            this._fill.forEach((func) => func(initializedData));
            const { segmentationVoxelManager, segmentIndex } = initializedData;
            (0,_stateManagement_segmentation_triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_1__.triggerSegmentationDataModified)(initializedData.segmentationId, segmentationVoxelManager.getArrayOfModifiedSlices(), segmentIndex);
            return initializedData;
        };
        this.onInteractionStart = (enabledElement, operationData) => {
            const initializedData = this.initialize(enabledElement, operationData);
            if (!initializedData) {
                return;
            }
            this._onInteractionStart.forEach((func) => func.call(this, initializedData));
        };
        this.addPreview = (enabledElement, operationData) => {
            const initializedData = this.initialize(enabledElement, operationData, _enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.AddPreview);
            if (!initializedData) {
                return;
            }
            return initializedData;
        };
        this.configurationName = name;
        this.compositions = initializers;
        initializers.forEach((initializer) => {
            const result = typeof initializer === 'function' ? initializer() : initializer;
            if (!result) {
                return;
            }
            for (const key in result) {
                if (!BrushStrategy.childFunctions[key]) {
                    throw new Error(`Didn't find ${key} as a brush strategy`);
                }
                BrushStrategy.childFunctions[key](this, result[key]);
            }
        });
        this.strategyFunction = (enabledElement, operationData) => {
            return this.fill(enabledElement, operationData);
        };
        for (const key of Object.keys(BrushStrategy.childFunctions)) {
            this.strategyFunction[key] = this[key];
        }
    }
    initialize(enabledElement, operationData, operationName) {
        const { viewport } = enabledElement;
        const data = (0,_utils_getStrategyData__WEBPACK_IMPORTED_MODULE_3__/* .getStrategyData */ .S)({ operationData, viewport, strategy: this });
        if (!data) {
            return null;
        }
        const { imageVoxelManager, segmentationVoxelManager, segmentationImageData, } = data;
        const memo = operationData.createMemo(operationData.segmentationId, segmentationVoxelManager);
        const initializedData = {
            operationName,
            ...operationData,
            segmentIndex: operationData.segmentIndex,
            enabledElement,
            imageVoxelManager,
            segmentationVoxelManager,
            segmentationImageData,
            viewport,
            centerWorld: null,
            isInObject: null,
            isInObjectBoundsIJK: null,
            brushStrategy: this,
            memo,
        };
        this._initialize.forEach((func) => func(initializedData));
        return initializedData;
    }
}
function addListMethod(name, createInitialized) {
    const listName = `_${name}`;
    return (brushStrategy, func) => {
        brushStrategy[listName] ||= [];
        brushStrategy[listName].push(func);
        brushStrategy[name] ||= createInitialized
            ? (enabledElement, operationData, ...args) => {
                const initializedData = brushStrategy[createInitialized](enabledElement, operationData, name);
                let returnValue;
                brushStrategy[listName].forEach((func) => {
                    const value = func.call(brushStrategy, initializedData, ...args);
                    returnValue ||= value;
                });
                return returnValue;
            }
            : (operationData, ...args) => {
                brushStrategy[listName].forEach((func) => func.call(brushStrategy, operationData, ...args));
            };
    };
}
function addSingletonMethod(name, isInitialized = true) {
    return (brushStrategy, func) => {
        if (brushStrategy[name]) {
            throw new Error(`The singleton method ${name} already exists`);
        }
        brushStrategy[name] = isInitialized
            ? func
            : (enabledElement, operationData, ...args) => {
                operationData.enabledElement = enabledElement;
                return func.call(brushStrategy, operationData, ...args);
            };
    };
}


/***/ }),

/***/ 11990:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ compositions)
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/StrategyCallbacks.js
var StrategyCallbacks = __webpack_require__(84093);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/determineSegmentIndex.js

/* harmony default export */ const determineSegmentIndex = ({
    [StrategyCallbacks/* default */.A.OnInteractionStart]: (operationData) => {
        const { segmentIndex, previewSegmentIndex, segmentationVoxelManager, centerIJK, viewPlaneNormal, segmentationImageData, configuration, } = operationData;
        if (!configuration?.useCenterSegmentIndex) {
            return;
        }
        let hasSegmentIndex = false;
        let hasPreviewIndex = false;
        const nestedBounds = [
            ...segmentationVoxelManager.getBoundsIJK(),
        ];
        if (Math.abs(viewPlaneNormal[0]) > 0.8) {
            nestedBounds[0] = [centerIJK[0], centerIJK[0]];
        }
        else if (Math.abs(viewPlaneNormal[1]) > 0.8) {
            nestedBounds[1] = [centerIJK[1], centerIJK[1]];
        }
        else if (Math.abs(viewPlaneNormal[2]) > 0.8) {
            nestedBounds[2] = [centerIJK[2], centerIJK[2]];
        }
        const callback = ({ value }) => {
            hasSegmentIndex ||= value === segmentIndex;
            hasPreviewIndex ||= value === previewSegmentIndex;
        };
        segmentationVoxelManager.forEach(callback, {
            imageData: segmentationImageData,
            isInObject: operationData.isInObject,
            boundsIJK: nestedBounds,
        });
        if (!hasSegmentIndex && !hasPreviewIndex) {
            operationData.centerSegmentIndexInfo.segmentIndex = null;
            return;
        }
        const existingValue = segmentationVoxelManager.getAtIJKPoint(centerIJK);
        operationData.centerSegmentIndexInfo.segmentIndex = existingValue;
        operationData.centerSegmentIndexInfo.hasSegmentIndex = hasSegmentIndex;
        operationData.centerSegmentIndexInfo.hasPreviewIndex = hasPreviewIndex;
    },
});

// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/index.js + 1 modules
var esm = __webpack_require__(3823);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/dynamicThreshold.js


/* harmony default export */ const dynamicThreshold = ({
    [StrategyCallbacks/* default */.A.Initialize]: (operationData) => {
        const { operationName, centerIJK, segmentationVoxelManager, imageVoxelManager, configuration, segmentIndex, viewport, } = operationData;
        if (!configuration?.threshold?.isDynamic || !centerIJK || !segmentIndex) {
            return;
        }
        if (operationName === StrategyCallbacks/* default */.A.RejectPreview ||
            operationName === StrategyCallbacks/* default */.A.OnInteractionEnd) {
            return;
        }
        const boundsIJK = segmentationVoxelManager.getBoundsIJK();
        const { range: oldThreshold, dynamicRadius = 0 } = configuration.threshold;
        const useDelta = oldThreshold ? 0 : dynamicRadius;
        const { viewPlaneNormal } = viewport.getCamera();
        const nestedBounds = boundsIJK.map((ijk, idx) => {
            const [min, max] = ijk;
            return [
                Math.max(min, centerIJK[idx] - useDelta),
                Math.min(max, centerIJK[idx] + useDelta),
            ];
        });
        if (Math.abs(viewPlaneNormal[0]) > 0.8) {
            nestedBounds[0] = [centerIJK[0], centerIJK[0]];
        }
        else if (Math.abs(viewPlaneNormal[1]) > 0.8) {
            nestedBounds[1] = [centerIJK[1], centerIJK[1]];
        }
        else if (Math.abs(viewPlaneNormal[2]) > 0.8) {
            nestedBounds[2] = [centerIJK[2], centerIJK[2]];
        }
        const threshold = oldThreshold || [Infinity, -Infinity];
        const useDeltaSqr = useDelta * useDelta;
        const callback = ({ value, pointIJK }) => {
            const distance = esm/* vec3.sqrDist */.eR.sqrDist(centerIJK, pointIJK);
            if (distance > useDeltaSqr) {
                return;
            }
            const gray = Array.isArray(value) ? esm/* vec3.len */.eR.len(value) : value;
            threshold[0] = Math.min(gray, threshold[0]);
            threshold[1] = Math.max(gray, threshold[1]);
        };
        imageVoxelManager.forEach(callback, { boundsIJK: nestedBounds });
        configuration.threshold.range = threshold;
    },
    [StrategyCallbacks/* default */.A.OnInteractionStart]: (operationData) => {
        const { configuration } = operationData;
        if (!configuration?.threshold?.isDynamic) {
            return;
        }
        configuration.threshold.range = null;
    },
    [StrategyCallbacks/* default */.A.ComputeInnerCircleRadius]: (operationData) => {
        const { configuration, viewport } = operationData;
        const { dynamicRadius = 0, isDynamic } = configuration.threshold;
        if (!isDynamic) {
            configuration.threshold.dynamicRadiusInCanvas = 0;
            return;
        }
        if (dynamicRadius === 0) {
            return;
        }
        const imageData = viewport.getImageData();
        if (!imageData) {
            return;
        }
        const { spacing } = imageData;
        const centerCanvas = [
            viewport.element.clientWidth / 2,
            viewport.element.clientHeight / 2,
        ];
        const radiusInWorld = dynamicRadius * spacing[0];
        const centerCursorInWorld = viewport.canvasToWorld(centerCanvas);
        const offSetCenterInWorld = centerCursorInWorld.map((coord) => coord + radiusInWorld);
        const offSetCenterCanvas = viewport.worldToCanvas(offSetCenterInWorld);
        const dynamicRadiusInCanvas = Math.abs(centerCanvas[0] - offSetCenterCanvas[0]);
        if (!configuration.threshold.dynamicRadiusInCanvas) {
            configuration.threshold.dynamicRadiusInCanvas = 0;
        }
        configuration.threshold.dynamicRadiusInCanvas = 3 + dynamicRadiusInCanvas;
    },
});

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/erase.js

/* harmony default export */ const erase = ({
    [StrategyCallbacks/* default */.A.Initialize]: (operationData) => {
        operationData.segmentIndex = 0;
    },
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/triggerSegmentationEvents.js
var triggerSegmentationEvents = __webpack_require__(49906);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/islandRemoval.js
var segmentation_islandRemoval = __webpack_require__(67912);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/islandRemovalComposition.js



/* harmony default export */ const islandRemovalComposition = ({
    [StrategyCallbacks/* default */.A.OnInteractionEnd]: (operationData) => {
        const { previewSegmentIndex, segmentIndex, viewport, segmentationVoxelManager, activeStrategy, memo, } = operationData;
        if (activeStrategy !== 'THRESHOLD_INSIDE_SPHERE_WITH_ISLAND_REMOVAL' ||
            segmentIndex === null) {
            return;
        }
        const islandRemoval = new segmentation_islandRemoval/* default */.A();
        const voxelManager = memo?.voxelManager || segmentationVoxelManager;
        if (!islandRemoval.initialize(viewport, voxelManager, {
            previewSegmentIndex,
            segmentIndex,
        })) {
            return;
        }
        islandRemoval.floodFillSegmentIsland();
        islandRemoval.removeExternalIslands();
        islandRemoval.removeInternalIslands();
        const arrayOfSlices = voxelManager.getArrayOfModifiedSlices();
        if (!arrayOfSlices) {
            return;
        }
        (0,triggerSegmentationEvents.triggerSegmentationDataModified)(operationData.segmentationId, arrayOfSlices, previewSegmentIndex);
    },
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var dist_esm = __webpack_require__(15327);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/events/triggerSegmentationDataModified.js
var triggerSegmentationDataModified = __webpack_require__(98798);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/config/segmentationColor.js
var segmentationColor = __webpack_require__(93733);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getViewportIdsWithSegmentation.js
var getViewportIdsWithSegmentation = __webpack_require__(58859);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/preview.js





/* harmony default export */ const preview = ({
    [StrategyCallbacks/* default */.A.Preview]: function (operationData) {
        const { previewSegmentIndex, configuration, enabledElement } = operationData;
        if (!previewSegmentIndex || !configuration) {
            return;
        }
        this.onInteractionStart?.(enabledElement, operationData);
        const preview = this.fill(enabledElement, operationData);
        if (preview) {
            this.onInteractionEnd?.(enabledElement, operationData);
        }
        return preview;
    },
    [StrategyCallbacks/* default */.A.Initialize]: (operationData) => {
        const { segmentIndex, previewColor, previewSegmentIndex } = operationData;
        if (previewSegmentIndex == null || segmentIndex == null) {
            return;
        }
        const viewportIds = (0,getViewportIdsWithSegmentation/* getViewportIdsWithSegmentation */.P)(operationData.segmentationId);
        viewportIds?.forEach((viewportId) => {
            (0,segmentationColor.setSegmentIndexColor)(viewportId, operationData.segmentationId, previewSegmentIndex, previewColor);
        });
    },
    [StrategyCallbacks/* default */.A.AcceptPreview]: (operationData) => {
        const { previewSegmentIndex, segmentationVoxelManager, memo, segmentIndex, centerSegmentIndexInfo, } = operationData || {};
        const { changedIndices } = centerSegmentIndexInfo || {};
        const labelmapMemo = memo;
        const callback = ({ index }) => {
            const oldValue = segmentationVoxelManager.getAtIndex(index);
            if (changedIndices?.length > 0) {
                if (changedIndices.includes(index)) {
                    labelmapMemo.voxelManager.setAtIndex(index, 0);
                }
            }
            else {
                if (oldValue === previewSegmentIndex) {
                    labelmapMemo.voxelManager.setAtIndex(index, segmentIndex);
                }
            }
        };
        segmentationVoxelManager.forEach(callback);
        (0,triggerSegmentationDataModified/* triggerSegmentationDataModified */.Q)(operationData.segmentationId, segmentationVoxelManager.getArrayOfModifiedSlices(), segmentIndex);
        operationData.centerSegmentIndexInfo.changedIndices = [];
    },
    [StrategyCallbacks/* default */.A.RejectPreview]: (operationData) => {
        if (!operationData) {
            return;
        }
        dist_esm.utilities.HistoryMemo.DefaultHistoryMemo.undoIf((memo) => {
            const labelmapMemo = memo;
            if (!labelmapMemo?.voxelManager) {
                return false;
            }
            const { segmentationVoxelManager } = labelmapMemo;
            let hasPreviewSegmentIndex = false;
            const callback = ({ value }) => {
                if (value === operationData.previewSegmentIndex) {
                    hasPreviewSegmentIndex = true;
                }
            };
            segmentationVoxelManager.forEach(callback);
            return hasPreviewSegmentIndex;
        });
    },
});

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/regionFill.js

/* harmony default export */ const regionFill = ({
    [StrategyCallbacks/* default */.A.Fill]: (operationData) => {
        const { segmentsLocked, segmentationImageData, segmentationVoxelManager, brushStrategy, centerIJK, } = operationData;
        const isWithinThreshold = brushStrategy.createIsInThreshold?.(operationData);
        const { setValue } = brushStrategy;
        const callback = isWithinThreshold
            ? (data) => {
                const { value, index } = data;
                if (segmentsLocked.includes(value) || !isWithinThreshold(index)) {
                    return;
                }
                setValue(operationData, data);
            }
            : (data) => setValue(operationData, data);
        segmentationVoxelManager.forEach(callback, {
            imageData: segmentationImageData,
            isInObject: operationData.isInObject,
            boundsIJK: operationData.isInObjectBoundsIJK,
        });
        segmentationVoxelManager.addPoint(centerIJK);
    },
});

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/utils/handleUseSegmentCenterIndex.js
function handleUseSegmentCenterIndex({ operationData, existingValue, index, }) {
    const { previewSegmentIndex, memo, centerSegmentIndexInfo, previewOnHover, segmentIndex, } = operationData;
    const { hasPreviewIndex, hasSegmentIndex, segmentIndex: centerSegmentIndex, } = centerSegmentIndexInfo;
    if (centerSegmentIndex === 0 && hasSegmentIndex && hasPreviewIndex) {
        if (existingValue === segmentIndex) {
            return;
        }
        if (previewOnHover) {
            return;
        }
        if (existingValue === previewSegmentIndex) {
            memo.voxelManager.setAtIndex(index, 0);
            return;
        }
        return;
    }
    if (centerSegmentIndex === 0 && hasSegmentIndex && !hasPreviewIndex) {
        if (existingValue === 0 || existingValue !== segmentIndex) {
            return;
        }
        memo.voxelManager.setAtIndex(index, previewSegmentIndex);
        centerSegmentIndexInfo.changedIndices.push(index);
        return;
    }
    if (centerSegmentIndex === 0 && !hasSegmentIndex && hasPreviewIndex) {
        if (existingValue === segmentIndex) {
            return;
        }
        if (previewOnHover) {
            return;
        }
        if (existingValue === previewSegmentIndex) {
            memo.voxelManager.setAtIndex(index, 0);
            return;
        }
        return;
    }
    if (centerSegmentIndex === 0 && !hasSegmentIndex && !hasPreviewIndex) {
        if (existingValue === segmentIndex) {
            return;
        }
        if (existingValue === previewSegmentIndex) {
            memo.voxelManager.setAtIndex(index, previewSegmentIndex);
            return;
        }
        return;
    }
    if (centerSegmentIndex === previewSegmentIndex &&
        hasSegmentIndex &&
        hasPreviewIndex) {
        if (existingValue === segmentIndex) {
            return;
        }
        memo.voxelManager.setAtIndex(index, previewSegmentIndex);
        return;
    }
    if (centerSegmentIndex === previewSegmentIndex &&
        !hasSegmentIndex &&
        hasPreviewIndex) {
        if (existingValue === segmentIndex) {
            return;
        }
        memo.voxelManager.setAtIndex(index, previewSegmentIndex);
        return;
    }
    if (centerSegmentIndex === segmentIndex &&
        hasSegmentIndex &&
        hasPreviewIndex) {
        if (existingValue === segmentIndex) {
            return;
        }
        memo.voxelManager.setAtIndex(index, previewSegmentIndex);
        return;
    }
    if (centerSegmentIndex === segmentIndex &&
        hasSegmentIndex &&
        !hasPreviewIndex) {
        if (existingValue === segmentIndex) {
            return;
        }
        memo.voxelManager.setAtIndex(index, previewSegmentIndex);
        return;
    }
}

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/setValue.js


/* harmony default export */ const setValue = ({
    [StrategyCallbacks/* default */.A.INTERNAL_setValue]: (operationData, { value, index }) => {
        const { segmentsLocked, previewSegmentIndex, memo, segmentationVoxelManager, centerSegmentIndexInfo, segmentIndex, } = operationData;
        const existingValue = segmentationVoxelManager.getAtIndex(index);
        if (segmentsLocked.includes(value)) {
            return;
        }
        if (!centerSegmentIndexInfo && existingValue === segmentIndex) {
            return;
        }
        if (centerSegmentIndexInfo?.segmentIndex !== 0 &&
            existingValue === segmentIndex) {
            return;
        }
        if (centerSegmentIndexInfo?.segmentIndex === null) {
            memo.voxelManager.setAtIndex(index, previewSegmentIndex ?? segmentIndex);
            return;
        }
        if (!previewSegmentIndex) {
            let useSegmentIndex = segmentIndex;
            if (centerSegmentIndexInfo) {
                useSegmentIndex = centerSegmentIndexInfo.segmentIndex;
            }
            memo.voxelManager.setAtIndex(index, useSegmentIndex);
            return;
        }
        handleUseSegmentCenterIndex({
            operationData,
            existingValue,
            index,
        });
    },
});

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/threshold.js


/* harmony default export */ const threshold = ({
    [StrategyCallbacks/* default */.A.CreateIsInThreshold]: (operationData) => {
        const { imageVoxelManager, segmentIndex, configuration } = operationData;
        if (!configuration || !segmentIndex) {
            return;
        }
        return (index) => {
            const voxelValue = imageVoxelManager.getAtIndex(index);
            const gray = Array.isArray(voxelValue)
                ? esm/* vec3.length */.eR.length(voxelValue)
                : voxelValue;
            const { threshold } = configuration || {};
            if (!threshold?.range?.length) {
                return true;
            }
            return threshold.range[0] <= gray && gray <= threshold.range[1];
        };
    },
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getStatistics.js
var getStatistics = __webpack_require__(38440);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/labelmapStatistics.js


/* harmony default export */ const labelmapStatistics = ({
    [StrategyCallbacks/* default */.A.GetStatistics]: function (enabledElement, operationData, options) {
        const { indices } = options;
        const { segmentationId, viewport } = operationData;
        (0,getStatistics/* default */.A)({
            segmentationId,
            segmentIndices: indices,
        });
    },
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/ensureSegmentationVolume.js
var ensureSegmentationVolume = __webpack_require__(38732);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/ensureImageVolume.js
var ensureImageVolume = __webpack_require__(62753);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/segmentation/strategies/compositions/index.js











/* harmony default export */ const compositions = ({
    determineSegmentIndex: determineSegmentIndex,
    dynamicThreshold: dynamicThreshold,
    erase: erase,
    islandRemoval: islandRemovalComposition,
    preview: preview,
    regionFill: regionFill,
    setValue: setValue,
    threshold: threshold,
    labelmapStatistics: labelmapStatistics,
    ensureSegmentationVolumeFor3DManipulation: ensureSegmentationVolume/* default */.A,
    ensureImageVolumeFor3DManipulation: ensureImageVolume/* default */.A,
});


/***/ }),

/***/ 33852:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   r: () => (/* binding */ eraseInsideCircle)
/* harmony export */ });
/* harmony import */ var _BrushStrategy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(55887);
/* harmony import */ var _fillCircle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(56789);
/* harmony import */ var _compositions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11990);



const ERASE_CIRCLE_STRATEGY = new _BrushStrategy__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A('EraseCircle', _compositions__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.erase, ..._fillCircle__WEBPACK_IMPORTED_MODULE_1__/* .CIRCLE_STRATEGY */ .pB.compositions);
const eraseInsideCircle = ERASE_CIRCLE_STRATEGY.strategyFunction;



/***/ }),

/***/ 1989:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _: () => (/* binding */ eraseInsideSphere)
/* harmony export */ });
/* harmony import */ var _BrushStrategy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(55887);
/* harmony import */ var _fillSphere__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(17492);
/* harmony import */ var _compositions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11990);



const ERASE_SPHERE_STRATEGY = new _BrushStrategy__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A('EraseSphere', _compositions__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.erase, ..._fillSphere__WEBPACK_IMPORTED_MODULE_1__/* .SPHERE_STRATEGY */ .u8.compositions);
const eraseInsideSphere = ERASE_SPHERE_STRATEGY.strategyFunction;



/***/ }),

/***/ 17492:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Jq: () => (/* binding */ fillInsideSphere),
/* harmony export */   Sw: () => (/* binding */ thresholdInsideSphereIsland),
/* harmony export */   rd: () => (/* binding */ thresholdInsideSphere),
/* harmony export */   u8: () => (/* binding */ SPHERE_STRATEGY)
/* harmony export */ });
/* unused harmony export fillOutsideSphere */
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3823);
/* harmony import */ var _BrushStrategy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(55887);
/* harmony import */ var _compositions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(11990);
/* harmony import */ var _enums_StrategyCallbacks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(84093);
/* harmony import */ var _fillCircle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(56789);
/* harmony import */ var _utilities_getSphereBoundsInfo__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(4296);






const { transformWorldToIndex } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities;

const sphereComposition = {
    [_enums_StrategyCallbacks__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A.Initialize]: (operationData) => {
        const { points, viewport, segmentationImageData } = operationData;
        if (!points) {
            return;
        }
        const center = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.fromValues */ .eR.fromValues(0, 0, 0);
        points.forEach((point) => {
            gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.add */ .eR.add(center, center, point);
        });
        gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.scale */ .eR.scale(center, center, 1 / points.length);
        operationData.centerWorld = center;
        operationData.centerIJK = transformWorldToIndex(segmentationImageData, center);
        const { boundsIJK: newBoundsIJK, topLeftWorld, bottomRightWorld, } = (0,_utilities_getSphereBoundsInfo__WEBPACK_IMPORTED_MODULE_6__/* .getSphereBoundsInfoFromViewport */ .l)(points.slice(0, 2), segmentationImageData, viewport);
        operationData.isInObjectBoundsIJK = newBoundsIJK;
        operationData.isInObject = (0,_fillCircle__WEBPACK_IMPORTED_MODULE_5__/* .createEllipseInPoint */ .mu)({
            topLeftWorld,
            bottomRightWorld,
            center,
        });
    },
};
const SPHERE_STRATEGY = new _BrushStrategy__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A('Sphere', _compositions__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.regionFill, _compositions__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.setValue, sphereComposition, _compositions__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.determineSegmentIndex, _compositions__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.preview, _compositions__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.labelmapStatistics, _compositions__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.ensureSegmentationVolumeFor3DManipulation);
const fillInsideSphere = SPHERE_STRATEGY.strategyFunction;
const SPHERE_THRESHOLD_STRATEGY = new _BrushStrategy__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A('SphereThreshold', ...SPHERE_STRATEGY.compositions, _compositions__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.dynamicThreshold, _compositions__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.threshold, _compositions__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.ensureSegmentationVolumeFor3DManipulation, _compositions__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.ensureImageVolumeFor3DManipulation);
const SPHERE_THRESHOLD_STRATEGY_ISLAND = new _BrushStrategy__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A('SphereThreshold', ...SPHERE_STRATEGY.compositions, _compositions__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.dynamicThreshold, _compositions__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.threshold, _compositions__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.islandRemoval, _compositions__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.ensureSegmentationVolumeFor3DManipulation, _compositions__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.ensureImageVolumeFor3DManipulation);
const thresholdInsideSphere = SPHERE_THRESHOLD_STRATEGY.strategyFunction;
const thresholdInsideSphereIsland = SPHERE_THRESHOLD_STRATEGY_ISLAND.strategyFunction;
function fillOutsideSphere() {
    throw new Error('fill outside sphere not implemented');
}



/***/ }),

/***/ 40905:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ getStrategyData)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _stateManagement_segmentation_segmentationState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(98870);
/* harmony import */ var _stateManagement_segmentation_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(91963);
/* harmony import */ var _utilities_segmentation_getReferenceVolumeForSegmentationVolume__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(12853);




function getStrategyDataForVolumeViewport({ operationData }) {
    const { volumeId } = operationData;
    if (!volumeId) {
        const event = new CustomEvent(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.Enums.Events.ERROR_EVENT, {
            detail: {
                type: 'Segmentation',
                message: 'No volume id found for the segmentation',
            },
            cancelable: true,
        });
        _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.eventTarget.dispatchEvent(event);
        return null;
    }
    const segmentationVolume = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.cache.getVolume(volumeId);
    const imageVolume = (0,_utilities_segmentation_getReferenceVolumeForSegmentationVolume__WEBPACK_IMPORTED_MODULE_3__/* .getReferenceVolumeForSegmentationVolume */ .b)(volumeId);
    if (!segmentationVolume || !imageVolume) {
        return null;
    }
    const { imageData: segmentationImageData } = segmentationVolume;
    const { voxelManager: segmentationVoxelManager } = segmentationVolume;
    const { voxelManager: imageVoxelManager, imageData } = imageVolume;
    return {
        segmentationImageData,
        segmentationVoxelManager,
        segmentationScalarData: null,
        imageScalarData: null,
        imageVoxelManager,
        imageData,
    };
}
function getStrategyDataForStackViewport({ operationData, viewport, strategy, }) {
    const { segmentationId } = operationData;
    let segmentationImageData;
    let segmentationVoxelManager;
    let segmentationScalarData;
    let imageScalarData;
    let imageVoxelManager;
    let imageData;
    if (strategy.ensureSegmentationVolumeFor3DManipulation) {
        strategy.ensureSegmentationVolumeFor3DManipulation({
            operationData,
            viewport,
        });
        segmentationVoxelManager = operationData.segmentationVoxelManager;
        segmentationImageData = operationData.segmentationImageData;
        segmentationScalarData = null;
    }
    else {
        const labelmapImageId = (0,_stateManagement_segmentation_segmentationState__WEBPACK_IMPORTED_MODULE_1__.getCurrentLabelmapImageIdForViewport)(viewport.id, segmentationId);
        if (!labelmapImageId) {
            return null;
        }
        const actorEntry = (0,_stateManagement_segmentation_helpers__WEBPACK_IMPORTED_MODULE_2__/* .getLabelmapActorEntry */ .wV)(viewport.id, segmentationId);
        if (!actorEntry) {
            return null;
        }
        const currentSegImage = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.cache.getImage(labelmapImageId);
        segmentationImageData = actorEntry.actor.getMapper().getInputData();
        segmentationVoxelManager = currentSegImage.voxelManager;
        const currentSegmentationImageId = operationData.imageId;
        const segmentationImage = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.cache.getImage(currentSegmentationImageId);
        if (!segmentationImage) {
            return null;
        }
        segmentationScalarData = segmentationImage.getPixelData?.();
    }
    if (strategy.ensureImageVolumeFor3DManipulation) {
        strategy.ensureImageVolumeFor3DManipulation({
            operationData,
            viewport,
        });
        imageVoxelManager = operationData.imageVoxelManager;
        imageScalarData = operationData.imageScalarData;
        imageData = operationData.imageData;
    }
    else {
        const currentImageId = viewport.getCurrentImageId();
        if (!currentImageId) {
            return null;
        }
        const image = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.cache.getImage(currentImageId);
        imageData = image ? null : viewport.getImageData();
        imageScalarData = image?.getPixelData() || imageData.getScalarData();
        imageVoxelManager = image?.voxelManager;
    }
    return {
        segmentationImageData,
        segmentationScalarData,
        imageScalarData,
        segmentationVoxelManager,
        imageVoxelManager,
        imageData,
    };
}
function getStrategyData({ operationData, viewport, strategy, }) {
    if (!operationData) {
        return null;
    }
    if (('volumeId' in operationData && operationData.volumeId != null) ||
        ('referencedVolumeId' in operationData &&
            operationData.referencedVolumeId != null)) {
        return getStrategyDataForVolumeViewport({ operationData });
    }
    return getStrategyDataForStackViewport({ operationData, viewport, strategy });
}



/***/ }),

/***/ 109:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class RectangleROIStartEndThreshold {
    constructor() {
    }
    static getContourSequence(toolData, metadataProvider) {
        const { data } = toolData;
        const { projectionPoints, projectionPointsImageIds } = data.cachedStats;
        return projectionPoints.map((point, index) => {
            const ContourData = getPointData(point);
            const ContourImageSequence = getContourImageSequence(projectionPointsImageIds[index], metadataProvider);
            return {
                NumberOfContourPoints: ContourData.length / 3,
                ContourImageSequence,
                ContourGeometricType: 'CLOSED_PLANAR',
                ContourData,
            };
        });
    }
}
RectangleROIStartEndThreshold.toolName = 'RectangleROIStartEndThreshold';
function getPointData(points) {
    const orderedPoints = [
        ...points[0],
        ...points[1],
        ...points[3],
        ...points[2],
    ];
    const pointsArray = orderedPoints.flat();
    const pointsArrayWithPrecision = pointsArray.map((point) => {
        return point.toFixed(2);
    });
    return pointsArrayWithPrecision;
}
function getContourImageSequence(imageId, metadataProvider) {
    const sopCommon = metadataProvider.get('sopCommonModule', imageId);
    return {
        ReferencedSOPClassUID: sopCommon.sopClassUID,
        ReferencedSOPInstanceUID: sopCommon.sopInstanceUID,
    };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RectangleROIStartEndThreshold);


/***/ }),

/***/ 55421:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getInterpolationData)
/* harmony export */ });
/* harmony import */ var _stateManagement_annotation_annotationState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(82056);

const DEFAULT_CONTOUR_SEG_TOOLNAME = 'PlanarFreehandContourSegmentationTool';
function getInterpolationData(viewportData, filterParams = []) {
    const { viewport, sliceData, annotation } = viewportData;
    const interpolationDatas = new Map();
    const { toolName, originalToolName } = annotation.metadata;
    const testToolName = originalToolName || toolName;
    const annotations = ((0,_stateManagement_annotation_annotationState__WEBPACK_IMPORTED_MODULE_0__.getAnnotations)(testToolName, viewport.element) || []).filter((annotation) => !annotation.metadata.originalToolName ||
        annotation.metadata.originalToolName === testToolName);
    if (testToolName !== DEFAULT_CONTOUR_SEG_TOOLNAME) {
        const modifiedAnnotations = (0,_stateManagement_annotation_annotationState__WEBPACK_IMPORTED_MODULE_0__.getAnnotations)(DEFAULT_CONTOUR_SEG_TOOLNAME, viewport.element);
        if (modifiedAnnotations?.length) {
            modifiedAnnotations.forEach((annotation) => {
                const { metadata } = annotation;
                if (metadata.originalToolName === testToolName &&
                    metadata.originalToolName !== metadata.toolName) {
                    annotations.push(annotation);
                }
            });
        }
    }
    if (!annotations?.length) {
        return interpolationDatas;
    }
    for (let i = 0; i < sliceData.numberOfSlices; i++) {
        const imageAnnotations = annotations.filter((x) => x.metadata.sliceIndex === i);
        if (!imageAnnotations?.length) {
            continue;
        }
        const filteredInterpolatedAnnotations = imageAnnotations.filter((imageAnnotation) => {
            return filterParams.every((x) => {
                const parent = x.parentKey
                    ? x.parentKey(imageAnnotation)
                    : imageAnnotation;
                const value = parent?.[x.key];
                if (Array.isArray(value)) {
                    return value.every((item, index) => item === x.value[index]);
                }
                return value === x.value;
            });
        });
        if (filteredInterpolatedAnnotations.length) {
            interpolationDatas.set(i, filteredInterpolatedAnnotations);
        }
    }
    return interpolationDatas;
}


/***/ }),

/***/ 51893:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getInterpolationDataCollection)
/* harmony export */ });
/* harmony import */ var _getInterpolationData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(55421);

function getInterpolationDataCollection(viewportData, filterParams) {
    const imageAnnotations = (0,_getInterpolationData__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(viewportData, filterParams);
    const interpolatedDataCollection = [];
    if (!imageAnnotations?.size) {
        return interpolatedDataCollection;
    }
    for (const annotations of imageAnnotations.values()) {
        annotations.forEach((annotation) => {
            interpolatedDataCollection.push(annotation);
        });
    }
    return interpolatedDataCollection;
}


/***/ }),

/***/ 73816:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ interpolation_interpolate)
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/index.js + 1 modules
var gl_matrix_esm = __webpack_require__(3823);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contours/interpolation/createPolylineToolData.js

function createPolylineToolData(polyline, handlePoints, referencedToolData) {
    const annotation = esm.utilities.deepMerge({
        data: {},
        metadata: {},
    }, referencedToolData);
    Object.assign(annotation, {
        highlighted: false,
        invalidated: true,
        autoGenerated: true,
        annotationUID: undefined,
        cachedStats: {},
        childAnnotationUIDs: [],
        parentAnnotationUID: undefined,
    });
    Object.assign(annotation.data, {
        handles: {
            points: handlePoints.points || handlePoints || [],
            interpolationSources: handlePoints.sources,
            activeHandleIndex: null,
            textBox: {
                hasMoved: false,
                worldPosition: [0, 0, 0],
                worldBoundingBox: {
                    topLeft: [0, 0, 0],
                    topRight: [0, 0, 0],
                    bottomLeft: [0, 0, 0],
                    bottomRight: [0, 0, 0],
                },
            },
        },
        contour: {
            ...referencedToolData.data.contour,
            polyline,
        },
    });
    return annotation;
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contours/interpolation/getInterpolationData.js
var getInterpolationData = __webpack_require__(55421);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contours/interpolation/findAnnotationForInterpolation.js

function findAnnotationsForInterpolation(toolData, viewportData) {
    const interpolationData = (0,getInterpolationData/* default */.A)(viewportData, [
        {
            key: 'interpolationUID',
            value: viewportData.interpolationUID,
        },
    ]);
    const rangeToInterpolate = getRangeToInterpolate(interpolationData);
    if (!rangeToInterpolate) {
        console.warn('No annotations found to interpolate', interpolationData);
        return;
    }
    const sliceEdited = _getSlicePositionOfToolData(interpolationData, toolData.annotationUID);
    const interpolationList = [];
    for (let i = rangeToInterpolate[0] + 1; i < rangeToInterpolate[1]; i++) {
        if (_sliceNeedsInterpolating(interpolationData, i)) {
            const contourPair = _getBoundingPair(i, rangeToInterpolate, interpolationData);
            if (contourPair?.[0] === sliceEdited ||
                contourPair?.[1] === sliceEdited) {
                _appendInterpolationList(contourPair, interpolationList, i);
            }
        }
    }
    return {
        interpolationData,
        interpolationList,
    };
}
function getRangeToInterpolate(interpolationData) {
    let first = Infinity;
    let last = -Infinity;
    let found = false;
    for (const [sliceIndex, annotations] of interpolationData.entries()) {
        if (annotations.length) {
            first = Math.min(sliceIndex, first);
            last = Math.max(sliceIndex, last);
            found = true;
        }
    }
    if (!found) {
        return;
    }
    return [first, last];
}
function _getSlicePositionOfToolData(interpolationData, annotationUID) {
    for (const [sliceIndex, annotations] of interpolationData) {
        for (let j = 0; j < annotations.length; j++) {
            if (annotations[j].annotationUID === annotationUID) {
                return sliceIndex;
            }
        }
    }
    return;
}
function _sliceNeedsInterpolating(interpolationData, sliceIndex) {
    const annotations = interpolationData.get(sliceIndex);
    return (!annotations?.length ||
        (annotations.length === 1 && annotations[0].autoGenerated));
}
function _appendInterpolationList(contourPair, interpolationList, itemIndex) {
    const [startIndex] = contourPair;
    interpolationList[startIndex] ||= {
        pair: contourPair,
        list: [],
    };
    interpolationList[startIndex].list.push(itemIndex);
}
function _getBoundingPair(sliceIndex, sliceRange, interpolationData) {
    const annotationPair = [];
    let canInterpolate = true;
    for (let i = sliceIndex - 1; i >= sliceRange[0]; i--) {
        const annotations = interpolationData.get(i);
        if (annotations?.length) {
            if (annotations[0].autoGenerated) {
                continue;
            }
            if (annotations.length > 1) {
                canInterpolate = false;
            }
            annotationPair.push(i);
            break;
        }
    }
    if (!canInterpolate || !annotationPair.length) {
        return;
    }
    for (let i = sliceIndex + 1; i <= sliceRange[1]; i++) {
        const annotations = interpolationData.get(i);
        if (annotations?.length) {
            if (annotations[0].autoGenerated) {
                continue;
            }
            if (annotations.length > 1) {
                canInterpolate = false;
            }
            annotationPair.push(i);
            break;
        }
    }
    if (!canInterpolate || annotationPair.length < 2) {
        return;
    }
    return annotationPair;
}
/* harmony default export */ const findAnnotationForInterpolation = (findAnnotationsForInterpolation);

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/Events.js
var Events = __webpack_require__(94021);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/index.js + 1 modules
var stateManagement_annotation = __webpack_require__(47807);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contours/interpolation/selectHandles.js


const { PointsManager } = esm.utilities;
function selectHandles(polyline, handleCount = 12) {
    const handles = PointsManager.create3(handleCount);
    handles.sources = [];
    const { sources: destPoints } = handles;
    const { length, sources: sourcePoints = [] } = polyline;
    const distance = 5;
    if (length < distance * 3) {
        return polyline.subselect(handleCount);
    }
    const interval = Math.floor(Math.max((2 * length) / handleCount, distance * 2));
    sourcePoints.forEach(() => destPoints.push(PointsManager.create3(handleCount)));
    const dotValues = createDotValues(polyline, distance);
    const minimumRegions = findMinimumRegions(dotValues, handleCount);
    const indices = [];
    if (minimumRegions?.length > 2) {
        let lastHandle = -1;
        const thirdInterval = interval / 3;
        minimumRegions.forEach((region) => {
            const [start, , end] = region;
            const midIndex = Math.ceil((start + end) / 2);
            if (end - lastHandle < thirdInterval) {
                return;
            }
            if (midIndex - start > 2 * thirdInterval) {
                addInterval(indices, lastHandle, start, interval, length);
                lastHandle = addInterval(indices, start, midIndex, interval, length);
            }
            else {
                lastHandle = addInterval(indices, lastHandle, midIndex, interval, length);
            }
            if (end - lastHandle > thirdInterval) {
                lastHandle = addInterval(indices, lastHandle, end, interval, length);
            }
        });
        const firstHandle = indices[0];
        const lastDistance = indexValue(firstHandle + length - lastHandle, length);
        if (lastDistance > 2 * thirdInterval) {
            addInterval(indices, lastHandle, firstHandle - thirdInterval, interval, length);
        }
    }
    else {
        const interval = Math.floor(length / handleCount);
        addInterval(indices, -1, length - interval, interval, length);
    }
    indices.forEach((index) => {
        const point = polyline.getPointArray(index);
        handles.push(point);
        sourcePoints.forEach((source, destSourceIndex) => destPoints[destSourceIndex].push(source.getPoint(index)));
    });
    return handles;
}
function createDotValues(polyline, distance = 6) {
    const { length } = polyline;
    const prevVec3 = gl_matrix_esm/* vec3.create */.eR.create();
    const nextVec3 = gl_matrix_esm/* vec3.create */.eR.create();
    const dotValues = new Float32Array(length);
    for (let i = 0; i < length; i++) {
        const point = polyline.getPoint(i);
        const prevPoint = polyline.getPoint(i - distance);
        const nextPoint = polyline.getPoint((i + distance) % length);
        gl_matrix_esm/* vec3.sub */.eR.sub(prevVec3, point, prevPoint);
        gl_matrix_esm/* vec3.sub */.eR.sub(nextVec3, nextPoint, point);
        const dot = gl_matrix_esm/* vec3.dot */.eR.dot(prevVec3, nextVec3) / (gl_matrix_esm/* vec3.len */.eR.len(prevVec3) * gl_matrix_esm/* vec3.len */.eR.len(nextVec3));
        dotValues[i] = dot;
    }
    return dotValues;
}
function findMinimumRegions(dotValues, handleCount) {
    const { max, deviation } = getStats(dotValues);
    const { length } = dotValues;
    if (deviation < 0.01 || length < handleCount * 3) {
        return [];
    }
    const inflection = [];
    let pair = null;
    let minValue;
    let minIndex = 0;
    for (let i = 0; i < length; i++) {
        const dot = dotValues[i];
        if (dot < max - deviation) {
            if (pair) {
                pair[2] = i;
                if (dot < minValue) {
                    minValue = dot;
                    minIndex = i;
                }
                pair[1] = minIndex;
            }
            else {
                minValue = dot;
                minIndex = i;
                pair = [i, i, i];
            }
        }
        else {
            if (pair) {
                inflection.push(pair);
                pair = null;
            }
        }
    }
    if (pair) {
        if (inflection[0][0] === 0) {
            inflection[0][0] = pair[0];
        }
        else {
            pair[1] = minIndex;
            pair[2] = length - 1;
            inflection.push(pair);
        }
    }
    return inflection;
}
function addInterval(indices, start, finish, interval, length) {
    if (finish < start) {
        finish += length;
    }
    const distance = finish - start;
    const count = Math.ceil(distance / interval);
    if (count <= 0) {
        if (indices[indices.length - 1] !== finish) {
            indices.push(indexValue(finish, length));
        }
        return finish;
    }
    for (let i = 1; i <= count; i++) {
        const index = indexValue(start + (i * distance) / count, length);
        indices.push(index);
    }
    return indices[indices.length - 1];
}
function indexValue(v, length) {
    return (Math.round(v) + length) % length;
}
function getStats(dotValues) {
    const { length } = dotValues;
    let sum = 0;
    let min = Infinity;
    let max = -Infinity;
    let sumSq = 0;
    for (let i = 0; i < length; i++) {
        const dot = dotValues[i];
        sum += dot;
        min = Math.min(min, dot);
        max = Math.max(max, dot);
    }
    const mean = sum / length;
    for (let i = 0; i < length; i++) {
        const valueDiff = dotValues[i] - mean;
        sumSq += valueDiff * valueDiff;
    }
    return {
        mean,
        max,
        min,
        sumSq,
        deviation: Math.sqrt(sumSq / length),
    };
}

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contours/interpolation/updateChildInterpolationUID.js

function updateChildInterpolationUID(annotation) {
    const { parentAnnotationUID, annotationUID } = annotation;
    if (!parentAnnotationUID) {
        return annotation.interpolationUID;
    }
    const parentAnnotation = stateManagement_annotation.state.getAnnotation(parentAnnotationUID);
    const { interpolationUID } = parentAnnotation;
    const index = parentAnnotation.childAnnotationUIDs.indexOf(annotationUID);
    annotation.interpolationUID = `${interpolationUID}-${index}`;
    return annotation.interpolationUID;
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/eventListeners/annotations/contourSegmentation/contourSegmentationCompleted.js
var contourSegmentationCompleted = __webpack_require__(50986);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contours/interpolation/interpolate.js









const { PointsManager: interpolate_PointsManager } = esm.utilities;
const dP = 0.2;
function interpolate(viewportData) {
    if (!viewportData.annotation) {
        return;
    }
    const { isInterpolationUpdate, annotation } = viewportData;
    queueMicrotask(() => {
        try {
            if (isInterpolationUpdate) {
                annotation.isInterpolationUpdate = true;
                annotation.autoGenerated = false;
            }
            startInterpolation(viewportData);
        }
        finally {
            if (isInterpolationUpdate) {
                annotation.autoGenerated = true;
            }
        }
    });
}
function startInterpolation(viewportData) {
    const { annotation: toolData } = viewportData;
    updateChildInterpolationUID(toolData);
    const { interpolationData, interpolationList } = findAnnotationForInterpolation(toolData, viewportData) || {};
    if (!interpolationData || !interpolationList) {
        return;
    }
    const eventData = {
        toolName: toolData.metadata.toolName,
        toolType: toolData.metadata.toolName,
        viewport: viewportData.viewport,
    };
    for (let i = 0; i < interpolationList.length; i++) {
        if (interpolationList[i]) {
            _linearlyInterpolateBetween(interpolationList[i].list, interpolationList[i].pair, interpolationData, eventData);
        }
    }
    const { id, renderingEngineId, element } = viewportData.viewport;
    const eventDetails = {
        annotation: toolData,
        element,
        viewportId: id,
        renderingEngineId,
    };
    if (interpolationList.length) {
        (0,esm.triggerEvent)(viewportData.viewport.element, Events/* default */.A.ANNOTATION_INTERPOLATION_PROCESS_COMPLETED, eventDetails);
    }
}
function _linearlyInterpolateBetween(indices, annotationPair, interpolationData, eventData) {
    const annotation0 = interpolationData.get(annotationPair[0])[0];
    const annotation1 = interpolationData.get(annotationPair[1])[0];
    const c1 = _generateClosedContour(annotation0.data.contour.polyline);
    const c2 = _generateClosedContour(annotation1.data.contour.polyline);
    const { c1Interp, c2Interp } = _generateInterpolationContourPair(c1, c2);
    c1Interp.kIndex = annotationPair[0];
    c2Interp.kIndex = annotationPair[1];
    indices.forEach(function (index) {
        _linearlyInterpolateContour(c1Interp, c2Interp, index, annotationPair, interpolationData, c1.x.length > c2.x.length, eventData);
    });
}
function getPointCount(pointArray) {
    let sum = 0;
    for (let i = 0; i < pointArray.I.length; i++) {
        if (pointArray.I[i]) {
            sum++;
        }
    }
    return sum;
}
function _linearlyInterpolateContour(c1Interp, c2Interp, sliceIndex, annotationPair, interpolationData, c1HasMoreNodes, eventData) {
    const [startIndex, endIndex] = annotationPair;
    const zInterp = (sliceIndex - startIndex) / (endIndex - startIndex);
    const annotation0 = interpolationData.get(startIndex)[0];
    const annotation1 = interpolationData.get(endIndex)[0];
    const interpolated3DPoints = _generateInterpolatedOpenContour(c1Interp, c2Interp, zInterp, c1HasMoreNodes);
    const nearestAnnotation = zInterp > 0.5 ? annotation1 : annotation0;
    const handlePoints = selectHandles(interpolated3DPoints);
    if (interpolationData.has(sliceIndex)) {
        _editInterpolatedContour(interpolated3DPoints, handlePoints, sliceIndex, nearestAnnotation, eventData);
    }
    else {
        _addInterpolatedContour(interpolated3DPoints, handlePoints, sliceIndex, nearestAnnotation, eventData);
    }
}
function _addInterpolatedContour(interpolated3DPoints, handlePoints, sliceIndex, referencedToolData, eventData) {
    const points = interpolated3DPoints.points;
    const { viewport } = eventData;
    const interpolatedAnnotation = createPolylineToolData(points, handlePoints, referencedToolData);
    const viewRef = viewport.getViewReference({ sliceIndex });
    if (!viewRef) {
        throw new Error(`Can't find slice ${sliceIndex}`);
    }
    Object.assign(interpolatedAnnotation.metadata, viewRef);
    stateManagement_annotation.state.addAnnotation(interpolatedAnnotation, viewport.element);
    referencedToolData.onInterpolationComplete?.(interpolatedAnnotation, referencedToolData);
    const { parentAnnotationUID } = referencedToolData;
    if (parentAnnotationUID) {
        const parentReferenced = stateManagement_annotation.state.getAnnotation(parentAnnotationUID);
        const parentAnnotation = _findExistingAnnotation(parentReferenced, sliceIndex, eventData);
        (0,contourSegmentationCompleted/* createPolylineHole */.r)(viewport, parentAnnotation, interpolatedAnnotation);
    }
}
function _findExistingAnnotation(referencedToolData, sliceIndex, eventData) {
    const { viewport } = eventData;
    const annotations = stateManagement_annotation.state.getAnnotations(referencedToolData.metadata.toolName, viewport.element);
    for (let i = 0; i < annotations.length; i++) {
        const annotation = annotations[i];
        if (annotation.interpolationUID === referencedToolData.interpolationUID &&
            annotation.metadata.sliceIndex === sliceIndex) {
            return annotation;
        }
    }
}
function _editInterpolatedContour(interpolated3DPoints, handlePoints, sliceIndex, referencedToolData, eventData) {
    const oldAnnotationData = _findExistingAnnotation(referencedToolData, sliceIndex, eventData);
    const points = interpolated3DPoints.points;
    const interpolatedAnnotation = createPolylineToolData(points, handlePoints, oldAnnotationData);
    Object.assign(oldAnnotationData, {
        metadata: interpolatedAnnotation.metadata,
        data: interpolatedAnnotation.data,
    });
}
function _generateInterpolatedOpenContour(c1ir, c2ir, zInterp, c1HasMoreNodes) {
    const indices = c1HasMoreNodes ? c1ir.I : c2ir.I;
    const c1 = interpolate_PointsManager.fromXYZ(c1ir);
    const c2 = interpolate_PointsManager.fromXYZ(c2ir);
    const { length } = c1;
    const cInterp = interpolate_PointsManager.create3(length);
    const vecSubtract = gl_matrix_esm/* vec3.create */.eR.create();
    const vecResult = gl_matrix_esm/* vec3.create */.eR.create();
    const c1Source = interpolate_PointsManager.create3(length);
    c1Source.kIndex = c1ir.kIndex;
    const c2Source = interpolate_PointsManager.create3(length);
    c2Source.kIndex = c2ir.kIndex;
    for (let i = 0; i < c1ir.x.length; i++) {
        if (indices[i]) {
            const c1point = c1.getPoint(i);
            const c2point = c2.getPoint(i);
            c1Source.push(c1point);
            c2Source.push(c2point);
            gl_matrix_esm/* vec3.sub */.eR.sub(vecSubtract, c2point, c1point);
            cInterp.push(gl_matrix_esm/* vec3.scaleAndAdd */.eR.scaleAndAdd(vecResult, c1point, vecSubtract, zInterp));
        }
    }
    cInterp.sources = [c1Source, c2Source];
    return cInterp;
}
function _generateInterpolationContourPair(c1, c2) {
    const cumPerim1 = _getCumulativePerimeter(c1);
    const cumPerim2 = _getCumulativePerimeter(c2);
    const interpNodes = Math.max(Math.ceil(cumPerim1[cumPerim1.length - 1] / dP), Math.ceil(cumPerim2[cumPerim2.length - 1] / dP));
    const cumPerim1Norm = _normalisedCumulativePerimeter(cumPerim1);
    const cumPerim2Norm = _normalisedCumulativePerimeter(cumPerim2);
    const numNodes1 = interpNodes + c2.x.length;
    const numNodes2 = interpNodes + c1.x.length;
    const perim1Interp = _getInterpolatedPerim(numNodes1, cumPerim1Norm);
    const perim2Interp = _getInterpolatedPerim(numNodes2, cumPerim2Norm);
    const perim1Ind = _getIndicatorArray(numNodes1 - 2, c1.x.length);
    const perim2Ind = _getIndicatorArray(numNodes2 - 2, c2.x.length);
    const nodesPerSegment1 = _getNodesPerSegment(perim1Interp, perim1Ind);
    const nodesPerSegment2 = _getNodesPerSegment(perim2Interp, perim2Ind);
    const c1i = _getSuperSampledContour(c1, nodesPerSegment1);
    const c2i = _getSuperSampledContour(c2, nodesPerSegment2);
    _shiftSuperSampledContourInPlace(c1i, c2i);
    return _reduceContoursToOriginNodes(c1i, c2i);
}
function _reduceContoursToOriginNodes(c1i, c2i) {
    const c1Interp = {
        x: [],
        y: [],
        z: [],
        I: [],
    };
    const c2Interp = {
        x: [],
        y: [],
        z: [],
        I: [],
    };
    for (let i = 0; i < c1i.x.length; i++) {
        if (c1i.I[i] || c2i.I[i]) {
            c1Interp.x.push(c1i.x[i]);
            c1Interp.y.push(c1i.y[i]);
            c1Interp.z.push(c1i.z[i]);
            c1Interp.I.push(c1i.I[i]);
            c2Interp.x.push(c2i.x[i]);
            c2Interp.y.push(c2i.y[i]);
            c2Interp.z.push(c2i.z[i]);
            c2Interp.I.push(c2i.I[i]);
        }
    }
    return {
        c1Interp,
        c2Interp,
    };
}
function _shiftSuperSampledContourInPlace(c1i, c2i) {
    const c1iLength = c1i.x.length;
    const optimal = {
        startingNode: 0,
        totalSquaredXYLengths: Infinity,
    };
    for (let startingNode = 0; startingNode < c1iLength; startingNode++) {
        let node = startingNode;
        let totalSquaredXYLengths = 0;
        for (let iteration = 0; iteration < c1iLength; iteration++) {
            totalSquaredXYLengths +=
                (c1i.x[node] - c2i.x[iteration]) ** 2 +
                    (c1i.y[node] - c2i.y[iteration]) ** 2 +
                    (c1i.z[node] - c2i.z[iteration]) ** 2;
            node++;
            if (node === c1iLength) {
                node = 0;
            }
        }
        if (totalSquaredXYLengths < optimal.totalSquaredXYLengths) {
            optimal.totalSquaredXYLengths = totalSquaredXYLengths;
            optimal.startingNode = startingNode;
        }
    }
    const node = optimal.startingNode;
    _shiftCircularArray(c1i.x, node);
    _shiftCircularArray(c1i.y, node);
    _shiftCircularArray(c1i.z, node);
    _shiftCircularArray(c1i.I, node);
}
function _shiftCircularArray(arr, count) {
    count -= arr.length * Math.floor(count / arr.length);
    const slicedArray = arr.splice(0, count);
    arr.push(...slicedArray);
    return arr;
}
function _getSuperSampledContour(c, nodesPerSegment) {
    const ci = {
        x: [],
        y: [],
        z: [],
        I: [],
    };
    for (let n = 0; n < c.x.length - 1; n++) {
        ci.x.push(c.x[n]);
        ci.y.push(c.y[n]);
        ci.z.push(c.z[n]);
        ci.I.push(true);
        const xSpacing = (c.x[n + 1] - c.x[n]) / (nodesPerSegment[n] + 1);
        const ySpacing = (c.y[n + 1] - c.y[n]) / (nodesPerSegment[n] + 1);
        const zSpacing = (c.z[n + 1] - c.z[n]) / (nodesPerSegment[n] + 1);
        for (let i = 0; i < nodesPerSegment[n] - 1; i++) {
            ci.x.push(ci.x[ci.x.length - 1] + xSpacing);
            ci.y.push(ci.y[ci.y.length - 1] + ySpacing);
            ci.z.push(ci.z[ci.z.length - 1] + zSpacing);
            ci.I.push(false);
        }
    }
    return ci;
}
function _getNodesPerSegment(perimInterp, perimInd) {
    const idx = [];
    for (let i = 0; i < perimInterp.length; ++i) {
        idx[i] = i;
    }
    idx.sort(function (a, b) {
        return perimInterp[a] < perimInterp[b] ? -1 : 1;
    });
    const perimIndSorted = [];
    for (let i = 0; i < perimInd.length; i++) {
        perimIndSorted.push(perimInd[idx[i]]);
    }
    const indicesOfOriginNodes = perimIndSorted.reduce(function (arr, elementValue, i) {
        if (elementValue) {
            arr.push(i);
        }
        return arr;
    }, []);
    const nodesPerSegment = [];
    for (let i = 0; i < indicesOfOriginNodes.length - 1; i++) {
        nodesPerSegment.push(indicesOfOriginNodes[i + 1] - indicesOfOriginNodes[i]);
    }
    return nodesPerSegment;
}
function _getIndicatorArray(numFalse, numTrue) {
    const perimInd = new Array(numFalse + numTrue);
    perimInd.fill(false, 0, numFalse);
    perimInd.fill(true, numFalse, numFalse + numTrue);
    return perimInd;
}
function _getInterpolatedPerim(numNodes, cumPerimNorm) {
    const diff = 1 / (numNodes - 1);
    const linspace = [diff];
    for (let i = 1; i < numNodes - 2; i++) {
        linspace.push(linspace[linspace.length - 1] + diff);
    }
    return linspace.concat(cumPerimNorm);
}
function _normalisedCumulativePerimeter(cumPerim) {
    const cumPerimNorm = [];
    for (let i = 0; i < cumPerim.length; i++) {
        cumPerimNorm.push(cumPerim[i] / cumPerim[cumPerim.length - 1]);
    }
    return cumPerimNorm;
}
function _getCumulativePerimeter(contour) {
    const cumulativePerimeter = [0];
    for (let i = 1; i < contour.x.length; i++) {
        const lengthOfSegment = Math.sqrt((contour.x[i] - contour.x[i - 1]) ** 2 +
            (contour.y[i] - contour.y[i - 1]) ** 2 +
            (contour.z[i] - contour.z[i - 1]) ** 2);
        cumulativePerimeter.push(cumulativePerimeter[i - 1] + lengthOfSegment);
    }
    return cumulativePerimeter;
}
function _generateClosedContour(points) {
    const c = {
        x: [],
        y: [],
        z: [],
    };
    for (let i = 0; i < points.length; i++) {
        c.x[i] = points[i][0];
        c.y[i] = points[i][1];
        c.z[i] = points[i][2];
    }
    c.x.push(c.x[0]);
    c.y.push(c.y[0]);
    c.z.push(c.z[0]);
    return c;
}
/* harmony default export */ const interpolation_interpolate = (interpolate);


/***/ }),

/***/ 69013:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   B: () => (/* binding */ InstanceBasicStatsCalculator),
/* harmony export */   O: () => (/* binding */ BasicStatsCalculator)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _Calculator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(28364);


const { PointsManager } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities;
function createBasicStatsState(storePointData) {
    return {
        max: [-Infinity],
        min: [Infinity],
        sum: [0],
        count: 0,
        maxIJK: null,
        maxLPS: null,
        minIJK: null,
        minLPS: null,
        runMean: [0],
        m2: [0],
        m3: [0],
        m4: [0],
        allValues: [[]],
        pointsInShape: storePointData ? PointsManager.create3(1024) : null,
        sumLPS: [0, 0, 0],
    };
}
function basicStatsCallback(state, newValue, pointLPS = null, pointIJK = null) {
    if (Array.isArray(newValue) &&
        newValue.length > 1 &&
        state.max.length === 1) {
        state.max.push(state.max[0], state.max[0]);
        state.min.push(state.min[0], state.min[0]);
        state.sum.push(state.sum[0], state.sum[0]);
        state.runMean.push(0, 0);
        state.m2.push(state.m2[0], state.m2[0]);
        state.m3.push(state.m3[0], state.m3[0]);
        state.m4.push(state.m4[0], state.m4[0]);
        state.allValues.push([], []);
    }
    if (state?.pointsInShape && pointLPS) {
        state.pointsInShape.push(pointLPS);
    }
    const newArray = Array.isArray(newValue) ? newValue : [newValue];
    state.count += 1;
    if (pointLPS) {
        state.sumLPS[0] += pointLPS[0];
        state.sumLPS[1] += pointLPS[1];
        state.sumLPS[2] += pointLPS[2];
    }
    state.max.forEach((it, idx) => {
        const value = newArray[idx];
        state.allValues[idx].push(value);
        const n = state.count;
        const delta = value - state.runMean[idx];
        const delta_n = delta / n;
        const term1 = delta * delta_n * (n - 1);
        state.sum[idx] += value;
        state.runMean[idx] += delta_n;
        state.m4[idx] +=
            term1 * delta_n * delta_n * (n * n - 3 * n + 3) +
                6 * delta_n * delta_n * state.m2[idx] -
                4 * delta_n * state.m3[idx];
        state.m3[idx] += term1 * delta_n * (n - 2) - 3 * delta_n * state.m2[idx];
        state.m2[idx] += term1;
        if (value < state.min[idx]) {
            state.min[idx] = value;
            if (idx === 0) {
                state.minIJK = pointIJK ? [...pointIJK] : null;
                state.minLPS = pointLPS ? [...pointLPS] : null;
            }
        }
        if (value > state.max[idx]) {
            state.max[idx] = value;
            if (idx === 0) {
                state.maxIJK = pointIJK ? [...pointIJK] : null;
                state.maxLPS = pointLPS ? [...pointLPS] : null;
            }
        }
    });
}
function calculateMedian(values) {
    if (values.length === 0) {
        return 0;
    }
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2;
    }
    else {
        return sorted[mid];
    }
}
function basicGetStatistics(state, unit) {
    const mean = state.sum.map((sum) => sum / state.count);
    const stdDev = state.m2.map((squaredDiffSum) => Math.sqrt(squaredDiffSum / state.count));
    const center = state.sumLPS.map((sum) => sum / state.count);
    const skewness = state.m3.map((m3, idx) => {
        const variance = state.m2[idx] / state.count;
        if (variance === 0) {
            return 0;
        }
        return m3 / (state.count * Math.pow(variance, 1.5));
    });
    const kurtosis = state.m4.map((m4, idx) => {
        const variance = state.m2[idx] / state.count;
        if (variance === 0) {
            return 0;
        }
        return m4 / (state.count * variance * variance) - 3;
    });
    const median = state.allValues.map((values) => calculateMedian(values));
    const named = {
        max: {
            name: 'max',
            label: 'Max Pixel',
            value: state.max.length === 1 ? state.max[0] : state.max,
            unit,
            pointIJK: state.maxIJK ? [...state.maxIJK] : null,
            pointLPS: state.maxLPS ? [...state.maxLPS] : null,
        },
        min: {
            name: 'min',
            label: 'Min Pixel',
            value: state.min.length === 1 ? state.min[0] : state.min,
            unit,
            pointIJK: state.minIJK ? [...state.minIJK] : null,
            pointLPS: state.minLPS ? [...state.minLPS] : null,
        },
        mean: {
            name: 'mean',
            label: 'Mean Pixel',
            value: mean.length === 1 ? mean[0] : mean,
            unit,
        },
        stdDev: {
            name: 'stdDev',
            label: 'Standard Deviation',
            value: stdDev.length === 1 ? stdDev[0] : stdDev,
            unit,
        },
        count: {
            name: 'count',
            label: 'Voxel Count',
            value: state.count,
            unit: null,
        },
        median: {
            name: 'median',
            label: 'Median',
            value: median.length === 1 ? median[0] : median,
            unit,
        },
        skewness: {
            name: 'skewness',
            label: 'Skewness',
            value: skewness.length === 1 ? skewness[0] : skewness,
            unit: null,
        },
        kurtosis: {
            name: 'kurtosis',
            label: 'Kurtosis',
            value: kurtosis.length === 1 ? kurtosis[0] : kurtosis,
            unit: null,
        },
        maxLPS: {
            name: 'maxLPS',
            label: 'Max LPS',
            value: state.maxLPS ? Array.from(state.maxLPS) : null,
            unit: null,
        },
        minLPS: {
            name: 'minLPS',
            label: 'Min LPS',
            value: state.minLPS ? Array.from(state.minLPS) : null,
            unit: null,
        },
        pointsInShape: state.pointsInShape,
        center: {
            name: 'center',
            label: 'Center',
            value: center ? [...center] : null,
            unit: null,
        },
        array: [],
    };
    named.array.push(named.min, named.max, named.mean, named.stdDev, named.median, named.skewness, named.kurtosis, named.count, named.maxLPS, named.minLPS);
    if (named.center.value) {
        named.array.push(named.center);
    }
    const store = state.pointsInShape !== null;
    const freshState = createBasicStatsState(store);
    state.max = freshState.max;
    state.min = freshState.min;
    state.sum = freshState.sum;
    state.count = freshState.count;
    state.maxIJK = freshState.maxIJK;
    state.maxLPS = freshState.maxLPS;
    state.minIJK = freshState.minIJK;
    state.minLPS = freshState.minLPS;
    state.runMean = freshState.runMean;
    state.m2 = freshState.m2;
    state.m3 = freshState.m3;
    state.m4 = freshState.m4;
    state.allValues = freshState.allValues;
    state.pointsInShape = freshState.pointsInShape;
    state.sumLPS = freshState.sumLPS;
    return named;
}
class BasicStatsCalculator extends _Calculator__WEBPACK_IMPORTED_MODULE_1__/* .Calculator */ .t {
    static { this.state = createBasicStatsState(true); }
    static statsInit(options) {
        if (!options.storePointData) {
            this.state.pointsInShape = null;
        }
        this.state = createBasicStatsState(options.storePointData);
    }
    static { this.statsCallback = ({ value: newValue, pointLPS = null, pointIJK = null, }) => {
        basicStatsCallback(this.state, newValue, pointLPS, pointIJK);
    }; }
    static { this.getStatistics = (options) => {
        return basicGetStatistics(this.state, options?.unit);
    }; }
}
class InstanceBasicStatsCalculator extends _Calculator__WEBPACK_IMPORTED_MODULE_1__/* .InstanceCalculator */ .I {
    constructor(options) {
        super(options);
        this.state = createBasicStatsState(options.storePointData);
    }
    statsInit(options) {
        this.state = createBasicStatsState(options.storePointData);
    }
    statsCallback(data) {
        basicStatsCallback(this.state, data.value, data.pointLPS, data.pointIJK);
    }
    getStatistics(options) {
        return basicGetStatistics(this.state, options?.unit);
    }
}


/***/ }),

/***/ 2222:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getCanvasEllipseCorners)
/* harmony export */ });
function getCanvasEllipseCorners(ellipseCanvasPoints) {
    const [bottom, top, left, right] = ellipseCanvasPoints;
    const topLeft = [left[0], top[1]];
    const bottomRight = [right[0], bottom[1]];
    return [topLeft, bottomRight];
}


/***/ }),

/***/ 86978:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ distanceToPoint)
/* harmony export */ });
/* harmony import */ var _distanceToPointSquared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18989);

function distanceToPoint(lineStart, lineEnd, point) {
    if (lineStart.length !== 2 || lineEnd.length !== 2 || point.length !== 2) {
        throw Error('lineStart, lineEnd, and point should have 2 elements of [x, y]');
    }
    return Math.sqrt((0,_distanceToPointSquared__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(lineStart, lineEnd, point));
}


/***/ }),

/***/ 81205:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ intersectLine)
/* harmony export */ });
function sign(x) {
    return typeof x === 'number'
        ? x
            ? x < 0
                ? -1
                : 1
            : x === x
                ? 0
                : NaN
        : NaN;
}
function intersectLine(line1Start, line1End, line2Start, line2End) {
    const [x1, y1] = line1Start;
    const [x2, y2] = line1End;
    const [x3, y3] = line2Start;
    const [x4, y4] = line2End;
    const a1 = y2 - y1;
    const b1 = x1 - x2;
    const c1 = x2 * y1 - x1 * y2;
    const r3 = a1 * x3 + b1 * y3 + c1;
    const r4 = a1 * x4 + b1 * y4 + c1;
    if (r3 !== 0 && r4 !== 0 && sign(r3) === sign(r4)) {
        return;
    }
    const a2 = y4 - y3;
    const b2 = x3 - x4;
    const c2 = x4 * y3 - x3 * y4;
    const r1 = a2 * x1 + b2 * y1 + c2;
    const r2 = a2 * x2 + b2 * y2 + c2;
    if (r1 !== 0 && r2 !== 0 && sign(r1) === sign(r2)) {
        return;
    }
    const denom = a1 * b2 - a2 * b1;
    let num;
    num = b1 * c2 - b2 * c1;
    const x = num / denom;
    num = a2 * c1 - a1 * c2;
    const y = num / denom;
    const intersectionPoint = [x, y];
    return intersectionPoint;
}


/***/ }),

/***/ 87105:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ distanceToPoint)
/* harmony export */ });
/* harmony import */ var _line__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15305);

function rectToLineSegments(left, top, width, height) {
    const topLineStart = [left, top];
    const topLineEnd = [left + width, top];
    const rightLineStart = [left + width, top];
    const rightLineEnd = [left + width, top + height];
    const bottomLineStart = [left + width, top + height];
    const bottomLineEnd = [left, top + height];
    const leftLineStart = [left, top + height];
    const leftLineEnd = [left, top];
    const lineSegments = {
        top: [topLineStart, topLineEnd],
        right: [rightLineStart, rightLineEnd],
        bottom: [bottomLineStart, bottomLineEnd],
        left: [leftLineStart, leftLineEnd],
    };
    return lineSegments;
}
function distanceToPoint(rect, point) {
    if (rect.length !== 4 || point.length !== 2) {
        throw Error('rectangle:[left, top, width, height] or point: [x,y] not defined correctly');
    }
    const [left, top, width, height] = rect;
    let minDistance = 655535;
    const lineSegments = rectToLineSegments(left, top, width, height);
    Object.keys(lineSegments).forEach((segment) => {
        const [lineStart, lineEnd] = lineSegments[segment];
        const distance = _line__WEBPACK_IMPORTED_MODULE_0__.distanceToPoint(lineStart, lineEnd, point);
        if (distance < minDistance) {
            minDistance = distance;
        }
    });
    return minDistance;
}


/***/ }),

/***/ 94418:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ filterAnnotationsForDisplay)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _filterAnnotationsWithinSlice__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(36374);


function filterAnnotationsForDisplay(viewport, annotations, filterOptions = {}) {
    if (viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.VolumeViewport) {
        const camera = viewport.getCamera();
        const { spacingInNormalDirection } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.getTargetVolumeAndSpacingInNormalDir(viewport, camera);
        return (0,_filterAnnotationsWithinSlice__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(annotations, camera, spacingInNormalDirection);
    }
    if (viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.StackViewport) {
        const imageId = viewport.getCurrentImageId();
        if (!imageId) {
            return [];
        }
        const colonIndex = imageId.indexOf(':');
        filterOptions.imageURI = imageId.substring(colonIndex + 1);
    }
    return annotations.filter((annotation) => {
        if (!annotation.isVisible) {
            return false;
        }
        if (annotation.data.isCanvasAnnotation) {
            return true;
        }
        return viewport.isReferenceViewable(annotation.metadata, filterOptions);
    });
}


/***/ }),

/***/ 40770:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   W: () => (/* binding */ filterAnnotationsWithinSamePlane)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15327);


const { EPSILON } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.CONSTANTS;
const PARALLEL_THRESHOLD = 1 - EPSILON;
function filterAnnotationsWithinSamePlane(annotations, camera) {
    const { viewPlaneNormal } = camera;
    const annotationsWithParallelNormals = annotations.filter((td) => {
        let annotationViewPlaneNormal = td.metadata.viewPlaneNormal;
        if (!annotationViewPlaneNormal) {
            const { referencedImageId } = td.metadata;
            const { imageOrientationPatient } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.metaData.get('imagePlaneModule', referencedImageId);
            const rowCosineVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(imageOrientationPatient[0], imageOrientationPatient[1], imageOrientationPatient[2]);
            const colCosineVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(imageOrientationPatient[3], imageOrientationPatient[4], imageOrientationPatient[5]);
            annotationViewPlaneNormal = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
            gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.cross */ .eR.cross(annotationViewPlaneNormal, rowCosineVec, colCosineVec);
            td.metadata.viewPlaneNormal = annotationViewPlaneNormal;
        }
        const isParallel = Math.abs(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(viewPlaneNormal, annotationViewPlaneNormal)) >
            PARALLEL_THRESHOLD;
        return annotationViewPlaneNormal && isParallel;
    });
    if (!annotationsWithParallelNormals.length) {
        return [];
    }
    return annotationsWithParallelNormals;
}


/***/ }),

/***/ 36374:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ filterAnnotationsWithinSlice)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15327);


const { EPSILON } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.CONSTANTS;
const PARALLEL_THRESHOLD = 1 - EPSILON;
function filterAnnotationsWithinSlice(annotations, camera, spacingInNormalDirection) {
    const { viewPlaneNormal } = camera;
    const annotationsWithParallelNormals = annotations.filter((td) => {
        let annotationViewPlaneNormal = td.metadata.viewPlaneNormal;
        if (!annotationViewPlaneNormal) {
            const { referencedImageId } = td.metadata;
            const { imageOrientationPatient } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.metaData.get('imagePlaneModule', referencedImageId);
            const rowCosineVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(imageOrientationPatient[0], imageOrientationPatient[1], imageOrientationPatient[2]);
            const colCosineVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(imageOrientationPatient[3], imageOrientationPatient[4], imageOrientationPatient[5]);
            annotationViewPlaneNormal = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
            gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.cross */ .eR.cross(annotationViewPlaneNormal, rowCosineVec, colCosineVec);
            td.metadata.viewPlaneNormal = annotationViewPlaneNormal;
        }
        const isParallel = Math.abs(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(viewPlaneNormal, annotationViewPlaneNormal)) >
            PARALLEL_THRESHOLD;
        return annotationViewPlaneNormal && isParallel;
    });
    if (!annotationsWithParallelNormals.length) {
        return [];
    }
    const halfSpacingInNormalDirection = spacingInNormalDirection / 2;
    const { focalPoint } = camera;
    const annotationsWithinSlice = [];
    for (const annotation of annotationsWithParallelNormals) {
        const data = annotation.data;
        const point = data.handles.points[0] || data.contour?.polyline[0];
        if (!annotation.isVisible) {
            continue;
        }
        const dir = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
        if (!point) {
            annotationsWithinSlice.push(annotation);
            continue;
        }
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.sub */ .eR.sub(dir, focalPoint, point);
        const dot = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(dir, viewPlaneNormal);
        if (Math.abs(dot) < halfSpacingInNormalDirection) {
            annotationsWithinSlice.push(annotation);
        }
    }
    return annotationsWithinSlice;
}


/***/ }),

/***/ 57063:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   R: () => (/* binding */ getPointInLineOfSightWithCriteria),
/* harmony export */   p: () => (/* binding */ getPointsInLineOfSight)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);

function getPointInLineOfSightWithCriteria(viewport, worldPos, targetVolumeId, criteriaFunction, stepSize = 0.25) {
    const points = getPointsInLineOfSight(viewport, worldPos, {
        targetVolumeId,
        stepSize,
    });
    let pickedPoint;
    for (const point of points) {
        const intensity = viewport.getIntensityFromWorld(point);
        const pointToPick = criteriaFunction(intensity, point);
        if (pointToPick) {
            pickedPoint = pointToPick;
        }
    }
    return pickedPoint;
}
function getPointsInLineOfSight(viewport, worldPos, { targetVolumeId, stepSize }) {
    const camera = viewport.getCamera();
    const { viewPlaneNormal: normalDirection } = camera;
    const { spacingInNormalDirection } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.getTargetVolumeAndSpacingInNormalDir(viewport, camera, targetVolumeId);
    const step = spacingInNormalDirection * stepSize || 1;
    const bounds = viewport.getBounds();
    const points = [];
    let currentPos = [...worldPos];
    while (_inBounds(currentPos, bounds)) {
        points.push([...currentPos]);
        currentPos[0] += normalDirection[0] * step;
        currentPos[1] += normalDirection[1] * step;
        currentPos[2] += normalDirection[2] * step;
    }
    currentPos = [...worldPos];
    while (_inBounds(currentPos, bounds)) {
        points.push([...currentPos]);
        currentPos[0] -= normalDirection[0] * step;
        currentPos[1] -= normalDirection[1] * step;
        currentPos[2] -= normalDirection[2] * step;
    }
    return points;
}
const _inBounds = function (point, bounds) {
    const [xMin, xMax, yMin, yMax, zMin, zMax] = bounds;
    const padding = 10;
    return (point[0] > xMin + padding &&
        point[0] < xMax - padding &&
        point[1] > yMin + padding &&
        point[1] < yMax - padding &&
        point[2] > zMin + padding &&
        point[2] < zMax - padding);
};


/***/ }),

/***/ 35489:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getWorldWidthAndHeightFromCorners)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);

function getWorldWidthAndHeightFromCorners(viewPlaneNormal, viewUp, topLeftWorld, bottomRightWorld) {
    const viewRight = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.cross */ .eR.cross(viewRight, viewUp, viewPlaneNormal);
    const pos1 = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(...topLeftWorld);
    const pos2 = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(...bottomRightWorld);
    const diagonal = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.subtract */ .eR.subtract(diagonal, pos1, pos2);
    const diagonalLength = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.length */ .eR.length(diagonal);
    if (diagonalLength < 0.0001) {
        return { worldWidth: 0, worldHeight: 0 };
    }
    const cosTheta = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(diagonal, viewRight) / (diagonalLength * gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.length */ .eR.length(viewRight));
    const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
    const worldWidth = sinTheta * diagonalLength;
    const worldHeight = cosTheta * diagonalLength;
    return { worldWidth, worldHeight };
}


/***/ }),

/***/ 62514:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getWorldWidthAndHeightFromTwoPoints)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);

function getWorldWidthAndHeightFromTwoPoints(viewPlaneNormal, viewUp, worldPos1, worldPos2) {
    const viewRight = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.cross */ .eR.cross(viewRight, viewUp, viewPlaneNormal);
    const pos1 = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(...worldPos1);
    const pos2 = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(...worldPos2);
    const diagonal = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.subtract */ .eR.subtract(diagonal, pos1, pos2);
    const diagonalLength = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.length */ .eR.length(diagonal);
    if (diagonalLength < 0.0001) {
        return { worldWidth: 0, worldHeight: 0 };
    }
    const cosTheta = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(diagonal, viewRight) / (diagonalLength * gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.length */ .eR.length(viewRight));
    const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
    const worldWidth = sinTheta * diagonalLength;
    const worldHeight = cosTheta * diagonalLength;
    return { worldWidth, worldHeight };
}


/***/ }),

/***/ 30698:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Y: () => (/* binding */ isPlaneIntersectingAABB)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);

const isPlaneIntersectingAABB = (origin, normal, minX, minY, minZ, maxX, maxY, maxZ) => {
    const vertices = [
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(minX, minY, minZ),
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(maxX, minY, minZ),
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(minX, maxY, minZ),
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(maxX, maxY, minZ),
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(minX, minY, maxZ),
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(maxX, minY, maxZ),
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(minX, maxY, maxZ),
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(maxX, maxY, maxZ),
    ];
    const normalVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(normal[0], normal[1], normal[2]);
    const originVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(origin[0], origin[1], origin[2]);
    const planeDistance = -gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(normalVec, originVec);
    let initialSign = null;
    for (const vertex of vertices) {
        const distance = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(normalVec, vertex) + planeDistance;
        if (initialSign === null) {
            initialSign = Math.sign(distance);
        }
        else if (Math.sign(distance) !== initialSign) {
            return true;
        }
    }
    return false;
};


/***/ }),

/***/ 27062:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ interpolateSegmentPoints)
});

// EXTERNAL MODULE: ../../../node_modules/d3-interpolate/src/index.js + 24 modules
var src = __webpack_require__(56399);
// EXTERNAL MODULE: ../../../node_modules/d3-array/src/index.js + 58 modules
var d3_array_src = __webpack_require__(20071);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/planarFreehandROITool/interpolation/algorithms/bspline.js


function isPoints3D(points) {
    return points[0]?.length === 3;
}
function interpolatePoints(originalPoints, knotsIndexes) {
    if (!knotsIndexes ||
        knotsIndexes.length === 0 ||
        knotsIndexes.length === originalPoints.length) {
        return originalPoints;
    }
    const n = knotsIndexes[knotsIndexes.length - 1] - knotsIndexes[0] + 1;
    const xInterpolator = (0,src/* interpolateBasis */.Qm)(knotsIndexes.map((k) => originalPoints[k][0]));
    const yInterpolator = (0,src/* interpolateBasis */.Qm)(knotsIndexes.map((k) => originalPoints[k][1]));
    if (isPoints3D(originalPoints)) {
        const zInterpolator = (0,src/* interpolateBasis */.Qm)(knotsIndexes.map((k) => originalPoints[k][2]));
        return ((0,d3_array_src/* zip */.yU)((0,src/* quantize */.yd)(xInterpolator, n), (0,src/* quantize */.yd)(yInterpolator, n), (0,src/* quantize */.yd)(zInterpolator, n)));
    }
    else {
        return ((0,d3_array_src/* zip */.yU)((0,src/* quantize */.yd)(xInterpolator, n), (0,src/* quantize */.yd)(yInterpolator, n)));
    }
}

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/planarFreehandROITool/interpolation/interpolateSegmentPoints.js

function getContinuousUniformDistributionValues(minDistributionDistance, closedInterval) {
    const result = [];
    const [intervalIni, intervalEnd] = closedInterval;
    const intervalSize = intervalEnd - intervalIni + 1;
    const intensity = Math.floor(intervalSize / minDistributionDistance);
    let x = 0;
    let continuosDistributionValue = Math.round(((intervalSize - 1) / (intensity - 1)) * x) + intervalIni;
    while (continuosDistributionValue <= intervalEnd) {
        result.push(continuosDistributionValue);
        x++;
        continuosDistributionValue =
            Math.round(((intervalSize - 1) / (intensity - 1)) * x) + intervalIni;
    }
    return result;
}
function interpolateSegmentPoints(points, iniIndex, endIndex, knotsRatioPercentage) {
    const segmentSize = endIndex - iniIndex + 1;
    const amountOfKnots = Math.floor((knotsRatioPercentage / 100) * segmentSize) ?? 1;
    const minKnotDistance = Math.floor(segmentSize / amountOfKnots) ?? 1;
    if (isNaN(segmentSize) || !segmentSize || !minKnotDistance) {
        return points;
    }
    if (segmentSize / minKnotDistance < 2) {
        return points;
    }
    const interpolationIniIndex = Math.max(0, iniIndex);
    const interpolationEndIndex = Math.min(points.length - 1, endIndex);
    const segmentPointsUnchangedBeg = points.slice(0, interpolationIniIndex);
    const segmentPointsUnchangedEnd = points.slice(interpolationEndIndex + 1, points.length);
    const knotsIndexes = getContinuousUniformDistributionValues(minKnotDistance, [
        interpolationIniIndex,
        interpolationEndIndex,
    ]);
    const interpolatedPoints = interpolatePoints(points, knotsIndexes);
    return [
        ...segmentPointsUnchangedBeg,
        ...interpolatedPoints,
        ...segmentPointsUnchangedEnd,
    ];
}


/***/ }),

/***/ 42797:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Q: () => (/* binding */ shouldSmooth),
/* harmony export */   p: () => (/* binding */ getInterpolatedPoints)
/* harmony export */ });
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(95527);
/* harmony import */ var _interpolation_interpolateSegmentPoints__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(27062);


function shouldSmooth(configuration, annotation) {
    if (annotation?.autoGenerated) {
        return false;
    }
    const shouldSmooth = configuration?.smoothing?.smoothOnAdd === true ||
        configuration?.smoothing?.smoothOnEdit === true;
    return shouldSmooth;
}
function isEqualByProximity(pointA, pointB) {
    return _math__WEBPACK_IMPORTED_MODULE_0__.point.distanceToPoint(pointA, pointB) < 0.001;
}
function isEqual(pointA, pointB) {
    return _math__WEBPACK_IMPORTED_MODULE_0__.point.distanceToPoint(pointA, pointB) === 0;
}
function findMatchIndexes(points, otherPoints) {
    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < otherPoints.length; j++) {
            if (isEqual(points[i], otherPoints[j])) {
                return [i, j];
            }
        }
    }
}
function followingIndex(index, size, direction) {
    return (index + size + direction) % size;
}
function circularFindNextIndexBy(listParams, otherListParams, criteria, direction) {
    const [, indexDelimiter, points] = listParams;
    const [, otherIndexDelimiter, otherPoints] = otherListParams;
    const pointsLength = points.length;
    const otherPointsLength = otherPoints.length;
    let startIndex = listParams[0];
    let otherStartIndex = otherListParams[0];
    if (!points[startIndex] ||
        !otherPoints[otherStartIndex] ||
        !points[indexDelimiter] ||
        !otherPoints[otherIndexDelimiter]) {
        return [undefined, undefined];
    }
    while (startIndex !== indexDelimiter &&
        otherStartIndex !== otherIndexDelimiter) {
        if (criteria(otherPoints[otherStartIndex], points[startIndex])) {
            return [startIndex, otherStartIndex];
        }
        startIndex = followingIndex(startIndex, pointsLength, direction);
        otherStartIndex = followingIndex(otherStartIndex, otherPointsLength, direction);
    }
    return [undefined, undefined];
}
function findChangedSegment(points, previousPoints) {
    const [firstMatchIndex, previousFirstMatchIndex] = findMatchIndexes(points, previousPoints) || [];
    const toBeNotEqualCriteria = (pointA, pointB) => isEqualByProximity(pointA, pointB) === false;
    const [lowDiffIndex, lowOtherDiffIndex] = circularFindNextIndexBy([
        followingIndex(firstMatchIndex, points.length, 1),
        firstMatchIndex,
        points,
    ], [
        followingIndex(previousFirstMatchIndex, previousPoints.length, 1),
        previousFirstMatchIndex,
        previousPoints,
    ], toBeNotEqualCriteria, 1);
    const [highIndex] = circularFindNextIndexBy([followingIndex(lowDiffIndex, points.length, -1), lowDiffIndex, points], [
        followingIndex(lowOtherDiffIndex, previousPoints.length, -1),
        lowOtherDiffIndex,
        previousPoints,
    ], toBeNotEqualCriteria, -1);
    return [lowDiffIndex, highIndex];
}
function getInterpolatedPoints(configuration, points, pointsOfReference) {
    const { interpolation, smoothing } = configuration;
    const result = points;
    if (interpolation) {
        const { knotsRatioPercentageOnAdd, knotsRatioPercentageOnEdit, smoothOnAdd = false, smoothOnEdit = false, } = smoothing;
        const knotsRatioPercentage = pointsOfReference
            ? knotsRatioPercentageOnEdit
            : knotsRatioPercentageOnAdd;
        const isEnabled = pointsOfReference ? smoothOnEdit : smoothOnAdd;
        if (isEnabled) {
            const [changedIniIndex, changedEndIndex] = pointsOfReference
                ? findChangedSegment(points, pointsOfReference)
                : [0, points.length - 1];
            if (!points[changedIniIndex] || !points[changedEndIndex]) {
                return points;
            }
            return ((0,_interpolation_interpolateSegmentPoints__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(points, changedIniIndex, changedEndIndex, knotsRatioPercentage));
        }
    }
    return result;
}


/***/ }),

/***/ 56229:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ deleteRelatedAnnotations)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _stateManagement_annotation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(47807);
/* harmony import */ var _contours_interpolation_interpolate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(73816);
/* harmony import */ var _contours_interpolation_getInterpolationData__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(55421);
/* harmony import */ var _enums_Events__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(94021);





function deleteRelatedAnnotations(viewportData) {
    const { annotation } = viewportData;
    const interpolationAnnotations = (0,_contours_interpolation_getInterpolationData__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)(viewportData, [
        { key: 'interpolationUID', value: viewportData.interpolationUID },
    ]);
    const referencedSliceIndex = annotation.metadata.sliceIndex;
    let minInterpolation = -1;
    let maxInterpolation = viewportData.sliceData.numberOfSlices;
    for (const [sliceIndex, annotations] of interpolationAnnotations.entries()) {
        if (sliceIndex === referencedSliceIndex) {
            continue;
        }
        const nonInterpolated = annotations.find((annotation) => !annotation.autoGenerated);
        if (!nonInterpolated) {
            continue;
        }
        if (sliceIndex < referencedSliceIndex) {
            minInterpolation = Math.max(sliceIndex, minInterpolation);
        }
        else {
            maxInterpolation = Math.min(sliceIndex, maxInterpolation);
        }
    }
    const removedAnnotations = [];
    for (const [sliceIndex, annotations] of interpolationAnnotations.entries()) {
        if (sliceIndex <= minInterpolation ||
            sliceIndex >= maxInterpolation ||
            sliceIndex === referencedSliceIndex) {
            continue;
        }
        annotations.forEach((annotationToDelete) => {
            if (annotationToDelete.autoGenerated) {
                _stateManagement_annotation__WEBPACK_IMPORTED_MODULE_1__.state.removeAnnotation(annotationToDelete.annotationUID);
                removedAnnotations.push(annotationToDelete);
            }
        });
    }
    if (removedAnnotations.length) {
        const eventDetails = {
            annotations: removedAnnotations,
            element: viewportData.viewport.element,
            viewportId: viewportData.viewport.id,
            renderingEngineId: viewportData.viewport.getRenderingEngine().id,
        };
        (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.triggerEvent)(viewportData.viewport.element, _enums_Events__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A.INTERPOLATED_ANNOTATIONS_REMOVED, eventDetails);
    }
    if (minInterpolation >= 0 &&
        maxInterpolation < viewportData.sliceData.numberOfSlices) {
        const nextAnnotation = interpolationAnnotations.get(maxInterpolation)[0];
        const viewportNewData = {
            viewport: viewportData.viewport,
            sliceData: {
                numberOfSlices: viewportData.sliceData.numberOfSlices,
                imageIndex: nextAnnotation.metadata.sliceIndex,
            },
            annotation: nextAnnotation,
            interpolationUID: nextAnnotation.interpolationUID,
        };
        (0,_contours_interpolation_interpolate__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)(viewportNewData);
    }
}


/***/ }),

/***/ 27479:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   d: () => (/* binding */ computeAndAddRepresentation)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(99737);
/* harmony import */ var _stateManagement_segmentation_internalAddRepresentationData__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(44188);
/* harmony import */ var _stateManagement_segmentation_triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(49906);
/* harmony import */ var _debounce__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(52905);





const computedRepresentations = new Map();
async function computeAndAddRepresentation(segmentationId, type, computeFunction, updateFunction, onComputationComplete) {
    const data = await computeFunction();
    (0,_stateManagement_segmentation_internalAddRepresentationData__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)({
        segmentationId,
        type,
        data,
    });
    onComputationComplete?.();
    if (!computedRepresentations.has(segmentationId)) {
        computedRepresentations.set(segmentationId, []);
    }
    const representations = computedRepresentations.get(segmentationId);
    if (!representations.includes(type)) {
        representations.push(type);
    }
    subscribeToSegmentationChanges(updateFunction);
    (0,_stateManagement_segmentation_triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_3__.triggerSegmentationModified)(segmentationId);
    return data;
}
function subscribeToSegmentationChanges(updateFunction) {
    const debouncedUpdateFunction = (event) => {
        _debouncedSegmentationModified(event, updateFunction);
    };
    updateFunction._debouncedUpdateFunction = debouncedUpdateFunction;
    _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.eventTarget.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_1__.Events.SEGMENTATION_DATA_MODIFIED, updateFunction._debouncedUpdateFunction);
    _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.eventTarget.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_1__.Events.SEGMENTATION_DATA_MODIFIED, updateFunction._debouncedUpdateFunction);
}
const _debouncedSegmentationModified = (0,_debounce__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A)((event, updateFunction) => {
    const segmentationId = event.detail.segmentationId;
    const representations = computedRepresentations.get(segmentationId);
    if (!representations || !representations.length) {
        return;
    }
    updateFunction(segmentationId);
    if (representations.length) {
        (0,_stateManagement_segmentation_triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_3__.triggerSegmentationModified)(segmentationId);
    }
}, 300);



/***/ }),

/***/ 86644:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   u: () => (/* binding */ getSVGStyleForSegment)
/* harmony export */ });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(99737);
/* harmony import */ var _stateManagement_segmentation_config_segmentationColor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(93733);
/* harmony import */ var _stateManagement_segmentation_getActiveSegmentation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(67165);
/* harmony import */ var _stateManagement_segmentation_getActiveSegmentIndex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(60740);
/* harmony import */ var _stateManagement_segmentation_getSegmentationRepresentationVisibility__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(33658);
/* harmony import */ var _stateManagement_segmentation_helpers_internalGetHiddenSegmentIndices__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(47098);
/* harmony import */ var _stateManagement_segmentation_SegmentationStyle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(92686);







function getSVGStyleForSegment({ segmentationId, segmentIndex, viewportId, autoGenerated = false, }) {
    const segmentColor = (0,_stateManagement_segmentation_config_segmentationColor__WEBPACK_IMPORTED_MODULE_1__.getSegmentIndexColor)(viewportId, segmentationId, segmentIndex);
    const segmentationVisible = (0,_stateManagement_segmentation_getSegmentationRepresentationVisibility__WEBPACK_IMPORTED_MODULE_4__/* .getSegmentationRepresentationVisibility */ .I)(viewportId, {
        segmentationId,
        type: _enums__WEBPACK_IMPORTED_MODULE_0__.SegmentationRepresentations.Contour,
    });
    const activeSegmentation = (0,_stateManagement_segmentation_getActiveSegmentation__WEBPACK_IMPORTED_MODULE_2__/* .getActiveSegmentation */ .T)(viewportId);
    const isActive = activeSegmentation?.segmentationId === segmentationId;
    const style = _stateManagement_segmentation_SegmentationStyle__WEBPACK_IMPORTED_MODULE_6__/* .segmentationStyle */ .Y.getStyle({
        viewportId,
        segmentationId,
        type: _enums__WEBPACK_IMPORTED_MODULE_0__.SegmentationRepresentations.Contour,
        segmentIndex,
    });
    const mergedConfig = style;
    let lineWidth = 1;
    let lineDash = undefined;
    let lineOpacity = 1;
    let fillOpacity = 0;
    if (autoGenerated) {
        lineWidth = mergedConfig.outlineWidthAutoGenerated ?? lineWidth;
        lineDash = mergedConfig.outlineDashAutoGenerated ?? lineDash;
        lineOpacity = mergedConfig.outlineOpacity ?? lineOpacity;
        fillOpacity = mergedConfig.fillAlphaAutoGenerated ?? fillOpacity;
    }
    else if (isActive) {
        lineWidth = mergedConfig.outlineWidth ?? lineWidth;
        lineDash = mergedConfig.outlineDash ?? lineDash;
        lineOpacity = mergedConfig.outlineOpacity ?? lineOpacity;
        fillOpacity = mergedConfig.fillAlpha ?? fillOpacity;
    }
    else {
        lineWidth = mergedConfig.outlineWidthInactive ?? lineWidth;
        lineDash = mergedConfig.outlineDashInactive ?? lineDash;
        lineOpacity = mergedConfig.outlineOpacityInactive ?? lineOpacity;
        fillOpacity = mergedConfig.fillAlphaInactive ?? fillOpacity;
    }
    if ((0,_stateManagement_segmentation_getActiveSegmentIndex__WEBPACK_IMPORTED_MODULE_3__/* .getActiveSegmentIndex */ .Q)(segmentationId) === segmentIndex) {
        lineWidth += mergedConfig.activeSegmentOutlineWidthDelta;
    }
    lineWidth = mergedConfig.renderOutline ? lineWidth : 0;
    fillOpacity = mergedConfig.renderFill ? fillOpacity : 0;
    const color = `rgba(${segmentColor[0]}, ${segmentColor[1]}, ${segmentColor[2]}, ${lineOpacity})`;
    const fillColor = `rgb(${segmentColor[0]}, ${segmentColor[1]}, ${segmentColor[2]})`;
    const hiddenSegments = (0,_stateManagement_segmentation_helpers_internalGetHiddenSegmentIndices__WEBPACK_IMPORTED_MODULE_5__/* .internalGetHiddenSegmentIndices */ .s)(viewportId, {
        segmentationId,
        type: _enums__WEBPACK_IMPORTED_MODULE_0__.SegmentationRepresentations.Contour,
    });
    const isVisible = !hiddenSegments.has(segmentIndex);
    return {
        color,
        fillColor,
        lineWidth,
        fillOpacity,
        lineDash,
        textbox: {
            color,
        },
        visibility: segmentationVisible && isVisible,
    };
}


/***/ }),

/***/ 14543:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getViewportIdsWithToolToRender)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _filterViewportsWithFrameOfReferenceUID__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3198);
/* harmony import */ var _filterViewportsWithToolEnabled__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9356);
/* harmony import */ var _filterViewportsWithParallelNormals__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(67514);




function getViewportIdsWithToolToRender(element, toolName, requireParallelNormals = true) {
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
    const { renderingEngine, FrameOfReferenceUID } = enabledElement;
    let viewports = renderingEngine.getViewports();
    viewports = (0,_filterViewportsWithFrameOfReferenceUID__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(viewports, FrameOfReferenceUID);
    viewports = (0,_filterViewportsWithToolEnabled__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)(viewports, toolName);
    const viewport = renderingEngine.getViewport(enabledElement.viewportId);
    if (requireParallelNormals) {
        viewports = (0,_filterViewportsWithParallelNormals__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)(viewports, viewport.getCamera());
    }
    const viewportIds = viewports.map((vp) => vp.id);
    return viewportIds;
}


/***/ })

}]);