"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[5400],{

/***/ 18262:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ drawingSvg_draw)
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/store/state.js
var state = __webpack_require__(85204);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/getSvgDrawingHelper.js


const VIEWPORT_ELEMENT = 'viewport-element';
function getSvgDrawingHelper(element) {
    const enabledElement = (0,esm.getEnabledElement)(element);
    const { viewportId, renderingEngineId } = enabledElement;
    const canvasHash = `${viewportId}:${renderingEngineId}`;
    const svgLayerElement = _getSvgLayer(element);
    Object.keys(state/* state */.wk.svgNodeCache[canvasHash]).forEach((cacheKey) => {
        state/* state */.wk.svgNodeCache[canvasHash][cacheKey].touched = false;
    });
    return {
        svgLayerElement: svgLayerElement,
        svgNodeCacheForCanvas: state/* state */.wk.svgNodeCache,
        getSvgNode: getSvgNode.bind(this, canvasHash),
        appendNode: appendNode.bind(this, svgLayerElement, canvasHash),
        setNodeTouched: setNodeTouched.bind(this, canvasHash),
        clearUntouched: clearUntouched.bind(this, svgLayerElement, canvasHash),
    };
}
function _getSvgLayer(element) {
    const viewportElement = `.${VIEWPORT_ELEMENT}`;
    const internalDivElement = element.querySelector(viewportElement);
    const svgLayer = internalDivElement?.querySelector(':scope > .svg-layer');
    return svgLayer;
}
function getSvgNode(canvasHash, cacheKey) {
    if (!state/* state */.wk.svgNodeCache[canvasHash]) {
        return;
    }
    if (state/* state */.wk.svgNodeCache[canvasHash][cacheKey]) {
        return state/* state */.wk.svgNodeCache[canvasHash][cacheKey].domRef;
    }
}
function appendNode(svgLayerElement, canvasHash, svgNode, cacheKey) {
    if (!state/* state */.wk.svgNodeCache[canvasHash]) {
        return null;
    }
    state/* state */.wk.svgNodeCache[canvasHash][cacheKey] = {
        touched: true,
        domRef: svgNode,
    };
    svgLayerElement.appendChild(svgNode);
}
function setNodeTouched(canvasHash, cacheKey) {
    if (!state/* state */.wk.svgNodeCache[canvasHash]) {
        return;
    }
    if (state/* state */.wk.svgNodeCache[canvasHash][cacheKey]) {
        state/* state */.wk.svgNodeCache[canvasHash][cacheKey].touched = true;
    }
}
function clearUntouched(svgLayerElement, canvasHash) {
    if (!state/* state */.wk.svgNodeCache[canvasHash]) {
        return;
    }
    Object.keys(state/* state */.wk.svgNodeCache[canvasHash]).forEach((cacheKey) => {
        const cacheEntry = state/* state */.wk.svgNodeCache[canvasHash][cacheKey];
        if (!cacheEntry.touched && cacheEntry.domRef) {
            svgLayerElement.removeChild(cacheEntry.domRef);
            delete state/* state */.wk.svgNodeCache[canvasHash][cacheKey];
        }
    });
}
/* harmony default export */ const drawingSvg_getSvgDrawingHelper = (getSvgDrawingHelper);

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/draw.js

function draw(element, fn) {
    const svgDrawingHelper = drawingSvg_getSvgDrawingHelper(element);
    fn(svgDrawingHelper);
    svgDrawingHelper.clearUntouched();
}
/* harmony default export */ const drawingSvg_draw = (draw);


/***/ }),

/***/ 12004:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getHash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(97181);
/* harmony import */ var _setAttributesIfNecessary__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(85899);
/* harmony import */ var _setNewAttributesIfValid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(56442);



function drawCircle(svgDrawingHelper, annotationUID, circleUID, center, radius, options = {}, dataId = '') {
    const { color, fill, width, lineWidth, lineDash, fillOpacity, strokeOpacity, } = Object.assign({
        color: 'rgb(0, 255, 0)',
        fill: 'transparent',
        width: '2',
        lineDash: undefined,
        lineWidth: undefined,
        strokeOpacity: 1,
        fillOpacity: 1,
    }, options);
    const strokeWidth = lineWidth || width;
    const svgns = 'http://www.w3.org/2000/svg';
    const svgNodeHash = (0,_getHash__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(annotationUID, 'circle', circleUID);
    const existingCircleElement = svgDrawingHelper.getSvgNode(svgNodeHash);
    const attributes = {
        cx: `${center[0]}`,
        cy: `${center[1]}`,
        r: `${radius}`,
        stroke: color,
        fill,
        'stroke-width': strokeWidth,
        'stroke-dasharray': lineDash,
        'fill-opacity': fillOpacity,
        'stroke-opacity': strokeOpacity,
    };
    if (existingCircleElement) {
        (0,_setAttributesIfNecessary__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(attributes, existingCircleElement);
        svgDrawingHelper.setNodeTouched(svgNodeHash);
    }
    else {
        const newCircleElement = document.createElementNS(svgns, 'circle');
        if (dataId !== '') {
            newCircleElement.setAttribute('data-id', dataId);
        }
        (0,_setNewAttributesIfValid__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)(attributes, newCircleElement);
        svgDrawingHelper.appendNode(newCircleElement, svgNodeHash);
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (drawCircle);


/***/ }),

/***/ 56745:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _drawHandle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(94042);

function drawHandles(svgDrawingHelper, annotationUID, handleGroupUID, handlePoints, options = {}) {
    handlePoints.forEach((handle, i) => {
        (0,_drawHandle__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(svgDrawingHelper, annotationUID, handleGroupUID, handle, options, i);
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (drawHandles);


/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ drawingSvg_drawLinkedTextBox)
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawTextBox.js
var drawTextBox = __webpack_require__(26290);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawLine.js
var drawLine = __webpack_require__(92118);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/vec2/findClosestPoint.js
var findClosestPoint = __webpack_require__(90554);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawLink.js


function drawLink(svgDrawingHelper, annotationUID, linkUID, annotationAnchorPoints, refPoint, boundingBox, options = {}) {
    const start = annotationAnchorPoints.length > 0
        ? (0,findClosestPoint/* default */.A)(annotationAnchorPoints, refPoint)
        : refPoint;
    const boundingBoxPoints = _boundingBoxPoints(boundingBox);
    const end = (0,findClosestPoint/* default */.A)(boundingBoxPoints, start);
    const mergedOptions = Object.assign({
        color: 'rgb(255, 255, 0)',
        lineWidth: '1',
        lineDash: '2,3',
    }, options);
    (0,drawLine/* default */.A)(svgDrawingHelper, annotationUID, `link-${linkUID}`, start, end, mergedOptions);
}
function _boundingBoxPoints(boundingBox) {
    const { x: left, y: top, height, width } = boundingBox;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const topMiddle = [left + halfWidth, top];
    const leftMiddle = [left, top + halfHeight];
    const bottomMiddle = [left + halfWidth, top + height];
    const rightMiddle = [left + width, top + halfHeight];
    return [topMiddle, leftMiddle, bottomMiddle, rightMiddle];
}
/* harmony default export */ const drawingSvg_drawLink = (drawLink);

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawLinkedTextBox.js


function drawLinkedTextBox(svgDrawingHelper, annotationUID, textBoxUID, textLines, textBoxPosition, annotationAnchorPoints, textBox, options = {}) {
    const mergedOptions = Object.assign({
        handleRadius: '6',
        centering: {
            x: false,
            y: true,
        },
    }, options);
    const canvasBoundingBox = (0,drawTextBox/* default */.A)(svgDrawingHelper, annotationUID, textBoxUID, textLines, textBoxPosition, mergedOptions);
    drawingSvg_drawLink(svgDrawingHelper, annotationUID, textBoxUID, annotationAnchorPoints, textBoxPosition, canvasBoundingBox, mergedOptions);
    return canvasBoundingBox;
}
/* harmony default export */ const drawingSvg_drawLinkedTextBox = (drawLinkedTextBox);


/***/ }),

/***/ 97530:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ drawRect)
/* harmony export */ });
/* harmony import */ var _getHash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(97181);
/* harmony import */ var _drawRectByCoordinates__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(75076);


function drawRect(svgDrawingHelper, annotationUID, rectangleUID, start, end, options = {}, dataId = '') {
    const topLeft = [start[0], start[1]];
    const topRight = [end[0], start[1]];
    const bottomLeft = [start[0], end[1]];
    const bottomRight = [end[0], end[1]];
    (0,_drawRectByCoordinates__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(svgDrawingHelper, annotationUID, rectangleUID, [topLeft, topRight, bottomLeft, bottomRight], options, dataId);
}


/***/ }),

/***/ 92686:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Y: () => (/* binding */ segmentationStyle)
/* harmony export */ });
/* harmony import */ var _tools_displayTools_Contour_contourConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67772);
/* harmony import */ var _tools_displayTools_Labelmap_labelmapConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(53486);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(99737);
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(15327);




class SegmentationStyle {
    constructor() {
        this.config = {
            global: {},
            segmentations: {},
            viewportsStyle: {},
        };
    }
    setStyle(specifier, styles) {
        const { viewportId, segmentationId, type, segmentIndex } = specifier;
        const currentStyles = this.getStyle(specifier);
        let updatedStyles;
        if (!viewportId && !segmentationId) {
            updatedStyles = {
                ...currentStyles,
                ...styles,
            };
        }
        else {
            updatedStyles = this.copyActiveToInactiveIfNotProvided({
                ...currentStyles,
                ...styles,
            }, type);
        }
        if (!type) {
            throw new Error('Type is required to set a style');
        }
        if (viewportId) {
            if (!this.config.viewportsStyle[viewportId]) {
                this.config.viewportsStyle[viewportId] = {
                    renderInactiveSegmentations: false,
                    representations: {},
                };
            }
            const representations = this.config.viewportsStyle[viewportId].representations;
            if (segmentationId) {
                if (!representations[segmentationId]) {
                    representations[segmentationId] = {};
                }
                if (!representations[segmentationId][type]) {
                    representations[segmentationId][type] = {};
                }
                const repConfig = representations[segmentationId][type];
                if (segmentIndex !== undefined) {
                    if (!repConfig.perSegment) {
                        repConfig.perSegment = {};
                    }
                    repConfig.perSegment[segmentIndex] = updatedStyles;
                }
                else {
                    repConfig.allSegments = updatedStyles;
                }
            }
            else {
                const ALL_SEGMENTATIONS_KEY = '__allSegmentations__';
                if (!representations[ALL_SEGMENTATIONS_KEY]) {
                    representations[ALL_SEGMENTATIONS_KEY] = {};
                }
                if (!representations[ALL_SEGMENTATIONS_KEY][type]) {
                    representations[ALL_SEGMENTATIONS_KEY][type] = {};
                }
                representations[ALL_SEGMENTATIONS_KEY][type].allSegments =
                    updatedStyles;
            }
        }
        else if (segmentationId) {
            if (!this.config.segmentations[segmentationId]) {
                this.config.segmentations[segmentationId] = {};
            }
            if (!this.config.segmentations[segmentationId][type]) {
                this.config.segmentations[segmentationId][type] = {};
            }
            const segConfig = this.config.segmentations[segmentationId][type];
            if (segmentIndex !== undefined) {
                if (!segConfig.perSegment) {
                    segConfig.perSegment = {};
                }
                segConfig.perSegment[segmentIndex] = updatedStyles;
            }
            else {
                segConfig.allSegments = updatedStyles;
            }
        }
        else {
            this.config.global[type] = updatedStyles;
        }
    }
    copyActiveToInactiveIfNotProvided(styles, type) {
        const processedStyles = { ...styles };
        if (type === _enums__WEBPACK_IMPORTED_MODULE_2__.SegmentationRepresentations.Labelmap) {
            const labelmapStyles = processedStyles;
            labelmapStyles.renderOutlineInactive ??= labelmapStyles.renderOutline;
            labelmapStyles.outlineWidthInactive ??= labelmapStyles.outlineWidth;
            labelmapStyles.renderFillInactive ??= labelmapStyles.renderFill;
            labelmapStyles.fillAlphaInactive ??= labelmapStyles.fillAlpha;
            labelmapStyles.outlineOpacityInactive ??= labelmapStyles.outlineOpacity;
        }
        else if (type === _enums__WEBPACK_IMPORTED_MODULE_2__.SegmentationRepresentations.Contour) {
            const contourStyles = processedStyles;
            contourStyles.outlineWidthInactive ??= contourStyles.outlineWidth;
            contourStyles.outlineOpacityInactive ??= contourStyles.outlineOpacity;
            contourStyles.outlineDashInactive ??= contourStyles.outlineDash;
            contourStyles.renderOutlineInactive ??= contourStyles.renderOutline;
            contourStyles.renderFillInactive ??= contourStyles.renderFill;
            contourStyles.fillAlphaInactive ??= contourStyles.fillAlpha;
        }
        return processedStyles;
    }
    getStyle(specifier) {
        const { viewportId, segmentationId, type, segmentIndex } = specifier;
        let combinedStyle = this.getDefaultStyle(type);
        let renderInactiveSegmentations = false;
        if (this.config.global[type]) {
            combinedStyle = {
                ...combinedStyle,
                ...this.config.global[type],
            };
        }
        if (this.config.segmentations[segmentationId]?.[type]) {
            combinedStyle = {
                ...combinedStyle,
                ...this.config.segmentations[segmentationId][type].allSegments,
            };
            if (segmentIndex !== undefined &&
                this.config.segmentations[segmentationId][type].perSegment?.[segmentIndex]) {
                combinedStyle = {
                    ...combinedStyle,
                    ...this.config.segmentations[segmentationId][type].perSegment[segmentIndex],
                };
            }
        }
        if (viewportId && this.config.viewportsStyle[viewportId]) {
            renderInactiveSegmentations =
                this.config.viewportsStyle[viewportId].renderInactiveSegmentations;
            const allSegmentationsKey = '__allSegmentations__';
            if (this.config.viewportsStyle[viewportId].representations[allSegmentationsKey]?.[type]) {
                combinedStyle = {
                    ...combinedStyle,
                    ...this.config.viewportsStyle[viewportId].representations[allSegmentationsKey][type].allSegments,
                };
            }
            if (segmentationId &&
                this.config.viewportsStyle[viewportId].representations[segmentationId]?.[type]) {
                combinedStyle = {
                    ...combinedStyle,
                    ...this.config.viewportsStyle[viewportId].representations[segmentationId][type].allSegments,
                };
                if (segmentIndex !== undefined &&
                    this.config.viewportsStyle[viewportId].representations[segmentationId][type].perSegment?.[segmentIndex]) {
                    combinedStyle = {
                        ...combinedStyle,
                        ...this.config.viewportsStyle[viewportId].representations[segmentationId][type].perSegment[segmentIndex],
                    };
                }
            }
        }
        return combinedStyle;
    }
    getRenderInactiveSegmentations(viewportId) {
        return this.config.viewportsStyle[viewportId]?.renderInactiveSegmentations;
    }
    setRenderInactiveSegmentations(viewportId, renderInactiveSegmentations) {
        if (!this.config.viewportsStyle[viewportId]) {
            this.config.viewportsStyle[viewportId] = {
                renderInactiveSegmentations: false,
                representations: {},
            };
        }
        this.config.viewportsStyle[viewportId].renderInactiveSegmentations =
            renderInactiveSegmentations;
    }
    getDefaultStyle(type) {
        switch (type) {
            case _enums__WEBPACK_IMPORTED_MODULE_2__.SegmentationRepresentations.Labelmap:
                return (0,_tools_displayTools_Labelmap_labelmapConfig__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)();
            case _enums__WEBPACK_IMPORTED_MODULE_2__.SegmentationRepresentations.Contour:
                return (0,_tools_displayTools_Contour_contourConfig__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)();
            case _enums__WEBPACK_IMPORTED_MODULE_2__.SegmentationRepresentations.Surface:
                return {};
            default:
                throw new Error(`Unknown representation type: ${type}`);
        }
    }
    clearSegmentationStyle(segmentationId) {
        if (this.config.segmentations[segmentationId]) {
            delete this.config.segmentations[segmentationId];
        }
    }
    clearAllSegmentationStyles() {
        this.config.segmentations = {};
    }
    clearViewportStyle(viewportId) {
        if (this.config.viewportsStyle[viewportId]) {
            delete this.config.viewportsStyle[viewportId];
        }
    }
    clearAllViewportStyles() {
        for (const viewportId in this.config.viewportsStyle) {
            const viewportStyle = this.config.viewportsStyle[viewportId];
            const renderInactiveSegmentations = viewportStyle.renderInactiveSegmentations;
            this.config.viewportsStyle[viewportId] = {
                renderInactiveSegmentations,
                representations: {},
            };
        }
    }
    resetToGlobalStyle() {
        this.clearAllSegmentationStyles();
        this.clearAllViewportStyles();
    }
    hasCustomStyle(specifier) {
        const { type } = specifier;
        const style = this.getStyle(specifier);
        const defaultStyle = this.getDefaultStyle(type);
        return !_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_3__.utilities.deepEqual(style, defaultStyle);
    }
}
const segmentationStyle = new SegmentationStyle();



/***/ }),

/***/ 98798:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Q: () => (/* binding */ triggerSegmentationDataModified)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(99737);
/* harmony import */ var _utilities_segmentation_utilities__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(64063);



function triggerSegmentationDataModified(segmentationId, modifiedSlicesToUse, segmentIndex) {
    const eventDetail = {
        segmentationId,
        modifiedSlicesToUse,
        segmentIndex,
    };
    (0,_utilities_segmentation_utilities__WEBPACK_IMPORTED_MODULE_2__/* .setSegmentationDirty */ .HM)(segmentationId);
    (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.triggerEvent)(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.eventTarget, _enums__WEBPACK_IMPORTED_MODULE_1__.Events.SEGMENTATION_DATA_MODIFIED, eventDetail);
}


/***/ }),

/***/ 67165:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   T: () => (/* binding */ getActiveSegmentation)
/* harmony export */ });
/* harmony import */ var _SegmentationStateManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(59475);

function getActiveSegmentation(viewportId) {
    const segmentationStateManager = _SegmentationStateManager__WEBPACK_IMPORTED_MODULE_0__/* .defaultSegmentationStateManager */ ._6;
    return segmentationStateManager.getActiveSegmentation(viewportId);
}


/***/ }),

/***/ 33658:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   I: () => (/* binding */ getSegmentationRepresentationVisibility)
/* harmony export */ });
/* harmony import */ var _SegmentationStateManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(59475);

function getSegmentationRepresentationVisibility(viewportId, specifier) {
    const segmentationStateManager = _SegmentationStateManager__WEBPACK_IMPORTED_MODULE_0__/* .defaultSegmentationStateManager */ ._6;
    return segmentationStateManager.getSegmentationRepresentationVisibility(viewportId, specifier);
}


/***/ }),

/***/ 44188:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getSegmentation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(33283);
/* harmony import */ var _enums_SegmentationRepresentations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18682);


function internalAddRepresentationData({ segmentationId, type, data, }) {
    const segmentation = (0,_getSegmentation__WEBPACK_IMPORTED_MODULE_0__/* .getSegmentation */ .T)(segmentationId);
    if (!segmentation) {
        throw new Error(`Segmentation ${segmentationId} not found`);
    }
    if (segmentation.representationData[type]) {
        console.warn(`Representation data of type ${type} already exists for segmentation ${segmentationId}, overwriting it.`);
    }
    switch (type) {
        case _enums_SegmentationRepresentations__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.Labelmap:
            if (data) {
                segmentation.representationData[type] =
                    data;
            }
            break;
        case _enums_SegmentationRepresentations__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.Contour:
            if (data) {
                segmentation.representationData[type] = data;
            }
            break;
        case _enums_SegmentationRepresentations__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.Surface:
            if (data) {
                segmentation.representationData[type] = data;
            }
            break;
        default:
            throw new Error(`Invalid representation type ${type}`);
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (internalAddRepresentationData);


/***/ }),

/***/ 65136:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(85204);


function getToolGroupForViewport(viewportId, renderingEngineId) {
    if (!renderingEngineId) {
        renderingEngineId = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getRenderingEngines)().find((re) => re.getViewports().find((vp) => vp.id === viewportId))?.id;
    }
    const toolGroupFilteredByIds = _state__WEBPACK_IMPORTED_MODULE_1__/* .state */ .wk.toolGroups.filter((tg) => tg.viewportsInfo.some((vp) => vp.renderingEngineId === renderingEngineId &&
        (!vp.viewportId || vp.viewportId === viewportId)));
    if (!toolGroupFilteredByIds.length) {
        return;
    }
    if (toolGroupFilteredByIds.length > 1) {
        throw new Error(`Multiple tool groups found for renderingEngineId: ${renderingEngineId} and viewportId: ${viewportId}. You should only
      have one tool group per viewport in a renderingEngine.`);
    }
    return toolGroupFilteredByIds[0];
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getToolGroupForViewport);


/***/ }),

/***/ 37590:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _stateManagement_segmentation_triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(49906);
/* harmony import */ var _PlanarFreehandROITool__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(28220);



class PlanarFreehandContourSegmentationTool extends _PlanarFreehandROITool__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A {
    static { this.toolName = 'PlanarFreehandContourSegmentationTool'; }
    constructor(toolProps) {
        const initialProps = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.deepMerge({
            configuration: {
                calculateStats: false,
                allowOpenContours: false,
            },
        }, toolProps);
        super(initialProps);
    }
    isContourSegmentationTool() {
        return true;
    }
    renderAnnotationInstance(renderContext) {
        const annotation = renderContext.annotation;
        const { invalidated } = annotation;
        const renderResult = super.renderAnnotationInstance(renderContext);
        if (invalidated) {
            const { segmentationId } = annotation.data.segmentation;
            (0,_stateManagement_segmentation_triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_1__.triggerSegmentationDataModified)(segmentationId);
        }
        return renderResult;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PlanarFreehandContourSegmentationTool);


/***/ }),

/***/ 28220:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(85817);
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15327);
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3823);
/* harmony import */ var _utilities_getCalibratedUnits__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4096);
/* harmony import */ var _utilities_math__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(95527);
/* harmony import */ var _utilities_planar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(13165);
/* harmony import */ var _utilities_throttle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(27730);
/* harmony import */ var _utilities_viewportFilters__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(60810);
/* harmony import */ var _utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(58640);
/* harmony import */ var _planarFreehandROITool_drawLoop__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(55927);
/* harmony import */ var _planarFreehandROITool_editLoopCommon__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(92400);
/* harmony import */ var _planarFreehandROITool_closedContourEditLoop__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(57999);
/* harmony import */ var _planarFreehandROITool_openContourEditLoop__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(69855);
/* harmony import */ var _planarFreehandROITool_openContourEndEditLoop__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(70734);
/* harmony import */ var _planarFreehandROITool_renderMethods__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(58161);
/* harmony import */ var _stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(44049);
/* harmony import */ var _drawingSvg__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(74347);
/* harmony import */ var _utilities_drawing__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(473);
/* harmony import */ var _utilities_math_polyline__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(92984);
/* harmony import */ var _utilities_viewport_isViewportPreScaled__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(18990);
/* harmony import */ var _utilities_math_basic__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(73262);
/* harmony import */ var _utilities_contours_calculatePerimeter__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(93843);
/* harmony import */ var _base_ContourSegmentationBaseTool__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(36320);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(99737);
/* harmony import */ var _utilities_getPixelValueUnits__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(40634);


























const { pointCanProjectOnLine } = _utilities_math__WEBPACK_IMPORTED_MODULE_4__.polyline;
const { EPSILON } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.CONSTANTS;
const PARALLEL_THRESHOLD = 1 - EPSILON;
class PlanarFreehandROITool extends _base_ContourSegmentationBaseTool__WEBPACK_IMPORTED_MODULE_22__/* ["default"] */ .A {
    static { this.toolName = 'PlanarFreehandROI'; }
    constructor(toolProps = {}, defaultToolProps = {
        supportedInteractionTypes: ['Mouse', 'Touch'],
        configuration: {
            storePointData: false,
            shadow: true,
            preventHandleOutsideImage: false,
            contourHoleAdditionModifierKey: _enums__WEBPACK_IMPORTED_MODULE_23__.KeyboardBindings.Shift,
            alwaysRenderOpenContourHandles: {
                enabled: false,
                radius: 2,
            },
            allowOpenContours: true,
            closeContourProximity: 10,
            checkCanvasEditFallbackProximity: 6,
            makeClockWise: true,
            subPixelResolution: 4,
            smoothing: {
                smoothOnAdd: false,
                smoothOnEdit: false,
                knotsRatioPercentageOnAdd: 40,
                knotsRatioPercentageOnEdit: 40,
            },
            interpolation: {
                enabled: false,
                onInterpolationComplete: null,
            },
            decimate: {
                enabled: false,
                epsilon: 0.1,
            },
            displayOnePointAsCrosshairs: false,
            calculateStats: true,
            getTextLines: defaultGetTextLines,
            statsCalculator: _utilities_math_basic__WEBPACK_IMPORTED_MODULE_20__.BasicStatsCalculator,
        },
    }) {
        super(toolProps, defaultToolProps);
        this.isDrawing = false;
        this.isEditingClosed = false;
        this.isEditingOpen = false;
        this.addNewAnnotation = (evt) => {
            const eventDetail = evt.detail;
            const { element } = eventDetail;
            const annotation = this.createAnnotation(evt);
            this.addAnnotation(annotation, element);
            const viewportIdsToRender = (0,_utilities_viewportFilters__WEBPACK_IMPORTED_MODULE_7__.getViewportIdsWithToolToRender)(element, this.getToolName());
            this.activateDraw(evt, annotation, viewportIdsToRender);
            evt.preventDefault();
            (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .A)(viewportIdsToRender);
            return annotation;
        };
        this.handleSelectedCallback = (evt, annotation, handle) => {
            const eventDetail = evt.detail;
            const { element } = eventDetail;
            const viewportIdsToRender = (0,_utilities_viewportFilters__WEBPACK_IMPORTED_MODULE_7__.getViewportIdsWithToolToRender)(element, this.getToolName());
            this.activateOpenContourEndEdit(evt, annotation, viewportIdsToRender, handle);
        };
        this.toolSelectedCallback = (evt, annotation) => {
            const eventDetail = evt.detail;
            const { element } = eventDetail;
            const viewportIdsToRender = (0,_utilities_viewportFilters__WEBPACK_IMPORTED_MODULE_7__.getViewportIdsWithToolToRender)(element, this.getToolName());
            if (annotation.data.contour.closed) {
                this.activateClosedContourEdit(evt, annotation, viewportIdsToRender);
            }
            else {
                this.activateOpenContourEdit(evt, annotation, viewportIdsToRender);
            }
            evt.preventDefault();
        };
        this.isPointNearTool = (element, annotation, canvasCoords, proximity) => {
            const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElement)(element);
            const { viewport } = enabledElement;
            const { polyline: points } = annotation.data.contour;
            let previousPoint = viewport.worldToCanvas(points[0]);
            for (let i = 1; i < points.length; i++) {
                const p1 = previousPoint;
                const p2 = viewport.worldToCanvas(points[i]);
                const canProject = pointCanProjectOnLine(canvasCoords, p1, p2, proximity);
                if (canProject) {
                    return true;
                }
                previousPoint = p2;
            }
            if (!annotation.data.contour.closed) {
                return false;
            }
            const pStart = viewport.worldToCanvas(points[0]);
            const pEnd = viewport.worldToCanvas(points[points.length - 1]);
            return pointCanProjectOnLine(canvasCoords, pStart, pEnd, proximity);
        };
        this.cancel = (element) => {
            const isDrawing = this.isDrawing;
            const isEditingOpen = this.isEditingOpen;
            const isEditingClosed = this.isEditingClosed;
            if (isDrawing) {
                this.cancelDrawing(element);
            }
            else if (isEditingOpen) {
                this.cancelOpenContourEdit(element);
            }
            else if (isEditingClosed) {
                this.cancelClosedContourEdit(element);
            }
        };
        this._calculateCachedStats = (annotation, viewport, renderingEngine, enabledElement) => {
            const { data } = annotation;
            const { cachedStats } = data;
            const { polyline: points, closed } = data.contour;
            const targetIds = Object.keys(cachedStats);
            for (let i = 0; i < targetIds.length; i++) {
                const targetId = targetIds[i];
                const image = this.getTargetImageData(targetId);
                if (!image) {
                    continue;
                }
                const { imageData, metadata } = image;
                const canvasCoordinates = points.map((p) => viewport.worldToCanvas(p));
                const modalityUnitOptions = {
                    isPreScaled: (0,_utilities_viewport_isViewportPreScaled__WEBPACK_IMPORTED_MODULE_19__/* .isViewportPreScaled */ .u)(viewport, targetId),
                    isSuvScaled: this.isSuvScaled(viewport, targetId, annotation.metadata.referencedImageId),
                };
                const modalityUnit = (0,_utilities_getPixelValueUnits__WEBPACK_IMPORTED_MODULE_24__/* .getPixelValueUnits */ .j)(metadata.Modality, annotation.metadata.referencedImageId, modalityUnitOptions);
                const calibratedScale = (0,_utilities_getCalibratedUnits__WEBPACK_IMPORTED_MODULE_3__/* .getCalibratedLengthUnitsAndScale */ .Op)(image, () => {
                    const polyline = data.contour.polyline;
                    const numPoints = polyline.length;
                    const projectedPolyline = new Array(numPoints);
                    for (let i = 0; i < numPoints; i++) {
                        projectedPolyline[i] = viewport.worldToCanvas(polyline[i]);
                    }
                    const { maxX: canvasMaxX, maxY: canvasMaxY, minX: canvasMinX, minY: canvasMinY, } = _utilities_math__WEBPACK_IMPORTED_MODULE_4__.polyline.getAABB(projectedPolyline);
                    const topLeftBBWorld = viewport.canvasToWorld([canvasMinX, canvasMinY]);
                    const topLeftBBIndex = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.transformWorldToIndex(imageData, topLeftBBWorld);
                    const bottomRightBBWorld = viewport.canvasToWorld([
                        canvasMaxX,
                        canvasMaxY,
                    ]);
                    const bottomRightBBIndex = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.transformWorldToIndex(imageData, bottomRightBBWorld);
                    return [topLeftBBIndex, bottomRightBBIndex];
                });
                const canvasPoint = canvasCoordinates[0];
                const originalWorldPoint = viewport.canvasToWorld(canvasPoint);
                const deltaXPoint = viewport.canvasToWorld([
                    canvasPoint[0] + 1,
                    canvasPoint[1],
                ]);
                const deltaYPoint = viewport.canvasToWorld([
                    canvasPoint[0],
                    canvasPoint[1] + 1,
                ]);
                const deltaInX = gl_matrix__WEBPACK_IMPORTED_MODULE_2__/* .vec3.distance */ .eR.distance(originalWorldPoint, deltaXPoint);
                const deltaInY = gl_matrix__WEBPACK_IMPORTED_MODULE_2__/* .vec3.distance */ .eR.distance(originalWorldPoint, deltaYPoint);
                if (closed) {
                    this.updateClosedCachedStats({
                        targetId,
                        viewport,
                        canvasCoordinates,
                        points,
                        imageData,
                        metadata,
                        cachedStats,
                        modalityUnit,
                        calibratedScale,
                        deltaInX,
                        deltaInY,
                    });
                }
                else {
                    this.updateOpenCachedStats({
                        metadata,
                        canvasCoordinates,
                        targetId,
                        cachedStats,
                        modalityUnit,
                        calibratedScale,
                        deltaInX,
                        deltaInY,
                    });
                }
            }
            const invalidated = annotation.invalidated;
            annotation.invalidated = false;
            if (invalidated) {
                (0,_stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_15__.triggerAnnotationModified)(annotation, enabledElement.viewport.element, _enums__WEBPACK_IMPORTED_MODULE_23__.ChangeTypes.StatsUpdated);
            }
            return cachedStats;
        };
        this._renderStats = (annotation, viewport, enabledElement, svgDrawingHelper) => {
            const { data } = annotation;
            const targetId = this.getTargetId(viewport);
            const styleSpecifier = {
                toolGroupId: this.toolGroupId,
                toolName: this.getToolName(),
                viewportId: enabledElement.viewport.id,
                annotationUID: annotation.annotationUID,
            };
            const options = this.getLinkedTextBoxStyle(styleSpecifier, annotation);
            if (!options.visibility) {
                return;
            }
            const textLines = this.configuration.getTextLines(data, targetId);
            if (!textLines || textLines.length === 0) {
                return;
            }
            const canvasCoordinates = data.contour.polyline.map((p) => viewport.worldToCanvas(p));
            if (!data.handles.textBox.hasMoved) {
                const canvasTextBoxCoords = (0,_utilities_drawing__WEBPACK_IMPORTED_MODULE_17__.getTextBoxCoordsCanvas)(canvasCoordinates);
                data.handles.textBox.worldPosition =
                    viewport.canvasToWorld(canvasTextBoxCoords);
            }
            const textBoxPosition = viewport.worldToCanvas(data.handles.textBox.worldPosition);
            const textBoxUID = '1';
            const boundingBox = (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_16__.drawLinkedTextBox)(svgDrawingHelper, annotation.annotationUID ?? '', textBoxUID, textLines, textBoxPosition, canvasCoordinates, {}, options);
            const { x: left, y: top, width, height } = boundingBox;
            data.handles.textBox.worldBoundingBox = {
                topLeft: viewport.canvasToWorld([left, top]),
                topRight: viewport.canvasToWorld([left + width, top]),
                bottomLeft: viewport.canvasToWorld([left, top + height]),
                bottomRight: viewport.canvasToWorld([left + width, top + height]),
            };
        };
        (0,_planarFreehandROITool_drawLoop__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .A)(this);
        (0,_planarFreehandROITool_editLoopCommon__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .A)(this);
        (0,_planarFreehandROITool_closedContourEditLoop__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A)(this);
        (0,_planarFreehandROITool_openContourEditLoop__WEBPACK_IMPORTED_MODULE_12__/* ["default"] */ .A)(this);
        (0,_planarFreehandROITool_openContourEndEditLoop__WEBPACK_IMPORTED_MODULE_13__/* ["default"] */ .A)(this);
        (0,_planarFreehandROITool_renderMethods__WEBPACK_IMPORTED_MODULE_14__/* ["default"] */ .A)(this);
        this._throttledCalculateCachedStats = (0,_utilities_throttle__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A)(this._calculateCachedStats, 100, { trailing: true });
    }
    filterInteractableAnnotationsForElement(element, annotations) {
        if (!annotations || !annotations.length) {
            return;
        }
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElement)(element);
        const { viewport } = enabledElement;
        let annotationsToDisplay;
        if (viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.VolumeViewport) {
            const camera = viewport.getCamera();
            const { spacingInNormalDirection } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.getTargetVolumeAndSpacingInNormalDir(viewport, camera);
            annotationsToDisplay = this.filterAnnotationsWithinSlice(annotations, camera, spacingInNormalDirection);
        }
        else {
            annotationsToDisplay = (0,_utilities_planar__WEBPACK_IMPORTED_MODULE_5__.filterAnnotationsForDisplay)(viewport, annotations);
        }
        return annotationsToDisplay;
    }
    filterAnnotationsWithinSlice(annotations, camera, spacingInNormalDirection) {
        const { viewPlaneNormal } = camera;
        const annotationsWithParallelNormals = annotations.filter((td) => {
            let annotationViewPlaneNormal = td.metadata.viewPlaneNormal;
            if (!td.metadata.referencedImageId &&
                !annotationViewPlaneNormal &&
                td.metadata.FrameOfReferenceUID) {
                for (const point of td.data.contour.polyline) {
                    const vector = gl_matrix__WEBPACK_IMPORTED_MODULE_2__/* .vec3.sub */ .eR.sub(gl_matrix__WEBPACK_IMPORTED_MODULE_2__/* .vec3.create */ .eR.create(), point, camera.focalPoint);
                    const dotProduct = gl_matrix__WEBPACK_IMPORTED_MODULE_2__/* .vec3.dot */ .eR.dot(vector, camera.viewPlaneNormal);
                    if (!_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.isEqual(dotProduct, 0)) {
                        return false;
                    }
                }
                td.metadata.viewPlaneNormal = camera.viewPlaneNormal;
                td.metadata.cameraFocalPoint = camera.focalPoint;
                return true;
            }
            if (!annotationViewPlaneNormal) {
                const { referencedImageId } = td.metadata;
                const { imageOrientationPatient } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.metaData.get('imagePlaneModule', referencedImageId);
                const rowCosineVec = gl_matrix__WEBPACK_IMPORTED_MODULE_2__/* .vec3.fromValues */ .eR.fromValues(imageOrientationPatient[0], imageOrientationPatient[1], imageOrientationPatient[2]);
                const colCosineVec = gl_matrix__WEBPACK_IMPORTED_MODULE_2__/* .vec3.fromValues */ .eR.fromValues(imageOrientationPatient[3], imageOrientationPatient[4], imageOrientationPatient[5]);
                annotationViewPlaneNormal = gl_matrix__WEBPACK_IMPORTED_MODULE_2__/* .vec3.create */ .eR.create();
                gl_matrix__WEBPACK_IMPORTED_MODULE_2__/* .vec3.cross */ .eR.cross(annotationViewPlaneNormal, rowCosineVec, colCosineVec);
                td.metadata.viewPlaneNormal = annotationViewPlaneNormal;
            }
            const isParallel = Math.abs(gl_matrix__WEBPACK_IMPORTED_MODULE_2__/* .vec3.dot */ .eR.dot(viewPlaneNormal, annotationViewPlaneNormal)) >
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
            const point = data.contour.polyline[0];
            if (!annotation.isVisible) {
                continue;
            }
            const dir = gl_matrix__WEBPACK_IMPORTED_MODULE_2__/* .vec3.create */ .eR.create();
            gl_matrix__WEBPACK_IMPORTED_MODULE_2__/* .vec3.sub */ .eR.sub(dir, focalPoint, point);
            const dot = gl_matrix__WEBPACK_IMPORTED_MODULE_2__/* .vec3.dot */ .eR.dot(dir, viewPlaneNormal);
            if (Math.abs(dot) < halfSpacingInNormalDirection) {
                annotationsWithinSlice.push(annotation);
            }
        }
        return annotationsWithinSlice;
    }
    isContourSegmentationTool() {
        return false;
    }
    createAnnotation(evt) {
        const worldPos = evt.detail.currentPoints.world;
        const contourAnnotation = super.createAnnotation(evt);
        const onInterpolationComplete = (annotation) => {
            annotation.data.handles.points.length = 0;
        };
        const annotation = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.deepMerge(contourAnnotation, {
            data: {
                contour: {
                    polyline: [[...worldPos]],
                },
                label: '',
                cachedStats: {},
            },
            onInterpolationComplete,
        });
        return annotation;
    }
    getAnnotationStyle(context) {
        return super.getAnnotationStyle(context);
    }
    renderAnnotationInstance(renderContext) {
        const { enabledElement, targetId, svgDrawingHelper } = renderContext;
        const annotation = renderContext.annotation;
        let renderStatus = false;
        const { viewport, renderingEngine } = enabledElement;
        const isDrawing = this.isDrawing;
        const isEditingOpen = this.isEditingOpen;
        const isEditingClosed = this.isEditingClosed;
        if (!(isDrawing || isEditingOpen || isEditingClosed)) {
            if (this.configuration.displayOnePointAsCrosshairs &&
                annotation.data.contour.polyline.length === 1) {
                this.renderPointContourWithMarker(enabledElement, svgDrawingHelper, annotation);
            }
            else {
                this.renderContour(enabledElement, svgDrawingHelper, annotation);
            }
        }
        else {
            const activeAnnotationUID = this.commonData.annotation.annotationUID;
            if (annotation.annotationUID === activeAnnotationUID) {
                if (isDrawing) {
                    this.renderContourBeingDrawn(enabledElement, svgDrawingHelper, annotation);
                }
                else if (isEditingClosed) {
                    this.renderClosedContourBeingEdited(enabledElement, svgDrawingHelper, annotation);
                }
                else if (isEditingOpen) {
                    this.renderOpenContourBeingEdited(enabledElement, svgDrawingHelper, annotation);
                }
                else {
                    throw new Error(`Unknown ${this.getToolName()} annotation rendering state`);
                }
            }
            else {
                if (this.configuration.displayOnePointAsCrosshairs &&
                    annotation.data.contour.polyline.length === 1) {
                    this.renderPointContourWithMarker(enabledElement, svgDrawingHelper, annotation);
                }
                else {
                    this.renderContour(enabledElement, svgDrawingHelper, annotation);
                }
            }
            renderStatus = true;
        }
        if (!this.configuration.calculateStats) {
            return;
        }
        this._calculateStatsIfActive(annotation, targetId, viewport, renderingEngine, enabledElement);
        this._renderStats(annotation, viewport, enabledElement, svgDrawingHelper);
        return renderStatus;
    }
    _calculateStatsIfActive(annotation, targetId, viewport, renderingEngine, enabledElement) {
        const activeAnnotationUID = this.commonData?.annotation.annotationUID;
        if (annotation.annotationUID === activeAnnotationUID &&
            !this.commonData?.movingTextBox) {
            return;
        }
        if (!this.commonData?.movingTextBox) {
            const { data } = annotation;
            if (!data.cachedStats[targetId]?.unit) {
                data.cachedStats[targetId] = {
                    Modality: null,
                    area: null,
                    max: null,
                    mean: null,
                    stdDev: null,
                    areaUnit: null,
                    unit: null,
                };
                this._calculateCachedStats(annotation, viewport, renderingEngine, enabledElement);
            }
            else if (annotation.invalidated) {
                this._throttledCalculateCachedStats(annotation, viewport, renderingEngine, enabledElement);
            }
        }
    }
    updateClosedCachedStats({ viewport, points, imageData, metadata, cachedStats, targetId, modalityUnit, canvasCoordinates, calibratedScale, deltaInX, deltaInY, }) {
        const { scale, areaUnit, unit } = calibratedScale;
        const { voxelManager } = viewport.getImageData();
        const worldPosIndex = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.transformWorldToIndex(imageData, points[0]);
        worldPosIndex[0] = Math.floor(worldPosIndex[0]);
        worldPosIndex[1] = Math.floor(worldPosIndex[1]);
        worldPosIndex[2] = Math.floor(worldPosIndex[2]);
        let iMin = worldPosIndex[0];
        let iMax = worldPosIndex[0];
        let jMin = worldPosIndex[1];
        let jMax = worldPosIndex[1];
        let kMin = worldPosIndex[2];
        let kMax = worldPosIndex[2];
        for (let j = 1; j < points.length; j++) {
            const worldPosIndex = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.transformWorldToIndex(imageData, points[j]);
            worldPosIndex[0] = Math.floor(worldPosIndex[0]);
            worldPosIndex[1] = Math.floor(worldPosIndex[1]);
            worldPosIndex[2] = Math.floor(worldPosIndex[2]);
            iMin = Math.min(iMin, worldPosIndex[0]);
            iMax = Math.max(iMax, worldPosIndex[0]);
            jMin = Math.min(jMin, worldPosIndex[1]);
            jMax = Math.max(jMax, worldPosIndex[1]);
            kMin = Math.min(kMin, worldPosIndex[2]);
            kMax = Math.max(kMax, worldPosIndex[2]);
        }
        const worldPosIndex2 = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.transformWorldToIndex(imageData, points[1]);
        worldPosIndex2[0] = Math.floor(worldPosIndex2[0]);
        worldPosIndex2[1] = Math.floor(worldPosIndex2[1]);
        worldPosIndex2[2] = Math.floor(worldPosIndex2[2]);
        let area = _utilities_math__WEBPACK_IMPORTED_MODULE_4__.polyline.getArea(canvasCoordinates) / scale / scale;
        area *= deltaInX * deltaInY;
        let perimeter = (0,_utilities_contours_calculatePerimeter__WEBPACK_IMPORTED_MODULE_21__/* ["default"] */ .A)(canvasCoordinates, closed) / scale;
        perimeter *= Math.sqrt(Math.pow(deltaInX, 2) + Math.pow(deltaInY, 2));
        const iDelta = 0.01 * (iMax - iMin);
        const jDelta = 0.01 * (jMax - jMin);
        const kDelta = 0.01 * (kMax - kMin);
        iMin = Math.floor(iMin - iDelta);
        iMax = Math.ceil(iMax + iDelta);
        jMin = Math.floor(jMin - jDelta);
        jMax = Math.ceil(jMax + jDelta);
        kMin = Math.floor(kMin - kDelta);
        kMax = Math.ceil(kMax + kDelta);
        const boundsIJK = [
            [iMin, iMax],
            [jMin, jMax],
            [kMin, kMax],
        ];
        const worldPosEnd = imageData.indexToWorld([iMax, jMax, kMax]);
        const canvasPosEnd = viewport.worldToCanvas(worldPosEnd);
        let curRow = 0;
        let intersections = [];
        let intersectionCounter = 0;
        let pointsInShape;
        if (voxelManager) {
            pointsInShape = voxelManager.forEach(this.configuration.statsCalculator.statsCallback, {
                imageData,
                isInObject: (pointLPS, _pointIJK) => {
                    let result = true;
                    const point = viewport.worldToCanvas(pointLPS);
                    if (point[1] != curRow) {
                        intersectionCounter = 0;
                        curRow = point[1];
                        intersections = (0,_utilities_math_polyline__WEBPACK_IMPORTED_MODULE_18__.getLineSegmentIntersectionsCoordinates)(canvasCoordinates, point, [canvasPosEnd[0], point[1]]);
                        intersections.sort((function (index) {
                            return function (a, b) {
                                return a[index] === b[index]
                                    ? 0
                                    : a[index] < b[index]
                                        ? -1
                                        : 1;
                            };
                        })(0));
                    }
                    if (intersections.length && point[0] > intersections[0][0]) {
                        intersections.shift();
                        intersectionCounter++;
                    }
                    if (intersectionCounter % 2 === 0) {
                        result = false;
                    }
                    return result;
                },
                boundsIJK,
                returnPoints: this.configuration.storePointData,
            });
        }
        const stats = this.configuration.statsCalculator.getStatistics();
        cachedStats[targetId] = {
            Modality: metadata.Modality,
            area,
            perimeter,
            mean: stats.mean?.value,
            max: stats.max?.value,
            min: stats.min?.value,
            stdDev: stats.stdDev?.value,
            statsArray: stats.array,
            pointsInShape: pointsInShape,
            areaUnit,
            modalityUnit,
            unit,
        };
    }
    updateOpenCachedStats({ targetId, metadata, canvasCoordinates, cachedStats, modalityUnit, calibratedScale, deltaInX, deltaInY, }) {
        const { scale, unit } = calibratedScale;
        let length = (0,_utilities_contours_calculatePerimeter__WEBPACK_IMPORTED_MODULE_21__/* ["default"] */ .A)(canvasCoordinates, closed) / scale;
        length *= Math.sqrt(Math.pow(deltaInX, 2) + Math.pow(deltaInY, 2));
        cachedStats[targetId] = {
            Modality: metadata.Modality,
            length,
            modalityUnit,
            unit,
        };
    }
}
function defaultGetTextLines(data, targetId) {
    const cachedVolumeStats = data.cachedStats[targetId];
    const { area, mean, stdDev, length, perimeter, max, min, isEmptyArea, unit, areaUnit, modalityUnit, } = cachedVolumeStats || {};
    const textLines = [];
    if (_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.isNumber(area)) {
        const areaLine = isEmptyArea
            ? `Area: Oblique not supported`
            : `Area: ${_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.roundNumber(area)} ${areaUnit}`;
        textLines.push(areaLine);
    }
    if (_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.isNumber(mean)) {
        textLines.push(`Mean: ${_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.roundNumber(mean)} ${modalityUnit}`);
    }
    if (_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.isNumber(max)) {
        textLines.push(`Max: ${_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.roundNumber(max)} ${modalityUnit}`);
    }
    if (_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.isNumber(min)) {
        textLines.push(`Min: ${_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.roundNumber(min)} ${modalityUnit}`);
    }
    if (_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.isNumber(stdDev)) {
        textLines.push(`Std Dev: ${_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.roundNumber(stdDev)} ${modalityUnit}`);
    }
    if (_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.isNumber(perimeter)) {
        textLines.push(`Perimeter: ${_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.roundNumber(perimeter)} ${unit}`);
    }
    if (_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.isNumber(length)) {
        textLines.push(`${_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.roundNumber(length)} ${unit}`);
    }
    return textLines;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PlanarFreehandROITool);


/***/ }),

/***/ 4010:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(85817);
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15327);
/* harmony import */ var _utilities_getCalibratedUnits__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4096);
/* harmony import */ var _utilities_throttle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(27730);
/* harmony import */ var _stateManagement__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6802);
/* harmony import */ var _stateManagement_annotation_annotationLocking__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2076);
/* harmony import */ var _stateManagement_annotation_annotationVisibility__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(29601);
/* harmony import */ var _stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(44049);
/* harmony import */ var _drawingSvg__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(74347);
/* harmony import */ var _store_state__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(85204);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(99737);
/* harmony import */ var _utilities_viewportFilters__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(60810);
/* harmony import */ var _utilities_math_rectangle__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(33657);
/* harmony import */ var _utilities_drawing__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(473);
/* harmony import */ var _utilities_planar_getWorldWidthAndHeightFromCorners__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(35489);
/* harmony import */ var _cursors_elementCursor__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(7001);
/* harmony import */ var _utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(58640);
/* harmony import */ var _utilities_getPixelValueUnits__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(40634);
/* harmony import */ var _utilities_viewport_isViewportPreScaled__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(18990);
/* harmony import */ var _utilities_math_basic__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(73262);
/* harmony import */ var _stateManagement_annotation_config_helpers__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(76712);





















const { transformWorldToIndex } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities;
class RectangleROITool extends _base__WEBPACK_IMPORTED_MODULE_0__/* .AnnotationTool */ .EC {
    static { this.toolName = 'RectangleROI'; }
    constructor(toolProps = {}, defaultToolProps = {
        supportedInteractionTypes: ['Mouse', 'Touch'],
        configuration: {
            storePointData: false,
            shadow: true,
            preventHandleOutsideImage: false,
            calculateStats: true,
            getTextLines: defaultGetTextLines,
            statsCalculator: _utilities_math_basic__WEBPACK_IMPORTED_MODULE_19__.BasicStatsCalculator,
        },
    }) {
        super(toolProps, defaultToolProps);
        this.addNewAnnotation = (evt) => {
            const eventDetail = evt.detail;
            const { currentPoints, element } = eventDetail;
            const worldPos = currentPoints.world;
            const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElement)(element);
            const { viewport } = enabledElement;
            this.isDrawing = true;
            const annotation = (this.constructor).createAnnotationForViewport(viewport, {
                data: {
                    handles: {
                        points: [
                            [...worldPos],
                            [...worldPos],
                            [...worldPos],
                            [...worldPos],
                        ],
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
                    cachedStats: {},
                },
            });
            (0,_stateManagement__WEBPACK_IMPORTED_MODULE_4__/* .addAnnotation */ .lC)(annotation, element);
            const viewportIdsToRender = (0,_utilities_viewportFilters__WEBPACK_IMPORTED_MODULE_11__.getViewportIdsWithToolToRender)(element, this.getToolName());
            this.editData = {
                annotation,
                viewportIdsToRender,
                handleIndex: 3,
                movingTextBox: false,
                newAnnotation: true,
                hasMoved: false,
            };
            this._activateDraw(element);
            (0,_cursors_elementCursor__WEBPACK_IMPORTED_MODULE_15__.hideElementCursor)(element);
            evt.preventDefault();
            (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_16__/* ["default"] */ .A)(viewportIdsToRender);
            return annotation;
        };
        this.isPointNearTool = (element, annotation, canvasCoords, proximity) => {
            const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElement)(element);
            const { viewport } = enabledElement;
            const { data } = annotation;
            const { points } = data.handles;
            const canvasPoint1 = viewport.worldToCanvas(points[0]);
            const canvasPoint2 = viewport.worldToCanvas(points[3]);
            const rect = this._getRectangleImageCoordinates([
                canvasPoint1,
                canvasPoint2,
            ]);
            const point = [canvasCoords[0], canvasCoords[1]];
            const { left, top, width, height } = rect;
            const distanceToPoint = _utilities_math_rectangle__WEBPACK_IMPORTED_MODULE_12__.distanceToPoint([left, top, width, height], point);
            if (distanceToPoint <= proximity) {
                return true;
            }
            return false;
        };
        this.toolSelectedCallback = (evt, annotation) => {
            const eventDetail = evt.detail;
            const { element } = eventDetail;
            annotation.highlighted = true;
            const viewportIdsToRender = (0,_utilities_viewportFilters__WEBPACK_IMPORTED_MODULE_11__.getViewportIdsWithToolToRender)(element, this.getToolName());
            this.editData = {
                annotation,
                viewportIdsToRender,
                movingTextBox: false,
            };
            this._activateModify(element);
            (0,_cursors_elementCursor__WEBPACK_IMPORTED_MODULE_15__.hideElementCursor)(element);
            const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElement)(element);
            const { renderingEngine } = enabledElement;
            (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_16__/* ["default"] */ .A)(viewportIdsToRender);
            evt.preventDefault();
        };
        this.handleSelectedCallback = (evt, annotation, handle) => {
            const eventDetail = evt.detail;
            const { element } = eventDetail;
            const { data } = annotation;
            annotation.highlighted = true;
            let movingTextBox = false;
            let handleIndex;
            if (handle.worldPosition) {
                movingTextBox = true;
            }
            else {
                handleIndex = data.handles.points.findIndex((p) => p === handle);
            }
            const viewportIdsToRender = (0,_utilities_viewportFilters__WEBPACK_IMPORTED_MODULE_11__.getViewportIdsWithToolToRender)(element, this.getToolName());
            this.editData = {
                annotation,
                viewportIdsToRender,
                handleIndex,
                movingTextBox,
            };
            this._activateModify(element);
            (0,_cursors_elementCursor__WEBPACK_IMPORTED_MODULE_15__.hideElementCursor)(element);
            const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElement)(element);
            const { renderingEngine } = enabledElement;
            (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_16__/* ["default"] */ .A)(viewportIdsToRender);
            evt.preventDefault();
        };
        this._endCallback = (evt) => {
            const eventDetail = evt.detail;
            const { element } = eventDetail;
            const { annotation, viewportIdsToRender, newAnnotation, hasMoved } = this.editData;
            const { data } = annotation;
            if (newAnnotation && !hasMoved) {
                return;
            }
            data.handles.activeHandleIndex = null;
            this._deactivateModify(element);
            this._deactivateDraw(element);
            (0,_cursors_elementCursor__WEBPACK_IMPORTED_MODULE_15__.resetElementCursor)(element);
            this.doneEditMemo();
            this.editData = null;
            this.isDrawing = false;
            if (this.isHandleOutsideImage &&
                this.configuration.preventHandleOutsideImage) {
                (0,_stateManagement__WEBPACK_IMPORTED_MODULE_4__/* .removeAnnotation */ .O8)(annotation.annotationUID);
            }
            (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_16__/* ["default"] */ .A)(viewportIdsToRender);
            if (newAnnotation) {
                (0,_stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_7__.triggerAnnotationCompleted)(annotation);
            }
        };
        this._dragCallback = (evt) => {
            this.isDrawing = true;
            const eventDetail = evt.detail;
            const { element } = eventDetail;
            const { annotation, viewportIdsToRender, handleIndex, movingTextBox, newAnnotation, } = this.editData;
            this.createMemo(element, annotation, { newAnnotation });
            const { data } = annotation;
            if (movingTextBox) {
                const { deltaPoints } = eventDetail;
                const worldPosDelta = deltaPoints.world;
                const { textBox } = data.handles;
                const { worldPosition } = textBox;
                worldPosition[0] += worldPosDelta[0];
                worldPosition[1] += worldPosDelta[1];
                worldPosition[2] += worldPosDelta[2];
                textBox.hasMoved = true;
            }
            else if (handleIndex === undefined) {
                const { deltaPoints } = eventDetail;
                const worldPosDelta = deltaPoints.world;
                const { points } = data.handles;
                points.forEach((point) => {
                    point[0] += worldPosDelta[0];
                    point[1] += worldPosDelta[1];
                    point[2] += worldPosDelta[2];
                });
                annotation.invalidated = true;
            }
            else {
                const { currentPoints } = eventDetail;
                const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElement)(element);
                const { worldToCanvas, canvasToWorld } = enabledElement.viewport;
                const worldPos = currentPoints.world;
                const { points } = data.handles;
                points[handleIndex] = [...worldPos];
                let bottomLeftCanvas;
                let bottomRightCanvas;
                let topLeftCanvas;
                let topRightCanvas;
                let bottomLeftWorld;
                let bottomRightWorld;
                let topLeftWorld;
                let topRightWorld;
                switch (handleIndex) {
                    case 0:
                    case 3:
                        bottomLeftCanvas = worldToCanvas(points[0]);
                        topRightCanvas = worldToCanvas(points[3]);
                        bottomRightCanvas = [topRightCanvas[0], bottomLeftCanvas[1]];
                        topLeftCanvas = [bottomLeftCanvas[0], topRightCanvas[1]];
                        bottomRightWorld = canvasToWorld(bottomRightCanvas);
                        topLeftWorld = canvasToWorld(topLeftCanvas);
                        points[1] = bottomRightWorld;
                        points[2] = topLeftWorld;
                        break;
                    case 1:
                    case 2:
                        bottomRightCanvas = worldToCanvas(points[1]);
                        topLeftCanvas = worldToCanvas(points[2]);
                        bottomLeftCanvas = [
                            topLeftCanvas[0],
                            bottomRightCanvas[1],
                        ];
                        topRightCanvas = [
                            bottomRightCanvas[0],
                            topLeftCanvas[1],
                        ];
                        bottomLeftWorld = canvasToWorld(bottomLeftCanvas);
                        topRightWorld = canvasToWorld(topRightCanvas);
                        points[0] = bottomLeftWorld;
                        points[3] = topRightWorld;
                        break;
                }
                annotation.invalidated = true;
            }
            this.editData.hasMoved = true;
            const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElement)(element);
            (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_16__/* ["default"] */ .A)(viewportIdsToRender);
            if (annotation.invalidated) {
                (0,_stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_7__.triggerAnnotationModified)(annotation, element, _enums__WEBPACK_IMPORTED_MODULE_10__.ChangeTypes.HandlesUpdated);
            }
        };
        this.cancel = (element) => {
            if (this.isDrawing) {
                this.isDrawing = false;
                this._deactivateDraw(element);
                this._deactivateModify(element);
                (0,_cursors_elementCursor__WEBPACK_IMPORTED_MODULE_15__.resetElementCursor)(element);
                const { annotation, viewportIdsToRender, newAnnotation } = this.editData;
                const { data } = annotation;
                annotation.highlighted = false;
                data.handles.activeHandleIndex = null;
                (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_16__/* ["default"] */ .A)(viewportIdsToRender);
                if (newAnnotation) {
                    (0,_stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_7__.triggerAnnotationCompleted)(annotation);
                }
                this.editData = null;
                return annotation.annotationUID;
            }
        };
        this._activateDraw = (element) => {
            _store_state__WEBPACK_IMPORTED_MODULE_9__/* .state */ .wk.isInteractingWithTool = true;
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.MOUSE_UP, this._endCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.MOUSE_DRAG, this._dragCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.MOUSE_MOVE, this._dragCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.MOUSE_CLICK, this._endCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.TOUCH_END, this._endCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.TOUCH_DRAG, this._dragCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.TOUCH_TAP, this._endCallback);
        };
        this._deactivateDraw = (element) => {
            _store_state__WEBPACK_IMPORTED_MODULE_9__/* .state */ .wk.isInteractingWithTool = false;
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.MOUSE_UP, this._endCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.MOUSE_DRAG, this._dragCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.MOUSE_MOVE, this._dragCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.MOUSE_CLICK, this._endCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.TOUCH_END, this._endCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.TOUCH_DRAG, this._dragCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.TOUCH_TAP, this._endCallback);
        };
        this._activateModify = (element) => {
            _store_state__WEBPACK_IMPORTED_MODULE_9__/* .state */ .wk.isInteractingWithTool = true;
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.MOUSE_UP, this._endCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.MOUSE_DRAG, this._dragCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.MOUSE_CLICK, this._endCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.TOUCH_END, this._endCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.TOUCH_DRAG, this._dragCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.TOUCH_TAP, this._endCallback);
        };
        this._deactivateModify = (element) => {
            _store_state__WEBPACK_IMPORTED_MODULE_9__/* .state */ .wk.isInteractingWithTool = false;
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.MOUSE_UP, this._endCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.MOUSE_DRAG, this._dragCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.MOUSE_CLICK, this._endCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.TOUCH_END, this._endCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.TOUCH_DRAG, this._dragCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_10__.Events.TOUCH_TAP, this._endCallback);
        };
        this.renderAnnotation = (enabledElement, svgDrawingHelper) => {
            let renderStatus = false;
            const { viewport } = enabledElement;
            const { element } = viewport;
            let annotations = (0,_stateManagement__WEBPACK_IMPORTED_MODULE_4__/* .getAnnotations */ .Rh)(this.getToolName(), element);
            if (!annotations?.length) {
                return renderStatus;
            }
            annotations = this.filterInteractableAnnotationsForElement(element, annotations);
            if (!annotations?.length) {
                return renderStatus;
            }
            const targetId = this.getTargetId(viewport);
            const renderingEngine = viewport.getRenderingEngine();
            const styleSpecifier = {
                toolGroupId: this.toolGroupId,
                toolName: this.getToolName(),
                viewportId: enabledElement.viewport.id,
            };
            for (let i = 0; i < annotations.length; i++) {
                const annotation = annotations[i];
                const { annotationUID, data } = annotation;
                const { points, activeHandleIndex } = data.handles;
                const canvasCoordinates = points.map((p) => viewport.worldToCanvas(p));
                styleSpecifier.annotationUID = annotationUID;
                const { color, lineWidth, lineDash } = this.getAnnotationStyle({
                    annotation,
                    styleSpecifier,
                });
                const { viewPlaneNormal, viewUp } = viewport.getCamera();
                if (!data.cachedStats[targetId] ||
                    data.cachedStats[targetId].areaUnit == null) {
                    data.cachedStats[targetId] = {
                        Modality: null,
                        area: null,
                        max: null,
                        mean: null,
                        stdDev: null,
                        areaUnit: null,
                    };
                    this._calculateCachedStats(annotation, viewPlaneNormal, viewUp, renderingEngine, enabledElement);
                }
                else if (annotation.invalidated) {
                    this._throttledCalculateCachedStats(annotation, viewPlaneNormal, viewUp, renderingEngine, enabledElement);
                    if (viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.VolumeViewport) {
                        const { referencedImageId } = annotation.metadata;
                        for (const targetId in data.cachedStats) {
                            if (targetId.startsWith('imageId')) {
                                const viewports = renderingEngine.getStackViewports();
                                const invalidatedStack = viewports.find((vp) => {
                                    const referencedImageURI = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.imageIdToURI(referencedImageId);
                                    const hasImageURI = vp.hasImageURI(referencedImageURI);
                                    const currentImageURI = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.imageIdToURI(vp.getCurrentImageId());
                                    return hasImageURI && currentImageURI !== referencedImageURI;
                                });
                                if (invalidatedStack) {
                                    delete data.cachedStats[targetId];
                                }
                            }
                        }
                    }
                }
                if (!viewport.getRenderingEngine()) {
                    console.warn('Rendering Engine has been destroyed');
                    return renderStatus;
                }
                let activeHandleCanvasCoords;
                if (!(0,_stateManagement_annotation_annotationVisibility__WEBPACK_IMPORTED_MODULE_6__.isAnnotationVisible)(annotationUID)) {
                    continue;
                }
                if (!(0,_stateManagement_annotation_annotationLocking__WEBPACK_IMPORTED_MODULE_5__.isAnnotationLocked)(annotationUID) &&
                    !this.editData &&
                    activeHandleIndex !== null &&
                    activeHandleIndex !== undefined) {
                    activeHandleCanvasCoords = [canvasCoordinates[activeHandleIndex]];
                }
                const showHandlesAlways = Boolean((0,_stateManagement_annotation_config_helpers__WEBPACK_IMPORTED_MODULE_20__/* .getStyleProperty */ .h)('showHandlesAlways', {}));
                if (activeHandleCanvasCoords || showHandlesAlways) {
                    const handleGroupUID = '0';
                    (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_8__.drawHandles)(svgDrawingHelper, annotationUID, handleGroupUID, showHandlesAlways ? canvasCoordinates : activeHandleCanvasCoords, {
                        color,
                    });
                }
                const dataId = `${annotationUID}-rect`;
                const rectangleUID = '0';
                (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_8__.drawRectByCoordinates)(svgDrawingHelper, annotationUID, rectangleUID, canvasCoordinates, {
                    color,
                    lineDash,
                    lineWidth,
                }, dataId);
                renderStatus = true;
                const options = this.getLinkedTextBoxStyle(styleSpecifier, annotation);
                if (!options.visibility) {
                    data.handles.textBox = {
                        hasMoved: false,
                        worldPosition: [0, 0, 0],
                        worldBoundingBox: {
                            topLeft: [0, 0, 0],
                            topRight: [0, 0, 0],
                            bottomLeft: [0, 0, 0],
                            bottomRight: [0, 0, 0],
                        },
                    };
                    continue;
                }
                const textLines = this.configuration.getTextLines(data, targetId);
                if (!textLines || textLines.length === 0) {
                    continue;
                }
                if (!data.handles.textBox.hasMoved) {
                    const canvasTextBoxCoords = (0,_utilities_drawing__WEBPACK_IMPORTED_MODULE_13__.getTextBoxCoordsCanvas)(canvasCoordinates);
                    data.handles.textBox.worldPosition =
                        viewport.canvasToWorld(canvasTextBoxCoords);
                }
                const textBoxPosition = viewport.worldToCanvas(data.handles.textBox.worldPosition);
                const textBoxUID = '1';
                const boundingBox = (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_8__.drawLinkedTextBox)(svgDrawingHelper, annotationUID, textBoxUID, textLines, textBoxPosition, canvasCoordinates, {}, options);
                const { x: left, y: top, width, height } = boundingBox;
                data.handles.textBox.worldBoundingBox = {
                    topLeft: viewport.canvasToWorld([left, top]),
                    topRight: viewport.canvasToWorld([left + width, top]),
                    bottomLeft: viewport.canvasToWorld([left, top + height]),
                    bottomRight: viewport.canvasToWorld([left + width, top + height]),
                };
            }
            return renderStatus;
        };
        this._getRectangleImageCoordinates = (points) => {
            const [point0, point1] = points;
            return {
                left: Math.min(point0[0], point1[0]),
                top: Math.min(point0[1], point1[1]),
                width: Math.abs(point0[0] - point1[0]),
                height: Math.abs(point0[1] - point1[1]),
            };
        };
        this._calculateCachedStats = (annotation, viewPlaneNormal, viewUp, renderingEngine, enabledElement) => {
            if (!this.configuration.calculateStats) {
                return;
            }
            const { data } = annotation;
            const { viewport } = enabledElement;
            const { element } = viewport;
            const worldPos1 = data.handles.points[0];
            const worldPos2 = data.handles.points[3];
            const { cachedStats } = data;
            const targetIds = Object.keys(cachedStats);
            for (let i = 0; i < targetIds.length; i++) {
                const targetId = targetIds[i];
                const image = this.getTargetImageData(targetId);
                if (!image) {
                    continue;
                }
                const { dimensions, imageData, metadata, voxelManager } = image;
                const pos1Index = transformWorldToIndex(imageData, worldPos1);
                pos1Index[0] = Math.floor(pos1Index[0]);
                pos1Index[1] = Math.floor(pos1Index[1]);
                pos1Index[2] = Math.floor(pos1Index[2]);
                const pos2Index = transformWorldToIndex(imageData, worldPos2);
                pos2Index[0] = Math.floor(pos2Index[0]);
                pos2Index[1] = Math.floor(pos2Index[1]);
                pos2Index[2] = Math.floor(pos2Index[2]);
                if (this._isInsideVolume(pos1Index, pos2Index, dimensions)) {
                    this.isHandleOutsideImage = false;
                    const iMin = Math.min(pos1Index[0], pos2Index[0]);
                    const iMax = Math.max(pos1Index[0], pos2Index[0]);
                    const jMin = Math.min(pos1Index[1], pos2Index[1]);
                    const jMax = Math.max(pos1Index[1], pos2Index[1]);
                    const kMin = Math.min(pos1Index[2], pos2Index[2]);
                    const kMax = Math.max(pos1Index[2], pos2Index[2]);
                    const boundsIJK = [
                        [iMin, iMax],
                        [jMin, jMax],
                        [kMin, kMax],
                    ];
                    const { worldWidth, worldHeight } = (0,_utilities_planar_getWorldWidthAndHeightFromCorners__WEBPACK_IMPORTED_MODULE_14__/* ["default"] */ .A)(viewPlaneNormal, viewUp, worldPos1, worldPos2);
                    const handles = [pos1Index, pos2Index];
                    const { scale, areaUnit } = (0,_utilities_getCalibratedUnits__WEBPACK_IMPORTED_MODULE_2__/* .getCalibratedLengthUnitsAndScale */ .Op)(image, handles);
                    const area = Math.abs(worldWidth * worldHeight) / (scale * scale);
                    const pixelUnitsOptions = {
                        isPreScaled: (0,_utilities_viewport_isViewportPreScaled__WEBPACK_IMPORTED_MODULE_18__/* .isViewportPreScaled */ .u)(viewport, targetId),
                        isSuvScaled: this.isSuvScaled(viewport, targetId, annotation.metadata.referencedImageId),
                    };
                    const modalityUnit = (0,_utilities_getPixelValueUnits__WEBPACK_IMPORTED_MODULE_17__/* .getPixelValueUnits */ .j)(metadata.Modality, annotation.metadata.referencedImageId, pixelUnitsOptions);
                    let pointsInShape;
                    if (voxelManager) {
                        pointsInShape = voxelManager.forEach(this.configuration.statsCalculator.statsCallback, {
                            boundsIJK,
                            imageData,
                            returnPoints: this.configuration.storePointData,
                        });
                    }
                    const stats = this.configuration.statsCalculator.getStatistics();
                    cachedStats[targetId] = {
                        Modality: metadata.Modality,
                        area,
                        mean: stats.mean?.value,
                        stdDev: stats.stdDev?.value,
                        max: stats.max?.value,
                        min: stats.min?.value,
                        statsArray: stats.array,
                        pointsInShape: pointsInShape,
                        areaUnit,
                        modalityUnit,
                    };
                }
                else {
                    this.isHandleOutsideImage = true;
                    cachedStats[targetId] = {
                        Modality: metadata.Modality,
                    };
                }
            }
            const invalidated = annotation.invalidated;
            annotation.invalidated = false;
            if (invalidated) {
                (0,_stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_7__.triggerAnnotationModified)(annotation, element, _enums__WEBPACK_IMPORTED_MODULE_10__.ChangeTypes.StatsUpdated);
            }
            return cachedStats;
        };
        this._isInsideVolume = (index1, index2, dimensions) => {
            return (_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.indexWithinDimensions(index1, dimensions) &&
                _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.indexWithinDimensions(index2, dimensions));
        };
        this._throttledCalculateCachedStats = (0,_utilities_throttle__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)(this._calculateCachedStats, 100, { trailing: true });
    }
    static { this.hydrate = (viewportId, points, options) => {
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElementByViewportId)(viewportId);
        if (!enabledElement) {
            return;
        }
        const { FrameOfReferenceUID, referencedImageId, viewPlaneNormal, instance, viewport, } = this.hydrateBase(RectangleROITool, enabledElement, points, options);
        const { toolInstance, ...serializableOptions } = options || {};
        const annotation = {
            annotationUID: options?.annotationUID || _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.uuidv4(),
            data: {
                handles: {
                    points,
                    activeHandleIndex: null,
                },
                label: '',
                cachedStats: {},
            },
            highlighted: false,
            autoGenerated: false,
            invalidated: false,
            isLocked: false,
            isVisible: true,
            metadata: {
                toolName: instance.getToolName(),
                viewPlaneNormal,
                FrameOfReferenceUID,
                referencedImageId,
                ...serializableOptions,
            },
        };
        (0,_stateManagement__WEBPACK_IMPORTED_MODULE_4__/* .addAnnotation */ .lC)(annotation, viewport.element);
        (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_16__/* ["default"] */ .A)([viewport.id]);
    }; }
}
function defaultGetTextLines(data, targetId) {
    const cachedVolumeStats = data.cachedStats[targetId];
    const { area, mean, max, stdDev, areaUnit, modalityUnit, min } = cachedVolumeStats;
    if (mean === undefined || mean === null) {
        return;
    }
    const textLines = [];
    if (_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.isNumber(area)) {
        textLines.push(`Area: ${_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.roundNumber(area)} ${areaUnit}`);
    }
    if (_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.isNumber(mean)) {
        textLines.push(`Mean: ${_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.roundNumber(mean)} ${modalityUnit}`);
    }
    if (_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.isNumber(max)) {
        textLines.push(`Max: ${_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.roundNumber(max)} ${modalityUnit}`);
    }
    if (_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.isNumber(min)) {
        textLines.push(`Min: ${_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.roundNumber(min)} ${modalityUnit}`);
    }
    if (_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.isNumber(stdDev)) {
        textLines.push(`Std Dev: ${_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.roundNumber(stdDev)} ${modalityUnit}`);
    }
    return textLines;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RectangleROITool);


/***/ }),

/***/ 23631:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ LabelmapBaseTool)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(85817);
/* harmony import */ var _enums_SegmentationRepresentations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(18682);
/* harmony import */ var _stateManagement_segmentation_getActiveSegmentation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(67165);
/* harmony import */ var _stateManagement_segmentation_segmentLocking__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(26795);
/* harmony import */ var _stateManagement_segmentation_getSegmentation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(33283);
/* harmony import */ var _stateManagement_segmentation_getCurrentLabelmapImageIdForViewport__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(97577);
/* harmony import */ var _stateManagement_segmentation_config_segmentationColor__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(93733);
/* harmony import */ var _stateManagement_segmentation_getActiveSegmentIndex__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(60740);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(99737);
/* harmony import */ var _utilities_segmentation_createLabelmapMemo__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(2397);
/* harmony import */ var _stateManagement_annotation_annotationState__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(82056);
/* harmony import */ var _utilities_planar__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(13165);
/* harmony import */ var _utilities_math_polyline__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(92984);
/* harmony import */ var _stateManagement_segmentation_triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(49906);
/* harmony import */ var _strategies__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(99522);
















class LabelmapBaseTool extends _base__WEBPACK_IMPORTED_MODULE_1__/* .BaseTool */ .oS {
    static { this.previewData = {
        preview: null,
        element: null,
        timerStart: 0,
        timer: null,
        startPoint: [NaN, NaN],
        isDrag: false,
    }; }
    constructor(toolProps, defaultToolProps) {
        super(toolProps, defaultToolProps);
        this.memoMap = new Map();
        this.acceptedMemoIds = new Map();
        this.centerSegmentIndexInfo = {
            segmentIndex: null,
            hasSegmentIndex: false,
            hasPreviewIndex: false,
            changedIndices: [],
        };
    }
    _historyRedoHandler(evt) {
        const { id, operationType } = evt.detail;
        if (operationType !== 'labelmap') {
            return;
        }
        if (this.acceptedMemoIds.has(id)) {
            this._hoverData = null;
            const memoData = this.acceptedMemoIds.get(id);
            const element = memoData?.element;
            const operationData = this.getOperationData(element);
            operationData.segmentIndex = memoData?.segmentIndex;
            if (element) {
                this.applyActiveStrategyCallback((0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element), operationData, _enums__WEBPACK_IMPORTED_MODULE_9__.StrategyCallbacks.AcceptPreview);
            }
        }
        this._previewData.isDrag = true;
    }
    get _previewData() {
        return LabelmapBaseTool.previewData;
    }
    hasPreviewData() {
        return !!this._previewData.preview;
    }
    shouldResolvePreviewRequests() {
        return ((this.mode === 'Active' || this.mode === 'Enabled') &&
            this.hasPreviewData());
    }
    createMemo(segmentationId, segmentationVoxelManager) {
        const voxelManagerId = segmentationVoxelManager.id;
        if (this.memo &&
            this.memo.segmentationVoxelManager === segmentationVoxelManager) {
            return this.memo;
        }
        let memo = this.memoMap.get(voxelManagerId);
        if (!memo) {
            memo = _utilities_segmentation_createLabelmapMemo__WEBPACK_IMPORTED_MODULE_10__.createLabelmapMemo(segmentationId, segmentationVoxelManager);
            this.memoMap.set(voxelManagerId, memo);
        }
        else {
            if (memo.redoVoxelManager) {
                memo = _utilities_segmentation_createLabelmapMemo__WEBPACK_IMPORTED_MODULE_10__.createLabelmapMemo(segmentationId, segmentationVoxelManager);
                this.memoMap.set(voxelManagerId, memo);
            }
        }
        this.memo = memo;
        return memo;
    }
    createEditData(element) {
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
        const { viewport } = enabledElement;
        const activeSegmentation = (0,_stateManagement_segmentation_getActiveSegmentation__WEBPACK_IMPORTED_MODULE_3__/* .getActiveSegmentation */ .T)(viewport.id);
        if (!activeSegmentation) {
            const event = new CustomEvent(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.Enums.Events.ERROR_EVENT, {
                detail: {
                    type: 'Segmentation',
                    message: 'No active segmentation detected, create a segmentation representation before using the brush tool',
                },
                cancelable: true,
            });
            _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.eventTarget.dispatchEvent(event);
            return null;
        }
        const { segmentationId } = activeSegmentation;
        const segmentsLocked = (0,_stateManagement_segmentation_segmentLocking__WEBPACK_IMPORTED_MODULE_4__.getLockedSegmentIndices)(segmentationId);
        const { representationData } = (0,_stateManagement_segmentation_getSegmentation__WEBPACK_IMPORTED_MODULE_5__/* .getSegmentation */ .T)(segmentationId);
        const editData = this.getEditData({
            viewport,
            representationData,
            segmentsLocked,
            segmentationId,
        });
        return editData;
    }
    getEditData({ viewport, representationData, segmentsLocked, segmentationId, }) {
        if (viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.BaseVolumeViewport) {
            const { volumeId } = representationData[_enums_SegmentationRepresentations__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.Labelmap];
            const actors = viewport.getActors();
            const isStackViewport = viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.StackViewport;
            if (isStackViewport) {
                const event = new CustomEvent(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.Enums.Events.ERROR_EVENT, {
                    detail: {
                        type: 'Segmentation',
                        message: 'Cannot perform brush operation on the selected viewport',
                    },
                    cancelable: true,
                });
                _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.eventTarget.dispatchEvent(event);
                return null;
            }
            const volumes = actors.map((actorEntry) => _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.cache.getVolume(actorEntry.referencedId));
            const segmentationVolume = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.cache.getVolume(volumeId);
            const referencedVolumeIdToThreshold = volumes.find((volume) => _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.isEqual(volume.dimensions, segmentationVolume.dimensions))?.volumeId || volumes[0]?.volumeId;
            return {
                volumeId,
                referencedVolumeId: this.configuration.threshold?.volumeId ??
                    referencedVolumeIdToThreshold,
                segmentsLocked,
            };
        }
        else {
            const segmentationImageId = (0,_stateManagement_segmentation_getCurrentLabelmapImageIdForViewport__WEBPACK_IMPORTED_MODULE_6__/* .getCurrentLabelmapImageIdForViewport */ .vl)(viewport.id, segmentationId);
            if (!segmentationImageId) {
                return;
            }
            return {
                imageId: segmentationImageId,
                segmentsLocked,
            };
        }
    }
    createHoverData(element, centerCanvas) {
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
        const { viewport } = enabledElement;
        const camera = viewport.getCamera();
        const { viewPlaneNormal, viewUp } = camera;
        const viewportIdsToRender = [viewport.id];
        const { segmentIndex, segmentationId, segmentColor } = this.getActiveSegmentationData(viewport) || {};
        const brushCursor = {
            metadata: {
                viewPlaneNormal: [...viewPlaneNormal],
                viewUp: [...viewUp],
                FrameOfReferenceUID: viewport.getFrameOfReferenceUID(),
                referencedImageId: '',
                toolName: this.getToolName(),
                segmentColor,
            },
            data: {},
        };
        return {
            brushCursor,
            centerCanvas,
            segmentIndex,
            viewport,
            segmentationId,
            segmentColor,
            viewportIdsToRender,
        };
    }
    getActiveSegmentationData(viewport) {
        const viewportId = viewport.id;
        const activeRepresentation = (0,_stateManagement_segmentation_getActiveSegmentation__WEBPACK_IMPORTED_MODULE_3__/* .getActiveSegmentation */ .T)(viewportId);
        if (!activeRepresentation) {
            return;
        }
        const { segmentationId } = activeRepresentation;
        const segmentIndex = (0,_stateManagement_segmentation_getActiveSegmentIndex__WEBPACK_IMPORTED_MODULE_8__/* .getActiveSegmentIndex */ .Q)(segmentationId);
        if (!segmentIndex) {
            return;
        }
        const segmentColor = (0,_stateManagement_segmentation_config_segmentationColor__WEBPACK_IMPORTED_MODULE_7__.getSegmentIndexColor)(viewportId, segmentationId, segmentIndex);
        return {
            segmentIndex,
            segmentationId,
            segmentColor,
        };
    }
    getOperationData(element) {
        const editData = this._editData || this.createEditData(element);
        const { segmentIndex, segmentationId, brushCursor } = this._hoverData || this.createHoverData(element);
        const { data, metadata = {} } = brushCursor || {};
        const { viewPlaneNormal, viewUp } = metadata;
        const configColor = this.configuration.preview?.previewColors?.[segmentIndex];
        const { viewport } = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
        const segmentColor = (0,_stateManagement_segmentation_config_segmentationColor__WEBPACK_IMPORTED_MODULE_7__.getSegmentIndexColor)(viewport.id, segmentationId, segmentIndex);
        if (!configColor && !segmentColor) {
            return;
        }
        let previewColor = null, previewSegmentIndex = null;
        if (this.configuration.preview?.enabled) {
            previewColor = configColor || lightenColor(...segmentColor);
            previewSegmentIndex = 255;
        }
        const operationData = {
            ...editData,
            points: data?.handles?.points,
            segmentIndex,
            viewPlaneNormal,
            previewOnHover: !this._previewData.isDrag,
            toolGroupId: this.toolGroupId,
            segmentationId,
            viewUp,
            centerSegmentIndexInfo: this.centerSegmentIndexInfo,
            activeStrategy: this.configuration.activeStrategy,
            configuration: this.configuration,
            previewColor,
            previewSegmentIndex,
            createMemo: this.createMemo.bind(this),
        };
        return operationData;
    }
    addPreview(element = this._previewData.element, options) {
        const { _previewData } = this;
        const acceptReject = options?.acceptReject;
        if (acceptReject === true) {
            this.acceptPreview(element);
        }
        else if (acceptReject === false) {
            this.rejectPreview(element);
        }
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
        const results = this.applyActiveStrategyCallback(enabledElement, this.getOperationData(element), _enums__WEBPACK_IMPORTED_MODULE_9__.StrategyCallbacks.AddPreview);
        _previewData.isDrag = true;
        if (results?.modified) {
            _previewData.preview = results;
            _previewData.element = element;
        }
        return results;
    }
    rejectPreview(element = this._previewData.element) {
        if (!element) {
            return;
        }
        this.doneEditMemo();
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
        this.applyActiveStrategyCallback(enabledElement, this.getOperationData(element), _enums__WEBPACK_IMPORTED_MODULE_9__.StrategyCallbacks.RejectPreview);
        this._previewData.preview = null;
        this._previewData.isDrag = false;
    }
    acceptPreview(element = this._previewData.element) {
        if (!element) {
            return;
        }
        const operationData = this.getOperationData(element);
        if (this.memo && this.memo.id) {
            this.acceptedMemoIds.set(this.memo.id, {
                element,
                segmentIndex: operationData.segmentIndex,
            });
        }
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
        this.applyActiveStrategyCallback(enabledElement, operationData, _enums__WEBPACK_IMPORTED_MODULE_9__.StrategyCallbacks.AcceptPreview);
        this.doneEditMemo();
        this._previewData.preview = null;
        this._previewData.isDrag = false;
    }
    static viewportContoursToLabelmap(viewport, options) {
        const removeContours = options?.removeContours ?? true;
        const annotations = (0,_stateManagement_annotation_annotationState__WEBPACK_IMPORTED_MODULE_11__.getAllAnnotations)();
        const viewAnnotations = (0,_utilities_planar__WEBPACK_IMPORTED_MODULE_12__.filterAnnotationsForDisplay)(viewport, annotations);
        if (!viewAnnotations?.length) {
            return;
        }
        const contourAnnotations = viewAnnotations.filter((annotation) => annotation.data.contour?.polyline?.length);
        if (!contourAnnotations.length) {
            return;
        }
        const brushInstance = new LabelmapBaseTool({}, {
            configuration: {
                strategies: {
                    FILL_INSIDE_CIRCLE: _strategies__WEBPACK_IMPORTED_MODULE_15__.fillInsideCircle,
                },
                activeStrategy: 'FILL_INSIDE_CIRCLE',
            },
        });
        const preview = brushInstance.addPreview(viewport.element);
        const { memo, segmentationId } = preview;
        const previewVoxels = memo?.voxelManager;
        const segmentationVoxels = previewVoxels.sourceVoxelManager || previewVoxels;
        const { dimensions } = previewVoxels;
        const imageData = viewport
            .getDefaultActor()
            .actor.getMapper()
            .getInputData();
        for (const annotation of contourAnnotations) {
            const boundsIJK = [
                [Infinity, -Infinity],
                [Infinity, -Infinity],
                [Infinity, -Infinity],
            ];
            const { polyline } = annotation.data.contour;
            for (const point of polyline) {
                const indexPoint = imageData.worldToIndex(point);
                indexPoint.forEach((v, idx) => {
                    boundsIJK[idx][0] = Math.min(boundsIJK[idx][0], v);
                    boundsIJK[idx][1] = Math.max(boundsIJK[idx][1], v);
                });
            }
            boundsIJK.forEach((bound, idx) => {
                bound[0] = Math.round(Math.max(0, bound[0]));
                bound[1] = Math.round(Math.min(dimensions[idx] - 1, bound[1]));
            });
            const activeIndex = (0,_stateManagement_segmentation_getActiveSegmentIndex__WEBPACK_IMPORTED_MODULE_8__/* .getActiveSegmentIndex */ .Q)(segmentationId);
            const startPoint = annotation.data.handles?.[0] || polyline[0];
            const startIndex = imageData.worldToIndex(startPoint).map(Math.round);
            const startValue = segmentationVoxels.getAtIJKPoint(startIndex) || 0;
            let hasZeroIndex = false;
            let hasPositiveIndex = false;
            for (const polyPoint of polyline) {
                const polyIndex = imageData.worldToIndex(polyPoint).map(Math.round);
                const polyValue = segmentationVoxels.getAtIJKPoint(polyIndex);
                if (polyValue === startValue) {
                    hasZeroIndex = true;
                }
                else if (polyValue >= 0) {
                    hasPositiveIndex = true;
                }
            }
            const hasBoth = hasZeroIndex && hasPositiveIndex;
            const segmentIndex = hasBoth
                ? startValue
                : startValue === 0
                    ? activeIndex
                    : 0;
            for (let i = boundsIJK[0][0]; i <= boundsIJK[0][1]; i++) {
                for (let j = boundsIJK[1][0]; j <= boundsIJK[1][1]; j++) {
                    for (let k = boundsIJK[2][0]; k <= boundsIJK[2][1]; k++) {
                        const worldPoint = imageData.indexToWorld([i, j, k]);
                        const isContained = (0,_utilities_math_polyline__WEBPACK_IMPORTED_MODULE_13__.isPointInsidePolyline3D)(worldPoint, polyline);
                        if (isContained) {
                            previewVoxels.setAtIJK(i, j, k, segmentIndex);
                        }
                    }
                }
            }
            if (removeContours) {
                (0,_stateManagement_annotation_annotationState__WEBPACK_IMPORTED_MODULE_11__.removeAnnotation)(annotation.annotationUID);
            }
        }
        const slices = previewVoxels.getArrayOfModifiedSlices();
        (0,_stateManagement_segmentation_triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_14__.triggerSegmentationDataModified)(segmentationId, slices);
    }
}
function lightenColor(r, g, b, a, factor = 0.4) {
    return [
        Math.round(r + (255 - r) * factor),
        Math.round(g + (255 - g) * factor),
        Math.round(b + (255 - b) * factor),
        a,
    ];
}


/***/ }),

/***/ 52905:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _isObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(45217);

function debounce(func, wait, options) {
    let lastArgs, lastThis, maxWait, result, timerId, lastCallTime;
    let lastInvokeTime = 0;
    let leading = false;
    let maxing = false;
    let trailing = true;
    const useRAF = !wait && wait !== 0 && typeof window.requestAnimationFrame === 'function';
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function');
    }
    wait = Number(wait) || 0;
    if ((0,_isObject__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(options)) {
        leading = Boolean(options.leading);
        maxing = 'maxWait' in options;
        maxWait = maxing ? Math.max(Number(options.maxWait) || 0, wait) : maxWait;
        trailing = 'trailing' in options ? Boolean(options.trailing) : trailing;
    }
    function invokeFunc(time) {
        const args = lastArgs;
        const thisArg = lastThis;
        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
    }
    function startTimer(pendingFunc, wait) {
        if (useRAF) {
            return window.requestAnimationFrame(pendingFunc);
        }
        return setTimeout(pendingFunc, wait);
    }
    function cancelTimer(id) {
        if (useRAF) {
            return window.cancelAnimationFrame(id);
        }
        clearTimeout(id);
    }
    function leadingEdge(time) {
        lastInvokeTime = time;
        timerId = startTimer(timerExpired, wait);
        return leading ? invokeFunc(time) : result;
    }
    function remainingWait(time) {
        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;
        const timeWaiting = wait - timeSinceLastCall;
        return maxing
            ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
            : timeWaiting;
    }
    function shouldInvoke(time) {
        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;
        return (lastCallTime === undefined ||
            timeSinceLastCall >= wait ||
            timeSinceLastCall < 0 ||
            (maxing && timeSinceLastInvoke >= maxWait));
    }
    function timerExpired() {
        const time = Date.now();
        if (shouldInvoke(time)) {
            return trailingEdge(time);
        }
        timerId = startTimer(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
        timerId = undefined;
        if (trailing && lastArgs) {
            return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
    }
    function cancel() {
        if (timerId !== undefined) {
            cancelTimer(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
    }
    function flush() {
        return timerId === undefined ? result : trailingEdge(Date.now());
    }
    function pending() {
        return timerId !== undefined;
    }
    function debounced(...args) {
        const time = Date.now();
        const isInvoking = shouldInvoke(time);
        lastArgs = args;
        lastThis = this;
        lastCallTime = time;
        if (isInvoking) {
            if (timerId === undefined) {
                return leadingEdge(lastCallTime);
            }
            if (maxing) {
                timerId = startTimer(timerExpired, wait);
                return invokeFunc(lastCallTime);
            }
        }
        if (timerId === undefined) {
            timerId = startTimer(timerExpired, wait);
        }
        return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    debounced.pending = pending;
    return debounced;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (debounce);


/***/ }),

/***/ 1239:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getTextBoxCoordsCanvas)
/* harmony export */ });
function getTextBoxCoordsCanvas(annotationCanvasPoints) {
    const corners = _determineCorners(annotationCanvasPoints);
    const centerY = (corners.top[1] + corners.bottom[1]) / 2;
    const textBoxCanvas = [corners.right[0], centerY];
    return textBoxCanvas;
}
function _determineCorners(canvasPoints) {
    const handlesLeftToRight = [canvasPoints[0], canvasPoints[1]].sort(_compareX);
    const handlesTopToBottom = [canvasPoints[0], canvasPoints[1]].sort(_compareY);
    const right = handlesLeftToRight[handlesLeftToRight.length - 1];
    const top = handlesTopToBottom[0];
    const bottom = handlesTopToBottom[handlesTopToBottom.length - 1];
    return {
        top,
        bottom,
        right,
    };
    function _compareX(a, b) {
        return a[0] < b[0] ? -1 : 1;
    }
    function _compareY(a, b) {
        return a[1] < b[1] ? -1 : 1;
    }
}


/***/ }),

/***/ 40133:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getViewportForAnnotation)
/* harmony export */ });
/* harmony import */ var _getViewportsForAnnotation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15295);

function getViewportForAnnotation(annotation) {
    const viewports = (0,_getViewportsForAnnotation__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(annotation);
    if (!viewports?.length) {
        return undefined;
    }
    const viewport = viewports.find((viewport) => viewport
        .getImageIds()
        .some((imageId) => imageId === annotation.metadata.referencedImageId));
    return viewport ?? viewports[0];
}


/***/ }),

/***/ 45217:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function isObject(value) {
    const type = typeof value;
    return value !== null && (type === 'object' || type === 'function');
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isObject);


/***/ }),

/***/ 62783:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  d: () => (/* reexport */ pointInSphere)
});

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/sphere/pointInSphere.js
function pointInSphere(sphere, pointLPS) {
    const { center, radius } = sphere;
    const radius2 = sphere.radius2 || radius * radius;
    return ((pointLPS[0] - center[0]) * (pointLPS[0] - center[0]) +
        (pointLPS[1] - center[1]) * (pointLPS[1] - center[1]) +
        (pointLPS[2] - center[2]) * (pointLPS[2] - center[2]) <=
        radius2);
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/sphere/index.js




/***/ }),

/***/ 27730:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(52905);
/* harmony import */ var _isObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(45217);


function throttle(func, wait, options) {
    let leading = true;
    let trailing = true;
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function');
    }
    if ((0,_isObject__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(options)) {
        leading = 'leading' in options ? Boolean(options.leading) : leading;
        trailing = 'trailing' in options ? Boolean(options.trailing) : trailing;
    }
    return (0,_debounce__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(func, wait, {
        leading,
        trailing,
        maxWait: wait,
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (throttle);


/***/ }),

/***/ 18990:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   u: () => (/* binding */ isViewportPreScaled)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);

function isViewportPreScaled(viewport, targetId) {
    if (viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.BaseVolumeViewport) {
        const volumeId = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.getVolumeId(targetId);
        const volume = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.cache.getVolume(volumeId);
        return !!volume?.scaling && Object.keys(volume.scaling).length > 0;
    }
    else if (viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.StackViewport) {
        const { preScale } = viewport.getImageData() || {};
        return !!preScale?.scaled;
    }
    else {
        return false;
    }
}



/***/ })

}]);