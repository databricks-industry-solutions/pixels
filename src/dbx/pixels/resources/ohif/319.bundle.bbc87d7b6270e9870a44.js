"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[319],{

/***/ 74690:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  u: () => (/* reexport */ keyDown),
  L: () => (/* reexport */ keyUp)
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js + 2 modules
var enums = __webpack_require__(99737);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/eventListeners/index.js + 18 modules
var eventListeners = __webpack_require__(21418);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/eventListeners/mouse/mouseDownListener.js
var mouseDownListener = __webpack_require__(68014);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/store/ToolGroupManager/index.js + 6 modules
var ToolGroupManager = __webpack_require__(77609);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/shared/getActiveToolForKeyboardEvent.js




const { Active } = enums.ToolModes;
function getActiveToolForKeyboardEvent(evt) {
    const { renderingEngineId, viewportId } = evt.detail;
    const mouseButton = (0,mouseDownListener/* getMouseButton */.kg)();
    const modifierKey = eventListeners/* keyEventListener */.kt.getModifierKey();
    const toolGroup = (0,ToolGroupManager.getToolGroupForViewport)(viewportId, renderingEngineId);
    if (!toolGroup) {
        return null;
    }
    const toolGroupToolNames = Object.keys(toolGroup.toolOptions);
    const defaultMousePrimary = toolGroup.getDefaultMousePrimary();
    for (let j = 0; j < toolGroupToolNames.length; j++) {
        const toolName = toolGroupToolNames[j];
        const toolOptions = toolGroup.toolOptions[toolName];
        if (toolOptions.mode !== Active) {
            continue;
        }
        const correctBinding = toolOptions.bindings.length &&
            toolOptions.bindings.some((binding) => binding.mouseButton === (mouseButton ?? defaultMousePrimary) &&
                binding.modifierKey === modifierKey);
        if (correctBinding) {
            return toolGroup.getToolInstance(toolName);
        }
    }
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/shared/getToolsWithActionsForKeyboardEvents.js

function getToolsWithModesForKeyboardEvent(evt, toolModes) {
    const toolsWithActions = new Map();
    const { renderingEngineId, viewportId } = evt.detail;
    const toolGroup = (0,ToolGroupManager.getToolGroupForViewport)(viewportId, renderingEngineId);
    if (!toolGroup) {
        return toolsWithActions;
    }
    const toolGroupToolNames = Object.keys(toolGroup.toolOptions);
    const key = evt.detail.key;
    for (let j = 0; j < toolGroupToolNames.length; j++) {
        const toolName = toolGroupToolNames[j];
        const tool = toolGroup.getToolInstance(toolName);
        const actionsConfig = tool.configuration?.actions;
        if (!actionsConfig) {
            continue;
        }
        const actions = Object.values(actionsConfig);
        if (!actions?.length || !toolModes.includes(tool.mode)) {
            continue;
        }
        const action = actions.find((action) => action.bindings?.some((binding) => binding.key === key));
        if (action) {
            toolsWithActions.set(tool, action);
        }
    }
    return toolsWithActions;
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/ToolModes.js
var ToolModes = __webpack_require__(49892);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/keyboardEventHandlers/keyDown.js




function keyDown(evt) {
    const activeTool = getActiveToolForKeyboardEvent(evt);
    if (activeTool) {
        const { renderingEngineId, viewportId } = evt.detail;
        const toolGroup = (0,ToolGroupManager.getToolGroupForViewport)(viewportId, renderingEngineId);
        const toolName = activeTool.getToolName();
        if (Object.keys(toolGroup.toolOptions).includes(toolName)) {
            toolGroup.setViewportsCursorByToolName(toolName);
        }
    }
    const activeToolsWithEventBinding = getToolsWithModesForKeyboardEvent(evt, [
        ToolModes/* default */.A.Active,
    ]);
    if (activeToolsWithEventBinding?.size) {
        const { element } = evt.detail;
        for (const [key, value] of [...activeToolsWithEventBinding.entries()]) {
            const method = typeof value.method === 'function' ? value.method : key[value.method];
            method.call(key, element, value, evt);
        }
    }
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/eventListeners/keyboard/keyDownListener.js
var keyDownListener = __webpack_require__(40776);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/keyboardEventHandlers/keyUp.js



function keyUp(evt) {
    const activeTool = getActiveToolForKeyboardEvent(evt);
    if (!activeTool) {
        return;
    }
    const { renderingEngineId, viewportId } = evt.detail;
    const toolGroup = (0,ToolGroupManager.getToolGroupForViewport)(viewportId, renderingEngineId);
    (0,keyDownListener/* resetModifierKey */.Ud)();
    const toolName = activeTool.getToolName();
    if (Object.keys(toolGroup.toolOptions).includes(toolName)) {
        toolGroup.setViewportsCursorByToolName(toolName);
    }
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/keyboardEventHandlers/index.js





/***/ }),

/***/ 40100:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  q_: () => (/* reexport */ mouseEventHandlers_mouseClick),
  LM: () => (/* reexport */ mouseEventHandlers_mouseDoubleClick),
  cT: () => (/* reexport */ mouseDown),
  Xd: () => (/* reexport */ mouseDownActivate),
  al: () => (/* reexport */ mouseDrag),
  tG: () => (/* reexport */ mouseMove),
  Je: () => (/* reexport */ mouseEventHandlers_mouseUp),
  rO: () => (/* reexport */ mouseEventHandlers_mouseWheel)
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/shared/customCallbackHandler.js
var customCallbackHandler = __webpack_require__(96198);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/mouseEventHandlers/mouseClick.js

const mouseClick = customCallbackHandler/* default */.A.bind(null, 'Mouse', 'mouseClickCallback');
/* harmony default export */ const mouseEventHandlers_mouseClick = (mouseClick);

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/mouseEventHandlers/mouseDoubleClick.js

const mouseDoubleClick = customCallbackHandler/* default */.A.bind(null, 'Mouse', 'doubleClickCallback');
/* harmony default export */ const mouseEventHandlers_mouseDoubleClick = (mouseDoubleClick);

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/store/state.js
var state = __webpack_require__(85204);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js + 2 modules
var enums = __webpack_require__(99737);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/annotationSelection.js
var annotationSelection = __webpack_require__(17343);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/annotationLocking.js
var annotationLocking = __webpack_require__(2076);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/annotationVisibility.js
var annotationVisibility = __webpack_require__(29601);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/store/filterToolsWithMoveableHandles.js
var filterToolsWithMoveableHandles = __webpack_require__(35486);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/store/filterToolsWithAnnotationsForElement.js
var filterToolsWithAnnotationsForElement = __webpack_require__(57725);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/store/filterMoveableAnnotationTools.js
var filterMoveableAnnotationTools = __webpack_require__(25972);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/eventListeners/index.js + 18 modules
var eventListeners = __webpack_require__(21418);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/store/ToolGroupManager/index.js + 6 modules
var ToolGroupManager = __webpack_require__(77609);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/shared/getMouseModifier.js
var getMouseModifier = __webpack_require__(76910);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/shared/getActiveToolForMouseEvent.js




const { Active } = enums.ToolModes;
function getActiveToolForMouseEvent(evt) {
    const { renderingEngineId, viewportId, event: mouseEvent } = evt.detail;
    const modifierKey = (0,getMouseModifier/* default */.A)(mouseEvent) || eventListeners/* keyEventListener */.kt.getModifierKey();
    const toolGroup = (0,ToolGroupManager.getToolGroupForViewport)(viewportId, renderingEngineId);
    if (!toolGroup) {
        return null;
    }
    const toolGroupToolNames = Object.keys(toolGroup.toolOptions);
    const defaultMousePrimary = toolGroup.getDefaultMousePrimary();
    const mouseButton = evt.detail.buttons ?? mouseEvent?.buttons ?? defaultMousePrimary;
    for (let j = 0; j < toolGroupToolNames.length; j++) {
        const toolName = toolGroupToolNames[j];
        const toolOptions = toolGroup.toolOptions[toolName];
        const correctBinding = toolOptions.bindings.length &&
            toolOptions.bindings.some((binding) => {
                return (binding.mouseButton === mouseButton &&
                    binding.modifierKey === modifierKey);
            });
        if (toolOptions.mode === Active && correctBinding) {
            return toolGroup.getToolInstance(toolName);
        }
    }
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/shared/getToolsWithModesForMouseEvent.js
var getToolsWithModesForMouseEvent = __webpack_require__(70333);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/shared/getToolsWithActionsForMouseEvent.js



function getToolsWithActionsForMouseEvent(evt, toolModes) {
    const toolsWithActions = new Map();
    const { renderingEngineId, viewportId } = evt.detail;
    const toolGroup = (0,ToolGroupManager.getToolGroupForViewport)(viewportId, renderingEngineId);
    if (!toolGroup) {
        return toolsWithActions;
    }
    const toolGroupToolNames = Object.keys(toolGroup.toolOptions);
    const defaultMousePrimary = toolGroup.getDefaultMousePrimary();
    const mouseEvent = evt.detail.event;
    const mouseButton = mouseEvent?.buttons ?? defaultMousePrimary;
    const modifierKey = (0,getMouseModifier/* default */.A)(mouseEvent) || eventListeners/* keyEventListener */.kt.getModifierKey();
    for (let j = 0; j < toolGroupToolNames.length; j++) {
        const toolName = toolGroupToolNames[j];
        const tool = toolGroup.getToolInstance(toolName);
        const actionsConfig = tool.configuration?.actions ?? {};
        const actions = Object.values(actionsConfig);
        if (!actions?.length || !toolModes.includes(tool.mode)) {
            continue;
        }
        const action = actions.find((action) => action.bindings?.length &&
            action.bindings.some((binding) => binding.mouseButton === mouseButton &&
                binding.modifierKey === modifierKey));
        if (action) {
            toolsWithActions.set(tool, action);
        }
    }
    return toolsWithActions;
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/mouseEventHandlers/mouseDownAnnotationAction.js






const { Active: mouseDownAnnotationAction_Active, Passive } = enums.ToolModes;
function mouseDownAnnotationAction(evt) {
    if (state/* state */.wk.isInteractingWithTool) {
        return false;
    }
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const enabledElement = (0,esm.getEnabledElement)(element);
    const { canvas: canvasCoords } = eventDetail.currentPoints;
    if (!enabledElement) {
        return false;
    }
    const toolsWithActions = getToolsWithActionsForMouseEvent(evt, [
        mouseDownAnnotationAction_Active,
        Passive,
    ]);
    const tools = Array.from(toolsWithActions.keys());
    const annotationToolsWithAnnotations = (0,filterToolsWithAnnotationsForElement/* default */.A)(element, tools);
    const moveableAnnotationTools = (0,filterMoveableAnnotationTools/* default */.A)(element, annotationToolsWithAnnotations, canvasCoords);
    if (moveableAnnotationTools.length > 0) {
        const { tool, annotation } = moveableAnnotationTools[0];
        const action = toolsWithActions.get(tool);
        const method = typeof action.method === 'string' ? tool[action.method] : action.method;
        method.call(tool, evt, annotation);
        return true;
    }
    return false;
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/mouseEventHandlers/mouseDown.js











const { Active: mouseDown_Active, Passive: mouseDown_Passive } = enums.ToolModes;
function mouseDown(evt) {
    if (state/* state */.wk.isInteractingWithTool) {
        return;
    }
    const activeTool = getActiveToolForMouseEvent(evt);
    if (activeTool && typeof activeTool.preMouseDownCallback === 'function') {
        const consumedEvent = activeTool.preMouseDownCallback(evt);
        if (consumedEvent) {
            return;
        }
    }
    const isPrimaryClick = evt.detail.event.buttons === 1;
    const activeToolsWithEventBinding = (0,getToolsWithModesForMouseEvent/* default */.A)(evt, [mouseDown_Active], evt.detail.event.buttons);
    const passiveToolsIfEventWasPrimaryMouseButton = isPrimaryClick
        ? (0,getToolsWithModesForMouseEvent/* default */.A)(evt, [mouseDown_Passive])
        : undefined;
    const applicableTools = [
        ...(activeToolsWithEventBinding || []),
        ...(passiveToolsIfEventWasPrimaryMouseButton || []),
    ];
    const actionExecuted = mouseDownAnnotationAction(evt);
    if (actionExecuted) {
        return;
    }
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const annotationToolsWithAnnotations = (0,filterToolsWithAnnotationsForElement/* default */.A)(element, applicableTools);
    const canvasCoords = eventDetail.currentPoints.canvas;
    const annotationToolsWithMoveableHandles = (0,filterToolsWithMoveableHandles/* default */.A)(element, annotationToolsWithAnnotations, canvasCoords, 'mouse');
    const isMultiSelect = !!evt.detail.event.shiftKey;
    if (annotationToolsWithMoveableHandles.length > 0) {
        const { tool, annotation, handle } = getAnnotationForSelection(annotationToolsWithMoveableHandles);
        toggleAnnotationSelection(annotation.annotationUID, isMultiSelect);
        tool.handleSelectedCallback(evt, annotation, handle, 'Mouse');
        return;
    }
    const moveableAnnotationTools = (0,filterMoveableAnnotationTools/* default */.A)(element, annotationToolsWithAnnotations, canvasCoords, 'mouse');
    if (moveableAnnotationTools.length > 0) {
        const { tool, annotation } = getAnnotationForSelection(moveableAnnotationTools);
        toggleAnnotationSelection(annotation.annotationUID, isMultiSelect);
        tool.toolSelectedCallback(evt, annotation, 'Mouse', canvasCoords);
        return;
    }
    if (activeTool && typeof activeTool.postMouseDownCallback === 'function') {
        const consumedEvent = activeTool.postMouseDownCallback(evt);
        if (consumedEvent) {
            return;
        }
    }
}
function getAnnotationForSelection(toolsWithMovableHandles) {
    if (toolsWithMovableHandles.length > 1) {
        const unlockAndVisibleAnnotation = toolsWithMovableHandles.find((item) => {
            const isUnlocked = !(0,annotationLocking.isAnnotationLocked)(item.annotation.annotationUID);
            const isVisible = (0,annotationVisibility.isAnnotationVisible)(item.annotation.annotationUID);
            return isUnlocked && isVisible;
        });
        if (unlockAndVisibleAnnotation) {
            return unlockAndVisibleAnnotation;
        }
    }
    return toolsWithMovableHandles[0];
}
function toggleAnnotationSelection(annotationUID, isMultiSelect = false) {
    if (isMultiSelect) {
        if ((0,annotationSelection.isAnnotationSelected)(annotationUID)) {
            (0,annotationSelection.setAnnotationSelected)(annotationUID, false);
        }
        else {
            const preserveSelected = true;
            (0,annotationSelection.setAnnotationSelected)(annotationUID, true, preserveSelected);
        }
    }
    else {
        const preserveSelected = false;
        (0,annotationSelection.setAnnotationSelected)(annotationUID, true, preserveSelected);
    }
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/mouseEventHandlers/mouseDownActivate.js



function mouseDownActivate(evt) {
    if (state/* state */.wk.isInteractingWithTool) {
        return;
    }
    const activeTool = getActiveToolForMouseEvent(evt);
    if (!activeTool) {
        return;
    }
    if (state/* state */.wk.isMultiPartToolActive) {
        return;
    }
    if (activeTool.addNewAnnotation) {
        const annotation = activeTool.addNewAnnotation(evt, 'mouse');
        (0,annotationSelection.setAnnotationSelected)(annotation.annotationUID);
    }
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/mouseEventHandlers/mouseDrag.js


function mouseDrag(evt) {
    if (state/* state */.wk.isInteractingWithTool) {
        return;
    }
    const activeTool = getActiveToolForMouseEvent(evt);
    const noFoundToolOrDoesNotHaveMouseDragCallback = !activeTool || typeof activeTool.mouseDragCallback !== 'function';
    if (noFoundToolOrDoesNotHaveMouseDragCallback) {
        return;
    }
    activeTool.mouseDragCallback(evt);
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/triggerAnnotationRender.js
var triggerAnnotationRender = __webpack_require__(56069);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/mouseEventHandlers/mouseMove.js





const { Active: mouseMove_Active, Passive: mouseMove_Passive } = enums.ToolModes;
function mouseMove(evt) {
    if (state/* state */.wk.isInteractingWithTool || state/* state */.wk.isMultiPartToolActive) {
        return;
    }
    const activeAndPassiveTools = (0,getToolsWithModesForMouseEvent/* default */.A)(evt, [
        mouseMove_Active,
        mouseMove_Passive,
    ]);
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const toolsWithAnnotations = (0,filterToolsWithAnnotationsForElement/* default */.A)(element, activeAndPassiveTools);
    const toolsWithoutAnnotations = activeAndPassiveTools.filter((tool) => {
        const doesNotHaveAnnotations = !toolsWithAnnotations.some((toolAndAnnotation) => toolAndAnnotation.tool.getToolName() === tool.getToolName());
        return doesNotHaveAnnotations;
    });
    let annotationsNeedToBeRedrawn = false;
    for (const { tool, annotations } of toolsWithAnnotations) {
        if (typeof tool.mouseMoveCallback === 'function') {
            annotationsNeedToBeRedrawn =
                tool.mouseMoveCallback(evt, annotations) || annotationsNeedToBeRedrawn;
        }
    }
    toolsWithoutAnnotations.forEach((tool) => {
        if (typeof tool.mouseMoveCallback === 'function') {
            tool.mouseMoveCallback(evt);
        }
    });
    if (annotationsNeedToBeRedrawn === true) {
        (0,triggerAnnotationRender/* default */.A)(element);
    }
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/mouseEventHandlers/mouseUp.js

const mouseUp = customCallbackHandler/* default */.A.bind(null, 'Mouse', 'mouseUpCallback');
/* harmony default export */ const mouseEventHandlers_mouseUp = (mouseUp);

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/ToolBindings.js
var ToolBindings = __webpack_require__(66452);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/mouseEventHandlers/mouseWheel.js



function mouseWheel(evt) {
    if (state/* state */.wk.isInteractingWithTool) {
        return;
    }
    evt.detail.buttons =
        ToolBindings/* MouseBindings */.i.Wheel | (evt.detail.event.buttons || 0);
    const activeTool = getActiveToolForMouseEvent(evt);
    if (!activeTool) {
        return;
    }
    return activeTool.mouseWheelCallback(evt);
}
/* harmony default export */ const mouseEventHandlers_mouseWheel = (mouseWheel);

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/mouseEventHandlers/index.js











/***/ }),

/***/ 96198:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ customCallbackHandler)
/* harmony export */ });
/* harmony import */ var _store_state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(85204);
/* harmony import */ var _enums_ToolModes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(49892);
/* harmony import */ var _store_ToolGroupManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(77609);



const { Active } = _enums_ToolModes__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A;
function customCallbackHandler(handlerType, customFunction, evt) {
    if (_store_state__WEBPACK_IMPORTED_MODULE_0__/* .state */ .wk.isInteractingWithTool) {
        return false;
    }
    const { renderingEngineId, viewportId } = evt.detail;
    const toolGroup = (0,_store_ToolGroupManager__WEBPACK_IMPORTED_MODULE_2__.getToolGroupForViewport)(viewportId, renderingEngineId);
    if (!toolGroup) {
        return false;
    }
    let activeTool;
    const toolGroupToolNames = Object.keys(toolGroup.toolOptions);
    for (let j = 0; j < toolGroupToolNames.length; j++) {
        const toolName = toolGroupToolNames[j];
        const tool = toolGroup.toolOptions[toolName];
        const toolInstance = toolGroup.getToolInstance(toolName);
        if (tool.mode === Active &&
            typeof toolInstance[customFunction] === 'function') {
            activeTool = toolGroup.getToolInstance(toolName);
            break;
        }
    }
    if (!activeTool) {
        return;
    }
    activeTool[customFunction](evt);
}


/***/ }),

/***/ 70333:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getToolsWithModesForMouseEvent)
/* harmony export */ });
/* harmony import */ var _store_ToolGroupManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(77609);

function getToolsWithModesForMouseEvent(evt, modesFilter, evtButton) {
    const { renderingEngineId, viewportId } = evt.detail;
    const toolGroup = (0,_store_ToolGroupManager__WEBPACK_IMPORTED_MODULE_0__.getToolGroupForViewport)(viewportId, renderingEngineId);
    if (!toolGroup) {
        return [];
    }
    const enabledTools = [];
    const toolGroupToolNames = Object.keys(toolGroup.toolOptions);
    for (let j = 0; j < toolGroupToolNames.length; j++) {
        const toolName = toolGroupToolNames[j];
        const tool = toolGroup.toolOptions[toolName];
        const correctBinding = evtButton != null &&
            tool.bindings.length &&
            tool.bindings.some((binding) => binding.mouseButton === evtButton);
        if (modesFilter.includes(tool.mode) &&
            (!evtButton || correctBinding)) {
            const toolInstance = toolGroup.getToolInstance(toolName);
            enabledTools.push(toolInstance);
        }
    }
    return enabledTools;
}


/***/ }),

/***/ 84971:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Oz: () => (/* reexport */ touchDrag),
  ls: () => (/* reexport */ touchEventHandlers_touchEnd),
  x5: () => (/* reexport */ touchEventHandlers_touchPress),
  gX: () => (/* reexport */ touchStart),
  $F: () => (/* reexport */ touchStartActivate),
  lI: () => (/* reexport */ touchEventHandlers_touchTap)
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/store/state.js
var state = __webpack_require__(85204);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js + 2 modules
var enums = __webpack_require__(99737);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/annotationSelection.js
var annotationSelection = __webpack_require__(17343);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/annotationLocking.js
var annotationLocking = __webpack_require__(2076);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/annotationVisibility.js
var annotationVisibility = __webpack_require__(29601);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/store/filterToolsWithMoveableHandles.js
var filterToolsWithMoveableHandles = __webpack_require__(35486);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/store/filterToolsWithAnnotationsForElement.js
var filterToolsWithAnnotationsForElement = __webpack_require__(57725);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/store/filterMoveableAnnotationTools.js
var filterMoveableAnnotationTools = __webpack_require__(25972);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/shared/getMouseModifier.js
var getMouseModifier = __webpack_require__(76910);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/eventListeners/index.js + 18 modules
var eventListeners = __webpack_require__(21418);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/store/ToolGroupManager/index.js + 6 modules
var ToolGroupManager = __webpack_require__(77609);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/shared/getActiveToolForTouchEvent.js




const { Active } = enums.ToolModes;
function getActiveToolForTouchEvent(evt) {
    const { renderingEngineId, viewportId } = evt.detail;
    const touchEvent = evt.detail.event;
    const toolGroup = (0,ToolGroupManager.getToolGroupForViewport)(viewportId, renderingEngineId);
    if (!toolGroup) {
        return null;
    }
    const toolGroupToolNames = Object.keys(toolGroup.toolOptions);
    const numTouchPoints = Object.keys(touchEvent.touches).length;
    const modifierKey = (0,getMouseModifier/* default */.A)(touchEvent) || eventListeners/* keyEventListener */.kt.getModifierKey();
    const defaultMousePrimary = toolGroup.getDefaultMousePrimary();
    for (let j = 0; j < toolGroupToolNames.length; j++) {
        const toolName = toolGroupToolNames[j];
        const toolOptions = toolGroup.toolOptions[toolName];
        const correctBinding = toolOptions.bindings.length &&
            toolOptions.bindings.some((binding) => (binding.numTouchPoints === numTouchPoints ||
                (numTouchPoints === 1 &&
                    binding.mouseButton === defaultMousePrimary)) &&
                binding.modifierKey === modifierKey);
        if (toolOptions.mode === Active && correctBinding) {
            return toolGroup.getToolInstance(toolName);
        }
    }
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/shared/getToolsWithModesForTouchEvent.js

function getToolsWithModesForTouchEvent(evt, modesFilter, numTouchPoints) {
    const { renderingEngineId, viewportId } = evt.detail;
    const toolGroup = (0,ToolGroupManager.getToolGroupForViewport)(viewportId, renderingEngineId);
    if (!toolGroup) {
        return [];
    }
    const enabledTools = [];
    const toolGroupToolNames = Object.keys(toolGroup.toolOptions);
    for (let j = 0; j < toolGroupToolNames.length; j++) {
        const toolName = toolGroupToolNames[j];
        const tool = toolGroup.toolOptions[toolName];
        const correctBinding = numTouchPoints != null &&
            tool.bindings.length &&
            tool.bindings.some((binding) => binding.numTouchPoints === numTouchPoints);
        if (modesFilter.includes(tool.mode) &&
            (!numTouchPoints || correctBinding)) {
            const toolInstance = toolGroup.getToolInstance(toolName);
            enabledTools.push(toolInstance);
        }
    }
    return enabledTools;
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/touchEventHandlers/touchStart.js










const { Active: touchStart_Active, Passive } = enums.ToolModes;
function touchStart(evt) {
    if (state/* state */.wk.isInteractingWithTool) {
        return;
    }
    const activeTool = getActiveToolForTouchEvent(evt);
    if (activeTool && typeof activeTool.preTouchStartCallback === 'function') {
        const consumedEvent = activeTool.preTouchStartCallback(evt);
        if (consumedEvent) {
            return;
        }
    }
    const isPrimaryClick = Object.keys(evt.detail.event.touches).length === 1;
    const activeToolsWithEventBinding = getToolsWithModesForTouchEvent(evt, [touchStart_Active], Object.keys(evt.detail.event.touches).length);
    const passiveToolsIfEventWasPrimaryTouchButton = isPrimaryClick
        ? getToolsWithModesForTouchEvent(evt, [Passive])
        : undefined;
    const applicableTools = [
        ...(activeToolsWithEventBinding || []),
        ...(passiveToolsIfEventWasPrimaryTouchButton || []),
        activeTool,
    ];
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const annotationToolsWithAnnotations = (0,filterToolsWithAnnotationsForElement/* default */.A)(element, applicableTools);
    const canvasCoords = eventDetail.currentPoints.canvas;
    const annotationToolsWithMoveableHandles = (0,filterToolsWithMoveableHandles/* default */.A)(element, annotationToolsWithAnnotations, canvasCoords, 'touch');
    const isMultiSelect = false;
    if (annotationToolsWithMoveableHandles.length > 0) {
        const { tool, annotation, handle } = getAnnotationForSelection(annotationToolsWithMoveableHandles);
        toggleAnnotationSelection(annotation.annotationUID, isMultiSelect);
        tool.handleSelectedCallback(evt, annotation, handle, 'Touch');
        return;
    }
    const moveableAnnotationTools = (0,filterMoveableAnnotationTools/* default */.A)(element, annotationToolsWithAnnotations, canvasCoords, 'touch');
    if (moveableAnnotationTools.length > 0) {
        const { tool, annotation } = getAnnotationForSelection(moveableAnnotationTools);
        toggleAnnotationSelection(annotation.annotationUID, isMultiSelect);
        tool.toolSelectedCallback(evt, annotation, 'Touch', canvasCoords);
        return;
    }
    if (activeTool && typeof activeTool.postTouchStartCallback === 'function') {
        const consumedEvent = activeTool.postTouchStartCallback(evt);
        if (consumedEvent) {
            return;
        }
    }
}
function getAnnotationForSelection(toolsWithMovableHandles) {
    return ((toolsWithMovableHandles.length > 1 &&
        toolsWithMovableHandles.find((item) => !(0,annotationLocking.isAnnotationLocked)(item.annotation.annotationUID) &&
            (0,annotationVisibility.isAnnotationVisible)(item.annotation.annotationUID))) ||
        toolsWithMovableHandles[0]);
}
function toggleAnnotationSelection(annotationUID, isMultiSelect = false) {
    if (isMultiSelect) {
        if ((0,annotationSelection.isAnnotationSelected)(annotationUID)) {
            (0,annotationSelection.setAnnotationSelected)(annotationUID, false);
        }
        else {
            const preserveSelected = true;
            (0,annotationSelection.setAnnotationSelected)(annotationUID, true, preserveSelected);
        }
    }
    else {
        const preserveSelected = false;
        (0,annotationSelection.setAnnotationSelected)(annotationUID, true, preserveSelected);
    }
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/touchEventHandlers/touchStartActivate.js



function touchStartActivate(evt) {
    if (state/* state */.wk.isInteractingWithTool) {
        return;
    }
    const activeTool = getActiveToolForTouchEvent(evt);
    if (!activeTool) {
        return;
    }
    if (state/* state */.wk.isMultiPartToolActive) {
        return;
    }
    if (activeTool.addNewAnnotation) {
        const annotation = activeTool.addNewAnnotation(evt, 'touch');
        (0,annotationSelection.setAnnotationSelected)(annotation.annotationUID);
    }
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/touchEventHandlers/touchDrag.js


function touchDrag(evt) {
    if (state/* state */.wk.isInteractingWithTool) {
        return;
    }
    const activeTool = getActiveToolForTouchEvent(evt);
    const noFoundToolOrDoesNotHaveTouchDragCallback = !activeTool || typeof activeTool.touchDragCallback !== 'function';
    if (noFoundToolOrDoesNotHaveTouchDragCallback) {
        return;
    }
    activeTool.touchDragCallback(evt);
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/shared/customCallbackHandler.js
var customCallbackHandler = __webpack_require__(96198);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/touchEventHandlers/touchEnd.js

const touchEnd = customCallbackHandler/* default */.A.bind(null, 'Touch', 'touchEndCallback');
/* harmony default export */ const touchEventHandlers_touchEnd = (touchEnd);

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/touchEventHandlers/touchTap.js

const touchTap = customCallbackHandler/* default */.A.bind(null, 'Touch', 'touchTapCallback');
/* harmony default export */ const touchEventHandlers_touchTap = (touchTap);

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/touchEventHandlers/touchPress.js

const touchPress = customCallbackHandler/* default */.A.bind(null, 'Touch', 'touchPressCallback');
/* harmony default export */ const touchEventHandlers_touchPress = (touchPress);

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventDispatchers/touchEventHandlers/index.js









/***/ }),

/***/ 39595:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _keyDownListener__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(40776);

function enable(element) {
    disable(element);
    element.addEventListener('keydown', _keyDownListener__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Ay);
}
function disable(element) {
    element.removeEventListener('keydown', _keyDownListener__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Ay);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    enable,
    disable,
    getModifierKey: _keyDownListener__WEBPACK_IMPORTED_MODULE_0__/* .getModifierKey */ .vh,
});


/***/ }),

/***/ 40776:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ay: () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   Ud: () => (/* binding */ resetModifierKey),
/* harmony export */   vh: () => (/* binding */ getModifierKey)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _enums_Events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(94021);


const defaultState = {
    renderingEngineId: undefined,
    viewportId: undefined,
    key: undefined,
    keyCode: undefined,
    element: null,
};
let state = {
    renderingEngineId: undefined,
    viewportId: undefined,
    key: undefined,
    keyCode: undefined,
    element: null,
};
function keyListener(evt) {
    state.element = evt.currentTarget;
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(state.element);
    const { renderingEngineId, viewportId } = enabledElement;
    state.renderingEngineId = renderingEngineId;
    state.viewportId = viewportId;
    state.key = evt.key;
    state.keyCode = evt.keyCode;
    evt.preventDefault();
    const eventDetail = {
        renderingEngineId: state.renderingEngineId,
        viewportId: state.viewportId,
        element: state.element,
        key: state.key,
        keyCode: state.keyCode,
    };
    (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.triggerEvent)(eventDetail.element, _enums_Events__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.KEY_DOWN, eventDetail);
    document.addEventListener('keyup', _onKeyUp);
    document.addEventListener('visibilitychange', _onVisibilityChange);
    state.element.removeEventListener('keydown', keyListener);
}
function _onVisibilityChange() {
    document.removeEventListener('visibilitychange', _onVisibilityChange);
    if (document.visibilityState === 'hidden') {
        resetModifierKey();
    }
}
function _onKeyUp(evt) {
    const eventDetail = {
        renderingEngineId: state.renderingEngineId,
        viewportId: state.viewportId,
        element: state.element,
        key: state.key,
        keyCode: state.keyCode,
    };
    document.removeEventListener('keyup', _onKeyUp);
    document.removeEventListener('visibilitychange', _onVisibilityChange);
    state.element.addEventListener('keydown', keyListener);
    state = structuredClone(defaultState);
    (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.triggerEvent)(eventDetail.element, _enums_Events__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.KEY_UP, eventDetail);
}
function getModifierKey() {
    return state.keyCode;
}
function resetModifierKey() {
    state.keyCode = undefined;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (keyListener);


/***/ }),

/***/ 99019:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getMouseEventPoints)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);

function getMouseEventPoints(evt, element) {
    const elementToUse = element || evt.currentTarget;
    const { viewport } = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(elementToUse) || {};
    if (!viewport) {
        return;
    }
    const clientPoint = _clientToPoint(evt);
    const pagePoint = _pageToPoint(evt);
    const canvasPoint = _pagePointsToCanvasPoints(elementToUse, pagePoint);
    const worldPoint = viewport.canvasToWorld(canvasPoint);
    return {
        page: pagePoint,
        client: clientPoint,
        canvas: canvasPoint,
        world: worldPoint,
    };
}
function _pagePointsToCanvasPoints(element, pagePoint) {
    const rect = element.getBoundingClientRect();
    return [
        pagePoint[0] - rect.left - window.pageXOffset,
        pagePoint[1] - rect.top - window.pageYOffset,
    ];
}
function _pageToPoint(evt) {
    return [evt.pageX, evt.pageY];
}
function _clientToPoint(evt) {
    return [evt.clientX, evt.clientY];
}


/***/ }),

/***/ 91099:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _enums_Events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(94021);
/* harmony import */ var _getMouseEventPoints__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(99019);



function mouseDoubleClickListener(evt) {
    const element = evt.currentTarget;
    const { viewportId, renderingEngineId } = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
    const startPoints = (0,_getMouseEventPoints__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)(evt, element);
    const deltaPoints = {
        page: [0, 0],
        client: [0, 0],
        canvas: [0, 0],
        world: [0, 0, 0],
    };
    const eventDetail = {
        event: evt,
        eventName: _enums_Events__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.MOUSE_DOUBLE_CLICK,
        viewportId,
        renderingEngineId,
        camera: {},
        element,
        startPoints,
        lastPoints: startPoints,
        currentPoints: startPoints,
        deltaPoints,
    };
    const consumed = !(0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.triggerEvent)(element, _enums_Events__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.MOUSE_DOUBLE_CLICK, eventDetail);
    if (consumed) {
        evt.stopImmediatePropagation();
        evt.preventDefault();
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mouseDoubleClickListener);


/***/ }),

/***/ 68014:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ay: () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   DF: () => (/* binding */ mouseDoubleClickIgnoreListener),
/* harmony export */   kg: () => (/* binding */ getMouseButton)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _enums_Events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(94021);
/* harmony import */ var _mouseMoveListener__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(41343);
/* harmony import */ var _getMouseEventPoints__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(99019);




const { MOUSE_DOWN, MOUSE_DOWN_ACTIVATE, MOUSE_CLICK, MOUSE_UP, MOUSE_DRAG } = _enums_Events__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A;
const DOUBLE_CLICK_TOLERANCE_MS = 400;
const MULTI_BUTTON_TOLERANCE_MS = 150;
const DOUBLE_CLICK_DRAG_TOLERANCE = 3;
const defaultState = {
    mouseButton: undefined,
    element: null,
    renderingEngineId: undefined,
    viewportId: undefined,
    isClickEvent: true,
    clickDelay: 200,
    preventClickTimeout: null,
    startPoints: {
        page: [0, 0],
        client: [0, 0],
        canvas: [0, 0],
        world: [0, 0, 0],
    },
    lastPoints: {
        page: [0, 0],
        client: [0, 0],
        canvas: [0, 0],
        world: [0, 0, 0],
    },
};
let state = {
    mouseButton: undefined,
    renderingEngineId: undefined,
    viewportId: undefined,
    isClickEvent: true,
    clickDelay: 200,
    element: null,
    preventClickTimeout: null,
    startPoints: {
        page: [0, 0],
        client: [0, 0],
        canvas: [0, 0],
        world: [0, 0, 0],
    },
    lastPoints: {
        page: [0, 0],
        client: [0, 0],
        canvas: [0, 0],
        world: [0, 0, 0],
    },
};
const doubleClickState = {
    doubleClickTimeout: null,
    mouseDownEvent: null,
    mouseUpEvent: null,
    ignoreDoubleClick: false,
};
function mouseDownListener(evt) {
    if (doubleClickState.doubleClickTimeout) {
        if (evt.buttons === doubleClickState.mouseDownEvent.buttons) {
            return;
        }
        doubleClickState.mouseDownEvent = evt;
        _doStateMouseDownAndUp();
        return;
    }
    doubleClickState.doubleClickTimeout = setTimeout(_doStateMouseDownAndUp, evt.buttons === 1 ? DOUBLE_CLICK_TOLERANCE_MS : MULTI_BUTTON_TOLERANCE_MS);
    doubleClickState.mouseDownEvent = evt;
    doubleClickState.ignoreDoubleClick = false;
    state.element = evt.currentTarget;
    state.mouseButton = evt.buttons;
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(state.element);
    const { renderingEngineId, viewportId } = enabledElement;
    state.renderingEngineId = renderingEngineId;
    state.viewportId = viewportId;
    state.preventClickTimeout = setTimeout(_preventClickHandler, state.clickDelay);
    state.element.removeEventListener('mousemove', _mouseMoveListener__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A);
    const startPoints = (0,_getMouseEventPoints__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)(evt, state.element);
    state.startPoints = _copyPoints(startPoints);
    state.lastPoints = _copyPoints(startPoints);
    document.addEventListener('mouseup', _onMouseUp);
    document.addEventListener('mousemove', _onMouseDrag);
}
function _doMouseDown(evt) {
    const deltaPoints = _getDeltaPoints(state.startPoints, state.startPoints);
    const eventDetail = {
        event: evt,
        eventName: MOUSE_DOWN,
        element: state.element,
        mouseButton: state.mouseButton,
        renderingEngineId: state.renderingEngineId,
        viewportId: state.viewportId,
        camera: {},
        startPoints: state.startPoints,
        lastPoints: state.startPoints,
        currentPoints: state.startPoints,
        deltaPoints,
    };
    state.lastPoints = _copyPoints(eventDetail.lastPoints);
    const notConsumed = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.triggerEvent)(eventDetail.element, MOUSE_DOWN, eventDetail);
    if (notConsumed) {
        (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.triggerEvent)(eventDetail.element, MOUSE_DOWN_ACTIVATE, eventDetail);
    }
}
function _onMouseDrag(evt) {
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(state.element);
    if (!enabledElement?.viewport) {
        return;
    }
    const currentPoints = (0,_getMouseEventPoints__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)(evt, state.element);
    const lastPoints = _updateMouseEventsLastPoints(state.element, state.lastPoints);
    const deltaPoints = _getDeltaPoints(currentPoints, lastPoints);
    if (doubleClickState.doubleClickTimeout) {
        if (_isDragPastDoubleClickTolerance(deltaPoints.canvas)) {
            _doStateMouseDownAndUp();
        }
        else {
            return;
        }
    }
    const eventDetail = {
        event: evt,
        eventName: MOUSE_DRAG,
        mouseButton: state.mouseButton,
        renderingEngineId: state.renderingEngineId,
        viewportId: state.viewportId,
        camera: {},
        element: state.element,
        startPoints: _copyPoints(state.startPoints),
        lastPoints: _copyPoints(lastPoints),
        currentPoints,
        deltaPoints,
    };
    const consumed = !(0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.triggerEvent)(state.element, MOUSE_DRAG, eventDetail);
    if (consumed) {
        evt.stopImmediatePropagation();
        evt.preventDefault();
    }
    state.lastPoints = _copyPoints(currentPoints);
}
function _onMouseUp(evt) {
    clearTimeout(state.preventClickTimeout);
    if (doubleClickState.doubleClickTimeout) {
        if (!doubleClickState.mouseUpEvent) {
            doubleClickState.mouseUpEvent = evt;
            state.element.addEventListener('mousemove', _onMouseMove);
        }
        else {
            _cleanUp();
        }
    }
    else {
        const eventName = state.isClickEvent ? MOUSE_CLICK : MOUSE_UP;
        const currentPoints = (0,_getMouseEventPoints__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)(evt, state.element);
        const deltaPoints = _getDeltaPoints(currentPoints, state.lastPoints);
        const eventDetail = {
            event: evt,
            eventName,
            mouseButton: state.mouseButton,
            element: state.element,
            renderingEngineId: state.renderingEngineId,
            viewportId: state.viewportId,
            camera: {},
            startPoints: _copyPoints(state.startPoints),
            lastPoints: _copyPoints(state.lastPoints),
            currentPoints,
            deltaPoints,
        };
        (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.triggerEvent)(eventDetail.element, eventName, eventDetail);
        _cleanUp();
    }
    document.removeEventListener('mousemove', _onMouseDrag);
}
function _onMouseMove(evt) {
    const currentPoints = (0,_getMouseEventPoints__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)(evt, state.element);
    const lastPoints = _updateMouseEventsLastPoints(state.element, state.lastPoints);
    const deltaPoints = _getDeltaPoints(currentPoints, lastPoints);
    if (!_isDragPastDoubleClickTolerance(deltaPoints.canvas)) {
        return;
    }
    _doStateMouseDownAndUp();
    (0,_mouseMoveListener__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)(evt);
}
function _isDragPastDoubleClickTolerance(delta) {
    return Math.abs(delta[0]) + Math.abs(delta[1]) > DOUBLE_CLICK_DRAG_TOLERANCE;
}
function _preventClickHandler() {
    state.isClickEvent = false;
}
function _doStateMouseDownAndUp() {
    doubleClickState.ignoreDoubleClick = true;
    const mouseDownEvent = doubleClickState.mouseDownEvent;
    const mouseUpEvent = doubleClickState.mouseUpEvent;
    _clearDoubleClickTimeoutAndEvents();
    _doMouseDown(mouseDownEvent);
    if (mouseUpEvent) {
        _onMouseUp(mouseUpEvent);
    }
}
function _clearDoubleClickTimeoutAndEvents() {
    if (doubleClickState.doubleClickTimeout) {
        clearTimeout(doubleClickState.doubleClickTimeout);
        doubleClickState.doubleClickTimeout = null;
    }
    doubleClickState.mouseDownEvent = null;
    doubleClickState.mouseUpEvent = null;
}
function _cleanUp() {
    document.removeEventListener('mouseup', _onMouseUp);
    state.element?.removeEventListener('mousemove', _onMouseMove);
    state.element?.addEventListener('mousemove', _mouseMoveListener__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A);
    _clearDoubleClickTimeoutAndEvents();
    state = JSON.parse(JSON.stringify(defaultState));
}
function _copyPoints(points) {
    return JSON.parse(JSON.stringify(points));
}
function _updateMouseEventsLastPoints(element, lastPoints) {
    const { viewport } = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element) || {};
    if (!viewport) {
        return lastPoints;
    }
    const world = viewport.canvasToWorld(lastPoints.canvas);
    return {
        page: lastPoints.page,
        client: lastPoints.client,
        canvas: lastPoints.canvas,
        world,
    };
}
function _getDeltaPoints(currentPoints, lastPoints) {
    if (!currentPoints || !lastPoints) {
        return {
            page: [0, 0],
            client: [0, 0],
            canvas: [0, 0],
            world: [0, 0, 0],
        };
    }
    return {
        page: _subtractPoints2D(currentPoints.page, lastPoints.page),
        client: _subtractPoints2D(currentPoints.client, lastPoints.client),
        canvas: _subtractPoints2D(currentPoints.canvas, lastPoints.canvas),
        world: _subtractPoints3D(currentPoints.world, lastPoints.world),
    };
}
function _subtractPoints2D(point0, point1) {
    return [point0[0] - point1[0], point0[1] - point1[1]];
}
function _subtractPoints3D(point0, point1) {
    return [point0[0] - point1[0], point0[1] - point1[1], point0[2] - point1[2]];
}
function getMouseButton() {
    return state.mouseButton;
}
function mouseDoubleClickIgnoreListener(evt) {
    if (doubleClickState.ignoreDoubleClick) {
        doubleClickState.ignoreDoubleClick = false;
        evt.stopImmediatePropagation();
        evt.preventDefault();
    }
    else {
        _cleanUp();
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mouseDownListener);


/***/ }),

/***/ 41343:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _enums_Events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(94021);
/* harmony import */ var _getMouseEventPoints__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(99019);



const eventName = _enums_Events__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.MOUSE_MOVE;
function mouseMoveListener(evt) {
    const element = evt.currentTarget;
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
    if (!enabledElement) {
        return;
    }
    const { renderingEngineId, viewportId } = enabledElement;
    const currentPoints = (0,_getMouseEventPoints__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)(evt);
    const eventDetail = {
        renderingEngineId,
        viewportId,
        camera: {},
        element,
        currentPoints,
        eventName,
        event: evt,
    };
    const consumed = !(0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.triggerEvent)(element, eventName, eventDetail);
    if (consumed) {
        evt.stopImmediatePropagation();
        evt.preventDefault();
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mouseMoveListener);


/***/ }),

/***/ 41666:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const antiGhostDelay = 2000, pointerType = {
    mouse: 0,
    touch: 1,
};
let lastInteractionType, lastInteractionTime;
function handleTap(type, e) {
    const now = Date.now();
    if (type !== lastInteractionType) {
        if (now - lastInteractionTime <= antiGhostDelay) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        }
        lastInteractionType = type;
    }
    lastInteractionTime = now;
}
const handleTapMouse = handleTap.bind(null, pointerType.mouse);
const handleTapTouch = handleTap.bind(null, pointerType.touch);
function attachEvents(element, eventList, interactionType) {
    const tapHandler = interactionType ? handleTapMouse : handleTapTouch;
    eventList.forEach(function (eventName) {
        element.addEventListener(eventName, tapHandler, { passive: false });
    });
}
function removeEvents(element, eventList, interactionType) {
    const tapHandler = interactionType ? handleTapMouse : handleTapTouch;
    eventList.forEach(function (eventName) {
        element.removeEventListener(eventName, tapHandler);
    });
}
const mouseEvents = ['mousedown', 'mouseup', 'mousemove'];
const touchEvents = ['touchstart', 'touchend'];
function disable(element) {
    removeEvents(element, mouseEvents, pointerType.mouse);
    removeEvents(element, touchEvents, pointerType.touch);
}
function enable(element) {
    disable(element);
    attachEvents(element, mouseEvents, pointerType.mouse);
    attachEvents(element, touchEvents, pointerType.touch);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    enable,
    disable,
});


/***/ }),

/***/ 82603:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ touch_touchStartListener)
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/Events.js
var Events = __webpack_require__(94021);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/Touch.js
var Touch = __webpack_require__(10401);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventListeners/touch/getTouchEventPoints.js

function getTouchEventPoints(evt, element) {
    const elementToUse = element || evt.currentTarget;
    const touches = evt.type === 'touchend' ? evt.changedTouches : evt.touches;
    return Object.keys(touches).map((i) => {
        const clientPoint = _clientToPoint(touches[i]);
        const pagePoint = _pageToPoint(touches[i]);
        const canvasPoint = _pagePointsToCanvasPoints(elementToUse, pagePoint);
        const { viewport } = (0,esm.getEnabledElement)(elementToUse);
        const worldPoint = viewport.canvasToWorld(canvasPoint);
        return {
            page: pagePoint,
            client: clientPoint,
            canvas: canvasPoint,
            world: worldPoint,
            touch: {
                identifier: i,
                radiusX: touches[i].radiusX,
                radiusY: touches[i].radiusY,
                force: touches[i].force,
                rotationAngle: touches[i].rotationAngle,
            },
        };
    });
}
function _pagePointsToCanvasPoints(element, pagePoint) {
    const rect = element.getBoundingClientRect();
    return [
        pagePoint[0] - rect.left - window.pageXOffset,
        pagePoint[1] - rect.top - window.pageYOffset,
    ];
}
function _pageToPoint(touch) {
    return [touch.pageX, touch.pageY];
}
function _clientToPoint(touch) {
    return [touch.clientX, touch.clientY];
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/touch/index.js
var touch = __webpack_require__(76260);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventListeners/touch/touchStartListener.js






const runtimeSettings = esm.Settings.getRuntimeSettings();
const { TOUCH_START, TOUCH_START_ACTIVATE, TOUCH_PRESS, TOUCH_DRAG, TOUCH_END, TOUCH_TAP, TOUCH_SWIPE, } = Events/* default */.A;
const zeroIPoint = {
    page: [0, 0],
    client: [0, 0],
    canvas: [0, 0],
    world: [0, 0, 0],
};
const zeroIDistance = {
    page: 0,
    client: 0,
    canvas: 0,
    world: 0,
};
const defaultState = {
    renderingEngineId: undefined,
    viewportId: undefined,
    element: null,
    startPointsList: [
        {
            ...zeroIPoint,
            touch: null,
        },
    ],
    lastPointsList: [
        {
            ...zeroIPoint,
            touch: null,
        },
    ],
    isTouchStart: false,
    startTime: null,
    pressTimeout: null,
    pressDelay: 700,
    pressMaxDistance: 5,
    accumulatedDistance: zeroIDistance,
    swipeDistanceThreshold: 48,
    swiped: false,
    swipeToleranceMs: 300,
};
const defaultTapState = {
    renderingEngineId: undefined,
    viewportId: undefined,
    element: null,
    startPointsList: [
        {
            ...zeroIPoint,
            touch: null,
        },
    ],
    taps: 0,
    tapTimeout: null,
    tapMaxDistance: 24,
    tapToleranceMs: 300,
};
let state = JSON.parse(JSON.stringify(defaultState));
let tapState = JSON.parse(JSON.stringify(defaultTapState));
function triggerEventCallback(ele, name, eventDetail) {
    return (0,esm.triggerEvent)(ele, name, eventDetail);
}
function touchStartListener(evt) {
    state.element = evt.currentTarget;
    const enabledElement = (0,esm.getEnabledElement)(state.element);
    const { renderingEngineId, viewportId } = enabledElement;
    state.renderingEngineId = renderingEngineId;
    state.viewportId = viewportId;
    if (state.isTouchStart) {
        return;
    }
    clearTimeout(state.pressTimeout);
    state.pressTimeout = setTimeout(() => _onTouchPress(evt), state.pressDelay);
    _onTouchStart(evt);
    document.addEventListener('touchmove', _onTouchDrag);
    document.addEventListener('touchend', _onTouchEnd);
}
function _onTouchPress(evt) {
    const totalDistance = state.accumulatedDistance.canvas;
    if (totalDistance > state.pressMaxDistance) {
        return;
    }
    const eventDetail = {
        event: evt,
        eventName: TOUCH_PRESS,
        renderingEngineId: state.renderingEngineId,
        viewportId: state.viewportId,
        camera: {},
        element: state.element,
        startPointsList: (0,touch.copyPointsList)(state.startPointsList),
        lastPointsList: (0,touch.copyPointsList)(state.lastPointsList),
        startPoints: (0,touch.copyPoints)((0,touch.getMeanTouchPoints)(state.startPointsList)),
        lastPoints: (0,touch.copyPoints)((0,touch.getMeanTouchPoints)(state.lastPointsList)),
    };
    triggerEventCallback(eventDetail.element, TOUCH_PRESS, eventDetail);
}
function _onTouchStart(evt) {
    state.isTouchStart = true;
    state.startTime = new Date();
    const startPointsList = getTouchEventPoints(evt, state.element);
    const startPoints = (0,touch.getMeanTouchPoints)(startPointsList);
    const deltaPoints = zeroIPoint;
    const deltaDistance = zeroIDistance;
    const eventDetail = {
        event: evt,
        eventName: TOUCH_START,
        element: state.element,
        renderingEngineId: state.renderingEngineId,
        viewportId: state.viewportId,
        camera: {},
        startPointsList: startPointsList,
        lastPointsList: startPointsList,
        currentPointsList: startPointsList,
        startPoints: startPoints,
        lastPoints: startPoints,
        currentPoints: startPoints,
        deltaPoints,
        deltaDistance,
    };
    state.startPointsList = (0,touch.copyPointsList)(eventDetail.startPointsList);
    state.lastPointsList = (0,touch.copyPointsList)(eventDetail.lastPointsList);
    const eventDidPropagate = triggerEventCallback(eventDetail.element, TOUCH_START, eventDetail);
    if (eventDidPropagate) {
        triggerEventCallback(eventDetail.element, TOUCH_START_ACTIVATE, eventDetail);
    }
}
function _onTouchDrag(evt) {
    const currentPointsList = getTouchEventPoints(evt, state.element);
    const lastPointsList = _updateTouchEventsLastPoints(state.element, state.lastPointsList);
    const deltaPoints = currentPointsList.length === lastPointsList.length
        ? (0,touch.getDeltaPoints)(currentPointsList, lastPointsList)
        : zeroIPoint;
    const deltaDistance = currentPointsList.length === lastPointsList.length
        ? (0,touch.getDeltaDistanceBetweenIPoints)(currentPointsList, lastPointsList)
        : zeroIDistance;
    const totalDistance = currentPointsList.length === lastPointsList.length
        ? (0,touch.getDeltaDistance)(currentPointsList, state.lastPointsList)
        : zeroIDistance;
    state.accumulatedDistance = {
        page: state.accumulatedDistance.page + totalDistance.page,
        client: state.accumulatedDistance.client + totalDistance.client,
        canvas: state.accumulatedDistance.canvas + totalDistance.canvas,
        world: state.accumulatedDistance.world + totalDistance.world,
    };
    const eventDetail = {
        event: evt,
        eventName: TOUCH_DRAG,
        renderingEngineId: state.renderingEngineId,
        viewportId: state.viewportId,
        camera: {},
        element: state.element,
        startPoints: (0,touch.getMeanTouchPoints)(state.startPointsList),
        lastPoints: (0,touch.getMeanTouchPoints)(lastPointsList),
        currentPoints: (0,touch.getMeanTouchPoints)(currentPointsList),
        startPointsList: (0,touch.copyPointsList)(state.startPointsList),
        lastPointsList: (0,touch.copyPointsList)(lastPointsList),
        currentPointsList,
        deltaPoints: deltaPoints,
        deltaDistance: deltaDistance,
    };
    triggerEventCallback(state.element, TOUCH_DRAG, eventDetail);
    _checkTouchSwipe(evt, deltaPoints);
    state.lastPointsList = (0,touch.copyPointsList)(currentPointsList);
}
function _onTouchEnd(evt) {
    clearTimeout(state.pressTimeout);
    const currentPointsList = getTouchEventPoints(evt, state.element);
    const lastPointsList = _updateTouchEventsLastPoints(state.element, state.lastPointsList);
    const deltaPoints = currentPointsList.length === lastPointsList.length
        ? (0,touch.getDeltaPoints)(currentPointsList, lastPointsList)
        : (0,touch.getDeltaPoints)(currentPointsList, currentPointsList);
    const deltaDistance = currentPointsList.length === lastPointsList.length
        ? (0,touch.getDeltaDistanceBetweenIPoints)(currentPointsList, lastPointsList)
        : (0,touch.getDeltaDistanceBetweenIPoints)(currentPointsList, currentPointsList);
    const eventDetail = {
        event: evt,
        eventName: TOUCH_END,
        element: state.element,
        renderingEngineId: state.renderingEngineId,
        viewportId: state.viewportId,
        camera: {},
        startPointsList: (0,touch.copyPointsList)(state.startPointsList),
        lastPointsList: (0,touch.copyPointsList)(lastPointsList),
        currentPointsList,
        startPoints: (0,touch.getMeanTouchPoints)(state.startPointsList),
        lastPoints: (0,touch.getMeanTouchPoints)(lastPointsList),
        currentPoints: (0,touch.getMeanTouchPoints)(currentPointsList),
        deltaPoints,
        deltaDistance,
    };
    triggerEventCallback(eventDetail.element, TOUCH_END, eventDetail);
    _checkTouchTap(evt);
    state = JSON.parse(JSON.stringify(defaultState));
    document.removeEventListener('touchmove', _onTouchDrag);
    document.removeEventListener('touchend', _onTouchEnd);
}
function _checkTouchTap(evt) {
    const currentTime = new Date().getTime();
    const startTime = state.startTime.getTime();
    if (currentTime - startTime > tapState.tapToleranceMs) {
        return;
    }
    if (tapState.taps === 0) {
        tapState.element = state.element;
        tapState.renderingEngineId = state.renderingEngineId;
        tapState.viewportId = state.viewportId;
        tapState.startPointsList = state.startPointsList;
    }
    if (tapState.taps > 0 &&
        !(tapState.element == state.element &&
            tapState.renderingEngineId == state.renderingEngineId &&
            tapState.viewportId == state.viewportId)) {
        return;
    }
    const currentPointsList = getTouchEventPoints(evt, tapState.element);
    const distanceFromStart = (0,touch.getDeltaDistance)(currentPointsList, tapState.startPointsList).canvas;
    if (distanceFromStart > tapState.tapMaxDistance) {
        return;
    }
    clearTimeout(tapState.tapTimeout);
    tapState.taps += 1;
    tapState.tapTimeout = setTimeout(() => {
        const eventDetail = {
            event: evt,
            eventName: TOUCH_TAP,
            element: tapState.element,
            renderingEngineId: tapState.renderingEngineId,
            viewportId: tapState.viewportId,
            camera: {},
            currentPointsList,
            currentPoints: (0,touch.getMeanTouchPoints)(currentPointsList),
            taps: tapState.taps,
        };
        triggerEventCallback(eventDetail.element, TOUCH_TAP, eventDetail);
        tapState = JSON.parse(JSON.stringify(defaultTapState));
    }, tapState.tapToleranceMs);
}
function _checkTouchSwipe(evt, deltaPoints) {
    const currentTime = new Date().getTime();
    const startTime = state.startTime.getTime();
    if (state.swiped || currentTime - startTime > state.swipeToleranceMs) {
        return;
    }
    const [x, y] = deltaPoints.canvas;
    const eventDetail = {
        event: evt,
        eventName: TOUCH_SWIPE,
        renderingEngineId: state.renderingEngineId,
        viewportId: state.viewportId,
        camera: {},
        element: state.element,
        swipe: null,
    };
    if (Math.abs(x) > state.swipeDistanceThreshold) {
        eventDetail.swipe = x > 0 ? Touch/* Swipe */.H.RIGHT : Touch/* Swipe */.H.LEFT;
        triggerEventCallback(eventDetail.element, TOUCH_SWIPE, eventDetail);
        state.swiped = true;
    }
    if (Math.abs(y) > state.swipeDistanceThreshold) {
        eventDetail.swipe = y > 0 ? Touch/* Swipe */.H.DOWN : Touch/* Swipe */.H.UP;
        triggerEventCallback(eventDetail.element, TOUCH_SWIPE, eventDetail);
        state.swiped = true;
    }
}
function _updateTouchEventsLastPoints(element, lastPoints) {
    const { viewport } = (0,esm.getEnabledElement)(element);
    return lastPoints.map((lp) => {
        const world = viewport.canvasToWorld(lp.canvas);
        return {
            page: lp.page,
            client: lp.client,
            canvas: lp.canvas,
            world,
            touch: lp.touch,
        };
    });
}
/* harmony default export */ const touch_touchStartListener = (touchStartListener);


/***/ }),

/***/ 17806:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ wheel_wheelListener)
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventListeners/wheel/normalizeWheel.js
const PIXEL_STEP = 10;
const LINE_HEIGHT = 40;
const PAGE_HEIGHT = 800;
function normalizeWheel(event) {
    let spinX = 0, spinY = 0, pixelX = 0, pixelY = 0;
    if ('detail' in event) {
        spinY = event.detail;
    }
    if ('wheelDelta' in event) {
        spinY = -event.wheelDelta / 120;
    }
    if ('wheelDeltaY' in event) {
        spinY = -event.wheelDeltaY / 120;
    }
    if ('wheelDeltaX' in event) {
        spinX = -event.wheelDeltaX / 120;
    }
    pixelX = spinX * PIXEL_STEP;
    pixelY = spinY * PIXEL_STEP;
    if ('deltaY' in event) {
        pixelY = event.deltaY;
    }
    if ('deltaX' in event) {
        pixelX = event.deltaX;
    }
    if ((pixelX || pixelY) && event.deltaMode) {
        if (event.deltaMode === 1) {
            pixelX *= LINE_HEIGHT;
            pixelY *= LINE_HEIGHT;
        }
        else {
            pixelX *= PAGE_HEIGHT;
            pixelY *= PAGE_HEIGHT;
        }
    }
    if (pixelX && !spinX) {
        spinX = pixelX < 1 ? -1 : 1;
    }
    if (pixelY && !spinY) {
        spinY = pixelY < 1 ? -1 : 1;
    }
    return {
        spinX,
        spinY,
        pixelX,
        pixelY,
    };
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/Events.js
var Events = __webpack_require__(94021);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/eventListeners/mouse/getMouseEventPoints.js
var getMouseEventPoints = __webpack_require__(99019);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/eventListeners/wheel/wheelListener.js




function wheelListener(evt) {
    const element = evt.currentTarget;
    const enabledElement = (0,esm.getEnabledElement)(element);
    const { renderingEngineId, viewportId } = enabledElement;
    if (evt.deltaY > -1 && evt.deltaY < 1) {
        return;
    }
    evt.preventDefault();
    const { spinX, spinY, pixelX, pixelY } = normalizeWheel(evt);
    const direction = spinY < 0 ? -1 : 1;
    const eventDetail = {
        event: evt,
        eventName: Events/* default */.A.MOUSE_WHEEL,
        renderingEngineId,
        viewportId,
        element,
        camera: {},
        detail: evt,
        wheel: {
            spinX,
            spinY,
            pixelX,
            pixelY,
            direction,
        },
        points: (0,getMouseEventPoints/* default */.A)(evt),
    };
    (0,esm.triggerEvent)(element, Events/* default */.A.MOUSE_WHEEL, eventDetail);
}
/* harmony default export */ const wheel_wheelListener = (wheelListener);


/***/ }),

/***/ 6802:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   O8: () => (/* reexport safe */ _annotation_annotationState__WEBPACK_IMPORTED_MODULE_3__.removeAnnotation),
/* harmony export */   Rh: () => (/* reexport safe */ _annotation_annotationState__WEBPACK_IMPORTED_MODULE_3__.getAnnotations),
/* harmony export */   gw: () => (/* reexport safe */ _annotation_annotationState__WEBPACK_IMPORTED_MODULE_3__.getAnnotation),
/* harmony export */   lC: () => (/* reexport safe */ _annotation_annotationState__WEBPACK_IMPORTED_MODULE_3__.addAnnotation)
/* harmony export */ });
/* harmony import */ var _annotation_FrameOfReferenceSpecificAnnotationManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67013);
/* harmony import */ var _annotation_annotationLocking__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2076);
/* harmony import */ var _annotation_annotationSelection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(17343);
/* harmony import */ var _annotation_annotationState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(82056);
/* harmony import */ var _annotation_resetAnnotationManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(97);








/***/ }),

/***/ 6273:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   p: () => (/* binding */ convertStackToVolumeLabelmap)
/* harmony export */ });
/* harmony import */ var _SegmentationStateManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(59475);
/* harmony import */ var _triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(49906);


async function convertStackToVolumeLabelmap(args) {
    const result = (0,_SegmentationStateManager__WEBPACK_IMPORTED_MODULE_0__/* .internalConvertStackToVolumeLabelmap */ .cC)(args);
    (0,_triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_1__.triggerSegmentationModified)(args.segmentationId);
    return result;
}


/***/ }),

/***/ 98149:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   X: () => (/* binding */ updateStackSegmentationState)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(99737);
/* harmony import */ var _getSegmentation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(33283);
/* harmony import */ var _triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(49906);
/* harmony import */ var _addSegmentationRepresentationsToViewport__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(74283);





async function updateStackSegmentationState({ segmentationId, viewportId, imageIds, options, }) {
    const segmentation = (0,_getSegmentation__WEBPACK_IMPORTED_MODULE_2__/* .getSegmentation */ .T)(segmentationId);
    if (options?.removeOriginal) {
        const data = segmentation.representationData
            .Labelmap;
        if (_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.cache.getVolume(data.volumeId)) {
            _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.cache.removeVolumeLoadObject(data.volumeId);
        }
        segmentation.representationData.Labelmap = {
            imageIds,
        };
    }
    else {
        segmentation.representationData.Labelmap = {
            ...segmentation.representationData.Labelmap,
            imageIds,
        };
    }
    await (0,_addSegmentationRepresentationsToViewport__WEBPACK_IMPORTED_MODULE_4__/* .addSegmentationRepresentations */ .gR)(viewportId, [
        {
            segmentationId,
            type: _enums__WEBPACK_IMPORTED_MODULE_1__.SegmentationRepresentations.Labelmap,
        },
    ]);
    _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.eventTarget.addEventListenerOnce(_enums__WEBPACK_IMPORTED_MODULE_1__.Events.SEGMENTATION_RENDERED, () => (0,_triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_3__.triggerSegmentationDataModified)(segmentationId));
}


/***/ }),

/***/ 25972:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ filterMoveableAnnotationTools)
/* harmony export */ });
function filterMoveableAnnotationTools(element, ToolAndAnnotations, canvasCoords, interactionType = 'mouse') {
    const proximity = interactionType === 'touch' ? 36 : 6;
    const moveableAnnotationTools = [];
    ToolAndAnnotations.forEach(({ tool, annotations }) => {
        for (const annotation of annotations) {
            if (annotation.isLocked || !annotation.isVisible) {
                continue;
            }
            const near = tool.isPointNearTool(element, annotation, canvasCoords, proximity, interactionType);
            if (near) {
                moveableAnnotationTools.push({
                    tool,
                    annotation,
                });
                break;
            }
        }
    });
    return moveableAnnotationTools;
}


/***/ }),

/***/ 57725:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ filterToolsWithAnnotationsForElement)
/* harmony export */ });
/* harmony import */ var _stateManagement_annotation_annotationState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(82056);

function filterToolsWithAnnotationsForElement(element, tools) {
    const result = [];
    for (let i = 0; i < tools.length; i++) {
        const tool = tools[i];
        if (!tool) {
            console.warn('undefined tool in filterToolsWithAnnotationsForElement');
            continue;
        }
        let annotations = (0,_stateManagement_annotation_annotationState__WEBPACK_IMPORTED_MODULE_0__.getAnnotations)(tool.constructor.toolName, element);
        if (!annotations?.length) {
            continue;
        }
        if (typeof tool.filterInteractableAnnotationsForElement === 'function') {
            annotations = tool.filterInteractableAnnotationsForElement(element, annotations);
        }
        if (annotations?.length > 0) {
            result.push({ tool, annotations });
        }
    }
    return result;
}


/***/ }),

/***/ 35486:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ filterToolsWithMoveableHandles)
/* harmony export */ });
function filterToolsWithMoveableHandles(element, ToolAndAnnotations, canvasCoords, interactionType = 'mouse') {
    const proximity = interactionType === 'touch' ? 36 : 6;
    const toolsWithMoveableHandles = [];
    ToolAndAnnotations.forEach(({ tool, annotations }) => {
        for (const annotation of annotations) {
            if (annotation.isLocked || !annotation.isVisible) {
                continue;
            }
            const handle = tool.getHandleNearImagePoint(element, annotation, canvasCoords, proximity);
            if (handle) {
                toolsWithMoveableHandles.push({
                    tool,
                    annotation,
                    handle,
                });
                break;
            }
        }
    });
    return toolsWithMoveableHandles;
}


/***/ }),

/***/ 16175:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15327);
/* harmony import */ var _distancePointToContour__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(13271);
/* harmony import */ var _drawingSvg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(74347);
/* harmony import */ var _utilities_math__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(95527);





class CircleSculptCursor {
    constructor() {
        this.toolInfo = {
            toolSize: null,
            maxToolSize: null,
        };
    }
    static { this.shapeName = 'Circle'; }
    static { this.CHAIN_MAINTENANCE_ITERATIONS = 3; }
    static { this.CHAIN_PULL_STRENGTH_FACTOR = 0.3; }
    static { this.MAX_INTER_DISTANCE_FACTOR = 1.2; }
    renderShape(svgDrawingHelper, canvasLocation, options) {
        const circleUID = '0';
        (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_3__.drawCircle)(svgDrawingHelper, 'SculptorTool', circleUID, canvasLocation, this.toolInfo.toolSize, options);
    }
    pushHandles(viewport, sculptData) {
        const { points, mouseCanvasPoint } = sculptData;
        const pushedHandles = { first: undefined, last: undefined };
        const worldRadius = _utilities_math__WEBPACK_IMPORTED_MODULE_4__.point.distanceToPoint(viewport.canvasToWorld(mouseCanvasPoint), viewport.canvasToWorld([
            mouseCanvasPoint[0] + this.toolInfo.toolSize,
            mouseCanvasPoint[1],
        ]));
        for (let i = 0; i < points.length; i++) {
            const handleCanvasPoint = viewport.worldToCanvas(points[i]);
            const distanceToHandle = _utilities_math__WEBPACK_IMPORTED_MODULE_4__.point.distanceToPoint(handleCanvasPoint, mouseCanvasPoint);
            if (distanceToHandle > this.toolInfo.toolSize) {
                continue;
            }
            this.pushOneHandle(i, worldRadius, sculptData);
            if (pushedHandles.first === undefined) {
                pushedHandles.first = i;
                pushedHandles.last = i;
            }
            else {
                pushedHandles.last = i;
            }
        }
        if (pushedHandles.first !== undefined && pushedHandles.last !== undefined) {
            for (let i = 0; i < CircleSculptCursor.CHAIN_MAINTENANCE_ITERATIONS; i++) {
                this.maintainChainStructure(sculptData, pushedHandles);
            }
        }
        return pushedHandles;
    }
    configureToolSize(evt) {
        const toolInfo = this.toolInfo;
        if (toolInfo.toolSize && toolInfo.maxToolSize) {
            return;
        }
        const eventData = evt.detail;
        const element = eventData.element;
        const minDim = Math.min(element.clientWidth, element.clientHeight);
        const maxRadius = minDim / 12;
        toolInfo.toolSize = maxRadius;
        toolInfo.maxToolSize = maxRadius;
    }
    updateToolSize(canvasCoords, viewport, activeAnnotation) {
        const toolInfo = this.toolInfo;
        const radius = (0,_distancePointToContour__WEBPACK_IMPORTED_MODULE_2__/* .distancePointToContour */ .X)(viewport, activeAnnotation, canvasCoords);
        if (radius > 0) {
            toolInfo.toolSize = Math.min(toolInfo.maxToolSize, radius);
        }
    }
    getMaxSpacing(minSpacing) {
        return Math.max(this.toolInfo.toolSize / 4, minSpacing);
    }
    getInsertPosition(previousIndex, nextIndex, sculptData) {
        let insertPosition;
        const { points, element, mouseCanvasPoint } = sculptData;
        const toolSize = this.toolInfo.toolSize;
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElement)(element);
        const { viewport } = enabledElement;
        const previousCanvasPoint = viewport.worldToCanvas(points[previousIndex]);
        const nextCanvasPoint = viewport.worldToCanvas(points[nextIndex]);
        const midPoint = [
            (previousCanvasPoint[0] + nextCanvasPoint[0]) / 2.0,
            (previousCanvasPoint[1] + nextCanvasPoint[1]) / 2.0,
        ];
        const distanceToMidPoint = _utilities_math__WEBPACK_IMPORTED_MODULE_4__.point.distanceToPoint(mouseCanvasPoint, midPoint);
        if (distanceToMidPoint < toolSize) {
            const directionUnitVector = {
                x: (midPoint[0] - mouseCanvasPoint[0]) / distanceToMidPoint,
                y: (midPoint[1] - mouseCanvasPoint[1]) / distanceToMidPoint,
            };
            insertPosition = [
                mouseCanvasPoint[0] + toolSize * directionUnitVector.x,
                mouseCanvasPoint[1] + toolSize * directionUnitVector.y,
            ];
        }
        else {
            insertPosition = midPoint;
        }
        const worldPosition = viewport.canvasToWorld(insertPosition);
        return worldPosition;
    }
    pushOneHandle(i, worldRadius, sculptData) {
        const { points, mousePoint } = sculptData;
        const handle = points[i];
        const directionUnitVector = this.directionalVector(mousePoint, handle);
        const position = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.scaleAndAdd */ .eR.scaleAndAdd(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create(), mousePoint, directionUnitVector, worldRadius);
        handle[0] = position[0];
        handle[1] = position[1];
        handle[2] = position[2];
    }
    directionalVector(p1, p2) {
        return gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.normalize */ .eR.normalize(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create(), [
            p2[0] - p1[0],
            p2[1] - p1[1],
            p2[2] - p1[2],
        ]);
    }
    calculateMeanConsecutiveDistance(points) {
        if (points.length < 2) {
            return 0;
        }
        let totalDistance = 0;
        const numPoints = points.length;
        for (let i = 0; i < numPoints; i++) {
            const nextIndex = (i + 1) % numPoints;
            const distance = _utilities_math__WEBPACK_IMPORTED_MODULE_4__.point.distanceToPoint(points[i], points[nextIndex]);
            totalDistance += distance;
        }
        return totalDistance / numPoints;
    }
    maintainChainStructure(sculptData, pushedHandles) {
        const { points } = sculptData;
        const first = pushedHandles.first;
        const last = pushedHandles.last;
        const mean = Math.round((first + last) / 2);
        const numPoints = points.length;
        if (!sculptData.meanDistance) {
            sculptData.meanDistance = this.calculateMeanConsecutiveDistance(points);
        }
        const maxInterDistance = sculptData.meanDistance * CircleSculptCursor.MAX_INTER_DISTANCE_FACTOR;
        for (let i = mean; i >= 0; i--) {
            if (i >= numPoints - 1 || i < 0) {
                continue;
            }
            const nextIndex = i + 1;
            const distanceToNext = _utilities_math__WEBPACK_IMPORTED_MODULE_4__.point.distanceToPoint(points[i], points[nextIndex]);
            if (distanceToNext > maxInterDistance) {
                const pullDirection = this.directionalVector(points[i], points[nextIndex]);
                const pullStrength = (distanceToNext - sculptData.meanDistance) / sculptData.meanDistance;
                const adjustmentMagnitude = pullStrength *
                    sculptData.meanDistance *
                    CircleSculptCursor.CHAIN_PULL_STRENGTH_FACTOR;
                points[i][0] += pullDirection[0] * adjustmentMagnitude;
                points[i][1] += pullDirection[1] * adjustmentMagnitude;
                points[i][2] += pullDirection[2] * adjustmentMagnitude;
            }
        }
        for (let i = mean + 1; i < numPoints; i++) {
            if (i >= numPoints || i <= 0) {
                continue;
            }
            const previousIndex = i - 1;
            const distanceToPrevious = _utilities_math__WEBPACK_IMPORTED_MODULE_4__.point.distanceToPoint(points[i], points[previousIndex]);
            if (distanceToPrevious > maxInterDistance) {
                const pullDirection = this.directionalVector(points[i], points[previousIndex]);
                const pullStrength = (distanceToPrevious - sculptData.meanDistance) /
                    sculptData.meanDistance;
                const adjustmentMagnitude = pullStrength *
                    sculptData.meanDistance *
                    CircleSculptCursor.CHAIN_PULL_STRENGTH_FACTOR;
                points[i][0] += pullDirection[0] * adjustmentMagnitude;
                points[i][1] += pullDirection[1] * adjustmentMagnitude;
                points[i][2] += pullDirection[2] * adjustmentMagnitude;
            }
        }
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CircleSculptCursor);


/***/ }),

/***/ 10639:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(85817);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(99737);
/* harmony import */ var _stateManagement_segmentation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(55126);
/* harmony import */ var _stateManagement_segmentation_triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(49906);
/* harmony import */ var _utilities_segmentation_growCut_constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(10564);
/* harmony import */ var _utilities_segmentation_getSVGStyleForSegment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(86644);
/* harmony import */ var _utilities_segmentation_islandRemoval__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(67912);
/* harmony import */ var _utilities_segmentation__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(93759);
/* harmony import */ var _stateManagement_segmentation_getCurrentLabelmapImageIdForViewport__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(97577);










const { transformWorldToIndex, transformIndexToWorld } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities;
class GrowCutBaseTool extends _base__WEBPACK_IMPORTED_MODULE_1__/* .BaseTool */ .oS {
    static { this.lastGrowCutCommand = null; }
    constructor(toolProps, defaultToolProps) {
        const baseToolProps = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.deepMerge({
            configuration: {
                positiveStdDevMultiplier: _utilities_segmentation_growCut_constants__WEBPACK_IMPORTED_MODULE_5__/* .DEFAULT_POSITIVE_STD_DEV_MULTIPLIER */ .ee,
                shrinkExpandIncrement: 0.1,
                islandRemoval: {
                    enabled: false,
                },
            },
        }, defaultToolProps);
        super(toolProps, baseToolProps);
    }
    async preMouseDownCallback(evt) {
        const eventData = evt.detail;
        const { element, currentPoints } = eventData;
        const { world: worldPoint } = currentPoints;
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
        const { viewport, renderingEngine } = enabledElement;
        const { viewUp } = viewport.getCamera();
        const { segmentationId, segmentIndex, labelmapVolumeId, referencedVolumeId, } = await this.getLabelmapSegmentationData(viewport);
        if (!this._isOrthogonalView(viewport, referencedVolumeId)) {
            throw new Error('Oblique view is not supported yet');
        }
        this.growCutData = {
            metadata: {
                ...viewport.getViewReference({ points: [worldPoint] }),
                viewUp,
            },
            segmentation: {
                segmentationId,
                segmentIndex,
                labelmapVolumeId,
                referencedVolumeId,
            },
            viewportId: viewport.id,
            renderingEngineId: renderingEngine.id,
        };
        evt.preventDefault();
        return true;
    }
    shrink() {
        this._runLastCommand({
            shrinkExpandAmount: -this.configuration.shrinkExpandIncrement,
        });
    }
    expand() {
        this._runLastCommand({
            shrinkExpandAmount: this.configuration.shrinkExpandIncrement,
        });
    }
    refresh() {
        this._runLastCommand();
    }
    async getGrowCutLabelmap(_growCutData) {
        throw new Error('Not implemented');
    }
    async runGrowCut() {
        const { growCutData, configuration: config } = this;
        const { segmentation: { segmentationId, segmentIndex, labelmapVolumeId }, } = growCutData;
        const labelmap = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.cache.getVolume(labelmapVolumeId);
        let shrinkExpandAccumulator = 0;
        const growCutCommand = async ({ shrinkExpandAmount = 0 } = {}) => {
            if (shrinkExpandAmount !== 0) {
                this.seeds = null;
            }
            shrinkExpandAccumulator += shrinkExpandAmount;
            const newPositiveStdDevMultiplier = Math.max(0.1, config.positiveStdDevMultiplier + shrinkExpandAccumulator);
            const negativeSeedMargin = shrinkExpandAmount < 0
                ? Math.max(1, _utilities_segmentation_growCut_constants__WEBPACK_IMPORTED_MODULE_5__/* .DEFAULT_NEGATIVE_SEED_MARGIN */ .BX -
                    Math.abs(shrinkExpandAccumulator) * 3)
                : _utilities_segmentation_growCut_constants__WEBPACK_IMPORTED_MODULE_5__/* .DEFAULT_NEGATIVE_SEED_MARGIN */ .BX + shrinkExpandAccumulator * 3;
            const updatedGrowCutData = {
                ...growCutData,
                options: {
                    ...(growCutData.options || {}),
                    positiveSeedValue: segmentIndex,
                    negativeSeedValue: 255,
                    positiveStdDevMultiplier: newPositiveStdDevMultiplier,
                    negativeSeedMargin,
                },
            };
            const growcutLabelmap = await this.getGrowCutLabelmap(updatedGrowCutData);
            const { isPartialVolume } = config;
            const fn = isPartialVolume
                ? this.applyPartialGrowCutLabelmap
                : this.applyGrowCutLabelmap;
            fn(segmentationId, segmentIndex, labelmap, growcutLabelmap);
            this._removeIslands(updatedGrowCutData);
        };
        await growCutCommand();
        GrowCutBaseTool.lastGrowCutCommand = growCutCommand;
        this.growCutData = null;
    }
    applyPartialGrowCutLabelmap(segmentationId, segmentIndex, targetLabelmap, sourceLabelmap) {
        const srcLabelmapData = sourceLabelmap.voxelManager.getCompleteScalarDataArray();
        const tgtVoxelManager = targetLabelmap.voxelManager;
        const [srcColumns, srcRows, srcNumSlices] = sourceLabelmap.dimensions;
        const [tgtColumns, tgtRows] = targetLabelmap.dimensions;
        const srcPixelsPerSlice = srcColumns * srcRows;
        const tgtPixelsPerSlice = tgtColumns * tgtRows;
        for (let srcSlice = 0; srcSlice < srcNumSlices; srcSlice++) {
            for (let srcRow = 0; srcRow < srcRows; srcRow++) {
                const srcRowIJK = [0, srcRow, srcSlice];
                const rowVoxelWorld = transformIndexToWorld(sourceLabelmap.imageData, srcRowIJK);
                const tgtRowIJK = transformWorldToIndex(targetLabelmap.imageData, rowVoxelWorld);
                const [tgtColumn, tgtRow, tgtSlice] = tgtRowIJK;
                const srcOffset = srcRow * srcColumns + srcSlice * srcPixelsPerSlice;
                const tgtOffset = tgtColumn + tgtRow * tgtColumns + tgtSlice * tgtPixelsPerSlice;
                for (let column = 0; column < srcColumns; column++) {
                    const labelmapValue = srcLabelmapData[srcOffset + column] === segmentIndex
                        ? segmentIndex
                        : 0;
                    tgtVoxelManager.setAtIndex(tgtOffset + column, labelmapValue);
                }
            }
        }
        (0,_stateManagement_segmentation_triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_4__.triggerSegmentationDataModified)(segmentationId);
    }
    applyGrowCutLabelmap(segmentationId, segmentIndex, targetLabelmap, sourceLabelmap) {
        const tgtVoxelManager = targetLabelmap.voxelManager;
        const srcVoxelManager = sourceLabelmap.voxelManager;
        srcVoxelManager.forEach(({ value, index }) => {
            if (value === segmentIndex) {
                tgtVoxelManager.setAtIndex(index, value);
            }
        });
        (0,_stateManagement_segmentation_triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_4__.triggerSegmentationDataModified)(segmentationId);
    }
    _runLastCommand({ shrinkExpandAmount = 0 } = {}) {
        const cmd = GrowCutBaseTool.lastGrowCutCommand;
        if (cmd) {
            cmd({ shrinkExpandAmount });
        }
    }
    async getLabelmapSegmentationData(viewport) {
        const activeSeg = _stateManagement_segmentation__WEBPACK_IMPORTED_MODULE_3__.activeSegmentation.getActiveSegmentation(viewport.id);
        if (!activeSeg) {
            throw new Error('No active segmentation found');
        }
        const { segmentationId } = activeSeg;
        const segmentIndex = _stateManagement_segmentation__WEBPACK_IMPORTED_MODULE_3__.segmentIndex.getActiveSegmentIndex(segmentationId);
        const { representationData } = _stateManagement_segmentation__WEBPACK_IMPORTED_MODULE_3__.state.getSegmentation(segmentationId);
        const labelmapData = representationData[_enums__WEBPACK_IMPORTED_MODULE_2__.SegmentationRepresentations.Labelmap];
        let { volumeId: labelmapVolumeId, referencedVolumeId } = labelmapData;
        if (!labelmapVolumeId) {
            const referencedImageIds = viewport.getImageIds();
            if (!_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.isValidVolume(referencedImageIds)) {
                const currentImageId = viewport.getCurrentImageId();
                const currentImage = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.cache.getImage(currentImageId);
                const fakeImage = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.imageLoader.createAndCacheDerivedImage(currentImageId);
                const fakeVolume = this._createFakeVolume([
                    currentImage.imageId,
                    fakeImage.imageId,
                ]);
                referencedVolumeId = fakeVolume.volumeId;
                const currentLabelmapImageId = (0,_stateManagement_segmentation_getCurrentLabelmapImageIdForViewport__WEBPACK_IMPORTED_MODULE_9__/* .getCurrentLabelmapImageIdForViewport */ .vl)(viewport.id, segmentationId);
                const fakeDerivedImage = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.imageLoader.createAndCacheDerivedImage(currentLabelmapImageId);
                const fakeLabelmapVolume = this._createFakeVolume([
                    currentLabelmapImageId,
                    fakeDerivedImage.imageId,
                ]);
                labelmapVolumeId = fakeLabelmapVolume.volumeId;
            }
            else {
                const segVolume = (0,_utilities_segmentation__WEBPACK_IMPORTED_MODULE_8__.getOrCreateSegmentationVolume)(segmentationId);
                labelmapVolumeId = segVolume.volumeId;
            }
        }
        if (!referencedVolumeId) {
            const { imageIds: segImageIds } = labelmapData;
            const referencedImageIds = segImageIds.map((imageId) => _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.cache.getImage(imageId).referencedImageId);
            const volumeId = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.cache.generateVolumeId(referencedImageIds);
            const imageVolume = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.cache.getVolume(volumeId);
            referencedVolumeId = imageVolume
                ? imageVolume.volumeId
                : (await _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.volumeLoader.createAndCacheVolumeFromImagesSync(volumeId, referencedImageIds)).volumeId;
        }
        return {
            segmentationId,
            segmentIndex,
            labelmapVolumeId,
            referencedVolumeId,
        };
    }
    _createFakeVolume(imageIds) {
        const volumeId = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.cache.generateVolumeId(imageIds);
        const cachedVolume = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.cache.getVolume(volumeId);
        if (cachedVolume) {
            return cachedVolume;
        }
        const volumeProps = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.generateVolumePropsFromImageIds(imageIds, volumeId);
        const spacing = volumeProps.spacing;
        if (spacing[2] === 0) {
            spacing[2] = 1;
        }
        const derivedVolume = new _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.ImageVolume({
            volumeId,
            dataType: volumeProps.dataType,
            metadata: structuredClone(volumeProps.metadata),
            dimensions: volumeProps.dimensions,
            spacing: volumeProps.spacing,
            origin: volumeProps.origin,
            direction: volumeProps.direction,
            referencedVolumeId: volumeProps.referencedVolumeId,
            imageIds: volumeProps.imageIds,
            referencedImageIds: volumeProps.referencedImageIds,
        });
        _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.cache.putVolumeSync(volumeId, derivedVolume);
        return derivedVolume;
    }
    _isOrthogonalView(viewport, referencedVolumeId) {
        const volume = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.cache.getVolume(referencedVolumeId);
        const volumeImageData = volume.imageData;
        const camera = viewport.getCamera();
        const { ijkVecColDir, ijkVecSliceDir } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.getVolumeDirectionVectors(volumeImageData, camera);
        return [ijkVecColDir, ijkVecSliceDir].every((vec) => _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.isEqual(Math.abs(vec[0]), 1) ||
            _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.isEqual(Math.abs(vec[1]), 1) ||
            _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.isEqual(Math.abs(vec[2]), 1));
    }
    getRemoveIslandData(_growCutData) {
        return;
    }
    _removeIslands(growCutData) {
        const { islandRemoval: config } = this.configuration;
        if (!config.enabled) {
            return;
        }
        const { segmentation: { segmentIndex, labelmapVolumeId }, renderingEngineId, viewportId, } = growCutData;
        const labelmap = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.cache.getVolume(labelmapVolumeId);
        const removeIslandData = this.getRemoveIslandData(growCutData);
        if (!removeIslandData) {
            return;
        }
        const [width, height] = labelmap.dimensions;
        const numPixelsPerSlice = width * height;
        const { worldIslandPoints = [], islandPointIndexes = [] } = removeIslandData;
        let ijkIslandPoints = [...(removeIslandData?.ijkIslandPoints ?? [])];
        const renderingEngine = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getRenderingEngine)(renderingEngineId);
        const viewport = renderingEngine.getViewport(viewportId);
        const { voxelManager } = labelmap;
        const islandRemoval = new _utilities_segmentation_islandRemoval__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A();
        ijkIslandPoints = ijkIslandPoints.concat(worldIslandPoints.map((worldPoint) => transformWorldToIndex(labelmap.imageData, worldPoint)));
        ijkIslandPoints = ijkIslandPoints.concat(islandPointIndexes.map((pointIndex) => {
            const x = pointIndex % width;
            const y = Math.floor(pointIndex / width) % height;
            const z = Math.floor(pointIndex / numPixelsPerSlice);
            return [x, y, z];
        }));
        islandRemoval.initialize(viewport, voxelManager, {
            points: ijkIslandPoints,
            previewSegmentIndex: segmentIndex,
            segmentIndex,
        });
        islandRemoval.floodFillSegmentIsland();
        islandRemoval.removeExternalIslands();
        islandRemoval.removeInternalIslands();
    }
    getSegmentStyle({ segmentationId, viewportId, segmentIndex }) {
        return (0,_utilities_segmentation_getSVGStyleForSegment__WEBPACK_IMPORTED_MODULE_6__/* .getSVGStyleForSegment */ .u)({
            segmentationId,
            segmentIndex,
            viewportId,
        });
    }
}
GrowCutBaseTool.toolName = 'GrowCutBaseTool';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GrowCutBaseTool);


/***/ }),

/***/ 13271:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   X: () => (/* binding */ distancePointToContour)
/* harmony export */ });
/* harmony import */ var _utilities_math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(95527);

const distancePointToContour = (viewport, annotation, coords) => {
    if (!annotation?.data?.contour?.polyline?.length) {
        return;
    }
    const { polyline } = annotation.data.contour;
    const { length } = polyline;
    let distance = Infinity;
    for (let i = 0; i < length; i++) {
        const canvasPoint = viewport.worldToCanvas(polyline[i]);
        const distanceToPoint = _utilities_math__WEBPACK_IMPORTED_MODULE_0__.point.distanceToPoint(canvasPoint, coords);
        distance = Math.min(distance, distanceToPoint);
    }
    if (distance === Infinity || isNaN(distance)) {
        return;
    }
    return distance;
};


/***/ }),

/***/ 47347:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   M: () => (/* binding */ eraseInsideRectangle)
/* harmony export */ });
/* unused harmony export eraseOutsideRectangle */
/* harmony import */ var _fillRectangle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10088);

function eraseRectangle(enabledElement, operationData, inside = true) {
    const eraseOperationData = Object.assign({}, operationData, {
        segmentIndex: 0,
    });
    (0,_fillRectangle__WEBPACK_IMPORTED_MODULE_0__/* .fillInsideRectangle */ .pY)(enabledElement, eraseOperationData);
}
function eraseInsideRectangle(enabledElement, operationData) {
    eraseRectangle(enabledElement, operationData, true);
}
function eraseOutsideRectangle(enabledElement, operationData) {
    eraseRectangle(enabledElement, operationData, false);
}


/***/ }),

/***/ 5565:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkStandardBasis: () => (/* binding */ checkStandardBasis),
/* harmony export */   inverse3x3Matrix: () => (/* binding */ inverse3x3Matrix),
/* harmony export */   rotatePoints: () => (/* binding */ rotatePoints)
/* harmony export */ });
function validate3x3Matrix(matrix) {
    if (!Array.isArray(matrix) || matrix.length !== 9) {
        throw new Error('Matrix must be an array of 9 numbers');
    }
    if (!matrix.every((n) => typeof n === 'number' && !isNaN(n))) {
        throw new Error('Matrix must contain only valid numbers');
    }
}
function inverse3x3Matrix(matrix) {
    validate3x3Matrix(matrix);
    const mat = [
        [matrix[0], matrix[1], matrix[2]],
        [matrix[3], matrix[4], matrix[5]],
        [matrix[6], matrix[7], matrix[8]],
    ];
    const determinant = mat[0][0] * (mat[1][1] * mat[2][2] - mat[1][2] * mat[2][1]) -
        mat[0][1] * (mat[1][0] * mat[2][2] - mat[1][2] * mat[2][0]) +
        mat[0][2] * (mat[1][0] * mat[2][1] - mat[1][1] * mat[2][0]);
    if (Math.abs(determinant) < 1e-10) {
        throw new Error('Matrix is not invertible (determinant is zero)');
    }
    const adjugate = [
        [
            mat[1][1] * mat[2][2] - mat[1][2] * mat[2][1],
            -(mat[0][1] * mat[2][2] - mat[0][2] * mat[2][1]),
            mat[0][1] * mat[1][2] - mat[0][2] * mat[1][1],
        ],
        [
            -(mat[1][0] * mat[2][2] - mat[1][2] * mat[2][0]),
            mat[0][0] * mat[2][2] - mat[0][2] * mat[2][0],
            -(mat[0][0] * mat[1][2] - mat[0][2] * mat[1][0]),
        ],
        [
            mat[1][0] * mat[2][1] - mat[1][1] * mat[2][0],
            -(mat[0][0] * mat[2][1] - mat[0][1] * mat[2][0]),
            mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0],
        ],
    ];
    const inverse = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            inverse.push(adjugate[i][j] / determinant);
        }
    }
    return inverse;
}
function normalizeVector(v) {
    const magnitude = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return v.map((component) => component / magnitude);
}
function checkStandardBasis(directions) {
    validate3x3Matrix(directions);
    const xVector = directions.slice(0, 3);
    const yVector = directions.slice(3, 6);
    const zVector = directions.slice(6, 9);
    const normalizedX = normalizeVector(xVector);
    const normalizedY = normalizeVector(yVector);
    const normalizedZ = normalizeVector(zVector);
    const standardBasis = {
        x: [1, 0, 0],
        y: [0, 1, 0],
        z: [0, 0, 1],
    };
    const epsilon = 1e-10;
    const isStandard = normalizedX.every((val, i) => Math.abs(val - standardBasis.x[i]) < epsilon) &&
        normalizedY.every((val, i) => Math.abs(val - standardBasis.y[i]) < epsilon) &&
        normalizedZ.every((val, i) => Math.abs(val - standardBasis.z[i]) < epsilon);
    const rotationMatrix = isStandard
        ? [...standardBasis.x, ...standardBasis.y, ...standardBasis.z]
        : inverse3x3Matrix([...normalizedX, ...normalizedY, ...normalizedZ]);
    return {
        isStandard,
        rotationMatrix,
    };
}
function rotatePoint(point, origin, rotationMatrix) {
    const x = point[0] - origin[0];
    const y = point[1] - origin[1];
    const z = point[2] - origin[2];
    return [
        rotationMatrix[0] * x +
            rotationMatrix[1] * y +
            rotationMatrix[2] * z +
            origin[0],
        rotationMatrix[3] * x +
            rotationMatrix[4] * y +
            rotationMatrix[5] * z +
            origin[1],
        rotationMatrix[6] * x +
            rotationMatrix[7] * y +
            rotationMatrix[8] * z +
            origin[2],
    ];
}
function rotatePoints(rotationMatrix, origin, points) {
    const rotatedPoints = [];
    for (let i = 0; i < points.length; i += 3) {
        const point = points.slice(i, i + 3);
        const rotated = rotatePoint(point, origin, rotationMatrix);
        rotatedPoints.push(...rotated);
    }
    return rotatedPoints;
}


/***/ }),

/***/ 39848:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getToolsWithModesForElement)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _store_ToolGroupManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(77609);


function getToolsWithModesForElement(element, modesFilter) {
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
    const { renderingEngineId, viewportId } = enabledElement;
    const toolGroup = (0,_store_ToolGroupManager__WEBPACK_IMPORTED_MODULE_1__.getToolGroupForViewport)(viewportId, renderingEngineId);
    if (!toolGroup) {
        return [];
    }
    const enabledTools = [];
    const toolGroupToolNames = Object.keys(toolGroup.toolOptions);
    for (let j = 0; j < toolGroupToolNames.length; j++) {
        const toolName = toolGroupToolNames[j];
        const toolOptions = toolGroup.toolOptions[toolName];
        if (!toolOptions) {
            continue;
        }
        if (modesFilter.includes(toolOptions.mode)) {
            const toolInstance = toolGroup.getToolInstance(toolName);
            enabledTools.push(toolInstance);
        }
    }
    return enabledTools;
}


/***/ }),

/***/ 22658:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   j: () => (/* binding */ getVOIMultipliers)
/* harmony export */ });
/* unused harmony export default */
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _viewport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19027);


const DEFAULT_MULTIPLIER = 4;
function getVOIMultipliers(viewport, volumeId, options) {
    const modality = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.getViewportModality(viewport, volumeId);
    if (modality === 'PT') {
        const { clientWidth, clientHeight } = viewport.element;
        const ptMultiplier = 5 / Math.max(clientWidth, clientHeight);
        const isPreScaled = (0,_viewport__WEBPACK_IMPORTED_MODULE_1__.isViewportPreScaled)(viewport, volumeId);
        const { fixedPTWindowWidth = true } = options ?? {};
        const xMultiplier = fixedPTWindowWidth ? 0 : ptMultiplier;
        return isPreScaled
            ? [xMultiplier, ptMultiplier]
            : [xMultiplier, DEFAULT_MULTIPLIER];
    }
    return [DEFAULT_MULTIPLIER, DEFAULT_MULTIPLIER];
}



/***/ }),

/***/ 38776:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   j: () => (/* binding */ LivewirePath)
/* harmony export */ });
class LivewirePath {
    constructor(inputPointArray, inputControlPointIndexArray) {
        this.pointArray = inputPointArray ? inputPointArray.slice() : [];
        this._controlPointIndexes = inputControlPointIndexArray
            ? inputControlPointIndexArray.slice()
            : [];
    }
    getPoint(index) {
        return this.pointArray[index];
    }
    getLastPoint() {
        return this.pointArray[this.pointArray.length - 1];
    }
    isControlPoint(point) {
        const index = this.pointArray.indexOf(point);
        if (index !== -1) {
            return this._controlPointIndexes.indexOf(index) !== -1;
        }
        else {
            throw new Error('Error: isControlPoint called with not in list point.');
        }
    }
    addPoint(point) {
        this.pointArray.push(point);
    }
    addControlPoint(point) {
        const index = this.pointArray.indexOf(point);
        if (index !== -1) {
            this._controlPointIndexes.push(index);
        }
        else {
            throw new Error('Cannot mark a non registered point as control point.');
        }
    }
    getControlPoints() {
        return this._controlPointIndexes.map((i) => this.pointArray[i]);
    }
    getNumControlPoints() {
        return this._controlPointIndexes.length;
    }
    removeLastControlPoint() {
        if (this._controlPointIndexes.length) {
            this._controlPointIndexes.pop();
        }
    }
    getLastControlPoint() {
        if (this._controlPointIndexes.length) {
            return this.pointArray[this._controlPointIndexes[this._controlPointIndexes.length - 1]];
        }
    }
    removeLastPoints(count) {
        this.pointArray.splice(this.pointArray.length - count, count);
    }
    addPoints(newPointArray) {
        this.pointArray = this.pointArray.concat(newPointArray);
    }
    prependPath(other) {
        const otherSize = other.pointArray.length;
        const shiftedIndexArray = [];
        this.pointArray = other.pointArray.concat(this.pointArray);
        for (let i = 0; i < this._controlPointIndexes.length; ++i) {
            shiftedIndexArray[i] = this._controlPointIndexes[i] + otherSize;
        }
        this._controlPointIndexes =
            other._controlPointIndexes.concat(shiftedIndexArray);
    }
    appendPath(other) {
        this.addPoints(other.pointArray);
        other._controlPointIndexes.forEach((point) => this._controlPointIndexes.push(point));
    }
}


/***/ }),

/***/ 78044:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  f: () => (/* binding */ LivewireScissors)
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/BucketQueue.js
class BucketQueue {
    constructor({ numBits, getPriority, areEqual, }) {
        this._bucketCount = 1 << numBits;
        this._mask = this._bucketCount - 1;
        this._size = 0;
        this._currentBucketIndex = 0;
        this._buckets = this._buildArray(this._bucketCount);
        this._getPriority =
            typeof getPriority !== 'undefined'
                ? getPriority
                : (item) => item;
        this._areEqual =
            typeof areEqual === 'function'
                ? areEqual
                : (itemA, itemB) => itemA === itemB;
    }
    push(item) {
        const bucketIndex = this._getBucketIndex(item);
        const oldHead = this._buckets[bucketIndex];
        const newHead = {
            value: item,
            next: oldHead,
        };
        this._buckets[bucketIndex] = newHead;
        this._size++;
    }
    pop() {
        if (this._size === 0) {
            throw new Error('Cannot pop because the queue is empty.');
        }
        while (this._buckets[this._currentBucketIndex] === null) {
            this._currentBucketIndex =
                (this._currentBucketIndex + 1) % this._bucketCount;
        }
        const ret = this._buckets[this._currentBucketIndex];
        this._buckets[this._currentBucketIndex] = ret.next;
        this._size--;
        return ret.value;
    }
    remove(item) {
        if (!item) {
            return false;
        }
        const bucketIndex = this._getBucketIndex(item);
        const firstBucketNode = this._buckets[bucketIndex];
        let node = firstBucketNode;
        let prevNode;
        while (node !== null) {
            if (this._areEqual(item, node.value)) {
                break;
            }
            prevNode = node;
            node = node.next;
        }
        if (node === null) {
            return false;
        }
        if (node === firstBucketNode) {
            this._buckets[bucketIndex] = node.next;
        }
        else {
            prevNode.next = node.next;
        }
        this._size--;
        return true;
    }
    isEmpty() {
        return this._size === 0;
    }
    _getBucketIndex(item) {
        return this._getPriority(item) & this._mask;
    }
    _buildArray(size) {
        const buckets = new Array(size);
        buckets.fill(null);
        return buckets;
    }
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/livewire/LivewireScissors.js


const { isEqual } = esm.utilities;
const MAX_UINT32 = 4294967295;
const TWO_THIRD_PI = 2 / (3 * Math.PI);
class LivewireScissors {
    constructor(grayscalePixelData, width, height) {
        this._getPointIndex = (row, col) => {
            const { width } = this;
            return row * width + col;
        };
        this._getPointCoordinate = (index) => {
            const x = index % this.width;
            const y = Math.floor(index / this.width);
            return [x, y];
        };
        this._getPointCost = (pointIndex) => {
            return Math.round(this.searchGranularity * this.costs[pointIndex]);
        };
        const numPixels = grayscalePixelData.length;
        this.searchGranularityBits = 8;
        this.searchGranularity = 1 << this.searchGranularityBits;
        this.width = width;
        this.height = height;
        this.grayscalePixelData = grayscalePixelData;
        this.laplace = null;
        this.gradXNew = null;
        this.gradYNew = null;
        this.laplace = this._computeLaplace();
        this.gradMagnitude = this._computeGradient();
        this.gradXNew = this._computeGradientX();
        this.gradYNew = this._computeGradientY();
        this.visited = new Array(numPixels);
        this.parents = new Uint32Array(numPixels);
        this.costs = new Float32Array(numPixels);
    }
    startSearch(startPoint) {
        const startPointIndex = this._getPointIndex(startPoint[1], startPoint[0]);
        this.startPoint = null;
        this.visited.fill(false);
        this.parents.fill(MAX_UINT32);
        this.costs.fill(Infinity);
        this.priorityQueueNew = new BucketQueue({
            numBits: this.searchGranularityBits,
            getPriority: this._getPointCost,
        });
        this.startPoint = startPoint;
        this.costs[startPointIndex] = 0;
        this.priorityQueueNew.push(startPointIndex);
    }
    findMinNearby(testPoint, delta = 2) {
        const [x, y] = testPoint;
        const { costs } = this;
        const xRange = [
            Math.max(0, x - delta),
            Math.min(x + delta + 1, this.width),
        ];
        const yRange = [
            Math.max(0, y - delta),
            Math.min(y + delta + 1, this.height),
        ];
        let minValue = costs[this._getPointIndex(y, x)] * 0.8;
        let minPoint = testPoint;
        for (let xTest = xRange[0]; xTest < xRange[1]; xTest++) {
            for (let yTest = yRange[0]; yTest < yRange[1]; yTest++) {
                const distanceCost = 1 -
                    (Math.abs(xTest - testPoint[0]) + Math.abs(yTest - testPoint[1])) /
                        delta /
                        2;
                const weightCost = costs[this._getPointIndex(yTest, xTest)];
                const weight = weightCost * 0.8 + distanceCost * 0.2;
                if (weight < minValue) {
                    minPoint = [xTest, yTest];
                    minValue = weight;
                }
            }
        }
        return minPoint;
    }
    findPathToPoint(targetPoint) {
        if (!this.startPoint) {
            throw new Error('There is no search in progress');
        }
        const { startPoint, _getPointIndex: index, _getPointCoordinate: coord, } = this;
        const startPointIndex = index(startPoint[1], startPoint[0]);
        const targetPointIndex = index(targetPoint[1], targetPoint[0]);
        const { visited: visited, parents: parents, costs: cost, priorityQueueNew: priorityQueue, } = this;
        if (targetPointIndex === startPointIndex) {
            return [];
        }
        while (!priorityQueue.isEmpty() &&
            parents[targetPointIndex] === MAX_UINT32) {
            const pointIndex = priorityQueue.pop();
            if (visited[pointIndex]) {
                continue;
            }
            const point = coord(pointIndex);
            const neighborsPoints = this._getNeighborPoints(point);
            visited[pointIndex] = true;
            for (let i = 0, len = neighborsPoints.length; i < len; i++) {
                const neighborPoint = neighborsPoints[i];
                const neighborPointIndex = index(neighborPoint[1], neighborPoint[0]);
                const dist = this._getWeightedDistance(point, neighborPoint);
                const neighborCost = cost[pointIndex] + dist;
                if (neighborCost < cost[neighborPointIndex]) {
                    if (cost[neighborPointIndex] !== Infinity) {
                        priorityQueue.remove(neighborPointIndex);
                    }
                    cost[neighborPointIndex] = neighborCost;
                    parents[neighborPointIndex] = pointIndex;
                    priorityQueue.push(neighborPointIndex);
                }
            }
        }
        const pathPoints = [];
        let pathPointIndex = targetPointIndex;
        while (pathPointIndex !== MAX_UINT32) {
            pathPoints.push(coord(pathPointIndex));
            pathPointIndex = parents[pathPointIndex];
        }
        return pathPoints.reverse();
    }
    _getDeltaX(x, y) {
        const { grayscalePixelData: data, width } = this;
        let index = this._getPointIndex(y, x);
        if (x + 1 === width) {
            index--;
        }
        return data[index + 1] - data[index];
    }
    _getDeltaY(x, y) {
        const { grayscalePixelData: data, width, height } = this;
        let index = this._getPointIndex(y, x);
        if (y + 1 === height) {
            index -= width;
        }
        return data[index] - data[index + width];
    }
    _getGradientMagnitude(x, y) {
        const dx = this._getDeltaX(x, y);
        const dy = this._getDeltaY(x, y);
        return Math.sqrt(dx * dx + dy * dy);
    }
    _getLaplace(x, y) {
        const { grayscalePixelData: data, _getPointIndex: index } = this;
        const p02 = data[index(y - 2, x)];
        const p11 = data[index(y - 1, x - 1)];
        const p12 = data[index(y - 1, x)];
        const p13 = data[index(y - 1, x + 1)];
        const p20 = data[index(y, x - 2)];
        const p21 = data[index(y, x - 1)];
        const p22 = data[index(y, x)];
        const p23 = data[index(y, x + 1)];
        const p24 = data[index(y, x + 2)];
        const p31 = data[index(y + 1, x - 1)];
        const p32 = data[index(y + 1, x)];
        const p33 = data[index(y + 1, x + 1)];
        const p42 = data[index(y + 2, x)];
        let lap = p02;
        lap += p11 + 2 * p12 + p13;
        lap += p20 + 2 * p21 - 16 * p22 + 2 * p23 + p24;
        lap += p31 + 2 * p32 + p33;
        lap += p42;
        return lap;
    }
    _computeGradient() {
        const { width, height } = this;
        const gradient = new Float32Array(width * height);
        let pixelIndex = 0;
        let max = 0;
        let x = 0;
        let y = 0;
        for (y = 0; y < height - 1; y++) {
            for (x = 0; x < width - 1; x++) {
                gradient[pixelIndex] = this._getGradientMagnitude(x, y);
                max = Math.max(gradient[pixelIndex], max);
                pixelIndex++;
            }
            gradient[pixelIndex] = gradient[pixelIndex - 1];
            pixelIndex++;
        }
        for (let len = gradient.length; pixelIndex < len; pixelIndex++) {
            gradient[pixelIndex] = gradient[pixelIndex - width];
        }
        for (let i = 0, len = gradient.length; i < len; i++) {
            gradient[i] = 1 - gradient[i] / max;
        }
        return gradient;
    }
    _computeLaplace() {
        const { width, height, _getPointIndex: index } = this;
        const laplace = new Float32Array(width * height);
        laplace.fill(1, 0, index(2, 0));
        for (let y = 2; y < height - 2; y++) {
            laplace[index(y, 0)] = 1;
            laplace[index(y, 1)] = 1;
            for (let x = 2; x < width - 2; x++) {
                laplace[index(y, x)] = this._getLaplace(x, y) > 0.33 ? 0 : 1;
            }
            laplace[index(y, width - 2)] = 1;
            laplace[index(y, width - 1)] = 1;
        }
        laplace.fill(1, index(height - 2, 0));
        return laplace;
    }
    _computeGradientX() {
        const { width, height } = this;
        const gradX = new Float32Array(width * height);
        let pixelIndex = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                gradX[pixelIndex++] = this._getDeltaX(x, y);
            }
        }
        return gradX;
    }
    _computeGradientY() {
        const { width, height } = this;
        const gradY = new Float32Array(width * height);
        let pixelIndex = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                gradY[pixelIndex++] = this._getDeltaY(x, y);
            }
        }
        return gradY;
    }
    _getGradientUnitVector(px, py) {
        const { gradXNew, gradYNew, _getPointIndex: index } = this;
        const pointGradX = gradXNew[index(py, px)];
        const pointGradY = gradYNew[index(py, px)];
        let gradVecLen = Math.sqrt(pointGradX * pointGradX + pointGradY * pointGradY);
        gradVecLen = Math.max(gradVecLen, 1e-100);
        return [pointGradX / gradVecLen, pointGradY / gradVecLen];
    }
    _getGradientDirection(px, py, qx, qy) {
        const dgpUnitVec = this._getGradientUnitVector(px, py);
        const gdqUnitVec = this._getGradientUnitVector(qx, qy);
        let dp = dgpUnitVec[1] * (qx - px) - dgpUnitVec[0] * (qy - py);
        let dq = gdqUnitVec[1] * (qx - px) - gdqUnitVec[0] * (qy - py);
        if (dp < 0) {
            dp = -dp;
            dq = -dq;
        }
        if (px !== qx && py !== qy) {
            dp *= Math.SQRT1_2;
            dq *= Math.SQRT1_2;
        }
        dq = Math.min(Math.max(dq, -1), 1);
        const direction = TWO_THIRD_PI * (Math.acos(Math.min(dp, 1)) + Math.acos(dq));
        if (isNaN(direction) || !isFinite(direction)) {
            console.warn('Found non-direction:', px, py, qx, qy, dp, dq, direction);
            return 1;
        }
        return direction;
    }
    getCost(pointA, pointB) {
        return this._getWeightedDistance(pointA, pointB);
    }
    _getWeightedDistance(pointA, pointB) {
        const { _getPointIndex: index, width, height } = this;
        const [aX, aY] = pointA;
        const [bX, bY] = pointB;
        if (bX < 0 || bX >= width || bY < 0 || bY >= height) {
            return 1;
        }
        if (aX < 0 || aY < 0 || aX >= width || aY >= height) {
            return 0;
        }
        const bIndex = index(bY, bX);
        let gradient = this.gradMagnitude[bIndex];
        if (aX === bX || aY === bY) {
            gradient *= Math.SQRT1_2;
        }
        const laplace = this.laplace[bIndex];
        const direction = this._getGradientDirection(aX, aY, bX, bY);
        return 0.43 * gradient + 0.43 * laplace + 0.11 * direction;
    }
    _getNeighborPoints(point) {
        const { width, height } = this;
        const list = [];
        const sx = Math.max(point[0] - 1, 0);
        const sy = Math.max(point[1] - 1, 0);
        const ex = Math.min(point[0] + 1, width - 1);
        const ey = Math.min(point[1] + 1, height - 1);
        for (let y = sy; y <= ey; y++) {
            for (let x = sx; x <= ex; x++) {
                if (x !== point[0] || y !== point[1]) {
                    list.push([x, y]);
                }
            }
        }
        return list;
    }
    static createInstanceFromRawPixelData(pixelData, width, height, voiRange) {
        const numPixels = pixelData.length;
        const grayscalePixelData = new Float32Array(numPixels);
        const { lower: minPixelValue, upper: maxPixelValue } = voiRange;
        const pixelRange = maxPixelValue - minPixelValue;
        for (let i = 0, len = pixelData.length; i < len; i++) {
            grayscalePixelData[i] = Math.max(0, Math.min(1, (pixelData[i] - minPixelValue) / pixelRange));
        }
        return new LivewireScissors(grayscalePixelData, width, height);
    }
}


/***/ }),

/***/ 88638:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  distanceToPoint: () => (/* reexport */ distanceToPoint),
  distanceToPointSquared: () => (/* reexport */ distanceToPointSquared),
  intersectAABB: () => (/* reexport */ intersectAABB)
});

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/aabb/intersectAABB.js
function intersectAABB(aabb1, aabb2) {
    return (aabb1.minX <= aabb2.maxX &&
        aabb1.maxX >= aabb2.minX &&
        aabb1.minY <= aabb2.maxY &&
        aabb1.maxY >= aabb2.minY);
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/aabb/distanceToPointSquared.js
function distanceToPointSquared(aabb, point) {
    const aabbWidth = aabb.maxX - aabb.minX;
    const aabbHeight = aabb.maxY - aabb.minY;
    const aabbSize = [aabbWidth, aabbHeight];
    const aabbCenter = [
        aabb.minX + aabbWidth / 2,
        aabb.minY + aabbHeight / 2,
    ];
    const translatedPoint = [
        Math.abs(point[0] - aabbCenter[0]),
        Math.abs(point[1] - aabbCenter[1]),
    ];
    const dx = translatedPoint[0] - aabbSize[0] * 0.5;
    const dy = translatedPoint[1] - aabbSize[1] * 0.5;
    if (dx > 0 && dy > 0) {
        return dx * dx + dy * dy;
    }
    const dist = Math.max(dx, 0) + Math.max(dy, 0);
    return dist * dist;
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/aabb/distanceToPoint.js

function distanceToPoint(aabb, point) {
    return Math.sqrt(distanceToPointSquared(aabb, point));
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/aabb/index.js





/***/ }),

/***/ 25963:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ angleBetweenLines)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);

function angleBetween3DLines(line1, line2) {
    const [p1, p2] = line1;
    const [p3, p4] = line2;
    const v1 = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.sub */ .eR.sub(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create(), p2, p1);
    const v2 = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.sub */ .eR.sub(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create(), p3, p4);
    const dot = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(v1, v2);
    const v1Length = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.length */ .eR.length(v1);
    const v2Length = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.length */ .eR.length(v2);
    const cos = dot / (v1Length * v2Length);
    const radian = Math.acos(cos);
    return (radian * 180) / Math.PI;
}
function angleBetween2DLines(line1, line2) {
    const [p1, p2] = line1;
    const [p3, p4] = line2;
    const v1 = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.sub */ .Zc.sub(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.create */ .Zc.create(), p2, p1);
    const v2 = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.sub */ .Zc.sub(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.create */ .Zc.create(), p3, p4);
    const dot = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.dot */ .Zc.dot(v1, v2);
    const v1Length = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.length */ .Zc.length(v1);
    const v2Length = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.length */ .Zc.length(v2);
    const cos = dot / (v1Length * v2Length);
    return Math.acos(cos) * (180 / Math.PI);
}
function angleBetweenLines(line1, line2) {
    const is3D = line1[0].length === 3;
    return is3D
        ? angleBetween3DLines(line1, line2)
        : angleBetween2DLines(line1, line2);
}


/***/ }),

/***/ 83923:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   angleBetweenLines: () => (/* reexport safe */ _angleBetweenLines__WEBPACK_IMPORTED_MODULE_0__.A)
/* harmony export */ });
/* harmony import */ var _angleBetweenLines__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(25963);




/***/ }),

/***/ 28364:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   I: () => (/* binding */ InstanceCalculator),
/* harmony export */   t: () => (/* binding */ Calculator)
/* harmony export */ });
class Calculator {
}
class InstanceCalculator {
    constructor(options) {
        this.storePointData = options.storePointData;
    }
    getStatistics() {
        console.debug('InstanceCalculator getStatistics called');
    }
}


/***/ }),

/***/ 73262:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BasicStatsCalculator: () => (/* reexport safe */ _BasicStatsCalculator__WEBPACK_IMPORTED_MODULE_0__.O),
/* harmony export */   Calculator: () => (/* reexport safe */ _Calculator__WEBPACK_IMPORTED_MODULE_1__.t),
/* harmony export */   InstanceBasicStatsCalculator: () => (/* reexport safe */ _BasicStatsCalculator__WEBPACK_IMPORTED_MODULE_0__.B),
/* harmony export */   InstanceCalculator: () => (/* reexport safe */ _Calculator__WEBPACK_IMPORTED_MODULE_1__.I)
/* harmony export */ });
/* harmony import */ var _BasicStatsCalculator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(69013);
/* harmony import */ var _Calculator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(28364);





/***/ }),

/***/ 77081:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  getCanvasCircleCorners: () => (/* reexport */ getCanvasCircleCorners),
  getCanvasCircleRadius: () => (/* reexport */ getCanvasCircleRadius)
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/point/index.js + 3 modules
var point = __webpack_require__(82216);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/circle/getCanvasCircleRadius.js

function getCanvasCircleRadius(circleCanvasPoints) {
    const [center, end] = circleCanvasPoints;
    return (0,point.distanceToPoint)(center, end);
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/circle/getCanvasCircleCorners.js

function getCanvasCircleCorners(circleCanvasPoints) {
    const [center, end] = circleCanvasPoints;
    const radius = (0,point.distanceToPoint)(center, end);
    const topLeft = [center[0] - radius, center[1] - radius];
    const bottomRight = [center[0] + radius, center[1] + radius];
    return [topLeft, bottomRight];
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/circle/index.js





/***/ }),

/***/ 87009:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  getCanvasEllipseCorners: () => (/* reexport */ getCanvasEllipseCorners),
  pointInEllipse: () => (/* reexport */ pointInEllipse),
  precalculatePointInEllipse: () => (/* reexport */ precalculatePointInEllipse)
});

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/ellipse/pointInEllipse.js
function pointInEllipse(ellipse, pointLPS, inverts = {}) {
    if (!inverts.precalculated) {
        precalculatePointInEllipse(ellipse, inverts);
    }
    return inverts.precalculated(pointLPS);
}
const precalculatePointInEllipse = (ellipse, inverts = {}) => {
    const { xRadius, yRadius, zRadius } = ellipse;
    if (inverts.invXRadiusSq === undefined ||
        inverts.invYRadiusSq === undefined ||
        inverts.invZRadiusSq === undefined) {
        inverts.invXRadiusSq = xRadius !== 0 ? 1 / xRadius ** 2 : 0;
        inverts.invYRadiusSq = yRadius !== 0 ? 1 / yRadius ** 2 : 0;
        inverts.invZRadiusSq = zRadius !== 0 ? 1 / zRadius ** 2 : 0;
    }
    const { invXRadiusSq, invYRadiusSq, invZRadiusSq } = inverts;
    const { center } = ellipse;
    const [centerL, centerP, centerS] = center;
    inverts.precalculated = (pointLPS) => {
        const dx = pointLPS[0] - centerL;
        let inside = dx * dx * invXRadiusSq;
        if (inside > 1) {
            return false;
        }
        const dy = pointLPS[1] - centerP;
        inside += dy * dy * invYRadiusSq;
        if (inside > 1) {
            return false;
        }
        const dz = pointLPS[2] - centerS;
        inside += dz * dz * invZRadiusSq;
        return inside <= 1;
    };
    return inverts;
};


;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/ellipse/getCanvasEllipseCorners.js
function getCanvasEllipseCorners(ellipseCanvasPoints) {
    const [bottom, top, left, right] = ellipseCanvasPoints;
    const topLeft = [left[0], top[1]];
    const bottomRight = [right[0], bottom[1]];
    return [topLeft, bottomRight];
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/ellipse/index.js





/***/ }),

/***/ 17787:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IM: () => (/* binding */ clipInterval),
/* harmony export */   Mo: () => (/* binding */ calculateInnerFanPercentage),
/* harmony export */   R3: () => (/* binding */ intervalFromPoints),
/* harmony export */   V0: () => (/* binding */ subtractIntervals),
/* harmony export */   l7: () => (/* binding */ mergeIntervals),
/* harmony export */   xA: () => (/* binding */ angleFromCenter)
/* harmony export */ });
function normalizeAngle(angle) {
    return ((angle % 360) + 360) % 360;
}
function angleFromCenter(center, point) {
    const dx = point[0] - center[0];
    const dy = point[1] - center[1];
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    return normalizeAngle(angle);
}
function intervalFromPoints(center, pair) {
    const start = angleFromCenter(center, pair[0]);
    const end = angleFromCenter(center, pair[1]);
    return start < end ? [start, end] : [end, start];
}
function mergeIntervals(intervals) {
    if (!intervals.length) {
        return [];
    }
    intervals.sort((a, b) => a[0] - b[0]);
    const merged = [intervals[0].slice()];
    for (let i = 1; i < intervals.length; i++) {
        const last = merged[merged.length - 1];
        const current = intervals[i];
        if (current[0] <= last[1]) {
            last[1] = Math.max(last[1], current[1]);
        }
        else {
            merged.push(current.slice());
        }
    }
    return merged;
}
function subtractIntervals(blocked, target) {
    const [T0, T1] = target;
    if (T1 <= T0) {
        return [];
    }
    const overlaps = blocked
        .map(([a, b]) => [Math.max(a, T0), Math.min(b, T1)])
        .filter(([a, b]) => b > a);
    if (overlaps.length === 0) {
        return [[T0, T1]];
    }
    overlaps.sort((p, q) => p[0] - q[0]);
    const merged = [];
    let [curA, curB] = overlaps[0];
    for (let i = 1; i < overlaps.length; i++) {
        const [a, b] = overlaps[i];
        if (a <= curB) {
            curB = Math.max(curB, b);
        }
        else {
            merged.push([curA, curB]);
            [curA, curB] = [a, b];
        }
    }
    merged.push([curA, curB]);
    const gaps = [];
    let cursor = T0;
    for (const [a, b] of merged) {
        if (a > cursor) {
            gaps.push([cursor, a]);
        }
        cursor = Math.max(cursor, b);
    }
    if (cursor < T1) {
        gaps.push([cursor, T1]);
    }
    return gaps;
}
function clipInterval(inner, outerMerged) {
    const result = [];
    for (const out of outerMerged) {
        const start = Math.max(inner[0], out[0]);
        const end = Math.min(inner[1], out[1]);
        if (start < end) {
            result.push([start, end]);
        }
    }
    return result;
}
function calculateInnerFanPercentage(center, outerFanPairs, innerFanPairs) {
    const outerIntervals = outerFanPairs.map((pair) => intervalFromPoints(center, pair));
    const mergedOuter = mergeIntervals(outerIntervals);
    const outerTotal = mergedOuter.reduce((sum, [a, b]) => sum + (b - a), 0);
    if (outerTotal === 0) {
        return 0;
    }
    const clippedInnerIntervals = [];
    for (const pair of innerFanPairs) {
        const innerInterval = intervalFromPoints(center, pair);
        const clipped = clipInterval(innerInterval, mergedOuter);
        clippedInnerIntervals.push(...clipped);
    }
    const mergedInner = mergeIntervals(clippedInnerIntervals);
    const innerTotal = mergedInner.reduce((sum, [a, b]) => sum + (b - a), 0);
    const percentage = (innerTotal / outerTotal) * 100;
    return Math.min(100, Math.max(0, percentage));
}


/***/ }),

/***/ 18989:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ distanceToPointSquared)
/* harmony export */ });
/* harmony import */ var _distanceToPointSquaredInfo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(73149);

function distanceToPointSquared(lineStart, lineEnd, point) {
    return (0,_distanceToPointSquaredInfo__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(lineStart, lineEnd, point).distanceSquared;
}


/***/ }),

/***/ 73149:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ distanceToPointSquaredInfo)
/* harmony export */ });
/* harmony import */ var _point__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(82216);

function distanceToPointSquaredInfo(lineStart, lineEnd, point) {
    let closestPoint;
    const distanceSquared = (0,_point__WEBPACK_IMPORTED_MODULE_0__.distanceToPointSquared)(lineStart, lineEnd);
    if (lineStart[0] === lineEnd[0] && lineStart[1] === lineEnd[1]) {
        closestPoint = lineStart;
    }
    if (!closestPoint) {
        const dotProduct = ((point[0] - lineStart[0]) * (lineEnd[0] - lineStart[0]) +
            (point[1] - lineStart[1]) * (lineEnd[1] - lineStart[1])) /
            distanceSquared;
        if (dotProduct < 0) {
            closestPoint = lineStart;
        }
        else if (dotProduct > 1) {
            closestPoint = lineEnd;
        }
        else {
            closestPoint = [
                lineStart[0] + dotProduct * (lineEnd[0] - lineStart[0]),
                lineStart[1] + dotProduct * (lineEnd[1] - lineStart[1]),
            ];
        }
    }
    return {
        point: [...closestPoint],
        distanceSquared: (0,_point__WEBPACK_IMPORTED_MODULE_0__.distanceToPointSquared)(point, closestPoint),
    };
}


/***/ }),

/***/ 91818:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ isPointOnLineSegment)
/* harmony export */ });
const ORIENTATION_TOLERANCE = 1e-2;
function isPointOnLineSegment(lineStart, lineEnd, point) {
    const minX = lineStart[0] <= lineEnd[0] ? lineStart[0] : lineEnd[0];
    const maxX = lineStart[0] >= lineEnd[0] ? lineStart[0] : lineEnd[0];
    const minY = lineStart[1] <= lineEnd[1] ? lineStart[1] : lineEnd[1];
    const maxY = lineStart[1] >= lineEnd[1] ? lineStart[1] : lineEnd[1];
    const aabbContainsPoint = point[0] >= minX - ORIENTATION_TOLERANCE &&
        point[0] <= maxX + ORIENTATION_TOLERANCE &&
        point[1] >= minY - ORIENTATION_TOLERANCE &&
        point[1] <= maxY + ORIENTATION_TOLERANCE;
    if (!aabbContainsPoint) {
        return false;
    }
    const orientation = (lineEnd[1] - lineStart[1]) * (point[0] - lineEnd[0]) -
        (lineEnd[0] - lineStart[0]) * (point[1] - lineEnd[1]);
    const absOrientation = orientation >= 0 ? orientation : -orientation;
    return absOrientation <= ORIENTATION_TOLERANCE;
}


/***/ }),

/***/ 82983:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   f: () => (/* binding */ midPoint2)
/* harmony export */ });
const midPoint = (...args) => {
    const ret = args[0].length === 2 ? [0, 0] : [0, 0, 0];
    const len = args.length;
    for (const arg of args) {
        ret[0] += arg[0] / len;
        ret[1] += arg[1] / len;
        if (ret.length === 3) {
            ret[2] += arg[2] / len;
        }
    }
    return ret;
};
const midPoint2 = midPoint;
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (midPoint)));



/***/ }),

/***/ 82216:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  distanceToPoint: () => (/* reexport */ distanceToPoint),
  distanceToPointSquared: () => (/* reexport */ distanceToPointSquared),
  mirror: () => (/* reexport */ mirror)
});

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/point/distanceToPointSquared.js
function distanceToPointSquared(p1, p2) {
    if (p1.length !== p2.length) {
        throw Error('Both points should have the same dimensionality');
    }
    const [x1, y1, z1 = 0] = p1;
    const [x2, y2, z2 = 0] = p2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    return dx * dx + dy * dy + dz * dz;
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/point/distanceToPoint.js

function distanceToPoint(p1, p2) {
    return Math.sqrt(distanceToPointSquared(p1, p2));
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/point/mirror.js
function mirror(mirrorPoint, staticPoint) {
    const [x1, y1] = mirrorPoint;
    const [x2, y2] = staticPoint;
    const newX = 2 * x2 - x1;
    const newY = 2 * y2 - y1;
    return [newX, newY];
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/point/index.js





/***/ }),

/***/ 97792:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3823);


const addCanvasPointsToArray = (element, canvasPoints, newCanvasPoint, commonData) => {
    const { xDir, yDir, spacing } = commonData;
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
    const { viewport } = enabledElement;
    if (!canvasPoints.length) {
        canvasPoints.push(newCanvasPoint);
        console.log('>>>>> !canvasPoints. :: RETURN');
        return 1;
    }
    const lastWorldPos = viewport.canvasToWorld(canvasPoints[canvasPoints.length - 1]);
    const newWorldPos = viewport.canvasToWorld(newCanvasPoint);
    const worldPosDiff = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.subtract */ .eR.subtract(worldPosDiff, newWorldPos, lastWorldPos);
    const xDist = Math.abs(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.dot */ .eR.dot(worldPosDiff, xDir));
    const yDist = Math.abs(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.dot */ .eR.dot(worldPosDiff, yDir));
    const numPointsToAdd = Math.max(Math.floor(xDist / spacing[0]), Math.floor(yDist / spacing[0]));
    if (numPointsToAdd > 1) {
        const lastCanvasPoint = canvasPoints[canvasPoints.length - 1];
        const canvasDist = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.dist */ .Zc.dist(lastCanvasPoint, newCanvasPoint);
        const canvasDir = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.create */ .Zc.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.subtract */ .Zc.subtract(canvasDir, newCanvasPoint, lastCanvasPoint);
        gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.set */ .Zc.set(canvasDir, canvasDir[0] / canvasDist, canvasDir[1] / canvasDist);
        const distPerPoint = canvasDist / numPointsToAdd;
        for (let i = 1; i <= numPointsToAdd; i++) {
            canvasPoints.push([
                lastCanvasPoint[0] + distPerPoint * canvasDir[0] * i,
                lastCanvasPoint[1] + distPerPoint * canvasDir[1] * i,
            ]);
        }
    }
    else {
        canvasPoints.push(newCanvasPoint);
    }
    return numPointsToAdd;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (addCanvasPointsToArray);


/***/ }),

/***/ 56777:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ areLineSegmentsIntersecting)
/* harmony export */ });
function areLineSegmentsIntersecting(p1, q1, p2, q2) {
    let result = false;
    const line1MinX = p1[0] < q1[0] ? p1[0] : q1[0];
    const line1MinY = p1[1] < q1[1] ? p1[1] : q1[1];
    const line1MaxX = p1[0] > q1[0] ? p1[0] : q1[0];
    const line1MaxY = p1[1] > q1[1] ? p1[1] : q1[1];
    const line2MinX = p2[0] < q2[0] ? p2[0] : q2[0];
    const line2MinY = p2[1] < q2[1] ? p2[1] : q2[1];
    const line2MaxX = p2[0] > q2[0] ? p2[0] : q2[0];
    const line2MaxY = p2[1] > q2[1] ? p2[1] : q2[1];
    if (line1MinX > line2MaxX ||
        line1MaxX < line2MinX ||
        line1MinY > line2MaxY ||
        line1MaxY < line2MinY) {
        return false;
    }
    const orient = [
        orientation(p1, q1, p2),
        orientation(p1, q1, q2),
        orientation(p2, q2, p1),
        orientation(p2, q2, q1),
    ];
    if (orient[0] !== orient[1] && orient[2] !== orient[3]) {
        return true;
    }
    if (orient[0] === 0 && onSegment(p1, p2, q1)) {
        result = true;
    }
    else if (orient[1] === 0 && onSegment(p1, q2, q1)) {
        result = true;
    }
    else if (orient[2] === 0 && onSegment(p2, p1, q2)) {
        result = true;
    }
    else if (orient[3] === 0 && onSegment(p2, q1, q2)) {
        result = true;
    }
    return result;
}
function orientation(p, q, r) {
    const orientationValue = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
    if (orientationValue === 0) {
        return 0;
    }
    return orientationValue > 0 ? 1 : 2;
}
function onSegment(p, q, r) {
    if (q[0] <= Math.max(p[0], r[0]) &&
        q[0] >= Math.min(p[0], r[0]) &&
        q[1] <= Math.max(p[1], r[1]) &&
        q[1] >= Math.min(p[1], r[1])) {
        return true;
    }
    return false;
}


/***/ }),

/***/ 68385:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ mergePolylines)
/* harmony export */ });
/* harmony import */ var _point__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(82216);
/* harmony import */ var _getLineSegmentIntersectionsIndexes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(37135);
/* harmony import */ var _containsPoint__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(46513);
/* harmony import */ var _containsPoints__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(42436);
/* harmony import */ var _intersectPolyline__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(405);
/* harmony import */ var _getNormal2__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(11377);
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(3823);
/* harmony import */ var _getLinesIntersection__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(10812);








var PolylinePointType;
(function (PolylinePointType) {
    PolylinePointType[PolylinePointType["Vertex"] = 0] = "Vertex";
    PolylinePointType[PolylinePointType["Intersection"] = 1] = "Intersection";
})(PolylinePointType || (PolylinePointType = {}));
var PolylinePointPosition;
(function (PolylinePointPosition) {
    PolylinePointPosition[PolylinePointPosition["Outside"] = -1] = "Outside";
    PolylinePointPosition[PolylinePointPosition["Edge"] = 0] = "Edge";
    PolylinePointPosition[PolylinePointPosition["Inside"] = 1] = "Inside";
})(PolylinePointPosition || (PolylinePointPosition = {}));
var PolylinePointDirection;
(function (PolylinePointDirection) {
    PolylinePointDirection[PolylinePointDirection["Exiting"] = -1] = "Exiting";
    PolylinePointDirection[PolylinePointDirection["Unknown"] = 0] = "Unknown";
    PolylinePointDirection[PolylinePointDirection["Entering"] = 1] = "Entering";
})(PolylinePointDirection || (PolylinePointDirection = {}));
function ensuresNextPointers(polylinePoints) {
    for (let i = 0, len = polylinePoints.length; i < len; i++) {
        const currentPoint = polylinePoints[i];
        if (!currentPoint.next) {
            currentPoint.next = polylinePoints[i === len - 1 ? 0 : i + 1];
        }
    }
}
function getSourceAndTargetPointsList(targetPolyline, sourcePolyline) {
    const targetPolylinePoints = [];
    const sourcePolylinePoints = [];
    const sourceIntersectionsCache = new Map();
    const isFirstPointInside = (0,_containsPoint__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)(sourcePolyline, targetPolyline[0]);
    let intersectionPointDirection = isFirstPointInside
        ? PolylinePointDirection.Exiting
        : PolylinePointDirection.Entering;
    for (let i = 0, len = targetPolyline.length; i < len; i++) {
        const p1 = targetPolyline[i];
        const pointInside = (0,_containsPoint__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)(sourcePolyline, p1);
        const vertexPoint = {
            type: PolylinePointType.Vertex,
            coordinates: p1,
            position: pointInside
                ? PolylinePointPosition.Inside
                : PolylinePointPosition.Outside,
            visited: false,
            next: null,
        };
        targetPolylinePoints.push(vertexPoint);
        const q1 = targetPolyline[i === len - 1 ? 0 : i + 1];
        const intersectionsInfo = (0,_getLineSegmentIntersectionsIndexes__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(sourcePolyline, p1, q1).map((intersectedLineSegment) => {
            const sourceLineSegmentId = intersectedLineSegment[0];
            const p2 = sourcePolyline[intersectedLineSegment[0]];
            const q2 = sourcePolyline[intersectedLineSegment[1]];
            const intersectionCoordinate = (0,_getLinesIntersection__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A)(p1, q1, p2, q2);
            const targetStartPointDistSquared = _point__WEBPACK_IMPORTED_MODULE_0__.distanceToPointSquared(p1, intersectionCoordinate);
            return {
                sourceLineSegmentId,
                coordinate: intersectionCoordinate,
                targetStartPointDistSquared,
            };
        });
        intersectionsInfo.sort((left, right) => left.targetStartPointDistSquared - right.targetStartPointDistSquared);
        intersectionsInfo.forEach((intersectionInfo) => {
            const { sourceLineSegmentId, coordinate: intersectionCoordinate } = intersectionInfo;
            const targetEdgePoint = {
                type: PolylinePointType.Intersection,
                coordinates: intersectionCoordinate,
                position: PolylinePointPosition.Edge,
                direction: intersectionPointDirection,
                visited: false,
                next: null,
            };
            const sourceEdgePoint = {
                ...targetEdgePoint,
                direction: PolylinePointDirection.Unknown,
                cloned: true,
            };
            if (intersectionPointDirection === PolylinePointDirection.Entering) {
                targetEdgePoint.next = sourceEdgePoint;
            }
            else {
                sourceEdgePoint.next = targetEdgePoint;
            }
            let sourceIntersectionPoints = sourceIntersectionsCache.get(sourceLineSegmentId);
            if (!sourceIntersectionPoints) {
                sourceIntersectionPoints = [];
                sourceIntersectionsCache.set(sourceLineSegmentId, sourceIntersectionPoints);
            }
            targetPolylinePoints.push(targetEdgePoint);
            sourceIntersectionPoints.push(sourceEdgePoint);
            intersectionPointDirection *= -1;
        });
    }
    for (let i = 0, len = sourcePolyline.length; i < len; i++) {
        const lineSegmentId = i;
        const p1 = sourcePolyline[i];
        const vertexPoint = {
            type: PolylinePointType.Vertex,
            coordinates: p1,
            visited: false,
            next: null,
        };
        sourcePolylinePoints.push(vertexPoint);
        const sourceIntersectionPoints = sourceIntersectionsCache.get(lineSegmentId);
        if (!sourceIntersectionPoints?.length) {
            continue;
        }
        sourceIntersectionPoints
            .map((intersectionPoint) => ({
            intersectionPoint,
            lineSegStartDistSquared: _point__WEBPACK_IMPORTED_MODULE_0__.distanceToPointSquared(p1, intersectionPoint.coordinates),
        }))
            .sort((left, right) => left.lineSegStartDistSquared - right.lineSegStartDistSquared)
            .map(({ intersectionPoint }) => intersectionPoint)
            .forEach((intersectionPoint) => sourcePolylinePoints.push(intersectionPoint));
    }
    ensuresNextPointers(targetPolylinePoints);
    ensuresNextPointers(sourcePolylinePoints);
    return { targetPolylinePoints, sourcePolylinePoints };
}
function getUnvisitedOutsidePoint(polylinePoints) {
    for (let i = 0, len = polylinePoints.length; i < len; i++) {
        const point = polylinePoints[i];
        if (!point.visited &&
            point.position === PolylinePointPosition.Outside &&
            point.type === PolylinePointType.Vertex) {
            return point;
        }
    }
    for (let i = 0, len = polylinePoints.length; i < len; i++) {
        const point = polylinePoints[i];
        if (!point.visited && point.position === PolylinePointPosition.Outside) {
            return point;
        }
    }
    return undefined;
}
function mergePolylines(targetPolyline, sourcePolyline) {
    const targetNormal = (0,_getNormal2__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A)(targetPolyline);
    const sourceNormal = (0,_getNormal2__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A)(sourcePolyline);
    const dotNormals = gl_matrix__WEBPACK_IMPORTED_MODULE_6__/* .vec3.dot */ .eR.dot(sourceNormal, targetNormal);
    if (!gl_matrix__WEBPACK_IMPORTED_MODULE_6__/* .glMatrix.equals */ .Fd.equals(1, dotNormals)) {
        sourcePolyline = sourcePolyline.slice().reverse();
    }
    const lineSegmentsIntersect = (0,_intersectPolyline__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A)(sourcePolyline, targetPolyline);
    const targetContainedInSource = !lineSegmentsIntersect && (0,_containsPoints__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)(sourcePolyline, targetPolyline);
    if (targetContainedInSource) {
        return sourcePolyline.slice();
    }
    const { targetPolylinePoints } = getSourceAndTargetPointsList(targetPolyline, sourcePolyline);
    const startPoint = getUnvisitedOutsidePoint(targetPolylinePoints);
    if (!startPoint) {
        return targetPolyline.slice();
    }
    const mergedPolyline = [startPoint.coordinates];
    let currentPoint = startPoint.next;
    let iterationCount = 0;
    const maxIterations = targetPolyline.length + sourcePolyline.length + 1000;
    while (currentPoint !== startPoint && iterationCount < maxIterations) {
        iterationCount++;
        if (currentPoint.type === PolylinePointType.Intersection &&
            currentPoint.cloned) {
            currentPoint = currentPoint.next;
            continue;
        }
        mergedPolyline.push(currentPoint.coordinates);
        currentPoint = currentPoint.next;
        if (!currentPoint) {
            console.warn('Broken linked list detected in mergePolylines, breaking loop');
            break;
        }
    }
    if (iterationCount >= maxIterations) {
        console.warn('Maximum iterations reached in mergePolylines, possible infinite loop detected');
    }
    return mergedPolyline;
}



/***/ }),

/***/ 46513:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ containsPoint)
/* harmony export */ });
/* harmony import */ var _isClosed__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19246);

function containsPoint(polyline, point, options = {
    closed: undefined,
}) {
    if (polyline.length < 3) {
        return false;
    }
    const numPolylinePoints = polyline.length;
    let numIntersections = 0;
    const { closed, holes } = options;
    if (holes?.length) {
        for (const hole of holes) {
            if (containsPoint(hole, point)) {
                return false;
            }
        }
    }
    const shouldClose = !(closed === undefined ? (0,_isClosed__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(polyline) : closed);
    const maxSegmentIndex = polyline.length - (shouldClose ? 1 : 2);
    for (let i = 0; i <= maxSegmentIndex; i++) {
        const p1 = polyline[i];
        const p2Index = i === numPolylinePoints - 1 ? 0 : i + 1;
        const p2 = polyline[p2Index];
        const maxX = p1[0] >= p2[0] ? p1[0] : p2[0];
        const maxY = p1[1] >= p2[1] ? p1[1] : p2[1];
        const minY = p1[1] <= p2[1] ? p1[1] : p2[1];
        const mayIntersectLineSegment = point[0] <= maxX && point[1] >= minY && point[1] < maxY;
        if (mayIntersectLineSegment) {
            const isVerticalLine = p1[0] === p2[0];
            let intersects = isVerticalLine;
            if (!intersects) {
                const xIntersection = ((point[1] - p1[1]) * (p2[0] - p1[0])) / (p2[1] - p1[1]) + p1[0];
                intersects = point[0] <= xIntersection;
            }
            numIntersections += intersects ? 1 : 0;
        }
    }
    return !!(numIntersections % 2);
}


/***/ }),

/***/ 58754:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ convexHull)
/* harmony export */ });
function convexHull(pts) {
    if (pts.length < 3) {
        return pts.slice();
    }
    const points = pts
        .map((p) => [p[0], p[1]])
        .sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);
    function cross(o, a, b) {
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    }
    const lower = [];
    for (const p of points) {
        while (lower.length >= 2 &&
            cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
            lower.pop();
        }
        lower.push(p);
    }
    const upper = [];
    for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        while (upper.length >= 2 &&
            cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
            upper.pop();
        }
        upper.push(p);
    }
    lower.pop();
    upper.pop();
    return lower.concat(upper);
}


/***/ }),

/***/ 98122:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getAABB)
/* harmony export */ });
function getAABB(polyline, options) {
    let polylineToUse = polyline;
    const numDimensions = options?.numDimensions || 2;
    const is3D = numDimensions === 3;
    if (!Array.isArray(polyline[0])) {
        const currentPolyline = polyline;
        const totalPoints = currentPolyline.length / numDimensions;
        polylineToUse = new Array(currentPolyline.length / numDimensions);
        for (let i = 0, len = totalPoints; i < len; i++) {
            polylineToUse[i] = [
                currentPolyline[i * numDimensions],
                currentPolyline[i * numDimensions + 1],
            ];
            if (is3D) {
                polylineToUse[i].push(currentPolyline[i * numDimensions + 2]);
            }
        }
    }
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let minZ = Infinity;
    let maxZ = -Infinity;
    polylineToUse = polylineToUse;
    for (let i = 0, len = polylineToUse.length; i < len; i++) {
        const [x, y, z] = polylineToUse[i];
        minX = minX < x ? minX : x;
        minY = minY < y ? minY : y;
        maxX = maxX > x ? maxX : x;
        maxY = maxY > y ? maxY : y;
        if (is3D) {
            minZ = minZ < z ? minZ : z;
            maxZ = maxZ > z ? maxZ : z;
        }
    }
    return is3D
        ? { minX, maxX, minY, maxY, minZ, maxZ }
        : { minX, maxX, minY, maxY };
}


/***/ }),

/***/ 86909:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getArea)
/* harmony export */ });
function getArea(points) {
    const n = points.length;
    let area = 0.0;
    let j = n - 1;
    for (let i = 0; i < n; i++) {
        area += (points[j][0] + points[i][0]) * (points[j][1] - points[i][1]);
        j = i;
    }
    return Math.abs(area / 2.0);
}


/***/ }),

/***/ 32979:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getClosestLineSegmentIntersection)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);
/* harmony import */ var _areLineSegmentsIntersecting__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(56777);


function getClosestLineSegmentIntersection(points, p1, q1, closed = true) {
    let initialQ2Index;
    let p2Index;
    if (closed) {
        p2Index = points.length - 1;
        initialQ2Index = 0;
    }
    else {
        p2Index = 0;
        initialQ2Index = 1;
    }
    const intersections = [];
    for (let q2Index = initialQ2Index; q2Index < points.length; q2Index++) {
        const p2 = points[p2Index];
        const q2 = points[q2Index];
        if ((0,_areLineSegmentsIntersecting__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(p1, q1, p2, q2)) {
            intersections.push([p2Index, q2Index]);
        }
        p2Index = q2Index;
    }
    if (intersections.length === 0) {
        return;
    }
    const distances = [];
    intersections.forEach((intersection) => {
        const intersectionPoints = [
            points[intersection[0]],
            points[intersection[1]],
        ];
        const midpoint = [
            (intersectionPoints[0][0] + intersectionPoints[1][0]) / 2,
            (intersectionPoints[0][1] + intersectionPoints[1][1]) / 2,
        ];
        distances.push(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.distance */ .Zc.distance(midpoint, p1));
    });
    const minDistance = Math.min(...distances);
    const indexOfMinDistance = distances.indexOf(minDistance);
    return {
        segment: intersections[indexOfMinDistance],
        distance: minDistance,
    };
}


/***/ }),

/***/ 4338:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getFirstLineSegmentIntersectionIndexes)
/* harmony export */ });
/* harmony import */ var _areLineSegmentsIntersecting__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56777);

function getFirstLineSegmentIntersectionIndexes(points, p1, q1, closed = true) {
    let initialI;
    let j;
    if (closed) {
        j = points.length - 1;
        initialI = 0;
    }
    else {
        j = 0;
        initialI = 1;
    }
    for (let i = initialI; i < points.length; i++) {
        const p2 = points[j];
        const q2 = points[i];
        if ((0,_areLineSegmentsIntersecting__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(p1, q1, p2, q2)) {
            return [j, i];
        }
        j = i;
    }
}


/***/ }),

/***/ 50932:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getLineSegmentIntersectionsCoordinates)
/* harmony export */ });
/* harmony import */ var _getLineSegmentIntersectionsIndexes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(37135);
/* harmony import */ var _getLinesIntersection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10812);


function getLineSegmentIntersectionsCoordinates(points, p1, q1, closed = true) {
    const result = [];
    const polylineIndexes = (0,_getLineSegmentIntersectionsIndexes__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(points, p1, q1, closed);
    for (let i = 0; i < polylineIndexes.length; i++) {
        const p2 = points[polylineIndexes[i][0]];
        const q2 = points[polylineIndexes[i][1]];
        const intersection = (0,_getLinesIntersection__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(p1, q1, p2, q2);
        result.push(intersection);
    }
    return result;
}


/***/ }),

/***/ 37135:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getLineSegmentIntersectionsIndexes)
/* harmony export */ });
/* harmony import */ var _areLineSegmentsIntersecting__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56777);

function getLineSegmentIntersectionsIndexes(polyline, p1, q1, closed = true) {
    const intersections = [];
    const numPoints = polyline.length;
    const maxI = numPoints - (closed ? 1 : 2);
    for (let i = 0; i <= maxI; i++) {
        const p2 = polyline[i];
        const j = i === numPoints - 1 ? 0 : i + 1;
        const q2 = polyline[j];
        if ((0,_areLineSegmentsIntersecting__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(p1, q1, p2, q2)) {
            intersections.push([i, j]);
        }
    }
    return intersections;
}


/***/ }),

/***/ 10812:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getLinesIntersection)
/* harmony export */ });
/* harmony import */ var _line__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(93258);

const PARALLEL_LINES_TOLERANCE = 1e-2;
function getLinesIntersection(p1, q1, p2, q2) {
    const diffQ1P1 = [q1[0] - p1[0], q1[1] - p1[1]];
    const diffQ2P2 = [q2[0] - p2[0], q2[1] - p2[1]];
    const denominator = diffQ2P2[1] * diffQ1P1[0] - diffQ2P2[0] * diffQ1P1[1];
    const absDenominator = denominator >= 0 ? denominator : -denominator;
    if (absDenominator < PARALLEL_LINES_TOLERANCE) {
        const line1AABB = [
            p1[0] < q1[0] ? p1[0] : q1[0],
            p1[0] > q1[0] ? p1[0] : q1[0],
            p1[1] < q1[1] ? p1[1] : q1[1],
            p1[1] > q1[1] ? p1[1] : q1[1],
        ];
        const line2AABB = [
            p2[0] < q2[0] ? p2[0] : q2[0],
            p2[0] > q2[0] ? p2[0] : q2[0],
            p2[1] < q2[1] ? p2[1] : q2[1],
            p2[1] > q2[1] ? p2[1] : q2[1],
        ];
        const aabbIntersects = line1AABB[0] <= line2AABB[1] &&
            line1AABB[1] >= line2AABB[0] &&
            line1AABB[2] <= line2AABB[3] &&
            line1AABB[3] >= line2AABB[2];
        if (!aabbIntersects) {
            return;
        }
        const overlap = _line__WEBPACK_IMPORTED_MODULE_0__.isPointOnLineSegment(p1, q1, p2) ||
            _line__WEBPACK_IMPORTED_MODULE_0__.isPointOnLineSegment(p1, q1, q2) ||
            _line__WEBPACK_IMPORTED_MODULE_0__.isPointOnLineSegment(p2, q2, p1);
        if (!overlap) {
            return;
        }
        const minX = line1AABB[0] > line2AABB[0] ? line1AABB[0] : line2AABB[0];
        const maxX = line1AABB[1] < line2AABB[1] ? line1AABB[1] : line2AABB[1];
        const minY = line1AABB[2] > line2AABB[2] ? line1AABB[2] : line2AABB[2];
        const maxY = line1AABB[3] < line2AABB[3] ? line1AABB[3] : line2AABB[3];
        const midX = (minX + maxX) * 0.5;
        const midY = (minY + maxY) * 0.5;
        return [midX, midY];
    }
    let a = p1[1] - p2[1];
    let b = p1[0] - p2[0];
    const numerator1 = diffQ2P2[0] * a - diffQ2P2[1] * b;
    const numerator2 = diffQ1P1[0] * a - diffQ1P1[1] * b;
    a = numerator1 / denominator;
    b = numerator2 / denominator;
    const resultX = p1[0] + a * diffQ1P1[0];
    const resultY = p1[1] + a * diffQ1P1[1];
    return [resultX, resultY];
}


/***/ }),

/***/ 11377:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getNormal2)
/* harmony export */ });
/* harmony import */ var _getSignedArea__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63113);

function getNormal2(polyline) {
    const area = (0,_getSignedArea__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(polyline);
    return [0, 0, area / Math.abs(area)];
}


/***/ }),

/***/ 43490:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getNormal3)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);

function _getAreaVector(polyline) {
    const vecArea = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
    const refPoint = polyline[0];
    for (let i = 0, len = polyline.length; i < len; i++) {
        const p1 = polyline[i];
        const p2Index = i === len - 1 ? 0 : i + 1;
        const p2 = polyline[p2Index];
        const aX = p1[0] - refPoint[0];
        const aY = p1[1] - refPoint[1];
        const aZ = p1[2] - refPoint[2];
        const bX = p2[0] - refPoint[0];
        const bY = p2[1] - refPoint[1];
        const bZ = p2[2] - refPoint[2];
        vecArea[0] += aY * bZ - aZ * bY;
        vecArea[1] += aZ * bX - aX * bZ;
        vecArea[2] += aX * bY - aY * bX;
    }
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.scale */ .eR.scale(vecArea, vecArea, 0.5);
    return vecArea;
}
function getNormal3(polyline) {
    const vecArea = _getAreaVector(polyline);
    return gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.normalize */ .eR.normalize(vecArea, vecArea);
}


/***/ }),

/***/ 61785:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3823);


const EPSILON = 1e-3;
const getSubPixelSpacingAndXYDirections = (viewport, subPixelResolution) => {
    let spacing;
    let xDir;
    let yDir;
    if (viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.StackViewport) {
        const imageData = viewport.getImageData();
        if (!imageData) {
            return;
        }
        xDir = imageData.direction.slice(0, 3);
        yDir = imageData.direction.slice(3, 6);
        spacing = imageData.spacing;
    }
    else {
        const imageData = viewport.getImageData();
        const { direction, spacing: volumeSpacing } = imageData;
        const { viewPlaneNormal, viewUp } = viewport.getCamera();
        const iVector = direction.slice(0, 3);
        const jVector = direction.slice(3, 6);
        const kVector = direction.slice(6, 9);
        const viewRight = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.create */ .eR.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.cross */ .eR.cross(viewRight, viewUp, viewPlaneNormal);
        const absViewRightDotI = Math.abs(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.dot */ .eR.dot(viewRight, iVector));
        const absViewRightDotJ = Math.abs(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.dot */ .eR.dot(viewRight, jVector));
        const absViewRightDotK = Math.abs(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.dot */ .eR.dot(viewRight, kVector));
        let xSpacing;
        if (Math.abs(1 - absViewRightDotI) < EPSILON) {
            xSpacing = volumeSpacing[0];
            xDir = iVector;
        }
        else if (Math.abs(1 - absViewRightDotJ) < EPSILON) {
            xSpacing = volumeSpacing[1];
            xDir = jVector;
        }
        else if (Math.abs(1 - absViewRightDotK) < EPSILON) {
            xSpacing = volumeSpacing[2];
            xDir = kVector;
        }
        else {
            throw new Error('No support yet for oblique plane planar contours');
        }
        const absViewUpDotI = Math.abs(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.dot */ .eR.dot(viewUp, iVector));
        const absViewUpDotJ = Math.abs(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.dot */ .eR.dot(viewUp, jVector));
        const absViewUpDotK = Math.abs(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.dot */ .eR.dot(viewUp, kVector));
        let ySpacing;
        if (Math.abs(1 - absViewUpDotI) < EPSILON) {
            ySpacing = volumeSpacing[0];
            yDir = iVector;
        }
        else if (Math.abs(1 - absViewUpDotJ) < EPSILON) {
            ySpacing = volumeSpacing[1];
            yDir = jVector;
        }
        else if (Math.abs(1 - absViewUpDotK) < EPSILON) {
            ySpacing = volumeSpacing[2];
            yDir = kVector;
        }
        else {
            throw new Error('No support yet for oblique plane planar contours');
        }
        spacing = [xSpacing, ySpacing];
    }
    const subPixelSpacing = [
        spacing[0] / subPixelResolution,
        spacing[1] / subPixelResolution,
    ];
    return { spacing: subPixelSpacing, xDir, yDir };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getSubPixelSpacingAndXYDirections);


/***/ }),

/***/ 4239:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getWindingDirection)
/* harmony export */ });
/* harmony import */ var _getSignedArea__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63113);

function getWindingDirection(polyline) {
    const signedArea = (0,_getSignedArea__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(polyline);
    return signedArea >= 0 ? 1 : -1;
}


/***/ }),

/***/ 405:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ intersectPolyline)
/* harmony export */ });
/* harmony import */ var _getFirstLineSegmentIntersectionIndexes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4338);

function intersectPolyline(sourcePolyline, targetPolyline) {
    for (let i = 0, sourceLen = sourcePolyline.length; i < sourceLen; i++) {
        const sourceP1 = sourcePolyline[i];
        const sourceP2Index = i === sourceLen - 1 ? 0 : i + 1;
        const sourceP2 = sourcePolyline[sourceP2Index];
        const intersectionPointIndexes = (0,_getFirstLineSegmentIntersectionIndexes__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(targetPolyline, sourceP1, sourceP2);
        if (intersectionPointIndexes?.length === 2) {
            return true;
        }
    }
    return false;
}


/***/ }),

/***/ 70112:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ intersectPolylines)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);
/* harmony import */ var _containsPoint__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(46513);
/* harmony import */ var _getSignedArea__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(63113);
/* harmony import */ var _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(36039);




function intersectPolylines(mainPolyCoords, clipPolyCoordsInput) {
    if (mainPolyCoords.length < 3 || clipPolyCoordsInput.length < 3) {
        return [];
    }
    let clipPolyCoords = clipPolyCoordsInput.slice();
    const mainArea = (0,_getSignedArea__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)(mainPolyCoords);
    const clipArea = (0,_getSignedArea__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)(clipPolyCoords);
    if (Math.abs(mainArea) < _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .EPSILON */ .p8 || Math.abs(clipArea) < _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .EPSILON */ .p8) {
        return [];
    }
    if (mainArea < 0) {
        mainPolyCoords = mainPolyCoords.slice().reverse();
    }
    if (clipArea < 0) {
        clipPolyCoords = clipPolyCoords.slice().reverse();
    }
    const currentClipPolyForPIP = clipPolyCoords;
    const intersections = [];
    for (let i = 0; i < mainPolyCoords.length; i++) {
        const p1 = mainPolyCoords[i];
        const p2 = mainPolyCoords[(i + 1) % mainPolyCoords.length];
        for (let j = 0; j < clipPolyCoords.length; j++) {
            const q1 = clipPolyCoords[j];
            const q2 = clipPolyCoords[(j + 1) % clipPolyCoords.length];
            const intersectPt = (0,_robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .robustSegmentIntersection */ .O4)(p1, p2, q1, q2);
            if (intersectPt) {
                const lenP = Math.sqrt(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.squaredDistance */ .Zc.squaredDistance(p1, p2));
                const lenQ = Math.sqrt(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.squaredDistance */ .Zc.squaredDistance(q1, q2));
                intersections.push({
                    coord: [...intersectPt],
                    seg1Idx: i,
                    seg2Idx: j,
                    alpha1: lenP < _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .EPSILON */ .p8
                        ? 0
                        : Math.sqrt(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.squaredDistance */ .Zc.squaredDistance(p1, intersectPt)) / lenP,
                    alpha2: lenQ < _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .EPSILON */ .p8
                        ? 0
                        : Math.sqrt(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.squaredDistance */ .Zc.squaredDistance(q1, intersectPt)) / lenQ,
                });
            }
        }
    }
    if (intersections.length === 0) {
        if ((0,_containsPoint__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(currentClipPolyForPIP, mainPolyCoords[0]) &&
            mainPolyCoords.every((pt) => (0,_containsPoint__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(currentClipPolyForPIP, pt))) {
            return [[...mainPolyCoords.map((p) => [...p])]];
        }
        if ((0,_containsPoint__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(mainPolyCoords, clipPolyCoords[0]) &&
            clipPolyCoords.every((pt) => (0,_containsPoint__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(mainPolyCoords, pt))) {
            return [[...clipPolyCoords.map((p) => [...p])]];
        }
        return [];
    }
    const buildAugmentedList = (polyCoords, polyIndex, allIntersections) => {
        const augmentedList = [];
        let nodeIdCounter = 0;
        for (let i = 0; i < polyCoords.length; i++) {
            const p1 = polyCoords[i];
            augmentedList.push({
                id: `${polyIndex}_v${nodeIdCounter++}`,
                coordinates: [...p1],
                type: _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .PolylineNodeType */ .n7.Vertex,
                originalPolyIndex: polyIndex,
                originalVertexIndex: i,
                next: null,
                prev: null,
                isIntersection: false,
                visited: false,
                processedInPath: false,
                intersectionDir: _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .IntersectionDirection */ .lG.Unknown,
            });
            const segmentIntersections = allIntersections
                .filter((isect) => (polyIndex === 0 ? isect.seg1Idx : isect.seg2Idx) === i)
                .sort((a, b) => (polyIndex === 0 ? a.alpha1 : a.alpha2) -
                (polyIndex === 0 ? b.alpha1 : b.alpha2));
            for (const isect of segmentIntersections) {
                if (augmentedList.length > 0 &&
                    (0,_robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .pointsAreEqual */ .Sk)(augmentedList[augmentedList.length - 1].coordinates, isect.coord)) {
                    const lastNode = augmentedList[augmentedList.length - 1];
                    if (!lastNode.isIntersection) {
                        lastNode.isIntersection = true;
                        lastNode.intersectionInfo = isect;
                        lastNode.alpha = polyIndex === 0 ? isect.alpha1 : isect.alpha2;
                        lastNode.type = _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .PolylineNodeType */ .n7.Intersection;
                    }
                    continue;
                }
                augmentedList.push({
                    id: `${polyIndex}_i${nodeIdCounter++}`,
                    coordinates: [...isect.coord],
                    type: _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .PolylineNodeType */ .n7.Intersection,
                    originalPolyIndex: polyIndex,
                    next: null,
                    prev: null,
                    isIntersection: true,
                    visited: false,
                    processedInPath: false,
                    alpha: polyIndex === 0 ? isect.alpha1 : isect.alpha2,
                    intersectionInfo: isect,
                    intersectionDir: _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .IntersectionDirection */ .lG.Unknown,
                });
            }
        }
        const finalList = [];
        if (augmentedList.length > 0) {
            finalList.push(augmentedList[0]);
            for (let i = 1; i < augmentedList.length; i++) {
                if (!(0,_robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .pointsAreEqual */ .Sk)(augmentedList[i].coordinates, finalList[finalList.length - 1].coordinates)) {
                    finalList.push(augmentedList[i]);
                }
                else {
                    const lastNodeInFinal = finalList[finalList.length - 1];
                    if (augmentedList[i].isIntersection &&
                        augmentedList[i].intersectionInfo) {
                        lastNodeInFinal.isIntersection = true;
                        lastNodeInFinal.intersectionInfo =
                            augmentedList[i].intersectionInfo;
                        lastNodeInFinal.alpha = augmentedList[i].alpha;
                        lastNodeInFinal.type = _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .PolylineNodeType */ .n7.Intersection;
                    }
                }
            }
        }
        if (finalList.length > 1 &&
            (0,_robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .pointsAreEqual */ .Sk)(finalList[0].coordinates, finalList[finalList.length - 1].coordinates)) {
            const firstNode = finalList[0];
            const lastNodePopped = finalList.pop();
            if (lastNodePopped.isIntersection &&
                !firstNode.isIntersection &&
                lastNodePopped.intersectionInfo) {
                firstNode.isIntersection = true;
                firstNode.intersectionInfo = lastNodePopped.intersectionInfo;
                firstNode.alpha = lastNodePopped.alpha;
                firstNode.type = _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .PolylineNodeType */ .n7.Intersection;
            }
        }
        if (finalList.length > 0) {
            for (let i = 0; i < finalList.length; i++) {
                finalList[i].next = finalList[(i + 1) % finalList.length];
                finalList[i].prev =
                    finalList[(i - 1 + finalList.length) % finalList.length];
            }
        }
        return finalList;
    };
    const mainAugmented = buildAugmentedList(mainPolyCoords, 0, intersections);
    const clipAugmented = buildAugmentedList(clipPolyCoords, 1, intersections);
    if (mainAugmented.length === 0 || clipAugmented.length === 0) {
        return [];
    }
    mainAugmented.forEach((mainNode) => {
        if (mainNode.isIntersection && mainNode.intersectionInfo) {
            const mainIntersectData = mainNode.intersectionInfo;
            const partnerNode = clipAugmented.find((clipNode) => clipNode.isIntersection &&
                clipNode.intersectionInfo &&
                (0,_robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .pointsAreEqual */ .Sk)(clipNode.coordinates, mainNode.coordinates) &&
                clipNode.intersectionInfo.seg1Idx === mainIntersectData.seg1Idx &&
                clipNode.intersectionInfo.seg2Idx === mainIntersectData.seg2Idx);
            if (partnerNode) {
                mainNode.partnerNode = partnerNode;
                partnerNode.partnerNode = mainNode;
                const v_arrival_main = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.subtract */ .Zc.subtract(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.create */ .Zc.create(), mainNode.coordinates, mainNode.prev.coordinates);
                const v_departure_clip = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.subtract */ .Zc.subtract(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.create */ .Zc.create(), partnerNode.next.coordinates, partnerNode.coordinates);
                const crossZ = v_arrival_main[0] * v_departure_clip[1] -
                    v_arrival_main[1] * v_departure_clip[0];
                if (crossZ > _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .EPSILON */ .p8) {
                    mainNode.intersectionDir = _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .IntersectionDirection */ .lG.Entering;
                    partnerNode.intersectionDir = _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .IntersectionDirection */ .lG.Exiting;
                }
                else if (crossZ < -_robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .EPSILON */ .p8) {
                    mainNode.intersectionDir = _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .IntersectionDirection */ .lG.Exiting;
                    partnerNode.intersectionDir = _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .IntersectionDirection */ .lG.Entering;
                }
                else {
                    const midPrevMainSeg = [
                        (mainNode.prev.coordinates[0] + mainNode.coordinates[0]) / 2,
                        (mainNode.prev.coordinates[1] + mainNode.coordinates[1]) / 2,
                    ];
                    if ((0,_containsPoint__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(currentClipPolyForPIP, midPrevMainSeg)) {
                        mainNode.intersectionDir = _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .IntersectionDirection */ .lG.Exiting;
                        partnerNode.intersectionDir = _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .IntersectionDirection */ .lG.Entering;
                    }
                    else {
                        mainNode.intersectionDir = _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .IntersectionDirection */ .lG.Entering;
                        partnerNode.intersectionDir = _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .IntersectionDirection */ .lG.Exiting;
                    }
                }
            }
            else {
                mainNode.isIntersection = false;
                mainNode.intersectionInfo = undefined;
            }
        }
    });
    const resultPolygons = [];
    for (const startCand of mainAugmented) {
        if (!startCand.isIntersection ||
            startCand.visited ||
            startCand.intersectionDir !== _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .IntersectionDirection */ .lG.Entering) {
            continue;
        }
        let currentPathCoords = [];
        let currentNode = startCand;
        let onMainList = true;
        const pathStartNode = startCand;
        let safetyBreak = 0;
        const maxIter = (mainAugmented.length + clipAugmented.length) * 2;
        mainAugmented.forEach((n) => (n.processedInPath = false));
        clipAugmented.forEach((n) => (n.processedInPath = false));
        do {
            if (safetyBreak++ > maxIter) {
                console.warn('Intersection: Max iterations in path tracing.', pathStartNode.id, currentNode.id);
                currentPathCoords = [];
                break;
            }
            if (currentNode.processedInPath && currentNode !== pathStartNode) {
                console.warn('Intersection: Path processing loop detected, discarding path segment.', pathStartNode.id, currentNode.id);
                currentPathCoords = [];
                break;
            }
            currentNode.processedInPath = true;
            currentNode.visited = true;
            if (currentPathCoords.length === 0 ||
                !(0,_robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .pointsAreEqual */ .Sk)(currentPathCoords[currentPathCoords.length - 1], currentNode.coordinates)) {
                currentPathCoords.push([...currentNode.coordinates]);
            }
            let switchedList = false;
            if (currentNode.isIntersection && currentNode.partnerNode) {
                if (onMainList) {
                    currentNode = currentNode.partnerNode;
                    onMainList = false;
                    switchedList = true;
                }
                else {
                    currentNode = currentNode.partnerNode;
                    onMainList = true;
                    switchedList = true;
                }
            }
            if (!switchedList) {
                currentNode = currentNode.next;
            }
            else {
                currentNode = currentNode.next;
            }
        } while (currentNode !== pathStartNode ||
            (onMainList && currentNode.originalPolyIndex !== 0) ||
            (!onMainList && currentNode.originalPolyIndex !== 1));
        if (safetyBreak > maxIter || currentPathCoords.length === 0) {
        }
        else if (currentPathCoords.length > 0 &&
            (0,_robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_3__/* .pointsAreEqual */ .Sk)(currentPathCoords[0], currentPathCoords[currentPathCoords.length - 1])) {
            currentPathCoords.pop();
        }
        if (currentPathCoords.length >= 3) {
            const resultArea = (0,_getSignedArea__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)(currentPathCoords);
            if (mainArea > 0 && resultArea < 0) {
                currentPathCoords.reverse();
            }
            else if (mainArea < 0 && resultArea > 0) {
                currentPathCoords.reverse();
            }
            resultPolygons.push(currentPathCoords.map((p) => [...p]));
        }
    }
    return resultPolygons;
}


/***/ }),

/***/ 8361:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   i: () => (/* binding */ isPointInsidePolyline3D)
/* harmony export */ });
/* harmony import */ var _containsPoint__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46513);
/* harmony import */ var _projectTo2D__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(28502);


function isPointInsidePolyline3D(point, polyline, options = {}) {
    const { sharedDimensionIndex, projectedPolyline } = (0,_projectTo2D__WEBPACK_IMPORTED_MODULE_1__/* .projectTo2D */ .p)(polyline);
    const { holes } = options;
    const projectedHoles = [];
    if (holes) {
        for (let i = 0; i < holes.length; i++) {
            const hole = holes[i];
            const hole2D = [];
            for (let j = 0; j < hole.length; j++) {
                hole2D.push([
                    hole[j][(sharedDimensionIndex + 1) % 3],
                    hole[j][(sharedDimensionIndex + 2) % 3],
                ]);
            }
            projectedHoles.push(hole2D);
        }
    }
    const point2D = [
        point[(sharedDimensionIndex + 1) % 3],
        point[(sharedDimensionIndex + 2) % 3],
    ];
    return (0,_containsPoint__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(projectedPolyline, point2D, { holes: projectedHoles });
}


/***/ }),

/***/ 80514:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);

const pointCanProjectOnLine = (p, p1, p2, proximity) => {
    const p1p = [p[0] - p1[0], p[1] - p1[1]];
    const p1p2 = [p2[0] - p1[0], p2[1] - p1[1]];
    const dot = p1p[0] * p1p2[0] + p1p[1] * p1p2[1];
    if (dot < 0) {
        return false;
    }
    const p1p2Mag = Math.sqrt(p1p2[0] * p1p2[0] + p1p2[1] * p1p2[1]);
    if (p1p2Mag === 0) {
        return false;
    }
    const projectionVectorMag = dot / p1p2Mag;
    const p1p2UnitVector = [p1p2[0] / p1p2Mag, p1p2[1] / p1p2Mag];
    const projectionVector = [
        p1p2UnitVector[0] * projectionVectorMag,
        p1p2UnitVector[1] * projectionVectorMag,
    ];
    const projectionPoint = [
        p1[0] + projectionVector[0],
        p1[1] + projectionVector[1],
    ];
    const distance = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.distance */ .Zc.distance(p, projectionPoint);
    if (distance > proximity) {
        return false;
    }
    if (gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.distance */ .Zc.distance(p1, projectionPoint) > gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.distance */ .Zc.distance(p1, p2)) {
        return false;
    }
    return true;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (pointCanProjectOnLine);


/***/ }),

/***/ 82265:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);

const pointsAreWithinCloseContourProximity = (p1, p2, closeContourProximity) => {
    return gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.dist */ .Zc.dist(p1, p2) < closeContourProximity;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (pointsAreWithinCloseContourProximity);


/***/ }),

/***/ 28502:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   p: () => (/* binding */ projectTo2D)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);

const epsilon = 1e-6;
function projectTo2D(polyline) {
    let sharedDimensionIndex;
    const testPoints = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.getRandomSampleFromArray(polyline, 50);
    for (let i = 0; i < 3; i++) {
        if (testPoints.every((point, index, array) => Math.abs(point[i] - array[0][i]) < epsilon)) {
            sharedDimensionIndex = i;
            break;
        }
    }
    if (sharedDimensionIndex === undefined) {
        throw new Error('Cannot find a shared dimension index for polyline, probably oblique plane');
    }
    const points2D = [];
    const firstDim = (sharedDimensionIndex + 1) % 3;
    const secondDim = (sharedDimensionIndex + 2) % 3;
    for (let i = 0; i < polyline.length; i++) {
        points2D.push([polyline[i][firstDim], polyline[i][secondDim]]);
    }
    return {
        sharedDimensionIndex,
        projectedPolyline: points2D,
    };
}


/***/ }),

/***/ 36039:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   O4: () => (/* binding */ robustSegmentIntersection),
/* harmony export */   Sk: () => (/* binding */ pointsAreEqual),
/* harmony export */   lG: () => (/* binding */ IntersectionDirection),
/* harmony export */   n7: () => (/* binding */ PolylineNodeType),
/* harmony export */   p8: () => (/* binding */ EPSILON)
/* harmony export */ });
/* unused harmony export vec2CrossZ */
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3823);


const EPSILON = 1e-7;
function vec2CrossZ(a, b) {
    return a[0] * b[1] - a[1] * b[0];
}
function pointsAreEqual(p1, p2) {
    return _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.isEqual(p1, p2, EPSILON);
}
function robustSegmentIntersection(p1, p2, q1, q2) {
    const r = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.subtract */ .Zc.subtract(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.create */ .Zc.create(), p2, p1);
    const s = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.subtract */ .Zc.subtract(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.create */ .Zc.create(), q2, q1);
    const rxs = vec2CrossZ(r, s);
    const qmp = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.subtract */ .Zc.subtract(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.create */ .Zc.create(), q1, p1);
    const qmpxr = vec2CrossZ(qmp, r);
    if (Math.abs(rxs) < EPSILON) {
        if (Math.abs(qmpxr) < EPSILON) {
            const rDotR = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.dot */ .Zc.dot(r, r);
            const sDotS = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.dot */ .Zc.dot(s, s);
            if (rDotR < EPSILON || sDotS < EPSILON) {
                if (pointsAreEqual(p1, q1) || pointsAreEqual(p1, q2)) {
                    return p1;
                }
                if (pointsAreEqual(p2, q1) || pointsAreEqual(p2, q2)) {
                    return p2;
                }
                return null;
            }
            const t0 = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.dot */ .Zc.dot(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.subtract */ .Zc.subtract(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.create */ .Zc.create(), q1, p1), r) / rDotR;
            const t1 = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.dot */ .Zc.dot(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.subtract */ .Zc.subtract(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.create */ .Zc.create(), q2, p1), r) / rDotR;
            const u0 = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.dot */ .Zc.dot(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.subtract */ .Zc.subtract(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.create */ .Zc.create(), p1, q1), s) / sDotS;
            const u1 = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.dot */ .Zc.dot(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.subtract */ .Zc.subtract(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.create */ .Zc.create(), p2, q1), s) / sDotS;
            const isInRange = (t) => t >= -EPSILON && t <= 1 + EPSILON;
            if (isInRange(t0)) {
                const projectedPoint = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.scaleAndAdd */ .Zc.scaleAndAdd(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.create */ .Zc.create(), p1, r, t0);
                if (pointsAreEqual(q1, projectedPoint)) {
                    return q1;
                }
            }
            if (isInRange(t1)) {
                const projectedPoint = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.scaleAndAdd */ .Zc.scaleAndAdd(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.create */ .Zc.create(), p1, r, t1);
                if (pointsAreEqual(q2, projectedPoint)) {
                    return q2;
                }
            }
            if (isInRange(u0)) {
                const projectedPoint = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.scaleAndAdd */ .Zc.scaleAndAdd(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.create */ .Zc.create(), q1, s, u0);
                if (pointsAreEqual(p1, projectedPoint)) {
                    return p1;
                }
            }
            if (isInRange(u1)) {
                const projectedPoint = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.scaleAndAdd */ .Zc.scaleAndAdd(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.create */ .Zc.create(), q1, s, u1);
                if (pointsAreEqual(p2, projectedPoint)) {
                    return p2;
                }
            }
        }
        return null;
    }
    const t = vec2CrossZ(qmp, s) / rxs;
    const u = qmpxr / rxs;
    if (t >= -EPSILON && t <= 1 + EPSILON && u >= -EPSILON && u <= 1 + EPSILON) {
        return [p1[0] + t * r[0], p1[1] + t * r[1]];
    }
    return null;
}
var PolylineNodeType;
(function (PolylineNodeType) {
    PolylineNodeType[PolylineNodeType["Vertex"] = 0] = "Vertex";
    PolylineNodeType[PolylineNodeType["Intersection"] = 1] = "Intersection";
})(PolylineNodeType || (PolylineNodeType = {}));
var IntersectionDirection;
(function (IntersectionDirection) {
    IntersectionDirection[IntersectionDirection["Entering"] = 0] = "Entering";
    IntersectionDirection[IntersectionDirection["Exiting"] = 1] = "Exiting";
    IntersectionDirection[IntersectionDirection["Unknown"] = 2] = "Unknown";
})(IntersectionDirection || (IntersectionDirection = {}));


/***/ }),

/***/ 6521:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ subtractPolylines)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);
/* harmony import */ var _getSignedArea__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(63113);
/* harmony import */ var _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(36039);
/* harmony import */ var _containsPoint__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(46513);
/* harmony import */ var _arePolylinesIdentical__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(15346);





function subtractPolylines(targetPolylineCoords, sourcePolylineCoordsInput) {
    if (targetPolylineCoords.length < 3) {
        return [];
    }
    if (sourcePolylineCoordsInput.length < 3) {
        return [targetPolylineCoords.slice()];
    }
    const sourcePolylineCoords = sourcePolylineCoordsInput.slice();
    if ((0,_arePolylinesIdentical__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A)(targetPolylineCoords, sourcePolylineCoordsInput)) {
        return [];
    }
    const targetArea = (0,_getSignedArea__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(targetPolylineCoords);
    const sourceArea = (0,_getSignedArea__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(sourcePolylineCoords);
    if (Math.sign(targetArea) === Math.sign(sourceArea) &&
        Math.abs(sourceArea) > _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_2__/* .EPSILON */ .p8) {
        sourcePolylineCoords.reverse();
    }
    const intersections = [];
    for (let i = 0; i < targetPolylineCoords.length; i++) {
        const p1 = targetPolylineCoords[i];
        const p2 = targetPolylineCoords[(i + 1) % targetPolylineCoords.length];
        for (let j = 0; j < sourcePolylineCoords.length; j++) {
            const q1 = sourcePolylineCoords[j];
            const q2 = sourcePolylineCoords[(j + 1) % sourcePolylineCoords.length];
            const intersectPt = (0,_robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_2__/* .robustSegmentIntersection */ .O4)(p1, p2, q1, q2);
            if (intersectPt) {
                const lenP = Math.sqrt(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.squaredDistance */ .Zc.squaredDistance(p1, p2));
                const lenQ = Math.sqrt(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.squaredDistance */ .Zc.squaredDistance(q1, q2));
                intersections.push({
                    coord: intersectPt,
                    seg1Idx: i,
                    seg2Idx: j,
                    alpha1: lenP < _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_2__/* .EPSILON */ .p8
                        ? 0
                        : Math.sqrt(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.squaredDistance */ .Zc.squaredDistance(p1, intersectPt)) / lenP,
                    alpha2: lenQ < _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_2__/* .EPSILON */ .p8
                        ? 0
                        : Math.sqrt(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.squaredDistance */ .Zc.squaredDistance(q1, intersectPt)) / lenQ,
                });
            }
        }
    }
    const buildAugmentedList = (polyCoords, polyIndex, allIntersections) => {
        const augmentedList = [];
        let nodeIdCounter = 0;
        for (let i = 0; i < polyCoords.length; i++) {
            const p1 = polyCoords[i];
            augmentedList.push({
                id: `${polyIndex}_v${nodeIdCounter++}`,
                coordinates: p1,
                type: _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_2__/* .PolylineNodeType */ .n7.Vertex,
                originalPolyIndex: polyIndex,
                originalVertexIndex: i,
                next: null,
                prev: null,
                isIntersection: false,
                visited: false,
            });
            const segmentIntersections = allIntersections
                .filter((isect) => (polyIndex === 0 ? isect.seg1Idx : isect.seg2Idx) === i)
                .sort((a, b) => (polyIndex === 0 ? a.alpha1 : a.alpha2) -
                (polyIndex === 0 ? b.alpha1 : b.alpha2));
            for (const isect of segmentIntersections) {
                if (augmentedList.length > 0 &&
                    (0,_robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_2__/* .pointsAreEqual */ .Sk)(augmentedList[augmentedList.length - 1].coordinates, isect.coord)) {
                    if (!augmentedList[augmentedList.length - 1].isIntersection) {
                        augmentedList[augmentedList.length - 1].isIntersection = true;
                        augmentedList[augmentedList.length - 1].intersectionInfo = isect;
                        augmentedList[augmentedList.length - 1].alpha =
                            polyIndex === 0 ? isect.alpha1 : isect.alpha2;
                    }
                    continue;
                }
                augmentedList.push({
                    id: `${polyIndex}_i${nodeIdCounter++}`,
                    coordinates: isect.coord,
                    type: _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_2__/* .PolylineNodeType */ .n7.Intersection,
                    originalPolyIndex: polyIndex,
                    next: null,
                    prev: null,
                    isIntersection: true,
                    visited: false,
                    alpha: polyIndex === 0 ? isect.alpha1 : isect.alpha2,
                    intersectionInfo: isect,
                });
            }
        }
        const finalList = [];
        if (augmentedList.length > 0) {
            finalList.push(augmentedList[0]);
            for (let i = 1; i < augmentedList.length; i++) {
                if (!(0,_robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_2__/* .pointsAreEqual */ .Sk)(augmentedList[i].coordinates, finalList[finalList.length - 1].coordinates)) {
                    finalList.push(augmentedList[i]);
                }
                else {
                    if (augmentedList[i].isIntersection) {
                        finalList[finalList.length - 1].isIntersection = true;
                        finalList[finalList.length - 1].intersectionInfo =
                            augmentedList[i].intersectionInfo;
                        finalList[finalList.length - 1].alpha = augmentedList[i].alpha;
                    }
                }
            }
        }
        if (finalList.length > 0) {
            for (let i = 0; i < finalList.length; i++) {
                finalList[i].next = finalList[(i + 1) % finalList.length];
                finalList[i].prev =
                    finalList[(i - 1 + finalList.length) % finalList.length];
            }
        }
        return finalList;
    };
    const targetAugmented = buildAugmentedList(targetPolylineCoords, 0, intersections);
    const sourceAugmented = buildAugmentedList(sourcePolylineCoords, 1, intersections);
    targetAugmented.forEach((tnode) => {
        if (tnode.isIntersection) {
            const tData = tnode.intersectionInfo;
            const partner = sourceAugmented.find((snode) => snode.isIntersection &&
                (0,_robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_2__/* .pointsAreEqual */ .Sk)(snode.coordinates, tnode.coordinates) &&
                snode.intersectionInfo.seg1Idx ===
                    tData.seg1Idx &&
                snode.intersectionInfo.seg2Idx === tData.seg2Idx);
            if (partner) {
                tnode.partnerNode = partner;
                partner.partnerNode = tnode;
                const p_prev = tnode.prev.coordinates;
                const p_curr = tnode.coordinates;
                const p_next_source = partner.next.coordinates;
                const v_target_arrival = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.subtract */ .Zc.subtract(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.create */ .Zc.create(), p_curr, p_prev);
                const v_source_departure = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.subtract */ .Zc.subtract(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.create */ .Zc.create(), p_next_source, p_curr);
                const midPrevTargetSeg = [
                    (tnode.prev.coordinates[0] + tnode.coordinates[0]) / 2,
                    (tnode.prev.coordinates[1] + tnode.coordinates[1]) / 2,
                ];
                const prevSegMidpointInsideSource = (0,_containsPoint__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)(sourcePolylineCoordsInput, midPrevTargetSeg);
                if (prevSegMidpointInsideSource) {
                    tnode.intersectionDir = _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_2__/* .IntersectionDirection */ .lG.Exiting;
                }
                else {
                    tnode.intersectionDir = _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_2__/* .IntersectionDirection */ .lG.Entering;
                }
            }
            else {
                tnode.isIntersection = false;
            }
        }
    });
    targetAugmented.forEach((n) => delete n.intersectionInfo);
    sourceAugmented.forEach((n) => delete n.intersectionInfo);
    const resultPolylines = [];
    for (let i = 0; i < targetAugmented.length; i++) {
        const startNode = targetAugmented[i];
        if (startNode.visited || startNode.isIntersection) {
            continue;
        }
        if ((0,_containsPoint__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)(sourcePolylineCoordsInput, startNode.coordinates)) {
            continue;
        }
        const currentPathCoords = [];
        let currentNode = startNode;
        let onTargetList = true;
        let safetyBreak = 0;
        const maxIter = (targetAugmented.length + sourceAugmented.length) * 2;
        do {
            if (safetyBreak++ > maxIter) {
                console.warn('Subtraction: Max iterations reached, possible infinite loop.');
                break;
            }
            currentNode.visited = true;
            if (currentPathCoords.length === 0 ||
                !(0,_robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_2__/* .pointsAreEqual */ .Sk)(currentPathCoords[currentPathCoords.length - 1], currentNode.coordinates)) {
                currentPathCoords.push(currentNode.coordinates);
            }
            if (currentNode.isIntersection) {
                if (onTargetList) {
                    if (currentNode.intersectionDir === _robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_2__/* .IntersectionDirection */ .lG.Entering &&
                        currentNode.partnerNode) {
                        currentNode = currentNode.partnerNode;
                        onTargetList = false;
                    }
                }
                else {
                    if (currentNode.partnerNode) {
                        currentNode = currentNode.partnerNode;
                        onTargetList = true;
                    }
                    else {
                        console.warn('Subtraction: Intersection on source without partner.');
                    }
                }
            }
            currentNode = currentNode.next;
        } while (currentNode !== startNode || !onTargetList);
        if (currentPathCoords.length >= 3) {
            if ((0,_robustSegmentIntersection__WEBPACK_IMPORTED_MODULE_2__/* .pointsAreEqual */ .Sk)(currentPathCoords[0], currentPathCoords[currentPathCoords.length - 1])) {
                currentPathCoords.pop();
            }
            if (currentPathCoords.length >= 3) {
                resultPolylines.push(currentPathCoords);
            }
        }
    }
    return resultPolylines;
}


/***/ }),

/***/ 33657:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   distanceToPoint: () => (/* reexport safe */ _distanceToPoint__WEBPACK_IMPORTED_MODULE_0__.A)
/* harmony export */ });
/* harmony import */ var _distanceToPoint__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(87105);




/***/ }),

/***/ 23324:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   findClosestPoint: () => (/* reexport safe */ _findClosestPoint__WEBPACK_IMPORTED_MODULE_0__.A),
/* harmony export */   liangBarksyClip: () => (/* reexport safe */ _liangBarksyClip__WEBPACK_IMPORTED_MODULE_1__.A)
/* harmony export */ });
/* harmony import */ var _findClosestPoint__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(90554);
/* harmony import */ var _liangBarksyClip__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(35381);





/***/ }),

/***/ 35381:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ clip)
/* harmony export */ });
const EPSILON = 1e-6;
const INSIDE = 1;
const OUTSIDE = 0;
function clipT(num, denom, c) {
    const [tE, tL] = c;
    if (Math.abs(denom) < EPSILON) {
        return num < 0;
    }
    const t = num / denom;
    if (denom > 0) {
        if (t > tL) {
            return 0;
        }
        if (t > tE) {
            c[0] = t;
        }
    }
    else {
        if (t < tE) {
            return 0;
        }
        if (t < tL) {
            c[1] = t;
        }
    }
    return 1;
}
function clip(a, b, box, da, db) {
    const [x1, y1] = a;
    const [x2, y2] = b;
    const dx = x2 - x1;
    const dy = y2 - y1;
    if (da === undefined || db === undefined) {
        da = a;
        db = b;
    }
    else {
        da[0] = a[0];
        da[1] = a[1];
        db[0] = b[0];
        db[1] = b[1];
    }
    if (Math.abs(dx) < EPSILON &&
        Math.abs(dy) < EPSILON &&
        x1 >= box[0] &&
        x1 <= box[2] &&
        y1 >= box[1] &&
        y1 <= box[3]) {
        return INSIDE;
    }
    const c = [0, 1];
    if (clipT(box[0] - x1, dx, c) &&
        clipT(x1 - box[2], -dx, c) &&
        clipT(box[1] - y1, dy, c) &&
        clipT(y1 - box[3], -dy, c)) {
        const [tE, tL] = c;
        if (tL < 1) {
            db[0] = x1 + tL * dx;
            db[1] = y1 + tL * dy;
        }
        if (tE > 0) {
            da[0] += tE * dx;
            da[1] += tE * dy;
        }
        return INSIDE;
    }
    return OUTSIDE;
}


/***/ }),

/***/ 13165:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   filterAnnotationsForDisplay: () => (/* reexport safe */ _filterAnnotationsForDisplay__WEBPACK_IMPORTED_MODULE_2__.A),
/* harmony export */   filterAnnotationsWithinSamePlane: () => (/* reexport safe */ _filterAnnotationsWithinPlane__WEBPACK_IMPORTED_MODULE_6__.W),
/* harmony export */   filterAnnotationsWithinSlice: () => (/* reexport safe */ _filterAnnotationsWithinSlice__WEBPACK_IMPORTED_MODULE_0__.A),
/* harmony export */   getPointInLineOfSightWithCriteria: () => (/* reexport safe */ _getPointInLineOfSightWithCriteria__WEBPACK_IMPORTED_MODULE_4__.R),
/* harmony export */   getPointsInLineOfSight: () => (/* reexport safe */ _getPointInLineOfSightWithCriteria__WEBPACK_IMPORTED_MODULE_4__.p),
/* harmony export */   getWorldWidthAndHeightFromCorners: () => (/* reexport safe */ _getWorldWidthAndHeightFromCorners__WEBPACK_IMPORTED_MODULE_1__.A),
/* harmony export */   getWorldWidthAndHeightFromTwoPoints: () => (/* reexport safe */ _getWorldWidthAndHeightFromTwoPoints__WEBPACK_IMPORTED_MODULE_3__.A),
/* harmony export */   isPlaneIntersectingAABB: () => (/* reexport safe */ _isPlaneIntersectingAABB__WEBPACK_IMPORTED_MODULE_5__.Y)
/* harmony export */ });
/* harmony import */ var _filterAnnotationsWithinSlice__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(36374);
/* harmony import */ var _getWorldWidthAndHeightFromCorners__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(35489);
/* harmony import */ var _filterAnnotationsForDisplay__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(94418);
/* harmony import */ var _getWorldWidthAndHeightFromTwoPoints__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(62514);
/* harmony import */ var _getPointInLineOfSightWithCriteria__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(57063);
/* harmony import */ var _isPlaneIntersectingAABB__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(30698);
/* harmony import */ var _filterAnnotationsWithinPlane__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(40770);







/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    filterAnnotationsWithinSlice: _filterAnnotationsWithinSlice__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A,
    getWorldWidthAndHeightFromCorners: _getWorldWidthAndHeightFromCorners__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A,
    getWorldWidthAndHeightFromTwoPoints: _getWorldWidthAndHeightFromTwoPoints__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A,
    filterAnnotationsForDisplay: _filterAnnotationsForDisplay__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A,
    getPointInLineOfSightWithCriteria: _getPointInLineOfSightWithCriteria__WEBPACK_IMPORTED_MODULE_4__/* .getPointInLineOfSightWithCriteria */ .R,
    isPlaneIntersectingAABB: _isPlaneIntersectingAABB__WEBPACK_IMPORTED_MODULE_5__/* .isPlaneIntersectingAABB */ .Y,
    filterAnnotationsWithinSamePlane: _filterAnnotationsWithinPlane__WEBPACK_IMPORTED_MODULE_6__/* .filterAnnotationsWithinSamePlane */ .W,
    getPointsInLineOfSight: _getPointInLineOfSightWithCriteria__WEBPACK_IMPORTED_MODULE_4__/* .getPointsInLineOfSight */ .p,
});



/***/ }),

/***/ 61587:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ smoothAnnotation)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);
/* harmony import */ var _interpolation_interpolateSegmentPoints__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(61768);


function shouldPreventInterpolation(annotation, options) {
    const knotsRatioPercentage = options?.knotsRatioPercentage || 30;
    if (!annotation?.data?.contour?.polyline?.length ||
        knotsRatioPercentage <= 0) {
        return true;
    }
    return false;
}
function rotateMatrix(normal, focal) {
    const mat = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .mat4.create */ .pB.create();
    const eye = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.add */ .eR.add(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create(), focal, normal);
    const up = Math.abs(normal[0]) > 0.1
        ? gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(-normal[1], normal[0], 0)
        : gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(0, -normal[2], normal[1]);
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .mat4.lookAt */ .pB.lookAt(mat, focal, eye, up);
    return mat;
}
function rotate(list, count = Math.floor(Math.random() * (list.length - 1))) {
    if (count === 0) {
        return 0;
    }
    const srcList = [...list];
    const { length } = list;
    for (let i = 0; i < length; i++) {
        list[i] = srcList[(i + count + length) % length];
    }
    return count;
}
function smoothAnnotation(annotation, options) {
    if (shouldPreventInterpolation(annotation, options)) {
        return false;
    }
    const { viewPlaneNormal } = annotation.metadata;
    const { closed, polyline } = annotation.data.contour;
    const rotateMat = rotateMatrix(viewPlaneNormal, annotation.data.contour.polyline[0]);
    const canvasPoints = annotation.data.contour.polyline.map((p) => {
        const planeP = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.transformMat4 */ .eR.transformMat4(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create(), p, rotateMat);
        return [planeP[0], planeP[1]];
    });
    let rotation = closed ? rotate(canvasPoints) : 0;
    let interpolatedCanvasPoints = ((0,_interpolation_interpolateSegmentPoints__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(canvasPoints, 0, canvasPoints.length - 1, options?.knotsRatioPercentage || 30));
    if (interpolatedCanvasPoints === canvasPoints) {
        return false;
    }
    rotate(interpolatedCanvasPoints, -rotation);
    for (let i = 1; i < options?.loop; i++) {
        rotation = closed ? rotate(interpolatedCanvasPoints) : 0;
        interpolatedCanvasPoints = ((0,_interpolation_interpolateSegmentPoints__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(interpolatedCanvasPoints, 0, interpolatedCanvasPoints.length - 1, options?.knotsRatioPercentage || 30));
        rotate(interpolatedCanvasPoints, -rotation);
    }
    const unRotate = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .mat4.invert */ .pB.invert(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .mat4.create */ .pB.create(), rotateMat);
    annotation.data.contour.polyline = (interpolatedCanvasPoints.map((p) => gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.transformMat4 */ .eR.transformMat4([0, 0, 0], [...p, 0], unRotate)));
    return true;
}


/***/ }),

/***/ 10564:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BX: () => (/* binding */ DEFAULT_NEGATIVE_SEED_MARGIN),
/* harmony export */   Sp: () => (/* binding */ DEFAULT_NEIGHBORHOOD_RADIUS),
/* harmony export */   VD: () => (/* binding */ POSITIVE_SEED_LABEL),
/* harmony export */   Zi: () => (/* binding */ DEFAULT_NEGATIVE_SEEDS_COUNT),
/* harmony export */   ag: () => (/* binding */ DEFAULT_NEGATIVE_STD_DEV_MULTIPLIER),
/* harmony export */   bs: () => (/* binding */ NEGATIVE_SEED_LABEL),
/* harmony export */   ee: () => (/* binding */ DEFAULT_POSITIVE_STD_DEV_MULTIPLIER),
/* harmony export */   gN: () => (/* binding */ MAX_NEGATIVE_SEED_ATTEMPTS_MULTIPLIER)
/* harmony export */ });
const POSITIVE_SEED_LABEL = 254;
const NEGATIVE_SEED_LABEL = 255;
const DEFAULT_NEIGHBORHOOD_RADIUS = 1;
const DEFAULT_POSITIVE_STD_DEV_MULTIPLIER = 1.8;
const DEFAULT_NEGATIVE_STD_DEV_MULTIPLIER = 3.2;
const DEFAULT_NEGATIVE_SEED_MARGIN = 30;
const DEFAULT_NEGATIVE_SEEDS_COUNT = 70;
const MAX_NEGATIVE_SEED_ATTEMPTS_MULTIPLIER = 50;


/***/ }),

/***/ 94762:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Lr: () => (/* binding */ priority),
/* harmony export */   Pg: () => (/* binding */ clearFromImageIds),
/* harmony export */   bV: () => (/* binding */ getStackData),
/* harmony export */   m0: () => (/* binding */ getPromiseRemovedHandler),
/* harmony export */   y1: () => (/* binding */ range),
/* harmony export */   y9: () => (/* binding */ requestType),
/* harmony export */   zo: () => (/* binding */ nearestIndex)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(30045);


const requestType = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.Enums.RequestType.Prefetch;
const priority = 0;
function range(lowEnd, highEnd) {
    lowEnd = Math.round(lowEnd) || 0;
    highEnd = Math.round(highEnd) || 0;
    const arr = [];
    let c = highEnd - lowEnd + 1;
    if (c <= 0) {
        return arr;
    }
    while (c--) {
        arr[c] = highEnd--;
    }
    return arr;
}
function nearestIndex(arr, x) {
    let low = 0;
    let high = arr.length - 1;
    arr.forEach((v, idx) => {
        if (v < x) {
            low = Math.max(idx, low);
        }
        else if (v > x) {
            high = Math.min(idx, high);
        }
    });
    return { low, high };
}
function getStackData(element) {
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
    if (!enabledElement) {
        return null;
    }
    const { viewport } = enabledElement;
    if (!(viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.StackViewport)) {
        return null;
    }
    return {
        currentImageIdIndex: viewport.getCurrentImageIdIndex(),
        imageIds: viewport.getImageIds(),
    };
}
function getPromiseRemovedHandler(element) {
    return function (e) {
        const eventData = e.detail;
        let stackData;
        try {
            stackData = getStackData(element);
        }
        catch (error) {
            return;
        }
        if (!stackData || !stackData.imageIds || stackData.imageIds.length === 0) {
            return;
        }
        const stack = stackData;
        const imageIdIndex = stack.imageIds.indexOf(eventData.imageId);
        if (imageIdIndex < 0) {
            return;
        }
        const stackPrefetchData = (0,_state__WEBPACK_IMPORTED_MODULE_1__/* .getToolState */ .k)(element);
        if (!stackPrefetchData ||
            !stackPrefetchData.indicesToRequest ||
            !stackPrefetchData.indicesToRequest.length) {
            return;
        }
        stackPrefetchData.indicesToRequest.push(imageIdIndex);
    };
}
const clearFromImageIds = (stack) => {
    const imageIdSet = new Set(stack.imageIds);
    return (requestDetails) => requestDetails.type !== requestType ||
        !imageIdSet.has(requestDetails.additionalDetails.imageId);
};


/***/ }),

/***/ 30045:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   P: () => (/* binding */ addToolState),
/* harmony export */   k: () => (/* binding */ getToolState)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);

const state = {};
function addToolState(element, data) {
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
    const { viewportId } = enabledElement;
    state[viewportId] = data;
}
function getToolState(element) {
    const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
    const { viewportId } = enabledElement;
    return state[viewportId];
}



/***/ }),

/***/ 33517:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  n: () => (/* binding */ ColorbarCanvas)
});

// UNUSED EXPORTS: default

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/vec3/interpolateVec3.js
const interpolateVec3 = (a, b, t) => {
    return [
        a[0] * (1 - t) + b[0] * t,
        a[1] * (1 - t) + b[1] * t,
        a[2] * (1 - t) + b[2] * t,
    ];
};


// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/voi/colorbar/common/index.js + 4 modules
var common = __webpack_require__(57227);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/voi/colorbar/ColorbarCanvas.js



const { clamp } = esm.utilities;
class ColorbarCanvas {
    constructor(props) {
        ColorbarCanvas.validateProps(props);
        const { colormap, size = { width: 20, height: 100 }, imageRange = { lower: 0, upper: 1 }, voiRange = { lower: 0, upper: 1 }, container, showFullPixelValueRange = false, } = props;
        this._colormap = colormap;
        this._imageRange = imageRange;
        this._voiRange = voiRange;
        this._showFullImageRange = showFullPixelValueRange;
        this._canvas = this._createRootElement(size);
        if (container) {
            this.appendTo(container);
        }
    }
    get colormap() {
        return this._colormap;
    }
    set colormap(colormap) {
        this._colormap = colormap;
        this.render();
    }
    get size() {
        const { width, height } = this._canvas;
        return { width, height };
    }
    set size(size) {
        const { _canvas: canvas } = this;
        if (!(0,common/* isColorbarSizeValid */.Au)(size) || (0,common/* areColorbarSizesEqual */.fG)(canvas, size)) {
            return;
        }
        this._setCanvasSize(canvas, size);
        this.render();
    }
    get imageRange() {
        return { ...this._imageRange };
    }
    set imageRange(imageRange) {
        if (!(0,common/* isRangeValid */.kB)(imageRange) ||
            (0,common/* areColorbarRangesEqual */.bh)(imageRange, this._imageRange)) {
            return;
        }
        this._imageRange = imageRange;
        this.render();
    }
    get voiRange() {
        return { ...this._voiRange };
    }
    set voiRange(voiRange) {
        if (!(0,common/* isRangeValid */.kB)(voiRange) ||
            (0,common/* areColorbarRangesEqual */.bh)(voiRange, this._voiRange)) {
            return;
        }
        this._voiRange = voiRange;
        this.render();
    }
    get showFullImageRange() {
        return this._showFullImageRange;
    }
    set showFullImageRange(showFullImageRange) {
        if (showFullImageRange === this._showFullImageRange) {
            return;
        }
        this._showFullImageRange = showFullImageRange;
        this.render();
    }
    appendTo(container) {
        container.appendChild(this._canvas);
        this.render();
    }
    dispose() {
        const { _canvas: canvas } = this;
        const { parentElement } = canvas;
        parentElement?.removeChild(canvas);
    }
    static validateProps(props) {
        const { size, imageRange, voiRange } = props;
        if (size && !(0,common/* isColorbarSizeValid */.Au)(size)) {
            throw new Error('Invalid "size"');
        }
        if (imageRange && !(0,common/* isRangeValid */.kB)(imageRange)) {
            throw new Error('Invalid "imageRange"');
        }
        if (voiRange && !(0,common/* isRangeValid */.kB)(voiRange)) {
            throw new Error('Invalid "voiRange"');
        }
    }
    _setCanvasSize(canvas, size) {
        const { width, height } = size;
        canvas.width = width;
        canvas.height = height;
        Object.assign(canvas.style, {
            width: `${width}px`,
            height: `${height}px`,
        });
    }
    _createRootElement(size) {
        const canvas = document.createElement('canvas');
        Object.assign(canvas.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            pointerEvents: 'none',
            boxSizing: 'border-box',
        });
        this._setCanvasSize(canvas, size);
        return canvas;
    }
    render() {
        if (!this._canvas.isConnected) {
            return;
        }
        const { _colormap: colormap } = this;
        const { RGBPoints: rgbPoints } = colormap;
        const colorsCount = rgbPoints.length / 4;
        const getColorPoint = (index) => {
            const offset = 4 * index;
            if (index < 0 || index >= colorsCount) {
                return;
            }
            return {
                index,
                position: rgbPoints[offset],
                color: [
                    rgbPoints[offset + 1],
                    rgbPoints[offset + 2],
                    rgbPoints[offset + 3],
                ],
            };
        };
        const { width, height } = this._canvas;
        const canvasContext = this._canvas.getContext('2d');
        if (!canvasContext) {
            return;
        }
        const isHorizontal = width > height;
        const maxValue = isHorizontal ? width : height;
        const { _voiRange: voiRange } = this;
        const range = this._showFullImageRange ? this._imageRange : { ...voiRange };
        let previousColorPoint = undefined;
        let currentColorPoint = getColorPoint(0);
        const incRawPixelValue = (range.upper - range.lower) / (maxValue - 1);
        let rawPixelValue = range.lower;
        for (let i = 0; i < maxValue; i++) {
            const tVoiRange = (rawPixelValue - voiRange.lower) /
                Math.abs(voiRange.upper - voiRange.lower);
            if (currentColorPoint) {
                for (let i = currentColorPoint.index; i < colorsCount; i++) {
                    if (tVoiRange <= currentColorPoint.position) {
                        break;
                    }
                    previousColorPoint = currentColorPoint;
                    currentColorPoint = getColorPoint(i + 1);
                }
            }
            let normColor;
            if (!previousColorPoint) {
                normColor = [...currentColorPoint.color];
            }
            else if (!currentColorPoint) {
                normColor = [...previousColorPoint.color];
            }
            else {
                const tColorRange = (tVoiRange - previousColorPoint.position) /
                    (currentColorPoint.position - previousColorPoint.position);
                normColor = interpolateVec3(previousColorPoint.color, currentColorPoint.color, tColorRange);
            }
            const color = normColor.map((color) => clamp(Math.round(color * 255), 0, 255));
            canvasContext.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            if (isHorizontal) {
                canvasContext.fillRect(i, 0, 1, height);
            }
            else {
                canvasContext.fillRect(0, height - i - 1, width, 1);
            }
            rawPixelValue += incRawPixelValue;
        }
    }
}



/***/ }),

/***/ 62184:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   f: () => (/* binding */ ColorbarTicks)
/* harmony export */ });
/* unused harmony export default */
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(57227);
/* harmony import */ var _enums_ColorbarRangeTextPosition__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(20646);


const DEFAULTS = {
    FONT: '10px Arial',
    COLOR: 'white',
    TICK_SIZE: 5,
    TICK_WIDTH: 1,
    TICK_LABEL_MARGIN: 3,
    MAX_NUM_TICKS: 8,
    TICKS_STEPS: [1, 2.5, 5, 10],
};
class ColorbarTicks {
    constructor(props) {
        ColorbarTicks.validateProps(props);
        const { top = 0, left = 0, size = { width: 20, height: 100 }, imageRange = { lower: 0, upper: 1 }, voiRange = { lower: 0, upper: 1 }, ticks: ticksProps, container, showFullPixelValueRange = false, } = props;
        const { style: ticksStyle, position: rangeTextPosition } = ticksProps ?? {};
        this._imageRange = imageRange;
        this._voiRange = voiRange;
        this._font = ticksStyle?.font ?? DEFAULTS.FONT;
        this._color = ticksStyle?.color ?? DEFAULTS.COLOR;
        this._tickSize = ticksStyle?.tickSize ?? DEFAULTS.TICK_SIZE;
        this._tickWidth = ticksStyle?.tickWidth ?? DEFAULTS.TICK_WIDTH;
        this._labelMargin = ticksStyle?.labelMargin ?? DEFAULTS.TICK_LABEL_MARGIN;
        this._maxNumTicks = ticksStyle?.maxNumTicks ?? DEFAULTS.MAX_NUM_TICKS;
        this._rangeTextPosition =
            rangeTextPosition ?? _enums_ColorbarRangeTextPosition__WEBPACK_IMPORTED_MODULE_1__/* .ColorbarRangeTextPosition */ .U.Right;
        this._showFullPixelValueRange = showFullPixelValueRange;
        this._canvas = this._createCanvasElement(size, top, left);
        if (container) {
            this.appendTo(container);
        }
    }
    get size() {
        const { width, height } = this._canvas;
        return { width, height };
    }
    set size(size) {
        const { _canvas: canvas } = this;
        if (!(0,_common__WEBPACK_IMPORTED_MODULE_0__/* .isColorbarSizeValid */ .Au)(size) || (0,_common__WEBPACK_IMPORTED_MODULE_0__/* .areColorbarSizesEqual */ .fG)(canvas, size)) {
            return;
        }
        this._setCanvasSize(canvas, size);
        this.render();
    }
    get top() {
        return Number.parseInt(this._canvas.style.top);
    }
    set top(top) {
        const { _canvas: canvas } = this;
        const currentTop = this.top;
        if (top === currentTop) {
            return;
        }
        canvas.style.top = `${top}px`;
        this.render();
    }
    get left() {
        return Number.parseInt(this._canvas.style.left);
    }
    set left(left) {
        const { _canvas: canvas } = this;
        const currentLeft = this.left;
        if (left === currentLeft) {
            return;
        }
        canvas.style.left = `${left}px`;
        this.render();
    }
    get imageRange() {
        return { ...this._imageRange };
    }
    set imageRange(imageRange) {
        if (!(0,_common__WEBPACK_IMPORTED_MODULE_0__/* .isRangeValid */ .kB)(imageRange) ||
            (0,_common__WEBPACK_IMPORTED_MODULE_0__/* .areColorbarRangesEqual */ .bh)(imageRange, this._imageRange)) {
            return;
        }
        this._imageRange = imageRange;
        this.render();
    }
    get voiRange() {
        return { ...this._voiRange };
    }
    set voiRange(voiRange) {
        if (!(0,_common__WEBPACK_IMPORTED_MODULE_0__/* .isRangeValid */ .kB)(voiRange) ||
            (0,_common__WEBPACK_IMPORTED_MODULE_0__/* .areColorbarRangesEqual */ .bh)(voiRange, this._voiRange)) {
            return;
        }
        this._voiRange = voiRange;
        this.render();
    }
    get tickSize() {
        return this._tickSize;
    }
    set tickSize(tickSize) {
        if (tickSize === this._tickSize) {
            return;
        }
        this._tickSize = tickSize;
        this.render();
    }
    get tickWidth() {
        return this._tickWidth;
    }
    set tickWidth(tickWidth) {
        if (tickWidth === this._tickWidth) {
            return;
        }
        this._tickWidth = tickWidth;
        this.render();
    }
    get color() {
        return this._color;
    }
    set color(color) {
        if (color === this._color) {
            return;
        }
        this._color = color;
        this.render();
    }
    get showFullPixelValueRange() {
        return this._showFullPixelValueRange;
    }
    set showFullPixelValueRange(showFullRange) {
        if (showFullRange === this._showFullPixelValueRange) {
            return;
        }
        this._showFullPixelValueRange = showFullRange;
        this.render();
    }
    get visible() {
        return this._canvas.style.display === 'block';
    }
    set visible(visible) {
        if (visible === this.visible) {
            return;
        }
        this._canvas.style.display = visible ? 'block' : 'none';
        if (visible) {
            this.render();
        }
    }
    appendTo(container) {
        container.appendChild(this._canvas);
        this.render();
    }
    static validateProps(props) {
        const { size, imageRange, voiRange } = props;
        if (size && !(0,_common__WEBPACK_IMPORTED_MODULE_0__/* .isColorbarSizeValid */ .Au)(size)) {
            throw new Error('Invalid "size"');
        }
        if (imageRange && !(0,_common__WEBPACK_IMPORTED_MODULE_0__/* .isRangeValid */ .kB)(imageRange)) {
            throw new Error('Invalid "imageRange"');
        }
        if (voiRange && !(0,_common__WEBPACK_IMPORTED_MODULE_0__/* .isRangeValid */ .kB)(voiRange)) {
            throw new Error('Invalid "voiRange"');
        }
    }
    _setCanvasSize(canvas, size) {
        const { width, height } = size;
        canvas.width = width;
        canvas.height = height;
        Object.assign(canvas.style, {
            width: `${width}px`,
            height: `${height}px`,
        });
    }
    _createCanvasElement(size, top, left) {
        const canvas = document.createElement('canvas');
        Object.assign(canvas.style, {
            display: 'none',
            position: 'absolute',
            boxSizing: 'border-box',
            top: `${top}px`,
            left: `${left}px`,
        });
        this._setCanvasSize(canvas, size);
        return canvas;
    }
    _getTicks(range) {
        const { lower, upper } = range;
        const rangeValue = upper - lower;
        const roughStep = rangeValue / (this._maxNumTicks - 1);
        const stepPower = Math.pow(10, -Math.floor(Math.log10(Math.abs(roughStep))));
        const roughtStepNormalized = roughStep * stepPower;
        const normalizedStep = DEFAULTS.TICKS_STEPS.find((n) => n >= roughtStepNormalized);
        const step = normalizedStep / stepPower;
        const scaleMax = Math.ceil(upper / step) * step;
        const scaleMin = Math.floor(lower / step) * step;
        const ticksCount = Math.round((scaleMax - scaleMin) / step) + 1;
        const ticks = [];
        for (let i = 0; i < ticksCount; i++) {
            ticks.push(scaleMin + i * step);
        }
        return { scaleMin, scaleMax, step, ticks };
    }
    _getLeftTickInfo({ position, labelMeasure }) {
        const { width } = this._canvas;
        const labelX = width - this.tickSize - labelMeasure.width - this._labelMargin;
        const labelPoint = [labelX, position];
        const tickPoints = {
            start: [width - this._tickSize, position],
            end: [width, position],
        };
        return { labelPoint, tickPoints };
    }
    _getRightTickInfo({ position }) {
        const labelPoint = [this._tickSize + this._labelMargin, position];
        const tickPoints = {
            start: [0, position],
            end: [this._tickSize, position],
        };
        return { labelPoint, tickPoints };
    }
    _getTopTickInfo({ position, labelMeasure }) {
        const { height } = this._canvas;
        const labelY = height - this.tickSize - this._labelMargin;
        const labelPoint = [position, labelY];
        const tickPoints = {
            start: [position, height - this._tickSize],
            end: [position, height],
        };
        return { labelPoint, tickPoints };
    }
    _getBottomTickInfo({ position, labelMeasure }) {
        const labelPoint = [position, this._tickSize + this._labelMargin];
        const tickPoints = {
            start: [position, 0],
            end: [position, this._tickSize],
        };
        return { labelPoint, tickPoints };
    }
    render() {
        const { _canvas: canvas } = this;
        if (!canvas.isConnected || !this.visible) {
            return;
        }
        const { width, height } = canvas;
        const isHorizontal = width >= height;
        const maxCanvasPixelValue = isHorizontal ? width : height;
        const canvasContext = canvas.getContext('2d');
        const { _voiRange: voiRange } = this;
        const range = this._showFullPixelValueRange
            ? this._imageRange
            : { ...voiRange };
        const rangeWidth = range.upper - range.lower;
        const { ticks } = this._getTicks(range);
        canvasContext.clearRect(0, 0, width, height);
        canvasContext.font = this._font;
        canvasContext.textBaseline = isHorizontal ? 'top' : 'middle';
        canvasContext.textAlign = isHorizontal ? 'center' : 'left';
        canvasContext.fillStyle = this._color;
        canvasContext.strokeStyle = this._color;
        canvasContext.lineWidth = this.tickWidth;
        ticks.forEach((tick) => {
            let position = Math.round(maxCanvasPixelValue * ((tick - range.lower) / rangeWidth));
            if (!isHorizontal) {
                position = height - position;
            }
            if (position < 0 || position > maxCanvasPixelValue) {
                return;
            }
            const label = tick.toString();
            const labelMeasure = canvasContext.measureText(label);
            let tickInfo;
            if (isHorizontal) {
                if (this._rangeTextPosition === _enums_ColorbarRangeTextPosition__WEBPACK_IMPORTED_MODULE_1__/* .ColorbarRangeTextPosition */ .U.Top) {
                    tickInfo = this._getTopTickInfo({ position, labelMeasure });
                }
                else {
                    tickInfo = this._getBottomTickInfo({ position, labelMeasure });
                }
            }
            else {
                if (this._rangeTextPosition === _enums_ColorbarRangeTextPosition__WEBPACK_IMPORTED_MODULE_1__/* .ColorbarRangeTextPosition */ .U.Left) {
                    tickInfo = this._getLeftTickInfo({ position, labelMeasure });
                }
                else {
                    tickInfo = this._getRightTickInfo({ position });
                }
            }
            const { labelPoint, tickPoints } = tickInfo;
            const { start: tickStart, end: tickEnd } = tickPoints;
            canvasContext.beginPath();
            canvasContext.moveTo(tickStart[0], tickStart[1]);
            canvasContext.lineTo(tickEnd[0], tickEnd[1]);
            canvasContext.fillText(label, labelPoint[0], labelPoint[1]);
            canvasContext.stroke();
            return position;
        });
    }
}



/***/ }),

/***/ 57227:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  bh: () => (/* reexport */ areColorbarRangesEqual),
  fG: () => (/* reexport */ areColorbarSizesEqual),
  Au: () => (/* reexport */ isColorbarSizeValid),
  kB: () => (/* reexport */ isRangeValid)
});

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/voi/colorbar/common/isRangeValid.js
const isRangeValid = (range) => {
    return range && range.upper > range.lower;
};


;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/voi/colorbar/common/isColorbarSizeValid.js
const isColorbarSizeValid = (size) => {
    return !!size && size.width > 0 && size.height > 0;
};


;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/voi/colorbar/common/areColorbarRangesEqual.js
const areColorbarRangesEqual = (a, b) => {
    return !!a && !!b && a.lower === b.lower && a.upper === b.upper;
};


;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/voi/colorbar/common/areColorbarSizesEqual.js
const areColorbarSizesEqual = (a, b) => {
    return !!a && !!b && a.width === b.width && a.height === b.height;
};


;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/voi/colorbar/common/index.js






/***/ }),

/***/ 79457:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ isRangeTextPositionValid)
/* harmony export */ });
/* unused harmony export isRangeTextPositionValid */
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(51807);

function isRangeTextPositionValid(colorbarWidth, colorbarHeight, rangeTextPosition) {
    const isHorizontal = colorbarWidth >= colorbarHeight;
    const validRangeTextPositions = isHorizontal
        ? [_enums__WEBPACK_IMPORTED_MODULE_0__.ColorbarRangeTextPosition.Top, _enums__WEBPACK_IMPORTED_MODULE_0__.ColorbarRangeTextPosition.Bottom]
        : [_enums__WEBPACK_IMPORTED_MODULE_0__.ColorbarRangeTextPosition.Left, _enums__WEBPACK_IMPORTED_MODULE_0__.ColorbarRangeTextPosition.Right];
    return validRangeTextPositions.includes(rangeTextPosition);
}



/***/ }),

/***/ 44845:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Widget)
/* harmony export */ });
/* unused harmony export Widget */
class Widget {
    constructor({ id, container }) {
        this._containerResizeCallback = (entries) => {
            let width;
            let height;
            const { contentRect, contentBoxSize } = entries[0];
            if (contentRect) {
                width = contentRect.width;
                height = contentRect.height;
            }
            else if (contentBoxSize?.length) {
                width = contentBoxSize[0].inlineSize;
                height = contentBoxSize[0].blockSize;
            }
            this._containerSize = { width, height };
            this.onContainerResize();
        };
        this._id = id;
        this._containerSize = { width: 0, height: 0 };
        this._rootElement = this.createRootElement(id);
        this._containerResizeObserver = new ResizeObserver(this._containerResizeCallback);
        if (container) {
            this.appendTo(container);
        }
    }
    get id() {
        return this._id;
    }
    get rootElement() {
        return this._rootElement;
    }
    appendTo(container) {
        const { _rootElement: rootElement, _containerResizeObserver: resizeObserver, } = this;
        const { parentElement: currentContainer } = rootElement;
        if (!container || container === currentContainer) {
            return;
        }
        if (currentContainer) {
            resizeObserver.unobserve(currentContainer);
        }
        container.appendChild(rootElement);
        resizeObserver.observe(container);
    }
    destroy() {
        const { _rootElement: rootElement, _containerResizeObserver: resizeObserver, } = this;
        const { parentElement } = rootElement;
        parentElement?.removeChild(rootElement);
        resizeObserver.disconnect();
    }
    get containerSize() {
        return { ...this._containerSize };
    }
    createRootElement(id) {
        const rootElement = document.createElement('div');
        rootElement.id = id;
        rootElement.classList.add('widget');
        Object.assign(rootElement.style, {
            width: '100%',
            height: '100%',
        });
        return rootElement;
    }
    onContainerResize() {
    }
}



/***/ }),

/***/ 1060:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ay: () => (/* binding */ vtkSphereSource$1)
/* harmony export */ });
/* unused harmony exports extend, newInstance */
/* harmony import */ var _macros2_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(28906);
/* harmony import */ var _Common_DataModel_PolyData_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(87275);
/* harmony import */ var _Common_Core_DataArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(42008);




// ----------------------------------------------------------------------------
// vtkSphereSource methods
// ----------------------------------------------------------------------------

function vtkSphereSource(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkSphereSource');
  publicAPI.requestData = (inData, outData) => {
    if (model.deleted) {
      return;
    }
    let dataset = outData[0];
    const pointDataType = dataset ? dataset.getPoints().getDataType() : model.pointType;
    dataset = _Common_DataModel_PolyData_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"].newInstance */ .Ay.newInstance();

    // ----------------------------------------------------------------------
    let numPoles = 0;

    // Check data, determine increments, and convert to radians
    let {
      thetaResolution
    } = model;
    let startTheta = model.startTheta < model.endTheta ? model.startTheta : model.endTheta;
    startTheta *= Math.PI / 180.0;
    let endTheta = model.endTheta > model.startTheta ? model.endTheta : model.startTheta;
    endTheta *= Math.PI / 180.0;
    let startPhi = model.startPhi < model.endPhi ? model.startPhi : model.endPhi;
    startPhi *= Math.PI / 180.0;
    let endPhi = model.endPhi > model.startPhi ? model.endPhi : model.startPhi;
    endPhi *= Math.PI / 180.0;
    if (Math.abs(startTheta - endTheta) < 2.0 * Math.PI) {
      ++thetaResolution;
    }
    const deltaTheta = (endTheta - startTheta) / model.thetaResolution;
    const jStart = model.startPhi <= 0.0 ? 1 : 0;
    const jEnd = model.phiResolution + (model.endPhi >= 180.0 ? -1 : 0);
    const numPts = model.phiResolution * thetaResolution + 2;
    const numPolys = model.phiResolution * 2 * model.thetaResolution;

    // Points
    let pointIdx = 0;
    let points = _macros2_js__WEBPACK_IMPORTED_MODULE_0__.m.newTypedArray(pointDataType, numPts * 3);

    // Normals
    let normals = new Float32Array(numPts * 3);

    // Cells
    let cellLocation = 0;
    let polys = new Uint32Array(numPolys * 5);

    // Create north pole if needed
    if (model.startPhi <= 0.0) {
      points[pointIdx * 3 + 0] = model.center[0];
      points[pointIdx * 3 + 1] = model.center[1];
      points[pointIdx * 3 + 2] = model.center[2] + model.radius;
      normals[pointIdx * 3 + 0] = 0;
      normals[pointIdx * 3 + 1] = 0;
      normals[pointIdx * 3 + 2] = 1;
      pointIdx++;
      numPoles++;
    }

    // Create south pole if needed
    if (model.endPhi >= 180.0) {
      points[pointIdx * 3 + 0] = model.center[0];
      points[pointIdx * 3 + 1] = model.center[1];
      points[pointIdx * 3 + 2] = model.center[2] - model.radius;
      normals[pointIdx * 3 + 0] = 0;
      normals[pointIdx * 3 + 1] = 0;
      normals[pointIdx * 3 + 2] = -1;
      pointIdx++;
      numPoles++;
    }
    const phiResolution = model.phiResolution - numPoles;
    const deltaPhi = (endPhi - startPhi) / (model.phiResolution - 1);

    // Create intermediate points
    for (let i = 0; i < thetaResolution; i++) {
      const theta = startTheta + i * deltaTheta;
      for (let j = jStart; j < jEnd; j++) {
        const phi = startPhi + j * deltaPhi;
        const radius = model.radius * Math.sin(phi);
        normals[pointIdx * 3 + 0] = radius * Math.cos(theta);
        normals[pointIdx * 3 + 1] = radius * Math.sin(theta);
        normals[pointIdx * 3 + 2] = model.radius * Math.cos(phi);
        points[pointIdx * 3 + 0] = normals[pointIdx * 3 + 0] + model.center[0];
        points[pointIdx * 3 + 1] = normals[pointIdx * 3 + 1] + model.center[1];
        points[pointIdx * 3 + 2] = normals[pointIdx * 3 + 2] + model.center[2];
        let norm = Math.sqrt(normals[pointIdx * 3 + 0] * normals[pointIdx * 3 + 0] + normals[pointIdx * 3 + 1] * normals[pointIdx * 3 + 1] + normals[pointIdx * 3 + 2] * normals[pointIdx * 3 + 2]);
        norm = norm === 0 ? 1 : norm;
        normals[pointIdx * 3 + 0] /= norm;
        normals[pointIdx * 3 + 1] /= norm;
        normals[pointIdx * 3 + 2] /= norm;
        pointIdx++;
      }
    }

    // Generate mesh connectivity
    const base = phiResolution * thetaResolution;
    if (Math.abs(startTheta - endTheta) < 2.0 * Math.PI) {
      --thetaResolution;
    }

    // around north pole
    if (model.startPhi <= 0.0) {
      for (let i = 0; i < thetaResolution; i++) {
        polys[cellLocation++] = 3;
        polys[cellLocation++] = phiResolution * i + numPoles;
        polys[cellLocation++] = phiResolution * (i + 1) % base + numPoles;
        polys[cellLocation++] = 0;
      }
    }

    // around south pole
    if (model.endPhi >= 180.0) {
      const numOffset = phiResolution - 1 + numPoles;
      for (let i = 0; i < thetaResolution; i++) {
        polys[cellLocation++] = 3;
        polys[cellLocation++] = phiResolution * i + numOffset;
        polys[cellLocation++] = numPoles - 1;
        polys[cellLocation++] = phiResolution * (i + 1) % base + numOffset;
      }
    }

    // bands in-between poles
    for (let i = 0; i < thetaResolution; i++) {
      for (let j = 0; j < phiResolution - 1; j++) {
        const a = phiResolution * i + j + numPoles;
        const b = a + 1;
        const c = (phiResolution * (i + 1) + j) % base + numPoles + 1;
        if (!model.latLongTessellation) {
          polys[cellLocation++] = 3;
          polys[cellLocation++] = a;
          polys[cellLocation++] = b;
          polys[cellLocation++] = c;
          polys[cellLocation++] = 3;
          polys[cellLocation++] = a;
          polys[cellLocation++] = c;
          polys[cellLocation++] = c - 1;
        } else {
          polys[cellLocation++] = 4;
          polys[cellLocation++] = a;
          polys[cellLocation++] = b;
          polys[cellLocation++] = c;
          polys[cellLocation++] = c - 1;
        }
      }
    }

    // Squeeze
    points = points.subarray(0, pointIdx * 3);
    dataset.getPoints().setData(points, 3);
    normals = normals.subarray(0, pointIdx * 3);
    const normalArray = _Common_Core_DataArray_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"].newInstance */ .Ay.newInstance({
      name: 'Normals',
      values: normals,
      numberOfComponents: 3
    });
    dataset.getPointData().setNormals(normalArray);
    polys = polys.subarray(0, cellLocation);
    dataset.getPolys().setData(polys, 1);

    // Update output
    outData[0] = dataset;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  radius: 0.5,
  latLongTessellation: false,
  thetaResolution: 8,
  startTheta: 0.0,
  endTheta: 360.0,
  phiResolution: 8,
  startPhi: 0.0,
  endPhi: 180.0,
  center: [0, 0, 0],
  pointType: 'Float64Array'
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  _macros2_js__WEBPACK_IMPORTED_MODULE_0__.m.obj(publicAPI, model);
  _macros2_js__WEBPACK_IMPORTED_MODULE_0__.m.setGet(publicAPI, model, ['radius', 'latLongTessellation', 'thetaResolution', 'startTheta', 'endTheta', 'phiResolution', 'startPhi', 'endPhi']);
  _macros2_js__WEBPACK_IMPORTED_MODULE_0__.m.setGetArray(publicAPI, model, ['center'], 3);
  _macros2_js__WEBPACK_IMPORTED_MODULE_0__.m.algo(publicAPI, model, 0, 1);
  vtkSphereSource(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = _macros2_js__WEBPACK_IMPORTED_MODULE_0__.m.newInstance(extend, 'vtkSphereSource');

// ----------------------------------------------------------------------------

var vtkSphereSource$1 = {
  newInstance,
  extend
};




/***/ }),

/***/ 25161:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (/* binding */ vtkOrientationMarkerWidget$1)
});

// UNUSED EXPORTS: DEFAULT_VALUES, extend, newInstance

// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/macros2.js
var macros2 = __webpack_require__(28906);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/Renderer.js + 2 modules
var Renderer = __webpack_require__(50036);
;// ../../../node_modules/@kitware/vtk.js/Interaction/Widgets/OrientationMarkerWidget/Constants.js
const Corners = {
  TOP_LEFT: 'TOP_LEFT',
  TOP_RIGHT: 'TOP_RIGHT',
  BOTTOM_LEFT: 'BOTTOM_LEFT',
  BOTTOM_RIGHT: 'BOTTOM_RIGHT'
};
var Constants = {
  Corners
};



;// ../../../node_modules/@kitware/vtk.js/Interaction/Widgets/OrientationMarkerWidget.js




const {
  vtkErrorMacro
} = macros2.m;
const {
  Corners: OrientationMarkerWidget_Corners
} = Constants;

// ----------------------------------------------------------------------------
// vtkOrientationMarkerWidget
// ----------------------------------------------------------------------------

function vtkOrientationMarkerWidget(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkOrientationMarkerWidget');
  const superClass = {
    ...publicAPI
  };

  // Private variables

  const previousCameraInput = [];
  const selfRenderer = Renderer/* default.newInstance */.Ay.newInstance();
  const resizeObserver = new ResizeObserver(entries => {
    publicAPI.updateViewport();
  });
  let onCameraChangedSub = null;
  let onCameraModifiedSub = null;
  let onAnimationSub = null;
  let onEndAnimationSub = null;
  let selfSubscription = null;
  function onCameraModified() {
    // If animating, marker will be updated on Animation event
    if (!model._interactor.isAnimating()) {
      publicAPI.updateMarkerOrientation();
    }
  }
  model._onParentRendererChanged = () => publicAPI.updateViewport();
  publicAPI.computeViewport = () => {
    const parentRen = model.parentRenderer || model._interactor.getCurrentRenderer();
    const [xMin, yMin, xMax, yMax] = parentRen.getViewport();
    const view = model._interactor.getView();
    const canvasSize = view.getSize();
    const [viewXSize, viewYSize] = view.getViewportSize(parentRen);
    const minViewSize = Math.min(viewXSize, viewYSize);
    let pixelSize = model.viewportSize * minViewSize;
    // clamp pixel size
    pixelSize = Math.max(Math.min(model.minPixelSize, minViewSize), Math.min(model.maxPixelSize, pixelSize));
    const xFrac = pixelSize / canvasSize[0];
    const yFrac = pixelSize / canvasSize[1];
    // [left bottom right top]
    switch (model.viewportCorner) {
      case OrientationMarkerWidget_Corners.TOP_LEFT:
        return [xMin, yMax - yFrac, xMin + xFrac, yMax];
      case OrientationMarkerWidget_Corners.TOP_RIGHT:
        return [xMax - xFrac, yMax - yFrac, xMax, yMax];
      case OrientationMarkerWidget_Corners.BOTTOM_LEFT:
        return [xMin, yMin, xMin + xFrac, yMin + yFrac];
      case OrientationMarkerWidget_Corners.BOTTOM_RIGHT:
        return [xMax - xFrac, yMin, xMax, yMin + yFrac];
      default:
        vtkErrorMacro('Invalid widget corner');
        return null;
    }
  };
  publicAPI.updateViewport = () => {
    if (model.enabled) {
      selfRenderer.setViewport(...publicAPI.computeViewport());
      model._interactor.render();
    }
  };
  publicAPI.updateMarkerOrientation = () => {
    const ren = model.parentRenderer || model._interactor.getCurrentRenderer();
    const currentCamera = ren.getActiveCamera();
    if (!currentCamera) {
      return;
    }
    const position = currentCamera.getReferenceByName('position');
    const focalPoint = currentCamera.getReferenceByName('focalPoint');
    const viewUp = currentCamera.getReferenceByName('viewUp');
    if (previousCameraInput[0] !== position[0] || previousCameraInput[1] !== position[1] || previousCameraInput[2] !== position[2] || previousCameraInput[3] !== focalPoint[0] || previousCameraInput[4] !== focalPoint[1] || previousCameraInput[5] !== focalPoint[2] || previousCameraInput[6] !== viewUp[0] || previousCameraInput[7] !== viewUp[1] || previousCameraInput[8] !== viewUp[2]) {
      previousCameraInput[0] = position[0];
      previousCameraInput[1] = position[1];
      previousCameraInput[2] = position[2];
      previousCameraInput[3] = focalPoint[0];
      previousCameraInput[4] = focalPoint[1];
      previousCameraInput[5] = focalPoint[2];
      previousCameraInput[6] = viewUp[0];
      previousCameraInput[7] = viewUp[1];
      previousCameraInput[8] = viewUp[2];
      const activeCamera = selfRenderer.getActiveCamera();
      activeCamera.setPosition(position[0], position[1], position[2]);
      activeCamera.setFocalPoint(focalPoint[0], focalPoint[1], focalPoint[2]);
      activeCamera.setViewUp(viewUp[0], viewUp[1], viewUp[2]);
      selfRenderer.resetCamera();
    }
  };

  /**
   * Enables/Disables the orientation marker.
   */
  publicAPI.setEnabled = enabling => {
    if (enabling) {
      if (model.enabled) {
        return;
      }
      if (!model.actor) {
        vtkErrorMacro('Must set actor before enabling orientation marker.');
        return;
      }
      if (!model._interactor) {
        vtkErrorMacro('Must set interactor before enabling orientation marker.');
        return;
      }
      const ren = model.parentRenderer || model._interactor.getCurrentRenderer();
      const renderWindow = ren.getRenderWindow();
      renderWindow.addRenderer(selfRenderer);
      if (renderWindow.getNumberOfLayers() < 2) {
        renderWindow.setNumberOfLayers(2);
      }
      // Highest number is foreground
      selfRenderer.setLayer(renderWindow.getNumberOfLayers() - 1);
      selfRenderer.setInteractive(model.interactiveRenderer);
      selfRenderer.addViewProp(model.actor);
      model.actor.setVisibility(true);
      onCameraChangedSub = ren.onEvent(event => {
        if (event.type === 'ActiveCameraEvent') {
          if (onCameraModifiedSub) {
            onCameraModifiedSub.unsubscribe();
          }
          onCameraModifiedSub = event.camera.onModified(onCameraModified);
        }
      });
      onCameraModifiedSub = ren.getActiveCamera().onModified(onCameraModified);
      onAnimationSub = model._interactor.onAnimation(publicAPI.updateMarkerOrientation);
      onEndAnimationSub = model._interactor.onEndAnimation(publicAPI.updateMarkerOrientation);
      resizeObserver.observe(model._interactor.getView().getCanvas());
      publicAPI.updateViewport();
      publicAPI.updateMarkerOrientation();
      model.enabled = true;
    } else {
      if (!model.enabled) {
        return;
      }
      model.enabled = false;
      resizeObserver.disconnect();
      onCameraChangedSub.unsubscribe();
      onCameraChangedSub = null;
      onCameraModifiedSub.unsubscribe();
      onCameraModifiedSub = null;
      onAnimationSub.unsubscribe();
      onAnimationSub = null;
      onEndAnimationSub.unsubscribe();
      onEndAnimationSub = null;
      model.actor.setVisibility(false);
      selfRenderer.removeViewProp(model.actor);
      const renderWindow = model._interactor?.findPokedRenderer()?.getRenderWindow();
      if (renderWindow) {
        renderWindow.removeRenderer(selfRenderer);
      }
    }
    publicAPI.modified();
  };

  /**
   * Sets the viewport corner.
   */
  publicAPI.setViewportCorner = corner => {
    if (corner === model.viewportCorner) {
      return;
    }
    model.viewportCorner = corner;
    publicAPI.updateViewport();
  };

  /**
   * Sets the viewport size.
   */
  publicAPI.setViewportSize = sizeFactor => {
    const viewportSize = Math.min(1, Math.max(0, sizeFactor));
    if (viewportSize === model.viewportSize) {
      return;
    }
    model.viewportSize = viewportSize;
    publicAPI.updateViewport();
  };
  publicAPI.setActor = actor => {
    const previousState = model.enabled;
    publicAPI.setEnabled(false);
    model.actor = actor;
    publicAPI.setEnabled(previousState);
  };
  publicAPI.getRenderer = () => selfRenderer;
  publicAPI.delete = () => {
    superClass.delete();
    if (selfSubscription) {
      selfSubscription.unsubscribe();
      selfSubscription = null;
    }
    if (onCameraChangedSub) {
      onCameraChangedSub.unsubscribe();
      onCameraChangedSub = null;
    }
    if (onCameraModifiedSub) {
      onCameraModifiedSub.unsubscribe();
      onCameraModifiedSub = null;
    }
    if (onAnimationSub) {
      onAnimationSub.unsubscribe();
      onAnimationSub = null;
    }
    if (onEndAnimationSub) {
      onEndAnimationSub.unsubscribe();
      onEndAnimationSub = null;
    }
    resizeObserver.disconnect();
  };

  // --------------------------------------------------------------------------

  // update viewport whenever we are updated
  selfSubscription = publicAPI.onModified(publicAPI.updateViewport);
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  // actor: null,
  // _interactor: null,
  viewportCorner: Constants.Corners.BOTTOM_LEFT,
  viewportSize: 0.2,
  minPixelSize: 50,
  maxPixelSize: 200,
  parentRenderer: null,
  interactiveRenderer: false
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  macros2.m.obj(publicAPI, model);
  macros2.m.get(publicAPI, model, ['enabled', 'viewportCorner', 'viewportSize', 'interactiveRenderer']);

  // NOTE: setting these while the widget is enabled will
  // not update the widget.
  macros2.m.setGet(publicAPI, model, ['_interactor', 'minPixelSize', 'maxPixelSize', 'parentRenderer']);
  macros2.m.get(publicAPI, model, ['actor']);
  macros2.m.moveToProtected(publicAPI, model, ['interactor']);

  // Object methods
  vtkOrientationMarkerWidget(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macros2.m.newInstance(extend, 'vtkOrientationMarkerWidget');

// ----------------------------------------------------------------------------

var vtkOrientationMarkerWidget$1 = {
  newInstance,
  extend,
  ...Constants
};




/***/ }),

/***/ 85825:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (/* binding */ vtkAnnotatedCubeActor$1)
});

// UNUSED EXPORTS: DEFAULT_VALUES, extend, newInstance

// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/macros2.js
var macros2 = __webpack_require__(28906);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/Actor.js
var Actor = __webpack_require__(7019);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/Mapper.js
var Mapper = __webpack_require__(82409);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/Texture.js
var Texture = __webpack_require__(61433);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Filters/Sources/CubeSource.js
var CubeSource = __webpack_require__(56748);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/ImageData.js
var ImageData = __webpack_require__(58498);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/DataArray.js
var DataArray = __webpack_require__(42008);
;// ../../../node_modules/@kitware/vtk.js/Common/Core/ImageHelper.js



/**
 * Takes a canvas and converts it to a vtkImageData.
 *
 * Optionally supply a bounding box to get a particular subset of the canvas.
 *
 * @param canvas       The HTML canvas to convert
 * @param boundingBox  A bounding box of type [top, left, width, height]
 */
function canvasToImageData(canvas) {
  let boundingBox = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0, 0];
  const [top, left, width, height] = boundingBox;
  const ctxt = canvas.getContext('2d');
  const idata = ctxt.getImageData(top, left, width || canvas.width, height || canvas.height);
  const imageData = ImageData/* default.newInstance */.Ay.newInstance({
    type: 'vtkImageData'
  });
  imageData.setOrigin(0, 0, 0);
  imageData.setSpacing(1, 1, 1);
  imageData.setExtent(0, (width || canvas.width) - 1, 0, (height || canvas.height) - 1, 0, 0);
  const scalars = DataArray/* default.newInstance */.Ay.newInstance({
    numberOfComponents: 4,
    values: new Uint8Array(idata.data.buffer)
  });
  scalars.setName('scalars');
  imageData.getPointData().setScalars(scalars);
  return imageData;
}

/**
 * Converts an Image object to a vtkImageData.
 */
function imageToImageData(image) {
  let transform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    flipX: false,
    flipY: false,
    rotate: 0
  };
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  const {
    flipX,
    flipY,
    rotate
  } = transform;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
  ctx.rotate(rotate * Math.PI / 180);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);
  return canvasToImageData(canvas);
}
var ImageHelper = {
  canvasToImageData,
  imageToImageData
};



;// ../../../node_modules/@kitware/vtk.js/Rendering/Core/AnnotatedCubeActor/Presets.js
const STYLES = {
  default: {
    defaultStyle: {
      fontStyle: 'bold',
      fontFamily: 'Arial',
      fontColor: 'black',
      fontSizeScale: res => res / 2,
      faceColor: 'white',
      edgeThickness: 0.1,
      edgeColor: 'black',
      resolution: 400
    },
    xMinusFaceProperty: {
      text: 'X-',
      faceColor: 'yellow'
    },
    xPlusFaceProperty: {
      text: 'X+',
      faceColor: 'yellow'
    },
    yMinusFaceProperty: {
      text: 'Y-',
      faceColor: 'red'
    },
    yPlusFaceProperty: {
      text: 'Y+',
      faceColor: 'red'
    },
    zMinusFaceProperty: {
      text: 'Z-',
      faceColor: '#008000'
    },
    zPlusFaceProperty: {
      text: 'Z+',
      faceColor: '#008000'
    }
  },
  lps: {
    xMinusFaceProperty: {
      text: 'R',
      faceRotation: -90
    },
    xPlusFaceProperty: {
      text: 'L',
      faceRotation: 90
    },
    yMinusFaceProperty: {
      text: 'A',
      faceRotation: 0
    },
    yPlusFaceProperty: {
      text: 'P',
      faceRotation: 180
    },
    zMinusFaceProperty: {
      text: 'I',
      faceRotation: 180
    },
    zPlusFaceProperty: {
      text: 'S',
      faceRotation: 0
    }
  }
};
function applyDefinitions(definitions, cubeActor) {
  cubeActor.set(definitions);
}
function applyPreset(name, cubeActor) {
  return applyDefinitions(STYLES[name], cubeActor);
}
function registerStylePreset(name, definitions) {
  STYLES[name] = definitions;
}
var AnnotatedCubePresets = {
  applyDefinitions,
  applyPreset,
  registerStylePreset
};



;// ../../../node_modules/@kitware/vtk.js/Rendering/Core/AnnotatedCubeActor.js








const FACE_TO_INDEX = {
  xPlus: 0,
  xMinus: 1,
  yPlus: 2,
  yMinus: 3,
  zPlus: 4,
  zMinus: 5
};

// ----------------------------------------------------------------------------
// vtkAnnotatedCubeActor
// ----------------------------------------------------------------------------

function vtkAnnotatedCubeActor(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkAnnotatedCubeActor');

  // Make sure face properties are not references to the default value
  model.xPlusFaceProperty = {
    ...model.xPlusFaceProperty
  };
  model.xMinusFaceProperty = {
    ...model.xMinusFaceProperty
  };
  model.yPlusFaceProperty = {
    ...model.yPlusFaceProperty
  };
  model.yMinusFaceProperty = {
    ...model.yMinusFaceProperty
  };
  model.zPlusFaceProperty = {
    ...model.zPlusFaceProperty
  };
  model.zMinusFaceProperty = {
    ...model.zMinusFaceProperty
  };

  // private variables

  let cubeSource = null;
  const canvas = document.createElement('canvas');
  const mapper = Mapper/* default.newInstance */.Ay.newInstance();
  const texture = Texture/* default.newInstance */.Ay.newInstance();
  texture.setInterpolate(true);

  // private methods

  function updateFaceTexture(faceName) {
    let newProp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (newProp) {
      Object.assign(model[`${faceName}FaceProperty`], newProp);
    }
    const prop = {
      ...model.defaultStyle,
      ...model[`${faceName}FaceProperty`]
    };

    // set canvas resolution
    canvas.width = prop.resolution;
    canvas.height = prop.resolution;
    const ctxt = canvas.getContext('2d');

    // set background color
    ctxt.fillStyle = prop.faceColor;
    ctxt.fillRect(0, 0, canvas.width, canvas.height);

    // draw edge
    if (prop.edgeThickness > 0) {
      ctxt.strokeStyle = prop.edgeColor;
      ctxt.lineWidth = prop.edgeThickness * canvas.width;
      ctxt.strokeRect(0, 0, canvas.width, canvas.height);
    }

    // set face rotation
    ctxt.save();

    // vertical flip
    ctxt.translate(0, canvas.height);
    ctxt.scale(1, -1);
    ctxt.translate(canvas.width / 2, canvas.height / 2);
    ctxt.rotate(-Math.PI * (prop.faceRotation / 180.0));

    // set foreground text
    const textSize = prop.fontSizeScale(prop.resolution);
    ctxt.fillStyle = prop.fontColor;
    ctxt.textAlign = 'center';
    ctxt.textBaseline = 'middle';
    ctxt.font = `${prop.fontStyle} ${textSize}px "${prop.fontFamily}"`;
    ctxt.fillText(prop.text, 0, 0);
    ctxt.restore();
    const vtkImage = ImageHelper.canvasToImageData(canvas);
    texture.setInputData(vtkImage, FACE_TO_INDEX[faceName]);
    publicAPI.modified();
  }
  function updateAllFaceTextures() {
    cubeSource = CubeSource/* default.newInstance */.Ay.newInstance({
      generate3DTextureCoordinates: true
    });
    mapper.setInputConnection(cubeSource.getOutputPort());
    updateFaceTexture('xPlus');
    updateFaceTexture('xMinus');
    updateFaceTexture('yPlus');
    updateFaceTexture('yMinus');
    updateFaceTexture('zPlus');
    updateFaceTexture('zMinus');
  }

  // public methods

  publicAPI.setDefaultStyle = style => {
    model.defaultStyle = {
      ...model.defaultStyle,
      ...style
    };
    updateAllFaceTextures();
  };
  publicAPI.setXPlusFaceProperty = prop => updateFaceTexture('xPlus', prop);
  publicAPI.setXMinusFaceProperty = prop => updateFaceTexture('xMinus', prop);
  publicAPI.setYPlusFaceProperty = prop => updateFaceTexture('yPlus', prop);
  publicAPI.setYMinusFaceProperty = prop => updateFaceTexture('yMinus', prop);
  publicAPI.setZPlusFaceProperty = prop => updateFaceTexture('zPlus', prop);
  publicAPI.setZMinusFaceProperty = prop => updateFaceTexture('zMinus', prop);

  // constructor

  updateAllFaceTextures();

  // set mapper
  mapper.setInputConnection(cubeSource.getOutputPort());
  publicAPI.setMapper(mapper);

  // set texture
  publicAPI.addTexture(texture);
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  defaultStyle: {
    text: '',
    faceColor: 'white',
    faceRotation: 0,
    fontFamily: 'Arial',
    fontColor: 'black',
    fontStyle: 'normal',
    fontSizeScale: resolution => resolution / 1.8,
    edgeThickness: 0.1,
    edgeColor: 'black',
    resolution: 200
  }
  // xPlusFaceProperty: null,
  // xMinusFaceProperty: null,
  // yPlusFaceProperty: null,
  // yMinusFaceProperty: null,
  // zPlusFaceProperty: null,
  // zMinusFaceProperty: null,
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  Actor/* default.extend */.Ay.extend(publicAPI, model, initialValues);
  macros2.m.get(publicAPI, model, ['defaultStyle', 'xPlusFaceProperty', 'xMinusFaceProperty', 'yPlusFaceProperty', 'yMinusFaceProperty', 'zPlusFaceProperty', 'zMinusFaceProperty']);

  // Object methods
  vtkAnnotatedCubeActor(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macros2.m.newInstance(extend, 'vtkAnnotatedCubeActor');

// ----------------------------------------------------------------------------

var vtkAnnotatedCubeActor$1 = {
  newInstance,
  extend,
  Presets: AnnotatedCubePresets
};




/***/ }),

/***/ 45700:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (/* binding */ vtkAxesActor$1)
});

// UNUSED EXPORTS: extend, newInstance

// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/macros2.js
var macros2 = __webpack_require__(28906);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/MatrixBuilder.js
var MatrixBuilder = __webpack_require__(89265);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/DataArray.js
var DataArray = __webpack_require__(42008);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/Actor.js
var Actor = __webpack_require__(7019);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/Mapper.js
var Mapper = __webpack_require__(82409);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/Points.js
var Points = __webpack_require__(74966);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/PolyData.js + 5 modules
var PolyData = __webpack_require__(87275);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/DataSetAttributes/Constants.js
var Constants = __webpack_require__(62612);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/DataArray/Constants.js
var DataArray_Constants = __webpack_require__(28914);
;// ../../../node_modules/@kitware/vtk.js/Filters/General/AppendPolyData.js







const {
  vtkErrorMacro
} = macros2.m;
function offsetCellArray(typedArray, offset) {
  let currentIdx = 0;
  return typedArray.map((value, index) => {
    if (index === currentIdx) {
      currentIdx += value + 1;
      return value;
    }
    return value + offset;
  });
}
function appendCellData(dest, src, ptOffset, cellOffset) {
  dest.set(offsetCellArray(src, ptOffset), cellOffset);
}

// ----------------------------------------------------------------------------
// vtkAppendPolyData methods
// ----------------------------------------------------------------------------

function vtkAppendPolyData(publicAPI, model) {
  // Set our classname
  model.classHierarchy.push('vtkAppendPolyData');
  publicAPI.requestData = (inData, outData) => {
    // implement requestData
    const numberOfInputs = publicAPI.getNumberOfInputPorts();
    if (!numberOfInputs) {
      vtkErrorMacro('No input specified.');
      return;
    }
    if (numberOfInputs === 1) {
      // pass through filter
      outData[0] = inData[0];
      return;
    }

    // Allocate output
    const output = PolyData/* default.newInstance */.Ay.newInstance();
    let numPts = 0;
    let pointType = 0;
    let ttype = 1;
    let firstType = 1;
    let numVerts = 0;
    let numLines = 0;
    let numStrips = 0;
    let numPolys = 0;

    // Field data is propagated to output only if present in all inputs
    let hasPtNormals = true; // assume present by default
    let hasPtTCoords = true;
    let hasPtScalars = true;
    for (let i = 0; i < numberOfInputs; i++) {
      const ds = inData[i];
      if (!ds) {
        // eslint-disable-next-line
        continue;
      }
      const dsNumPts = ds.getPoints().getNumberOfPoints();
      numPts += dsNumPts;
      numVerts += ds.getVerts().getNumberOfValues();
      numLines += ds.getLines().getNumberOfValues();
      numStrips += ds.getStrips().getNumberOfValues();
      numPolys += ds.getPolys().getNumberOfValues();
      if (dsNumPts) {
        if (firstType) {
          firstType = 0;
          pointType = ds.getPoints().getDataType();
        }
        ttype = ds.getPoints().getDataType();
        pointType = pointType > ttype ? pointType : ttype;
      }
      const ptD = ds.getPointData();
      if (ptD) {
        hasPtNormals = hasPtNormals && ptD.getNormals() !== null;
        hasPtTCoords = hasPtTCoords && ptD.getTCoords() !== null;
        hasPtScalars = hasPtScalars && ptD.getScalars() !== null;
      } else {
        hasPtNormals = false;
        hasPtTCoords = false;
        hasPtScalars = false;
      }
    }
    if (model.outputPointsPrecision === Constants/* DesiredOutputPrecision */.kP.SINGLE) {
      pointType = DataArray_Constants/* VtkDataTypes */.JA.FLOAT;
    } else if (model.outputPointsPrecision === Constants/* DesiredOutputPrecision */.kP.DOUBLE) {
      pointType = DataArray_Constants/* VtkDataTypes */.JA.DOUBLE;
    }
    const points = Points/* default.newInstance */.Ay.newInstance({
      dataType: pointType
    });
    points.setNumberOfPoints(numPts);
    const pointData = points.getData();
    const vertData = new Uint32Array(numVerts);
    const lineData = new Uint32Array(numLines);
    const stripData = new Uint32Array(numStrips);
    const polyData = new Uint32Array(numPolys);
    let newPtNormals = null;
    let newPtTCoords = null;
    let newPtScalars = null;
    const lds = inData[numberOfInputs - 1];
    if (hasPtNormals) {
      const dsNormals = lds.getPointData().getNormals();
      newPtNormals = DataArray/* default.newInstance */.Ay.newInstance({
        numberOfComponents: 3,
        numberOfTuples: numPts,
        size: 3 * numPts,
        dataType: dsNormals.getDataType(),
        name: dsNormals.getName()
      });
    }
    if (hasPtTCoords) {
      const dsTCoords = lds.getPointData().getTCoords();
      newPtTCoords = DataArray/* default.newInstance */.Ay.newInstance({
        numberOfComponents: 2,
        numberOfTuples: numPts,
        size: 2 * numPts,
        dataType: dsTCoords.getDataType(),
        name: dsTCoords.getName()
      });
    }
    if (hasPtScalars) {
      const dsScalars = lds.getPointData().getScalars();
      newPtScalars = DataArray/* default.newInstance */.Ay.newInstance({
        numberOfComponents: dsScalars.getNumberOfComponents(),
        numberOfTuples: numPts,
        size: numPts * dsScalars.getNumberOfComponents(),
        dataType: dsScalars.getDataType(),
        name: dsScalars.getName()
      });
    }
    numPts = 0;
    numVerts = 0;
    numLines = 0;
    numStrips = 0;
    numPolys = 0;
    for (let i = 0; i < numberOfInputs; i++) {
      const ds = inData[i];
      pointData.set(ds.getPoints().getData(), numPts * 3);
      appendCellData(vertData, ds.getVerts().getData(), numPts, numVerts);
      numVerts += ds.getVerts().getNumberOfValues();
      appendCellData(lineData, ds.getLines().getData(), numPts, numLines);
      numLines += ds.getLines().getNumberOfValues();
      appendCellData(stripData, ds.getStrips().getData(), numPts, numStrips);
      numStrips += ds.getStrips().getNumberOfValues();
      appendCellData(polyData, ds.getPolys().getData(), numPts, numPolys);
      numPolys += ds.getPolys().getNumberOfValues();
      const dsPD = ds.getPointData();
      if (hasPtNormals) {
        const ptNorms = dsPD.getNormals();
        newPtNormals.getData().set(ptNorms.getData(), numPts * 3);
      }
      if (hasPtTCoords) {
        const ptTCoords = dsPD.getTCoords();
        newPtTCoords.getData().set(ptTCoords.getData(), numPts * 2);
      }
      if (hasPtScalars) {
        const ptScalars = dsPD.getScalars();
        newPtScalars.getData().set(ptScalars.getData(), numPts * newPtScalars.getNumberOfComponents());
      }
      numPts += ds.getPoints().getNumberOfPoints();
    }
    output.setPoints(points);
    output.getVerts().setData(vertData);
    output.getLines().setData(lineData);
    output.getStrips().setData(stripData);
    output.getPolys().setData(polyData);
    if (newPtNormals) {
      output.getPointData().setNormals(newPtNormals);
    }
    if (newPtTCoords) {
      output.getPointData().setTCoords(newPtTCoords);
    }
    if (newPtScalars) {
      output.getPointData().setScalars(newPtScalars);
    }
    outData[0] = output;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  outputPointsPrecision: Constants/* DesiredOutputPrecision */.kP.DEFAULT
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  macros2.m.setGet(publicAPI, model, ['outputPointsPrecision']);

  // Make this a VTK object
  macros2.m.obj(publicAPI, model);

  // Also make it an algorithm with one input and one output
  macros2.m.algo(publicAPI, model, 1, 1);

  // Object specific methods
  vtkAppendPolyData(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macros2.m.newInstance(extend, 'vtkAppendPolyData');

// ----------------------------------------------------------------------------

var vtkAppendPolyData$1 = {
  newInstance,
  extend
};



;// ../../../node_modules/@kitware/vtk.js/Filters/Sources/ConeSource.js




// ----------------------------------------------------------------------------
// vtkConeSource methods
// ----------------------------------------------------------------------------

function vtkConeSource(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkConeSource');
  function requestData(inData, outData) {
    if (model.deleted) {
      return;
    }
    let dataset = outData[0];
    const angle = 2 * Math.PI / model.resolution;
    const xbot = -model.height / 2.0;
    const numberOfPoints = model.resolution + 1;
    const cellArraySize = 4 * model.resolution + 1 + model.resolution;

    // Points
    let pointIdx = 0;
    const points = macros2.m.newTypedArray(model.pointType, numberOfPoints * 3);

    // Cells
    let cellLocation = 0;
    const polys = new Uint32Array(cellArraySize);

    // Add summit point
    points[0] = model.height / 2.0;
    points[1] = 0.0;
    points[2] = 0.0;

    // Create bottom cell
    if (model.capping) {
      polys[cellLocation++] = model.resolution;
    }

    // Add all points
    for (let i = 0; i < model.resolution; i++) {
      pointIdx++;
      points[pointIdx * 3 + 0] = xbot;
      points[pointIdx * 3 + 1] = model.radius * Math.cos(i * angle);
      points[pointIdx * 3 + 2] = model.radius * Math.sin(i * angle);

      // Add points to bottom cell in reverse order
      if (model.capping) {
        polys[model.resolution - cellLocation++ + 1] = pointIdx;
      }
    }

    // Add all triangle cells
    for (let i = 0; i < model.resolution; i++) {
      polys[cellLocation++] = 3;
      polys[cellLocation++] = 0;
      polys[cellLocation++] = i + 1;
      polys[cellLocation++] = i + 2 > model.resolution ? 1 : i + 2;
    }

    // Apply transformation to the points coordinates
    MatrixBuilder/* default */.A.buildFromRadian().translate(...model.center).rotateFromDirections([1, 0, 0], model.direction).apply(points);
    dataset = PolyData/* default.newInstance */.Ay.newInstance();
    dataset.getPoints().setData(points, 3);
    dataset.getPolys().setData(polys, 1);

    // Update output
    outData[0] = dataset;
  }

  // Expose methods
  publicAPI.requestData = requestData;
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const ConeSource_DEFAULT_VALUES = {
  height: 1.0,
  radius: 0.5,
  resolution: 6,
  center: [0, 0, 0],
  direction: [1.0, 0.0, 0.0],
  capping: true,
  pointType: 'Float64Array'
};

// ----------------------------------------------------------------------------

function ConeSource_extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, ConeSource_DEFAULT_VALUES, initialValues);

  // Build VTK API
  macros2.m.obj(publicAPI, model);
  macros2.m.setGet(publicAPI, model, ['height', 'radius', 'resolution', 'capping']);
  macros2.m.setGetArray(publicAPI, model, ['center', 'direction'], 3);
  macros2.m.algo(publicAPI, model, 0, 1);
  vtkConeSource(publicAPI, model);
}

// ----------------------------------------------------------------------------

const ConeSource_newInstance = macros2.m.newInstance(ConeSource_extend, 'vtkConeSource');

// ----------------------------------------------------------------------------

var vtkConeSource$1 = {
  newInstance: ConeSource_newInstance,
  extend: ConeSource_extend
};



;// ../../../node_modules/@kitware/vtk.js/Filters/Sources/CylinderSource.js





// ----------------------------------------------------------------------------
// vtkCylinderSource methods
// ----------------------------------------------------------------------------

function vtkCylinderSource(publicAPI, model) {
  // Set our classname
  model.classHierarchy.push('vtkCylinderSource');
  function requestData(inData, outData) {
    if (model.deleted) {
      return;
    }
    let dataset = outData[0];
    const angle = 2.0 * Math.PI / model.resolution;
    let numberOfPoints = 2 * model.resolution;
    let numberOfPolys = 5 * model.resolution;
    if (model.capping) {
      numberOfPoints = 4 * model.resolution;
      numberOfPolys = 7 * model.resolution + 2;
    }

    // Points
    const points = macros2.m.newTypedArray(model.pointType, numberOfPoints * 3);

    // Cells
    let cellLocation = 0;
    const polys = new Uint32Array(numberOfPolys);

    // Normals
    const normalsData = new Float32Array(numberOfPoints * 3);
    const normals = DataArray/* default.newInstance */.Ay.newInstance({
      numberOfComponents: 3,
      values: normalsData,
      name: 'Normals'
    });

    // Texture coords
    const tcData = new Float32Array(numberOfPoints * 2);
    const tcoords = DataArray/* default.newInstance */.Ay.newInstance({
      numberOfComponents: 2,
      values: tcData,
      name: 'TCoords'
    });

    // Generate points for all sides
    const nbot = [0.0, 0.0, 0.0];
    const ntop = [0.0, 0.0, 0.0];
    const xbot = [0.0, 0.0, 0.0];
    const xtop = [0.0, 0.0, 0.0];
    const tcbot = [0.0, 0.0];
    const tctop = [0.0, 0.0];
    const otherRadius = model.otherRadius == null ? model.radius : model.otherRadius;
    for (let i = 0; i < model.resolution; i++) {
      // x coordinate
      nbot[0] = Math.cos(i * angle + model.initAngle);
      ntop[0] = nbot[0];
      xbot[0] = model.radius * nbot[0] + model.center[0];
      xtop[0] = xbot[0];
      tcbot[0] = Math.abs(2.0 * i / model.resolution - 1.0);
      tctop[0] = tcbot[0];

      // y coordinate
      xbot[1] = 0.5 * model.height + model.center[1];
      xtop[1] = -0.5 * model.height + model.center[1];
      tcbot[1] = 0.0;
      tctop[1] = 1.0;

      // z coordinate
      nbot[2] = -Math.sin(i * angle + model.initAngle);
      ntop[2] = nbot[2];
      xbot[2] = otherRadius * nbot[2] + model.center[2];
      xtop[2] = xbot[2];
      const pointIdx = 2 * i;
      for (let j = 0; j < 3; j++) {
        normalsData[pointIdx * 3 + j] = nbot[j];
        normalsData[(pointIdx + 1) * 3 + j] = ntop[j];
        points[pointIdx * 3 + j] = xbot[j];
        points[(pointIdx + 1) * 3 + j] = xtop[j];
        if (j < 2) {
          tcData[pointIdx * 2 + j] = tcbot[j];
          tcData[(pointIdx + 1) * 2 + j] = tctop[j];
        }
      }
    }

    // Generate polygons for sides
    for (let i = 0; i < model.resolution; i++) {
      polys[cellLocation++] = 4;
      polys[cellLocation++] = 2 * i;
      polys[cellLocation++] = 2 * i + 1;
      const pt = (2 * i + 3) % (2 * model.resolution);
      polys[cellLocation++] = pt;
      polys[cellLocation++] = pt - 1;
    }
    if (model.capping) {
      // Generate points for top/bottom polygons
      for (let i = 0; i < model.resolution; i++) {
        // x coordinate
        xbot[0] = model.radius * Math.cos(i * angle + model.initAngle);
        xtop[0] = xbot[0];
        tcbot[0] = xbot[0];
        tctop[0] = xbot[0];
        xbot[0] += model.center[0];
        xtop[0] += model.center[0];

        // y coordinate
        nbot[1] = 1.0;
        ntop[1] = -1.0;
        xbot[1] = 0.5 * model.height + model.center[1];
        xtop[1] = -0.5 * model.height + model.center[1];

        // z coordinate
        xbot[2] = -otherRadius * Math.sin(i * angle + model.initAngle);
        xtop[2] = xbot[2];
        tcbot[1] = xbot[2];
        tctop[1] = xbot[2];
        xbot[2] += model.center[2];
        xtop[2] += model.center[2];
        const botIdx = 2 * model.resolution + i;
        const topIdx = 3 * model.resolution + model.resolution - i - 1;
        for (let j = 0; j < 3; j++) {
          normalsData[3 * botIdx + j] = nbot[j];
          normalsData[3 * topIdx + j] = ntop[j];
          points[3 * botIdx + j] = xbot[j];
          points[3 * topIdx + j] = xtop[j];
          if (j < 2) {
            tcData[2 * botIdx + j] = tcbot[j];
            tcData[2 * topIdx + j] = tctop[j];
          }
        }
      }

      // Generate polygons for top/bottom
      polys[cellLocation++] = model.resolution;
      for (let i = 0; i < model.resolution; i++) {
        polys[cellLocation++] = 2 * model.resolution + i;
      }
      polys[cellLocation++] = model.resolution;
      for (let i = 0; i < model.resolution; i++) {
        polys[cellLocation++] = 3 * model.resolution + i;
      }
    }

    // Apply transformation to the points coordinates
    MatrixBuilder/* default */.A.buildFromRadian().translate(...model.center).rotateFromDirections([0, 1, 0], model.direction).translate(...model.center.map(c => c * -1)).apply(points);
    dataset = PolyData/* default.newInstance */.Ay.newInstance();
    dataset.getPoints().setData(points, 3);
    dataset.getPolys().setData(polys, 1);
    dataset.getPointData().setNormals(normals);
    dataset.getPointData().setTCoords(tcoords);

    // Update output
    outData[0] = dataset;
  }

  // Expose methods
  publicAPI.requestData = requestData;
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const CylinderSource_DEFAULT_VALUES = {
  height: 1.0,
  initAngle: 0,
  radius: 1.0,
  resolution: 6,
  center: [0, 0, 0],
  direction: [0.0, 1.0, 0.0],
  capping: true,
  pointType: 'Float64Array'
};

// ----------------------------------------------------------------------------

function CylinderSource_extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, CylinderSource_DEFAULT_VALUES, initialValues);

  // Build VTK API
  macros2.m.obj(publicAPI, model);
  macros2.m.setGet(publicAPI, model, ['height', 'initAngle', 'otherRadius', 'radius', 'resolution', 'capping']);
  macros2.m.setGetArray(publicAPI, model, ['center', 'direction'], 3);
  macros2.m.algo(publicAPI, model, 0, 1);
  vtkCylinderSource(publicAPI, model);
}

// ----------------------------------------------------------------------------

const CylinderSource_newInstance = macros2.m.newInstance(CylinderSource_extend, 'vtkCylinderSource');

// ----------------------------------------------------------------------------

var vtkCylinderSource$1 = {
  newInstance: CylinderSource_newInstance,
  extend: CylinderSource_extend
};



;// ../../../node_modules/@kitware/vtk.js/Filters/Sources/ArrowSource.js






// ----------------------------------------------------------------------------
// vtkArrowSource methods
// ----------------------------------------------------------------------------

function vtkArrowSource(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkArrowSource');
  function requestData(inData, outData) {
    if (model.deleted) {
      return;
    }
    const cylinder = vtkCylinderSource$1.newInstance({
      capping: true
    });
    cylinder.setResolution(model.shaftResolution);
    cylinder.setRadius(model.shaftRadius);
    cylinder.setHeight(1.0 - model.tipLength);
    cylinder.setCenter(0, (1.0 - model.tipLength) * 0.5, 0.0);
    const cylinderPD = cylinder.getOutputData();
    const cylinderPts = cylinderPD.getPoints().getData();
    const cylinderNormals = cylinderPD.getPointData().getNormals().getData();

    // Apply transformation to the cylinder
    MatrixBuilder/* default */.A.buildFromDegree().rotateZ(-90).apply(cylinderPts).apply(cylinderNormals);
    const cone = vtkConeSource$1.newInstance();
    cone.setResolution(model.tipResolution);
    cone.setHeight(model.tipLength);
    cone.setRadius(model.tipRadius);
    const conePD = cone.getOutputData();
    const conePts = conePD.getPoints().getData();

    // Apply transformation to the cone
    MatrixBuilder/* default */.A.buildFromRadian().translate(1.0 - model.tipLength * 0.5, 0.0, 0.0).apply(conePts);
    const append = vtkAppendPolyData$1.newInstance();
    append.setInputData(cylinderPD);
    append.addInputData(conePD);
    const appendPD = append.getOutputData();
    const appendPts = appendPD.getPoints().getData();
    // Center the arrow about [0, 0, 0]
    MatrixBuilder/* default */.A.buildFromRadian().translate(-0.5 + model.tipLength * 0.5, 0.0, 0.0).apply(appendPts);
    if (model.invert) {
      // Apply transformation to the arrow
      MatrixBuilder/* default */.A.buildFromRadian().rotateFromDirections([1, 0, 0], model.direction).scale(-1, -1, -1).apply(appendPts);

      // Update output
      outData[0] = appendPD;
    } else {
      // Apply transformation to the arrow
      MatrixBuilder/* default */.A.buildFromRadian().rotateFromDirections([1, 0, 0], model.direction).scale(1, 1, 1).apply(appendPts);

      // Update output
      outData[0] = append.getOutputData();
    }
  }

  // Expose methods
  publicAPI.requestData = requestData;
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const ArrowSource_DEFAULT_VALUES = {
  tipResolution: 6,
  tipRadius: 0.1,
  tipLength: 0.35,
  shaftResolution: 6,
  shaftRadius: 0.03,
  invert: false,
  direction: [1.0, 0.0, 0.0],
  pointType: 'Float64Array'
};

// ----------------------------------------------------------------------------

function ArrowSource_extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, ArrowSource_DEFAULT_VALUES, initialValues);

  // Build VTK API
  macros2.m.obj(publicAPI, model);
  macros2.m.setGet(publicAPI, model, ['tipResolution', 'tipRadius', 'tipLength', 'shaftResolution', 'shaftRadius', 'invert']);
  macros2.m.setGetArray(publicAPI, model, ['direction'], 3);
  macros2.m.algo(publicAPI, model, 0, 1);
  vtkArrowSource(publicAPI, model);
}

// ----------------------------------------------------------------------------

const ArrowSource_newInstance = macros2.m.newInstance(ArrowSource_extend, 'vtkArrowSource');

// ----------------------------------------------------------------------------

var vtkArrowSource$1 = {
  newInstance: ArrowSource_newInstance,
  extend: ArrowSource_extend
};



;// ../../../node_modules/@kitware/vtk.js/Rendering/Core/AxesActor.js








// ----------------------------------------------------------------------------

function centerDataSet(ds) {
  const bounds = ds.getPoints().getBounds();
  const center = [-(bounds[0] + bounds[1]) * 0.5, -(bounds[2] + bounds[3]) * 0.5, -(bounds[4] + bounds[5]) * 0.5];
  MatrixBuilder/* default */.A.buildFromDegree().translate(...center).apply(ds.getPoints().getData());
}
function shiftDataset(ds, axis) {
  let invert = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  const bounds = ds.getPoints().getBounds();
  const center = [0, 0, 0];
  if (invert) {
    center[axis] = -bounds[axis * 2 + 1];
  } else {
    center[axis] = -bounds[axis * 2];
  }
  MatrixBuilder/* default */.A.buildFromDegree().translate(...center).apply(ds.getPoints().getData());
}

// ----------------------------------------------------------------------------

function addColor(ds, r, g, b) {
  const size = ds.getPoints().getData().length;
  const rgbArray = new Uint8ClampedArray(size);
  let offset = 0;
  while (offset < size) {
    rgbArray[offset++] = r;
    rgbArray[offset++] = g;
    rgbArray[offset++] = b;
  }
  ds.getPointData().setScalars(DataArray/* default.newInstance */.Ay.newInstance({
    name: 'color',
    numberOfComponents: 3,
    values: rgbArray
  }));
}

// ----------------------------------------------------------------------------
// vtkAxesActor
// ----------------------------------------------------------------------------

function vtkAxesActor(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkAxesActor');
  const _mapper = Mapper/* default.newInstance */.Ay.newInstance();
  publicAPI.setMapper(_mapper);
  publicAPI.update = () => {
    let currentConfig = {
      ...model.config,
      ...model.xConfig
    };
    const xAxis = vtkArrowSource$1.newInstance({
      direction: [1, 0, 0],
      ...currentConfig
    }).getOutputData();
    if (model.config.recenter) {
      centerDataSet(xAxis);
    } else {
      shiftDataset(xAxis, 0, currentConfig.invert);
    }
    addColor(xAxis, ...currentConfig.color);
    currentConfig = {
      ...model.config,
      ...model.yConfig
    };
    const yAxis = vtkArrowSource$1.newInstance({
      direction: [0, 1, 0],
      ...currentConfig
    }).getOutputData();
    if (model.config.recenter) {
      centerDataSet(yAxis);
    } else {
      shiftDataset(yAxis, 1, currentConfig.invert);
    }
    addColor(yAxis, ...currentConfig.color);
    currentConfig = {
      ...model.config,
      ...model.zConfig
    };
    const zAxis = vtkArrowSource$1.newInstance({
      direction: [0, 0, 1],
      ...currentConfig
    }).getOutputData();
    if (model.config.recenter) {
      centerDataSet(zAxis);
    } else {
      shiftDataset(zAxis, 2, currentConfig.invert);
    }
    addColor(zAxis, ...currentConfig.color);
    const source = vtkAppendPolyData$1.newInstance();
    source.setInputData(xAxis);
    source.addInputData(yAxis);
    source.addInputData(zAxis);
    _mapper.setInputConnection(source.getOutputPort());
  };
  publicAPI.update();
  const _debouncedUpdate = macros2.m.debounce(publicAPI.update, 0);
  publicAPI.setXAxisColor = color => publicAPI.setXConfig({
    ...publicAPI.getXConfig(),
    color
  });
  publicAPI.setYAxisColor = color => publicAPI.setYConfig({
    ...publicAPI.getYConfig(),
    color
  });
  publicAPI.setZAxisColor = color => publicAPI.setZConfig({
    ...publicAPI.getZConfig(),
    color
  });
  publicAPI.getXAxisColor = () => model.getXConfig().color;
  publicAPI.getYAxisColor = () => model.getYConfig().color;
  publicAPI.getZAxisColor = () => model.getZConfig().color;
  model._onConfigChanged = _debouncedUpdate;
  model._onXConfigChanged = _debouncedUpdate;
  model._onYConfigChanged = _debouncedUpdate;
  model._onZConfigChanged = _debouncedUpdate;
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

function defaultValues(initialValues) {
  return {
    config: {
      recenter: true,
      tipResolution: 60,
      tipRadius: 0.1,
      tipLength: 0.2,
      shaftResolution: 60,
      shaftRadius: 0.03,
      invert: false,
      ...initialValues?.config
    },
    xConfig: {
      color: [255, 0, 0],
      invert: false,
      ...initialValues?.xConfig
    },
    yConfig: {
      color: [255, 255, 0],
      invert: false,
      ...initialValues?.yConfig
    },
    zConfig: {
      color: [0, 128, 0],
      invert: false,
      ...initialValues?.zConfig
    }
  };
}

// ----------------------------------------------------------------------------

function AxesActor_extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  // Inheritance
  Actor/* default.extend */.Ay.extend(publicAPI, model, defaultValues(initialValues));
  macros2.m.setGet(publicAPI, model, ['config', 'xConfig', 'yConfig', 'zConfig']);

  // Object methods
  vtkAxesActor(publicAPI, model);
}

// ----------------------------------------------------------------------------

const AxesActor_newInstance = macros2.m.newInstance(AxesActor_extend, 'vtkAxesActor');

// ----------------------------------------------------------------------------

var vtkAxesActor$1 = {
  newInstance: AxesActor_newInstance,
  extend: AxesActor_extend
};




/***/ })

}]);