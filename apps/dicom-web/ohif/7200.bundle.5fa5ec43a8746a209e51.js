"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[7200],{

/***/ 21399
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NIFTIEXTENSION = void 0;
/*** Constructor ***/
/**
 * The NIFTIEXTENSION constructor.
 * @constructor
 * @property {number} esize - number of bytes that form the extended header data
 * @property {number} ecode - developer group id
 * @property {ArrayBuffer} data - extension data
 * @property {boolean} littleEndian - is little endian
 * @type {Function}
 */
class NIFTIEXTENSION {
    esize;
    ecode;
    edata;
    littleEndian;
    constructor(esize, ecode, edata, littleEndian) {
        if (esize % 16 != 0) {
            throw new Error("This does not appear to be a NIFTI extension");
        }
        this.esize = esize;
        this.ecode = ecode;
        this.edata = edata;
        this.littleEndian = littleEndian;
    }
    /**
     * Returns extension as ArrayBuffer.
     * @returns {ArrayBuffer}
     */
    toArrayBuffer() {
        let byteArray = new Uint8Array(this.esize);
        let data = new Uint8Array(this.edata);
        byteArray.set(data, 8);
        let view = new DataView(byteArray.buffer);
        // size of extension
        view.setInt32(0, this.esize, this.littleEndian);
        view.setInt32(4, this.ecode, this.littleEndian);
        return byteArray.buffer;
    }
}
exports.NIFTIEXTENSION = NIFTIEXTENSION;
//# sourceMappingURL=nifti-extension.js.map

/***/ },

/***/ 97071
(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.readExtensionData = exports.readExtension = exports.readImage = exports.hasExtension = exports.readHeader = exports.decompress = exports.isCompressed = exports.isNIFTI = exports.isNIFTI2 = exports.isNIFTI1 = exports.NIFTIEXTENSION = exports.Utils = exports.NIFTI2 = exports.NIFTI1 = void 0;
const fflate = __importStar(__webpack_require__(35167));
const nifti1_1 = __webpack_require__(24960);
const nifti2_1 = __webpack_require__(35961);
const utilities_1 = __webpack_require__(6637);
var nifti1_2 = __webpack_require__(24960);
Object.defineProperty(exports, "NIFTI1", ({ enumerable: true, get: function () { return nifti1_2.NIFTI1; } }));
var nifti2_2 = __webpack_require__(35961);
Object.defineProperty(exports, "NIFTI2", ({ enumerable: true, get: function () { return nifti2_2.NIFTI2; } }));
var utilities_2 = __webpack_require__(6637);
Object.defineProperty(exports, "Utils", ({ enumerable: true, get: function () { return utilities_2.Utils; } }));
var nifti_extension_1 = __webpack_require__(21399);
Object.defineProperty(exports, "NIFTIEXTENSION", ({ enumerable: true, get: function () { return nifti_extension_1.NIFTIEXTENSION; } }));
/*** Static Methods ***/
/**
 * Returns true if this data represents a NIFTI-1 header.
 * @param {ArrayBuffer} data
 * @returns {boolean}
 */
function isNIFTI1(data, isHdrImgPairOK = false) {
    var buf, mag1, mag2, mag3;
    if (data.byteLength < nifti1_1.NIFTI1.STANDARD_HEADER_SIZE) {
        return false;
    }
    buf = new DataView(data);
    if (buf)
        mag1 = buf.getUint8(nifti1_1.NIFTI1.MAGIC_NUMBER_LOCATION);
    mag2 = buf.getUint8(nifti1_1.NIFTI1.MAGIC_NUMBER_LOCATION + 1);
    mag3 = buf.getUint8(nifti1_1.NIFTI1.MAGIC_NUMBER_LOCATION + 2);
    if (isHdrImgPairOK &&
        mag1 === nifti1_1.NIFTI1.MAGIC_NUMBER2[0] &&
        mag2 === nifti1_1.NIFTI1.MAGIC_NUMBER2[1] &&
        mag3 === nifti1_1.NIFTI1.MAGIC_NUMBER2[2])
        return true; // hdr/img pair
    return !!(mag1 === nifti1_1.NIFTI1.MAGIC_NUMBER[0] &&
        mag2 === nifti1_1.NIFTI1.MAGIC_NUMBER[1] &&
        mag3 === nifti1_1.NIFTI1.MAGIC_NUMBER[2]);
}
exports.isNIFTI1 = isNIFTI1;
/**
 * Returns true if this data represents a NIFTI-2 header.
 * @param {ArrayBuffer} data
 * @returns {boolean}
 */
function isNIFTI2(data, isHdrImgPairOK = false) {
    var buf, mag1, mag2, mag3;
    if (data.byteLength < nifti1_1.NIFTI1.STANDARD_HEADER_SIZE) {
        return false;
    }
    buf = new DataView(data);
    mag1 = buf.getUint8(nifti2_1.NIFTI2.MAGIC_NUMBER_LOCATION);
    mag2 = buf.getUint8(nifti2_1.NIFTI2.MAGIC_NUMBER_LOCATION + 1);
    mag3 = buf.getUint8(nifti2_1.NIFTI2.MAGIC_NUMBER_LOCATION + 2);
    if (isHdrImgPairOK &&
        mag1 === nifti2_1.NIFTI2.MAGIC_NUMBER2[0] &&
        mag2 === nifti2_1.NIFTI2.MAGIC_NUMBER2[1] &&
        mag3 === nifti2_1.NIFTI2.MAGIC_NUMBER2[2])
        return true; // hdr/img pair
    return !!(mag1 === nifti2_1.NIFTI2.MAGIC_NUMBER[0] &&
        mag2 === nifti2_1.NIFTI2.MAGIC_NUMBER[1] &&
        mag3 === nifti2_1.NIFTI2.MAGIC_NUMBER[2]);
}
exports.isNIFTI2 = isNIFTI2;
/**
 * Returns true if this data represents a NIFTI header.
 * @param {ArrayBuffer} data
 * @returns {boolean}
 */
function isNIFTI(data, isHdrImgPairOK = false) {
    return (isNIFTI1(data, isHdrImgPairOK) ||
        isNIFTI2(data, isHdrImgPairOK));
}
exports.isNIFTI = isNIFTI;
/**
 * Returns true if this data is GZIP compressed.
 * @param {ArrayBuffer} data
 * @returns {boolean}
 */
function isCompressed(data) {
    var buf, magicCookie1, magicCookie2;
    if (data) {
        buf = new DataView(data);
        magicCookie1 = buf.getUint8(0);
        magicCookie2 = buf.getUint8(1);
        if (magicCookie1 === utilities_1.Utils.GUNZIP_MAGIC_COOKIE1) {
            return true;
        }
        if (magicCookie2 === utilities_1.Utils.GUNZIP_MAGIC_COOKIE2) {
            return true;
        }
    }
    return false;
}
exports.isCompressed = isCompressed;
/**
 * Returns decompressed data.
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */
function decompress(data) {
    return fflate.decompressSync(new Uint8Array(data)).buffer;
}
exports.decompress = decompress;
/**
 * Reads and returns the header object.
 * @param {ArrayBuffer} data
 * @returns {NIFTI1|NIFTI2|null}
 */
function readHeader(data, isHdrImgPairOK = false) {
    var header = null;
    if (isCompressed(data)) {
        data = decompress(data);
    }
    if (isNIFTI1(data, isHdrImgPairOK)) {
        header = new nifti1_1.NIFTI1();
    }
    else if (isNIFTI2(data, isHdrImgPairOK)) {
        header = new nifti2_1.NIFTI2();
    }
    if (header) {
        header.readHeader(data);
    }
    else {
        console.error("That file does not appear to be NIFTI!");
    }
    return header;
}
exports.readHeader = readHeader;
/**
 * Returns true if this header contains an extension.
 * @param {NIFTI1|NIFTI2} header
 * @returns {boolean}
 */
function hasExtension(header) {
    return header.extensionFlag[0] != 0;
}
exports.hasExtension = hasExtension;
/**
 * Returns the image data.
 * @param {NIFTI1|NIFTI2} header
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */
function readImage(header, data) {
    var imageOffset = header.vox_offset, timeDim = 1, statDim = 1;
    if (header.dims[4]) {
        timeDim = header.dims[4];
    }
    if (header.dims[5]) {
        statDim = header.dims[5];
    }
    var imageSize = header.dims[1] *
        header.dims[2] *
        header.dims[3] *
        timeDim *
        statDim *
        (header.numBitsPerVoxel / 8);
    return data.slice(imageOffset, imageOffset + imageSize);
}
exports.readImage = readImage;
/**
 * Returns the extension data (including extension header).
 * @param {NIFTI1|NIFTI2} header
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */
function readExtension(header, data) {
    var loc = header.getExtensionLocation(), size = header.extensionSize;
    return data.slice(loc, loc + size);
}
exports.readExtension = readExtension;
/**
 * Returns the extension data.
 * @param {NIFTI1|NIFTI2} header
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */
function readExtensionData(header, data) {
    var loc = header.getExtensionLocation(), size = header.extensionSize;
    return data.slice(loc + 8, loc + size); // +8 for loc and -8 for esize and ecode
}
exports.readExtensionData = readExtensionData;
//# sourceMappingURL=nifti.js.map

/***/ },

/***/ 24960
(__unused_webpack_module, exports, __webpack_require__) {

/* provided dependency */ var Buffer = __webpack_require__(81429)["hp"];

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NIFTI1 = void 0;
const utilities_1 = __webpack_require__(6637);
/*** Constructor ***/
/**
   * The NIFTI1 constructor.
   * @constructor
   * @property {boolean} littleEndian
   * @property {number} dim_info
   * @property {number[]} dims - image dimensions
   * @property {number} intent_p1
   * @property {number} intent_p2
   * @property {number} intent_p3
   * @property {number} intent_code
   * @property {number} datatypeCode
   * @property {number} numBitsPerVoxel
   * @property {number} slice_start
   * @property {number} slice_end
   * @property {number} slice_code
   * @property {number[]} pixDims - voxel dimensions
   * @property {number} vox_offset
   * @property {number} scl_slope
   * @property {number} scl_inter
   * @property {number} xyzt_units
   * @property {number} cal_max
   * @property {number} cal_min
   * @property {number} slice_duration
   * @property {number} toffset
   * @property {string} description
   * @property {string} aux_file
   * @property {string} intent_name
   * @property {number} qform_code
   * @property {number} sform_code
   * @property {number} quatern_b
   * @property {number} quatern_c
   * @property {number} quatern_d
   * @property {number} quatern_x
   * @property {number} quatern_y
   * @property {number} quatern_z
   * @property {Array.<Array.<number>>} affine
   * @property {string} magic
   * @property {boolean} isHDR - if hdr/img format
   * @property {number[]} extensionFlag
   * @property {number} extensionSize
   * @property {number} extensionCode
   * @property {nifti.NIFTIEXTENSION[]} extensions
   * @type {Function}
   */
class NIFTI1 {
    littleEndian = false;
    dim_info = 0;
    dims = [];
    intent_p1 = 0.0;
    intent_p2 = 0.0;
    intent_p3 = 0.0;
    intent_code = 0;
    datatypeCode = 0;
    numBitsPerVoxel = 0;
    slice_start = 0;
    slice_end = 0;
    slice_code = 0;
    pixDims = [];
    vox_offset = 0;
    scl_slope = 1.0;
    scl_inter = 0.0;
    xyzt_units = 0;
    cal_max = 0.0;
    cal_min = 0.0;
    slice_duration = 0.0;
    toffset = 0.0;
    description = "";
    aux_file = "";
    intent_name = "";
    qform_code = 0;
    sform_code = 0;
    quatern_a = 0.0;
    quatern_b = 0.0;
    quatern_c = 0.0;
    quatern_d = 0.0;
    qoffset_x = 0.0;
    qoffset_y = 0.0;
    qoffset_z = 0.0;
    affine = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ];
    qfac = 1;
    quatern_R;
    magic = "0";
    isHDR = false;
    extensionFlag = [0, 0, 0, 0];
    extensionSize = 0;
    extensionCode = 0;
    extensions = [];
    /*** Static Pseudo-constants ***/
    // datatype codes
    static TYPE_NONE = 0;
    static TYPE_BINARY = 1;
    static TYPE_UINT8 = 2;
    static TYPE_INT16 = 4;
    static TYPE_INT32 = 8;
    static TYPE_FLOAT32 = 16;
    static TYPE_COMPLEX64 = 32;
    static TYPE_FLOAT64 = 64;
    static TYPE_RGB24 = 128;
    static TYPE_INT8 = 256;
    static TYPE_UINT16 = 512;
    static TYPE_UINT32 = 768;
    static TYPE_INT64 = 1024;
    static TYPE_UINT64 = 1280;
    static TYPE_FLOAT128 = 1536;
    static TYPE_COMPLEX128 = 1792;
    static TYPE_COMPLEX256 = 2048;
    // transform codes
    static XFORM_UNKNOWN = 0;
    static XFORM_SCANNER_ANAT = 1;
    static XFORM_ALIGNED_ANAT = 2;
    static XFORM_TALAIRACH = 3;
    static XFORM_MNI_152 = 4;
    // unit codes
    static SPATIAL_UNITS_MASK = 0x07;
    static TEMPORAL_UNITS_MASK = 0x38;
    static UNITS_UNKNOWN = 0;
    static UNITS_METER = 1;
    static UNITS_MM = 2;
    static UNITS_MICRON = 3;
    static UNITS_SEC = 8;
    static UNITS_MSEC = 16;
    static UNITS_USEC = 24;
    static UNITS_HZ = 32;
    static UNITS_PPM = 40;
    static UNITS_RADS = 48;
    // nifti1 codes
    static MAGIC_COOKIE = 348;
    static STANDARD_HEADER_SIZE = 348;
    static MAGIC_NUMBER_LOCATION = 344;
    static MAGIC_NUMBER = [0x6e, 0x2b, 0x31]; // n+1 (.nii)
    static MAGIC_NUMBER2 = [0x6e, 0x69, 0x31]; // ni1 (.hdr/.img)
    static EXTENSION_HEADER_SIZE = 8;
    /*** Prototype Methods ***/
    /**
     * Reads the header data.
     * @param {ArrayBuffer} data
     */
    readHeader(data) {
        var rawData = new DataView(data), magicCookieVal = utilities_1.Utils.getIntAt(rawData, 0, this.littleEndian), ctr, ctrOut, ctrIn, index;
        if (magicCookieVal !== NIFTI1.MAGIC_COOKIE) {
            // try as little endian
            this.littleEndian = true;
            magicCookieVal = utilities_1.Utils.getIntAt(rawData, 0, this.littleEndian);
        }
        if (magicCookieVal !== NIFTI1.MAGIC_COOKIE) {
            throw new Error("This does not appear to be a NIFTI file!");
        }
        this.dim_info = utilities_1.Utils.getByteAt(rawData, 39);
        for (ctr = 0; ctr < 8; ctr += 1) {
            index = 40 + ctr * 2;
            this.dims[ctr] = utilities_1.Utils.getShortAt(rawData, index, this.littleEndian);
        }
        this.intent_p1 = utilities_1.Utils.getFloatAt(rawData, 56, this.littleEndian);
        this.intent_p2 = utilities_1.Utils.getFloatAt(rawData, 60, this.littleEndian);
        this.intent_p3 = utilities_1.Utils.getFloatAt(rawData, 64, this.littleEndian);
        this.intent_code = utilities_1.Utils.getShortAt(rawData, 68, this.littleEndian);
        this.datatypeCode = utilities_1.Utils.getShortAt(rawData, 70, this.littleEndian);
        this.numBitsPerVoxel = utilities_1.Utils.getShortAt(rawData, 72, this.littleEndian);
        this.slice_start = utilities_1.Utils.getShortAt(rawData, 74, this.littleEndian);
        for (ctr = 0; ctr < 8; ctr += 1) {
            index = 76 + ctr * 4;
            this.pixDims[ctr] = utilities_1.Utils.getFloatAt(rawData, index, this.littleEndian);
        }
        this.vox_offset = utilities_1.Utils.getFloatAt(rawData, 108, this.littleEndian);
        this.scl_slope = utilities_1.Utils.getFloatAt(rawData, 112, this.littleEndian);
        this.scl_inter = utilities_1.Utils.getFloatAt(rawData, 116, this.littleEndian);
        this.slice_end = utilities_1.Utils.getShortAt(rawData, 120, this.littleEndian);
        this.slice_code = utilities_1.Utils.getByteAt(rawData, 122);
        this.xyzt_units = utilities_1.Utils.getByteAt(rawData, 123);
        this.cal_max = utilities_1.Utils.getFloatAt(rawData, 124, this.littleEndian);
        this.cal_min = utilities_1.Utils.getFloatAt(rawData, 128, this.littleEndian);
        this.slice_duration = utilities_1.Utils.getFloatAt(rawData, 132, this.littleEndian);
        this.toffset = utilities_1.Utils.getFloatAt(rawData, 136, this.littleEndian);
        this.description = utilities_1.Utils.getStringAt(rawData, 148, 228);
        this.aux_file = utilities_1.Utils.getStringAt(rawData, 228, 252);
        this.qform_code = utilities_1.Utils.getShortAt(rawData, 252, this.littleEndian);
        this.sform_code = utilities_1.Utils.getShortAt(rawData, 254, this.littleEndian);
        this.quatern_b = utilities_1.Utils.getFloatAt(rawData, 256, this.littleEndian);
        this.quatern_c = utilities_1.Utils.getFloatAt(rawData, 260, this.littleEndian);
        this.quatern_d = utilities_1.Utils.getFloatAt(rawData, 264, this.littleEndian);
        // Added by znshje on 27/11/2021
        //
        // quatern_a is a parameter in quaternion [a, b, c, d], which is required in affine calculation (METHOD 2)
        // mentioned in the nifti1.h file
        // It can be calculated by a = sqrt(1.0-(b*b+c*c+d*d))
        this.quatern_a = Math.sqrt(1.0 -
            (Math.pow(this.quatern_b, 2) +
                Math.pow(this.quatern_c, 2) +
                Math.pow(this.quatern_d, 2)));
        this.qoffset_x = utilities_1.Utils.getFloatAt(rawData, 268, this.littleEndian);
        this.qoffset_y = utilities_1.Utils.getFloatAt(rawData, 272, this.littleEndian);
        this.qoffset_z = utilities_1.Utils.getFloatAt(rawData, 276, this.littleEndian);
        // Added by znshje on 27/11/2021
        //
        /* See: https://nifti.nimh.nih.gov/pub/dist/src/niftilib/nifti1.h */
        if ((this.qform_code < 1) && (this.sform_code < 1)) {
            // METHOD 0 (used when both SFORM and QFORM are unknown)
            this.affine[0][0] = this.pixDims[1];
            this.affine[1][1] = this.pixDims[2];
            this.affine[2][2] = this.pixDims[3];
        }
        if ((this.qform_code > 0) && (this.sform_code < this.qform_code)) {
            //   METHOD 2 (used when qform_code > 0, which should be the "normal" case):
            //    ---------------------------------------------------------------------
            //    The (x,y,z) coordinates are given by the pixdim[] scales, a rotation
            //    matrix, and a shift.  This method is intended to represent
            //    "scanner-anatomical" coordinates, which are often embedded in the
            //    image header (e.g., DICOM fields (0020,0032), (0020,0037), (0028,0030),
            //    and (0018,0050)), and represent the nominal orientation and location of
            //    the data.  This method can also be used to represent "aligned"
            //    coordinates, which would typically result from some post-acquisition
            //    alignment of the volume to a standard orientation (e.g., the same
            //    subject on another day, or a rigid rotation to true anatomical
            //    orientation from the tilted position of the subject in the scanner).
            //    The formula for (x,y,z) in terms of header parameters and (i,j,k) is:
            //
            //      [ x ]   [ R11 R12 R13 ] [        pixdim[1] * i ]   [ qoffset_x ]
            //      [ y ] = [ R21 R22 R23 ] [        pixdim[2] * j ] + [ qoffset_y ]
            //      [ z ]   [ R31 R32 R33 ] [ qfac * pixdim[3] * k ]   [ qoffset_z ]
            //
            //    The qoffset_* shifts are in the NIFTI-1 header.  Note that the center
            //    of the (i,j,k)=(0,0,0) voxel (first value in the dataset array) is
            //    just (x,y,z)=(qoffset_x,qoffset_y,qoffset_z).
            //
            //    The rotation matrix R is calculated from the quatern_* parameters.
            //    This calculation is described below.
            //
            //    The scaling factor qfac is either 1 or -1.  The rotation matrix R
            //    defined by the quaternion parameters is "proper" (has determinant 1).
            //    This may not fit the needs of the data; for example, if the image
            //    grid is
            //      i increases from Left-to-Right
            //      j increases from Anterior-to-Posterior
            //      k increases from Inferior-to-Superior
            //    Then (i,j,k) is a left-handed triple.  In this example, if qfac=1,
            //    the R matrix would have to be
            //
            //      [  1   0   0 ]
            //      [  0  -1   0 ]  which is "improper" (determinant = -1).
            //      [  0   0   1 ]
            //
            //    If we set qfac=-1, then the R matrix would be
            //
            //      [  1   0   0 ]
            //      [  0  -1   0 ]  which is proper.
            //      [  0   0  -1 ]
            //
            //    This R matrix is represented by quaternion [a,b,c,d] = [0,1,0,0]
            //    (which encodes a 180 degree rotation about the x-axis).
            // Define a, b, c, d for coding covenience
            const a = this.quatern_a;
            const b = this.quatern_b;
            const c = this.quatern_c;
            const d = this.quatern_d;
            this.qfac = this.pixDims[0] === 0 ? 1 : this.pixDims[0];
            this.quatern_R = [
                [
                    a * a + b * b - c * c - d * d,
                    2 * b * c - 2 * a * d,
                    2 * b * d + 2 * a * c,
                ],
                [
                    2 * b * c + 2 * a * d,
                    a * a + c * c - b * b - d * d,
                    2 * c * d - 2 * a * b,
                ],
                [
                    2 * b * d - 2 * a * c,
                    2 * c * d + 2 * a * b,
                    a * a + d * d - c * c - b * b,
                ],
            ];
            for (ctrOut = 0; ctrOut < 3; ctrOut += 1) {
                for (ctrIn = 0; ctrIn < 3; ctrIn += 1) {
                    this.affine[ctrOut][ctrIn] =
                        this.quatern_R[ctrOut][ctrIn] * this.pixDims[ctrIn + 1];
                    if (ctrIn === 2) {
                        this.affine[ctrOut][ctrIn] *= this.qfac;
                    }
                }
            }
            // The last row of affine matrix is the offset vector
            this.affine[0][3] = this.qoffset_x;
            this.affine[1][3] = this.qoffset_y;
            this.affine[2][3] = this.qoffset_z;
        }
        else if (this.sform_code > 0) {
            //    METHOD 3 (used when sform_code > 0):
            //    -----------------------------------
            //    The (x,y,z) coordinates are given by a general affine transformation
            //    of the (i,j,k) indexes:
            //
            //      x = srow_x[0] * i + srow_x[1] * j + srow_x[2] * k + srow_x[3]
            //      y = srow_y[0] * i + srow_y[1] * j + srow_y[2] * k + srow_y[3]
            //      z = srow_z[0] * i + srow_z[1] * j + srow_z[2] * k + srow_z[3]
            //
            //    The srow_* vectors are in the NIFTI_1 header.  Note that no use is
            //    made of pixdim[] in this method.
            for (ctrOut = 0; ctrOut < 3; ctrOut += 1) {
                for (ctrIn = 0; ctrIn < 4; ctrIn += 1) {
                    index = 280 + (ctrOut * 4 + ctrIn) * 4;
                    this.affine[ctrOut][ctrIn] = utilities_1.Utils.getFloatAt(rawData, index, this.littleEndian);
                }
            }
        }
        this.affine[3][0] = 0;
        this.affine[3][1] = 0;
        this.affine[3][2] = 0;
        this.affine[3][3] = 1;
        this.intent_name = utilities_1.Utils.getStringAt(rawData, 328, 344);
        this.magic = utilities_1.Utils.getStringAt(rawData, 344, 348);
        this.isHDR = this.magic === String.fromCharCode.apply(null, NIFTI1.MAGIC_NUMBER2);
        if (rawData.byteLength > NIFTI1.MAGIC_COOKIE) {
            this.extensionFlag[0] = utilities_1.Utils.getByteAt(rawData, 348);
            this.extensionFlag[1] = utilities_1.Utils.getByteAt(rawData, 348 + 1);
            this.extensionFlag[2] = utilities_1.Utils.getByteAt(rawData, 348 + 2);
            this.extensionFlag[3] = utilities_1.Utils.getByteAt(rawData, 348 + 3);
            let isExtensionCapable = true;
            if ((!this.isHDR) && (this.vox_offset <= 352))
                isExtensionCapable = false;
            if (rawData.byteLength <= (352 + 16))
                isExtensionCapable = false;
            if (isExtensionCapable && this.extensionFlag[0]) {
                // read our extensions
                this.extensions = utilities_1.Utils.getExtensionsAt(rawData, this.getExtensionLocation(), this.littleEndian, this.vox_offset);
                // set the extensionSize and extensionCode from the first extension found
                this.extensionSize = this.extensions[0].esize;
                this.extensionCode = this.extensions[0].ecode;
            }
        }
    }
    /**
     * Returns a formatted string of header fields.
     * @returns {string}
     */
    toFormattedString() {
        var fmt = utilities_1.Utils.formatNumber, string = "";
        string += "Dim Info = " + this.dim_info + "\n";
        string +=
            "Image Dimensions (1-8): " +
                this.dims[0] +
                ", " +
                this.dims[1] +
                ", " +
                this.dims[2] +
                ", " +
                this.dims[3] +
                ", " +
                this.dims[4] +
                ", " +
                this.dims[5] +
                ", " +
                this.dims[6] +
                ", " +
                this.dims[7] +
                "\n";
        string +=
            "Intent Parameters (1-3): " +
                this.intent_p1 +
                ", " +
                this.intent_p2 +
                ", " +
                this.intent_p3 +
                "\n";
        string += "Intent Code = " + this.intent_code + "\n";
        string +=
            "Datatype = " +
                this.datatypeCode +
                " (" +
                this.getDatatypeCodeString(this.datatypeCode) +
                ")\n";
        string += "Bits Per Voxel = " + this.numBitsPerVoxel + "\n";
        string += "Slice Start = " + this.slice_start + "\n";
        string +=
            "Voxel Dimensions (1-8): " +
                fmt(this.pixDims[0]) +
                ", " +
                fmt(this.pixDims[1]) +
                ", " +
                fmt(this.pixDims[2]) +
                ", " +
                fmt(this.pixDims[3]) +
                ", " +
                fmt(this.pixDims[4]) +
                ", " +
                fmt(this.pixDims[5]) +
                ", " +
                fmt(this.pixDims[6]) +
                ", " +
                fmt(this.pixDims[7]) +
                "\n";
        string += "Image Offset = " + this.vox_offset + "\n";
        string +=
            "Data Scale:  Slope = " +
                fmt(this.scl_slope) +
                "  Intercept = " +
                fmt(this.scl_inter) +
                "\n";
        string += "Slice End = " + this.slice_end + "\n";
        string += "Slice Code = " + this.slice_code + "\n";
        string +=
            "Units Code = " +
                this.xyzt_units +
                " (" +
                this.getUnitsCodeString(NIFTI1.SPATIAL_UNITS_MASK & this.xyzt_units) +
                ", " +
                this.getUnitsCodeString(NIFTI1.TEMPORAL_UNITS_MASK & this.xyzt_units) +
                ")\n";
        string +=
            "Display Range:  Max = " +
                fmt(this.cal_max) +
                "  Min = " +
                fmt(this.cal_min) +
                "\n";
        string += "Slice Duration = " + this.slice_duration + "\n";
        string += "Time Axis Shift = " + this.toffset + "\n";
        string += 'Description: "' + this.description + '"\n';
        string += 'Auxiliary File: "' + this.aux_file + '"\n';
        string +=
            "Q-Form Code = " +
                this.qform_code +
                " (" +
                this.getTransformCodeString(this.qform_code) +
                ")\n";
        string +=
            "S-Form Code = " +
                this.sform_code +
                " (" +
                this.getTransformCodeString(this.sform_code) +
                ")\n";
        string +=
            "Quaternion Parameters:  " +
                "b = " +
                fmt(this.quatern_b) +
                "  " +
                "c = " +
                fmt(this.quatern_c) +
                "  " +
                "d = " +
                fmt(this.quatern_d) +
                "\n";
        string +=
            "Quaternion Offsets:  " +
                "x = " +
                this.qoffset_x +
                "  " +
                "y = " +
                this.qoffset_y +
                "  " +
                "z = " +
                this.qoffset_z +
                "\n";
        string +=
            "S-Form Parameters X: " +
                fmt(this.affine[0][0]) +
                ", " +
                fmt(this.affine[0][1]) +
                ", " +
                fmt(this.affine[0][2]) +
                ", " +
                fmt(this.affine[0][3]) +
                "\n";
        string +=
            "S-Form Parameters Y: " +
                fmt(this.affine[1][0]) +
                ", " +
                fmt(this.affine[1][1]) +
                ", " +
                fmt(this.affine[1][2]) +
                ", " +
                fmt(this.affine[1][3]) +
                "\n";
        string +=
            "S-Form Parameters Z: " +
                fmt(this.affine[2][0]) +
                ", " +
                fmt(this.affine[2][1]) +
                ", " +
                fmt(this.affine[2][2]) +
                ", " +
                fmt(this.affine[2][3]) +
                "\n";
        string += 'Intent Name: "' + this.intent_name + '"\n';
        if (this.extensionFlag[0]) {
            string +=
                "Extension: Size = " +
                    this.extensionSize +
                    "  Code = " +
                    this.extensionCode +
                    "\n";
        }
        return string;
    }
    /**
     * Returns a human-readable string of datatype.
     * @param {number} code
     * @returns {string}
     */
    getDatatypeCodeString = function (code) {
        if (code === NIFTI1.TYPE_UINT8) {
            return "1-Byte Unsigned Integer";
        }
        else if (code === NIFTI1.TYPE_INT16) {
            return "2-Byte Signed Integer";
        }
        else if (code === NIFTI1.TYPE_INT32) {
            return "4-Byte Signed Integer";
        }
        else if (code === NIFTI1.TYPE_FLOAT32) {
            return "4-Byte Float";
        }
        else if (code === NIFTI1.TYPE_FLOAT64) {
            return "8-Byte Float";
        }
        else if (code === NIFTI1.TYPE_RGB24) {
            return "RGB";
        }
        else if (code === NIFTI1.TYPE_INT8) {
            return "1-Byte Signed Integer";
        }
        else if (code === NIFTI1.TYPE_UINT16) {
            return "2-Byte Unsigned Integer";
        }
        else if (code === NIFTI1.TYPE_UINT32) {
            return "4-Byte Unsigned Integer";
        }
        else if (code === NIFTI1.TYPE_INT64) {
            return "8-Byte Signed Integer";
        }
        else if (code === NIFTI1.TYPE_UINT64) {
            return "8-Byte Unsigned Integer";
        }
        else {
            return "Unknown";
        }
    };
    /**
     * Returns a human-readable string of transform type.
     * @param {number} code
     * @returns {string}
     */
    getTransformCodeString = function (code) {
        if (code === NIFTI1.XFORM_SCANNER_ANAT) {
            return "Scanner";
        }
        else if (code === NIFTI1.XFORM_ALIGNED_ANAT) {
            return "Aligned";
        }
        else if (code === NIFTI1.XFORM_TALAIRACH) {
            return "Talairach";
        }
        else if (code === NIFTI1.XFORM_MNI_152) {
            return "MNI";
        }
        else {
            return "Unknown";
        }
    };
    /**
     * Returns a human-readable string of spatial and temporal units.
     * @param {number} code
     * @returns {string}
     */
    getUnitsCodeString = function (code) {
        if (code === NIFTI1.UNITS_METER) {
            return "Meters";
        }
        else if (code === NIFTI1.UNITS_MM) {
            return "Millimeters";
        }
        else if (code === NIFTI1.UNITS_MICRON) {
            return "Microns";
        }
        else if (code === NIFTI1.UNITS_SEC) {
            return "Seconds";
        }
        else if (code === NIFTI1.UNITS_MSEC) {
            return "Milliseconds";
        }
        else if (code === NIFTI1.UNITS_USEC) {
            return "Microseconds";
        }
        else if (code === NIFTI1.UNITS_HZ) {
            return "Hz";
        }
        else if (code === NIFTI1.UNITS_PPM) {
            return "PPM";
        }
        else if (code === NIFTI1.UNITS_RADS) {
            return "Rads";
        }
        else {
            return "Unknown";
        }
    };
    /**
     * Returns the qform matrix.
     * @returns {Array.<Array.<number>>}
     */
    getQformMat() {
        return this.convertNiftiQFormToNiftiSForm(this.quatern_b, this.quatern_c, this.quatern_d, this.qoffset_x, this.qoffset_y, this.qoffset_z, this.pixDims[1], this.pixDims[2], this.pixDims[3], this.pixDims[0]);
    }
    /**
     * Converts qform to an affine.  (See http://nifti.nimh.nih.gov/pub/dist/src/niftilib/nifti1_io.c)
     * @param {number} qb
     * @param {number} qc
     * @param {number} qd
     * @param {number} qx
     * @param {number} qy
     * @param {number} qz
     * @param {number} dx
     * @param {number} dy
     * @param {number} dz
     * @param {number} qfac
     * @returns {Array.<Array.<number>>}
     */
    convertNiftiQFormToNiftiSForm(qb, qc, qd, qx, qy, qz, dx, dy, dz, qfac) {
        var R = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ], a, b = qb, c = qc, d = qd, xd, yd, zd;
        // last row is always [ 0 0 0 1 ]
        R[3][0] = R[3][1] = R[3][2] = 0.0;
        R[3][3] = 1.0;
        // compute a parameter from b,c,d
        a = 1.0 - (b * b + c * c + d * d);
        if (a < 0.0000001) {
            /* special case */
            a = 1.0 / Math.sqrt(b * b + c * c + d * d);
            b *= a;
            c *= a;
            d *= a; /* normalize (b,c,d) vector */
            a = 0.0; /* a = 0 ==> 180 degree rotation */
        }
        else {
            a = Math.sqrt(a); /* angle = 2*arccos(a) */
        }
        // load rotation matrix, including scaling factors for voxel sizes
        xd = dx > 0.0 ? dx : 1.0; /* make sure are positive */
        yd = dy > 0.0 ? dy : 1.0;
        zd = dz > 0.0 ? dz : 1.0;
        if (qfac < 0.0) {
            zd = -zd; /* left handedness? */
        }
        R[0][0] = (a * a + b * b - c * c - d * d) * xd;
        R[0][1] = 2.0 * (b * c - a * d) * yd;
        R[0][2] = 2.0 * (b * d + a * c) * zd;
        R[1][0] = 2.0 * (b * c + a * d) * xd;
        R[1][1] = (a * a + c * c - b * b - d * d) * yd;
        R[1][2] = 2.0 * (c * d - a * b) * zd;
        R[2][0] = 2.0 * (b * d - a * c) * xd;
        R[2][1] = 2.0 * (c * d + a * b) * yd;
        R[2][2] = (a * a + d * d - c * c - b * b) * zd;
        // load offsets
        R[0][3] = qx;
        R[1][3] = qy;
        R[2][3] = qz;
        return R;
    }
    /**
     * Converts sform to an orientation string (e.g., XYZ+--).  (See http://nifti.nimh.nih.gov/pub/dist/src/niftilib/nifti1_io.c)
     * @param {Array.<Array.<number>>} R
     * @returns {string}
     */
    convertNiftiSFormToNEMA(R) {
        var xi, xj, xk, yi, yj, yk, zi, zj, zk, val, detQ, detP, i, j, k, p, q, r, ibest, jbest, kbest, pbest, qbest, rbest, M, vbest, Q, P, iChar, jChar, kChar, iSense, jSense, kSense;
        k = 0;
        Q = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
        P = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
        //if( icod == NULL || jcod == NULL || kcod == NULL ) return ; /* bad */
        //*icod = *jcod = *kcod = 0 ; /* this.errorMessage returns, if sh*t happens */
        /* load column vectors for each (i,j,k) direction from matrix */
        /*-- i axis --*/ /*-- j axis --*/ /*-- k axis --*/
        xi = R[0][0];
        xj = R[0][1];
        xk = R[0][2];
        yi = R[1][0];
        yj = R[1][1];
        yk = R[1][2];
        zi = R[2][0];
        zj = R[2][1];
        zk = R[2][2];
        /* normalize column vectors to get unit vectors along each ijk-axis */
        /* normalize i axis */
        val = Math.sqrt(xi * xi + yi * yi + zi * zi);
        if (val === 0.0) {
            /* stupid input */
            return null;
        }
        xi /= val;
        yi /= val;
        zi /= val;
        /* normalize j axis */
        val = Math.sqrt(xj * xj + yj * yj + zj * zj);
        if (val === 0.0) {
            /* stupid input */
            return null;
        }
        xj /= val;
        yj /= val;
        zj /= val;
        /* orthogonalize j axis to i axis, if needed */
        val = xi * xj + yi * yj + zi * zj; /* dot product between i and j */
        if (Math.abs(val) > 1e-4) {
            xj -= val * xi;
            yj -= val * yi;
            zj -= val * zi;
            val = Math.sqrt(xj * xj + yj * yj + zj * zj); /* must renormalize */
            if (val === 0.0) {
                /* j was parallel to i? */
                return null;
            }
            xj /= val;
            yj /= val;
            zj /= val;
        }
        /* normalize k axis; if it is zero, make it the cross product i x j */
        val = Math.sqrt(xk * xk + yk * yk + zk * zk);
        if (val === 0.0) {
            xk = yi * zj - zi * yj;
            yk = zi * xj - zj * xi;
            zk = xi * yj - yi * xj;
        }
        else {
            xk /= val;
            yk /= val;
            zk /= val;
        }
        /* orthogonalize k to i */
        val = xi * xk + yi * yk + zi * zk; /* dot product between i and k */
        if (Math.abs(val) > 1e-4) {
            xk -= val * xi;
            yk -= val * yi;
            zk -= val * zi;
            val = Math.sqrt(xk * xk + yk * yk + zk * zk);
            if (val === 0.0) {
                /* bad */
                return null;
            }
            xk /= val;
            yk /= val;
            zk /= val;
        }
        /* orthogonalize k to j */
        val = xj * xk + yj * yk + zj * zk; /* dot product between j and k */
        if (Math.abs(val) > 1e-4) {
            xk -= val * xj;
            yk -= val * yj;
            zk -= val * zj;
            val = Math.sqrt(xk * xk + yk * yk + zk * zk);
            if (val === 0.0) {
                /* bad */
                return null;
            }
            xk /= val;
            yk /= val;
            zk /= val;
        }
        Q[0][0] = xi;
        Q[0][1] = xj;
        Q[0][2] = xk;
        Q[1][0] = yi;
        Q[1][1] = yj;
        Q[1][2] = yk;
        Q[2][0] = zi;
        Q[2][1] = zj;
        Q[2][2] = zk;
        /* at this point, Q is the rotation matrix from the (i,j,k) to (x,y,z) axes */
        detQ = this.nifti_mat33_determ(Q);
        if (detQ === 0.0) {
            /* shouldn't happen unless user is a DUFIS */
            return null;
        }
        /* Build and test all possible +1/-1 coordinate permutation matrices P;
       then find the P such that the rotation matrix M=PQ is closest to the
       identity, in the sense of M having the smallest total rotation angle. */
        /* Despite the formidable looking 6 nested loops, there are
       only 3*3*3*2*2*2 = 216 passes, which will run very quickly. */
        vbest = -666.0;
        ibest = pbest = qbest = rbest = 1;
        jbest = 2;
        kbest = 3;
        for (i = 1; i <= 3; i += 1) {
            /* i = column number to use for row #1 */
            for (j = 1; j <= 3; j += 1) {
                /* j = column number to use for row #2 */
                if (i !== j) {
                    for (k = 1; k <= 3; k += 1) {
                        /* k = column number to use for row #3 */
                        if (!(i === k || j === k)) {
                            P[0][0] =
                                P[0][1] =
                                    P[0][2] =
                                        P[1][0] =
                                            P[1][1] =
                                                P[1][2] =
                                                    P[2][0] =
                                                        P[2][1] =
                                                            P[2][2] =
                                                                0.0;
                            for (p = -1; p <= 1; p += 2) {
                                /* p,q,r are -1 or +1      */
                                for (q = -1; q <= 1; q += 2) {
                                    /* and go into rows #1,2,3 */
                                    for (r = -1; r <= 1; r += 2) {
                                        P[0][i - 1] = p;
                                        P[1][j - 1] = q;
                                        P[2][k - 1] = r;
                                        detP =
                                            this.nifti_mat33_determ(P); /* sign of permutation */
                                        if (detP * detQ > 0.0) {
                                            M = this.nifti_mat33_mul(P, Q);
                                            /* angle of M rotation = 2.0*acos(0.5*sqrt(1.0+trace(M)))       */
                                            /* we want largest trace(M) == smallest angle == M nearest to I */
                                            val = M[0][0] + M[1][1] + M[2][2]; /* trace */
                                            if (val > vbest) {
                                                vbest = val;
                                                ibest = i;
                                                jbest = j;
                                                kbest = k;
                                                pbest = p;
                                                qbest = q;
                                                rbest = r;
                                            }
                                        } /* doesn't match sign of Q */
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        /* At this point ibest is 1 or 2 or 3; pbest is -1 or +1; etc.
  
       The matrix P that corresponds is the best permutation approximation
       to Q-inverse; that is, P (approximately) takes (x,y,z) coordinates
       to the (i,j,k) axes.
  
       For example, the first row of P (which contains pbest in column ibest)
       determines the way the i axis points relative to the anatomical
       (x,y,z) axes.  If ibest is 2, then the i axis is along the y axis,
       which is direction P2A (if pbest > 0) or A2P (if pbest < 0).
  
       So, using ibest and pbest, we can assign the output code for
       the i axis.  Mutatis mutandis for the j and k axes, of course. */
        iChar = jChar = kChar = iSense = jSense = kSense = "";
        switch (ibest * pbest) {
            case 1 /*i = NIFTI_L2R*/:
                iChar = "X";
                iSense = "+";
                break;
            case -1 /*i = NIFTI_R2L*/:
                iChar = "X";
                iSense = "-";
                break;
            case 2 /*i = NIFTI_P2A*/:
                iChar = "Y";
                iSense = "+";
                break;
            case -2 /*i = NIFTI_A2P*/:
                iChar = "Y";
                iSense = "-";
                break;
            case 3 /*i = NIFTI_I2S*/:
                iChar = "Z";
                iSense = "+";
                break;
            case -3 /*i = NIFTI_S2I*/:
                iChar = "Z";
                iSense = "-";
                break;
        }
        switch (jbest * qbest) {
            case 1 /*j = NIFTI_L2R*/:
                jChar = "X";
                jSense = "+";
                break;
            case -1 /*j = NIFTI_R2L*/:
                jChar = "X";
                jSense = "-";
                break;
            case 2 /*j = NIFTI_P2A*/:
                jChar = "Y";
                jSense = "+";
                break;
            case -2 /*j = NIFTI_A2P*/:
                jChar = "Y";
                jSense = "-";
                break;
            case 3 /*j = NIFTI_I2S*/:
                jChar = "Z";
                jSense = "+";
                break;
            case -3 /*j = NIFTI_S2I*/:
                jChar = "Z";
                jSense = "-";
                break;
        }
        switch (kbest * rbest) {
            case 1 /*k = NIFTI_L2R*/:
                kChar = "X";
                kSense = "+";
                break;
            case -1 /*k = NIFTI_R2L*/:
                kChar = "X";
                kSense = "-";
                break;
            case 2 /*k = NIFTI_P2A*/:
                kChar = "Y";
                kSense = "+";
                break;
            case -2 /*k = NIFTI_A2P*/:
                kChar = "Y";
                kSense = "-";
                break;
            case 3 /*k = NIFTI_I2S*/:
                kChar = "Z";
                kSense = "+";
                break;
            case -3 /*k = NIFTI_S2I*/:
                kChar = "Z";
                kSense = "-";
                break;
        }
        return iChar + jChar + kChar + iSense + jSense + kSense;
    }
    nifti_mat33_mul = function (A, B) {
        var C = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ], i, j;
        for (i = 0; i < 3; i += 1) {
            for (j = 0; j < 3; j += 1) {
                C[i][j] = A[i][0] * B[0][j] + A[i][1] * B[1][j] + A[i][2] * B[2][j];
            }
        }
        return C;
    };
    nifti_mat33_determ = function (R) {
        var r11, r12, r13, r21, r22, r23, r31, r32, r33;
        /*  INPUT MATRIX:  */
        r11 = R[0][0];
        r12 = R[0][1];
        r13 = R[0][2];
        r21 = R[1][0];
        r22 = R[1][1];
        r23 = R[1][2];
        r31 = R[2][0];
        r32 = R[2][1];
        r33 = R[2][2];
        return (r11 * r22 * r33 -
            r11 * r32 * r23 -
            r21 * r12 * r33 +
            r21 * r32 * r13 +
            r31 * r12 * r23 -
            r31 * r22 * r13);
    };
    /**
     * Returns the byte index of the extension.
     * @returns {number}
     */
    getExtensionLocation() {
        return NIFTI1.MAGIC_COOKIE + 4;
    }
    /**
     * Returns the extension size.
     * @param {DataView} data
     * @returns {number}
     */
    getExtensionSize(data) {
        return utilities_1.Utils.getIntAt(data, this.getExtensionLocation(), this.littleEndian);
    }
    /**
     * Returns the extension code.
     * @param {DataView} data
     * @returns {number}
     */
    getExtensionCode(data) {
        return utilities_1.Utils.getIntAt(data, this.getExtensionLocation() + 4, this.littleEndian);
    }
    /**
     * Adds an extension
     * @param {NIFTIEXTENSION} extension
     * @param {number} index
     */
    addExtension(extension, index = -1) {
        if (index == -1) {
            this.extensions.push(extension);
        }
        else {
            this.extensions.splice(index, 0, extension);
        }
        this.vox_offset += extension.esize;
    }
    /**
     * Removes an extension
     * @param {number} index
     */
    removeExtension(index) {
        let extension = this.extensions[index];
        if (extension) {
            this.vox_offset -= extension.esize;
        }
        this.extensions.splice(index, 1);
    }
    /**
     * Returns header as ArrayBuffer.
     * @param {boolean} includeExtensions - should extension bytes be included
     * @returns {ArrayBuffer}
     */
    toArrayBuffer(includeExtensions = false) {
        const SHORT_SIZE = 2;
        const FLOAT32_SIZE = 4;
        let byteSize = 348 + 4; // + 4 for the extension bytes
        // calculate necessary size
        if (includeExtensions) {
            for (let extension of this.extensions) {
                byteSize += extension.esize;
            }
        }
        let byteArray = new Uint8Array(byteSize);
        let view = new DataView(byteArray.buffer);
        // sizeof_hdr
        view.setInt32(0, 348, this.littleEndian);
        // data_type, db_name, extents, session_error, regular are not used
        // dim_info
        view.setUint8(39, this.dim_info);
        // dims
        for (let i = 0; i < 8; i++) {
            view.setUint16(40 + SHORT_SIZE * i, this.dims[i], this.littleEndian);
        }
        // intent_p1, intent_p2, intent_p3
        view.setFloat32(56, this.intent_p1, this.littleEndian);
        view.setFloat32(60, this.intent_p2, this.littleEndian);
        view.setFloat32(64, this.intent_p3, this.littleEndian);
        // intent_code, datatype, bitpix, slice_start
        view.setInt16(68, this.intent_code, this.littleEndian);
        view.setInt16(70, this.datatypeCode, this.littleEndian);
        view.setInt16(72, this.numBitsPerVoxel, this.littleEndian);
        view.setInt16(74, this.slice_start, this.littleEndian);
        // pixdim[8], vox_offset, scl_slope, scl_inter
        for (let i = 0; i < 8; i++) {
            view.setFloat32(76 + FLOAT32_SIZE * i, this.pixDims[i], this.littleEndian);
        }
        view.setFloat32(108, this.vox_offset, this.littleEndian);
        view.setFloat32(112, this.scl_slope, this.littleEndian);
        view.setFloat32(116, this.scl_inter, this.littleEndian);
        // slice_end
        view.setInt16(120, this.slice_end, this.littleEndian);
        // slice_code, xyzt_units
        view.setUint8(122, this.slice_code);
        view.setUint8(123, this.xyzt_units);
        // cal_max, cal_min, slice_duration, toffset
        view.setFloat32(124, this.cal_max, this.littleEndian);
        view.setFloat32(128, this.cal_min, this.littleEndian);
        view.setFloat32(132, this.slice_duration, this.littleEndian);
        view.setFloat32(136, this.toffset, this.littleEndian);
        // glmax, glmin are unused
        // descrip and aux_file
        byteArray.set(Buffer.from(this.description), 148);
        byteArray.set(Buffer.from(this.aux_file), 228);
        // qform_code, sform_code
        view.setInt16(252, this.qform_code, this.littleEndian);
        view.setInt16(254, this.sform_code, this.littleEndian);
        // quatern_b, quatern_c, quatern_d, qoffset_x, qoffset_y, qoffset_z, srow_x[4], srow_y[4], and srow_z[4]
        view.setFloat32(256, this.quatern_b, this.littleEndian);
        view.setFloat32(260, this.quatern_c, this.littleEndian);
        view.setFloat32(264, this.quatern_d, this.littleEndian);
        view.setFloat32(268, this.qoffset_x, this.littleEndian);
        view.setFloat32(272, this.qoffset_y, this.littleEndian);
        view.setFloat32(276, this.qoffset_z, this.littleEndian);
        const flattened = this.affine.flat();
        // we only want the first three rows
        for (let i = 0; i < 12; i++) {
            view.setFloat32(280 + FLOAT32_SIZE * i, flattened[i], this.littleEndian);
        }
        // intent_name and magic
        byteArray.set(Buffer.from(this.intent_name), 328);
        byteArray.set(Buffer.from(this.magic), 344);
        // add our extension data
        if (includeExtensions) {
            byteArray.set(Uint8Array.from([1, 0, 0, 0]), 348);
            let extensionByteIndex = this.getExtensionLocation();
            for (const extension of this.extensions) {
                view.setInt32(extensionByteIndex, extension.esize, extension.littleEndian);
                view.setInt32(extensionByteIndex + 4, extension.ecode, extension.littleEndian);
                byteArray.set(new Uint8Array(extension.edata), extensionByteIndex + 8);
                extensionByteIndex += extension.esize;
            }
        }
        else {
            // In a .nii file, these 4 bytes will always be present
            byteArray.set(new Uint8Array(4).fill(0), 348);
        }
        return byteArray.buffer;
    }
}
exports.NIFTI1 = NIFTI1;
//# sourceMappingURL=nifti1.js.map

/***/ },

/***/ 35961
(__unused_webpack_module, exports, __webpack_require__) {

/* provided dependency */ var Buffer = __webpack_require__(81429)["hp"];

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NIFTI2 = void 0;
const nifti1_1 = __webpack_require__(24960);
const utilities_1 = __webpack_require__(6637);
/**
 * The NIFTI2 constructor.
 * @constructor
 * @property {boolean} littleEndian
 * @property {number} dim_info
 * @property {number[]} dims - image dimensions
 * @property {number} intent_p1
 * @property {number} intent_p2
 * @property {number} intent_p3
 * @property {number} intent_code
 * @property {number} datatypeCode
 * @property {number} numBitsPerVoxel
 * @property {number} slice_start
 * @property {number} slice_end
 * @property {number} slice_code
 * @property {number[]} pixDims - voxel dimensions
 * @property {number} vox_offset
 * @property {number} scl_slope
 * @property {number} scl_inter
 * @property {number} xyzt_units
 * @property {number} cal_max
 * @property {number} cal_min
 * @property {number} slice_duration
 * @property {number} toffset
 * @property {string} description
 * @property {string} aux_file
 * @property {string} intent_name
 * @property {number} qform_code
 * @property {number} sform_code
 * @property {number} quatern_b
 * @property {number} quatern_c
 * @property {number} quatern_d
 * @property {number} quatern_x
 * @property {number} quatern_y
 * @property {number} quatern_z
 * @property {Array.<Array.<number>>} affine
 * @property {string} magic
 * @property {number[]} extensionFlag
 * @property {NIFTIEXTENSION[]} extensions
 * @type {Function}
 */
class NIFTI2 {
    littleEndian = false;
    dim_info = 0;
    dims = [];
    intent_p1 = 0;
    intent_p2 = 0;
    intent_p3 = 0;
    intent_code = 0;
    datatypeCode = 0;
    numBitsPerVoxel = 0;
    slice_start = 0;
    slice_end = 0;
    slice_code = 0;
    pixDims = [];
    vox_offset = 0;
    scl_slope = 1;
    scl_inter = 0;
    xyzt_units = 0;
    cal_max = 0;
    cal_min = 0;
    slice_duration = 0;
    toffset = 0;
    description = "";
    aux_file = "";
    intent_name = "";
    qform_code = 0;
    sform_code = 0;
    quatern_b = 0;
    quatern_c = 0;
    quatern_d = 0;
    qoffset_x = 0;
    qoffset_y = 0;
    qoffset_z = 0;
    affine = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ];
    magic = "0";
    extensionFlag = [0, 0, 0, 0];
    extensions = [];
    extensionSize = 0;
    extensionCode = 0;
    /*** Static Pseudo-constants ***/
    static MAGIC_COOKIE = 540;
    static MAGIC_NUMBER_LOCATION = 4;
    static MAGIC_NUMBER = [
        0x6e, 0x2b, 0x32, 0, 0x0d, 0x0a, 0x1a, 0x0a,
    ]; // n+2\0
    static MAGIC_NUMBER2 = [
        0x6e, 0x69, 0x32, 0, 0x0d, 0x0a, 0x1a, 0x0a,
    ]; // ni2\0
    /*** Prototype Methods ***/
    /**
     * Reads the header data.
     * @param {ArrayBuffer} data
     */
    readHeader(data) {
        var rawData = new DataView(data), magicCookieVal = utilities_1.Utils.getIntAt(rawData, 0, this.littleEndian), ctr, ctrOut, ctrIn, index, array;
        if (magicCookieVal !== NIFTI2.MAGIC_COOKIE) {
            // try as little endian
            this.littleEndian = true;
            magicCookieVal = utilities_1.Utils.getIntAt(rawData, 0, this.littleEndian);
        }
        if (magicCookieVal !== NIFTI2.MAGIC_COOKIE) {
            throw new Error("This does not appear to be a NIFTI file!");
        }
        this.magic = utilities_1.Utils.getStringAt(rawData, 4, 12);
        this.datatypeCode = utilities_1.Utils.getShortAt(rawData, 12, this.littleEndian);
        this.numBitsPerVoxel = utilities_1.Utils.getShortAt(rawData, 14, this.littleEndian);
        for (ctr = 0; ctr < 8; ctr += 1) {
            index = 16 + ctr * 8;
            this.dims[ctr] = utilities_1.Utils.getInt64At(rawData, index, this.littleEndian);
        }
        this.intent_p1 = utilities_1.Utils.getDoubleAt(rawData, 80, this.littleEndian);
        this.intent_p2 = utilities_1.Utils.getDoubleAt(rawData, 88, this.littleEndian);
        this.intent_p3 = utilities_1.Utils.getDoubleAt(rawData, 96, this.littleEndian);
        for (ctr = 0; ctr < 8; ctr += 1) {
            index = 104 + ctr * 8;
            this.pixDims[ctr] = utilities_1.Utils.getDoubleAt(rawData, index, this.littleEndian);
        }
        this.vox_offset = utilities_1.Utils.getInt64At(rawData, 168, this.littleEndian);
        this.scl_slope = utilities_1.Utils.getDoubleAt(rawData, 176, this.littleEndian);
        this.scl_inter = utilities_1.Utils.getDoubleAt(rawData, 184, this.littleEndian);
        this.cal_max = utilities_1.Utils.getDoubleAt(rawData, 192, this.littleEndian);
        this.cal_min = utilities_1.Utils.getDoubleAt(rawData, 200, this.littleEndian);
        this.slice_duration = utilities_1.Utils.getDoubleAt(rawData, 208, this.littleEndian);
        this.toffset = utilities_1.Utils.getDoubleAt(rawData, 216, this.littleEndian);
        this.slice_start = utilities_1.Utils.getInt64At(rawData, 224, this.littleEndian);
        this.slice_end = utilities_1.Utils.getInt64At(rawData, 232, this.littleEndian);
        this.description = utilities_1.Utils.getStringAt(rawData, 240, 240 + 80);
        this.aux_file = utilities_1.Utils.getStringAt(rawData, 320, 320 + 24);
        this.qform_code = utilities_1.Utils.getIntAt(rawData, 344, this.littleEndian);
        this.sform_code = utilities_1.Utils.getIntAt(rawData, 348, this.littleEndian);
        this.quatern_b = utilities_1.Utils.getDoubleAt(rawData, 352, this.littleEndian);
        this.quatern_c = utilities_1.Utils.getDoubleAt(rawData, 360, this.littleEndian);
        this.quatern_d = utilities_1.Utils.getDoubleAt(rawData, 368, this.littleEndian);
        this.qoffset_x = utilities_1.Utils.getDoubleAt(rawData, 376, this.littleEndian);
        this.qoffset_y = utilities_1.Utils.getDoubleAt(rawData, 384, this.littleEndian);
        this.qoffset_z = utilities_1.Utils.getDoubleAt(rawData, 392, this.littleEndian);
        for (ctrOut = 0; ctrOut < 3; ctrOut += 1) {
            for (ctrIn = 0; ctrIn < 4; ctrIn += 1) {
                index = 400 + (ctrOut * 4 + ctrIn) * 8;
                this.affine[ctrOut][ctrIn] = utilities_1.Utils.getDoubleAt(rawData, index, this.littleEndian);
            }
        }
        this.affine[3][0] = 0;
        this.affine[3][1] = 0;
        this.affine[3][2] = 0;
        this.affine[3][3] = 1;
        this.slice_code = utilities_1.Utils.getIntAt(rawData, 496, this.littleEndian);
        this.xyzt_units = utilities_1.Utils.getIntAt(rawData, 500, this.littleEndian);
        this.intent_code = utilities_1.Utils.getIntAt(rawData, 504, this.littleEndian);
        this.intent_name = utilities_1.Utils.getStringAt(rawData, 508, 508 + 16);
        this.dim_info = utilities_1.Utils.getByteAt(rawData, 524);
        if (rawData.byteLength > NIFTI2.MAGIC_COOKIE) {
            this.extensionFlag[0] = utilities_1.Utils.getByteAt(rawData, 540);
            this.extensionFlag[1] = utilities_1.Utils.getByteAt(rawData, 540 + 1);
            this.extensionFlag[2] = utilities_1.Utils.getByteAt(rawData, 540 + 2);
            this.extensionFlag[3] = utilities_1.Utils.getByteAt(rawData, 540 + 3);
            if (this.extensionFlag[0]) {
                // read our extensions
                this.extensions = utilities_1.Utils.getExtensionsAt(rawData, this.getExtensionLocation(), this.littleEndian, this.vox_offset);
                // set the extensionSize and extensionCode from the first extension found
                this.extensionSize = this.extensions[0].esize;
                this.extensionCode = this.extensions[0].ecode;
            }
        }
    }
    /**
     * Returns a formatted string of header fields.
     * @returns {string}
     */
    toFormattedString() {
        var fmt = utilities_1.Utils.formatNumber, string = "";
        string +=
            "Datatype = " +
                +this.datatypeCode +
                " (" +
                this.getDatatypeCodeString(this.datatypeCode) +
                ")\n";
        string += "Bits Per Voxel = " + " = " + this.numBitsPerVoxel + "\n";
        string +=
            "Image Dimensions" +
                " (1-8): " +
                this.dims[0] +
                ", " +
                this.dims[1] +
                ", " +
                this.dims[2] +
                ", " +
                this.dims[3] +
                ", " +
                this.dims[4] +
                ", " +
                this.dims[5] +
                ", " +
                this.dims[6] +
                ", " +
                this.dims[7] +
                "\n";
        string +=
            "Intent Parameters (1-3): " +
                this.intent_p1 +
                ", " +
                this.intent_p2 +
                ", " +
                this.intent_p3 +
                "\n";
        string +=
            "Voxel Dimensions (1-8): " +
                fmt(this.pixDims[0]) +
                ", " +
                fmt(this.pixDims[1]) +
                ", " +
                fmt(this.pixDims[2]) +
                ", " +
                fmt(this.pixDims[3]) +
                ", " +
                fmt(this.pixDims[4]) +
                ", " +
                fmt(this.pixDims[5]) +
                ", " +
                fmt(this.pixDims[6]) +
                ", " +
                fmt(this.pixDims[7]) +
                "\n";
        string += "Image Offset = " + this.vox_offset + "\n";
        string +=
            "Data Scale:  Slope = " +
                fmt(this.scl_slope) +
                "  Intercept = " +
                fmt(this.scl_inter) +
                "\n";
        string +=
            "Display Range:  Max = " +
                fmt(this.cal_max) +
                "  Min = " +
                fmt(this.cal_min) +
                "\n";
        string += "Slice Duration = " + this.slice_duration + "\n";
        string += "Time Axis Shift = " + this.toffset + "\n";
        string += "Slice Start = " + this.slice_start + "\n";
        string += "Slice End = " + this.slice_end + "\n";
        string += 'Description: "' + this.description + '"\n';
        string += 'Auxiliary File: "' + this.aux_file + '"\n';
        string +=
            "Q-Form Code = " +
                this.qform_code +
                " (" +
                this.getTransformCodeString(this.qform_code) +
                ")\n";
        string +=
            "S-Form Code = " +
                this.sform_code +
                " (" +
                this.getTransformCodeString(this.sform_code) +
                ")\n";
        string +=
            "Quaternion Parameters:  " +
                "b = " +
                fmt(this.quatern_b) +
                "  " +
                "c = " +
                fmt(this.quatern_c) +
                "  " +
                "d = " +
                fmt(this.quatern_d) +
                "\n";
        string +=
            "Quaternion Offsets:  " +
                "x = " +
                this.qoffset_x +
                "  " +
                "y = " +
                this.qoffset_y +
                "  " +
                "z = " +
                this.qoffset_z +
                "\n";
        string +=
            "S-Form Parameters X: " +
                fmt(this.affine[0][0]) +
                ", " +
                fmt(this.affine[0][1]) +
                ", " +
                fmt(this.affine[0][2]) +
                ", " +
                fmt(this.affine[0][3]) +
                "\n";
        string +=
            "S-Form Parameters Y: " +
                fmt(this.affine[1][0]) +
                ", " +
                fmt(this.affine[1][1]) +
                ", " +
                fmt(this.affine[1][2]) +
                ", " +
                fmt(this.affine[1][3]) +
                "\n";
        string +=
            "S-Form Parameters Z: " +
                fmt(this.affine[2][0]) +
                ", " +
                fmt(this.affine[2][1]) +
                ", " +
                fmt(this.affine[2][2]) +
                ", " +
                fmt(this.affine[2][3]) +
                "\n";
        string += "Slice Code = " + this.slice_code + "\n";
        string +=
            "Units Code = " +
                this.xyzt_units +
                " (" +
                this.getUnitsCodeString(nifti1_1.NIFTI1.SPATIAL_UNITS_MASK & this.xyzt_units) +
                ", " +
                this.getUnitsCodeString(nifti1_1.NIFTI1.TEMPORAL_UNITS_MASK & this.xyzt_units) +
                ")\n";
        string += "Intent Code = " + this.intent_code + "\n";
        string += 'Intent Name: "' + this.intent_name + '"\n';
        string += "Dim Info = " + this.dim_info + "\n";
        return string;
    }
    /**
     * Returns the byte index of the extension.
     * @returns {number}
     */
    getExtensionLocation = function () {
        return NIFTI2.MAGIC_COOKIE + 4;
    };
    /**
     * Returns the extension size.
     * @param {DataView} data
     * @returns {number}
     */
    getExtensionSize = nifti1_1.NIFTI1.prototype.getExtensionSize;
    /**
     * Returns the extension code.
     * @param {DataView} data
     * @returns {number}
     */
    getExtensionCode = nifti1_1.NIFTI1.prototype.getExtensionCode;
    /**
     * Adds an extension
     * @param {NIFTIEXTENSION} extension
     * @param {number} index
     */
    addExtension = nifti1_1.NIFTI1.prototype.addExtension;
    /**
     * Removes an extension
     * @param {number} index
     */
    removeExtension = nifti1_1.NIFTI1.prototype.removeExtension;
    /**
     * Returns a human-readable string of datatype.
     * @param {number} code
     * @returns {string}
     */
    getDatatypeCodeString = nifti1_1.NIFTI1.prototype.getDatatypeCodeString;
    /**
     * Returns a human-readable string of transform type.
     * @param {number} code
     * @returns {string}
     */
    getTransformCodeString = nifti1_1.NIFTI1.prototype.getTransformCodeString;
    /**
     * Returns a human-readable string of spatial and temporal units.
     * @param {number} code
     * @returns {string}
     */
    getUnitsCodeString = nifti1_1.NIFTI1.prototype.getUnitsCodeString;
    /**
     * Returns the qform matrix.
     * @returns {Array.<Array.<number>>}
     */
    getQformMat = nifti1_1.NIFTI1.prototype.getQformMat;
    /**
     * Converts qform to an affine.  (See http://nifti.nimh.nih.gov/pub/dist/src/niftilib/nifti1_io.c)
     * @param {number} qb
     * @param {number} qc
     * @param {number} qd
     * @param {number} qx
     * @param {number} qy
     * @param {number} qz
     * @param {number} dx
     * @param {number} dy
     * @param {number} dz
     * @param {number} qfac
     * @returns {Array.<Array.<number>>}
     */
    convertNiftiQFormToNiftiSForm = nifti1_1.NIFTI1.prototype.convertNiftiQFormToNiftiSForm;
    /**
     * Converts sform to an orientation string (e.g., XYZ+--).  (See http://nimh.nih.gov/pub/dist/src/niftilib/nifti1_io.c)
     * @param {Array.<Array.<number>>} R
     * @returns {string}
     */
    convertNiftiSFormToNEMA = nifti1_1.NIFTI1.prototype.convertNiftiSFormToNEMA;
    nifti_mat33_mul = nifti1_1.NIFTI1.prototype.nifti_mat33_mul;
    nifti_mat33_determ = nifti1_1.NIFTI1.prototype.nifti_mat33_determ;
    /**
     * Returns header as ArrayBuffer.
     * @param {boolean} includeExtensions - should extension bytes be included
     * @returns {ArrayBuffer}
     */
    toArrayBuffer(includeExtensions = false) {
        const INT64_SIZE = 8;
        const DOUBLE_SIZE = 8;
        let byteSize = 540 + 4; // +4 for extension bytes
        // calculate necessary size
        if (includeExtensions) {
            for (let extension of this.extensions) {
                byteSize += extension.esize;
            }
        }
        let byteArray = new Uint8Array(byteSize);
        let view = new DataView(byteArray.buffer);
        // sizeof_hdr
        view.setInt32(0, 540, this.littleEndian);
        // magic
        byteArray.set(Buffer.from(this.magic), 4);
        // datatype
        view.setInt16(12, this.datatypeCode, this.littleEndian);
        // bitpix
        view.setInt16(14, this.numBitsPerVoxel, this.littleEndian);
        // dim[8]
        for (let i = 0; i < 8; i++) {
            view.setBigInt64(16 + INT64_SIZE * i, BigInt(this.dims[i]), this.littleEndian);
        }
        // intent_p1
        view.setFloat64(80, this.intent_p1, this.littleEndian);
        // intent_p2
        view.setFloat64(88, this.intent_p2, this.littleEndian);
        // intent_p3
        view.setFloat64(96, this.intent_p3, this.littleEndian);
        // pixdim
        for (let i = 0; i < 8; i++) {
            view.setFloat64(104 + DOUBLE_SIZE * i, this.pixDims[i], this.littleEndian);
        }
        // vox_offset
        view.setBigInt64(168, BigInt(this.vox_offset), this.littleEndian);
        // scl_slope
        view.setFloat64(176, this.scl_slope, this.littleEndian);
        // scl_inter
        view.setFloat64(184, this.scl_inter, this.littleEndian);
        // cal_max
        view.setFloat64(192, this.cal_max, this.littleEndian);
        // cal_min
        view.setFloat64(200, this.cal_min, this.littleEndian);
        // slice_duration
        view.setFloat64(208, this.slice_duration, this.littleEndian);
        // toffset
        view.setFloat64(216, this.toffset, this.littleEndian);
        // slice_start
        view.setBigInt64(224, BigInt(this.slice_start), this.littleEndian);
        // slice end
        view.setBigInt64(232, BigInt(this.slice_end), this.littleEndian);
        // descrip
        byteArray.set(Buffer.from(this.description), 240);
        // aux_file
        byteArray.set(Buffer.from(this.aux_file), 320);
        // qform_code
        view.setInt32(344, this.qform_code, this.littleEndian);
        // sform_code
        view.setInt32(348, this.sform_code, this.littleEndian);
        // quatern_b
        view.setFloat64(352, this.quatern_b, this.littleEndian);
        // quatern_c
        view.setFloat64(360, this.quatern_c, this.littleEndian);
        // quatern_d
        view.setFloat64(368, this.quatern_d, this.littleEndian);
        // qoffset_x
        view.setFloat64(376, this.qoffset_x, this.littleEndian);
        // qoffset_y
        view.setFloat64(384, this.qoffset_y, this.littleEndian);
        // qoffset_z
        view.setFloat64(392, this.qoffset_z, this.littleEndian);
        // srow_x[4], srow_y[4], and srow_z[4]
        const flattened = this.affine.flat();
        // we only want the first three rows
        for (let i = 0; i < 12; i++) {
            view.setFloat64(400 + DOUBLE_SIZE * i, flattened[i], this.littleEndian);
        }
        // slice_code
        view.setInt32(496, this.slice_code, this.littleEndian);
        //  xyzt_units
        view.setInt32(500, this.xyzt_units, this.littleEndian);
        //  intent_code
        view.setInt32(504, this.intent_code, this.littleEndian);
        //  intent_name
        byteArray.set(Buffer.from(this.intent_name), 508);
        // dim_info
        view.setUint8(524, this.dim_info);
        // add our extension data
        if (includeExtensions) {
            byteArray.set(Uint8Array.from([1, 0, 0, 0]), 540);
            let extensionByteIndex = this.getExtensionLocation();
            for (const extension of this.extensions) {
                view.setInt32(extensionByteIndex, extension.esize, extension.littleEndian);
                view.setInt32(extensionByteIndex + 4, extension.ecode, extension.littleEndian);
                byteArray.set(new Uint8Array(extension.edata), extensionByteIndex + 8);
                extensionByteIndex += extension.esize;
            }
        }
        else {
            // In a .nii file, these 4 bytes will always be present
            byteArray.set(new Uint8Array(4).fill(0), 540);
        }
        return byteArray.buffer;
    }
}
exports.NIFTI2 = NIFTI2;
//# sourceMappingURL=nifti2.js.map

/***/ },

/***/ 6637
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Utils = void 0;
const nifti_extension_1 = __webpack_require__(21399);
class Utils {
    /*** Static Pseudo-constants ***/
    static crcTable = null;
    static GUNZIP_MAGIC_COOKIE1 = 31;
    static GUNZIP_MAGIC_COOKIE2 = 139;
    /*** Static methods ***/
    static getStringAt(data, start, end) {
        var str = "", ctr, ch;
        for (ctr = start; ctr < end; ctr += 1) {
            ch = data.getUint8(ctr);
            if (ch !== 0) {
                str += String.fromCharCode(ch);
            }
        }
        return str;
    }
    static getByteAt = function (data, start) {
        return data.getUint8(start);
    };
    static getShortAt = function (data, start, littleEndian) {
        return data.getInt16(start, littleEndian);
    };
    static getIntAt(data, start, littleEndian) {
        return data.getInt32(start, littleEndian);
    }
    static getFloatAt(data, start, littleEndian) {
        return data.getFloat32(start, littleEndian);
    }
    static getDoubleAt(data, start, littleEndian) {
        return data.getFloat64(start, littleEndian);
    }
    static getInt64At(dataView, index, littleEndian) {
        const low = dataView.getUint32(index, littleEndian);
        const high = dataView.getInt32(index + 4, littleEndian);
        let result;
        if (littleEndian) {
            result = high * 2 ** 32 + low;
        }
        else {
            result = low * 2 ** 32 + high;
        }
        // Proper sign extension if the high part is negative
        if (high < 0) {
            result += -1 * 2 ** 32 * 2 ** 32;
        }
        return result;
    }
    static getExtensionsAt(data, start, littleEndian, voxOffset) {
        let extensions = [];
        let extensionByteIndex = start;
        // Multiple extended header sections are allowed
        while (extensionByteIndex < voxOffset) {
            // assume same endianess as header until proven otherwise
            let extensionLittleEndian = littleEndian;
            let esize = Utils.getIntAt(data, extensionByteIndex, littleEndian);
            if (!esize) {
                break; // no more extensions
            }
            // check if this takes us past vox_offset
            if (esize + extensionByteIndex > voxOffset) {
                // check if reversing byte order gets a proper size
                extensionLittleEndian = !extensionLittleEndian;
                esize = Utils.getIntAt(data, extensionByteIndex, extensionLittleEndian);
                if (esize + extensionByteIndex > voxOffset) {
                    throw new Error("This does not appear to be a valid NIFTI extension");
                }
            }
            // esize must be a positive integral multiple of 16
            if (esize % 16 != 0) {
                throw new Error("This does not appear to be a NIFTI extension");
            }
            let ecode = Utils.getIntAt(data, extensionByteIndex + 4, extensionLittleEndian);
            let edata = data.buffer.slice(extensionByteIndex + 8, extensionByteIndex + esize);
            console.log("extensionByteIndex: " + (extensionByteIndex + 8) + " esize: " + esize);
            console.log(edata);
            let extension = new nifti_extension_1.NIFTIEXTENSION(esize, ecode, edata, extensionLittleEndian);
            extensions.push(extension);
            extensionByteIndex += esize;
        }
        return extensions;
    }
    static toArrayBuffer(buffer) {
        var ab, view, i;
        ab = new ArrayBuffer(buffer.length);
        view = new Uint8Array(ab);
        for (i = 0; i < buffer.length; i += 1) {
            view[i] = buffer[i];
        }
        return ab;
    }
    static isString(obj) {
        return typeof obj === "string" || obj instanceof String;
    }
    static formatNumber(num, shortFormat = undefined) {
        let val;
        if (Utils.isString(num)) {
            val = Number(num);
        }
        else {
            val = num;
        }
        if (shortFormat) {
            val = val.toPrecision(5);
        }
        else {
            val = val.toPrecision(7);
        }
        return parseFloat(val);
    }
    // http://stackoverflow.com/questions/18638900/javascript-crc32
    static makeCRCTable() {
        let c;
        let crcTable = [];
        for (var n = 0; n < 256; n++) {
            c = n;
            for (var k = 0; k < 8; k++) {
                c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
            }
            crcTable[n] = c;
        }
        return crcTable;
    }
    static crc32(dataView) {
        if (!Utils.crcTable) {
            Utils.crcTable = Utils.makeCRCTable();
        }
        const crcTable = Utils.crcTable;
        let crc = 0 ^ -1;
        for (var i = 0; i < dataView.byteLength; i++) {
            crc = (crc >>> 8) ^ crcTable[(crc ^ dataView.getUint8(i)) & 0xff];
        }
        return (crc ^ -1) >>> 0;
    }
}
exports.Utils = Utils;
//# sourceMappingURL=utilities.js.map

/***/ },

/***/ 35167
(__unused_webpack_module, exports, __webpack_require__) {


// DEFLATE is a complex format; to read this code, you should probably check the RFC first:
// https://tools.ietf.org/html/rfc1951
// You may also wish to take a look at the guide I made about this program:
// https://gist.github.com/101arrowz/253f31eb5abc3d9275ab943003ffecad
// Some of the following code is similar to that of UZIP.js:
// https://github.com/photopea/UZIP.js
// However, the vast majority of the codebase has diverged from UZIP.js to increase performance and reduce bundle size.
// Sometimes 0 will appear where -1 would be more appropriate. This is because using a uint
// is better for memory in most engines (I *think*).
var node_worker_1 = __webpack_require__(70279);
// aliases for shorter compressed code (most minifers don't do this)
var u8 = Uint8Array, u16 = Uint16Array, u32 = Uint32Array;
// fixed length extra bits
var fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, /* unused */ 0, 0, /* impossible */ 0]);
// fixed distance extra bits
// see fleb note
var fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, /* unused */ 0, 0]);
// code length index map
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
// get base, reverse index map from extra bits
var freb = function (eb, start) {
    var b = new u16(31);
    for (var i = 0; i < 31; ++i) {
        b[i] = start += 1 << eb[i - 1];
    }
    // numbers here are at max 18 bits
    var r = new u32(b[30]);
    for (var i = 1; i < 30; ++i) {
        for (var j = b[i]; j < b[i + 1]; ++j) {
            r[j] = ((j - b[i]) << 5) | i;
        }
    }
    return [b, r];
};
var _a = freb(fleb, 2), fl = _a[0], revfl = _a[1];
// we can ignore the fact that the other numbers are wrong; they never happen anyway
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0), fd = _b[0], revfd = _b[1];
// map of value to reverse (assuming 16 bits)
var rev = new u16(32768);
for (var i = 0; i < 32768; ++i) {
    // reverse table algorithm from SO
    var x = ((i & 0xAAAA) >>> 1) | ((i & 0x5555) << 1);
    x = ((x & 0xCCCC) >>> 2) | ((x & 0x3333) << 2);
    x = ((x & 0xF0F0) >>> 4) | ((x & 0x0F0F) << 4);
    rev[i] = (((x & 0xFF00) >>> 8) | ((x & 0x00FF) << 8)) >>> 1;
}
// create huffman tree from u8 "map": index -> code length for code index
// mb (max bits) must be at most 15
// TODO: optimize/split up?
var hMap = (function (cd, mb, r) {
    var s = cd.length;
    // index
    var i = 0;
    // u16 "map": index -> # of codes with bit length = index
    var l = new u16(mb);
    // length of cd must be 288 (total # of codes)
    for (; i < s; ++i) {
        if (cd[i])
            ++l[cd[i] - 1];
    }
    // u16 "map": index -> minimum code for bit length = index
    var le = new u16(mb);
    for (i = 0; i < mb; ++i) {
        le[i] = (le[i - 1] + l[i - 1]) << 1;
    }
    var co;
    if (r) {
        // u16 "map": index -> number of actual bits, symbol for code
        co = new u16(1 << mb);
        // bits to remove for reverser
        var rvb = 15 - mb;
        for (i = 0; i < s; ++i) {
            // ignore 0 lengths
            if (cd[i]) {
                // num encoding both symbol and bits read
                var sv = (i << 4) | cd[i];
                // free bits
                var r_1 = mb - cd[i];
                // start value
                var v = le[cd[i] - 1]++ << r_1;
                // m is end value
                for (var m = v | ((1 << r_1) - 1); v <= m; ++v) {
                    // every 16 bit value starting with the code yields the same result
                    co[rev[v] >>> rvb] = sv;
                }
            }
        }
    }
    else {
        co = new u16(s);
        for (i = 0; i < s; ++i) {
            if (cd[i]) {
                co[i] = rev[le[cd[i] - 1]++] >>> (15 - cd[i]);
            }
        }
    }
    return co;
});
// fixed length tree
var flt = new u8(288);
for (var i = 0; i < 144; ++i)
    flt[i] = 8;
for (var i = 144; i < 256; ++i)
    flt[i] = 9;
for (var i = 256; i < 280; ++i)
    flt[i] = 7;
for (var i = 280; i < 288; ++i)
    flt[i] = 8;
// fixed distance tree
var fdt = new u8(32);
for (var i = 0; i < 32; ++i)
    fdt[i] = 5;
// fixed length map
var flm = /*#__PURE__*/ hMap(flt, 9, 0), flrm = /*#__PURE__*/ hMap(flt, 9, 1);
// fixed distance map
var fdm = /*#__PURE__*/ hMap(fdt, 5, 0), fdrm = /*#__PURE__*/ hMap(fdt, 5, 1);
// find max of array
var max = function (a) {
    var m = a[0];
    for (var i = 1; i < a.length; ++i) {
        if (a[i] > m)
            m = a[i];
    }
    return m;
};
// read d, starting at bit p and mask with m
var bits = function (d, p, m) {
    var o = (p / 8) | 0;
    return ((d[o] | (d[o + 1] << 8)) >> (p & 7)) & m;
};
// read d, starting at bit p continuing for at least 16 bits
var bits16 = function (d, p) {
    var o = (p / 8) | 0;
    return ((d[o] | (d[o + 1] << 8) | (d[o + 2] << 16)) >> (p & 7));
};
// get end of byte
var shft = function (p) { return ((p + 7) / 8) | 0; };
// typed array slice - allows garbage collector to free original reference,
// while being more compatible than .slice
var slc = function (v, s, e) {
    if (s == null || s < 0)
        s = 0;
    if (e == null || e > v.length)
        e = v.length;
    // can't use .constructor in case user-supplied
    var n = new (v.BYTES_PER_ELEMENT == 2 ? u16 : v.BYTES_PER_ELEMENT == 4 ? u32 : u8)(e - s);
    n.set(v.subarray(s, e));
    return n;
};
/**
 * Codes for errors generated within this library
 */
exports.FlateErrorCode = {
    UnexpectedEOF: 0,
    InvalidBlockType: 1,
    InvalidLengthLiteral: 2,
    InvalidDistance: 3,
    StreamFinished: 4,
    NoStreamHandler: 5,
    InvalidHeader: 6,
    NoCallback: 7,
    InvalidUTF8: 8,
    ExtraFieldTooLong: 9,
    InvalidDate: 10,
    FilenameTooLong: 11,
    StreamFinishing: 12,
    InvalidZipData: 13,
    UnknownCompressionMethod: 14
};
// error codes
var ec = [
    'unexpected EOF',
    'invalid block type',
    'invalid length/literal',
    'invalid distance',
    'stream finished',
    'no stream handler',
    ,
    'no callback',
    'invalid UTF-8 data',
    'extra field too long',
    'date not in range 1980-2099',
    'filename too long',
    'stream finishing',
    'invalid zip data'
    // determined by unknown compression method
];
;
var err = function (ind, msg, nt) {
    var e = new Error(msg || ec[ind]);
    e.code = ind;
    if (Error.captureStackTrace)
        Error.captureStackTrace(e, err);
    if (!nt)
        throw e;
    return e;
};
// expands raw DEFLATE data
var inflt = function (dat, buf, st) {
    // source length
    var sl = dat.length;
    if (!sl || (st && st.f && !st.l))
        return buf || new u8(0);
    // have to estimate size
    var noBuf = !buf || st;
    // no state
    var noSt = !st || st.i;
    if (!st)
        st = {};
    // Assumes roughly 33% compression ratio average
    if (!buf)
        buf = new u8(sl * 3);
    // ensure buffer can fit at least l elements
    var cbuf = function (l) {
        var bl = buf.length;
        // need to increase size to fit
        if (l > bl) {
            // Double or set to necessary, whichever is greater
            var nbuf = new u8(Math.max(bl * 2, l));
            nbuf.set(buf);
            buf = nbuf;
        }
    };
    //  last chunk         bitpos           bytes
    var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
    // total bits
    var tbts = sl * 8;
    do {
        if (!lm) {
            // BFINAL - this is only 1 when last chunk is next
            final = bits(dat, pos, 1);
            // type: 0 = no compression, 1 = fixed huffman, 2 = dynamic huffman
            var type = bits(dat, pos + 1, 3);
            pos += 3;
            if (!type) {
                // go to end of byte boundary
                var s = shft(pos) + 4, l = dat[s - 4] | (dat[s - 3] << 8), t = s + l;
                if (t > sl) {
                    if (noSt)
                        err(0);
                    break;
                }
                // ensure size
                if (noBuf)
                    cbuf(bt + l);
                // Copy over uncompressed data
                buf.set(dat.subarray(s, t), bt);
                // Get new bitpos, update byte count
                st.b = bt += l, st.p = pos = t * 8, st.f = final;
                continue;
            }
            else if (type == 1)
                lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
            else if (type == 2) {
                //  literal                            lengths
                var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
                var tl = hLit + bits(dat, pos + 5, 31) + 1;
                pos += 14;
                // length+distance tree
                var ldt = new u8(tl);
                // code length tree
                var clt = new u8(19);
                for (var i = 0; i < hcLen; ++i) {
                    // use index map to get real code
                    clt[clim[i]] = bits(dat, pos + i * 3, 7);
                }
                pos += hcLen * 3;
                // code lengths bits
                var clb = max(clt), clbmsk = (1 << clb) - 1;
                // code lengths map
                var clm = hMap(clt, clb, 1);
                for (var i = 0; i < tl;) {
                    var r = clm[bits(dat, pos, clbmsk)];
                    // bits read
                    pos += r & 15;
                    // symbol
                    var s = r >>> 4;
                    // code length to copy
                    if (s < 16) {
                        ldt[i++] = s;
                    }
                    else {
                        //  copy   count
                        var c = 0, n = 0;
                        if (s == 16)
                            n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
                        else if (s == 17)
                            n = 3 + bits(dat, pos, 7), pos += 3;
                        else if (s == 18)
                            n = 11 + bits(dat, pos, 127), pos += 7;
                        while (n--)
                            ldt[i++] = c;
                    }
                }
                //    length tree                 distance tree
                var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
                // max length bits
                lbt = max(lt);
                // max dist bits
                dbt = max(dt);
                lm = hMap(lt, lbt, 1);
                dm = hMap(dt, dbt, 1);
            }
            else
                err(1);
            if (pos > tbts) {
                if (noSt)
                    err(0);
                break;
            }
        }
        // Make sure the buffer can hold this + the largest possible addition
        // Maximum chunk size (practically, theoretically infinite) is 2^17;
        if (noBuf)
            cbuf(bt + 131072);
        var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
        var lpos = pos;
        for (;; lpos = pos) {
            // bits read, code
            var c = lm[bits16(dat, pos) & lms], sym = c >>> 4;
            pos += c & 15;
            if (pos > tbts) {
                if (noSt)
                    err(0);
                break;
            }
            if (!c)
                err(2);
            if (sym < 256)
                buf[bt++] = sym;
            else if (sym == 256) {
                lpos = pos, lm = null;
                break;
            }
            else {
                var add = sym - 254;
                // no extra bits needed if less
                if (sym > 264) {
                    // index
                    var i = sym - 257, b = fleb[i];
                    add = bits(dat, pos, (1 << b) - 1) + fl[i];
                    pos += b;
                }
                // dist
                var d = dm[bits16(dat, pos) & dms], dsym = d >>> 4;
                if (!d)
                    err(3);
                pos += d & 15;
                var dt = fd[dsym];
                if (dsym > 3) {
                    var b = fdeb[dsym];
                    dt += bits16(dat, pos) & ((1 << b) - 1), pos += b;
                }
                if (pos > tbts) {
                    if (noSt)
                        err(0);
                    break;
                }
                if (noBuf)
                    cbuf(bt + 131072);
                var end = bt + add;
                for (; bt < end; bt += 4) {
                    buf[bt] = buf[bt - dt];
                    buf[bt + 1] = buf[bt + 1 - dt];
                    buf[bt + 2] = buf[bt + 2 - dt];
                    buf[bt + 3] = buf[bt + 3 - dt];
                }
                bt = end;
            }
        }
        st.l = lm, st.p = lpos, st.b = bt, st.f = final;
        if (lm)
            final = 1, st.m = lbt, st.d = dm, st.n = dbt;
    } while (!final);
    return bt == buf.length ? buf : slc(buf, 0, bt);
};
// starting at p, write the minimum number of bits that can hold v to d
var wbits = function (d, p, v) {
    v <<= p & 7;
    var o = (p / 8) | 0;
    d[o] |= v;
    d[o + 1] |= v >>> 8;
};
// starting at p, write the minimum number of bits (>8) that can hold v to d
var wbits16 = function (d, p, v) {
    v <<= p & 7;
    var o = (p / 8) | 0;
    d[o] |= v;
    d[o + 1] |= v >>> 8;
    d[o + 2] |= v >>> 16;
};
// creates code lengths from a frequency table
var hTree = function (d, mb) {
    // Need extra info to make a tree
    var t = [];
    for (var i = 0; i < d.length; ++i) {
        if (d[i])
            t.push({ s: i, f: d[i] });
    }
    var s = t.length;
    var t2 = t.slice();
    if (!s)
        return [et, 0];
    if (s == 1) {
        var v = new u8(t[0].s + 1);
        v[t[0].s] = 1;
        return [v, 1];
    }
    t.sort(function (a, b) { return a.f - b.f; });
    // after i2 reaches last ind, will be stopped
    // freq must be greater than largest possible number of symbols
    t.push({ s: -1, f: 25001 });
    var l = t[0], r = t[1], i0 = 0, i1 = 1, i2 = 2;
    t[0] = { s: -1, f: l.f + r.f, l: l, r: r };
    // efficient algorithm from UZIP.js
    // i0 is lookbehind, i2 is lookahead - after processing two low-freq
    // symbols that combined have high freq, will start processing i2 (high-freq,
    // non-composite) symbols instead
    // see https://reddit.com/r/photopea/comments/ikekht/uzipjs_questions/
    while (i1 != s - 1) {
        l = t[t[i0].f < t[i2].f ? i0++ : i2++];
        r = t[i0 != i1 && t[i0].f < t[i2].f ? i0++ : i2++];
        t[i1++] = { s: -1, f: l.f + r.f, l: l, r: r };
    }
    var maxSym = t2[0].s;
    for (var i = 1; i < s; ++i) {
        if (t2[i].s > maxSym)
            maxSym = t2[i].s;
    }
    // code lengths
    var tr = new u16(maxSym + 1);
    // max bits in tree
    var mbt = ln(t[i1 - 1], tr, 0);
    if (mbt > mb) {
        // more algorithms from UZIP.js
        // TODO: find out how this code works (debt)
        //  ind    debt
        var i = 0, dt = 0;
        //    left            cost
        var lft = mbt - mb, cst = 1 << lft;
        t2.sort(function (a, b) { return tr[b.s] - tr[a.s] || a.f - b.f; });
        for (; i < s; ++i) {
            var i2_1 = t2[i].s;
            if (tr[i2_1] > mb) {
                dt += cst - (1 << (mbt - tr[i2_1]));
                tr[i2_1] = mb;
            }
            else
                break;
        }
        dt >>>= lft;
        while (dt > 0) {
            var i2_2 = t2[i].s;
            if (tr[i2_2] < mb)
                dt -= 1 << (mb - tr[i2_2]++ - 1);
            else
                ++i;
        }
        for (; i >= 0 && dt; --i) {
            var i2_3 = t2[i].s;
            if (tr[i2_3] == mb) {
                --tr[i2_3];
                ++dt;
            }
        }
        mbt = mb;
    }
    return [new u8(tr), mbt];
};
// get the max length and assign length codes
var ln = function (n, l, d) {
    return n.s == -1
        ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1))
        : (l[n.s] = d);
};
// length codes generation
var lc = function (c) {
    var s = c.length;
    // Note that the semicolon was intentional
    while (s && !c[--s])
        ;
    var cl = new u16(++s);
    //  ind      num         streak
    var cli = 0, cln = c[0], cls = 1;
    var w = function (v) { cl[cli++] = v; };
    for (var i = 1; i <= s; ++i) {
        if (c[i] == cln && i != s)
            ++cls;
        else {
            if (!cln && cls > 2) {
                for (; cls > 138; cls -= 138)
                    w(32754);
                if (cls > 2) {
                    w(cls > 10 ? ((cls - 11) << 5) | 28690 : ((cls - 3) << 5) | 12305);
                    cls = 0;
                }
            }
            else if (cls > 3) {
                w(cln), --cls;
                for (; cls > 6; cls -= 6)
                    w(8304);
                if (cls > 2)
                    w(((cls - 3) << 5) | 8208), cls = 0;
            }
            while (cls--)
                w(cln);
            cls = 1;
            cln = c[i];
        }
    }
    return [cl.subarray(0, cli), s];
};
// calculate the length of output from tree, code lengths
var clen = function (cf, cl) {
    var l = 0;
    for (var i = 0; i < cl.length; ++i)
        l += cf[i] * cl[i];
    return l;
};
// writes a fixed block
// returns the new bit pos
var wfblk = function (out, pos, dat) {
    // no need to write 00 as type: TypedArray defaults to 0
    var s = dat.length;
    var o = shft(pos + 2);
    out[o] = s & 255;
    out[o + 1] = s >>> 8;
    out[o + 2] = out[o] ^ 255;
    out[o + 3] = out[o + 1] ^ 255;
    for (var i = 0; i < s; ++i)
        out[o + i + 4] = dat[i];
    return (o + 4 + s) * 8;
};
// writes a block
var wblk = function (dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
    wbits(out, p++, final);
    ++lf[256];
    var _a = hTree(lf, 15), dlt = _a[0], mlb = _a[1];
    var _b = hTree(df, 15), ddt = _b[0], mdb = _b[1];
    var _c = lc(dlt), lclt = _c[0], nlc = _c[1];
    var _d = lc(ddt), lcdt = _d[0], ndc = _d[1];
    var lcfreq = new u16(19);
    for (var i = 0; i < lclt.length; ++i)
        lcfreq[lclt[i] & 31]++;
    for (var i = 0; i < lcdt.length; ++i)
        lcfreq[lcdt[i] & 31]++;
    var _e = hTree(lcfreq, 7), lct = _e[0], mlcb = _e[1];
    var nlcc = 19;
    for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
        ;
    var flen = (bl + 5) << 3;
    var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
    var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + (2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18]);
    if (flen <= ftlen && flen <= dtlen)
        return wfblk(out, p, dat.subarray(bs, bs + bl));
    var lm, ll, dm, dl;
    wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
    if (dtlen < ftlen) {
        lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
        var llm = hMap(lct, mlcb, 0);
        wbits(out, p, nlc - 257);
        wbits(out, p + 5, ndc - 1);
        wbits(out, p + 10, nlcc - 4);
        p += 14;
        for (var i = 0; i < nlcc; ++i)
            wbits(out, p + 3 * i, lct[clim[i]]);
        p += 3 * nlcc;
        var lcts = [lclt, lcdt];
        for (var it = 0; it < 2; ++it) {
            var clct = lcts[it];
            for (var i = 0; i < clct.length; ++i) {
                var len = clct[i] & 31;
                wbits(out, p, llm[len]), p += lct[len];
                if (len > 15)
                    wbits(out, p, (clct[i] >>> 5) & 127), p += clct[i] >>> 12;
            }
        }
    }
    else {
        lm = flm, ll = flt, dm = fdm, dl = fdt;
    }
    for (var i = 0; i < li; ++i) {
        if (syms[i] > 255) {
            var len = (syms[i] >>> 18) & 31;
            wbits16(out, p, lm[len + 257]), p += ll[len + 257];
            if (len > 7)
                wbits(out, p, (syms[i] >>> 23) & 31), p += fleb[len];
            var dst = syms[i] & 31;
            wbits16(out, p, dm[dst]), p += dl[dst];
            if (dst > 3)
                wbits16(out, p, (syms[i] >>> 5) & 8191), p += fdeb[dst];
        }
        else {
            wbits16(out, p, lm[syms[i]]), p += ll[syms[i]];
        }
    }
    wbits16(out, p, lm[256]);
    return p + ll[256];
};
// deflate options (nice << 13) | chain
var deo = /*#__PURE__*/ new u32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
// empty
var et = /*#__PURE__*/ new u8(0);
// compresses data into a raw DEFLATE buffer
var dflt = function (dat, lvl, plvl, pre, post, lst) {
    var s = dat.length;
    var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7000)) + post);
    // writing to this writes to the output buffer
    var w = o.subarray(pre, o.length - post);
    var pos = 0;
    if (!lvl || s < 8) {
        for (var i = 0; i <= s; i += 65535) {
            // end
            var e = i + 65535;
            if (e >= s) {
                // write final block
                w[pos >> 3] = lst;
            }
            pos = wfblk(w, pos + 1, dat.subarray(i, e));
        }
    }
    else {
        var opt = deo[lvl - 1];
        var n = opt >>> 13, c = opt & 8191;
        var msk_1 = (1 << plvl) - 1;
        //    prev 2-byte val map    curr 2-byte val map
        var prev = new u16(32768), head = new u16(msk_1 + 1);
        var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
        var hsh = function (i) { return (dat[i] ^ (dat[i + 1] << bs1_1) ^ (dat[i + 2] << bs2_1)) & msk_1; };
        // 24576 is an arbitrary number of maximum symbols per block
        // 424 buffer for last block
        var syms = new u32(25000);
        // length/literal freq   distance freq
        var lf = new u16(288), df = new u16(32);
        //  l/lcnt  exbits  index  l/lind  waitdx  bitpos
        var lc_1 = 0, eb = 0, i = 0, li = 0, wi = 0, bs = 0;
        for (; i < s; ++i) {
            // hash value
            // deopt when i > s - 3 - at end, deopt acceptable
            var hv = hsh(i);
            // index mod 32768    previous index mod
            var imod = i & 32767, pimod = head[hv];
            prev[imod] = pimod;
            head[hv] = imod;
            // We always should modify head and prev, but only add symbols if
            // this data is not yet processed ("wait" for wait index)
            if (wi <= i) {
                // bytes remaining
                var rem = s - i;
                if ((lc_1 > 7000 || li > 24576) && rem > 423) {
                    pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i - bs, pos);
                    li = lc_1 = eb = 0, bs = i;
                    for (var j = 0; j < 286; ++j)
                        lf[j] = 0;
                    for (var j = 0; j < 30; ++j)
                        df[j] = 0;
                }
                //  len    dist   chain
                var l = 2, d = 0, ch_1 = c, dif = (imod - pimod) & 32767;
                if (rem > 2 && hv == hsh(i - dif)) {
                    var maxn = Math.min(n, rem) - 1;
                    var maxd = Math.min(32767, i);
                    // max possible length
                    // not capped at dif because decompressors implement "rolling" index population
                    var ml = Math.min(258, rem);
                    while (dif <= maxd && --ch_1 && imod != pimod) {
                        if (dat[i + l] == dat[i + l - dif]) {
                            var nl = 0;
                            for (; nl < ml && dat[i + nl] == dat[i + nl - dif]; ++nl)
                                ;
                            if (nl > l) {
                                l = nl, d = dif;
                                // break out early when we reach "nice" (we are satisfied enough)
                                if (nl > maxn)
                                    break;
                                // now, find the rarest 2-byte sequence within this
                                // length of literals and search for that instead.
                                // Much faster than just using the start
                                var mmd = Math.min(dif, nl - 2);
                                var md = 0;
                                for (var j = 0; j < mmd; ++j) {
                                    var ti = (i - dif + j + 32768) & 32767;
                                    var pti = prev[ti];
                                    var cd = (ti - pti + 32768) & 32767;
                                    if (cd > md)
                                        md = cd, pimod = ti;
                                }
                            }
                        }
                        // check the previous match
                        imod = pimod, pimod = prev[imod];
                        dif += (imod - pimod + 32768) & 32767;
                    }
                }
                // d will be nonzero only when a match was found
                if (d) {
                    // store both dist and len data in one Uint32
                    // Make sure this is recognized as a len/dist with 28th bit (2^28)
                    syms[li++] = 268435456 | (revfl[l] << 18) | revfd[d];
                    var lin = revfl[l] & 31, din = revfd[d] & 31;
                    eb += fleb[lin] + fdeb[din];
                    ++lf[257 + lin];
                    ++df[din];
                    wi = i + l;
                    ++lc_1;
                }
                else {
                    syms[li++] = dat[i];
                    ++lf[dat[i]];
                }
            }
        }
        pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i - bs, pos);
        // this is the easiest way to avoid needing to maintain state
        if (!lst && pos & 7)
            pos = wfblk(w, pos + 1, et);
    }
    return slc(o, 0, pre + shft(pos) + post);
};
// CRC32 table
var crct = /*#__PURE__*/ (function () {
    var t = new Int32Array(256);
    for (var i = 0; i < 256; ++i) {
        var c = i, k = 9;
        while (--k)
            c = ((c & 1) && -306674912) ^ (c >>> 1);
        t[i] = c;
    }
    return t;
})();
// CRC32
var crc = function () {
    var c = -1;
    return {
        p: function (d) {
            // closures have awful performance
            var cr = c;
            for (var i = 0; i < d.length; ++i)
                cr = crct[(cr & 255) ^ d[i]] ^ (cr >>> 8);
            c = cr;
        },
        d: function () { return ~c; }
    };
};
// Alder32
var adler = function () {
    var a = 1, b = 0;
    return {
        p: function (d) {
            // closures have awful performance
            var n = a, m = b;
            var l = d.length | 0;
            for (var i = 0; i != l;) {
                var e = Math.min(i + 2655, l);
                for (; i < e; ++i)
                    m += n += d[i];
                n = (n & 65535) + 15 * (n >> 16), m = (m & 65535) + 15 * (m >> 16);
            }
            a = n, b = m;
        },
        d: function () {
            a %= 65521, b %= 65521;
            return (a & 255) << 24 | (a >>> 8) << 16 | (b & 255) << 8 | (b >>> 8);
        }
    };
};
;
// deflate with opts
var dopt = function (dat, opt, pre, post, st) {
    return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : (12 + opt.mem), pre, post, !st);
};
// Walmart object spread
var mrg = function (a, b) {
    var o = {};
    for (var k in a)
        o[k] = a[k];
    for (var k in b)
        o[k] = b[k];
    return o;
};
// worker clone
// This is possibly the craziest part of the entire codebase, despite how simple it may seem.
// The only parameter to this function is a closure that returns an array of variables outside of the function scope.
// We're going to try to figure out the variable names used in the closure as strings because that is crucial for workerization.
// We will return an object mapping of true variable name to value (basically, the current scope as a JS object).
// The reason we can't just use the original variable names is minifiers mangling the toplevel scope.
// This took me three weeks to figure out how to do.
var wcln = function (fn, fnStr, td) {
    var dt = fn();
    var st = fn.toString();
    var ks = st.slice(st.indexOf('[') + 1, st.lastIndexOf(']')).replace(/\s+/g, '').split(',');
    for (var i = 0; i < dt.length; ++i) {
        var v = dt[i], k = ks[i];
        if (typeof v == 'function') {
            fnStr += ';' + k + '=';
            var st_1 = v.toString();
            if (v.prototype) {
                // for global objects
                if (st_1.indexOf('[native code]') != -1) {
                    var spInd = st_1.indexOf(' ', 8) + 1;
                    fnStr += st_1.slice(spInd, st_1.indexOf('(', spInd));
                }
                else {
                    fnStr += st_1;
                    for (var t in v.prototype)
                        fnStr += ';' + k + '.prototype.' + t + '=' + v.prototype[t].toString();
                }
            }
            else
                fnStr += st_1;
        }
        else
            td[k] = v;
    }
    return [fnStr, td];
};
var ch = [];
// clone bufs
var cbfs = function (v) {
    var tl = [];
    for (var k in v) {
        if (v[k].buffer) {
            tl.push((v[k] = new v[k].constructor(v[k])).buffer);
        }
    }
    return tl;
};
// use a worker to execute code
var wrkr = function (fns, init, id, cb) {
    var _a;
    if (!ch[id]) {
        var fnStr = '', td_1 = {}, m = fns.length - 1;
        for (var i = 0; i < m; ++i)
            _a = wcln(fns[i], fnStr, td_1), fnStr = _a[0], td_1 = _a[1];
        ch[id] = wcln(fns[m], fnStr, td_1);
    }
    var td = mrg({}, ch[id][1]);
    return node_worker_1["default"](ch[id][0] + ';onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=' + init.toString() + '}', id, td, cbfs(td), cb);
};
// base async inflate fn
var bInflt = function () { return [u8, u16, u32, fleb, fdeb, clim, fl, fd, flrm, fdrm, rev, ec, hMap, max, bits, bits16, shft, slc, err, inflt, inflateSync, pbf, gu8]; };
var bDflt = function () { return [u8, u16, u32, fleb, fdeb, clim, revfl, revfd, flm, flt, fdm, fdt, rev, deo, et, hMap, wbits, wbits16, hTree, ln, lc, clen, wfblk, wblk, shft, slc, dflt, dopt, deflateSync, pbf]; };
// gzip extra
var gze = function () { return [gzh, gzhl, wbytes, crc, crct]; };
// gunzip extra
var guze = function () { return [gzs, gzl]; };
// zlib extra
var zle = function () { return [zlh, wbytes, adler]; };
// unzlib extra
var zule = function () { return [zlv]; };
// post buf
var pbf = function (msg) { return postMessage(msg, [msg.buffer]); };
// get u8
var gu8 = function (o) { return o && o.size && new u8(o.size); };
// async helper
var cbify = function (dat, opts, fns, init, id, cb) {
    var w = wrkr(fns, init, id, function (err, dat) {
        w.terminate();
        cb(err, dat);
    });
    w.postMessage([dat, opts], opts.consume ? [dat.buffer] : []);
    return function () { w.terminate(); };
};
// auto stream
var astrm = function (strm) {
    strm.ondata = function (dat, final) { return postMessage([dat, final], [dat.buffer]); };
    return function (ev) { return strm.push(ev.data[0], ev.data[1]); };
};
// async stream attach
var astrmify = function (fns, strm, opts, init, id) {
    var t;
    var w = wrkr(fns, init, id, function (err, dat) {
        if (err)
            w.terminate(), strm.ondata.call(strm, err);
        else {
            if (dat[1])
                w.terminate();
            strm.ondata.call(strm, err, dat[0], dat[1]);
        }
    });
    w.postMessage(opts);
    strm.push = function (d, f) {
        if (!strm.ondata)
            err(5);
        if (t)
            strm.ondata(err(4, 0, 1), null, !!f);
        w.postMessage([d, t = f], [d.buffer]);
    };
    strm.terminate = function () { w.terminate(); };
};
// read 2 bytes
var b2 = function (d, b) { return d[b] | (d[b + 1] << 8); };
// read 4 bytes
var b4 = function (d, b) { return (d[b] | (d[b + 1] << 8) | (d[b + 2] << 16) | (d[b + 3] << 24)) >>> 0; };
var b8 = function (d, b) { return b4(d, b) + (b4(d, b + 4) * 4294967296); };
// write bytes
var wbytes = function (d, b, v) {
    for (; v; ++b)
        d[b] = v, v >>>= 8;
};
// gzip header
var gzh = function (c, o) {
    var fn = o.filename;
    c[0] = 31, c[1] = 139, c[2] = 8, c[8] = o.level < 2 ? 4 : o.level == 9 ? 2 : 0, c[9] = 3; // assume Unix
    if (o.mtime != 0)
        wbytes(c, 4, Math.floor(new Date(o.mtime || Date.now()) / 1000));
    if (fn) {
        c[3] = 8;
        for (var i = 0; i <= fn.length; ++i)
            c[i + 10] = fn.charCodeAt(i);
    }
};
// gzip footer: -8 to -4 = CRC, -4 to -0 is length
// gzip start
var gzs = function (d) {
    if (d[0] != 31 || d[1] != 139 || d[2] != 8)
        err(6, 'invalid gzip data');
    var flg = d[3];
    var st = 10;
    if (flg & 4)
        st += d[10] | (d[11] << 8) + 2;
    for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d[st++])
        ;
    return st + (flg & 2);
};
// gzip length
var gzl = function (d) {
    var l = d.length;
    return ((d[l - 4] | d[l - 3] << 8 | d[l - 2] << 16) | (d[l - 1] << 24)) >>> 0;
};
// gzip header length
var gzhl = function (o) { return 10 + ((o.filename && (o.filename.length + 1)) || 0); };
// zlib header
var zlh = function (c, o) {
    var lv = o.level, fl = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2;
    c[0] = 120, c[1] = (fl << 6) | (fl ? (32 - 2 * fl) : 1);
};
// zlib valid
var zlv = function (d) {
    if ((d[0] & 15) != 8 || (d[0] >>> 4) > 7 || ((d[0] << 8 | d[1]) % 31))
        err(6, 'invalid zlib data');
    if (d[1] & 32)
        err(6, 'invalid zlib data: preset dictionaries not supported');
};
function AsyncCmpStrm(opts, cb) {
    if (!cb && typeof opts == 'function')
        cb = opts, opts = {};
    this.ondata = cb;
    return opts;
}
// zlib footer: -4 to -0 is Adler32
/**
 * Streaming DEFLATE compression
 */
var Deflate = /*#__PURE__*/ (function () {
    function Deflate(opts, cb) {
        if (!cb && typeof opts == 'function')
            cb = opts, opts = {};
        this.ondata = cb;
        this.o = opts || {};
    }
    Deflate.prototype.p = function (c, f) {
        this.ondata(dopt(c, this.o, 0, 0, !f), f);
    };
    /**
     * Pushes a chunk to be deflated
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Deflate.prototype.push = function (chunk, final) {
        if (!this.ondata)
            err(5);
        if (this.d)
            err(4);
        this.d = final;
        this.p(chunk, final || false);
    };
    return Deflate;
}());
exports.Deflate = Deflate;
/**
 * Asynchronous streaming DEFLATE compression
 */
var AsyncDeflate = /*#__PURE__*/ (function () {
    function AsyncDeflate(opts, cb) {
        astrmify([
            bDflt,
            function () { return [astrm, Deflate]; }
        ], this, AsyncCmpStrm.call(this, opts, cb), function (ev) {
            var strm = new Deflate(ev.data);
            onmessage = astrm(strm);
        }, 6);
    }
    return AsyncDeflate;
}());
exports.AsyncDeflate = AsyncDeflate;
function deflate(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bDflt,
    ], function (ev) { return pbf(deflateSync(ev.data[0], ev.data[1])); }, 0, cb);
}
exports.deflate = deflate;
/**
 * Compresses data with DEFLATE without any wrapper
 * @param data The data to compress
 * @param opts The compression options
 * @returns The deflated version of the data
 */
function deflateSync(data, opts) {
    return dopt(data, opts || {}, 0, 0);
}
exports.deflateSync = deflateSync;
/**
 * Streaming DEFLATE decompression
 */
var Inflate = /*#__PURE__*/ (function () {
    /**
     * Creates an inflation stream
     * @param cb The callback to call whenever data is inflated
     */
    function Inflate(cb) {
        this.s = {};
        this.p = new u8(0);
        this.ondata = cb;
    }
    Inflate.prototype.e = function (c) {
        if (!this.ondata)
            err(5);
        if (this.d)
            err(4);
        var l = this.p.length;
        var n = new u8(l + c.length);
        n.set(this.p), n.set(c, l), this.p = n;
    };
    Inflate.prototype.c = function (final) {
        this.d = this.s.i = final || false;
        var bts = this.s.b;
        var dt = inflt(this.p, this.o, this.s);
        this.ondata(slc(dt, bts, this.s.b), this.d);
        this.o = slc(dt, this.s.b - 32768), this.s.b = this.o.length;
        this.p = slc(this.p, (this.s.p / 8) | 0), this.s.p &= 7;
    };
    /**
     * Pushes a chunk to be inflated
     * @param chunk The chunk to push
     * @param final Whether this is the final chunk
     */
    Inflate.prototype.push = function (chunk, final) {
        this.e(chunk), this.c(final);
    };
    return Inflate;
}());
exports.Inflate = Inflate;
/**
 * Asynchronous streaming DEFLATE decompression
 */
var AsyncInflate = /*#__PURE__*/ (function () {
    /**
     * Creates an asynchronous inflation stream
     * @param cb The callback to call whenever data is deflated
     */
    function AsyncInflate(cb) {
        this.ondata = cb;
        astrmify([
            bInflt,
            function () { return [astrm, Inflate]; }
        ], this, 0, function () {
            var strm = new Inflate();
            onmessage = astrm(strm);
        }, 7);
    }
    return AsyncInflate;
}());
exports.AsyncInflate = AsyncInflate;
function inflate(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bInflt
    ], function (ev) { return pbf(inflateSync(ev.data[0], gu8(ev.data[1]))); }, 1, cb);
}
exports.inflate = inflate;
/**
 * Expands DEFLATE data with no wrapper
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
function inflateSync(data, out) {
    return inflt(data, out);
}
exports.inflateSync = inflateSync;
// before you yell at me for not just using extends, my reason is that TS inheritance is hard to workerize.
/**
 * Streaming GZIP compression
 */
var Gzip = /*#__PURE__*/ (function () {
    function Gzip(opts, cb) {
        this.c = crc();
        this.l = 0;
        this.v = 1;
        Deflate.call(this, opts, cb);
    }
    /**
     * Pushes a chunk to be GZIPped
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Gzip.prototype.push = function (chunk, final) {
        Deflate.prototype.push.call(this, chunk, final);
    };
    Gzip.prototype.p = function (c, f) {
        this.c.p(c);
        this.l += c.length;
        var raw = dopt(c, this.o, this.v && gzhl(this.o), f && 8, !f);
        if (this.v)
            gzh(raw, this.o), this.v = 0;
        if (f)
            wbytes(raw, raw.length - 8, this.c.d()), wbytes(raw, raw.length - 4, this.l);
        this.ondata(raw, f);
    };
    return Gzip;
}());
exports.Gzip = Gzip;
exports.Compress = Gzip;
/**
 * Asynchronous streaming GZIP compression
 */
var AsyncGzip = /*#__PURE__*/ (function () {
    function AsyncGzip(opts, cb) {
        astrmify([
            bDflt,
            gze,
            function () { return [astrm, Deflate, Gzip]; }
        ], this, AsyncCmpStrm.call(this, opts, cb), function (ev) {
            var strm = new Gzip(ev.data);
            onmessage = astrm(strm);
        }, 8);
    }
    return AsyncGzip;
}());
exports.AsyncGzip = AsyncGzip;
exports.AsyncCompress = AsyncGzip;
function gzip(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bDflt,
        gze,
        function () { return [gzipSync]; }
    ], function (ev) { return pbf(gzipSync(ev.data[0], ev.data[1])); }, 2, cb);
}
exports.gzip = gzip;
exports.compress = gzip;
/**
 * Compresses data with GZIP
 * @param data The data to compress
 * @param opts The compression options
 * @returns The gzipped version of the data
 */
function gzipSync(data, opts) {
    if (!opts)
        opts = {};
    var c = crc(), l = data.length;
    c.p(data);
    var d = dopt(data, opts, gzhl(opts), 8), s = d.length;
    return gzh(d, opts), wbytes(d, s - 8, c.d()), wbytes(d, s - 4, l), d;
}
exports.gzipSync = gzipSync;
exports.compressSync = gzipSync;
/**
 * Streaming GZIP decompression
 */
var Gunzip = /*#__PURE__*/ (function () {
    /**
     * Creates a GUNZIP stream
     * @param cb The callback to call whenever data is inflated
     */
    function Gunzip(cb) {
        this.v = 1;
        Inflate.call(this, cb);
    }
    /**
     * Pushes a chunk to be GUNZIPped
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Gunzip.prototype.push = function (chunk, final) {
        Inflate.prototype.e.call(this, chunk);
        if (this.v) {
            var s = this.p.length > 3 ? gzs(this.p) : 4;
            if (s >= this.p.length && !final)
                return;
            this.p = this.p.subarray(s), this.v = 0;
        }
        if (final) {
            if (this.p.length < 8)
                err(6, 'invalid gzip data');
            this.p = this.p.subarray(0, -8);
        }
        // necessary to prevent TS from using the closure value
        // This allows for workerization to function correctly
        Inflate.prototype.c.call(this, final);
    };
    return Gunzip;
}());
exports.Gunzip = Gunzip;
/**
 * Asynchronous streaming GZIP decompression
 */
var AsyncGunzip = /*#__PURE__*/ (function () {
    /**
     * Creates an asynchronous GUNZIP stream
     * @param cb The callback to call whenever data is deflated
     */
    function AsyncGunzip(cb) {
        this.ondata = cb;
        astrmify([
            bInflt,
            guze,
            function () { return [astrm, Inflate, Gunzip]; }
        ], this, 0, function () {
            var strm = new Gunzip();
            onmessage = astrm(strm);
        }, 9);
    }
    return AsyncGunzip;
}());
exports.AsyncGunzip = AsyncGunzip;
function gunzip(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bInflt,
        guze,
        function () { return [gunzipSync]; }
    ], function (ev) { return pbf(gunzipSync(ev.data[0])); }, 3, cb);
}
exports.gunzip = gunzip;
/**
 * Expands GZIP data
 * @param data The data to decompress
 * @param out Where to write the data. GZIP already encodes the output size, so providing this doesn't save memory.
 * @returns The decompressed version of the data
 */
function gunzipSync(data, out) {
    return inflt(data.subarray(gzs(data), -8), out || new u8(gzl(data)));
}
exports.gunzipSync = gunzipSync;
/**
 * Streaming Zlib compression
 */
var Zlib = /*#__PURE__*/ (function () {
    function Zlib(opts, cb) {
        this.c = adler();
        this.v = 1;
        Deflate.call(this, opts, cb);
    }
    /**
     * Pushes a chunk to be zlibbed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Zlib.prototype.push = function (chunk, final) {
        Deflate.prototype.push.call(this, chunk, final);
    };
    Zlib.prototype.p = function (c, f) {
        this.c.p(c);
        var raw = dopt(c, this.o, this.v && 2, f && 4, !f);
        if (this.v)
            zlh(raw, this.o), this.v = 0;
        if (f)
            wbytes(raw, raw.length - 4, this.c.d());
        this.ondata(raw, f);
    };
    return Zlib;
}());
exports.Zlib = Zlib;
/**
 * Asynchronous streaming Zlib compression
 */
var AsyncZlib = /*#__PURE__*/ (function () {
    function AsyncZlib(opts, cb) {
        astrmify([
            bDflt,
            zle,
            function () { return [astrm, Deflate, Zlib]; }
        ], this, AsyncCmpStrm.call(this, opts, cb), function (ev) {
            var strm = new Zlib(ev.data);
            onmessage = astrm(strm);
        }, 10);
    }
    return AsyncZlib;
}());
exports.AsyncZlib = AsyncZlib;
function zlib(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bDflt,
        zle,
        function () { return [zlibSync]; }
    ], function (ev) { return pbf(zlibSync(ev.data[0], ev.data[1])); }, 4, cb);
}
exports.zlib = zlib;
/**
 * Compress data with Zlib
 * @param data The data to compress
 * @param opts The compression options
 * @returns The zlib-compressed version of the data
 */
function zlibSync(data, opts) {
    if (!opts)
        opts = {};
    var a = adler();
    a.p(data);
    var d = dopt(data, opts, 2, 4);
    return zlh(d, opts), wbytes(d, d.length - 4, a.d()), d;
}
exports.zlibSync = zlibSync;
/**
 * Streaming Zlib decompression
 */
var Unzlib = /*#__PURE__*/ (function () {
    /**
     * Creates a Zlib decompression stream
     * @param cb The callback to call whenever data is inflated
     */
    function Unzlib(cb) {
        this.v = 1;
        Inflate.call(this, cb);
    }
    /**
     * Pushes a chunk to be unzlibbed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Unzlib.prototype.push = function (chunk, final) {
        Inflate.prototype.e.call(this, chunk);
        if (this.v) {
            if (this.p.length < 2 && !final)
                return;
            this.p = this.p.subarray(2), this.v = 0;
        }
        if (final) {
            if (this.p.length < 4)
                err(6, 'invalid zlib data');
            this.p = this.p.subarray(0, -4);
        }
        // necessary to prevent TS from using the closure value
        // This allows for workerization to function correctly
        Inflate.prototype.c.call(this, final);
    };
    return Unzlib;
}());
exports.Unzlib = Unzlib;
/**
 * Asynchronous streaming Zlib decompression
 */
var AsyncUnzlib = /*#__PURE__*/ (function () {
    /**
     * Creates an asynchronous Zlib decompression stream
     * @param cb The callback to call whenever data is deflated
     */
    function AsyncUnzlib(cb) {
        this.ondata = cb;
        astrmify([
            bInflt,
            zule,
            function () { return [astrm, Inflate, Unzlib]; }
        ], this, 0, function () {
            var strm = new Unzlib();
            onmessage = astrm(strm);
        }, 11);
    }
    return AsyncUnzlib;
}());
exports.AsyncUnzlib = AsyncUnzlib;
function unzlib(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bInflt,
        zule,
        function () { return [unzlibSync]; }
    ], function (ev) { return pbf(unzlibSync(ev.data[0], gu8(ev.data[1]))); }, 5, cb);
}
exports.unzlib = unzlib;
/**
 * Expands Zlib data
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
function unzlibSync(data, out) {
    return inflt((zlv(data), data.subarray(2, -4)), out);
}
exports.unzlibSync = unzlibSync;
/**
 * Streaming GZIP, Zlib, or raw DEFLATE decompression
 */
var Decompress = /*#__PURE__*/ (function () {
    /**
     * Creates a decompression stream
     * @param cb The callback to call whenever data is decompressed
     */
    function Decompress(cb) {
        this.G = Gunzip;
        this.I = Inflate;
        this.Z = Unzlib;
        this.ondata = cb;
    }
    /**
     * Pushes a chunk to be decompressed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Decompress.prototype.push = function (chunk, final) {
        if (!this.ondata)
            err(5);
        if (!this.s) {
            if (this.p && this.p.length) {
                var n = new u8(this.p.length + chunk.length);
                n.set(this.p), n.set(chunk, this.p.length);
            }
            else
                this.p = chunk;
            if (this.p.length > 2) {
                var _this_1 = this;
                var cb = function () { _this_1.ondata.apply(_this_1, arguments); };
                this.s = (this.p[0] == 31 && this.p[1] == 139 && this.p[2] == 8)
                    ? new this.G(cb)
                    : ((this.p[0] & 15) != 8 || (this.p[0] >> 4) > 7 || ((this.p[0] << 8 | this.p[1]) % 31))
                        ? new this.I(cb)
                        : new this.Z(cb);
                this.s.push(this.p, final);
                this.p = null;
            }
        }
        else
            this.s.push(chunk, final);
    };
    return Decompress;
}());
exports.Decompress = Decompress;
/**
 * Asynchronous streaming GZIP, Zlib, or raw DEFLATE decompression
 */
var AsyncDecompress = /*#__PURE__*/ (function () {
    /**
   * Creates an asynchronous decompression stream
   * @param cb The callback to call whenever data is decompressed
   */
    function AsyncDecompress(cb) {
        this.G = AsyncGunzip;
        this.I = AsyncInflate;
        this.Z = AsyncUnzlib;
        this.ondata = cb;
    }
    /**
     * Pushes a chunk to be decompressed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    AsyncDecompress.prototype.push = function (chunk, final) {
        Decompress.prototype.push.call(this, chunk, final);
    };
    return AsyncDecompress;
}());
exports.AsyncDecompress = AsyncDecompress;
function decompress(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return (data[0] == 31 && data[1] == 139 && data[2] == 8)
        ? gunzip(data, opts, cb)
        : ((data[0] & 15) != 8 || (data[0] >> 4) > 7 || ((data[0] << 8 | data[1]) % 31))
            ? inflate(data, opts, cb)
            : unzlib(data, opts, cb);
}
exports.decompress = decompress;
/**
 * Expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
function decompressSync(data, out) {
    return (data[0] == 31 && data[1] == 139 && data[2] == 8)
        ? gunzipSync(data, out)
        : ((data[0] & 15) != 8 || (data[0] >> 4) > 7 || ((data[0] << 8 | data[1]) % 31))
            ? inflateSync(data, out)
            : unzlibSync(data, out);
}
exports.decompressSync = decompressSync;
// flatten a directory structure
var fltn = function (d, p, t, o) {
    for (var k in d) {
        var val = d[k], n = p + k, op = o;
        if (Array.isArray(val))
            op = mrg(o, val[1]), val = val[0];
        if (val instanceof u8)
            t[n] = [val, op];
        else {
            t[n += '/'] = [new u8(0), op];
            fltn(val, n, t, o);
        }
    }
};
// text encoder
var te = typeof TextEncoder != 'undefined' && /*#__PURE__*/ new TextEncoder();
// text decoder
var td = typeof TextDecoder != 'undefined' && /*#__PURE__*/ new TextDecoder();
// text decoder stream
var tds = 0;
try {
    td.decode(et, { stream: true });
    tds = 1;
}
catch (e) { }
// decode UTF8
var dutf8 = function (d) {
    for (var r = '', i = 0;;) {
        var c = d[i++];
        var eb = (c > 127) + (c > 223) + (c > 239);
        if (i + eb > d.length)
            return [r, slc(d, i - 1)];
        if (!eb)
            r += String.fromCharCode(c);
        else if (eb == 3) {
            c = ((c & 15) << 18 | (d[i++] & 63) << 12 | (d[i++] & 63) << 6 | (d[i++] & 63)) - 65536,
                r += String.fromCharCode(55296 | (c >> 10), 56320 | (c & 1023));
        }
        else if (eb & 1)
            r += String.fromCharCode((c & 31) << 6 | (d[i++] & 63));
        else
            r += String.fromCharCode((c & 15) << 12 | (d[i++] & 63) << 6 | (d[i++] & 63));
    }
};
/**
 * Streaming UTF-8 decoding
 */
var DecodeUTF8 = /*#__PURE__*/ (function () {
    /**
     * Creates a UTF-8 decoding stream
     * @param cb The callback to call whenever data is decoded
     */
    function DecodeUTF8(cb) {
        this.ondata = cb;
        if (tds)
            this.t = new TextDecoder();
        else
            this.p = et;
    }
    /**
     * Pushes a chunk to be decoded from UTF-8 binary
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    DecodeUTF8.prototype.push = function (chunk, final) {
        if (!this.ondata)
            err(5);
        final = !!final;
        if (this.t) {
            this.ondata(this.t.decode(chunk, { stream: true }), final);
            if (final) {
                if (this.t.decode().length)
                    err(8);
                this.t = null;
            }
            return;
        }
        if (!this.p)
            err(4);
        var dat = new u8(this.p.length + chunk.length);
        dat.set(this.p);
        dat.set(chunk, this.p.length);
        var _a = dutf8(dat), ch = _a[0], np = _a[1];
        if (final) {
            if (np.length)
                err(8);
            this.p = null;
        }
        else
            this.p = np;
        this.ondata(ch, final);
    };
    return DecodeUTF8;
}());
exports.DecodeUTF8 = DecodeUTF8;
/**
 * Streaming UTF-8 encoding
 */
var EncodeUTF8 = /*#__PURE__*/ (function () {
    /**
     * Creates a UTF-8 decoding stream
     * @param cb The callback to call whenever data is encoded
     */
    function EncodeUTF8(cb) {
        this.ondata = cb;
    }
    /**
     * Pushes a chunk to be encoded to UTF-8
     * @param chunk The string data to push
     * @param final Whether this is the last chunk
     */
    EncodeUTF8.prototype.push = function (chunk, final) {
        if (!this.ondata)
            err(5);
        if (this.d)
            err(4);
        this.ondata(strToU8(chunk), this.d = final || false);
    };
    return EncodeUTF8;
}());
exports.EncodeUTF8 = EncodeUTF8;
/**
 * Converts a string into a Uint8Array for use with compression/decompression methods
 * @param str The string to encode
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless decoding a binary string.
 * @returns The string encoded in UTF-8/Latin-1 binary
 */
function strToU8(str, latin1) {
    if (latin1) {
        var ar_1 = new u8(str.length);
        for (var i = 0; i < str.length; ++i)
            ar_1[i] = str.charCodeAt(i);
        return ar_1;
    }
    if (te)
        return te.encode(str);
    var l = str.length;
    var ar = new u8(str.length + (str.length >> 1));
    var ai = 0;
    var w = function (v) { ar[ai++] = v; };
    for (var i = 0; i < l; ++i) {
        if (ai + 5 > ar.length) {
            var n = new u8(ai + 8 + ((l - i) << 1));
            n.set(ar);
            ar = n;
        }
        var c = str.charCodeAt(i);
        if (c < 128 || latin1)
            w(c);
        else if (c < 2048)
            w(192 | (c >> 6)), w(128 | (c & 63));
        else if (c > 55295 && c < 57344)
            c = 65536 + (c & 1023 << 10) | (str.charCodeAt(++i) & 1023),
                w(240 | (c >> 18)), w(128 | ((c >> 12) & 63)), w(128 | ((c >> 6) & 63)), w(128 | (c & 63));
        else
            w(224 | (c >> 12)), w(128 | ((c >> 6) & 63)), w(128 | (c & 63));
    }
    return slc(ar, 0, ai);
}
exports.strToU8 = strToU8;
/**
 * Converts a Uint8Array to a string
 * @param dat The data to decode to string
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless encoding to binary string.
 * @returns The original UTF-8/Latin-1 string
 */
function strFromU8(dat, latin1) {
    if (latin1) {
        var r = '';
        for (var i = 0; i < dat.length; i += 16384)
            r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384));
        return r;
    }
    else if (td)
        return td.decode(dat);
    else {
        var _a = dutf8(dat), out = _a[0], ext = _a[1];
        if (ext.length)
            err(8);
        return out;
    }
}
exports.strFromU8 = strFromU8;
;
// deflate bit flag
var dbf = function (l) { return l == 1 ? 3 : l < 6 ? 2 : l == 9 ? 1 : 0; };
// skip local zip header
var slzh = function (d, b) { return b + 30 + b2(d, b + 26) + b2(d, b + 28); };
// read zip header
var zh = function (d, b, z) {
    var fnl = b2(d, b + 28), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl, bs = b4(d, b + 20);
    var _a = z && bs == 4294967295 ? z64e(d, es) : [bs, b4(d, b + 24), b4(d, b + 42)], sc = _a[0], su = _a[1], off = _a[2];
    return [b2(d, b + 10), sc, su, fn, es + b2(d, b + 30) + b2(d, b + 32), off];
};
// read zip64 extra field
var z64e = function (d, b) {
    for (; b2(d, b) != 1; b += 4 + b2(d, b + 2))
        ;
    return [b8(d, b + 12), b8(d, b + 4), b8(d, b + 20)];
};
// extra field length
var exfl = function (ex) {
    var le = 0;
    if (ex) {
        for (var k in ex) {
            var l = ex[k].length;
            if (l > 65535)
                err(9);
            le += l + 4;
        }
    }
    return le;
};
// write zip header
var wzh = function (d, b, f, fn, u, c, ce, co) {
    var fl = fn.length, ex = f.extra, col = co && co.length;
    var exl = exfl(ex);
    wbytes(d, b, ce != null ? 0x2014B50 : 0x4034B50), b += 4;
    if (ce != null)
        d[b++] = 20, d[b++] = f.os;
    d[b] = 20, b += 2; // spec compliance? what's that?
    d[b++] = (f.flag << 1) | (c == null && 8), d[b++] = u && 8;
    d[b++] = f.compression & 255, d[b++] = f.compression >> 8;
    var dt = new Date(f.mtime == null ? Date.now() : f.mtime), y = dt.getFullYear() - 1980;
    if (y < 0 || y > 119)
        err(10);
    wbytes(d, b, (y << 25) | ((dt.getMonth() + 1) << 21) | (dt.getDate() << 16) | (dt.getHours() << 11) | (dt.getMinutes() << 5) | (dt.getSeconds() >>> 1)), b += 4;
    if (c != null) {
        wbytes(d, b, f.crc);
        wbytes(d, b + 4, c);
        wbytes(d, b + 8, f.size);
    }
    wbytes(d, b + 12, fl);
    wbytes(d, b + 14, exl), b += 16;
    if (ce != null) {
        wbytes(d, b, col);
        wbytes(d, b + 6, f.attrs);
        wbytes(d, b + 10, ce), b += 14;
    }
    d.set(fn, b);
    b += fl;
    if (exl) {
        for (var k in ex) {
            var exf = ex[k], l = exf.length;
            wbytes(d, b, +k);
            wbytes(d, b + 2, l);
            d.set(exf, b + 4), b += 4 + l;
        }
    }
    if (col)
        d.set(co, b), b += col;
    return b;
};
// write zip footer (end of central directory)
var wzf = function (o, b, c, d, e) {
    wbytes(o, b, 0x6054B50); // skip disk
    wbytes(o, b + 8, c);
    wbytes(o, b + 10, c);
    wbytes(o, b + 12, d);
    wbytes(o, b + 16, e);
};
/**
 * A pass-through stream to keep data uncompressed in a ZIP archive.
 */
var ZipPassThrough = /*#__PURE__*/ (function () {
    /**
     * Creates a pass-through stream that can be added to ZIP archives
     * @param filename The filename to associate with this data stream
     */
    function ZipPassThrough(filename) {
        this.filename = filename;
        this.c = crc();
        this.size = 0;
        this.compression = 0;
    }
    /**
     * Processes a chunk and pushes to the output stream. You can override this
     * method in a subclass for custom behavior, but by default this passes
     * the data through. You must call this.ondata(err, chunk, final) at some
     * point in this method.
     * @param chunk The chunk to process
     * @param final Whether this is the last chunk
     */
    ZipPassThrough.prototype.process = function (chunk, final) {
        this.ondata(null, chunk, final);
    };
    /**
     * Pushes a chunk to be added. If you are subclassing this with a custom
     * compression algorithm, note that you must push data from the source
     * file only, pre-compression.
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    ZipPassThrough.prototype.push = function (chunk, final) {
        if (!this.ondata)
            err(5);
        this.c.p(chunk);
        this.size += chunk.length;
        if (final)
            this.crc = this.c.d();
        this.process(chunk, final || false);
    };
    return ZipPassThrough;
}());
exports.ZipPassThrough = ZipPassThrough;
// I don't extend because TypeScript extension adds 1kB of runtime bloat
/**
 * Streaming DEFLATE compression for ZIP archives. Prefer using AsyncZipDeflate
 * for better performance
 */
var ZipDeflate = /*#__PURE__*/ (function () {
    /**
     * Creates a DEFLATE stream that can be added to ZIP archives
     * @param filename The filename to associate with this data stream
     * @param opts The compression options
     */
    function ZipDeflate(filename, opts) {
        var _this_1 = this;
        if (!opts)
            opts = {};
        ZipPassThrough.call(this, filename);
        this.d = new Deflate(opts, function (dat, final) {
            _this_1.ondata(null, dat, final);
        });
        this.compression = 8;
        this.flag = dbf(opts.level);
    }
    ZipDeflate.prototype.process = function (chunk, final) {
        try {
            this.d.push(chunk, final);
        }
        catch (e) {
            this.ondata(e, null, final);
        }
    };
    /**
     * Pushes a chunk to be deflated
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    ZipDeflate.prototype.push = function (chunk, final) {
        ZipPassThrough.prototype.push.call(this, chunk, final);
    };
    return ZipDeflate;
}());
exports.ZipDeflate = ZipDeflate;
/**
 * Asynchronous streaming DEFLATE compression for ZIP archives
 */
var AsyncZipDeflate = /*#__PURE__*/ (function () {
    /**
     * Creates a DEFLATE stream that can be added to ZIP archives
     * @param filename The filename to associate with this data stream
     * @param opts The compression options
     */
    function AsyncZipDeflate(filename, opts) {
        var _this_1 = this;
        if (!opts)
            opts = {};
        ZipPassThrough.call(this, filename);
        this.d = new AsyncDeflate(opts, function (err, dat, final) {
            _this_1.ondata(err, dat, final);
        });
        this.compression = 8;
        this.flag = dbf(opts.level);
        this.terminate = this.d.terminate;
    }
    AsyncZipDeflate.prototype.process = function (chunk, final) {
        this.d.push(chunk, final);
    };
    /**
     * Pushes a chunk to be deflated
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    AsyncZipDeflate.prototype.push = function (chunk, final) {
        ZipPassThrough.prototype.push.call(this, chunk, final);
    };
    return AsyncZipDeflate;
}());
exports.AsyncZipDeflate = AsyncZipDeflate;
// TODO: Better tree shaking
/**
 * A zippable archive to which files can incrementally be added
 */
var Zip = /*#__PURE__*/ (function () {
    /**
     * Creates an empty ZIP archive to which files can be added
     * @param cb The callback to call whenever data for the generated ZIP archive
     *           is available
     */
    function Zip(cb) {
        this.ondata = cb;
        this.u = [];
        this.d = 1;
    }
    /**
     * Adds a file to the ZIP archive
     * @param file The file stream to add
     */
    Zip.prototype.add = function (file) {
        var _this_1 = this;
        if (!this.ondata)
            err(5);
        // finishing or finished
        if (this.d & 2)
            this.ondata(err(4 + (this.d & 1) * 8, 0, 1), null, false);
        else {
            var f = strToU8(file.filename), fl_1 = f.length;
            var com = file.comment, o = com && strToU8(com);
            var u = fl_1 != file.filename.length || (o && (com.length != o.length));
            var hl_1 = fl_1 + exfl(file.extra) + 30;
            if (fl_1 > 65535)
                this.ondata(err(11, 0, 1), null, false);
            var header = new u8(hl_1);
            wzh(header, 0, file, f, u);
            var chks_1 = [header];
            var pAll_1 = function () {
                for (var _i = 0, chks_2 = chks_1; _i < chks_2.length; _i++) {
                    var chk = chks_2[_i];
                    _this_1.ondata(null, chk, false);
                }
                chks_1 = [];
            };
            var tr_1 = this.d;
            this.d = 0;
            var ind_1 = this.u.length;
            var uf_1 = mrg(file, {
                f: f,
                u: u,
                o: o,
                t: function () {
                    if (file.terminate)
                        file.terminate();
                },
                r: function () {
                    pAll_1();
                    if (tr_1) {
                        var nxt = _this_1.u[ind_1 + 1];
                        if (nxt)
                            nxt.r();
                        else
                            _this_1.d = 1;
                    }
                    tr_1 = 1;
                }
            });
            var cl_1 = 0;
            file.ondata = function (err, dat, final) {
                if (err) {
                    _this_1.ondata(err, dat, final);
                    _this_1.terminate();
                }
                else {
                    cl_1 += dat.length;
                    chks_1.push(dat);
                    if (final) {
                        var dd = new u8(16);
                        wbytes(dd, 0, 0x8074B50);
                        wbytes(dd, 4, file.crc);
                        wbytes(dd, 8, cl_1);
                        wbytes(dd, 12, file.size);
                        chks_1.push(dd);
                        uf_1.c = cl_1, uf_1.b = hl_1 + cl_1 + 16, uf_1.crc = file.crc, uf_1.size = file.size;
                        if (tr_1)
                            uf_1.r();
                        tr_1 = 1;
                    }
                    else if (tr_1)
                        pAll_1();
                }
            };
            this.u.push(uf_1);
        }
    };
    /**
     * Ends the process of adding files and prepares to emit the final chunks.
     * This *must* be called after adding all desired files for the resulting
     * ZIP file to work properly.
     */
    Zip.prototype.end = function () {
        var _this_1 = this;
        if (this.d & 2) {
            this.ondata(err(4 + (this.d & 1) * 8, 0, 1), null, true);
            return;
        }
        if (this.d)
            this.e();
        else
            this.u.push({
                r: function () {
                    if (!(_this_1.d & 1))
                        return;
                    _this_1.u.splice(-1, 1);
                    _this_1.e();
                },
                t: function () { }
            });
        this.d = 3;
    };
    Zip.prototype.e = function () {
        var bt = 0, l = 0, tl = 0;
        for (var _i = 0, _a = this.u; _i < _a.length; _i++) {
            var f = _a[_i];
            tl += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0);
        }
        var out = new u8(tl + 22);
        for (var _b = 0, _c = this.u; _b < _c.length; _b++) {
            var f = _c[_b];
            wzh(out, bt, f, f.f, f.u, f.c, l, f.o);
            bt += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0), l += f.b;
        }
        wzf(out, bt, this.u.length, tl, l);
        this.ondata(null, out, true);
        this.d = 2;
    };
    /**
     * A method to terminate any internal workers used by the stream. Subsequent
     * calls to add() will fail.
     */
    Zip.prototype.terminate = function () {
        for (var _i = 0, _a = this.u; _i < _a.length; _i++) {
            var f = _a[_i];
            f.t();
        }
        this.d = 2;
    };
    return Zip;
}());
exports.Zip = Zip;
function zip(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    var r = {};
    fltn(data, '', r, opts);
    var k = Object.keys(r);
    var lft = k.length, o = 0, tot = 0;
    var slft = lft, files = new Array(lft);
    var term = [];
    var tAll = function () {
        for (var i = 0; i < term.length; ++i)
            term[i]();
    };
    var cbd = function (a, b) {
        mt(function () { cb(a, b); });
    };
    mt(function () { cbd = cb; });
    var cbf = function () {
        var out = new u8(tot + 22), oe = o, cdl = tot - o;
        tot = 0;
        for (var i = 0; i < slft; ++i) {
            var f = files[i];
            try {
                var l = f.c.length;
                wzh(out, tot, f, f.f, f.u, l);
                var badd = 30 + f.f.length + exfl(f.extra);
                var loc = tot + badd;
                out.set(f.c, loc);
                wzh(out, o, f, f.f, f.u, l, tot, f.m), o += 16 + badd + (f.m ? f.m.length : 0), tot = loc + l;
            }
            catch (e) {
                return cbd(e, null);
            }
        }
        wzf(out, o, files.length, cdl, oe);
        cbd(null, out);
    };
    if (!lft)
        cbf();
    var _loop_1 = function (i) {
        var fn = k[i];
        var _a = r[fn], file = _a[0], p = _a[1];
        var c = crc(), size = file.length;
        c.p(file);
        var f = strToU8(fn), s = f.length;
        var com = p.comment, m = com && strToU8(com), ms = m && m.length;
        var exl = exfl(p.extra);
        var compression = p.level == 0 ? 0 : 8;
        var cbl = function (e, d) {
            if (e) {
                tAll();
                cbd(e, null);
            }
            else {
                var l = d.length;
                files[i] = mrg(p, {
                    size: size,
                    crc: c.d(),
                    c: d,
                    f: f,
                    m: m,
                    u: s != fn.length || (m && (com.length != ms)),
                    compression: compression
                });
                o += 30 + s + exl + l;
                tot += 76 + 2 * (s + exl) + (ms || 0) + l;
                if (!--lft)
                    cbf();
            }
        };
        if (s > 65535)
            cbl(err(11, 0, 1), null);
        if (!compression)
            cbl(null, file);
        else if (size < 160000) {
            try {
                cbl(null, deflateSync(file, p));
            }
            catch (e) {
                cbl(e, null);
            }
        }
        else
            term.push(deflate(file, p, cbl));
    };
    // Cannot use lft because it can decrease
    for (var i = 0; i < slft; ++i) {
        _loop_1(i);
    }
    return tAll;
}
exports.zip = zip;
/**
 * Synchronously creates a ZIP file. Prefer using `zip` for better performance
 * with more than one file.
 * @param data The directory structure for the ZIP archive
 * @param opts The main options, merged with per-file options
 * @returns The generated ZIP archive
 */
function zipSync(data, opts) {
    if (!opts)
        opts = {};
    var r = {};
    var files = [];
    fltn(data, '', r, opts);
    var o = 0;
    var tot = 0;
    for (var fn in r) {
        var _a = r[fn], file = _a[0], p = _a[1];
        var compression = p.level == 0 ? 0 : 8;
        var f = strToU8(fn), s = f.length;
        var com = p.comment, m = com && strToU8(com), ms = m && m.length;
        var exl = exfl(p.extra);
        if (s > 65535)
            err(11);
        var d = compression ? deflateSync(file, p) : file, l = d.length;
        var c = crc();
        c.p(file);
        files.push(mrg(p, {
            size: file.length,
            crc: c.d(),
            c: d,
            f: f,
            m: m,
            u: s != fn.length || (m && (com.length != ms)),
            o: o,
            compression: compression
        }));
        o += 30 + s + exl + l;
        tot += 76 + 2 * (s + exl) + (ms || 0) + l;
    }
    var out = new u8(tot + 22), oe = o, cdl = tot - o;
    for (var i = 0; i < files.length; ++i) {
        var f = files[i];
        wzh(out, f.o, f, f.f, f.u, f.c.length);
        var badd = 30 + f.f.length + exfl(f.extra);
        out.set(f.c, f.o + badd);
        wzh(out, o, f, f.f, f.u, f.c.length, f.o, f.m), o += 16 + badd + (f.m ? f.m.length : 0);
    }
    wzf(out, o, files.length, cdl, oe);
    return out;
}
exports.zipSync = zipSync;
/**
 * Streaming pass-through decompression for ZIP archives
 */
var UnzipPassThrough = /*#__PURE__*/ (function () {
    function UnzipPassThrough() {
    }
    UnzipPassThrough.prototype.push = function (data, final) {
        this.ondata(null, data, final);
    };
    UnzipPassThrough.compression = 0;
    return UnzipPassThrough;
}());
exports.UnzipPassThrough = UnzipPassThrough;
/**
 * Streaming DEFLATE decompression for ZIP archives. Prefer AsyncZipInflate for
 * better performance.
 */
var UnzipInflate = /*#__PURE__*/ (function () {
    /**
     * Creates a DEFLATE decompression that can be used in ZIP archives
     */
    function UnzipInflate() {
        var _this_1 = this;
        this.i = new Inflate(function (dat, final) {
            _this_1.ondata(null, dat, final);
        });
    }
    UnzipInflate.prototype.push = function (data, final) {
        try {
            this.i.push(data, final);
        }
        catch (e) {
            this.ondata(e, null, final);
        }
    };
    UnzipInflate.compression = 8;
    return UnzipInflate;
}());
exports.UnzipInflate = UnzipInflate;
/**
 * Asynchronous streaming DEFLATE decompression for ZIP archives
 */
var AsyncUnzipInflate = /*#__PURE__*/ (function () {
    /**
     * Creates a DEFLATE decompression that can be used in ZIP archives
     */
    function AsyncUnzipInflate(_, sz) {
        var _this_1 = this;
        if (sz < 320000) {
            this.i = new Inflate(function (dat, final) {
                _this_1.ondata(null, dat, final);
            });
        }
        else {
            this.i = new AsyncInflate(function (err, dat, final) {
                _this_1.ondata(err, dat, final);
            });
            this.terminate = this.i.terminate;
        }
    }
    AsyncUnzipInflate.prototype.push = function (data, final) {
        if (this.i.terminate)
            data = slc(data, 0);
        this.i.push(data, final);
    };
    AsyncUnzipInflate.compression = 8;
    return AsyncUnzipInflate;
}());
exports.AsyncUnzipInflate = AsyncUnzipInflate;
/**
 * A ZIP archive decompression stream that emits files as they are discovered
 */
var Unzip = /*#__PURE__*/ (function () {
    /**
     * Creates a ZIP decompression stream
     * @param cb The callback to call whenever a file in the ZIP archive is found
     */
    function Unzip(cb) {
        this.onfile = cb;
        this.k = [];
        this.o = {
            0: UnzipPassThrough
        };
        this.p = et;
    }
    /**
     * Pushes a chunk to be unzipped
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Unzip.prototype.push = function (chunk, final) {
        var _this_1 = this;
        if (!this.onfile)
            err(5);
        if (!this.p)
            err(4);
        if (this.c > 0) {
            var len = Math.min(this.c, chunk.length);
            var toAdd = chunk.subarray(0, len);
            this.c -= len;
            if (this.d)
                this.d.push(toAdd, !this.c);
            else
                this.k[0].push(toAdd);
            chunk = chunk.subarray(len);
            if (chunk.length)
                return this.push(chunk, final);
        }
        else {
            var f = 0, i = 0, is = void 0, buf = void 0;
            if (!this.p.length)
                buf = chunk;
            else if (!chunk.length)
                buf = this.p;
            else {
                buf = new u8(this.p.length + chunk.length);
                buf.set(this.p), buf.set(chunk, this.p.length);
            }
            var l = buf.length, oc = this.c, add = oc && this.d;
            var _loop_2 = function () {
                var _a;
                var sig = b4(buf, i);
                if (sig == 0x4034B50) {
                    f = 1, is = i;
                    this_1.d = null;
                    this_1.c = 0;
                    var bf = b2(buf, i + 6), cmp_1 = b2(buf, i + 8), u = bf & 2048, dd = bf & 8, fnl = b2(buf, i + 26), es = b2(buf, i + 28);
                    if (l > i + 30 + fnl + es) {
                        var chks_3 = [];
                        this_1.k.unshift(chks_3);
                        f = 2;
                        var sc_1 = b4(buf, i + 18), su_1 = b4(buf, i + 22);
                        var fn_1 = strFromU8(buf.subarray(i + 30, i += 30 + fnl), !u);
                        if (sc_1 == 4294967295) {
                            _a = dd ? [-2] : z64e(buf, i), sc_1 = _a[0], su_1 = _a[1];
                        }
                        else if (dd)
                            sc_1 = -1;
                        i += es;
                        this_1.c = sc_1;
                        var d_1;
                        var file_1 = {
                            name: fn_1,
                            compression: cmp_1,
                            start: function () {
                                if (!file_1.ondata)
                                    err(5);
                                if (!sc_1)
                                    file_1.ondata(null, et, true);
                                else {
                                    var ctr = _this_1.o[cmp_1];
                                    if (!ctr)
                                        file_1.ondata(err(14, 'unknown compression type ' + cmp_1, 1), null, false);
                                    d_1 = sc_1 < 0 ? new ctr(fn_1) : new ctr(fn_1, sc_1, su_1);
                                    d_1.ondata = function (err, dat, final) { file_1.ondata(err, dat, final); };
                                    for (var _i = 0, chks_4 = chks_3; _i < chks_4.length; _i++) {
                                        var dat = chks_4[_i];
                                        d_1.push(dat, false);
                                    }
                                    if (_this_1.k[0] == chks_3 && _this_1.c)
                                        _this_1.d = d_1;
                                    else
                                        d_1.push(et, true);
                                }
                            },
                            terminate: function () {
                                if (d_1 && d_1.terminate)
                                    d_1.terminate();
                            }
                        };
                        if (sc_1 >= 0)
                            file_1.size = sc_1, file_1.originalSize = su_1;
                        this_1.onfile(file_1);
                    }
                    return "break";
                }
                else if (oc) {
                    if (sig == 0x8074B50) {
                        is = i += 12 + (oc == -2 && 8), f = 3, this_1.c = 0;
                        return "break";
                    }
                    else if (sig == 0x2014B50) {
                        is = i -= 4, f = 3, this_1.c = 0;
                        return "break";
                    }
                }
            };
            var this_1 = this;
            for (; i < l - 4; ++i) {
                var state_1 = _loop_2();
                if (state_1 === "break")
                    break;
            }
            this.p = et;
            if (oc < 0) {
                var dat = f ? buf.subarray(0, is - 12 - (oc == -2 && 8) - (b4(buf, is - 16) == 0x8074B50 && 4)) : buf.subarray(0, i);
                if (add)
                    add.push(dat, !!f);
                else
                    this.k[+(f == 2)].push(dat);
            }
            if (f & 2)
                return this.push(buf.subarray(i), final);
            this.p = buf.subarray(i);
        }
        if (final) {
            if (this.c)
                err(13);
            this.p = null;
        }
    };
    /**
     * Registers a decoder with the stream, allowing for files compressed with
     * the compression type provided to be expanded correctly
     * @param decoder The decoder constructor
     */
    Unzip.prototype.register = function (decoder) {
        this.o[decoder.compression] = decoder;
    };
    return Unzip;
}());
exports.Unzip = Unzip;
var mt = typeof queueMicrotask == 'function' ? queueMicrotask : typeof setTimeout == 'function' ? setTimeout : function (fn) { fn(); };
function unzip(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    var term = [];
    var tAll = function () {
        for (var i = 0; i < term.length; ++i)
            term[i]();
    };
    var files = {};
    var cbd = function (a, b) {
        mt(function () { cb(a, b); });
    };
    mt(function () { cbd = cb; });
    var e = data.length - 22;
    for (; b4(data, e) != 0x6054B50; --e) {
        if (!e || data.length - e > 65558) {
            cbd(err(13, 0, 1), null);
            return tAll;
        }
    }
    ;
    var lft = b2(data, e + 8);
    if (lft) {
        var c = lft;
        var o = b4(data, e + 16);
        var z = o == 4294967295;
        if (z) {
            e = b4(data, e - 12);
            if (b4(data, e) != 0x6064B50) {
                cbd(err(13, 0, 1), null);
                return tAll;
            }
            c = lft = b4(data, e + 32);
            o = b4(data, e + 48);
        }
        var fltr = opts && opts.filter;
        var _loop_3 = function (i) {
            var _a = zh(data, o, z), c_1 = _a[0], sc = _a[1], su = _a[2], fn = _a[3], no = _a[4], off = _a[5], b = slzh(data, off);
            o = no;
            var cbl = function (e, d) {
                if (e) {
                    tAll();
                    cbd(e, null);
                }
                else {
                    if (d)
                        files[fn] = d;
                    if (!--lft)
                        cbd(null, files);
                }
            };
            if (!fltr || fltr({
                name: fn,
                size: sc,
                originalSize: su,
                compression: c_1
            })) {
                if (!c_1)
                    cbl(null, slc(data, b, b + sc));
                else if (c_1 == 8) {
                    var infl = data.subarray(b, b + sc);
                    if (sc < 320000) {
                        try {
                            cbl(null, inflateSync(infl, new u8(su)));
                        }
                        catch (e) {
                            cbl(e, null);
                        }
                    }
                    else
                        term.push(inflate(infl, { size: su }, cbl));
                }
                else
                    cbl(err(14, 'unknown compression type ' + c_1, 1), null);
            }
            else
                cbl(null, null);
        };
        for (var i = 0; i < c; ++i) {
            _loop_3(i);
        }
    }
    else
        cbd(null, {});
    return tAll;
}
exports.unzip = unzip;
/**
 * Synchronously decompresses a ZIP archive. Prefer using `unzip` for better
 * performance with more than one file.
 * @param data The raw compressed ZIP file
 * @param opts The ZIP extraction options
 * @returns The decompressed files
 */
function unzipSync(data, opts) {
    var files = {};
    var e = data.length - 22;
    for (; b4(data, e) != 0x6054B50; --e) {
        if (!e || data.length - e > 65558)
            err(13);
    }
    ;
    var c = b2(data, e + 8);
    if (!c)
        return {};
    var o = b4(data, e + 16);
    var z = o == 4294967295;
    if (z) {
        e = b4(data, e - 12);
        if (b4(data, e) != 0x6064B50)
            err(13);
        c = b4(data, e + 32);
        o = b4(data, e + 48);
    }
    var fltr = opts && opts.filter;
    for (var i = 0; i < c; ++i) {
        var _a = zh(data, o, z), c_2 = _a[0], sc = _a[1], su = _a[2], fn = _a[3], no = _a[4], off = _a[5], b = slzh(data, off);
        o = no;
        if (!fltr || fltr({
            name: fn,
            size: sc,
            originalSize: su,
            compression: c_2
        })) {
            if (!c_2)
                files[fn] = slc(data, b, b + sc);
            else if (c_2 == 8)
                files[fn] = inflateSync(data.subarray(b, b + sc), new u8(su));
            else
                err(14, 'unknown compression type ' + c_2);
        }
    }
    return files;
}
exports.unzipSync = unzipSync;


/***/ },

/***/ 70279
(__unused_webpack_module, exports) {


var ch2 = {};
exports["default"] = (function (c, id, msg, transfer, cb) {
    var w = new Worker(ch2[id] || (ch2[id] = URL.createObjectURL(new Blob([
        c + ';addEventListener("error",function(e){e=e.error;postMessage({$e$:[e.message,e.code,e.stack]})})'
    ], { type: 'text/javascript' }))));
    w.onmessage = function (e) {
        var d = e.data, ed = d.$e$;
        if (ed) {
            var err = new Error(ed[0]);
            err['code'] = ed[1];
            err.stack = ed[2];
            cb(err, null);
        }
        else
            cb(null, d);
    };
    w.postMessage(msg, transfer);
    return w;
});


/***/ },

/***/ 92102
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (/* binding */ vtkImageReslice$1)
});

// UNUSED EXPORTS: extend, newInstance

// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/index.js + 1 modules
var esm = __webpack_require__(3823);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/macros2.js
var macros2 = __webpack_require__(90027);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/DataArray.js
var DataArray = __webpack_require__(445);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/Math/index.js
var Core_Math = __webpack_require__(8047);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/MatrixBuilder.js
var MatrixBuilder = __webpack_require__(90364);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/DataArray/Constants.js
var Constants = __webpack_require__(25015);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/BoundingBox.js
var BoundingBox = __webpack_require__(24377);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/ImageData.js
var ImageData = __webpack_require__(26393);
;// ../../../node_modules/@kitware/vtk.js/Imaging/Core/AbstractImageInterpolator/Constants.js
const ImageBorderMode = {
  CLAMP: 0,
  REPEAT: 1,
  MIRROR: 2
};
const InterpolationMode = {
  NEAREST: 0,
  LINEAR: 1,
  CUBIC: 2
};
var Constants_Constants = {
  ImageBorderMode,
  InterpolationMode
};



;// ../../../node_modules/@kitware/vtk.js/Imaging/Core/AbstractImageInterpolator/InterpolationInfo.js


const vtkInterpolationInfo = {
  pointer: null,
  extent: [0, -1, 0, -1, 0, -1],
  increments: [0, 0, 0],
  scalarType: null,
  // dataType
  dataTypeSize: 1,
  // BYTES_PER_ELEMENT
  numberOfComponents: 1,
  borderMode: ImageBorderMode.CLAMP,
  interpolationMode: InterpolationMode.LINEAR,
  extraInfo: null
};
const vtkInterpolationWeights = {
  ...vtkInterpolationInfo,
  positions: [0, 0, 0],
  weights: null,
  weightExtent: [0, -1, 0, -1, 0, -1],
  kernelSize: [1, 1, 1],
  workspace: null,
  lastY: null,
  lastZ: null
};
function vtkInterpolationMathFloor(x) {
  const integer = Math.floor(x);
  return {
    floored: integer,
    error: x - integer
  };
}
function vtkInterpolationMathRound(x) {
  return Math.round(x);
}

//----------------------------------------------------------------------------
// Perform a clamp to limit an index to [b, c] and subtract b.

function vtkInterpolationMathClamp(a, b, c) {
  let clamp = a <= c ? a : c;
  clamp -= b;
  clamp = clamp >= 0 ? clamp : 0;
  return clamp;
}

//----------------------------------------------------------------------------
// Perform a wrap to limit an index to [b, c] and subtract b.

function vtkInterpolationMathWrap(a, b, c) {
  const range = c - b + 1;
  let wrap = a - b;
  wrap %= range;
  // required for some % implementations
  wrap = wrap >= 0 ? wrap : wrap + range;
  return wrap;
}

//----------------------------------------------------------------------------
// Perform a mirror to limit an index to [b, c] and subtract b.

function vtkInterpolationMathMirror(a, b, c) {
  const range = c - b;
  const ifzero = range === 0 ? 1 : 0;
  const range2 = 2 * range + ifzero;
  let mirror = a - b;
  mirror = mirror >= 0 ? mirror : -mirror;
  mirror %= range2;
  mirror = mirror <= range ? mirror : range2 - mirror;
  return mirror;
}
var InterpolationInfo = {
  vtkInterpolationInfo,
  vtkInterpolationWeights,
  vtkInterpolationMathFloor,
  vtkInterpolationMathRound,
  vtkInterpolationMathClamp,
  vtkInterpolationMathWrap,
  vtkInterpolationMathMirror
};



;// ../../../node_modules/@kitware/vtk.js/Imaging/Core/AbstractImageInterpolator.js




const {
  ImageBorderMode: AbstractImageInterpolator_ImageBorderMode
} = Constants_Constants;

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// vtkAbstractImageInterpolator methods
// ----------------------------------------------------------------------------

function vtkAbstractImageInterpolator(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkAbstractImageInterpolator');
  publicAPI.initialize = data => {
    publicAPI.releaseData();
    model.scalars = data.getPointData().getScalars();
    model.spacing = data.getSpacing();
    model.origin = data.getOrigin();
    model.extent = data.getExtent();
    publicAPI.update();
  };
  publicAPI.releaseData = () => {
    model.scalars = null;
  };
  publicAPI.update = () => {
    if (!model.scalars) {
      model.interpolationInfo.pointer = null;
      model.interpolationInfo.numberOfComponents = 1;
      return;
    }
    model.interpolationInfo.extent = model.extent.slice();
    const supportSize = publicAPI.computeSupportSize(null);
    const kernelSize = Math.max(Math.max(supportSize[0], supportSize[1]), supportSize[2]);
    const minBound = Number.MIN_SAFE_INTEGER + kernelSize / 2;
    const maxBound = Number.MAX_SAFE_INTEGER - kernelSize / 2;
    for (let i = 0; i < 3; ++i) {
      const newTol = Math.max(0.5 * (model.extent[2 * i] === model.extent[2 * i + 1]), model.tolerance);
      model.structuredBounds[2 * i] = Math.max(model.extent[2 * i] - newTol, minBound);
      model.structuredBounds[2 * i + 1] = Math.min(model.extent[2 * i + 1] + newTol, maxBound);
    }
    const xdim = model.extent[1] - model.extent[0] + 1;
    const ydim = model.extent[3] - model.extent[2] + 1;
    const ncomp = model.scalars.getNumberOfComponents();
    model.interpolationInfo.increments[0] = ncomp;
    model.interpolationInfo.increments[1] = model.interpolationInfo.increments[0] * xdim;
    model.interpolationInfo.increments[2] = model.interpolationInfo.increments[1] * ydim;
    let component = model.componentOffset;
    component = component > 0 ? component : 0;
    component = component < ncomp ? component : ncomp - 1;
    const dataSize = 1; // scalars.getDataTypeSize()
    const inPtr = model.scalars.getData();
    model.interpolationInfo.pointer = inPtr.subarray(component * dataSize);
    model.interpolationInfo.scalarType = model.scalars.dataType;
    model.interpolationInfo.dataTypeSize = 1; // model.scalars.getElementComponentSize();
    model.interpolationInfo.numberOfComponents = publicAPI.computeNumberOfComponents(ncomp);
    model.interpolationInfo.borderMode = model.borderMode;
    publicAPI.internalUpdate();

    // TODO get functions
  };

  publicAPI.internalUpdate = () => {};
  publicAPI.interpolateXYZ = (x, y, z, component) => {
    let value = model.outValue;
    const point = [x, y, z];
    const p = [(point[0] - model.origin[0]) / model.spacing[0], (point[1] - model.origin[1]) / model.spacing[1], (point[2] - model.origin[2]) / model.spacing[2]];
    if (publicAPI.checkBoundsIJK(p)) {
      const iinfo = {
        ...model.interpolationInfo
      };
      const ncomp = iinfo.increments[0] - model.componentOffset;
      const dataTypeSize = 1; // iinfo.dataTypeSize; // vtkAbstractArray::getDataTypeSize(iinfo.scalarType)

      let c = component > 0 ? component : 0;
      c = c < ncomp ? c : ncomp - 1;
      iinfo.pointer = model.interpolationInfo.pointer.subarray(dataTypeSize * c);
      iinfo.numberOfComponents = 1;
      const v = [value];
      publicAPI.interpolatePoint(iinfo, p, v);
      value = v[0];
    }
    return value;
  };
  publicAPI.interpolate = (point, value) => {
    const p = [(point[0] - model.origin[0]) / model.spacing[0], (point[1] - model.origin[1]) / model.spacing[1], (point[2] - model.origin[2]) / model.spacing[2]];
    if (publicAPI.checkBoundsIJK(p)) {
      publicAPI.interpolatePoint(model.interpolationInfo, p, value);
      return true;
    }
    for (let i = 0; i < model.interpolationInfo.numberOfComponents; ++i) {
      value[i] = model.outValue;
    }
    return false;
  };
  publicAPI.computeNumberOfComponents = inputCount => {
    const component = Math.min(Math.max(model.componentOffset, 0), inputCount - 1);
    const count = model.componentCount < inputCount - component ? model.componentCount : inputCount - component;
    return count > 0 ? count : inputCount - component;
  };
  publicAPI.getNumberOfComponents = () => model.interpolationInfo.numberOfComponents;
  publicAPI.interpolateIJK = (point, value) => {
    publicAPI.interpolatePoint(model.interpolationInfo, point, value);
  };
  publicAPI.checkBoundsIJK = point => !(point[0] < model.structuredBounds[0] || point[0] > model.structuredBounds[1] || point[1] < model.structuredBounds[2] || point[1] > model.structuredBounds[3] || point[2] < model.structuredBounds[4] || point[2] > model.structuredBounds[5]);
  publicAPI.computeSupportSize = null; // (matrix) => {};
  publicAPI.isSeparable = null;
  publicAPI.precomputeWeightsForExtent = (matrix, inExtent, checkExtent) => {};
  publicAPI.FreePrecomputedWeights = weights => {
    /*
    for (let k = 0; k < 3; ++k) {
      const step = weights.kernelSize[k];
      // TODO: check if ok
      weights.positions[k] += step * weights.weightExtent[2 * k];
      if (weights.weights[k]) {
        // TODO: check if ok
        weights.weights[k] += step * weights.weightExtent[2 * k];
      }
    }
     if (weights.workspace) {
      for (let i = 1; i < weights.kernelSize[1]; ++i) {
        // TODO
        ...
      }
    }
    */
  };
  publicAPI.interpolatePoint = (interpolationInfo, point, value) => {};
  publicAPI.interpolateRow = (weights, xIdx, yIdx, zIdx, value, n) => {};
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  outValue: 0,
  tolerance: Number.EPSILON,
  componentOffset: 0,
  componentCount: -1,
  borderMode: AbstractImageInterpolator_ImageBorderMode.CLAMP,
  slidingWindow: false,
  scalars: null,
  interpolationInfo: {
    ...vtkInterpolationInfo
  },
  interpolationFunc: null,
  rowInterpolationFunc: null,
  structuredBounds: [0, -1, 0, -1, 0, -1],
  spacing: null,
  origin: null,
  extent: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  macros2.m.obj(publicAPI, model);
  macros2.m.setGet(publicAPI, model, ['outValue', 'tolerance', 'componentOffset', 'componentCount', 'borderMode', 'slidingWindow']);
  macros2.m.get(publicAPI, model, ['origin', 'spacing']);

  // Object specific methods
  vtkAbstractImageInterpolator(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macros2.m.newInstance(extend, 'vtkAbstractImageInterpolator');

// ----------------------------------------------------------------------------

var vtkAbstractImageInterpolator$1 = {
  newInstance,
  extend,
  ...Constants_Constants
};



;// ../../../node_modules/@kitware/vtk.js/Imaging/Core/ImageInterpolator.js





// ----------------------------------------------------------------------------
// vtkImageInterpolator methods
// ----------------------------------------------------------------------------

function vtkImageInterpolator(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkImageInterpolator');
  publicAPI.computeSupportSize = matrix => {
    let s = 1;
    if (model.interpolationMode === InterpolationMode.LINEAR) {
      s = 2;
    } else if (model.interpolationMode === InterpolationMode.CUBIC) {
      s = 4;
    }
    const size = [s, s, s];
    if (matrix == null) {
      return size;
    }
    // TODO CHECK MATRIX
    if (matrix[12] !== 0 || matrix[13] !== 0 || matrix[14] !== 0 || matrix[15] !== 1) {
      return size;
    }
    for (let i = 0; i < 3; ++i) {
      let integerRow = true;
      for (let j = 0; j < 3; ++j) {
        integerRow = integerRow && Number.isInteger(matrix[4 * i + j]);
      }
      if (integerRow) {
        size[i] = 1;
      }
    }
    return size;
  };
  publicAPI.internalUpdate = () => {
    model.interpolationInfo.interpolationMode = model.interpolationMode;
  };
  publicAPI.isSeparable = () => true;
  publicAPI.interpolateNearest = (interpolationInfo, point, value) => {
    const inExt = interpolationInfo.extent;
    const inInc = interpolationInfo.increments;
    const numscalars = interpolationInfo.numberOfComponents;
    let inIdX0 = vtkInterpolationMathRound(point[0]);
    let inIdY0 = vtkInterpolationMathRound(point[1]);
    let inIdZ0 = vtkInterpolationMathRound(point[2]);
    switch (interpolationInfo.borderMode) {
      case ImageBorderMode.REPEAT:
        inIdX0 = vtkInterpolationMathWrap(inIdX0, inExt[0], inExt[1]);
        inIdY0 = vtkInterpolationMathWrap(inIdY0, inExt[2], inExt[3]);
        inIdZ0 = vtkInterpolationMathWrap(inIdZ0, inExt[4], inExt[5]);
        break;
      case ImageBorderMode.MIRROR:
        inIdX0 = vtkInterpolationMathMirror(inIdX0, inExt[0], inExt[1]);
        inIdY0 = vtkInterpolationMathMirror(inIdY0, inExt[2], inExt[3]);
        inIdZ0 = vtkInterpolationMathMirror(inIdZ0, inExt[4], inExt[5]);
        break;
      default:
        inIdX0 = vtkInterpolationMathClamp(inIdX0, inExt[0], inExt[1]);
        inIdY0 = vtkInterpolationMathClamp(inIdY0, inExt[2], inExt[3]);
        inIdZ0 = vtkInterpolationMathClamp(inIdZ0, inExt[4], inExt[5]);
        break;
    }
    const startId = inIdX0 * inInc[0] + inIdY0 * inInc[1] + inIdZ0 * inInc[2];
    for (let i = 0; i < numscalars; ++i) {
      value[i] = interpolationInfo.pointer[startId + i];
    }
  };
  publicAPI.interpolateLinear = (interpolationInfo, point, value) => {
    const inExt = interpolationInfo.extent;
    const inInc = interpolationInfo.increments;
    const numscalars = interpolationInfo.numberOfComponents;
    const floorX = vtkInterpolationMathFloor(point[0]);
    const floorY = vtkInterpolationMathFloor(point[1]);
    const floorZ = vtkInterpolationMathFloor(point[2]);
    let inIdX0 = floorX.floored;
    let inIdY0 = floorY.floored;
    let inIdZ0 = floorZ.floored;
    const fx = floorX.error;
    const fy = floorY.error;
    const fz = floorZ.error;
    let inIdX1 = inIdX0 + (fx !== 0);
    let inIdY1 = inIdY0 + (fy !== 0);
    let inIdZ1 = inIdZ0 + (fz !== 0);
    switch (interpolationInfo.borderMode) {
      case ImageBorderMode.REPEAT:
        inIdX0 = vtkInterpolationMathWrap(inIdX0, inExt[0], inExt[1]);
        inIdY0 = vtkInterpolationMathWrap(inIdY0, inExt[2], inExt[3]);
        inIdZ0 = vtkInterpolationMathWrap(inIdZ0, inExt[4], inExt[5]);
        inIdX1 = vtkInterpolationMathWrap(inIdX1, inExt[0], inExt[1]);
        inIdY1 = vtkInterpolationMathWrap(inIdY1, inExt[2], inExt[3]);
        inIdZ1 = vtkInterpolationMathWrap(inIdZ1, inExt[4], inExt[5]);
        break;
      case ImageBorderMode.MIRROR:
        inIdX0 = vtkInterpolationMathMirror(inIdX0, inExt[0], inExt[1]);
        inIdY0 = vtkInterpolationMathMirror(inIdY0, inExt[2], inExt[3]);
        inIdZ0 = vtkInterpolationMathMirror(inIdZ0, inExt[4], inExt[5]);
        inIdX1 = vtkInterpolationMathMirror(inIdX1, inExt[0], inExt[1]);
        inIdY1 = vtkInterpolationMathMirror(inIdY1, inExt[2], inExt[3]);
        inIdZ1 = vtkInterpolationMathMirror(inIdZ1, inExt[4], inExt[5]);
        break;
      default:
        inIdX0 = vtkInterpolationMathClamp(inIdX0, inExt[0], inExt[1]);
        inIdY0 = vtkInterpolationMathClamp(inIdY0, inExt[2], inExt[3]);
        inIdZ0 = vtkInterpolationMathClamp(inIdZ0, inExt[4], inExt[5]);
        inIdX1 = vtkInterpolationMathClamp(inIdX1, inExt[0], inExt[1]);
        inIdY1 = vtkInterpolationMathClamp(inIdY1, inExt[2], inExt[3]);
        inIdZ1 = vtkInterpolationMathClamp(inIdZ1, inExt[4], inExt[5]);
        break;
    }
    const factX0 = inIdX0 * inInc[0];
    const factX1 = inIdX1 * inInc[0];
    const factY0 = inIdY0 * inInc[1];
    const factY1 = inIdY1 * inInc[1];
    const factZ0 = inIdZ0 * inInc[2];
    const factZ1 = inIdZ1 * inInc[2];
    const i00 = factY0 + factZ0;
    const i01 = factY0 + factZ1;
    const i10 = factY1 + factZ0;
    const i11 = factY1 + factZ1;
    const rx = 1 - fx;
    const ry = 1 - fy;
    const rz = 1 - fz;
    const ryrz = ry * rz;
    const fyrz = fy * rz;
    const ryfz = ry * fz;
    const fyfz = fy * fz;
    const inPtr = interpolationInfo.pointer;
    for (let i = 0; i < numscalars; ++i) {
      value[i] = rx * (ryrz * inPtr[factX0 + i00 + i * 4] + ryfz * inPtr[factX0 + i01 + i * 4] + fyrz * inPtr[factX0 + i10 + i * 4] + fyfz * inPtr[factX0 + i11 + i * 4]) + fx * (ryrz * inPtr[factX1 + i00 + i * 4] + ryfz * inPtr[factX1 + i01 + i * 4] + fyrz * inPtr[factX1 + i10 + i * 4] + fyfz * inPtr[factX1 + i11 + i * 4]);
    }
  };
  publicAPI.interpolatePoint = (interpolationInfo, point, value) => {
    switch (model.interpolationMode) {
      case InterpolationMode.LINEAR:
        publicAPI.interpolateLinear(interpolationInfo, point, value);
        break;
      case InterpolationMode.CUBIC:
        console.log('CUBIC not implemented');
        break;
      case InterpolationMode.NEAREST:
      default:
        publicAPI.interpolateNearest(interpolationInfo, point, value);
        break;
    }
  };
  publicAPI.interpolateRowNearest = (weights, idX, idY, idZ, outPtr, n) => {
    // TODO check pointers
    const iX = weights.positions[0].subarray(idX);
    const iY = weights.positions[1].subarray(idY);
    const iZ = weights.positions[2].subarray(idZ);
    const inPtr0 = weights.pointer.subarray(iY[0] + iZ[0]);

    // get the number of components per pixel
    const numscalars = weights.numberOfComponents;

    // This is a hot loop.
    for (let i = 0; i < n; ++i) {
      outPtr.set(inPtr0.subarray(iX[i], numscalars), i * numscalars);
    }
  };
  publicAPI.interpolateRowLinear = (weights, idX, idY, idZ, outPtr, n) => {
    const stepX = weights.kernelSize[0];
    const stepY = weights.kernelSize[1];
    const stepZ = weights.kernelSize[2];
    const idXtemp = idX * stepX;
    const idYtemp = idY * stepY;
    const idZtemp = idZ * stepZ;
    const fX = weights.weights[0].subarray(idXtemp);
    const fY = weights.weights[1].subarray(idYtemp);
    const fZ = weights.weights[2].subarray(idZtemp);
    const iX = weights.positions[0].subarray(idXtemp);
    const iY = weights.positions[1].subarray(idYtemp);
    const iZ = weights.positions[2].subarray(idZtemp);
    const inPtr = weights.pointer;

    // get the number of components per pixel
    const numscalars = weights.numberOfComponents;

    // create a 2x2 bilinear kernel in local variables
    const i00 = iY.subarray(iZ[0]);
    let i01 = i00;
    let i10 = i00;
    let i11 = i00;
    let ry = 1;
    let fy = 0;
    let rz = 1;
    let fz = 0;
    if (stepY === 2) {
      i10 = iY[1].subarray(iZ[0]);
      i11 = i10;
      ry = fY[0];
      fy = fY[1];
    }
    if (stepZ === 2) {
      i01 = iY[0].subarray(iZ[1]);
      i11 = i01;
      rz = fZ[0];
      fz = fZ[1];
    }
    if (stepY + stepZ === 4) {
      i11 = iY[1].subarray(iZ[1]);
    }
    const ryrz = ry * rz;
    const ryfz = ry * fz;
    const fyrz = fy * rz;
    const fyfz = fy * fz;
    if (stepX === 1) {
      if (fy === 0 && fz === 0) {
        // no interpolation needed at all
        for (let i = n; i > 0; --i) {
          for (let j = 0; j < numscalars; j++) {
            outPtr[j + n - i] = inPtr[i00 + iX[n - i] + j];
          }
        }
      } else if (fy === 0) {
        // only need linear z interpolation
        for (let i = n; i > 0; --i) {
          for (let j = 0; j < numscalars; j++) {
            outPtr[j + n - i] = rz * inPtr[iX[n - i] + i00 + j * 4] + fz * inPtr[iX[n - i] + i01 + j * 4];
          }
        }
      } else {
        // interpolate in y and z but not in x
        for (let i = n; i > 0; --i) {
          for (let j = 0; j < numscalars; j++) {
            outPtr[j + n - i] = ryrz * inPtr[iX[n - i] + i00 + j * 4] + ryfz * inPtr[iX[n - i] + i01 + j * 4] + fyrz * inPtr[iX[n - i] + i10 + j * 4] + fyfz * inPtr[iX[n - i] + i11 + j * 4];
          }
        }
      }
    } else if (fz === 0) {
      let x = 0;
      // bilinear interpolation in x,y
      for (let i = n; i > 0; --i) {
        const rx = fX[0 + 2 * x];
        const fx = fX[1 + 2 * x];
        const t0 = iX[0 + 2 * x];
        const t1 = iX[1 + 2 * x];
        for (let j = 0; j < numscalars; j++) {
          outPtr[j + n - i] = rx * (ry * inPtr[t0 + i00 + j * 4] + fy * inPtr[t0 + i10 + j * 4]) + fx * (ry * inPtr[t1 + i00 + j * 4] + fy * inPtr[t1 + i10 + j * 4]);
        }
        x++;
      }
    } else {
      let x = 0;
      // do full trilinear interpolation
      for (let i = n; i > 0; --i) {
        const rx = fX[0 + 2 * x];
        const fx = fX[1 + 2 * x];
        const t0 = iX[0 + 2 * x];
        const t1 = iX[1 + 2 * x];
        for (let j = 0; j < numscalars; j++) {
          outPtr[j] = rx * (ryrz * inPtr[t0 + i00 + j * 4] + ryfz * inPtr[t0 + i01 + j * 4] + fyrz * inPtr[t0 + i10 + j * 4] + fyfz * inPtr[t0 + i11 + j * 4]) + fx * (ryrz * inPtr[t1 + i00 + j * 4] + ryfz * inPtr[t1 + i01 + j * 4] + fyrz * inPtr[t1 + i10 + j * 4] + fyfz * inPtr[t1 + i11 + j * 4]);
        }
        x++;
      }
    }
  };
  publicAPI.interpolateRow = (weights, xIdx, yIdx, zIdx, value, n) => {
    switch (model.interpolationMode) {
      case InterpolationMode.LINEAR:
        publicAPI.interpolateRowLinear(weights, xIdx, yIdx, zIdx, value, n);
        break;
      case InterpolationMode.CUBIC:
        console.log('CUBIC not implemented');
        break;
      case InterpolationMode.NEAREST:
      default:
        publicAPI.interpolateRowNearest(weights, xIdx, yIdx, zIdx, value, n);
        break;
    }
  };
  publicAPI.vtkTricubicInterpWeights = f => {
    const half = 0.5;

    // cubic interpolation
    const fm1 = f - 1;
    const fd2 = f * half;
    const ft3 = f * 3;
    return [-fd2 * fm1 * fm1, ((ft3 - 2) * fd2 - 1) * fm1, -((ft3 - 4) * f - 1) * fd2, f * fd2 * fm1];
  };
  publicAPI.precomputeWeightsForExtent = (matrix, outExt, clipExt) => {
    const weights = {
      ...vtkInterpolationWeights.newInstance(),
      ...model.interpolationInfo
    };
    weights.weightType = 'Float32Array';
    const interpMode = weights.interpolationMode;
    let validClip = true;
    for (let j = 0; j < 3; ++j) {
      // set k to the row for which the element in column j is nonzero
      let k;
      for (k = 0; k < 3; ++k) {
        if (matrix[4 * j + k] !== 0) {
          break;
        }
      }

      // get the extents
      clipExt[2 * j] = outExt[2 * j];
      clipExt[2 * j + 1] = outExt[2 * j + 1];
      const minExt = weights.extent[2 * k];
      const maxExt = weights.extent[2 * k + 1];
      const minBounds = model.structuredBounds[2 * k];
      const maxBounds = model.structuredBounds[2 * k + 1];

      // the kernel size should not exceed the input dimension
      let step = 1;
      step = interpMode < InterpolationMode.LINEAR ? step : 2;
      step = interpMode < InterpolationMode.CUBIC ? step : 4;
      const inCount = maxExt - minExt + 1;
      step = step < inCount ? step : inCount;

      // if output pixels lie exactly on top of the input pixels
      if (Number.isInteger(matrix[4 * j + k]) && Number.isInteger(matrix[4 * k + k])) {
        step = 1;
      }
      const size = step * (outExt[2 * j + 1] - outExt[2 * j] + 1);
      // TODO: check pointers
      const positions = new Int16Array(size);
      // positions -= step*outExt[2 * j];
      const startPositions = step * outExt[2 * j];
      let constants = null;
      if (interpMode !== InterpolationMode.NEAREST) {
        constants = new Int16Array(size);
        // constants -= step * outExt[2 * j];
      }

      weights.kernelSize[j] = step;
      weights.weightExtent[2 * j] = outExt[2 * j];
      weights.weightExtent[2 * j + 1] = outExt[2 * j + 1];
      weights.positions[j] = positions; // TODO: check pointers
      weights.weights[j] = constants; // TODO: check pointers

      let region = 0;
      for (let i = outExt[2 * j]; i <= outExt[2 * j + 1]; ++i) {
        const point = matrix[4 * 3 + k] + i * matrix[4 * j + k];
        let lcount = step;
        let inId0 = 0;
        let f = 0;
        if (interpMode === InterpolationMode.NEAREST) {
          inId0 = Math.round(point);
        } else {
          const res = vtkInterpolationMathFloor(point);
          inId0 = res.integer;
          f = res.error;
          if (interpMode === InterpolationMode.CUBIC && step !== 1) {
            inId0--;
            lcount = 4;
          }
        }
        const inId = [0, 0, 0, 0];
        let l = 0;
        switch (weights.borderMode) {
          case ImageBorderMode.REPEAT:
            do {
              inId[l] = vtkInterpolationMathWrap(inId0, minExt, maxExt);
              inId0++;
            } while (++l < lcount);
            break;
          case ImageBorderMode.MIRROR:
            do {
              inId[l] = vtkInterpolationMathMirror(inId0, minExt, maxExt);
              inId0++;
            } while (++l < lcount);
            break;
          default:
            do {
              inId[l] = vtkInterpolationMathClamp(inId0, minExt, maxExt);
              inId0++;
            } while (++l < lcount);
            break;
        }

        // compute the weights and offsets
        const inInc = weights.increments[k];
        positions[step * i - startPositions] = inId[0] * inInc;
        if (interpMode !== InterpolationMode.NEAREST) {
          constants[step * i - startPositions] = 1;
        }
        if (step > 1) {
          if (interpMode === InterpolationMode.LINEAR) {
            positions[step * i + 1 - startPositions] = inId[1] * inInc;
            constants[step * i - startPositions] = 1.0 - f;
            constants[step * i + 1 - startPositions] = f;
          } else if (interpMode === InterpolationMode.CUBIC) {
            const g = publicAPI.vtkTricubicInterpWeights(f);
            if (step === 4) {
              for (let ll = 0; ll < 4; ll++) {
                positions[step * i + ll - startPositions] = inId[ll] * inInc;
                constants[step * i + ll - startPositions] = g[ll];
              }
            } else {
              // it gets tricky if there are fewer than 4 slices
              const gg = [0, 0, 0, 0];
              for (let ll = 0; ll < 4; ll++) {
                const rIdx = inId[ll] - minExt;
                gg[rIdx] += g[ll];
              }
              for (let jj = 0; jj < step; jj++) {
                positions[step * i + jj - startPositions] = minExt + jj;
                constants[step * i + jj - startPositions] = gg[jj];
              }
            }
          }
        }
        if (point >= minBounds && point <= maxBounds) {
          if (region === 0) {
            // entering the input extent
            region = 1;
            clipExt[2 * j] = i;
          }
        } else if (region === 1) {
          // leaving the input extent
          region = 2;
          clipExt[2 * j + 1] = i - 1;
        }
      }
      if (region === 0 || clipExt[2 * j] > clipExt[2 * j + 1]) {
        // never entered input extent!
        validClip = false;
      }
    }
    if (!validClip) {
      // output extent doesn't itersect input extent
      for (let j = 0; j < 3; j++) {
        clipExt[2 * j] = outExt[2 * j];
        clipExt[2 * j + 1] = outExt[2 * j] - 1;
      }
    }
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const ImageInterpolator_DEFAULT_VALUES = {
  interpolationMode: InterpolationMode.NEAREST
};

// ----------------------------------------------------------------------------

function ImageInterpolator_extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, ImageInterpolator_DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkAbstractImageInterpolator$1.extend(publicAPI, model, initialValues);
  macros2.m.setGet(publicAPI, model, ['interpolationMode']);

  // Object specific methods
  vtkImageInterpolator(publicAPI, model);
}

// ----------------------------------------------------------------------------

const ImageInterpolator_newInstance = macros2.m.newInstance(ImageInterpolator_extend, 'vtkImageInterpolator');

// ----------------------------------------------------------------------------

var vtkImageInterpolator$1 = {
  newInstance: ImageInterpolator_newInstance,
  extend: ImageInterpolator_extend
};



;// ../../../node_modules/@kitware/vtk.js/Imaging/Core/ImagePointDataIterator.js


// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// vtkImagePointDataIterator methods
// ----------------------------------------------------------------------------

function vtkImagePointDataIterator(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkImagePointDataIterator');
  publicAPI.initialize = (image, inExtent, stencil, algorithm) => {
    const dataExtent = image.getExtent();
    let extent = inExtent;
    if (extent == null) {
      extent = dataExtent;
    }
    let emptyExtent = false;
    for (let i = 0; i < 6; i += 2) {
      model.extent[i] = Math.max(extent[i], dataExtent[i]);
      model.extent[i + 1] = Math.min(extent[i + 1], dataExtent[i + 1]);
      if (model.extent[i] > model.extent[i + 1]) {
        emptyExtent = true;
      }
    }
    model.rowIncrement = dataExtent[1] - dataExtent[0] + 1;
    model.sliceIncrement = model.rowIncrement * (dataExtent[3] - dataExtent[2] + 1);
    let rowSpan;
    let sliceSpan;
    let volumeSpan;
    if (!emptyExtent) {
      // Compute the span of the image region to be covered.
      rowSpan = model.extent[1] - model.extent[0] + 1;
      sliceSpan = model.extent[3] - model.extent[2] + 1;
      volumeSpan = model.extent[5] - model.extent[4] + 1;
      model.id = model.extent[0] - dataExtent[0] + (model.extent[2] - dataExtent[2]) * model.rowIncrement + (model.extent[4] - dataExtent[4]) * model.sliceIncrement;

      // Compute the end increments (continuous increments).
      model.rowEndIncrement = model.rowIncrement - rowSpan;
      model.sliceEndIncrement = model.rowEndIncrement + model.sliceIncrement - model.rowIncrement * sliceSpan;
    } else {
      // Extent is empty, isAtEnd() will immediately return "true"
      rowSpan = 0;
      sliceSpan = 0;
      volumeSpan = 0;
      model.id = 0;
      model.rowEndIncrement = 0;
      model.sliceEndIncrement = 0;
      for (let i = 0; i < 6; i += 2) {
        model.extent[i] = dataExtent[i];
        model.extent[i + 1] = dataExtent[i] - 1;
      }
    }

    // Get the end pointers for row, slice, and volume.
    model.spanEnd = model.id + rowSpan;
    model.rowEnd = model.id + rowSpan;
    model.sliceEnd = model.id + (model.rowIncrement * sliceSpan - model.rowEndIncrement);
    model.end = model.id + (model.sliceIncrement * volumeSpan - model.sliceEndIncrement);

    // For keeping track of the current x,y,z index.
    model.index[0] = model.extent[0];
    model.index[1] = model.extent[2];
    model.index[2] = model.extent[4];

    // For resetting the Y index after each slice.
    model.startY = model.index[1];

    // Code for when a stencil is provided.
    if (stencil) {
      model.hasStencil = true;
      model.inStencil = false;
      model.spanIndex = 0;
      const stencilExtent = stencil.getExtent();

      // The stencil has a YZ array of span lists, we need increments
      // to get to the next Z position in the YZ array.
      model.spanSliceIncrement = 0;
      model.spanSliceEndIncrement = 0;
      if (stencilExtent[3] >= stencilExtent[2] && stencilExtent[5] >= stencilExtent[4]) {
        model.spanSliceIncrement = stencilExtent[3] - stencilExtent[2] + 1;
        const botOffset = model.extent[2] - stencilExtent[2];
        if (botOffset >= 0) {
          model.spanSliceEndIncrement += botOffset;
        }
        const topOffset = stencilExtent[3] - model.extent[3];
        if (topOffset >= 0) {
          model.spanSliceEndIncrement += topOffset;
        }
      }

      // Find the offset to the start position within the YZ array.
      let startOffset = 0;
      const yOffset = model.extent[2] - stencilExtent[2];
      if (yOffset < 0) {
        model.extent[2] = stencilExtent[2];
        // starting before start of stencil: subtract the increment that
        // will be added in NextSpan() upon entry into stencil extent
        startOffset -= 1;
      } else {
        // starting partway into the stencil, so add an offset
        startOffset += yOffset;
      }
      if (stencilExtent[3] <= model.extent[3]) {
        model.extent[3] = stencilExtent[3];
      }
      const zOffset = model.extent[4] - stencilExtent[4];
      if (zOffset < 0) {
        model.extent[4] = stencilExtent[4];
        // starting before start of stencil: subtract the increment that
        // will be added in NextSpan() upon entry into stencil extent
        if (yOffset >= 0) {
          startOffset -= 1 + model.spanSliceEndIncrement;
        }
      } else {
        // starting partway into the stencil, so add an offset
        startOffset += zOffset * model.spanSliceIncrement;
      }
      if (stencilExtent[5] <= model.extent[5]) {
        model.extent[5] = stencilExtent[5];
      }
      if (model.extent[2] <= model.extent[3] && model.extent[4] <= model.extent[5]) {
        model.spanCountPointer = stencil.extentListLengths.subarray(startOffset);
        model.spanListPointer = stencil.extentLists.subarray(startOffset);

        // Get the current position within the span list for the current row
        if (yOffset >= 0 && zOffset >= 0) {
          // If starting within stencil extent, check stencil immediately
          model.inStencil = true;
          model.setSpanState(model.extent[0]);
        }
      } else {
        model.spanCountPointer = null;
        model.spanListPointer = null;
        model.inStencil = false;
      }
    } else {
      model.hasStencil = false;
      model.inStencil = true;
      model.spanSliceEndIncrement = 0;
      model.spanSliceIncrement = 0;
      model.spanIndex = 0;
      model.spanCountPointer = null;
      model.spanListPointer = null;
    }
    if (algorithm) {
      model.algorithm = algorithm;
      const maxCount = sliceSpan * volumeSpan;
      model.target = maxCount / 50 + 1;
      model.count = model.target * 50 - maxCount / model.target * model.target + 1;
    } else {
      model.algorithm = null;
      model.target = 0;
      model.count = 0;
    }
  };
  publicAPI.setSpanState = idX => {
    // Find the span that includes idX
    let inStencil = false;
    const spans = model.spanListPointer;
    const n = model.spanCountPointer[0];
    let i;
    for (i = 0; i < n; ++i) {
      if (spans[i] > idX) {
        break;
      }
      inStencil = !inStencil;
    }

    // Set the primary span state variables
    model.spanIndex = i;
    model.inStencil = inStencil;

    // Clamp the span end to MaxX+1
    let endIdX = model.extent[1] + 1;
    if (i < n && spans[i] <= model.extent[1]) {
      endIdX = spans[i];
    }

    // Compute the pointers for idX and endIdX
    const rowStart = model.rowEnd - (model.rowIncrement - model.rowEndIncrement);
    model.id = rowStart + (idX - model.extent[0]);
    model.spanEnd = rowStart + (endIdX - model.extent[0]);
  };
  publicAPI.nextSpan = () => {
    if (model.spanEnd === model.rowEnd) {
      let spanIncr = 1;
      if (model.spanEnd !== model.sliceEnd) {
        // Move to the next row
        model.id = model.rowEnd + model.rowEndIncrement;
        model.rowEnd += model.rowIncrement;
        model.spanEnd = model.rowEnd;
        model.index[1]++;
      } else if (model.spanEnd !== model.end) {
        // Move to the next slice
        model.id = model.sliceEnd + model.sliceEndIncrement;
        model.sliceEnd += model.sliceIncrement;
        model.rowEnd = model.id + (model.rowIncrement - model.rowEndIncrement);
        model.spanEnd = model.rowEnd;
        model.index[1] = model.startY;
        model.index[2]++;
        spanIncr += model.spanSliceEndIncrement;
      } else {
        // reached End
        model.id = model.end;
        return;
      }

      // Start of next row
      model.index[0] = model.extent[0];
      if (model.hasStencil) {
        if (model.index[1] >= model.extent[2] && model.index[1] <= model.extent[3] && model.index[2] >= model.extent[4] && model.index[2] <= model.extent[5]) {
          model.spanCountPointer = model.spanCountPointer.subarray(spanIncr);
          model.spanListPointer = model.spanListPointer.subarray(spanIncr);
          publicAPI.setSpanState(model.extent[0]);
        } else {
          model.inStencil = false;
        }
      }
      if (model.algorithm) {
        publicAPI.reportProgress();
      }
    } else {
      // Move to the next span in the current row
      model.id = model.spanEnd;
      const spanCount = model.spanCountPointer[0];
      let endIdX = model.extent[1] + 1;
      model.index[0] = endIdX;
      if (model.spanIndex < spanCount) {
        const tmpIdX = model.spanListPointer[model.spanIndex];
        if (tmpIdX < endIdX) {
          model.index[0] = tmpIdX;
        }
      }

      // Get the index to the start of the span after the next
      model.spanIndex++;
      if (model.spanIndex < spanCount) {
        const tmpIdX = model.spanListPointer[model.spanIndex];
        if (tmpIdX < endIdX) {
          endIdX = tmpIdX;
        }
      }

      // Compute the end of the span
      model.spanEnd = model.rowEnd - (model.rowIncrement - model.rowEndIncrement) + (endIdX - model.extent[0]);

      // Flip the state
      model.inStencil = !model.inStencil;
    }
  };
  publicAPI.isAtEnd = () => model.id === model.end;
  publicAPI.isInStencil = () => model.inStencil;
  publicAPI.spanEndId = () => model.spanEnd;
  publicAPI.reportProgress = () => {};
  publicAPI.getArray = (array, i) => array.getData().subarray(i * array.getNumberOfComponents());
  publicAPI.getScalars = function (image) {
    let i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return publicAPI.getArray(image.getPointData().getScalars(), i);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const ImagePointDataIterator_DEFAULT_VALUES = {
  spanState: 0,
  extent: [0, -1, 0, -1, 0, -1],
  end: 0,
  spanEnd: 0,
  rowEnd: 0,
  sliceEnd: 0,
  rowIncrement: 0,
  rowEndIncrement: 0,
  sliceIncrement: 0,
  sliceEndIncrement: 0,
  id: 0,
  index: [0, 0, 0],
  startY: 0,
  hasStencil: false,
  inStencil: true,
  spanIndex: 0,
  spanSliceIncrement: 0,
  spanSliceEndIncrement: 0,
  spanCountPointer: null,
  spanListPointer: null,
  algorithm: null,
  target: 0,
  count: 0
};

// ----------------------------------------------------------------------------

function ImagePointDataIterator_extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, ImagePointDataIterator_DEFAULT_VALUES, initialValues);

  // Object methods
  macros2.m.obj(publicAPI, model);
  macros2.m.get(publicAPI, model, ['id', 'index']);

  // Object specific methods
  vtkImagePointDataIterator(publicAPI, model);
}

// ----------------------------------------------------------------------------

const ImagePointDataIterator_newInstance = macros2.m.newInstance(ImagePointDataIterator_extend, 'vtkImagePointDataIterator');

// ----------------------------------------------------------------------------

var vtkImagePointDataIterator$1 = {
  newInstance: ImagePointDataIterator_newInstance,
  extend: ImagePointDataIterator_extend
};



;// ../../../node_modules/@kitware/vtk.js/Imaging/Core/ImageReslice/Constants.js
const SlabMode = {
  MIN: 0,
  MAX: 1,
  MEAN: 2,
  SUM: 3
};
var ImageReslice_Constants_Constants = {
  SlabMode
};



;// ../../../node_modules/@kitware/vtk.js/Imaging/Core/ImageReslice.js














const {
  SlabMode: ImageReslice_SlabMode
} = ImageReslice_Constants_Constants;
const {
  vtkErrorMacro
} = macros2.m;

// ----------------------------------------------------------------------------
// vtkImageReslice methods
// ----------------------------------------------------------------------------

function vtkImageReslice(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkImageReslice');
  const superClass = {
    ...publicAPI
  };
  const indexMatrix = esm/* mat4.identity */.pB.identity(new Float64Array(16));
  let optimizedTransform = null;
  function getImageResliceSlabTrap(tmpPtr, inComponents, sampleCount, f) {
    const n = sampleCount - 1;
    for (let i = 0; i < inComponents; i += 1) {
      let result = tmpPtr[i] * 0.5;
      for (let j = 1; j < n; j += 1) {
        result += tmpPtr[i + j * inComponents];
      }
      result += tmpPtr[i + n * inComponents] * 0.5;
      tmpPtr[i] = result * f;
    }
  }
  function getImageResliceSlabSum(tmpPtr, inComponents, sampleCount, f) {
    for (let i = 0; i < inComponents; i += 1) {
      let result = tmpPtr[i];
      for (let j = 1; j < sampleCount; j += 1) {
        result += tmpPtr[i + j * inComponents];
      }
      tmpPtr[i] = result * f;
    }
  }
  function getImageResliceCompositeMinValue(tmpPtr, inComponents, sampleCount) {
    for (let i = 0; i < inComponents; i += 1) {
      let result = tmpPtr[i];
      for (let j = 1; j < sampleCount; j += 1) {
        result = Math.min(result, tmpPtr[i + j * inComponents]);
      }
      tmpPtr[i] = result;
    }
  }
  function getImageResliceCompositeMaxValue(tmpPtr, inComponents, sampleCount) {
    for (let i = 0; i < inComponents; i += 1) {
      let result = tmpPtr[i];
      for (let j = 1; j < sampleCount; j += 1) {
        result = Math.max(result, tmpPtr[i + j * inComponents]);
      }
      tmpPtr[i] = result;
    }
  }
  function getImageResliceCompositeMeanValue(tmpPtr, inComponents, sampleCount) {
    const f = 1.0 / sampleCount;
    getImageResliceSlabSum(tmpPtr, inComponents, sampleCount, f);
  }
  function getImageResliceCompositeMeanTrap(tmpPtr, inComponents, sampleCount) {
    const f = 1.0 / (sampleCount - 1);
    getImageResliceSlabTrap(tmpPtr, inComponents, sampleCount, f);
  }
  function getImageResliceCompositeSumValue(tmpPtr, inComponents, sampleCount) {
    const f = 1.0;
    getImageResliceSlabSum(tmpPtr, inComponents, sampleCount, f);
  }
  function getImageResliceCompositeSumTrap(tmpPtr, inComponents, sampleCount) {
    const f = 1.0;
    getImageResliceSlabTrap(tmpPtr, inComponents, sampleCount, f);
  }
  publicAPI.getMTime = () => {
    let mTime = superClass.getMTime();
    if (model.resliceTransform) {
      mTime = Math.max(mTime, model.resliceTransform.getMTime());
    }
    return mTime;
  };
  publicAPI.setResliceAxes = resliceAxes => {
    if (!model.resliceAxes) {
      model.resliceAxes = esm/* mat4.identity */.pB.identity(new Float64Array(16));
    }
    if (!esm/* mat4.exactEquals */.pB.exactEquals(model.resliceAxes, resliceAxes)) {
      esm/* mat4.copy */.pB.copy(model.resliceAxes, resliceAxes);
      publicAPI.modified();
      return true;
    }
    return false;
  };
  publicAPI.requestData = (inData, outData) => {
    // implement requestData
    const input = inData[0];
    if (!input) {
      vtkErrorMacro('Invalid or missing input');
      return;
    }

    // console.time('reslice');

    // Retrieve output and volume data
    const origin = input.getOrigin();
    const inSpacing = input.getSpacing();
    const dims = input.getDimensions();
    const inScalars = input.getPointData().getScalars();
    const inWholeExt = [0, dims[0] - 1, 0, dims[1] - 1, 0, dims[2] - 1];
    const outOrigin = [0, 0, 0];
    const outSpacing = [1, 1, 1];
    const outWholeExt = [0, 0, 0, 0, 0, 0];
    const outDims = [0, 0, 0];
    const matrix = esm/* mat4.identity */.pB.identity(new Float64Array(16));
    if (model.resliceAxes) {
      esm/* mat4.multiply */.pB.multiply(matrix, matrix, model.resliceAxes);
    }
    const imatrix = new Float64Array(16);
    esm/* mat4.invert */.pB.invert(imatrix, matrix);
    const inCenter = [origin[0] + 0.5 * (inWholeExt[0] + inWholeExt[1]) * inSpacing[0], origin[1] + 0.5 * (inWholeExt[2] + inWholeExt[3]) * inSpacing[1], origin[2] + 0.5 * (inWholeExt[4] + inWholeExt[5]) * inSpacing[2]];
    let maxBounds = null;
    if (model.autoCropOutput) {
      maxBounds = publicAPI.getAutoCroppedOutputBounds(input);
    }
    for (let i = 0; i < 3; i++) {
      let s = 0; // default output spacing
      let d = 0; // default linear dimension
      let e = 0; // default extent start
      let c = 0; // transformed center-of-volume

      if (model.transformInputSampling) {
        let r = 0.0;
        for (let j = 0; j < 3; j++) {
          c += imatrix[4 * j + i] * (inCenter[j] - matrix[4 * 3 + j]);
          const tmp = matrix[4 * i + j] * matrix[4 * i + j];
          s += tmp * Math.abs(inSpacing[j]);
          d += tmp * (inWholeExt[2 * j + 1] - inWholeExt[2 * j]) * Math.abs(inSpacing[j]);
          e += tmp * inWholeExt[2 * j];
          r += tmp;
        }
        s /= r;
        d /= r * Math.sqrt(r);
        e /= r;
      } else {
        c = inCenter[i];
        s = inSpacing[i];
        d = (inWholeExt[2 * i + 1] - inWholeExt[2 * i]) * s;
        e = inWholeExt[2 * i];
      }
      if (model.outputSpacing == null) {
        outSpacing[i] = s;
      } else {
        outSpacing[i] = model.outputSpacing[i];
      }
      if (i >= model.outputDimensionality) {
        outWholeExt[2 * i] = 0;
        outWholeExt[2 * i + 1] = 0;
      } else if (model.outputExtent == null) {
        if (model.autoCropOutput) {
          d = maxBounds[2 * i + 1] - maxBounds[2 * i];
        }
        outWholeExt[2 * i] = Math.round(e);
        outWholeExt[2 * i + 1] = Math.round(outWholeExt[2 * i] + Math.abs(d / outSpacing[i]));
      } else {
        outWholeExt[2 * i] = model.outputExtent[2 * i];
        outWholeExt[2 * i + 1] = model.outputExtent[2 * i + 1];
      }
      if (i >= model.outputDimensionality) {
        outOrigin[i] = 0;
      } else if (model.outputOrigin == null) {
        if (model.autoCropOutput) {
          // set origin so edge of extent is edge of bounds
          outOrigin[i] = maxBounds[2 * i] - outWholeExt[2 * i] * outSpacing[i];
        } else {
          // center new bounds over center of input bounds
          outOrigin[i] = c - 0.5 * (outWholeExt[2 * i] + outWholeExt[2 * i + 1]) * outSpacing[i];
        }
      } else {
        outOrigin[i] = model.outputOrigin[i];
      }
      outDims[i] = outWholeExt[2 * i + 1] - outWholeExt[2 * i] + 1;
    }
    let dataType = inScalars.getDataType();
    if (model.outputScalarType) {
      dataType = model.outputScalarType;
    }
    const numComponents = input.getPointData().getScalars().getNumberOfComponents(); // or s.numberOfComponents;

    const outScalarsData = macros2.m.newTypedArray(dataType, outDims[0] * outDims[1] * outDims[2] * numComponents);
    const outScalars = DataArray/* default.newInstance */.Ay.newInstance({
      name: 'Scalars',
      values: outScalarsData,
      numberOfComponents: numComponents
    });

    // Update output
    const output = outData[0]?.initialize() || ImageData/* default.newInstance */.Ay.newInstance();
    output.setDimensions(outDims);
    output.setOrigin(outOrigin);
    output.setSpacing(outSpacing);
    if (model.outputDirection) {
      output.setDirection(model.outputDirection);
    }
    output.getPointData().setScalars(outScalars);
    publicAPI.getIndexMatrix(input, output);
    let interpolationMode = model.interpolationMode;
    model.usePermuteExecute = false;
    if (model.optimization) {
      if (optimizedTransform == null && model.slabSliceSpacingFraction === 1.0 && model.interpolator.isSeparable() && publicAPI.isPermutationMatrix(indexMatrix)) {
        model.usePermuteExecute = true;
        if (publicAPI.canUseNearestNeighbor(indexMatrix, outWholeExt)) {
          interpolationMode = InterpolationMode.NEAREST;
        }
      }
    }
    model.interpolator.setInterpolationMode(interpolationMode);
    let borderMode = ImageBorderMode.CLAMP;
    borderMode = model.wrap ? ImageBorderMode.REPEAT : borderMode;
    borderMode = model.mirror ? ImageBorderMode.MIRROR : borderMode;
    model.interpolator.setBorderMode(borderMode);
    const mintol = 7.62939453125e-6;
    const maxtol = 2.0 * 2147483647;
    let tol = 0.5 * model.border;
    tol = borderMode === ImageBorderMode.CLAMP ? tol : maxtol;
    tol = tol > mintol ? tol : mintol;
    model.interpolator.setTolerance(tol);
    model.interpolator.initialize(input);
    publicAPI.vtkImageResliceExecute(input, output);
    model.interpolator.releaseData();
    outData[0] = output;

    // console.timeEnd('reslice');
  };

  publicAPI.vtkImageResliceExecute = (input, output) => {
    // const outDims = output.getDimensions();
    const inScalars = input.getPointData().getScalars();
    const outScalars = output.getPointData().getScalars();
    let outPtr = outScalars.getData();
    const outExt = output.getExtent();
    const newmat = indexMatrix;

    // multiple samples for thick slabs
    const nsamples = Math.max(model.slabNumberOfSlices, 1);

    // spacing between slab samples (as a fraction of slice spacing).
    const slabSampleSpacing = model.slabSliceSpacingFraction;

    // check for perspective transformation
    const perspective = publicAPI.isPerspectiveMatrix(newmat);

    // extra scalar info for nearest-neighbor optimization
    let inPtr = inScalars.getData();
    const inputScalarSize = 1; // inScalars.getElementComponentSize(); // inScalars.getDataTypeSize();
    const inputScalarType = inScalars.getDataType();
    const inComponents = inScalars.getNumberOfComponents(); // interpolator.GetNumberOfComponents();
    const componentOffset = model.interpolator.getComponentOffset();
    const borderMode = model.interpolator.getBorderMode();
    const inDims = input.getDimensions();
    const inExt = [0, inDims[0] - 1, 0, inDims[1] - 1, 0, inDims[2] - 1]; // interpolator->GetExtent();
    const inInc = [0, 0, 0];
    inInc[0] = inScalars.getNumberOfComponents();
    inInc[1] = inInc[0] * inDims[0];
    inInc[2] = inInc[1] * inDims[1];
    const fullSize = inDims[0] * inDims[1] * inDims[2];
    if (componentOffset > 0 && componentOffset + inComponents < inInc[0]) {
      inPtr = inPtr.subarray(inputScalarSize * componentOffset);
    }
    let interpolationMode = InterpolationMode.NEAREST;
    if (model.interpolator.isA('vtkImageInterpolator')) {
      interpolationMode = model.interpolator.getInterpolationMode();
    }
    const convertScalars = null;
    const rescaleScalars = model.scalarShift !== 0.0 || model.scalarScale !== 1.0;

    // is nearest neighbor optimization possible?
    const optimizeNearest = interpolationMode === InterpolationMode.NEAREST && borderMode === ImageBorderMode.CLAMP && !(optimizedTransform != null || perspective || convertScalars != null || rescaleScalars) && inputScalarType === outScalars.getDataType() && fullSize === inScalars.getNumberOfTuples() && model.border === true && nsamples <= 1;

    // get pixel information
    const scalarType = outScalars.getDataType();
    const scalarSize = 1; // outScalars.getElementComponentSize() // outScalars.scalarSize;
    const outComponents = outScalars.getNumberOfComponents();

    // break matrix into a set of axes plus an origin
    // (this allows us to calculate the transform Incrementally)
    const xAxis = [0, 0, 0, 0];
    const yAxis = [0, 0, 0, 0];
    const zAxis = [0, 0, 0, 0];
    const origin = [0, 0, 0, 0];
    for (let i = 0; i < 4; ++i) {
      xAxis[i] = newmat[4 * 0 + i];
      yAxis[i] = newmat[4 * 1 + i];
      zAxis[i] = newmat[4 * 2 + i];
      origin[i] = newmat[4 * 3 + i];
    }

    // allocate an output row of type double
    let floatPtr = null;
    if (!optimizeNearest) {
      floatPtr = new Float64Array(inComponents * (outExt[1] - outExt[0] + nsamples));
    }
    const background = macros2.m.newTypedArray(inputScalarType, model.backgroundColor);

    // set color for area outside of input volume extent
    // void *background;
    // vtkAllocBackgroundPixel(&background,
    //    self->GetBackgroundColor(), scalarType, scalarSize, outComponents);

    // get various helper functions
    const forceClamping = interpolationMode > InterpolationMode.LINEAR || nsamples > 1 && model.slabMode === ImageReslice_SlabMode.SUM;
    const convertpixels = publicAPI.getConversionFunc(inputScalarType, scalarType, model.scalarShift, model.scalarScale, forceClamping);
    const setpixels = publicAPI.getSetPixelsFunc(scalarType, scalarSize, outComponents, outPtr);
    const composite = publicAPI.getCompositeFunc(model.slabMode, model.slabTrapezoidIntegration);

    // create some variables for when we march through the data
    let idY = outExt[2] - 1;
    let idZ = outExt[4] - 1;
    const inPoint0 = [0.0, 0.0, 0.0, 0.0];
    const inPoint1 = [0.0, 0.0, 0.0, 0.0];

    // create an iterator to march through the data
    const iter = vtkImagePointDataIterator$1.newInstance();
    iter.initialize(output, outExt, model.stencil, null);
    const outPtr0 = iter.getScalars(output, 0);
    let outPtrIndex = 0;
    const outTmp = macros2.m.newTypedArray(scalarType, BoundingBox/* default.getDiagonalLength */.Ay.getDiagonalLength(outExt) * outComponents * 2);
    const interpolatedPtr = new Float64Array(inComponents * nsamples);
    const interpolatedPoint = new Float64Array(inComponents);
    for (; !iter.isAtEnd(); iter.nextSpan()) {
      const span = iter.spanEndId() - iter.getId();
      outPtrIndex = iter.getId() * scalarSize * outComponents;
      if (!iter.isInStencil()) {
        // clear any regions that are outside the stencil
        const n = setpixels(outTmp, background, outComponents, span);
        for (let i = 0; i < n; ++i) {
          outPtr0[outPtrIndex++] = outTmp[i];
        }
      } else {
        // get output index, and compute position in input image
        const outIndex = iter.getIndex();

        // if Z index increased, then advance position along Z axis
        if (outIndex[2] > idZ) {
          idZ = outIndex[2];
          inPoint0[0] = origin[0] + idZ * zAxis[0];
          inPoint0[1] = origin[1] + idZ * zAxis[1];
          inPoint0[2] = origin[2] + idZ * zAxis[2];
          inPoint0[3] = origin[3] + idZ * zAxis[3];
          idY = outExt[2] - 1;
        }

        // if Y index increased, then advance position along Y axis
        if (outIndex[1] > idY) {
          idY = outIndex[1];
          inPoint1[0] = inPoint0[0] + idY * yAxis[0];
          inPoint1[1] = inPoint0[1] + idY * yAxis[1];
          inPoint1[2] = inPoint0[2] + idY * yAxis[2];
          inPoint1[3] = inPoint0[3] + idY * yAxis[3];
        }

        // march through one row of the output image
        const idXmin = outIndex[0];
        const idXmax = idXmin + span - 1;
        if (!optimizeNearest) {
          let wasInBounds = 1;
          let isInBounds = 1;
          let startIdX = idXmin;
          let idX = idXmin;
          const tmpPtr = floatPtr;
          let pixelIndex = 0;
          while (startIdX <= idXmax) {
            for (; idX <= idXmax && isInBounds === wasInBounds; idX++) {
              const inPoint2 = [inPoint1[0] + idX * xAxis[0], inPoint1[1] + idX * xAxis[1], inPoint1[2] + idX * xAxis[2], inPoint1[3] + idX * xAxis[3]];
              const inPoint3 = [0, 0, 0, 0];
              let inPoint = inPoint2;
              isInBounds = false;
              let interpolatedPtrIndex = 0;
              for (let sample = 0; sample < nsamples; ++sample) {
                if (nsamples > 1) {
                  let s = sample - 0.5 * (nsamples - 1);
                  s *= slabSampleSpacing;
                  inPoint3[0] = inPoint2[0] + s * zAxis[0];
                  inPoint3[1] = inPoint2[1] + s * zAxis[1];
                  inPoint3[2] = inPoint2[2] + s * zAxis[2];
                  inPoint3[3] = inPoint2[3] + s * zAxis[3];
                  inPoint = inPoint3;
                }
                if (perspective) {
                  // only do perspective if necessary
                  const f = 1 / inPoint[3];
                  inPoint[0] *= f;
                  inPoint[1] *= f;
                  inPoint[2] *= f;
                }
                if (optimizedTransform !== null) {
                  // get the input origin and spacing for conversion purposes
                  const inOrigin = model.interpolator.getOrigin();
                  const inSpacing = model.interpolator.getSpacing();
                  const inInvSpacing = [1.0 / inSpacing[0], 1.0 / inSpacing[1], 1.0 / inSpacing[2]];

                  // apply the AbstractTransform if there is one
                  // TBD: handle inDirection
                  publicAPI.applyTransform(optimizedTransform, inPoint, inOrigin, inInvSpacing);
                }
                if (model.interpolator.checkBoundsIJK(inPoint)) {
                  // do the interpolation
                  isInBounds = 1;
                  model.interpolator.interpolateIJK(inPoint, interpolatedPoint);
                  for (let i = 0; i < inComponents; ++i) {
                    interpolatedPtr[interpolatedPtrIndex++] = interpolatedPoint[i];
                  }
                }
              }
              if (interpolatedPtrIndex > inComponents) {
                composite(interpolatedPtr, inComponents, interpolatedPtrIndex / inComponents);
              }
              for (let i = 0; i < inComponents; ++i) {
                tmpPtr[pixelIndex++] = interpolatedPtr[i];
              }

              // set "was in" to "is in" if first pixel
              wasInBounds = idX > idXmin ? wasInBounds : isInBounds;
            }

            // write a segment to the output
            const endIdX = idX - 1 - (isInBounds !== wasInBounds);
            const numpixels = endIdX - startIdX + 1;
            let n = 0;
            if (wasInBounds) {
              if (rescaleScalars) {
                publicAPI.rescaleScalars(floatPtr, inComponents, idXmax - idXmin + 1, model.scalarShift, model.scalarScale);
              }
              {
                n = convertpixels(outTmp, floatPtr.subarray(startIdX * inComponents), outComponents, numpixels);
              }
            } else {
              n = setpixels(outTmp, background, outComponents, numpixels);
            }
            for (let i = 0; i < n; ++i) {
              outPtr0[outPtrIndex++] = outTmp[i];
            }
            startIdX += numpixels;
            wasInBounds = isInBounds;
          }
        } else {
          // optimize for nearest-neighbor interpolation
          const inPtrTmp0 = inPtr;
          const outPtrTmp = outPtr;
          const inIncX = inInc[0] * inputScalarSize;
          const inIncY = inInc[1] * inputScalarSize;
          const inIncZ = inInc[2] * inputScalarSize;
          const inExtX = inExt[1] - inExt[0] + 1;
          const inExtY = inExt[3] - inExt[2] + 1;
          const inExtZ = inExt[5] - inExt[4] + 1;
          let startIdX = idXmin;
          let endIdX = idXmin - 1;
          let isInBounds = false;
          const bytesPerPixel = inputScalarSize * inComponents;
          for (let iidX = idXmin; iidX <= idXmax; iidX++) {
            const inPoint = [inPoint1[0] + iidX * xAxis[0], inPoint1[1] + iidX * xAxis[1], inPoint1[2] + iidX * xAxis[2]];
            const inIdX = vtkInterpolationMathRound(inPoint[0]) - inExt[0];
            const inIdY = vtkInterpolationMathRound(inPoint[1]) - inExt[2];
            const inIdZ = vtkInterpolationMathRound(inPoint[2]) - inExt[4];
            if (inIdX >= 0 && inIdX < inExtX && inIdY >= 0 && inIdY < inExtY && inIdZ >= 0 && inIdZ < inExtZ) {
              if (!isInBounds) {
                // clear leading out-of-bounds pixels
                startIdX = iidX;
                isInBounds = true;
                const n = setpixels(outTmp, background, outComponents, startIdX - idXmin);
                for (let i = 0; i < n; ++i) {
                  outPtr0[outPtrIndex++] = outTmp[i];
                }
              }
              // set the final index that was within input bounds
              endIdX = iidX;

              // perform nearest-neighbor interpolation via pixel copy
              let offset = inIdX * inIncX + inIdY * inIncY + inIdZ * inIncZ;

              // when memcpy is used with a constant size, the compiler will
              // optimize away the function call and use the minimum number
              // of instructions necessary to perform the copy
              switch (bytesPerPixel) {
                case 1:
                  outPtr0[outPtrIndex++] = inPtrTmp0[offset];
                  break;
                case 2:
                case 3:
                case 4:
                case 8:
                case 12:
                case 16:
                  for (let i = 0; i < bytesPerPixel; ++i) {
                    outPtr0[outPtrIndex++] = inPtrTmp0[offset + i];
                  }
                  break;
                default:
                  {
                    // TODO: check bytes
                    let oc = 0;
                    do {
                      outPtr0[outPtrIndex++] = inPtrTmp0[offset++];
                    } while (++oc !== bytesPerPixel);
                    break;
                  }
              }
            } else if (isInBounds) {
              // leaving input bounds
              break;
            }
          }

          // clear trailing out-of-bounds pixels
          outPtr = outPtrTmp;
          const n = setpixels(outTmp, background, outComponents, idXmax - endIdX);
          for (let i = 0; i < n; ++i) {
            outPtr0[outPtrIndex++] = outTmp[i];
          }
        }
      }
    }
  };
  /**
   * The transform matrix supplied by the user converts output coordinates
   * to input coordinates.
   * To speed up the pixel lookup, the following function provides a
   * matrix which converts output pixel indices to input pixel indices.
   * This will also concatenate the ResliceAxes and the ResliceTransform
   * if possible (if the ResliceTransform is a 4x4 matrix transform).
   * If it does, this->OptimizedTransform will be set to nullptr, otherwise
   * this->OptimizedTransform will be equal to this->ResliceTransform.
   * @param {vtkImageData} input
   * @param {vtkImageData} output
   * @returns
   */
  publicAPI.getIndexMatrix = (input, output) => {
    const transform = esm/* mat4.identity */.pB.identity(new Float64Array(16));
    optimizedTransform = null;
    if (model.resliceAxes) {
      esm/* mat4.copy */.pB.copy(transform, model.resliceAxes);
    }
    if (model.resliceTransform) {
      if (model.resliceTransform.isA('vtkHomogeneousTransform')) {
        esm/* mat4.multiply */.pB.multiply(transform, model.resliceTransform.getMatrix(), transform);
      } else {
        // TODO
        (0,macros2.v)('Non homogeneous transform have not yet been ported');
      }
    }

    // the outMatrix takes OutputData indices to OutputData coordinates,
    const outMatrix = output.getIndexToWorld();
    esm/* mat4.multiply */.pB.multiply(transform, transform, outMatrix);

    // the inMatrix takes InputData coordinates to InputData indices
    // the optimizedTransform requires data coords, not index coords, as its input
    if (optimizedTransform == null) {
      const inMatrix = input.getWorldToIndex();
      esm/* mat4.multiply */.pB.multiply(transform, inMatrix, transform);
    }
    esm/* mat4.copy */.pB.copy(indexMatrix, transform);
    return indexMatrix;
  };
  publicAPI.getAutoCroppedOutputBounds = input => {
    const inOrigin = input.getOrigin();
    const inSpacing = input.getSpacing();
    const inDirection = input.getDirection();
    const dims = input.getDimensions();
    const inWholeExt = [0, dims[0] - 1, 0, dims[1] - 1, 0, dims[2] - 1];
    const matrix = new Float64Array(16);
    if (model.resliceAxes) {
      esm/* mat4.invert */.pB.invert(matrix, model.resliceAxes);
    } else {
      esm/* mat4.identity */.pB.identity(matrix);
    }
    let transform = null;
    if (model.resliceTransform) {
      transform = model.resliceTransform.getInverse();
    }
    let imageTransform = null;
    if (!Core_Math.b.isIdentity3x3(inDirection)) {
      imageTransform = MatrixBuilder/* default */.A.buildFromRadian().translate(inOrigin[0], inOrigin[1], inOrigin[2]).multiply3x3(inDirection).translate(-inOrigin[0], -inOrigin[1], -inOrigin[2]).invert().getMatrix();
    }
    const bounds = [Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE];
    const point = [0, 0, 0, 0];
    for (let i = 0; i < 8; ++i) {
      point[0] = inOrigin[0] + inWholeExt[i % 2] * inSpacing[0];
      point[1] = inOrigin[1] + inWholeExt[2 + Math.floor(i / 2) % 2] * inSpacing[1];
      point[2] = inOrigin[2] + inWholeExt[4 + Math.floor(i / 4) % 2] * inSpacing[2];
      point[3] = 1.0;
      if (imageTransform) {
        esm/* vec4.transformMat4 */.ln.transformMat4(point, point, imageTransform);
      }
      if (model.resliceTransform) {
        transform.transformPoint(point, point);
      }
      esm/* vec4.transformMat4 */.ln.transformMat4(point, point, matrix);
      const f = 1.0 / point[3];
      point[0] *= f;
      point[1] *= f;
      point[2] *= f;
      for (let j = 0; j < 3; ++j) {
        if (point[j] > bounds[2 * j + 1]) {
          bounds[2 * j + 1] = point[j];
        }
        if (point[j] < bounds[2 * j]) {
          bounds[2 * j] = point[j];
        }
      }
    }
    return bounds;
  };
  publicAPI.getDataTypeMinMax = dataType => {
    switch (dataType) {
      case 'Int8Array':
        return {
          min: -128,
          max: 127
        };
      case 'Int16Array':
        return {
          min: -32768,
          max: 32767
        };
      case 'Uint16Array':
        return {
          min: 0,
          max: 65535
        };
      case 'Int32Array':
        return {
          min: -2147483648,
          max: 2147483647
        };
      case 'Uint32Array':
        return {
          min: 0,
          max: 4294967295
        };
      case 'Float32Array':
        return {
          min: -1.2e38,
          max: 1.2e38
        };
      case 'Float64Array':
        return {
          min: -1.2e38,
          max: 1.2e38
        };
      case 'Uint8Array':
      case 'Uint8ClampedArray':
      default:
        return {
          min: 0,
          max: 255
        };
    }
  };
  publicAPI.clamp = (outPtr, inPtr, numscalars, n, min, max) => {
    const count = n * numscalars;
    for (let i = 0; i < count; ++i) {
      outPtr[i] = vtkInterpolationMathClamp(inPtr[i], min, max);
    }
    return count;
  };
  publicAPI.convert = (outPtr, inPtr, numscalars, n) => {
    const count = n * numscalars;
    for (let i = 0; i < count; ++i) {
      outPtr[i] = Math.round(inPtr[i]);
    }
    return count;
  };
  publicAPI.getConversionFunc = (inputType, dataType, scalarShift, scalarScale, forceClamping) => {
    let useClamping = forceClamping;
    if (dataType !== Constants/* VtkDataTypes */.JA.FLOAT && dataType !== Constants/* VtkDataTypes */.JA.DOUBLE && !forceClamping) {
      const inMinMax = publicAPI.getDataTypeMinMax(inputType);
      let checkMin = (inMinMax.min + scalarShift) * scalarScale;
      let checkMax = (inMinMax.max + scalarShift) * scalarScale;
      const outMinMax = publicAPI.getDataTypeMinMax(dataType);
      const outputMin = outMinMax.min;
      const outputMax = outMinMax.max;
      if (checkMin > checkMax) {
        const tmp = checkMax;
        checkMax = checkMin;
        checkMin = tmp;
      }
      useClamping = checkMin < outputMin || checkMax > outputMax;
    }
    if (useClamping && dataType !== Constants/* VtkDataTypes */.JA.FLOAT && dataType !== Constants/* VtkDataTypes */.JA.DOUBLE) {
      const minMax = publicAPI.getDataTypeMinMax(dataType);
      const clamp = (outPtr, inPtr, numscalars, n) => publicAPI.clamp(outPtr, inPtr, numscalars, n, minMax.min, minMax.max);
      return clamp;
    }
    return publicAPI.convert;
  };
  publicAPI.set = (outPtr, inPtr, numscalars, n) => {
    const count = numscalars * n;
    for (let i = 0; i < n; ++i) {
      outPtr[i] = inPtr[i];
    }
    return count;
  };
  publicAPI.set1 = (outPtr, inPtr, numscalars, n) => {
    outPtr.fill(inPtr[0], 0, n);
    return n;
  };
  publicAPI.getSetPixelsFunc = (dataType, dataSize, numscalars, dataPtr) => numscalars === 1 ? publicAPI.set1 : publicAPI.set;
  publicAPI.getCompositeFunc = (slabMode, slabTrapezoidIntegration) => {
    let composite = null;
    // eslint-disable-next-line default-case
    switch (slabMode) {
      case ImageReslice_SlabMode.MIN:
        composite = getImageResliceCompositeMinValue;
        break;
      case ImageReslice_SlabMode.MAX:
        composite = getImageResliceCompositeMaxValue;
        break;
      case ImageReslice_SlabMode.MEAN:
        if (slabTrapezoidIntegration) {
          composite = getImageResliceCompositeMeanTrap;
        } else {
          composite = getImageResliceCompositeMeanValue;
        }
        break;
      case ImageReslice_SlabMode.SUM:
        if (slabTrapezoidIntegration) {
          composite = getImageResliceCompositeSumTrap;
        } else {
          composite = getImageResliceCompositeSumValue;
        }
        break;
    }
    return composite;
  };
  publicAPI.applyTransform = (newTrans, inPoint, inOrigin, inInvSpacing) => {
    inPoint[3] = 1;
    esm/* vec4.transformMat4 */.ln.transformMat4(inPoint, inPoint, newTrans);
    inPoint[0] -= inOrigin[0];
    inPoint[1] -= inOrigin[1];
    inPoint[2] -= inOrigin[2];
    inPoint[0] *= inInvSpacing[0];
    inPoint[1] *= inInvSpacing[1];
    inPoint[2] *= inInvSpacing[2];
  };
  publicAPI.rescaleScalars = (floatData, components, n, scalarShift, scalarScale) => {
    const m = n * components;
    for (let i = 0; i < m; ++i) {
      floatData[i] = (floatData[i] + scalarShift) * scalarScale;
    }
  };
  publicAPI.isPermutationMatrix = matrix => {
    for (let i = 0; i < 3; i++) {
      if (matrix[4 * i + 3] !== 0) {
        return false;
      }
    }
    if (matrix[4 * 3 + 3] !== 1) {
      return false;
    }
    for (let j = 0; j < 3; j++) {
      let k = 0;
      for (let i = 0; i < 3; i++) {
        if (matrix[4 * j + i] !== 0) {
          k++;
        }
      }
      if (k !== 1) {
        return false;
      }
    }
    return true;
  };

  // TODO: to move in vtkMath and add tolerance
  publicAPI.isIdentityMatrix = matrix => {
    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        if ((i === j ? 1.0 : 0.0) !== matrix[4 * j + i]) {
          return false;
        }
      }
    }
    return true;
  };
  publicAPI.isPerspectiveMatrix = matrix => matrix[4 * 0 + 3] !== 0 || matrix[4 * 1 + 3] !== 0 || matrix[4 * 2 + 3] !== 0 || matrix[4 * 3 + 3] !== 1;
  publicAPI.canUseNearestNeighbor = (matrix, outExt) => {
    // loop through dimensions
    for (let i = 0; i < 3; i++) {
      let j;
      for (j = 0; j < 3; j++) {
        if (matrix[4 * j + i] !== 0) {
          break;
        }
      }
      if (j >= 3) {
        return false;
      }
      let x = matrix[4 * j + i];
      let y = matrix[4 * 3 + i];
      if (outExt[2 * j] === outExt[2 * j + 1]) {
        y += x * outExt[2 * i];
        x = 0;
      }
      const fx = vtkInterpolationMathFloor(x).error;
      const fy = vtkInterpolationMathFloor(y).error;
      if (fx !== 0 || fy !== 0) {
        return false;
      }
    }
    return true;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const ImageReslice_DEFAULT_VALUES = {
  transformInputSampling: true,
  autoCropOutput: false,
  outputDimensionality: 3,
  outputSpacing: null,
  // automatically computed if null
  outputOrigin: null,
  // automatically computed if null
  outputDirection: null,
  // identity if null
  outputExtent: null,
  // automatically computed if null
  outputScalarType: null,
  wrap: false,
  // don't wrap
  mirror: false,
  // don't mirror
  border: true,
  // apply a border
  interpolationMode: InterpolationMode.NEAREST,
  // only NEAREST supported so far
  slabMode: ImageReslice_SlabMode.MIN,
  slabTrapezoidIntegration: false,
  slabNumberOfSlices: 1,
  slabSliceSpacingFraction: 1,
  optimization: false,
  // not supported yet
  scalarShift: 0,
  // for rescaling the data
  scalarScale: 1,
  backgroundColor: [0, 0, 0, 0],
  resliceAxes: null,
  // resliceTransform: null,
  interpolator: vtkImageInterpolator$1.newInstance(),
  usePermuteExecute: false // no supported yet
};

// ----------------------------------------------------------------------------

function ImageReslice_extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, ImageReslice_DEFAULT_VALUES, initialValues);

  // Make this a VTK object
  macros2.m.obj(publicAPI, model);

  // Also make it an algorithm with one input and one output
  macros2.m.algo(publicAPI, model, 1, 1);
  macros2.m.setGet(publicAPI, model, ['outputDimensionality', 'outputScalarType', 'scalarShift', 'scalarScale', 'transformInputSampling', 'autoCropOutput', 'wrap', 'mirror', 'border', 'interpolationMode', 'resliceTransform', 'slabMode', 'slabTrapezoidIntegration', 'slabNumberOfSlices', 'slabSliceSpacingFraction']);
  macros2.m.setGetArray(publicAPI, model, ['outputOrigin', 'outputSpacing'], 3);
  macros2.m.setGetArray(publicAPI, model, ['outputExtent'], 6);
  macros2.m.setGetArray(publicAPI, model, ['outputDirection'], 9);
  macros2.m.setGetArray(publicAPI, model, ['backgroundColor'], 4);
  macros2.m.get(publicAPI, model, ['resliceAxes']);

  // Object specific methods
  vtkImageReslice(publicAPI, model);
}

// ----------------------------------------------------------------------------

const ImageReslice_newInstance = macros2.m.newInstance(ImageReslice_extend, 'vtkImageReslice');

// ----------------------------------------------------------------------------

var vtkImageReslice$1 = {
  newInstance: ImageReslice_newInstance,
  extend: ImageReslice_extend,
  ...ImageReslice_Constants_Constants
};




/***/ }

}]);