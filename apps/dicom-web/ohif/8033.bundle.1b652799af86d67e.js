"use strict";
(globalThis["rspackChunk"] = globalThis["rspackChunk"] || []).push([[8033], {
28910(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  add: () => (add),
  adjoint: () => (adjoint),
  clone: () => (clone),
  copy: () => (copy),
  create: () => (create),
  determinant: () => (determinant),
  equals: () => (equals),
  exactEquals: () => (exactEquals),
  frob: () => (frob),
  fromQuat: () => (fromQuat),
  fromQuat2: () => (fromQuat2),
  fromRotation: () => (fromRotation),
  fromRotationTranslation: () => (fromRotationTranslation),
  fromRotationTranslationScale: () => (fromRotationTranslationScale),
  fromRotationTranslationScaleOrigin: () => (fromRotationTranslationScaleOrigin),
  fromScaling: () => (fromScaling),
  fromTranslation: () => (fromTranslation),
  fromValues: () => (fromValues),
  fromXRotation: () => (fromXRotation),
  fromYRotation: () => (fromYRotation),
  fromZRotation: () => (fromZRotation),
  frustum: () => (frustum),
  getRotation: () => (getRotation),
  getScaling: () => (getScaling),
  getTranslation: () => (getTranslation),
  identity: () => (identity),
  invert: () => (invert),
  lookAt: () => (lookAt),
  mul: () => (mul),
  multiply: () => (multiply),
  multiplyScalar: () => (multiplyScalar),
  multiplyScalarAndAdd: () => (multiplyScalarAndAdd),
  ortho: () => (ortho),
  orthoNO: () => (orthoNO),
  orthoZO: () => (orthoZO),
  perspective: () => (perspective),
  perspectiveFromFieldOfView: () => (perspectiveFromFieldOfView),
  perspectiveNO: () => (perspectiveNO),
  perspectiveZO: () => (perspectiveZO),
  rotate: () => (rotate),
  rotateX: () => (rotateX),
  rotateY: () => (rotateY),
  rotateZ: () => (rotateZ),
  scale: () => (scale),
  set: () => (set),
  str: () => (str),
  sub: () => (sub),
  subtract: () => (subtract),
  targetTo: () => (targetTo),
  translate: () => (translate),
  transpose: () => (transpose)
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
  var out = new _common_js__rspack_import_0/* .ARRAY_TYPE */.tb(16);

  if (_common_js__rspack_import_0/* .ARRAY_TYPE */.tb != Float32Array) {
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
  var out = new _common_js__rspack_import_0/* .ARRAY_TYPE */.tb(16);
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
  var out = new _common_js__rspack_import_0/* .ARRAY_TYPE */.tb(16);
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

  if (len < _common_js__rspack_import_0/* .EPSILON */.p8) {
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

  if (len < _common_js__rspack_import_0/* .EPSILON */.p8) {
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
  var translation = new _common_js__rspack_import_0/* .ARRAY_TYPE */.tb(3);
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
  var scaling = new _common_js__rspack_import_0/* .ARRAY_TYPE */.tb(3);
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

var perspective = perspectiveNO;
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

var ortho = orthoNO;
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

  if (Math.abs(eyex - centerx) < _common_js__rspack_import_0/* .EPSILON */.p8 && Math.abs(eyey - centery) < _common_js__rspack_import_0/* .EPSILON */.p8 && Math.abs(eyez - centerz) < _common_js__rspack_import_0/* .EPSILON */.p8) {
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
  return Math.abs(a0 - b0) <= _common_js__rspack_import_0/* .EPSILON */.p8 * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__rspack_import_0/* .EPSILON */.p8 * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__rspack_import_0/* .EPSILON */.p8 * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _common_js__rspack_import_0/* .EPSILON */.p8 * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= _common_js__rspack_import_0/* .EPSILON */.p8 * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= _common_js__rspack_import_0/* .EPSILON */.p8 * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= _common_js__rspack_import_0/* .EPSILON */.p8 * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= _common_js__rspack_import_0/* .EPSILON */.p8 * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= _common_js__rspack_import_0/* .EPSILON */.p8 * Math.max(1.0, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= _common_js__rspack_import_0/* .EPSILON */.p8 * Math.max(1.0, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= _common_js__rspack_import_0/* .EPSILON */.p8 * Math.max(1.0, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= _common_js__rspack_import_0/* .EPSILON */.p8 * Math.max(1.0, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= _common_js__rspack_import_0/* .EPSILON */.p8 * Math.max(1.0, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= _common_js__rspack_import_0/* .EPSILON */.p8 * Math.max(1.0, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= _common_js__rspack_import_0/* .EPSILON */.p8 * Math.max(1.0, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= _common_js__rspack_import_0/* .EPSILON */.p8 * Math.max(1.0, Math.abs(a15), Math.abs(b15));
}
/**
 * Alias for {@link mat4.multiply}
 * @function
 */

var mul = multiply;
/**
 * Alias for {@link mat4.subtract}
 * @function
 */

var sub = subtract;

},
50095(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Bw: () => (length),
  C: () => (copy),
  Om: () => (dot),
  Xd: () => (getAxisAngle),
  Xr: () => (conjugate),
  fA: () => (fromValues),
  lw: () => (multiply),
  m3: () => (squaredLength),
  nu: () => (slerp),
  vt: () => (create),
  x8: () => (setAxisAngle)
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

  if (s > _common_js__rspack_import_0/* .EPSILON */.p8) {
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
67872(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Bw: () => (length),
  Io: () => (distance),
  Ln: () => (scaleAndAdd),
  Om: () => (dot),
  Re: () => (subtract),
  S8: () => (normalize),
  WQ: () => (add),
  fA: () => (fromValues),
  hZ: () => (set),
  jb: () => (sub),
  o8: () => (clone),
  vt: () => (create),
  xg: () => (dist)
});
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
  var out = new _common_js__rspack_import_0/* .ARRAY_TYPE */.tb(2);
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
  var out = new _common_js__rspack_import_0/* .ARRAY_TYPE */.tb(2);
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

var sub = subtract;
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

var dist = distance;
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
  Bw: () => (length),
  C: () => (copy),
  DI: () => (inverse),
  Il: () => (len),
  Io: () => (distance),
  Ln: () => (scaleAndAdd),
  Om: () => (dot),
  Re: () => (subtract),
  S8: () => (normalize),
  WQ: () => (add),
  Z0: () => (transformMat4),
  aI: () => (equals),
  ei: () => (transformMat3),
  fA: () => (fromValues),
  g7: () => (angle),
  hZ: () => (set),
  hs: () => (scale),
  jb: () => (sub),
  lo: () => (sqrDist),
  lw: () => (multiply),
  o8: () => (clone),
  t2: () => (exactEquals),
  v_: () => (zero),
  vt: () => (create),
  xg: () => (dist),
  ze: () => (negate)
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
  var out = new _common_js__rspack_import_0/* .ARRAY_TYPE */.tb(3);
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
  return Math.abs(a0 - b0) <= _common_js__rspack_import_0/* .EPSILON */.p8 * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__rspack_import_0/* .EPSILON */.p8 * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__rspack_import_0/* .EPSILON */.p8 * Math.max(1.0, Math.abs(a2), Math.abs(b2));
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
  Re: () => (subtract),
  S8: () => (normalize),
  WQ: () => (add),
  Z0: () => (transformMat4),
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
97075(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  qV: () => (/* reexport safe */ _ViewportArchitectureTypes_js__rspack_import_3.qV),
  sv: () => (/* reexport safe */ _ViewportArchitectureTypes_js__rspack_import_3.sv)
});
/* import */ var _DefaultRenderPathResolver_js__rspack_import_0 = __webpack_require__(79003);
/* import */ var _GenericViewport_js__rspack_import_1 = __webpack_require__(43216);
/* import */ var _viewportProjection_js__rspack_import_2 = __webpack_require__(12436);
/* import */ var _ViewportArchitectureTypes_js__rspack_import_3 = __webpack_require__(51869);
/* import */ var _ECG_index_js__rspack_import_4 = __webpack_require__(73321);
/* import */ var _Video_index_js__rspack_import_5 = __webpack_require__(18855);
/* import */ var _Planar_index_js__rspack_import_6 = __webpack_require__(57644);
/* import */ var _Volume3D_index_js__rspack_import_7 = __webpack_require__(1565);
/* import */ var _WSI_index_js__rspack_import_8 = __webpack_require__(85001);
















},
59034(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (createVolumeMapper)
});
/* import */ var _vtkClasses_index_js__rspack_import_0 = __webpack_require__(21155);
/* import */ var _init_js__rspack_import_1 = __webpack_require__(1509);
/* import */ var _kitware_vtk_js_Rendering_Core_VolumeMapper_js__rspack_import_2 = __webpack_require__(41822);
/* import */ var _kitware_vtk_js_Common_Core_DataArray_js__rspack_import_3 = __webpack_require__(445);




function createVolumeMapper(imageData, vtkOpenGLTexture) {
    const volumeMapper = _vtkClasses_index_js__rspack_import_0/* .vtkSharedVolumeMapper.newInstance */.wu.newInstance();
    volumeMapper.setInputData(imageData);
    const spacing = imageData.getSpacing();
    const sampleDistanceMultiplier = (0,_init_js__rspack_import_1/* .getConfiguration */.D0)().rendering?.volumeRendering?.sampleDistanceMultiplier ||
        1;
    const sampleDistance = (sampleDistanceMultiplier * (spacing[0] + spacing[1] + spacing[2])) / 6;
    volumeMapper.setMaximumSamplesPerRay(4000);
    volumeMapper.setSampleDistance(sampleDistance);
    volumeMapper.setScalarTexture(vtkOpenGLTexture);
    return volumeMapper;
}
function convertMapperToNotSharedMapper(sharedMapper) {
    const volumeMapper = vtkVolumeMapper.newInstance();
    volumeMapper.setBlendMode(sharedMapper.getBlendMode());
    const imageData = sharedMapper.getInputData();
    const { voxelManager } = imageData.get('voxelManager');
    const values = voxelManager.getCompleteScalarDataArray();
    const scalarArray = vtkDataArray.newInstance({
        name: `Pixels`,
        values,
    });
    imageData.getPointData().setScalars(scalarArray);
    volumeMapper.setInputData(imageData);
    volumeMapper.setMaximumSamplesPerRay(sharedMapper.getMaximumSamplesPerRay());
    volumeMapper.setSampleDistance(sharedMapper.getSampleDistance());
    return volumeMapper;
}


},
76080(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  oI: () => (/* reexport */ getOrCreateCanvas/* .getOrCreateCanvas */.oI),
  A7: () => (/* reexport */ setVolumesForViewports/* ["default"] */.A)
});

// UNUSED EXPORTS: EPSILON, addImageSlicesToViewports, addVolumesToViewports, createCanvas, createViewportElement, createVolumeActor, createVolumeMapper, getProjectionScaleMatrix, setCanvasCreator, updateCanvasSizeAndAspectRatio, volumeNewImageEventDispatcher

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/createVolumeActor.js + 2 modules
var createVolumeActor = __webpack_require__(249);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/createVolumeMapper.js
var createVolumeMapper = __webpack_require__(59034);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/getOrCreateCanvas.js
var getOrCreateCanvas = __webpack_require__(36520);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/setVolumesForViewports.js
var setVolumesForViewports = __webpack_require__(65268);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/supportsVolumeCompatibilityApi.js
var supportsVolumeCompatibilityApi = __webpack_require__(96099);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/addVolumesToViewports.js

async function addVolumesToViewports(renderingEngine, volumeInputs, viewportIds, immediateRender = false, suppressEvents = false) {
    const compatibleViewports = [];
    for (const viewportId of viewportIds) {
        const viewport = renderingEngine.getViewport(viewportId);
        if (!viewport) {
            throw new Error(`Viewport with Id ${viewportId} does not exist`);
        }
        if (!isVolumeCompatible(viewport)) {
            console.warn(`Viewport with Id ${viewportId} does not implement addVolumes. Cannot add volume to this viewport.`);
            return;
        }
        compatibleViewports.push(viewport);
    }
    await Promise.all(compatibleViewports.map((viewport) => viewport.addVolumes(volumeInputs, immediateRender, suppressEvents)));
    return;
}
/* export default */ const helpers_addVolumesToViewports = ((/* unused pure expression or super */ null && (addVolumesToViewports)));

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/volumeNewImageEventDispatcher.js
var volumeNewImageEventDispatcher = __webpack_require__(66931);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/addImageSlicesToViewports.js
var addImageSlicesToViewports = __webpack_require__(24424);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/getProjectionScaleMatrix.js
var getProjectionScaleMatrix = __webpack_require__(77837);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/index.js











},
50727(__unused_rspack___webpack_module__, __unused_rspack___webpack_exports__, __webpack_require__) {
/* import */ var _cache_js__rspack_import_0 = __webpack_require__(67425);
/* import */ var _classes_ImageVolume_js__rspack_import_1 = __webpack_require__(77027);
/* import */ var _classes_Surface_js__rspack_import_2 = __webpack_require__(49811);
/* import */ var _classes_Mesh_js__rspack_import_3 = __webpack_require__(27129);
/* import */ var _classes_StreamingImageVolume_js__rspack_import_4 = __webpack_require__(50997);
/* import */ var _classes_StreamingDynamicImageVolume_js__rspack_import_5 = __webpack_require__(16132);









},
20274(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  BlendModes: () => (/* reexport */ BlendModes/* ["default"] */.A),
  CalibrationTypes: () => (/* reexport */ CalibrationTypes/* ["default"] */.A),
  Events: () => (/* reexport */ Events/* ["default"] */.A),
  GeometryType: () => (/* reexport */ GeometryType/* ["default"] */.A),
  ImageQualityStatus: () => (/* reexport */ ImageQualityStatus/* ["default"] */.A),
  InterpolationType: () => (/* reexport */ InterpolationType/* ["default"] */.A),
  MeshType: () => (/* reexport */ MeshType/* ["default"] */.A),
  MetadataModules: () => (/* reexport */ MetadataModules/* ["default"] */.A),
  OrientationAxis: () => (/* reexport */ OrientationAxis/* ["default"] */.A),
  RenderBackends: () => (/* reexport */ RenderBackends/* ["default"] */.A),
  RenderingEngineModeEnum: () => (/* reexport */ RenderingEngineModeEnum/* ["default"] */.A),
  RequestType: () => (/* reexport */ RequestType/* ["default"] */.A),
  VOILUTFunctionType: () => (/* reexport */ VOILUTFunctionType/* ["default"] */.A),
  VideoEnums: () => (/* reexport */ VideoEnums),
  ViewportStatus: () => (/* reexport */ ViewportStatus/* ["default"] */.A),
  ViewportType: () => (/* reexport */ ViewportType/* ["default"] */.A)
});

// UNUSED EXPORTS: ContourType, DynamicOperatorType, GenerateImageType, ViewportTypes, VoxelManagerEnum

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/Events.js
var Events = __webpack_require__(19986);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/RequestType.js
var RequestType = __webpack_require__(83290);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/ViewportType.js
var ViewportType = __webpack_require__(77037);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/ViewportTypes.js
var ViewportTypes = __webpack_require__(50376);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/InterpolationType.js
var InterpolationType = __webpack_require__(28265);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/BlendModes.js
var BlendModes = __webpack_require__(96134);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/OrientationAxis.js
var OrientationAxis = __webpack_require__(44236);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/GeometryType.js
var GeometryType = __webpack_require__(61623);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/ContourType.js
var ContourType = __webpack_require__(48457);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/MeshType.js
var MeshType = __webpack_require__(34190);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/VOILUTFunctionType.js
var VOILUTFunctionType = __webpack_require__(78072);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/DynamicOperatorType.js
var DynamicOperatorType = __webpack_require__(90458);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/CalibrationTypes.js
var CalibrationTypes = __webpack_require__(89774);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/ViewportStatus.js
var ViewportStatus = __webpack_require__(19939);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/ImageQualityStatus.js
var ImageQualityStatus = __webpack_require__(79143);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/VideoEnums.js
var VideoEnums = __webpack_require__(97936);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/MetadataModules.js
var MetadataModules = __webpack_require__(88269);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/GenerateImageType.js
var GenerateImageType_GenerateImageType;
(function (GenerateImageType) {
    GenerateImageType["SUM"] = "SUM";
    GenerateImageType["SUBTRACT"] = "SUBTRACT";
    GenerateImageType["AVERAGE"] = "AVERAGE";
})(GenerateImageType_GenerateImageType || (GenerateImageType_GenerateImageType = {}));

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/VoxelManagerEnum.js
var VoxelManagerEnum = __webpack_require__(70397);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/RenderingEngineModeEnum.js
var RenderingEngineModeEnum = __webpack_require__(21827);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/RenderBackends.js
var RenderBackends = __webpack_require__(97714);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/index.js
























},
88479(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  ActorRenderMode: () => (/* reexport */ types/* .ActorRenderMode */.T),
  BaseVolumeViewport: () => (/* reexport */ BaseVolumeViewport/* ["default"] */.A),
  CONSTANTS: () => (/* reexport */ constants),
  Enums: () => (/* reexport */ enums),
  StackViewport: () => (/* reexport */ StackViewport/* ["default"] */.A),
  VolumeViewport: () => (/* reexport */ VolumeViewport/* ["default"] */.A),
  cache: () => (/* reexport */ cache_cache/* ["default"] */.Ay),
  eventTarget: () => (/* reexport */ eventTarget/* ["default"] */.A),
  getEnabledElement: () => (/* reexport */ getEnabledElement/* ["default"] */.Ay),
  getEnabledElementByIds: () => (/* reexport */ getEnabledElement/* .getEnabledElementByIds */.b1),
  getEnabledElementByViewportId: () => (/* reexport */ getEnabledElement/* .getEnabledElementByViewportId */.yj),
  getEnabledElements: () => (/* reexport */ getEnabledElement/* .getEnabledElements */.zb),
  getRenderingEngine: () => (/* reexport */ getRenderingEngine/* .getRenderingEngine */.lD),
  getRenderingEngines: () => (/* reexport */ getRenderingEngine/* .getRenderingEngines */.qO),
  getShouldUseCPURendering: () => (/* reexport */ init/* .getShouldUseCPURendering */.LH),
  getWebWorkerManager: () => (/* reexport */ init/* .getWebWorkerManager */.G_),
  imageLoader: () => (/* reexport */ imageLoader),
  metaData: () => (/* reexport */ metaData),
  triggerEvent: () => (/* reexport */ triggerEvent/* ["default"] */.A),
  utilities: () => (/* reexport */ utilities),
  viewportHasPan: () => (/* reexport */ RenderingEngine_GenericViewport/* .viewportHasPan */.sv),
  viewportHasZoom: () => (/* reexport */ RenderingEngine_GenericViewport/* .viewportHasZoom */.qV),
  volumeLoader: () => (/* reexport */ volumeLoader)
});

// UNUSED EXPORTS: BaseRenderingEngine, ContextPoolRenderingEngine, DefaultECGDataProvider, DefaultPlanarDataProvider, DefaultRenderPathResolver, DefaultVideoDataProvider, DefaultVolume3DDataProvider, DefaultWSIDataProvider, ECGGenericViewport, ECGViewport, EPSILON, EVENTS, GenericViewport, GenericVolumeViewport3D, ImageVolume, LegacyVolumeViewport3D, PlanarViewport, ProgressiveRetrieveImages, RenderBackends, RenderingEngine, Settings, StreamingDynamicImageVolume, StreamingImageVolume, Surface, TiledRenderingEngine, VideoGenericViewport, VideoViewport, Viewport, ViewportProjectionService, VolumeViewport3D, WSIGenericViewport, WSIViewport, addImageSlicesToViewports, addVolumesToViewports, canRenderFloatTextures, convertColorArrayToRgbString, convertMapperToNotSharedMapper, cornerstoneMeshLoader, cornerstoneStreamingDynamicImageVolumeLoader, cornerstoneStreamingImageVolumeLoader, createCanvas, createDefaultECGRenderPaths, createDefaultPlanarRenderPaths, createDefaultVideoRenderPaths, createDefaultVolume3DRenderPaths, createDefaultWSIRenderPaths, createECGRenderPathResolver, createPlanarRenderPathResolver, createVideoRenderPathResolver, createViewportElement, createVolume3DRenderPathResolver, createVolumeActor, createVolumeMapper, createWSIRenderPathResolver, decimatedVolumeLoader, defaultRenderPathResolver, detectRenderingCapabilities, ecgProjection, geometryLoader, getConfiguration, getEffectiveRenderBackend, getOrCreateCanvas, getProjectionScaleMatrix, getRenderBackend, getRenderingCapabilities, getUseGenericViewport, imageLoadPoolManager, imageRetrievalPoolManager, init, isCornerstoneInitialized, isRegisteredRenderBackend, isRegisteredViewportType, peerImport, planarProjection, registerImageLoader, registerRenderBackend, registerViewportType, renderingEngineExportsV2, requestPoolManager, resetInitialization, resetUseCPURendering, setCanvasCreator, setConfiguration, setPreferSizeOverAccuracy, setRenderBackend, setUseCPURendering, setVolumesForViewports, updateCanvasSizeAndAspectRatio, version, videoProjection, viewportHasCanvasWorldTransform, viewportHasFrameOfReferenceUID, viewportProjection, volume3DProjection, wsiProjection

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/enums/index.js + 1 modules
var enums = __webpack_require__(20274);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/constants/index.js + 3 modules
var constants = __webpack_require__(92458);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/index.js + 3 modules
var RenderingEngine = __webpack_require__(8369);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/createVolumeActor.js + 2 modules
var createVolumeActor = __webpack_require__(249);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/createVolumeMapper.js
var createVolumeMapper = __webpack_require__(59034);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/getOrCreateCanvas.js
var getOrCreateCanvas = __webpack_require__(36520);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/VolumeViewport.js + 2 modules
var VolumeViewport = __webpack_require__(56825);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/VolumeViewport3D.js
var RenderingEngine_VolumeViewport3D = __webpack_require__(2612);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/BaseVolumeViewport.js + 1 modules
var BaseVolumeViewport = __webpack_require__(16669);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/StackViewport.js + 3 modules
var StackViewport = __webpack_require__(40435);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/VideoViewport.js
var VideoViewport = __webpack_require__(80070);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/WSIViewport.js
var WSIViewport = __webpack_require__(34832);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/ECGViewport.js
var ECGViewport = __webpack_require__(9528);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/GenericViewport/index.js
var RenderingEngine_GenericViewport = __webpack_require__(97075);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/GenericViewport/ECG/index.js
var ECG = __webpack_require__(73321);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/GenericViewport/Video/index.js
var Video = __webpack_require__(18855);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/GenericViewport/Planar/index.js
var Planar = __webpack_require__(57644);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/GenericViewport/Volume3D/index.js
var Volume3D = __webpack_require__(1565);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/GenericViewport/WSI/index.js
var WSI = __webpack_require__(85001);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/Viewport.js
var Viewport = __webpack_require__(87345);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/eventTarget.js
var eventTarget = __webpack_require__(67079);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/version.js
var version = __webpack_require__(22202);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/getRenderingEngine.js
var getRenderingEngine = __webpack_require__(98893);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/cache/index.js
var cache = __webpack_require__(50727);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/cache/cache.js
var cache_cache = __webpack_require__(67425);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/requestPool/imageRetrievalPoolManager.js
var imageRetrievalPoolManager = __webpack_require__(30066);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/requestPool/imageLoadPoolManager.js
var imageLoadPoolManager = __webpack_require__(30810);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/getEnabledElement.js
var getEnabledElement = __webpack_require__(57237);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/metaData.js
var metaData = __webpack_require__(64037);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/init.js + 1 modules
var init = __webpack_require__(1509);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/renderingCapabilities.js + 1 modules
var renderingCapabilities = __webpack_require__(23037);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/Settings.js
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

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/loaders/volumeLoader.js
var volumeLoader = __webpack_require__(94376);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/loaders/imageLoader.js
var imageLoader = __webpack_require__(2951);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/loaders/geometryLoader.js + 6 modules
var geometryLoader = __webpack_require__(85786);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/loaders/ProgressiveRetrieveImages.js + 4 modules
var ProgressiveRetrieveImages = __webpack_require__(26878);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/loaders/decimatedVolumeLoader.js + 3 modules
var decimatedVolumeLoader = __webpack_require__(29335);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/types/index.js
var types = __webpack_require__(14316);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/index.js + 1 modules
var utilities = __webpack_require__(93077);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/triggerEvent.js
var triggerEvent = __webpack_require__(86305);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/convertColorArrayToRgbString.js
var convertColorArrayToRgbString = __webpack_require__(95481);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/loaders/cornerstoneStreamingImageVolumeLoader.js
var cornerstoneStreamingImageVolumeLoader = __webpack_require__(31279);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/loaders/cornerstoneStreamingDynamicImageVolumeLoader.js
var cornerstoneStreamingDynamicImageVolumeLoader = __webpack_require__(78684);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/loaders/cornerstoneMeshLoader.js
var cornerstoneMeshLoader = __webpack_require__(63825);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/index.js + 1 modules
var helpers = __webpack_require__(76080);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/viewportTypeToViewportClass.js + 6 modules
var viewportTypeToViewportClass = __webpack_require__(95011);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/RenderingEngine/helpers/renderBackendRegistry.js
var renderBackendRegistry = __webpack_require__(11206);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js


















































const renderingEngineExportsV2 = (/* unused pure expression or super */ null && ({
    GenericViewport,
    DefaultRenderPathResolver,
    defaultRenderPathResolver,
    ECGGenericViewport,
    createDefaultECGRenderPaths,
    createECGRenderPathResolver,
    DefaultECGDataProvider,
    ecgProjection,
    VideoGenericViewport,
    createDefaultVideoRenderPaths,
    createVideoRenderPathResolver,
    DefaultVideoDataProvider,
    videoProjection,
    PlanarViewport,
    createDefaultPlanarRenderPaths,
    createPlanarRenderPathResolver,
    DefaultPlanarDataProvider,
    planarProjection,
    VolumeViewport3D: GenericVolumeViewport3D,
    createDefaultVolume3DRenderPaths,
    createVolume3DRenderPathResolver,
    DefaultVolume3DDataProvider,
    volume3DProjection,
    WSIGenericViewport,
    createDefaultWSIRenderPaths,
    createWSIRenderPathResolver,
    DefaultWSIDataProvider,
    wsiProjection,
}));
const LegacyVolumeViewport3D = (/* unused pure expression or super */ null && (VolumeViewport3D));



},
2951(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  createAndCacheDerivedImages: () => (createAndCacheDerivedImages),
  createAndCacheLocalImage: () => (createAndCacheLocalImage),
  loadAndCacheImage: () => (loadAndCacheImage),
  loadImage: () => (loadImage)
});
/* import */ var _cache_cache_js__rspack_import_0 = __webpack_require__(67425);
/* import */ var _enums_Events_js__rspack_import_1 = __webpack_require__(19986);
/* import */ var _enums_MetadataModules_js__rspack_import_2 = __webpack_require__(88269);
/* import */ var _enums_index_js__rspack_import_3 = __webpack_require__(20274);
/* import */ var _eventTarget_js__rspack_import_4 = __webpack_require__(67079);
/* import */ var _utilities_genericMetadataProvider_js__rspack_import_5 = __webpack_require__(86280);
/* import */ var _utilities_getBufferConfiguration_js__rspack_import_6 = __webpack_require__(53461);
/* import */ var _utilities_triggerEvent_js__rspack_import_7 = __webpack_require__(86305);
/* import */ var _utilities_uuidv4_js__rspack_import_8 = __webpack_require__(46324);
/* import */ var _utilities_VoxelManager_js__rspack_import_9 = __webpack_require__(95466);
/* import */ var _requestPool_imageLoadPoolManager_js__rspack_import_10 = __webpack_require__(30810);
/* import */ var _metaData_js__rspack_import_11 = __webpack_require__(64037);
/* import */ var _enums_VoxelManagerEnum_js__rspack_import_12 = __webpack_require__(70397);













const imageLoaders = {};
let unknownImageLoader;
function getRequestedImageQualityStatus(options) {
    return (options.retrieveOptions?.imageQualityStatus ??
        _enums_index_js__rspack_import_3.ImageQualityStatus.FULL_RESOLUTION);
}
function loadImageFromImageLoader(imageId, options) {
    const cachedImageLoadObject = !options.ignoreCache && _cache_cache_js__rspack_import_0/* ["default"].getImageLoadObject */.Ay.getImageLoadObject(imageId);
    if (cachedImageLoadObject) {
        handleImageLoadPromise(cachedImageLoadObject.promise, imageId);
        return cachedImageLoadObject;
    }
    const cachedImage = !options.ignoreCache &&
        _cache_cache_js__rspack_import_0/* ["default"].getImage */.Ay.getImage(imageId, getRequestedImageQualityStatus(options));
    if (cachedImage) {
        const imageLoadObject = {
            promise: Promise.resolve(cachedImage),
        };
        handleImageLoadPromise(imageLoadObject.promise, imageId);
        return imageLoadObject;
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
        (0,_utilities_triggerEvent_js__rspack_import_7/* ["default"] */.A)(_eventTarget_js__rspack_import_4/* ["default"] */.A, _enums_Events_js__rspack_import_1/* ["default"].IMAGE_LOADED */.A.IMAGE_LOADED, { image });
    })
        .catch((error) => {
        const errorDetails = {
            imageId,
            error,
        };
        (0,_utilities_triggerEvent_js__rspack_import_7/* ["default"] */.A)(_eventTarget_js__rspack_import_4/* ["default"] */.A, _enums_Events_js__rspack_import_1/* ["default"].IMAGE_LOAD_FAILED */.A.IMAGE_LOAD_FAILED, errorDetails);
    });
}
function ensureVoxelManager(image) {
    if (!image.voxelManager) {
        const { width, height, numberOfComponents } = image;
        const voxelManager = _utilities_VoxelManager_js__rspack_import_9/* ["default"].createImageVoxelManager */.A.createImageVoxelManager({
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
    if (!_cache_cache_js__rspack_import_0/* ["default"].getImageLoadObject */.Ay.getImageLoadObject(imageId)) {
        _cache_cache_js__rspack_import_0/* ["default"].putImageLoadObject */.Ay.putImageLoadObject(imageId, imageLoadObject);
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
        options.imageId = `derived:${(0,_utilities_uuidv4_js__rspack_import_8/* ["default"] */.A)()}`;
    }
    const { imageId, skipCreateBuffer, onCacheAdd, voxelRepresentation } = options;
    const imagePlaneModule = _metaData_js__rspack_import_11.get(_enums_MetadataModules_js__rspack_import_2/* ["default"].IMAGE_PLANE */.A.IMAGE_PLANE, referencedImageId);
    const length = imagePlaneModule.rows * imagePlaneModule.columns;
    const { TypedArrayConstructor } = (0,_utilities_getBufferConfiguration_js__rspack_import_6/* .getBufferConfiguration */.h)(options.targetBuffer?.type, length);
    const imageScalarData = new TypedArrayConstructor(skipCreateBuffer ? 1 : length);
    const derivedImageId = imageId;
    const referencedImagePlaneMetadata = _metaData_js__rspack_import_11.get(_enums_MetadataModules_js__rspack_import_2/* ["default"].IMAGE_PLANE */.A.IMAGE_PLANE, referencedImageId);
    _utilities_genericMetadataProvider_js__rspack_import_5/* ["default"].add */.A.add(derivedImageId, {
        type: _enums_MetadataModules_js__rspack_import_2/* ["default"].IMAGE_PLANE */.A.IMAGE_PLANE,
        metadata: referencedImagePlaneMetadata,
    });
    const referencedImageGeneralSeriesMetadata = _metaData_js__rspack_import_11.get(_enums_MetadataModules_js__rspack_import_2/* ["default"].GENERAL_SERIES */.A.GENERAL_SERIES, referencedImageId);
    _utilities_genericMetadataProvider_js__rspack_import_5/* ["default"].add */.A.add(derivedImageId, {
        type: _enums_MetadataModules_js__rspack_import_2/* ["default"].GENERAL_SERIES */.A.GENERAL_SERIES,
        metadata: referencedImageGeneralSeriesMetadata,
    });
    _utilities_genericMetadataProvider_js__rspack_import_5/* ["default"].add */.A.add(derivedImageId, {
        type: _enums_MetadataModules_js__rspack_import_2/* ["default"].GENERAL_IMAGE */.A.GENERAL_IMAGE,
        metadata: {
            instanceNumber: options.instanceNumber,
        },
    });
    const imagePixelModule = _metaData_js__rspack_import_11.get(_enums_MetadataModules_js__rspack_import_2/* ["default"].IMAGE_PIXEL */.A.IMAGE_PIXEL, referencedImageId);
    _utilities_genericMetadataProvider_js__rspack_import_5/* ["default"].add */.A.add(derivedImageId, {
        type: _enums_MetadataModules_js__rspack_import_2/* ["default"].IMAGE_PIXEL */.A.IMAGE_PIXEL,
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
    if (!_cache_cache_js__rspack_import_0/* ["default"].getImageLoadObject */.Ay.getImageLoadObject(imageId)) {
        _cache_cache_js__rspack_import_0/* ["default"].putImageSync */.Ay.putImageSync(imageId, localImage);
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
                `derived:${(0,_utilities_uuidv4_js__rspack_import_8/* ["default"] */.A)()}`,
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
        const { TypedArrayConstructor } = (0,_utilities_getBufferConfiguration_js__rspack_import_6/* .getBufferConfiguration */.h)(targetBuffer?.type, length);
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
    [_enums_MetadataModules_js__rspack_import_2/* ["default"].IMAGE_PLANE */.A.IMAGE_PLANE, _enums_MetadataModules_js__rspack_import_2/* ["default"].IMAGE_PIXEL */.A.IMAGE_PIXEL].forEach((type) => {
        _utilities_genericMetadataProvider_js__rspack_import_5/* ["default"].add */.A.add(imageId, {
            type,
            metadata: metadata[type] || {},
        });
    });
    const id = imageId;
    const voxelManager = (voxelRepresentation === _enums_VoxelManagerEnum_js__rspack_import_12/* ["default"].RLE */.A.RLE &&
        _utilities_VoxelManager_js__rspack_import_9/* ["default"].createRLEImageVoxelManager */.A.createRLEImageVoxelManager({ dimensions, id })) ||
        _utilities_VoxelManager_js__rspack_import_9/* ["default"].createImageVoxelManager */.A.createImageVoxelManager({
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
    _cache_cache_js__rspack_import_0/* ["default"].putImageSync */.Ay.putImageSync(image.imageId, image);
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


},
94376(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  createAndCacheDerivedLabelmapVolume: () => (createAndCacheDerivedLabelmapVolume),
  createAndCacheVolume: () => (createAndCacheVolume),
  createAndCacheVolumeFromImagesSync: () => (createAndCacheVolumeFromImagesSync),
  createLocalVolume: () => (createLocalVolume),
  getUnknownVolumeLoaderSchema: () => (getUnknownVolumeLoaderSchema),
  getVolumeLoaderSchemes: () => (getVolumeLoaderSchemes),
  loadVolume: () => (loadVolume)
});
/* import */ var _kitware_vtk_js_Rendering_Profiles_Volume_js__rspack_import_0 = __webpack_require__(35906);
/* import */ var _cache_classes_ImageVolume_js__rspack_import_1 = __webpack_require__(77027);
/* import */ var _cache_cache_js__rspack_import_2 = __webpack_require__(67425);
/* import */ var _enums_Events_js__rspack_import_3 = __webpack_require__(19986);
/* import */ var _eventTarget_js__rspack_import_4 = __webpack_require__(67079);
/* import */ var _utilities_triggerEvent_js__rspack_import_5 = __webpack_require__(86305);
/* import */ var _utilities_deepClone_js__rspack_import_6 = __webpack_require__(95902);
/* import */ var _utilities_uuidv4_js__rspack_import_7 = __webpack_require__(46324);
/* import */ var _utilities_VoxelManager_js__rspack_import_8 = __webpack_require__(95466);
/* import */ var _imageLoader_js__rspack_import_9 = __webpack_require__(2951);
/* import */ var _utilities_generateVolumePropsFromImageIds_js__rspack_import_10 = __webpack_require__(26929);
/* import */ var _cornerstoneStreamingImageVolumeLoader_js__rspack_import_11 = __webpack_require__(31279);












const volumeLoaders = {};
let unknownVolumeLoader = _cornerstoneStreamingImageVolumeLoader_js__rspack_import_11/* .cornerstoneStreamingImageVolumeLoader */.F;
function loadVolumeFromVolumeLoader(volumeId, options) {
    const colonIndex = volumeId.indexOf(':');
    const scheme = volumeId.substring(0, colonIndex);
    let loader = volumeLoaders[scheme];
    if (loader === undefined || loader === null) {
        if (unknownVolumeLoader == null ||
            typeof unknownVolumeLoader !== 'function') {
            throw new Error(`No volume loader for scheme ${scheme} has been registered`);
        }
        loader = unknownVolumeLoader;
    }
    const volumeLoadObject = loader(volumeId, options);
    volumeLoadObject.promise.then(function (volume) {
        (0,_utilities_triggerEvent_js__rspack_import_5/* ["default"] */.A)(_eventTarget_js__rspack_import_4/* ["default"] */.A, _enums_Events_js__rspack_import_3/* ["default"].VOLUME_LOADED */.A.VOLUME_LOADED, { volume });
    }, function (error) {
        const errorObject = {
            volumeId,
            error,
        };
        (0,_utilities_triggerEvent_js__rspack_import_5/* ["default"] */.A)(_eventTarget_js__rspack_import_4/* ["default"] */.A, _enums_Events_js__rspack_import_3/* ["default"].VOLUME_LOADED_FAILED */.A.VOLUME_LOADED_FAILED, errorObject);
    });
    return volumeLoadObject;
}
function loadVolume(volumeId, options = { imageIds: [] }) {
    if (volumeId === undefined) {
        throw new Error('loadVolume: parameter volumeId must not be undefined');
    }
    let volumeLoadObject = _cache_cache_js__rspack_import_2/* ["default"].getVolumeLoadObject */.Ay.getVolumeLoadObject(volumeId);
    if (volumeLoadObject !== undefined) {
        return volumeLoadObject.promise;
    }
    volumeLoadObject = loadVolumeFromVolumeLoader(volumeId, options);
    return volumeLoadObject.promise.then((volume) => {
        return volume;
    });
}
async function createAndCacheVolume(volumeId, options) {
    if (volumeId === undefined) {
        throw new Error('createAndCacheVolume: parameter volumeId must not be undefined');
    }
    let volumeLoadObject = _cache_cache_js__rspack_import_2/* ["default"].getVolumeLoadObject */.Ay.getVolumeLoadObject(volumeId);
    if (volumeLoadObject !== undefined) {
        return volumeLoadObject.promise;
    }
    volumeLoadObject = loadVolumeFromVolumeLoader(volumeId, options);
    _cache_cache_js__rspack_import_2/* ["default"].putVolumeLoadObject */.Ay.putVolumeLoadObject(volumeId, volumeLoadObject);
    return volumeLoadObject.promise;
}
function createAndCacheDerivedVolume(referencedVolumeId, options) {
    const referencedVolume = _cache_cache_js__rspack_import_2/* ["default"].getVolume */.Ay.getVolume(referencedVolumeId);
    if (!referencedVolume) {
        throw new Error(`Cannot created derived volume: Referenced volume with id ${referencedVolumeId} does not exist.`);
    }
    let { volumeId } = options;
    const { voxelRepresentation } = options;
    if (volumeId === undefined) {
        volumeId = (0,_utilities_uuidv4_js__rspack_import_7/* ["default"] */.A)();
    }
    const { metadata, dimensions, spacing, origin, direction } = referencedVolume;
    const referencedImageIds = referencedVolume.isDynamicVolume()
        ? referencedVolume.getCurrentDimensionGroupImageIds()
        : (referencedVolume.imageIds ?? []);
    const derivedImages = (0,_imageLoader_js__rspack_import_9.createAndCacheDerivedImages)(referencedImageIds, {
        targetBuffer: options.targetBuffer,
        voxelRepresentation,
    });
    const dataType = derivedImages[0].dataType;
    const derivedVolumeImageIds = derivedImages.map((image) => image.imageId);
    const derivedVolume = new _cache_classes_ImageVolume_js__rspack_import_1/* .ImageVolume */.Q({
        volumeId,
        dataType,
        metadata: (0,_utilities_deepClone_js__rspack_import_6/* .deepClone */.G)(metadata),
        dimensions: [dimensions[0], dimensions[1], dimensions[2]],
        spacing,
        origin,
        direction,
        referencedVolumeId,
        imageIds: derivedVolumeImageIds,
        referencedImageIds: referencedVolume.imageIds ?? [],
    });
    _cache_cache_js__rspack_import_2/* ["default"].putVolumeSync */.Ay.putVolumeSync(volumeId, derivedVolume);
    return derivedVolume;
}
async function createAndCacheVolumeFromImages(volumeId, imageIds) {
    if (imageIds === undefined) {
        throw new Error('createAndCacheVolumeFromImages: parameter imageIds must not be undefined');
    }
    if (volumeId === undefined) {
        throw new Error('createAndCacheVolumeFromImages: parameter volumeId must not be undefined');
    }
    const cachedVolume = cache.getVolume(volumeId);
    if (cachedVolume) {
        return cachedVolume;
    }
    const imageIdsToLoad = imageIds.filter((imageId) => !cache.getImage(imageId));
    if (imageIdsToLoad.length === 0) {
        return createAndCacheVolumeFromImagesSync(volumeId, imageIds);
    }
    const volume = (await createAndCacheVolume(volumeId, {
        imageIds,
    }));
    return volume;
}
function createAndCacheVolumeFromImagesSync(volumeId, imageIds) {
    if (imageIds === undefined) {
        throw new Error('createAndCacheVolumeFromImagesSync: parameter imageIds must not be undefined');
    }
    if (volumeId === undefined) {
        throw new Error('createAndCacheVolumeFromImagesSync: parameter volumeId must not be undefined');
    }
    const cachedVolume = _cache_cache_js__rspack_import_2/* ["default"].getVolume */.Ay.getVolume(volumeId);
    if (cachedVolume) {
        return cachedVolume;
    }
    const volumeProps = (0,_utilities_generateVolumePropsFromImageIds_js__rspack_import_10/* .generateVolumePropsFromImageIds */.D)(imageIds, volumeId);
    const derivedVolume = new _cache_classes_ImageVolume_js__rspack_import_1/* .ImageVolume */.Q({
        volumeId,
        dataType: volumeProps.dataType,
        metadata: (0,_utilities_deepClone_js__rspack_import_6/* .deepClone */.G)(volumeProps.metadata),
        dimensions: volumeProps.dimensions,
        spacing: volumeProps.spacing,
        origin: volumeProps.origin,
        direction: volumeProps.direction,
        referencedVolumeId: volumeProps.referencedVolumeId,
        imageIds: volumeProps.imageIds,
        referencedImageIds: volumeProps.referencedImageIds,
    });
    _cache_cache_js__rspack_import_2/* ["default"].putVolumeSync */.Ay.putVolumeSync(volumeId, derivedVolume);
    return derivedVolume;
}
function createLocalVolume(volumeId, options = {}) {
    const { metadata, dimensions, spacing, origin, direction, scalarData, referencedImageIds, referencedVolumeId, targetBuffer, preventCache = false, } = options;
    const cachedVolume = _cache_cache_js__rspack_import_2/* ["default"].getVolume */.Ay.getVolume(volumeId);
    if (cachedVolume) {
        return cachedVolume;
    }
    const sliceLength = dimensions[0] * dimensions[1];
    const dataType = scalarData
        ? scalarData.constructor.name
        : (targetBuffer?.type ?? 'Float32Array');
    const totalNumberOfVoxels = sliceLength * dimensions[2];
    let byteLength;
    switch (dataType) {
        case 'Uint8Array':
        case 'Int8Array':
            byteLength = totalNumberOfVoxels;
            break;
        case 'Uint16Array':
        case 'Int16Array':
            byteLength = totalNumberOfVoxels * 2;
            break;
        case 'Float32Array':
            byteLength = totalNumberOfVoxels * 4;
            break;
    }
    const isCacheable = _cache_cache_js__rspack_import_2/* ["default"].isCacheable */.Ay.isCacheable(byteLength);
    if (!isCacheable) {
        throw new Error(`Cannot created derived volume: Volume with id ${volumeId} is not cacheable.`);
    }
    const imageIds = [];
    const derivedImages = [];
    for (let i = 0; i < dimensions[2]; i++) {
        const imageId = `${volumeId}_slice_${i}`;
        imageIds.push(imageId);
        const sliceData = scalarData.subarray(i * sliceLength, (i + 1) * sliceLength);
        const derivedImage = (0,_imageLoader_js__rspack_import_9.createAndCacheLocalImage)(imageId, {
            scalarData: sliceData,
            dimensions: [dimensions[0], dimensions[1]],
            spacing: [spacing[0], spacing[1]],
            origin,
            direction,
            referencedImageId: referencedImageIds?.[i],
            targetBuffer: { type: dataType },
        });
        derivedImages.push(derivedImage);
    }
    const imageVolume = new _cache_classes_ImageVolume_js__rspack_import_1/* .ImageVolume */.Q({
        volumeId,
        metadata: (0,_utilities_deepClone_js__rspack_import_6/* .deepClone */.G)(metadata),
        dimensions: [dimensions[0], dimensions[1], dimensions[2]],
        spacing,
        origin,
        direction,
        imageIds,
        dataType,
        referencedVolumeId,
        referencedImageIds,
    });
    const voxelManager = _utilities_VoxelManager_js__rspack_import_8/* ["default"].createImageVolumeVoxelManager */.A.createImageVolumeVoxelManager({
        imageIds,
        dimensions,
        numberOfComponents: 1,
        id: volumeId,
    });
    imageVolume.voxelManager = voxelManager;
    if (!preventCache) {
        _cache_cache_js__rspack_import_2/* ["default"].putVolumeSync */.Ay.putVolumeSync(volumeId, imageVolume);
    }
    return imageVolume;
}
function registerVolumeLoader(scheme, volumeLoader) {
    volumeLoaders[scheme] = volumeLoader;
}
function getVolumeLoaderSchemes() {
    return Object.keys(volumeLoaders);
}
function registerUnknownVolumeLoader(volumeLoader) {
    const oldVolumeLoader = unknownVolumeLoader;
    unknownVolumeLoader = volumeLoader;
    return oldVolumeLoader;
}
function getUnknownVolumeLoaderSchema() {
    return unknownVolumeLoader.name;
}
function createAndCacheDerivedLabelmapVolume(referencedVolumeId, options = {}) {
    return createAndCacheDerivedVolume(referencedVolumeId, {
        ...options,
        targetBuffer: {
            type: 'Uint8Array',
            ...options?.targetBuffer,
        },
    });
}
function createLocalLabelmapVolume(options, volumeId, preventCache = false) {
    if (!options.scalarData) {
        options.scalarData = new Uint8Array(options.dimensions[0] * options.dimensions[1] * options.dimensions[2]);
    }
    return createLocalVolume(volumeId, { ...options, preventCache });
}


},
93077(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  ECGUtilities: () => (/* reexport */ ECGUtilities),
  FrameRange: () => (/* reexport */ FrameRange/* ["default"] */.A),
  HistoryMemo: () => (/* reexport */ historyMemo),
  PointsManager: () => (/* reexport */ PointsManager/* ["default"] */.A),
  ProgressiveIterator: () => (/* reexport */ ProgressiveIterator/* ["default"] */.A),
  RLEVoxelMap: () => (/* reexport */ RLEVoxelMap/* ["default"] */.A),
  VideoUtilities: () => (/* reexport */ VideoUtilities),
  VoxelManager: () => (/* reexport */ VoxelManager/* ["default"] */.A),
  WSIUtilities: () => (/* reexport */ WSIUtilities),
  actorIsA: () => (/* reexport */ actorCheck/* .actorIsA */.N),
  applyPreset: () => (/* reexport */ applyPreset/* ["default"] */.A),
  asArray: () => (/* reexport */ asArray/* .asArray */._),
  autoLoad: () => (/* reexport */ autoLoad/* ["default"] */.A),
  buildMetadata: () => (/* reexport */ buildMetadata/* .buildMetadata */.KP),
  calculateNeighborhoodStats: () => (/* reexport */ calculateNeighborhoodStats/* .calculateNeighborhoodStats */.c),
  calculateRadiographicPixelSpacing: () => (/* reexport */ getPixelSpacingInformation/* .calculateRadiographicPixelSpacing */.VD),
  calculateSpacingBetweenImageIds: () => (/* reexport */ calculateSpacingBetweenImageIds/* ["default"] */.A),
  calculateViewportsSpatialRegistration: () => (/* reexport */ calculateViewportsSpatialRegistration/* ["default"] */.A),
  calibratedPixelSpacingMetadataProvider: () => (/* reexport */ calibratedPixelSpacingMetadataProvider/* ["default"] */.A),
  clamp: () => (/* reexport */ clamp/* ["default"] */.A),
  clip: () => (/* reexport */ clip/* ["default"] */.Ay),
  clonePoint3: () => (/* reexport */ clonePoint3/* ["default"] */.A),
  color: () => (/* reexport */ color),
  colormap: () => (/* reexport */ colormap),
  convertColorArrayToRgbString: () => (/* reexport */ convertColorArrayToRgbString/* .convertColorArrayToRgbString */.J),
  convertStackToVolumeViewport: () => (/* reexport */ convertStackToVolumeViewport/* .convertStackToVolumeViewport */.h),
  convertToGrayscale: () => (/* reexport */ convertToGrayscale/* ["default"] */.A),
  convertVolumeToStackViewport: () => (/* reexport */ convertVolumeToStackViewport/* .convertVolumeToStackViewport */.n),
  createLinearRGBTransferFunction: () => (/* reexport */ createLinearRGBTransferFunction/* ["default"] */.A),
  createSigmoidRGBTransferFunction: () => (/* reexport */ createSigmoidRGBTransferFunction/* ["default"] */.A),
  createSubVolume: () => (/* reexport */ createSubVolume/* ["default"] */.A),
  decimate: () => (/* reexport */ decimate/* ["default"] */.A),
  deepClone: () => (/* reexport */ deepClone/* .deepClone */.G),
  deepEqual: () => (/* reexport */ deepEqual/* .deepEqual */.b),
  deepMerge: () => (/* reexport */ deepMerge/* ["default"] */.A),
  eventListener: () => (/* reexport */ eventListener_namespaceObject),
  fnv1aHash: () => (/* reexport */ fnv1aHash/* ["default"] */.A),
  generateFrameImageId: () => (/* reexport */ splitImageIdsBy4DTags/* .generateFrameImageId */.Hf),
  generateVolumePropsFromImageIds: () => (/* reexport */ generateVolumePropsFromImageIds/* .generateVolumePropsFromImageIds */.D),
  genericMetadataProvider: () => (/* reexport */ genericMetadataProvider/* ["default"] */.A),
  genericViewportDisplaySetMetadataProvider: () => (/* reexport */ genericViewportDisplaySetMetadataProvider/* ["default"] */.A),
  getAcquisitionPlaneOrientation: () => (/* reexport */ getAcquisitionPlaneOrientation/* ["default"] */.A),
  getBufferConfiguration: () => (/* reexport */ getBufferConfiguration/* .getBufferConfiguration */.h),
  getClosestImageId: () => (/* reexport */ getClosestImageId/* ["default"] */.A),
  getClosestStackImageIndexForPoint: () => (/* reexport */ getClosestStackImageIndexForPoint/* ["default"] */.A),
  getCubeSizeInView: () => (/* reexport */ getPlaneCubeIntersectionDimensions/* .getCubeSizeInView */.H),
  getCurrentVolumeViewportSlice: () => (/* reexport */ getCurrentVolumeViewportSlice/* ["default"] */.A),
  getDynamicVolumeInfo: () => (/* reexport */ getDynamicVolumeInfo/* ["default"] */.A),
  getERMF: () => (/* reexport */ getPixelSpacingInformation/* .getERMF */.lJ),
  getImageDataMetadata: () => (/* reexport */ getImageDataMetadata/* .getImageDataMetadata */.T),
  getImageLegacy: () => (/* reexport */ getImageLegacy/* ["default"] */.A),
  getImageSliceDataForVolumeViewport: () => (/* reexport */ getImageSliceDataForVolumeViewport/* ["default"] */.A),
  getMinMax: () => (/* reexport */ getMinMax/* ["default"] */.A),
  getNormalizedAspectRatio: () => (/* reexport */ getNormalizedAspectRatio/* .getNormalizedAspectRatio */.x),
  getPixelSpacingInformation: () => (/* reexport */ getPixelSpacingInformation/* .getPixelSpacingInformation */.Cc),
  getRandomSampleFromArray: () => (/* reexport */ getRandomSampleFromArray/* .getRandomSampleFromArray */.p),
  getRuntimeId: () => (/* reexport */ getRuntimeId/* ["default"] */.A),
  getScalingDescriptor: () => (/* binding */ utilities_getScalingDescriptor),
  getScalingParameters: () => (/* reexport */ getScalingParameters/* ["default"] */.A),
  getSliceRange: () => (/* reexport */ getSliceRange/* ["default"] */.A),
  getSpacingInNormalDirection: () => (/* reexport */ getSpacingInNormalDirection/* ["default"] */.A),
  getTargetVolumeAndSpacingInNormalDir: () => (/* reexport */ getTargetVolumeAndSpacingInNormalDir/* ["default"] */.A),
  getVOIRangeFromWindowLevel: () => (/* reexport */ getVOIRangeFromWindowLevel/* ["default"] */.A),
  getViewportContentMode: () => (/* reexport */ viewportCapabilities/* .getViewportContentMode */.nH),
  getViewportImageCornersInWorld: () => (/* reexport */ getViewportImageCornersInWorld/* ["default"] */.A),
  getViewportImageIds: () => (/* reexport */ getViewportImageIds/* ["default"] */.A),
  getViewportModality: () => (/* binding */ utilities_getViewportModality),
  getViewportsWithImageURI: () => (/* reexport */ getViewportsWithImageURI/* ["default"] */.A),
  getViewportsWithVolumeId: () => (/* reexport */ getViewportsWithVolumeId/* ["default"] */.A),
  getVoiFromSigmoidRGBTransferFunction: () => (/* reexport */ getVoiFromSigmoidRGBTransferFunction/* ["default"] */.A),
  getVolumeActorCorners: () => (/* reexport */ getVolumeActorCorners/* ["default"] */.A),
  getVolumeDirectionVectors: () => (/* reexport */ getVolumeDirectionVectors/* ["default"] */.A),
  getVolumeId: () => (/* reexport */ getVolumeId/* .getVolumeId */.A),
  getVolumeSliceRangeInfo: () => (/* reexport */ getVolumeSliceRangeInfo/* ["default"] */.A),
  getVolumeViewReferenceId: () => (/* reexport */ getVolumeViewReferenceId/* ["default"] */.A),
  getVolumeViewportScrollInfo: () => (/* reexport */ getVolumeViewportScrollInfo/* ["default"] */.A),
  getVolumeViewportsContainingSameVolumes: () => (/* reexport */ getVolumeViewportsContainingSameVolumes/* ["default"] */.A),
  handleMultiframe4D: () => (/* reexport */ splitImageIdsBy4DTags/* .handleMultiframe4D */.FM),
  hasFloatScalingParameters: () => (/* reexport */ hasFloatScalingParameters/* .hasFloatScalingParameters */.a),
  hasNaNValues: () => (/* reexport */ hasNaNValues/* ["default"] */.A),
  hasOwn: () => (/* reexport */ hasOwn/* ["default"] */.A),
  imageIdToURI: () => (/* reexport */ imageIdToURI/* ["default"] */.A),
  imageRetrieveMetadataProvider: () => (/* reexport */ imageRetrieveMetadataProvider/* ["default"] */.A),
  imageToWorldCoords: () => (/* reexport */ imageToWorldCoords/* ["default"] */.A),
  indexAlmostWithinDimensions: () => (/* reexport */ indexAlmostWithinDimensions/* ["default"] */.A),
  indexWithinDimensions: () => (/* reexport */ indexWithinDimensions/* ["default"] */.A),
  invertRgbTransferFunction: () => (/* reexport */ invertRgbTransferFunction/* ["default"] */.A),
  isEqual: () => (/* reexport */ isEqual/* .isEqual */.n4),
  isEqualAbs: () => (/* reexport */ isEqual/* .isEqualAbs */.Ph),
  isEqualNegative: () => (/* reexport */ isEqual/* .isEqualNegative */.WC),
  isGenericViewport: () => (/* reexport */ viewportCapabilities/* .isGenericViewport */.oX),
  isImageActor: () => (/* reexport */ actorCheck/* .isImageActor */.e),
  isNumber: () => (/* reexport */ isEqual/* .isNumber */.Et),
  isOpposite: () => (/* reexport */ isOpposite/* ["default"] */.A),
  isPTPrescaledWithSUV: () => (/* reexport */ isPTPrescaledWithSUV/* ["default"] */.A),
  isValidVolume: () => (/* reexport */ isValidVolume/* .isValidVolume */.p),
  isVideoTransferSyntax: () => (/* reexport */ isVideoTransferSyntax/* ["default"] */.A),
  jumpToSlice: () => (/* reexport */ jumpToSlice/* .jumpToSlice */.e),
  loadImageToCanvas: () => (/* reexport */ loadImageToCanvas/* ["default"] */.A),
  logger: () => (/* reexport */ logger),
  makeVolumeMetadata: () => (/* reexport */ makeVolumeMetadata/* ["default"] */.A),
  mapMappedBandToRawRange: () => (/* reexport */ viewportVoiIntensityMapping/* .mapMappedBandToRawRange */.j_),
  mapScalarToViewportVoiIntensity: () => (/* reexport */ viewportVoiIntensityMapping/* .mapScalarToViewportVoiIntensity */.fT),
  mapViewportVoiIntensityToScalar: () => (/* reexport */ viewportVoiIntensityMapping/* .mapViewportVoiIntensityToScalar */.l2),
  planar: () => (/* reexport */ planar),
  pointInShapeCallback: () => (/* reexport */ pointInShapeCallback/* .pointInShapeCallback */.ii),
  renderToCanvasCPU: () => (/* reexport */ renderToCanvasCPU/* ["default"] */.A),
  renderToCanvasGPU: () => (/* reexport */ renderToCanvasGPU/* ["default"] */.A),
  resolveGenericViewportVolumeId: () => (/* reexport */ resolveGenericViewportVolumeId/* .resolveGenericViewportVolumeId */.d),
  rotateToViewCoordinates: () => (/* reexport */ rotateToViewCoordinates/* .rotateToViewCoordinates */.P),
  roundNumber: () => (/* reexport */ roundNumber/* ["default"] */.A),
  roundToPrecision: () => (/* reexport */ roundNumber/* .roundToPrecision */.C),
  scaleArray: () => (/* reexport */ scaleArray/* ["default"] */.A),
  scaleRgbTransferFunction: () => (/* reexport */ scaleRgbTransferFunction/* ["default"] */.A),
  scroll: () => (/* reexport */ utilities_scroll/* ["default"] */.A),
  snapFocalPointToSlice: () => (/* reexport */ snapFocalPointToSlice/* ["default"] */.A),
  sortImageIdsAndGetSpacing: () => (/* reexport */ sortImageIdsAndGetSpacing/* ["default"] */.A),
  spatialRegistrationMetadataProvider: () => (/* reexport */ spatialRegistrationMetadataProvider/* ["default"] */.A),
  splitImageIdsBy4DTags: () => (/* reexport */ splitImageIdsBy4DTags/* ["default"] */.Ay),
  transferFunctionUtils: () => (/* reexport */ transferFunctionUtils),
  transformIndexToWorld: () => (/* reexport */ transformIndexToWorld/* ["default"] */.A),
  transformWorldToIndex: () => (/* reexport */ transformWorldToIndex/* ["default"] */.A),
  transformWorldToIndexContinuous: () => (/* reexport */ transformWorldToIndex/* .transformWorldToIndexContinuous */.p),
  triggerEvent: () => (/* reexport */ triggerEvent/* ["default"] */.A),
  updatePlaneRestriction: () => (/* reexport */ updatePlaneRestriction/* .updatePlaneRestriction */.O),
  updateVTKImageDataWithCornerstoneImage: () => (/* reexport */ updateVTKImageDataWithCornerstoneImage/* .updateVTKImageDataWithCornerstoneImage */.J),
  uuidv4: () => (/* reexport */ uuidv4/* ["default"] */.A),
  viewportIsInStackMode: () => (/* reexport */ viewportCapabilities/* .viewportIsInStackMode */.NL),
  viewportIsInVolumeMode: () => (/* reexport */ viewportCapabilities/* .viewportIsInVolumeMode */.zb),
  viewportSupportsDisplaySetPresentation: () => (/* reexport */ viewportCapabilities/* .viewportSupportsDisplaySetPresentation */.Tf),
  viewportSupportsImageSlices: () => (/* reexport */ viewportCapabilities/* .viewportSupportsImageSlices */.hz),
  viewportSupportsStackCalibration: () => (/* reexport */ viewportCapabilities/* .viewportSupportsStackCalibration */.Xu),
  viewportSupportsStackCompatibility: () => (/* reexport */ viewportCapabilities/* .viewportSupportsStackCompatibility */.T),
  viewportSupportsVolumeActors: () => (/* reexport */ viewportCapabilities/* .viewportSupportsVolumeActors */.$O),
  viewportSupportsVolumeCompatibility: () => (/* reexport */ viewportCapabilities/* .viewportSupportsVolumeCompatibility */.rw),
  viewportSupportsVolumeId: () => (/* reexport */ viewportCapabilities/* .viewportSupportsVolumeId */.Uv),
  viewportSupportsVolumeURI: () => (/* reexport */ viewportCapabilities/* .viewportSupportsVolumeURI */.vP),
  windowLevel: () => (/* reexport */ windowLevel),
  worldToImageCoords: () => (/* reexport */ worldToImageCoords/* ["default"] */.A)
});
// NAMESPACE OBJECT: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/eventListener/index.js
var eventListener_namespaceObject = {};
__webpack_require__.r(eventListener_namespaceObject);
__webpack_require__.d(eventListener_namespaceObject, { 
  MultiTargetEventListenerManager: () => (MultiTargetEventListenerManager/* .MultiTargetEventListenerManager */.I),
  TargetEventListeners: () => (TargetEventListeners/* .TargetEventListeners */.f) });


// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/eventListener/TargetEventListeners.js
var TargetEventListeners = __webpack_require__(72328);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/eventListener/MultiTargetEventListenerManager.js
var MultiTargetEventListenerManager = __webpack_require__(80973);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/eventListener/index.js



// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/invertRgbTransferFunction.js
var invertRgbTransferFunction = __webpack_require__(61365);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/createSigmoidRGBTransferFunction.js
var createSigmoidRGBTransferFunction = __webpack_require__(51033);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getVoiFromSigmoidRGBTransferFunction.js
var getVoiFromSigmoidRGBTransferFunction = __webpack_require__(131);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/createLinearRGBTransferFunction.js
var createLinearRGBTransferFunction = __webpack_require__(378);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/scaleRgbTransferFunction.js
var scaleRgbTransferFunction = __webpack_require__(847);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/triggerEvent.js
var triggerEvent = __webpack_require__(86305);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/uuidv4.js
var uuidv4 = __webpack_require__(46324);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getMinMax.js
var getMinMax = __webpack_require__(50971);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/clonePoint3.js
var clonePoint3 = __webpack_require__(73643);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/hasOwn.js
var hasOwn = __webpack_require__(11533);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getRuntimeId.js
var getRuntimeId = __webpack_require__(61304);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getVOIRangeFromWindowLevel.js
var getVOIRangeFromWindowLevel = __webpack_require__(73450);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/imageIdToURI.js
var imageIdToURI = __webpack_require__(30812);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/calibratedPixelSpacingMetadataProvider.js
var calibratedPixelSpacingMetadataProvider = __webpack_require__(37091);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/clamp.js
var clamp = __webpack_require__(73090);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/isOpposite.js
var isOpposite = __webpack_require__(62124);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getClosestImageId.js
var getClosestImageId = __webpack_require__(96316);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getSpacingInNormalDirection.js
var getSpacingInNormalDirection = __webpack_require__(29971);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getTargetVolumeAndSpacingInNormalDir.js
var getTargetVolumeAndSpacingInNormalDir = __webpack_require__(67977);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getVolumeActorCorners.js
var getVolumeActorCorners = __webpack_require__(37454);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/indexWithinDimensions.js
var indexWithinDimensions = __webpack_require__(59807);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/indexAlmostWithinDimensions.js
var indexAlmostWithinDimensions = __webpack_require__(89633);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getVolumeViewportsContainingSameVolumes.js
var getVolumeViewportsContainingSameVolumes = __webpack_require__(27387);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getViewportsWithVolumeId.js
var getViewportsWithVolumeId = __webpack_require__(59805);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/transformWorldToIndex.js
var transformWorldToIndex = __webpack_require__(77970);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/transformIndexToWorld.js
var transformIndexToWorld = __webpack_require__(8682);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/loadImageToCanvas.js
var loadImageToCanvas = __webpack_require__(64177);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/historyMemo/index.js
var historyMemo = __webpack_require__(37984);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/renderToCanvasCPU.js
var renderToCanvasCPU = __webpack_require__(96424);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/renderToCanvasGPU.js
var renderToCanvasGPU = __webpack_require__(59252);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/worldToImageCoords.js
var worldToImageCoords = __webpack_require__(67881);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/imageToWorldCoords.js
var imageToWorldCoords = __webpack_require__(38959);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getVolumeSliceRangeInfo.js
var getVolumeSliceRangeInfo = __webpack_require__(79824);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getVolumeViewportScrollInfo.js
var getVolumeViewportScrollInfo = __webpack_require__(93556);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getSliceRange.js
var getSliceRange = __webpack_require__(33778);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/snapFocalPointToSlice.js
var snapFocalPointToSlice = __webpack_require__(93311);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getImageSliceDataForVolumeViewport.js
var getImageSliceDataForVolumeViewport = __webpack_require__(74293);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/actorCheck.js
var actorCheck = __webpack_require__(92014);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getViewportsWithImageURI.js
var getViewportsWithImageURI = __webpack_require__(52483);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getClosestStackImageIndexForPoint.js
var getClosestStackImageIndexForPoint = __webpack_require__(5292);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getCurrentVolumeViewportSlice.js
var getCurrentVolumeViewportSlice = __webpack_require__(84380);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/calculateViewportsSpatialRegistration.js
var calculateViewportsSpatialRegistration = __webpack_require__(27385);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/spatialRegistrationMetadataProvider.js
var spatialRegistrationMetadataProvider = __webpack_require__(90608);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getViewportImageCornersInWorld.js
var getViewportImageCornersInWorld = __webpack_require__(94537);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/hasNaNValues.js
var hasNaNValues = __webpack_require__(90042);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/applyPreset.js
var applyPreset = __webpack_require__(75906);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/PointsManager.js
var PointsManager = __webpack_require__(47859);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/deepMerge.js
var deepMerge = __webpack_require__(93699);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getScalingParameters.js
var getScalingParameters = __webpack_require__(68324);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/isPTPrescaledWithSUV.js
var isPTPrescaledWithSUV = __webpack_require__(64206);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getImageLegacy.js
var getImageLegacy = __webpack_require__(91635);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/sortImageIdsAndGetSpacing.js
var sortImageIdsAndGetSpacing = __webpack_require__(17186);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/makeVolumeMetadata.js
var makeVolumeMetadata = __webpack_require__(77140);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/genericMetadataProvider.js
var genericMetadataProvider = __webpack_require__(86280);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/isValidVolume.js
var isValidVolume = __webpack_require__(15773);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/updateVTKImageDataWithCornerstoneImage.js
var updateVTKImageDataWithCornerstoneImage = __webpack_require__(60955);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/ProgressiveIterator.js
var ProgressiveIterator = __webpack_require__(90944);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/decimate.js
var decimate = __webpack_require__(53019);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/imageRetrieveMetadataProvider.js
var imageRetrieveMetadataProvider = __webpack_require__(9132);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/genericViewportDisplaySetMetadataProvider.js
var genericViewportDisplaySetMetadataProvider = __webpack_require__(84204);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/isVideoTransferSyntax.js
var isVideoTransferSyntax = __webpack_require__(67970);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getBufferConfiguration.js
var getBufferConfiguration = __webpack_require__(53461);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/generateVolumePropsFromImageIds.js
var generateVolumePropsFromImageIds = __webpack_require__(26929);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/convertStackToVolumeViewport.js
var convertStackToVolumeViewport = __webpack_require__(9205);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/convertVolumeToStackViewport.js
var convertVolumeToStackViewport = __webpack_require__(47527);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/VoxelManager.js
var VoxelManager = __webpack_require__(95466);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/RLEVoxelMap.js
var RLEVoxelMap = __webpack_require__(99790);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/roundNumber.js
var roundNumber = __webpack_require__(21748);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/convertToGrayscale.js
var convertToGrayscale = __webpack_require__(49516);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/convertColorArrayToRgbString.js
var convertColorArrayToRgbString = __webpack_require__(95481);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getViewportImageIds.js
var getViewportImageIds = __webpack_require__(91626);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getRandomSampleFromArray.js
var getRandomSampleFromArray = __webpack_require__(40619);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getVolumeId.js
var getVolumeId = __webpack_require__(79030);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/hasFloatScalingParameters.js
var hasFloatScalingParameters = __webpack_require__(37610);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/pointInShapeCallback.js + 1 modules
var pointInShapeCallback = __webpack_require__(74479);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/ECGUtilities.js
var ECGUtilities = __webpack_require__(14034);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/VideoUtilities.js
var VideoUtilities = __webpack_require__(80584);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/WSIUtilities.js + 1 modules
var WSIUtilities = __webpack_require__(26578);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/planar.js
var planar = __webpack_require__(25481);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/windowLevel.js
var windowLevel = __webpack_require__(37579);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/colormap.js
var colormap = __webpack_require__(18186);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/transferFunctionUtils.js
var transferFunctionUtils = __webpack_require__(76353);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/color.js
var color = __webpack_require__(95846);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/deepEqual.js
var deepEqual = __webpack_require__(61583);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/FrameRange.js
var FrameRange = __webpack_require__(67159);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/fnv1aHash.js
var fnv1aHash = __webpack_require__(51517);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getImageDataMetadata.js
var getImageDataMetadata = __webpack_require__(75689);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/buildMetadata.js
var buildMetadata = __webpack_require__(5540);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getViewportModality.js
var getViewportModality = __webpack_require__(90500);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getScalingDescriptor.js
var getScalingDescriptor = __webpack_require__(23689);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/resolveGenericViewportVolumeId.js
var resolveGenericViewportVolumeId = __webpack_require__(61265);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/cache/cache.js
var cache = __webpack_require__(67425);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getDynamicVolumeInfo.js
var getDynamicVolumeInfo = __webpack_require__(98014);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/autoLoad.js
var autoLoad = __webpack_require__(18538);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/scaleArray.js
var scaleArray = __webpack_require__(5494);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/splitImageIdsBy4DTags.js
var splitImageIdsBy4DTags = __webpack_require__(16468);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/deepClone.js
var deepClone = __webpack_require__(95902);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/jumpToSlice.js
var jumpToSlice = __webpack_require__(90420);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/scroll.js
var utilities_scroll = __webpack_require__(98632);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/clip.js
var clip = __webpack_require__(16259);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/createSubVolume.js
var createSubVolume = __webpack_require__(46873);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getAcquisitionPlaneOrientation.js
var getAcquisitionPlaneOrientation = __webpack_require__(63630);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getVolumeDirectionVectors.js
var getVolumeDirectionVectors = __webpack_require__(82732);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getVolumeViewReferenceId.js
var getVolumeViewReferenceId = __webpack_require__(63904);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/calculateSpacingBetweenImageIds.js
var calculateSpacingBetweenImageIds = __webpack_require__(66831);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/logger.js
var logger = __webpack_require__(80977);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/calculateNeighborhoodStats.js
var calculateNeighborhoodStats = __webpack_require__(5830);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/viewportVoiIntensityMapping.js
var viewportVoiIntensityMapping = __webpack_require__(28656);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getPixelSpacingInformation.js
var getPixelSpacingInformation = __webpack_require__(41840);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getPlaneCubeIntersectionDimensions.js
var getPlaneCubeIntersectionDimensions = __webpack_require__(50094);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/rotateToViewCoordinates.js
var rotateToViewCoordinates = __webpack_require__(30035);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/asArray.js
var asArray = __webpack_require__(44124);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/viewportCapabilities.js
var viewportCapabilities = __webpack_require__(71589);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/getNormalizedAspectRatio.js
var getNormalizedAspectRatio = __webpack_require__(89493);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/updatePlaneRestriction.js
var updatePlaneRestriction = __webpack_require__(89252);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/isEqual.js
var isEqual = __webpack_require__(77981);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/utilities/index.js




















































































































const utilities_getViewportModality = (viewport, volumeId) => (0,getViewportModality/* ._getViewportModality */.p)(viewport, volumeId, cache/* ["default"].getVolume */.Ay.getVolume);
const utilities_getScalingDescriptor = (viewport, targetId) => (0,getScalingDescriptor/* ._getScalingDescriptor */.c)(viewport, targetId, cache/* ["default"].getVolume */.Ay.getVolume);




},
80977(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  aiLog: () => (aiLog),
  coreLog: () => (coreLog),
  cs3dLog: () => (cs3dLog),
  dicomConsistencyLog: () => (dicomConsistencyLog),
  examplesLog: () => (examplesLog),
  getLogger: () => (getLogger),
  getRootLogger: () => (getRootLogger),
  growCutLog: () => (growCutLog),
  imageConsistencyLog: () => (imageConsistencyLog),
  loaderLog: () => (loaderLog),
  toolsLog: () => (toolsLog),
  workerLog: () => (workerLog)
});
/* import */ var _cornerstonejs_utils__rspack_import_0 = __webpack_require__(53103);

const { /* getRootLogger */pp: getRootLogger, /* getLogger */tZ: getLogger, /* cs3dLog */gE: cs3dLog, /* workerLog */bM: workerLog, /* coreLog */uu: coreLog, /* toolsLog */UA: toolsLog, /* loaderLog */_E: loaderLog, /* aiLog */RZ: aiLog, /* examplesLog */UX: examplesLog, /* dicomConsistencyLog */HL: dicomConsistencyLog, /* imageConsistencyLog */U5: imageConsistencyLog, } = _cornerstonejs_utils__rspack_import_0/* .logging */.m9;
const growCutLog = toolsLog.getLogger('growCut');


},
25481(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isPointOnPlane: () => (isPointOnPlane),
  linePlaneIntersection: () => (linePlaneIntersection),
  planeDistanceToPoint: () => (planeDistanceToPoint),
  planeEquation: () => (planeEquation),
  threePlaneIntersection: () => (threePlaneIntersection)
});
/* import */ var gl_matrix__rspack_import_0 = __webpack_require__(40230);
/* import */ var _constants_index_js__rspack_import_1 = __webpack_require__(92458);


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
    const m0 = gl_matrix__rspack_import_0/* .mat3.fromValues */.w0.fromValues(A1, A2, A3, B1, B2, B3, C1, C2, C3);
    const m1 = gl_matrix__rspack_import_0/* .mat3.fromValues */.w0.fromValues(D1, D2, D3, B1, B2, B3, C1, C2, C3);
    const m2 = gl_matrix__rspack_import_0/* .mat3.fromValues */.w0.fromValues(A1, A2, A3, D1, D2, D3, C1, C2, C3);
    const m3 = gl_matrix__rspack_import_0/* .mat3.fromValues */.w0.fromValues(A1, A2, A3, B1, B2, B3, D1, D2, D3);
    const x = gl_matrix__rspack_import_0/* .mat3.determinant */.w0.determinant(m1) / gl_matrix__rspack_import_0/* .mat3.determinant */.w0.determinant(m0);
    const y = gl_matrix__rspack_import_0/* .mat3.determinant */.w0.determinant(m2) / gl_matrix__rspack_import_0/* .mat3.determinant */.w0.determinant(m0);
    const z = gl_matrix__rspack_import_0/* .mat3.determinant */.w0.determinant(m3) / gl_matrix__rspack_import_0/* .mat3.determinant */.w0.determinant(m0);
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
function isPointOnPlane(point, plane, tolerance = _constants_index_js__rspack_import_1.EPSILON) {
    return planeDistanceToPoint(plane, point) < tolerance;
}



},
2782(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  zj: () => (getConfig)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _enums_Events_js__rspack_import_1 = __webpack_require__(57290);


let config = {};
function getConfig() {
    return config;
}
function setConfig(newConfig) {
    config = newConfig;
}
function getAddOns() {
    return config.addons;
}
let polysegInitialized = false;
function getPolySeg() {
    if (!config.addons?.polySeg) {
        console.warn('PolySeg add-on not configured. This will prevent automatic conversion between segmentation representations (labelmap, contour, surface). To enable these features, install @cornerstonejs/polymorphic-segmentation and register it during initialization: cornerstoneTools.init({ addons: { polySeg } }).');
        return null;
    }
    const polyseg = config.addons.polySeg;
    if (!polysegInitialized) {
        polyseg.init();
        polysegInitialized = true;
    }
    return polyseg;
}


},
69501() {
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
/* unused export default */ var __rspack_default_export = ((/* unused pure expression or super */ null && (CORNERSTONE_COLOR_LUT)));


},
16071(__unused_rspack___webpack_module__, __unused_rspack___webpack_exports__, __webpack_require__) {
/* import */ var _getHash_js__rspack_import_0 = __webpack_require__(23836);
/* import */ var _setAttributesIfNecessary_js__rspack_import_1 = __webpack_require__(24810);
/* import */ var _setNewAttributesIfValid_js__rspack_import_2 = __webpack_require__(7229);



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
/* unused export default */ var __rspack_default_export = ((/* unused pure expression or super */ null && (drawEllipseByCoordinates)));


},
21566(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  draw: () => (/* reexport */ draw/* ["default"] */.A),
  drawCircle: () => (/* reexport */ drawCircle/* ["default"] */.A),
  drawHandles: () => (/* reexport */ drawHandles/* ["default"] */.A),
  drawLine: () => (/* reexport */ drawingSvg_drawLine/* ["default"] */.A),
  drawLinkedTextBox: () => (/* reexport */ drawLinkedTextBox/* ["default"] */.A),
  drawPath: () => (/* reexport */ drawPath/* ["default"] */.A),
  drawPolyline: () => (/* reexport */ drawPolyline/* ["default"] */.A),
  drawRect: () => (/* reexport */ drawRect/* ["default"] */.A),
  drawRectByCoordinates: () => (/* reexport */ drawRectByCoordinates/* ["default"] */.A)
});

// UNUSED EXPORTS: drawArrow, drawEllipse, drawEllipseByCoordinates, drawFan, drawHandle, drawHeight, drawRedactionRect, drawTextBox, setAttributesIfNecessary, setNewAttributesIfValid

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/draw.js + 1 modules
var draw = __webpack_require__(20000);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawCircle.js
var drawCircle = __webpack_require__(44157);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawEllipse.js
var drawEllipse = __webpack_require__(74575);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawEllipseByCoordinates.js
var drawEllipseByCoordinates = __webpack_require__(16071);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawHandles.js
var drawHandles = __webpack_require__(40582);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawHandle.js
var drawHandle = __webpack_require__(43939);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawLine.js
var drawingSvg_drawLine = __webpack_require__(93415);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawHeight.js

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
var drawPolyline = __webpack_require__(95385);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawPath.js
var drawPath = __webpack_require__(26498);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/_getHash.js
var drawingSvg_getHash = __webpack_require__(23836);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/setAttributesIfNecessary.js
var drawingSvg_setAttributesIfNecessary = __webpack_require__(24810);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/setNewAttributesIfValid.js
var drawingSvg_setNewAttributesIfValid = __webpack_require__(7229);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawFan.js



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
/* export default */ const drawingSvg_drawFan = ((/* unused pure expression or super */ null && (drawFan)));

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawLinkedTextBox.js + 1 modules
var drawLinkedTextBox = __webpack_require__(24320);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawRect.js
var drawRect = __webpack_require__(63103);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawRectByCoordinates.js
var drawRectByCoordinates = __webpack_require__(53591);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawTextBox.js
var drawTextBox = __webpack_require__(33545);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawArrow.js

const drawArrow_svgns = 'http://www.w3.org/2000/svg';
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
        arrowMarker = document.createElementNS(drawArrow_svgns, 'marker');
        arrowMarker.setAttribute('id', markerFullId);
        arrowMarker.setAttribute('viewBox', '0 0 10 10');
        arrowMarker.setAttribute('refX', '8');
        arrowMarker.setAttribute('refY', '5');
        arrowMarker.setAttribute('markerWidth', `${markerSize}`);
        arrowMarker.setAttribute('markerHeight', `${markerSize}`);
        arrowMarker.setAttribute('orient', 'auto');
        const arrowPath = document.createElementNS(drawArrow_svgns, 'path');
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

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/drawRedactionRect.js



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

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/drawingSvg/index.js






















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
60567(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  O8: () => (/* reexport safe */ _annotation_annotationState_js__rspack_import_3.removeAnnotation),
  Rh: () => (/* reexport safe */ _annotation_annotationState_js__rspack_import_3.getAnnotations),
  lC: () => (/* reexport safe */ _annotation_annotationState_js__rspack_import_3.addAnnotation)
});
/* import */ var _annotation_FrameOfReferenceSpecificAnnotationManager_js__rspack_import_0 = __webpack_require__(83342);
/* import */ var _annotation_annotationLocking_js__rspack_import_1 = __webpack_require__(3043);
/* import */ var _annotation_annotationSelection_js__rspack_import_2 = __webpack_require__(41908);
/* import */ var _annotation_annotationState_js__rspack_import_3 = __webpack_require__(44627);
/* import */ var _annotation_resetAnnotationManager_js__rspack_import_4 = __webpack_require__(30362);








},
28538(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  I: () => (getSegmentationRepresentationDisplay)
});
const segmentationRepresentationDisplays = new Map();
function registerSegmentationRepresentationDisplay(representationType, display) {
    segmentationRepresentationDisplays.set(representationType, display);
}
function getSegmentationRepresentationDisplay(representationType) {
    return segmentationRepresentationDisplays.get(representationType);
}


},
47881(__unused_rspack___webpack_module__, __unused_rspack___webpack_exports__, __webpack_require__) {
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _SegmentationStateManager_js__rspack_import_1 = __webpack_require__(86706);
/* import */ var _getNextColorLUTIndex_js__rspack_import_2 = __webpack_require__(43243);
/* import */ var _constants_COLOR_LUT_js__rspack_import_3 = __webpack_require__(69501);




const PREVIEW_COLOR_INDEX = 255;
const MINIMUM_COLOR_LUT_ENTRIES = (/* unused pure expression or super */ null && (PREVIEW_COLOR_INDEX + 1));
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
    if (colorLUTToUse.length < MINIMUM_COLOR_LUT_ENTRIES) {
        const missingColorLUTs = CORNERSTONE_COLOR_LUT.slice(colorLUTToUse.length);
        colorLUTToUse = [...colorLUTToUse, ...missingColorLUTs];
    }
    while (colorLUTToUse.length < MINIMUM_COLOR_LUT_ENTRIES) {
        const paletteIndex = ((colorLUTToUse.length - 1) % (CORNERSTONE_COLOR_LUT.length - 1)) + 1;
        colorLUTToUse.push([...CORNERSTONE_COLOR_LUT[paletteIndex]]);
    }
    segmentationStateManager.addColorLUT(colorLUTToUse, indexToUse);
    return indexToUse;
}


},
53930(__unused_rspack___webpack_module__, __unused_rspack___webpack_exports__, __webpack_require__) {

// UNUSED EXPORTS: addContourRepresentationToViewport, addContourRepresentationToViewportMap, addLabelmapRepresentationToViewport, addLabelmapRepresentationToViewportMap, addSegmentationRepresentations, addSurfaceRepresentationToViewport, addSurfaceRepresentationToViewportMap

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js + 3 modules
var enums = __webpack_require__(53870);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(88479);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/constants/COLOR_LUT.js
var COLOR_LUT = __webpack_require__(69501);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/triggerAnnotationRenderForViewportIds.js
var utilities_triggerAnnotationRenderForViewportIds = __webpack_require__(85321);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/triggerSegmentationEvents.js + 4 modules
var triggerSegmentationEvents = __webpack_require__(49256);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/addColorLUT.js
var segmentation_addColorLUT = __webpack_require__(47881);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/SegmentationStateManager.js
var SegmentationStateManager = __webpack_require__(86706);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/isSegmentationOverlayCompatible.js
var helpers_isSegmentationOverlayCompatible = __webpack_require__(78132);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/segmentationEventManager.js
var segmentationEventManager = __webpack_require__(83997);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/segmentIndex.js
var segmentIndex = __webpack_require__(85335);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/internalAddSegmentationRepresentation.js










function internalAddSegmentationRepresentation_internalAddSegmentationRepresentation(viewportId, representationInput) {
    const { segmentationId, config } = representationInput;
    if (!isSegmentationOverlayCompatible(getEnabledElementByViewportId(viewportId)?.viewport, segmentationId, representationInput.type)) {
        console.warn(`Skipping ${representationInput.type} representation of segmentation "${segmentationId}" on viewport "${viewportId}": the viewport is not a compatible destination for it.`);
        return;
    }
    const renderingConfig = {
        colorLUTIndex: getColorLUTIndex(config),
        ...config,
    };
    defaultSegmentationStateManager.addSegmentationRepresentation(viewportId, segmentationId, representationInput.type, renderingConfig);
    const { viewport } = getEnabledElementByViewportId(viewportId) || {};
    if (viewport) {
        addDefaultSegmentationListener(viewport, segmentationId, representationInput.type);
    }
    if (!getActiveSegmentIndex(segmentationId)) {
        let firstSegmentIndex = 1;
        const segmentation = defaultSegmentationStateManager.getSegmentation(segmentationId);
        if (segmentation) {
            const segmentKeys = Object.keys(segmentation.segments);
            if (segmentKeys.length > 0) {
                firstSegmentIndex = segmentKeys.map((k) => Number(k)).sort()[0];
            }
            setActiveSegmentIndex(segmentationId, firstSegmentIndex);
        }
    }
    if (representationInput.type === SegmentationRepresentations.Contour) {
        triggerAnnotationRenderForViewportIds([viewportId]);
    }
    if (representationInput.type === SegmentationRepresentations.Surface) {
        triggerSegmentationDataModified(segmentationId);
    }
    triggerSegmentationModified(segmentationId);
}
function getColorLUTIndex(config) {
    const { colorLUTOrIndex } = config || {};
    if (colorLUTOrIndex === undefined) {
        const index = addColorLUT(utilities.deepClone(CORNERSTONE_COLOR_LUT));
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
    const index = addColorLUT(utilities.deepClone(CORNERSTONE_COLOR_LUT));
    return index;
}


;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/addSegmentationRepresentationsToViewport.js


function addSegmentationRepresentations(viewportId, segmentationInputArray) {
    segmentationInputArray.map((segmentationInput) => {
        return internalAddSegmentationRepresentation(viewportId, segmentationInput);
    });
}
function addContourRepresentationToViewport(viewportId, contourInputArray) {
    return addSegmentationRepresentations(viewportId, contourInputArray.map((input) => ({
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
    return addSegmentationRepresentations(viewportId, labelmapInputArray.map((input) => ({
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
    return addSegmentationRepresentations(viewportId, surfaceInputArray.map((input) => ({
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



},
46692(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  getSegmentIndexColor: () => (getSegmentIndexColor),
  setSegmentIndexColor: () => (setSegmentIndexColor)
});
/* import */ var _addColorLUT_js__rspack_import_0 = __webpack_require__(47881);
/* import */ var _getColorLUT_js__rspack_import_1 = __webpack_require__(39550);
/* import */ var _getSegmentationRepresentation_js__rspack_import_2 = __webpack_require__(54869);
/* import */ var _triggerSegmentationEvents_js__rspack_import_3 = __webpack_require__(49256);




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
    const representations = (0,_getSegmentationRepresentation_js__rspack_import_2/* .getSegmentationRepresentations */.r$)(viewportId, {
        segmentationId,
    });
    if (!representations || representations.length === 0) {
        return null;
    }
    const representation = representations[0];
    const { colorLUTIndex } = representation;
    const colorLUT = (0,_getColorLUT_js__rspack_import_1/* .getColorLUT */.B)(colorLUTIndex);
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
    (0,_triggerSegmentationEvents_js__rspack_import_3.triggerSegmentationRepresentationModified)(viewportId, segmentationId);
}



},
9200(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  vl: () => (getCurrentLabelmapImageIdForViewport)
});
/* import */ var _SegmentationStateManager_js__rspack_import_0 = __webpack_require__(86706);
/* import */ var _getSegmentation_js__rspack_import_1 = __webpack_require__(99212);
/* import */ var _getActiveSegmentIndex_js__rspack_import_2 = __webpack_require__(61395);
/* import */ var _helpers_labelmapSegmentationState_js__rspack_import_3 = __webpack_require__(89615);




function getCurrentLabelmapImageIdForViewport(viewportId, segmentationId) {
    const imageIds = getCurrentLabelmapImageIdsForViewport(viewportId, segmentationId);
    if (!imageIds?.length) {
        return;
    }
    if (imageIds.length === 1) {
        return imageIds[0];
    }
    const segmentation = (0,_getSegmentation_js__rspack_import_1/* .getSegmentation */.T)(segmentationId);
    const activeSegmentIndex = (0,_getActiveSegmentIndex_js__rspack_import_2/* .getActiveSegmentIndex */.Q)(segmentationId);
    const activeLayer = activeSegmentIndex
        ? (0,_helpers_labelmapSegmentationState_js__rspack_import_3/* .getLabelmapForSegment */.r)(segmentation, activeSegmentIndex)
        : undefined;
    if (!activeLayer?.imageIds?.length) {
        return imageIds[0];
    }
    return (imageIds.find((imageId) => activeLayer.imageIds.includes(imageId)) ??
        imageIds[0]);
}
function getCurrentLabelmapImageIdsForViewport(viewportId, segmentationId) {
    const segmentationStateManager = _SegmentationStateManager_js__rspack_import_0/* .defaultSegmentationStateManager */._6;
    return segmentationStateManager.getCurrentLabelmapImageIdsForViewport(viewportId, segmentationId);
}
function getLabelmapImageIdsForImageId(imageId, segmentationId) {
    const segmentationStateManager = defaultSegmentationStateManager;
    return segmentationStateManager.getLabelmapImageIdsForImageId(imageId, segmentationId);
}


},
43243(__unused_rspack___webpack_module__, __unused_rspack___webpack_exports__, __webpack_require__) {
/* import */ var _SegmentationStateManager_js__rspack_import_0 = __webpack_require__(86706);

function getNextColorLUTIndex() {
    const segmentationStateManager = defaultSegmentationStateManager;
    return segmentationStateManager.getNextColorLUTIndex();
}


},
54869(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Ut: () => (getSegmentationRepresentation),
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
    const segmentationStateManager = defaultSegmentationStateManager;
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
    const enabledElement = getEnabledElementByViewportId(viewportId);
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
    return getActorEntries(viewportId, (actor) => actor.representationUID?.startsWith(`${segmentationId}-${SegmentationRepresentations.Labelmap}`));
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
    return `${segmentationId}-${SegmentationRepresentations.Surface}-${segmentIndex}`;
}


},
78132(__unused_rspack___webpack_module__, __unused_rspack___webpack_exports__, __webpack_require__) {
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
            ? cache.getVolume(layer.volumeId)?.imageIds
            : undefined) ??
        [];
    return labelmapImageIds
        .map((labelmapImageId) => cache.getImage(labelmapImageId)?.referencedImageId)
        .filter(Boolean);
}
function getLayerFrameOfReferenceUIDs(layer) {
    const frameOfReferenceUIDs = new Set();
    if (layer.volumeId) {
        const volumeFrameOfReference = cache.getVolume(layer.volumeId)?.metadata?.FrameOfReferenceUID;
        if (volumeFrameOfReference) {
            frameOfReferenceUIDs.add(volumeFrameOfReference);
        }
    }
    for (const referencedImageId of getLayerReferencedImageIds(layer)) {
        const imageFrameOfReference = metaData.get('imagePlaneModule', referencedImageId)?.frameOfReferenceUID;
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
    if (representationType !== SegmentationRepresentations.Labelmap) {
        return true;
    }
    if (!viewport) {
        return true;
    }
    const segmentation = getSegmentation(segmentationId);
    if (!segmentation) {
        return true;
    }
    const layers = getLabelmaps(segmentation);
    const isVolumeViewport = typeof viewport
        .getAllVolumeIds === 'function';
    return isVolumeViewport
        ? volumeViewportSharesFrameOfReference(viewport, layers)
        : stackViewportReferencesImages(viewport, layers);
}


},
53585(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  QO: () => (canRenderVolumeViewportLabelmapAsImage),
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
    const layers = getLabelmaps(segmentation);
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
    const isLegacyVolumeViewport = viewport instanceof VolumeViewport;
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
    const normalizedNormal = vec3.normalize(vec3.create(), viewPlaneNormal);
    const normalizedViewUp = vec3.normalize(vec3.create(), viewUp);
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
            ActorRenderMode.VTK_VOLUME_SLICE) {
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
89615(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Mx: () => (/* reexport safe */ _labelmapModel_index_js__rspack_import_0.Mx),
  Nf: () => (/* reexport safe */ _labelmapModel_index_js__rspack_import_0.Nf),
  Qk: () => (/* reexport safe */ _labelmapModel_index_js__rspack_import_0.Qk),
  Ry: () => (/* reexport safe */ _labelmapModel_index_js__rspack_import_0.Ry),
  VQ: () => (/* reexport safe */ _labelmapModel_index_js__rspack_import_0.VQ),
  kL: () => (/* reexport safe */ _labelmapModel_index_js__rspack_import_0.kL),
  r: () => (/* reexport safe */ _labelmapModel_index_js__rspack_import_0.r)
});
/* import */ var _labelmapModel_index_js__rspack_import_0 = __webpack_require__(84120);



},
84120(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Lp: () => (/* reexport safe */ _labelmapImageReferenceResolver_js__rspack_import_6.A),
  Mx: () => (/* reexport safe */ _labelmapSegmentBindings_js__rspack_import_3.Mx),
  Nf: () => (/* reexport safe */ _labelmapSegmentBindings_js__rspack_import_3.Nf),
  Qk: () => (/* reexport safe */ _labelmapEditTransaction_js__rspack_import_5.Qk),
  Ry: () => (/* reexport safe */ _labelmapEditTransaction_js__rspack_import_5.Ry),
  VQ: () => (/* reexport safe */ _labelmapEditTransaction_js__rspack_import_5.VQ),
  kL: () => (/* reexport safe */ _labelmapLayerStore_js__rspack_import_1.kL),
  r: () => (/* reexport safe */ _labelmapSegmentBindings_js__rspack_import_3.r),
  uk: () => (/* reexport safe */ _normalizeLabelmapSegmentationData_js__rspack_import_0.uk),
  xS: () => (/* reexport safe */ _labelmapLegacyAdapter_js__rspack_import_2.x)
});
/* import */ var _normalizeLabelmapSegmentationData_js__rspack_import_0 = __webpack_require__(209);
/* import */ var _labelmapLayerStore_js__rspack_import_1 = __webpack_require__(88392);
/* import */ var _labelmapLegacyAdapter_js__rspack_import_2 = __webpack_require__(2674);
/* import */ var _labelmapSegmentBindings_js__rspack_import_3 = __webpack_require__(59371);
/* import */ var _privateLabelmap_js__rspack_import_4 = __webpack_require__(48019);
/* import */ var _labelmapEditTransaction_js__rspack_import_5 = __webpack_require__(73344);
/* import */ var _labelmapImageReferenceResolver_js__rspack_import_6 = __webpack_require__(77438);









},
88392(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  $n: () => (removeLabelmap),
  AD: () => (registerLabelmap),
  Hs: () => (getLabelmap),
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
85335(__unused_rspack___webpack_module__, __unused_rspack___webpack_exports__, __webpack_require__) {
/* import */ var _store_ToolGroupManager_index_js__rspack_import_0 = __webpack_require__(72314);
/* import */ var _utilities_segmentation_invalidateBrushCursor_js__rspack_import_1 = __webpack_require__(90389);
/* import */ var _getSegmentation_js__rspack_import_2 = __webpack_require__(99212);
/* import */ var _getViewportIdsWithSegmentation_js__rspack_import_3 = __webpack_require__(83470);
/* import */ var _triggerSegmentationEvents_js__rspack_import_4 = __webpack_require__(49256);
/* import */ var _getActiveSegmentIndex_js__rspack_import_5 = __webpack_require__(61395);
/* import */ var _getSegmentationRepresentation_js__rspack_import_6 = __webpack_require__(54869);
/* import */ var _helpers_labelmapSegmentationState_js__rspack_import_7 = __webpack_require__(89615);








function setActiveSegmentIndex(segmentationId, segmentIndex) {
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
        if (segmentation.representationData?.Labelmap) {
            ensureLabelmapState(segmentation);
            const primaryLayer = getLabelmaps(segmentation)[0];
            if (primaryLayer) {
                setSegmentBinding(segmentation, segmentIndex, {
                    labelmapId: primaryLayer.labelmapId,
                    labelValue: segmentIndex,
                });
                syncLegacyLabelmapData(segmentation);
            }
        }
    }
    if (segmentation.representationData?.Labelmap &&
        !getSegmentBinding(segmentation, segmentIndex)) {
        ensureLabelmapState(segmentation);
        const primaryLayer = getLabelmaps(segmentation)[0];
        if (primaryLayer) {
            setSegmentBinding(segmentation, segmentIndex, {
                labelmapId: primaryLayer.labelmapId,
                labelValue: segmentIndex,
            });
            syncLegacyLabelmapData(segmentation);
        }
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
        if (!toolGroup) {
            return;
        }
        invalidateBrushCursor(toolGroup.id);
    });
}



},
60606(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  getLockedSegmentIndices: () => (getLockedSegmentIndices)
});
/* import */ var _stateManagement_segmentation_getSegmentation_js__rspack_import_0 = __webpack_require__(99212);
/* import */ var _annotation_annotationLocking_js__rspack_import_1 = __webpack_require__(3043);
/* import */ var _triggerSegmentationEvents_js__rspack_import_2 = __webpack_require__(49256);
/* import */ var _utilities_index_js__rspack_import_3 = __webpack_require__(48295);




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
    const segmentation = (0,_stateManagement_segmentation_getSegmentation_js__rspack_import_0/* .getSegmentation */.T)(segmentationId);
    if (!segmentation) {
        throw new Error(`No segmentation state found for ${segmentationId}`);
    }
    const { segments } = segmentation;
    const lockedSegmentIndices = Object.keys(segments).filter((segmentIndex) => segments[segmentIndex].locked);
    return lockedSegmentIndices.map((segmentIndex) => parseInt(segmentIndex));
}



},
3133(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  getCurrentLabelmapImageIdForViewport: () => (/* reexport safe */ _getCurrentLabelmapImageIdForViewport_js__rspack_import_11.vl)
});
/* import */ var _getSegmentation_js__rspack_import_0 = __webpack_require__(99212);
/* import */ var _getSegmentations_js__rspack_import_1 = __webpack_require__(72163);
/* import */ var _addSegmentations_js__rspack_import_2 = __webpack_require__(71159);
/* import */ var _removeSegmentation_js__rspack_import_3 = __webpack_require__(10054);
/* import */ var _removeSegmentationRepresentations_js__rspack_import_4 = __webpack_require__(82682);
/* import */ var _addColorLUT_js__rspack_import_5 = __webpack_require__(47881);
/* import */ var _getColorLUT_js__rspack_import_6 = __webpack_require__(39550);
/* import */ var _getNextColorLUTIndex_js__rspack_import_7 = __webpack_require__(43243);
/* import */ var _removeColorLUT_js__rspack_import_8 = __webpack_require__(58708);
/* import */ var _getViewportSegmentations_js__rspack_import_9 = __webpack_require__(98017);
/* import */ var _getViewportIdsWithSegmentation_js__rspack_import_10 = __webpack_require__(83470);
/* import */ var _getCurrentLabelmapImageIdForViewport_js__rspack_import_11 = __webpack_require__(9200);
/* import */ var _updateLabelmapSegmentationImageReferences_js__rspack_import_12 = __webpack_require__(9484);
/* import */ var _getStackSegmentationImageIdsForViewport_js__rspack_import_13 = __webpack_require__(79274);
/* import */ var _getSegmentationRepresentation_js__rspack_import_14 = __webpack_require__(54869);
/* import */ var _SegmentationStateManager_js__rspack_import_15 = __webpack_require__(86706);
















function destroy() {
    defaultSegmentationStateManager.resetState();
}
function getDefaultSegmentationStateManager() {
    return defaultSegmentationStateManager;
}



},
9484(__unused_rspack___webpack_module__, __unused_rspack___webpack_exports__, __webpack_require__) {
/* import */ var _SegmentationStateManager_js__rspack_import_0 = __webpack_require__(86706);

function updateLabelmapSegmentationImageReferences(viewportId, segmentationId) {
    const segmentationStateManager = defaultSegmentationStateManager;
    return segmentationStateManager.updateLabelmapSegmentationImageReferences(viewportId, segmentationId);
}


},
22378(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
let svgNodeCache = {};
function resetSvgNodeCache() {
    svgNodeCache = {};
}
/* export default */ const __rspack_default_export = (svgNodeCache);


},
92835(__unused_rspack___webpack_module__, __unused_rspack___webpack_exports__, __webpack_require__) {
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
/* unused export default */ var __rspack_default_export = ((/* unused pure expression or super */ null && (BidirectionalTool)));


},
84962(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  EC: () => (/* reexport safe */ _AnnotationTool_js__rspack_import_1.A),
  F6: () => (/* reexport safe */ _measurementTargetFilters_js__rspack_import_3.Ay),
  oS: () => (/* reexport safe */ _BaseTool_js__rspack_import_0.A)
});
/* import */ var _BaseTool_js__rspack_import_0 = __webpack_require__(69263);
/* import */ var _AnnotationTool_js__rspack_import_1 = __webpack_require__(36379);
/* import */ var _AnnotationDisplayTool_js__rspack_import_2 = __webpack_require__(76853);
/* import */ var _measurementTargetFilters_js__rspack_import_3 = __webpack_require__(83596);








},
70947(__unused_rspack___webpack_module__, __unused_rspack___webpack_exports__, __webpack_require__) {
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
/* unused export default */ var __rspack_default_export = ((/* unused pure expression or super */ null && (BrushTool)));


},
55314(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  C$: () => (getEllipseCornersFromCanvasCoordinates),
  kr: () => (fillInsideCircle),
  mu: () => (createPointInEllipse),
  pB: () => (CIRCLE_STRATEGY),
  q: () => (thresholdInsideCircle)
});
/* import */ var gl_matrix__rspack_import_0 = __webpack_require__(40230);
/* import */ var _cornerstonejs_core__rspack_import_1 = __webpack_require__(88479);
/* import */ var _utilities_boundingBox_index_js__rspack_import_2 = __webpack_require__(26111);
/* import */ var _BrushStrategy_js__rspack_import_3 = __webpack_require__(75639);
/* import */ var _enums_index_js__rspack_import_4 = __webpack_require__(53870);
/* import */ var _compositions_index_js__rspack_import_5 = __webpack_require__(30207);
/* import */ var _utilities_math_sphere_index_js__rspack_import_6 = __webpack_require__(39767);







const { transformWorldToIndex, transformIndexToWorld, isEqual, getNormalizedAspectRatio, } = _cornerstonejs_core__rspack_import_1.utilities;
function getEllipseCornersFromCanvasCoordinates(canvasCoordinates) {
    const [bottom, top, left, right] = canvasCoordinates;
    const topLeft = [left[0], top[1]];
    const bottomRight = [right[0], bottom[1]];
    const bottomLeft = [left[0], bottom[1]];
    const topRight = [right[0], top[1]];
    return [topLeft, bottomRight, bottomLeft, topRight];
}
function createCircleCornersForCenter(center, viewUp, viewRight, yRadius, xRadius) {
    const centerVec = gl_matrix__rspack_import_0/* .vec3.fromValues */.eR.fA(center[0], center[1], center[2]);
    const top = gl_matrix__rspack_import_0/* .vec3.create */.eR.vt();
    gl_matrix__rspack_import_0/* .vec3.scaleAndAdd */.eR.Ln(top, centerVec, viewUp, yRadius);
    const bottom = gl_matrix__rspack_import_0/* .vec3.create */.eR.vt();
    gl_matrix__rspack_import_0/* .vec3.scaleAndAdd */.eR.Ln(bottom, centerVec, viewUp, -yRadius);
    const right = gl_matrix__rspack_import_0/* .vec3.create */.eR.vt();
    gl_matrix__rspack_import_0/* .vec3.scaleAndAdd */.eR.Ln(right, centerVec, viewRight, xRadius);
    const left = gl_matrix__rspack_import_0/* .vec3.create */.eR.vt();
    gl_matrix__rspack_import_0/* .vec3.scaleAndAdd */.eR.Ln(left, centerVec, viewRight, -xRadius);
    return [
        bottom,
        top,
        left,
        right,
    ];
}
function createStrokePredicate(centers, xRadius, yRadius) {
    if (!centers.length || xRadius <= 0 || yRadius <= 0) {
        return null;
    }
    const xRadiusSquared = xRadius * xRadius;
    const yRadiusSquared = yRadius * yRadius;
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
            if ((dx * dx) / xRadiusSquared + (dy * dy) / yRadiusSquared + dz * dz <=
                1) {
                return true;
            }
        }
        for (const { start, vector, lengthSquared } of segments) {
            if (lengthSquared === 0) {
                const dx = worldPoint[0] - start[0];
                const dy = worldPoint[1] - start[1];
                const dz = worldPoint[2] - start[2];
                if ((dx * dx) / xRadiusSquared + (dy * dy) / yRadiusSquared + dz * dz <=
                    1) {
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
            if ((distX * distX) / xRadiusSquared +
                (distY * distY) / yRadiusSquared +
                distZ * distZ <=
                1) {
                return true;
            }
        }
        return false;
    };
}
const initializeCircle = {
    [_enums_index_js__rspack_import_4.StrategyCallbacks.Initialize]: (operationData) => {
        const { points, viewport, segmentationImageData, viewUp, viewPlaneNormal, } = operationData;
        if (!points) {
            return;
        }
        const center = gl_matrix__rspack_import_0/* .vec3.create */.eR.vt();
        if (points.length >= 2) {
            gl_matrix__rspack_import_0/* .vec3.add */.eR.WQ(center, points[0], points[1]);
            gl_matrix__rspack_import_0/* .vec3.scale */.eR.hs(center, center, 0.5);
        }
        else {
            gl_matrix__rspack_import_0/* .vec3.copy */.eR.C(center, points[0]);
        }
        operationData.centerWorld = center;
        operationData.centerIJK = transformWorldToIndex(segmentationImageData, center);
        const aspectRatio = getNormalizedAspectRatio(viewport.getAspectRatio());
        const yRadius = points.length >= 2
            ? gl_matrix__rspack_import_0/* .vec3.distance */.eR.Io(points[0], points[1]) / 2 / aspectRatio[1]
            : 0;
        const xRadius = points.length >= 2
            ? gl_matrix__rspack_import_0/* .vec3.distance */.eR.Io(points[2], points[3]) / 2 / aspectRatio[0]
            : 0;
        const canvasCoordinates = points.map((p) => viewport.worldToCanvas(p));
        const corners = getEllipseCornersFromCanvasCoordinates(canvasCoordinates);
        const cornersInWorld = corners.map((corner) => viewport.canvasToWorld(corner));
        const normalizedViewUp = gl_matrix__rspack_import_0/* .vec3.fromValues */.eR.fA(viewUp[0], viewUp[1], viewUp[2]);
        gl_matrix__rspack_import_0/* .vec3.normalize */.eR.S8(normalizedViewUp, normalizedViewUp);
        const normalizedPlaneNormal = gl_matrix__rspack_import_0/* .vec3.fromValues */.eR.fA(viewPlaneNormal[0], viewPlaneNormal[1], viewPlaneNormal[2]);
        gl_matrix__rspack_import_0/* .vec3.normalize */.eR.S8(normalizedPlaneNormal, normalizedPlaneNormal);
        const viewRight = gl_matrix__rspack_import_0/* .vec3.create */.eR.vt();
        gl_matrix__rspack_import_0/* .vec3.cross */.eR.$A(viewRight, normalizedViewUp, normalizedPlaneNormal);
        gl_matrix__rspack_import_0/* .vec3.normalize */.eR.S8(viewRight, viewRight);
        const strokeCentersSource = operationData.strokePointsWorld &&
            operationData.strokePointsWorld.length > 0
            ? operationData.strokePointsWorld
            : [operationData.centerWorld];
        const strokeCenters = strokeCentersSource.map((point) => gl_matrix__rspack_import_0/* .vec3.clone */.eR.o8(point));
        const strokeCornersWorld = strokeCenters.flatMap((centerPoint) => createCircleCornersForCenter(centerPoint, normalizedViewUp, viewRight, yRadius, xRadius));
        const circleCornersIJK = strokeCornersWorld.map((world) => transformWorldToIndex(segmentationImageData, world));
        const boundsIJK = (0,_utilities_boundingBox_index_js__rspack_import_2.getBoundingBoxAroundShapeIJK)(circleCornersIJK, segmentationImageData.getDimensions());
        operationData.strokePointsWorld = strokeCenters;
        operationData.isInObject = createPointInEllipse(cornersInWorld, {
            strokePointsWorld: strokeCenters,
            segmentationImageData,
            xRadius,
            yRadius,
            aspectRatio,
        });
        operationData.isInObjectBoundsIJK = boundsIJK;
    },
};
function createPointInEllipse(cornersInWorld = [], options = {}) {
    if (!cornersInWorld || cornersInWorld.length !== 4) {
        throw new Error('createPointInEllipse: cornersInWorld must have 4 points');
    }
    const [topLeft, bottomRight, bottomLeft, topRight] = cornersInWorld;
    const aspectRatio = options.aspectRatio || [1, 1];
    const center = gl_matrix__rspack_import_0/* .vec3.create */.eR.vt();
    gl_matrix__rspack_import_0/* .vec3.add */.eR.WQ(center, topLeft, bottomRight);
    gl_matrix__rspack_import_0/* .vec3.scale */.eR.hs(center, center, 0.5);
    const majorAxisVec = gl_matrix__rspack_import_0/* .vec3.create */.eR.vt();
    gl_matrix__rspack_import_0/* .vec3.subtract */.eR.Re(majorAxisVec, topRight, topLeft);
    const originalRadius = gl_matrix__rspack_import_0/* .vec3.length */.eR.Bw(majorAxisVec) / 2;
    gl_matrix__rspack_import_0/* .vec3.normalize */.eR.S8(majorAxisVec, majorAxisVec);
    const minorAxisVec = gl_matrix__rspack_import_0/* .vec3.create */.eR.vt();
    gl_matrix__rspack_import_0/* .vec3.subtract */.eR.Re(minorAxisVec, bottomLeft, topLeft);
    gl_matrix__rspack_import_0/* .vec3.normalize */.eR.S8(minorAxisVec, minorAxisVec);
    const xRadius = originalRadius / aspectRatio[0];
    const yRadius = originalRadius / aspectRatio[1];
    const xRadiusForStroke = options.xRadius ?? xRadius;
    const yRadiusForStroke = options.yRadius ?? yRadius;
    const strokePredicate = createStrokePredicate(options.strokePointsWorld || [], xRadiusForStroke, yRadiusForStroke);
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
            return (0,_utilities_math_sphere_index_js__rspack_import_6/* .pointInSphere */.d)(sphereObj, worldPoint);
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
        const pointVec = gl_matrix__rspack_import_0/* .vec3.create */.eR.vt();
        gl_matrix__rspack_import_0/* .vec3.subtract */.eR.Re(pointVec, worldPoint, center);
        const x = gl_matrix__rspack_import_0/* .vec3.dot */.eR.Om(pointVec, majorAxisVec);
        const y = gl_matrix__rspack_import_0/* .vec3.dot */.eR.Om(pointVec, minorAxisVec);
        return (x * x) / (xRadius * xRadius) + (y * y) / (yRadius * yRadius) <= 1;
    };
}
const CIRCLE_STRATEGY = new _BrushStrategy_js__rspack_import_3/* ["default"] */.A('Circle', _compositions_index_js__rspack_import_5/* ["default"].regionFill */.A.regionFill, _compositions_index_js__rspack_import_5/* ["default"].setValue */.A.setValue, initializeCircle, _compositions_index_js__rspack_import_5/* ["default"].determineSegmentIndex */.A.determineSegmentIndex, _compositions_index_js__rspack_import_5/* ["default"].preview */.A.preview, _compositions_index_js__rspack_import_5/* ["default"].labelmapStatistics */.A.labelmapStatistics);
const CIRCLE_THRESHOLD_STRATEGY = new _BrushStrategy_js__rspack_import_3/* ["default"] */.A('CircleThreshold', _compositions_index_js__rspack_import_5/* ["default"].regionFill */.A.regionFill, _compositions_index_js__rspack_import_5/* ["default"].setValue */.A.setValue, initializeCircle, _compositions_index_js__rspack_import_5/* ["default"].determineSegmentIndex */.A.determineSegmentIndex, _compositions_index_js__rspack_import_5/* ["default"].dynamicThreshold */.A.dynamicThreshold, _compositions_index_js__rspack_import_5/* ["default"].threshold */.A.threshold, _compositions_index_js__rspack_import_5/* ["default"].preview */.A.preview, _compositions_index_js__rspack_import_5/* ["default"].islandRemoval */.A.islandRemoval, _compositions_index_js__rspack_import_5/* ["default"].labelmapStatistics */.A.labelmapStatistics);
const fillInsideCircle = CIRCLE_STRATEGY.strategyFunction;
const thresholdInsideCircle = CIRCLE_THRESHOLD_STRATEGY.strategyFunction;
function fillOutsideCircle() {
    throw new Error('Not yet implemented');
}



},
42289(__unused_rspack___webpack_module__, __unused_rspack___webpack_exports__, __webpack_require__) {
/* import */ var gl_matrix__rspack_import_0 = __webpack_require__(40230);
/* import */ var _cornerstonejs_core__rspack_import_1 = __webpack_require__(88479);
/* import */ var _utilities_boundingBox_index_js__rspack_import_2 = __webpack_require__(26111);
/* import */ var _utilities_getViewportICamera_js__rspack_import_3 = __webpack_require__(41891);
/* import */ var _BrushStrategy_js__rspack_import_4 = __webpack_require__(75639);
/* import */ var _enums_index_js__rspack_import_5 = __webpack_require__(53870);
/* import */ var _compositions_index_js__rspack_import_6 = __webpack_require__(30207);







const { transformWorldToIndex } = _cornerstonejs_core__rspack_import_1.utilities;
const initializeRectangle = {
    [_enums_index_js__rspack_import_5.StrategyCallbacks.Initialize]: (operationData) => {
        const { points, viewport, segmentationImageData, } = operationData;
        if (!points) {
            return;
        }
        const center = gl_matrix__rspack_import_0/* .vec3.fromValues */.eR.fA(0, 0, 0);
        points.forEach((point) => {
            gl_matrix__rspack_import_0/* .vec3.add */.eR.WQ(center, center, point);
        });
        gl_matrix__rspack_import_0/* .vec3.scale */.eR.hs(center, center, 1 / points.length);
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
    const boundsIJK = (0,_utilities_boundingBox_index_js__rspack_import_2.getBoundingBoxAroundShapeIJK)(rectangleCornersIJK, segmentationImageData.getDimensions());
    const [p0, p1, p2, p3] = points;
    const axisU = gl_matrix__rspack_import_0/* .vec3.create */.eR.vt();
    const axisV = gl_matrix__rspack_import_0/* .vec3.create */.eR.vt();
    gl_matrix__rspack_import_0/* .vec3.subtract */.eR.Re(axisU, p1, p0);
    gl_matrix__rspack_import_0/* .vec3.subtract */.eR.Re(axisV, p3, p0);
    const uLen = gl_matrix__rspack_import_0/* .vec3.length */.eR.Bw(axisU);
    const vLen = gl_matrix__rspack_import_0/* .vec3.length */.eR.Bw(axisV);
    gl_matrix__rspack_import_0/* .vec3.normalize */.eR.S8(axisU, axisU);
    gl_matrix__rspack_import_0/* .vec3.normalize */.eR.S8(axisV, axisV);
    const normal = gl_matrix__rspack_import_0/* .vec3.create */.eR.vt();
    gl_matrix__rspack_import_0/* .vec3.cross */.eR.$A(normal, axisU, axisV);
    gl_matrix__rspack_import_0/* .vec3.normalize */.eR.S8(normal, normal);
    const direction = segmentationImageData.getDirection();
    const spacing = segmentationImageData.getSpacing();
    const { viewPlaneNormal } = (0,_utilities_getViewportICamera_js__rspack_import_3/* ["default"] */.A)(viewport);
    const EPS = _cornerstonejs_core__rspack_import_1.utilities.getSpacingInNormalDirection({
        direction,
        spacing,
    }, viewPlaneNormal);
    const pointInShapeFn = (pointLPS) => {
        const v = gl_matrix__rspack_import_0/* .vec3.create */.eR.vt();
        gl_matrix__rspack_import_0/* .vec3.subtract */.eR.Re(v, pointLPS, p0);
        const u = gl_matrix__rspack_import_0/* .vec3.dot */.eR.Om(v, axisU);
        const vproj = gl_matrix__rspack_import_0/* .vec3.dot */.eR.Om(v, axisV);
        const d = Math.abs(gl_matrix__rspack_import_0/* .vec3.dot */.eR.Om(v, normal));
        return (u >= -EPS &&
            u <= uLen + EPS &&
            vproj >= -EPS &&
            vproj <= vLen + EPS &&
            d <= EPS);
    };
    return { boundsIJK, pointInShapeFn };
}
const RECTANGLE_STRATEGY = new _BrushStrategy_js__rspack_import_4/* ["default"] */.A('Rectangle', _compositions_index_js__rspack_import_6/* ["default"].regionFill */.A.regionFill, _compositions_index_js__rspack_import_6/* ["default"].setValue */.A.setValue, initializeRectangle, _compositions_index_js__rspack_import_6/* ["default"].determineSegmentIndex */.A.determineSegmentIndex, _compositions_index_js__rspack_import_6/* ["default"].preview */.A.preview, _compositions_index_js__rspack_import_6/* ["default"].labelmapStatistics */.A.labelmapStatistics);
const RECTANGLE_THRESHOLD_STRATEGY = new _BrushStrategy_js__rspack_import_4/* ["default"] */.A('RectangleThreshold', _compositions_index_js__rspack_import_6/* ["default"].regionFill */.A.regionFill, _compositions_index_js__rspack_import_6/* ["default"].setValue */.A.setValue, initializeRectangle, _compositions_index_js__rspack_import_6/* ["default"].determineSegmentIndex */.A.determineSegmentIndex, _compositions_index_js__rspack_import_6/* ["default"].dynamicThreshold */.A.dynamicThreshold, _compositions_index_js__rspack_import_6/* ["default"].threshold */.A.threshold, _compositions_index_js__rspack_import_6/* ["default"].preview */.A.preview, _compositions_index_js__rspack_import_6/* ["default"].islandRemoval */.A.islandRemoval, _compositions_index_js__rspack_import_6/* ["default"].labelmapStatistics */.A.labelmapStatistics);
const fillInsideRectangle = RECTANGLE_STRATEGY.strategyFunction;
const thresholdInsideRectangle = RECTANGLE_THRESHOLD_STRATEGY.strategyFunction;



},
62831(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  fillInsideCircle: () => (/* reexport safe */ _fillCircle_js__rspack_import_1.kr)
});
/* import */ var _fillRectangle_js__rspack_import_0 = __webpack_require__(42289);
/* import */ var _fillCircle_js__rspack_import_1 = __webpack_require__(55314);





},
67638(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  g: () => (getBoundingBoxAroundShapeIJK)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);

const { EPSILON } = _cornerstonejs_core__rspack_import_0.CONSTANTS;
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


},
26111(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  getBoundingBoxAroundShapeIJK: () => (/* reexport safe */ _getBoundingBoxAroundShape_js__rspack_import_1.g)
});
/* import */ var _extend2DBoundingBoxInViewAxis_js__rspack_import_0 = __webpack_require__(81231);
/* import */ var _getBoundingBoxAroundShape_js__rspack_import_1 = __webpack_require__(67638);
/* import */ var _snapIndexBounds_js__rspack_import_2 = __webpack_require__(66694);






},
81047(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  f: () => (bridgeSelfIntersectingPolyline)
});
/* import */ var _math_index_js__rspack_import_0 = __webpack_require__(44292);
/* import */ var _clipperBooleanOps_js__rspack_import_1 = __webpack_require__(99431);


const TOUCH_EPS = 1e-2;
const TOUCH_EPS_SQ = TOUCH_EPS * TOUCH_EPS;
function dist2(a, b) {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    return dx * dx + dy * dy;
}
function boxesWithinEps(a, b) {
    return (a.minX <= b.maxX + TOUCH_EPS &&
        b.minX <= a.maxX + TOUCH_EPS &&
        a.minY <= b.maxY + TOUCH_EPS &&
        b.minY <= a.maxY + TOUCH_EPS);
}
function ringsTouch(a, b) {
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
            if (dist2(a[i], b[j]) <= TOUCH_EPS_SQ) {
                return true;
            }
        }
    }
    return false;
}
function spliceTwoRings(a, b) {
    const bb = _math_index_js__rspack_import_0.polyline.getWindingDirection(b) !==
        _math_index_js__rspack_import_0.polyline.getWindingDirection(a)
        ? [...b].reverse()
        : b;
    let best = Infinity;
    let ai = 0;
    let bj = 0;
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < bb.length; j++) {
            const d = dist2(a[i], bb[j]);
            if (d < best) {
                best = d;
                ai = i;
                bj = j;
            }
        }
    }
    const loop = [...bb.slice(bj), ...bb.slice(0, bj)];
    return [...a.slice(0, ai + 1), ...loop, loop[0], ...a.slice(ai + 1)];
}
function groupTouchingOuters(outers) {
    const n = outers.length;
    const parent = Array.from({ length: n }, (_, i) => i);
    const find = (x) => {
        let root = x;
        while (parent[root] !== root) {
            root = parent[root];
        }
        while (parent[x] !== root) {
            const next = parent[x];
            parent[x] = root;
            x = next;
        }
        return root;
    };
    const union = (x, y) => {
        parent[find(x)] = find(y);
    };
    const boxes = outers.map((o) => _math_index_js__rspack_import_0.polyline.getAABB(o));
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (boxesWithinEps(boxes[i], boxes[j]) &&
                ringsTouch(outers[i], outers[j])) {
                union(i, j);
            }
        }
    }
    const groups = new Map();
    for (let i = 0; i < n; i++) {
        const root = find(i);
        const group = groups.get(root);
        if (group) {
            group.push(i);
        }
        else {
            groups.set(root, [i]);
        }
    }
    return [...groups.values()];
}
function unifyWeaklyConnectedPolygons(polygons) {
    if (polygons.length < 2) {
        return polygons;
    }
    const outers = polygons.map((p) => p.outer);
    const groups = groupTouchingOuters(outers);
    if (groups.length === polygons.length) {
        return polygons;
    }
    return groups.map((group) => {
        if (group.length === 1) {
            return polygons[group[0]];
        }
        let outer = polygons[group[0]].outer;
        for (let k = 1; k < group.length; k++) {
            outer = spliceTwoRings(outer, polygons[group[k]].outer);
        }
        const holes = group.flatMap((idx) => polygons[idx].holes ?? []);
        return holes.length ? { outer, holes } : { outer };
    });
}
function bridgeSelfIntersectingPolyline(line) {
    const polygons = (0,_clipperBooleanOps_js__rspack_import_1/* .splitSelfIntersections */.NE)(line);
    if (polygons.length === 0) {
        return line;
    }
    if (polygons.length === 1 && !polygons[0].holes?.length) {
        return line;
    }
    const unified = unifyWeaklyConnectedPolygons(polygons);
    const main = unified.reduce((largest, candidate) => _math_index_js__rspack_import_0.polyline.getArea(candidate.outer) >
        _math_index_js__rspack_import_0.polyline.getArea(largest.outer)
        ? candidate
        : largest);
    let outer = main.outer;
    for (const hole of main.holes ?? []) {
        outer = spliceTwoRings(outer, hole);
    }
    return outer;
}


},
42010(__unused_rspack___webpack_module__, __unused_rspack___webpack_exports__, __webpack_require__) {
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


},
67846(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  addContourSegmentationAnnotation: () => (/* reexport safe */ _addContourSegmentationAnnotation_js__rspack_import_5.V),
  createPolylineHole: () => (/* reexport safe */ _sharedOperations_js__rspack_import_10.rK),
  removeContourSegmentationAnnotation: () => (/* reexport safe */ _removeContourSegmentationAnnotation_js__rspack_import_6.M)
});
/* import */ var _areSameSegment_js__rspack_import_0 = __webpack_require__(65493);
/* import */ var _convertContourSegmentation_js__rspack_import_1 = __webpack_require__(42010);
/* import */ var _copyAnnotation_js__rspack_import_2 = __webpack_require__(89020);
/* import */ var _logicalOperators_js__rspack_import_3 = __webpack_require__(38393);
/* import */ var _isContourSegmentationAnnotation_js__rspack_import_4 = __webpack_require__(43631);
/* import */ var _addContourSegmentationAnnotation_js__rspack_import_5 = __webpack_require__(45112);
/* import */ var _removeContourSegmentationAnnotation_js__rspack_import_6 = __webpack_require__(13127);
/* import */ var _getIntersectingAnnotations_js__rspack_import_7 = __webpack_require__(45499);
/* import */ var _mergeMultipleAnnotations_js__rspack_import_8 = __webpack_require__(72598);
/* import */ var _contourSegmentationOperation_js__rspack_import_9 = __webpack_require__(97021);
/* import */ var _sharedOperations_js__rspack_import_10 = __webpack_require__(77119);
/* import */ var _polylineUnify_js__rspack_import_11 = __webpack_require__(2797);
/* import */ var _polylineSubtract_js__rspack_import_12 = __webpack_require__(66856);
/* import */ var _polylineIntersect_js__rspack_import_13 = __webpack_require__(6472);
/* import */ var _polylineXor_js__rspack_import_14 = __webpack_require__(88603);


















},
52295(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  d1: () => (findContoursFromReducedSet)
});
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
/* unused export default */ var __rspack_default_export = ((/* unused pure expression or super */ null && ({
    findContours,
    findContoursFromReducedSet,
})));


},
55122(__unused_rspack___webpack_module__, __unused_rspack___webpack_exports__, __webpack_require__) {
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
        const distance = vec3.squaredDistance(point, handle);
        if (distance < closestDistance) {
            closestDistance = distance;
            return testIndex;
        }
        return closestIndex;
    }, -1);
}


},
65234(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  d6: () => (defaultAreaGetTextLines)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);

const { isEqual } = _cornerstonejs_core__rspack_import_0.utilities;
const AREA_METRICS = [
    { name: 'Area', attribute: 'area', unitAttribute: 'areaUnit' },
    { name: 'Mean', attribute: 'mean', unitAttribute: 'modalityUnit' },
    { name: 'Max', attribute: 'max', unitAttribute: 'modalityUnit' },
    { name: 'Min', attribute: 'min', unitAttribute: 'modalityUnit' },
    { name: 'Std Dev', attribute: 'stdDev', unitAttribute: 'modalityUnit' },
];
function createGetTextLines(metrics) {
    return function (data, targetId) {
        const targetIds = Array.isArray(targetId) ? targetId : [targetId];
        const cachedVolumeStats = targetIds
            .map((id) => data.cachedStats[id])
            .filter((stats) => metrics.some(({ attribute }) => stats?.[attribute] !== undefined && stats?.[attribute] !== null));
        if (!cachedVolumeStats.length) {
            return;
        }
        const textLines = [];
        for (const metric of metrics) {
            pushResult(textLines, createMultiResultLine(cachedVolumeStats, targetIds, metric.name, metric.attribute, metric.unitAttribute));
        }
        return textLines;
    };
}
const defaultAreaGetTextLines = createGetTextLines(AREA_METRICS);
function pushResult(textLines, value) {
    if (value) {
        textLines.push(value);
    }
}
function createMultiResultLine(cachedVolumeStats, targetIds, name, attribute, unitAttribute) {
    const result = [`${name}:`];
    let lastValue = null;
    let lastUnit = null;
    for (const stats of cachedVolumeStats) {
        if (!_cornerstonejs_core__rspack_import_0.utilities.isNumber(stats?.[attribute])) {
            continue;
        }
        const attributeValue = stats[attribute];
        const unitValue = stats[unitAttribute];
        if (isEqual(lastValue, attributeValue) && lastUnit === unitValue) {
            continue;
        }
        result.push(`${_cornerstonejs_core__rspack_import_0.utilities.roundNumber(attributeValue)} ${unitValue}`);
        lastValue = attributeValue;
        lastUnit = unitValue;
    }
    if (result.length <= 1) {
        return;
    }
    return result.join(' ');
}


},
85372(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  getTextBoxCoordsCanvas: () => (/* reexport safe */ _getTextBoxCoordsCanvas_js__rspack_import_0.A)
});
/* import */ var _getTextBoxCoordsCanvas_js__rspack_import_0 = __webpack_require__(72);




},
3675(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Op: () => (getCalibratedLengthUnitsAndScale)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);

const { CalibrationTypes } = _cornerstonejs_core__rspack_import_0.Enums;
const PIXEL_UNITS = 'px';
const VOXEL_UNITS = 'voxels';
const SUPPORTED_REGION_DATA_TYPES = [
    1,
    2,
    3,
    4,
];
const SUPPORTED_PROBE_VARIANT = [
    '4,3',
    '4,7',
    '4,-1',
];
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
    [-1]: 'mV',
};
const EPS = 1e-3;
const SQUARE = '\xb2';
const types = [
    CalibrationTypes.ERMF,
    CalibrationTypes.USER,
    CalibrationTypes.ERROR,
    CalibrationTypes.PROJECTION,
    CalibrationTypes.CALIBRATED,
    CalibrationTypes.UNKNOWN,
];
const getCalibratedLengthUnitsAndScale = (image, handles) => {
    const { calibration, hasPixelSpacing, spacing = [1, 1, 1] } = image;
    let unit = hasPixelSpacing ? 'mm' : PIXEL_UNITS;
    const volumeUnit = hasPixelSpacing ? 'mm\xb3' : VOXEL_UNITS;
    let areaUnit = unit + SQUARE;
    const baseScale = calibration?.scale || 1;
    let scale = baseScale / (calibration?.columnPixelSpacing || spacing[0]);
    let scaleY = baseScale / (calibration?.rowPixelSpacing || spacing[1]);
    let scaleZ = baseScale / spacing[2];
    let calibrationType = '';
    if (!calibration ||
        (!calibration.type && !calibration.sequenceOfUltrasoundRegions)) {
        return { unit, areaUnit, scale, scaleY, scaleZ, volumeUnit };
    }
    if (types.includes(calibration?.type)) {
        calibrationType = calibration.type;
    }
    if (calibration.type === CalibrationTypes.UNCALIBRATED) {
        return {
            unit: PIXEL_UNITS,
            areaUnit: PIXEL_UNITS + SQUARE,
            scale,
            scaleY,
            scaleZ,
            volumeUnit: VOXEL_UNITS,
        };
    }
    if (calibration.sequenceOfUltrasoundRegions) {
        const region = calibration.sequenceOfUltrasoundRegions.find((region) => handles.every((handle) => handle[0] >= region.regionLocationMinX0 &&
            handle[0] <= region.regionLocationMaxX1 &&
            handle[1] >= region.regionLocationMinY0 &&
            handle[1] <= region.regionLocationMaxY1) &&
            (SUPPORTED_REGION_DATA_TYPES.includes(region.regionDataType) ||
                SUPPORTED_PROBE_VARIANT.includes(`${region.physicalUnitsXDirection},${region.physicalUnitsYDirection}`)));
        if (region &&
            region.physicalUnitsXDirection === region.physicalUnitsYDirection) {
            const physicalDeltaX = Math.abs(region.physicalDeltaX);
            const physicalDeltaY = Math.abs(region.physicalDeltaY);
            scale = 1 / physicalDeltaX;
            scaleY = 1 / physicalDeltaY;
            calibrationType = 'US Region';
            unit = UNIT_MAPPING[region.physicalUnitsXDirection] || 'unknown';
            areaUnit = unit + SQUARE;
        }
        else if (region && region.physicalUnitsYDirection === -1) {
            const physicalDeltaX = Math.abs(region.physicalDeltaX);
            const physicalDeltaY = Math.abs(region.physicalDeltaY);
            scale = 1 / physicalDeltaX;
            scaleY = 1 / physicalDeltaY;
            calibrationType = 'ECG Region';
            unit =
                UNIT_MAPPING[region.physicalUnitsXDirection] ||
                    UNIT_MAPPING[region.physicalUnitsYDirection] ||
                    'unknown';
            areaUnit =
                (UNIT_MAPPING[region.physicalUnitsYDirection] || 'px') + SQUARE;
        }
    }
    else if (calibration.scale) {
        scale = calibration.scale;
    }
    return {
        unit: unit + (calibrationType ? ` ${calibrationType}` : ''),
        areaUnit: areaUnit + (calibrationType ? ` ${calibrationType}` : ''),
        volumeUnit: volumeUnit + (calibrationType ? ` ${calibrationType}` : ''),
        scale,
        scaleY,
        scaleZ,
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
        const supportedRegionsMetadata = calibration.sequenceOfUltrasoundRegions.filter((region) => (SUPPORTED_REGION_DATA_TYPES.includes(region.regionDataType) ||
            SUPPORTED_PROBE_VARIANT.includes(`${region.physicalUnitsXDirection},${region.physicalUnitsYDirection}`)) &&
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
        calibrationType =
            region.physicalUnitsYDirection === -1 ? 'ECG Region' : 'US Region';
        values = [xValue, yValue];
        units = [
            UNIT_MAPPING[region.physicalUnitsXDirection] ?? 'unknown',
            UNIT_MAPPING[region.physicalUnitsYDirection] ?? 'unknown',
        ];
    }
    return {
        units,
        values,
        calibrationType,
    };
};
const getCalibratedAspect = (image) => image.calibration?.aspect || 1;



},
95009(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
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
70818() {
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


},
19608(__unused_rspack___webpack_module__, __unused_rspack___webpack_exports__, __webpack_require__) {
/* import */ var gl_matrix__rspack_import_0 = __webpack_require__(40230);

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


},
58089(__unused_rspack___webpack_module__, __unused_rspack___webpack_exports__, __webpack_require__) {

// UNUSED EXPORTS: getCanvasCircleCorners, getCanvasCircleRadius

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/point/index.js + 1 modules
var point = __webpack_require__(71659);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/circle/getCanvasCircleRadius.js

function getCanvasCircleRadius(circleCanvasPoints) {
    const [center, end] = circleCanvasPoints;
    return distanceToPoint(center, end);
}

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/circle/getCanvasCircleCorners.js

function getCanvasCircleCorners(circleCanvasPoints) {
    const [center, end] = circleCanvasPoints;
    const radius = distanceToPoint(center, end);
    const topLeft = [center[0] - radius, center[1] - radius];
    const bottomRight = [center[0] + radius, center[1] + radius];
    return [topLeft, bottomRight];
}

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/circle/index.js





},
3782() {

// UNUSED EXPORTS: getCanvasEllipseCorners, pointInEllipse, precalculatePointInEllipse

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/ellipse/pointInEllipse.js
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


;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/ellipse/getCanvasEllipseCorners.js
function getCanvasEllipseCorners(ellipseCanvasPoints) {
    const [bottom, top, left, right] = ellipseCanvasPoints;
    const topLeft = [left[0], top[1]];
    const bottomRight = [right[0], bottom[1]];
    return [topLeft, bottomRight];
}

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/ellipse/index.js





},
44292(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  point: () => (/* reexport */ point),
  polyline: () => (/* reexport */ polyline)
});

// UNUSED EXPORTS: BasicStatsCalculator, aabb, angle, circle, ellipse, lineSegment, rectangle, vec2

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/aabb/intersectAABB.js
var intersectAABB = __webpack_require__(50492);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/aabb/distanceToPoint.js
var distanceToPoint = __webpack_require__(60327);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/aabb/distanceToPointSquared.js
var distanceToPointSquared = __webpack_require__(70818);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/aabb/index.js




// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/basic/index.js
var basic = __webpack_require__(7053);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/circle/index.js + 2 modules
var circle = __webpack_require__(58089);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/ellipse/index.js + 2 modules
var ellipse = __webpack_require__(3782);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/line/index.js
var line = __webpack_require__(84091);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/point/index.js + 1 modules
var point = __webpack_require__(71659);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/index.js + 1 modules
var polyline = __webpack_require__(52546);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/rectangle/index.js
var rectangle = __webpack_require__(34706);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/vec2/index.js
var vec2 = __webpack_require__(2061);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/angle/index.js
var angle = __webpack_require__(79616);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/index.js













},
84091(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  distanceToPoint: () => (/* reexport safe */ _distanceToPoint_js__rspack_import_0.A),
  distanceToPointSquared: () => (/* reexport safe */ _distanceToPointSquared_js__rspack_import_1.A),
  intersectLine: () => (/* reexport safe */ _intersectLine_js__rspack_import_3.A),
  isPointOnLineSegment: () => (/* reexport safe */ _isPointOnLineSegment_js__rspack_import_4.A)
});
/* import */ var _distanceToPoint_js__rspack_import_0 = __webpack_require__(8463);
/* import */ var _distanceToPointSquared_js__rspack_import_1 = __webpack_require__(29850);
/* import */ var _distanceToPointSquaredInfo_js__rspack_import_2 = __webpack_require__(35818);
/* import */ var _intersectLine_js__rspack_import_3 = __webpack_require__(80428);
/* import */ var _isPointOnLineSegment_js__rspack_import_4 = __webpack_require__(3449);








},
71659(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  distanceToPoint: () => (/* reexport */ distanceToPoint/* ["default"] */.A),
  distanceToPointSquared: () => (/* reexport */ distanceToPointSquared/* ["default"] */.A)
});

// UNUSED EXPORTS: mirror

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/point/distanceToPoint.js
var distanceToPoint = __webpack_require__(82745);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/point/distanceToPointSquared.js
var distanceToPointSquared = __webpack_require__(21104);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/point/mirror.js
function mirror(mirrorPoint, staticPoint) {
    const [x1, y1] = mirrorPoint;
    const [x2, y2] = staticPoint;
    const newX = 2 * x2 - x1;
    const newY = 2 * y2 - y1;
    return [newX, newY];
}

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/point/index.js





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
52546(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  addCanvasPointsToArray: () => (/* reexport */ addCanvasPointsToArray/* ["default"] */.A),
  decimate: () => (/* reexport */ decimate/* ["default"] */.A),
  getAABB: () => (/* reexport */ getAABB/* ["default"] */.A),
  getArea: () => (/* reexport */ getArea/* ["default"] */.A),
  getFirstLineSegmentIntersectionIndexes: () => (/* reexport */ getFirstLineSegmentIntersectionIndexes/* ["default"] */.A),
  getLineSegmentIntersectionsCoordinates: () => (/* reexport */ getLineSegmentIntersectionsCoordinates/* ["default"] */.A),
  getSubPixelSpacingAndXYDirections: () => (/* reexport */ getSubPixelSpacingAndXYDirections/* ["default"] */.A),
  getWindingDirection: () => (/* reexport */ getWindingDirection/* ["default"] */.A),
  isPointInsidePolyline3D: () => (/* reexport */ isPointInsidePolyline3D/* .isPointInsidePolyline3D */.i),
  pointCanProjectOnLine: () => (/* reexport */ pointCanProjectOnLine/* ["default"] */.A),
  pointsAreWithinCloseContourProximity: () => (/* reexport */ pointsAreWithinCloseContourProximity/* ["default"] */.A)
});

// UNUSED EXPORTS: arePolylinesIdentical, containsPoint, containsPoints, convexHull, getClosestLineSegmentIntersection, getLineSegmentIntersectionsIndexes, getNormal2, getNormal3, getSignedArea, intersectPolyline, intersectPolylines, isClosed, mergePolylines, projectTo2D, subtractPolylines

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/isClosed.js
var isClosed = __webpack_require__(19977);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/containsPoint.js
var containsPoint = __webpack_require__(75864);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/containsPoints.js
var containsPoints = __webpack_require__(83783);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/getAABB.js
var getAABB = __webpack_require__(99875);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/getArea.js
var getArea = __webpack_require__(44116);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/getSignedArea.js
var getSignedArea = __webpack_require__(77360);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/getWindingDirection.js
var getWindingDirection = __webpack_require__(77866);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/getNormal3.js
var getNormal3 = __webpack_require__(47825);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/getNormal2.js
var getNormal2 = __webpack_require__(79938);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/subtractPolylines.js
var subtractPolylines = __webpack_require__(16284);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/intersectPolylines.js
var intersectPolylines = __webpack_require__(68459);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/combinePolyline.js
var combinePolyline = __webpack_require__(79328);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/intersectPolyline.js
var intersectPolyline = __webpack_require__(31812);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/decimate.js
var decimate = __webpack_require__(75319);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/getFirstLineSegmentIntersectionIndexes.js
var getFirstLineSegmentIntersectionIndexes = __webpack_require__(67845);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/getLineSegmentIntersectionsIndexes.js
var getLineSegmentIntersectionsIndexes = __webpack_require__(41096);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/getLineSegmentIntersectionsCoordinates.js
var getLineSegmentIntersectionsCoordinates = __webpack_require__(23839);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/getClosestLineSegmentIntersection.js
var getClosestLineSegmentIntersection = __webpack_require__(5338);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/getSubPixelSpacingAndXYDirections.js
var getSubPixelSpacingAndXYDirections = __webpack_require__(34552);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/pointsAreWithinCloseContourProximity.js
var pointsAreWithinCloseContourProximity = __webpack_require__(11674);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/addCanvasPointsToArray.js
var addCanvasPointsToArray = __webpack_require__(62131);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/pointCanProjectOnLine.js
var pointCanProjectOnLine = __webpack_require__(73283);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/isPointInsidePolyline3D.js
var isPointInsidePolyline3D = __webpack_require__(59872);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/projectTo2D.js
var projectTo2D = __webpack_require__(62339);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/convexHull.js
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

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/arePolylinesIdentical.js
var arePolylinesIdentical = __webpack_require__(71303);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/index.js





























},
10132() {
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


},
33333(__unused_rspack___webpack_module__, __unused_rspack___webpack_exports__, __webpack_require__) {
/* import */ var gl_matrix__rspack_import_0 = __webpack_require__(40230);

function getWorldWidthAndHeightFromTwoPoints(viewPlaneNormal, viewUp, worldPos1, worldPos2) {
    const viewRight = vec3.create();
    vec3.cross(viewRight, viewUp, viewPlaneNormal);
    const pos1 = vec3.fromValues(...worldPos1);
    const pos2 = vec3.fromValues(...worldPos2);
    const diagonal = vec3.create();
    vec3.subtract(diagonal, pos1, pos2);
    const diagonalLength = vec3.length(diagonal);
    if (diagonalLength < 0.0001) {
        return { worldWidth: 0, worldHeight: 0 };
    }
    const cosTheta = vec3.dot(diagonal, viewRight) / (diagonalLength * vec3.length(viewRight));
    const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
    const worldWidth = sinTheta * diagonalLength;
    const worldHeight = cosTheta * diagonalLength;
    return { worldWidth, worldHeight };
}


},
45909(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  filterAnnotationsForDisplay: () => (/* reexport */ planar_filterAnnotationsForDisplay/* ["default"] */.A),
  filterAnnotationsWithinSamePlane: () => (/* reexport */ filterAnnotationsWithinPlane/* .filterAnnotationsWithinSamePlane */.W)
});

// UNUSED EXPORTS: default, filterAnnotationsWithinSlice, getPointInLineOfSightWithCriteria, getPointsInLineOfSight, getWorldWidthAndHeightFromCorners, getWorldWidthAndHeightFromTwoPoints, isPlaneIntersectingAABB

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/planar/filterAnnotationsWithinSlice.js
var planar_filterAnnotationsWithinSlice = __webpack_require__(90947);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/planar/getWorldWidthAndHeightFromCorners.js
var planar_getWorldWidthAndHeightFromCorners = __webpack_require__(86394);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/planar/filterAnnotationsForDisplay.js
var planar_filterAnnotationsForDisplay = __webpack_require__(40349);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/planar/getWorldWidthAndHeightFromTwoPoints.js
var planar_getWorldWidthAndHeightFromTwoPoints = __webpack_require__(33333);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(88479);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/planar/getPointInLineOfSightWithCriteria.js

function getPointInLineOfSightWithCriteria_getPointInLineOfSightWithCriteria(viewport, worldPos, targetVolumeId, criteriaFunction, stepSize = 0.25) {
    const points = getPointInLineOfSightWithCriteria_getPointsInLineOfSight(viewport, worldPos, {
        targetVolumeId,
        stepSize,
    });
    let pickedPoint;
    for (const point of points) {
        const intensity = viewport.getIntensityFromWorld(point);
        const pointToPick = criteriaFunction(intensity, point);
        if (pointToPick) {
            pickedPoint = pointToPick;
        }
    }
    return pickedPoint;
}
function getPointInLineOfSightWithCriteria_getPointsInLineOfSight(viewport, worldPos, { targetVolumeId, stepSize }) {
    const camera = viewport.getCamera();
    const { viewPlaneNormal: normalDirection } = camera;
    const { spacingInNormalDirection } = csUtils.getTargetVolumeAndSpacingInNormalDir(viewport, camera, targetVolumeId);
    const step = spacingInNormalDirection * stepSize || 1;
    const bounds = viewport.getBounds();
    const points = [];
    let currentPos = [...worldPos];
    while (_inBounds(currentPos, bounds)) {
        points.push([...currentPos]);
        currentPos[0] += normalDirection[0] * step;
        currentPos[1] += normalDirection[1] * step;
        currentPos[2] += normalDirection[2] * step;
    }
    currentPos = [...worldPos];
    while (_inBounds(currentPos, bounds)) {
        points.push([...currentPos]);
        currentPos[0] -= normalDirection[0] * step;
        currentPos[1] -= normalDirection[1] * step;
        currentPos[2] -= normalDirection[2] * step;
    }
    return points;
}
const _inBounds = function (point, bounds) {
    const [xMin, xMax, yMin, yMax, zMin, zMax] = bounds;
    const padding = 10;
    return (point[0] > xMin + padding &&
        point[0] < xMax - padding &&
        point[1] > yMin + padding &&
        point[1] < yMax - padding &&
        point[2] > zMin + padding &&
        point[2] < zMax - padding);
};

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/planar/isPlaneIntersectingAABB.js
var planar_isPlaneIntersectingAABB = __webpack_require__(20601);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/planar/filterAnnotationsWithinPlane.js
var filterAnnotationsWithinPlane = __webpack_require__(2023);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/planar/index.js







/* export default */ const planar = ((/* unused pure expression or super */ null && ({
    filterAnnotationsWithinSlice,
    getWorldWidthAndHeightFromCorners,
    getWorldWidthAndHeightFromTwoPoints,
    filterAnnotationsForDisplay,
    getPointInLineOfSightWithCriteria,
    isPlaneIntersectingAABB,
    filterAnnotationsWithinSamePlane,
    getPointsInLineOfSight,
})));



},
20601(__unused_rspack___webpack_module__, __unused_rspack___webpack_exports__, __webpack_require__) {
/* import */ var gl_matrix__rspack_import_0 = __webpack_require__(40230);

const isPlaneIntersectingAABB = (origin, normal, minX, minY, minZ, maxX, maxY, maxZ) => {
    const vertices = [
        vec3.fromValues(minX, minY, minZ),
        vec3.fromValues(maxX, minY, minZ),
        vec3.fromValues(minX, maxY, minZ),
        vec3.fromValues(maxX, maxY, minZ),
        vec3.fromValues(minX, minY, maxZ),
        vec3.fromValues(maxX, minY, maxZ),
        vec3.fromValues(minX, maxY, maxZ),
        vec3.fromValues(maxX, maxY, maxZ),
    ];
    const normalVec = vec3.fromValues(normal[0], normal[1], normal[2]);
    const originVec = vec3.fromValues(origin[0], origin[1], origin[2]);
    const planeDistance = -vec3.dot(normalVec, originVec);
    let initialSign = null;
    for (const vertex of vertices) {
        const distance = vec3.dot(normalVec, vertex) + planeDistance;
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
20810(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  H: () => (createBidirectionalForSlice)
});
/* import */ var gl_matrix__rspack_import_0 = __webpack_require__(40230);
/* import */ var _isLineInSegment_js__rspack_import_1 = __webpack_require__(35262);


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
            const distance2 = gl_matrix__rspack_import_0/* .vec3.sqrDist */.eR.lo(point1, point2);
            if (distance2 < maxMajor) {
                continue;
            }
            if (distance2 - EPSILON < maxMajor + EPSILON && maxMajorPoints) {
                continue;
            }
            if (!isInSegment.testCenter(point1, point2)) {
                continue;
            }
            if (!(0,_isLineInSegment_js__rspack_import_1/* .isLineInSegment */.pW)(point1, point2, isInSegment)) {
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
    const unitMajor = gl_matrix__rspack_import_0/* .vec3.sub */.eR.jb(gl_matrix__rspack_import_0/* .vec3.create */.eR.vt(), handle0, handle1);
    gl_matrix__rspack_import_0/* .vec3.scale */.eR.hs(unitMajor, unitMajor, 1 / maxMajor);
    let maxMinorPoints;
    for (let index1 = 0; index1 < points.length; index1++) {
        for (let index2 = index1 + 1; index2 < points.length; index2++) {
            const point1 = points[index1];
            const point2 = points[index2];
            const distance2 = gl_matrix__rspack_import_0/* .vec3.sqrDist */.eR.lo(point1, point2);
            if (distance2 <= maxMinor) {
                continue;
            }
            const delta = gl_matrix__rspack_import_0/* .vec3.sub */.eR.jb(gl_matrix__rspack_import_0/* .vec3.create */.eR.vt(), point1, point2);
            const dot = Math.abs(gl_matrix__rspack_import_0/* .vec3.dot */.eR.Om(delta, unitMajor)) / Math.sqrt(distance2);
            if (dot > EPSILON) {
                continue;
            }
            if (!isInSegment.testCenter(point1, point2)) {
                continue;
            }
            if (!(0,_isLineInSegment_js__rspack_import_1/* .isLineInSegment */.pW)(point1, point2, isInSegment)) {
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


},
91662(__unused_rspack___webpack_module__, __unused_rspack___webpack_exports__, __webpack_require__) {
/* import */ var _store_ToolGroupManager_index_js__rspack_import_0 = __webpack_require__(72314);
/* import */ var _tools_segmentation_BrushTool_js__rspack_import_1 = __webpack_require__(70947);


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


},
90389(__unused_rspack___webpack_module__, __unused_rspack___webpack_exports__, __webpack_require__) {
/* import */ var _store_ToolGroupManager_index_js__rspack_import_0 = __webpack_require__(72314);
/* import */ var _triggerAnnotationRenderForViewportIds_js__rspack_import_1 = __webpack_require__(85321);
/* import */ var _getBrushToolInstances_js__rspack_import_2 = __webpack_require__(91662);



function invalidateBrushCursor(toolGroupId) {
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


},
35262(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  On: () => (createIsInSegmentMetadata),
  pW: () => (isLineInSegment)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var gl_matrix__rspack_import_1 = __webpack_require__(40230);


function isLineInSegment(point1, point2, isInSegment) {
    const ijk1 = isInSegment.toIJK(point1);
    const ijk2 = isInSegment.toIJK(point2);
    const testPoint = gl_matrix__rspack_import_1/* .vec3.create */.eR.vt();
    const { testIJK } = isInSegment;
    const delta = gl_matrix__rspack_import_1/* .vec3.sub */.eR.jb(gl_matrix__rspack_import_1/* .vec3.create */.eR.vt(), ijk1, ijk2);
    const testSize = Math.round(Math.max(...delta.map(Math.abs)));
    if (testSize < 2) {
        return true;
    }
    const unitDelta = gl_matrix__rspack_import_1/* .vec3.scale */.eR.hs(gl_matrix__rspack_import_1/* .vec3.create */.eR.vt(), delta, 1 / testSize);
    for (let i = 1; i < testSize; i++) {
        gl_matrix__rspack_import_1/* .vec3.scaleAndAdd */.eR.Ln(testPoint, ijk2, unitDelta, i);
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
            const point = gl_matrix__rspack_import_1/* .vec3.add */.eR.WQ(gl_matrix__rspack_import_1/* .vec3.create */.eR.vt(), point1, point2).map((it) => it / 2);
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



},
29827(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (IslandRemoval)
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
42692(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  HM: () => (setSegmentationDirty)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _boundingBox_getBoundingBoxAroundShape_js__rspack_import_1 = __webpack_require__(67638);


const equalsCheck = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
};
function getVoxelOverlap(imageData, dimensions, voxelSpacing, voxelCenter) {
    const halfSpacingX = voxelSpacing[0] / 2;
    const halfSpacingY = voxelSpacing[1] / 2;
    const halfSpacingZ = voxelSpacing[2] / 2;
    const voxelCornersIJK = new Array(8);
    voxelCornersIJK[0] = csUtils.transformWorldToIndex(imageData, [
        voxelCenter[0] - halfSpacingX,
        voxelCenter[1] - halfSpacingY,
        voxelCenter[2] - halfSpacingZ,
    ]);
    const offsets = [
        [1, -1, -1],
        [-1, 1, -1],
        [1, 1, -1],
        [-1, -1, 1],
        [1, -1, 1],
        [-1, 1, 1],
        [1, 1, 1],
    ];
    for (let i = 0; i < 7; i++) {
        const [xOff, yOff, zOff] = offsets[i];
        voxelCornersIJK[i + 1] = csUtils.transformWorldToIndex(imageData, [
            voxelCenter[0] + xOff * halfSpacingX,
            voxelCenter[1] + yOff * halfSpacingY,
            voxelCenter[2] + zOff * halfSpacingZ,
        ]);
    }
    return getBoundingBoxAroundShapeIJK(voxelCornersIJK, dimensions);
}
function processVolumes(segmentationVolume, thresholdVolumeInformation) {
    const { spacing: segmentationSpacing } = segmentationVolume;
    const scalarDataLength = segmentationVolume.voxelManager.getScalarDataLength();
    const volumeInfoList = [];
    let baseVolumeIdx = 0;
    for (let i = 0; i < thresholdVolumeInformation.length; i++) {
        const { imageData, spacing, dimensions, voxelManager } = thresholdVolumeInformation[i].volume;
        const volumeSize = thresholdVolumeInformation[i].volume.voxelManager.getScalarDataLength();
        if (volumeSize === scalarDataLength &&
            equalsCheck(spacing, segmentationSpacing)) {
            baseVolumeIdx = i;
        }
        const lower = thresholdVolumeInformation[i].lower;
        const upper = thresholdVolumeInformation[i].upper;
        volumeInfoList.push({
            imageData,
            lower,
            upper,
            spacing,
            dimensions,
            volumeSize,
            voxelManager,
        });
    }
    return {
        volumeInfoList,
        baseVolumeIdx,
    };
}
const segmentIndicesCache = new Map();
const setSegmentationDirty = (segmentationId) => {
    const cached = segmentIndicesCache.get(segmentationId);
    if (cached) {
        cached.isDirty = true;
    }
};
const setSegmentationClean = (segmentationId) => {
    const cached = segmentIndicesCache.get(segmentationId);
    if (cached) {
        cached.isDirty = false;
    }
};
const getCachedSegmentIndices = (segmentationId) => {
    const cached = segmentIndicesCache.get(segmentationId);
    if (cached && !cached.isDirty) {
        return cached.indices;
    }
    return null;
};
const setCachedSegmentIndices = (segmentationId, indices) => {
    segmentIndicesCache.set(segmentationId, { indices, isDirty: false });
};


},
70208(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  _: () => (triggerAnnotationRenderForToolGroupIds)
});
/* import */ var _cornerstonejs_core__rspack_import_0 = __webpack_require__(88479);
/* import */ var _triggerAnnotationRender_js__rspack_import_1 = __webpack_require__(36420);
/* import */ var _store_ToolGroupManager_index_js__rspack_import_2 = __webpack_require__(72314);



function triggerAnnotationRenderForToolGroupIds(toolGroupIds) {
    toolGroupIds.forEach((toolGroupId) => {
        const toolGroup = (0,_store_ToolGroupManager_index_js__rspack_import_2.getToolGroup)(toolGroupId);
        if (!toolGroup) {
            console.warn(`ToolGroup not available for ${toolGroupId}`);
            return;
        }
        const viewportsInfo = toolGroup.getViewportsInfo();
        viewportsInfo.forEach((viewportInfo) => {
            const { renderingEngineId, viewportId } = viewportInfo;
            const renderingEngine = (0,_cornerstonejs_core__rspack_import_0.getRenderingEngine)(renderingEngineId);
            if (!renderingEngine) {
                console.warn(`RenderingEngine not available for ${renderingEngineId}`);
                return;
            }
            const viewport = renderingEngine.getViewport(viewportId);
            (0,_triggerAnnotationRender_js__rspack_import_1/* ["default"] */.A)(viewport.element);
        });
    });
}
/* unused export default */ var __rspack_default_export = ((/* unused pure expression or super */ null && (triggerAnnotationRenderForToolGroupIds)));


},
85321(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
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
68877(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  hz: () => (viewportSupportsImageSlices)
});
function viewportHasMethod(viewport, method) {
    return (typeof viewport?.[method] ===
        'function');
}
function viewportSupportsImageSlices(viewport) {
    return (viewportHasMethod(viewport, 'getCurrentImageId') &&
        viewportHasMethod(viewport, 'getCurrentImageIdIndex') &&
        viewportHasMethod(viewport, 'getImageIds') &&
        viewportHasMethod(viewport, 'hasImageURI'));
}
function viewportSupportsStackCompatibility(viewport) {
    return (viewportSupportsImageSlices(viewport) &&
        viewportHasMethod(viewport, 'setStack'));
}
function viewportSupportsStackCalibration(viewport) {
    return (viewportSupportsImageSlices(viewport) &&
        viewportHasMethod(viewport, 'calibrateSpacing'));
}


},
61307(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  getViewportIdsWithToolToRender: () => (/* reexport safe */ _getViewportIdsWithToolToRender_js__rspack_import_2.A)
});
/* import */ var _filterViewportsWithFrameOfReferenceUID_js__rspack_import_0 = __webpack_require__(76509);
/* import */ var _filterViewportsWithToolEnabled_js__rspack_import_1 = __webpack_require__(76183);
/* import */ var _getViewportIdsWithToolToRender_js__rspack_import_2 = __webpack_require__(51672);
/* import */ var _filterViewportsWithParallelNormals_js__rspack_import_3 = __webpack_require__(92021);







},
79338(__unused_rspack___webpack_module__, __unused_rspack___webpack_exports__, __webpack_require__) {

// EXTERNAL MODULE: ../../../node_modules/comlink/dist/esm/comlink.mjs
var comlink = __webpack_require__(99178);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(88479);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/SegmentStatsCalculator.js
var SegmentStatsCalculator = __webpack_require__(25086);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/thresholdVolumeByRange.js
var thresholdVolumeByRange = __webpack_require__(12775);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/rectangleROIThresholdVolumeByRange.js
var rectangleROIThresholdVolumeByRange = __webpack_require__(29898);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/createMergedLabelmapForIndex.js
var createMergedLabelmapForIndex = __webpack_require__(76891);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/createLabelmapVolumeForViewport.js
var createLabelmapVolumeForViewport = __webpack_require__(49791);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js + 3 modules
var enums = __webpack_require__(53870);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getSegmentation.js
var segmentation_getSegmentation = __webpack_require__(99212);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/getSegmentationRepresentation.js
var getSegmentationRepresentation = __webpack_require__(54869);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/store/addTool.js
var addTool = __webpack_require__(7265);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/store/state.js
var state = __webpack_require__(17873);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/tools/annotation/PlanarFreehandContourSegmentationTool.js
var PlanarFreehandContourSegmentationTool = __webpack_require__(55877);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/store/ToolGroupManager/index.js + 5 modules
var ToolGroupManager = __webpack_require__(72314);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/segmentationEventManager.js
var segmentationEventManager = __webpack_require__(83997);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/SegmentationRepresentationDisplayRegistry.js
var SegmentationRepresentationDisplayRegistry = __webpack_require__(28538);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/SegmentationRenderingEngine.js










const planarContourToolName = PlanarFreehandContourSegmentationTool/* ["default"].toolName */.A.toolName;
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
                const segmentationRepresentations = (0,getSegmentationRepresentation/* .getSegmentationRepresentations */.r$)(viewportId, { segmentationId });
                if (segmentationRepresentations?.length > 0) {
                    viewportIds.push(viewportId);
                }
            }
            else {
                const segmentationRepresentations = (0,getSegmentationRepresentation/* .getSegmentationRepresentations */.r$)(viewportId);
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
        const segmentationRepresentations = (0,getSegmentationRepresentation/* .getSegmentationRepresentations */.r$)(viewportId);
        if (!segmentationRepresentations?.length) {
            return;
        }
        const { viewport } = (0,esm.getEnabledElementByViewportId)(viewportId) || {};
        if (!viewport) {
            return;
        }
        const segmentationRenderList = segmentationRepresentations.map((representation) => {
            if (representation.type === enums.SegmentationRepresentations.Contour) {
                this._addPlanarFreeHandToolIfAbsent(viewport);
            }
            const display = (0,SegmentationRepresentationDisplayRegistry/* .getSegmentationRepresentationDisplay */.I)(representation.type);
            const segmentation = (0,segmentation_getSegmentation/* .getSegmentation */.T)(representation.segmentationId);
            const existingRepresentation = segmentation.representationData[representation.type] !== undefined;
            if (!display) {
                console.warn(`No display registered for segmentation representation type ${representation.type}.`);
                return Promise.resolve({
                    segmentationId: representation.segmentationId,
                    type: representation.type,
                });
            }
            return display
                .render(viewport, representation)
                .then(() => {
                if (!existingRepresentation) {
                    (0,segmentationEventManager/* .addDefaultSegmentationListener */.Np)(viewport, representation.segmentationId, representation.type);
                }
                return {
                    segmentationId: representation.segmentationId,
                    type: representation.type,
                };
            })
                .catch((error) => {
                console.error(error);
                return {
                    segmentationId: representation.segmentationId,
                    type: representation.type,
                };
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
        if (!(planarContourToolName in state/* .state.tools */.wk.tools)) {
            (0,addTool/* .addTool */.Gx)(PlanarFreehandContourSegmentationTool/* ["default"] */.A);
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
const DEFERRED_SEGMENTATION_RENDER_DELAY_MS = 240;
const deferredSegmentationRenderTimers = new Map();
function isProjectionHeavySegmentationViewport(viewport) {
    const blendMode = viewport.getBlendMode?.();
    if (blendMode === Enums.BlendModes.LABELMAP_EDGE_PROJECTION_BLEND) {
        return true;
    }
    const planarViewport = viewport;
    if (typeof planarViewport.getDisplaySetPresentation !== 'function') {
        return false;
    }
    const dataIds = [];
    const sourceDataId = planarViewport.getSourceDataId?.();
    if (sourceDataId) {
        dataIds.push(sourceDataId);
    }
    planarViewport.getActors?.().forEach((actorEntry) => {
        if (actorEntry.representationUID) {
            dataIds.push(String(actorEntry.representationUID));
        }
    });
    return dataIds.some((dataId) => (planarViewport.getDisplaySetPresentation(dataId)?.slabThickness ?? 0) > 0);
}
function triggerSegmentationRenderForModified(segmentationId) {
    const viewportIds = segmentationRenderingEngine._getViewportIdsForSegmentation(segmentationId);
    viewportIds.forEach((viewportId) => {
        const { viewport } = getEnabledElementByViewportId(viewportId) || {};
        if (!viewport) {
            return;
        }
        if (!isProjectionHeavySegmentationViewport(viewport)) {
            segmentationRenderingEngine.renderSegmentationsForViewport(viewportId);
            return;
        }
        const existingTimer = deferredSegmentationRenderTimers.get(viewportId);
        if (existingTimer !== undefined) {
            clearTimeout(existingTimer);
        }
        deferredSegmentationRenderTimers.set(viewportId, setTimeout(() => {
            deferredSegmentationRenderTimers.delete(viewportId);
            segmentationRenderingEngine.renderSegmentationsForViewport(viewportId);
        }, DEFERRED_SEGMENTATION_RENDER_DELAY_MS));
    });
}
const segmentationRenderingEngine = new SegmentationRenderingEngine();


;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/floodFill.js
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
/* export default */ const segmentation_floodFill = ((/* unused pure expression or super */ null && (floodFill)));

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/brushSizeForToolGroup.js
var brushSizeForToolGroup = __webpack_require__(27917);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/brushThresholdForToolGroup.js
var brushThresholdForToolGroup = __webpack_require__(6865);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/VolumetricCalculator.js
var VolumetricCalculator = __webpack_require__(46450);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/thresholdSegmentationByRange.js
var thresholdSegmentationByRange = __webpack_require__(40951);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/contourAndFindLargestBidirectional.js
var contourAndFindLargestBidirectional = __webpack_require__(38113);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/createBidirectionalToolData.js
var createBidirectionalToolData = __webpack_require__(84965);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/segmentContourAction.js
var segmentContourAction = __webpack_require__(98593);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/invalidateBrushCursor.js
var invalidateBrushCursor = __webpack_require__(90389);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/utilities.js
var segmentation_utilities = __webpack_require__(42692);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getUniqueSegmentIndices.js




function getUniqueSegmentIndices(segmentationId) {
    const cachedResult = getCachedSegmentIndices(segmentationId);
    if (cachedResult) {
        return cachedResult;
    }
    const segmentation = getSegmentation(segmentationId);
    if (!segmentation) {
        throw new Error(`No segmentation found for segmentationId ${segmentationId}`);
    }
    let indices;
    if (segmentation.representationData.Labelmap) {
        indices = handleLabelmapSegmentation(segmentation);
    }
    else if (segmentation.representationData.Contour) {
        indices = handleContourSegmentation(segmentation);
    }
    else if (segmentation.representationData.Surface) {
        indices = handleSurfaceSegmentation(segmentation);
    }
    else {
        throw new Error(`Unsupported segmentation type: ${segmentation.representationData}`);
    }
    setCachedSegmentIndices(segmentationId, indices);
    return indices;
}
function handleLabelmapSegmentation(segmentation) {
    return Object.keys(segmentation.segments)
        .map(Number)
        .sort((a, b) => a - b);
}
function handleContourSegmentation(segmentation) {
    const { annotationUIDsMap, geometryIds } = segmentation.representationData.Contour || {};
    if (!geometryIds) {
        throw new Error(`No geometryIds found for segmentationId ${segmentation.segmentationId}`);
    }
    const indices = new Set([...annotationUIDsMap.keys()]);
    geometryIds.forEach((geometryId) => {
        const geometry = cache.getGeometry(geometryId);
        indices.add(geometry.data.segmentIndex);
    });
    return Array.from(indices).sort((a, b) => a - b);
}
function handleSurfaceSegmentation(segmentation) {
    const geometryIds = segmentation.representationData.Surface?.geometryIds ?? [];
    return Array.from(geometryIds.keys())
        .map(Number)
        .sort((a, b) => a - b);
}


// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/segmentationState.js
var segmentationState = __webpack_require__(3133);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/index.js
var stateManagement = __webpack_require__(60567);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/math/polyline/index.js + 1 modules
var math_polyline = __webpack_require__(52546);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/planar/filterAnnotationsForDisplay.js
var planar_filterAnnotationsForDisplay = __webpack_require__(40349);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/getSegmentationActor.js
var getSegmentationActor = __webpack_require__(47153);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/getViewportLabelmapRenderMode.js
var helpers_getViewportLabelmapRenderMode = __webpack_require__(72293);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/labelmapSegmentationState.js
var labelmapSegmentationState = __webpack_require__(89615);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getSegmentIndexAtWorldPoint.js









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
    const viewportRenderMode = viewport
        ? getViewportLabelmapRenderMode(viewport)
        : 'unsupported';
    if (viewportRenderMode === 'volume' ||
        viewport instanceof BaseVolumeViewport) {
        for (const layer of getLabelmaps(segmentation)) {
            const segmentationVolume = getOrCreateLabelmapVolume(layer);
            if (!segmentationVolume) {
                continue;
            }
            const voxelManager = segmentationVolume.voxelManager;
            const indexIJK = utilities.transformWorldToIndex(segmentationVolume.imageData, worldPoint);
            const labelValue = voxelManager.getAtIJKPoint(indexIJK);
            if (!labelValue) {
                continue;
            }
            return getSegmentIndexForLabelValue(segmentation, layer.labelmapId, labelValue);
        }
        return;
    }
    const segmentationImageIds = getCurrentLabelmapImageIdsForViewport(viewport.id, segmentation.segmentationId);
    if (!segmentationImageIds?.length) {
        return;
    }
    for (const segmentationImageId of segmentationImageIds) {
        const image = cache.getImage(segmentationImageId);
        if (!image) {
            continue;
        }
        const segmentationActorEntry = getLabelmapActorEntry(viewport.id, segmentation.segmentationId, segmentationImageId);
        const imageData = segmentationActorEntry?.actor.getMapper().getInputData();
        const indexIJK = utilities.transformWorldToIndex(imageData, worldPoint);
        const dimensions = imageData.getDimensions();
        const voxelManager = (imageData.voxelManager ||
            utilities.VoxelManager.createScalarVolumeVoxelManager({
                dimensions,
                scalarData: imageData.getPointData().getScalars().getData(),
            }));
        const labelValue = voxelManager.getAtIJKPoint(indexIJK);
        if (!labelValue) {
            continue;
        }
        const layer = getLabelmaps(segmentation).find((candidateLayer) => candidateLayer.imageIds?.includes(segmentationImageId));
        if (!layer) {
            return labelValue;
        }
        return getSegmentIndexForLabelValue(segmentation, layer.labelmapId, labelValue);
    }
}
function getSegmentIndexAtWorldForContour(segmentation, worldPoint, { viewport }) {
    const contourData = segmentation.representationData.Contour;
    const segmentIndexByAnnotation = new Map();
    for (const [segmentIndex, annotationUIDs] of contourData.annotationUIDsMap) {
        for (const annotationUID of annotationUIDs) {
            const annotation = getAnnotation(annotationUID);
            if (annotation) {
                segmentIndexByAnnotation.set(annotation, Number(segmentIndex));
            }
        }
    }
    const displayableAnnotations = filterAnnotationsForDisplay(viewport, Array.from(segmentIndexByAnnotation.keys()));
    for (const annotation of displayableAnnotations) {
        const { polyline } = annotation.data
            .contour;
        if (isPointInsidePolyline3D(worldPoint, polyline)) {
            return segmentIndexByAnnotation.get(annotation);
        }
    }
}

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/index.js + 1 modules
var helpers = __webpack_require__(76868);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getSegmentIndexAtLabelmapBorder.js





function getSegmentIndexAtLabelmapBorder(segmentationId, worldPoint, { viewport, searchRadius }) {
    const segmentation = getSegmentation(segmentationId);
    const viewportRenderMode = viewport
        ? getViewportLabelmapRenderMode(viewport)
        : 'unsupported';
    if (viewportRenderMode === 'volume' ||
        viewport instanceof BaseVolumeViewport) {
        for (const layer of getLabelmaps(segmentation)) {
            const segmentationVolume = getOrCreateLabelmapVolume(layer);
            if (!segmentationVolume) {
                continue;
            }
            const voxelManager = segmentationVolume.voxelManager;
            const imageData = segmentationVolume.imageData;
            const indexIJK = utilities.transformWorldToIndex(imageData, worldPoint);
            const labelValue = voxelManager.getAtIJK(indexIJK[0], indexIJK[1], indexIJK[2]);
            const canvasPoint = viewport.worldToCanvas(worldPoint);
            const onEdge = isSegmentOnEdgeCanvas(canvasPoint, labelValue, viewport, imageData, searchRadius);
            if (onEdge && labelValue) {
                return getSegmentIndexForLabelValue(segmentation, layer.labelmapId, labelValue);
            }
        }
        return;
    }
    const segmentationImageId = getCurrentLabelmapImageIdForViewport(viewport.id, segmentationId);
    if (!segmentationImageId) {
        return;
    }
    const image = cache.getImage(segmentationImageId);
    if (!image) {
        return;
    }
    const segmentationActorEntry = getLabelmapActorEntry(viewport.id, segmentationId, segmentationImageId);
    const imageData = segmentationActorEntry?.actor.getMapper().getInputData();
    const indexIJK = utilities.transformWorldToIndex(imageData, worldPoint);
    const dimensions = imageData.getDimensions();
    const voxelManager = (imageData.voxelManager ||
        utilities.VoxelManager.createScalarVolumeVoxelManager({
            dimensions,
            scalarData: imageData.getPointData().getScalars().getData(),
        }));
    const labelValue = voxelManager.getAtIJKPoint(indexIJK);
    const onEdge = isSegmentOnEdgeIJK(indexIJK, dimensions, voxelManager, labelValue);
    if (!onEdge || !labelValue) {
        return;
    }
    const layer = getLabelmaps(segmentation).find((candidateLayer) => candidateLayer.imageIds?.includes(segmentationImageId));
    if (!layer) {
        return labelValue;
    }
    return getSegmentIndexForLabelValue(segmentation, layer.labelmapId, labelValue);
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

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getHoveredContourSegmentationAnnotation.js


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

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getBrushToolInstances.js
var getBrushToolInstances = __webpack_require__(91662);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/growCut/growCutShader.js
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
/* export default */ const growCutShader = ((/* unused pure expression or super */ null && (shader)));

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/growCut/runGrowCut.js


const GB = (/* unused pure expression or super */ null && (1024 * 1024 * 1024));
const WEBGPU_MEMORY_LIMIT = (/* unused pure expression or super */ null && (1.99 * GB));
const DEFAULT_GROWCUT_OPTIONS = (/* unused pure expression or super */ null && ({
    windowSize: 3,
    maxProcessingTime: 30000,
    inspection: {
        numCyclesInterval: 5,
        numCyclesBelowThreshold: 3,
        threshold: 1e-4,
    },
}));
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


// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/index.js
var gl_matrix_esm = __webpack_require__(40230);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/getViewportICamera.js
var utilities_getViewportICamera = __webpack_require__(41891);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/getSphereBoundsInfo.js
var utilities_getSphereBoundsInfo = __webpack_require__(95009);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/growCut/runGrowCutForSphere.js





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
    const camera = getViewportICamera(viewport);
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
    const { worldVecRowDir, worldVecSliceDir } = csUtils.getVolumeDirectionVectors(labelmap.imageData, getViewportICamera(viewport));
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


;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/growCut/runGrowCutForBoundingBox.js


const runGrowCutForBoundingBox_POSITIVE_SEED_VALUE = 254;
const runGrowCutForBoundingBox_NEGATIVE_SEED_VALUE = 255;
const NEGATIVE_PIXEL_RANGE = (/* unused pure expression or super */ null && ([-Infinity, -995]));
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


;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/growCut/constants.js
const constants_POSITIVE_SEED_LABEL = 254;
const constants_NEGATIVE_SEED_LABEL = 255;
const constants_DEFAULT_NEIGHBORHOOD_RADIUS = 1;
const constants_DEFAULT_POSITIVE_STD_DEV_MULTIPLIER = 1.8;
const constants_DEFAULT_NEGATIVE_STD_DEV_MULTIPLIER = 3.2;
const constants_DEFAULT_NEGATIVE_SEED_MARGIN = 30;
const constants_DEFAULT_NEGATIVE_SEEDS_COUNT = 70;
const constants_MAX_NEGATIVE_SEED_ATTEMPTS_MULTIPLIER = 50;

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/growCut/runOneClickGrowCut.js



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


;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/growCut/index.js





// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/createLabelmapMemo.js
var createLabelmapMemo = __webpack_require__(1732);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/islandRemoval.js
var islandRemoval = __webpack_require__(29827);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getOrCreateSegmentationVolume.js
var getOrCreateSegmentationVolume = __webpack_require__(22813);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getOrCreateImageVolume.js
var getOrCreateImageVolume = __webpack_require__(2322);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getStatistics.js
var getStatistics = __webpack_require__(99891);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/validateLabelmap.js
var validateLabelmap = __webpack_require__(3120);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/computeStackLabelmapFromVolume.js + 1 modules
var computeStackLabelmapFromVolume = __webpack_require__(87777);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/stateManagement/segmentation/helpers/computeVolumeLabelmapFromStack.js
var computeVolumeLabelmapFromStack = __webpack_require__(3375);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getReferenceVolumeForSegmentationVolume.js
var getReferenceVolumeForSegmentationVolume = __webpack_require__(49562);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getReferenceVolumeForSegmentation.js
var getReferenceVolumeForSegmentation = __webpack_require__(11860);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/getSegmentLargestBidirectional.js
var getSegmentLargestBidirectional = __webpack_require__(29596);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/computeMetabolicStats.js
var computeMetabolicStats = __webpack_require__(97116);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/index.js



































// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/macros.js
var macros = __webpack_require__(28241);
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/EdgeLocator.js
//#region Sources/Common/DataModel/EdgeLocator/index.js
var EdgeLocator = class {
	constructor(oriented = false) {
		this.oriented = oriented;
		this.edgeMap = /* @__PURE__ */ new Map();
	}
	initialize() {
		this.edgeMap.clear();
	}
	computeEdgeKey(pointId0, pointId1) {
		return this.oriented || pointId0 < pointId1 ? .5 * (pointId0 * pointId1) * (pointId0 * pointId1 + 1) + pointId1 : .5 * (pointId1 * pointId0) * (pointId1 * pointId0 + 1) + pointId0;
	}
	insertUniqueEdge(pointId0, pointId1, newEdgeValue) {
		const key = this.computeEdgeKey(pointId0, pointId1);
		let node = this.edgeMap.get(key);
		if (!node) {
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
		const n = .5 * (-1 + Math.sqrt(8 * node.key + 1));
		const pointId0 = node.key - .5 * (n + 1) * n;
		return [pointId0, n - pointId0];
	}
};
function newInstance(initialValues = {}) {
	return new EdgeLocator(initialValues.oriented);
}
var EdgeLocator_default = { newInstance };
//#endregion


//# sourceMappingURL=EdgeLocator.js.map
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/PolyData.js + 7 modules
var PolyData = __webpack_require__(91542);
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Filters/General/ImageMarchingSquares/caseTable.js
//#region Sources/Filters/General/ImageMarchingSquares/caseTable.js
var MARCHING_SQUARES_CASES = [
	[
		-1,
		-1,
		-1,
		-1,
		-1
	],
	[
		0,
		3,
		-1,
		-1,
		-1
	],
	[
		1,
		0,
		-1,
		-1,
		-1
	],
	[
		1,
		3,
		-1,
		-1,
		-1
	],
	[
		2,
		1,
		-1,
		-1,
		-1
	],
	[
		0,
		3,
		2,
		1,
		-1
	],
	[
		2,
		0,
		-1,
		-1,
		-1
	],
	[
		2,
		3,
		-1,
		-1,
		-1
	],
	[
		3,
		2,
		-1,
		-1,
		-1
	],
	[
		0,
		2,
		-1,
		-1,
		-1
	],
	[
		1,
		0,
		3,
		2,
		-1
	],
	[
		1,
		2,
		-1,
		-1,
		-1
	],
	[
		3,
		1,
		-1,
		-1,
		-1
	],
	[
		0,
		1,
		-1,
		-1,
		-1
	],
	[
		3,
		0,
		-1,
		-1,
		-1
	],
	[
		-1,
		-1,
		-1,
		-1,
		-1
	]
];
var EDGES = [
	[0, 1],
	[1, 3],
	[2, 3],
	[0, 2]
];
function getCase(index) {
	return MARCHING_SQUARES_CASES[index];
}
function getEdge(eid) {
	return EDGES[eid];
}
var caseTable_default = {
	getCase,
	getEdge
};
//#endregion


//# sourceMappingURL=caseTable.js.map
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Filters/General/ImageMarchingSquares.js




//#region Sources/Filters/General/ImageMarchingSquares/index.js
var { vtkErrorMacro, vtkDebugMacro } = macros/* ["default"] */.Ay;
function vtkImageMarchingSquares(publicAPI, model) {
	/**
	* Get the X,Y kernels based on the set slicing mode.
	* @returns {[number, number]}
	*/
	function getKernels() {
		let kernelX = 0;
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
	model.classHierarchy.push("vtkImageMarchingSquares");
	/**
	* Get the list of contour values.
	* @returns {number[]}
	*/
	publicAPI.getContourValues = () => model.contourValues;
	/**
	* Set the list contour values.
	* @param {number[]} cValues
	*/
	publicAPI.setContourValues = (cValues) => {
		model.contourValues = cValues;
		publicAPI.modified();
	};
	const ids = [];
	const pixelScalars = [];
	const pixelPts = [];
	const edgeLocator = EdgeLocator_default.newInstance();
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
		ids[0] = k * dims[1] * dims[0] + j * dims[0] + i;
		ids[1] = ids[0] + increments[kernelX];
		ids[2] = ids[0] + increments[kernelY];
		ids[3] = ids[2] + increments[kernelX];
		for (let ii = 0; ii < 4; ++ii) pixelScalars[ii] = scalars[ids[ii]];
	};
	/**
	* Retrieve pixel coordinates.
	* @param {Vector3} ijk origin of the pixel
	* @param {number} kernelX index of the X element
	* @param {number} kernelY index of the Y element
	* @param {Function} indexToWorld function to convert index to world coordinates
	*/
	publicAPI.getPixelPoints = (ijk, kernelX, kernelY, indexToWorld) => {
		const neighborIJK = [...ijk];
		indexToWorld(neighborIJK, pixelPts);
		neighborIJK[kernelX] += 1;
		const temp = indexToWorld(neighborIJK, []);
		pixelPts[3] = temp[0];
		pixelPts[4] = temp[1];
		pixelPts[5] = temp[2];
		neighborIJK[kernelY] += 1;
		indexToWorld(neighborIJK, temp);
		pixelPts[9] = temp[0];
		pixelPts[10] = temp[1];
		pixelPts[11] = temp[2];
		neighborIJK[kernelX] -= 1;
		indexToWorld(neighborIJK, temp);
		pixelPts[6] = temp[0];
		pixelPts[7] = temp[1];
		pixelPts[8] = temp[2];
	};
	/**
	* Produce points and lines for the polydata.
	* @param {number[]} cVal list of contour values
	* @param {Vector3} ijk origin of the pixel
	* @param {Vector3} dims dimensions of the image
	* @param {Vector3} spacing sapcing of the image
	* @param {TypedArray} scalars list of scalar values
	* @param {number[]} points list of points
	* @param {number[]} lines list of lines
	* @param {Vector3} increments IJK slice increments
	* @param {number} kernelX index of the X element
	* @param {number} kernelY index of the Y element
	* @param {Function} indexToWorld function to convert index to world coordinates
	*/
	publicAPI.produceLines = (cVal, ijk, dims, scalars, points, lines, increments, kernelX, kernelY, indexToWorld) => {
		const CASE_MASK = [
			1,
			2,
			8,
			4
		];
		const xyz = [];
		let pId;
		publicAPI.getPixelScalars(ijk, dims, scalars, increments, kernelX, kernelY);
		let index = 0;
		for (let idx = 0; idx < 4; idx++) if (pixelScalars[idx] >= cVal) index |= CASE_MASK[idx];
		const pixelLines = caseTable_default.getCase(index);
		if (pixelLines[0] < 0) return;
		publicAPI.getPixelPoints(ijk, kernelX, kernelY, indexToWorld);
		for (let idx = 0; pixelLines[idx] >= 0; idx += 2) {
			lines.push(2);
			for (let eid = 0; eid < 2; eid++) {
				const edgeVerts = caseTable_default.getEdge(pixelLines[idx + eid]);
				pId = void 0;
				if (model.mergePoints) pId = edgeLocator.isInsertedEdge(ids[edgeVerts[0]], ids[edgeVerts[1]])?.value;
				if (pId === void 0) {
					const t = (cVal - pixelScalars[edgeVerts[0]]) / (pixelScalars[edgeVerts[1]] - pixelScalars[edgeVerts[0]]);
					const x0 = pixelPts.slice(edgeVerts[0] * 3, (edgeVerts[0] + 1) * 3);
					const x1 = pixelPts.slice(edgeVerts[1] * 3, (edgeVerts[1] + 1) * 3);
					xyz[0] = x0[0] + t * (x1[0] - x0[0]);
					xyz[1] = x0[1] + t * (x1[1] - x0[1]);
					xyz[2] = x0[2] + t * (x1[2] - x0[2]);
					pId = points.length / 3;
					points.push(xyz[0], xyz[1], xyz[2]);
					if (model.mergePoints) edgeLocator.insertEdge(ids[edgeVerts[0]], ids[edgeVerts[1]], pId);
				}
				lines.push(pId);
			}
		}
	};
	publicAPI.requestData = (inData, outData) => {
		const input = inData[0];
		if (!input) {
			vtkErrorMacro("Invalid or missing input");
			return;
		}
		if (model.slicingMode == null || model.slicingMode < 0 || model.slicingMode > 2) {
			vtkErrorMacro("Invalid or missing slicing mode");
			return;
		}
		console.time("msquares");
		const dims = input.getDimensions();
		const extent = input.getExtent();
		const increments = input.computeIncrements(extent);
		const scalars = input.getPointData().getScalars().getData();
		const [kernelX, kernelY] = getKernels();
		const indexToWorld = input.indexToWorld;
		const points = [];
		const lines = [];
		let k = Math.round(model.slice);
		if (k >= dims[model.slicingMode]) k = 0;
		const ijk = [
			0,
			0,
			0
		];
		ijk[model.slicingMode] = k;
		for (let cv = 0; cv < model.contourValues.length; ++cv) {
			for (let j = 0; j < dims[kernelY] - 1; ++j) {
				ijk[kernelY] = j;
				for (let i = 0; i < dims[kernelX] - 1; ++i) {
					ijk[kernelX] = i;
					publicAPI.produceLines(model.contourValues[cv], ijk, dims, scalars, points, lines, increments, kernelX, kernelY, indexToWorld);
				}
			}
			edgeLocator.initialize();
		}
		const polydata = outData[0]?.initialize() || PolyData/* ["default"].newInstance */.Ay.newInstance();
		polydata.getPoints().setData(new Float32Array(points), 3);
		polydata.getLines().setData(new Uint32Array(lines));
		outData[0] = polydata;
		vtkDebugMacro("Produced output");
		console.timeEnd("msquares");
	};
}
var DEFAULT_VALUES = {
	contourValues: [],
	slicingMode: 2,
	slice: 0,
	mergePoints: false
};
function extend(publicAPI, model, initialValues = {}) {
	Object.assign(model, DEFAULT_VALUES, initialValues);
	macros/* ["default"].obj */.Ay.obj(publicAPI, model);
	macros/* ["default"].algo */.Ay.algo(publicAPI, model, 1, 1);
	macros/* ["default"].setGet */.Ay.setGet(publicAPI, model, [
		"slicingMode",
		"slice",
		"mergePoints"
	]);
	macros/* ["default"].algo */.Ay.algo(publicAPI, model, 1, 1);
	vtkImageMarchingSquares(publicAPI, model);
}
var ImageMarchingSquares_newInstance = macros/* ["default"].newInstance */.Ay.newInstance(extend, "vtkImageMarchingSquares");
var ImageMarchingSquares_default = {
	newInstance: ImageMarchingSquares_newInstance,
	extend
};
//#endregion


//# sourceMappingURL=ImageMarchingSquares.js.map
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/DataArray.js
var DataArray = __webpack_require__(445);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/ImageData.js
var ImageData = __webpack_require__(26393);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contours/getDeduplicatedVTKPolyDataPoints.js
var getDeduplicatedVTKPolyDataPoints = __webpack_require__(12583);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/contours/contourFinder.js
var contourFinder = __webpack_require__(52295);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/findLargestBidirectional.js
var findLargestBidirectional = __webpack_require__(20810);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/utilities/segmentation/isLineInSegment.js
var isLineInSegment = __webpack_require__(35262);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/workers/computeWorker.js











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
        const imageData = ImageData/* ["default"].newInstance */.Ay.newInstance();
        imageData.setDimensions(dimensions);
        imageData.setOrigin(origin);
        imageData.setDirection(direction);
        imageData.setSpacing(spacing);
        if (!scalarData) {
            return imageData;
        }
        const scalarArray = DataArray/* ["default"].newInstance */.Ay.newInstance({
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
            SegmentStatsCalculator/* ["default"].statsCallback */.A.statsCallback({
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
        const mSquares = ImageMarchingSquares_default.newInstance(options);
        mSquares.setInputData(imageData);
        mSquares.setContourValues([1]);
        mSquares.setMergePoints(false);
        return mSquares.getOutputData();
    },
    createContoursFromPolyData: (msOutput, sliceIndex = null) => {
        const reducedSet = (0,getDeduplicatedVTKPolyDataPoints/* .getDeduplicatedVTKPolyDataPoints */.v)(msOutput);
        if (reducedSet.points?.length) {
            const contours = (0,contourFinder/* .findContoursFromReducedSet */.d1)(reducedSet.lines);
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
        SegmentStatsCalculator/* ["default"].statsInit */.A.statsInit({ storePointData: false, indices, mode });
        computeWorker.processSegmentStatistics({
            segVoxelManager,
            imageVoxelManager,
            indices,
            imageData,
        });
        const stats = SegmentStatsCalculator/* ["default"].getStatistics */.A.getStatistics({
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
        SegmentStatsCalculator/* ["default"].statsInit */.A.statsInit({ storePointData: true, indices, mode });
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
        const stats = SegmentStatsCalculator/* ["default"].getStatistics */.A.getStatistics({
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
            const bidirectional = (0,findLargestBidirectional/* .createBidirectionalForSlice */.H)(sliceContour, isInSegment, maxBidirectional);
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
                const scalarArray = DataArray/* ["default"].newInstance */.Ay.newInstance({
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
                const isInSegment = (0,isLineInSegment/* .createIsInSegmentMetadata */.On)({
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
            const isInSegment = (0,isLineInSegment/* .createIsInSegmentMetadata */.On)({
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
            const scalars = DataArray/* ["default"].newInstance */.Ay.newInstance({
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
                    const imageDataCopy = ImageData/* ["default"].newInstance */.Ay.newInstance();
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
(0,comlink/* .expose */.p)(computeWorker);


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
44779(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (zip)
});
/* import */ var _transpose_js__rspack_import_0 = __webpack_require__(43183);


function zip() {
  return (0,_transpose_js__rspack_import_0/* ["default"] */.A)(arguments);
}


},
20919(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* export default binding */ __rspack_default_export)
});
/* export default */ function __rspack_default_export(interpolator, n) {
  var samples = new Array(n);
  for (var i = 0; i < n; ++i) samples[i] = interpolator(i / (n - 1));
  return samples;
}


},

}]);