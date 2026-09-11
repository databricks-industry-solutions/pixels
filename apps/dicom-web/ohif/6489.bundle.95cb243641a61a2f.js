"use strict";
(globalThis["rspackChunk"] = globalThis["rspackChunk"] || []).push([[6489], {
40582(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _drawHandle_js__rspack_import_0 = __webpack_require__(43939);

function drawHandles(svgDrawingHelper, annotationUID, handleGroupUID, handlePoints, options = {}) {
    handlePoints.forEach((handle, i) => {
        (0,_drawHandle_js__rspack_import_0/* ["default"] */.A)(svgDrawingHelper, annotationUID, handleGroupUID, handle, options, i);
    });
}
/* export default */ const __rspack_default_export = (drawHandles);


},
63103(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (drawRect)
});
/* import */ var _getHash_js__rspack_import_0 = __webpack_require__(23836);
/* import */ var _drawRectByCoordinates_js__rspack_import_1 = __webpack_require__(53591);


function drawRect(svgDrawingHelper, annotationUID, rectangleUID, start, end, options = {}, dataId = '') {
    const topLeft = [start[0], start[1]];
    const topRight = [end[0], start[1]];
    const bottomLeft = [start[0], end[1]];
    const bottomRight = [end[0], end[1]];
    (0,_drawRectByCoordinates_js__rspack_import_1/* ["default"] */.A)(svgDrawingHelper, annotationUID, rectangleUID, [topLeft, topRight, bottomLeft, bottomRight], options, dataId);
}


},
51933(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Y: () => (segmentationStyle)
});
/* import */ var _tools_displayTools_Contour_contourConfig_js__rspack_import_0 = __webpack_require__(21379);
/* import */ var _tools_displayTools_Labelmap_labelmapConfig_js__rspack_import_1 = __webpack_require__(55873);
/* import */ var _enums_index_js__rspack_import_2 = __webpack_require__(53870);
/* import */ var _cornerstonejs_core__rspack_import_3 = __webpack_require__(88479);




class SegmentationStyle {
    constructor() {
        this.config = {
            global: {},
            segmentations: {},
            viewportsStyle: {},
        };
    }
    setStyle(specifier, styles, merge = true) {
        const { viewportId, segmentationId, type, segmentIndex } = specifier;
        const currentStyles = this.getStyle(specifier);
        const mergedStyles = merge ? { ...currentStyles, ...styles } : styles;
        let updatedStyles;
        if (!viewportId && !segmentationId) {
            updatedStyles = mergedStyles;
        }
        else if (merge) {
            updatedStyles = this.copyActiveToInactiveIfNotProvided(mergedStyles, type);
        }
        else {
            updatedStyles = mergedStyles;
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
        if (type === _enums_index_js__rspack_import_2.SegmentationRepresentations.Labelmap) {
            const labelmapStyles = processedStyles;
            labelmapStyles.renderOutlineInactive ??= labelmapStyles.renderOutline;
            labelmapStyles.outlineWidthInactive ??= labelmapStyles.outlineWidth;
            labelmapStyles.renderFillInactive ??= labelmapStyles.renderFill;
            labelmapStyles.fillAlphaInactive ??= labelmapStyles.fillAlpha;
            labelmapStyles.outlineOpacityInactive ??= labelmapStyles.outlineOpacity;
        }
        else if (type === _enums_index_js__rspack_import_2.SegmentationRepresentations.Contour) {
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
            case _enums_index_js__rspack_import_2.SegmentationRepresentations.Labelmap:
                return (0,_tools_displayTools_Labelmap_labelmapConfig_js__rspack_import_1/* ["default"] */.A)();
            case _enums_index_js__rspack_import_2.SegmentationRepresentations.Contour:
                return (0,_tools_displayTools_Contour_contourConfig_js__rspack_import_0/* ["default"] */.A)();
            case _enums_index_js__rspack_import_2.SegmentationRepresentations.Surface:
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
        return !_cornerstonejs_core__rspack_import_3.utilities.deepEqual(style, defaultStyle);
    }
}
const segmentationStyle = new SegmentationStyle();



},
7342(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  T: () => (getActiveSegmentation)
});
/* import */ var _SegmentationStateManager_js__rspack_import_0 = __webpack_require__(86706);

function getActiveSegmentation(viewportId) {
    const segmentationStateManager = _SegmentationStateManager_js__rspack_import_0/* .defaultSegmentationStateManager */._6;
    return segmentationStateManager.getActiveSegmentation(viewportId);
}


},
19275(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _state_js__rspack_import_1 = __webpack_require__(17873);


function getToolGroupForViewport(viewportId, renderingEngineId) {
    if (!renderingEngineId) {
        renderingEngineId = (0,_cornerstonejs_core__rspack_import_0.getRenderingEngines)().find((re) => re.getViewports().find((vp) => vp.id === viewportId))?.id;
    }
    const toolGroupFilteredByIds = _state_js__rspack_import_1/* .state.toolGroups.filter */.wk.toolGroups.filter((tg) => tg.viewportsInfo.some((vp) => vp.renderingEngineId === renderingEngineId &&
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
/* export default */ const __rspack_default_export = (getToolGroupForViewport);


},
55877(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _stateManagement_segmentation_triggerSegmentationEvents_js__rspack_import_1 = __webpack_require__(49256);
/* import */ var _PlanarFreehandROITool_js__rspack_import_2 = __webpack_require__(47683);
/* import */ var _utilities_contours_AnnotationToPointData_js__rspack_import_3 = __webpack_require__(32578);
var _a;




class PlanarFreehandContourSegmentationTool extends _PlanarFreehandROITool_js__rspack_import_2/* ["default"] */.A {
    constructor(toolProps) {
        const initialProps = _cornerstonejs_core__rspack_import_0.utilities.deepMerge({
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
            (0,_stateManagement_segmentation_triggerSegmentationEvents_js__rspack_import_1.triggerSegmentationDataModified)(segmentationId);
        }
        return renderResult;
    }
}
_a = PlanarFreehandContourSegmentationTool;
PlanarFreehandContourSegmentationTool.toolName = 'PlanarFreehandContourSegmentationTool';
(() => {
    _utilities_contours_AnnotationToPointData_js__rspack_import_3/* ["default"].register */.A.register(_a);
})();
/* export default */ const __rspack_default_export = (PlanarFreehandContourSegmentationTool);


},
47683(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var gl_matrix__rspack_import_1 = __webpack_require__(40230);
/* import */ var _utilities_getCalibratedUnits_js__rspack_import_2 = __webpack_require__(3675);
/* import */ var _utilities_math_index_js__rspack_import_3 = __webpack_require__(44292);
/* import */ var _utilities_planar_index_js__rspack_import_4 = __webpack_require__(45909);
/* import */ var _utilities_throttle_js__rspack_import_5 = __webpack_require__(43193);
/* import */ var _utilities_viewportFilters_index_js__rspack_import_6 = __webpack_require__(61307);
/* import */ var _utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_7 = __webpack_require__(85321);
/* import */ var _planarFreehandROITool_drawLoop_js__rspack_import_8 = __webpack_require__(44646);
/* import */ var _planarFreehandROITool_editLoopCommon_js__rspack_import_9 = __webpack_require__(82045);
/* import */ var _planarFreehandROITool_closedContourEditLoop_js__rspack_import_10 = __webpack_require__(6524);
/* import */ var _planarFreehandROITool_openContourEditLoop_js__rspack_import_11 = __webpack_require__(91368);
/* import */ var _planarFreehandROITool_openContourEndEditLoop_js__rspack_import_12 = __webpack_require__(69423);
/* import */ var _planarFreehandROITool_renderMethods_js__rspack_import_13 = __webpack_require__(80326);
/* import */ var _stateManagement_annotation_helpers_state_js__rspack_import_14 = __webpack_require__(34350);
/* import */ var _utilities_math_polyline_index_js__rspack_import_15 = __webpack_require__(52546);
/* import */ var _utilities_viewport_isViewportPreScaled_js__rspack_import_16 = __webpack_require__(51941);
/* import */ var _utilities_math_basic_index_js__rspack_import_17 = __webpack_require__(7053);
/* import */ var _base_ContourSegmentationBaseTool_js__rspack_import_18 = __webpack_require__(26947);
/* import */ var _enums_index_js__rspack_import_19 = __webpack_require__(53870);
/* import */ var _utilities_getPixelValueUnits_js__rspack_import_20 = __webpack_require__(40865);
/* import */ var _utilities_boundingBox_snapIndexBounds_js__rspack_import_21 = __webpack_require__(66694);























const { pointCanProjectOnLine } = _utilities_math_index_js__rspack_import_3.polyline;
const { EPSILON } = _cornerstonejs_core__rspack_import_0.CONSTANTS;
const PARALLEL_THRESHOLD = 1 - EPSILON;
class PlanarFreehandROITool extends _base_ContourSegmentationBaseTool_js__rspack_import_18/* ["default"] */.A {
    constructor(toolProps = {}, defaultToolProps = {
        supportedInteractionTypes: ['Mouse', 'Touch'],
        configuration: {
            storePointData: false,
            shadow: true,
            preventHandleOutsideImage: false,
            contourHoleAdditionModifierKey: _enums_index_js__rspack_import_19.KeyboardBindings.Shift,
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
            statsCalculator: _utilities_math_basic_index_js__rspack_import_17.BasicStatsCalculator,
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
            const viewportIdsToRender = (0,_utilities_viewportFilters_index_js__rspack_import_6.getViewportIdsWithToolToRender)(element, this.getToolName());
            this.activateDraw(evt, annotation, viewportIdsToRender);
            evt.preventDefault();
            (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_7/* ["default"] */.A)(viewportIdsToRender);
            return annotation;
        };
        this.handleSelectedCallback = (evt, annotation, handle) => {
            const eventDetail = evt.detail;
            const { element } = eventDetail;
            const viewportIdsToRender = (0,_utilities_viewportFilters_index_js__rspack_import_6.getViewportIdsWithToolToRender)(element, this.getToolName());
            this.activateOpenContourEndEdit(evt, annotation, viewportIdsToRender, handle);
        };
        this.toolSelectedCallback = (evt, annotation) => {
            const eventDetail = evt.detail;
            const { element } = eventDetail;
            const viewportIdsToRender = (0,_utilities_viewportFilters_index_js__rspack_import_6.getViewportIdsWithToolToRender)(element, this.getToolName());
            if (annotation.data.contour.closed) {
                this.activateClosedContourEdit(evt, annotation, viewportIdsToRender);
            }
            else {
                this.activateOpenContourEdit(evt, annotation, viewportIdsToRender);
            }
            evt.preventDefault();
        };
        this.isPointNearTool = (element, annotation, canvasCoords, proximity) => {
            const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
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
                const { imageData, metadata, voxelManager } = image;
                const canvasCoordinates = points.map((p) => viewport.worldToCanvas(p));
                const modalityUnitOptions = {
                    isPreScaled: (0,_utilities_viewport_isViewportPreScaled_js__rspack_import_16/* .isViewportPreScaled */.u)(viewport, targetId),
                    isSuvScaled: this.isSuvScaled(viewport, targetId, annotation.metadata.referencedImageId),
                };
                const modalityUnit = (0,_utilities_getPixelValueUnits_js__rspack_import_20/* .getPixelValueUnits */.j)(metadata.Modality, annotation.metadata.referencedImageId, modalityUnitOptions);
                const polyline = data.contour.polyline;
                const numPoints = polyline.length;
                const projectedPolyline = new Array(numPoints);
                for (let i = 0; i < numPoints; i++) {
                    projectedPolyline[i] = viewport.worldToCanvas(polyline[i]);
                }
                const { maxX: canvasMaxX, maxY: canvasMaxY, minX: canvasMinX, minY: canvasMinY, } = _utilities_math_index_js__rspack_import_3.polyline.getAABB(projectedPolyline);
                const topLeftBBWorld = viewport.canvasToWorld([canvasMinX, canvasMinY]);
                const topLeftBBIndex = _cornerstonejs_core__rspack_import_0.utilities.transformWorldToIndex(imageData, topLeftBBWorld);
                const bottomRightBBWorld = viewport.canvasToWorld([
                    canvasMaxX,
                    canvasMaxY,
                ]);
                const bottomRightBBIndex = _cornerstonejs_core__rspack_import_0.utilities.transformWorldToIndex(imageData, bottomRightBBWorld);
                const handles = [topLeftBBIndex, bottomRightBBIndex];
                const calibratedScale = (0,_utilities_getCalibratedUnits_js__rspack_import_2/* .getCalibratedLengthUnitsAndScale */.Op)(image, handles);
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
                const deltaInX = gl_matrix__rspack_import_1/* .vec3.distance */.eR.Io(originalWorldPoint, deltaXPoint);
                const deltaInY = gl_matrix__rspack_import_1/* .vec3.distance */.eR.Io(originalWorldPoint, deltaYPoint);
                const statsArgs = {
                    targetId,
                    viewport,
                    canvasCoordinates,
                    points,
                    imageData,
                    metadata,
                    voxelManager,
                    cachedStats,
                    modalityUnit,
                    calibratedScale,
                    deltaInX,
                    deltaInY,
                };
                if (closed) {
                    this.updateClosedCachedStats(statsArgs);
                }
                else {
                    this.updateOpenCachedStats(statsArgs);
                }
            }
            const invalidated = annotation.invalidated;
            annotation.invalidated = false;
            if (invalidated) {
                (0,_stateManagement_annotation_helpers_state_js__rspack_import_14.triggerAnnotationModified)(annotation, enabledElement.viewport.element, _enums_index_js__rspack_import_19.ChangeTypes.StatsUpdated);
            }
            return cachedStats;
        };
        this._renderStats = (annotation, viewport, enabledElement, svgDrawingHelper) => {
            const { data } = annotation;
            const targetId = this.getTargetId(viewport, data);
            const styleSpecifier = {
                toolGroupId: this.toolGroupId,
                toolName: this.getToolName(),
                viewportId: enabledElement.viewport.id,
                annotationUID: annotation.annotationUID,
            };
            const textLines = this.configuration.getTextLines(data, targetId);
            if (!textLines || textLines.length === 0) {
                return;
            }
            const canvasCoordinates = data.contour.polyline.map((p) => viewport.worldToCanvas(p));
            this.renderLinkedTextBoxAnnotation({
                enabledElement,
                svgDrawingHelper,
                annotation,
                styleSpecifier,
                textLines,
                canvasCoordinates,
            });
        };
        (0,_planarFreehandROITool_drawLoop_js__rspack_import_8/* ["default"] */.A)(this);
        (0,_planarFreehandROITool_editLoopCommon_js__rspack_import_9/* ["default"] */.A)(this);
        (0,_planarFreehandROITool_closedContourEditLoop_js__rspack_import_10/* ["default"] */.A)(this);
        (0,_planarFreehandROITool_openContourEditLoop_js__rspack_import_11/* ["default"] */.A)(this);
        (0,_planarFreehandROITool_openContourEndEditLoop_js__rspack_import_12/* ["default"] */.A)(this);
        (0,_planarFreehandROITool_renderMethods_js__rspack_import_13/* ["default"] */.A)(this);
        this._throttledCalculateCachedStats = (0,_utilities_throttle_js__rspack_import_5/* ["default"] */.A)(this._calculateCachedStats, 100, { trailing: true });
    }
    filterInteractableAnnotationsForElement(element, annotations) {
        if (!annotations?.length) {
            return [];
        }
        const baseFilteredAnnotations = super.filterInteractableAnnotationsForElement(element, annotations);
        if (!baseFilteredAnnotations?.length) {
            return [];
        }
        const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
        const { viewport } = enabledElement;
        let annotationsToDisplay;
        if (viewport instanceof _cornerstonejs_core__rspack_import_0.VolumeViewport) {
            const camera = viewport.getCamera();
            const { spacingInNormalDirection } = _cornerstonejs_core__rspack_import_0.utilities.getTargetVolumeAndSpacingInNormalDir(viewport, camera);
            annotationsToDisplay = this.filterAnnotationsWithinSlice(baseFilteredAnnotations, camera, spacingInNormalDirection);
        }
        else {
            annotationsToDisplay = (0,_utilities_planar_index_js__rspack_import_4.filterAnnotationsForDisplay)(viewport, annotations);
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
                    const vector = gl_matrix__rspack_import_1/* .vec3.sub */.eR.jb(gl_matrix__rspack_import_1/* .vec3.create */.eR.vt(), point, camera.focalPoint);
                    const dotProduct = gl_matrix__rspack_import_1/* .vec3.dot */.eR.Om(vector, camera.viewPlaneNormal);
                    if (!_cornerstonejs_core__rspack_import_0.utilities.isEqual(dotProduct, 0)) {
                        return false;
                    }
                }
                td.metadata.viewPlaneNormal = camera.viewPlaneNormal;
                td.metadata.cameraFocalPoint = camera.focalPoint;
                return true;
            }
            if (!annotationViewPlaneNormal) {
                const { referencedImageId } = td.metadata;
                const { imageOrientationPatient } = _cornerstonejs_core__rspack_import_0.metaData.get('imagePlaneModule', referencedImageId);
                const rowCosineVec = gl_matrix__rspack_import_1/* .vec3.fromValues */.eR.fA(imageOrientationPatient[0], imageOrientationPatient[1], imageOrientationPatient[2]);
                const colCosineVec = gl_matrix__rspack_import_1/* .vec3.fromValues */.eR.fA(imageOrientationPatient[3], imageOrientationPatient[4], imageOrientationPatient[5]);
                annotationViewPlaneNormal = gl_matrix__rspack_import_1/* .vec3.create */.eR.vt();
                gl_matrix__rspack_import_1/* .vec3.cross */.eR.$A(annotationViewPlaneNormal, rowCosineVec, colCosineVec);
                td.metadata.viewPlaneNormal = annotationViewPlaneNormal;
            }
            const isParallel = Math.abs(gl_matrix__rspack_import_1/* .vec3.dot */.eR.Om(viewPlaneNormal, annotationViewPlaneNormal)) >
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
            const dir = gl_matrix__rspack_import_1/* .vec3.create */.eR.vt();
            gl_matrix__rspack_import_1/* .vec3.sub */.eR.jb(dir, focalPoint, point);
            const dot = gl_matrix__rspack_import_1/* .vec3.dot */.eR.Om(dir, viewPlaneNormal);
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
        const annotation = _cornerstonejs_core__rspack_import_0.utilities.deepMerge(contourAnnotation, {
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
        const { data, invalidated } = annotation;
        const cachedStats = data?.cachedStats;
        if (invalidated || !cachedStats?.[targetId]) {
            this._calculateStatsIfActive(annotation, targetId, viewport, renderingEngine, enabledElement);
        }
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
    updateClosedCachedStats({ viewport, points, imageData, metadata, voxelManager, cachedStats, targetId, modalityUnit, canvasCoordinates, calibratedScale, deltaInX, deltaInY, }) {
        const { areaUnit, unit } = calibratedScale;
        const indexPoints = points.map((point) => imageData.worldToIndex(point));
        const dims = imageData.getDimensions();
        let iMin = Number.MAX_SAFE_INTEGER;
        let iMax = Number.MIN_SAFE_INTEGER;
        let jMin = Number.MAX_SAFE_INTEGER;
        let jMax = Number.MIN_SAFE_INTEGER;
        let kMin = Number.MAX_SAFE_INTEGER;
        let kMax = Number.MIN_SAFE_INTEGER;
        for (let j = 0; j < points.length; j++) {
            const worldPosIndex = indexPoints[j];
            iMin = Math.min(iMin, worldPosIndex[0]);
            iMax = Math.max(iMax, worldPosIndex[0]);
            jMin = Math.min(jMin, worldPosIndex[1]);
            jMax = Math.max(jMax, worldPosIndex[1]);
            kMin = Math.min(kMin, worldPosIndex[2]);
            kMax = Math.max(kMax, worldPosIndex[2]);
        }
        iMin = Math.max(0, Math.min(dims[0] - 1, iMin));
        iMax = Math.max(0, Math.min(dims[0] - 1, iMax));
        jMin = Math.max(0, Math.min(dims[1] - 1, jMin));
        jMax = Math.max(0, Math.min(dims[1] - 1, jMax));
        kMin = Math.max(0, Math.min(dims[2] - 1, kMin));
        kMax = Math.max(0, Math.min(dims[2] - 1, kMax));
        [iMin, iMax] = (0,_utilities_boundingBox_snapIndexBounds_js__rspack_import_21/* ["default"] */.A)(iMin, iMax);
        [jMin, jMax] = (0,_utilities_boundingBox_snapIndexBounds_js__rspack_import_21/* ["default"] */.A)(jMin, jMax);
        [kMin, kMax] = (0,_utilities_boundingBox_snapIndexBounds_js__rspack_import_21/* ["default"] */.A)(kMin, kMax);
        const area = _utilities_math_index_js__rspack_import_3.polyline.getArea(canvasCoordinates) * deltaInX * deltaInY;
        const perimeter = PlanarFreehandROITool.calculateLengthInIndex(calibratedScale, indexPoints, closed);
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
                        intersections = (0,_utilities_math_polyline_index_js__rspack_import_15.getLineSegmentIntersectionsCoordinates)(canvasCoordinates, point, [canvasPosEnd[0], point[1]]);
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
        const namedArea = {
            name: 'area',
            value: area,
            unit: areaUnit,
            type: _enums_index_js__rspack_import_19.MeasurementType.Area,
        };
        const namedPerimeter = {
            name: 'perimeter',
            value: perimeter,
            unit,
            type: _enums_index_js__rspack_import_19.MeasurementType.Linear,
        };
        cachedStats[targetId] = {
            Modality: metadata.Modality,
            area,
            perimeter,
            mean: stats.mean?.value,
            max: stats.max?.value,
            min: stats.min?.value,
            stdDev: stats.stdDev?.value,
            statsArray: [namedArea, namedPerimeter, ...stats.array],
            pointsInShape: pointsInShape,
            areaUnit,
            modalityUnit,
            unit,
        };
    }
    updateOpenCachedStats({ targetId, metadata, cachedStats, modalityUnit, calibratedScale, imageData, points, }) {
        const { unit } = calibratedScale;
        const indexPoints = points.map((point) => imageData.worldToIndex(point));
        const length = PlanarFreehandROITool.calculateLengthInIndex(calibratedScale, indexPoints);
        const namedLength = {
            name: 'length',
            value: length,
            unit,
            type: _enums_index_js__rspack_import_19.MeasurementType.Linear,
        };
        cachedStats[targetId] = {
            Modality: metadata.Modality,
            length,
            modalityUnit,
            unit,
            statArray: [namedLength],
        };
    }
}
PlanarFreehandROITool.toolName = 'PlanarFreehandROI';
function defaultGetTextLines(data, targetId) {
    const cachedVolumeStats = data.cachedStats[targetId];
    const { area, mean, stdDev, length, perimeter, max, min, isEmptyArea, unit, areaUnit, modalityUnit, } = cachedVolumeStats || {};
    const textLines = [];
    if (_cornerstonejs_core__rspack_import_0.utilities.isNumber(area)) {
        const areaLine = isEmptyArea
            ? `Area: Oblique not supported`
            : `Area: ${_cornerstonejs_core__rspack_import_0.utilities.roundNumber(area)} ${areaUnit}`;
        textLines.push(areaLine);
    }
    if (_cornerstonejs_core__rspack_import_0.utilities.isNumber(mean)) {
        textLines.push(`Mean: ${_cornerstonejs_core__rspack_import_0.utilities.roundNumber(mean)} ${modalityUnit}`);
    }
    if (_cornerstonejs_core__rspack_import_0.utilities.isNumber(max)) {
        textLines.push(`Max: ${_cornerstonejs_core__rspack_import_0.utilities.roundNumber(max)} ${modalityUnit}`);
    }
    if (_cornerstonejs_core__rspack_import_0.utilities.isNumber(min)) {
        textLines.push(`Min: ${_cornerstonejs_core__rspack_import_0.utilities.roundNumber(min)} ${modalityUnit}`);
    }
    if (_cornerstonejs_core__rspack_import_0.utilities.isNumber(stdDev)) {
        textLines.push(`Std Dev: ${_cornerstonejs_core__rspack_import_0.utilities.roundNumber(stdDev)} ${modalityUnit}`);
    }
    if (_cornerstonejs_core__rspack_import_0.utilities.isNumber(perimeter)) {
        textLines.push(`Perimeter: ${_cornerstonejs_core__rspack_import_0.utilities.roundNumber(perimeter)} ${unit}`);
    }
    if (_cornerstonejs_core__rspack_import_0.utilities.isNumber(length)) {
        textLines.push(`${_cornerstonejs_core__rspack_import_0.utilities.roundNumber(length)} ${unit}`);
    }
    return textLines;
}
/* export default */ const __rspack_default_export = (PlanarFreehandROITool);


},
62691(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _base_index_js__rspack_import_0 = __webpack_require__(84962);
/* import */ var _cornerstonejs_core__rspack_import_1 = __webpack_require__(88479);
/* import */ var gl_matrix__rspack_import_2 = __webpack_require__(40230);
/* import */ var _utilities_getCalibratedUnits_js__rspack_import_3 = __webpack_require__(3675);
/* import */ var _utilities_throttle_js__rspack_import_4 = __webpack_require__(43193);
/* import */ var _stateManagement_index_js__rspack_import_5 = __webpack_require__(60567);
/* import */ var _stateManagement_annotation_annotationLocking_js__rspack_import_6 = __webpack_require__(3043);
/* import */ var _stateManagement_annotation_annotationVisibility_js__rspack_import_7 = __webpack_require__(46804);
/* import */ var _stateManagement_annotation_helpers_state_js__rspack_import_8 = __webpack_require__(34350);
/* import */ var _drawingSvg_index_js__rspack_import_9 = __webpack_require__(21566);
/* import */ var _store_state_js__rspack_import_10 = __webpack_require__(17873);
/* import */ var _enums_index_js__rspack_import_11 = __webpack_require__(53870);
/* import */ var _utilities_viewportFilters_index_js__rspack_import_12 = __webpack_require__(61307);
/* import */ var _utilities_getViewportICamera_js__rspack_import_13 = __webpack_require__(41891);
/* import */ var _utilities_math_rectangle_index_js__rspack_import_14 = __webpack_require__(34706);
/* import */ var _cursors_elementCursor_js__rspack_import_15 = __webpack_require__(45128);
/* import */ var _utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_16 = __webpack_require__(85321);
/* import */ var _utilities_getPixelValueUnits_js__rspack_import_17 = __webpack_require__(40865);
/* import */ var _utilities_viewportCapabilities_js__rspack_import_18 = __webpack_require__(68877);
/* import */ var _utilities_viewport_isViewportPreScaled_js__rspack_import_19 = __webpack_require__(51941);
/* import */ var _utilities_math_basic_index_js__rspack_import_20 = __webpack_require__(7053);
/* import */ var _stateManagement_annotation_config_helpers_js__rspack_import_21 = __webpack_require__(55649);
/* import */ var _utilities_defaultGetTextLines_js__rspack_import_22 = __webpack_require__(65234);
var _a;























const { transformWorldToIndex, transformWorldToIndexContinuous } = _cornerstonejs_core__rspack_import_1.utilities;
class RectangleROITool extends _base_index_js__rspack_import_0/* .AnnotationTool */.EC {
    constructor(toolProps = {}, defaultToolProps = {
        supportedInteractionTypes: ['Mouse', 'Touch'],
        configuration: {
            storePointData: false,
            shadow: true,
            preventHandleOutsideImage: false,
            calculateStats: true,
            getTextLines: _utilities_defaultGetTextLines_js__rspack_import_22/* .defaultAreaGetTextLines */.d6,
            statsCalculator: _utilities_math_basic_index_js__rspack_import_20.BasicStatsCalculator,
            targetsFilter: _base_index_js__rspack_import_0/* .measurementTargetFilters.allPixelData */.F6.allPixelData,
        },
    }) {
        super(toolProps, defaultToolProps);
        this.addNewAnnotation = (evt) => {
            const eventDetail = evt.detail;
            const { currentPoints, element } = eventDetail;
            const worldPos = currentPoints.world;
            const enabledElement = (0,_cornerstonejs_core__rspack_import_1.getEnabledElement)(element);
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
            (0,_stateManagement_index_js__rspack_import_5/* .addAnnotation */.lC)(annotation, element);
            const viewportIdsToRender = (0,_utilities_viewportFilters_index_js__rspack_import_12.getViewportIdsWithToolToRender)(element, this.getToolName());
            this.editData = {
                annotation,
                viewportIdsToRender,
                handleIndex: 3,
                movingTextBox: false,
                newAnnotation: true,
                hasMoved: false,
            };
            this._activateDraw(element);
            (0,_cursors_elementCursor_js__rspack_import_15.hideElementCursor)(element);
            evt.preventDefault();
            (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_16/* ["default"] */.A)(viewportIdsToRender);
            return annotation;
        };
        this.isPointNearTool = (element, annotation, canvasCoords, proximity) => {
            const enabledElement = (0,_cornerstonejs_core__rspack_import_1.getEnabledElement)(element);
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
            const distanceToPoint = _utilities_math_rectangle_index_js__rspack_import_14.distanceToPoint([left, top, width, height], point);
            if (distanceToPoint <= proximity) {
                return true;
            }
            return false;
        };
        this.toolSelectedCallback = (evt, annotation) => {
            const eventDetail = evt.detail;
            const { element } = eventDetail;
            annotation.highlighted = true;
            const viewportIdsToRender = (0,_utilities_viewportFilters_index_js__rspack_import_12.getViewportIdsWithToolToRender)(element, this.getToolName());
            this.editData = {
                annotation,
                viewportIdsToRender,
                movingTextBox: false,
            };
            this._activateModify(element);
            (0,_cursors_elementCursor_js__rspack_import_15.hideElementCursor)(element);
            (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_16/* ["default"] */.A)(viewportIdsToRender);
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
            const viewportIdsToRender = (0,_utilities_viewportFilters_index_js__rspack_import_12.getViewportIdsWithToolToRender)(element, this.getToolName());
            this.editData = {
                annotation,
                viewportIdsToRender,
                handleIndex,
                movingTextBox,
            };
            this._activateModify(element);
            (0,_cursors_elementCursor_js__rspack_import_15.hideElementCursor)(element);
            (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_16/* ["default"] */.A)(viewportIdsToRender);
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
            (0,_cursors_elementCursor_js__rspack_import_15.resetElementCursor)(element);
            this.doneEditMemo();
            this.editData = null;
            this.isDrawing = false;
            if (this.isHandleOutsideImage &&
                this.configuration.preventHandleOutsideImage) {
                (0,_stateManagement_index_js__rspack_import_5/* .removeAnnotation */.O8)(annotation.annotationUID);
            }
            (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_16/* ["default"] */.A)(viewportIdsToRender);
            if (newAnnotation) {
                (0,_stateManagement_annotation_helpers_state_js__rspack_import_8.triggerAnnotationCompleted)(annotation);
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
                const enabledElement = (0,_cornerstonejs_core__rspack_import_1.getEnabledElement)(element);
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
            const enabledElement = (0,_cornerstonejs_core__rspack_import_1.getEnabledElement)(element);
            (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_16/* ["default"] */.A)(viewportIdsToRender);
            if (annotation.invalidated) {
                (0,_stateManagement_annotation_helpers_state_js__rspack_import_8.triggerAnnotationModified)(annotation, element, _enums_index_js__rspack_import_11.ChangeTypes.HandlesUpdated);
            }
        };
        this.cancel = (element) => {
            if (this.isDrawing) {
                this.isDrawing = false;
                this._deactivateDraw(element);
                this._deactivateModify(element);
                (0,_cursors_elementCursor_js__rspack_import_15.resetElementCursor)(element);
                const { annotation, viewportIdsToRender, newAnnotation } = this.editData;
                const { data } = annotation;
                annotation.highlighted = false;
                data.handles.activeHandleIndex = null;
                (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_16/* ["default"] */.A)(viewportIdsToRender);
                if (newAnnotation) {
                    (0,_stateManagement_annotation_helpers_state_js__rspack_import_8.triggerAnnotationCompleted)(annotation);
                }
                this.editData = null;
                return annotation.annotationUID;
            }
        };
        this._activateDraw = (element) => {
            _store_state_js__rspack_import_10/* .state.isInteractingWithTool */.wk.isInteractingWithTool = true;
            element.addEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_UP, this._endCallback);
            element.addEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_DRAG, this._dragCallback);
            element.addEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_MOVE, this._dragCallback);
            element.addEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_CLICK, this._endCallback);
            element.addEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_END, this._endCallback);
            element.addEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_DRAG, this._dragCallback);
            element.addEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_TAP, this._endCallback);
        };
        this._deactivateDraw = (element) => {
            _store_state_js__rspack_import_10/* .state.isInteractingWithTool */.wk.isInteractingWithTool = false;
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_UP, this._endCallback);
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_DRAG, this._dragCallback);
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_MOVE, this._dragCallback);
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_CLICK, this._endCallback);
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_END, this._endCallback);
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_DRAG, this._dragCallback);
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_TAP, this._endCallback);
        };
        this._activateModify = (element) => {
            _store_state_js__rspack_import_10/* .state.isInteractingWithTool */.wk.isInteractingWithTool = true;
            element.addEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_UP, this._endCallback);
            element.addEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_DRAG, this._dragCallback);
            element.addEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_CLICK, this._endCallback);
            element.addEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_END, this._endCallback);
            element.addEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_DRAG, this._dragCallback);
            element.addEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_TAP, this._endCallback);
        };
        this._deactivateModify = (element) => {
            _store_state_js__rspack_import_10/* .state.isInteractingWithTool */.wk.isInteractingWithTool = false;
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_UP, this._endCallback);
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_DRAG, this._dragCallback);
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_CLICK, this._endCallback);
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_END, this._endCallback);
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_DRAG, this._dragCallback);
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_TAP, this._endCallback);
        };
        this.renderAnnotation = (enabledElement, svgDrawingHelper) => {
            let renderStatus = false;
            const { viewport } = enabledElement;
            const { element } = viewport;
            let annotations = (0,_stateManagement_index_js__rspack_import_5/* .getAnnotations */.Rh)(this.getToolName(), element);
            if (!annotations?.length) {
                return renderStatus;
            }
            annotations = this.filterInteractableAnnotationsForElement(element, annotations);
            if (!annotations?.length) {
                return renderStatus;
            }
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
                const targetIds = this.getMeasurementTargets(viewport, data);
                styleSpecifier.annotationUID = annotationUID;
                const { color, lineWidth, lineDash } = this.getAnnotationStyle({
                    annotation,
                    styleSpecifier,
                });
                const { viewPlaneNormal, viewUp } = (0,_utilities_getViewportICamera_js__rspack_import_13/* ["default"] */.A)(viewport);
                if (this.ensureCachedStatsTargets(data, targetIds, (stats) => stats.areaUnit == null)) {
                    this._calculateCachedStats(annotation, viewPlaneNormal, viewUp, enabledElement);
                }
                else if (annotation.invalidated) {
                    this._throttledCalculateCachedStats(annotation, viewPlaneNormal, viewUp, enabledElement);
                    if (viewport instanceof _cornerstonejs_core__rspack_import_1.VolumeViewport) {
                        const { referencedImageId } = annotation.metadata;
                        for (const targetId in data.cachedStats) {
                            if (targetId.startsWith('imageId')) {
                                const viewports = renderingEngine
                                    .getViewports()
                                    .filter(_utilities_viewportCapabilities_js__rspack_import_18/* .viewportSupportsImageSlices */.hz);
                                const invalidatedStack = viewports.find((vp) => {
                                    const referencedImageURI = _cornerstonejs_core__rspack_import_1.utilities.imageIdToURI(referencedImageId);
                                    const hasImageURI = vp.hasImageURI(referencedImageURI);
                                    const currentImageURI = _cornerstonejs_core__rspack_import_1.utilities.imageIdToURI(vp.getCurrentImageId());
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
                if (!(0,_stateManagement_annotation_annotationVisibility_js__rspack_import_7.isAnnotationVisible)(annotationUID)) {
                    continue;
                }
                if (!(0,_stateManagement_annotation_annotationLocking_js__rspack_import_6.isAnnotationLocked)(annotationUID) &&
                    !this.editData &&
                    activeHandleIndex !== null &&
                    activeHandleIndex !== undefined) {
                    activeHandleCanvasCoords = [canvasCoordinates[activeHandleIndex]];
                }
                const showHandlesAlways = Boolean((0,_stateManagement_annotation_config_helpers_js__rspack_import_21/* .getStyleProperty */.h)('showHandlesAlways', {}));
                if (activeHandleCanvasCoords || showHandlesAlways) {
                    const handleGroupUID = '0';
                    (0,_drawingSvg_index_js__rspack_import_9.drawHandles)(svgDrawingHelper, annotationUID, handleGroupUID, showHandlesAlways ? canvasCoordinates : activeHandleCanvasCoords, {
                        color,
                    });
                }
                const dataId = `${annotationUID}-rect`;
                const rectangleUID = '0';
                (0,_drawingSvg_index_js__rspack_import_9.drawRectByCoordinates)(svgDrawingHelper, annotationUID, rectangleUID, canvasCoordinates, {
                    color,
                    lineDash,
                    lineWidth,
                }, dataId);
                renderStatus = true;
                const textLines = this.configuration.getTextLines(data, targetIds);
                if (!textLines?.length) {
                    continue;
                }
                if (!this.renderLinkedTextBoxAnnotation({
                    enabledElement,
                    svgDrawingHelper,
                    annotation,
                    styleSpecifier,
                    textLines,
                    canvasCoordinates,
                })) {
                    continue;
                }
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
        this._calculateCachedStats = (annotation, viewPlaneNormal, viewUp, enabledElement) => {
            if (!this.configuration.calculateStats) {
                return;
            }
            const { data } = annotation;
            const { viewport } = enabledElement;
            const { element } = viewport;
            const worldHandles = data.handles.points;
            const { cachedStats } = data;
            if (annotation.invalidated) {
                const currentTargets = this.getMeasurementTargets(viewport, data);
                for (const key of Object.keys(cachedStats)) {
                    delete cachedStats[key];
                }
                this.ensureCachedStatsTargets(data, currentTargets);
            }
            const targetIds = Object.keys(cachedStats);
            let isHandleOutsideAnyTarget = false;
            for (let i = 0; i < targetIds.length; i++) {
                const targetId = targetIds[i];
                const image = this.getTargetImageData(targetId);
                if (!image) {
                    continue;
                }
                const { dimensions, imageData, metadata, voxelManager } = image;
                const continuousIndexHandles = worldHandles.map((worldHandle) => transformWorldToIndexContinuous(imageData, worldHandle));
                const pos1Index = transformWorldToIndex(imageData, worldHandles[0]);
                const pos2Index = transformWorldToIndex(imageData, worldHandles[3]);
                const isHandleOutsideTarget = !this._isInsideVolume(pos1Index, pos2Index, dimensions);
                isHandleOutsideAnyTarget ||= isHandleOutsideTarget;
                if (!isHandleOutsideTarget) {
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
                    const handles = [pos1Index, pos2Index];
                    const calibrate = (0,_utilities_getCalibratedUnits_js__rspack_import_3/* .getCalibratedLengthUnitsAndScale */.Op)(image, handles);
                    const width = _a.calculateLengthInIndex(calibrate, [
                        continuousIndexHandles[0],
                        continuousIndexHandles[1],
                    ]);
                    const height = _a.calculateLengthInIndex(calibrate, [
                        continuousIndexHandles[0],
                        continuousIndexHandles[2],
                    ]);
                    const area = Math.abs(width * height);
                    const { areaUnit } = calibrate;
                    const pixelUnitsOptions = {
                        isPreScaled: (0,_utilities_viewport_isViewportPreScaled_js__rspack_import_19/* .isViewportPreScaled */.u)(viewport, targetId),
                        isSuvScaled: this.isSuvScaled(viewport, targetId, annotation.metadata.referencedImageId),
                    };
                    const modalityUnit = (0,_utilities_getPixelValueUnits_js__rspack_import_17/* .getPixelValueUnits */.j)(metadata.Modality, annotation.metadata.referencedImageId, pixelUnitsOptions);
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
                    cachedStats[targetId] = {
                        Modality: metadata.Modality,
                    };
                }
            }
            this.isHandleOutsideImage = isHandleOutsideAnyTarget;
            const invalidated = annotation.invalidated;
            annotation.invalidated = false;
            if (invalidated) {
                (0,_stateManagement_annotation_helpers_state_js__rspack_import_8.triggerAnnotationModified)(annotation, element, _enums_index_js__rspack_import_11.ChangeTypes.StatsUpdated);
            }
            return cachedStats;
        };
        this._isInsideVolume = (index1, index2, dimensions) => {
            return (_cornerstonejs_core__rspack_import_1.utilities.indexWithinDimensions(index1, dimensions) &&
                _cornerstonejs_core__rspack_import_1.utilities.indexWithinDimensions(index2, dimensions));
        };
        this._throttledCalculateCachedStats = (0,_utilities_throttle_js__rspack_import_4/* ["default"] */.A)(this._calculateCachedStats, 100, { trailing: true });
    }
}
_a = RectangleROITool;
RectangleROITool.toolName = 'RectangleROI';
RectangleROITool.hydrate = (viewportId, points, options) => {
    const enabledElement = (0,_cornerstonejs_core__rspack_import_1.getEnabledElementByViewportId)(viewportId);
    if (!enabledElement) {
        return;
    }
    const { FrameOfReferenceUID, referencedImageId, viewPlaneNormal, instance, viewport, } = _a.hydrateBase(_a, enabledElement, points, options);
    const { toolInstance, ...serializableOptions } = options || {};
    const annotation = {
        annotationUID: options?.annotationUID || _cornerstonejs_core__rspack_import_1.utilities.uuidv4(),
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
    (0,_stateManagement_index_js__rspack_import_5/* .addAnnotation */.lC)(annotation, viewport.element);
    (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_16/* ["default"] */.A)([viewport.id]);
};
/* export default */ const __rspack_default_export = (RectangleROITool);


},
36379(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var gl_matrix__rspack_import_1 = __webpack_require__(40230);
/* import */ var _AnnotationDisplayTool_js__rspack_import_2 = __webpack_require__(76853);
/* import */ var _stateManagement_annotation_annotationLocking_js__rspack_import_3 = __webpack_require__(3043);
/* import */ var _stateManagement_annotation_annotationVisibility_js__rspack_import_4 = __webpack_require__(46804);
/* import */ var _stateManagement_annotation_annotationState_js__rspack_import_5 = __webpack_require__(44627);
/* import */ var _stateManagement_annotation_helpers_state_js__rspack_import_6 = __webpack_require__(34350);
/* import */ var _store_state_js__rspack_import_7 = __webpack_require__(17873);
/* import */ var _enums_index_js__rspack_import_8 = __webpack_require__(53870);
/* import */ var _drawingSvg_index_js__rspack_import_9 = __webpack_require__(21566);
/* import */ var _utilities_drawing_index_js__rspack_import_10 = __webpack_require__(85372);
/* import */ var _enums_ChangeTypes_js__rspack_import_11 = __webpack_require__(95338);
/* import */ var _stateManagement_annotation_annotationSelection_js__rspack_import_12 = __webpack_require__(41908);
/* import */ var _utilities_contourSegmentation_index_js__rspack_import_13 = __webpack_require__(67846);
/* import */ var _utilities_safeStructuredClone_js__rspack_import_14 = __webpack_require__(83966);
/* import */ var _utilities_getViewportICamera_js__rspack_import_15 = __webpack_require__(41891);
















const { DefaultHistoryMemo } = _cornerstonejs_core__rspack_import_0.utilities.HistoryMemo;
class AnnotationTool extends _AnnotationDisplayTool_js__rspack_import_2/* ["default"] */.A {
    static createAnnotationForViewport(viewport, ...annotationBaseData) {
        const metadata = viewport.getViewReference();
        delete metadata.volumeId;
        return this.createAnnotation({ metadata }, ...annotationBaseData);
    }
    static createAndAddAnnotation(viewport, ...annotationBaseData) {
        const annotation = this.createAnnotationForViewport(viewport, ...annotationBaseData);
        (0,_stateManagement_annotation_annotationState_js__rspack_import_5.addAnnotation)(annotation, viewport.element);
        (0,_stateManagement_annotation_helpers_state_js__rspack_import_6.triggerAnnotationModified)(annotation, viewport.element);
    }
    constructor(toolProps, defaultToolProps) {
        super(toolProps, defaultToolProps);
        this._activateModify = (element) => {
            _store_state_js__rspack_import_7/* .state.isInteractingWithTool */.wk.isInteractingWithTool = true;
            element.addEventListener(_enums_index_js__rspack_import_8.Events.MOUSE_UP, this._endCallback);
            element.addEventListener(_enums_index_js__rspack_import_8.Events.MOUSE_DRAG, this._dragCallback);
            element.addEventListener(_enums_index_js__rspack_import_8.Events.MOUSE_CLICK, this._endCallback);
            element.addEventListener(_enums_index_js__rspack_import_8.Events.TOUCH_END, this._endCallback);
            element.addEventListener(_enums_index_js__rspack_import_8.Events.TOUCH_DRAG, this._dragCallback);
            element.addEventListener(_enums_index_js__rspack_import_8.Events.TOUCH_TAP, this._endCallback);
        };
        this._deactivateModify = (element) => {
            _store_state_js__rspack_import_7/* .state.isInteractingWithTool */.wk.isInteractingWithTool = false;
            element.removeEventListener(_enums_index_js__rspack_import_8.Events.MOUSE_UP, this._endCallback);
            element.removeEventListener(_enums_index_js__rspack_import_8.Events.MOUSE_DRAG, this._dragCallback);
            element.removeEventListener(_enums_index_js__rspack_import_8.Events.MOUSE_CLICK, this._endCallback);
            element.removeEventListener(_enums_index_js__rspack_import_8.Events.TOUCH_END, this._endCallback);
            element.removeEventListener(_enums_index_js__rspack_import_8.Events.TOUCH_DRAG, this._dragCallback);
            element.removeEventListener(_enums_index_js__rspack_import_8.Events.TOUCH_TAP, this._endCallback);
        };
        this.mouseMoveCallback = (evt, filteredAnnotations) => {
            if (!filteredAnnotations) {
                return false;
            }
            const { element, currentPoints } = evt.detail;
            const canvasCoords = currentPoints.canvas;
            let annotationsNeedToBeRedrawn = false;
            for (const annotation of filteredAnnotations) {
                if ((0,_stateManagement_annotation_annotationLocking_js__rspack_import_3.isAnnotationLocked)(annotation.annotationUID) ||
                    !(0,_stateManagement_annotation_annotationVisibility_js__rspack_import_4.isAnnotationVisible)(annotation.annotationUID)) {
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
        const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
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
            const near = gl_matrix__rspack_import_1/* .vec2.distance */.Zc.Io(canvasCoords, annotationCanvasCoordinate) < proximity;
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
            textBoxBorderRadius: this.getStyle('textBoxBorderRadius', specifications, annotation),
            textBoxMargin: this.getStyle('textBoxMargin', specifications, annotation),
            textBoxLinkLineColor: this.getStyle('textBoxLinkLineColor', specifications, annotation),
        };
    }
    renderLinkedTextBoxAnnotation(options) {
        const { enabledElement, svgDrawingHelper, annotation, styleSpecifier, textLines, canvasCoordinates, textBoxUID = '1', placementPoints, } = options;
        const { viewport } = enabledElement;
        const { element } = viewport;
        const { annotationUID, data } = annotation;
        const styleOptions = this.getLinkedTextBoxStyle(styleSpecifier, annotation);
        if (!styleOptions.visibility) {
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
            return false;
        }
        if (!data.handles.textBox) {
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
        }
        const pointsForPlacement = placementPoints ?? canvasCoordinates;
        if (!data.handles.textBox.hasMoved) {
            const canvasTextBoxCoords = (0,_utilities_drawing_index_js__rspack_import_10.getTextBoxCoordsCanvas)(pointsForPlacement, element, textLines);
            data.handles.textBox.worldPosition =
                viewport.canvasToWorld(canvasTextBoxCoords);
        }
        const textBoxPosition = viewport.worldToCanvas(data.handles.textBox.worldPosition);
        const boundingBox = (0,_drawingSvg_index_js__rspack_import_9.drawLinkedTextBox)(svgDrawingHelper, annotationUID, textBoxUID, textLines, textBoxPosition, canvasCoordinates, {}, styleOptions);
        const { x: left, y: top, width, height } = boundingBox;
        data.handles.textBox.worldBoundingBox = {
            topLeft: viewport.canvasToWorld([left, top]),
            topRight: viewport.canvasToWorld([left + width, top]),
            bottomLeft: viewport.canvasToWorld([left, top + height]),
            bottomRight: viewport.canvasToWorld([left + width, top + height]),
        };
        return true;
    }
    static isSuvScaled(viewport, targetId, imageId) {
        const volumeId = _cornerstonejs_core__rspack_import_0.utilities.getVolumeId(targetId);
        const volume = _cornerstonejs_core__rspack_import_0.cache.getVolume(volumeId);
        if (volume) {
            return volume?.scaling?.PT !== undefined;
        }
        const scalingModule = imageId && _cornerstonejs_core__rspack_import_0.metaData.get('scalingModule', imageId);
        return typeof scalingModule?.suvbw === 'number';
    }
    getAnnotationStyle(context) {
        const { annotation, styleSpecifier } = context;
        const getStyle = (property) => this.getStyle(property, styleSpecifier, annotation);
        const { annotationUID } = annotation;
        const visibility = (0,_stateManagement_annotation_annotationVisibility_js__rspack_import_4.isAnnotationVisible)(annotationUID);
        const locked = (0,_stateManagement_annotation_annotationLocking_js__rspack_import_3.isAnnotationLocked)(annotationUID);
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
        return {
            annotationUID,
            data: (0,_utilities_safeStructuredClone_js__rspack_import_14/* .safeStructuredClone */.W)(data),
            deleting,
        };
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
                const { viewport } = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element) || {};
                viewport?.setViewReference(annotation.metadata);
                if (state.deleting === true) {
                    state.deleting = false;
                    Object.assign(annotation.data, state.data);
                    if (annotation.data.contour) {
                        const annotationData = annotation.data;
                        annotationData.contour.polyline = state.data.contour.pointsManager.points;
                        delete state.data.contour.pointsManager;
                        if (annotationData.segmentation) {
                            (0,_utilities_contourSegmentation_index_js__rspack_import_13.addContourSegmentationAnnotation)(annotation);
                        }
                    }
                    state.data = newState.data;
                    (0,_stateManagement_annotation_annotationState_js__rspack_import_5.addAnnotation)(annotation, element);
                    (0,_stateManagement_annotation_annotationSelection_js__rspack_import_12.setAnnotationSelected)(annotation.annotationUID, true);
                    viewport?.render();
                    return;
                }
                if (state.deleting === false) {
                    state.deleting = true;
                    state.data = newState.data;
                    (0,_stateManagement_annotation_annotationSelection_js__rspack_import_12.setAnnotationSelected)(annotation.annotationUID);
                    (0,_stateManagement_annotation_annotationState_js__rspack_import_5.removeAnnotation)(annotation.annotationUID);
                    viewport?.render();
                    return;
                }
                const currentAnnotation = (0,_stateManagement_annotation_annotationState_js__rspack_import_5.getAnnotation)(annotationUID);
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
                if (element) {
                    (0,_stateManagement_annotation_helpers_state_js__rspack_import_6.triggerAnnotationModified)(currentAnnotation, element, _enums_ChangeTypes_js__rspack_import_11/* ["default"].History */.A.History);
                }
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
    startGroupRecording() {
        DefaultHistoryMemo.startGroupRecording();
    }
    endGroupRecording() {
        DefaultHistoryMemo.endGroupRecording();
    }
    static hydrateBase(ToolClass, enabledElement, points, options = {}) {
        if (!enabledElement) {
            return null;
        }
        const { viewport } = enabledElement;
        const FrameOfReferenceUID = viewport.getFrameOfReferenceUID();
        const camera = (0,_utilities_getViewportICamera_js__rspack_import_15/* ["default"] */.A)(viewport);
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
            if (viewport instanceof _cornerstonejs_core__rspack_import_0.StackViewport) {
                const closestImageIndex = _cornerstonejs_core__rspack_import_0.utilities.getClosestStackImageIndexForPoint(points[0], viewport);
                if (closestImageIndex !== undefined) {
                    referencedImageId = viewport.getImageIds()[closestImageIndex];
                }
            }
            else if (viewport instanceof _cornerstonejs_core__rspack_import_0.BaseVolumeViewport) {
                referencedImageId = instance.getReferencedImageId(viewport, points[0], viewPlaneNormal, viewUp);
            }
            else if (_cornerstonejs_core__rspack_import_0.utilities.isGenericViewport(viewport)) {
                const genericViewport = viewport;
                referencedImageId = genericViewport.getViewReference?.({
                    points: [points[0]],
                })?.referencedImageId;
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
/* export default */ const __rspack_default_export = (AnnotationTool);


},
28182(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _base_index_js__rspack_import_1 = __webpack_require__(84962);
/* import */ var _enums_SegmentationRepresentations_js__rspack_import_2 = __webpack_require__(63555);
/* import */ var _stateManagement_segmentation_getActiveSegmentation_js__rspack_import_3 = __webpack_require__(7342);
/* import */ var _stateManagement_segmentation_segmentLocking_js__rspack_import_4 = __webpack_require__(60606);
/* import */ var _stateManagement_segmentation_getSegmentation_js__rspack_import_5 = __webpack_require__(99212);
/* import */ var _stateManagement_segmentation_getCurrentLabelmapImageIdForViewport_js__rspack_import_6 = __webpack_require__(9200);
/* import */ var _stateManagement_segmentation_config_segmentationColor_js__rspack_import_7 = __webpack_require__(46692);
/* import */ var _stateManagement_segmentation_getActiveSegmentIndex_js__rspack_import_8 = __webpack_require__(61395);
/* import */ var _enums_index_js__rspack_import_9 = __webpack_require__(53870);
/* import */ var _utilities_segmentation_createLabelmapMemo_js__rspack_import_10 = __webpack_require__(1732);
/* import */ var _stateManagement_annotation_annotationState_js__rspack_import_11 = __webpack_require__(44627);
/* import */ var _utilities_planar_index_js__rspack_import_12 = __webpack_require__(45909);
/* import */ var _utilities_math_polyline_index_js__rspack_import_13 = __webpack_require__(52546);
/* import */ var _stateManagement_segmentation_triggerSegmentationEvents_js__rspack_import_14 = __webpack_require__(49256);
/* import */ var _strategies_index_js__rspack_import_15 = __webpack_require__(62831);
/* import */ var _stateManagement_segmentation_helpers_getViewportLabelmapRenderMode_js__rspack_import_16 = __webpack_require__(72293);
/* import */ var _stateManagement_segmentation_helpers_labelmapSegmentationState_js__rspack_import_17 = __webpack_require__(89615);
/* import */ var _utilities_getViewportICamera_js__rspack_import_18 = __webpack_require__(41891);



















class LabelmapBaseTool extends _base_index_js__rspack_import_1/* .BaseTool */.oS {
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
            if (!operationData) {
                return;
            }
            operationData.segmentIndex = memoData?.segmentIndex;
            if (element) {
                this.applyActiveStrategyCallback((0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element), operationData, _enums_index_js__rspack_import_9.StrategyCallbacks.AcceptPreview);
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
            memo = _utilities_segmentation_createLabelmapMemo_js__rspack_import_10.createLabelmapMemo(segmentationId, segmentationVoxelManager);
            this.memoMap.set(voxelManagerId, memo);
        }
        else {
            if (memo.redoVoxelManager) {
                memo = _utilities_segmentation_createLabelmapMemo_js__rspack_import_10.createLabelmapMemo(segmentationId, segmentationVoxelManager);
                this.memoMap.set(voxelManagerId, memo);
            }
        }
        this.memo = memo;
        return memo;
    }
    createEditData(element) {
        const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
        const { viewport } = enabledElement;
        const activeSegmentation = (0,_stateManagement_segmentation_getActiveSegmentation_js__rspack_import_3/* .getActiveSegmentation */.T)(viewport.id);
        if (!activeSegmentation) {
            return null;
        }
        const { segmentationId } = activeSegmentation;
        const segmentsLocked = (0,_stateManagement_segmentation_segmentLocking_js__rspack_import_4.getLockedSegmentIndices)(segmentationId);
        const { representationData } = (0,_stateManagement_segmentation_getSegmentation_js__rspack_import_5/* .getSegmentation */.T)(segmentationId);
        const editData = this.getEditData({
            viewport,
            representationData,
            segmentsLocked,
            segmentationId,
        });
        return editData;
    }
    getEditData({ viewport, representationData, segmentsLocked, segmentationId, }) {
        const viewportRenderMode = (0,_stateManagement_segmentation_helpers_getViewportLabelmapRenderMode_js__rspack_import_16/* ["default"] */.A)(viewport);
        const activeSegmentIndex = (0,_stateManagement_segmentation_getActiveSegmentIndex_js__rspack_import_8/* .getActiveSegmentIndex */.Q)(segmentationId);
        const segmentation = (0,_stateManagement_segmentation_getSegmentation_js__rspack_import_5/* .getSegmentation */.T)(segmentationId);
        const layerForEdit = activeSegmentIndex
            ? (0,_stateManagement_segmentation_helpers_labelmapSegmentationState_js__rspack_import_17/* .resolveLabelmapForSegment */.Nf)(segmentation, activeSegmentIndex)
            : undefined;
        if (viewportRenderMode === 'volume' ||
            viewport instanceof _cornerstonejs_core__rspack_import_0.BaseVolumeViewport) {
            const segmentationVolume = layerForEdit
                ? (0,_stateManagement_segmentation_helpers_labelmapSegmentationState_js__rspack_import_17/* .getOrCreateLabelmapVolume */.kL)(layerForEdit)
                : undefined;
            const volumeId = layerForEdit?.volumeId ?? segmentationVolume?.volumeId;
            if (!segmentationVolume || !volumeId) {
                return;
            }
            const actors = viewport.getActors();
            const volumes = actors
                .filter((actorEntry) => actorEntry.referencedId)
                .map((actorEntry) => _cornerstonejs_core__rspack_import_0.cache.getVolume(actorEntry.referencedId))
                .filter((volume) => !!volume);
            const referencedVolumeIdToThreshold = volumes.find((volume) => _cornerstonejs_core__rspack_import_0.utilities.isEqual(volume.dimensions, segmentationVolume.dimensions))?.volumeId || volumes[0]?.volumeId;
            return {
                volumeId,
                referencedVolumeId: this.configuration.threshold?.volumeId ??
                    layerForEdit?.referencedVolumeId ??
                    segmentationVolume.referencedVolumeId ??
                    referencedVolumeIdToThreshold,
                segmentsLocked,
            };
        }
        if (viewportRenderMode === 'image') {
            const segmentationImageId = (0,_stateManagement_segmentation_getCurrentLabelmapImageIdForViewport_js__rspack_import_6/* .getCurrentLabelmapImageIdForViewport */.vl)(viewport.id, segmentationId);
            if (!segmentationImageId) {
                return;
            }
            return {
                imageId: segmentationImageId,
                segmentsLocked,
            };
        }
        const event = new CustomEvent(_cornerstonejs_core__rspack_import_0.Enums.Events.ERROR_EVENT, {
            detail: {
                type: 'Segmentation',
                message: 'Cannot perform brush operation on the selected viewport',
            },
            cancelable: true,
        });
        _cornerstonejs_core__rspack_import_0.eventTarget.dispatchEvent(event);
        return null;
    }
    createHoverData(element, centerCanvas) {
        const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
        const { viewport } = enabledElement;
        const camera = (0,_utilities_getViewportICamera_js__rspack_import_18/* ["default"] */.A)(viewport);
        const { viewPlaneNormal, viewUp } = camera;
        if (!viewPlaneNormal || !viewUp) {
            return;
        }
        const viewportIdsToRender = [viewport.id];
        const activeSegmentationData = this.getActiveSegmentationData(viewport);
        if (!activeSegmentationData) {
            return;
        }
        const { segmentIndex, segmentationId, segmentColor } = activeSegmentationData;
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
        const activeRepresentation = (0,_stateManagement_segmentation_getActiveSegmentation_js__rspack_import_3/* .getActiveSegmentation */.T)(viewportId);
        if (!activeRepresentation) {
            return;
        }
        const { segmentationId } = activeRepresentation;
        const segmentIndex = (0,_stateManagement_segmentation_getActiveSegmentIndex_js__rspack_import_8/* .getActiveSegmentIndex */.Q)(segmentationId);
        if (!segmentIndex) {
            return;
        }
        const segmentColor = (0,_stateManagement_segmentation_config_segmentationColor_js__rspack_import_7.getSegmentIndexColor)(viewportId, segmentationId, segmentIndex);
        return {
            segmentIndex,
            segmentationId,
            segmentColor,
        };
    }
    getOperationData(element) {
        const editData = this._editData || this.createEditData(element);
        const hoverData = this._hoverData || this.createHoverData(element);
        if (!editData || !hoverData) {
            return;
        }
        const { segmentIndex, segmentationId, brushCursor } = hoverData;
        const { data, metadata = {} } = brushCursor || {};
        const { viewPlaneNormal, viewUp } = metadata;
        const points = data?.editPoints || data?.handles?.points;
        const configColor = this.configuration.preview?.previewColors?.[segmentIndex];
        const { viewport } = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element) || {};
        if (!viewport || !segmentIndex || !segmentationId) {
            return;
        }
        const segmentColor = (0,_stateManagement_segmentation_config_segmentationColor_js__rspack_import_7.getSegmentIndexColor)(viewport.id, segmentationId, segmentIndex);
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
            points,
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
            hoverData: this._hoverData,
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
        const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
        const operationData = this.getOperationData(element);
        if (!enabledElement || !operationData) {
            return;
        }
        const results = this.applyActiveStrategyCallback(enabledElement, operationData, _enums_index_js__rspack_import_9.StrategyCallbacks.AddPreview);
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
        const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
        const operationData = this.getOperationData(element);
        if (!enabledElement || !operationData) {
            return;
        }
        this.applyActiveStrategyCallback(enabledElement, operationData, _enums_index_js__rspack_import_9.StrategyCallbacks.RejectPreview);
        this._previewData.preview = null;
        this._previewData.isDrag = false;
    }
    acceptPreview(element = this._previewData.element) {
        if (!element) {
            return;
        }
        const operationData = this.getOperationData(element);
        if (!operationData) {
            return;
        }
        if (this.memo && this.memo.id) {
            this.acceptedMemoIds.set(this.memo.id, {
                element,
                segmentIndex: operationData.segmentIndex,
            });
        }
        const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
        this.applyActiveStrategyCallback(enabledElement, operationData, _enums_index_js__rspack_import_9.StrategyCallbacks.AcceptPreview);
        this.doneEditMemo();
        this._previewData.preview = null;
        this._previewData.isDrag = false;
    }
    static viewportContoursToLabelmap(viewport, options) {
        const removeContours = options?.removeContours ?? true;
        const annotations = (0,_stateManagement_annotation_annotationState_js__rspack_import_11.getAllAnnotations)();
        const viewAnnotations = (0,_utilities_planar_index_js__rspack_import_12.filterAnnotationsForDisplay)(viewport, annotations);
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
                    FILL_INSIDE_CIRCLE: _strategies_index_js__rspack_import_15.fillInsideCircle,
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
            const activeIndex = (0,_stateManagement_segmentation_getActiveSegmentIndex_js__rspack_import_8/* .getActiveSegmentIndex */.Q)(segmentationId);
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
                        const isContained = (0,_utilities_math_polyline_index_js__rspack_import_13.isPointInsidePolyline3D)(worldPoint, polyline);
                        if (isContained) {
                            previewVoxels.setAtIJK(i, j, k, segmentIndex);
                        }
                    }
                }
            }
            if (removeContours) {
                (0,_stateManagement_annotation_annotationState_js__rspack_import_11.removeAnnotation)(annotation.annotationUID);
            }
        }
        const slices = previewVoxels.getArrayOfModifiedSlices();
        (0,_stateManagement_segmentation_triggerSegmentationEvents_js__rspack_import_14.triggerSegmentationDataModified)(segmentationId, slices);
    }
}
LabelmapBaseTool.previewData = {
    preview: null,
    element: null,
    timerStart: 0,
    timer: null,
    startPoint: [NaN, NaN],
    isDrag: false,
};
/* export default */ const __rspack_default_export = (LabelmapBaseTool);
function lightenColor(r, g, b, a, factor = 0.4) {
    return [
        Math.round(r + (255 - r) * factor),
        Math.round(g + (255 - g) * factor),
        Math.round(b + (255 - b) * factor),
        a,
    ];
}


},
12583(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  v: () => (getDeduplicatedVTKPolyDataPoints)
});
function getDeduplicatedVTKPolyDataPoints(polyData, bypass = false) {
    const points = polyData.getPoints();
    const lines = polyData.getLines();
    const pointsArray = new Array(points.getNumberOfPoints())
        .fill(0)
        .map((_, i) => points.getPoint(i).slice());
    const linesArray = new Array(lines.getNumberOfCells()).fill(0).map((_, i) => {
        const cell = lines.getCell(i * 3).slice();
        return { a: cell[0], b: cell[1] };
    });
    if (bypass) {
        return { points: pointsArray, lines: linesArray };
    }
    const newPoints = [];
    for (const [i, pt] of pointsArray.entries()) {
        const index = newPoints.findIndex((point) => point[0] === pt[0] && point[1] === pt[1] && point[2] === pt[2]);
        if (index >= 0) {
            linesArray.map((line) => {
                if (line.a === i) {
                    line.a = index;
                }
                if (line.b === i) {
                    line.b = index;
                }
                return line;
            });
        }
        else {
            const newIndex = newPoints.length;
            newPoints.push(pt);
            linesArray.map((line) => {
                if (line.a === i) {
                    line.a = newIndex;
                }
                if (line.b === i) {
                    line.b = newIndex;
                }
                return line;
            });
        }
    }
    const newLines = linesArray.filter((line) => line.a !== line.b);
    return { points: newPoints, lines: newLines };
}
/* unused export default */ var __rspack_default_export = ((/* unused pure expression or super */ null && ({ getDeduplicatedVTKPolyDataPoints })));


},
6646(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _isObject_js__rspack_import_0 = __webpack_require__(21574);

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
    if ((0,_isObject_js__rspack_import_0/* ["default"] */.A)(options)) {
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
/* export default */ const __rspack_default_export = (debounce);


},
72(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (getTextBoxCoordsCanvas)
});
/* import */ var _textBoxOverlapRegistry_js__rspack_import_0 = __webpack_require__(23162);
/* import */ var _math_aabb_intersectAABB_js__rspack_import_1 = __webpack_require__(50492);


const VIEWPORT_ELEMENT = 'viewport-element';
const TEXT_BOX_GAP = 6;
function getTextBoxCoordsCanvas(annotationCanvasPoints, element, textLines = []) {
    if (!annotationCanvasPoints?.length || !annotationCanvasPoints[0]) {
        return [0, 0];
    }
    const corners = _determineCorners(annotationCanvasPoints);
    const centerY = (corners.top[1] + corners.bottom[1]) / 2;
    const defaultTextBoxCanvas = [corners.right[0], centerY];
    if (!element) {
        return defaultTextBoxCanvas;
    }
    const { width: textBoxWidth, height: textBoxHeight } = _estimateTextBoxSize(textLines);
    const margin = 4;
    const maxX = element.clientWidth - margin;
    const maxY = element.clientHeight - margin;
    let x = corners.right[0];
    let y = centerY - textBoxHeight / 2;
    if (x + textBoxWidth > maxX) {
        x = corners.left[0] - textBoxWidth;
    }
    x = Math.max(margin, Math.min(x, maxX - textBoxWidth));
    y = Math.max(margin, Math.min(y, maxY - textBoxHeight));
    const svgLayer = _findSvgLayer(element);
    if (svgLayer) {
        const existingBoxes = (0,_textBoxOverlapRegistry_js__rspack_import_0/* .getRegisteredTextBoxes */.Pd)(svgLayer);
        if (existingBoxes.length > 0) {
            const resolved = _resolveOverlap(x, y, textBoxWidth, textBoxHeight, existingBoxes, margin, maxX, maxY);
            x = resolved[0];
            y = resolved[1];
        }
    }
    return [x, y];
}
function _resolveOverlap(x, y, width, height, existingBoxes, margin, maxX, maxY) {
    if (!_overlapsAny(x, y, width, height, existingBoxes)) {
        return [x, y];
    }
    let candidateY = y;
    for (let i = 0; i < 30; i++) {
        const blocker = _findFirstOverlap(x, candidateY, width, height, existingBoxes);
        if (!blocker) {
            break;
        }
        candidateY = blocker.y + blocker.height + TEXT_BOX_GAP;
        if (candidateY + height > maxY) {
            candidateY = Infinity;
            break;
        }
    }
    if (candidateY !== Infinity &&
        !_overlapsAny(x, candidateY, width, height, existingBoxes)) {
        return [
            x,
            Math.max(margin, Math.min(candidateY, maxY - height)),
        ];
    }
    candidateY = y;
    for (let i = 0; i < 30; i++) {
        const blocker = _findFirstOverlap(x, candidateY, width, height, existingBoxes);
        if (!blocker) {
            break;
        }
        candidateY = blocker.y - height - TEXT_BOX_GAP;
        if (candidateY < margin) {
            candidateY = -Infinity;
            break;
        }
    }
    if (candidateY !== -Infinity &&
        !_overlapsAny(x, candidateY, width, height, existingBoxes)) {
        return [
            x,
            Math.max(margin, Math.min(candidateY, maxY - height)),
        ];
    }
    return [x, y];
}
function _overlapsAny(x, y, w, h, boxes) {
    const candidate = _toTextBoxAABB({ x, y, width: w, height: h });
    return boxes.some((box) => (0,_math_aabb_intersectAABB_js__rspack_import_1/* ["default"] */.A)(candidate, _toTextBoxAABB(box, TEXT_BOX_GAP / 2)));
}
function _findFirstOverlap(x, y, w, h, boxes) {
    const candidate = _toTextBoxAABB({ x, y, width: w, height: h });
    return boxes.find((box) => (0,_math_aabb_intersectAABB_js__rspack_import_1/* ["default"] */.A)(candidate, _toTextBoxAABB(box, TEXT_BOX_GAP / 2)));
}
function _toTextBoxAABB(rect, inflate = 0) {
    return {
        minX: rect.x - inflate,
        minY: rect.y - inflate,
        maxX: rect.x + rect.width + inflate,
        maxY: rect.y + rect.height + inflate,
    };
}
function _findSvgLayer(element) {
    const internalDiv = element.querySelector(`.${VIEWPORT_ELEMENT}`);
    return internalDiv?.querySelector(':scope > .svg-layer') || null;
}
function _determineCorners(canvasPoints) {
    const validPoints = canvasPoints.filter(Boolean);
    const p0 = validPoints[0];
    if (!p0 || validPoints.length < 2) {
        return { left: p0, right: p0, top: p0, bottom: p0 };
    }
    let left = p0;
    let right = p0;
    let top = p0;
    let bottom = p0;
    for (let i = 1; i < validPoints.length; i++) {
        const point = validPoints[i];
        if (point[0] < left[0]) {
            left = point;
        }
        if (point[0] > right[0]) {
            right = point;
        }
        if (point[1] < top[1]) {
            top = point;
        }
        if (point[1] > bottom[1]) {
            bottom = point;
        }
    }
    return {
        left,
        top,
        bottom,
        right,
    };
}
function _estimateTextBoxSize(textLines) {
    const estimatedPadding = 25;
    const estimatedCharWidth = 8;
    const estimatedLineHeight = 17;
    const longestLineLength = textLines.reduce((max, line) => Math.max(max, line?.length ?? 0), 0);
    const lineCount = Math.max(textLines.length, 1);
    const width = longestLineLength * estimatedCharWidth + estimatedPadding * 2;
    const height = lineCount * estimatedLineHeight + estimatedPadding * 2;
    return { width, height };
}


},
17017(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (getViewportForAnnotation)
});
/* import */ var _getViewportsForAnnotation_js__rspack_import_0 = __webpack_require__(69458);

function getViewportForAnnotation(annotation) {
    const viewports = (0,_getViewportsForAnnotation_js__rspack_import_0/* ["default"] */.A)(annotation);
    if (!viewports?.length) {
        return undefined;
    }
    const viewport = viewports.find((viewport) => viewport
        .getImageIds()
        .some((imageId) => imageId === annotation.metadata.referencedImageId));
    return viewport ?? viewports[0];
}


},
21574(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
function isObject(value) {
    const type = typeof value;
    return value !== null && (type === 'object' || type === 'function');
}
/* export default */ const __rspack_default_export = (isObject);


},
14820(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  B: () => (InstanceBasicStatsCalculator),
  O: () => (BasicStatsCalculator)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _Calculator_js__rspack_import_1 = __webpack_require__(45753);
var _a;


const { PointsManager } = _cornerstonejs_core__rspack_import_0.utilities;
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
class BasicStatsCalculator extends _Calculator_js__rspack_import_1/* .Calculator */.t {
    static statsInit(options) {
        if (!options.storePointData) {
            this.state.pointsInShape = null;
        }
        this.state = createBasicStatsState(options.storePointData);
    }
}
_a = BasicStatsCalculator;
BasicStatsCalculator.state = createBasicStatsState(true);
BasicStatsCalculator.statsCallback = ({ value: newValue, pointLPS = null, pointIJK = null, }) => {
    basicStatsCallback(_a.state, newValue, pointLPS, pointIJK);
};
BasicStatsCalculator.getStatistics = (options) => {
    return basicGetStatistics(_a.state, options?.unit);
};
class InstanceBasicStatsCalculator extends _Calculator_js__rspack_import_1/* .InstanceCalculator */.I {
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


},
8463(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (distanceToPoint)
});
/* import */ var _distanceToPointSquared_js__rspack_import_0 = __webpack_require__(29850);

function distanceToPoint(lineStart, lineEnd, point) {
    if (lineStart.length !== 2 || lineEnd.length !== 2 || point.length !== 2) {
        throw Error('lineStart, lineEnd, and point should have 2 elements of [x, y]');
    }
    return Math.sqrt((0,_distanceToPointSquared_js__rspack_import_0/* ["default"] */.A)(lineStart, lineEnd, point));
}


},
80428(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (intersectLine)
});
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
function intersectLine(line1Start, line1End, line2Start, line2End, infinite = false) {
    const [x1, y1] = line1Start;
    const [x2, y2] = line1End;
    const [x3, y3] = line2Start;
    const [x4, y4] = line2End;
    if (infinite) {
        const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (Math.abs(denom) < 1e-10) {
            return undefined;
        }
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
        const x = x1 + t * (x2 - x1);
        const y = y1 + t * (y2 - y1);
        return [x, y];
    }
    const a1 = y2 - y1;
    const b1 = x1 - x2;
    const c1 = x2 * y1 - x1 * y2;
    const r3 = a1 * x3 + b1 * y3 + c1;
    const r4 = a1 * x4 + b1 * y4 + c1;
    if (r3 !== 0 && r4 !== 0 && sign(r3) === sign(r4)) {
        return undefined;
    }
    const a2 = y4 - y3;
    const b2 = x3 - x4;
    const c2 = x4 * y3 - x3 * y4;
    const r1 = a2 * x1 + b2 * y1 + c2;
    const r2 = a2 * x2 + b2 * y2 + c2;
    if (r1 !== 0 && r2 !== 0 && sign(r1) === sign(r2)) {
        return undefined;
    }
    const denomSegment = a1 * b2 - a2 * b1;
    let num;
    num = b1 * c2 - b2 * c1;
    const x = num / denomSegment;
    num = a2 * c1 - a1 * c2;
    const y = num / denomSegment;
    const intersectionPoint = [x, y];
    return intersectionPoint;
}


},
99162(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (distanceToPoint)
});
/* import */ var _line_index_js__rspack_import_0 = __webpack_require__(84091);

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
        const distance = _line_index_js__rspack_import_0.distanceToPoint(lineStart, lineEnd, point);
        if (distance < minDistance) {
            minDistance = distance;
        }
    });
    return minDistance;
}


},
39767(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  d: () => (/* reexport */ pointInSphere)
});

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/sphere/pointInSphere.js
function pointInSphere(sphere, pointLPS) {
    const { center, radius } = sphere;
    const radius2 = sphere.radius2 || radius * radius;
    return ((pointLPS[0] - center[0]) * (pointLPS[0] - center[0]) +
        (pointLPS[1] - center[1]) * (pointLPS[1] - center[1]) +
        (pointLPS[2] - center[2]) * (pointLPS[2] - center[2]) <=
        radius2);
}

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/sphere/index.js




},
2023(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  W: () => (filterAnnotationsWithinSamePlane)
});
/* import */ var gl_matrix__rspack_import_0 = __webpack_require__(40230);
/* import */ var _cornerstonejs_core__rspack_import_1 = __webpack_require__(88479);


const { EPSILON } = _cornerstonejs_core__rspack_import_1.CONSTANTS;
const PARALLEL_THRESHOLD = 1 - EPSILON;
function filterAnnotationsWithinSamePlane(annotations, camera) {
    const { viewPlaneNormal } = camera;
    const annotationsWithParallelNormals = annotations.filter((td) => {
        let annotationViewPlaneNormal = td.metadata.viewPlaneNormal;
        if (!annotationViewPlaneNormal) {
            const { referencedImageId } = td.metadata;
            const { imageOrientationPatient } = _cornerstonejs_core__rspack_import_1.metaData.get('imagePlaneModule', referencedImageId);
            const rowCosineVec = gl_matrix__rspack_import_0/* .vec3.fromValues */.eR.fA(imageOrientationPatient[0], imageOrientationPatient[1], imageOrientationPatient[2]);
            const colCosineVec = gl_matrix__rspack_import_0/* .vec3.fromValues */.eR.fA(imageOrientationPatient[3], imageOrientationPatient[4], imageOrientationPatient[5]);
            annotationViewPlaneNormal = gl_matrix__rspack_import_0/* .vec3.create */.eR.vt();
            gl_matrix__rspack_import_0/* .vec3.cross */.eR.$A(annotationViewPlaneNormal, rowCosineVec, colCosineVec);
            td.metadata.viewPlaneNormal = annotationViewPlaneNormal;
        }
        const isParallel = Math.abs(gl_matrix__rspack_import_0/* .vec3.dot */.eR.Om(viewPlaneNormal, annotationViewPlaneNormal)) >
            PARALLEL_THRESHOLD;
        return annotationViewPlaneNormal && isParallel;
    });
    if (!annotationsWithParallelNormals.length) {
        return [];
    }
    return annotationsWithParallelNormals;
}


},
8434(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  H: () => (interpolatePoints)
});
/* import */ var d3_interpolate__rspack_import_0 = __webpack_require__(83759);
/* import */ var d3_array__rspack_import_1 = __webpack_require__(18559);


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
    const xInterpolator = (0,d3_interpolate__rspack_import_0/* .interpolateBasis */.Qm)(knotsIndexes.map((k) => originalPoints[k][0]));
    const yInterpolator = (0,d3_interpolate__rspack_import_0/* .interpolateBasis */.Qm)(knotsIndexes.map((k) => originalPoints[k][1]));
    if (isPoints3D(originalPoints)) {
        const zInterpolator = (0,d3_interpolate__rspack_import_0/* .interpolateBasis */.Qm)(knotsIndexes.map((k) => originalPoints[k][2]));
        return ((0,d3_array__rspack_import_1/* .zip */.yU)((0,d3_interpolate__rspack_import_0/* .quantize */.yd)(xInterpolator, n), (0,d3_interpolate__rspack_import_0/* .quantize */.yd)(yInterpolator, n), (0,d3_interpolate__rspack_import_0/* .quantize */.yd)(zInterpolator, n)));
    }
    else {
        return ((0,d3_array__rspack_import_1/* .zip */.yU)((0,d3_interpolate__rspack_import_0/* .quantize */.yd)(xInterpolator, n), (0,d3_interpolate__rspack_import_0/* .quantize */.yd)(yInterpolator, n)));
    }
}


},
83966(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  W: () => (safeStructuredClone)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);

const { PointsManager } = _cornerstonejs_core__rspack_import_0.utilities;
function cloneContourValue(_key, value) {
    if (value == null || typeof value !== 'object' || !('polyline' in value)) {
        return value;
    }
    const contour = value;
    return {
        ...contour,
        polyline: null,
        pointsManager: PointsManager.create3(contour.polyline.length, contour.polyline),
    };
}
const OMIT_KEYS = new Map([
    ['pointsInVolume', null],
    ['projectionPoints', null],
    ['contour', cloneContourValue],
    ['spline', null],
]);
function omitUncloneableKeys(obj) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        if (OMIT_KEYS.has(key)) {
            const handler = OMIT_KEYS.get(key);
            if (handler) {
                result[key] = handler(key, value);
            }
            continue;
        }
        if (value === null || value === undefined || typeof value !== 'object') {
            result[key] = value;
        }
        else if (Array.isArray(value)) {
            result[key] = value.map((value) => safeStructuredClone(value));
        }
        else {
            result[key] = omitUncloneableKeys(value);
        }
    }
    return result;
}
function safeStructuredClone(value) {
    if (value === null || value === undefined) {
        return value;
    }
    if (typeof value !== 'object') {
        return value;
    }
    if (Array.isArray(value)) {
        return value.map((item) => safeStructuredClone(item));
    }
    return omitUncloneableKeys(value);
}


},
25086(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _VolumetricCalculator_js__rspack_import_0 = __webpack_require__(46450);

class SegmentStatsCalculator {
    static statsInit(options) {
        const { storePointData, indices, mode } = options;
        this.mode = mode;
        this.indices = indices;
        this.calculators.clear();
        if (this.mode === 'individual') {
            indices.forEach((index) => {
                this.calculators.set(index, new _VolumetricCalculator_js__rspack_import_0/* .InstanceVolumetricCalculator */.C3({ storePointData }));
            });
        }
        else {
            this.calculators.set(indices, new _VolumetricCalculator_js__rspack_import_0/* .InstanceVolumetricCalculator */.C3({ storePointData }));
        }
    }
    static statsCallback(data) {
        const { segmentIndex, ...statsData } = data;
        if (!segmentIndex) {
            throw new Error('Segment index is required for stats calculation');
        }
        const calculator = this.mode === 'individual'
            ? this.calculators.get(segmentIndex)
            : this.calculators.get(this.indices);
        if (!calculator) {
            throw new Error(`No calculator found for segment ${segmentIndex}`);
        }
        calculator.statsCallback(statsData);
    }
    static getStatistics(options) {
        if (this.mode === 'individual') {
            const result = {};
            this.calculators.forEach((calculator, segmentIndex) => {
                result[segmentIndex] = calculator.getStatistics(options);
            });
            return result;
        }
        const calculator = this.calculators.get(this.indices);
        return calculator.getStatistics(options);
    }
}
SegmentStatsCalculator.calculators = new Map();
SegmentStatsCalculator.indices = [];
SegmentStatsCalculator.mode = 'collective';
/* export default */ const __rspack_default_export = (SegmentStatsCalculator);


},
43193(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _debounce_js__rspack_import_0 = __webpack_require__(6646);
/* import */ var _isObject_js__rspack_import_1 = __webpack_require__(21574);


function throttle(func, wait, options) {
    let leading = true;
    let trailing = true;
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function');
    }
    if ((0,_isObject_js__rspack_import_1/* ["default"] */.A)(options)) {
        leading = 'leading' in options ? Boolean(options.leading) : leading;
        trailing = 'trailing' in options ? Boolean(options.trailing) : trailing;
    }
    return (0,_debounce_js__rspack_import_0/* ["default"] */.A)(func, wait, {
        leading,
        trailing,
        maxWait: wait,
    });
}
/* export default */ const __rspack_default_export = (throttle);


},
51941(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  u: () => (isViewportPreScaled)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);

function isViewportPreScaled(viewport, targetId) {
    return !!_cornerstonejs_core__rspack_import_0.utilities.getScalingDescriptor(viewport, targetId)?.isPreScaled;
}



},
51672(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (getViewportIdsWithToolToRender)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _filterViewportsWithFrameOfReferenceUID_js__rspack_import_1 = __webpack_require__(76509);
/* import */ var _filterViewportsWithToolEnabled_js__rspack_import_2 = __webpack_require__(76183);
/* import */ var _filterViewportsWithParallelNormals_js__rspack_import_3 = __webpack_require__(92021);




function getViewportIdsWithToolToRender(element, toolName, requireParallelNormals = true) {
    const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
    const { renderingEngine, FrameOfReferenceUID } = enabledElement;
    let viewports = renderingEngine.getViewports();
    viewports = (0,_filterViewportsWithFrameOfReferenceUID_js__rspack_import_1/* ["default"] */.A)(viewports, FrameOfReferenceUID);
    viewports = (0,_filterViewportsWithToolEnabled_js__rspack_import_2/* ["default"] */.A)(viewports, toolName);
    const viewport = renderingEngine.getViewport(enabledElement.viewportId);
    if (requireParallelNormals) {
        viewports = (0,_filterViewportsWithParallelNormals_js__rspack_import_3/* ["default"] */.A)(viewports, viewport);
    }
    const viewportIds = viewports.map((vp) => vp.id);
    return viewportIds;
}


},

}]);