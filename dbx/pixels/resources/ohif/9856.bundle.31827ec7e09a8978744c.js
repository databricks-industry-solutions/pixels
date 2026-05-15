"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[9856],{

/***/ 5057:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rendering_now__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(53586);
/* harmony import */ var _rendering_renderColorImage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(48080);
/* harmony import */ var _rendering_renderGrayscaleImage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(92885);
/* harmony import */ var _rendering_renderPseudoColorImage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(71209);




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(enabledElement, invalidated) {
    const image = enabledElement.image;
    if (!enabledElement.canvas || !enabledElement.image) {
        return;
    }
    const start = (0,_rendering_now__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)();
    image.stats = {
        lastGetPixelDataTime: -1.0,
        lastStoredPixelDataToCanvasImageDataTime: -1.0,
        lastPutImageDataTime: -1.0,
        lastRenderTime: -1.0,
        lastLutGenerateTime: -1.0,
    };
    if (image) {
        let render = image.render;
        if (!render) {
            if (enabledElement.viewport.colormap) {
                render = _rendering_renderPseudoColorImage__WEBPACK_IMPORTED_MODULE_3__/* .renderPseudoColorImage */ .l;
            }
            else if (image.color) {
                render = _rendering_renderColorImage__WEBPACK_IMPORTED_MODULE_1__/* .renderColorImage */ .f;
            }
            else {
                render = _rendering_renderGrayscaleImage__WEBPACK_IMPORTED_MODULE_2__/* .renderGrayscaleImage */ .j;
            }
        }
        render(enabledElement, invalidated);
    }
    const renderTimeInMs = (0,_rendering_now__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)() - start;
    image.stats.lastRenderTime = renderTimeInMs;
    enabledElement.invalid = false;
    enabledElement.needsRedraw = false;
}


/***/ }),

/***/ 7808:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _transform__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(45354);

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(enabledElement, scale) {
    const transform = new _transform__WEBPACK_IMPORTED_MODULE_0__/* .Transform */ .d();
    if (!enabledElement.viewport.displayedArea) {
        return transform;
    }
    transform.translate(enabledElement.canvas.width / 2, enabledElement.canvas.height / 2);
    const angle = enabledElement.viewport.rotation;
    if (angle !== 0) {
        transform.rotate((angle * Math.PI) / 180);
    }
    let widthScale = enabledElement.viewport.scale;
    let heightScale = enabledElement.viewport.scale;
    const width = enabledElement.viewport.displayedArea.brhc.x -
        (enabledElement.viewport.displayedArea.tlhc.x - 1);
    const height = enabledElement.viewport.displayedArea.brhc.y -
        (enabledElement.viewport.displayedArea.tlhc.y - 1);
    if (enabledElement.viewport.displayedArea.presentationSizeMode === 'NONE') {
        if (enabledElement.image.rowPixelSpacing <
            enabledElement.image.columnPixelSpacing) {
            widthScale *=
                enabledElement.image.columnPixelSpacing /
                    enabledElement.image.rowPixelSpacing;
        }
        else if (enabledElement.image.columnPixelSpacing <
            enabledElement.image.rowPixelSpacing) {
            heightScale *=
                enabledElement.image.rowPixelSpacing /
                    enabledElement.image.columnPixelSpacing;
        }
    }
    else {
        widthScale = enabledElement.viewport.displayedArea.columnPixelSpacing;
        heightScale = enabledElement.viewport.displayedArea.rowPixelSpacing;
        if (enabledElement.viewport.displayedArea.presentationSizeMode ===
            'SCALE TO FIT') {
            const verticalScale = enabledElement.canvas.height / (height * heightScale);
            const horizontalScale = enabledElement.canvas.width / (width * widthScale);
            widthScale = heightScale = Math.min(horizontalScale, verticalScale);
            if (enabledElement.viewport.displayedArea.rowPixelSpacing <
                enabledElement.viewport.displayedArea.columnPixelSpacing) {
                widthScale *=
                    enabledElement.viewport.displayedArea.columnPixelSpacing /
                        enabledElement.viewport.displayedArea.rowPixelSpacing;
            }
            else if (enabledElement.viewport.displayedArea.columnPixelSpacing <
                enabledElement.viewport.displayedArea.rowPixelSpacing) {
                heightScale *=
                    enabledElement.viewport.displayedArea.rowPixelSpacing /
                        enabledElement.viewport.displayedArea.columnPixelSpacing;
            }
        }
    }
    transform.scale(widthScale, heightScale);
    if (angle !== 0) {
        transform.rotate((-angle * Math.PI) / 180);
    }
    transform.translate(enabledElement.viewport.translation.x, enabledElement.viewport.translation.y);
    if (angle !== 0) {
        transform.rotate((angle * Math.PI) / 180);
    }
    if (scale !== undefined) {
        transform.scale(scale, scale);
    }
    if (enabledElement.viewport.hflip) {
        transform.scale(-1, 1);
    }
    if (enabledElement.viewport.vflip) {
        transform.scale(1, -1);
    }
    transform.translate(-width / 2, -height / 2);
    return transform;
}


/***/ }),

/***/ 36931:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createViewport__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12132);
/* harmony import */ var _getImageFitScale__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(57162);


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(canvas, image, modality, colormap) {
    if (canvas === undefined) {
        throw new Error('getDefaultViewport: parameter canvas must not be undefined');
    }
    if (image === undefined) {
        return (0,_createViewport__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)();
    }
    const scale = (0,_getImageFitScale__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(canvas, image, 0).scaleFactor;
    let voi;
    if (modality === 'PT' && image.isPreScaled) {
        voi = {
            windowWidth: 5,
            windowCenter: 2.5,
        };
    }
    else if (image.windowWidth !== undefined &&
        image.windowCenter !== undefined) {
        voi = {
            windowWidth: Array.isArray(image.windowWidth)
                ? image.windowWidth[0]
                : image.windowWidth,
            windowCenter: Array.isArray(image.windowCenter)
                ? image.windowCenter[0]
                : image.windowCenter,
        };
    }
    return {
        scale,
        translation: {
            x: 0,
            y: 0,
        },
        voi,
        invert: image.invert,
        pixelReplication: false,
        rotation: 0,
        hflip: false,
        vflip: false,
        modalityLUT: image.modalityLUT,
        modality,
        voiLUT: image.voiLUT,
        colormap: colormap !== undefined ? colormap : image.colormap,
        displayedArea: {
            tlhc: {
                x: 1,
                y: 1,
            },
            brhc: {
                x: image.columns,
                y: image.rows,
            },
            rowPixelSpacing: image.rowPixelSpacing === undefined ? 1 : image.rowPixelSpacing,
            columnPixelSpacing: image.columnPixelSpacing === undefined ? 1 : image.columnPixelSpacing,
            presentationSizeMode: 'NONE',
        },
    };
}


/***/ }),

/***/ 50584:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

/* harmony import */ var _cache__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(49038);
/* harmony import */ var _classes_ImageVolume__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(86252);
/* harmony import */ var _classes_Surface__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(90808);
/* harmony import */ var _classes_Mesh__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(29625);
/* harmony import */ var _classes_StreamingImageVolume__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(50180);
/* harmony import */ var _classes_StreamingDynamicImageVolume__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1271);









/***/ }),

/***/ 71851:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  BlendModes: () => (/* reexport */ BlendModes/* default */.A),
  CalibrationTypes: () => (/* reexport */ CalibrationTypes/* default */.A),
  Events: () => (/* reexport */ Events/* default */.A),
  GeometryType: () => (/* reexport */ GeometryType/* default */.A),
  ImageQualityStatus: () => (/* reexport */ ImageQualityStatus/* default */.A),
  InterpolationType: () => (/* reexport */ InterpolationType/* default */.A),
  MeshType: () => (/* reexport */ MeshType/* default */.A),
  MetadataModules: () => (/* reexport */ MetadataModules/* default */.A),
  OrientationAxis: () => (/* reexport */ OrientationAxis/* default */.A),
  RenderingEngineModeEnum: () => (/* reexport */ RenderingEngineModeEnum/* default */.A),
  RequestType: () => (/* reexport */ RequestType/* default */.A),
  VOILUTFunctionType: () => (/* reexport */ VOILUTFunctionType/* default */.A),
  VideoEnums: () => (/* reexport */ VideoEnums),
  ViewportStatus: () => (/* reexport */ ViewportStatus/* default */.A),
  ViewportType: () => (/* reexport */ ViewportType/* default */.A)
});

// UNUSED EXPORTS: ContourType, DynamicOperatorType, GenerateImageType, VoxelManagerEnum

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/Events.js
var Events = __webpack_require__(32643);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/RequestType.js
var RequestType = __webpack_require__(43213);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/ViewportType.js
var ViewportType = __webpack_require__(41864);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/InterpolationType.js
var InterpolationType = __webpack_require__(29310);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/BlendModes.js
var BlendModes = __webpack_require__(63591);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/OrientationAxis.js
var OrientationAxis = __webpack_require__(18735);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/GeometryType.js
var GeometryType = __webpack_require__(91346);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/ContourType.js
var ContourType = __webpack_require__(86066);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/MeshType.js
var MeshType = __webpack_require__(32731);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/VOILUTFunctionType.js
var VOILUTFunctionType = __webpack_require__(82501);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/DynamicOperatorType.js
var DynamicOperatorType = __webpack_require__(91369);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/CalibrationTypes.js
var CalibrationTypes = __webpack_require__(38059);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/ViewportStatus.js
var ViewportStatus = __webpack_require__(1814);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/ImageQualityStatus.js
var ImageQualityStatus = __webpack_require__(77474);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/VideoEnums.js
var VideoEnums = __webpack_require__(13545);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/MetadataModules.js
var MetadataModules = __webpack_require__(69850);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/enums/GenerateImageType.js
var GenerateImageType;
(function (GenerateImageType) {
    GenerateImageType["SUM"] = "SUM";
    GenerateImageType["SUBTRACT"] = "SUBTRACT";
    GenerateImageType["AVERAGE"] = "AVERAGE";
})(GenerateImageType || (GenerateImageType = {}));

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/VoxelManagerEnum.js
var VoxelManagerEnum = __webpack_require__(6796);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/RenderingEngineModeEnum.js
var RenderingEngineModeEnum = __webpack_require__(8128);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/enums/index.js






















/***/ }),

/***/ 15327:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  BaseVolumeViewport: () => (/* reexport */ BaseVolumeViewport/* default */.A),
  CONSTANTS: () => (/* reexport */ constants),
  Enums: () => (/* reexport */ enums),
  StackViewport: () => (/* reexport */ StackViewport/* default */.A),
  VolumeViewport: () => (/* reexport */ VolumeViewport/* default */.A),
  addImageSlicesToViewports: () => (/* reexport */ helpers/* addImageSlicesToViewports */.ge),
  addVolumesToViewports: () => (/* reexport */ helpers/* addVolumesToViewports */.x),
  cache: () => (/* reexport */ cache_cache/* default */.Ay),
  convertMapperToNotSharedMapper: () => (/* reexport */ createVolumeMapper/* convertMapperToNotSharedMapper */.h),
  createVolumeActor: () => (/* reexport */ createVolumeActor/* default */.A),
  eventTarget: () => (/* reexport */ eventTarget/* default */.A),
  getEnabledElement: () => (/* reexport */ getEnabledElement/* default */.Ay),
  getEnabledElementByIds: () => (/* reexport */ getEnabledElement/* getEnabledElementByIds */.b1),
  getEnabledElementByViewportId: () => (/* reexport */ getEnabledElement/* getEnabledElementByViewportId */.yj),
  getEnabledElements: () => (/* reexport */ getEnabledElement/* getEnabledElements */.zb),
  getRenderingEngine: () => (/* reexport */ getRenderingEngine/* getRenderingEngine */.lD),
  getRenderingEngines: () => (/* reexport */ getRenderingEngine/* getRenderingEngines */.qO),
  getWebWorkerManager: () => (/* reexport */ init/* getWebWorkerManager */.G_),
  metaData: () => (/* reexport */ metaData),
  triggerEvent: () => (/* reexport */ triggerEvent/* default */.A),
  utilities: () => (/* reexport */ utilities),
  volumeLoader: () => (/* reexport */ volumeLoader)
});

// UNUSED EXPORTS: BaseRenderingEngine, ContextPoolRenderingEngine, EPSILON, EVENTS, ImageVolume, ProgressiveRetrieveImages, RenderingEngine, Settings, StreamingDynamicImageVolume, StreamingImageVolume, Surface, TiledRenderingEngine, VideoViewport, Viewport, VolumeViewport3D, WSIViewport, canRenderFloatTextures, cornerstoneMeshLoader, cornerstoneStreamingDynamicImageVolumeLoader, cornerstoneStreamingImageVolumeLoader, createCanvas, createViewportElement, createVolumeMapper, geometryLoader, getConfiguration, getOrCreateCanvas, getShouldUseCPURendering, imageLoadPoolManager, imageLoader, imageRetrievalPoolManager, init, isCornerstoneInitialized, peerImport, registerImageLoader, requestPoolManager, resetInitialization, resetUseCPURendering, setCanvasCreator, setConfiguration, setPreferSizeOverAccuracy, setUseCPURendering, setVolumesForViewports, version

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/index.js + 1 modules
var enums = __webpack_require__(71851);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/constants/index.js + 4 modules
var constants = __webpack_require__(76491);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/index.js + 3 modules
var RenderingEngine = __webpack_require__(90340);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/createVolumeActor.js + 2 modules
var createVolumeActor = __webpack_require__(61640);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/createVolumeMapper.js
var createVolumeMapper = __webpack_require__(92099);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/getOrCreateCanvas.js
var getOrCreateCanvas = __webpack_require__(30135);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/VolumeViewport.js + 1 modules
var VolumeViewport = __webpack_require__(94155);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/VolumeViewport3D.js
var VolumeViewport3D = __webpack_require__(40893);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/BaseVolumeViewport.js + 1 modules
var BaseVolumeViewport = __webpack_require__(95205);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/StackViewport.js + 14 modules
var StackViewport = __webpack_require__(79720);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/VideoViewport.js + 3 modules
var VideoViewport = __webpack_require__(32501);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/WSIViewport.js + 1 modules
var WSIViewport = __webpack_require__(81466);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/Viewport.js
var Viewport = __webpack_require__(10056);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/eventTarget.js
var eventTarget = __webpack_require__(10364);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/version.js
var version = __webpack_require__(78337);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/getRenderingEngine.js
var getRenderingEngine = __webpack_require__(39536);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/cache/index.js
var cache = __webpack_require__(50584);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/cache/cache.js
var cache_cache = __webpack_require__(49038);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/requestPool/imageRetrievalPoolManager.js
var imageRetrievalPoolManager = __webpack_require__(91073);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/requestPool/imageLoadPoolManager.js
var imageLoadPoolManager = __webpack_require__(51159);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/getEnabledElement.js
var getEnabledElement = __webpack_require__(86846);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/metaData.js
var metaData = __webpack_require__(74876);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/init.js + 2 modules
var init = __webpack_require__(26896);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/Settings.js
const DEFAULT_SETTINGS = Symbol('DefaultSettings');
const RUNTIME_SETTINGS = Symbol('RuntimeSettings');
const OBJECT_SETTINGS_MAP = Symbol('ObjectSettingsMap');
const DICTIONARY = Symbol('Dictionary');
class Settings {
    constructor(base) {
        const dictionary = Object.create((base instanceof Settings && DICTIONARY in base
            ? base[DICTIONARY]
            : null));
        Object.seal(Object.defineProperty(this, DICTIONARY, {
            value: dictionary,
        }));
    }
    set(key, value) {
        return set(this[DICTIONARY], key, value, null);
    }
    get(key) {
        return get(this[DICTIONARY], key);
    }
    unset(key) {
        return unset(this[DICTIONARY], key + '');
    }
    forEach(callback) {
        iterate(this[DICTIONARY], callback);
    }
    extend() {
        return new Settings(this);
    }
    import(root) {
        if (isPlainObject(root)) {
            Object.keys(root).forEach((key) => {
                set(this[DICTIONARY], key, root[key], null);
            });
        }
    }
    dump() {
        const context = {};
        iterate(this[DICTIONARY], (key, value) => {
            if (typeof value !== 'undefined') {
                deepSet(context, key, value);
            }
        });
        return context;
    }
    static assert(subject) {
        return subject instanceof Settings
            ? subject
            : Settings.getRuntimeSettings();
    }
    static getDefaultSettings(subfield = null) {
        let defaultSettings = Settings[DEFAULT_SETTINGS];
        if (!(defaultSettings instanceof Settings)) {
            defaultSettings = new Settings();
            Settings[DEFAULT_SETTINGS] = defaultSettings;
        }
        if (subfield) {
            const settingObj = {};
            defaultSettings.forEach((name) => {
                if (name.startsWith(subfield)) {
                    const setting = name.split(`${subfield}.`)[1];
                    settingObj[setting] = defaultSettings.get(name);
                }
            });
            return settingObj;
        }
        return defaultSettings;
    }
    static getRuntimeSettings() {
        let runtimeSettings = Settings[RUNTIME_SETTINGS];
        if (!(runtimeSettings instanceof Settings)) {
            runtimeSettings = new Settings(Settings.getDefaultSettings());
            Settings[RUNTIME_SETTINGS] = runtimeSettings;
        }
        return runtimeSettings;
    }
    static getObjectSettings(subject, from) {
        let settings = null;
        if (subject instanceof Settings) {
            settings = subject;
        }
        else if (typeof subject === 'object' && subject !== null) {
            let objectSettingsMap = Settings[OBJECT_SETTINGS_MAP];
            if (!(objectSettingsMap instanceof WeakMap)) {
                objectSettingsMap = new WeakMap();
                Settings[OBJECT_SETTINGS_MAP] = objectSettingsMap;
            }
            settings = objectSettingsMap.get(subject);
            if (!(settings instanceof Settings)) {
                settings = new Settings(Settings.assert(Settings.getObjectSettings(from)));
                objectSettingsMap.set(subject, settings);
            }
        }
        return settings;
    }
    static extendRuntimeSettings() {
        return Settings.getRuntimeSettings().extend();
    }
}
function unset(dictionary, name) {
    if (name.endsWith('.')) {
        let deleteCount = 0;
        const namespace = name;
        const base = namespace.slice(0, -1);
        const deleteAll = base.length === 0;
        for (const key in dictionary) {
            if (Object.prototype.hasOwnProperty.call(dictionary, key) &&
                (deleteAll || key.startsWith(namespace) || key === base)) {
                delete dictionary[key];
                ++deleteCount;
            }
        }
        return deleteCount > 0;
    }
    return delete dictionary[name];
}
function iterate(dictionary, callback) {
    for (const key in dictionary) {
        callback(key, dictionary[key]);
    }
}
function setAll(dictionary, prefix, record, references) {
    let failCount;
    if (references.has(record)) {
        return set(dictionary, prefix, null, references);
    }
    references.add(record);
    failCount = 0;
    for (const field in record) {
        if (Object.prototype.hasOwnProperty.call(record, field)) {
            const key = field.length === 0 ? prefix : `${prefix}.${field}`;
            if (!set(dictionary, key, record[field], references)) {
                ++failCount;
            }
        }
    }
    references.delete(record);
    return failCount === 0;
}
function set(dictionary, key, value, references) {
    if (isValidKey(key)) {
        if (isPlainObject(value)) {
            return setAll(dictionary, key, value, references instanceof WeakSet ? references : new WeakSet());
        }
        dictionary[key] = value;
        return true;
    }
    return false;
}
function get(dictionary, key) {
    return dictionary[key];
}
function isValidKey(key) {
    let last, current, previous;
    if (typeof key !== 'string' || (last = key.length - 1) < 0) {
        return false;
    }
    previous = -1;
    while ((current = key.indexOf('.', previous + 1)) >= 0) {
        if (current - previous < 2 || current === last) {
            return false;
        }
        previous = current;
    }
    return true;
}
function isPlainObject(subject) {
    if (typeof subject === 'object' && subject !== null) {
        const prototype = Object.getPrototypeOf(subject);
        if (prototype === Object.prototype || prototype === null) {
            return true;
        }
    }
    return false;
}
function deepSet(context, key, value) {
    const separator = key.indexOf('.');
    if (separator >= 0) {
        const subKey = key.slice(0, separator);
        let subContext = context[subKey];
        if (typeof subContext !== 'object' || subContext === null) {
            const subContextValue = subContext;
            subContext = {};
            if (typeof subContextValue !== 'undefined') {
                subContext[''] = subContextValue;
            }
            context[subKey] = subContext;
        }
        deepSet(subContext, key.slice(separator + 1, key.length), value);
    }
    else {
        context[key] = value;
    }
}
Settings.getDefaultSettings().set('useCursors', true);

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/loaders/volumeLoader.js + 10 modules
var volumeLoader = __webpack_require__(87142);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/loaders/imageLoader.js
var imageLoader = __webpack_require__(80068);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/loaders/geometryLoader.js + 26 modules
var geometryLoader = __webpack_require__(89926);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/loaders/ProgressiveRetrieveImages.js + 4 modules
var ProgressiveRetrieveImages = __webpack_require__(36822);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/index.js + 46 modules
var utilities = __webpack_require__(33592);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/triggerEvent.js
var triggerEvent = __webpack_require__(69372);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/loaders/cornerstoneStreamingImageVolumeLoader.js
var cornerstoneStreamingImageVolumeLoader = __webpack_require__(55500);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/loaders/cornerstoneStreamingDynamicImageVolumeLoader.js
var cornerstoneStreamingDynamicImageVolumeLoader = __webpack_require__(55509);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/loaders/cornerstoneMeshLoader.js
var cornerstoneMeshLoader = __webpack_require__(56074);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/index.js + 3 modules
var helpers = __webpack_require__(40661);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/index.js







































/***/ }),

/***/ 80068:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createAndCacheDerivedImages: () => (/* binding */ createAndCacheDerivedImages),
/* harmony export */   createAndCacheLocalImage: () => (/* binding */ createAndCacheLocalImage),
/* harmony export */   loadAndCacheImage: () => (/* binding */ loadAndCacheImage),
/* harmony export */   loadImage: () => (/* binding */ loadImage)
/* harmony export */ });
/* unused harmony exports loadAndCacheImages, createAndCacheDerivedImage, cancelLoadImage, cancelLoadImages, cancelLoadAll, registerImageLoader, registerUnknownImageLoader, unregisterAllImageLoaders, createAndCacheDerivedLabelmapImages, createAndCacheDerivedLabelmapImage */
/* harmony import */ var _cache_cache__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(49038);
/* harmony import */ var _enums_Events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(32643);
/* harmony import */ var _eventTarget__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(10364);
/* harmony import */ var _utilities_genericMetadataProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(27119);
/* harmony import */ var _utilities_getBufferConfiguration__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(99576);
/* harmony import */ var _utilities_triggerEvent__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(69372);
/* harmony import */ var _utilities_uuidv4__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(80221);
/* harmony import */ var _utilities_VoxelManager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(24623);
/* harmony import */ var _requestPool_imageLoadPoolManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(51159);
/* harmony import */ var _metaData__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(74876);
/* harmony import */ var _enums_VoxelManagerEnum__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(6796);











const imageLoaders = {};
let unknownImageLoader;
function loadImageFromImageLoader(imageId, options) {
    const cachedImageLoadObject = _cache_cache__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Ay.getImageLoadObject(imageId);
    if (cachedImageLoadObject) {
        handleImageLoadPromise(cachedImageLoadObject.promise, imageId);
        return cachedImageLoadObject;
    }
    const scheme = imageId.split(':')[0];
    const loader = imageLoaders[scheme] || unknownImageLoader;
    if (!loader) {
        throw new Error(`loadImageFromImageLoader: No image loader found for scheme '${scheme}'`);
    }
    const imageLoadObject = loader(imageId, options);
    handleImageLoadPromise(imageLoadObject.promise, imageId);
    return imageLoadObject;
}
function handleImageLoadPromise(imagePromise, imageId) {
    Promise.resolve(imagePromise)
        .then((image) => {
        ensureVoxelManager(image);
        (0,_utilities_triggerEvent__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A)(_eventTarget__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A, _enums_Events__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.IMAGE_LOADED, { image });
    })
        .catch((error) => {
        const errorDetails = {
            imageId,
            error,
        };
        (0,_utilities_triggerEvent__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A)(_eventTarget__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A, _enums_Events__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.IMAGE_LOAD_FAILED, errorDetails);
    });
}
function ensureVoxelManager(image) {
    if (!image.voxelManager) {
        const { width, height, numberOfComponents } = image;
        const voxelManager = _utilities_VoxelManager__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A.createImageVoxelManager({
            scalarData: image.getPixelData(),
            width,
            height,
            numberOfComponents,
        });
        image.voxelManager = voxelManager;
        image.getPixelData = () => voxelManager.getScalarData();
        delete image.imageFrame.pixelData;
    }
}
function loadImage(imageId, options = { priority: 0, requestType: 'prefetch' }) {
    if (imageId === undefined) {
        throw new Error('loadImage: parameter imageId must not be undefined');
    }
    return loadImageFromImageLoader(imageId, options).promise;
}
function loadAndCacheImage(imageId, options = { priority: 0, requestType: 'prefetch' }) {
    if (imageId === undefined) {
        throw new Error('loadAndCacheImage: parameter imageId must not be undefined');
    }
    const imageLoadObject = loadImageFromImageLoader(imageId, options);
    if (!_cache_cache__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Ay.getImageLoadObject(imageId)) {
        _cache_cache__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Ay.putImageLoadObject(imageId, imageLoadObject);
    }
    return imageLoadObject.promise;
}
function loadAndCacheImages(imageIds, options = { priority: 0, requestType: 'prefetch' }) {
    if (!imageIds || imageIds.length === 0) {
        throw new Error('loadAndCacheImages: parameter imageIds must be list of image Ids');
    }
    const allPromises = imageIds.map((imageId) => {
        return loadAndCacheImage(imageId, options);
    });
    return allPromises;
}
function createAndCacheDerivedImage(referencedImageId, options = {}) {
    if (referencedImageId === undefined) {
        throw new Error('createAndCacheDerivedImage: parameter imageId must not be undefined');
    }
    if (options.imageId === undefined) {
        options.imageId = `derived:${(0,_utilities_uuidv4__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A)()}`;
    }
    const { imageId, skipCreateBuffer, onCacheAdd, voxelRepresentation } = options;
    const imagePlaneModule = _metaData__WEBPACK_IMPORTED_MODULE_9__.get('imagePlaneModule', referencedImageId);
    const length = imagePlaneModule.rows * imagePlaneModule.columns;
    const { TypedArrayConstructor } = (0,_utilities_getBufferConfiguration__WEBPACK_IMPORTED_MODULE_4__/* .getBufferConfiguration */ .h)(options.targetBuffer?.type, length);
    const imageScalarData = new TypedArrayConstructor(skipCreateBuffer ? 1 : length);
    const derivedImageId = imageId;
    const referencedImagePlaneMetadata = _metaData__WEBPACK_IMPORTED_MODULE_9__.get('imagePlaneModule', referencedImageId);
    _utilities_genericMetadataProvider__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.add(derivedImageId, {
        type: 'imagePlaneModule',
        metadata: referencedImagePlaneMetadata,
    });
    const referencedImageGeneralSeriesMetadata = _metaData__WEBPACK_IMPORTED_MODULE_9__.get('generalSeriesModule', referencedImageId);
    _utilities_genericMetadataProvider__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.add(derivedImageId, {
        type: 'generalSeriesModule',
        metadata: referencedImageGeneralSeriesMetadata,
    });
    _utilities_genericMetadataProvider__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.add(derivedImageId, {
        type: 'generalImageModule',
        metadata: {
            instanceNumber: options.instanceNumber,
        },
    });
    const imagePixelModule = _metaData__WEBPACK_IMPORTED_MODULE_9__.get('imagePixelModule', referencedImageId);
    _utilities_genericMetadataProvider__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.add(derivedImageId, {
        type: 'imagePixelModule',
        metadata: {
            ...imagePixelModule,
            bitsAllocated: 8,
            bitsStored: 8,
            highBit: 7,
            samplesPerPixel: 1,
            pixelRepresentation: 0,
        },
    });
    const localImage = createAndCacheLocalImage(imageId, {
        scalarData: imageScalarData,
        onCacheAdd,
        skipCreateBuffer,
        targetBuffer: {
            type: imageScalarData.constructor.name,
        },
        voxelRepresentation,
        dimensions: [imagePlaneModule.columns, imagePlaneModule.rows],
        spacing: [
            imagePlaneModule.columnPixelSpacing,
            imagePlaneModule.rowPixelSpacing,
        ],
        origin: imagePlaneModule.imagePositionPatient,
        direction: imagePlaneModule.imageOrientationPatient,
        frameOfReferenceUID: imagePlaneModule.frameOfReferenceUID,
        referencedImageId: referencedImageId,
    });
    localImage.referencedImageId = referencedImageId;
    if (!_cache_cache__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Ay.getImageLoadObject(imageId)) {
        _cache_cache__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Ay.putImageSync(imageId, localImage);
    }
    return localImage;
}
function createAndCacheDerivedImages(referencedImageIds, options = {}) {
    if (referencedImageIds.length === 0) {
        throw new Error('createAndCacheDerivedImages: parameter imageIds must be list of image Ids');
    }
    const derivedImageIds = [];
    const images = referencedImageIds.map((referencedImageId, index) => {
        const newOptions = {
            imageId: options?.getDerivedImageId?.(referencedImageId) ||
                `derived:${(0,_utilities_uuidv4__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A)()}`,
            ...options,
        };
        derivedImageIds.push(newOptions.imageId);
        return createAndCacheDerivedImage(referencedImageId, {
            ...newOptions,
            instanceNumber: index + 1,
        });
    });
    return images;
}
function createAndCacheLocalImage(imageId, options) {
    const { scalarData, origin, direction, targetBuffer, skipCreateBuffer, onCacheAdd, frameOfReferenceUID, voxelRepresentation, referencedImageId, } = options;
    const dimensions = options.dimensions;
    const spacing = options.spacing;
    if (!dimensions || !spacing) {
        throw new Error('createAndCacheLocalImage: dimensions and spacing are required');
    }
    const width = dimensions[0];
    const height = dimensions[1];
    const columnPixelSpacing = spacing[0];
    const rowPixelSpacing = spacing[1];
    const imagePlaneModule = {
        frameOfReferenceUID,
        rows: height,
        columns: width,
        imageOrientationPatient: direction ?? [1, 0, 0, 0, 1, 0],
        rowCosines: direction ? direction.slice(0, 3) : [1, 0, 0],
        columnCosines: direction ? direction.slice(3, 6) : [0, 1, 0],
        imagePositionPatient: origin ?? [0, 0, 0],
        pixelSpacing: [rowPixelSpacing, columnPixelSpacing],
        rowPixelSpacing: rowPixelSpacing,
        columnPixelSpacing: columnPixelSpacing,
    };
    const length = width * height;
    const numberOfComponents = scalarData.length / length;
    let scalarDataToUse;
    if (scalarData) {
        if (!(scalarData instanceof Uint8Array ||
            scalarData instanceof Float32Array ||
            scalarData instanceof Uint16Array ||
            scalarData instanceof Int16Array)) {
            throw new Error('createAndCacheLocalImage: scalarData must be of type Uint8Array, Uint16Array, Int16Array or Float32Array');
        }
        scalarDataToUse = scalarData;
    }
    else if (!skipCreateBuffer) {
        const { TypedArrayConstructor } = (0,_utilities_getBufferConfiguration__WEBPACK_IMPORTED_MODULE_4__/* .getBufferConfiguration */ .h)(targetBuffer?.type, length);
        const imageScalarData = new TypedArrayConstructor(length);
        scalarDataToUse = imageScalarData;
    }
    let bitsAllocated, bitsStored, highBit;
    if (scalarDataToUse instanceof Uint8Array) {
        bitsAllocated = 8;
        bitsStored = 8;
        highBit = 7;
    }
    else if (scalarDataToUse instanceof Uint16Array) {
        bitsAllocated = 16;
        bitsStored = 16;
        highBit = 15;
    }
    else if (scalarDataToUse instanceof Int16Array) {
        bitsAllocated = 16;
        bitsStored = 16;
        highBit = 15;
    }
    else if (scalarDataToUse instanceof Float32Array) {
        bitsAllocated = 32;
        bitsStored = 32;
        highBit = 31;
    }
    else {
        throw new Error('Unsupported scalarData type');
    }
    const imagePixelModule = {
        samplesPerPixel: 1,
        photometricInterpretation: scalarDataToUse.length > dimensions[0] * dimensions[1]
            ? 'RGB'
            : 'MONOCHROME2',
        rows: height,
        columns: width,
        bitsAllocated,
        bitsStored,
        highBit,
    };
    const metadata = {
        imagePlaneModule,
        imagePixelModule,
    };
    ['imagePlaneModule', 'imagePixelModule'].forEach((type) => {
        _utilities_genericMetadataProvider__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.add(imageId, {
            type,
            metadata: metadata[type] || {},
        });
    });
    const id = imageId;
    const voxelManager = (voxelRepresentation === _enums_VoxelManagerEnum__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .A.RLE &&
        _utilities_VoxelManager__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A.createRLEImageVoxelManager({ dimensions, id })) ||
        _utilities_VoxelManager__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A.createImageVoxelManager({
            height,
            width,
            numberOfComponents,
            scalarData: scalarDataToUse,
            id,
        });
    let minPixelValue = scalarDataToUse[0];
    let maxPixelValue = scalarDataToUse[0];
    for (let i = 1; i < scalarDataToUse.length; i++) {
        if (scalarDataToUse[i] < minPixelValue) {
            minPixelValue = scalarDataToUse[i];
        }
        if (scalarDataToUse[i] > maxPixelValue) {
            maxPixelValue = scalarDataToUse[i];
        }
    }
    const image = {
        imageId: imageId,
        intercept: 0,
        windowCenter: 0,
        windowWidth: 0,
        color: imagePixelModule.photometricInterpretation === 'RGB',
        numberOfComponents: imagePixelModule.samplesPerPixel,
        dataType: targetBuffer?.type,
        slope: 1,
        minPixelValue,
        maxPixelValue,
        rows: imagePixelModule.rows,
        columns: imagePixelModule.columns,
        getCanvas: undefined,
        height: imagePixelModule.rows,
        width: imagePixelModule.columns,
        rgba: undefined,
        columnPixelSpacing: imagePlaneModule.columnPixelSpacing,
        rowPixelSpacing: imagePlaneModule.rowPixelSpacing,
        FrameOfReferenceUID: imagePlaneModule.frameOfReferenceUID,
        invert: false,
        getPixelData: () => voxelManager.getScalarData(),
        voxelManager,
        sizeInBytes: scalarData.byteLength,
        referencedImageId,
    };
    onCacheAdd?.(image);
    _cache_cache__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Ay.putImageSync(image.imageId, image);
    return image;
}
function cancelLoadImage(imageId) {
    const filterFunction = ({ additionalDetails }) => {
        if (additionalDetails.imageId) {
            return additionalDetails.imageId !== imageId;
        }
        return true;
    };
    imageLoadPoolManager.filterRequests(filterFunction);
    const imageLoadObject = cache.getImageLoadObject(imageId);
    if (imageLoadObject) {
        imageLoadObject.cancelFn();
    }
}
function cancelLoadImages(imageIds) {
    imageIds.forEach((imageId) => {
        cancelLoadImage(imageId);
    });
}
function cancelLoadAll() {
    const requestPool = imageLoadPoolManager.getRequestPool();
    Object.keys(requestPool).forEach((type) => {
        const requests = requestPool[type];
        Object.keys(requests).forEach((priority) => {
            const requestDetails = requests[priority].pop();
            if (!requestDetails) {
                return;
            }
            const additionalDetails = requestDetails.additionalDetails;
            const { imageId, volumeId } = additionalDetails;
            let loadObject;
            if (imageId) {
                loadObject = cache.getImageLoadObject(imageId);
            }
            else if (volumeId) {
                loadObject = cache.getVolumeLoadObject(volumeId);
            }
            if (loadObject) {
                loadObject.cancel();
            }
        });
        imageLoadPoolManager.clearRequestStack(type);
    });
}
function registerImageLoader(scheme, imageLoader) {
    imageLoaders[scheme] = imageLoader;
}
function registerUnknownImageLoader(imageLoader) {
    const oldImageLoader = unknownImageLoader;
    unknownImageLoader = imageLoader;
    return oldImageLoader;
}
function unregisterAllImageLoaders() {
    Object.keys(imageLoaders).forEach((imageLoader) => delete imageLoaders[imageLoader]);
    unknownImageLoader = undefined;
}
function createAndCacheDerivedLabelmapImages(referencedImageIds, options = {}) {
    return createAndCacheDerivedImages(referencedImageIds, {
        ...options,
        targetBuffer: { type: 'Uint8Array' },
    });
}
function createAndCacheDerivedLabelmapImage(referencedImageId, options = {}) {
    return createAndCacheDerivedImage(referencedImageId, {
        ...options,
        targetBuffer: { type: 'Uint8Array' },
    });
}


/***/ }),

/***/ 56750:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ FrameRange)
/* harmony export */ });
class FrameRange {
    static { this.frameRangeExtractor = /(\/frames\/|[&?]frameNumber=)([^/&?]*)/i; }
    static imageIdToFrames(imageId) {
        const match = imageId.match(this.frameRangeExtractor);
        if (!match || !match[2]) {
            return null;
        }
        const range = match[2].split('-').map((it) => Number(it));
        if (range.length === 1) {
            return range[0];
        }
        return range;
    }
    static imageIdToFrameEnd(imageId) {
        const range = this.imageIdToFrames(imageId);
        return Array.isArray(range) ? range[1] : range;
    }
    static imageIdToFrameStart(imageId) {
        const range = this.imageIdToFrames(imageId);
        return Array.isArray(range) ? range[0] : range;
    }
    static framesToString(range) {
        if (Array.isArray(range)) {
            return `${range[0]}-${range[1]}`;
        }
        return String(range);
    }
    static framesToImageId(imageId, range) {
        const match = imageId.match(this.frameRangeExtractor);
        if (!match || !match[2]) {
            return null;
        }
        const newRangeString = this.framesToString(range);
        return imageId.replace(this.frameRangeExtractor, `${match[1]}${newRangeString}`);
    }
}


/***/ }),

/***/ 13876:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ PointsManager)
/* harmony export */ });
class PointsManager {
    constructor(configuration = {}) {
        this._dimensions = 3;
        this._length = 0;
        this._byteSize = 4;
        this.growSize = 128;
        const { initialSize = 1024, dimensions = 3, growSize = 128, } = configuration;
        const itemLength = initialSize * dimensions;
        this.growSize = growSize;
        this.array = new ArrayBuffer(itemLength * this._byteSize);
        this.data = new Float32Array(this.array);
        this._dimensions = dimensions;
    }
    forEach(func) {
        for (let i = 0; i < this._length; i++) {
            func(this.getPoint(i), i);
        }
    }
    get length() {
        return this._length;
    }
    get dimensions() {
        return this._dimensions;
    }
    get dimensionLength() {
        return this._length * this._dimensions;
    }
    getPoint(index) {
        if (index < 0) {
            index += this._length;
        }
        if (index < 0 || index >= this._length) {
            return;
        }
        const offset = this._dimensions * index;
        return this.data.subarray(offset, offset + this._dimensions);
    }
    getPointArray(index) {
        const array = [];
        if (index < 0) {
            index += this._length;
        }
        if (index < 0 || index >= this._length) {
            return;
        }
        const offset = this._dimensions * index;
        for (let i = 0; i < this._dimensions; i++) {
            array.push(this.data[i + offset]);
        }
        return array;
    }
    grow(additionalSize = 1, growSize = this.growSize) {
        if (this.dimensionLength + additionalSize * this._dimensions <=
            this.data.length) {
            return;
        }
        const newSize = this.data.length + growSize;
        const newArray = new ArrayBuffer(newSize * this._dimensions * this._byteSize);
        const newData = new Float32Array(newArray);
        newData.set(this.data);
        this.data = newData;
        this.array = newArray;
    }
    reverse() {
        const midLength = Math.floor(this._length / 2);
        for (let i = 0; i < midLength; i++) {
            const indexStart = i * this._dimensions;
            const indexEnd = (this._length - 1 - i) * this._dimensions;
            for (let dimension = 0; dimension < this._dimensions; dimension++) {
                const valueStart = this.data[indexStart + dimension];
                this.data[indexStart + dimension] = this.data[indexEnd + dimension];
                this.data[indexEnd + dimension] = valueStart;
            }
        }
    }
    getTypedArray() {
        return this.data;
    }
    push(point) {
        this.grow(1);
        const offset = this.length * this._dimensions;
        for (let i = 0; i < this._dimensions; i++) {
            this.data[i + offset] = point[i];
        }
        this._length++;
    }
    map(f) {
        const mapData = [];
        for (let i = 0; i < this._length; i++) {
            mapData.push(f(this.getPoint(i), i));
        }
        return mapData;
    }
    get points() {
        return this.map((p) => p);
    }
    toXYZ() {
        const xyz = { x: [], y: [] };
        if (this._dimensions >= 3) {
            xyz.z = [];
        }
        const { x, y, z } = xyz;
        this.forEach((p) => {
            x.push(p[0]);
            y.push(p[1]);
            if (z) {
                z.push(p[2]);
            }
        });
        return xyz;
    }
    static fromXYZ({ x, y, z }) {
        const array = PointsManager.create3(x.length);
        let offset = 0;
        for (let i = 0; i < x.length; i++) {
            array.data[offset++] = x[i];
            array.data[offset++] = y[i];
            array.data[offset++] = z ? z[i] : 0;
        }
        array._length = x.length;
        return array;
    }
    subselect(count = 10, offset = 0) {
        const selected = new PointsManager({
            initialSize: count,
            dimensions: this._dimensions,
        });
        for (let i = 0; i < count; i++) {
            const index = (offset + Math.floor((this.length * i) / count)) % this.length;
            selected.push(this.getPoint(index));
        }
        return selected;
    }
    static create3(initialSize = 128, points) {
        initialSize = Math.max(initialSize, points?.length || 0);
        const newPoints = new PointsManager({ initialSize, dimensions: 3 });
        if (points) {
            points.forEach((point) => newPoints.push(point));
        }
        return newPoints;
    }
    static create2(initialSize = 128) {
        return new PointsManager({ initialSize, dimensions: 2 });
    }
}


/***/ }),

/***/ 22191:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ ProgressiveIterator)
/* harmony export */ });
/* unused harmony export PromiseIterator */
class PromiseIterator extends (/* unused pure expression or super */ null && (Promise)) {
}
class ProgressiveIterator {
    constructor(name) {
        this.name = name || 'unknown';
    }
    static as(promise) {
        if (promise.iterator) {
            return promise.iterator;
        }
        const iterator = new ProgressiveIterator('as iterator');
        promise.then((v) => {
            try {
                iterator.add(v, true);
            }
            catch (e) {
                iterator.reject(e);
            }
        }, (reason) => {
            iterator.reject(reason);
        });
        return iterator;
    }
    add(x, done = false) {
        this.nextValue = x;
        this.done ||= done;
        if (this.waiting) {
            this.waiting.resolve(x);
            this.waiting = undefined;
        }
    }
    resolve() {
        this.done = true;
        if (this.waiting) {
            this.waiting.resolve(this.nextValue);
            this.waiting = undefined;
        }
    }
    reject(reason) {
        this.rejectReason = reason;
        this.waiting?.reject(reason);
    }
    getRecent() {
        if (this.rejectReason) {
            throw this.rejectReason;
        }
        return this.nextValue;
    }
    async *[Symbol.asyncIterator]() {
        while (!this.done) {
            if (this.rejectReason) {
                throw this.rejectReason;
            }
            if (this.nextValue !== undefined) {
                yield this.nextValue;
                if (this.done) {
                    break;
                }
            }
            if (!this.waiting) {
                this.waiting = {};
                this.waiting.promise = new Promise((resolve, reject) => {
                    this.waiting.resolve = resolve;
                    this.waiting.reject = reject;
                });
            }
            await this.waiting.promise;
        }
        yield this.nextValue;
    }
    async forEach(callback, errorCallback) {
        let index = 0;
        try {
            for await (const value of this) {
                const { done } = this;
                try {
                    await callback(value, done, index);
                    index++;
                }
                catch (e) {
                    if (!done) {
                        console.warn('Caught exception in intermediate value', e);
                        continue;
                    }
                    if (errorCallback) {
                        errorCallback(e, done);
                    }
                    else {
                        throw e;
                    }
                }
            }
        }
        catch (e) {
            if (errorCallback) {
                errorCallback(e, true);
            }
            else {
                throw e;
            }
        }
    }
    generate(processFunction, errorCallback) {
        return processFunction(this, this.reject.bind(this)).then(() => {
            if (!this.done) {
                this.resolve();
            }
        }, (reason) => {
            this.reject(reason);
            if (errorCallback) {
                errorCallback(reason);
            }
            else {
                console.warn("Couldn't process because", reason);
            }
        });
    }
    async nextPromise() {
        for await (const i of this) {
            if (i) {
                return i;
            }
        }
        return this.nextValue;
    }
    async donePromise() {
        for await (const i of this) {
        }
        return this.nextValue;
    }
    getNextPromise() {
        const promise = this.nextPromise();
        promise.iterator = this;
        return promise;
    }
    getDonePromise() {
        const promise = this.donePromise();
        promise.iterator = this;
        return promise;
    }
}


/***/ }),

/***/ 67645:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ RLEVoxelMap)
/* harmony export */ });
const ADJACENT_ALL = [
    [0, -1, 0],
    [0, 1, 0],
    [0, 0, -1],
    [0, 0, 1],
];
const ADJACENT_SINGLE_PLANE = [
    [0, -1, 0],
    [0, 1, 0],
];
const ADJACENT_IN = [
    [0, -1, 0],
    [0, 1, 0],
    [0, 0, -1],
];
const ADJACENT_OUT = [
    [0, -1, 0],
    [0, 1, 0],
    [0, 0, 1],
];
class RLEVoxelMap {
    static copyMap(destination, source) {
        for (const [index, row] of source.rows) {
            destination.rows.set(index, structuredClone(row));
        }
    }
    constructor(width, height, depth = 1) {
        this.rows = new Map();
        this.height = 1;
        this.width = 1;
        this.depth = 1;
        this.jMultiple = 1;
        this.kMultiple = 1;
        this.numComps = 1;
        this.pixelDataConstructor = Uint8Array;
        this.updateScalarData = function (scalarData) {
            scalarData.fill(0);
            const callback = (index, rle, row) => {
                const { start, end, value } = rle;
                for (let i = start; i < end; i++) {
                    scalarData[index + i] = value;
                }
            };
            this.forEach(callback);
        };
        this.get = (index) => {
            const i = index % this.jMultiple;
            const j = (index - i) / this.jMultiple;
            const rle = this.getRLE(i, j);
            return rle?.value ?? this.defaultValue;
        };
        this.getRun = (j, k) => {
            const runIndex = j + k * this.height;
            return this.rows.get(runIndex);
        };
        this.set = (index, value) => {
            if (value === undefined) {
                return;
            }
            const i = index % this.width;
            const j = (index - i) / this.width;
            const row = this.rows.get(j);
            if (!row) {
                this.rows.set(j, [{ start: i, end: i + 1, value }]);
                return;
            }
            const rleIndex = this.findIndex(row, i);
            const rle1 = row[rleIndex];
            const rle0 = row[rleIndex - 1];
            if (!rle1) {
                if (!rle0 || rle0.value !== value || rle0.end !== i) {
                    row[rleIndex] = { start: i, end: i + 1, value };
                    return;
                }
                rle0.end++;
                return;
            }
            const { start, end, value: oldValue } = rle1;
            if (value === oldValue && i >= start) {
                return;
            }
            const rleInsert = { start: i, end: i + 1, value };
            const isAfter = i > start;
            const insertIndex = isAfter ? rleIndex + 1 : rleIndex;
            const rlePrev = isAfter ? rle1 : rle0;
            let rleNext = isAfter ? row[rleIndex + 1] : rle1;
            if (rlePrev?.value === value && rlePrev?.end === i) {
                rlePrev.end++;
                if (rleNext?.value === value && rleNext.start === i + 1) {
                    rlePrev.end = rleNext.end;
                    row.splice(rleIndex, 1);
                }
                else if (rleNext?.start === i) {
                    rleNext.start++;
                    if (rleNext.start === rleNext.end) {
                        row.splice(rleIndex, 1);
                        rleNext = row[rleIndex];
                        if (rleNext?.start === i + 1 && rleNext.value === value) {
                            rlePrev.end = rleNext.end;
                            row.splice(rleIndex, 1);
                        }
                    }
                }
                return;
            }
            if (rleNext?.value === value && rleNext.start === i + 1) {
                rleNext.start--;
                if (rlePrev?.end > i) {
                    rlePrev.end = i;
                    if (rlePrev.end === rlePrev.start) {
                        row.splice(rleIndex, 1);
                    }
                }
                return;
            }
            if (rleNext?.start === i && rleNext.end === i + 1) {
                rleNext.value = value;
                const nextnext = row[rleIndex + 1];
                if (nextnext?.start == i + 1 && nextnext.value === value) {
                    row.splice(rleIndex + 1, 1);
                    rleNext.end = nextnext.end;
                }
                return;
            }
            if (i === rleNext?.start) {
                rleNext.start++;
            }
            if (isAfter && end > i + 1) {
                row.splice(insertIndex, 0, rleInsert, {
                    start: i + 1,
                    end: rlePrev.end,
                    value: rlePrev.value,
                });
            }
            else {
                row.splice(insertIndex, 0, rleInsert);
            }
            if (rlePrev?.end > i) {
                rlePrev.end = i;
            }
        };
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.jMultiple = width;
        this.kMultiple = this.jMultiple * height;
    }
    static { this.getScalarData = function (ArrayType = Uint8ClampedArray) {
        const scalarData = new ArrayType(this.frameSize);
        this.map.updateScalarData(scalarData);
        return scalarData;
    }; }
    toIJK(index) {
        const i = index % this.jMultiple;
        const j = ((index - i) / this.jMultiple) % this.height;
        const k = Math.floor(index / this.kMultiple);
        return [i, j, k];
    }
    toIndex([i, j, k]) {
        return i + k * this.kMultiple + j * this.jMultiple;
    }
    getRLE(i, j, k = 0) {
        const row = this.rows.get(j + k * this.height);
        if (!row) {
            return;
        }
        const index = this.findIndex(row, i);
        const rle = row[index];
        return i >= rle?.start ? rle : undefined;
    }
    has(index) {
        const i = index % this.jMultiple;
        const j = (index - i) / this.jMultiple;
        const rle = this.getRLE(i, j);
        return rle?.value !== undefined;
    }
    delete(index) {
        const i = index % this.width;
        const j = (index - i) / this.width;
        const row = this.rows.get(j);
        if (!row) {
            return;
        }
        const rleIndex = this.findIndex(row, i);
        const rle = row[rleIndex];
        if (!rle || rle.start > i) {
            return;
        }
        if (rle.end === i + 1) {
            rle.end--;
            if (rle.start >= rle.end) {
                row.splice(rleIndex, 1);
                if (!row.length) {
                    this.rows.delete(j);
                }
            }
            return;
        }
        if (rle.start === i) {
            rle.start++;
            return;
        }
        const newRle = {
            value: rle.value,
            start: i + 1,
            end: rle.end,
        };
        rle.end = i;
        row.splice(rleIndex + 1, 0, newRle);
    }
    findIndex(row, i) {
        for (let index = 0; index < row.length; index++) {
            const { end: iEnd } = row[index];
            if (i < iEnd) {
                return index;
            }
        }
        return row.length;
    }
    forEach(callback, options) {
        const rowModified = options?.rowModified;
        for (const [baseIndex, row] of this.rows) {
            const rowToUse = rowModified ? [...row] : row;
            for (const rle of rowToUse) {
                callback(baseIndex * this.width, rle, row);
            }
        }
    }
    forEachRow(callback) {
        for (const [baseIndex, row] of this.rows) {
            callback(baseIndex * this.width, row);
        }
    }
    clear() {
        this.rows.clear();
    }
    keys() {
        return [...this.rows.keys()];
    }
    getPixelData(k = 0, pixelData) {
        if (!pixelData) {
            pixelData = new this.pixelDataConstructor(this.width * this.height * this.numComps);
        }
        else {
            pixelData.fill(0);
        }
        const { width, height, numComps } = this;
        for (let j = 0; j < height; j++) {
            const row = this.getRun(j, k);
            if (!row) {
                continue;
            }
            if (numComps === 1) {
                for (const rle of row) {
                    const rowOffset = j * width;
                    const { start, end, value } = rle;
                    for (let i = start; i < end; i++) {
                        pixelData[rowOffset + i] = value;
                    }
                }
            }
            else {
                for (const rle of row) {
                    const rowOffset = j * width * numComps;
                    const { start, end, value } = rle;
                    for (let i = start; i < end; i += numComps) {
                        for (let comp = 0; comp < numComps; comp++) {
                            pixelData[rowOffset + i + comp] = value[comp];
                        }
                    }
                }
            }
        }
        return pixelData;
    }
    floodFill(i, j, k, value, options) {
        const rle = this.getRLE(i, j, k);
        if (!rle) {
            throw new Error(`Initial point ${i},${j},${k} isn't in the RLE`);
        }
        const stack = [[rle, j, k]];
        const replaceValue = rle.value;
        if (replaceValue === value) {
            throw new Error(`source (${replaceValue}) and destination (${value}) are identical`);
        }
        return this.flood(stack, replaceValue, value, options);
    }
    flood(stack, sourceValue, value, options) {
        let sum = 0;
        const { planar = true, diagonals = true, singlePlane = false, } = options || {};
        const childOptions = { planar, diagonals, singlePlane };
        while (stack.length) {
            const top = stack.pop();
            const [current] = top;
            if (current.value !== sourceValue) {
                continue;
            }
            current.value = value;
            sum += current.end - current.start;
            const adjacents = this.findAdjacents(top, childOptions).filter((adjacent) => adjacent && adjacent[0].value === sourceValue);
            stack.push(...adjacents);
        }
        return sum;
    }
    fillFrom(getter, boundsIJK) {
        for (let k = boundsIJK[2][0]; k <= boundsIJK[2][1]; k++) {
            for (let j = boundsIJK[1][0]; j <= boundsIJK[1][1]; j++) {
                let rle;
                let row;
                for (let i = boundsIJK[0][0]; i <= boundsIJK[0][1]; i++) {
                    const value = getter(i, j, k);
                    if (value === undefined) {
                        rle = undefined;
                        continue;
                    }
                    if (!row) {
                        row = [];
                        this.rows.set(j + k * this.height, row);
                    }
                    if (rle && rle.value !== value) {
                        rle = undefined;
                    }
                    if (!rle) {
                        rle = { start: i, end: i, value };
                        row.push(rle);
                    }
                    rle.end++;
                }
            }
        }
    }
    findAdjacents(item, { diagonals = true, planar = true, singlePlane = false }) {
        const [rle, j, k, adjacentsDelta] = item;
        const { start, end } = rle;
        const leftRle = start > 0 && this.getRLE(start - 1, j, k);
        const rightRle = end < this.width && this.getRLE(end, j, k);
        const range = diagonals
            ? [start > 0 ? start - 1 : start, end < this.width ? end + 1 : end]
            : [start, end];
        const adjacents = [];
        if (leftRle) {
            adjacents.push([leftRle, j, k]);
        }
        if (rightRle) {
            adjacents.push([rightRle, j, k]);
        }
        for (const delta of adjacentsDelta ||
            (singlePlane ? ADJACENT_SINGLE_PLANE : ADJACENT_ALL)) {
            const [, delta1, delta2] = delta;
            const testJ = delta1 + j;
            const testK = delta2 + k;
            if (testJ < 0 || testJ >= this.height) {
                continue;
            }
            if (testK < 0 || testK >= this.depth) {
                continue;
            }
            const row = this.getRun(testJ, testK);
            if (!row) {
                continue;
            }
            for (const testRle of row) {
                const newAdjacentDelta = adjacentsDelta ||
                    (singlePlane && ADJACENT_SINGLE_PLANE) ||
                    (planar && delta2 > 0 && ADJACENT_OUT) ||
                    (planar && delta2 < 0 && ADJACENT_IN) ||
                    ADJACENT_ALL;
                if (!(testRle.end <= range[0] || testRle.start >= range[1])) {
                    adjacents.push([testRle, testJ, testK, newAdjacentDelta]);
                }
            }
        }
        return adjacents;
    }
}


/***/ }),

/***/ 98039:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   N: () => (/* binding */ actorIsA),
/* harmony export */   e: () => (/* binding */ isImageActor)
/* harmony export */ });
function isImageActor(actorEntry) {
    return (actorIsA(actorEntry, 'vtkVolume') || actorIsA(actorEntry, 'vtkImageSlice'));
}
function actorIsA(actorEntry, actorType) {
    const actorToCheck = 'isA' in actorEntry ? actorEntry : actorEntry.actor;
    if (!actorToCheck) {
        return false;
    }
    return !!actorToCheck.isA(actorType);
}


/***/ }),

/***/ 96833:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ applyPreset)
/* harmony export */ });
/* harmony import */ var _kitware_vtk_js_Rendering_Core_ColorTransferFunction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(642);
/* harmony import */ var _kitware_vtk_js_Common_DataModel_PiecewiseFunction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(99341);


function applyPreset(actor, preset) {
    const colorTransferArray = preset.colorTransfer
        .split(' ')
        .splice(1)
        .map(parseFloat);
    const { shiftRange } = getShiftRange(colorTransferArray);
    const min = shiftRange[0];
    const width = shiftRange[1] - shiftRange[0];
    const cfun = _kitware_vtk_js_Rendering_Core_ColorTransferFunction__WEBPACK_IMPORTED_MODULE_0__/* ["default"].newInstance */ .Ay.newInstance();
    const normColorTransferValuePoints = [];
    for (let i = 0; i < colorTransferArray.length; i += 4) {
        let value = colorTransferArray[i];
        const r = colorTransferArray[i + 1];
        const g = colorTransferArray[i + 2];
        const b = colorTransferArray[i + 3];
        value = (value - min) / width;
        normColorTransferValuePoints.push([value, r, g, b]);
    }
    applyPointsToRGBFunction(normColorTransferValuePoints, shiftRange, cfun);
    actor.getProperty().setRGBTransferFunction(0, cfun);
    const scalarOpacityArray = preset.scalarOpacity
        .split(' ')
        .splice(1)
        .map(parseFloat);
    const ofun = _kitware_vtk_js_Common_DataModel_PiecewiseFunction__WEBPACK_IMPORTED_MODULE_1__/* ["default"].newInstance */ .Ay.newInstance();
    const normPoints = [];
    for (let i = 0; i < scalarOpacityArray.length; i += 2) {
        let value = scalarOpacityArray[i];
        const opacity = scalarOpacityArray[i + 1];
        value = (value - min) / width;
        normPoints.push([value, opacity]);
    }
    applyPointsToPiecewiseFunction(normPoints, shiftRange, ofun);
    const property = actor.getProperty();
    property.setScalarOpacity(0, ofun);
    const [gradientMinValue, gradientMinOpacity, gradientMaxValue, gradientMaxOpacity,] = preset.gradientOpacity.split(' ').splice(1).map(parseFloat);
    property.setUseGradientOpacity(0, true);
    property.setGradientOpacityMinimumValue(0, gradientMinValue);
    property.setGradientOpacityMinimumOpacity(0, gradientMinOpacity);
    property.setGradientOpacityMaximumValue(0, gradientMaxValue);
    property.setGradientOpacityMaximumOpacity(0, gradientMaxOpacity);
    if (preset.interpolation === '1') {
        property.setInterpolationTypeToFastLinear();
    }
    property.setShade(preset.shade === '1');
    const ambient = parseFloat(preset.ambient);
    const diffuse = parseFloat(preset.diffuse);
    const specular = parseFloat(preset.specular);
    const specularPower = parseFloat(preset.specularPower);
    property.setAmbient(ambient);
    property.setDiffuse(diffuse);
    property.setSpecular(specular);
    property.setSpecularPower(specularPower);
}
function getShiftRange(colorTransferArray) {
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < colorTransferArray.length; i += 4) {
        min = Math.min(min, colorTransferArray[i]);
        max = Math.max(max, colorTransferArray[i]);
    }
    const center = (max - min) / 2;
    return {
        shiftRange: [-center, center],
        min,
        max,
    };
}
function applyPointsToRGBFunction(points, range, cfun) {
    const width = range[1] - range[0];
    const rescaled = points.map(([x, r, g, b]) => [
        x * width + range[0],
        r,
        g,
        b,
    ]);
    cfun.removeAllPoints();
    rescaled.forEach(([x, r, g, b]) => cfun.addRGBPoint(x, r, g, b));
    return rescaled;
}
function applyPointsToPiecewiseFunction(points, range, pwf) {
    const width = range[1] - range[0];
    const rescaled = points.map(([x, y]) => [x * width + range[0], y]);
    pwf.removeAllPoints();
    rescaled.forEach(([x, y]) => pwf.addPoint(x, y));
    return rescaled;
}


/***/ }),

/***/ 91979:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _RenderingEngine_getRenderingEngine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(39536);
/* harmony import */ var _getViewportsWithVolumeId__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(24724);


const autoLoad = (volumeId) => {
    const renderingEngineAndViewportIds = getRenderingEngineAndViewportsContainingVolume(volumeId);
    if (!renderingEngineAndViewportIds?.length) {
        return;
    }
    renderingEngineAndViewportIds.forEach(({ renderingEngine, viewportIds }) => {
        if (!renderingEngine.hasBeenDestroyed) {
            renderingEngine.renderViewports(viewportIds);
        }
    });
};
function getRenderingEngineAndViewportsContainingVolume(volumeId) {
    const renderingEnginesArray = (0,_RenderingEngine_getRenderingEngine__WEBPACK_IMPORTED_MODULE_0__/* .getRenderingEngines */ .qO)();
    const renderingEngineAndViewportIds = [];
    renderingEnginesArray.forEach((renderingEngine) => {
        const viewports = (0,_getViewportsWithVolumeId__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(volumeId);
        if (viewports.length) {
            renderingEngineAndViewportIds.push({
                renderingEngine,
                viewportIds: viewports.map((viewport) => viewport.id),
            });
        }
    });
    return renderingEngineAndViewportIds;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (autoLoad);


/***/ }),

/***/ 89131:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KP: () => (/* binding */ buildMetadata),
/* harmony export */   SJ: () => (/* binding */ getImagePlaneModule)
/* harmony export */ });
/* unused harmony exports getValidVOILUTFunction, calibrateImagePlaneModule */
/* harmony import */ var _metaData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(74876);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(71851);


function getValidVOILUTFunction(voiLUTFunction) {
    if (!Object.values(_enums__WEBPACK_IMPORTED_MODULE_1__.VOILUTFunctionType).includes(voiLUTFunction)) {
        return _enums__WEBPACK_IMPORTED_MODULE_1__.VOILUTFunctionType.LINEAR;
    }
    return voiLUTFunction;
}
function getImagePlaneModule(imageId) {
    const imagePlaneModule = _metaData__WEBPACK_IMPORTED_MODULE_0__.get(_enums__WEBPACK_IMPORTED_MODULE_1__.MetadataModules.IMAGE_PLANE, imageId);
    const newImagePlaneModule = {
        ...imagePlaneModule,
    };
    if (!newImagePlaneModule.columnPixelSpacing) {
        newImagePlaneModule.columnPixelSpacing = 1;
    }
    if (!newImagePlaneModule.rowPixelSpacing) {
        newImagePlaneModule.rowPixelSpacing = 1;
    }
    if (!newImagePlaneModule.columnCosines) {
        newImagePlaneModule.columnCosines = [0, 1, 0];
    }
    if (!newImagePlaneModule.rowCosines) {
        newImagePlaneModule.rowCosines = [1, 0, 0];
    }
    if (!newImagePlaneModule.imagePositionPatient) {
        newImagePlaneModule.imagePositionPatient = [0, 0, 0];
    }
    if (!newImagePlaneModule.imageOrientationPatient) {
        newImagePlaneModule.imageOrientationPatient = new Float32Array([
            1, 0, 0, 0, 1, 0,
        ]);
    }
    return newImagePlaneModule;
}
function calibrateImagePlaneModule(imageId, imagePlaneModule, currentCalibration) {
    const calibration = metaData.get('calibratedPixelSpacing', imageId);
    const isUpdated = currentCalibration !== calibration;
    const { scale } = calibration || {};
    const hasPixelSpacing = scale > 0 || imagePlaneModule.rowPixelSpacing > 0;
    imagePlaneModule.calibration = calibration;
    if (!isUpdated) {
        return { imagePlaneModule, hasPixelSpacing };
    }
    return {
        imagePlaneModule,
        hasPixelSpacing,
        calibrationEvent: {
            scale,
            calibration,
        },
    };
}
function buildMetadata(image) {
    const imageId = image.imageId;
    const { pixelRepresentation, bitsAllocated, bitsStored, highBit, photometricInterpretation, samplesPerPixel, } = _metaData__WEBPACK_IMPORTED_MODULE_0__.get('imagePixelModule', imageId);
    const { windowWidth, windowCenter, voiLUTFunction } = image;
    const { modality } = _metaData__WEBPACK_IMPORTED_MODULE_0__.get('generalSeriesModule', imageId);
    const imageIdScalingFactor = _metaData__WEBPACK_IMPORTED_MODULE_0__.get('scalingModule', imageId);
    const calibration = _metaData__WEBPACK_IMPORTED_MODULE_0__.get(_enums__WEBPACK_IMPORTED_MODULE_1__.MetadataModules.CALIBRATION, imageId);
    const voiLUTFunctionEnum = getValidVOILUTFunction(voiLUTFunction);
    const imagePlaneModule = getImagePlaneModule(imageId);
    return {
        calibration,
        scalingFactor: imageIdScalingFactor,
        voiLUTFunction: voiLUTFunctionEnum,
        modality,
        imagePlaneModule,
        imagePixelModule: {
            bitsAllocated,
            bitsStored,
            samplesPerPixel,
            highBit,
            photometricInterpretation,
            pixelRepresentation,
            windowWidth: windowWidth,
            windowCenter: windowCenter,
            modality,
            voiLUTFunction: voiLUTFunctionEnum,
        },
    };
}


/***/ }),

/***/ 42384:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ calculateSpacingBetweenImageIds)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);
/* harmony import */ var _metaData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(74876);
/* harmony import */ var _init__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(26896);



function calculateSpacingBetweenImageIds(imageIds) {
    const { imagePositionPatient: referenceImagePositionPatient, imageOrientationPatient, } = _metaData__WEBPACK_IMPORTED_MODULE_1__.get('imagePlaneModule', imageIds[0]);
    const rowCosineVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(imageOrientationPatient[0], imageOrientationPatient[1], imageOrientationPatient[2]);
    const colCosineVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(imageOrientationPatient[3], imageOrientationPatient[4], imageOrientationPatient[5]);
    const scanAxisNormal = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.cross */ .eR.cross(scanAxisNormal, rowCosineVec, colCosineVec);
    const refIppVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(referenceImagePositionPatient[0], referenceImagePositionPatient[1], referenceImagePositionPatient[2]);
    const usingWadoUri = imageIds[0].split(':')[0] === 'wadouri';
    let spacing;
    function getDistance(imageId) {
        const { imagePositionPatient } = _metaData__WEBPACK_IMPORTED_MODULE_1__.get('imagePlaneModule', imageId);
        const positionVector = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
        const ippVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(imagePositionPatient[0], imagePositionPatient[1], imagePositionPatient[2]);
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.sub */ .eR.sub(positionVector, refIppVec, ippVec);
        return gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(positionVector, scanAxisNormal);
    }
    if (!usingWadoUri) {
        const distanceImagePairs = imageIds.map((imageId) => {
            const distance = getDistance(imageId);
            return {
                distance,
                imageId,
            };
        });
        distanceImagePairs.sort((a, b) => b.distance - a.distance);
        const numImages = distanceImagePairs.length;
        spacing =
            Math.abs(distanceImagePairs[numImages - 1].distance -
                distanceImagePairs[0].distance) /
                (numImages - 1);
    }
    else {
        const prefetchedImageIds = [
            imageIds[0],
            imageIds[Math.floor(imageIds.length / 2)],
        ];
        const firstImageDistance = getDistance(prefetchedImageIds[0]);
        const middleImageDistance = getDistance(prefetchedImageIds[1]);
        const metadataForMiddleImage = _metaData__WEBPACK_IMPORTED_MODULE_1__.get('imagePlaneModule', prefetchedImageIds[1]);
        if (!metadataForMiddleImage) {
            throw new Error('Incomplete metadata required for volume construction.');
        }
        const positionVector = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
        const middleIppVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(metadataForMiddleImage.imagePositionPatient[0], metadataForMiddleImage.imagePositionPatient[1], metadataForMiddleImage.imagePositionPatient[2]);
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.sub */ .eR.sub(positionVector, refIppVec, middleIppVec);
        const distanceBetweenFirstAndMiddleImages = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(positionVector, scanAxisNormal);
        spacing =
            Math.abs(distanceBetweenFirstAndMiddleImages) /
                Math.floor(imageIds.length / 2);
    }
    const { sliceThickness, spacingBetweenSlices } = _metaData__WEBPACK_IMPORTED_MODULE_1__.get('imagePlaneModule', imageIds[0]);
    const { strictZSpacingForVolumeViewport } = (0,_init__WEBPACK_IMPORTED_MODULE_2__/* .getConfiguration */ .D0)().rendering;
    if ((spacing === 0 || isNaN(spacing)) && !strictZSpacingForVolumeViewport) {
        if (spacingBetweenSlices) {
            console.debug('Could not calculate spacing. Using spacingBetweenSlices');
            spacing = spacingBetweenSlices;
        }
        else if (sliceThickness) {
            console.debug('Could not calculate spacing and no spacingBetweenSlices. Using sliceThickness');
            spacing = sliceThickness;
        }
        else {
            console.debug('Could not calculate spacing. The VolumeViewport visualization is compromised. Setting spacing to 1 to render');
            spacing = 1;
        }
    }
    return spacing;
}


/***/ }),

/***/ 84061:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ clamp),
/* harmony export */   q: () => (/* binding */ clamp)
/* harmony export */ });
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}



/***/ }),

/***/ 13859:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   findMatchingColormap: () => (/* binding */ findMatchingColormap),
/* harmony export */   getColormap: () => (/* binding */ getColormap),
/* harmony export */   getColormapNames: () => (/* binding */ getColormapNames),
/* harmony export */   getMaxOpacity: () => (/* binding */ getMaxOpacity),
/* harmony export */   getThresholdValue: () => (/* binding */ getThresholdValue),
/* harmony export */   registerColormap: () => (/* binding */ registerColormap),
/* harmony export */   setColorMapTransferFunctionForVolumeActor: () => (/* binding */ setColorMapTransferFunctionForVolumeActor),
/* harmony export */   updateOpacity: () => (/* binding */ updateOpacity),
/* harmony export */   updateThreshold: () => (/* binding */ updateThreshold)
/* harmony export */ });
/* harmony import */ var _kitware_vtk_js_Rendering_Core_ColorTransferFunction_ColorMaps__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(660);
/* harmony import */ var _kitware_vtk_js_Rendering_Core_ColorTransferFunction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(642);
/* harmony import */ var _kitware_vtk_js_Common_DataModel_PiecewiseFunction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(99341);
/* harmony import */ var _isEqual__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(74638);
/* harmony import */ var _actorCheck__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(98039);





const _colormaps = new Map();
function registerColormap(colormap) {
    colormap.name = colormap.name || colormap.Name;
    _colormaps.set(colormap.name, colormap);
}
function getColormap(name) {
    return _colormaps.get(name);
}
function getColormapNames() {
    return Array.from(_colormaps.keys());
}
function findMatchingColormap(rgbPoints, actor) {
    const colormapsVTK = _kitware_vtk_js_Rendering_Core_ColorTransferFunction_ColorMaps__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.rgbPresetNames.map((presetName) => _kitware_vtk_js_Rendering_Core_ColorTransferFunction_ColorMaps__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.getPresetByName(presetName));
    const colormapsCS3D = getColormapNames().map((colormapName) => getColormap(colormapName));
    const colormaps = colormapsVTK.concat(colormapsCS3D);
    const matchedColormap = colormaps.find((colormap) => {
        const { RGBPoints: presetRGBPoints } = colormap;
        if (presetRGBPoints.length !== rgbPoints.length) {
            return false;
        }
        for (let i = 0; i < presetRGBPoints.length; i += 4) {
            if (!(0,_isEqual__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Ay)(presetRGBPoints.slice(i + 1, i + 4), rgbPoints.slice(i + 1, i + 4))) {
                return false;
            }
        }
        return true;
    });
    if (!matchedColormap) {
        return null;
    }
    const opacity = [];
    if ((0,_actorCheck__WEBPACK_IMPORTED_MODULE_4__/* .actorIsA */ .N)(actor, 'vtkVolume')) {
        const opacityPoints = actor
            .getProperty()
            .getScalarOpacity(0)
            .getDataPointer();
        if (!opacityPoints) {
            return {
                name: matchedColormap.Name,
            };
        }
        for (let i = 0; i < opacityPoints.length; i += 2) {
            opacity.push({
                value: opacityPoints[i],
                opacity: opacityPoints[i + 1],
            });
        }
    }
    const result = {
        name: matchedColormap.Name,
        ...(Array.isArray(opacity) && opacity.length > 0 && { opacity }),
        ...(typeof opacity === 'number' && { opacity }),
    };
    return result;
}
function setColorMapTransferFunctionForVolumeActor(volumeInfo) {
    const { volumeActor, preset, opacity = 0.9, threshold = null, colorRange = [0, 5], } = volumeInfo;
    const mapper = volumeActor.getMapper();
    mapper.setSampleDistance(1.0);
    const cfun = _kitware_vtk_js_Rendering_Core_ColorTransferFunction__WEBPACK_IMPORTED_MODULE_1__/* ["default"].newInstance */ .Ay.newInstance();
    const presetToUse = preset || _kitware_vtk_js_Rendering_Core_ColorTransferFunction_ColorMaps__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.getPresetByName('hsv');
    cfun.applyColorMap(presetToUse);
    cfun.setMappingRange(colorRange[0], colorRange[1]);
    volumeActor.getProperty().setRGBTransferFunction(0, cfun);
    updateOpacityWithThreshold(volumeActor, opacity, threshold);
}
function updateOpacity(volumeActor, newOpacity) {
    const currentThreshold = getThresholdValue(volumeActor);
    updateOpacityWithThreshold(volumeActor, newOpacity, currentThreshold);
}
function updateThreshold(volumeActor, newThreshold) {
    const currentOpacity = getMaxOpacity(volumeActor);
    updateOpacityWithThreshold(volumeActor, currentOpacity, newThreshold);
}
function updateOpacityWithThreshold(volumeActor, opacity, threshold) {
    const meta = volumeActor.getMapper().getInputData().get('voxelManager');
    if (!meta?.voxelManager) {
        throw new Error('No voxel manager was found for the volume actor, or you cannot yet update opacity with a threshold using stacked images');
    }
    const range = meta.voxelManager.getRange();
    const ofun = _kitware_vtk_js_Common_DataModel_PiecewiseFunction__WEBPACK_IMPORTED_MODULE_2__/* ["default"].newInstance */ .Ay.newInstance();
    if (threshold !== null) {
        const delta = Math.abs(range[1] - range[0]) * 0.001;
        const thresholdValue = Math.max(range[0], Math.min(range[1], threshold));
        ofun.addPoint(range[0], 0);
        ofun.addPoint(thresholdValue - delta, 0);
        ofun.addPoint(thresholdValue, opacity);
        ofun.addPoint(range[1], opacity);
    }
    else {
        ofun.addPoint(range[0], opacity);
        ofun.addPoint(range[1], opacity);
    }
    volumeActor.getProperty().setScalarOpacity(0, ofun);
}
function getThresholdValue(volumeActor) {
    const opacityFunction = volumeActor.getProperty().getScalarOpacity(0);
    if (!opacityFunction) {
        return null;
    }
    const dataArray = opacityFunction.getDataPointer();
    if (!dataArray || dataArray.length <= 4) {
        return null;
    }
    for (let i = 0; i < dataArray.length - 2; i += 2) {
        const x1 = dataArray[i];
        const y1 = dataArray[i + 1];
        const x2 = dataArray[i + 2];
        const y2 = dataArray[i + 3];
        if (y1 === 0 && y2 > 0) {
            return x2;
        }
    }
    return null;
}
function getMaxOpacity(volumeActor) {
    const opacityFunction = volumeActor.getProperty().getScalarOpacity(0);
    if (!opacityFunction) {
        return 1.0;
    }
    const dataArray = opacityFunction.getDataPointer();
    if (!dataArray || dataArray.length === 0) {
        return 1.0;
    }
    let maxOpacity = 0;
    for (let i = 1; i < dataArray.length; i += 2) {
        if (dataArray[i] > maxOpacity) {
            maxOpacity = dataArray[i];
        }
    }
    return maxOpacity;
}



/***/ }),

/***/ 74657:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ createLinearRGBTransferFunction)
/* harmony export */ });
/* harmony import */ var _kitware_vtk_js_Rendering_Core_ColorTransferFunction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(642);

function createLinearRGBTransferFunction(voiRange) {
    const cfun = _kitware_vtk_js_Rendering_Core_ColorTransferFunction__WEBPACK_IMPORTED_MODULE_0__/* ["default"].newInstance */ .Ay.newInstance();
    let lower = 0;
    let upper = 1024;
    if (voiRange.lower !== undefined && voiRange.upper !== undefined) {
        lower = voiRange.lower;
        upper = voiRange.upper;
    }
    cfun.addRGBPoint(lower, 0.0, 0.0, 0.0);
    cfun.addRGBPoint(upper, 1.0, 1.0, 1.0);
    return cfun;
}


/***/ }),

/***/ 40256:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ createSigmoidRGBTransferFunction)
/* harmony export */ });
/* harmony import */ var _kitware_vtk_js_Rendering_Core_ColorTransferFunction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(642);
/* harmony import */ var _kitware_vtk_js_Common_Core_DataArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(42008);
/* harmony import */ var _windowLevel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(68136);
/* harmony import */ var _logit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(58977);




function createSigmoidRGBTransferFunction(voiRange, approximationNodes = 1024) {
    const { windowWidth, windowCenter } = _windowLevel__WEBPACK_IMPORTED_MODULE_2__.toWindowLevel(voiRange.lower, voiRange.upper);
    const range = Array.from({ length: approximationNodes }, (_, i) => (i + 1) / (approximationNodes + 2));
    const table = range.flatMap((y) => {
        const x = (0,_logit__WEBPACK_IMPORTED_MODULE_3__/* .logit */ .i)(y, windowCenter, windowWidth);
        return [x, y, y, y, 0.5, 0.0];
    });
    const cfun = _kitware_vtk_js_Rendering_Core_ColorTransferFunction__WEBPACK_IMPORTED_MODULE_0__/* ["default"].newInstance */ .Ay.newInstance();
    cfun.buildFunctionFromArray(_kitware_vtk_js_Common_Core_DataArray__WEBPACK_IMPORTED_MODULE_1__/* ["default"].newInstance */ .Ay.newInstance({
        values: table,
        numberOfComponents: 6,
    }));
    return cfun;
}


/***/ }),

/***/ 63470:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ decimate)
/* harmony export */ });
function decimate(list, interleave, offset = 0) {
    const interleaveIndices = [];
    for (let i = offset; i < list.length; i += interleave) {
        interleaveIndices.push(i);
    }
    return interleaveIndices;
}


/***/ }),

/***/ 99949:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   G: () => (/* binding */ deepClone)
/* harmony export */ });
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (typeof obj === 'function') {
        return obj;
    }
    if (typeof structuredClone === 'function') {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(deepClone);
    }
    else {
        const clonedObj = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
}


/***/ }),

/***/ 20286:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ fnv1aHash)
/* harmony export */ });
function fnv1aHash(str) {
    let hash = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash +=
            (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return (hash >>> 0).toString(36);
}


/***/ }),

/***/ 88619:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getClosestImageId)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);
/* harmony import */ var _metaData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(74876);
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7608);
/* harmony import */ var _getSpacingInNormalDirection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(85008);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(76491);





const log = _logger__WEBPACK_IMPORTED_MODULE_2__.coreLog.getLogger('utilities', 'getClosestImageId');
function getClosestImageId(imageVolume, worldPos, viewPlaneNormal, options) {
    const { direction, spacing, imageIds } = imageVolume;
    const { ignoreSpacing = false } = options || {};
    if (!imageIds?.length) {
        return;
    }
    const kVector = direction.slice(6, 9);
    const dotProduct = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(kVector, viewPlaneNormal);
    if (Math.abs(dotProduct) < 1 - _constants__WEBPACK_IMPORTED_MODULE_4__.EPSILON) {
        return;
    }
    let halfSpacingInNormalDirection;
    if (!ignoreSpacing) {
        const spacingInNormalDirection = (0,_getSpacingInNormalDirection__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)({ direction, spacing }, viewPlaneNormal);
        halfSpacingInNormalDirection = spacingInNormalDirection / 2;
    }
    let closestImageId;
    let minDistance = Infinity;
    for (let i = 0; i < imageIds.length; i++) {
        const imageId = imageIds[i];
        const imagePlaneModule = _metaData__WEBPACK_IMPORTED_MODULE_1__.get('imagePlaneModule', imageId);
        if (!imagePlaneModule?.imagePositionPatient) {
            log.warn(`Missing imagePositionPatient for imageId: ${imageId}`);
            continue;
        }
        const { imagePositionPatient } = imagePlaneModule;
        const dir = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.sub */ .eR.sub(dir, worldPos, imagePositionPatient);
        const distance = Math.abs(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(dir, viewPlaneNormal));
        if (ignoreSpacing) {
            if (distance < minDistance) {
                minDistance = distance;
                closestImageId = imageId;
            }
        }
        else {
            if (distance < halfSpacingInNormalDirection && distance < minDistance) {
                minDistance = distance;
                closestImageId = imageId;
            }
        }
    }
    if (closestImageId === undefined) {
        log.warn('No imageId found within the specified criteria (half spacing or absolute closest).');
    }
    return closestImageId;
}


/***/ }),

/***/ 53932:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   T: () => (/* binding */ getImageDataMetadata)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(76491);
/* harmony import */ var _buildMetadata__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(89131);



function getImageDataMetadata(image) {
    const { imagePlaneModule, imagePixelModule, voiLUTFunction, modality, scalingFactor, calibration, } = (0,_buildMetadata__WEBPACK_IMPORTED_MODULE_2__/* .buildMetadata */ .KP)(image);
    let { rowCosines, columnCosines } = imagePlaneModule;
    if (rowCosines == null || columnCosines == null) {
        rowCosines = [1, 0, 0];
        columnCosines = [0, 1, 0];
    }
    const rowCosineVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(rowCosines[0], rowCosines[1], rowCosines[2]);
    const colCosineVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(columnCosines[0], columnCosines[1], columnCosines[2]);
    const scanAxisNormal = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.cross */ .eR.cross(scanAxisNormal, rowCosineVec, colCosineVec);
    let origin = imagePlaneModule.imagePositionPatient;
    if (origin == null) {
        origin = [0, 0, 0];
    }
    const xSpacing = imagePlaneModule.columnPixelSpacing || image.columnPixelSpacing;
    const ySpacing = imagePlaneModule.rowPixelSpacing || image.rowPixelSpacing;
    const xVoxels = image.columns;
    const yVoxels = image.rows;
    const zSpacing = _constants__WEBPACK_IMPORTED_MODULE_1__.EPSILON;
    const zVoxels = 1;
    if (!imagePixelModule.photometricInterpretation &&
        image.sizeInBytes === 3 * image.width * image.height) {
        image.numberOfComponents = 3;
    }
    const numberOfComponents = image.numberOfComponents ||
        _getNumCompsFromPhotometricInterpretation(imagePixelModule.photometricInterpretation);
    return {
        numberOfComponents,
        origin,
        direction: [...rowCosineVec, ...colCosineVec, ...scanAxisNormal],
        dimensions: [xVoxels, yVoxels, zVoxels],
        spacing: [xSpacing, ySpacing, zSpacing],
        numVoxels: xVoxels * yVoxels * zVoxels,
        imagePlaneModule,
        imagePixelModule,
        bitsAllocated: imagePixelModule.bitsAllocated,
        voiLUTFunction,
        modality,
        scalingFactor,
        calibration,
        scanAxisNormal: scanAxisNormal,
    };
}
function _getNumCompsFromPhotometricInterpretation(photometricInterpretation) {
    let numberOfComponents = 1;
    if (photometricInterpretation === 'RGB' ||
        photometricInterpretation?.includes('YBR') ||
        photometricInterpretation === 'PALETTE COLOR') {
        numberOfComponents = 3;
    }
    return numberOfComponents;
}


/***/ }),

/***/ 47476:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getSliceRange__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20537);
/* harmony import */ var _getTargetVolumeAndSpacingInNormalDir__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(65292);


function getImageSliceDataForVolumeViewport(viewport) {
    const camera = viewport.getCamera();
    const { spacingInNormalDirection, imageVolume } = (0,_getTargetVolumeAndSpacingInNormalDir__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(viewport, camera);
    if (!imageVolume) {
        return;
    }
    const { viewPlaneNormal, focalPoint } = camera;
    const actorEntry = viewport
        .getActors()
        .find((a) => a.referencedId === imageVolume.volumeId ||
        a.uid === imageVolume.volumeId);
    if (!actorEntry) {
        console.warn('No actor found for with actorUID of', imageVolume.volumeId);
    }
    const volumeActor = actorEntry.actor;
    const sliceRange = (0,_getSliceRange__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(volumeActor, viewPlaneNormal, focalPoint);
    const { min, max, current } = sliceRange;
    const numberOfSlices = Math.round((max - min) / spacingInNormalDirection) + 1;
    let imageIndex = ((current - min) / (max - min)) * numberOfSlices;
    imageIndex = Math.floor(imageIndex);
    if (imageIndex > numberOfSlices - 1) {
        imageIndex = numberOfSlices - 1;
    }
    else if (imageIndex < 0) {
        imageIndex = 0;
    }
    return {
        numberOfSlices,
        imageIndex,
    };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getImageSliceDataForVolumeViewport);


/***/ }),

/***/ 32173:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getScalingParameters)
/* harmony export */ });
/* harmony import */ var _metaData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(74876);

function getScalingParameters(imageId) {
    const modalityLutModule = _metaData__WEBPACK_IMPORTED_MODULE_0__.get('modalityLutModule', imageId) || {};
    const generalSeriesModule = _metaData__WEBPACK_IMPORTED_MODULE_0__.get('generalSeriesModule', imageId) || {};
    const { modality } = generalSeriesModule;
    const scalingParameters = {
        rescaleSlope: modalityLutModule.rescaleSlope || 1,
        rescaleIntercept: modalityLutModule.rescaleIntercept ?? 0,
        modality,
    };
    const scalingModules = _metaData__WEBPACK_IMPORTED_MODULE_0__.get('scalingModule', imageId) || {};
    return {
        ...scalingParameters,
        ...(modality === 'PT' && {
            suvbw: scalingModules.suvbw,
            suvbsa: scalingModules.suvbsa,
            suvlbm: scalingModules.suvlbm,
        }),
        ...(modality === 'RTDOSE' && {
            doseGridScaling: scalingModules.DoseGridScaling,
            doseSummation: scalingModules.DoseSummation,
            doseType: scalingModules.DoseType,
            doseUnit: scalingModules.DoseUnit,
        }),
    };
}


/***/ }),

/***/ 20537:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getSliceRange)
/* harmony export */ });
/* harmony import */ var _kitware_vtk_js_Common_Core_MatrixBuilder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(89265);
/* harmony import */ var _getVolumeActorCorners__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15105);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(76491);



const SMALL_EPSILON = _constants__WEBPACK_IMPORTED_MODULE_2__.EPSILON * _constants__WEBPACK_IMPORTED_MODULE_2__.EPSILON;
const isOne = (v) => Math.abs(Math.abs(v) - 1) < SMALL_EPSILON;
const isUnit = (v, off) => isOne(v[off]) || isOne(v[off + 1]) || isOne(v[off + 2]);
const isOrthonormal = (v) => isUnit(v, 0) && isUnit(v, 3) && isUnit(v, 6);
function getSliceRange(volumeActor, viewPlaneNormal, focalPoint) {
    const imageData = volumeActor.getMapper().getInputData();
    let corners;
    const direction = imageData.getDirection();
    if (isOrthonormal(direction)) {
        corners = (0,_getVolumeActorCorners__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(volumeActor);
    }
    else {
        const [dx, dy, dz] = imageData.getDimensions();
        const cornersIdx = [
            [0, 0, 0],
            [dx - 1, 0, 0],
            [0, dy - 1, 0],
            [dx - 1, dy - 1, 0],
            [0, 0, dz - 1],
            [dx - 1, 0, dz - 1],
            [0, dy - 1, dz - 1],
            [dx - 1, dy - 1, dz - 1],
        ];
        corners = cornersIdx.map((it) => imageData.indexToWorld(it));
    }
    const transform = _kitware_vtk_js_Common_Core_MatrixBuilder__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A
        .buildFromDegree()
        .identity()
        .rotateFromDirections(viewPlaneNormal, [1, 0, 0]);
    corners.forEach((pt) => transform.apply(pt));
    const transformedFocalPoint = [...focalPoint];
    transform.apply(transformedFocalPoint);
    const currentSlice = transformedFocalPoint[0];
    let minX = Infinity;
    let maxX = -Infinity;
    for (let i = 0; i < 8; i++) {
        const x = corners[i][0];
        if (x > maxX) {
            maxX = x;
        }
        if (x < minX) {
            minX = x;
        }
    }
    return {
        min: minX,
        max: maxX,
        current: currentSlice,
        actor: volumeActor,
        viewPlaneNormal,
        focalPoint,
    };
}


/***/ }),

/***/ 85008:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getSpacingInNormalDirection)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);

function getSpacingInNormalDirection(imageVolume, viewPlaneNormal) {
    const { direction, spacing } = imageVolume;
    const iVector = direction.slice(0, 3);
    const jVector = direction.slice(3, 6);
    const kVector = direction.slice(6, 9);
    const dotProducts = [
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(iVector, viewPlaneNormal),
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(jVector, viewPlaneNormal),
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(kVector, viewPlaneNormal),
    ];
    const projectedSpacing = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.set */ .eR.set(projectedSpacing, dotProducts[0] * spacing[0], dotProducts[1] * spacing[1], dotProducts[2] * spacing[2]);
    const spacingInNormalDirection = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.length */ .eR.length(projectedSpacing);
    return spacingInNormalDirection;
}


/***/ }),

/***/ 65292:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getTargetVolumeAndSpacingInNormalDir)
/* harmony export */ });
/* harmony import */ var _cache_cache__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(49038);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(76491);
/* harmony import */ var _getSpacingInNormalDirection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(85008);
/* harmony import */ var _loaders_volumeLoader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(87142);
/* harmony import */ var _getVolumeId__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(12437);





const EPSILON_PART = 1 + _constants__WEBPACK_IMPORTED_MODULE_1__.EPSILON;
const startsWith = (str, starts) => starts === str.substring(0, Math.min(str.length, starts.length));
const isPrimaryVolume = (volume) => !!(0,_loaders_volumeLoader__WEBPACK_IMPORTED_MODULE_3__.getVolumeLoaderSchemes)().find((scheme) => startsWith(volume.volumeId, scheme));
function getTargetVolumeAndSpacingInNormalDir(viewport, camera, targetId, useSlabThickness = false) {
    const { viewPlaneNormal } = camera;
    const volumeActors = viewport.getActors();
    if (!volumeActors.length) {
        return {
            spacingInNormalDirection: null,
            imageVolume: null,
            actorUID: null,
        };
    }
    const imageVolumes = volumeActors
        .map((va) => {
        const actorUID = va.referencedId ?? va.uid;
        return _cache_cache__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Ay.getVolume(actorUID);
    })
        .filter((iv) => !!iv);
    if (targetId) {
        const targetVolumeId = (0,_getVolumeId__WEBPACK_IMPORTED_MODULE_4__/* .getVolumeId */ .A)(targetId);
        const imageVolumeIndex = imageVolumes.findIndex((iv) => targetVolumeId.includes(iv.volumeId));
        const imageVolume = imageVolumes[imageVolumeIndex];
        const { uid: actorUID } = volumeActors[imageVolumeIndex];
        const spacingInNormalDirection = getSpacingInNormal(imageVolume, viewPlaneNormal, viewport, useSlabThickness);
        return { imageVolume, spacingInNormalDirection, actorUID };
    }
    if (!imageVolumes.length) {
        return {
            spacingInNormalDirection: null,
            imageVolume: null,
            actorUID: null,
        };
    }
    const smallest = {
        spacingInNormalDirection: Infinity,
        imageVolume: null,
        actorUID: null,
    };
    const hasPrimaryVolume = imageVolumes.find(isPrimaryVolume);
    for (let i = 0; i < imageVolumes.length; i++) {
        const imageVolume = imageVolumes[i];
        if (hasPrimaryVolume && !isPrimaryVolume(imageVolume)) {
            continue;
        }
        const spacingInNormalDirection = getSpacingInNormal(imageVolume, viewPlaneNormal, viewport);
        if (spacingInNormalDirection * EPSILON_PART <
            smallest.spacingInNormalDirection) {
            smallest.spacingInNormalDirection = spacingInNormalDirection;
            smallest.imageVolume = imageVolume;
            smallest.actorUID = volumeActors[i].uid;
        }
    }
    return smallest;
}
function getSpacingInNormal(imageVolume, viewPlaneNormal, viewport, useSlabThickness = false) {
    const { slabThickness } = viewport.getProperties();
    let spacingInNormalDirection = slabThickness;
    if (!slabThickness || !useSlabThickness) {
        spacingInNormalDirection = (0,_getSpacingInNormalDirection__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)(imageVolume, viewPlaneNormal);
    }
    return spacingInNormalDirection;
}


/***/ }),

/***/ 24724:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _RenderingEngine_getRenderingEngine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(39536);

function getViewportsWithVolumeId(volumeId) {
    const renderingEngines = (0,_RenderingEngine_getRenderingEngine__WEBPACK_IMPORTED_MODULE_0__/* .getRenderingEngines */ .qO)();
    const targetViewports = [];
    renderingEngines.forEach((renderingEngine) => {
        const viewports = renderingEngine.getVolumeViewports();
        const filteredViewports = viewports.filter((vp) => vp.hasVolumeId(volumeId));
        targetViewports.push(...filteredViewports);
    });
    return targetViewports;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getViewportsWithVolumeId);


/***/ }),

/***/ 70210:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getVoiFromSigmoidRGBTransferFunction)
/* harmony export */ });
function getVoiFromSigmoidRGBTransferFunction(cfun) {
    let cfunRange = [];
    const [lower, upper] = cfun.getRange();
    cfun.getTable(lower, upper, 1024, cfunRange);
    cfunRange = cfunRange.filter((v, k) => k % 3 === 0);
    const cfunDomain = [...Array(1024).keys()].map((v, k) => {
        return lower + ((upper - lower) / (1024 - 1)) * k;
    });
    const y1 = cfunRange[256];
    const logy1 = Math.log((1 - y1) / y1);
    const x1 = cfunDomain[256];
    const y2 = cfunRange[256 * 3];
    const logy2 = Math.log((1 - y2) / y2);
    const x2 = cfunDomain[256 * 3];
    const ww = Math.round((4 * (x2 - x1)) / (logy1 - logy2));
    const wc = Math.round(x1 + (ww * logy1) / 4);
    return [Math.round(wc - ww / 2), Math.round(wc + ww / 2)];
}


/***/ }),

/***/ 15105:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getVolumeActorCorners)
/* harmony export */ });
function getVolumeActorCorners(volumeActor) {
    const imageData = volumeActor.getMapper().getInputData();
    const bounds = imageData.extentToBounds(imageData.getExtent());
    return [
        [bounds[0], bounds[2], bounds[4]],
        [bounds[0], bounds[2], bounds[5]],
        [bounds[0], bounds[3], bounds[4]],
        [bounds[0], bounds[3], bounds[5]],
        [bounds[1], bounds[2], bounds[4]],
        [bounds[1], bounds[2], bounds[5]],
        [bounds[1], bounds[3], bounds[4]],
        [bounds[1], bounds[3], bounds[5]],
    ];
}


/***/ }),

/***/ 12437:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getVolumeId)
/* harmony export */ });
const getVolumeId = (targetId) => {
    const prefix = 'volumeId:';
    const str = targetId.includes(prefix)
        ? targetId.substring(prefix.length)
        : targetId;
    const index = str.indexOf('sliceIndex=');
    return index === -1 ? str : str.substring(0, index - 1);
};


/***/ }),

/***/ 4031:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getSliceRange__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20537);
/* harmony import */ var _getTargetVolumeAndSpacingInNormalDir__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(65292);


function getVolumeSliceRangeInfo(viewport, volumeId, useSlabThickness = false) {
    const camera = viewport.getCamera();
    const { focalPoint, viewPlaneNormal } = camera;
    const { spacingInNormalDirection, actorUID } = (0,_getTargetVolumeAndSpacingInNormalDir__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(viewport, camera, volumeId, useSlabThickness);
    if (!actorUID) {
        throw new Error(`Could not find image volume with id ${volumeId} in the viewport`);
    }
    const actorEntry = viewport.getActor(actorUID);
    if (!actorEntry) {
        console.warn('No actor found for with actorUID of', actorUID);
        return null;
    }
    const volumeActor = actorEntry.actor;
    const sliceRange = (0,_getSliceRange__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(volumeActor, viewPlaneNormal, focalPoint);
    return {
        sliceRange,
        spacingInNormalDirection,
        camera,
    };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getVolumeSliceRangeInfo);


/***/ }),

/***/ 61375:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getVolumeSliceRangeInfo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4031);

function getVolumeViewportScrollInfo(viewport, volumeId, useSlabThickness = false) {
    const { sliceRange, spacingInNormalDirection, camera } = (0,_getVolumeSliceRangeInfo__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(viewport, volumeId, useSlabThickness);
    const { min, max, current } = sliceRange;
    const numScrollSteps = Math.round((max - min) / spacingInNormalDirection);
    const fraction = (current - min) / (max - min);
    const floatingStepNumber = fraction * numScrollSteps;
    const currentStepIndex = Math.round(floatingStepNumber);
    return {
        numScrollSteps,
        currentStepIndex,
        sliceRangeInfo: {
            sliceRange,
            spacingInNormalDirection,
            camera,
        },
    };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getVolumeViewportScrollInfo);


/***/ }),

/***/ 30169:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ hasFloatScalingParameters)
/* harmony export */ });
const hasFloatScalingParameters = (scalingParameters) => {
    const hasFloatRescale = Object.values(scalingParameters).some((value) => typeof value === 'number' && !Number.isInteger(value));
    return hasFloatRescale;
};


/***/ }),

/***/ 38883:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ hasNaNValues)
/* harmony export */ });
function hasNaNValues(input) {
    if (Array.isArray(input)) {
        return input.some((value) => Number.isNaN(value));
    }
    return Number.isNaN(input);
}


/***/ }),

/***/ 39537:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ imageIdToURI)
/* harmony export */ });
function imageIdToURI(imageId) {
    const colonIndex = imageId.indexOf(':');
    return imageId.substring(colonIndex + 1);
}


/***/ }),

/***/ 17791:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _metaData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(74876);

const retrieveConfigurationState = new Map();
const IMAGE_RETRIEVE_CONFIGURATION = 'imageRetrieveConfiguration';
const imageRetrieveMetadataProvider = {
    IMAGE_RETRIEVE_CONFIGURATION,
    clear: () => {
        retrieveConfigurationState.clear();
    },
    add: (key, payload) => {
        retrieveConfigurationState.set(key, payload);
    },
    clone: () => {
        return new Map(retrieveConfigurationState);
    },
    restore: (state) => {
        retrieveConfigurationState.clear();
        state.forEach((value, key) => {
            retrieveConfigurationState.set(key, value);
        });
    },
    get: (type, ...queries) => {
        if (type === IMAGE_RETRIEVE_CONFIGURATION) {
            return queries
                .map((query) => retrieveConfigurationState.get(query))
                .find((it) => it !== undefined);
        }
    },
};
(0,_metaData__WEBPACK_IMPORTED_MODULE_0__.addProvider)(imageRetrieveMetadataProvider.get.bind(imageRetrieveMetadataProvider));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (imageRetrieveMetadataProvider);


/***/ }),

/***/ 33592:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  FrameRange: () => (/* reexport */ FrameRange/* default */.A),
  HistoryMemo: () => (/* reexport */ historyMemo_namespaceObject),
  PointsManager: () => (/* reexport */ PointsManager/* default */.A),
  ProgressiveIterator: () => (/* reexport */ ProgressiveIterator/* default */.A),
  RLEVoxelMap: () => (/* reexport */ RLEVoxelMap/* default */.A),
  VoxelManager: () => (/* reexport */ VoxelManager/* default */.A),
  actorIsA: () => (/* reexport */ actorCheck/* actorIsA */.N),
  applyPreset: () => (/* reexport */ applyPreset/* default */.A),
  asArray: () => (/* reexport */ asArray),
  autoLoad: () => (/* reexport */ autoLoad/* default */.A),
  buildMetadata: () => (/* reexport */ buildMetadata/* buildMetadata */.KP),
  calculateNeighborhoodStats: () => (/* reexport */ calculateNeighborhoodStats),
  calculateSpacingBetweenImageIds: () => (/* reexport */ calculateSpacingBetweenImageIds/* default */.A),
  calculateViewportsSpatialRegistration: () => (/* reexport */ utilities_calculateViewportsSpatialRegistration),
  calibratedPixelSpacingMetadataProvider: () => (/* reexport */ calibratedPixelSpacingMetadataProvider),
  clamp: () => (/* reexport */ clamp/* default */.A),
  clip: () => (/* reexport */ utilities_clip),
  color: () => (/* reexport */ color_namespaceObject),
  colormap: () => (/* reexport */ colormap),
  convertStackToVolumeViewport: () => (/* reexport */ convertStackToVolumeViewport),
  convertToGrayscale: () => (/* reexport */ convertToGrayscale),
  convertVolumeToStackViewport: () => (/* reexport */ convertVolumeToStackViewport),
  createLinearRGBTransferFunction: () => (/* reexport */ createLinearRGBTransferFunction/* default */.A),
  createSigmoidRGBTransferFunction: () => (/* reexport */ createSigmoidRGBTransferFunction/* default */.A),
  createSubVolume: () => (/* reexport */ createSubVolume),
  decimate: () => (/* reexport */ decimate/* default */.A),
  deepClone: () => (/* reexport */ deepClone/* deepClone */.G),
  deepEqual: () => (/* reexport */ deepEqual),
  deepMerge: () => (/* reexport */ deepMerge/* default */.A),
  eventListener: () => (/* reexport */ eventListener_namespaceObject),
  fnv1aHash: () => (/* reexport */ fnv1aHash/* default */.A),
  generateVolumePropsFromImageIds: () => (/* reexport */ generateVolumePropsFromImageIds/* generateVolumePropsFromImageIds */.D),
  genericMetadataProvider: () => (/* reexport */ genericMetadataProvider/* default */.A),
  getBufferConfiguration: () => (/* reexport */ getBufferConfiguration/* getBufferConfiguration */.h),
  getClosestImageId: () => (/* reexport */ getClosestImageId/* default */.A),
  getClosestStackImageIndexForPoint: () => (/* reexport */ getClosestStackImageIndexForPoint),
  getCurrentVolumeViewportSlice: () => (/* reexport */ getCurrentVolumeViewportSlice),
  getDynamicVolumeInfo: () => (/* reexport */ utilities_getDynamicVolumeInfo),
  getImageDataMetadata: () => (/* reexport */ getImageDataMetadata/* getImageDataMetadata */.T),
  getImageLegacy: () => (/* reexport */ utilities_getImageLegacy),
  getImageSliceDataForVolumeViewport: () => (/* reexport */ getImageSliceDataForVolumeViewport/* default */.A),
  getMinMax: () => (/* reexport */ getMinMax),
  getPixelSpacingInformation: () => (/* reexport */ getPixelSpacingInformation),
  getRandomSampleFromArray: () => (/* reexport */ getRandomSampleFromArray),
  getRuntimeId: () => (/* reexport */ getRuntimeId),
  getScalingParameters: () => (/* reexport */ getScalingParameters/* default */.A),
  getSliceRange: () => (/* reexport */ getSliceRange/* default */.A),
  getSpacingInNormalDirection: () => (/* reexport */ getSpacingInNormalDirection/* default */.A),
  getTargetVolumeAndSpacingInNormalDir: () => (/* reexport */ getTargetVolumeAndSpacingInNormalDir/* default */.A),
  getViewportImageCornersInWorld: () => (/* reexport */ getViewportImageCornersInWorld),
  getViewportImageIds: () => (/* reexport */ utilities_getViewportImageIds),
  getViewportModality: () => (/* binding */ getViewportModality),
  getViewportsWithImageURI: () => (/* reexport */ getViewportsWithImageURI),
  getViewportsWithVolumeId: () => (/* reexport */ getViewportsWithVolumeId/* default */.A),
  getVoiFromSigmoidRGBTransferFunction: () => (/* reexport */ getVoiFromSigmoidRGBTransferFunction/* default */.A),
  getVolumeActorCorners: () => (/* reexport */ getVolumeActorCorners/* default */.A),
  getVolumeDirectionVectors: () => (/* reexport */ getVolumeDirectionVectors),
  getVolumeId: () => (/* reexport */ getVolumeId/* getVolumeId */.A),
  getVolumeSliceRangeInfo: () => (/* reexport */ getVolumeSliceRangeInfo/* default */.A),
  getVolumeViewportScrollInfo: () => (/* reexport */ getVolumeViewportScrollInfo/* default */.A),
  getVolumeViewportsContainingSameVolumes: () => (/* reexport */ utilities_getVolumeViewportsContainingSameVolumes),
  hasFloatScalingParameters: () => (/* reexport */ hasFloatScalingParameters/* hasFloatScalingParameters */.a),
  hasNaNValues: () => (/* reexport */ hasNaNValues/* default */.A),
  imageIdToURI: () => (/* reexport */ imageIdToURI/* default */.A),
  imageRetrieveMetadataProvider: () => (/* reexport */ imageRetrieveMetadataProvider/* default */.A),
  imageToWorldCoords: () => (/* reexport */ imageToWorldCoords),
  indexWithinDimensions: () => (/* reexport */ indexWithinDimensions),
  invertRgbTransferFunction: () => (/* reexport */ invertRgbTransferFunction/* default */.A),
  isEqual: () => (/* reexport */ isEqual/* isEqual */.n4),
  isEqualAbs: () => (/* reexport */ isEqual/* isEqualAbs */.Ph),
  isEqualNegative: () => (/* reexport */ isEqual/* isEqualNegative */.WC),
  isImageActor: () => (/* reexport */ actorCheck/* isImageActor */.e),
  isNumber: () => (/* reexport */ isEqual/* isNumber */.Et),
  isOpposite: () => (/* reexport */ isOpposite),
  isPTPrescaledWithSUV: () => (/* reexport */ utilities_isPTPrescaledWithSUV),
  isValidVolume: () => (/* reexport */ isValidVolume),
  isVideoTransferSyntax: () => (/* reexport */ isVideoTransferSyntax),
  jumpToSlice: () => (/* reexport */ jumpToSlice),
  loadImageToCanvas: () => (/* reexport */ loadImageToCanvas),
  logger: () => (/* reexport */ logger),
  makeVolumeMetadata: () => (/* reexport */ makeVolumeMetadata/* default */.A),
  planar: () => (/* reexport */ planar),
  pointInShapeCallback: () => (/* reexport */ pointInShapeCallback/* pointInShapeCallback */.ii),
  renderToCanvasCPU: () => (/* reexport */ renderToCanvasCPU),
  renderToCanvasGPU: () => (/* reexport */ renderToCanvasGPU),
  roundNumber: () => (/* reexport */ utilities_roundNumber),
  roundToPrecision: () => (/* reexport */ roundToPrecision),
  scaleArray: () => (/* reexport */ scaleArray),
  scaleRgbTransferFunction: () => (/* reexport */ scaleRGBTransferFunction),
  scroll: () => (/* reexport */ scroll_scroll),
  snapFocalPointToSlice: () => (/* reexport */ snapFocalPointToSlice/* default */.A),
  sortImageIdsAndGetSpacing: () => (/* reexport */ sortImageIdsAndGetSpacing/* default */.A),
  spatialRegistrationMetadataProvider: () => (/* reexport */ utilities_spatialRegistrationMetadataProvider),
  splitImageIdsBy4DTags: () => (/* reexport */ utilities_splitImageIdsBy4DTags),
  transferFunctionUtils: () => (/* reexport */ transferFunctionUtils),
  transformIndexToWorld: () => (/* reexport */ transformIndexToWorld/* default */.A),
  transformWorldToIndex: () => (/* reexport */ transformWorldToIndex/* default */.A),
  transformWorldToIndexContinuous: () => (/* reexport */ transformWorldToIndex/* transformWorldToIndexContinuous */.p),
  triggerEvent: () => (/* reexport */ triggerEvent/* default */.A),
  updatePlaneRestriction: () => (/* reexport */ updatePlaneRestriction/* updatePlaneRestriction */.O),
  updateVTKImageDataWithCornerstoneImage: () => (/* reexport */ updateVTKImageDataWithCornerstoneImage/* updateVTKImageDataWithCornerstoneImage */.J),
  uuidv4: () => (/* reexport */ uuidv4/* default */.A),
  windowLevel: () => (/* reexport */ windowLevel),
  worldToImageCoords: () => (/* reexport */ utilities_worldToImageCoords)
});

// NAMESPACE OBJECT: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/eventListener/index.js
var eventListener_namespaceObject = {};
__webpack_require__.r(eventListener_namespaceObject);
__webpack_require__.d(eventListener_namespaceObject, {
  MultiTargetEventListenerManager: () => (MultiTargetEventListenerManager),
  TargetEventListeners: () => (TargetEventListeners)
});

// NAMESPACE OBJECT: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/historyMemo/index.js
var historyMemo_namespaceObject = {};
__webpack_require__.r(historyMemo_namespaceObject);
__webpack_require__.d(historyMemo_namespaceObject, {
  DefaultHistoryMemo: () => (DefaultHistoryMemo),
  HistoryMemo: () => (HistoryMemo)
});

// NAMESPACE OBJECT: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/color.js
var color_namespaceObject = {};
__webpack_require__.r(color_namespaceObject);
__webpack_require__.d(color_namespaceObject, {
  hexToRgb: () => (hexToRgb),
  rgbToHex: () => (rgbToHex)
});

;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/eventListener/TargetEventListeners.js
var EventListenerPhases;
(function (EventListenerPhases) {
    EventListenerPhases[EventListenerPhases["None"] = 0] = "None";
    EventListenerPhases[EventListenerPhases["Capture"] = 1] = "Capture";
    EventListenerPhases[EventListenerPhases["Bubble"] = 2] = "Bubble";
})(EventListenerPhases || (EventListenerPhases = {}));
class TargetEventListeners {
    constructor(target) {
        this._eventListeners = new Map();
        this._children = new Map();
        this._target = target;
    }
    get isEmpty() {
        return this._eventListeners.size === 0 && this._children.size === 0;
    }
    addEventListener(type, callback, options) {
        const dotIndex = type.indexOf('.');
        const isNamespace = dotIndex !== -1;
        if (isNamespace) {
            const namespaceToken = type.substring(0, dotIndex);
            let childElementEventListener = this._children.get(namespaceToken);
            if (!childElementEventListener) {
                childElementEventListener = new TargetEventListeners(this._target);
                this._children.set(namespaceToken, childElementEventListener);
            }
            type = type.substring(dotIndex + 1);
            childElementEventListener.addEventListener(type, callback, options);
        }
        else {
            this._addEventListener(type, callback, options);
        }
    }
    removeEventListener(type, callback, options) {
        const dotIndex = type.indexOf('.');
        const isNamespace = dotIndex !== -1;
        if (isNamespace) {
            const namespaceToken = type.substring(0, dotIndex);
            const childElementEventListener = this._children.get(namespaceToken);
            if (!childElementEventListener) {
                return;
            }
            type = type.substring(dotIndex + 1);
            childElementEventListener.removeEventListener(type, callback, options);
            if (childElementEventListener.isEmpty) {
                this._children.delete(namespaceToken);
            }
        }
        else {
            this._removeEventListener(type, callback, options);
        }
    }
    reset() {
        Array.from(this._children.entries()).forEach(([namespace, child]) => {
            child.reset();
            if (child.isEmpty) {
                this._children.delete(namespace);
            }
            else {
                throw new Error('Child is not empty and cannot be removed');
            }
        });
        this._unregisterAllEvents();
    }
    _addEventListener(type, callback, options) {
        let listenersMap = this._eventListeners.get(type);
        if (!listenersMap) {
            listenersMap = new Map();
            this._eventListeners.set(type, listenersMap);
        }
        const useCapture = options?.capture ?? false;
        const listenerPhase = useCapture
            ? EventListenerPhases.Capture
            : EventListenerPhases.Bubble;
        const registeredPhases = listenersMap.get(callback) ?? EventListenerPhases.None;
        if (registeredPhases & listenerPhase) {
            console.warn('A listener is already registered for this phase');
            return;
        }
        listenersMap.set(callback, registeredPhases | listenerPhase);
        this._target.addEventListener(type, callback, options);
    }
    _removeEventListener(type, callback, options) {
        const useCapture = options?.capture ?? false;
        const listenerPhase = useCapture
            ? EventListenerPhases.Capture
            : EventListenerPhases.Bubble;
        const listenersMap = this._eventListeners.get(type);
        if (!listenersMap) {
            return;
        }
        const callbacks = callback ? [callback] : Array.from(listenersMap.keys());
        callbacks.forEach((callbackItem) => {
            const registeredPhases = listenersMap.get(callbackItem) ?? EventListenerPhases.None;
            const phaseRegistered = !!(registeredPhases & listenerPhase);
            if (!phaseRegistered) {
                return;
            }
            this._target.removeEventListener(type, callbackItem, options);
            const newListenerPhase = registeredPhases ^ listenerPhase;
            if (newListenerPhase === EventListenerPhases.None) {
                listenersMap.delete(callbackItem);
            }
            else {
                listenersMap.set(callbackItem, newListenerPhase);
            }
        });
        if (!listenersMap.size) {
            this._eventListeners.delete(type);
        }
    }
    _unregisterAllListeners(type, listenersMap) {
        Array.from(listenersMap.entries()).forEach(([listener, eventPhases]) => {
            const startPhase = EventListenerPhases.Capture;
            for (let currentPhase = startPhase; eventPhases; currentPhase <<= 1) {
                if (!(eventPhases & currentPhase)) {
                    continue;
                }
                const useCapture = currentPhase === EventListenerPhases.Capture ? true : false;
                this.removeEventListener(type, listener, { capture: useCapture });
                eventPhases ^= currentPhase;
            }
        });
    }
    _unregisterAllEvents() {
        Array.from(this._eventListeners.entries()).forEach(([type, listenersMap]) => {
            this._unregisterAllListeners(type, listenersMap);
        });
    }
}


;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/eventListener/MultiTargetEventListenerManager.js

class MultiTargetEventListenerManager {
    constructor() {
        this._targetsEventListeners = new Map();
    }
    addEventListener(target, type, callback, options) {
        let eventListeners = this._targetsEventListeners.get(target);
        if (!eventListeners) {
            eventListeners = new TargetEventListeners(target);
            this._targetsEventListeners.set(target, eventListeners);
        }
        eventListeners.addEventListener(type, callback, options);
    }
    removeEventListener(target, type, callback, options) {
        const eventListeners = this._targetsEventListeners.get(target);
        if (!eventListeners) {
            return;
        }
        eventListeners.removeEventListener(type, callback, options);
        if (eventListeners.isEmpty) {
            this._targetsEventListeners.delete(target);
        }
    }
    reset() {
        Array.from(this._targetsEventListeners.entries()).forEach(([target, targetEventListeners]) => {
            targetEventListeners.reset();
            this._targetsEventListeners.delete(target);
        });
    }
}


;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/eventListener/index.js



// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/invertRgbTransferFunction.js
var invertRgbTransferFunction = __webpack_require__(50134);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/createSigmoidRGBTransferFunction.js
var createSigmoidRGBTransferFunction = __webpack_require__(40256);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getVoiFromSigmoidRGBTransferFunction.js
var getVoiFromSigmoidRGBTransferFunction = __webpack_require__(70210);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/createLinearRGBTransferFunction.js
var createLinearRGBTransferFunction = __webpack_require__(74657);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/scaleRgbTransferFunction.js
function scaleRGBTransferFunction(rgbTransferFunction, scalingFactor) {
    const size = rgbTransferFunction.getSize();
    for (let index = 0; index < size; index++) {
        const nodeValue1 = [];
        rgbTransferFunction.getNodeValue(index, nodeValue1);
        nodeValue1[1] = nodeValue1[1] * scalingFactor;
        nodeValue1[2] = nodeValue1[2] * scalingFactor;
        nodeValue1[3] = nodeValue1[3] * scalingFactor;
        rgbTransferFunction.setNodeValue(index, nodeValue1);
    }
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/triggerEvent.js
var triggerEvent = __webpack_require__(69372);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/uuidv4.js
var uuidv4 = __webpack_require__(80221);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getMinMax.js
function getMinMax(storedPixelData) {
    let min = storedPixelData[0];
    let max = storedPixelData[0];
    let storedPixel;
    const numPixels = storedPixelData.length;
    for (let index = 1; index < numPixels; index++) {
        storedPixel = storedPixelData[index];
        min = Math.min(min, storedPixel);
        max = Math.max(max, storedPixel);
    }
    return {
        min,
        max,
    };
}

;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getRuntimeId.js
const LAST_RUNTIME_ID = Symbol('LastRuntimeId');
const GLOBAL_CONTEXT = {};
const DEFAULT_MAX = 0xffffffff;
const DEFAULT_SEPARATOR = '-';
function getRuntimeId(context, separator, max) {
    return getNextRuntimeId(context !== null && typeof context === 'object' ? context : GLOBAL_CONTEXT, LAST_RUNTIME_ID, (typeof max === 'number' && max > 0 ? max : DEFAULT_MAX) >>> 0).join(typeof separator === 'string' ? separator : DEFAULT_SEPARATOR);
}
function getNextRuntimeId(context, symbol, max) {
    let idComponents = context[symbol];
    if (!(idComponents instanceof Array)) {
        idComponents = [0];
        Object.defineProperty(context, symbol, { value: idComponents });
    }
    for (let carry = true, i = 0; carry && i < idComponents.length; ++i) {
        let n = idComponents[i] | 0;
        if (n < max) {
            carry = false;
            n = n + 1;
        }
        else {
            n = 0;
            if (i + 1 === idComponents.length) {
                idComponents.push(0);
            }
        }
        idComponents[i] = n;
    }
    return idComponents;
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/imageIdToURI.js
var imageIdToURI = __webpack_require__(39537);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/calibratedPixelSpacingMetadataProvider.js

const state = {};
const metadataProvider = {
    add: (imageId, payload) => {
        const imageURI = (0,imageIdToURI/* default */.A)(imageId);
        state[imageURI] = payload;
    },
    get: (type, imageId) => {
        if (type === 'calibratedPixelSpacing') {
            const imageURI = (0,imageIdToURI/* default */.A)(imageId);
            return state[imageURI];
        }
    },
};
/* harmony default export */ const calibratedPixelSpacingMetadataProvider = (metadataProvider);

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/clamp.js
var clamp = __webpack_require__(84061);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/isOpposite.js
function isOpposite(v1, v2, tolerance = 1e-5) {
    return (Math.abs(v1[0] + v2[0]) < tolerance &&
        Math.abs(v1[1] + v2[1]) < tolerance &&
        Math.abs(v1[2] + v2[2]) < tolerance);
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getClosestImageId.js
var getClosestImageId = __webpack_require__(88619);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getSpacingInNormalDirection.js
var getSpacingInNormalDirection = __webpack_require__(85008);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getTargetVolumeAndSpacingInNormalDir.js
var getTargetVolumeAndSpacingInNormalDir = __webpack_require__(65292);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getVolumeActorCorners.js
var getVolumeActorCorners = __webpack_require__(15105);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/indexWithinDimensions.js
function indexWithinDimensions(index, dimensions) {
    if (index[0] < 0 ||
        index[0] >= dimensions[0] ||
        index[1] < 0 ||
        index[1] >= dimensions[1] ||
        index[2] < 0 ||
        index[2] >= dimensions[2]) {
        return false;
    }
    return true;
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/getRenderingEngine.js
var getRenderingEngine = __webpack_require__(39536);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getVolumeViewportsContainingSameVolumes.js

function getVolumeViewportsContainingSameVolumes(targetViewport, renderingEngineId) {
    let renderingEngines;
    if (renderingEngineId) {
        renderingEngines = [(0,getRenderingEngine/* getRenderingEngine */.lD)(renderingEngineId)];
    }
    else {
        renderingEngines = (0,getRenderingEngine/* getRenderingEngines */.qO)();
    }
    const sameVolumesViewports = [];
    renderingEngines.forEach((renderingEngine) => {
        const targetActors = targetViewport.getActors();
        const viewports = renderingEngine.getVolumeViewports();
        for (const vp of viewports) {
            const vpActors = vp.getActors();
            if (vpActors.length !== targetActors.length) {
                continue;
            }
            const sameVolumes = targetActors.every(({ uid }) => vpActors.find((vpActor) => uid === vpActor.uid));
            if (sameVolumes) {
                sameVolumesViewports.push(vp);
            }
        }
    });
    return sameVolumesViewports;
}
/* harmony default export */ const utilities_getVolumeViewportsContainingSameVolumes = (getVolumeViewportsContainingSameVolumes);

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getViewportsWithVolumeId.js
var getViewportsWithVolumeId = __webpack_require__(24724);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/transformWorldToIndex.js
var transformWorldToIndex = __webpack_require__(38669);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/transformIndexToWorld.js
var transformIndexToWorld = __webpack_require__(94741);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/loaders/imageLoader.js
var imageLoader = __webpack_require__(80068);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/metaData.js
var metaData = __webpack_require__(74876);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/index.js + 1 modules
var enums = __webpack_require__(71851);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/requestPool/imageLoadPoolManager.js
var imageLoadPoolManager = __webpack_require__(51159);
// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/index.js + 1 modules
var esm = __webpack_require__(3823);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/getOrCreateCanvas.js
var getOrCreateCanvas = __webpack_require__(30135);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/TiledRenderingEngine.js
var TiledRenderingEngine = __webpack_require__(54072);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/isPTPrescaledWithSUV.js
const isPTPrescaledWithSUV = (image) => {
    return image.preScale.scaled && image.preScale.scalingParameters.suvbw;
};
/* harmony default export */ const utilities_isPTPrescaledWithSUV = (isPTPrescaledWithSUV);

;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/renderToCanvasGPU.js






function renderToCanvasGPU(canvas, imageOrVolume, modality = undefined, renderingEngineId = '_thumbnails', viewportOptions = {
    displayArea: { imageArea: [1, 1] },
}) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        throw new Error('canvas element is required');
    }
    const isVolume = !imageOrVolume.imageId;
    const image = !isVolume && imageOrVolume;
    const volume = isVolume && imageOrVolume;
    const imageIdToPrint = image.imageId || volume.volumeId;
    const viewportId = `renderGPUViewport-${imageIdToPrint}`;
    const element = document.createElement('div');
    const devicePixelRatio = window.devicePixelRatio || 1;
    if (!viewportOptions.displayArea) {
        viewportOptions.displayArea = { imageArea: [1, 1] };
    }
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;
    element.style.width = `${originalWidth / devicePixelRatio + getOrCreateCanvas/* EPSILON */.p8}px`;
    element.style.height = `${originalHeight / devicePixelRatio + getOrCreateCanvas/* EPSILON */.p8}px`;
    element.style.visibility = 'hidden';
    element.style.position = 'absolute';
    document.body.appendChild(element);
    const uniqueId = viewportId.split(':').join('-');
    element.setAttribute('viewport-id-for-remove', uniqueId);
    const temporaryCanvas = (0,getOrCreateCanvas/* default */.Ay)(element);
    const renderingEngine = (0,getRenderingEngine/* getRenderingEngine */.lD)(renderingEngineId) ||
        new TiledRenderingEngine/* default */.A(renderingEngineId);
    let viewport = renderingEngine.getViewport(viewportId);
    if (!viewport) {
        const viewportInput = {
            viewportId,
            type: isVolume ? enums.ViewportType.ORTHOGRAPHIC : enums.ViewportType.STACK,
            element,
            defaultOptions: {
                ...viewportOptions,
                suppressEvents: true,
            },
        };
        renderingEngine.enableElement(viewportInput);
        viewport = renderingEngine.getViewport(viewportId);
    }
    return new Promise((resolve) => {
        let elementRendered = false;
        let { viewReference } = viewportOptions;
        const onImageRendered = (eventDetail) => {
            if (elementRendered) {
                return;
            }
            if (viewReference) {
                const useViewRef = viewReference;
                viewReference = null;
                viewport.setViewReference(useViewRef);
                viewport.render();
                return;
            }
            const context = canvas.getContext('2d');
            context.drawImage(temporaryCanvas, 0, 0, temporaryCanvas.width, temporaryCanvas.height, 0, 0, canvas.width, canvas.height);
            const origin = viewport.canvasToWorld([0, 0]);
            const topRight = viewport.canvasToWorld([
                temporaryCanvas.width / devicePixelRatio,
                0,
            ]);
            const bottomLeft = viewport.canvasToWorld([
                0,
                temporaryCanvas.height / devicePixelRatio,
            ]);
            const rightVector = esm/* vec3.sub */.eR.sub([0, 0, 0], viewport.canvasToWorld([1 / devicePixelRatio, 0]), origin);
            const downVector = esm/* vec3.sub */.eR.sub([0, 0, 0], viewport.canvasToWorld([0, 1 / devicePixelRatio]), origin);
            const thicknessMm = 1;
            elementRendered = true;
            element.removeEventListener(enums.Events.IMAGE_RENDERED, onImageRendered);
            setTimeout(() => {
                renderingEngine.disableElement(viewportId);
                const elements = document.querySelectorAll(`[viewport-id-for-remove="${uniqueId}"]`);
                elements.forEach((element) => {
                    element.remove();
                });
            }, 0);
            resolve({
                origin,
                bottomLeft,
                topRight,
                thicknessMm,
                rightVector,
                downVector,
            });
        };
        element.addEventListener(enums.Events.IMAGE_RENDERED, onImageRendered);
        if (isVolume) {
            viewport.setVolumes([volume], false, true);
        }
        else {
            viewport.renderImageObject(imageOrVolume);
        }
        viewport.resetCamera();
        if (modality === 'PT' && !utilities_isPTPrescaledWithSUV(image)) {
            viewport.setProperties({
                voiRange: {
                    lower: image.minPixelValue,
                    upper: image.maxPixelValue,
                },
            });
        }
        viewport.render();
    });
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/cpuFallback/rendering/getDefaultViewport.js
var getDefaultViewport = __webpack_require__(36931);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/cpuFallback/rendering/calculateTransform.js
var calculateTransform = __webpack_require__(7808);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/cpuFallback/drawImageSync.js
var drawImageSync = __webpack_require__(5057);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/renderToCanvasCPU.js



function renderToCanvasCPU(canvas, imageOrVolume, modality, _renderingEngineId, _viewportOptions) {
    const volume = imageOrVolume;
    if (volume.volumeId) {
        throw new Error('Unsupported volume rendering for CPU');
    }
    const image = imageOrVolume;
    const viewport = (0,getDefaultViewport/* default */.A)(canvas, image, modality);
    const enabledElement = {
        canvas,
        viewport,
        image,
        renderingTools: {},
    };
    enabledElement.transform = (0,calculateTransform/* default */.A)(enabledElement);
    const invalidated = true;
    return new Promise((resolve, reject) => {
        (0,drawImageSync/* default */.A)(enabledElement, invalidated);
        resolve(null);
    });
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/cache/cache.js
var cache = __webpack_require__(49038);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/loadImageToCanvas.js







function loadImageToCanvas(options) {
    const { canvas, imageId, viewReference, requestType = enums.RequestType.Thumbnail, priority = -5, renderingEngineId = '_thumbnails', useCPURendering = false, thumbnail = false, imageAspect = false, viewportOptions: baseViewportOptions, } = options;
    const volumeId = viewReference?.volumeId;
    const isVolume = volumeId && !imageId;
    const viewportOptions = viewReference && baseViewportOptions
        ? { ...baseViewportOptions, viewReference }
        : baseViewportOptions;
    const renderFn = useCPURendering ? renderToCanvasCPU : renderToCanvasGPU;
    return new Promise((resolve, reject) => {
        function successCallback(imageOrVolume, imageId) {
            const { modality } = metaData.get('generalSeriesModule', imageId) || {};
            const image = !isVolume && imageOrVolume;
            const volume = isVolume && imageOrVolume;
            if (image) {
                image.isPreScaled = image.isPreScaled || image.preScale?.scaled;
            }
            if (thumbnail) {
                canvas.height = 256;
                canvas.width = 256;
            }
            if (imageAspect && image) {
                canvas.width = image && (canvas.height * image.width) / image.height;
            }
            canvas.style.width = `${canvas.width / devicePixelRatio}px`;
            canvas.style.height = `${canvas.height / devicePixelRatio}px`;
            if (volume && useCPURendering) {
                reject(new Error('CPU rendering of volume not supported'));
            }
            renderFn(canvas, imageOrVolume, modality, renderingEngineId, viewportOptions).then(resolve);
        }
        function errorCallback(error, imageId) {
            console.error(error, imageId);
            reject(error);
        }
        function sendRequest(imageId, imageIdIndex, options) {
            return (0,imageLoader.loadAndCacheImage)(imageId, options).then((image) => {
                successCallback.call(this, image, imageId);
            }, (error) => {
                errorCallback.call(this, error, imageId);
            });
        }
        const options = {
            useRGBA: !!useCPURendering,
            requestType,
        };
        if (volumeId) {
            const volume = cache/* default */.Ay.getVolume(volumeId);
            if (!volume) {
                reject(new Error(`Volume id ${volumeId} not found in cache`));
            }
            const useImageId = volume.imageIds[0];
            successCallback(volume, useImageId);
        }
        else {
            imageLoadPoolManager/* default */.A.addRequest(sendRequest.bind(null, imageId, null, options), requestType, { imageId }, priority);
        }
    });
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/eventTarget.js
var eventTarget = __webpack_require__(10364);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/asArray.js
function asArray(item) {
    if (Array.isArray(item)) {
        return item;
    }
    return [item];
}

;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/historyMemo/index.js


const Events = {
    HISTORY_UNDO: 'CORNERSTONE_TOOLS_HISTORY_UNDO',
    HISTORY_REDO: 'CORNERSTONE_TOOLS_HISTORY_REDO',
};
class HistoryMemo {
    constructor(label = 'Tools', size = 50) {
        this.position = -1;
        this.redoAvailable = 0;
        this.undoAvailable = 0;
        this.ring = new Array();
        this.isRecordingGrouped = false;
        this.label = label;
        this._size = size;
    }
    get size() {
        return this._size;
    }
    set size(newSize) {
        this.ring = new Array(newSize);
        this._size = newSize;
        this.position = -1;
        this.redoAvailable = 0;
        this.undoAvailable = 0;
    }
    get canUndo() {
        return this.undoAvailable > 0;
    }
    get canRedo() {
        return this.redoAvailable > 0;
    }
    undo(items = 1) {
        while (items > 0 && this.undoAvailable > 0) {
            const item = this.ring[this.position];
            for (const subitem of asArray(item).reverse()) {
                subitem.restoreMemo(true);
                this.dispatchHistoryEvent({ item: subitem, isUndo: true });
            }
            items--;
            this.redoAvailable++;
            this.undoAvailable--;
            this.position = (this.position - 1 + this.size) % this.size;
        }
    }
    undoIf(condition) {
        if (this.undoAvailable > 0 && condition(this.ring[this.position])) {
            this.undo();
            return true;
        }
        return false;
    }
    dispatchHistoryEvent({ item, isUndo }) {
        if (item.id) {
            eventTarget/* default */.A.dispatchEvent(new CustomEvent(isUndo ? Events.HISTORY_UNDO : Events.HISTORY_REDO, {
                detail: {
                    isUndo,
                    id: item.id,
                    operationType: item.operationType || 'annotation',
                    memo: item,
                },
            }));
        }
    }
    redo(items = 1) {
        while (items > 0 && this.redoAvailable > 0) {
            const newPosition = (this.position + 1) % this.size;
            const item = this.ring[newPosition];
            for (const subitem of asArray(item).reverse()) {
                subitem.restoreMemo(false);
                this.dispatchHistoryEvent({ item: subitem, isUndo: false });
            }
            items--;
            this.position = newPosition;
            this.undoAvailable++;
            this.redoAvailable--;
        }
    }
    initializeGroupItem() {
        this.redoAvailable = 0;
        if (this.undoAvailable < this._size) {
            this.undoAvailable++;
        }
        this.position = (this.position + 1) % this._size;
        this.ring[this.position] = [];
    }
    startGroupRecording() {
        this.isRecordingGrouped = true;
        this.initializeGroupItem();
    }
    rollbackUnusedGroupItem() {
        this.ring[this.position] = undefined;
        this.position = (this.position - 1) % this._size;
        this.undoAvailable--;
    }
    endGroupRecording() {
        this.isRecordingGrouped = false;
        const lastItem = this.ring[this.position];
        const lastItemIsEmpty = Array.isArray(lastItem) && lastItem.length === 0;
        if (lastItemIsEmpty) {
            this.rollbackUnusedGroupItem();
        }
    }
    pushGrouped(memo) {
        const lastMemo = this.ring[this.position];
        if (Array.isArray(lastMemo)) {
            lastMemo.push(memo);
            return memo;
        }
        throw new Error('Last item should be an array for grouped memos.');
    }
    push(item) {
        if (!item) {
            return;
        }
        const memo = item.restoreMemo
            ? item
            : item.createMemo?.();
        if (!memo) {
            return;
        }
        if (this.isRecordingGrouped) {
            return this.pushGrouped(memo);
        }
        this.redoAvailable = 0;
        if (this.undoAvailable < this._size) {
            this.undoAvailable++;
        }
        this.position = (this.position + 1) % this._size;
        this.ring[this.position] = memo;
        return memo;
    }
}
const DefaultHistoryMemo = new HistoryMemo();


;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/worldToImageCoords.js


function worldToImageCoords(imageId, worldCoords) {
    const imagePlaneModule = (0,metaData.get)('imagePlaneModule', imageId);
    if (!imagePlaneModule) {
        throw new Error(`No imagePlaneModule found for imageId: ${imageId}`);
    }
    const { columnCosines, rowCosines, imagePositionPatient: origin, } = imagePlaneModule;
    let { columnPixelSpacing, rowPixelSpacing } = imagePlaneModule;
    columnPixelSpacing ||= 1;
    rowPixelSpacing ||= 1;
    const newOrigin = esm/* vec3.create */.eR.create();
    esm/* vec3.scaleAndAdd */.eR.scaleAndAdd(newOrigin, origin, columnCosines, -columnPixelSpacing / 2);
    esm/* vec3.scaleAndAdd */.eR.scaleAndAdd(newOrigin, newOrigin, rowCosines, -rowPixelSpacing / 2);
    const sub = esm/* vec3.create */.eR.create();
    esm/* vec3.sub */.eR.sub(sub, worldCoords, newOrigin);
    const rowDistance = esm/* vec3.dot */.eR.dot(sub, rowCosines);
    const columnDistance = esm/* vec3.dot */.eR.dot(sub, columnCosines);
    const imageCoords = [
        rowDistance / rowPixelSpacing,
        columnDistance / columnPixelSpacing,
    ];
    return imageCoords;
}
/* harmony default export */ const utilities_worldToImageCoords = (worldToImageCoords);

;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/imageToWorldCoords.js


function imageToWorldCoords(imageId, imageCoords) {
    const imagePlaneModule = (0,metaData.get)('imagePlaneModule', imageId);
    if (!imagePlaneModule) {
        throw new Error(`No imagePlaneModule found for imageId: ${imageId}`);
    }
    const { columnCosines, rowCosines, imagePositionPatient: origin, } = imagePlaneModule;
    let { columnPixelSpacing, rowPixelSpacing } = imagePlaneModule;
    columnPixelSpacing ||= 1;
    rowPixelSpacing ||= 1;
    const imageCoordsInWorld = esm/* vec3.create */.eR.create();
    esm/* vec3.scaleAndAdd */.eR.scaleAndAdd(imageCoordsInWorld, origin, rowCosines, rowPixelSpacing * (imageCoords[0] - 0.5));
    esm/* vec3.scaleAndAdd */.eR.scaleAndAdd(imageCoordsInWorld, imageCoordsInWorld, columnCosines, columnPixelSpacing * (imageCoords[1] - 0.5));
    return Array.from(imageCoordsInWorld);
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getVolumeSliceRangeInfo.js
var getVolumeSliceRangeInfo = __webpack_require__(4031);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getVolumeViewportScrollInfo.js
var getVolumeViewportScrollInfo = __webpack_require__(61375);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getSliceRange.js
var getSliceRange = __webpack_require__(20537);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/snapFocalPointToSlice.js
var snapFocalPointToSlice = __webpack_require__(80500);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getImageSliceDataForVolumeViewport.js
var getImageSliceDataForVolumeViewport = __webpack_require__(47476);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/actorCheck.js
var actorCheck = __webpack_require__(98039);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getViewportsWithImageURI.js

function getViewportsWithImageURI(imageURI) {
    const renderingEngines = (0,getRenderingEngine/* getRenderingEngines */.qO)();
    const viewports = [];
    renderingEngines.forEach((renderingEngine) => {
        const viewportsForRenderingEngine = renderingEngine.getViewports();
        viewportsForRenderingEngine.forEach((viewport) => {
            if (viewport.hasImageURI(imageURI)) {
                viewports.push(viewport);
            }
        });
    });
    return viewports;
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/planar.js
var planar = __webpack_require__(52268);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getClosestStackImageIndexForPoint.js



function getClosestStackImageIndexForPoint(point, viewport) {
    const minimalDistance = calculateMinimalDistanceForStackViewport(point, viewport);
    return minimalDistance ? minimalDistance.index : null;
}
function calculateMinimalDistanceForStackViewport(point, viewport) {
    const imageIds = viewport.getImageIds();
    const currentImageIdIndex = viewport.getCurrentImageIdIndex();
    if (imageIds.length === 0) {
        return null;
    }
    const getDistance = (imageId) => {
        const planeMetadata = getPlaneMetadata(imageId);
        if (!planeMetadata) {
            return null;
        }
        const plane = planar.planeEquation(planeMetadata.planeNormal, planeMetadata.imagePositionPatient);
        const distance = planar.planeDistanceToPoint(plane, point);
        return distance;
    };
    const closestStack = {
        distance: getDistance(imageIds[currentImageIdIndex]) ?? Infinity,
        index: currentImageIdIndex,
    };
    const higherImageIds = imageIds.slice(currentImageIdIndex + 1);
    for (let i = 0; i < higherImageIds.length; i++) {
        const id = higherImageIds[i];
        const distance = getDistance(id);
        if (distance === null) {
            continue;
        }
        if (distance <= closestStack.distance) {
            closestStack.distance = distance;
            closestStack.index = i + currentImageIdIndex + 1;
        }
        else {
            break;
        }
    }
    const lowerImageIds = imageIds.slice(0, currentImageIdIndex);
    for (let i = lowerImageIds.length - 1; i >= 0; i--) {
        const id = lowerImageIds[i];
        const distance = getDistance(id);
        if (distance === null || distance === closestStack.distance) {
            continue;
        }
        if (distance < closestStack.distance) {
            closestStack.distance = distance;
            closestStack.index = i;
        }
        else {
            break;
        }
    }
    return closestStack.distance === Infinity ? null : closestStack;
}
function getPlaneMetadata(imageId) {
    const targetImagePlane = metaData.get('imagePlaneModule', imageId);
    if (!targetImagePlane ||
        !(targetImagePlane.rowCosines instanceof Array &&
            targetImagePlane.rowCosines.length === 3) ||
        !(targetImagePlane.columnCosines instanceof Array &&
            targetImagePlane.columnCosines.length === 3) ||
        !(targetImagePlane.imagePositionPatient instanceof Array &&
            targetImagePlane.imagePositionPatient.length === 3)) {
        return null;
    }
    const { rowCosines, columnCosines, imagePositionPatient, } = targetImagePlane;
    const rowVec = esm/* vec3.set */.eR.set(esm/* vec3.create */.eR.create(), ...rowCosines);
    const colVec = esm/* vec3.set */.eR.set(esm/* vec3.create */.eR.create(), ...columnCosines);
    const planeNormal = esm/* vec3.cross */.eR.cross(esm/* vec3.create */.eR.create(), rowVec, colVec);
    return { rowCosines, columnCosines, imagePositionPatient, planeNormal };
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/transformCanvasToIJK.js
var transformCanvasToIJK = __webpack_require__(51919);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getCurrentVolumeViewportSlice.js


function getCurrentVolumeViewportSlice(viewport) {
    const { width: canvasWidth, height: canvasHeight } = viewport.getCanvas();
    const { sliceToIndexMatrix, indexToSliceMatrix } = viewport.getSliceViewInfo();
    const ijkOriginPoint = (0,transformCanvasToIJK/* transformCanvasToIJK */.e)(viewport, [0, 0]);
    const ijkRowPoint = (0,transformCanvasToIJK/* transformCanvasToIJK */.e)(viewport, [canvasWidth - 1, 0]);
    const ijkColPoint = (0,transformCanvasToIJK/* transformCanvasToIJK */.e)(viewport, [0, canvasHeight - 1]);
    const ijkRowVec = esm/* vec3.sub */.eR.sub(esm/* vec3.create */.eR.create(), ijkRowPoint, ijkOriginPoint);
    const ijkColVec = esm/* vec3.sub */.eR.sub(esm/* vec3.create */.eR.create(), ijkColPoint, ijkOriginPoint);
    const ijkSliceVec = esm/* vec3.cross */.eR.cross(esm/* vec3.create */.eR.create(), ijkRowVec, ijkColVec);
    esm/* vec3.normalize */.eR.normalize(ijkRowVec, ijkRowVec);
    esm/* vec3.normalize */.eR.normalize(ijkColVec, ijkColVec);
    esm/* vec3.normalize */.eR.normalize(ijkSliceVec, ijkSliceVec);
    const maxIJKRowVec = Math.max(Math.abs(ijkRowVec[0]), Math.abs(ijkRowVec[1]), Math.abs(ijkRowVec[2]));
    const maxIJKColVec = Math.max(Math.abs(ijkColVec[0]), Math.abs(ijkColVec[1]), Math.abs(ijkColVec[2]));
    if (!esm/* glMatrix.equals */.Fd.equals(1, maxIJKRowVec) || !esm/* glMatrix.equals */.Fd.equals(1, maxIJKColVec)) {
        throw new Error('Livewire is not available for rotate/oblique viewports');
    }
    const { voxelManager } = viewport.getImageData();
    const sliceViewInfo = viewport.getSliceViewInfo();
    const scalarData = voxelManager.getSliceData(sliceViewInfo);
    return {
        width: sliceViewInfo.width,
        height: sliceViewInfo.height,
        scalarData,
        sliceToIndexMatrix,
        indexToSliceMatrix,
    };
}


;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/spatialRegistrationMetadataProvider.js


const spatialRegistrationMetadataProvider_state = {};
const spatialRegistrationMetadataProvider = {
    add: (query, payload) => {
        const [viewportId1, viewportId2] = query;
        const entryId = `${viewportId1}_${viewportId2}`;
        if (!spatialRegistrationMetadataProvider_state[entryId]) {
            spatialRegistrationMetadataProvider_state[entryId] = {};
        }
        spatialRegistrationMetadataProvider_state[entryId] = payload;
    },
    get: (type, viewportId1, viewportId2) => {
        if (type !== 'spatialRegistrationModule') {
            return;
        }
        const entryId = `${viewportId1}_${viewportId2}`;
        if (spatialRegistrationMetadataProvider_state[entryId]) {
            return spatialRegistrationMetadataProvider_state[entryId];
        }
        const entryIdReverse = `${viewportId2}_${viewportId1}`;
        if (spatialRegistrationMetadataProvider_state[entryIdReverse]) {
            return esm/* mat4.invert */.pB.invert(esm/* mat4.create */.pB.create(), spatialRegistrationMetadataProvider_state[entryIdReverse]);
        }
    },
};
(0,metaData.addProvider)(spatialRegistrationMetadataProvider.get.bind(spatialRegistrationMetadataProvider));
/* harmony default export */ const utilities_spatialRegistrationMetadataProvider = (spatialRegistrationMetadataProvider);

;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/calculateViewportsSpatialRegistration.js



const ALLOWED_DELTA = 0.05;
function calculateViewportsSpatialRegistration(viewport1, viewport2) {
    const imageId1 = viewport1.getSliceIndex();
    const imageId2 = viewport2.getSliceIndex();
    const imagePlaneModule1 = (0,metaData.get)('imagePlaneModule', imageId1.toString());
    const imagePlaneModule2 = (0,metaData.get)('imagePlaneModule', imageId2.toString());
    if (!imagePlaneModule1 || !imagePlaneModule2) {
        console.log('Viewport spatial registration requires image plane module');
        return;
    }
    const { imageOrientationPatient: iop2 } = imagePlaneModule2;
    const isSameImagePlane = imagePlaneModule1.imageOrientationPatient.every((v, i) => Math.abs(v - iop2[i]) < ALLOWED_DELTA);
    if (!isSameImagePlane) {
        console.log('Viewport spatial registration only supported for same orientation (hence translation only) for now', imagePlaneModule1?.imageOrientationPatient, imagePlaneModule2?.imageOrientationPatient);
        return;
    }
    const imagePositionPatient1 = imagePlaneModule1.imagePositionPatient;
    const imagePositionPatient2 = imagePlaneModule2.imagePositionPatient;
    const translation = esm/* vec3.subtract */.eR.subtract(esm/* vec3.create */.eR.create(), imagePositionPatient1, imagePositionPatient2);
    const mat = esm/* mat4.fromTranslation */.pB.fromTranslation(esm/* mat4.create */.pB.create(), translation);
    utilities_spatialRegistrationMetadataProvider.add([viewport1.id, viewport2.id], mat);
}
/* harmony default export */ const utilities_calculateViewportsSpatialRegistration = (calculateViewportsSpatialRegistration);

;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getViewportImageCornersInWorld.js
function getViewportImageCornersInWorld(viewport) {
    const { imageData, dimensions } = viewport.getImageData() || {};
    if (!imageData || !dimensions) {
        return [];
    }
    const { canvas } = viewport;
    const ratio = window.devicePixelRatio;
    const topLeftCanvas = [0, 0];
    const topRightCanvas = [canvas.width / ratio, 0];
    const bottomRightCanvas = [
        canvas.width / ratio,
        canvas.height / ratio,
    ];
    const bottomLeftCanvas = [0, canvas.height / ratio];
    const topLeftWorld = viewport.canvasToWorld(topLeftCanvas);
    const topRightWorld = viewport.canvasToWorld(topRightCanvas);
    const bottomRightWorld = viewport.canvasToWorld(bottomRightCanvas);
    const bottomLeftWorld = viewport.canvasToWorld(bottomLeftCanvas);
    const topLeftImage = imageData.worldToIndex(topLeftWorld);
    const topRightImage = imageData.worldToIndex(topRightWorld);
    const bottomRightImage = imageData.worldToIndex(bottomRightWorld);
    const bottomLeftImage = imageData.worldToIndex(bottomLeftWorld);
    return _getStackViewportImageCorners({
        dimensions,
        imageData,
        topLeftImage,
        topRightImage,
        bottomRightImage,
        bottomLeftImage,
        topLeftWorld,
        topRightWorld,
        bottomRightWorld,
        bottomLeftWorld,
    });
}
function _getStackViewportImageCorners({ dimensions, imageData, topLeftImage, topRightImage, bottomRightImage, bottomLeftImage, topLeftWorld, topRightWorld, bottomRightWorld, bottomLeftWorld, }) {
    const topLeftImageWorld = _isInBounds(topLeftImage, dimensions)
        ? topLeftWorld
        : imageData.indexToWorld([0, 0, 0]);
    const topRightImageWorld = _isInBounds(topRightImage, dimensions)
        ? topRightWorld
        : imageData.indexToWorld([dimensions[0] - 1, 0, 0]);
    const bottomRightImageWorld = _isInBounds(bottomRightImage, dimensions)
        ? bottomRightWorld
        : imageData.indexToWorld([
            dimensions[0] - 1,
            dimensions[1] - 1,
            0,
        ]);
    const bottomLeftImageWorld = _isInBounds(bottomLeftImage, dimensions)
        ? bottomLeftWorld
        : imageData.indexToWorld([0, dimensions[1] - 1, 0]);
    return [
        topLeftImageWorld,
        topRightImageWorld,
        bottomLeftImageWorld,
        bottomRightImageWorld,
    ];
}
function _isInBounds(imageCoord, dimensions) {
    return (imageCoord[0] > 0 ||
        imageCoord[0] < dimensions[0] - 1 ||
        imageCoord[1] > 0 ||
        imageCoord[1] < dimensions[1] - 1 ||
        imageCoord[2] > 0 ||
        imageCoord[2] < dimensions[2] - 1);
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/hasNaNValues.js
var hasNaNValues = __webpack_require__(38883);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/applyPreset.js
var applyPreset = __webpack_require__(96833);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/PointsManager.js
var PointsManager = __webpack_require__(13876);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/deepMerge.js
var deepMerge = __webpack_require__(74268);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getScalingParameters.js
var getScalingParameters = __webpack_require__(32173);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/StackViewport.js + 14 modules
var StackViewport = __webpack_require__(79720);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/getEnabledElement.js
var getEnabledElement = __webpack_require__(86846);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getImageLegacy.js


function getImageLegacy(element) {
    const enabledElement = (0,getEnabledElement/* default */.Ay)(element);
    if (!enabledElement) {
        return;
    }
    const { viewport } = enabledElement;
    if (!(viewport instanceof StackViewport/* default */.A)) {
        throw new Error(`An image can only be fetched for a stack viewport and not for a viewport of type: ${viewport.type}`);
    }
    return viewport.getCornerstoneImage();
}
/* harmony default export */ const utilities_getImageLegacy = (getImageLegacy);

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/sortImageIdsAndGetSpacing.js
var sortImageIdsAndGetSpacing = __webpack_require__(90537);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/makeVolumeMetadata.js
var makeVolumeMetadata = __webpack_require__(1865);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/genericMetadataProvider.js
var genericMetadataProvider = __webpack_require__(27119);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/isEqual.js
var isEqual = __webpack_require__(74638);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/isValidVolume.js


function isValidVolume(imageIds) {
    if (imageIds.length <= 1) {
        return false;
    }
    const imageId0 = imageIds[0];
    const { modality, seriesInstanceUID } = metaData.get('generalSeriesModule', imageId0);
    const { imageOrientationPatient, pixelSpacing, frameOfReferenceUID, columns, rows, usingDefaultValues, } = metaData.get('imagePlaneModule', imageId0);
    if (usingDefaultValues) {
        return false;
    }
    const baseMetadata = {
        modality,
        imageOrientationPatient,
        pixelSpacing,
        frameOfReferenceUID,
        columns,
        rows,
        seriesInstanceUID,
    };
    let validVolume = true;
    for (let i = 0; i < imageIds.length; i++) {
        const imageId = imageIds[i];
        const { modality, seriesInstanceUID } = metaData.get('generalSeriesModule', imageId);
        const { imageOrientationPatient, pixelSpacing, columns, rows } = metaData.get('imagePlaneModule', imageId);
        if (seriesInstanceUID !== baseMetadata.seriesInstanceUID) {
            validVolume = false;
            break;
        }
        if (modality !== baseMetadata.modality) {
            validVolume = false;
            break;
        }
        if (columns !== baseMetadata.columns) {
            validVolume = false;
            break;
        }
        if (rows !== baseMetadata.rows) {
            validVolume = false;
            break;
        }
        if (!(0,isEqual/* default */.Ay)(imageOrientationPatient, baseMetadata.imageOrientationPatient)) {
            validVolume = false;
            break;
        }
        if (!(0,isEqual/* default */.Ay)(pixelSpacing, baseMetadata.pixelSpacing)) {
            validVolume = false;
            break;
        }
    }
    return validVolume;
}


// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/updateVTKImageDataWithCornerstoneImage.js
var updateVTKImageDataWithCornerstoneImage = __webpack_require__(45278);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/ProgressiveIterator.js
var ProgressiveIterator = __webpack_require__(22191);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/decimate.js
var decimate = __webpack_require__(63470);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/imageRetrieveMetadataProvider.js
var imageRetrieveMetadataProvider = __webpack_require__(17791);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/isVideoTransferSyntax.js
const videoUIDs = new Set([
    '1.2.840.10008.1.2.4.100',
    '1.2.840.10008.1.2.4.100.1',
    '1.2.840.10008.1.2.4.101',
    '1.2.840.10008.1.2.4.101.1',
    '1.2.840.10008.1.2.4.102',
    '1.2.840.10008.1.2.4.102.1',
    '1.2.840.10008.1.2.4.103',
    '1.2.840.10008.1.2.4.103.1',
    '1.2.840.10008.1.2.4.104',
    '1.2.840.10008.1.2.4.104.1',
    '1.2.840.10008.1.2.4.105',
    '1.2.840.10008.1.2.4.105.1',
    '1.2.840.10008.1.2.4.106',
    '1.2.840.10008.1.2.4.106.1',
    '1.2.840.10008.1.2.4.107',
    '1.2.840.10008.1.2.4.108',
]);
function isVideoTransferSyntax(uidOrUids) {
    if (!uidOrUids) {
        return false;
    }
    const uids = Array.isArray(uidOrUids) ? uidOrUids : [uidOrUids];
    return uids.find((uid) => videoUIDs.has(uid));
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getBufferConfiguration.js
var getBufferConfiguration = __webpack_require__(99576);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/generateVolumePropsFromImageIds.js
var generateVolumePropsFromImageIds = __webpack_require__(9734);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/index.js + 3 modules
var helpers = __webpack_require__(40661);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/loaders/volumeLoader.js + 10 modules
var volumeLoader = __webpack_require__(87142);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/convertStackToVolumeViewport.js




async function convertStackToVolumeViewport({ viewport, options = {}, }) {
    const renderingEngine = viewport.getRenderingEngine();
    let volumeId = options.volumeId || `${(0,uuidv4/* default */.A)()}`;
    if (volumeId.split(':').length === 0) {
        const schema = (0,volumeLoader.getUnknownVolumeLoaderSchema)();
        volumeId = `${schema}:${volumeId}`;
    }
    const { id, element } = viewport;
    const viewportId = options.viewportId || id;
    const imageIds = viewport.getImageIds();
    const prevViewPresentation = viewport.getViewPresentation();
    const prevViewReference = viewport.getViewReference();
    renderingEngine.enableElement({
        viewportId,
        type: enums.ViewportType.ORTHOGRAPHIC,
        element,
        defaultOptions: {
            background: options.background,
            orientation: options.orientation,
        },
    });
    const volume = (await (0,volumeLoader.createAndCacheVolume)(volumeId, {
        imageIds,
    }));
    volume.load();
    const volumeViewport = renderingEngine.getViewport(viewportId);
    await (0,helpers/* setVolumesForViewports */.A7)(renderingEngine, [
        {
            volumeId,
        },
    ], [viewportId]);
    const volumeViewportNewVolumeHandler = () => {
        volumeViewport.render();
        element.removeEventListener(enums.Events.VOLUME_VIEWPORT_NEW_VOLUME, volumeViewportNewVolumeHandler);
    };
    const addVolumeViewportNewVolumeListener = () => {
        element.addEventListener(enums.Events.VOLUME_VIEWPORT_NEW_VOLUME, volumeViewportNewVolumeHandler);
    };
    addVolumeViewportNewVolumeListener();
    volumeViewport.setViewPresentation(prevViewPresentation);
    volumeViewport.setViewReference(prevViewReference);
    volumeViewport.render();
    return volumeViewport;
}


// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/cache/classes/ImageVolume.js
var ImageVolume = __webpack_require__(86252);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/convertVolumeToStackViewport.js



async function convertVolumeToStackViewport({ viewport, options, }) {
    const volumeViewport = viewport;
    const { id, element } = volumeViewport;
    const renderingEngine = viewport.getRenderingEngine();
    const { background } = options;
    const viewportId = options.viewportId || id;
    const volume = cache/* default */.Ay.getVolume(volumeViewport.getVolumeId());
    if (!(volume instanceof ImageVolume/* ImageVolume */.Q)) {
        throw new Error('Currently, you cannot decache a volume that is not an ImageVolume. So, unfortunately, volumes such as nifti  (which are basic Volume, without imageIds) cannot be decached.');
    }
    const viewportInput = {
        viewportId,
        type: enums.ViewportType.STACK,
        element,
        defaultOptions: {
            background,
        },
    };
    const prevView = volumeViewport.getViewReference();
    renderingEngine.enableElement(viewportInput);
    const stackViewport = renderingEngine.getViewport(viewportId);
    await stackViewport.setStack(volume.imageIds);
    stackViewport.setViewReference(prevView);
    stackViewport.render();
    return stackViewport;
}


// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/VoxelManager.js
var VoxelManager = __webpack_require__(24623);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/RLEVoxelMap.js
var RLEVoxelMap = __webpack_require__(67645);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/constants/index.js + 4 modules
var constants = __webpack_require__(76491);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/roundNumber.js

function roundNumber(value, precision = 2) {
    if (Array.isArray(value)) {
        return value.map((v) => roundNumber(v, precision)).join(', ');
    }
    if (value === undefined || value === null || value === '') {
        return 'NaN';
    }
    value = Number(value);
    const absValue = Math.abs(value);
    if (absValue < 0.0001) {
        return `${value}`;
    }
    const fixedPrecision = absValue >= 100
        ? precision - 2
        : absValue >= 10
            ? precision - 1
            : absValue >= 1
                ? precision
                : absValue >= 0.1
                    ? precision + 1
                    : absValue >= 0.01
                        ? precision + 2
                        : absValue >= 0.001
                            ? precision + 3
                            : precision + 4;
    return value.toFixed(fixedPrecision);
}
function roundToPrecision(value) {
    return Math.round(value / constants.EPSILON) * constants.EPSILON;
}

/* harmony default export */ const utilities_roundNumber = (roundNumber);

;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/convertToGrayscale.js
function convertToGrayscale(scalarData, width, height) {
    const isRGBA = scalarData.length === width * height * 4;
    const isRGB = scalarData.length === width * height * 3;
    if (isRGBA || isRGB) {
        const newScalarData = new Float32Array(width * height);
        let offset = 0;
        let destOffset = 0;
        const increment = isRGBA ? 4 : 3;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const r = scalarData[offset];
                const g = scalarData[offset + 1];
                const b = scalarData[offset + 2];
                newScalarData[destOffset] = (r + g + b) / 3;
                offset += increment;
                destOffset++;
            }
        }
        return newScalarData;
    }
    else {
        return scalarData;
    }
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/index.js + 3 modules
var RenderingEngine = __webpack_require__(90340);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getViewportImageIds.js


function getViewportImageIds(viewport) {
    if (viewport instanceof RenderingEngine/* VolumeViewport */.PX) {
        const volume = cache/* default */.Ay.getVolume(viewport.getVolumeId());
        return volume.imageIds;
    }
    else if (viewport.getImageIds) {
        return viewport.getImageIds();
    }
}
/* harmony default export */ const utilities_getViewportImageIds = (getViewportImageIds);

;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getRandomSampleFromArray.js
function getRandomSampleFromArray(array, size) {
    const clonedArray = [...array];
    if (size >= clonedArray.length) {
        shuffleArray(clonedArray);
        return clonedArray;
    }
    shuffleArray(clonedArray);
    return clonedArray.slice(0, size);
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getVolumeId.js
var getVolumeId = __webpack_require__(12437);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/hasFloatScalingParameters.js
var hasFloatScalingParameters = __webpack_require__(30169);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/pointInShapeCallback.js
var pointInShapeCallback = __webpack_require__(56577);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/windowLevel.js
var windowLevel = __webpack_require__(68136);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/colormap.js
var colormap = __webpack_require__(13859);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/transferFunctionUtils.js
var transferFunctionUtils = __webpack_require__(8126);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/color.js
function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
}
function rgbToHex(r, g, b) {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}


;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/deepEqual.js
function deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
        return true;
    }
    if (obj1 == null || obj2 == null) {
        return false;
    }
    try {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }
    catch (error) {
        console.debug('Error in JSON.stringify during deep comparison:', error);
        return obj1 === obj2;
    }
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/FrameRange.js
var FrameRange = __webpack_require__(56750);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/fnv1aHash.js
var fnv1aHash = __webpack_require__(20286);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getImageDataMetadata.js
var getImageDataMetadata = __webpack_require__(53932);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/buildMetadata.js
var buildMetadata = __webpack_require__(89131);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getViewportModality.js
function _getViewportModality(viewport, volumeId, getVolume) {
    if (!getVolume) {
        throw new Error('getVolume is required, use the utilities export instead ');
    }
    if (viewport.modality) {
        return viewport.modality;
    }
    if (viewport.setVolumes) {
        volumeId = volumeId ?? viewport.getVolumeId();
        if (!volumeId || !getVolume) {
            return;
        }
        const volume = getVolume(volumeId);
        return volume.metadata.Modality;
    }
    throw new Error('Invalid viewport type');
}


;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/splitImageIdsBy4DTags.js

const groupBy = (array, key) => {
    return array.reduce((rv, x) => {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};
function getIPPGroups(imageIds) {
    const ippMetadata = imageIds.map((imageId) => {
        const { imagePositionPatient } = metaData.get('imagePlaneModule', imageId) || {};
        return { imageId, imagePositionPatient };
    });
    if (!ippMetadata.every((item) => item.imagePositionPatient)) {
        return null;
    }
    const positionGroups = groupBy(ippMetadata, 'imagePositionPatient');
    const positions = Object.keys(positionGroups);
    const frame_count = positionGroups[positions[0]].length;
    if (frame_count === 1) {
        return null;
    }
    const frame_count_equal = positions.every((k) => positionGroups[k].length === frame_count);
    if (!frame_count_equal) {
        return null;
    }
    return positionGroups;
}
function test4DTag(IPPGroups, value_getter) {
    const frame_groups = {};
    let first_frame_value_set = [];
    const positions = Object.keys(IPPGroups);
    for (let i = 0; i < positions.length; i++) {
        const frame_value_set = new Set();
        const frames = IPPGroups[positions[i]];
        for (let j = 0; j < frames.length; j++) {
            const frame_value = value_getter(frames[j].imageId) || 0;
            frame_groups[frame_value] = frame_groups[frame_value] || [];
            frame_groups[frame_value].push({ imageId: frames[j].imageId });
            frame_value_set.add(frame_value);
            if (frame_value_set.size - 1 < j) {
                return undefined;
            }
        }
        if (i == 0) {
            first_frame_value_set = Array.from(frame_value_set);
        }
        else if (!setEquals(first_frame_value_set, frame_value_set)) {
            return undefined;
        }
    }
    return frame_groups;
}
function getTagValue(imageId, tag) {
    const value = metaData.get(tag, imageId);
    try {
        return parseFloat(value);
    }
    catch {
        return undefined;
    }
}
function getPhilipsPrivateBValue(imageId) {
    const value = metaData.get('20011003', imageId);
    try {
        const { InlineBinary } = value;
        if (InlineBinary) {
            const value_bytes = atob(InlineBinary);
            const ary_buf = new ArrayBuffer(value_bytes.length);
            const dv = new DataView(ary_buf);
            for (let i = 0; i < value_bytes.length; i++) {
                dv.setUint8(i, value_bytes.charCodeAt(i));
            }
            return new Float32Array(ary_buf)[0];
        }
        return parseFloat(value);
    }
    catch {
        return undefined;
    }
}
function getSiemensPrivateBValue(imageId) {
    let value = metaData.get('0019100c', imageId) || metaData.get('0019100C', imageId);
    try {
        const { InlineBinary } = value;
        if (InlineBinary) {
            value = atob(InlineBinary);
        }
        return parseFloat(value);
    }
    catch {
        return undefined;
    }
}
function getGEPrivateBValue(imageId) {
    let value = metaData.get('00431039', imageId);
    try {
        const { InlineBinary } = value;
        if (InlineBinary) {
            value = atob(InlineBinary).split('//');
        }
        return parseFloat(value[0]) % 100000;
    }
    catch {
        return undefined;
    }
}
function setEquals(set_a, set_b) {
    if (set_a.length != set_b.size) {
        return false;
    }
    for (let i = 0; i < set_a.length; i++) {
        if (!set_b.has(set_a[i])) {
            return false;
        }
    }
    return true;
}
function getPetFrameReferenceTime(imageId) {
    const moduleInfo = metaData.get('petImageModule', imageId);
    return moduleInfo ? moduleInfo['frameReferenceTime'] : 0;
}
function splitImageIdsBy4DTags(imageIds) {
    const positionGroups = getIPPGroups(imageIds);
    if (!positionGroups) {
        return { imageIdGroups: [imageIds], splittingTag: null };
    }
    const tags = [
        'TemporalPositionIdentifier',
        'DiffusionBValue',
        'TriggerTime',
        'EchoTime',
        'EchoNumber',
        'PhilipsPrivateBValue',
        'SiemensPrivateBValue',
        'GEPrivateBValue',
        'PetFrameReferenceTime',
    ];
    const fncList2 = [
        (imageId) => getTagValue(imageId, tags[0]),
        (imageId) => getTagValue(imageId, tags[1]),
        (imageId) => getTagValue(imageId, tags[2]),
        (imageId) => getTagValue(imageId, tags[3]),
        (imageId) => getTagValue(imageId, tags[4]),
        getPhilipsPrivateBValue,
        getSiemensPrivateBValue,
        getGEPrivateBValue,
        getPetFrameReferenceTime,
    ];
    for (let i = 0; i < fncList2.length; i++) {
        const frame_groups = test4DTag(positionGroups, fncList2[i]);
        if (frame_groups) {
            const sortedKeys = Object.keys(frame_groups)
                .map(Number.parseFloat)
                .sort((a, b) => a - b);
            const imageIdGroups = sortedKeys.map((key) => frame_groups[key].map((item) => item.imageId));
            return { imageIdGroups, splittingTag: tags[i] };
        }
    }
    return { imageIdGroups: [imageIds], splittingTag: null };
}
/* harmony default export */ const utilities_splitImageIdsBy4DTags = (splitImageIdsBy4DTags);

;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getDynamicVolumeInfo.js

function getDynamicVolumeInfo(imageIds) {
    const { imageIdGroups: timePoints, splittingTag } = utilities_splitImageIdsBy4DTags(imageIds);
    const isDynamicVolume = timePoints.length > 1;
    return { isDynamicVolume, timePoints, splittingTag };
}
/* harmony default export */ const utilities_getDynamicVolumeInfo = (getDynamicVolumeInfo);

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/autoLoad.js
var autoLoad = __webpack_require__(91979);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/scaleArray.js
function scaleArray(array, scalingParameters) {
    const arrayLength = array.length;
    const { rescaleSlope, rescaleIntercept, suvbw } = scalingParameters;
    if (scalingParameters.modality === 'PT' && typeof suvbw === 'number') {
        for (let i = 0; i < arrayLength; i++) {
            array[i] = suvbw * (array[i] * rescaleSlope + rescaleIntercept);
        }
    }
    else {
        for (let i = 0; i < arrayLength; i++) {
            array[i] = array[i] * rescaleSlope + rescaleIntercept;
        }
    }
    return array;
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/deepClone.js
var deepClone = __webpack_require__(99949);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/clip.js
function clip(val, low, high) {
    return Math.min(Math.max(low, val), high);
}
function clipToBox(point, box) {
    point.x = clip(point.x, 0, box.width);
    point.y = clip(point.y, 0, box.height);
}
/* harmony default export */ const utilities_clip = (clip);

;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/scroll.js







function scroll_scroll(viewport, options) {
    const enabledElement = (0,getEnabledElement/* default */.Ay)(viewport.element);
    if (!enabledElement) {
        throw new Error('Scroll::Viewport is not enabled (it might be disabled)');
    }
    if (viewport instanceof RenderingEngine/* StackViewport */.hS &&
        viewport.getImageIds().length === 0) {
        throw new Error('Scroll::Stack Viewport has no images');
    }
    const { volumeId, delta, scrollSlabs } = options;
    if (viewport instanceof RenderingEngine/* VolumeViewport */.PX) {
        scrollVolume(viewport, volumeId, delta, scrollSlabs);
    }
    else {
        const imageIdIndex = viewport.getCurrentImageIdIndex();
        if (imageIdIndex + delta >
            viewport.getImageIds().length - 1 ||
            imageIdIndex + delta < 0) {
            const eventData = {
                imageIdIndex,
                direction: delta,
            };
            (0,triggerEvent/* default */.A)(eventTarget/* default */.A, enums.Events.STACK_SCROLL_OUT_OF_BOUNDS, eventData);
        }
        viewport.scroll(delta, options.debounceLoading, options.loop);
    }
}
function scrollVolume(viewport, volumeId, delta, scrollSlabs = false) {
    const useSlabThickness = scrollSlabs;
    const { numScrollSteps, currentStepIndex, sliceRangeInfo } = (0,getVolumeViewportScrollInfo/* default */.A)(viewport, volumeId, useSlabThickness);
    if (!sliceRangeInfo) {
        return;
    }
    const { sliceRange, spacingInNormalDirection, camera } = sliceRangeInfo;
    const { focalPoint, viewPlaneNormal, position } = camera;
    const { newFocalPoint, newPosition } = (0,snapFocalPointToSlice/* default */.A)(focalPoint, position, sliceRange, viewPlaneNormal, spacingInNormalDirection, delta);
    viewport.setCamera({
        focalPoint: newFocalPoint,
        position: newPosition,
    });
    viewport.render();
    const desiredStepIndex = currentStepIndex + delta;
    const VolumeScrollEventDetail = {
        volumeId,
        viewport,
        delta,
        desiredStepIndex,
        currentStepIndex,
        numScrollSteps,
        currentImageId: viewport.getCurrentImageId(),
    };
    if ((desiredStepIndex > numScrollSteps || desiredStepIndex < 0) &&
        viewport.getCurrentImageId()) {
        (0,triggerEvent/* default */.A)(eventTarget/* default */.A, enums.Events.VOLUME_VIEWPORT_SCROLL_OUT_OF_BOUNDS, VolumeScrollEventDetail);
    }
    else {
        (0,triggerEvent/* default */.A)(eventTarget/* default */.A, enums.Events.VOLUME_VIEWPORT_SCROLL, VolumeScrollEventDetail);
    }
}

;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/jumpToSlice.js




async function jumpToSlice(element, options = {}) {
    const { imageIndex, debounceLoading, volumeId } = options;
    const enabledElement = (0,getEnabledElement/* default */.Ay)(element);
    if (!enabledElement) {
        throw new Error('Element has been disabled');
    }
    const { viewport } = enabledElement;
    const { imageIndex: currentImageIndex, numberOfSlices } = _getImageSliceData(viewport, debounceLoading);
    const imageIndexToJump = _getImageIndexToJump(numberOfSlices, imageIndex);
    const delta = imageIndexToJump - currentImageIndex;
    scroll_scroll(viewport, { delta, debounceLoading, volumeId });
}
function _getImageSliceData(viewport, debounceLoading) {
    if (viewport instanceof StackViewport/* default */.A) {
        return {
            numberOfSlices: viewport.getImageIds().length,
            imageIndex: debounceLoading
                ? viewport.getTargetImageIdIndex()
                : viewport.getCurrentImageIdIndex(),
        };
    }
    return {
        numberOfSlices: viewport.getNumberOfSlices(),
        imageIndex: viewport.getSliceIndex(),
    };
}
function _getImageIndexToJump(numberOfSlices, imageIndex) {
    const lastSliceIndex = numberOfSlices - 1;
    return utilities_clip(imageIndex, 0, lastSliceIndex);
}


;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/createSubVolume.js





function createSubVolume(referencedVolumeId, boundsIJK, options = {}) {
    const referencedVolume = cache/* default */.Ay.getVolume(referencedVolumeId);
    if (!referencedVolume) {
        throw new Error(`Referenced volume with id ${referencedVolumeId} does not exist.`);
    }
    const { metadata, spacing, direction, dimensions: refVolumeDim, } = referencedVolume;
    const { minX, maxX, minY, maxY, minZ, maxZ } = boundsIJK;
    const ijkTopLeft = [
        Math.min(minX, maxX),
        Math.min(minY, maxY),
        Math.min(minZ, maxZ),
    ];
    const boundingBoxOriginWorld = (0,transformIndexToWorld/* default */.A)(referencedVolume.imageData, ijkTopLeft);
    const dimensions = [
        Math.abs(maxX - minX) + 1,
        Math.abs(maxY - minY) + 1,
        Math.abs(maxZ - minZ) + 1,
    ];
    const { targetBuffer } = options;
    const subVolumeOptions = {
        metadata,
        dimensions,
        spacing,
        origin: boundingBoxOriginWorld,
        direction,
        targetBuffer,
        scalarData: targetBuffer?.type === 'Float32Array'
            ? new Float32Array(dimensions[0] * dimensions[1] * dimensions[2])
            : undefined,
    };
    const subVolume = (0,volumeLoader.createLocalVolume)((0,uuidv4/* default */.A)(), subVolumeOptions);
    const subVolumeData = subVolume.voxelManager.getCompleteScalarDataArray();
    const subVolumeSliceSize = dimensions[0] * dimensions[1];
    const refVolumeSliceSize = refVolumeDim[0] * refVolumeDim[1];
    const refVolumeData = referencedVolume.voxelManager.getCompleteScalarDataArray();
    for (let z = 0; z < dimensions[2]; z++) {
        for (let y = 0; y < dimensions[1]; y++) {
            const rowStartWorld = (0,transformIndexToWorld/* default */.A)(subVolume.imageData, [
                0,
                y,
                z,
            ]);
            const refVolumeRowStartIJK = (0,transformWorldToIndex/* default */.A)(referencedVolume.imageData, rowStartWorld);
            const refVolumeRowStartOffset = refVolumeRowStartIJK[2] * refVolumeSliceSize +
                refVolumeRowStartIJK[1] * refVolumeDim[0] +
                refVolumeRowStartIJK[0];
            const rowData = refVolumeData.slice(refVolumeRowStartOffset, refVolumeRowStartOffset + dimensions[0]);
            const subVolumeLineStartOffset = z * subVolumeSliceSize + y * dimensions[0];
            subVolumeData.set(rowData, subVolumeLineStartOffset);
        }
    }
    subVolume.voxelManager.setCompleteScalarDataArray(subVolumeData);
    return subVolume;
}


;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getVolumeDirectionVectors.js


function getVolumeDirectionVectors(imageData, camera) {
    const { viewUp, viewPlaneNormal } = camera;
    const ijkOrigin = (0,transformWorldToIndex/* transformWorldToIndexContinuous */.p)(imageData, [0, 0, 0]);
    const worldVecColDir = esm/* vec3.negate */.eR.negate(esm/* vec3.create */.eR.create(), viewUp);
    const worldVecSliceDir = esm/* vec3.negate */.eR.negate(esm/* vec3.create */.eR.create(), viewPlaneNormal);
    const worldVecRowDir = esm/* vec3.cross */.eR.cross(esm/* vec3.create */.eR.create(), worldVecColDir, worldVecSliceDir);
    const ijkVecColDir = esm/* vec3.sub */.eR.sub(esm/* vec3.create */.eR.create(), (0,transformWorldToIndex/* transformWorldToIndexContinuous */.p)(imageData, worldVecColDir), ijkOrigin);
    const ijkVecSliceDir = esm/* vec3.sub */.eR.sub(esm/* vec3.create */.eR.create(), (0,transformWorldToIndex/* transformWorldToIndexContinuous */.p)(imageData, worldVecSliceDir), ijkOrigin);
    esm/* vec3.normalize */.eR.normalize(ijkVecColDir, ijkVecColDir);
    esm/* vec3.normalize */.eR.normalize(ijkVecSliceDir, ijkVecSliceDir);
    const ijkVecRowDir = esm/* vec3.cross */.eR.cross(esm/* vec3.create */.eR.create(), ijkVecColDir, ijkVecSliceDir);
    return {
        worldVecRowDir,
        worldVecColDir,
        worldVecSliceDir,
        ijkVecRowDir,
        ijkVecColDir,
        ijkVecSliceDir,
    };
}


// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/calculateSpacingBetweenImageIds.js
var calculateSpacingBetweenImageIds = __webpack_require__(42384);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/logger.js
var logger = __webpack_require__(7608);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/calculateNeighborhoodStats.js
function calculateNeighborhoodStats(scalarData, dimensions, centerIjk, radius) {
    const [width, height, numSlices] = dimensions;
    const numPixelsPerSlice = width * height;
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
                const index = z * numPixelsPerSlice + y * width + x;
                const value = scalarData[index];
                sum += value;
                sumSq += value * value;
                count++;
            }
        }
    }
    if (count === 0) {
        const centerIndex = cz * numPixelsPerSlice + cy * width + cx;
        if (centerIndex >= 0 && centerIndex < scalarData.length) {
            const centerValue = scalarData[centerIndex];
            return { mean: centerValue, stdDev: 0, count: 1 };
        }
        else {
            return { mean: 0, stdDev: 0, count: 0 };
        }
    }
    const mean = sum / count;
    const variance = sumSq / count - mean * mean;
    const stdDev = Math.sqrt(Math.max(0, variance));
    return { mean, stdDev, count };
}

;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getPixelSpacingInformation.js


const projectionRadiographSOPClassUIDs = new Set([
    '1.2.840.10008.5.1.4.1.1.1',
    '1.2.840.10008.5.1.4.1.1.1.1',
    '1.2.840.10008.5.1.4.1.1.1.1.1',
    '1.2.840.10008.5.1.4.1.1.1.2',
    '1.2.840.10008.5.1.4.1.1.1.2.1',
    '1.2.840.10008.5.1.4.1.1.1.3',
    '1.2.840.10008.5.1.4.1.1.1.3.1',
    '1.2.840.10008.5.1.4.1.1.12.1',
    '1.2.840.10008.5.1.4.1.1.12.1.1',
    '1.2.840.10008.5.1.4.1.1.12.2',
    '1.2.840.10008.5.1.4.1.1.12.2.1',
    '1.2.840.10008.5.1.4.1.1.12.3',
]);
function calculateRadiographicPixelSpacing(instance) {
    const { PixelSpacing, ImagerPixelSpacing, EstimatedRadiographicMagnificationFactor, PixelSpacingCalibrationType, PixelSpacingCalibrationDescription, } = instance;
    const isProjection = true;
    if (!ImagerPixelSpacing) {
        return {
            PixelSpacing,
            type: enums.CalibrationTypes.UNKNOWN,
            isProjection,
        };
    }
    if (!PixelSpacing) {
        if (!EstimatedRadiographicMagnificationFactor) {
            console.warn('EstimatedRadiographicMagnificationFactor was not present. Unable to correct ImagerPixelSpacing.');
            return {
                PixelSpacing: ImagerPixelSpacing,
                type: enums.CalibrationTypes.PROJECTION,
                isProjection,
            };
        }
        const correctedPixelSpacing = ImagerPixelSpacing.map((pixelSpacing) => pixelSpacing / EstimatedRadiographicMagnificationFactor);
        return {
            PixelSpacing: correctedPixelSpacing,
            type: enums.CalibrationTypes.ERMF,
            isProjection,
        };
    }
    if ((0,isEqual/* isEqual */.n4)(PixelSpacing, ImagerPixelSpacing)) {
        return {
            PixelSpacing,
            type: enums.CalibrationTypes.PROJECTION,
            isProjection,
        };
    }
    if (PixelSpacingCalibrationType || PixelSpacingCalibrationDescription) {
        return {
            PixelSpacing,
            type: enums.CalibrationTypes.CALIBRATED,
            isProjection,
            PixelSpacingCalibrationType,
            PixelSpacingCalibrationDescription,
        };
    }
    return {
        PixelSpacing,
        type: enums.CalibrationTypes.UNKNOWN,
        isProjection,
    };
}
function calculateUSPixelSpacing(instance) {
    const { SequenceOfUltrasoundRegions } = instance;
    const isArrayOfSequences = Array.isArray(SequenceOfUltrasoundRegions);
    if (isArrayOfSequences && SequenceOfUltrasoundRegions.length > 1) {
        console.warn('Sequence of Ultrasound Regions > one entry. This is not yet implemented, all measurements will be shown in pixels.');
        return;
    }
    const { PhysicalDeltaX, PhysicalDeltaY } = isArrayOfSequences
        ? SequenceOfUltrasoundRegions[0]
        : SequenceOfUltrasoundRegions;
    const USPixelSpacing = [
        Math.abs(PhysicalDeltaX) * 10,
        Math.abs(PhysicalDeltaY) * 10,
    ];
    return {
        PixelSpacing: USPixelSpacing,
    };
}
function getPixelSpacingInformation(instance) {
    const { PixelSpacing, SOPClassUID, SequenceOfUltrasoundRegions } = instance;
    if (SequenceOfUltrasoundRegions) {
        return calculateUSPixelSpacing(instance);
    }
    const isProjection = projectionRadiographSOPClassUIDs.has(SOPClassUID);
    if (isProjection) {
        return calculateRadiographicPixelSpacing(instance);
    }
    return {
        PixelSpacing,
        type: enums.CalibrationTypes.NOT_APPLICABLE,
        isProjection: false,
    };
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/updatePlaneRestriction.js
var updatePlaneRestriction = __webpack_require__(41365);
;// ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/index.js


































































































const getViewportModality = (viewport, volumeId) => _getViewportModality(viewport, volumeId, cache/* default */.Ay.getVolume);




/***/ }),

/***/ 50134:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ invertRgbTransferFunction)
/* harmony export */ });
function invertRgbTransferFunction(rgbTransferFunction) {
    if (!rgbTransferFunction) {
        return;
    }
    const size = rgbTransferFunction.getSize();
    for (let index = 0; index < size; index++) {
        const nodeValue1 = [];
        rgbTransferFunction.getNodeValue(index, nodeValue1);
        nodeValue1[1] = 1 - nodeValue1[1];
        nodeValue1[2] = 1 - nodeValue1[2];
        nodeValue1[3] = 1 - nodeValue1[3];
        rgbTransferFunction.setNodeValue(index, nodeValue1);
    }
}


/***/ }),

/***/ 74638:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ay: () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   Et: () => (/* binding */ isNumber),
/* harmony export */   Ph: () => (/* binding */ isEqualAbs),
/* harmony export */   WC: () => (/* binding */ isEqualNegative),
/* harmony export */   n4: () => (/* binding */ isEqual)
/* harmony export */ });
function areNumbersEqualWithTolerance(num1, num2, tolerance) {
    return Math.abs(num1 - num2) <= tolerance;
}
function areArraysEqual(arr1, arr2, tolerance = 1e-5) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (!areNumbersEqualWithTolerance(arr1[i], arr2[i], tolerance)) {
            return false;
        }
    }
    return true;
}
function isNumberType(value) {
    return typeof value === 'number';
}
function isNumberArrayLike(value) {
    return (value &&
        typeof value === 'object' &&
        'length' in value &&
        typeof value.length === 'number' &&
        value.length > 0 &&
        typeof value[0] === 'number');
}
function isEqual(v1, v2, tolerance = 1e-5) {
    if (typeof v1 !== typeof v2 || v1 === null || v2 === null) {
        return false;
    }
    if (isNumberType(v1) && isNumberType(v2)) {
        return areNumbersEqualWithTolerance(v1, v2, tolerance);
    }
    if (isNumberArrayLike(v1) && isNumberArrayLike(v2)) {
        return areArraysEqual(v1, v2, tolerance);
    }
    return false;
}
const negative = (v) => typeof v === 'number' ? -v : v?.map ? v.map(negative) : !v;
const abs = (v) => typeof v === 'number' ? Math.abs(v) : v?.map ? v.map(abs) : v;
const isEqualNegative = (v1, v2, tolerance = undefined) => isEqual(v1, negative(v2), tolerance);
const isEqualAbs = (v1, v2, tolerance = undefined) => isEqual(abs(v1), abs(v2), tolerance);
function isNumber(n) {
    if (Array.isArray(n)) {
        return isNumber(n[0]);
    }
    return isFinite(n) && !isNaN(n);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isEqual);


/***/ }),

/***/ 7608:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   aiLog: () => (/* binding */ aiLog),
/* harmony export */   coreLog: () => (/* binding */ coreLog),
/* harmony export */   cs3dLog: () => (/* binding */ cs3dLog),
/* harmony export */   dicomConsistencyLog: () => (/* binding */ dicomConsistencyLog),
/* harmony export */   examplesLog: () => (/* binding */ examplesLog),
/* harmony export */   getLogger: () => (/* binding */ getLogger),
/* harmony export */   getRootLogger: () => (/* binding */ getRootLogger),
/* harmony export */   imageConsistencyLog: () => (/* binding */ imageConsistencyLog),
/* harmony export */   loaderLog: () => (/* binding */ loaderLog),
/* harmony export */   toolsLog: () => (/* binding */ toolsLog)
/* harmony export */ });
/* harmony import */ var loglevel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4367);
/* harmony import */ var loglevel__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(loglevel__WEBPACK_IMPORTED_MODULE_0__);

const loglevel = loglevel__WEBPACK_IMPORTED_MODULE_0___default().noConflict();
if (typeof window !== 'undefined') {
    window.log = loglevel;
}
function getRootLogger(name) {
    const logger = loglevel.getLogger(name[0]);
    logger.getLogger = (...names) => {
        return getRootLogger(`${name}.${names.join('.')}`);
    };
    return logger;
}
function getLogger(...name) {
    return getRootLogger(name.join('.'));
}
const cs3dLog = getRootLogger('cs3d');
const coreLog = cs3dLog.getLogger('core');
const toolsLog = cs3dLog.getLogger('tools');
const loaderLog = cs3dLog.getLogger('dicomImageLoader');
const aiLog = cs3dLog.getLogger('ai');
const examplesLog = cs3dLog.getLogger('examples');
const dicomConsistencyLog = getLogger('consistency', 'dicom');
const imageConsistencyLog = getLogger('consistency', 'image');


/***/ }),

/***/ 1865:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ makeVolumeMetadata)
/* harmony export */ });
/* harmony import */ var _metaData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(74876);

function makeVolumeMetadata(imageIds) {
    const imageId0 = imageIds[0];
    const { pixelRepresentation, bitsAllocated, bitsStored, highBit, photometricInterpretation, samplesPerPixel, } = (0,_metaData__WEBPACK_IMPORTED_MODULE_0__.get)('imagePixelModule', imageId0);
    const voiLut = [];
    const voiLutModule = (0,_metaData__WEBPACK_IMPORTED_MODULE_0__.get)('voiLutModule', imageId0);
    let voiLUTFunction;
    if (voiLutModule) {
        const { windowWidth, windowCenter } = voiLutModule;
        voiLUTFunction = voiLutModule?.voiLUTFunction;
        if (Array.isArray(windowWidth)) {
            for (let i = 0; i < windowWidth.length; i++) {
                voiLut.push({
                    windowWidth: windowWidth[i],
                    windowCenter: windowCenter[i],
                });
            }
        }
        else {
            voiLut.push({
                windowWidth: windowWidth,
                windowCenter: windowCenter,
            });
        }
    }
    else {
        voiLut.push({
            windowWidth: undefined,
            windowCenter: undefined,
        });
    }
    const { modality, seriesInstanceUID } = (0,_metaData__WEBPACK_IMPORTED_MODULE_0__.get)('generalSeriesModule', imageId0);
    const { imageOrientationPatient, pixelSpacing, frameOfReferenceUID, columns, rows, } = (0,_metaData__WEBPACK_IMPORTED_MODULE_0__.get)('imagePlaneModule', imageId0);
    return {
        BitsAllocated: bitsAllocated,
        BitsStored: bitsStored,
        SamplesPerPixel: samplesPerPixel,
        HighBit: highBit,
        PhotometricInterpretation: photometricInterpretation,
        PixelRepresentation: pixelRepresentation,
        Modality: modality,
        ImageOrientationPatient: imageOrientationPatient,
        PixelSpacing: pixelSpacing,
        FrameOfReferenceUID: frameOfReferenceUID,
        Columns: columns,
        Rows: rows,
        voiLut,
        VOILUTFunction: voiLUTFunction,
        SeriesInstanceUID: seriesInstanceUID,
    };
}


/***/ }),

/***/ 52268:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isPointOnPlane: () => (/* binding */ isPointOnPlane),
/* harmony export */   linePlaneIntersection: () => (/* binding */ linePlaneIntersection),
/* harmony export */   planeDistanceToPoint: () => (/* binding */ planeDistanceToPoint),
/* harmony export */   planeEquation: () => (/* binding */ planeEquation),
/* harmony export */   threePlaneIntersection: () => (/* binding */ threePlaneIntersection)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(76491);


function linePlaneIntersection(p0, p1, plane) {
    const [x0, y0, z0] = p0;
    const [x1, y1, z1] = p1;
    const [A, B, C, D] = plane;
    const a = x1 - x0;
    const b = y1 - y0;
    const c = z1 - z0;
    const t = (-1 * (A * x0 + B * y0 + C * z0 - D)) / (A * a + B * b + C * c);
    const X = a * t + x0;
    const Y = b * t + y0;
    const Z = c * t + z0;
    return [X, Y, Z];
}
function planeEquation(normal, point, normalized = false) {
    const [A, B, C] = normal;
    const D = A * point[0] + B * point[1] + C * point[2];
    if (normalized) {
        const length = Math.sqrt(A * A + B * B + C * C);
        return [A / length, B / length, C / length, D / length];
    }
    return [A, B, C, D];
}
function threePlaneIntersection(firstPlane, secondPlane, thirdPlane) {
    const [A1, B1, C1, D1] = firstPlane;
    const [A2, B2, C2, D2] = secondPlane;
    const [A3, B3, C3, D3] = thirdPlane;
    const m0 = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .mat3.fromValues */ .w0.fromValues(A1, A2, A3, B1, B2, B3, C1, C2, C3);
    const m1 = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .mat3.fromValues */ .w0.fromValues(D1, D2, D3, B1, B2, B3, C1, C2, C3);
    const m2 = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .mat3.fromValues */ .w0.fromValues(A1, A2, A3, D1, D2, D3, C1, C2, C3);
    const m3 = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .mat3.fromValues */ .w0.fromValues(A1, A2, A3, B1, B2, B3, D1, D2, D3);
    const x = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .mat3.determinant */ .w0.determinant(m1) / gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .mat3.determinant */ .w0.determinant(m0);
    const y = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .mat3.determinant */ .w0.determinant(m2) / gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .mat3.determinant */ .w0.determinant(m0);
    const z = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .mat3.determinant */ .w0.determinant(m3) / gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .mat3.determinant */ .w0.determinant(m0);
    return [x, y, z];
}
function planeDistanceToPoint(plane, point, signed = false) {
    const [A, B, C, D] = plane;
    const [x, y, z] = point;
    const numerator = A * x + B * y + C * z - D;
    const distance = Math.abs(numerator) / Math.sqrt(A * A + B * B + C * C);
    const sign = signed ? Math.sign(numerator) : 1;
    return sign * distance;
}
function isPointOnPlane(point, plane, tolerance = _constants__WEBPACK_IMPORTED_MODULE_1__.EPSILON) {
    return planeDistanceToPoint(plane, point) < tolerance;
}



/***/ }),

/***/ 56577:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   X6: () => (/* binding */ iterateOverPointsInShapeVoxelManager),
/* harmony export */   ii: () => (/* binding */ pointInShapeCallback)
/* harmony export */ });
/* unused harmony export iterateOverPointsInShape */
/* harmony import */ var _createPositionCallback__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(87784);

function pointInShapeCallback(imageData, options) {
    const { pointInShapeFn, callback, boundsIJK, returnPoints = false } = options;
    let scalarData;
    if (imageData.getScalarData) {
        scalarData = imageData.getScalarData();
    }
    else {
        const scalars = imageData.getPointData().getScalars();
        if (scalars) {
            scalarData = scalars.getData();
        }
        else {
            const { voxelManager } = imageData.get('voxelManager') || {};
            if (voxelManager) {
                scalarData = voxelManager.getCompleteScalarDataArray();
            }
        }
    }
    const dimensions = imageData.getDimensions();
    const defaultBoundsIJK = [
        [0, dimensions[0]],
        [0, dimensions[1]],
        [0, dimensions[2]],
    ];
    const bounds = boundsIJK || defaultBoundsIJK;
    const pointsInShape = iterateOverPointsInShape({
        imageData,
        bounds,
        scalarData,
        pointInShapeFn,
        callback,
    });
    return returnPoints ? pointsInShape : undefined;
}
function iterateOverPointsInShape({ imageData, bounds, scalarData, pointInShapeFn, callback, }) {
    const [[iMin, iMax], [jMin, jMax], [kMin, kMax]] = bounds;
    const { numComps } = imageData;
    const dimensions = imageData.getDimensions();
    const indexToWorld = (0,_createPositionCallback__WEBPACK_IMPORTED_MODULE_0__/* .createPositionCallback */ .P)(imageData);
    const pointIJK = [0, 0, 0];
    const xMultiple = numComps ||
        scalarData.length / dimensions[2] / dimensions[1] / dimensions[0];
    const yMultiple = dimensions[0] * xMultiple;
    const zMultiple = dimensions[1] * yMultiple;
    const pointsInShape = [];
    for (let k = kMin; k <= kMax; k++) {
        pointIJK[2] = k;
        const indexK = k * zMultiple;
        for (let j = jMin; j <= jMax; j++) {
            pointIJK[1] = j;
            const indexJK = indexK + j * yMultiple;
            for (let i = iMin; i <= iMax; i++) {
                pointIJK[0] = i;
                const pointLPS = indexToWorld(pointIJK);
                if (pointInShapeFn(pointLPS, pointIJK)) {
                    const index = indexJK + i * xMultiple;
                    let value;
                    if (xMultiple > 2) {
                        value = [
                            scalarData[index],
                            scalarData[index + 1],
                            scalarData[index + 2],
                        ];
                    }
                    else {
                        value = scalarData[index];
                    }
                    pointsInShape.push({
                        value,
                        index,
                        pointIJK,
                        pointLPS: pointLPS.slice(),
                    });
                    callback({ value, index, pointIJK, pointLPS });
                }
            }
        }
    }
    return pointsInShape;
}
function iterateOverPointsInShapeVoxelManager({ voxelManager, bounds, imageData, pointInShapeFn, callback, returnPoints, }) {
    const [[iMin, iMax], [jMin, jMax], [kMin, kMax]] = bounds;
    const indexToWorld = (0,_createPositionCallback__WEBPACK_IMPORTED_MODULE_0__/* .createPositionCallback */ .P)(imageData);
    const pointIJK = [0, 0, 0];
    const pointsInShape = [];
    for (let k = kMin; k <= kMax; k++) {
        pointIJK[2] = k;
        for (let j = jMin; j <= jMax; j++) {
            pointIJK[1] = j;
            for (let i = iMin; i <= iMax; i++) {
                pointIJK[0] = i;
                const pointLPS = indexToWorld(pointIJK);
                if (pointInShapeFn(pointLPS, pointIJK)) {
                    const index = voxelManager.toIndex(pointIJK);
                    const value = voxelManager.getAtIndex(index);
                    if (returnPoints) {
                        pointsInShape.push({
                            value,
                            index,
                            pointIJK: [...pointIJK],
                            pointLPS: pointLPS.slice(),
                        });
                    }
                    callback?.({ value, index, pointIJK, pointLPS });
                }
            }
        }
    }
    return pointsInShape;
}


/***/ }),

/***/ 80500:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ snapFocalPointToSlice)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);

function snapFocalPointToSlice(focalPoint, position, sliceRange, viewPlaneNormal, spacingInNormalDirection, deltaFrames) {
    const { min, max, current } = sliceRange;
    const posDiffFromFocalPoint = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.sub */ .eR.sub(posDiffFromFocalPoint, position, focalPoint);
    const steps = Math.round((max - min) / spacingInNormalDirection);
    const fraction = (current - min) / (max - min);
    const floatingStepNumber = fraction * steps;
    let frameIndex = Math.round(floatingStepNumber);
    let newFocalPoint = [
        focalPoint[0] -
            viewPlaneNormal[0] * floatingStepNumber * spacingInNormalDirection,
        focalPoint[1] -
            viewPlaneNormal[1] * floatingStepNumber * spacingInNormalDirection,
        focalPoint[2] -
            viewPlaneNormal[2] * floatingStepNumber * spacingInNormalDirection,
    ];
    frameIndex += deltaFrames;
    if (frameIndex > steps) {
        frameIndex = steps;
    }
    else if (frameIndex < 0) {
        frameIndex = 0;
    }
    const newSlicePosFromMin = frameIndex * spacingInNormalDirection;
    newFocalPoint = [
        newFocalPoint[0] + viewPlaneNormal[0] * newSlicePosFromMin,
        newFocalPoint[1] + viewPlaneNormal[1] * newSlicePosFromMin,
        newFocalPoint[2] + viewPlaneNormal[2] * newSlicePosFromMin,
    ];
    const newPosition = [
        newFocalPoint[0] + posDiffFromFocalPoint[0],
        newFocalPoint[1] + posDiffFromFocalPoint[1],
        newFocalPoint[2] + posDiffFromFocalPoint[2],
    ];
    return { newFocalPoint, newPosition };
}


/***/ }),

/***/ 90537:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ sortImageIdsAndGetSpacing)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);
/* harmony import */ var _metaData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(74876);
/* harmony import */ var _calculateSpacingBetweenImageIds__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(42384);



function sortImageIdsAndGetSpacing(imageIds, scanAxisNormal) {
    const { imagePositionPatient: referenceImagePositionPatient, imageOrientationPatient, } = _metaData__WEBPACK_IMPORTED_MODULE_1__.get('imagePlaneModule', imageIds[0]);
    if (!scanAxisNormal) {
        const rowCosineVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(imageOrientationPatient[0], imageOrientationPatient[1], imageOrientationPatient[2]);
        const colCosineVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(imageOrientationPatient[3], imageOrientationPatient[4], imageOrientationPatient[5]);
        scanAxisNormal = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.cross */ .eR.cross(scanAxisNormal, rowCosineVec, colCosineVec);
    }
    const usingWadoUri = imageIds[0].split(':')[0] === 'wadouri';
    const zSpacing = (0,_calculateSpacingBetweenImageIds__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)(imageIds);
    let sortedImageIds;
    function getDistance(imageId) {
        const { imagePositionPatient } = _metaData__WEBPACK_IMPORTED_MODULE_1__.get('imagePlaneModule', imageId);
        const positionVector = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.sub */ .eR.sub(positionVector, referenceImagePositionPatient, imagePositionPatient);
        return gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(positionVector, scanAxisNormal);
    }
    if (!usingWadoUri) {
        const distanceImagePairs = imageIds.map((imageId) => {
            const distance = getDistance(imageId);
            return {
                distance,
                imageId,
            };
        });
        distanceImagePairs.sort((a, b) => b.distance - a.distance);
        sortedImageIds = distanceImagePairs.map((a) => a.imageId);
    }
    else {
        const prefetchedImageIds = [
            imageIds[0],
            imageIds[Math.floor(imageIds.length / 2)],
        ];
        sortedImageIds = imageIds;
        const firstImageDistance = getDistance(prefetchedImageIds[0]);
        const middleImageDistance = getDistance(prefetchedImageIds[1]);
        if (firstImageDistance - middleImageDistance < 0) {
            sortedImageIds.reverse();
        }
    }
    const { imagePositionPatient: origin } = _metaData__WEBPACK_IMPORTED_MODULE_1__.get('imagePlaneModule', sortedImageIds[0]);
    const result = {
        zSpacing,
        origin,
        sortedImageIds,
    };
    return result;
}


/***/ }),

/***/ 8126:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getTransferFunctionNodes: () => (/* binding */ getTransferFunctionNodes),
/* harmony export */   setTransferFunctionNodes: () => (/* binding */ setTransferFunctionNodes)
/* harmony export */ });
function getTransferFunctionNodes(transferFunction) {
    const size = transferFunction.getSize();
    const values = [];
    for (let index = 0; index < size; index++) {
        const nodeValue1 = [];
        transferFunction.getNodeValue(index, nodeValue1);
        values.push(nodeValue1);
    }
    return values;
}
function setTransferFunctionNodes(transferFunction, nodes) {
    if (!nodes?.length) {
        return;
    }
    transferFunction.removeAllPoints();
    nodes.forEach((node) => {
        transferFunction.addRGBPoint(...node);
    });
}



/***/ }),

/***/ 51919:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   e: () => (/* binding */ transformCanvasToIJK)
/* harmony export */ });
/* harmony import */ var _transformWorldToIndex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(38669);

function transformCanvasToIJK(viewport, canvasPoint) {
    const { imageData: vtkImageData } = viewport.getImageData();
    const worldPoint = viewport.canvasToWorld(canvasPoint);
    return (0,_transformWorldToIndex__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(vtkImageData, worldPoint);
}


/***/ }),

/***/ 94741:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ transformIndexToWorld)
/* harmony export */ });
function transformIndexToWorld(imageData, voxelPos) {
    return imageData.indexToWorld(voxelPos);
}


/***/ }),

/***/ 38669:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ transformWorldToIndex),
/* harmony export */   p: () => (/* binding */ transformWorldToIndexContinuous)
/* harmony export */ });
function transformWorldToIndex(imageData, worldPos) {
    const continuousIndex = imageData.worldToIndex(worldPos);
    const index = continuousIndex.map(Math.round);
    return index;
}
function transformWorldToIndexContinuous(imageData, worldPos) {
    return imageData.worldToIndex(worldPos);
}


/***/ }),

/***/ 41365:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   O: () => (/* binding */ updatePlaneRestriction)
/* harmony export */ });
/* harmony import */ var _utilities_isEqual__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(74638);
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3823);


const ORTHOGONAL_TEST_VALUE = 0.95;
function updatePlaneRestriction(points, reference) {
    if (!points?.length || !reference.FrameOfReferenceUID) {
        return;
    }
    reference.planeRestriction ||= {
        FrameOfReferenceUID: reference.FrameOfReferenceUID,
        point: points[0],
        inPlaneVector1: null,
        inPlaneVector2: null,
    };
    const { planeRestriction } = reference;
    if (points.length === 1) {
        planeRestriction.inPlaneVector1 = null;
        planeRestriction.inPlaneVector2 = null;
        return planeRestriction;
    }
    const v1 = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.sub */ .eR.sub(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.create */ .eR.create(), points[0], points[Math.floor(points.length / 2)]);
    gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.normalize */ .eR.normalize(v1, v1);
    planeRestriction.inPlaneVector1 = v1;
    planeRestriction.inPlaneVector2 = null;
    const n = points.length;
    if (n > 2) {
        for (let i = Math.floor(n / 3); i < n; i++) {
            const testVector = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.sub */ .eR.sub(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.create */ .eR.create(), points[i], points[0]);
            const length = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.length */ .eR.length(testVector);
            if ((0,_utilities_isEqual__WEBPACK_IMPORTED_MODULE_0__/* .isEqual */ .n4)(length, 0)) {
                continue;
            }
            if (gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.dot */ .eR.dot(testVector, planeRestriction.inPlaneVector1) <
                length * ORTHOGONAL_TEST_VALUE) {
                gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.normalize */ .eR.normalize(testVector, testVector);
                planeRestriction.inPlaneVector2 = testVector;
                return planeRestriction;
            }
        }
    }
    return planeRestriction;
}


/***/ }),

/***/ 45278:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   J: () => (/* binding */ updateVTKImageDataWithCornerstoneImage)
/* harmony export */ });
function updateVTKImageDataWithCornerstoneImage(sourceImageData, image) {
    const pixelData = image.voxelManager.getScalarData();
    if (!sourceImageData.getPointData) {
        return;
    }
    const scalarData = sourceImageData
        .getPointData()
        .getScalars()
        .getData();
    if (image.color && image.rgba) {
        const newPixelData = new Uint8Array(image.columns * image.rows * 3);
        for (let i = 0; i < image.columns * image.rows; i++) {
            newPixelData[i * 3] = pixelData[i * 4];
            newPixelData[i * 3 + 1] = pixelData[i * 4 + 1];
            newPixelData[i * 3 + 2] = pixelData[i * 4 + 2];
        }
        image.rgba = false;
        image.getPixelData = () => newPixelData;
        scalarData.set(newPixelData);
    }
    else {
        scalarData.set(pixelData);
    }
    sourceImageData.modified();
}



/***/ }),

/***/ 68136:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toLowHighRange: () => (/* binding */ toLowHighRange),
/* harmony export */   toWindowLevel: () => (/* binding */ toWindowLevel)
/* harmony export */ });
/* harmony import */ var _enums_VOILUTFunctionType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(82501);
/* harmony import */ var _logit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(58977);


function toWindowLevel(low, high) {
    const windowWidth = Math.abs(high - low) + 1;
    const windowCenter = (low + high + 1) / 2;
    return { windowWidth, windowCenter };
}
function toLowHighRange(windowWidth, windowCenter, voiLUTFunction = _enums_VOILUTFunctionType__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.LINEAR) {
    if (voiLUTFunction === _enums_VOILUTFunctionType__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.LINEAR ||
        voiLUTFunction === _enums_VOILUTFunctionType__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.SAMPLED_SIGMOID) {
        return {
            lower: windowCenter - 0.5 - (windowWidth - 1) / 2,
            upper: windowCenter - 0.5 + (windowWidth - 1) / 2,
        };
    }
    else if (voiLUTFunction === _enums_VOILUTFunctionType__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.LINEAR_EXACT) {
        return {
            lower: windowCenter - windowWidth / 2,
            upper: windowCenter + windowWidth / 2,
        };
    }
    else {
        throw new Error('Invalid VOI LUT function');
    }
}



/***/ }),

/***/ 93952:
/***/ (() => {

const CORNERSTONE_COLOR_LUT = (/* unused pure expression or super */ null && ([
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
]));
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (CORNERSTONE_COLOR_LUT)));


/***/ }),

/***/ 95074:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

/* harmony import */ var _getHash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(97181);
/* harmony import */ var _setAttributesIfNecessary__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(85899);
/* harmony import */ var _setNewAttributesIfValid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(56442);



function drawEllipseByCoordinates(svgDrawingHelper, annotationUID, ellipseUID, canvasCoordinates, options = {}, dataId = '') {
    const { color, width, lineWidth, lineDash } = Object.assign({
        color: 'rgb(0, 255, 0)',
        width: '2',
        lineWidth: undefined,
        lineDash: undefined,
    }, options);
    const strokeWidth = lineWidth || width;
    const svgns = 'http://www.w3.org/2000/svg';
    const svgNodeHash = _getHash(annotationUID, 'ellipse', ellipseUID);
    const existingEllipse = svgDrawingHelper.getSvgNode(svgNodeHash);
    const [bottom, top, left, right] = canvasCoordinates;
    const w = Math.hypot(left[0] - right[0], left[1] - right[1]);
    const h = Math.hypot(top[0] - bottom[0], top[1] - bottom[1]);
    const angle = (Math.atan2(left[1] - right[1], left[0] - right[0]) * 180) / Math.PI;
    const center = [(left[0] + right[0]) / 2, (top[1] + bottom[1]) / 2];
    const radiusX = w / 2;
    const radiusY = h / 2;
    const attributes = {
        cx: `${center[0]}`,
        cy: `${center[1]}`,
        rx: `${radiusX}`,
        ry: `${radiusY}`,
        stroke: color,
        fill: 'transparent',
        transform: `rotate(${angle} ${center[0]} ${center[1]})`,
        'stroke-width': strokeWidth,
        'stroke-dasharray': lineDash,
    };
    if (existingEllipse) {
        setAttributesIfNecessary(attributes, existingEllipse);
        svgDrawingHelper.setNodeTouched(svgNodeHash);
    }
    else {
        const svgEllipseElement = document.createElementNS(svgns, 'ellipse');
        if (dataId !== '') {
            svgEllipseElement.setAttribute('data-id', dataId);
        }
        setNewAttributesIfValid(attributes, svgEllipseElement);
        svgDrawingHelper.appendNode(svgEllipseElement, svgNodeHash);
    }
}
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (drawEllipseByCoordinates)));


/***/ }),

/***/ 74347:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  draw: () => (/* reexport */ draw/* default */.A),
  drawCircle: () => (/* reexport */ drawCircle/* default */.A),
  drawHandles: () => (/* reexport */ drawHandles/* default */.A),
  drawLine: () => (/* reexport */ drawingSvg_drawLine/* default */.A),
  drawLinkedTextBox: () => (/* reexport */ drawLinkedTextBox/* default */.A),
  drawPath: () => (/* reexport */ drawPath/* default */.A),
  drawPolyline: () => (/* reexport */ drawPolyline/* default */.A),
  drawRect: () => (/* reexport */ drawRect/* default */.A),
  drawRectByCoordinates: () => (/* reexport */ drawRectByCoordinates/* default */.A)
});

// UNUSED EXPORTS: drawArrow, drawEllipse, drawEllipseByCoordinates, drawFan, drawHandle, drawHeight, drawRedactionRect, drawTextBox, setAttributesIfNecessary, setNewAttributesIfValid

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/draw.js + 1 modules
var draw = __webpack_require__(18262);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawCircle.js
var drawCircle = __webpack_require__(12004);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawEllipse.js
var drawEllipse = __webpack_require__(85856);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawEllipseByCoordinates.js
var drawEllipseByCoordinates = __webpack_require__(95074);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawHandles.js
var drawHandles = __webpack_require__(56745);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawHandle.js
var drawHandle = __webpack_require__(94042);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawLine.js
var drawingSvg_drawLine = __webpack_require__(92118);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawHeight.js

function drawHeight(svgDrawingHelper, annotationUID, heightUID, start, end, options = {}) {
    if (isNaN(start[0]) || isNaN(start[1]) || isNaN(end[0]) || isNaN(end[1])) {
        return;
    }
    const { color, width, lineWidth, lineDash } = Object.assign({
        color: 'rgb(0, 255, 0)',
        width: '2',
        lineWidth: undefined,
        lineDash: undefined,
    }, options);
    const midX = end[0] + (start[0] - end[0]) / 2;
    const endfirstLine = [midX, start[1]];
    const endsecondLine = [midX, end[1]];
    const firstLine = {
        start: start,
        end: endfirstLine,
    };
    const secondLine = {
        start: endfirstLine,
        end: endsecondLine,
    };
    const threeLine = {
        start: endsecondLine,
        end: end,
    };
    drawLine(svgDrawingHelper, annotationUID, '1', firstLine.start, firstLine.end, {
        color,
        width,
        lineWidth,
        lineDash,
    });
    drawLine(svgDrawingHelper, annotationUID, '2', secondLine.start, secondLine.end, {
        color,
        width,
        lineWidth,
        lineDash,
    });
    drawLine(svgDrawingHelper, annotationUID, '3', threeLine.start, threeLine.end, {
        color,
        width,
        lineWidth,
        lineDash,
    });
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawPolyline.js
var drawPolyline = __webpack_require__(98812);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawPath.js
var drawPath = __webpack_require__(17311);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/_getHash.js
var drawingSvg_getHash = __webpack_require__(97181);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/setAttributesIfNecessary.js
var drawingSvg_setAttributesIfNecessary = __webpack_require__(85899);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/setNewAttributesIfValid.js
var drawingSvg_setNewAttributesIfValid = __webpack_require__(56442);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawFan.js



function drawFan(svgDrawingHelper, annotationUID, fanUID, center, innerRadius, outerRadius, startAngle, endAngle, options = {}, dataId = '', zIndex) {
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
    const svgNodeHash = _getHash(annotationUID, 'fan', fanUID);
    const existingFanElement = svgDrawingHelper.getSvgNode(svgNodeHash);
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const centerX = center[0];
    const centerY = center[1];
    const outerStartX = centerX + outerRadius * Math.cos(startRad);
    const outerStartY = centerY + outerRadius * Math.sin(startRad);
    const outerEndX = centerX + outerRadius * Math.cos(endRad);
    const outerEndY = centerY + outerRadius * Math.sin(endRad);
    const innerStartX = centerX + innerRadius * Math.cos(startRad);
    const innerStartY = centerY + innerRadius * Math.sin(startRad);
    const innerEndX = centerX + innerRadius * Math.cos(endRad);
    const innerEndY = centerY + innerRadius * Math.sin(endRad);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    let pathData = `M ${outerStartX} ${outerStartY}`;
    pathData += ` A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`;
    pathData += ` L ${innerEndX} ${innerEndY}`;
    pathData += ` A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`;
    pathData += ` Z`;
    const attributes = {
        d: pathData,
        stroke: color,
        fill,
        'stroke-width': strokeWidth,
        'stroke-dasharray': lineDash,
        'fill-opacity': fillOpacity,
        'stroke-opacity': strokeOpacity,
        'mix-blend-mode': 'normal',
    };
    if (existingFanElement) {
        setAttributesIfNecessary(attributes, existingFanElement);
        svgDrawingHelper.setNodeTouched(svgNodeHash);
    }
    else {
        const newFanElement = document.createElementNS(svgns, 'path');
        if (dataId !== '') {
            newFanElement.setAttribute('data-id', dataId);
        }
        if (zIndex !== undefined) {
            newFanElement.style.zIndex = zIndex.toString();
        }
        setNewAttributesIfValid(attributes, newFanElement);
        svgDrawingHelper.appendNode(newFanElement, svgNodeHash);
    }
}
/* harmony default export */ const drawingSvg_drawFan = ((/* unused pure expression or super */ null && (drawFan)));

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawLinkedTextBox.js + 1 modules
var drawLinkedTextBox = __webpack_require__(1595);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawRect.js
var drawRect = __webpack_require__(97530);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawRectByCoordinates.js
var drawRectByCoordinates = __webpack_require__(75076);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawTextBox.js
var drawTextBox = __webpack_require__(26290);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawArrow.js

const svgns = 'http://www.w3.org/2000/svg';
function drawArrow(svgDrawingHelper, annotationUID, arrowUID, start, end, options = {}) {
    if (isNaN(start[0]) || isNaN(start[1]) || isNaN(end[0]) || isNaN(end[1])) {
        return;
    }
    const { viaMarker = false, color = 'rgb(0, 255, 0)', markerSize = 10, } = options;
    if (!viaMarker) {
        legacyDrawArrow(svgDrawingHelper, annotationUID, arrowUID, start, end, options);
        return;
    }
    const layerId = svgDrawingHelper.svgLayerElement.id;
    const markerBaseId = `arrow-${annotationUID}`;
    const markerFullId = `${markerBaseId}-${layerId}`;
    const defs = svgDrawingHelper.svgLayerElement.querySelector('defs');
    let arrowMarker = defs.querySelector(`#${markerFullId}`);
    if (!arrowMarker) {
        arrowMarker = document.createElementNS(svgns, 'marker');
        arrowMarker.setAttribute('id', markerFullId);
        arrowMarker.setAttribute('viewBox', '0 0 10 10');
        arrowMarker.setAttribute('refX', '8');
        arrowMarker.setAttribute('refY', '5');
        arrowMarker.setAttribute('markerWidth', `${markerSize}`);
        arrowMarker.setAttribute('markerHeight', `${markerSize}`);
        arrowMarker.setAttribute('orient', 'auto');
        const arrowPath = document.createElementNS(svgns, 'path');
        arrowPath.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
        arrowPath.setAttribute('fill', color);
        arrowMarker.appendChild(arrowPath);
        defs.appendChild(arrowMarker);
    }
    else {
        arrowMarker.setAttribute('markerWidth', `${markerSize}`);
        arrowMarker.setAttribute('markerHeight', `${markerSize}`);
        const arrowPath = arrowMarker.querySelector('path');
        if (arrowPath) {
            arrowPath.setAttribute('fill', color);
        }
    }
    options.markerEndId = markerFullId;
    drawLine(svgDrawingHelper, annotationUID, arrowUID, start, end, options);
}
function legacyDrawArrow(svgDrawingHelper, annotationUID, arrowUID, start, end, options = {}) {
    const { color = 'rgb(0, 255, 0)', width = 2, lineWidth, lineDash } = options;
    const headLength = 10;
    const angle = Math.atan2(end[1] - start[1], end[0] - start[0]);
    const firstLine = {
        start: [
            end[0] - headLength * Math.cos(angle - Math.PI / 7),
            end[1] - headLength * Math.sin(angle - Math.PI / 7),
        ],
        end: end,
    };
    const secondLine = {
        start: [
            end[0] - headLength * Math.cos(angle + Math.PI / 7),
            end[1] - headLength * Math.sin(angle + Math.PI / 7),
        ],
        end: end,
    };
    drawLine(svgDrawingHelper, annotationUID, arrowUID, start, end, {
        color,
        width,
        lineWidth,
        lineDash,
    });
    drawLine(svgDrawingHelper, annotationUID, '2', firstLine.start, firstLine.end, {
        color,
        width,
        lineWidth,
        lineDash,
    });
    drawLine(svgDrawingHelper, annotationUID, '3', secondLine.start, secondLine.end, {
        color,
        width,
        lineWidth,
        lineDash,
    });
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawRedactionRect.js



function drawRedactionRect(svgDrawingHelper, annotationUID, rectangleUID, start, end, options = {}) {
    const { color, width: _width, lineWidth, lineDash, } = Object.assign({
        color: 'rgb(0, 255, 0)',
        width: '2',
        lineWidth: undefined,
        lineDash: undefined,
    }, options);
    const strokeWidth = lineWidth || _width;
    const svgns = 'http://www.w3.org/2000/svg';
    const svgNodeHash = _getHash(annotationUID, 'rect', rectangleUID);
    const existingRect = svgDrawingHelper.getSvgNode(svgNodeHash);
    const tlhc = [Math.min(start[0], end[0]), Math.min(start[1], end[1])];
    const width = Math.abs(start[0] - end[0]);
    const height = Math.abs(start[1] - end[1]);
    const attributes = {
        x: `${tlhc[0]}`,
        y: `${tlhc[1]}`,
        width: `${width}`,
        height: `${height}`,
        stroke: color,
        fill: 'black',
        'stroke-width': strokeWidth,
        'stroke-dasharray': lineDash,
    };
    if (existingRect) {
        _setAttributesIfNecessary(attributes, existingRect);
        svgDrawingHelper.setNodeTouched(svgNodeHash);
    }
    else {
        const svgRectElement = document.createElementNS(svgns, 'rect');
        _setNewAttributesIfValid(attributes, svgRectElement);
        svgDrawingHelper.appendNode(svgRectElement, svgNodeHash);
    }
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/index.js






















/***/ }),

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

/***/ 10401:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony export Swipe */
var Swipe;
(function (Swipe) {
    Swipe["UP"] = "UP";
    Swipe["DOWN"] = "DOWN";
    Swipe["LEFT"] = "LEFT";
    Swipe["RIGHT"] = "RIGHT";
})(Swipe || (Swipe = {}));



/***/ }),

/***/ 6802:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   O8: () => (/* reexport safe */ _annotation_annotationState__WEBPACK_IMPORTED_MODULE_3__.removeAnnotation),
/* harmony export */   Rh: () => (/* reexport safe */ _annotation_annotationState__WEBPACK_IMPORTED_MODULE_3__.getAnnotations),
/* harmony export */   lC: () => (/* reexport safe */ _annotation_annotationState__WEBPACK_IMPORTED_MODULE_3__.addAnnotation)
/* harmony export */ });
/* harmony import */ var _annotation_FrameOfReferenceSpecificAnnotationManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67013);
/* harmony import */ var _annotation_annotationLocking__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2076);
/* harmony import */ var _annotation_annotationSelection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(17343);
/* harmony import */ var _annotation_annotationState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(82056);
/* harmony import */ var _annotation_resetAnnotationManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(97);








/***/ }),

/***/ 59475:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _6: () => (/* binding */ defaultSegmentationStateManager)
/* harmony export */ });
/* unused harmony exports default, internalConvertStackToVolumeLabelmap, internalComputeVolumeLabelmapFromStack */
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(99737);
/* harmony import */ var _kitware_vtk_js_Rendering_Core_ColorTransferFunction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(642);
/* harmony import */ var _kitware_vtk_js_Common_DataModel_PiecewiseFunction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(99341);
/* harmony import */ var _triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(49906);
/* harmony import */ var _SegmentationStyle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(92686);
/* harmony import */ var _events_triggerSegmentationAdded__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(75419);







const initialDefaultState = {
    colorLUT: [],
    segmentations: [],
    viewportSegRepresentations: {},
};
class SegmentationStateManager {
    constructor(uid) {
        this._stackLabelmapImageIdReferenceMap = new Map();
        this._labelmapImageIdReferenceMap = new Map();
        uid ||= _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.uuidv4();
        this.state = Object.freeze(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.deepClone(initialDefaultState));
        this.uid = uid;
    }
    getState() {
        return this.state;
    }
    updateState(updater) {
        const newState = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.deepClone(this.state);
        updater(newState);
        this.state = Object.freeze(newState);
    }
    getColorLUT(lutIndex) {
        return this.state.colorLUT[lutIndex];
    }
    getNextColorLUTIndex() {
        return this.state.colorLUT.length;
    }
    resetState() {
        this._stackLabelmapImageIdReferenceMap.clear();
        this._labelmapImageIdReferenceMap.clear();
        this.state = Object.freeze(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.deepClone(initialDefaultState));
    }
    getSegmentation(segmentationId) {
        return this.state.segmentations.find((segmentation) => segmentation.segmentationId === segmentationId);
    }
    updateSegmentation(segmentationId, payload) {
        this.updateState((draftState) => {
            const segmentation = draftState.segmentations.find((segmentation) => segmentation.segmentationId === segmentationId);
            if (!segmentation) {
                console.warn(`Segmentation with id ${segmentationId} not found. Update aborted.`);
                return;
            }
            Object.assign(segmentation, payload);
        });
        (0,_triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_4__.triggerSegmentationModified)(segmentationId);
    }
    addSegmentation(segmentation) {
        if (this.getSegmentation(segmentation.segmentationId)) {
            throw new Error(`Segmentation with id ${segmentation.segmentationId} already exists`);
        }
        this.updateState((state) => {
            const newSegmentation = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.deepClone(segmentation);
            if (newSegmentation.representationData.Labelmap &&
                'volumeId' in newSegmentation.representationData.Labelmap &&
                !('imageIds' in newSegmentation.representationData.Labelmap)) {
                const imageIds = this.getLabelmapImageIds(newSegmentation.representationData);
                newSegmentation.representationData
                    .Labelmap.imageIds = imageIds;
            }
            state.segmentations.push(newSegmentation);
        });
        (0,_events_triggerSegmentationAdded__WEBPACK_IMPORTED_MODULE_6__/* .triggerSegmentationAdded */ .R)(segmentation.segmentationId);
    }
    removeSegmentation(segmentationId) {
        this.updateState((state) => {
            const filteredSegmentations = state.segmentations.filter((segmentation) => segmentation.segmentationId !== segmentationId);
            state.segmentations.splice(0, state.segmentations.length, ...filteredSegmentations);
        });
        (0,_triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_4__.triggerSegmentationRemoved)(segmentationId);
    }
    addSegmentationRepresentation(viewportId, segmentationId, type, renderingConfig) {
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElementByViewportId)(viewportId);
        if (!enabledElement) {
            return;
        }
        const existingRepresentations = this.getSegmentationRepresentations(viewportId, {
            type: type,
            segmentationId,
        });
        if (existingRepresentations.length > 0) {
            console.debug('A segmentation representation of type', type, 'already exists in viewport', viewportId, 'for segmentation', segmentationId);
            return;
        }
        this.updateState((state) => {
            if (!state.viewportSegRepresentations[viewportId]) {
                state.viewportSegRepresentations[viewportId] = [];
                _SegmentationStyle__WEBPACK_IMPORTED_MODULE_5__/* .segmentationStyle */ .Y.setRenderInactiveSegmentations(viewportId, true);
            }
            if (type !== _enums__WEBPACK_IMPORTED_MODULE_1__.SegmentationRepresentations.Labelmap) {
                this.addDefaultSegmentationRepresentation(state, viewportId, segmentationId, type, renderingConfig);
            }
            else {
                this.addLabelmapRepresentation(state, viewportId, segmentationId, renderingConfig);
            }
        });
        (0,_triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_4__.triggerSegmentationRepresentationModified)(viewportId, segmentationId, type);
    }
    addDefaultSegmentationRepresentation(state, viewportId, segmentationId, type, renderingConfig) {
        const segmentation = state.segmentations.find((segmentation) => segmentation.segmentationId === segmentationId);
        if (!segmentation) {
            return;
        }
        const segmentReps = {};
        Object.keys(segmentation.segments).forEach((segmentIndex) => {
            segmentReps[Number(segmentIndex)] = {
                visible: true,
            };
        });
        state.viewportSegRepresentations[viewportId].push({
            segmentationId,
            type,
            active: true,
            visible: true,
            colorLUTIndex: renderingConfig?.colorLUTIndex || 0,
            segments: segmentReps,
            config: {
                ...getDefaultRenderingConfig(type),
                ...renderingConfig,
            },
        });
        this._setActiveSegmentation(state, viewportId, segmentationId);
    }
    addLabelmapRepresentation(state, viewportId, segmentationId, renderingConfig = getDefaultRenderingConfig(_enums__WEBPACK_IMPORTED_MODULE_1__.SegmentationRepresentations.Labelmap)) {
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElementByViewportId)(viewportId);
        if (!enabledElement) {
            return;
        }
        const segmentation = this.getSegmentation(segmentationId);
        if (!segmentation) {
            return;
        }
        const { representationData } = segmentation;
        if (!representationData.Labelmap) {
            return this.addDefaultSegmentationRepresentation(state, viewportId, segmentationId, _enums__WEBPACK_IMPORTED_MODULE_1__.SegmentationRepresentations.Labelmap, renderingConfig);
        }
        this.processLabelmapRepresentationAddition(viewportId, segmentationId);
        this.addDefaultSegmentationRepresentation(state, viewportId, segmentationId, _enums__WEBPACK_IMPORTED_MODULE_1__.SegmentationRepresentations.Labelmap, renderingConfig);
    }
    async processLabelmapRepresentationAddition(viewportId, segmentationId) {
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElementByViewportId)(viewportId);
        if (!enabledElement) {
            return;
        }
        const segmentation = this.getSegmentation(segmentationId);
        if (!segmentation) {
            return;
        }
        const volumeViewport = enabledElement.viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.BaseVolumeViewport;
        const { representationData } = segmentation;
        const isBaseVolumeSegmentation = 'volumeId' in representationData.Labelmap;
        const viewport = enabledElement.viewport;
        if (!volumeViewport && !isBaseVolumeSegmentation) {
            !this.updateLabelmapSegmentationImageReferences(viewportId, segmentation.segmentationId);
        }
    }
    _updateLabelmapSegmentationReferences(segmentationId, viewport, labelmapImageIds, updateCallback) {
        const referenceImageId = viewport.getCurrentImageId();
        let viewableLabelmapImageIdFound = false;
        for (const labelmapImageId of labelmapImageIds) {
            const viewableImageId = viewport.isReferenceViewable({ referencedImageId: labelmapImageId }, { asOverlay: true });
            if (viewableImageId) {
                viewableLabelmapImageIdFound = true;
                this._stackLabelmapImageIdReferenceMap
                    .get(segmentationId)
                    .set(referenceImageId, labelmapImageId);
                this._updateLabelmapImageIdReferenceMap({
                    segmentationId,
                    referenceImageId,
                    labelmapImageId,
                });
            }
        }
        if (updateCallback) {
            updateCallback(viewport, segmentationId, labelmapImageIds);
        }
        return viewableLabelmapImageIdFound
            ? this._stackLabelmapImageIdReferenceMap
                .get(segmentationId)
                .get(referenceImageId)
            : undefined;
    }
    updateLabelmapSegmentationImageReferences(viewportId, segmentationId) {
        const segmentation = this.getSegmentation(segmentationId);
        if (!segmentation) {
            return;
        }
        if (!this._stackLabelmapImageIdReferenceMap.has(segmentationId)) {
            this._stackLabelmapImageIdReferenceMap.set(segmentationId, new Map());
        }
        const { representationData } = segmentation;
        if (!representationData.Labelmap) {
            return;
        }
        const labelmapImageIds = this.getLabelmapImageIds(representationData);
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElementByViewportId)(viewportId);
        const stackViewport = enabledElement.viewport;
        return this._updateLabelmapSegmentationReferences(segmentationId, stackViewport, labelmapImageIds, null);
    }
    _updateAllLabelmapSegmentationImageReferences(viewportId, segmentationId) {
        const segmentation = this.getSegmentation(segmentationId);
        if (!segmentation) {
            return;
        }
        if (!this._stackLabelmapImageIdReferenceMap.has(segmentationId)) {
            this._stackLabelmapImageIdReferenceMap.set(segmentationId, new Map());
        }
        const { representationData } = segmentation;
        if (!representationData.Labelmap) {
            return;
        }
        const labelmapImageIds = this.getLabelmapImageIds(representationData);
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElementByViewportId)(viewportId);
        const stackViewport = enabledElement.viewport;
        this._updateLabelmapSegmentationReferences(segmentationId, stackViewport, labelmapImageIds, (stackViewport, segmentationId, labelmapImageIds) => {
            const imageIds = stackViewport.getImageIds();
            imageIds.forEach((referenceImageId, index) => {
                for (const labelmapImageId of labelmapImageIds) {
                    const viewableImageId = stackViewport.isReferenceViewable({ referencedImageId: labelmapImageId, sliceIndex: index }, { asOverlay: true, withNavigation: true });
                    if (viewableImageId) {
                        this._stackLabelmapImageIdReferenceMap
                            .get(segmentationId)
                            .set(referenceImageId, labelmapImageId);
                        this._updateLabelmapImageIdReferenceMap({
                            segmentationId,
                            referenceImageId,
                            labelmapImageId,
                        });
                    }
                }
            });
        });
    }
    getLabelmapImageIds(representationData) {
        const labelmapData = representationData.Labelmap;
        let labelmapImageIds;
        if (labelmapData.imageIds) {
            labelmapImageIds = labelmapData
                .imageIds;
        }
        else if (!labelmapImageIds &&
            labelmapData.volumeId) {
            const volumeId = labelmapData
                .volumeId;
            const volume = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.cache.getVolume(volumeId);
            labelmapImageIds = volume.imageIds;
        }
        return labelmapImageIds;
    }
    getLabelmapImageIdsForImageId(imageId, segmentationId) {
        const key = this._generateMapKey({
            segmentationId,
            referenceImageId: imageId,
        });
        return this._labelmapImageIdReferenceMap.get(key);
    }
    getCurrentLabelmapImageIdsForViewport(viewportId, segmentationId) {
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElementByViewportId)(viewportId);
        if (!enabledElement) {
            return;
        }
        const stackViewport = enabledElement.viewport;
        const referenceImageId = stackViewport.getCurrentImageId();
        return this.getLabelmapImageIdsForImageId(referenceImageId, segmentationId);
    }
    getCurrentLabelmapImageIdForViewport(viewportId, segmentationId) {
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElementByViewportId)(viewportId);
        if (!enabledElement) {
            return;
        }
        if (!this._stackLabelmapImageIdReferenceMap.has(segmentationId)) {
            return;
        }
        const stackViewport = enabledElement.viewport;
        const currentImageId = stackViewport.getCurrentImageId();
        const imageIdReferenceMap = this._stackLabelmapImageIdReferenceMap.get(segmentationId);
        return imageIdReferenceMap.get(currentImageId);
    }
    getStackSegmentationImageIdsForViewport(viewportId, segmentationId) {
        const segmentation = this.getSegmentation(segmentationId);
        if (!segmentation) {
            return [];
        }
        this._updateAllLabelmapSegmentationImageReferences(viewportId, segmentationId);
        const { viewport } = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElementByViewportId)(viewportId);
        const imageIds = viewport.getImageIds();
        const associatedReferenceImageAndLabelmapImageIds = this._stackLabelmapImageIdReferenceMap.get(segmentationId);
        return imageIds.map((imageId) => {
            return associatedReferenceImageAndLabelmapImageIds.get(imageId);
        });
    }
    removeSegmentationRepresentationsInternal(viewportId, specifier) {
        const removedRepresentations = [];
        this.updateState((state) => {
            if (!state.viewportSegRepresentations[viewportId]) {
                return;
            }
            const currentRepresentations = state.viewportSegRepresentations[viewportId];
            let activeRepresentationRemoved = false;
            if (!specifier ||
                Object.values(specifier).every((value) => value === undefined)) {
                removedRepresentations.push(...currentRepresentations);
                delete state.viewportSegRepresentations[viewportId];
            }
            else {
                const { segmentationId, type } = specifier;
                state.viewportSegRepresentations[viewportId] =
                    currentRepresentations.filter((representation) => {
                        const shouldRemove = (segmentationId &&
                            type &&
                            representation.segmentationId === segmentationId &&
                            representation.type === type) ||
                            (segmentationId &&
                                !type &&
                                representation.segmentationId === segmentationId) ||
                            (!segmentationId && type && representation.type === type);
                        if (shouldRemove) {
                            removedRepresentations.push(representation);
                            if (representation.active) {
                                activeRepresentationRemoved = true;
                            }
                        }
                        return !shouldRemove;
                    });
                if (state.viewportSegRepresentations[viewportId].length === 0) {
                    delete state.viewportSegRepresentations[viewportId];
                }
                else if (activeRepresentationRemoved) {
                    state.viewportSegRepresentations[viewportId][0].active = true;
                }
            }
        });
        return removedRepresentations;
    }
    removeSegmentationRepresentations(viewportId, specifier) {
        const removedRepresentations = this.removeSegmentationRepresentationsInternal(viewportId, specifier);
        removedRepresentations.forEach((representation) => {
            (0,_triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_4__.triggerSegmentationRepresentationRemoved)(viewportId, representation.segmentationId, representation.type);
        });
        const remainingRepresentations = this.getSegmentationRepresentations(viewportId);
        if (remainingRepresentations.length > 0 &&
            remainingRepresentations[0].active) {
            (0,_triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_4__.triggerSegmentationRepresentationModified)(viewportId, remainingRepresentations[0].segmentationId, remainingRepresentations[0].type);
        }
        return removedRepresentations;
    }
    removeSegmentationRepresentation(viewportId, specifier, suppressEvent) {
        const removedRepresentations = this.removeSegmentationRepresentationsInternal(viewportId, specifier);
        if (!suppressEvent) {
            removedRepresentations.forEach(({ segmentationId, type }) => {
                (0,_triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_4__.triggerSegmentationRepresentationRemoved)(viewportId, segmentationId, type);
            });
        }
        return removedRepresentations;
    }
    _updateLabelmapImageIdReferenceMap({ segmentationId, referenceImageId, labelmapImageId, }) {
        const key = this._generateMapKey({ segmentationId, referenceImageId });
        if (!this._labelmapImageIdReferenceMap.has(key)) {
            this._labelmapImageIdReferenceMap.set(key, [labelmapImageId]);
            return;
        }
        const currentValues = this._labelmapImageIdReferenceMap.get(key);
        const newValues = Array.from(new Set([...currentValues, labelmapImageId]));
        this._labelmapImageIdReferenceMap.set(key, newValues);
    }
    _setActiveSegmentation(state, viewportId, segmentationId) {
        const viewport = state.viewportSegRepresentations[viewportId];
        if (!viewport) {
            return;
        }
        viewport.forEach((value) => {
            value.active = value.segmentationId === segmentationId;
        });
    }
    setActiveSegmentation(viewportId, segmentationId) {
        this.updateState((state) => {
            const viewport = state.viewportSegRepresentations[viewportId];
            if (!viewport) {
                return;
            }
            viewport.forEach((value) => {
                value.active = value.segmentationId === segmentationId;
            });
        });
        (0,_triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_4__.triggerSegmentationRepresentationModified)(viewportId, segmentationId);
    }
    getActiveSegmentation(viewportId) {
        if (!this.state.viewportSegRepresentations[viewportId]) {
            return;
        }
        const activeSegRep = this.state.viewportSegRepresentations[viewportId].find((segRep) => segRep.active);
        if (!activeSegRep) {
            return;
        }
        return this.getSegmentation(activeSegRep.segmentationId);
    }
    getSegmentationRepresentations(viewportId, specifier = {}) {
        const viewportRepresentations = this.state.viewportSegRepresentations[viewportId];
        if (!viewportRepresentations) {
            return [];
        }
        if (!specifier.type && !specifier.segmentationId) {
            return viewportRepresentations;
        }
        return viewportRepresentations.filter((representation) => {
            const typeMatch = specifier.type
                ? representation.type === specifier.type
                : true;
            const idMatch = specifier.segmentationId
                ? representation.segmentationId === specifier.segmentationId
                : true;
            return typeMatch && idMatch;
        });
    }
    getSegmentationRepresentation(viewportId, specifier) {
        return this.getSegmentationRepresentations(viewportId, specifier)[0];
    }
    getSegmentationRepresentationVisibility(viewportId, specifier) {
        const viewportRepresentation = this.getSegmentationRepresentation(viewportId, specifier);
        return viewportRepresentation?.visible;
    }
    setSegmentationRepresentationVisibility(viewportId, specifier, visible) {
        this.updateState((state) => {
            const viewportRepresentations = this.getSegmentationRepresentations(viewportId, specifier);
            if (!viewportRepresentations) {
                return;
            }
            viewportRepresentations.forEach((representation) => {
                representation.visible = visible;
                Object.entries(representation.segments).forEach(([segmentIndex, segment]) => {
                    segment.visible = visible;
                });
            });
        });
        (0,_triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_4__.triggerSegmentationRepresentationModified)(viewportId, specifier.segmentationId, specifier.type);
    }
    addColorLUT(colorLUT, lutIndex) {
        this.updateState((state) => {
            if (state.colorLUT[lutIndex]) {
                console.warn('Color LUT table already exists, overwriting');
            }
            state.colorLUT[lutIndex] = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.deepClone(colorLUT);
        });
    }
    removeColorLUT(colorLUTIndex) {
        this.updateState((state) => {
            delete state.colorLUT[colorLUTIndex];
        });
    }
    _getStackIdForImageIds(imageIds) {
        return imageIds
            .map((imageId) => imageId.slice(-Math.round(imageId.length * 0.15)))
            .join('_');
    }
    getAllViewportSegmentationRepresentations() {
        return Object.entries(this.state.viewportSegRepresentations).map(([viewportId, representations]) => ({
            viewportId,
            representations,
        }));
    }
    getSegmentationRepresentationsBySegmentationId(segmentationId) {
        const result = [];
        Object.entries(this.state.viewportSegRepresentations).forEach(([viewportId, viewportReps]) => {
            const filteredReps = viewportReps.filter((representation) => representation.segmentationId === segmentationId);
            if (filteredReps.length > 0) {
                result.push({ viewportId, representations: filteredReps });
            }
        });
        return result;
    }
    _generateMapKey({ segmentationId, referenceImageId }) {
        return `${segmentationId}-${referenceImageId}`;
    }
}
async function internalComputeVolumeLabelmapFromStack({ imageIds, options, }) {
    const segmentationImageIds = imageIds;
    const volumeId = options?.volumeId || csUtils.uuidv4();
    await volumeLoader.createAndCacheVolumeFromImages(volumeId, segmentationImageIds);
    return { volumeId };
}
async function internalConvertStackToVolumeLabelmap({ segmentationId, options, }) {
    const segmentation = defaultSegmentationStateManager.getSegmentation(segmentationId);
    const data = segmentation.representationData
        .Labelmap;
    const { volumeId } = await internalComputeVolumeLabelmapFromStack({
        imageIds: data.imageIds,
        options,
    });
    segmentation.representationData.Labelmap.volumeId = volumeId;
}
function getDefaultRenderingConfig(type) {
    const cfun = _kitware_vtk_js_Rendering_Core_ColorTransferFunction__WEBPACK_IMPORTED_MODULE_2__/* ["default"].newInstance */ .Ay.newInstance();
    const ofun = _kitware_vtk_js_Common_DataModel_PiecewiseFunction__WEBPACK_IMPORTED_MODULE_3__/* ["default"].newInstance */ .Ay.newInstance();
    ofun.addPoint(0, 0);
    if (type === _enums__WEBPACK_IMPORTED_MODULE_1__.SegmentationRepresentations.Labelmap) {
        return {
            cfun,
            ofun,
        };
    }
    else {
        return {};
    }
}
const defaultSegmentationStateManager = new SegmentationStateManager('DEFAULT');



/***/ }),

/***/ 26228:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  getActiveSegmentation: () => (/* binding */ activeSegmentation_getActiveSegmentation)
});

// UNUSED EXPORTS: setActiveSegmentation

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getActiveSegmentation.js
var getActiveSegmentation = __webpack_require__(67165);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/SegmentationStateManager.js
var SegmentationStateManager = __webpack_require__(59475);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/setActiveSegmentation.js

function setActiveSegmentation(viewportId, segmentationId) {
    const segmentationStateManager = defaultSegmentationStateManager;
    segmentationStateManager.setActiveSegmentation(viewportId, segmentationId);
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/activeSegmentation.js


function activeSegmentation_getActiveSegmentation(viewportId) {
    return (0,getActiveSegmentation/* getActiveSegmentation */.T)(viewportId);
}
function activeSegmentation_setActiveSegmentation(viewportId, segmentationId) {
    _setActiveSegmentation(viewportId, segmentationId);
}



/***/ }),

/***/ 4714:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony export addColorLUT */
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _SegmentationStateManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(59475);
/* harmony import */ var _getNextColorLUTIndex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(70906);
/* harmony import */ var _constants_COLOR_LUT__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(93952);




function addColorLUT(colorLUT, index) {
    const segmentationStateManager = defaultSegmentationStateManager;
    const indexToUse = index ?? getNextColorLUTIndex();
    let colorLUTToUse = [...colorLUT];
    if (!utilities.isEqual(colorLUTToUse[0], [0, 0, 0, 0])) {
        console.warn('addColorLUT: [0, 0, 0, 0] color is not provided for the background color (segmentIndex =0), automatically adding it');
        colorLUTToUse = [[0, 0, 0, 0], ...colorLUTToUse];
    }
    colorLUTToUse = colorLUTToUse.map((color) => {
        if (color.length === 3) {
            return [color[0], color[1], color[2], 255];
        }
        return color;
    });
    if (colorLUTToUse.length < 255) {
        const missingColorLUTs = CORNERSTONE_COLOR_LUT.slice(colorLUTToUse.length);
        colorLUTToUse = [...colorLUTToUse, ...missingColorLUTs];
    }
    segmentationStateManager.addColorLUT(colorLUTToUse, indexToUse);
    return indexToUse;
}


/***/ }),

/***/ 30935:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {


// UNUSED EXPORTS: addSegmentations, default

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/SegmentationStateManager.js
var SegmentationStateManager = __webpack_require__(59475);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/triggerSegmentationEvents.js
var triggerSegmentationEvents = __webpack_require__(49906);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js + 2 modules
var enums = __webpack_require__(99737);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/normalizeSegmentationInput.js


function normalizeSegmentationInput_normalizeSegmentationInput(segmentationInput) {
    const { segmentationId, representation, config } = segmentationInput;
    const { type, data: inputData } = representation;
    const data = inputData ? { ...inputData } : {};
    if (!data) {
        throw new Error('Segmentation representation data may not be undefined');
    }
    if (type === SegmentationRepresentations.Contour) {
        normalizeContourData(data);
    }
    const normalizedSegments = normalizeSegments(config?.segments, type, data);
    delete config?.segments;
    return {
        segmentationId,
        label: config?.label ?? null,
        cachedStats: config?.cachedStats ?? {},
        segments: normalizedSegments,
        representationData: {
            [type]: {
                ...data,
            },
        },
    };
}
function normalizeContourData(contourData) {
    contourData.geometryIds = contourData.geometryIds ?? [];
    contourData.annotationUIDsMap = contourData.annotationUIDsMap ?? new Map();
}
function normalizeSegments(segmentsConfig, type, data) {
    const normalizedSegments = {};
    if (segmentsConfig) {
        Object.entries(segmentsConfig).forEach(([segmentIndex, segment]) => {
            const { label, locked, cachedStats, active, ...rest } = segment;
            const normalizedSegment = {
                segmentIndex: Number(segmentIndex),
                label: label ?? `Segment ${segmentIndex}`,
                locked: locked ?? false,
                cachedStats: cachedStats ?? {},
                active: active ?? false,
                ...rest,
            };
            normalizedSegments[segmentIndex] = normalizedSegment;
        });
    }
    else if (type === SegmentationRepresentations.Contour) {
        normalizeContourSegments(normalizedSegments, data);
    }
    else if (type === SegmentationRepresentations.Surface) {
        normalizeSurfaceSegments(normalizedSegments, data);
    }
    else {
        normalizedSegments[1] = createDefaultSegment();
    }
    return normalizedSegments;
}
function normalizeContourSegments(normalizedSegments, contourData) {
    const { geometryIds } = contourData;
    geometryIds?.forEach((geometryId) => {
        const geometry = cache.getGeometry(geometryId);
        if (geometry?.data) {
            const { segmentIndex } = geometry.data;
            normalizedSegments[segmentIndex] = { segmentIndex };
        }
    });
}
function normalizeSurfaceSegments(normalizedSegments, surfaceData) {
    const { geometryIds } = surfaceData;
    geometryIds?.forEach((geometryId) => {
        const geometry = cache.getGeometry(geometryId);
        if (geometry?.data) {
            const { segmentIndex } = geometry.data;
            normalizedSegments[segmentIndex] = { segmentIndex };
        }
    });
}
function createDefaultSegment() {
    return {
        segmentIndex: 1,
        label: 'Segment 1',
        locked: false,
        cachedStats: {},
        active: true,
    };
}
/* harmony default export */ const helpers_normalizeSegmentationInput = ((/* unused pure expression or super */ null && (normalizeSegmentationInput_normalizeSegmentationInput)));

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/addSegmentations.js



function addSegmentations(segmentationInputArray, suppressEvents) {
    const segmentationStateManager = defaultSegmentationStateManager;
    segmentationInputArray.forEach((segmentationInput) => {
        const segmentation = normalizeSegmentationInput(segmentationInput);
        segmentationStateManager.addSegmentation(segmentation);
        if (!suppressEvents) {
            triggerSegmentationModified(segmentation.segmentationId);
        }
    });
}
/* harmony default export */ const segmentation_addSegmentations = ((/* unused pure expression or super */ null && (addSegmentations)));


/***/ }),

/***/ 93733:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getSegmentIndexColor: () => (/* binding */ getSegmentIndexColor),
/* harmony export */   setSegmentIndexColor: () => (/* binding */ setSegmentIndexColor)
/* harmony export */ });
/* unused harmony exports addColorLUT, setColorLUT */
/* harmony import */ var _addColorLUT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4714);
/* harmony import */ var _getColorLUT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(50409);
/* harmony import */ var _getSegmentationRepresentation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(93210);
/* harmony import */ var _triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(49906);




function addColorLUT(colorLUT, colorLUTIndex) {
    if (!colorLUT) {
        throw new Error('addColorLUT: colorLUT is required');
    }
    return _addColorLUT(colorLUT, colorLUTIndex);
}
function setColorLUT(viewportId, segmentationId, colorLUTsIndex) {
    if (!_getColorLUT(colorLUTsIndex)) {
        throw new Error(`setColorLUT: could not find colorLUT with index ${colorLUTsIndex}`);
    }
    const segmentationRepresentations = getSegmentationRepresentations(viewportId, { segmentationId });
    if (!segmentationRepresentations) {
        throw new Error(`viewport specific state for viewport ${viewportId} does not exist`);
    }
    segmentationRepresentations.forEach((segmentationRepresentation) => {
        segmentationRepresentation.colorLUTIndex = colorLUTsIndex;
    });
    triggerSegmentationRepresentationModified(viewportId, segmentationId);
}
function getSegmentIndexColor(viewportId, segmentationId, segmentIndex) {
    const representations = (0,_getSegmentationRepresentation__WEBPACK_IMPORTED_MODULE_2__/* .getSegmentationRepresentations */ .r$)(viewportId, {
        segmentationId,
    });
    if (!representations || representations.length === 0) {
        return null;
    }
    const representation = representations[0];
    const { colorLUTIndex } = representation;
    const colorLUT = (0,_getColorLUT__WEBPACK_IMPORTED_MODULE_1__/* .getColorLUT */ .B)(colorLUTIndex);
    let colorValue = colorLUT[segmentIndex];
    if (!colorValue) {
        if (typeof segmentIndex !== 'number') {
            console.warn(`Can't create colour for LUT index ${segmentIndex}`);
            return null;
        }
        colorValue = colorLUT[segmentIndex] = [0, 0, 0, 0];
    }
    return colorValue;
}
function setSegmentIndexColor(viewportId, segmentationId, segmentIndex, color) {
    const colorReference = getSegmentIndexColor(viewportId, segmentationId, segmentIndex);
    for (let i = 0; i < color.length; i++) {
        colorReference[i] = color[i];
    }
    (0,_triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_3__.triggerSegmentationRepresentationModified)(viewportId, segmentationId);
}



/***/ }),

/***/ 70906:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony export getNextColorLUTIndex */
/* harmony import */ var _SegmentationStateManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(59475);

function getNextColorLUTIndex() {
    const segmentationStateManager = defaultSegmentationStateManager;
    return segmentationStateManager.getNextColorLUTIndex();
}


/***/ }),

/***/ 93210:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ut: () => (/* binding */ getSegmentationRepresentation),
/* harmony export */   r$: () => (/* binding */ getSegmentationRepresentations)
/* harmony export */ });
/* unused harmony export getSegmentationRepresentationsBySegmentationId */
/* harmony import */ var _SegmentationStateManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(59475);

function getSegmentationRepresentations(viewportId, specifier = {}) {
    const segmentationStateManager = _SegmentationStateManager__WEBPACK_IMPORTED_MODULE_0__/* .defaultSegmentationStateManager */ ._6;
    return segmentationStateManager.getSegmentationRepresentations(viewportId, specifier);
}
function getSegmentationRepresentation(viewportId, specifier) {
    const segmentationStateManager = _SegmentationStateManager__WEBPACK_IMPORTED_MODULE_0__/* .defaultSegmentationStateManager */ ._6;
    if (!specifier.segmentationId || !specifier.type) {
        throw new Error('getSegmentationRepresentation: No segmentationId or type provided, you need to provide at least one of them');
    }
    const representations = segmentationStateManager.getSegmentationRepresentations(viewportId, specifier);
    return representations?.[0];
}
function getSegmentationRepresentationsBySegmentationId(segmentationId) {
    const segmentationStateManager = defaultSegmentationStateManager;
    return segmentationStateManager.getSegmentationRepresentationsBySegmentationId(segmentationId);
}


/***/ }),

/***/ 70758:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony export getSegmentations */
/* harmony import */ var _SegmentationStateManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(59475);

function getSegmentations() {
    const segmentationStateManager = defaultSegmentationStateManager;
    const state = segmentationStateManager.getState();
    return state.segmentations;
}


/***/ }),

/***/ 42568:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony exports getViewportSegmentations, getViewportSegmentationRepresentations */
/* harmony import */ var _getSegmentation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(33283);
/* harmony import */ var _SegmentationStateManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(59475);


function getViewportSegmentations(viewportId, type) {
    const viewportRepresentations = getViewportSegmentationRepresentations(viewportId);
    const segmentations = viewportRepresentations.map((representation) => {
        if (type && representation.type === type) {
            return getSegmentation(representation.segmentationId);
        }
        return getSegmentation(representation.segmentationId);
    });
    const filteredSegmentations = segmentations.filter((segmentation) => segmentation !== undefined);
    return filteredSegmentations;
}
function getViewportSegmentationRepresentations(viewportId) {
    const segmentationStateManager = defaultSegmentationStateManager;
    const state = segmentationStateManager.getState();
    const viewportRepresentations = state.viewportSegRepresentations[viewportId];
    return viewportRepresentations;
}


/***/ }),

/***/ 63427:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony exports removeSegmentation, removeAllSegmentations */
/* harmony import */ var _SegmentationStateManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(59475);
/* harmony import */ var _triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(49906);
/* harmony import */ var _removeSegmentationRepresentations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(53662);



function removeSegmentation(segmentationId) {
    const segmentationStateManager = defaultSegmentationStateManager;
    const viewportsWithSegmentation = segmentationStateManager
        .getAllViewportSegmentationRepresentations()
        .filter(({ representations }) => representations.some((rep) => rep.segmentationId === segmentationId))
        .map(({ viewportId }) => viewportId);
    viewportsWithSegmentation.forEach((viewportId) => {
        removeSegmentationRepresentations(viewportId, { segmentationId });
    });
    segmentationStateManager.removeSegmentation(segmentationId);
    triggerSegmentationRemoved(segmentationId);
}
function removeAllSegmentations() {
    const segmentationStateManager = defaultSegmentationStateManager;
    const segmentations = segmentationStateManager.getState().segmentations;
    const segmentationIds = segmentations.map((segmentation) => segmentation.segmentationId);
    segmentationIds.forEach((segmentationId) => {
        removeSegmentation(segmentationId);
    });
    segmentationStateManager.resetState();
}


/***/ }),

/***/ 53662:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {


// UNUSED EXPORTS: removeAllSegmentationRepresentations, removeContourRepresentation, removeLabelmapRepresentation, removeSegmentationRepresentation, removeSegmentationRepresentations, removeSurfaceRepresentation

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/SegmentationRepresentations.js
var enums_SegmentationRepresentations = __webpack_require__(18682);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Labelmap/labelmapDisplay.js
var Labelmap_labelmapDisplay = __webpack_require__(684);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Contour/contourDisplay.js
var Contour_contourDisplay = __webpack_require__(25894);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getSegmentationRepresentation.js
var getSegmentationRepresentation = __webpack_require__(93210);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/SegmentationStateManager.js
var SegmentationStateManager = __webpack_require__(59475);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Surface/surfaceDisplay.js
var Surface_surfaceDisplay = __webpack_require__(67014);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Surface/index.js



;// ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/removeSegmentationRepresentations.js







function removeSegmentationRepresentation(viewportId, specifier, immediate) {
    return _removeSegmentationRepresentations(viewportId, specifier, immediate);
}
function removeSegmentationRepresentations(viewportId, specifier, immediate) {
    return _removeSegmentationRepresentations(viewportId, specifier, immediate);
}
function _removeSegmentationRepresentations(viewportId, specifier, immediate) {
    const { segmentationId, type } = specifier;
    _removeRepresentationObject(viewportId, segmentationId, type, immediate);
    return defaultSegmentationStateManager.removeSegmentationRepresentations(viewportId, {
        segmentationId,
        type,
    });
}
function removeAllSegmentationRepresentations() {
    const state = defaultSegmentationStateManager.getAllViewportSegmentationRepresentations();
    state.forEach(({ viewportId, representations }) => {
        representations.forEach(({ segmentationId, type }) => {
            removeSegmentationRepresentation(viewportId, {
                segmentationId,
                type,
            });
        });
    });
    defaultSegmentationStateManager.resetState();
}
function removeLabelmapRepresentation(viewportId, segmentationId, immediate) {
    removeSegmentationRepresentation(viewportId, {
        segmentationId,
        type: SegmentationRepresentations.Labelmap,
    }, immediate);
}
function removeContourRepresentation(viewportId, segmentationId, immediate) {
    removeSegmentationRepresentation(viewportId, {
        segmentationId,
        type: SegmentationRepresentations.Contour,
    }, immediate);
}
function removeSurfaceRepresentation(viewportId, segmentationId, immediate) {
    removeSegmentationRepresentation(viewportId, {
        segmentationId,
        type: SegmentationRepresentations.Surface,
    }, immediate);
}
function _removeRepresentationObject(viewportId, segmentationId, type, immediate) {
    const representations = getSegmentationRepresentations(viewportId, {
        segmentationId,
        type,
    });
    representations.forEach((representation) => {
        if (representation.type === SegmentationRepresentations.Labelmap) {
            labelmapDisplay.removeRepresentation(viewportId, representation.segmentationId, immediate);
        }
        else if (representation.type === SegmentationRepresentations.Contour) {
            contourDisplay.removeRepresentation(viewportId, representation.segmentationId, immediate);
        }
        else if (representation.type === SegmentationRepresentations.Surface) {
            surfaceDisplay.removeRepresentation(viewportId, representation.segmentationId, immediate);
        }
    });
    const { viewport } = getEnabledElementByViewportId(viewportId) || {};
    if (viewport) {
        viewport.render();
    }
}



/***/ }),

/***/ 26795:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getLockedSegmentIndices: () => (/* binding */ getLockedSegmentIndices)
/* harmony export */ });
/* unused harmony exports isSegmentIndexLocked, setSegmentIndexLocked */
/* harmony import */ var _stateManagement_segmentation_getSegmentation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(33283);
/* harmony import */ var _annotation_annotationLocking__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2076);
/* harmony import */ var _triggerSegmentationEvents__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(49906);
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(31994);




function _setContourSegmentationSegmentAnnotationsLocked(segmentation, segmentIndex, locked) {
    const annotationUIDsMap = getAnnotationsUIDMapFromSegmentation(segmentation.segmentationId);
    if (!annotationUIDsMap) {
        return;
    }
    const annotationUIDs = annotationUIDsMap.get(segmentIndex);
    if (!annotationUIDs) {
        return;
    }
    annotationUIDs.forEach((annotationUID) => {
        setAnnotationLocked(annotationUID, locked);
    });
}
function isSegmentIndexLocked(segmentationId, segmentIndex) {
    const segmentation = getSegmentation(segmentationId);
    if (!segmentation) {
        throw new Error(`No segmentation state found for ${segmentationId}`);
    }
    const { segments } = segmentation;
    return segments[segmentIndex].locked;
}
function setSegmentIndexLocked(segmentationId, segmentIndex, locked = true) {
    const segmentation = getSegmentation(segmentationId);
    if (!segmentation) {
        throw new Error(`No segmentation state found for ${segmentationId}`);
    }
    const { segments } = segmentation;
    segments[segmentIndex].locked = locked;
    if (segmentation?.representationData?.Contour) {
        _setContourSegmentationSegmentAnnotationsLocked(segmentation, segmentIndex, locked);
    }
    triggerSegmentationModified(segmentationId);
}
function getLockedSegmentIndices(segmentationId) {
    const segmentation = (0,_stateManagement_segmentation_getSegmentation__WEBPACK_IMPORTED_MODULE_0__/* .getSegmentation */ .T)(segmentationId);
    if (!segmentation) {
        throw new Error(`No segmentation state found for ${segmentationId}`);
    }
    const { segments } = segmentation;
    const lockedSegmentIndices = Object.keys(segments).filter((segmentIndex) => segments[segmentIndex].locked);
    return lockedSegmentIndices.map((segmentIndex) => parseInt(segmentIndex));
}



/***/ }),

/***/ 98870:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  getCurrentLabelmapImageIdForViewport: () => (/* reexport */ getCurrentLabelmapImageIdForViewport/* getCurrentLabelmapImageIdForViewport */.vl)
});

// UNUSED EXPORTS: addColorLUT, addSegmentations, destroy, getColorLUT, getCurrentLabelmapImageIdsForViewport, getNextColorLUTIndex, getSegmentation, getSegmentationRepresentation, getSegmentationRepresentations, getSegmentationRepresentationsBySegmentationId, getSegmentations, getStackSegmentationImageIdsForViewport, getViewportIdsWithSegmentation, getViewportSegmentationRepresentations, getViewportSegmentations, removeAllSegmentationRepresentations, removeAllSegmentations, removeColorLUT, removeContourRepresentation, removeLabelmapRepresentation, removeSegmentation, removeSegmentationRepresentation, removeSurfaceRepresentation, updateLabelmapSegmentationImageReferences

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getSegmentation.js
var getSegmentation = __webpack_require__(33283);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getSegmentations.js
var getSegmentations = __webpack_require__(70758);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/addSegmentations.js + 1 modules
var addSegmentations = __webpack_require__(30935);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/removeSegmentation.js
var removeSegmentation = __webpack_require__(63427);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/removeSegmentationRepresentations.js + 1 modules
var removeSegmentationRepresentations = __webpack_require__(53662);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/addColorLUT.js
var addColorLUT = __webpack_require__(4714);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getColorLUT.js
var getColorLUT = __webpack_require__(50409);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getNextColorLUTIndex.js
var getNextColorLUTIndex = __webpack_require__(70906);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/SegmentationStateManager.js
var SegmentationStateManager = __webpack_require__(59475);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/removeColorLUT.js

function removeColorLUT(colorLUTIndex) {
    const segmentationStateManager = defaultSegmentationStateManager;
    segmentationStateManager.removeColorLUT(colorLUTIndex);
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getViewportSegmentations.js
var getViewportSegmentations = __webpack_require__(42568);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getViewportIdsWithSegmentation.js
var getViewportIdsWithSegmentation = __webpack_require__(58859);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getCurrentLabelmapImageIdForViewport.js
var getCurrentLabelmapImageIdForViewport = __webpack_require__(97577);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/updateLabelmapSegmentationImageReferences.js
var updateLabelmapSegmentationImageReferences = __webpack_require__(78231);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getStackSegmentationImageIdsForViewport.js

function getStackSegmentationImageIdsForViewport(viewportId, segmentationId) {
    const segmentationStateManager = defaultSegmentationStateManager;
    return segmentationStateManager.getStackSegmentationImageIdsForViewport(viewportId, segmentationId);
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getSegmentationRepresentation.js
var getSegmentationRepresentation = __webpack_require__(93210);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/segmentationState.js
















function destroy() {
    defaultSegmentationStateManager.resetState();
}



/***/ }),

/***/ 78231:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony export updateLabelmapSegmentationImageReferences */
/* harmony import */ var _SegmentationStateManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(59475);

function updateLabelmapSegmentationImageReferences(viewportId, segmentationId) {
    const segmentationStateManager = defaultSegmentationStateManager;
    return segmentationStateManager.updateLabelmapSegmentationImageReferences(viewportId, segmentationId);
}


/***/ }),

/***/ 98484:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony export getAnnotationsUIDMapFromSegmentation */
/* harmony import */ var _getSegmentation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(33283);

function getAnnotationsUIDMapFromSegmentation(segmentationId) {
    const segmentation = getSegmentation(segmentationId);
    if (!segmentation) {
        return;
    }
    const contourRepresentationData = segmentation.representationData
        ?.Contour;
    if (!contourRepresentationData) {
        return;
    }
    const { annotationUIDsMap } = contourRepresentationData;
    if (!annotationUIDsMap) {
        return;
    }
    return annotationUIDsMap;
}


/***/ }),

/***/ 31994:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

/* harmony import */ var _getAnnotationsUIDMapFromSegmentation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(98484);
/* harmony import */ var _getViewportAssociatedToSegmentation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(16493);
/* harmony import */ var _getAnnotationMapFromSegmentation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(10407);
/* harmony import */ var _decimateContours__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(53097);
/* harmony import */ var _extractSegmentPolylines__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(96629);
/* harmony import */ var _removeCompleteContourAnnotation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(38928);
/* harmony import */ var _removeContourHoles__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(19741);
/* harmony import */ var _removeContourIslands__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(85512);
/* harmony import */ var _smoothContours__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(68362);
/* harmony import */ var _convertContourHoles__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(64540);













/***/ }),

/***/ 48145:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony export resetSvgNodeCache */
let svgNodeCache = {};
function resetSvgNodeCache() {
    svgNodeCache = {};
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (svgNodeCache);


/***/ }),

/***/ 25072:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15327);
/* harmony import */ var _utilities_getCalibratedUnits__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4096);
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(85817);
/* harmony import */ var _utilities_throttle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(27730);
/* harmony import */ var _stateManagement_annotation_annotationState__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(82056);
/* harmony import */ var _stateManagement_annotation_annotationLocking__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2076);
/* harmony import */ var _stateManagement_annotation_annotationVisibility__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(29601);
/* harmony import */ var _stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(44049);
/* harmony import */ var _drawingSvg__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(74347);
/* harmony import */ var _store_state__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(85204);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(99737);
/* harmony import */ var _utilities_viewportFilters__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(60810);
/* harmony import */ var _utilities_math_line__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(93258);
/* harmony import */ var _utilities_drawing__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(473);
/* harmony import */ var _cursors_elementCursor__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(7001);
/* harmony import */ var _utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(58640);
/* harmony import */ var _stateManagement_annotation_config_helpers__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(76712);


















const { transformWorldToIndex } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities;
class BidirectionalTool extends _base__WEBPACK_IMPORTED_MODULE_3__/* .AnnotationTool */ .EC {
    static { this.toolName = 'Bidirectional'; }
    constructor(toolProps = {}, defaultToolProps = {
        supportedInteractionTypes: ['Mouse', 'Touch'],
        configuration: {
            preventHandleOutsideImage: false,
            getTextLines: defaultGetTextLines,
        },
    }) {
        super(toolProps, defaultToolProps);
        this.isPointNearTool = (element, annotation, canvasCoords, proximity) => {
            const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElement)(element);
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
            let distanceToPoint = _utilities_math_line__WEBPACK_IMPORTED_MODULE_13__.distanceToPoint([line.start.x, line.start.y], [line.end.x, line.end.y], [canvasCoords[0], canvasCoords[1]]);
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
            distanceToPoint = _utilities_math_line__WEBPACK_IMPORTED_MODULE_13__.distanceToPoint([line.start.x, line.start.y], [line.end.x, line.end.y], [canvasCoords[0], canvasCoords[1]]);
            if (distanceToPoint <= proximity) {
                return true;
            }
            return false;
        };
        this.toolSelectedCallback = (evt, annotation) => {
            const eventDetail = evt.detail;
            const { element } = eventDetail;
            annotation.highlighted = true;
            const viewportIdsToRender = (0,_utilities_viewportFilters__WEBPACK_IMPORTED_MODULE_12__.getViewportIdsWithToolToRender)(element, this.getToolName());
            this.editData = {
                annotation,
                viewportIdsToRender,
                movingTextBox: false,
            };
            this._activateModify(element);
            const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElement)(element);
            const { renderingEngine } = enabledElement;
            (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_16__/* ["default"] */ .A)(viewportIdsToRender);
            (0,_cursors_elementCursor__WEBPACK_IMPORTED_MODULE_15__.hideElementCursor)(element);
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
            const viewportIdsToRender = (0,_utilities_viewportFilters__WEBPACK_IMPORTED_MODULE_12__.getViewportIdsWithToolToRender)(element, this.getToolName());
            (0,_cursors_elementCursor__WEBPACK_IMPORTED_MODULE_15__.hideElementCursor)(element);
            this.editData = {
                annotation,
                viewportIdsToRender,
                handleIndex,
                movingTextBox,
            };
            this._activateModify(element);
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
            this.doneEditMemo();
            data.handles.activeHandleIndex = null;
            this._deactivateModify(element);
            this._deactivateDraw(element);
            (0,_cursors_elementCursor__WEBPACK_IMPORTED_MODULE_15__.resetElementCursor)(element);
            const { renderingEngine } = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElement)(element);
            if (this.editData.handleIndex !== undefined) {
                const { points } = data.handles;
                const firstLineSegmentLength = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.distance */ .eR.distance(points[0], points[1]);
                const secondLineSegmentLength = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.distance */ .eR.distance(points[2], points[3]);
                if (secondLineSegmentLength > firstLineSegmentLength) {
                    const longAxis = [[...points[2]], [...points[3]]];
                    const shortAxisPoint0 = [...points[0]];
                    const shortAxisPoint1 = [...points[1]];
                    const longAxisVector = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.create */ .Zc.create();
                    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.set */ .Zc.set(longAxisVector, longAxis[1][0] - longAxis[0][0], longAxis[1][1] - longAxis[1][0]);
                    const counterClockWisePerpendicularToLongAxis = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.create */ .Zc.create();
                    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.set */ .Zc.set(counterClockWisePerpendicularToLongAxis, -longAxisVector[1], longAxisVector[0]);
                    const currentShortAxisVector = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.create */ .Zc.create();
                    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.set */ .Zc.set(currentShortAxisVector, shortAxisPoint1[0] - shortAxisPoint0[0], shortAxisPoint1[1] - shortAxisPoint0[0]);
                    let shortAxis;
                    if (gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.dot */ .Zc.dot(currentShortAxisVector, counterClockWisePerpendicularToLongAxis) > 0) {
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
                (0,_stateManagement_annotation_annotationState__WEBPACK_IMPORTED_MODULE_5__.removeAnnotation)(annotation.annotationUID);
            }
            (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_16__/* ["default"] */ .A)(viewportIdsToRender);
            if (newAnnotation) {
                (0,_stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_8__.triggerAnnotationCompleted)(annotation);
            }
            this.editData = null;
            this.isDrawing = false;
        };
        this._dragDrawCallback = (evt) => {
            this.isDrawing = true;
            const eventDetail = evt.detail;
            const { currentPoints, element } = eventDetail;
            const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElement)(element);
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
            const dist = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.distance */ .Zc.distance(canvasCoordPoints[0], canvasCoordPoints[1]);
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
            (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_16__/* ["default"] */ .A)(viewportIdsToRender);
            (0,_stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_8__.triggerAnnotationModified)(annotation, element, _enums__WEBPACK_IMPORTED_MODULE_11__.ChangeTypes.HandlesUpdated);
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
            (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_16__/* ["default"] */ .A)(viewportIdsToRender);
            if (annotation.invalidated) {
                (0,_stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_8__.triggerAnnotationModified)(annotation, element, _enums__WEBPACK_IMPORTED_MODULE_11__.ChangeTypes.HandlesUpdated);
            }
        };
        this._dragModifyHandle = (evt) => {
            const eventDetail = evt.detail;
            const { currentPoints, element } = eventDetail;
            const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElement)(element);
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
                const fixedHandleToProposedCoordVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.set */ .Zc.set(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.create */ .Zc.create(), proposedCanvasCoord[0] - fixedHandleCanvasCoord[0], proposedCanvasCoord[1] - fixedHandleCanvasCoord[1]);
                const fixedHandleToOldCoordVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.set */ .Zc.set(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.create */ .Zc.create(), canvasCoordHandlesCurrent[movingHandleIndex][0] -
                    fixedHandleCanvasCoord[0], canvasCoordHandlesCurrent[movingHandleIndex][1] -
                    fixedHandleCanvasCoord[1]);
                gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.normalize */ .Zc.normalize(fixedHandleToProposedCoordVec, fixedHandleToProposedCoordVec);
                gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.normalize */ .Zc.normalize(fixedHandleToOldCoordVec, fixedHandleToOldCoordVec);
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
                const longLineSegmentVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.subtract */ .Zc.subtract(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.create */ .Zc.create(), [
                    canvasCoordsCurrent.longLineSegment.end.x,
                    canvasCoordsCurrent.longLineSegment.end.y,
                ], [
                    canvasCoordsCurrent.longLineSegment.start.x,
                    canvasCoordsCurrent.longLineSegment.start.y,
                ]);
                const longLineSegmentVecNormalized = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.normalize */ .Zc.normalize(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.create */ .Zc.create(), longLineSegmentVec);
                const proposedToCurrentVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.subtract */ .Zc.subtract(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.create */ .Zc.create(), [proposedCanvasCoord[0], proposedCanvasCoord[1]], [
                    canvasCoordHandlesCurrent[movingHandleIndex][0],
                    canvasCoordHandlesCurrent[movingHandleIndex][1],
                ]);
                const movementLength = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.length */ .Zc.length(proposedToCurrentVec);
                const angle = this._getSignedAngle(longLineSegmentVecNormalized, proposedToCurrentVec);
                const movementAlongLineSegmentLength = Math.cos(angle) * movementLength;
                const newTranslatedPoint = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.scaleAndAdd */ .Zc.scaleAndAdd(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.create */ .Zc.create(), [
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
                const intersectionPoint = _utilities_math_line__WEBPACK_IMPORTED_MODULE_13__.intersectLine([proposedCanvasCoord[0], proposedCanvasCoord[1]], [newTranslatedPoint[0], newTranslatedPoint[1]], [firstLineSegment.start.x, firstLineSegment.start.y], [firstLineSegment.end.x, firstLineSegment.end.y]);
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
                (0,_cursors_elementCursor__WEBPACK_IMPORTED_MODULE_15__.resetElementCursor)(element);
                const { annotation, viewportIdsToRender, newAnnotation } = this.editData;
                const { data } = annotation;
                annotation.highlighted = false;
                data.handles.activeHandleIndex = null;
                (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_16__/* ["default"] */ .A)(viewportIdsToRender);
                if (newAnnotation) {
                    (0,_stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_8__.triggerAnnotationCompleted)(annotation);
                }
                this.editData = null;
                return annotation.annotationUID;
            }
        };
        this._activateDraw = (element) => {
            _store_state__WEBPACK_IMPORTED_MODULE_10__/* .state */ .wk.isInteractingWithTool = true;
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.MOUSE_UP, this._endCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.MOUSE_DRAG, this._dragDrawCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.MOUSE_MOVE, this._dragDrawCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.MOUSE_CLICK, this._endCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.TOUCH_TAP, this._endCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.TOUCH_END, this._endCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.TOUCH_DRAG, this._dragDrawCallback);
        };
        this._deactivateDraw = (element) => {
            _store_state__WEBPACK_IMPORTED_MODULE_10__/* .state */ .wk.isInteractingWithTool = false;
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.MOUSE_UP, this._endCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.MOUSE_DRAG, this._dragDrawCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.MOUSE_MOVE, this._dragDrawCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.MOUSE_CLICK, this._endCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.TOUCH_TAP, this._endCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.TOUCH_END, this._endCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.TOUCH_DRAG, this._dragDrawCallback);
        };
        this._activateModify = (element) => {
            _store_state__WEBPACK_IMPORTED_MODULE_10__/* .state */ .wk.isInteractingWithTool = true;
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.MOUSE_UP, this._endCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.MOUSE_DRAG, this._dragModifyCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.MOUSE_CLICK, this._endCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.TOUCH_END, this._endCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.TOUCH_DRAG, this._dragModifyCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.TOUCH_TAP, this._endCallback);
        };
        this._deactivateModify = (element) => {
            _store_state__WEBPACK_IMPORTED_MODULE_10__/* .state */ .wk.isInteractingWithTool = false;
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.MOUSE_UP, this._endCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.MOUSE_DRAG, this._dragModifyCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.MOUSE_CLICK, this._endCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.TOUCH_END, this._endCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.TOUCH_DRAG, this._dragModifyCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_11__.Events.TOUCH_TAP, this._endCallback);
        };
        this.renderAnnotation = (enabledElement, svgDrawingHelper) => {
            let renderStatus = true;
            const { viewport } = enabledElement;
            const { element } = viewport;
            let annotations = (0,_stateManagement_annotation_annotationState__WEBPACK_IMPORTED_MODULE_5__.getAnnotations)(this.getToolName(), element);
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
                if (!(0,_stateManagement_annotation_annotationVisibility__WEBPACK_IMPORTED_MODULE_7__.isAnnotationVisible)(annotationUID)) {
                    continue;
                }
                if (!(0,_stateManagement_annotation_annotationLocking__WEBPACK_IMPORTED_MODULE_6__.isAnnotationLocked)(annotationUID) &&
                    !this.editData &&
                    activeHandleIndex !== null) {
                    activeHandleCanvasCoords = [canvasCoordinates[activeHandleIndex]];
                }
                const showHandlesAlways = Boolean((0,_stateManagement_annotation_config_helpers__WEBPACK_IMPORTED_MODULE_17__/* .getStyleProperty */ .h)('showHandlesAlways', {}));
                if (activeHandleCanvasCoords || showHandlesAlways) {
                    const handleGroupUID = '0';
                    (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_9__.drawHandles)(svgDrawingHelper, annotationUID, handleGroupUID, showHandlesAlways ? canvasCoordinates : activeHandleCanvasCoords, {
                        color,
                    });
                }
                const dataId1 = `${annotationUID}-line-1`;
                const dataId2 = `${annotationUID}-line-2`;
                const lineUID = '0';
                (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_9__.drawLine)(svgDrawingHelper, annotationUID, lineUID, canvasCoordinates[0], canvasCoordinates[1], {
                    color,
                    lineDash,
                    lineWidth,
                    shadow,
                }, dataId1);
                const secondLineUID = '1';
                (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_9__.drawLine)(svgDrawingHelper, annotationUID, secondLineUID, canvasCoordinates[2], canvasCoordinates[3], {
                    color,
                    lineDash,
                    lineWidth,
                    shadow,
                }, dataId2);
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
                let canvasTextBoxCoords;
                if (!data.handles.textBox.hasMoved) {
                    canvasTextBoxCoords = (0,_utilities_drawing__WEBPACK_IMPORTED_MODULE_14__.getTextBoxCoordsCanvas)(canvasCoordinates);
                    data.handles.textBox.worldPosition =
                        viewport.canvasToWorld(canvasTextBoxCoords);
                }
                const textBoxPosition = viewport.worldToCanvas(data.handles.textBox.worldPosition);
                const textBoxUID = '1';
                const boundingBox = (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_9__.drawLinkedTextBox)(svgDrawingHelper, annotationUID, textBoxUID, textLines, textBoxPosition, canvasCoordinates, {}, options);
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
        this._movingLongAxisWouldPutItThroughShortAxis = (firstLineSegment, secondLineSegment) => {
            const vectorInSecondLineDirection = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.create */ .Zc.create();
            gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.set */ .Zc.set(vectorInSecondLineDirection, secondLineSegment.end.x - secondLineSegment.start.x, secondLineSegment.end.y - secondLineSegment.start.y);
            gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec2.normalize */ .Zc.normalize(vectorInSecondLineDirection, vectorInSecondLineDirection);
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
            const proposedIntersectionPoint = _utilities_math_line__WEBPACK_IMPORTED_MODULE_13__.intersectLine([extendedSecondLineSegment.start.x, extendedSecondLineSegment.start.y], [extendedSecondLineSegment.end.x, extendedSecondLineSegment.end.y], [firstLineSegment.start.x, firstLineSegment.start.y], [firstLineSegment.end.x, firstLineSegment.end.y]);
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
                const index1 = transformWorldToIndex(imageData, worldPos1);
                const index2 = transformWorldToIndex(imageData, worldPos2);
                const index3 = transformWorldToIndex(imageData, worldPos3);
                const index4 = transformWorldToIndex(imageData, worldPos4);
                const handles1 = [index1, index2];
                const handles2 = [index3, index4];
                const { scale: scale1, unit: units1 } = (0,_utilities_getCalibratedUnits__WEBPACK_IMPORTED_MODULE_2__/* .getCalibratedLengthUnitsAndScale */ .Op)(image, handles1);
                const { scale: scale2, unit: units2 } = (0,_utilities_getCalibratedUnits__WEBPACK_IMPORTED_MODULE_2__/* .getCalibratedLengthUnitsAndScale */ .Op)(image, handles2);
                const dist1 = this._calculateLength(worldPos1, worldPos2) / scale1;
                const dist2 = this._calculateLength(worldPos3, worldPos4) / scale2;
                const length = dist1 > dist2 ? dist1 : dist2;
                const width = dist1 > dist2 ? dist2 : dist1;
                const unit = dist1 > dist2 ? units1 : units2;
                const widthUnit = dist1 > dist2 ? units2 : units1;
                this._isInsideVolume(index1, index2, index3, index4, dimensions)
                    ? (this.isHandleOutsideImage = false)
                    : (this.isHandleOutsideImage = true);
                cachedStats[targetId] = {
                    length,
                    width,
                    unit,
                    widthUnit,
                };
            }
            const invalidated = annotation.invalidated;
            annotation.invalidated = false;
            if (invalidated) {
                (0,_stateManagement_annotation_helpers_state__WEBPACK_IMPORTED_MODULE_8__.triggerAnnotationModified)(annotation, element, _enums__WEBPACK_IMPORTED_MODULE_11__.ChangeTypes.StatsUpdated);
            }
            return cachedStats;
        };
        this._isInsideVolume = (index1, index2, index3, index4, dimensions) => {
            return (_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.indexWithinDimensions(index1, dimensions) &&
                _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.indexWithinDimensions(index2, dimensions) &&
                _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.indexWithinDimensions(index3, dimensions) &&
                _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.indexWithinDimensions(index4, dimensions));
        };
        this._getSignedAngle = (vector1, vector2) => {
            return Math.atan2(vector1[0] * vector2[1] - vector1[1] * vector2[0], vector1[0] * vector2[0] + vector1[1] * vector2[1]);
        };
        this._throttledCalculateCachedStats = (0,_utilities_throttle__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A)(this._calculateCachedStats, 100, { trailing: true });
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
        (0,_stateManagement_annotation_annotationState__WEBPACK_IMPORTED_MODULE_5__.addAnnotation)(annotation, element);
        const viewportIdsToRender = (0,_utilities_viewportFilters__WEBPACK_IMPORTED_MODULE_12__.getViewportIdsWithToolToRender)(element, this.getToolName());
        this.editData = {
            annotation,
            viewportIdsToRender,
            handleIndex: 1,
            movingTextBox: false,
            newAnnotation: true,
            hasMoved: false,
        };
        this._activateDraw(element);
        (0,_cursors_elementCursor__WEBPACK_IMPORTED_MODULE_15__.hideElementCursor)(element);
        evt.preventDefault();
        (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_16__/* ["default"] */ .A)(viewportIdsToRender);
        return annotation;
    }
    static { this.hydrate = (viewportId, axis, options) => {
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.getEnabledElementByViewportId)(viewportId);
        if (!enabledElement) {
            return;
        }
        const { FrameOfReferenceUID, referencedImageId, viewPlaneNormal, instance, viewport, } = this.hydrateBase(BidirectionalTool, enabledElement, axis[0], options);
        const [majorAxis, minorAxis] = axis;
        const [major0, major1] = majorAxis;
        const [minor0, minor1] = minorAxis;
        const points = [major0, major1, minor0, minor1];
        const { toolInstance, ...serializableOptions } = options || {};
        const annotation = {
            annotationUID: options?.annotationUID || _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.uuidv4(),
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
        (0,_stateManagement_annotation_annotationState__WEBPACK_IMPORTED_MODULE_5__.addAnnotation)(annotation, viewport.element);
        (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_16__/* ["default"] */ .A)([viewport.id]);
        return annotation;
    }; }
    _calculateLength(pos1, pos2) {
        const dx = pos1[0] - pos2[0];
        const dy = pos1[1] - pos2[1];
        const dz = pos1[2] - pos2[2];
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
}
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
    textLines.push(`L: ${_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.roundNumber(length)} ${unit || unit}`, `W: ${_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.roundNumber(width)} ${unit}`);
    return textLines;
}
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (BidirectionalTool)));


/***/ }),

/***/ 48736:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3823);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(99737);
/* harmony import */ var _strategies_fillSphere__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(17492);
/* harmony import */ var _strategies_eraseSphere__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1989);
/* harmony import */ var _strategies_fillCircle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(56789);
/* harmony import */ var _strategies_eraseCircle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(33852);
/* harmony import */ var _drawingSvg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(74347);
/* harmony import */ var _cursors_elementCursor__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(7001);
/* harmony import */ var _utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(58640);
/* harmony import */ var _LabelmapBaseTool__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(23631);
/* harmony import */ var _strategies_utils_getStrategyData__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(40905);












class BrushTool extends _LabelmapBaseTool__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .A {
    constructor(toolProps = {}, defaultToolProps = {
        supportedInteractionTypes: ['Mouse', 'Touch'],
        configuration: {
            strategies: {
                FILL_INSIDE_CIRCLE: _strategies_fillCircle__WEBPACK_IMPORTED_MODULE_5__/* .fillInsideCircle */ .kr,
                ERASE_INSIDE_CIRCLE: _strategies_eraseCircle__WEBPACK_IMPORTED_MODULE_6__/* .eraseInsideCircle */ .r,
                FILL_INSIDE_SPHERE: _strategies_fillSphere__WEBPACK_IMPORTED_MODULE_3__/* .fillInsideSphere */ .Jq,
                ERASE_INSIDE_SPHERE: _strategies_eraseSphere__WEBPACK_IMPORTED_MODULE_4__/* .eraseInsideSphere */ ._,
                THRESHOLD_INSIDE_CIRCLE: _strategies_fillCircle__WEBPACK_IMPORTED_MODULE_5__/* .thresholdInsideCircle */ .q,
                THRESHOLD_INSIDE_SPHERE: _strategies_fillSphere__WEBPACK_IMPORTED_MODULE_3__/* .thresholdInsideSphere */ .rd,
                THRESHOLD_INSIDE_SPHERE_WITH_ISLAND_REMOVAL: _strategies_fillSphere__WEBPACK_IMPORTED_MODULE_3__/* .thresholdInsideSphereIsland */ .Sw,
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
                [_enums__WEBPACK_IMPORTED_MODULE_2__.StrategyCallbacks.AcceptPreview]: {
                    method: _enums__WEBPACK_IMPORTED_MODULE_2__.StrategyCallbacks.AcceptPreview,
                    bindings: [
                        {
                            key: 'Enter',
                        },
                    ],
                },
                [_enums__WEBPACK_IMPORTED_MODULE_2__.StrategyCallbacks.RejectPreview]: {
                    method: _enums__WEBPACK_IMPORTED_MODULE_2__.StrategyCallbacks.RejectPreview,
                    bindings: [
                        {
                            key: 'Escape',
                        },
                    ],
                },
                [_enums__WEBPACK_IMPORTED_MODULE_2__.StrategyCallbacks.Interpolate]: {
                    method: _enums__WEBPACK_IMPORTED_MODULE_2__.StrategyCallbacks.Interpolate,
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
                    method: _enums__WEBPACK_IMPORTED_MODULE_2__.StrategyCallbacks.Interpolate,
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
        this.onSetToolPassive = (evt) => {
            this.disableCursor();
        };
        this.onSetToolEnabled = () => {
            this.disableCursor();
        };
        this.onSetToolDisabled = (evt) => {
            this.disableCursor();
        };
        this.preMouseDownCallback = (evt) => {
            const eventData = evt.detail;
            const { element, currentPoints } = eventData;
            const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
            const { viewport } = enabledElement;
            this._editData = this.createEditData(element);
            this._activateDraw(element);
            (0,_cursors_elementCursor__WEBPACK_IMPORTED_MODULE_8__.hideElementCursor)(element);
            evt.preventDefault();
            this._previewData.isDrag = false;
            this._previewData.timerStart = Date.now();
            const canvasPoint = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.clone */ .Zc.clone(currentPoints.canvas);
            const worldPoint = viewport.canvasToWorld([
                canvasPoint[0],
                canvasPoint[1],
            ]);
            this._lastDragInfo = {
                canvas: canvasPoint,
                world: gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.clone */ .eR.clone(worldPoint),
            };
            const hoverData = this._hoverData || this.createHoverData(element);
            (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .A)(hoverData.viewportIdsToRender);
            const operationData = this.getOperationData(element);
            this.applyActiveStrategyCallback(enabledElement, operationData, _enums__WEBPACK_IMPORTED_MODULE_2__.StrategyCallbacks.OnInteractionStart);
            return true;
        };
        this.mouseMoveCallback = (evt) => {
            if (this.mode === _enums__WEBPACK_IMPORTED_MODULE_2__.ToolModes.Active) {
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
                const delta = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.distance */ .Zc.distance(canvas, startPoint);
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
            const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(this._previewData.element);
            if (!enabledElement) {
                return;
            }
            const { viewport } = enabledElement;
            const activeStrategy = this.configuration.activeStrategy;
            const strategyData = (0,_strategies_utils_getStrategyData__WEBPACK_IMPORTED_MODULE_11__/* .getStrategyData */ .S)({
                operationData,
                viewport,
                strategy: activeStrategy,
            });
            if (!operationData) {
                return;
            }
            const memo = this.createMemo(operationData.segmentationId, strategyData.segmentationVoxelManager);
            this._previewData.preview = this.applyActiveStrategyCallback((0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(this._previewData.element), {
                ...operationData,
                ...strategyData,
                memo,
            }, _enums__WEBPACK_IMPORTED_MODULE_2__.StrategyCallbacks.Preview);
        };
        this._dragCallback = (evt) => {
            const eventData = evt.detail;
            const { element, currentPoints } = eventData;
            const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
            const { viewport } = enabledElement;
            this.updateCursor(evt);
            const { viewportIdsToRender } = this._hoverData;
            (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .A)(viewportIdsToRender);
            const delta = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.distance */ .Zc.distance(currentPoints.canvas, this._previewData.startPoint);
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
                    canvas: gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.clone */ .Zc.clone(startCanvas),
                    world: gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.clone */ .eR.clone(startWorld),
                };
            }
            const currentCanvas = currentPoints.canvas;
            const currentWorld = viewport.canvasToWorld([
                currentCanvas[0],
                currentCanvas[1],
            ]);
            this._hoverData = this.createHoverData(element, currentCanvas);
            this._calculateCursor(element, currentCanvas);
            const operationData = this.getOperationData(element);
            operationData.strokePointsWorld = [
                gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.clone */ .eR.clone(this._lastDragInfo.world),
                gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.clone */ .eR.clone(currentWorld),
            ];
            this._previewData.preview = this.applyActiveStrategy(enabledElement, operationData);
            const currentCanvasClone = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec2.clone */ .Zc.clone(currentCanvas);
            this._lastDragInfo = {
                canvas: currentCanvasClone,
                world: gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.clone */ .eR.clone(currentWorld),
            };
            this._previewData.element = element;
            this._previewData.timerStart = Date.now() + dragTimeMs;
            this._previewData.isDrag = true;
            this._previewData.startPoint = currentCanvasClone;
        };
        this._endCallback = (evt) => {
            const eventData = evt.detail;
            const { element } = eventData;
            const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
            const operationData = this.getOperationData(element);
            if (!this._previewData.preview && !this._previewData.isDrag) {
                this.applyActiveStrategy(enabledElement, operationData);
            }
            this.doneEditMemo();
            this._deactivateDraw(element);
            (0,_cursors_elementCursor__WEBPACK_IMPORTED_MODULE_8__.resetElementCursor)(element);
            this.updateCursor(evt);
            this._editData = null;
            this._lastDragInfo = null;
            this.applyActiveStrategyCallback(enabledElement, operationData, _enums__WEBPACK_IMPORTED_MODULE_2__.StrategyCallbacks.OnInteractionEnd);
            if (!this._previewData.isDrag) {
                this.acceptPreview(element);
            }
        };
        this._activateDraw = (element) => {
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.MOUSE_UP, this._endCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.MOUSE_DRAG, this._dragCallback);
            element.addEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.MOUSE_CLICK, this._endCallback);
        };
        this._deactivateDraw = (element) => {
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.MOUSE_UP, this._endCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.MOUSE_DRAG, this._dragCallback);
            element.removeEventListener(_enums__WEBPACK_IMPORTED_MODULE_2__.Events.MOUSE_CLICK, this._endCallback);
        };
    }
    disableCursor() {
        this._hoverData = undefined;
        this.rejectPreview();
    }
    updateCursor(evt) {
        const eventData = evt.detail;
        const { element } = eventData;
        const { currentPoints } = eventData;
        const centerCanvas = currentPoints.canvas;
        this._hoverData = this.createHoverData(element, centerCanvas);
        this._calculateCursor(element, centerCanvas);
        if (!this._hoverData) {
            return;
        }
        (0,_utilities_triggerAnnotationRenderForViewportIds__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .A)(this._hoverData.viewportIdsToRender);
    }
    _calculateCursor(element, centerCanvas) {
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
        const { viewport } = enabledElement;
        const { canvasToWorld } = viewport;
        const camera = viewport.getCamera();
        const { brushSize } = this.configuration;
        const viewUp = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.fromValues */ .eR.fromValues(camera.viewUp[0], camera.viewUp[1], camera.viewUp[2]);
        const viewPlaneNormal = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.fromValues */ .eR.fromValues(camera.viewPlaneNormal[0], camera.viewPlaneNormal[1], camera.viewPlaneNormal[2]);
        const viewRight = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.create */ .eR.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.cross */ .eR.cross(viewRight, viewUp, viewPlaneNormal);
        const centerCursorInWorld = canvasToWorld([
            centerCanvas[0],
            centerCanvas[1],
        ]);
        const bottomCursorInWorld = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.create */ .eR.create();
        const topCursorInWorld = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.create */ .eR.create();
        const leftCursorInWorld = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.create */ .eR.create();
        const rightCursorInWorld = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.create */ .eR.create();
        for (let i = 0; i <= 2; i++) {
            bottomCursorInWorld[i] = centerCursorInWorld[i] - viewUp[i] * brushSize;
            topCursorInWorld[i] = centerCursorInWorld[i] + viewUp[i] * brushSize;
            leftCursorInWorld[i] = centerCursorInWorld[i] - viewRight[i] * brushSize;
            rightCursorInWorld[i] = centerCursorInWorld[i] + viewRight[i] * brushSize;
        }
        if (!this._hoverData) {
            return;
        }
        const { brushCursor } = this._hoverData;
        const { data } = brushCursor;
        if (data.handles === undefined) {
            data.handles = {};
        }
        data.handles.points = [
            bottomCursorInWorld,
            topCursorInWorld,
            leftCursorInWorld,
            rightCursorInWorld,
        ];
        const activeStrategy = this.configuration.activeStrategy;
        const strategy = this.configuration.strategies[activeStrategy];
        if (typeof strategy?.computeInnerCircleRadius === 'function') {
            strategy.computeInnerCircleRadius({
                configuration: this.configuration,
                viewport,
            });
        }
        data.invalidated = false;
    }
    getStatistics(element, segmentIndices) {
        if (!element) {
            return;
        }
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
        const stats = this.applyActiveStrategyCallback(enabledElement, this.getOperationData(element), _enums__WEBPACK_IMPORTED_MODULE_2__.StrategyCallbacks.GetStatistics, segmentIndices);
        return stats;
    }
    rejectPreview(element = this._previewData.element) {
        if (!element) {
            return;
        }
        this.doneEditMemo();
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
        if (!enabledElement) {
            return;
        }
        this.applyActiveStrategyCallback(enabledElement, this.getOperationData(element), _enums__WEBPACK_IMPORTED_MODULE_2__.StrategyCallbacks.RejectPreview);
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
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElement)(element);
        this._previewData.preview = this.applyActiveStrategyCallback(enabledElement, this.getOperationData(element), _enums__WEBPACK_IMPORTED_MODULE_2__.StrategyCallbacks.Interpolate, config.configuration);
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
        if (!this._hoverData) {
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
        const toolMetadata = brushCursor.metadata;
        if (!toolMetadata) {
            return;
        }
        const annotationUID = toolMetadata.brushCursorUID;
        const data = brushCursor.data;
        const { points } = data.handles;
        const canvasCoordinates = points.map((p) => viewport.worldToCanvas(p));
        const bottom = canvasCoordinates[0];
        const top = canvasCoordinates[1];
        const center = [
            Math.floor((bottom[0] + top[0]) / 2),
            Math.floor((bottom[1] + top[1]) / 2),
        ];
        const radius = Math.abs(bottom[1] - Math.floor((bottom[1] + top[1]) / 2));
        const color = `rgb(${toolMetadata.segmentColor?.slice(0, 3) || [0, 0, 0]})`;
        if (!viewport.getRenderingEngine()) {
            console.warn('Rendering Engine has been destroyed');
            return;
        }
        const circleUID = '0';
        (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_7__.drawCircle)(svgDrawingHelper, annotationUID, circleUID, center, radius, {
            color,
            lineDash: this.centerSegmentIndexInfo.segmentIndex === 0 ? [1, 2] : null,
        });
        const { dynamicRadiusInCanvas } = this.configuration?.threshold || {
            dynamicRadiusInCanvas: 0,
        };
        if (dynamicRadiusInCanvas) {
            const circleUID1 = '1';
            (0,_drawingSvg__WEBPACK_IMPORTED_MODULE_7__.drawCircle)(svgDrawingHelper, annotationUID, circleUID1, center, dynamicRadiusInCanvas, {
                color,
            });
        }
    }
}
BrushTool.toolName = 'Brush';
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (BrushTool)));


/***/ }),

/***/ 56789:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C$: () => (/* binding */ getEllipseCornersFromCanvasCoordinates),
/* harmony export */   kr: () => (/* binding */ fillInsideCircle),
/* harmony export */   mu: () => (/* binding */ createPointInEllipse),
/* harmony export */   pB: () => (/* binding */ CIRCLE_STRATEGY),
/* harmony export */   q: () => (/* binding */ thresholdInsideCircle)
/* harmony export */ });
/* unused harmony exports fillOutsideCircle, CIRCLE_THRESHOLD_STRATEGY, createPointInEllipse */
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15327);
/* harmony import */ var _utilities_boundingBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(72282);
/* harmony import */ var _BrushStrategy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(55887);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(99737);
/* harmony import */ var _compositions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(11990);
/* harmony import */ var _utilities_math_sphere__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(62783);







const { transformWorldToIndex, transformIndexToWorld, isEqual } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities;
function getEllipseCornersFromCanvasCoordinates(canvasCoordinates) {
    const [bottom, top, left, right] = canvasCoordinates;
    const topLeft = [left[0], top[1]];
    const bottomRight = [right[0], bottom[1]];
    const bottomLeft = [left[0], bottom[1]];
    const topRight = [right[0], top[1]];
    return [topLeft, bottomRight, bottomLeft, topRight];
}
function createCircleCornersForCenter(center, viewUp, viewRight, radius) {
    const centerVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(center[0], center[1], center[2]);
    const top = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.scaleAndAdd */ .eR.scaleAndAdd(top, centerVec, viewUp, radius);
    const bottom = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.scaleAndAdd */ .eR.scaleAndAdd(bottom, centerVec, viewUp, -radius);
    const right = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.scaleAndAdd */ .eR.scaleAndAdd(right, centerVec, viewRight, radius);
    const left = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.scaleAndAdd */ .eR.scaleAndAdd(left, centerVec, viewRight, -radius);
    return [
        bottom,
        top,
        left,
        right,
    ];
}
function createStrokePredicate(centers, radius) {
    if (!centers.length || radius <= 0) {
        return null;
    }
    const radiusSquared = radius * radius;
    const centerVecs = centers.map((point) => [point[0], point[1], point[2]]);
    const segments = [];
    for (let i = 1; i < centerVecs.length; i++) {
        const start = centerVecs[i - 1];
        const end = centerVecs[i];
        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        const dz = end[2] - start[2];
        const lengthSquared = dx * dx + dy * dy + dz * dz;
        segments.push({ start, vector: [dx, dy, dz], lengthSquared });
    }
    return (worldPoint) => {
        if (!worldPoint) {
            return false;
        }
        for (const centerVec of centerVecs) {
            const dx = worldPoint[0] - centerVec[0];
            const dy = worldPoint[1] - centerVec[1];
            const dz = worldPoint[2] - centerVec[2];
            if (dx * dx + dy * dy + dz * dz <= radiusSquared) {
                return true;
            }
        }
        for (const { start, vector, lengthSquared } of segments) {
            if (lengthSquared === 0) {
                const dx = worldPoint[0] - start[0];
                const dy = worldPoint[1] - start[1];
                const dz = worldPoint[2] - start[2];
                if (dx * dx + dy * dy + dz * dz <= radiusSquared) {
                    return true;
                }
                continue;
            }
            const dx = worldPoint[0] - start[0];
            const dy = worldPoint[1] - start[1];
            const dz = worldPoint[2] - start[2];
            const dot = dx * vector[0] + dy * vector[1] + dz * vector[2];
            const t = Math.max(0, Math.min(1, dot / lengthSquared));
            const projX = start[0] + vector[0] * t;
            const projY = start[1] + vector[1] * t;
            const projZ = start[2] + vector[2] * t;
            const distX = worldPoint[0] - projX;
            const distY = worldPoint[1] - projY;
            const distZ = worldPoint[2] - projZ;
            if (distX * distX + distY * distY + distZ * distZ <= radiusSquared) {
                return true;
            }
        }
        return false;
    };
}
const initializeCircle = {
    [_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.Initialize]: (operationData) => {
        const { points, viewport, segmentationImageData, viewUp, viewPlaneNormal, } = operationData;
        if (!points) {
            return;
        }
        const center = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
        if (points.length >= 2) {
            gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.add */ .eR.add(center, points[0], points[1]);
            gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.scale */ .eR.scale(center, center, 0.5);
        }
        else {
            gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.copy */ .eR.copy(center, points[0]);
        }
        operationData.centerWorld = center;
        operationData.centerIJK = transformWorldToIndex(segmentationImageData, center);
        const brushRadius = points.length >= 2 ? gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.distance */ .eR.distance(points[0], points[1]) / 2 : 0;
        const canvasCoordinates = points.map((p) => viewport.worldToCanvas(p));
        const corners = getEllipseCornersFromCanvasCoordinates(canvasCoordinates);
        const cornersInWorld = corners.map((corner) => viewport.canvasToWorld(corner));
        const normalizedViewUp = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(viewUp[0], viewUp[1], viewUp[2]);
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.normalize */ .eR.normalize(normalizedViewUp, normalizedViewUp);
        const normalizedPlaneNormal = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(viewPlaneNormal[0], viewPlaneNormal[1], viewPlaneNormal[2]);
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.normalize */ .eR.normalize(normalizedPlaneNormal, normalizedPlaneNormal);
        const viewRight = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.cross */ .eR.cross(viewRight, normalizedViewUp, normalizedPlaneNormal);
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.normalize */ .eR.normalize(viewRight, viewRight);
        const strokeCentersSource = operationData.strokePointsWorld &&
            operationData.strokePointsWorld.length > 0
            ? operationData.strokePointsWorld
            : [operationData.centerWorld];
        const strokeCenters = strokeCentersSource.map((point) => gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.clone */ .eR.clone(point));
        const strokeCornersWorld = strokeCenters.flatMap((centerPoint) => createCircleCornersForCenter(centerPoint, normalizedViewUp, viewRight, brushRadius));
        const circleCornersIJK = strokeCornersWorld.map((world) => transformWorldToIndex(segmentationImageData, world));
        const boundsIJK = (0,_utilities_boundingBox__WEBPACK_IMPORTED_MODULE_2__.getBoundingBoxAroundShapeIJK)(circleCornersIJK, segmentationImageData.getDimensions());
        operationData.strokePointsWorld = strokeCenters;
        operationData.isInObject = createPointInEllipse(cornersInWorld, {
            strokePointsWorld: strokeCenters,
            segmentationImageData,
            radius: brushRadius,
        });
        operationData.isInObjectBoundsIJK = boundsIJK;
    },
};
function createPointInEllipse(cornersInWorld = [], options = {}) {
    if (!cornersInWorld || cornersInWorld.length !== 4) {
        throw new Error('createPointInEllipse: cornersInWorld must have 4 points');
    }
    const [topLeft, bottomRight, bottomLeft, topRight] = cornersInWorld;
    const center = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.add */ .eR.add(center, topLeft, bottomRight);
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.scale */ .eR.scale(center, center, 0.5);
    const majorAxisVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.subtract */ .eR.subtract(majorAxisVec, topRight, topLeft);
    const xRadius = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.length */ .eR.length(majorAxisVec) / 2;
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.normalize */ .eR.normalize(majorAxisVec, majorAxisVec);
    const minorAxisVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.subtract */ .eR.subtract(minorAxisVec, bottomLeft, topLeft);
    const yRadius = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.length */ .eR.length(minorAxisVec) / 2;
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.normalize */ .eR.normalize(minorAxisVec, minorAxisVec);
    const normal = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.cross */ .eR.cross(normal, majorAxisVec, minorAxisVec);
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.normalize */ .eR.normalize(normal, normal);
    const radiusForStroke = options.radius ?? Math.max(xRadius, yRadius);
    const strokePredicate = createStrokePredicate(options.strokePointsWorld || [], radiusForStroke);
    if (isEqual(xRadius, yRadius)) {
        const radius = xRadius;
        const sphereObj = {
            center,
            radius,
            radius2: radius * radius,
        };
        return (pointLPS, pointIJK) => {
            let worldPoint = pointLPS;
            if (!worldPoint && pointIJK && options.segmentationImageData) {
                worldPoint = transformIndexToWorld(options.segmentationImageData, pointIJK);
            }
            if (!worldPoint) {
                return false;
            }
            if (strokePredicate?.(worldPoint)) {
                return true;
            }
            return (0,_utilities_math_sphere__WEBPACK_IMPORTED_MODULE_6__/* .pointInSphere */ .d)(sphereObj, worldPoint);
        };
    }
    return (pointLPS, pointIJK) => {
        let worldPoint = pointLPS;
        if (!worldPoint && pointIJK && options.segmentationImageData) {
            worldPoint = transformIndexToWorld(options.segmentationImageData, pointIJK);
        }
        if (!worldPoint) {
            return false;
        }
        if (strokePredicate?.(worldPoint)) {
            return true;
        }
        const pointVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.subtract */ .eR.subtract(pointVec, worldPoint, center);
        const distToPlane = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(pointVec, normal);
        const proj = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.scaleAndAdd */ .eR.scaleAndAdd(proj, pointVec, normal, -distToPlane);
        const fromTopLeft = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
        const centerToTopLeft = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.subtract */ .eR.subtract(centerToTopLeft, center, topLeft);
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.subtract */ .eR.subtract(fromTopLeft, proj, centerToTopLeft);
        const x = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(fromTopLeft, majorAxisVec);
        const y = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(fromTopLeft, minorAxisVec);
        return (x * x) / (xRadius * xRadius) + (y * y) / (yRadius * yRadius) <= 1;
    };
}
const CIRCLE_STRATEGY = new _BrushStrategy__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A('Circle', _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.regionFill, _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.setValue, initializeCircle, _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.determineSegmentIndex, _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.preview, _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.labelmapStatistics);
const CIRCLE_THRESHOLD_STRATEGY = new _BrushStrategy__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A('CircleThreshold', _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.regionFill, _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.setValue, initializeCircle, _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.determineSegmentIndex, _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.dynamicThreshold, _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.threshold, _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.preview, _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.islandRemoval, _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.labelmapStatistics);
const fillInsideCircle = CIRCLE_STRATEGY.strategyFunction;
const thresholdInsideCircle = CIRCLE_THRESHOLD_STRATEGY.strategyFunction;
function fillOutsideCircle() {
    throw new Error('Not yet implemented');
}



/***/ }),

/***/ 10088:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony exports RECTANGLE_STRATEGY, RECTANGLE_THRESHOLD_STRATEGY, fillInsideRectangle, thresholdInsideRectangle */
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15327);
/* harmony import */ var _utilities_boundingBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(72282);
/* harmony import */ var _BrushStrategy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(55887);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(99737);
/* harmony import */ var _compositions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(11990);






const { transformWorldToIndex } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities;
const initializeRectangle = {
    [_enums__WEBPACK_IMPORTED_MODULE_4__.StrategyCallbacks.Initialize]: (operationData) => {
        const { points, viewport, segmentationImageData, } = operationData;
        if (!points) {
            return;
        }
        const center = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.fromValues */ .eR.fromValues(0, 0, 0);
        points.forEach((point) => {
            gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.add */ .eR.add(center, center, point);
        });
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.scale */ .eR.scale(center, center, 1 / points.length);
        operationData.centerWorld = center;
        operationData.centerIJK = transformWorldToIndex(segmentationImageData, center);
        const { boundsIJK, pointInShapeFn } = createPointInRectangle(viewport, points, segmentationImageData);
        operationData.isInObject = pointInShapeFn;
        operationData.isInObjectBoundsIJK = boundsIJK;
    },
};
function createPointInRectangle(viewport, points, segmentationImageData) {
    let rectangleCornersIJK = points.map((world) => {
        return transformWorldToIndex(segmentationImageData, world);
    });
    rectangleCornersIJK = rectangleCornersIJK.map((point) => {
        return point.map((coord) => {
            return Math.round(coord);
        });
    });
    const boundsIJK = (0,_utilities_boundingBox__WEBPACK_IMPORTED_MODULE_2__.getBoundingBoxAroundShapeIJK)(rectangleCornersIJK, segmentationImageData.getDimensions());
    const [p0, p1, p2, p3] = points;
    const axisU = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
    const axisV = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.subtract */ .eR.subtract(axisU, p1, p0);
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.subtract */ .eR.subtract(axisV, p3, p0);
    const uLen = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.length */ .eR.length(axisU);
    const vLen = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.length */ .eR.length(axisV);
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.normalize */ .eR.normalize(axisU, axisU);
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.normalize */ .eR.normalize(axisV, axisV);
    const normal = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.cross */ .eR.cross(normal, axisU, axisV);
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.normalize */ .eR.normalize(normal, normal);
    const direction = segmentationImageData.getDirection();
    const spacing = segmentationImageData.getSpacing();
    const { viewPlaneNormal } = viewport.getCamera();
    const EPS = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_1__.utilities.getSpacingInNormalDirection({
        direction,
        spacing,
    }, viewPlaneNormal);
    const pointInShapeFn = (pointLPS) => {
        const v = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.subtract */ .eR.subtract(v, pointLPS, p0);
        const u = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(v, axisU);
        const vproj = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(v, axisV);
        const d = Math.abs(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(v, normal));
        return (u >= -EPS &&
            u <= uLen + EPS &&
            vproj >= -EPS &&
            vproj <= vLen + EPS &&
            d <= EPS);
    };
    return { boundsIJK, pointInShapeFn };
}
const RECTANGLE_STRATEGY = new _BrushStrategy__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A('Rectangle', _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.regionFill, _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.setValue, initializeRectangle, _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.determineSegmentIndex, _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.preview, _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.labelmapStatistics);
const RECTANGLE_THRESHOLD_STRATEGY = new _BrushStrategy__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A('RectangleThreshold', _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.regionFill, _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.setValue, initializeRectangle, _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.determineSegmentIndex, _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.dynamicThreshold, _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.threshold, _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.preview, _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.islandRemoval, _compositions__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.labelmapStatistics);
const fillInsideRectangle = RECTANGLE_STRATEGY.strategyFunction;
const thresholdInsideRectangle = RECTANGLE_THRESHOLD_STRATEGY.strategyFunction;



/***/ }),

/***/ 99522:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fillInsideCircle: () => (/* reexport safe */ _fillCircle__WEBPACK_IMPORTED_MODULE_1__.kr)
/* harmony export */ });
/* harmony import */ var _fillRectangle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10088);
/* harmony import */ var _fillCircle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(56789);





/***/ }),

/***/ 64485:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   x: () => (/* binding */ getClosestImageIdForStackViewport)
/* harmony export */ });
/* unused harmony export annotationHydration */
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _stateManagement_annotation_annotationState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(82056);
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3823);



function annotationHydration(viewport, toolName, worldPoints, options) {
    const viewReference = viewport.getViewReference();
    const { viewPlaneNormal, FrameOfReferenceUID } = viewReference;
    const annotation = {
        annotationUID: options?.annotationUID || utilities.uuidv4(),
        data: {
            handles: {
                points: worldPoints,
            },
        },
        highlighted: false,
        autoGenerated: false,
        invalidated: false,
        isLocked: false,
        isVisible: true,
        metadata: {
            toolName,
            viewPlaneNormal,
            FrameOfReferenceUID,
            referencedImageId: getReferencedImageId(viewport, worldPoints[0], viewPlaneNormal),
            ...options,
        },
    };
    addAnnotation(annotation, viewport.element);
    return annotation;
}
function getReferencedImageId(viewport, worldPos, viewPlaneNormal) {
    let referencedImageId;
    if (viewport instanceof StackViewport) {
        referencedImageId = getClosestImageIdForStackViewport(viewport, worldPos, viewPlaneNormal);
    }
    else if (viewport instanceof BaseVolumeViewport) {
        const targetId = getTargetId(viewport);
        const volumeId = utilities.getVolumeId(targetId);
        const imageVolume = cache.getVolume(volumeId);
        referencedImageId = utilities.getClosestImageId(imageVolume, worldPos, viewPlaneNormal);
    }
    else {
        throw new Error('getReferencedImageId: viewport must be a StackViewport or BaseVolumeViewport');
    }
    return referencedImageId;
}
function getTargetId(viewport) {
    const targetId = viewport.getViewReferenceId?.();
    if (targetId) {
        return targetId;
    }
    if (viewport instanceof BaseVolumeViewport) {
        return `volumeId:${getTargetVolumeId(viewport)}`;
    }
    throw new Error('getTargetId: viewport must have a getTargetId method');
}
function getTargetVolumeId(viewport) {
    const actorEntries = viewport.getActors();
    if (!actorEntries) {
        return;
    }
    return actorEntries.find((actorEntry) => actorEntry.actor.getClassName() === 'vtkVolume')?.uid;
}
function getClosestImageIdForStackViewport(viewport, worldPos, viewPlaneNormal) {
    const imageIds = viewport.getImageIds();
    if (!imageIds || !imageIds.length) {
        return;
    }
    const distanceImagePairs = imageIds.map((imageId) => {
        const { imagePositionPatient } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.metaData.get('imagePlaneModule', imageId);
        const distance = calculateDistanceToImage(worldPos, imagePositionPatient, viewPlaneNormal);
        return { imageId, distance };
    });
    distanceImagePairs.sort((a, b) => a.distance - b.distance);
    return distanceImagePairs[0].imageId;
}
function calculateDistanceToImage(worldPos, ImagePositionPatient, viewPlaneNormal) {
    const dir = gl_matrix__WEBPACK_IMPORTED_MODULE_2__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_2__/* .vec3.sub */ .eR.sub(dir, worldPos, ImagePositionPatient);
    const dot = gl_matrix__WEBPACK_IMPORTED_MODULE_2__/* .vec3.dot */ .eR.dot(dir, viewPlaneNormal);
    return Math.abs(dot);
}



/***/ }),

/***/ 76802:
/***/ (() => {

function extend2DBoundingBoxInViewAxis(boundsIJK, numSlicesToProject) {
    const sliceNormalIndex = boundsIJK.findIndex(([min, max]) => min === max);
    if (sliceNormalIndex === -1) {
        throw new Error('3D bounding boxes not supported in an oblique plane');
    }
    boundsIJK[sliceNormalIndex][0] -= numSlicesToProject;
    boundsIJK[sliceNormalIndex][1] += numSlicesToProject;
    return boundsIJK;
}
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (extend2DBoundingBoxInViewAxis)));


/***/ }),

/***/ 87063:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   g: () => (/* binding */ getBoundingBoxAroundShapeIJK)
/* harmony export */ });
/* unused harmony export getBoundingBoxAroundShapeWorld */
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);

const { EPSILON } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.CONSTANTS;
function calculateBoundingBox(points, dimensions, isWorld = false) {
    let xMin = Infinity;
    let xMax = isWorld ? -Infinity : 0;
    let yMin = Infinity;
    let yMax = isWorld ? -Infinity : 0;
    let zMin = Infinity;
    let zMax = isWorld ? -Infinity : 0;
    const is3D = points[0]?.length === 3;
    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        xMin = Math.min(p[0], xMin);
        xMax = Math.max(p[0], xMax);
        yMin = Math.min(p[1], yMin);
        yMax = Math.max(p[1], yMax);
        if (is3D) {
            zMin = Math.min(p[2] ?? zMin, zMin);
            zMax = Math.max(p[2] ?? zMax, zMax);
        }
    }
    if (dimensions) {
        xMin = Math.max(isWorld ? dimensions[0] + EPSILON : 0, xMin);
        xMax = Math.min(isWorld ? dimensions[0] - EPSILON : dimensions[0] - 1, xMax);
        yMin = Math.max(isWorld ? dimensions[1] + EPSILON : 0, yMin);
        yMax = Math.min(isWorld ? dimensions[1] - EPSILON : dimensions[1] - 1, yMax);
        if (is3D && dimensions.length === 3) {
            zMin = Math.max(isWorld ? dimensions[2] + EPSILON : 0, zMin);
            zMax = Math.min(isWorld ? dimensions[2] - EPSILON : dimensions[2] - 1, zMax);
        }
    }
    else if (!isWorld) {
        xMin = Math.max(0, xMin);
        xMax = Math.min(Infinity, xMax);
        yMin = Math.max(0, yMin);
        yMax = Math.min(Infinity, yMax);
        if (is3D) {
            zMin = Math.max(0, zMin);
            zMax = Math.min(Infinity, zMax);
        }
    }
    return is3D
        ? [
            [xMin, xMax],
            [yMin, yMax],
            [zMin, zMax],
        ]
        : [[xMin, xMax], [yMin, yMax], null];
}
function getBoundingBoxAroundShapeIJK(points, dimensions) {
    return calculateBoundingBox(points, dimensions, false);
}
function getBoundingBoxAroundShapeWorld(points, clipBounds) {
    return calculateBoundingBox(points, clipBounds, true);
}


/***/ }),

/***/ 72282:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getBoundingBoxAroundShapeIJK: () => (/* reexport safe */ _getBoundingBoxAroundShape__WEBPACK_IMPORTED_MODULE_1__.g)
/* harmony export */ });
/* harmony import */ var _extend2DBoundingBoxInViewAxis__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(76802);
/* harmony import */ var _getBoundingBoxAroundShape__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(87063);





/***/ }),

/***/ 56534:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  addContourSegmentationAnnotation: () => (/* reexport */ contourSegmentation_addContourSegmentationAnnotation/* addContourSegmentationAnnotation */.V),
  createPolylineHole: () => (/* reexport */ sharedOperations/* createPolylineHole */.rK),
  removeContourSegmentationAnnotation: () => (/* reexport */ contourSegmentation_removeContourSegmentationAnnotation/* removeContourSegmentationAnnotation */.M)
});

// UNUSED EXPORTS: LogicalOperation, add, areSameSegment, checkIntersection, cleanupPolylines, combinePolylines, contourSegmentationOperation, convertContourPolylineToCanvasSpace, convertContourPolylineToWorld, convertContourSegmentationAnnotation, copy, copyAnnotation, copyContourSegment, createNewAnnotationFromPolyline, deleteOperation, findAllIntersectingContours, getContourHolesData, intersect, intersectPolylinesSets, isContourSegmentationAnnotation, processMultipleIntersections, removeDuplicatePoints, subtract, subtractAnnotationPolylines, subtractMultiplePolylineSets, subtractPolylineSets, unifyAnnotationPolylines, unifyMultiplePolylineSets, unifyPolylineSets, updateViewportsForAnnotations, xor, xorPolylinesSets

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contourSegmentation/areSameSegment.js
var areSameSegment = __webpack_require__(62854);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/index.js
var stateManagement = __webpack_require__(6802);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contourSegmentation/removeContourSegmentationAnnotation.js
var contourSegmentation_removeContourSegmentationAnnotation = __webpack_require__(37354);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contourSegmentation/addContourSegmentationAnnotation.js
var contourSegmentation_addContourSegmentationAnnotation = __webpack_require__(85263);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/annotation/helpers/state.js
var state = __webpack_require__(44049);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contourSegmentation/convertContourSegmentation.js





const DEFAULT_CONTOUR_SEG_TOOL_NAME = 'PlanarFreehandContourSegmentationTool';
function convertContourSegmentationAnnotation(annotation) {
    const { polyline } = annotation.data?.contour || {};
    if (!polyline || polyline.length < 3) {
        console.warn('Skipping creation of new annotation due to invalid polyline:', polyline);
        return;
    }
    removeAnnotation(annotation.annotationUID);
    removeContourSegmentationAnnotation(annotation);
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
        annotationUID: utilities.uuidv4(),
        highlighted: true,
        invalidated: true,
        isLocked: false,
        isVisible: undefined,
        interpolationUID: annotation.interpolationUID,
        interpolationCompleted: annotation.interpolationCompleted,
    };
    addAnnotation(newAnnotation, annotation.metadata.FrameOfReferenceUID);
    addContourSegmentationAnnotation(newAnnotation);
    triggerAnnotationModified(newAnnotation);
    return newAnnotation;
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contourSegmentation/copyAnnotation.js
var copyAnnotation = __webpack_require__(29031);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contourSegmentation/logicalOperators.js + 1 modules
var logicalOperators = __webpack_require__(21536);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contourSegmentation/isContourSegmentationAnnotation.js
var isContourSegmentationAnnotation = __webpack_require__(78130);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contourSegmentation/getIntersectingAnnotations.js
var getIntersectingAnnotations = __webpack_require__(3444);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contourSegmentation/mergeMultipleAnnotations.js
var mergeMultipleAnnotations = __webpack_require__(49941);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contourSegmentation/contourSegmentationOperation.js
var contourSegmentationOperation = __webpack_require__(1318);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contourSegmentation/sharedOperations.js
var sharedOperations = __webpack_require__(65172);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contourSegmentation/polylineUnify.js
var polylineUnify = __webpack_require__(98916);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contourSegmentation/polylineSubtract.js
var polylineSubtract = __webpack_require__(86591);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contourSegmentation/polylineIntersect.js
var polylineIntersect = __webpack_require__(52634);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contourSegmentation/polylineXor.js
var polylineXor = __webpack_require__(63890);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contourSegmentation/index.js


















/***/ }),

/***/ 46228:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   d1: () => (/* binding */ findContoursFromReducedSet)
/* harmony export */ });
/* unused harmony export findContours */
function findNextLink(line, lines, contourPoints) {
    let index = -1;
    lines.forEach((cell, i) => {
        if (index >= 0) {
            return;
        }
        if (cell.a == line.b) {
            index = i;
        }
    });
    if (index >= 0) {
        const nextLine = lines[index];
        lines.splice(index, 1);
        contourPoints.push(nextLine.b);
        if (contourPoints[0] == nextLine.b) {
            return {
                remainingLines: lines,
                contourPoints,
                type: 'CLOSED_PLANAR',
            };
        }
        return findNextLink(nextLine, lines, contourPoints);
    }
    return {
        remainingLines: lines,
        contourPoints,
        type: 'OPEN_PLANAR',
    };
}
function findContours(lines) {
    if (lines.length == 0) {
        return [];
    }
    const contourPoints = [];
    const firstCell = lines.shift();
    contourPoints.push(firstCell.a);
    contourPoints.push(firstCell.b);
    const result = findNextLink(firstCell, lines, contourPoints);
    if (result.remainingLines.length == 0) {
        return [
            {
                type: result.type,
                contourPoints: result.contourPoints,
            },
        ];
    }
    else {
        const extraContours = findContours(result.remainingLines);
        extraContours.push({
            type: result.type,
            contourPoints: result.contourPoints,
        });
        return extraContours;
    }
}
function findContoursFromReducedSet(lines) {
    return findContours(lines);
}
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ({
    findContours,
    findContoursFromReducedSet,
});


/***/ }),

/***/ 98013:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony export default */
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3823);


const { isEqual } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities;
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
        const distance = vec3.squaredDistance(point, handle);
        if (distance < closestDistance) {
            closestDistance = distance;
            return testIndex;
        }
        return closestIndex;
    }, -1);
}


/***/ }),

/***/ 37546:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   v: () => (/* binding */ getDeduplicatedVTKPolyDataPoints)
/* harmony export */ });
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
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ({ getDeduplicatedVTKPolyDataPoints });


/***/ }),

/***/ 473:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getTextBoxCoordsCanvas: () => (/* reexport safe */ _getTextBoxCoordsCanvas__WEBPACK_IMPORTED_MODULE_0__.A)
/* harmony export */ });
/* harmony import */ var _getTextBoxCoordsCanvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1239);




/***/ }),

/***/ 4096:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Op: () => (/* binding */ getCalibratedLengthUnitsAndScale)
/* harmony export */ });
/* unused harmony exports getCalibratedAspect, getCalibratedProbeUnitsAndValue */
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);

const { CalibrationTypes } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.Enums;
const PIXEL_UNITS = 'px';
const VOXEL_UNITS = 'voxels';
const SUPPORTED_REGION_DATA_TYPES = [
    1,
    2,
    3,
    4,
];
const SUPPORTED_LENGTH_VARIANT = [
    '3,3',
    '4,7',
];
const SUPPORTED_PROBE_VARIANT = (/* unused pure expression or super */ null && ([
    '4,3',
    '4,7',
]));
const UNIT_MAPPING = {
    0: 'px',
    1: 'percent',
    2: 'dB',
    3: 'cm',
    4: 'seconds',
    5: 'hertz',
    6: 'dB/seconds',
    7: 'cm/sec',
    8: 'cm\xb2',
    9: 'cm\xb2/s',
    0xc: 'degrees',
};
const EPS = 1e-3;
const SQUARE = '\xb2';
const getCalibratedLengthUnitsAndScale = (image, handles) => {
    const { calibration, hasPixelSpacing } = image;
    let unit = hasPixelSpacing ? 'mm' : PIXEL_UNITS;
    const volumeUnit = hasPixelSpacing ? 'mm\xb3' : VOXEL_UNITS;
    let areaUnit = unit + SQUARE;
    let scale = 1;
    let calibrationType = '';
    if (!calibration ||
        (!calibration.type && !calibration.sequenceOfUltrasoundRegions)) {
        return { unit, areaUnit, scale, volumeUnit };
    }
    if (calibration.type === CalibrationTypes.UNCALIBRATED) {
        return {
            unit: PIXEL_UNITS,
            areaUnit: PIXEL_UNITS + SQUARE,
            scale,
            volumeUnit: VOXEL_UNITS,
        };
    }
    if (calibration.sequenceOfUltrasoundRegions) {
        let imageIndex1, imageIndex2;
        if (Array.isArray(handles) && handles.length === 2) {
            [imageIndex1, imageIndex2] = handles;
        }
        else if (typeof handles === 'function') {
            const points = handles();
            imageIndex1 = points[0];
            imageIndex2 = points[1];
        }
        let regions = calibration.sequenceOfUltrasoundRegions.filter((region) => imageIndex1[0] >= region.regionLocationMinX0 &&
            imageIndex1[0] <= region.regionLocationMaxX1 &&
            imageIndex1[1] >= region.regionLocationMinY0 &&
            imageIndex1[1] <= region.regionLocationMaxY1 &&
            imageIndex2[0] >= region.regionLocationMinX0 &&
            imageIndex2[0] <= region.regionLocationMaxX1 &&
            imageIndex2[1] >= region.regionLocationMinY0 &&
            imageIndex2[1] <= region.regionLocationMaxY1);
        if (!regions?.length) {
            return { unit, areaUnit, scale, volumeUnit };
        }
        regions = regions.filter((region) => SUPPORTED_REGION_DATA_TYPES.includes(region.regionDataType) &&
            SUPPORTED_LENGTH_VARIANT.includes(`${region.physicalUnitsXDirection},${region.physicalUnitsYDirection}`));
        if (!regions.length) {
            return {
                unit: PIXEL_UNITS,
                areaUnit: PIXEL_UNITS + SQUARE,
                scale,
                volumeUnit: VOXEL_UNITS,
            };
        }
        const region = regions[0];
        const physicalDeltaX = Math.abs(region.physicalDeltaX);
        const physicalDeltaY = Math.abs(region.physicalDeltaY);
        const isSamePhysicalDelta = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities.isEqual(physicalDeltaX, physicalDeltaY, EPS);
        if (isSamePhysicalDelta) {
            scale = 1 / physicalDeltaX;
            calibrationType = 'US Region';
            unit = UNIT_MAPPING[region.physicalUnitsXDirection] || 'unknown';
            areaUnit = unit + SQUARE;
        }
        else {
            return {
                unit: PIXEL_UNITS,
                areaUnit: PIXEL_UNITS + SQUARE,
                scale,
                volumeUnit: VOXEL_UNITS,
            };
        }
    }
    else if (calibration.scale) {
        scale = calibration.scale;
    }
    const types = [
        CalibrationTypes.ERMF,
        CalibrationTypes.USER,
        CalibrationTypes.ERROR,
        CalibrationTypes.PROJECTION,
        CalibrationTypes.CALIBRATED,
        CalibrationTypes.UNKNOWN,
    ];
    if (types.includes(calibration?.type)) {
        calibrationType = calibration.type;
    }
    return {
        unit: unit + (calibrationType ? ` ${calibrationType}` : ''),
        areaUnit: areaUnit + (calibrationType ? ` ${calibrationType}` : ''),
        scale,
        volumeUnit: volumeUnit + (calibrationType ? ` ${calibrationType}` : ''),
    };
};
const getCalibratedProbeUnitsAndValue = (image, handles) => {
    const [imageIndex] = handles;
    const { calibration } = image;
    let units = ['raw'];
    let values = [null];
    let calibrationType = '';
    if (!calibration ||
        (!calibration.type && !calibration.sequenceOfUltrasoundRegions)) {
        return { units, values };
    }
    if (calibration.sequenceOfUltrasoundRegions) {
        const supportedRegionsMetadata = calibration.sequenceOfUltrasoundRegions.filter((region) => SUPPORTED_REGION_DATA_TYPES.includes(region.regionDataType) &&
            SUPPORTED_PROBE_VARIANT.includes(`${region.physicalUnitsXDirection},${region.physicalUnitsYDirection}`));
        if (!supportedRegionsMetadata?.length) {
            return { units, values };
        }
        const region = supportedRegionsMetadata.find((region) => imageIndex[0] >= region.regionLocationMinX0 &&
            imageIndex[0] <= region.regionLocationMaxX1 &&
            imageIndex[1] >= region.regionLocationMinY0 &&
            imageIndex[1] <= region.regionLocationMaxY1);
        if (!region) {
            return { units, values };
        }
        const { referencePixelX0 = 0, referencePixelY0 = 0 } = region;
        const { physicalDeltaX, physicalDeltaY } = region;
        const yValue = (imageIndex[1] - region.regionLocationMinY0 - referencePixelY0) *
            physicalDeltaY;
        const xValue = (imageIndex[0] - region.regionLocationMinX0 - referencePixelX0) *
            physicalDeltaX;
        calibrationType = 'US Region';
        values = [xValue, yValue];
        units = [
            UNIT_MAPPING[region.physicalUnitsXDirection],
            UNIT_MAPPING[region.physicalUnitsYDirection],
        ];
    }
    return {
        units,
        values,
        calibrationType,
    };
};
const getCalibratedAspect = (image) => image.calibration?.aspect || 1;



/***/ }),

/***/ 4296:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   l: () => (/* binding */ getSphereBoundsInfoFromViewport)
/* harmony export */ });
/* unused harmony export getSphereBoundsInfo */
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3823);
/* harmony import */ var _boundingBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(72282);



const { transformWorldToIndex } = _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.utilities;
function _getSphereBoundsInfo(circlePoints, imageData, directionVectors) {
    const [bottom, top] = circlePoints;
    const centerWorld = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.fromValues */ .eR.fromValues((bottom[0] + top[0]) / 2, (bottom[1] + top[1]) / 2, (bottom[2] + top[2]) / 2);
    const radiusWorld = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.distance */ .eR.distance(bottom, top) / 2;
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
    const rowCosine = vec3.fromValues(direction[0], direction[1], direction[2]);
    const columnCosine = vec3.fromValues(direction[3], direction[4], direction[5]);
    const scanAxis = vec3.fromValues(direction[6], direction[7], direction[8]);
    const viewPlaneNormal = vec3.negate(vec3.create(), scanAxis);
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
    const camera = viewport.getCamera();
    const viewUp = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.fromValues */ .eR.fromValues(camera.viewUp[0], camera.viewUp[1], camera.viewUp[2]);
    const viewPlaneNormal = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.fromValues */ .eR.fromValues(camera.viewPlaneNormal[0], camera.viewPlaneNormal[1], camera.viewPlaneNormal[2]);
    const viewRight = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.cross */ .eR.cross(viewRight, viewUp, viewPlaneNormal);
    const directionVectors = {
        row: viewRight,
        normal: viewPlaneNormal,
        column: gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.negate */ .eR.negate(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.create */ .eR.create(), viewUp),
    };
    return _getSphereBoundsInfo(circlePoints, imageData, directionVectors);
}
function _computeBoundsIJK(imageData, directionVectors, circlePoints, centerWorld, radiusWorld) {
    const dimensions = imageData.getDimensions();
    const { row: rowCosine, column: columnCosine, normal: vecNormal, } = directionVectors;
    const topLeftWorld = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.create */ .eR.create();
    const bottomRightWorld = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.create */ .eR.create();
    gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.scaleAndAdd */ .eR.scaleAndAdd(topLeftWorld, centerWorld, vecNormal, radiusWorld);
    gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.scaleAndAdd */ .eR.scaleAndAdd(bottomRightWorld, centerWorld, vecNormal, -radiusWorld);
    gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.scaleAndAdd */ .eR.scaleAndAdd(topLeftWorld, topLeftWorld, columnCosine, -radiusWorld);
    gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.scaleAndAdd */ .eR.scaleAndAdd(bottomRightWorld, bottomRightWorld, columnCosine, radiusWorld);
    gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.scaleAndAdd */ .eR.scaleAndAdd(topLeftWorld, topLeftWorld, rowCosine, -radiusWorld);
    gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.scaleAndAdd */ .eR.scaleAndAdd(bottomRightWorld, bottomRightWorld, rowCosine, radiusWorld);
    const topLeftIJK = transformWorldToIndex(imageData, topLeftWorld);
    const bottomRightIJK = transformWorldToIndex(imageData, bottomRightWorld);
    const pointsIJK = circlePoints.map((p) => transformWorldToIndex(imageData, p));
    const boundsIJK = (0,_boundingBox__WEBPACK_IMPORTED_MODULE_2__.getBoundingBoxAroundShapeIJK)([topLeftIJK, bottomRightIJK, ...pointsIJK], dimensions);
    return { boundsIJK, topLeftWorld, bottomRightWorld };
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

/***/ 88638:
/***/ (() => {


// UNUSED EXPORTS: distanceToPoint, distanceToPointSquared, intersectAABB

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/aabb/intersectAABB.js
function intersectAABB(aabb1, aabb2) {
    return (aabb1.minX <= aabb2.maxX &&
        aabb1.maxX >= aabb2.minX &&
        aabb1.minY <= aabb2.maxY &&
        aabb1.maxY >= aabb2.minY);
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/aabb/distanceToPointSquared.js
function distanceToPointSquared_distanceToPointSquared(aabb, point) {
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

/* unused harmony export default */
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);

function angleBetween3DLines(line1, line2) {
    const [p1, p2] = line1;
    const [p3, p4] = line2;
    const v1 = vec3.sub(vec3.create(), p2, p1);
    const v2 = vec3.sub(vec3.create(), p3, p4);
    const dot = vec3.dot(v1, v2);
    const v1Length = vec3.length(v1);
    const v2Length = vec3.length(v2);
    const cos = dot / (v1Length * v2Length);
    const radian = Math.acos(cos);
    return (radian * 180) / Math.PI;
}
function angleBetween2DLines(line1, line2) {
    const [p1, p2] = line1;
    const [p3, p4] = line2;
    const v1 = vec2.sub(vec2.create(), p2, p1);
    const v2 = vec2.sub(vec2.create(), p3, p4);
    const dot = vec2.dot(v1, v2);
    const v1Length = vec2.length(v1);
    const v2Length = vec2.length(v2);
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
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

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

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BasicStatsCalculator: () => (/* reexport safe */ _BasicStatsCalculator__WEBPACK_IMPORTED_MODULE_0__.O)
/* harmony export */ });
/* harmony import */ var _BasicStatsCalculator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(69013);
/* harmony import */ var _Calculator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(28364);





/***/ }),

/***/ 77081:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {


// UNUSED EXPORTS: getCanvasCircleCorners, getCanvasCircleRadius

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/point/index.js + 3 modules
var point = __webpack_require__(82216);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/circle/getCanvasCircleRadius.js

function getCanvasCircleRadius(circleCanvasPoints) {
    const [center, end] = circleCanvasPoints;
    return distanceToPoint(center, end);
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/circle/getCanvasCircleCorners.js

function getCanvasCircleCorners(circleCanvasPoints) {
    const [center, end] = circleCanvasPoints;
    const radius = distanceToPoint(center, end);
    const topLeft = [center[0] - radius, center[1] - radius];
    const bottomRight = [center[0] + radius, center[1] + radius];
    return [topLeft, bottomRight];
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/circle/index.js





/***/ }),

/***/ 87009:
/***/ (() => {


// UNUSED EXPORTS: getCanvasEllipseCorners, pointInEllipse, precalculatePointInEllipse

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

/***/ 95527:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   point: () => (/* reexport module object */ _point__WEBPACK_IMPORTED_MODULE_5__),
/* harmony export */   polyline: () => (/* reexport module object */ _polyline__WEBPACK_IMPORTED_MODULE_6__)
/* harmony export */ });
/* harmony import */ var _aabb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(88638);
/* harmony import */ var _basic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(73262);
/* harmony import */ var _circle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(77081);
/* harmony import */ var _ellipse__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(87009);
/* harmony import */ var _line__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(93258);
/* harmony import */ var _point__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(82216);
/* harmony import */ var _polyline__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(92984);
/* harmony import */ var _rectangle__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(33657);
/* harmony import */ var _vec2__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(23324);
/* harmony import */ var _angle__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(83923);













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

/***/ 93258:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   distanceToPoint: () => (/* reexport safe */ _distanceToPoint__WEBPACK_IMPORTED_MODULE_0__.A),
/* harmony export */   distanceToPointSquared: () => (/* reexport safe */ _distanceToPointSquared__WEBPACK_IMPORTED_MODULE_1__.A),
/* harmony export */   intersectLine: () => (/* reexport safe */ _intersectLine__WEBPACK_IMPORTED_MODULE_3__.A),
/* harmony export */   isPointOnLineSegment: () => (/* reexport safe */ _isPointOnLineSegment__WEBPACK_IMPORTED_MODULE_4__.A)
/* harmony export */ });
/* harmony import */ var _distanceToPoint__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(86978);
/* harmony import */ var _distanceToPointSquared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18989);
/* harmony import */ var _distanceToPointSquaredInfo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(73149);
/* harmony import */ var _intersectLine__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(81205);
/* harmony import */ var _isPointOnLineSegment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(91818);








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

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   distanceToPoint: () => (/* reexport safe */ _distanceToPoint__WEBPACK_IMPORTED_MODULE_0__.A)
/* harmony export */ });
/* harmony import */ var _distanceToPoint__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(87105);




/***/ }),

/***/ 23324:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

/* harmony import */ var _findClosestPoint__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(90554);
/* harmony import */ var _liangBarksyClip__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(35381);





/***/ }),

/***/ 35381:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony export default */
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

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   filterAnnotationsForDisplay: () => (/* reexport safe */ _filterAnnotationsForDisplay__WEBPACK_IMPORTED_MODULE_2__.A),
/* harmony export */   filterAnnotationsWithinSamePlane: () => (/* reexport safe */ _filterAnnotationsWithinPlane__WEBPACK_IMPORTED_MODULE_6__.W)
/* harmony export */ });
/* harmony import */ var _filterAnnotationsWithinSlice__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(36374);
/* harmony import */ var _getWorldWidthAndHeightFromCorners__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(35489);
/* harmony import */ var _filterAnnotationsForDisplay__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(94418);
/* harmony import */ var _getWorldWidthAndHeightFromTwoPoints__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(62514);
/* harmony import */ var _getPointInLineOfSightWithCriteria__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(57063);
/* harmony import */ var _isPlaneIntersectingAABB__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(30698);
/* harmony import */ var _filterAnnotationsWithinPlane__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(40770);







/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ({
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

/***/ 60199:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   H: () => (/* binding */ createBidirectionalForSlice)
/* harmony export */ });
/* unused harmony export default */
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3823);
/* harmony import */ var _isLineInSegment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(60213);


const EPSILON = 1e-2;
function findLargestBidirectional(contours, segVolumeId, segment) {
    const { sliceContours } = contours;
    const { segmentIndex, containedSegmentIndices } = segment;
    let maxBidirectional;
    const isInSegment = createIsInSegment(segVolumeId, segmentIndex, containedSegmentIndices);
    for (const sliceContour of sliceContours) {
        const bidirectional = createBidirectionalForSlice(sliceContour, isInSegment, maxBidirectional);
        if (!bidirectional) {
            continue;
        }
        maxBidirectional = bidirectional;
    }
    if (maxBidirectional) {
        Object.assign(maxBidirectional, segment);
    }
    return maxBidirectional;
}
function createBidirectionalForSlice(sliceContour, isInSegment, currentMax = { maxMajor: 0, maxMinor: 0 }) {
    const { points } = sliceContour.polyData;
    const { maxMinor: currentMaxMinor, maxMajor: currentMaxMajor } = currentMax;
    let maxMajor = currentMaxMajor * currentMaxMajor;
    let maxMinor = currentMaxMinor * currentMaxMinor;
    let maxMajorPoints;
    for (let index1 = 0; index1 < points.length; index1++) {
        for (let index2 = index1 + 1; index2 < points.length; index2++) {
            const point1 = points[index1];
            const point2 = points[index2];
            const distance2 = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.sqrDist */ .eR.sqrDist(point1, point2);
            if (distance2 < maxMajor) {
                continue;
            }
            if (distance2 - EPSILON < maxMajor + EPSILON && maxMajorPoints) {
                continue;
            }
            if (!isInSegment.testCenter(point1, point2)) {
                continue;
            }
            if (!(0,_isLineInSegment__WEBPACK_IMPORTED_MODULE_1__/* .isLineInSegment */ .pW)(point1, point2, isInSegment)) {
                continue;
            }
            maxMajor = distance2 - EPSILON;
            maxMajorPoints = [index1, index2];
            maxMinor = 0;
        }
    }
    if (!maxMajorPoints) {
        return;
    }
    maxMajor = Math.sqrt(maxMajor + EPSILON);
    const handle0 = points[maxMajorPoints[0]];
    const handle1 = points[maxMajorPoints[1]];
    const unitMajor = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.sub */ .eR.sub(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create(), handle0, handle1);
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.scale */ .eR.scale(unitMajor, unitMajor, 1 / maxMajor);
    let maxMinorPoints;
    for (let index1 = 0; index1 < points.length; index1++) {
        for (let index2 = index1 + 1; index2 < points.length; index2++) {
            const point1 = points[index1];
            const point2 = points[index2];
            const distance2 = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.sqrDist */ .eR.sqrDist(point1, point2);
            if (distance2 <= maxMinor) {
                continue;
            }
            const delta = gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.sub */ .eR.sub(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.create */ .eR.create(), point1, point2);
            const dot = Math.abs(gl_matrix__WEBPACK_IMPORTED_MODULE_0__/* .vec3.dot */ .eR.dot(delta, unitMajor)) / Math.sqrt(distance2);
            if (dot > EPSILON) {
                continue;
            }
            if (!isInSegment.testCenter(point1, point2)) {
                continue;
            }
            if (!(0,_isLineInSegment__WEBPACK_IMPORTED_MODULE_1__/* .isLineInSegment */ .pW)(point1, point2, isInSegment)) {
                continue;
            }
            maxMinor = distance2;
            maxMinorPoints = [index1, index2];
        }
    }
    if (!maxMinorPoints) {
        return;
    }
    maxMinor = Math.sqrt(maxMinor);
    const handle2 = points[maxMinorPoints[0]];
    const handle3 = points[maxMinorPoints[1]];
    const bidirectional = {
        majorAxis: [handle0, handle1],
        minorAxis: [handle2, handle3],
        maxMajor,
        maxMinor,
        ...sliceContour,
    };
    return bidirectional;
}


/***/ }),

/***/ 14957:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony export getBrushToolInstances */
/* harmony import */ var _store_ToolGroupManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(77609);
/* harmony import */ var _tools_segmentation_BrushTool__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(48736);


function getBrushToolInstances(toolGroupId, toolName) {
    const toolGroup = getToolGroup(toolGroupId);
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
    const brushBasedToolInstances = Object.values(toolInstances).filter((toolInstance) => toolInstance instanceof BrushTool);
    return brushBasedToolInstances;
}


/***/ }),

/***/ 60213:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   On: () => (/* binding */ createIsInSegmentMetadata),
/* harmony export */   pW: () => (/* binding */ isLineInSegment)
/* harmony export */ });
/* unused harmony exports default, createIsInSegment */
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3823);


function isLineInSegment(point1, point2, isInSegment) {
    const ijk1 = isInSegment.toIJK(point1);
    const ijk2 = isInSegment.toIJK(point2);
    const testPoint = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.create */ .eR.create();
    const { testIJK } = isInSegment;
    const delta = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.sub */ .eR.sub(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.create */ .eR.create(), ijk1, ijk2);
    const testSize = Math.round(Math.max(...delta.map(Math.abs)));
    if (testSize < 2) {
        return true;
    }
    const unitDelta = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.scale */ .eR.scale(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.create */ .eR.create(), delta, 1 / testSize);
    for (let i = 1; i < testSize; i++) {
        gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.scaleAndAdd */ .eR.scaleAndAdd(testPoint, ijk2, unitDelta, i);
        if (!testIJK(testPoint)) {
            return false;
        }
    }
    return true;
}
function createIsInSegmentMetadata({ dimensions, imageData, voxelManager, segmentIndex, containedSegmentIndices, }) {
    const width = dimensions[0];
    const pixelsPerSlice = width * dimensions[1];
    return {
        testCenter: (point1, point2) => {
            const point = gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.add */ .eR.add(gl_matrix__WEBPACK_IMPORTED_MODULE_1__/* .vec3.create */ .eR.create(), point1, point2).map((it) => it / 2);
            const ijk = imageData.worldToIndex(point).map(Math.round);
            const [i, j, k] = ijk;
            const index = i + j * width + k * pixelsPerSlice;
            const value = voxelManager.getAtIndex(index);
            return value === segmentIndex || containedSegmentIndices?.has(value);
        },
        toIJK: (point) => imageData.worldToIndex(point),
        testIJK: (ijk) => {
            const [i, j, k] = ijk;
            const index = Math.round(i) + Math.round(j) * width + Math.round(k) * pixelsPerSlice;
            const value = voxelManager.getAtIndex(index);
            return value === segmentIndex || containedSegmentIndices?.has(value);
        },
    };
}
function createIsInSegment(segVolumeId, segmentIndex, containedSegmentIndices) {
    const vol = cache.getVolume(segVolumeId);
    if (!vol) {
        console.warn(`No volume found for ${segVolumeId}`);
        return;
    }
    return createIsInSegmentMetadata({
        dimensions: vol.dimensions,
        imageData: vol.imageData,
        voxelManager: vol.voxelManager,
        segmentIndex,
        containedSegmentIndices,
    });
}



/***/ }),

/***/ 94779:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _: () => (/* binding */ triggerAnnotationRenderForToolGroupIds)
/* harmony export */ });
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _triggerAnnotationRender__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(56069);
/* harmony import */ var _store_ToolGroupManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(77609);



function triggerAnnotationRenderForToolGroupIds(toolGroupIds) {
    toolGroupIds.forEach((toolGroupId) => {
        const toolGroup = (0,_store_ToolGroupManager__WEBPACK_IMPORTED_MODULE_2__.getToolGroup)(toolGroupId);
        if (!toolGroup) {
            console.warn(`ToolGroup not available for ${toolGroupId}`);
            return;
        }
        const viewportsInfo = toolGroup.getViewportsInfo();
        viewportsInfo.forEach((viewportInfo) => {
            const { renderingEngineId, viewportId } = viewportInfo;
            const renderingEngine = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getRenderingEngine)(renderingEngineId);
            if (!renderingEngine) {
                console.warn(`RenderingEngine not available for ${renderingEngineId}`);
                return;
            }
            const viewport = renderingEngine.getViewport(viewportId);
            (0,_triggerAnnotationRender__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(viewport.element);
        });
    });
}
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (triggerAnnotationRenderForToolGroupIds)));


/***/ }),

/***/ 58640:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony export triggerAnnotationRenderForViewportIds */
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15327);
/* harmony import */ var _triggerAnnotationRender__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(56069);


function triggerAnnotationRenderForViewportIds(viewportIdsToRender) {
    if (!viewportIdsToRender.length) {
        return;
    }
    viewportIdsToRender.forEach((viewportId) => {
        const enabledElement = (0,_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_0__.getEnabledElementByViewportId)(viewportId);
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
        (0,_triggerAnnotationRender__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(element);
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (triggerAnnotationRenderForViewportIds);


/***/ }),

/***/ 60810:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getViewportIdsWithToolToRender: () => (/* reexport safe */ _getViewportIdsWithToolToRender__WEBPACK_IMPORTED_MODULE_2__.A)
/* harmony export */ });
/* harmony import */ var _filterViewportsWithFrameOfReferenceUID__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3198);
/* harmony import */ var _filterViewportsWithToolEnabled__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9356);
/* harmony import */ var _getViewportIdsWithToolToRender__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(14543);
/* harmony import */ var _filterViewportsWithParallelNormals__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(67514);







/***/ }),

/***/ 6477:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {


// EXTERNAL MODULE: ../../../node_modules/comlink/dist/esm/comlink.mjs
var comlink = __webpack_require__(99178);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/VolumetricCalculator.js
var VolumetricCalculator = __webpack_require__(68915);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/SegmentStatsCalculator.js

class SegmentStatsCalculator {
    static { this.calculators = new Map(); }
    static { this.indices = []; }
    static { this.mode = 'collective'; }
    static statsInit(options) {
        const { storePointData, indices, mode } = options;
        this.mode = mode;
        this.indices = indices;
        this.calculators.clear();
        if (this.mode === 'individual') {
            indices.forEach((index) => {
                this.calculators.set(index, new VolumetricCalculator/* InstanceVolumetricCalculator */.C3({ storePointData }));
            });
        }
        else {
            this.calculators.set(indices, new VolumetricCalculator/* InstanceVolumetricCalculator */.C3({ storePointData }));
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

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/thresholdVolumeByRange.js
var thresholdVolumeByRange = __webpack_require__(8582);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/rectangleROIThresholdVolumeByRange.js
var rectangleROIThresholdVolumeByRange = __webpack_require__(52323);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/createMergedLabelmapForIndex.js
var createMergedLabelmapForIndex = __webpack_require__(4334);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/createLabelmapVolumeForViewport.js
var createLabelmapVolumeForViewport = __webpack_require__(97492);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js + 2 modules
var enums = __webpack_require__(99737);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/SegmentationRepresentations.js
var enums_SegmentationRepresentations = __webpack_require__(18682);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getSegmentationRepresentation.js
var getSegmentationRepresentation = __webpack_require__(93210);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Surface/surfaceDisplay.js
var surfaceDisplay = __webpack_require__(67014);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Contour/contourDisplay.js
var contourDisplay = __webpack_require__(25894);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/displayTools/Labelmap/labelmapDisplay.js
var labelmapDisplay = __webpack_require__(684);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/store/addTool.js
var addTool = __webpack_require__(68040);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/store/state.js
var state = __webpack_require__(85204);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/annotation/PlanarFreehandContourSegmentationTool.js
var PlanarFreehandContourSegmentationTool = __webpack_require__(37590);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/store/ToolGroupManager/index.js + 6 modules
var ToolGroupManager = __webpack_require__(77609);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/SegmentationRenderingEngine.js











const renderers = {
    [enums_SegmentationRepresentations/* default */.A.Labelmap]: labelmapDisplay/* default */.Ay,
    [enums_SegmentationRepresentations/* default */.A.Contour]: contourDisplay/* default */.A,
    [enums_SegmentationRepresentations/* default */.A.Surface]: surfaceDisplay/* default */.Ay,
};
const planarContourToolName = PlanarFreehandContourSegmentationTool/* default */.A.toolName;
class SegmentationRenderingEngine {
    constructor() {
        this._needsRender = new Set();
        this._pendingRenderQueue = [];
        this._animationFrameSet = false;
        this._animationFrameHandle = null;
        this._getAllViewports = () => {
            const renderingEngine = (0,esm.getRenderingEngines)();
            return renderingEngine.flatMap((renderingEngine) => renderingEngine.getViewports());
        };
        this._renderFlaggedSegmentations = () => {
            this._throwIfDestroyed();
            const viewportIds = Array.from(this._needsRender);
            viewportIds.forEach((viewportId) => {
                this._triggerRender(viewportId);
            });
            this._needsRender.clear();
            this._animationFrameSet = false;
            this._animationFrameHandle = null;
            if (this._pendingRenderQueue.length > 0) {
                const nextViewportIds = this._pendingRenderQueue.shift();
                if (nextViewportIds && nextViewportIds.length > 0) {
                    this._setViewportsToBeRenderedNextFrame(nextViewportIds);
                }
            }
        };
    }
    renderSegmentationsForViewport(viewportId) {
        const viewportIds = viewportId
            ? [viewportId]
            : this._getViewportIdsForSegmentation();
        this._setViewportsToBeRenderedNextFrame(viewportIds);
    }
    renderSegmentation(segmentationId) {
        const viewportIds = this._getViewportIdsForSegmentation(segmentationId);
        this._setViewportsToBeRenderedNextFrame(viewportIds);
    }
    _getViewportIdsForSegmentation(segmentationId) {
        const viewports = this._getAllViewports();
        const viewportIds = [];
        for (const viewport of viewports) {
            const viewportId = viewport.id;
            if (segmentationId) {
                const segmentationRepresentations = (0,getSegmentationRepresentation/* getSegmentationRepresentations */.r$)(viewportId, { segmentationId });
                if (segmentationRepresentations?.length > 0) {
                    viewportIds.push(viewportId);
                }
            }
            else {
                const segmentationRepresentations = (0,getSegmentationRepresentation/* getSegmentationRepresentations */.r$)(viewportId);
                if (segmentationRepresentations?.length > 0) {
                    viewportIds.push(viewportId);
                }
            }
        }
        return viewportIds;
    }
    _throwIfDestroyed() {
        if (this.hasBeenDestroyed) {
            throw new Error('this.destroy() has been manually called to free up memory, can not longer use this instance. Instead make a new one.');
        }
    }
    _setViewportsToBeRenderedNextFrame(viewportIds) {
        if (this._animationFrameSet) {
            this._pendingRenderQueue.push(viewportIds);
            return;
        }
        viewportIds.forEach((viewportId) => {
            this._needsRender.add(viewportId);
        });
        this._render();
    }
    _render() {
        if (this._needsRender.size > 0 && this._animationFrameSet === false) {
            this._animationFrameHandle = window.requestAnimationFrame(this._renderFlaggedSegmentations);
            this._animationFrameSet = true;
        }
    }
    _triggerRender(viewportId) {
        const segmentationRepresentations = (0,getSegmentationRepresentation/* getSegmentationRepresentations */.r$)(viewportId);
        if (!segmentationRepresentations?.length) {
            return;
        }
        const { viewport } = (0,esm.getEnabledElementByViewportId)(viewportId) || {};
        if (!viewport) {
            return;
        }
        const viewportRenderList = [];
        const segmentationRenderList = segmentationRepresentations.map((representation) => {
            if (representation.type === enums.SegmentationRepresentations.Contour) {
                this._addPlanarFreeHandToolIfAbsent(viewport);
            }
            const display = renderers[representation.type];
            try {
                const viewportId = display.render(viewport, representation);
                viewportRenderList.push(viewportId);
            }
            catch (error) {
                console.error(error);
            }
            return Promise.resolve({
                segmentationId: representation.segmentationId,
                type: representation.type,
            });
        });
        Promise.allSettled(segmentationRenderList).then((results) => {
            const segmentationDetails = results
                .filter((r) => r.status === 'fulfilled')
                .map((r) => r.value);
            function onSegmentationRender(evt) {
                const { element, viewportId } = evt.detail;
                element.removeEventListener(esm.Enums.Events.IMAGE_RENDERED, onSegmentationRender);
                segmentationDetails.forEach((detail) => {
                    const eventDetail = {
                        viewportId,
                        segmentationId: detail.segmentationId,
                        type: detail.type,
                    };
                    (0,esm.triggerEvent)(esm.eventTarget, enums.Events.SEGMENTATION_RENDERED, {
                        ...eventDetail,
                    });
                });
            }
            const element = viewport.element;
            element.addEventListener(esm.Enums.Events.IMAGE_RENDERED, onSegmentationRender);
            viewport.render();
        });
    }
    _addPlanarFreeHandToolIfAbsent(viewport) {
        if (!(planarContourToolName in state/* state */.wk.tools)) {
            (0,addTool/* addTool */.Gx)(PlanarFreehandContourSegmentationTool/* default */.A);
        }
        const toolGroup = (0,ToolGroupManager.getToolGroupForViewport)(viewport.id);
        if (!toolGroup.hasTool(planarContourToolName)) {
            toolGroup.addTool(planarContourToolName);
            toolGroup.setToolPassive(planarContourToolName);
        }
    }
}
function triggerSegmentationRender(viewportId) {
    segmentationRenderingEngine.renderSegmentationsForViewport(viewportId);
}
function triggerSegmentationRenderBySegmentationId(segmentationId) {
    segmentationRenderingEngine.renderSegmentation(segmentationId);
}
const segmentationRenderingEngine = new SegmentationRenderingEngine();


;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/floodFill.js
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
/* harmony default export */ const segmentation_floodFill = ((/* unused pure expression or super */ null && (floodFill)));

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/brushSizeForToolGroup.js
var brushSizeForToolGroup = __webpack_require__(17014);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/brushThresholdForToolGroup.js
var brushThresholdForToolGroup = __webpack_require__(49492);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/thresholdSegmentationByRange.js
var thresholdSegmentationByRange = __webpack_require__(73706);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/contourAndFindLargestBidirectional.js
var contourAndFindLargestBidirectional = __webpack_require__(13276);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/createBidirectionalToolData.js
var createBidirectionalToolData = __webpack_require__(14514);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/segmentContourAction.js
var segmentContourAction = __webpack_require__(22592);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/triggerAnnotationRenderForViewportIds.js
var utilities_triggerAnnotationRenderForViewportIds = __webpack_require__(58640);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getBrushToolInstances.js
var segmentation_getBrushToolInstances = __webpack_require__(14957);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/invalidateBrushCursor.js



function invalidateBrushCursor_invalidateBrushCursor(toolGroupId) {
    const toolGroup = getToolGroup(toolGroupId);
    if (toolGroup === undefined) {
        return;
    }
    const brushBasedToolInstances = getBrushToolInstances(toolGroupId);
    brushBasedToolInstances.forEach((tool) => {
        tool.invalidateBrushCursor();
    });
    const viewportsInfo = toolGroup.getViewportsInfo();
    const viewportsInfoArray = Object.keys(viewportsInfo).map((key) => viewportsInfo[key]);
    if (!viewportsInfoArray.length) {
        return;
    }
    const viewportIds = toolGroup.getViewportIds();
    triggerAnnotationRenderForViewportIds(viewportIds);
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getUniqueSegmentIndices.js
var getUniqueSegmentIndices = __webpack_require__(25758);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/segmentationState.js + 2 modules
var segmentationState = __webpack_require__(98870);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/index.js
var stateManagement = __webpack_require__(6802);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/index.js
var polyline = __webpack_require__(92984);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/getSegmentationActor.js
var getSegmentationActor = __webpack_require__(59452);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getSegmentIndexAtWorldPoint.js






function getSegmentIndexAtWorldPoint(segmentationId, worldPoint, options = {}) {
    const segmentation = getSegmentation(segmentationId);
    const representationData = segmentation.representationData;
    const desiredRepresentation = options?.representationType ?? Object.keys(representationData)[0];
    if (!desiredRepresentation) {
        throw new Error(`Segmentation ${segmentationId} does not have any representations`);
    }
    switch (desiredRepresentation) {
        case SegmentationRepresentations.Labelmap:
            return getSegmentIndexAtWorldForLabelmap(segmentation, worldPoint, options);
        case SegmentationRepresentations.Contour:
            return getSegmentIndexAtWorldForContour(segmentation, worldPoint, options);
        default:
            return;
    }
}
function getSegmentIndexAtWorldForLabelmap(segmentation, worldPoint, { viewport }) {
    const labelmapData = segmentation.representationData.Labelmap;
    if (viewport instanceof BaseVolumeViewport) {
        const { volumeId } = labelmapData;
        const segmentationVolume = cache.getVolume(volumeId);
        if (!segmentationVolume) {
            return;
        }
        const segmentIndex = segmentationVolume.imageData.getScalarValueFromWorld(worldPoint);
        return segmentIndex;
    }
    const segmentationImageIds = getCurrentLabelmapImageIdsForViewport(viewport.id, segmentation.segmentationId);
    if (segmentationImageIds.length > 1) {
        console.warn('Segment selection for labelmaps with multiple imageIds in stack viewports is not supported yet.');
        return;
    }
    const segmentationImageId = segmentationImageIds[0];
    const image = cache.getImage(segmentationImageId);
    if (!image) {
        return;
    }
    const segmentationActorEntry = getLabelmapActorEntry(viewport.id, segmentation.segmentationId);
    const imageData = segmentationActorEntry?.actor.getMapper().getInputData();
    const indexIJK = utilities.transformWorldToIndex(imageData, worldPoint);
    const dimensions = imageData.getDimensions();
    const voxelManager = (imageData.voxelManager ||
        utilities.VoxelManager.createScalarVolumeVoxelManager({
            dimensions,
            scalarData: imageData.getPointData().getScalars().getData(),
        }));
    const segmentIndex = voxelManager.getAtIJKPoint(indexIJK);
    return segmentIndex;
}
function getSegmentIndexAtWorldForContour(segmentation, worldPoint, { viewport }) {
    const contourData = segmentation.representationData.Contour;
    const segmentIndices = Array.from(contourData.annotationUIDsMap.keys());
    const { viewPlaneNormal } = viewport.getCamera();
    for (const segmentIndex of segmentIndices) {
        const annotationsSet = contourData.annotationUIDsMap.get(segmentIndex);
        if (!annotationsSet) {
            continue;
        }
        for (const annotationUID of annotationsSet) {
            const annotation = getAnnotation(annotationUID);
            if (!annotation) {
                continue;
            }
            const { polyline } = annotation.data.contour;
            if (!utilities.isEqual(viewPlaneNormal, annotation.metadata.viewPlaneNormal)) {
                continue;
            }
            if (isPointInsidePolyline3D(worldPoint, polyline)) {
                return Number(segmentIndex);
            }
        }
    }
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/index.js
var helpers = __webpack_require__(91963);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getSegmentIndexAtLabelmapBorder.js



function getSegmentIndexAtLabelmapBorder(segmentationId, worldPoint, { viewport, searchRadius }) {
    const segmentation = getSegmentation(segmentationId);
    const labelmapData = segmentation.representationData.Labelmap;
    if (viewport instanceof BaseVolumeViewport) {
        const { volumeId } = labelmapData;
        const segmentationVolume = cache.getVolume(volumeId);
        if (!segmentationVolume) {
            return;
        }
        const voxelManager = segmentationVolume.voxelManager;
        const imageData = segmentationVolume.imageData;
        const indexIJK = utilities.transformWorldToIndex(imageData, worldPoint);
        const segmentIndex = voxelManager.getAtIJK(indexIJK[0], indexIJK[1], indexIJK[2]);
        const canvasPoint = viewport.worldToCanvas(worldPoint);
        const onEdge = isSegmentOnEdgeCanvas(canvasPoint, segmentIndex, viewport, imageData, searchRadius);
        return onEdge ? segmentIndex : undefined;
    }
    const segmentationImageId = getCurrentLabelmapImageIdForViewport(viewport.id, segmentationId);
    const image = cache.getImage(segmentationImageId);
    if (!image) {
        return;
    }
    const segmentationActorEntry = getLabelmapActorEntry(viewport.id, segmentationId);
    const imageData = segmentationActorEntry?.actor.getMapper().getInputData();
    const indexIJK = utilities.transformWorldToIndex(imageData, worldPoint);
    const dimensions = imageData.getDimensions();
    const voxelManager = (imageData.voxelManager ||
        utilities.VoxelManager.createScalarVolumeVoxelManager({
            dimensions,
            scalarData: imageData.getPointData().getScalars().getData(),
        }));
    const segmentIndex = voxelManager.getAtIJKPoint(indexIJK);
    const onEdge = isSegmentOnEdgeIJK(indexIJK, dimensions, voxelManager, segmentIndex);
    return onEdge ? segmentIndex : undefined;
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
        const indexIJK = utilities.transformWorldToIndex(imageData, worldPoint);
        return voxelManager.getAtIJK(indexIJK[0], indexIJK[1], indexIJK[2]);
    };
    return isSegmentOnEdge(getNeighborIndex, segmentIndex, searchRadius);
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getHoveredContourSegmentationAnnotation.js


function getHoveredContourSegmentationAnnotation(segmentationId) {
    const segmentation = getSegmentation(segmentationId);
    const { annotationUIDsMap } = segmentation.representationData.Contour;
    for (const [segmentIndex, annotationUIDs] of annotationUIDsMap.entries()) {
        const highlightedAnnotationUID = Array.from(annotationUIDs).find((annotationUID) => getAnnotation(annotationUID).highlighted);
        if (highlightedAnnotationUID) {
            return segmentIndex;
        }
    }
    return undefined;
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/growCut/growCutShader.js
const shader = (/* unused pure expression or super */ null && (`
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
`));
/* harmony default export */ const growCutShader = ((/* unused pure expression or super */ null && (shader)));

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/growCut/runGrowCut.js


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
    const volume = cache.getVolume(referenceVolumeId);
    const labelmap = cache.getVolume(labelmapVolumeId);
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
        code: shaderCode,
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


// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/index.js + 1 modules
var gl_matrix_esm = __webpack_require__(3823);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/getSphereBoundsInfo.js
var utilities_getSphereBoundsInfo = __webpack_require__(4296);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/growCut/runGrowCutForSphere.js




const { transformWorldToIndex } = esm.utilities;
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
    const vecColumn = vec3.fromValues(direction[3], direction[4], direction[5]);
    const { center: sphereCenterPoint, radius: sphereRadius } = sphereInfo;
    const refVolImageData = referencedVolume.imageData;
    const topCirclePoint = vec3.scaleAndAdd(vec3.create(), sphereCenterPoint, vecColumn, -sphereRadius);
    const bottomCirclePoint = vec3.scaleAndAdd(vec3.create(), sphereCenterPoint, vecColumn, sphereRadius);
    const sphereBoundsInfo = getSphereBoundsInfo([bottomCirclePoint, topCirclePoint], refVolImageData);
    return _getGrowCutSphereBoundsInfo(referencedVolume, sphereBoundsInfo);
}
function _createSubVolumeFromSphere(referencedVolume, sphereInfo, viewport) {
    const refVolImageData = referencedVolume.imageData;
    const camera = viewport.getCamera();
    const { ijkVecRowDir, ijkVecColDir } = csUtils.getVolumeDirectionVectors(refVolImageData, camera);
    const obliqueView = [ijkVecRowDir, ijkVecColDir].some((vec) => !csUtils.isEqual(Math.abs(vec[0]), 1) &&
        !csUtils.isEqual(Math.abs(vec[1]), 1) &&
        !csUtils.isEqual(Math.abs(vec[2]), 1));
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
    return csUtils.createSubVolume(referencedVolume.volumeId, subVolumeBoundsIJK, {
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
    const { worldVecRowDir, worldVecSliceDir } = csUtils.getVolumeDirectionVectors(labelmap.imageData, viewport.getCamera());
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
    const worldQuat = quat.setAxisAngle(quat.create(), worldVecSliceDir, rotationAngle);
    const vecRotation = vec3.clone(worldVecRowDir);
    for (let i = 0; i < numCirclePoints; i++) {
        const worldCircleBorderPoint = vec3.scaleAndAdd(vec3.create(), sphereInfo.center, vecRotation, sphereInfo.radius);
        const ijkCircleBorderPoint = transformWorldToIndex(labelmap.imageData, worldCircleBorderPoint);
        const [x, y, z] = ijkCircleBorderPoint;
        vec3.transformQuat(vecRotation, vecRotation, worldQuat);
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
    const labelmap = await volumeLoader.createAndCacheDerivedLabelmapVolume(subVolume.volumeId);
    _setPositiveSeedValues(subVolume, labelmap, sphereInfo, options);
    _setNegativeSeedValues(subVolume, labelmap, sphereInfo, viewport, options);
    return labelmap;
}
async function runGrowCutForSphere(referencedVolumeId, sphereInfo, viewport, options) {
    const referencedVolume = cache.getVolume(referencedVolumeId);
    const subVolume = _createSubVolumeFromSphere(referencedVolume, sphereInfo, viewport);
    const labelmap = await _createAndCacheSegmentationSubVolumeForSphere(subVolume, sphereInfo, viewport, options);
    await run(subVolume.volumeId, labelmap.volumeId);
    return labelmap;
}


;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/growCut/runGrowCutForBoundingBox.js


const runGrowCutForBoundingBox_POSITIVE_SEED_VALUE = 254;
const runGrowCutForBoundingBox_NEGATIVE_SEED_VALUE = 255;
const NEGATIVE_PIXEL_RANGE = [-Infinity, -995];
const POSITIVE_PIXEL_RANGE = (/* unused pure expression or super */ null && ([0, 1900]));
function runGrowCutForBoundingBox_setNegativeSeedValues(subVolume, labelmap, options) {
    const { negativeSeedValue = runGrowCutForBoundingBox_NEGATIVE_SEED_VALUE, negativePixelRange = NEGATIVE_PIXEL_RANGE, } = options;
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
function runGrowCutForBoundingBox_setPositiveSeedValues(subVolume, labelmap, options) {
    const { positiveSeedValue = runGrowCutForBoundingBox_POSITIVE_SEED_VALUE, positivePixelRange = POSITIVE_PIXEL_RANGE, } = options;
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
    const labelmap = volumeLoader.createAndCacheDerivedLabelmapVolume(subVolume.volumeId);
    runGrowCutForBoundingBox_setPositiveSeedValues(subVolume, labelmap, options);
    runGrowCutForBoundingBox_setNegativeSeedValues(subVolume, labelmap, options);
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
    const subVolume = csUtils.createSubVolume(referencedVolumeId, subVolumeBoundsIJK, {
        targetBuffer: {
            type: 'Float32Array',
        },
    });
    const labelmap = await _createAndCacheSegmentationSubVolumeForBoundingBox(subVolume, options);
    await run(subVolume.volumeId, labelmap.volumeId);
    return labelmap;
}


;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/growCut/constants.js
const constants_POSITIVE_SEED_LABEL = 254;
const constants_NEGATIVE_SEED_LABEL = 255;
const constants_DEFAULT_NEIGHBORHOOD_RADIUS = 1;
const constants_DEFAULT_POSITIVE_STD_DEV_MULTIPLIER = 1.8;
const constants_DEFAULT_NEGATIVE_STD_DEV_MULTIPLIER = 3.2;
const constants_DEFAULT_NEGATIVE_SEED_MARGIN = 30;
const constants_DEFAULT_NEGATIVE_SEEDS_COUNT = 70;
const constants_MAX_NEGATIVE_SEED_ATTEMPTS_MULTIPLIER = 50;

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/growCut/runOneClickGrowCut.js



const { transformWorldToIndex: runOneClickGrowCut_transformWorldToIndex } = esm.utilities;
const MAX_POSITIVE_SEEDS = 100000;
function calculateGrowCutSeeds(referencedVolume, worldPosition, options) {
    const { dimensions, imageData: refImageData } = referencedVolume;
    const [width, height, numSlices] = dimensions;
    const referenceVolumeVoxelManager = referencedVolume.voxelManager;
    const scalarData = referenceVolumeVoxelManager.getCompleteScalarDataArray();
    const numPixelsPerSlice = width * height;
    const neighborhoodRadius = options?.initialNeighborhoodRadius ?? DEFAULT_NEIGHBORHOOD_RADIUS;
    const positiveK = options?.positiveStdDevMultiplier ?? DEFAULT_POSITIVE_STD_DEV_MULTIPLIER;
    const negativeK = options?.negativeStdDevMultiplier ?? DEFAULT_NEGATIVE_STD_DEV_MULTIPLIER;
    const negativeSeedMargin = options?.negativeSeedMargin ?? DEFAULT_NEGATIVE_SEED_MARGIN;
    const negativeSeedsTargetPatches = options?.negativeSeedsTargetPatches ?? DEFAULT_NEGATIVE_SEEDS_COUNT;
    const ijkStart = runOneClickGrowCut_transformWorldToIndex(refImageData, worldPosition).map(Math.round);
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
    const initialStats = csUtils.calculateNeighborhoodStats(scalarData, dimensions, ijkStart, neighborhoodRadius);
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
    const maxAttempts = negativeSeedsTargetPatches * MAX_NEGATIVE_SEED_ATTEMPTS_MULTIPLIER;
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
    const referencedVolume = cache.getVolume(referencedVolumeId);
    const labelmap = volumeLoader.createAndCacheDerivedLabelmapVolume(referencedVolumeId);
    labelmap.voxelManager.forEach(({ index, value }) => {
        if (value !== 0) {
            labelmap.voxelManager.setAtIndex(index, 0);
        }
    });
    const seeds = options.seeds ??
        calculateGrowCutSeeds(referencedVolume, worldPosition, options);
    const positiveSeedLabel = options?.positiveSeedValue ?? POSITIVE_SEED_LABEL;
    const negativeSeedLabel = options?.negativeSeedValue ?? NEGATIVE_SEED_LABEL;
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
    await run(referencedVolumeId, labelmap.volumeId, options);
    return labelmap;
}


;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/growCut/index.js





// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/createLabelmapMemo.js
var createLabelmapMemo = __webpack_require__(2397);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/islandRemoval.js
var islandRemoval = __webpack_require__(67912);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getOrCreateSegmentationVolume.js
var getOrCreateSegmentationVolume = __webpack_require__(30722);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getOrCreateImageVolume.js
var getOrCreateImageVolume = __webpack_require__(83075);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getStatistics.js
var getStatistics = __webpack_require__(38440);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/validateLabelmap.js
var validateLabelmap = __webpack_require__(21345);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getSegmentation.js
var segmentation_getSegmentation = __webpack_require__(33283);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/triggerSegmentationEvents.js
var triggerSegmentationEvents = __webpack_require__(49906);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/constants/COLOR_LUT.js
var COLOR_LUT = __webpack_require__(93952);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/addColorLUT.js
var segmentation_addColorLUT = __webpack_require__(4714);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/SegmentationStateManager.js
var SegmentationStateManager = __webpack_require__(59475);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getViewportIdsWithSegmentation.js
var segmentation_getViewportIdsWithSegmentation = __webpack_require__(58859);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getActiveSegmentIndex.js
var segmentation_getActiveSegmentIndex = __webpack_require__(60740);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/segmentIndex.js







function segmentIndex_setActiveSegmentIndex(segmentationId, segmentIndex) {
    const segmentation = getSegmentation(segmentationId);
    if (typeof segmentIndex === 'string') {
        console.warn('segmentIndex is a string, converting to number');
        segmentIndex = Number(segmentIndex);
    }
    Object.values(segmentation.segments).forEach((segment) => {
        segment.active = false;
    });
    if (!segmentation.segments[segmentIndex]) {
        segmentation.segments[segmentIndex] = {
            segmentIndex,
            label: '',
            locked: false,
            cachedStats: {},
            active: false,
        };
    }
    if (segmentation.segments[segmentIndex].active !== true) {
        segmentation.segments[segmentIndex].active = true;
        triggerSegmentationModified(segmentationId);
    }
    const viewportIds = getViewportIdsWithSegmentation(segmentationId);
    viewportIds.forEach((viewportId) => {
        const representations = getSegmentationRepresentations(viewportId, {
            segmentationId,
        });
        representations.forEach((representation) => {
            if (!representation.segments[segmentIndex]) {
                representation.segments[segmentIndex] = {
                    visible: true,
                };
            }
        });
    });
    viewportIds.forEach((viewportId) => {
        const toolGroup = getToolGroupForViewport(viewportId);
        invalidateBrushCursor(toolGroup.id);
    });
}


;// ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/internalAddSegmentationRepresentation.js







function internalAddSegmentationRepresentation_internalAddSegmentationRepresentation(viewportId, representationInput) {
    const { segmentationId, config } = representationInput;
    const renderingConfig = {
        colorLUTIndex: getColorLUTIndex(config),
        ...config,
    };
    defaultSegmentationStateManager.addSegmentationRepresentation(viewportId, segmentationId, representationInput.type, renderingConfig);
    if (!getActiveSegmentIndex(segmentationId)) {
        let firstSegmentIndex = 1;
        const segmentation = defaultSegmentationStateManager.getSegmentation(segmentationId);
        if (segmentation) {
            const segmentKeys = Object.keys(segmentation.segments);
            if (segmentKeys.length > 0) {
                firstSegmentIndex = segmentKeys.map((k) => Number(k)).sort()[0];
            }
        }
        setActiveSegmentIndex(segmentationId, firstSegmentIndex);
    }
    if (representationInput.type === SegmentationRepresentations.Contour) {
        triggerAnnotationRenderForViewportIds([viewportId]);
    }
    triggerSegmentationModified(segmentationId);
}
function getColorLUTIndex(config) {
    const { colorLUTOrIndex } = config || {};
    if (colorLUTOrIndex === undefined) {
        const index = addColorLUT(JSON.parse(JSON.stringify(CORNERSTONE_COLOR_LUT)));
        return index;
    }
    if (typeof colorLUTOrIndex === 'number') {
        return colorLUTOrIndex;
    }
    if (Array.isArray(colorLUTOrIndex) &&
        colorLUTOrIndex.every((item) => Array.isArray(item) && item.length === 4)) {
        const index = addColorLUT(colorLUTOrIndex);
        return index;
    }
    const index = addColorLUT(JSON.parse(JSON.stringify(CORNERSTONE_COLOR_LUT)));
    return index;
}


;// ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/addSegmentationRepresentationsToViewport.js


function addSegmentationRepresentationsToViewport_addSegmentationRepresentations(viewportId, segmentationInputArray) {
    segmentationInputArray.map((segmentationInput) => {
        return internalAddSegmentationRepresentation(viewportId, segmentationInput);
    });
}
function addContourRepresentationToViewport(viewportId, contourInputArray) {
    return addSegmentationRepresentationsToViewport_addSegmentationRepresentations(viewportId, contourInputArray.map((input) => ({
        ...input,
        type: SegmentationRepresentations.Contour,
    })));
}
function addContourRepresentationToViewportMap(viewportInputMap) {
    const results = {};
    for (const [viewportId, inputArray] of Object.entries(viewportInputMap)) {
        results[viewportId] = addContourRepresentationToViewport(viewportId, inputArray);
    }
    return results;
}
function addLabelmapRepresentationToViewport(viewportId, labelmapInputArray) {
    return addSegmentationRepresentationsToViewport_addSegmentationRepresentations(viewportId, labelmapInputArray.map((input) => ({
        ...input,
        type: SegmentationRepresentations.Labelmap,
    })));
}
function addLabelmapRepresentationToViewportMap(viewportInputMap) {
    const results = {};
    for (const [viewportId, inputArray] of Object.entries(viewportInputMap)) {
        results[viewportId] = addLabelmapRepresentationToViewport(viewportId, inputArray.map((input) => ({
            ...input,
            type: SegmentationRepresentations.Labelmap,
        })));
    }
}
function addSurfaceRepresentationToViewport(viewportId, surfaceInputArray) {
    return addSegmentationRepresentationsToViewport_addSegmentationRepresentations(viewportId, surfaceInputArray.map((input) => ({
        ...input,
        type: SegmentationRepresentations.Surface,
    })));
}
function addSurfaceRepresentationToViewportMap(viewportInputMap) {
    const results = {};
    for (const [viewportId, inputArray] of Object.entries(viewportInputMap)) {
        results[viewportId] = addSurfaceRepresentationToViewport(viewportId, inputArray);
    }
    return results;
}


;// ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/updateStackSegmentationState.js





async function updateStackSegmentationState_updateStackSegmentationState({ segmentationId, viewportId, imageIds, options, }) {
    const segmentation = getSegmentation(segmentationId);
    if (options?.removeOriginal) {
        const data = segmentation.representationData
            .Labelmap;
        if (cache.getVolume(data.volumeId)) {
            cache.removeVolumeLoadObject(data.volumeId);
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
    await addSegmentationRepresentations(viewportId, [
        {
            segmentationId,
            type: SegmentationRepresentations.Labelmap,
        },
    ]);
    eventTarget.addEventListenerOnce(Events.SEGMENTATION_RENDERED, () => triggerSegmentationDataModified(segmentationId));
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/computeStackLabelmapFromVolume.js



async function computeStackLabelmapFromVolume({ volumeId, }) {
    const segmentationVolume = cache.getVolume(volumeId);
    return { imageIds: segmentationVolume.imageIds };
}
function convertVolumeToStackLabelmap({ segmentationId, options, }) {
    const segmentation = getSegmentation(segmentationId);
    if (!segmentation) {
        return;
    }
    const { volumeId } = segmentation.representationData
        .Labelmap;
    const segmentationVolume = cache.getVolume(volumeId);
    return updateStackSegmentationState({
        segmentationId,
        viewportId: options.viewportId,
        imageIds: segmentationVolume.imageIds,
        options,
    });
}

;// ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/computeVolumeLabelmapFromStack.js

async function computeVolumeLabelmapFromStack(args) {
    return internalComputeVolumeLabelmapFromStack(args);
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getReferenceVolumeForSegmentationVolume.js
var getReferenceVolumeForSegmentationVolume = __webpack_require__(12853);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getSegmentLargestBidirectional.js
var getSegmentLargestBidirectional = __webpack_require__(78773);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/computeMetabolicStats.js + 1 modules
var computeMetabolicStats = __webpack_require__(88274);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/index.js


































// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/macros2.js
var macros2 = __webpack_require__(28906);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/PolyData.js + 5 modules
var PolyData = __webpack_require__(87275);
;// ../../../node_modules/@kitware/vtk.js/Common/DataModel/EdgeLocator.js
class EdgeLocator {
  constructor() {
    let oriented = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    this.oriented = oriented;
    this.edgeMap = new Map();
  }
  initialize() {
    this.edgeMap.clear();
  }
  computeEdgeKey(pointId0, pointId1) {
    return this.oriented || pointId0 < pointId1 ?
    // Cantor pairing function:
    0.5 * (pointId0 * pointId1) * (pointId0 * pointId1 + 1) + pointId1 : 0.5 * (pointId1 * pointId0) * (pointId1 * pointId0 + 1) + pointId0;
  }
  insertUniqueEdge(pointId0, pointId1, newEdgeValue) {
    // Generate a unique key
    const key = this.computeEdgeKey(pointId0, pointId1);
    let node = this.edgeMap.get(key);
    if (!node) {
      // Didn't find key, so add a new edge entry
      node = {
        key,
        edgeId: this.edgeMap.size,
        value: newEdgeValue
      };
      this.edgeMap.set(key, node);
    }
    return node;
  }
  insertEdge(pointId0, pointId1, newEdgeValue) {
    // Generate a unique key
    const key = this.computeEdgeKey(pointId0, pointId1);
    const node = {
      key,
      edgeId: this.edgeMap.size,
      value: newEdgeValue
    };
    this.edgeMap.set(key, node);
    return node;
  }
  isInsertedEdge(pointId0, pointId1) {
    const key = this.computeEdgeKey(pointId0, pointId1);
    return this.edgeMap.get(key);
  }
  static getEdgePointIds(node) {
    const n = 0.5 * (-1 + Math.sqrt(8 * node.key + 1));
    const pointId0 = node.key - 0.5 * (n + 1) * n;
    const pointId1 = n - pointId0;
    return [pointId0, pointId1];
  }
}
function newInstance() {
  let initialValues = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return new EdgeLocator(initialValues.oriented);
}
var vtkEdgeLocator = {
  newInstance
};



;// ../../../node_modules/@kitware/vtk.js/Filters/General/ImageMarchingSquares/caseTable.js
// ----------------------------------------------------------------------------
// Marching squares case functions (using lines to generate the 2D tessellation).
// For each case, a list of edge ids that form the triangles. A -1 marks the
// end of the list of edges. Edges are taken three at a time to generate
// triangle points.
// ----------------------------------------------------------------------------
const MARCHING_SQUARES_CASES = [[-1, -1, -1, -1, -1] /* 0 */, [0, 3, -1, -1, -1] /* 1 */, [1, 0, -1, -1, -1] /* 2 */, [1, 3, -1, -1, -1] /* 3 */, [2, 1, -1, -1, -1] /* 4 */, [0, 3, 2, 1, -1] /* 5 */, [2, 0, -1, -1, -1] /* 6 */, [2, 3, -1, -1, -1] /* 7 */, [3, 2, -1, -1, -1] /* 8 */, [0, 2, -1, -1, -1] /* 9 */, [1, 0, 3, 2, -1] /* 10 */, [1, 2, -1, -1, -1] /* 11 */, [3, 1, -1, -1, -1] /* 12 */, [0, 1, -1, -1, -1] /* 13 */, [3, 0, -1, -1, -1] /* 14 */, [-1, -1, -1, -1, -1] /* 15 */];

const EDGES = [[0, 1], [1, 3], [2, 3], [0, 2]];
function getCase(index) {
  return MARCHING_SQUARES_CASES[index];
}

// Define the four edges of the pixel by the following pairs of vertices
function getEdge(eid) {
  return EDGES[eid];
}

// ----------------------------------------------------------------------------
// Static API
// ----------------------------------------------------------------------------
var vtkCaseTable = {
  getCase,
  getEdge
};



;// ../../../node_modules/@kitware/vtk.js/Filters/General/ImageMarchingSquares.js





const {
  vtkErrorMacro,
  vtkDebugMacro
} = macros2.m;

// ----------------------------------------------------------------------------
// vtkImageMarchingSquares methods
// ----------------------------------------------------------------------------

function vtkImageMarchingSquares(publicAPI, model) {
  /**
   * Get the X,Y kernels based on the set slicing mode.
   * @returns {[number, number]}
   */
  function getKernels() {
    let kernelX = 0; // default K slicing mode
    let kernelY = 1;
    if (model.slicingMode === 1) {
      kernelX = 0;
      kernelY = 2;
    } else if (model.slicingMode === 0) {
      kernelX = 1;
      kernelY = 2;
    }
    return [kernelX, kernelY];
  }

  // Set our className
  model.classHierarchy.push('vtkImageMarchingSquares');

  /**
   * Get the list of contour values.
   * @returns {number[]}
   */
  publicAPI.getContourValues = () => model.contourValues;

  /**
   * Set the list contour values.
   * @param {number[]} cValues
   */
  publicAPI.setContourValues = cValues => {
    model.contourValues = cValues;
    publicAPI.modified();
  };
  const ids = [];
  const pixelScalars = [];
  const pixelPts = [];
  const edgeLocator = vtkEdgeLocator.newInstance();

  /**
   * Retrieve scalars and pixel coordinates.
   * @param {Vector3} ijk origin of the pixel
   * @param {Vector3} dims dimensions of the image
   * @param {TypedArray} scalars list of scalar values
   * @param {Vector3} increments IJK slice increments
   * @param {number} kernelX index of the X element
   * @param {number} kernelY index of the Y element
   */
  publicAPI.getPixelScalars = (ijk, dims, scalars, increments, kernelX, kernelY) => {
    const [i, j, k] = ijk;

    // First get the indices for the pixel
    ids[0] = k * dims[1] * dims[0] + j * dims[0] + i; // i, j, k
    ids[1] = ids[0] + increments[kernelX]; // i+1, j, k
    ids[2] = ids[0] + increments[kernelY]; // i, j+1, k
    ids[3] = ids[2] + increments[kernelX]; // i+1, j+1, k

    // Now retrieve the scalars
    for (let ii = 0; ii < 4; ++ii) {
      pixelScalars[ii] = scalars[ids[ii]];
    }
  };

  /**
   * Retrieve pixel coordinates.
   * @param {Vector3} ijk origin of the pixel
   * @param {Vector3} origin origin of the image
   * @param {Vector3} spacing spacing of the image
   * @param {number} kernelX index of the X element
   * @param {number} kernelY index of the Y element
   */
  publicAPI.getPixelPoints = (ijk, origin, spacing, kernelX, kernelY) => {
    const i = ijk[kernelX];
    const j = ijk[kernelY];

    // (i,i+1),(j,j+1),(k,k+1) - i varies fastest; then j; then k
    pixelPts[0] = origin[kernelX] + i * spacing[kernelX]; // 0
    pixelPts[1] = origin[kernelY] + j * spacing[kernelY];
    pixelPts[2] = pixelPts[0] + spacing[kernelX]; // 1
    pixelPts[3] = pixelPts[1];
    pixelPts[4] = pixelPts[0]; // 2
    pixelPts[5] = pixelPts[1] + spacing[kernelY];
    pixelPts[6] = pixelPts[2]; // 3
    pixelPts[7] = pixelPts[5];
  };

  /**
   * Produce points and lines for the polydata.
   * @param {number[]} cVal list of contour values
   * @param {Vector3} ijk origin of the pixel
   * @param {Vector3} dims dimensions of the image
   * @param {Vector3} origin origin of the image
   * @param {Vector3} spacing sapcing of the image
   * @param {TypedArray} scalars list of scalar values
   * @param {number[]} points list of points
   * @param {number[]} lines list of lines
   * @param {Vector3} increments IJK slice increments
   * @param {number} kernelX index of the X element
   * @param {number} kernelY index of the Y element
   */
  publicAPI.produceLines = (cVal, ijk, dims, origin, spacing, scalars, points, lines, increments, kernelX, kernelY) => {
    const k = ijk[model.slicingMode];
    const CASE_MASK = [1, 2, 8, 4]; // case table is actually for quad
    const xyz = [];
    let pId;
    publicAPI.getPixelScalars(ijk, dims, scalars, increments, kernelX, kernelY);
    let index = 0;
    for (let idx = 0; idx < 4; idx++) {
      if (pixelScalars[idx] >= cVal) {
        index |= CASE_MASK[idx]; // eslint-disable-line no-bitwise
      }
    }

    const pixelLines = vtkCaseTable.getCase(index);
    if (pixelLines[0] < 0) {
      return; // don't get the pixel coordinates, nothing to do
    }

    publicAPI.getPixelPoints(ijk, origin, spacing, kernelX, kernelY);
    const z = origin[model.slicingMode] + k * spacing[model.slicingMode];
    for (let idx = 0; pixelLines[idx] >= 0; idx += 2) {
      lines.push(2);
      for (let eid = 0; eid < 2; eid++) {
        const edgeVerts = vtkCaseTable.getEdge(pixelLines[idx + eid]);
        pId = undefined;
        if (model.mergePoints) {
          pId = edgeLocator.isInsertedEdge(ids[edgeVerts[0]], ids[edgeVerts[1]])?.value;
        }
        if (pId === undefined) {
          const t = (cVal - pixelScalars[edgeVerts[0]]) / (pixelScalars[edgeVerts[1]] - pixelScalars[edgeVerts[0]]);
          const x0 = pixelPts.slice(edgeVerts[0] * 2, (edgeVerts[0] + 1) * 2);
          const x1 = pixelPts.slice(edgeVerts[1] * 2, (edgeVerts[1] + 1) * 2);
          xyz[kernelX] = x0[0] + t * (x1[0] - x0[0]);
          xyz[kernelY] = x0[1] + t * (x1[1] - x0[1]);
          xyz[model.slicingMode] = z;
          pId = points.length / 3;
          points.push(xyz[0], xyz[1], xyz[2]);
          if (model.mergePoints) {
            edgeLocator.insertEdge(ids[edgeVerts[0]], ids[edgeVerts[1]], pId);
          }
        }
        lines.push(pId);
      }
    }
  };
  publicAPI.requestData = (inData, outData) => {
    // implement requestData
    const input = inData[0];
    if (!input) {
      vtkErrorMacro('Invalid or missing input');
      return;
    }
    if (model.slicingMode == null || model.slicingMode < 0 || model.slicingMode > 2) {
      vtkErrorMacro('Invalid or missing slicing mode');
      return;
    }
    console.time('msquares');

    // Retrieve output and volume data
    const origin = input.getOrigin();
    const spacing = input.getSpacing();
    const dims = input.getDimensions();
    const extent = input.getExtent();
    const increments = input.computeIncrements(extent);
    const scalars = input.getPointData().getScalars().getData();
    const [kernelX, kernelY] = getKernels();

    // Points - dynamic array
    const points = [];

    // Cells - dynamic array
    const lines = [];

    // Ensure slice is valid
    let k = Math.round(model.slice);
    if (k >= dims[model.slicingMode]) {
      k = 0;
    }

    // Loop over all contour values, and then pixels, determine case and process
    const ijk = [0, 0, 0];
    ijk[model.slicingMode] = k;
    for (let cv = 0; cv < model.contourValues.length; ++cv) {
      for (let j = 0; j < dims[kernelY] - 1; ++j) {
        ijk[kernelY] = j;
        for (let i = 0; i < dims[kernelX] - 1; ++i) {
          ijk[kernelX] = i;
          publicAPI.produceLines(model.contourValues[cv], ijk, dims, origin, spacing, scalars, points, lines, increments, kernelX, kernelY);
        }
      }
      edgeLocator.initialize();
    }

    // Update output
    const polydata = PolyData/* default.newInstance */.Ay.newInstance();
    polydata.getPoints().setData(new Float32Array(points), 3);
    polydata.getLines().setData(new Uint32Array(lines));
    outData[0] = polydata;
    vtkDebugMacro('Produced output');
    console.timeEnd('msquares');
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  contourValues: [],
  slicingMode: 2,
  slice: 0,
  mergePoints: false
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Make this a VTK object
  macros2.m.obj(publicAPI, model);

  // Also make it an algorithm with one input and one output
  macros2.m.algo(publicAPI, model, 1, 1);
  macros2.m.setGet(publicAPI, model, ['slicingMode', 'slice', 'mergePoints']);

  // Object specific methods
  macros2.m.algo(publicAPI, model, 1, 1);
  vtkImageMarchingSquares(publicAPI, model);
}

// ----------------------------------------------------------------------------

const ImageMarchingSquares_newInstance = macros2.m.newInstance(extend, 'vtkImageMarchingSquares');

// ----------------------------------------------------------------------------

var vtkImageMarchingSquares$1 = {
  newInstance: ImageMarchingSquares_newInstance,
  extend
};



// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/DataArray.js
var DataArray = __webpack_require__(42008);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/ImageData.js
var ImageData = __webpack_require__(58498);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contours/getDeduplicatedVTKPolyDataPoints.js
var getDeduplicatedVTKPolyDataPoints = __webpack_require__(37546);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contours/contourFinder.js
var contourFinder = __webpack_require__(46228);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/findLargestBidirectional.js
var findLargestBidirectional = __webpack_require__(60199);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/isLineInSegment.js
var isLineInSegment = __webpack_require__(60213);
;// ../../../node_modules/@cornerstonejs/tools/dist/esm/workers/computeWorker.js











const { VoxelManager } = esm.utilities;
const computeWorker = {
    createVoxelManager: (dimensions, scalarData) => {
        return VoxelManager.createScalarVolumeVoxelManager({
            dimensions,
            scalarData,
        });
    },
    createDataStructure: (info) => {
        const { scalarData, dimensions, spacing, origin, direction } = info;
        const voxelManager = computeWorker.createVoxelManager(dimensions, scalarData);
        return {
            voxelManager,
            dimensions,
            spacing,
            origin,
            direction,
            scalarData,
        };
    },
    createVTKImageData: (dimensions, origin, direction, spacing, scalarData) => {
        const imageData = ImageData/* default.newInstance */.Ay.newInstance();
        imageData.setDimensions(dimensions);
        imageData.setOrigin(origin);
        imageData.setDirection(direction);
        imageData.setSpacing(spacing);
        if (!scalarData) {
            return imageData;
        }
        const scalarArray = DataArray/* default.newInstance */.Ay.newInstance({
            name: 'Scalars',
            numberOfComponents: 1,
            values: scalarData,
        });
        imageData.getPointData().setScalars(scalarArray);
        return imageData;
    },
    processSegmentStatistics: ({ segVoxelManager, imageVoxelManager, indices, bounds, imageData, }) => {
        segVoxelManager.forEach(({ value, pointIJK, pointLPS, index }) => {
            if (indices.indexOf(value) === -1) {
                return;
            }
            const imageValue = imageVoxelManager.getAtIndex(index);
            SegmentStatsCalculator.statsCallback({
                segmentIndex: value,
                value: imageValue,
                pointIJK,
                pointLPS,
            });
        }, {
            boundsIJK: bounds || imageVoxelManager.getDefaultBounds(),
            imageData,
        });
    },
    performMarchingSquares: (imageData, sliceIndex = null, slicingMode = null) => {
        const options = {};
        if (sliceIndex !== null) {
            options.slice = sliceIndex;
        }
        if (slicingMode !== null) {
            options.slicingMode = slicingMode;
        }
        const mSquares = vtkImageMarchingSquares$1.newInstance(options);
        mSquares.setInputData(imageData);
        mSquares.setContourValues([1]);
        mSquares.setMergePoints(false);
        return mSquares.getOutputData();
    },
    createContoursFromPolyData: (msOutput, sliceIndex = null) => {
        const reducedSet = (0,getDeduplicatedVTKPolyDataPoints/* getDeduplicatedVTKPolyDataPoints */.v)(msOutput);
        if (reducedSet.points?.length) {
            const contours = (0,contourFinder/* findContoursFromReducedSet */.d1)(reducedSet.lines);
            return {
                contours,
                polyData: reducedSet,
            };
        }
        return null;
    },
    createSegmentsFromIndices: (indices) => {
        return [null, ...indices.map((index) => ({ segmentIndex: index }))];
    },
    getArgsFromInfo: (args) => {
        const { segmentationInfo, imageInfo } = args;
        const getSegmentationData = () => {
            return computeWorker.createDataStructure(segmentationInfo);
        };
        const getImageData = () => {
            return computeWorker.createDataStructure(imageInfo);
        };
        return {
            segmentation: segmentationInfo && getSegmentationData(),
            image: imageInfo && getImageData(),
        };
    },
    calculateSegmentsStatisticsVolume: (args) => {
        const { mode, indices, unit } = args;
        const { segmentation, image } = computeWorker.getArgsFromInfo(args);
        const { voxelManager: segVoxelManager, spacing: segmentationSpacing } = segmentation;
        const { voxelManager: imageVoxelManager } = image;
        const imageData = computeWorker.createVTKImageData(segmentation.dimensions, segmentation.origin, segmentation.direction, segmentation.spacing);
        SegmentStatsCalculator.statsInit({ storePointData: false, indices, mode });
        computeWorker.processSegmentStatistics({
            segVoxelManager,
            imageVoxelManager,
            indices,
            imageData,
        });
        const stats = SegmentStatsCalculator.getStatistics({
            spacing: segmentationSpacing,
            mode,
            unit,
        });
        return stats;
    },
    computeMetabolicStats({ segmentationInfo, imageInfo }) {
        const { scalarData, dimensions, spacing, origin, direction } = segmentationInfo;
        const { spacing: imageSpacing, dimensions: imageDimensions, direction: imageDirection, origin: imageOrigin, scalarData: imageScalarData, } = imageInfo;
        const segVoxelManager = computeWorker.createVoxelManager(segmentationInfo.dimensions, segmentationInfo.scalarData);
        const refVoxelManager = computeWorker.createVoxelManager(imageDimensions, imageScalarData);
        let suv = 0;
        let numVoxels = 0;
        const scalarDataLength = segVoxelManager.getScalarDataLength();
        for (let i = 0; i < scalarDataLength; i++) {
            if (segVoxelManager.getAtIndex(i) !== 0) {
                suv += refVoxelManager.getAtIndex(i);
                numVoxels++;
            }
        }
        const tmtv = 1e-3 * numVoxels * spacing[0] * spacing[1] * spacing[2];
        const averageSuv = numVoxels > 0 ? suv / numVoxels : 0;
        const tlg = averageSuv *
            numVoxels *
            imageSpacing[0] *
            imageSpacing[1] *
            imageSpacing[2] *
            1e-3;
        return {
            tmtv,
            tlg,
        };
    },
    calculateSegmentsStatisticsStack: (args) => {
        const { segmentationInfo, imageInfo, indices, mode } = args;
        SegmentStatsCalculator.statsInit({ storePointData: true, indices, mode });
        for (let i = 0; i < segmentationInfo.length; i++) {
            const segInfo = segmentationInfo[i];
            const imgInfo = imageInfo[i];
            const segDimensions = [
                segInfo.dimensions[0],
                segInfo.dimensions[1],
                1,
            ];
            const segVoxelManager = computeWorker.createVoxelManager(segDimensions, segInfo.scalarData);
            const imageVoxelManager = computeWorker.createVoxelManager(segDimensions, imgInfo.scalarData);
            const imageData = computeWorker.createVTKImageData(segDimensions, segInfo.origin, segInfo.direction, segInfo.spacing);
            computeWorker.processSegmentStatistics({
                segVoxelManager,
                imageVoxelManager,
                indices,
                imageData,
            });
        }
        const spacing = segmentationInfo[0].spacing;
        const stats = SegmentStatsCalculator.getStatistics({
            spacing,
            mode,
        });
        return stats;
    },
    getSegmentLargestBidirectionalInternal: (args) => {
        const { segmentationInfo, imageInfo, indices, mode, isStack } = args;
        let segmentation;
        if (!isStack) {
            ({ segmentation } = computeWorker.getArgsFromInfo(args));
        }
        else {
            ({ segmentation } = computeWorker.getArgsFromInfo({
                segmentationInfo: segmentationInfo[0],
            }));
        }
        return isStack
            ? computeWorker.calculateBidirectionalStack({
                segmentationInfo,
                indices,
                mode,
            })
            : computeWorker.calculateVolumetricBidirectional({
                segmentation,
                indices,
                mode,
            });
    },
    findLargestBidirectionalFromContours: (contours, isInSegment, segmentIndex) => {
        let maxBidirectional;
        for (const sliceContour of contours) {
            const bidirectional = (0,findLargestBidirectional/* createBidirectionalForSlice */.H)(sliceContour, isInSegment, maxBidirectional);
            if (!bidirectional) {
                continue;
            }
            maxBidirectional = bidirectional;
        }
        if (maxBidirectional) {
            return {
                segmentIndex,
                majorAxis: maxBidirectional.majorAxis,
                minorAxis: maxBidirectional.minorAxis,
                maxMajor: maxBidirectional.maxMajor,
                maxMinor: maxBidirectional.maxMinor,
            };
        }
        return null;
    },
    calculateBidirectionalStack: ({ segmentationInfo, indices, mode }) => {
        const segments = computeWorker.createSegmentsFromIndices(indices);
        let bidirectionalResults = [];
        for (let i = 0; i < segmentationInfo.length; i++) {
            const segInfo = segmentationInfo[i];
            const dimensions = segInfo.dimensions;
            const segScalarData = segInfo.scalarData;
            const { spacing, direction, origin } = segInfo;
            const voxelManager = computeWorker.createVoxelManager(dimensions, segScalarData);
            const pixelsPerSlice = dimensions[0] * dimensions[1];
            for (let segIndex = 1; segIndex < segments.length; segIndex++) {
                const segment = segments[segIndex];
                if (!segment) {
                    continue;
                }
                const segmentIndex = segment.segmentIndex;
                if (computeWorker.isSliceEmptyForSegmentVolume(0, segScalarData, pixelsPerSlice, segmentIndex)) {
                    continue;
                }
                const sliceContours = [];
                const filteredData = new Uint8Array(segScalarData.length);
                for (let i = 0; i < segScalarData.length; i++) {
                    filteredData[i] = segScalarData[i] === segmentIndex ? 1 : 0;
                }
                const scalarArray = DataArray/* default.newInstance */.Ay.newInstance({
                    name: 'Pixels',
                    numberOfComponents: 1,
                    values: filteredData,
                });
                const imageData = computeWorker.createVTKImageData(dimensions, origin, direction, [spacing[0], spacing[1], 1]);
                imageData.getPointData().setScalars(scalarArray);
                try {
                    const msOutput = computeWorker.performMarchingSquares(imageData, null, 2);
                    const contourData = computeWorker.createContoursFromPolyData(msOutput);
                    if (contourData) {
                        sliceContours.push(contourData);
                    }
                }
                catch (e) {
                    console.warn(e);
                }
                const isInSegment = (0,isLineInSegment/* createIsInSegmentMetadata */.On)({
                    dimensions,
                    imageData,
                    voxelManager,
                    segmentIndex,
                });
                const bidirectionalResult = computeWorker.findLargestBidirectionalFromContours(sliceContours, isInSegment, segmentIndex);
                if (bidirectionalResult) {
                    bidirectionalResults.push(bidirectionalResult);
                }
            }
        }
        return bidirectionalResults;
    },
    calculateVolumetricBidirectional: ({ segmentation, indices, mode }) => {
        const { voxelManager, dimensions, origin, direction, spacing } = segmentation;
        const imageData = computeWorker.createVTKImageData(dimensions, origin, direction, spacing);
        const contourSets = computeWorker.generateContourSetsFromLabelmapVolume({
            segmentation,
            indices,
            imageData,
            mode,
        });
        const bidirectionalResults = [];
        for (let i = 0; i < contourSets.length; i++) {
            const contourSet = contourSets[i];
            const { segmentIndex } = contourSet.segment;
            const contours = contourSet.sliceContours;
            const isInSegment = (0,isLineInSegment/* createIsInSegmentMetadata */.On)({
                dimensions,
                imageData,
                voxelManager,
                segmentIndex,
            });
            const bidirectionalResult = computeWorker.findLargestBidirectionalFromContours(contours, isInSegment, segmentIndex);
            if (bidirectionalResult) {
                bidirectionalResults.push(bidirectionalResult);
            }
        }
        return bidirectionalResults;
    },
    generateContourSetsFromLabelmapVolume: (args) => {
        const { segmentation, indices } = args;
        const { dimensions, scalarData, origin, direction, spacing } = segmentation;
        let imageData = args.imageData;
        if (!imageData) {
            imageData = computeWorker.createVTKImageData(dimensions, origin, direction, spacing);
        }
        const numSlices = dimensions[2];
        const pixelsPerSlice = dimensions[0] * dimensions[1];
        const segments = computeWorker.createSegmentsFromIndices(indices);
        for (let z = 0; z < numSlices; z++) {
            for (let y = 0; y < dimensions[1]; y++) {
                const index = y * dimensions[0] + z * pixelsPerSlice;
                scalarData[index] = 0;
                scalarData[index + dimensions[0] - 1] = 0;
            }
        }
        const ContourSets = [];
        const numSegments = segments.length;
        for (let segIndex = 0; segIndex < numSegments; segIndex++) {
            const segment = segments[segIndex];
            if (!segment) {
                continue;
            }
            const segmentIndex = segment.segmentIndex;
            const sliceContours = [];
            const scalars = DataArray/* default.newInstance */.Ay.newInstance({
                name: 'Scalars',
                numberOfComponents: 1,
                size: pixelsPerSlice * numSlices,
                dataType: 'Uint8Array',
            });
            for (let sliceIndex = 0; sliceIndex < numSlices; sliceIndex++) {
                if (computeWorker.isSliceEmptyForSegmentVolume(sliceIndex, scalarData, pixelsPerSlice, segmentIndex)) {
                    continue;
                }
                const frameStart = sliceIndex * pixelsPerSlice;
                try {
                    for (let i = 0; i < pixelsPerSlice; i++) {
                        const value = scalarData[i + frameStart];
                        if (value === segmentIndex) {
                            scalars.setValue(i + frameStart, 1);
                        }
                        else {
                            scalars.setValue(i, 0);
                        }
                    }
                    const imageDataCopy = ImageData/* default.newInstance */.Ay.newInstance();
                    imageDataCopy.shallowCopy(imageData);
                    imageDataCopy.getPointData().setScalars(scalars);
                    const msOutput = computeWorker.performMarchingSquares(imageDataCopy, sliceIndex);
                    const contourData = computeWorker.createContoursFromPolyData(msOutput, sliceIndex);
                    if (contourData) {
                        sliceContours.push(contourData);
                    }
                }
                catch (e) {
                    console.warn(sliceIndex);
                    console.warn(e);
                }
            }
            const ContourSet = {
                sliceContours,
                segment,
            };
            ContourSets.push(ContourSet);
        }
        return ContourSets;
    },
    isSliceEmptyForSegmentVolume: (sliceIndex, segData, pixelsPerSlice, segIndex) => {
        const startIdx = sliceIndex * pixelsPerSlice;
        const endIdx = startIdx + pixelsPerSlice;
        for (let i = startIdx; i < endIdx; i++) {
            if (segData[i] === segIndex) {
                return false;
            }
        }
        return true;
    },
};
(0,comlink/* expose */.p)(computeWorker);


/***/ }),

/***/ 62612:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ay: () => (/* binding */ Constants)
/* harmony export */ });
/* unused harmony exports AttributeCopyOperations, AttributeLimitTypes, AttributeTypes, CellGhostTypes, DesiredOutputPrecision, PointGhostTypes, ghostArrayName */
const AttributeTypes = {
  SCALARS: 0,
  VECTORS: 1,
  NORMALS: 2,
  TCOORDS: 3,
  TENSORS: 4,
  GLOBALIDS: 5,
  PEDIGREEIDS: 6,
  EDGEFLAG: 7,
  NUM_ATTRIBUTES: 8
};
const AttributeLimitTypes = {
  MAX: 0,
  EXACT: 1,
  NOLIMIT: 2
};
const CellGhostTypes = {
  DUPLICATECELL: 1,
  // the cell is present on multiple processors
  HIGHCONNECTIVITYCELL: 2,
  // the cell has more neighbors than in a regular mesh
  LOWCONNECTIVITYCELL: 4,
  // the cell has less neighbors than in a regular mesh
  REFINEDCELL: 8,
  // other cells are present that refines it.
  EXTERIORCELL: 16,
  // the cell is on the exterior of the data set
  HIDDENCELL: 32 // the cell is needed to maintain connectivity, but the data values should be ignored.
};

const PointGhostTypes = {
  DUPLICATEPOINT: 1,
  // the cell is present on multiple processors
  HIDDENPOINT: 2 // the point is needed to maintain connectivity, but the data values should be ignored.
};

const AttributeCopyOperations = {
  COPYTUPLE: 0,
  INTERPOLATE: 1,
  PASSDATA: 2,
  ALLCOPY: 3 // all of the above
};

const ghostArrayName = 'vtkGhostType';
const DesiredOutputPrecision = {
  DEFAULT: 0,
  // use the point type that does not truncate any data
  SINGLE: 1,
  // use Float32Array
  DOUBLE: 2 // use Float64Array
};

var Constants = {
  AttributeCopyOperations,
  AttributeLimitTypes,
  AttributeTypes,
  CellGhostTypes,
  DesiredOutputPrecision,
  PointGhostTypes,
  ghostArrayName
};




/***/ }),

/***/ 58498:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ay: () => (/* binding */ vtkImageData$1)
/* harmony export */ });
/* unused harmony exports extend, newInstance */
/* harmony import */ var _macros2_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(28906);
/* harmony import */ var _Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(16632);
/* harmony import */ var _BoundingBox_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(21734);
/* harmony import */ var _DataSet_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(69147);
/* harmony import */ var _StructuredData_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(24964);
/* harmony import */ var _StructuredData_Constants_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(85278);
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(3823);








const {
  vtkErrorMacro
} = _macros2_js__WEBPACK_IMPORTED_MODULE_0__.m;

// ----------------------------------------------------------------------------
// vtkImageData methods
// ----------------------------------------------------------------------------

function vtkImageData(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkImageData');
  publicAPI.setExtent = function () {
    if (model.deleted) {
      vtkErrorMacro('instance deleted - cannot call any method');
      return false;
    }
    for (var _len = arguments.length, inExtent = new Array(_len), _key = 0; _key < _len; _key++) {
      inExtent[_key] = arguments[_key];
    }
    const extentArray = inExtent.length === 1 ? inExtent[0] : inExtent;
    if (extentArray.length !== 6) {
      return false;
    }
    const changeDetected = model.extent.some((item, index) => item !== extentArray[index]);
    if (changeDetected) {
      model.extent = extentArray.slice();
      model.dataDescription = _StructuredData_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"].getDataDescriptionFromExtent */ .A.getDataDescriptionFromExtent(model.extent);
      publicAPI.modified();
    }
    return changeDetected;
  };
  publicAPI.setDimensions = function () {
    let i;
    let j;
    let k;
    if (model.deleted) {
      vtkErrorMacro('instance deleted - cannot call any method');
      return;
    }
    if (arguments.length === 1) {
      const array = arguments.length <= 0 ? undefined : arguments[0];
      i = array[0];
      j = array[1];
      k = array[2];
    } else if (arguments.length === 3) {
      i = arguments.length <= 0 ? undefined : arguments[0];
      j = arguments.length <= 1 ? undefined : arguments[1];
      k = arguments.length <= 2 ? undefined : arguments[2];
    } else {
      vtkErrorMacro('Bad dimension specification');
      return;
    }
    publicAPI.setExtent(0, i - 1, 0, j - 1, 0, k - 1);
  };
  publicAPI.getDimensions = () => [model.extent[1] - model.extent[0] + 1, model.extent[3] - model.extent[2] + 1, model.extent[5] - model.extent[4] + 1];
  publicAPI.getNumberOfCells = () => {
    const dims = publicAPI.getDimensions();
    let nCells = 1;
    for (let i = 0; i < 3; i++) {
      if (dims[i] === 0) {
        return 0;
      }
      if (dims[i] > 1) {
        nCells *= dims[i] - 1;
      }
    }
    return nCells;
  };
  publicAPI.getNumberOfPoints = () => {
    const dims = publicAPI.getDimensions();
    return dims[0] * dims[1] * dims[2];
  };
  publicAPI.getPoint = index => {
    const dims = publicAPI.getDimensions();
    if (dims[0] === 0 || dims[1] === 0 || dims[2] === 0) {
      vtkErrorMacro('Requesting a point from an empty image.');
      return null;
    }
    const ijk = new Float64Array(3);
    switch (model.dataDescription) {
      case _StructuredData_Constants_js__WEBPACK_IMPORTED_MODULE_5__/* .StructuredType */ .e.EMPTY:
        return null;
      case _StructuredData_Constants_js__WEBPACK_IMPORTED_MODULE_5__/* .StructuredType */ .e.SINGLE_POINT:
        break;
      case _StructuredData_Constants_js__WEBPACK_IMPORTED_MODULE_5__/* .StructuredType */ .e.X_LINE:
        ijk[0] = index;
        break;
      case _StructuredData_Constants_js__WEBPACK_IMPORTED_MODULE_5__/* .StructuredType */ .e.Y_LINE:
        ijk[1] = index;
        break;
      case _StructuredData_Constants_js__WEBPACK_IMPORTED_MODULE_5__/* .StructuredType */ .e.Z_LINE:
        ijk[2] = index;
        break;
      case _StructuredData_Constants_js__WEBPACK_IMPORTED_MODULE_5__/* .StructuredType */ .e.XY_PLANE:
        ijk[0] = index % dims[0];
        ijk[1] = index / dims[0];
        break;
      case _StructuredData_Constants_js__WEBPACK_IMPORTED_MODULE_5__/* .StructuredType */ .e.YZ_PLANE:
        ijk[1] = index % dims[1];
        ijk[2] = index / dims[1];
        break;
      case _StructuredData_Constants_js__WEBPACK_IMPORTED_MODULE_5__/* .StructuredType */ .e.XZ_PLANE:
        ijk[0] = index % dims[0];
        ijk[2] = index / dims[0];
        break;
      case _StructuredData_Constants_js__WEBPACK_IMPORTED_MODULE_5__/* .StructuredType */ .e.XYZ_GRID:
        ijk[0] = index % dims[0];
        ijk[1] = index / dims[0] % dims[1];
        ijk[2] = index / (dims[0] * dims[1]);
        break;
      default:
        vtkErrorMacro('Invalid dataDescription');
        break;
    }
    const coords = [0, 0, 0];
    publicAPI.indexToWorld(ijk, coords);
    return coords;
  };

  // vtkCell *GetCell(vtkIdType cellId) VTK_OVERRIDE;
  // void GetCell(vtkIdType cellId, vtkGenericCell *cell) VTK_OVERRIDE;
  // void GetCellBounds(vtkIdType cellId, double bounds[6]) VTK_OVERRIDE;
  // virtual vtkIdType FindPoint(double x, double y, double z)
  // {
  //   return this->vtkDataSet::FindPoint(x, y, z);
  // }
  // vtkIdType FindPoint(double x[3]) VTK_OVERRIDE;
  // vtkIdType FindCell(
  //   double x[3], vtkCell *cell, vtkIdType cellId, double tol2,
  //   int& subId, double pcoords[3], double *weights) VTK_OVERRIDE;
  // vtkIdType FindCell(
  //   double x[3], vtkCell *cell, vtkGenericCell *gencell,
  //   vtkIdType cellId, double tol2, int& subId,
  //   double pcoords[3], double *weights) VTK_OVERRIDE;
  // vtkCell *FindAndGetCell(double x[3], vtkCell *cell, vtkIdType cellId,
  //                                 double tol2, int& subId, double pcoords[3],
  //                                 double *weights) VTK_OVERRIDE;
  // int GetCellType(vtkIdType cellId) VTK_OVERRIDE;
  // void GetCellPoints(vtkIdType cellId, vtkIdList *ptIds) VTK_OVERRIDE
  //   {vtkStructuredData::GetCellPoints(cellId,ptIds,this->DataDescription,
  //                                     this->GetDimensions());}
  // void GetPointCells(vtkIdType ptId, vtkIdList *cellIds) VTK_OVERRIDE
  //   {vtkStructuredData::GetPointCells(ptId,cellIds,this->GetDimensions());}
  // void ComputeBounds() VTK_OVERRIDE;
  // int GetMaxCellSize() VTK_OVERRIDE {return 8;}; //voxel is the largest

  publicAPI.getBounds = () => publicAPI.extentToBounds(publicAPI.getSpatialExtent());
  publicAPI.extentToBounds = ex => _BoundingBox_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"].transformBounds */ .Ay.transformBounds(ex, model.indexToWorld);
  publicAPI.getSpatialExtent = () => _BoundingBox_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"].inflate */ .Ay.inflate([...model.extent], 0.5);

  // Internal, shouldn't need to call this manually.
  publicAPI.computeTransforms = () => {
    gl_matrix__WEBPACK_IMPORTED_MODULE_6__/* .mat4.fromTranslation */ .pB.fromTranslation(model.indexToWorld, model.origin);
    model.indexToWorld[0] = model.direction[0];
    model.indexToWorld[1] = model.direction[1];
    model.indexToWorld[2] = model.direction[2];
    model.indexToWorld[4] = model.direction[3];
    model.indexToWorld[5] = model.direction[4];
    model.indexToWorld[6] = model.direction[5];
    model.indexToWorld[8] = model.direction[6];
    model.indexToWorld[9] = model.direction[7];
    model.indexToWorld[10] = model.direction[8];
    gl_matrix__WEBPACK_IMPORTED_MODULE_6__/* .mat4.scale */ .pB.scale(model.indexToWorld, model.indexToWorld, model.spacing);
    gl_matrix__WEBPACK_IMPORTED_MODULE_6__/* .mat4.invert */ .pB.invert(model.worldToIndex, model.indexToWorld);
  };
  publicAPI.indexToWorld = function (ain) {
    let aout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    gl_matrix__WEBPACK_IMPORTED_MODULE_6__/* .vec3.transformMat4 */ .eR.transformMat4(aout, ain, model.indexToWorld);
    return aout;
  };
  publicAPI.indexToWorldVec3 = publicAPI.indexToWorld;
  publicAPI.worldToIndex = function (ain) {
    let aout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    gl_matrix__WEBPACK_IMPORTED_MODULE_6__/* .vec3.transformMat4 */ .eR.transformMat4(aout, ain, model.worldToIndex);
    return aout;
  };
  publicAPI.worldToIndexVec3 = publicAPI.worldToIndex;
  publicAPI.indexToWorldBounds = function (bin) {
    let bout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return _BoundingBox_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"].transformBounds */ .Ay.transformBounds(bin, model.indexToWorld, bout);
  };
  publicAPI.worldToIndexBounds = function (bin) {
    let bout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return _BoundingBox_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"].transformBounds */ .Ay.transformBounds(bin, model.worldToIndex, bout);
  };

  // Make sure the transform is correct
  publicAPI.onModified(publicAPI.computeTransforms);
  publicAPI.computeTransforms();
  publicAPI.getCenter = () => _BoundingBox_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"].getCenter */ .Ay.getCenter(publicAPI.getBounds());
  publicAPI.computeHistogram = function (worldBounds) {
    let voxelFunction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    const bounds = [0, 0, 0, 0, 0, 0];
    publicAPI.worldToIndexBounds(worldBounds, bounds);
    const point1 = [0, 0, 0];
    const point2 = [0, 0, 0];
    _BoundingBox_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"].computeCornerPoints */ .Ay.computeCornerPoints(bounds, point1, point2);
    (0,_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.b)(point1, point1);
    (0,_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.b)(point2, point2);
    const dimensions = publicAPI.getDimensions();
    (0,_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.c)(point1, [0, 0, 0], [dimensions[0] - 1, dimensions[1] - 1, dimensions[2] - 1], point1);
    (0,_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.c)(point2, [0, 0, 0], [dimensions[0] - 1, dimensions[1] - 1, dimensions[2] - 1], point2);
    const yStride = dimensions[0];
    const zStride = dimensions[0] * dimensions[1];
    const pixels = publicAPI.getPointData().getScalars().getData();
    let maximum = -Infinity;
    let minimum = Infinity;
    let sumOfSquares = 0;
    let isum = 0;
    let inum = 0;
    for (let z = point1[2]; z <= point2[2]; z++) {
      for (let y = point1[1]; y <= point2[1]; y++) {
        let index = point1[0] + y * yStride + z * zStride;
        for (let x = point1[0]; x <= point2[0]; x++) {
          if (!voxelFunction || voxelFunction([x, y, z], bounds)) {
            const pixel = pixels[index];
            if (pixel > maximum) maximum = pixel;
            if (pixel < minimum) minimum = pixel;
            sumOfSquares += pixel * pixel;
            isum += pixel;
            inum += 1;
          }
          ++index;
        }
      }
    }
    const average = inum > 0 ? isum / inum : 0;
    const variance = inum ? Math.abs(sumOfSquares / inum - average * average) : 0;
    const sigma = Math.sqrt(variance);
    return {
      minimum,
      maximum,
      average,
      variance,
      sigma,
      count: inum
    };
  };

  // TODO: use the unimplemented `vtkDataSetAttributes` for scalar length, that is currently also a TODO (GetNumberOfComponents).
  // Scalar data could be tuples for color information?
  publicAPI.computeIncrements = function (extent) {
    let numberOfComponents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    const increments = [];
    let incr = numberOfComponents;

    // Calculate array increment offsets
    // similar to c++ vtkImageData::ComputeIncrements
    for (let idx = 0; idx < 3; ++idx) {
      increments[idx] = incr;
      incr *= extent[idx * 2 + 1] - extent[idx * 2] + 1;
    }
    return increments;
  };

  /**
   * @param {Number[]} index the localized `[i,j,k]` pixel array position. Float values will be rounded.
   * @return {Number} the corresponding flattened index in the scalar array
   */
  publicAPI.computeOffsetIndex = _ref => {
    let [i, j, k] = _ref;
    const extent = publicAPI.getExtent();
    const numberOfComponents = publicAPI.getPointData().getScalars().getNumberOfComponents();
    const increments = publicAPI.computeIncrements(extent, numberOfComponents);
    // Use the array increments to find the pixel index
    // similar to c++ vtkImageData::GetArrayPointer
    // Math.floor to catch "practically 0" e^-15 scenarios.
    return Math.floor((Math.round(i) - extent[0]) * increments[0] + (Math.round(j) - extent[2]) * increments[1] + (Math.round(k) - extent[4]) * increments[2]);
  };

  /**
   * @param {Number[]} xyz the [x,y,z] Array in world coordinates
   * @return {Number|NaN} the corresponding pixel's index in the scalar array
   */
  publicAPI.getOffsetIndexFromWorld = xyz => {
    const extent = publicAPI.getExtent();
    const index = publicAPI.worldToIndex(xyz);

    // Confirm indexed i,j,k coords are within the bounds of the volume
    for (let idx = 0; idx < 3; ++idx) {
      if (index[idx] < extent[idx * 2] || index[idx] > extent[idx * 2 + 1]) {
        vtkErrorMacro(`GetScalarPointer: Pixel ${index} is not in memory. Current extent = ${extent}`);
        return NaN;
      }
    }

    // Assumed the index here is within 0 <-> scalarData.length, but doesn't hurt to check upstream
    return publicAPI.computeOffsetIndex(index);
  };
  /**
   * @param {Number[]} xyz the [x,y,z] Array in world coordinates
   * @param {Number?} comp the scalar component index for multi-component scalars
   * @return {Number|NaN} the corresponding pixel's scalar value
   */
  publicAPI.getScalarValueFromWorld = function (xyz) {
    let comp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    const numberOfComponents = publicAPI.getPointData().getScalars().getNumberOfComponents();
    if (comp < 0 || comp >= numberOfComponents) {
      vtkErrorMacro(`GetScalarPointer: Scalar Component ${comp} is not within bounds. Current Scalar numberOfComponents: ${numberOfComponents}`);
      return NaN;
    }
    const offsetIndex = publicAPI.getOffsetIndexFromWorld(xyz);
    if (Number.isNaN(offsetIndex)) {
      // VTK Error Macro will have been tripped already, no need to do it again,
      return offsetIndex;
    }
    return publicAPI.getPointData().getScalars().getComponent(offsetIndex, comp);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  direction: null,
  // a mat3
  indexToWorld: null,
  // a mat4
  worldToIndex: null,
  // a mat4
  spacing: [1.0, 1.0, 1.0],
  origin: [0.0, 0.0, 0.0],
  extent: [0, -1, 0, -1, 0, -1],
  dataDescription: _StructuredData_Constants_js__WEBPACK_IMPORTED_MODULE_5__/* .StructuredType */ .e.EMPTY
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _DataSet_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"].extend */ .Ay.extend(publicAPI, model, initialValues);
  if (!model.direction) {
    model.direction = gl_matrix__WEBPACK_IMPORTED_MODULE_6__/* .mat3.identity */ .w0.identity(new Float64Array(9));
  } else if (Array.isArray(model.direction)) {
    model.direction = new Float64Array(model.direction.slice(0, 9));
  }
  model.indexToWorld = new Float64Array(16);
  model.worldToIndex = new Float64Array(16);

  // Set/Get methods
  _macros2_js__WEBPACK_IMPORTED_MODULE_0__.m.get(publicAPI, model, ['indexToWorld', 'worldToIndex']);
  _macros2_js__WEBPACK_IMPORTED_MODULE_0__.m.setGetArray(publicAPI, model, ['origin', 'spacing'], 3);
  _macros2_js__WEBPACK_IMPORTED_MODULE_0__.m.setGetArray(publicAPI, model, ['direction'], 9);
  _macros2_js__WEBPACK_IMPORTED_MODULE_0__.m.getArray(publicAPI, model, ['extent'], 6);

  // Object specific methods
  vtkImageData(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = _macros2_js__WEBPACK_IMPORTED_MODULE_0__.m.newInstance(extend, 'vtkImageData');

// ----------------------------------------------------------------------------

var vtkImageData$1 = {
  newInstance,
  extend
};




/***/ }),

/***/ 642:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ay: () => (/* binding */ vtkColorTransferFunction$1)
/* harmony export */ });
/* unused harmony exports extend, newInstance */
/* harmony import */ var _macros2_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(28906);
/* harmony import */ var _Common_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(16632);
/* harmony import */ var _Common_Core_ScalarsToColors_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(80993);
/* harmony import */ var _ColorTransferFunction_Constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(25128);





const {
  ColorSpace,
  Scale
} = _ColorTransferFunction_Constants_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Ay;
const {
  ScalarMappingTarget
} = _Common_Core_ScalarsToColors_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Ay;
const {
  vtkDebugMacro,
  vtkErrorMacro,
  vtkWarningMacro
} = _macros2_js__WEBPACK_IMPORTED_MODULE_0__.m;

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------
/* eslint-disable no-continue                                                */

// Convert to and from a special polar version of CIELAB (useful for creating
// continuous diverging color maps).
function vtkColorTransferFunctionLabToMsh(lab, msh) {
  const L = lab[0];
  const a = lab[1];
  const b = lab[2];
  const M = Math.sqrt(L * L + a * a + b * b);
  const s = M > 0.001 ? Math.acos(L / M) : 0.0;
  const h = s > 0.001 ? Math.atan2(b, a) : 0.0;
  msh[0] = M;
  msh[1] = s;
  msh[2] = h;
}
function vtkColorTransferFunctionMshToLab(msh, lab) {
  const M = msh[0];
  const s = msh[1];
  const h = msh[2];
  lab[0] = M * Math.cos(s);
  lab[1] = M * Math.sin(s) * Math.cos(h);
  lab[2] = M * Math.sin(s) * Math.sin(h);
}

// For the case when interpolating from a saturated color to an unsaturated
// color, find a hue for the unsaturated color that makes sense.
function vtkColorTransferFunctionAdjustHue(msh, unsatM) {
  if (msh[0] >= unsatM - 0.1) {
    // The best we can do is hold hue constant.
    return msh[2];
  }

  // This equation is designed to make the perceptual change of the
  // interpolation to be close to constant.
  const hueSpin = msh[1] * Math.sqrt(unsatM * unsatM - msh[0] * msh[0]) / (msh[0] * Math.sin(msh[1]));
  // Spin hue away from 0 except in purple hues.
  if (msh[2] > -0.3 * Math.PI) {
    return msh[2] + hueSpin;
  }
  return msh[2] - hueSpin;
}
function vtkColorTransferFunctionAngleDiff(a1, a2) {
  let adiff = a1 - a2;
  if (adiff < 0.0) {
    adiff = -adiff;
  }
  while (adiff >= 2.0 * Math.PI) {
    adiff -= 2.0 * Math.PI;
  }
  if (adiff > Math.PI) {
    adiff = 2.0 * Math.PI - adiff;
  }
  return adiff;
}

// Interpolate a diverging color map.
function vtkColorTransferFunctionInterpolateDiverging(s, rgb1, rgb2, result) {
  const lab1 = [];
  const lab2 = [];
  (0,_Common_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.N)(rgb1, lab1);
  (0,_Common_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.N)(rgb2, lab2);
  const msh1 = [];
  const msh2 = [];
  vtkColorTransferFunctionLabToMsh(lab1, msh1);
  vtkColorTransferFunctionLabToMsh(lab2, msh2);

  // If the endpoints are distinct saturated colors, then place white in between
  // them.
  let localS = s;
  if (msh1[1] > 0.05 && msh2[1] > 0.05 && vtkColorTransferFunctionAngleDiff(msh1[2], msh2[2]) > 0.33 * Math.PI) {
    // Insert the white midpoint by setting one end to white and adjusting the
    // scalar value.
    let Mmid = Math.max(msh1[0], msh2[0]);
    Mmid = Math.max(88.0, Mmid);
    if (s < 0.5) {
      msh2[0] = Mmid;
      msh2[1] = 0.0;
      msh2[2] = 0.0;
      localS *= 2.0;
    } else {
      msh1[0] = Mmid;
      msh1[1] = 0.0;
      msh1[2] = 0.0;
      localS = 2.0 * localS - 1.0;
    }
  }

  // If one color has no saturation, then its hue value is invalid.  In this
  // case, we want to set it to something logical so that the interpolation of
  // hue makes sense.
  if (msh1[1] < 0.05 && msh2[1] > 0.05) {
    msh1[2] = vtkColorTransferFunctionAdjustHue(msh2, msh1[0]);
  } else if (msh2[1] < 0.05 && msh1[1] > 0.05) {
    msh2[2] = vtkColorTransferFunctionAdjustHue(msh1, msh2[0]);
  }
  const mshTmp = [];
  mshTmp[0] = (1 - localS) * msh1[0] + localS * msh2[0];
  mshTmp[1] = (1 - localS) * msh1[1] + localS * msh2[1];
  mshTmp[2] = (1 - localS) * msh1[2] + localS * msh2[2];

  // Now convert back to RGB
  const labTmp = [];
  vtkColorTransferFunctionMshToLab(mshTmp, labTmp);
  (0,_Common_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.O)(labTmp, result);
}

// ----------------------------------------------------------------------------
// vtkColorTransferFunction methods
// ----------------------------------------------------------------------------

function vtkColorTransferFunction(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkColorTransferFunction');

  // Return the number of points which specify this function
  publicAPI.getSize = () => model.nodes.length;

  //----------------------------------------------------------------------------
  // Add a point defined in RGB
  publicAPI.addRGBPoint = (x, r, g, b) => publicAPI.addRGBPointLong(x, r, g, b, 0.5, 0.0);

  //----------------------------------------------------------------------------
  // Add a point defined in RGB
  publicAPI.addRGBPointLong = function (x, r, g, b) {
    let midpoint = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.5;
    let sharpness = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0.0;
    // Error check
    if (midpoint < 0.0 || midpoint > 1.0) {
      vtkErrorMacro('Midpoint outside range [0.0, 1.0]');
      return -1;
    }
    if (sharpness < 0.0 || sharpness > 1.0) {
      vtkErrorMacro('Sharpness outside range [0.0, 1.0]');
      return -1;
    }

    // remove any node already at this X location
    if (!model.allowDuplicateScalars) {
      publicAPI.removePoint(x);
    }

    // Create the new node
    const node = {
      x,
      r,
      g,
      b,
      midpoint,
      sharpness
    };

    // Add it, then sort to get everything in order
    model.nodes.push(node);
    publicAPI.sortAndUpdateRange();

    // We need to find the index of the node we just added in order
    // to return this value
    let i = 0;
    for (; i < model.nodes.length; i++) {
      if (model.nodes[i].x === x) {
        break;
      }
    }

    // If we didn't find it, something went horribly wrong so
    // return -1
    if (i < model.nodes.length) {
      return i;
    }
    return -1;
  };

  //----------------------------------------------------------------------------
  // Add a point defined in HSV
  publicAPI.addHSVPoint = (x, h, s, v) => publicAPI.addHSVPointLong(x, h, s, v, 0.5, 0.0);

  //----------------------------------------------------------------------------
  // Add a point defined in HSV
  publicAPI.addHSVPointLong = function (x, h, s, v) {
    let midpoint = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.5;
    let sharpness = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0.0;
    const rgb = [];
    const hsv = [h, s, v];
    (0,_Common_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.h)(hsv, rgb);
    return publicAPI.addRGBPoint(x, rgb[0], rgb[1], rgb[2], midpoint, sharpness);
  };

  //----------------------------------------------------------------------------
  // Set nodes directly
  publicAPI.setNodes = nodes => {
    if (model.nodes !== nodes) {
      const before = JSON.stringify(model.nodes);
      model.nodes = nodes;
      const after = JSON.stringify(model.nodes);
      if (publicAPI.sortAndUpdateRange() || before !== after) {
        publicAPI.modified();
        return true;
      }
    }
    return false;
  };

  //----------------------------------------------------------------------------
  // Sort the vector in increasing order, then fill in
  // the Range
  publicAPI.sortAndUpdateRange = () => {
    const before = JSON.stringify(model.nodes);
    model.nodes.sort((a, b) => a.x - b.x);
    const after = JSON.stringify(model.nodes);
    const modifiedInvoked = publicAPI.updateRange();
    // If range is updated, Modified() has been called, don't call it again.
    if (!modifiedInvoked && before !== after) {
      publicAPI.modified();
      return true;
    }
    return modifiedInvoked;
  };

  //----------------------------------------------------------------------------
  publicAPI.updateRange = () => {
    const oldRange = [2];
    oldRange[0] = model.mappingRange[0];
    oldRange[1] = model.mappingRange[1];
    const size = model.nodes.length;
    if (size) {
      model.mappingRange[0] = model.nodes[0].x;
      model.mappingRange[1] = model.nodes[size - 1].x;
    } else {
      model.mappingRange[0] = 0;
      model.mappingRange[1] = 0;
    }

    // If the range is the same, then no need to call Modified()
    if (oldRange[0] === model.mappingRange[0] && oldRange[1] === model.mappingRange[1]) {
      return false;
    }
    publicAPI.modified();
    return true;
  };

  //----------------------------------------------------------------------------
  // Remove a point
  publicAPI.removePoint = x => {
    // First find the node since we need to know its
    // index as our return value
    let i = 0;
    for (; i < model.nodes.length; i++) {
      if (model.nodes[i].x === x) {
        break;
      }
    }
    const retVal = i;

    // If the node doesn't exist, we return -1
    if (i >= model.nodes.length) {
      return -1;
    }

    // If the first or last point has been removed, then we update the range
    // No need to sort here as the order of points hasn't changed.
    let modifiedInvoked = false;
    model.nodes.splice(i, 1);
    if (i === 0 || i === model.nodes.length) {
      modifiedInvoked = publicAPI.updateRange();
    }
    if (!modifiedInvoked) {
      publicAPI.modified();
    }
    return retVal;
  };

  //----------------------------------------------------------------------------
  publicAPI.movePoint = (oldX, newX) => {
    if (oldX === newX) {
      // Nothing to do.
      return;
    }
    publicAPI.removePoint(newX);
    for (let i = 0; i < model.nodes.length; i++) {
      if (model.nodes[i].x === oldX) {
        model.nodes[i].x = newX;
        publicAPI.sortAndUpdateRange();
        break;
      }
    }
  };

  //----------------------------------------------------------------------------
  // Remove all points
  publicAPI.removeAllPoints = () => {
    model.nodes = [];
    publicAPI.sortAndUpdateRange();
  };

  //----------------------------------------------------------------------------
  // Add a line defined in RGB
  publicAPI.addRGBSegment = (x1, r1, g1, b1, x2, r2, g2, b2) => {
    // First, find all points in this range and remove them
    publicAPI.sortAndUpdateRange();
    for (let i = 0; i < model.nodes.length;) {
      if (model.nodes[i].x >= x1 && model.nodes[i].x <= x2) {
        model.nodes.splice(i, 1);
      } else {
        i++;
      }
    }

    // Now add the points
    publicAPI.addRGBPointLong(x1, r1, g1, b1, 0.5, 0.0);
    publicAPI.addRGBPointLong(x2, r2, g2, b2, 0.5, 0.0);
    publicAPI.modified();
  };

  //----------------------------------------------------------------------------
  // Add a line defined in HSV
  publicAPI.addHSVSegment = (x1, h1, s1, v1, x2, h2, s2, v2) => {
    const hsv1 = [h1, s1, v1];
    const hsv2 = [h2, s2, v2];
    const rgb1 = [];
    const rgb2 = [];
    (0,_Common_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.h)(hsv1, rgb1);
    (0,_Common_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.h)(hsv2, rgb2);
    publicAPI.addRGBSegment(x1, rgb1[0], rgb1[1], rgb1[2], x2, rgb2[0], rgb2[1], rgb2[2]);
  };

  //----------------------------------------------------------------------------
  // Returns the RGBA color evaluated at the specified location
  publicAPI.mapValue = x => {
    const rgb = [];
    publicAPI.getColor(x, rgb);
    return [Math.floor(255.0 * rgb[0] + 0.5), Math.floor(255.0 * rgb[1] + 0.5), Math.floor(255.0 * rgb[2] + 0.5), 255];
  };

  //----------------------------------------------------------------------------
  // Returns the RGB color evaluated at the specified location
  publicAPI.getColor = (x, rgb) => {
    if (model.indexedLookup) {
      const numNodes = publicAPI.getSize();
      // todo
      const idx = publicAPI.getAnnotatedValueIndexInternal(x);
      if (idx < 0 || numNodes === 0) {
        const nanColor = publicAPI.getNanColorByReference();
        rgb[0] = nanColor[0];
        rgb[1] = nanColor[1];
        rgb[2] = nanColor[2];
      } else {
        const nodeVal = [];
        publicAPI.getNodeValue(idx % numNodes, nodeVal);
        // nodeVal[0] is the x value. nodeVal[1...3] is rgb.
        rgb[0] = nodeVal[1];
        rgb[1] = nodeVal[2];
        rgb[2] = nodeVal[3];
      }
      return;
    }
    publicAPI.getTable(x, x, 1, rgb);
  };

  //----------------------------------------------------------------------------
  // Returns the red color evaluated at the specified location
  publicAPI.getRedValue = x => {
    const rgb = [];
    publicAPI.getColor(x, rgb);
    return rgb[0];
  };

  //----------------------------------------------------------------------------
  // Returns the green color evaluated at the specified location
  publicAPI.getGreenValue = x => {
    const rgb = [];
    publicAPI.getColor(x, rgb);
    return rgb[1];
  };

  //----------------------------------------------------------------------------
  // Returns the blue color evaluated at the specified location
  publicAPI.getBlueValue = x => {
    const rgb = [];
    publicAPI.getColor(x, rgb);
    return rgb[2];
  };

  //----------------------------------------------------------------------------
  // Returns a table of RGB colors at regular intervals along the function
  publicAPI.getTable = (xStart_, xEnd_, size, table) => {
    // To handle BigInt limitation
    const xStart = Number(xStart_);
    const xEnd = Number(xEnd_);

    // Special case: If either the start or end is a NaN, then all any
    // interpolation done on them is also a NaN.  Therefore, fill the table with
    // the NaN color.
    if ((0,_Common_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.i)(xStart) || (0,_Common_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.i)(xEnd)) {
      for (let i = 0; i < size; i++) {
        table[i * 3 + 0] = model.nanColor[0];
        table[i * 3 + 1] = model.nanColor[1];
        table[i * 3 + 2] = model.nanColor[2];
      }
      return;
    }
    let idx = 0;
    const numNodes = model.nodes.length;

    // Need to keep track of the last value so that
    // we can fill in table locations past this with
    // this value if Clamping is On.
    let lastR = 0.0;
    let lastG = 0.0;
    let lastB = 0.0;
    if (numNodes !== 0) {
      lastR = model.nodes[numNodes - 1].r;
      lastG = model.nodes[numNodes - 1].g;
      lastB = model.nodes[numNodes - 1].b;
    }
    let x = 0.0;
    let x1 = 0.0;
    let x2 = 0.0;
    const rgb1 = [0.0, 0.0, 0.0];
    const rgb2 = [0.0, 0.0, 0.0];
    let midpoint = 0.0;
    let sharpness = 0.0;
    const tmpVec = [];

    // If the scale is logarithmic, make sure the range is valid.
    let usingLogScale = model.scale === Scale.LOG10;
    if (usingLogScale) {
      // Note: This requires range[0] <= range[1].
      usingLogScale = model.mappingRange[0] > 0.0;
    }
    let logStart = 0.0;
    let logEnd = 0.0;
    let logX = 0.0;
    if (usingLogScale) {
      logStart = Math.log10(xStart);
      logEnd = Math.log10(xEnd);
    }

    // For each table entry
    for (let i = 0; i < size; i++) {
      // Find our location in the table
      const tidx = 3 * i;

      // Find our X location. If we are taking only 1 sample, make
      // it halfway between start and end (usually start and end will
      // be the same in this case)
      if (size > 1) {
        if (usingLogScale) {
          logX = logStart + i / (size - 1.0) * (logEnd - logStart);
          x = 10.0 ** logX;
        } else {
          x = xStart + i / (size - 1.0) * (xEnd - xStart);
        }
      } else if (usingLogScale) {
        logX = 0.5 * (logStart + logEnd);
        x = 10.0 ** logX;
      } else {
        x = 0.5 * (xStart + xEnd);
      }

      // Linearly map x from mappingRange to [0, numberOfValues-1],
      // discretize (round down to the closest integer),
      // then map back to mappingRange
      if (model.discretize) {
        const range = model.mappingRange;
        if (x >= range[0] && x <= range[1]) {
          const numberOfValues = model.numberOfValues;
          const deltaRange = range[1] - range[0];
          if (numberOfValues <= 1) {
            x = range[0] + deltaRange / 2.0;
          } else {
            // normalize x
            const xn = (x - range[0]) / deltaRange;
            // discretize
            const discretizeIndex = (0,_Common_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.K)(numberOfValues * xn);
            // get discretized x
            x = range[0] + discretizeIndex / (numberOfValues - 1) * deltaRange;
          }
        }
      }

      // Do we need to move to the next node?
      while (idx < numNodes && x > model.nodes[idx].x) {
        idx++;
        // If we are at a valid point index, fill in
        // the value at this node, and the one before (the
        // two that surround our current sample location)
        // idx cannot be 0 since we just incremented it.
        if (idx < numNodes) {
          x1 = model.nodes[idx - 1].x;
          x2 = model.nodes[idx].x;
          if (usingLogScale) {
            x1 = Math.log10(x1);
            x2 = Math.log10(x2);
          }
          rgb1[0] = model.nodes[idx - 1].r;
          rgb2[0] = model.nodes[idx].r;
          rgb1[1] = model.nodes[idx - 1].g;
          rgb2[1] = model.nodes[idx].g;
          rgb1[2] = model.nodes[idx - 1].b;
          rgb2[2] = model.nodes[idx].b;

          // We only need the previous midpoint and sharpness
          // since these control this region
          midpoint = model.nodes[idx - 1].midpoint;
          sharpness = model.nodes[idx - 1].sharpness;

          // Move midpoint away from extreme ends of range to avoid
          // degenerate math
          if (midpoint < 0.00001) {
            midpoint = 0.00001;
          }
          if (midpoint > 0.99999) {
            midpoint = 0.99999;
          }
        }
      }

      // Are we at or past the end? If so, just use the last value
      if (x > model.mappingRange[1]) {
        table[tidx] = 0.0;
        table[tidx + 1] = 0.0;
        table[tidx + 2] = 0.0;
        if (model.clamping) {
          if (publicAPI.getUseAboveRangeColor()) {
            table[tidx] = model.aboveRangeColor[0];
            table[tidx + 1] = model.aboveRangeColor[1];
            table[tidx + 2] = model.aboveRangeColor[2];
          } else {
            table[tidx] = lastR;
            table[tidx + 1] = lastG;
            table[tidx + 2] = lastB;
          }
        }
      } else if (x < model.mappingRange[0] || (0,_Common_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.L)(x) && x < 0) {
        // we are before the first node? If so, duplicate this node's values.
        // We have to deal with -inf here
        table[tidx] = 0.0;
        table[tidx + 1] = 0.0;
        table[tidx + 2] = 0.0;
        if (model.clamping) {
          if (publicAPI.getUseBelowRangeColor()) {
            table[tidx] = model.belowRangeColor[0];
            table[tidx + 1] = model.belowRangeColor[1];
            table[tidx + 2] = model.belowRangeColor[2];
          } else if (numNodes > 0) {
            table[tidx] = model.nodes[0].r;
            table[tidx + 1] = model.nodes[0].g;
            table[tidx + 2] = model.nodes[0].b;
          }
        }
      } else if (idx === 0 && (Math.abs(x - xStart) < 1e-6 || model.discretize)) {
        if (numNodes > 0) {
          table[tidx] = model.nodes[0].r;
          table[tidx + 1] = model.nodes[0].g;
          table[tidx + 2] = model.nodes[0].b;
        } else {
          table[tidx] = 0.0;
          table[tidx + 1] = 0.0;
          table[tidx + 2] = 0.0;
        }
      } else {
        // OK, we are between two nodes - interpolate
        // Our first attempt at a normalized location [0,1] -
        // we will be modifying this based on midpoint and
        // sharpness to get the curve shape we want and to have
        // it pass through (y1+y2)/2 at the midpoint.
        let s = 0.0;
        if (usingLogScale) {
          s = (logX - x1) / (x2 - x1);
        } else {
          s = (x - x1) / (x2 - x1);
        }

        // Readjust based on the midpoint - linear adjustment
        if (s < midpoint) {
          s = 0.5 * s / midpoint;
        } else {
          s = 0.5 + 0.5 * (s - midpoint) / (1.0 - midpoint);
        }

        // override for sharpness > 0.99
        // In this case we just want piecewise constant
        if (sharpness > 0.99) {
          // Use the first value since we are below the midpoint
          if (s < 0.5) {
            table[tidx] = rgb1[0];
            table[tidx + 1] = rgb1[1];
            table[tidx + 2] = rgb1[2];
            continue;
          } else {
            // Use the second value at or above the midpoint
            table[tidx] = rgb2[0];
            table[tidx + 1] = rgb2[1];
            table[tidx + 2] = rgb2[2];
            continue;
          }
        }

        // Override for sharpness < 0.01
        // In this case we want piecewise linear
        if (sharpness < 0.01) {
          // Simple linear interpolation
          if (model.colorSpace === ColorSpace.RGB) {
            table[tidx] = (1 - s) * rgb1[0] + s * rgb2[0];
            table[tidx + 1] = (1 - s) * rgb1[1] + s * rgb2[1];
            table[tidx + 2] = (1 - s) * rgb1[2] + s * rgb2[2];
          } else if (model.colorSpace === ColorSpace.HSV) {
            const hsv1 = [];
            const hsv2 = [];
            (0,_Common_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.M)(rgb1, hsv1);
            (0,_Common_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.M)(rgb2, hsv2);
            if (model.hSVWrap && (hsv1[0] - hsv2[0] > 0.5 || hsv2[0] - hsv1[0] > 0.5)) {
              if (hsv1[0] > hsv2[0]) {
                hsv1[0] -= 1.0;
              } else {
                hsv2[0] -= 1.0;
              }
            }
            const hsvTmp = [];
            hsvTmp[0] = (1.0 - s) * hsv1[0] + s * hsv2[0];
            if (hsvTmp[0] < 0.0) {
              hsvTmp[0] += 1.0;
            }
            hsvTmp[1] = (1.0 - s) * hsv1[1] + s * hsv2[1];
            hsvTmp[2] = (1.0 - s) * hsv1[2] + s * hsv2[2];

            // Now convert this back to RGB
            (0,_Common_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.h)(hsvTmp, tmpVec);
            table[tidx] = tmpVec[0];
            table[tidx + 1] = tmpVec[1];
            table[tidx + 2] = tmpVec[2];
          } else if (model.colorSpace === ColorSpace.LAB) {
            const lab1 = [];
            const lab2 = [];
            (0,_Common_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.N)(rgb1, lab1);
            (0,_Common_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.N)(rgb2, lab2);
            const labTmp = [];
            labTmp[0] = (1 - s) * lab1[0] + s * lab2[0];
            labTmp[1] = (1 - s) * lab1[1] + s * lab2[1];
            labTmp[2] = (1 - s) * lab1[2] + s * lab2[2];

            // Now convert back to RGB
            (0,_Common_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.O)(labTmp, tmpVec);
            table[tidx] = tmpVec[0];
            table[tidx + 1] = tmpVec[1];
            table[tidx + 2] = tmpVec[2];
          } else if (model.colorSpace === ColorSpace.DIVERGING) {
            vtkColorTransferFunctionInterpolateDiverging(s, rgb1, rgb2, tmpVec);
            table[tidx] = tmpVec[0];
            table[tidx + 1] = tmpVec[1];
            table[tidx + 2] = tmpVec[2];
          } else {
            vtkErrorMacro('ColorSpace set to invalid value.', model.colorSpace);
          }
          continue;
        }

        // We have a sharpness between [0.01, 0.99] - we will
        // used a modified hermite curve interpolation where we
        // derive the slope based on the sharpness, and we compress
        // the curve non-linearly based on the sharpness

        // First, we will adjust our position based on sharpness in
        // order to make the curve sharper (closer to piecewise constant)
        if (s < 0.5) {
          s = 0.5 * (s * 2.0) ** (1.0 + 10.0 * sharpness);
        } else if (s > 0.5) {
          s = 1.0 - 0.5 * ((1.0 - s) * 2) ** (1 + 10.0 * sharpness);
        }

        // Compute some coefficients we will need for the hermite curve
        const ss = s * s;
        const sss = ss * s;
        const h1 = 2.0 * sss - 3 * ss + 1;
        const h2 = -2 * sss + 3 * ss;
        const h3 = sss - 2 * ss + s;
        const h4 = sss - ss;
        let slope;
        let t;
        if (model.colorSpace === ColorSpace.RGB) {
          for (let j = 0; j < 3; j++) {
            // Use one slope for both end points
            slope = rgb2[j] - rgb1[j];
            t = (1.0 - sharpness) * slope;

            // Compute the value
            table[tidx + j] = h1 * rgb1[j] + h2 * rgb2[j] + h3 * t + h4 * t;
          }
        } else if (model.colorSpace === ColorSpace.HSV) {
          const hsv1 = [];
          const hsv2 = [];
          (0,_Common_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.M)(rgb1, hsv1);
          (0,_Common_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.M)(rgb2, hsv2);
          if (model.hSVWrap && (hsv1[0] - hsv2[0] > 0.5 || hsv2[0] - hsv1[0] > 0.5)) {
            if (hsv1[0] > hsv2[0]) {
              hsv1[0] -= 1.0;
            } else {
              hsv2[0] -= 1.0;
            }
          }
          const hsvTmp = [];
          for (let j = 0; j < 3; j++) {
            // Use one slope for both end points
            slope = hsv2[j] - hsv1[j];
            t = (1.0 - sharpness) * slope;

            // Compute the value
            hsvTmp[j] = h1 * hsv1[j] + h2 * hsv2[j] + h3 * t + h4 * t;
            if (j === 0 && hsvTmp[j] < 0.0) {
              hsvTmp[j] += 1.0;
            }
          }
          // Now convert this back to RGB
          (0,_Common_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.h)(hsvTmp, tmpVec);
          table[tidx] = tmpVec[0];
          table[tidx + 1] = tmpVec[1];
          table[tidx + 2] = tmpVec[2];
        } else if (model.colorSpace === ColorSpace.LAB) {
          const lab1 = [];
          const lab2 = [];
          (0,_Common_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.N)(rgb1, lab1);
          (0,_Common_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.N)(rgb2, lab2);
          const labTmp = [];
          for (let j = 0; j < 3; j++) {
            // Use one slope for both end points
            slope = lab2[j] - lab1[j];
            t = (1.0 - sharpness) * slope;

            // Compute the value
            labTmp[j] = h1 * lab1[j] + h2 * lab2[j] + h3 * t + h4 * t;
          }
          // Now convert this back to RGB
          (0,_Common_Core_Math_index_js__WEBPACK_IMPORTED_MODULE_1__.O)(labTmp, tmpVec);
          table[tidx] = tmpVec[0];
          table[tidx + 1] = tmpVec[1];
          table[tidx + 2] = tmpVec[2];
        } else if (model.colorSpace === ColorSpace.DIVERGING) {
          // I have not implemented proper interpolation by a hermite curve for
          // the diverging color map, but I cannot think of a good use case for
          // that anyway.
          vtkColorTransferFunctionInterpolateDiverging(s, rgb1, rgb2, tmpVec);
          table[tidx] = tmpVec[0];
          table[tidx + 1] = tmpVec[1];
          table[tidx + 2] = tmpVec[2];
        } else {
          vtkErrorMacro('ColorSpace set to invalid value.');
        }

        // Final error check to make sure we don't go outside [0,1]
        for (let j = 0; j < 3; j++) {
          table[tidx + j] = table[tidx + j] < 0.0 ? 0.0 : table[tidx + j];
          table[tidx + j] = table[tidx + j] > 1.0 ? 1.0 : table[tidx + j];
        }
      }
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.getUint8Table = function (xStart, xEnd, size) {
    let withAlpha = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    if (publicAPI.getMTime() <= model.buildTime && model.tableSize === size && model.tableWithAlpha !== withAlpha) {
      return model.table;
    }
    if (model.nodes.length === 0) {
      vtkErrorMacro('Attempting to lookup a value with no points in the function');
      return model.table;
    }
    const nbChannels = withAlpha ? 4 : 3;
    if (model.tableSize !== size || model.tableWithAlpha !== withAlpha) {
      model.table = new Uint8Array(size * nbChannels);
      model.tableSize = size;
      model.tableWithAlpha = withAlpha;
    }
    const tmpTable = [];
    publicAPI.getTable(xStart, xEnd, size, tmpTable);
    for (let i = 0; i < size; i++) {
      model.table[i * nbChannels + 0] = Math.floor(tmpTable[i * 3 + 0] * 255.0 + 0.5);
      model.table[i * nbChannels + 1] = Math.floor(tmpTable[i * 3 + 1] * 255.0 + 0.5);
      model.table[i * nbChannels + 2] = Math.floor(tmpTable[i * 3 + 2] * 255.0 + 0.5);
      if (withAlpha) {
        model.table[i * nbChannels + 3] = 255;
      }
    }
    model.buildTime.modified();
    return model.table;
  };
  publicAPI.buildFunctionFromArray = array => {
    publicAPI.removeAllPoints();
    const numComponents = array.getNumberOfComponents();
    for (let i = 0; i < array.getNumberOfTuples(); i++) {
      switch (numComponents) {
        case 3:
          {
            model.nodes.push({
              x: i,
              r: array.getComponent(i, 0),
              g: array.getComponent(i, 1),
              b: array.getComponent(i, 2),
              midpoint: 0.5,
              sharpness: 0.0
            });
            break;
          }
        case 4:
          {
            model.nodes.push({
              x: array.getComponent(i, 0),
              r: array.getComponent(i, 1),
              g: array.getComponent(i, 2),
              b: array.getComponent(i, 3),
              midpoint: 0.5,
              sharpness: 0.0
            });
            break;
          }
        case 5:
          {
            model.nodes.push({
              x: i,
              r: array.getComponent(i, 0),
              g: array.getComponent(i, 1),
              b: array.getComponent(i, 2),
              midpoint: array.getComponent(i, 4),
              sharpness: array.getComponent(i, 5)
            });
            break;
          }
        case 6:
          {
            model.nodes.push({
              x: array.getComponent(i, 0),
              r: array.getComponent(i, 1),
              g: array.getComponent(i, 2),
              b: array.getComponent(i, 3),
              midpoint: array.getComponent(i, 4),
              sharpness: array.getComponent(i, 5)
            });
            break;
          }
      }
    }
    publicAPI.sortAndUpdateRange();
  };

  //----------------------------------------------------------------------------
  publicAPI.buildFunctionFromTable = (xStart, xEnd, size, table) => {
    let inc = 0.0;
    publicAPI.removeAllPoints();
    if (size > 1) {
      inc = (xEnd - xStart) / (size - 1.0);
    }
    for (let i = 0; i < size; i++) {
      const node = {
        x: xStart + inc * i,
        r: table[i * 3],
        g: table[i * 3 + 1],
        b: table[i * 3 + 2],
        sharpness: 0.0,
        midpoint: 0.5
      };
      model.nodes.push(node);
    }
    publicAPI.sortAndUpdateRange();
  };

  //----------------------------------------------------------------------------
  // For a specified index value, get the node parameters
  publicAPI.getNodeValue = (index, val) => {
    if (index < 0 || index >= model.nodes.length) {
      vtkErrorMacro('Index out of range!');
      return -1;
    }
    val[0] = model.nodes[index].x;
    val[1] = model.nodes[index].r;
    val[2] = model.nodes[index].g;
    val[3] = model.nodes[index].b;
    val[4] = model.nodes[index].midpoint;
    val[5] = model.nodes[index].sharpness;
    return 1;
  };

  //----------------------------------------------------------------------------
  // For a specified index value, get the node parameters
  publicAPI.setNodeValue = (index, val) => {
    if (index < 0 || index >= model.nodes.length) {
      vtkErrorMacro('Index out of range!');
      return -1;
    }
    const oldX = model.nodes[index].x;
    model.nodes[index].x = val[0];
    model.nodes[index].r = val[1];
    model.nodes[index].g = val[2];
    model.nodes[index].b = val[3];
    model.nodes[index].midpoint = val[4];
    model.nodes[index].sharpness = val[5];
    if (oldX !== val[0]) {
      // The point has been moved, the order of points or the range might have
      // been modified.
      publicAPI.sortAndUpdateRange();
      // No need to call Modified() here because SortAndUpdateRange() has done it
      // already.
    } else {
      publicAPI.modified();
    }
    return 1;
  };

  //----------------------------------------------------------------------------
  publicAPI.getNumberOfAvailableColors = () => {
    if (model.indexedLookup && publicAPI.getSize()) {
      return publicAPI.getSize();
    }
    if (model.tableSize) {
      // Not sure if this is correct since it is only set if
      // "const unsigned char *::GetTable(double xStart, double xEnd,int size)"
      // has been called.
      return model.tableSize;
    }
    const nNodes = model.nodes?.length ?? 0;
    // The minimum is 4094 colors so that it fills in the 4096 texels texture in `mapScalarsToTexture`
    return Math.max(4094, nNodes);
  };

  //----------------------------------------------------------------------------
  publicAPI.getIndexedColor = (idx, rgba) => {
    const n = publicAPI.getSize();
    if (n > 0 && idx >= 0) {
      const nodeValue = [];
      publicAPI.getNodeValue(idx % n, nodeValue);
      for (let j = 0; j < 3; ++j) {
        rgba[j] = nodeValue[j + 1];
      }
      rgba[3] = 1.0; // NodeColor is RGB-only.
      return;
    }
    const nanColor = publicAPI.getNanColorByReference();
    rgba[0] = nanColor[0];
    rgba[1] = nanColor[1];
    rgba[2] = nanColor[2];
    rgba[3] = 1.0; // NanColor is RGB-only.
  };

  //----------------------------------------------------------------------------
  publicAPI.fillFromDataPointer = (nb, ptr) => {
    if (nb <= 0 || !ptr) {
      return;
    }
    publicAPI.removeAllPoints();
    for (let i = 0; i < nb; i++) {
      publicAPI.addRGBPoint(ptr[i * 4], ptr[i * 4 + 1], ptr[i * 4 + 2], ptr[i * 4 + 3]);
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.setMappingRange = (min, max) => {
    const range = [min, max];
    const originalRange = publicAPI.getRange();
    if (originalRange[1] === range[1] && originalRange[0] === range[0]) {
      return;
    }
    if (range[1] === range[0]) {
      vtkErrorMacro('attempt to set zero width color range');
      return;
    }
    const scale = (range[1] - range[0]) / (originalRange[1] - originalRange[0]);
    const shift = range[0] - originalRange[0] * scale;
    for (let i = 0; i < model.nodes.length; ++i) {
      model.nodes[i].x = model.nodes[i].x * scale + shift;
    }
    model.mappingRange[0] = range[0];
    model.mappingRange[1] = range[1];
    publicAPI.modified();
  };

  //----------------------------------------------------------------------------
  publicAPI.adjustRange = range => {
    const functionRange = publicAPI.getRange();

    // Make sure we have points at each end of the range
    const rgb = [];
    if (functionRange[0] < range[0]) {
      publicAPI.getColor(range[0], rgb);
      publicAPI.addRGBPoint(range[0], rgb[0], rgb[1], rgb[2]);
    } else {
      publicAPI.getColor(functionRange[0], rgb);
      publicAPI.addRGBPoint(range[0], rgb[0], rgb[1], rgb[2]);
    }
    if (functionRange[1] > range[1]) {
      publicAPI.getColor(range[1], rgb);
      publicAPI.addRGBPoint(range[1], rgb[0], rgb[1], rgb[2]);
    } else {
      publicAPI.getColor(functionRange[1], rgb);
      publicAPI.addRGBPoint(range[1], rgb[0], rgb[1], rgb[2]);
    }

    // Remove all points out-of-range
    publicAPI.sortAndUpdateRange();
    for (let i = 0; i < model.nodes.length;) {
      if (model.nodes[i].x >= range[0] && model.nodes[i].x <= range[1]) {
        model.nodes.splice(i, 1);
      } else {
        ++i;
      }
    }
    return 1;
  };

  //--------------------------------------------------------------------------
  publicAPI.estimateMinNumberOfSamples = (x1, x2) => {
    const d = publicAPI.findMinimumXDistance();
    return Math.ceil((x2 - x1) / d);
  };

  //----------------------------------------------------------------------------
  publicAPI.findMinimumXDistance = () => {
    if (model.nodes.length < 2) {
      return -1.0;
    }
    let distance = Number.MAX_VALUE;
    for (let i = 0; i < model.nodes.length - 1; i++) {
      const currentDist = model.nodes[i + 1].x - model.nodes[i].x;
      if (currentDist < distance) {
        distance = currentDist;
      }
    }
    return distance;
  };
  publicAPI.mapScalarsThroughTable = (input, output, outFormat, inputOffset) => {
    if (publicAPI.getSize() === 0) {
      vtkDebugMacro('Transfer Function Has No Points!');
      return;
    }
    if (model.indexedLookup) {
      publicAPI.mapDataIndexed(input, output, outFormat, inputOffset);
    } else {
      publicAPI.mapData(input, output, outFormat, inputOffset);
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.mapData = (input, output, outFormat, inputOffset) => {
    if (publicAPI.getSize() === 0) {
      vtkWarningMacro('Transfer Function Has No Points!');
      return;
    }
    const alpha = Math.floor(publicAPI.getAlpha() * 255.0 + 0.5);
    const length = input.getNumberOfTuples();
    const inIncr = input.getNumberOfComponents();
    const outputV = output.getData();
    const inputV = input.getData();
    const rgb = [];
    if (outFormat === ScalarMappingTarget.RGBA) {
      for (let i = 0; i < length; i++) {
        const x = inputV[i * inIncr + inputOffset];
        publicAPI.getColor(x, rgb);
        outputV[i * 4] = Math.floor(rgb[0] * 255.0 + 0.5);
        outputV[i * 4 + 1] = Math.floor(rgb[1] * 255.0 + 0.5);
        outputV[i * 4 + 2] = Math.floor(rgb[2] * 255.0 + 0.5);
        outputV[i * 4 + 3] = alpha;
      }
    }
    if (outFormat === ScalarMappingTarget.RGB) {
      for (let i = 0; i < length; i++) {
        const x = inputV[i * inIncr + inputOffset];
        publicAPI.getColor(x, rgb);
        outputV[i * 3] = Math.floor(rgb[0] * 255.0 + 0.5);
        outputV[i * 3 + 1] = Math.floor(rgb[1] * 255.0 + 0.5);
        outputV[i * 3 + 2] = Math.floor(rgb[2] * 255.0 + 0.5);
      }
    }
    if (outFormat === ScalarMappingTarget.LUMINANCE) {
      for (let i = 0; i < length; i++) {
        const x = inputV[i * inIncr + inputOffset];
        publicAPI.getColor(x, rgb);
        outputV[i] = Math.floor(rgb[0] * 76.5 + rgb[1] * 150.45 + rgb[2] * 28.05 + 0.5);
      }
    }
    if (outFormat === ScalarMappingTarget.LUMINANCE_ALPHA) {
      for (let i = 0; i < length; i++) {
        const x = inputV[i * inIncr + inputOffset];
        publicAPI.getColor(x, rgb);
        outputV[i * 2] = Math.floor(rgb[0] * 76.5 + rgb[1] * 150.45 + rgb[2] * 28.05 + 0.5);
        outputV[i * 2 + 1] = alpha;
      }
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.applyColorMap = colorMap => {
    const oldColorSpace = JSON.stringify(model.colorSpace);
    if (colorMap.ColorSpace) {
      model.colorSpace = ColorSpace[colorMap.ColorSpace.toUpperCase()];
      if (model.colorSpace === undefined) {
        vtkErrorMacro(`ColorSpace ${colorMap.ColorSpace} not supported, using RGB instead`);
        model.colorSpace = ColorSpace.RGB;
      }
    }
    let isModified = oldColorSpace !== JSON.stringify(model.colorSpace);
    const oldNanColor = isModified || JSON.stringify(model.nanColor);
    if (colorMap.NanColor) {
      model.nanColor = [].concat(colorMap.NanColor);
      while (model.nanColor.length < 4) {
        model.nanColor.push(1.0);
      }
    }
    isModified = isModified || oldNanColor !== JSON.stringify(model.nanColor);
    const oldNodes = isModified || JSON.stringify(model.nodes);
    if (colorMap.RGBPoints) {
      const size = colorMap.RGBPoints.length;
      model.nodes = [];
      const midpoint = 0.5;
      const sharpness = 0.0;
      for (let i = 0; i < size; i += 4) {
        model.nodes.push({
          x: colorMap.RGBPoints[i],
          r: colorMap.RGBPoints[i + 1],
          g: colorMap.RGBPoints[i + 2],
          b: colorMap.RGBPoints[i + 3],
          midpoint,
          sharpness
        });
      }
    }
    const modifiedInvoked = publicAPI.sortAndUpdateRange();
    const callModified = !modifiedInvoked && (isModified || oldNodes !== JSON.stringify(model.nodes));
    if (callModified) publicAPI.modified();
    return modifiedInvoked || callModified;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  clamping: true,
  colorSpace: ColorSpace.RGB,
  hSVWrap: true,
  scale: Scale.LINEAR,
  nanColor: null,
  belowRangeColor: null,
  aboveRangeColor: null,
  useAboveRangeColor: false,
  useBelowRangeColor: false,
  allowDuplicateScalars: false,
  table: null,
  tableSize: 0,
  buildTime: null,
  nodes: null,
  discretize: false,
  numberOfValues: 256
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _Common_Core_ScalarsToColors_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"].extend */ .Ay.extend(publicAPI, model, initialValues);

  // Internal objects initialization
  model.table = [];
  model.nodes = [];
  model.nanColor = [0.5, 0.0, 0.0, 1.0];
  model.belowRangeColor = [0.0, 0.0, 0.0, 1.0];
  model.aboveRangeColor = [1.0, 1.0, 1.0, 1.0];
  model.buildTime = {};
  _macros2_js__WEBPACK_IMPORTED_MODULE_0__.m.obj(model.buildTime);

  // Create get-only macros
  _macros2_js__WEBPACK_IMPORTED_MODULE_0__.m.get(publicAPI, model, ['buildTime', 'mappingRange']);

  // Create get-set macros
  _macros2_js__WEBPACK_IMPORTED_MODULE_0__.m.setGet(publicAPI, model, ['useAboveRangeColor', 'useBelowRangeColor', 'discretize', 'numberOfValues', {
    type: 'enum',
    name: 'colorSpace',
    enum: ColorSpace
  }, {
    type: 'enum',
    name: 'scale',
    enum: Scale
  }]);
  _macros2_js__WEBPACK_IMPORTED_MODULE_0__.m.setArray(publicAPI, model, ['nanColor', 'belowRangeColor', 'aboveRangeColor'], 4);

  // Create get macros for array
  _macros2_js__WEBPACK_IMPORTED_MODULE_0__.m.getArray(publicAPI, model, ['nanColor', 'belowRangeColor', 'aboveRangeColor']);

  // For more macro methods, see "Sources/macros.js"

  // Object specific methods
  vtkColorTransferFunction(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = _macros2_js__WEBPACK_IMPORTED_MODULE_0__.m.newInstance(extend, 'vtkColorTransferFunction');

// ----------------------------------------------------------------------------

var vtkColorTransferFunction$1 = {
  newInstance,
  extend,
  ..._ColorTransferFunction_Constants_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Ay
};




/***/ }),

/***/ 9175:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   angle: () => (/* binding */ angle),
/* harmony export */   bezier: () => (/* binding */ bezier),
/* harmony export */   ceil: () => (/* binding */ ceil),
/* harmony export */   clone: () => (/* binding */ clone),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   cross: () => (/* binding */ cross),
/* harmony export */   dist: () => (/* binding */ dist),
/* harmony export */   distance: () => (/* binding */ distance),
/* harmony export */   div: () => (/* binding */ div),
/* harmony export */   divide: () => (/* binding */ divide),
/* harmony export */   dot: () => (/* binding */ dot),
/* harmony export */   equals: () => (/* binding */ equals),
/* harmony export */   exactEquals: () => (/* binding */ exactEquals),
/* harmony export */   floor: () => (/* binding */ floor),
/* harmony export */   forEach: () => (/* binding */ forEach),
/* harmony export */   fromValues: () => (/* binding */ fromValues),
/* harmony export */   hermite: () => (/* binding */ hermite),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   len: () => (/* binding */ len),
/* harmony export */   length: () => (/* binding */ length),
/* harmony export */   lerp: () => (/* binding */ lerp),
/* harmony export */   max: () => (/* binding */ max),
/* harmony export */   min: () => (/* binding */ min),
/* harmony export */   mul: () => (/* binding */ mul),
/* harmony export */   multiply: () => (/* binding */ multiply),
/* harmony export */   negate: () => (/* binding */ negate),
/* harmony export */   normalize: () => (/* binding */ normalize),
/* harmony export */   random: () => (/* binding */ random),
/* harmony export */   rotateX: () => (/* binding */ rotateX),
/* harmony export */   rotateY: () => (/* binding */ rotateY),
/* harmony export */   rotateZ: () => (/* binding */ rotateZ),
/* harmony export */   round: () => (/* binding */ round),
/* harmony export */   scale: () => (/* binding */ scale),
/* harmony export */   scaleAndAdd: () => (/* binding */ scaleAndAdd),
/* harmony export */   set: () => (/* binding */ set),
/* harmony export */   sqrDist: () => (/* binding */ sqrDist),
/* harmony export */   sqrLen: () => (/* binding */ sqrLen),
/* harmony export */   squaredDistance: () => (/* binding */ squaredDistance),
/* harmony export */   squaredLength: () => (/* binding */ squaredLength),
/* harmony export */   str: () => (/* binding */ str),
/* harmony export */   sub: () => (/* binding */ sub),
/* harmony export */   subtract: () => (/* binding */ subtract),
/* harmony export */   transformMat3: () => (/* binding */ transformMat3),
/* harmony export */   transformMat4: () => (/* binding */ transformMat4),
/* harmony export */   transformQuat: () => (/* binding */ transformQuat),
/* harmony export */   zero: () => (/* binding */ zero)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24457);

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */

function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);

  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  return out;
}
/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {ReadonlyVec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */

function clone(a) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Calculates the length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate length of
 * @returns {Number} length of a
 */

function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */

function fromValues(x, y, z) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the source vector
 * @returns {vec3} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */

function set(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}
/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to ceil
 * @returns {vec3} out
 */

function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
}
/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to floor
 * @returns {vec3} out
 */

function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  return out;
}
/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}
/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}
/**
 * Math.round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to round
 * @returns {vec3} out
 */

function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  return out;
}
/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */

function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */

function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  return out;
}
/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} distance between a and b
 */

function distance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return Math.hypot(x, y, z);
}
/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} squared distance between a and b
 */

function squaredDistance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return x * x + y * y + z * z;
}
/**
 * Calculates the squared length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return x * x + y * y + z * z;
}
/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to negate
 * @returns {vec3} out
 */

function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to invert
 * @returns {vec3} out
 */

function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
}
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to normalize
 * @returns {vec3} out
 */

function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len = x * x + y * y + z * z;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
/**
 * Calculates the dot product of two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function cross(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2];
  var bx = b[0],
      by = b[1],
      bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function lerp(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}
/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {ReadonlyVec3} c the third operand
 * @param {ReadonlyVec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function hermite(out, a, b, c, d, t) {
  var factorTimes2 = t * t;
  var factor1 = factorTimes2 * (2 * t - 3) + 1;
  var factor2 = factorTimes2 * (t - 2) + t;
  var factor3 = factorTimes2 * (t - 1);
  var factor4 = factorTimes2 * (3 - 2 * t);
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {ReadonlyVec3} c the third operand
 * @param {ReadonlyVec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function bezier(out, a, b, c, d, t) {
  var inverseFactor = 1 - t;
  var inverseFactorTimesTwo = inverseFactor * inverseFactor;
  var factorTimes2 = t * t;
  var factor1 = inverseFactorTimesTwo * inverseFactor;
  var factor2 = 3 * t * inverseFactorTimesTwo;
  var factor3 = 3 * factorTimes2 * inverseFactor;
  var factor4 = factorTimes2 * t;
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */

function random(out, scale) {
  scale = scale || 1.0;
  var r = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM() * 2.0 * Math.PI;
  var z = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM() * 2.0 - 1.0;
  var zScale = Math.sqrt(1.0 - z * z) * scale;
  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale;
  return out;
}
/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec3} out
 */

function transformMat4(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */

function transformMat3(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
/**
 * Transforms the vec3 with a quat
 * Can also be used for dual quaternions. (Multiply it with the real part)
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyQuat} q quaternion to transform with
 * @returns {vec3} out
 */

function transformQuat(out, a, q) {
  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3];
  var x = a[0],
      y = a[1],
      z = a[2]; // var qvec = [qx, qy, qz];
  // var uv = vec3.cross([], qvec, a);

  var uvx = qy * z - qz * y,
      uvy = qz * x - qx * z,
      uvz = qx * y - qy * x; // var uuv = vec3.cross([], qvec, uv);

  var uuvx = qy * uvz - qz * uvy,
      uuvy = qz * uvx - qx * uvz,
      uuvz = qx * uvy - qy * uvx; // vec3.scale(uv, uv, 2 * w);

  var w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2; // vec3.scale(uuv, uuv, 2);

  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2; // return vec3.add(out, a, vec3.add(out, uv, uuv));

  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateX(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0];
  r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
  r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateY(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateZ(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
  r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
  r[2] = p[2]; //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Get the angle between two 3D vectors
 * @param {ReadonlyVec3} a The first operand
 * @param {ReadonlyVec3} b The second operand
 * @returns {Number} The angle in radians
 */

function angle(a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2],
      bx = b[0],
      by = b[1],
      bz = b[2],
      mag1 = Math.sqrt(ax * ax + ay * ay + az * az),
      mag2 = Math.sqrt(bx * bx + by * by + bz * bz),
      mag = mag1 * mag2,
      cosine = mag && dot(a, b) / mag;
  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
/**
 * Set the components of a vec3 to zero
 *
 * @param {vec3} out the receiving vector
 * @returns {vec3} out
 */

function zero(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  out[2] = 0.0;
  return out;
}
/**
 * Returns a string representation of a vector
 *
 * @param {ReadonlyVec3} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str(a) {
  return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
}
/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyVec3} a The first vector.
 * @param {ReadonlyVec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {ReadonlyVec3} a The first vector.
 * @param {ReadonlyVec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2];
  return Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2));
}
/**
 * Alias for {@link vec3.subtract}
 * @function
 */

var sub = subtract;
/**
 * Alias for {@link vec3.multiply}
 * @function
 */

var mul = multiply;
/**
 * Alias for {@link vec3.divide}
 * @function
 */

var div = divide;
/**
 * Alias for {@link vec3.distance}
 * @function
 */

var dist = distance;
/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */

var sqrDist = squaredDistance;
/**
 * Alias for {@link vec3.length}
 * @function
 */

var len = length;
/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */

var sqrLen = squaredLength;
/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach = function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }

    return a;
  };
}();

/***/ }),

/***/ 44779:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ zip)
/* harmony export */ });
/* harmony import */ var _transpose_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(43183);


function zip() {
  return (0,_transpose_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(arguments);
}


/***/ }),

/***/ 20919:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(interpolator, n) {
  var samples = new Array(n);
  for (var i = 0; i < n; ++i) samples[i] = interpolator(i / (n - 1));
  return samples;
}


/***/ })

}]);