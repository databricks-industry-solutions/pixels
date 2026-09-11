"use strict";
(globalThis["rspackChunk"] = globalThis["rspackChunk"] || []).push([[341], {
24457(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  p8: () => (EPSILON),
  tb: () => (ARRAY_TYPE)
});
/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
var RANDOM = (/* unused pure expression or super */ null && (Math.random));
/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Float32ArrayConstructor | ArrayConstructor} type Array type, such as Float32Array or Array
 */

function setMatrixArrayType(type) {
  ARRAY_TYPE = type;
}
var degree = (/* unused pure expression or super */ null && (Math.PI / 180));
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

},
40230(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  eR: () => (/* reexport module object */ _vec3_js__rspack_import_8),
  pB: () => (/* reexport module object */ _mat4_js__rspack_import_4),
  w0: () => (/* reexport module object */ _mat3_js__rspack_import_3)
});
/* import */ var _common_js__rspack_import_0 = __webpack_require__(24457);
/* import */ var _mat2_js__rspack_import_1 = __webpack_require__(98232);
/* import */ var _mat2d_js__rspack_import_2 = __webpack_require__(72918);
/* import */ var _mat3_js__rspack_import_3 = __webpack_require__(32591);
/* import */ var _mat4_js__rspack_import_4 = __webpack_require__(28910);
/* import */ var _quat_js__rspack_import_5 = __webpack_require__(50095);
/* import */ var _quat2_js__rspack_import_6 = __webpack_require__(16953);
/* import */ var _vec2_js__rspack_import_7 = __webpack_require__(67872);
/* import */ var _vec3_js__rspack_import_8 = __webpack_require__(9175);
/* import */ var _vec4_js__rspack_import_9 = __webpack_require__(15958);












},
32591(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  create: () => (create),
  identity: () => (identity)
});
/* import */ var _common_js__rspack_import_0 = __webpack_require__(24457);

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
  var out = new _common_js__rspack_import_0/* .ARRAY_TYPE */.tb(9);

  if (_common_js__rspack_import_0/* .ARRAY_TYPE */.tb != Float32Array) {
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
  var out = new glMatrix.ARRAY_TYPE(9);
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
  var out = new glMatrix.ARRAY_TYPE(9);
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
  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8));
}
/**
 * Alias for {@link mat3.multiply}
 * @function
 */

var mul = (/* unused pure expression or super */ null && (multiply));
/**
 * Alias for {@link mat3.subtract}
 * @function
 */

var sub = (/* unused pure expression or super */ null && (subtract));

},
28910(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  fromTranslation: () => (fromTranslation),
  invert: () => (invert),
  scale: () => (scale)
});
/* import */ var _common_js__rspack_import_0 = __webpack_require__(24457);

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */

function create() {
  var out = new glMatrix.ARRAY_TYPE(16);

  if (glMatrix.ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }

  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {ReadonlyMat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */

function clone(a) {
  var out = new glMatrix.ARRAY_TYPE(16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
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
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Create a new mat4 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} A new mat4
 */

function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  var out = new glMatrix.ARRAY_TYPE(16);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} out
 */

function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a12 = a[6],
        a13 = a[7];
    var a23 = a[11];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }

  return out;
}
/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function invert(out, a) {
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
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function adjoint(out, a) {
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
  out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
  out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
  out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
  out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
  out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
  out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
  out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
  out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
  out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
  out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
  out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
  out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
  out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
  out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
  out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
  out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
  return out;
}
/**
 * Calculates the determinant of a mat4
 *
 * @param {ReadonlyMat4} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant(a) {
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

  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function multiply(out, a, b) {
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
      a33 = a[15]; // Cache only the current line of the second matrix

  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to translate
 * @param {ReadonlyVec3} v vector to translate by
 * @returns {mat4} out
 */

function translate(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}
/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {ReadonlyVec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/

function scale(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function rotate(out, a, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var b00, b01, b02;
  var b10, b11, b12;
  var b20, b21, b22;

  if (len < glMatrix.EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11]; // Construct the elements of the rotation matrix

  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  return out;
}
/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateX(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateY(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateZ(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyVec3} v Translation vector
 * @returns {mat4} out
 */

function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyVec3} v Scaling vector
 * @returns {mat4} out
 */

function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = v[1];
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function fromRotation(out, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;

  if (len < glMatrix.EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c; // Perform rotation-specific matrix multiplication

  out[0] = x * x * t + c;
  out[1] = y * x * t + z * s;
  out[2] = z * x * t - y * s;
  out[3] = 0;
  out[4] = x * y * t - z * s;
  out[5] = y * y * t + c;
  out[6] = z * y * t + x * s;
  out[7] = 0;
  out[8] = x * z * t + y * s;
  out[9] = y * z * t - x * s;
  out[10] = z * z * t + c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromXRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = c;
  out[6] = s;
  out[7] = 0;
  out[8] = 0;
  out[9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromYRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = c;
  out[1] = 0;
  out[2] = -s;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = s;
  out[9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromZRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = c;
  out[1] = s;
  out[2] = 0;
  out[3] = 0;
  out[4] = -s;
  out[5] = c;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @returns {mat4} out
 */

function fromRotationTranslation(out, q, v) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a new mat4 from a dual quat.
 *
 * @param {mat4} out Matrix
 * @param {ReadonlyQuat2} a Dual Quaternion
 * @returns {mat4} mat4 receiving operation result
 */

function fromQuat2(out, a) {
  var translation = new glMatrix.ARRAY_TYPE(3);
  var bx = -a[0],
      by = -a[1],
      bz = -a[2],
      bw = a[3],
      ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7];
  var magnitude = bx * bx + by * by + bz * bz + bw * bw; //Only scale if it makes sense

  if (magnitude > 0) {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
  } else {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
  }

  fromRotationTranslation(out, a, translation);
  return out;
}
/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */

function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}
/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion paramter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */

function getScaling(out, mat) {
  var m11 = mat[0];
  var m12 = mat[1];
  var m13 = mat[2];
  var m21 = mat[4];
  var m22 = mat[5];
  var m23 = mat[6];
  var m31 = mat[8];
  var m32 = mat[9];
  var m33 = mat[10];
  out[0] = Math.hypot(m11, m12, m13);
  out[1] = Math.hypot(m21, m22, m23);
  out[2] = Math.hypot(m31, m32, m33);
  return out;
}
/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */

function getRotation(out, mat) {
  var scaling = new glMatrix.ARRAY_TYPE(3);
  getScaling(scaling, mat);
  var is1 = 1 / scaling[0];
  var is2 = 1 / scaling[1];
  var is3 = 1 / scaling[2];
  var sm11 = mat[0] * is1;
  var sm12 = mat[1] * is2;
  var sm13 = mat[2] * is3;
  var sm21 = mat[4] * is1;
  var sm22 = mat[5] * is2;
  var sm23 = mat[6] * is3;
  var sm31 = mat[8] * is1;
  var sm32 = mat[9] * is2;
  var sm33 = mat[10] * is3;
  var trace = sm11 + sm22 + sm33;
  var S = 0;

  if (trace > 0) {
    S = Math.sqrt(trace + 1.0) * 2;
    out[3] = 0.25 * S;
    out[0] = (sm23 - sm32) / S;
    out[1] = (sm31 - sm13) / S;
    out[2] = (sm12 - sm21) / S;
  } else if (sm11 > sm22 && sm11 > sm33) {
    S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
    out[3] = (sm23 - sm32) / S;
    out[0] = 0.25 * S;
    out[1] = (sm12 + sm21) / S;
    out[2] = (sm31 + sm13) / S;
  } else if (sm22 > sm33) {
    S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
    out[3] = (sm31 - sm13) / S;
    out[0] = (sm12 + sm21) / S;
    out[1] = 0.25 * S;
    out[2] = (sm23 + sm32) / S;
  } else {
    S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
    out[3] = (sm12 - sm21) / S;
    out[0] = (sm31 + sm13) / S;
    out[1] = (sm23 + sm32) / S;
    out[2] = 0.25 * S;
  }

  return out;
}
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @param {ReadonlyVec3} s Scaling vector
 * @returns {mat4} out
 */

function fromRotationTranslationScale(out, q, v, s) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @param {ReadonlyVec3} s Scaling vector
 * @param {ReadonlyVec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */

function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  var ox = o[0];
  var oy = o[1];
  var oz = o[2];
  var out0 = (1 - (yy + zz)) * sx;
  var out1 = (xy + wz) * sx;
  var out2 = (xz - wy) * sx;
  var out4 = (xy - wz) * sy;
  var out5 = (1 - (xx + zz)) * sy;
  var out6 = (yz + wx) * sy;
  var out8 = (xz + wy) * sz;
  var out9 = (yz - wx) * sz;
  var out10 = (1 - (xx + yy)) * sz;
  out[0] = out0;
  out[1] = out1;
  out[2] = out2;
  out[3] = 0;
  out[4] = out4;
  out[5] = out5;
  out[6] = out6;
  out[7] = 0;
  out[8] = out8;
  out[9] = out9;
  out[10] = out10;
  out[11] = 0;
  out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
  out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
  out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
  out[15] = 1;
  return out;
}
/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyQuat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
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
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;
  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;
  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */

function frustum(out, left, right, bottom, top, near, far) {
  var rl = 1 / (right - left);
  var tb = 1 / (top - bottom);
  var nf = 1 / (near - far);
  out[0] = near * 2 * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = near * 2 * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near * 2 * nf;
  out[15] = 0;
  return out;
}
/**
 * Generates a perspective projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

function perspectiveNO(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2),
      nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }

  return out;
}
/**
 * Alias for {@link mat4.perspectiveNO}
 * @function
 */

var perspective = (/* unused pure expression or super */ null && (perspectiveNO));
/**
 * Generates a perspective projection matrix suitable for WebGPU with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
 * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

function perspectiveZO(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2),
      nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = far * nf;
    out[14] = far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -near;
  }

  return out;
}
/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function perspectiveFromFieldOfView(out, fov, near, far) {
  var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
  var downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
  var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
  var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
  var xScale = 2.0 / (leftTan + rightTan);
  var yScale = 2.0 / (upTan + downTan);
  out[0] = xScale;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  out[4] = 0.0;
  out[5] = yScale;
  out[6] = 0.0;
  out[7] = 0.0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[9] = (upTan - downTan) * yScale * 0.5;
  out[10] = far / (near - far);
  out[11] = -1.0;
  out[12] = 0.0;
  out[13] = 0.0;
  out[14] = far * near / (near - far);
  out[15] = 0.0;
  return out;
}
/**
 * Generates a orthogonal projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function orthoNO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
/**
 * Alias for {@link mat4.orthoNO}
 * @function
 */

var ortho = (/* unused pure expression or super */ null && (orthoNO));
/**
 * Generates a orthogonal projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
 * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function orthoZO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = near * nf;
  out[15] = 1;
  return out;
}
/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis.
 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */

function lookAt(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];
  var upx = up[0];
  var upy = up[1];
  var upz = up[2];
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];

  if (Math.abs(eyex - centerx) < glMatrix.EPSILON && Math.abs(eyey - centery) < glMatrix.EPSILON && Math.abs(eyez - centerz) < glMatrix.EPSILON) {
    return identity(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;
  len = 1 / Math.hypot(z0, z1, z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;
  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.hypot(x0, x1, x2);

  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;
  len = Math.hypot(y0, y1, y2);

  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;
  return out;
}
/**
 * Generates a matrix that makes something look at something else.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */

function targetTo(out, eye, target, up) {
  var eyex = eye[0],
      eyey = eye[1],
      eyez = eye[2],
      upx = up[0],
      upy = up[1],
      upz = up[2];
  var z0 = eyex - target[0],
      z1 = eyey - target[1],
      z2 = eyez - target[2];
  var len = z0 * z0 + z1 * z1 + z2 * z2;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }

  var x0 = upy * z2 - upz * z1,
      x1 = upz * z0 - upx * z2,
      x2 = upx * z1 - upy * z0;
  len = x0 * x0 + x1 * x1 + x2 * x2;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
}
/**
 * Returns a string representation of a mat4
 *
 * @param {ReadonlyMat4} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */

function str(a) {
  return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
}
/**
 * Returns Frobenius norm of a mat4
 *
 * @param {ReadonlyMat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */

function frob(a) {
  return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
}
/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
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
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
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
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
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
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
}
/**
 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat4} out the receiving vector
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat4} out
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
  out[9] = a[9] + b[9] * scale;
  out[10] = a[10] + b[10] * scale;
  out[11] = a[11] + b[11] * scale;
  out[12] = a[12] + b[12] * scale;
  out[13] = a[13] + b[13] * scale;
  out[14] = a[14] + b[14] * scale;
  out[15] = a[15] + b[15] * scale;
  return out;
}
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyMat4} a The first matrix.
 * @param {ReadonlyMat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {ReadonlyMat4} a The first matrix.
 * @param {ReadonlyMat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var a4 = a[4],
      a5 = a[5],
      a6 = a[6],
      a7 = a[7];
  var a8 = a[8],
      a9 = a[9],
      a10 = a[10],
      a11 = a[11];
  var a12 = a[12],
      a13 = a[13],
      a14 = a[14],
      a15 = a[15];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  var b4 = b[4],
      b5 = b[5],
      b6 = b[6],
      b7 = b[7];
  var b8 = b[8],
      b9 = b[9],
      b10 = b[10],
      b11 = b[11];
  var b12 = b[12],
      b13 = b[13],
      b14 = b[14],
      b15 = b[15];
  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15));
}
/**
 * Alias for {@link mat4.multiply}
 * @function
 */

var mul = (/* unused pure expression or super */ null && (multiply));
/**
 * Alias for {@link mat4.subtract}
 * @function
 */

var sub = (/* unused pure expression or super */ null && (subtract));

},
50095(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Bw: () => (length),
  C: () => (copy),
  Om: () => (dot),
  m3: () => (squaredLength)
});
/* import */ var _common_js__rspack_import_0 = __webpack_require__(24457);
/* import */ var _mat3_js__rspack_import_1 = __webpack_require__(32591);
/* import */ var _vec3_js__rspack_import_2 = __webpack_require__(9175);
/* import */ var _vec4_js__rspack_import_3 = __webpack_require__(15958);




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
  var out = new _common_js__rspack_import_0/* .ARRAY_TYPE */.tb(4);

  if (_common_js__rspack_import_0/* .ARRAY_TYPE */.tb != Float32Array) {
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


  if (1.0 - cosom > _common_js__rspack_import_0/* .EPSILON */.p8) {
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

var clone = _vec4_js__rspack_import_3/* .clone */.o8;
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

var fromValues = _vec4_js__rspack_import_3/* .fromValues */.fA;
/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the source quaternion
 * @returns {quat} out
 * @function
 */

var copy = _vec4_js__rspack_import_3/* .copy */.C;
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

var set = _vec4_js__rspack_import_3/* .set */.hZ;
/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @returns {quat} out
 * @function
 */

var add = _vec4_js__rspack_import_3/* .add */.WQ;
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

var scale = _vec4_js__rspack_import_3/* .scale */.hs;
/**
 * Calculates the dot product of two quat's
 *
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */

var dot = _vec4_js__rspack_import_3/* .dot */.Om;
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

var lerp = _vec4_js__rspack_import_3/* .lerp */.Cc;
/**
 * Calculates the length of a quat
 *
 * @param {ReadonlyQuat} a vector to calculate length of
 * @returns {Number} length of a
 */

var length = _vec4_js__rspack_import_3/* .length */.Bw;
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

var squaredLength = _vec4_js__rspack_import_3/* .squaredLength */.m3;
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

var normalize = _vec4_js__rspack_import_3/* .normalize */.S8;
/**
 * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyQuat} a The first quaternion.
 * @param {ReadonlyQuat} b The second quaternion.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

var exactEquals = _vec4_js__rspack_import_3/* .exactEquals */.t2;
/**
 * Returns whether or not the quaternions have approximately the same elements in the same position.
 *
 * @param {ReadonlyQuat} a The first vector.
 * @param {ReadonlyQuat} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

var equals = _vec4_js__rspack_import_3/* .equals */.aI;
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
  var tmpvec3 = _vec3_js__rspack_import_2/* .create */.vt();
  var xUnitVec3 = _vec3_js__rspack_import_2/* .fromValues */.fA(1, 0, 0);
  var yUnitVec3 = _vec3_js__rspack_import_2/* .fromValues */.fA(0, 1, 0);
  return function (out, a, b) {
    var dot = _vec3_js__rspack_import_2/* .dot */.Om(a, b);

    if (dot < -0.999999) {
      _vec3_js__rspack_import_2/* .cross */.$A(tmpvec3, xUnitVec3, a);
      if (_vec3_js__rspack_import_2/* .len */.Il(tmpvec3) < 0.000001) _vec3_js__rspack_import_2/* .cross */.$A(tmpvec3, yUnitVec3, a);
      _vec3_js__rspack_import_2/* .normalize */.S8(tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      _vec3_js__rspack_import_2/* .cross */.$A(tmpvec3, a, b);
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
  var matr = _mat3_js__rspack_import_1.create();
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

},
67872(__unused_rspack_module, __unused_rspack___webpack_exports__, __webpack_require__) {
/* import */ var _common_js__rspack_import_0 = __webpack_require__(24457);

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
  var out = new _common_js__rspack_import_0/* .ARRAY_TYPE */.tb(2);

  if (_common_js__rspack_import_0/* .ARRAY_TYPE */.tb != Float32Array) {
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

function length(a) {
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

var len = (/* unused pure expression or super */ null && (length));
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

},
9175(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  $A: () => (cross),
  Il: () => (len),
  Om: () => (dot),
  S8: () => (normalize),
  Z0: () => (transformMat4),
  fA: () => (fromValues),
  vt: () => (create)
});
/* import */ var _common_js__rspack_import_0 = __webpack_require__(24457);

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
  var out = new _common_js__rspack_import_0/* .ARRAY_TYPE */.tb(3);

  if (_common_js__rspack_import_0/* .ARRAY_TYPE */.tb != Float32Array) {
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
  var out = new glMatrix.ARRAY_TYPE(3);
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
  var out = new _common_js__rspack_import_0/* .ARRAY_TYPE */.tb(3);
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
  var r = glMatrix.RANDOM() * 2.0 * Math.PI;
  var z = glMatrix.RANDOM() * 2.0 - 1.0;
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
  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2));
}
/**
 * Alias for {@link vec3.subtract}
 * @function
 */

var sub = (/* unused pure expression or super */ null && (subtract));
/**
 * Alias for {@link vec3.multiply}
 * @function
 */

var mul = (/* unused pure expression or super */ null && (multiply));
/**
 * Alias for {@link vec3.divide}
 * @function
 */

var div = (/* unused pure expression or super */ null && (divide));
/**
 * Alias for {@link vec3.distance}
 * @function
 */

var dist = (/* unused pure expression or super */ null && (distance));
/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */

var sqrDist = (/* unused pure expression or super */ null && (squaredDistance));
/**
 * Alias for {@link vec3.length}
 * @function
 */

var len = length;
/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */

var sqrLen = (/* unused pure expression or super */ null && (squaredLength));
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

},
15958(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Bw: () => (length),
  C: () => (copy),
  Cc: () => (lerp),
  Om: () => (dot),
  S8: () => (normalize),
  WQ: () => (add),
  aI: () => (equals),
  fA: () => (fromValues),
  hZ: () => (set),
  hs: () => (scale),
  m3: () => (squaredLength),
  o8: () => (clone),
  t2: () => (exactEquals)
});
/* import */ var _common_js__rspack_import_0 = __webpack_require__(24457);

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
  var out = new _common_js__rspack_import_0/* .ARRAY_TYPE */.tb(4);

  if (_common_js__rspack_import_0/* .ARRAY_TYPE */.tb != Float32Array) {
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
  var out = new _common_js__rspack_import_0/* .ARRAY_TYPE */.tb(4);
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
  var out = new _common_js__rspack_import_0/* .ARRAY_TYPE */.tb(4);
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
  return Math.abs(a0 - b0) <= _common_js__rspack_import_0/* .EPSILON */.p8 * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__rspack_import_0/* .EPSILON */.p8 * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__rspack_import_0/* .EPSILON */.p8 * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _common_js__rspack_import_0/* .EPSILON */.p8 * Math.max(1.0, Math.abs(a3), Math.abs(b3));
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

},
445(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (DataArray_default)
});
/* import */ var _macros_js__rspack_import_0 = __webpack_require__(28241);
/* import */ var _DataArray_Constants_js__rspack_import_1 = __webpack_require__(25015);
/* import */ var _Math_js__rspack_import_2 = __webpack_require__(91352);



//#region Sources/Common/Core/DataArray/index.js
var { vtkErrorMacro } = _macros_js__rspack_import_0/* .macros_exports */.o$;
var { DefaultDataType } = _DataArray_Constants_js__rspack_import_1/* ["default"] */.Ay;
var EPSILON = 1e-6;
function fastComputeRange(arr, offset, numberOfComponents) {
	const len = arr.length;
	let min = Number.MAX_VALUE;
	let max = -Number.MAX_VALUE;
	let x;
	let i;
	for (i = offset; i < len; i += numberOfComponents) if (!Number.isNaN(arr[i])) {
		min = arr[i];
		max = min;
		break;
	}
	for (; i < len; i += numberOfComponents) {
		x = arr[i];
		if (x < min) min = x;
		else if (x > max) max = x;
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
			if (min > value) min = value;
			if (max < value) max = value;
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
function computeRange(values, component = 0, numberOfComponents = 1) {
	if (component < 0 && numberOfComponents > 1) {
		const numberOfValues = values.length / numberOfComponents;
		const data = new Float64Array(numberOfValues);
		for (let i = 0, j = 0; i < numberOfValues; ++i) {
			for (let nextJ = j + numberOfComponents; j < nextJ; ++j) data[i] += values[j] * values[j];
			data[i] **= .5;
		}
		return fastComputeRange(data, 0, 1);
	}
	return fastComputeRange(values, component < 0 ? 0 : component, numberOfComponents);
}
function ensureRangeSize(rangeArray, size = 0) {
	const ranges = rangeArray || [];
	while (ranges.length <= size) ranges.push(null);
	return ranges;
}
function getDataType(typedArray) {
	return Object.prototype.toString.call(typedArray).slice(8, -1);
}
function getMaxNorm(normArray) {
	const numComps = normArray.getNumberOfComponents();
	let maxNorm = 0;
	const tuple = new Array(numComps);
	for (let i = 0; i < normArray.getNumberOfTuples(); ++i) {
		normArray.getTuple(i, tuple);
		const norm$1 = (0,_Math_js__rspack_import_2/* .norm */.xb)(tuple, numComps);
		if (norm$1 > maxNorm) maxNorm = norm$1;
	}
	return maxNorm;
}
var STATIC = {
	computeRange,
	createRangeHelper,
	fastComputeRange,
	getDataType,
	getMaxNorm
};
function vtkDataArray(publicAPI, model) {
	model.classHierarchy.push("vtkDataArray");
	/**
	* Resize model.values and copy the old values to the new array.
	* @param {Number} requestedNumTuples Final expected number of tuples; must be >= 0
	* @returns {Boolean} True if a resize occured, false otherwise
	*/
	function resize(requestedNumTuples) {
		if (requestedNumTuples < 0) return false;
		const numComps = publicAPI.getNumberOfComponents();
		const numAllocatedTuples = model.values.length / (numComps > 0 ? numComps : 1);
		if (requestedNumTuples === numAllocatedTuples) return true;
		if (requestedNumTuples > numAllocatedTuples) {
			const oldValues = model.values;
			model.values = (0,_macros_js__rspack_import_0/* .newTypedArray */.OE)(model.dataType, (requestedNumTuples + numAllocatedTuples) * numComps);
			model.values.set(oldValues);
			return true;
		}
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
	publicAPI.allocate = (extraNumTuples) => {
		resize(publicAPI.getNumberOfTuples() + extraNumTuples);
	};
	publicAPI.resize = (requestedNumTuples) => {
		resize(requestedNumTuples);
		const newSize = requestedNumTuples * publicAPI.getNumberOfComponents();
		if (model.size !== newSize) {
			model.size = newSize;
			publicAPI.dataChange();
			return true;
		}
		return false;
	};
	publicAPI.initialize = () => {
		publicAPI.resize(0);
		return publicAPI;
	};
	publicAPI.getElementComponentSize = () => model.values.BYTES_PER_ELEMENT;
	publicAPI.getComponent = (tupleIdx, compIdx = 0) => model.values[tupleIdx * model.numberOfComponents + compIdx];
	publicAPI.setComponent = (tupleIdx, compIdx, value) => {
		if (value !== model.values[tupleIdx * model.numberOfComponents + compIdx]) {
			model.values[tupleIdx * model.numberOfComponents + compIdx] = value;
			publicAPI.dataChange();
		}
	};
	publicAPI.getValue = (valueIdx) => {
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
	publicAPI.getRange = (componentIndex = -1) => {
		let rangeIdx = componentIndex;
		if (rangeIdx < 0) rangeIdx = model.numberOfComponents === 1 ? 0 : model.numberOfComponents;
		let range = null;
		if (!model.ranges) model.ranges = ensureRangeSize(model.ranges, model.numberOfComponents);
		range = model.ranges[rangeIdx];
		if (range) {
			model.rangeTuple[0] = range.min;
			model.rangeTuple[1] = range.max;
			return model.rangeTuple;
		}
		range = computeRange(publicAPI.getData(), componentIndex, model.numberOfComponents);
		model.ranges[rangeIdx] = range;
		model.rangeTuple[0] = range.min;
		model.rangeTuple[1] = range.max;
		return model.rangeTuple;
	};
	publicAPI.setRange = (rangeValue, componentIndex) => {
		if (!model.ranges) model.ranges = ensureRangeSize(model.ranges, model.numberOfComponents);
		const range = {
			min: rangeValue.min,
			max: rangeValue.max
		};
		model.ranges[componentIndex] = range;
		model.rangeTuple[0] = range.min;
		model.rangeTuple[1] = range.max;
		return model.rangeTuple;
	};
	publicAPI.getRanges = (computeRanges = true) => {
		if (!computeRanges) return structuredClone(model.ranges);
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
		for (let i = 0; i < model.numberOfComponents; i++) model.values[offset + i] = tuple[i];
	};
	publicAPI.setTuples = (idx, tuples) => {
		let i = idx * model.numberOfComponents;
		const last = Math.min(tuples.length, model.size - i);
		for (let j = 0; j < last;) model.values[i++] = tuples[j++];
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
	publicAPI.insertNextTuple = (tuple) => {
		const idx = model.size / model.numberOfComponents;
		return publicAPI.insertTuple(idx, tuple);
	};
	publicAPI.insertNextTuples = (tuples) => {
		const idx = model.size / model.numberOfComponents;
		return publicAPI.insertTuples(idx, tuples);
	};
	publicAPI.findTuple = (tuple, precision = EPSILON) => {
		for (let i = 0; i < model.size; i += model.numberOfComponents) if (Math.abs(tuple[0] - model.values[i]) <= precision) {
			let match = true;
			for (let j = 1; j < model.numberOfComponents; ++j) if (Math.abs(tuple[j] - model.values[i + j]) > precision) {
				match = false;
				break;
			}
			if (match) return i / model.numberOfComponents;
		}
		return -1;
	};
	publicAPI.getTuple = (idx, tupleToFill = []) => {
		const numberOfComponents = model.numberOfComponents || 1;
		const offset = idx * numberOfComponents;
		switch (numberOfComponents) {
			case 4: tupleToFill[3] = model.values[offset + 3];
			case 3: tupleToFill[2] = model.values[offset + 2];
			case 2: tupleToFill[1] = model.values[offset + 1];
			case 1:
				tupleToFill[0] = model.values[offset];
				break;
			default: for (let i = numberOfComponents - 1; i >= 0; --i) tupleToFill[i] = model.values[offset + i];
		}
		return tupleToFill;
	};
	publicAPI.getTuples = (fromId, toId) => {
		const from = (fromId ?? 0) * model.numberOfComponents;
		const to = (toId ?? publicAPI.getNumberOfTuples()) * model.numberOfComponents;
		const arr = publicAPI.getData().subarray(from, to);
		return arr.length > 0 ? arr : null;
	};
	publicAPI.getTupleLocation = (idx = 1) => idx * model.numberOfComponents;
	publicAPI.getNumberOfComponents = () => model.numberOfComponents;
	publicAPI.getNumberOfValues = () => model.size;
	publicAPI.getNumberOfTuples = () => model.size / model.numberOfComponents;
	publicAPI.getDataType = () => model.dataType;
	publicAPI.newClone = () => newInstance({
		empty: true,
		name: model.name,
		dataType: model.dataType,
		numberOfComponents: model.numberOfComponents
	});
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
		if (numberOfComponents) model.numberOfComponents = numberOfComponents;
		if (model.size % model.numberOfComponents !== 0) model.numberOfComponents = 1;
		publicAPI.dataChange();
	};
	publicAPI.getState = ({ preserveTypedArrays = false } = {}) => {
		if (model.deleted) return null;
		const jsonArchive = {
			...model,
			vtkClass: publicAPI.getClassName()
		};
		if (!preserveTypedArrays) jsonArchive.values = Array.from(jsonArchive.values);
		delete jsonArchive.buffer;
		Object.keys(jsonArchive).forEach((keyName) => {
			if (!jsonArchive[keyName]) delete jsonArchive[keyName];
		});
		const sortedObj = {};
		Object.keys(jsonArchive).sort().forEach((name) => {
			sortedObj[name] = jsonArchive[name];
		});
		if (sortedObj.mtime) delete sortedObj.mtime;
		return sortedObj;
	};
	/**
	* @param {import("./index").vtkDataArray} other
	*/
	publicAPI.deepCopy = (other) => {
		const currentType = publicAPI.getDataType();
		const currentArray = model.values;
		publicAPI.shallowCopy(other);
		model.ranges = structuredClone(other.getRanges());
		if (currentArray?.length >= other.getNumberOfValues() && currentType === other.getDataType()) {
			currentArray.set(other.getData());
			model.values = currentArray;
			publicAPI.dataChange();
		} else publicAPI.setData(other.getData().slice());
	};
	publicAPI.interpolateTuple = (idx, source1, source1Idx, source2, source2Idx, t) => {
		const numberOfComponents = model.numberOfComponents || 1;
		if (numberOfComponents !== source1.getNumberOfComponents() || numberOfComponents !== source2.getNumberOfComponents()) vtkErrorMacro("numberOfComponents must match");
		const tuple1 = source1.getTuple(source1Idx);
		const tuple2 = source2.getTuple(source2Idx);
		const out = [];
		out.length = numberOfComponents;
		switch (numberOfComponents) {
			case 4: out[3] = tuple1[3] + (tuple2[3] - tuple1[3]) * t;
			case 3: out[2] = tuple1[2] + (tuple2[2] - tuple1[2]) * t;
			case 2: out[1] = tuple1[1] + (tuple2[1] - tuple1[1]) * t;
			case 1:
				out[0] = tuple1[0] + (tuple2[0] - tuple1[0]) * t;
				break;
			default: for (let i = 0; i < numberOfComponents; i++) out[i] = tuple1[i] + (tuple2[i] - tuple1[i]) * t;
		}
		return publicAPI.insertTuple(idx, out);
	};
}
var DEFAULT_VALUES = {
	name: "",
	numberOfComponents: 1,
	dataType: DefaultDataType,
	rangeTuple: [0, 0]
};
function extend(publicAPI, model, initialValues = {}) {
	Object.assign(model, DEFAULT_VALUES, initialValues);
	if (Array.isArray(initialValues.values) && initialValues.dataType === void 0) console.warn("vtkDataArray.newInstance: no dataType provided, converting to Float32Array");
	if (!model.empty && !model.values && !model.size) throw new TypeError("Cannot create vtkDataArray object without: size > 0, values");
	if (!model.values) model.values = (0,_macros_js__rspack_import_0/* .newTypedArray */.OE)(model.dataType, model.size);
	else if (Array.isArray(model.values)) model.values = (0,_macros_js__rspack_import_0/* .newTypedArrayFrom */.W2)(model.dataType, model.values);
	if (model.values) {
		model.size = model.size ?? model.values.length;
		model.dataType = getDataType(model.values);
	}
	(0,_macros_js__rspack_import_0/* .obj */.WL)(publicAPI, model);
	(0,_macros_js__rspack_import_0/* .set */.Ak)(publicAPI, model, ["name", "numberOfComponents"]);
	if (model.size % model.numberOfComponents !== 0) throw new RangeError("model.size is not a multiple of model.numberOfComponents");
	vtkDataArray(publicAPI, model);
}
var newInstance = (0,_macros_js__rspack_import_0/* .newInstance */.UI)(extend, "vtkDataArray");
var DataArray_default = {
	newInstance,
	extend,
	...STATIC,
	..._DataArray_Constants_js__rspack_import_1/* ["default"] */.Ay
};
//#endregion


//# sourceMappingURL=DataArray.js.map

},
25015(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (Constants_default)
});
//#region Sources/Common/Core/DataArray/Constants.js
var DataTypeByteSize = {
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
var VtkDataTypes = {
	VOID: "",
	CHAR: "Int8Array",
	SIGNED_CHAR: "Int8Array",
	UNSIGNED_CHAR: "Uint8Array",
	UNSIGNED_CHAR_CLAMPED: "Uint8ClampedArray",
	SHORT: "Int16Array",
	UNSIGNED_SHORT: "Uint16Array",
	INT: "Int32Array",
	UNSIGNED_INT: "Uint32Array",
	FLOAT: "Float32Array",
	DOUBLE: "Float64Array"
};
var DefaultDataType = VtkDataTypes.FLOAT;
var Constants_default = {
	DefaultDataType,
	DataTypeByteSize,
	VtkDataTypes
};
//#endregion


//# sourceMappingURL=Constants.js.map

},
91352(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  $A: () => (cross),
  Ay: () => (Math_default),
  LQ: () => (clampVector),
  Md: () => (roundVector),
  Om: () => (dot),
  Re: () => (subtract),
  WQ: () => (add),
  xb: () => (norm)
});
/* import */ var _virtual_rolldown_runtime_js__rspack_import_0 = __webpack_require__(85254);
/* import */ var _macros_js__rspack_import_1 = __webpack_require__(28241);
/* import */ var _Math_Constants_js__rspack_import_2 = __webpack_require__(29330);
/* import */ var seedrandom__rspack_import_3 = __webpack_require__(56037);




//#region Sources/Common/Core/Math/index.js
var Math_exports = /* @__PURE__ */ (/* unused pure expression or super */ null && (__exportAll({
	LUFactor3x3: () => LUFactor3x3,
	LUSolve3x3: () => LUSolve3x3,
	Pi: () => Pi,
	add: () => add,
	angleBetweenVectors: () => angleBetweenVectors,
	areBoundsInitialized: () => areBoundsInitialized,
	areEquals: () => areEquals,
	areMatricesEqual: () => areMatricesEqual,
	arrayMax: () => arrayMax,
	arrayMin: () => arrayMin,
	arrayRange: () => arrayRange,
	beginCombination: () => beginCombination,
	binomial: () => binomial,
	boundsIsWithinOtherBounds: () => boundsIsWithinOtherBounds,
	ceil: () => ceil,
	ceilLog2: () => ceilLog2,
	clampAndNormalizeValue: () => clampAndNormalizeValue,
	clampValue: () => clampValue,
	clampVector: () => clampVector,
	columnsToMat3: () => columnsToMat3,
	columnsToMat4: () => columnsToMat4,
	computeBoundsFromPoints: () => computeBoundsFromPoints,
	createArray: () => createArray,
	createUninitializedBounds: () => createUninitializedBounds,
	cross: () => cross,
	default: () => Math_default,
	degreesFromRadians: () => degreesFromRadians,
	determinant2x2: () => determinant2x2,
	determinant3x3: () => determinant3x3,
	diagonalize3x3: () => diagonalize3x3,
	distance2BetweenPoints: () => distance2BetweenPoints,
	dot: () => dot,
	dot2D: () => dot2D,
	estimateMatrixCondition: () => estimateMatrixCondition,
	extentIsWithinOtherExtent: () => extentIsWithinOtherExtent,
	factorial: () => factorial,
	float2CssRGBA: () => float2CssRGBA,
	floatRGB2HexCode: () => floatRGB2HexCode,
	floatToHex2: () => floatToHex2,
	floor: () => floor,
	gaussian: () => gaussian,
	gaussianAmplitude: () => gaussianAmplitude,
	gaussianWeight: () => gaussianWeight,
	getAdjustedScalarRange: () => getAdjustedScalarRange,
	getMajorAxisIndex: () => getMajorAxisIndex,
	getMinorAxisIndex: () => getMinorAxisIndex,
	getScalarTypeFittingRange: () => getScalarTypeFittingRange,
	getSeed: () => getSeed,
	getSparseOrthogonalMatrix: () => getSparseOrthogonalMatrix,
	hex2float: () => hex2float,
	hsv2rgb: () => hsv2rgb,
	identity: () => identity,
	identity3x3: () => identity3x3,
	inf: () => inf,
	invert3x3: () => invert3x3,
	invertMatrix: () => invertMatrix,
	isFinite: () => isFinite,
	isIdentity: () => isIdentity,
	isIdentity3x3: () => isIdentity3x3,
	isInf: () => isInf,
	isNaN: () => isNaN,
	isNan: () => isNan,
	isPowerOfTwo: () => isPowerOfTwo,
	jacobi: () => jacobi,
	jacobiN: () => jacobiN,
	lab2rgb: () => lab2rgb,
	lab2xyz: () => lab2xyz,
	ldexp: () => ldexp,
	linearSolve3x3: () => linearSolve3x3,
	luFactorLinearSystem: () => luFactorLinearSystem,
	luSolveLinearSystem: () => luSolveLinearSystem,
	matrix3x3ToQuaternion: () => matrix3x3ToQuaternion,
	max: () => max,
	min: () => min,
	multiply3x3_mat3: () => multiply3x3_mat3,
	multiply3x3_vect3: () => multiply3x3_vect3,
	multiplyAccumulate: () => multiplyAccumulate,
	multiplyAccumulate2D: () => multiplyAccumulate2D,
	multiplyMatrix: () => multiplyMatrix,
	multiplyQuaternion: () => multiplyQuaternion,
	multiplyScalar: () => multiplyScalar,
	multiplyScalar2D: () => multiplyScalar2D,
	nearestPowerOfTwo: () => nearestPowerOfTwo,
	negInf: () => negInf,
	nextCombination: () => nextCombination,
	norm: () => norm,
	norm2D: () => norm2D,
	normalize: () => normalize,
	normalize2D: () => normalize2D,
	normalize4D: () => normalize4D,
	orthogonalize3x3: () => orthogonalize3x3,
	outer: () => outer,
	outer2D: () => outer2D,
	perpendiculars: () => perpendiculars,
	pointIsWithinBounds: () => pointIsWithinBounds,
	projectVector: () => projectVector,
	projectVector2D: () => projectVector2D,
	quaternionToMatrix3x3: () => quaternionToMatrix3x3,
	radiansFromDegrees: () => radiansFromDegrees,
	random: () => random,
	randomSeed: () => randomSeed,
	rgb2hsv: () => rgb2hsv,
	rgb2lab: () => rgb2lab,
	rgb2xyz: () => rgb2xyz,
	round: () => round,
	roundNumber: () => roundNumber,
	roundVector: () => roundVector,
	rowsToMat3: () => rowsToMat3,
	rowsToMat4: () => rowsToMat4,
	signedAngleBetweenVectors: () => signedAngleBetweenVectors,
	singularValueDecomposition3x3: () => singularValueDecomposition3x3,
	solve3PointCircle: () => solve3PointCircle,
	solveHomogeneousLeastSquares: () => solveHomogeneousLeastSquares,
	solveLeastSquares: () => solveLeastSquares,
	solveLinearSystem: () => solveLinearSystem,
	subtract: () => subtract,
	transpose3x3: () => transpose3x3,
	uninitializeBounds: () => uninitializeBounds,
	xyz2lab: () => xyz2lab,
	xyz2rgb: () => xyz2rgb
})));
var { vtkErrorMacro, vtkWarningMacro } = _macros_js__rspack_import_1/* ["default"] */.Ay;
var randomSeedValue = 0;
var VTK_MAX_ROTATIONS = 20;
function notImplemented(method) {
	return () => vtkErrorMacro(`vtkMath::${method} - NOT IMPLEMENTED`);
}
function swapRowsMatrix_nxn(matrix, n, row1, row2) {
	let tmp;
	for (let i = 0; i < n; i++) {
		tmp = matrix[row1 * n + i];
		matrix[row1 * n + i] = matrix[row2 * n + i];
		matrix[row2 * n + i] = tmp;
	}
}
function swapColumnsMatrix_nxn(matrix, n, column1, column2) {
	let tmp;
	for (let i = 0; i < n; i++) {
		tmp = matrix[i * n + column1];
		matrix[i * n + column1] = matrix[i * n + column2];
		matrix[i * n + column2] = tmp;
	}
}
function createArray(size = 3) {
	const res = Array(size);
	for (let i = 0; i < size; ++i) res[i] = 0;
	return res;
}
var Pi = () => Math.PI;
function ldexp(x, exponent) {
	if (exponent > 1023) return x * 2 ** 1023 * 2 ** (exponent - 1023);
	if (exponent < -1074) return x * 2 ** -1074 * 2 ** (exponent + 1074);
	return x * 2 ** exponent;
}
function radiansFromDegrees(deg) {
	return deg / 180 * Math.PI;
}
function degreesFromRadians(rad) {
	return rad * 180 / Math.PI;
}
var { round, floor, ceil, min, max } = Math;
function arrayMin(arr, offset = 0, stride = 1) {
	let minValue = Infinity;
	for (let i = offset, len = arr.length; i < len; i += stride) if (arr[i] < minValue) minValue = arr[i];
	return minValue;
}
function arrayMax(arr, offset = 0, stride = 1) {
	let maxValue = -Infinity;
	for (let i = offset, len = arr.length; i < len; i += stride) if (maxValue < arr[i]) maxValue = arr[i];
	return maxValue;
}
function arrayRange(arr, offset = 0, stride = 1) {
	let minValue = Infinity;
	let maxValue = -Infinity;
	for (let i = offset, len = arr.length; i < len; i += stride) {
		if (arr[i] < minValue) minValue = arr[i];
		if (maxValue < arr[i]) maxValue = arr[i];
	}
	return [minValue, maxValue];
}
var ceilLog2 = notImplemented("ceilLog2");
var factorial = notImplemented("factorial");
function nearestPowerOfTwo(xi) {
	let v = 1;
	while (v < xi) v *= 2;
	return v;
}
function isPowerOfTwo(x) {
	return x === nearestPowerOfTwo(x);
}
function binomial(m, n) {
	let r = 1;
	for (let i = 1; i <= n; ++i) r *= (m - i + 1) / i;
	return Math.floor(r);
}
function beginCombination(m, n) {
	if (m < n) return 0;
	const r = createArray(n);
	for (let i = 0; i < n; ++i) r[i] = i;
	return r;
}
function nextCombination(m, n, r) {
	let status = 0;
	for (let i = n - 1; i >= 0; --i) if (r[i] < m - n + i) {
		let j = r[i] + 1;
		while (i < n) r[i++] = j++;
		status = 1;
		break;
	}
	return status;
}
function randomSeed(seed) {
	seedrandom__rspack_import_3(`${seed}`, { global: true });
	randomSeedValue = seed;
}
function getSeed() {
	return randomSeedValue;
}
function random(minValue = 0, maxValue = 1) {
	return minValue + (maxValue - minValue) * Math.random();
}
var gaussian = notImplemented("gaussian");
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
function norm(x, n = 3) {
	switch (n) {
		case 1: return Math.abs(x);
		case 2: return Math.sqrt(x[0] * x[0] + x[1] * x[1]);
		case 3: return Math.sqrt(x[0] * x[0] + x[1] * x[1] + x[2] * x[2]);
		default: {
			let sum = 0;
			for (let i = 0; i < n; i++) sum += x[i] * x[i];
			return Math.sqrt(sum);
		}
	}
}
function normalize(x) {
	const den = norm(x);
	if (den !== 0) {
		x[0] /= den;
		x[1] /= den;
		x[2] /= den;
	}
	return den;
}
function normalize4D(x) {
	const den = norm(x, 3);
	if (den !== 0) {
		x[0] /= den;
		x[1] /= den;
		x[2] /= den;
		x[3] /= den;
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
	for (let i = 0; i < 3; i++) projection[i] = b[i];
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
	for (let i = 0; i < 2; i++) projection[i] = b[i];
	multiplyScalar2D(projection, scale);
	return true;
}
function distance2BetweenPoints(x, y) {
	return (x[0] - y[0]) * (x[0] - y[0]) + (x[1] - y[1]) * (x[1] - y[1]) + (x[2] - y[2]) * (x[2] - y[2]);
}
function angleBetweenVectors(v1, v2) {
	const crossVect = [
		0,
		0,
		0
	];
	cross(v1, v2, crossVect);
	return Math.atan2(norm(crossVect), dot(v1, v2));
}
function signedAngleBetweenVectors(v1, v2, vN) {
	const crossVect = [
		0,
		0,
		0
	];
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
	if (den !== 0) {
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
function determinant2x2(...args) {
	if (args.length === 2) return args[0][0] * args[1][1] - args[1][0] * args[0][1];
	if (args.length === 4) return args[0] * args[3] - args[1] * args[2];
	return NaN;
}
function LUFactor3x3(mat_3x3, index_3) {
	let maxI;
	let tmp;
	let largest;
	const scale = [
		0,
		0,
		0
	];
	for (let i = 0; i < 3; i++) {
		largest = Math.abs(mat_3x3[i * 3]);
		if ((tmp = Math.abs(mat_3x3[i * 3 + 1])) > largest) largest = tmp;
		if ((tmp = Math.abs(mat_3x3[i * 3 + 2])) > largest) largest = tmp;
		scale[i] = 1 / largest;
	}
	largest = scale[0] * Math.abs(mat_3x3[0]);
	maxI = 0;
	if ((tmp = scale[1] * Math.abs(mat_3x3[3])) >= largest) {
		largest = tmp;
		maxI = 1;
	}
	if ((tmp = scale[2] * Math.abs(mat_3x3[6])) >= largest) maxI = 2;
	if (maxI !== 0) {
		swapRowsMatrix_nxn(mat_3x3, 3, maxI, 0);
		scale[maxI] = scale[0];
	}
	index_3[0] = maxI;
	mat_3x3[3] /= mat_3x3[0];
	mat_3x3[6] /= mat_3x3[0];
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
	mat_3x3[5] -= mat_3x3[3] * mat_3x3[2];
	mat_3x3[8] -= mat_3x3[6] * mat_3x3[2] + mat_3x3[7] * mat_3x3[5];
	index_3[2] = 2;
}
function LUSolve3x3(mat_3x3, index_3, x_3) {
	let sum = x_3[index_3[0]];
	x_3[index_3[0]] = x_3[0];
	x_3[0] = sum;
	sum = x_3[index_3[1]];
	x_3[index_3[1]] = x_3[1];
	x_3[1] = sum - mat_3x3[3] * x_3[0];
	sum = x_3[index_3[2]];
	x_3[index_3[2]] = x_3[2];
	x_3[2] = sum - mat_3x3[6] * x_3[0] - mat_3x3[7] * x_3[1];
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
	const d1 = +determinant2x2(b2, b3, c2, c3);
	const d2 = -determinant2x2(a2, a3, c2, c3);
	const d3 = +determinant2x2(a2, a3, b2, b3);
	const e1 = -determinant2x2(b1, b3, c1, c3);
	const e2 = +determinant2x2(a1, a3, c1, c3);
	const e3 = -determinant2x2(a1, a3, b1, b3);
	const f1 = +determinant2x2(b1, b2, c1, c2);
	const f2 = -determinant2x2(a1, a2, c1, c2);
	const f3 = +determinant2x2(a1, a2, b1, b2);
	const det = a1 * d1 + b1 * d2 + c1 * d3;
	const v1 = d1 * x_3[0] + e1 * x_3[1] + f1 * x_3[2];
	const v2 = d2 * x_3[0] + e2 * x_3[1] + f2 * x_3[2];
	const v3 = d3 * x_3[0] + e3 * x_3[1] + f3 * x_3[2];
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
	if (colA !== rowB) vtkErrorMacro("Number of columns of A must match number of rows of B.");
	const copyA = [...a];
	const copyB = [...b];
	for (let i = 0; i < rowA; i++) for (let j = 0; j < colB; j++) {
		outRowAColB[i * colB + j] = 0;
		for (let k = 0; k < colA; k++) outRowAColB[i * colB + j] += copyA[i * colA + k] * copyB[j + colB * k];
	}
}
function transpose3x3(in_3x3, outT_3x3) {
	let tmp;
	tmp = in_3x3[3];
	outT_3x3[3] = in_3x3[1];
	outT_3x3[1] = tmp;
	tmp = in_3x3[6];
	outT_3x3[6] = in_3x3[2];
	outT_3x3[2] = tmp;
	tmp = in_3x3[7];
	outT_3x3[7] = in_3x3[5];
	outT_3x3[5] = tmp;
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
	const d1 = +determinant2x2(b2, b3, c2, c3);
	const d2 = -determinant2x2(a2, a3, c2, c3);
	const d3 = +determinant2x2(a2, a3, b2, b3);
	const e1 = -determinant2x2(b1, b3, c1, c3);
	const e2 = +determinant2x2(a1, a3, c1, c3);
	const e3 = -determinant2x2(a1, a3, b1, b3);
	const f1 = +determinant2x2(b1, b2, c1, c2);
	const f2 = -determinant2x2(a1, a2, c1, c2);
	const f3 = +determinant2x2(a1, a2, b1, b2);
	const det = a1 * d1 + b1 * d2 + c1 * d3;
	if (det === 0) vtkWarningMacro("Matrix has 0 determinant");
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
function areEquals(a, b, eps = _Math_Constants_js__rspack_import_2/* .EPSILON */.p8) {
	if (a.length !== b.length) return false;
	function isEqual(element, index) {
		return Math.abs(element - b[index]) <= eps;
	}
	return a.every(isEqual);
}
var areMatricesEqual = areEquals;
function identity3x3(mat_3x3) {
	for (let i = 0; i < 3; i++) {
		mat_3x3[i * 3] = mat_3x3[i * 3 + 1] = mat_3x3[i * 3 + 2] = 0;
		mat_3x3[i * 3 + i] = 1;
	}
}
function identity(n, mat) {
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) mat[i * n + j] = 0;
		mat[i * n + i] = 1;
	}
	return mat;
}
function isIdentity(mat, eps = _Math_Constants_js__rspack_import_2/* .EPSILON */.p8) {
	return areMatricesEqual(mat, _Math_Constants_js__rspack_import_2/* .IDENTITY */.zK, eps);
}
function isIdentity3x3(mat, eps = _Math_Constants_js__rspack_import_2/* .EPSILON */.p8) {
	return areMatricesEqual(mat, _Math_Constants_js__rspack_import_2/* .IDENTITY_3X3 */.GY, eps);
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
function roundNumber(num, digits = 0) {
	if (!`${num}`.includes("e")) return +`${Math.round(`${num}e+${digits}`)}e-${digits}`;
	const arr = `${num}`.split("e");
	let sig = "";
	if (+arr[1] + digits > 0) sig = "+";
	return +`${Math.round(`${+arr[0]}e${sig}${+arr[1] + digits}`)}e-${digits}`;
}
function roundVector(vector, out = [
	0,
	0,
	0
], digits = 0) {
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
	identity(n, v);
	for (ip = 0; ip < n; ip++) {
		b[ip] = w[ip] = a[ip + ip * n];
		z[ip] = 0;
	}
	for (i = 0; i < VTK_MAX_ROTATIONS; i++) {
		sm = 0;
		for (ip = 0; ip < n - 1; ip++) for (iq = ip + 1; iq < n; iq++) sm += Math.abs(a[ip * n + iq]);
		if (sm === 0) break;
		if (i < 3) tresh = .2 * sm / (n * n);
		else tresh = 0;
		for (ip = 0; ip < n - 1; ip++) for (iq = ip + 1; iq < n; iq++) {
			g = 100 * Math.abs(a[ip * n + iq]);
			if (i > 3 && Math.abs(w[ip]) + g === Math.abs(w[ip]) && Math.abs(w[iq]) + g === Math.abs(w[iq])) a[ip * n + iq] = 0;
			else if (Math.abs(a[ip * n + iq]) > tresh) {
				h = w[iq] - w[ip];
				if (Math.abs(h) + g === Math.abs(h)) t = a[ip * n + iq] / h;
				else {
					theta = .5 * h / a[ip * n + iq];
					t = 1 / (Math.abs(theta) + Math.sqrt(1 + theta * theta));
					if (theta < 0) t = -t;
				}
				c = 1 / Math.sqrt(1 + t * t);
				s = t * c;
				tau = s / (1 + c);
				h = t * a[ip * n + iq];
				z[ip] -= h;
				z[iq] += h;
				w[ip] -= h;
				w[iq] += h;
				a[ip * n + iq] = 0;
				for (j = 0; j <= ip - 1; j++) vtkROTATE(a, j * n + ip, j * n + iq);
				for (j = ip + 1; j <= iq - 1; j++) vtkROTATE(a, ip * n + j, j * n + iq);
				for (j = iq + 1; j < n; j++) vtkROTATE(a, ip * n + j, iq * n + j);
				for (j = 0; j < n; j++) vtkROTATE(v, j * n + ip, j * n + iq);
			}
		}
		for (ip = 0; ip < n; ip++) {
			b[ip] += z[ip];
			w[ip] = b[ip];
			z[ip] = 0;
		}
	}
	if (i >= VTK_MAX_ROTATIONS) {
		vtkWarningMacro("vtkMath::Jacobi: Error extracting eigenfunctions");
		return 0;
	}
	for (j = 0; j < n - 1; j++) {
		k = j;
		tmp = w[k];
		for (i = j + 1; i < n; i++) if (w[i] >= tmp || Math.abs(w[i] - tmp) < 1e-12) {
			k = i;
			tmp = w[k];
		}
		if (k !== j) {
			w[k] = w[j];
			w[j] = tmp;
			swapColumnsMatrix_nxn(v, n, j, k);
		}
	}
	const ceil_half_n = (n >> 1) + (n & 1);
	for (numPos = 0, i = 0; i < n * n; i++) if (v[i] >= 0) numPos++;
	if (numPos < ceil_half_n) for (i = 0; i < n; i++) v[i * n + j] *= -1;
	return 1;
}
function matrix3x3ToQuaternion(mat_3x3, quat_4) {
	const tmp = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];
	tmp[0] = mat_3x3[0] + mat_3x3[4] + mat_3x3[8];
	tmp[5] = mat_3x3[0] - mat_3x3[4] - mat_3x3[8];
	tmp[10] = -mat_3x3[0] + mat_3x3[4] - mat_3x3[8];
	tmp[15] = -mat_3x3[0] - mat_3x3[4] + mat_3x3[8];
	tmp[1] = tmp[4] = mat_3x3[7] - mat_3x3[5];
	tmp[2] = tmp[8] = mat_3x3[2] - mat_3x3[6];
	tmp[3] = tmp[12] = mat_3x3[3] - mat_3x3[1];
	tmp[6] = tmp[9] = mat_3x3[3] + mat_3x3[1];
	tmp[7] = tmp[13] = mat_3x3[2] + mat_3x3[6];
	tmp[11] = tmp[14] = mat_3x3[7] + mat_3x3[5];
	const eigenvectors = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];
	const eigenvalues = [
		0,
		0,
		0,
		0
	];
	jacobiN([...tmp], 4, eigenvalues, eigenvectors);
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
	for (let i = 0; i < 9; i++) out_3x3[i] = a_3x3[i];
	const scale = createArray(3);
	const index = createArray(3);
	let largest;
	for (let i = 0; i < 3; i++) {
		const x1 = Math.abs(out_3x3[i * 3]);
		const x2 = Math.abs(out_3x3[i * 3 + 1]);
		const x3 = Math.abs(out_3x3[i * 3 + 2]);
		largest = x2 > x1 ? x2 : x1;
		largest = x3 > largest ? x3 : largest;
		scale[i] = 1;
		if (largest !== 0) scale[i] /= largest;
	}
	const x1 = Math.abs(out_3x3[0]) * scale[0];
	const x2 = Math.abs(out_3x3[3]) * scale[1];
	const x3 = Math.abs(out_3x3[6]) * scale[2];
	index[0] = 0;
	largest = x1;
	if (x2 >= largest) {
		largest = x2;
		index[0] = 1;
	}
	if (x3 >= largest) index[0] = 2;
	if (index[0] !== 0) {
		swapColumnsMatrix_nxn(out_3x3, 3, index[0], 0);
		scale[index[0]] = scale[0];
	}
	const y2 = Math.abs(out_3x3[4]) * scale[1];
	const y3 = Math.abs(out_3x3[7]) * scale[2];
	index[1] = 1;
	largest = y2;
	if (y3 >= largest) {
		index[1] = 2;
		swapColumnsMatrix_nxn(out_3x3, 3, 1, 2);
	}
	index[2] = 2;
	let flip = 0;
	if (determinant3x3(out_3x3) < 0) {
		flip = 1;
		for (let i = 0; i < 9; i++) out_3x3[i] = -out_3x3[i];
	}
	const quat = createArray(4);
	matrix3x3ToQuaternion(out_3x3, quat);
	quaternionToMatrix3x3(quat, out_3x3);
	if (flip) for (let i = 0; i < 9; i++) out_3x3[i] = -out_3x3[i];
	if (index[1] !== 1) swapColumnsMatrix_nxn(out_3x3, 3, index[1], 1);
	if (index[0] !== 0) swapColumnsMatrix_nxn(out_3x3, 3, index[0], 0);
}
function diagonalize3x3(a_3x3, w_3, v_3x3) {
	let i;
	let j;
	let k;
	let maxI;
	let tmp;
	let maxVal;
	jacobiN([...a_3x3], 3, w_3, v_3x3);
	if (w_3[0] === w_3[1] && w_3[0] === w_3[2]) {
		identity3x3(v_3x3);
		return;
	}
	transpose3x3(v_3x3, v_3x3);
	for (i = 0; i < 3; i++) if (w_3[(i + 1) % 3] === w_3[(i + 2) % 3]) {
		maxVal = Math.abs(v_3x3[i * 3]);
		maxI = 0;
		for (j = 1; j < 3; j++) if (maxVal < (tmp = Math.abs(v_3x3[i * 3 + j]))) {
			maxVal = tmp;
			maxI = j;
		}
		if (maxI !== i) {
			tmp = w_3[maxI];
			w_3[maxI] = w_3[i];
			w_3[i] = tmp;
			swapRowsMatrix_nxn(v_3x3, 3, i, maxI);
		}
		if (v_3x3[maxI * 3 + maxI] < 0) {
			v_3x3[maxI * 3] = -v_3x3[maxI * 3];
			v_3x3[maxI * 3 + 1] = -v_3x3[maxI * 3 + 1];
			v_3x3[maxI * 3 + 2] = -v_3x3[maxI * 3 + 2];
		}
		j = (maxI + 1) % 3;
		k = (maxI + 2) % 3;
		v_3x3[j * 3] = 0;
		v_3x3[j * 3 + 1] = 0;
		v_3x3[j * 3 + 2] = 0;
		v_3x3[j * 3 + j] = 1;
		const vectTmp1 = cross([
			v_3x3[maxI * 3],
			v_3x3[maxI * 3 + 1],
			v_3x3[maxI * 3 + 2]
		], [
			v_3x3[j * 3],
			v_3x3[j * 3 + 1],
			v_3x3[j * 3 + 2]
		], []);
		normalize(vectTmp1);
		const vectTmp2 = cross(vectTmp1, [
			v_3x3[maxI * 3],
			v_3x3[maxI * 3 + 1],
			v_3x3[maxI * 3 + 2]
		], []);
		for (let t = 0; t < 3; t++) {
			v_3x3[k * 3 + t] = vectTmp1[t];
			v_3x3[j * 3 + t] = vectTmp2[t];
		}
		transpose3x3(v_3x3, v_3x3);
		return;
	}
	maxVal = Math.abs(v_3x3[0]);
	maxI = 0;
	for (i = 1; i < 3; i++) if (maxVal < (tmp = Math.abs(v_3x3[i * 3]))) {
		maxVal = tmp;
		maxI = i;
	}
	if (maxI !== 0) {
		const eigenValTmp = w_3[maxI];
		w_3[maxI] = w_3[0];
		w_3[0] = eigenValTmp;
		swapRowsMatrix_nxn(v_3x3, 3, maxI, 0);
	}
	if (Math.abs(v_3x3[4]) < Math.abs(v_3x3[7])) {
		const eigenValTmp = w_3[2];
		w_3[2] = w_3[1];
		w_3[1] = eigenValTmp;
		swapRowsMatrix_nxn(v_3x3, 3, 1, 2);
	}
	for (i = 0; i < 2; i++) if (v_3x3[i * 3 + i] < 0) {
		v_3x3[i * 3] = -v_3x3[i * 3];
		v_3x3[i * 3 + 1] = -v_3x3[i * 3 + 1];
		v_3x3[i * 3 + 2] = -v_3x3[i * 3 + 2];
	}
	if (determinant3x3(v_3x3) < 0) {
		v_3x3[6] = -v_3x3[6];
		v_3x3[7] = -v_3x3[7];
		v_3x3[8] = -v_3x3[8];
	}
	transpose3x3(v_3x3, v_3x3);
}
function singularValueDecomposition3x3(a_3x3, u_3x3, w_3, vT_3x3) {
	let i;
	const B = [...a_3x3];
	const d = determinant3x3(B);
	if (d < 0) for (i = 0; i < 9; i++) B[i] = -B[i];
	orthogonalize3x3(B, u_3x3);
	transpose3x3(B, B);
	multiply3x3_mat3(B, u_3x3, vT_3x3);
	diagonalize3x3(vT_3x3, w_3, vT_3x3);
	multiply3x3_mat3(u_3x3, vT_3x3, u_3x3);
	transpose3x3(vT_3x3, vT_3x3);
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
	for (i = 0; i < size; i++) {
		for (largest = 0, j = 0; j < size; j++) if ((temp2 = Math.abs(A[i * size + j])) > largest) largest = temp2;
		if (largest === 0) {
			vtkWarningMacro("Unable to factor linear system");
			return 0;
		}
		scale[i] = 1 / largest;
	}
	for (j = 0; j < size; j++) {
		for (i = 0; i < j; i++) {
			sum = A[i * size + j];
			for (k = 0; k < i; k++) sum -= A[i * size + k] * A[k * size + j];
			A[i * size + j] = sum;
		}
		for (largest = 0, i = j; i < size; i++) {
			sum = A[i * size + j];
			for (k = 0; k < j; k++) sum -= A[i * size + k] * A[k * size + j];
			A[i * size + j] = sum;
			if ((temp1 = scale[i] * Math.abs(sum)) >= largest) {
				largest = temp1;
				maxI = i;
			}
		}
		if (j !== maxI) {
			for (k = 0; k < size; k++) {
				temp1 = A[maxI * size + k];
				A[maxI * size + k] = A[j * size + k];
				A[j * size + k] = temp1;
			}
			scale[maxI] = scale[j];
		}
		index[j] = maxI;
		if (Math.abs(A[j * size + j]) <= 1e-12) {
			vtkWarningMacro("Unable to factor linear system");
			return 0;
		}
		if (j !== size - 1) {
			temp1 = 1 / A[j * size + j];
			for (i = j + 1; i < size; i++) A[i * size + j] *= temp1;
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
	for (ii = -1, i = 0; i < size; i++) {
		idx = index[i];
		sum = x[idx];
		x[idx] = x[i];
		if (ii >= 0) for (j = ii; j <= i - 1; j++) sum -= A[i * size + j] * x[j];
		else if (sum !== 0) ii = i;
		x[i] = sum;
	}
	for (i = size - 1; i >= 0; i--) {
		sum = x[i];
		for (j = i + 1; j < size; j++) sum -= A[i * size + j] * x[j];
		x[i] = sum / A[i * size + i];
	}
}
function solveLinearSystem(A, x, size) {
	if (size === 2) {
		const y = createArray(2);
		const det = determinant2x2(A[0], A[1], A[2], A[3]);
		if (det === 0) return 0;
		y[0] = (A[3] * x[0] - A[1] * x[1]) / det;
		y[1] = (-(A[2] * x[0]) + A[0] * x[1]) / det;
		x[0] = y[0];
		x[1] = y[1];
		return 1;
	}
	if (size === 1) {
		if (A[0] === 0) return 0;
		x[0] /= A[0];
		return 1;
	}
	const index = createArray(size);
	if (luFactorLinearSystem(A, index, size) === 0) return 0;
	luSolveLinearSystem(A, index, x, size);
	return 1;
}
function invertMatrix(A, AI, size, index = null, column = null) {
	const tmp1Size = index || createArray(size);
	const tmp2Size = column || createArray(size);
	if (luFactorLinearSystem(A, tmp1Size, size, tmp2Size) === 0) return null;
	for (let j = 0; j < size; j++) {
		for (let i = 0; i < size; i++) tmp2Size[i] = 0;
		tmp2Size[j] = 1;
		luSolveLinearSystem(A, tmp1Size, tmp2Size, size);
		for (let i = 0; i < size; i++) AI[i * size + j] = tmp2Size[i];
	}
	return AI;
}
function estimateMatrixCondition(A, size) {
	let minValue = +Number.MAX_VALUE;
	let maxValue = -Number.MAX_VALUE;
	for (let i = 0; i < size; i++) for (let j = i; j < size; j++) if (Math.abs(A[i * size + j]) > maxValue) maxValue = Math.abs(A[i * size + j]);
	for (let i = 0; i < size; i++) if (Math.abs(A[i * size + i]) < minValue) minValue = Math.abs(A[i * size + i]);
	if (minValue === 0) return Number.MAX_VALUE;
	return maxValue / minValue;
}
function jacobi(a_3x3, w, v) {
	return jacobiN(a_3x3, 3, w, v);
}
function solveHomogeneousLeastSquares(numberOfSamples, xt, xOrder, mt) {
	if (numberOfSamples < xOrder) {
		vtkWarningMacro("Insufficient number of samples. Underdetermined.");
		return 0;
	}
	let i;
	let j;
	let k;
	const XXt = createArray(xOrder * xOrder);
	const eigenvals = createArray(xOrder);
	const eigenvecs = createArray(xOrder * xOrder);
	for (k = 0; k < numberOfSamples; k++) for (i = 0; i < xOrder; i++) for (j = i; j < xOrder; j++) XXt[i * xOrder + j] += xt[k * xOrder + i] * xt[k * xOrder + j];
	for (i = 0; i < xOrder; i++) for (j = 0; j < i; j++) XXt[i * xOrder + j] = XXt[j * xOrder + i];
	jacobiN(XXt, xOrder, eigenvals, eigenvecs);
	for (i = 0; i < xOrder; i++) mt[i] = eigenvecs[i * xOrder + xOrder - 1];
	return 1;
}
function solveLeastSquares(numberOfSamples, xt, xOrder, yt, yOrder, mt, checkHomogeneous = true) {
	if (numberOfSamples < xOrder || numberOfSamples < yOrder) {
		vtkWarningMacro("Insufficient number of samples. Underdetermined.");
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
	if (checkHomogeneous) {
		for (j = 0; j < yOrder; j++) homogenFlags[j] = 1;
		for (i = 0; i < numberOfSamples; i++) for (j = 0; j < yOrder; j++) if (Math.abs(yt[i * yOrder + j]) > 1e-12) {
			allHomogeneous = 0;
			homogenFlags[j] = 0;
		}
		if (allHomogeneous && yOrder === 1) {
			vtkWarningMacro("Detected homogeneous system (Y=0), calling SolveHomogeneousLeastSquares()");
			return solveHomogeneousLeastSquares(numberOfSamples, xt, xOrder, mt);
		}
		if (allHomogeneous) someHomogeneous = 1;
		else for (j = 0; j < yOrder; j++) if (homogenFlags[j]) someHomogeneous = 1;
	}
	if (someHomogeneous) {
		hmt = createArray(xOrder);
		homogRC = solveHomogeneousLeastSquares(numberOfSamples, xt, xOrder, hmt);
	}
	const XXt = createArray(xOrder * xOrder);
	const XXtI = createArray(xOrder * xOrder);
	const XYt = createArray(xOrder * yOrder);
	for (k = 0; k < numberOfSamples; k++) for (i = 0; i < xOrder; i++) {
		for (j = i; j < xOrder; j++) XXt[i * xOrder + j] += xt[k * xOrder + i] * xt[k * xOrder + j];
		for (j = 0; j < yOrder; j++) XYt[i * yOrder + j] += xt[k * xOrder + i] * yt[k * yOrder + j];
	}
	for (i = 0; i < xOrder; i++) for (j = 0; j < i; j++) XXt[i * xOrder + j] = XXt[j * xOrder + i];
	const successFlag = invertMatrix(XXt, XXtI, xOrder);
	if (successFlag) for (i = 0; i < xOrder; i++) for (j = 0; j < yOrder; j++) {
		mt[i * yOrder + j] = 0;
		for (k = 0; k < xOrder; k++) mt[i * yOrder + j] += XXtI[i * xOrder + k] * XYt[k * yOrder + j];
	}
	if (someHomogeneous) {
		for (j = 0; j < yOrder; j++) if (homogenFlags[j]) for (i = 0; i < xOrder; i++) mt[i * yOrder + j] = hmt[i * yOrder];
	}
	if (someHomogeneous) return homogRC && successFlag;
	return successFlag;
}
function hex2float(hexStr, outFloatArray = [
	0,
	.5,
	1
]) {
	switch (hexStr.length) {
		case 3:
			outFloatArray[0] = parseInt(hexStr[0], 16) * 17 / 255;
			outFloatArray[1] = parseInt(hexStr[1], 16) * 17 / 255;
			outFloatArray[2] = parseInt(hexStr[2], 16) * 17 / 255;
			return outFloatArray;
		case 4:
			outFloatArray[0] = parseInt(hexStr[1], 16) * 17 / 255;
			outFloatArray[1] = parseInt(hexStr[2], 16) * 17 / 255;
			outFloatArray[2] = parseInt(hexStr[3], 16) * 17 / 255;
			return outFloatArray;
		case 6:
			outFloatArray[0] = parseInt(hexStr.substr(0, 2), 16) / 255;
			outFloatArray[1] = parseInt(hexStr.substr(2, 2), 16) / 255;
			outFloatArray[2] = parseInt(hexStr.substr(4, 2), 16) / 255;
			return outFloatArray;
		case 7:
			outFloatArray[0] = parseInt(hexStr.substr(1, 2), 16) / 255;
			outFloatArray[1] = parseInt(hexStr.substr(3, 2), 16) / 255;
			outFloatArray[2] = parseInt(hexStr.substr(5, 2), 16) / 255;
			return outFloatArray;
		case 9:
			outFloatArray[0] = parseInt(hexStr.substr(1, 2), 16) / 255;
			outFloatArray[1] = parseInt(hexStr.substr(3, 2), 16) / 255;
			outFloatArray[2] = parseInt(hexStr.substr(5, 2), 16) / 255;
			outFloatArray[3] = parseInt(hexStr.substr(7, 2), 16) / 255;
			return outFloatArray;
		default: return outFloatArray;
	}
}
function rgb2hsv(rgb, hsv) {
	let h;
	let s;
	const [r, g, b] = rgb;
	const onethird = 1 / 3;
	const onesixth = 1 / 6;
	const twothird = 2 / 3;
	let cmax = r;
	let cmin = r;
	if (g > cmax) cmax = g;
	else if (g < cmin) cmin = g;
	if (b > cmax) cmax = b;
	else if (b < cmin) cmin = b;
	const v = cmax;
	if (v > 0) s = (cmax - cmin) / cmax;
	else s = 0;
	if (s > 0) {
		if (r === cmax) h = onesixth * (g - b) / (cmax - cmin);
		else if (g === cmax) h = onethird + onesixth * (b - r) / (cmax - cmin);
		else h = twothird + onesixth * (r - g) / (cmax - cmin);
		if (h < 0) h += 1;
	} else h = 0;
	hsv[0] = h;
	hsv[1] = s;
	hsv[2] = v;
}
function hsv2rgb(hsv, rgb) {
	const [h, s, v] = hsv;
	const onethird = 1 / 3;
	const onesixth = 1 / 6;
	const twothird = 2 / 3;
	const fivesixth = 5 / 6;
	let r;
	let g;
	let b;
	if (h > onesixth && h <= onethird) {
		g = 1;
		r = (onethird - h) / onesixth;
		b = 0;
	} else if (h > onethird && h <= .5) {
		g = 1;
		b = (h - onethird) / onesixth;
		r = 0;
	} else if (h > .5 && h <= twothird) {
		b = 1;
		g = (twothird - h) / onesixth;
		r = 0;
	} else if (h > twothird && h <= fivesixth) {
		b = 1;
		r = (h - twothird) / onesixth;
		g = 0;
	} else if (h > fivesixth && h <= 1) {
		r = 1;
		b = (1 - h) / onesixth;
		g = 0;
	} else {
		r = 1;
		g = h / onesixth;
		b = 0;
	}
	r = s * r + (1 - s);
	g = s * g + (1 - s);
	b = s * b + (1 - s);
	r *= v;
	g *= v;
	b *= v;
	rgb[0] = r;
	rgb[1] = g;
	rgb[2] = b;
}
function lab2xyz(lab, xyz) {
	const [L, a, b] = lab;
	let var_Y = (L + 16) / 116;
	let var_X = a / 500 + var_Y;
	let var_Z = var_Y - b / 200;
	if (var_Y ** 3 > .008856) var_Y **= 3;
	else var_Y = (var_Y - 16 / 116) / 7.787;
	if (var_X ** 3 > .008856) var_X **= 3;
	else var_X = (var_X - 16 / 116) / 7.787;
	if (var_Z ** 3 > .008856) var_Z **= 3;
	else var_Z = (var_Z - 16 / 116) / 7.787;
	const ref_X = .9505;
	const ref_Y = 1;
	const ref_Z = 1.089;
	xyz[0] = ref_X * var_X;
	xyz[1] = ref_Y * var_Y;
	xyz[2] = ref_Z * var_Z;
}
function xyz2lab(xyz, lab) {
	const [x, y, z] = xyz;
	const ref_X = .9505;
	const ref_Y = 1;
	const ref_Z = 1.089;
	let var_X = x / ref_X;
	let var_Y = y / ref_Y;
	let var_Z = z / ref_Z;
	if (var_X > .008856) var_X **= 1 / 3;
	else var_X = 7.787 * var_X + 16 / 116;
	if (var_Y > .008856) var_Y **= 1 / 3;
	else var_Y = 7.787 * var_Y + 16 / 116;
	if (var_Z > .008856) var_Z **= 1 / 3;
	else var_Z = 7.787 * var_Z + 16 / 116;
	lab[0] = 116 * var_Y - 16;
	lab[1] = 500 * (var_X - var_Y);
	lab[2] = 200 * (var_Y - var_Z);
}
function xyz2rgb(xyz, rgb) {
	const [x, y, z] = xyz;
	let r = x * 3.2406 + y * -1.5372 + z * -.4986;
	let g = x * -.9689 + y * 1.8758 + z * .0415;
	let b = x * .0557 + y * -.204 + z * 1.057;
	if (r > .0031308) r = 1.055 * r ** (1 / 2.4) - .055;
	else r *= 12.92;
	if (g > .0031308) g = 1.055 * g ** (1 / 2.4) - .055;
	else g *= 12.92;
	if (b > .0031308) b = 1.055 * b ** (1 / 2.4) - .055;
	else b *= 12.92;
	let maxVal = r;
	if (maxVal < g) maxVal = g;
	if (maxVal < b) maxVal = b;
	if (maxVal > 1) {
		r /= maxVal;
		g /= maxVal;
		b /= maxVal;
	}
	if (r < 0) r = 0;
	if (g < 0) g = 0;
	if (b < 0) b = 0;
	rgb[0] = r;
	rgb[1] = g;
	rgb[2] = b;
}
function rgb2xyz(rgb, xyz) {
	let [r, g, b] = rgb;
	if (r > .04045) r = ((r + .055) / 1.055) ** 2.4;
	else r /= 12.92;
	if (g > .04045) g = ((g + .055) / 1.055) ** 2.4;
	else g /= 12.92;
	if (b > .04045) b = ((b + .055) / 1.055) ** 2.4;
	else b /= 12.92;
	xyz[0] = r * .4124 + g * .3576 + b * .1805;
	xyz[1] = r * .2126 + g * .7152 + b * .0722;
	xyz[2] = r * .0193 + g * .1192 + b * .9505;
}
function rgb2lab(rgb, lab) {
	const xyz = [
		0,
		0,
		0
	];
	rgb2xyz(rgb, xyz);
	xyz2lab(xyz, lab);
}
function lab2rgb(lab, rgb) {
	const xyz = [
		0,
		0,
		0
	];
	lab2xyz(lab, xyz);
	xyz2rgb(xyz, rgb);
}
function uninitializeBounds(bounds) {
	bounds[0] = 1;
	bounds[1] = -1;
	bounds[2] = 1;
	bounds[3] = -1;
	bounds[4] = 1;
	bounds[5] = -1;
	return bounds;
}
function areBoundsInitialized(bounds) {
	return !(bounds[1] - bounds[0] < 0);
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
	if (value < minValue) return minValue;
	if (value > maxValue) return maxValue;
	return value;
}
function clampVector(vector, minVector, maxVector, out = [
	0,
	0,
	0
]) {
	out[0] = clampValue(vector[0], minVector[0], maxVector[0]);
	out[1] = clampValue(vector[1], minVector[1], maxVector[1]);
	out[2] = clampValue(vector[2], minVector[2], maxVector[2]);
	return out;
}
function clampAndNormalizeValue(value, range) {
	let result = 0;
	if (range[0] !== range[1]) {
		if (value < range[0]) result = range[0];
		else if (value > range[1]) result = range[1];
		else result = value;
		result = (result - range[0]) / (range[1] - range[0]);
	}
	return result;
}
var getScalarTypeFittingRange = notImplemented("GetScalarTypeFittingRange");
var getAdjustedScalarRange = notImplemented("GetAdjustedScalarRange");
function extentIsWithinOtherExtent(extent1, extent2) {
	if (!extent1 || !extent2) return 0;
	for (let i = 0; i < 6; i += 2) if (extent1[i] < extent2[i] || extent1[i] > extent2[i + 1] || extent1[i + 1] < extent2[i] || extent1[i + 1] > extent2[i + 1]) return 0;
	return 1;
}
function boundsIsWithinOtherBounds(bounds1_6, bounds2_6, delta_3) {
	if (!bounds1_6 || !bounds2_6) return 0;
	for (let i = 0; i < 6; i += 2) if (bounds1_6[i] + delta_3[i / 2] < bounds2_6[i] || bounds1_6[i] - delta_3[i / 2] > bounds2_6[i + 1] || bounds1_6[i + 1] + delta_3[i / 2] < bounds2_6[i] || bounds1_6[i + 1] - delta_3[i / 2] > bounds2_6[i + 1]) return 0;
	return 1;
}
function pointIsWithinBounds(point_3, bounds_6, delta_3) {
	if (!point_3 || !bounds_6 || !delta_3) return 0;
	for (let i = 0; i < 3; i++) if (point_3[i] + delta_3[i] < bounds_6[2 * i] || point_3[i] - delta_3[i] > bounds_6[2 * i + 1]) return 0;
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
	for (let i = 0; i < 3; ++i) center[i] = alpha * p1[i] + beta * p2[i] + gamma * p3[i];
	return radius;
}
var inf = Infinity;
var negInf = -Infinity;
var isInf = (value) => !Number.isFinite(value);
var { isFinite, isNaN } = Number;
var isNan = (/* unused pure expression or super */ null && (isNaN));
function createUninitializedBounds() {
	return [].concat([
		Number.MAX_VALUE,
		-Number.MAX_VALUE,
		Number.MAX_VALUE,
		-Number.MAX_VALUE,
		Number.MAX_VALUE,
		-Number.MAX_VALUE
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
function getMinorAxisIndex(vector) {
	let minValue = Infinity;
	let axisIndex = -1;
	for (let i = 0; i < vector.length; i++) {
		const value = Math.abs(vector[i]);
		if (value < minValue) {
			axisIndex = i;
			minValue = value;
		}
	}
	return axisIndex;
}
function getSparseOrthogonalMatrix(matrix, n = 3) {
	const rows = new Array(n);
	const cols = new Array(n);
	for (let i = 0; i < n; ++i) {
		rows[i] = i;
		cols[i] = i;
	}
	for (let i = n - 1; i > 0; i--) {
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
		[rows[i], rows[bestRowI]] = [rows[bestRowI], rows[i]];
		[cols[i], cols[bestColI]] = [cols[bestColI], cols[i]];
	}
	const output = new Array(n * n).fill(0);
	for (let i = 0; i < n; ++i) {
		const matIdx = rows[i] + n * cols[i];
		output[matIdx] = matrix[matIdx] < 0 ? -1 : 1;
	}
	return output;
}
function floatToHex2(value) {
	const integer = Math.floor(value * 255);
	if (integer > 15) return integer.toString(16);
	return `0${integer.toString(16)}`;
}
function floatRGB2HexCode(rgbArray, prefix = "#") {
	return `${prefix}${rgbArray.map(floatToHex2).join("")}`;
}
function floatToChar(f) {
	return Math.round(f * 255);
}
function float2CssRGBA(rgbArray) {
	if (rgbArray.length === 3) return `rgb(${rgbArray.map(floatToChar).join(", ")})`;
	return `rgba(${floatToChar(rgbArray[0] || 0)}, ${floatToChar(rgbArray[1] || 0)}, ${floatToChar(rgbArray[2] || 0)}, ${rgbArray[3] || 0})`;
}
var Math_default = {
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
	createUninitializedBounds,
	getMajorAxisIndex,
	getMinorAxisIndex,
	getSparseOrthogonalMatrix,
	floatToHex2,
	floatRGB2HexCode,
	float2CssRGBA
};
//#endregion


//# sourceMappingURL=Math.js.map

},
5695(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (Constants_default)
});
//#region Sources/Common/DataModel/DataSetAttributes/Constants.js
var AttributeTypes = {
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
var AttributeLimitTypes = {
	MAX: 0,
	EXACT: 1,
	NOLIMIT: 2
};
var CellGhostTypes = {
	DUPLICATECELL: 1,
	HIGHCONNECTIVITYCELL: 2,
	LOWCONNECTIVITYCELL: 4,
	REFINEDCELL: 8,
	EXTERIORCELL: 16,
	HIDDENCELL: 32
};
var PointGhostTypes = {
	DUPLICATEPOINT: 1,
	HIDDENPOINT: 2
};
var AttributeCopyOperations = {
	COPYTUPLE: 0,
	INTERPOLATE: 1,
	PASSDATA: 2,
	ALLCOPY: 3
};
var ghostArrayName = "vtkGhostType";
var DesiredOutputPrecision = {
	DEFAULT: 0,
	SINGLE: 1,
	DOUBLE: 2
};
var Constants_default = {
	AttributeCopyOperations,
	AttributeLimitTypes,
	AttributeTypes,
	CellGhostTypes,
	DesiredOutputPrecision,
	PointGhostTypes,
	ghostArrayName
};
//#endregion


//# sourceMappingURL=Constants.js.map

},
26393(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (ImageData_default)
});
/* import */ var _macros_js__rspack_import_0 = __webpack_require__(28241);
/* import */ var _Core_Math_js__rspack_import_1 = __webpack_require__(91352);
/* import */ var _BoundingBox_js__rspack_import_2 = __webpack_require__(24377);
/* import */ var _DataSet_js__rspack_import_3 = __webpack_require__(29175);
/* import */ var _StructuredData_Constants_js__rspack_import_4 = __webpack_require__(71767);
/* import */ var _StructuredData_js__rspack_import_5 = __webpack_require__(42365);
/* import */ var gl_matrix__rspack_import_6 = __webpack_require__(40230);







//#region Sources/Common/DataModel/ImageData/index.js
var { vtkErrorMacro } = _macros_js__rspack_import_0/* ["default"] */.Ay;
function vtkImageData(publicAPI, model) {
	model.classHierarchy.push("vtkImageData");
	publicAPI.setExtent = (...inExtent) => {
		if (model.deleted) {
			vtkErrorMacro("instance deleted - cannot call any method");
			return false;
		}
		const extentArray = inExtent.length === 1 ? inExtent[0] : inExtent;
		if (extentArray.length !== 6) return false;
		const changeDetected = model.extent.some((item, index) => item !== extentArray[index]);
		if (changeDetected) {
			model.extent = extentArray.slice();
			model.dataDescription = _StructuredData_js__rspack_import_5/* ["default"].getDataDescriptionFromExtent */.A.getDataDescriptionFromExtent(model.extent);
			publicAPI.modified();
		}
		return changeDetected;
	};
	publicAPI.setDimensions = (...dims) => {
		let i;
		let j;
		let k;
		if (model.deleted) {
			vtkErrorMacro("instance deleted - cannot call any method");
			return;
		}
		if (dims.length === 1) {
			const array = dims[0];
			i = array[0];
			j = array[1];
			k = array[2];
		} else if (dims.length === 3) {
			i = dims[0];
			j = dims[1];
			k = dims[2];
		} else {
			vtkErrorMacro("Bad dimension specification");
			return;
		}
		publicAPI.setExtent(0, i - 1, 0, j - 1, 0, k - 1);
	};
	publicAPI.getDimensions = () => [
		model.extent[1] - model.extent[0] + 1,
		model.extent[3] - model.extent[2] + 1,
		model.extent[5] - model.extent[4] + 1
	];
	publicAPI.getNumberOfCells = () => {
		const dims = publicAPI.getDimensions();
		let nCells = 1;
		for (let i = 0; i < 3; i++) {
			if (dims[i] === 0) return 0;
			if (dims[i] > 1) nCells *= dims[i] - 1;
		}
		return nCells;
	};
	publicAPI.getNumberOfPoints = () => {
		const dims = publicAPI.getDimensions();
		return dims[0] * dims[1] * dims[2];
	};
	publicAPI.getPoint = (index) => {
		const dims = publicAPI.getDimensions();
		if (dims[0] === 0 || dims[1] === 0 || dims[2] === 0) {
			vtkErrorMacro("Requesting a point from an empty image.");
			return null;
		}
		const ijk = new Float64Array(3);
		switch (model.dataDescription) {
			case _StructuredData_Constants_js__rspack_import_4/* .StructuredType.EMPTY */.e.EMPTY: return null;
			case _StructuredData_Constants_js__rspack_import_4/* .StructuredType.SINGLE_POINT */.e.SINGLE_POINT: break;
			case _StructuredData_Constants_js__rspack_import_4/* .StructuredType.X_LINE */.e.X_LINE:
				ijk[0] = index;
				break;
			case _StructuredData_Constants_js__rspack_import_4/* .StructuredType.Y_LINE */.e.Y_LINE:
				ijk[1] = index;
				break;
			case _StructuredData_Constants_js__rspack_import_4/* .StructuredType.Z_LINE */.e.Z_LINE:
				ijk[2] = index;
				break;
			case _StructuredData_Constants_js__rspack_import_4/* .StructuredType.XY_PLANE */.e.XY_PLANE:
				ijk[0] = index % dims[0];
				ijk[1] = index / dims[0];
				break;
			case _StructuredData_Constants_js__rspack_import_4/* .StructuredType.YZ_PLANE */.e.YZ_PLANE:
				ijk[1] = index % dims[1];
				ijk[2] = index / dims[1];
				break;
			case _StructuredData_Constants_js__rspack_import_4/* .StructuredType.XZ_PLANE */.e.XZ_PLANE:
				ijk[0] = index % dims[0];
				ijk[2] = index / dims[0];
				break;
			case _StructuredData_Constants_js__rspack_import_4/* .StructuredType.XYZ_GRID */.e.XYZ_GRID:
				ijk[0] = index % dims[0];
				ijk[1] = index / dims[0] % dims[1];
				ijk[2] = index / (dims[0] * dims[1]);
				break;
			default:
				vtkErrorMacro("Invalid dataDescription");
				break;
		}
		const coords = [
			0,
			0,
			0
		];
		publicAPI.indexToWorld(ijk, coords);
		return coords;
	};
	publicAPI.getBounds = () => publicAPI.extentToBounds(publicAPI.getSpatialExtent());
	publicAPI.extentToBounds = (ex) => _BoundingBox_js__rspack_import_2/* ["default"].transformBounds */.Ay.transformBounds(ex, model.indexToWorld);
	publicAPI.getSpatialExtent = () => _BoundingBox_js__rspack_import_2/* ["default"].inflate */.Ay.inflate([...model.extent], .5);
	publicAPI.computeTransforms = () => {
		gl_matrix__rspack_import_6/* .mat4.fromTranslation */.pB.fromTranslation(model.indexToWorld, model.origin);
		model.indexToWorld[0] = model.direction[0];
		model.indexToWorld[1] = model.direction[1];
		model.indexToWorld[2] = model.direction[2];
		model.indexToWorld[4] = model.direction[3];
		model.indexToWorld[5] = model.direction[4];
		model.indexToWorld[6] = model.direction[5];
		model.indexToWorld[8] = model.direction[6];
		model.indexToWorld[9] = model.direction[7];
		model.indexToWorld[10] = model.direction[8];
		gl_matrix__rspack_import_6/* .mat4.scale */.pB.scale(model.indexToWorld, model.indexToWorld, model.spacing);
		gl_matrix__rspack_import_6/* .mat4.invert */.pB.invert(model.worldToIndex, model.indexToWorld);
	};
	publicAPI.indexToWorld = (ain, aout = []) => {
		gl_matrix__rspack_import_6/* .vec3.transformMat4 */.eR.Z0(aout, ain, model.indexToWorld);
		return aout;
	};
	publicAPI.indexToWorldVec3 = publicAPI.indexToWorld;
	publicAPI.worldToIndex = (ain, aout = []) => {
		gl_matrix__rspack_import_6/* .vec3.transformMat4 */.eR.Z0(aout, ain, model.worldToIndex);
		return aout;
	};
	publicAPI.worldToIndexVec3 = publicAPI.worldToIndex;
	publicAPI.indexToWorldBounds = (bin, bout = []) => _BoundingBox_js__rspack_import_2/* ["default"].transformBounds */.Ay.transformBounds(bin, model.indexToWorld, bout);
	publicAPI.worldToIndexBounds = (bin, bout = []) => _BoundingBox_js__rspack_import_2/* ["default"].transformBounds */.Ay.transformBounds(bin, model.worldToIndex, bout);
	model._onOriginChanged = publicAPI.computeTransforms;
	model._onDirectionChanged = publicAPI.computeTransforms;
	model._onSpacingChanged = publicAPI.computeTransforms;
	publicAPI.computeTransforms();
	publicAPI.getCenter = () => _BoundingBox_js__rspack_import_2/* ["default"].getCenter */.Ay.getCenter(publicAPI.getBounds());
	publicAPI.computeHistogram = (worldBounds, voxelFunction = null) => {
		const bounds = [
			0,
			0,
			0,
			0,
			0,
			0
		];
		publicAPI.worldToIndexBounds(worldBounds, bounds);
		const point1 = [
			0,
			0,
			0
		];
		const point2 = [
			0,
			0,
			0
		];
		_BoundingBox_js__rspack_import_2/* ["default"].computeCornerPoints */.Ay.computeCornerPoints(bounds, point1, point2);
		(0,_Core_Math_js__rspack_import_1/* .roundVector */.Md)(point1, point1);
		(0,_Core_Math_js__rspack_import_1/* .roundVector */.Md)(point2, point2);
		const dimensions = publicAPI.getDimensions();
		(0,_Core_Math_js__rspack_import_1/* .clampVector */.LQ)(point1, [
			0,
			0,
			0
		], [
			dimensions[0] - 1,
			dimensions[1] - 1,
			dimensions[2] - 1
		], point1);
		(0,_Core_Math_js__rspack_import_1/* .clampVector */.LQ)(point2, [
			0,
			0,
			0
		], [
			dimensions[0] - 1,
			dimensions[1] - 1,
			dimensions[2] - 1
		], point2);
		const yStride = dimensions[0];
		const zStride = dimensions[0] * dimensions[1];
		const pixels = publicAPI.getPointData().getScalars().getData();
		let maximum = -Infinity;
		let minimum = Infinity;
		let sumOfSquares = 0;
		let isum = 0;
		let inum = 0;
		for (let z = point1[2]; z <= point2[2]; z++) for (let y = point1[1]; y <= point2[1]; y++) {
			let index = point1[0] + y * yStride + z * zStride;
			for (let x = point1[0]; x <= point2[0]; x++) {
				if (!voxelFunction || voxelFunction([
					x,
					y,
					z
				], bounds)) {
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
		const average = inum > 0 ? isum / inum : 0;
		const variance = inum ? Math.abs(sumOfSquares / inum - average * average) : 0;
		return {
			minimum,
			maximum,
			average,
			variance,
			sigma: Math.sqrt(variance),
			count: inum
		};
	};
	publicAPI.computeIncrements = (extent, numberOfComponents = 1) => {
		const increments = [];
		let incr = numberOfComponents;
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
	publicAPI.computeOffsetIndex = ([i, j, k]) => {
		const extent = publicAPI.getExtent();
		const numberOfComponents = publicAPI.getPointData().getScalars().getNumberOfComponents();
		const increments = publicAPI.computeIncrements(extent, numberOfComponents);
		return Math.floor((Math.round(i) - extent[0]) * increments[0] + (Math.round(j) - extent[2]) * increments[1] + (Math.round(k) - extent[4]) * increments[2]);
	};
	/**
	* @param {Number[]} xyz the [x,y,z] Array in world coordinates
	* @return {Number|NaN} the corresponding pixel's index in the scalar array
	*/
	publicAPI.getOffsetIndexFromWorld = (xyz) => {
		const extent = publicAPI.getExtent();
		const index = publicAPI.worldToIndex(xyz);
		for (let idx = 0; idx < 3; ++idx) if (index[idx] < extent[idx * 2] || index[idx] > extent[idx * 2 + 1]) {
			vtkErrorMacro(`GetScalarPointer: Pixel ${index} is not in memory. Current extent = ${extent}`);
			return NaN;
		}
		return publicAPI.computeOffsetIndex(index);
	};
	/**
	* @param {Number[]} xyz the [x,y,z] Array in world coordinates
	* @param {Number?} comp the scalar component index for multi-component scalars
	* @return {Number|NaN} the corresponding pixel's scalar value
	*/
	publicAPI.getScalarValueFromWorld = (xyz, comp = 0) => {
		const numberOfComponents = publicAPI.getPointData().getScalars().getNumberOfComponents();
		if (comp < 0 || comp >= numberOfComponents) {
			vtkErrorMacro(`GetScalarPointer: Scalar Component ${comp} is not within bounds. Current Scalar numberOfComponents: ${numberOfComponents}`);
			return NaN;
		}
		const offsetIndex = publicAPI.getOffsetIndexFromWorld(xyz);
		if (Number.isNaN(offsetIndex)) return offsetIndex;
		return publicAPI.getPointData().getScalars().getComponent(offsetIndex, comp);
	};
	const superInitialize = publicAPI.initialize;
	publicAPI.initialize = () => {
		publicAPI.set({
			direction: gl_matrix__rspack_import_6/* .mat3.identity */.w0.identity(model.direction),
			spacing: [
				1,
				1,
				1
			],
			origin: [
				0,
				0,
				0
			],
			extent: [
				0,
				-1,
				0,
				-1,
				0,
				-1
			],
			dataDescription: _StructuredData_Constants_js__rspack_import_4/* .StructuredType.EMPTY */.e.EMPTY
		});
		return superInitialize();
	};
}
var DEFAULT_VALUES = {
	direction: null,
	indexToWorld: null,
	worldToIndex: null,
	spacing: [
		1,
		1,
		1
	],
	origin: [
		0,
		0,
		0
	],
	extent: [
		0,
		-1,
		0,
		-1,
		0,
		-1
	],
	dataDescription: _StructuredData_Constants_js__rspack_import_4/* .StructuredType.EMPTY */.e.EMPTY
};
function extend(publicAPI, model, initialValues = {}) {
	Object.assign(model, DEFAULT_VALUES, initialValues);
	_DataSet_js__rspack_import_3/* ["default"].extend */.Ay.extend(publicAPI, model, initialValues);
	if (!model.direction) model.direction = gl_matrix__rspack_import_6/* .mat3.identity */.w0.identity(new Float64Array(9));
	else if (Array.isArray(model.direction)) model.direction = new Float64Array(model.direction.slice(0, 9));
	model.indexToWorld = new Float64Array(16);
	model.worldToIndex = new Float64Array(16);
	_macros_js__rspack_import_0/* ["default"].get */.Ay.get(publicAPI, model, ["indexToWorld", "worldToIndex"]);
	_macros_js__rspack_import_0/* ["default"].setGetArray */.Ay.setGetArray(publicAPI, model, ["origin", "spacing"], 3);
	_macros_js__rspack_import_0/* ["default"].setGetArray */.Ay.setGetArray(publicAPI, model, ["direction"], 9);
	_macros_js__rspack_import_0/* ["default"].getArray */.Ay.getArray(publicAPI, model, ["extent"], 6);
	vtkImageData(publicAPI, model);
}
var newInstance = _macros_js__rspack_import_0/* ["default"].newInstance */.Ay.newInstance(extend, "vtkImageData");
var ImageData_default = {
	newInstance,
	extend
};
//#endregion


//# sourceMappingURL=ImageData.js.map

},
49794(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (Plane_default)
});
/* import */ var _macros_js__rspack_import_0 = __webpack_require__(28241);
/* import */ var _Core_Math_js__rspack_import_1 = __webpack_require__(91352);
/* import */ var _ImplicitFunction_js__rspack_import_2 = __webpack_require__(53001);



//#region Sources/Common/DataModel/Plane/index.js
var PLANE_TOLERANCE = 1e-6;
var COINCIDE = "coincide";
var DISJOINT = "disjoint";
function evaluate(normal, origin, x) {
	return normal[0] * (x[0] - origin[0]) + normal[1] * (x[1] - origin[1]) + normal[2] * (x[2] - origin[2]);
}
function distanceToPlane(x, origin, normal) {
	const distance = normal[0] * (x[0] - origin[0]) + normal[1] * (x[1] - origin[1]) + normal[2] * (x[2] - origin[2]);
	return Math.abs(distance);
}
function projectPoint(x, origin, normal, xproj) {
	const xo = [];
	(0,_Core_Math_js__rspack_import_1/* .subtract */.Re)(x, origin, xo);
	const t = (0,_Core_Math_js__rspack_import_1/* .dot */.Om)(normal, xo);
	xproj[0] = x[0] - t * normal[0];
	xproj[1] = x[1] - t * normal[1];
	xproj[2] = x[2] - t * normal[2];
}
function projectVector(v, normal, vproj) {
	const t = (0,_Core_Math_js__rspack_import_1/* .dot */.Om)(v, normal);
	let n2 = (0,_Core_Math_js__rspack_import_1/* .dot */.Om)(normal, normal);
	if (n2 === 0) n2 = 1;
	vproj[0] = v[0] - t * normal[0] / n2;
	vproj[1] = v[1] - t * normal[1] / n2;
	vproj[2] = v[2] - t * normal[2] / n2;
	return vproj;
}
function generalizedProjectPoint(x, origin, normal, xproj) {
	const xo = [];
	(0,_Core_Math_js__rspack_import_1/* .subtract */.Re)(x, origin, xo);
	const t = (0,_Core_Math_js__rspack_import_1/* .dot */.Om)(normal, xo);
	const n2 = (0,_Core_Math_js__rspack_import_1/* .dot */.Om)(normal, normal);
	if (n2 !== 0) {
		xproj[0] = x[0] - t * normal[0] / n2;
		xproj[1] = x[1] - t * normal[1] / n2;
		xproj[2] = x[2] - t * normal[2] / n2;
	} else {
		xproj[0] = x[0];
		xproj[1] = x[1];
		xproj[2] = x[2];
	}
}
function intersectWithLine(p1, p2, origin, normal) {
	const outObj = {
		intersection: false,
		betweenPoints: false,
		t: Number.MAX_VALUE,
		x: []
	};
	const p21 = [];
	const p1Origin = [];
	(0,_Core_Math_js__rspack_import_1/* .subtract */.Re)(p2, p1, p21);
	(0,_Core_Math_js__rspack_import_1/* .subtract */.Re)(origin, p1, p1Origin);
	const num = (0,_Core_Math_js__rspack_import_1/* .dot */.Om)(normal, p1Origin);
	const den = (0,_Core_Math_js__rspack_import_1/* .dot */.Om)(normal, p21);
	let fabsden;
	let fabstolerance;
	if (den < 0) fabsden = -den;
	else fabsden = den;
	if (num < 0) fabstolerance = -num * PLANE_TOLERANCE;
	else fabstolerance = num * PLANE_TOLERANCE;
	if (fabsden <= fabstolerance) return outObj;
	outObj.t = num / den;
	outObj.x[0] = p1[0] + outObj.t * p21[0];
	outObj.x[1] = p1[1] + outObj.t * p21[1];
	outObj.x[2] = p1[2] + outObj.t * p21[2];
	outObj.intersection = true;
	outObj.betweenPoints = outObj.t >= 0 && outObj.t <= 1;
	return outObj;
}
function intersectWithPlane(plane1Origin, plane1Normal, plane2Origin, plane2Normal) {
	const outObj = {
		intersection: false,
		l0: [],
		l1: [],
		error: null
	};
	const cross$1 = [];
	(0,_Core_Math_js__rspack_import_1/* .cross */.$A)(plane1Normal, plane2Normal, cross$1);
	const absCross = cross$1.map((n) => Math.abs(n));
	if (absCross[0] + absCross[1] + absCross[2] < PLANE_TOLERANCE) {
		const v = [];
		(0,_Core_Math_js__rspack_import_1/* .subtract */.Re)(plane1Origin, plane2Origin, v);
		if ((0,_Core_Math_js__rspack_import_1/* .dot */.Om)(plane1Normal, v) === 0) outObj.error = COINCIDE;
		else outObj.error = DISJOINT;
		return outObj;
	}
	let maxc;
	if (absCross[0] > absCross[1] && absCross[0] > absCross[2]) maxc = "x";
	else if (absCross[1] > absCross[2]) maxc = "y";
	else maxc = "z";
	const iP = [];
	const d1 = -(0,_Core_Math_js__rspack_import_1/* .dot */.Om)(plane1Normal, plane1Origin);
	const d2 = -(0,_Core_Math_js__rspack_import_1/* .dot */.Om)(plane2Normal, plane2Origin);
	switch (maxc) {
		case "x":
			iP[0] = 0;
			iP[1] = (d2 * plane1Normal[2] - d1 * plane2Normal[2]) / cross$1[0];
			iP[2] = (d1 * plane2Normal[1] - d2 * plane1Normal[1]) / cross$1[0];
			break;
		case "y":
			iP[0] = (d1 * plane2Normal[2] - d2 * plane1Normal[2]) / cross$1[1];
			iP[1] = 0;
			iP[2] = (d2 * plane1Normal[0] - d1 * plane2Normal[0]) / cross$1[1];
			break;
		case "z":
			iP[0] = (d2 * plane1Normal[1] - d1 * plane2Normal[1]) / cross$1[2];
			iP[1] = (d1 * plane2Normal[0] - d2 * plane1Normal[0]) / cross$1[2];
			iP[2] = 0;
			break;
	}
	outObj.l0 = iP;
	(0,_Core_Math_js__rspack_import_1/* .add */.WQ)(iP, cross$1, outObj.l1);
	outObj.intersection = true;
	return outObj;
}
var STATIC = {
	evaluate,
	distanceToPlane,
	projectPoint,
	projectVector,
	generalizedProjectPoint,
	intersectWithLine,
	intersectWithPlane,
	DISJOINT,
	COINCIDE
};
function vtkPlane(publicAPI, model) {
	model.classHierarchy.push("vtkPlane");
	publicAPI.distanceToPlane = (x) => distanceToPlane(x, model.origin, model.normal);
	publicAPI.projectPoint = (x, xproj) => {
		projectPoint(x, model.origin, model.normal, xproj);
	};
	publicAPI.projectVector = (v, vproj) => projectVector(v, model.normal, vproj);
	publicAPI.push = (distance) => {
		if (distance === 0) return;
		for (let i = 0; i < 3; i++) model.origin[i] += distance * model.normal[i];
	};
	publicAPI.generalizedProjectPoint = (x, xproj) => {
		generalizedProjectPoint(x, model.origin, model.normal, xproj);
	};
	publicAPI.evaluateFunction = (x, y, z) => {
		if (!Array.isArray(x)) return model.normal[0] * (x - model.origin[0]) + model.normal[1] * (y - model.origin[1]) + model.normal[2] * (z - model.origin[2]);
		return model.normal[0] * (x[0] - model.origin[0]) + model.normal[1] * (x[1] - model.origin[1]) + model.normal[2] * (x[2] - model.origin[2]);
	};
	publicAPI.evaluateGradient = (xyz) => {
		return [
			model.normal[0],
			model.normal[1],
			model.normal[2]
		];
	};
	publicAPI.intersectWithLine = (p1, p2) => intersectWithLine(p1, p2, model.origin, model.normal);
	publicAPI.intersectWithPlane = (planeOrigin, planeNormal) => intersectWithPlane(planeOrigin, planeNormal, model.origin, model.normal);
}
var DEFAULT_VALUES = {
	normal: [
		0,
		0,
		1
	],
	origin: [
		0,
		0,
		0
	]
};
function extend(publicAPI, model, initialValues = {}) {
	Object.assign(model, DEFAULT_VALUES, initialValues);
	_ImplicitFunction_js__rspack_import_2/* ["default"].extend */.Ay.extend(publicAPI, model, initialValues);
	_macros_js__rspack_import_0/* ["default"].setGetArray */.Ay.setGetArray(publicAPI, model, ["normal", "origin"], 3);
	vtkPlane(publicAPI, model);
}
var newInstance = _macros_js__rspack_import_0/* ["default"].newInstance */.Ay.newInstance(extend, "vtkPlane");
var Plane_default = {
	newInstance,
	extend,
	...STATIC
};
//#endregion


//# sourceMappingURL=Plane.js.map

},
28241(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Ak: () => (set),
  Ay: () => (macros_default),
  OE: () => (newTypedArray),
  UI: () => (newInstance),
  W2: () => (newTypedArrayFrom),
  WL: () => (obj),
  o$: () => (macros_exports)
});
/* import */ var _virtual_rolldown_runtime_js__rspack_import_0 = __webpack_require__(85254);
/* import */ var _vtk_js__rspack_import_1 = __webpack_require__(64457);
/* import */ var _Common_Core_ClassHierarchy_js__rspack_import_2 = __webpack_require__(62209);
/* import */ var fast_deep_equal__rspack_import_3 = __webpack_require__(45043);




//#region Sources/macros.js
/**
* macros.js is the old macro.js.
* The name change is so we do not get eaten by babel-plugin-macros.
*/
var macros_exports = /* @__PURE__ */ (0,_virtual_rolldown_runtime_js__rspack_import_0/* .__exportAll */.I)({
	EVENT_ABORT: () => EVENT_ABORT,
	TYPED_ARRAYS: () => TYPED_ARRAYS,
	VOID: () => VOID,
	_capitalize: () => _capitalize,
	algo: () => algo,
	capitalize: () => capitalize,
	chain: () => chain,
	debounce: () => debounce,
	default: () => macros_default,
	event: () => event,
	formatBytesToProperUnit: () => formatBytesToProperUnit,
	formatNumbersWithThousandSeparator: () => formatNumbersWithThousandSeparator,
	get: () => get,
	getArray: () => getArray,
	isVtkObject: () => isVtkObject,
	keystore: () => keystore,
	measurePromiseExecution: () => measurePromiseExecution,
	moveToProtected: () => moveToProtected,
	newInstance: () => newInstance,
	newTypedArray: () => newTypedArray,
	newTypedArrayFrom: () => newTypedArrayFrom,
	normalizeWheel: () => normalizeWheel,
	obj: () => obj,
	proxy: () => proxy,
	proxyPropertyMapping: () => proxyPropertyMapping,
	proxyPropertyState: () => proxyPropertyState,
	requiredParam: () => requiredParam,
	set: () => set,
	setArray: () => setArray,
	setGet: () => setGet,
	setGetArray: () => setGetArray,
	setImmediateVTK: () => setImmediateVTK,
	setLoggerFunction: () => setLoggerFunction,
	throttle: () => throttle,
	traverseInstanceTree: () => traverseInstanceTree,
	uncapitalize: () => uncapitalize,
	vtkDebugMacro: () => vtkDebugMacro,
	vtkErrorMacro: () => vtkErrorMacro,
	vtkInfoMacro: () => vtkInfoMacro,
	vtkLogMacro: () => vtkLogMacro,
	vtkOnceErrorMacro: () => vtkOnceErrorMacro,
	vtkWarningMacro: () => vtkWarningMacro
});
var globalMTime = 0;
var requiredParam = (name) => {
	throw new Error(`Named parameter '${name}' is missing`);
};
var VOID = Symbol("void");
function getCurrentGlobalMTime() {
	return globalMTime;
}
var fakeConsole = {};
function noOp() {}
[
	"log",
	"debug",
	"info",
	"warn",
	"error",
	"time",
	"timeEnd",
	"group",
	"groupEnd"
].forEach((methodName) => {
	fakeConsole[methodName] = noOp;
});
var resolvedConsole = globalThis.console && globalThis.console.hasOwnProperty("log") ? globalThis.console : fakeConsole;
var loggerFunctions = {
	debug: noOp,
	error: resolvedConsole.error || noOp,
	info: resolvedConsole.info || noOp,
	log: resolvedConsole.log || noOp,
	warn: resolvedConsole.warn || noOp
};
function setLoggerFunction(name, fn) {
	if (loggerFunctions[name]) loggerFunctions[name] = fn || noOp;
}
function vtkLogMacro(...args) {
	loggerFunctions.log(...args);
}
function vtkInfoMacro(...args) {
	loggerFunctions.info(...args);
}
function vtkDebugMacro(...args) {
	loggerFunctions.debug(...args);
}
function vtkErrorMacro(...args) {
	loggerFunctions.error(...args);
}
function vtkWarningMacro(...args) {
	loggerFunctions.warn(...args);
}
var ERROR_ONCE_MAP = {};
function vtkOnceErrorMacro(str) {
	if (!ERROR_ONCE_MAP[str]) {
		loggerFunctions.error(str);
		ERROR_ONCE_MAP[str] = true;
	}
}
var TYPED_ARRAYS = Object.create(null);
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
} catch {}
function newTypedArray(type, ...args) {
	return new (TYPED_ARRAYS[type] || Float64Array)(...args);
}
function newTypedArrayFrom(type, ...args) {
	return (TYPED_ARRAYS[type] || Float64Array).from(...args);
}
function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
function _capitalize(str) {
	return capitalize(str[0] === "_" ? str.slice(1) : str);
}
function uncapitalize(str) {
	return str.charAt(0).toLowerCase() + str.slice(1);
}
function formatBytesToProperUnit(size, precision = 2, chunkSize = 1e3) {
	const units = [
		"TB",
		"GB",
		"MB",
		"KB"
	];
	let value = Number(size);
	let currentUnit = "B";
	while (value > chunkSize) {
		value /= chunkSize;
		currentUnit = units.pop();
	}
	return `${value.toFixed(precision)} ${currentUnit}`;
}
function formatNumbersWithThousandSeparator(n, separator = " ") {
	const sections = [];
	let size = n;
	while (size > 1e3) {
		sections.push(`000${size % 1e3}`.slice(-3));
		size = Math.floor(size / 1e3);
	}
	if (size > 0) sections.push(size);
	sections.reverse();
	return sections.join(separator);
}
function safeArrays(model) {
	Object.keys(model).forEach((key) => {
		if (Array.isArray(model[key])) model[key] = [].concat(model[key]);
	});
}
function isTypedArray(value) {
	return Object.values(TYPED_ARRAYS).some((ctor) => value instanceof ctor);
}
function shallowEquals(a, b) {
	if (a === b) return true;
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
		return true;
	}
	return false;
}
function enumToString(e, value) {
	return Object.keys(e).find((key) => e[key] === value);
}
function setImmediateVTK(fn) {
	setTimeout(fn, 0);
}
function measurePromiseExecution(promise, callback) {
	const start = performance.now();
	promise.finally(() => {
		callback(performance.now() - start);
	});
}
function obj(publicAPI = {}, model = {}) {
	safeArrays(model);
	const callbacks = [];
	if (!Number.isInteger(model.mtime)) model.mtime = ++globalMTime;
	if (!("classHierarchy" in model)) model.classHierarchy = new _Common_Core_ClassHierarchy_js__rspack_import_2/* ["default"] */.A("vtkObject");
	else if (!(model.classHierarchy instanceof _Common_Core_ClassHierarchy_js__rspack_import_2/* ["default"] */.A)) {
		const hierarchy = new _Common_Core_ClassHierarchy_js__rspack_import_2/* ["default"] */.A();
		for (let i = 0; i < model.classHierarchy.length; i++) hierarchy.push(model.classHierarchy[i]);
		model.classHierarchy = hierarchy;
	}
	function off(index) {
		callbacks[index] = null;
	}
	function on(index) {
		function unsubscribe() {
			off(index);
		}
		return Object.freeze({ unsubscribe });
	}
	publicAPI.isDeleted = () => !!model.deleted;
	publicAPI.modified = (otherMTime) => {
		if (model.deleted) {
			vtkErrorMacro("instance deleted - cannot call any method");
			return;
		}
		if (otherMTime && otherMTime < publicAPI.getMTime()) return;
		model.mtime = ++globalMTime;
		callbacks.forEach((callback) => callback && callback(publicAPI));
	};
	publicAPI.onModified = (callback) => {
		if (model.deleted) {
			vtkErrorMacro("instance deleted - cannot call any method");
			return null;
		}
		const index = callbacks.length;
		callbacks.push(callback);
		return on(index);
	};
	publicAPI.getMTime = () => model.mtime;
	publicAPI.isA = (className) => {
		let count = model.classHierarchy.length;
		while (count--) if (model.classHierarchy[count] === className) return true;
		return false;
	};
	publicAPI.getClassName = (depth = 0) => model.classHierarchy[model.classHierarchy.length - 1 - depth];
	publicAPI.set = (map = {}, noWarning = false, noFunction = false) => {
		let ret = false;
		Object.keys(map).forEach((name) => {
			const fn = noFunction ? null : publicAPI[`set${capitalize(name)}`];
			if (fn && Array.isArray(map[name]) && fn.length > 1) ret = fn(...map[name]) || ret;
			else if (fn) ret = fn(map[name]) || ret;
			else {
				if (["mtime"].indexOf(name) === -1 && !noWarning) vtkWarningMacro(`Warning: Set value to model directly ${name}, ${map[name]}`);
				ret = model[name] !== map[name] || ret;
				model[name] = map[name];
			}
		});
		return ret;
	};
	publicAPI.get = (...list) => {
		if (!list.length) return model;
		const subset = {};
		list.forEach((name) => {
			subset[name] = model[name];
		});
		return subset;
	};
	publicAPI.getReferenceByName = (val) => model[val];
	publicAPI.delete = () => {
		Object.keys(model).forEach((field) => delete model[field]);
		callbacks.forEach((el, index) => off(index));
		model.deleted = true;
	};
	publicAPI.getState = ({ preserveTypedArrays = false } = {}) => {
		if (model.deleted) return null;
		const options = { preserveTypedArrays };
		const jsonArchive = {
			...model,
			vtkClass: publicAPI.getClassName()
		};
		Object.keys(jsonArchive).forEach((keyName) => {
			if (jsonArchive[keyName] === null || jsonArchive[keyName] === void 0 || keyName[0] === "_") delete jsonArchive[keyName];
			else if (jsonArchive[keyName].isA) jsonArchive[keyName] = jsonArchive[keyName].getState(options);
			else if (Array.isArray(jsonArchive[keyName])) jsonArchive[keyName] = jsonArchive[keyName].map((item) => item && item.isA ? item.getState(options) : item);
			else if (isTypedArray(jsonArchive[keyName])) {
				if (!preserveTypedArrays) jsonArchive[keyName] = Array.from(jsonArchive[keyName]);
			}
		});
		const sortedObj = {};
		Object.keys(jsonArchive).sort().forEach((name) => {
			sortedObj[name] = jsonArchive[name];
		});
		if (sortedObj.mtime) delete sortedObj.mtime;
		return sortedObj;
	};
	publicAPI.shallowCopy = (other, debug = false) => {
		if (other.getClassName() !== publicAPI.getClassName()) throw new Error(`Cannot ShallowCopy ${other.getClassName()} into ${publicAPI.getClassName()}`);
		const otherModel = other.get();
		const keyList = Object.keys(model).sort();
		Object.keys(otherModel).sort().forEach((key) => {
			const keyIdx = keyList.indexOf(key);
			if (keyIdx === -1) {
				if (debug) vtkDebugMacro(`add ${key} in shallowCopy`);
			} else keyList.splice(keyIdx, 1);
			model[key] = otherModel[key];
		});
		if (keyList.length && debug) vtkDebugMacro(`Untouched keys: ${keyList.join(", ")}`);
		publicAPI.modified();
	};
	publicAPI.toJSON = function vtkObjToJSON() {
		return publicAPI.getState();
	};
	return publicAPI;
}
var objectGetterMap = { object(publicAPI, model, field) {
	return function getter() {
		return { ...model[field.name] };
	};
} };
function get(publicAPI, model, fieldNames) {
	fieldNames.forEach((field) => {
		if (typeof field === "object") {
			const getter = objectGetterMap[field.type];
			if (getter) publicAPI[`get${_capitalize(field.name)}`] = getter(publicAPI, model, field);
			else publicAPI[`get${_capitalize(field.name)}`] = () => model[field.name];
		} else publicAPI[`get${_capitalize(field)}`] = () => model[field];
	});
}
var objectSetterMap = {
	enum(publicAPI, model, field) {
		const onChanged = `_on${_capitalize(field.name)}Changed`;
		return (value) => {
			if (typeof value === "string") {
				if (field.enum[value] !== void 0) {
					if (model[field.name] !== field.enum[value]) {
						model[field.name] = field.enum[value];
						publicAPI.modified();
						return true;
					}
					return false;
				}
				vtkErrorMacro(`Set Enum with invalid argument ${field}, ${value}`);
				throw new RangeError("Set Enum with invalid string argument");
			}
			if (typeof value === "number") {
				if (model[field.name] !== value) {
					if (Object.keys(field.enum).map((key) => field.enum[key]).indexOf(value) !== -1) {
						const previousValue = model[field.name];
						model[field.name] = value;
						model[onChanged]?.(publicAPI, model, value, previousValue);
						publicAPI.modified();
						return true;
					}
					vtkErrorMacro(`Set Enum outside numeric range ${field}, ${value}`);
					throw new RangeError("Set Enum outside numeric range");
				}
				return false;
			}
			vtkErrorMacro(`Set Enum with invalid argument (String/Number) ${field}, ${value}`);
			throw new TypeError("Set Enum with invalid argument (String/Number)");
		};
	},
	object(publicAPI, model, field) {
		if (field.params?.length === 1) vtkWarningMacro("Setter of type \"object\" with a single \"param\" field is not supported");
		const onChanged = `_on${_capitalize(field.name)}Changed`;
		return (...args) => {
			let value;
			if (args.length > 1 && field.params?.length) value = field.params.reduce((acc, prop, idx) => Object.assign(acc, { [prop]: args[idx] }), {});
			else value = args[0];
			if (!fast_deep_equal__rspack_import_3(model[field.name], value)) {
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
	if (typeof field === "object") {
		const fn = objectSetterMap[field.type];
		if (fn) return (publicAPI, model) => fn(publicAPI, model, field);
		vtkErrorMacro(`No setter for field ${field}`);
		throw new TypeError("No setter for field");
	}
	return function getSetter(publicAPI, model) {
		const onChanged = `_on${_capitalize(field)}Changed`;
		return function setter(value) {
			if (model.deleted) {
				vtkErrorMacro("instance deleted - cannot call any method");
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
	fields.forEach((field) => {
		if (typeof field === "object") publicAPI[`set${_capitalize(field.name)}`] = findSetter(field)(publicAPI, model);
		else publicAPI[`set${_capitalize(field)}`] = findSetter(field)(publicAPI, model);
	});
}
function setGet(publicAPI, model, fieldNames) {
	get(publicAPI, model, fieldNames);
	set(publicAPI, model, fieldNames);
}
function getArray(publicAPI, model, fieldNames) {
	fieldNames.forEach((field) => {
		publicAPI[`get${_capitalize(field)}`] = () => model[field] ? Array.from(model[field]) : model[field];
		publicAPI[`get${_capitalize(field)}ByReference`] = () => model[field];
	});
}
function setArray(publicAPI, model, fieldNames, size, defaultVal = void 0) {
	fieldNames.forEach((field) => {
		if (model[field] && size && model[field].length !== size) throw new RangeError(`Invalid initial number of values for array (${field})`);
		const onChanged = `_on${_capitalize(field)}Changed`;
		publicAPI[`set${_capitalize(field)}`] = (...args) => {
			if (model.deleted) {
				vtkErrorMacro("instance deleted - cannot call any method");
				return false;
			}
			let array = args;
			let changeDetected;
			let needCopy = false;
			if (array.length === 1 && (array[0] == null || array[0].length >= 0)) {
				array = array[0];
				needCopy = true;
			}
			if (array == null) changeDetected = model[field] !== array;
			else {
				if (size && array.length !== size) if (array.length < size && defaultVal !== void 0) {
					array = Array.from(array);
					needCopy = false;
					while (array.length < size) array.push(defaultVal);
				} else throw new RangeError(`Invalid number of values for array setter (${field})`);
				changeDetected = model[field] == null || model[field].length !== array.length;
				for (let i = 0; !changeDetected && i < array.length; ++i) changeDetected = model[field][i] !== array[i];
				if (changeDetected && needCopy) array = Array.from(array);
			}
			if (changeDetected) {
				const previousValue = model[field.name];
				model[field] = array;
				model[onChanged]?.(publicAPI, model, array, previousValue);
				publicAPI.modified();
			}
			return changeDetected;
		};
		publicAPI[`set${_capitalize(field)}From`] = (otherArray) => {
			const target = model[field];
			otherArray.forEach((v, i) => {
				target[i] = v;
			});
		};
	});
}
function setGetArray(publicAPI, model, fieldNames, size, defaultVal = void 0) {
	getArray(publicAPI, model, fieldNames);
	setArray(publicAPI, model, fieldNames, size, defaultVal);
}
function moveToProtected(publicAPI, model, fieldNames) {
	for (let i = 0; i < fieldNames.length; i++) {
		const fieldName = fieldNames[i];
		if (model[fieldName] !== void 0) {
			model[`_${fieldName}`] = model[fieldName];
			delete model[fieldName];
		}
	}
}
function algo(publicAPI, model, numberOfInputs, numberOfOutputs) {
	if (model.inputData) model.inputData = model.inputData.map(_vtk_js__rspack_import_1/* ["default"] */.A);
	else model.inputData = [];
	if (model.inputConnection) model.inputConnection = model.inputConnection.map(_vtk_js__rspack_import_1/* ["default"] */.A);
	else model.inputConnection = [];
	if (model.output) model.output = model.output.map(_vtk_js__rspack_import_1/* ["default"] */.A);
	else model.output = [];
	if (model.inputArrayToProcess) model.inputArrayToProcess = model.inputArrayToProcess.map(_vtk_js__rspack_import_1/* ["default"] */.A);
	else model.inputArrayToProcess = [];
	model.numberOfInputs = numberOfInputs;
	function setInputData(dataset, port = 0) {
		if (model.deleted) {
			vtkErrorMacro("instance deleted - cannot call any method");
			return;
		}
		if (port >= model.numberOfInputs) {
			vtkErrorMacro(`algorithm ${publicAPI.getClassName()} only has ${model.numberOfInputs} input ports. To add more input ports, use addInputData()`);
			return;
		}
		if (model.inputData[port] !== dataset || model.inputConnection[port]) {
			model.inputData[port] = dataset;
			model.inputConnection[port] = null;
			if (publicAPI.modified) publicAPI.modified();
		}
	}
	function getInputData(port = 0) {
		if (model.inputConnection[port]) model.inputData[port] = model.inputConnection[port]();
		return model.inputData[port];
	}
	function setInputConnection(outputPort, port = 0) {
		if (model.deleted) {
			vtkErrorMacro("instance deleted - cannot call any method");
			return;
		}
		if (port >= model.numberOfInputs) {
			let msg = `algorithm ${publicAPI.getClassName()} only has `;
			msg += `${model.numberOfInputs}`;
			msg += " input ports. To add more input ports, use addInputConnection()";
			vtkErrorMacro(msg);
			return;
		}
		model.inputData[port] = null;
		model.inputConnection[port] = outputPort;
	}
	function getInputConnection(port = 0) {
		return model.inputConnection[port];
	}
	function getPortToFill() {
		let portToFill = model.numberOfInputs;
		while (portToFill && !model.inputData[portToFill - 1] && !model.inputConnection[portToFill - 1]) portToFill--;
		if (portToFill === model.numberOfInputs) model.numberOfInputs++;
		return portToFill;
	}
	function addInputConnection(outputPort) {
		if (model.deleted) {
			vtkErrorMacro("instance deleted - cannot call any method");
			return;
		}
		setInputConnection(outputPort, getPortToFill());
	}
	function addInputData(dataset) {
		if (model.deleted) {
			vtkErrorMacro("instance deleted - cannot call any method");
			return;
		}
		setInputData(dataset, getPortToFill());
	}
	function getOutputData(port = 0) {
		if (model.deleted) {
			vtkErrorMacro("instance deleted - cannot call any method");
			return null;
		}
		if (publicAPI.shouldUpdate()) publicAPI.update();
		return model.output[port];
	}
	publicAPI.shouldUpdate = () => {
		const localMTime = publicAPI.getMTime();
		let minOutputMTime = Infinity;
		let count = numberOfOutputs;
		while (count--) {
			if (!model.output[count] || model.output[count].isDeleted()) return true;
			const mt = model.output[count].getMTime();
			if (mt < localMTime) return true;
			if (mt < minOutputMTime) minOutputMTime = mt;
		}
		count = model.numberOfInputs;
		while (count--) if (model.inputConnection[count]?.filter.shouldUpdate() || publicAPI.getInputData(count)?.getMTime() > minOutputMTime) return true;
		return false;
	};
	function getOutputPort(port = 0) {
		const outputPortAccess = () => getOutputData(port);
		outputPortAccess.filter = publicAPI;
		return outputPortAccess;
	}
	if (model.numberOfInputs) {
		let count = model.numberOfInputs;
		while (count--) {
			model.inputData.push(null);
			model.inputConnection.push(null);
		}
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
		if (publicAPI.requestData && !publicAPI.isDeleted() && publicAPI.shouldUpdate()) publicAPI.requestData(ins, model.output);
	};
	publicAPI.getNumberOfInputPorts = () => model.numberOfInputs;
	publicAPI.getNumberOfOutputPorts = () => numberOfOutputs || model.output.length;
	publicAPI.getInputArrayToProcess = (inputPort) => {
		const arrayDesc = model.inputArrayToProcess[inputPort];
		const ds = model.inputData[inputPort];
		if (arrayDesc && ds) return ds[`get${arrayDesc.fieldAssociation}`]().getArray(arrayDesc.arrayName);
		return null;
	};
	publicAPI.setInputArrayToProcess = (inputPort, arrayName, fieldAssociation, attributeType = "Scalars") => {
		while (model.inputArrayToProcess.length < inputPort) model.inputArrayToProcess.push(null);
		model.inputArrayToProcess[inputPort] = {
			arrayName,
			fieldAssociation,
			attributeType
		};
	};
}
var EVENT_ABORT = Symbol("Event abort");
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
		return Object.freeze({ unsubscribe });
	}
	function invoke() {
		if (model.deleted) {
			vtkErrorMacro("instance deleted - cannot call any method");
			return;
		}
		const currentCallbacks = callbacks.slice();
		for (let index = 0; index < currentCallbacks.length; ++index) {
			const [, cb, priority] = currentCallbacks[index];
			if (!cb) continue;
			if (priority < 0) setTimeout(() => cb.apply(publicAPI, arguments), 1 - priority);
			else if (cb.apply(publicAPI, arguments) === EVENT_ABORT) break;
		}
	}
	publicAPI[`invoke${_capitalize(eventName)}`] = invoke;
	publicAPI[`on${_capitalize(eventName)}`] = (callback, priority = 0) => {
		if (!callback.apply) {
			console.error(`Invalid callback for event ${eventName}`);
			return null;
		}
		if (model.deleted) {
			vtkErrorMacro("instance deleted - cannot call any method");
			return null;
		}
		const callbackID = curCallbackID++;
		callbacks.push([
			callbackID,
			callback,
			priority
		]);
		callbacks.sort((cb1, cb2) => cb2[2] - cb1[2]);
		return on(callbackID);
	};
	publicAPI.delete = () => {
		previousDelete();
		callbacks.forEach(([cbID]) => off(cbID));
	};
}
function newInstance(extend, className) {
	const constructor = (initialValues = {}) => {
		const model = {};
		const publicAPI = {};
		extend(publicAPI, model, initialValues);
		return Object.freeze(publicAPI);
	};
	if (className) _vtk_js__rspack_import_1/* ["default"].register */.A.register(className, constructor);
	return constructor;
}
function chain(...fn) {
	return (...args) => fn.filter((i) => !!i).map((i) => i(...args));
}
function isVtkObject(instance) {
	return instance && instance.isA && instance.isA("vtkObject");
}
function traverseInstanceTree(instance, extractFunction, accumulator = [], visitedInstances = []) {
	if (isVtkObject(instance)) {
		if (visitedInstances.indexOf(instance) >= 0) return accumulator;
		visitedInstances.push(instance);
		const result = extractFunction(instance);
		if (result !== void 0) accumulator.push(result);
		const model = instance.get();
		Object.keys(model).forEach((key) => {
			const modelObj = model[key];
			if (Array.isArray(modelObj)) modelObj.forEach((subObj) => {
				traverseInstanceTree(subObj, extractFunction, accumulator, visitedInstances);
			});
			else traverseInstanceTree(modelObj, extractFunction, accumulator, visitedInstances);
		});
	}
	return accumulator;
}
function debounce(func, wait, immediate) {
	let timeout;
	const debounced = (...args) => {
		const context = this;
		const later = () => {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
	debounced.cancel = () => clearTimeout(timeout);
	return debounced;
}
function throttle(callback, delay) {
	let isThrottled = false;
	let argsToUse = null;
	function next() {
		isThrottled = false;
		if (argsToUse !== null) {
			wrapper(...argsToUse);
			argsToUse = null;
		}
	}
	function wrapper(...args) {
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
function keystore(publicAPI, model, initialKeystore = {}) {
	model.keystore = Object.assign(model.keystore || {}, initialKeystore);
	publicAPI.setKey = (key, value) => {
		model.keystore[key] = value;
	};
	publicAPI.getKey = (key) => model.keystore[key];
	publicAPI.getAllKeys = () => Object.keys(model.keystore);
	publicAPI.deleteKey = (key) => delete model.keystore[key];
	publicAPI.clearKeystore = () => publicAPI.getAllKeys().forEach((key) => delete model.keystore[key]);
}
var nextProxyId = 1;
var ROOT_GROUP_NAME = "__root__";
function proxy(publicAPI, model) {
	keystore(publicAPI, model);
	const parentDelete = publicAPI.delete;
	model.proxyId = `${nextProxyId++}`;
	model.ui = JSON.parse(JSON.stringify(model.ui || []));
	get(publicAPI, model, [
		"proxyId",
		"proxyGroup",
		"proxyName"
	]);
	setGet(publicAPI, model, ["proxyManager"]);
	const propertyMap = {};
	const groupChildrenNames = {};
	function registerProperties(descriptionList, currentGroupName) {
		if (!groupChildrenNames[currentGroupName]) groupChildrenNames[currentGroupName] = [];
		const childrenNames = groupChildrenNames[currentGroupName];
		for (let i = 0; i < descriptionList.length; i++) {
			childrenNames.push(descriptionList[i].name);
			propertyMap[descriptionList[i].name] = descriptionList[i];
			if (descriptionList[i].children && descriptionList[i].children.length) registerProperties(descriptionList[i].children, descriptionList[i].name);
		}
	}
	registerProperties(model.ui, ROOT_GROUP_NAME);
	publicAPI.updateUI = (ui) => {
		model.ui = JSON.parse(JSON.stringify(ui || []));
		Object.keys(propertyMap).forEach((k) => delete propertyMap[k]);
		Object.keys(groupChildrenNames).forEach((k) => delete groupChildrenNames[k]);
		registerProperties(model.ui, ROOT_GROUP_NAME);
		publicAPI.modified();
	};
	function listProxyProperties(gName = ROOT_GROUP_NAME) {
		return groupChildrenNames[gName];
	}
	publicAPI.updateProxyProperty = (propertyName, propUI) => {
		const prop = propertyMap[propertyName];
		if (prop) Object.assign(prop, propUI);
		else propertyMap[propertyName] = { ...propUI };
	};
	publicAPI.activate = () => {
		if (model.proxyManager) {
			const setActiveMethod = `setActive${_capitalize(publicAPI.getProxyGroup().slice(0, -1))}`;
			if (model.proxyManager[setActiveMethod]) model.proxyManager[setActiveMethod](publicAPI);
		}
	};
	model.propertyLinkSubscribers = {};
	publicAPI.registerPropertyLinkForGC = (otherLink, type) => {
		if (!(type in model.propertyLinkSubscribers)) model.propertyLinkSubscribers[type] = [];
		model.propertyLinkSubscribers[type].push(otherLink);
	};
	publicAPI.gcPropertyLinks = (type) => {
		const subscribers = model.propertyLinkSubscribers[type] || [];
		while (subscribers.length) subscribers.pop().unbind(publicAPI);
	};
	model.propertyLinkMap = {};
	publicAPI.getPropertyLink = (id, persistent = false) => {
		if (model.propertyLinkMap[id]) return model.propertyLinkMap[id];
		let value = null;
		const links = [];
		let count = 0;
		let updateInProgress = false;
		function update(source, force = false) {
			if (updateInProgress) return null;
			const needUpdate = [];
			let sourceLink = null;
			count = links.length;
			while (count--) {
				const link = links[count];
				if (link.instance === source) sourceLink = link;
				else needUpdate.push(link);
			}
			if (!sourceLink) return null;
			const newValue = sourceLink.instance[`get${_capitalize(sourceLink.propertyName)}`]();
			if (!shallowEquals(newValue, value) || force) {
				value = newValue;
				updateInProgress = true;
				while (needUpdate.length) {
					const linkToUpdate = needUpdate.pop();
					linkToUpdate.instance.set({ [linkToUpdate.propertyName]: value });
				}
				updateInProgress = false;
			}
			if (model.propertyLinkMap[id].persistent) model.propertyLinkMap[id].value = newValue;
			return newValue;
		}
		function unbind(instance, propertyName) {
			const indexToDelete = [];
			count = links.length;
			while (count--) {
				const link = links[count];
				if (link.instance === instance && (link.propertyName === propertyName || propertyName === void 0)) {
					link.subscription.unsubscribe();
					indexToDelete.push(count);
				}
			}
			while (indexToDelete.length) links.splice(indexToDelete.pop(), 1);
		}
		function bind(instance, propertyName, updateMe = false) {
			const subscription = instance.onModified(update);
			const other = links[0];
			links.push({
				instance,
				propertyName,
				subscription
			});
			if (updateMe) {
				if (model.propertyLinkMap[id].persistent && model.propertyLinkMap[id].value !== void 0) instance.set({ [propertyName]: model.propertyLinkMap[id].value });
				else if (other) update(other.instance, true);
			}
			return { unsubscribe: () => unbind(instance, propertyName) };
		}
		function unsubscribe() {
			while (links.length) links.pop().subscription.unsubscribe();
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
	function getProperties(groupName = ROOT_GROUP_NAME) {
		const values = [];
		const id = model.proxyId;
		const propertyNames = listProxyProperties(groupName) || [];
		for (let i = 0; i < propertyNames.length; i++) {
			const name = propertyNames[i];
			const method = publicAPI[`get${_capitalize(name)}`];
			const prop = {
				id,
				name,
				value: method ? method() : void 0
			};
			const children = getProperties(name);
			if (children.length) prop.children = children;
			values.push(prop);
		}
		return values;
	}
	publicAPI.listPropertyNames = () => getProperties().map((p) => p.name);
	publicAPI.getPropertyByName = (name) => getProperties().find((p) => p.name === name);
	publicAPI.getPropertyDomainByName = (name) => (propertyMap[name] || {}).domain;
	publicAPI.getProxySection = () => ({
		id: model.proxyId,
		name: model.proxyGroup,
		ui: model.ui,
		properties: getProperties()
	});
	publicAPI.delete = () => {
		const list = Object.keys(model.propertyLinkMap);
		let count = list.length;
		while (count--) model.propertyLinkMap[list[count]].unsubscribe();
		Object.keys(model.propertyLinkSubscribers).forEach(publicAPI.gcPropertyLinks);
		parentDelete();
	};
	publicAPI.getState = () => null;
	function registerLinks() {
		if (model.links) for (let i = 0; i < model.links.length; i++) {
			const { link, property, persistent, updateOnBind, type } = model.links[i];
			if (type === "application") {
				const sLink = model.proxyManager.getPropertyLink(link, persistent);
				publicAPI.registerPropertyLinkForGC(sLink, "application");
				sLink.bind(publicAPI, property, updateOnBind);
			}
		}
	}
	setImmediateVTK(registerLinks);
}
function proxyPropertyMapping(publicAPI, model, map) {
	const parentDelete = publicAPI.delete;
	const subscriptions = [];
	const propertyNames = Object.keys(map);
	let count = propertyNames.length;
	while (count--) {
		const propertyName = propertyNames[count];
		const { modelKey, property, modified = true } = map[propertyName];
		const methodSrc = _capitalize(property);
		const methodDst = _capitalize(propertyName);
		publicAPI[`get${methodDst}`] = model[modelKey][`get${methodSrc}`];
		publicAPI[`set${methodDst}`] = model[modelKey][`set${methodSrc}`];
		if (modified) subscriptions.push(model[modelKey].onModified(publicAPI.modified));
	}
	publicAPI.delete = () => {
		while (subscriptions.length) subscriptions.pop().unsubscribe();
		parentDelete();
	};
}
function proxyPropertyState(publicAPI, model, state = {}, defaults = {}) {
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
		const key = modelKeys[count];
		model[key] = defaults[key];
		const mapping = state[key];
		publicAPI[`set${_capitalize(key)}`] = (value) => {
			if (value !== model[key]) {
				model[key] = value;
				const propValues = mapping[value];
				applyState(propValues);
				publicAPI.modified();
			}
		};
	}
	if (modelKeys.length) get(publicAPI, model, modelKeys);
}
var PIXEL_STEP = 10;
var LINE_HEIGHT = 40;
var PAGE_HEIGHT = 800;
function normalizeWheel(wheelEvent) {
	let sX = 0;
	let sY = 0;
	let pX = 0;
	let pY = 0;
	if ("detail" in wheelEvent) sY = wheelEvent.detail;
	if ("wheelDelta" in wheelEvent) sY = -wheelEvent.wheelDelta / 120;
	if ("wheelDeltaY" in wheelEvent) sY = -wheelEvent.wheelDeltaY / 120;
	if ("wheelDeltaX" in wheelEvent) sX = -wheelEvent.wheelDeltaX / 120;
	if ("axis" in wheelEvent && wheelEvent.axis === wheelEvent.HORIZONTAL_AXIS) {
		sX = sY;
		sY = 0;
	}
	pX = sX * PIXEL_STEP;
	pY = sY * PIXEL_STEP;
	if ("deltaY" in wheelEvent) pY = wheelEvent.deltaY;
	if ("deltaX" in wheelEvent) pX = wheelEvent.deltaX;
	if ((pX || pY) && wheelEvent.deltaMode) if (wheelEvent.deltaMode === 1) {
		pX *= LINE_HEIGHT;
		pY *= LINE_HEIGHT;
	} else {
		pX *= PAGE_HEIGHT;
		pY *= PAGE_HEIGHT;
	}
	if (pX && !sX) sX = pX < 1 ? -1 : 1;
	if (pY && !sY) sY = pY < 1 ? -1 : 1;
	return {
		spinX: sX,
		spinY: sY || sX,
		pixelX: pX,
		pixelY: pY || pX
	};
}
var macros_default = {
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
	uncapitalize,
	VOID,
	vtkDebugMacro,
	vtkErrorMacro,
	vtkInfoMacro,
	vtkLogMacro,
	vtkOnceErrorMacro,
	vtkWarningMacro,
	objectSetterMap,
	requiredParam
};
//#endregion


//# sourceMappingURL=macros.js.map

},

}]);