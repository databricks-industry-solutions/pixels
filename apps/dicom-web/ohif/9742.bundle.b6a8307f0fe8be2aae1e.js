(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[9742],{

/***/ 44302:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ ClassHierarchy)
/* harmony export */ });
/* eslint-disable prefer-rest-params */
class ClassHierarchy extends Array {
  push() {
    for (let i = 0; i < arguments.length; i++) {
      if (!this.includes(arguments[i])) {
        super.push(arguments[i]);
      }
    }
    return this.length;
  }
}




/***/ }),

/***/ 42008:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ay: () => (/* binding */ vtkDataArray$1)
/* harmony export */ });
/* unused harmony exports STATIC, extend, newInstance */
/* harmony import */ var _DataArray_Constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(28914);
/* harmony import */ var _macros2_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(28906);
/* harmony import */ var _Math_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(16632);




const {
  vtkErrorMacro
} = _macros2_js__WEBPACK_IMPORTED_MODULE_1__.c;
const {
  DefaultDataType
} = _DataArray_Constants_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Ay;

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------
const EPSILON = 1e-6;

// Original source from https://www.npmjs.com/package/compute-range
// Modified to accept type arrays
function fastComputeRange(arr, offset, numberOfComponents) {
  const len = arr.length;
  let min = Number.MAX_VALUE;
  let max = -Number.MAX_VALUE;
  let x;
  let i;

  // find first non-NaN value
  for (i = offset; i < len; i += numberOfComponents) {
    if (!Number.isNaN(arr[i])) {
      min = arr[i];
      max = min;
      break;
    }
  }
  for (; i < len; i += numberOfComponents) {
    x = arr[i];
    if (x < min) {
      min = x;
    } else if (x > max) {
      max = x;
    }
  }
  return {
    min,
    max
  };
}

/**
 * @deprecated please use fastComputeRange instead
 */
function createRangeHelper() {
  let min = Number.MAX_VALUE;
  let max = -Number.MAX_VALUE;
  let count = 0;
  let sum = 0;
  return {
    add(value) {
      if (min > value) {
        min = value;
      }
      if (max < value) {
        max = value;
      }
      count++;
      sum += value;
    },
    get() {
      return {
        min,
        max,
        count,
        sum,
        mean: sum / count
      };
    },
    getRange() {
      return {
        min,
        max
      };
    }
  };
}
function computeRange(values) {
  let component = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let numberOfComponents = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  if (component < 0 && numberOfComponents > 1) {
    // Compute magnitude
    const size = values.length;
    const numberOfValues = size / numberOfComponents;
    const data = new Float64Array(numberOfValues);
    for (let i = 0, j = 0; i < numberOfValues; ++i) {
      for (let nextJ = j + numberOfComponents; j < nextJ; ++j) {
        data[i] += values[j] * values[j];
      }
      data[i] **= 0.5;
    }
    return fastComputeRange(data, 0, 1);
  }
  return fastComputeRange(values, component < 0 ? 0 : component, numberOfComponents);
}
function ensureRangeSize(rangeArray) {
  let size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  const ranges = rangeArray || [];
  // Pad ranges with null value to get the
  while (ranges.length <= size) {
    ranges.push(null);
  }
  return ranges;
}
function getDataType(typedArray) {
  // Expects toString() to return "[object ...Array]"
  return Object.prototype.toString.call(typedArray).slice(8, -1);
}
function getMaxNorm(normArray) {
  const numComps = normArray.getNumberOfComponents();
  let maxNorm = 0.0;
  const tuple = new Array(numComps);
  for (let i = 0; i < normArray.getNumberOfTuples(); ++i) {
    normArray.getTuple(i, tuple);
    const norm$1 = (0,_Math_index_js__WEBPACK_IMPORTED_MODULE_2__.n)(tuple, numComps);
    if (norm$1 > maxNorm) {
      maxNorm = norm$1;
    }
  }
  return maxNorm;
}

// ----------------------------------------------------------------------------
// Static API
// ----------------------------------------------------------------------------

const STATIC = {
  computeRange,
  createRangeHelper,
  fastComputeRange,
  getDataType,
  getMaxNorm
};

// ----------------------------------------------------------------------------
// vtkDataArray methods
// ----------------------------------------------------------------------------

function vtkDataArray(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkDataArray');

  /**
   * Resize model.values and copy the old values to the new array.
   * @param {Number} requestedNumTuples Final expected number of tuples; must be >= 0
   * @returns {Boolean} True if a resize occured, false otherwise
   */
  function resize(requestedNumTuples) {
    if (requestedNumTuples < 0) {
      return false;
    }
    const numComps = publicAPI.getNumberOfComponents();
    const curNumTuples = model.values.length / (numComps > 0 ? numComps : 1);
    if (requestedNumTuples === curNumTuples) {
      return true;
    }
    if (requestedNumTuples > curNumTuples) {
      // Requested size is bigger than current size.  Allocate enough
      // memory to fit the requested size and be more than double the
      // currently allocated memory.
      const oldValues = model.values;
      model.values = (0,_macros2_js__WEBPACK_IMPORTED_MODULE_1__.a)(model.dataType, (requestedNumTuples + curNumTuples) * numComps);
      model.values.set(oldValues);
      return true;
    }

    // Requested size is smaller than currently allocated size
    if (model.size > requestedNumTuples * numComps) {
      model.size = requestedNumTuples * numComps;
      publicAPI.dataChange();
    }
    return true;
  }
  publicAPI.dataChange = () => {
    model.ranges = null;
    publicAPI.modified();
  };
  publicAPI.resize = requestedNumTuples => {
    resize(requestedNumTuples);
    const newSize = requestedNumTuples * publicAPI.getNumberOfComponents();
    if (model.size !== newSize) {
      model.size = newSize;
      publicAPI.dataChange();
      return true;
    }
    return false;
  };

  // FIXME, to rename into "clear()" or "reset()"
  publicAPI.initialize = () => {
    publicAPI.resize(0);
  };
  publicAPI.getElementComponentSize = () => model.values.BYTES_PER_ELEMENT;

  // Description:
  // Return the data component at the location specified by tupleIdx and
  // compIdx.
  publicAPI.getComponent = function (tupleIdx) {
    let compIdx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return model.values[tupleIdx * model.numberOfComponents + compIdx];
  };

  // Description:
  // Set the data component at the location specified by tupleIdx and compIdx
  // to value.
  // Note that i is less than NumberOfTuples and j is less than
  //  NumberOfComponents. Make sure enough memory has been allocated
  // (use SetNumberOfTuples() and SetNumberOfComponents()).
  publicAPI.setComponent = (tupleIdx, compIdx, value) => {
    if (value !== model.values[tupleIdx * model.numberOfComponents + compIdx]) {
      model.values[tupleIdx * model.numberOfComponents + compIdx] = value;
      publicAPI.dataChange();
    }
  };
  publicAPI.getValue = valueIdx => {
    const idx = valueIdx / model.numberOfComponents;
    const comp = valueIdx % model.numberOfComponents;
    return publicAPI.getComponent(idx, comp);
  };
  publicAPI.setValue = (valueIdx, value) => {
    const idx = valueIdx / model.numberOfComponents;
    const comp = valueIdx % model.numberOfComponents;
    publicAPI.setComponent(idx, comp, value);
  };
  publicAPI.getData = () => model.size === model.values.length ? model.values : model.values.subarray(0, model.size);
  publicAPI.getRange = function () {
    let componentIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
    let rangeIdx = componentIndex;
    if (rangeIdx < 0) {
      // If scalar data, then store in slot 0 (same as componentIndex = 0).
      // If vector data, then store in last slot.
      rangeIdx = model.numberOfComponents === 1 ? 0 : model.numberOfComponents;
    }
    let range = null;
    if (!model.ranges) {
      model.ranges = ensureRangeSize(model.ranges, model.numberOfComponents);
    }
    range = model.ranges[rangeIdx];
    if (range) {
      model.rangeTuple[0] = range.min;
      model.rangeTuple[1] = range.max;
      return model.rangeTuple;
    }

    // Need to compute ranges...
    range = computeRange(publicAPI.getData(), componentIndex, model.numberOfComponents);
    model.ranges[rangeIdx] = range;
    model.rangeTuple[0] = range.min;
    model.rangeTuple[1] = range.max;
    return model.rangeTuple;
  };
  publicAPI.setRange = (rangeValue, componentIndex) => {
    if (!model.ranges) {
      model.ranges = ensureRangeSize(model.ranges, model.numberOfComponents);
    }
    const range = {
      min: rangeValue.min,
      max: rangeValue.max
    };
    model.ranges[componentIndex] = range;
    model.rangeTuple[0] = range.min;
    model.rangeTuple[1] = range.max;
    return model.rangeTuple;
  };
  publicAPI.getRanges = function () {
    let computeRanges = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    if (!computeRanges) {
      return structuredClone(model.ranges);
    }
    /** @type {import('../../../interfaces').vtkRange[]} */
    const ranges = [];
    for (let i = 0; i < model.numberOfComponents; i++) {
      const [min, max] = publicAPI.getRange(i);
      /** @type {import('../../../interfaces').vtkRange} */
      const range = {
        min,
        max
      };
      ranges.push(range);
    }
    // where the number of components is greater than 1, the last element in
    // the range array is the min,max magnitude of the entire dataset.
    if (model.numberOfComponents > 1) {
      const [min, max] = publicAPI.getRange(-1);
      /** @type {import('../../../interfaces').vtkRange} */
      const range = {
        min,
        max
      };
      ranges.push(range);
    }
    return ranges;
  };
  publicAPI.setTuple = (idx, tuple) => {
    const offset = idx * model.numberOfComponents;
    for (let i = 0; i < model.numberOfComponents; i++) {
      model.values[offset + i] = tuple[i];
    }
  };
  publicAPI.setTuples = (idx, tuples) => {
    let i = idx * model.numberOfComponents;
    const last = Math.min(tuples.length, model.size - i);
    for (let j = 0; j < last;) {
      model.values[i++] = tuples[j++];
    }
  };
  publicAPI.insertTuple = (idx, tuple) => {
    if (model.size <= idx * model.numberOfComponents) {
      model.size = (idx + 1) * model.numberOfComponents;
      resize(idx + 1);
    }
    publicAPI.setTuple(idx, tuple);
    return idx;
  };
  publicAPI.insertTuples = (idx, tuples) => {
    const end = idx + tuples.length / model.numberOfComponents;
    if (model.size < end * model.numberOfComponents) {
      model.size = end * model.numberOfComponents;
      resize(end);
    }
    publicAPI.setTuples(idx, tuples);
    return end;
  };
  publicAPI.insertNextTuple = tuple => {
    const idx = model.size / model.numberOfComponents;
    return publicAPI.insertTuple(idx, tuple);
  };
  publicAPI.insertNextTuples = tuples => {
    const idx = model.size / model.numberOfComponents;
    return publicAPI.insertTuples(idx, tuples);
  };
  publicAPI.findTuple = function (tuple) {
    let precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSILON;
    for (let i = 0; i < model.size; i += model.numberOfComponents) {
      if (Math.abs(tuple[0] - model.values[i]) <= precision) {
        let match = true;
        for (let j = 1; j < model.numberOfComponents; ++j) {
          if (Math.abs(tuple[j] - model.values[i + j]) > precision) {
            match = false;
            break;
          }
        }
        if (match) {
          return i / model.numberOfComponents;
        }
      }
    }
    return -1;
  };
  publicAPI.getTuple = function (idx) {
    let tupleToFill = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    const numberOfComponents = model.numberOfComponents || 1;
    const offset = idx * numberOfComponents;
    // Check most common component sizes first
    // to avoid doing a for loop if possible
    switch (numberOfComponents) {
      case 4:
        tupleToFill[3] = model.values[offset + 3];
      // eslint-disable-next-line no-fallthrough
      case 3:
        tupleToFill[2] = model.values[offset + 2];
      // eslint-disable-next-line no-fallthrough
      case 2:
        tupleToFill[1] = model.values[offset + 1];
      // eslint-disable-next-line no-fallthrough
      case 1:
        tupleToFill[0] = model.values[offset];
        break;
      default:
        for (let i = numberOfComponents - 1; i >= 0; --i) {
          tupleToFill[i] = model.values[offset + i];
        }
    }
    return tupleToFill;
  };
  publicAPI.getTuples = (fromId, toId) => {
    const from = (fromId ?? 0) * model.numberOfComponents;
    const to = (toId ?? publicAPI.getNumberOfTuples()) * model.numberOfComponents;
    const arr = publicAPI.getData().subarray(from, to);
    return arr.length > 0 ? arr : null;
  };
  publicAPI.getTupleLocation = function () {
    let idx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return idx * model.numberOfComponents;
  };
  publicAPI.getNumberOfComponents = () => model.numberOfComponents;
  publicAPI.getNumberOfValues = () => model.size;
  publicAPI.getNumberOfTuples = () => model.size / model.numberOfComponents;
  publicAPI.getDataType = () => model.dataType;
  /* eslint-disable no-use-before-define */
  publicAPI.newClone = () => newInstance({
    empty: true,
    name: model.name,
    dataType: model.dataType,
    numberOfComponents: model.numberOfComponents
  });
  /* eslint-enable no-use-before-define */

  publicAPI.getName = () => {
    if (!model.name) {
      publicAPI.modified();
      model.name = `vtkDataArray${publicAPI.getMTime()}`;
    }
    return model.name;
  };
  publicAPI.setData = (typedArray, numberOfComponents) => {
    model.values = typedArray;
    model.size = typedArray.length;
    model.dataType = getDataType(typedArray);
    if (numberOfComponents) {
      model.numberOfComponents = numberOfComponents;
    }
    if (model.size % model.numberOfComponents !== 0) {
      model.numberOfComponents = 1;
    }
    publicAPI.dataChange();
  };

  // Override serialization support
  publicAPI.getState = () => {
    if (model.deleted) {
      return null;
    }
    const jsonArchive = {
      ...model,
      vtkClass: publicAPI.getClassName()
    };

    // Convert typed array to regular array
    jsonArchive.values = Array.from(jsonArchive.values);
    delete jsonArchive.buffer;

    // Clean any empty data
    Object.keys(jsonArchive).forEach(keyName => {
      if (!jsonArchive[keyName]) {
        delete jsonArchive[keyName];
      }
    });

    // Sort resulting object by key name
    const sortedObj = {};
    Object.keys(jsonArchive).sort().forEach(name => {
      sortedObj[name] = jsonArchive[name];
    });

    // Remove mtime
    if (sortedObj.mtime) {
      delete sortedObj.mtime;
    }
    return sortedObj;
  };

  /**
   * @param {import("./index").vtkDataArray} other
   */
  publicAPI.deepCopy = other => {
    // Retain current dataType and array reference before shallowCopy call.
    const currentType = publicAPI.getDataType();
    const currentArray = model.values;
    publicAPI.shallowCopy(other);

    // set the ranges
    model.ranges = structuredClone(other.getRanges());

    // Avoid array reallocation if size already sufficient
    // and dataTypes match.
    if (currentArray?.length >= other.getNumberOfValues() && currentType === other.getDataType()) {
      currentArray.set(other.getData());
      model.values = currentArray;
      publicAPI.dataChange();
    } else {
      publicAPI.setData(other.getData().slice());
    }
  };
  publicAPI.interpolateTuple = (idx, source1, source1Idx, source2, source2Idx, t) => {
    const numberOfComponents = model.numberOfComponents || 1;
    if (numberOfComponents !== source1.getNumberOfComponents() || numberOfComponents !== source2.getNumberOfComponents()) {
      vtkErrorMacro('numberOfComponents must match');
    }
    const tuple1 = source1.getTuple(source1Idx);
    const tuple2 = source2.getTuple(source2Idx);
    const out = [];
    out.length = numberOfComponents;

    // Check most common component sizes first
    // to avoid doing a for loop if possible
    switch (numberOfComponents) {
      case 4:
        out[3] = tuple1[3] + (tuple2[3] - tuple1[3]) * t;
      // eslint-disable-next-line no-fallthrough
      case 3:
        out[2] = tuple1[2] + (tuple2[2] - tuple1[2]) * t;
      // eslint-disable-next-line no-fallthrough
      case 2:
        out[1] = tuple1[1] + (tuple2[1] - tuple1[1]) * t;
      // eslint-disable-next-line no-fallthrough
      case 1:
        out[0] = tuple1[0] + (tuple2[0] - tuple1[0]) * t;
        break;
      default:
        for (let i = 0; i < numberOfComponents; i++) {
          out[i] = tuple1[i] + (tuple2[i] - tuple1[i]) * t;
        }
    }
    return publicAPI.insertTuple(idx, out);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

// size: The current size of the dataArray.
// NOTE: The underlying typed array may be larger than 'size'.
const DEFAULT_VALUES = {
  name: '',
  numberOfComponents: 1,
  dataType: DefaultDataType,
  rangeTuple: [0, 0]
  // size: undefined,
  // values: null,
  // ranges: null,
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  if (Array.isArray(initialValues.values) && initialValues.dataType === undefined) {
    console.warn('vtkDataArray.newInstance: no dataType provided, converting to Float32Array');
  }
  if (!model.empty && !model.values && !model.size) {
    throw new TypeError('Cannot create vtkDataArray object without: size > 0, values');
  }
  if (!model.values) {
    model.values = (0,_macros2_js__WEBPACK_IMPORTED_MODULE_1__.a)(model.dataType, model.size);
  } else if (Array.isArray(model.values)) {
    model.values = (0,_macros2_js__WEBPACK_IMPORTED_MODULE_1__.b)(model.dataType, model.values);
  }
  if (model.values) {
    // Takes the size if provided (can be lower than `model.values`) otherwise the actual length of `values`.
    model.size = model.size ?? model.values.length;
    model.dataType = getDataType(model.values);
  }

  // Object methods
  (0,_macros2_js__WEBPACK_IMPORTED_MODULE_1__.o)(publicAPI, model);
  (0,_macros2_js__WEBPACK_IMPORTED_MODULE_1__.s)(publicAPI, model, ['name', 'numberOfComponents']);
  if (model.size % model.numberOfComponents !== 0) {
    throw new RangeError('model.size is not a multiple of model.numberOfComponents');
  }

  // Object specific methods
  vtkDataArray(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = (0,_macros2_js__WEBPACK_IMPORTED_MODULE_1__.n)(extend, 'vtkDataArray');

// ----------------------------------------------------------------------------

var vtkDataArray$1 = {
  newInstance,
  extend,
  ...STATIC,
  ..._DataArray_Constants_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Ay
};




/***/ }),

/***/ 28914:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ay: () => (/* binding */ Constants)
/* harmony export */ });
/* unused harmony exports DataTypeByteSize, DefaultDataType, VtkDataTypes */
const DataTypeByteSize = {
  Int8Array: 1,
  Uint8Array: 1,
  Uint8ClampedArray: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8
};
const VtkDataTypes = {
  VOID: '',
  // not sure to know what that should be
  CHAR: 'Int8Array',
  SIGNED_CHAR: 'Int8Array',
  UNSIGNED_CHAR: 'Uint8Array',
  UNSIGNED_CHAR_CLAMPED: 'Uint8ClampedArray',
  // should be used for VTK.js internal purpose only
  SHORT: 'Int16Array',
  UNSIGNED_SHORT: 'Uint16Array',
  INT: 'Int32Array',
  UNSIGNED_INT: 'Uint32Array',
  FLOAT: 'Float32Array',
  DOUBLE: 'Float64Array'
};
const DefaultDataType = VtkDataTypes.FLOAT;
var Constants = {
  DefaultDataType,
  DataTypeByteSize,
  VtkDataTypes
};




/***/ }),

/***/ 35341:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GY: () => (/* binding */ IDENTITY_3X3),
/* harmony export */   kP: () => (/* binding */ VTK_SMALL_NUMBER),
/* harmony export */   p8: () => (/* binding */ EPSILON),
/* harmony export */   zK: () => (/* binding */ IDENTITY)
/* harmony export */ });
/* unused harmony export default */
const IDENTITY = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const IDENTITY_3X3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
const EPSILON = 1e-6;
const VTK_SMALL_NUMBER = 1.0e-12;
var Constants = {
  IDENTITY,
  IDENTITY_3X3,
  EPSILON,
  VTK_SMALL_NUMBER
};




/***/ }),

/***/ 16632:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   b: () => (/* binding */ roundVector),
/* harmony export */   c: () => (/* binding */ clampVector),
/* harmony export */   d: () => (/* binding */ dot),
/* harmony export */   j: () => (/* binding */ cross),
/* harmony export */   k: () => (/* binding */ add),
/* harmony export */   n: () => (/* binding */ norm),
/* harmony export */   s: () => (/* binding */ subtract)
/* harmony export */ });
/* unused harmony exports $, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, _, a, a$, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, aA, aB, aC, aD, aE, aF, aG, aH, aI, aJ, aK, aL, aM, aN, aO, aP, aQ, aR, aS, aT, aU, aV, aW, aX, aY, aZ, a_, aa, ab, ac, ad, ae, af, ag, ah, ai, aj, ak, al, am, an, ao, ap, aq, ar, as, at, au, av, aw, ax, ay, az, b0, e, f, g, h, i, l, m, o, p, q, r, t, u, v, w, x, y, z */
/* harmony import */ var seedrandom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56037);
/* harmony import */ var seedrandom__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(seedrandom__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _macros2_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(28906);
/* harmony import */ var _Constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(35341);




const {
  vtkErrorMacro,
  vtkWarningMacro
} = _macros2_js__WEBPACK_IMPORTED_MODULE_1__.m;

// ----------------------------------------------------------------------------
/* eslint-disable camelcase                                                  */
/* eslint-disable no-cond-assign                                             */
/* eslint-disable no-bitwise                                                 */
/* eslint-disable no-multi-assign                                            */
// ----------------------------------------------------------------------------
let randomSeedValue = 0;
const VTK_MAX_ROTATIONS = 20;
function notImplemented(method) {
  return () => vtkErrorMacro(`vtkMath::${method} - NOT IMPLEMENTED`);
}

// Swap rows for n by n matrix
function swapRowsMatrix_nxn(matrix, n, row1, row2) {
  let tmp;
  for (let i = 0; i < n; i++) {
    tmp = matrix[row1 * n + i];
    matrix[row1 * n + i] = matrix[row2 * n + i];
    matrix[row2 * n + i] = tmp;
  }
}

// Swap columns for n by n matrix
function swapColumnsMatrix_nxn(matrix, n, column1, column2) {
  let tmp;
  for (let i = 0; i < n; i++) {
    tmp = matrix[i * n + column1];
    matrix[i * n + column1] = matrix[i * n + column2];
    matrix[i * n + column2] = tmp;
  }
}

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

function createArray() {
  let size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
  // faster than Array.from and/or while loop
  const res = Array(size);
  for (let i = 0; i < size; ++i) {
    res[i] = 0;
  }
  return res;
}
const Pi = () => Math.PI;
function ldexp(x, exponent) {
  if (exponent > 1023) {
    return x * 2 ** 1023 * 2 ** (exponent - 1023);
  }
  if (exponent < -1074) {
    return x * 2 ** -1074 * 2 ** (exponent + 1074);
  }
  return x * 2 ** exponent;
}
function radiansFromDegrees(deg) {
  return deg / 180 * Math.PI;
}
function degreesFromRadians(rad) {
  return rad * 180 / Math.PI;
}
const {
  round,
  floor,
  ceil,
  min,
  max
} = Math;
function arrayMin(arr) {
  let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let stride = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  let minValue = Infinity;
  for (let i = offset, len = arr.length; i < len; i += stride) {
    if (arr[i] < minValue) {
      minValue = arr[i];
    }
  }
  return minValue;
}
function arrayMax(arr) {
  let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let stride = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  let maxValue = -Infinity;
  for (let i = offset, len = arr.length; i < len; i += stride) {
    if (maxValue < arr[i]) {
      maxValue = arr[i];
    }
  }
  return maxValue;
}
function arrayRange(arr) {
  let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let stride = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  let minValue = Infinity;
  let maxValue = -Infinity;
  for (let i = offset, len = arr.length; i < len; i += stride) {
    if (arr[i] < minValue) {
      minValue = arr[i];
    }
    if (maxValue < arr[i]) {
      maxValue = arr[i];
    }
  }
  return [minValue, maxValue];
}
const ceilLog2 = notImplemented('ceilLog2');
const factorial = notImplemented('factorial');
function nearestPowerOfTwo(xi) {
  let v = 1;
  while (v < xi) {
    v *= 2;
  }
  return v;
}
function isPowerOfTwo(x) {
  return x === nearestPowerOfTwo(x);
}
function binomial(m, n) {
  let r = 1;
  for (let i = 1; i <= n; ++i) {
    r *= (m - i + 1) / i;
  }
  return Math.floor(r);
}
function beginCombination(m, n) {
  if (m < n) {
    return 0;
  }
  const r = createArray(n);
  for (let i = 0; i < n; ++i) {
    r[i] = i;
  }
  return r;
}
function nextCombination(m, n, r) {
  let status = 0;
  for (let i = n - 1; i >= 0; --i) {
    if (r[i] < m - n + i) {
      let j = r[i] + 1;
      while (i < n) {
        r[i++] = j++;
      }
      status = 1;
      break;
    }
  }
  return status;
}
function randomSeed(seed) {
  seedrandom__WEBPACK_IMPORTED_MODULE_0___default()(`${seed}`, {
    global: true
  });
  randomSeedValue = seed;
}
function getSeed() {
  return randomSeedValue;
}
function random() {
  let minValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  let maxValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  const delta = maxValue - minValue;
  return minValue + delta * Math.random();
}
const gaussian = notImplemented('gaussian');

// Vect3 operations
function add(a, b, out) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
function subtract(a, b, out) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
function multiplyScalar(vec, scalar) {
  vec[0] *= scalar;
  vec[1] *= scalar;
  vec[2] *= scalar;
  return vec;
}
function multiplyScalar2D(vec, scalar) {
  vec[0] *= scalar;
  vec[1] *= scalar;
  return vec;
}
function multiplyAccumulate(a, b, scalar, out) {
  out[0] = a[0] + b[0] * scalar;
  out[1] = a[1] + b[1] * scalar;
  out[2] = a[2] + b[2] * scalar;
  return out;
}
function multiplyAccumulate2D(a, b, scalar, out) {
  out[0] = a[0] + b[0] * scalar;
  out[1] = a[1] + b[1] * scalar;
  return out;
}
function dot(x, y) {
  return x[0] * y[0] + x[1] * y[1] + x[2] * y[2];
}
function outer(x, y, out_3x3) {
  out_3x3[0] = x[0] * y[0];
  out_3x3[1] = x[0] * y[1];
  out_3x3[2] = x[0] * y[2];
  out_3x3[3] = x[1] * y[0];
  out_3x3[4] = x[1] * y[1];
  out_3x3[5] = x[1] * y[2];
  out_3x3[6] = x[2] * y[0];
  out_3x3[7] = x[2] * y[1];
  out_3x3[8] = x[2] * y[2];
}
function cross(x, y, out) {
  const Zx = x[1] * y[2] - x[2] * y[1];
  const Zy = x[2] * y[0] - x[0] * y[2];
  const Zz = x[0] * y[1] - x[1] * y[0];
  out[0] = Zx;
  out[1] = Zy;
  out[2] = Zz;
  return out;
}
function norm(x) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  switch (n) {
    case 1:
      return Math.abs(x);
    case 2:
      return Math.sqrt(x[0] * x[0] + x[1] * x[1]);
    case 3:
      return Math.sqrt(x[0] * x[0] + x[1] * x[1] + x[2] * x[2]);
    default:
      {
        let sum = 0;
        for (let i = 0; i < n; i++) {
          sum += x[i] * x[i];
        }
        return Math.sqrt(sum);
      }
  }
}
function normalize(x) {
  const den = norm(x);
  if (den !== 0.0) {
    x[0] /= den;
    x[1] /= den;
    x[2] /= den;
  }
  return den;
}
function perpendiculars(x, y, z, theta) {
  const x2 = x[0] * x[0];
  const y2 = x[1] * x[1];
  const z2 = x[2] * x[2];
  const r = Math.sqrt(x2 + y2 + z2);
  let dx;
  let dy;
  let dz;

  // transpose the vector to avoid divide-by-zero error
  if (x2 > y2 && x2 > z2) {
    dx = 0;
    dy = 1;
    dz = 2;
  } else if (y2 > z2) {
    dx = 1;
    dy = 2;
    dz = 0;
  } else {
    dx = 2;
    dy = 0;
    dz = 1;
  }
  const a = x[dx] / r;
  const b = x[dy] / r;
  const c = x[dz] / r;
  const tmp = Math.sqrt(a * a + c * c);
  if (theta !== 0) {
    const sintheta = Math.sin(theta);
    const costheta = Math.cos(theta);
    if (y) {
      y[dx] = (c * costheta - a * b * sintheta) / tmp;
      y[dy] = sintheta * tmp;
      y[dz] = (-(a * costheta) - b * c * sintheta) / tmp;
    }
    if (z) {
      z[dx] = (-(c * sintheta) - a * b * costheta) / tmp;
      z[dy] = costheta * tmp;
      z[dz] = (a * sintheta - b * c * costheta) / tmp;
    }
  } else {
    if (y) {
      y[dx] = c / tmp;
      y[dy] = 0;
      y[dz] = -a / tmp;
    }
    if (z) {
      z[dx] = -a * b / tmp;
      z[dy] = tmp;
      z[dz] = -b * c / tmp;
    }
  }
}
function projectVector(a, b, projection) {
  const bSquared = dot(b, b);
  if (bSquared === 0) {
    projection[0] = 0;
    projection[1] = 0;
    projection[2] = 0;
    return false;
  }
  const scale = dot(a, b) / bSquared;
  for (let i = 0; i < 3; i++) {
    projection[i] = b[i];
  }
  multiplyScalar(projection, scale);
  return true;
}
function dot2D(x, y) {
  return x[0] * y[0] + x[1] * y[1];
}
function projectVector2D(a, b, projection) {
  const bSquared = dot2D(b, b);
  if (bSquared === 0) {
    projection[0] = 0;
    projection[1] = 0;
    return false;
  }
  const scale = dot2D(a, b) / bSquared;
  for (let i = 0; i < 2; i++) {
    projection[i] = b[i];
  }
  multiplyScalar2D(projection, scale);
  return true;
}
function distance2BetweenPoints(x, y) {
  return (x[0] - y[0]) * (x[0] - y[0]) + (x[1] - y[1]) * (x[1] - y[1]) + (x[2] - y[2]) * (x[2] - y[2]);
}
function angleBetweenVectors(v1, v2) {
  const crossVect = [0, 0, 0];
  cross(v1, v2, crossVect);
  return Math.atan2(norm(crossVect), dot(v1, v2));
}
function signedAngleBetweenVectors(v1, v2, vN) {
  const crossVect = [0, 0, 0];
  cross(v1, v2, crossVect);
  const angle = Math.atan2(norm(crossVect), dot(v1, v2));
  return dot(crossVect, vN) >= 0 ? angle : -angle;
}
function gaussianAmplitude(mean, variance, position) {
  const distanceFromMean = Math.abs(mean - position);
  return 1 / Math.sqrt(2 * Math.PI * variance) * Math.exp(-(distanceFromMean ** 2) / (2 * variance));
}
function gaussianWeight(mean, variance, position) {
  const distanceFromMean = Math.abs(mean - position);
  return Math.exp(-(distanceFromMean ** 2) / (2 * variance));
}
function outer2D(x, y, out_2x2) {
  out_2x2[0] = x[0] * y[0];
  out_2x2[1] = x[0] * y[1];
  out_2x2[2] = x[1] * y[0];
  out_2x2[3] = x[1] * y[1];
}
function norm2D(x2D) {
  return Math.sqrt(x2D[0] * x2D[0] + x2D[1] * x2D[1]);
}
function normalize2D(x) {
  const den = norm2D(x);
  if (den !== 0.0) {
    x[0] /= den;
    x[1] /= den;
  }
  return den;
}
function rowsToMat4(row0, row1, row2, row3, mat) {
  for (let i = 0; i < 4; i++) {
    mat[i] = row0[i];
    mat[4 + i] = row1[i];
    mat[8 + i] = row2[i];
    mat[12 + i] = row3[i];
  }
  return mat;
}
function columnsToMat4(column0, column1, column2, column3, mat) {
  for (let i = 0; i < 4; i++) {
    mat[4 * i] = column0[i];
    mat[4 * i + 1] = column1[i];
    mat[4 * i + 2] = column2[i];
    mat[4 * i + 3] = column3[i];
  }
  return mat;
}
function rowsToMat3(row0, row1, row2, mat) {
  for (let i = 0; i < 3; i++) {
    mat[i] = row0[i];
    mat[3 + i] = row1[i];
    mat[6 + i] = row2[i];
  }
  return mat;
}
function columnsToMat3(column0, column1, column2, mat) {
  for (let i = 0; i < 3; i++) {
    mat[3 * i] = column0[i];
    mat[3 * i + 1] = column1[i];
    mat[3 * i + 2] = column2[i];
  }
  return mat;
}
function determinant2x2() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  if (args.length === 2) {
    return args[0][0] * args[1][1] - args[1][0] * args[0][1];
  }
  if (args.length === 4) {
    return args[0] * args[3] - args[1] * args[2];
  }
  return Number.NaN;
}
function LUFactor3x3(mat_3x3, index_3) {
  let maxI;
  let tmp;
  let largest;
  const scale = [0, 0, 0];

  // Loop over rows to get implicit scaling information
  for (let i = 0; i < 3; i++) {
    largest = Math.abs(mat_3x3[i * 3]);
    if ((tmp = Math.abs(mat_3x3[i * 3 + 1])) > largest) {
      largest = tmp;
    }
    if ((tmp = Math.abs(mat_3x3[i * 3 + 2])) > largest) {
      largest = tmp;
    }
    scale[i] = 1 / largest;
  }

  // Loop over all columns using Crout's method

  // first column
  largest = scale[0] * Math.abs(mat_3x3[0]);
  maxI = 0;
  if ((tmp = scale[1] * Math.abs(mat_3x3[3])) >= largest) {
    largest = tmp;
    maxI = 1;
  }
  if ((tmp = scale[2] * Math.abs(mat_3x3[6])) >= largest) {
    maxI = 2;
  }
  if (maxI !== 0) {
    swapRowsMatrix_nxn(mat_3x3, 3, maxI, 0);
    scale[maxI] = scale[0];
  }
  index_3[0] = maxI;
  mat_3x3[3] /= mat_3x3[0];
  mat_3x3[6] /= mat_3x3[0];

  // second column
  mat_3x3[4] -= mat_3x3[3] * mat_3x3[1];
  mat_3x3[7] -= mat_3x3[6] * mat_3x3[1];
  largest = scale[1] * Math.abs(mat_3x3[4]);
  maxI = 1;
  if ((tmp = scale[2] * Math.abs(mat_3x3[7])) >= largest) {
    maxI = 2;
    swapRowsMatrix_nxn(mat_3x3, 3, 1, 2);
    scale[2] = scale[1];
  }
  index_3[1] = maxI;
  mat_3x3[7] /= mat_3x3[4];

  // third column
  mat_3x3[5] -= mat_3x3[3] * mat_3x3[2];
  mat_3x3[8] -= mat_3x3[6] * mat_3x3[2] + mat_3x3[7] * mat_3x3[5];
  index_3[2] = 2;
}
function LUSolve3x3(mat_3x3, index_3, x_3) {
  // forward substitution
  let sum = x_3[index_3[0]];
  x_3[index_3[0]] = x_3[0];
  x_3[0] = sum;
  sum = x_3[index_3[1]];
  x_3[index_3[1]] = x_3[1];
  x_3[1] = sum - mat_3x3[3] * x_3[0];
  sum = x_3[index_3[2]];
  x_3[index_3[2]] = x_3[2];
  x_3[2] = sum - mat_3x3[6] * x_3[0] - mat_3x3[7] * x_3[1];

  // back substitution
  x_3[2] /= mat_3x3[8];
  x_3[1] = (x_3[1] - mat_3x3[5] * x_3[2]) / mat_3x3[4];
  x_3[0] = (x_3[0] - mat_3x3[1] * x_3[1] - mat_3x3[2] * x_3[2]) / mat_3x3[0];
}
function linearSolve3x3(mat_3x3, x_3, y_3) {
  const a1 = mat_3x3[0];
  const b1 = mat_3x3[1];
  const c1 = mat_3x3[2];
  const a2 = mat_3x3[3];
  const b2 = mat_3x3[4];
  const c2 = mat_3x3[5];
  const a3 = mat_3x3[6];
  const b3 = mat_3x3[7];
  const c3 = mat_3x3[8];

  // Compute the adjoint
  const d1 = +determinant2x2(b2, b3, c2, c3);
  const d2 = -determinant2x2(a2, a3, c2, c3);
  const d3 = +determinant2x2(a2, a3, b2, b3);
  const e1 = -determinant2x2(b1, b3, c1, c3);
  const e2 = +determinant2x2(a1, a3, c1, c3);
  const e3 = -determinant2x2(a1, a3, b1, b3);
  const f1 = +determinant2x2(b1, b2, c1, c2);
  const f2 = -determinant2x2(a1, a2, c1, c2);
  const f3 = +determinant2x2(a1, a2, b1, b2);

  // Compute the determinant
  const det = a1 * d1 + b1 * d2 + c1 * d3;

  // Multiply by the adjoint
  const v1 = d1 * x_3[0] + e1 * x_3[1] + f1 * x_3[2];
  const v2 = d2 * x_3[0] + e2 * x_3[1] + f2 * x_3[2];
  const v3 = d3 * x_3[0] + e3 * x_3[1] + f3 * x_3[2];

  // Divide by the determinant
  y_3[0] = v1 / det;
  y_3[1] = v2 / det;
  y_3[2] = v3 / det;
}
function multiply3x3_vect3(mat_3x3, in_3, out_3) {
  const x = mat_3x3[0] * in_3[0] + mat_3x3[1] * in_3[1] + mat_3x3[2] * in_3[2];
  const y = mat_3x3[3] * in_3[0] + mat_3x3[4] * in_3[1] + mat_3x3[5] * in_3[2];
  const z = mat_3x3[6] * in_3[0] + mat_3x3[7] * in_3[1] + mat_3x3[8] * in_3[2];
  out_3[0] = x;
  out_3[1] = y;
  out_3[2] = z;
}
function multiply3x3_mat3(a_3x3, b_3x3, out_3x3) {
  const copyA = [...a_3x3];
  const copyB = [...b_3x3];
  for (let i = 0; i < 3; i++) {
    out_3x3[i] = copyA[0] * copyB[i] + copyA[1] * copyB[i + 3] + copyA[2] * copyB[i + 6];
    out_3x3[i + 3] = copyA[3] * copyB[i] + copyA[4] * copyB[i + 3] + copyA[5] * copyB[i + 6];
    out_3x3[i + 6] = copyA[6] * copyB[i] + copyA[7] * copyB[i + 3] + copyA[8] * copyB[i + 6];
  }
}
function multiplyMatrix(a, b, rowA, colA, rowB, colB, outRowAColB) {
  // we need colA == rowB
  if (colA !== rowB) {
    vtkErrorMacro('Number of columns of A must match number of rows of B.');
  }

  // If a or b is used to store the result, copying them is required
  const copyA = [...a];
  const copyB = [...b];
  // output matrix is rowA*colB
  // output row
  for (let i = 0; i < rowA; i++) {
    // output col
    for (let j = 0; j < colB; j++) {
      outRowAColB[i * colB + j] = 0;
      // sum for this point
      for (let k = 0; k < colA; k++) {
        outRowAColB[i * colB + j] += copyA[i * colA + k] * copyB[j + colB * k];
      }
    }
  }
}
function transpose3x3(in_3x3, outT_3x3) {
  let tmp;

  // off-diagonal elements
  tmp = in_3x3[3];
  outT_3x3[3] = in_3x3[1];
  outT_3x3[1] = tmp;
  tmp = in_3x3[6];
  outT_3x3[6] = in_3x3[2];
  outT_3x3[2] = tmp;
  tmp = in_3x3[7];
  outT_3x3[7] = in_3x3[5];
  outT_3x3[5] = tmp;

  // on-diagonal elements
  outT_3x3[0] = in_3x3[0];
  outT_3x3[4] = in_3x3[4];
  outT_3x3[8] = in_3x3[8];
}
function invert3x3(in_3x3, outI_3x3) {
  const a1 = in_3x3[0];
  const b1 = in_3x3[1];
  const c1 = in_3x3[2];
  const a2 = in_3x3[3];
  const b2 = in_3x3[4];
  const c2 = in_3x3[5];
  const a3 = in_3x3[6];
  const b3 = in_3x3[7];
  const c3 = in_3x3[8];

  // Compute the adjoint
  const d1 = +determinant2x2(b2, b3, c2, c3);
  const d2 = -determinant2x2(a2, a3, c2, c3);
  const d3 = +determinant2x2(a2, a3, b2, b3);
  const e1 = -determinant2x2(b1, b3, c1, c3);
  const e2 = +determinant2x2(a1, a3, c1, c3);
  const e3 = -determinant2x2(a1, a3, b1, b3);
  const f1 = +determinant2x2(b1, b2, c1, c2);
  const f2 = -determinant2x2(a1, a2, c1, c2);
  const f3 = +determinant2x2(a1, a2, b1, b2);

  // Divide by the determinant
  const det = a1 * d1 + b1 * d2 + c1 * d3;
  if (det === 0) {
    vtkWarningMacro('Matrix has 0 determinant');
  }
  outI_3x3[0] = d1 / det;
  outI_3x3[3] = d2 / det;
  outI_3x3[6] = d3 / det;
  outI_3x3[1] = e1 / det;
  outI_3x3[4] = e2 / det;
  outI_3x3[7] = e3 / det;
  outI_3x3[2] = f1 / det;
  outI_3x3[5] = f2 / det;
  outI_3x3[8] = f3 / det;
}
function determinant3x3(mat_3x3) {
  return mat_3x3[0] * mat_3x3[4] * mat_3x3[8] + mat_3x3[3] * mat_3x3[7] * mat_3x3[2] + mat_3x3[6] * mat_3x3[1] * mat_3x3[5] - mat_3x3[0] * mat_3x3[7] * mat_3x3[5] - mat_3x3[3] * mat_3x3[1] * mat_3x3[8] - mat_3x3[6] * mat_3x3[4] * mat_3x3[2];
}

/**
 * Returns true if elements of both arrays are equals.
 * @param {Array} a an array of numbers (vector, point, matrix...)
 * @param {Array} b an array of numbers (vector, point, matrix...)
 * @param {Number} eps tolerance
 */
function areEquals(a, b) {
  let eps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _Constants_js__WEBPACK_IMPORTED_MODULE_2__/* .EPSILON */ .p8;
  if (a.length !== b.length) {
    return false;
  }
  function isEqual(element, index) {
    return Math.abs(element - b[index]) <= eps;
  }
  return a.every(isEqual);
}
const areMatricesEqual = areEquals;
function identity3x3(mat_3x3) {
  for (let i = 0; i < 3; i++) {
    /* eslint-disable-next-line no-multi-assign */
    mat_3x3[i * 3] = mat_3x3[i * 3 + 1] = mat_3x3[i * 3 + 2] = 0;
    mat_3x3[i * 3 + i] = 1;
  }
}
function identity(n, mat) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      mat[i * n + j] = 0;
    }
    mat[i * n + i] = 1;
  }
  return mat;
}
function isIdentity(mat) {
  let eps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _Constants_js__WEBPACK_IMPORTED_MODULE_2__/* .EPSILON */ .p8;
  return areMatricesEqual(mat, _Constants_js__WEBPACK_IMPORTED_MODULE_2__/* .IDENTITY */ .zK, eps);
}
function isIdentity3x3(mat) {
  let eps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _Constants_js__WEBPACK_IMPORTED_MODULE_2__/* .EPSILON */ .p8;
  return areMatricesEqual(mat, _Constants_js__WEBPACK_IMPORTED_MODULE_2__/* .IDENTITY_3X3 */ .GY, eps);
}
function quaternionToMatrix3x3(quat_4, mat_3x3) {
  const ww = quat_4[0] * quat_4[0];
  const wx = quat_4[0] * quat_4[1];
  const wy = quat_4[0] * quat_4[2];
  const wz = quat_4[0] * quat_4[3];
  const xx = quat_4[1] * quat_4[1];
  const yy = quat_4[2] * quat_4[2];
  const zz = quat_4[3] * quat_4[3];
  const xy = quat_4[1] * quat_4[2];
  const xz = quat_4[1] * quat_4[3];
  const yz = quat_4[2] * quat_4[3];
  const rr = xx + yy + zz;
  // normalization factor, just in case quaternion was not normalized
  let f = 1 / (ww + rr);
  const s = (ww - rr) * f;
  f *= 2;
  mat_3x3[0] = xx * f + s;
  mat_3x3[3] = (xy + wz) * f;
  mat_3x3[6] = (xz - wy) * f;
  mat_3x3[1] = (xy - wz) * f;
  mat_3x3[4] = yy * f + s;
  mat_3x3[7] = (yz + wx) * f;
  mat_3x3[2] = (xz + wy) * f;
  mat_3x3[5] = (yz - wx) * f;
  mat_3x3[8] = zz * f + s;
}
function roundNumber(num) {
  let digits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (!`${num}`.includes('e')) {
    return +`${Math.round(`${num}e+${digits}`)}e-${digits}`;
  }
  const arr = `${num}`.split('e');
  let sig = '';
  if (+arr[1] + digits > 0) {
    sig = '+';
  }
  return +`${Math.round(`${+arr[0]}e${sig}${+arr[1] + digits}`)}e-${digits}`;
}
function roundVector(vector) {
  let out = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
  let digits = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  out[0] = roundNumber(vector[0], digits);
  out[1] = roundNumber(vector[1], digits);
  out[2] = roundNumber(vector[2], digits);
  return out;
}
function jacobiN(a, n, w, v) {
  let i;
  let j;
  let k;
  let iq;
  let ip;
  let numPos;
  let tresh;
  let theta;
  let t;
  let tau;
  let sm;
  let s;
  let h;
  let g;
  let c;
  let tmp;
  const b = createArray(n);
  const z = createArray(n);
  const vtkROTATE = (aa, ii, jj) => {
    g = aa[ii];
    h = aa[jj];
    aa[ii] = g - s * (h + g * tau);
    aa[jj] = h + s * (g - h * tau);
  };

  // initialize
  identity(n, v);
  for (ip = 0; ip < n; ip++) {
    b[ip] = w[ip] = a[ip + ip * n];
    z[ip] = 0.0;
  }

  // begin rotation sequence
  for (i = 0; i < VTK_MAX_ROTATIONS; i++) {
    sm = 0.0;
    for (ip = 0; ip < n - 1; ip++) {
      for (iq = ip + 1; iq < n; iq++) {
        sm += Math.abs(a[ip * n + iq]);
      }
    }
    if (sm === 0.0) {
      break;
    }

    // first 3 sweeps
    if (i < 3) {
      tresh = 0.2 * sm / (n * n);
    } else {
      tresh = 0.0;
    }
    for (ip = 0; ip < n - 1; ip++) {
      for (iq = ip + 1; iq < n; iq++) {
        g = 100.0 * Math.abs(a[ip * n + iq]);

        // after 4 sweeps
        if (i > 3 && Math.abs(w[ip]) + g === Math.abs(w[ip]) && Math.abs(w[iq]) + g === Math.abs(w[iq])) {
          a[ip * n + iq] = 0.0;
        } else if (Math.abs(a[ip * n + iq]) > tresh) {
          h = w[iq] - w[ip];
          if (Math.abs(h) + g === Math.abs(h)) {
            t = a[ip * n + iq] / h;
          } else {
            theta = 0.5 * h / a[ip * n + iq];
            t = 1.0 / (Math.abs(theta) + Math.sqrt(1.0 + theta * theta));
            if (theta < 0.0) {
              t = -t;
            }
          }
          c = 1.0 / Math.sqrt(1 + t * t);
          s = t * c;
          tau = s / (1.0 + c);
          h = t * a[ip * n + iq];
          z[ip] -= h;
          z[iq] += h;
          w[ip] -= h;
          w[iq] += h;
          a[ip * n + iq] = 0.0;

          // ip already shifted left by 1 unit
          for (j = 0; j <= ip - 1; j++) {
            vtkROTATE(a, j * n + ip, j * n + iq);
          }
          // ip and iq already shifted left by 1 unit
          for (j = ip + 1; j <= iq - 1; j++) {
            vtkROTATE(a, ip * n + j, j * n + iq);
          }
          // iq already shifted left by 1 unit
          for (j = iq + 1; j < n; j++) {
            vtkROTATE(a, ip * n + j, iq * n + j);
          }
          for (j = 0; j < n; j++) {
            vtkROTATE(v, j * n + ip, j * n + iq);
          }
        }
      }
    }
    for (ip = 0; ip < n; ip++) {
      b[ip] += z[ip];
      w[ip] = b[ip];
      z[ip] = 0.0;
    }
  }

  // this is NEVER called
  if (i >= VTK_MAX_ROTATIONS) {
    vtkWarningMacro('vtkMath::Jacobi: Error extracting eigenfunctions');
    return 0;
  }

  // sort eigenfunctions: these changes do not affect accuracy
  for (j = 0; j < n - 1; j++) {
    // boundary incorrect
    k = j;
    tmp = w[k];
    for (i = j + 1; i < n; i++) {
      // boundary incorrect, shifted already
      if (w[i] >= tmp || Math.abs(w[i] - tmp) < _Constants_js__WEBPACK_IMPORTED_MODULE_2__/* .VTK_SMALL_NUMBER */ .kP) {
        // why exchange if same?
        k = i;
        tmp = w[k];
      }
    }
    if (k !== j) {
      w[k] = w[j];
      w[j] = tmp;
      swapColumnsMatrix_nxn(v, n, j, k);
    }
  }
  // ensure eigenvector consistency (i.e., Jacobi can compute vectors that
  // are negative of one another (.707,.707,0) and (-.707,-.707,0). This can
  // reek havoc in hyperstreamline/other stuff. We will select the most
  // positive eigenvector.
  const ceil_half_n = (n >> 1) + (n & 1);
  for (numPos = 0, i = 0; i < n * n; i++) {
    if (v[i] >= 0.0) {
      numPos++;
    }
  }
  //    if ( numPos < ceil(double(n)/double(2.0)) )
  if (numPos < ceil_half_n) {
    for (i = 0; i < n; i++) {
      v[i * n + j] *= -1.0;
    }
  }
  return 1;
}
function matrix3x3ToQuaternion(mat_3x3, quat_4) {
  const tmp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  // on-diagonal elements
  tmp[0] = mat_3x3[0] + mat_3x3[4] + mat_3x3[8];
  tmp[5] = mat_3x3[0] - mat_3x3[4] - mat_3x3[8];
  tmp[10] = -mat_3x3[0] + mat_3x3[4] - mat_3x3[8];
  tmp[15] = -mat_3x3[0] - mat_3x3[4] + mat_3x3[8];

  // off-diagonal elements
  tmp[1] = tmp[4] = mat_3x3[7] - mat_3x3[5];
  tmp[2] = tmp[8] = mat_3x3[2] - mat_3x3[6];
  tmp[3] = tmp[12] = mat_3x3[3] - mat_3x3[1];
  tmp[6] = tmp[9] = mat_3x3[3] + mat_3x3[1];
  tmp[7] = tmp[13] = mat_3x3[2] + mat_3x3[6];
  tmp[11] = tmp[14] = mat_3x3[7] + mat_3x3[5];
  const eigenvectors = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const eigenvalues = [0, 0, 0, 0];

  // convert into format that JacobiN can use,
  // then use Jacobi to find eigenvalues and eigenvectors
  // tmp is copied because jacobiN may modify it
  const NTemp = [...tmp];
  jacobiN(NTemp, 4, eigenvalues, eigenvectors);

  // the first eigenvector is the one we want
  quat_4[0] = eigenvectors[0];
  quat_4[1] = eigenvectors[4];
  quat_4[2] = eigenvectors[8];
  quat_4[3] = eigenvectors[12];
}
function multiplyQuaternion(quat_1, quat_2, quat_out) {
  const ww = quat_1[0] * quat_2[0];
  const wx = quat_1[0] * quat_2[1];
  const wy = quat_1[0] * quat_2[2];
  const wz = quat_1[0] * quat_2[3];
  const xw = quat_1[1] * quat_2[0];
  const xx = quat_1[1] * quat_2[1];
  const xy = quat_1[1] * quat_2[2];
  const xz = quat_1[1] * quat_2[3];
  const yw = quat_1[2] * quat_2[0];
  const yx = quat_1[2] * quat_2[1];
  const yy = quat_1[2] * quat_2[2];
  const yz = quat_1[2] * quat_2[3];
  const zw = quat_1[3] * quat_2[0];
  const zx = quat_1[3] * quat_2[1];
  const zy = quat_1[3] * quat_2[2];
  const zz = quat_1[3] * quat_2[3];
  quat_out[0] = ww - xx - yy - zz;
  quat_out[1] = wx + xw + yz - zy;
  quat_out[2] = wy - xz + yw + zx;
  quat_out[3] = wz + xy - yx + zw;
}
function orthogonalize3x3(a_3x3, out_3x3) {
  // copy the matrix
  for (let i = 0; i < 9; i++) {
    out_3x3[i] = a_3x3[i];
  }

  // Pivot the matrix to improve accuracy
  const scale = createArray(3);
  const index = createArray(3);
  let largest;

  // Loop over rows to get implicit scaling information
  for (let i = 0; i < 3; i++) {
    const x1 = Math.abs(out_3x3[i * 3]);
    const x2 = Math.abs(out_3x3[i * 3 + 1]);
    const x3 = Math.abs(out_3x3[i * 3 + 2]);
    largest = x2 > x1 ? x2 : x1;
    largest = x3 > largest ? x3 : largest;
    scale[i] = 1;
    if (largest !== 0) {
      scale[i] /= largest;
    }
  }

  // first column
  const x1 = Math.abs(out_3x3[0]) * scale[0];
  const x2 = Math.abs(out_3x3[3]) * scale[1];
  const x3 = Math.abs(out_3x3[6]) * scale[2];
  index[0] = 0;
  largest = x1;
  if (x2 >= largest) {
    largest = x2;
    index[0] = 1;
  }
  if (x3 >= largest) {
    index[0] = 2;
  }
  if (index[0] !== 0) {
    // swap vectors
    swapColumnsMatrix_nxn(out_3x3, 3, index[0], 0);
    scale[index[0]] = scale[0];
  }

  // second column
  const y2 = Math.abs(out_3x3[4]) * scale[1];
  const y3 = Math.abs(out_3x3[7]) * scale[2];
  index[1] = 1;
  largest = y2;
  if (y3 >= largest) {
    index[1] = 2;
    // swap vectors
    swapColumnsMatrix_nxn(out_3x3, 3, 1, 2);
  }

  // third column
  index[2] = 2;

  // A quaternion can only describe a pure rotation, not
  // a rotation with a flip, therefore the flip must be
  // removed before the matrix is converted to a quaternion.
  let flip = 0;
  if (determinant3x3(out_3x3) < 0) {
    flip = 1;
    for (let i = 0; i < 9; i++) {
      out_3x3[i] = -out_3x3[i];
    }
  }

  // Do orthogonalization using a quaternion intermediate
  // (this, essentially, does the orthogonalization via
  // diagonalization of an appropriately constructed symmetric
  // 4x4 matrix rather than by doing SVD of the 3x3 matrix)
  const quat = createArray(4);
  matrix3x3ToQuaternion(out_3x3, quat);
  quaternionToMatrix3x3(quat, out_3x3);

  // Put the flip back into the orthogonalized matrix.
  if (flip) {
    for (let i = 0; i < 9; i++) {
      out_3x3[i] = -out_3x3[i];
    }
  }

  // Undo the pivoting
  if (index[1] !== 1) {
    swapColumnsMatrix_nxn(out_3x3, 3, index[1], 1);
  }
  if (index[0] !== 0) {
    swapColumnsMatrix_nxn(out_3x3, 3, index[0], 0);
  }
}
function diagonalize3x3(a_3x3, w_3, v_3x3) {
  let i;
  let j;
  let k;
  let maxI;
  let tmp;
  let maxVal;

  // a is copied because jacobiN may modify it
  const copyA = [...a_3x3];

  // diagonalize using Jacobi
  jacobiN(copyA, 3, w_3, v_3x3);

  // if all the eigenvalues are the same, return identity matrix
  if (w_3[0] === w_3[1] && w_3[0] === w_3[2]) {
    identity3x3(v_3x3);
    return;
  }

  // transpose temporarily, it makes it easier to sort the eigenvectors
  transpose3x3(v_3x3, v_3x3);

  // if two eigenvalues are the same, re-orthogonalize to optimally line
  // up the eigenvectors with the x, y, and z axes
  for (i = 0; i < 3; i++) {
    // two eigenvalues are the same
    if (w_3[(i + 1) % 3] === w_3[(i + 2) % 3]) {
      // find maximum element of the independent eigenvector
      maxVal = Math.abs(v_3x3[i * 3]);
      maxI = 0;
      for (j = 1; j < 3; j++) {
        if (maxVal < (tmp = Math.abs(v_3x3[i * 3 + j]))) {
          maxVal = tmp;
          maxI = j;
        }
      }
      // swap the eigenvector into its proper position
      if (maxI !== i) {
        tmp = w_3[maxI];
        w_3[maxI] = w_3[i];
        w_3[i] = tmp;
        swapRowsMatrix_nxn(v_3x3, 3, i, maxI);
      }
      // maximum element of eigenvector should be positive
      if (v_3x3[maxI * 3 + maxI] < 0) {
        v_3x3[maxI * 3] = -v_3x3[maxI * 3];
        v_3x3[maxI * 3 + 1] = -v_3x3[maxI * 3 + 1];
        v_3x3[maxI * 3 + 2] = -v_3x3[maxI * 3 + 2];
      }

      // re-orthogonalize the other two eigenvectors
      j = (maxI + 1) % 3;
      k = (maxI + 2) % 3;
      v_3x3[j * 3] = 0.0;
      v_3x3[j * 3 + 1] = 0.0;
      v_3x3[j * 3 + 2] = 0.0;
      v_3x3[j * 3 + j] = 1.0;
      const vectTmp1 = cross([v_3x3[maxI * 3], v_3x3[maxI * 3 + 1], v_3x3[maxI * 3 + 2]], [v_3x3[j * 3], v_3x3[j * 3 + 1], v_3x3[j * 3 + 2]], []);
      normalize(vectTmp1);
      const vectTmp2 = cross(vectTmp1, [v_3x3[maxI * 3], v_3x3[maxI * 3 + 1], v_3x3[maxI * 3 + 2]], []);
      for (let t = 0; t < 3; t++) {
        v_3x3[k * 3 + t] = vectTmp1[t];
        v_3x3[j * 3 + t] = vectTmp2[t];
      }

      // transpose vectors back to columns
      transpose3x3(v_3x3, v_3x3);
      return;
    }
  }

  // the three eigenvalues are different, just sort the eigenvectors
  // to align them with the x, y, and z axes

  // find the vector with the largest x element, make that vector
  // the first vector
  maxVal = Math.abs(v_3x3[0]);
  maxI = 0;
  for (i = 1; i < 3; i++) {
    if (maxVal < (tmp = Math.abs(v_3x3[i * 3]))) {
      maxVal = tmp;
      maxI = i;
    }
  }
  // swap eigenvalue and eigenvector
  if (maxI !== 0) {
    const eigenValTmp = w_3[maxI];
    w_3[maxI] = w_3[0];
    w_3[0] = eigenValTmp;
    swapRowsMatrix_nxn(v_3x3, 3, maxI, 0);
  }
  // do the same for the y element
  if (Math.abs(v_3x3[4]) < Math.abs(v_3x3[7])) {
    const eigenValTmp = w_3[2];
    w_3[2] = w_3[1];
    w_3[1] = eigenValTmp;
    swapRowsMatrix_nxn(v_3x3, 3, 1, 2);
  }

  // ensure that the sign of the eigenvectors is correct
  for (i = 0; i < 2; i++) {
    if (v_3x3[i * 3 + i] < 0) {
      v_3x3[i * 3] = -v_3x3[i * 3];
      v_3x3[i * 3 + 1] = -v_3x3[i * 3 + 1];
      v_3x3[i * 3 + 2] = -v_3x3[i * 3 + 2];
    }
  }
  // set sign of final eigenvector to ensure that determinant is positive
  if (determinant3x3(v_3x3) < 0) {
    v_3x3[6] = -v_3x3[6];
    v_3x3[7] = -v_3x3[7];
    v_3x3[8] = -v_3x3[8];
  }

  // transpose the eigenvectors back again
  transpose3x3(v_3x3, v_3x3);
}
function singularValueDecomposition3x3(a_3x3, u_3x3, w_3, vT_3x3) {
  let i;
  // copy so that A can be used for U or VT without risk
  const B = [...a_3x3];

  // temporarily flip if determinant is negative
  const d = determinant3x3(B);
  if (d < 0) {
    for (i = 0; i < 9; i++) {
      B[i] = -B[i];
    }
  }

  // orthogonalize, diagonalize, etc.
  orthogonalize3x3(B, u_3x3);
  transpose3x3(B, B);
  multiply3x3_mat3(B, u_3x3, vT_3x3);
  diagonalize3x3(vT_3x3, w_3, vT_3x3);
  multiply3x3_mat3(u_3x3, vT_3x3, u_3x3);
  transpose3x3(vT_3x3, vT_3x3);

  // re-create the flip
  if (d < 0) {
    w_3[0] = -w_3[0];
    w_3[1] = -w_3[1];
    w_3[2] = -w_3[2];
  }
}

/**
 * Factor linear equations Ax = b using LU decomposition A = LU. Output factorization LU is in matrix A.
 * @param {Matrix} A square matrix
 * @param {Number} index integer array of pivot indices index[0->n-1]
 * @param {Number} size matrix size
 */
function luFactorLinearSystem(A, index, size) {
  let i;
  let j;
  let k;
  let largest;
  let maxI = 0;
  let sum;
  let temp1;
  let temp2;
  const scale = createArray(size);

  //
  // Loop over rows to get implicit scaling information
  //
  for (i = 0; i < size; i++) {
    for (largest = 0.0, j = 0; j < size; j++) {
      if ((temp2 = Math.abs(A[i * size + j])) > largest) {
        largest = temp2;
      }
    }
    if (largest === 0.0) {
      vtkWarningMacro('Unable to factor linear system');
      return 0;
    }
    scale[i] = 1.0 / largest;
  }
  //
  // Loop over all columns using Crout's method
  //
  for (j = 0; j < size; j++) {
    for (i = 0; i < j; i++) {
      sum = A[i * size + j];
      for (k = 0; k < i; k++) {
        sum -= A[i * size + k] * A[k * size + j];
      }
      A[i * size + j] = sum;
    }
    //
    // Begin search for largest pivot element
    //
    for (largest = 0.0, i = j; i < size; i++) {
      sum = A[i * size + j];
      for (k = 0; k < j; k++) {
        sum -= A[i * size + k] * A[k * size + j];
      }
      A[i * size + j] = sum;
      if ((temp1 = scale[i] * Math.abs(sum)) >= largest) {
        largest = temp1;
        maxI = i;
      }
    }
    //
    // Check for row interchange
    //
    if (j !== maxI) {
      for (k = 0; k < size; k++) {
        temp1 = A[maxI * size + k];
        A[maxI * size + k] = A[j * size + k];
        A[j * size + k] = temp1;
      }
      scale[maxI] = scale[j];
    }
    //
    // Divide by pivot element and perform elimination
    //
    index[j] = maxI;
    if (Math.abs(A[j * size + j]) <= _Constants_js__WEBPACK_IMPORTED_MODULE_2__/* .VTK_SMALL_NUMBER */ .kP) {
      vtkWarningMacro('Unable to factor linear system');
      return 0;
    }
    if (j !== size - 1) {
      temp1 = 1.0 / A[j * size + j];
      for (i = j + 1; i < size; i++) {
        A[i * size + j] *= temp1;
      }
    }
  }
  return 1;
}
function luSolveLinearSystem(A, index, x, size) {
  let i;
  let j;
  let ii;
  let idx;
  let sum;
  //
  // Proceed with forward and backsubstitution for L and U
  // matrices.  First, forward substitution.
  //
  for (ii = -1, i = 0; i < size; i++) {
    idx = index[i];
    sum = x[idx];
    x[idx] = x[i];
    if (ii >= 0) {
      for (j = ii; j <= i - 1; j++) {
        sum -= A[i * size + j] * x[j];
      }
    } else if (sum !== 0.0) {
      ii = i;
    }
    x[i] = sum;
  }
  //
  // Now, back substitution
  //
  for (i = size - 1; i >= 0; i--) {
    sum = x[i];
    for (j = i + 1; j < size; j++) {
      sum -= A[i * size + j] * x[j];
    }
    x[i] = sum / A[i * size + i];
  }
}
function solveLinearSystem(A, x, size) {
  // if we solving something simple, just solve it
  if (size === 2) {
    const y = createArray(2);
    const det = determinant2x2(A[0], A[1], A[2], A[3]);
    if (det === 0.0) {
      // Unable to solve linear system
      return 0;
    }
    y[0] = (A[3] * x[0] - A[1] * x[1]) / det;
    y[1] = (-(A[2] * x[0]) + A[0] * x[1]) / det;
    x[0] = y[0];
    x[1] = y[1];
    return 1;
  }
  if (size === 1) {
    if (A[0] === 0.0) {
      // Unable to solve linear system
      return 0;
    }
    x[0] /= A[0];
    return 1;
  }

  //
  // System of equations is not trivial, use Crout's method
  //

  // Check on allocation of working vectors
  const index = createArray(size);

  // Factor and solve matrix
  if (luFactorLinearSystem(A, index, size) === 0) {
    return 0;
  }
  luSolveLinearSystem(A, index, x, size);
  return 1;
}

// Note that A is modified during the inversion !
function invertMatrix(A, AI, size) {
  let index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  let column = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  const tmp1Size = index || createArray(size);
  const tmp2Size = column || createArray(size);

  // Factor matrix; then begin solving for inverse one column at a time.
  // Note: tmp1Size returned value is used later, tmp2Size is just working
  // memory whose values are not used in LUSolveLinearSystem
  if (luFactorLinearSystem(A, tmp1Size, size) === 0) {
    return null;
  }
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      tmp2Size[i] = 0.0;
    }
    tmp2Size[j] = 1.0;
    luSolveLinearSystem(A, tmp1Size, tmp2Size, size);
    for (let i = 0; i < size; i++) {
      AI[i * size + j] = tmp2Size[i];
    }
  }
  return AI;
}
function estimateMatrixCondition(A, size) {
  let minValue = +Number.MAX_VALUE;
  let maxValue = -Number.MAX_VALUE;

  // find the maximum value
  for (let i = 0; i < size; i++) {
    for (let j = i; j < size; j++) {
      if (Math.abs(A[i * size + j]) > maxValue) {
        maxValue = Math.abs(A[i * size + j]);
      }
    }
  }

  // find the minimum diagonal value
  for (let i = 0; i < size; i++) {
    if (Math.abs(A[i * size + i]) < minValue) {
      minValue = Math.abs(A[i * size + i]);
    }
  }
  if (minValue === 0.0) {
    return Number.MAX_VALUE;
  }
  return maxValue / minValue;
}
function jacobi(a_3x3, w, v) {
  return jacobiN(a_3x3, 3, w, v);
}
function solveHomogeneousLeastSquares(numberOfSamples, xt, xOrder, mt) {
  // check dimensional consistency
  if (numberOfSamples < xOrder) {
    vtkWarningMacro('Insufficient number of samples. Underdetermined.');
    return 0;
  }
  let i;
  let j;
  let k;

  // set up intermediate variables
  // Allocate matrix to hold X times transpose of X
  const XXt = createArray(xOrder * xOrder); // size x by x
  // Allocate the array of eigenvalues and eigenvectors
  const eigenvals = createArray(xOrder);
  const eigenvecs = createArray(xOrder * xOrder);

  // Calculate XXt upper half only, due to symmetry
  for (k = 0; k < numberOfSamples; k++) {
    for (i = 0; i < xOrder; i++) {
      for (j = i; j < xOrder; j++) {
        XXt[i * xOrder + j] += xt[k * xOrder + i] * xt[k * xOrder + j];
      }
    }
  }

  // now fill in the lower half of the XXt matrix
  for (i = 0; i < xOrder; i++) {
    for (j = 0; j < i; j++) {
      XXt[i * xOrder + j] = XXt[j * xOrder + i];
    }
  }

  // Compute the eigenvectors and eigenvalues
  jacobiN(XXt, xOrder, eigenvals, eigenvecs);

  // Smallest eigenval is at the end of the list (xOrder-1), and solution is
  // corresponding eigenvec.
  for (i = 0; i < xOrder; i++) {
    mt[i] = eigenvecs[i * xOrder + xOrder - 1];
  }
  return 1;
}
function solveLeastSquares(numberOfSamples, xt, xOrder, yt, yOrder, mt) {
  let checkHomogeneous = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : true;
  // check dimensional consistency
  if (numberOfSamples < xOrder || numberOfSamples < yOrder) {
    vtkWarningMacro('Insufficient number of samples. Underdetermined.');
    return 0;
  }
  const homogenFlags = createArray(yOrder);
  let allHomogeneous = 1;
  let hmt;
  let homogRC = 0;
  let i;
  let j;
  let k;
  let someHomogeneous = 0;

  // Ok, first init some flags check and see if all the systems are homogeneous
  if (checkHomogeneous) {
    // If Y' is zero, it's a homogeneous system and can't be solved via
    // the pseudoinverse method. Detect this case, warn the user, and
    // invoke SolveHomogeneousLeastSquares instead. Note that it doesn't
    // really make much sense for yOrder to be greater than one in this case,
    // since that's just yOrder occurrences of a 0 vector on the RHS, but
    // we allow it anyway. N

    // Initialize homogeneous flags on a per-right-hand-side basis
    for (j = 0; j < yOrder; j++) {
      homogenFlags[j] = 1;
    }
    for (i = 0; i < numberOfSamples; i++) {
      for (j = 0; j < yOrder; j++) {
        if (Math.abs(yt[i * yOrder + j]) > _Constants_js__WEBPACK_IMPORTED_MODULE_2__/* .VTK_SMALL_NUMBER */ .kP) {
          allHomogeneous = 0;
          homogenFlags[j] = 0;
        }
      }
    }

    // If we've got one system, and it's homogeneous, do it and bail out quickly.
    if (allHomogeneous && yOrder === 1) {
      vtkWarningMacro('Detected homogeneous system (Y=0), calling SolveHomogeneousLeastSquares()');
      return solveHomogeneousLeastSquares(numberOfSamples, xt, xOrder, mt);
    }

    // Ok, we've got more than one system of equations.
    // Figure out if we need to calculate the homogeneous equation solution for
    // any of them.
    if (allHomogeneous) {
      someHomogeneous = 1;
    } else {
      for (j = 0; j < yOrder; j++) {
        if (homogenFlags[j]) {
          someHomogeneous = 1;
        }
      }
    }
  }

  // If necessary, solve the homogeneous problem
  if (someHomogeneous) {
    // hmt is the homogeneous equation version of mt, the general solution.
    // hmt should be xOrder x yOrder, but since we are solving only the homogeneous part, here it is xOrder x 1
    hmt = createArray(xOrder);

    // Ok, solve the homogeneous problem
    homogRC = solveHomogeneousLeastSquares(numberOfSamples, xt, xOrder, hmt);
  }

  // set up intermediate variables
  const XXt = createArray(xOrder * xOrder); // size x by x
  const XXtI = createArray(xOrder * xOrder); // size x by x
  const XYt = createArray(xOrder * yOrder); // size x by y

  // first find the pseudoinverse matrix
  for (k = 0; k < numberOfSamples; k++) {
    for (i = 0; i < xOrder; i++) {
      // first calculate the XXt matrix, only do the upper half (symmetrical)
      for (j = i; j < xOrder; j++) {
        XXt[i * xOrder + j] += xt[k * xOrder + i] * xt[k * xOrder + j];
      }

      // now calculate the XYt matrix
      for (j = 0; j < yOrder; j++) {
        XYt[i * yOrder + j] += xt[k * xOrder + i] * yt[k * yOrder + j];
      }
    }
  }

  // now fill in the lower half of the XXt matrix
  for (i = 0; i < xOrder; i++) {
    for (j = 0; j < i; j++) {
      XXt[i * xOrder + j] = XXt[j * xOrder + i];
    }
  }
  const successFlag = invertMatrix(XXt, XXtI, xOrder);

  // next get the inverse of XXt
  if (successFlag) {
    for (i = 0; i < xOrder; i++) {
      for (j = 0; j < yOrder; j++) {
        mt[i * yOrder + j] = 0.0;
        for (k = 0; k < xOrder; k++) {
          mt[i * yOrder + j] += XXtI[i * xOrder + k] * XYt[k * yOrder + j];
        }
      }
    }
  }

  // Fix up any of the solutions that correspond to the homogeneous equation
  // problem.
  if (someHomogeneous) {
    for (j = 0; j < yOrder; j++) {
      if (homogenFlags[j]) {
        // Fix this one
        for (i = 0; i < xOrder; i++) {
          mt[i * yOrder + j] = hmt[i * yOrder];
        }
      }
    }
  }
  if (someHomogeneous) {
    return homogRC && successFlag;
  }
  return successFlag;
}
function hex2float(hexStr) {
  let outFloatArray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0.5, 1];
  switch (hexStr.length) {
    case 3:
      // abc => #aabbcc
      outFloatArray[0] = parseInt(hexStr[0], 16) * 17 / 255;
      outFloatArray[1] = parseInt(hexStr[1], 16) * 17 / 255;
      outFloatArray[2] = parseInt(hexStr[2], 16) * 17 / 255;
      return outFloatArray;
    case 4:
      // #abc => #aabbcc
      outFloatArray[0] = parseInt(hexStr[1], 16) * 17 / 255;
      outFloatArray[1] = parseInt(hexStr[2], 16) * 17 / 255;
      outFloatArray[2] = parseInt(hexStr[3], 16) * 17 / 255;
      return outFloatArray;
    case 6:
      // ab01df => #ab01df
      outFloatArray[0] = parseInt(hexStr.substr(0, 2), 16) / 255;
      outFloatArray[1] = parseInt(hexStr.substr(2, 2), 16) / 255;
      outFloatArray[2] = parseInt(hexStr.substr(4, 2), 16) / 255;
      return outFloatArray;
    case 7:
      // #ab01df
      outFloatArray[0] = parseInt(hexStr.substr(1, 2), 16) / 255;
      outFloatArray[1] = parseInt(hexStr.substr(3, 2), 16) / 255;
      outFloatArray[2] = parseInt(hexStr.substr(5, 2), 16) / 255;
      return outFloatArray;
    case 9:
      // #ab01df00
      outFloatArray[0] = parseInt(hexStr.substr(1, 2), 16) / 255;
      outFloatArray[1] = parseInt(hexStr.substr(3, 2), 16) / 255;
      outFloatArray[2] = parseInt(hexStr.substr(5, 2), 16) / 255;
      outFloatArray[3] = parseInt(hexStr.substr(7, 2), 16) / 255;
      return outFloatArray;
    default:
      return outFloatArray;
  }
}
function rgb2hsv(rgb, hsv) {
  let h;
  let s;
  const [r, g, b] = rgb;
  const onethird = 1.0 / 3.0;
  const onesixth = 1.0 / 6.0;
  const twothird = 2.0 / 3.0;
  let cmax = r;
  let cmin = r;
  if (g > cmax) {
    cmax = g;
  } else if (g < cmin) {
    cmin = g;
  }
  if (b > cmax) {
    cmax = b;
  } else if (b < cmin) {
    cmin = b;
  }
  const v = cmax;
  if (v > 0.0) {
    s = (cmax - cmin) / cmax;
  } else {
    s = 0.0;
  }
  if (s > 0) {
    if (r === cmax) {
      h = onesixth * (g - b) / (cmax - cmin);
    } else if (g === cmax) {
      h = onethird + onesixth * (b - r) / (cmax - cmin);
    } else {
      h = twothird + onesixth * (r - g) / (cmax - cmin);
    }
    if (h < 0.0) {
      h += 1.0;
    }
  } else {
    h = 0.0;
  }

  // Set the values back to the array
  hsv[0] = h;
  hsv[1] = s;
  hsv[2] = v;
}
function hsv2rgb(hsv, rgb) {
  const [h, s, v] = hsv;
  const onethird = 1.0 / 3.0;
  const onesixth = 1.0 / 6.0;
  const twothird = 2.0 / 3.0;
  const fivesixth = 5.0 / 6.0;
  let r;
  let g;
  let b;

  // compute RGB from HSV
  if (h > onesixth && h <= onethird) {
    // green/red
    g = 1.0;
    r = (onethird - h) / onesixth;
    b = 0.0;
  } else if (h > onethird && h <= 0.5) {
    // green/blue
    g = 1.0;
    b = (h - onethird) / onesixth;
    r = 0.0;
  } else if (h > 0.5 && h <= twothird) {
    // blue/green
    b = 1.0;
    g = (twothird - h) / onesixth;
    r = 0.0;
  } else if (h > twothird && h <= fivesixth) {
    // blue/red
    b = 1.0;
    r = (h - twothird) / onesixth;
    g = 0.0;
  } else if (h > fivesixth && h <= 1.0) {
    // red/blue
    r = 1.0;
    b = (1.0 - h) / onesixth;
    g = 0.0;
  } else {
    // red/green
    r = 1.0;
    g = h / onesixth;
    b = 0.0;
  }

  // add Saturation to the equation.
  r = s * r + (1.0 - s);
  g = s * g + (1.0 - s);
  b = s * b + (1.0 - s);
  r *= v;
  g *= v;
  b *= v;

  // Assign back to the array
  rgb[0] = r;
  rgb[1] = g;
  rgb[2] = b;
}
function lab2xyz(lab, xyz) {
  // LAB to XYZ
  const [L, a, b] = lab;
  let var_Y = (L + 16) / 116;
  let var_X = a / 500 + var_Y;
  let var_Z = var_Y - b / 200;
  if (var_Y ** 3 > 0.008856) {
    var_Y **= 3;
  } else {
    var_Y = (var_Y - 16.0 / 116.0) / 7.787;
  }
  if (var_X ** 3 > 0.008856) {
    var_X **= 3;
  } else {
    var_X = (var_X - 16.0 / 116.0) / 7.787;
  }
  if (var_Z ** 3 > 0.008856) {
    var_Z **= 3;
  } else {
    var_Z = (var_Z - 16.0 / 116.0) / 7.787;
  }
  const ref_X = 0.9505;
  const ref_Y = 1.0;
  const ref_Z = 1.089;
  xyz[0] = ref_X * var_X; // ref_X = 0.9505  Observer= 2 deg Illuminant= D65
  xyz[1] = ref_Y * var_Y; // ref_Y = 1.000
  xyz[2] = ref_Z * var_Z; // ref_Z = 1.089
}

function xyz2lab(xyz, lab) {
  const [x, y, z] = xyz;
  const ref_X = 0.9505;
  const ref_Y = 1.0;
  const ref_Z = 1.089;
  let var_X = x / ref_X; // ref_X = 0.9505  Observer= 2 deg, Illuminant= D65
  let var_Y = y / ref_Y; // ref_Y = 1.000
  let var_Z = z / ref_Z; // ref_Z = 1.089

  if (var_X > 0.008856) var_X **= 1.0 / 3.0;else var_X = 7.787 * var_X + 16.0 / 116.0;
  if (var_Y > 0.008856) var_Y **= 1.0 / 3.0;else var_Y = 7.787 * var_Y + 16.0 / 116.0;
  if (var_Z > 0.008856) var_Z **= 1.0 / 3.0;else var_Z = 7.787 * var_Z + 16.0 / 116.0;
  lab[0] = 116 * var_Y - 16;
  lab[1] = 500 * (var_X - var_Y);
  lab[2] = 200 * (var_Y - var_Z);
}
function xyz2rgb(xyz, rgb) {
  const [x, y, z] = xyz;
  let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let b = x * 0.0557 + y * -0.204 + z * 1.057;

  // The following performs a "gamma correction" specified by the sRGB color
  // space.  sRGB is defined by a canonical definition of a display monitor and
  // has been standardized by the International Electrotechnical Commission (IEC
  // 61966-2-1).  The nonlinearity of the correction is designed to make the
  // colors more perceptually uniform.  This color space has been adopted by
  // several applications including Adobe Photoshop and Microsoft Windows color
  // management.  OpenGL is agnostic on its RGB color space, but it is reasonable
  // to assume it is close to this one.
  if (r > 0.0031308) r = 1.055 * r ** (1 / 2.4) - 0.055;else r *= 12.92;
  if (g > 0.0031308) g = 1.055 * g ** (1 / 2.4) - 0.055;else g *= 12.92;
  if (b > 0.0031308) b = 1.055 * b ** (1 / 2.4) - 0.055;else b *= 12.92;

  // Clip colors. ideally we would do something that is perceptually closest
  // (since we can see colors outside of the display gamut), but this seems to
  // work well enough.
  let maxVal = r;
  if (maxVal < g) maxVal = g;
  if (maxVal < b) maxVal = b;
  if (maxVal > 1.0) {
    r /= maxVal;
    g /= maxVal;
    b /= maxVal;
  }
  if (r < 0) r = 0;
  if (g < 0) g = 0;
  if (b < 0) b = 0;

  // Push values back to array
  rgb[0] = r;
  rgb[1] = g;
  rgb[2] = b;
}
function rgb2xyz(rgb, xyz) {
  let [r, g, b] = rgb;
  // The following performs a "gamma correction" specified by the sRGB color
  // space.  sRGB is defined by a canonical definition of a display monitor and
  // has been standardized by the International Electrotechnical Commission (IEC
  // 61966-2-1).  The nonlinearity of the correction is designed to make the
  // colors more perceptually uniform.  This color space has been adopted by
  // several applications including Adobe Photoshop and Microsoft Windows color
  // management.  OpenGL is agnostic on its RGB color space, but it is reasonable
  // to assume it is close to this one.
  if (r > 0.04045) r = ((r + 0.055) / 1.055) ** 2.4;else r /= 12.92;
  if (g > 0.04045) g = ((g + 0.055) / 1.055) ** 2.4;else g /= 12.92;
  if (b > 0.04045) b = ((b + 0.055) / 1.055) ** 2.4;else b /= 12.92;

  // Observer. = 2 deg, Illuminant = D65
  xyz[0] = r * 0.4124 + g * 0.3576 + b * 0.1805;
  xyz[1] = r * 0.2126 + g * 0.7152 + b * 0.0722;
  xyz[2] = r * 0.0193 + g * 0.1192 + b * 0.9505;
}
function rgb2lab(rgb, lab) {
  const xyz = [0, 0, 0];
  rgb2xyz(rgb, xyz);
  xyz2lab(xyz, lab);
}
function lab2rgb(lab, rgb) {
  const xyz = [0, 0, 0];
  lab2xyz(lab, xyz);
  xyz2rgb(xyz, rgb);
}
function uninitializeBounds(bounds) {
  bounds[0] = 1.0;
  bounds[1] = -1.0;
  bounds[2] = 1.0;
  bounds[3] = -1.0;
  bounds[4] = 1.0;
  bounds[5] = -1.0;
  return bounds;
}
function areBoundsInitialized(bounds) {
  return !(bounds[1] - bounds[0] < 0.0);
}

/**
 * @deprecated please use vtkBoundingBox.addPoints(vtkBoundingBox.reset([]), points)
 */
function computeBoundsFromPoints(point1, point2, bounds) {
  bounds[0] = Math.min(point1[0], point2[0]);
  bounds[1] = Math.max(point1[0], point2[0]);
  bounds[2] = Math.min(point1[1], point2[1]);
  bounds[3] = Math.max(point1[1], point2[1]);
  bounds[4] = Math.min(point1[2], point2[2]);
  bounds[5] = Math.max(point1[2], point2[2]);
  return bounds;
}
function clampValue(value, minValue, maxValue) {
  if (value < minValue) {
    return minValue;
  }
  if (value > maxValue) {
    return maxValue;
  }
  return value;
}
function clampVector(vector, minVector, maxVector) {
  let out = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [0, 0, 0];
  out[0] = clampValue(vector[0], minVector[0], maxVector[0]);
  out[1] = clampValue(vector[1], minVector[1], maxVector[1]);
  out[2] = clampValue(vector[2], minVector[2], maxVector[2]);
  return out;
}
function clampAndNormalizeValue(value, range) {
  let result = 0;
  if (range[0] !== range[1]) {
    // clamp
    if (value < range[0]) {
      result = range[0];
    } else if (value > range[1]) {
      result = range[1];
    } else {
      result = value;
    }
    // normalize
    result = (result - range[0]) / (range[1] - range[0]);
  }
  return result;
}
const getScalarTypeFittingRange = notImplemented('GetScalarTypeFittingRange');
const getAdjustedScalarRange = notImplemented('GetAdjustedScalarRange');
function extentIsWithinOtherExtent(extent1, extent2) {
  if (!extent1 || !extent2) {
    return 0;
  }
  for (let i = 0; i < 6; i += 2) {
    if (extent1[i] < extent2[i] || extent1[i] > extent2[i + 1] || extent1[i + 1] < extent2[i] || extent1[i + 1] > extent2[i + 1]) {
      return 0;
    }
  }
  return 1;
}
function boundsIsWithinOtherBounds(bounds1_6, bounds2_6, delta_3) {
  if (!bounds1_6 || !bounds2_6) {
    return 0;
  }
  for (let i = 0; i < 6; i += 2) {
    if (bounds1_6[i] + delta_3[i / 2] < bounds2_6[i] || bounds1_6[i] - delta_3[i / 2] > bounds2_6[i + 1] || bounds1_6[i + 1] + delta_3[i / 2] < bounds2_6[i] || bounds1_6[i + 1] - delta_3[i / 2] > bounds2_6[i + 1]) {
      return 0;
    }
  }
  return 1;
}
function pointIsWithinBounds(point_3, bounds_6, delta_3) {
  if (!point_3 || !bounds_6 || !delta_3) {
    return 0;
  }
  for (let i = 0; i < 3; i++) {
    if (point_3[i] + delta_3[i] < bounds_6[2 * i] || point_3[i] - delta_3[i] > bounds_6[2 * i + 1]) {
      return 0;
    }
  }
  return 1;
}
function solve3PointCircle(p1, p2, p3, center) {
  const v21 = createArray(3);
  const v32 = createArray(3);
  const v13 = createArray(3);
  const v12 = createArray(3);
  const v23 = createArray(3);
  const v31 = createArray(3);
  for (let i = 0; i < 3; ++i) {
    v21[i] = p1[i] - p2[i];
    v32[i] = p2[i] - p3[i];
    v13[i] = p3[i] - p1[i];
    v12[i] = -v21[i];
    v23[i] = -v32[i];
    v31[i] = -v13[i];
  }
  const norm12 = norm(v12);
  const norm23 = norm(v23);
  const norm13 = norm(v13);
  const crossv21v32 = createArray(3);
  cross(v21, v32, crossv21v32);
  const normCross = norm(crossv21v32);
  const radius = norm12 * norm23 * norm13 / (2 * normCross);
  const normCross22 = 2 * normCross * normCross;
  const alpha = norm23 * norm23 * dot(v21, v31) / normCross22;
  const beta = norm13 * norm13 * dot(v12, v32) / normCross22;
  const gamma = norm12 * norm12 * dot(v13, v23) / normCross22;
  for (let i = 0; i < 3; ++i) {
    center[i] = alpha * p1[i] + beta * p2[i] + gamma * p3[i];
  }
  return radius;
}
const inf = Infinity;
const negInf = -Infinity;
const isInf = value => !Number.isFinite(value);
const {
  isFinite,
  isNaN
} = Number;
const isNan = isNaN;

// JavaScript - add-on ----------------------

function createUninitializedBounds() {
  return [].concat([Number.MAX_VALUE, -Number.MAX_VALUE,
  // X
  Number.MAX_VALUE, -Number.MAX_VALUE,
  // Y
  Number.MAX_VALUE, -Number.MAX_VALUE // Z
  ]);
}

function getMajorAxisIndex(vector) {
  let maxValue = -1;
  let axisIndex = -1;
  for (let i = 0; i < vector.length; i++) {
    const value = Math.abs(vector[i]);
    if (value > maxValue) {
      axisIndex = i;
      maxValue = value;
    }
  }
  return axisIndex;
}

// Return the closest orthogonal matrix of 1, -1 and 0
// It works for both column major and row major matrices
// This function iteratively associate a column with a row by choosing
// the greatest absolute value from the remaining row and columns
// For each association, a -1 or a 1 is set in the output, depending on
// the sign of the value in the original matrix
function getSparseOrthogonalMatrix(matrix) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  // Initialize rows and columns to available indices
  const rows = new Array(n);
  const cols = new Array(n);
  for (let i = 0; i < n; ++i) {
    rows[i] = i;
    cols[i] = i;
  }
  // No need for the last iteration: i = 0
  for (let i = n - 1; i > 0; i--) {
    // Loop invariant:
    // rows[0:i] and cols[0:i] contain the remaining rows and columns
    // rows]i:n[ and cols]i:n[ contain the associations found (rows[k] is associated with cols[k])
    let bestValue = -Infinity;
    let bestRowI = 0;
    let bestColI = 0;
    for (let rowI = 0; rowI <= i; ++rowI) {
      const row = rows[rowI];
      for (let colI = 0; colI <= i; ++colI) {
        const col = cols[colI];
        const absVal = Math.abs(matrix[row + n * col]);
        if (absVal > bestValue) {
          bestValue = absVal;
          bestRowI = rowI;
          bestColI = colI;
        }
      }
    }
    // Found an association between rows[bestRowI] and cols[bestColI]
    // Put both at the end of their array by swapping with i
    [rows[i], rows[bestRowI]] = [rows[bestRowI], rows[i]];
    [cols[i], cols[bestColI]] = [cols[bestColI], cols[i]];
  }

  // Convert row/column association to a matrix
  const output = new Array(n * n).fill(0);
  for (let i = 0; i < n; ++i) {
    const matIdx = rows[i] + n * cols[i];
    output[matIdx] = matrix[matIdx] < 0 ? -1 : 1;
  }
  return output;
}
function floatToHex2(value) {
  const integer = Math.floor(value * 255);
  if (integer > 15) {
    return integer.toString(16);
  }
  return `0${integer.toString(16)}`;
}
function floatRGB2HexCode(rgbArray) {
  let prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '#';
  return `${prefix}${rgbArray.map(floatToHex2).join('')}`;
}
function floatToChar(f) {
  return Math.round(f * 255);
}
function float2CssRGBA(rgbArray) {
  if (rgbArray.length === 3) {
    return `rgb(${rgbArray.map(floatToChar).join(', ')})`;
  }
  return `rgba(${floatToChar(rgbArray[0] || 0)}, ${floatToChar(rgbArray[1] || 0)}, ${floatToChar(rgbArray[2] || 0)}, ${rgbArray[3] || 0})`;
}

// ----------------------------------------------------------------------------
// Only Static API
// ----------------------------------------------------------------------------

var vtkMath = {
  Pi,
  ldexp,
  radiansFromDegrees,
  degreesFromRadians,
  round,
  floor,
  ceil,
  ceilLog2,
  min,
  max,
  arrayMin,
  arrayMax,
  arrayRange,
  isPowerOfTwo,
  nearestPowerOfTwo,
  factorial,
  binomial,
  beginCombination,
  nextCombination,
  randomSeed,
  getSeed,
  random,
  gaussian,
  add,
  subtract,
  multiplyScalar,
  multiplyScalar2D,
  multiplyAccumulate,
  multiplyAccumulate2D,
  dot,
  outer,
  cross,
  norm,
  normalize,
  perpendiculars,
  projectVector,
  projectVector2D,
  distance2BetweenPoints,
  angleBetweenVectors,
  gaussianAmplitude,
  gaussianWeight,
  dot2D,
  outer2D,
  norm2D,
  normalize2D,
  determinant2x2,
  LUFactor3x3,
  LUSolve3x3,
  linearSolve3x3,
  multiply3x3_vect3,
  multiply3x3_mat3,
  multiplyMatrix,
  transpose3x3,
  invert3x3,
  identity3x3,
  identity,
  isIdentity,
  isIdentity3x3,
  determinant3x3,
  quaternionToMatrix3x3,
  areEquals,
  areMatricesEqual,
  roundNumber,
  roundVector,
  matrix3x3ToQuaternion,
  multiplyQuaternion,
  orthogonalize3x3,
  diagonalize3x3,
  singularValueDecomposition3x3,
  solveLinearSystem,
  invertMatrix,
  luFactorLinearSystem,
  luSolveLinearSystem,
  estimateMatrixCondition,
  jacobi,
  jacobiN,
  solveHomogeneousLeastSquares,
  solveLeastSquares,
  hex2float,
  rgb2hsv,
  hsv2rgb,
  lab2xyz,
  xyz2lab,
  xyz2rgb,
  rgb2xyz,
  rgb2lab,
  lab2rgb,
  uninitializeBounds,
  areBoundsInitialized,
  computeBoundsFromPoints,
  clampValue,
  clampVector,
  clampAndNormalizeValue,
  getScalarTypeFittingRange,
  getAdjustedScalarRange,
  extentIsWithinOtherExtent,
  boundsIsWithinOtherBounds,
  pointIsWithinBounds,
  solve3PointCircle,
  inf,
  negInf,
  isInf,
  isNan: isNaN,
  isNaN,
  isFinite,
  // JS add-on
  createUninitializedBounds,
  getMajorAxisIndex,
  getSparseOrthogonalMatrix,
  floatToHex2,
  floatRGB2HexCode,
  float2CssRGBA
};

var vtkMath$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  createArray: createArray,
  Pi: Pi,
  ldexp: ldexp,
  radiansFromDegrees: radiansFromDegrees,
  degreesFromRadians: degreesFromRadians,
  round: round,
  floor: floor,
  ceil: ceil,
  min: min,
  max: max,
  arrayMin: arrayMin,
  arrayMax: arrayMax,
  arrayRange: arrayRange,
  ceilLog2: ceilLog2,
  factorial: factorial,
  nearestPowerOfTwo: nearestPowerOfTwo,
  isPowerOfTwo: isPowerOfTwo,
  binomial: binomial,
  beginCombination: beginCombination,
  nextCombination: nextCombination,
  randomSeed: randomSeed,
  getSeed: getSeed,
  random: random,
  gaussian: gaussian,
  add: add,
  subtract: subtract,
  multiplyScalar: multiplyScalar,
  multiplyScalar2D: multiplyScalar2D,
  multiplyAccumulate: multiplyAccumulate,
  multiplyAccumulate2D: multiplyAccumulate2D,
  dot: dot,
  outer: outer,
  cross: cross,
  norm: norm,
  normalize: normalize,
  perpendiculars: perpendiculars,
  projectVector: projectVector,
  dot2D: dot2D,
  projectVector2D: projectVector2D,
  distance2BetweenPoints: distance2BetweenPoints,
  angleBetweenVectors: angleBetweenVectors,
  signedAngleBetweenVectors: signedAngleBetweenVectors,
  gaussianAmplitude: gaussianAmplitude,
  gaussianWeight: gaussianWeight,
  outer2D: outer2D,
  norm2D: norm2D,
  normalize2D: normalize2D,
  rowsToMat4: rowsToMat4,
  columnsToMat4: columnsToMat4,
  rowsToMat3: rowsToMat3,
  columnsToMat3: columnsToMat3,
  determinant2x2: determinant2x2,
  LUFactor3x3: LUFactor3x3,
  LUSolve3x3: LUSolve3x3,
  linearSolve3x3: linearSolve3x3,
  multiply3x3_vect3: multiply3x3_vect3,
  multiply3x3_mat3: multiply3x3_mat3,
  multiplyMatrix: multiplyMatrix,
  transpose3x3: transpose3x3,
  invert3x3: invert3x3,
  determinant3x3: determinant3x3,
  areEquals: areEquals,
  areMatricesEqual: areMatricesEqual,
  identity3x3: identity3x3,
  identity: identity,
  isIdentity: isIdentity,
  isIdentity3x3: isIdentity3x3,
  quaternionToMatrix3x3: quaternionToMatrix3x3,
  roundNumber: roundNumber,
  roundVector: roundVector,
  jacobiN: jacobiN,
  matrix3x3ToQuaternion: matrix3x3ToQuaternion,
  multiplyQuaternion: multiplyQuaternion,
  orthogonalize3x3: orthogonalize3x3,
  diagonalize3x3: diagonalize3x3,
  singularValueDecomposition3x3: singularValueDecomposition3x3,
  luFactorLinearSystem: luFactorLinearSystem,
  luSolveLinearSystem: luSolveLinearSystem,
  solveLinearSystem: solveLinearSystem,
  invertMatrix: invertMatrix,
  estimateMatrixCondition: estimateMatrixCondition,
  jacobi: jacobi,
  solveHomogeneousLeastSquares: solveHomogeneousLeastSquares,
  solveLeastSquares: solveLeastSquares,
  hex2float: hex2float,
  rgb2hsv: rgb2hsv,
  hsv2rgb: hsv2rgb,
  lab2xyz: lab2xyz,
  xyz2lab: xyz2lab,
  xyz2rgb: xyz2rgb,
  rgb2xyz: rgb2xyz,
  rgb2lab: rgb2lab,
  lab2rgb: lab2rgb,
  uninitializeBounds: uninitializeBounds,
  areBoundsInitialized: areBoundsInitialized,
  computeBoundsFromPoints: computeBoundsFromPoints,
  clampValue: clampValue,
  clampVector: clampVector,
  clampAndNormalizeValue: clampAndNormalizeValue,
  getScalarTypeFittingRange: getScalarTypeFittingRange,
  getAdjustedScalarRange: getAdjustedScalarRange,
  extentIsWithinOtherExtent: extentIsWithinOtherExtent,
  boundsIsWithinOtherBounds: boundsIsWithinOtherBounds,
  pointIsWithinBounds: pointIsWithinBounds,
  solve3PointCircle: solve3PointCircle,
  inf: inf,
  negInf: negInf,
  isInf: isInf,
  isFinite: isFinite,
  isNaN: isNaN,
  isNan: isNan,
  createUninitializedBounds: createUninitializedBounds,
  getMajorAxisIndex: getMajorAxisIndex,
  getSparseOrthogonalMatrix: getSparseOrthogonalMatrix,
  floatToHex2: floatToHex2,
  floatRGB2HexCode: floatRGB2HexCode,
  float2CssRGBA: float2CssRGBA,
  'default': vtkMath
});




/***/ }),

/***/ 62612:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

"use strict";
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

/***/ 28906:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ newTypedArray),
/* harmony export */   b: () => (/* binding */ newTypedArrayFrom),
/* harmony export */   c: () => (/* binding */ macro$1),
/* harmony export */   m: () => (/* binding */ macro),
/* harmony export */   n: () => (/* binding */ newInstance),
/* harmony export */   o: () => (/* binding */ obj),
/* harmony export */   s: () => (/* binding */ set)
/* harmony export */ });
/* unused harmony exports A, B, C, D, E, F, G, H, I, J, K, L, M, T, V, _, d, e, f, g, h, i, j, k, l, p, q, r, t, u, v, w, x, y, z */
/* harmony import */ var fast_deep_equal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(45043);
/* harmony import */ var fast_deep_equal__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fast_deep_equal__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _vtk_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(42852);
/* harmony import */ var _Common_Core_ClassHierarchy_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(44302);




/**
 * macros.js is the old macro.js.
 * The name change is so we do not get eaten by babel-plugin-macros.
 */
let globalMTime = 0;
const VOID = Symbol('void');
function getCurrentGlobalMTime() {
  return globalMTime;
}

// ----------------------------------------------------------------------------
// Logging function calls
// ----------------------------------------------------------------------------
/* eslint-disable no-prototype-builtins                                      */

const fakeConsole = {};
function noOp() {}
const consoleMethods = ['log', 'debug', 'info', 'warn', 'error', 'time', 'timeEnd', 'group', 'groupEnd'];
consoleMethods.forEach(methodName => {
  fakeConsole[methodName] = noOp;
});
_vtk_js__WEBPACK_IMPORTED_MODULE_1__/* .vtkGlobal */ .n.console = console.hasOwnProperty('log') ? console : fakeConsole;
const loggerFunctions = {
  debug: noOp,
  // Don't print debug by default
  error: _vtk_js__WEBPACK_IMPORTED_MODULE_1__/* .vtkGlobal */ .n.console.error || noOp,
  info: _vtk_js__WEBPACK_IMPORTED_MODULE_1__/* .vtkGlobal */ .n.console.info || noOp,
  log: _vtk_js__WEBPACK_IMPORTED_MODULE_1__/* .vtkGlobal */ .n.console.log || noOp,
  warn: _vtk_js__WEBPACK_IMPORTED_MODULE_1__/* .vtkGlobal */ .n.console.warn || noOp
};
function setLoggerFunction(name, fn) {
  if (loggerFunctions[name]) {
    loggerFunctions[name] = fn || noOp;
  }
}
function vtkLogMacro() {
  loggerFunctions.log(...arguments);
}
function vtkInfoMacro() {
  loggerFunctions.info(...arguments);
}
function vtkDebugMacro() {
  loggerFunctions.debug(...arguments);
}
function vtkErrorMacro() {
  loggerFunctions.error(...arguments);
}
function vtkWarningMacro() {
  loggerFunctions.warn(...arguments);
}
const ERROR_ONCE_MAP = {};
function vtkOnceErrorMacro(str) {
  if (!ERROR_ONCE_MAP[str]) {
    loggerFunctions.error(str);
    ERROR_ONCE_MAP[str] = true;
  }
}

// ----------------------------------------------------------------------------
// TypedArray
// ----------------------------------------------------------------------------

const TYPED_ARRAYS = Object.create(null);
TYPED_ARRAYS.Float32Array = Float32Array;
TYPED_ARRAYS.Float64Array = Float64Array;
TYPED_ARRAYS.Uint8Array = Uint8Array;
TYPED_ARRAYS.Int8Array = Int8Array;
TYPED_ARRAYS.Uint16Array = Uint16Array;
TYPED_ARRAYS.Int16Array = Int16Array;
TYPED_ARRAYS.Uint32Array = Uint32Array;
TYPED_ARRAYS.Int32Array = Int32Array;
TYPED_ARRAYS.Uint8ClampedArray = Uint8ClampedArray;
try {
  TYPED_ARRAYS.BigInt64Array = BigInt64Array;
  TYPED_ARRAYS.BigUint64Array = BigUint64Array;
} catch {
  // ignore
}
function newTypedArray(type) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  return new (TYPED_ARRAYS[type] || Float64Array)(...args);
}
function newTypedArrayFrom(type) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }
  return (TYPED_ARRAYS[type] || Float64Array).from(...args);
}

// ----------------------------------------------------------------------------
// capitilize provided string
// ----------------------------------------------------------------------------

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function _capitalize(str) {
  return capitalize(str[0] === '_' ? str.slice(1) : str);
}
function uncapitalize(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

// ----------------------------------------------------------------------------
// Convert byte size into a well formatted string
// ----------------------------------------------------------------------------

function formatBytesToProperUnit(size) {
  let precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  let chunkSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
  const units = ['TB', 'GB', 'MB', 'KB'];
  let value = Number(size);
  let currentUnit = 'B';
  while (value > chunkSize) {
    value /= chunkSize;
    currentUnit = units.pop();
  }
  return `${value.toFixed(precision)} ${currentUnit}`;
}

// ----------------------------------------------------------------------------
// Convert thousand number with proper separator
// ----------------------------------------------------------------------------

function formatNumbersWithThousandSeparator(n) {
  let separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ' ';
  const sections = [];
  let size = n;
  while (size > 1000) {
    sections.push(`000${size % 1000}`.slice(-3));
    size = Math.floor(size / 1000);
  }
  if (size > 0) {
    sections.push(size);
  }
  sections.reverse();
  return sections.join(separator);
}

// ----------------------------------------------------------------------------
// Array helper
// ----------------------------------------------------------------------------

function safeArrays(model) {
  Object.keys(model).forEach(key => {
    if (Array.isArray(model[key])) {
      model[key] = [].concat(model[key]);
    }
  });
}
function isTypedArray(value) {
  return Object.values(TYPED_ARRAYS).some(ctor => value instanceof ctor);
}

// ----------------------------------------------------------------------------
// shallow equals
// ----------------------------------------------------------------------------

function shallowEquals(a, b) {
  if (a === b) {
    return true;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
  return false;
}

// ----------------------------------------------------------------------------

function enumToString(e, value) {
  return Object.keys(e).find(key => e[key] === value);
}
function getStateArrayMapFunc(item) {
  if (item && item.isA) {
    return item.getState();
  }
  return item;
}

// ----------------------------------------------------------------------------
// setImmediate
// ----------------------------------------------------------------------------

function setImmediateVTK(fn) {
  setTimeout(fn, 0);
}

// ----------------------------------------------------------------------------
// measurePromiseExecution
//
// Measures the time it takes for a promise to finish from
//   the time this function is invoked.
// The callback receives the time it took for the promise to resolve or reject.
// ----------------------------------------------------------------------------

function measurePromiseExecution(promise, callback) {
  const start = performance.now();
  promise.finally(() => {
    const delta = performance.now() - start;
    callback(delta);
  });
}

// ----------------------------------------------------------------------------
// vtkObject: modified(), onModified(callback), delete()
// ----------------------------------------------------------------------------

function obj() {
  let publicAPI = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let model = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // Ensure each instance as a unique ref of array
  safeArrays(model);
  const callbacks = [];
  if (!Number.isInteger(model.mtime)) {
    model.mtime = ++globalMTime;
  }
  if (!('classHierarchy' in model)) {
    model.classHierarchy = new _Common_Core_ClassHierarchy_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A('vtkObject');
  } else if (!(model.classHierarchy instanceof _Common_Core_ClassHierarchy_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)) {
    const hierarchy = new _Common_Core_ClassHierarchy_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A();
    for (let i = 0; i < model.classHierarchy.length; i++) {
      hierarchy.push(model.classHierarchy[i]);
    }
    model.classHierarchy = hierarchy;
  }
  function off(index) {
    callbacks[index] = null;
  }
  function on(index) {
    function unsubscribe() {
      off(index);
    }
    return Object.freeze({
      unsubscribe
    });
  }
  publicAPI.isDeleted = () => !!model.deleted;
  publicAPI.modified = otherMTime => {
    if (model.deleted) {
      vtkErrorMacro('instance deleted - cannot call any method');
      return;
    }
    if (otherMTime && otherMTime < publicAPI.getMTime()) {
      return;
    }
    model.mtime = ++globalMTime;
    callbacks.forEach(callback => callback && callback(publicAPI));
  };
  publicAPI.onModified = callback => {
    if (model.deleted) {
      vtkErrorMacro('instance deleted - cannot call any method');
      return null;
    }
    const index = callbacks.length;
    callbacks.push(callback);
    return on(index);
  };
  publicAPI.getMTime = () => model.mtime;
  publicAPI.isA = className => {
    let count = model.classHierarchy.length;
    // we go backwards as that is more likely for
    // early termination
    while (count--) {
      if (model.classHierarchy[count] === className) {
        return true;
      }
    }
    return false;
  };
  publicAPI.getClassName = function () {
    let depth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return model.classHierarchy[model.classHierarchy.length - 1 - depth];
  };
  publicAPI.set = function () {
    let map = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let noWarning = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let noFunction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    let ret = false;
    Object.keys(map).forEach(name => {
      const fn = noFunction ? null : publicAPI[`set${capitalize(name)}`];
      if (fn && Array.isArray(map[name]) && fn.length > 1) {
        ret = fn(...map[name]) || ret;
      } else if (fn) {
        ret = fn(map[name]) || ret;
      } else {
        // Set data on model directly
        if (['mtime'].indexOf(name) === -1 && !noWarning) {
          vtkWarningMacro(`Warning: Set value to model directly ${name}, ${map[name]}`);
        }
        ret = model[name] !== map[name] || ret;
        model[name] = map[name];
      }
    });
    return ret;
  };
  publicAPI.get = function () {
    for (var _len3 = arguments.length, list = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      list[_key3] = arguments[_key3];
    }
    if (!list.length) {
      return model;
    }
    const subset = {};
    list.forEach(name => {
      subset[name] = model[name];
    });
    return subset;
  };
  publicAPI.getReferenceByName = val => model[val];
  publicAPI.delete = () => {
    Object.keys(model).forEach(field => delete model[field]);
    callbacks.forEach((el, index) => off(index));

    // Flag the instance being deleted
    model.deleted = true;
  };

  // Add serialization support
  publicAPI.getState = () => {
    if (model.deleted) {
      return null;
    }
    const jsonArchive = {
      ...model,
      vtkClass: publicAPI.getClassName()
    };

    // Convert every vtkObject to its serializable form
    Object.keys(jsonArchive).forEach(keyName => {
      if (jsonArchive[keyName] === null || jsonArchive[keyName] === undefined || keyName[0] === '_' // protected members start with _
      ) {
        delete jsonArchive[keyName];
      } else if (jsonArchive[keyName].isA) {
        jsonArchive[keyName] = jsonArchive[keyName].getState();
      } else if (Array.isArray(jsonArchive[keyName])) {
        jsonArchive[keyName] = jsonArchive[keyName].map(getStateArrayMapFunc);
      } else if (isTypedArray(jsonArchive[keyName])) {
        jsonArchive[keyName] = Array.from(jsonArchive[keyName]);
      }
    });

    // Sort resulting object by key name
    const sortedObj = {};
    Object.keys(jsonArchive).sort().forEach(name => {
      sortedObj[name] = jsonArchive[name];
    });

    // Remove mtime
    if (sortedObj.mtime) {
      delete sortedObj.mtime;
    }
    return sortedObj;
  };

  // Add shallowCopy(otherInstance) support
  publicAPI.shallowCopy = function (other) {
    let debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (other.getClassName() !== publicAPI.getClassName()) {
      throw new Error(`Cannot ShallowCopy ${other.getClassName()} into ${publicAPI.getClassName()}`);
    }
    const otherModel = other.get();
    const keyList = Object.keys(model).sort();
    const otherKeyList = Object.keys(otherModel).sort();
    otherKeyList.forEach(key => {
      const keyIdx = keyList.indexOf(key);
      if (keyIdx === -1) {
        if (debug) {
          vtkDebugMacro(`add ${key} in shallowCopy`);
        }
      } else {
        keyList.splice(keyIdx, 1);
      }
      model[key] = otherModel[key];
    });
    if (keyList.length && debug) {
      vtkDebugMacro(`Untouched keys: ${keyList.join(', ')}`);
    }
    publicAPI.modified();
  };

  // This function will get called when one invoke JSON.stringify(vtkObject)
  // JSON.stringify will only stringify the return value of this function
  publicAPI.toJSON = function vtkObjToJSON() {
    return publicAPI.getState();
  };

  // Allow usage as decorator
  return publicAPI;
}

// ----------------------------------------------------------------------------
// getXXX: add getters
// ----------------------------------------------------------------------------

const objectGetterMap = {
  object(publicAPI, model, field) {
    return function getter() {
      return {
        ...model[field.name]
      };
    };
  }
};
function get(publicAPI, model, fieldNames) {
  fieldNames.forEach(field => {
    if (typeof field === 'object') {
      const getter = objectGetterMap[field.type];
      if (getter) {
        publicAPI[`get${_capitalize(field.name)}`] = getter(publicAPI, model, field);
      } else {
        publicAPI[`get${_capitalize(field.name)}`] = () => model[field.name];
      }
    } else {
      publicAPI[`get${_capitalize(field)}`] = () => model[field];
    }
  });
}

// ----------------------------------------------------------------------------
// setXXX: add setters
// ----------------------------------------------------------------------------

const objectSetterMap = {
  enum(publicAPI, model, field) {
    const onChanged = `_on${_capitalize(field.name)}Changed`;
    return value => {
      if (typeof value === 'string') {
        if (field.enum[value] !== undefined) {
          if (model[field.name] !== field.enum[value]) {
            model[field.name] = field.enum[value];
            publicAPI.modified();
            return true;
          }
          return false;
        }
        vtkErrorMacro(`Set Enum with invalid argument ${field}, ${value}`);
        throw new RangeError('Set Enum with invalid string argument');
      }
      if (typeof value === 'number') {
        if (model[field.name] !== value) {
          if (Object.keys(field.enum).map(key => field.enum[key]).indexOf(value) !== -1) {
            const previousValue = model[field.name];
            model[field.name] = value;
            model[onChanged]?.(publicAPI, model, value, previousValue);
            publicAPI.modified();
            return true;
          }
          vtkErrorMacro(`Set Enum outside numeric range ${field}, ${value}`);
          throw new RangeError('Set Enum outside numeric range');
        }
        return false;
      }
      vtkErrorMacro(`Set Enum with invalid argument (String/Number) ${field}, ${value}`);
      throw new TypeError('Set Enum with invalid argument (String/Number)');
    };
  },
  object(publicAPI, model, field) {
    if (field.params?.length === 1) {
      vtkWarningMacro('Setter of type "object" with a single "param" field is not supported');
    }
    const onChanged = `_on${_capitalize(field.name)}Changed`;
    return function () {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      let value;
      if (args.length > 1 && field.params?.length) {
        value = field.params.reduce((acc, prop, idx) => Object.assign(acc, {
          [prop]: args[idx]
        }), {});
      } else {
        value = args[0];
      }
      if (!fast_deep_equal__WEBPACK_IMPORTED_MODULE_0___default()(model[field.name], value)) {
        const previousValue = model[field.name];
        model[field.name] = value;
        model[onChanged]?.(publicAPI, model, value, previousValue);
        publicAPI.modified();
        return true;
      }
      return false;
    };
  }
};
function findSetter(field) {
  if (typeof field === 'object') {
    const fn = objectSetterMap[field.type];
    if (fn) {
      return (publicAPI, model) => fn(publicAPI, model, field);
    }
    vtkErrorMacro(`No setter for field ${field}`);
    throw new TypeError('No setter for field');
  }
  return function getSetter(publicAPI, model) {
    const onChanged = `_on${_capitalize(field)}Changed`;
    return function setter(value) {
      if (model.deleted) {
        vtkErrorMacro('instance deleted - cannot call any method');
        return false;
      }
      if (model[field] !== value) {
        const previousValue = model[field.name];
        model[field] = value;
        model[onChanged]?.(publicAPI, model, value, previousValue);
        publicAPI.modified();
        return true;
      }
      return false;
    };
  };
}
function set(publicAPI, model, fields) {
  fields.forEach(field => {
    if (typeof field === 'object') {
      publicAPI[`set${_capitalize(field.name)}`] = findSetter(field)(publicAPI, model);
    } else {
      publicAPI[`set${_capitalize(field)}`] = findSetter(field)(publicAPI, model);
    }
  });
}

// ----------------------------------------------------------------------------
// set/get XXX: add both setters and getters
// ----------------------------------------------------------------------------

function setGet(publicAPI, model, fieldNames) {
  get(publicAPI, model, fieldNames);
  set(publicAPI, model, fieldNames);
}

// ----------------------------------------------------------------------------
// getXXX: add getters for object of type array with copy to be safe
// getXXXByReference: add getters for object of type array without copy
// ----------------------------------------------------------------------------

function getArray(publicAPI, model, fieldNames) {
  fieldNames.forEach(field => {
    publicAPI[`get${_capitalize(field)}`] = () => model[field] ? Array.from(model[field]) : model[field];
    publicAPI[`get${_capitalize(field)}ByReference`] = () => model[field];
  });
}

// ----------------------------------------------------------------------------
// setXXX: add setter for object of type array
// if 'defaultVal' is supplied, shorter arrays will be padded to 'size' with 'defaultVal'
// set...From: fast path to copy the content of an array to the current one without call to modified.
// ----------------------------------------------------------------------------

function setArray(publicAPI, model, fieldNames, size) {
  let defaultVal = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
  fieldNames.forEach(field => {
    if (model[field] && size && model[field].length !== size) {
      throw new RangeError(`Invalid initial number of values for array (${field})`);
    }
    const onChanged = `_on${_capitalize(field)}Changed`;
    publicAPI[`set${_capitalize(field)}`] = function () {
      if (model.deleted) {
        vtkErrorMacro('instance deleted - cannot call any method');
        return false;
      }
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }
      let array = args;
      let changeDetected;
      let needCopy = false;
      // allow null or an array to be passed as a single arg.
      if (array.length === 1 && (array[0] == null || array[0].length >= 0)) {
        /* eslint-disable prefer-destructuring */
        array = array[0];
        /* eslint-enable prefer-destructuring */
        needCopy = true;
      }
      if (array == null) {
        changeDetected = model[field] !== array;
      } else {
        if (size && array.length !== size) {
          if (array.length < size && defaultVal !== undefined) {
            array = Array.from(array);
            needCopy = false;
            while (array.length < size) array.push(defaultVal);
          } else {
            throw new RangeError(`Invalid number of values for array setter (${field})`);
          }
        }
        changeDetected = model[field] == null || model[field].length !== array.length;
        for (let i = 0; !changeDetected && i < array.length; ++i) {
          changeDetected = model[field][i] !== array[i];
        }
        if (changeDetected && needCopy) {
          array = Array.from(array);
        }
      }
      if (changeDetected) {
        const previousValue = model[field.name];
        model[field] = array;
        model[onChanged]?.(publicAPI, model, array, previousValue);
        publicAPI.modified();
      }
      return changeDetected;
    };
    publicAPI[`set${_capitalize(field)}From`] = otherArray => {
      const target = model[field];
      otherArray.forEach((v, i) => {
        target[i] = v;
      });
    };
  });
}

// ----------------------------------------------------------------------------
// set/get XXX: add setter and getter for object of type array
// ----------------------------------------------------------------------------

function setGetArray(publicAPI, model, fieldNames, size) {
  let defaultVal = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
  getArray(publicAPI, model, fieldNames);
  setArray(publicAPI, model, fieldNames, size, defaultVal);
}
function moveToProtected(publicAPI, model, fieldNames) {
  for (let i = 0; i < fieldNames.length; i++) {
    const fieldName = fieldNames[i];
    if (model[fieldName] !== undefined) {
      model[`_${fieldName}`] = model[fieldName];
      delete model[fieldName];
    }
  }
}
// ----------------------------------------------------------------------------
// vtkAlgorithm: setInputData(), setInputConnection(), getOutputData(), getOutputPort()
// ----------------------------------------------------------------------------

function algo(publicAPI, model, numberOfInputs, numberOfOutputs) {
  if (model.inputData) {
    model.inputData = model.inputData.map(_vtk_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A);
  } else {
    model.inputData = [];
  }
  if (model.inputConnection) {
    model.inputConnection = model.inputConnection.map(_vtk_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A);
  } else {
    model.inputConnection = [];
  }
  if (model.output) {
    model.output = model.output.map(_vtk_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A);
  } else {
    model.output = [];
  }
  if (model.inputArrayToProcess) {
    model.inputArrayToProcess = model.inputArrayToProcess.map(_vtk_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A);
  } else {
    model.inputArrayToProcess = [];
  }

  // Cache the argument for later manipulation
  model.numberOfInputs = numberOfInputs;

  // Methods
  function setInputData(dataset) {
    let port = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (model.deleted) {
      vtkErrorMacro('instance deleted - cannot call any method');
      return;
    }
    if (port >= model.numberOfInputs) {
      vtkErrorMacro(`algorithm ${publicAPI.getClassName()} only has ${model.numberOfInputs} input ports. To add more input ports, use addInputData()`);
      return;
    }
    if (model.inputData[port] !== dataset || model.inputConnection[port]) {
      model.inputData[port] = dataset;
      model.inputConnection[port] = null;
      if (publicAPI.modified) {
        publicAPI.modified();
      }
    }
  }
  function getInputData() {
    let port = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    if (model.inputConnection[port]) {
      model.inputData[port] = model.inputConnection[port]();
    }
    return model.inputData[port];
  }
  function setInputConnection(outputPort) {
    let port = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (model.deleted) {
      vtkErrorMacro('instance deleted - cannot call any method');
      return;
    }
    if (port >= model.numberOfInputs) {
      let msg = `algorithm ${publicAPI.getClassName()} only has `;
      msg += `${model.numberOfInputs}`;
      msg += ' input ports. To add more input ports, use addInputConnection()';
      vtkErrorMacro(msg);
      return;
    }
    model.inputData[port] = null;
    model.inputConnection[port] = outputPort;
  }
  function getInputConnection() {
    let port = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return model.inputConnection[port];
  }
  function getPortToFill() {
    let portToFill = model.numberOfInputs;
    while (portToFill && !model.inputData[portToFill - 1] && !model.inputConnection[portToFill - 1]) {
      portToFill--;
    }
    if (portToFill === model.numberOfInputs) {
      model.numberOfInputs++;
    }
    return portToFill;
  }
  function addInputConnection(outputPort) {
    if (model.deleted) {
      vtkErrorMacro('instance deleted - cannot call any method');
      return;
    }
    setInputConnection(outputPort, getPortToFill());
  }
  function addInputData(dataset) {
    if (model.deleted) {
      vtkErrorMacro('instance deleted - cannot call any method');
      return;
    }
    setInputData(dataset, getPortToFill());
  }
  function getOutputData() {
    let port = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    if (model.deleted) {
      vtkErrorMacro('instance deleted - cannot call any method');
      return null;
    }
    if (publicAPI.shouldUpdate()) {
      publicAPI.update();
    }
    return model.output[port];
  }
  publicAPI.shouldUpdate = () => {
    const localMTime = publicAPI.getMTime();
    let minOutputMTime = Infinity;
    let count = numberOfOutputs;
    while (count--) {
      if (!model.output[count] || model.output[count].isDeleted()) {
        return true;
      }
      const mt = model.output[count].getMTime();
      if (mt < localMTime) {
        return true;
      }
      if (mt < minOutputMTime) {
        minOutputMTime = mt;
      }
    }
    count = model.numberOfInputs;
    while (count--) {
      if (model.inputConnection[count]?.filter.shouldUpdate() || publicAPI.getInputData(count)?.getMTime() > minOutputMTime) {
        return true;
      }
    }
    return false;
  };
  function getOutputPort() {
    let port = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    const outputPortAccess = () => getOutputData(port);
    // Add reference to filter
    outputPortAccess.filter = publicAPI;
    return outputPortAccess;
  }

  // Handle input if needed
  if (model.numberOfInputs) {
    // Reserve inputs
    let count = model.numberOfInputs;
    while (count--) {
      model.inputData.push(null);
      model.inputConnection.push(null);
    }

    // Expose public methods
    publicAPI.setInputData = setInputData;
    publicAPI.setInputConnection = setInputConnection;
    publicAPI.addInputData = addInputData;
    publicAPI.addInputConnection = addInputConnection;
    publicAPI.getInputData = getInputData;
    publicAPI.getInputConnection = getInputConnection;
  }
  if (numberOfOutputs) {
    publicAPI.getOutputData = getOutputData;
    publicAPI.getOutputPort = getOutputPort;
  }
  publicAPI.update = () => {
    const ins = [];
    if (model.numberOfInputs) {
      let count = 0;
      while (count < model.numberOfInputs) {
        ins[count] = publicAPI.getInputData(count);
        count++;
      }
    }
    if (publicAPI.shouldUpdate() && publicAPI.requestData) {
      publicAPI.requestData(ins, model.output);
    }
  };
  publicAPI.getNumberOfInputPorts = () => model.numberOfInputs;
  publicAPI.getNumberOfOutputPorts = () => numberOfOutputs || model.output.length;
  publicAPI.getInputArrayToProcess = inputPort => {
    const arrayDesc = model.inputArrayToProcess[inputPort];
    const ds = model.inputData[inputPort];
    if (arrayDesc && ds) {
      return ds[`get${arrayDesc.fieldAssociation}`]().getArray(arrayDesc.arrayName);
    }
    return null;
  };
  publicAPI.setInputArrayToProcess = function (inputPort, arrayName, fieldAssociation) {
    let attributeType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'Scalars';
    while (model.inputArrayToProcess.length < inputPort) {
      model.inputArrayToProcess.push(null);
    }
    model.inputArrayToProcess[inputPort] = {
      arrayName,
      fieldAssociation,
      attributeType
    };
  };
}

// ----------------------------------------------------------------------------
// Event handling: onXXX(callback), invokeXXX(args...)
// ----------------------------------------------------------------------------

const EVENT_ABORT = Symbol('Event abort');
function event(publicAPI, model, eventName) {
  const callbacks = [];
  const previousDelete = publicAPI.delete;
  let curCallbackID = 1;
  function off(callbackID) {
    for (let i = 0; i < callbacks.length; ++i) {
      const [cbID] = callbacks[i];
      if (cbID === callbackID) {
        callbacks.splice(i, 1);
        return;
      }
    }
  }
  function on(callbackID) {
    function unsubscribe() {
      off(callbackID);
    }
    return Object.freeze({
      unsubscribe
    });
  }
  function invoke() {
    if (model.deleted) {
      vtkErrorMacro('instance deleted - cannot call any method');
      return;
    }
    /* eslint-disable prefer-rest-params */
    // Go through a copy of the callbacks array in case new callbacks
    // get prepended within previous callbacks
    const currentCallbacks = callbacks.slice();
    for (let index = 0; index < currentCallbacks.length; ++index) {
      const [, cb, priority] = currentCallbacks[index];
      if (!cb) {
        continue; // eslint-disable-line
      }

      if (priority < 0) {
        setTimeout(() => cb.apply(publicAPI, arguments), 1 - priority);
      } else {
        // Abort only if the callback explicitly returns false
        const continueNext = cb.apply(publicAPI, arguments);
        if (continueNext === EVENT_ABORT) {
          break;
        }
      }
    }
    /* eslint-enable prefer-rest-params */
  }

  publicAPI[`invoke${_capitalize(eventName)}`] = invoke;
  publicAPI[`on${_capitalize(eventName)}`] = function (callback) {
    let priority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.0;
    if (!callback.apply) {
      console.error(`Invalid callback for event ${eventName}`);
      return null;
    }
    if (model.deleted) {
      vtkErrorMacro('instance deleted - cannot call any method');
      return null;
    }
    const callbackID = curCallbackID++;
    callbacks.push([callbackID, callback, priority]);
    callbacks.sort((cb1, cb2) => cb2[2] - cb1[2]);
    return on(callbackID);
  };
  publicAPI.delete = () => {
    previousDelete();
    callbacks.forEach(_ref => {
      let [cbID] = _ref;
      return off(cbID);
    });
  };
}

// ----------------------------------------------------------------------------
// newInstance
// ----------------------------------------------------------------------------

function newInstance(extend, className) {
  const constructor = function () {
    let initialValues = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const model = {};
    const publicAPI = {};
    extend(publicAPI, model, initialValues);
    return Object.freeze(publicAPI);
  };

  // Register constructor to factory
  if (className) {
    _vtk_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.register(className, constructor);
  }
  return constructor;
}

// ----------------------------------------------------------------------------
// Chain function calls
// ----------------------------------------------------------------------------

function chain() {
  for (var _len6 = arguments.length, fn = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    fn[_key6] = arguments[_key6];
  }
  return function () {
    for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }
    return fn.filter(i => !!i).map(i => i(...args));
  };
}

// ----------------------------------------------------------------------------
// Some utility methods for vtk objects
// ----------------------------------------------------------------------------

function isVtkObject(instance) {
  return instance && instance.isA && instance.isA('vtkObject');
}
function traverseInstanceTree(instance, extractFunction) {
  let accumulator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  let visitedInstances = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  if (isVtkObject(instance)) {
    if (visitedInstances.indexOf(instance) >= 0) {
      // avoid cycles
      return accumulator;
    }
    visitedInstances.push(instance);
    const result = extractFunction(instance);
    if (result !== undefined) {
      accumulator.push(result);
    }

    // Now go through this instance's model
    const model = instance.get();
    Object.keys(model).forEach(key => {
      const modelObj = model[key];
      if (Array.isArray(modelObj)) {
        modelObj.forEach(subObj => {
          traverseInstanceTree(subObj, extractFunction, accumulator, visitedInstances);
        });
      } else {
        traverseInstanceTree(modelObj, extractFunction, accumulator, visitedInstances);
      }
    });
  }
  return accumulator;
}

// ----------------------------------------------------------------------------
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

function debounce(func, wait, immediate) {
  var _this = this;
  let timeout;
  const debounced = function () {
    for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      args[_key8] = arguments[_key8];
    }
    const context = _this;
    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
  debounced.cancel = () => clearTimeout(timeout);
  return debounced;
}

// ----------------------------------------------------------------------------
// Creates a throttled function that only invokes `func` at most once per
// every `wait` milliseconds.

function throttle(callback, delay) {
  let isThrottled = false;
  let argsToUse = null;
  function next() {
    isThrottled = false;
    if (argsToUse !== null) {
      wrapper(...argsToUse); // eslint-disable-line
      argsToUse = null;
    }
  }
  function wrapper() {
    for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      args[_key9] = arguments[_key9];
    }
    if (isThrottled) {
      argsToUse = args;
      return;
    }
    isThrottled = true;
    callback(...args);
    setTimeout(next, delay);
  }
  return wrapper;
}

// ----------------------------------------------------------------------------
// keystore(publicAPI, model, initialKeystore)
//
//    - initialKeystore: Initial keystore. This can be either a Map or an
//      object.
//
// Generated API
//  setKey(key, value) : mixed (returns value)
//  getKey(key) : mixed
//  getAllKeys() : [mixed]
//  deleteKey(key) : Boolean
// ----------------------------------------------------------------------------

function keystore(publicAPI, model) {
  let initialKeystore = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  model.keystore = Object.assign(model.keystore || {}, initialKeystore);
  publicAPI.setKey = (key, value) => {
    model.keystore[key] = value;
  };
  publicAPI.getKey = key => model.keystore[key];
  publicAPI.getAllKeys = () => Object.keys(model.keystore);
  publicAPI.deleteKey = key => delete model.keystore[key];
  publicAPI.clearKeystore = () => publicAPI.getAllKeys().forEach(key => delete model.keystore[key]);
}

// ----------------------------------------------------------------------------
// proxy(publicAPI, model, sectionName, propertyUI)
//
//    - sectionName: Name of the section for UI
//    - propertyUI: List of props with their UI description
//
// Generated API
//  getProxyId() : String
//  listProxyProperties() : [string]
//  updateProxyProperty(name, prop)
//  getProxySection() => List of properties for UI generation
// ----------------------------------------------------------------------------
let nextProxyId = 1;
const ROOT_GROUP_NAME = '__root__';
function proxy(publicAPI, model) {
  // Proxies are keystores
  keystore(publicAPI, model);
  const parentDelete = publicAPI.delete;

  // getProxyId
  model.proxyId = `${nextProxyId++}`;

  // ui handling
  model.ui = JSON.parse(JSON.stringify(model.ui || [])); // deep copy
  get(publicAPI, model, ['proxyId', 'proxyGroup', 'proxyName']);
  setGet(publicAPI, model, ['proxyManager']);

  // group properties
  const propertyMap = {};
  const groupChildrenNames = {};
  function registerProperties(descriptionList, currentGroupName) {
    if (!groupChildrenNames[currentGroupName]) {
      groupChildrenNames[currentGroupName] = [];
    }
    const childrenNames = groupChildrenNames[currentGroupName];
    for (let i = 0; i < descriptionList.length; i++) {
      childrenNames.push(descriptionList[i].name);
      propertyMap[descriptionList[i].name] = descriptionList[i];
      if (descriptionList[i].children && descriptionList[i].children.length) {
        registerProperties(descriptionList[i].children, descriptionList[i].name);
      }
    }
  }
  registerProperties(model.ui, ROOT_GROUP_NAME);
  publicAPI.updateUI = ui => {
    model.ui = JSON.parse(JSON.stringify(ui || [])); // deep copy
    Object.keys(propertyMap).forEach(k => delete propertyMap[k]);
    Object.keys(groupChildrenNames).forEach(k => delete groupChildrenNames[k]);
    registerProperties(model.ui, ROOT_GROUP_NAME);
    publicAPI.modified();
  };
  function listProxyProperties() {
    let gName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ROOT_GROUP_NAME;
    return groupChildrenNames[gName];
  }
  publicAPI.updateProxyProperty = (propertyName, propUI) => {
    const prop = propertyMap[propertyName];
    if (prop) {
      Object.assign(prop, propUI);
    } else {
      propertyMap[propertyName] = {
        ...propUI
      };
    }
  };
  publicAPI.activate = () => {
    if (model.proxyManager) {
      const setActiveMethod = `setActive${_capitalize(publicAPI.getProxyGroup().slice(0, -1))}`;
      if (model.proxyManager[setActiveMethod]) {
        model.proxyManager[setActiveMethod](publicAPI);
      }
    }
  };

  // property link
  model.propertyLinkSubscribers = {};
  publicAPI.registerPropertyLinkForGC = (otherLink, type) => {
    if (!(type in model.propertyLinkSubscribers)) {
      model.propertyLinkSubscribers[type] = [];
    }
    model.propertyLinkSubscribers[type].push(otherLink);
  };
  publicAPI.gcPropertyLinks = type => {
    const subscribers = model.propertyLinkSubscribers[type] || [];
    while (subscribers.length) {
      subscribers.pop().unbind(publicAPI);
    }
  };
  model.propertyLinkMap = {};
  publicAPI.getPropertyLink = function (id) {
    let persistent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (model.propertyLinkMap[id]) {
      return model.propertyLinkMap[id];
    }
    let value = null;
    const links = [];
    let count = 0;
    let updateInProgress = false;
    function update(source) {
      let force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (updateInProgress) {
        return null;
      }
      const needUpdate = [];
      let sourceLink = null;
      count = links.length;
      while (count--) {
        const link = links[count];
        if (link.instance === source) {
          sourceLink = link;
        } else {
          needUpdate.push(link);
        }
      }
      if (!sourceLink) {
        return null;
      }
      const newValue = sourceLink.instance[`get${_capitalize(sourceLink.propertyName)}`]();
      if (!shallowEquals(newValue, value) || force) {
        value = newValue;
        updateInProgress = true;
        while (needUpdate.length) {
          const linkToUpdate = needUpdate.pop();
          linkToUpdate.instance.set({
            [linkToUpdate.propertyName]: value
          });
        }
        updateInProgress = false;
      }
      if (model.propertyLinkMap[id].persistent) {
        model.propertyLinkMap[id].value = newValue;
      }
      return newValue;
    }
    function unbind(instance, propertyName) {
      const indexToDelete = [];
      count = links.length;
      while (count--) {
        const link = links[count];
        if (link.instance === instance && (link.propertyName === propertyName || propertyName === undefined)) {
          link.subscription.unsubscribe();
          indexToDelete.push(count);
        }
      }
      while (indexToDelete.length) {
        links.splice(indexToDelete.pop(), 1);
      }
    }
    function bind(instance, propertyName) {
      let updateMe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      const subscription = instance.onModified(update);
      const other = links[0];
      links.push({
        instance,
        propertyName,
        subscription
      });
      if (updateMe) {
        if (model.propertyLinkMap[id].persistent && model.propertyLinkMap[id].value !== undefined) {
          instance.set({
            [propertyName]: model.propertyLinkMap[id].value
          });
        } else if (other) {
          update(other.instance, true);
        }
      }
      return {
        unsubscribe: () => unbind(instance, propertyName)
      };
    }
    function unsubscribe() {
      while (links.length) {
        links.pop().subscription.unsubscribe();
      }
    }
    const linkHandler = {
      bind,
      unbind,
      unsubscribe,
      persistent
    };
    model.propertyLinkMap[id] = linkHandler;
    return linkHandler;
  };

  // extract values
  function getProperties() {
    let groupName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ROOT_GROUP_NAME;
    const values = [];
    const id = model.proxyId;
    const propertyNames = listProxyProperties(groupName) || [];
    for (let i = 0; i < propertyNames.length; i++) {
      const name = propertyNames[i];
      const method = publicAPI[`get${_capitalize(name)}`];
      const value = method ? method() : undefined;
      const prop = {
        id,
        name,
        value
      };
      const children = getProperties(name);
      if (children.length) {
        prop.children = children;
      }
      values.push(prop);
    }
    return values;
  }
  publicAPI.listPropertyNames = () => getProperties().map(p => p.name);
  publicAPI.getPropertyByName = name => getProperties().find(p => p.name === name);
  publicAPI.getPropertyDomainByName = name => (propertyMap[name] || {}).domain;

  // ui section
  publicAPI.getProxySection = () => ({
    id: model.proxyId,
    name: model.proxyGroup,
    ui: model.ui,
    properties: getProperties()
  });

  // free resources
  publicAPI.delete = () => {
    const list = Object.keys(model.propertyLinkMap);
    let count = list.length;
    while (count--) {
      model.propertyLinkMap[list[count]].unsubscribe();
    }
    Object.keys(model.propertyLinkSubscribers).forEach(publicAPI.gcPropertyLinks);
    parentDelete();
  };

  // @todo fix infinite recursion due to active source
  publicAPI.getState = () => null;
  function registerLinks() {
    // Allow dynamic registration of links at the application level
    if (model.links) {
      for (let i = 0; i < model.links.length; i++) {
        const {
          link,
          property,
          persistent,
          updateOnBind,
          type
        } = model.links[i];
        if (type === 'application') {
          const sLink = model.proxyManager.getPropertyLink(link, persistent);
          publicAPI.registerPropertyLinkForGC(sLink, 'application');
          sLink.bind(publicAPI, property, updateOnBind);
        }
      }
    }
  }
  setImmediateVTK(registerLinks);
}

// ----------------------------------------------------------------------------
// proxyPropertyMapping(publicAPI, model, map)
//
//   map = {
//      opacity: { modelKey: 'property', property: 'opacity' },
//   }
//
// Generated API:
//  Elevate set/get methods from internal object stored in the model to current one
// ----------------------------------------------------------------------------

function proxyPropertyMapping(publicAPI, model, map) {
  const parentDelete = publicAPI.delete;
  const subscriptions = [];
  const propertyNames = Object.keys(map);
  let count = propertyNames.length;
  while (count--) {
    const propertyName = propertyNames[count];
    const {
      modelKey,
      property,
      modified = true
    } = map[propertyName];
    const methodSrc = _capitalize(property);
    const methodDst = _capitalize(propertyName);
    publicAPI[`get${methodDst}`] = model[modelKey][`get${methodSrc}`];
    publicAPI[`set${methodDst}`] = model[modelKey][`set${methodSrc}`];
    if (modified) {
      subscriptions.push(model[modelKey].onModified(publicAPI.modified));
    }
  }
  publicAPI.delete = () => {
    while (subscriptions.length) {
      subscriptions.pop().unsubscribe();
    }
    parentDelete();
  };
}

// ----------------------------------------------------------------------------
// proxyPropertyState(publicAPI, model, state, defaults)
//
//   state = {
//     representation: {
//       'Surface with edges': { property: { edgeVisibility: true, representation: 2 } },
//       Surface: { property: { edgeVisibility: false, representation: 2 } },
//       Wireframe: { property: { edgeVisibility: false, representation: 1 } },
//       Points: { property: { edgeVisibility: false, representation: 0 } },
//     },
//   }
//
//   defaults = {
//      representation: 'Surface',
//   }
//
// Generated API
//   get / set Representation ( string ) => push state to various internal objects
// ----------------------------------------------------------------------------

function proxyPropertyState(publicAPI, model) {
  let state = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let defaults = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  model.this = publicAPI;
  function applyState(map) {
    const modelKeys = Object.keys(map);
    let count = modelKeys.length;
    while (count--) {
      const modelKey = modelKeys[count];
      model[modelKey].set(map[modelKey]);
    }
  }
  const modelKeys = Object.keys(defaults);
  let count = modelKeys.length;
  while (count--) {
    // Add default
    const key = modelKeys[count];
    model[key] = defaults[key];

    // Add set method
    const mapping = state[key];
    publicAPI[`set${_capitalize(key)}`] = value => {
      if (value !== model[key]) {
        model[key] = value;
        const propValues = mapping[value];
        applyState(propValues);
        publicAPI.modified();
      }
    };
  }

  // Add getter
  if (modelKeys.length) {
    get(publicAPI, model, modelKeys);
  }
}

// ----------------------------------------------------------------------------
// From : https://github.com/facebookarchive/fixed-data-table/blob/master/src/vendor_upstream/dom/normalizeWheel.js
//
//
// Copyright (c) 2015, Facebook, Inc.
// All rights reserved.
//
// This source code is licensed under the BSD-style license found in the
// LICENSE file in the root directory of this source tree. An additional grant
// of patent rights can be found in the PATENTS file in the same directory.
//
//
// Mouse wheel (and 2-finger trackpad) support on the web sucks.  It is
// complicated, thus this doc is long and (hopefully) detailed enough to answer
// your questions.
//
// If you need to react to the mouse wheel in a predictable way, this code is
// like your bestest friend.// hugs//
//
// As of today, there are 4 DOM event types you can listen to:
//
//   'wheel'                -- Chrome(31+), FF(17+), IE(9+)
//   'mousewheel'           -- Chrome, IE(6+), Opera, Safari
//   'MozMousePixelScroll'  -- FF(3.5 only!) (2010-2013) -- don't bother!
//   'DOMMouseScroll'       -- FF(0.9.7+) since 2003
//
// So what to do?  The is the best:
//
//   normalizeWheel.getEventType();
//
// In your event callback, use this code to get sane interpretation of the
// deltas.  This code will return an object with properties:
//
//   spinX   -- normalized spin speed (use for zoom) - x plane
//   spinY   -- " - y plane
//   pixelX  -- normalized distance (to pixels) - x plane
//   pixelY  -- " - y plane
//
// Wheel values are provided by the browser assuming you are using the wheel to
// scroll a web page by a number of lines or pixels (or pages).  Values can vary
// significantly on different platforms and browsers, forgetting that you can
// scroll at different speeds.  Some devices (like trackpads) emit more events
// at smaller increments with fine granularity, and some emit massive jumps with
// linear speed or acceleration.
//
// This code does its best to normalize the deltas for you:
//
//   - spin is trying to normalize how far the wheel was spun (or trackpad
//     dragged).  This is super useful for zoom support where you want to
//     throw away the chunky scroll steps on the PC and make those equal to
//     the slow and smooth tiny steps on the Mac. Key data: This code tries to
//     resolve a single slow step on a wheel to 1.
//
//   - pixel is normalizing the desired scroll delta in pixel units.  You'll
//     get the crazy differences between browsers, but at least it'll be in
//     pixels!
//
//   - positive value indicates scrolling DOWN/RIGHT, negative UP/LEFT.  This
//     should translate to positive value zooming IN, negative zooming OUT.
//     This matches the newer 'wheel' event.
//
// Why are there spinX, spinY (or pixels)?
//
//   - spinX is a 2-finger side drag on the trackpad, and a shift + wheel turn
//     with a mouse.  It results in side-scrolling in the browser by default.
//
//   - spinY is what you expect -- it's the classic axis of a mouse wheel.
//
//   - I dropped spinZ/pixelZ.  It is supported by the DOM 3 'wheel' event and
//     probably is by browsers in conjunction with fancy 3D controllers .. but
//     you know.
//
// Implementation info:
//
// Examples of 'wheel' event if you scroll slowly (down) by one step with an
// average mouse:
//
//   OS X + Chrome  (mouse)     -    4   pixel delta  (wheelDelta -120)
//   OS X + Safari  (mouse)     -  N/A   pixel delta  (wheelDelta  -12)
//   OS X + Firefox (mouse)     -    0.1 line  delta  (wheelDelta  N/A)
//   Win8 + Chrome  (mouse)     -  100   pixel delta  (wheelDelta -120)
//   Win8 + Firefox (mouse)     -    3   line  delta  (wheelDelta -120)
//
// On the trackpad:
//
//   OS X + Chrome  (trackpad)  -    2   pixel delta  (wheelDelta   -6)
//   OS X + Firefox (trackpad)  -    1   pixel delta  (wheelDelta  N/A)
//
// On other/older browsers.. it's more complicated as there can be multiple and
// also missing delta values.
//
// The 'wheel' event is more standard:
//
// http://www.w3.org/TR/DOM-Level-3-Events/#events-wheelevents
//
// The basics is that it includes a unit, deltaMode (pixels, lines, pages), and
// deltaX, deltaY and deltaZ.  Some browsers provide other values to maintain
// backward compatibility with older events.  Those other values help us
// better normalize spin speed.  Example of what the browsers provide:
//
//                          | event.wheelDelta | event.detail
//        ------------------+------------------+--------------
//          Safari v5/OS X  |       -120       |       0
//          Safari v5/Win7  |       -120       |       0
//         Chrome v17/OS X  |       -120       |       0
//         Chrome v17/Win7  |       -120       |       0
//                IE9/Win7  |       -120       |   undefined
//         Firefox v4/OS X  |     undefined    |       1
//         Firefox v4/Win7  |     undefined    |       3
//
// ----------------------------------------------------------------------------

// Reasonable defaults
const PIXEL_STEP = 10;
const LINE_HEIGHT = 40;
const PAGE_HEIGHT = 800;
function normalizeWheel(wheelEvent) {
  let sX = 0; // spinX
  let sY = 0; // spinY
  let pX = 0; // pixelX
  let pY = 0; // pixelY

  // Legacy
  if ('detail' in wheelEvent) {
    sY = wheelEvent.detail;
  }
  if ('wheelDelta' in wheelEvent) {
    sY = -wheelEvent.wheelDelta / 120;
  }
  if ('wheelDeltaY' in wheelEvent) {
    sY = -wheelEvent.wheelDeltaY / 120;
  }
  if ('wheelDeltaX' in wheelEvent) {
    sX = -wheelEvent.wheelDeltaX / 120;
  }

  // side scrolling on FF with DOMMouseScroll
  if ('axis' in wheelEvent && wheelEvent.axis === wheelEvent.HORIZONTAL_AXIS) {
    sX = sY;
    sY = 0;
  }
  pX = sX * PIXEL_STEP;
  pY = sY * PIXEL_STEP;
  if ('deltaY' in wheelEvent) {
    pY = wheelEvent.deltaY;
  }
  if ('deltaX' in wheelEvent) {
    pX = wheelEvent.deltaX;
  }
  if ((pX || pY) && wheelEvent.deltaMode) {
    if (wheelEvent.deltaMode === 1) {
      // delta in LINE units
      pX *= LINE_HEIGHT;
      pY *= LINE_HEIGHT;
    } else {
      // delta in PAGE units
      pX *= PAGE_HEIGHT;
      pY *= PAGE_HEIGHT;
    }
  }

  // Fall-back if spin cannot be determined
  if (pX && !sX) {
    sX = pX < 1 ? -1 : 1;
  }
  if (pY && !sY) {
    sY = pY < 1 ? -1 : 1;
  }
  return {
    spinX: sX,
    spinY: sY || sX,
    pixelX: pX,
    pixelY: pY || pX
  };
}

// ----------------------------------------------------------------------------
// Default export
// ----------------------------------------------------------------------------

var macro = {
  algo,
  capitalize,
  chain,
  debounce,
  enumToString,
  event,
  EVENT_ABORT,
  formatBytesToProperUnit,
  formatNumbersWithThousandSeparator,
  get,
  getArray,
  getCurrentGlobalMTime,
  getStateArrayMapFunc,
  isVtkObject,
  keystore,
  measurePromiseExecution,
  moveToProtected,
  newInstance,
  newTypedArray,
  newTypedArrayFrom,
  normalizeWheel,
  obj,
  proxy,
  proxyPropertyMapping,
  proxyPropertyState,
  safeArrays,
  set,
  setArray,
  setGet,
  setGetArray,
  setImmediate: setImmediateVTK,
  setLoggerFunction,
  throttle,
  traverseInstanceTree,
  TYPED_ARRAYS,
  // deprecated todo remove on breaking API revision
  uncapitalize,
  VOID,
  vtkDebugMacro,
  vtkErrorMacro,
  vtkInfoMacro,
  vtkLogMacro,
  vtkOnceErrorMacro,
  vtkWarningMacro,
  // vtk.js internal use
  objectSetterMap
};

var macro$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  VOID: VOID,
  setLoggerFunction: setLoggerFunction,
  vtkLogMacro: vtkLogMacro,
  vtkInfoMacro: vtkInfoMacro,
  vtkDebugMacro: vtkDebugMacro,
  vtkErrorMacro: vtkErrorMacro,
  vtkWarningMacro: vtkWarningMacro,
  vtkOnceErrorMacro: vtkOnceErrorMacro,
  TYPED_ARRAYS: TYPED_ARRAYS,
  newTypedArray: newTypedArray,
  newTypedArrayFrom: newTypedArrayFrom,
  capitalize: capitalize,
  _capitalize: _capitalize,
  uncapitalize: uncapitalize,
  formatBytesToProperUnit: formatBytesToProperUnit,
  formatNumbersWithThousandSeparator: formatNumbersWithThousandSeparator,
  setImmediateVTK: setImmediateVTK,
  measurePromiseExecution: measurePromiseExecution,
  obj: obj,
  get: get,
  set: set,
  setGet: setGet,
  getArray: getArray,
  setArray: setArray,
  setGetArray: setGetArray,
  moveToProtected: moveToProtected,
  algo: algo,
  EVENT_ABORT: EVENT_ABORT,
  event: event,
  newInstance: newInstance,
  chain: chain,
  isVtkObject: isVtkObject,
  traverseInstanceTree: traverseInstanceTree,
  debounce: debounce,
  throttle: throttle,
  keystore: keystore,
  proxy: proxy,
  proxyPropertyMapping: proxyPropertyMapping,
  proxyPropertyState: proxyPropertyState,
  normalizeWheel: normalizeWheel,
  'default': macro
});




/***/ }),

/***/ 42852:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ vtk),
/* harmony export */   n: () => (/* binding */ vtkGlobal)
/* harmony export */ });
/* harmony import */ var globalthis__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5744);
/* harmony import */ var globalthis__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(globalthis__WEBPACK_IMPORTED_MODULE_0__);


const vtkGlobal = globalthis__WEBPACK_IMPORTED_MODULE_0___default()(); // returns native globalThis if compliant

const factoryMapping = {
  vtkObject: () => null
};
function vtk(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (obj.isA) {
    return obj;
  }
  if (!obj.vtkClass) {
    if (vtkGlobal.console && vtkGlobal.console.error) {
      vtkGlobal.console.error('Invalid VTK object');
    }
    return null;
  }
  const constructor = factoryMapping[obj.vtkClass];
  if (!constructor) {
    if (vtkGlobal.console && vtkGlobal.console.error) {
      vtkGlobal.console.error(`No vtk class found for Object of type ${obj.vtkClass}`);
    }
    return null;
  }

  // Shallow copy object
  const model = {
    ...obj
  };

  // Convert into vtkObject any nested key
  Object.keys(model).forEach(keyName => {
    if (model[keyName] && typeof model[keyName] === 'object' && model[keyName].vtkClass) {
      model[keyName] = vtk(model[keyName]);
    }
  });

  // Return the root
  const newInst = constructor(model);
  if (newInst && newInst.modified) {
    newInst.modified();
  }
  return newInst;
}
function register(vtkClassName, constructor) {
  factoryMapping[vtkClassName] = constructor;
}

// Nest register method under the vtk function
vtk.register = register;




/***/ }),

/***/ 45043:
/***/ ((module) => {

"use strict";


// do not edit .js files directly - edit src/index.jst



module.exports = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }



    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      var key = keys[i];

      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a!==a && b!==b;
};


/***/ }),

/***/ 24457:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ARRAY_TYPE: () => (/* binding */ ARRAY_TYPE),
/* harmony export */   EPSILON: () => (/* binding */ EPSILON),
/* harmony export */   RANDOM: () => (/* binding */ RANDOM)
/* harmony export */ });
/* unused harmony exports setMatrixArrayType, toRadian, equals */
/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
var RANDOM = Math.random;
/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Float32ArrayConstructor | ArrayConstructor} type Array type, such as Float32Array or Array
 */

function setMatrixArrayType(type) {
  ARRAY_TYPE = type;
}
var degree = Math.PI / 180;
/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */

function toRadian(a) {
  return a * degree;
}
/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */

function equals(a, b) {
  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};

/***/ }),

/***/ 3823:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  w0: () => (/* reexport */ mat3),
  pB: () => (/* reexport */ mat4),
  eR: () => (/* reexport */ vec3)
});

// UNUSED EXPORTS: glMatrix, mat2, mat2d, quat, quat2, vec2, vec4

// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/common.js
var common = __webpack_require__(24457);
// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/mat2.js
var mat2 = __webpack_require__(98232);
// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/mat2d.js
var mat2d = __webpack_require__(72918);
// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/mat3.js
var mat3 = __webpack_require__(32591);
// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/mat4.js
var mat4 = __webpack_require__(28910);
// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/quat.js
var quat = __webpack_require__(50095);
// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/quat2.js
var quat2 = __webpack_require__(16953);
;// ../../../node_modules/gl-matrix/esm/vec2.js

/**
 * 2 Dimensional Vector
 * @module vec2
 */

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */

function create() {
  var out = new common.ARRAY_TYPE(2);

  if (common.ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
  }

  return out;
}
/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {ReadonlyVec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */

function clone(a) {
  var out = new glMatrix.ARRAY_TYPE(2);
  out[0] = a[0];
  out[1] = a[1];
  return out;
}
/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */

function fromValues(x, y) {
  var out = new glMatrix.ARRAY_TYPE(2);
  out[0] = x;
  out[1] = y;
  return out;
}
/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the source vector
 * @returns {vec2} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  return out;
}
/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */

function set(out, x, y) {
  out[0] = x;
  out[1] = y;
  return out;
}
/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
}
/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  return out;
}
/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  return out;
}
/**
 * Math.ceil the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to ceil
 * @returns {vec2} out
 */

function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  return out;
}
/**
 * Math.floor the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to floor
 * @returns {vec2} out
 */

function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  return out;
}
/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  return out;
}
/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  return out;
}
/**
 * Math.round the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to round
 * @returns {vec2} out
 */

function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  return out;
}
/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */

function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  return out;
}
/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */

function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  return out;
}
/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {Number} distance between a and b
 */

function distance(a, b) {
  var x = b[0] - a[0],
      y = b[1] - a[1];
  return Math.hypot(x, y);
}
/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {Number} squared distance between a and b
 */

function squaredDistance(a, b) {
  var x = b[0] - a[0],
      y = b[1] - a[1];
  return x * x + y * y;
}
/**
 * Calculates the length of a vec2
 *
 * @param {ReadonlyVec2} a vector to calculate length of
 * @returns {Number} length of a
 */

function vec2_length(a) {
  var x = a[0],
      y = a[1];
  return Math.hypot(x, y);
}
/**
 * Calculates the squared length of a vec2
 *
 * @param {ReadonlyVec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength(a) {
  var x = a[0],
      y = a[1];
  return x * x + y * y;
}
/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to negate
 * @returns {vec2} out
 */

function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  return out;
}
/**
 * Returns the inverse of the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to invert
 * @returns {vec2} out
 */

function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  return out;
}
/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to normalize
 * @returns {vec2} out
 */

function normalize(out, a) {
  var x = a[0],
      y = a[1];
  var len = x * x + y * y;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  return out;
}
/**
 * Calculates the dot product of two vec2's
 *
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}
/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec3} out
 */

function cross(out, a, b) {
  var z = a[0] * b[1] - a[1] * b[0];
  out[0] = out[1] = 0;
  out[2] = z;
  return out;
}
/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec2} out
 */

function lerp(out, a, b, t) {
  var ax = a[0],
      ay = a[1];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  return out;
}
/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */

function random(out, scale) {
  scale = scale || 1.0;
  var r = glMatrix.RANDOM() * 2.0 * Math.PI;
  out[0] = Math.cos(r) * scale;
  out[1] = Math.sin(r) * scale;
  return out;
}
/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat2} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat2(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[2] * y;
  out[1] = m[1] * x + m[3] * y;
  return out;
}
/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat2d} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat2d(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[2] * y + m[4];
  out[1] = m[1] * x + m[3] * y + m[5];
  return out;
}
/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat3} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat3(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[3] * y + m[6];
  out[1] = m[1] * x + m[4] * y + m[7];
  return out;
}
/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat4(out, a, m) {
  var x = a[0];
  var y = a[1];
  out[0] = m[0] * x + m[4] * y + m[12];
  out[1] = m[1] * x + m[5] * y + m[13];
  return out;
}
/**
 * Rotate a 2D vector
 * @param {vec2} out The receiving vec2
 * @param {ReadonlyVec2} a The vec2 point to rotate
 * @param {ReadonlyVec2} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec2} out
 */

function rotate(out, a, b, rad) {
  //Translate point to the origin
  var p0 = a[0] - b[0],
      p1 = a[1] - b[1],
      sinC = Math.sin(rad),
      cosC = Math.cos(rad); //perform rotation and translate to correct position

  out[0] = p0 * cosC - p1 * sinC + b[0];
  out[1] = p0 * sinC + p1 * cosC + b[1];
  return out;
}
/**
 * Get the angle between two 2D vectors
 * @param {ReadonlyVec2} a The first operand
 * @param {ReadonlyVec2} b The second operand
 * @returns {Number} The angle in radians
 */

function angle(a, b) {
  var x1 = a[0],
      y1 = a[1],
      x2 = b[0],
      y2 = b[1],
      // mag is the product of the magnitudes of a and b
  mag = Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2),
      // mag &&.. short circuits if mag == 0
  cosine = mag && (x1 * x2 + y1 * y2) / mag; // Math.min(Math.max(cosine, -1), 1) clamps the cosine between -1 and 1

  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
/**
 * Set the components of a vec2 to zero
 *
 * @param {vec2} out the receiving vector
 * @returns {vec2} out
 */

function zero(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  return out;
}
/**
 * Returns a string representation of a vector
 *
 * @param {ReadonlyVec2} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str(a) {
  return "vec2(" + a[0] + ", " + a[1] + ")";
}
/**
 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyVec2} a The first vector.
 * @param {ReadonlyVec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {ReadonlyVec2} a The first vector.
 * @param {ReadonlyVec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1];
  var b0 = b[0],
      b1 = b[1];
  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1));
}
/**
 * Alias for {@link vec2.length}
 * @function
 */

var len = (/* unused pure expression or super */ null && (vec2_length));
/**
 * Alias for {@link vec2.subtract}
 * @function
 */

var sub = (/* unused pure expression or super */ null && (subtract));
/**
 * Alias for {@link vec2.multiply}
 * @function
 */

var mul = (/* unused pure expression or super */ null && (multiply));
/**
 * Alias for {@link vec2.divide}
 * @function
 */

var div = (/* unused pure expression or super */ null && (divide));
/**
 * Alias for {@link vec2.distance}
 * @function
 */

var dist = (/* unused pure expression or super */ null && (distance));
/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */

var sqrDist = (/* unused pure expression or super */ null && (squaredDistance));
/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */

var sqrLen = (/* unused pure expression or super */ null && (squaredLength));
/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
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
      stride = 2;
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
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
    }

    return a;
  };
}();
// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/vec3.js
var vec3 = __webpack_require__(9175);
// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/vec4.js
var vec4 = __webpack_require__(15958);
;// ../../../node_modules/gl-matrix/esm/index.js












/***/ }),

/***/ 32591:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   adjoint: () => (/* binding */ adjoint),
/* harmony export */   clone: () => (/* binding */ clone),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   determinant: () => (/* binding */ determinant),
/* harmony export */   equals: () => (/* binding */ equals),
/* harmony export */   exactEquals: () => (/* binding */ exactEquals),
/* harmony export */   frob: () => (/* binding */ frob),
/* harmony export */   fromMat2d: () => (/* binding */ fromMat2d),
/* harmony export */   fromMat4: () => (/* binding */ fromMat4),
/* harmony export */   fromQuat: () => (/* binding */ fromQuat),
/* harmony export */   fromRotation: () => (/* binding */ fromRotation),
/* harmony export */   fromScaling: () => (/* binding */ fromScaling),
/* harmony export */   fromTranslation: () => (/* binding */ fromTranslation),
/* harmony export */   fromValues: () => (/* binding */ fromValues),
/* harmony export */   identity: () => (/* binding */ identity),
/* harmony export */   invert: () => (/* binding */ invert),
/* harmony export */   mul: () => (/* binding */ mul),
/* harmony export */   multiply: () => (/* binding */ multiply),
/* harmony export */   multiplyScalar: () => (/* binding */ multiplyScalar),
/* harmony export */   multiplyScalarAndAdd: () => (/* binding */ multiplyScalarAndAdd),
/* harmony export */   normalFromMat4: () => (/* binding */ normalFromMat4),
/* harmony export */   projection: () => (/* binding */ projection),
/* harmony export */   rotate: () => (/* binding */ rotate),
/* harmony export */   scale: () => (/* binding */ scale),
/* harmony export */   set: () => (/* binding */ set),
/* harmony export */   str: () => (/* binding */ str),
/* harmony export */   sub: () => (/* binding */ sub),
/* harmony export */   subtract: () => (/* binding */ subtract),
/* harmony export */   translate: () => (/* binding */ translate),
/* harmony export */   transpose: () => (/* binding */ transpose)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24457);

/**
 * 3x3 Matrix
 * @module mat3
 */

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */

function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(9);

  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }

  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}
/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {ReadonlyMat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */

function fromMat4(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[4];
  out[4] = a[5];
  out[5] = a[6];
  out[6] = a[8];
  out[7] = a[9];
  out[8] = a[10];
  return out;
}
/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {ReadonlyMat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */

function clone(a) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(9);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the source matrix
 * @returns {mat3} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
/**
 * Create a new mat3 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} A new mat3
 */

function fromValues(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(9);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}
/**
 * Set the components of a mat3 to the given values
 *
 * @param {mat3} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} out
 */

function set(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}
/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}
/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the source matrix
 * @returns {mat3} out
 */

function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a01 = a[1],
        a02 = a[2],
        a12 = a[5];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a01;
    out[5] = a[7];
    out[6] = a02;
    out[7] = a12;
  } else {
    out[0] = a[0];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a[1];
    out[4] = a[4];
    out[5] = a[7];
    out[6] = a[2];
    out[7] = a[5];
    out[8] = a[8];
  }

  return out;
}
/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the source matrix
 * @returns {mat3} out
 */

function invert(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  var b01 = a22 * a11 - a12 * a21;
  var b11 = -a22 * a10 + a12 * a20;
  var b21 = a21 * a10 - a11 * a20; // Calculate the determinant

  var det = a00 * b01 + a01 * b11 + a02 * b21;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = b01 * det;
  out[1] = (-a22 * a01 + a02 * a21) * det;
  out[2] = (a12 * a01 - a02 * a11) * det;
  out[3] = b11 * det;
  out[4] = (a22 * a00 - a02 * a20) * det;
  out[5] = (-a12 * a00 + a02 * a10) * det;
  out[6] = b21 * det;
  out[7] = (-a21 * a00 + a01 * a20) * det;
  out[8] = (a11 * a00 - a01 * a10) * det;
  return out;
}
/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the source matrix
 * @returns {mat3} out
 */

function adjoint(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  out[0] = a11 * a22 - a12 * a21;
  out[1] = a02 * a21 - a01 * a22;
  out[2] = a01 * a12 - a02 * a11;
  out[3] = a12 * a20 - a10 * a22;
  out[4] = a00 * a22 - a02 * a20;
  out[5] = a02 * a10 - a00 * a12;
  out[6] = a10 * a21 - a11 * a20;
  out[7] = a01 * a20 - a00 * a21;
  out[8] = a00 * a11 - a01 * a10;
  return out;
}
/**
 * Calculates the determinant of a mat3
 *
 * @param {ReadonlyMat3} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant(a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
}
/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the first operand
 * @param {ReadonlyMat3} b the second operand
 * @returns {mat3} out
 */

function multiply(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  var b00 = b[0],
      b01 = b[1],
      b02 = b[2];
  var b10 = b[3],
      b11 = b[4],
      b12 = b[5];
  var b20 = b[6],
      b21 = b[7],
      b22 = b[8];
  out[0] = b00 * a00 + b01 * a10 + b02 * a20;
  out[1] = b00 * a01 + b01 * a11 + b02 * a21;
  out[2] = b00 * a02 + b01 * a12 + b02 * a22;
  out[3] = b10 * a00 + b11 * a10 + b12 * a20;
  out[4] = b10 * a01 + b11 * a11 + b12 * a21;
  out[5] = b10 * a02 + b11 * a12 + b12 * a22;
  out[6] = b20 * a00 + b21 * a10 + b22 * a20;
  out[7] = b20 * a01 + b21 * a11 + b22 * a21;
  out[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return out;
}
/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to translate
 * @param {ReadonlyVec2} v vector to translate by
 * @returns {mat3} out
 */

function translate(out, a, v) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a10 = a[3],
      a11 = a[4],
      a12 = a[5],
      a20 = a[6],
      a21 = a[7],
      a22 = a[8],
      x = v[0],
      y = v[1];
  out[0] = a00;
  out[1] = a01;
  out[2] = a02;
  out[3] = a10;
  out[4] = a11;
  out[5] = a12;
  out[6] = x * a00 + y * a10 + a20;
  out[7] = x * a01 + y * a11 + a21;
  out[8] = x * a02 + y * a12 + a22;
  return out;
}
/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */

function rotate(out, a, rad) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a10 = a[3],
      a11 = a[4],
      a12 = a[5],
      a20 = a[6],
      a21 = a[7],
      a22 = a[8],
      s = Math.sin(rad),
      c = Math.cos(rad);
  out[0] = c * a00 + s * a10;
  out[1] = c * a01 + s * a11;
  out[2] = c * a02 + s * a12;
  out[3] = c * a10 - s * a00;
  out[4] = c * a11 - s * a01;
  out[5] = c * a12 - s * a02;
  out[6] = a20;
  out[7] = a21;
  out[8] = a22;
  return out;
}
/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to rotate
 * @param {ReadonlyVec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/

function scale(out, a, v) {
  var x = v[0],
      y = v[1];
  out[0] = x * a[0];
  out[1] = x * a[1];
  out[2] = x * a[2];
  out[3] = y * a[3];
  out[4] = y * a[4];
  out[5] = y * a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.translate(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {ReadonlyVec2} v Translation vector
 * @returns {mat3} out
 */

function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = v[0];
  out[7] = v[1];
  out[8] = 1;
  return out;
}
/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.rotate(dest, dest, rad);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */

function fromRotation(out, rad) {
  var s = Math.sin(rad),
      c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = 0;
  out[3] = -s;
  out[4] = c;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.scale(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {ReadonlyVec2} v Scaling vector
 * @returns {mat3} out
 */

function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = v[1];
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}
/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat2d} a the matrix to copy
 * @returns {mat3} out
 **/

function fromMat2d(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = 0;
  out[3] = a[2];
  out[4] = a[3];
  out[5] = 0;
  out[6] = a[4];
  out[7] = a[5];
  out[8] = 1;
  return out;
}
/**
 * Calculates a 3x3 matrix from the given quaternion
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {ReadonlyQuat} q Quaternion to create matrix from
 *
 * @returns {mat3} out
 */

function fromQuat(out, q) {
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - yy - zz;
  out[3] = yx - wz;
  out[6] = zx + wy;
  out[1] = yx + wz;
  out[4] = 1 - xx - zz;
  out[7] = zy - wx;
  out[2] = zx - wy;
  out[5] = zy + wx;
  out[8] = 1 - xx - yy;
  return out;
}
/**
 * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {ReadonlyMat4} a Mat4 to derive the normal matrix from
 *
 * @returns {mat3} out
 */

function normalFromMat4(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  return out;
}
/**
 * Generates a 2D projection matrix with the given bounds
 *
 * @param {mat3} out mat3 frustum matrix will be written into
 * @param {number} width Width of your gl context
 * @param {number} height Height of gl context
 * @returns {mat3} out
 */

function projection(out, width, height) {
  out[0] = 2 / width;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = -2 / height;
  out[5] = 0;
  out[6] = -1;
  out[7] = 1;
  out[8] = 1;
  return out;
}
/**
 * Returns a string representation of a mat3
 *
 * @param {ReadonlyMat3} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */

function str(a) {
  return "mat3(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ")";
}
/**
 * Returns Frobenius norm of a mat3
 *
 * @param {ReadonlyMat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */

function frob(a) {
  return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8]);
}
/**
 * Adds two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the first operand
 * @param {ReadonlyMat3} b the second operand
 * @returns {mat3} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the first operand
 * @param {ReadonlyMat3} b the second operand
 * @returns {mat3} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  return out;
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat3} out
 */

function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  return out;
}
/**
 * Adds two mat3's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat3} out the receiving vector
 * @param {ReadonlyMat3} a the first operand
 * @param {ReadonlyMat3} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat3} out
 */

function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  out[4] = a[4] + b[4] * scale;
  out[5] = a[5] + b[5] * scale;
  out[6] = a[6] + b[6] * scale;
  out[7] = a[7] + b[7] * scale;
  out[8] = a[8] + b[8] * scale;
  return out;
}
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyMat3} a The first matrix.
 * @param {ReadonlyMat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {ReadonlyMat3} a The first matrix.
 * @param {ReadonlyMat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5],
      a6 = a[6],
      a7 = a[7],
      a8 = a[8];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3],
      b4 = b[4],
      b5 = b[5],
      b6 = b[6],
      b7 = b[7],
      b8 = b[8];
  return Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8));
}
/**
 * Alias for {@link mat3.multiply}
 * @function
 */

var mul = multiply;
/**
 * Alias for {@link mat3.subtract}
 * @function
 */

var sub = subtract;

/***/ }),

/***/ 50095:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   dot: () => (/* binding */ dot),
/* harmony export */   length: () => (/* binding */ length),
/* harmony export */   squaredLength: () => (/* binding */ squaredLength)
/* harmony export */ });
/* unused harmony exports create, identity, setAxisAngle, getAxisAngle, getAngle, multiply, rotateX, rotateY, rotateZ, calculateW, exp, ln, pow, slerp, random, invert, conjugate, fromMat3, fromEuler, str, clone, fromValues, set, add, mul, scale, lerp, len, sqrLen, normalize, exactEquals, equals, rotationTo, sqlerp, setAxes */
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24457);
/* harmony import */ var _mat3_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(32591);
/* harmony import */ var _vec3_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9175);
/* harmony import */ var _vec4_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(15958);




/**
 * Quaternion
 * @module quat
 */

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */

function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(4);

  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  out[3] = 1;
  return out;
}
/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */

function identity(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}
/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyVec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/

function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  var s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
/**
 * Gets the rotation axis and angle for a given
 *  quaternion. If a quaternion is created with
 *  setAxisAngle, this method will return the same
 *  values as providied in the original parameter list
 *  OR functionally equivalent values.
 * Example: The quaternion formed by axis [0, 0, 1] and
 *  angle -90 is the same as the quaternion formed by
 *  [0, 0, 1] and 270. This method favors the latter.
 * @param  {vec3} out_axis  Vector receiving the axis of rotation
 * @param  {ReadonlyQuat} q     Quaternion to be decomposed
 * @return {Number}     Angle, in radians, of the rotation
 */

function getAxisAngle(out_axis, q) {
  var rad = Math.acos(q[3]) * 2.0;
  var s = Math.sin(rad / 2.0);

  if (s > glMatrix.EPSILON) {
    out_axis[0] = q[0] / s;
    out_axis[1] = q[1] / s;
    out_axis[2] = q[2] / s;
  } else {
    // If s is zero, return any axis (no rotation - axis does not matter)
    out_axis[0] = 1;
    out_axis[1] = 0;
    out_axis[2] = 0;
  }

  return rad;
}
/**
 * Gets the angular distance between two unit quaternions
 *
 * @param  {ReadonlyQuat} a     Origin unit quaternion
 * @param  {ReadonlyQuat} b     Destination unit quaternion
 * @return {Number}     Angle, in radians, between the two quaternions
 */

function getAngle(a, b) {
  var dotproduct = dot(a, b);
  return Math.acos(2 * dotproduct * dotproduct - 1);
}
/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @returns {quat} out
 */

function multiply(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];
  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {ReadonlyQuat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */

function rotateX(out, a, rad) {
  rad *= 0.5;
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = Math.sin(rad),
      bw = Math.cos(rad);
  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {ReadonlyQuat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */

function rotateY(out, a, rad) {
  rad *= 0.5;
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var by = Math.sin(rad),
      bw = Math.cos(rad);
  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {ReadonlyQuat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */

function rotateZ(out, a, rad) {
  rad *= 0.5;
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bz = Math.sin(rad),
      bw = Math.cos(rad);
  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
}
/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate W component of
 * @returns {quat} out
 */

function calculateW(out, a) {
  var x = a[0],
      y = a[1],
      z = a[2];
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
  return out;
}
/**
 * Calculate the exponential of a unit quaternion.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate the exponential of
 * @returns {quat} out
 */

function exp(out, a) {
  var x = a[0],
      y = a[1],
      z = a[2],
      w = a[3];
  var r = Math.sqrt(x * x + y * y + z * z);
  var et = Math.exp(w);
  var s = r > 0 ? et * Math.sin(r) / r : 0;
  out[0] = x * s;
  out[1] = y * s;
  out[2] = z * s;
  out[3] = et * Math.cos(r);
  return out;
}
/**
 * Calculate the natural logarithm of a unit quaternion.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate the exponential of
 * @returns {quat} out
 */

function ln(out, a) {
  var x = a[0],
      y = a[1],
      z = a[2],
      w = a[3];
  var r = Math.sqrt(x * x + y * y + z * z);
  var t = r > 0 ? Math.atan2(r, w) / r : 0;
  out[0] = x * t;
  out[1] = y * t;
  out[2] = z * t;
  out[3] = 0.5 * Math.log(x * x + y * y + z * z + w * w);
  return out;
}
/**
 * Calculate the scalar power of a unit quaternion.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate the exponential of
 * @param {Number} b amount to scale the quaternion by
 * @returns {quat} out
 */

function pow(out, a, b) {
  ln(out, a);
  scale(out, out, b);
  exp(out, out);
  return out;
}
/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */

function slerp(out, a, b, t) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];
  var omega, cosom, sinom, scale0, scale1; // calc cosine

  cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  } // calculate coefficients


  if (1.0 - cosom > _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    // standard case (slerp)
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  } // calculate final values


  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
/**
 * Generates a random unit quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */

function random(out) {
  // Implementation of http://planning.cs.uiuc.edu/node198.html
  // TODO: Calling random 3 times is probably not the fastest solution
  var u1 = glMatrix.RANDOM();
  var u2 = glMatrix.RANDOM();
  var u3 = glMatrix.RANDOM();
  var sqrt1MinusU1 = Math.sqrt(1 - u1);
  var sqrtU1 = Math.sqrt(u1);
  out[0] = sqrt1MinusU1 * Math.sin(2.0 * Math.PI * u2);
  out[1] = sqrt1MinusU1 * Math.cos(2.0 * Math.PI * u2);
  out[2] = sqrtU1 * Math.sin(2.0 * Math.PI * u3);
  out[3] = sqrtU1 * Math.cos(2.0 * Math.PI * u3);
  return out;
}
/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate inverse of
 * @returns {quat} out
 */

function invert(out, a) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
  var invDot = dot ? 1.0 / dot : 0; // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

  out[0] = -a0 * invDot;
  out[1] = -a1 * invDot;
  out[2] = -a2 * invDot;
  out[3] = a3 * invDot;
  return out;
}
/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate conjugate of
 * @returns {quat} out
 */

function conjugate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
}
/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyMat3} m rotation matrix
 * @returns {quat} out
 * @function
 */

function fromMat3(out, m) {
  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
  // article "Quaternion Calculus and Fast Animation".
  var fTrace = m[0] + m[4] + m[8];
  var fRoot;

  if (fTrace > 0.0) {
    // |w| > 1/2, may as well choose w > 1/2
    fRoot = Math.sqrt(fTrace + 1.0); // 2w

    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot; // 1/(4w)

    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    // |w| <= 1/2
    var i = 0;
    if (m[4] > m[0]) i = 1;
    if (m[8] > m[i * 3 + i]) i = 2;
    var j = (i + 1) % 3;
    var k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }

  return out;
}
/**
 * Creates a quaternion from the given euler angle x, y, z.
 *
 * @param {quat} out the receiving quaternion
 * @param {x} Angle to rotate around X axis in degrees.
 * @param {y} Angle to rotate around Y axis in degrees.
 * @param {z} Angle to rotate around Z axis in degrees.
 * @returns {quat} out
 * @function
 */

function fromEuler(out, x, y, z) {
  var halfToRad = 0.5 * Math.PI / 180.0;
  x *= halfToRad;
  y *= halfToRad;
  z *= halfToRad;
  var sx = Math.sin(x);
  var cx = Math.cos(x);
  var sy = Math.sin(y);
  var cy = Math.cos(y);
  var sz = Math.sin(z);
  var cz = Math.cos(z);
  out[0] = sx * cy * cz - cx * sy * sz;
  out[1] = cx * sy * cz + sx * cy * sz;
  out[2] = cx * cy * sz - sx * sy * cz;
  out[3] = cx * cy * cz + sx * sy * sz;
  return out;
}
/**
 * Returns a string representation of a quatenion
 *
 * @param {ReadonlyQuat} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str(a) {
  return "quat(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
}
/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {ReadonlyQuat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */

var clone = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.clone;
/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */

var fromValues = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.fromValues;
/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the source quaternion
 * @returns {quat} out
 * @function
 */

var copy = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.copy;
/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */

var set = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.set;
/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @returns {quat} out
 * @function
 */

var add = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.add;
/**
 * Alias for {@link quat.multiply}
 * @function
 */

var mul = (/* unused pure expression or super */ null && (multiply));
/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {ReadonlyQuat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */

var scale = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.scale;
/**
 * Calculates the dot product of two quat's
 *
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */

var dot = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.dot;
/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 * @function
 */

var lerp = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.lerp;
/**
 * Calculates the length of a quat
 *
 * @param {ReadonlyQuat} a vector to calculate length of
 * @returns {Number} length of a
 */

var length = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.length;
/**
 * Alias for {@link quat.length}
 * @function
 */

var len = (/* unused pure expression or super */ null && (length));
/**
 * Calculates the squared length of a quat
 *
 * @param {ReadonlyQuat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */

var squaredLength = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.squaredLength;
/**
 * Alias for {@link quat.squaredLength}
 * @function
 */

var sqrLen = (/* unused pure expression or super */ null && (squaredLength));
/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */

var normalize = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.normalize;
/**
 * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyQuat} a The first quaternion.
 * @param {ReadonlyQuat} b The second quaternion.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

var exactEquals = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.exactEquals;
/**
 * Returns whether or not the quaternions have approximately the same elements in the same position.
 *
 * @param {ReadonlyQuat} a The first vector.
 * @param {ReadonlyQuat} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

var equals = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.equals;
/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {ReadonlyVec3} a the initial vector
 * @param {ReadonlyVec3} b the destination vector
 * @returns {quat} out
 */

var rotationTo = function () {
  var tmpvec3 = _vec3_js__WEBPACK_IMPORTED_MODULE_2__.create();
  var xUnitVec3 = _vec3_js__WEBPACK_IMPORTED_MODULE_2__.fromValues(1, 0, 0);
  var yUnitVec3 = _vec3_js__WEBPACK_IMPORTED_MODULE_2__.fromValues(0, 1, 0);
  return function (out, a, b) {
    var dot = _vec3_js__WEBPACK_IMPORTED_MODULE_2__.dot(a, b);

    if (dot < -0.999999) {
      _vec3_js__WEBPACK_IMPORTED_MODULE_2__.cross(tmpvec3, xUnitVec3, a);
      if (_vec3_js__WEBPACK_IMPORTED_MODULE_2__.len(tmpvec3) < 0.000001) _vec3_js__WEBPACK_IMPORTED_MODULE_2__.cross(tmpvec3, yUnitVec3, a);
      _vec3_js__WEBPACK_IMPORTED_MODULE_2__.normalize(tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      _vec3_js__WEBPACK_IMPORTED_MODULE_2__.cross(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot;
      return normalize(out, out);
    }
  };
}();
/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {ReadonlyQuat} c the third operand
 * @param {ReadonlyQuat} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */

var sqlerp = function () {
  var temp1 = create();
  var temp2 = create();
  return function (out, a, b, c, d, t) {
    slerp(temp1, a, d, t);
    slerp(temp2, b, c, t);
    slerp(out, temp1, temp2, 2 * t * (1 - t));
    return out;
  };
}();
/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {ReadonlyVec3} view  the vector representing the viewing direction
 * @param {ReadonlyVec3} right the vector representing the local "right" direction
 * @param {ReadonlyVec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */

var setAxes = function () {
  var matr = _mat3_js__WEBPACK_IMPORTED_MODULE_1__.create();
  return function (out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];
    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];
    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];
    return normalize(out, fromMat3(out, matr));
  };
}();

/***/ }),

/***/ 9175:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ 15958:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   clone: () => (/* binding */ clone),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   dot: () => (/* binding */ dot),
/* harmony export */   equals: () => (/* binding */ equals),
/* harmony export */   exactEquals: () => (/* binding */ exactEquals),
/* harmony export */   fromValues: () => (/* binding */ fromValues),
/* harmony export */   length: () => (/* binding */ length),
/* harmony export */   lerp: () => (/* binding */ lerp),
/* harmony export */   normalize: () => (/* binding */ normalize),
/* harmony export */   scale: () => (/* binding */ scale),
/* harmony export */   set: () => (/* binding */ set),
/* harmony export */   squaredLength: () => (/* binding */ squaredLength)
/* harmony export */ });
/* unused harmony exports create, subtract, multiply, divide, ceil, floor, min, max, round, scaleAndAdd, distance, squaredDistance, negate, inverse, cross, random, transformMat4, transformQuat, zero, str, sub, mul, div, dist, sqrDist, len, sqrLen, forEach */
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24457);

/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */

function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(4);

  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }

  return out;
}
/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {ReadonlyVec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */

function clone(a) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */

function fromValues(x, y, z, w) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(4);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the source vector
 * @returns {vec4} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */

function set(out, x, y, z, w) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  return out;
}
/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  out[3] = a[3] * b[3];
  return out;
}
/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  out[3] = a[3] / b[3];
  return out;
}
/**
 * Math.ceil the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to ceil
 * @returns {vec4} out
 */

function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  out[3] = Math.ceil(a[3]);
  return out;
}
/**
 * Math.floor the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to floor
 * @returns {vec4} out
 */

function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  out[3] = Math.floor(a[3]);
  return out;
}
/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  out[3] = Math.min(a[3], b[3]);
  return out;
}
/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  out[3] = Math.max(a[3], b[3]);
  return out;
}
/**
 * Math.round the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to round
 * @returns {vec4} out
 */

function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  out[3] = Math.round(a[3]);
  return out;
}
/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */

function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}
/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */

function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  return out;
}
/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {Number} distance between a and b
 */

function distance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  var w = b[3] - a[3];
  return Math.hypot(x, y, z, w);
}
/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {Number} squared distance between a and b
 */

function squaredDistance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  var w = b[3] - a[3];
  return x * x + y * y + z * z + w * w;
}
/**
 * Calculates the length of a vec4
 *
 * @param {ReadonlyVec4} a vector to calculate length of
 * @returns {Number} length of a
 */

function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return Math.hypot(x, y, z, w);
}
/**
 * Calculates the squared length of a vec4
 *
 * @param {ReadonlyVec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return x * x + y * y + z * z + w * w;
}
/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to negate
 * @returns {vec4} out
 */

function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = -a[3];
  return out;
}
/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to invert
 * @returns {vec4} out
 */

function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  out[3] = 1.0 / a[3];
  return out;
}
/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to normalize
 * @returns {vec4} out
 */

function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  var len = x * x + y * y + z * z + w * w;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }

  out[0] = x * len;
  out[1] = y * len;
  out[2] = z * len;
  out[3] = w * len;
  return out;
}
/**
 * Calculates the dot product of two vec4's
 *
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}
/**
 * Returns the cross-product of three vectors in a 4-dimensional space
 *
 * @param {ReadonlyVec4} result the receiving vector
 * @param {ReadonlyVec4} U the first vector
 * @param {ReadonlyVec4} V the second vector
 * @param {ReadonlyVec4} W the third vector
 * @returns {vec4} result
 */

function cross(out, u, v, w) {
  var A = v[0] * w[1] - v[1] * w[0],
      B = v[0] * w[2] - v[2] * w[0],
      C = v[0] * w[3] - v[3] * w[0],
      D = v[1] * w[2] - v[2] * w[1],
      E = v[1] * w[3] - v[3] * w[1],
      F = v[2] * w[3] - v[3] * w[2];
  var G = u[0];
  var H = u[1];
  var I = u[2];
  var J = u[3];
  out[0] = H * F - I * E + J * D;
  out[1] = -(G * F) + I * C - J * B;
  out[2] = G * E - H * C + J * A;
  out[3] = -(G * D) + H * B - I * A;
  return out;
}
/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec4} out
 */

function lerp(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  var aw = a[3];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  out[3] = aw + t * (b[3] - aw);
  return out;
}
/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */

function random(out, scale) {
  scale = scale || 1.0; // Marsaglia, George. Choosing a Point from the Surface of a
  // Sphere. Ann. Math. Statist. 43 (1972), no. 2, 645--646.
  // http://projecteuclid.org/euclid.aoms/1177692644;

  var v1, v2, v3, v4;
  var s1, s2;

  do {
    v1 = glMatrix.RANDOM() * 2 - 1;
    v2 = glMatrix.RANDOM() * 2 - 1;
    s1 = v1 * v1 + v2 * v2;
  } while (s1 >= 1);

  do {
    v3 = glMatrix.RANDOM() * 2 - 1;
    v4 = glMatrix.RANDOM() * 2 - 1;
    s2 = v3 * v3 + v4 * v4;
  } while (s2 >= 1);

  var d = Math.sqrt((1 - s1) / s2);
  out[0] = scale * v1;
  out[1] = scale * v2;
  out[2] = scale * v3 * d;
  out[3] = scale * v4 * d;
  return out;
}
/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec4} out
 */

function transformMat4(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2],
      w = a[3];
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
  return out;
}
/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to transform
 * @param {ReadonlyQuat} q quaternion to transform with
 * @returns {vec4} out
 */

function transformQuat(out, a, q) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3]; // calculate quat * vec

  var ix = qw * x + qy * z - qz * y;
  var iy = qw * y + qz * x - qx * z;
  var iz = qw * z + qx * y - qy * x;
  var iw = -qx * x - qy * y - qz * z; // calculate result * inverse quat

  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  out[3] = a[3];
  return out;
}
/**
 * Set the components of a vec4 to zero
 *
 * @param {vec4} out the receiving vector
 * @returns {vec4} out
 */

function zero(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  return out;
}
/**
 * Returns a string representation of a vector
 *
 * @param {ReadonlyVec4} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str(a) {
  return "vec4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
}
/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyVec4} a The first vector.
 * @param {ReadonlyVec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {ReadonlyVec4} a The first vector.
 * @param {ReadonlyVec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  return Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
}
/**
 * Alias for {@link vec4.subtract}
 * @function
 */

var sub = (/* unused pure expression or super */ null && (subtract));
/**
 * Alias for {@link vec4.multiply}
 * @function
 */

var mul = (/* unused pure expression or super */ null && (multiply));
/**
 * Alias for {@link vec4.divide}
 * @function
 */

var div = (/* unused pure expression or super */ null && (divide));
/**
 * Alias for {@link vec4.distance}
 * @function
 */

var dist = (/* unused pure expression or super */ null && (distance));
/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */

var sqrDist = (/* unused pure expression or super */ null && (squaredDistance));
/**
 * Alias for {@link vec4.length}
 * @function
 */

var len = (/* unused pure expression or super */ null && (length));
/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */

var sqrLen = (/* unused pure expression or super */ null && (squaredLength));
/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
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
      stride = 4;
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
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }

    return a;
  };
}();

/***/ }),

/***/ 56037:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// A library of seedable RNGs implemented in Javascript.
//
// Usage:
//
// var seedrandom = require('seedrandom');
// var random = seedrandom(1); // or any seed.
// var x = random();       // 0 <= x < 1.  Every bit is random.
// var x = random.quick(); // 0 <= x < 1.  32 bits of randomness.

// alea, a 53-bit multiply-with-carry generator by Johannes Baagøe.
// Period: ~2^116
// Reported to pass all BigCrush tests.
var alea = __webpack_require__(89738);

// xor128, a pure xor-shift generator by George Marsaglia.
// Period: 2^128-1.
// Reported to fail: MatrixRank and LinearComp.
var xor128 = __webpack_require__(81327);

// xorwow, George Marsaglia's 160-bit xor-shift combined plus weyl.
// Period: 2^192-2^32
// Reported to fail: CollisionOver, SimpPoker, and LinearComp.
var xorwow = __webpack_require__(21897);

// xorshift7, by François Panneton and Pierre L'ecuyer, takes
// a different approach: it adds robustness by allowing more shifts
// than Marsaglia's original three.  It is a 7-shift generator
// with 256 bits, that passes BigCrush with no systmatic failures.
// Period 2^256-1.
// No systematic BigCrush failures reported.
var xorshift7 = __webpack_require__(49329);

// xor4096, by Richard Brent, is a 4096-bit xor-shift with a
// very long period that also adds a Weyl generator. It also passes
// BigCrush with no systematic failures.  Its long period may
// be useful if you have many generators and need to avoid
// collisions.
// Period: 2^4128-2^32.
// No systematic BigCrush failures reported.
var xor4096 = __webpack_require__(95967);

// Tyche-i, by Samuel Neves and Filipe Araujo, is a bit-shifting random
// number generator derived from ChaCha, a modern stream cipher.
// https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf
// Period: ~2^127
// No systematic BigCrush failures reported.
var tychei = __webpack_require__(68415);

// The original ARC4-based prng included in this library.
// Period: ~2^1600
var sr = __webpack_require__(17663);

sr.alea = alea;
sr.xor128 = xor128;
sr.xorwow = xorwow;
sr.xorshift7 = xorshift7;
sr.xor4096 = xor4096;
sr.tychei = tychei;

module.exports = sr;


/***/ })

}]);