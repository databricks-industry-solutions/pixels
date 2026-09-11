"use strict";
(globalThis["rspackChunk"] = globalThis["rspackChunk"] || []).push([[7841], {
47911(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _interface_types_int_types_js__rspack_import_0 = __webpack_require__(44835);
/* import */ var _interface_types_float_types_js__rspack_import_1 = __webpack_require__(74112);


function bufferToTypedArray(wasmType, buffer) {
    let typedArray = null;
    switch (wasmType) {
        case _interface_types_int_types_js__rspack_import_0/* ["default"].UInt8 */.A.UInt8: {
            typedArray = new Uint8Array(buffer);
            break;
        }
        case _interface_types_int_types_js__rspack_import_0/* ["default"].Int8 */.A.Int8: {
            typedArray = new Int8Array(buffer);
            break;
        }
        case _interface_types_int_types_js__rspack_import_0/* ["default"].UInt16 */.A.UInt16: {
            typedArray = new Uint16Array(buffer);
            break;
        }
        case _interface_types_int_types_js__rspack_import_0/* ["default"].Int16 */.A.Int16: {
            typedArray = new Int16Array(buffer);
            break;
        }
        case _interface_types_int_types_js__rspack_import_0/* ["default"].UInt32 */.A.UInt32: {
            typedArray = new Uint32Array(buffer);
            break;
        }
        case _interface_types_int_types_js__rspack_import_0/* ["default"].Int32 */.A.Int32: {
            typedArray = new Int32Array(buffer);
            break;
        }
        case _interface_types_int_types_js__rspack_import_0/* ["default"].UInt64 */.A.UInt64: {
            if (typeof globalThis.BigUint64Array === 'function') {
                typedArray = new BigUint64Array(buffer);
            }
            else {
                // Sub with reasonable default. Will get cast to Uint8Array when
                // transferred to WebAssembly.
                typedArray = new Uint8Array(buffer);
            }
            break;
        }
        case _interface_types_int_types_js__rspack_import_0/* ["default"].Int64 */.A.Int64: {
            if (typeof globalThis.BigInt64Array === 'function') {
                typedArray = new BigInt64Array(buffer);
            }
            else {
                // Sub with reasonable default. Will get cast to Uint8Array when
                // transferred to WebAssembly.
                typedArray = new Uint8Array(buffer);
            }
            break;
        }
        case _interface_types_float_types_js__rspack_import_1/* ["default"].Float32 */.A.Float32: {
            typedArray = new Float32Array(buffer);
            break;
        }
        case _interface_types_float_types_js__rspack_import_1/* ["default"].Float64 */.A.Float64: {
            typedArray = new Float64Array(buffer);
            break;
        }
        case 'null': {
            typedArray = null;
            break;
        }
        case null: {
            typedArray = null;
            break;
        }
        default:
            throw new Error('Type is not supported as a TypedArray');
    }
    return typedArray;
}
/* export default */ const __rspack_default_export = (bufferToTypedArray);
//# sourceMappingURL=buffer-to-typed-array.js.map

},
46619(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
const haveSharedArrayBuffer = typeof globalThis.SharedArrayBuffer !== 'undefined'; // eslint-disable-line
function getTransferables(data, noCopy) {
    if (data === undefined || data === null) {
        return [];
    }
    const transferables = [];
    for (let i = 0; i < data.length; i++) {
        const transferable = getTransferable(data[i], noCopy);
        if (transferable !== null) {
            transferables.push(transferable);
        }
    }
    return transferables;
}
function getTransferable(data, noCopy) {
    if (data === undefined || data === null) {
        return null;
    }
    let result = null;
    if (data.buffer !== undefined) {
        result = data.buffer;
    }
    else if (data.byteLength !== undefined) {
        result = data;
    }
    if (haveSharedArrayBuffer && result instanceof SharedArrayBuffer) { // eslint-disable-line
        return null;
    }
    // eslint-disable-next-line
    if (noCopy) {
        return result;
    }
    return result.slice(0);
}
/* export default */ const __rspack_default_export = (getTransferables);
//# sourceMappingURL=get-transferables.js.map

},
74112(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
const FloatTypes = {
    Float32: 'float32',
    Float64: 'float64',
    SpacePrecisionType: 'float64'
};
/* export default */ const __rspack_default_export = (FloatTypes);
//# sourceMappingURL=float-types.js.map

},
44835(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
const IntTypes = {
    Int8: 'int8',
    UInt8: 'uint8',
    Int16: 'int16',
    UInt16: 'uint16',
    Int32: 'int32',
    UInt32: 'uint32',
    Int64: 'int64',
    UInt64: 'uint64',
    SizeValueType: 'uint64',
    IdentifierType: 'uint64',
    IndexValueType: 'int64',
    OffsetValueType: 'int64'
};
/* export default */ const __rspack_default_export = (IntTypes);
//# sourceMappingURL=int-types.js.map

},
16881(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
const InterfaceTypes = {
    TextFile: 'TextFile',
    BinaryFile: 'BinaryFile',
    TextStream: 'TextStream',
    BinaryStream: 'BinaryStream',
    Image: 'Image',
    Mesh: 'Mesh',
    PolyData: 'PolyData',
    JsonCompatible: 'JsonCompatible'
};
/* export default */ const __rspack_default_export = (InterfaceTypes);
//# sourceMappingURL=interface-types.js.map

},
27295(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
function imageTransferables(image) {
    return [
        image.data,
        image.direction
    ];
}
/* export default */ const __rspack_default_export = (imageTransferables);
//# sourceMappingURL=image-transferables.js.map

},
50295(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
function meshTransferables(mesh) {
    return [
        mesh.points,
        mesh.pointData,
        mesh.cells,
        mesh.cellData
    ];
}
/* export default */ const __rspack_default_export = (meshTransferables);
//# sourceMappingURL=mesh-transferables.js.map

},
3099(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
function polyDataTransferables(polyData) {
    return [
        polyData.points,
        polyData.vertices,
        polyData.lines,
        polyData.polygons,
        polyData.triangleStrips,
        polyData.pointData,
        polyData.cellData
    ];
}
/* export default */ const __rspack_default_export = (polyDataTransferables);
//# sourceMappingURL=poly-data-transferables.js.map

},
8792(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _interface_types_interface_types_js__rspack_import_0 = __webpack_require__(16881);
/* import */ var _buffer_to_typed_array_js__rspack_import_1 = __webpack_require__(47911);
/* import */ var _interface_types_float_types_js__rspack_import_2 = __webpack_require__(74112);
/* import */ var _interface_types_int_types_js__rspack_import_3 = __webpack_require__(44835);




const haveSharedArrayBuffer = typeof globalThis.SharedArrayBuffer === 'function';
const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8');
function readFileSharedArray(emscriptenModule, path) {
    const opts = { flags: 'r', encoding: 'binary' };
    const stream = emscriptenModule.fs_open(path, opts.flags);
    const stat = emscriptenModule.fs_stat(path);
    const length = stat.size;
    let arrayBufferData = null;
    if (haveSharedArrayBuffer) {
        arrayBufferData = new SharedArrayBuffer(length); // eslint-disable-line
    }
    else {
        arrayBufferData = new ArrayBuffer(length);
    }
    const array = new Uint8Array(arrayBufferData);
    emscriptenModule.fs_read(stream, array, 0, length, 0);
    emscriptenModule.fs_close(stream);
    return array;
}
function memoryUint8SharedArray(emscriptenModule, byteOffset, length) {
    let arrayBufferData = null;
    if (haveSharedArrayBuffer) {
        arrayBufferData = new SharedArrayBuffer(length); // eslint-disable-line
    }
    else {
        arrayBufferData = new ArrayBuffer(length);
    }
    const array = new Uint8Array(arrayBufferData);
    const dataArrayView = new Uint8Array(emscriptenModule.HEAPU8.buffer, byteOffset, length);
    array.set(dataArrayView);
    return array;
}
function setPipelineModuleInputArray(emscriptenModule, dataArray, inputIndex, subIndex) {
    let dataPtr = 0;
    if (dataArray !== null) {
        dataPtr = emscriptenModule.ccall('itk_wasm_input_array_alloc', 'number', ['number', 'number', 'number', 'number'], [0, inputIndex, subIndex, dataArray.buffer.byteLength]);
        emscriptenModule.HEAPU8.set(new Uint8Array(dataArray.buffer), dataPtr);
    }
    return dataPtr;
}
function setPipelineModuleInputJSON(emscriptenModule, dataObject, inputIndex) {
    const dataJSON = JSON.stringify(dataObject);
    const jsonPtr = emscriptenModule.ccall('itk_wasm_input_json_alloc', 'number', ['number', 'number', 'number'], [0, inputIndex, dataJSON.length]);
    emscriptenModule.writeAsciiToMemory(dataJSON, jsonPtr, false);
}
function getPipelineModuleOutputArray(emscriptenModule, outputIndex, subIndex, componentType) {
    const dataPtr = emscriptenModule.ccall('itk_wasm_output_array_address', 'number', ['number', 'number', 'number'], [0, outputIndex, subIndex]);
    const dataSize = emscriptenModule.ccall('itk_wasm_output_array_size', 'number', ['number', 'number', 'number'], [0, outputIndex, subIndex]);
    const dataUint8 = memoryUint8SharedArray(emscriptenModule, dataPtr, dataSize);
    const data = (0,_buffer_to_typed_array_js__rspack_import_1/* ["default"] */.A)(componentType, dataUint8.buffer);
    return data;
}
function getPipelineModuleOutputJSON(emscriptenModule, outputIndex) {
    const jsonPtr = emscriptenModule.ccall('itk_wasm_output_json_address', 'number', ['number', 'number'], [0, outputIndex]);
    const dataJSON = emscriptenModule.AsciiToString(jsonPtr);
    const dataObject = JSON.parse(dataJSON);
    return dataObject;
}
function runPipelineEmscripten(pipelineModule, args, outputs, inputs) {
    if (!(inputs == null) && inputs.length > 0) {
        inputs.forEach(function (input, index) {
            switch (input.type) {
                case _interface_types_interface_types_js__rspack_import_0/* ["default"].TextStream */.A.TextStream:
                    {
                        const dataArray = encoder.encode(input.data.data);
                        const arrayPtr = setPipelineModuleInputArray(pipelineModule, dataArray, index, 0);
                        const dataJSON = { size: dataArray.buffer.byteLength, data: `data:application/vnd.itk.address,0:${arrayPtr}` };
                        setPipelineModuleInputJSON(pipelineModule, dataJSON, index);
                        break;
                    }
                case _interface_types_interface_types_js__rspack_import_0/* ["default"].JsonCompatible */.A.JsonCompatible:
                    {
                        const dataArray = encoder.encode(JSON.stringify(input.data));
                        const arrayPtr = setPipelineModuleInputArray(pipelineModule, dataArray, index, 0);
                        const dataJSON = { size: dataArray.buffer.byteLength, data: `data:application/vnd.itk.address,0:${arrayPtr}` };
                        setPipelineModuleInputJSON(pipelineModule, dataJSON, index);
                        break;
                    }
                case _interface_types_interface_types_js__rspack_import_0/* ["default"].BinaryStream */.A.BinaryStream:
                    {
                        const dataArray = input.data.data;
                        const arrayPtr = setPipelineModuleInputArray(pipelineModule, dataArray, index, 0);
                        const dataJSON = { size: dataArray.buffer.byteLength, data: `data:application/vnd.itk.address,0:${arrayPtr}` };
                        setPipelineModuleInputJSON(pipelineModule, dataJSON, index);
                        break;
                    }
                case _interface_types_interface_types_js__rspack_import_0/* ["default"].TextFile */.A.TextFile:
                    {
                        pipelineModule.fs_writeFile(input.data.path, input.data.data);
                        break;
                    }
                case _interface_types_interface_types_js__rspack_import_0/* ["default"].BinaryFile */.A.BinaryFile:
                    {
                        pipelineModule.fs_writeFile(input.data.path, input.data.data);
                        break;
                    }
                case _interface_types_interface_types_js__rspack_import_0/* ["default"].Image */.A.Image:
                    {
                        const image = input.data;
                        const dataPtr = setPipelineModuleInputArray(pipelineModule, image.data, index, 0);
                        const directionPtr = setPipelineModuleInputArray(pipelineModule, image.direction, index, 1);
                        const metadata = typeof image.metadata?.entries !== 'undefined' ? JSON.stringify(Array.from(image.metadata.entries())) : '[]';
                        const imageJSON = {
                            imageType: image.imageType,
                            name: image.name,
                            origin: image.origin,
                            spacing: image.spacing,
                            direction: `data:application/vnd.itk.address,0:${directionPtr}`,
                            size: image.size,
                            data: `data:application/vnd.itk.address,0:${dataPtr}`,
                            metadata
                        };
                        setPipelineModuleInputJSON(pipelineModule, imageJSON, index);
                        break;
                    }
                case _interface_types_interface_types_js__rspack_import_0/* ["default"].Mesh */.A.Mesh:
                    {
                        const mesh = input.data;
                        const pointsPtr = setPipelineModuleInputArray(pipelineModule, mesh.points, index, 0);
                        const cellsPtr = setPipelineModuleInputArray(pipelineModule, mesh.cells, index, 1);
                        const pointDataPtr = setPipelineModuleInputArray(pipelineModule, mesh.pointData, index, 2);
                        const cellDataPtr = setPipelineModuleInputArray(pipelineModule, mesh.cellData, index, 3);
                        const meshJSON = {
                            meshType: mesh.meshType,
                            name: mesh.name,
                            numberOfPoints: mesh.numberOfPoints,
                            points: `data:application/vnd.itk.address,0:${pointsPtr}`,
                            numberOfCells: mesh.numberOfCells,
                            cells: `data:application/vnd.itk.address,0:${cellsPtr}`,
                            cellBufferSize: mesh.cellBufferSize,
                            numberOfPointPixels: mesh.numberOfPointPixels,
                            pointData: `data:application/vnd.itk.address,0:${pointDataPtr}`,
                            numberOfCellPixels: mesh.numberOfCellPixels,
                            cellData: `data:application/vnd.itk.address,0:${cellDataPtr}`
                        };
                        setPipelineModuleInputJSON(pipelineModule, meshJSON, index);
                        break;
                    }
                case _interface_types_interface_types_js__rspack_import_0/* ["default"].PolyData */.A.PolyData:
                    {
                        const polyData = input.data;
                        const pointsPtr = setPipelineModuleInputArray(pipelineModule, polyData.points, index, 0);
                        const verticesPtr = setPipelineModuleInputArray(pipelineModule, polyData.vertices, index, 1);
                        const linesPtr = setPipelineModuleInputArray(pipelineModule, polyData.lines, index, 2);
                        const polygonsPtr = setPipelineModuleInputArray(pipelineModule, polyData.polygons, index, 3);
                        const triangleStripsPtr = setPipelineModuleInputArray(pipelineModule, polyData.triangleStrips, index, 4);
                        const pointDataPtr = setPipelineModuleInputArray(pipelineModule, polyData.pointData, index, 5);
                        const cellDataPtr = setPipelineModuleInputArray(pipelineModule, polyData.pointData, index, 6);
                        const polyDataJSON = {
                            polyDataType: polyData.polyDataType,
                            name: polyData.name,
                            numberOfPoints: polyData.numberOfPoints,
                            points: `data:application/vnd.itk.address,0:${pointsPtr}`,
                            verticesBufferSize: polyData.verticesBufferSize,
                            vertices: `data:application/vnd.itk.address,0:${verticesPtr}`,
                            linesBufferSize: polyData.linesBufferSize,
                            lines: `data:application/vnd.itk.address,0:${linesPtr}`,
                            polygonsBufferSize: polyData.polygonsBufferSize,
                            polygons: `data:application/vnd.itk.address,0:${polygonsPtr}`,
                            triangleStripsBufferSize: polyData.triangleStripsBufferSize,
                            triangleStrips: `data:application/vnd.itk.address,0:${triangleStripsPtr}`,
                            numberOfPointPixels: polyData.numberOfPointPixels,
                            pointData: `data:application/vnd.itk.address,0:${pointDataPtr}`,
                            numberOfCellPixels: polyData.numberOfCellPixels,
                            cellData: `data:application/vnd.itk.address,0:${cellDataPtr}`
                        };
                        setPipelineModuleInputJSON(pipelineModule, polyDataJSON, index);
                        break;
                    }
                default:
                    throw Error('Unsupported input InterfaceType');
            }
        });
    }
    pipelineModule.resetModuleStdout();
    pipelineModule.resetModuleStderr();
    const stackPtr = pipelineModule.stackSave();
    let returnValue = 0;
    try {
        returnValue = pipelineModule.callMain(args.slice());
    }
    catch (exception) {
        // Note: Module must be built with CMAKE_BUILD_TYPE set to Debug.
        // e.g.: itk-wasm build my/project -- -DCMAKE_BUILD_TYPE:STRING=Debug
        if (typeof exception === 'number') {
            console.log('Exception while running pipeline:');
            console.log('stdout:', pipelineModule.getModuleStdout());
            console.error('stderr:', pipelineModule.getModuleStderr());
            if (typeof pipelineModule.getExceptionMessage !== 'undefined') {
                console.error('exception:', pipelineModule.getExceptionMessage(exception));
            }
            else {
                console.error('Build module in Debug mode for exception message information.');
            }
        }
        throw exception;
    }
    finally {
        pipelineModule.stackRestore(stackPtr);
    }
    const stdout = pipelineModule.getModuleStdout();
    const stderr = pipelineModule.getModuleStderr();
    const populatedOutputs = [];
    if (!(outputs == null) && outputs.length > 0 && returnValue === 0) {
        outputs.forEach(function (output, index) {
            let outputData = null;
            switch (output.type) {
                case _interface_types_interface_types_js__rspack_import_0/* ["default"].TextStream */.A.TextStream:
                    {
                        const dataPtr = pipelineModule.ccall('itk_wasm_output_array_address', 'number', ['number', 'number', 'number'], [0, index, 0]);
                        const dataSize = pipelineModule.ccall('itk_wasm_output_array_size', 'number', ['number', 'number', 'number'], [0, index, 0]);
                        const dataArrayView = new Uint8Array(pipelineModule.HEAPU8.buffer, dataPtr, dataSize);
                        outputData = { data: decoder.decode(dataArrayView) };
                        break;
                    }
                case _interface_types_interface_types_js__rspack_import_0/* ["default"].JsonCompatible */.A.JsonCompatible:
                    {
                        const dataPtr = pipelineModule.ccall('itk_wasm_output_array_address', 'number', ['number', 'number', 'number'], [0, index, 0]);
                        const dataSize = pipelineModule.ccall('itk_wasm_output_array_size', 'number', ['number', 'number', 'number'], [0, index, 0]);
                        const dataArrayView = new Uint8Array(pipelineModule.HEAPU8.buffer, dataPtr, dataSize);
                        outputData = JSON.parse(decoder.decode(dataArrayView));
                        break;
                    }
                case _interface_types_interface_types_js__rspack_import_0/* ["default"].BinaryStream */.A.BinaryStream:
                    {
                        const dataPtr = pipelineModule.ccall('itk_wasm_output_array_address', 'number', ['number', 'number', 'number'], [0, index, 0]);
                        const dataSize = pipelineModule.ccall('itk_wasm_output_array_size', 'number', ['number', 'number', 'number'], [0, index, 0]);
                        outputData = { data: memoryUint8SharedArray(pipelineModule, dataPtr, dataSize) };
                        break;
                    }
                case _interface_types_interface_types_js__rspack_import_0/* ["default"].TextFile */.A.TextFile:
                    {
                        outputData = { path: output.data.path, data: pipelineModule.fs_readFile(output.data.path, { encoding: 'utf8' }) };
                        break;
                    }
                case _interface_types_interface_types_js__rspack_import_0/* ["default"].BinaryFile */.A.BinaryFile:
                    {
                        outputData = { path: output.data.path, data: readFileSharedArray(pipelineModule, output.data.path) };
                        break;
                    }
                case _interface_types_interface_types_js__rspack_import_0/* ["default"].Image */.A.Image:
                    {
                        const image = getPipelineModuleOutputJSON(pipelineModule, index);
                        image.data = getPipelineModuleOutputArray(pipelineModule, index, 0, image.imageType.componentType);
                        image.direction = getPipelineModuleOutputArray(pipelineModule, index, 1, _interface_types_float_types_js__rspack_import_2/* ["default"].Float64 */.A.Float64);
                        image.metadata = new Map(image.metadata);
                        outputData = image;
                        break;
                    }
                case _interface_types_interface_types_js__rspack_import_0/* ["default"].Mesh */.A.Mesh:
                    {
                        const mesh = getPipelineModuleOutputJSON(pipelineModule, index);
                        if (mesh.numberOfPoints > 0) {
                            mesh.points = getPipelineModuleOutputArray(pipelineModule, index, 0, mesh.meshType.pointComponentType);
                        }
                        else {
                            mesh.points = (0,_buffer_to_typed_array_js__rspack_import_1/* ["default"] */.A)(mesh.meshType.pointComponentType, new ArrayBuffer(0));
                        }
                        if (mesh.numberOfCells > 0) {
                            mesh.cells = getPipelineModuleOutputArray(pipelineModule, index, 1, mesh.meshType.cellComponentType);
                        }
                        else {
                            mesh.cells = (0,_buffer_to_typed_array_js__rspack_import_1/* ["default"] */.A)(mesh.meshType.cellComponentType, new ArrayBuffer(0));
                        }
                        if (mesh.numberOfPointPixels > 0) {
                            mesh.pointData = getPipelineModuleOutputArray(pipelineModule, index, 2, mesh.meshType.pointPixelComponentType);
                        }
                        else {
                            mesh.pointData = (0,_buffer_to_typed_array_js__rspack_import_1/* ["default"] */.A)(mesh.meshType.pointPixelComponentType, new ArrayBuffer(0));
                        }
                        if (mesh.numberOfCellPixels > 0) {
                            mesh.cellData = getPipelineModuleOutputArray(pipelineModule, index, 3, mesh.meshType.cellPixelComponentType);
                        }
                        else {
                            mesh.cellData = (0,_buffer_to_typed_array_js__rspack_import_1/* ["default"] */.A)(mesh.meshType.cellPixelComponentType, new ArrayBuffer(0));
                        }
                        outputData = mesh;
                        break;
                    }
                case _interface_types_interface_types_js__rspack_import_0/* ["default"].PolyData */.A.PolyData:
                    {
                        const polyData = getPipelineModuleOutputJSON(pipelineModule, index);
                        if (polyData.numberOfPoints > 0) {
                            polyData.points = getPipelineModuleOutputArray(pipelineModule, index, 0, _interface_types_float_types_js__rspack_import_2/* ["default"].Float32 */.A.Float32);
                        }
                        else {
                            polyData.points = new Float32Array();
                        }
                        if (polyData.verticesBufferSize > 0) {
                            polyData.vertices = getPipelineModuleOutputArray(pipelineModule, index, 1, _interface_types_int_types_js__rspack_import_3/* ["default"].UInt32 */.A.UInt32);
                        }
                        else {
                            polyData.vertices = new Uint32Array();
                        }
                        if (polyData.linesBufferSize > 0) {
                            polyData.lines = getPipelineModuleOutputArray(pipelineModule, index, 2, _interface_types_int_types_js__rspack_import_3/* ["default"].UInt32 */.A.UInt32);
                        }
                        else {
                            polyData.lines = new Uint32Array();
                        }
                        if (polyData.polygonsBufferSize > 0) {
                            polyData.polygons = getPipelineModuleOutputArray(pipelineModule, index, 3, _interface_types_int_types_js__rspack_import_3/* ["default"].UInt32 */.A.UInt32);
                        }
                        else {
                            polyData.polygons = new Uint32Array();
                        }
                        if (polyData.triangleStripsBufferSize > 0) {
                            polyData.triangleStrips = getPipelineModuleOutputArray(pipelineModule, index, 4, _interface_types_int_types_js__rspack_import_3/* ["default"].UInt32 */.A.UInt32);
                        }
                        else {
                            polyData.triangleStrips = new Uint32Array();
                        }
                        if (polyData.numberOfPointPixels > 0) {
                            polyData.pointData = getPipelineModuleOutputArray(pipelineModule, index, 5, polyData.polyDataType.pointPixelComponentType);
                        }
                        else {
                            polyData.pointData = (0,_buffer_to_typed_array_js__rspack_import_1/* ["default"] */.A)(polyData.polyDataType.pointPixelComponentType, new ArrayBuffer(0));
                        }
                        if (polyData.numberOfCellPixels > 0) {
                            polyData.cellData = getPipelineModuleOutputArray(pipelineModule, index, 6, polyData.polyDataType.cellPixelComponentType);
                        }
                        else {
                            polyData.cellData = (0,_buffer_to_typed_array_js__rspack_import_1/* ["default"] */.A)(polyData.polyDataType.cellPixelComponentType, new ArrayBuffer(0));
                        }
                        outputData = polyData;
                        break;
                    }
                default:
                    throw Error('Unsupported output InterfaceType');
            }
            const populatedOutput = {
                type: output.type,
                data: outputData
            };
            populatedOutputs.push(populatedOutput);
        });
    }
    return { returnValue, stdout, stderr, outputs: populatedOutputs };
}
/* export default */ const __rspack_default_export = (runPipelineEmscripten);
//# sourceMappingURL=run-pipeline-emscripten.js.map

},

}]);