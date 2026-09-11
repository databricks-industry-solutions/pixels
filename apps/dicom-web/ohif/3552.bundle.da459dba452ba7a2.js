(globalThis["rspackChunk"] = globalThis["rspackChunk"] || []).push([[3552], {
45043(module) {
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


},
98232(__unused_rspack_module, __unused_rspack___webpack_exports__, __webpack_require__) {
"use strict";
/* import */ var _common_js__rspack_import_0 = __webpack_require__(24457);

/**
 * 2x2 Matrix
 * @module mat2
 */

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */

function create() {
  var out = new glMatrix.ARRAY_TYPE(4);

  if (glMatrix.ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
  }

  out[0] = 1;
  out[3] = 1;
  return out;
}
/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {ReadonlyMat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */

function clone(a) {
  var out = new glMatrix.ARRAY_TYPE(4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the source matrix
 * @returns {mat2} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}
/**
 * Create a new mat2 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m10 Component in column 1, row 0 position (index 2)
 * @param {Number} m11 Component in column 1, row 1 position (index 3)
 * @returns {mat2} out A new 2x2 matrix
 */

function fromValues(m00, m01, m10, m11) {
  var out = new glMatrix.ARRAY_TYPE(4);
  out[0] = m00;
  out[1] = m01;
  out[2] = m10;
  out[3] = m11;
  return out;
}
/**
 * Set the components of a mat2 to the given values
 *
 * @param {mat2} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m10 Component in column 1, row 0 position (index 2)
 * @param {Number} m11 Component in column 1, row 1 position (index 3)
 * @returns {mat2} out
 */

function set(out, m00, m01, m10, m11) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m10;
  out[3] = m11;
  return out;
}
/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the source matrix
 * @returns {mat2} out
 */

function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache
  // some values
  if (out === a) {
    var a1 = a[1];
    out[1] = a[2];
    out[2] = a1;
  } else {
    out[0] = a[0];
    out[1] = a[2];
    out[2] = a[1];
    out[3] = a[3];
  }

  return out;
}
/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the source matrix
 * @returns {mat2} out
 */

function invert(out, a) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3]; // Calculate the determinant

  var det = a0 * a3 - a2 * a1;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = a3 * det;
  out[1] = -a1 * det;
  out[2] = -a2 * det;
  out[3] = a0 * det;
  return out;
}
/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the source matrix
 * @returns {mat2} out
 */

function adjoint(out, a) {
  // Caching this value is nessecary if out == a
  var a0 = a[0];
  out[0] = a[3];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a0;
  return out;
}
/**
 * Calculates the determinant of a mat2
 *
 * @param {ReadonlyMat2} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant(a) {
  return a[0] * a[3] - a[2] * a[1];
}
/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the first operand
 * @param {ReadonlyMat2} b the second operand
 * @returns {mat2} out
 */

function multiply(out, a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = a0 * b0 + a2 * b1;
  out[1] = a1 * b0 + a3 * b1;
  out[2] = a0 * b2 + a2 * b3;
  out[3] = a1 * b2 + a3 * b3;
  return out;
}
/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */

function rotate(out, a, rad) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = a0 * c + a2 * s;
  out[1] = a1 * c + a3 * s;
  out[2] = a0 * -s + a2 * c;
  out[3] = a1 * -s + a3 * c;
  return out;
}
/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the matrix to rotate
 * @param {ReadonlyVec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/

function scale(out, a, v) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var v0 = v[0],
      v1 = v[1];
  out[0] = a0 * v0;
  out[1] = a1 * v0;
  out[2] = a2 * v1;
  out[3] = a3 * v1;
  return out;
}
/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.rotate(dest, dest, rad);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */

function fromRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = -s;
  out[3] = c;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.scale(dest, dest, vec);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {ReadonlyVec2} v Scaling vector
 * @returns {mat2} out
 */

function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = v[1];
  return out;
}
/**
 * Returns a string representation of a mat2
 *
 * @param {ReadonlyMat2} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */

function str(a) {
  return "mat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
}
/**
 * Returns Frobenius norm of a mat2
 *
 * @param {ReadonlyMat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */

function frob(a) {
  return Math.hypot(a[0], a[1], a[2], a[3]);
}
/**
 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
 * @param {ReadonlyMat2} L the lower triangular matrix
 * @param {ReadonlyMat2} D the diagonal matrix
 * @param {ReadonlyMat2} U the upper triangular matrix
 * @param {ReadonlyMat2} a the input matrix to factorize
 */

function LDU(L, D, U, a) {
  L[2] = a[2] / a[0];
  U[0] = a[0];
  U[1] = a[1];
  U[3] = a[3] - L[2] * U[1];
  return [L, D, U];
}
/**
 * Adds two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the first operand
 * @param {ReadonlyMat2} b the second operand
 * @returns {mat2} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the first operand
 * @param {ReadonlyMat2} b the second operand
 * @returns {mat2} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  return out;
}
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyMat2} a The first matrix.
 * @param {ReadonlyMat2} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {ReadonlyMat2} a The first matrix.
 * @param {ReadonlyMat2} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
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
  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat2} out
 */

function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}
/**
 * Adds two mat2's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat2} out the receiving vector
 * @param {ReadonlyMat2} a the first operand
 * @param {ReadonlyMat2} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat2} out
 */

function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  return out;
}
/**
 * Alias for {@link mat2.multiply}
 * @function
 */

var mul = (/* unused pure expression or super */ null && (multiply));
/**
 * Alias for {@link mat2.subtract}
 * @function
 */

var sub = (/* unused pure expression or super */ null && (subtract));

},
72918(__unused_rspack_module, __unused_rspack___webpack_exports__, __webpack_require__) {
"use strict";
/* import */ var _common_js__rspack_import_0 = __webpack_require__(24457);

/**
 * 2x3 Matrix
 * @module mat2d
 * @description
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, b,
 *  c, d,
 *  tx, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, b, 0,
 *  c, d, 0,
 *  tx, ty, 1]
 * </pre>
 * The last column is ignored so the array is shorter and operations are faster.
 */

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */

function create() {
  var out = new glMatrix.ARRAY_TYPE(6);

  if (glMatrix.ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[4] = 0;
    out[5] = 0;
  }

  out[0] = 1;
  out[3] = 1;
  return out;
}
/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {ReadonlyMat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */

function clone(a) {
  var out = new glMatrix.ARRAY_TYPE(6);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  return out;
}
/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the source matrix
 * @returns {mat2d} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  return out;
}
/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = 0;
  out[5] = 0;
  return out;
}
/**
 * Create a new mat2d with the given values
 *
 * @param {Number} a Component A (index 0)
 * @param {Number} b Component B (index 1)
 * @param {Number} c Component C (index 2)
 * @param {Number} d Component D (index 3)
 * @param {Number} tx Component TX (index 4)
 * @param {Number} ty Component TY (index 5)
 * @returns {mat2d} A new mat2d
 */

function fromValues(a, b, c, d, tx, ty) {
  var out = new glMatrix.ARRAY_TYPE(6);
  out[0] = a;
  out[1] = b;
  out[2] = c;
  out[3] = d;
  out[4] = tx;
  out[5] = ty;
  return out;
}
/**
 * Set the components of a mat2d to the given values
 *
 * @param {mat2d} out the receiving matrix
 * @param {Number} a Component A (index 0)
 * @param {Number} b Component B (index 1)
 * @param {Number} c Component C (index 2)
 * @param {Number} d Component D (index 3)
 * @param {Number} tx Component TX (index 4)
 * @param {Number} ty Component TY (index 5)
 * @returns {mat2d} out
 */

function set(out, a, b, c, d, tx, ty) {
  out[0] = a;
  out[1] = b;
  out[2] = c;
  out[3] = d;
  out[4] = tx;
  out[5] = ty;
  return out;
}
/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the source matrix
 * @returns {mat2d} out
 */

function invert(out, a) {
  var aa = a[0],
      ab = a[1],
      ac = a[2],
      ad = a[3];
  var atx = a[4],
      aty = a[5];
  var det = aa * ad - ab * ac;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = ad * det;
  out[1] = -ab * det;
  out[2] = -ac * det;
  out[3] = aa * det;
  out[4] = (ac * aty - ad * atx) * det;
  out[5] = (ab * atx - aa * aty) * det;
  return out;
}
/**
 * Calculates the determinant of a mat2d
 *
 * @param {ReadonlyMat2d} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant(a) {
  return a[0] * a[3] - a[1] * a[2];
}
/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the first operand
 * @param {ReadonlyMat2d} b the second operand
 * @returns {mat2d} out
 */

function multiply(out, a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3],
      b4 = b[4],
      b5 = b[5];
  out[0] = a0 * b0 + a2 * b1;
  out[1] = a1 * b0 + a3 * b1;
  out[2] = a0 * b2 + a2 * b3;
  out[3] = a1 * b2 + a3 * b3;
  out[4] = a0 * b4 + a2 * b5 + a4;
  out[5] = a1 * b4 + a3 * b5 + a5;
  return out;
}
/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */

function rotate(out, a, rad) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5];
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = a0 * c + a2 * s;
  out[1] = a1 * c + a3 * s;
  out[2] = a0 * -s + a2 * c;
  out[3] = a1 * -s + a3 * c;
  out[4] = a4;
  out[5] = a5;
  return out;
}
/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the matrix to translate
 * @param {ReadonlyVec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/

function scale(out, a, v) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5];
  var v0 = v[0],
      v1 = v[1];
  out[0] = a0 * v0;
  out[1] = a1 * v0;
  out[2] = a2 * v1;
  out[3] = a3 * v1;
  out[4] = a4;
  out[5] = a5;
  return out;
}
/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the matrix to translate
 * @param {ReadonlyVec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/

function translate(out, a, v) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5];
  var v0 = v[0],
      v1 = v[1];
  out[0] = a0;
  out[1] = a1;
  out[2] = a2;
  out[3] = a3;
  out[4] = a0 * v0 + a2 * v1 + a4;
  out[5] = a1 * v0 + a3 * v1 + a5;
  return out;
}
/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.rotate(dest, dest, rad);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */

function fromRotation(out, rad) {
  var s = Math.sin(rad),
      c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = -s;
  out[3] = c;
  out[4] = 0;
  out[5] = 0;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.scale(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {ReadonlyVec2} v Scaling vector
 * @returns {mat2d} out
 */

function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = v[1];
  out[4] = 0;
  out[5] = 0;
  return out;
}
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.translate(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {ReadonlyVec2} v Translation vector
 * @returns {mat2d} out
 */

function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = v[0];
  out[5] = v[1];
  return out;
}
/**
 * Returns a string representation of a mat2d
 *
 * @param {ReadonlyMat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */

function str(a) {
  return "mat2d(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ")";
}
/**
 * Returns Frobenius norm of a mat2d
 *
 * @param {ReadonlyMat2d} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */

function frob(a) {
  return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], 1);
}
/**
 * Adds two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the first operand
 * @param {ReadonlyMat2d} b the second operand
 * @returns {mat2d} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the first operand
 * @param {ReadonlyMat2d} b the second operand
 * @returns {mat2d} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  return out;
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat2d} out
 */

function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  return out;
}
/**
 * Adds two mat2d's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat2d} out the receiving vector
 * @param {ReadonlyMat2d} a the first operand
 * @param {ReadonlyMat2d} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat2d} out
 */

function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  out[4] = a[4] + b[4] * scale;
  out[5] = a[5] + b[5] * scale;
  return out;
}
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyMat2d} a The first matrix.
 * @param {ReadonlyMat2d} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {ReadonlyMat2d} a The first matrix.
 * @param {ReadonlyMat2d} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3],
      b4 = b[4],
      b5 = b[5];
  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5));
}
/**
 * Alias for {@link mat2d.multiply}
 * @function
 */

var mul = (/* unused pure expression or super */ null && (multiply));
/**
 * Alias for {@link mat2d.subtract}
 * @function
 */

var sub = (/* unused pure expression or super */ null && (subtract));

},
16953(__unused_rspack_module, __unused_rspack___webpack_exports__, __webpack_require__) {
"use strict";
/* import */ var _common_js__rspack_import_0 = __webpack_require__(24457);
/* import */ var _quat_js__rspack_import_1 = __webpack_require__(50095);
/* import */ var _mat4_js__rspack_import_2 = __webpack_require__(28910);



/**
 * Dual Quaternion<br>
 * Format: [real, dual]<br>
 * Quaternion format: XYZW<br>
 * Make sure to have normalized dual quaternions, otherwise the functions may not work as intended.<br>
 * @module quat2
 */

/**
 * Creates a new identity dual quat
 *
 * @returns {quat2} a new dual quaternion [real -> rotation, dual -> translation]
 */

function create() {
  var dq = new glMatrix.ARRAY_TYPE(8);

  if (glMatrix.ARRAY_TYPE != Float32Array) {
    dq[0] = 0;
    dq[1] = 0;
    dq[2] = 0;
    dq[4] = 0;
    dq[5] = 0;
    dq[6] = 0;
    dq[7] = 0;
  }

  dq[3] = 1;
  return dq;
}
/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {ReadonlyQuat2} a dual quaternion to clone
 * @returns {quat2} new dual quaternion
 * @function
 */

function clone(a) {
  var dq = new glMatrix.ARRAY_TYPE(8);
  dq[0] = a[0];
  dq[1] = a[1];
  dq[2] = a[2];
  dq[3] = a[3];
  dq[4] = a[4];
  dq[5] = a[5];
  dq[6] = a[6];
  dq[7] = a[7];
  return dq;
}
/**
 * Creates a new dual quat initialized with the given values
 *
 * @param {Number} x1 X component
 * @param {Number} y1 Y component
 * @param {Number} z1 Z component
 * @param {Number} w1 W component
 * @param {Number} x2 X component
 * @param {Number} y2 Y component
 * @param {Number} z2 Z component
 * @param {Number} w2 W component
 * @returns {quat2} new dual quaternion
 * @function
 */

function fromValues(x1, y1, z1, w1, x2, y2, z2, w2) {
  var dq = new glMatrix.ARRAY_TYPE(8);
  dq[0] = x1;
  dq[1] = y1;
  dq[2] = z1;
  dq[3] = w1;
  dq[4] = x2;
  dq[5] = y2;
  dq[6] = z2;
  dq[7] = w2;
  return dq;
}
/**
 * Creates a new dual quat from the given values (quat and translation)
 *
 * @param {Number} x1 X component
 * @param {Number} y1 Y component
 * @param {Number} z1 Z component
 * @param {Number} w1 W component
 * @param {Number} x2 X component (translation)
 * @param {Number} y2 Y component (translation)
 * @param {Number} z2 Z component (translation)
 * @returns {quat2} new dual quaternion
 * @function
 */

function fromRotationTranslationValues(x1, y1, z1, w1, x2, y2, z2) {
  var dq = new glMatrix.ARRAY_TYPE(8);
  dq[0] = x1;
  dq[1] = y1;
  dq[2] = z1;
  dq[3] = w1;
  var ax = x2 * 0.5,
      ay = y2 * 0.5,
      az = z2 * 0.5;
  dq[4] = ax * w1 + ay * z1 - az * y1;
  dq[5] = ay * w1 + az * x1 - ax * z1;
  dq[6] = az * w1 + ax * y1 - ay * x1;
  dq[7] = -ax * x1 - ay * y1 - az * z1;
  return dq;
}
/**
 * Creates a dual quat from a quaternion and a translation
 *
 * @param {ReadonlyQuat2} dual quaternion receiving operation result
 * @param {ReadonlyQuat} q a normalized quaternion
 * @param {ReadonlyVec3} t tranlation vector
 * @returns {quat2} dual quaternion receiving operation result
 * @function
 */

function fromRotationTranslation(out, q, t) {
  var ax = t[0] * 0.5,
      ay = t[1] * 0.5,
      az = t[2] * 0.5,
      bx = q[0],
      by = q[1],
      bz = q[2],
      bw = q[3];
  out[0] = bx;
  out[1] = by;
  out[2] = bz;
  out[3] = bw;
  out[4] = ax * bw + ay * bz - az * by;
  out[5] = ay * bw + az * bx - ax * bz;
  out[6] = az * bw + ax * by - ay * bx;
  out[7] = -ax * bx - ay * by - az * bz;
  return out;
}
/**
 * Creates a dual quat from a translation
 *
 * @param {ReadonlyQuat2} dual quaternion receiving operation result
 * @param {ReadonlyVec3} t translation vector
 * @returns {quat2} dual quaternion receiving operation result
 * @function
 */

function fromTranslation(out, t) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = t[0] * 0.5;
  out[5] = t[1] * 0.5;
  out[6] = t[2] * 0.5;
  out[7] = 0;
  return out;
}
/**
 * Creates a dual quat from a quaternion
 *
 * @param {ReadonlyQuat2} dual quaternion receiving operation result
 * @param {ReadonlyQuat} q the quaternion
 * @returns {quat2} dual quaternion receiving operation result
 * @function
 */

function fromRotation(out, q) {
  out[0] = q[0];
  out[1] = q[1];
  out[2] = q[2];
  out[3] = q[3];
  out[4] = 0;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  return out;
}
/**
 * Creates a new dual quat from a matrix (4x4)
 *
 * @param {quat2} out the dual quaternion
 * @param {ReadonlyMat4} a the matrix
 * @returns {quat2} dual quat receiving operation result
 * @function
 */

function fromMat4(out, a) {
  //TODO Optimize this
  var outer = quat.create();
  mat4.getRotation(outer, a);
  var t = new glMatrix.ARRAY_TYPE(3);
  mat4.getTranslation(t, a);
  fromRotationTranslation(out, outer, t);
  return out;
}
/**
 * Copy the values from one dual quat to another
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the source dual quaternion
 * @returns {quat2} out
 * @function
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
  return out;
}
/**
 * Set a dual quat to the identity dual quaternion
 *
 * @param {quat2} out the receiving quaternion
 * @returns {quat2} out
 */

function identity(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = 0;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  return out;
}
/**
 * Set the components of a dual quat to the given values
 *
 * @param {quat2} out the receiving quaternion
 * @param {Number} x1 X component
 * @param {Number} y1 Y component
 * @param {Number} z1 Z component
 * @param {Number} w1 W component
 * @param {Number} x2 X component
 * @param {Number} y2 Y component
 * @param {Number} z2 Z component
 * @param {Number} w2 W component
 * @returns {quat2} out
 * @function
 */

function set(out, x1, y1, z1, w1, x2, y2, z2, w2) {
  out[0] = x1;
  out[1] = y1;
  out[2] = z1;
  out[3] = w1;
  out[4] = x2;
  out[5] = y2;
  out[6] = z2;
  out[7] = w2;
  return out;
}
/**
 * Gets the real part of a dual quat
 * @param  {quat} out real part
 * @param  {ReadonlyQuat2} a Dual Quaternion
 * @return {quat} real part
 */

var getReal = _quat_js__rspack_import_1/* .copy */.C;
/**
 * Gets the dual part of a dual quat
 * @param  {quat} out dual part
 * @param  {ReadonlyQuat2} a Dual Quaternion
 * @return {quat} dual part
 */

function getDual(out, a) {
  out[0] = a[4];
  out[1] = a[5];
  out[2] = a[6];
  out[3] = a[7];
  return out;
}
/**
 * Set the real component of a dual quat to the given quaternion
 *
 * @param {quat2} out the receiving quaternion
 * @param {ReadonlyQuat} q a quaternion representing the real part
 * @returns {quat2} out
 * @function
 */

var setReal = _quat_js__rspack_import_1/* .copy */.C;
/**
 * Set the dual component of a dual quat to the given quaternion
 *
 * @param {quat2} out the receiving quaternion
 * @param {ReadonlyQuat} q a quaternion representing the dual part
 * @returns {quat2} out
 * @function
 */

function setDual(out, q) {
  out[4] = q[0];
  out[5] = q[1];
  out[6] = q[2];
  out[7] = q[3];
  return out;
}
/**
 * Gets the translation of a normalized dual quat
 * @param  {vec3} out translation
 * @param  {ReadonlyQuat2} a Dual Quaternion to be decomposed
 * @return {vec3} translation
 */

function getTranslation(out, a) {
  var ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7],
      bx = -a[0],
      by = -a[1],
      bz = -a[2],
      bw = a[3];
  out[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
  out[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
  out[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
  return out;
}
/**
 * Translates a dual quat by the given vector
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the dual quaternion to translate
 * @param {ReadonlyVec3} v vector to translate by
 * @returns {quat2} out
 */

function translate(out, a, v) {
  var ax1 = a[0],
      ay1 = a[1],
      az1 = a[2],
      aw1 = a[3],
      bx1 = v[0] * 0.5,
      by1 = v[1] * 0.5,
      bz1 = v[2] * 0.5,
      ax2 = a[4],
      ay2 = a[5],
      az2 = a[6],
      aw2 = a[7];
  out[0] = ax1;
  out[1] = ay1;
  out[2] = az1;
  out[3] = aw1;
  out[4] = aw1 * bx1 + ay1 * bz1 - az1 * by1 + ax2;
  out[5] = aw1 * by1 + az1 * bx1 - ax1 * bz1 + ay2;
  out[6] = aw1 * bz1 + ax1 * by1 - ay1 * bx1 + az2;
  out[7] = -ax1 * bx1 - ay1 * by1 - az1 * bz1 + aw2;
  return out;
}
/**
 * Rotates a dual quat around the X axis
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the dual quaternion to rotate
 * @param {number} rad how far should the rotation be
 * @returns {quat2} out
 */

function rotateX(out, a, rad) {
  var bx = -a[0],
      by = -a[1],
      bz = -a[2],
      bw = a[3],
      ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7],
      ax1 = ax * bw + aw * bx + ay * bz - az * by,
      ay1 = ay * bw + aw * by + az * bx - ax * bz,
      az1 = az * bw + aw * bz + ax * by - ay * bx,
      aw1 = aw * bw - ax * bx - ay * by - az * bz;
  quat.rotateX(out, a, rad);
  bx = out[0];
  by = out[1];
  bz = out[2];
  bw = out[3];
  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  return out;
}
/**
 * Rotates a dual quat around the Y axis
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the dual quaternion to rotate
 * @param {number} rad how far should the rotation be
 * @returns {quat2} out
 */

function rotateY(out, a, rad) {
  var bx = -a[0],
      by = -a[1],
      bz = -a[2],
      bw = a[3],
      ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7],
      ax1 = ax * bw + aw * bx + ay * bz - az * by,
      ay1 = ay * bw + aw * by + az * bx - ax * bz,
      az1 = az * bw + aw * bz + ax * by - ay * bx,
      aw1 = aw * bw - ax * bx - ay * by - az * bz;
  quat.rotateY(out, a, rad);
  bx = out[0];
  by = out[1];
  bz = out[2];
  bw = out[3];
  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  return out;
}
/**
 * Rotates a dual quat around the Z axis
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the dual quaternion to rotate
 * @param {number} rad how far should the rotation be
 * @returns {quat2} out
 */

function rotateZ(out, a, rad) {
  var bx = -a[0],
      by = -a[1],
      bz = -a[2],
      bw = a[3],
      ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7],
      ax1 = ax * bw + aw * bx + ay * bz - az * by,
      ay1 = ay * bw + aw * by + az * bx - ax * bz,
      az1 = az * bw + aw * bz + ax * by - ay * bx,
      aw1 = aw * bw - ax * bx - ay * by - az * bz;
  quat.rotateZ(out, a, rad);
  bx = out[0];
  by = out[1];
  bz = out[2];
  bw = out[3];
  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  return out;
}
/**
 * Rotates a dual quat by a given quaternion (a * q)
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the dual quaternion to rotate
 * @param {ReadonlyQuat} q quaternion to rotate by
 * @returns {quat2} out
 */

function rotateByQuatAppend(out, a, q) {
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3],
      ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  out[0] = ax * qw + aw * qx + ay * qz - az * qy;
  out[1] = ay * qw + aw * qy + az * qx - ax * qz;
  out[2] = az * qw + aw * qz + ax * qy - ay * qx;
  out[3] = aw * qw - ax * qx - ay * qy - az * qz;
  ax = a[4];
  ay = a[5];
  az = a[6];
  aw = a[7];
  out[4] = ax * qw + aw * qx + ay * qz - az * qy;
  out[5] = ay * qw + aw * qy + az * qx - ax * qz;
  out[6] = az * qw + aw * qz + ax * qy - ay * qx;
  out[7] = aw * qw - ax * qx - ay * qy - az * qz;
  return out;
}
/**
 * Rotates a dual quat by a given quaternion (q * a)
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat} q quaternion to rotate by
 * @param {ReadonlyQuat2} a the dual quaternion to rotate
 * @returns {quat2} out
 */

function rotateByQuatPrepend(out, q, a) {
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3],
      bx = a[0],
      by = a[1],
      bz = a[2],
      bw = a[3];
  out[0] = qx * bw + qw * bx + qy * bz - qz * by;
  out[1] = qy * bw + qw * by + qz * bx - qx * bz;
  out[2] = qz * bw + qw * bz + qx * by - qy * bx;
  out[3] = qw * bw - qx * bx - qy * by - qz * bz;
  bx = a[4];
  by = a[5];
  bz = a[6];
  bw = a[7];
  out[4] = qx * bw + qw * bx + qy * bz - qz * by;
  out[5] = qy * bw + qw * by + qz * bx - qx * bz;
  out[6] = qz * bw + qw * bz + qx * by - qy * bx;
  out[7] = qw * bw - qx * bx - qy * by - qz * bz;
  return out;
}
/**
 * Rotates a dual quat around a given axis. Does the normalisation automatically
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the dual quaternion to rotate
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @param {Number} rad how far the rotation should be
 * @returns {quat2} out
 */

function rotateAroundAxis(out, a, axis, rad) {
  //Special case for rad = 0
  if (Math.abs(rad) < glMatrix.EPSILON) {
    return copy(out, a);
  }

  var axisLength = Math.hypot(axis[0], axis[1], axis[2]);
  rad = rad * 0.5;
  var s = Math.sin(rad);
  var bx = s * axis[0] / axisLength;
  var by = s * axis[1] / axisLength;
  var bz = s * axis[2] / axisLength;
  var bw = Math.cos(rad);
  var ax1 = a[0],
      ay1 = a[1],
      az1 = a[2],
      aw1 = a[3];
  out[0] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[1] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[2] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[3] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  var ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7];
  out[4] = ax * bw + aw * bx + ay * bz - az * by;
  out[5] = ay * bw + aw * by + az * bx - ax * bz;
  out[6] = az * bw + aw * bz + ax * by - ay * bx;
  out[7] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}
/**
 * Adds two dual quat's
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the first operand
 * @param {ReadonlyQuat2} b the second operand
 * @returns {quat2} out
 * @function
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
  return out;
}
/**
 * Multiplies two dual quat's
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the first operand
 * @param {ReadonlyQuat2} b the second operand
 * @returns {quat2} out
 */

function multiply(out, a, b) {
  var ax0 = a[0],
      ay0 = a[1],
      az0 = a[2],
      aw0 = a[3],
      bx1 = b[4],
      by1 = b[5],
      bz1 = b[6],
      bw1 = b[7],
      ax1 = a[4],
      ay1 = a[5],
      az1 = a[6],
      aw1 = a[7],
      bx0 = b[0],
      by0 = b[1],
      bz0 = b[2],
      bw0 = b[3];
  out[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0;
  out[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0;
  out[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0;
  out[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0;
  out[4] = ax0 * bw1 + aw0 * bx1 + ay0 * bz1 - az0 * by1 + ax1 * bw0 + aw1 * bx0 + ay1 * bz0 - az1 * by0;
  out[5] = ay0 * bw1 + aw0 * by1 + az0 * bx1 - ax0 * bz1 + ay1 * bw0 + aw1 * by0 + az1 * bx0 - ax1 * bz0;
  out[6] = az0 * bw1 + aw0 * bz1 + ax0 * by1 - ay0 * bx1 + az1 * bw0 + aw1 * bz0 + ax1 * by0 - ay1 * bx0;
  out[7] = aw0 * bw1 - ax0 * bx1 - ay0 * by1 - az0 * bz1 + aw1 * bw0 - ax1 * bx0 - ay1 * by0 - az1 * bz0;
  return out;
}
/**
 * Alias for {@link quat2.multiply}
 * @function
 */

var mul = (/* unused pure expression or super */ null && (multiply));
/**
 * Scales a dual quat by a scalar number
 *
 * @param {quat2} out the receiving dual quat
 * @param {ReadonlyQuat2} a the dual quat to scale
 * @param {Number} b amount to scale the dual quat by
 * @returns {quat2} out
 * @function
 */

function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  return out;
}
/**
 * Calculates the dot product of two dual quat's (The dot product of the real parts)
 *
 * @param {ReadonlyQuat2} a the first operand
 * @param {ReadonlyQuat2} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */

var dot = _quat_js__rspack_import_1/* .dot */.Om;
/**
 * Performs a linear interpolation between two dual quats's
 * NOTE: The resulting dual quaternions won't always be normalized (The error is most noticeable when t = 0.5)
 *
 * @param {quat2} out the receiving dual quat
 * @param {ReadonlyQuat2} a the first operand
 * @param {ReadonlyQuat2} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat2} out
 */

function lerp(out, a, b, t) {
  var mt = 1 - t;
  if (dot(a, b) < 0) t = -t;
  out[0] = a[0] * mt + b[0] * t;
  out[1] = a[1] * mt + b[1] * t;
  out[2] = a[2] * mt + b[2] * t;
  out[3] = a[3] * mt + b[3] * t;
  out[4] = a[4] * mt + b[4] * t;
  out[5] = a[5] * mt + b[5] * t;
  out[6] = a[6] * mt + b[6] * t;
  out[7] = a[7] * mt + b[7] * t;
  return out;
}
/**
 * Calculates the inverse of a dual quat. If they are normalized, conjugate is cheaper
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a dual quat to calculate inverse of
 * @returns {quat2} out
 */

function invert(out, a) {
  var sqlen = squaredLength(a);
  out[0] = -a[0] / sqlen;
  out[1] = -a[1] / sqlen;
  out[2] = -a[2] / sqlen;
  out[3] = a[3] / sqlen;
  out[4] = -a[4] / sqlen;
  out[5] = -a[5] / sqlen;
  out[6] = -a[6] / sqlen;
  out[7] = a[7] / sqlen;
  return out;
}
/**
 * Calculates the conjugate of a dual quat
 * If the dual quaternion is normalized, this function is faster than quat2.inverse and produces the same result.
 *
 * @param {quat2} out the receiving quaternion
 * @param {ReadonlyQuat2} a quat to calculate conjugate of
 * @returns {quat2} out
 */

function conjugate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  out[4] = -a[4];
  out[5] = -a[5];
  out[6] = -a[6];
  out[7] = a[7];
  return out;
}
/**
 * Calculates the length of a dual quat
 *
 * @param {ReadonlyQuat2} a dual quat to calculate length of
 * @returns {Number} length of a
 * @function
 */

var length = _quat_js__rspack_import_1/* .length */.Bw;
/**
 * Alias for {@link quat2.length}
 * @function
 */

var len = (/* unused pure expression or super */ null && (length));
/**
 * Calculates the squared length of a dual quat
 *
 * @param {ReadonlyQuat2} a dual quat to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */

var squaredLength = _quat_js__rspack_import_1/* .squaredLength */.m3;
/**
 * Alias for {@link quat2.squaredLength}
 * @function
 */

var sqrLen = (/* unused pure expression or super */ null && (squaredLength));
/**
 * Normalize a dual quat
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a dual quaternion to normalize
 * @returns {quat2} out
 * @function
 */

function normalize(out, a) {
  var magnitude = squaredLength(a);

  if (magnitude > 0) {
    magnitude = Math.sqrt(magnitude);
    var a0 = a[0] / magnitude;
    var a1 = a[1] / magnitude;
    var a2 = a[2] / magnitude;
    var a3 = a[3] / magnitude;
    var b0 = a[4];
    var b1 = a[5];
    var b2 = a[6];
    var b3 = a[7];
    var a_dot_b = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;
    out[0] = a0;
    out[1] = a1;
    out[2] = a2;
    out[3] = a3;
    out[4] = (b0 - a0 * a_dot_b) / magnitude;
    out[5] = (b1 - a1 * a_dot_b) / magnitude;
    out[6] = (b2 - a2 * a_dot_b) / magnitude;
    out[7] = (b3 - a3 * a_dot_b) / magnitude;
  }

  return out;
}
/**
 * Returns a string representation of a dual quatenion
 *
 * @param {ReadonlyQuat2} a dual quaternion to represent as a string
 * @returns {String} string representation of the dual quat
 */

function str(a) {
  return "quat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ")";
}
/**
 * Returns whether or not the dual quaternions have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyQuat2} a the first dual quaternion.
 * @param {ReadonlyQuat2} b the second dual quaternion.
 * @returns {Boolean} true if the dual quaternions are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7];
}
/**
 * Returns whether or not the dual quaternions have approximately the same elements in the same position.
 *
 * @param {ReadonlyQuat2} a the first dual quat.
 * @param {ReadonlyQuat2} b the second dual quat.
 * @returns {Boolean} true if the dual quats are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5],
      a6 = a[6],
      a7 = a[7];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3],
      b4 = b[4],
      b5 = b[5],
      b6 = b[6],
      b7 = b[7];
  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7));
}

},
56037(module, __unused_rspack_exports, __webpack_require__) {
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


},
89738(module, __unused_rspack_exports, __webpack_require__) {
/* module decorator */ module = __webpack_require__.nmd(module);
// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
// http://baagoe.com/en/RandomMusings/javascript/
// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Original work is under MIT license -

// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.



(function(global, module, define) {

function Alea(seed) {
  var me = this, mash = Mash();

  me.next = function() {
    var t = 2091639 * me.s0 + me.c * 2.3283064365386963e-10; // 2^-32
    me.s0 = me.s1;
    me.s1 = me.s2;
    return me.s2 = t - (me.c = t | 0);
  };

  // Apply the seeding algorithm from Baagoe.
  me.c = 1;
  me.s0 = mash(' ');
  me.s1 = mash(' ');
  me.s2 = mash(' ');
  me.s0 -= mash(seed);
  if (me.s0 < 0) { me.s0 += 1; }
  me.s1 -= mash(seed);
  if (me.s1 < 0) { me.s1 += 1; }
  me.s2 -= mash(seed);
  if (me.s2 < 0) { me.s2 += 1; }
  mash = null;
}

function copy(f, t) {
  t.c = f.c;
  t.s0 = f.s0;
  t.s1 = f.s1;
  t.s2 = f.s2;
  return t;
}

function impl(seed, opts) {
  var xg = new Alea(seed),
      state = opts && opts.state,
      prng = xg.next;
  prng.int32 = function() { return (xg.next() * 0x100000000) | 0; }
  prng.double = function() {
    return prng() + (prng() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
  };
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

function Mash() {
  var n = 0xefc8249d;

  var mash = function(data) {
    data = String(data);
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  return mash;
}


if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.alea = impl;
}

})(
  this,
   true && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);




},
68415(module, __unused_rspack_exports, __webpack_require__) {
/* module decorator */ module = __webpack_require__.nmd(module);
// A Javascript implementaion of the "Tyche-i" prng algorithm by
// Samuel Neves and Filipe Araujo.
// See https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var b = me.b, c = me.c, d = me.d, a = me.a;
    b = (b << 25) ^ (b >>> 7) ^ c;
    c = (c - d) | 0;
    d = (d << 24) ^ (d >>> 8) ^ a;
    a = (a - b) | 0;
    me.b = b = (b << 20) ^ (b >>> 12) ^ c;
    me.c = c = (c - d) | 0;
    me.d = (d << 16) ^ (c >>> 16) ^ a;
    return me.a = (a - b) | 0;
  };

  /* The following is non-inverted tyche, which has better internal
   * bit diffusion, but which is about 25% slower than tyche-i in JS.
  me.next = function() {
    var a = me.a, b = me.b, c = me.c, d = me.d;
    a = (me.a + me.b | 0) >>> 0;
    d = me.d ^ a; d = d << 16 ^ d >>> 16;
    c = me.c + d | 0;
    b = me.b ^ c; b = b << 12 ^ d >>> 20;
    me.a = a = a + b | 0;
    d = d ^ a; me.d = d = d << 8 ^ d >>> 24;
    me.c = c = c + d | 0;
    b = b ^ c;
    return me.b = (b << 7 ^ b >>> 25);
  }
  */

  me.a = 0;
  me.b = 0;
  me.c = 2654435769 | 0;
  me.d = 1367130551;

  if (seed === Math.floor(seed)) {
    // Integer seed.
    me.a = (seed / 0x100000000) | 0;
    me.b = seed | 0;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 20; k++) {
    me.b ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.a = f.a;
  t.b = f.b;
  t.c = f.c;
  t.d = f.d;
  return t;
};

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.tychei = impl;
}

})(
  this,
   true && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);




},
81327(module, __unused_rspack_exports, __webpack_require__) {
/* module decorator */ module = __webpack_require__.nmd(module);
// A Javascript implementaion of the "xor128" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;

  // Set up generator function.
  me.next = function() {
    var t = me.x ^ (me.x << 11);
    me.x = me.y;
    me.y = me.z;
    me.z = me.w;
    return me.w ^= (me.w >>> 19) ^ t ^ (t >>> 8);
  };

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xor128 = impl;
}

})(
  this,
   true && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);




},
95967(module, __unused_rspack_exports, __webpack_require__) {
/* module decorator */ module = __webpack_require__.nmd(module);
// A Javascript implementaion of Richard Brent's Xorgens xor4096 algorithm.
//
// This fast non-cryptographic random number generator is designed for
// use in Monte-Carlo algorithms. It combines a long-period xorshift
// generator with a Weyl generator, and it passes all common batteries
// of stasticial tests for randomness while consuming only a few nanoseconds
// for each prng generated.  For background on the generator, see Brent's
// paper: "Some long-period random number generators using shifts and xors."
// http://arxiv.org/pdf/1004.3115v1.pdf
//
// Usage:
//
// var xor4096 = require('xor4096');
// random = xor4096(1);                        // Seed with int32 or string.
// assert.equal(random(), 0.1520436450538547); // (0, 1) range, 53 bits.
// assert.equal(random.int32(), 1806534897);   // signed int32, 32 bits.
//
// For nonzero numeric keys, this impelementation provides a sequence
// identical to that by Brent's xorgens 3 implementaion in C.  This
// implementation also provides for initalizing the generator with
// string seeds, or for saving and restoring the state of the generator.
//
// On Chrome, this prng benchmarks about 2.1 times slower than
// Javascript's built-in Math.random().

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    var w = me.w,
        X = me.X, i = me.i, t, v;
    // Update Weyl generator.
    me.w = w = (w + 0x61c88647) | 0;
    // Update xor generator.
    v = X[(i + 34) & 127];
    t = X[i = ((i + 1) & 127)];
    v ^= v << 13;
    t ^= t << 17;
    v ^= v >>> 15;
    t ^= t >>> 12;
    // Update Xor generator array state.
    v = X[i] = v ^ t;
    me.i = i;
    // Result is the combination.
    return (v + (w ^ (w >>> 16))) | 0;
  };

  function init(me, seed) {
    var t, v, i, j, w, X = [], limit = 128;
    if (seed === (seed | 0)) {
      // Numeric seeds initialize v, which is used to generates X.
      v = seed;
      seed = null;
    } else {
      // String seeds are mixed into v and X one character at a time.
      seed = seed + '\0';
      v = 0;
      limit = Math.max(limit, seed.length);
    }
    // Initialize circular array and weyl value.
    for (i = 0, j = -32; j < limit; ++j) {
      // Put the unicode characters into the array, and shuffle them.
      if (seed) v ^= seed.charCodeAt((j + 32) % seed.length);
      // After 32 shuffles, take v as the starting w value.
      if (j === 0) w = v;
      v ^= v << 10;
      v ^= v >>> 15;
      v ^= v << 4;
      v ^= v >>> 13;
      if (j >= 0) {
        w = (w + 0x61c88647) | 0;     // Weyl.
        t = (X[j & 127] ^= (v + w));  // Combine xor and weyl to init array.
        i = (0 == t) ? i + 1 : 0;     // Count zeroes.
      }
    }
    // We have detected all zeroes; make the key nonzero.
    if (i >= 128) {
      X[(seed && seed.length || 0) & 127] = -1;
    }
    // Run the generator 512 times to further mix the state before using it.
    // Factoring this as a function slows the main generator, so it is just
    // unrolled here.  The weyl generator is not advanced while warming up.
    i = 127;
    for (j = 4 * 128; j > 0; --j) {
      v = X[(i + 34) & 127];
      t = X[i = ((i + 1) & 127)];
      v ^= v << 13;
      t ^= t << 17;
      v ^= v >>> 15;
      t ^= t >>> 12;
      X[i] = v ^ t;
    }
    // Storing state as object members is faster than using closure variables.
    me.w = w;
    me.X = X;
    me.i = i;
  }

  init(me, seed);
}

function copy(f, t) {
  t.i = f.i;
  t.w = f.w;
  t.X = f.X.slice();
  return t;
};

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.X) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xor4096 = impl;
}

})(
  this,                                     // window object or global
   true && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);


},
49329(module, __unused_rspack_exports, __webpack_require__) {
/* module decorator */ module = __webpack_require__.nmd(module);
// A Javascript implementaion of the "xorshift7" algorithm by
// François Panneton and Pierre L'ecuyer:
// "On the Xorgshift Random Number Generators"
// http://saluc.engr.uconn.edu/refs/crypto/rng/panneton05onthexorshift.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    // Update xor generator.
    var X = me.x, i = me.i, t, v, w;
    t = X[i]; t ^= (t >>> 7); v = t ^ (t << 24);
    t = X[(i + 1) & 7]; v ^= t ^ (t >>> 10);
    t = X[(i + 3) & 7]; v ^= t ^ (t >>> 3);
    t = X[(i + 4) & 7]; v ^= t ^ (t << 7);
    t = X[(i + 7) & 7]; t = t ^ (t << 13); v ^= t ^ (t << 9);
    X[i] = v;
    me.i = (i + 1) & 7;
    return v;
  };

  function init(me, seed) {
    var j, w, X = [];

    if (seed === (seed | 0)) {
      // Seed state array using a 32-bit integer.
      w = X[0] = seed;
    } else {
      // Seed state using a string.
      seed = '' + seed;
      for (j = 0; j < seed.length; ++j) {
        X[j & 7] = (X[j & 7] << 15) ^
            (seed.charCodeAt(j) + X[(j + 1) & 7] << 13);
      }
    }
    // Enforce an array length of 8, not all zeroes.
    while (X.length < 8) X.push(0);
    for (j = 0; j < 8 && X[j] === 0; ++j);
    if (j == 8) w = X[7] = -1; else w = X[j];

    me.x = X;
    me.i = 0;

    // Discard an initial 256 values.
    for (j = 256; j > 0; --j) {
      me.next();
    }
  }

  init(me, seed);
}

function copy(f, t) {
  t.x = f.x.slice();
  t.i = f.i;
  return t;
}

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.x) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xorshift7 = impl;
}

})(
  this,
   true && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},
21897(module, __unused_rspack_exports, __webpack_require__) {
/* module decorator */ module = __webpack_require__.nmd(module);
// A Javascript implementaion of the "xorwow" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var t = (me.x ^ (me.x >>> 2));
    me.x = me.y; me.y = me.z; me.z = me.w; me.w = me.v;
    return (me.d = (me.d + 362437 | 0)) +
       (me.v = (me.v ^ (me.v << 4)) ^ (t ^ (t << 1))) | 0;
  };

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;
  me.v = 0;

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    if (k == strseed.length) {
      me.d = me.x << 10 ^ me.x >>> 4;
    }
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  t.v = f.v;
  t.d = f.d;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xorwow = impl;
}

})(
  this,
   true && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);




},
17663(module, __unused_rspack_exports, __webpack_require__) {
/*
Copyright 2019 David Bau.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

(function (global, pool, math) {
//
// The following constants are related to IEEE 754 limits.
//

var width = 256,        // each RC4 output is 0 <= x < 256
    chunks = 6,         // at least six RC4 outputs for each double
    digits = 52,        // there are 52 significant digits in a double
    rngname = 'random', // rngname: name for Math.random and Math.seedrandom
    startdenom = math.pow(width, chunks),
    significance = math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1,
    nodecrypto;         // node.js crypto module, initialized at the bottom.

//
// seedrandom()
// This is the seedrandom function described above.
//
function seedrandom(seed, options, callback) {
  var key = [];
  options = (options == true) ? { entropy: true } : (options || {});

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    options.entropy ? [seed, tostring(pool)] :
    (seed == null) ? autoseed() : seed, 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.
  var prng = function() {
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };

  prng.int32 = function() { return arc4.g(4) | 0; }
  prng.quick = function() { return arc4.g(4) / 0x100000000; }
  prng.double = prng;

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Calling convention: what to return as a function of prng, seed, is_math.
  return (options.pass || callback ||
      function(prng, seed, is_math_call, state) {
        if (state) {
          // Load the arc4 state from the given state if it has an S array.
          if (state.S) { copy(state, arc4); }
          // Only provide the .state method if requested via options.state.
          prng.state = function() { return copy(arc4, {}); }
        }

        // If called as a method of Math (Math.seedrandom()), mutate
        // Math.random because that is how seedrandom.js has worked since v1.0.
        if (is_math_call) { math[rngname] = prng; return seed; }

        // Otherwise, it is a newer calling convention, so return the
        // prng directly.
        else return prng;
      })(
  prng,
  shortseed,
  'global' in options ? options.global : (this == math),
  options.state);
}

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability, the function call below automatically
    // discards an initial batch of values.  This is called RC4-drop[256].
    // See http://google.com/search?q=rsa+fluhrer+response&btnI
  })(width);
}

//
// copy()
// Copies internal state of ARC4 to or from a plain object.
//
function copy(f, t) {
  t.i = f.i;
  t.j = f.j;
  t.S = f.S.slice();
  return t;
};

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj), prop;
  if (depth && typ == 'object') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 'string' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto and Node crypto
// module if available.
//
function autoseed() {
  try {
    var out;
    if (nodecrypto && (out = nodecrypto.randomBytes)) {
      // The use of 'out' to remember randomBytes makes tight minified code.
      out = out(width);
    } else {
      out = new Uint8Array(width);
      (global.crypto || global.msCrypto).getRandomValues(out);
    }
    return tostring(out);
  } catch (e) {
    var browser = global.navigator,
        plugins = browser && browser.plugins;
    return [+new Date, global, plugins, global.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to interfere with deterministic PRNG state later,
// seedrandom will not call math.random on its own again after
// initialization.
//
mixkey(math.random(), pool);

//
// Nodejs and AMD support: export the implementation as a module using
// either convention.
//
if ( true && module.exports) {
  module.exports = seedrandom;
  // When in node.js, try using crypto package for autoseeding.
  try {
    nodecrypto = __webpack_require__(51791);
  } catch (ex) {}
} else if ((typeof define) == 'function' && define.amd) {
  define(function() { return seedrandom; });
} else {
  // When included as a plain script, set up Math.seedrandom global.
  math['seed' + rngname] = seedrandom;
}


// End anonymous scope, and pass initial values.
})(
  // global: `self` in browsers (including strict mode and web workers),
  // otherwise `this` in Node and other environments
  (typeof self !== 'undefined') ? self : this,
  [],     // pool: entropy pool starts empty
  Math    // math: package containing random, pow, and seedrandom
);


},
62209(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (ClassHierarchy)
});
//#region Sources/Common/Core/ClassHierarchy/index.js
var ClassHierarchy = class extends Array {
	push() {
		for (let i = 0; i < arguments.length; i++) if (!this.includes(arguments[i])) super.push(arguments[i]);
		return this.length;
	}
};
//#endregion


//# sourceMappingURL=ClassHierarchy.js.map

},
29330(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  GY: () => (IDENTITY_3X3),
  p8: () => (EPSILON),
  zK: () => (IDENTITY)
});
//#region Sources/Common/Core/Math/Constants.js
var IDENTITY = [
	1,
	0,
	0,
	0,
	0,
	1,
	0,
	0,
	0,
	0,
	1,
	0,
	0,
	0,
	0,
	1
];
var IDENTITY_3X3 = [
	1,
	0,
	0,
	0,
	1,
	0,
	0,
	0,
	1
];
var EPSILON = 1e-6;
var VTK_SMALL_NUMBER = 1e-12;
var Constants_default = (/* unused pure expression or super */ null && ({
	IDENTITY,
	IDENTITY_3X3,
	EPSILON,
	VTK_SMALL_NUMBER
}));
//#endregion


//# sourceMappingURL=Constants.js.map

},
24377(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (BoundingBox_default)
});
/* import */ var _Core_Math_js__rspack_import_0 = __webpack_require__(91352);
/* import */ var _Plane_js__rspack_import_1 = __webpack_require__(49794);
/* import */ var gl_matrix__rspack_import_2 = __webpack_require__(40230);



//#region Sources/Common/DataModel/BoundingBox/index.js
var INIT_BOUNDS = [
	Number.MAX_VALUE,
	-Number.MAX_VALUE,
	Number.MAX_VALUE,
	-Number.MAX_VALUE,
	Number.MAX_VALUE,
	-Number.MAX_VALUE
];
function equals(a, b) {
	return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
}
function isValid(bounds) {
	return bounds?.length >= 6 && bounds[0] <= bounds[1] && bounds[2] <= bounds[3] && bounds[4] <= bounds[5];
}
function setBounds(bounds, otherBounds) {
	bounds[0] = otherBounds[0];
	bounds[1] = otherBounds[1];
	bounds[2] = otherBounds[2];
	bounds[3] = otherBounds[3];
	bounds[4] = otherBounds[4];
	bounds[5] = otherBounds[5];
	return bounds;
}
function reset(bounds) {
	return setBounds(bounds, INIT_BOUNDS);
}
function addPoint(bounds, xOrPoint, y, z) {
	const [xMin, xMax, yMin, yMax, zMin, zMax] = bounds;
	if (typeof xOrPoint === "number") {
		bounds[0] = xMin < xOrPoint ? xMin : xOrPoint;
		bounds[1] = xMax > xOrPoint ? xMax : xOrPoint;
		bounds[2] = yMin < y ? yMin : y;
		bounds[3] = yMax > y ? yMax : y;
		bounds[4] = zMin < z ? zMin : z;
		bounds[5] = zMax > z ? zMax : z;
	} else {
		bounds[0] = xMin < xOrPoint[0] ? xMin : xOrPoint[0];
		bounds[1] = xMax > xOrPoint[0] ? xMax : xOrPoint[0];
		bounds[2] = yMin < xOrPoint[1] ? yMin : xOrPoint[1];
		bounds[3] = yMax > xOrPoint[1] ? yMax : xOrPoint[1];
		bounds[4] = zMin < xOrPoint[2] ? zMin : xOrPoint[2];
		bounds[5] = zMax > xOrPoint[2] ? zMax : xOrPoint[2];
	}
	return bounds;
}
function addPoints(bounds, points) {
	if (points.length === 0) return bounds;
	if (Array.isArray(points[0])) for (let i = 0; i < points.length; ++i) addPoint(bounds, ...points[i]);
	else for (let i = 0; i < points.length; i += 3) addPoint(bounds, ...points.slice(i, i + 3));
	return bounds;
}
function addBounds(bounds, xMin, xMax, yMin, yMax, zMin, zMax) {
	const [_xMin, _xMax, _yMin, _yMax, _zMin, _zMax] = bounds;
	if (zMax === void 0) {
		bounds[0] = Math.min(xMin[0], _xMin);
		bounds[1] = Math.max(xMin[1], _xMax);
		bounds[2] = Math.min(xMin[2], _yMin);
		bounds[3] = Math.max(xMin[3], _yMax);
		bounds[4] = Math.min(xMin[4], _zMin);
		bounds[5] = Math.max(xMin[5], _zMax);
	} else {
		bounds[0] = Math.min(xMin, _xMin);
		bounds[1] = Math.max(xMax, _xMax);
		bounds[2] = Math.min(yMin, _yMin);
		bounds[3] = Math.max(yMax, _yMax);
		bounds[4] = Math.min(zMin, _zMin);
		bounds[5] = Math.max(zMax, _zMax);
	}
	return bounds;
}
function setMinPoint(bounds, x, y, z) {
	const [xMin, xMax, yMin, yMax, zMin, zMax] = bounds;
	bounds[0] = x;
	bounds[1] = x > xMax ? x : xMax;
	bounds[2] = y;
	bounds[3] = y > yMax ? y : yMax;
	bounds[4] = z;
	bounds[5] = z > zMax ? z : zMax;
	return xMin !== x || yMin !== y || zMin !== z;
}
function setMaxPoint(bounds, x, y, z) {
	const [xMin, xMax, yMin, yMax, zMin, zMax] = bounds;
	bounds[0] = x < xMin ? x : xMin;
	bounds[1] = x;
	bounds[2] = y < yMin ? y : yMin;
	bounds[3] = y;
	bounds[4] = z < zMin ? z : zMin;
	bounds[5] = z;
	return xMax !== x || yMax !== y || zMax !== z;
}
function inflate(bounds, delta) {
	if (delta == null) return minInflate(bounds);
	bounds[0] -= delta;
	bounds[1] += delta;
	bounds[2] -= delta;
	bounds[3] += delta;
	bounds[4] -= delta;
	bounds[5] += delta;
	return bounds;
}
function minInflate(bounds) {
	const nonZero = [
		0,
		0,
		0
	];
	let maxIdx = -1;
	let max = 0;
	let w = 0;
	for (let i = 0; i < 3; ++i) {
		w = bounds[i * 2 + 1] - bounds[i * 2];
		if (w > max) {
			max = w;
			maxIdx = i;
		}
		nonZero[i] = w > 0 ? 1 : 0;
	}
	if (maxIdx < 0) return inflate(bounds, .5);
	for (let i = 0; i < 3; ++i) if (!nonZero[i]) {
		const d = .005 * max;
		bounds[i * 2] -= d;
		bounds[i * 2 + 1] += d;
	}
	return bounds;
}
function scale(bounds, sx, sy, sz) {
	if (!isValid(bounds)) return false;
	if (sx >= 0) {
		bounds[0] *= sx;
		bounds[1] *= sx;
	} else {
		bounds[0] = sx * bounds[1];
		bounds[1] = sx * bounds[0];
	}
	if (sy >= 0) {
		bounds[2] *= sy;
		bounds[3] *= sy;
	} else {
		bounds[2] = sy * bounds[3];
		bounds[3] = sy * bounds[2];
	}
	if (sz >= 0) {
		bounds[4] *= sz;
		bounds[5] *= sz;
	} else {
		bounds[4] = sz * bounds[5];
		bounds[5] = sz * bounds[4];
	}
	return true;
}
function getCenter(bounds) {
	return [
		.5 * (bounds[0] + bounds[1]),
		.5 * (bounds[2] + bounds[3]),
		.5 * (bounds[4] + bounds[5])
	];
}
function scaleAboutCenter(bounds, sx, sy, sz) {
	if (!isValid(bounds)) return false;
	const center = getCenter(bounds);
	bounds[0] -= center[0];
	bounds[1] -= center[0];
	bounds[2] -= center[1];
	bounds[3] -= center[1];
	bounds[4] -= center[2];
	bounds[5] -= center[2];
	scale(bounds, sx, sy, sz);
	bounds[0] += center[0];
	bounds[1] += center[0];
	bounds[2] += center[1];
	bounds[3] += center[1];
	bounds[4] += center[2];
	bounds[5] += center[2];
	return true;
}
function getLength(bounds, index) {
	return bounds[index * 2 + 1] - bounds[index * 2];
}
function getLengths(bounds) {
	return [
		getLength(bounds, 0),
		getLength(bounds, 1),
		getLength(bounds, 2)
	];
}
function getXRange(bounds) {
	return bounds.slice(0, 2);
}
function getYRange(bounds) {
	return bounds.slice(2, 4);
}
function getZRange(bounds) {
	return bounds.slice(4, 6);
}
function getMaxLength(bounds) {
	const l = getLengths(bounds);
	if (l[0] > l[1]) {
		if (l[0] > l[2]) return l[0];
		return l[2];
	}
	if (l[1] > l[2]) return l[1];
	return l[2];
}
function getDiagonalLength2(bounds) {
	if (isValid(bounds)) {
		const l = getLengths(bounds);
		return l[0] * l[0] + l[1] * l[1] + l[2] * l[2];
	}
	return null;
}
function getDiagonalLength(bounds) {
	const lenght2 = getDiagonalLength2(bounds);
	return lenght2 !== null ? Math.sqrt(lenght2) : null;
}
function getMinPoint(bounds) {
	return [
		bounds[0],
		bounds[2],
		bounds[4]
	];
}
function getMaxPoint(bounds) {
	return [
		bounds[1],
		bounds[3],
		bounds[5]
	];
}
function oppositeSign(a, b) {
	return a <= 0 && b >= 0 || a >= 0 && b <= 0;
}
function getCorners(bounds, corners) {
	corners[0] = [
		bounds[0],
		bounds[2],
		bounds[4]
	];
	corners[1] = [
		bounds[0],
		bounds[2],
		bounds[5]
	];
	corners[2] = [
		bounds[0],
		bounds[3],
		bounds[4]
	];
	corners[3] = [
		bounds[0],
		bounds[3],
		bounds[5]
	];
	corners[4] = [
		bounds[1],
		bounds[2],
		bounds[4]
	];
	corners[5] = [
		bounds[1],
		bounds[2],
		bounds[5]
	];
	corners[6] = [
		bounds[1],
		bounds[3],
		bounds[4]
	];
	corners[7] = [
		bounds[1],
		bounds[3],
		bounds[5]
	];
	return corners;
}
function computeCornerPoints(bounds, point1, point2) {
	point1[0] = bounds[0];
	point1[1] = bounds[2];
	point1[2] = bounds[4];
	point2[0] = bounds[1];
	point2[1] = bounds[3];
	point2[2] = bounds[5];
	return point1;
}
function transformBounds(bounds, transform, out = []) {
	const corners = getCorners(bounds, []);
	for (let i = 0; i < corners.length; ++i) gl_matrix__rspack_import_2/* .vec3.transformMat4 */.eR.Z0(corners[i], corners[i], transform);
	reset(out);
	return addPoints(out, corners);
}
function computeScale3(bounds, scale3 = []) {
	scale3[0] = .5 * (bounds[1] - bounds[0]);
	scale3[1] = .5 * (bounds[3] - bounds[2]);
	scale3[2] = .5 * (bounds[5] - bounds[4]);
	return scale3;
}
/**
* Compute local bounds.
* Not as fast as vtkPoints.getBounds() if u, v, w form a natural basis.
* @param {vtkPoints} points
* @param {array} u first vector
* @param {array} v second vector
* @param {array} w third vector
*/
function computeLocalBounds(points, u, v, w) {
	const bounds = [].concat(INIT_BOUNDS);
	const pointsData = points.getData();
	for (let i = 0; i < pointsData.length; i += 3) {
		const point = [
			pointsData[i],
			pointsData[i + 1],
			pointsData[i + 2]
		];
		const du = (0,_Core_Math_js__rspack_import_0/* .dot */.Om)(point, u);
		bounds[0] = Math.min(du, bounds[0]);
		bounds[1] = Math.max(du, bounds[1]);
		const dv = (0,_Core_Math_js__rspack_import_0/* .dot */.Om)(point, v);
		bounds[2] = Math.min(dv, bounds[2]);
		bounds[3] = Math.max(dv, bounds[3]);
		const dw = (0,_Core_Math_js__rspack_import_0/* .dot */.Om)(point, w);
		bounds[4] = Math.min(dw, bounds[4]);
		bounds[5] = Math.max(dw, bounds[5]);
	}
	return bounds;
}
function intersectBox(bounds, origin, dir, coord, tolerance) {
	let inside = true;
	const quadrant = [];
	let whichPlane = 0;
	const maxT = [];
	const candidatePlane = [
		0,
		0,
		0
	];
	const RIGHT = 0;
	const LEFT = 1;
	const MIDDLE = 2;
	for (let i = 0; i < 3; i++) if (origin[i] < bounds[2 * i]) {
		quadrant[i] = LEFT;
		candidatePlane[i] = bounds[2 * i];
		inside = false;
	} else if (origin[i] > bounds[2 * i + 1]) {
		quadrant[i] = RIGHT;
		candidatePlane[i] = bounds[2 * i + 1];
		inside = false;
	} else quadrant[i] = MIDDLE;
	if (inside) {
		coord[0] = origin[0];
		coord[1] = origin[1];
		coord[2] = origin[2];
		tolerance[0] = 0;
		return 1;
	}
	for (let i = 0; i < 3; i++) if (quadrant[i] !== MIDDLE && dir[i] !== 0) maxT[i] = (candidatePlane[i] - origin[i]) / dir[i];
	else maxT[i] = -1;
	for (let i = 0; i < 3; i++) if (maxT[whichPlane] < maxT[i]) whichPlane = i;
	if (maxT[whichPlane] > 1 || maxT[whichPlane] < 0) return 0;
	tolerance[0] = maxT[whichPlane];
	for (let i = 0; i < 3; i++) if (whichPlane !== i) {
		coord[i] = origin[i] + maxT[whichPlane] * dir[i];
		if (coord[i] < bounds[2 * i] || coord[i] > bounds[2 * i + 1]) return 0;
	} else coord[i] = candidatePlane[i];
	return 1;
}
function intersectPlane(bounds, origin, normal) {
	const p = [];
	let d = 0;
	let sign = 1;
	let firstOne = 1;
	for (let z = 4; z <= 5; ++z) {
		p[2] = bounds[z];
		for (let y = 2; y <= 3; ++y) {
			p[1] = bounds[y];
			for (let x = 0; x <= 1; ++x) {
				p[0] = bounds[x];
				d = _Plane_js__rspack_import_1/* ["default"].evaluate */.Ay.evaluate(normal, origin, p);
				if (firstOne) {
					sign = d >= 0 ? 1 : -1;
					firstOne = 0;
				}
				if (d === 0 || sign > 0 && d < 0 || sign < 0 && d > 0) return 1;
			}
		}
	}
	return 0;
}
function intersect(bounds, bBounds) {
	if (!(isValid(bounds) && isValid(bBounds))) return false;
	const newBounds = [
		0,
		0,
		0,
		0,
		0,
		0
	];
	let intersection;
	for (let i = 0; i < 3; i++) {
		intersection = false;
		if (bBounds[i * 2] >= bounds[i * 2] && bBounds[i * 2] <= bounds[i * 2 + 1]) {
			intersection = true;
			newBounds[i * 2] = bBounds[i * 2];
		} else if (bounds[i * 2] >= bBounds[i * 2] && bounds[i * 2] <= bBounds[i * 2 + 1]) {
			intersection = true;
			newBounds[i * 2] = bounds[i * 2];
		}
		if (bBounds[i * 2 + 1] >= bounds[i * 2] && bBounds[i * 2 + 1] <= bounds[i * 2 + 1]) {
			intersection = true;
			newBounds[i * 2 + 1] = bBounds[2 * i + 1];
		} else if (bounds[i * 2 + 1] >= bBounds[i * 2] && bounds[i * 2 + 1] <= bBounds[i * 2 + 1]) {
			intersection = true;
			newBounds[i * 2 + 1] = bounds[i * 2 + 1];
		}
		if (!intersection) return false;
	}
	bounds[0] = newBounds[0];
	bounds[1] = newBounds[1];
	bounds[2] = newBounds[2];
	bounds[3] = newBounds[3];
	bounds[4] = newBounds[4];
	bounds[5] = newBounds[5];
	return true;
}
function intersects(bounds, bBounds) {
	if (!(isValid(bounds) && isValid(bBounds))) return false;
	for (let i = 0; i < 3; i++) {
		if (bBounds[i * 2] >= bounds[i * 2] && bBounds[i * 2] <= bounds[i * 2 + 1]) continue;
		else if (bounds[i * 2] >= bBounds[i * 2] && bounds[i * 2] <= bBounds[i * 2 + 1]) continue;
		if (bBounds[i * 2 + 1] >= bounds[i * 2] && bBounds[i * 2 + 1] <= bounds[i * 2 + 1]) continue;
		else if (bounds[i * 2 + 1] >= bBounds[i * 2] && bounds[i * 2 + 1] <= bBounds[i * 2 + 1]) continue;
		return false;
	}
	return true;
}
function containsPoint(bounds, x, y, z) {
	if (x < bounds[0] || x > bounds[1]) return false;
	if (y < bounds[2] || y > bounds[3]) return false;
	if (z < bounds[4] || z > bounds[5]) return false;
	return true;
}
function contains(bounds, otherBounds) {
	if (!intersects(bounds, otherBounds)) return false;
	if (!containsPoint(bounds, ...getMinPoint(otherBounds))) return false;
	if (!containsPoint(bounds, ...getMaxPoint(otherBounds))) return false;
	return true;
}
/**
* Returns true if plane intersects bounding box.
* If so, the box is cut by the plane
* @param {array} origin
* @param {array} normal
*/
function cutWithPlane(bounds, origin, normal) {
	const index = [
		[
			0,
			1,
			2,
			3,
			4,
			5,
			6,
			7
		],
		[
			0,
			1,
			4,
			5,
			2,
			3,
			6,
			7
		],
		[
			0,
			2,
			4,
			6,
			1,
			3,
			5,
			7
		]
	];
	const d = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];
	let idx = 0;
	for (let ix = 0; ix < 2; ix++) for (let iy = 2; iy < 4; iy++) for (let iz = 4; iz < 6; iz++) {
		const x = [
			bounds[ix],
			bounds[iy],
			bounds[iz]
		];
		d[idx++] = _Plane_js__rspack_import_1/* ["default"].evaluate */.Ay.evaluate(normal, origin, x);
	}
	let dir = 2;
	while (dir--) if (oppositeSign(d[index[dir][0]], d[index[dir][4]]) && oppositeSign(d[index[dir][1]], d[index[dir][5]]) && oppositeSign(d[index[dir][2]], d[index[dir][6]]) && oppositeSign(d[index[dir][3]], d[index[dir][7]])) break;
	if (dir < 0) return false;
	const sign = Math.sign(normal[dir]);
	const size = Math.abs((bounds[dir * 2 + 1] - bounds[dir * 2]) * normal[dir]);
	let t = sign > 0 ? 1 : 0;
	for (let i = 0; i < 4; i++) {
		if (size === 0) continue;
		const ti = Math.abs(d[index[dir][i]]) / size;
		if (sign > 0 && ti < t) t = ti;
		if (sign < 0 && ti > t) t = ti;
	}
	const bound = (1 - t) * bounds[dir * 2] + t * bounds[dir * 2 + 1];
	if (sign > 0) bounds[dir * 2] = bound;
	else bounds[dir * 2 + 1] = bound;
	return true;
}
/**
* Clamp the divisions to ensure the total number doesn't exceed targetBins
* @param {Number} targetBins - Maximum number of bins allowed
* @param {Array} divs - Divisions array to adjust [divX, divY, divZ]
*/
function clampDivisions(targetBins, divs) {
	for (let i = 0; i < 3; ++i) divs[i] = divs[i] < 1 ? 1 : divs[i];
	let numBins = divs[0] * divs[1] * divs[2];
	while (numBins > targetBins) {
		for (let i = 0; i < 3; ++i) divs[i] = divs[i] > 1 ? divs[i] - 1 : 1;
		numBins = divs[0] * divs[1] * divs[2];
	}
}
/**
* Compute the number of divisions given the current bounding box and a
* target number of buckets/bins. Handles degenerate bounding boxes properly.
* @param {Bounds} bounds - The bounding box
* @param {Number} totalBins - Target number of bins
* @param {Array} divs - Output array to store divisions [divX, divY, divZ]
* @param {Array} [adjustedBounds] - Output array to store adjusted bounds if needed
* @returns {Number} The actual total number of bins
*/
function computeDivisions(bounds, totalBins, divs, adjustedBounds = []) {
	totalBins = totalBins <= 0 ? 1 : totalBins;
	let numNonZero = 0;
	const nonZero = [
		0,
		0,
		0
	];
	let maxIdx = -1;
	let max = 0;
	const lengths = getLengths(bounds);
	const totLen = lengths[0] + lengths[1] + lengths[2];
	const zeroDetectionTolerance = totLen * (.001 / 3);
	for (let i = 0; i < 3; ++i) {
		if (lengths[i] > max) {
			maxIdx = i;
			max = lengths[i];
		}
		if (lengths[i] > zeroDetectionTolerance) {
			nonZero[i] = 1;
			numNonZero++;
		} else nonZero[i] = 0;
	}
	const minPoint = getMinPoint(bounds);
	const maxPoint = getMaxPoint(bounds);
	if (numNonZero < 1) {
		divs[0] = 1;
		divs[1] = 1;
		divs[2] = 1;
		adjustedBounds[0] = minPoint[0] - .5;
		adjustedBounds[1] = maxPoint[0] + .5;
		adjustedBounds[2] = minPoint[1] - .5;
		adjustedBounds[3] = maxPoint[1] + .5;
		adjustedBounds[4] = minPoint[2] - .5;
		adjustedBounds[5] = maxPoint[2] + .5;
		return 1;
	}
	let f = totalBins;
	f /= nonZero[0] ? lengths[0] / totLen : 1;
	f /= nonZero[1] ? lengths[1] / totLen : 1;
	f /= nonZero[2] ? lengths[2] / totLen : 1;
	f **= 1 / numNonZero;
	for (let i = 0; i < 3; ++i) {
		divs[i] = nonZero[i] ? Math.floor(f * lengths[i] / totLen) : 1;
		divs[i] = divs[i] < 1 ? 1 : divs[i];
	}
	clampDivisions(totalBins, divs);
	const delta = .5 * lengths[maxIdx] / divs[maxIdx];
	for (let i = 0; i < 3; ++i) if (nonZero[i]) {
		adjustedBounds[2 * i] = minPoint[i];
		adjustedBounds[2 * i + 1] = maxPoint[i];
	} else {
		adjustedBounds[2 * i] = minPoint[i] - delta;
		adjustedBounds[2 * i + 1] = maxPoint[i] + delta;
	}
	return divs[0] * divs[1] * divs[2];
}
/**
* Calculate the squared distance from point x to the specified bounds.
* @param {Vector3} x  The point coordinates
* @param {Bounds} bounds  The bounding box coordinates
* @returns {Number} The squared distance to the bounds
*/
function distance2ToBounds(x, bounds) {
	if (x[0] >= bounds[0] && x[0] <= bounds[1] && x[1] >= bounds[2] && x[1] <= bounds[3] && x[2] >= bounds[4] && x[2] <= bounds[5]) return 0;
	const deltas = [
		0,
		0,
		0
	];
	if (x[0] < bounds[0]) deltas[0] = bounds[0] - x[0];
	else if (x[0] > bounds[1]) deltas[0] = x[0] - bounds[1];
	if (x[1] < bounds[2]) deltas[1] = bounds[2] - x[1];
	else if (x[1] > bounds[3]) deltas[1] = x[1] - bounds[3];
	if (x[2] < bounds[4]) deltas[2] = bounds[4] - x[2];
	else if (x[2] > bounds[5]) deltas[2] = x[2] - bounds[5];
	return (0,_Core_Math_js__rspack_import_0/* .dot */.Om)(deltas, deltas);
}
var BoundingBox = class {
	constructor(refBounds) {
		this.bounds = refBounds;
		if (!this.bounds) this.bounds = new Float64Array(INIT_BOUNDS);
	}
	getBounds() {
		return this.bounds;
	}
	equals(otherBounds) {
		return equals(this.bounds, otherBounds);
	}
	isValid() {
		return isValid(this.bounds);
	}
	setBounds(otherBounds) {
		return setBounds(this.bounds, otherBounds);
	}
	reset() {
		return reset(this.bounds);
	}
	addPoint(...xyz) {
		return addPoint(this.bounds, ...xyz);
	}
	addPoints(points) {
		return addPoints(this.bounds, points);
	}
	addBounds(xMin, xMax, yMin, yMax, zMin, zMax) {
		return addBounds(this.bounds, xMin, xMax, yMin, yMax, zMin, zMax);
	}
	setMinPoint(x, y, z) {
		return setMinPoint(this.bounds, x, y, z);
	}
	setMaxPoint(x, y, z) {
		return setMaxPoint(this.bounds, x, y, z);
	}
	inflate(delta) {
		return inflate(this.bounds, delta);
	}
	scale(sx, sy, sz) {
		return scale(this.bounds, sx, sy, sz);
	}
	getCenter() {
		return getCenter(this.bounds);
	}
	getLength(index) {
		return getLength(this.bounds, index);
	}
	getLengths() {
		return getLengths(this.bounds);
	}
	getMaxLength() {
		return getMaxLength(this.bounds);
	}
	getDiagonalLength() {
		return getDiagonalLength(this.bounds);
	}
	getDiagonalLength2() {
		return getDiagonalLength2(this.bounds);
	}
	getMinPoint() {
		return getMinPoint(this.bounds);
	}
	getMaxPoint() {
		return getMaxPoint(this.bounds);
	}
	getXRange() {
		return getXRange(this.bounds);
	}
	getYRange() {
		return getYRange(this.bounds);
	}
	getZRange() {
		return getZRange(this.bounds);
	}
	getCorners(corners) {
		return getCorners(this.bounds, corners);
	}
	computeCornerPoints(point1, point2) {
		return computeCornerPoints(this.bounds, point1, point2);
	}
	computeLocalBounds(u, v, w) {
		return computeLocalBounds(this.bounds, u, v, w);
	}
	transformBounds(transform, out = []) {
		return transformBounds(this.bounds, transform, out);
	}
	computeScale3(scale3) {
		return computeScale3(this.bounds, scale3);
	}
	cutWithPlane(origin, normal) {
		return cutWithPlane(this.bounds, origin, normal);
	}
	intersectBox(origin, dir, coord, tolerance) {
		return intersectBox(this.bounds, origin, dir, coord, tolerance);
	}
	intersectPlane(origin, normal) {
		return intersectPlane(this.bounds, origin, normal);
	}
	intersect(otherBounds) {
		return intersect(this.bounds, otherBounds);
	}
	intersects(otherBounds) {
		return intersects(this.bounds, otherBounds);
	}
	containsPoint(x, y, z) {
		return containsPoint(this.bounds, x, y, z);
	}
	contains(otherBounds) {
		return intersects(this.bounds, otherBounds);
	}
	computeDivisions(totalBins, divs, adjustedBounds = []) {
		return computeDivisions(this.bounds, totalBins, divs, adjustedBounds);
	}
	distance2ToBounds(x) {
		return distance2ToBounds(x, this.bounds);
	}
};
function newInstance(initialValues) {
	return new BoundingBox(initialValues && initialValues.bounds);
}
var STATIC = {
	equals,
	isValid,
	setBounds,
	reset,
	addPoint,
	addPoints,
	addBounds,
	setMinPoint,
	setMaxPoint,
	inflate,
	scale,
	scaleAboutCenter,
	getCenter,
	getLength,
	getLengths,
	getMaxLength,
	getDiagonalLength,
	getDiagonalLength2,
	getMinPoint,
	getMaxPoint,
	getXRange,
	getYRange,
	getZRange,
	getCorners,
	computeCornerPoints,
	computeLocalBounds,
	transformBounds,
	computeScale3,
	cutWithPlane,
	intersectBox,
	intersectPlane,
	intersect,
	intersects,
	containsPoint,
	contains,
	computeDivisions,
	clampDivisions,
	distance2ToBounds,
	INIT_BOUNDS
};
var BoundingBox_default = {
	newInstance,
	...STATIC
};
//#endregion


//# sourceMappingURL=BoundingBox.js.map

},
29175(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (/* binding */ DataSet_default)
});

// UNUSED EXPORTS: extend, newInstance

// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/vtk.js
var vtk = __webpack_require__(64457);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/macros.js
var macros = __webpack_require__(28241);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/Math.js
var Core_Math = __webpack_require__(91352);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/BoundingBox.js
var BoundingBox = __webpack_require__(24377);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/DataArray.js
var DataArray = __webpack_require__(445);
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/DataSetAttributes/FieldData.js



//#region Sources/Common/DataModel/DataSetAttributes/FieldData.js
var { vtkErrorMacro, vtkWarningMacro } = macros/* ["default"] */.Ay;
function vtkFieldData(publicAPI, model) {
	model.classHierarchy.push("vtkFieldData");
	const superGetState = publicAPI.getState;
	if (model.arrays) model.arrays = model.arrays.map((item) => ({ data: (0,vtk/* ["default"] */.A)(item.data) }));
	publicAPI.initialize = () => {
		publicAPI.initializeFields();
		publicAPI.copyAllOn();
		publicAPI.clearFieldFlags();
	};
	publicAPI.initializeFields = () => {
		model.arrays = [];
		model.copyFieldFlags = {};
		publicAPI.modified();
	};
	publicAPI.copyStructure = (other) => {
		publicAPI.initializeFields();
		model.copyFieldFlags = other.getCopyFieldFlags().map((x) => x);
		model.arrays = other.getArrays().map((x) => ({ data: x }));
	};
	publicAPI.getNumberOfArrays = () => model.arrays.length;
	publicAPI.getNumberOfActiveArrays = () => model.arrays.length;
	publicAPI.addArray = (arr) => {
		const name = arr.getName();
		const { array, index } = publicAPI.getArrayWithIndex(name);
		if (array != null) {
			model.arrays[index] = { data: arr };
			return index;
		}
		model.arrays = [].concat(model.arrays, { data: arr });
		return model.arrays.length - 1;
	};
	publicAPI.removeAllArrays = () => {
		model.arrays = [];
	};
	publicAPI.removeArray = (arrayName) => {
		const index = model.arrays.findIndex((array) => array.data.getName() === arrayName);
		return publicAPI.removeArrayByIndex(index);
	};
	publicAPI.removeArrayByIndex = (arrayIdx) => {
		if (arrayIdx !== -1 && arrayIdx < model.arrays.length) {
			model.arrays.splice(arrayIdx, 1);
			return true;
		}
		return false;
	};
	publicAPI.getArrays = () => model.arrays.map((entry) => entry.data);
	publicAPI.getArray = (arraySpec) => typeof arraySpec === "number" ? publicAPI.getArrayByIndex(arraySpec) : publicAPI.getArrayByName(arraySpec);
	publicAPI.getArrayByName = (arrayName) => model.arrays.reduce((a, b, i) => b.data.getName() === arrayName ? b.data : a, null);
	publicAPI.getArrayWithIndex = (arrayName) => {
		const index = model.arrays.findIndex((array) => array.data.getName() === arrayName);
		return {
			array: index !== -1 ? model.arrays[index].data : null,
			index
		};
	};
	publicAPI.getArrayByIndex = (idx) => idx >= 0 && idx < model.arrays.length ? model.arrays[idx].data : null;
	publicAPI.hasArray = (arrayName) => publicAPI.getArrayWithIndex(arrayName).index >= 0;
	publicAPI.getArrayName = (idx) => {
		const arr = model.arrays[idx];
		return arr ? arr.data.getName() : "";
	};
	publicAPI.getCopyFieldFlags = () => model.copyFieldFlags;
	publicAPI.getFlag = (arrayName) => model.copyFieldFlags[arrayName];
	publicAPI.passData = (other, fromId = -1, toId = -1) => {
		other.getArrays().forEach((arr) => {
			const copyFlag = publicAPI.getFlag(arr.getName());
			if (copyFlag !== false && !(model.doCopyAllOff && copyFlag !== true) && arr) {
				let destArr = publicAPI.getArrayByName(arr.getName());
				if (!destArr) if (fromId < 0 || fromId > arr.getNumberOfTuples()) {
					publicAPI.addArray(arr);
					other.getAttributes(arr).forEach((attrType) => {
						publicAPI.setAttribute(arr, attrType);
					});
				} else {
					const ncomps = arr.getNumberOfComponents();
					let newSize = arr.getNumberOfValues();
					const tId = toId > -1 ? toId : fromId;
					if (newSize <= tId * ncomps) newSize = (tId + 1) * ncomps;
					destArr = DataArray/* ["default"].newInstance */.Ay.newInstance({
						name: arr.getName(),
						dataType: arr.getDataType(),
						numberOfComponents: ncomps,
						values: macros/* ["default"].newTypedArray */.Ay.newTypedArray(arr.getDataType(), newSize),
						size: 0
					});
					destArr.insertTuple(tId, arr.getTuple(fromId));
					publicAPI.addArray(destArr);
					other.getAttributes(arr).forEach((attrType) => {
						publicAPI.setAttribute(destArr, attrType);
					});
				}
				else if (arr.getNumberOfComponents() === destArr.getNumberOfComponents()) if (fromId > -1 && fromId < arr.getNumberOfTuples()) {
					const tId = toId > -1 ? toId : fromId;
					destArr.insertTuple(tId, arr.getTuple(fromId));
				} else destArr.insertTuples(0, arr.getTuples());
				else vtkErrorMacro("Unhandled case in passData");
			}
		});
	};
	publicAPI.interpolateData = (other, fromId1 = -1, fromId2 = -1, toId = -1, t = .5) => {
		other.getArrays().forEach((arr) => {
			const copyFlag = publicAPI.getFlag(arr.getName());
			if (copyFlag !== false && !(model.doCopyAllOff && copyFlag !== true) && arr) {
				let destArr = publicAPI.getArrayByName(arr.getName());
				if (!destArr) if (fromId1 < 0 || fromId2 < 0 || fromId1 > arr.getNumberOfTuples()) {
					publicAPI.addArray(arr);
					other.getAttributes(arr).forEach((attrType) => {
						publicAPI.setAttribute(arr, attrType);
					});
				} else {
					const ncomps = arr.getNumberOfComponents();
					let newSize = arr.getNumberOfValues();
					const tId = toId > -1 ? toId : fromId1;
					if (newSize <= tId * ncomps) newSize = (tId + 1) * ncomps;
					destArr = DataArray/* ["default"].newInstance */.Ay.newInstance({
						name: arr.getName(),
						dataType: arr.getDataType(),
						numberOfComponents: ncomps,
						values: macros/* ["default"].newTypedArray */.Ay.newTypedArray(arr.getDataType(), newSize),
						size: 0
					});
					destArr.interpolateTuple(tId, arr, fromId1, arr, fromId2, t);
					publicAPI.addArray(destArr);
					other.getAttributes(arr).forEach((attrType) => {
						publicAPI.setAttribute(destArr, attrType);
					});
				}
				else if (arr.getNumberOfComponents() === destArr.getNumberOfComponents()) if (fromId1 > -1 && fromId1 < arr.getNumberOfTuples()) {
					const tId = toId > -1 ? toId : fromId1;
					destArr.interpolateTuple(tId, arr, fromId1, arr, fromId2, t);
					vtkWarningMacro("Unexpected case in interpolateData");
				} else destArr.insertTuples(arr.getTuples());
				else vtkErrorMacro("Unhandled case in interpolateData");
			}
		});
	};
	publicAPI.copyFieldOn = (arrayName) => {
		model.copyFieldFlags[arrayName] = true;
	};
	publicAPI.copyFieldOff = (arrayName) => {
		model.copyFieldFlags[arrayName] = false;
	};
	publicAPI.copyAllOn = () => {
		if (!model.doCopyAllOn || model.doCopyAllOff) {
			model.doCopyAllOn = true;
			model.doCopyAllOff = false;
			publicAPI.modified();
		}
	};
	publicAPI.copyAllOff = () => {
		if (model.doCopyAllOn || !model.doCopyAllOff) {
			model.doCopyAllOn = false;
			model.doCopyAllOff = true;
			publicAPI.modified();
		}
	};
	publicAPI.clearFieldFlags = () => {
		model.copyFieldFlags = {};
	};
	publicAPI.deepCopy = (other) => {
		model.arrays = other.getArrays().map((arr) => {
			const arrNew = arr.newClone();
			arrNew.deepCopy(arr);
			return { data: arrNew };
		});
	};
	publicAPI.copyFlags = (other) => other.getCopyFieldFlags().map((x) => x);
	publicAPI.reset = () => model.arrays.forEach((entry) => entry.data.reset());
	publicAPI.getMTime = () => model.arrays.reduce((a, b) => b.data.getMTime() > a ? b.data.getMTime() : a, model.mtime);
	publicAPI.getNumberOfComponents = () => model.arrays.reduce((a, b) => a + b.data.getNumberOfComponents(), 0);
	publicAPI.getNumberOfTuples = () => model.arrays.length > 0 ? model.arrays[0].getNumberOfTuples() : 0;
	publicAPI.getState = (options) => {
		const result = superGetState(options);
		if (result) result.arrays = model.arrays.map((item) => ({ data: item.data.getState(options) }));
		return result;
	};
}
var DEFAULT_VALUES = {
	arrays: [],
	copyFieldFlags: [],
	doCopyAllOn: true,
	doCopyAllOff: false
};
function extend(publicAPI, model, initialValues = {}) {
	Object.assign(model, DEFAULT_VALUES, initialValues);
	macros/* ["default"].obj */.Ay.obj(publicAPI, model);
	vtkFieldData(publicAPI, model);
}
var newInstance = macros/* ["default"].newInstance */.Ay.newInstance(extend, "vtkFieldData");
var FieldData_default = {
	newInstance,
	extend
};
//#endregion


//# sourceMappingURL=FieldData.js.map
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/DataSetAttributes/Constants.js
var Constants = __webpack_require__(5695);
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/DataSetAttributes.js




//#region Sources/Common/DataModel/DataSetAttributes/index.js
var { AttributeTypes, AttributeCopyOperations } = Constants/* ["default"] */.Ay;
var { vtkWarningMacro: DataSetAttributes_vtkWarningMacro } = macros/* ["default"] */.Ay;
function vtkDataSetAttributes(publicAPI, model) {
	const attrTypes = [
		"Scalars",
		"Vectors",
		"Normals",
		"TCoords",
		"Tensors",
		"GlobalIds",
		"PedigreeIds"
	];
	function cleanAttributeType(attType) {
		let cleanAttType = attrTypes.find((ee) => AttributeTypes[ee.toUpperCase()] === attType || typeof attType !== "number" && ee.toLowerCase() === attType.toLowerCase());
		if (typeof cleanAttType === "undefined") cleanAttType = null;
		return cleanAttType;
	}
	model.classHierarchy.push("vtkDataSetAttributes");
	const superClass = { ...publicAPI };
	publicAPI.checkNumberOfComponents = (x) => true;
	publicAPI.setAttribute = (arr, uncleanAttType) => {
		const attType = cleanAttributeType(uncleanAttType);
		if (arr && attType.toUpperCase() === "PEDIGREEIDS" && !arr.isA("vtkDataArray")) {
			DataSetAttributes_vtkWarningMacro(`Cannot set attribute ${attType}. The attribute must be a vtkDataArray.`);
			return -1;
		}
		if (arr && !publicAPI.checkNumberOfComponents(arr, attType)) {
			DataSetAttributes_vtkWarningMacro(`Cannot set attribute ${attType}. Incorrect number of components.`);
			return -1;
		}
		if (arr) {
			const currentAttribute = publicAPI.addArray(arr);
			model[`active${attType}`] = currentAttribute;
		} else model[`active${attType}`] = -1;
		publicAPI.modified();
		return model[`active${attType}`];
	};
	publicAPI.getAttributes = (arr) => attrTypes.filter((attrType) => publicAPI[`get${attrType}`]() === arr);
	publicAPI.setActiveAttributeByName = (arrayName, attType) => publicAPI.setActiveAttributeByIndex(publicAPI.getArrayWithIndex(arrayName).index, attType);
	publicAPI.setActiveAttributeByIndex = (arrayIdx, uncleanAttType) => {
		const attType = cleanAttributeType(uncleanAttType);
		if (arrayIdx >= 0 && arrayIdx < model.arrays.length) {
			if (attType.toUpperCase() !== "PEDIGREEIDS") {
				const arr = publicAPI.getArrayByIndex(arrayIdx);
				if (!arr.isA("vtkDataArray")) {
					DataSetAttributes_vtkWarningMacro(`Cannot set attribute ${attType}. Only vtkDataArray subclasses can be set as active attributes.`);
					return -1;
				}
				if (!publicAPI.checkNumberOfComponents(arr, attType)) {
					DataSetAttributes_vtkWarningMacro(`Cannot set attribute ${attType}. Incorrect number of components.`);
					return -1;
				}
			}
			model[`active${attType}`] = arrayIdx;
			publicAPI.modified();
			return arrayIdx;
		}
		if (arrayIdx === -1) {
			model[`active${attType}`] = arrayIdx;
			publicAPI.modified();
		}
		return -1;
	};
	publicAPI.getActiveAttribute = (attType) => {
		return publicAPI[`get${cleanAttributeType(attType)}`]();
	};
	publicAPI.removeAllArrays = () => {
		attrTypes.forEach((attType) => {
			model[`active${attType}`] = -1;
		});
		superClass.removeAllArrays();
	};
	publicAPI.removeArrayByIndex = (arrayIdx) => {
		if (arrayIdx !== -1) attrTypes.forEach((attType) => {
			if (arrayIdx === model[`active${attType}`]) model[`active${attType}`] = -1;
			else if (arrayIdx < model[`active${attType}`]) model[`active${attType}`] -= 1;
		});
		return superClass.removeArrayByIndex(arrayIdx);
	};
	attrTypes.forEach((value) => {
		const activeVal = `active${value}`;
		publicAPI[`get${value}`] = () => publicAPI.getArrayByIndex(model[activeVal]);
		publicAPI[`set${value}`] = (da) => publicAPI.setAttribute(da, value);
		publicAPI[`setActive${value}`] = (arrayName) => publicAPI.setActiveAttributeByIndex(publicAPI.getArrayWithIndex(arrayName).index, value);
		publicAPI[`copy${value}Off`] = () => {
			const attType = value.toUpperCase();
			model.copyAttributeFlags[AttributeCopyOperations.PASSDATA][AttributeTypes[attType]] = false;
		};
		publicAPI[`copy${value}On`] = () => {
			const attType = value.toUpperCase();
			model.copyAttributeFlags[AttributeCopyOperations.PASSDATA][AttributeTypes[attType]] = true;
		};
	});
	publicAPI.initializeAttributeCopyFlags = () => {
		model.copyAttributeFlags = [];
		Object.keys(AttributeCopyOperations).filter((op) => op !== "ALLCOPY").forEach((attCopyOp) => {
			model.copyAttributeFlags[AttributeCopyOperations[attCopyOp]] = Object.keys(AttributeTypes).filter((ty) => ty !== "NUM_ATTRIBUTES").reduce((a, b) => {
				a[AttributeTypes[b]] = true;
				return a;
			}, []);
		});
		model.copyAttributeFlags[AttributeCopyOperations.COPYTUPLE][AttributeTypes.GLOBALIDS] = false;
		model.copyAttributeFlags[AttributeCopyOperations.INTERPOLATE][AttributeTypes.GLOBALIDS] = false;
		model.copyAttributeFlags[AttributeCopyOperations.COPYTUPLE][AttributeTypes.PEDIGREEIDS] = false;
	};
	publicAPI.initialize = macros/* ["default"].chain */.Ay.chain(publicAPI.initialize, publicAPI.initializeAttributeCopyFlags);
	if (model.dataArrays && Object.keys(model.dataArrays).length) Object.keys(model.dataArrays).forEach((name) => {
		if (!model.dataArrays[name].ref && model.dataArrays[name].type === "vtkDataArray") publicAPI.addArray(DataArray/* ["default"].newInstance */.Ay.newInstance(model.dataArrays[name]));
	});
	const superShallowCopy = publicAPI.shallowCopy;
	publicAPI.shallowCopy = (other, debug) => {
		superShallowCopy(other, debug);
		model.arrays = other.getArrays().map((arr) => {
			const arrNew = arr.newClone();
			arrNew.shallowCopy(arr, debug);
			return { data: arrNew };
		});
	};
	publicAPI.initializeAttributeCopyFlags();
}
var DataSetAttributes_DEFAULT_VALUES = {
	activeScalars: -1,
	activeVectors: -1,
	activeTensors: -1,
	activeNormals: -1,
	activeTCoords: -1,
	activeGlobalIds: -1,
	activePedigreeIds: -1
};
function DataSetAttributes_extend(publicAPI, model, initialValues = {}) {
	Object.assign(model, DataSetAttributes_DEFAULT_VALUES, initialValues);
	FieldData_default.extend(publicAPI, model, initialValues);
	macros/* ["default"].setGet */.Ay.setGet(publicAPI, model, [
		"activeScalars",
		"activeNormals",
		"activeTCoords",
		"activeVectors",
		"activeTensors",
		"activeGlobalIds",
		"activePedigreeIds"
	]);
	if (!model.arrays) model.arrays = {};
	vtkDataSetAttributes(publicAPI, model);
}
var DataSetAttributes_newInstance = macros/* ["default"].newInstance */.Ay.newInstance(DataSetAttributes_extend, "vtkDataSetAttributes");
var DataSetAttributes_default = {
	newInstance: DataSetAttributes_newInstance,
	extend: DataSetAttributes_extend,
	...Constants/* ["default"] */.Ay
};
//#endregion


//# sourceMappingURL=DataSetAttributes.js.map
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/DataSet/Constants.js
//#region Sources/Common/DataModel/DataSet/Constants.js
var FieldDataTypes = {
	UNIFORM: 0,
	DATA_OBJECT_FIELD: 0,
	COORDINATE: 1,
	POINT_DATA: 1,
	POINT: 2,
	POINT_FIELD_DATA: 2,
	CELL: 3,
	CELL_FIELD_DATA: 3,
	VERTEX: 4,
	VERTEX_FIELD_DATA: 4,
	EDGE: 5,
	EDGE_FIELD_DATA: 5,
	ROW: 6,
	ROW_DATA: 6
};
var FieldAssociations = {
	FIELD_ASSOCIATION_POINTS: 0,
	FIELD_ASSOCIATION_CELLS: 1,
	FIELD_ASSOCIATION_NONE: 2,
	FIELD_ASSOCIATION_POINTS_THEN_CELLS: 3,
	FIELD_ASSOCIATION_VERTICES: 4,
	FIELD_ASSOCIATION_EDGES: 5,
	FIELD_ASSOCIATION_ROWS: 6,
	NUMBER_OF_ASSOCIATIONS: 7
};
var Constants_default = {
	FieldDataTypes,
	FieldAssociations
};
//#endregion


//# sourceMappingURL=Constants.js.map
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/DataSet.js






//#region Sources/Common/DataModel/DataSet/index.js
var DATASET_FIELDS = [
	"pointData",
	"cellData",
	"fieldData"
];
function vtkDataSet(publicAPI, model) {
	model.classHierarchy.push("vtkDataSet");
	DATASET_FIELDS.forEach((fieldName) => {
		if (!model[fieldName]) model[fieldName] = DataSetAttributes_default.newInstance();
		else model[fieldName] = (0,vtk/* ["default"] */.A)(model[fieldName]);
	});
	publicAPI.computeBounds = () => {
		if (model.modifiedTime && model.computeTime && model.modifiedTime > model.computeTime || !model.computeTime) {
			const points = publicAPI.getPoints();
			if (points?.getNumberOfPoints()) BoundingBox/* ["default"].setBounds */.Ay.setBounds(model.bounds, points.getBoundsByReference());
			else model.bounds = Core_Math/* ["default"].createUninitializedBounds */.Ay.createUninitializedBounds();
			model.computeTime = macros/* ["default"].getCurrentGlobalMTime */.Ay.getCurrentGlobalMTime();
		}
	};
	/**
	* Returns the squared length of the diagonal of the bounding box
	*/
	publicAPI.getLength2 = () => {
		const bounds = publicAPI.getBoundsByReference();
		if (!bounds || bounds.length !== 6) return 0;
		return BoundingBox/* ["default"].getDiagonalLength2 */.Ay.getDiagonalLength2(bounds);
	};
	/**
	* Returns the length of the diagonal of the bounding box
	*/
	publicAPI.getLength = () => Math.sqrt(publicAPI.getLength2());
	/**
	* Returns the center of the bounding box as [x, y, z]
	*/
	publicAPI.getCenter = () => {
		const bounds = publicAPI.getBoundsByReference();
		if (!bounds || bounds.length !== 6) return [
			0,
			0,
			0
		];
		return BoundingBox/* ["default"].getCenter */.Ay.getCenter(bounds);
	};
	/**
	* Get the bounding box of a cell with the given cellId
	* @param {Number} cellId - The id of the cell
	* @returns {Number[]} - The bounds as [xmin, xmax, ymin, ymax, zmin, zmax]
	*/
	publicAPI.getCellBounds = (cellId) => {
		const cell = publicAPI.getCell(cellId);
		if (cell) return cell.getBounds();
		return Core_Math/* ["default"].createUninitializedBounds */.Ay.createUninitializedBounds();
	};
	publicAPI.getBounds = macros/* ["default"].chain */.Ay.chain(() => publicAPI.computeBounds, publicAPI.getBounds);
	publicAPI.getBoundsByReference = macros/* ["default"].chain */.Ay.chain(() => publicAPI.computeBounds, publicAPI.getBoundsByReference);
	const superShallowCopy = publicAPI.shallowCopy;
	publicAPI.shallowCopy = (other, debug = false) => {
		superShallowCopy(other, debug);
		DATASET_FIELDS.forEach((fieldName) => {
			model[fieldName] = DataSetAttributes_default.newInstance();
			model[fieldName].shallowCopy(other.getReferenceByName(fieldName));
		});
	};
	const superGetMTime = publicAPI.getMTime;
	publicAPI.getMTime = () => DATASET_FIELDS.reduce((mTime, fieldName) => Math.max(mTime, model[fieldName]?.getMTime() ?? mTime), superGetMTime());
	publicAPI.initialize = () => {
		DATASET_FIELDS.forEach((fieldName) => model[fieldName]?.initialize());
		return publicAPI;
	};
}
var DataSet_DEFAULT_VALUES = {};
function DataSet_extend(publicAPI, model, initialValues = {}) {
	Object.assign(model, DataSet_DEFAULT_VALUES, initialValues);
	macros/* ["default"].obj */.Ay.obj(publicAPI, model);
	macros/* ["default"].setGet */.Ay.setGet(publicAPI, model, DATASET_FIELDS);
	macros/* ["default"].getArray */.Ay.getArray(publicAPI, model, ["bounds"], 6);
	vtkDataSet(publicAPI, model);
}
var DataSet_newInstance = macros/* ["default"].newInstance */.Ay.newInstance(DataSet_extend, "vtkDataSet");
var DataSet_default = {
	newInstance: DataSet_newInstance,
	extend: DataSet_extend,
	...Constants_default
};
//#endregion


//# sourceMappingURL=DataSet.js.map

},
53001(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (ImplicitFunction_default)
});
/* import */ var _macros_js__rspack_import_0 = __webpack_require__(28241);

//#region Sources/Common/DataModel/ImplicitFunction/index.js
function vtkImplicitFunction(publicAPI, model) {
	model.classHierarchy.push("vtkImplicitFunction");
	publicAPI.functionValue = (xyz) => {
		if (!model.transform) return publicAPI.evaluateFunction(xyz);
		const transformedXYZ = [];
		model.transform.transformPoint(xyz, transformedXYZ);
		return publicAPI.evaluateFunction(transformedXYZ);
	};
	publicAPI.evaluateFunction = (_xyz) => {
		_macros_js__rspack_import_0/* ["default"].vtkErrorMacro */.Ay.vtkErrorMacro("not implemented");
	};
}
var DEFAULT_VALUES = {};
function extend(publicAPI, model, initialValues = {}) {
	Object.assign(model, DEFAULT_VALUES, initialValues);
	_macros_js__rspack_import_0/* ["default"].obj */.Ay.obj(publicAPI, model);
	_macros_js__rspack_import_0/* ["default"].setGet */.Ay.setGet(publicAPI, model, ["transform"]);
	vtkImplicitFunction(publicAPI, model);
}
var newInstance = _macros_js__rspack_import_0/* ["default"].newInstance */.Ay.newInstance(extend, "vtkImplicitFunction");
var ImplicitFunction_default = {
	newInstance,
	extend
};
//#endregion


//# sourceMappingURL=ImplicitFunction.js.map

},
42365(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (StructuredData_default)
});
/* import */ var _StructuredData_Constants_js__rspack_import_0 = __webpack_require__(71767);

//#region Sources/Common/DataModel/StructuredData/index.js
var { StructuredType } = _StructuredData_Constants_js__rspack_import_0/* ["default"] */.A;
function getDataDescriptionFromExtent(inExt) {
	let dataDim = 0;
	for (let i = 0; i < 3; ++i) if (inExt[i * 2] < inExt[i * 2 + 1]) dataDim++;
	if (inExt[0] > inExt[1] || inExt[2] > inExt[3] || inExt[4] > inExt[5]) return StructuredType.EMPTY;
	if (dataDim === 3) return StructuredType.XYZ_GRID;
	if (dataDim === 2) {
		if (inExt[0] === inExt[1]) return StructuredType.YZ_PLANE;
		if (inExt[2] === inExt[3]) return StructuredType.XZ_PLANE;
		return StructuredType.XY_PLANE;
	}
	if (dataDim === 1) {
		if (inExt[0] < inExt[1]) return StructuredType.X_LINE;
		if (inExt[2] < inExt[3]) return StructuredType.Y_LINE;
		return StructuredType.Z_LINE;
	}
	return StructuredType.SINGLE_POINT;
}
var StructuredData_default = {
	getDataDescriptionFromExtent,
	..._StructuredData_Constants_js__rspack_import_0/* ["default"] */.A
};
//#endregion


//# sourceMappingURL=StructuredData.js.map

},
71767(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (Constants_default),
  e: () => (StructuredType)
});
//#region Sources/Common/DataModel/StructuredData/Constants.js
var StructuredType = {
	UNCHANGED: 0,
	SINGLE_POINT: 1,
	X_LINE: 2,
	Y_LINE: 3,
	Z_LINE: 4,
	XY_PLANE: 5,
	YZ_PLANE: 6,
	XZ_PLANE: 7,
	XYZ_GRID: 8,
	EMPTY: 9
};
var Constants_default = { StructuredType };
//#endregion


//# sourceMappingURL=Constants.js.map

},
85254(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  I: () => (__exportAll)
});
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion



},
64457(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.d(__webpack_exports__, {
  A: () => (vtk)
});
//#region Sources/vtk.js
var factoryMapping = { vtkObject: () => null };
function vtk(obj) {
	if (obj === null || obj === void 0) return obj;
	if (obj.isA) return obj;
	if (!obj.vtkClass) {
		if (globalThis.console && globalThis.console.error) globalThis.console.error("Invalid VTK object");
		return null;
	}
	const constructor = factoryMapping[obj.vtkClass];
	if (!constructor) {
		if (globalThis.console && globalThis.console.error) globalThis.console.error(`No vtk class found for Object of type ${obj.vtkClass}`);
		return null;
	}
	const model = { ...obj };
	Object.keys(model).forEach((keyName) => {
		if (model[keyName] && typeof model[keyName] === "object" && model[keyName].vtkClass) model[keyName] = vtk(model[keyName]);
	});
	const newInst = constructor(model);
	if (newInst && newInst.modified) newInst.modified();
	return newInst;
}
function register(vtkClassName, constructor) {
	factoryMapping[vtkClassName] = constructor;
}
vtk.register = register;
//#endregion


//# sourceMappingURL=vtk.js.map

},

}]);