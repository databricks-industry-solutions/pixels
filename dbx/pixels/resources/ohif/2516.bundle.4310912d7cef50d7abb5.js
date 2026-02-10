"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[2516,5830],{

/***/ 82516:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  getDefaultWebWorker: () => (/* reexport */ getDefaultWebWorker),
  getPipelineWorkerUrl: () => (/* reexport */ getPipelineWorkerUrl),
  getPipelinesBaseUrl: () => (/* reexport */ getPipelinesBaseUrl),
  morphologicalContourInterpolation: () => (/* reexport */ morphological_contour_interpolation),
  setDefaultWebWorker: () => (/* reexport */ setDefaultWebWorker),
  setPipelineWorkerUrl: () => (/* reexport */ setPipelineWorkerUrl),
  setPipelinesBaseUrl: () => (/* reexport */ setPipelinesBaseUrl),
  version: () => (/* reexport */ dist_version)
});

;// ../../../node_modules/@itk-wasm/morphological-contour-interpolation/dist/version.js
const version = "1.1.0";
/* harmony default export */ const dist_version = (version);
//# sourceMappingURL=version.js.map
;// ../../../node_modules/@itk-wasm/morphological-contour-interpolation/dist/index-common.js
// Generated file. To retain edits, remove this comment.

//# sourceMappingURL=index-common.js.map
// EXTERNAL MODULE: ../../../node_modules/itk-wasm/dist/index.js + 42 modules
var dist = __webpack_require__(5830);
;// ../../../node_modules/@itk-wasm/morphological-contour-interpolation/dist/pipelines-base-url.js
// Generated file. To retain edits, remove this comment.
// Generated file. To retain edits, remove this comment.


let pipelinesBaseUrl;
let defaultPipelinesBaseUrl = `https://cdn.jsdelivr.net/npm/@itk-wasm/morphological-contour-interpolation@${dist_version}/dist/pipelines`;
function setPipelinesBaseUrl(baseUrl) {
    pipelinesBaseUrl = baseUrl;
}
function getPipelinesBaseUrl() {
    if (typeof pipelinesBaseUrl !== 'undefined') {
        return pipelinesBaseUrl;
    }
    const itkWasmPipelinesBaseUrl = (0,dist.getPipelinesBaseUrl)();
    if (typeof itkWasmPipelinesBaseUrl !== 'undefined') {
        return itkWasmPipelinesBaseUrl;
    }
    return defaultPipelinesBaseUrl;
}
//# sourceMappingURL=pipelines-base-url.js.map
;// ../../../node_modules/@itk-wasm/morphological-contour-interpolation/dist/pipeline-worker-url.js
// Generated file. To retain edits, remove this comment.
// Generated file. To retain edits, remove this comment.

let pipelineWorkerUrl;
// Use the version shipped with an app's bundler
const defaultPipelineWorkerUrl = null;
function setPipelineWorkerUrl(workerUrl) {
    pipelineWorkerUrl = workerUrl;
}
function getPipelineWorkerUrl() {
    if (typeof pipelineWorkerUrl !== 'undefined') {
        return pipelineWorkerUrl;
    }
    const itkWasmPipelineWorkerUrl = (0,dist.getPipelineWorkerUrl)();
    if (typeof itkWasmPipelineWorkerUrl !== 'undefined') {
        return itkWasmPipelineWorkerUrl;
    }
    return defaultPipelineWorkerUrl;
}
//# sourceMappingURL=pipeline-worker-url.js.map
;// ../../../node_modules/@itk-wasm/morphological-contour-interpolation/dist/default-web-worker.js
// Generated file. To retain edits, remove this comment.


let defaultWebWorker = null;
async function createNewWorker() {
    const pipelineWorkerUrl = getPipelineWorkerUrl();
    const pipelineWorkerUrlString = typeof pipelineWorkerUrl !== 'string' && typeof pipelineWorkerUrl?.href !== 'undefined' ? pipelineWorkerUrl.href : pipelineWorkerUrl;
    defaultWebWorker = await (0,dist.createWebWorker)(pipelineWorkerUrlString);
}
function setDefaultWebWorker(webWorker) {
    defaultWebWorker = webWorker;
}
async function getDefaultWebWorker() {
    if (defaultWebWorker !== null) {
        if (defaultWebWorker.terminated) {
            await createNewWorker();
        }
        return defaultWebWorker;
    }
    const itkWasmDefaultWebWorker = (0,dist.getDefaultWebWorker)();
    if (itkWasmDefaultWebWorker !== null) {
        return itkWasmDefaultWebWorker;
    }
    await createNewWorker();
    return defaultWebWorker;
}
//# sourceMappingURL=default-web-worker.js.map
;// ../../../node_modules/@itk-wasm/morphological-contour-interpolation/dist/morphological-contour-interpolation.js
// Generated file. To retain edits, remove this comment.




/**
 * Interpolates contours between slices.
 *
 * @param {Image} inputImage - The input image
 * @param {MorphologicalContourInterpolationOptions} options - options object
 *
 * @returns {Promise<MorphologicalContourInterpolationResult>} - result object
 */
async function morphologicalContourInterpolation(inputImage, options = {}) {
    const desiredOutputs = [
        { type: dist.InterfaceTypes.Image },
    ];
    const inputs = [
        { type: dist.InterfaceTypes.Image, data: inputImage },
    ];
    const args = [];
    // Inputs
    const inputImageName = '0';
    args.push(inputImageName);
    // Outputs
    const outputImageName = '0';
    args.push(outputImageName);
    // Options
    args.push('--memory-io');
    if (options.label) {
        args.push('--label', options.label.toString());
    }
    if (options.axis) {
        args.push('--axis', options.axis.toString());
    }
    if (options.noHeuristicAlignment) {
        options.noHeuristicAlignment && args.push('--no-heuristic-alignment');
    }
    if (options.noUseDistanceTransform) {
        options.noUseDistanceTransform && args.push('--no-use-distance-transform');
    }
    if (options.useCustomSlicePositions) {
        options.useCustomSlicePositions && args.push('--use-custom-slice-positions');
    }
    if (options.noUseExtrapolation) {
        options.noUseExtrapolation && args.push('--no-use-extrapolation');
    }
    if (options.useBallStructuringElement) {
        options.useBallStructuringElement && args.push('--use-ball-structuring-element');
    }
    if (options.labeledSliceIndicesAxis) {
        args.push('--labeled-slice-indices-axis', options.labeledSliceIndicesAxis.toString());
    }
    if (options.labeledSliceIndicesLabel) {
        args.push('--labeled-slice-indices-label', options.labeledSliceIndicesLabel.toString());
    }
    if (options.labeledSliceIndices) {
        if (options.labeledSliceIndices.length < 1) {
            throw new Error('"labeled-slice-indices" option must have a length > 1');
        }
        args.push('--labeled-slice-indices');
        await Promise.all(options.labeledSliceIndices.map(async (value) => {
            args.push(value.toString());
        }));
    }
    const pipelinePath = 'morphological-contour-interpolation';
    let workerToUse = options?.webWorker;
    if (workerToUse === undefined) {
        workerToUse = await getDefaultWebWorker();
    }
    const { webWorker: usedWebWorker, returnValue, stderr, outputs } = await (0,dist.runPipeline)(pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl(), pipelineWorkerUrl: getPipelineWorkerUrl(), webWorker: workerToUse, noCopy: options?.noCopy });
    if (returnValue !== 0 && stderr !== "") {
        throw new Error(stderr);
    }
    const result = {
        webWorker: usedWebWorker,
        outputImage: outputs[0]?.data,
    };
    return result;
}
/* harmony default export */ const morphological_contour_interpolation = (morphologicalContourInterpolation);
//# sourceMappingURL=morphological-contour-interpolation.js.map
;// ../../../node_modules/@itk-wasm/morphological-contour-interpolation/dist/index-only.js
// Generated file. To retain edits, remove this comment.





//# sourceMappingURL=index-only.js.map
;// ../../../node_modules/@itk-wasm/morphological-contour-interpolation/dist/index.js
// Generated file. To retain edits, remove this comment.


//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5830:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  FloatTypes: () => (/* reexport */ float_types/* default */.A),
  Image: () => (/* reexport */ interface_types_image),
  ImageType: () => (/* reexport */ image_type),
  IntTypes: () => (/* reexport */ int_types/* default */.A),
  InterfaceTypes: () => (/* reexport */ interface_types/* default */.A),
  Mesh: () => (/* reexport */ mesh),
  MeshType: () => (/* reexport */ mesh_type),
  PixelTypes: () => (/* reexport */ pixel_types),
  PolyData: () => (/* reexport */ poly_data),
  PolyDataType: () => (/* reexport */ poly_data_type),
  WorkerPool: () => (/* reexport */ worker_pool),
  bufferToTypedArray: () => (/* reexport */ buffer_to_typed_array/* default */.A),
  castImage: () => (/* reexport */ cast_image),
  copyImage: () => (/* reexport */ copy_image),
  createWebWorker: () => (/* reexport */ create_web_worker),
  getDefaultWebWorker: () => (/* reexport */ getDefaultWebWorker),
  getFileExtension: () => (/* reexport */ get_file_extension),
  getMatrixElement: () => (/* reexport */ get_matrix_element),
  getPipelineWorkerUrl: () => (/* reexport */ getPipelineWorkerUrl),
  getPipelinesBaseUrl: () => (/* reexport */ getPipelinesBaseUrl),
  imageSharedBufferOrCopy: () => (/* reexport */ image_shared_buffer_or_copy),
  meshToPolyData: () => (/* reexport */ mesh_to_poly_data),
  polyDataToMesh: () => (/* reexport */ poly_data_to_mesh),
  readDICOMTags: () => (/* reexport */ read_dicom_tags),
  readDICOMTagsArrayBuffer: () => (/* reexport */ read_dicom_tags_array_buffer),
  readImageArrayBuffer: () => (/* reexport */ read_image_array_buffer),
  readImageBlob: () => (/* reexport */ read_image_blob),
  readImageDICOMArrayBufferSeries: () => (/* reexport */ read_image_dicom_array_buffer_series),
  readImageDICOMFileSeries: () => (/* reexport */ read_image_dicom_file_series),
  readImageFile: () => (/* reexport */ read_image_file),
  readImageFileSeries: () => (/* reexport */ read_image_file_series),
  readMeshArrayBuffer: () => (/* reexport */ read_mesh_array_buffer),
  readMeshFile: () => (/* reexport */ read_mesh_file),
  runPipeline: () => (/* reexport */ run_pipeline),
  setDefaultWebWorker: () => (/* reexport */ setDefaultWebWorker),
  setPipelineWorkerUrl: () => (/* reexport */ setPipelineWorkerUrl),
  setPipelinesBaseUrl: () => (/* reexport */ setPipelinesBaseUrl),
  stackImages: () => (/* reexport */ stack_images),
  version: () => (/* reexport */ dist_version)
});

;// ../../../node_modules/itk-wasm/dist/version.js
const version = "1.0.0-b.165";
/* harmony default export */ const dist_version = (version);
//# sourceMappingURL=version.js.map
// EXTERNAL MODULE: ../../../node_modules/itk-wasm/dist/buffer-to-typed-array.js
var buffer_to_typed_array = __webpack_require__(47911);
// EXTERNAL MODULE: ../../../node_modules/itk-wasm/dist/interface-types/int-types.js
var int_types = __webpack_require__(44835);
;// ../../../node_modules/itk-wasm/dist/interface-types/pixel-types.js
const PixelTypes = {
    Unknown: 'Unknown',
    Scalar: 'Scalar',
    RGB: 'RGB',
    RGBA: 'RGBA',
    Offset: 'Offset',
    Vector: 'Vector',
    Point: 'Point',
    CovariantVector: 'CovariantVector',
    SymmetricSecondRankTensor: 'SymmetricSecondRankTensor',
    DiffusionTensor3D: 'DiffusionTensor3D',
    Complex: 'Complex',
    FixedArray: 'FixedArray',
    Array: 'Array',
    Matrix: 'Matrix',
    VariableLengthVector: 'VariableLengthVector',
    VariableSizeMatrix: 'VariableSizeMatrix'
};
/* harmony default export */ const pixel_types = (PixelTypes);
//# sourceMappingURL=pixel-types.js.map
;// ../../../node_modules/itk-wasm/dist/interface-types/image-type.js


class ImageType {
    dimension;
    componentType;
    pixelType;
    components;
    constructor(dimension = 2, componentType = int_types/* default */.A.UInt8, pixelType = pixel_types.Scalar, components = 1) {
        this.dimension = dimension;
        this.componentType = componentType;
        this.pixelType = pixelType;
        this.components = components;
    }
}
/* harmony default export */ const image_type = (ImageType);
//# sourceMappingURL=image-type.js.map
;// ../../../node_modules/itk-wasm/dist/set-matrix-element.js
function setMatrixElement(matrixData, columns, row, column, value) {
    matrixData[column + row * columns] = value;
}
/* harmony default export */ const set_matrix_element = (setMatrixElement);
//# sourceMappingURL=set-matrix-element.js.map
;// ../../../node_modules/itk-wasm/dist/interface-types/image.js


class Image {
    imageType;
    name = 'image';
    origin;
    spacing;
    direction;
    size;
    metadata;
    data;
    constructor(imageType = new image_type()) {
        this.imageType = imageType;
        const dimension = imageType.dimension;
        this.origin = new Array(dimension);
        this.origin.fill(0.0);
        this.spacing = new Array(dimension);
        this.spacing.fill(1.0);
        this.direction = new Float64Array(dimension * dimension);
        this.direction.fill(0.0);
        for (let ii = 0; ii < dimension; ii++) {
            set_matrix_element(this.direction, dimension, ii, ii, 1.0);
        }
        this.size = new Array(dimension);
        this.size.fill(0);
        this.metadata = new Map();
        this.data = null;
    }
}
/* harmony default export */ const interface_types_image = (Image);
//# sourceMappingURL=image.js.map
;// ../../../node_modules/itk-wasm/dist/copy-image.js

function copyImage(image) {
    const copy = new interface_types_image(image.imageType);
    copy.name = image.name;
    copy.origin = Array.from(image.origin);
    copy.spacing = Array.from(image.spacing);
    copy.direction = image.direction.slice();
    copy.size = Array.from(image.size);
    if (image.data !== null) {
        const CTor = image.data.constructor;
        copy.data = new CTor(image.data.length);
        if (copy.data != null) {
            // @ts-expect-error: error TS2345: Argument of type 'TypedArray' is not assignable to parameter of type 'ArrayLike<number> & ArrayLike<bigint>'
            copy.data.set(image.data, 0);
        }
    }
    return copy;
}
/* harmony default export */ const copy_image = (copyImage);
//# sourceMappingURL=copy-image.js.map
;// ../../../node_modules/itk-wasm/dist/image-shared-buffer-or-copy.js

const haveSharedArrayBuffer = typeof globalThis.SharedArrayBuffer === 'function';
/** If SharedArrayBuffer's are available, ensure an itk.Image's buffer is a
 * SharedArrayBuffer. If SharedArrayBuffer's are not available, return a copy.
 * */
function imageSharedBufferOrCopy(image) {
    if (image.data === null) {
        return image;
    }
    if (haveSharedArrayBuffer) {
        if (image.data.buffer instanceof SharedArrayBuffer) { // eslint-disable-line
            return image;
        }
        const sharedBuffer = new SharedArrayBuffer(image.data.buffer.byteLength); // eslint-disable-line
        const CTor = image.data.constructor;
        const sharedTypedArray = new CTor(sharedBuffer);
        if (sharedTypedArray !== null) {
            // @ts-expect-error: error TS2345: Argument of type 'TypedArray' is not assignable to parameter of type 'ArrayLike<number> & ArrayLike<bigint>'.
            sharedTypedArray.set(image.data, 0);
        }
        image.data = sharedTypedArray;
        return image;
    }
    else {
        return copy_image(image);
    }
}
/* harmony default export */ const image_shared_buffer_or_copy = (imageSharedBufferOrCopy);
//# sourceMappingURL=image-shared-buffer-or-copy.js.map
;// ../../../node_modules/itk-wasm/dist/stack-images.js

/** Join an array of sequential image slabs into a single image */
function stackImages(images) {
    if (images.length < 1) {
        throw Error('At least one images is required.');
    }
    const firstImage = images[0];
    if (firstImage.data === null) {
        throw Error('Image data is null.');
    }
    const result = new interface_types_image(firstImage.imageType);
    result.origin = Array.from(firstImage.origin);
    result.spacing = Array.from(firstImage.spacing);
    const dimension = result.imageType.dimension;
    result.direction = firstImage.direction.slice();
    const stackOn = dimension - 1;
    result.size = Array.from(firstImage.size);
    const stackedSize = images.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.size[stackOn];
    }, 0);
    result.size[stackOn] = stackedSize;
    const dataSize = result.size.reduce((accumulator, currentValue) => { return accumulator * currentValue; }, 1) * result.imageType.components;
    const CTor = firstImage.data.constructor;
    result.data = new CTor(dataSize);
    let offsetBase = result.imageType.components;
    for (let subIndex = 0; subIndex < result.size.length - 1; subIndex++) {
        offsetBase *= result.size[subIndex];
    }
    let stackIndex = 0;
    if (result.data != null) {
        for (let index = 0; index < images.length; index++) {
            // @ts-expect-error: error TS2345: Argument of type 'TypedArray' is not assignable to parameter of type 'ArrayLike<number> & ArrayLike<bigint>'.
            result.data.set(images[index].data, offsetBase * stackIndex);
            stackIndex += images[index].size[stackOn];
        }
    }
    else {
        throw Error('Could not create result image data.');
    }
    return result;
}
/* harmony default export */ const stack_images = (stackImages);
//# sourceMappingURL=stack-images.js.map
;// ../../../node_modules/itk-wasm/dist/get-file-extension.js
function getFileExtension(filePath) {
    let extension = filePath.slice((filePath.lastIndexOf('.') - 1 >>> 0) + 2);
    if (extension.toLowerCase() === 'gz') {
        const index = filePath.slice(0, -3).lastIndexOf('.');
        extension = filePath.slice((index - 1 >>> 0) + 2);
    }
    else if (extension.toLowerCase() === 'cbor') {
        const index = filePath.slice(0, -5).lastIndexOf('.');
        extension = filePath.slice((index - 1 >>> 0) + 2);
    }
    else if (extension.toLowerCase() === 'zst') {
        // .iwi.cbor.zstd
        const index = filePath.slice(0, -10).lastIndexOf('.');
        extension = filePath.slice((index - 1 >>> 0) + 2);
    }
    else if (extension.toLowerCase() === 'zip') {
        const index = filePath.slice(0, -4).lastIndexOf('.');
        extension = filePath.slice((index - 1 >>> 0) + 2);
    }
    return extension;
}
/* harmony default export */ const get_file_extension = (getFileExtension);
//# sourceMappingURL=get-file-extension.js.map
;// ../../../node_modules/itk-wasm/dist/get-matrix-element.js
function getMatrixElement(matrixData, columns, row, column) {
    return matrixData[column + row * columns];
}
/* harmony default export */ const get_matrix_element = (getMatrixElement);
//# sourceMappingURL=get-matrix-element.js.map
// EXTERNAL MODULE: ../../../node_modules/itk-wasm/dist/interface-types/float-types.js
var float_types = __webpack_require__(74112);
;// ../../../node_modules/itk-wasm/dist/cast-image.js




/**
 * Cast an image to another PixelType and/or ComponentType
 *
 * @param {Image} image - The input image
 * @param {CastImageOptions} options - specify the componentType and/or pixelType of the output
 */
function castImage(inputImage, options) {
    const outputImageType = { ...inputImage.imageType };
    if (typeof options !== 'undefined' && typeof options.pixelType !== 'undefined') {
        outputImageType.pixelType = options.pixelType;
        if (options.pixelType === pixel_types.Scalar && outputImageType.components !== 1) {
            throw new Error('Cannot cast multi-component image to a scalar image');
        }
    }
    if (typeof options !== 'undefined' && typeof options.componentType !== 'undefined' && options.componentType !== inputImage.imageType.componentType) {
        outputImageType.componentType = options.componentType;
    }
    const outputImage = new interface_types_image(outputImageType);
    outputImage.name = inputImage.name;
    outputImage.origin = Array.from(inputImage.origin);
    outputImage.spacing = Array.from(inputImage.spacing);
    outputImage.direction = inputImage.direction.slice();
    outputImage.size = Array.from(inputImage.size);
    // Deep copy the map
    outputImage.metadata = new Map(JSON.parse(JSON.stringify(Array.from(inputImage.metadata))));
    if (inputImage.data !== null) {
        if (typeof options !== 'undefined' && typeof options.componentType !== 'undefined' && options.componentType !== inputImage.imageType.componentType) {
            switch (inputImage.imageType.componentType) {
                case int_types/* default */.A.UInt8:
                case int_types/* default */.A.Int8:
                case int_types/* default */.A.UInt16:
                case int_types/* default */.A.Int16:
                case int_types/* default */.A.UInt32:
                case int_types/* default */.A.Int32:
                case float_types/* default */.A.Float32:
                case float_types/* default */.A.Float64:
                    switch (outputImage.imageType.componentType) {
                        case int_types/* default */.A.UInt8:
                            outputImage.data = new Uint8Array(inputImage.data);
                            break;
                        case int_types/* default */.A.Int8:
                            outputImage.data = new Int8Array(inputImage.data);
                            break;
                        case int_types/* default */.A.UInt16:
                            outputImage.data = new Uint16Array(inputImage.data);
                            break;
                        case int_types/* default */.A.Int16:
                            outputImage.data = new Int16Array(inputImage.data);
                            break;
                        case int_types/* default */.A.UInt32:
                            outputImage.data = new Uint32Array(inputImage.data);
                            break;
                        case int_types/* default */.A.Int32:
                            outputImage.data = new Int32Array(inputImage.data);
                            break;
                        case float_types/* default */.A.Float32:
                            outputImage.data = new Float32Array(inputImage.data);
                            break;
                        case float_types/* default */.A.Float64:
                            outputImage.data = new Float64Array(inputImage.data);
                            break;
                        case int_types/* default */.A.UInt64:
                            outputImage.data = new BigUint64Array(inputImage.data.length);
                            for (let idx = 0; idx < outputImage.data.length; idx++) {
                                outputImage.data[idx] = BigInt.asIntN(64, BigInt(inputImage.data[idx]));
                            }
                            break;
                        case int_types/* default */.A.Int64:
                            outputImage.data = new BigInt64Array(inputImage.data.length);
                            for (let idx = 0; idx < outputImage.data.length; idx++) {
                                outputImage.data[idx] = BigInt.asUintN(64, BigInt(inputImage.data[idx]));
                            }
                            break;
                    }
                    break;
                case int_types/* default */.A.UInt64:
                case int_types/* default */.A.Int64:
                    switch (outputImage.imageType.componentType) {
                        case int_types/* default */.A.UInt8:
                            outputImage.data = new Uint8Array(inputImage.data.length);
                            for (let idx = 0; idx < outputImage.data.length; idx++) {
                                outputImage.data[idx] = Number(inputImage.data[idx]);
                            }
                            break;
                        case int_types/* default */.A.Int8:
                            outputImage.data = new Int8Array(inputImage.data.length);
                            for (let idx = 0; idx < outputImage.data.length; idx++) {
                                outputImage.data[idx] = Number(inputImage.data[idx]);
                            }
                            break;
                        case int_types/* default */.A.UInt16:
                            outputImage.data = new Uint16Array(inputImage.data.length);
                            for (let idx = 0; idx < outputImage.data.length; idx++) {
                                outputImage.data[idx] = Number(inputImage.data[idx]);
                            }
                            break;
                        case int_types/* default */.A.Int16:
                            outputImage.data = new Int16Array(inputImage.data.length);
                            for (let idx = 0; idx < outputImage.data.length; idx++) {
                                outputImage.data[idx] = Number(inputImage.data[idx]);
                            }
                            break;
                        case int_types/* default */.A.UInt32:
                            outputImage.data = new Uint32Array(inputImage.data.length);
                            for (let idx = 0; idx < outputImage.data.length; idx++) {
                                outputImage.data[idx] = Number(inputImage.data[idx]);
                            }
                            break;
                        case int_types/* default */.A.Int32:
                            outputImage.data = new Int32Array(inputImage.data.length);
                            for (let idx = 0; idx < outputImage.data.length; idx++) {
                                outputImage.data[idx] = Number(inputImage.data[idx]);
                            }
                            break;
                        case float_types/* default */.A.Float32:
                            outputImage.data = new Float32Array(inputImage.data.length);
                            for (let idx = 0; idx < outputImage.data.length; idx++) {
                                outputImage.data[idx] = Number(inputImage.data[idx]);
                            }
                            break;
                        case float_types/* default */.A.Float64:
                            outputImage.data = new Float64Array(inputImage.data.length);
                            for (let idx = 0; idx < outputImage.data.length; idx++) {
                                outputImage.data[idx] = Number(inputImage.data[idx]);
                            }
                            break;
                        case int_types/* default */.A.UInt64:
                            outputImage.data = new BigUint64Array(inputImage.data);
                            break;
                        case int_types/* default */.A.Int64:
                            outputImage.data = new BigInt64Array(inputImage.data);
                            break;
                    }
                    break;
            }
        }
        else {
            // copy
            const CTor = inputImage.data.constructor;
            outputImage.data = new CTor(inputImage.data.length);
            if (outputImage.data != null) {
                // @ts-expect-error: error TS2345: Argument of type 'TypedArray' is not assignable to parameter of type 'ArrayLike<number> & ArrayLike<bigint>'
                outputImage.data.set(inputImage.data, 0);
            }
        }
    }
    return outputImage;
}
/* harmony default export */ const cast_image = (castImage);
//# sourceMappingURL=cast-image.js.map
;// ../../../node_modules/itk-wasm/dist/worker-pool/worker-pool.js
/* eslint-disable  @typescript-eslint/no-non-null-assertion */
class WorkerPool {
    fcn;
    workerQueue;
    runInfo;
    /*
     * poolSize is the maximum number of web workers to create in the pool.
     *
     * The function, `fcn,` must accept in its last argument an options object with a
     * `webWorker` property that is a web worker to use for computation. The
     * function must also return a promise that resolves to an object with the
     * with the results of the computation and the used worker in the `webWorker`
     * property.
     *
     **/
    constructor(poolSize, fcn) {
        this.fcn = fcn;
        this.workerQueue = new Array(poolSize);
        this.workerQueue.fill(null);
        this.runInfo = [];
    }
    /*
     * Run the tasks specified by the arguments in the taskArgsArray that will
     * be passed to the pool fcn.
     *
     * An optional progressCallback will be called with the number of complete
     * tasks and the total number of tasks as arguments every time a task has
     * completed.
     *
     * Returns an object containing a promise ('promise') to communicate results
     * as well as an id ('runId') which can be used to cancel any remaining pending
     * tasks before they complete.
     */
    runTasks(taskArgsArray, progressCallback = null) {
        const info = {
            taskQueue: [],
            results: [],
            addingTasks: false,
            postponed: false,
            runningWorkers: 0,
            index: 0,
            completedTasks: 0,
            progressCallback,
            canceled: false
        };
        this.runInfo.push(info);
        info.index = this.runInfo.length - 1;
        return {
            promise: new Promise((resolve, reject) => {
                info.resolve = resolve;
                info.reject = reject;
                info.results = new Array(taskArgsArray.length);
                info.completedTasks = 0;
                info.addingTasks = true;
                taskArgsArray.forEach((taskArg, index) => {
                    this.addTask(info.index, index, taskArg);
                });
                info.addingTasks = false;
            }),
            runId: info.index
        };
    }
    terminateWorkers() {
        for (let index = 0; index < this.workerQueue.length; index++) {
            const worker = this.workerQueue[index];
            if (worker != null) {
                worker.terminate();
            }
            this.workerQueue[index] = null;
        }
    }
    cancel(runId) {
        const info = this.runInfo[runId];
        if (info !== null && info !== undefined) {
            info.canceled = true;
        }
    }
    addTask(infoIndex, resultIndex, taskArgs) {
        const info = this.runInfo[infoIndex];
        if (info?.canceled === true) {
            info.reject('Remaining tasks canceled');
            this.clearTask(info.index);
            return;
        }
        if (this.workerQueue.length > 0) {
            const worker = this.workerQueue.pop();
            info.runningWorkers++;
            taskArgs[taskArgs.length - 1].webWorker = worker;
            // @ts-expect-error: TS7031: Binding element 'webWorker' implicitly has an 'any' type.
            this.fcn(...taskArgs).then(({ webWorker, ...result }) => {
                this.workerQueue.push(webWorker);
                // Check if this task was canceled while it was getting done
                if (this.runInfo[infoIndex] !== null) {
                    info.runningWorkers--;
                    info.results[resultIndex] = result;
                    info.completedTasks++;
                    if (info.progressCallback != null) {
                        info.progressCallback(info.completedTasks, info.results.length);
                    }
                    if (info.taskQueue.length > 0) {
                        const reTask = info.taskQueue.shift();
                        this.addTask(infoIndex, reTask[0], reTask[1]);
                    }
                    else if (!info.addingTasks && info.runningWorkers === 0) {
                        const results = info.results;
                        info.resolve(results);
                        this.clearTask(info.index);
                    }
                }
                // @ts-expect-error: TS7006: Parameter 'error' implicitly has an 'any' type.
            }).catch((error) => {
                info.reject(error);
                this.clearTask(info.index);
            });
        }
        else {
            if (info.runningWorkers !== 0 || info.postponed) {
                // At least one worker is working on these tasks, and it will pick up
                // the next item in the taskQueue when done.
                info.taskQueue.push([resultIndex, taskArgs]);
            }
            else {
                // Try again later.
                info.postponed = true;
                setTimeout(() => {
                    info.postponed = false;
                    this.addTask(info.index, resultIndex, taskArgs);
                }, 50);
            }
        }
    }
    clearTask(clearIndex) {
        this.runInfo[clearIndex].results = [];
        this.runInfo[clearIndex].taskQueue = [];
        this.runInfo[clearIndex].progressCallback = null;
        this.runInfo[clearIndex].canceled = null;
        this.runInfo[clearIndex].reject = () => { };
        this.runInfo[clearIndex].resolve = () => { };
    }
}
/* harmony default export */ const worker_pool = (WorkerPool);
//# sourceMappingURL=worker-pool.js.map
;// ../../../node_modules/itk-wasm/dist/worker-pool/index.js
// itk-wasm WebWorker API interfaces, data structures, and functions

//# sourceMappingURL=index.js.map
;// ../../../node_modules/itk-wasm/dist/interface-types/mesh-type.js



class MeshType {
    dimension;
    pointComponentType;
    pointPixelComponentType;
    pointPixelType;
    pointPixelComponents;
    cellComponentType;
    cellPixelComponentType;
    cellPixelType;
    cellPixelComponents;
    constructor(dimension = 2, pointComponentType = float_types/* default */.A.Float32, pointPixelComponentType = float_types/* default */.A.Float32, pointPixelType = pixel_types.Scalar, pointPixelComponents = 1, cellComponentType = int_types/* default */.A.Int32, cellPixelComponentType = float_types/* default */.A.Float32, cellPixelType = pixel_types.Scalar, cellPixelComponents = 1) {
        this.dimension = dimension;
        this.pointComponentType = pointComponentType;
        this.pointPixelComponentType = pointPixelComponentType;
        this.pointPixelType = pointPixelType;
        this.pointPixelComponents = pointPixelComponents;
        this.cellComponentType = cellComponentType;
        this.cellPixelComponentType = cellPixelComponentType;
        this.cellPixelType = cellPixelType;
        this.cellPixelComponents = cellPixelComponents;
    }
}
/* harmony default export */ const mesh_type = (MeshType);
//# sourceMappingURL=mesh-type.js.map
;// ../../../node_modules/itk-wasm/dist/interface-types/mesh.js

class Mesh {
    mt;
    meshType;
    name = 'mesh';
    numberOfPoints;
    points;
    numberOfPointPixels;
    pointData;
    numberOfCells;
    cells;
    cellBufferSize;
    numberOfCellPixels;
    cellData;
    constructor(mt = new mesh_type()) {
        this.mt = mt;
        this.meshType = mt;
        this.name = 'mesh';
        this.numberOfPoints = 0;
        this.points = null;
        this.numberOfPointPixels = 0;
        this.pointData = null;
        this.numberOfCells = 0;
        this.cellBufferSize = 0;
        this.cells = null;
        this.numberOfCellPixels = 0;
        this.cellData = null;
    }
}
/* harmony default export */ const mesh = (Mesh);
//# sourceMappingURL=mesh.js.map
;// ../../../node_modules/itk-wasm/dist/interface-types/poly-data-type.js


class PolyDataType {
    pointPixelComponentType;
    pointPixelType;
    pointPixelComponents;
    cellPixelComponentType;
    cellPixelType;
    cellPixelComponents;
    constructor(pointPixelComponentType = float_types/* default */.A.Float32, pointPixelType = pixel_types.Scalar, pointPixelComponents = 1, cellPixelComponentType = float_types/* default */.A.Float32, cellPixelType = pixel_types.Scalar, cellPixelComponents = 1) {
        this.pointPixelComponentType = pointPixelComponentType;
        this.pointPixelType = pointPixelType;
        this.pointPixelComponents = pointPixelComponents;
        this.cellPixelComponentType = cellPixelComponentType;
        this.cellPixelType = cellPixelType;
        this.cellPixelComponents = cellPixelComponents;
    }
}
/* harmony default export */ const poly_data_type = (PolyDataType);
//# sourceMappingURL=poly-data-type.js.map
;// ../../../node_modules/itk-wasm/dist/interface-types/poly-data.js

class PolyData {
    polyDataType;
    name = 'PolyData';
    numberOfPoints;
    points;
    verticesBufferSize;
    vertices;
    linesBufferSize;
    lines;
    polygonsBufferSize;
    polygons;
    triangleStripsBufferSize;
    triangleStrips;
    numberOfPointPixels;
    pointData;
    numberOfCellPixels;
    cellData;
    constructor(polyDataType = new poly_data_type()) {
        this.polyDataType = polyDataType;
        this.polyDataType = polyDataType;
        this.name = 'PolyData';
        this.numberOfPoints = 0;
        this.points = new Float32Array();
        this.verticesBufferSize = 0;
        this.vertices = null;
        this.linesBufferSize = 0;
        this.lines = null;
        this.polygonsBufferSize = 0;
        this.polygons = null;
        this.triangleStripsBufferSize = 0;
        this.triangleStrips = null;
        this.numberOfPointPixels = 0;
        this.pointData = null;
        this.numberOfCellPixels = 0;
        this.cellData = null;
    }
}
/* harmony default export */ const poly_data = (PolyData);
//# sourceMappingURL=poly-data.js.map
// EXTERNAL MODULE: ../../../node_modules/itk-wasm/dist/interface-types/interface-types.js
var interface_types = __webpack_require__(16881);
;// ../../../node_modules/itk-wasm/dist/interface-types/index-common.js
// itk-wasm interface types










//# sourceMappingURL=index-common.js.map
;// ../../../node_modules/itk-wasm/dist/pipeline/index-common.js

//# sourceMappingURL=index-common.js.map
;// ../../../node_modules/itk-wasm/dist/index-common.js
// Core API interfaces, data structures, and functions











// export * from './deprecated/index-common.js'
//# sourceMappingURL=index-common.js.map
// EXTERNAL MODULE: ../../../node_modules/comlink/dist/esm/comlink.mjs
var comlink = __webpack_require__(99178);
// EXTERNAL MODULE: ../../../node_modules/axios/index.js + 49 modules
var axios = __webpack_require__(17739);
;// ../../../node_modules/itk-wasm/dist/pipeline/create-web-worker.js

async function createWebWorker(pipelineWorkerUrl) {
    const workerUrl = pipelineWorkerUrl;
    let worker = null;
    if (workerUrl === null) {
        // Use the version built with the bundler
        //
        // Bundlers, e.g. WebPack, Vite, Rollup, see these paths at build time
        worker = new Worker(new URL(/* worker import */ __webpack_require__.p + __webpack_require__.u(6376), __webpack_require__.b), { type: undefined });
    }
    else {
        if (workerUrl.startsWith('http')) {
            const response = await axios/* default */.Ay.get(workerUrl, { responseType: 'blob' });
            const workerObjectUrl = URL.createObjectURL(response.data);
            worker = new Worker(workerObjectUrl, { type: 'module' });
        }
        else {
            worker = new Worker(workerUrl, { type: 'module' });
        }
    }
    return worker;
}
/* harmony default export */ const create_web_worker = (createWebWorker);
//# sourceMappingURL=create-web-worker.js.map
;// ../../../node_modules/itk-wasm/dist/pipeline/create-worker-proxy.js


function workerToWorkerProxy(worker) {
    const workerProxy = comlink/* wrap */.LV(worker);
    const itkWebWorker = worker;
    itkWebWorker.terminated = false;
    itkWebWorker.workerProxy = workerProxy;
    itkWebWorker.originalTerminate = itkWebWorker.terminate;
    itkWebWorker.terminate = () => {
        itkWebWorker.terminated = true;
        itkWebWorker.workerProxy[comlink/* releaseProxy */.A2]();
        itkWebWorker.originalTerminate();
    };
    return { workerProxy, worker: itkWebWorker };
}
// Internal function to create a web worker proxy
async function createWorkerProxy(existingWorker, pipelineWorkerUrl) {
    let workerProxy;
    if (existingWorker != null) {
        // See if we have a worker promise attached the worker, if so reuse it. This ensures
        // that we can safely reuse the worker without issues.
        const itkWebWorker = existingWorker;
        if (itkWebWorker.workerProxy !== undefined) {
            workerProxy = itkWebWorker.workerProxy;
            return { workerProxy, worker: itkWebWorker };
        }
        else {
            return workerToWorkerProxy(existingWorker);
        }
    }
    const worker = await create_web_worker(pipelineWorkerUrl);
    return workerToWorkerProxy(worker);
}
/* harmony default export */ const create_worker_proxy = (createWorkerProxy);
//# sourceMappingURL=create-worker-proxy.js.map
;// ../../../node_modules/itk-wasm/dist/pipeline/internal/load-emscripten-module-main-thread.js

async function loadEmscriptenModuleMainThread(moduleRelativePathOrURL, baseUrl) {
    let modulePrefix = 'unknown';
    if (typeof moduleRelativePathOrURL !== 'string') {
        modulePrefix = moduleRelativePathOrURL.href;
    }
    else if (moduleRelativePathOrURL.startsWith('http')) {
        modulePrefix = moduleRelativePathOrURL;
    }
    else {
        modulePrefix = typeof baseUrl !== 'undefined' ? `${baseUrl}/${moduleRelativePathOrURL}` : moduleRelativePathOrURL;
    }
    if (modulePrefix.endsWith('.js')) {
        modulePrefix = modulePrefix.substring(0, modulePrefix.length - 3);
    }
    if (modulePrefix.endsWith('.wasm')) {
        modulePrefix = modulePrefix.substring(0, modulePrefix.length - 5);
    }
    const wasmBinaryPath = `${modulePrefix}.wasm`;
    const response = await axios/* default */.Ay.get(wasmBinaryPath, { responseType: 'arraybuffer' });
    const wasmBinary = response.data;
    const fullModulePath = `${modulePrefix}.js`;
    const result = await import(/* webpackIgnore: true */ /* @vite-ignore */ fullModulePath);
    const instantiated = result.default({ wasmBinary });
    return instantiated;
}
/* harmony default export */ const load_emscripten_module_main_thread = (loadEmscriptenModuleMainThread);
//# sourceMappingURL=load-emscripten-module-main-thread.js.map
;// ../../../node_modules/wasm-feature-detect/dist/esm/index.js
const bigInt=()=>(async e=>{try{return(await WebAssembly.instantiate(e)).instance.exports.b(BigInt(0))===BigInt(0)}catch(e){return!1}})(new Uint8Array([0,97,115,109,1,0,0,0,1,6,1,96,1,126,1,126,3,2,1,0,7,5,1,1,98,0,0,10,6,1,4,0,32,0,11])),bulkMemory=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,3,1,0,1,10,14,1,12,0,65,0,65,0,65,0,252,10,0,0,11])),exceptions=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,8,1,6,0,6,64,25,11,11])),exceptionsFinal=()=>(async()=>{try{return new WebAssembly.Module(Uint8Array.from(atob("AGFzbQEAAAABBAFgAAADAgEAChABDgACaR9AAQMAAAsACxoL"),(e=>e.codePointAt(0)))),!0}catch(e){return!1}})(),extendedConst=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,5,3,1,0,1,11,9,1,0,65,1,65,2,106,11,0])),gc=()=>(async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,95,1,120,0])))(),jsStringBuiltins=()=>(async()=>{try{return await WebAssembly.instantiate(Uint8Array.from(atob("AGFzbQEAAAABBgFgAW8BfwIXAQ53YXNtOmpzLXN0cmluZwR0ZXN0AAA="),(e=>e.codePointAt(0))),{},{builtins:["js-string"]}),!0}catch(e){return!1}})(),jspi=()=>(async()=>"Suspending"in WebAssembly)(),memory64=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,5,3,1,4,1])),multiMemory=()=>(async()=>{try{return new WebAssembly.Module(new Uint8Array([0,97,115,109,1,0,0,0,5,5,2,0,0,0,0])),!0}catch(e){return!1}})(),multiValue=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,6,1,96,0,2,127,127,3,2,1,0,10,8,1,6,0,65,0,65,0,11])),mutableGlobals=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,2,8,1,1,97,1,98,3,127,1,6,6,1,127,1,65,0,11,7,5,1,1,97,3,1])),referenceTypes=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,7,1,5,0,208,112,26,11])),relaxedSimd=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,15,1,13,0,65,1,253,15,65,2,253,15,253,128,2,11])),saturatedFloatToInt=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,12,1,10,0,67,0,0,0,0,252,0,26,11])),signExtensions=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,8,1,6,0,65,0,192,26,11])),simd=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11])),streamingCompilation=()=>(async()=>"compileStreaming"in WebAssembly)(),tailCall=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,6,1,4,0,18,0,11])),threads=()=>(async e=>{try{return"undefined"!=typeof MessageChannel&&(new MessageChannel).port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(e)}catch(e){return!1}})(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11])),typeReflection=()=>(async()=>"Function"in WebAssembly)(),typedFunctionReferences=()=>(async()=>{try{return new WebAssembly.Module(Uint8Array.from(atob("AGFzbQEAAAABEANgAX8Bf2ABZAABf2AAAX8DBAMBAAIJBQEDAAEBChwDCwBBCkEqIAAUAGoLBwAgAEEBagsGANIBEAAL"),(e=>e.codePointAt(0)))),!0}catch(e){return!1}})();

// EXTERNAL MODULE: ../../../node_modules/itk-wasm/dist/pipeline/internal/run-pipeline-emscripten.js
var run_pipeline_emscripten = __webpack_require__(8792);
// EXTERNAL MODULE: ../../../node_modules/itk-wasm/dist/get-transferables.js
var get_transferables = __webpack_require__(46619);
// EXTERNAL MODULE: ../../../node_modules/itk-wasm/dist/pipeline/internal/image-transferables.js
var image_transferables = __webpack_require__(27295);
// EXTERNAL MODULE: ../../../node_modules/itk-wasm/dist/pipeline/internal/mesh-transferables.js
var mesh_transferables = __webpack_require__(50295);
// EXTERNAL MODULE: ../../../node_modules/itk-wasm/dist/pipeline/internal/poly-data-transferables.js
var poly_data_transferables = __webpack_require__(3099);
;// ../../../node_modules/itk-wasm/dist/pipeline/pipelines-base-url.js
let pipelinesBaseUrl;
function setPipelinesBaseUrl(baseUrl) {
    pipelinesBaseUrl = baseUrl;
}
function getPipelinesBaseUrl() {
    return pipelinesBaseUrl;
}
//# sourceMappingURL=pipelines-base-url.js.map
;// ../../../node_modules/itk-wasm/dist/pipeline/pipeline-worker-url.js
let pipelineWorkerUrl;
function setPipelineWorkerUrl(workerUrl) {
    pipelineWorkerUrl = workerUrl;
}
function getPipelineWorkerUrl() {
    return pipelineWorkerUrl;
}
//# sourceMappingURL=pipeline-worker-url.js.map
;// ../../../node_modules/itk-wasm/dist/pipeline/run-pipeline.js












// To cache loaded pipeline modules
const pipelineToModule = new Map();
function defaultPipelineWorkerUrl() {
    let result = getPipelineWorkerUrl();
    if (typeof result === 'undefined') {
        result = null;
    }
    return result;
}
function defaultPipelinesBaseUrl() {
    let result = getPipelinesBaseUrl();
    if (typeof result === 'undefined') {
        result = new URL('/pipelines', document.location.origin).href;
    }
    return result;
}
async function loadPipelineModule(pipelinePath, pipelineBaseUrl) {
    let moduleRelativePathOrURL = pipelinePath;
    let pipeline = pipelinePath;
    if (typeof pipelinePath !== 'string') {
        moduleRelativePathOrURL = new URL(pipelinePath.href);
        pipeline = moduleRelativePathOrURL.href;
    }
    if (pipelineToModule.has(pipeline)) {
        return pipelineToModule.get(pipeline);
    }
    else {
        const pipelineModule = (await load_emscripten_module_main_thread(pipelinePath, pipelineBaseUrl?.toString() ?? defaultPipelinesBaseUrl()));
        pipelineToModule.set(pipeline, pipelineModule);
        return pipelineModule;
    }
}
async function runPipeline(pipelinePath, args, outputs, inputs, options) {
    if (!await simd()) {
        const simdErrorMessage = 'WebAssembly SIMD support is required -- please update your browser.';
        alert(simdErrorMessage);
        throw new Error(simdErrorMessage);
    }
    const webWorker = options?.webWorker ?? null;
    if (webWorker === false) {
        const pipelineModule = await loadPipelineModule(pipelinePath.toString(), options?.pipelineBaseUrl);
        const result = (0,run_pipeline_emscripten/* default */.A)(pipelineModule, args, outputs, inputs);
        return result;
    }
    let worker = webWorker;
    const pipelineWorkerUrl = options?.pipelineWorkerUrl ?? defaultPipelineWorkerUrl();
    const pipelineWorkerUrlString = typeof pipelineWorkerUrl !== 'string' && typeof pipelineWorkerUrl?.href !== 'undefined' ? pipelineWorkerUrl.href : pipelineWorkerUrl;
    const { workerProxy, worker: usedWorker } = await create_worker_proxy(worker, pipelineWorkerUrlString);
    worker = usedWorker;
    const transferables = [];
    if (!(inputs == null) && inputs.length > 0) {
        inputs.forEach(function (input) {
            if (input.type === interface_types/* default */.A.BinaryStream) {
                // Binary data
                const dataArray = input.data.data;
                transferables.push(dataArray);
            }
            else if (input.type === interface_types/* default */.A.BinaryFile) {
                // Binary data
                const dataArray = input.data.data;
                transferables.push(dataArray);
            }
            else if (input.type === interface_types/* default */.A.Image) {
                // Image data
                const image = input.data;
                if (image.data !== null) {
                    transferables.push(...(0,image_transferables/* default */.A)(image));
                }
            }
            else if (input.type === interface_types/* default */.A.Mesh) {
                // Mesh data
                const mesh = input.data;
                transferables.push(...(0,mesh_transferables/* default */.A)(mesh));
            }
            else if (input.type === interface_types/* default */.A.PolyData) {
                // PolyData data
                const polyData = input.data;
                transferables.push(...(0,poly_data_transferables/* default */.A)(polyData));
            }
        });
    }
    const pipelineBaseUrl = options?.pipelineBaseUrl ?? defaultPipelinesBaseUrl();
    const pipelineBaseUrlString = typeof pipelineBaseUrl !== 'string' && typeof pipelineBaseUrl?.href !== 'undefined' ? pipelineBaseUrl.href : pipelineBaseUrl;
    const transferedInputs = (inputs != null) ? comlink/* transfer */.k0(inputs, (0,get_transferables/* default */.A)(transferables, options?.noCopy)) : null;
    const result = await workerProxy.runPipeline(pipelinePath.toString(), pipelineBaseUrlString, args, outputs, transferedInputs);
    return {
        returnValue: result.returnValue,
        stdout: result.stdout,
        stderr: result.stderr,
        outputs: result.outputs,
        webWorker: worker
    };
}
/* harmony default export */ const run_pipeline = (runPipeline);
//# sourceMappingURL=run-pipeline.js.map
;// ../../../node_modules/itk-wasm/dist/pipeline/default-web-worker.js
let defaultWebWorker = null;
/**
 * Set the default web worker for functions in a bundle defined with itk-wasm bindgen.
 *
 * Must be created with `createWebWorker`.
 **/
function setDefaultWebWorker(webWorker) {
    defaultWebWorker = webWorker;
}
/**
 * Get the default web worker for functions in a bundle defined with itk-wasm bindgen.
 *
 * A value of `null` indicates that the default web worker has not been set and the default web worker for the
 * bindgen package will be used.
 **/
function getDefaultWebWorker() {
    return defaultWebWorker;
}
//# sourceMappingURL=default-web-worker.js.map
;// ../../../node_modules/itk-wasm/dist/pipeline/index.js
// itk-wasm Browser pipeline functions





//# sourceMappingURL=index.js.map
;// ../../../node_modules/itk-wasm/dist/deprecated/read-dicom-tags.js
// @ts-nocheck
/**
 * @deprecated Use readDicomTags from @itk-wasm/dicom instead
 */
async function readDICOMTags(webWorker, file, tags = null) {
    throw new Error('readDICOMTags is deprecated. Use readDicomTags from @itk-wasm/dicom instead.');
}
/* harmony default export */ const read_dicom_tags = (readDICOMTags);
//# sourceMappingURL=read-dicom-tags.js.map
;// ../../../node_modules/itk-wasm/dist/deprecated/read-dicom-tags-array-buffer.js
// @ts-nocheck
/**
 *
 * @deprecated Use readDicomTags from @itk-wasm/dicom instead
 */
async function readDICOMTagsArrayBuffer(webWorker, arrayBuffer, tags = null) {
    throw new Error('readDICOMTagsArrayBuffer is deprecated. Use readDicomTags from @itk-wasm/dicom instead.');
}
/* harmony default export */ const read_dicom_tags_array_buffer = (readDICOMTagsArrayBuffer);
//# sourceMappingURL=read-dicom-tags-array-buffer.js.map
;// ../../../node_modules/itk-wasm/dist/deprecated/read-image-dicom-file-series.js
// @ts-nocheck
/**
 * @deprecated Use readImageDicomFileSeries from @itk-wasm/dicom instead
 */
const readImageDICOMFileSeries = async (fileList, options) => {
    throw new Error('readImageDICOMFileSeries is deprecated. Use readImageDicomFileSeries from @itk-wasm/dicom instead.');
};
/* harmony default export */ const read_image_dicom_file_series = (readImageDICOMFileSeries);
//# sourceMappingURL=read-image-dicom-file-series.js.map
;// ../../../node_modules/itk-wasm/dist/deprecated/read-image-dicom-array-buffer-series.js
// @ts-nocheck
/**
 *
 * @deprecated Use readImageDicomFileSeries from @itk-wasm/dicom instead
 */
const readImageDICOMArrayBufferSeries = async (arrayBuffers, options, fileNamesBackwardsCompatibility) => {
    throw new Error('readImageDICOMArrayBufferSeries is deprecated. Use readImageDicomFileSeries from @itk-wasm/dicom instead.');
};
/* harmony default export */ const read_image_dicom_array_buffer_series = (readImageDICOMArrayBufferSeries);
//# sourceMappingURL=read-image-dicom-array-buffer-series.js.map
;// ../../../node_modules/itk-wasm/dist/deprecated/mesh-to-poly-data.js
// @ts-nocheck
/**
 * @deprecated Use meshToPolyData from @itk-wasm/mesh-to-poly-data instead
 */
async function meshToPolyData(webWorker, mesh) {
    throw new Error('This function has been migrated to the @itk-wasm/mesh-to-poly-data package.');
}
/* harmony default export */ const mesh_to_poly_data = (meshToPolyData);
//# sourceMappingURL=mesh-to-poly-data.js.map
;// ../../../node_modules/itk-wasm/dist/deprecated/poly-data-to-mesh.js
// @ts-nocheck
/**
 * @deprecated Use polyDataToMesh from @itk-wasm/mesh-to-poly-data instead
 */
async function polyDataToMesh(webWorker, polyData) {
    throw new Error('This function has been migrated to the @itk-wasm/mesh-to-poly-data package.');
}
/* harmony default export */ const poly_data_to_mesh = (polyDataToMesh);
//# sourceMappingURL=poly-data-to-mesh.js.map
;// ../../../node_modules/itk-wasm/dist/deprecated/read-image-array-buffer.js
// @ts-nocheck
/**
 * @deprecated Use readImageArrayBuffer from @itk-wasm/image-io instead
 */
async function readImageArrayBuffer(webWorker, arrayBuffer, fileName, options) {
    throw new Error('readImageArrayBuffer is deprecated. Use readImageFile from @itk-wasm/image-io instead.');
}
/* harmony default export */ const read_image_array_buffer = (readImageArrayBuffer);
//# sourceMappingURL=read-image-array-buffer.js.map
;// ../../../node_modules/itk-wasm/dist/deprecated/read-image-blob.js
// @ts-nocheck
/**
 * @deprecated Use readImageBlob from @itk-wasm/image-io instead
 */
async function readImageBlob(webWorker, blob, fileName, options) {
    throw new Error('readImageBlob is deprecated. Use readImageFile from @itk-wasm/image-io instead.');
}
/* harmony default export */ const read_image_blob = (readImageBlob);
//# sourceMappingURL=read-image-blob.js.map
;// ../../../node_modules/itk-wasm/dist/deprecated/read-image-file.js
// @ts-nocheck
/**
 * @deprecated Use readImageFile from @itk-wasm/image-io instead
 */
async function readImageFile(webWorker, file, options) {
    throw new Error('readImageFile is deprecated. Use readImageFile from @itk-wasm/image-io instead.');
}
/* harmony default export */ const read_image_file = (readImageFile);
//# sourceMappingURL=read-image-file.js.map
;// ../../../node_modules/itk-wasm/dist/deprecated/read-image-file-series.js
// @ts-nocheck
/**
 * @deprecated Use readImageFileSeries from @itk-wasm/image-io instead
 */
async function readImageFileSeries(fileList, options, zOriginBackwardsCompatibility, sortedSeriesBackwardsCompatibility) {
    throw new Error('readImageFileSeries is deprecated. Use readImageFileSeries from @itk-wasm/image-io instead.');
}
/* harmony default export */ const read_image_file_series = (readImageFileSeries);
//# sourceMappingURL=read-image-file-series.js.map
;// ../../../node_modules/itk-wasm/dist/deprecated/read-mesh-array-buffer.js
// @ts-nocheck
/**
 * @deprecated Use readMeshArrayBuffer from @itk-wasm/image-io instead
 */
async function readMeshArrayBuffer(webWorker, arrayBuffer, fileName, mimeType) {
    throw new Error('readMeshArrayBuffer is deprecated. Use readMeshFile from @itk-wasm/mesh-io instead.');
}
/* harmony default export */ const read_mesh_array_buffer = (readMeshArrayBuffer);
//# sourceMappingURL=read-mesh-array-buffer.js.map
;// ../../../node_modules/itk-wasm/dist/deprecated/read-mesh-file.js
// @ts-nocheck
/**
 * @deprecated Use readMeshFile from @itk-wasm/mesh-io instead
 */
async function readMeshFile(webWorker, file) {
    throw new Error('readMeshFile is deprecated. Use readMeshFile from @itk-wasm/mesh-io instead.');
}
/* harmony default export */ const read_mesh_file = (readMeshFile);
//# sourceMappingURL=read-mesh-file.js.map
;// ../../../node_modules/itk-wasm/dist/deprecated/index.js
























//# sourceMappingURL=index.js.map
;// ../../../node_modules/itk-wasm/dist/index.js
// itk-wasm Browser API interfaces, data structures, and functions




//# sourceMappingURL=index.js.map

/***/ })

}]);