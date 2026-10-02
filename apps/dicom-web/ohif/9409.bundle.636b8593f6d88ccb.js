"use strict";
(globalThis["rspackChunk"] = globalThis["rspackChunk"] || []).push([[9409], {
21399(__unused_rspack_module, exports) {

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

},
97071(__unused_rspack_module, exports, __webpack_require__) {

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
const fflate = __importStar(__webpack_require__(64831));
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

},
24960(__unused_rspack_module, exports, __webpack_require__) {
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

},
35961(__unused_rspack_module, exports, __webpack_require__) {
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

},
6637(__unused_rspack_module, exports, __webpack_require__) {

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

},
64831(__unused_rspack_module, exports) {

// DEFLATE is a complex format; to read this code, you should probably check the RFC first:
// https://tools.ietf.org/html/rfc1951
// You may also wish to take a look at the guide I made about this program:
// https://gist.github.com/101arrowz/253f31eb5abc3d9275ab943003ffecad
exports.deflate = deflate;
exports.deflateSync = deflateSync;
exports.inflate = inflate;
exports.inflateSync = inflateSync;
exports.gzip = gzip;
exports.compress = gzip;
exports.gzipSync = gzipSync;
exports.compressSync = gzipSync;
exports.gunzip = gunzip;
exports.gunzipSync = gunzipSync;
exports.zlib = zlib;
exports.zlibSync = zlibSync;
exports.unzlib = unzlib;
exports.unzlibSync = unzlibSync;
exports.gzip = gzip;
exports.compress = gzip;
exports.decompress = decompress;
exports.decompressSync = decompressSync;
exports.strToU8 = strToU8;
exports.strFromU8 = strFromU8;
exports.zip = zip;
exports.zipSync = zipSync;
exports.unzip = unzip;
exports.unzipSync = unzipSync;
// Some of the following code is similar to that of UZIP.js:
// https://github.com/photopea/UZIP.js
// However, the vast majority of the codebase has diverged from UZIP.js to increase performance and reduce bundle size.
// Sometimes 0 will appear where -1 would be more appropriate. This is because using a uint
// is better for memory in most engines (I *think*).
var ch2 = {};
var node_worker_1 = {};
node_worker_1["default"] = (function (c, id, msg, transfer, cb) {
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

// aliases for shorter compressed code (most minifers don't do this)
var u8 = Uint8Array, u16 = Uint16Array, i32 = Int32Array;
// fixed length extra bits
var fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, /* unused */ 0, 0, /* impossible */ 0]);
// fixed distance extra bits
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
    var r = new i32(b[30]);
    for (var i = 1; i < 30; ++i) {
        for (var j = b[i]; j < b[i + 1]; ++j) {
            r[j] = ((j - b[i]) << 5) | i;
        }
    }
    return { b: b, r: r };
};
var _a = freb(fleb, 2), fl = _a.b, revfl = _a.r;
// we can ignore the fact that the other numbers are wrong; they never happen anyway
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0), fd = _b.b, revfd = _b.r;
// map of value to reverse (assuming 16 bits)
var rev = new u16(32768);
for (var i = 0; i < 32768; ++i) {
    // reverse table algorithm from SO
    var x = ((i & 0xAAAA) >> 1) | ((i & 0x5555) << 1);
    x = ((x & 0xCCCC) >> 2) | ((x & 0x3333) << 2);
    x = ((x & 0xF0F0) >> 4) | ((x & 0x0F0F) << 4);
    rev[i] = (((x & 0xFF00) >> 8) | ((x & 0x00FF) << 8)) >> 1;
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
    for (i = 1; i < mb; ++i) {
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
                    co[rev[v] >> rvb] = sv;
                }
            }
        }
    }
    else {
        co = new u16(s);
        for (i = 0; i < s; ++i) {
            if (cd[i]) {
                co[i] = rev[le[cd[i] - 1]++] >> (15 - cd[i]);
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
    return new u8(v.subarray(s, e));
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
    , // determined by compression function
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
var inflt = function (dat, st, buf, dict) {
    // source length       dict length
    var sl = dat.length, dl = dict ? dict.length : 0;
    if (!sl || st.f && !st.l)
        return buf || new u8(0);
    var noBuf = !buf;
    // have to estimate size
    var resize = noBuf || st.i != 2;
    // no state
    var noSt = st.i;
    // Assumes roughly 33% compression ratio average
    if (noBuf)
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
                if (resize)
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
                    var s = r >> 4;
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
        // Maximum chunk size (practically, theoretically infinite) is 2^17
        if (resize)
            cbuf(bt + 131072);
        var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
        var lpos = pos;
        for (;; lpos = pos) {
            // bits read, code
            var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
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
                var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
                if (!d)
                    err(3);
                pos += d & 15;
                var dt = fd[dsym];
                if (dsym > 3) {
                    var b = fdeb[dsym];
                    dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
                }
                if (pos > tbts) {
                    if (noSt)
                        err(0);
                    break;
                }
                if (resize)
                    cbuf(bt + 131072);
                var end = bt + add;
                if (bt < dt) {
                    var shift = dl - dt, dend = Math.min(dt, end);
                    if (shift + bt < 0)
                        err(3);
                    for (; bt < dend; ++bt)
                        buf[bt] = dict[shift + bt];
                }
                for (; bt < end; ++bt)
                    buf[bt] = buf[bt - dt];
            }
        }
        st.l = lm, st.p = lpos, st.b = bt, st.f = final;
        if (lm)
            final = 1, st.m = lbt, st.d = dm, st.n = dbt;
    } while (!final);
    // don't reallocate for streams or user buffers
    return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
};
// starting at p, write the minimum number of bits that can hold v to d
var wbits = function (d, p, v) {
    v <<= p & 7;
    var o = (p / 8) | 0;
    d[o] |= v;
    d[o + 1] |= v >> 8;
};
// starting at p, write the minimum number of bits (>8) that can hold v to d
var wbits16 = function (d, p, v) {
    v <<= p & 7;
    var o = (p / 8) | 0;
    d[o] |= v;
    d[o + 1] |= v >> 8;
    d[o + 2] |= v >> 16;
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
        return { t: et, l: 0 };
    if (s == 1) {
        var v = new u8(t[0].s + 1);
        v[t[0].s] = 1;
        return { t: v, l: 1 };
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
        dt >>= lft;
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
    return { t: new u8(tr), l: mbt };
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
    return { c: cl.subarray(0, cli), n: s };
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
    out[o + 1] = s >> 8;
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
    var _a = hTree(lf, 15), dlt = _a.t, mlb = _a.l;
    var _b = hTree(df, 15), ddt = _b.t, mdb = _b.l;
    var _c = lc(dlt), lclt = _c.c, nlc = _c.n;
    var _d = lc(ddt), lcdt = _d.c, ndc = _d.n;
    var lcfreq = new u16(19);
    for (var i = 0; i < lclt.length; ++i)
        ++lcfreq[lclt[i] & 31];
    for (var i = 0; i < lcdt.length; ++i)
        ++lcfreq[lcdt[i] & 31];
    var _e = hTree(lcfreq, 7), lct = _e.t, mlcb = _e.l;
    var nlcc = 19;
    for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
        ;
    var flen = (bl + 5) << 3;
    var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
    var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
    if (bs >= 0 && flen <= ftlen && flen <= dtlen)
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
                    wbits(out, p, (clct[i] >> 5) & 127), p += clct[i] >> 12;
            }
        }
    }
    else {
        lm = flm, ll = flt, dm = fdm, dl = fdt;
    }
    for (var i = 0; i < li; ++i) {
        var sym = syms[i];
        if (sym > 255) {
            var len = (sym >> 18) & 31;
            wbits16(out, p, lm[len + 257]), p += ll[len + 257];
            if (len > 7)
                wbits(out, p, (sym >> 23) & 31), p += fleb[len];
            var dst = sym & 31;
            wbits16(out, p, dm[dst]), p += dl[dst];
            if (dst > 3)
                wbits16(out, p, (sym >> 5) & 8191), p += fdeb[dst];
        }
        else {
            wbits16(out, p, lm[sym]), p += ll[sym];
        }
    }
    wbits16(out, p, lm[256]);
    return p + ll[256];
};
// deflate options (nice << 13) | chain
var deo = /*#__PURE__*/ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
// empty
var et = /*#__PURE__*/ new u8(0);
// compresses data into a raw DEFLATE buffer
var dflt = function (dat, lvl, plvl, pre, post, st) {
    var s = st.z || dat.length;
    var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7000)) + post);
    // writing to this writes to the output buffer
    var w = o.subarray(pre, o.length - post);
    var lst = st.l;
    var pos = (st.r || 0) & 7;
    if (lvl) {
        if (pos)
            w[0] = st.r >> 3;
        var opt = deo[lvl - 1];
        var n = opt >> 13, c = opt & 8191;
        var msk_1 = (1 << plvl) - 1;
        //    prev 2-byte val map    curr 2-byte val map
        var prev = st.p || new u16(32768), head = st.h || new u16(msk_1 + 1);
        var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
        var hsh = function (i) { return (dat[i] ^ (dat[i + 1] << bs1_1) ^ (dat[i + 2] << bs2_1)) & msk_1; };
        // 24576 is an arbitrary number of maximum symbols per block
        // 424 buffer for last block
        var syms = new i32(25000);
        // length/literal freq   distance freq
        var lf = new u16(288), df = new u16(32);
        //  l/lcnt  exbits  index          l/lind  waitdx          blkpos
        var lc_1 = 0, eb = 0, i = st.i || 0, li = 0, wi = st.w || 0, bs = 0;
        for (; i + 2 < s; ++i) {
            // hash value
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
                if ((lc_1 > 7000 || li > 24576) && (rem > 423 || !lst)) {
                    pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i - bs, pos);
                    li = lc_1 = eb = 0, bs = i;
                    for (var j = 0; j < 286; ++j)
                        lf[j] = 0;
                    for (var j = 0; j < 30; ++j)
                        df[j] = 0;
                }
                //  len    dist   chain
                var l = 2, d = 0, ch_1 = c, dif = imod - pimod & 32767;
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
                                    var ti = i - dif + j & 32767;
                                    var pti = prev[ti];
                                    var cd = ti - pti & 32767;
                                    if (cd > md)
                                        md = cd, pimod = ti;
                                }
                            }
                        }
                        // check the previous match
                        imod = pimod, pimod = prev[imod];
                        dif += imod - pimod & 32767;
                    }
                }
                // d will be nonzero only when a match was found
                if (d) {
                    // store both dist and len data in one int32
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
        for (i = Math.max(i, wi); i < s; ++i) {
            syms[li++] = dat[i];
            ++lf[dat[i]];
        }
        pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i - bs, pos);
        if (!lst) {
            st.r = (pos & 7) | w[(pos / 8) | 0] << 3;
            // shft(pos) now 1 less if pos & 7 != 0
            pos -= 7;
            st.h = head, st.p = prev, st.i = i, st.w = wi;
        }
    }
    else {
        for (var i = st.w || 0; i < s + lst; i += 65535) {
            // end
            var e = i + 65535;
            if (e >= s) {
                // write final block
                w[(pos / 8) | 0] = lst;
                e = s;
            }
            pos = wfblk(w, pos + 1, dat.subarray(i, e));
        }
        st.i = s;
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
// Adler32
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
            return (a & 255) << 24 | (a & 0xFF00) << 8 | (b & 255) << 8 | (b >> 8);
        }
    };
};
;
// deflate with opts
var dopt = function (dat, opt, pre, post, st) {
    if (!st) {
        st = { l: 1 };
        if (opt.dictionary) {
            var dict = opt.dictionary.subarray(-32768);
            var newDat = new u8(dict.length + dat.length);
            newDat.set(dict);
            newDat.set(dat, dict.length);
            dat = newDat;
            st.w = dict.length;
        }
    }
    return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? (st.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 20) : (12 + opt.mem), pre, post, st);
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
    return fnStr;
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
    if (!ch[id]) {
        var fnStr = '', td_1 = {}, m = fns.length - 1;
        for (var i = 0; i < m; ++i)
            fnStr = wcln(fns[i], fnStr, td_1);
        ch[id] = { c: wcln(fns[m], fnStr, td_1), e: td_1 };
    }
    var td = mrg({}, ch[id].e);
    return (0, node_worker_1.default)(ch[id].c + ';onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=' + init.toString() + '}', id, td, cbfs(td), cb);
};
// base async inflate fn
var bInflt = function () { return [u8, u16, i32, fleb, fdeb, clim, fl, fd, flrm, fdrm, rev, ec, hMap, max, bits, bits16, shft, slc, err, inflt, inflateSync, pbf, gopt]; };
var bDflt = function () { return [u8, u16, i32, fleb, fdeb, clim, revfl, revfd, flm, flt, fdm, fdt, rev, deo, et, hMap, wbits, wbits16, hTree, ln, lc, clen, wfblk, wblk, shft, slc, dflt, dopt, deflateSync, pbf]; };
// gzip extra
var gze = function () { return [gzh, gzhl, wbytes, crc, crct]; };
// gunzip extra
var guze = function () { return [gzs, gzl]; };
// zlib extra
var zle = function () { return [zlh, wbytes, adler]; };
// unzlib extra
var zule = function () { return [zls]; };
// post buf
var pbf = function (msg) { return postMessage(msg, [msg.buffer]); };
// get opts
var gopt = function (o) { return o && {
    out: o.size && new u8(o.size),
    dictionary: o.dictionary
}; };
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
    return function (ev) {
        if (ev.data[0]) {
            strm.push(ev.data[0], ev.data[1]);
            postMessage([ev.data[0].length]);
        }
        else
            strm.flush(ev.data[1]);
    };
};
// async stream attach
var astrmify = function (fns, strm, opts, init, id, flush, ext) {
    var t;
    var w = wrkr(fns, init, id, function (err, dat) {
        if (err)
            w.terminate(), strm.ondata.call(strm, err);
        else if (!Array.isArray(dat))
            ext(dat);
        else if (dat.length == 1) {
            strm.queuedSize -= dat[0];
            if (strm.ondrain)
                strm.ondrain(dat[0]);
        }
        else {
            if (dat[1])
                w.terminate();
            strm.ondata.call(strm, err, dat[0], dat[1]);
        }
    });
    w.postMessage(opts);
    strm.queuedSize = 0;
    strm.push = function (d, f) {
        if (!strm.ondata)
            err(5);
        if (t)
            strm.ondata(err(4, 0, 1), null, !!f);
        strm.queuedSize += d.length;
        // can fail for cross-realm Uint8Array, but ok - only a small performance penalty
        w.postMessage([d, t = f], d.buffer instanceof ArrayBuffer ? [d.buffer] : []);
    };
    strm.terminate = function () { w.terminate(); };
    if (flush) {
        strm.flush = function (sync) { w.postMessage([0, sync]); };
    }
};
// read 2 bytes
var b2 = function (d, b) { return d[b] | (d[b + 1] << 8); };
// read 4 bytes
var b4 = function (d, b) { return (d[b] | (d[b + 1] << 8) | (d[b + 2] << 16) | (d[b + 3] << 24)) >>> 0; };
// read 8 bytes
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
        st += (d[10] | d[11] << 8) + 2;
    for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d[st++])
        ;
    return st + (flg & 2);
};
// gzip length
var gzl = function (d) {
    var l = d.length;
    return (d[l - 4] | d[l - 3] << 8 | d[l - 2] << 16 | d[l - 1] << 24) >>> 0;
};
// gzip header length
var gzhl = function (o) { return 10 + (o.filename ? o.filename.length + 1 : 0); };
// zlib header
var zlh = function (c, o) {
    var lv = o.level, fl = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2;
    c[0] = 120, c[1] = (fl << 6) | (o.dictionary && 32);
    c[1] |= 31 - ((c[0] << 8) | c[1]) % 31;
    if (o.dictionary) {
        var h = adler();
        h.p(o.dictionary);
        wbytes(c, 2, h.d());
    }
};
// zlib start
var zls = function (d, dict) {
    if ((d[0] & 15) != 8 || (d[0] >> 4) > 7 || ((d[0] << 8 | d[1]) % 31))
        err(6, 'invalid zlib data');
    if ((d[1] >> 5 & 1) == +!dict)
        err(6, 'invalid zlib data: ' + (d[1] & 32 ? 'need' : 'unexpected') + ' dictionary');
    return (d[1] >> 3 & 4) + 2;
};
function StrmOpt(opts, cb) {
    if (typeof opts == 'function')
        cb = opts, opts = {};
    this.ondata = cb;
    return opts;
}
/**
 * Streaming DEFLATE compression
 */
var Deflate = /*#__PURE__*/ (function () {
    function Deflate(opts, cb) {
        if (typeof opts == 'function')
            cb = opts, opts = {};
        this.ondata = cb;
        this.o = opts || {};
        this.s = { l: 0, i: 32768, w: 32768, z: 32768 };
        // Buffer length must always be 0 mod 32768 for index calculations to be correct when modifying head and prev
        // 98304 = 32768 (lookback) + 65536 (common chunk size)
        this.b = new u8(98304);
        if (this.o.dictionary) {
            var dict = this.o.dictionary.subarray(-32768);
            this.b.set(dict, 32768 - dict.length);
            this.s.i = 32768 - dict.length;
        }
    }
    Deflate.prototype.p = function (c, f) {
        this.ondata(dopt(c, this.o, 0, 0, this.s), f);
    };
    /**
     * Pushes a chunk to be deflated
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Deflate.prototype.push = function (chunk, final) {
        if (!this.ondata)
            err(5);
        if (this.s.l)
            err(4);
        var endLen = chunk.length + this.s.z;
        if (endLen > this.b.length) {
            if (endLen > 2 * this.b.length - 32768) {
                var newBuf = new u8(endLen & -32768);
                newBuf.set(this.b.subarray(0, this.s.z));
                this.b = newBuf;
            }
            var split = this.b.length - this.s.z;
            this.b.set(chunk.subarray(0, split), this.s.z);
            this.s.z = this.b.length;
            this.p(this.b, false);
            this.b.set(this.b.subarray(-32768));
            this.b.set(chunk.subarray(split), 32768);
            this.s.z = chunk.length - split + 32768;
            this.s.i = 32766, this.s.w = 32768;
        }
        else {
            this.b.set(chunk, this.s.z);
            this.s.z += chunk.length;
        }
        this.s.l = final & 1;
        if (this.s.z > this.s.w + 8191 || final) {
            this.p(this.b, final || false);
            this.s.w = this.s.i, this.s.i -= 2;
        }
        if (final) {
            // cleanup unneeded buffers/state to reduce memory usage
            this.s = this.o = {};
            this.b = et;
        }
    };
    /**
     * Flushes buffered uncompressed data. Useful to immediately retrieve the
     * deflated output for small inputs.
     * @param sync Whether to flush to a byte boundary. A sync flush takes 4-5
     *             extra bytes, but guarantees all pushed data is immediately
     *             decompressible. A separate DEFLATE stream may be concatenated
     *             with the current output after a sync flush.
     */
    Deflate.prototype.flush = function (sync) {
        if (!this.ondata)
            err(5);
        if (this.s.l)
            err(4);
        this.p(this.b, false);
        this.s.w = this.s.i, this.s.i -= 2;
        // could technically skip writing the type-0 block for (this.s.r & 7) == 0,
        // but the deterministic trailer (00 00 FF FF) is useful in some situations
        if (sync) {
            var c = new u8(6);
            c[0] = this.s.r >> 3;
            // write empty, non-final type-0 block
            var ep = wfblk(c, this.s.r, et);
            this.s.r = 0;
            this.ondata(c.subarray(0, ep >> 3), false);
        }
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
        ], this, StrmOpt.call(this, opts, cb), function (ev) {
            var strm = new Deflate(ev.data);
            onmessage = astrm(strm);
        }, 6, 1);
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
/**
 * Compresses data with DEFLATE without any wrapper
 * @param data The data to compress
 * @param opts The compression options
 * @returns The deflated version of the data
 */
function deflateSync(data, opts) {
    return dopt(data, opts || {}, 0, 0);
}
/**
 * Streaming DEFLATE decompression
 */
var Inflate = /*#__PURE__*/ (function () {
    function Inflate(opts, cb) {
        // no StrmOpt here to avoid adding to workerizer
        if (typeof opts == 'function')
            cb = opts, opts = {};
        this.ondata = cb;
        var dict = opts && opts.dictionary && opts.dictionary.subarray(-32768);
        this.s = { i: 0, b: dict ? dict.length : 0 };
        this.o = new u8(32768);
        this.p = new u8(0);
        if (dict)
            this.o.set(dict);
    }
    Inflate.prototype.e = function (c) {
        if (!this.ondata)
            err(5);
        if (this.d)
            err(4);
        if (!this.p.length)
            this.p = c;
        else if (c.length) {
            var n = new u8(this.p.length + c.length);
            n.set(this.p), n.set(c, this.p.length), this.p = n;
        }
    };
    Inflate.prototype.c = function (final) {
        this.s.i = +(this.d = final || false);
        var bts = this.s.b;
        var dt = inflt(this.p, this.s, this.o);
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
    function AsyncInflate(opts, cb) {
        astrmify([
            bInflt,
            function () { return [astrm, Inflate]; }
        ], this, StrmOpt.call(this, opts, cb), function (ev) {
            var strm = new Inflate(ev.data);
            onmessage = astrm(strm);
        }, 7, 0);
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
    ], function (ev) { return pbf(inflateSync(ev.data[0], gopt(ev.data[1]))); }, 1, cb);
}
function inflateSync(data, opts) {
    return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
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
        this.c.p(chunk);
        this.l += chunk.length;
        Deflate.prototype.push.call(this, chunk, final);
    };
    Gzip.prototype.p = function (c, f) {
        var raw = dopt(c, this.o, this.v && gzhl(this.o), f && 8, this.s);
        if (this.v)
            gzh(raw, this.o), this.v = 0;
        if (f)
            wbytes(raw, raw.length - 8, this.c.d()), wbytes(raw, raw.length - 4, this.l);
        this.ondata(raw, f);
    };
    /**
     * Flushes buffered uncompressed data. Useful to immediately retrieve the
     * GZIPped output for small inputs.
     * @param sync Whether to flush to a byte boundary. A sync flush takes 4-5
     *             extra bytes, but guarantees all pushed data is immediately
     *             decompressible.
     */
    Gzip.prototype.flush = function (sync) {
        Deflate.prototype.flush.call(this, sync);
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
        ], this, StrmOpt.call(this, opts, cb), function (ev) {
            var strm = new Gzip(ev.data);
            onmessage = astrm(strm);
        }, 8, 1);
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
/**
 * Streaming single or multi-member GZIP decompression
 */
var Gunzip = /*#__PURE__*/ (function () {
    function Gunzip(opts, cb) {
        this.v = 1;
        this.r = 0;
        Inflate.call(this, opts, cb);
    }
    /**
     * Pushes a chunk to be GUNZIPped
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Gunzip.prototype.push = function (chunk, final) {
        Inflate.prototype.e.call(this, chunk);
        this.r += chunk.length;
        if (this.v) {
            var p = this.p.subarray(this.v - 1);
            var s = p.length > 3 ? gzs(p) : 4;
            if (s > p.length) {
                if (!final)
                    return;
            }
            else if (this.v > 1 && this.onmember) {
                this.onmember(this.r - p.length);
            }
            this.p = p.subarray(s), this.v = 0;
        }
        // necessary to prevent TS from using the closure value
        // This allows for workerization to function correctly
        Inflate.prototype.c.call(this, 0);
        // process concatenated GZIP
        if (this.s.f && !this.s.l) {
            this.v = shft(this.s.p) + 9;
            this.s = { i: 0 };
            this.o = new u8(0);
            this.push(new u8(0), final);
        }
        else if (final) {
            Inflate.prototype.c.call(this, final);
        }
    };
    return Gunzip;
}());
exports.Gunzip = Gunzip;
/**
 * Asynchronous streaming single or multi-member GZIP decompression
 */
var AsyncGunzip = /*#__PURE__*/ (function () {
    function AsyncGunzip(opts, cb) {
        var _this = this;
        astrmify([
            bInflt,
            guze,
            function () { return [astrm, Inflate, Gunzip]; }
        ], this, StrmOpt.call(this, opts, cb), function (ev) {
            var strm = new Gunzip(ev.data);
            strm.onmember = function (offset) { return postMessage(offset); };
            onmessage = astrm(strm);
        }, 9, 0, function (offset) { return _this.onmember && _this.onmember(offset); });
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
    ], function (ev) { return pbf(gunzipSync(ev.data[0], ev.data[1])); }, 3, cb);
}
function gunzipSync(data, opts) {
    var st = gzs(data);
    if (st + 8 > data.length)
        err(6, 'invalid gzip data');
    return inflt(data.subarray(st, -8), { i: 2 }, opts && opts.out || new u8(gzl(data)), opts && opts.dictionary);
}
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
        this.c.p(chunk);
        Deflate.prototype.push.call(this, chunk, final);
    };
    Zlib.prototype.p = function (c, f) {
        var raw = dopt(c, this.o, this.v && (this.o.dictionary ? 6 : 2), f && 4, this.s);
        if (this.v)
            zlh(raw, this.o), this.v = 0;
        if (f)
            wbytes(raw, raw.length - 4, this.c.d());
        this.ondata(raw, f);
    };
    /**
     * Flushes buffered uncompressed data. Useful to immediately retrieve the
     * zlibbed output for small inputs.
     * @param sync Whether to flush to a byte boundary. A sync flush takes 4-5
     *             extra bytes, but guarantees all pushed data is immediately
     *             decompressible.
     */
    Zlib.prototype.flush = function (sync) {
        Deflate.prototype.flush.call(this, sync);
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
        ], this, StrmOpt.call(this, opts, cb), function (ev) {
            var strm = new Zlib(ev.data);
            onmessage = astrm(strm);
        }, 10, 1);
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
    var d = dopt(data, opts, opts.dictionary ? 6 : 2, 4);
    return zlh(d, opts), wbytes(d, d.length - 4, a.d()), d;
}
/**
 * Streaming Zlib decompression
 */
var Unzlib = /*#__PURE__*/ (function () {
    function Unzlib(opts, cb) {
        Inflate.call(this, opts, cb);
        this.v = opts && opts.dictionary ? 2 : 1;
    }
    /**
     * Pushes a chunk to be unzlibbed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Unzlib.prototype.push = function (chunk, final) {
        Inflate.prototype.e.call(this, chunk);
        if (this.v) {
            if (this.p.length < 6 && !final)
                return;
            this.p = this.p.subarray(zls(this.p, this.v - 1)), this.v = 0;
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
    function AsyncUnzlib(opts, cb) {
        astrmify([
            bInflt,
            zule,
            function () { return [astrm, Inflate, Unzlib]; }
        ], this, StrmOpt.call(this, opts, cb), function (ev) {
            var strm = new Unzlib(ev.data);
            onmessage = astrm(strm);
        }, 11, 0);
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
    ], function (ev) { return pbf(unzlibSync(ev.data[0], gopt(ev.data[1]))); }, 5, cb);
}
function unzlibSync(data, opts) {
    return inflt(data.subarray(zls(data, opts && opts.dictionary), -4), { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
/**
 * Streaming GZIP, Zlib, or raw DEFLATE decompression
 */
var Decompress = /*#__PURE__*/ (function () {
    function Decompress(opts, cb) {
        this.o = StrmOpt.call(this, opts, cb) || {};
        this.G = Gunzip;
        this.I = Inflate;
        this.Z = Unzlib;
    }
    // init substream
    // overriden by AsyncDecompress
    Decompress.prototype.i = function () {
        var _this = this;
        this.s.ondata = function (dat, final) {
            _this.ondata(dat, final);
        };
    };
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
                this.s = (this.p[0] == 31 && this.p[1] == 139 && this.p[2] == 8)
                    ? new this.G(this.o)
                    : ((this.p[0] & 15) != 8 || (this.p[0] >> 4) > 7 || ((this.p[0] << 8 | this.p[1]) % 31))
                        ? new this.I(this.o)
                        : new this.Z(this.o);
                this.i();
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
    function AsyncDecompress(opts, cb) {
        Decompress.call(this, opts, cb);
        this.queuedSize = 0;
        this.G = AsyncGunzip;
        this.I = AsyncInflate;
        this.Z = AsyncUnzlib;
    }
    AsyncDecompress.prototype.i = function () {
        var _this = this;
        this.s.ondata = function (err, dat, final) {
            _this.ondata(err, dat, final);
        };
        this.s.ondrain = function (size) {
            _this.queuedSize -= size;
            if (_this.ondrain)
                _this.ondrain(size);
        };
    };
    /**
     * Pushes a chunk to be decompressed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    AsyncDecompress.prototype.push = function (chunk, final) {
        this.queuedSize += chunk.length;
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
/**
 * Expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format
 * @param data The data to decompress
 * @param opts The decompression options
 * @returns The decompressed version of the data
 */
function decompressSync(data, opts) {
    return (data[0] == 31 && data[1] == 139 && data[2] == 8)
        ? gunzipSync(data, opts)
        : ((data[0] & 15) != 8 || (data[0] >> 4) > 7 || ((data[0] << 8 | data[1]) % 31))
            ? inflateSync(data, opts)
            : unzlibSync(data, opts);
}
// flatten a directory structure
var fltn = function (d, p, t, o) {
    for (var k in d) {
        var val = d[k], n = p + k, op = o;
        if (Array.isArray(val))
            op = mrg(o, val[1]), val = val[0];
        if (ArrayBuffer.isView(val))
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
            return { s: r, r: slc(d, i - 1) };
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
        var _a = dutf8(dat), s = _a.s, r = _a.r;
        if (final) {
            if (r.length)
                err(8);
            this.p = null;
        }
        else
            this.p = r;
        this.ondata(s, final);
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
    else if (td) {
        return td.decode(dat);
    }
    else {
        var _a = dutf8(dat), s = _a.s, r = _a.r;
        if (r.length)
            err(8);
        return s;
    }
}
;
// deflate bit flag
var dbf = function (l) { return l == 1 ? 3 : l < 6 ? 2 : l == 9 ? 1 : 0; };
// skip local zip header
var slzh = function (d, b) { return b + 30 + b2(d, b + 26) + b2(d, b + 28); };
// read zip header
var zh = function (d, b, z) {
    var fnl = b2(d, b + 28), efl = b2(d, b + 30), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl;
    var _a = z64hs(d, es, efl, z, b4(d, b + 20), b4(d, b + 24), b4(d, b + 42)), sc = _a[0], su = _a[1], off = _a[2];
    return [b2(d, b + 10), sc, su, fn, es + efl + b2(d, b + 32), off];
};
// read zip64 header sizes
var z64hs = function (d, b, l, z, sc, su, off) {
    var nsc = sc == 4294967295, nsu = su == 4294967295, noff = off == 4294967295, e = b + l;
    var nf = nsc + nsu + noff;
    if (z && nf) {
        for (; b + 4 < e; b += 4 + b2(d, b + 2)) {
            if (b2(d, b) == 1) {
                return [
                    nsc ? b8(d, b + 4 + 8 * nsu) : sc,
                    nsu ? b8(d, b + 4) : su,
                    noff ? b8(d, b + 4 + 8 * (nsu + nsc)) : off,
                    1
                ];
            }
        }
        // z == 2 for unknown whether or not zip64
        if (z < 2)
            err(13);
    }
    return [sc, su, off, 0];
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
    d[b++] = (f.flag << 1) | (c < 0 && 8), d[b++] = u && 8;
    d[b++] = f.compression & 255, d[b++] = f.compression >> 8;
    var dt = new Date(f.mtime == null ? Date.now() : f.mtime), y = dt.getFullYear() - 1980;
    if (y < 0 || y > 119)
        err(10);
    wbytes(d, b, (y << 25) | ((dt.getMonth() + 1) << 21) | (dt.getDate() << 16) | (dt.getHours() << 11) | (dt.getMinutes() << 5) | (dt.getSeconds() >> 1)), b += 4;
    if (c != -1) {
        wbytes(d, b, f.crc);
        wbytes(d, b + 4, c < 0 ? -c - 2 : c);
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
        // we shouldn't really do this cast, but properly handling ArrayBufferLike
        // makes the API unergonomic with Buffer
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
        var _this = this;
        if (!opts)
            opts = {};
        ZipPassThrough.call(this, filename);
        this.d = new Deflate(opts, function (dat, final) {
            _this.ondata(null, dat, final);
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
     * Creates an asynchronous DEFLATE stream that can be added to ZIP archives
     * @param filename The filename to associate with this data stream
     * @param opts The compression options
     */
    function AsyncZipDeflate(filename, opts) {
        var _this = this;
        if (!opts)
            opts = {};
        ZipPassThrough.call(this, filename);
        this.d = new AsyncDeflate(opts, function (err, dat, final) {
            _this.ondata(err, dat, final);
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
        var _this = this;
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
            wzh(header, 0, file, f, u, -1);
            var chks_1 = [header];
            var pAll_1 = function () {
                for (var _i = 0, chks_2 = chks_1; _i < chks_2.length; _i++) {
                    var chk = chks_2[_i];
                    _this.ondata(null, chk, false);
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
                        var nxt = _this.u[ind_1 + 1];
                        if (nxt)
                            nxt.r();
                        else
                            _this.d = 1;
                    }
                    tr_1 = 1;
                }
            });
            var cl_1 = 0;
            file.ondata = function (err, dat, final) {
                if (err) {
                    _this.ondata(err, dat, final);
                    _this.terminate();
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
        var _this = this;
        if (this.d & 2) {
            this.ondata(err(4 + (this.d & 1) * 8, 0, 1), null, true);
            return;
        }
        if (this.d)
            this.e();
        else
            this.u.push({
                r: function () {
                    if (!(_this.d & 1))
                        return;
                    _this.u.splice(-1, 1);
                    _this.e();
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
            wzh(out, bt, f, f.f, f.u, -f.c - 2, l, f.o);
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
/**
 * Streaming pass-through decompression for ZIP archives
 */
var UnzipPassThrough = /*#__PURE__*/ (function () {
    function UnzipPassThrough() {
    }
    UnzipPassThrough.prototype.push = function (chunk, final) {
        // same as ZipPassThrough: cast to retain Buffer ergonomics
        this.ondata(null, chunk, final);
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
        var _this = this;
        this.i = new Inflate(function (dat, final) {
            _this.ondata(null, dat, final);
        });
    }
    UnzipInflate.prototype.push = function (chunk, final) {
        try {
            this.i.push(chunk, final);
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
        var _this = this;
        if (sz < 320000) {
            this.i = new Inflate(function (dat, final) {
                _this.ondata(null, dat, final);
            });
        }
        else {
            this.i = new AsyncInflate(function (err, dat, final) {
                _this.ondata(err, dat, final);
            });
            this.terminate = this.i.terminate;
        }
    }
    AsyncUnzipInflate.prototype.push = function (chunk, final) {
        if (this.i.terminate)
            chunk = slc(chunk, 0);
        this.i.push(chunk, final);
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
        var _this = this;
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
                        var lsc = b4(buf, i + 18), lsu = b4(buf, i + 22);
                        var fn_1 = strFromU8(buf.subarray(i + 30, i += 30 + fnl), !u);
                        var _a = z64hs(buf, i, es, 2, lsc, lsu, 0), sc_1 = _a[0], su_1 = _a[1], z64 = _a[3];
                        if (dd)
                            sc_1 = -1 - z64;
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
                                    var ctr = _this.o[cmp_1];
                                    if (!ctr)
                                        file_1.ondata(err(14, 'unknown compression type ' + cmp_1, 1), null, false);
                                    d_1 = sc_1 < 0 ? new ctr(fn_1) : new ctr(fn_1, sc_1, su_1);
                                    d_1.ondata = function (err, dat, final) { file_1.ondata(err, dat, final); };
                                    for (var _i = 0, chks_4 = chks_3; _i < chks_4.length; _i++) {
                                        var dat = chks_4[_i];
                                        d_1.push(dat, false);
                                    }
                                    if (_this.k[0] == chks_3 && _this.c)
                                        _this.d = d_1;
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
        var z = b4(data, e - 20) == 0x7064B50;
        if (z) {
            var ze = b4(data, e - 12);
            z = b4(data, ze) == 0x6064B50;
            if (z) {
                c = lft = b4(data, ze + 32);
                o = b4(data, ze + 48);
            }
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
                    // Synchronously decompress under 512KB, or barely-compressed data
                    if (su < 524288 || sc > 0.8 * su) {
                        try {
                            cbl(null, inflateSync(infl, { out: new u8(su) }));
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
    var z = b4(data, e - 20) == 0x7064B50;
    if (z) {
        var ze = b4(data, e - 12);
        z = b4(data, ze) == 0x6064B50;
        if (z) {
            c = b4(data, ze + 32);
            o = b4(data, ze + 48);
        }
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
                files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
            else
                err(14, 'unknown compression type ' + c_2);
        }
    }
    return files;
}


},
15250(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (pako)
});

/*! pako 2.2.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

/* eslint-disable space-unary-ops */

/* Public constants ==========================================================*/
/* ===========================================================================*/


//const Z_FILTERED          = 1;
//const Z_HUFFMAN_ONLY      = 2;
//const Z_RLE               = 3;
const Z_FIXED$1               = 4;
//const Z_DEFAULT_STRATEGY  = 0;

/* Possible values of the data_type field (though see inflate()) */
const Z_BINARY              = 0;
const Z_TEXT                = 1;
//const Z_ASCII             = 1; // = Z_TEXT
const Z_UNKNOWN$1             = 2;

/*============================================================================*/


function zero$1(buf) { let len = buf.length; while (--len >= 0) { buf[len] = 0; } }

// From zutil.h

const STORED_BLOCK = 0;
const STATIC_TREES = 1;
const DYN_TREES    = 2;
/* The three kinds of block type */

const MIN_MATCH$1    = 3;
const MAX_MATCH$1    = 258;
/* The minimum and maximum match lengths */

// From deflate.h
/* ===========================================================================
 * Internal compression state.
 */

const LENGTH_CODES$1  = 29;
/* number of length codes, not counting the special END_BLOCK code */

const LITERALS$1      = 256;
/* number of literal bytes 0..255 */

const L_CODES$1       = LITERALS$1 + 1 + LENGTH_CODES$1;
/* number of Literal or Length codes, including the END_BLOCK code */

const D_CODES$1       = 30;
/* number of distance codes */

const BL_CODES$1      = 19;
/* number of codes used to transfer the bit lengths */

const HEAP_SIZE$1     = 2 * L_CODES$1 + 1;
/* maximum heap size */

const MAX_BITS$1      = 15;
/* All codes must not exceed MAX_BITS bits */

const Buf_size      = 16;
/* size of bit buffer in bi_buf */


/* ===========================================================================
 * Constants
 */

const MAX_BL_BITS = 7;
/* Bit length codes must not exceed MAX_BL_BITS bits */

const END_BLOCK   = 256;
/* end of block literal code */

const REP_3_6     = 16;
/* repeat previous bit length 3-6 times (2 bits of repeat count) */

const REPZ_3_10   = 17;
/* repeat a zero length 3-10 times  (3 bits of repeat count) */

const REPZ_11_138 = 18;
/* repeat a zero length 11-138 times  (7 bits of repeat count) */

/* eslint-disable comma-spacing,array-bracket-spacing */
const extra_lbits =   /* extra bits for each length code */
  new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]);

const extra_dbits =   /* extra bits for each distance code */
  new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]);

const extra_blbits =  /* extra bits for each bit length code */
  new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]);

const bl_order =
  new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);
/* eslint-enable comma-spacing,array-bracket-spacing */

/* The lengths of the bit length codes are sent in order of decreasing
 * probability, to avoid transmitting the lengths for unused bit length codes.
 */

/* ===========================================================================
 * Local data. These are initialized only once.
 */

// We pre-fill arrays with 0 to avoid uninitialized gaps

const DIST_CODE_LEN = 512; /* see definition of array dist_code below */

// !!!! Use flat array instead of structure, Freq = i*2, Len = i*2+1
const static_ltree  = new Array((L_CODES$1 + 2) * 2);
zero$1(static_ltree);
/* The static literal tree. Since the bit lengths are imposed, there is no
 * need for the L_CODES extra codes used during heap construction. However
 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
 * below).
 */

const static_dtree  = new Array(D_CODES$1 * 2);
zero$1(static_dtree);
/* The static distance tree. (Actually a trivial tree since all codes use
 * 5 bits.)
 */

const _dist_code    = new Array(DIST_CODE_LEN);
zero$1(_dist_code);
/* Distance codes. The first 256 values correspond to the distances
 * 3 .. 258, the last 256 values correspond to the top 8 bits of
 * the 15 bit distances.
 */

const _length_code  = new Array(MAX_MATCH$1 - MIN_MATCH$1 + 1);
zero$1(_length_code);
/* length code for each normalized match length (0 == MIN_MATCH) */

const base_length   = new Array(LENGTH_CODES$1);
zero$1(base_length);
/* First normalized length for each code (0 = MIN_MATCH) */

const base_dist     = new Array(D_CODES$1);
zero$1(base_dist);
/* First normalized distance for each code (0 = distance of 1) */


function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {

  this.static_tree  = static_tree;  /* static tree or NULL */
  this.extra_bits   = extra_bits;   /* extra bits for each code or NULL */
  this.extra_base   = extra_base;   /* base index for extra_bits */
  this.elems        = elems;        /* max number of elements in the tree */
  this.max_length   = max_length;   /* max bit length for the codes */

  // show if `static_tree` has data or dummy - needed for monomorphic objects
  this.has_stree    = static_tree && static_tree.length;
}


let static_l_desc;
let static_d_desc;
let static_bl_desc;


function TreeDesc(dyn_tree, stat_desc) {
  this.dyn_tree = dyn_tree;     /* the dynamic tree */
  this.max_code = 0;            /* largest code with non zero frequency */
  this.stat_desc = stat_desc;   /* the corresponding static tree */
}



const d_code = (dist) => {

  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
};


/* ===========================================================================
 * Output a short LSB first on the stream.
 * IN assertion: there is enough room in pendingBuf.
 */
const put_short = (s, w) => {
//    put_byte(s, (uch)((w) & 0xff));
//    put_byte(s, (uch)((ush)(w) >> 8));
  s.pending_buf[s.pending++] = (w) & 0xff;
  s.pending_buf[s.pending++] = (w >>> 8) & 0xff;
};


/* ===========================================================================
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 */
const send_bits = (s, value, length) => {

  if (s.bi_valid > (Buf_size - length)) {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    put_short(s, s.bi_buf);
    s.bi_buf = value >> (Buf_size - s.bi_valid);
    s.bi_valid += length - Buf_size;
  } else {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    s.bi_valid += length;
  }
};


const send_code = (s, c, tree) => {

  send_bits(s, tree[c * 2]/*.Code*/, tree[c * 2 + 1]/*.Len*/);
};


/* ===========================================================================
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 */
const bi_reverse = (code, len) => {

  let res = 0;
  do {
    res |= code & 1;
    code >>>= 1;
    res <<= 1;
  } while (--len > 0);
  return res >>> 1;
};


/* ===========================================================================
 * Flush the bit buffer, keeping at most 7 bits in it.
 */
const bi_flush = (s) => {

  if (s.bi_valid === 16) {
    put_short(s, s.bi_buf);
    s.bi_buf = 0;
    s.bi_valid = 0;

  } else if (s.bi_valid >= 8) {
    s.pending_buf[s.pending++] = s.bi_buf & 0xff;
    s.bi_buf >>= 8;
    s.bi_valid -= 8;
  }
};


/* ===========================================================================
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, heap[heap_max] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array bl_count contains the frequencies for each bit length.
 *     The length opt_len is updated; static_len is also updated if stree is
 *     not null.
 */
const gen_bitlen = (s, desc) => {
//    deflate_state *s;
//    tree_desc *desc;    /* the tree descriptor */

  const tree            = desc.dyn_tree;
  const max_code        = desc.max_code;
  const stree           = desc.stat_desc.static_tree;
  const has_stree       = desc.stat_desc.has_stree;
  const extra           = desc.stat_desc.extra_bits;
  const base            = desc.stat_desc.extra_base;
  const max_length      = desc.stat_desc.max_length;
  let h;              /* heap index */
  let n, m;           /* iterate over the tree elements */
  let bits;           /* bit length */
  let xbits;          /* extra bits */
  let f;              /* frequency */
  let overflow = 0;   /* number of elements with bit length too large */

  for (bits = 0; bits <= MAX_BITS$1; bits++) {
    s.bl_count[bits] = 0;
  }

  /* In a first pass, compute the optimal bit lengths (which may
   * overflow in the case of the bit length tree).
   */
  tree[s.heap[s.heap_max] * 2 + 1]/*.Len*/ = 0; /* root of the heap */

  for (h = s.heap_max + 1; h < HEAP_SIZE$1; h++) {
    n = s.heap[h];
    bits = tree[tree[n * 2 + 1]/*.Dad*/ * 2 + 1]/*.Len*/ + 1;
    if (bits > max_length) {
      bits = max_length;
      overflow++;
    }
    tree[n * 2 + 1]/*.Len*/ = bits;
    /* We overwrite tree[n].Dad which is no longer needed */

    if (n > max_code) { continue; } /* not a leaf node */

    s.bl_count[bits]++;
    xbits = 0;
    if (n >= base) {
      xbits = extra[n - base];
    }
    f = tree[n * 2]/*.Freq*/;
    s.opt_len += f * (bits + xbits);
    if (has_stree) {
      s.static_len += f * (stree[n * 2 + 1]/*.Len*/ + xbits);
    }
  }
  if (overflow === 0) { return; }

  // Tracev((stderr,"\nbit length overflow\n"));
  /* This happens for example on obj2 and pic of the Calgary corpus */

  /* Find the first bit length which could increase: */
  do {
    bits = max_length - 1;
    while (s.bl_count[bits] === 0) { bits--; }
    s.bl_count[bits]--;      /* move one leaf down the tree */
    s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */
    s.bl_count[max_length]--;
    /* The brother of the overflow item also moves one step up,
     * but this does not affect bl_count[max_length]
     */
    overflow -= 2;
  } while (overflow > 0);

  /* Now recompute all bit lengths, scanning in increasing frequency.
   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
   * lengths instead of fixing only the wrong ones. This idea is taken
   * from 'ar' written by Haruhiko Okumura.)
   */
  for (bits = max_length; bits !== 0; bits--) {
    n = s.bl_count[bits];
    while (n !== 0) {
      m = s.heap[--h];
      if (m > max_code) { continue; }
      if (tree[m * 2 + 1]/*.Len*/ !== bits) {
        // Tracev((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
        s.opt_len += (bits - tree[m * 2 + 1]/*.Len*/) * tree[m * 2]/*.Freq*/;
        tree[m * 2 + 1]/*.Len*/ = bits;
      }
      n--;
    }
  }
};


/* ===========================================================================
 * Generate the codes for a given tree and bit counts (which need not be
 * optimal).
 * IN assertion: the array bl_count contains the bit length statistics for
 * the given tree and the field len is set for all tree elements.
 * OUT assertion: the field code is set for all tree elements of non
 *     zero code length.
 */
const gen_codes = (tree, max_code, bl_count) => {
//    ct_data *tree;             /* the tree to decorate */
//    int max_code;              /* largest code with non zero frequency */
//    ushf *bl_count;            /* number of codes at each bit length */

  const next_code = new Array(MAX_BITS$1 + 1); /* next code value for each bit length */
  let code = 0;              /* running code value */
  let bits;                  /* bit index */
  let n;                     /* code index */

  /* The distribution counts are first used to generate the code values
   * without bit reversal.
   */
  for (bits = 1; bits <= MAX_BITS$1; bits++) {
    code = (code + bl_count[bits - 1]) << 1;
    next_code[bits] = code;
  }
  /* Check that the bit counts in bl_count are consistent. The last code
   * must be all ones.
   */
  //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
  //        "inconsistent bit counts");
  //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

  for (n = 0;  n <= max_code; n++) {
    let len = tree[n * 2 + 1]/*.Len*/;
    if (len === 0) { continue; }
    /* Now reverse the bits */
    tree[n * 2]/*.Code*/ = bi_reverse(next_code[len]++, len);

    //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
  }
};


/* ===========================================================================
 * Initialize the various 'constant' tables.
 */
const tr_static_init = () => {

  let n;        /* iterates over tree elements */
  let bits;     /* bit counter */
  let length;   /* length value */
  let code;     /* code value */
  let dist;     /* distance index */
  const bl_count = new Array(MAX_BITS$1 + 1);
  /* number of codes at each bit length for an optimal tree */

  // do check in _tr_init()
  //if (static_init_done) return;

  /* For some embedded targets, global variables are not initialized: */
/*#ifdef NO_INIT_GLOBAL_POINTERS
  static_l_desc.static_tree = static_ltree;
  static_l_desc.extra_bits = extra_lbits;
  static_d_desc.static_tree = static_dtree;
  static_d_desc.extra_bits = extra_dbits;
  static_bl_desc.extra_bits = extra_blbits;
#endif*/

  /* Initialize the mapping length (0..255) -> length code (0..28) */
  length = 0;
  for (code = 0; code < LENGTH_CODES$1 - 1; code++) {
    base_length[code] = length;
    for (n = 0; n < (1 << extra_lbits[code]); n++) {
      _length_code[length++] = code;
    }
  }
  //Assert (length == 256, "tr_static_init: length != 256");
  /* Note that the length 255 (match length 258) can be represented
   * in two different ways: code 284 + 5 bits or code 285, so we
   * overwrite length_code[255] to use the best encoding:
   */
  _length_code[length - 1] = code;

  /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
  dist = 0;
  for (code = 0; code < 16; code++) {
    base_dist[code] = dist;
    for (n = 0; n < (1 << extra_dbits[code]); n++) {
      _dist_code[dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: dist != 256");
  dist >>= 7; /* from now on, all distances are divided by 128 */
  for (; code < D_CODES$1; code++) {
    base_dist[code] = dist << 7;
    for (n = 0; n < (1 << (extra_dbits[code] - 7)); n++) {
      _dist_code[256 + dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: 256+dist != 512");

  /* Construct the codes of the static literal tree */
  for (bits = 0; bits <= MAX_BITS$1; bits++) {
    bl_count[bits] = 0;
  }

  n = 0;
  while (n <= 143) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  while (n <= 255) {
    static_ltree[n * 2 + 1]/*.Len*/ = 9;
    n++;
    bl_count[9]++;
  }
  while (n <= 279) {
    static_ltree[n * 2 + 1]/*.Len*/ = 7;
    n++;
    bl_count[7]++;
  }
  while (n <= 287) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  /* Codes 286 and 287 do not exist, but we must include them in the
   * tree construction to get a canonical Huffman tree (longest code
   * all ones)
   */
  gen_codes(static_ltree, L_CODES$1 + 1, bl_count);

  /* The static distance tree is trivial: */
  for (n = 0; n < D_CODES$1; n++) {
    static_dtree[n * 2 + 1]/*.Len*/ = 5;
    static_dtree[n * 2]/*.Code*/ = bi_reverse(n, 5);
  }

  // Now data ready and we can init static trees
  static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS$1 + 1, L_CODES$1, MAX_BITS$1);
  static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0,          D_CODES$1, MAX_BITS$1);
  static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0,         BL_CODES$1, MAX_BL_BITS);

  //static_init_done = true;
};


/* ===========================================================================
 * Initialize a new block.
 */
const init_block = (s) => {

  let n; /* iterates over tree elements */

  /* Initialize the trees. */
  for (n = 0; n < L_CODES$1;  n++) { s.dyn_ltree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < D_CODES$1;  n++) { s.dyn_dtree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < BL_CODES$1; n++) { s.bl_tree[n * 2]/*.Freq*/ = 0; }

  s.dyn_ltree[END_BLOCK * 2]/*.Freq*/ = 1;
  s.opt_len = s.static_len = 0;
  s.sym_next = s.matches = 0;
};


/* ===========================================================================
 * Flush the bit buffer and align the output on a byte boundary
 */
const bi_windup = (s) =>
{
  if (s.bi_valid > 8) {
    put_short(s, s.bi_buf);
  } else if (s.bi_valid > 0) {
    //put_byte(s, (Byte)s->bi_buf);
    s.pending_buf[s.pending++] = s.bi_buf;
  }
  s.bi_buf = 0;
  s.bi_valid = 0;
};

/* ===========================================================================
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 */
const smaller = (tree, n, m, depth) => {

  const _n2 = n * 2;
  const _m2 = m * 2;
  return (tree[_n2]/*.Freq*/ < tree[_m2]/*.Freq*/ ||
         (tree[_n2]/*.Freq*/ === tree[_m2]/*.Freq*/ && depth[n] <= depth[m]));
};

/* ===========================================================================
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 */
const pqdownheap = (s, tree, k) => {
//    deflate_state *s;
//    ct_data *tree;  /* the tree to restore */
//    int k;               /* node to move down */

  const v = s.heap[k];
  let j = k << 1;  /* left son of k */
  while (j <= s.heap_len) {
    /* Set j to the smallest of the two sons: */
    if (j < s.heap_len &&
      smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
      j++;
    }
    /* Exit if v is smaller than both sons */
    if (smaller(tree, v, s.heap[j], s.depth)) { break; }

    /* Exchange v with the smallest son */
    s.heap[k] = s.heap[j];
    k = j;

    /* And continue down the tree, setting j to the left son of k */
    j <<= 1;
  }
  s.heap[k] = v;
};


// inlined manually
// const SMALLEST = 1;

/* ===========================================================================
 * Send the block data compressed using the given Huffman trees
 */
const compress_block = (s, ltree, dtree) => {
//    deflate_state *s;
//    const ct_data *ltree; /* literal tree */
//    const ct_data *dtree; /* distance tree */

  let dist;           /* distance of matched string */
  let lc;             /* match length or unmatched char (if dist == 0) */
  let sx = 0;         /* running index in sym_buf */
  let code;           /* the code to send */
  let extra;          /* number of extra bits to send */

  if (s.sym_next !== 0) {
    do {
      dist = s.pending_buf[s.sym_buf + sx++] & 0xff;
      dist += (s.pending_buf[s.sym_buf + sx++] & 0xff) << 8;
      lc = s.pending_buf[s.sym_buf + sx++];
      if (dist === 0) {
        send_code(s, lc, ltree); /* send a literal byte */
        //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
      } else {
        /* Here, lc is the match length - MIN_MATCH */
        code = _length_code[lc];
        send_code(s, code + LITERALS$1 + 1, ltree); /* send the length code */
        extra = extra_lbits[code];
        if (extra !== 0) {
          lc -= base_length[code];
          send_bits(s, lc, extra);       /* send the extra length bits */
        }
        dist--; /* dist is now the match distance - 1 */
        code = d_code(dist);
        //Assert (code < D_CODES, "bad d_code");

        send_code(s, code, dtree);       /* send the distance code */
        extra = extra_dbits[code];
        if (extra !== 0) {
          dist -= base_dist[code];
          send_bits(s, dist, extra);   /* send the extra distance bits */
        }
      } /* literal or match pair ? */

      /* Check that the overlay between pending_buf and sym_buf is ok: */
      //Assert(s->pending < s->lit_bufsize + sx, "pendingBuf overflow");

    } while (sx < s.sym_next);
  }

  send_code(s, END_BLOCK, ltree);
};


/* ===========================================================================
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length opt_len is updated; static_len is
 *     also updated if stree is not null. The field max_code is set.
 */
const build_tree = (s, desc) => {
//    deflate_state *s;
//    tree_desc *desc; /* the tree descriptor */

  const tree     = desc.dyn_tree;
  const stree    = desc.stat_desc.static_tree;
  const has_stree = desc.stat_desc.has_stree;
  const elems    = desc.stat_desc.elems;
  let n, m;          /* iterate over heap elements */
  let max_code = -1; /* largest code with non zero frequency */
  let node;          /* new node being created */

  /* Construct the initial heap, with least frequent element in
   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
   * heap[0] is not used.
   */
  s.heap_len = 0;
  s.heap_max = HEAP_SIZE$1;

  for (n = 0; n < elems; n++) {
    if (tree[n * 2]/*.Freq*/ !== 0) {
      s.heap[++s.heap_len] = max_code = n;
      s.depth[n] = 0;

    } else {
      tree[n * 2 + 1]/*.Len*/ = 0;
    }
  }

  /* The pkzip format requires that at least one distance code exists,
   * and that at least one bit should be sent even if there is only one
   * possible code. So to avoid special checks later on we force at least
   * two codes of non zero frequency.
   */
  while (s.heap_len < 2) {
    node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0);
    tree[node * 2]/*.Freq*/ = 1;
    s.depth[node] = 0;
    s.opt_len--;

    if (has_stree) {
      s.static_len -= stree[node * 2 + 1]/*.Len*/;
    }
    /* node is 0 or 1 so it does not have extra bits */
  }
  desc.max_code = max_code;

  /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
   * establish sub-heaps of increasing lengths:
   */
  for (n = (s.heap_len >> 1/*int /2*/); n >= 1; n--) { pqdownheap(s, tree, n); }

  /* Construct the Huffman tree by repeatedly combining the least two
   * frequent nodes.
   */
  node = elems;              /* next internal node of the tree */
  do {
    //pqremove(s, tree, n);  /* n = node of least frequency */
    /*** pqremove ***/
    n = s.heap[1/*SMALLEST*/];
    s.heap[1/*SMALLEST*/] = s.heap[s.heap_len--];
    pqdownheap(s, tree, 1/*SMALLEST*/);
    /***/

    m = s.heap[1/*SMALLEST*/]; /* m = node of next least frequency */

    s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */
    s.heap[--s.heap_max] = m;

    /* Create a new node father of n and m */
    tree[node * 2]/*.Freq*/ = tree[n * 2]/*.Freq*/ + tree[m * 2]/*.Freq*/;
    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
    tree[n * 2 + 1]/*.Dad*/ = tree[m * 2 + 1]/*.Dad*/ = node;

    /* and insert the new node in the heap */
    s.heap[1/*SMALLEST*/] = node++;
    pqdownheap(s, tree, 1/*SMALLEST*/);

  } while (s.heap_len >= 2);

  s.heap[--s.heap_max] = s.heap[1/*SMALLEST*/];

  /* At this point, the fields freq and dad are set. We can now
   * generate the bit lengths.
   */
  gen_bitlen(s, desc);

  /* The field len is now set, we can generate the bit codes */
  gen_codes(tree, max_code, s.bl_count);
};


/* ===========================================================================
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree.
 */
const scan_tree = (s, tree, max_code) => {
//    deflate_state *s;
//    ct_data *tree;   /* the tree to be scanned */
//    int max_code;    /* and its largest code of non zero frequency */

  let n;                     /* iterates over all tree elements */
  let prevlen = -1;          /* last emitted length */
  let curlen;                /* length of current code */

  let nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  let count = 0;             /* repeat count of the current code */
  let max_count = 7;         /* max repeat count */
  let min_count = 4;         /* min repeat count */

  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }
  tree[(max_code + 1) * 2 + 1]/*.Len*/ = 0xffff; /* guard */

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      s.bl_tree[curlen * 2]/*.Freq*/ += count;

    } else if (curlen !== 0) {

      if (curlen !== prevlen) { s.bl_tree[curlen * 2]/*.Freq*/++; }
      s.bl_tree[REP_3_6 * 2]/*.Freq*/++;

    } else if (count <= 10) {
      s.bl_tree[REPZ_3_10 * 2]/*.Freq*/++;

    } else {
      s.bl_tree[REPZ_11_138 * 2]/*.Freq*/++;
    }

    count = 0;
    prevlen = curlen;

    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
};


/* ===========================================================================
 * Send a literal or distance tree in compressed form, using the codes in
 * bl_tree.
 */
const send_tree = (s, tree, max_code) => {
//    deflate_state *s;
//    ct_data *tree; /* the tree to be scanned */
//    int max_code;       /* and its largest code of non zero frequency */

  let n;                     /* iterates over all tree elements */
  let prevlen = -1;          /* last emitted length */
  let curlen;                /* length of current code */

  let nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  let count = 0;             /* repeat count of the current code */
  let max_count = 7;         /* max repeat count */
  let min_count = 4;         /* min repeat count */

  /* tree[max_code+1].Len = -1; */  /* guard already set */
  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      do { send_code(s, curlen, s.bl_tree); } while (--count !== 0);

    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        send_code(s, curlen, s.bl_tree);
        count--;
      }
      //Assert(count >= 3 && count <= 6, " 3_6?");
      send_code(s, REP_3_6, s.bl_tree);
      send_bits(s, count - 3, 2);

    } else if (count <= 10) {
      send_code(s, REPZ_3_10, s.bl_tree);
      send_bits(s, count - 3, 3);

    } else {
      send_code(s, REPZ_11_138, s.bl_tree);
      send_bits(s, count - 11, 7);
    }

    count = 0;
    prevlen = curlen;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
};


/* ===========================================================================
 * Construct the Huffman tree for the bit lengths and return the index in
 * bl_order of the last bit length code to send.
 */
const build_bl_tree = (s) => {

  let max_blindex;  /* index of last bit length code of non zero freq */

  /* Determine the bit length frequencies for literal and distance trees */
  scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
  scan_tree(s, s.dyn_dtree, s.d_desc.max_code);

  /* Build the bit length tree: */
  build_tree(s, s.bl_desc);
  /* opt_len now includes the length of the tree representations, except
   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
   */

  /* Determine the number of bit length codes to send. The pkzip format
   * requires that at least 4 bit length codes be sent. (appnote.txt says
   * 3 but the actual value used is 4.)
   */
  for (max_blindex = BL_CODES$1 - 1; max_blindex >= 3; max_blindex--) {
    if (s.bl_tree[bl_order[max_blindex] * 2 + 1]/*.Len*/ !== 0) {
      break;
    }
  }
  /* Update opt_len to include the bit length tree and counts */
  s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
  //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
  //        s->opt_len, s->static_len));

  return max_blindex;
};


/* ===========================================================================
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 */
const send_all_trees = (s, lcodes, dcodes, blcodes) => {
//    deflate_state *s;
//    int lcodes, dcodes, blcodes; /* number of codes for each tree */

  let rank;                    /* index in bl_order */

  //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
  //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
  //        "too many codes");
  //Tracev((stderr, "\nbl counts: "));
  send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */
  send_bits(s, dcodes - 1,   5);
  send_bits(s, blcodes - 4,  4); /* not -3 as stated in appnote.txt */
  for (rank = 0; rank < blcodes; rank++) {
    //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
    send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1]/*.Len*/, 3);
  }
  //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */
  //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */
  //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
};


/* ===========================================================================
 * Check if the data type is TEXT or BINARY, using the following algorithm:
 * - TEXT if the two conditions below are satisfied:
 *    a) There are no non-portable control characters belonging to the
 *       "block list" (0..6, 14..25, 28..31).
 *    b) There is at least one printable character belonging to the
 *       "allow list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
 * - BINARY otherwise.
 * - The following partially-portable control characters form a
 *   "gray list" that is ignored in this detection algorithm:
 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
 * IN assertion: the fields Freq of dyn_ltree are set.
 */
const detect_data_type = (s) => {
  /* block_mask is the bit mask of block-listed bytes
   * set bits 0..6, 14..25, and 28..31
   * 0xf3ffc07f = binary 11110011111111111100000001111111
   */
  let block_mask = 0xf3ffc07f;
  let n;

  /* Check for non-textual ("block-listed") bytes. */
  for (n = 0; n <= 31; n++, block_mask >>>= 1) {
    if ((block_mask & 1) && (s.dyn_ltree[n * 2]/*.Freq*/ !== 0)) {
      return Z_BINARY;
    }
  }

  /* Check for textual ("allow-listed") bytes. */
  if (s.dyn_ltree[9 * 2]/*.Freq*/ !== 0 || s.dyn_ltree[10 * 2]/*.Freq*/ !== 0 ||
      s.dyn_ltree[13 * 2]/*.Freq*/ !== 0) {
    return Z_TEXT;
  }
  for (n = 32; n < LITERALS$1; n++) {
    if (s.dyn_ltree[n * 2]/*.Freq*/ !== 0) {
      return Z_TEXT;
    }
  }

  /* There are no "block-listed" or "allow-listed" bytes:
   * this stream either is empty or has tolerated ("gray-listed") bytes only.
   */
  return Z_BINARY;
};


let static_init_done = false;

/* ===========================================================================
 * Initialize the tree data structures for a new zlib stream.
 */
const _tr_init$1 = (s) =>
{

  if (!static_init_done) {
    tr_static_init();
    static_init_done = true;
  }

  s.l_desc  = new TreeDesc(s.dyn_ltree, static_l_desc);
  s.d_desc  = new TreeDesc(s.dyn_dtree, static_d_desc);
  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);

  s.bi_buf = 0;
  s.bi_valid = 0;

  /* Initialize the first block of the first file: */
  init_block(s);
};


/* ===========================================================================
 * Send a stored block
 */
const _tr_stored_block$1 = (s, buf, stored_len, last) => {
//DeflateState *s;
//charf *buf;       /* input block */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */

  send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);    /* send block type */
  bi_windup(s);        /* align on byte boundary */
  put_short(s, stored_len);
  put_short(s, ~stored_len);
  if (stored_len) {
    s.pending_buf.set(s.window.subarray(buf, buf + stored_len), s.pending);
  }
  s.pending += stored_len;
};


/* ===========================================================================
 * Send one empty static block to give enough lookahead for inflate.
 * This takes 10 bits, of which 7 may remain in the bit buffer.
 */
const _tr_align$1 = (s) => {
  send_bits(s, STATIC_TREES << 1, 3);
  send_code(s, END_BLOCK, static_ltree);
  bi_flush(s);
};


/* ===========================================================================
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and write out the encoded block.
 */
const _tr_flush_block$1 = (s, buf, stored_len, last) => {
//DeflateState *s;
//charf *buf;       /* input block, or NULL if too old */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */

  let opt_lenb, static_lenb;  /* opt_len and static_len in bytes */
  let max_blindex = 0;        /* index of last bit length code of non zero freq */

  /* Build the Huffman trees unless a stored block is forced */
  if (s.level > 0) {

    /* Check if the file is binary or text */
    if (s.strm.data_type === Z_UNKNOWN$1) {
      s.strm.data_type = detect_data_type(s);
    }

    /* Construct the literal and distance trees */
    build_tree(s, s.l_desc);
    // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));

    build_tree(s, s.d_desc);
    // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));
    /* At this point, opt_len and static_len are the total bit lengths of
     * the compressed block data, excluding the tree representations.
     */

    /* Build the bit length tree for the above two trees, and get the index
     * in bl_order of the last bit length code to send.
     */
    max_blindex = build_bl_tree(s);

    /* Determine the best encoding. Compute the block lengths in bytes. */
    opt_lenb = (s.opt_len + 3 + 7) >>> 3;
    static_lenb = (s.static_len + 3 + 7) >>> 3;

    // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
    //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
    //        s->sym_next / 3));

    if (static_lenb <= opt_lenb) { opt_lenb = static_lenb; }

  } else {
    // Assert(buf != (char*)0, "lost buf");
    opt_lenb = static_lenb = stored_len + 5; /* force a stored block */
  }

  if ((stored_len + 4 <= opt_lenb) && (buf !== -1)) {
    /* 4: two words for the lengths */

    /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
     * Otherwise we can't have processed more than WSIZE input bytes since
     * the last block flush, because compression would have been
     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
     * transform a block into a stored block.
     */
    _tr_stored_block$1(s, buf, stored_len, last);

  } else if (s.strategy === Z_FIXED$1 || static_lenb === opt_lenb) {

    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
    compress_block(s, static_ltree, static_dtree);

  } else {
    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
    compress_block(s, s.dyn_ltree, s.dyn_dtree);
  }
  // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
  /* The above check is made mod 2^32, for files larger than 512 MB
   * and uLong implemented on 32 bits.
   */
  init_block(s);

  if (last) {
    bi_windup(s);
  }
  // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
  //       s->compressed_len-7*last));
};

/* ===========================================================================
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 */
const _tr_tally$1 = (s, dist, lc) => {
//    deflate_state *s;
//    unsigned dist;  /* distance of matched string */
//    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */

  s.pending_buf[s.sym_buf + s.sym_next++] = dist;
  s.pending_buf[s.sym_buf + s.sym_next++] = dist >> 8;
  s.pending_buf[s.sym_buf + s.sym_next++] = lc;
  if (dist === 0) {
    /* lc is the unmatched char */
    s.dyn_ltree[lc * 2]/*.Freq*/++;
  } else {
    s.matches++;
    /* Here, lc is the match length - MIN_MATCH */
    dist--;             /* dist = match distance - 1 */
    //Assert((ush)dist < (ush)MAX_DIST(s) &&
    //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
    //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

    s.dyn_ltree[(_length_code[lc] + LITERALS$1 + 1) * 2]/*.Freq*/++;
    s.dyn_dtree[d_code(dist) * 2]/*.Freq*/++;
  }

  return (s.sym_next === s.sym_end);
};

var _tr_init_1  = _tr_init$1;
var _tr_stored_block_1 = _tr_stored_block$1;
var _tr_flush_block_1  = _tr_flush_block$1;
var _tr_tally_1 = _tr_tally$1;
var _tr_align_1 = _tr_align$1;

var trees = {
	_tr_init: _tr_init_1,
	_tr_stored_block: _tr_stored_block_1,
	_tr_flush_block: _tr_flush_block_1,
	_tr_tally: _tr_tally_1,
	_tr_align: _tr_align_1
};

// Note: adler32 takes 12% for level 0 and 2% for level 6.
// It isn't worth it to make additional optimizations as in original.
// Small size is preferable.

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

const adler32 = (adler, buf, len, pos) => {
  let s1 = (adler & 0xffff) |0,
      s2 = ((adler >>> 16) & 0xffff) |0,
      n = 0;

  while (len !== 0) {
    // Set limit ~ twice less than 5552, to keep
    // s2 in 31-bits, because we force signed ints.
    // in other case %= will fail.
    n = len > 2000 ? 2000 : len;
    len -= n;

    do {
      s1 = (s1 + buf[pos++]) |0;
      s2 = (s2 + s1) |0;
    } while (--n);

    s1 %= 65521;
    s2 %= 65521;
  }

  return (s1 | (s2 << 16)) |0;
};


var adler32_1 = adler32;

// Note: we can't get significant speed boost here.
// So write code to minimize size - no pregenerated tables
// and array tools dependencies.

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

// Use ordinary array, since untyped makes no boost here
const makeTable = () => {
  let c, table = [];

  for (var n = 0; n < 256; n++) {
    c = n;
    for (var k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }

  return table;
};

// Create table on load. Just 255 signed longs. Not a problem.
const crcTable = new Uint32Array(makeTable());


const crc32 = (crc, buf, len, pos) => {
  const t = crcTable;
  const end = pos + len;

  crc ^= -1;

  for (let i = pos; i < end; i++) {
    crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
  }

  return (crc ^ (-1)); // >>> 0;
};


var crc32_1 = crc32;

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var messages = {
  2:      'need dictionary',     /* Z_NEED_DICT       2  */
  1:      'stream end',          /* Z_STREAM_END      1  */
  0:      '',                    /* Z_OK              0  */
  '-1':   'file error',          /* Z_ERRNO         (-1) */
  '-2':   'stream error',        /* Z_STREAM_ERROR  (-2) */
  '-3':   'data error',          /* Z_DATA_ERROR    (-3) */
  '-4':   'insufficient memory', /* Z_MEM_ERROR     (-4) */
  '-5':   'buffer error',        /* Z_BUF_ERROR     (-5) */
  '-6':   'incompatible version' /* Z_VERSION_ERROR (-6) */
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var constants$2 = {

  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH:         0,
  Z_PARTIAL_FLUSH:    1,
  Z_SYNC_FLUSH:       2,
  Z_FULL_FLUSH:       3,
  Z_FINISH:           4,
  Z_BLOCK:            5,
  Z_TREES:            6,

  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK:               0,
  Z_STREAM_END:       1,
  Z_NEED_DICT:        2,
  Z_ERRNO:           -1,
  Z_STREAM_ERROR:    -2,
  Z_DATA_ERROR:      -3,
  Z_MEM_ERROR:       -4,
  Z_BUF_ERROR:       -5,
  //Z_VERSION_ERROR: -6,

  /* compression levels */
  Z_NO_COMPRESSION:         0,
  Z_BEST_SPEED:             1,
  Z_BEST_COMPRESSION:       9,
  Z_DEFAULT_COMPRESSION:   -1,


  Z_FILTERED:               1,
  Z_HUFFMAN_ONLY:           2,
  Z_RLE:                    3,
  Z_FIXED:                  4,
  Z_DEFAULT_STRATEGY:       0,

  /* Possible values of the data_type field (though see inflate()) */
  Z_BINARY:                 0,
  Z_TEXT:                   1,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN:                2,

  /* The deflate compression method */
  Z_DEFLATED:               8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

const { _tr_init, _tr_stored_block, _tr_flush_block, _tr_tally, _tr_align } = trees;




/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_NO_FLUSH: Z_NO_FLUSH$2, Z_PARTIAL_FLUSH, Z_FULL_FLUSH: Z_FULL_FLUSH$1, Z_FINISH: Z_FINISH$3, Z_BLOCK: Z_BLOCK$1,
  Z_OK: Z_OK$3, Z_STREAM_END: Z_STREAM_END$3, Z_STREAM_ERROR: Z_STREAM_ERROR$2, Z_DATA_ERROR: Z_DATA_ERROR$2, Z_BUF_ERROR: Z_BUF_ERROR$2,
  Z_DEFAULT_COMPRESSION: Z_DEFAULT_COMPRESSION$1,
  Z_FILTERED, Z_HUFFMAN_ONLY, Z_RLE, Z_FIXED, Z_DEFAULT_STRATEGY: Z_DEFAULT_STRATEGY$1,
  Z_UNKNOWN,
  Z_DEFLATED: Z_DEFLATED$2
} = constants$2;

/*============================================================================*/


const MAX_MEM_LEVEL = 9;
/* Maximum value for memLevel in deflateInit2 */
const MAX_WBITS$1 = 15;
/* 32K LZ77 window */
const DEF_MEM_LEVEL = 8;


const LENGTH_CODES  = 29;
/* number of length codes, not counting the special END_BLOCK code */
const LITERALS      = 256;
/* number of literal bytes 0..255 */
const L_CODES       = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */
const D_CODES       = 30;
/* number of distance codes */
const BL_CODES      = 19;
/* number of codes used to transfer the bit lengths */
const HEAP_SIZE     = 2 * L_CODES + 1;
/* maximum heap size */
const MAX_BITS  = 15;
/* All codes must not exceed MAX_BITS bits */

const MIN_MATCH = 3;
const MAX_MATCH = 258;
const MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

const PRESET_DICT = 0x20;

const INIT_STATE    =  42;    /* zlib header -> BUSY_STATE */
//#ifdef GZIP
const GZIP_STATE    =  57;    /* gzip header -> BUSY_STATE | EXTRA_STATE */
//#endif
const EXTRA_STATE   =  69;    /* gzip extra block -> NAME_STATE */
const NAME_STATE    =  73;    /* gzip file name -> COMMENT_STATE */
const COMMENT_STATE =  91;    /* gzip comment -> HCRC_STATE */
const HCRC_STATE    = 103;    /* gzip header CRC -> BUSY_STATE */
const BUSY_STATE    = 113;    /* deflate -> FINISH_STATE */
const FINISH_STATE  = 666;    /* stream complete */

const BS_NEED_MORE      = 1; /* block not completed, need more input or more output */
const BS_BLOCK_DONE     = 2; /* block flush performed */
const BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
const BS_FINISH_DONE    = 4; /* finish done, accept no more input or output */

const OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

const err = (strm, errorCode) => {
  strm.msg = messages[errorCode];
  return errorCode;
};

const rank = (f) => {
  return ((f) * 2) - ((f) > 4 ? 9 : 0);
};

const zero = (buf) => {
  let len = buf.length; while (--len >= 0) { buf[len] = 0; }
};

/* ===========================================================================
 * Slide the hash table when sliding the window down (could be avoided with 32
 * bit values at the expense of memory usage). We slide even when level == 0 to
 * keep the hash table consistent if we switch back to level > 0 later.
 */
const slide_hash = (s) => {
  let n, m;
  let p;
  let wsize = s.w_size;

  n = s.hash_size;
  p = n;
  do {
    m = s.head[--p];
    s.head[p] = (m >= wsize ? m - wsize : 0);
  } while (--n);
  n = wsize;
//#ifndef FASTEST
  p = n;
  do {
    m = s.prev[--p];
    s.prev[p] = (m >= wsize ? m - wsize : 0);
    /* If n is not on any hash chain, prev[n] is garbage but
     * its value will never be used.
     */
  } while (--n);
//#endif
};

/* eslint-disable new-cap */
let HASH = (s, prev, data) => ((prev << s.hash_shift) ^ data) & s.hash_mask;


/* ===========================================================================
 * Insert string str in the dictionary and set match_head to the previous head
 * of the hash chain (the most recent string with same hash key). Return
 * the previous length of the hash chain.
 * IN  assertion: all calls to INSERT_STRING are made with consecutive input
 *    characters and the first MIN_MATCH bytes of str are valid (except for
 *    the last MIN_MATCH-1 bytes of the input file).
 */
const INSERT_STRING = (s, str) => {
  let h;
  if (s.legacy_hash) {
    /* UPDATE_HASH(s, s->ins_h, s->window[(str) + (MIN_MATCH-1)]); */
    h = s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);
  } else {
    // ANZAC++ hash: reads 4 bytes, matches node.js zlib output (legacyHash
    // restores classic zlib hash). Faster, with fewer collisions.
    const w = s.window;
    // Read 4 bytes little-endian. Math.imul reproduces C uint32 overflow in
    // `(value * 66521 + 66521) >> 16` exactly.
    const value = w[str] | (w[str + 1] << 8) | (w[str + 2] << 16) | (w[str + 3] << 24);
    h = s.ins_h = ((Math.imul(value, 66521) + 66521) >>> 16) & s.hash_mask;
  }
  const hash_head = s.prev[str & s.w_mask] = s.head[h];
  s.head[h] = str;
  return hash_head;
};


/* =========================================================================
 * Flush as much pending output as possible. All deflate() output, except for
 * some deflate_stored() output, goes through this function so some
 * applications may wish to modify it to avoid allocating a large
 * strm->next_out buffer and copying into it. (See also read_buf()).
 */
const flush_pending = (strm) => {
  const s = strm.state;

  //_tr_flush_bits(s);
  let len = s.pending;
  if (len > strm.avail_out) {
    len = strm.avail_out;
  }
  if (len === 0) { return; }

  strm.output.set(s.pending_buf.subarray(s.pending_out, s.pending_out + len), strm.next_out);
  strm.next_out  += len;
  s.pending_out  += len;
  strm.total_out += len;
  strm.avail_out -= len;
  s.pending      -= len;
  if (s.pending === 0) {
    s.pending_out = 0;
  }
};


const flush_block_only = (s, last) => {
  _tr_flush_block(s, (s.block_start >= 0 ? s.block_start : -1), s.strstart - s.block_start, last);
  s.block_start = s.strstart;
  flush_pending(s.strm);
};


const put_byte = (s, b) => {
  s.pending_buf[s.pending++] = b;
};


/* =========================================================================
 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
 * IN assertion: the stream state is correct and there is enough room in
 * pending_buf.
 */
const putShortMSB = (s, b) => {

  //  put_byte(s, (Byte)(b >> 8));
//  put_byte(s, (Byte)(b & 0xff));
  s.pending_buf[s.pending++] = (b >>> 8) & 0xff;
  s.pending_buf[s.pending++] = b & 0xff;
};


/* ===========================================================================
 * Read a new buffer from the current input stream, update the adler32
 * and total number of bytes read.  All deflate() input goes through
 * this function so some applications may wish to modify it to avoid
 * allocating a large strm->input buffer and copying from it.
 * (See also flush_pending()).
 */
const read_buf = (strm, buf, start, size) => {

  let len = strm.avail_in;

  if (len > size) { len = size; }
  if (len === 0) { return 0; }

  strm.avail_in -= len;

  // zmemcpy(buf, strm->next_in, len);
  buf.set(strm.input.subarray(strm.next_in, strm.next_in + len), start);
  if (strm.state.wrap === 1) {
    strm.adler = adler32_1(strm.adler, buf, len, start);
  }

  else if (strm.state.wrap === 2) {
    strm.adler = crc32_1(strm.adler, buf, len, start);
  }

  strm.next_in += len;
  strm.total_in += len;

  return len;
};


/* ===========================================================================
 * Set match_start to the longest match starting at the given string and
 * return its length. Matches shorter or equal to prev_length are discarded,
 * in which case the result is equal to prev_length and match_start is
 * garbage.
 * IN assertions: cur_match is the head of the hash chain for the current
 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
 * OUT assertion: the match length is not greater than s->lookahead.
 */
const longest_match = (s, cur_match) => {

  let chain_length = s.max_chain_length;      /* max hash chain length */
  let scan = s.strstart; /* current string */
  let match;                       /* matched string */
  let len;                           /* length of current match */
  let best_len = s.prev_length;              /* best match length so far */
  let nice_match = s.nice_match;             /* stop if match long enough */
  const limit = (s.strstart > (s.w_size - MIN_LOOKAHEAD)) ?
      s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0/*NIL*/;

  const _win = s.window; // shortcut

  const wmask = s.w_mask;
  const prev  = s.prev;

  /* Stop when cur_match becomes <= limit. To simplify the code,
   * we prevent matches with the string of window index 0.
   */

  const strend = s.strstart + MAX_MATCH;
  let scan_end1  = _win[scan + best_len - 1];
  let scan_end   = _win[scan + best_len];

  /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
   * It is easy to get rid of this optimization if necessary.
   */
  // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

  /* Do not waste too much time if we already have a good match: */
  if (s.prev_length >= s.good_match) {
    chain_length >>= 2;
  }
  /* Do not look for matches beyond the end of the input. This is necessary
   * to make deflate deterministic.
   */
  if (nice_match > s.lookahead) { nice_match = s.lookahead; }

  // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

  do {
    // Assert(cur_match < s->strstart, "no future");
    match = cur_match;

    /* Skip to next match if the match length cannot increase
     * or if the match length is less than 2.  Note that the checks below
     * for insufficient lookahead only occur occasionally for performance
     * reasons.  Therefore uninitialized memory will be accessed, and
     * conditional jumps will be made that depend on those values.
     * However the length of the match is limited to the lookahead, so
     * the output of deflate is not affected by the uninitialized values.
     */

    if (_win[match + best_len]     !== scan_end  ||
        _win[match + best_len - 1] !== scan_end1 ||
        _win[match]                !== _win[scan] ||
        _win[++match]              !== _win[scan + 1]) {
      continue;
    }

    /* The check at best_len-1 can be removed because it will be made
     * again later. (This heuristic is not always a win.)
     * It is not necessary to compare scan[2] and match[2] since they
     * are always equal when the other bytes match, given that
     * the hash keys are equal and that HASH_BITS >= 8.
     */
    scan += 2;
    match++;
    // Assert(*scan == *match, "match[2]?");

    /* We check for insufficient lookahead only every 8th comparison;
     * the 256th check will be made at strstart+258.
     */
    do {
      /*jshint noempty:false*/
    } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             scan < strend);

    // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

    len = MAX_MATCH - (strend - scan);
    scan = strend - MAX_MATCH;

    if (len > best_len) {
      s.match_start = cur_match;
      best_len = len;
      if (len >= nice_match) {
        break;
      }
      scan_end1  = _win[scan + best_len - 1];
      scan_end   = _win[scan + best_len];
    }
  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);

  if (best_len <= s.lookahead) {
    return best_len;
  }
  return s.lookahead;
};


/* ===========================================================================
 * Fill the window when the lookahead becomes insufficient.
 * Updates strstart and lookahead.
 *
 * IN assertion: lookahead < MIN_LOOKAHEAD
 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
 *    At least one byte has been read, or avail_in == 0; reads are
 *    performed for at least two bytes (required for the zip translate_eol
 *    option -- not supported here).
 */
const fill_window = (s) => {

  const _w_size = s.w_size;
  let n, more, str;

  //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

  do {
    more = s.window_size - s.lookahead - s.strstart;

    // JS ints have 32 bit, block below not needed
    /* Deal with !@#$% 64K limit: */
    //if (sizeof(int) <= 2) {
    //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
    //        more = wsize;
    //
    //  } else if (more == (unsigned)(-1)) {
    //        /* Very unlikely, but possible on 16 bit machine if
    //         * strstart == 0 && lookahead == 1 (input done a byte at time)
    //         */
    //        more--;
    //    }
    //}


    /* If the window is almost full and there is insufficient lookahead,
     * move the upper half to the lower one to make room in the upper half.
     */
    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {

      s.window.set(s.window.subarray(_w_size, _w_size + _w_size - more), 0);
      s.match_start -= _w_size;
      s.strstart -= _w_size;
      /* we now have strstart >= MAX_DIST */
      s.block_start -= _w_size;
      if (s.insert > s.strstart) {
        s.insert = s.strstart;
      }
      slide_hash(s);
      more += _w_size;
    }
    if (s.strm.avail_in === 0) {
      break;
    }

    /* If there was no sliding:
     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
     *    more == window_size - lookahead - strstart
     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
     * => more >= window_size - 2*WSIZE + 2
     * In the BIG_MEM or MMAP case (not yet supported),
     *   window_size == input_size + MIN_LOOKAHEAD  &&
     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
     * Otherwise, window_size == 2*WSIZE so more >= 2.
     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
     */
    //Assert(more >= 2, "more < 2");
    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
    s.lookahead += n;

    /* Initialize the hash value now that we have some input: */
    if (!s.legacy_hash) {
      /* The 4-byte hash reads one extra byte, so it needs one more available. */
      if (s.lookahead + s.insert > MIN_MATCH) {
        str = s.strstart - s.insert;
        while (s.insert) {
          INSERT_STRING(s, str);
          str++;
          s.insert--;
          if (s.lookahead + s.insert <= MIN_MATCH) {
            break;
          }
        }
      }
    } else if (s.lookahead + s.insert >= MIN_MATCH) {
      str = s.strstart - s.insert;
      s.ins_h = s.window[str];

      /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
      s.ins_h = HASH(s, s.ins_h, s.window[str + 1]);
//#if MIN_MATCH != 3
//        Call update_hash() MIN_MATCH-3 more times
//#endif
      while (s.insert) {
        INSERT_STRING(s, str);
        str++;
        s.insert--;
        if (s.lookahead + s.insert < MIN_MATCH) {
          break;
        }
      }
    }
    /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
     * but this is not important since only literal bytes will be emitted.
     */

  } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);

  /* If the WIN_INIT bytes after the end of the current data have never been
   * written, then zero those bytes in order to avoid memory check reports of
   * the use of uninitialized (or uninitialised as Julian writes) bytes by
   * the longest match routines.  Update the high water mark for the next
   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
   */
//  if (s.high_water < s.window_size) {
//    const curr = s.strstart + s.lookahead;
//    let init = 0;
//
//    if (s.high_water < curr) {
//      /* Previous high water mark below current data -- zero WIN_INIT
//       * bytes or up to end of window, whichever is less.
//       */
//      init = s.window_size - curr;
//      if (init > WIN_INIT)
//        init = WIN_INIT;
//      zmemzero(s->window + curr, (unsigned)init);
//      s->high_water = curr + init;
//    }
//    else if (s->high_water < (ulg)curr + WIN_INIT) {
//      /* High water mark at or above current data, but below current data
//       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
//       * to end of window, whichever is less.
//       */
//      init = (ulg)curr + WIN_INIT - s->high_water;
//      if (init > s->window_size - s->high_water)
//        init = s->window_size - s->high_water;
//      zmemzero(s->window + s->high_water, (unsigned)init);
//      s->high_water += init;
//    }
//  }
//
//  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
//    "not enough room for search");
};

/* ===========================================================================
 * Copy without compression as much as possible from the input stream, return
 * the current block state.
 *
 * In case deflateParams() is used to later switch to a non-zero compression
 * level, s->matches (otherwise unused when storing) keeps track of the number
 * of hash table slides to perform. If s->matches is 1, then one hash table
 * slide will be done when switching. If s->matches is 2, the maximum value
 * allowed here, then the hash table will be cleared, since two or more slides
 * is the same as a clear.
 *
 * deflate_stored() is written to minimize the number of times an input byte is
 * copied. It is most efficient with large input and output buffers, which
 * maximizes the opportunites to have a single copy from next_in to next_out.
 */
const deflate_stored = (s, flush) => {

  /* Smallest worthy block size when not flushing or finishing. By default
   * this is 32K. This can be as small as 507 bytes for memLevel == 1. For
   * large input and output buffers, the stored block size will be larger.
   */
  let min_block = s.pending_buf_size - 5 > s.w_size ? s.w_size : s.pending_buf_size - 5;

  /* Copy as many min_block or larger stored blocks directly to next_out as
   * possible. If flushing, copy the remaining available input to next_out as
   * stored blocks, if there is enough space.
   */
  let len, left, have, last = 0;
  let used = s.strm.avail_in;
  do {
    /* Set len to the maximum size block that we can copy directly with the
     * available input data and output space. Set left to how much of that
     * would be copied from what's left in the window.
     */
    len = 65535/* MAX_STORED */;     /* maximum deflate stored block length */
    have = (s.bi_valid + 42) >> 3;     /* number of header bytes */
    if (s.strm.avail_out < have) {         /* need room for header */
      break;
    }
      /* maximum stored block length that will fit in avail_out: */
    have = s.strm.avail_out - have;
    left = s.strstart - s.block_start;  /* bytes left in window */
    if (len > left + s.strm.avail_in) {
      len = left + s.strm.avail_in;   /* limit len to the input */
    }
    if (len > have) {
      len = have;             /* limit len to the output */
    }

    /* If the stored block would be less than min_block in length, or if
     * unable to copy all of the available input when flushing, then try
     * copying to the window and the pending buffer instead. Also don't
     * write an empty block when flushing -- deflate() does that.
     */
    if (len < min_block && ((len === 0 && flush !== Z_FINISH$3) ||
                        flush === Z_NO_FLUSH$2 ||
                        len !== left + s.strm.avail_in)) {
      break;
    }

    /* Make a dummy stored block in pending to get the header bytes,
     * including any pending bits. This also updates the debugging counts.
     */
    last = flush === Z_FINISH$3 && len === left + s.strm.avail_in ? 1 : 0;
    _tr_stored_block(s, 0, 0, last);

    /* Replace the lengths in the dummy stored block with len. */
    s.pending_buf[s.pending - 4] = len;
    s.pending_buf[s.pending - 3] = len >> 8;
    s.pending_buf[s.pending - 2] = ~len;
    s.pending_buf[s.pending - 1] = ~len >> 8;

    /* Write the stored block header bytes. */
    flush_pending(s.strm);

//#ifdef ZLIB_DEBUG
//    /* Update debugging counts for the data about to be copied. */
//    s->compressed_len += len << 3;
//    s->bits_sent += len << 3;
//#endif

    /* Copy uncompressed bytes from the window to next_out. */
    if (left) {
      if (left > len) {
        left = len;
      }
      //zmemcpy(s->strm->next_out, s->window + s->block_start, left);
      s.strm.output.set(s.window.subarray(s.block_start, s.block_start + left), s.strm.next_out);
      s.strm.next_out += left;
      s.strm.avail_out -= left;
      s.strm.total_out += left;
      s.block_start += left;
      len -= left;
    }

    /* Copy uncompressed bytes directly from next_in to next_out, updating
     * the check value.
     */
    if (len) {
      read_buf(s.strm, s.strm.output, s.strm.next_out, len);
      s.strm.next_out += len;
      s.strm.avail_out -= len;
      s.strm.total_out += len;
    }
  } while (last === 0);

  /* Update the sliding window with the last s->w_size bytes of the copied
   * data, or append all of the copied data to the existing window if less
   * than s->w_size bytes were copied. Also update the number of bytes to
   * insert in the hash tables, in the event that deflateParams() switches to
   * a non-zero compression level.
   */
  used -= s.strm.avail_in;    /* number of input bytes directly copied */
  if (used) {
    /* If any input was used, then no unused input remains in the window,
     * therefore s->block_start == s->strstart.
     */
    if (used >= s.w_size) {  /* supplant the previous history */
      s.matches = 2;     /* clear hash */
      //zmemcpy(s->window, s->strm->next_in - s->w_size, s->w_size);
      s.window.set(s.strm.input.subarray(s.strm.next_in - s.w_size, s.strm.next_in), 0);
      s.strstart = s.w_size;
      s.insert = s.strstart;
    }
    else {
      if (s.window_size - s.strstart <= used) {
        /* Slide the window down. */
        s.strstart -= s.w_size;
        //zmemcpy(s->window, s->window + s->w_size, s->strstart);
        s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
        if (s.matches < 2) {
          s.matches++;   /* add a pending slide_hash() */
        }
        if (s.insert > s.strstart) {
          s.insert = s.strstart;
        }
      }
      //zmemcpy(s->window + s->strstart, s->strm->next_in - used, used);
      s.window.set(s.strm.input.subarray(s.strm.next_in - used, s.strm.next_in), s.strstart);
      s.strstart += used;
      s.insert += used > s.w_size - s.insert ? s.w_size - s.insert : used;
    }
    s.block_start = s.strstart;
  }
  if (s.high_water < s.strstart) {
    s.high_water = s.strstart;
  }

  /* If the last block was written to next_out, then done. */
  if (last) {
    return BS_FINISH_DONE;
  }

  /* If flushing and all input has been consumed, then done. */
  if (flush !== Z_NO_FLUSH$2 && flush !== Z_FINISH$3 &&
    s.strm.avail_in === 0 && s.strstart === s.block_start) {
    return BS_BLOCK_DONE;
  }

  /* Fill the window with any remaining input. */
  have = s.window_size - s.strstart;
  if (s.strm.avail_in > have && s.block_start >= s.w_size) {
    /* Slide the window down. */
    s.block_start -= s.w_size;
    s.strstart -= s.w_size;
    //zmemcpy(s->window, s->window + s->w_size, s->strstart);
    s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
    if (s.matches < 2) {
      s.matches++;       /* add a pending slide_hash() */
    }
    have += s.w_size;      /* more space now */
    if (s.insert > s.strstart) {
      s.insert = s.strstart;
    }
  }
  if (have > s.strm.avail_in) {
    have = s.strm.avail_in;
  }
  if (have) {
    read_buf(s.strm, s.window, s.strstart, have);
    s.strstart += have;
    s.insert += have > s.w_size - s.insert ? s.w_size - s.insert : have;
  }
  if (s.high_water < s.strstart) {
    s.high_water = s.strstart;
  }

  /* There was not enough avail_out to write a complete worthy or flushed
   * stored block to next_out. Write a stored block to pending instead, if we
   * have enough input for a worthy block, or if flushing and there is enough
   * room for the remaining input as a stored block in the pending buffer.
   */
  have = (s.bi_valid + 42) >> 3;     /* number of header bytes */
    /* maximum stored block length that will fit in pending: */
  have = s.pending_buf_size - have > 65535/* MAX_STORED */ ? 65535/* MAX_STORED */ : s.pending_buf_size - have;
  min_block = have > s.w_size ? s.w_size : have;
  left = s.strstart - s.block_start;
  if (left >= min_block ||
     ((left || flush === Z_FINISH$3) && flush !== Z_NO_FLUSH$2 &&
     s.strm.avail_in === 0 && left <= have)) {
    len = left > have ? have : left;
    last = flush === Z_FINISH$3 && s.strm.avail_in === 0 &&
         len === left ? 1 : 0;
    _tr_stored_block(s, s.block_start, len, last);
    s.block_start += len;
    flush_pending(s.strm);
  }

  /* We've done all we can with the available input and output. */
  return last ? BS_FINISH_STARTED : BS_NEED_MORE;
};


/* ===========================================================================
 * Compress as much as possible from the input stream, return the current
 * block state.
 * This function does not perform lazy evaluation of matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 */
const deflate_fast = (s, flush) => {

  let hash_head;        /* head of the hash chain */
  let bflush;           /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break; /* flush the current block */
      }
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      hash_head = INSERT_STRING(s, s.strstart);
    }

    /* Find the longest match, discarding those <= prev_length.
     * At this point we have always match_length < MIN_MATCH
     */
    if (hash_head !== 0/*NIL*/ && ((s.strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */
    }
    if (s.match_length >= MIN_MATCH) {
      // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

      /*** _tr_tally_dist(s, s.strstart - s.match_start,
                     s.match_length - MIN_MATCH, bflush); ***/
      bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;

      /* Insert new strings in the hash table only if the match length
       * is not too large. This saves time but degrades compression.
       */
      if (s.match_length <= s.max_lazy_match/*max_insert_length*/ && s.lookahead >= MIN_MATCH) {
        s.match_length--; /* string at strstart already in table */
        do {
          s.strstart++;
          hash_head = INSERT_STRING(s, s.strstart);
          /* strstart never exceeds WSIZE-MAX_MATCH, so there are
           * always MIN_MATCH bytes ahead.
           */
        } while (--s.match_length !== 0);
        s.strstart++;
      } else
      {
        s.strstart += s.match_length;
        s.match_length = 0;
        if (s.legacy_hash) {
          s.ins_h = s.window[s.strstart];
          /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]);

//#if MIN_MATCH != 3
//                Call UPDATE_HASH() MIN_MATCH-3 more times
//#endif
          /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
           * matter since it will be recomputed at next deflate call.
           */
        }
      }
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s.window[s.strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = ((s.strstart < (MIN_MATCH - 1)) ? s.strstart : MIN_MATCH - 1);
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
};

/* ===========================================================================
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next window position.
 */
const deflate_slow = (s, flush) => {

  let hash_head;          /* head of hash chain */
  let bflush;              /* set if current block must be flushed */

  let max_insert;

  /* Process the input block. */
  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      hash_head = INSERT_STRING(s, s.strstart);
    }

    /* Find the longest match, discarding those <= prev_length.
     */
    s.prev_length = s.match_length;
    s.prev_match = s.match_start;
    s.match_length = MIN_MATCH - 1;

    if (hash_head !== 0/*NIL*/ && s.prev_length < s.max_lazy_match &&
        s.strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD)/*MAX_DIST(s)*/) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */

      if (s.match_length <= 5 &&
         (s.strategy === Z_FILTERED || (s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096/*TOO_FAR*/))) {

        /* If prev_match is also MIN_MATCH, match_start is garbage
         * but we will ignore the current match anyway.
         */
        s.match_length = MIN_MATCH - 1;
      }
    }
    /* If there was a match at the previous step and the current
     * match is not better, output the previous match:
     */
    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
      max_insert = s.strstart + s.lookahead - MIN_MATCH;
      /* Do not insert strings in hash table beyond this. */

      //check_match(s, s.strstart-1, s.prev_match, s.prev_length);

      /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                     s.prev_length - MIN_MATCH, bflush);***/
      bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
      /* Insert in hash table all strings up to the end of the match.
       * strstart-1 and strstart are already inserted. If there is not
       * enough lookahead, the last two strings are not inserted in
       * the hash table.
       */
      s.lookahead -= s.prev_length - 1;
      s.prev_length -= 2;
      do {
        if (++s.strstart <= max_insert) {
          hash_head = INSERT_STRING(s, s.strstart);
        }
      } while (--s.prev_length !== 0);
      s.match_available = 0;
      s.match_length = MIN_MATCH - 1;
      s.strstart++;

      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }

    } else if (s.match_available) {
      /* If there was no match at the previous position, output a
       * single literal. If there was a match but the current match
       * is longer, truncate the previous match to a single literal.
       */
      //Tracevv((stderr,"%c", s->window[s->strstart-1]));
      /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);

      if (bflush) {
        /*** FLUSH_BLOCK_ONLY(s, 0) ***/
        flush_block_only(s, false);
        /***/
      }
      s.strstart++;
      s.lookahead--;
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    } else {
      /* There is no previous match to compare with, wait for
       * the next step to decide.
       */
      s.match_available = 1;
      s.strstart++;
      s.lookahead--;
    }
  }
  //Assert (flush != Z_NO_FLUSH, "no flush?");
  if (s.match_available) {
    //Tracevv((stderr,"%c", s->window[s->strstart-1]));
    /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
    bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);

    s.match_available = 0;
  }
  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_BLOCK_DONE;
};


/* ===========================================================================
 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
 * deflate switches away from Z_RLE.)
 */
const deflate_rle = (s, flush) => {

  let bflush;            /* set if current block must be flushed */
  let prev;              /* byte at distance one to match */
  let scan, strend;      /* scan goes up to strend for length of run */

  const _win = s.window;

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the longest run, plus one for the unrolled loop.
     */
    if (s.lookahead <= MAX_MATCH) {
      fill_window(s);
      if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH$2) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* See how many times the previous byte repeats */
    s.match_length = 0;
    if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
      scan = s.strstart - 1;
      prev = _win[scan];
      if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
        strend = s.strstart + MAX_MATCH;
        do {
          /*jshint noempty:false*/
        } while (prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 scan < strend);
        s.match_length = MAX_MATCH - (strend - scan);
        if (s.match_length > s.lookahead) {
          s.match_length = s.lookahead;
        }
      }
      //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
    }

    /* Emit match if have run of MIN_MATCH or longer, else emit literal */
    if (s.match_length >= MIN_MATCH) {
      //check_match(s, s.strstart, s.strstart - 1, s.match_length);

      /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
      bflush = _tr_tally(s, 1, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;
      s.strstart += s.match_length;
      s.match_length = 0;
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s->window[s->strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
};

/* ===========================================================================
 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
 * (It will be regenerated if this run of deflate switches away from Huffman.)
 */
const deflate_huff = (s, flush) => {

  let bflush;             /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we have a literal to write. */
    if (s.lookahead === 0) {
      fill_window(s);
      if (s.lookahead === 0) {
        if (flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        break;      /* flush the current block */
      }
    }

    /* Output a literal byte */
    s.match_length = 0;
    //Tracevv((stderr,"%c", s->window[s->strstart]));
    /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
    bflush = _tr_tally(s, 0, s.window[s.strstart]);
    s.lookahead--;
    s.strstart++;
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
};

/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */
function Config(good_length, max_lazy, nice_length, max_chain, func) {

  this.good_length = good_length;
  this.max_lazy = max_lazy;
  this.nice_length = nice_length;
  this.max_chain = max_chain;
  this.func = func;
}

const configuration_table = [
  /*      good lazy nice chain */
  new Config(0, 0, 0, 0, deflate_stored),          /* 0 store only */
  new Config(4, 4, 8, 4, deflate_fast),            /* 1 max speed, no lazy matches */
  new Config(4, 5, 16, 8, deflate_fast),           /* 2 */
  new Config(4, 6, 32, 32, deflate_fast),          /* 3 */

  new Config(4, 4, 16, 16, deflate_slow),          /* 4 lazy matches */
  new Config(8, 16, 32, 32, deflate_slow),         /* 5 */
  new Config(8, 16, 128, 128, deflate_slow),       /* 6 */
  new Config(8, 32, 128, 256, deflate_slow),       /* 7 */
  new Config(32, 128, 258, 1024, deflate_slow),    /* 8 */
  new Config(32, 258, 258, 4096, deflate_slow)     /* 9 max compression */
];


/* ===========================================================================
 * Initialize the "longest match" routines for a new zlib stream
 */
const lm_init = (s) => {

  s.window_size = 2 * s.w_size;

  /*** CLEAR_HASH(s); ***/
  zero(s.head); // Fill with NIL (= 0);

  /* Set the default configuration parameters:
   */
  s.max_lazy_match = configuration_table[s.level].max_lazy;
  s.good_match = configuration_table[s.level].good_length;
  s.nice_match = configuration_table[s.level].nice_length;
  s.max_chain_length = configuration_table[s.level].max_chain;

  s.strstart = 0;
  s.block_start = 0;
  s.lookahead = 0;
  s.insert = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  s.ins_h = 0;
};


function DeflateState() {
  this.strm = null;            /* pointer back to this zlib stream */
  this.status = 0;            /* as the name implies */
  this.pending_buf = null;      /* output still pending */
  this.pending_buf_size = 0;  /* size of pending_buf */
  this.pending_out = 0;       /* next pending byte to output to the stream */
  this.pending = 0;           /* nb of bytes in the pending buffer */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  this.gzhead = null;         /* gzip header information to write */
  this.gzindex = 0;           /* where in extra, name, or comment */
  this.method = Z_DEFLATED$2; /* can only be DEFLATED */
  this.last_flush = -1;   /* value of flush param for previous deflate call */

  this.w_size = 0;  /* LZ77 window size (32K by default) */
  this.w_bits = 0;  /* log2(w_size)  (8..16) */
  this.w_mask = 0;  /* w_size - 1 */

  this.window = null;
  /* Sliding window. Input bytes are read into the second half of the window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */

  this.window_size = 0;
  /* Actual size of window: 2*wSize, except when the user input buffer
   * is directly used as sliding window.
   */

  this.prev = null;
  /* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a window index modulo 32K.
   */

  this.head = null;   /* Heads of the hash chains or NIL. */

  this.ins_h = 0;       /* hash index of string to be inserted */
  this.legacy_hash = 0; /* use classic zlib hash instead of default ANZAC++ */
  this.hash_size = 0;   /* number of elements in hash table */
  this.hash_bits = 0;   /* log2(hash_size) */
  this.hash_mask = 0;   /* hash_size-1 */

  this.hash_shift = 0;
  /* Number of bits by which ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */

  this.block_start = 0;
  /* Window position at the beginning of the current output block. Gets
   * negative when the window is moved backwards.
   */

  this.match_length = 0;      /* length of best match */
  this.prev_match = 0;        /* previous match */
  this.match_available = 0;   /* set if previous match exists */
  this.strstart = 0;          /* start of string to insert */
  this.match_start = 0;       /* start of matching string */
  this.lookahead = 0;         /* number of valid bytes ahead in window */

  this.prev_length = 0;
  /* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */

  this.max_chain_length = 0;
  /* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */

  this.max_lazy_match = 0;
  /* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */
  // That's alias to max_lazy_match, don't use directly
  //this.max_insert_length = 0;
  /* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */

  this.level = 0;     /* compression level (1..9) */
  this.strategy = 0;  /* favor or force Huffman coding*/

  this.good_match = 0;
  /* Use a faster search when the previous match is longer than this */

  this.nice_match = 0; /* Stop searching when current match exceeds this */

              /* used by trees.c: */

  /* Didn't use ct_data typedef below to suppress compiler warning */

  // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
  // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
  // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

  // Use flat array of DOUBLE size, with interleaved fata,
  // because JS does not support effective
  this.dyn_ltree  = new Uint16Array(HEAP_SIZE * 2);
  this.dyn_dtree  = new Uint16Array((2 * D_CODES + 1) * 2);
  this.bl_tree    = new Uint16Array((2 * BL_CODES + 1) * 2);
  zero(this.dyn_ltree);
  zero(this.dyn_dtree);
  zero(this.bl_tree);

  this.l_desc   = null;         /* desc. for literal tree */
  this.d_desc   = null;         /* desc. for distance tree */
  this.bl_desc  = null;         /* desc. for bit length tree */

  //ush bl_count[MAX_BITS+1];
  this.bl_count = new Uint16Array(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
  this.heap = new Uint16Array(2 * L_CODES + 1);  /* heap used to build the Huffman trees */
  zero(this.heap);

  this.heap_len = 0;               /* number of elements in the heap */
  this.heap_max = 0;               /* element of largest frequency */
  /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all trees.
   */

  this.depth = new Uint16Array(2 * L_CODES + 1); //uch depth[2*L_CODES+1];
  zero(this.depth);
  /* Depth of each subtree used as tie breaker for trees of equal frequency
   */

  this.sym_buf = 0;        /* buffer for distances and literals/lengths */

  this.lit_bufsize = 0;
  /* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */

  this.sym_next = 0;      /* running index in sym_buf */
  this.sym_end = 0;       /* symbol table full when sym_next reaches this */

  this.opt_len = 0;       /* bit length of current block with optimal trees */
  this.static_len = 0;    /* bit length of current block with static trees */
  this.matches = 0;       /* number of string matches in current block */
  this.insert = 0;        /* bytes at end of window left to insert */


  this.bi_buf = 0;
  /* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */
  this.bi_valid = 0;
  /* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */

  // Used for window memory init. We safely ignore it for JS. That makes
  // sense only for pointers and memory check tools.
  //this.high_water = 0;
  /* High water mark offset in window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */
}


/* =========================================================================
 * Check for a valid deflate stream state. Return 0 if ok, 1 if not.
 */
const deflateStateCheck = (strm) => {

  if (!strm) {
    return 1;
  }
  const s = strm.state;
  if (!s || s.strm !== strm || (s.status !== INIT_STATE &&
//#ifdef GZIP
                                s.status !== GZIP_STATE &&
//#endif
                                s.status !== EXTRA_STATE &&
                                s.status !== NAME_STATE &&
                                s.status !== COMMENT_STATE &&
                                s.status !== HCRC_STATE &&
                                s.status !== BUSY_STATE &&
                                s.status !== FINISH_STATE)) {
    return 1;
  }
  return 0;
};


const deflateResetKeep = (strm) => {

  if (deflateStateCheck(strm)) {
    return err(strm, Z_STREAM_ERROR$2);
  }

  strm.total_in = strm.total_out = 0;
  strm.data_type = Z_UNKNOWN;

  const s = strm.state;
  s.pending = 0;
  s.pending_out = 0;

  if (s.wrap < 0) {
    s.wrap = -s.wrap;
    /* was made negative by deflate(..., Z_FINISH); */
  }
  s.status =
//#ifdef GZIP
    s.wrap === 2 ? GZIP_STATE :
//#endif
    s.wrap ? INIT_STATE : BUSY_STATE;
  strm.adler = (s.wrap === 2) ?
    0  // crc32(0, Z_NULL, 0)
  :
    1; // adler32(0, Z_NULL, 0)
  s.last_flush = -2;
  _tr_init(s);
  return Z_OK$3;
};


const deflateReset = (strm) => {

  const ret = deflateResetKeep(strm);
  if (ret === Z_OK$3) {
    lm_init(strm.state);
  }
  return ret;
};


const deflateSetHeader = (strm, head) => {

  if (deflateStateCheck(strm) || strm.state.wrap !== 2) {
    return Z_STREAM_ERROR$2;
  }
  strm.state.gzhead = head;
  return Z_OK$3;
};


const deflateInit2 = (strm, level, method, windowBits, memLevel, strategy, legacyHash) => {

  if (!strm) { // === Z_NULL
    return Z_STREAM_ERROR$2;
  }
  let wrap = 1;

  if (level === Z_DEFAULT_COMPRESSION$1) {
    level = 6;
  }

  if (windowBits < 0) { /* suppress zlib wrapper */
    wrap = 0;
    windowBits = -windowBits;
  }

  else if (windowBits > 15) {
    wrap = 2;           /* write gzip wrapper instead */
    windowBits -= 16;
  }


  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED$2 ||
    windowBits < 8 || windowBits > 15 || level < 0 || level > 9 ||
    strategy < 0 || strategy > Z_FIXED || (windowBits === 8 && wrap !== 1)) {
    return err(strm, Z_STREAM_ERROR$2);
  }


  if (windowBits === 8) {
    windowBits = 9;
  }
  /* until 256-byte window bug fixed */

  const s = new DeflateState();

  strm.state = s;
  s.strm = strm;
  s.status = INIT_STATE;     /* to pass state test in deflateReset() */

  s.wrap = wrap;
  s.gzhead = null;
  s.w_bits = windowBits;
  s.w_size = 1 << s.w_bits;
  s.w_mask = s.w_size - 1;

  s.legacy_hash = legacyHash ? 1 : 0;

  s.hash_bits = memLevel + 7;
  /* ANZAC++ hash needs >= 15 hash bits to span its 4 read bytes. */
  if (!s.legacy_hash && s.hash_bits < 15) {
    s.hash_bits = 15;
  }
  s.hash_size = 1 << s.hash_bits;
  s.hash_mask = s.hash_size - 1;
  s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);

  s.window = new Uint8Array(s.w_size * 2);
  s.head = new Uint16Array(s.hash_size);
  s.prev = new Uint16Array(s.w_size);

  // Don't need mem init magic for JS.
  //s.high_water = 0;  /* nothing written to s->window yet */

  s.lit_bufsize = 1 << (memLevel + 6); /* 16K elements by default */

  /* We overlay pending_buf and sym_buf. This works since the average size
   * for length/distance pairs over any compressed block is assured to be 31
   * bits or less.
   *
   * Analysis: The longest fixed codes are a length code of 8 bits plus 5
   * extra bits, for lengths 131 to 257. The longest fixed distance codes are
   * 5 bits plus 13 extra bits, for distances 16385 to 32768. The longest
   * possible fixed-codes length/distance pair is then 31 bits total.
   *
   * sym_buf starts one-fourth of the way into pending_buf. So there are
   * three bytes in sym_buf for every four bytes in pending_buf. Each symbol
   * in sym_buf is three bytes -- two for the distance and one for the
   * literal/length. As each symbol is consumed, the pointer to the next
   * sym_buf value to read moves forward three bytes. From that symbol, up to
   * 31 bits are written to pending_buf. The closest the written pending_buf
   * bits gets to the next sym_buf symbol to read is just before the last
   * code is written. At that time, 31*(n-2) bits have been written, just
   * after 24*(n-2) bits have been consumed from sym_buf. sym_buf starts at
   * 8*n bits into pending_buf. (Note that the symbol buffer fills when n-1
   * symbols are written.) The closest the writing gets to what is unread is
   * then n+14 bits. Here n is lit_bufsize, which is 16384 by default, and
   * can range from 128 to 32768.
   *
   * Therefore, at a minimum, there are 142 bits of space between what is
   * written and what is read in the overlain buffers, so the symbols cannot
   * be overwritten by the compressed data. That space is actually 139 bits,
   * due to the three-bit fixed-code block header.
   *
   * That covers the case where either Z_FIXED is specified, forcing fixed
   * codes, or when the use of fixed codes is chosen, because that choice
   * results in a smaller compressed block than dynamic codes. That latter
   * condition then assures that the above analysis also covers all dynamic
   * blocks. A dynamic-code block will only be chosen to be emitted if it has
   * fewer bits than a fixed-code block would for the same set of symbols.
   * Therefore its average symbol length is assured to be less than 31. So
   * the compressed data for a dynamic block also cannot overwrite the
   * symbols from which it is being constructed.
   */

  s.pending_buf_size = s.lit_bufsize * 4;
  s.pending_buf = new Uint8Array(s.pending_buf_size);

  // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
  //s->sym_buf = s->pending_buf + s->lit_bufsize;
  s.sym_buf = s.lit_bufsize;

  //s->sym_end = (s->lit_bufsize - 1) * 3;
  s.sym_end = (s.lit_bufsize - 1) * 3;
  /* We avoid equality with lit_bufsize*3 because of wraparound at 64K
   * on 16 bit machines and because stored blocks are restricted to
   * 64K-1 bytes.
   */

  s.level = level;
  s.strategy = strategy;
  s.method = method;

  return deflateReset(strm);
};

const deflateInit = (strm, level) => {

  return deflateInit2(strm, level, Z_DEFLATED$2, MAX_WBITS$1, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY$1);
};


/* ========================================================================= */
const deflate$2 = (strm, flush) => {

  if (deflateStateCheck(strm) || flush > Z_BLOCK$1 || flush < 0) {
    return strm ? err(strm, Z_STREAM_ERROR$2) : Z_STREAM_ERROR$2;
  }

  const s = strm.state;

  if (!strm.output ||
      (strm.avail_in !== 0 && !strm.input) ||
      (s.status === FINISH_STATE && flush !== Z_FINISH$3)) {
    return err(strm, (strm.avail_out === 0) ? Z_BUF_ERROR$2 : Z_STREAM_ERROR$2);
  }

  const old_flush = s.last_flush;
  s.last_flush = flush;

  /* Flush as much pending output as possible */
  if (s.pending !== 0) {
    flush_pending(strm);
    if (strm.avail_out === 0) {
      /* Since avail_out is 0, deflate will be called again with
       * more output space, but possibly with both pending and
       * avail_in equal to zero. There won't be anything to do,
       * but this is not an error situation so make sure we
       * return OK instead of BUF_ERROR at next call of deflate:
       */
      s.last_flush = -1;
      return Z_OK$3;
    }

    /* Make sure there is something to do and avoid duplicate consecutive
     * flushes. For repeated and useless calls with Z_FINISH, we keep
     * returning Z_STREAM_END instead of Z_BUF_ERROR.
     */
  } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) &&
    flush !== Z_FINISH$3) {
    return err(strm, Z_BUF_ERROR$2);
  }

  /* User must not provide more input after the first FINISH: */
  if (s.status === FINISH_STATE && strm.avail_in !== 0) {
    return err(strm, Z_BUF_ERROR$2);
  }

  /* Write the header */
  if (s.status === INIT_STATE && s.wrap === 0) {
    s.status = BUSY_STATE;
  }
  if (s.status === INIT_STATE) {
    /* zlib header */
    let header = (Z_DEFLATED$2 + ((s.w_bits - 8) << 4)) << 8;
    let level_flags = -1;

    if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
      level_flags = 0;
    } else if (s.level < 6) {
      level_flags = 1;
    } else if (s.level === 6) {
      level_flags = 2;
    } else {
      level_flags = 3;
    }
    header |= (level_flags << 6);
    if (s.strstart !== 0) { header |= PRESET_DICT; }
    header += 31 - (header % 31);

    putShortMSB(s, header);

    /* Save the adler32 of the preset dictionary: */
    if (s.strstart !== 0) {
      putShortMSB(s, strm.adler >>> 16);
      putShortMSB(s, strm.adler & 0xffff);
    }
    strm.adler = 1; // adler32(0L, Z_NULL, 0);
    s.status = BUSY_STATE;

    /* Compression must start with an empty pending buffer */
    flush_pending(strm);
    if (s.pending !== 0) {
      s.last_flush = -1;
      return Z_OK$3;
    }
  }
//#ifdef GZIP
  if (s.status === GZIP_STATE) {
    /* gzip header */
    strm.adler = 0;  //crc32(0L, Z_NULL, 0);
    put_byte(s, 31);
    put_byte(s, 139);
    put_byte(s, 8);
    if (!s.gzhead) { // s->gzhead == Z_NULL
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, s.level === 9 ? 2 :
                  (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                   4 : 0));
      put_byte(s, OS_CODE);
      s.status = BUSY_STATE;

      /* Compression must start with an empty pending buffer */
      flush_pending(strm);
      if (s.pending !== 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    }
    else {
      put_byte(s, (s.gzhead.text ? 1 : 0) +
                  (s.gzhead.hcrc ? 2 : 0) +
                  (!s.gzhead.extra ? 0 : 4) +
                  (!s.gzhead.name ? 0 : 8) +
                  (!s.gzhead.comment ? 0 : 16)
      );
      put_byte(s, s.gzhead.time & 0xff);
      put_byte(s, (s.gzhead.time >> 8) & 0xff);
      put_byte(s, (s.gzhead.time >> 16) & 0xff);
      put_byte(s, (s.gzhead.time >> 24) & 0xff);
      put_byte(s, s.level === 9 ? 2 :
                  (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                   4 : 0));
      put_byte(s, s.gzhead.os & 0xff);
      if (s.gzhead.extra && s.gzhead.extra.length) {
        put_byte(s, s.gzhead.extra.length & 0xff);
        put_byte(s, (s.gzhead.extra.length >> 8) & 0xff);
      }
      if (s.gzhead.hcrc) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending, 0);
      }
      s.gzindex = 0;
      s.status = EXTRA_STATE;
    }
  }
  if (s.status === EXTRA_STATE) {
    if (s.gzhead.extra/* != Z_NULL*/) {
      let beg = s.pending;   /* start of bytes to update crc */
      let left = (s.gzhead.extra.length & 0xffff) - s.gzindex;
      while (s.pending + left > s.pending_buf_size) {
        let copy = s.pending_buf_size - s.pending;
        // zmemcpy(s.pending_buf + s.pending,
        //    s.gzhead.extra + s.gzindex, copy);
        s.pending_buf.set(s.gzhead.extra.subarray(s.gzindex, s.gzindex + copy), s.pending);
        s.pending = s.pending_buf_size;
        //--- HCRC_UPDATE(beg) ---//
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        //---//
        s.gzindex += copy;
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
        beg = 0;
        left -= copy;
      }
      // JS specific: s.gzhead.extra may be TypedArray or Array for backward compatibility
      //              TypedArray.slice and TypedArray.from don't exist in IE10-IE11
      let gzhead_extra = new Uint8Array(s.gzhead.extra);
      // zmemcpy(s->pending_buf + s->pending,
      //     s->gzhead->extra + s->gzindex, left);
      s.pending_buf.set(gzhead_extra.subarray(s.gzindex, s.gzindex + left), s.pending);
      s.pending += left;
      //--- HCRC_UPDATE(beg) ---//
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      //---//
      s.gzindex = 0;
    }
    s.status = NAME_STATE;
  }
  if (s.status === NAME_STATE) {
    if (s.gzhead.name/* != Z_NULL*/) {
      let beg = s.pending;   /* start of bytes to update crc */
      let val;
      do {
        if (s.pending === s.pending_buf_size) {
          //--- HCRC_UPDATE(beg) ---//
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          //---//
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
          beg = 0;
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.name.length) {
          val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);
      //--- HCRC_UPDATE(beg) ---//
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      //---//
      s.gzindex = 0;
    }
    s.status = COMMENT_STATE;
  }
  if (s.status === COMMENT_STATE) {
    if (s.gzhead.comment/* != Z_NULL*/) {
      let beg = s.pending;   /* start of bytes to update crc */
      let val;
      do {
        if (s.pending === s.pending_buf_size) {
          //--- HCRC_UPDATE(beg) ---//
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          //---//
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
          beg = 0;
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.comment.length) {
          val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);
      //--- HCRC_UPDATE(beg) ---//
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      //---//
    }
    s.status = HCRC_STATE;
  }
  if (s.status === HCRC_STATE) {
    if (s.gzhead.hcrc) {
      if (s.pending + 2 > s.pending_buf_size) {
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
      }
      put_byte(s, strm.adler & 0xff);
      put_byte(s, (strm.adler >> 8) & 0xff);
      strm.adler = 0; //crc32(0L, Z_NULL, 0);
    }
    s.status = BUSY_STATE;

    /* Compression must start with an empty pending buffer */
    flush_pending(strm);
    if (s.pending !== 0) {
      s.last_flush = -1;
      return Z_OK$3;
    }
  }
//#endif

  /* Start a new block or continue the current one.
   */
  if (strm.avail_in !== 0 || s.lookahead !== 0 ||
    (flush !== Z_NO_FLUSH$2 && s.status !== FINISH_STATE)) {
    let bstate = s.level === 0 ? deflate_stored(s, flush) :
                 s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) :
                 s.strategy === Z_RLE ? deflate_rle(s, flush) :
                 configuration_table[s.level].func(s, flush);

    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
      s.status = FINISH_STATE;
    }
    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        /* avoid BUF_ERROR next call, see above */
      }
      return Z_OK$3;
      /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
       * of deflate should use the same flush parameter to make sure
       * that the flush is complete. So we don't have to output an
       * empty block here, this will be done at next call. This also
       * ensures that for a very small output buffer, we emit at most
       * one empty block.
       */
    }
    if (bstate === BS_BLOCK_DONE) {
      if (flush === Z_PARTIAL_FLUSH) {
        _tr_align(s);
      }
      else if (flush !== Z_BLOCK$1) { /* FULL_FLUSH or SYNC_FLUSH */

        _tr_stored_block(s, 0, 0, false);
        /* For a full flush, this empty block will be recognized
         * as a special marker by inflate_sync().
         */
        if (flush === Z_FULL_FLUSH$1) {
          /*** CLEAR_HASH(s); ***/             /* forget history */
          zero(s.head); // Fill with NIL (= 0);

          if (s.lookahead === 0) {
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
          }
        }
      }
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */
        return Z_OK$3;
      }
    }
  }

  if (flush !== Z_FINISH$3) { return Z_OK$3; }
  if (s.wrap <= 0) { return Z_STREAM_END$3; }

  /* Write the trailer */
  if (s.wrap === 2) {
    put_byte(s, strm.adler & 0xff);
    put_byte(s, (strm.adler >> 8) & 0xff);
    put_byte(s, (strm.adler >> 16) & 0xff);
    put_byte(s, (strm.adler >> 24) & 0xff);
    put_byte(s, strm.total_in & 0xff);
    put_byte(s, (strm.total_in >> 8) & 0xff);
    put_byte(s, (strm.total_in >> 16) & 0xff);
    put_byte(s, (strm.total_in >> 24) & 0xff);
  }
  else
  {
    putShortMSB(s, strm.adler >>> 16);
    putShortMSB(s, strm.adler & 0xffff);
  }

  flush_pending(strm);
  /* If avail_out is zero, the application will call deflate again
   * to flush the rest.
   */
  if (s.wrap > 0) { s.wrap = -s.wrap; }
  /* write the trailer only once! */
  return s.pending !== 0 ? Z_OK$3 : Z_STREAM_END$3;
};


const deflateEnd = (strm) => {

  if (deflateStateCheck(strm)) {
    return Z_STREAM_ERROR$2;
  }

  const status = strm.state.status;

  strm.state = null;

  return status === BUSY_STATE ? err(strm, Z_DATA_ERROR$2) : Z_OK$3;
};


/* =========================================================================
 * Initializes the compression dictionary from the given byte
 * sequence without producing any compressed output.
 */
const deflateSetDictionary = (strm, dictionary) => {

  let dictLength = dictionary.length;

  if (deflateStateCheck(strm)) {
    return Z_STREAM_ERROR$2;
  }

  const s = strm.state;
  const wrap = s.wrap;

  if (wrap === 2 || (wrap === 1 && s.status !== INIT_STATE) || s.lookahead) {
    return Z_STREAM_ERROR$2;
  }

  /* when using zlib wrappers, compute Adler-32 for provided dictionary */
  if (wrap === 1) {
    /* adler32(strm->adler, dictionary, dictLength); */
    strm.adler = adler32_1(strm.adler, dictionary, dictLength, 0);
  }

  s.wrap = 0;   /* avoid computing Adler-32 in read_buf */

  /* if dictionary would fill window, just replace the history */
  if (dictLength >= s.w_size) {
    if (wrap === 0) {            /* already empty otherwise */
      /*** CLEAR_HASH(s); ***/
      zero(s.head); // Fill with NIL (= 0);
      s.strstart = 0;
      s.block_start = 0;
      s.insert = 0;
    }
    /* use the tail */
    // dictionary = dictionary.slice(dictLength - s.w_size);
    let tmpDict = new Uint8Array(s.w_size);
    tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);
    dictionary = tmpDict;
    dictLength = s.w_size;
  }
  /* insert dictionary into window and hash */
  const avail = strm.avail_in;
  const next = strm.next_in;
  const input = strm.input;
  strm.avail_in = dictLength;
  strm.next_in = 0;
  strm.input = dictionary;
  fill_window(s);
  while (s.lookahead >= MIN_MATCH) {
    let str = s.strstart;
    let n = s.lookahead - (MIN_MATCH - 1);
    do {
      INSERT_STRING(s, str);
      str++;
    } while (--n);
    s.strstart = str;
    s.lookahead = MIN_MATCH - 1;
    fill_window(s);
  }
  s.strstart += s.lookahead;
  s.block_start = s.strstart;
  s.insert = s.lookahead;
  s.lookahead = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  strm.next_in = next;
  strm.input = input;
  strm.avail_in = avail;
  s.wrap = wrap;
  return Z_OK$3;
};


var deflateInit_1 = deflateInit;
var deflateInit2_1 = deflateInit2;
var deflateReset_1 = deflateReset;
var deflateResetKeep_1 = deflateResetKeep;
var deflateSetHeader_1 = deflateSetHeader;
var deflate_2$1 = deflate$2;
var deflateEnd_1 = deflateEnd;
var deflateSetDictionary_1 = deflateSetDictionary;
var deflateInfo = 'pako deflate (from Nodeca project)';

/* Not implemented
module.exports.deflateBound = deflateBound;
module.exports.deflateCopy = deflateCopy;
module.exports.deflateGetDictionary = deflateGetDictionary;
module.exports.deflateParams = deflateParams;
module.exports.deflatePending = deflatePending;
module.exports.deflatePrime = deflatePrime;
module.exports.deflateTune = deflateTune;
*/

var deflate_1$2 = {
	deflateInit: deflateInit_1,
	deflateInit2: deflateInit2_1,
	deflateReset: deflateReset_1,
	deflateResetKeep: deflateResetKeep_1,
	deflateSetHeader: deflateSetHeader_1,
	deflate: deflate_2$1,
	deflateEnd: deflateEnd_1,
	deflateSetDictionary: deflateSetDictionary_1,
	deflateInfo: deflateInfo
};

const _has = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

var assign = function (obj /*from1, from2, from3, ...*/) {
  const sources = Array.prototype.slice.call(arguments, 1);
  while (sources.length) {
    const source = sources.shift();
    if (!source) { continue; }

    if (typeof source !== 'object') {
      throw new TypeError(source + 'must be non-object');
    }

    for (const p in source) {
      if (_has(source, p)) {
        obj[p] = source[p];
      }
    }
  }

  return obj;
};


// Join array of chunks to single array.
var flattenChunks = (chunks) => {
  // calculate data length
  let len = 0;

  for (let i = 0, l = chunks.length; i < l; i++) {
    len += chunks[i].length;
  }

  // join chunks
  const result = new Uint8Array(len);

  for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
    let chunk = chunks[i];
    result.set(chunk, pos);
    pos += chunk.length;
  }

  return result;
};

var common = {
	assign: assign,
	flattenChunks: flattenChunks
};

// String encode/decode helpers


// Quick check if we can use fast array to bin string conversion
//
// - apply(Array) can fail on Android 2.2
// - apply(Uint8Array) can fail on iOS 5.1 Safari
//
let STR_APPLY_UIA_OK = true;

try { String.fromCharCode.apply(null, new Uint8Array(1)); } catch (__) { STR_APPLY_UIA_OK = false; }


// Table with utf8 lengths (calculated by first byte of sequence)
// Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
// because max possible codepoint is 0x10ffff
const _utf8len = new Uint8Array(256);
for (let q = 0; q < 256; q++) {
  _utf8len[q] = (q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1);
}
_utf8len[254] = _utf8len[255] = 1; // Invalid sequence start


// convert string to array (typed, when possible)
var string2buf = (str) => {
  if (typeof TextEncoder === 'function' && TextEncoder.prototype.encode) {
    return new TextEncoder().encode(str);
  }

  let buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;

  // count binary size
  for (m_pos = 0; m_pos < str_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }

  // allocate buffer
  buf = new Uint8Array(buf_len);

  // convert
  for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    if (c < 0x80) {
      /* one byte */
      buf[i++] = c;
    } else if (c < 0x800) {
      /* two bytes */
      buf[i++] = 0xC0 | (c >>> 6);
      buf[i++] = 0x80 | (c & 0x3f);
    } else if (c < 0x10000) {
      /* three bytes */
      buf[i++] = 0xE0 | (c >>> 12);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    } else {
      /* four bytes */
      buf[i++] = 0xf0 | (c >>> 18);
      buf[i++] = 0x80 | (c >>> 12 & 0x3f);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    }
  }

  return buf;
};

// Helper
const buf2binstring = (buf, len) => {
  // On Chrome, the arguments in a function call that are allowed is `65534`.
  // If the length of the buffer is smaller than that, we can use this optimization,
  // otherwise we will take a slower path.
  if (len < 65534) {
    if (buf.subarray && STR_APPLY_UIA_OK) {
      return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
    }
  }

  let result = '';
  for (let i = 0; i < len; i++) {
    result += String.fromCharCode(buf[i]);
  }
  return result;
};


// convert array to string
var buf2string = (buf, max) => {
  const len = max || buf.length;

  if (typeof TextDecoder === 'function' && TextDecoder.prototype.decode) {
    return new TextDecoder().decode(buf.subarray(0, max));
  }

  let i, out;

  // Reserve max possible length (2 words per char)
  // NB: by unknown reasons, Array is significantly faster for
  //     String.fromCharCode.apply than Uint16Array.
  const utf16buf = new Array(len * 2);

  for (out = 0, i = 0; i < len;) {
    let c = buf[i++];
    // quick process ascii
    if (c < 0x80) { utf16buf[out++] = c; continue; }

    let c_len = _utf8len[c];
    // skip 5 & 6 byte codes
    if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len - 1; continue; }

    // apply mask on first byte
    c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
    // join the rest
    while (c_len > 1 && i < len) {
      c = (c << 6) | (buf[i++] & 0x3f);
      c_len--;
    }

    // terminated by end of string?
    if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }

    if (c < 0x10000) {
      utf16buf[out++] = c;
    } else {
      c -= 0x10000;
      utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
      utf16buf[out++] = 0xdc00 | (c & 0x3ff);
    }
  }

  return buf2binstring(utf16buf, out);
};


// Calculate max possible position in utf8 buffer,
// that will not break sequence. If that's not possible
// - (very small limits) return max size as is.
//
// buf[] - utf8 bytes array
// max   - length limit (mandatory);
var utf8border = (buf, max) => {

  max = max || buf.length;
  if (max > buf.length) { max = buf.length; }

  // go back from last position, until start of sequence found
  let pos = max - 1;
  while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }

  // Very small and broken sequence,
  // return max, because we should return something anyway.
  if (pos < 0) { return max; }

  // If we came to start of buffer - that means buffer is too small,
  // return max too.
  if (pos === 0) { return max; }

  return (pos + _utf8len[buf[pos]] > max) ? pos : max;
};

var strings = {
	string2buf: string2buf,
	buf2string: buf2string,
	utf8border: utf8border
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function ZStream() {
  /* next input byte */
  this.input = null; // JS specific, because we have no pointers
  this.next_in = 0;
  /* number of bytes available at input */
  this.avail_in = 0;
  /* total number of input bytes read so far */
  this.total_in = 0;
  /* next output byte should be put there */
  this.output = null; // JS specific, because we have no pointers
  this.next_out = 0;
  /* remaining free space at output */
  this.avail_out = 0;
  /* total number of bytes output so far */
  this.total_out = 0;
  /* last error message, NULL if no error */
  this.msg = ''/*Z_NULL*/;
  /* not visible by applications */
  this.state = null;
  /* best guess about the data type: binary or text */
  this.data_type = 2/*Z_UNKNOWN*/;
  /* adler32 value of the uncompressed data */
  this.adler = 0;
}

var zstream = ZStream;

const toString$1 = Object.prototype.toString;

/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_NO_FLUSH: Z_NO_FLUSH$1, Z_SYNC_FLUSH, Z_FULL_FLUSH, Z_FINISH: Z_FINISH$2,
  Z_OK: Z_OK$2, Z_STREAM_END: Z_STREAM_END$2,
  Z_DEFAULT_COMPRESSION,
  Z_DEFAULT_STRATEGY,
  Z_DEFLATED: Z_DEFLATED$1
} = constants$2;

/* ===========================================================================*/

const defaultOptions$1 = {
  level: Z_DEFAULT_COMPRESSION,
  method: Z_DEFLATED$1,
  chunkSize: 16384,
  windowBits: 15,
  memLevel: 8,
  strategy: Z_DEFAULT_STRATEGY,
  legacyHash: true
};

/**
 * class Deflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[deflate]],
 * [[deflateRaw]] and [[gzip]].
 **/

/* internal
 * Deflate.chunks -> Array
 *
 * Chunks of output data, if [[Deflate#onData]] not overridden.
 **/

/**
 * Deflate.result -> Uint8Array
 *
 * Compressed result, generated by default [[Deflate#onData]]
 * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Deflate#push]] with `Z_FINISH` / `true` param).
 **/

/**
 * Deflate.err -> Number
 *
 * Error code after deflate finished. 0 (Z_OK) on success.
 * You will not need it in real life, because deflate errors
 * are possible only on wrong options or bad `onData` / `onEnd`
 * custom handlers.
 **/

/**
 * Deflate.msg -> String
 *
 * Error message, if [[Deflate.err]] != 0
 **/


/**
 * new Deflate(options)
 * - options (Object): zlib deflate options.
 *
 * Creates new deflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `level`
 * - `windowBits`
 * - `memLevel`
 * - `strategy`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * - `legacyHash` (Boolean) - use the classic zlib hash (default), which matches
 *   canonical zlib output byte-for-byte. Set to `false` to use the faster
 *   ANZAC++ hash, which matches recent (chromium) node.js output instead.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw deflate
 * - `gzip` (Boolean) - create gzip wrapper
 * - `header` (Object) - custom header for gzip
 *   - `text` (Boolean) - true if compressed data believed to be text
 *   - `time` (Number) - modification time, unix timestamp
 *   - `os` (Number) - operation system code
 *   - `extra` (Array) - array of bytes with extra data (max 65536)
 *   - `name` (String) - file name (binary string)
 *   - `comment` (String) - comment (binary string)
 *   - `hcrc` (Boolean) - true if header crc should be added
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 *   , chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
 *   , chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * const deflate = new pako.Deflate({ level: 3});
 *
 * deflate.push(chunk1, false);
 * deflate.push(chunk2, true);  // true -> last chunk
 *
 * if (deflate.err) { throw new Error(deflate.err); }
 *
 * console.log(deflate.result);
 * ```
 **/
function Deflate$1(options) {
  this.options = common.assign({}, defaultOptions$1, options || {});

  let opt = this.options;

  if (opt.raw && (opt.windowBits > 0)) {
    opt.windowBits = -opt.windowBits;
  }

  else if (opt.gzip && (opt.windowBits > 0) && (opt.windowBits < 16)) {
    opt.windowBits += 16;
  }

  this.err    = 0;      // error code, if happens (0 = Z_OK)
  this.msg    = '';     // error message
  this.ended  = false;  // used to avoid multiple onEnd() calls
  this.chunks = [];     // chunks of compressed data

  this.strm = new zstream();
  this.strm.avail_out = 0;

  let status = deflate_1$2.deflateInit2(
    this.strm,
    opt.level,
    opt.method,
    opt.windowBits,
    opt.memLevel,
    opt.strategy,
    opt.legacyHash
  );

  if (status !== Z_OK$2) {
    throw new Error(messages[status]);
  }

  if (opt.header) {
    deflate_1$2.deflateSetHeader(this.strm, opt.header);
  }

  if (opt.dictionary) {
    let dict;
    // Convert data if needed
    if (typeof opt.dictionary === 'string') {
      // If we need to compress text, change encoding to utf8.
      dict = strings.string2buf(opt.dictionary);
    } else if (toString$1.call(opt.dictionary) === '[object ArrayBuffer]') {
      dict = new Uint8Array(opt.dictionary);
    } else {
      dict = opt.dictionary;
    }

    status = deflate_1$2.deflateSetDictionary(this.strm, dict);

    if (status !== Z_OK$2) {
      throw new Error(messages[status]);
    }

    this._dict_set = true;
  }
}

/**
 * Deflate#push(data[, flush_mode]) -> Boolean
 * - data (Uint8Array|ArrayBuffer|String): input data. Strings will be
 *   converted to utf8 byte sequence.
 * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
 *
 * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
 * new compressed chunks. Returns `true` on success. The last data block must
 * have `flush_mode` Z_FINISH (or `true`). That will flush internal pending
 * buffers and call [[Deflate#onEnd]].
 *
 * On fail call [[Deflate#onEnd]] with error code and return false.
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Deflate$1.prototype.push = function (data, flush_mode) {
  const strm = this.strm;
  const chunkSize = this.options.chunkSize;
  let status, _flush_mode;

  if (this.ended) { return false; }

  if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
  else _flush_mode = flush_mode === true ? Z_FINISH$2 : Z_NO_FLUSH$1;

  // Convert data if needed
  if (typeof data === 'string') {
    // If we need to compress text, change encoding to utf8.
    strm.input = strings.string2buf(data);
  } else if (toString$1.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  for (;;) {
    if (strm.avail_out === 0) {
      strm.output = new Uint8Array(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }

    // Make sure avail_out > 6 to avoid repeating markers
    if ((_flush_mode === Z_SYNC_FLUSH || _flush_mode === Z_FULL_FLUSH) && strm.avail_out <= 6) {
      this.onData(strm.output.subarray(0, strm.next_out));
      strm.avail_out = 0;
      continue;
    }

    status = deflate_1$2.deflate(strm, _flush_mode);

    // Ended => flush and finish
    if (status === Z_STREAM_END$2) {
      if (strm.next_out > 0) {
        this.onData(strm.output.subarray(0, strm.next_out));
      }
      status = deflate_1$2.deflateEnd(this.strm);
      this.onEnd(status);
      this.ended = true;
      return status === Z_OK$2;
    }

    // Flush if out buffer full
    if (strm.avail_out === 0) {
      this.onData(strm.output);
      continue;
    }

    // Flush if requested and has data
    if (_flush_mode > 0 && strm.next_out > 0) {
      this.onData(strm.output.subarray(0, strm.next_out));
      strm.avail_out = 0;
      continue;
    }

    if (strm.avail_in === 0) break;
  }

  return true;
};


/**
 * Deflate#onData(chunk) -> Void
 * - chunk (Uint8Array): output data.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Deflate$1.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};


/**
 * Deflate#onEnd(status) -> Void
 * - status (Number): deflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called once after you tell deflate that the input stream is
 * complete (Z_FINISH). By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Deflate$1.prototype.onEnd = function (status) {
  // On success - join
  if (status === Z_OK$2) {
    this.result = common.flattenChunks(this.chunks);
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};


/**
 * deflate(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * Compress `data` with deflate algorithm and `options`.
 *
 * Supported options are:
 *
 * - level
 * - windowBits
 * - memLevel
 * - strategy
 * - dictionary
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 * const data = new Uint8Array([1,2,3,4,5,6,7,8,9]);
 *
 * console.log(pako.deflate(data));
 * ```
 **/
function deflate$1(input, options) {
  const deflator = new Deflate$1(options);

  deflator.push(input, true);

  // That will never happens, if you don't cheat with options :)
  if (deflator.err) { throw deflator.msg || messages[deflator.err]; }

  return deflator.result;
}


/**
 * deflateRaw(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/
function deflateRaw$1(input, options) {
  options = options || {};
  options.raw = true;
  return deflate$1(input, options);
}


/**
 * gzip(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but create gzip wrapper instead of
 * deflate one.
 **/
function gzip$1(input, options) {
  options = options || {};
  options.gzip = true;
  return deflate$1(input, options);
}


var Deflate_1$1 = Deflate$1;
var deflate_2 = deflate$1;
var deflateRaw_1$1 = deflateRaw$1;
var gzip_1$1 = gzip$1;
var constants$1 = constants$2;

var deflate_1$1 = {
	Deflate: Deflate_1$1,
	deflate: deflate_2,
	deflateRaw: deflateRaw_1$1,
	gzip: gzip_1$1,
	constants: constants$1
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

// See state defs from inflate.js
const BAD$1 = 16209;       /* got a data error -- remain here until reset */
const TYPE$1 = 16191;      /* i: waiting for type bits, including last-flag bit */

/*
   Decode literal, length, and distance codes and write out the resulting
   literal and match bytes until either not enough input or output is
   available, an end-of-block is encountered, or a data error is encountered.
   When large enough input and output buffers are supplied to inflate(), for
   example, a 16K input buffer and a 64K output buffer, more than 95% of the
   inflate execution time is spent in this routine.

   Entry assumptions:

        state.mode === LEN
        strm.avail_in >= 6
        strm.avail_out >= 258
        start >= strm.avail_out
        state.bits < 8

   On return, state.mode is one of:

        LEN -- ran out of enough output space or enough available input
        TYPE -- reached end of block code, inflate() to interpret next block
        BAD -- error in block data

   Notes:

    - The maximum input bits used by a length/distance pair is 15 bits for the
      length code, 5 bits for the length extra, 15 bits for the distance code,
      and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
      Therefore if strm.avail_in >= 6, then there is enough input to avoid
      checking for available input while decoding.

    - The maximum bytes that a single length/distance pair can output is 258
      bytes, which is the maximum length that can be coded.  inflate_fast()
      requires strm.avail_out >= 258 for each loop to avoid checking for
      output space.
 */
var inffast = function inflate_fast(strm, start) {
  let _in;                    /* local strm.input */
  let last;                   /* have enough input while in < last */
  let _out;                   /* local strm.output */
  let beg;                    /* inflate()'s initial strm.output */
  let end;                    /* while out < end, enough space available */
//#ifdef INFLATE_STRICT
  let dmax;                   /* maximum distance from zlib header */
//#endif
  let wsize;                  /* window size or zero if not using window */
  let whave;                  /* valid bytes in the window */
  let wnext;                  /* window write index */
  // Use `s_window` instead `window`, avoid conflict with instrumentation tools
  let s_window;               /* allocated sliding window, if wsize != 0 */
  let hold;                   /* local strm.hold */
  let bits;                   /* local strm.bits */
  let lcode;                  /* local strm.lencode */
  let dcode;                  /* local strm.distcode */
  let lmask;                  /* mask for first level of length codes */
  let dmask;                  /* mask for first level of distance codes */
  let here;                   /* retrieved table entry */
  let op;                     /* code bits, operation, extra bits, or */
                              /*  window position, window bytes to copy */
  let len;                    /* match length, unused bytes */
  let dist;                   /* match distance */
  let from;                   /* where to copy match from */
  let from_source;


  let input, output; // JS specific, because we have no pointers

  /* copy state to local variables */
  const state = strm.state;
  //here = state.here;
  _in = strm.next_in;
  input = strm.input;
  last = _in + (strm.avail_in - 5);
  _out = strm.next_out;
  output = strm.output;
  beg = _out - (start - strm.avail_out);
  end = _out + (strm.avail_out - 257);
//#ifdef INFLATE_STRICT
  dmax = state.dmax;
//#endif
  wsize = state.wsize;
  whave = state.whave;
  wnext = state.wnext;
  s_window = state.window;
  hold = state.hold;
  bits = state.bits;
  lcode = state.lencode;
  dcode = state.distcode;
  lmask = (1 << state.lenbits) - 1;
  dmask = (1 << state.distbits) - 1;


  /* decode literals and length/distances until end-of-block or not enough
     input data or output space */

  top:
  do {
    if (bits < 15) {
      hold += input[_in++] << bits;
      bits += 8;
      hold += input[_in++] << bits;
      bits += 8;
    }

    here = lcode[hold & lmask];

    dolen:
    for (;;) { // Goto emulation
      op = here >>> 24/*here.bits*/;
      hold >>>= op;
      bits -= op;
      op = (here >>> 16) & 0xff/*here.op*/;
      if (op === 0) {                          /* literal */
        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
        //        "inflate:         literal '%c'\n" :
        //        "inflate:         literal 0x%02x\n", here.val));
        output[_out++] = here & 0xffff/*here.val*/;
      }
      else if (op & 16) {                     /* length base */
        len = here & 0xffff/*here.val*/;
        op &= 15;                           /* number of extra bits */
        if (op) {
          if (bits < op) {
            hold += input[_in++] << bits;
            bits += 8;
          }
          len += hold & ((1 << op) - 1);
          hold >>>= op;
          bits -= op;
        }
        //Tracevv((stderr, "inflate:         length %u\n", len));
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = dcode[hold & dmask];

        dodist:
        for (;;) { // goto emulation
          op = here >>> 24/*here.bits*/;
          hold >>>= op;
          bits -= op;
          op = (here >>> 16) & 0xff/*here.op*/;

          if (op & 16) {                      /* distance base */
            dist = here & 0xffff/*here.val*/;
            op &= 15;                       /* number of extra bits */
            if (bits < op) {
              hold += input[_in++] << bits;
              bits += 8;
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
              }
            }
            dist += hold & ((1 << op) - 1);
//#ifdef INFLATE_STRICT
            if (dist > dmax) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD$1;
              break top;
            }
//#endif
            hold >>>= op;
            bits -= op;
            //Tracevv((stderr, "inflate:         distance %u\n", dist));
            op = _out - beg;                /* max distance in output */
            if (dist > op) {                /* see if copy from window */
              op = dist - op;               /* distance back in window */
              if (op > whave) {
                if (state.sane) {
                  strm.msg = 'invalid distance too far back';
                  state.mode = BAD$1;
                  break top;
                }

// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//                if (len <= op - whave) {
//                  do {
//                    output[_out++] = 0;
//                  } while (--len);
//                  continue top;
//                }
//                len -= op - whave;
//                do {
//                  output[_out++] = 0;
//                } while (--op > whave);
//                if (op === 0) {
//                  from = _out - dist;
//                  do {
//                    output[_out++] = output[from++];
//                  } while (--len);
//                  continue top;
//                }
//#endif
              }
              from = 0; // window index
              from_source = s_window;
              if (wnext === 0) {           /* very common case */
                from += wsize - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              else if (wnext < op) {      /* wrap around window */
                from += wsize + wnext - op;
                op -= wnext;
                if (op < len) {         /* some from end of window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = 0;
                  if (wnext < len) {  /* some from start of window */
                    op = wnext;
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist;      /* rest from output */
                    from_source = output;
                  }
                }
              }
              else {                      /* contiguous in window */
                from += wnext - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              while (len > 2) {
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                len -= 3;
              }
              if (len) {
                output[_out++] = from_source[from++];
                if (len > 1) {
                  output[_out++] = from_source[from++];
                }
              }
            }
            else {
              from = _out - dist;          /* copy direct from output */
              do {                        /* minimum length is three */
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                len -= 3;
              } while (len > 2);
              if (len) {
                output[_out++] = output[from++];
                if (len > 1) {
                  output[_out++] = output[from++];
                }
              }
            }
          }
          else if ((op & 64) === 0) {          /* 2nd level distance code */
            here = dcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
            continue dodist;
          }
          else {
            strm.msg = 'invalid distance code';
            state.mode = BAD$1;
            break top;
          }

          break; // need to emulate goto via "continue"
        }
      }
      else if ((op & 64) === 0) {              /* 2nd level length code */
        here = lcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
        continue dolen;
      }
      else if (op & 32) {                     /* end-of-block */
        //Tracevv((stderr, "inflate:         end of block\n"));
        state.mode = TYPE$1;
        break top;
      }
      else {
        strm.msg = 'invalid literal/length code';
        state.mode = BAD$1;
        break top;
      }

      break; // need to emulate goto via "continue"
    }
  } while (_in < last && _out < end);

  /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
  len = bits >> 3;
  _in -= len;
  bits -= len << 3;
  hold &= (1 << bits) - 1;

  /* update state and return */
  strm.next_in = _in;
  strm.next_out = _out;
  strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last));
  strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end));
  state.hold = hold;
  state.bits = bits;
  return;
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

const MAXBITS = 15;
const ENOUGH_LENS$1 = 852;
const ENOUGH_DISTS$1 = 592;
//const ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

const CODES$1 = 0;
const LENS$1 = 1;
const DISTS$1 = 2;

const lbase = new Uint16Array([ /* Length codes 257..285 base */
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
  35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
]);

const lext = new Uint8Array([ /* Length codes 257..285 extra */
  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
  19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 199, 75
]);

const dbase = new Uint16Array([ /* Distance codes 0..29 base */
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
  8193, 12289, 16385, 24577, 0, 0
]);

const dext = new Uint8Array([ /* Distance codes 0..29 extra */
  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
  23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
  28, 28, 29, 29, 64, 64
]);

const inflate_table = (type, lens, lens_index, codes, table, table_index, work, opts) =>
{
  const bits = opts.bits;
      //here = opts.here; /* table entry for duplication */

  let len = 0;               /* a code's length in bits */
  let sym = 0;               /* index of code symbols */
  let min = 0, max = 0;          /* minimum and maximum code lengths */
  let root = 0;              /* number of index bits for root table */
  let curr = 0;              /* number of index bits for current table */
  let drop = 0;              /* code bits to drop for sub-table */
  let left = 0;                   /* number of prefix codes available */
  let used = 0;              /* code entries in table used */
  let huff = 0;              /* Huffman code */
  let incr;              /* for incrementing code, index */
  let fill;              /* index for replicating entries */
  let low;               /* low bits for current root entry */
  let mask;              /* mask for low root bits */
  let next;             /* next available space in table */
  let base = null;     /* base value table to use */
//  let shoextra;    /* extra bits table to use */
  let match;                  /* use base and extra for symbol >= match */
  const count = new Uint16Array(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
  const offs = new Uint16Array(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
  let extra = null;

  let here_bits, here_op, here_val;

  /*
   Process a set of code lengths to create a canonical Huffman code.  The
   code lengths are lens[0..codes-1].  Each length corresponds to the
   symbols 0..codes-1.  The Huffman code is generated by first sorting the
   symbols by length from short to long, and retaining the symbol order
   for codes with equal lengths.  Then the code starts with all zero bits
   for the first code of the shortest length, and the codes are integer
   increments for the same length, and zeros are appended as the length
   increases.  For the deflate format, these bits are stored backwards
   from their more natural integer increment ordering, and so when the
   decoding tables are built in the large loop below, the integer codes
   are incremented backwards.

   This routine assumes, but does not check, that all of the entries in
   lens[] are in the range 0..MAXBITS.  The caller must assure this.
   1..MAXBITS is interpreted as that code length.  zero means that that
   symbol does not occur in this code.

   The codes are sorted by computing a count of codes for each length,
   creating from that a table of starting indices for each length in the
   sorted table, and then entering the symbols in order in the sorted
   table.  The sorted table is work[], with that space being provided by
   the caller.

   The length counts are used for other purposes as well, i.e. finding
   the minimum and maximum length codes, determining if there are any
   codes at all, checking for a valid set of lengths, and looking ahead
   at length counts to determine sub-table sizes when building the
   decoding tables.
   */

  /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
  for (len = 0; len <= MAXBITS; len++) {
    count[len] = 0;
  }
  for (sym = 0; sym < codes; sym++) {
    count[lens[lens_index + sym]]++;
  }

  /* bound code lengths, force root to be within code lengths */
  root = bits;
  for (max = MAXBITS; max >= 1; max--) {
    if (count[max] !== 0) { break; }
  }
  if (root > max) {
    root = max;
  }
  if (max === 0) {                     /* no symbols to code at all */
    //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
    //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
    //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;


    //table.op[opts.table_index] = 64;
    //table.bits[opts.table_index] = 1;
    //table.val[opts.table_index++] = 0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;

    opts.bits = 1;
    return 0;     /* no symbols, but wait for decoding to report error */
  }
  for (min = 1; min < max; min++) {
    if (count[min] !== 0) { break; }
  }
  if (root < min) {
    root = min;
  }

  /* check for an over-subscribed or incomplete set of lengths */
  left = 1;
  for (len = 1; len <= MAXBITS; len++) {
    left <<= 1;
    left -= count[len];
    if (left < 0) {
      return -1;
    }        /* over-subscribed */
  }
  if (left > 0 && (type === CODES$1 || max !== 1)) {
    return -1;                      /* incomplete set */
  }

  /* generate offsets into symbol table for each length for sorting */
  offs[1] = 0;
  for (len = 1; len < MAXBITS; len++) {
    offs[len + 1] = offs[len] + count[len];
  }

  /* sort symbols by length, by symbol order within each length */
  for (sym = 0; sym < codes; sym++) {
    if (lens[lens_index + sym] !== 0) {
      work[offs[lens[lens_index + sym]]++] = sym;
    }
  }

  /*
   Create and fill in decoding tables.  In this loop, the table being
   filled is at next and has curr index bits.  The code being used is huff
   with length len.  That code is converted to an index by dropping drop
   bits off of the bottom.  For codes where len is less than drop + curr,
   those top drop + curr - len bits are incremented through all values to
   fill the table with replicated entries.

   root is the number of index bits for the root table.  When len exceeds
   root, sub-tables are created pointed to by the root entry with an index
   of the low root bits of huff.  This is saved in low to check for when a
   new sub-table should be started.  drop is zero when the root table is
   being filled, and drop is root when sub-tables are being filled.

   When a new sub-table is needed, it is necessary to look ahead in the
   code lengths to determine what size sub-table is needed.  The length
   counts are used for this, and so count[] is decremented as codes are
   entered in the tables.

   used keeps track of how many table entries have been allocated from the
   provided *table space.  It is checked for LENS and DIST tables against
   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
   the initial root table size constants.  See the comments in inftrees.h
   for more information.

   sym increments through all symbols, and the loop terminates when
   all codes of length max, i.e. all codes, have been processed.  This
   routine permits incomplete codes, so another loop after this one fills
   in the rest of the decoding tables with invalid code markers.
   */

  /* set up for code type */
  // poor man optimization - use if-else instead of switch,
  // to avoid deopts in old v8
  if (type === CODES$1) {
    base = extra = work;    /* dummy value--not used */
    match = 20;

  } else if (type === LENS$1) {
    base = lbase;
    extra = lext;
    match = 257;

  } else {                    /* DISTS */
    base = dbase;
    extra = dext;
    match = 0;
  }

  /* initialize opts for loop */
  huff = 0;                   /* starting code */
  sym = 0;                    /* starting code symbol */
  len = min;                  /* starting code length */
  next = table_index;              /* current table to fill in */
  curr = root;                /* current table index bits */
  drop = 0;                   /* current bits to drop from code for index */
  low = -1;                   /* trigger new sub-table when len > root */
  used = 1 << root;          /* use root table entries */
  mask = used - 1;            /* mask for comparing low */

  /* check available table space */
  if ((type === LENS$1 && used > ENOUGH_LENS$1) ||
    (type === DISTS$1 && used > ENOUGH_DISTS$1)) {
    return 1;
  }

  /* process all codes and make table entries */
  for (;;) {
    /* create table entry */
    here_bits = len - drop;
    if (work[sym] + 1 < match) {
      here_op = 0;
      here_val = work[sym];
    }
    else if (work[sym] >= match) {
      here_op = extra[work[sym] - match];
      here_val = base[work[sym] - match];
    }
    else {
      here_op = 32 + 64;         /* end of block */
      here_val = 0;
    }

    /* replicate for those indices with low len bits equal to huff */
    incr = 1 << (len - drop);
    fill = 1 << curr;
    min = fill;                 /* save offset to next table */
    do {
      fill -= incr;
      table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val |0;
    } while (fill !== 0);

    /* backwards increment the len-bit code huff */
    incr = 1 << (len - 1);
    while (huff & incr) {
      incr >>= 1;
    }
    if (incr !== 0) {
      huff &= incr - 1;
      huff += incr;
    } else {
      huff = 0;
    }

    /* go to next symbol, update count, len */
    sym++;
    if (--count[len] === 0) {
      if (len === max) { break; }
      len = lens[lens_index + work[sym]];
    }

    /* create new sub-table if needed */
    if (len > root && (huff & mask) !== low) {
      /* if first time, transition to sub-tables */
      if (drop === 0) {
        drop = root;
      }

      /* increment past last table */
      next += min;            /* here min is 1 << curr */

      /* determine length of next table */
      curr = len - drop;
      left = 1 << curr;
      while (curr + drop < max) {
        left -= count[curr + drop];
        if (left <= 0) { break; }
        curr++;
        left <<= 1;
      }

      /* check for enough space */
      used += 1 << curr;
      if ((type === LENS$1 && used > ENOUGH_LENS$1) ||
        (type === DISTS$1 && used > ENOUGH_DISTS$1)) {
        return 1;
      }

      /* point entry in root table to sub-table */
      low = huff & mask;
      /*table.op[low] = curr;
      table.bits[low] = root;
      table.val[low] = next - opts.table_index;*/
      table[low] = (root << 24) | (curr << 16) | (next - table_index) |0;
    }
  }

  /* fill in remaining table entry if code is incomplete (guaranteed to have
   at most one remaining entry, since if the code is incomplete, the
   maximum code length that was allowed to get this far is one bit) */
  if (huff !== 0) {
    //table.op[next + huff] = 64;            /* invalid code marker */
    //table.bits[next + huff] = len - drop;
    //table.val[next + huff] = 0;
    table[next + huff] = ((len - drop) << 24) | (64 << 16) |0;
  }

  /* set return parameters */
  //opts.table_index += used;
  opts.bits = root;
  return 0;
};


var inftrees = inflate_table;

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.






const CODES = 0;
const LENS = 1;
const DISTS = 2;

/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_FINISH: Z_FINISH$1, Z_BLOCK, Z_TREES,
  Z_OK: Z_OK$1, Z_STREAM_END: Z_STREAM_END$1, Z_NEED_DICT: Z_NEED_DICT$1, Z_STREAM_ERROR: Z_STREAM_ERROR$1, Z_DATA_ERROR: Z_DATA_ERROR$1, Z_MEM_ERROR: Z_MEM_ERROR$1, Z_BUF_ERROR: Z_BUF_ERROR$1,
  Z_DEFLATED
} = constants$2;


/* STATES ====================================================================*/
/* ===========================================================================*/


const    HEAD = 16180;       /* i: waiting for magic header */
const    FLAGS = 16181;      /* i: waiting for method and flags (gzip) */
const    TIME = 16182;       /* i: waiting for modification time (gzip) */
const    OS = 16183;         /* i: waiting for extra flags and operating system (gzip) */
const    EXLEN = 16184;      /* i: waiting for extra length (gzip) */
const    EXTRA = 16185;      /* i: waiting for extra bytes (gzip) */
const    NAME = 16186;       /* i: waiting for end of file name (gzip) */
const    COMMENT = 16187;    /* i: waiting for end of comment (gzip) */
const    HCRC = 16188;       /* i: waiting for header crc (gzip) */
const    DICTID = 16189;    /* i: waiting for dictionary check value */
const    DICT = 16190;      /* waiting for inflateSetDictionary() call */
const        TYPE = 16191;      /* i: waiting for type bits, including last-flag bit */
const        TYPEDO = 16192;    /* i: same, but skip check to exit inflate on new block */
const        STORED = 16193;    /* i: waiting for stored size (length and complement) */
const        COPY_ = 16194;     /* i/o: same as COPY below, but only first time in */
const        COPY = 16195;      /* i/o: waiting for input or output to copy stored block */
const        TABLE = 16196;     /* i: waiting for dynamic block table lengths */
const        LENLENS = 16197;   /* i: waiting for code length code lengths */
const        CODELENS = 16198;  /* i: waiting for length/lit and distance code lengths */
const            LEN_ = 16199;      /* i: same as LEN below, but only first time in */
const            LEN = 16200;       /* i: waiting for length/lit/eob code */
const            LENEXT = 16201;    /* i: waiting for length extra bits */
const            DIST = 16202;      /* i: waiting for distance code */
const            DISTEXT = 16203;   /* i: waiting for distance extra bits */
const            MATCH = 16204;     /* o: waiting for output space to copy string */
const            LIT = 16205;       /* o: waiting for output space to write literal */
const    CHECK = 16206;     /* i: waiting for 32-bit check value */
const    LENGTH = 16207;    /* i: waiting for 32-bit length (gzip) */
const    DONE = 16208;      /* finished check, done -- remain here until reset */
const    BAD = 16209;       /* got a data error -- remain here until reset */
const    MEM = 16210;       /* got an inflate() memory error -- remain here until reset */
const    SYNC = 16211;      /* looking for synchronization bytes to restart inflate() */

/* ===========================================================================*/



const ENOUGH_LENS = 852;
const ENOUGH_DISTS = 592;
//const ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

const MAX_WBITS = 15;
/* 32K LZ77 window */
const DEF_WBITS = MAX_WBITS;


const zswap32 = (q) => {

  return  (((q >>> 24) & 0xff) +
          ((q >>> 8) & 0xff00) +
          ((q & 0xff00) << 8) +
          ((q & 0xff) << 24));
};


function InflateState() {
  this.strm = null;           /* pointer back to this zlib stream */
  this.mode = 0;              /* current inflate mode */
  this.last = false;          /* true if processing last block */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip,
                                 bit 2 true to validate check value */
  this.havedict = false;      /* true if dictionary provided */
  this.flags = 0;             /* gzip header method and flags (0 if zlib), or
                                 -1 if raw or no header yet */
  this.dmax = 0;              /* zlib header max distance (INFLATE_STRICT) */
  this.check = 0;             /* protected copy of check value */
  this.total = 0;             /* protected copy of output count */
  // TODO: may be {}
  this.head = null;           /* where to save gzip header information */

  /* sliding window */
  this.wbits = 0;             /* log base 2 of requested window size */
  this.wsize = 0;             /* window size or zero if not using window */
  this.whave = 0;             /* valid bytes in the window */
  this.wnext = 0;             /* window write index */
  this.window = null;         /* allocated sliding window, if needed */

  /* bit accumulator */
  this.hold = 0;              /* input bit accumulator */
  this.bits = 0;              /* number of bits in "in" */

  /* for string and stored block copying */
  this.length = 0;            /* literal or length of data to copy */
  this.offset = 0;            /* distance back to copy string from */

  /* for table and code decoding */
  this.extra = 0;             /* extra bits needed */

  /* fixed and dynamic code tables */
  this.lencode = null;          /* starting table for length/literal codes */
  this.distcode = null;         /* starting table for distance codes */
  this.lenbits = 0;           /* index bits for lencode */
  this.distbits = 0;          /* index bits for distcode */

  /* dynamic table building */
  this.ncode = 0;             /* number of code length code lengths */
  this.nlen = 0;              /* number of length code lengths */
  this.ndist = 0;             /* number of distance code lengths */
  this.have = 0;              /* number of code lengths in lens[] */
  this.next = null;              /* next available space in codes[] */

  this.lens = new Uint16Array(320); /* temporary storage for code lengths */
  this.work = new Uint16Array(288); /* work area for code table building */

  /*
   because we don't have pointers in js, we use lencode and distcode directly
   as buffers so we don't need codes
  */
  //this.codes = new Int32Array(ENOUGH);       /* space for code tables */
  this.lendyn = null;              /* dynamic table for length/literal codes (JS specific) */
  this.distdyn = null;             /* dynamic table for distance codes (JS specific) */
  this.sane = 0;                   /* if false, allow invalid distance too far */
  this.back = 0;                   /* bits back of last unprocessed length/lit */
  this.was = 0;                    /* initial length of match */
}


const inflateStateCheck = (strm) => {

  if (!strm) {
    return 1;
  }
  const state = strm.state;
  if (!state || state.strm !== strm ||
    state.mode < HEAD || state.mode > SYNC) {
    return 1;
  }
  return 0;
};


const inflateResetKeep = (strm) => {

  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  const state = strm.state;
  strm.total_in = strm.total_out = state.total = 0;
  strm.msg = ''; /*Z_NULL*/
  if (state.wrap) {       /* to support ill-conceived Java test suite */
    strm.adler = state.wrap & 1;
  }
  state.mode = HEAD;
  state.last = 0;
  state.havedict = 0;
  state.flags = -1;
  state.dmax = 32768;
  state.head = null/*Z_NULL*/;
  state.hold = 0;
  state.bits = 0;
  //state.lencode = state.distcode = state.next = state.codes;
  state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS);
  state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS);

  state.sane = 1;
  state.back = -1;
  //Tracev((stderr, "inflate: reset\n"));
  return Z_OK$1;
};


const inflateReset = (strm) => {

  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  const state = strm.state;
  state.wsize = 0;
  state.whave = 0;
  state.wnext = 0;
  return inflateResetKeep(strm);

};


const inflateReset2 = (strm, windowBits) => {
  let wrap;

  /* get the state */
  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  const state = strm.state;

  /* extract wrap request from windowBits parameter */
  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  }
  else {
    wrap = (windowBits >> 4) + 5;
    if (windowBits < 48) {
      windowBits &= 15;
    }
  }

  /* set number of window bits, free window if different */
  if (windowBits && (windowBits < 8 || windowBits > 15)) {
    return Z_STREAM_ERROR$1;
  }
  if (state.window !== null && state.wbits !== windowBits) {
    state.window = null;
  }

  /* update state and reset the rest of it */
  state.wrap = wrap;
  state.wbits = windowBits;
  return inflateReset(strm);
};


const inflateInit2 = (strm, windowBits) => {

  if (!strm) { return Z_STREAM_ERROR$1; }
  //strm.msg = Z_NULL;                 /* in case we return an error */

  const state = new InflateState();

  //if (state === Z_NULL) return Z_MEM_ERROR;
  //Tracev((stderr, "inflate: allocated\n"));
  strm.state = state;
  state.strm = strm;
  state.window = null/*Z_NULL*/;
  state.mode = HEAD;     /* to pass state test in inflateReset2() */
  const ret = inflateReset2(strm, windowBits);
  if (ret !== Z_OK$1) {
    strm.state = null/*Z_NULL*/;
  }
  return ret;
};


const inflateInit = (strm) => {

  return inflateInit2(strm, DEF_WBITS);
};


/*
 Return state with length and distance decoding tables and index sizes set to
 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
 If BUILDFIXED is defined, then instead this routine builds the tables the
 first time it's called, and returns those tables the first time and
 thereafter.  This reduces the size of the code by about 2K bytes, in
 exchange for a little execution time.  However, BUILDFIXED should not be
 used for threaded applications, since the rewriting of the tables and virgin
 may not be thread-safe.
 */
let virgin = true;

let lenfix, distfix; // We have no pointers in JS, so keep tables separate


const fixedtables = (state) => {

  /* build fixed huffman tables if first call (may not be thread safe) */
  if (virgin) {
    lenfix = new Int32Array(512);
    distfix = new Int32Array(32);

    /* literal/length table */
    let sym = 0;
    while (sym < 144) { state.lens[sym++] = 8; }
    while (sym < 256) { state.lens[sym++] = 9; }
    while (sym < 280) { state.lens[sym++] = 7; }
    while (sym < 288) { state.lens[sym++] = 8; }

    inftrees(LENS,  state.lens, 0, 288, lenfix,   0, state.work, { bits: 9 });

    /* distance table */
    sym = 0;
    while (sym < 32) { state.lens[sym++] = 5; }

    inftrees(DISTS, state.lens, 0, 32,   distfix, 0, state.work, { bits: 5 });

    /* do this just once */
    virgin = false;
  }

  state.lencode = lenfix;
  state.lenbits = 9;
  state.distcode = distfix;
  state.distbits = 5;
};


/*
 Update the window with the last wsize (normally 32K) bytes written before
 returning.  If window does not exist yet, create it.  This is only called
 when a window is already in use, or when output has been written during this
 inflate call, but the end of the deflate stream has not been reached yet.
 It is also called to create a window for dictionary data when a dictionary
 is loaded.

 Providing output buffers larger than 32K to inflate() should provide a speed
 advantage, since only the last 32K of output is copied to the sliding window
 upon return from inflate(), and since all distances after the first 32K of
 output will fall in the output data, making match copies simpler and faster.
 The advantage may be dependent on the size of the processor's data caches.
 */
const updatewindow = (strm, src, end, copy) => {

  let dist;
  const state = strm.state;

  /* if it hasn't been done already, allocate space for the window */
  if (state.window === null) {
    state.window = new Uint8Array(1 << state.wbits);
  }

  /* if window not in use yet, initialize */
  if (state.wsize === 0) {
    state.wsize = 1 << state.wbits;
    state.wnext = 0;
    state.whave = 0;
  }

  /* copy state->wsize or less output bytes into the circular window */
  if (copy >= state.wsize) {
    state.window.set(src.subarray(end - state.wsize, end), 0);
    state.wnext = 0;
    state.whave = state.wsize;
  }
  else {
    dist = state.wsize - state.wnext;
    if (dist > copy) {
      dist = copy;
    }
    //zmemcpy(state->window + state->wnext, end - copy, dist);
    state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
    copy -= dist;
    if (copy) {
      //zmemcpy(state->window, end - copy, copy);
      state.window.set(src.subarray(end - copy, end), 0);
      state.wnext = copy;
      state.whave = state.wsize;
    }
    else {
      state.wnext += dist;
      if (state.wnext === state.wsize) { state.wnext = 0; }
      if (state.whave < state.wsize) { state.whave += dist; }
    }
  }
  return 0;
};


const inflate$2 = (strm, flush) => {

  let state;
  let input, output;          // input/output buffers
  let next;                   /* next input INDEX */
  let put;                    /* next output INDEX */
  let have, left;             /* available input and output */
  let hold;                   /* bit buffer */
  let bits;                   /* bits in bit buffer */
  let _in, _out;              /* save starting available input and output */
  let copy;                   /* number of stored or match bytes to copy */
  let from;                   /* where to copy match bytes from */
  let from_source;
  let here = 0;               /* current decoding table entry */
  let here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
  //let last;                   /* parent table entry */
  let last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
  let len;                    /* length to copy for repeats, bits to drop */
  let ret;                    /* return code */
  const hbuf = new Uint8Array(4);    /* buffer for gzip header crc calculation */
  let opts;

  let n; // temporary variable for NEED_BITS

  const order = /* permutation of code lengths */
    new Uint8Array([ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ]);


  if (inflateStateCheck(strm) || !strm.output ||
      (!strm.input && strm.avail_in !== 0)) {
    return Z_STREAM_ERROR$1;
  }

  state = strm.state;
  if (state.mode === TYPE) { state.mode = TYPEDO; }    /* skip check */


  //--- LOAD() ---
  put = strm.next_out;
  output = strm.output;
  left = strm.avail_out;
  next = strm.next_in;
  input = strm.input;
  have = strm.avail_in;
  hold = state.hold;
  bits = state.bits;
  //---

  _in = have;
  _out = left;
  ret = Z_OK$1;

  inf_leave: // goto emulation
  for (;;) {
    switch (state.mode) {
      case HEAD:
        if (state.wrap === 0) {
          state.mode = TYPEDO;
          break;
        }
        //=== NEEDBITS(16);
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((state.wrap & 2) && hold === 0x8b1f) {  /* gzip header */
          if (state.wbits === 0) {
            state.wbits = 15;
          }
          state.check = 0/*crc32(0L, Z_NULL, 0)*/;
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32_1(state.check, hbuf, 2, 0);
          //===//

          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = FLAGS;
          break;
        }
        if (state.head) {
          state.head.done = false;
        }
        if (!(state.wrap & 1) ||   /* check if zlib header allowed */
          (((hold & 0xff)/*BITS(8)*/ << 8) + (hold >> 8)) % 31) {
          strm.msg = 'incorrect header check';
          state.mode = BAD;
          break;
        }
        if ((hold & 0x0f)/*BITS(4)*/ !== Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
        len = (hold & 0x0f)/*BITS(4)*/ + 8;
        if (state.wbits === 0) {
          state.wbits = len;
        }
        if (len > 15 || len > state.wbits) {
          strm.msg = 'invalid window size';
          state.mode = BAD;
          break;
        }

        // !!! pako patch. Force use `options.windowBits` if passed.
        // Required to always use max window size by default.
        state.dmax = 1 << state.wbits;
        //state.dmax = 1 << len;

        state.flags = 0;               /* indicate zlib header */
        //Tracev((stderr, "inflate:   zlib header ok\n"));
        strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
        state.mode = hold & 0x200 ? DICTID : TYPE;
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        break;
      case FLAGS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.flags = hold;
        if ((state.flags & 0xff) !== Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        if (state.flags & 0xe000) {
          strm.msg = 'unknown header flags set';
          state.mode = BAD;
          break;
        }
        if (state.head) {
          state.head.text = ((hold >> 8) & 1);
        }
        if ((state.flags & 0x0200) && (state.wrap & 4)) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32_1(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = TIME;
        /* falls through */
      case TIME:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.time = hold;
        }
        if ((state.flags & 0x0200) && (state.wrap & 4)) {
          //=== CRC4(state.check, hold)
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          hbuf[2] = (hold >>> 16) & 0xff;
          hbuf[3] = (hold >>> 24) & 0xff;
          state.check = crc32_1(state.check, hbuf, 4, 0);
          //===
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = OS;
        /* falls through */
      case OS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.xflags = (hold & 0xff);
          state.head.os = (hold >> 8);
        }
        if ((state.flags & 0x0200) && (state.wrap & 4)) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32_1(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = EXLEN;
        /* falls through */
      case EXLEN:
        if (state.flags & 0x0400) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length = hold;
          if (state.head) {
            state.head.extra_len = hold;
          }
          if ((state.flags & 0x0200) && (state.wrap & 4)) {
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            state.check = crc32_1(state.check, hbuf, 2, 0);
            //===//
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        }
        else if (state.head) {
          state.head.extra = null/*Z_NULL*/;
        }
        state.mode = EXTRA;
        /* falls through */
      case EXTRA:
        if (state.flags & 0x0400) {
          copy = state.length;
          if (copy > have) { copy = have; }
          if (copy) {
            if (state.head) {
              len = state.head.extra_len - state.length;
              if (!state.head.extra) {
                // Use untyped array for more convenient processing later
                state.head.extra = new Uint8Array(state.head.extra_len);
              }
              state.head.extra.set(
                input.subarray(
                  next,
                  // extra field is limited to 65536 bytes
                  // - no need for additional size check
                  next + copy
                ),
                /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                len
              );
              //zmemcpy(state.head.extra + len, next,
              //        len + copy > state.head.extra_max ?
              //        state.head.extra_max - len : copy);
            }
            if ((state.flags & 0x0200) && (state.wrap & 4)) {
              state.check = crc32_1(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            state.length -= copy;
          }
          if (state.length) { break inf_leave; }
        }
        state.length = 0;
        state.mode = NAME;
        /* falls through */
      case NAME:
        if (state.flags & 0x0800) {
          if (have === 0) { break inf_leave; }
          copy = 0;
          do {
            // TODO: 2 or 1 bytes?
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
                (state.length < 65536 /*state.head.name_max*/)) {
              state.head.name += String.fromCharCode(len);
            }
          } while (len && copy < have);

          if ((state.flags & 0x0200) && (state.wrap & 4)) {
            state.check = crc32_1(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) { break inf_leave; }
        }
        else if (state.head) {
          state.head.name = null;
        }
        state.length = 0;
        state.mode = COMMENT;
        /* falls through */
      case COMMENT:
        if (state.flags & 0x1000) {
          if (have === 0) { break inf_leave; }
          copy = 0;
          do {
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
                (state.length < 65536 /*state.head.comm_max*/)) {
              state.head.comment += String.fromCharCode(len);
            }
          } while (len && copy < have);
          if ((state.flags & 0x0200) && (state.wrap & 4)) {
            state.check = crc32_1(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) { break inf_leave; }
        }
        else if (state.head) {
          state.head.comment = null;
        }
        state.mode = HCRC;
        /* falls through */
      case HCRC:
        if (state.flags & 0x0200) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if ((state.wrap & 4) && hold !== (state.check & 0xffff)) {
            strm.msg = 'header crc mismatch';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        }
        if (state.head) {
          state.head.hcrc = ((state.flags >> 9) & 1);
          state.head.done = true;
        }
        strm.adler = state.check = 0;
        state.mode = TYPE;
        break;
      case DICTID:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        strm.adler = state.check = zswap32(hold);
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = DICT;
        /* falls through */
      case DICT:
        if (state.havedict === 0) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          return Z_NEED_DICT$1;
        }
        strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
        state.mode = TYPE;
        /* falls through */
      case TYPE:
        if (flush === Z_BLOCK || flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case TYPEDO:
        if (state.last) {
          //--- BYTEBITS() ---//
          hold >>>= bits & 7;
          bits -= bits & 7;
          //---//
          state.mode = CHECK;
          break;
        }
        //=== NEEDBITS(3); */
        while (bits < 3) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.last = (hold & 0x01)/*BITS(1)*/;
        //--- DROPBITS(1) ---//
        hold >>>= 1;
        bits -= 1;
        //---//

        switch ((hold & 0x03)/*BITS(2)*/) {
          case 0:                             /* stored block */
            //Tracev((stderr, "inflate:     stored block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = STORED;
            break;
          case 1:                             /* fixed block */
            fixedtables(state);
            //Tracev((stderr, "inflate:     fixed codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = LEN_;             /* decode codes */
            if (flush === Z_TREES) {
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
              break inf_leave;
            }
            break;
          case 2:                             /* dynamic block */
            //Tracev((stderr, "inflate:     dynamic codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = TABLE;
            break;
          case 3:
            strm.msg = 'invalid block type';
            state.mode = BAD;
        }
        //--- DROPBITS(2) ---//
        hold >>>= 2;
        bits -= 2;
        //---//
        break;
      case STORED:
        //--- BYTEBITS() ---// /* go to byte boundary */
        hold >>>= bits & 7;
        bits -= bits & 7;
        //---//
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
          strm.msg = 'invalid stored block lengths';
          state.mode = BAD;
          break;
        }
        state.length = hold & 0xffff;
        //Tracev((stderr, "inflate:       stored length %u\n",
        //        state.length));
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = COPY_;
        if (flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case COPY_:
        state.mode = COPY;
        /* falls through */
      case COPY:
        copy = state.length;
        if (copy) {
          if (copy > have) { copy = have; }
          if (copy > left) { copy = left; }
          if (copy === 0) { break inf_leave; }
          //--- zmemcpy(put, next, copy); ---
          output.set(input.subarray(next, next + copy), put);
          //---//
          have -= copy;
          next += copy;
          left -= copy;
          put += copy;
          state.length -= copy;
          break;
        }
        //Tracev((stderr, "inflate:       stored end\n"));
        state.mode = TYPE;
        break;
      case TABLE:
        //=== NEEDBITS(14); */
        while (bits < 14) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.nlen = (hold & 0x1f)/*BITS(5)*/ + 257;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ndist = (hold & 0x1f)/*BITS(5)*/ + 1;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ncode = (hold & 0x0f)/*BITS(4)*/ + 4;
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
//#ifndef PKZIP_BUG_WORKAROUND
        if (state.nlen > 286 || state.ndist > 30) {
          strm.msg = 'too many length or distance symbols';
          state.mode = BAD;
          break;
        }
//#endif
        //Tracev((stderr, "inflate:       table sizes ok\n"));
        state.have = 0;
        state.mode = LENLENS;
        /* falls through */
      case LENLENS:
        while (state.have < state.ncode) {
          //=== NEEDBITS(3);
          while (bits < 3) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.lens[order[state.have++]] = (hold & 0x07);//BITS(3);
          //--- DROPBITS(3) ---//
          hold >>>= 3;
          bits -= 3;
          //---//
        }
        while (state.have < 19) {
          state.lens[order[state.have++]] = 0;
        }
        // We have separate tables & no pointers. 2 commented lines below not needed.
        //state.next = state.codes;
        //state.lencode = state.next;
        // Switch to use dynamic table
        state.lencode = state.lendyn;
        state.lenbits = 7;

        opts = { bits: state.lenbits };
        ret = inftrees(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
        state.lenbits = opts.bits;

        if (ret) {
          strm.msg = 'invalid code lengths set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, "inflate:       code lengths ok\n"));
        state.have = 0;
        state.mode = CODELENS;
        /* falls through */
      case CODELENS:
        while (state.have < state.nlen + state.ndist) {
          for (;;) {
            here = state.lencode[hold & ((1 << state.lenbits) - 1)];/*BITS(state.lenbits)*/
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          if (here_val < 16) {
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            state.lens[state.have++] = here_val;
          }
          else {
            if (here_val === 16) {
              //=== NEEDBITS(here.bits + 2);
              n = here_bits + 2;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              if (state.have === 0) {
                strm.msg = 'invalid bit length repeat';
                state.mode = BAD;
                break;
              }
              len = state.lens[state.have - 1];
              copy = 3 + (hold & 0x03);//BITS(2);
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
            }
            else if (here_val === 17) {
              //=== NEEDBITS(here.bits + 3);
              n = here_bits + 3;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 3 + (hold & 0x07);//BITS(3);
              //--- DROPBITS(3) ---//
              hold >>>= 3;
              bits -= 3;
              //---//
            }
            else {
              //=== NEEDBITS(here.bits + 7);
              n = here_bits + 7;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 11 + (hold & 0x7f);//BITS(7);
              //--- DROPBITS(7) ---//
              hold >>>= 7;
              bits -= 7;
              //---//
            }
            if (state.have + copy > state.nlen + state.ndist) {
              strm.msg = 'invalid bit length repeat';
              state.mode = BAD;
              break;
            }
            while (copy--) {
              state.lens[state.have++] = len;
            }
          }
        }

        /* handle error breaks in while */
        if (state.mode === BAD) { break; }

        /* check for end-of-block code (better have one) */
        if (state.lens[256] === 0) {
          strm.msg = 'invalid code -- missing end-of-block';
          state.mode = BAD;
          break;
        }

        /* build code tables -- note: do not change the lenbits or distbits
           values here (9 and 6) without reading the comments in inftrees.h
           concerning the ENOUGH constants, which depend on those values */
        state.lenbits = 9;

        opts = { bits: state.lenbits };
        ret = inftrees(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.lenbits = opts.bits;
        // state.lencode = state.next;

        if (ret) {
          strm.msg = 'invalid literal/lengths set';
          state.mode = BAD;
          break;
        }

        state.distbits = 6;
        //state.distcode.copy(state.codes);
        // Switch to use dynamic table
        state.distcode = state.distdyn;
        opts = { bits: state.distbits };
        ret = inftrees(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.distbits = opts.bits;
        // state.distcode = state.next;

        if (ret) {
          strm.msg = 'invalid distances set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, 'inflate:       codes ok\n'));
        state.mode = LEN_;
        if (flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case LEN_:
        state.mode = LEN;
        /* falls through */
      case LEN:
        if (have >= 6 && left >= 258) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          inffast(strm, _out);
          //--- LOAD() ---
          put = strm.next_out;
          output = strm.output;
          left = strm.avail_out;
          next = strm.next_in;
          input = strm.input;
          have = strm.avail_in;
          hold = state.hold;
          bits = state.bits;
          //---

          if (state.mode === TYPE) {
            state.back = -1;
          }
          break;
        }
        state.back = 0;
        for (;;) {
          here = state.lencode[hold & ((1 << state.lenbits) - 1)];  /*BITS(state.lenbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if (here_bits <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if (here_op && (here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.lencode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        state.length = here_val;
        if (here_op === 0) {
          //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
          //        "inflate:         literal '%c'\n" :
          //        "inflate:         literal 0x%02x\n", here.val));
          state.mode = LIT;
          break;
        }
        if (here_op & 32) {
          //Tracevv((stderr, "inflate:         end of block\n"));
          state.back = -1;
          state.mode = TYPE;
          break;
        }
        if (here_op & 64) {
          strm.msg = 'invalid literal/length code';
          state.mode = BAD;
          break;
        }
        state.extra = here_op & 15;
        state.mode = LENEXT;
        /* falls through */
      case LENEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
        //Tracevv((stderr, "inflate:         length %u\n", state.length));
        state.was = state.length;
        state.mode = DIST;
        /* falls through */
      case DIST:
        for (;;) {
          here = state.distcode[hold & ((1 << state.distbits) - 1)];/*BITS(state.distbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if ((here_bits) <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if ((here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.distcode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        if (here_op & 64) {
          strm.msg = 'invalid distance code';
          state.mode = BAD;
          break;
        }
        state.offset = here_val;
        state.extra = (here_op) & 15;
        state.mode = DISTEXT;
        /* falls through */
      case DISTEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.offset += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
//#ifdef INFLATE_STRICT
        if (state.offset > state.dmax) {
          strm.msg = 'invalid distance too far back';
          state.mode = BAD;
          break;
        }
//#endif
        //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
        state.mode = MATCH;
        /* falls through */
      case MATCH:
        if (left === 0) { break inf_leave; }
        copy = _out - left;
        if (state.offset > copy) {         /* copy from window */
          copy = state.offset - copy;
          if (copy > state.whave) {
            if (state.sane) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD;
              break;
            }
// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//          Trace((stderr, "inflate.c too far\n"));
//          copy -= state.whave;
//          if (copy > state.length) { copy = state.length; }
//          if (copy > left) { copy = left; }
//          left -= copy;
//          state.length -= copy;
//          do {
//            output[put++] = 0;
//          } while (--copy);
//          if (state.length === 0) { state.mode = LEN; }
//          break;
//#endif
          }
          if (copy > state.wnext) {
            copy -= state.wnext;
            from = state.wsize - copy;
          }
          else {
            from = state.wnext - copy;
          }
          if (copy > state.length) { copy = state.length; }
          from_source = state.window;
        }
        else {                              /* copy from output */
          from_source = output;
          from = put - state.offset;
          copy = state.length;
        }
        if (copy > left) { copy = left; }
        left -= copy;
        state.length -= copy;
        do {
          output[put++] = from_source[from++];
        } while (--copy);
        if (state.length === 0) { state.mode = LEN; }
        break;
      case LIT:
        if (left === 0) { break inf_leave; }
        output[put++] = state.length;
        left--;
        state.mode = LEN;
        break;
      case CHECK:
        if (state.wrap) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            // Use '|' instead of '+' to make sure that result is signed
            hold |= input[next++] << bits;
            bits += 8;
          }
          //===//
          _out -= left;
          strm.total_out += _out;
          state.total += _out;
          if ((state.wrap & 4) && _out) {
            strm.adler = state.check =
                /*UPDATE_CHECK(state.check, put - _out, _out);*/
                (state.flags ? crc32_1(state.check, output, _out, put - _out) : adler32_1(state.check, output, _out, put - _out));

          }
          _out = left;
          // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
          if ((state.wrap & 4) && (state.flags ? hold : zswap32(hold)) !== state.check) {
            strm.msg = 'incorrect data check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   check matches trailer\n"));
        }
        state.mode = LENGTH;
        /* falls through */
      case LENGTH:
        if (state.wrap && state.flags) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if ((state.wrap & 4) && hold !== (state.total & 0xffffffff)) {
            strm.msg = 'incorrect length check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   length matches trailer\n"));
        }
        state.mode = DONE;
        /* falls through */
      case DONE:
        ret = Z_STREAM_END$1;
        break inf_leave;
      case BAD:
        ret = Z_DATA_ERROR$1;
        break inf_leave;
      case MEM:
        return Z_MEM_ERROR$1;
      case SYNC:
        /* falls through */
      default:
        return Z_STREAM_ERROR$1;
    }
  }

  // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

  /*
     Return from inflate(), updating the total counts and the check value.
     If there was no progress during the inflate() call, return a buffer
     error.  Call updatewindow() to create and/or update the window state.
     Note: a memory error from inflate() is non-recoverable.
   */

  //--- RESTORE() ---
  strm.next_out = put;
  strm.avail_out = left;
  strm.next_in = next;
  strm.avail_in = have;
  state.hold = hold;
  state.bits = bits;
  //---

  if (state.wsize || (_out !== strm.avail_out && state.mode < BAD &&
                      (state.mode < CHECK || flush !== Z_FINISH$1))) {
    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) ;
  }
  _in -= strm.avail_in;
  _out -= strm.avail_out;
  strm.total_in += _in;
  strm.total_out += _out;
  state.total += _out;
  if ((state.wrap & 4) && _out) {
    strm.adler = state.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
      (state.flags ? crc32_1(state.check, output, _out, strm.next_out - _out) : adler32_1(state.check, output, _out, strm.next_out - _out));
  }
  strm.data_type = state.bits + (state.last ? 64 : 0) +
                    (state.mode === TYPE ? 128 : 0) +
                    (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
  if (((_in === 0 && _out === 0) || flush === Z_FINISH$1) && ret === Z_OK$1) {
    ret = Z_BUF_ERROR$1;
  }
  return ret;
};


const inflateEnd = (strm) => {

  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR$1;
  }

  let state = strm.state;
  if (state.window) {
    state.window = null;
  }
  strm.state = null;
  return Z_OK$1;
};


const inflateGetHeader = (strm, head) => {

  /* check state */
  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  const state = strm.state;
  if ((state.wrap & 2) === 0) { return Z_STREAM_ERROR$1; }

  /* save header structure */
  state.head = head;
  head.done = false;
  return Z_OK$1;
};


const inflateSetDictionary = (strm, dictionary) => {
  const dictLength = dictionary.length;

  let state;
  let dictid;
  let ret;

  /* check state */
  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  state = strm.state;

  if (state.wrap !== 0 && state.mode !== DICT) {
    return Z_STREAM_ERROR$1;
  }

  /* check for correct dictionary identifier */
  if (state.mode === DICT) {
    dictid = 1; /* adler32(0, null, 0)*/
    /* dictid = adler32(dictid, dictionary, dictLength); */
    dictid = adler32_1(dictid, dictionary, dictLength, 0);
    if (dictid !== state.check) {
      return Z_DATA_ERROR$1;
    }
  }
  /* copy dictionary to window using updatewindow(), which will amend the
   existing dictionary if appropriate */
  ret = updatewindow(strm, dictionary, dictLength, dictLength);
  if (ret) {
    state.mode = MEM;
    return Z_MEM_ERROR$1;
  }
  state.havedict = 1;
  // Tracev((stderr, "inflate:   dictionary set\n"));
  return Z_OK$1;
};


var inflateReset_1 = inflateReset;
var inflateReset2_1 = inflateReset2;
var inflateResetKeep_1 = inflateResetKeep;
var inflateInit_1 = inflateInit;
var inflateInit2_1 = inflateInit2;
var inflate_2$1 = inflate$2;
var inflateEnd_1 = inflateEnd;
var inflateGetHeader_1 = inflateGetHeader;
var inflateSetDictionary_1 = inflateSetDictionary;
var inflateInfo = 'pako inflate (from Nodeca project)';

/* Not implemented
module.exports.inflateCodesUsed = inflateCodesUsed;
module.exports.inflateCopy = inflateCopy;
module.exports.inflateGetDictionary = inflateGetDictionary;
module.exports.inflateMark = inflateMark;
module.exports.inflatePrime = inflatePrime;
module.exports.inflateSync = inflateSync;
module.exports.inflateSyncPoint = inflateSyncPoint;
module.exports.inflateUndermine = inflateUndermine;
module.exports.inflateValidate = inflateValidate;
*/

var inflate_1$2 = {
	inflateReset: inflateReset_1,
	inflateReset2: inflateReset2_1,
	inflateResetKeep: inflateResetKeep_1,
	inflateInit: inflateInit_1,
	inflateInit2: inflateInit2_1,
	inflate: inflate_2$1,
	inflateEnd: inflateEnd_1,
	inflateGetHeader: inflateGetHeader_1,
	inflateSetDictionary: inflateSetDictionary_1,
	inflateInfo: inflateInfo
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function GZheader() {
  /* true if compressed data believed to be text */
  this.text       = 0;
  /* modification time */
  this.time       = 0;
  /* extra flags (not used when writing a gzip file) */
  this.xflags     = 0;
  /* operating system */
  this.os         = 0;
  /* pointer to extra field or Z_NULL if none */
  this.extra      = null;
  /* extra field length (valid if extra != Z_NULL) */
  this.extra_len  = 0; // Actually, we don't need it in JS,
                       // but leave for few code modifications

  //
  // Setup limits is not necessary because in js we should not preallocate memory
  // for inflate use constant limit in 65536 bytes
  //

  /* space at extra (only when reading header) */
  // this.extra_max  = 0;
  /* pointer to zero-terminated file name or Z_NULL */
  this.name       = '';
  /* space at name (only when reading header) */
  // this.name_max   = 0;
  /* pointer to zero-terminated comment or Z_NULL */
  this.comment    = '';
  /* space at comment (only when reading header) */
  // this.comm_max   = 0;
  /* true if there was or will be a header crc */
  this.hcrc       = 0;
  /* true when done reading gzip header (not used when writing a gzip file) */
  this.done       = false;
}

var gzheader = GZheader;

const toString = Object.prototype.toString;

/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_NO_FLUSH, Z_FINISH,
  Z_OK, Z_STREAM_END, Z_NEED_DICT, Z_STREAM_ERROR, Z_DATA_ERROR, Z_MEM_ERROR, Z_BUF_ERROR
} = constants$2;

/* ===========================================================================*/

const defaultOptions = {
  chunkSize: 1024 * 64,
  windowBits: 15,
  to: ''
};

/**
 * class Inflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[inflate]]
 * and [[inflateRaw]].
 **/

/* internal
 * inflate.chunks -> Array
 *
 * Chunks of output data, if [[Inflate#onData]] not overridden.
 **/

/**
 * Inflate.result -> Uint8Array|String
 *
 * Uncompressed result, generated by default [[Inflate#onData]]
 * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Inflate#push]] with `Z_FINISH` / `true` param).
 **/

/**
 * Inflate.err -> Number
 *
 * Error code after inflate finished. 0 (Z_OK) on success.
 * Should be checked if broken data possible.
 **/

/**
 * Inflate.msg -> String
 *
 * Error message, if [[Inflate.err]] != 0
 **/


/**
 * new Inflate(options)
 * - options (Object): zlib inflate options.
 *
 * Creates new inflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `windowBits`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw inflate
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 * By default, when no options set, autodetect deflate/gzip data format via
 * wrapper header.
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 * const chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
 * const chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * const inflate = new pako.Inflate({ level: 3});
 *
 * inflate.push(chunk1, false);
 * inflate.push(chunk2, true);  // true -> last chunk
 *
 * if (inflate.err) { throw new Error(inflate.err); }
 *
 * console.log(inflate.result);
 * ```
 **/
function Inflate$1(options) {
  this.options = common.assign({}, defaultOptions, options || {});

  const opt = this.options;

  // Force window size for `raw` data, if not set directly,
  // because we have no header for autodetect.
  if (opt.raw && (opt.windowBits >= 0) && (opt.windowBits < 16)) {
    opt.windowBits = -opt.windowBits;
    if (opt.windowBits === 0) { opt.windowBits = -15; }
  }

  // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate
  if ((opt.windowBits >= 0) && (opt.windowBits < 16) &&
      !(options && options.windowBits)) {
    opt.windowBits += 32;
  }

  // Gzip header has no info about windows size, we can do autodetect only
  // for deflate. So, if window size not set, force it to max when gzip possible
  if ((opt.windowBits > 15) && (opt.windowBits < 48)) {
    // bit 3 (16) -> gzipped data
    // bit 4 (32) -> autodetect gzip/deflate
    if ((opt.windowBits & 15) === 0) {
      opt.windowBits |= 15;
    }
  }

  this.err    = 0;      // error code, if happens (0 = Z_OK)
  this.msg    = '';     // error message
  this.ended  = false;  // used to avoid multiple onEnd() calls
  this.chunks = [];     // chunks of compressed data

  this.strm   = new zstream();
  this.strm.avail_out = 0;

  let status  = inflate_1$2.inflateInit2(
    this.strm,
    opt.windowBits
  );

  if (status !== Z_OK) {
    throw new Error(messages[status]);
  }

  this.header = new gzheader();

  inflate_1$2.inflateGetHeader(this.strm, this.header);

  // Setup dictionary
  if (opt.dictionary) {
    // Convert data if needed
    if (typeof opt.dictionary === 'string') {
      opt.dictionary = strings.string2buf(opt.dictionary);
    } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
      opt.dictionary = new Uint8Array(opt.dictionary);
    }
    if (opt.raw) { //In raw mode we need to set the dictionary early
      status = inflate_1$2.inflateSetDictionary(this.strm, opt.dictionary);
      if (status !== Z_OK) {
        throw new Error(messages[status]);
      }
    }
  }
}

/**
 * Inflate#push(data[, flush_mode]) -> Boolean
 * - data (Uint8Array|ArrayBuffer): input data
 * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE
 *   flush modes. See constants. Skipped or `false` means Z_NO_FLUSH,
 *   `true` means Z_FINISH.
 *
 * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
 * new output chunks. Returns `true` on success. If end of stream detected,
 * [[Inflate#onEnd]] will be called.
 *
 * `flush_mode` is not needed for normal operation, because end of stream
 * detected automatically. You may try to use it for advanced things, but
 * this functionality was not tested.
 *
 * On fail call [[Inflate#onEnd]] with error code and return false.
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Inflate$1.prototype.push = function (data, flush_mode) {
  const strm = this.strm;
  const chunkSize = this.options.chunkSize;
  const dictionary = this.options.dictionary;
  let status, _flush_mode, last_avail_out;

  if (this.ended) return false;

  if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
  else _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;

  // Convert data if needed
  if (toString.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  for (;;) {
    if (strm.avail_out === 0) {
      strm.output = new Uint8Array(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }

    status = inflate_1$2.inflate(strm, _flush_mode);

    if (status === Z_NEED_DICT && dictionary) {
      status = inflate_1$2.inflateSetDictionary(strm, dictionary);

      if (status === Z_OK) {
        status = inflate_1$2.inflate(strm, _flush_mode);
      } else if (status === Z_DATA_ERROR) {
        // Replace code with more verbose
        status = Z_NEED_DICT;
      }
    }

    // Only the gzip format defines concatenated members (RFC 1952: a gzip file
    // is "a series of members"). A zlib stream (RFC 1950) ends after its
    // ADLER32, and a raw DEFLATE stream (RFC 1951) ends after its final block -
    // neither format allows anything to follow, so bytes after the end are not
    // ours to interpret and must be left in the input. Restart decoding only
    // for a gzip member: `state.flags` is non-zero only once a gzip header has
    // actually been decoded (it stays 0 for a zlib member, even when the format
    // was auto-detected and the gzip bit of `wrap` is set). A trailing zero
    // byte is padding, not the start of a member (no member can begin with 0).
    while (strm.avail_in > 0 &&
           status === Z_STREAM_END &&
           (strm.state.wrap & 2) && strm.state.flags !== 0 &&
           strm.input[strm.next_in] !== 0)
    {
      inflate_1$2.inflateReset(strm);
      status = inflate_1$2.inflate(strm, _flush_mode);
    }

    switch (status) {
      case Z_STREAM_ERROR:
      case Z_DATA_ERROR:
      case Z_NEED_DICT:
      case Z_MEM_ERROR:
        this.onEnd(status);
        this.ended = true;
        return false;
    }

    // Remember real `avail_out` value, because we may patch out buffer content
    // to align utf8 strings boundaries.
    last_avail_out = strm.avail_out;

    if (strm.next_out) {
      // Flush output if buffer is full, stream ended, or an explicit flush was
      // requested (e.g. Z_SYNC_FLUSH) - to push out the tail, same as node's zlib.
      if (strm.avail_out === 0 || status === Z_STREAM_END || _flush_mode > 0) {

        if (this.options.to === 'string') {

          let next_out_utf8 = strings.utf8border(strm.output, strm.next_out);

          let tail = strm.next_out - next_out_utf8;
          let utf8str = strings.buf2string(strm.output, next_out_utf8);

          // move tail & realign counters
          strm.next_out = tail;
          strm.avail_out = chunkSize - tail;
          if (tail) strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);

          this.onData(utf8str);

        } else {
          this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));

          // Force a fresh output buffer on next iteration / next push, so the
          // already emitted tail is not sent again.
          strm.avail_out = 0;
          strm.next_out = 0;
        }
      }
    }

    // A full output buffer means there may be more to produce - allocate a new
    // one and call inflate again. The status depends on the flush mode: with
    // Z_NO_FLUSH a full buffer is reported as Z_OK, but with Z_FINISH the same
    // situation is reported as Z_BUF_ERROR ("could not make progress now",
    // non-fatal) even though output is still pending. Both must continue; the
    // distinction that matters is purely "was the output buffer exhausted".
    if ((status === Z_OK || status === Z_BUF_ERROR) && last_avail_out === 0) continue;

    // Finalize if end of stream reached.
    if (status === Z_STREAM_END) {
      status = inflate_1$2.inflateEnd(this.strm);
      this.onEnd(status);
      this.ended = true;
      return true;
    }

    if (strm.avail_in === 0) {
      // Input is exhausted. If the caller declared this the end of the stream
      // (Z_FINISH) but we never saw Z_STREAM_END, the compressed data ended
      // before its terminating marker - i.e. it is truncated/incomplete. That
      // is an error: returning the partial output as success would be
      // indistinguishable from a complete decode, hiding the data loss. Report
      // it via Z_BUF_ERROR. (Reached only when the output buffer still had room
      // - a full buffer is handled by the `continue` above - so this genuinely
      // means "ran out of input", not "ran out of output".)
      if (_flush_mode === Z_FINISH) {
        status = inflate_1$2.inflateEnd(this.strm);
        this.onEnd(status === Z_OK ? Z_BUF_ERROR : status);
        this.ended = true;
        return false;
      }
      break;
    }
  }

  return true;
};


/**
 * Inflate#onData(chunk) -> Void
 * - chunk (Uint8Array|String): output data. When string output requested,
 *   each chunk will be string.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Inflate$1.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};


/**
 * Inflate#onEnd(status) -> Void
 * - status (Number): inflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called either after you tell inflate that the input stream is
 * complete (Z_FINISH). By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Inflate$1.prototype.onEnd = function (status) {
  // On success - join
  if (status === Z_OK) {
    if (this.options.to === 'string') {
      this.result = this.chunks.join('');
    } else {
      this.result = common.flattenChunks(this.chunks);
    }
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};


/**
 * inflate(data[, options]) -> Uint8Array|String
 * - data (Uint8Array|ArrayBuffer): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Decompress `data` with inflate/ungzip and `options`. Autodetect
 * format via wrapper header by default. That's why we don't provide
 * separate `ungzip` method.
 *
 * Supported options are:
 *
 * - windowBits
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako');
 * const input = pako.deflate(new Uint8Array([1,2,3,4,5,6,7,8,9]));
 * let output;
 *
 * try {
 *   output = pako.inflate(input);
 * } catch (err) {
 *   console.log(err);
 * }
 * ```
 **/
function inflate$1(input, options) {
  const inflator = new Inflate$1(options);

  inflator.push(input, true);

  // That will never happens, if you don't cheat with options :)
  if (inflator.err) throw inflator.msg || messages[inflator.err];

  return inflator.result;
}


/**
 * inflateRaw(data[, options]) -> Uint8Array|String
 * - data (Uint8Array|ArrayBuffer): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * The same as [[inflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/
function inflateRaw$1(input, options) {
  options = options || {};
  options.raw = true;
  return inflate$1(input, options);
}


/**
 * ungzip(data[, options]) -> Uint8Array|String
 * - data (Uint8Array|ArrayBuffer): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Just shortcut to [[inflate]], because it autodetects format
 * by header.content. Done for convenience.
 **/


var Inflate_1$1 = Inflate$1;
var inflate_2 = inflate$1;
var inflateRaw_1$1 = inflateRaw$1;
var ungzip$1 = inflate$1;
var constants = constants$2;

var inflate_1$1 = {
	Inflate: Inflate_1$1,
	inflate: inflate_2,
	inflateRaw: inflateRaw_1$1,
	ungzip: ungzip$1,
	constants: constants
};

const { Deflate, deflate, deflateRaw, gzip } = deflate_1$1;

const { Inflate, inflate, inflateRaw, ungzip } = inflate_1$1;



var Deflate_1 = Deflate;
var deflate_1 = deflate;
var deflateRaw_1 = deflateRaw;
var gzip_1 = gzip;
var Inflate_1 = Inflate;
var inflate_1 = inflate;
var inflateRaw_1 = inflateRaw;
var ungzip_1 = ungzip;
var constants_1 = constants$2;

var pako = {
	Deflate: Deflate_1,
	deflate: deflate_1,
	deflateRaw: deflateRaw_1,
	gzip: gzip_1,
	Inflate: Inflate_1,
	inflate: inflate_1,
	inflateRaw: inflateRaw_1,
	ungzip: ungzip_1,
	constants: constants_1
};




},
42700(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (/* binding */ ImageReslice_default)
});

// UNUSED EXPORTS: extend, newInstance

// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/macros.js
var macros = __webpack_require__(28241);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/DataArray/Constants.js
var Constants = __webpack_require__(25015);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/Math.js
var Core_Math = __webpack_require__(91352);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/DataArray.js
var DataArray = __webpack_require__(445);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/BoundingBox.js
var BoundingBox = __webpack_require__(24377);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/DataModel/ImageData.js
var ImageData = __webpack_require__(26393);
// EXTERNAL MODULE: ../../../node_modules/@kitware/vtk.js/Common/Core/MatrixBuilder.js
var MatrixBuilder = __webpack_require__(90364);
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Imaging/Core/AbstractImageInterpolator/Constants.js
//#region Sources/Imaging/Core/AbstractImageInterpolator/Constants.js
var ImageBorderMode = {
	CLAMP: 0,
	REPEAT: 1,
	MIRROR: 2
};
var InterpolationMode = {
	NEAREST: 0,
	LINEAR: 1,
	CUBIC: 2
};
var Constants_default = {
	ImageBorderMode,
	InterpolationMode
};
//#endregion


//# sourceMappingURL=Constants.js.map
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Imaging/Core/AbstractImageInterpolator/InterpolationInfo.js

//#region Sources/Imaging/Core/AbstractImageInterpolator/InterpolationInfo.js
var vtkInterpolationInfo = {
	pointer: null,
	extent: [
		0,
		-1,
		0,
		-1,
		0,
		-1
	],
	increments: [
		0,
		0,
		0
	],
	scalarType: null,
	dataTypeSize: 1,
	numberOfComponents: 1,
	borderMode: ImageBorderMode.CLAMP,
	interpolationMode: InterpolationMode.LINEAR,
	extraInfo: null
};
var vtkInterpolationWeights = {
	...vtkInterpolationInfo,
	positions: [
		0,
		0,
		0
	],
	weights: null,
	weightExtent: [
		0,
		-1,
		0,
		-1,
		0,
		-1
	],
	kernelSize: [
		1,
		1,
		1
	],
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
function vtkInterpolationMathClamp(a, b, c) {
	let clamp = a <= c ? a : c;
	clamp -= b;
	clamp = clamp >= 0 ? clamp : 0;
	return clamp;
}
function vtkInterpolationMathWrap(a, b, c) {
	const range = c - b + 1;
	let wrap = a - b;
	wrap %= range;
	wrap = wrap >= 0 ? wrap : wrap + range;
	return wrap;
}
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
var InterpolationInfo_default = (/* unused pure expression or super */ null && ({
	vtkInterpolationInfo,
	vtkInterpolationWeights,
	vtkInterpolationMathFloor,
	vtkInterpolationMathRound,
	vtkInterpolationMathClamp,
	vtkInterpolationMathWrap,
	vtkInterpolationMathMirror
}));
//#endregion


//# sourceMappingURL=InterpolationInfo.js.map
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Imaging/Core/AbstractImageInterpolator.js



//#region Sources/Imaging/Core/AbstractImageInterpolator/index.js
var { ImageBorderMode: AbstractImageInterpolator_ImageBorderMode } = Constants_default;
function vtkAbstractImageInterpolator(publicAPI, model) {
	model.classHierarchy.push("vtkAbstractImageInterpolator");
	publicAPI.initialize = (data) => {
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
			const newTol = Math.max(.5 * (model.extent[2 * i] === model.extent[2 * i + 1]), model.tolerance);
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
		const dataSize = 1;
		const inPtr = model.scalars.getData();
		model.interpolationInfo.pointer = inPtr.subarray(component * dataSize);
		model.interpolationInfo.scalarType = model.scalars.dataType;
		model.interpolationInfo.dataTypeSize = 1;
		model.interpolationInfo.numberOfComponents = publicAPI.computeNumberOfComponents(ncomp);
		model.interpolationInfo.borderMode = model.borderMode;
		publicAPI.internalUpdate();
	};
	publicAPI.internalUpdate = () => {};
	publicAPI.interpolateXYZ = (x, y, z, component) => {
		let value = model.outValue;
		const point = [
			x,
			y,
			z
		];
		const p = [
			(point[0] - model.origin[0]) / model.spacing[0],
			(point[1] - model.origin[1]) / model.spacing[1],
			(point[2] - model.origin[2]) / model.spacing[2]
		];
		if (publicAPI.checkBoundsIJK(p)) {
			const iinfo = { ...model.interpolationInfo };
			const ncomp = iinfo.increments[0] - model.componentOffset;
			const dataTypeSize = 1;
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
		const p = [
			(point[0] - model.origin[0]) / model.spacing[0],
			(point[1] - model.origin[1]) / model.spacing[1],
			(point[2] - model.origin[2]) / model.spacing[2]
		];
		if (publicAPI.checkBoundsIJK(p)) {
			publicAPI.interpolatePoint(model.interpolationInfo, p, value);
			return true;
		}
		for (let i = 0; i < model.interpolationInfo.numberOfComponents; ++i) value[i] = model.outValue;
		return false;
	};
	publicAPI.computeNumberOfComponents = (inputCount) => {
		const component = Math.min(Math.max(model.componentOffset, 0), inputCount - 1);
		const count = model.componentCount < inputCount - component ? model.componentCount : inputCount - component;
		return count > 0 ? count : inputCount - component;
	};
	publicAPI.getNumberOfComponents = () => model.interpolationInfo.numberOfComponents;
	publicAPI.interpolateIJK = (point, value) => {
		publicAPI.interpolatePoint(model.interpolationInfo, point, value);
	};
	publicAPI.checkBoundsIJK = (point) => !(point[0] < model.structuredBounds[0] || point[0] > model.structuredBounds[1] || point[1] < model.structuredBounds[2] || point[1] > model.structuredBounds[3] || point[2] < model.structuredBounds[4] || point[2] > model.structuredBounds[5]);
	publicAPI.computeSupportSize = null;
	publicAPI.isSeparable = null;
	publicAPI.precomputeWeightsForExtent = (matrix, inExtent, checkExtent) => {};
	publicAPI.FreePrecomputedWeights = (weights) => {};
	publicAPI.interpolatePoint = (interpolationInfo, point, value) => {};
	publicAPI.interpolateRow = (weights, xIdx, yIdx, zIdx, value, n) => {};
}
var DEFAULT_VALUES = {
	outValue: 0,
	tolerance: Number.EPSILON,
	componentOffset: 0,
	componentCount: -1,
	borderMode: AbstractImageInterpolator_ImageBorderMode.CLAMP,
	slidingWindow: false,
	scalars: null,
	interpolationInfo: { ...vtkInterpolationInfo },
	interpolationFunc: null,
	rowInterpolationFunc: null,
	structuredBounds: [
		0,
		-1,
		0,
		-1,
		0,
		-1
	],
	spacing: null,
	origin: null,
	extent: null
};
function extend(publicAPI, model, initialValues = {}) {
	Object.assign(model, DEFAULT_VALUES, initialValues);
	macros/* ["default"].obj */.Ay.obj(publicAPI, model);
	macros/* ["default"].setGet */.Ay.setGet(publicAPI, model, [
		"outValue",
		"tolerance",
		"componentOffset",
		"componentCount",
		"borderMode",
		"slidingWindow"
	]);
	macros/* ["default"].get */.Ay.get(publicAPI, model, ["origin", "spacing"]);
	vtkAbstractImageInterpolator(publicAPI, model);
}
var newInstance = macros/* ["default"].newInstance */.Ay.newInstance(extend, "vtkAbstractImageInterpolator");
var AbstractImageInterpolator_default = {
	newInstance,
	extend,
	...Constants_default
};
//#endregion


//# sourceMappingURL=AbstractImageInterpolator.js.map
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Imaging/Core/ImageInterpolator.js




//#region Sources/Imaging/Core/ImageInterpolator/index.js
function vtkImageInterpolator(publicAPI, model) {
	model.classHierarchy.push("vtkImageInterpolator");
	publicAPI.computeSupportSize = (matrix) => {
		let s = 1;
		if (model.interpolationMode === InterpolationMode.LINEAR) s = 2;
		else if (model.interpolationMode === InterpolationMode.CUBIC) s = 4;
		const size = [
			s,
			s,
			s
		];
		if (matrix == null) return size;
		if (matrix[12] !== 0 || matrix[13] !== 0 || matrix[14] !== 0 || matrix[15] !== 1) return size;
		for (let i = 0; i < 3; ++i) {
			let integerRow = true;
			for (let j = 0; j < 3; ++j) integerRow = integerRow && Number.isInteger(matrix[4 * i + j]);
			if (integerRow) size[i] = 1;
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
		for (let i = 0; i < numscalars; ++i) value[i] = interpolationInfo.pointer[startId + i];
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
		for (let i = 0; i < numscalars; ++i) value[i] = rx * (ryrz * inPtr[factX0 + i00 + i * 4] + ryfz * inPtr[factX0 + i01 + i * 4] + fyrz * inPtr[factX0 + i10 + i * 4] + fyfz * inPtr[factX0 + i11 + i * 4]) + fx * (ryrz * inPtr[factX1 + i00 + i * 4] + ryfz * inPtr[factX1 + i01 + i * 4] + fyrz * inPtr[factX1 + i10 + i * 4] + fyfz * inPtr[factX1 + i11 + i * 4]);
	};
	publicAPI.interpolatePoint = (interpolationInfo, point, value) => {
		switch (model.interpolationMode) {
			case InterpolationMode.LINEAR:
				publicAPI.interpolateLinear(interpolationInfo, point, value);
				break;
			case InterpolationMode.CUBIC:
				console.log("CUBIC not implemented");
				break;
			case InterpolationMode.NEAREST:
			default:
				publicAPI.interpolateNearest(interpolationInfo, point, value);
				break;
		}
	};
	publicAPI.interpolateRowNearest = (weights, idX, idY, idZ, outPtr, n) => {
		const iX = weights.positions[0].subarray(idX);
		const iY = weights.positions[1].subarray(idY);
		const iZ = weights.positions[2].subarray(idZ);
		const inPtr0 = weights.pointer.subarray(iY[0] + iZ[0]);
		const numscalars = weights.numberOfComponents;
		for (let i = 0; i < n; ++i) outPtr.set(inPtr0.subarray(iX[i], numscalars), i * numscalars);
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
		const numscalars = weights.numberOfComponents;
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
		if (stepY + stepZ === 4) i11 = iY[1].subarray(iZ[1]);
		const ryrz = ry * rz;
		const ryfz = ry * fz;
		const fyrz = fy * rz;
		const fyfz = fy * fz;
		if (stepX === 1) if (fy === 0 && fz === 0) for (let i = n; i > 0; --i) for (let j = 0; j < numscalars; j++) outPtr[j + n - i] = inPtr[i00 + iX[n - i] + j];
		else if (fy === 0) for (let i = n; i > 0; --i) for (let j = 0; j < numscalars; j++) outPtr[j + n - i] = rz * inPtr[iX[n - i] + i00 + j * 4] + fz * inPtr[iX[n - i] + i01 + j * 4];
		else for (let i = n; i > 0; --i) for (let j = 0; j < numscalars; j++) outPtr[j + n - i] = ryrz * inPtr[iX[n - i] + i00 + j * 4] + ryfz * inPtr[iX[n - i] + i01 + j * 4] + fyrz * inPtr[iX[n - i] + i10 + j * 4] + fyfz * inPtr[iX[n - i] + i11 + j * 4];
		else if (fz === 0) {
			let x = 0;
			for (let i = n; i > 0; --i) {
				const rx = fX[0 + 2 * x];
				const fx = fX[1 + 2 * x];
				const t0 = iX[0 + 2 * x];
				const t1 = iX[1 + 2 * x];
				for (let j = 0; j < numscalars; j++) outPtr[j + n - i] = rx * (ry * inPtr[t0 + i00 + j * 4] + fy * inPtr[t0 + i10 + j * 4]) + fx * (ry * inPtr[t1 + i00 + j * 4] + fy * inPtr[t1 + i10 + j * 4]);
				x++;
			}
		} else {
			let x = 0;
			for (let i = n; i > 0; --i) {
				const rx = fX[0 + 2 * x];
				const fx = fX[1 + 2 * x];
				const t0 = iX[0 + 2 * x];
				const t1 = iX[1 + 2 * x];
				for (let j = 0; j < numscalars; j++) outPtr[j] = rx * (ryrz * inPtr[t0 + i00 + j * 4] + ryfz * inPtr[t0 + i01 + j * 4] + fyrz * inPtr[t0 + i10 + j * 4] + fyfz * inPtr[t0 + i11 + j * 4]) + fx * (ryrz * inPtr[t1 + i00 + j * 4] + ryfz * inPtr[t1 + i01 + j * 4] + fyrz * inPtr[t1 + i10 + j * 4] + fyfz * inPtr[t1 + i11 + j * 4]);
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
				console.log("CUBIC not implemented");
				break;
			case InterpolationMode.NEAREST:
			default:
				publicAPI.interpolateRowNearest(weights, xIdx, yIdx, zIdx, value, n);
				break;
		}
	};
	publicAPI.vtkTricubicInterpWeights = (f) => {
		const half = .5;
		const fm1 = f - 1;
		const fd2 = f * half;
		const ft3 = f * 3;
		return [
			-fd2 * fm1 * fm1,
			((ft3 - 2) * fd2 - 1) * fm1,
			-((ft3 - 4) * f - 1) * fd2,
			f * fd2 * fm1
		];
	};
	publicAPI.precomputeWeightsForExtent = (matrix, outExt, clipExt) => {
		const weights = {
			...vtkInterpolationWeights.newInstance(),
			...model.interpolationInfo
		};
		weights.weightType = "Float32Array";
		const interpMode = weights.interpolationMode;
		let validClip = true;
		for (let j = 0; j < 3; ++j) {
			let k;
			for (k = 0; k < 3; ++k) if (matrix[4 * j + k] !== 0) break;
			clipExt[2 * j] = outExt[2 * j];
			clipExt[2 * j + 1] = outExt[2 * j + 1];
			const minExt = weights.extent[2 * k];
			const maxExt = weights.extent[2 * k + 1];
			const minBounds = model.structuredBounds[2 * k];
			const maxBounds = model.structuredBounds[2 * k + 1];
			let step = 1;
			step = interpMode < InterpolationMode.LINEAR ? step : 2;
			step = interpMode < InterpolationMode.CUBIC ? step : 4;
			const inCount = maxExt - minExt + 1;
			step = step < inCount ? step : inCount;
			if (Number.isInteger(matrix[4 * j + k]) && Number.isInteger(matrix[4 * k + k])) step = 1;
			const size = step * (outExt[2 * j + 1] - outExt[2 * j] + 1);
			const positions = new Int16Array(size);
			const startPositions = step * outExt[2 * j];
			let constants = null;
			if (interpMode !== InterpolationMode.NEAREST) constants = new Int16Array(size);
			weights.kernelSize[j] = step;
			weights.weightExtent[2 * j] = outExt[2 * j];
			weights.weightExtent[2 * j + 1] = outExt[2 * j + 1];
			weights.positions[j] = positions;
			weights.weights[j] = constants;
			let region = 0;
			for (let i = outExt[2 * j]; i <= outExt[2 * j + 1]; ++i) {
				const point = matrix[12 + k] + i * matrix[4 * j + k];
				let lcount = step;
				let inId0 = 0;
				let f = 0;
				if (interpMode === InterpolationMode.NEAREST) inId0 = Math.round(point);
				else {
					const res = vtkInterpolationMathFloor(point);
					inId0 = res.integer;
					f = res.error;
					if (interpMode === InterpolationMode.CUBIC && step !== 1) {
						inId0--;
						lcount = 4;
					}
				}
				const inId = [
					0,
					0,
					0,
					0
				];
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
				const inInc = weights.increments[k];
				positions[step * i - startPositions] = inId[0] * inInc;
				if (interpMode !== InterpolationMode.NEAREST) constants[step * i - startPositions] = 1;
				if (step > 1) {
					if (interpMode === InterpolationMode.LINEAR) {
						positions[step * i + 1 - startPositions] = inId[1] * inInc;
						constants[step * i - startPositions] = 1 - f;
						constants[step * i + 1 - startPositions] = f;
					} else if (interpMode === InterpolationMode.CUBIC) {
						const g = publicAPI.vtkTricubicInterpWeights(f);
						if (step === 4) for (let ll = 0; ll < 4; ll++) {
							positions[step * i + ll - startPositions] = inId[ll] * inInc;
							constants[step * i + ll - startPositions] = g[ll];
						}
						else {
							const gg = [
								0,
								0,
								0,
								0
							];
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
						region = 1;
						clipExt[2 * j] = i;
					}
				} else if (region === 1) {
					region = 2;
					clipExt[2 * j + 1] = i - 1;
				}
			}
			if (region === 0 || clipExt[2 * j] > clipExt[2 * j + 1]) validClip = false;
		}
		if (!validClip) for (let j = 0; j < 3; j++) {
			clipExt[2 * j] = outExt[2 * j];
			clipExt[2 * j + 1] = outExt[2 * j] - 1;
		}
	};
}
var ImageInterpolator_DEFAULT_VALUES = { interpolationMode: InterpolationMode.NEAREST };
function ImageInterpolator_extend(publicAPI, model, initialValues = {}) {
	Object.assign(model, ImageInterpolator_DEFAULT_VALUES, initialValues);
	AbstractImageInterpolator_default.extend(publicAPI, model, initialValues);
	macros/* ["default"].setGet */.Ay.setGet(publicAPI, model, ["interpolationMode"]);
	vtkImageInterpolator(publicAPI, model);
}
var ImageInterpolator_newInstance = macros/* ["default"].newInstance */.Ay.newInstance(ImageInterpolator_extend, "vtkImageInterpolator");
var ImageInterpolator_default = {
	newInstance: ImageInterpolator_newInstance,
	extend: ImageInterpolator_extend
};
//#endregion


//# sourceMappingURL=ImageInterpolator.js.map
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Imaging/Core/ImagePointDataIterator.js

//#region Sources/Imaging/Core/ImagePointDataIterator/index.js
function vtkImagePointDataIterator(publicAPI, model) {
	model.classHierarchy.push("vtkImagePointDataIterator");
	publicAPI.initialize = (image, inExtent, stencil, algorithm) => {
		const dataExtent = image.getExtent();
		let extent = inExtent;
		if (extent == null) extent = dataExtent;
		let emptyExtent = false;
		for (let i = 0; i < 6; i += 2) {
			model.extent[i] = Math.max(extent[i], dataExtent[i]);
			model.extent[i + 1] = Math.min(extent[i + 1], dataExtent[i + 1]);
			if (model.extent[i] > model.extent[i + 1]) emptyExtent = true;
		}
		model.rowIncrement = dataExtent[1] - dataExtent[0] + 1;
		model.sliceIncrement = model.rowIncrement * (dataExtent[3] - dataExtent[2] + 1);
		let rowSpan;
		let sliceSpan;
		let volumeSpan;
		if (!emptyExtent) {
			rowSpan = model.extent[1] - model.extent[0] + 1;
			sliceSpan = model.extent[3] - model.extent[2] + 1;
			volumeSpan = model.extent[5] - model.extent[4] + 1;
			model.id = model.extent[0] - dataExtent[0] + (model.extent[2] - dataExtent[2]) * model.rowIncrement + (model.extent[4] - dataExtent[4]) * model.sliceIncrement;
			model.rowEndIncrement = model.rowIncrement - rowSpan;
			model.sliceEndIncrement = model.rowEndIncrement + model.sliceIncrement - model.rowIncrement * sliceSpan;
		} else {
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
		model.spanEnd = model.id + rowSpan;
		model.rowEnd = model.id + rowSpan;
		model.sliceEnd = model.id + (model.rowIncrement * sliceSpan - model.rowEndIncrement);
		model.end = model.id + (model.sliceIncrement * volumeSpan - model.sliceEndIncrement);
		model.index[0] = model.extent[0];
		model.index[1] = model.extent[2];
		model.index[2] = model.extent[4];
		model.startY = model.index[1];
		if (stencil) {
			model.hasStencil = true;
			model.inStencil = false;
			model.spanIndex = 0;
			const stencilExtent = stencil.getExtent();
			model.spanSliceIncrement = 0;
			model.spanSliceEndIncrement = 0;
			if (stencilExtent[3] >= stencilExtent[2] && stencilExtent[5] >= stencilExtent[4]) {
				model.spanSliceIncrement = stencilExtent[3] - stencilExtent[2] + 1;
				const botOffset = model.extent[2] - stencilExtent[2];
				if (botOffset >= 0) model.spanSliceEndIncrement += botOffset;
				const topOffset = stencilExtent[3] - model.extent[3];
				if (topOffset >= 0) model.spanSliceEndIncrement += topOffset;
			}
			let startOffset = 0;
			const yOffset = model.extent[2] - stencilExtent[2];
			if (yOffset < 0) {
				model.extent[2] = stencilExtent[2];
				startOffset -= 1;
			} else startOffset += yOffset;
			if (stencilExtent[3] <= model.extent[3]) model.extent[3] = stencilExtent[3];
			const zOffset = model.extent[4] - stencilExtent[4];
			if (zOffset < 0) {
				model.extent[4] = stencilExtent[4];
				if (yOffset >= 0) startOffset -= 1 + model.spanSliceEndIncrement;
			} else startOffset += zOffset * model.spanSliceIncrement;
			if (stencilExtent[5] <= model.extent[5]) model.extent[5] = stencilExtent[5];
			if (model.extent[2] <= model.extent[3] && model.extent[4] <= model.extent[5]) {
				model.spanCountPointer = stencil.extentListLengths.subarray(startOffset);
				model.spanListPointer = stencil.extentLists.subarray(startOffset);
				if (yOffset >= 0 && zOffset >= 0) {
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
	publicAPI.setSpanState = (idX) => {
		let inStencil = false;
		const spans = model.spanListPointer;
		const n = model.spanCountPointer[0];
		let i;
		for (i = 0; i < n; ++i) {
			if (spans[i] > idX) break;
			inStencil = !inStencil;
		}
		model.spanIndex = i;
		model.inStencil = inStencil;
		let endIdX = model.extent[1] + 1;
		if (i < n && spans[i] <= model.extent[1]) endIdX = spans[i];
		const rowStart = model.rowEnd - (model.rowIncrement - model.rowEndIncrement);
		model.id = rowStart + (idX - model.extent[0]);
		model.spanEnd = rowStart + (endIdX - model.extent[0]);
	};
	publicAPI.nextSpan = () => {
		if (model.spanEnd === model.rowEnd) {
			let spanIncr = 1;
			if (model.spanEnd !== model.sliceEnd) {
				model.id = model.rowEnd + model.rowEndIncrement;
				model.rowEnd += model.rowIncrement;
				model.spanEnd = model.rowEnd;
				model.index[1]++;
			} else if (model.spanEnd !== model.end) {
				model.id = model.sliceEnd + model.sliceEndIncrement;
				model.sliceEnd += model.sliceIncrement;
				model.rowEnd = model.id + (model.rowIncrement - model.rowEndIncrement);
				model.spanEnd = model.rowEnd;
				model.index[1] = model.startY;
				model.index[2]++;
				spanIncr += model.spanSliceEndIncrement;
			} else {
				model.id = model.end;
				return;
			}
			model.index[0] = model.extent[0];
			if (model.hasStencil) if (model.index[1] >= model.extent[2] && model.index[1] <= model.extent[3] && model.index[2] >= model.extent[4] && model.index[2] <= model.extent[5]) {
				model.spanCountPointer = model.spanCountPointer.subarray(spanIncr);
				model.spanListPointer = model.spanListPointer.subarray(spanIncr);
				publicAPI.setSpanState(model.extent[0]);
			} else model.inStencil = false;
			if (model.algorithm) publicAPI.reportProgress();
		} else {
			model.id = model.spanEnd;
			const spanCount = model.spanCountPointer[0];
			let endIdX = model.extent[1] + 1;
			model.index[0] = endIdX;
			if (model.spanIndex < spanCount) {
				const tmpIdX = model.spanListPointer[model.spanIndex];
				if (tmpIdX < endIdX) model.index[0] = tmpIdX;
			}
			model.spanIndex++;
			if (model.spanIndex < spanCount) {
				const tmpIdX = model.spanListPointer[model.spanIndex];
				if (tmpIdX < endIdX) endIdX = tmpIdX;
			}
			model.spanEnd = model.rowEnd - (model.rowIncrement - model.rowEndIncrement) + (endIdX - model.extent[0]);
			model.inStencil = !model.inStencil;
		}
	};
	publicAPI.isAtEnd = () => model.id === model.end;
	publicAPI.isInStencil = () => model.inStencil;
	publicAPI.spanEndId = () => model.spanEnd;
	publicAPI.reportProgress = () => {};
	publicAPI.getArray = (array, i) => array.getData().subarray(i * array.getNumberOfComponents());
	publicAPI.getScalars = (image, i = 0) => publicAPI.getArray(image.getPointData().getScalars(), i);
}
var ImagePointDataIterator_DEFAULT_VALUES = {
	spanState: 0,
	extent: [
		0,
		-1,
		0,
		-1,
		0,
		-1
	],
	end: 0,
	spanEnd: 0,
	rowEnd: 0,
	sliceEnd: 0,
	rowIncrement: 0,
	rowEndIncrement: 0,
	sliceIncrement: 0,
	sliceEndIncrement: 0,
	id: 0,
	index: [
		0,
		0,
		0
	],
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
function ImagePointDataIterator_extend(publicAPI, model, initialValues = {}) {
	Object.assign(model, ImagePointDataIterator_DEFAULT_VALUES, initialValues);
	macros/* ["default"].obj */.Ay.obj(publicAPI, model);
	macros/* ["default"].get */.Ay.get(publicAPI, model, ["id", "index"]);
	vtkImagePointDataIterator(publicAPI, model);
}
var ImagePointDataIterator_newInstance = macros/* ["default"].newInstance */.Ay.newInstance(ImagePointDataIterator_extend, "vtkImagePointDataIterator");
var ImagePointDataIterator_default = {
	newInstance: ImagePointDataIterator_newInstance,
	extend: ImagePointDataIterator_extend
};
//#endregion


//# sourceMappingURL=ImagePointDataIterator.js.map
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Imaging/Core/ImageReslice/Constants.js
//#region Sources/Imaging/Core/ImageReslice/Constants.js
var SlabMode = {
	MIN: 0,
	MAX: 1,
	MEAN: 2,
	SUM: 3
};
var Constants_Constants_default = { SlabMode };
//#endregion


//# sourceMappingURL=Constants.js.map
// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/index.js
var esm = __webpack_require__(40230);
;// CONCATENATED MODULE: ../../../node_modules/@kitware/vtk.js/Imaging/Core/ImageReslice.js













//#region Sources/Imaging/Core/ImageReslice/index.js
var { SlabMode: ImageReslice_SlabMode } = Constants_Constants_default;
var { vtkErrorMacro } = macros/* ["default"] */.Ay;
function vtkImageReslice(publicAPI, model) {
	model.classHierarchy.push("vtkImageReslice");
	const superClass = { ...publicAPI };
	const indexMatrix = esm/* .mat4.identity */.pB.identity(new Float64Array(16));
	let optimizedTransform = null;
	function getImageResliceSlabTrap(tmpPtr, inComponents, sampleCount, f) {
		const n = sampleCount - 1;
		for (let i = 0; i < inComponents; i += 1) {
			let result = tmpPtr[i] * .5;
			for (let j = 1; j < n; j += 1) result += tmpPtr[i + j * inComponents];
			result += tmpPtr[i + n * inComponents] * .5;
			tmpPtr[i] = result * f;
		}
	}
	function getImageResliceSlabSum(tmpPtr, inComponents, sampleCount, f) {
		for (let i = 0; i < inComponents; i += 1) {
			let result = tmpPtr[i];
			for (let j = 1; j < sampleCount; j += 1) result += tmpPtr[i + j * inComponents];
			tmpPtr[i] = result * f;
		}
	}
	function getImageResliceCompositeMinValue(tmpPtr, inComponents, sampleCount) {
		for (let i = 0; i < inComponents; i += 1) {
			let result = tmpPtr[i];
			for (let j = 1; j < sampleCount; j += 1) result = Math.min(result, tmpPtr[i + j * inComponents]);
			tmpPtr[i] = result;
		}
	}
	function getImageResliceCompositeMaxValue(tmpPtr, inComponents, sampleCount) {
		for (let i = 0; i < inComponents; i += 1) {
			let result = tmpPtr[i];
			for (let j = 1; j < sampleCount; j += 1) result = Math.max(result, tmpPtr[i + j * inComponents]);
			tmpPtr[i] = result;
		}
	}
	function getImageResliceCompositeMeanValue(tmpPtr, inComponents, sampleCount) {
		getImageResliceSlabSum(tmpPtr, inComponents, sampleCount, 1 / sampleCount);
	}
	function getImageResliceCompositeMeanTrap(tmpPtr, inComponents, sampleCount) {
		getImageResliceSlabTrap(tmpPtr, inComponents, sampleCount, 1 / (sampleCount - 1));
	}
	function getImageResliceCompositeSumValue(tmpPtr, inComponents, sampleCount) {
		getImageResliceSlabSum(tmpPtr, inComponents, sampleCount, 1);
	}
	function getImageResliceCompositeSumTrap(tmpPtr, inComponents, sampleCount) {
		getImageResliceSlabTrap(tmpPtr, inComponents, sampleCount, 1);
	}
	publicAPI.getMTime = () => {
		let mTime = superClass.getMTime();
		if (model.resliceTransform) mTime = Math.max(mTime, model.resliceTransform.getMTime());
		return mTime;
	};
	publicAPI.setResliceAxes = (resliceAxes) => {
		if (!model.resliceAxes) model.resliceAxes = esm/* .mat4.identity */.pB.identity(new Float64Array(16));
		if (!esm/* .mat4.exactEquals */.pB.exactEquals(model.resliceAxes, resliceAxes)) {
			esm/* .mat4.copy */.pB.copy(model.resliceAxes, resliceAxes);
			publicAPI.modified();
			return true;
		}
		return false;
	};
	publicAPI.requestData = (inData, outData) => {
		const input = inData[0];
		if (!input) {
			vtkErrorMacro("Invalid or missing input");
			return;
		}
		const origin = input.getOrigin();
		const inSpacing = input.getSpacing();
		const dims = input.getDimensions();
		const inScalars = input.getPointData().getScalars();
		const inWholeExt = [
			0,
			dims[0] - 1,
			0,
			dims[1] - 1,
			0,
			dims[2] - 1
		];
		const outOrigin = [
			0,
			0,
			0
		];
		const outSpacing = [
			1,
			1,
			1
		];
		const outWholeExt = [
			0,
			0,
			0,
			0,
			0,
			0
		];
		const outDims = [
			0,
			0,
			0
		];
		const matrix = esm/* .mat4.identity */.pB.identity(new Float64Array(16));
		if (model.resliceAxes) esm/* .mat4.multiply */.pB.multiply(matrix, matrix, model.resliceAxes);
		const imatrix = new Float64Array(16);
		esm/* .mat4.invert */.pB.invert(imatrix, matrix);
		const inCenter = [
			origin[0] + .5 * (inWholeExt[0] + inWholeExt[1]) * inSpacing[0],
			origin[1] + .5 * (inWholeExt[2] + inWholeExt[3]) * inSpacing[1],
			origin[2] + .5 * (inWholeExt[4] + inWholeExt[5]) * inSpacing[2]
		];
		let maxBounds = null;
		if (model.autoCropOutput) maxBounds = publicAPI.getAutoCroppedOutputBounds(input);
		for (let i = 0; i < 3; i++) {
			let s = 0;
			let d = 0;
			let e = 0;
			let c = 0;
			if (model.transformInputSampling) {
				let r = 0;
				for (let j = 0; j < 3; j++) {
					c += imatrix[4 * j + i] * (inCenter[j] - matrix[12 + j]);
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
			if (model.outputSpacing == null) outSpacing[i] = s;
			else outSpacing[i] = model.outputSpacing[i];
			if (i >= model.outputDimensionality) {
				outWholeExt[2 * i] = 0;
				outWholeExt[2 * i + 1] = 0;
			} else if (model.outputExtent == null) {
				if (model.autoCropOutput) d = maxBounds[2 * i + 1] - maxBounds[2 * i];
				outWholeExt[2 * i] = Math.round(e);
				outWholeExt[2 * i + 1] = Math.round(outWholeExt[2 * i] + Math.abs(d / outSpacing[i]));
			} else {
				outWholeExt[2 * i] = model.outputExtent[2 * i];
				outWholeExt[2 * i + 1] = model.outputExtent[2 * i + 1];
			}
			if (i >= model.outputDimensionality) outOrigin[i] = 0;
			else if (model.outputOrigin == null) if (model.autoCropOutput) outOrigin[i] = maxBounds[2 * i] - outWholeExt[2 * i] * outSpacing[i];
			else outOrigin[i] = c - .5 * (outWholeExt[2 * i] + outWholeExt[2 * i + 1]) * outSpacing[i];
			else outOrigin[i] = model.outputOrigin[i];
			outDims[i] = outWholeExt[2 * i + 1] - outWholeExt[2 * i] + 1;
		}
		let dataType = inScalars.getDataType();
		if (model.outputScalarType) dataType = model.outputScalarType;
		const numComponents = input.getPointData().getScalars().getNumberOfComponents();
		const outScalarsData = macros/* ["default"].newTypedArray */.Ay.newTypedArray(dataType, outDims[0] * outDims[1] * outDims[2] * numComponents);
		const outScalars = DataArray/* ["default"].newInstance */.Ay.newInstance({
			name: "Scalars",
			values: outScalarsData,
			numberOfComponents: numComponents
		});
		const output = outData[0]?.initialize() || ImageData/* ["default"].newInstance */.Ay.newInstance();
		output.setDimensions(outDims);
		output.setOrigin(outOrigin);
		output.setSpacing(outSpacing);
		if (model.outputDirection) output.setDirection(model.outputDirection);
		output.getPointData().setScalars(outScalars);
		publicAPI.getIndexMatrix(input, output);
		let interpolationMode = model.interpolationMode;
		model.usePermuteExecute = false;
		if (model.optimization) {
			if (optimizedTransform == null && model.slabSliceSpacingFraction === 1 && model.interpolator.isSeparable() && publicAPI.isPermutationMatrix(indexMatrix)) {
				model.usePermuteExecute = true;
				if (publicAPI.canUseNearestNeighbor(indexMatrix, outWholeExt)) interpolationMode = InterpolationMode.NEAREST;
			}
		}
		model.interpolator.setInterpolationMode(interpolationMode);
		let borderMode = ImageBorderMode.CLAMP;
		borderMode = model.wrap ? ImageBorderMode.REPEAT : borderMode;
		borderMode = model.mirror ? ImageBorderMode.MIRROR : borderMode;
		model.interpolator.setBorderMode(borderMode);
		const mintol = 762939453125e-17;
		const maxtol = 2 * 2147483647;
		let tol = .5 * model.border;
		tol = borderMode === ImageBorderMode.CLAMP ? tol : maxtol;
		tol = tol > mintol ? tol : mintol;
		model.interpolator.setTolerance(tol);
		model.interpolator.initialize(input);
		publicAPI.vtkImageResliceExecute(input, output);
		model.interpolator.releaseData();
		outData[0] = output;
	};
	publicAPI.vtkImageResliceExecute = (input, output) => {
		const inScalars = input.getPointData().getScalars();
		const outScalars = output.getPointData().getScalars();
		let outPtr = outScalars.getData();
		const outExt = output.getExtent();
		const newmat = indexMatrix;
		const nsamples = Math.max(model.slabNumberOfSlices, 1);
		const slabSampleSpacing = model.slabSliceSpacingFraction;
		const perspective = publicAPI.isPerspectiveMatrix(newmat);
		let inPtr = inScalars.getData();
		const inputScalarSize = 1;
		const inputScalarType = inScalars.getDataType();
		const inComponents = inScalars.getNumberOfComponents();
		const componentOffset = model.interpolator.getComponentOffset();
		const borderMode = model.interpolator.getBorderMode();
		const inDims = input.getDimensions();
		const inExt = [
			0,
			inDims[0] - 1,
			0,
			inDims[1] - 1,
			0,
			inDims[2] - 1
		];
		const inInc = [
			0,
			0,
			0
		];
		inInc[0] = inScalars.getNumberOfComponents();
		inInc[1] = inInc[0] * inDims[0];
		inInc[2] = inInc[1] * inDims[1];
		const fullSize = inDims[0] * inDims[1] * inDims[2];
		if (componentOffset > 0 && componentOffset + inComponents < inInc[0]) inPtr = inPtr.subarray(inputScalarSize * componentOffset);
		let interpolationMode = InterpolationMode.NEAREST;
		if (model.interpolator.isA("vtkImageInterpolator")) interpolationMode = model.interpolator.getInterpolationMode();
		const convertScalars = null;
		const rescaleScalars = model.scalarShift !== 0 || model.scalarScale !== 1;
		const optimizeNearest = interpolationMode === InterpolationMode.NEAREST && borderMode === ImageBorderMode.CLAMP && !(optimizedTransform != null || perspective || convertScalars != null || rescaleScalars) && inputScalarType === outScalars.getDataType() && fullSize === inScalars.getNumberOfTuples() && model.border === true && nsamples <= 1;
		const scalarType = outScalars.getDataType();
		const scalarSize = 1;
		const outComponents = outScalars.getNumberOfComponents();
		const xAxis = [
			0,
			0,
			0,
			0
		];
		const yAxis = [
			0,
			0,
			0,
			0
		];
		const zAxis = [
			0,
			0,
			0,
			0
		];
		const origin = [
			0,
			0,
			0,
			0
		];
		for (let i = 0; i < 4; ++i) {
			xAxis[i] = newmat[0 + i];
			yAxis[i] = newmat[4 + i];
			zAxis[i] = newmat[8 + i];
			origin[i] = newmat[12 + i];
		}
		let floatPtr = null;
		if (!optimizeNearest) floatPtr = new Float64Array(inComponents * (outExt[1] - outExt[0] + nsamples));
		const background = macros/* ["default"].newTypedArray */.Ay.newTypedArray(inputScalarType, model.backgroundColor);
		const forceClamping = interpolationMode > InterpolationMode.LINEAR || nsamples > 1 && model.slabMode === ImageReslice_SlabMode.SUM;
		const convertpixels = publicAPI.getConversionFunc(inputScalarType, scalarType, model.scalarShift, model.scalarScale, forceClamping);
		const setpixels = publicAPI.getSetPixelsFunc(scalarType, scalarSize, outComponents, outPtr);
		const composite = publicAPI.getCompositeFunc(model.slabMode, model.slabTrapezoidIntegration);
		let idY = outExt[2] - 1;
		let idZ = outExt[4] - 1;
		const inPoint0 = [
			0,
			0,
			0,
			0
		];
		const inPoint1 = [
			0,
			0,
			0,
			0
		];
		const iter = ImagePointDataIterator_default.newInstance();
		iter.initialize(output, outExt, model.stencil, null);
		const outPtr0 = iter.getScalars(output, 0);
		let outPtrIndex = 0;
		const outTmp = macros/* ["default"].newTypedArray */.Ay.newTypedArray(scalarType, BoundingBox/* ["default"].getDiagonalLength */.Ay.getDiagonalLength(outExt) * outComponents * 2);
		const interpolatedPtr = new Float64Array(inComponents * nsamples);
		const interpolatedPoint = new Float64Array(inComponents);
		for (; !iter.isAtEnd(); iter.nextSpan()) {
			const span = iter.spanEndId() - iter.getId();
			outPtrIndex = iter.getId() * scalarSize * outComponents;
			if (!iter.isInStencil()) {
				const n = setpixels(outTmp, background, outComponents, span);
				for (let i = 0; i < n; ++i) outPtr0[outPtrIndex++] = outTmp[i];
			} else {
				const outIndex = iter.getIndex();
				if (outIndex[2] > idZ) {
					idZ = outIndex[2];
					inPoint0[0] = origin[0] + idZ * zAxis[0];
					inPoint0[1] = origin[1] + idZ * zAxis[1];
					inPoint0[2] = origin[2] + idZ * zAxis[2];
					inPoint0[3] = origin[3] + idZ * zAxis[3];
					idY = outExt[2] - 1;
				}
				if (outIndex[1] > idY) {
					idY = outIndex[1];
					inPoint1[0] = inPoint0[0] + idY * yAxis[0];
					inPoint1[1] = inPoint0[1] + idY * yAxis[1];
					inPoint1[2] = inPoint0[2] + idY * yAxis[2];
					inPoint1[3] = inPoint0[3] + idY * yAxis[3];
				}
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
							const inPoint2 = [
								inPoint1[0] + idX * xAxis[0],
								inPoint1[1] + idX * xAxis[1],
								inPoint1[2] + idX * xAxis[2],
								inPoint1[3] + idX * xAxis[3]
							];
							const inPoint3 = [
								0,
								0,
								0,
								0
							];
							let inPoint = inPoint2;
							isInBounds = false;
							let interpolatedPtrIndex = 0;
							for (let sample = 0; sample < nsamples; ++sample) {
								if (nsamples > 1) {
									let s = sample - .5 * (nsamples - 1);
									s *= slabSampleSpacing;
									inPoint3[0] = inPoint2[0] + s * zAxis[0];
									inPoint3[1] = inPoint2[1] + s * zAxis[1];
									inPoint3[2] = inPoint2[2] + s * zAxis[2];
									inPoint3[3] = inPoint2[3] + s * zAxis[3];
									inPoint = inPoint3;
								}
								if (perspective) {
									const f = 1 / inPoint[3];
									inPoint[0] *= f;
									inPoint[1] *= f;
									inPoint[2] *= f;
								}
								if (optimizedTransform !== null) {
									const inOrigin = model.interpolator.getOrigin();
									const inSpacing = model.interpolator.getSpacing();
									const inInvSpacing = [
										1 / inSpacing[0],
										1 / inSpacing[1],
										1 / inSpacing[2]
									];
									publicAPI.applyTransform(optimizedTransform, inPoint, inOrigin, inInvSpacing);
								}
								if (model.interpolator.checkBoundsIJK(inPoint)) {
									isInBounds = 1;
									model.interpolator.interpolateIJK(inPoint, interpolatedPoint);
									for (let i = 0; i < inComponents; ++i) interpolatedPtr[interpolatedPtrIndex++] = interpolatedPoint[i];
								}
							}
							if (interpolatedPtrIndex > inComponents) composite(interpolatedPtr, inComponents, interpolatedPtrIndex / inComponents);
							for (let i = 0; i < inComponents; ++i) tmpPtr[pixelIndex++] = interpolatedPtr[i];
							wasInBounds = idX > idXmin ? wasInBounds : isInBounds;
						}
						const numpixels = idX - 1 - (isInBounds !== wasInBounds) - startIdX + 1;
						let n = 0;
						if (wasInBounds) {
							if (rescaleScalars) publicAPI.rescaleScalars(floatPtr, inComponents, idXmax - idXmin + 1, model.scalarShift, model.scalarScale);
							n = convertpixels(outTmp, floatPtr.subarray(startIdX * inComponents), outComponents, numpixels);
						} else n = setpixels(outTmp, background, outComponents, numpixels);
						for (let i = 0; i < n; ++i) outPtr0[outPtrIndex++] = outTmp[i];
						startIdX += numpixels;
						wasInBounds = isInBounds;
					}
				} else {
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
						const inPoint = [
							inPoint1[0] + iidX * xAxis[0],
							inPoint1[1] + iidX * xAxis[1],
							inPoint1[2] + iidX * xAxis[2]
						];
						const inIdX = vtkInterpolationMathRound(inPoint[0]) - inExt[0];
						const inIdY = vtkInterpolationMathRound(inPoint[1]) - inExt[2];
						const inIdZ = vtkInterpolationMathRound(inPoint[2]) - inExt[4];
						if (inIdX >= 0 && inIdX < inExtX && inIdY >= 0 && inIdY < inExtY && inIdZ >= 0 && inIdZ < inExtZ) {
							if (!isInBounds) {
								startIdX = iidX;
								isInBounds = true;
								const n = setpixels(outTmp, background, outComponents, startIdX - idXmin);
								for (let i = 0; i < n; ++i) outPtr0[outPtrIndex++] = outTmp[i];
							}
							endIdX = iidX;
							let offset = inIdX * inIncX + inIdY * inIncY + inIdZ * inIncZ;
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
									for (let i = 0; i < bytesPerPixel; ++i) outPtr0[outPtrIndex++] = inPtrTmp0[offset + i];
									break;
								default: {
									let oc = 0;
									do
										outPtr0[outPtrIndex++] = inPtrTmp0[offset++];
									while (++oc !== bytesPerPixel);
									break;
								}
							}
						} else if (isInBounds) break;
					}
					outPtr = outPtrTmp;
					const n = setpixels(outTmp, background, outComponents, idXmax - endIdX);
					for (let i = 0; i < n; ++i) outPtr0[outPtrIndex++] = outTmp[i];
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
		const transform = esm/* .mat4.identity */.pB.identity(new Float64Array(16));
		optimizedTransform = null;
		if (model.resliceAxes) esm/* .mat4.copy */.pB.copy(transform, model.resliceAxes);
		if (model.resliceTransform) if (model.resliceTransform.isA("vtkHomogeneousTransform")) esm/* .mat4.multiply */.pB.multiply(transform, model.resliceTransform.getMatrix(), transform);
		else (0,macros/* .vtkWarningMacro */.Ez)("Non homogeneous transform have not yet been ported");
		const outMatrix = output.getIndexToWorld();
		esm/* .mat4.multiply */.pB.multiply(transform, transform, outMatrix);
		if (optimizedTransform == null) {
			const inMatrix = input.getWorldToIndex();
			esm/* .mat4.multiply */.pB.multiply(transform, inMatrix, transform);
		}
		esm/* .mat4.copy */.pB.copy(indexMatrix, transform);
		return indexMatrix;
	};
	publicAPI.getAutoCroppedOutputBounds = (input) => {
		const inOrigin = input.getOrigin();
		const inSpacing = input.getSpacing();
		const inDirection = input.getDirection();
		const dims = input.getDimensions();
		const inWholeExt = [
			0,
			dims[0] - 1,
			0,
			dims[1] - 1,
			0,
			dims[2] - 1
		];
		const matrix = new Float64Array(16);
		if (model.resliceAxes) esm/* .mat4.invert */.pB.invert(matrix, model.resliceAxes);
		else esm/* .mat4.identity */.pB.identity(matrix);
		let transform = null;
		if (model.resliceTransform) transform = model.resliceTransform.getInverse();
		let imageTransform = null;
		if (!Core_Math/* ["default"].isIdentity3x3 */.Ay.isIdentity3x3(inDirection)) imageTransform = MatrixBuilder/* ["default"].buildFromRadian */.A.buildFromRadian().translate(inOrigin[0], inOrigin[1], inOrigin[2]).multiply3x3(inDirection).translate(-inOrigin[0], -inOrigin[1], -inOrigin[2]).invert().getMatrix();
		const bounds = [
			Number.MAX_VALUE,
			-Number.MAX_VALUE,
			Number.MAX_VALUE,
			-Number.MAX_VALUE,
			Number.MAX_VALUE,
			-Number.MAX_VALUE
		];
		const point = [
			0,
			0,
			0,
			0
		];
		for (let i = 0; i < 8; ++i) {
			point[0] = inOrigin[0] + inWholeExt[i % 2] * inSpacing[0];
			point[1] = inOrigin[1] + inWholeExt[2 + Math.floor(i / 2) % 2] * inSpacing[1];
			point[2] = inOrigin[2] + inWholeExt[4 + Math.floor(i / 4) % 2] * inSpacing[2];
			point[3] = 1;
			if (imageTransform) esm/* .vec4.transformMat4 */.ln.Z0(point, point, imageTransform);
			if (model.resliceTransform) transform.transformPoint(point, point);
			esm/* .vec4.transformMat4 */.ln.Z0(point, point, matrix);
			const f = 1 / point[3];
			point[0] *= f;
			point[1] *= f;
			point[2] *= f;
			for (let j = 0; j < 3; ++j) {
				if (point[j] > bounds[2 * j + 1]) bounds[2 * j + 1] = point[j];
				if (point[j] < bounds[2 * j]) bounds[2 * j] = point[j];
			}
		}
		return bounds;
	};
	publicAPI.getDataTypeMinMax = (dataType) => {
		switch (dataType) {
			case "Int8Array": return {
				min: -128,
				max: 127
			};
			case "Int16Array": return {
				min: -32768,
				max: 32767
			};
			case "Uint16Array": return {
				min: 0,
				max: 65535
			};
			case "Int32Array": return {
				min: -2147483648,
				max: 2147483647
			};
			case "Uint32Array": return {
				min: 0,
				max: 4294967295
			};
			case "Float32Array": return {
				min: -12e37,
				max: 12e37
			};
			case "Float64Array": return {
				min: -12e37,
				max: 12e37
			};
			default: return {
				min: 0,
				max: 255
			};
		}
	};
	publicAPI.clamp = (outPtr, inPtr, numscalars, n, min, max) => {
		const count = n * numscalars;
		for (let i = 0; i < count; ++i) outPtr[i] = vtkInterpolationMathClamp(inPtr[i], min, max);
		return count;
	};
	publicAPI.convert = (outPtr, inPtr, numscalars, n) => {
		const count = n * numscalars;
		for (let i = 0; i < count; ++i) outPtr[i] = Math.round(inPtr[i]);
		return count;
	};
	publicAPI.getConversionFunc = (inputType, dataType, scalarShift, scalarScale, forceClamping) => {
		let useClamping = forceClamping;
		if (dataType !== Constants/* .VtkDataTypes.FLOAT */.JA.FLOAT && dataType !== Constants/* .VtkDataTypes.DOUBLE */.JA.DOUBLE && !forceClamping) {
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
		if (useClamping && dataType !== Constants/* .VtkDataTypes.FLOAT */.JA.FLOAT && dataType !== Constants/* .VtkDataTypes.DOUBLE */.JA.DOUBLE) {
			const minMax = publicAPI.getDataTypeMinMax(dataType);
			const clamp = (outPtr, inPtr, numscalars, n) => publicAPI.clamp(outPtr, inPtr, numscalars, n, minMax.min, minMax.max);
			return clamp;
		}
		return publicAPI.convert;
	};
	publicAPI.set = (outPtr, inPtr, numscalars, n) => {
		const count = numscalars * n;
		for (let i = 0; i < n; ++i) outPtr[i] = inPtr[i];
		return count;
	};
	publicAPI.set1 = (outPtr, inPtr, numscalars, n) => {
		outPtr.fill(inPtr[0], 0, n);
		return n;
	};
	publicAPI.getSetPixelsFunc = (dataType, dataSize, numscalars, dataPtr) => numscalars === 1 ? publicAPI.set1 : publicAPI.set;
	publicAPI.getCompositeFunc = (slabMode, slabTrapezoidIntegration) => {
		let composite = null;
		switch (slabMode) {
			case ImageReslice_SlabMode.MIN:
				composite = getImageResliceCompositeMinValue;
				break;
			case ImageReslice_SlabMode.MAX:
				composite = getImageResliceCompositeMaxValue;
				break;
			case ImageReslice_SlabMode.MEAN:
				if (slabTrapezoidIntegration) composite = getImageResliceCompositeMeanTrap;
				else composite = getImageResliceCompositeMeanValue;
				break;
			case ImageReslice_SlabMode.SUM:
				if (slabTrapezoidIntegration) composite = getImageResliceCompositeSumTrap;
				else composite = getImageResliceCompositeSumValue;
				break;
		}
		return composite;
	};
	publicAPI.applyTransform = (newTrans, inPoint, inOrigin, inInvSpacing) => {
		inPoint[3] = 1;
		esm/* .vec4.transformMat4 */.ln.Z0(inPoint, inPoint, newTrans);
		inPoint[0] -= inOrigin[0];
		inPoint[1] -= inOrigin[1];
		inPoint[2] -= inOrigin[2];
		inPoint[0] *= inInvSpacing[0];
		inPoint[1] *= inInvSpacing[1];
		inPoint[2] *= inInvSpacing[2];
	};
	publicAPI.rescaleScalars = (floatData, components, n, scalarShift, scalarScale) => {
		const m = n * components;
		for (let i = 0; i < m; ++i) floatData[i] = (floatData[i] + scalarShift) * scalarScale;
	};
	publicAPI.isPermutationMatrix = (matrix) => {
		for (let i = 0; i < 3; i++) if (matrix[4 * i + 3] !== 0) return false;
		if (matrix[15] !== 1) return false;
		for (let j = 0; j < 3; j++) {
			let k = 0;
			for (let i = 0; i < 3; i++) if (matrix[4 * j + i] !== 0) k++;
			if (k !== 1) return false;
		}
		return true;
	};
	publicAPI.isIdentityMatrix = (matrix) => {
		for (let i = 0; i < 4; ++i) for (let j = 0; j < 4; ++j) if ((i === j ? 1 : 0) !== matrix[4 * j + i]) return false;
		return true;
	};
	publicAPI.isPerspectiveMatrix = (matrix) => matrix[3] !== 0 || matrix[7] !== 0 || matrix[11] !== 0 || matrix[15] !== 1;
	publicAPI.canUseNearestNeighbor = (matrix, outExt) => {
		for (let i = 0; i < 3; i++) {
			let j;
			for (j = 0; j < 3; j++) if (matrix[4 * j + i] !== 0) break;
			if (j >= 3) return false;
			let x = matrix[4 * j + i];
			let y = matrix[12 + i];
			if (outExt[2 * j] === outExt[2 * j + 1]) {
				y += x * outExt[2 * i];
				x = 0;
			}
			const fx = vtkInterpolationMathFloor(x, 0).error;
			const fy = vtkInterpolationMathFloor(y, 0).error;
			if (fx !== 0 || fy !== 0) return false;
		}
		return true;
	};
}
var ImageReslice_DEFAULT_VALUES = {
	transformInputSampling: true,
	autoCropOutput: false,
	outputDimensionality: 3,
	outputSpacing: null,
	outputOrigin: null,
	outputDirection: null,
	outputExtent: null,
	outputScalarType: null,
	wrap: false,
	mirror: false,
	border: true,
	interpolationMode: InterpolationMode.NEAREST,
	slabMode: ImageReslice_SlabMode.MIN,
	slabTrapezoidIntegration: false,
	slabNumberOfSlices: 1,
	slabSliceSpacingFraction: 1,
	optimization: false,
	scalarShift: 0,
	scalarScale: 1,
	backgroundColor: [
		0,
		0,
		0,
		0
	],
	resliceAxes: null,
	interpolator: ImageInterpolator_default.newInstance(),
	usePermuteExecute: false
};
function ImageReslice_extend(publicAPI, model, initialValues = {}) {
	Object.assign(model, ImageReslice_DEFAULT_VALUES, initialValues);
	macros/* ["default"].obj */.Ay.obj(publicAPI, model);
	macros/* ["default"].algo */.Ay.algo(publicAPI, model, 1, 1);
	macros/* ["default"].setGet */.Ay.setGet(publicAPI, model, [
		"outputDimensionality",
		"outputScalarType",
		"scalarShift",
		"scalarScale",
		"transformInputSampling",
		"autoCropOutput",
		"wrap",
		"mirror",
		"border",
		"interpolationMode",
		"resliceTransform",
		"slabMode",
		"slabTrapezoidIntegration",
		"slabNumberOfSlices",
		"slabSliceSpacingFraction"
	]);
	macros/* ["default"].setGetArray */.Ay.setGetArray(publicAPI, model, ["outputOrigin", "outputSpacing"], 3);
	macros/* ["default"].setGetArray */.Ay.setGetArray(publicAPI, model, ["outputExtent"], 6);
	macros/* ["default"].setGetArray */.Ay.setGetArray(publicAPI, model, ["outputDirection"], 9);
	macros/* ["default"].setGetArray */.Ay.setGetArray(publicAPI, model, ["backgroundColor"], 4);
	macros/* ["default"].get */.Ay.get(publicAPI, model, ["resliceAxes"]);
	vtkImageReslice(publicAPI, model);
}
var ImageReslice_newInstance = macros/* ["default"].newInstance */.Ay.newInstance(ImageReslice_extend, "vtkImageReslice");
var ImageReslice_default = {
	newInstance: ImageReslice_newInstance,
	extend: ImageReslice_extend,
	...Constants_Constants_default
};
//#endregion


//# sourceMappingURL=ImageReslice.js.map

},
77738(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (/* reexport safe */ _lib_axios_js__rspack_import_0.A)
});
/* import */ var _lib_axios_js__rspack_import_0 = __webpack_require__(15832);


// This module is intended to unwrap Axios default export as named.
// Keep top-level export same with static properties
// so that it can keep same with es module or cjs
const {
  Axios,
  AxiosError,
  CanceledError,
  isCancel,
  CancelToken,
  VERSION,
  all,
  Cancel,
  isAxiosError,
  spread,
  toFormData,
  AxiosHeaders,
  HttpStatusCode,
  formToJSON,
  getAdapter,
  mergeConfig,
  create,
} = _lib_axios_js__rspack_import_0/* ["default"] */.A;




},

}]);