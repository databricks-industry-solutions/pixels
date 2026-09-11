"use strict";
(globalThis["rspackChunk"] = globalThis["rspackChunk"] || []).push([[6938], {
69501(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
const CORNERSTONE_COLOR_LUT = [
    [0, 0, 0, 0],
    [221, 84, 84, 255],
    [77, 228, 121, 255],
    [166, 70, 235, 255],
    [189, 180, 116, 255],
    [109, 182, 196, 255],
    [204, 101, 157, 255],
    [123, 211, 94, 255],
    [93, 87, 218, 255],
    [225, 128, 80, 255],
    [73, 232, 172, 255],
    [181, 119, 186, 255],
    [176, 193, 112, 255],
    [105, 153, 200, 255],
    [208, 97, 120, 255],
    [90, 215, 101, 255],
    [135, 83, 222, 255],
    [229, 178, 76, 255],
    [122, 183, 181, 255],
    [190, 115, 171, 255],
    [149, 197, 108, 255],
    [100, 118, 205, 255],
    [212, 108, 93, 255],
    [86, 219, 141, 255],
    [183, 79, 226, 255],
    [233, 233, 72, 255],
    [118, 167, 187, 255],
    [194, 111, 146, 255],
    [116, 201, 104, 255],
    [115, 96, 209, 255],
    [216, 147, 89, 255],
    [82, 223, 188, 255],
    [230, 75, 224, 255],
    [163, 184, 121, 255],
    [114, 143, 191, 255],
    [198, 107, 114, 255],
    [99, 206, 122, 255],
    [153, 92, 213, 255],
    [220, 192, 85, 255],
    [78, 215, 227, 255],
    [234, 71, 173, 255],
    [141, 188, 117, 255],
    [110, 113, 195, 255],
    [202, 128, 103, 255],
    [95, 210, 157, 255],
    [195, 88, 217, 255],
    [206, 224, 81, 255],
    [74, 166, 231, 255],
    [185, 120, 139, 255],
    [113, 192, 113, 255],
    [133, 106, 199, 255],
    [207, 162, 98, 255],
    [91, 214, 198, 255],
    [221, 84, 198, 255],
    [159, 228, 77, 255],
    [70, 111, 235, 255],
    [189, 119, 116, 255],
    [109, 196, 138, 255],
    [165, 101, 204, 255],
    [211, 201, 94, 255],
    [87, 191, 218, 255],
    [225, 80, 153, 255],
    [106, 232, 73, 255],
    [124, 119, 186, 255],
    [193, 142, 112, 255],
    [105, 200, 168, 255],
    [203, 97, 208, 255],
    [184, 215, 90, 255],
    [83, 147, 222, 255],
    [229, 76, 101, 255],
    [122, 183, 130, 255],
    [146, 115, 190, 255],
    [197, 171, 108, 255],
    [100, 205, 205, 255],
    [212, 93, 177, 255],
    [141, 219, 86, 255],
    [79, 97, 226, 255],
    [233, 99, 72, 255],
    [118, 187, 150, 255],
    [173, 111, 194, 255],
    [197, 201, 104, 255],
    [96, 171, 209, 255],
    [216, 89, 137, 255],
    [94, 223, 82, 255],
    [107, 75, 230, 255],
    [184, 153, 121, 255],
    [114, 191, 175, 255],
    [198, 107, 191, 255],
    [166, 206, 99, 255],
    [92, 132, 213, 255],
    [220, 85, 91, 255],
    [78, 227, 115, 255],
    [159, 71, 234, 255],
    [188, 176, 117, 255],
    [110, 185, 195, 255],
    [202, 103, 161, 255],
    [129, 210, 95, 255],
    [88, 88, 217, 255],
    [224, 123, 81, 255],
    [74, 231, 166, 255],
    [177, 120, 185, 255],
    [179, 192, 113, 255],
    [106, 156, 199, 255],
    [207, 98, 125, 255],
    [91, 214, 96, 255],
    [130, 84, 221, 255],
    [228, 171, 77, 255],
    [70, 235, 221, 255],
    [189, 116, 174, 255],
    [153, 196, 109, 255],
    [101, 123, 204, 255],
    [211, 104, 94, 255],
    [87, 218, 136, 255],
    [177, 80, 225, 255],
    [232, 225, 73, 255],
    [119, 169, 186, 255],
    [193, 112, 149, 255],
    [121, 200, 105, 255],
    [111, 97, 208, 255],
    [215, 142, 90, 255],
    [83, 222, 181, 255],
    [229, 76, 229, 255],
    [165, 183, 122, 255],
    [115, 146, 190, 255],
    [197, 108, 119, 255],
    [100, 205, 118, 255],
    [148, 93, 212, 255],
    [219, 186, 86, 255],
    [79, 220, 226, 255],
    [233, 72, 179, 255],
    [144, 187, 118, 255],
    [111, 118, 194, 255],
    [201, 124, 104, 255],
    [96, 209, 153, 255],
    [189, 89, 216, 255],
    [211, 223, 82, 255],
    [75, 172, 230, 255],
    [184, 121, 142, 255],
    [117, 191, 114, 255],
    [130, 107, 198, 255],
    [206, 157, 99, 255],
    [92, 213, 193, 255],
    [220, 85, 203, 255],
    [165, 227, 78, 255],
    [71, 118, 234, 255],
    [188, 117, 117, 255],
    [110, 195, 135, 255],
    [161, 103, 202, 255],
    [210, 195, 95, 255],
    [88, 195, 217, 255],
    [224, 81, 158, 255],
    [113, 231, 74, 255],
    [123, 120, 185, 255],
    [192, 139, 113, 255],
    [106, 199, 164, 255],
    [198, 98, 207, 255],
    [188, 214, 91, 255],
    [84, 153, 221, 255],
    [228, 77, 108, 255],
    [70, 235, 84, 255],
    [143, 116, 189, 255],
    [196, 167, 109, 255],
    [101, 204, 199, 255],
    [211, 94, 182, 255],
    [147, 218, 87, 255],
    [80, 104, 225, 255],
    [232, 93, 73, 255],
    [119, 186, 147, 255],
    [170, 112, 193, 255],
    [200, 200, 105, 255],
    [97, 175, 208, 255],
    [215, 90, 142, 255],
    [100, 222, 83, 255],
    [101, 76, 229, 255],
    [183, 150, 122, 255],
    [115, 190, 171, 255],
    [197, 108, 194, 255],
    [170, 205, 100, 255],
    [93, 138, 212, 255],
    [219, 86, 97, 255],
    [79, 226, 110, 255],
    [153, 72, 233, 255],
    [187, 173, 118, 255],
    [111, 187, 194, 255],
    [201, 104, 165, 255],
    [134, 209, 96, 255],
    [89, 95, 216, 255],
    [223, 117, 82, 255],
    [75, 230, 159, 255],
    [174, 121, 184, 255],
    [182, 191, 114, 255],
    [107, 160, 198, 255],
    [206, 99, 130, 255],
    [92, 213, 92, 255],
    [124, 85, 220, 255],
    [227, 165, 78, 255],
    [71, 234, 214, 255],
    [188, 117, 176, 255],
    [156, 195, 110, 255],
    [103, 128, 202, 255],
    [210, 100, 95, 255],
    [88, 217, 131, 255],
    [170, 81, 224, 255],
    [231, 218, 74, 255],
    [120, 172, 185, 255],
    [192, 113, 153, 255],
    [125, 199, 106, 255],
    [107, 98, 207, 255],
    [214, 137, 91, 255],
    [84, 221, 175, 255],
    [222, 77, 228, 255],
    [194, 235, 70, 255],
    [116, 149, 189, 255],
    [196, 109, 123, 255],
    [101, 204, 114, 255],
    [143, 94, 211, 255],
    [218, 180, 87, 255],
    [80, 225, 225, 255],
    [232, 73, 186, 255],
    [147, 186, 119, 255],
    [112, 122, 193, 255],
    [200, 121, 105, 255],
    [97, 208, 148, 255],
    [184, 90, 215, 255],
    [216, 222, 83, 255],
    [76, 178, 229, 255],
    [183, 122, 145, 255],
    [121, 190, 115, 255],
    [126, 108, 197, 255],
    [205, 153, 100, 255],
    [93, 212, 187, 255],
    [219, 86, 208, 255],
    [171, 226, 79, 255],
    [72, 126, 233, 255],
    [187, 118, 121, 255],
    [111, 194, 132, 255],
    [157, 104, 201, 255],
    [209, 190, 96, 255],
    [89, 200, 216, 255],
    [223, 82, 164, 255],
    [120, 230, 75, 255],
    [121, 121, 184, 255],
    [191, 136, 114, 255],
    [107, 198, 160, 255],
    [192, 99, 206, 255],
    [193, 213, 92, 255],
    [85, 158, 220, 255],
    [227, 78, 115, 255],
    [71, 234, 78, 255],
    [141, 117, 188, 255],
    [195, 163, 110, 255],
    [103, 202, 194, 255],
    [210, 95, 186, 255],
    [153, 217, 88, 255],
    [81, 111, 224, 255],
];
/* export default */ const __rspack_default_export = (CORNERSTONE_COLOR_LUT);


},
51511(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (customCallbackHandler)
});
/* import */ var _store_state_js__rspack_import_0 = __webpack_require__(17873);
/* import */ var _enums_ToolModes_js__rspack_import_1 = __webpack_require__(48657);
/* import */ var _store_ToolGroupManager_index_js__rspack_import_2 = __webpack_require__(72314);



const { Active } = _enums_ToolModes_js__rspack_import_1/* ["default"] */.A;
function customCallbackHandler(handlerType, customFunction, evt) {
    if (_store_state_js__rspack_import_0/* .state.isInteractingWithTool */.wk.isInteractingWithTool) {
        return false;
    }
    const { renderingEngineId, viewportId } = evt.detail;
    const toolGroup = (0,_store_ToolGroupManager_index_js__rspack_import_2.getToolGroupForViewport)(viewportId, renderingEngineId);
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


},
90057(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _enums_index_js__rspack_import_0 = __webpack_require__(53870);

const getMouseModifierKey = (evt) => {
    if (evt.shiftKey) {
        if (evt.ctrlKey) {
            return _enums_index_js__rspack_import_0.KeyboardBindings.ShiftCtrl;
        }
        if (evt.altKey) {
            return _enums_index_js__rspack_import_0.KeyboardBindings.ShiftAlt;
        }
        if (evt.metaKey) {
            return _enums_index_js__rspack_import_0.KeyboardBindings.ShiftMeta;
        }
        return _enums_index_js__rspack_import_0.KeyboardBindings.Shift;
    }
    if (evt.ctrlKey) {
        if (evt.altKey) {
            return _enums_index_js__rspack_import_0.KeyboardBindings.CtrlAlt;
        }
        if (evt.metaKey) {
            return _enums_index_js__rspack_import_0.KeyboardBindings.CtrlMeta;
        }
        return _enums_index_js__rspack_import_0.KeyboardBindings.Ctrl;
    }
    if (evt.altKey) {
        return (evt.metaKey && _enums_index_js__rspack_import_0.KeyboardBindings.AltMeta) || _enums_index_js__rspack_import_0.KeyboardBindings.Alt;
    }
    if (evt.metaKey) {
        return _enums_index_js__rspack_import_0.KeyboardBindings.Meta;
    }
    return undefined;
};
/* export default */ const __rspack_default_export = (getMouseModifierKey);


},
47881(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  u: () => (addColorLUT)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _SegmentationStateManager_js__rspack_import_1 = __webpack_require__(86706);
/* import */ var _getNextColorLUTIndex_js__rspack_import_2 = __webpack_require__(43243);
/* import */ var _constants_COLOR_LUT_js__rspack_import_3 = __webpack_require__(69501);




const PREVIEW_COLOR_INDEX = 255;
const MINIMUM_COLOR_LUT_ENTRIES = PREVIEW_COLOR_INDEX + 1;
function addColorLUT(colorLUT, index) {
    const segmentationStateManager = _SegmentationStateManager_js__rspack_import_1/* .defaultSegmentationStateManager */._6;
    const indexToUse = index ?? (0,_getNextColorLUTIndex_js__rspack_import_2/* .getNextColorLUTIndex */.u)();
    let colorLUTToUse = [...colorLUT];
    if (!_cornerstonejs_core__rspack_import_0.utilities.isEqual(colorLUTToUse[0], [0, 0, 0, 0])) {
        console.warn('addColorLUT: [0, 0, 0, 0] color is not provided for the background color (segmentIndex =0), automatically adding it');
        colorLUTToUse = [[0, 0, 0, 0], ...colorLUTToUse];
    }
    colorLUTToUse = colorLUTToUse.map((color) => {
        if (color.length === 3) {
            return [color[0], color[1], color[2], 255];
        }
        return color;
    });
    if (colorLUTToUse.length < MINIMUM_COLOR_LUT_ENTRIES) {
        const missingColorLUTs = _constants_COLOR_LUT_js__rspack_import_3/* ["default"].slice */.A.slice(colorLUTToUse.length);
        colorLUTToUse = [...colorLUTToUse, ...missingColorLUTs];
    }
    while (colorLUTToUse.length < MINIMUM_COLOR_LUT_ENTRIES) {
        const paletteIndex = ((colorLUTToUse.length - 1) % (_constants_COLOR_LUT_js__rspack_import_3/* ["default"].length */.A.length - 1)) + 1;
        colorLUTToUse.push([..._constants_COLOR_LUT_js__rspack_import_3/* ["default"] */.A[paletteIndex]]);
    }
    segmentationStateManager.addColorLUT(colorLUTToUse, indexToUse);
    return indexToUse;
}


},
43243(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  u: () => (getNextColorLUTIndex)
});
/* import */ var _SegmentationStateManager_js__rspack_import_0 = __webpack_require__(86706);

function getNextColorLUTIndex() {
    const segmentationStateManager = _SegmentationStateManager_js__rspack_import_0/* .defaultSegmentationStateManager */._6;
    return segmentationStateManager.getNextColorLUTIndex();
}


},
54869(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Ut: () => (getSegmentationRepresentation),
  ny: () => (getSegmentationRepresentationsBySegmentationId),
  r$: () => (getSegmentationRepresentations)
});
/* import */ var _SegmentationStateManager_js__rspack_import_0 = __webpack_require__(86706);

function getSegmentationRepresentations(viewportId, specifier = {}) {
    const segmentationStateManager = _SegmentationStateManager_js__rspack_import_0/* .defaultSegmentationStateManager */._6;
    return segmentationStateManager.getSegmentationRepresentations(viewportId, specifier);
}
function getSegmentationRepresentation(viewportId, specifier) {
    const segmentationStateManager = _SegmentationStateManager_js__rspack_import_0/* .defaultSegmentationStateManager */._6;
    if (!specifier.segmentationId || !specifier.type) {
        throw new Error('getSegmentationRepresentation: No segmentationId or type provided, you need to provide at least one of them');
    }
    const representations = segmentationStateManager.getSegmentationRepresentations(viewportId, specifier);
    return representations?.[0];
}
function getSegmentationRepresentationsBySegmentationId(segmentationId) {
    const segmentationStateManager = _SegmentationStateManager_js__rspack_import_0/* .defaultSegmentationStateManager */._6;
    return segmentationStateManager.getSegmentationRepresentationsBySegmentationId(segmentationId);
}


},
7333(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  I: () => (getSegmentationRepresentationVisibility)
});
/* import */ var _SegmentationStateManager_js__rspack_import_0 = __webpack_require__(86706);

function getSegmentationRepresentationVisibility(viewportId, specifier) {
    const segmentationStateManager = _SegmentationStateManager_js__rspack_import_0/* .defaultSegmentationStateManager */._6;
    return segmentationStateManager.getSegmentationRepresentationVisibility(viewportId, specifier);
}


},
47153(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  DU: () => (getSurfaceRepresentationUID),
  ED: () => (getLabelmapActorEntries),
  Th: () => (getSurfaceActorEntry),
  wV: () => (getLabelmapActorEntry)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _enums_index_js__rspack_import_1 = __webpack_require__(53870);


function getActorEntry(viewportId, segmentationId, filterFn) {
    const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElementByViewportId)(viewportId);
    if (!enabledElement) {
        return;
    }
    const { renderingEngine, viewport } = enabledElement;
    if (!renderingEngine || !viewport) {
        return;
    }
    const actors = viewport.getActors();
    const filteredActors = actors.filter(filterFn);
    return filteredActors.length > 0 ? filteredActors[0] : undefined;
}
function getActorEntries(viewportId, filterFn) {
    const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElementByViewportId)(viewportId);
    if (!enabledElement) {
        return;
    }
    const { renderingEngine, viewport } = enabledElement;
    if (!renderingEngine || !viewport) {
        return;
    }
    const actors = viewport.getActors();
    const filteredActors = actors.filter(filterFn);
    return filteredActors.length > 0 ? filteredActors : undefined;
}
function getLabelmapActorUID(viewportId, segmentationId) {
    const actorEntry = getLabelmapActorEntry(viewportId, segmentationId);
    return actorEntry?.uid;
}
function getLabelmapActorEntries(viewportId, segmentationId) {
    return getActorEntries(viewportId, (actor) => actor.representationUID?.startsWith(`${segmentationId}-${_enums_index_js__rspack_import_1.SegmentationRepresentations.Labelmap}`));
}
function getLabelmapActorEntry(viewportId, segmentationId, referencedId) {
    return getActorEntry(viewportId, segmentationId, (actor) => actor.representationUID?.startsWith(`${segmentationId}-${_enums_index_js__rspack_import_1.SegmentationRepresentations.Labelmap}`) &&
        (!referencedId || actor.referencedId === referencedId));
}
function getSurfaceActorEntry(viewportId, segmentationId, segmentIndex) {
    return getActorEntry(viewportId, segmentationId, (actor) => actor.representationUID ===
        getSurfaceRepresentationUID(segmentationId, segmentIndex));
}
function getSurfaceRepresentationUID(segmentationId, segmentIndex) {
    return `${segmentationId}-${_enums_index_js__rspack_import_1.SegmentationRepresentations.Surface}-${segmentIndex}`;
}


},
78132(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  B: () => (isSegmentationOverlayCompatible)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _enums_index_js__rspack_import_1 = __webpack_require__(53870);
/* import */ var _getSegmentation_js__rspack_import_2 = __webpack_require__(99212);
/* import */ var _labelmapModel_index_js__rspack_import_3 = __webpack_require__(84120);




function getLayerReferencedImageIds(layer) {
    if (layer.referencedImageIds?.length) {
        return layer.referencedImageIds;
    }
    const labelmapImageIds = layer.imageIds ??
        (layer.volumeId
            ? _cornerstonejs_core__rspack_import_0.cache.getVolume(layer.volumeId)?.imageIds
            : undefined) ??
        [];
    return labelmapImageIds
        .map((labelmapImageId) => _cornerstonejs_core__rspack_import_0.cache.getImage(labelmapImageId)?.referencedImageId)
        .filter(Boolean);
}
function getLayerFrameOfReferenceUIDs(layer) {
    const frameOfReferenceUIDs = new Set();
    if (layer.volumeId) {
        const volumeFrameOfReference = _cornerstonejs_core__rspack_import_0.cache.getVolume(layer.volumeId)?.metadata?.FrameOfReferenceUID;
        if (volumeFrameOfReference) {
            frameOfReferenceUIDs.add(volumeFrameOfReference);
        }
    }
    for (const referencedImageId of getLayerReferencedImageIds(layer)) {
        const imageFrameOfReference = _cornerstonejs_core__rspack_import_0.metaData.get('imagePlaneModule', referencedImageId)?.frameOfReferenceUID;
        if (imageFrameOfReference) {
            frameOfReferenceUIDs.add(imageFrameOfReference);
        }
    }
    return [...frameOfReferenceUIDs];
}
function volumeViewportSharesFrameOfReference(viewport, layers) {
    let viewportFrameOfReference;
    try {
        viewportFrameOfReference = viewport.getFrameOfReferenceUID?.();
    }
    catch (error) {
        return true;
    }
    if (!viewportFrameOfReference) {
        return true;
    }
    const labelmapFrameOfReferenceUIDs = layers.flatMap((layer) => getLayerFrameOfReferenceUIDs(layer));
    if (!labelmapFrameOfReferenceUIDs.length) {
        return true;
    }
    return labelmapFrameOfReferenceUIDs.includes(viewportFrameOfReference);
}
function stackViewportReferencesImages(viewport, layers) {
    const referencedImageIds = layers.flatMap((layer) => getLayerReferencedImageIds(layer));
    if (!referencedImageIds.length) {
        return true;
    }
    let viewportImageIds;
    try {
        viewportImageIds =
            viewport.getImageIds?.() ?? [];
    }
    catch (error) {
        return true;
    }
    if (!viewportImageIds.length) {
        return true;
    }
    const referencedImageIdSet = new Set(referencedImageIds);
    return viewportImageIds.some((imageId) => referencedImageIdSet.has(imageId));
}
function isSegmentationOverlayCompatible(viewport, segmentationId, representationType) {
    if (representationType !== _enums_index_js__rspack_import_1.SegmentationRepresentations.Labelmap) {
        return true;
    }
    if (!viewport) {
        return true;
    }
    const segmentation = (0,_getSegmentation_js__rspack_import_2/* .getSegmentation */.T)(segmentationId);
    if (!segmentation) {
        return true;
    }
    const layers = (0,_labelmapModel_index_js__rspack_import_3/* .getLabelmaps */.m)(segmentation);
    const isVolumeViewport = typeof viewport
        .getAllVolumeIds === 'function';
    return isVolumeViewport
        ? volumeViewportSharesFrameOfReference(viewport, layers)
        : stackViewportReferencesImages(viewport, layers);
}


},
53585(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  KM: () => (DIRECTION_ALIGNMENT_TOLERANCE),
  QO: () => (canRenderVolumeViewportLabelmapAsImage),
  bY: () => (shouldUseSliceRendering),
  o: () => (getVolumeViewportLabelmapImageMapperState),
  yc: () => (isSliceRenderingEnabled)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var gl_matrix__rspack_import_1 = __webpack_require__(40230);
/* import */ var _labelmapModel_labelmapLayerStore_js__rspack_import_2 = __webpack_require__(88392);



const DIRECTION_ALIGNMENT_TOLERANCE = 0.999;
const MINIMUM_SLAB_THICKNESS = 0.1;
const SLAB_THICKNESS_EPSILON = 1e-3;
const LABELMAP_IMAGE_MAPPER_URL_PARAM = 'labelmapImageMapper';
function isSupportedImageMapperBlendMode(blendMode) {
    return (blendMode === _cornerstonejs_core__rspack_import_0.Enums.BlendModes.COMPOSITE ||
        blendMode === _cornerstonejs_core__rspack_import_0.Enums.BlendModes.AVERAGE_INTENSITY_BLEND);
}
function isPlanarGpuVolumeSliceViewport(viewport) {
    const compatibilityViewport = viewport;
    if (compatibilityViewport.type !== _cornerstonejs_core__rspack_import_0.Enums.ViewportType.PLANAR_NEXT) {
        return false;
    }
    return (getPlanarPrimaryRenderMode(compatibilityViewport) ===
        _cornerstonejs_core__rspack_import_0.ActorRenderMode.VTK_VOLUME_SLICE);
}
function getPlanarPrimaryRenderMode(viewport) {
    const primaryDataId = getPlanarPrimaryDataId(viewport);
    if (primaryDataId) {
        const renderMode = viewport.getDisplaySetRenderMode?.(primaryDataId);
        if (renderMode) {
            return renderMode;
        }
    }
    return viewport.getDefaultActor?.()?.actorMapper?.renderMode;
}
function getPlanarVolumeSliceMapper(viewport) {
    const defaultActor = viewport.getDefaultActor?.();
    return (defaultActor?.actorMapper?.mapper ??
        defaultActor?.actorMapper?.actor?.getMapper?.());
}
function getPlanarPrimaryDataId(viewport) {
    const sourceDataId = viewport.getSourceDataId?.();
    if (sourceDataId) {
        return sourceDataId;
    }
    const renderModes = viewport._debug?.renderModes;
    if (!renderModes) {
        return;
    }
    return (Object.entries(renderModes).find(([dataId, renderMode]) => viewport.getDisplaySetRole?.(dataId) === 'source' &&
        renderMode === _cornerstonejs_core__rspack_import_0.ActorRenderMode.VTK_VOLUME_SLICE)?.[0] ??
        Object.entries(renderModes).find(([, renderMode]) => renderMode === _cornerstonejs_core__rspack_import_0.ActorRenderMode.VTK_VOLUME_SLICE)?.[0]);
}
function getLabelmapImageMapperCamera(viewport) {
    const compatibilityViewport = viewport;
    const resolvedCamera = compatibilityViewport
        .getResolvedView?.()
        ?.toICamera?.();
    if (isLabelmapImageMapperCamera(resolvedCamera)) {
        return resolvedCamera;
    }
    const legacyCamera = compatibilityViewport.getCamera?.();
    return isLabelmapImageMapperCamera(legacyCamera) ? legacyCamera : undefined;
}
function isLabelmapImageMapperCamera(camera) {
    const candidate = camera;
    return Boolean(candidate &&
        isPoint3Like(candidate.viewPlaneNormal) &&
        isPoint3Like(candidate.viewUp));
}
function isPoint3Like(value) {
    const candidate = value;
    return Boolean(candidate &&
        typeof candidate.length === 'number' &&
        candidate.length >= 3 &&
        Number.isFinite(Number(candidate[0])) &&
        Number.isFinite(Number(candidate[1])) &&
        Number.isFinite(Number(candidate[2])));
}
function getPlanarVolumeDataPresentation(viewport) {
    if (!viewport.getDisplaySetPresentation) {
        return;
    }
    const primaryDataId = getPlanarPrimaryDataId(viewport);
    return primaryDataId
        ? viewport.getDisplaySetPresentation(primaryDataId)
        : undefined;
}
function getCompatibilityBlendMode(viewport) {
    if (viewport instanceof _cornerstonejs_core__rspack_import_0.VolumeViewport) {
        return viewport.getBlendMode?.();
    }
    if (!isPlanarGpuVolumeSliceViewport(viewport)) {
        return;
    }
    const presentationBlendMode = getPlanarVolumeDataPresentation(viewport)?.blendMode;
    if (presentationBlendMode !== undefined) {
        return presentationBlendMode;
    }
    return _cornerstonejs_core__rspack_import_0.Enums.BlendModes.AVERAGE_INTENSITY_BLEND;
}
function getCompatibilitySlabThickness(viewport) {
    if (viewport instanceof _cornerstonejs_core__rspack_import_0.VolumeViewport) {
        return viewport.getSlabThickness?.() ?? MINIMUM_SLAB_THICKNESS;
    }
    if (!isPlanarGpuVolumeSliceViewport(viewport)) {
        return MINIMUM_SLAB_THICKNESS;
    }
    const mapperSlabThickness = getPlanarVolumeSliceMapper(viewport)?.getSlabThickness?.();
    if (typeof mapperSlabThickness === 'number') {
        return mapperSlabThickness;
    }
    return (getPlanarVolumeDataPresentation(viewport)?.slabThickness ??
        MINIMUM_SLAB_THICKNESS);
}
function isSliceRenderingEnabled(options) {
    if (options?.useSliceRendering) {
        return true;
    }
    if (typeof window === 'undefined') {
        return false;
    }
    const params = new URLSearchParams(window.location.search);
    if (!params.has(LABELMAP_IMAGE_MAPPER_URL_PARAM)) {
        return false;
    }
    const value = params.get(LABELMAP_IMAGE_MAPPER_URL_PARAM);
    if (value === null || value === '') {
        return true;
    }
    const normalizedValue = value.trim().toLowerCase();
    return (normalizedValue !== '0' &&
        normalizedValue !== 'false' &&
        normalizedValue !== 'off');
}
function shouldUseSliceRendering(segmentation, options) {
    if (isSliceRenderingEnabled(options)) {
        return true;
    }
    if (!segmentation?.representationData?.Labelmap) {
        return false;
    }
    const layers = (0,_labelmapModel_labelmapLayerStore_js__rspack_import_2/* .getLabelmaps */.m)(segmentation);
    return (layers.length > 1 && layers.some((layer) => layer.storageKind === 'stack'));
}
function canRenderVolumeViewportLabelmapAsImage(viewport) {
    const isLegacyVolumeViewport = viewport instanceof _cornerstonejs_core__rspack_import_0.VolumeViewport;
    const isNextPlanarViewport = isPlanarGpuVolumeSliceViewport(viewport);
    if (!isLegacyVolumeViewport && !isNextPlanarViewport) {
        return false;
    }
    const blendMode = getCompatibilityBlendMode(viewport);
    if (isLegacyVolumeViewport && !isSupportedImageMapperBlendMode(blendMode)) {
        return false;
    }
    const slabThickness = getCompatibilitySlabThickness(viewport);
    if (slabThickness > MINIMUM_SLAB_THICKNESS + SLAB_THICKNESS_EPSILON) {
        return false;
    }
    if (isLegacyVolumeViewport) {
        try {
            viewport.getSliceViewInfo();
            return true;
        }
        catch {
            return false;
        }
    }
    return true;
}
function getVolumeViewportLabelmapImageMapperState(viewport) {
    const compatibilityViewport = viewport;
    const isLegacyVolumeViewport = viewport instanceof _cornerstonejs_core__rspack_import_0.VolumeViewport;
    const isNextPlanarViewport = isPlanarGpuVolumeSliceViewport(viewport);
    if (!isLegacyVolumeViewport && !isNextPlanarViewport) {
        return {
            key: 'unsupported:viewport',
            sliceIndex: NaN,
            supported: false,
        };
    }
    const camera = getLabelmapImageMapperCamera(viewport);
    if (!camera) {
        return {
            key: 'unsupported:camera',
            sliceIndex: NaN,
            supported: false,
        };
    }
    const { viewPlaneNormal, viewUp } = camera;
    const normalizedNormal = gl_matrix__rspack_import_1/* .vec3.normalize */.eR.S8(gl_matrix__rspack_import_1/* .vec3.create */.eR.vt(), viewPlaneNormal);
    const normalizedViewUp = gl_matrix__rspack_import_1/* .vec3.normalize */.eR.S8(gl_matrix__rspack_import_1/* .vec3.create */.eR.vt(), viewUp);
    let sliceIndex;
    if (isLegacyVolumeViewport) {
        try {
            sliceIndex = viewport.getSliceViewInfo().sliceIndex;
        }
        catch {
            sliceIndex = undefined;
        }
    }
    else {
        sliceIndex = compatibilityViewport.getCurrentImageIdIndex?.();
    }
    const blendMode = getCompatibilityBlendMode(viewport);
    const slabThickness = getCompatibilitySlabThickness(viewport);
    const orientationKey = [
        normalizedNormal.map((value) => value.toFixed(3)).join(','),
        normalizedViewUp.map((value) => value.toFixed(3)).join(','),
    ].join('|');
    if (isLegacyVolumeViewport && !isSupportedImageMapperBlendMode(blendMode)) {
        return {
            key: `unsupported:blend:${blendMode}:${orientationKey}`,
            sliceIndex: sliceIndex ?? NaN,
            supported: false,
        };
    }
    if (slabThickness > MINIMUM_SLAB_THICKNESS + SLAB_THICKNESS_EPSILON) {
        return {
            key: `unsupported:slab:${slabThickness.toFixed(3)}:${orientationKey}`,
            sliceIndex: sliceIndex ?? NaN,
            supported: false,
        };
    }
    if (isLegacyVolumeViewport) {
        try {
            viewport.getSliceViewInfo();
        }
        catch {
            return {
                key: `unsupported:oblique:${orientationKey}`,
                sliceIndex: sliceIndex ?? NaN,
                supported: false,
            };
        }
    }
    if (isNextPlanarViewport &&
        getPlanarPrimaryRenderMode(compatibilityViewport) !==
            _cornerstonejs_core__rspack_import_0.ActorRenderMode.VTK_VOLUME_SLICE) {
        return {
            key: `unsupported:renderMode:${orientationKey}`,
            sliceIndex: sliceIndex ?? NaN,
            supported: false,
        };
    }
    return {
        key: `supported:${orientationKey}:${sliceIndex ?? 0}`,
        sliceIndex: sliceIndex ?? NaN,
        supported: true,
    };
}



},
88392(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  $n: () => (removeLabelmap),
  AD: () => (registerLabelmap),
  BS: () => (getLabelmapForVolumeId),
  Hs: () => (getLabelmap),
  M4: () => (getLabelmapForImageId),
  kL: () => (getOrCreateLabelmapVolume),
  m: () => (getLabelmaps)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _normalizeLabelmapSegmentationData_js__rspack_import_1 = __webpack_require__(209);
/* import */ var _labelmapImageIdMapping_js__rspack_import_2 = __webpack_require__(26372);



function getLabelmap(segmentation, labelmapId) {
    return (0,_normalizeLabelmapSegmentationData_js__rspack_import_1/* .ensureLabelmapState */.uk)(segmentation)?.labelmaps?.[labelmapId];
}
function getLabelmaps(segmentation) {
    const labelmapState = (0,_normalizeLabelmapSegmentationData_js__rspack_import_1/* .ensureLabelmapState */.uk)(segmentation);
    if (!labelmapState) {
        return [];
    }
    return Object.values(labelmapState.labelmaps);
}
function registerLabelmap(segmentation, layer) {
    const labelmapState = (0,_normalizeLabelmapSegmentationData_js__rspack_import_1/* .ensureLabelmapState */.uk)(segmentation);
    if (!labelmapState) {
        return;
    }
    labelmapState.labelmaps[layer.labelmapId] = layer;
}
function removeLabelmap(segmentation, labelmapId) {
    const labelmapState = (0,_normalizeLabelmapSegmentationData_js__rspack_import_1/* .ensureLabelmapState */.uk)(segmentation);
    if (!labelmapState) {
        return;
    }
    const layer = labelmapState.labelmaps[labelmapId];
    if (layer?.geometryVolumeId && _cornerstonejs_core__rspack_import_0.cache.getVolume(layer.geometryVolumeId)) {
        _cornerstonejs_core__rspack_import_0.cache.removeVolumeLoadObject(layer.geometryVolumeId);
    }
    delete labelmapState.labelmaps[labelmapId];
}
function getOrCreateLabelmapVolume(layer) {
    const mergedVolume = getOrCreateMergedStackLabelmapVolume(layer);
    if (mergedVolume) {
        return mergedVolume;
    }
    const existingVolumeId = layer.volumeId ?? layer.geometryVolumeId;
    if (existingVolumeId) {
        const cachedVolume = _cornerstonejs_core__rspack_import_0.cache.getVolume(existingVolumeId);
        if (cachedVolume) {
            return cachedVolume;
        }
    }
    const imageIds = layer.imageIds ?? [];
    if (!imageIds.length) {
        return;
    }
    const volumeId = layer.volumeId ?? layer.geometryVolumeId ?? `${layer.labelmapId}-geometry`;
    if (!layer.volumeId) {
        layer.geometryVolumeId = volumeId;
    }
    const cachedVolume = _cornerstonejs_core__rspack_import_0.cache.getVolume(volumeId);
    if (cachedVolume) {
        return cachedVolume;
    }
    return _cornerstonejs_core__rspack_import_0.volumeLoader.createAndCacheVolumeFromImagesSync(volumeId, imageIds);
}
function getOrCreateMergedStackLabelmapVolume(layer) {
    if (layer.volumeId || !hasDuplicateReferencedImageIds(layer)) {
        return;
    }
    const volumeId = layer.geometryVolumeId ?? `${layer.labelmapId}-geometry`;
    const cachedVolume = _cornerstonejs_core__rspack_import_0.cache.getVolume(volumeId);
    if (cachedVolume) {
        return cachedVolume;
    }
    const imageIdsByReferencedImageId = new Map();
    (0,_labelmapImageIdMapping_js__rspack_import_2/* .forEachLabelmapImageReference */.Zd)(layer, (referencedImageId, imageId) => {
        const imageIdsForReference = imageIdsByReferencedImageId.get(referencedImageId) ?? [];
        imageIdsForReference.push(imageId);
        imageIdsByReferencedImageId.set(referencedImageId, imageIdsForReference);
    });
    const mergedReferencedImageIds = Array.from(imageIdsByReferencedImageId.keys());
    if (!mergedReferencedImageIds.length) {
        return;
    }
    let mergedImageIndex = 0;
    const mergedImages = _cornerstonejs_core__rspack_import_0.imageLoader.createAndCacheDerivedImages(mergedReferencedImageIds, {
        getDerivedImageId: () => `${volumeId}-image-${mergedImageIndex++}`,
        targetBuffer: { type: 'Uint8Array' },
    });
    mergedImages.forEach((mergedImage) => {
        const sourceImageIds = imageIdsByReferencedImageId.get(mergedImage.referencedImageId);
        if (!sourceImageIds?.length) {
            return;
        }
        const targetVoxelManager = mergedImage.voxelManager;
        const scalarDataLength = targetVoxelManager.getScalarDataLength();
        sourceImageIds.forEach((sourceImageId) => {
            const sourceImage = _cornerstonejs_core__rspack_import_0.cache.getImage(sourceImageId);
            const sourceVoxelManager = sourceImage?.voxelManager;
            if (!sourceVoxelManager) {
                return;
            }
            const sourceScalarDataLength = sourceVoxelManager.getScalarDataLength();
            const length = Math.min(scalarDataLength, sourceScalarDataLength);
            for (let index = 0; index < length; index++) {
                const value = Number(sourceVoxelManager.getAtIndex(index));
                if (value !== 0) {
                    targetVoxelManager.setAtIndex(index, value);
                }
            }
        });
    });
    layer.geometryVolumeId = volumeId;
    return _cornerstonejs_core__rspack_import_0.volumeLoader.createAndCacheVolumeFromImagesSync(volumeId, mergedImages.map((image) => image.imageId));
}
function hasDuplicateReferencedImageIds(layer) {
    return (0,_labelmapImageIdMapping_js__rspack_import_2/* .hasMultipleLabelmapImagesPerReferencedImageId */.dm)(layer);
}
function getLabelmapIds(segmentation) {
    return getLabelmaps(segmentation).map((layer) => layer.labelmapId);
}
function getLabelmapDataById(segmentation, labelmapId) {
    const labelmapState = ensureLabelmapState(segmentation);
    const layer = labelmapState?.labelmaps?.[labelmapId];
    if (!labelmapState || !layer) {
        return;
    }
    return {
        volumeId: layer.volumeId,
        referencedVolumeId: layer.referencedVolumeId,
        imageIds: layer.imageIds,
        referencedImageIds: layer.referencedImageIds,
        sourceRepresentationName: labelmapState.sourceRepresentationName,
        primaryLabelmapId: labelmapId,
        labelmaps: {
            [labelmapId]: layer,
        },
        segmentBindings: Object.fromEntries(Object.entries(labelmapState.segmentBindings).filter(([, binding]) => binding.labelmapId === labelmapId)),
    };
}
function getScalarArrayLengthFromLabelmap(layer) {
    if (layer.volumeId) {
        return cache.getVolume(layer.volumeId)?.voxelManager?.getScalarDataLength();
    }
    const firstImageId = layer.imageIds?.[0];
    const firstImage = firstImageId ? cache.getImage(firstImageId) : null;
    if (!firstImage || !layer.imageIds?.length) {
        return 0;
    }
    return firstImage.voxelManager.getScalarDataLength() * layer.imageIds.length;
}
function getConstructorNameForLabelmap(layer) {
    if (layer.volumeId) {
        return cache.getVolume(layer.volumeId)?.voxelManager?.getConstructor()
            ?.name;
    }
    const imageId = layer.imageIds?.[0];
    return imageId
        ? cache.getImage(imageId)?.voxelManager?.getConstructor()?.name
        : undefined;
}
function getLabelmapForImageId(segmentation, imageId) {
    return getLabelmaps(segmentation).find((layer) => layer.imageIds?.includes(imageId));
}
function getLabelmapForVolumeId(segmentation, volumeId) {
    return getLabelmaps(segmentation).find((layer) => layer.volumeId === volumeId || layer.geometryVolumeId === volumeId);
}



},
9484(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  t: () => (updateLabelmapSegmentationImageReferences)
});
/* import */ var _SegmentationStateManager_js__rspack_import_0 = __webpack_require__(86706);

function updateLabelmapSegmentationImageReferences(viewportId, segmentationId) {
    const segmentationStateManager = _SegmentationStateManager_js__rspack_import_0/* .defaultSegmentationStateManager */._6;
    return segmentationStateManager.updateLabelmapSegmentationImageReferences(viewportId, segmentationId);
}


},
21626(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var gl_matrix__rspack_import_0 = __webpack_require__(40230);
/* import */ var _cornerstonejs_core__rspack_import_1 = __webpack_require__(88479);
/* import */ var _distancePointToContour_js__rspack_import_2 = __webpack_require__(81440);
/* import */ var _drawingSvg_index_js__rspack_import_3 = __webpack_require__(21566);
/* import */ var _utilities_math_index_js__rspack_import_4 = __webpack_require__(44292);





class CircleSculptCursor {
    constructor() {
        this.toolInfo = {
            toolSize: null,
            radius: null,
            maxToolSize: null,
        };
    }
    renderShape(svgDrawingHelper, canvasLocation, options) {
        const circleUID = '0';
        (0,_drawingSvg_index_js__rspack_import_3.drawCircle)(svgDrawingHelper, 'SculptorTool', circleUID, canvasLocation, this.toolInfo.toolSize, options);
    }
    configureToolSize(evt) {
        const toolInfo = this.toolInfo;
        if (toolInfo.toolSize && toolInfo.maxToolSize) {
            return;
        }
        const eventData = evt.detail;
        const element = eventData.element;
        const minDim = Math.min(element.clientWidth, element.clientHeight);
        const maxRadius = minDim / 24;
        toolInfo.toolSize = maxRadius;
        toolInfo.radius = null;
        toolInfo.maxToolSize = maxRadius;
    }
    updateToolSize(canvasCoords, viewport, activeAnnotation) {
        const toolInfo = this.toolInfo;
        const radius = (0,_distancePointToContour_js__rspack_import_2/* .distancePointToContour */.X)(viewport, activeAnnotation, canvasCoords);
        if (radius > 0) {
            toolInfo.toolSize = Math.min(toolInfo.maxToolSize, radius);
            this.computeWorldRadius(viewport, true);
        }
    }
    getMaxSpacing(minSpacing) {
        return Math.max(this.toolInfo.toolSize / 4, minSpacing);
    }
    computeWorldRadius(viewport, clearExisting = false) {
        if (!this.toolInfo.radius || clearExisting) {
            const p0 = viewport.canvasToWorld([0, 0]);
            const p1 = viewport.canvasToWorld([this.toolInfo.toolSize, 0]);
            this.toolInfo.radius = gl_matrix__rspack_import_0/* .vec3.length */.eR.Bw(gl_matrix__rspack_import_0/* .vec3.sub */.eR.jb(gl_matrix__rspack_import_0/* .vec3.create */.eR.vt(), p0, p1));
        }
        return this.toolInfo.radius;
    }
    getEdge(viewport, p1, p2, mouseCanvas) {
        const midPoint = gl_matrix__rspack_import_0/* .vec3.add */.eR.WQ(gl_matrix__rspack_import_0/* .vec3.create */.eR.vt(), p1, p2 || p1);
        gl_matrix__rspack_import_0/* .vec3.scale */.eR.hs(midPoint, midPoint, 0.5);
        const canvasMidPoint = viewport.worldToCanvas(midPoint);
        const canvasDelta = gl_matrix__rspack_import_0/* .vec2.sub */.Zc.jb(gl_matrix__rspack_import_0/* .vec2.create */.Zc.vt(), canvasMidPoint, mouseCanvas);
        const angle = Math.atan2(canvasDelta[1], canvasDelta[0]);
        const point = this.interpolatePoint(viewport, angle, mouseCanvas);
        const canvasPoint = viewport.worldToCanvas(point);
        return {
            point,
            angle,
            canvasPoint,
        };
    }
    interpolatePoint(viewport, angle, center) {
        const [cx, cy] = center;
        const r = this.toolInfo.toolSize;
        const dx = Math.cos(angle) * r;
        const dy = Math.sin(angle) * r;
        const newPoint2 = [cx + dx, cy + dy];
        return viewport.canvasToWorld(newPoint2);
    }
    isInCursor(point, mousePoint) {
        return gl_matrix__rspack_import_0/* .vec3.distance */.eR.Io(point, mousePoint) < this.toolInfo.radius;
    }
}
CircleSculptCursor.shapeName = 'Circle';
/* export default */ const __rspack_default_export = (CircleSculptCursor);


},
92835(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var gl_matrix__rspack_import_0 = __webpack_require__(40230);
/* import */ var _cornerstonejs_core__rspack_import_1 = __webpack_require__(88479);
/* import */ var _utilities_getCalibratedUnits_js__rspack_import_2 = __webpack_require__(3675);
/* import */ var _base_index_js__rspack_import_3 = __webpack_require__(84962);
/* import */ var _utilities_throttle_js__rspack_import_4 = __webpack_require__(43193);
/* import */ var _stateManagement_annotation_annotationState_js__rspack_import_5 = __webpack_require__(44627);
/* import */ var _stateManagement_annotation_annotationLocking_js__rspack_import_6 = __webpack_require__(3043);
/* import */ var _stateManagement_annotation_annotationVisibility_js__rspack_import_7 = __webpack_require__(46804);
/* import */ var _stateManagement_annotation_helpers_state_js__rspack_import_8 = __webpack_require__(34350);
/* import */ var _drawingSvg_index_js__rspack_import_9 = __webpack_require__(21566);
/* import */ var _store_state_js__rspack_import_10 = __webpack_require__(17873);
/* import */ var _enums_index_js__rspack_import_11 = __webpack_require__(53870);
/* import */ var _utilities_viewportFilters_index_js__rspack_import_12 = __webpack_require__(61307);
/* import */ var _utilities_math_line_index_js__rspack_import_13 = __webpack_require__(84091);
/* import */ var _cursors_elementCursor_js__rspack_import_14 = __webpack_require__(45128);
/* import */ var _utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_15 = __webpack_require__(85321);
/* import */ var _stateManagement_annotation_config_helpers_js__rspack_import_16 = __webpack_require__(55649);
var _a;

















class BidirectionalTool extends _base_index_js__rspack_import_3/* .AnnotationTool */.EC {
    constructor(toolProps = {}, defaultToolProps = {
        supportedInteractionTypes: ['Mouse', 'Touch'],
        configuration: {
            preventHandleOutsideImage: false,
            getTextLines: defaultGetTextLines,
        },
    }) {
        super(toolProps, defaultToolProps);
        this.isPointNearTool = (element, annotation, canvasCoords, proximity) => {
            const enabledElement = (0,_cornerstonejs_core__rspack_import_1.getEnabledElement)(element);
            const { viewport } = enabledElement;
            const { data } = annotation;
            const { points } = data.handles;
            let canvasPoint1 = viewport.worldToCanvas(points[0]);
            let canvasPoint2 = viewport.worldToCanvas(points[1]);
            let line = {
                start: {
                    x: canvasPoint1[0],
                    y: canvasPoint1[1],
                },
                end: {
                    x: canvasPoint2[0],
                    y: canvasPoint2[1],
                },
            };
            let distanceToPoint = _utilities_math_line_index_js__rspack_import_13.distanceToPoint([line.start.x, line.start.y], [line.end.x, line.end.y], [canvasCoords[0], canvasCoords[1]]);
            if (distanceToPoint <= proximity) {
                return true;
            }
            canvasPoint1 = viewport.worldToCanvas(points[2]);
            canvasPoint2 = viewport.worldToCanvas(points[3]);
            line = {
                start: {
                    x: canvasPoint1[0],
                    y: canvasPoint1[1],
                },
                end: {
                    x: canvasPoint2[0],
                    y: canvasPoint2[1],
                },
            };
            distanceToPoint = _utilities_math_line_index_js__rspack_import_13.distanceToPoint([line.start.x, line.start.y], [line.end.x, line.end.y], [canvasCoords[0], canvasCoords[1]]);
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
            const enabledElement = (0,_cornerstonejs_core__rspack_import_1.getEnabledElement)(element);
            const { renderingEngine } = enabledElement;
            (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_15/* ["default"] */.A)(viewportIdsToRender);
            (0,_cursors_elementCursor_js__rspack_import_14.hideElementCursor)(element);
            evt.preventDefault();
        };
        this.handleSelectedCallback = (evt, annotation, handle) => {
            const eventDetail = evt.detail;
            const { element } = eventDetail;
            const data = annotation.data;
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
            (0,_cursors_elementCursor_js__rspack_import_14.hideElementCursor)(element);
            this.editData = {
                annotation,
                viewportIdsToRender,
                handleIndex,
                movingTextBox,
            };
            this._activateModify(element);
            const enabledElement = (0,_cornerstonejs_core__rspack_import_1.getEnabledElement)(element);
            const { renderingEngine } = enabledElement;
            (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_15/* ["default"] */.A)(viewportIdsToRender);
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
            this.doneEditMemo();
            data.handles.activeHandleIndex = null;
            this._deactivateModify(element);
            this._deactivateDraw(element);
            (0,_cursors_elementCursor_js__rspack_import_14.resetElementCursor)(element);
            const { renderingEngine } = (0,_cornerstonejs_core__rspack_import_1.getEnabledElement)(element);
            if (this.editData.handleIndex !== undefined) {
                const { points } = data.handles;
                const firstLineSegmentLength = gl_matrix__rspack_import_0/* .vec3.distance */.eR.Io(points[0], points[1]);
                const secondLineSegmentLength = gl_matrix__rspack_import_0/* .vec3.distance */.eR.Io(points[2], points[3]);
                if (secondLineSegmentLength > firstLineSegmentLength) {
                    const longAxis = [[...points[2]], [...points[3]]];
                    const shortAxisPoint0 = [...points[0]];
                    const shortAxisPoint1 = [...points[1]];
                    const longAxisVector = gl_matrix__rspack_import_0/* .vec2.create */.Zc.vt();
                    gl_matrix__rspack_import_0/* .vec2.set */.Zc.hZ(longAxisVector, longAxis[1][0] - longAxis[0][0], longAxis[1][1] - longAxis[1][0]);
                    const counterClockWisePerpendicularToLongAxis = gl_matrix__rspack_import_0/* .vec2.create */.Zc.vt();
                    gl_matrix__rspack_import_0/* .vec2.set */.Zc.hZ(counterClockWisePerpendicularToLongAxis, -longAxisVector[1], longAxisVector[0]);
                    const currentShortAxisVector = gl_matrix__rspack_import_0/* .vec2.create */.Zc.vt();
                    gl_matrix__rspack_import_0/* .vec2.set */.Zc.hZ(currentShortAxisVector, shortAxisPoint1[0] - shortAxisPoint0[0], shortAxisPoint1[1] - shortAxisPoint0[0]);
                    let shortAxis;
                    if (gl_matrix__rspack_import_0/* .vec2.dot */.Zc.Om(currentShortAxisVector, counterClockWisePerpendicularToLongAxis) > 0) {
                        shortAxis = [shortAxisPoint0, shortAxisPoint1];
                    }
                    else {
                        shortAxis = [shortAxisPoint1, shortAxisPoint0];
                    }
                    data.handles.points = [
                        longAxis[0],
                        longAxis[1],
                        shortAxis[0],
                        shortAxis[1],
                    ];
                }
            }
            if (this.isHandleOutsideImage &&
                this.configuration.preventHandleOutsideImage) {
                (0,_stateManagement_annotation_annotationState_js__rspack_import_5.removeAnnotation)(annotation.annotationUID);
            }
            (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_15/* ["default"] */.A)(viewportIdsToRender);
            if (newAnnotation) {
                (0,_stateManagement_annotation_helpers_state_js__rspack_import_8.triggerAnnotationCompleted)(annotation);
            }
            this.editData = null;
            this.isDrawing = false;
        };
        this._dragDrawCallback = (evt) => {
            this.isDrawing = true;
            const eventDetail = evt.detail;
            const { currentPoints, element } = eventDetail;
            const enabledElement = (0,_cornerstonejs_core__rspack_import_1.getEnabledElement)(element);
            const { viewport } = enabledElement;
            const { worldToCanvas } = viewport;
            const { annotation, viewportIdsToRender, handleIndex, newAnnotation } = this.editData;
            this.createMemo(element, annotation, { newAnnotation });
            const { data } = annotation;
            const worldPos = currentPoints.world;
            data.handles.points[handleIndex] = [...worldPos];
            const canvasCoordPoints = data.handles.points.map(worldToCanvas);
            const canvasCoords = {
                longLineSegment: {
                    start: {
                        x: canvasCoordPoints[0][0],
                        y: canvasCoordPoints[0][1],
                    },
                    end: {
                        x: canvasCoordPoints[1][0],
                        y: canvasCoordPoints[1][1],
                    },
                },
                shortLineSegment: {
                    start: {
                        x: canvasCoordPoints[2][0],
                        y: canvasCoordPoints[2][1],
                    },
                    end: {
                        x: canvasCoordPoints[3][0],
                        y: canvasCoordPoints[3][1],
                    },
                },
            };
            const dist = gl_matrix__rspack_import_0/* .vec2.distance */.Zc.Io(canvasCoordPoints[0], canvasCoordPoints[1]);
            const shortAxisDistFromCenter = dist / 3;
            const dx = canvasCoords.longLineSegment.start.x - canvasCoords.longLineSegment.end.x;
            const dy = canvasCoords.longLineSegment.start.y - canvasCoords.longLineSegment.end.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const vectorX = dx / length;
            const vectorY = dy / length;
            const xMid = (canvasCoords.longLineSegment.start.x +
                canvasCoords.longLineSegment.end.x) /
                2;
            const yMid = (canvasCoords.longLineSegment.start.y +
                canvasCoords.longLineSegment.end.y) /
                2;
            const startX = xMid + shortAxisDistFromCenter * vectorY;
            const startY = yMid - shortAxisDistFromCenter * vectorX;
            const endX = xMid - shortAxisDistFromCenter * vectorY;
            const endY = yMid + shortAxisDistFromCenter * vectorX;
            data.handles.points[2] = viewport.canvasToWorld([startX, startY]);
            data.handles.points[3] = viewport.canvasToWorld([endX, endY]);
            annotation.invalidated = true;
            (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_15/* ["default"] */.A)(viewportIdsToRender);
            (0,_stateManagement_annotation_helpers_state_js__rspack_import_8.triggerAnnotationModified)(annotation, element, _enums_index_js__rspack_import_11.ChangeTypes.HandlesUpdated);
            this.editData.hasMoved = true;
        };
        this._dragModifyCallback = (evt) => {
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
                const points = data.handles.points;
                points.forEach((point) => {
                    point[0] += worldPosDelta[0];
                    point[1] += worldPosDelta[1];
                    point[2] += worldPosDelta[2];
                });
                annotation.invalidated = true;
            }
            else {
                this._dragModifyHandle(evt);
                annotation.invalidated = true;
            }
            (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_15/* ["default"] */.A)(viewportIdsToRender);
            if (annotation.invalidated) {
                (0,_stateManagement_annotation_helpers_state_js__rspack_import_8.triggerAnnotationModified)(annotation, element, _enums_index_js__rspack_import_11.ChangeTypes.HandlesUpdated);
            }
        };
        this._dragModifyHandle = (evt) => {
            const eventDetail = evt.detail;
            const { currentPoints, element } = eventDetail;
            const enabledElement = (0,_cornerstonejs_core__rspack_import_1.getEnabledElement)(element);
            const { viewport } = enabledElement;
            const { annotation, handleIndex: movingHandleIndex } = this.editData;
            const { data } = annotation;
            const worldPos = currentPoints.world;
            const canvasCoordHandlesCurrent = [
                viewport.worldToCanvas(data.handles.points[0]),
                viewport.worldToCanvas(data.handles.points[1]),
                viewport.worldToCanvas(data.handles.points[2]),
                viewport.worldToCanvas(data.handles.points[3]),
            ];
            const firstLineSegment = {
                start: {
                    x: canvasCoordHandlesCurrent[0][0],
                    y: canvasCoordHandlesCurrent[0][1],
                },
                end: {
                    x: canvasCoordHandlesCurrent[1][0],
                    y: canvasCoordHandlesCurrent[1][1],
                },
            };
            const secondLineSegment = {
                start: {
                    x: canvasCoordHandlesCurrent[2][0],
                    y: canvasCoordHandlesCurrent[2][1],
                },
                end: {
                    x: canvasCoordHandlesCurrent[3][0],
                    y: canvasCoordHandlesCurrent[3][1],
                },
            };
            const proposedPoint = [...worldPos];
            const proposedCanvasCoord = viewport.worldToCanvas(proposedPoint);
            if (movingHandleIndex === 0 || movingHandleIndex === 1) {
                const fixedHandleIndex = movingHandleIndex === 0 ? 1 : 0;
                const fixedHandleCanvasCoord = canvasCoordHandlesCurrent[fixedHandleIndex];
                const fixedHandleToProposedCoordVec = gl_matrix__rspack_import_0/* .vec2.set */.Zc.hZ(gl_matrix__rspack_import_0/* .vec2.create */.Zc.vt(), proposedCanvasCoord[0] - fixedHandleCanvasCoord[0], proposedCanvasCoord[1] - fixedHandleCanvasCoord[1]);
                const fixedHandleToOldCoordVec = gl_matrix__rspack_import_0/* .vec2.set */.Zc.hZ(gl_matrix__rspack_import_0/* .vec2.create */.Zc.vt(), canvasCoordHandlesCurrent[movingHandleIndex][0] -
                    fixedHandleCanvasCoord[0], canvasCoordHandlesCurrent[movingHandleIndex][1] -
                    fixedHandleCanvasCoord[1]);
                gl_matrix__rspack_import_0/* .vec2.normalize */.Zc.S8(fixedHandleToProposedCoordVec, fixedHandleToProposedCoordVec);
                gl_matrix__rspack_import_0/* .vec2.normalize */.Zc.S8(fixedHandleToOldCoordVec, fixedHandleToOldCoordVec);
                const proposedFirstLineSegment = {
                    start: {
                        x: fixedHandleCanvasCoord[0],
                        y: fixedHandleCanvasCoord[1],
                    },
                    end: {
                        x: proposedCanvasCoord[0],
                        y: proposedCanvasCoord[1],
                    },
                };
                if (this._movingLongAxisWouldPutItThroughShortAxis(proposedFirstLineSegment, secondLineSegment)) {
                    return;
                }
                const centerOfRotation = fixedHandleCanvasCoord;
                const angle = this._getSignedAngle(fixedHandleToOldCoordVec, fixedHandleToProposedCoordVec);
                let firstPointX = canvasCoordHandlesCurrent[2][0];
                let firstPointY = canvasCoordHandlesCurrent[2][1];
                let secondPointX = canvasCoordHandlesCurrent[3][0];
                let secondPointY = canvasCoordHandlesCurrent[3][1];
                firstPointX -= centerOfRotation[0];
                firstPointY -= centerOfRotation[1];
                secondPointX -= centerOfRotation[0];
                secondPointY -= centerOfRotation[1];
                const rotatedFirstPoint = firstPointX * Math.cos(angle) - firstPointY * Math.sin(angle);
                const rotatedFirstPointY = firstPointX * Math.sin(angle) + firstPointY * Math.cos(angle);
                const rotatedSecondPoint = secondPointX * Math.cos(angle) - secondPointY * Math.sin(angle);
                const rotatedSecondPointY = secondPointX * Math.sin(angle) + secondPointY * Math.cos(angle);
                firstPointX = rotatedFirstPoint + centerOfRotation[0];
                firstPointY = rotatedFirstPointY + centerOfRotation[1];
                secondPointX = rotatedSecondPoint + centerOfRotation[0];
                secondPointY = rotatedSecondPointY + centerOfRotation[1];
                const newFirstPoint = viewport.canvasToWorld([firstPointX, firstPointY]);
                const newSecondPoint = viewport.canvasToWorld([
                    secondPointX,
                    secondPointY,
                ]);
                data.handles.points[movingHandleIndex] = proposedPoint;
                data.handles.points[2] = newFirstPoint;
                data.handles.points[3] = newSecondPoint;
            }
            else {
                const translateHandleIndex = movingHandleIndex === 2 ? 3 : 2;
                const canvasCoordsCurrent = {
                    longLineSegment: {
                        start: firstLineSegment.start,
                        end: firstLineSegment.end,
                    },
                    shortLineSegment: {
                        start: secondLineSegment.start,
                        end: secondLineSegment.end,
                    },
                };
                const longLineSegmentVec = gl_matrix__rspack_import_0/* .vec2.subtract */.Zc.Re(gl_matrix__rspack_import_0/* .vec2.create */.Zc.vt(), [
                    canvasCoordsCurrent.longLineSegment.end.x,
                    canvasCoordsCurrent.longLineSegment.end.y,
                ], [
                    canvasCoordsCurrent.longLineSegment.start.x,
                    canvasCoordsCurrent.longLineSegment.start.y,
                ]);
                const longLineSegmentVecNormalized = gl_matrix__rspack_import_0/* .vec2.normalize */.Zc.S8(gl_matrix__rspack_import_0/* .vec2.create */.Zc.vt(), longLineSegmentVec);
                const proposedToCurrentVec = gl_matrix__rspack_import_0/* .vec2.subtract */.Zc.Re(gl_matrix__rspack_import_0/* .vec2.create */.Zc.vt(), [proposedCanvasCoord[0], proposedCanvasCoord[1]], [
                    canvasCoordHandlesCurrent[movingHandleIndex][0],
                    canvasCoordHandlesCurrent[movingHandleIndex][1],
                ]);
                const movementLength = gl_matrix__rspack_import_0/* .vec2.length */.Zc.Bw(proposedToCurrentVec);
                const angle = this._getSignedAngle(longLineSegmentVecNormalized, proposedToCurrentVec);
                const movementAlongLineSegmentLength = Math.cos(angle) * movementLength;
                const newTranslatedPoint = gl_matrix__rspack_import_0/* .vec2.scaleAndAdd */.Zc.Ln(gl_matrix__rspack_import_0/* .vec2.create */.Zc.vt(), [
                    canvasCoordHandlesCurrent[translateHandleIndex][0],
                    canvasCoordHandlesCurrent[translateHandleIndex][1],
                ], longLineSegmentVecNormalized, movementAlongLineSegmentLength);
                if (this._movingLongAxisWouldPutItThroughShortAxis({
                    start: {
                        x: proposedCanvasCoord[0],
                        y: proposedCanvasCoord[1],
                    },
                    end: {
                        x: newTranslatedPoint[0],
                        y: newTranslatedPoint[1],
                    },
                }, {
                    start: {
                        x: canvasCoordsCurrent.longLineSegment.start.x,
                        y: canvasCoordsCurrent.longLineSegment.start.y,
                    },
                    end: {
                        x: canvasCoordsCurrent.longLineSegment.end.x,
                        y: canvasCoordsCurrent.longLineSegment.end.y,
                    },
                })) {
                    return;
                }
                const intersectionPoint = _utilities_math_line_index_js__rspack_import_13.intersectLine([proposedCanvasCoord[0], proposedCanvasCoord[1]], [newTranslatedPoint[0], newTranslatedPoint[1]], [firstLineSegment.start.x, firstLineSegment.start.y], [firstLineSegment.end.x, firstLineSegment.end.y]);
                if (!intersectionPoint) {
                    return;
                }
                data.handles.points[translateHandleIndex] = viewport.canvasToWorld(newTranslatedPoint);
                data.handles.points[movingHandleIndex] = proposedPoint;
            }
        };
        this.cancel = (element) => {
            if (this.isDrawing) {
                this.isDrawing = false;
                this._deactivateDraw(element);
                this._deactivateModify(element);
                (0,_cursors_elementCursor_js__rspack_import_14.resetElementCursor)(element);
                const { annotation, viewportIdsToRender, newAnnotation } = this.editData;
                const { data } = annotation;
                annotation.highlighted = false;
                data.handles.activeHandleIndex = null;
                (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_15/* ["default"] */.A)(viewportIdsToRender);
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
            element.addEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_DRAG, this._dragDrawCallback);
            element.addEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_MOVE, this._dragDrawCallback);
            element.addEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_CLICK, this._endCallback);
            element.addEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_TAP, this._endCallback);
            element.addEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_END, this._endCallback);
            element.addEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_DRAG, this._dragDrawCallback);
        };
        this._deactivateDraw = (element) => {
            _store_state_js__rspack_import_10/* .state.isInteractingWithTool */.wk.isInteractingWithTool = false;
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_UP, this._endCallback);
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_DRAG, this._dragDrawCallback);
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_MOVE, this._dragDrawCallback);
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_CLICK, this._endCallback);
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_TAP, this._endCallback);
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_END, this._endCallback);
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_DRAG, this._dragDrawCallback);
        };
        this._activateModify = (element) => {
            _store_state_js__rspack_import_10/* .state.isInteractingWithTool */.wk.isInteractingWithTool = true;
            element.addEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_UP, this._endCallback);
            element.addEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_DRAG, this._dragModifyCallback);
            element.addEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_CLICK, this._endCallback);
            element.addEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_END, this._endCallback);
            element.addEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_DRAG, this._dragModifyCallback);
            element.addEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_TAP, this._endCallback);
        };
        this._deactivateModify = (element) => {
            _store_state_js__rspack_import_10/* .state.isInteractingWithTool */.wk.isInteractingWithTool = false;
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_UP, this._endCallback);
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_DRAG, this._dragModifyCallback);
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.MOUSE_CLICK, this._endCallback);
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_END, this._endCallback);
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_DRAG, this._dragModifyCallback);
            element.removeEventListener(_enums_index_js__rspack_import_11.Events.TOUCH_TAP, this._endCallback);
        };
        this.renderAnnotation = (enabledElement, svgDrawingHelper) => {
            let renderStatus = true;
            const { viewport } = enabledElement;
            const { element } = viewport;
            let annotations = (0,_stateManagement_annotation_annotationState_js__rspack_import_5.getAnnotations)(this.getToolName(), element);
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
                const { color, lineWidth, lineDash, shadow } = this.getAnnotationStyle({
                    annotation,
                    styleSpecifier,
                });
                if (!data.cachedStats[targetId] ||
                    data.cachedStats[targetId].unit == null) {
                    data.cachedStats[targetId] = {
                        length: null,
                        width: null,
                        unit: null,
                    };
                    this._calculateCachedStats(annotation, renderingEngine, enabledElement);
                }
                else if (annotation.invalidated) {
                    this._throttledCalculateCachedStats(annotation, renderingEngine, enabledElement);
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
                    activeHandleIndex !== null) {
                    activeHandleCanvasCoords = [canvasCoordinates[activeHandleIndex]];
                }
                const showHandlesAlways = Boolean((0,_stateManagement_annotation_config_helpers_js__rspack_import_16/* .getStyleProperty */.h)('showHandlesAlways', {}));
                if (activeHandleCanvasCoords || showHandlesAlways) {
                    const handleGroupUID = '0';
                    (0,_drawingSvg_index_js__rspack_import_9.drawHandles)(svgDrawingHelper, annotationUID, handleGroupUID, showHandlesAlways ? canvasCoordinates : activeHandleCanvasCoords, {
                        color,
                    });
                }
                const dataId1 = `${annotationUID}-line-1`;
                const dataId2 = `${annotationUID}-line-2`;
                const lineUID = '0';
                (0,_drawingSvg_index_js__rspack_import_9.drawLine)(svgDrawingHelper, annotationUID, lineUID, canvasCoordinates[0], canvasCoordinates[1], {
                    color,
                    lineDash,
                    lineWidth,
                    shadow,
                }, dataId1);
                const secondLineUID = '1';
                (0,_drawingSvg_index_js__rspack_import_9.drawLine)(svgDrawingHelper, annotationUID, secondLineUID, canvasCoordinates[2], canvasCoordinates[3], {
                    color,
                    lineDash,
                    lineWidth,
                    shadow,
                }, dataId2);
                renderStatus = true;
                const textLines = this.configuration.getTextLines(data, targetId);
                if (!textLines || textLines.length === 0) {
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
        this._movingLongAxisWouldPutItThroughShortAxis = (firstLineSegment, secondLineSegment) => {
            const vectorInSecondLineDirection = gl_matrix__rspack_import_0/* .vec2.create */.Zc.vt();
            gl_matrix__rspack_import_0/* .vec2.set */.Zc.hZ(vectorInSecondLineDirection, secondLineSegment.end.x - secondLineSegment.start.x, secondLineSegment.end.y - secondLineSegment.start.y);
            gl_matrix__rspack_import_0/* .vec2.normalize */.Zc.S8(vectorInSecondLineDirection, vectorInSecondLineDirection);
            const extendedSecondLineSegment = {
                start: {
                    x: secondLineSegment.start.x - vectorInSecondLineDirection[0] * 10,
                    y: secondLineSegment.start.y - vectorInSecondLineDirection[1] * 10,
                },
                end: {
                    x: secondLineSegment.end.x + vectorInSecondLineDirection[0] * 10,
                    y: secondLineSegment.end.y + vectorInSecondLineDirection[1] * 10,
                },
            };
            const proposedIntersectionPoint = _utilities_math_line_index_js__rspack_import_13.intersectLine([extendedSecondLineSegment.start.x, extendedSecondLineSegment.start.y], [extendedSecondLineSegment.end.x, extendedSecondLineSegment.end.y], [firstLineSegment.start.x, firstLineSegment.start.y], [firstLineSegment.end.x, firstLineSegment.end.y]);
            const wouldPutThroughShortAxis = !proposedIntersectionPoint;
            return wouldPutThroughShortAxis;
        };
        this._calculateCachedStats = (annotation, renderingEngine, enabledElement) => {
            const { data } = annotation;
            const { element } = enabledElement.viewport;
            const worldPos1 = data.handles.points[0];
            const worldPos2 = data.handles.points[1];
            const worldPos3 = data.handles.points[2];
            const worldPos4 = data.handles.points[3];
            const { cachedStats } = data;
            const targetIds = Object.keys(cachedStats);
            for (let i = 0; i < targetIds.length; i++) {
                const targetId = targetIds[i];
                const image = this.getTargetImageData(targetId);
                if (!image) {
                    continue;
                }
                const { imageData, dimensions } = image;
                const handles = data.handles.points.map((point) => imageData.worldToIndex(point));
                const handles1 = handles.slice(0, 2);
                const handles2 = handles.slice(2, 4);
                const calibrate = (0,_utilities_getCalibratedUnits_js__rspack_import_2/* .getCalibratedLengthUnitsAndScale */.Op)(image, handles);
                const dist1 = _a.calculateLengthInIndex(calibrate, handles1);
                const dist2 = _a.calculateLengthInIndex(calibrate, handles2);
                const { unit } = calibrate;
                const length = dist1 > dist2 ? dist1 : dist2;
                const width = dist1 > dist2 ? dist2 : dist1;
                const widthUnit = unit;
                this.isHandleOutsideImage = !_a.isInsideVolume(dimensions, handles);
                cachedStats[targetId] = {
                    length,
                    width,
                    unit,
                    widthUnit,
                    statsArray: [
                        {
                            value: length,
                            name: 'height',
                            unit,
                            type: _enums_index_js__rspack_import_11.MeasurementType.Linear,
                        },
                        {
                            value: width,
                            name: 'width',
                            unit,
                            type: _enums_index_js__rspack_import_11.MeasurementType.Linear,
                        },
                    ],
                };
            }
            const invalidated = annotation.invalidated;
            annotation.invalidated = false;
            if (invalidated) {
                (0,_stateManagement_annotation_helpers_state_js__rspack_import_8.triggerAnnotationModified)(annotation, element, _enums_index_js__rspack_import_11.ChangeTypes.StatsUpdated);
            }
            return cachedStats;
        };
        this._getSignedAngle = (vector1, vector2) => {
            return Math.atan2(vector1[0] * vector2[1] - vector1[1] * vector2[0], vector1[0] * vector2[0] + vector1[1] * vector2[1]);
        };
        this._throttledCalculateCachedStats = (0,_utilities_throttle_js__rspack_import_4/* ["default"] */.A)(this._calculateCachedStats, 100, { trailing: true });
    }
    addNewAnnotation(evt) {
        const eventDetail = evt.detail;
        const { currentPoints, element } = eventDetail;
        const worldPos = currentPoints.world;
        this.isDrawing = true;
        const annotation = this.createAnnotation(evt, [
            [...worldPos],
            [...worldPos],
            [...worldPos],
            [...worldPos],
        ]);
        (0,_stateManagement_annotation_annotationState_js__rspack_import_5.addAnnotation)(annotation, element);
        const viewportIdsToRender = (0,_utilities_viewportFilters_index_js__rspack_import_12.getViewportIdsWithToolToRender)(element, this.getToolName());
        this.editData = {
            annotation,
            viewportIdsToRender,
            handleIndex: 1,
            movingTextBox: false,
            newAnnotation: true,
            hasMoved: false,
        };
        this._activateDraw(element);
        (0,_cursors_elementCursor_js__rspack_import_14.hideElementCursor)(element);
        evt.preventDefault();
        (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_15/* ["default"] */.A)(viewportIdsToRender);
        return annotation;
    }
}
_a = BidirectionalTool;
BidirectionalTool.toolName = 'Bidirectional';
BidirectionalTool.hydrate = (viewportId, axis, options) => {
    const enabledElement = (0,_cornerstonejs_core__rspack_import_1.getEnabledElementByViewportId)(viewportId);
    if (!enabledElement) {
        return;
    }
    const { FrameOfReferenceUID, referencedImageId, viewPlaneNormal, instance, viewport, } = _a.hydrateBase(_a, enabledElement, axis[0], options);
    const [majorAxis, minorAxis] = axis;
    const [major0, major1] = majorAxis;
    const [minor0, minor1] = minorAxis;
    const points = [major0, major1, minor0, minor1];
    const { toolInstance, ...serializableOptions } = options || {};
    const annotation = {
        annotationUID: options?.annotationUID || _cornerstonejs_core__rspack_import_1.utilities.uuidv4(),
        data: {
            handles: {
                points,
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
    (0,_stateManagement_annotation_annotationState_js__rspack_import_5.addAnnotation)(annotation, viewport.element);
    (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_15/* ["default"] */.A)([viewport.id]);
    return annotation;
};
function defaultGetTextLines(data, targetId) {
    const { cachedStats, label } = data;
    const { length, width, unit } = cachedStats[targetId];
    const textLines = [];
    if (label) {
        textLines.push(label);
    }
    if (length === undefined) {
        return textLines;
    }
    textLines.push(`L: ${_cornerstonejs_core__rspack_import_1.utilities.roundNumber(length)} ${unit || unit}`, `W: ${_cornerstonejs_core__rspack_import_1.utilities.roundNumber(width)} ${unit}`);
    return textLines;
}
/* export default */ const __rspack_default_export = (BidirectionalTool);


},
58690(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  kC: () => (BLOCKED_CURSOR),
  t5: () => (PENDING_CURSOR),
  ys: () => (PLUS_CURSOR)
});
const CIRCLE_CURSOR = "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%3E%3Ccircle%20cx='12'%20cy='12'%20r='9'%20fill='none'%20stroke='%2300dc82'%20stroke-width='2'/%3E%3C/svg%3E\") 12 12, crosshair";
const PLUS_CURSOR = "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%3E%3Ccircle%20cx='12'%20cy='12'%20r='9'%20fill='none'%20stroke='%2300dc82'%20stroke-width='2'/%3E%3Cpath%20d='M12%208v8M8%2012h8'%20stroke='%2300dc82'%20stroke-width='2'%20stroke-linecap='round'/%3E%3C/svg%3E\") 12 12, copy";
const BLOCKED_CURSOR = "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%3E%3Ccircle%20cx='12'%20cy='12'%20r='9'%20fill='none'%20stroke='%23ff5a5a'%20stroke-width='2'/%3E%3Cpath%20d='M5.7%205.7L18.3%2018.3'%20stroke='%23ff5a5a'%20stroke-width='2'%20stroke-linecap='round'/%3E%3C/svg%3E\") 12 12, not-allowed";
const PENDING_CURSOR = "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%3E%3Ccircle%20cx='12'%20cy='12'%20r='9'%20fill='none'%20stroke='%23a0a6ad'%20stroke-width='2'%20stroke-dasharray='4%203'/%3E%3C/svg%3E\") 12 12, progress";


},
47844(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _base_index_js__rspack_import_1 = __webpack_require__(84962);
/* import */ var _utilities_getViewportICamera_js__rspack_import_2 = __webpack_require__(41891);
/* import */ var _enums_index_js__rspack_import_3 = __webpack_require__(53870);
/* import */ var _stateManagement_segmentation_index_js__rspack_import_4 = __webpack_require__(48735);
/* import */ var _stateManagement_segmentation_triggerSegmentationEvents_js__rspack_import_5 = __webpack_require__(49256);
/* import */ var _utilities_segmentation_growCut_constants_js__rspack_import_6 = __webpack_require__(29735);
/* import */ var _utilities_segmentation_getSVGStyleForSegment_js__rspack_import_7 = __webpack_require__(91707);
/* import */ var _utilities_segmentation_islandRemoval_js__rspack_import_8 = __webpack_require__(29827);
/* import */ var _utilities_segmentation_index_js__rspack_import_9 = __webpack_require__(47984);
/* import */ var _stateManagement_segmentation_getCurrentLabelmapImageIdForViewport_js__rspack_import_10 = __webpack_require__(9200);











const { transformWorldToIndex, transformIndexToWorld } = _cornerstonejs_core__rspack_import_0.utilities;
class GrowCutBaseTool extends _base_index_js__rspack_import_1/* .BaseTool */.oS {
    constructor(toolProps, defaultToolProps) {
        const baseToolProps = _cornerstonejs_core__rspack_import_0.utilities.deepMerge({
            configuration: {
                positiveStdDevMultiplier: (/* inlined export .DEFAULT_POSITIVE_STD_DEV_MULTIPLIER */1.8),
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
        const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
        const { viewport, renderingEngine } = enabledElement;
        const { viewUp } = (0,_utilities_getViewportICamera_js__rspack_import_2/* ["default"] */.A)(viewport);
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
        const labelmap = _cornerstonejs_core__rspack_import_0.cache.getVolume(labelmapVolumeId);
        let shrinkExpandAccumulator = 0;
        const growCutCommand = async ({ shrinkExpandAmount = 0 } = {}) => {
            if (shrinkExpandAmount !== 0) {
                this.seeds = null;
            }
            shrinkExpandAccumulator += shrinkExpandAmount;
            const newPositiveStdDevMultiplier = Math.max(0.1, config.positiveStdDevMultiplier + shrinkExpandAccumulator);
            const negativeSeedMargin = shrinkExpandAmount < 0
                ? Math.max(1, (/* inlined export .DEFAULT_NEGATIVE_SEED_MARGIN */30) -
                    Math.abs(shrinkExpandAccumulator) * 3)
                : (/* inlined export .DEFAULT_NEGATIVE_SEED_MARGIN */30) + shrinkExpandAccumulator * 3;
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
        (0,_stateManagement_segmentation_triggerSegmentationEvents_js__rspack_import_5.triggerSegmentationDataModified)(segmentationId);
    }
    applyGrowCutLabelmap(segmentationId, segmentIndex, targetLabelmap, sourceLabelmap) {
        const tgtVoxelManager = targetLabelmap.voxelManager;
        const srcVoxelManager = sourceLabelmap.voxelManager;
        srcVoxelManager.forEach(({ value, index }) => {
            if (value === segmentIndex) {
                tgtVoxelManager.setAtIndex(index, value);
            }
        });
        (0,_stateManagement_segmentation_triggerSegmentationEvents_js__rspack_import_5.triggerSegmentationDataModified)(segmentationId);
    }
    _runLastCommand({ shrinkExpandAmount = 0 } = {}) {
        const cmd = GrowCutBaseTool.lastGrowCutCommand;
        if (cmd) {
            cmd({ shrinkExpandAmount });
        }
    }
    async getLabelmapSegmentationData(viewport) {
        const activeSeg = _stateManagement_segmentation_index_js__rspack_import_4.activeSegmentation.getActiveSegmentation(viewport.id);
        if (!activeSeg) {
            throw new Error('No active segmentation found');
        }
        const { segmentationId } = activeSeg;
        const segmentIndex = _stateManagement_segmentation_index_js__rspack_import_4.segmentIndex.getActiveSegmentIndex(segmentationId);
        const { representationData } = _stateManagement_segmentation_index_js__rspack_import_4.state.getSegmentation(segmentationId);
        const labelmapData = representationData[_enums_index_js__rspack_import_3.SegmentationRepresentations.Labelmap];
        let { volumeId: labelmapVolumeId, referencedVolumeId } = labelmapData;
        if (!labelmapVolumeId) {
            const referencedImageIds = viewport.getImageIds();
            if (!_cornerstonejs_core__rspack_import_0.utilities.isValidVolume(referencedImageIds)) {
                const currentImageId = viewport.getCurrentImageId();
                const currentImage = _cornerstonejs_core__rspack_import_0.cache.getImage(currentImageId);
                const fakeImage = _cornerstonejs_core__rspack_import_0.imageLoader.createAndCacheDerivedImage(currentImageId);
                const fakeVolume = this._createFakeVolume([
                    currentImage.imageId,
                    fakeImage.imageId,
                ]);
                referencedVolumeId = fakeVolume.volumeId;
                const currentLabelmapImageId = (0,_stateManagement_segmentation_getCurrentLabelmapImageIdForViewport_js__rspack_import_10/* .getCurrentLabelmapImageIdForViewport */.vl)(viewport.id, segmentationId);
                const fakeDerivedImage = _cornerstonejs_core__rspack_import_0.imageLoader.createAndCacheDerivedImage(currentLabelmapImageId);
                const fakeLabelmapVolume = this._createFakeVolume([
                    currentLabelmapImageId,
                    fakeDerivedImage.imageId,
                ]);
                labelmapVolumeId = fakeLabelmapVolume.volumeId;
            }
            else {
                const segVolume = (0,_utilities_segmentation_index_js__rspack_import_9.getOrCreateSegmentationVolume)(segmentationId);
                labelmapVolumeId = segVolume.volumeId;
            }
        }
        if (!referencedVolumeId) {
            const { imageIds: segImageIds } = labelmapData;
            const referencedImageIds = segImageIds.map((imageId) => _cornerstonejs_core__rspack_import_0.cache.getImage(imageId).referencedImageId);
            const volumeId = _cornerstonejs_core__rspack_import_0.cache.generateVolumeId(referencedImageIds);
            const imageVolume = _cornerstonejs_core__rspack_import_0.cache.getVolume(volumeId);
            referencedVolumeId = imageVolume
                ? imageVolume.volumeId
                : (await _cornerstonejs_core__rspack_import_0.volumeLoader.createAndCacheVolumeFromImagesSync(volumeId, referencedImageIds)).volumeId;
        }
        return {
            segmentationId,
            segmentIndex,
            labelmapVolumeId,
            referencedVolumeId,
        };
    }
    _createFakeVolume(imageIds) {
        const volumeId = _cornerstonejs_core__rspack_import_0.cache.generateVolumeId(imageIds);
        const cachedVolume = _cornerstonejs_core__rspack_import_0.cache.getVolume(volumeId);
        if (cachedVolume) {
            return cachedVolume;
        }
        const volumeProps = _cornerstonejs_core__rspack_import_0.utilities.generateVolumePropsFromImageIds(imageIds, volumeId);
        const spacing = volumeProps.spacing;
        if (spacing[2] === 0) {
            spacing[2] = 1;
        }
        const derivedVolume = new _cornerstonejs_core__rspack_import_0.ImageVolume({
            volumeId,
            dataType: volumeProps.dataType,
            metadata: _cornerstonejs_core__rspack_import_0.utilities.deepClone(volumeProps.metadata),
            dimensions: volumeProps.dimensions,
            spacing: volumeProps.spacing,
            origin: volumeProps.origin,
            direction: volumeProps.direction,
            referencedVolumeId: volumeProps.referencedVolumeId,
            imageIds: volumeProps.imageIds,
            referencedImageIds: volumeProps.referencedImageIds,
        });
        _cornerstonejs_core__rspack_import_0.cache.putVolumeSync(volumeId, derivedVolume);
        return derivedVolume;
    }
    _isOrthogonalView(viewport, referencedVolumeId) {
        const volume = _cornerstonejs_core__rspack_import_0.cache.getVolume(referencedVolumeId);
        const volumeImageData = volume.imageData;
        const camera = (0,_utilities_getViewportICamera_js__rspack_import_2/* ["default"] */.A)(viewport);
        const { ijkVecColDir, ijkVecSliceDir } = _cornerstonejs_core__rspack_import_0.utilities.getVolumeDirectionVectors(volumeImageData, camera);
        return [ijkVecColDir, ijkVecSliceDir].every((vec) => _cornerstonejs_core__rspack_import_0.utilities.isEqual(Math.abs(vec[0]), 1) ||
            _cornerstonejs_core__rspack_import_0.utilities.isEqual(Math.abs(vec[1]), 1) ||
            _cornerstonejs_core__rspack_import_0.utilities.isEqual(Math.abs(vec[2]), 1));
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
        const labelmap = _cornerstonejs_core__rspack_import_0.cache.getVolume(labelmapVolumeId);
        const removeIslandData = this.getRemoveIslandData(growCutData);
        if (!removeIslandData) {
            return;
        }
        const [width, height] = labelmap.dimensions;
        const numPixelsPerSlice = width * height;
        const { worldIslandPoints = [], islandPointIndexes = [] } = removeIslandData;
        let ijkIslandPoints = [...(removeIslandData?.ijkIslandPoints ?? [])];
        const renderingEngine = (0,_cornerstonejs_core__rspack_import_0.getRenderingEngine)(renderingEngineId);
        const viewport = renderingEngine.getViewport(viewportId);
        const { voxelManager } = labelmap;
        const islandRemoval = new _utilities_segmentation_islandRemoval_js__rspack_import_8/* ["default"] */.A();
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
        return (0,_utilities_segmentation_getSVGStyleForSegment_js__rspack_import_7/* .getSVGStyleForSegment */.u)({
            segmentationId,
            segmentIndex,
            viewportId,
        });
    }
}
GrowCutBaseTool.lastGrowCutCommand = null;
GrowCutBaseTool.toolName = 'GrowCutBaseTool';
/* export default */ const __rspack_default_export = (GrowCutBaseTool);


},
1616(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ contourDisplay)
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(88479);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/SegmentationRepresentations.js
var SegmentationRepresentations = __webpack_require__(63555);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/annotationState.js
var annotationState = __webpack_require__(44627);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/annotationHydration.js
var annotationHydration = __webpack_require__(28664);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contourSegmentation/index.js
var contourSegmentation = __webpack_require__(67846);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/getViewportICamera.js
var getViewportICamera = __webpack_require__(41891);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/CellArray.js
var CellArray = __webpack_require__(32461);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/Points.js
var Points = __webpack_require__(74973);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/PolyData.js + 7 modules
var PolyData = __webpack_require__(91542);
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

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js + 3 modules
var enums = __webpack_require__(53870);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/SegmentationStyle.js
var SegmentationStyle = __webpack_require__(51933);
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
        const segmentSpecificConfig = SegmentationStyle/* .segmentationStyle.getStyle */.Y.getStyle({
            viewportId: viewport.id,
            segmentationId,
            type: enums.SegmentationRepresentations.Contour,
            segmentIndex,
        });
        const contourSet = geometry.data;
        const viewPlaneNormal = (0,getViewportICamera/* ["default"] */.A)(viewport).viewPlaneNormal;
        contourSet.contours.forEach((contour) => {
            const { points, color, id } = contour;
            const referencedImageId = (0,annotationHydration/* .getClosestImageIdForStackViewport */.x)(viewport, points[0], viewPlaneNormal);
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
                    viewPlaneNormal,
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
    viewport.render();
}


// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getSegmentation.js
var segmentation_getSegmentation = __webpack_require__(99212);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/index.js
var stateManagement = __webpack_require__(60567);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Contour/removeContourFromElement.js


function removeContourFromElement(viewportId, segmentationId, removeFromCache = false) {
    const segmentation = getSegmentation(segmentationId);
    const { annotationUIDsMap } = segmentation.representationData.Contour;
    annotationUIDsMap.forEach((annotationSet) => {
        annotationSet.forEach((annotationUID) => {
            removeAnnotation(annotationUID);
        });
    });
}
/* export default */ const Contour_removeContourFromElement = ((/* unused pure expression or super */ null && (removeContourFromElement)));

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/config.js
var config = __webpack_require__(2782);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/computeAndAddRepresentation.js
var computeAndAddRepresentation = __webpack_require__(952);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getUniqueSegmentIndices.js
var getUniqueSegmentIndices = __webpack_require__(16789);
// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/index.js
var gl_matrix_esm = __webpack_require__(40230);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Contour/contourDisplay.js











const polySegConversionInProgressForViewportId = new Map();
const processedViewportSegmentations = new Map();
function removeRepresentation(viewportId, segmentationId, renderImmediate = false) {
    const enabledElement = (0,esm.getEnabledElementByViewportId)(viewportId);
    if (!enabledElement) {
        return;
    }
    const { viewport } = enabledElement;
    if (!renderImmediate) {
        return;
    }
    viewport.render();
}
async function render(viewport, contourRepresentation) {
    const { segmentationId } = contourRepresentation;
    const segmentation = (0,segmentation_getSegmentation/* .getSegmentation */.T)(segmentationId);
    if (!segmentation) {
        return;
    }
    let contourData = segmentation.representationData[SegmentationRepresentations/* ["default"].Contour */.A.Contour];
    const polySeg = (0,config/* .getPolySeg */.Qy)();
    if (!contourData &&
        (0,config/* .getPolySeg */.Qy)()?.canComputeRequestedRepresentation(segmentationId, SegmentationRepresentations/* ["default"].Contour */.A.Contour) &&
        !polySegConversionInProgressForViewportId.get(viewport.id)) {
        polySegConversionInProgressForViewportId.set(viewport.id, true);
        try {
            contourData = await (0,computeAndAddRepresentation/* .computeAndAddRepresentation */.d)(segmentationId, SegmentationRepresentations/* ["default"].Contour */.A.Contour, () => polySeg.computeContourData(segmentationId, { viewport }));
        }
        catch (error) {
            console.warn('Unable to compute contour data for segmentationId', segmentationId, error);
        }
        polySegConversionInProgressForViewportId.set(viewport.id, false);
    }
    else if (!contourData && !(0,config/* .getPolySeg */.Qy)()) {
        console.debug(`No contour data found for segmentationId ${segmentationId} and PolySeg add-on is not configured. Unable to convert from other representations to contour. Please register PolySeg using cornerstoneTools.init({ addons: { polySeg } }) to enable automatic conversion.`);
    }
    if (!contourData) {
        return;
    }
    if (!contourData.geometryIds?.length) {
        return;
    }
    let hasContourDataButNotMatchingViewport = false;
    const viewportNormal = (0,getViewportICamera/* ["default"] */.A)(viewport).viewPlaneNormal;
    if (contourData.annotationUIDsMap) {
        hasContourDataButNotMatchingViewport = !_checkContourNormalsMatchViewport(contourData.annotationUIDsMap, viewportNormal);
    }
    if (contourData.geometryIds.length > 0) {
        hasContourDataButNotMatchingViewport = !_checkContourGeometryMatchViewport(contourData.geometryIds, viewportNormal);
    }
    const viewportProcessed = processedViewportSegmentations.get(viewport.id) || new Set();
    if (hasContourDataButNotMatchingViewport &&
        !polySegConversionInProgressForViewportId.get(viewport.id) &&
        !viewportProcessed.has(segmentationId) &&
        viewport.viewportStatus === esm.Enums.ViewportStatus.RENDERED) {
        polySegConversionInProgressForViewportId.set(viewport.id, true);
        const segmentIndices = (0,getUniqueSegmentIndices/* .getUniqueSegmentIndices */.O)(segmentationId);
        const surfacesInfo = await polySeg.computeSurfaceData(segmentationId, {
            segmentIndices,
            viewport,
        });
        const geometryIds = surfacesInfo.geometryIds;
        const pointsAndPolys = [];
        for (const geometryId of geometryIds.values()) {
            const geometry = esm.cache.getGeometry(geometryId);
            const data = geometry.data;
            pointsAndPolys.push({
                points: data.points,
                polys: data.polys,
                segmentIndex: data.segmentIndex,
                id: data.segmentIndex,
            });
        }
        const polyDataCache = await polySeg.clipAndCacheSurfacesForViewport(pointsAndPolys, viewport);
        const rawResults = polySeg.extractContourData(polyDataCache);
        const annotationUIDsMap = polySeg.createAndAddContourSegmentationsFromClippedSurfaces(rawResults, viewport, segmentationId);
        contourData.annotationUIDsMap = new Map([
            ...contourData.annotationUIDsMap,
            ...annotationUIDsMap,
        ]);
        viewportProcessed.add(segmentationId);
        processedViewportSegmentations.set(viewport.id, viewportProcessed);
        polySegConversionInProgressForViewportId.set(viewport.id, false);
    }
    handleContourSegmentation(viewport, contourData.geometryIds, contourData.annotationUIDsMap, contourRepresentation);
}
function _checkContourGeometryMatchViewport(geometryIds, viewportNormal) {
    let validGeometry = null;
    let geometryData = null;
    for (const geometryId of geometryIds) {
        const geometry = esm.cache.getGeometry(geometryId);
        if (!geometry) {
            continue;
        }
        const data = geometry.data;
        if (data.contours?.[0]?.points?.length >= 3) {
            validGeometry = geometry;
            geometryData = data;
            break;
        }
    }
    if (!validGeometry || !geometryData) {
        return false;
    }
    const contours = geometryData.contours;
    const { points } = contours[0];
    const [point] = points;
    const delta = gl_matrix_esm/* .vec3.create */.eR.vt();
    const { length } = points;
    const increment = Math.ceil(length / 25);
    for (let i = 1; i < length; i += increment) {
        const point2 = points[i];
        gl_matrix_esm/* .vec3.sub */.eR.jb(delta, point, point2);
        gl_matrix_esm/* .vec3.normalize */.eR.S8(delta, delta);
        if (gl_matrix_esm/* .vec3.dot */.eR.Om(viewportNormal, delta) > 0.1) {
            return false;
        }
    }
    return true;
}
function _checkContourNormalsMatchViewport(annotationUIDsMap, viewportNormal) {
    const annotationUIDs = Array.from(annotationUIDsMap.values())
        .flat()
        .map((uidSet) => Array.from(uidSet))
        .flat();
    const randomAnnotationUIDs = esm.utilities.getRandomSampleFromArray(annotationUIDs, 3);
    for (const annotationUID of randomAnnotationUIDs) {
        const annotation = (0,annotationState.getAnnotation)(annotationUID);
        if (annotation?.metadata) {
            if (!annotation.metadata.viewPlaneNormal) {
                continue;
            }
            const annotationNormal = annotation.metadata.viewPlaneNormal;
            const dotProduct = Math.abs(viewportNormal[0] * annotationNormal[0] +
                viewportNormal[1] * annotationNormal[1] +
                viewportNormal[2] * annotationNormal[2]);
            if (Math.abs(dotProduct - 1) > 0.01) {
                return false;
            }
        }
    }
    return true;
}
function getUpdateFunction(viewport) {
    return null;
}
/* export default */ const contourDisplay = ({
    getUpdateFunction,
    render,
    removeRepresentation,
});


},
59825(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (/* binding */ labelmapDisplay)
});

// UNUSED EXPORTS: MAX_NUMBER_COLORS, removeRepresentation, render

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(88479);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getSegmentation.js
var getSegmentation = __webpack_require__(99212);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/SegmentationRepresentations.js
var SegmentationRepresentations = __webpack_require__(63555);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/getSegmentationActor.js
var getSegmentationActor = __webpack_require__(47153);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/config.js
var esm_config = __webpack_require__(2782);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/computeAndAddRepresentation.js
var computeAndAddRepresentation = __webpack_require__(952);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/triggerSegmentationEvents.js + 4 modules
var triggerSegmentationEvents = __webpack_require__(49256);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/SegmentationStateManager.js
var SegmentationStateManager = __webpack_require__(86706);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Labelmap/removeLabelmapRepresentationData.js
var removeLabelmapRepresentationData = __webpack_require__(8270);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/ImageMapper.js + 1 modules
var ImageMapper = __webpack_require__(46534);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/ImageSlice.js + 1 modules
var ImageSlice = __webpack_require__(69048);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/labelmapImageMapperSupport.js
var labelmapImageMapperSupport = __webpack_require__(53585);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/labelmapSegmentationState.js
var labelmapSegmentationState = __webpack_require__(89615);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Labelmap/labelmapRepresentationUID.js
var labelmapRepresentationUID = __webpack_require__(5406);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/DataArray.js
var DataArray = __webpack_require__(445);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/ImageData.js
var ImageData = __webpack_require__(26393);
// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/index.js
var gl_matrix_esm = __webpack_require__(40230);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Labelmap/volumeLabelmapSliceData.js






const PLANAR_OVERLAY_DEPTH_EPSILON = 1e-4;
function applyPlanarOverlayDepthOffset(actor, viewPlaneNormal, overlayOrder) {
    if (overlayOrder <= 0) {
        actor.setPosition(0, 0, 0);
        return;
    }
    const [x, y, z] = gl_matrix_esm/* .vec3.normalize */.eR.S8(gl_matrix_esm/* .vec3.create */.eR.vt(), viewPlaneNormal);
    const offset = overlayOrder * PLANAR_OVERLAY_DEPTH_EPSILON;
    actor.setPosition(x * offset, y * offset, z * offset);
}
function matchAxis(vector, axes) {
    let bestAxis = -1;
    let bestDot = 0;
    axes.forEach((axisVector, axis) => {
        const dot = gl_matrix_esm/* .vec3.dot */.eR.Om(vector, axisVector);
        if (Math.abs(dot) > Math.abs(bestDot)) {
            bestAxis = axis;
            bestDot = dot;
        }
    });
    if (bestAxis === -1 || Math.abs(bestDot) < labelmapImageMapperSupport/* .DIRECTION_ALIGNMENT_TOLERANCE */.KM) {
        return;
    }
    return {
        axis: bestAxis,
        sign: bestDot >= 0 ? 1 : -1,
    };
}
function getSliceRenderingCamera(viewport) {
    const resolvedCamera = viewport.getResolvedView?.()?.toICamera?.();
    const normalizedResolvedCamera = normalizeSliceRenderingCamera(resolvedCamera);
    if (normalizedResolvedCamera) {
        return normalizedResolvedCamera;
    }
    const legacyCamera = viewport.getCamera?.();
    const normalizedLegacyCamera = normalizeSliceRenderingCamera(legacyCamera);
    return normalizedLegacyCamera;
}
function normalizeSliceRenderingCamera(camera) {
    const candidate = camera;
    const focalPoint = toPoint3(candidate?.focalPoint);
    const viewPlaneNormal = toPoint3(candidate?.viewPlaneNormal);
    const viewUp = toPoint3(candidate?.viewUp);
    if (!focalPoint || !viewPlaneNormal || !viewUp) {
        return;
    }
    return {
        focalPoint,
        viewPlaneNormal,
        viewUp,
    };
}
function toPoint3(value) {
    const candidate = value;
    if (!candidate || typeof candidate.length !== 'number') {
        return;
    }
    if (candidate.length < 3) {
        return;
    }
    const point = [
        Number(candidate[0]),
        Number(candidate[1]),
        Number(candidate[2]),
    ];
    return point.every(Number.isFinite) ? point : undefined;
}
function getVolumeAxes(volume) {
    const { direction } = volume;
    return [
        [direction[0], direction[1], direction[2]],
        [direction[3], direction[4], direction[5]],
        [direction[6], direction[7], direction[8]],
    ];
}
function getSliceState(viewport, volume) {
    const camera = getSliceRenderingCamera(viewport);
    if (!camera) {
        return;
    }
    const { viewPlaneNormal, viewUp, focalPoint } = camera;
    const xDirection = gl_matrix_esm/* .vec3.normalize */.eR.S8(gl_matrix_esm/* .vec3.create */.eR.vt(), gl_matrix_esm/* .vec3.cross */.eR.$A(gl_matrix_esm/* .vec3.create */.eR.vt(), viewPlaneNormal, viewUp));
    const yDirection = gl_matrix_esm/* .vec3.normalize */.eR.S8(gl_matrix_esm/* .vec3.create */.eR.vt(), viewUp);
    const axes = getVolumeAxes(volume);
    const xAxis = matchAxis(xDirection, axes);
    const yAxis = matchAxis(yDirection, axes);
    const sliceAxis = matchAxis(viewPlaneNormal, axes);
    if (!xAxis || !yAxis || !sliceAxis) {
        return;
    }
    const distinctAxes = new Set([xAxis.axis, yAxis.axis, sliceAxis.axis]);
    if (distinctAxes.size !== 3) {
        return;
    }
    const continuousIndex = esm.utilities.transformWorldToIndexContinuous(volume.imageData, focalPoint);
    const sliceIndex = Math.floor(continuousIndex[sliceAxis.axis] + 0.5 - 1e-6);
    if (sliceIndex < 0 || sliceIndex >= volume.dimensions[sliceAxis.axis]) {
        return;
    }
    return {
        key: [
            sliceAxis.axis,
            sliceIndex,
            xAxis.axis,
            xAxis.sign,
            yAxis.axis,
            yAxis.sign,
        ].join(':'),
        xAxis: xAxis.axis,
        xSign: xAxis.sign,
        yAxis: yAxis.axis,
        ySign: yAxis.sign,
        sliceAxis: sliceAxis.axis,
        sliceIndex,
    };
}
function createSliceImageData(volume, viewport) {
    const state = getSliceState(viewport, volume);
    if (!state) {
        return;
    }
    const axisVectors = getVolumeAxes(volume);
    const { dimensions, spacing, voxelManager } = volume;
    const width = dimensions[state.xAxis];
    const height = dimensions[state.yAxis];
    const SliceDataConstructor = voxelManager.getConstructor();
    const pixelData = new SliceDataConstructor(width * height);
    const ijk = [0, 0, 0];
    ijk[state.sliceAxis] = state.sliceIndex;
    const xStart = state.xSign > 0 ? 0 : width - 1;
    const xStep = state.xSign > 0 ? 1 : -1;
    const yStart = state.ySign > 0 ? 0 : height - 1;
    const yStep = state.ySign > 0 ? 1 : -1;
    for (let y = 0, srcY = yStart; y < height; y++, srcY += yStep) {
        ijk[state.yAxis] = srcY;
        const rowOffset = y * width;
        for (let x = 0, srcX = xStart; x < width; x++, srcX += xStep) {
            ijk[state.xAxis] = srcX;
            pixelData[rowOffset + x] = Number(voxelManager.getAtIJK(ijk[0], ijk[1], ijk[2]));
        }
    }
    const originIndex = [0, 0, 0];
    originIndex[state.sliceAxis] = state.sliceIndex;
    originIndex[state.xAxis] = state.xSign > 0 ? 0 : width - 1;
    originIndex[state.yAxis] = state.ySign > 0 ? 0 : height - 1;
    const xDirection = axisVectors[state.xAxis].map((value) => value * state.xSign);
    const yDirection = axisVectors[state.yAxis].map((value) => value * state.ySign);
    const camera = getSliceRenderingCamera(viewport);
    if (!camera) {
        return;
    }
    const zDirection = gl_matrix_esm/* .vec3.normalize */.eR.S8(gl_matrix_esm/* .vec3.create */.eR.vt(), camera.viewPlaneNormal);
    const dataType = DataArray/* ["default"].getDataType */.Ay.getDataType(pixelData);
    const scalarArray = DataArray/* ["default"].newInstance */.Ay.newInstance({
        dataType,
        name: 'Pixels',
        numberOfComponents: 1,
        values: pixelData,
    });
    const imageData = ImageData/* ["default"].newInstance */.Ay.newInstance();
    imageData.set({ dataType, numberOfComponents: 1 }, true);
    imageData.setDimensions(width, height, 1);
    imageData.setSpacing([spacing[state.xAxis], spacing[state.yAxis], 1]);
    imageData.setDirection(new Float32Array([
        ...xDirection,
        ...yDirection,
        zDirection[0],
        zDirection[1],
        zDirection[2],
    ]));
    imageData.setOrigin(esm.utilities.transformIndexToWorld(volume.imageData, originIndex));
    imageData.getPointData().setScalars(scalarArray);
    imageData.modified();
    return {
        imageData,
        state,
    };
}


;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Labelmap/volumeLabelmapImageMapper.js







const OVERLAY_RENDERER_SUFFIX = 'labelmap-image-mapper-overlay';
function isPlanarSliceRenderingViewport(viewport) {
    const compatibilityViewport = viewport;
    return (compatibilityViewport.type === esm.Enums.ViewportType.PLANAR_NEXT &&
        typeof compatibilityViewport.addImages === 'function' &&
        typeof compatibilityViewport.getCurrentImageId === 'function' &&
        typeof compatibilityViewport.render === 'function');
}
function createActorEntry(args) {
    const mapper = ImageMapper/* ["default"].newInstance */.Ay.newInstance();
    mapper.setInputData(args.imageData);
    const actor = ImageSlice/* ["default"].newInstance */.Ay.newInstance();
    actor.setMapper(mapper);
    return {
        uid: args.representationUID,
        actor,
        actorMapper: {
            actor,
            mapper,
            renderMode: esm.ActorRenderMode.VTK_IMAGE,
        },
        referencedId: args.referencedId,
        representationUID: args.representationUID,
    };
}
function getOverlayRendererId(viewportId) {
    return `${viewportId}::${OVERLAY_RENDERER_SUFFIX}`;
}
function getOrCreateOverlayRenderer(viewport) {
    const renderingEngine = viewport.getRenderingEngine();
    const offscreenMultiRenderWindow = renderingEngine.getOffscreenMultiRenderWindow(viewport.id);
    const overlayRendererId = getOverlayRendererId(viewport.id);
    const baseRenderer = viewport.getRenderer();
    const baseViewport = baseRenderer.getViewport();
    let overlayRenderer = offscreenMultiRenderWindow.getRenderer(overlayRendererId);
    if (!overlayRenderer) {
        const renderWindow = offscreenMultiRenderWindow.getRenderWindow();
        if (renderWindow.getNumberOfLayers() < 2) {
            renderWindow.setNumberOfLayers(2);
        }
        offscreenMultiRenderWindow.addRenderer({
            viewport: baseViewport,
            id: overlayRendererId,
            background: [0, 0, 0],
        });
        overlayRenderer = offscreenMultiRenderWindow.getRenderer(overlayRendererId);
        overlayRenderer.setLayer(1);
        overlayRenderer.setPreserveDepthBuffer(false);
    }
    overlayRenderer.setActiveCamera(baseRenderer.getActiveCamera());
    overlayRenderer.setViewport(baseViewport[0], baseViewport[1], baseViewport[2], baseViewport[3]);
    return overlayRenderer;
}
function moveActorToOverlayRenderer(viewport, actorEntry) {
    const baseRenderer = viewport.getRenderer();
    const overlayRenderer = getOrCreateOverlayRenderer(viewport);
    baseRenderer.removeActor(actorEntry.actor);
    overlayRenderer.addActor(actorEntry.actor);
}
function getVolumeLabelmapImageMapperRepresentationUIDs(viewport, segmentationId, segmentation) {
    if (!(0,labelmapImageMapperSupport/* .canRenderVolumeViewportLabelmapAsImage */.QO)(viewport)) {
        return [];
    }
    const useStablePlanarUID = isPlanarSliceRenderingViewport(viewport);
    return (0,labelmapSegmentationState/* .getLabelmaps */.m)(segmentation)
        .map((layer) => {
        const volume = (0,labelmapSegmentationState/* .getOrCreateLabelmapVolume */.kL)(layer);
        if (!volume) {
            return;
        }
        const state = getSliceState(viewport, volume);
        if (!state) {
            return;
        }
        return (0,labelmapRepresentationUID/* .createLabelmapRepresentationUID */.Ox)({
            segmentationId,
            referencedId: layer.labelmapId,
            ...(useStablePlanarUID ? {} : { sliceStateKey: state.key }),
        });
    })
        .filter((value) => !!value);
}
async function addVolumeLabelmapImageMapperActors(args) {
    const { viewport, segmentation, segmentationId } = args;
    if (!(0,labelmapImageMapperSupport/* .canRenderVolumeViewportLabelmapAsImage */.QO)(viewport)) {
        return;
    }
    if (isPlanarSliceRenderingViewport(viewport)) {
        await addPlanarLabelmapImageMapperActors({
            viewport,
            segmentation,
            segmentationId,
        });
        return;
    }
    (0,labelmapSegmentationState/* .getLabelmaps */.m)(segmentation).forEach((layer) => {
        const volume = (0,labelmapSegmentationState/* .getOrCreateLabelmapVolume */.kL)(layer);
        if (!volume) {
            return;
        }
        const sliceData = createSliceImageData(volume, viewport);
        if (!sliceData) {
            return;
        }
        const representationUID = (0,labelmapRepresentationUID/* .createLabelmapRepresentationUID */.Ox)({
            segmentationId,
            referencedId: layer.labelmapId,
            sliceStateKey: sliceData.state.key,
        });
        const actorEntry = createActorEntry({
            imageData: sliceData.imageData,
            referencedId: layer.labelmapId,
            representationUID,
        });
        viewport.addActor(actorEntry);
        moveActorToOverlayRenderer(viewport, actorEntry);
    });
}
function updateVolumeLabelmapImageMapperActors(args) {
    const { viewport, segmentation, segmentationId, actorEntries } = args;
    if (!(0,labelmapImageMapperSupport/* .canRenderVolumeViewportLabelmapAsImage */.QO)(viewport)) {
        return;
    }
    if (isPlanarSliceRenderingViewport(viewport)) {
        updatePlanarLabelmapImageMapperActors({
            viewport,
            segmentation,
            segmentationId,
            actorEntries,
        });
        return;
    }
    const actorEntriesByLabelmapId = new Map((actorEntries ?? viewport.getActors())
        .filter((actorEntry) => (0,labelmapRepresentationUID/* .isLabelmapRepresentationUID */.qV)(actorEntry.representationUID, segmentationId))
        .map((actorEntry) => [actorEntry.referencedId, actorEntry]));
    (0,labelmapSegmentationState/* .getLabelmaps */.m)(segmentation).forEach((layer) => {
        const actorEntry = actorEntriesByLabelmapId.get(layer.labelmapId);
        if (!actorEntry) {
            return;
        }
        const volume = (0,labelmapSegmentationState/* .getOrCreateLabelmapVolume */.kL)(layer);
        if (!volume) {
            return;
        }
        const sliceData = createSliceImageData(volume, viewport);
        if (!sliceData) {
            return;
        }
        const mapper = actorEntry.actor.getMapper();
        mapper.setInputData(sliceData.imageData);
        mapper.modified();
        actorEntry.actor.modified?.();
    });
}
function removeVolumeLabelmapImageMapperActors(viewport, segmentationId) {
    if (!(viewport.type === esm.Enums.ViewportType.ORTHOGRAPHIC)) {
        return;
    }
    if (!(0,labelmapImageMapperSupport/* .canRenderVolumeViewportLabelmapAsImage */.QO)(viewport)) {
        return;
    }
    const renderingEngine = viewport.getRenderingEngine();
    const offscreenMultiRenderWindow = renderingEngine.getOffscreenMultiRenderWindow(viewport.id);
    const overlayRenderer = offscreenMultiRenderWindow.getRenderer(getOverlayRendererId(viewport.id));
    if (!overlayRenderer) {
        return;
    }
    viewport
        .getActors()
        .filter((actorEntry) => (0,labelmapRepresentationUID/* .isLabelmapRepresentationUID */.qV)(actorEntry.representationUID, segmentationId))
        .forEach((actorEntry) => {
        overlayRenderer.removeActor(actorEntry.actor);
    });
    if (!overlayRenderer.getActors().length) {
        offscreenMultiRenderWindow.removeRenderer(getOverlayRendererId(viewport.id));
    }
}
function getLabelmapForActorReference(segmentation, referencedId) {
    if (!referencedId) {
        return;
    }
    return ((0,labelmapSegmentationState/* .getLabelmap */.Hs)(segmentation, referencedId) ??
        (0,labelmapSegmentationState/* .getLabelmapForImageId */.M4)(segmentation, referencedId) ??
        (0,labelmapSegmentationState/* .getLabelmapForVolumeId */.BS)(segmentation, referencedId) ??
        (0,labelmapSegmentationState/* .getLabelmaps */.m)(segmentation).find((layer) => layer.volumeId === referencedId));
}
async function addPlanarLabelmapImageMapperActors(args) {
    const { viewport, segmentation, segmentationId } = args;
    for (const [index, layer] of (0,labelmapSegmentationState/* .getLabelmaps */.m)(segmentation).entries()) {
        const volume = (0,labelmapSegmentationState/* .getOrCreateLabelmapVolume */.kL)(layer);
        if (!volume) {
            continue;
        }
        const sliceData = createSliceImageData(volume, viewport);
        if (!sliceData) {
            continue;
        }
        const currentImageId = viewport.getCurrentImageId() ??
            volume.imageIds[Math.min(Math.max(sliceData.state.sliceIndex, 0), Math.max(volume.imageIds.length - 1, 0))];
        if (!currentImageId) {
            continue;
        }
        const representationUID = (0,labelmapRepresentationUID/* .createLabelmapRepresentationUID */.Ox)({
            segmentationId,
            referencedId: layer.labelmapId,
        });
        await viewport.addImages([
            {
                dataId: representationUID,
                imageId: currentImageId,
                imageData: sliceData.imageData,
                reference: {
                    kind: 'segmentation',
                    segmentationId,
                    representationUID,
                    labelmapId: layer.labelmapId,
                },
                useWorldCoordinateImageData: true,
                callback: ({ imageActor }) => {
                    const mapper = imageActor.getMapper();
                    const camera = getSliceRenderingCamera(viewport);
                    mapper.setInputData(sliceData.imageData);
                    mapper.modified();
                    if (camera) {
                        applyPlanarOverlayDepthOffset(imageActor, camera.viewPlaneNormal, index + 1);
                    }
                },
            },
        ]);
    }
    viewport.render();
}
function updatePlanarLabelmapImageMapperActors(args) {
    const { viewport, segmentation, segmentationId, actorEntries } = args;
    const actorEntriesByLabelmapId = new Map((actorEntries ?? viewport.getActors())
        .filter((actorEntry) => (0,labelmapRepresentationUID/* .isLabelmapRepresentationUID */.qV)(actorEntry.representationUID, segmentationId))
        .map((actorEntry) => [actorEntry.referencedId, actorEntry]));
    (0,labelmapSegmentationState/* .getLabelmaps */.m)(segmentation).forEach((layer, index) => {
        const actorEntry = actorEntriesByLabelmapId.get(layer.labelmapId);
        if (!actorEntry) {
            return;
        }
        const volume = (0,labelmapSegmentationState/* .getOrCreateLabelmapVolume */.kL)(layer);
        if (!volume) {
            return;
        }
        const sliceData = createSliceImageData(volume, viewport);
        if (!sliceData) {
            return;
        }
        const mapper = actorEntry.actor.getMapper();
        mapper.setInputData(sliceData.imageData);
        mapper.modified();
        const camera = getSliceRenderingCamera(viewport);
        if (camera) {
            applyPlanarOverlayDepthOffset(actorEntry.actor, camera.viewPlaneNormal, index + 1);
        }
        actorEntry.actor.modified?.();
    });
}

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Labelmap/labelmapRenderPlan/removeLabelmapRepresentationFromViewport.js



function removeLabelmapRepresentationFromViewport(viewport, segmentationId) {
    removeVolumeLabelmapImageMapperActors(viewport, segmentationId);
    const labelmapActorEntries = (0,getSegmentationActor/* .getLabelmapActorEntries */.ED)(viewport.id, segmentationId) ?? [];
    const legacyActorEntryUIDs = [];
    labelmapActorEntries.forEach((actorEntry) => {
        if ((0,removeLabelmapRepresentationData/* ["default"] */.A)(viewport, segmentationId, actorEntry)) {
            return;
        }
        legacyActorEntryUIDs.push(actorEntry.uid);
    });
    if (legacyActorEntryUIDs.length) {
        viewport.removeActors(legacyActorEntryUIDs);
    }
}


;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Labelmap/labelmapRenderPlan/createLabelmapRenderPlan.js


function createLabelmapRenderPlan({ isVolumeImageMapper, kind, renderMode, segmentationId, unsupportedStateKey, updateAfterMount = true, useSliceRendering, viewport, canRenderCurrentViewport = () => kind !== 'unsupported', getExpectedRepresentationUIDs = () => [], isActorEntryCompatible = () => true, mount = async () => undefined, update = () => undefined, }) {
    const remove = () => removeLabelmapRepresentationFromViewport(viewport, segmentationId);
    const needsRemount = (actorEntries) => haveActorUIDsChanged(actorEntries, getExpectedRepresentationUIDs()) ||
        (actorEntries ?? []).some((actorEntry) => !isActorEntryCompatible(actorEntry));
    return {
        kind,
        renderMode,
        useSliceRendering,
        isVolumeImageMapper,
        unsupportedStateKey,
        getExpectedRepresentationUIDs,
        mount,
        needsRemount,
        remove,
        update,
        reconcile: async ({ actorEntries, labelMapData }) => {
            if (!canRenderCurrentViewport()) {
                return actorEntries;
            }
            let nextActorEntries = actorEntries;
            if (needsRemount(nextActorEntries) && nextActorEntries?.length) {
                remove();
                nextActorEntries = undefined;
            }
            const mounted = !nextActorEntries?.length;
            if (mounted) {
                await mount({ labelMapData });
            }
            nextActorEntries = (0,getSegmentationActor/* .getLabelmapActorEntries */.ED)(viewport.id, segmentationId);
            if (nextActorEntries?.length && (!mounted || updateAfterMount)) {
                update({ actorEntries: nextActorEntries });
            }
            return nextActorEntries;
        },
    };
}
function getActorEntryRenderMode(actorEntry) {
    return actorEntry.actorMapper?.renderMode;
}
function haveActorUIDsChanged(actorEntries, expectedRepresentationUIDs) {
    const actualUIDs = new Set((actorEntries ?? []).map((entry) => entry.representationUID));
    const expectedUIDs = new Set(expectedRepresentationUIDs);
    if (actualUIDs.size !== expectedUIDs.size) {
        return true;
    }
    for (const expectedUID of expectedUIDs) {
        if (!actualUIDs.has(expectedUID)) {
            return true;
        }
    }
    return false;
}


// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/getViewportLabelmapRenderMode.js
var getViewportLabelmapRenderMode = __webpack_require__(72293);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js + 3 modules
var enums = __webpack_require__(53870);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Labelmap/addVolumesAsIndependentComponents.js



const internalCache = new Map();
const load = ({ cfun, ofun, actor }) => {
    actor.getProperty().setRGBTransferFunction(1, cfun);
    actor.getProperty().setScalarOpacity(1, ofun);
};
async function addVolumesAsIndependentComponents({ viewport, volumeInputs, segmentationId, }) {
    const defaultActor = viewport.getDefaultActor();
    const { actor } = defaultActor;
    const { uid } = defaultActor;
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
    const volumeTexture = baseVolume.vtkOpenGLTexture;
    const hasPendingFrames = volumeTexture.hasUpdatedFrames();
    if (hasPendingFrames) {
        return;
    }
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
    const sharedImageData = oldMapper.getInputData();
    const originalScalars = sharedImageData.getPointData().getScalars() ?? null;
    const mapper = (0,esm.convertMapperToNotSharedMapper)(oldMapper);
    actor.setMapper(mapper);
    mapper.setBlendMode(esm.Enums.BlendModes.LABELMAP_EDGE_PROJECTION_BLEND);
    const arrayAgain = mapper.getInputData().getPointData().getArray(0);
    arrayAgain.setData(cubeData);
    arrayAgain.setNumberOfComponents(2);
    const oldColorMixPreset = actor.getProperty().getColorMixPreset();
    actor.getProperty().setColorMixPreset(1);
    const oldForceNearestInterpolation = actor
        .getProperty()
        .getForceNearestInterpolation(1);
    actor.getProperty().setForceNearestInterpolation(1, true);
    const oldIndependentComponents = actor
        .getProperty()
        .getIndependentComponents();
    actor.getProperty().setIndependentComponents(true);
    const oldUseLabelOutline = actor.getProperty().getUseLabelOutline();
    const oldLabelOutlineOpacity = actor.getProperty().getLabelOutlineOpacity();
    const oldLabelOutlineThickness = actor
        .getProperty()
        .getLabelOutlineThickness();
    const representationUID = volumeInputArray[0].representationUID ??
        `${segmentationId}-${enums.SegmentationRepresentations.Labelmap}`;
    viewport.addActor({
        ...defaultActor,
        representationUID,
    });
    internalCache.set(uid, {
        added: true,
        segmentationRepresentationUID: `${segmentationId}`,
        originalBlendMode: viewport.getBlendMode(),
    });
    const oldPreLoad = actor.get('preLoad');
    actor.set({
        preLoad: load,
    });
    function onSegmentationDataModified(evt) {
        const { segmentationId, modifiedSlicesToUse } = evt.detail;
        const { representationData } = (0,getSegmentation/* .getSegmentation */.T)(segmentationId);
        const { volumeId: segVolumeId } = representationData.Labelmap;
        if (segVolumeId !== segImageVolume.volumeId) {
            return;
        }
        const segmentationVolume = esm.cache.getVolume(segVolumeId);
        const segVoxelManager = segmentationVolume.voxelManager;
        const imageData = mapper.getInputData();
        const array = imageData.getPointData().getArray(0);
        const combinedData = array.getData();
        const newComp = 2;
        const dims = segImageData.getDimensions();
        const sliceSize = dims[0] * dims[1];
        const slices = modifiedSlicesToUse?.length
            ? modifiedSlicesToUse
            : Array.from({ length: dims[2] }, (_, i) => i);
        for (const z of slices) {
            const sliceStart = z * sliceSize;
            const sliceImage = esm.cache.getImage(segmentationVolume.imageIds?.[z]);
            const sliceData = sliceImage?.voxelManager?.getScalarData?.();
            if (sliceData?.length === sliceSize) {
                for (let i = 0; i < sliceSize; ++i) {
                    combinedData[(sliceStart + i) * newComp + 1] = sliceData[i];
                }
            }
            else {
                for (let i = 0; i < sliceSize; ++i) {
                    const iTuple = sliceStart + i;
                    combinedData[iTuple * newComp + 1] = segVoxelManager.getAtIndex(iTuple);
                }
            }
        }
        array.setData(combinedData);
        imageData.modified();
        viewport.render();
    }
    esm.eventTarget.addEventListenerDebounced(enums.Events.SEGMENTATION_DATA_MODIFIED, onSegmentationDataModified, 200);
    function onSegmentationRepresentationRemoved(evt) {
        if (evt.detail.viewportId !== viewport.id) {
            return;
        }
        esm.eventTarget.removeEventListenerDebounced(enums.Events.SEGMENTATION_DATA_MODIFIED, onSegmentationDataModified);
        esm.eventTarget.removeEventListener(enums.Events.SEGMENTATION_REPRESENTATION_REMOVED, onSegmentationRepresentationRemoved);
        const actorEntry = viewport.getActor(uid);
        if (actorEntry) {
            viewport.removeActors([uid]);
        }
        internalCache.delete(uid);
        if (viewport.isDisabled) {
            return;
        }
        actor.setMapper(oldMapper);
        const pointData = sharedImageData.getPointData();
        if (originalScalars) {
            pointData.setScalars(originalScalars);
        }
        else {
            pointData.removeArray('Pixels');
        }
        sharedImageData.modified();
        actor.getProperty().setColorMixPreset(oldColorMixPreset);
        actor
            .getProperty()
            .setForceNearestInterpolation(1, oldForceNearestInterpolation);
        actor.getProperty().setIndependentComponents(oldIndependentComponents);
        actor.getProperty().setUseLabelOutline(oldUseLabelOutline);
        actor.getProperty().setLabelOutlineOpacity(oldLabelOutlineOpacity);
        actor.getProperty().setLabelOutlineThickness(oldLabelOutlineThickness);
        viewport.addActor({
            ...defaultActor,
        });
        actor.set(oldPreLoad);
        viewport.render();
    }
    esm.eventTarget.addEventListener(enums.Events.SEGMENTATION_REPRESENTATION_REMOVED, onSegmentationRepresentationRemoved);
    return {
        uid,
        actor,
    };
}

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Labelmap/labelmapRenderPlan/planarGenericVolumeLabelmap.js


function isPlanarNextVolumeViewport(viewport) {
    const genericViewport = viewport;
    return (genericViewport.type === esm.Enums.ViewportType.PLANAR_NEXT &&
        typeof genericViewport.getVolumeId === 'function' &&
        typeof genericViewport.getViewReference === 'function' &&
        typeof genericViewport.getViewState === 'function' &&
        typeof genericViewport.addDisplaySet === 'function' &&
        typeof genericViewport.setDisplaySetPresentation === 'function' &&
        typeof genericViewport.setViewReference === 'function');
}
async function addLabelmapToPlanarGenericViewport(args) {
    const { blendMode, labelmapLayers, segmentationId, viewport, visibility } = args;
    const sourceVolumeRenderMode = getPlanarNextVolumeRenderMode(viewport);
    if (!sourceVolumeRenderMode) {
        return;
    }
    const sourceVolumeId = viewport.getVolumeId();
    const sourceViewReference = sourceVolumeId
        ? viewport.getViewReference({ volumeId: sourceVolumeId })
        : viewport.getViewReference();
    const requestedOrientation = viewport.getViewState().orientation;
    const sourceDataId = viewport.getSourceDataId?.();
    const sourceSlabThickness = sourceDataId
        ? viewport.getDisplaySetPresentation?.(sourceDataId)?.slabThickness
        : undefined;
    const currentImageIdIndex = Math.max(0, viewport.getCurrentImageIdIndex?.() ?? 0);
    let firstActorEntry;
    for (const layer of labelmapLayers) {
        if (!layer.volumeId) {
            continue;
        }
        const volume = esm.cache.getVolume(layer.volumeId);
        if (!volume) {
            throw new Error(`imageVolume with id: ${layer.volumeId} does not exist, you need to create/allocate the volume first`);
        }
        const representationUID = (0,labelmapRepresentationUID/* .createLabelmapRepresentationUID */.Ox)({
            segmentationId,
            referencedId: layer.labelmapId,
        });
        const dataId = representationUID;
        esm.utilities.genericViewportDisplaySetMetadataProvider.add(dataId, {
            kind: 'planar',
            imageIds: volume.imageIds,
            initialImageIdIndex: Math.min(currentImageIdIndex, Math.max(volume.imageIds.length - 1, 0)),
            reference: {
                kind: 'segmentation',
                segmentationId,
                representationUID,
                labelmapId: layer.labelmapId,
            },
            volumeId: layer.volumeId,
        });
        await viewport.addDisplaySet(dataId, {
            orientation: requestedOrientation,
            role: 'overlay',
        });
        viewport.setDisplaySetPresentation(dataId, {
            blendMode,
            visible: visibility,
            ...(sourceSlabThickness !== undefined
                ? { slabThickness: sourceSlabThickness }
                : {}),
        });
        firstActorEntry ||= viewport
            .getActors?.()
            .find((actorEntry) => actorEntry.representationUID === representationUID);
    }
    viewport.setViewReference(sourceViewReference);
    viewport.render?.();
    if (firstActorEntry) {
        return {
            uid: firstActorEntry.uid,
            actor: firstActorEntry.actor,
        };
    }
}
function getPlanarNextVolumeRenderMode(viewport) {
    const renderMode = viewport.getDefaultActor?.()?.actorMapper?.renderMode;
    if (renderMode === esm.ActorRenderMode.CPU_VOLUME ||
        renderMode === esm.ActorRenderMode.VTK_VOLUME_SLICE) {
        return renderMode;
    }
}


;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Labelmap/labelmapRenderPlan/legacyVolumePlan.js







const { uuidv4 } = esm.utilities;
function createLegacyVolumeLabelmapPlan({ config, isVolumeImageMapper, renderMode, segmentation, segmentationId, useSliceRendering, viewport, }) {
    return createLabelmapRenderPlan({
        isVolumeImageMapper,
        kind: 'legacy-volume',
        renderMode,
        segmentationId,
        useSliceRendering,
        viewport,
        getExpectedRepresentationUIDs: () => getExpectedVolumeLabelmapRepresentationUIDs(segmentation, segmentationId),
        isActorEntryCompatible: (actorEntry) => !isImageMountedActorEntry(actorEntry),
        mount: ({ labelMapData }) => mountLegacyVolumeLabelmap({
            config,
            labelMapData,
            segmentation,
            segmentationId,
            viewport,
        }),
    });
}
function isImageMountedActorEntry(actorEntry) {
    const renderMode = getActorEntryRenderMode(actorEntry);
    return (renderMode === esm.ActorRenderMode.VTK_IMAGE ||
        renderMode === esm.ActorRenderMode.CPU_IMAGE);
}
function getExpectedVolumeLabelmapRepresentationUIDs(segmentation, segmentationId) {
    return (0,labelmapSegmentationState/* .getLabelmaps */.m)(segmentation)
        .filter(canResolveLayerAsVolume)
        .map((layer) => (0,labelmapRepresentationUID/* .createLabelmapRepresentationUID */.Ox)({
        segmentationId,
        referencedId: layer.labelmapId,
    }));
}
async function mountLegacyVolumeLabelmap({ config, labelMapData, segmentation, segmentationId, viewport, }) {
    const { id: viewportId } = viewport;
    const visibility = true;
    const immediateRender = false;
    const suppressEvents = true;
    const volumeCompatibleViewport = viewport;
    const labelmapLayers = getVolumeBackedLabelmapLayers(segmentation);
    if (!labelmapLayers.length) {
        const volumeLabelMapData = labelMapData;
        const volumeId = ensureVolumeHasVolumeId(volumeLabelMapData, segmentation);
        if (!esm.cache.getVolume(volumeId)) {
            await handleMissingVolume(labelMapData);
        }
        labelmapLayers.push({
            labelmapId: volumeId,
            storageKind: 'volume',
            volumeId,
            imageIds: esm.cache.getVolume(volumeId)?.imageIds,
        });
    }
    let blendMode = config?.blendMode ?? esm.Enums.BlendModes.MAXIMUM_INTENSITY_BLEND;
    let useIndependentComponents = blendMode === esm.Enums.BlendModes.LABELMAP_EDGE_PROJECTION_BLEND;
    if (useIndependentComponents) {
        const referenceVolumeId = volumeCompatibleViewport.getVolumeId?.();
        const segLabelmapVolumeId = labelmapLayers[0]?.volumeId;
        const baseVolume = referenceVolumeId
            ? esm.cache.getVolume(referenceVolumeId)
            : undefined;
        const segVolume = segLabelmapVolumeId
            ? esm.cache.getVolume(segLabelmapVolumeId)
            : undefined;
        if (!baseVolume || !segVolume) {
            useIndependentComponents = false;
            blendMode = esm.Enums.BlendModes.MAXIMUM_INTENSITY_BLEND;
            console.debug('Independent components unavailable (missing reference or segmentation volume) - falling back to regular volume addition');
        }
        else {
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
    }
    const volumeInputs = labelmapLayers.map((layer) => ({
        volumeId: layer.volumeId,
        visibility,
        representationUID: (0,labelmapRepresentationUID/* .createLabelmapRepresentationUID */.Ox)({
            segmentationId,
            referencedId: layer.labelmapId,
        }),
        useIndependentComponents,
        blendMode,
    }));
    if (isPlanarNextVolumeViewport(viewport)) {
        return addLabelmapToPlanarGenericViewport({
            blendMode,
            labelmapLayers,
            segmentationId,
            viewport,
            visibility,
        });
    }
    if (!volumeInputs[0].useIndependentComponents) {
        await (0,esm.addVolumesToViewports)(viewport.getRenderingEngine(), volumeInputs, [viewportId], immediateRender, suppressEvents);
        (0,triggerSegmentationEvents.triggerSegmentationDataModified)(segmentationId);
        return;
    }
    return addVolumesAsIndependentComponents({
        viewport: volumeCompatibleViewport,
        volumeInputs,
        segmentationId,
    });
}
function canResolveLayerAsVolume(layer) {
    return Boolean(layer.volumeId || layer.geometryVolumeId || layer.imageIds?.length);
}
function getVolumeBackedLabelmapLayers(segmentation) {
    return (0,labelmapSegmentationState/* .getLabelmaps */.m)(segmentation)
        .map((layer) => {
        if (layer.volumeId) {
            return layer;
        }
        const volume = (0,labelmapSegmentationState/* .getOrCreateLabelmapVolume */.kL)(layer);
        if (!volume?.volumeId) {
            return;
        }
        return {
            ...layer,
            volumeId: volume.volumeId,
        };
    })
        .filter((layer) => Boolean(layer));
}
function ensureVolumeHasVolumeId(labelMapData, segmentation) {
    let { volumeId } = labelMapData;
    if (!volumeId) {
        volumeId = uuidv4();
        segmentation.representationData.Labelmap = {
            ...segmentation.representationData.Labelmap,
            volumeId,
        };
        labelMapData.volumeId = volumeId;
        (0,triggerSegmentationEvents.triggerSegmentationModified)(segmentation.segmentationId);
    }
    return volumeId;
}
async function handleMissingVolume(labelMapData) {
    const stackData = labelMapData;
    const hasImageIds = stackData.imageIds.length > 0;
    if (!hasImageIds) {
        throw new Error('cannot create labelmap, no imageIds found for the volume labelmap');
    }
    const volume = await esm.volumeLoader.createAndCacheVolumeFromImages(labelMapData.volumeId ?? uuidv4(), stackData.imageIds);
    return volume;
}


// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getCurrentLabelmapImageIdForViewport.js
var getCurrentLabelmapImageIdForViewport = __webpack_require__(9200);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Labelmap/syncStackLabelmapActors.js
var syncStackLabelmapActors = __webpack_require__(68060);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Labelmap/labelmapRenderPlan/stackImagePlan.js





function createStackImageLabelmapPlan({ isVolumeImageMapper, renderMode, segmentationId, useSliceRendering, viewport, }) {
    return createLabelmapRenderPlan({
        isVolumeImageMapper,
        kind: 'legacy-stack-image',
        renderMode,
        segmentationId,
        updateAfterMount: false,
        useSliceRendering,
        viewport,
        canRenderCurrentViewport: () => hasCurrentStackLabelmapImageIds(viewport, segmentationId),
        getExpectedRepresentationUIDs: () => getExpectedStackLabelmapRepresentationUIDs(viewport, segmentationId),
        mount: () => mountStackLabelmapActors(viewport, segmentationId),
        update: () => (0,syncStackLabelmapActors/* .syncStackLabelmapActors */.k)(viewport, segmentationId),
    });
}
function hasCurrentStackLabelmapImageIds(viewport, segmentationId) {
    return !!(0,getCurrentLabelmapImageIdForViewport/* .getCurrentLabelmapImageIdsForViewport */.aF)(viewport.id, segmentationId)
        ?.length;
}
function getExpectedStackLabelmapRepresentationUIDs(viewport, segmentationId) {
    return ((0,getCurrentLabelmapImageIdForViewport/* .getCurrentLabelmapImageIdsForViewport */.aF)(viewport.id, segmentationId)?.map((imageId) => (0,labelmapRepresentationUID/* .createLabelmapRepresentationUID */.Ox)({
        segmentationId,
        referencedId: imageId,
    })) ?? []);
}
async function mountStackLabelmapActors(viewport, segmentationId) {
    (0,syncStackLabelmapActors/* .syncStackLabelmapActors */.k)(viewport, segmentationId);
    (0,triggerSegmentationEvents.triggerSegmentationDataModified)(segmentationId);
}


;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Labelmap/labelmapRenderPlan/volumeSliceImageMapperPlan.js




function createVolumeSliceImageMapperPlan({ isVolumeImageMapper, renderMode, segmentation, segmentationId, useSliceRendering, viewport, }) {
    return createLabelmapRenderPlan({
        isVolumeImageMapper,
        kind: 'volume-slice-image-mapper',
        renderMode,
        segmentationId,
        useSliceRendering,
        viewport,
        getExpectedRepresentationUIDs: () => getVolumeLabelmapImageMapperRepresentationUIDs(viewport, segmentationId, segmentation),
        isActorEntryCompatible: (actorEntry) => !isVolumeMountedActorEntry(actorEntry),
        mount: () => mountVolumeLabelmapImageMapper({
            viewport,
            segmentation,
            segmentationId,
        }),
        update: ({ actorEntries }) => updateVolumeLabelmapImageMapperActors({
            viewport,
            segmentation,
            segmentationId,
            actorEntries,
        }),
    });
}
function isVolumeMountedActorEntry(actorEntry) {
    const renderMode = getActorEntryRenderMode(actorEntry);
    return (renderMode === esm.ActorRenderMode.VTK_VOLUME ||
        renderMode === esm.ActorRenderMode.VTK_VOLUME_SLICE ||
        renderMode === esm.ActorRenderMode.CPU_VOLUME);
}
async function mountVolumeLabelmapImageMapper({ viewport, segmentation, segmentationId, }) {
    await addVolumeLabelmapImageMapperActors({
        viewport,
        segmentation,
        segmentationId,
    });
    (0,triggerSegmentationEvents.triggerSegmentationDataModified)(segmentationId);
}


;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Labelmap/labelmapRenderPlan/resolveLabelmapRenderPlan.js






function resolveLabelmapRenderPlan({ viewport, segmentation, representation, }) {
    const { segmentationId, config } = representation;
    const useSliceRendering = (0,labelmapImageMapperSupport/* .shouldUseSliceRendering */.bY)(segmentation, config);
    const renderMode = (0,getViewportLabelmapRenderMode/* ["default"] */.A)(viewport, {
        useSliceRendering,
    });
    const isVolumeImageMapper = useSliceRendering && (0,labelmapImageMapperSupport/* .canRenderVolumeViewportLabelmapAsImage */.QO)(viewport);
    if (renderMode === 'unsupported') {
        return createLabelmapRenderPlan({
            isVolumeImageMapper,
            kind: 'unsupported',
            renderMode,
            segmentationId,
            unsupportedStateKey: useSliceRendering
                ? (0,labelmapImageMapperSupport/* .getVolumeViewportLabelmapImageMapperState */.o)(viewport).key
                : undefined,
            useSliceRendering,
            viewport,
        });
    }
    if (isVolumeImageMapper) {
        return createVolumeSliceImageMapperPlan({
            isVolumeImageMapper,
            renderMode,
            segmentation,
            segmentationId,
            useSliceRendering,
            viewport,
        });
    }
    if (renderMode === 'volume') {
        return createLegacyVolumeLabelmapPlan({
            config,
            isVolumeImageMapper,
            renderMode,
            segmentation,
            segmentationId,
            useSliceRendering,
            viewport,
        });
    }
    return createStackImageLabelmapPlan({
        isVolumeImageMapper,
        renderMode,
        segmentationId,
        useSliceRendering,
        viewport,
    });
}


;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Labelmap/labelmapRenderPlan/index.js




;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Labelmap/labelmapRenderPlan.js


// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/PiecewiseFunction.js
var PiecewiseFunction = __webpack_require__(30678);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/ColorTransferFunction.js + 1 modules
var ColorTransferFunction = __webpack_require__(35997);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/activeSegmentation.js + 1 modules
var segmentation_activeSegmentation = __webpack_require__(31125);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getActiveSegmentIndex.js
var getActiveSegmentIndex = __webpack_require__(61395);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getColorLUT.js
var getColorLUT = __webpack_require__(39550);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/internalGetHiddenSegmentIndices.js
var internalGetHiddenSegmentIndices = __webpack_require__(83789);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/SegmentationStyle.js
var SegmentationStyle = __webpack_require__(51933);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Labelmap/labelmapActorStyle.js












const actorTransferFunctions = new WeakMap();
const lastAppliedLabelmapStyle = new WeakMap();
const MAX_NUMBER_COLORS = 255;
function setLabelmapColorAndOpacity(viewportId, labelmapActorEntry, segmentationRepresentation) {
    const { segmentationId } = segmentationRepresentation;
    const { colorLUTIndex } = segmentationRepresentation;
    const activeSegmentation = (0,segmentation_activeSegmentation.getActiveSegmentation)(viewportId);
    const isActiveLabelmap = activeSegmentation?.segmentationId === segmentationId;
    const labelmapStyle = SegmentationStyle/* .segmentationStyle.getStyle */.Y.getStyle({
        viewportId,
        type: SegmentationRepresentations/* ["default"].Labelmap */.A.Labelmap,
        segmentationId,
    });
    const renderInactiveSegmentations = SegmentationStyle/* .segmentationStyle.getRenderInactiveSegmentations */.Y.getRenderInactiveSegmentations(viewportId);
    const colorLUT = (0,getColorLUT/* .getColorLUT */.B)(colorLUTIndex);
    const segmentation = (0,getSegmentation/* .getSegmentation */.T)(segmentationId);
    const layer = getLabelmapForActorReference(segmentation, labelmapActorEntry.referencedId);
    const layerBindings = Object.keys(segmentation.segments)
        .map(Number)
        .map((segmentIndex) => ({
        segmentIndex,
        binding: (0,labelmapSegmentationState/* .getSegmentBinding */.hM)(segmentation, segmentIndex),
    }))
        .filter((entry) => !layer || entry.binding?.labelmapId === layer.labelmapId);
    const maxLabelValue = Math.max(1, ...layerBindings.map((entry) => entry.binding?.labelValue ?? entry.segmentIndex));
    const numColors = Math.max(colorLUT.length, maxLabelValue + 1);
    const labelValueEntries = Array.from({ length: numColors - 1 }, (_, index) => {
        const labelValue = index + 1;
        const segmentIndex = layer?.labelToSegmentIndex?.[labelValue] ?? labelValue;
        return {
            labelValue,
            segmentIndex,
        };
    });
    const { outlineWidth, renderOutline, outlineOpacity, activeSegmentOutlineWidthDelta, } = getLabelmapConfig(labelmapStyle, isActiveLabelmap);
    const segmentsHidden = (0,internalGetHiddenSegmentIndices/* .internalGetHiddenSegmentIndices */.s)(viewportId, {
        segmentationId,
        type: SegmentationRepresentations/* ["default"].Labelmap */.A.Labelmap,
    });
    const labelmapActor = labelmapActorEntry.actor;
    const colorNodes = [
        { x: 0, r: 0, g: 0, b: 0, midpoint: 0.5, sharpness: 1.0 },
    ];
    const opacityNodes = [{ x: 0, y: 0, midpoint: 0.5, sharpness: 1.0 }];
    labelValueEntries.forEach(({ labelValue, segmentIndex }) => {
        const segmentColor = colorLUT[segmentIndex];
        if (!segmentColor) {
            return;
        }
        const perSegmentStyle = SegmentationStyle/* .segmentationStyle.getStyle */.Y.getStyle({
            viewportId,
            type: SegmentationRepresentations/* ["default"].Labelmap */.A.Labelmap,
            segmentationId,
            segmentIndex,
        });
        const { fillAlpha, renderFill } = getLabelmapConfig(labelmapStyle, isActiveLabelmap, perSegmentStyle);
        colorNodes.push({
            x: labelValue,
            r: segmentColor[0] / MAX_NUMBER_COLORS,
            g: segmentColor[1] / MAX_NUMBER_COLORS,
            b: segmentColor[2] / MAX_NUMBER_COLORS,
            midpoint: 0.5,
            sharpness: 1.0,
        });
        if (renderFill) {
            const segmentOpacity = segmentsHidden.has(segmentIndex)
                ? 0
                : (segmentColor[3] / 255) * fillAlpha;
            opacityNodes.push({
                x: labelValue,
                y: segmentOpacity,
                midpoint: 0.5,
                sharpness: 1.0,
            });
        }
        else {
            opacityNodes.push({
                x: labelValue,
                y: 0.01,
                midpoint: 0.5,
                sharpness: 1.0,
            });
        }
    });
    const activeSegmentIndex = (0,getActiveSegmentIndex/* .getActiveSegmentIndex */.Q)(segmentationRepresentation.segmentationId);
    const outlineWidths = new Array(numColors - 1).fill(0);
    if (renderOutline) {
        labelValueEntries.forEach(({ labelValue, segmentIndex }) => {
            if (segmentsHidden.has(segmentIndex)) {
                return;
            }
            outlineWidths[labelValue - 1] =
                segmentIndex === activeSegmentIndex
                    ? outlineWidth + activeSegmentOutlineWidthDelta
                    : outlineWidth;
        });
    }
    const visible = isActiveLabelmap || renderInactiveSegmentations;
    const useImageSliceProperties = labelmapActorEntry.actorMapper?.renderMode === esm.ActorRenderMode.VTK_IMAGE ||
        labelmapActorEntry.actorMapper?.renderMode ===
            esm.ActorRenderMode.VTK_VOLUME_SLICE;
    const { preLoad } = labelmapActor.get?.('preLoad') || { preLoad: null };
    const styleSignature = JSON.stringify({
        colorNodes,
        opacityNodes,
        renderOutline,
        outlineOpacity,
        outlineWidths,
        visible,
        useImageSliceProperties,
    });
    const canUseStyleCache = !preLoad;
    if (canUseStyleCache &&
        lastAppliedLabelmapStyle.get(labelmapActor) === styleSignature) {
        return;
    }
    const { cfun, ofun } = getOrCreateTransferFunctions(labelmapActor);
    cfun.removeAllPoints();
    ofun.removeAllPoints();
    cfun.setNodes(colorNodes);
    ofun.setNodes(opacityNodes);
    ofun.setClamping(false);
    const actorMapper = labelmapActorEntry.actorMapper;
    const labelmapMapper = actorMapper?.mapper
        ? actorMapper.mapper
        : labelmapActor.getMapper();
    if (preLoad) {
        preLoad({ cfun, ofun, actor: labelmapActor });
    }
    else {
        labelmapActor.getProperty().setRGBTransferFunction(0, cfun);
        labelmapActor.getProperty().setScalarOpacity(0, ofun);
        labelmapActor.getProperty().setInterpolationTypeToNearest();
    }
    if (useImageSliceProperties) {
        const imageSlice = labelmapActor;
        imageSlice.setForceTranslucent(true);
        imageSlice.setForceOpaque(false);
        imageSlice.getProperty().setUseLookupTableScalarRange(true);
    }
    if (renderOutline) {
        labelmapActor.getProperty().setUseLabelOutline(renderOutline);
        labelmapActor.getProperty().setLabelOutlineOpacity(outlineOpacity);
        labelmapActor.getProperty().setLabelOutlineThickness(outlineWidths);
        labelmapActor.modified();
        labelmapActor.getProperty().modified();
        labelmapMapper?.modified?.();
    }
    else {
        labelmapActor.getProperty().setLabelOutlineThickness(outlineWidths);
    }
    labelmapActor.setVisibility(visible);
    labelmapActor.modified();
    labelmapActor.getProperty().modified();
    labelmapMapper?.modified?.();
    if (canUseStyleCache) {
        lastAppliedLabelmapStyle.set(labelmapActor, styleSignature);
    }
    else {
        lastAppliedLabelmapStyle.delete(labelmapActor);
    }
}
function getOrCreateTransferFunctions(actor) {
    const existing = actorTransferFunctions.get(actor);
    if (existing) {
        return existing;
    }
    const cfun = ColorTransferFunction/* ["default"].newInstance */.Ay.newInstance();
    const ofun = PiecewiseFunction/* ["default"].newInstance */.Ay.newInstance();
    ofun.addPoint(0, 0);
    const created = { cfun, ofun };
    actorTransferFunctions.set(actor, created);
    return created;
}
function getLabelmapConfig(labelmapConfig, isActiveLabelmap, segmentsLabelmapConfig) {
    const segmentLabelmapConfig = segmentsLabelmapConfig || {};
    const configToUse = {
        ...labelmapConfig,
        ...segmentLabelmapConfig,
    };
    return {
        fillAlpha: isActiveLabelmap
            ? configToUse.fillAlpha
            : configToUse.fillAlphaInactive,
        outlineWidth: isActiveLabelmap
            ? configToUse.outlineWidth
            : configToUse.outlineWidthInactive,
        renderFill: isActiveLabelmap
            ? configToUse.renderFill
            : configToUse.renderFillInactive,
        renderOutline: isActiveLabelmap
            ? configToUse.renderOutline
            : configToUse.renderOutlineInactive,
        outlineOpacity: isActiveLabelmap
            ? configToUse.outlineOpacity
            : configToUse.outlineOpacityInactive,
        activeSegmentOutlineWidthDelta: configToUse.activeSegmentOutlineWidthDelta,
    };
}


;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Labelmap/labelmapDisplay.js











const unsupportedImageMapperStates = new Map();
let polySegConversionInProgress = false;
function removeRepresentation(viewportId, segmentationId, renderImmediate = false) {
    clearUnsupportedImageMapperError(viewportId, segmentationId);
    const enabledElement = (0,esm.getEnabledElementByViewportId)(viewportId);
    if (!enabledElement) {
        return;
    }
    const { viewport } = enabledElement;
    removeLabelmapRepresentationFromViewport(viewport, segmentationId);
    if (!renderImmediate) {
        return;
    }
    viewport.render();
}
async function render(viewport, representation) {
    const { segmentationId } = representation;
    const segmentation = (0,getSegmentation/* .getSegmentation */.T)(segmentationId);
    if (!segmentation) {
        console.warn('No segmentation found for segmentationId: ', segmentationId);
        return;
    }
    let labelmapData = segmentation.representationData[SegmentationRepresentations/* ["default"].Labelmap */.A.Labelmap];
    let labelmapActorEntries = (0,getSegmentationActor/* .getLabelmapActorEntries */.ED)(viewport.id, segmentationId);
    if (!labelmapData &&
        (0,esm_config/* .getPolySeg */.Qy)()?.canComputeRequestedRepresentation(segmentationId, SegmentationRepresentations/* ["default"].Labelmap */.A.Labelmap) &&
        !polySegConversionInProgress) {
        polySegConversionInProgress = true;
        const polySeg = (0,esm_config/* .getPolySeg */.Qy)();
        labelmapData = await (0,computeAndAddRepresentation/* .computeAndAddRepresentation */.d)(segmentationId, SegmentationRepresentations/* ["default"].Labelmap */.A.Labelmap, () => polySeg.computeLabelmapData(segmentationId, {
            viewport: viewport,
        }), () => {
            SegmentationStateManager/* .defaultSegmentationStateManager.processLabelmapRepresentationAddition */._6.processLabelmapRepresentationAddition(viewport.id, segmentationId);
            setTimeout(() => {
                (0,triggerSegmentationEvents.triggerSegmentationDataModified)(segmentationId);
            }, 0);
        });
        if (!labelmapData) {
            throw new Error(`No labelmap data found for segmentationId ${segmentationId}.`);
        }
        polySegConversionInProgress = false;
    }
    else if (!labelmapData && !(0,esm_config/* .getPolySeg */.Qy)()) {
        console.debug(`No labelmap data found for segmentationId ${segmentationId} and PolySeg add-on is not configured. Unable to convert from other representations to labelmap. Please register PolySeg using cornerstoneTools.init({ addons: { polySeg } }) to enable automatic conversion.`);
    }
    if (!labelmapData) {
        return;
    }
    const renderPlan = resolveLabelmapRenderPlan({
        viewport,
        segmentation,
        representation,
    });
    if (renderPlan.kind === 'unsupported') {
        if (labelmapActorEntries?.length) {
            renderPlan.remove();
        }
        if (renderPlan.unsupportedStateKey) {
            reportUnsupportedImageMapperError(viewport.id, segmentationId, renderPlan.unsupportedStateKey);
        }
        return;
    }
    clearUnsupportedImageMapperError(viewport.id, segmentationId);
    labelmapActorEntries = await renderPlan.reconcile({
        actorEntries: labelmapActorEntries,
        labelMapData: labelmapData,
    });
    if (!labelmapActorEntries?.length) {
        return;
    }
    for (const labelmapActorEntry of labelmapActorEntries) {
        setLabelmapColorAndOpacity(viewport.id, labelmapActorEntry, representation);
    }
}
function getUpdateFunction(_viewport) {
    return;
}
function getUnsupportedImageMapperStateKey(viewportId, segmentationId) {
    return `${viewportId}:${segmentationId}`;
}
function clearUnsupportedImageMapperError(viewportId, segmentationId) {
    unsupportedImageMapperStates.delete(getUnsupportedImageMapperStateKey(viewportId, segmentationId));
}
function reportUnsupportedImageMapperError(viewportId, segmentationId, stateKey) {
    const cacheKey = getUnsupportedImageMapperStateKey(viewportId, segmentationId);
    const previousStateKey = unsupportedImageMapperStates.get(cacheKey);
    if (previousStateKey === stateKey) {
        return;
    }
    unsupportedImageMapperStates.set(cacheKey, stateKey);
    esm.eventTarget.dispatchEvent(new CustomEvent(esm.Enums.Events.ERROR_EVENT, {
        detail: {
            type: 'Segmentation',
            message: 'Labelmap image-mapper rendering is only supported on legacy orthographic single-slice volume viewports.',
        },
        cancelable: true,
    }));
}
/* export default */ const labelmapDisplay = ({
    getUpdateFunction,
    render,
    removeRepresentation,
});



},
5406(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Ox: () => (createLabelmapRepresentationUID),
  qV: () => (isLabelmapRepresentationUID)
});
/* import */ var _enums_index_js__rspack_import_0 = __webpack_require__(53870);

function getLabelmapRepresentationPrefix(segmentationId) {
    return `${segmentationId}-${_enums_index_js__rspack_import_0.SegmentationRepresentations.Labelmap}`;
}
function createLabelmapRepresentationUID({ segmentationId, referencedId, sliceStateKey, }) {
    return [
        getLabelmapRepresentationPrefix(segmentationId),
        referencedId,
        sliceStateKey,
    ]
        .filter(Boolean)
        .join('-');
}
function isLabelmapRepresentationUID(representationUID, segmentationId) {
    return (typeof representationUID === 'string' &&
        representationUID.startsWith(getLabelmapRepresentationPrefix(segmentationId)));
}



},
8270(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _labelmapRepresentationUID_js__rspack_import_1 = __webpack_require__(5406);


function removeLabelmapRepresentationData(viewport, segmentationId, actorEntry) {
    const representationUID = actorEntry.representationUID;
    if (!(0,_labelmapRepresentationUID_js__rspack_import_1/* .isLabelmapRepresentationUID */.qV)(representationUID, segmentationId)) {
        return false;
    }
    const dataViewport = viewport;
    if (typeof dataViewport.removeData !== 'function') {
        return false;
    }
    _cornerstonejs_core__rspack_import_0.utilities.genericViewportDisplaySetMetadataProvider.remove(representationUID);
    dataViewport.removeData(representationUID);
    return true;
}
/* export default */ const __rspack_default_export = (removeLabelmapRepresentationData);


},
68060(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  k: () => (syncStackLabelmapActors)
});
/* import */ var _kitware_vtk_js_Common_Core_DataArray_js__rspack_import_0 = __webpack_require__(445);
/* import */ var _kitware_vtk_js_Common_DataModel_ImageData_js__rspack_import_1 = __webpack_require__(26393);
/* import */ var _kitware_vtk_js_Common_DataModel_PiecewiseFunction_js__rspack_import_2 = __webpack_require__(30678);
/* import */ var _cornerstonejs_core__rspack_import_3 = __webpack_require__(88479);
/* import */ var _stateManagement_segmentation_SegmentationRenderingEngine_js__rspack_import_4 = __webpack_require__(88330);
/* import */ var _stateManagement_segmentation_helpers_isSegmentationOverlayCompatible_js__rspack_import_5 = __webpack_require__(78132);
/* import */ var _enums_index_js__rspack_import_6 = __webpack_require__(53870);
/* import */ var _stateManagement_segmentation_updateLabelmapSegmentationImageReferences_js__rspack_import_7 = __webpack_require__(9484);
/* import */ var _stateManagement_segmentation_getCurrentLabelmapImageIdForViewport_js__rspack_import_8 = __webpack_require__(9200);
/* import */ var _stateManagement_segmentation_helpers_getSegmentationActor_js__rspack_import_9 = __webpack_require__(47153);
/* import */ var _stateManagement_segmentation_helpers_getViewportLabelmapRenderMode_js__rspack_import_10 = __webpack_require__(72293);
/* import */ var _labelmapRepresentationUID_js__rspack_import_11 = __webpack_require__(5406);
/* import */ var _removeLabelmapRepresentationData_js__rspack_import_12 = __webpack_require__(8270);













function syncStackLabelmapActors(viewport, segmentationId) {
    if (typeof viewport
        .getCurrentImageId !== 'function') {
        return;
    }
    const currentImageId = viewport.getCurrentImageId();
    if (!currentImageId) {
        return;
    }
    if (!(0,_stateManagement_segmentation_helpers_isSegmentationOverlayCompatible_js__rspack_import_5/* .isSegmentationOverlayCompatible */.B)(viewport, segmentationId, _enums_index_js__rspack_import_6.SegmentationRepresentations.Labelmap)) {
        return;
    }
    (0,_stateManagement_segmentation_updateLabelmapSegmentationImageReferences_js__rspack_import_7/* .updateLabelmapSegmentationImageReferences */.t)(viewport.id, segmentationId);
    const derivedImageIds = (0,_stateManagement_segmentation_getCurrentLabelmapImageIdForViewport_js__rspack_import_8/* .getCurrentLabelmapImageIdsForViewport */.aF)(viewport.id, segmentationId) ?? [];
    const derivedImageIdSet = new Set(derivedImageIds);
    const labelmapActorEntries = (0,_stateManagement_segmentation_helpers_getSegmentationActor_js__rspack_import_9/* .getLabelmapActorEntries */.ED)(viewport.id, segmentationId) ?? [];
    const staleActorEntries = labelmapActorEntries.filter((actorEntry) => !derivedImageIdSet.has(actorEntry.referencedId));
    const inheritedLabelmapStyle = captureLabelmapActorStyle(staleActorEntries[0]?.actor);
    let shouldTriggerSegmentationRender = false;
    let shouldRenderViewport = staleActorEntries.length > 0;
    if (staleActorEntries.length) {
        const legacyActorEntryUIDs = [];
        staleActorEntries.forEach((actorEntry) => {
            if ((0,_removeLabelmapRepresentationData_js__rspack_import_12/* ["default"] */.A)(viewport, segmentationId, actorEntry)) {
                return;
            }
            legacyActorEntryUIDs.push(actorEntry.uid);
        });
        if (legacyActorEntryUIDs.length) {
            viewport.removeActors(legacyActorEntryUIDs);
        }
        shouldTriggerSegmentationRender = true;
    }
    const renderMode = (0,_stateManagement_segmentation_helpers_getViewportLabelmapRenderMode_js__rspack_import_10/* ["default"] */.A)(viewport);
    const defaultActorRenderMode = viewport.getDefaultActor()?.actorMapper
        ?.renderMode;
    const currentImage = _cornerstonejs_core__rspack_import_3.cache.getImage(currentImageId) ||
        {
            imageId: currentImageId,
        };
    const { origin: currentOrigin } = viewport.getImageDataMetadata(currentImage);
    derivedImageIds.forEach((derivedImageId) => {
        const derivedImage = _cornerstonejs_core__rspack_import_3.cache.getImage(derivedImageId);
        if (!derivedImage) {
            console.warn('No derived image found in the cache for segmentation representation', { segmentationId, derivedImageId });
            return;
        }
        const segmentationActorEntry = (0,_stateManagement_segmentation_helpers_getSegmentationActor_js__rspack_import_9/* .getLabelmapActorEntries */.ED)(viewport.id, segmentationId)?.find((actorEntry) => actorEntry.referencedId === derivedImageId);
        if (!segmentationActorEntry) {
            const representationUID = (0,_labelmapRepresentationUID_js__rspack_import_11/* .createLabelmapRepresentationUID */.Ox)({
                segmentationId,
                referencedId: derivedImage.imageId,
            });
            if (renderMode === 'image' &&
                defaultActorRenderMode === _cornerstonejs_core__rspack_import_3.ActorRenderMode.CPU_IMAGE) {
                viewport.addImages([
                    {
                        dataId: representationUID,
                        imageId: derivedImageId,
                        reference: {
                            kind: 'segmentation',
                            segmentationId,
                            representationUID,
                            labelmapId: derivedImage.imageId,
                        },
                        representationUID,
                    },
                ]);
            }
            else {
                const { dimensions, spacing, direction } = viewport.getImageDataMetadata(derivedImage);
                const constructor = derivedImage.voxelManager.getConstructor();
                const newPixelData = derivedImage.voxelManager.getScalarData();
                const values = new constructor(newPixelData);
                const scalarArray = _kitware_vtk_js_Common_Core_DataArray_js__rspack_import_0/* ["default"].newInstance */.Ay.newInstance({
                    dataType: _kitware_vtk_js_Common_Core_DataArray_js__rspack_import_0/* ["default"].getDataType */.Ay.getDataType(values),
                    name: 'Pixels',
                    numberOfComponents: 1,
                    values,
                });
                const imageData = _kitware_vtk_js_Common_DataModel_ImageData_js__rspack_import_1/* ["default"].newInstance */.Ay.newInstance();
                imageData.setDimensions(dimensions[0], dimensions[1], 1);
                imageData.setSpacing(spacing);
                imageData.setDirection(direction);
                imageData.setOrigin(currentOrigin);
                imageData.getPointData().setScalars(scalarArray);
                imageData.modified();
                viewport.addImages([
                    {
                        dataId: representationUID,
                        imageId: derivedImageId,
                        reference: {
                            kind: 'segmentation',
                            segmentationId,
                            representationUID,
                            labelmapId: derivedImage.imageId,
                        },
                        representationUID,
                        callback: ({ imageActor }) => {
                            imageActor.getMapper().setInputData(imageData);
                            applyInheritedLabelmapStyle(imageActor, inheritedLabelmapStyle);
                        },
                    },
                ]);
            }
            shouldTriggerSegmentationRender = true;
            shouldRenderViewport = true;
            return;
        }
        const actorMapper = segmentationActorEntry.actorMapper;
        const mapper = actorMapper?.mapper
            ? actorMapper.mapper
            : segmentationActorEntry.actor.getMapper();
        const segmentationImageData = mapper.getInputData();
        segmentationImageData.modified();
        if (segmentationImageData.setDerivedImage) {
            segmentationImageData.setDerivedImage(derivedImage);
        }
        else {
            _cornerstonejs_core__rspack_import_3.utilities.updateVTKImageDataWithCornerstoneImage(segmentationImageData, derivedImage);
        }
        shouldRenderViewport = true;
    });
    if (shouldTriggerSegmentationRender) {
        (0,_stateManagement_segmentation_SegmentationRenderingEngine_js__rspack_import_4/* .triggerSegmentationRender */.h6)(viewport.id);
    }
    if (shouldRenderViewport) {
        viewport.render();
    }
}
function captureLabelmapActorStyle(actor) {
    const prop = actor?.getProperty?.();
    if (!prop) {
        return undefined;
    }
    return {
        cfun: prop.getRGBTransferFunction?.(0),
        ofun: prop.getScalarOpacity?.(0),
    };
}
function applyInheritedLabelmapStyle(actor, style) {
    const prop = actor?.getProperty?.();
    if (!prop) {
        return;
    }
    if (style?.cfun && prop.setRGBTransferFunction) {
        prop.setRGBTransferFunction(0, style.cfun);
    }
    if (style?.ofun && prop.setScalarOpacity) {
        prop.setScalarOpacity(0, style.ofun);
    }
    else if (prop.setScalarOpacity) {
        const ofun = _kitware_vtk_js_Common_DataModel_PiecewiseFunction_js__rspack_import_2/* ["default"].newInstance */.Ay.newInstance();
        ofun.addPoint(0, 0);
        ofun.addPoint(1, 1);
        ofun.setClamping(false);
        prop.setScalarOpacity(0, ofun);
    }
    prop.setUseLookupTableScalarRange?.(true);
    prop.setInterpolationTypeToNearest?.();
    actor?.setForceTranslucent?.(true);
    actor?.setForceOpaque?.(false);
}


},
90824(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (/* binding */ surfaceDisplay)
});

// UNUSED EXPORTS: getUpdateFunction, removeRepresentation, render

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(88479);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/SegmentationRepresentations.js
var SegmentationRepresentations = __webpack_require__(63555);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Surface/removeSurfaceFromElement.js

function removeSurfaceFromElement(element, segmentationId) {
    const enabledElement = (0,esm.getEnabledElement)(element);
    const { viewport } = enabledElement;
    const actorEntries = viewport.getActors();
    const filteredSurfaceActors = actorEntries.filter((actor) => actor.representationUID &&
        typeof actor.representationUID === 'string' &&
        actor.representationUID.startsWith(segmentationId));
    viewport.removeActors(filteredSurfaceActors.map((actor) => actor.uid));
}
/* export default */ const Surface_removeSurfaceFromElement = (removeSurfaceFromElement);

// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/Mapper.js + 1 modules
var Mapper = __webpack_require__(3901);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/Actor.js
var Actor = __webpack_require__(44404);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/PolyData.js + 7 modules
var PolyData = __webpack_require__(91542);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/CellArray.js
var CellArray = __webpack_require__(32461);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/getSegmentationActor.js
var getSegmentationActor = __webpack_require__(47153);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Surface/addOrUpdateSurfaceToElement.js






function addOrUpdateSurfaceToElement(viewport, surface, segmentationId) {
    const surfaceActorEntry = (0,getSegmentationActor/* .getSurfaceActorEntry */.Th)(viewport.id, segmentationId, surface.segmentIndex);
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
        const polyData = PolyData/* ["default"].newInstance */.Ay.newInstance();
        polyData.getPoints().setData(newPoints, 3);
        const triangles = CellArray/* ["default"].newInstance */.Ay.newInstance({
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
    const surfacePolyData = PolyData/* ["default"].newInstance */.Ay.newInstance();
    surfacePolyData.getPoints().setData(points, 3);
    const triangles = CellArray/* ["default"].newInstance */.Ay.newInstance({
        values: Float32Array.from(polys),
    });
    surfacePolyData.setPolys(triangles);
    const mapper = Mapper/* ["default"].newInstance */.Ay.newInstance({});
    let clippingFilter;
    mapper.setInputData(surfacePolyData);
    const actor = Actor/* ["default"].newInstance */.Ay.newInstance();
    actor.setMapper(mapper);
    actor.getProperty().setColor(color[0] / 255, color[1] / 255, color[2] / 255);
    actor.getProperty().setLineWidth(2);
    const representationUID = (0,getSegmentationActor/* .getSurfaceRepresentationUID */.DU)(segmentationId, surface.segmentIndex);
    viewport.addActor({
        uid: esm.utilities.uuidv4(),
        actor: actor,
        clippingFilter,
        representationUID,
    });
    viewport.resetCamera();
    viewport.getRenderer().resetCameraClippingRange();
    viewport.render();
}
/* export default */ const Surface_addOrUpdateSurfaceToElement = (addOrUpdateSurfaceToElement);

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getSegmentation.js
var getSegmentation = __webpack_require__(99212);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getColorLUT.js
var getColorLUT = __webpack_require__(39550);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/config.js
var config = __webpack_require__(2782);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/computeAndAddRepresentation.js
var computeAndAddRepresentation = __webpack_require__(952);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/internalGetHiddenSegmentIndices.js
var internalGetHiddenSegmentIndices = __webpack_require__(83789);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Surface/surfaceDisplay.js









function removeRepresentation(viewportId, segmentationId, renderImmediate = false) {
    const enabledElement = (0,esm.getEnabledElementByViewportId)(viewportId);
    if (!enabledElement) {
        return;
    }
    const { viewport } = enabledElement;
    Surface_removeSurfaceFromElement(viewport.element, segmentationId);
    if (!renderImmediate) {
        return;
    }
    viewport.render();
}
async function render(viewport, representation) {
    const { segmentationId, type } = representation;
    const segmentation = (0,getSegmentation/* .getSegmentation */.T)(segmentationId);
    if (!segmentation) {
        return;
    }
    let SurfaceData = segmentation.representationData[SegmentationRepresentations/* ["default"].Surface */.A.Surface];
    if (!SurfaceData &&
        (0,config/* .getPolySeg */.Qy)()?.canComputeRequestedRepresentation(segmentationId, SegmentationRepresentations/* ["default"].Surface */.A.Surface)) {
        const polySeg = (0,config/* .getPolySeg */.Qy)();
        SurfaceData = await (0,computeAndAddRepresentation/* .computeAndAddRepresentation */.d)(segmentationId, SegmentationRepresentations/* ["default"].Surface */.A.Surface, () => polySeg.computeSurfaceData(segmentationId, { viewport }));
        if (!SurfaceData) {
            throw new Error(`No Surface data found for segmentationId ${segmentationId} even we tried to compute it`);
        }
    }
    else if (!SurfaceData && !(0,config/* .getPolySeg */.Qy)()) {
        console.debug(`No surface data found for segmentationId ${segmentationId} and PolySeg add-on is not configured. Unable to convert from other representations to surface. Please register PolySeg using cornerstoneTools.init({ addons: { polySeg } }) to enable automatic conversion.`);
    }
    if (!SurfaceData) {
        console.warn(`No Surface data found for segmentationId ${segmentationId}. Skipping render.`);
        return;
    }
    const { geometryIds } = SurfaceData;
    if (!geometryIds?.size) {
        console.warn(`No Surfaces found for segmentationId ${segmentationId}. Skipping render.`);
    }
    const { colorLUTIndex } = representation;
    const colorLUT = (0,getColorLUT/* .getColorLUT */.B)(colorLUTIndex);
    const surfaces = [];
    geometryIds.forEach((geometryId) => {
        const geometry = esm.cache.getGeometry(geometryId);
        if (!geometry?.data) {
            console.warn(`No Surfaces found for geometryId ${geometryId}. Skipping render.`);
            return;
        }
        const { segmentIndex } = geometry.data;
        const hiddenSegments = (0,internalGetHiddenSegmentIndices/* .internalGetHiddenSegmentIndices */.s)(viewport.id, {
            segmentationId,
            type,
        });
        const isHidden = hiddenSegments.has(segmentIndex);
        const surface = geometry.data;
        const color = colorLUT[segmentIndex];
        surface.color = color.slice(0, 3);
        surface.visible = !isHidden;
        surfaces.push(surface);
        Surface_addOrUpdateSurfaceToElement(viewport, surface, segmentationId);
    });
    viewport.render();
}
function getUpdateFunction(viewport) {
    const polySeg = (0,config/* .getPolySeg */.Qy)();
    return (segmentationId) => polySeg.updateSurfaceData(segmentationId, { viewport });
}
/* export default */ const surfaceDisplay = ({
    getUpdateFunction,
    render,
    removeRepresentation,
});



},
81440(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  X: () => (distancePointToContour)
});
/* import */ var _utilities_math_index_js__rspack_import_0 = __webpack_require__(44292);

const distancePointToContour = (viewport, annotation, coords) => {
    if (!annotation?.data?.contour?.polyline?.length) {
        return;
    }
    const { polyline } = annotation.data.contour;
    const { length } = polyline;
    let distance = Infinity;
    for (let i = 0; i < length; i++) {
        const canvasPoint = viewport.worldToCanvas(polyline[i]);
        const distanceToPoint = _utilities_math_index_js__rspack_import_0.point.distanceToPoint(canvasPoint, coords);
        distance = Math.min(distance, distanceToPoint);
    }
    if (distance === Infinity || isNaN(distance)) {
        return;
    }
    return distance;
};


},
70947(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var gl_matrix__rspack_import_1 = __webpack_require__(40230);
/* import */ var _enums_index_js__rspack_import_2 = __webpack_require__(53870);
/* import */ var _strategies_fillSphere_js__rspack_import_3 = __webpack_require__(79911);
/* import */ var _strategies_eraseSphere_js__rspack_import_4 = __webpack_require__(6184);
/* import */ var _strategies_fillCircle_js__rspack_import_5 = __webpack_require__(55314);
/* import */ var _strategies_eraseCircle_js__rspack_import_6 = __webpack_require__(72857);
/* import */ var _cursors_elementCursor_js__rspack_import_7 = __webpack_require__(45128);
/* import */ var _utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_8 = __webpack_require__(85321);
/* import */ var _LabelmapBaseTool_js__rspack_import_9 = __webpack_require__(28182);
/* import */ var _strategies_utils_getStrategyData_js__rspack_import_10 = __webpack_require__(66340);
/* import */ var _utils_LazyBrushEditController_js__rspack_import_11 = __webpack_require__(47678);
/* import */ var _utils_shouldUseLazyLabelmapEditing_js__rspack_import_12 = __webpack_require__(46787);
/* import */ var _stateManagement_segmentation_getActiveSegmentation_js__rspack_import_13 = __webpack_require__(7342);














class BrushTool extends _LabelmapBaseTool_js__rspack_import_9/* ["default"] */.A {
    constructor(toolProps = {}, defaultToolProps = {
        supportedInteractionTypes: ['Mouse', 'Touch'],
        configuration: {
            strategies: {
                FILL_INSIDE_CIRCLE: _strategies_fillCircle_js__rspack_import_5/* .fillInsideCircle */.kr,
                ERASE_INSIDE_CIRCLE: _strategies_eraseCircle_js__rspack_import_6/* .eraseInsideCircle */.r,
                FILL_INSIDE_SPHERE: _strategies_fillSphere_js__rspack_import_3/* .fillInsideSphere */.Jq,
                ERASE_INSIDE_SPHERE: _strategies_eraseSphere_js__rspack_import_4/* .eraseInsideSphere */._,
                THRESHOLD_INSIDE_CIRCLE: _strategies_fillCircle_js__rspack_import_5/* .thresholdInsideCircle */.q,
                THRESHOLD_INSIDE_SPHERE: _strategies_fillSphere_js__rspack_import_3/* .thresholdInsideSphere */.rd,
                THRESHOLD_INSIDE_SPHERE_WITH_ISLAND_REMOVAL: _strategies_fillSphere_js__rspack_import_3/* .thresholdInsideSphereIsland */.Sw,
            },
            defaultStrategy: 'FILL_INSIDE_CIRCLE',
            activeStrategy: 'FILL_INSIDE_CIRCLE',
            brushSize: 25,
            useCenterSegmentIndex: false,
            preview: {
                enabled: false,
                previewColors: {
                    0: [255, 255, 255, 128],
                },
                previewTimeMs: 250,
                previewMoveDistance: 8,
                dragMoveDistance: 4,
                dragTimeMs: 500,
            },
            actions: {
                [_enums_index_js__rspack_import_2.StrategyCallbacks.AcceptPreview]: {
                    method: _enums_index_js__rspack_import_2.StrategyCallbacks.AcceptPreview,
                    bindings: [
                        {
                            key: 'Enter',
                        },
                    ],
                },
                [_enums_index_js__rspack_import_2.StrategyCallbacks.RejectPreview]: {
                    method: _enums_index_js__rspack_import_2.StrategyCallbacks.RejectPreview,
                    bindings: [
                        {
                            key: 'Escape',
                        },
                    ],
                },
                [_enums_index_js__rspack_import_2.StrategyCallbacks.Interpolate]: {
                    method: _enums_index_js__rspack_import_2.StrategyCallbacks.Interpolate,
                    bindings: [
                        {
                            key: 'i',
                        },
                    ],
                    configuration: {
                        useBallStructuringElement: true,
                        noUseDistanceTransform: true,
                        noUseExtrapolation: true,
                    },
                },
                interpolateExtrapolation: {
                    method: _enums_index_js__rspack_import_2.StrategyCallbacks.Interpolate,
                    bindings: [
                        {
                            key: 'e',
                        },
                    ],
                    configuration: {},
                },
            },
        },
    }) {
        super(toolProps, defaultToolProps);
        this._lastDragInfo = null;
        this._lazyEdit = new _utils_LazyBrushEditController_js__rspack_import_11/* ["default"] */.A();
        this.onSetToolPassive = (_evt) => {
            this.disableCursor();
        };
        this.onSetToolEnabled = () => {
            this.disableCursor();
        };
        this.onSetToolDisabled = (_evt) => {
            this.disableCursor();
        };
        this.preMouseDownCallback = (evt) => {
            const eventData = evt.detail;
            const { element, currentPoints } = eventData;
            const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
            const { viewport } = enabledElement;
            const activeSegmentation = (0,_stateManagement_segmentation_getActiveSegmentation_js__rspack_import_13/* .getActiveSegmentation */.T)(viewport.id);
            if (!activeSegmentation) {
                const event = new CustomEvent(_cornerstonejs_core__rspack_import_0.Enums.Events.ERROR_EVENT, {
                    detail: {
                        type: 'Segmentation',
                        message: 'No active segmentation detected, create a segmentation representation before using the brush tool',
                    },
                    cancelable: true,
                });
                _cornerstonejs_core__rspack_import_0.eventTarget.dispatchEvent(event);
                return false;
            }
            this._editData = this.createEditData(element);
            this._previewData.isDrag = false;
            this._previewData.timerStart = Date.now();
            const canvasPoint = gl_matrix__rspack_import_1/* .vec2.clone */.Zc.o8(currentPoints.canvas);
            const worldPoint = viewport.canvasToWorld([
                canvasPoint[0],
                canvasPoint[1],
            ]);
            this._lastDragInfo = {
                canvas: canvasPoint,
                world: gl_matrix__rspack_import_1/* .vec3.clone */.eR.o8(worldPoint),
            };
            this._hoverData = this.createHoverData(element, canvasPoint);
            if (!this._hoverData) {
                this._editData = null;
                return false;
            }
            this._calculateCursor(element, canvasPoint);
            this._resetLazyEditState();
            if (this._isLazyLabelmapEditingEnabled(this._hoverData.viewport)) {
                this._lazyEdit.appendStrokePoint(worldPoint);
                this._captureLazyPreviewCircle();
            }
            (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_8/* ["default"] */.A)(this._hoverData.viewportIdsToRender);
            const operationData = this.getOperationData(element);
            if (!operationData) {
                return false;
            }
            this._activateDraw(element);
            (0,_cursors_elementCursor_js__rspack_import_7.hideElementCursor)(element);
            evt.preventDefault();
            this.applyActiveStrategyCallback(enabledElement, operationData, _enums_index_js__rspack_import_2.StrategyCallbacks.OnInteractionStart);
            return true;
        };
        this.mouseMoveCallback = (evt) => {
            if (!this.isPrimary) {
                return;
            }
            if (this.mode === _enums_index_js__rspack_import_2.ToolModes.Active) {
                this.updateCursor(evt);
                if (!this.configuration.preview.enabled) {
                    return;
                }
                const { previewTimeMs, previewMoveDistance, dragMoveDistance } = this.configuration.preview;
                const { currentPoints, element } = evt.detail;
                const { canvas } = currentPoints;
                const { startPoint, timer, timerStart, isDrag } = this._previewData;
                if (isDrag) {
                    return;
                }
                const delta = gl_matrix__rspack_import_1/* .vec2.distance */.Zc.Io(canvas, startPoint);
                const time = Date.now() - timerStart;
                if (delta > previewMoveDistance ||
                    (time > previewTimeMs && delta > dragMoveDistance)) {
                    if (timer) {
                        window.clearTimeout(timer);
                        this._previewData.timer = null;
                    }
                    if (!isDrag) {
                        this.rejectPreview(element);
                    }
                }
                if (!this._previewData.timer) {
                    const timer = window.setTimeout(this.previewCallback, 250);
                    Object.assign(this._previewData, {
                        timerStart: Date.now(),
                        timer,
                        startPoint: canvas,
                        element,
                    });
                }
            }
        };
        this.previewCallback = () => {
            if (this._previewData.isDrag) {
                this._previewData.timer = null;
                return;
            }
            this._previewData.timer = null;
            const operationData = this.getOperationData(this._previewData.element);
            if (!operationData) {
                return;
            }
            const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(this._previewData.element);
            if (!enabledElement) {
                return;
            }
            const { viewport } = enabledElement;
            const activeStrategy = this.configuration.activeStrategy;
            const strategyData = (0,_strategies_utils_getStrategyData_js__rspack_import_10/* .getStrategyData */.S)({
                operationData,
                viewport,
                strategy: activeStrategy,
            });
            if (!operationData) {
                return;
            }
            const memo = this.createMemo(operationData.segmentationId, strategyData.segmentationVoxelManager);
            this._previewData.preview = this.applyActiveStrategyCallback((0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(this._previewData.element), {
                ...operationData,
                ...strategyData,
                memo,
            }, _enums_index_js__rspack_import_2.StrategyCallbacks.Preview);
        };
        this._dragCallback = (evt) => {
            const eventData = evt.detail;
            const { element, currentPoints } = eventData;
            const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
            const { viewport } = enabledElement;
            this.updateCursor(evt);
            if (!this._hoverData) {
                return;
            }
            const { viewportIdsToRender } = this._hoverData;
            (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_8/* ["default"] */.A)(viewportIdsToRender);
            const delta = gl_matrix__rspack_import_1/* .vec2.distance */.Zc.Io(currentPoints.canvas, this._previewData.startPoint);
            const { dragTimeMs, dragMoveDistance } = this.configuration.preview;
            if (!this._previewData.isDrag &&
                Date.now() - this._previewData.timerStart < dragTimeMs &&
                delta < dragMoveDistance) {
                return;
            }
            if (this._previewData.timer) {
                window.clearTimeout(this._previewData.timer);
                this._previewData.timer = null;
            }
            if (!this._lastDragInfo) {
                const startCanvas = this._previewData.startPoint;
                const startWorld = viewport.canvasToWorld([
                    startCanvas[0],
                    startCanvas[1],
                ]);
                this._lastDragInfo = {
                    canvas: gl_matrix__rspack_import_1/* .vec2.clone */.Zc.o8(startCanvas),
                    world: gl_matrix__rspack_import_1/* .vec3.clone */.eR.o8(startWorld),
                };
            }
            const currentCanvas = currentPoints.canvas;
            const currentWorld = viewport.canvasToWorld([
                currentCanvas[0],
                currentCanvas[1],
            ]);
            this._hoverData = this.createHoverData(element, currentCanvas);
            if (!this._hoverData) {
                return;
            }
            this._calculateCursor(element, currentCanvas);
            if (this._isLazyLabelmapEditingEnabled(this._hoverData.viewport)) {
                this._lazyEdit.appendStrokePoint(currentWorld);
                this._captureLazyPreviewCircle();
                this._previewData.preview = null;
            }
            else {
                const operationData = this.getOperationData(element);
                if (!operationData) {
                    return;
                }
                operationData.strokePointsWorld = [
                    gl_matrix__rspack_import_1/* .vec3.clone */.eR.o8(this._lastDragInfo.world),
                    gl_matrix__rspack_import_1/* .vec3.clone */.eR.o8(currentWorld),
                ];
                this._previewData.preview = this.applyActiveStrategy(enabledElement, operationData);
            }
            const currentCanvasClone = gl_matrix__rspack_import_1/* .vec2.clone */.Zc.o8(currentCanvas);
            this._lastDragInfo = {
                canvas: currentCanvasClone,
                world: gl_matrix__rspack_import_1/* .vec3.clone */.eR.o8(currentWorld),
            };
            this._previewData.element = element;
            this._previewData.timerStart = Date.now() + dragTimeMs;
            this._previewData.isDrag = true;
            this._previewData.startPoint = currentCanvasClone;
        };
        this._endCallback = (evt) => {
            const eventData = evt.detail;
            const { element } = eventData;
            const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
            const operationData = this.getOperationData(element);
            if (!operationData) {
                return;
            }
            const isLazyLabelmapEditing = this._isLazyLabelmapEditingEnabled(this._hoverData?.viewport);
            if (isLazyLabelmapEditing && this._previewData.isDrag) {
                operationData.strokePointsWorld = this._lazyEdit
                    .getStrokePointsWorld()
                    .map((point) => gl_matrix__rspack_import_1/* .vec3.clone */.eR.o8(point));
                this.applyActiveStrategy(enabledElement, operationData);
            }
            else if (!this._previewData.preview && !this._previewData.isDrag) {
                this.applyActiveStrategy(enabledElement, operationData);
            }
            this.doneEditMemo();
            this._deactivateDraw(element);
            (0,_cursors_elementCursor_js__rspack_import_7.resetElementCursor)(element);
            this._editData = null;
            this._lastDragInfo = null;
            if (isLazyLabelmapEditing && this._previewData.isDrag) {
                this._scheduleLazyPreviewCleanup(element, evt.detail.currentPoints.canvas, enabledElement.viewport.id, operationData.segmentationId);
                (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_8/* ["default"] */.A)(this._hoverData.viewportIdsToRender);
            }
            else {
                this._resetLazyEditState();
                this.updateCursor(evt);
            }
            this.applyActiveStrategyCallback(enabledElement, operationData, _enums_index_js__rspack_import_2.StrategyCallbacks.OnInteractionEnd);
            if (!this._previewData.isDrag) {
                this.acceptPreview(element);
            }
        };
        this._activateDraw = (element) => {
            element.addEventListener(_enums_index_js__rspack_import_2.Events.MOUSE_UP, this._endCallback);
            element.addEventListener(_enums_index_js__rspack_import_2.Events.MOUSE_DRAG, this._dragCallback);
            element.addEventListener(_enums_index_js__rspack_import_2.Events.MOUSE_CLICK, this._endCallback);
        };
        this._deactivateDraw = (element) => {
            element.removeEventListener(_enums_index_js__rspack_import_2.Events.MOUSE_UP, this._endCallback);
            element.removeEventListener(_enums_index_js__rspack_import_2.Events.MOUSE_DRAG, this._dragCallback);
            element.removeEventListener(_enums_index_js__rspack_import_2.Events.MOUSE_CLICK, this._endCallback);
        };
    }
    disableCursor() {
        this._clearPendingLazyPreviewCleanup();
        this._hoverData = undefined;
        this._resetLazyEditState();
        this.rejectPreview();
    }
    _isLazyLabelmapEditingEnabled(viewport) {
        return (0,_utils_shouldUseLazyLabelmapEditing_js__rspack_import_12/* .shouldUseLazyLabelmapEditing */.v)(viewport ?? this._hoverData?.viewport);
    }
    _resetLazyEditState() {
        this._lazyEdit.reset();
    }
    _clearPendingLazyPreviewCleanup() {
        this._lazyEdit.clearPendingCleanup();
    }
    _refreshCursor(element, centerCanvas) {
        this._hoverData = this.createHoverData(element, centerCanvas);
        if (!this._hoverData) {
            return;
        }
        this._calculateCursor(element, centerCanvas);
        BrushTool.activeCursorTool = this;
        (0,_utilities_triggerAnnotationRenderForViewportIds_js__rspack_import_8/* ["default"] */.A)(this._hoverData.viewportIdsToRender);
    }
    _scheduleLazyPreviewCleanup(element, centerCanvas, viewportId, segmentationId) {
        this._lazyEdit.scheduleCleanup({
            element,
            centerCanvas,
            viewportId,
            segmentationId,
            refreshCursor: this._refreshCursor.bind(this),
        });
    }
    _captureLazyPreviewCircle() {
        if (!this._isLazyLabelmapEditingEnabled() || !this._hoverData) {
            return;
        }
        this._lazyEdit.capturePreviewCircle(this._hoverData);
    }
    updateCursor(evt) {
        const eventData = evt.detail;
        const { element } = eventData;
        const { currentPoints } = eventData;
        const centerCanvas = currentPoints.canvas;
        this._refreshCursor(element, centerCanvas);
    }
    _calculateCursor(element, _centerCanvas) {
        const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
        const operationData = this.getOperationData(element);
        if (!enabledElement || !operationData) {
            return;
        }
        this.applyActiveStrategyCallback(enabledElement, operationData, _enums_index_js__rspack_import_2.StrategyCallbacks.CalculateCursorGeometry);
    }
    getStatistics(element, segmentIndices) {
        if (!element) {
            return;
        }
        const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
        const operationData = this.getOperationData(element);
        if (!enabledElement || !operationData) {
            return;
        }
        const stats = this.applyActiveStrategyCallback(enabledElement, operationData, _enums_index_js__rspack_import_2.StrategyCallbacks.GetStatistics, segmentIndices);
        return stats;
    }
    rejectPreview(element = this._previewData.element) {
        if (!element) {
            return;
        }
        this.doneEditMemo();
        const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
        if (!enabledElement) {
            return;
        }
        const operationData = this.getOperationData(element);
        if (!operationData) {
            return;
        }
        this.applyActiveStrategyCallback(enabledElement, operationData, _enums_index_js__rspack_import_2.StrategyCallbacks.RejectPreview);
        this._previewData.preview = null;
        this._previewData.isDrag = false;
    }
    acceptPreview(element = this._previewData.element) {
        if (!element) {
            return;
        }
        super.acceptPreview(element);
    }
    interpolate(element, config) {
        if (!element) {
            return;
        }
        const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
        const operationData = this.getOperationData(element);
        if (!enabledElement || !operationData) {
            return;
        }
        this._previewData.preview = this.applyActiveStrategyCallback(enabledElement, operationData, _enums_index_js__rspack_import_2.StrategyCallbacks.Interpolate, config.configuration);
        this._previewData.isDrag = true;
    }
    invalidateBrushCursor() {
        if (this._hoverData === undefined) {
            return;
        }
        const { data } = this._hoverData.brushCursor;
        const { viewport } = this._hoverData;
        data.invalidated = true;
        const { segmentColor } = this.getActiveSegmentationData(viewport) || {};
        this._hoverData.brushCursor.metadata.segmentColor = segmentColor;
    }
    renderAnnotation(enabledElement, svgDrawingHelper) {
        if (!this._hoverData || BrushTool.activeCursorTool !== this) {
            return;
        }
        const { viewport } = enabledElement;
        const viewportIdsToRender = this._hoverData.viewportIdsToRender;
        if (!viewportIdsToRender.includes(viewport.id)) {
            return;
        }
        const brushCursor = this._hoverData.brushCursor;
        if (brushCursor.data.invalidated === true) {
            const { centerCanvas } = this._hoverData;
            const { element } = viewport;
            this._calculateCursor(element, centerCanvas);
        }
        this.applyActiveStrategyCallback(enabledElement, this.getOperationData(viewport.element), _enums_index_js__rspack_import_2.StrategyCallbacks.RenderCursor, svgDrawingHelper);
    }
}
BrushTool.toolName = 'Brush';
/* export default */ const __rspack_default_export = (BrushTool);


},
13972(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  M: () => (eraseInsideRectangle)
});
/* import */ var _fillRectangle_js__rspack_import_0 = __webpack_require__(42289);

function eraseRectangle(enabledElement, operationData, inside = true) {
    const eraseOperationData = Object.assign({}, operationData, {
        segmentIndex: 0,
    });
    (0,_fillRectangle_js__rspack_import_0/* .fillInsideRectangle */.pY)(enabledElement, eraseOperationData);
}
function eraseInsideRectangle(enabledElement, operationData) {
    eraseRectangle(enabledElement, operationData, true);
}
function eraseOutsideRectangle(enabledElement, operationData) {
    eraseRectangle(enabledElement, operationData, false);
}


},
84107(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  D: () => (removeWorldCrosshairLines3D),
  Q: () => (updateWorldCrosshairLines3D)
});
/* import */ var _kitware_vtk_js_Rendering_Core_Actor_js__rspack_import_0 = __webpack_require__(44404);
/* import */ var _kitware_vtk_js_Rendering_Core_Mapper_js__rspack_import_1 = __webpack_require__(3901);
/* import */ var _kitware_vtk_js_Common_DataModel_PolyData_js__rspack_import_2 = __webpack_require__(91542);
/* import */ var _kitware_vtk_js_Common_Core_Points_js__rspack_import_3 = __webpack_require__(74973);
/* import */ var _kitware_vtk_js_Common_Core_CellArray_js__rspack_import_4 = __webpack_require__(32461);





const linesByKey = new Map();
function getKey(viewport, uidPrefix) {
    return `${viewport.id}:${uidPrefix}`;
}
function setCrosshairLinePoints(polyData, worldPoint, halfLength) {
    const [x, y, z] = worldPoint;
    const points = _kitware_vtk_js_Common_Core_Points_js__rspack_import_3/* ["default"].newInstance */.Ay.newInstance();
    points.setNumberOfPoints(6);
    points.setPoint(0, x - halfLength, y, z);
    points.setPoint(1, x + halfLength, y, z);
    points.setPoint(2, x, y - halfLength, z);
    points.setPoint(3, x, y + halfLength, z);
    points.setPoint(4, x, y, z - halfLength);
    points.setPoint(5, x, y, z + halfLength);
    const lines = _kitware_vtk_js_Common_Core_CellArray_js__rspack_import_4/* ["default"].newInstance */.Ay.newInstance({
        values: [2, 0, 1, 2, 2, 3, 2, 4, 5],
    });
    polyData.setPoints(points);
    polyData.setLines(lines);
    polyData.modified();
}
function getViewportRenderer(viewport) {
    return typeof viewport?.getRenderer === 'function'
        ? viewport.getRenderer()
        : undefined;
}
function updateWorldCrosshairLines3D(viewport, worldPoint, options) {
    const renderer = getViewportRenderer(viewport);
    if (!renderer || !worldPoint) {
        return;
    }
    const { lineLengthMm, color, uidPrefix } = options;
    const halfLength = Math.max(lineLengthMm / 2, 1);
    const key = getKey(viewport, uidPrefix);
    let entry = linesByKey.get(key);
    const isAttached = entry && !!renderer.getActors?.().includes(entry.actor);
    if (!entry || !isAttached) {
        if (entry) {
            renderer.removeActor(entry.actor);
        }
        const polyData = _kitware_vtk_js_Common_DataModel_PolyData_js__rspack_import_2/* ["default"].newInstance */.Ay.newInstance();
        setCrosshairLinePoints(polyData, worldPoint, halfLength);
        const mapper = _kitware_vtk_js_Rendering_Core_Mapper_js__rspack_import_1/* ["default"].newInstance */.Ay.newInstance();
        mapper.setInputData(polyData);
        const actor = _kitware_vtk_js_Rendering_Core_Actor_js__rspack_import_0/* ["default"].newInstance */.Ay.newInstance();
        actor.setMapper(mapper);
        actor.getProperty().setColor(...color);
        actor.getProperty().setLineWidth(1.5);
        actor.getProperty().setInterpolationToFlat();
        actor.getProperty().setAmbient(1.0);
        actor.getProperty().setDiffuse(0.0);
        actor.getProperty().setSpecular(0.0);
        renderer.addActor(actor);
        renderer.resetCameraClippingRange?.();
        entry = { actor, polyData };
        linesByKey.set(key, entry);
    }
    else {
        setCrosshairLinePoints(entry.polyData, worldPoint, halfLength);
    }
    viewport.render();
}
function removeWorldCrosshairLines3D(viewport, uidPrefix) {
    const key = getKey(viewport, uidPrefix);
    const entry = linesByKey.get(key);
    linesByKey.delete(key);
    if (!entry) {
        return;
    }
    const renderer = getViewportRenderer(viewport);
    if (!renderer) {
        return;
    }
    renderer.removeActor(entry.actor);
    viewport.render();
}


},
42010(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (convertContourSegmentationAnnotation)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _stateManagement_index_js__rspack_import_1 = __webpack_require__(60567);
/* import */ var _removeContourSegmentationAnnotation_js__rspack_import_2 = __webpack_require__(13127);
/* import */ var _addContourSegmentationAnnotation_js__rspack_import_3 = __webpack_require__(45112);
/* import */ var _stateManagement_annotation_helpers_state_js__rspack_import_4 = __webpack_require__(34350);





const DEFAULT_CONTOUR_SEG_TOOL_NAME = 'PlanarFreehandContourSegmentationTool';
function convertContourSegmentationAnnotation(annotation) {
    const { polyline } = annotation.data?.contour || {};
    if (!polyline || polyline.length < 3) {
        console.warn('Skipping creation of new annotation due to invalid polyline:', polyline);
        return;
    }
    (0,_stateManagement_index_js__rspack_import_1/* .removeAnnotation */.O8)(annotation.annotationUID);
    (0,_removeContourSegmentationAnnotation_js__rspack_import_2/* .removeContourSegmentationAnnotation */.M)(annotation);
    const startPointWorld = polyline[0];
    const endPointWorld = polyline[polyline.length - 1];
    const newAnnotation = {
        metadata: {
            ...annotation.metadata,
            toolName: DEFAULT_CONTOUR_SEG_TOOL_NAME,
            originalToolName: annotation.metadata.originalToolName || annotation.metadata.toolName,
        },
        data: {
            cachedStats: {},
            handles: {
                points: [startPointWorld, endPointWorld],
                textBox: annotation.data.handles.textBox
                    ? { ...annotation.data.handles.textBox }
                    : undefined,
            },
            contour: {
                ...annotation.data.contour,
            },
            spline: annotation.data.spline,
            segmentation: {
                ...annotation.data.segmentation,
            },
        },
        annotationUID: _cornerstonejs_core__rspack_import_0.utilities.uuidv4(),
        highlighted: true,
        invalidated: true,
        isLocked: false,
        isVisible: undefined,
        interpolationUID: annotation.interpolationUID,
        interpolationCompleted: annotation.interpolationCompleted,
    };
    (0,_stateManagement_index_js__rspack_import_1/* .addAnnotation */.lC)(newAnnotation, annotation.metadata.FrameOfReferenceUID);
    (0,_addContourSegmentationAnnotation_js__rspack_import_3/* .addContourSegmentationAnnotation */.V)(newAnnotation);
    (0,_stateManagement_annotation_helpers_state_js__rspack_import_4.triggerAnnotationModified)(newAnnotation);
    return newAnnotation;
}


},
55122(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (findHandlePolylineIndex)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var gl_matrix__rspack_import_1 = __webpack_require__(40230);


const { isEqual } = _cornerstonejs_core__rspack_import_0.utilities;
function findHandlePolylineIndex(annotation, handleIndex) {
    const { polyline } = annotation.data.contour;
    const { points } = annotation.data.handles;
    const { length } = points;
    if (handleIndex === length) {
        return polyline.length;
    }
    if (handleIndex < 0) {
        handleIndex = (handleIndex + length) % length;
    }
    if (handleIndex === 0) {
        return 0;
    }
    const handle = points[handleIndex];
    const index = polyline.findIndex((point) => isEqual(handle, point));
    if (index !== -1) {
        return index;
    }
    let closestDistance = Infinity;
    return polyline.reduce((closestIndex, point, testIndex) => {
        const distance = gl_matrix__rspack_import_1/* .vec3.squaredDistance */.eR.hG(point, handle);
        if (distance < closestDistance) {
            closestDistance = distance;
            return testIndex;
        }
        return closestIndex;
    }, -1);
}


},
99906(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export),
  c: () => (getCenterAndRadiusInCanvas)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var gl_matrix__rspack_import_1 = __webpack_require__(40230);


const EPSILON = 1e-4;
function getCenterAndRadiusInCanvas(points, viewport) {
    const canvasPoints = points.map((p) => viewport.worldToCanvas(p));
    const [cBottom, cTop, cLeft, cRight] = canvasPoints;
    const center = [
        (cBottom[0] + cTop[0]) / 2,
        (cBottom[1] + cTop[1]) / 2,
    ];
    const worldHeight = gl_matrix__rspack_import_1/* .vec3.distance */.eR.Io(points[0], points[1]);
    const worldWidth = gl_matrix__rspack_import_1/* .vec3.distance */.eR.Io(points[2], points[3]);
    const canvasHeight = gl_matrix__rspack_import_1/* .vec2.distance */.Zc.Io(cBottom, cTop);
    const canvasWidth = gl_matrix__rspack_import_1/* .vec2.distance */.Zc.Io(cLeft, cRight);
    const scaleX = canvasWidth / worldWidth;
    const scaleY = canvasHeight / worldHeight;
    const worldRadius = worldHeight / 2;
    const radius = Math.abs(scaleX - scaleY) > EPSILON
        ? worldRadius * Math.min(scaleX, scaleY)
        : canvasHeight / 2;
    return {
        center: center,
        radius: Math.round(radius),
    };
}
/* export default */ const __rspack_default_export = (getCenterAndRadiusInCanvas);


},
51316(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (getEllipseWorldCoordinates)
});
/* import */ var gl_matrix__rspack_import_0 = __webpack_require__(40230);
/* import */ var _getViewportICamera_js__rspack_import_1 = __webpack_require__(41891);


function getEllipseWorldCoordinates(points, viewport) {
    const { viewUp, viewPlaneNormal } = (0,_getViewportICamera_js__rspack_import_1/* ["default"] */.A)(viewport);
    const viewRight = gl_matrix__rspack_import_0/* .vec3.create */.eR.vt();
    gl_matrix__rspack_import_0/* .vec3.cross */.eR.$A(viewRight, viewUp, viewPlaneNormal);
    const [centerWorld, endWorld] = points;
    const centerToEndDistance = gl_matrix__rspack_import_0/* .vec3.distance */.eR.Io(centerWorld, endWorld);
    const bottomWorld = gl_matrix__rspack_import_0/* .vec3.create */.eR.vt();
    const topWorld = gl_matrix__rspack_import_0/* .vec3.create */.eR.vt();
    const leftWorld = gl_matrix__rspack_import_0/* .vec3.create */.eR.vt();
    const rightWorld = gl_matrix__rspack_import_0/* .vec3.create */.eR.vt();
    for (let i = 0; i <= 2; i++) {
        bottomWorld[i] = centerWorld[i] - viewUp[i] * centerToEndDistance;
        topWorld[i] = centerWorld[i] + viewUp[i] * centerToEndDistance;
        leftWorld[i] = centerWorld[i] - viewRight[i] * centerToEndDistance;
        rightWorld[i] = centerWorld[i] + viewRight[i] * centerToEndDistance;
    }
    const ellipseWorldCoordinates = [
        bottomWorld,
        topWorld,
        leftWorld,
        rightWorld,
    ];
    return ellipseWorldCoordinates;
}


},
95009(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  R: () => (getSphereBoundsInfo),
  l: () => (getSphereBoundsInfoFromViewport)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var gl_matrix__rspack_import_1 = __webpack_require__(40230);
/* import */ var _boundingBox_index_js__rspack_import_2 = __webpack_require__(26111);
/* import */ var _getViewportICamera_js__rspack_import_3 = __webpack_require__(41891);




const { transformWorldToIndex } = _cornerstonejs_core__rspack_import_0.utilities;
function _getSphereBoundsInfo(circlePoints, imageData, directionVectors) {
    const [bottom, top] = circlePoints;
    const centerWorld = gl_matrix__rspack_import_1/* .vec3.fromValues */.eR.fA((bottom[0] + top[0]) / 2, (bottom[1] + top[1]) / 2, (bottom[2] + top[2]) / 2);
    const radiusWorld = gl_matrix__rspack_import_1/* .vec3.distance */.eR.Io(bottom, top) / 2;
    const { boundsIJK, topLeftWorld, bottomRightWorld } = _computeBoundsIJK(imageData, directionVectors, circlePoints, centerWorld, radiusWorld);
    return {
        boundsIJK,
        centerWorld: centerWorld,
        radiusWorld,
        topLeftWorld: topLeftWorld,
        bottomRightWorld: bottomRightWorld,
    };
}
function getSphereBoundsInfo(circlePoints, imageData) {
    const direction = imageData.getDirection();
    const rowCosine = gl_matrix__rspack_import_1/* .vec3.fromValues */.eR.fA(direction[0], direction[1], direction[2]);
    const columnCosine = gl_matrix__rspack_import_1/* .vec3.fromValues */.eR.fA(direction[3], direction[4], direction[5]);
    const scanAxis = gl_matrix__rspack_import_1/* .vec3.fromValues */.eR.fA(direction[6], direction[7], direction[8]);
    const viewPlaneNormal = gl_matrix__rspack_import_1/* .vec3.negate */.eR.ze(gl_matrix__rspack_import_1/* .vec3.create */.eR.vt(), scanAxis);
    const directionVectors = {
        row: rowCosine,
        column: columnCosine,
        normal: viewPlaneNormal,
    };
    return _getSphereBoundsInfo(circlePoints, imageData, directionVectors);
}
function getSphereBoundsInfoFromViewport(circlePoints, imageData, viewport) {
    if (!viewport) {
        throw new Error('viewport is required in order to calculate the sphere bounds');
    }
    const camera = (0,_getViewportICamera_js__rspack_import_3/* ["default"] */.A)(viewport);
    if (!camera.viewUp || !camera.viewPlaneNormal) {
        throw new Error('viewport view plane is required in order to calculate the sphere bounds');
    }
    const viewUp = gl_matrix__rspack_import_1/* .vec3.fromValues */.eR.fA(camera.viewUp[0], camera.viewUp[1], camera.viewUp[2]);
    const viewPlaneNormal = gl_matrix__rspack_import_1/* .vec3.fromValues */.eR.fA(camera.viewPlaneNormal[0], camera.viewPlaneNormal[1], camera.viewPlaneNormal[2]);
    const viewRight = gl_matrix__rspack_import_1/* .vec3.create */.eR.vt();
    gl_matrix__rspack_import_1/* .vec3.cross */.eR.$A(viewRight, viewUp, viewPlaneNormal);
    const directionVectors = {
        row: viewRight,
        normal: viewPlaneNormal,
        column: gl_matrix__rspack_import_1/* .vec3.negate */.eR.ze(gl_matrix__rspack_import_1/* .vec3.create */.eR.vt(), viewUp),
    };
    return _getSphereBoundsInfo(circlePoints, imageData, directionVectors);
}
function _computeBoundsIJK(imageData, directionVectors, circlePoints, centerWorld, radiusWorld) {
    const dimensions = imageData.getDimensions();
    const { row: rowCosine, column: columnCosine, normal: vecNormal, } = directionVectors;
    const topLeftWorld = gl_matrix__rspack_import_1/* .vec3.create */.eR.vt();
    const bottomRightWorld = gl_matrix__rspack_import_1/* .vec3.create */.eR.vt();
    gl_matrix__rspack_import_1/* .vec3.scaleAndAdd */.eR.Ln(topLeftWorld, centerWorld, vecNormal, radiusWorld);
    gl_matrix__rspack_import_1/* .vec3.scaleAndAdd */.eR.Ln(bottomRightWorld, centerWorld, vecNormal, -radiusWorld);
    gl_matrix__rspack_import_1/* .vec3.scaleAndAdd */.eR.Ln(topLeftWorld, topLeftWorld, columnCosine, -radiusWorld);
    gl_matrix__rspack_import_1/* .vec3.scaleAndAdd */.eR.Ln(bottomRightWorld, bottomRightWorld, columnCosine, radiusWorld);
    gl_matrix__rspack_import_1/* .vec3.scaleAndAdd */.eR.Ln(topLeftWorld, topLeftWorld, rowCosine, -radiusWorld);
    gl_matrix__rspack_import_1/* .vec3.scaleAndAdd */.eR.Ln(bottomRightWorld, bottomRightWorld, rowCosine, radiusWorld);
    const topLeftIJK = transformWorldToIndex(imageData, topLeftWorld);
    const bottomRightIJK = transformWorldToIndex(imageData, bottomRightWorld);
    const pointsIJK = circlePoints.map((p) => transformWorldToIndex(imageData, p));
    const boundsIJK = (0,_boundingBox_index_js__rspack_import_2.getBoundingBoxAroundShapeIJK)([topLeftIJK, bottomRightIJK, ...pointsIJK], dimensions);
    return { boundsIJK, topLeftWorld, bottomRightWorld };
}



},
7193(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (getToolsWithModesForElement)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _store_ToolGroupManager_index_js__rspack_import_1 = __webpack_require__(72314);


function getToolsWithModesForElement(element, modesFilter) {
    const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElement)(element);
    const { renderingEngineId, viewportId } = enabledElement;
    const toolGroup = (0,_store_ToolGroupManager_index_js__rspack_import_1.getToolGroupForViewport)(viewportId, renderingEngineId);
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


},
37375(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  j: () => (getVOIMultipliers)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);

const DEFAULT_MULTIPLIER = 4;
function getVOIMultipliers(viewport, volumeId, options) {
    const { modality, isPreScaled } = _cornerstonejs_core__rspack_import_0.utilities.getScalingDescriptor(viewport, volumeId) ?? {};
    if (modality === 'PT') {
        const { clientWidth, clientHeight } = viewport.element;
        const ptMultiplier = 5 / Math.max(clientWidth, clientHeight);
        const { fixedPTWindowWidth = true } = options ?? {};
        const xMultiplier = fixedPTWindowWidth ? 0 : ptMultiplier;
        return isPreScaled
            ? [xMultiplier, ptMultiplier]
            : [xMultiplier, DEFAULT_MULTIPLIER];
    }
    return [DEFAULT_MULTIPLIER, DEFAULT_MULTIPLIER];
}



},
18445(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Js: () => (beginOwnedDrag),
  Xt: () => (endOwnedDrag),
  lq: () => (isDragOwnedBy)
});
const dragOwnerByViewportId = new Map();
function beginOwnedDrag(viewportId, owner) {
    if (dragOwnerByViewportId.has(viewportId)) {
        return false;
    }
    dragOwnerByViewportId.set(viewportId, owner);
    return true;
}
function endOwnedDrag(viewportId, owner) {
    if (dragOwnerByViewportId.get(viewportId) === owner) {
        dragOwnerByViewportId.delete(viewportId);
    }
}
function isDragOwnedBy(viewportId, owner) {
    return dragOwnerByViewportId.get(viewportId) === owner;
}


},
73733(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  j: () => (LivewirePath)
});
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


},
81495(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  f: () => (/* binding */ LivewireScissors)
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(88479);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/BucketQueue.js
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

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/livewire/LivewireScissors.js


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


},
79790(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  IM: () => (clipInterval),
  Mo: () => (calculateInnerFanPercentage),
  R3: () => (intervalFromPoints),
  V0: () => (subtractIntervals),
  l7: () => (mergeIntervals),
  xA: () => (angleFromCenter)
});
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


},
90618(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  f: () => (midPoint2)
});
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
/* unused export default */ var __rspack_default_export = ((/* unused pure expression or super */ null && (midPoint)));



},
99875(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (getAABB)
});
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


},
20601(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Y: () => (isPlaneIntersectingAABB)
});
/* import */ var gl_matrix__rspack_import_0 = __webpack_require__(40230);

const isPlaneIntersectingAABB = (origin, normal, minX, minY, minZ, maxX, maxY, maxZ) => {
    const vertices = [
        gl_matrix__rspack_import_0/* .vec3.fromValues */.eR.fA(minX, minY, minZ),
        gl_matrix__rspack_import_0/* .vec3.fromValues */.eR.fA(maxX, minY, minZ),
        gl_matrix__rspack_import_0/* .vec3.fromValues */.eR.fA(minX, maxY, minZ),
        gl_matrix__rspack_import_0/* .vec3.fromValues */.eR.fA(maxX, maxY, minZ),
        gl_matrix__rspack_import_0/* .vec3.fromValues */.eR.fA(minX, minY, maxZ),
        gl_matrix__rspack_import_0/* .vec3.fromValues */.eR.fA(maxX, minY, maxZ),
        gl_matrix__rspack_import_0/* .vec3.fromValues */.eR.fA(minX, maxY, maxZ),
        gl_matrix__rspack_import_0/* .vec3.fromValues */.eR.fA(maxX, maxY, maxZ),
    ];
    const normalVec = gl_matrix__rspack_import_0/* .vec3.fromValues */.eR.fA(normal[0], normal[1], normal[2]);
    const originVec = gl_matrix__rspack_import_0/* .vec3.fromValues */.eR.fA(origin[0], origin[1], origin[2]);
    const planeDistance = -gl_matrix__rspack_import_0/* .vec3.dot */.eR.Om(normalVec, originVec);
    let initialSign = null;
    for (const vertex of vertices) {
        const distance = gl_matrix__rspack_import_0/* .vec3.dot */.eR.Om(normalVec, vertex) + planeDistance;
        if (initialSign === null) {
            initialSign = Math.sign(distance);
        }
        else if (Math.sign(distance) !== initialSign) {
            return true;
        }
    }
    return false;
};


},
952(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  d: () => (computeAndAddRepresentation)
});
/* import */ var _stateManagement_segmentation_internalAddRepresentationData_js__rspack_import_0 = __webpack_require__(14203);

async function computeAndAddRepresentation(segmentationId, type, computeFunction, onComputationComplete) {
    const data = await computeFunction();
    (0,_stateManagement_segmentation_internalAddRepresentationData_js__rspack_import_0/* ["default"] */.A)({
        segmentationId,
        type,
        data,
    });
    onComputationComplete?.();
    return data;
}



},
97637(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
function floodFill(getter, seed, options = {}) {
    const onFlood = options.onFlood;
    const onBoundary = options.onBoundary;
    const equals = options.equals;
    const filter = options.filter;
    const diagonals = options.diagonals || false;
    const startNode = get(seed);
    const permutations = prunedPermutations();
    const stack = [];
    const flooded = [];
    const visits = new Set();
    const bounds = options.bounds;
    stack.push({ currentArgs: seed });
    while (stack.length > 0) {
        flood(stack.pop());
    }
    return {
        flooded,
    };
    function flood(job) {
        const getArgs = job.currentArgs;
        const prevArgs = job.previousArgs;
        if (visited(getArgs)) {
            return;
        }
        markAsVisited(getArgs);
        if (member(getArgs)) {
            markAsFlooded(getArgs);
            pushAdjacent(getArgs);
        }
        else {
            markAsBoundary(prevArgs);
        }
    }
    function visited(key) {
        const [x, y, z = 0] = key;
        const iKey = x + 32768 + 65536 * (y + 32768 + 65536 * (z + 32768));
        return visits.has(iKey);
    }
    function markAsVisited(key) {
        const [x, y, z = 0] = key;
        const iKey = x + 32768 + 65536 * (y + 32768 + 65536 * (z + 32768));
        visits.add(iKey);
    }
    function member(getArgs) {
        const node = get(getArgs);
        return equals ? equals(node, startNode) : node === startNode;
    }
    function markAsFlooded(getArgs) {
        flooded.push(getArgs);
        if (onFlood) {
            onFlood(...getArgs);
        }
    }
    function markAsBoundary(prevArgs) {
        const [x, y, z = 0] = prevArgs;
        const iKey = x + 32768 + 65536 * (y + 32768 + 65536 * (z + 32768));
        bounds?.set(iKey, prevArgs);
        if (onBoundary) {
            onBoundary(...prevArgs);
        }
    }
    function pushAdjacent(getArgs) {
        for (let i = 0; i < permutations.length; i += 1) {
            const perm = permutations[i];
            const nextArgs = getArgs.slice(0);
            for (let j = 0; j < getArgs.length; j += 1) {
                nextArgs[j] += perm[j];
            }
            if (filter?.(nextArgs) === false) {
                continue;
            }
            if (visited(nextArgs)) {
                continue;
            }
            stack.push({
                currentArgs: nextArgs,
                previousArgs: getArgs,
            });
        }
    }
    function get(getArgs) {
        return getter(...getArgs);
    }
    function prunedPermutations() {
        const permutations = permute(seed.length);
        return permutations.filter(function (perm) {
            const count = countNonZeroes(perm);
            return count !== 0 && (count === 1 || diagonals);
        });
    }
    function permute(length) {
        const perms = [];
        const permutation = function (string) {
            return string.split('').map(function (c) {
                return parseInt(c, 10) - 1;
            });
        };
        for (let i = 0; i < Math.pow(3, length); i += 1) {
            const string = lpad(i.toString(3), '0', length);
            perms.push(permutation(string));
        }
        return perms;
    }
}
function countNonZeroes(array) {
    let count = 0;
    for (let i = 0; i < array.length; i += 1) {
        if (array[i] !== 0) {
            count += 1;
        }
    }
    return count;
}
function lpad(string, character, length) {
    const array = new Array(length + 1);
    const pad = array.join(character);
    return (pad + string).slice(-length);
}
/* export default */ const __rspack_default_export = (floodFill);


},
10621(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  x: () => (floodFill3dSliceLazy)
});
const FLOOD_SLICE_FLAG_VISITED = 1;
async function floodFill3dSliceLazy(getter, seed, options) {
    const { width: w, height: h, depth: d, equals, ensureSliceLoaded, yieldEvery = 500, planar = false, maxDeltaK, maxDeltaIJ, isCancelled, maxVoxels, shouldContinue, validateEvery = 2048, } = options;
    const [sx, sy, sz] = seed;
    if (sx < 0 || sx >= w || sy < 0 || sy >= h || sz < 0 || sz >= d) {
        return {
            sliceMasks: new Map(),
            voxelCount: 0,
            truncated: false,
            bbox: null,
        };
    }
    if (ensureSliceLoaded) {
        await ensureSliceLoaded(sz);
    }
    const startNode = getter(sx, sy, sz);
    if (!equals(startNode, startNode)) {
        return {
            sliceMasks: new Map(),
            voxelCount: 0,
            truncated: false,
            bbox: null,
        };
    }
    const frameSize = w * h;
    const sliceMasks = new Map();
    function sliceFlags(z) {
        let a = sliceMasks.get(z);
        if (!a) {
            a = new Uint8Array(frameSize);
            sliceMasks.set(z, a);
        }
        return a;
    }
    function isVisited(z, x, y) {
        const a = sliceMasks.get(z);
        if (!a) {
            return false;
        }
        return (a[y * w + x] & FLOOD_SLICE_FLAG_VISITED) !== 0;
    }
    function setVisited(z, x, y) {
        sliceFlags(z)[y * w + x] |= FLOOD_SLICE_FLAG_VISITED;
    }
    function pack(x, y, z) {
        return z * frameSize + y * w + x;
    }
    function unpack(p) {
        const x = p % w;
        const t1 = Math.floor(p / w);
        const y = t1 % h;
        const z = Math.floor(t1 / h);
        return [x, y, z];
    }
    const dirs = planar
        ? [
            [1, 0, 0],
            [-1, 0, 0],
            [0, 1, 0],
            [0, -1, 0],
        ]
        : [
            [1, 0, 0],
            [-1, 0, 0],
            [0, 1, 0],
            [0, -1, 0],
            [0, 0, 1],
            [0, 0, -1],
        ];
    const queue = [];
    let qh = 0;
    queue.push(pack(sx, sy, sz));
    setVisited(sz, sx, sy);
    let minX = sx;
    let maxX = sx;
    let minY = sy;
    let maxY = sy;
    let minZ = sz;
    let maxZ = sz;
    const currentBBox = () => ({
        min: [minX, minY, minZ],
        max: [maxX, maxY, maxZ],
    });
    let steps = 0;
    let truncated = false;
    let nextValidateAt = validateEvery;
    while (qh < queue.length) {
        if (isCancelled?.()) {
            break;
        }
        if (maxVoxels !== undefined && queue.length > maxVoxels) {
            truncated = true;
            break;
        }
        if (shouldContinue && queue.length >= nextValidateAt) {
            nextValidateAt += validateEvery;
            if (!shouldContinue({ voxelCount: queue.length, bbox: currentBBox() })) {
                truncated = true;
                break;
            }
        }
        steps++;
        if (yieldEvery > 0 && steps % yieldEvery === 0) {
            await new Promise((r) => setTimeout(r, 0));
        }
        const p = queue[qh++];
        const [x, y, z] = unpack(p);
        for (let di = 0; di < dirs.length; di++) {
            const nx = x + dirs[di][0];
            const ny = y + dirs[di][1];
            const nz = z + dirs[di][2];
            if (nx < 0 || nx >= w || ny < 0 || ny >= h || nz < 0 || nz >= d) {
                continue;
            }
            if (maxDeltaK >= 0 && Math.abs(nz - sz) > maxDeltaK) {
                continue;
            }
            if (maxDeltaIJ >= 0 &&
                (Math.abs(nx - sx) > maxDeltaIJ || Math.abs(ny - sy) > maxDeltaIJ)) {
                continue;
            }
            if (planar && nz !== sz) {
                continue;
            }
            if (isVisited(nz, nx, ny)) {
                continue;
            }
            if (ensureSliceLoaded) {
                await ensureSliceLoaded(nz);
                if (isCancelled?.()) {
                    break;
                }
            }
            const nv = getter(nx, ny, nz);
            if (!equals(nv, startNode)) {
                continue;
            }
            setVisited(nz, nx, ny);
            queue.push(pack(nx, ny, nz));
            if (nx < minX) {
                minX = nx;
            }
            else if (nx > maxX) {
                maxX = nx;
            }
            if (ny < minY) {
                minY = ny;
            }
            else if (ny > maxY) {
                maxY = ny;
            }
            if (nz < minZ) {
                minZ = nz;
            }
            else if (nz > maxZ) {
                maxZ = nz;
            }
        }
    }
    const voxelCount = queue.length;
    return {
        sliceMasks,
        voxelCount,
        truncated,
        bbox: voxelCount > 0 ? currentBBox() : null,
    };
}


},
91662(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  n: () => (getBrushToolInstances)
});
/* import */ var _store_ToolGroupManager_index_js__rspack_import_0 = __webpack_require__(72314);
/* import */ var _tools_segmentation_BrushTool_js__rspack_import_1 = __webpack_require__(70947);


function getBrushToolInstances(toolGroupId, toolName) {
    const toolGroup = (0,_store_ToolGroupManager_index_js__rspack_import_0.getToolGroup)(toolGroupId);
    if (toolGroup === undefined) {
        return [];
    }
    const toolInstances = toolGroup._toolInstances;
    if (!Object.keys(toolInstances).length) {
        return [];
    }
    if (toolName && toolInstances[toolName]) {
        return [toolInstances[toolName]];
    }
    const brushBasedToolInstances = Object.values(toolInstances).filter((toolInstance) => toolInstance instanceof _tools_segmentation_BrushTool_js__rspack_import_1/* ["default"] */.A);
    return brushBasedToolInstances;
}


},
61892(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  L: () => (getHoveredContourSegmentationAnnotation)
});
/* import */ var _stateManagement_index_js__rspack_import_0 = __webpack_require__(60567);
/* import */ var _stateManagement_segmentation_segmentationState_js__rspack_import_1 = __webpack_require__(3133);


function getHoveredContourSegmentationAnnotation(segmentationId) {
    const segmentation = (0,_stateManagement_segmentation_segmentationState_js__rspack_import_1.getSegmentation)(segmentationId);
    const { annotationUIDsMap } = segmentation.representationData.Contour;
    for (const [segmentIndex, annotationUIDs] of annotationUIDsMap.entries()) {
        const highlightedAnnotationUID = Array.from(annotationUIDs).find((annotationUID) => (0,_stateManagement_index_js__rspack_import_0/* .getAnnotation */.gw)(annotationUID).highlighted);
        if (highlightedAnnotationUID) {
            return segmentIndex;
        }
    }
    return undefined;
}


},
49132(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  T: () => (getSegmentIndexAtLabelmapBorder)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _stateManagement_segmentation_segmentationState_js__rspack_import_1 = __webpack_require__(3133);
/* import */ var _stateManagement_segmentation_helpers_index_js__rspack_import_2 = __webpack_require__(76868);
/* import */ var _stateManagement_segmentation_helpers_getViewportLabelmapRenderMode_js__rspack_import_3 = __webpack_require__(72293);
/* import */ var _stateManagement_segmentation_helpers_labelmapSegmentationState_js__rspack_import_4 = __webpack_require__(89615);





function getSegmentIndexAtLabelmapBorder(segmentationId, worldPoint, { viewport, searchRadius }) {
    const segmentation = (0,_stateManagement_segmentation_segmentationState_js__rspack_import_1.getSegmentation)(segmentationId);
    const viewportRenderMode = viewport
        ? (0,_stateManagement_segmentation_helpers_getViewportLabelmapRenderMode_js__rspack_import_3/* ["default"] */.A)(viewport)
        : 'unsupported';
    if (viewportRenderMode === 'volume' ||
        viewport instanceof _cornerstonejs_core__rspack_import_0.BaseVolumeViewport) {
        for (const layer of (0,_stateManagement_segmentation_helpers_labelmapSegmentationState_js__rspack_import_4/* .getLabelmaps */.m)(segmentation)) {
            const segmentationVolume = (0,_stateManagement_segmentation_helpers_labelmapSegmentationState_js__rspack_import_4/* .getOrCreateLabelmapVolume */.kL)(layer);
            if (!segmentationVolume) {
                continue;
            }
            const voxelManager = segmentationVolume.voxelManager;
            const imageData = segmentationVolume.imageData;
            const indexIJK = _cornerstonejs_core__rspack_import_0.utilities.transformWorldToIndex(imageData, worldPoint);
            const labelValue = voxelManager.getAtIJK(indexIJK[0], indexIJK[1], indexIJK[2]);
            const canvasPoint = viewport.worldToCanvas(worldPoint);
            const onEdge = isSegmentOnEdgeCanvas(canvasPoint, labelValue, viewport, imageData, searchRadius);
            if (onEdge && labelValue) {
                return (0,_stateManagement_segmentation_helpers_labelmapSegmentationState_js__rspack_import_4/* .getSegmentIndexForLabelValue */.Mx)(segmentation, layer.labelmapId, labelValue);
            }
        }
        return;
    }
    const segmentationImageId = (0,_stateManagement_segmentation_segmentationState_js__rspack_import_1.getCurrentLabelmapImageIdForViewport)(viewport.id, segmentationId);
    if (!segmentationImageId) {
        return;
    }
    const image = _cornerstonejs_core__rspack_import_0.cache.getImage(segmentationImageId);
    if (!image) {
        return;
    }
    const segmentationActorEntry = (0,_stateManagement_segmentation_helpers_index_js__rspack_import_2/* .getLabelmapActorEntry */.wV)(viewport.id, segmentationId, segmentationImageId);
    const imageData = segmentationActorEntry?.actor.getMapper().getInputData();
    const indexIJK = _cornerstonejs_core__rspack_import_0.utilities.transformWorldToIndex(imageData, worldPoint);
    const dimensions = imageData.getDimensions();
    const voxelManager = (imageData.voxelManager ||
        _cornerstonejs_core__rspack_import_0.utilities.VoxelManager.createScalarVolumeVoxelManager({
            dimensions,
            scalarData: imageData.getPointData().getScalars().getData(),
        }));
    const labelValue = voxelManager.getAtIJKPoint(indexIJK);
    const onEdge = isSegmentOnEdgeIJK(indexIJK, dimensions, voxelManager, labelValue);
    if (!onEdge || !labelValue) {
        return;
    }
    const layer = (0,_stateManagement_segmentation_helpers_labelmapSegmentationState_js__rspack_import_4/* .getLabelmaps */.m)(segmentation).find((candidateLayer) => candidateLayer.imageIds?.includes(segmentationImageId));
    if (!layer) {
        return labelValue;
    }
    return (0,_stateManagement_segmentation_helpers_labelmapSegmentationState_js__rspack_import_4/* .getSegmentIndexForLabelValue */.Mx)(segmentation, layer.labelmapId, labelValue);
}
function isSegmentOnEdge(getNeighborIndex, segmentIndex, searchRadius = 1) {
    const neighborRange = Array.from({ length: 2 * searchRadius + 1 }, (_, i) => i - searchRadius);
    for (const deltaI of neighborRange) {
        for (const deltaJ of neighborRange) {
            for (const deltaK of neighborRange) {
                if (deltaI === 0 && deltaJ === 0 && deltaK === 0) {
                    continue;
                }
                const neighborIndex = getNeighborIndex(deltaI, deltaJ, deltaK);
                if (neighborIndex !== undefined && segmentIndex !== neighborIndex) {
                    return true;
                }
            }
        }
    }
    return false;
}
function isSegmentOnEdgeIJK(indexIJK, dimensions, voxelManager, segmentIndex, searchRadius) {
    const getNeighborIndex = (deltaI, deltaJ, deltaK) => {
        const neighborIJK = [
            indexIJK[0] + deltaI,
            indexIJK[1] + deltaJ,
            indexIJK[2] + deltaK,
        ];
        return voxelManager.getAtIJK(neighborIJK[0], neighborIJK[1], neighborIJK[2]);
    };
    return isSegmentOnEdge(getNeighborIndex, segmentIndex, searchRadius);
}
function isSegmentOnEdgeCanvas(canvasPoint, segmentIndex, viewport, imageData, searchRadius) {
    const getNeighborIndex = (deltaI, deltaJ) => {
        const neighborCanvas = [canvasPoint[0] + deltaI, canvasPoint[1] + deltaJ];
        const worldPoint = viewport.canvasToWorld(neighborCanvas);
        const voxelManager = imageData.get('voxelManager').voxelManager;
        const indexIJK = _cornerstonejs_core__rspack_import_0.utilities.transformWorldToIndex(imageData, worldPoint);
        return voxelManager.getAtIJK(indexIJK[0], indexIJK[1], indexIJK[2]);
    };
    return isSegmentOnEdge(getNeighborIndex, segmentIndex, searchRadius);
}


},
15540(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  hX: () => (getSegmentIndexAtWorldPoint)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _enums_index_js__rspack_import_1 = __webpack_require__(53870);
/* import */ var _stateManagement_segmentation_segmentationState_js__rspack_import_2 = __webpack_require__(3133);
/* import */ var _stateManagement_index_js__rspack_import_3 = __webpack_require__(60567);
/* import */ var _math_polyline_index_js__rspack_import_4 = __webpack_require__(52546);
/* import */ var _planar_filterAnnotationsForDisplay_js__rspack_import_5 = __webpack_require__(40349);
/* import */ var _stateManagement_segmentation_helpers_getSegmentationActor_js__rspack_import_6 = __webpack_require__(47153);
/* import */ var _stateManagement_segmentation_helpers_getViewportLabelmapRenderMode_js__rspack_import_7 = __webpack_require__(72293);
/* import */ var _stateManagement_segmentation_helpers_labelmapSegmentationState_js__rspack_import_8 = __webpack_require__(89615);









function getSegmentIndexAtWorldPoint(segmentationId, worldPoint, options = {}) {
    const segmentation = (0,_stateManagement_segmentation_segmentationState_js__rspack_import_2.getSegmentation)(segmentationId);
    const representationData = segmentation.representationData;
    const desiredRepresentation = options?.representationType ?? Object.keys(representationData)[0];
    if (!desiredRepresentation) {
        throw new Error(`Segmentation ${segmentationId} does not have any representations`);
    }
    switch (desiredRepresentation) {
        case _enums_index_js__rspack_import_1.SegmentationRepresentations.Labelmap:
            return getSegmentIndexAtWorldForLabelmap(segmentation, worldPoint, options);
        case _enums_index_js__rspack_import_1.SegmentationRepresentations.Contour:
            return getSegmentIndexAtWorldForContour(segmentation, worldPoint, options);
        default:
            return;
    }
}
function getSegmentIndexAtWorldForLabelmap(segmentation, worldPoint, { viewport }) {
    const viewportRenderMode = viewport
        ? (0,_stateManagement_segmentation_helpers_getViewportLabelmapRenderMode_js__rspack_import_7/* ["default"] */.A)(viewport)
        : 'unsupported';
    if (viewportRenderMode === 'volume' ||
        viewport instanceof _cornerstonejs_core__rspack_import_0.BaseVolumeViewport) {
        for (const layer of (0,_stateManagement_segmentation_helpers_labelmapSegmentationState_js__rspack_import_8/* .getLabelmaps */.m)(segmentation)) {
            const segmentationVolume = (0,_stateManagement_segmentation_helpers_labelmapSegmentationState_js__rspack_import_8/* .getOrCreateLabelmapVolume */.kL)(layer);
            if (!segmentationVolume) {
                continue;
            }
            const voxelManager = segmentationVolume.voxelManager;
            const indexIJK = _cornerstonejs_core__rspack_import_0.utilities.transformWorldToIndex(segmentationVolume.imageData, worldPoint);
            const labelValue = voxelManager.getAtIJKPoint(indexIJK);
            if (!labelValue) {
                continue;
            }
            return (0,_stateManagement_segmentation_helpers_labelmapSegmentationState_js__rspack_import_8/* .getSegmentIndexForLabelValue */.Mx)(segmentation, layer.labelmapId, labelValue);
        }
        return;
    }
    const segmentationImageIds = (0,_stateManagement_segmentation_segmentationState_js__rspack_import_2.getCurrentLabelmapImageIdsForViewport)(viewport.id, segmentation.segmentationId);
    if (!segmentationImageIds?.length) {
        return;
    }
    for (const segmentationImageId of segmentationImageIds) {
        const image = _cornerstonejs_core__rspack_import_0.cache.getImage(segmentationImageId);
        if (!image) {
            continue;
        }
        const segmentationActorEntry = (0,_stateManagement_segmentation_helpers_getSegmentationActor_js__rspack_import_6/* .getLabelmapActorEntry */.wV)(viewport.id, segmentation.segmentationId, segmentationImageId);
        const imageData = segmentationActorEntry?.actor.getMapper().getInputData();
        const indexIJK = _cornerstonejs_core__rspack_import_0.utilities.transformWorldToIndex(imageData, worldPoint);
        const dimensions = imageData.getDimensions();
        const voxelManager = (imageData.voxelManager ||
            _cornerstonejs_core__rspack_import_0.utilities.VoxelManager.createScalarVolumeVoxelManager({
                dimensions,
                scalarData: imageData.getPointData().getScalars().getData(),
            }));
        const labelValue = voxelManager.getAtIJKPoint(indexIJK);
        if (!labelValue) {
            continue;
        }
        const layer = (0,_stateManagement_segmentation_helpers_labelmapSegmentationState_js__rspack_import_8/* .getLabelmaps */.m)(segmentation).find((candidateLayer) => candidateLayer.imageIds?.includes(segmentationImageId));
        if (!layer) {
            return labelValue;
        }
        return (0,_stateManagement_segmentation_helpers_labelmapSegmentationState_js__rspack_import_8/* .getSegmentIndexForLabelValue */.Mx)(segmentation, layer.labelmapId, labelValue);
    }
}
function getSegmentIndexAtWorldForContour(segmentation, worldPoint, { viewport }) {
    const contourData = segmentation.representationData.Contour;
    const segmentIndexByAnnotation = new Map();
    for (const [segmentIndex, annotationUIDs] of contourData.annotationUIDsMap) {
        for (const annotationUID of annotationUIDs) {
            const annotation = (0,_stateManagement_index_js__rspack_import_3/* .getAnnotation */.gw)(annotationUID);
            if (annotation) {
                segmentIndexByAnnotation.set(annotation, Number(segmentIndex));
            }
        }
    }
    const displayableAnnotations = (0,_planar_filterAnnotationsForDisplay_js__rspack_import_5/* ["default"] */.A)(viewport, Array.from(segmentIndexByAnnotation.keys()));
    for (const annotation of displayableAnnotations) {
        const { polyline } = annotation.data
            .contour;
        if ((0,_math_polyline_index_js__rspack_import_4.isPointInsidePolyline3D)(worldPoint, polyline)) {
            return segmentIndexByAnnotation.get(annotation);
        }
    }
}


},
29735() {
const POSITIVE_SEED_LABEL = 254;
const NEGATIVE_SEED_LABEL = 255;
const DEFAULT_NEIGHBORHOOD_RADIUS = 1;
const DEFAULT_POSITIVE_STD_DEV_MULTIPLIER = 1.8;
const DEFAULT_NEGATIVE_STD_DEV_MULTIPLIER = 3.2;
const DEFAULT_NEGATIVE_SEED_MARGIN = 30;
const DEFAULT_NEGATIVE_SEEDS_COUNT = 70;
const MAX_NEGATIVE_SEED_ATTEMPTS_MULTIPLIER = 50;


},
1967(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  K: () => (getViewportVoiMappingForVolume)
});
function getViewportVoiMappingForVolume(viewport, volumeId) {
    const getProps = viewport.getProperties;
    if (typeof getProps !== 'function') {
        return null;
    }
    const props = volumeId
        ? getProps.call(viewport, volumeId)
        : getProps.call(viewport);
    if (!props?.voiRange) {
        return null;
    }
    const { lower, upper } = props.voiRange;
    if (typeof lower !== 'number' || typeof upper !== 'number') {
        return null;
    }
    return {
        voiRange: { lower, upper },
        VOILUTFunction: props.VOILUTFunction,
        invert: props.invert === true,
    };
}


},
20326(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
const shader = `
const MAX_STRENGTH = 65535f;

// Workgroup size - X*Y*Z must be multiple of 32 for better performance
override workGroupSizeX = 1u;
override workGroupSizeY = 1u;
override workGroupSizeZ = 1u;

// Compare the current voxel to neighbors using a 9x9x9 window
override windowSize = 9i;

struct Params {
  size: vec3u,
  iteration: u32,
}

// New structure to track bounds of modified voxels
struct Bounds {
  minX: atomic<i32>,
  minY: atomic<i32>,
  minZ: atomic<i32>,
  maxX: atomic<i32>,
  maxY: atomic<i32>,
  maxZ: atomic<i32>,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage> volumePixelData: array<f32>;
@group(0) @binding(2) var<storage, read_write> labelmap: array<u32>;
@group(0) @binding(3) var<storage, read_write> strengthData: array<f32>;
@group(0) @binding(4) var<storage> prevLabelmap: array<u32>;
@group(0) @binding(5) var<storage> prevStrengthData: array<f32>;
@group(0) @binding(6) var<storage, read_write> updatedVoxelsCounter: array<atomic<u32>>;
@group(0) @binding(7) var<storage, read_write> modifiedBounds: Bounds;

fn getPixelIndex(ijkPos: vec3u) -> u32 {
  let numPixelsPerSlice = params.size.x * params.size.y;
  return ijkPos.x + ijkPos.y * params.size.x + ijkPos.z * numPixelsPerSlice;
}

fn updateBounds(position: vec3i) {
  // Atomically update min bounds (use min operation)
  let oldMinX = atomicMin(&modifiedBounds.minX, position.x);
  let oldMinY = atomicMin(&modifiedBounds.minY, position.y);
  let oldMinZ = atomicMin(&modifiedBounds.minZ, position.z);

  // Atomically update max bounds (use max operation)
  let oldMaxX = atomicMax(&modifiedBounds.maxX, position.x);
  let oldMaxY = atomicMax(&modifiedBounds.maxY, position.y);
  let oldMaxZ = atomicMax(&modifiedBounds.maxZ, position.z);
}

@compute @workgroup_size(workGroupSizeX, workGroupSizeY, workGroupSizeZ)
fn main(
  @builtin(global_invocation_id) globalId: vec3u,
) {
  // Make sure it will not get out of bounds for volume with sizes that
  // are not multiple of workGroupSize
  if (
    globalId.x >= params.size.x ||
    globalId.y >= params.size.y ||
    globalId.z >= params.size.z
  ) {
    return;
  }

  // Initialize bounds for the first iteration
  if (params.iteration == 0 && globalId.x == 0 && globalId.y == 0 && globalId.z == 0) {
    // Initialize to opposite extremes to ensure any update will improve the bounds
    atomicStore(&modifiedBounds.minX, i32(params.size.x));
    atomicStore(&modifiedBounds.minY, i32(params.size.y));
    atomicStore(&modifiedBounds.minZ, i32(params.size.z));
    atomicStore(&modifiedBounds.maxX, -1);
    atomicStore(&modifiedBounds.maxY, -1);
    atomicStore(&modifiedBounds.maxZ, -1);
  }

  let currentCoord = vec3i(globalId);
  let currentPixelIndex = getPixelIndex(globalId);

  let numPixels = arrayLength(&volumePixelData);
  let currentPixelValue = volumePixelData[currentPixelIndex];

  if (params.iteration == 0) {
    // All non-zero initial labels are given maximum strength
    strengthData[currentPixelIndex] = select(MAX_STRENGTH, 0., labelmap[currentPixelIndex] == 0);

    // Update bounds for non-zero initial labels
    if (labelmap[currentPixelIndex] != 0) {
      updateBounds(currentCoord);
    }
    return;
  }

  // It should at least copy the values from previous state
  var newLabel = prevLabelmap[currentPixelIndex];
  var newStrength = prevStrengthData[currentPixelIndex];

  let window = i32(ceil(f32(windowSize - 1) * .5));
  let minWindow = -1i * window;
  let maxWindow = 1i * window;

  for (var k = minWindow; k <= maxWindow; k++) {
    for (var j = minWindow; j <= maxWindow; j++) {
      for (var i = minWindow; i <= maxWindow; i++) {
        // Skip current voxel
        if (i == 0 && j == 0 && k == 0) {
          continue;
        }

        let neighborCoord = currentCoord + vec3i(i, j, k);

        //  Boundary conditions. Do not grow outside of the volume
        if (
          neighborCoord.x < 0i || neighborCoord.x >= i32(params.size.x) ||
          neighborCoord.y < 0i || neighborCoord.y >= i32(params.size.y) ||
          neighborCoord.z < 0i || neighborCoord.z >= i32(params.size.z)
        ) {
          continue;
        }

        let neighborIndex = getPixelIndex(vec3u(neighborCoord));
        let neighborPixelValue = volumePixelData[neighborIndex];
        let prevNeighborStrength = prevStrengthData[neighborIndex];
        let strengthCost = abs(neighborPixelValue - currentPixelValue);
        let takeoverStrength = prevNeighborStrength - strengthCost;

        if (takeoverStrength > newStrength) {
          newLabel = prevLabelmap[neighborIndex];
          newStrength = takeoverStrength;
        }
      }
    }
  }

  if (labelmap[currentPixelIndex] != newLabel) {
    atomicAdd(&updatedVoxelsCounter[params.iteration], 1u);

    // Update bounds for modified voxels
    updateBounds(currentCoord);
  }

  labelmap[currentPixelIndex] = newLabel;
  strengthData[currentPixelIndex] = newStrength;
}
`;
/* export default */ const __rspack_default_export = (shader);


},
81537(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  CN: () => (resolveAdaptiveBandAtTolerance),
  Ti: () => (probeAdaptiveRegion)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _getViewportVoiMappingForVolume_js__rspack_import_1 = __webpack_require__(1967);
/* import */ var _constants_js__rspack_import_2 = __webpack_require__(29735);



const { transformWorldToIndex, mapScalarToViewportVoiIntensity, mapViewportVoiIntensityToScalar, getVolumeDirectionVectors, } = _cornerstonejs_core__rspack_import_0.utilities;
const { growCutLog: log } = _cornerstonejs_core__rspack_import_0.utilities.logger;
const WINDOW_RADIUS_PX = 96;
const SEED_SNAP_RADIUS_PX = 4;
const MIN_REGION_PX = 6;
const MIN_REGION_MM2 = 8;
const MAX_REGION_WINDOW_FRACTION = 0.6;
const FLAT_CONTRAST_BYTES = 10;
const MIN_TOLERANCE_BYTES = 2;
const MIN_PLATEAU_WIDTH_BYTES = 4;
const QUIET_GAIN_ABS_PX = 3;
const QUIET_GAIN_FRACTION = 0.02;
function medianOf(values) {
    if (!values.length) {
        return 0;
    }
    const sorted = values.slice().sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
}
function rawBandForTolerance(context, toleranceBytes) {
    const { seedByte, polarity, voiMapping, rawWindow, seedScalar } = context;
    const thresholdByte = Math.max(0, Math.min(255, polarity > 0 ? seedByte - toleranceBytes : seedByte + toleranceBytes));
    const includedExtremeByte = polarity > 0 ? 255 : 0;
    const rawFromByte = (byte) => voiMapping
        ? mapViewportVoiIntensityToScalar(byte / 255, voiMapping)
        : rawWindow.min + (byte / 255) * rawWindow.span;
    const rawThreshold = rawFromByte(thresholdByte);
    const rawExtreme = rawFromByte(includedExtremeByte);
    let min;
    let max;
    if (rawExtreme >= rawThreshold) {
        min = rawThreshold;
        max = Infinity;
    }
    else {
        min = -Infinity;
        max = rawThreshold;
    }
    if (Number.isFinite(seedScalar)) {
        min = Math.min(min, seedScalar);
        max = Math.max(max, seedScalar);
    }
    return { min, max };
}
function resolveAdaptiveBandAtTolerance(context, toleranceBytes) {
    const tolerance = Math.max(0, Math.min(255, Math.round(toleranceBytes)));
    const { min, max } = rawBandForTolerance(context, tolerance);
    return {
        min,
        max,
        ijkStart: [...context.seedIjk],
        diagnostics: {
            neighborhoodMean: Number.isFinite(context.seedScalar)
                ? context.seedScalar
                : 0,
            neighborhoodStdDev: 0,
            clickedVoxelValue: Number.isFinite(context.seedScalar)
                ? context.seedScalar
                : 0,
            positiveStdDevMultiplier: 1,
            neighborhoodRadius: SEED_SNAP_RADIUS_PX,
            strategy: 'adaptiveRegion:atTolerance',
            adaptive: {
                toleranceBytes: tolerance,
                regionSizePx: -1,
                backgroundByte: -1,
                seedByte: context.seedByte,
                seedSnapped: false,
                windowSize: [0, 0],
                polarity: context.polarity,
            },
        },
    };
}
function probeAdaptiveRegionCore(input) {
    const { dimensions, getScalar, ijkClick, voiMapping } = input;
    const inPlaneAxes = input.inPlaneAxes ?? [0, 1];
    const inPlaneSpacing = input.inPlaneSpacing ?? [1, 1];
    for (let axis = 0; axis < 3; axis++) {
        if (ijkClick[axis] < 0 || ijkClick[axis] >= dimensions[axis]) {
            return { viable: false, reason: 'outside-volume', range: null };
        }
    }
    const [axisA, axisB] = inPlaneAxes;
    const a0 = Math.max(0, ijkClick[axisA] - WINDOW_RADIUS_PX);
    const a1 = Math.min(dimensions[axisA] - 1, ijkClick[axisA] + WINDOW_RADIUS_PX);
    const b0 = Math.max(0, ijkClick[axisB] - WINDOW_RADIUS_PX);
    const b1 = Math.min(dimensions[axisB] - 1, ijkClick[axisB] + WINDOW_RADIUS_PX);
    const wA = a1 - a0 + 1;
    const wB = b1 - b0 + 1;
    const windowArea = wA * wB;
    const spacingA = Number.isFinite(inPlaneSpacing[0]) && inPlaneSpacing[0] > 0
        ? inPlaneSpacing[0]
        : 1;
    const spacingB = Number.isFinite(inPlaneSpacing[1]) && inPlaneSpacing[1] > 0
        ? inPlaneSpacing[1]
        : 1;
    const pxAreaMm2 = spacingA * spacingB;
    const minRegionPx = Math.max(MIN_REGION_PX, Math.ceil(MIN_REGION_MM2 / pxAreaMm2));
    const maxRegionPx = Math.max(minRegionPx + 1, Math.floor(windowArea * MAX_REGION_WINDOW_FRACTION));
    const scalarAt = (x, y) => {
        const ijk = [...ijkClick];
        ijk[axisA] = a0 + x;
        ijk[axisB] = b0 + y;
        return Number(getScalar(ijk[0], ijk[1], ijk[2]));
    };
    const rawValues = new Float64Array(windowArea);
    let rawMinInWindow = Infinity;
    let rawMaxInWindow = -Infinity;
    for (let y = 0; y < wB; y++) {
        for (let x = 0; x < wA; x++) {
            const v = scalarAt(x, y);
            rawValues[y * wA + x] = v;
            if (Number.isFinite(v)) {
                if (v < rawMinInWindow) {
                    rawMinInWindow = v;
                }
                if (v > rawMaxInWindow) {
                    rawMaxInWindow = v;
                }
            }
        }
    }
    if (!Number.isFinite(rawMinInWindow)) {
        return { viable: false, reason: 'outside-volume', range: null };
    }
    const rawSpan = rawMaxInWindow - rawMinInWindow || 1;
    const bytes = new Int16Array(windowArea);
    for (let idx = 0; idx < windowArea; idx++) {
        const v = rawValues[idx];
        if (!Number.isFinite(v)) {
            bytes[idx] = -1;
            continue;
        }
        const mapped = voiMapping
            ? mapScalarToViewportVoiIntensity(v, voiMapping)
            : (v - rawMinInWindow) / rawSpan;
        bytes[idx] = Math.max(0, Math.min(255, Math.round(mapped * 255)));
    }
    const ringBytes = [];
    for (let x = 0; x < wA; x++) {
        if (bytes[x] >= 0) {
            ringBytes.push(bytes[x]);
        }
        const bottom = (wB - 1) * wA + x;
        if (wB > 1 && bytes[bottom] >= 0) {
            ringBytes.push(bytes[bottom]);
        }
    }
    for (let y = 1; y < wB - 1; y++) {
        const left = y * wA;
        const right = y * wA + (wA - 1);
        if (bytes[left] >= 0) {
            ringBytes.push(bytes[left]);
        }
        if (wA > 1 && bytes[right] >= 0) {
            ringBytes.push(bytes[right]);
        }
    }
    const backgroundByte = medianOf(ringBytes);
    const clickX = ijkClick[axisA] - a0;
    const clickY = ijkClick[axisB] - b0;
    let seedX = clickX;
    let seedY = clickY;
    let bestContrast = -1;
    let bestDist = Infinity;
    const snapR2 = SEED_SNAP_RADIUS_PX * SEED_SNAP_RADIUS_PX;
    for (let dy = -SEED_SNAP_RADIUS_PX; dy <= SEED_SNAP_RADIUS_PX; dy++) {
        for (let dx = -SEED_SNAP_RADIUS_PX; dx <= SEED_SNAP_RADIUS_PX; dx++) {
            if (dx * dx + dy * dy > snapR2) {
                continue;
            }
            const x = clickX + dx;
            const y = clickY + dy;
            if (x < 0 || x >= wA || y < 0 || y >= wB) {
                continue;
            }
            const byte = bytes[y * wA + x];
            if (byte < 0) {
                continue;
            }
            const contrast = Math.abs(byte - backgroundByte);
            const dist = dx * dx + dy * dy;
            if (contrast > bestContrast ||
                (contrast === bestContrast && dist < bestDist)) {
                bestContrast = contrast;
                bestDist = dist;
                seedX = x;
                seedY = y;
            }
        }
    }
    if (bestContrast < 0) {
        return { viable: false, reason: 'outside-volume', range: null };
    }
    if (bestContrast < FLAT_CONTRAST_BYTES) {
        return { viable: false, reason: 'flat-region', range: null };
    }
    const seedPixelByte = bytes[seedY * wA + seedX];
    const polarity = seedPixelByte >= backgroundByte ? 1 : -1;
    const elevation = (byte) => polarity > 0 ? byte : 255 - byte;
    const seedNeighborhood = [];
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            const x = seedX + dx;
            const y = seedY + dy;
            if (x < 0 || x >= wA || y < 0 || y >= wB) {
                continue;
            }
            const byte = bytes[y * wA + x];
            if (byte >= 0 &&
                Math.abs(byte - seedPixelByte) <= Math.abs(byte - backgroundByte)) {
                seedNeighborhood.push(byte);
            }
        }
    }
    const v0 = seedNeighborhood.length
        ? medianOf(seedNeighborhood)
        : seedPixelByte;
    const h0 = elevation(v0);
    const cost = (idx) => {
        const byte = bytes[idx];
        if (byte < 0) {
            return -1;
        }
        return Math.max(0, h0 - elevation(byte));
    };
    const buckets = new Array(256);
    const pushToBucket = (level, idx) => {
        let bucket = buckets[level];
        if (!bucket) {
            bucket = [];
            buckets[level] = bucket;
        }
        bucket.push(idx);
    };
    const visited = new Uint8Array(windowArea);
    const seedIdx = seedY * wA + seedX;
    const seedCost = cost(seedIdx);
    if (seedCost < 0) {
        return { viable: false, reason: 'flat-region', range: null };
    }
    pushToBucket(seedCost, seedIdx);
    visited[seedIdx] = 1;
    const curve = [];
    const clickIdx = clickY * wA + clickX;
    let clickJoinLevel = -1;
    const neighborOffsets = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ];
    const clickNeighborJoinLevels = [];
    const neighborWatch = new Map();
    neighborOffsets.forEach(([dx, dy], slot) => {
        const x = clickX + dx;
        const y = clickY + dy;
        if (x < 0 || x >= wA || y < 0 || y >= wB) {
            clickNeighborJoinLevels.push(null);
            return;
        }
        clickNeighborJoinLevels.push(-1);
        neighborWatch.set(y * wA + x, slot);
    });
    let size = 0;
    let borderTouchLevel = -1;
    let explosionLevel = -1;
    outer: for (let level = 0; level < 256; level++) {
        const bucket = buckets[level];
        if (bucket?.length) {
            for (let bi = 0; bi < bucket.length; bi++) {
                const idx = bucket[bi];
                if (visited[idx] === 2) {
                    continue;
                }
                visited[idx] = 2;
                size++;
                if (idx === clickIdx) {
                    clickJoinLevel = level;
                }
                const watchSlot = neighborWatch.get(idx);
                if (watchSlot !== undefined) {
                    clickNeighborJoinLevels[watchSlot] = level;
                }
                const x = idx % wA;
                const y = Math.floor(idx / wA);
                if (borderTouchLevel < 0 &&
                    (x === 0 || x === wA - 1 || y === 0 || y === wB - 1)) {
                    borderTouchLevel = level;
                }
                if (size > maxRegionPx) {
                    explosionLevel = level;
                    break outer;
                }
                const neighbors = [idx - 1, idx + 1, idx - wA, idx + wA];
                const canLeft = x > 0;
                const canRight = x < wA - 1;
                const canUp = y > 0;
                const canDown = y < wB - 1;
                const allowed = [canLeft, canRight, canUp, canDown];
                for (let n = 0; n < 4; n++) {
                    if (!allowed[n]) {
                        continue;
                    }
                    const nIdx = neighbors[n];
                    if (visited[nIdx] !== 0) {
                        continue;
                    }
                    const nCost = cost(nIdx);
                    if (nCost < 0) {
                        continue;
                    }
                    visited[nIdx] = 1;
                    pushToBucket(Math.max(level, nCost), nIdx);
                }
            }
            bucket.length = 0;
        }
        const lastSize = curve.length ? curve[curve.length - 1].size : 0;
        if (size > lastSize) {
            curve.push({ level, size });
        }
    }
    const growthEndLevel = explosionLevel >= 0 ? explosionLevel - 1 : 255;
    const runs = [];
    {
        let runStart = -1;
        let currentSize = 0;
        let ci = 0;
        const closeRun = (endLevel, sizeAtEnd) => {
            if (runStart >= 0 && endLevel >= runStart) {
                runs.push({
                    startLevel: runStart,
                    endLevel,
                    width: endLevel - runStart,
                    size: sizeAtEnd,
                });
            }
            runStart = -1;
        };
        for (let level = 0; level <= growthEndLevel; level++) {
            const sizeBefore = currentSize;
            let gain = 0;
            if (ci < curve.length && curve[ci].level === level) {
                gain = curve[ci].size - currentSize;
                currentSize = curve[ci].size;
                ci++;
            }
            const quietThreshold = Math.max(QUIET_GAIN_ABS_PX, Math.floor(sizeBefore * QUIET_GAIN_FRACTION));
            if (currentSize > 0 && gain <= quietThreshold) {
                if (runStart < 0) {
                    runStart = level;
                }
            }
            else {
                closeRun(level - 1, sizeBefore);
            }
        }
        closeRun(growthEndLevel, currentSize);
    }
    let best = null;
    for (const run of runs) {
        const endLevel = borderTouchLevel >= 0
            ? Math.min(run.endLevel, borderTouchLevel - 1)
            : run.endLevel;
        if (endLevel < run.startLevel) {
            continue;
        }
        const clipped = {
            ...run,
            endLevel,
            width: endLevel - run.startLevel,
        };
        if (clipped.size < minRegionPx || clipped.size > maxRegionPx) {
            continue;
        }
        if (!best || clipped.width > best.width) {
            best = clipped;
        }
    }
    const selectionDebug = () => ({
        growthCurve: curve.map((p) => [p.level, p.size]),
        quietRuns: runs.map((run) => [
            run.startLevel,
            run.endLevel,
            run.size,
        ]),
        seedByte: v0,
        backgroundByte,
        polarity,
        borderTouchLevel,
        explosionLevel,
        clickJoinLevel,
        minRegionPx,
        maxRegionPx,
        pxAreaMm2,
    });
    if (!best || best.width < MIN_PLATEAU_WIDTH_BYTES) {
        const stableButSmall = runs.find((run) => run.size < minRegionPx &&
            run.width >= MIN_PLATEAU_WIDTH_BYTES &&
            (borderTouchLevel < 0 || run.startLevel < borderTouchLevel));
        const failSize = best?.size ?? stableButSmall?.size ?? size;
        return {
            viable: false,
            reason: stableButSmall ? 'too-small' : 'unbounded',
            range: null,
            regionSizePx: failSize,
            regionAreaMm2: failSize * pxAreaMm2,
            debug: selectionDebug(),
        };
    }
    let toleranceBytes = best.startLevel + Math.floor(best.width / 2);
    toleranceBytes = Math.min(Math.max(toleranceBytes, MIN_TOLERANCE_BYTES), best.endLevel);
    const toleranceScale = input.toleranceScale && input.toleranceScale > 0 ? input.toleranceScale : 1;
    toleranceBytes = Math.max(1, Math.min(255, Math.round(toleranceBytes * toleranceScale)));
    const chosen = best;
    if (clickJoinLevel < 0 || clickJoinLevel > toleranceBytes) {
        return {
            viable: false,
            reason: 'off-target',
            range: null,
            regionSizePx: chosen.size,
            regionAreaMm2: chosen.size * pxAreaMm2,
            debug: selectionDebug(),
        };
    }
    const seedIjk = [...ijkClick];
    seedIjk[axisA] = a0 + seedX;
    seedIjk[axisB] = b0 + seedY;
    const seedScalar = rawValues[seedIdx];
    const clickedScalar = rawValues[clickY * wA + clickX];
    const expandContext = {
        seedByte: v0,
        polarity,
        voiMapping: voiMapping ?? null,
        rawWindow: { min: rawMinInWindow, span: rawSpan },
        seedIjk,
        seedScalar: Number.isFinite(seedScalar) ? seedScalar : 0,
        growthCurve: curve.map((p) => [p.level, p.size]),
        chosenToleranceBytes: toleranceBytes,
        growthEndLevel,
        pxAreaMm2,
    };
    const { min: rawLo, max: rawHi } = rawBandForTolerance(expandContext, toleranceBytes);
    return {
        viable: true,
        reason: 'ok',
        regionSizePx: chosen.size,
        regionAreaMm2: chosen.size * pxAreaMm2,
        toleranceBytes,
        clickNeighborJoinLevels,
        expandContext,
        range: {
            min: rawLo,
            max: rawHi,
            ijkStart: seedIjk,
            diagnostics: {
                neighborhoodMean: Number.isFinite(seedScalar) ? seedScalar : 0,
                neighborhoodStdDev: 0,
                clickedVoxelValue: Number.isFinite(clickedScalar) ? clickedScalar : 0,
                positiveStdDevMultiplier: toleranceScale,
                neighborhoodRadius: SEED_SNAP_RADIUS_PX,
                strategy: 'adaptiveRegion',
                adaptive: {
                    toleranceBytes,
                    regionSizePx: chosen.size,
                    regionAreaMm2: chosen.size * pxAreaMm2,
                    backgroundByte,
                    seedByte: v0,
                    polarity,
                    seedSnapped: seedX !== clickX || seedY !== clickY,
                    windowSize: [wA, wB],
                    growthCurve: curve.map((p) => [p.level, p.size]),
                    explosionLevel,
                    borderTouchLevel,
                },
            },
        },
    };
}
function resolveInPlaneAxes(referencedVolume, viewport) {
    if (!viewport) {
        return [0, 1];
    }
    try {
        const camera = viewport.getCamera();
        const { ijkVecSliceDir } = getVolumeDirectionVectors(referencedVolume.imageData, camera);
        const abs = ijkVecSliceDir.map(Math.abs);
        let sliceAxis = 0;
        if (abs[1] >= abs[0] && abs[1] >= abs[2]) {
            sliceAxis = 1;
        }
        else if (abs[2] >= abs[0] && abs[2] >= abs[1]) {
            sliceAxis = 2;
        }
        const axes = [0, 1, 2].filter((axis) => axis !== sliceAxis);
        return [axes[0], axes[1]];
    }
    catch {
        return [0, 1];
    }
}
function probeAdaptiveRegion(referencedVolume, worldPosition, options) {
    const { dimensions, imageData, spacing } = referencedVolume;
    const voxelManager = referencedVolume.voxelManager;
    const [width, height] = dimensions;
    const pixelsPerSlice = width * height;
    const ijkClick = transformWorldToIndex(imageData, worldPosition).map(Math.round);
    const voiMapping = options?.voiMapping ??
        (options?.viewport && options?.referencedVolumeId
            ? (0,_getViewportVoiMappingForVolume_js__rspack_import_1/* .getViewportVoiMappingForVolume */.K)(options.viewport, options.referencedVolumeId)
            : null);
    const toleranceScale = options?.positiveStdDevMultiplier
        ? options.positiveStdDevMultiplier / (/* inlined export .DEFAULT_POSITIVE_STD_DEV_MULTIPLIER */1.8)
        : 1;
    const inPlaneAxes = resolveInPlaneAxes(referencedVolume, options?.viewport);
    const inPlaneSpacing = [
        spacing?.[inPlaneAxes[0]] ?? 1,
        spacing?.[inPlaneAxes[1]] ?? 1,
    ];
    const result = probeAdaptiveRegionCore({
        dimensions,
        getScalar: (i, j, k) => Number(voxelManager.getAtIndex(k * pixelsPerSlice + j * width + i)),
        ijkClick,
        inPlaneAxes,
        inPlaneSpacing,
        voiMapping,
        toleranceScale,
    });
    log.debug('adaptiveRegion probe', {
        ijkClick,
        viable: result.viable,
        reason: result.reason,
        regionSizePx: result.regionSizePx,
        regionAreaMm2: result.regionAreaMm2,
        toleranceBytes: result.toleranceBytes,
        band: result.range
            ? { min: result.range.min, max: result.range.max }
            : null,
    });
    return result;
}
const getAdaptiveRegionIntensityRange = (referencedVolume, worldPosition, options) => {
    const probe = probeAdaptiveRegion(referencedVolume, worldPosition, options);
    if (!probe.viable) {
        log.info('adaptiveRegion: no proper region at click', {
            reason: probe.reason,
            regionSizePx: probe.regionSizePx,
            regionAreaMm2: probe.regionAreaMm2,
            debug: probe.debug,
        });
        return null;
    }
    return probe.range;
};


},
55600(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  ZC: () => (/* binding */ runFloodFillSegmentation)
});

// UNUSED EXPORTS: default, getDisplayVoiSnapshot, getPositiveIntensityRange, getPositiveIntensityRangeRaw, getPositiveIntensityRangeVoiMapped

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(88479);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/islandRemoval.js
var segmentation_islandRemoval = __webpack_require__(29827);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/floodFillIslandRemoval.js


const { logger } = esm.utilities;
const { growCutLog: islandRemovalLog } = logger;

class FloodFillIslandRemoval extends segmentation_islandRemoval/* ["default"] */.A {
    constructor(options) {
        super(options);
        this.verboseLogging = false;
        this.usingPreviewLayer = false;
        this.internalFilledPoints = [];
        this.verboseLogging = options?.verboseLogging ?? this.verboseLogging;
    }
    initialize(viewport, segmentationVoxels, options) {
        this.usingPreviewLayer = !!segmentationVoxels.sourceVoxelManager;
        const initialized = super.initialize(viewport, segmentationVoxels, options);
        if (initialized && this.verboseLogging) {
            const { segmentSet } = this;
            islandRemovalLog.info('islandRemoval: initialize', {
                segmentIndex: this.segmentIndex,
                previewSegmentIndex: this.previewSegmentIndex,
                segmentSetDimensions: {
                    width: segmentSet.width,
                    height: segmentSet.height,
                    depth: segmentSet.depth,
                },
                boundsIJKPrime: segmentSet.normalizer.boundsIJKPrime,
                clickedPoints: this.selectedPoints,
                segmentVoxelsInPlaneGrid: FloodFillIslandRemoval.countRleValueVolume(segmentSet, segmentation_islandRemoval/* .SegmentationEnum.SEGMENT */.a.SEGMENT),
            });
        }
        return initialized;
    }
    static countRleValueVolume(segmentSet, value) {
        let n = 0;
        segmentSet.forEach((_baseIndex, rle) => {
            if (rle.value === value) {
                n += rle.end - rle.start;
            }
        });
        return n;
    }
    floodFillSegmentIsland() {
        if (this.verboseLogging) {
            const { selectedPoints, segmentSet } = this;
            const { fromIJK } = segmentSet.normalizer;
            for (const clickedPoint of selectedPoints) {
                const ijkPrime = fromIJK(clickedPoint);
                const atClick = segmentSet.get(segmentSet.toIndex(ijkPrime));
                if (atClick !== segmentation_islandRemoval/* .SegmentationEnum.SEGMENT */.a.SEGMENT) {
                    islandRemovalLog.info('islandRemoval: floodFillSegmentIsland click skipped (not SEGMENT)', {
                        clickedPointVolumeIJK: clickedPoint,
                        ijkPrime,
                        segmentSetAtIndex: atClick,
                    });
                }
            }
        }
        const floodedCount = super.floodFillSegmentIsland();
        if (this.verboseLogging) {
            islandRemovalLog.info('islandRemoval: floodFillSegmentIsland done', {
                totalIslandVoxels: floodedCount,
                islandVoxelsAfterFlood: FloodFillIslandRemoval.countRleValueVolume(this.segmentSet, segmentation_islandRemoval/* .SegmentationEnum.ISLAND */.a.ISLAND),
            });
        }
        return floodedCount;
    }
    removeExternalIslands() {
        const { previewVoxelManager, segmentSet } = this;
        const { toIJK } = segmentSet.normalizer;
        const sourceVoxelManager = previewVoxelManager.sourceVoxelManager ?? previewVoxelManager;
        if (!this.usingPreviewLayer) {
            islandRemovalLog.warn('islandRemoval: removeExternalIslands has no preview layer; ' +
                'external island cleanup of accepted voxels is skipped. ' +
                'Run island removal through a preview layer to clear external islands.');
            return 0;
        }
        let clearedVoxels = 0;
        const callback = (index, rle) => {
            const [, jPrime, kPrime] = segmentSet.toIJK(index);
            if (rle.value !== segmentation_islandRemoval/* .SegmentationEnum.ISLAND */.a.ISLAND) {
                for (let iPrime = rle.start; iPrime < rle.end; iPrime++) {
                    const clearPoint = toIJK([iPrime, jPrime, kPrime]);
                    const sourceVal = sourceVoxelManager.getAtIJKPoint(clearPoint);
                    if (sourceVal === this.previewSegmentIndex) {
                        previewVoxelManager.setAtIJKPoint(clearPoint, null);
                        clearedVoxels += 1;
                    }
                }
            }
        };
        segmentSet.forEach(callback, { rowModified: true });
        if (this.verboseLogging) {
            islandRemovalLog.info('islandRemoval: removeExternalIslands', {
                clearedVoxels,
            });
        }
        return clearedVoxels;
    }
    removeInternalIslands() {
        this.internalFilledPoints = [];
        const modifiedSlices = super.removeInternalIslands();
        if (this.verboseLogging) {
            islandRemovalLog.info('islandRemoval: removeInternalIslands', {
                modifiedSliceCount: modifiedSlices?.length,
                internalFilledPoints: this.internalFilledPoints.length,
                maxInternalRemove: this.maxInternalRemove,
            });
        }
        return modifiedSlices;
    }
    onInternalPointFilled(point) {
        this.internalFilledPoints.push(point);
    }
    getInternalFilledPoints() {
        return this.internalFilledPoints;
    }
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/floodFillSliceLazy.js
var floodFillSliceLazy = __webpack_require__(10621);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/commitSliceMasksToLabelmap.js


const { VoxelManager } = esm.utilities;
function commitSliceMasksToLabelmapVolume({ labelmapVolume, sliceMasks, width: w, height: h, paintIndex, historyVoxelManager, }) {
    const floodedPoints = [];
    let voxelCount = 0;
    const vm = labelmapVolume.voxelManager;
    const historyWriter = historyVoxelManager;
    const [labelmapWidth, labelmapHeight, depth] = labelmapVolume.dimensions;
    if (labelmapWidth !== w || labelmapHeight !== h) {
        throw new Error(`commitSliceMasksToLabelmapVolume: labelmap in-plane dimensions ` +
            `${labelmapWidth}x${labelmapHeight} do not match mask dimensions ${w}x${h}`);
    }
    const frameSize = w * h;
    const expectedLen = frameSize * depth;
    const zs = Array.from(sliceMasks.keys()).sort((a, b) => a - b);
    for (let zi = 0; zi < zs.length; zi++) {
        const z = zs[zi];
        if (z < 0 || z >= depth) {
            continue;
        }
        const flags = sliceMasks.get(z);
        if (!flags || flags.length !== frameSize) {
            continue;
        }
        let sliceTouched = false;
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        const appendRunFlooded = (y, x0, x1) => {
            for (let xi = x0; xi < x1; xi++) {
                floodedPoints.push([xi, y, z]);
            }
            voxelCount += x1 - x0;
            sliceTouched = true;
            minX = Math.min(minX, x0);
            maxX = Math.max(maxX, x1 - 1);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        };
        const denseScalar = !historyWriter &&
            vm.scalarData &&
            vm.scalarData.length >= expectedLen &&
            typeof vm.scalarData.fill === 'function';
        if (denseScalar) {
            const base = z * frameSize;
            const data = vm.scalarData;
            for (let y = 0; y < h; y++) {
                const row = y * w;
                for (let x = 0; x < w;) {
                    const li = row + x;
                    if (!(flags[li] & (/* inlined export .FLOOD_SLICE_FLAG_VISITED */1))) {
                        x++;
                        continue;
                    }
                    const x0 = x;
                    while (x < w && flags[row + x] & (/* inlined export .FLOOD_SLICE_FLAG_VISITED */1)) {
                        x++;
                    }
                    data.fill(paintIndex, base + row + x0, base + row + x);
                    appendRunFlooded(y, x0, x);
                }
            }
        }
        else {
            const imageIds = labelmapVolume.imageIds;
            const image = imageIds?.length && z < imageIds.length
                ? esm.cache.getImage(imageIds[z])
                : null;
            const svm = image?.voxelManager;
            if (!historyWriter &&
                svm?.scalarData &&
                svm.scalarData.length >= frameSize &&
                typeof svm.scalarData.fill === 'function') {
                const data = svm.scalarData;
                for (let y = 0; y < h; y++) {
                    const row = y * w;
                    for (let x = 0; x < w;) {
                        const li = row + x;
                        if (!(flags[li] & (/* inlined export .FLOOD_SLICE_FLAG_VISITED */1))) {
                            x++;
                            continue;
                        }
                        const x0 = x;
                        while (x < w && flags[row + x] & (/* inlined export .FLOOD_SLICE_FLAG_VISITED */1)) {
                            x++;
                        }
                        data.fill(paintIndex, row + x0, row + x);
                        appendRunFlooded(y, x0, x);
                    }
                }
                svm.modifiedSlices.add(z);
            }
            else {
                const writer = historyWriter ?? vm;
                for (let y = 0; y < h; y++) {
                    const row = y * w;
                    for (let x = 0; x < w; x++) {
                        if (!(flags[row + x] & (/* inlined export .FLOOD_SLICE_FLAG_VISITED */1))) {
                            continue;
                        }
                        const index = z * frameSize + row + x;
                        writer.setAtIndex(index, paintIndex);
                        floodedPoints.push([x, y, z]);
                        voxelCount++;
                        sliceTouched = true;
                        minX = Math.min(minX, x);
                        maxX = Math.max(maxX, x);
                        minY = Math.min(minY, y);
                        maxY = Math.max(maxY, y);
                    }
                }
            }
        }
        if (sliceTouched) {
            vm.modifiedSlices.add(z);
            if (Number.isFinite(minX) &&
                Number.isFinite(minY) &&
                Number.isFinite(maxX) &&
                Number.isFinite(maxY)) {
                VoxelManager.addBounds(vm.boundsIJK, [minX, minY, z]);
                VoxelManager.addBounds(vm.boundsIJK, [maxX, maxY, z]);
            }
        }
    }
    return { floodedPoints, voxelCount };
}

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/createEnsureSliceLoadedForVolume.js

function createEnsureSliceLoadedForVolume(volume) {
    const numSlices = volume.dimensions[2];
    const imageIds = volume.imageIds;
    if (!imageIds?.length) {
        return async () => undefined;
    }
    const loadedSlices = new Set();
    const inFlight = new Map();
    return async function ensureSliceLoaded(z) {
        if (!Number.isFinite(z) || z < 0 || z >= numSlices) {
            return;
        }
        if (loadedSlices.has(z)) {
            return;
        }
        const existing = inFlight.get(z);
        if (existing) {
            return existing;
        }
        const imageId = imageIds[z];
        if (!imageId) {
            return;
        }
        const promise = esm.imageLoader.loadImage(imageId)
            .then(() => {
            loadedSlices.add(z);
        })
            .finally(() => {
            inFlight.delete(z);
        });
        inFlight.set(z, promise);
        return promise;
    };
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/growCut/constants.js
var constants = __webpack_require__(29735);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/growCut/neighborhoodStats.js
function calculateNeighborhoodStatsVM(voxelManager, dimensions, centerIjk, radius, mapValue) {
    const [width, height, numSlices] = dimensions;
    let sum = 0;
    let sumSq = 0;
    let count = 0;
    const [cx, cy, cz] = centerIjk.map(Math.round);
    for (let z = cz - radius; z <= cz + radius; z++) {
        if (z < 0 || z >= numSlices) {
            continue;
        }
        for (let y = cy - radius; y <= cy + radius; y++) {
            if (y < 0 || y >= height) {
                continue;
            }
            for (let x = cx - radius; x <= cx + radius; x++) {
                if (x < 0 || x >= width) {
                    continue;
                }
                const raw = Number(voxelManager.getAtIJK(x, y, z));
                const value = mapValue ? mapValue(raw) : raw;
                sum += value;
                sumSq += value * value;
                count++;
            }
        }
    }
    if (count === 0) {
        if (cx >= 0 &&
            cx < width &&
            cy >= 0 &&
            cy < height &&
            cz >= 0 &&
            cz < numSlices) {
            const raw = Number(voxelManager.getAtIJK(cx, cy, cz));
            const centerValue = mapValue ? mapValue(raw) : raw;
            return { mean: centerValue, stdDev: 0, count: 1 };
        }
        return { mean: 0, stdDev: 0, count: 0 };
    }
    const mean = sum / count;
    const variance = sumSq / count - mean * mean;
    const stdDev = Math.sqrt(Math.max(0, variance));
    return { mean, stdDev, count };
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/growCut/getViewportVoiMappingForVolume.js
var getViewportVoiMappingForVolume = __webpack_require__(1967);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/growCut/runFloodFillSegmentation.js








const { transformWorldToIndex, mapScalarToViewportVoiIntensity, mapMappedBandToRawRange, } = esm.utilities;
const { growCutLog: log } = esm.utilities.logger;
const ENABLE_VERBOSE_FLOOD_FILL_LOGS = false;
const timeStart = (label) => {
    if (ENABLE_VERBOSE_FLOOD_FILL_LOGS) {
        console.time(label);
    }
};
const timeEnd = (label) => {
    if (ENABLE_VERBOSE_FLOOD_FILL_LOGS) {
        console.timeEnd(label);
    }
};
const FLOOD_FILL_PREP_TIMING_LABEL = 'cornerstone.tools: floodFill: prep';
const FLOOD_FILL_PREP_REF_META = 'cornerstone.tools: floodFill: prep: ref_volume_meta';
const FLOOD_FILL_RANGE_TIMING_LABEL = 'cornerstone.tools: floodFill: intensityRange';
const FLOOD_FILL_RUN_TIMING_LABEL = 'cornerstone.tools: floodFill: fillAndIslandRemoval';
const FLOOD_FILL_ISLAND_EXTERNAL_TIMING_LABEL = 'cornerstone.tools: floodFill: islandRemoval:external';
const FLOOD_FILL_ISLAND_INTERNAL_TIMING_LABEL = 'cornerstone.tools: floodFill: islandRemoval:internal';
function getDisplayVoiSnapshot(viewport, referencedVolumeId) {
    const getProps = viewport.getProperties;
    if (typeof getProps !== 'function') {
        return null;
    }
    const props = referencedVolumeId
        ? getProps.call(viewport, referencedVolumeId)
        : getProps.call(viewport);
    const voiRange = props?.voiRange;
    if (!voiRange ||
        typeof voiRange.lower !== 'number' ||
        typeof voiRange.upper !== 'number') {
        return null;
    }
    const { lower, upper } = voiRange;
    return {
        lower,
        upper,
        windowWidth: upper - lower,
        windowCenter: (lower + upper) / 2,
    };
}
function getPositiveIntensityRangeRaw(referencedVolume, worldPosition, options) {
    const { dimensions, imageData: refImageData } = referencedVolume;
    const [width, height, numSlices] = dimensions;
    const referenceVolumeVoxelManager = referencedVolume.voxelManager;
    const neighborhoodRadius = options?.initialNeighborhoodRadius ?? (/* inlined export .DEFAULT_NEIGHBORHOOD_RADIUS */1);
    const positiveK = options?.positiveStdDevMultiplier ?? (/* inlined export .DEFAULT_POSITIVE_STD_DEV_MULTIPLIER */1.8);
    const ijkStart = transformWorldToIndex(refImageData, worldPosition).map(Math.round);
    if (ijkStart[0] < 0 ||
        ijkStart[0] >= width ||
        ijkStart[1] < 0 ||
        ijkStart[1] >= height ||
        ijkStart[2] < 0 ||
        ijkStart[2] >= numSlices) {
        log.warn('intensity range: click outside volume', {
            ijkStart,
            dimensions: [width, height, numSlices],
        });
        return null;
    }
    const initialStats = calculateNeighborhoodStatsVM(referenceVolumeVoxelManager, dimensions, ijkStart, neighborhoodRadius);
    if (initialStats.count === 0) {
        const seedScalar = Number(referenceVolumeVoxelManager.getAtIJKPoint(ijkStart));
        initialStats.mean = seedScalar;
        initialStats.stdDev = 0;
    }
    const min = initialStats.mean - positiveK * initialStats.stdDev;
    const max = initialStats.mean + positiveK * initialStats.stdDev;
    const startValue = referenceVolumeVoxelManager.getAtIJKPoint(ijkStart);
    if (startValue < min || startValue > max) {
        log.warn('intensity range: clicked voxel intensity is outside the calculated positive range');
        return null;
    }
    return {
        min,
        max,
        ijkStart,
        diagnostics: {
            neighborhoodMean: initialStats.mean,
            neighborhoodStdDev: initialStats.stdDev,
            clickedVoxelValue: startValue,
            positiveStdDevMultiplier: positiveK,
            neighborhoodRadius,
            strategy: 'meanStdRaw',
        },
    };
}
function getPositiveIntensityRangeVoiMapped(referencedVolume, worldPosition, voiMapping, options) {
    const { dimensions, imageData: refImageData } = referencedVolume;
    const [width, height, numSlices] = dimensions;
    const referenceVolumeVoxelManager = referencedVolume.voxelManager;
    const neighborhoodRadius = options?.initialNeighborhoodRadius ?? (/* inlined export .DEFAULT_NEIGHBORHOOD_RADIUS */1);
    const positiveK = options?.positiveStdDevMultiplier ?? (/* inlined export .DEFAULT_POSITIVE_STD_DEV_MULTIPLIER */1.8);
    const ijkStart = transformWorldToIndex(refImageData, worldPosition).map(Math.round);
    if (ijkStart[0] < 0 ||
        ijkStart[0] >= width ||
        ijkStart[1] < 0 ||
        ijkStart[1] >= height ||
        ijkStart[2] < 0 ||
        ijkStart[2] >= numSlices) {
        log.info('intensity range (VOI-mapped): click outside volume', {
            ijkStart,
            dimensions: [width, height, numSlices],
        });
        return null;
    }
    const mapFn = (v) => mapScalarToViewportVoiIntensity(v, voiMapping);
    const initialStats = calculateNeighborhoodStatsVM(referenceVolumeVoxelManager, dimensions, ijkStart, neighborhoodRadius, mapFn);
    if (initialStats.count === 0) {
        const seedScalar = Number(referenceVolumeVoxelManager.getAtIJKPoint(ijkStart));
        initialStats.mean = mapFn(seedScalar);
        initialStats.stdDev = 0;
    }
    let yMin = initialStats.mean - positiveK * initialStats.stdDev;
    let yMax = initialStats.mean + positiveK * initialStats.stdDev;
    yMin = Math.max(0, Math.min(1, yMin));
    yMax = Math.max(0, Math.min(1, yMax));
    if (yMin > yMax) {
        const t = yMin;
        yMin = yMax;
        yMax = t;
    }
    const { rawMin, rawMax } = mapMappedBandToRawRange(yMin, yMax, voiMapping);
    const startValue = Number(referenceVolumeVoxelManager.getAtIJKPoint(ijkStart));
    const bandLo = Math.min(rawMin, rawMax);
    const bandHi = Math.max(rawMin, rawMax);
    const min = Math.min(bandLo, startValue);
    const max = Math.max(bandHi, startValue);
    return {
        min,
        max,
        ijkStart,
        diagnostics: {
            neighborhoodMean: initialStats.mean,
            neighborhoodStdDev: initialStats.stdDev,
            clickedVoxelValue: startValue,
            positiveStdDevMultiplier: positiveK,
            neighborhoodRadius,
            strategy: 'meanStdVoiMapped',
            mappedBand: { min: yMin, max: yMax },
        },
    };
}
function getPositiveIntensityRange(referencedVolume, worldPosition, options) {
    if (options?.voiMapping) {
        return getPositiveIntensityRangeVoiMapped(referencedVolume, worldPosition, options.voiMapping, options);
    }
    return getPositiveIntensityRangeRaw(referencedVolume, worldPosition, options);
}
function resolveIntensityRange(referencedVolume, worldPosition, viewport, referencedVolumeId, options, rangeContext) {
    if (options.getIntensityRange) {
        const fromGetter = options.getIntensityRange(referencedVolume, worldPosition, rangeContext);
        if (!fromGetter) {
            log.warn('flood fill intensity range: strategy/custom getIntensityRange returned null (e.g. missing canvasPoint/VOI for canvas-disk, click outside volume, or fixed-% rejection)', { referencedVolumeId, worldPosition });
        }
        return fromGetter;
    }
    const voiFromViewport = (0,getViewportVoiMappingForVolume/* .getViewportVoiMappingForVolume */.K)(viewport, referencedVolumeId);
    const merged = {
        ...rangeContext,
        voiMapping: voiFromViewport ?? undefined,
    };
    let result = getPositiveIntensityRange(referencedVolume, worldPosition, merged);
    if (!result && merged.voiMapping) {
        log.info('flood fill intensity range: VOI-mapped mean±σ failed; falling back to raw mean±σ', { referencedVolumeId });
        result = getPositiveIntensityRange(referencedVolume, worldPosition, {
            ...merged,
            voiMapping: undefined,
        });
    }
    if (!result) {
        log.warn('flood fill intensity range: default mean±σ (VOI + raw fallback) could not resolve a band', { referencedVolumeId, worldPosition });
    }
    return result;
}
function assertFloodFillLabelmapMatchesRef(referencedVolume, labelmapVolume) {
    const [rw, rh, rd] = referencedVolume.dimensions;
    const [lw, lh, ld] = labelmapVolume.dimensions;
    if (rw !== lw || rh !== lh || rd !== ld) {
        throw new Error(`runFloodFillSegmentation: labelmap dimensions [${lw},${lh},${ld}] must match referenced volume [${rw},${rh},${rd}]`);
    }
}
function resolveFloodPaintIndices(segmentIndex, explicitPreview) {
    if (explicitPreview !== undefined) {
        return {
            paintIndex: explicitPreview,
            usePreview: explicitPreview !== segmentIndex,
        };
    }
    if (segmentIndex === 255) {
        return { paintIndex: 255, usePreview: false };
    }
    return { paintIndex: 255, usePreview: true };
}
function promotePreviewSegmentToFinal(readVoxelManager, writeVoxelManager, preview, final, points, numPixelsPerSlice, width) {
    for (let i = 0; i < points.length; i++) {
        const [x, y, z] = points[i];
        const index = z * numPixelsPerSlice + y * width + x;
        if (readVoxelManager.getAtIndex(index) === preview) {
            writeVoxelManager.setAtIndex(index, final);
        }
    }
}
async function runFloodFillSegmentation({ referencedVolumeId, worldPosition, viewport, labelmapVolume, options = {}, }) {
    timeStart(FLOOD_FILL_PREP_TIMING_LABEL);
    const referencedVolume = esm.cache.getVolume(referencedVolumeId);
    assertFloodFillLabelmapMatchesRef(referencedVolume, labelmapVolume);
    const labelmap = labelmapVolume;
    const segmentIndex = options.segmentIndex ?? 1;
    const { paintIndex, usePreview } = resolveFloodPaintIndices(segmentIndex, options.floodPreviewSegmentIndex);
    timeStart(FLOOD_FILL_PREP_REF_META);
    const [volMin, volMax] = referencedVolume.voxelManager.getRange();
    const displayVoi = getDisplayVoiSnapshot(viewport, referencedVolumeId);
    log.info('segmentation path: flood fill (floodfill_full)', {
        referencedVolumeId,
        volumeScalarRange: { min: volMin, max: volMax },
        displayVoi,
        floodPreview: usePreview ? paintIndex : null,
        segmentIndex,
    });
    timeEnd(FLOOD_FILL_PREP_REF_META);
    timeEnd(FLOOD_FILL_PREP_TIMING_LABEL);
    const voiMapping = (0,getViewportVoiMappingForVolume/* .getViewportVoiMappingForVolume */.K)(viewport, referencedVolumeId);
    const rangeContext = {
        positiveStdDevMultiplier: options.positiveStdDevMultiplier,
        initialNeighborhoodRadius: options.initialNeighborhoodRadius,
        viewport,
        element: options.element,
        referencedVolumeId,
        canvasPoint: options.canvasPoint,
        canvasDiskRadiusPx: options.intensitySamplingDiskRadiusCanvasPx,
        voiMapping: voiMapping ?? undefined,
    };
    timeStart(FLOOD_FILL_RANGE_TIMING_LABEL);
    const rangeResult = resolveIntensityRange(referencedVolume, worldPosition, viewport, referencedVolumeId, options, rangeContext);
    timeEnd(FLOOD_FILL_RANGE_TIMING_LABEL);
    if (!rangeResult) {
        log.warn('flood fill: aborted before fill (no intensity range)', {
            referencedVolumeId,
            worldPosition,
        });
        return null;
    }
    const { min: rangeMin, max: rangeMax, ijkStart, diagnostics } = rangeResult;
    let clampedRangeMin = rangeMin;
    let clampedRangeMax = rangeMax;
    const MAX_WL_BAND_FRACTION = 0.2;
    if (voiMapping && diagnostics?.mappedBand) {
        const mapped = diagnostics.mappedBand;
        const mappedLo = Math.max(0, Math.min(1, Math.min(mapped.min, mapped.max)));
        const mappedHi = Math.max(0, Math.min(1, Math.max(mapped.min, mapped.max)));
        const mappedWidth = mappedHi - mappedLo;
        if (mappedWidth > MAX_WL_BAND_FRACTION) {
            const seedScalarPreClamp = Number(referencedVolume.voxelManager.getAtIJKPoint(ijkStart));
            const seedMapped = Math.max(0, Math.min(1, mapScalarToViewportVoiIntensity(seedScalarPreClamp, voiMapping)));
            const half = MAX_WL_BAND_FRACTION / 2;
            const clippedMappedLo = Math.max(0, seedMapped - half);
            const clippedMappedHi = Math.min(1, seedMapped + half);
            const { rawMin: clipRawMin, rawMax: clipRawMax } = mapMappedBandToRawRange(clippedMappedLo, clippedMappedHi, voiMapping);
            clampedRangeMin = Math.min(clipRawMin, clipRawMax, seedScalarPreClamp);
            clampedRangeMax = Math.max(clipRawMin, clipRawMax, seedScalarPreClamp);
            log.info('flood fill: clipped wide WL band around seed', {
                maxWlBandFraction: MAX_WL_BAND_FRACTION,
                originalMappedBand: {
                    min: mappedLo,
                    max: mappedHi,
                    width: mappedWidth,
                },
                clippedMappedBand: {
                    min: clippedMappedLo,
                    max: clippedMappedHi,
                    width: clippedMappedHi - clippedMappedLo,
                },
            });
        }
    }
    log.info('intensity tolerance band', {
        toleranceMin: clampedRangeMin,
        toleranceMax: clampedRangeMax,
        width: clampedRangeMax - clampedRangeMin,
        ...diagnostics,
    });
    if (ENABLE_VERBOSE_FLOOD_FILL_LOGS) {
        console.info('[cornerstone-tools] flood fill intensity range', {
            rawMin: clampedRangeMin,
            rawMax: clampedRangeMax,
            strategy: diagnostics.strategy,
            mappedBand: diagnostics.mappedBand,
            neighborhoodRadius: diagnostics.neighborhoodRadius,
        });
    }
    timeStart(FLOOD_FILL_RUN_TIMING_LABEL);
    try {
        const { dimensions } = referencedVolume;
        const [width, height, numSlices] = dimensions;
        const refVoxelManager = referencedVolume.voxelManager;
        const numPixelsPerSlice = width * height;
        const labelmapReadVm = labelmap.voxelManager;
        const labelmapWriteVm = (options.historyVoxelManager ??
            labelmap.voxelManager);
        let positiveMin = clampedRangeMin;
        let positiveMax = clampedRangeMax;
        const seedScalar = Number(refVoxelManager.getAtIJKPoint(ijkStart));
        if (Number.isFinite(seedScalar)) {
            if (seedScalar < positiveMin) {
                log.info('flood fill: expanded tolerance min to include seed voxel', {
                    seedScalar,
                    previousMin: positiveMin,
                });
                positiveMin = seedScalar;
            }
            if (seedScalar > positiveMax) {
                log.info('flood fill: expanded tolerance max to include seed voxel', {
                    seedScalar,
                    previousMax: positiveMax,
                });
                positiveMax = seedScalar;
            }
        }
        if (ENABLE_VERBOSE_FLOOD_FILL_LOGS) {
            console.info('[cornerstone-tools] flood fill seed + effective tolerance', {
                seedScalar,
                effectiveMin: positiveMin,
                effectiveMax: positiveMax,
            });
        }
        const intensityGetter = (x, y, z) => {
            if (x < 0 ||
                x >= width ||
                y < 0 ||
                y >= height ||
                z < 0 ||
                z >= numSlices) {
                return undefined;
            }
            const idx = z * numPixelsPerSlice + y * width + x;
            return refVoxelManager.getAtIndex(idx);
        };
        const inRange = (val) => val >= positiveMin && val <= positiveMax;
        const ensureSliceLoaded = options.ensureSliceLoaded ??
            createEnsureSliceLoadedForVolume(referencedVolume);
        const planar = options.planar === true;
        if (planar) {
            log.info('flood fill: planar mode (fixed slice index k)', { ijkStart });
        }
        const { sliceMasks, voxelCount: filledVoxelCount, truncated, bbox, } = await (0,floodFillSliceLazy/* .floodFill3dSliceLazy */.x)(intensityGetter, ijkStart, {
            width,
            height,
            depth: numSlices,
            equals: (val, _startVal) => val !== undefined && typeof val === 'number' && inRange(val),
            ensureSliceLoaded,
            yieldEvery: options.yieldEvery ?? 500,
            planar,
            maxDeltaK: options.maxDeltaK,
            maxDeltaIJ: options.maxDeltaIJ,
            isCancelled: options.isCancelled,
            maxVoxels: options.maxVoxels,
            shouldContinue: options.shouldContinueRegion,
        });
        const finalShapeRejected = !truncated &&
            bbox &&
            options.shouldContinueRegion &&
            !options.shouldContinueRegion({ voxelCount: filledVoxelCount, bbox });
        if (truncated || finalShapeRejected) {
            log.warn('flood fill: rejected — region stopped by budget or shape gate; nothing committed', {
                maxVoxels: options.maxVoxels,
                voxelCountAtStop: filledVoxelCount,
                bbox,
                ijkStart,
            });
            options.onRejected?.({ voxelCount: filledVoxelCount, bbox });
            return null;
        }
        if (filledVoxelCount === 0) {
            log.info('flood fill: zero voxels (range may be too tight or seed isolated)', {
                ijkStart,
                toleranceMin: positiveMin,
                toleranceMax: positiveMax,
            });
            return labelmap;
        }
        if (options.isCancelled?.() === true) {
            log.info('flood fill: cancellation requested; nothing committed', {
                ijkStart,
                voxelCountAtCancel: filledVoxelCount,
            });
            return null;
        }
        const { floodedPoints, voxelCount: committedVoxels } = commitSliceMasksToLabelmapVolume({
            labelmapVolume: labelmap,
            sliceMasks,
            width,
            height,
            paintIndex,
            historyVoxelManager: options.historyVoxelManager,
        });
        if (committedVoxels === 0 || floodedPoints.length === 0) {
            log.warn('flood fill: commit produced no labelmap voxels', {
                filledVoxelCount,
                committedVoxels,
                ijkStart,
            });
            return labelmap;
        }
        let committedPoints = floodedPoints;
        log.info('flood fill: complete', {
            voxelCount: floodedPoints.length,
            ijkStart,
            paintIndex,
            usePreview,
        });
        const applyExternal = options.applyExternalIslandRemoval !== false;
        const applyInternal = options.applyInternalIslandRemoval !== false && applyExternal;
        if (!applyExternal && !applyInternal) {
            if (usePreview) {
                promotePreviewSegmentToFinal(labelmapReadVm, labelmapWriteVm, paintIndex, segmentIndex, floodedPoints, numPixelsPerSlice, width);
            }
            options.onCommitted?.(committedPoints);
            return labelmap;
        }
        const islandVerbose = options.islandRemovalVerboseLogging === true;
        const islandRemoval = new FloodFillIslandRemoval({
            maxInternalRemove: options.maxInternalRemove ?? 128,
            fillInternalEdge: false,
            verboseLogging: islandVerbose,
        });
        const ijkPoints = [ijkStart];
        const initialized = islandRemoval.initialize(viewport, options.historyVoxelManager ?? labelmap.voxelManager, {
            points: ijkPoints,
            segmentIndex,
            previewSegmentIndex: usePreview ? paintIndex : segmentIndex,
        });
        if (!initialized) {
            log.warn('island removal: initialize failed', { segmentIndex, ijkStart });
            if (usePreview) {
                promotePreviewSegmentToFinal(labelmapReadVm, labelmapWriteVm, paintIndex, segmentIndex, floodedPoints, numPixelsPerSlice, width);
            }
            options.onCommitted?.(committedPoints);
            return labelmap;
        }
        let islandFloodVoxels = 0;
        let externalClearedVoxels = 0;
        let internalSliceCount;
        if (applyExternal) {
            timeStart(FLOOD_FILL_ISLAND_EXTERNAL_TIMING_LABEL);
            islandFloodVoxels = islandRemoval.floodFillSegmentIsland();
            externalClearedVoxels = islandRemoval.removeExternalIslands();
            timeEnd(FLOOD_FILL_ISLAND_EXTERNAL_TIMING_LABEL);
            if (applyInternal) {
                timeStart(FLOOD_FILL_ISLAND_INTERNAL_TIMING_LABEL);
                const modifiedSlices = islandRemoval.removeInternalIslands();
                internalSliceCount = modifiedSlices?.length;
                timeEnd(FLOOD_FILL_ISLAND_INTERNAL_TIMING_LABEL);
            }
        }
        log.info('island removal: complete', {
            segmentIndex,
            applyExternalIslandRemoval: applyExternal,
            applyInternalIslandRemoval: applyInternal,
            floodedPointsBeforeIsland: floodedPoints.length,
            islandFloodVoxelsFromSegmentSet: islandFloodVoxels,
            externalIslandClearVoxels: externalClearedVoxels,
            internalRemovalModifiedSlices: internalSliceCount,
            islandRemovalVerboseLogging: islandVerbose,
        });
        const internalFilledPoints = applyInternal
            ? islandRemoval.getInternalFilledPoints()
            : [];
        committedPoints =
            internalFilledPoints.length > 0
                ? floodedPoints.concat(internalFilledPoints)
                : floodedPoints;
        if (usePreview) {
            promotePreviewSegmentToFinal(labelmapReadVm, labelmapWriteVm, paintIndex, segmentIndex, committedPoints, numPixelsPerSlice, width);
        }
        options.onCommitted?.(committedPoints);
        if (ENABLE_VERBOSE_FLOOD_FILL_LOGS && floodedPoints.length > 0) {
            let finalSegmentCount = 0;
            let previewCount = 0;
            let zeroCount = 0;
            let otherCount = 0;
            for (let i = 0; i < floodedPoints.length; i++) {
                const [x, y, z] = floodedPoints[i];
                const index = z * numPixelsPerSlice + y * width + x;
                const value = Number(labelmap.voxelManager.getAtIndex(index) ?? 0);
                if (value === segmentIndex) {
                    finalSegmentCount += 1;
                }
                else if (value === paintIndex) {
                    previewCount += 1;
                }
                else if (value === 0) {
                    zeroCount += 1;
                }
                else {
                    otherCount += 1;
                }
            }
            console.info('[cornerstone-tools] flood fill final voxel check', {
                floodedPoints: floodedPoints.length,
                segmentIndex,
                paintIndex,
                usePreview,
                finalSegmentCount,
                previewCount,
                zeroCount,
                otherCount,
            });
        }
        return labelmap;
    }
    finally {
        timeEnd(FLOOD_FILL_RUN_TIMING_LABEL);
    }
}



},
14386(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  e: () => (runGrowCut)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _growCutShader_js__rspack_import_1 = __webpack_require__(20326);


const GB = 1024 * 1024 * 1024;
const WEBGPU_MEMORY_LIMIT = 1.99 * GB;
const DEFAULT_GROWCUT_OPTIONS = {
    windowSize: 3,
    maxProcessingTime: 30000,
    inspection: {
        numCyclesInterval: 5,
        numCyclesBelowThreshold: 3,
        threshold: 1e-4,
    },
};
async function runGrowCut(referenceVolumeId, labelmapVolumeId, options = DEFAULT_GROWCUT_OPTIONS) {
    const workGroupSize = [8, 8, 4];
    const { windowSize, maxProcessingTime } = Object.assign({}, DEFAULT_GROWCUT_OPTIONS, options);
    const inspection = Object.assign({}, DEFAULT_GROWCUT_OPTIONS.inspection, options.inspection);
    const volume = _cornerstonejs_core__rspack_import_0.cache.getVolume(referenceVolumeId);
    const labelmap = _cornerstonejs_core__rspack_import_0.cache.getVolume(labelmapVolumeId);
    const [columns, rows, numSlices] = volume.dimensions;
    if (labelmap.dimensions[0] !== columns ||
        labelmap.dimensions[1] !== rows ||
        labelmap.dimensions[2] !== numSlices) {
        throw new Error('Volume and labelmap must have the same size');
    }
    let numIterations = Math.floor(Math.sqrt(rows ** 2 + columns ** 2 + numSlices ** 2) / 2);
    numIterations = Math.min(numIterations, 500);
    const labelmapData = labelmap.voxelManager.getCompleteScalarDataArray();
    let volumePixelData = volume.voxelManager.getCompleteScalarDataArray();
    if (!(volumePixelData instanceof Float32Array)) {
        volumePixelData = new Float32Array(volumePixelData);
    }
    const requiredLimits = {
        maxStorageBufferBindingSize: WEBGPU_MEMORY_LIMIT,
        maxBufferSize: WEBGPU_MEMORY_LIMIT,
    };
    const adapter = await navigator.gpu?.requestAdapter();
    const device = await adapter.requestDevice({ requiredLimits });
    const BUFFER_SIZE = volumePixelData.byteLength;
    const UPDATED_VOXELS_COUNTER_BUFFER_SIZE = numIterations * Uint32Array.BYTES_PER_ELEMENT;
    const BOUNDS_BUFFER_SIZE = 6 * Int32Array.BYTES_PER_ELEMENT;
    const shaderModule = device.createShaderModule({
        code: _growCutShader_js__rspack_import_1/* ["default"] */.A,
    });
    const numIterationIndex = 3;
    const paramsArrayValues = new Uint32Array([
        columns,
        rows,
        numSlices,
        0,
    ]);
    const gpuParamsBuffer = device.createBuffer({
        size: paramsArrayValues.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const gpuVolumePixelDataBuffer = device.createBuffer({
        size: BUFFER_SIZE,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(gpuVolumePixelDataBuffer, 0, volumePixelData);
    const gpuLabelmapBuffers = [0, 1].map(() => device.createBuffer({
        size: BUFFER_SIZE,
        usage: GPUBufferUsage.STORAGE |
            GPUBufferUsage.COPY_SRC |
            GPUBufferUsage.COPY_DST,
    }));
    device.queue.writeBuffer(gpuLabelmapBuffers[0], 0, new Uint32Array(labelmapData));
    const gpuStrengthBuffers = [0, 1].map(() => {
        const strengthBuffer = device.createBuffer({
            size: BUFFER_SIZE,
            usage: GPUBufferUsage.STORAGE |
                GPUBufferUsage.COPY_SRC |
                GPUBufferUsage.COPY_DST,
        });
        return strengthBuffer;
    });
    const gpuCounterBuffer = device.createBuffer({
        size: UPDATED_VOXELS_COUNTER_BUFFER_SIZE,
        usage: GPUBufferUsage.STORAGE |
            GPUBufferUsage.COPY_SRC |
            GPUBufferUsage.COPY_DST,
    });
    const gpuBoundsBuffer = device.createBuffer({
        size: BOUNDS_BUFFER_SIZE,
        usage: GPUBufferUsage.STORAGE |
            GPUBufferUsage.COPY_SRC |
            GPUBufferUsage.COPY_DST,
    });
    const initialBounds = new Int32Array([
        columns,
        rows,
        numSlices,
        -1,
        -1,
        -1,
    ]);
    device.queue.writeBuffer(gpuBoundsBuffer, 0, initialBounds);
    const bindGroupLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.COMPUTE,
                buffer: {
                    type: 'uniform',
                },
            },
            {
                binding: 1,
                visibility: GPUShaderStage.COMPUTE,
                buffer: {
                    type: 'read-only-storage',
                },
            },
            {
                binding: 2,
                visibility: GPUShaderStage.COMPUTE,
                buffer: {
                    type: 'storage',
                },
            },
            {
                binding: 3,
                visibility: GPUShaderStage.COMPUTE,
                buffer: {
                    type: 'storage',
                },
            },
            {
                binding: 4,
                visibility: GPUShaderStage.COMPUTE,
                buffer: {
                    type: 'read-only-storage',
                },
            },
            {
                binding: 5,
                visibility: GPUShaderStage.COMPUTE,
                buffer: {
                    type: 'read-only-storage',
                },
            },
            {
                binding: 6,
                visibility: GPUShaderStage.COMPUTE,
                buffer: {
                    type: 'storage',
                },
            },
            {
                binding: 7,
                visibility: GPUShaderStage.COMPUTE,
                buffer: {
                    type: 'storage',
                },
            },
        ],
    });
    const bindGroups = [0, 1].map((i) => {
        const outputLabelmapBuffer = gpuLabelmapBuffers[i];
        const outputStrengthBuffer = gpuStrengthBuffers[i];
        const previouLabelmapBuffer = gpuLabelmapBuffers[(i + 1) % 2];
        const previousStrengthBuffer = gpuStrengthBuffers[(i + 1) % 2];
        return device.createBindGroup({
            layout: bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: gpuParamsBuffer,
                    },
                },
                {
                    binding: 1,
                    resource: {
                        buffer: gpuVolumePixelDataBuffer,
                    },
                },
                {
                    binding: 2,
                    resource: {
                        buffer: outputLabelmapBuffer,
                    },
                },
                {
                    binding: 3,
                    resource: {
                        buffer: outputStrengthBuffer,
                    },
                },
                {
                    binding: 4,
                    resource: {
                        buffer: previouLabelmapBuffer,
                    },
                },
                {
                    binding: 5,
                    resource: {
                        buffer: previousStrengthBuffer,
                    },
                },
                {
                    binding: 6,
                    resource: {
                        buffer: gpuCounterBuffer,
                    },
                },
                {
                    binding: 7,
                    resource: {
                        buffer: gpuBoundsBuffer,
                    },
                },
            ],
        });
    });
    const pipeline = device.createComputePipeline({
        layout: device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout],
        }),
        compute: {
            module: shaderModule,
            entryPoint: 'main',
            constants: {
                workGroupSizeX: workGroupSize[0],
                workGroupSizeY: workGroupSize[1],
                workGroupSizeZ: workGroupSize[2],
                windowSize,
            },
        },
    });
    const numWorkGroups = [
        Math.ceil(columns / workGroupSize[0]),
        Math.ceil(rows / workGroupSize[1]),
        Math.ceil(numSlices / workGroupSize[2]),
    ];
    const gpuUpdatedVoxelsCounterStagingBuffer = device.createBuffer({
        size: UPDATED_VOXELS_COUNTER_BUFFER_SIZE,
        usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
    });
    const limitProcessingTime = maxProcessingTime
        ? performance.now() + maxProcessingTime
        : 0;
    let currentInspectionNumCyclesInterval = inspection.numCyclesInterval;
    let belowThresholdCounter = 0;
    for (let i = 0; i < numIterations; i++) {
        paramsArrayValues[numIterationIndex] = i;
        device.queue.writeBuffer(gpuParamsBuffer, 0, paramsArrayValues);
        const commandEncoder = device.createCommandEncoder();
        const passEncoder = commandEncoder.beginComputePass();
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroups[i % 2]);
        passEncoder.dispatchWorkgroups(numWorkGroups[0], numWorkGroups[1], numWorkGroups[2]);
        passEncoder.end();
        commandEncoder.copyBufferToBuffer(gpuCounterBuffer, i * Uint32Array.BYTES_PER_ELEMENT, gpuUpdatedVoxelsCounterStagingBuffer, i * Uint32Array.BYTES_PER_ELEMENT, Uint32Array.BYTES_PER_ELEMENT);
        device.queue.submit([commandEncoder.finish()]);
        const inspect = i > 0 && !(i % currentInspectionNumCyclesInterval);
        if (inspect) {
            await gpuUpdatedVoxelsCounterStagingBuffer.mapAsync(GPUMapMode.READ, 0, UPDATED_VOXELS_COUNTER_BUFFER_SIZE);
            const updatedVoxelsCounterResultBuffer = gpuUpdatedVoxelsCounterStagingBuffer.getMappedRange(0, UPDATED_VOXELS_COUNTER_BUFFER_SIZE);
            const updatedVoxelsCounterBufferData = new Uint32Array(updatedVoxelsCounterResultBuffer.slice(0));
            const updatedVoxelsRatio = updatedVoxelsCounterBufferData[i] / volumePixelData.length;
            gpuUpdatedVoxelsCounterStagingBuffer.unmap();
            if (i >= 1 && updatedVoxelsRatio < inspection.threshold) {
                currentInspectionNumCyclesInterval = 1;
                belowThresholdCounter++;
                if (belowThresholdCounter === inspection.numCyclesBelowThreshold) {
                    break;
                }
            }
            else {
                currentInspectionNumCyclesInterval = inspection.numCyclesInterval;
            }
        }
        if (limitProcessingTime && performance.now() > limitProcessingTime) {
            console.warn(`Exceeded processing time limit (${maxProcessingTime})ms`);
            break;
        }
    }
    const commandEncoder = device.createCommandEncoder();
    const outputLabelmapBufferIndex = (numIterations + 1) % 2;
    const labelmapStagingBuffer = device.createBuffer({
        size: BUFFER_SIZE,
        usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
    });
    const boundsStagingBuffer = device.createBuffer({
        size: BOUNDS_BUFFER_SIZE,
        usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
    });
    commandEncoder.copyBufferToBuffer(gpuLabelmapBuffers[outputLabelmapBufferIndex], 0, labelmapStagingBuffer, 0, BUFFER_SIZE);
    commandEncoder.copyBufferToBuffer(gpuBoundsBuffer, 0, boundsStagingBuffer, 0, BOUNDS_BUFFER_SIZE);
    device.queue.submit([commandEncoder.finish()]);
    await labelmapStagingBuffer.mapAsync(GPUMapMode.READ, 0, BUFFER_SIZE);
    const labelmapResultBuffer = labelmapStagingBuffer.getMappedRange(0, BUFFER_SIZE);
    const labelmapResult = new Uint32Array(labelmapResultBuffer);
    labelmapData.set(labelmapResult);
    labelmapStagingBuffer.unmap();
    await boundsStagingBuffer.mapAsync(GPUMapMode.READ, 0, BOUNDS_BUFFER_SIZE);
    const boundsResultBuffer = boundsStagingBuffer.getMappedRange(0, BOUNDS_BUFFER_SIZE);
    const boundsResult = new Int32Array(boundsResultBuffer.slice(0));
    boundsStagingBuffer.unmap();
    const minX = boundsResult[0];
    const minY = boundsResult[1];
    const minZ = boundsResult[2];
    const maxX = boundsResult[3];
    const maxY = boundsResult[4];
    const maxZ = boundsResult[5];
    labelmap.voxelManager.setCompleteScalarDataArray(labelmapData);
    labelmap.voxelManager.clearBounds();
    labelmap.voxelManager.setBounds([
        [minX, maxX],
        [minY, maxY],
        [minZ, maxZ],
    ]);
}



},
19262(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  z: () => (runGrowCutForBoundingBox)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _runGrowCut_js__rspack_import_1 = __webpack_require__(14386);


const POSITIVE_SEED_VALUE = 254;
const NEGATIVE_SEED_VALUE = 255;
const NEGATIVE_PIXEL_RANGE = [-Infinity, -995];
const POSITIVE_PIXEL_RANGE = [0, 1900];
function _setNegativeSeedValues(subVolume, labelmap, options) {
    const { negativeSeedValue = NEGATIVE_SEED_VALUE, negativePixelRange = NEGATIVE_PIXEL_RANGE, } = options;
    const subVolPixelData = subVolume.voxelManager.getCompleteScalarDataArray();
    const [width, height, numSlices] = labelmap.dimensions;
    const middleSliceIndex = Math.floor(numSlices / 2);
    const visited = new Array(width * height).fill(false);
    const sliceOffset = middleSliceIndex * width * height;
    const bfs = (startX, startY) => {
        const queue = [[startX, startY]];
        while (queue.length) {
            const [x, y] = queue.shift();
            const slicePixelIndex = y * width + x;
            if (x < 0 ||
                x >= width ||
                y < 0 ||
                y >= height ||
                visited[slicePixelIndex]) {
                continue;
            }
            visited[slicePixelIndex] = true;
            const volumeVoxelIndex = sliceOffset + slicePixelIndex;
            const volumeVoxelValue = subVolPixelData[volumeVoxelIndex];
            if (volumeVoxelValue < negativePixelRange[0] ||
                volumeVoxelValue > negativePixelRange[1]) {
                continue;
            }
            labelmap.voxelManager.setAtIndex(volumeVoxelIndex, negativeSeedValue);
            queue.push([x - 1, y]);
            queue.push([x + 1, y]);
            queue.push([x, y - 1]);
            queue.push([x, y + 1]);
        }
    };
    const scanLine = (startX, limitX, incX, y) => {
        for (let x = startX; x !== limitX; x += incX) {
            const slicePixelIndex = y * width + x;
            const volumeVoxelIndex = sliceOffset + slicePixelIndex;
            const volumeVoxelValue = subVolPixelData[volumeVoxelIndex];
            if (volumeVoxelValue < negativePixelRange[0] ||
                volumeVoxelValue > negativePixelRange[1]) {
                break;
            }
            if (!visited[slicePixelIndex]) {
                bfs(x, y);
            }
        }
    };
    for (let y = 0; y < height; y++) {
        scanLine(0, width - 1, 1, y);
        scanLine(width - 1, 0, -1, y);
    }
}
function _setPositiveSeedValues(subVolume, labelmap, options) {
    const { positiveSeedValue = POSITIVE_SEED_VALUE, positivePixelRange = POSITIVE_PIXEL_RANGE, } = options;
    const subVolPixelData = subVolume.voxelManager.getCompleteScalarDataArray();
    const labelmapData = labelmap.voxelManager.getCompleteScalarDataArray();
    const [width, height, numSlices] = labelmap.dimensions;
    const middleSliceIndex = Math.floor(numSlices / 2);
    const startSliceIndex = Math.max(middleSliceIndex - 3, 0);
    const stopSliceIndex = Math.max(startSliceIndex + 5, numSlices);
    const pixelsPerSlice = width * height;
    for (let z = startSliceIndex; z < stopSliceIndex; z++) {
        const zOffset = z * pixelsPerSlice;
        for (let y = 0; y < height; y++) {
            const yOffset = y * width;
            for (let x = 0; x < width; x++) {
                const index = zOffset + yOffset + x;
                const pixelValue = subVolPixelData[index];
                const isPositiveValue = pixelValue >= positivePixelRange[0] &&
                    pixelValue <= positivePixelRange[1];
                if (isPositiveValue) {
                    labelmap.voxelManager.setAtIndex(index, positiveSeedValue);
                }
            }
        }
    }
}
async function _createAndCacheSegmentationSubVolumeForBoundingBox(subVolume, options) {
    const labelmap = _cornerstonejs_core__rspack_import_0.volumeLoader.createAndCacheDerivedLabelmapVolume(subVolume.volumeId);
    _setPositiveSeedValues(subVolume, labelmap, options);
    _setNegativeSeedValues(subVolume, labelmap, options);
    return labelmap;
}
async function runGrowCutForBoundingBox(referencedVolumeId, boundingBoxInfo, options) {
    const { boundingBox } = boundingBoxInfo;
    const { ijkTopLeft, ijkBottomRight } = boundingBox;
    const subVolumeBoundsIJK = {
        minX: ijkTopLeft[0],
        maxX: ijkBottomRight[0],
        minY: ijkTopLeft[1],
        maxY: ijkBottomRight[1],
        minZ: ijkTopLeft[2],
        maxZ: ijkBottomRight[2],
    };
    const subVolume = _cornerstonejs_core__rspack_import_0.utilities.createSubVolume(referencedVolumeId, subVolumeBoundsIJK, {
        targetBuffer: {
            type: 'Float32Array',
        },
    });
    const labelmap = await _createAndCacheSegmentationSubVolumeForBoundingBox(subVolume, options);
    await (0,_runGrowCut_js__rspack_import_1/* .run */.e)(subVolume.volumeId, labelmap.volumeId);
    return labelmap;
}



},
67074(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  n: () => (runGrowCutForSphere)
});
/* import */ var gl_matrix__rspack_import_0 = __webpack_require__(40230);
/* import */ var _cornerstonejs_core__rspack_import_1 = __webpack_require__(88479);
/* import */ var _getViewportICamera_js__rspack_import_2 = __webpack_require__(41891);
/* import */ var _runGrowCut_js__rspack_import_3 = __webpack_require__(14386);
/* import */ var _getSphereBoundsInfo_js__rspack_import_4 = __webpack_require__(95009);





const { transformWorldToIndex } = _cornerstonejs_core__rspack_import_1.utilities;
const POSITIVE_SEED_VALUE = 254;
const NEGATIVE_SEED_VALUE = 255;
const POSITIVE_SEED_VARIANCE = 0.1;
const NEGATIVE_SEED_VARIANCE = 0.8;
function _getGrowCutSphereBoundsInfo(referencedVolume, sphereBoundsInfo) {
    const { topLeftWorld, bottomRightWorld } = sphereBoundsInfo;
    const topLeftIJK = transformWorldToIndex(referencedVolume.imageData, topLeftWorld);
    const bottomRightIJK = transformWorldToIndex(referencedVolume.imageData, bottomRightWorld);
    return {
        ...sphereBoundsInfo,
        topLeftIJK,
        bottomRightIJK,
    };
}
function _getSphereBoundsInfo(referencedVolume, sphereInfo) {
    const direction = referencedVolume.imageData.getDirection();
    const vecColumn = gl_matrix__rspack_import_0/* .vec3.fromValues */.eR.fA(direction[3], direction[4], direction[5]);
    const { center: sphereCenterPoint, radius: sphereRadius } = sphereInfo;
    const refVolImageData = referencedVolume.imageData;
    const topCirclePoint = gl_matrix__rspack_import_0/* .vec3.scaleAndAdd */.eR.Ln(gl_matrix__rspack_import_0/* .vec3.create */.eR.vt(), sphereCenterPoint, vecColumn, -sphereRadius);
    const bottomCirclePoint = gl_matrix__rspack_import_0/* .vec3.scaleAndAdd */.eR.Ln(gl_matrix__rspack_import_0/* .vec3.create */.eR.vt(), sphereCenterPoint, vecColumn, sphereRadius);
    const sphereBoundsInfo = (0,_getSphereBoundsInfo_js__rspack_import_4/* .getSphereBoundsInfo */.R)([bottomCirclePoint, topCirclePoint], refVolImageData);
    return _getGrowCutSphereBoundsInfo(referencedVolume, sphereBoundsInfo);
}
function _createSubVolumeFromSphere(referencedVolume, sphereInfo, viewport) {
    const refVolImageData = referencedVolume.imageData;
    const camera = (0,_getViewportICamera_js__rspack_import_2/* ["default"] */.A)(viewport);
    const { ijkVecRowDir, ijkVecColDir } = _cornerstonejs_core__rspack_import_1.utilities.getVolumeDirectionVectors(refVolImageData, camera);
    const obliqueView = [ijkVecRowDir, ijkVecColDir].some((vec) => !_cornerstonejs_core__rspack_import_1.utilities.isEqual(Math.abs(vec[0]), 1) &&
        !_cornerstonejs_core__rspack_import_1.utilities.isEqual(Math.abs(vec[1]), 1) &&
        !_cornerstonejs_core__rspack_import_1.utilities.isEqual(Math.abs(vec[2]), 1));
    if (obliqueView) {
        console.warn('Oblique view is not supported!');
        return;
    }
    const { boundsIJK: sphereBoundsIJK } = _getSphereBoundsInfo(referencedVolume, sphereInfo);
    const subVolumeBoundsIJK = {
        minX: sphereBoundsIJK[0][0],
        maxX: sphereBoundsIJK[0][1] + 1,
        minY: sphereBoundsIJK[1][0],
        maxY: sphereBoundsIJK[1][1] + 1,
        minZ: sphereBoundsIJK[2][0],
        maxZ: sphereBoundsIJK[2][1] + 1,
    };
    return _cornerstonejs_core__rspack_import_1.utilities.createSubVolume(referencedVolume.volumeId, subVolumeBoundsIJK, {
        targetBuffer: {
            type: 'Float32Array',
        },
    });
}
function _setPositiveSeedValues(referencedVolume, labelmap, sphereInfo, options) {
    const refVolumePixelData = referencedVolume.voxelManager.getCompleteScalarDataArray();
    const worldStartPos = sphereInfo.center;
    const [width, height, numSlices] = referencedVolume.dimensions;
    const numPixelsPerSlice = width * height;
    const ijkStartPosition = transformWorldToIndex(referencedVolume.imageData, worldStartPos);
    const referencePixelValue = refVolumePixelData[ijkStartPosition[2] * numPixelsPerSlice +
        ijkStartPosition[1] * width +
        ijkStartPosition[0]];
    const positiveSeedValue = options.positiveSeedValue ?? POSITIVE_SEED_VALUE;
    const positiveSeedVariance = options.positiveSeedVariance ?? POSITIVE_SEED_VARIANCE;
    const positiveSeedVarianceValue = Math.abs(referencePixelValue * positiveSeedVariance);
    const minPositivePixelValue = referencePixelValue - positiveSeedVarianceValue;
    const maxPositivePixelValue = referencePixelValue + positiveSeedVarianceValue;
    const neighborsCoordDelta = [
        [-1, 0, 0],
        [1, 0, 0],
        [0, -1, 0],
        [0, 1, 0],
        [0, 0, -1],
        [0, 0, 1],
    ];
    const startVoxelIndex = ijkStartPosition[2] * numPixelsPerSlice +
        ijkStartPosition[1] * width +
        ijkStartPosition[0];
    labelmap.voxelManager.setAtIndex(startVoxelIndex, positiveSeedValue);
    const queue = [ijkStartPosition];
    while (queue.length) {
        const ijkVoxel = queue.shift();
        const [x, y, z] = ijkVoxel;
        for (let i = 0, len = neighborsCoordDelta.length; i < len; i++) {
            const neighborCoordDelta = neighborsCoordDelta[i];
            const nx = x + neighborCoordDelta[0];
            const ny = y + neighborCoordDelta[1];
            const nz = z + neighborCoordDelta[2];
            if (nx < 0 ||
                nx >= width ||
                ny < 0 ||
                ny >= height ||
                nz < 0 ||
                nz >= numSlices) {
                continue;
            }
            const neighborVoxelIndex = nz * numPixelsPerSlice + ny * width + nx;
            const neighborPixelValue = refVolumePixelData[neighborVoxelIndex];
            const neighborLabelmapValue = labelmap.voxelManager.getAtIndex(neighborVoxelIndex);
            if (neighborLabelmapValue === positiveSeedValue ||
                neighborPixelValue < minPositivePixelValue ||
                neighborPixelValue > maxPositivePixelValue) {
                continue;
            }
            labelmap.voxelManager.setAtIndex(neighborVoxelIndex, positiveSeedValue);
            queue.push([nx, ny, nz]);
        }
    }
}
function _setNegativeSeedValues(subVolume, labelmap, sphereInfo, viewport, options) {
    const subVolPixelData = subVolume.voxelManager.getCompleteScalarDataArray();
    const [columns, rows, numSlices] = labelmap.dimensions;
    const numPixelsPerSlice = columns * rows;
    const { worldVecRowDir, worldVecSliceDir } = _cornerstonejs_core__rspack_import_1.utilities.getVolumeDirectionVectors(labelmap.imageData, (0,_getViewportICamera_js__rspack_import_2/* ["default"] */.A)(viewport));
    const ijkSphereCenter = transformWorldToIndex(subVolume.imageData, sphereInfo.center);
    const referencePixelValue = subVolPixelData[ijkSphereCenter[2] * columns * rows +
        ijkSphereCenter[1] * columns +
        ijkSphereCenter[0]];
    const negativeSeedVariance = options.negativeSeedVariance ?? NEGATIVE_SEED_VARIANCE;
    const negativeSeedValue = options?.negativeSeedValue ?? NEGATIVE_SEED_VALUE;
    const negativeSeedVarianceValue = Math.abs(referencePixelValue * negativeSeedVariance);
    const minNegativePixelValue = referencePixelValue - negativeSeedVarianceValue;
    const maxNegativePixelValue = referencePixelValue + negativeSeedVarianceValue;
    const numCirclePoints = 360;
    const rotationAngle = (2 * Math.PI) / numCirclePoints;
    const worldQuat = gl_matrix__rspack_import_0/* .quat.setAxisAngle */.Yu.x8(gl_matrix__rspack_import_0/* .quat.create */.Yu.vt(), worldVecSliceDir, rotationAngle);
    const vecRotation = gl_matrix__rspack_import_0/* .vec3.clone */.eR.o8(worldVecRowDir);
    for (let i = 0; i < numCirclePoints; i++) {
        const worldCircleBorderPoint = gl_matrix__rspack_import_0/* .vec3.scaleAndAdd */.eR.Ln(gl_matrix__rspack_import_0/* .vec3.create */.eR.vt(), sphereInfo.center, vecRotation, sphereInfo.radius);
        const ijkCircleBorderPoint = transformWorldToIndex(labelmap.imageData, worldCircleBorderPoint);
        const [x, y, z] = ijkCircleBorderPoint;
        gl_matrix__rspack_import_0/* .vec3.transformQuat */.eR.gL(vecRotation, vecRotation, worldQuat);
        if (x < 0 ||
            x >= columns ||
            y < 0 ||
            y >= rows ||
            z < 0 ||
            z >= numSlices) {
            continue;
        }
        const offset = x + y * columns + z * numPixelsPerSlice;
        const pixelValue = subVolPixelData[offset];
        if (pixelValue < minNegativePixelValue ||
            pixelValue > maxNegativePixelValue) {
            labelmap.voxelManager.setAtIndex(offset, negativeSeedValue);
        }
    }
}
async function _createAndCacheSegmentationSubVolumeForSphere(subVolume, sphereInfo, viewport, options) {
    const labelmap = await _cornerstonejs_core__rspack_import_1.volumeLoader.createAndCacheDerivedLabelmapVolume(subVolume.volumeId);
    _setPositiveSeedValues(subVolume, labelmap, sphereInfo, options);
    _setNegativeSeedValues(subVolume, labelmap, sphereInfo, viewport, options);
    return labelmap;
}
async function runGrowCutForSphere(referencedVolumeId, sphereInfo, viewport, options) {
    const referencedVolume = _cornerstonejs_core__rspack_import_1.cache.getVolume(referencedVolumeId);
    const subVolume = _createSubVolumeFromSphere(referencedVolume, sphereInfo, viewport);
    const labelmap = await _createAndCacheSegmentationSubVolumeForSphere(subVolume, sphereInfo, viewport, options);
    await (0,_runGrowCut_js__rspack_import_3/* .run */.e)(subVolume.volumeId, labelmap.volumeId);
    return labelmap;
}



},
92230(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  HW: () => (runOneClickGrowCut),
  sG: () => (calculateGrowCutSeeds)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _runGrowCut_js__rspack_import_1 = __webpack_require__(14386);
/* import */ var _constants_js__rspack_import_2 = __webpack_require__(29735);



const { transformWorldToIndex } = _cornerstonejs_core__rspack_import_0.utilities;
const MAX_POSITIVE_SEEDS = 100000;
function calculateGrowCutSeeds(referencedVolume, worldPosition, options) {
    const { dimensions, imageData: refImageData } = referencedVolume;
    const [width, height, numSlices] = dimensions;
    const referenceVolumeVoxelManager = referencedVolume.voxelManager;
    const scalarData = referenceVolumeVoxelManager.getCompleteScalarDataArray();
    const numPixelsPerSlice = width * height;
    const neighborhoodRadius = options?.initialNeighborhoodRadius ?? (/* inlined export .DEFAULT_NEIGHBORHOOD_RADIUS */1);
    const positiveK = options?.positiveStdDevMultiplier ?? (/* inlined export .DEFAULT_POSITIVE_STD_DEV_MULTIPLIER */1.8);
    const negativeK = options?.negativeStdDevMultiplier ?? (/* inlined export .DEFAULT_NEGATIVE_STD_DEV_MULTIPLIER */3.2);
    const negativeSeedMargin = options?.negativeSeedMargin ?? (/* inlined export .DEFAULT_NEGATIVE_SEED_MARGIN */30);
    const negativeSeedsTargetPatches = options?.negativeSeedsTargetPatches ?? (/* inlined export .DEFAULT_NEGATIVE_SEEDS_COUNT */70);
    const ijkStart = transformWorldToIndex(refImageData, worldPosition).map(Math.round);
    const startIndex = referenceVolumeVoxelManager.toIndex(ijkStart);
    if (ijkStart[0] < 0 ||
        ijkStart[0] >= width ||
        ijkStart[1] < 0 ||
        ijkStart[1] >= height ||
        ijkStart[2] < 0 ||
        ijkStart[2] >= numSlices) {
        console.warn('Click position is outside volume bounds.');
        return null;
    }
    const initialStats = _cornerstonejs_core__rspack_import_0.utilities.calculateNeighborhoodStats(scalarData, dimensions, ijkStart, neighborhoodRadius);
    if (initialStats.count === 0) {
        initialStats.mean = scalarData[startIndex];
        initialStats.stdDev = 0;
    }
    const positiveIntensityMin = initialStats.mean - positiveK * initialStats.stdDev;
    const positiveIntensityMax = initialStats.mean + positiveK * initialStats.stdDev;
    const neighborsCoordDelta = [
        [-1, 0, 0],
        [1, 0, 0],
        [0, -1, 0],
        [0, 1, 0],
        [0, 0, -1],
        [0, 0, 1],
    ];
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    const positiveSeedIndices = new Set();
    const queue = [];
    const startValue = scalarData[startIndex];
    if (startValue >= positiveIntensityMin &&
        startValue <= positiveIntensityMax) {
        positiveSeedIndices.add(startIndex);
        queue.push(ijkStart);
        minX = maxX = ijkStart[0];
        minY = maxY = ijkStart[1];
        minZ = maxZ = ijkStart[2];
    }
    else {
        console.warn('Clicked voxel intensity is outside the calculated positive range. No positive seeds generated.');
        return { positiveSeedIndices: new Set(), negativeSeedIndices: new Set() };
    }
    let currentQueueIndex = 0;
    while (currentQueueIndex < queue.length &&
        positiveSeedIndices.size < MAX_POSITIVE_SEEDS) {
        const [x, y, z] = queue[currentQueueIndex++];
        minX = Math.min(x, minX);
        minY = Math.min(y, minY);
        minZ = Math.min(z, minZ);
        maxX = Math.max(x, maxX);
        maxY = Math.max(y, maxY);
        maxZ = Math.max(z, maxZ);
        for (let i = 0; i < neighborsCoordDelta.length; i++) {
            const [dx, dy, dz] = neighborsCoordDelta[i];
            const nx = x + dx;
            const ny = y + dy;
            const nz = z + dz;
            if (nx < 0 ||
                nx >= width ||
                ny < 0 ||
                ny >= height ||
                nz < 0 ||
                nz >= numSlices) {
                continue;
            }
            const neighborIndex = nz * numPixelsPerSlice + ny * width + nx;
            if (positiveSeedIndices.has(neighborIndex)) {
                continue;
            }
            const neighborValue = scalarData[neighborIndex];
            if (neighborValue >= positiveIntensityMin &&
                neighborValue <= positiveIntensityMax) {
                positiveSeedIndices.add(neighborIndex);
                if (positiveSeedIndices.size < MAX_POSITIVE_SEEDS) {
                    queue.push([nx, ny, nz]);
                }
            }
        }
    }
    if (positiveSeedIndices.size >= MAX_POSITIVE_SEEDS) {
        console.debug(`Reached maximum number of positive seeds (${MAX_POSITIVE_SEEDS}). Stopping BFS.`);
    }
    if (positiveSeedIndices.size === 0) {
        console.warn('No positive seeds found after BFS.');
        return { positiveSeedIndices: new Set(), negativeSeedIndices: new Set() };
    }
    let positiveSum = 0;
    let positiveSumSq = 0;
    positiveSeedIndices.forEach((index) => {
        const value = scalarData[index];
        positiveSum += value;
        positiveSumSq += value * value;
    });
    const positiveCount = positiveSeedIndices.size;
    const positiveMean = positiveSum / positiveCount;
    const positiveVariance = positiveSumSq / positiveCount - positiveMean * positiveMean;
    const positiveStdDev = Math.sqrt(Math.max(0, positiveVariance));
    const negativeDiffThreshold = negativeK * positiveStdDev;
    const minXm = Math.max(0, minX - negativeSeedMargin);
    const minYm = Math.max(0, minY - negativeSeedMargin);
    const minZm = Math.max(0, minZ - negativeSeedMargin);
    const maxXm = Math.min(width - 1, maxX + negativeSeedMargin);
    const maxYm = Math.min(height - 1, maxY + negativeSeedMargin);
    const maxZm = Math.min(numSlices - 1, maxZ + negativeSeedMargin);
    const negativeSeedIndices = new Set();
    let attempts = 0;
    let patchesAdded = 0;
    const maxAttempts = negativeSeedsTargetPatches * (/* inlined export .MAX_NEGATIVE_SEED_ATTEMPTS_MULTIPLIER */50);
    while (patchesAdded < negativeSeedsTargetPatches && attempts < maxAttempts) {
        attempts++;
        const rx = Math.floor(Math.random() * (maxXm - minXm + 1) + minXm);
        const ry = Math.floor(Math.random() * (maxYm - minYm + 1) + minYm);
        const rz = Math.floor(Math.random() * (maxZm - minZm + 1) + minZm);
        const centerIndex = rz * numPixelsPerSlice + ry * width + rx;
        if (positiveSeedIndices.has(centerIndex) ||
            negativeSeedIndices.has(centerIndex)) {
            continue;
        }
        const centerValue = scalarData[centerIndex];
        if (Math.abs(centerValue - positiveMean) > negativeDiffThreshold) {
            let patchContributed = false;
            for (let dy = -1; dy <= 1; dy++) {
                const ny = ry + dy;
                if (ny < 0 || ny >= height) {
                    continue;
                }
                for (let dx = -1; dx <= 1; dx++) {
                    const nx = rx + dx;
                    if (nx < 0 || nx >= width) {
                        continue;
                    }
                    const neighborIndex = rz * numPixelsPerSlice + ny * width + nx;
                    if (positiveSeedIndices.has(neighborIndex) ||
                        negativeSeedIndices.has(neighborIndex)) {
                        continue;
                    }
                    negativeSeedIndices.add(neighborIndex);
                    patchContributed = true;
                }
            }
            if (patchContributed) {
                patchesAdded++;
            }
        }
    }
    if (negativeSeedIndices.size === 0) {
        console.warn('Could not find any negative seeds. GrowCut might fail or produce poor results.');
    }
    console.debug('positiveSeedIndices', positiveSeedIndices.size);
    console.debug('negativeSeedIndices', negativeSeedIndices.size);
    return { positiveSeedIndices, negativeSeedIndices };
}
async function runOneClickGrowCut({ referencedVolumeId, worldPosition, options, }) {
    const referencedVolume = _cornerstonejs_core__rspack_import_0.cache.getVolume(referencedVolumeId);
    const labelmap = _cornerstonejs_core__rspack_import_0.volumeLoader.createAndCacheDerivedLabelmapVolume(referencedVolumeId);
    labelmap.voxelManager.forEach(({ index, value }) => {
        if (value !== 0) {
            labelmap.voxelManager.setAtIndex(index, 0);
        }
    });
    const seeds = options.seeds ??
        calculateGrowCutSeeds(referencedVolume, worldPosition, options);
    const positiveSeedLabel = options?.positiveSeedValue ?? (/* inlined export .POSITIVE_SEED_LABEL */254);
    const negativeSeedLabel = options?.negativeSeedValue ?? (/* inlined export .NEGATIVE_SEED_LABEL */255);
    if (!seeds) {
        return null;
    }
    const { positiveSeedIndices, negativeSeedIndices } = seeds;
    if (positiveSeedIndices.size < 10 ||
        positiveSeedIndices.size > MAX_POSITIVE_SEEDS ||
        negativeSeedIndices.size < 10) {
        console.warn('Not enough seeds found. GrowCut might fail or produce poor results.');
        return labelmap;
    }
    positiveSeedIndices.forEach((index) => {
        labelmap.voxelManager.setAtIndex(index, positiveSeedLabel);
    });
    negativeSeedIndices.forEach((index) => {
        labelmap.voxelManager.setAtIndex(index, negativeSeedLabel);
    });
    await (0,_runGrowCut_js__rspack_import_1/* .run */.e)(referencedVolumeId, labelmap.volumeId, options);
    return labelmap;
}



},
90389(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  E: () => (invalidateBrushCursor)
});
/* import */ var _store_ToolGroupManager_index_js__rspack_import_0 = __webpack_require__(72314);
/* import */ var _triggerAnnotationRenderForViewportIds_js__rspack_import_1 = __webpack_require__(85321);
/* import */ var _getBrushToolInstances_js__rspack_import_2 = __webpack_require__(91662);



function invalidateBrushCursor(toolGroupId) {
    const toolGroup = (0,_store_ToolGroupManager_index_js__rspack_import_0.getToolGroup)(toolGroupId);
    if (toolGroup === undefined) {
        return;
    }
    const brushBasedToolInstances = (0,_getBrushToolInstances_js__rspack_import_2/* .getBrushToolInstances */.n)(toolGroupId);
    brushBasedToolInstances.forEach((tool) => {
        tool.invalidateBrushCursor();
    });
    const viewportsInfo = toolGroup.getViewportsInfo();
    const viewportsInfoArray = Object.keys(viewportsInfo).map((key) => viewportsInfo[key]);
    if (!viewportsInfoArray.length) {
        return;
    }
    const viewportIds = toolGroup.getViewportIds();
    (0,_triggerAnnotationRenderForViewportIds_js__rspack_import_1/* ["default"] */.A)(viewportIds);
}


},
29827(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (IslandRemoval),
  a: () => (SegmentationEnum)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _normalizeViewportPlane_js__rspack_import_1 = __webpack_require__(95972);


const { RLEVoxelMap, VoxelManager } = _cornerstonejs_core__rspack_import_0.utilities;
const MAX_IMAGE_SIZE = 65535;
var SegmentationEnum;
(function (SegmentationEnum) {
    SegmentationEnum[SegmentationEnum["SEGMENT"] = -1] = "SEGMENT";
    SegmentationEnum[SegmentationEnum["ISLAND"] = -2] = "ISLAND";
    SegmentationEnum[SegmentationEnum["INTERIOR"] = -3] = "INTERIOR";
    SegmentationEnum[SegmentationEnum["EXTERIOR"] = -4] = "EXTERIOR";
    SegmentationEnum[SegmentationEnum["INTERIOR_SMALL"] = -5] = "INTERIOR_SMALL";
    SegmentationEnum[SegmentationEnum["INTERIOR_TEST"] = -6] = "INTERIOR_TEST";
})(SegmentationEnum || (SegmentationEnum = {}));
class IslandRemoval {
    constructor(options) {
        this.fillInternalEdge = false;
        this.maxInternalRemove = 128;
        this.maxInternalRemove =
            options?.maxInternalRemove ?? this.maxInternalRemove;
        this.fillInternalEdge = options?.fillInternalEdge ?? this.fillInternalEdge;
    }
    initialize(viewport, segmentationVoxels, options) {
        const hasSource = !!segmentationVoxels.sourceVoxelManager;
        const segmentationVoxelManager = hasSource
            ? segmentationVoxels.sourceVoxelManager
            : segmentationVoxels;
        const previewVoxelManager = hasSource
            ? segmentationVoxels
            : VoxelManager.createRLEHistoryVoxelManager(segmentationVoxelManager);
        const { segmentIndex = 1, previewSegmentIndex = 1 } = options;
        const clickedPoints = options.points || segmentationVoxelManager.getPoints();
        if (!clickedPoints?.length) {
            return;
        }
        const boundsIJK = segmentationVoxelManager
            .getBoundsIJK()
            .map((bound, i) => [
            Math.min(bound[0], ...clickedPoints.map((point) => point[i])),
            Math.max(bound[1], ...clickedPoints.map((point) => point[i])),
        ]);
        if (boundsIJK.find((it) => it[0] < 0 || it[1] > MAX_IMAGE_SIZE)) {
            return;
        }
        const { toIJK, fromIJK, boundsIJKPrime, error } = (0,_normalizeViewportPlane_js__rspack_import_1/* ["default"] */.A)(viewport, boundsIJK);
        if (error) {
            console.warn('Not performing island removal for planes not orthogonal to acquisition plane', error);
            return;
        }
        const [width, height, depth] = fromIJK(segmentationVoxelManager.dimensions);
        const segmentSet = new RLEVoxelMap(width, height, depth);
        const getter = (i, j, k) => {
            const index = segmentationVoxelManager.toIndex(toIJK([i, j, k]));
            const oldVal = segmentationVoxelManager.getAtIndex(index);
            if (oldVal === previewSegmentIndex || oldVal === segmentIndex) {
                return SegmentationEnum.SEGMENT;
            }
        };
        segmentSet.fillFrom(getter, boundsIJKPrime);
        segmentSet.normalizer = { toIJK, fromIJK, boundsIJKPrime };
        this.segmentSet = segmentSet;
        this.previewVoxelManager = previewVoxelManager;
        this.segmentIndex = segmentIndex;
        this.previewSegmentIndex = previewSegmentIndex ?? segmentIndex;
        this.selectedPoints = clickedPoints;
        return true;
    }
    floodFillSegmentIsland() {
        const { selectedPoints: clickedPoints, segmentSet } = this;
        let floodedCount = 0;
        const { fromIJK } = segmentSet.normalizer;
        clickedPoints.forEach((clickedPoint) => {
            const ijkPrime = fromIJK(clickedPoint);
            const index = segmentSet.toIndex(ijkPrime);
            const [iPrime, jPrime, kPrime] = ijkPrime;
            if (segmentSet.get(index) === SegmentationEnum.SEGMENT) {
                floodedCount += segmentSet.floodFill(iPrime, jPrime, kPrime, SegmentationEnum.ISLAND);
            }
        });
        return floodedCount;
    }
    removeExternalIslands() {
        const { previewVoxelManager, segmentSet } = this;
        const { toIJK } = segmentSet.normalizer;
        const callback = (index, rle) => {
            const [, jPrime, kPrime] = segmentSet.toIJK(index);
            if (rle.value !== SegmentationEnum.ISLAND) {
                for (let iPrime = rle.start; iPrime < rle.end; iPrime++) {
                    const clearPoint = toIJK([iPrime, jPrime, kPrime]);
                    const v = previewVoxelManager.getAtIJKPoint(clearPoint);
                    previewVoxelManager.setAtIJKPoint(clearPoint, v === undefined ? 0 : null);
                }
            }
        };
        segmentSet.forEach(callback, { rowModified: true });
    }
    removeInternalIslands() {
        const { segmentSet, previewVoxelManager, previewSegmentIndex } = this;
        const { height, normalizer, width } = segmentSet;
        const { toIJK } = normalizer;
        segmentSet.forEachRow((baseIndex, row) => {
            let lastRle;
            for (const rle of [...row]) {
                if (rle.value !== SegmentationEnum.ISLAND) {
                    continue;
                }
                if (!lastRle) {
                    if (this.fillInternalEdge && rle.start > 0) {
                        for (let iPrime = 0; iPrime < rle.start; iPrime++) {
                            segmentSet.set(baseIndex + iPrime, SegmentationEnum.INTERIOR);
                        }
                    }
                    lastRle = rle;
                    continue;
                }
                for (let iPrime = lastRle.end; iPrime < rle.start; iPrime++) {
                    segmentSet.set(baseIndex + iPrime, SegmentationEnum.INTERIOR);
                }
                lastRle = rle;
            }
            if (this.fillInternalEdge && lastRle?.end < width) {
                for (let iPrime = lastRle.end; iPrime < width; iPrime++) {
                    segmentSet.set(baseIndex + iPrime, SegmentationEnum.INTERIOR);
                }
            }
        });
        segmentSet.forEach((baseIndex, rle) => {
            if (rle.value !== SegmentationEnum.INTERIOR) {
                return;
            }
            const [, jPrime, kPrime] = segmentSet.toIJK(baseIndex);
            const rowPrev = jPrime > 0 ? segmentSet.getRun(jPrime - 1, kPrime) : null;
            const rowNext = jPrime + 1 < height ? segmentSet.getRun(jPrime + 1, kPrime) : null;
            const isLast = jPrime === height - 1;
            const isFirst = jPrime === 0;
            const prevCovers = IslandRemoval.covers(rle, rowPrev) ||
                (isFirst && this.fillInternalEdge);
            const nextCovers = IslandRemoval.covers(rle, rowNext) || (isLast && this.fillInternalEdge);
            if (rle.end - rle.start > 2 && (!prevCovers || !nextCovers)) {
                segmentSet.floodFill(rle.start, jPrime, kPrime, SegmentationEnum.EXTERIOR, { singlePlane: true });
            }
        });
        segmentSet.forEach((baseIndex, rle) => {
            if (rle.value !== SegmentationEnum.INTERIOR) {
                return;
            }
            const [, jPrime, kPrime] = segmentSet.toIJK(baseIndex);
            const size = segmentSet.floodFill(rle.start, jPrime, kPrime, SegmentationEnum.INTERIOR_TEST);
            const isBig = size > this.maxInternalRemove;
            const newType = isBig
                ? SegmentationEnum.EXTERIOR
                : SegmentationEnum.INTERIOR_SMALL;
            segmentSet.floodFill(rle.start, jPrime, kPrime, newType);
        });
        segmentSet.forEach((baseIndex, rle) => {
            if (rle.value !== SegmentationEnum.INTERIOR_SMALL) {
                return;
            }
            for (let iPrime = rle.start; iPrime < rle.end; iPrime++) {
                const clearPoint = toIJK(segmentSet.toIJK(baseIndex + iPrime));
                previewVoxelManager.setAtIJKPoint(clearPoint, previewSegmentIndex);
                this.onInternalPointFilled(clearPoint);
            }
        });
        return previewVoxelManager.getArrayOfModifiedSlices();
    }
    onInternalPointFilled(_point) {
    }
    static covers(rle, row) {
        if (!row) {
            return false;
        }
        let { start } = rle;
        const { end } = rle;
        for (const rowRle of row) {
            if (start >= rowRle.start && start < rowRle.end) {
                start = rowRle.end;
                if (start >= end) {
                    return true;
                }
            }
        }
        return false;
    }
}


},
70736(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (setViewportCamera),
  l: () => (resetViewportCamera)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);

function normalizeVec3(v) {
    const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return length > 0 ? [v[0] / length, v[1] / length, v[2] / length] : v;
}
function setViewportCamera(viewport, camera) {
    const vp = viewport;
    if (_cornerstonejs_core__rspack_import_0.utilities.isGenericViewport(viewport)) {
        if (viewport.type === _cornerstonejs_core__rspack_import_0.Enums.ViewportType.PLANAR_NEXT &&
            typeof vp.setViewReference === 'function') {
            const ref = viewport.getViewReference();
            const focalPoint = camera.focalPoint ?? ref?.cameraFocalPoint;
            const viewUp = camera.viewUp ?? ref?.viewUp;
            let viewPlaneNormal = camera.viewPlaneNormal;
            if (!viewPlaneNormal && camera.position && focalPoint) {
                viewPlaneNormal = normalizeVec3([
                    camera.position[0] - focalPoint[0],
                    camera.position[1] - focalPoint[1],
                    camera.position[2] - focalPoint[2],
                ]);
            }
            const rotatingVp = viewport;
            const readResolvedScale = () => rotatingVp.getResolvedView?.()?.toICamera?.()?.parallelScale;
            const beforeScale = readResolvedScale();
            const beforeZoom = rotatingVp.getZoom?.();
            vp.setViewReference({
                ...ref,
                cameraFocalPoint: focalPoint,
                viewPlaneNormal,
                viewUp,
            });
            rotatingVp.invalidateResolvedView?.();
            const afterScale = readResolvedScale();
            if (beforeScale &&
                afterScale &&
                typeof beforeZoom === 'number' &&
                typeof rotatingVp.setZoom === 'function') {
                const newZoom = (afterScale * beforeZoom) / beforeScale;
                if (Number.isFinite(newZoom) && newZoom > 0) {
                    rotatingVp.setZoom(newZoom);
                }
            }
            viewport.render();
            return;
        }
        vp.setViewState?.(camera);
        return;
    }
    vp.setCamera?.(camera);
}
function resetViewportCamera(viewport, options) {
    const vp = viewport;
    if (_cornerstonejs_core__rspack_import_0.utilities.isGenericViewport(viewport)) {
        vp.resetViewState?.(options);
        return;
    }
    vp.resetCamera?.(options);
}


},
85321(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export),
  t: () => (triggerAnnotationRenderForViewportIds)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _triggerAnnotationRender_js__rspack_import_1 = __webpack_require__(36420);


function triggerAnnotationRenderForViewportIds(viewportIdsToRender) {
    if (!viewportIdsToRender.length) {
        return;
    }
    viewportIdsToRender.forEach((viewportId) => {
        const enabledElement = (0,_cornerstonejs_core__rspack_import_0.getEnabledElementByViewportId)(viewportId);
        if (!enabledElement) {
            console.warn(`Viewport not available for ${viewportId}`);
            return;
        }
        const { viewport } = enabledElement;
        if (!viewport) {
            console.warn(`Viewport not available for ${viewportId}`);
            return;
        }
        const element = viewport.element;
        (0,_triggerAnnotationRender_js__rspack_import_1/* ["default"] */.A)(element);
    });
}
/* export default */ const __rspack_default_export = (triggerAnnotationRenderForViewportIds);


},
88299(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Z: () => (getViewportPresentation),
  r: () => (applyViewportPresentation)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);

function getViewportPresentation(viewport, selector) {
    const projectionPresentation = _cornerstonejs_core__rspack_import_0.viewportProjection.getPresentation(viewport, {
        selector,
    });
    if (projectionPresentation) {
        return projectionPresentation;
    }
    return viewport.getViewPresentation?.(selector);
}
function applyViewportPresentation(viewport, presentation) {
    if (!presentation) {
        return false;
    }
    const target = viewport;
    const nextViewState = _cornerstonejs_core__rspack_import_0.viewportProjection.withPresentation(viewport, presentation);
    if (nextViewState && typeof target.setViewState === 'function') {
        target.setViewState(nextViewState);
        return true;
    }
    if (typeof target.setViewPresentation === 'function') {
        target.setViewPresentation(presentation);
        return true;
    }
    return false;
}


},
41153(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  n: () => (/* binding */ ColorbarCanvas)
});

// UNUSED EXPORTS: default

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(88479);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/vec3/interpolateVec3.js
const interpolateVec3 = (a, b, t) => {
    return [
        a[0] * (1 - t) + b[0] * t,
        a[1] * (1 - t) + b[1] * t,
        a[2] * (1 - t) + b[2] * t,
    ];
};


// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/voi/colorbar/common/index.js + 4 modules
var common = __webpack_require__(90736);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/voi/colorbar/ColorbarCanvas.js



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
        if (!(0,common/* .isColorbarSizeValid */.Au)(size) || (0,common/* .areColorbarSizesEqual */.fG)(canvas, size)) {
            return;
        }
        this._setCanvasSize(canvas, size);
        this.render();
    }
    get imageRange() {
        return { ...this._imageRange };
    }
    set imageRange(imageRange) {
        if (!(0,common/* .isRangeValid */.kB)(imageRange) ||
            (0,common/* .areColorbarRangesEqual */.bh)(imageRange, this._imageRange)) {
            return;
        }
        this._imageRange = imageRange;
        this.render();
    }
    get voiRange() {
        return { ...this._voiRange };
    }
    set voiRange(voiRange) {
        if (!(0,common/* .isRangeValid */.kB)(voiRange) ||
            (0,common/* .areColorbarRangesEqual */.bh)(voiRange, this._voiRange)) {
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
        if (size && !(0,common/* .isColorbarSizeValid */.Au)(size)) {
            throw new Error('Invalid "size"');
        }
        if (imageRange && !(0,common/* .isRangeValid */.kB)(imageRange)) {
            throw new Error('Invalid "imageRange"');
        }
        if (voiRange && !(0,common/* .isRangeValid */.kB)(voiRange)) {
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
        const minPosition = rgbPoints[0];
        const maxPosition = rgbPoints[rgbPoints.length - 4];
        const colormapRange = maxPosition - minPosition;
        const incRawPixelValue = (range.upper - range.lower) / (maxValue - 1);
        let rawPixelValue = range.lower;
        for (let i = 0; i < maxValue; i++) {
            const tVoiRange = (rawPixelValue - voiRange.lower) /
                Math.abs(voiRange.upper - voiRange.lower);
            const tColormapPosition = minPosition + tVoiRange * colormapRange;
            if (currentColorPoint) {
                for (let i = currentColorPoint.index; i < colorsCount; i++) {
                    if (tColormapPosition <= currentColorPoint.position) {
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
                const tColorRange = (tColormapPosition - previousColorPoint.position) /
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



},
70679(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  f: () => (ColorbarTicks)
});
/* import */ var _common_index_js__rspack_import_0 = __webpack_require__(90736);
/* import */ var _enums_ColorbarRangeTextPosition_js__rspack_import_1 = __webpack_require__(60597);


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
            rangeTextPosition ?? _enums_ColorbarRangeTextPosition_js__rspack_import_1/* .ColorbarRangeTextPosition.Right */.U.Right;
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
        if (!(0,_common_index_js__rspack_import_0/* .isColorbarSizeValid */.Au)(size) || (0,_common_index_js__rspack_import_0/* .areColorbarSizesEqual */.fG)(canvas, size)) {
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
        if (!(0,_common_index_js__rspack_import_0/* .isRangeValid */.kB)(imageRange) ||
            (0,_common_index_js__rspack_import_0/* .areColorbarRangesEqual */.bh)(imageRange, this._imageRange)) {
            return;
        }
        this._imageRange = imageRange;
        this.render();
    }
    get voiRange() {
        return { ...this._voiRange };
    }
    set voiRange(voiRange) {
        if (!(0,_common_index_js__rspack_import_0/* .isRangeValid */.kB)(voiRange) ||
            (0,_common_index_js__rspack_import_0/* .areColorbarRangesEqual */.bh)(voiRange, this._voiRange)) {
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
        if (size && !(0,_common_index_js__rspack_import_0/* .isColorbarSizeValid */.Au)(size)) {
            throw new Error('Invalid "size"');
        }
        if (imageRange && !(0,_common_index_js__rspack_import_0/* .isRangeValid */.kB)(imageRange)) {
            throw new Error('Invalid "imageRange"');
        }
        if (voiRange && !(0,_common_index_js__rspack_import_0/* .isRangeValid */.kB)(voiRange)) {
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
                if (this._rangeTextPosition === _enums_ColorbarRangeTextPosition_js__rspack_import_1/* .ColorbarRangeTextPosition.Top */.U.Top) {
                    tickInfo = this._getTopTickInfo({ position, labelMeasure });
                }
                else {
                    tickInfo = this._getBottomTickInfo({ position, labelMeasure });
                }
            }
            else {
                if (this._rangeTextPosition === _enums_ColorbarRangeTextPosition_js__rspack_import_1/* .ColorbarRangeTextPosition.Left */.U.Left) {
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



},
90736(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  bh: () => (/* reexport */ areColorbarRangesEqual),
  fG: () => (/* reexport */ areColorbarSizesEqual),
  Au: () => (/* reexport */ isColorbarSizeValid),
  kB: () => (/* reexport */ isRangeValid)
});

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/voi/colorbar/common/isRangeValid.js
const isRangeValid = (range) => {
    return range && range.upper > range.lower;
};


;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/voi/colorbar/common/isColorbarSizeValid.js
const isColorbarSizeValid = (size) => {
    return !!size && size.width > 0 && size.height > 0;
};


;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/voi/colorbar/common/areColorbarRangesEqual.js
const areColorbarRangesEqual = (a, b) => {
    return !!a && !!b && a.lower === b.lower && a.upper === b.upper;
};


;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/voi/colorbar/common/areColorbarSizesEqual.js
const areColorbarSizesEqual = (a, b) => {
    return !!a && !!b && a.width === b.width && a.height === b.height;
};


;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/voi/colorbar/common/index.js






},
40838(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (isRangeTextPositionValid)
});
/* import */ var _enums_index_js__rspack_import_0 = __webpack_require__(26900);

function isRangeTextPositionValid(colorbarWidth, colorbarHeight, rangeTextPosition) {
    const isHorizontal = colorbarWidth >= colorbarHeight;
    const validRangeTextPositions = isHorizontal
        ? [_enums_index_js__rspack_import_0.ColorbarRangeTextPosition.Top, _enums_index_js__rspack_import_0.ColorbarRangeTextPosition.Bottom]
        : [_enums_index_js__rspack_import_0.ColorbarRangeTextPosition.Left, _enums_index_js__rspack_import_0.ColorbarRangeTextPosition.Right];
    return validRangeTextPositions.includes(rangeTextPosition);
}



},
77401(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  $5: () => (/* reexport */ (/* inlined export .LINE_INTERSECTION_TOLERANCE */1e-8)),
  Ez: () => (/* reexport */ (/* inlined export .NUM_CLIPPING_PLANES */6)),
  Lc: () => (/* reexport */ PLANEINDEX),
  NW: () => (/* reexport */ (/* inlined export .POINT_PROXIMITY_THRESHOLD_PIXELS */6)),
  sh: () => (/* reexport */ SPHEREINDEX),
  dr: () => (/* reexport */ computePlanePlaneIntersection),
  fJ: () => (/* reexport */ copyClippingPlanes),
  BV: () => (/* reexport */ extractVolumeDirectionVectors),
  Oo: () => (/* reexport */ findLineBoundsIntersection),
  Gh: () => (/* reexport */ getColorKeyForPlaneIndex),
  Ul: () => (/* reexport */ getOrientationFromNormal),
  gR: () => (/* reexport */ parseCornerKey)
});

// UNUSED EXPORTS: LINE_EXTENSION_DISTANCE, MIN_LINE_LENGTH_PIXELS, ORIENTATION_TOLERANCE, PARALLEL_PLANE_TOLERANCE

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/volumeCropping/constants.js
const PLANEINDEX = {
    XMIN: 0,
    XMAX: 1,
    YMIN: 2,
    YMAX: 3,
    ZMIN: 4,
    ZMAX: 5,
};
const SPHEREINDEX = {
    XMIN: 0,
    XMAX: 1,
    YMIN: 2,
    YMAX: 3,
    ZMIN: 4,
    ZMAX: 5,
    XMIN_YMIN_ZMIN: 6,
    XMIN_YMIN_ZMAX: 7,
    XMIN_YMAX_ZMIN: 8,
    XMIN_YMAX_ZMAX: 9,
    XMAX_YMIN_ZMIN: 10,
    XMAX_YMIN_ZMAX: 11,
    XMAX_YMAX_ZMIN: 12,
    XMAX_YMAX_ZMAX: 13,
};
const NUM_CLIPPING_PLANES = 6;
const ORIENTATION_TOLERANCE = 1e-2;
const PARALLEL_PLANE_TOLERANCE = 1e-10;
const LINE_INTERSECTION_TOLERANCE = 1e-8;
const LINE_EXTENSION_DISTANCE = 100000;
const MIN_LINE_LENGTH_PIXELS = 1;
const POINT_PROXIMITY_THRESHOLD_PIXELS = 6;

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/volumeCropping/types.js

// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/index.js
var esm = __webpack_require__(40230);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/volumeCropping/extractVolumeDirectionVectors.js

function extractVolumeDirectionVectors(imageData) {
    const direction = imageData.getDirection();
    return {
        xDir: esm/* .vec3.normalize */.eR.S8([0, 0, 0], direction.slice(0, 3)),
        yDir: esm/* .vec3.normalize */.eR.S8([0, 0, 0], direction.slice(3, 6)),
        zDir: esm/* .vec3.normalize */.eR.S8([0, 0, 0], direction.slice(6, 9)),
    };
}

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/volumeCropping/parseCornerKey.js
function parseCornerKey(uid) {
    const cornerKey = uid.replace('corner_', '');
    return {
        isXMin: cornerKey.includes('XMIN'),
        isXMax: cornerKey.includes('XMAX'),
        isYMin: cornerKey.includes('YMIN'),
        isYMax: cornerKey.includes('YMAX'),
        isZMin: cornerKey.includes('ZMIN'),
        isZMax: cornerKey.includes('ZMAX'),
    };
}

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/volumeCropping/copyClippingPlanes.js
function copyClippingPlanes(planes) {
    return planes.map((plane) => ({
        origin: [...plane.origin],
        normal: [...plane.normal],
    }));
}

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/volumeCropping/getColorKeyForPlaneIndex.js

function getColorKeyForPlaneIndex(planeIndex) {
    if (planeIndex === PLANEINDEX.XMIN || planeIndex === PLANEINDEX.XMAX) {
        return 'SAGITTAL';
    }
    else if (planeIndex === PLANEINDEX.YMIN || planeIndex === PLANEINDEX.YMAX) {
        return 'CORONAL';
    }
    else if (planeIndex === PLANEINDEX.ZMIN || planeIndex === PLANEINDEX.ZMAX) {
        return 'AXIAL';
    }
    return null;
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var dist_esm = __webpack_require__(88479);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/volumeCropping/getOrientationFromNormal.js



function getOrientationFromNormal(normal) {
    if (!normal) {
        return null;
    }
    const canonical = {
        AXIAL: [0, 0, 1],
        CORONAL: [0, 1, 0],
        SAGITTAL: [1, 0, 0],
    };
    for (const [key, value] of Object.entries(canonical)) {
        if (dist_esm.utilities.isEqualAbs(1, esm/* .vec3.dot */.eR.Om(value, normal), (/* inlined export .ORIENTATION_TOLERANCE */0.01))) {
            return key;
        }
    }
    return null;
}

// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/Math.js
var Core_Math = __webpack_require__(91352);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/volumeCropping/computePlanePlaneIntersection.js



function computePlanePlaneIntersection(clippingPlane, viewPlaneNormal, viewPlanePoint) {
    const n1 = clippingPlane.normal;
    const p1 = clippingPlane.origin;
    const n2 = viewPlaneNormal;
    const p2 = viewPlanePoint;
    const dir = esm/* .vec3.create */.eR.vt();
    esm/* .vec3.cross */.eR.$A(dir, n1, n2);
    const dirLenSq = esm/* .vec3.squaredLength */.eR.m3(dir);
    if (dirLenSq < (/* inlined export .PARALLEL_PLANE_TOLERANCE */1e-10)) {
        return null;
    }
    const d1 = Core_Math/* ["default"].dot */.Ay.dot(n1, p1);
    const d2 = Core_Math/* ["default"].dot */.Ay.dot(n2, p2);
    const term1 = esm/* .vec3.create */.eR.vt();
    const term2 = esm/* .vec3.create */.eR.vt();
    esm/* .vec3.cross */.eR.$A(term1, n2, dir);
    esm/* .vec3.scale */.eR.hs(term1, term1, d1);
    esm/* .vec3.cross */.eR.$A(term2, dir, n1);
    esm/* .vec3.scale */.eR.hs(term2, term2, d2);
    const point = esm/* .vec3.create */.eR.vt();
    esm/* .vec3.add */.eR.WQ(point, term1, term2);
    esm/* .vec3.scale */.eR.hs(point, point, 1 / dirLenSq);
    if (!Number.isFinite(point[0]) ||
        !Number.isFinite(point[1]) ||
        !Number.isFinite(point[2])) {
        return null;
    }
    const direction = esm/* .vec3.create */.eR.vt();
    esm/* .vec3.scale */.eR.hs(direction, dir, 1 / Math.sqrt(dirLenSq));
    return {
        direction: direction,
        point: point,
    };
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/vec2/liangBarksyClip.js
var liangBarksyClip = __webpack_require__(10132);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/volumeCropping/findLineBoundsIntersection.js



function findLineBoundsIntersection(linePoint, lineDirection, viewport) {
    const lineLength = (/* inlined export .LINE_EXTENSION_DISTANCE */100000);
    const lineStart = esm/* .vec3.scaleAndAdd */.eR.Ln([0, 0, 0], linePoint, lineDirection, -lineLength);
    const lineEnd = esm/* .vec3.scaleAndAdd */.eR.Ln([0, 0, 0], linePoint, lineDirection, lineLength);
    const canvasStart = viewport.worldToCanvas(lineStart);
    const canvasEnd = viewport.worldToCanvas(lineEnd);
    const { clientWidth, clientHeight } = viewport.canvas;
    const canvasBox = [0, 0, clientWidth, clientHeight];
    const clippedStart = esm/* .vec2.clone */.Zc.o8(canvasStart);
    const clippedEnd = esm/* .vec2.clone */.Zc.o8(canvasEnd);
    const startValid = !isNaN(clippedStart[0]) && !isNaN(clippedStart[1]);
    const endValid = !isNaN(clippedEnd[0]) && !isNaN(clippedEnd[1]);
    if (!startValid || !endValid) {
        return null;
    }
    const clipResult = (0,liangBarksyClip/* ["default"] */.A)(clippedStart, clippedEnd, canvasBox);
    if (clipResult === 0) {
        return null;
    }
    const clippedStartValid = !isNaN(clippedStart[0]) && !isNaN(clippedStart[1]);
    const clippedEndValid = !isNaN(clippedEnd[0]) && !isNaN(clippedEnd[1]);
    if (!clippedStartValid || !clippedEndValid) {
        return null;
    }
    const [xMin, yMin, xMax, yMax] = canvasBox;
    const startInBounds = clippedStart[0] >= xMin - 1 &&
        clippedStart[0] <= xMax + 1 &&
        clippedStart[1] >= yMin - 1 &&
        clippedStart[1] <= yMax + 1;
    const endInBounds = clippedEnd[0] >= xMin - 1 &&
        clippedEnd[0] <= xMax + 1 &&
        clippedEnd[1] >= yMin - 1 &&
        clippedEnd[1] <= yMax + 1;
    if (!startInBounds || !endInBounds) {
        return null;
    }
    const dx = clippedEnd[0] - clippedStart[0];
    const dy = clippedEnd[1] - clippedStart[1];
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length < (/* inlined export .MIN_LINE_LENGTH_PIXELS */1)) {
        return null;
    }
    return {
        start: clippedStart,
        end: clippedEnd,
    };
}

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/volumeCropping/index.js











},
40456(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  C: () => (/* binding */ vtkOrientationControllerWidget)
});

// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/macros.js
var macros = __webpack_require__(28241);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/Math.js
var Core_Math = __webpack_require__(91352);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/ImplicitFunction.js
var ImplicitFunction = __webpack_require__(53001);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/BoundingBox.js
var BoundingBox = __webpack_require__(24377);
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/Box.js



//#region Sources/Common/DataModel/Box/index.js
function intersectWithLine(bounds, p1, p2) {
	let plane1 = -1;
	let plane2 = -1;
	let t1 = 0;
	let t2 = 1;
	for (let j = 0; j < 3; j++) for (let k = 0; k < 2; k++) {
		const i = 2 * j + k;
		const d1 = (bounds[i] - p1[j]) * (1 - 2 * k);
		const d2 = (bounds[i] - p2[j]) * (1 - 2 * k);
		if (d1 > 0 && d2 > 0) return;
		if (d1 > 0 || d2 > 0) {
			let t = 0;
			if (d1 !== 0) t = d1 / (d1 - d2);
			if (d1 > 0) {
				if (t >= t1) {
					t1 = t;
					plane1 = i;
				}
			} else if (t <= t2) {
				t2 = t;
				plane2 = i;
			}
			if (t1 > t2) {
				if (plane1 < 0 || plane2 < 0) return;
			}
		}
	}
	function getValues(plane, t) {
		const x = [
			0,
			0,
			0
		];
		for (let count = 0; count < 2; count++) for (let i = 0; i < 3; i++) if (plane === 2 * i || plane === 2 * i + 1) x[i] = bounds[plane];
		else {
			x[i] = p1[i] * (1 - t) + p2[i] * t;
			if (x[i] < bounds[2 * i]) x[i] = bounds[2 * i];
			if (x[i] > bounds[2 * i + 1]) x[i] = bounds[2 * i + 1];
		}
		return x;
	}
	const x1 = getValues(plane1, t1);
	const x2 = getValues(plane2, t2);
	return {
		t1,
		t2,
		x1,
		x2
	};
}
var STATIC = {};
function vtkBox(publicAPI, model) {
	model.classHierarchy.push("vtkBox");
	publicAPI.setBounds = (...bounds) => {
		let boundsArray = [];
		if (Array.isArray(bounds[0])) boundsArray = bounds[0];
		else for (let i = 0; i < bounds.length; i++) boundsArray.push(bounds[i]);
		if (boundsArray.length !== 6) {
			console.log("vtkBox.setBounds", boundsArray, bounds);
			return;
		}
		BoundingBox/* ["default"].setBounds */.Ay.setBounds(model.bbox, boundsArray);
	};
	publicAPI.getBounds = () => [...model.bbox];
	publicAPI.evaluateFunction = (x, y, z) => {
		const point = Array.isArray(x) ? x : [
			x,
			y,
			z
		];
		let diff;
		let dist;
		let t;
		let minDistance = -Number.MAX_VALUE;
		let distance = 0;
		const minPoint = BoundingBox/* ["default"].getMinPoint */.Ay.getMinPoint(model.bbox);
		const maxPoint = BoundingBox/* ["default"].getMaxPoint */.Ay.getMaxPoint(model.bbox);
		let inside = 1;
		for (let i = 0; i < 3; i++) {
			diff = BoundingBox/* ["default"].getLength */.Ay.getLength(model.bbox, i);
			if (diff !== 0) {
				t = (point[i] - minPoint[i]) / diff;
				if (t < 0) {
					inside = 0;
					dist = minPoint[i] - point[i];
				} else if (t > 1) {
					inside = 0;
					dist = point[i] - maxPoint[i];
				} else {
					if (t <= .5) dist = minPoint[i] - point[i];
					else dist = point[i] - maxPoint[i];
					if (dist > minDistance) minDistance = dist;
				}
			} else {
				dist = Math.abs(point[i] - minPoint[i]);
				if (dist > 0) inside = 0;
			}
			if (dist > 0) distance += dist * dist;
		}
		distance = Math.sqrt(distance);
		if (inside) return minDistance;
		return distance;
	};
	publicAPI.addBounds = (...bounds) => {
		let boundsArray = [];
		if (Array.isArray(bounds[0])) boundsArray = bounds[0];
		else for (let i = 0; i < bounds.length; i++) boundsArray.push(bounds[i]);
		if (boundsArray.length !== 6) return;
		BoundingBox/* ["default"].addBounds */.Ay.addBounds(model.bbox, ...boundsArray);
		publicAPI.modified();
	};
	publicAPI.addBox = (other) => publicAPI.addBounds(other.getBounds());
	publicAPI.intersectWithLine = (p1, p2) => intersectWithLine(model.bbox, p1, p2);
}
var DEFAULT_VALUES = { bbox: [...BoundingBox/* ["default"].INIT_BOUNDS */.Ay.INIT_BOUNDS] };
function extend(publicAPI, model, initialValues = {}) {
	Object.assign(model, DEFAULT_VALUES, initialValues);
	ImplicitFunction/* ["default"].extend */.Ay.extend(publicAPI, model, initialValues);
	vtkBox(publicAPI, model);
}
var newInstance = macros/* ["default"].newInstance */.Ay.newInstance(extend, "vtkBox");
var Box_default = {
	newInstance,
	extend,
	intersectWithLine,
	...STATIC
};
//#endregion


//# sourceMappingURL=Box.js.map
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/CellTypes/Constants.js
var Constants = __webpack_require__(61091);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/CellTypes.js
var CellTypes = __webpack_require__(82649);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/Line.js
var Line = __webpack_require__(35856);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/PolyLine.js
var PolyLine = __webpack_require__(21186);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/Triangle.js
var Triangle = __webpack_require__(96402);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/Quad.js
var Quad = __webpack_require__(82021);
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/AbstractPicker.js

//#region Sources/Rendering/Core/AbstractPicker/index.js
function vtkAbstractPicker(publicAPI, model) {
	model.classHierarchy.push("vtkAbstractPicker");
	publicAPI.initialize = () => {
		model.renderer = null;
		model.selectionPoint[0] = 0;
		model.selectionPoint[1] = 0;
		model.selectionPoint[2] = 0;
		model.pickPosition[0] = 0;
		model.pickPosition[1] = 0;
		model.pickPosition[2] = 0;
	};
	publicAPI.initializePickList = () => {
		model.pickList = [];
	};
	publicAPI.addPickList = (actor) => {
		model.pickList.push(actor);
	};
	publicAPI.deletePickList = (actor) => {
		const i = model.pickList.indexOf(actor);
		if (i !== -1) model.pickList.splice(i, 1);
	};
}
var AbstractPicker_DEFAULT_VALUES = {
	renderer: null,
	selectionPoint: [
		0,
		0,
		0
	],
	pickPosition: [
		0,
		0,
		0
	],
	pickFromList: false,
	pickList: []
};
function AbstractPicker_extend(publicAPI, model, initialValues = {}) {
	Object.assign(model, AbstractPicker_DEFAULT_VALUES, initialValues);
	macros/* ["default"].obj */.Ay.obj(publicAPI, model);
	macros/* ["default"].get */.Ay.get(publicAPI, model, ["renderer"]);
	macros/* ["default"].getArray */.Ay.getArray(publicAPI, model, ["selectionPoint", "pickPosition"]);
	macros/* ["default"].setGet */.Ay.setGet(publicAPI, model, ["pickFromList", "pickList"]);
	vtkAbstractPicker(publicAPI, model);
}
var AbstractPicker_newInstance = macros/* ["default"].newInstance */.Ay.newInstance(AbstractPicker_extend, "vtkAbstractPicker");
var AbstractPicker_default = {
	newInstance: AbstractPicker_newInstance,
	extend: AbstractPicker_extend
};
//#endregion


//# sourceMappingURL=AbstractPicker.js.map
// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/index.js
var esm = __webpack_require__(40230);
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/Picker.js





//#region Sources/Rendering/Core/Picker/index.js
var { vtkErrorMacro } = macros/* ["default"] */.Ay;
var { vtkWarningMacro } = macros/* ["default"] */.Ay;
function vtkPicker(publicAPI, model) {
	model.classHierarchy.push("vtkPicker");
	const superClass = { ...publicAPI };
	function initialize() {
		superClass.initialize();
		model.actors = [];
		model.pickedPositions = [];
		model.mapperPosition[0] = 0;
		model.mapperPosition[1] = 0;
		model.mapperPosition[2] = 0;
		model.mapper = null;
		model.dataSet = null;
		model.globalTMin = Number.MAX_VALUE;
	}
	/**
	* Compute the tolerance in world coordinates.
	* Do this by determining the world coordinates of the diagonal points of the
	* window, computing the width of the window in world coordinates, and
	* multiplying by the tolerance.
	* @param {Number} selectionZ
	* @param {Number} aspect
	* @param {vtkRenderer} renderer
	* @returns {Number} the computed tolerance
	*/
	function computeTolerance(selectionZ, aspect, renderer) {
		let tolerance = 0;
		const view = renderer.getRenderWindow().getViews()[0];
		const viewport = renderer.getViewport();
		const winSize = view.getSize();
		let x = winSize[0] * viewport[0];
		let y = winSize[1] * viewport[1];
		const normalizedLeftDisplay = view.displayToNormalizedDisplay(x, y, selectionZ);
		const windowLowerLeft = renderer.normalizedDisplayToWorld(normalizedLeftDisplay[0], normalizedLeftDisplay[1], normalizedLeftDisplay[2], aspect);
		x = winSize[0] * viewport[2];
		y = winSize[1] * viewport[3];
		const normalizedRightDisplay = view.displayToNormalizedDisplay(x, y, selectionZ);
		const windowUpperRight = renderer.normalizedDisplayToWorld(normalizedRightDisplay[0], normalizedRightDisplay[1], normalizedRightDisplay[2], aspect);
		for (let i = 0; i < 3; i++) tolerance += (windowUpperRight[i] - windowLowerLeft[i]) * (windowUpperRight[i] - windowLowerLeft[i]);
		return Math.sqrt(tolerance);
	}
	/**
	* Perform picking on the given renderer, given a ray defined in world coordinates.
	* @param {*} renderer
	* @param {*} tolerance
	* @param {*} p1World
	* @param {*} p2World
	* @returns true if we picked something else false
	*/
	function pick3DInternal(renderer, tolerance, p1World, p2World) {
		const p1Mapper = new Float64Array(4);
		const p2Mapper = new Float64Array(4);
		const ray = [];
		const hitPosition = [];
		const props = model.pickFromList ? model.pickList : renderer.getActors();
		const transformScale = new Float64Array(3);
		const pickedPosition = new Float64Array(3);
		props.forEach((prop) => {
			const mapper = prop.getMapper();
			const propIsFullyTranslucent = prop.getProperty?.().getOpacity?.() === 0;
			if (!(prop.getNestedPickable() && prop.getNestedVisibility() && !propIsFullyTranslucent)) return;
			model.transformMatrix = prop.getMatrix().slice(0);
			esm/* .mat4.transpose */.pB.transpose(model.transformMatrix, model.transformMatrix);
			esm/* .mat4.invert */.pB.invert(model.transformMatrix, model.transformMatrix);
			esm/* .vec4.transformMat4 */.ln.Z0(p1Mapper, p1World, model.transformMatrix);
			esm/* .vec4.transformMat4 */.ln.Z0(p2Mapper, p2World, model.transformMatrix);
			esm/* .vec3.scale */.eR.hs(p1Mapper, p1Mapper, 1 / p1Mapper[3]);
			esm/* .vec3.scale */.eR.hs(p2Mapper, p2Mapper, 1 / p2Mapper[3]);
			(0,Core_Math/* .subtract */.Re)(p2Mapper, p1Mapper, ray);
			const bounds = mapper ? BoundingBox/* ["default"].inflate */.Ay.inflate(mapper.getBounds(), tolerance) : [...BoundingBox/* ["default"].INIT_BOUNDS */.Ay.INIT_BOUNDS];
			if (BoundingBox/* ["default"].intersectBox */.Ay.intersectBox(bounds, p1Mapper, ray, hitPosition, [])) {
				esm/* .mat4.getScaling */.pB.getScaling(transformScale, model.transformMatrix);
				const t = model.intersectWithLine(p1Mapper, p2Mapper, tolerance * .333 * (transformScale[0] + transformScale[1] + transformScale[2]), prop, mapper);
				if (t < Number.MAX_VALUE) {
					pickedPosition[0] = (1 - t) * p1World[0] + t * p2World[0];
					pickedPosition[1] = (1 - t) * p1World[1] + t * p2World[1];
					pickedPosition[2] = (1 - t) * p1World[2] + t * p2World[2];
					const actorIndex = model.actors.indexOf(prop);
					if (actorIndex !== -1) {
						const previousPickedPosition = model.pickedPositions[actorIndex];
						if ((0,Core_Math/* .distance2BetweenPoints */.fm)(p1World, pickedPosition) < (0,Core_Math/* .distance2BetweenPoints */.fm)(p1World, previousPickedPosition)) model.pickedPositions[actorIndex] = pickedPosition.slice(0);
					} else {
						model.actors.push(prop);
						model.pickedPositions.push(pickedPosition.slice(0));
					}
				}
			}
		});
		const tempArray = [];
		for (let i = 0; i < model.pickedPositions.length; i++) tempArray.push({
			actor: model.actors[i],
			pickedPosition: model.pickedPositions[i],
			distance2: (0,Core_Math/* .distance2BetweenPoints */.fm)(p1World, model.pickedPositions[i])
		});
		tempArray.sort((a, b) => {
			const keyA = a.distance2;
			const keyB = b.distance2;
			if (keyA < keyB) return -1;
			if (keyA > keyB) return 1;
			return 0;
		});
		model.pickedPositions = [];
		model.actors = [];
		tempArray.forEach((obj) => {
			model.pickedPositions.push(obj.pickedPosition);
			model.actors.push(obj.actor);
		});
	}
	model.intersectWithLine = (p1, p2, tolerance, prop, mapper) => {
		if (!mapper) return Number.MAX_VALUE;
		const center = mapper.getCenter();
		const ray = esm/* .vec3.subtract */.eR.Re(new Float64Array(3), p2, p1);
		const rayFactor = (0,Core_Math/* .dot */.Om)(ray, ray);
		if (rayFactor === 0) return 2;
		return (ray[0] * (center[0] - p1[0]) + ray[1] * (center[1] - p1[1]) + ray[2] * (center[2] - p1[2])) / rayFactor;
	};
	publicAPI.pick = (selection, renderer) => {
		if (selection.length !== 3) vtkWarningMacro("vtkPicker.pick - selection needs three components");
		if (!renderer) {
			vtkErrorMacro("vtkPicker.pick - renderer cannot be null");
			throw new Error("renderer cannot be null");
		}
		initialize();
		const selectionX = selection[0];
		const selectionY = selection[1];
		let selectionZ = selection[2];
		model.renderer = renderer;
		model.selectionPoint[0] = selectionX;
		model.selectionPoint[1] = selectionY;
		model.selectionPoint[2] = selectionZ;
		const p1World = new Float64Array(4);
		const p2World = new Float64Array(4);
		const camera = renderer.getActiveCamera();
		const cameraPos = camera.getPosition();
		const cameraFP = camera.getFocalPoint();
		const view = renderer.getRenderWindow().getViews()[0];
		const dims = view.getViewportSize(renderer);
		if (dims[1] === 0) {
			vtkWarningMacro("vtkPicker.pick - viewport area is 0");
			return;
		}
		const aspect = dims[0] / dims[1];
		let displayCoords = [];
		displayCoords = renderer.worldToNormalizedDisplay(cameraFP[0], cameraFP[1], cameraFP[2], aspect);
		displayCoords = view.normalizedDisplayToDisplay(displayCoords[0], displayCoords[1], displayCoords[2]);
		selectionZ = displayCoords[2];
		const normalizedDisplay = view.displayToNormalizedDisplay(selectionX, selectionY, selectionZ);
		const worldCoords = renderer.normalizedDisplayToWorld(normalizedDisplay[0], normalizedDisplay[1], normalizedDisplay[2], aspect);
		for (let i = 0; i < 3; i++) model.pickPosition[i] = worldCoords[i];
		const ray = [];
		for (let i = 0; i < 3; i++) ray[i] = model.pickPosition[i] - cameraPos[i];
		const cameraDOP = [];
		for (let i = 0; i < 3; i++) cameraDOP[i] = cameraFP[i] - cameraPos[i];
		(0,Core_Math/* .normalize */.S8)(cameraDOP);
		const rayLength = (0,Core_Math/* .dot */.Om)(cameraDOP, ray);
		if (rayLength === 0) {
			vtkWarningMacro("Picker::Pick Cannot process points");
			return;
		}
		const clipRange = camera.getClippingRange();
		let tF;
		let tB;
		if (camera.getParallelProjection()) {
			tF = clipRange[0] - rayLength;
			tB = clipRange[1] - rayLength;
			for (let i = 0; i < 3; i++) {
				p1World[i] = model.pickPosition[i] + tF * cameraDOP[i];
				p2World[i] = model.pickPosition[i] + tB * cameraDOP[i];
			}
		} else {
			tF = clipRange[0] / rayLength;
			tB = clipRange[1] / rayLength;
			for (let i = 0; i < 3; i++) {
				p1World[i] = cameraPos[i] + tF * ray[i];
				p2World[i] = cameraPos[i] + tB * ray[i];
			}
		}
		p1World[3] = 1;
		p2World[3] = 1;
		const tolerance = computeTolerance(selectionZ, aspect, renderer) * model.tolerance;
		pick3DInternal(model.renderer, tolerance, p1World, p2World);
	};
	publicAPI.pick3DPoint = (selectionPoint, focalPoint, renderer) => {
		if (!renderer) throw new Error("renderer cannot be null");
		initialize();
		model.renderer = renderer;
		esm/* .vec3.copy */.eR.C(model.selectionPoint, selectionPoint);
		const dims = renderer.getRenderWindow().getViews()[0].getViewportSize(renderer);
		if (dims[1] === 0) {
			vtkWarningMacro("vtkPicker.pick3DPoint - viewport area is 0");
			return;
		}
		const aspect = dims[0] / dims[1];
		pick3DInternal(renderer, computeTolerance(model.selectionPoint[2], aspect, renderer) * model.tolerance, selectionPoint, focalPoint);
	};
}
var Picker_DEFAULT_VALUES = {
	tolerance: .025,
	mapperPosition: [
		0,
		0,
		0
	],
	mapper: null,
	dataSet: null,
	actors: [],
	pickedPositions: [],
	transformMatrix: null,
	globalTMin: Number.MAX_VALUE
};
function Picker_extend(publicAPI, model, initialValues = {}) {
	Object.assign(model, Picker_DEFAULT_VALUES, initialValues);
	AbstractPicker_default.extend(publicAPI, model, initialValues);
	macros/* ["default"].setGet */.Ay.setGet(publicAPI, model, ["tolerance"]);
	macros/* ["default"].setGetArray */.Ay.setGetArray(publicAPI, model, ["mapperPosition"], 3);
	macros/* ["default"].get */.Ay.get(publicAPI, model, [
		"mapper",
		"dataSet",
		"actors",
		"pickedPositions"
	]);
	macros/* ["default"].event */.Ay.event(publicAPI, model, "pickChange");
	vtkPicker(publicAPI, model);
}
var Picker_newInstance = macros/* ["default"].newInstance */.Ay.newInstance(Picker_extend, "vtkPicker");
var Picker_default = {
	newInstance: Picker_newInstance,
	extend: Picker_extend
};
//#endregion


//# sourceMappingURL=Picker.js.map
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/CellPicker.js











//#region Sources/Rendering/Core/CellPicker/index.js
function createCellMap() {
	return {
		[Constants/* .CellType.VTK_LINE */.vZ.VTK_LINE]: Line/* ["default"].newInstance */.Ay.newInstance(),
		[Constants/* .CellType.VTK_POLY_LINE */.vZ.VTK_POLY_LINE]: PolyLine/* ["default"].newInstance */.Ay.newInstance(),
		[Constants/* .CellType.VTK_TRIANGLE */.vZ.VTK_TRIANGLE]: Triangle/* ["default"].newInstance */.Ay.newInstance(),
		[Constants/* .CellType.VTK_QUAD */.vZ.VTK_QUAD]: Quad/* ["default"].newInstance */.Ay.newInstance()
	};
}
function clipLineWithPlane(mapper, matrix, p1, p2) {
	const outObj = {
		planeId: -1,
		t1: 0,
		t2: 1,
		intersect: 0
	};
	const nbClippingPlanes = mapper.getNumberOfClippingPlanes();
	const plane = [];
	for (let i = 0; i < nbClippingPlanes; i++) {
		mapper.getClippingPlaneInDataCoords(matrix, i, plane);
		const d1 = plane[0] * p1[0] + plane[1] * p1[1] + plane[2] * p1[2] + plane[3];
		const d2 = plane[0] * p2[0] + plane[1] * p2[1] + plane[2] * p2[2] + plane[3];
		if (d1 < 0 && d2 < 0) return 0;
		if (d1 < 0 || d2 < 0) {
			let t = 0;
			if (d1 !== 0) t = d1 / (d1 - d2);
			if (d1 < 0) {
				if (t >= outObj.t1) {
					outObj.t1 = t;
					outObj.planeId = i;
				}
			} else if (t <= outObj.t2) outObj.t2 = t;
			if (outObj.t1 > outObj.t2) {
				outObj.intersect = 0;
				return outObj;
			}
		}
	}
	outObj.intersect = 1;
	return outObj;
}
var CellPicker_STATIC = { clipLineWithPlane };
function vtkCellPicker(publicAPI, model) {
	model.classHierarchy.push("vtkCellPicker");
	const superClass = { ...publicAPI };
	function resetCellPickerInfo() {
		model.cellId = -1;
		model.pCoords[0] = 0;
		model.pCoords[1] = 0;
		model.pCoords[2] = 0;
		model.cellIJK[0] = 0;
		model.cellIJK[1] = 0;
		model.cellIJK[2] = 0;
		model.mapperNormal[0] = 0;
		model.mapperNormal[1] = 0;
		model.mapperNormal[2] = 1;
		model.pickNormal[0] = 0;
		model.pickNormal[1] = 0;
		model.pickNormal[2] = 1;
	}
	function resetPickInfo() {
		model.dataSet = null;
		model.mapper = null;
		resetCellPickerInfo();
	}
	publicAPI.initialize = () => {
		resetPickInfo();
		superClass.initialize();
	};
	publicAPI.computeSurfaceNormal = (data, cell, weights, normal) => {
		const normals = data.getPointData().getNormals();
		const cellDimension = 0;
		if (normals) {
			normal[0] = 0;
			normal[1] = 0;
			normal[2] = 0;
			const pointNormal = [];
			for (let i = 0; i < 3; i++) {
				normals.getTuple(cell.getPointsIds()[i], pointNormal);
				normal[0] += pointNormal[0] * weights[i];
				normal[1] += pointNormal[1] * weights[i];
				normal[2] += pointNormal[2] * weights[i];
			}
			(0,Core_Math/* .normalize */.S8)(normal);
		} else if (cellDimension === 2) {} else return 0;
		return 1;
	};
	publicAPI.pick = (selection, renderer) => {
		publicAPI.initialize();
		const pickResult = superClass.pick(selection, renderer);
		if (pickResult) {
			const camera = renderer.getActiveCamera();
			const cameraPos = [];
			camera.getPosition(cameraPos);
			if (camera.getParallelProjection()) {
				const cameraFocus = [];
				camera.getFocalPoint(cameraFocus);
				model.pickNormal[0] = cameraPos[0] - cameraFocus[0];
				model.pickNormal[1] = cameraPos[1] - cameraFocus[1];
				model.pickNormal[2] = cameraPos[2] - cameraFocus[2];
			} else {
				model.pickNormal[0] = cameraPos[0] - model.pickPosition[0];
				model.pickNormal[1] = cameraPos[1] - model.pickPosition[1];
				model.pickNormal[2] = cameraPos[2] - model.pickPosition[2];
			}
			(0,Core_Math/* .normalize */.S8)(model.pickNormal);
		}
		return pickResult;
	};
	model.intersectWithLine = (p1, p2, tolerance, prop, mapper) => {
		let tMin = Number.MAX_VALUE;
		let t1 = 0;
		let t2 = 1;
		const vtkCellPickerPlaneTol = 1e-14;
		const clipLine = clipLineWithPlane(mapper, model.transformMatrix, p1, p2, t1, t2);
		if (mapper && !clipLine.intersect) return Number.MAX_VALUE;
		if (mapper.isA("vtkImageMapper") || mapper.isA("vtkImageArrayMapper")) {
			const pickData = mapper.intersectWithLineForCellPicking(p1, p2);
			if (pickData) {
				tMin = pickData.t;
				model.cellIJK = pickData.ijk;
				model.pCoords = pickData.pCoords;
			}
		} else if (mapper.isA("vtkVolumeMapper")) {
			const interceptionObject = Box_default.intersectWithLine(mapper.getBounds(), p1, p2);
			t1 = interceptionObject?.t1 > clipLine.t1 ? interceptionObject.t1 : clipLine.t1;
			t2 = interceptionObject?.t2 < clipLine.t2 ? interceptionObject.t2 : clipLine.t2;
			tMin = model.intersectVolumeWithLine(p1, p2, t1, t2, tolerance, prop);
		} else if (mapper.isA("vtkMapper")) tMin = model.intersectActorWithLine(p1, p2, t1, t2, tolerance, mapper);
		if (tMin < model.globalTMin) {
			model.globalTMin = tMin;
			if (Math.abs(tMin - t1) < vtkCellPickerPlaneTol && clipLine.clippingPlaneId >= 0) {
				model.mapperPosition[0] = p1[0] * (1 - t1) + p2[0] * t1;
				model.mapperPosition[1] = p1[1] * (1 - t1) + p2[1] * t1;
				model.mapperPosition[2] = p1[2] * (1 - t1) + p2[2] * t1;
				const plane = [];
				mapper.getClippingPlaneInDataCoords(model.transformMatrix, clipLine.clippingPlaneId, plane);
				(0,Core_Math/* .normalize */.S8)(plane);
				model.mapperNormal[0] = -plane[0];
				model.mapperNormal[1] = -plane[1];
				model.mapperNormal[2] = -plane[2];
			}
			esm/* .vec3.transformMat4 */.eR.Z0(model.pickPosition, model.mapperPosition, model.transformMatrix);
			const mat = model.transformMatrix;
			model.mapperNormal[0] = mat[0] * model.pickNormal[0] + mat[4] * model.pickNormal[1] + mat[8] * model.pickNormal[2];
			model.mapperNormal[1] = mat[1] * model.pickNormal[0] + mat[5] * model.pickNormal[1] + mat[9] * model.pickNormal[2];
			model.mapperNormal[2] = mat[2] * model.pickNormal[0] + mat[6] * model.pickNormal[1] + mat[10] * model.pickNormal[2];
		}
		return tMin;
	};
	model.intersectVolumeWithLine = (p1, p2, t1, t2, tolerance, volume) => {
		let tMin = Number.MAX_VALUE;
		const mapper = volume.getMapper();
		const imageData = mapper.getInputData();
		const dims = imageData.getDimensions();
		const scalars = imageData.getPointData().getScalars().getData();
		const extent = imageData.getExtent();
		const imageTransform = imageData.getWorldToIndex();
		const numIComps = 1;
		let oWidth = mapper.getOpacityTextureWidth();
		if (oWidth <= 0) oWidth = 1024;
		const tmpTable = new Float32Array(oWidth);
		const opacityArray = new Float32Array(oWidth);
		let ofun;
		let oRange;
		const sampleDist = volume.getMapper().getSampleDistance();
		for (let c = 0; c < numIComps; ++c) {
			ofun = volume.getProperty().getScalarOpacity(c);
			oRange = ofun.getRange();
			ofun.getTable(oRange[0], oRange[1], oWidth, tmpTable, 1);
			const opacityFactor = sampleDist / volume.getProperty().getScalarOpacityUnitDistance(c);
			for (let i = 0; i < oWidth; ++i) opacityArray[i] = 1 - (1 - tmpTable[i]) ** opacityFactor;
		}
		const scale = oWidth / (oRange[1] - oRange[0] + 1);
		const q1 = [
			0,
			0,
			0,
			1
		];
		const q2 = [
			0,
			0,
			0,
			1
		];
		q1[0] = p1[0];
		q1[1] = p1[1];
		q1[2] = p1[2];
		q2[0] = p2[0];
		q2[1] = p2[1];
		q2[2] = p2[2];
		if (t1 !== 0 || t2 !== 1) for (let j = 0; j < 3; j++) {
			q1[j] = p1[j] * (1 - t1) + p2[j] * t1;
			q2[j] = p1[j] * (1 - t2) + p2[j] * t2;
		}
		const x1 = [
			0,
			0,
			0,
			0
		];
		const x2 = [
			0,
			0,
			0,
			0
		];
		esm/* .vec4.transformMat4 */.ln.Z0(x1, q1, imageTransform);
		esm/* .vec4.transformMat4 */.ln.Z0(x2, q2, imageTransform);
		const x = [
			0,
			0,
			0
		];
		const xi = [
			0,
			0,
			0
		];
		const sliceSize = dims[1] * dims[0];
		const rowSize = dims[0];
		const step = 1 / Math.sqrt((0,Core_Math/* .distance2BetweenPoints */.fm)(x1, x2));
		let insideVolume;
		for (let t = 0; t < 1; t += step) {
			insideVolume = true;
			for (let j = 0; j < 3; j++) x[j] = x1[j] * (1 - t) + x2[j] * t;
			for (let j = 0; j < 3; j++) {
				if (x[j] < extent[2 * j]) {
					x[j] = extent[2 * j];
					insideVolume = false;
				} else if (x[j] > extent[2 * j + 1]) {
					x[j] = extent[2 * j + 1];
					insideVolume = false;
				}
				xi[j] = Math.round(x[j]);
			}
			if (insideVolume) {
				let value = scalars[xi[2] * sliceSize + xi[1] * rowSize + xi[0]];
				if (value < oRange[0]) value = oRange[0];
				else if (value > oRange[1]) value = oRange[1];
				value = Math.floor((value - oRange[0]) * scale);
				if (tmpTable[value] > model.opacityThreshold) {
					tMin = t1 * (1 - t) + t2 * t;
					break;
				}
			}
		}
		return tMin;
	};
	model.intersectActorWithLine = (p1, p2, t1, t2, tolerance, mapper) => {
		let tMin = Number.MAX_VALUE;
		const minXYZ = [
			0,
			0,
			0
		];
		let pDistMin = Number.MAX_VALUE;
		const minPCoords = [
			0,
			0,
			0
		];
		let minCellId = null;
		let minCell = null;
		let minCellType = null;
		let subId = null;
		const x = [];
		const data = mapper.getInputData();
		const q1 = [
			0,
			0,
			0
		];
		const q2 = [
			0,
			0,
			0
		];
		q1[0] = p1[0];
		q1[1] = p1[1];
		q1[2] = p1[2];
		q2[0] = p2[0];
		q2[1] = p2[1];
		q2[2] = p2[2];
		if (t1 !== 0 || t2 !== 1) for (let j = 0; j < 3; j++) {
			q1[j] = p1[j] * (1 - t1) + p2[j] * t1;
			q2[j] = p1[j] * (1 - t2) + p2[j] * t2;
		}
		if (data.getCells) {
			if (!data.getCells()) data.buildLinks();
			const tempCellMap = createCellMap();
			const minCellMap = createCellMap();
			const numberOfCells = data.getNumberOfCells();
			for (let cellId = 0; cellId < numberOfCells; cellId++) {
				const pCoords = [
					0,
					0,
					0
				];
				minCellType = data.getCellType(cellId);
				if (minCellType === Constants/* .CellType.VTK_EMPTY_CELL */.vZ.VTK_EMPTY_CELL) continue;
				const cell = tempCellMap[minCellType];
				if (cell == null) continue;
				minCell = minCellMap[minCellType];
				data.getCell(cellId, cell);
				let cellPicked;
				if (CellTypes/* ["default"].hasSubCells */.Ay.hasSubCells(minCellType)) cellPicked = cell.intersectWithLine(t1, t2, p1, p2, tolerance, x, pCoords);
				else cellPicked = cell.intersectWithLine(p1, p2, tolerance, x, pCoords);
				if (cellPicked.intersect === 1 && cellPicked.t <= tMin + model.tolerance && cellPicked.t >= t1 && cellPicked.t <= t2) {
					const pDist = cell.getParametricDistance(pCoords);
					if (pDist < pDistMin || pDist === pDistMin && cellPicked.t < tMin) {
						tMin = cellPicked.t;
						pDistMin = pDist;
						subId = cellPicked.subId;
						minCellId = cellId;
						cell.deepCopy(minCell);
						for (let k = 0; k < 3; k++) {
							minXYZ[k] = x[k];
							minPCoords[k] = pCoords[k];
						}
					}
				}
			}
		}
		if (minCellId >= 0 && tMin < model.globalTMin) {
			resetPickInfo();
			const nbPointsInCell = minCell.getNumberOfPoints();
			const weights = new Array(nbPointsInCell);
			for (let i = 0; i < nbPointsInCell; i++) weights[i] = 0;
			const point = [];
			if (CellTypes/* ["default"].hasSubCells */.Ay.hasSubCells(minCellType)) minCell.evaluateLocation(subId, minPCoords, point, weights);
			else minCell.evaluateLocation(minPCoords, point, weights);
			model.dataSet = data;
			model.cellId = minCellId;
			model.pCoords[0] = minPCoords[0];
			model.pCoords[1] = minPCoords[1];
			model.pCoords[2] = minPCoords[2];
			let maxWeight = 0;
			let iMaxWeight = -1;
			for (let i = 0; i < nbPointsInCell; i++) if (weights[i] > maxWeight) {
				iMaxWeight = i;
				maxWeight = weights[i];
			}
			if (iMaxWeight !== -1) model.pointId = minCell.getPointsIds()[iMaxWeight];
			model.mapperPosition[0] = minXYZ[0];
			model.mapperPosition[1] = minXYZ[1];
			model.mapperPosition[2] = minXYZ[2];
			if (!publicAPI.computeSurfaceNormal(data, minCell, weights, model.mapperNormal)) {
				model.mapperNormal[0] = p1[0] - p2[0];
				model.mapperNormal[1] = p1[1] - p2[1];
				model.mapperNormal[2] = p1[2] - p2[2];
				(0,Core_Math/* .normalize */.S8)(model.mapperNormal);
			}
		}
		return tMin;
	};
}
var CellPicker_DEFAULT_VALUES = {
	cellId: -1,
	pCoords: [],
	cellIJK: [],
	pickNormal: [],
	mapperNormal: [],
	opacityThreshold: .2
};
function CellPicker_extend(publicAPI, model, initialValues = {}) {
	Object.assign(model, CellPicker_DEFAULT_VALUES, initialValues);
	Picker_default.extend(publicAPI, model, initialValues);
	macros/* ["default"].getArray */.Ay.getArray(publicAPI, model, [
		"pickNormal",
		"mapperNormal",
		"pCoords",
		"cellIJK"
	]);
	macros/* ["default"].setGet */.Ay.setGet(publicAPI, model, ["opacityThreshold"]);
	macros/* ["default"].get */.Ay.get(publicAPI, model, ["cellId"]);
	vtkCellPicker(publicAPI, model);
}
var CellPicker_newInstance = macros/* ["default"].newInstance */.Ay.newInstance(CellPicker_extend, "vtkCellPicker");
var CellPicker_default = {
	newInstance: CellPicker_newInstance,
	extend: CellPicker_extend,
	...CellPicker_STATIC
};
//#endregion


//# sourceMappingURL=CellPicker.js.map
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/Actor.js
var Actor = __webpack_require__(44404);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/CellArray.js
var CellArray = __webpack_require__(32461);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/Mapper.js + 1 modules
var Mapper = __webpack_require__(3901);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/Points.js
var Points = __webpack_require__(74973);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/PolyData.js + 7 modules
var PolyData = __webpack_require__(91542);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/Renderer.js + 2 modules
var Renderer = __webpack_require__(56726);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var dist_esm = __webpack_require__(88479);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/DataArray.js
var DataArray = __webpack_require__(445);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/Texture.js
var Texture = __webpack_require__(41090);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/ImageHelper.js
var ImageHelper = __webpack_require__(74821);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/vtkjs/RhombicuboctahedronSource/index.js




const MAIN_FACES = [
    4, 0, 1, 2, 3, 4, 4, 5, 6, 7, 4, 8, 9, 10, 11, 4, 12, 13, 14, 15, 4, 16, 17,
    18, 19, 4, 20, 21, 22, 23,
];
const CORNER_FACES = [
    3, 0, 16, 8, 3, 1, 9, 20, 3, 2, 23, 13, 3, 3, 12, 19, 3, 4, 17, 11, 3, 5, 10,
    21, 3, 6, 14, 22, 3, 7, 18, 15,
];
const EDGE_FACES = [
    4, 0, 1, 9, 8, 4, 1, 2, 23, 20, 4, 2, 3, 12, 13, 4, 3, 0, 16, 19, 4, 4, 5, 10,
    11, 4, 5, 6, 22, 21, 4, 6, 7, 15, 14, 4, 7, 4, 17, 18, 4, 8, 11, 17, 16, 4, 9,
    20, 21, 10, 4, 13, 23, 22, 14, 4, 12, 19, 18, 15,
];
const FACE_HALF_SIZE = 0.792;
function vtkRhombicuboctahedronSource(publicAPI, model) {
    model.classHierarchy.push('vtkRhombicuboctahedronSource');
    publicAPI.requestData = (inData, outData) => {
        const polyData = outData[0]?.initialize() || PolyData/* ["default"].newInstance */.Ay.newInstance();
        outData[0] = polyData;
        let scale = 1.0;
        if (model.scale !== undefined && model.scale !== null) {
            if (Array.isArray(model.scale)) {
                scale = model.scale[0] || 1.0;
            }
            else if (typeof model.scale === 'number') {
                scale = model.scale;
            }
        }
        const phi = 1.4;
        const vertices = [];
        vertices.push(-FACE_HALF_SIZE, -FACE_HALF_SIZE, -phi);
        vertices.push(FACE_HALF_SIZE, -FACE_HALF_SIZE, -phi);
        vertices.push(FACE_HALF_SIZE, FACE_HALF_SIZE, -phi);
        vertices.push(-FACE_HALF_SIZE, FACE_HALF_SIZE, -phi);
        vertices.push(-FACE_HALF_SIZE, -FACE_HALF_SIZE, phi);
        vertices.push(FACE_HALF_SIZE, -FACE_HALF_SIZE, phi);
        vertices.push(FACE_HALF_SIZE, FACE_HALF_SIZE, phi);
        vertices.push(-FACE_HALF_SIZE, FACE_HALF_SIZE, phi);
        vertices.push(-FACE_HALF_SIZE, -phi, -FACE_HALF_SIZE);
        vertices.push(FACE_HALF_SIZE, -phi, -FACE_HALF_SIZE);
        vertices.push(FACE_HALF_SIZE, -phi, FACE_HALF_SIZE);
        vertices.push(-FACE_HALF_SIZE, -phi, FACE_HALF_SIZE);
        vertices.push(-FACE_HALF_SIZE, phi, -FACE_HALF_SIZE);
        vertices.push(FACE_HALF_SIZE, phi, -FACE_HALF_SIZE);
        vertices.push(FACE_HALF_SIZE, phi, FACE_HALF_SIZE);
        vertices.push(-FACE_HALF_SIZE, phi, FACE_HALF_SIZE);
        vertices.push(-phi, -FACE_HALF_SIZE, -FACE_HALF_SIZE);
        vertices.push(-phi, -FACE_HALF_SIZE, FACE_HALF_SIZE);
        vertices.push(-phi, FACE_HALF_SIZE, FACE_HALF_SIZE);
        vertices.push(-phi, FACE_HALF_SIZE, -FACE_HALF_SIZE);
        vertices.push(phi, -FACE_HALF_SIZE, -FACE_HALF_SIZE);
        vertices.push(phi, -FACE_HALF_SIZE, FACE_HALF_SIZE);
        vertices.push(phi, FACE_HALF_SIZE, FACE_HALF_SIZE);
        vertices.push(phi, FACE_HALF_SIZE, -FACE_HALF_SIZE);
        let textureCoords = null;
        if (model.generate3DTextureCoordinates) {
            textureCoords = new Float64Array(24 * 3);
            for (let i = 0; i < 24; i++) {
                const vx = vertices[i * 3];
                const vy = vertices[i * 3 + 1];
                const vz = vertices[i * 3 + 2];
                const len = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1;
                textureCoords[i * 3] = vx / len;
                textureCoords[i * 3 + 1] = vy / len;
                textureCoords[i * 3 + 2] = vz / len;
            }
        }
        for (let i = 0; i < vertices.length; i++) {
            vertices[i] *= scale;
        }
        const vertexArray = Float64Array.from(vertices);
        polyData.getPoints().setData(vertexArray, 3);
        const normals = new Float64Array(24 * 3);
        for (let i = 0; i < 24; i++) {
            const x = vertexArray[i * 3];
            const y = vertexArray[i * 3 + 1];
            const z = vertexArray[i * 3 + 2];
            const len = Math.sqrt(x * x + y * y + z * z);
            normals[i * 3] = x / len;
            normals[i * 3 + 1] = y / len;
            normals[i * 3 + 2] = z / len;
        }
        const normalArray = DataArray/* ["default"].newInstance */.Ay.newInstance({
            name: 'Normals',
            values: normals,
            numberOfComponents: 3,
        });
        polyData.getPointData().setNormals(normalArray);
        if (textureCoords) {
            const tcoords = DataArray/* ["default"].newInstance */.Ay.newInstance({
                name: 'TextureCoordinates',
                values: textureCoords,
                numberOfComponents: 3,
            });
            polyData.getPointData().setTCoords(tcoords);
        }
        const allFaces = [];
        if (model.generateMainFaces) {
            allFaces.push(...MAIN_FACES);
        }
        if (model.generateEdgeFaces) {
            allFaces.push(...EDGE_FACES);
        }
        if (model.generateCornerFaces) {
            allFaces.push(...CORNER_FACES);
        }
        if (allFaces.length > 0) {
            const polys = CellArray/* ["default"].newInstance */.Ay.newInstance({
                values: Uint16Array.from(allFaces),
            });
            polyData.getPolys().deepCopy(polys);
        }
        else {
            polyData.getPolys().initialize();
        }
        polyData.modified();
    };
}
const RhombicuboctahedronSource_DEFAULT_VALUES = {
    scale: 1.0,
    generate3DTextureCoordinates: false,
    generateMainFaces: true,
    generateEdgeFaces: true,
    generateCornerFaces: true,
};
function RhombicuboctahedronSource_extend(publicAPI, model, initialValues = {}) {
    Object.assign(model, RhombicuboctahedronSource_DEFAULT_VALUES, initialValues);
    macros/* ["default"].obj */.Ay.obj(publicAPI, model);
    macros/* ["default"].setGet */.Ay.setGet(publicAPI, model, [
        'scale',
        'generate3DTextureCoordinates',
        'generateMainFaces',
        'generateEdgeFaces',
        'generateCornerFaces',
    ]);
    macros/* ["default"].algo */.Ay.algo(publicAPI, model, 0, 1);
    vtkRhombicuboctahedronSource(publicAPI, model);
}
const RhombicuboctahedronSource_newInstance = macros/* ["default"].newInstance */.Ay.newInstance(RhombicuboctahedronSource_extend, 'vtkRhombicuboctahedronSource');
/* export default */ const RhombicuboctahedronSource = ({ newInstance: RhombicuboctahedronSource_newInstance, extend: RhombicuboctahedronSource_extend });

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/vtkjs/AnnotatedRhombicuboctahedronActor/index.js







function createMainFacesMesh(scale, faceColors, faceTextures) {
    const source = RhombicuboctahedronSource.newInstance({
        generate3DTextureCoordinates: false,
        generateMainFaces: true,
        generateEdgeFaces: false,
        generateCornerFaces: false,
        scale: scale,
    });
    source.update();
    const data = source.getOutputData();
    if (data) {
        const tcoords = [];
        for (let faceIdx = 0; faceIdx < 6; faceIdx++) {
            const col = faceIdx % 3;
            const row = Math.floor(faceIdx / 3);
            const u0 = col / 3.0;
            const u1 = (col + 1) / 3.0;
            const v0 = row / 2.0;
            const v1 = (row + 1) / 2.0;
            tcoords.push(u0, v0);
            tcoords.push(u1, v0);
            tcoords.push(u1, v1);
            tcoords.push(u0, v1);
        }
        const tcoordsArray = DataArray/* ["default"].newInstance */.Ay.newInstance({
            name: 'TextureCoordinates',
            values: new Float32Array(tcoords),
            numberOfComponents: 2,
        });
        data.getPointData().setTCoords(tcoordsArray);
        data.modified();
    }
    return data;
}
function createEdgeFacesMesh(scale, color) {
    const source = RhombicuboctahedronSource.newInstance({
        generate3DTextureCoordinates: false,
        generateMainFaces: false,
        generateEdgeFaces: true,
        generateCornerFaces: false,
        scale: scale,
    });
    source.update();
    const data = source.getOutputData();
    if (data) {
        const colors = [];
        const numCells = data.getNumberOfCells();
        for (let i = 0; i < numCells; i++) {
            colors.push(color[0], color[1], color[2], 255);
        }
        const colorsArray = DataArray/* ["default"].newInstance */.Ay.newInstance({
            name: 'Colors',
            values: new Uint8Array(colors),
            numberOfComponents: 4,
        });
        data.getCellData().setScalars(colorsArray);
        data.modified();
    }
    return data;
}
function createCornerFacesMesh(scale, color) {
    const source = RhombicuboctahedronSource.newInstance({
        generate3DTextureCoordinates: false,
        generateMainFaces: false,
        generateEdgeFaces: false,
        generateCornerFaces: true,
        scale: scale,
    });
    source.update();
    const data = source.getOutputData();
    if (data) {
        const colors = [];
        const numCells = data.getNumberOfCells();
        for (let i = 0; i < numCells; i++) {
            colors.push(color[0], color[1], color[2], 255);
        }
        const colorsArray = DataArray/* ["default"].newInstance */.Ay.newInstance({
            name: 'Colors',
            values: new Uint8Array(colors),
            numberOfComponents: 4,
        });
        data.getCellData().setScalars(colorsArray);
        data.modified();
    }
    return data;
}
function createTextureAtlas(faceTextureData) {
    const faceSize = 256;
    const canvas = document.createElement('canvas');
    canvas.width = faceSize * 3;
    canvas.height = faceSize * 2;
    const ctx = canvas.getContext('2d');
    faceTextureData.forEach((data, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        const x = col * faceSize;
        const y = row * faceSize;
        ctx.fillStyle = `rgb(${data.faceColor[0]}, ${data.faceColor[1]}, ${data.faceColor[2]})`;
        ctx.fillRect(x, y, faceSize, faceSize);
        if (data.text) {
            ctx.save();
            ctx.translate(x + faceSize / 2, y + faceSize / 2);
            if (data.flipVertical) {
                ctx.scale(1, -1);
            }
            if (data.flipHorizontal) {
                ctx.scale(-1, 1);
            }
            ctx.rotate(((data.rotation || 0) * Math.PI) / 180);
            ctx.fillStyle = `rgb(${data.textColor[0]}, ${data.textColor[1]}, ${data.textColor[2]})`;
            ctx.font = 'bold 180px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(data.text, 0, 0);
            ctx.restore();
        }
    });
    return ImageHelper/* ["default"].canvasToImageData */.A.canvasToImageData(canvas);
}
function vtkAnnotatedRhombicuboctahedronActor(publicAPI, model) {
    model.classHierarchy.push('vtkAnnotatedRhombicuboctahedronActor');
    function updateAllFaceTextures() { }
    function createActors() {
        let sourceScale = 1.0;
        if (model.scale !== undefined && model.scale !== null) {
            if (Array.isArray(model.scale)) {
                sourceScale = model.scale[0] || 1.0;
            }
            else if (typeof model.scale === 'number') {
                sourceScale = model.scale;
            }
        }
        const actors = [];
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result
                ? result.slice(1, 4).map((n) => parseInt(n, 16))
                : [255, 255, 255];
        };
        const parseFontColor = (color) => {
            if (!color) {
                return [0, 0, 0];
            }
            const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (rgbMatch) {
                return [
                    parseInt(rgbMatch[1], 10),
                    parseInt(rgbMatch[2], 10),
                    parseInt(rgbMatch[3], 10),
                ];
            }
            if (color.startsWith('#')) {
                return hexToRgb(color);
            }
            const namedColors = {
                black: [0, 0, 0],
                white: [255, 255, 255],
                red: [255, 0, 0],
                green: [0, 255, 0],
                blue: [0, 0, 255],
            };
            if (namedColors[color.toLowerCase()]) {
                return namedColors[color.toLowerCase()];
            }
            return [0, 0, 0];
        };
        const faceColors = {
            zMinus: hexToRgb(model.zMinusFaceProperty.faceColor || model.defaultStyle.faceColor),
            zPlus: hexToRgb(model.zPlusFaceProperty.faceColor || model.defaultStyle.faceColor),
            yMinus: hexToRgb(model.yMinusFaceProperty.faceColor || model.defaultStyle.faceColor),
            yPlus: hexToRgb(model.yPlusFaceProperty.faceColor || model.defaultStyle.faceColor),
            xMinus: hexToRgb(model.xMinusFaceProperty.faceColor || model.defaultStyle.faceColor),
            xPlus: hexToRgb(model.xPlusFaceProperty.faceColor || model.defaultStyle.faceColor),
        };
        if (model.showMainFaces !== false) {
            const faceTextureData = [
                {
                    faceColor: faceColors.zMinus,
                    text: model.zMinusFaceProperty.text || 'I',
                    textColor: parseFontColor(model.zMinusFaceProperty.fontColor || model.defaultStyle.fontColor),
                    rotation: 0,
                },
                {
                    faceColor: faceColors.zPlus,
                    text: model.zPlusFaceProperty.text || 'S',
                    textColor: parseFontColor(model.zPlusFaceProperty.fontColor || model.defaultStyle.fontColor),
                    rotation: 0,
                    flipVertical: true,
                },
                {
                    faceColor: faceColors.yMinus,
                    text: model.yMinusFaceProperty.text || 'A',
                    textColor: parseFontColor(model.yMinusFaceProperty.fontColor || model.defaultStyle.fontColor),
                    rotation: 180,
                },
                {
                    faceColor: faceColors.yPlus,
                    text: model.yPlusFaceProperty.text || 'P',
                    textColor: parseFontColor(model.yPlusFaceProperty.fontColor || model.defaultStyle.fontColor),
                    rotation: 180,
                },
                {
                    faceColor: faceColors.xMinus,
                    text: model.xMinusFaceProperty.text || 'L',
                    textColor: parseFontColor(model.xMinusFaceProperty.fontColor || model.defaultStyle.fontColor),
                    rotation: 90,
                    flipVertical: true,
                },
                {
                    faceColor: faceColors.xPlus,
                    text: model.xPlusFaceProperty.text || 'R',
                    textColor: parseFontColor(model.xPlusFaceProperty.fontColor || model.defaultStyle.fontColor),
                    rotation: 90,
                },
            ];
            const atlasImageData = createTextureAtlas(faceTextureData);
            const mainData = createMainFacesMesh(sourceScale, faceColors, null);
            if (mainData) {
                const mainFacesActor = Actor/* ["default"].newInstance */.Ay.newInstance();
                const mainMapper = Mapper/* ["default"].newInstance */.Ay.newInstance();
                mainMapper.setInputData(mainData);
                mainFacesActor.setMapper(mainMapper);
                const texture = Texture/* ["default"].newInstance */.Ay.newInstance();
                texture.setInputData(atlasImageData);
                texture.setInterpolate(true);
                mainFacesActor.addTexture(texture);
                const property = mainFacesActor.getProperty();
                property.setBackfaceCulling(false);
                property.setFrontfaceCulling(false);
                property.setLighting(false);
                property.setAmbient(1.0);
                property.setDiffuse(0.0);
                property.setSpecular(0.0);
                actors.push(mainFacesActor);
            }
        }
        if (model.showEdgeFaces !== false) {
            const edgeColor = model.edgeColor ?? [200, 200, 200];
            const edgeData = createEdgeFacesMesh(sourceScale, edgeColor);
            if (edgeData) {
                const edgeFacesActor = Actor/* ["default"].newInstance */.Ay.newInstance();
                const edgeMapper = Mapper/* ["default"].newInstance */.Ay.newInstance();
                edgeMapper.setInputData(edgeData);
                edgeMapper.setScalarModeToUseCellData();
                edgeMapper.setScalarVisibility(true);
                edgeMapper.setColorModeToDirectScalars();
                edgeFacesActor.setMapper(edgeMapper);
                const edgeProperty = edgeFacesActor.getProperty();
                edgeProperty.setBackfaceCulling(false);
                edgeProperty.setFrontfaceCulling(false);
                edgeProperty.setLighting(false);
                edgeProperty.setAmbient(1.0);
                edgeProperty.setDiffuse(0.0);
                edgeProperty.setSpecular(0.0);
                actors.push(edgeFacesActor);
            }
        }
        if (model.showCornerFaces !== false) {
            const cornerColor = model.cornerColor ?? [150, 150, 150];
            const cornerData = createCornerFacesMesh(sourceScale, cornerColor);
            if (cornerData) {
                const cornerFacesActor = Actor/* ["default"].newInstance */.Ay.newInstance();
                const cornerMapper = Mapper/* ["default"].newInstance */.Ay.newInstance();
                cornerMapper.setInputData(cornerData);
                cornerMapper.setScalarModeToUseCellData();
                cornerMapper.setScalarVisibility(true);
                cornerMapper.setColorModeToDirectScalars();
                cornerFacesActor.setMapper(cornerMapper);
                const cornerProperty = cornerFacesActor.getProperty();
                cornerProperty.setBackfaceCulling(false);
                cornerProperty.setFrontfaceCulling(false);
                cornerProperty.setLighting(false);
                cornerProperty.setAmbient(1.0);
                cornerProperty.setDiffuse(0.0);
                cornerProperty.setSpecular(0.0);
                actors.push(cornerFacesActor);
            }
        }
        return actors;
    }
    publicAPI.setDefaultStyle = (style) => {
        model.defaultStyle = { ...model.defaultStyle, ...style };
    };
    publicAPI.setXPlusFaceProperty = (prop) => {
        Object.assign(model.xPlusFaceProperty, prop);
        publicAPI.modified();
    };
    publicAPI.setXMinusFaceProperty = (prop) => {
        Object.assign(model.xMinusFaceProperty, prop);
        publicAPI.modified();
    };
    publicAPI.setYPlusFaceProperty = (prop) => {
        Object.assign(model.yPlusFaceProperty, prop);
        publicAPI.modified();
    };
    publicAPI.setYMinusFaceProperty = (prop) => {
        Object.assign(model.yMinusFaceProperty, prop);
        publicAPI.modified();
    };
    publicAPI.setZPlusFaceProperty = (prop) => {
        Object.assign(model.zPlusFaceProperty, prop);
        publicAPI.modified();
    };
    publicAPI.setZMinusFaceProperty = (prop) => {
        Object.assign(model.zMinusFaceProperty, prop);
        publicAPI.modified();
    };
    publicAPI.setShowMainFaces = (show) => {
        if (model.showMainFaces !== show) {
            model.showMainFaces = show;
            updateAllFaceTextures();
        }
    };
    publicAPI.setShowEdgeFaces = (show) => {
        if (model.showEdgeFaces !== show) {
            model.showEdgeFaces = show;
            updateAllFaceTextures();
        }
    };
    publicAPI.setShowCornerFaces = (show) => {
        if (model.showCornerFaces !== show) {
            model.showCornerFaces = show;
            updateAllFaceTextures();
        }
    };
    publicAPI.setRhombScale = (scale) => {
        if (model.scale !== scale) {
            model.scale = scale;
        }
    };
    publicAPI.getActors = () => {
        return createActors();
    };
}
const AnnotatedRhombicuboctahedronActor_DEFAULT_VALUES = {
    defaultStyle: {
        text: '',
        faceColor: 'white',
        faceRotation: 0,
        fontFamily: 'Arial',
        fontColor: 'black',
        fontStyle: 'normal',
        fontSizeScale: (resolution) => resolution / 1.8,
        edgeThickness: 0.1,
        edgeColor: 'black',
        resolution: 200,
    },
    xPlusFaceProperty: {},
    xMinusFaceProperty: {},
    yPlusFaceProperty: {},
    yMinusFaceProperty: {},
    zPlusFaceProperty: {},
    zMinusFaceProperty: {},
    showMainFaces: true,
    showEdgeFaces: true,
    showCornerFaces: true,
    scale: 1.0,
};
function AnnotatedRhombicuboctahedronActor_extend(publicAPI, model, initialValues = {}) {
    Object.assign(model, AnnotatedRhombicuboctahedronActor_DEFAULT_VALUES, initialValues);
    Actor/* ["default"].extend */.Ay.extend(publicAPI, model, initialValues);
    model.xPlusFaceProperty = { ...model.xPlusFaceProperty };
    model.xMinusFaceProperty = { ...model.xMinusFaceProperty };
    model.yPlusFaceProperty = { ...model.yPlusFaceProperty };
    model.yMinusFaceProperty = { ...model.yMinusFaceProperty };
    model.zPlusFaceProperty = { ...model.zPlusFaceProperty };
    model.zMinusFaceProperty = { ...model.zMinusFaceProperty };
    macros/* ["default"].get */.Ay.get(publicAPI, model, [
        'defaultStyle',
        'xPlusFaceProperty',
        'xMinusFaceProperty',
        'yPlusFaceProperty',
        'yMinusFaceProperty',
        'zPlusFaceProperty',
        'zMinusFaceProperty',
        'showMainFaces',
        'showEdgeFaces',
        'showCornerFaces',
        'scale',
    ]);
    vtkAnnotatedRhombicuboctahedronActor(publicAPI, model);
}
const AnnotatedRhombicuboctahedronActor_newInstance = macros/* ["default"].newInstance */.Ay.newInstance(AnnotatedRhombicuboctahedronActor_extend, 'vtkAnnotatedRhombicuboctahedronActor');
/* export default */ const AnnotatedRhombicuboctahedronActor = ({ newInstance: AnnotatedRhombicuboctahedronActor_newInstance, extend: AnnotatedRhombicuboctahedronActor_extend });

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/interactionDragCoordinator.js
var interactionDragCoordinator = __webpack_require__(18445);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/vtkjs/OrientationControllerWidget/index.js










class vtkOrientationControllerWidget {
    constructor() {
        this.actors = new Map();
        this.pickers = new Map();
        this.overlayRenderers = new Map();
        this.renderWindows = new Map();
        this.highlightedFace = null;
        this.mouseHandlers = new Map();
        this._highlightColor = [255, 255, 255];
        this._restingAmbient = 1.0;
        this._hoverAmbient = 1.0;
    }
    createActors(config) {
        const rgbToHex = (rgb) => {
            return `#${rgb
                .map((x) => {
                const hex = Math.round(x).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            })
                .join('')}`;
        };
        const rgbToHexColor = (rgb) => {
            return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
        };
        const actorFactory = AnnotatedRhombicuboctahedronActor.newInstance({
            edgeColor: config.edgeColor ?? [200, 200, 200],
            cornerColor: config.cornerColor ?? [150, 150, 150],
        });
        const defaultStyle = {
            fontStyle: 'bold',
            fontFamily: 'Arial',
            fontColor: 'black',
            fontSizeScale: (res) => res / 2,
            faceColor: rgbToHex(config.faceColors.topBottom),
            edgeThickness: 0.1,
            edgeColor: 'black',
            resolution: 400,
        };
        actorFactory.setDefaultStyle(defaultStyle);
        actorFactory.setXPlusFaceProperty({
            text: 'L',
            faceColor: rgbToHex(config.faceColors.leftRight),
            fontColor: rgbToHexColor(config.letterColors.xPlus),
            faceRotation: 0,
        });
        actorFactory.setXMinusFaceProperty({
            text: 'R',
            faceColor: rgbToHex(config.faceColors.leftRight),
            fontColor: rgbToHexColor(config.letterColors.xMinus),
            faceRotation: 0,
        });
        actorFactory.setYPlusFaceProperty({
            text: 'P',
            faceColor: rgbToHex(config.faceColors.frontBack),
            fontColor: rgbToHexColor(config.letterColors.yPlus),
            faceRotation: 180,
        });
        actorFactory.setYMinusFaceProperty({
            text: 'A',
            faceColor: rgbToHex(config.faceColors.frontBack),
            fontColor: rgbToHexColor(config.letterColors.yMinus),
            faceRotation: 0,
        });
        actorFactory.setZPlusFaceProperty({
            text: 'S',
            faceColor: rgbToHex(config.faceColors.topBottom),
            fontColor: rgbToHexColor(config.letterColors.zPlus),
        });
        actorFactory.setZMinusFaceProperty({
            text: 'I',
            faceColor: rgbToHex(config.faceColors.topBottom),
            fontColor: rgbToHexColor(config.letterColors.zMinus),
        });
        actorFactory.setShowMainFaces(true);
        actorFactory.setShowEdgeFaces(config.showEdgeFaces);
        actorFactory.setShowCornerFaces(config.showCornerFaces);
        const actors = actorFactory.getActors();
        this._highlightColor = config.highlightColor ?? [255, 255, 255];
        this._restingAmbient = config.restingAmbient ?? 1.0;
        this._hoverAmbient = config.hoverAmbient ?? 1.0;
        actors.forEach((actor) => {
            const property = actor.getProperty();
            property.setOpacity(config.opacity);
            property.setAmbient(this._restingAmbient);
            actor.setVisibility(true);
        });
        return actors;
    }
    addActorsToViewport(viewportId, viewport, actors) {
        const existingActors = this.actors.get(viewportId);
        if (existingActors) {
            this.removeActorsFromViewport(viewportId, viewport);
        }
        const renderWindow = viewport
            .getRenderingEngine()
            .getOffscreenMultiRenderWindow(viewport.id)
            .getRenderWindow();
        const mainRenderer = viewport
            .getRenderingEngine()
            ?.getRenderer(viewportId) ?? viewport.getRenderer();
        const vtkMainRenderer = mainRenderer;
        const overlayRenderer = Renderer/* ["default"].newInstance */.Ay.newInstance();
        overlayRenderer.setLayer(1);
        overlayRenderer.setInteractive(false);
        overlayRenderer.setPreserveColorBuffer(true);
        overlayRenderer.setActiveCamera(vtkMainRenderer.getActiveCamera());
        const vp = vtkMainRenderer.getViewport();
        overlayRenderer.setViewport(...vp);
        if (renderWindow.getNumberOfLayers() < 2) {
            renderWindow.setNumberOfLayers(2);
        }
        renderWindow.addRenderer(overlayRenderer);
        actors.forEach((actor) => {
            overlayRenderer.addActor(actor);
        });
        this.actors.set(viewportId, actors);
        this.overlayRenderers.set(viewportId, overlayRenderer);
        this.renderWindows.set(viewportId, renderWindow);
    }
    removeActorsFromViewport(viewportId, _viewport) {
        const actors = this.actors.get(viewportId);
        const overlayRenderer = this.overlayRenderers.get(viewportId);
        const renderWindow = this.renderWindows.get(viewportId);
        if (actors && overlayRenderer) {
            actors.forEach((actor) => {
                overlayRenderer.removeActor(actor);
            });
            if (renderWindow) {
                renderWindow.removeRenderer(overlayRenderer);
            }
            overlayRenderer.delete();
        }
        this.actors.delete(viewportId);
        this.overlayRenderers.delete(viewportId);
        this.renderWindows.delete(viewportId);
    }
    setupPicker(viewportId, actors) {
        const picker = CellPicker_default.newInstance({ opacityThreshold: 0.0001 });
        picker.setPickFromList(true);
        picker.setTolerance(0.001);
        picker.initializePickList();
        actors.forEach((actor) => {
            picker.addPickList(actor);
        });
        this.pickers.set(viewportId, picker);
        return picker;
    }
    pickAtPosition(evt, viewportId, viewport, element, actors) {
        const picker = this.pickers.get(viewportId);
        if (!picker) {
            return null;
        }
        const renderer = this.overlayRenderers.get(viewportId) ??
            viewport
                .getRenderingEngine()
                ?.getRenderer(viewportId) ??
            viewport.getRenderer();
        if (!renderer) {
            return null;
        }
        const rect = element.getBoundingClientRect();
        const x = evt.clientX - rect.left;
        const y = evt.clientY - rect.top;
        const devicePixelRatio = window.devicePixelRatio || 1;
        const canvasPosWithDPR = [x * devicePixelRatio, y * devicePixelRatio];
        const canvas = viewport.canvas;
        const { width, height } = canvas;
        const [xMin, yMin, xMax, yMax] = renderer.getViewport();
        const viewportWidth = xMax - xMin;
        const viewportHeight = yMax - yMin;
        const scaledX = (canvasPosWithDPR[0] / width) * viewportWidth * width;
        const scaledY = (canvasPosWithDPR[1] / height) * viewportHeight * height;
        const displayCoord = [scaledX, viewportHeight * height - scaledY];
        const displayCoords = [
            displayCoord[0],
            displayCoord[1],
            0,
        ];
        picker.pick(displayCoords, renderer);
        const pickedActors = picker.getActors();
        if (pickedActors.length === 0) {
            return null;
        }
        const pickedActor = pickedActors[0];
        const cellId = picker.getCellId();
        if (actors.includes(pickedActor) && cellId !== -1) {
            const actorIndex = actors.indexOf(pickedActor);
            return { pickedActor, cellId, actorIndex };
        }
        return null;
    }
    calculateMarkerPosition(viewport, position, screenSizePixels) {
        const canvas = viewport.canvas;
        if (!canvas) {
            return null;
        }
        const devicePixelRatio = window.devicePixelRatio || 1;
        const canvasWidth = canvas.clientWidth || canvas.width / devicePixelRatio;
        const canvasHeight = canvas.clientHeight || canvas.height / devicePixelRatio;
        const marginRatio = viewport.type === dist_esm.Enums.ViewportType.VOLUME_3D ? 1.3 : 1.1;
        const marginPxRaw = marginRatio * screenSizePixels;
        const halfPx = screenSizePixels * 0.5;
        const maxMarginX = Math.max(0, (canvasWidth - screenSizePixels) / 2);
        const maxMarginY = Math.max(0, (canvasHeight - screenSizePixels) / 2);
        const marginPx = Math.min(marginPxRaw, maxMarginX, maxMarginY);
        let canvasX;
        let canvasY;
        switch (position) {
            case 'top-left':
                canvasX = marginPx + halfPx;
                canvasY = marginPx + halfPx;
                break;
            case 'top-right':
                canvasX = canvasWidth - marginPx - halfPx;
                canvasY = marginPx + halfPx;
                break;
            case 'bottom-left':
                canvasX = marginPx + halfPx;
                canvasY = canvasHeight - marginPx - halfPx;
                break;
            default:
                canvasX = canvasWidth - marginPx - halfPx;
                canvasY = canvasHeight - marginPx - halfPx;
        }
        const canvasPos = [canvasX, canvasY];
        const worldPos = viewport.canvasToWorld(canvasPos);
        return [worldPos[0], worldPos[1], worldPos[2]];
    }
    positionActors(viewport, actors, config) {
        const canvas = viewport.canvas;
        if (!canvas) {
            console.warn('OrientationControllerWidget: No canvas available');
            return false;
        }
        const mainRenderer = viewport
            .getRenderingEngine()
            ?.getRenderer(viewport.id) ?? viewport.getRenderer();
        const camera = mainRenderer?.getActiveCamera();
        if (!camera) {
            return false;
        }
        const parallelScale = camera.getParallelScale();
        const worldHeight = parallelScale * 2;
        const devicePixelRatio = window.devicePixelRatio || 1;
        const canvasHeight = canvas.clientHeight || canvas.height / devicePixelRatio;
        const canvasWidth = canvas.clientWidth || canvas.width / devicePixelRatio;
        const worldUnitsPerPixel = worldHeight / canvasHeight;
        const canvasSize = Math.min(canvasWidth, canvasHeight);
        const screenSizePixels = canvasSize * config.size;
        const markerSize = screenSizePixels * worldUnitsPerPixel;
        actors.forEach((actor) => {
            actor.setScale(markerSize, markerSize, markerSize);
            const worldPos = this.calculateMarkerPosition(viewport, config.position, screenSizePixels);
            if (!worldPos) {
                console.warn('OrientationControllerWidget: Could not get world position');
                return;
            }
            actor.setPosition(worldPos[0], worldPos[1], worldPos[2]);
            actor.setOrientation(0, 0, 0);
        });
        return true;
    }
    highlightFace(actor, cellId, viewport, isMainFace = false) {
        if (this.highlightedFace &&
            this.highlightedFace.actor === actor &&
            this.highlightedFace.cellId === cellId &&
            this.highlightedFace.isMainFace === isMainFace) {
            return;
        }
        this.clearHighlight();
        if (isMainFace) {
            const textureCollection = actor.getTextures?.();
            const textureCandidate = Array.isArray(textureCollection)
                ? textureCollection[0]
                : textureCollection?.getItem?.(0);
            const texture = textureCandidate;
            const imageData = texture?.getInputData?.();
            const scalars = imageData?.getPointData().getScalars();
            const pixels = scalars?.getData();
            const dims = imageData?.getDimensions();
            if (!imageData ||
                !scalars ||
                !pixels ||
                !dims ||
                cellId < 0 ||
                cellId > 5) {
                const mapper = actor.getMapper();
                const polyData = mapper.getInputData();
                if (!polyData?.getCellPoints) {
                    return;
                }
                const { cellPointIds } = polyData.getCellPoints(cellId);
                if (!cellPointIds || cellPointIds.length < 3) {
                    return;
                }
                const src = polyData.getPoints().getData();
                const coords = [];
                Array.from(cellPointIds).forEach((pid) => {
                    const o = pid * 3;
                    coords.push(src[o], src[o + 1], src[o + 2]);
                });
                const points = Points/* ["default"].newInstance */.Ay.newInstance();
                points.setData(new Float32Array(coords), 3);
                const polys = CellArray/* ["default"].newInstance */.Ay.newInstance({
                    values: new Uint32Array([
                        cellPointIds.length,
                        ...Array.from(cellPointIds, (_, i) => i),
                    ]),
                });
                const poly = PolyData/* ["default"].newInstance */.Ay.newInstance();
                poly.setPoints(points);
                poly.setPolys(polys);
                const faceMapper = Mapper/* ["default"].newInstance */.Ay.newInstance();
                faceMapper.setInputData(poly);
                const faceActor = Actor/* ["default"].newInstance */.Ay.newInstance();
                faceActor.setMapper(faceMapper);
                const [sx, sy, sz] = actor.getScale();
                const [px, py, pz] = actor.getPosition();
                const [ox, oy, oz] = actor.getOrientation();
                faceActor.setScale(sx, sy, sz);
                faceActor.setPosition(px, py, pz);
                faceActor.setOrientation(ox, oy, oz);
                faceActor.setPickable(false);
                const p = faceActor.getProperty();
                p.setLighting(false);
                p.setAmbient(1);
                p.setDiffuse(0);
                p.setColor(1, 1, 1);
                p.setOpacity(0.58);
                this.overlayRenderers.get(viewport.id)?.addActor(faceActor);
                this.highlightedFace = {
                    actor,
                    cellId,
                    originalColor: [0, 0, 0, 0],
                    viewport,
                    isMainFace: true,
                    mainFaceHighlightActor: faceActor,
                };
                viewport.render();
                return;
            }
            const [imageWidth, imageHeight] = dims;
            const tileWidth = Math.floor(imageWidth / 3);
            const tileHeight = Math.floor(imageHeight / 2);
            const tileCol = cellId % 3;
            const tileRow = Math.floor(cellId / 3);
            const x0 = tileCol * tileWidth;
            const y0 = tileRow * tileHeight;
            const tileBackup = new Uint8Array(tileWidth * tileHeight * 4);
            let b = 0;
            for (let y = 0; y < tileHeight; y++) {
                for (let x = 0; x < tileWidth; x++) {
                    const srcIndex = ((y0 + y) * imageWidth + (x0 + x)) * 4;
                    tileBackup[b++] = pixels[srcIndex];
                    tileBackup[b++] = pixels[srcIndex + 1];
                    tileBackup[b++] = pixels[srcIndex + 2];
                    tileBackup[b++] = pixels[srcIndex + 3];
                }
            }
            const bgSampleIndices = [
                ((y0 + 8) * imageWidth + (x0 + 8)) * 4,
                ((y0 + 8) * imageWidth + (x0 + tileWidth - 9)) * 4,
                ((y0 + tileHeight - 9) * imageWidth + (x0 + 8)) * 4,
                ((y0 + tileHeight - 9) * imageWidth + (x0 + tileWidth - 9)) * 4,
            ];
            const bgColor = [0, 0, 0];
            bgSampleIndices.forEach((idx) => {
                bgColor[0] += pixels[idx];
                bgColor[1] += pixels[idx + 1];
                bgColor[2] += pixels[idx + 2];
            });
            bgColor[0] /= bgSampleIndices.length;
            bgColor[1] /= bgSampleIndices.length;
            bgColor[2] /= bgSampleIndices.length;
            const glyphThreshold = 42;
            const faceBrighten = 72;
            const isGlyphPixel = (x, y) => {
                if (x < 0 || x >= tileWidth || y < 0 || y >= tileHeight) {
                    return false;
                }
                const idx = ((y0 + y) * imageWidth + (x0 + x)) * 4;
                const dr = pixels[idx] - bgColor[0];
                const dg = pixels[idx + 1] - bgColor[1];
                const db = pixels[idx + 2] - bgColor[2];
                return Math.sqrt(dr * dr + dg * dg + db * db) >= glyphThreshold;
            };
            const borderWidth = Math.max(4, Math.floor(tileWidth * 0.035));
            for (let y = 0; y < tileHeight; y++) {
                for (let x = 0; x < tileWidth; x++) {
                    const onBorder = x < borderWidth ||
                        x >= tileWidth - borderWidth ||
                        y < borderWidth ||
                        y >= tileHeight - borderWidth;
                    if (onBorder || isGlyphPixel(x, y)) {
                        continue;
                    }
                    const idx = ((y0 + y) * imageWidth + (x0 + x)) * 4;
                    pixels[idx] = Math.min(255, pixels[idx] + faceBrighten);
                    pixels[idx + 1] = Math.min(255, pixels[idx + 1] + faceBrighten);
                    pixels[idx + 2] = Math.min(255, pixels[idx + 2] + faceBrighten);
                }
            }
            for (let y = 0; y < tileHeight; y++) {
                for (let x = 0; x < tileWidth; x++) {
                    const onBorder = x < borderWidth ||
                        x >= tileWidth - borderWidth ||
                        y < borderWidth ||
                        y >= tileHeight - borderWidth;
                    if (!onBorder) {
                        continue;
                    }
                    const idx = ((y0 + y) * imageWidth + (x0 + x)) * 4;
                    pixels[idx] = 0;
                    pixels[idx + 1] = 0;
                    pixels[idx + 2] = 0;
                }
            }
            scalars.modified();
            imageData.modified();
            texture.modified?.();
            actor.modified?.();
            this.highlightedFace = {
                actor,
                cellId,
                originalColor: [0, 0, 0, 0],
                viewport,
                isMainFace: true,
                mainFaceTextureData: tileBackup,
                mainFaceTile: {
                    x0,
                    y0,
                    width: tileWidth,
                    height: tileHeight,
                    imageWidth,
                },
            };
            viewport.render();
            return;
        }
        const mapper = actor.getMapper();
        const inputData = mapper.getInputData();
        if (!inputData) {
            return;
        }
        const cellData = inputData.getCellData();
        const colors = cellData.getScalars();
        if (!colors) {
            return;
        }
        const colorArray = colors.getData();
        const offset = cellId * 4;
        const originalColor = [
            colorArray[offset],
            colorArray[offset + 1],
            colorArray[offset + 2],
            colorArray[offset + 3],
        ];
        this.highlightedFace = {
            actor,
            cellId,
            originalColor,
            viewport,
            isMainFace: false,
        };
        const hc = this._highlightColor;
        colorArray[offset] = hc[0];
        colorArray[offset + 1] = hc[1];
        colorArray[offset + 2] = hc[2];
        colorArray[offset + 3] = 255;
        colors.modified();
        inputData.modified();
        viewport.render();
    }
    clearHighlight() {
        if (!this.highlightedFace) {
            return;
        }
        const { actor, cellId, originalColor, viewport, isMainFace } = this.highlightedFace;
        if (isMainFace) {
            const backup = this.highlightedFace.mainFaceTextureData;
            const tile = this.highlightedFace.mainFaceTile;
            const textures = actor.getTextures?.();
            const texture = textures?.[0];
            const imageData = texture?.getInputData?.();
            const scalars = imageData?.getPointData().getScalars();
            const pixels = scalars?.getData();
            if (backup && tile && scalars && imageData && pixels) {
                let b = 0;
                for (let y = 0; y < tile.height; y++) {
                    for (let x = 0; x < tile.width; x++) {
                        const dstIndex = ((tile.y0 + y) * tile.imageWidth + (tile.x0 + x)) * 4;
                        pixels[dstIndex] = backup[b++];
                        pixels[dstIndex + 1] = backup[b++];
                        pixels[dstIndex + 2] = backup[b++];
                        pixels[dstIndex + 3] = backup[b++];
                    }
                }
                scalars.modified();
                imageData.modified();
                texture.modified?.();
                actor.modified?.();
            }
            else if (this.highlightedFace.mainFaceHighlightActor) {
                const overlayRenderer = this.overlayRenderers.get(viewport.id);
                overlayRenderer?.removeActor(this.highlightedFace.mainFaceHighlightActor);
                this.highlightedFace.mainFaceHighlightActor.delete();
            }
            viewport.render();
            this.highlightedFace = null;
            return;
        }
        const mapper = actor.getMapper();
        const inputData = mapper.getInputData();
        if (!inputData) {
            this.highlightedFace = null;
            return;
        }
        const cellData = inputData.getCellData();
        const colors = cellData.getScalars();
        if (!colors) {
            this.highlightedFace = null;
            return;
        }
        const colorArray = colors.getData();
        const offset = cellId * 4;
        colorArray[offset] = originalColor[0];
        colorArray[offset + 1] = originalColor[1];
        colorArray[offset + 2] = originalColor[2];
        colorArray[offset + 3] = originalColor[3];
        colors.modified();
        inputData.modified();
        viewport.render();
        this.highlightedFace = null;
    }
    setupMouseHandlers(viewportId, element, viewport, actors, callbacks) {
        let isMouseDown = false;
        let isCubeHovered = false;
        const setAmbient = (full) => {
            actors.forEach((actor) => {
                const property = actor.getProperty();
                property.setAmbient(full ? this._hoverAmbient : this._restingAmbient);
            });
            viewport.render();
        };
        let didDrag = false;
        let pendingPickResult = null;
        let mouseDownCanvas = null;
        const clickTolerancePx = 3;
        const hoverHandler = (evt) => {
            if (isMouseDown) {
                if (mouseDownCanvas) {
                    const dx = evt.clientX - mouseDownCanvas.x;
                    const dy = evt.clientY - mouseDownCanvas.y;
                    if (dx * dx + dy * dy > clickTolerancePx * clickTolerancePx) {
                        didDrag = true;
                    }
                }
                return;
            }
            const pickResult = this.pickAtPosition(evt, viewportId, viewport, element, actors);
            if (pickResult) {
                if (!isCubeHovered) {
                    isCubeHovered = true;
                    setAmbient(true);
                }
                const { pickedActor, cellId, actorIndex } = pickResult;
                this.highlightFace(pickedActor, cellId, viewport, actorIndex === 0);
                if (callbacks.onFaceHover) {
                    callbacks.onFaceHover(pickResult);
                }
            }
            else {
                if (isCubeHovered) {
                    isCubeHovered = false;
                    setAmbient(false);
                }
                this.clearHighlight();
                if (callbacks.onFaceHover) {
                    callbacks.onFaceHover(null);
                }
            }
        };
        const clickHandler = (evt) => {
            if (evt.button !== 0) {
                return;
            }
            const pickResult = this.pickAtPosition(evt, viewportId, viewport, element, actors);
            if (!pickResult) {
                return;
            }
            isMouseDown = true;
            didDrag = false;
            pendingPickResult = pickResult;
            mouseDownCanvas = { x: evt.clientX, y: evt.clientY };
            (0,interactionDragCoordinator/* .beginOwnedDrag */.Js)(viewportId, 'orientation-controller');
        };
        const mouseUpHandler = (evt) => {
            if (isMouseDown && !didDrag && pendingPickResult) {
                let globalCellId = pendingPickResult.cellId;
                if (pendingPickResult.actorIndex === 1) {
                    globalCellId = pendingPickResult.cellId + 6;
                }
                else if (pendingPickResult.actorIndex === 2) {
                    globalCellId = pendingPickResult.cellId + 18;
                }
                callbacks.onFacePicked({
                    ...pendingPickResult,
                    cellId: globalCellId,
                });
                evt.preventDefault();
                evt.stopImmediatePropagation();
                evt.stopPropagation();
            }
            isMouseDown = false;
            if (isCubeHovered) {
                isCubeHovered = false;
                setAmbient(false);
            }
            didDrag = false;
            pendingPickResult = null;
            mouseDownCanvas = null;
            (0,interactionDragCoordinator/* .endOwnedDrag */.Xt)(viewportId, 'orientation-controller');
            this.clearHighlight();
        };
        const dblclickHandler = (evt) => {
            const pickResult = this.pickAtPosition(evt, viewportId, viewport, element, actors);
            if (pickResult) {
                evt.preventDefault();
                evt.stopImmediatePropagation();
            }
        };
        element.addEventListener('mousemove', hoverHandler, true);
        element.addEventListener('mousedown', clickHandler, true);
        element.addEventListener('mouseup', mouseUpHandler);
        element.addEventListener('mouseleave', mouseUpHandler);
        element.addEventListener('dblclick', dblclickHandler, true);
        const cleanup = () => {
            element.removeEventListener('mousemove', hoverHandler, true);
            element.removeEventListener('mousedown', clickHandler, true);
            element.removeEventListener('mouseup', mouseUpHandler);
            element.removeEventListener('mouseleave', mouseUpHandler);
            element.removeEventListener('dblclick', dblclickHandler, true);
            (0,interactionDragCoordinator/* .endOwnedDrag */.Xt)(viewportId, 'orientation-controller');
        };
        this.mouseHandlers.set(viewportId, { cleanup });
        return { cleanup };
    }
    getActors(viewportId) {
        return this.actors.get(viewportId);
    }
    syncOverlayViewport(viewportId, viewport) {
        const overlayRenderer = this.overlayRenderers.get(viewportId);
        if (!overlayRenderer) {
            return;
        }
        const mainRenderer = viewport
            .getRenderingEngine()
            ?.getRenderer(viewportId) ?? viewport.getRenderer();
        if (!mainRenderer) {
            return;
        }
        const mainVp = mainRenderer.getViewport();
        overlayRenderer.setViewport(...mainVp);
    }
    getOrientationForFace(cellId) {
        const orientations = new Map();
        orientations.set(0, { viewPlaneNormal: [0, 0, -1], viewUp: [0, -1, 0] });
        orientations.set(1, { viewPlaneNormal: [0, 0, 1], viewUp: [0, 1, 0] });
        orientations.set(2, { viewPlaneNormal: [0, -1, 0], viewUp: [0, 0, 1] });
        orientations.set(3, { viewPlaneNormal: [0, 1, 0], viewUp: [0, 0, 1] });
        orientations.set(4, { viewPlaneNormal: [-1, 0, 0], viewUp: [0, 0, 1] });
        orientations.set(5, { viewPlaneNormal: [1, 0, 0], viewUp: [0, 0, 1] });
        const sqrt2 = 1 / Math.sqrt(2);
        orientations.set(6, {
            viewPlaneNormal: [0, -sqrt2, -sqrt2],
            viewUp: [0, -sqrt2, sqrt2],
        });
        orientations.set(7, {
            viewPlaneNormal: [sqrt2, 0, -sqrt2],
            viewUp: [0, 0, 1],
        });
        orientations.set(8, {
            viewPlaneNormal: [0, sqrt2, -sqrt2],
            viewUp: [0, -sqrt2, -sqrt2],
        });
        orientations.set(9, {
            viewPlaneNormal: [-sqrt2, 0, -sqrt2],
            viewUp: [0, 0, 1],
        });
        orientations.set(10, {
            viewPlaneNormal: [0, -sqrt2, sqrt2],
            viewUp: [0, sqrt2, sqrt2],
        });
        orientations.set(11, {
            viewPlaneNormal: [sqrt2, 0, sqrt2],
            viewUp: [0, 0, 1],
        });
        orientations.set(12, {
            viewPlaneNormal: [0, sqrt2, sqrt2],
            viewUp: [0, sqrt2, -sqrt2],
        });
        orientations.set(13, {
            viewPlaneNormal: [-sqrt2, 0, sqrt2],
            viewUp: [0, 0, 1],
        });
        orientations.set(14, {
            viewPlaneNormal: [-sqrt2, -sqrt2, 0],
            viewUp: [0, 0, 1],
        });
        orientations.set(15, {
            viewPlaneNormal: [sqrt2, -sqrt2, 0],
            viewUp: [0, 0, 1],
        });
        orientations.set(16, {
            viewPlaneNormal: [sqrt2, sqrt2, 0],
            viewUp: [0, 0, 1],
        });
        orientations.set(17, {
            viewPlaneNormal: [-sqrt2, sqrt2, 0],
            viewUp: [0, 0, 1],
        });
        const sqrt3 = 1 / Math.sqrt(3);
        orientations.set(18, {
            viewPlaneNormal: [-sqrt3, -sqrt3, -sqrt3],
            viewUp: [0, 0, 1],
        });
        orientations.set(19, {
            viewPlaneNormal: [sqrt3, -sqrt3, -sqrt3],
            viewUp: [0, 0, 1],
        });
        orientations.set(20, {
            viewPlaneNormal: [sqrt3, sqrt3, -sqrt3],
            viewUp: [0, 0, 1],
        });
        orientations.set(21, {
            viewPlaneNormal: [-sqrt3, sqrt3, -sqrt3],
            viewUp: [0, 0, 1],
        });
        orientations.set(22, {
            viewPlaneNormal: [-sqrt3, -sqrt3, sqrt3],
            viewUp: [0, 0, 1],
        });
        orientations.set(23, {
            viewPlaneNormal: [sqrt3, -sqrt3, sqrt3],
            viewUp: [0, 0, 1],
        });
        orientations.set(24, {
            viewPlaneNormal: [sqrt3, sqrt3, sqrt3],
            viewUp: [0, 0, 1],
        });
        orientations.set(25, {
            viewPlaneNormal: [-sqrt3, sqrt3, sqrt3],
            viewUp: [0, 0, 1],
        });
        return orientations.get(cellId) || null;
    }
    cleanup(viewportId) {
        if (viewportId) {
            const handler = this.mouseHandlers.get(viewportId);
            if (handler) {
                handler.cleanup();
                this.mouseHandlers.delete(viewportId);
            }
            const overlayRenderer = this.overlayRenderers.get(viewportId);
            const renderWindow = this.renderWindows.get(viewportId);
            if (overlayRenderer) {
                if (renderWindow) {
                    renderWindow.removeRenderer(overlayRenderer);
                }
                overlayRenderer.delete();
            }
            this.actors.delete(viewportId);
            this.pickers.delete(viewportId);
            this.overlayRenderers.delete(viewportId);
            this.renderWindows.delete(viewportId);
        }
        else {
            this.mouseHandlers.forEach((handler) => handler.cleanup());
            this.mouseHandlers.clear();
            this.overlayRenderers.forEach((overlayRenderer, vpId) => {
                const renderWindow = this.renderWindows.get(vpId);
                if (renderWindow) {
                    renderWindow.removeRenderer(overlayRenderer);
                }
                overlayRenderer.delete();
            });
            this.overlayRenderers.clear();
            this.renderWindows.clear();
            this.actors.clear();
            this.pickers.clear();
        }
        this.clearHighlight();
    }
}


},
23266(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (Widget)
});
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



},
74821(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (ImageHelper_default)
});
/* import */ var _DataArray_js__rspack_import_0 = __webpack_require__(445);
/* import */ var _DataModel_ImageData_js__rspack_import_1 = __webpack_require__(26393);


//#region Sources/Common/Core/ImageHelper/index.js
/**
* Takes a canvas and converts it to a vtkImageData.
*
* Optionally supply a bounding box to get a particular subset of the canvas.
*
* @param canvas       The HTML canvas to convert
* @param boundingBox  A bounding box of type [top, left, width, height]
*/
function canvasToImageData(canvas, boundingBox = [
	0,
	0,
	0,
	0
]) {
	const [top, left, width, height] = boundingBox;
	const idata = canvas.getContext("2d").getImageData(top, left, width || canvas.width, height || canvas.height);
	const imageData = _DataModel_ImageData_js__rspack_import_1/* ["default"].newInstance */.Ay.newInstance({ type: "vtkImageData" });
	imageData.setOrigin(0, 0, 0);
	imageData.setSpacing(1, 1, 1);
	imageData.setExtent(0, (width || canvas.width) - 1, 0, (height || canvas.height) - 1, 0, 0);
	const scalars = _DataArray_js__rspack_import_0/* ["default"].newInstance */.Ay.newInstance({
		numberOfComponents: 4,
		values: new Uint8Array(idata.data.buffer)
	});
	scalars.setName("scalars");
	imageData.getPointData().setScalars(scalars);
	return imageData;
}
/**
* Converts an Image object to a vtkImageData.
*/
function imageToImageData(image, transform = {
	flipX: false,
	flipY: false,
	rotate: 0
}) {
	const canvas = document.createElement("canvas");
	canvas.width = image.width;
	canvas.height = image.height;
	const ctx = canvas.getContext("2d");
	const { flipX, flipY, rotate } = transform;
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
	ctx.rotate(rotate * Math.PI / 180);
	ctx.drawImage(image, -image.width / 2, -image.height / 2);
	return canvasToImageData(canvas);
}
var ImageHelper_default = {
	canvasToImageData,
	imageToImageData
};
//#endregion


//# sourceMappingURL=ImageHelper.js.map

},
73435(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (SphereSource_default)
});
/* import */ var _macros_js__rspack_import_0 = __webpack_require__(28241);
/* import */ var _Common_Core_DataArray_js__rspack_import_1 = __webpack_require__(445);
/* import */ var _Common_DataModel_PolyData_js__rspack_import_2 = __webpack_require__(91542);



//#region Sources/Filters/Sources/SphereSource/index.js
function vtkSphereSource(publicAPI, model) {
	model.classHierarchy.push("vtkSphereSource");
	publicAPI.requestData = (inData, outData) => {
		let dataset = outData[0];
		const pointDataType = dataset ? dataset.getPoints().getDataType() : model.pointType;
		dataset = dataset?.initialize() || _Common_DataModel_PolyData_js__rspack_import_2/* ["default"].newInstance */.Ay.newInstance();
		let numPoles = 0;
		let { thetaResolution } = model;
		let startTheta = model.startTheta < model.endTheta ? model.startTheta : model.endTheta;
		startTheta *= Math.PI / 180;
		let endTheta = model.endTheta > model.startTheta ? model.endTheta : model.startTheta;
		endTheta *= Math.PI / 180;
		let startPhi = model.startPhi < model.endPhi ? model.startPhi : model.endPhi;
		startPhi *= Math.PI / 180;
		let endPhi = model.endPhi > model.startPhi ? model.endPhi : model.startPhi;
		endPhi *= Math.PI / 180;
		if (Math.abs(startTheta - endTheta) < 2 * Math.PI) ++thetaResolution;
		const deltaTheta = (endTheta - startTheta) / model.thetaResolution;
		const jStart = model.startPhi <= 0 ? 1 : 0;
		const jEnd = model.phiResolution + (model.endPhi >= 180 ? -1 : 0);
		const numPts = model.phiResolution * thetaResolution + 2;
		const numPolys = model.phiResolution * 2 * model.thetaResolution;
		let pointIdx = 0;
		let points = _macros_js__rspack_import_0/* ["default"].newTypedArray */.Ay.newTypedArray(pointDataType, numPts * 3);
		let normals = new Float32Array(numPts * 3);
		let cellLocation = 0;
		let polys = new Uint32Array(numPolys * 5);
		if (model.startPhi <= 0) {
			points[pointIdx * 3 + 0] = model.center[0];
			points[pointIdx * 3 + 1] = model.center[1];
			points[pointIdx * 3 + 2] = model.center[2] + model.radius;
			normals[pointIdx * 3 + 0] = 0;
			normals[pointIdx * 3 + 1] = 0;
			normals[pointIdx * 3 + 2] = 1;
			pointIdx++;
			numPoles++;
		}
		if (model.endPhi >= 180) {
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
		const base = phiResolution * thetaResolution;
		if (Math.abs(startTheta - endTheta) < 2 * Math.PI) --thetaResolution;
		if (model.startPhi <= 0) for (let i = 0; i < thetaResolution; i++) {
			polys[cellLocation++] = 3;
			polys[cellLocation++] = phiResolution * i + numPoles;
			polys[cellLocation++] = phiResolution * (i + 1) % base + numPoles;
			polys[cellLocation++] = 0;
		}
		if (model.endPhi >= 180) {
			const numOffset = phiResolution - 1 + numPoles;
			for (let i = 0; i < thetaResolution; i++) {
				polys[cellLocation++] = 3;
				polys[cellLocation++] = phiResolution * i + numOffset;
				polys[cellLocation++] = numPoles - 1;
				polys[cellLocation++] = phiResolution * (i + 1) % base + numOffset;
			}
		}
		for (let i = 0; i < thetaResolution; i++) for (let j = 0; j < phiResolution - 1; j++) {
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
		points = points.subarray(0, pointIdx * 3);
		dataset.getPoints().setData(points, 3);
		normals = normals.subarray(0, pointIdx * 3);
		const normalArray = _Common_Core_DataArray_js__rspack_import_1/* ["default"].newInstance */.Ay.newInstance({
			name: "Normals",
			values: normals,
			numberOfComponents: 3
		});
		dataset.getPointData().setNormals(normalArray);
		polys = polys.subarray(0, cellLocation);
		dataset.getPolys().setData(polys, 1);
		outData[0] = dataset;
	};
}
var DEFAULT_VALUES = {
	radius: .5,
	latLongTessellation: false,
	thetaResolution: 8,
	startTheta: 0,
	endTheta: 360,
	phiResolution: 8,
	startPhi: 0,
	endPhi: 180,
	center: [
		0,
		0,
		0
	],
	pointType: "Float64Array"
};
function extend(publicAPI, model, initialValues = {}) {
	Object.assign(model, DEFAULT_VALUES, initialValues);
	_macros_js__rspack_import_0/* ["default"].obj */.Ay.obj(publicAPI, model);
	_macros_js__rspack_import_0/* ["default"].setGet */.Ay.setGet(publicAPI, model, [
		"radius",
		"latLongTessellation",
		"thetaResolution",
		"startTheta",
		"endTheta",
		"phiResolution",
		"startPhi",
		"endPhi"
	]);
	_macros_js__rspack_import_0/* ["default"].setGetArray */.Ay.setGetArray(publicAPI, model, ["center"], 3);
	_macros_js__rspack_import_0/* ["default"].algo */.Ay.algo(publicAPI, model, 0, 1);
	vtkSphereSource(publicAPI, model);
}
var newInstance = _macros_js__rspack_import_0/* ["default"].newInstance */.Ay.newInstance(extend, "vtkSphereSource");
var SphereSource_default = {
	newInstance,
	extend
};
//#endregion


//# sourceMappingURL=SphereSource.js.map

},
11627(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (/* binding */ OrientationMarkerWidget_default)
});

// UNUSED EXPORTS: DEFAULT_VALUES, extend, newInstance

// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/macros.js
var macros = __webpack_require__(28241);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/Renderer.js + 2 modules
var Renderer = __webpack_require__(56726);
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Interaction/Widgets/OrientationMarkerWidget/Constants.js
//#region Sources/Interaction/Widgets/OrientationMarkerWidget/Constants.js
var Corners = {
	TOP_LEFT: "TOP_LEFT",
	TOP_RIGHT: "TOP_RIGHT",
	BOTTOM_LEFT: "BOTTOM_LEFT",
	BOTTOM_RIGHT: "BOTTOM_RIGHT"
};
var Constants_default = { Corners };
//#endregion


//# sourceMappingURL=Constants.js.map
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Interaction/Widgets/OrientationMarkerWidget.js



//#region Sources/Interaction/Widgets/OrientationMarkerWidget/index.js
var { vtkErrorMacro } = macros/* ["default"] */.Ay;
var { Corners: OrientationMarkerWidget_Corners } = Constants_default;
function vtkOrientationMarkerWidget(publicAPI, model) {
	model.classHierarchy.push("vtkOrientationMarkerWidget");
	const superClass = { ...publicAPI };
	const previousCameraInput = [];
	const selfRenderer = Renderer/* ["default"].newInstance */.Ay.newInstance();
	const resizeObserver = new ResizeObserver((entries) => {
		publicAPI.updateViewport();
	});
	let onCameraChangedSub = null;
	let onCameraModifiedSub = null;
	let onAnimationSub = null;
	let onEndAnimationSub = null;
	let selfSubscription = null;
	function onCameraModified() {
		if (!model._interactor.isAnimating()) publicAPI.updateMarkerOrientation();
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
		pixelSize = Math.max(Math.min(model.minPixelSize, minViewSize), Math.min(model.maxPixelSize, pixelSize));
		const xFrac = pixelSize / canvasSize[0];
		const yFrac = pixelSize / canvasSize[1];
		switch (model.viewportCorner) {
			case OrientationMarkerWidget_Corners.TOP_LEFT: return [
				xMin,
				yMax - yFrac,
				xMin + xFrac,
				yMax
			];
			case OrientationMarkerWidget_Corners.TOP_RIGHT: return [
				xMax - xFrac,
				yMax - yFrac,
				xMax,
				yMax
			];
			case OrientationMarkerWidget_Corners.BOTTOM_LEFT: return [
				xMin,
				yMin,
				xMin + xFrac,
				yMin + yFrac
			];
			case OrientationMarkerWidget_Corners.BOTTOM_RIGHT: return [
				xMax - xFrac,
				yMin,
				xMax,
				yMin + yFrac
			];
			default:
				vtkErrorMacro("Invalid widget corner");
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
		const currentCamera = (model.parentRenderer || model._interactor.getCurrentRenderer()).getActiveCamera();
		if (!currentCamera) return;
		const position = currentCamera.getReferenceByName("position");
		const focalPoint = currentCamera.getReferenceByName("focalPoint");
		const viewUp = currentCamera.getReferenceByName("viewUp");
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
	publicAPI.setEnabled = (enabling) => {
		if (enabling) {
			if (model.enabled) return;
			if (!model.actor) {
				vtkErrorMacro("Must set actor before enabling orientation marker.");
				return;
			}
			if (!model._interactor) {
				vtkErrorMacro("Must set interactor before enabling orientation marker.");
				return;
			}
			const ren = model.parentRenderer || model._interactor.getCurrentRenderer();
			const renderWindow = ren.getRenderWindow();
			renderWindow.addRenderer(selfRenderer);
			if (renderWindow.getNumberOfLayers() < 2) renderWindow.setNumberOfLayers(2);
			selfRenderer.setLayer(renderWindow.getNumberOfLayers() - 1);
			selfRenderer.setInteractive(model.interactiveRenderer);
			selfRenderer.addViewProp(model.actor);
			model.actor.setVisibility(true);
			onCameraChangedSub = ren.onEvent((event) => {
				if (event.type === "ActiveCameraEvent") {
					if (onCameraModifiedSub) onCameraModifiedSub.unsubscribe();
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
			if (!model.enabled) return;
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
			if (renderWindow) renderWindow.removeRenderer(selfRenderer);
		}
		publicAPI.modified();
	};
	/**
	* Sets the viewport corner.
	*/
	publicAPI.setViewportCorner = (corner) => {
		if (corner === model.viewportCorner) return;
		model.viewportCorner = corner;
		publicAPI.updateViewport();
	};
	/**
	* Sets the viewport size.
	*/
	publicAPI.setViewportSize = (sizeFactor) => {
		const viewportSize = Math.min(1, Math.max(0, sizeFactor));
		if (viewportSize === model.viewportSize) return;
		model.viewportSize = viewportSize;
		publicAPI.updateViewport();
	};
	publicAPI.setActor = (actor) => {
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
	selfSubscription = publicAPI.onModified(publicAPI.updateViewport);
}
var DEFAULT_VALUES = {
	viewportCorner: Constants_default.Corners.BOTTOM_LEFT,
	viewportSize: .2,
	minPixelSize: 50,
	maxPixelSize: 200,
	parentRenderer: null,
	interactiveRenderer: false
};
function extend(publicAPI, model, initialValues = {}) {
	Object.assign(model, DEFAULT_VALUES, initialValues);
	macros/* ["default"].obj */.Ay.obj(publicAPI, model);
	macros/* ["default"].get */.Ay.get(publicAPI, model, [
		"enabled",
		"viewportCorner",
		"viewportSize",
		"interactiveRenderer"
	]);
	macros/* ["default"].setGet */.Ay.setGet(publicAPI, model, [
		"_interactor",
		"minPixelSize",
		"maxPixelSize",
		"parentRenderer"
	]);
	macros/* ["default"].get */.Ay.get(publicAPI, model, ["actor"]);
	macros/* ["default"].moveToProtected */.Ay.moveToProtected(publicAPI, model, ["interactor"]);
	vtkOrientationMarkerWidget(publicAPI, model);
}
var newInstance = macros/* ["default"].newInstance */.Ay.newInstance(extend, "vtkOrientationMarkerWidget");
var OrientationMarkerWidget_default = {
	newInstance,
	extend,
	...Constants_default
};
//#endregion


//# sourceMappingURL=OrientationMarkerWidget.js.map

},
84639(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (/* binding */ AnnotatedCubeActor_default)
});

// UNUSED EXPORTS: DEFAULT_VALUES, extend, newInstance

// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/macros.js
var macros = __webpack_require__(28241);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/ImageHelper.js
var ImageHelper = __webpack_require__(74821);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Filters/Sources/CubeSource.js
var CubeSource = __webpack_require__(90011);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/Actor.js
var Actor = __webpack_require__(44404);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/Mapper.js + 1 modules
var Mapper = __webpack_require__(3901);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/Texture.js
var Texture = __webpack_require__(41090);
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/AnnotatedCubeActor/Presets.js
//#region Sources/Rendering/Core/AnnotatedCubeActor/Presets.js
var STYLES = {
	default: {
		defaultStyle: {
			fontStyle: "bold",
			fontFamily: "Arial",
			fontColor: "black",
			fontSizeScale: (res) => res / 2,
			faceColor: "white",
			edgeThickness: .1,
			edgeColor: "black",
			resolution: 400
		},
		xMinusFaceProperty: {
			text: "X-",
			faceColor: "yellow"
		},
		xPlusFaceProperty: {
			text: "X+",
			faceColor: "yellow"
		},
		yMinusFaceProperty: {
			text: "Y-",
			faceColor: "red"
		},
		yPlusFaceProperty: {
			text: "Y+",
			faceColor: "red"
		},
		zMinusFaceProperty: {
			text: "Z-",
			faceColor: "#008000"
		},
		zPlusFaceProperty: {
			text: "Z+",
			faceColor: "#008000"
		}
	},
	lps: {
		xMinusFaceProperty: {
			text: "R",
			faceRotation: -90
		},
		xPlusFaceProperty: {
			text: "L",
			faceRotation: 90
		},
		yMinusFaceProperty: {
			text: "A",
			faceRotation: 0
		},
		yPlusFaceProperty: {
			text: "P",
			faceRotation: 180
		},
		zMinusFaceProperty: {
			text: "I",
			faceRotation: 180
		},
		zPlusFaceProperty: {
			text: "S",
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
var Presets_default = {
	applyDefinitions,
	applyPreset,
	registerStylePreset
};
//#endregion


//# sourceMappingURL=Presets.js.map
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/AnnotatedCubeActor.js







//#region Sources/Rendering/Core/AnnotatedCubeActor/index.js
var FACE_TO_INDEX = {
	xPlus: 0,
	xMinus: 1,
	yPlus: 2,
	yMinus: 3,
	zPlus: 4,
	zMinus: 5
};
function vtkAnnotatedCubeActor(publicAPI, model) {
	model.classHierarchy.push("vtkAnnotatedCubeActor");
	model.xPlusFaceProperty = { ...model.xPlusFaceProperty };
	model.xMinusFaceProperty = { ...model.xMinusFaceProperty };
	model.yPlusFaceProperty = { ...model.yPlusFaceProperty };
	model.yMinusFaceProperty = { ...model.yMinusFaceProperty };
	model.zPlusFaceProperty = { ...model.zPlusFaceProperty };
	model.zMinusFaceProperty = { ...model.zMinusFaceProperty };
	let cubeSource = null;
	const canvas = document.createElement("canvas");
	const mapper = Mapper/* ["default"].newInstance */.Ay.newInstance();
	const texture = Texture/* ["default"].newInstance */.Ay.newInstance();
	texture.setInterpolate(true);
	function updateFaceTexture(faceName, newProp = null) {
		if (newProp) Object.assign(model[`${faceName}FaceProperty`], newProp);
		const prop = {
			...model.defaultStyle,
			...model[`${faceName}FaceProperty`]
		};
		canvas.width = prop.resolution;
		canvas.height = prop.resolution;
		const ctxt = canvas.getContext("2d");
		ctxt.fillStyle = prop.faceColor;
		ctxt.fillRect(0, 0, canvas.width, canvas.height);
		if (prop.edgeThickness > 0) {
			ctxt.strokeStyle = prop.edgeColor;
			ctxt.lineWidth = prop.edgeThickness * canvas.width;
			ctxt.strokeRect(0, 0, canvas.width, canvas.height);
		}
		ctxt.save();
		ctxt.translate(0, canvas.height);
		ctxt.scale(1, -1);
		ctxt.translate(canvas.width / 2, canvas.height / 2);
		ctxt.rotate(-Math.PI * (prop.faceRotation / 180));
		const textSize = prop.fontSizeScale(prop.resolution);
		ctxt.fillStyle = prop.fontColor;
		ctxt.textAlign = "center";
		ctxt.textBaseline = "middle";
		ctxt.font = `${prop.fontStyle} ${textSize}px "${prop.fontFamily}"`;
		ctxt.fillText(prop.text, 0, 0);
		ctxt.restore();
		const vtkImage = ImageHelper/* ["default"].canvasToImageData */.A.canvasToImageData(canvas);
		texture.setInputData(vtkImage, FACE_TO_INDEX[faceName]);
		publicAPI.modified();
	}
	function updateAllFaceTextures() {
		cubeSource = CubeSource/* ["default"].newInstance */.Ay.newInstance({ generate3DTextureCoordinates: true });
		mapper.setInputConnection(cubeSource.getOutputPort());
		updateFaceTexture("xPlus");
		updateFaceTexture("xMinus");
		updateFaceTexture("yPlus");
		updateFaceTexture("yMinus");
		updateFaceTexture("zPlus");
		updateFaceTexture("zMinus");
	}
	publicAPI.setDefaultStyle = (style) => {
		model.defaultStyle = {
			...model.defaultStyle,
			...style
		};
		updateAllFaceTextures();
	};
	publicAPI.setXPlusFaceProperty = (prop) => updateFaceTexture("xPlus", prop);
	publicAPI.setXMinusFaceProperty = (prop) => updateFaceTexture("xMinus", prop);
	publicAPI.setYPlusFaceProperty = (prop) => updateFaceTexture("yPlus", prop);
	publicAPI.setYMinusFaceProperty = (prop) => updateFaceTexture("yMinus", prop);
	publicAPI.setZPlusFaceProperty = (prop) => updateFaceTexture("zPlus", prop);
	publicAPI.setZMinusFaceProperty = (prop) => updateFaceTexture("zMinus", prop);
	updateAllFaceTextures();
	mapper.setInputConnection(cubeSource.getOutputPort());
	publicAPI.setMapper(mapper);
	publicAPI.addTexture(texture);
}
var DEFAULT_VALUES = { defaultStyle: {
	text: "",
	faceColor: "white",
	faceRotation: 0,
	fontFamily: "Arial",
	fontColor: "black",
	fontStyle: "normal",
	fontSizeScale: (resolution) => resolution / 1.8,
	edgeThickness: .1,
	edgeColor: "black",
	resolution: 200
} };
function extend(publicAPI, model, initialValues = {}) {
	Object.assign(model, DEFAULT_VALUES, initialValues);
	Actor/* ["default"].extend */.Ay.extend(publicAPI, model, initialValues);
	macros/* ["default"].get */.Ay.get(publicAPI, model, [
		"defaultStyle",
		"xPlusFaceProperty",
		"xMinusFaceProperty",
		"yPlusFaceProperty",
		"yMinusFaceProperty",
		"zPlusFaceProperty",
		"zMinusFaceProperty"
	]);
	vtkAnnotatedCubeActor(publicAPI, model);
}
var newInstance = macros/* ["default"].newInstance */.Ay.newInstance(extend, "vtkAnnotatedCubeActor");
var AnnotatedCubeActor_default = {
	newInstance,
	extend,
	Presets: Presets_default
};
//#endregion


//# sourceMappingURL=AnnotatedCubeActor.js.map

},
95827(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (/* binding */ AxesActor_default)
});

// UNUSED EXPORTS: extend, newInstance

// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/macros.js
var macros = __webpack_require__(28241);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/DataArray.js
var DataArray = __webpack_require__(445);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/MatrixBuilder.js
var MatrixBuilder = __webpack_require__(90364);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/DataArray/Constants.js
var Constants = __webpack_require__(25015);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/DataSetAttributes/Constants.js
var DataSetAttributes_Constants = __webpack_require__(5695);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/Points.js
var Points = __webpack_require__(74973);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/PolyData.js + 7 modules
var PolyData = __webpack_require__(91542);
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Filters/General/AppendPolyData.js






//#region Sources/Filters/General/AppendPolyData/index.js
var { vtkErrorMacro } = macros/* ["default"] */.Ay;
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
function vtkAppendPolyData(publicAPI, model) {
	model.classHierarchy.push("vtkAppendPolyData");
	publicAPI.requestData = (inData, outData) => {
		const numberOfInputs = publicAPI.getNumberOfInputPorts();
		if (!numberOfInputs) {
			vtkErrorMacro("No input specified.");
			return;
		}
		if (numberOfInputs === 1) {
			outData[0] = inData[0];
			return;
		}
		const output = outData[0] && inData[0] !== outData[0] ? outData[0].initialize() : PolyData/* ["default"].newInstance */.Ay.newInstance();
		let numPts = 0;
		let pointType = 0;
		let ttype = 1;
		let firstType = 1;
		let numVerts = 0;
		let numLines = 0;
		let numStrips = 0;
		let numPolys = 0;
		let hasPtNormals = true;
		let hasPtTCoords = true;
		let hasPtScalars = true;
		for (let i = 0; i < numberOfInputs; i++) {
			const ds = inData[i];
			if (!ds) continue;
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
		if (model.outputPointsPrecision === DataSetAttributes_Constants/* .DesiredOutputPrecision.SINGLE */.kP.SINGLE) pointType = Constants/* .VtkDataTypes.FLOAT */.JA.FLOAT;
		else if (model.outputPointsPrecision === DataSetAttributes_Constants/* .DesiredOutputPrecision.DOUBLE */.kP.DOUBLE) pointType = Constants/* .VtkDataTypes.DOUBLE */.JA.DOUBLE;
		const points = Points/* ["default"].newInstance */.Ay.newInstance({ dataType: pointType });
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
			newPtNormals = DataArray/* ["default"].newInstance */.Ay.newInstance({
				numberOfComponents: 3,
				numberOfTuples: numPts,
				size: 3 * numPts,
				dataType: dsNormals.getDataType(),
				name: dsNormals.getName()
			});
		}
		if (hasPtTCoords) {
			const dsTCoords = lds.getPointData().getTCoords();
			newPtTCoords = DataArray/* ["default"].newInstance */.Ay.newInstance({
				numberOfComponents: 2,
				numberOfTuples: numPts,
				size: 2 * numPts,
				dataType: dsTCoords.getDataType(),
				name: dsTCoords.getName()
			});
		}
		if (hasPtScalars) {
			const dsScalars = lds.getPointData().getScalars();
			newPtScalars = DataArray/* ["default"].newInstance */.Ay.newInstance({
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
		if (newPtNormals) output.getPointData().setNormals(newPtNormals);
		if (newPtTCoords) output.getPointData().setTCoords(newPtTCoords);
		if (newPtScalars) output.getPointData().setScalars(newPtScalars);
		outData[0] = output;
	};
}
var DEFAULT_VALUES = { outputPointsPrecision: DataSetAttributes_Constants/* .DesiredOutputPrecision.DEFAULT */.kP.DEFAULT };
function extend(publicAPI, model, initialValues = {}) {
	Object.assign(model, DEFAULT_VALUES, initialValues);
	macros/* ["default"].setGet */.Ay.setGet(publicAPI, model, ["outputPointsPrecision"]);
	macros/* ["default"].obj */.Ay.obj(publicAPI, model);
	macros/* ["default"].algo */.Ay.algo(publicAPI, model, 1, 1);
	vtkAppendPolyData(publicAPI, model);
}
var newInstance = macros/* ["default"].newInstance */.Ay.newInstance(extend, "vtkAppendPolyData");
var AppendPolyData_default = {
	newInstance,
	extend
};
//#endregion


//# sourceMappingURL=AppendPolyData.js.map
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Filters/Sources/ConeSource.js



//#region Sources/Filters/Sources/ConeSource/index.js
function vtkConeSource(publicAPI, model) {
	model.classHierarchy.push("vtkConeSource");
	publicAPI.requestData = (inData, outData) => {
		const angle = 2 * Math.PI / model.resolution;
		const xbot = -model.height / 2;
		const numberOfPoints = model.resolution + 1;
		const cellArraySize = 4 * model.resolution + 1 + model.resolution;
		let pointIdx = 0;
		const points = macros/* ["default"].newTypedArray */.Ay.newTypedArray(model.pointType, numberOfPoints * 3);
		let cellLocation = 0;
		const polys = new Uint32Array(cellArraySize);
		points[0] = model.height / 2;
		points[1] = 0;
		points[2] = 0;
		if (model.capping) polys[cellLocation++] = model.resolution;
		for (let i = 0; i < model.resolution; i++) {
			pointIdx++;
			points[pointIdx * 3 + 0] = xbot;
			points[pointIdx * 3 + 1] = model.radius * Math.cos(i * angle);
			points[pointIdx * 3 + 2] = model.radius * Math.sin(i * angle);
			if (model.capping) polys[model.resolution - cellLocation++ + 1] = pointIdx;
		}
		for (let i = 0; i < model.resolution; i++) {
			polys[cellLocation++] = 3;
			polys[cellLocation++] = 0;
			polys[cellLocation++] = i + 1;
			polys[cellLocation++] = i + 2 > model.resolution ? 1 : i + 2;
		}
		MatrixBuilder/* ["default"].buildFromRadian */.A.buildFromRadian().translate(...model.center).rotateFromDirections([
			1,
			0,
			0
		], model.direction).apply(points);
		const dataset = outData[0]?.initialize() || PolyData/* ["default"].newInstance */.Ay.newInstance();
		dataset.getPoints().setData(points, 3);
		dataset.getPolys().setData(polys, 1);
		outData[0] = dataset;
	};
}
var ConeSource_DEFAULT_VALUES = {
	height: 1,
	radius: .5,
	resolution: 6,
	center: [
		0,
		0,
		0
	],
	direction: [
		1,
		0,
		0
	],
	capping: true,
	pointType: "Float64Array"
};
function ConeSource_extend(publicAPI, model, initialValues = {}) {
	Object.assign(model, ConeSource_DEFAULT_VALUES, initialValues);
	macros/* ["default"].obj */.Ay.obj(publicAPI, model);
	macros/* ["default"].setGet */.Ay.setGet(publicAPI, model, [
		"height",
		"radius",
		"resolution",
		"capping"
	]);
	macros/* ["default"].setGetArray */.Ay.setGetArray(publicAPI, model, ["center", "direction"], 3);
	macros/* ["default"].algo */.Ay.algo(publicAPI, model, 0, 1);
	vtkConeSource(publicAPI, model);
}
var ConeSource_newInstance = macros/* ["default"].newInstance */.Ay.newInstance(ConeSource_extend, "vtkConeSource");
var ConeSource_default = {
	newInstance: ConeSource_newInstance,
	extend: ConeSource_extend
};
//#endregion


//# sourceMappingURL=ConeSource.js.map
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Filters/Sources/CylinderSource.js




//#region Sources/Filters/Sources/CylinderSource/index.js
function vtkCylinderSource(publicAPI, model) {
	model.classHierarchy.push("vtkCylinderSource");
	publicAPI.requestData = (inData, outData) => {
		const angle = 2 * Math.PI / model.resolution;
		let numberOfPoints = 2 * model.resolution;
		let numberOfPolys = 5 * model.resolution;
		if (model.capping) {
			numberOfPoints = 4 * model.resolution;
			numberOfPolys = 7 * model.resolution + 2;
		}
		const points = macros/* ["default"].newTypedArray */.Ay.newTypedArray(model.pointType, numberOfPoints * 3);
		let cellLocation = 0;
		const polys = new Uint32Array(numberOfPolys);
		const normalsData = new Float32Array(numberOfPoints * 3);
		const normals = DataArray/* ["default"].newInstance */.Ay.newInstance({
			numberOfComponents: 3,
			values: normalsData,
			name: "Normals"
		});
		const tcData = new Float32Array(numberOfPoints * 2);
		const tcoords = DataArray/* ["default"].newInstance */.Ay.newInstance({
			numberOfComponents: 2,
			values: tcData,
			name: "TCoords"
		});
		const nbot = [
			0,
			0,
			0
		];
		const ntop = [
			0,
			0,
			0
		];
		const xbot = [
			0,
			0,
			0
		];
		const xtop = [
			0,
			0,
			0
		];
		const tcbot = [0, 0];
		const tctop = [0, 0];
		const otherRadius = model.otherRadius == null ? model.radius : model.otherRadius;
		for (let i = 0; i < model.resolution; i++) {
			nbot[0] = Math.cos(i * angle + model.initAngle);
			ntop[0] = nbot[0];
			xbot[0] = model.radius * nbot[0] + model.center[0];
			xtop[0] = xbot[0];
			tcbot[0] = Math.abs(2 * i / model.resolution - 1);
			tctop[0] = tcbot[0];
			xbot[1] = .5 * model.height + model.center[1];
			xtop[1] = -.5 * model.height + model.center[1];
			tcbot[1] = 0;
			tctop[1] = 1;
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
		for (let i = 0; i < model.resolution; i++) {
			polys[cellLocation++] = 4;
			polys[cellLocation++] = 2 * i;
			polys[cellLocation++] = 2 * i + 1;
			const pt = (2 * i + 3) % (2 * model.resolution);
			polys[cellLocation++] = pt;
			polys[cellLocation++] = pt - 1;
		}
		if (model.capping) {
			for (let i = 0; i < model.resolution; i++) {
				xbot[0] = model.radius * Math.cos(i * angle + model.initAngle);
				xtop[0] = xbot[0];
				tcbot[0] = xbot[0];
				tctop[0] = xbot[0];
				xbot[0] += model.center[0];
				xtop[0] += model.center[0];
				nbot[1] = 1;
				ntop[1] = -1;
				xbot[1] = .5 * model.height + model.center[1];
				xtop[1] = -.5 * model.height + model.center[1];
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
			polys[cellLocation++] = model.resolution;
			for (let i = 0; i < model.resolution; i++) polys[cellLocation++] = 2 * model.resolution + i;
			polys[cellLocation++] = model.resolution;
			for (let i = 0; i < model.resolution; i++) polys[cellLocation++] = 3 * model.resolution + i;
		}
		MatrixBuilder/* ["default"].buildFromRadian */.A.buildFromRadian().translate(...model.center).rotateFromDirections([
			0,
			1,
			0
		], model.direction).translate(...model.center.map((c) => c * -1)).apply(points);
		MatrixBuilder/* ["default"].buildFromRadian */.A.buildFromRadian().rotateFromDirections([
			0,
			1,
			0
		], model.direction).apply(normalsData);
		const dataset = outData[0]?.initialize() || PolyData/* ["default"].newInstance */.Ay.newInstance();
		dataset.getPoints().setData(points, 3);
		dataset.getPolys().setData(polys, 1);
		dataset.getPointData().setNormals(normals);
		dataset.getPointData().setTCoords(tcoords);
		outData[0] = dataset;
	};
}
var CylinderSource_DEFAULT_VALUES = {
	height: 1,
	initAngle: 0,
	radius: 1,
	resolution: 6,
	center: [
		0,
		0,
		0
	],
	direction: [
		0,
		1,
		0
	],
	capping: true,
	pointType: "Float64Array"
};
function CylinderSource_extend(publicAPI, model, initialValues = {}) {
	Object.assign(model, CylinderSource_DEFAULT_VALUES, initialValues);
	macros/* ["default"].obj */.Ay.obj(publicAPI, model);
	macros/* ["default"].setGet */.Ay.setGet(publicAPI, model, [
		"height",
		"initAngle",
		"otherRadius",
		"radius",
		"resolution",
		"capping"
	]);
	macros/* ["default"].setGetArray */.Ay.setGetArray(publicAPI, model, ["center", "direction"], 3);
	macros/* ["default"].algo */.Ay.algo(publicAPI, model, 0, 1);
	vtkCylinderSource(publicAPI, model);
}
var CylinderSource_newInstance = macros/* ["default"].newInstance */.Ay.newInstance(CylinderSource_extend, "vtkCylinderSource");
var CylinderSource_default = {
	newInstance: CylinderSource_newInstance,
	extend: CylinderSource_extend
};
//#endregion


//# sourceMappingURL=CylinderSource.js.map
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Filters/Sources/ArrowSource.js





//#region Sources/Filters/Sources/ArrowSource/index.js
function vtkArrowSource(publicAPI, model) {
	model.classHierarchy.push("vtkArrowSource");
	publicAPI.requestData = (inData, outData) => {
		const cylinder = CylinderSource_default.newInstance({ capping: true });
		cylinder.setResolution(model.shaftResolution);
		cylinder.setRadius(model.shaftRadius);
		cylinder.setHeight(1 - model.tipLength);
		cylinder.setCenter(0, (1 - model.tipLength) * .5, 0);
		const cylinderPD = cylinder.getOutputData();
		const cylinderPts = cylinderPD.getPoints().getData();
		const cylinderNormals = cylinderPD.getPointData().getNormals().getData();
		MatrixBuilder/* ["default"].buildFromDegree */.A.buildFromDegree().rotateZ(-90).apply(cylinderPts).apply(cylinderNormals);
		const cone = ConeSource_default.newInstance();
		cone.setResolution(model.tipResolution);
		cone.setHeight(model.tipLength);
		cone.setRadius(model.tipRadius);
		const conePD = cone.getOutputData();
		const conePts = conePD.getPoints().getData();
		MatrixBuilder/* ["default"].buildFromRadian */.A.buildFromRadian().translate(1 - model.tipLength * .5, 0, 0).apply(conePts);
		const append = AppendPolyData_default.newInstance();
		append.setInputData(cylinderPD);
		append.addInputData(conePD);
		const appendPD = append.getOutputData();
		const appendPts = appendPD.getPoints().getData();
		MatrixBuilder/* ["default"].buildFromRadian */.A.buildFromRadian().translate(-.5 + model.tipLength * .5, 0, 0).apply(appendPts);
		if (model.invert) {
			MatrixBuilder/* ["default"].buildFromRadian */.A.buildFromRadian().rotateFromDirections([
				1,
				0,
				0
			], model.direction).scale(-1, -1, -1).apply(appendPts);
			outData[0] = appendPD;
		} else {
			MatrixBuilder/* ["default"].buildFromRadian */.A.buildFromRadian().rotateFromDirections([
				1,
				0,
				0
			], model.direction).scale(1, 1, 1).apply(appendPts);
			outData[0] = append.getOutputData();
		}
	};
}
var ArrowSource_DEFAULT_VALUES = {
	tipResolution: 6,
	tipRadius: .1,
	tipLength: .35,
	shaftResolution: 6,
	shaftRadius: .03,
	invert: false,
	direction: [
		1,
		0,
		0
	],
	pointType: "Float64Array"
};
function ArrowSource_extend(publicAPI, model, initialValues = {}) {
	Object.assign(model, ArrowSource_DEFAULT_VALUES, initialValues);
	macros/* ["default"].obj */.Ay.obj(publicAPI, model);
	macros/* ["default"].setGet */.Ay.setGet(publicAPI, model, [
		"tipResolution",
		"tipRadius",
		"tipLength",
		"shaftResolution",
		"shaftRadius",
		"invert"
	]);
	macros/* ["default"].setGetArray */.Ay.setGetArray(publicAPI, model, ["direction"], 3);
	macros/* ["default"].algo */.Ay.algo(publicAPI, model, 0, 1);
	vtkArrowSource(publicAPI, model);
}
var ArrowSource_newInstance = macros/* ["default"].newInstance */.Ay.newInstance(ArrowSource_extend, "vtkArrowSource");
var ArrowSource_default = {
	newInstance: ArrowSource_newInstance,
	extend: ArrowSource_extend
};
//#endregion


//# sourceMappingURL=ArrowSource.js.map
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/Actor.js
var Actor = __webpack_require__(44404);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/Mapper.js + 1 modules
var Mapper = __webpack_require__(3901);
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Rendering/Core/AxesActor.js







//#region Sources/Rendering/Core/AxesActor/index.js
function centerDataSet(ds) {
	const bounds = ds.getPoints().getBounds();
	const center = [
		-(bounds[0] + bounds[1]) * .5,
		-(bounds[2] + bounds[3]) * .5,
		-(bounds[4] + bounds[5]) * .5
	];
	MatrixBuilder/* ["default"].buildFromDegree */.A.buildFromDegree().translate(...center).apply(ds.getPoints().getData());
}
function shiftDataset(ds, axis, invert = false) {
	const bounds = ds.getPoints().getBounds();
	const center = [
		0,
		0,
		0
	];
	if (invert) center[axis] = -bounds[axis * 2 + 1];
	else center[axis] = -bounds[axis * 2];
	MatrixBuilder/* ["default"].buildFromDegree */.A.buildFromDegree().translate(...center).apply(ds.getPoints().getData());
}
function addColor(ds, r, g, b) {
	const size = ds.getPoints().getData().length;
	const rgbArray = new Uint8ClampedArray(size);
	let offset = 0;
	while (offset < size) {
		rgbArray[offset++] = r;
		rgbArray[offset++] = g;
		rgbArray[offset++] = b;
	}
	ds.getPointData().setScalars(DataArray/* ["default"].newInstance */.Ay.newInstance({
		name: "color",
		numberOfComponents: 3,
		values: rgbArray
	}));
}
function vtkAxesActor(publicAPI, model) {
	model.classHierarchy.push("vtkAxesActor");
	const _mapper = Mapper/* ["default"].newInstance */.Ay.newInstance();
	publicAPI.setMapper(_mapper);
	publicAPI.update = () => {
		let currentConfig = {
			...model.config,
			...model.xConfig
		};
		const xAxis = ArrowSource_default.newInstance({
			direction: [
				1,
				0,
				0
			],
			...currentConfig
		}).getOutputData();
		if (model.config.recenter) centerDataSet(xAxis);
		else shiftDataset(xAxis, 0, currentConfig.invert);
		addColor(xAxis, ...currentConfig.color);
		currentConfig = {
			...model.config,
			...model.yConfig
		};
		const yAxis = ArrowSource_default.newInstance({
			direction: [
				0,
				1,
				0
			],
			...currentConfig
		}).getOutputData();
		if (model.config.recenter) centerDataSet(yAxis);
		else shiftDataset(yAxis, 1, currentConfig.invert);
		addColor(yAxis, ...currentConfig.color);
		currentConfig = {
			...model.config,
			...model.zConfig
		};
		const zAxis = ArrowSource_default.newInstance({
			direction: [
				0,
				0,
				1
			],
			...currentConfig
		}).getOutputData();
		if (model.config.recenter) centerDataSet(zAxis);
		else shiftDataset(zAxis, 2, currentConfig.invert);
		addColor(zAxis, ...currentConfig.color);
		const source = AppendPolyData_default.newInstance();
		source.setInputData(xAxis);
		source.addInputData(yAxis);
		source.addInputData(zAxis);
		_mapper.setInputConnection(source.getOutputPort());
	};
	publicAPI.update();
	const _debouncedUpdate = macros/* ["default"].debounce */.Ay.debounce(publicAPI.update, 0);
	publicAPI.setXAxisColor = (color) => publicAPI.setXConfig({
		...publicAPI.getXConfig(),
		color
	});
	publicAPI.setYAxisColor = (color) => publicAPI.setYConfig({
		...publicAPI.getYConfig(),
		color
	});
	publicAPI.setZAxisColor = (color) => publicAPI.setZConfig({
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
function defaultValues(initialValues) {
	return {
		config: {
			recenter: true,
			tipResolution: 60,
			tipRadius: .1,
			tipLength: .2,
			shaftResolution: 60,
			shaftRadius: .03,
			invert: false,
			...initialValues?.config
		},
		xConfig: {
			color: [
				255,
				0,
				0
			],
			invert: false,
			...initialValues?.xConfig
		},
		yConfig: {
			color: [
				255,
				255,
				0
			],
			invert: false,
			...initialValues?.yConfig
		},
		zConfig: {
			color: [
				0,
				128,
				0
			],
			invert: false,
			...initialValues?.zConfig
		}
	};
}
function AxesActor_extend(publicAPI, model, initialValues = {}) {
	Actor/* ["default"].extend */.Ay.extend(publicAPI, model, defaultValues(initialValues));
	macros/* ["default"].setGet */.Ay.setGet(publicAPI, model, [
		"config",
		"xConfig",
		"yConfig",
		"zConfig"
	]);
	vtkAxesActor(publicAPI, model);
}
var AxesActor_newInstance = macros/* ["default"].newInstance */.Ay.newInstance(AxesActor_extend, "vtkAxesActor");
var AxesActor_default = {
	newInstance: AxesActor_newInstance,
	extend: AxesActor_extend
};
//#endregion


//# sourceMappingURL=AxesActor.js.map

},

}]);