(() => {
"use strict";
var __webpack_modules__ = ({
61920(__unused_rspack___webpack_module__, __unused_rspack___webpack_exports__, __webpack_require__) {

// EXTERNAL MODULE: ../../../node_modules/comlink/dist/esm/comlink.mjs
var comlink = __webpack_require__(99178);
// EXTERNAL MODULE: ../../../node_modules/axios/index.js
var axios = __webpack_require__(77738);
// EXTERNAL MODULE: ../../../node_modules/@thewtex/zstddec/dist/zstddec.modern.js
var zstddec_modern = __webpack_require__(70043);
;// CONCATENATED MODULE: ../../../node_modules/itk-wasm/dist/pipeline/internal/load-emscripten-module-web-worker.js


const decoder = new zstddec_modern/* .ZSTDDecoder */.A();
let decoderInitialized = false;
// Load the Emscripten module in the browser in a WebWorker.
//
// baseUrl is usually taken from 'getPipelinesBaseUrl()', but a different value
// could be passed.
async function loadEmscriptenModuleWebWorker(moduleRelativePathOrURL, baseUrl) {
    let modulePrefix = null;
    if (typeof moduleRelativePathOrURL !== 'string') {
        modulePrefix = moduleRelativePathOrURL.href;
    }
    else if (moduleRelativePathOrURL.startsWith('http')) {
        modulePrefix = moduleRelativePathOrURL;
    }
    else {
        modulePrefix = `${baseUrl}/${moduleRelativePathOrURL}`;
    }
    if (modulePrefix.endsWith('.js')) {
        modulePrefix = modulePrefix.substring(0, modulePrefix.length - 3);
    }
    if (modulePrefix.endsWith('.wasm')) {
        modulePrefix = modulePrefix.substring(0, modulePrefix.length - 5);
    }
    const wasmBinaryPath = `${modulePrefix}.wasm`;
    const response = await axios/* ["default"].get */.Ay.get(`${wasmBinaryPath}.zst`, { responseType: 'arraybuffer' });
    if (!decoderInitialized) {
        await decoder.init();
        decoderInitialized = true;
    }
    const decompressedArray = decoder.decode(new Uint8Array(response.data));
    const wasmBinary = decompressedArray.buffer;
    const modulePath = `${modulePrefix}.js`;
    const result = await import(/* webpackIgnore: true */ /* @vite-ignore */ modulePath);
    const emscriptenModule = result.default({ wasmBinary });
    return emscriptenModule;
}
/* export default */ const load_emscripten_module_web_worker = (loadEmscriptenModuleWebWorker);
//# sourceMappingURL=load-emscripten-module-web-worker.js.map
;// CONCATENATED MODULE: ../../../node_modules/itk-wasm/dist/pipeline/web-workers/load-pipeline-module.js

// To cache loaded pipeline modules wrapped in a Promise
const pipelineToModule = new Map();
async function loadPipelineModule(pipelinePath, baseUrl) {
    let moduleRelativePathOrURL = pipelinePath;
    let pipeline = pipelinePath;
    let pipelineModule = null;
    if (typeof pipelinePath !== 'string') {
        moduleRelativePathOrURL = new URL(pipelinePath.href);
        pipeline = moduleRelativePathOrURL.href;
    }
    if (pipelineToModule.has(pipeline)) {
        pipelineModule = await pipelineToModule.get(pipeline);
    }
    else {
        pipelineToModule.set(pipeline, load_emscripten_module_web_worker(moduleRelativePathOrURL, baseUrl));
        pipelineModule = await pipelineToModule.get(pipeline);
    }
    return pipelineModule;
}
/* export default */ const load_pipeline_module = (loadPipelineModule);
//# sourceMappingURL=load-pipeline-module.js.map
// EXTERNAL MODULE: ../../../node_modules/itk-wasm/dist/pipeline/internal/run-pipeline-emscripten.js
var run_pipeline_emscripten = __webpack_require__(8792);
// EXTERNAL MODULE: ../../../node_modules/itk-wasm/dist/get-transferables.js
var get_transferables = __webpack_require__(46619);
// EXTERNAL MODULE: ../../../node_modules/itk-wasm/dist/interface-types/interface-types.js
var interface_types = __webpack_require__(16881);
// EXTERNAL MODULE: ../../../node_modules/itk-wasm/dist/pipeline/internal/image-transferables.js
var image_transferables = __webpack_require__(27295);
// EXTERNAL MODULE: ../../../node_modules/itk-wasm/dist/pipeline/internal/mesh-transferables.js
var mesh_transferables = __webpack_require__(50295);
// EXTERNAL MODULE: ../../../node_modules/itk-wasm/dist/pipeline/internal/poly-data-transferables.js
var poly_data_transferables = __webpack_require__(3099);
;// CONCATENATED MODULE: ../../../node_modules/itk-wasm/dist/pipeline/web-workers/run-pipeline.js







async function runPipeline(pipelineModule, args, outputs, inputs) {
    const result = (0,run_pipeline_emscripten/* ["default"] */.A)(pipelineModule, args, outputs, inputs);
    const transferables = [];
    result.outputs.forEach(function (output) {
        if (output.type === interface_types/* ["default"].BinaryStream */.A.BinaryStream || output.type === interface_types/* ["default"].BinaryFile */.A.BinaryFile) {
            // Binary data
            const binary = output.data;
            transferables.push(binary);
        }
        else if (output.type === interface_types/* ["default"].Image */.A.Image) {
            // Image data
            const image = output.data;
            transferables.push(...(0,image_transferables/* ["default"] */.A)(image));
        }
        else if (output.type === interface_types/* ["default"].Mesh */.A.Mesh) {
            const mesh = output.data;
            transferables.push(...(0,mesh_transferables/* ["default"] */.A)(mesh));
        }
        else if (output.type === interface_types/* ["default"].PolyData */.A.PolyData) {
            const polyData = output.data;
            transferables.push(...(0,poly_data_transferables/* ["default"] */.A)(polyData));
        }
    });
    return comlink/* .transfer */.k0(result, (0,get_transferables/* ["default"] */.A)(transferables, true));
}
/* export default */ const run_pipeline = (runPipeline);
//# sourceMappingURL=run-pipeline.js.map
;// CONCATENATED MODULE: ../../../node_modules/itk-wasm/dist/pipeline/web-workers/itk-wasm-pipeline.worker.js



const workerOperations = {
    runPipeline: async function (pipelinePath, pipelineBaseUrl, args, outputs, inputs) {
        const pipelineModule = await load_pipeline_module(pipelinePath, pipelineBaseUrl);
        return await run_pipeline(pipelineModule, args, outputs, inputs);
    }
};
comlink/* .expose */.p(workerOperations);
//# sourceMappingURL=itk-wasm-pipeline.worker.js.map

},

});
// The module cache
var __webpack_module_cache__ = {};

// The require function
function __webpack_require__(moduleId) {

// Check if module is in cache
var cachedModule = __webpack_module_cache__[moduleId];
if (cachedModule !== undefined) {
return cachedModule.exports;
}
// Create a new module (and put it into the cache)
var module = (__webpack_module_cache__[moduleId] = {
exports: {}
});
// Execute the module function
__webpack_modules__[moduleId](module, module.exports, __webpack_require__);

// Return the exports of the module
return module.exports;

}

// expose the modules object (__webpack_modules__)
__webpack_require__.m = __webpack_modules__;

// the startup function
__webpack_require__.x = () => {
// Load entry module and return exports
var __webpack_exports__ = __webpack_require__.O(undefined, ["5537", "6758", "7645", "7841"], () => __webpack_require__(61920));
__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
return __webpack_exports__
};

// webpack/runtime/create_script_url
(() => {

__webpack_require__.tu = (url) => (url)


})();
// webpack/runtime/define_property_getters
(() => {
__webpack_require__.d = (exports, definition) => {
	for(var key in definition) {
        if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
            Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
        }
    }
};
})();
// webpack/runtime/ensure_chunk
(() => {
__webpack_require__.f = {};
// This file contains only the entry chunk.
// The chunk loading function for additional chunks
__webpack_require__.e = (chunkId) => {
	return Promise.all(
		Object.keys(__webpack_require__.f).reduce((promises, key) => {
			__webpack_require__.f[key](chunkId, promises);
			return promises;
		}, [])
	);
};
})();
// webpack/runtime/get javascript chunk filename
(() => {
// This function allow to reference chunks
__webpack_require__.u = (chunkId) => {
  // return url for filenames not based on template
  
  // return url for filenames based on template
  return "" + chunkId + ".bundle." + {5537: "2a64c2c9c145d15a",6758: "b174316beaf1a9a5",7645: "a33af4579c621b40",7841: "0365b082d0f26d68",}[chunkId] + ".js"
}
})();
// webpack/runtime/get mini-css chunk filename
(() => {
// This function allow to reference chunks
__webpack_require__.miniCssF = (chunkId) => {
  // return url for filenames not based on template
  
  // return url for filenames based on template
  return "" + chunkId + ".css"
}
})();
// webpack/runtime/has_own_property
(() => {
__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
})();
// webpack/runtime/make_namespace_object
(() => {
// define __esModule on exports
__webpack_require__.r = (exports) => {
	if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
	}
	Object.defineProperty(exports, '__esModule', { value: true });
};
})();
// webpack/runtime/on_chunk_loaded
(() => {
var deferred = [];
__webpack_require__.O = (result, chunkIds, fn, priority) => {
	if (chunkIds) {
		priority = priority || 0;
		for (var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--)
			deferred[i] = deferred[i - 1];
		deferred[i] = [chunkIds, fn, priority];
		return;
	}
	var notFulfilled = Infinity;
	for (var i = 0; i < deferred.length; i++) {
		var [chunkIds, fn, priority] = deferred[i];
		var fulfilled = true;
		for (var j = 0; j < chunkIds.length; j++) {
			if (
				(priority & (1 === 0) || notFulfilled >= priority) &&
				Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))
			) {
				chunkIds.splice(j--, 1);
			} else {
				fulfilled = false;
				if (priority < notFulfilled) notFulfilled = priority;
			}
		}
		if (fulfilled) {
			deferred.splice(i--, 1);
			var r = fn();
			if (r !== undefined) result = r;
		}
	}
	return result;
};

})();
// webpack/runtime/public_path
(() => {
__webpack_require__.p = "./";
})();
// webpack/runtime/startup_chunk_dependencies
(() => {
var next = __webpack_require__.x
__webpack_require__.x = () => {
  return Promise.all([5537,6758,7645,7841].map(__webpack_require__.e, __webpack_require__)).then(next);
}
})();
// webpack/runtime/import_scripts_chunk_loading
(() => {
var installedChunks = {8745: 1,};
// importScripts chunk loading
var installChunk = (data) => {
    var [chunkIds, moreModules, runtime] = data;
    for (var moduleId in moreModules) {
        if (__webpack_require__.o(moreModules, moduleId)) {
            __webpack_require__.m[moduleId] = moreModules[moduleId];
        }
    }
    if (runtime) runtime(__webpack_require__);
    while (chunkIds.length) installedChunks[chunkIds.pop()] = 1;
    parentChunkLoadingFunction(data);
};

var chunkLoadingGlobal = globalThis["rspackChunk"] = globalThis["rspackChunk"] || [];
var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
chunkLoadingGlobal.push = installChunk;__webpack_require__.f.i = (chunkId, promises) => {
    
    // "1" is the signal for "already loaded
    if (!installedChunks[chunkId]) {
        if (true) {
            
            importScripts(__webpack_require__.p + __webpack_require__.u(chunkId));
            
        }
    }
    
};
})();
// module factories are used so entry inlining is disabled
// run startup
var __webpack_exports__ = __webpack_require__.x();
})()
;