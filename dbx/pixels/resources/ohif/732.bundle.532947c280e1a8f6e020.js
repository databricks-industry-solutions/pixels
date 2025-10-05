"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[732],{

/***/ 10732:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentSpec: () => (/* binding */ ComponentSpec),
/* harmony export */   DataStream: () => (/* binding */ DataStream),
/* harmony export */   Decoder: () => (/* binding */ Decoder),
/* harmony export */   FrameHeader: () => (/* binding */ FrameHeader),
/* harmony export */   HuffmanTable: () => (/* binding */ HuffmanTable),
/* harmony export */   QuantizationTable: () => (/* binding */ QuantizationTable),
/* harmony export */   ScanComponent: () => (/* binding */ ScanComponent),
/* harmony export */   ScanHeader: () => (/* binding */ ScanHeader),
/* harmony export */   Utils: () => (/* binding */ utils_exports)
/* harmony export */ });
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/component-spec.ts
var ComponentSpec = {
  hSamp: 0,
  quantTableSel: 0,
  vSamp: 0
};

// src/data-stream.ts
var DataStream = class {
  buffer;
  index;
  constructor(data, offset, length) {
    this.buffer = new Uint8Array(data, offset, length);
    this.index = 0;
  }
  get16() {
    const value = (this.buffer[this.index] << 8) + this.buffer[this.index + 1];
    this.index += 2;
    return value;
  }
  get8() {
    const value = this.buffer[this.index];
    this.index += 1;
    return value;
  }
};

// src/frame-header.ts
var FrameHeader = class {
  dimX = 0;
  dimY = 0;
  numComp = 0;
  precision = 0;
  components = [];
  read(data) {
    let count = 0;
    let temp;
    const length = data.get16();
    count += 2;
    this.precision = data.get8();
    count += 1;
    this.dimY = data.get16();
    count += 2;
    this.dimX = data.get16();
    count += 2;
    this.numComp = data.get8();
    count += 1;
    for (let i = 1; i <= this.numComp; i += 1) {
      if (count > length) {
        throw new Error("ERROR: frame format error");
      }
      const c = data.get8();
      count += 1;
      if (count >= length) {
        throw new Error("ERROR: frame format error [c>=Lf]");
      }
      temp = data.get8();
      count += 1;
      if (!this.components[c]) {
        this.components[c] = { ...ComponentSpec };
      }
      this.components[c].hSamp = temp >> 4;
      this.components[c].vSamp = temp & 15;
      this.components[c].quantTableSel = data.get8();
      count += 1;
    }
    if (count !== length) {
      throw new Error("ERROR: frame format error [Lf!=count]");
    }
    return 1;
  }
};

// src/utils.ts
var utils_exports = {};
__export(utils_exports, {
  crc32: () => crc32,
  crcTable: () => crcTable,
  createArray: () => createArray,
  makeCRCTable: () => makeCRCTable
});
var createArray = (...dimensions) => {
  if (dimensions.length > 1) {
    const dim = dimensions[0];
    const rest = dimensions.slice(1);
    const newArray = [];
    for (let i = 0; i < dim; i++) {
      newArray[i] = createArray(...rest);
    }
    return newArray;
  } else {
    return Array(dimensions[0]).fill(void 0);
  }
};
var makeCRCTable = function() {
  let c;
  const crcTable2 = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
    }
    crcTable2[n] = c;
  }
  return crcTable2;
};
var crcTable = makeCRCTable();
var crc32 = function(buffer) {
  const uint8view = new Uint8Array(buffer);
  let crc = 0 ^ -1;
  for (let i = 0; i < uint8view.length; i++) {
    crc = crc >>> 8 ^ crcTable[(crc ^ uint8view[i]) & 255];
  }
  return (crc ^ -1) >>> 0;
};

// src/huffman-table.ts
var HuffmanTable = class _HuffmanTable {
  static MSB = 2147483648;
  l;
  th;
  v;
  tc;
  constructor() {
    this.l = createArray(4, 2, 16);
    this.th = [0, 0, 0, 0];
    this.v = createArray(4, 2, 16, 200);
    this.tc = [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0]
    ];
  }
  read(data, HuffTab) {
    let count = 0;
    let temp;
    let t;
    let c;
    let i;
    let j;
    const length = data.get16();
    count += 2;
    while (count < length) {
      temp = data.get8();
      count += 1;
      t = temp & 15;
      if (t > 3) {
        throw new Error("ERROR: Huffman table ID > 3");
      }
      c = temp >> 4;
      if (c > 2) {
        throw new Error("ERROR: Huffman table [Table class > 2 ]");
      }
      this.th[t] = 1;
      this.tc[t][c] = 1;
      for (i = 0; i < 16; i += 1) {
        this.l[t][c][i] = data.get8();
        count += 1;
      }
      for (i = 0; i < 16; i += 1) {
        for (j = 0; j < this.l[t][c][i]; j += 1) {
          if (count > length) {
            throw new Error("ERROR: Huffman table format error [count>Lh]");
          }
          this.v[t][c][i][j] = data.get8();
          count += 1;
        }
      }
    }
    if (count !== length) {
      throw new Error("ERROR: Huffman table format error [count!=Lf]");
    }
    for (i = 0; i < 4; i += 1) {
      for (j = 0; j < 2; j += 1) {
        if (this.tc[i][j] !== 0) {
          this.buildHuffTable(HuffTab[i][j], this.l[i][j], this.v[i][j]);
        }
      }
    }
    return 1;
  }
  //	Build_HuffTab()
  //	Parameter:  t       table ID
  //	            c       table class ( 0 for DC, 1 for AC )
  //	            L[i]    # of codewords which length is i
  //	            V[i][j] Huffman Value (length=i)
  //	Effect:
  //	    build up HuffTab[t][c] using L and V.
  buildHuffTable(tab, L, V) {
    let currentTable, k, i, j, n;
    const temp = 256;
    k = 0;
    for (i = 0; i < 8; i += 1) {
      for (j = 0; j < L[i]; j += 1) {
        for (n = 0; n < temp >> i + 1; n += 1) {
          tab[k] = V[i][j] | i + 1 << 8;
          k += 1;
        }
      }
    }
    for (i = 1; k < 256; i += 1, k += 1) {
      tab[k] = i | _HuffmanTable.MSB;
    }
    currentTable = 1;
    k = 0;
    for (i = 8; i < 16; i += 1) {
      for (j = 0; j < L[i]; j += 1) {
        for (n = 0; n < temp >> i - 7; n += 1) {
          tab[currentTable * 256 + k] = V[i][j] | i + 1 << 8;
          k += 1;
        }
        if (k >= 256) {
          if (k > 256) {
            throw new Error("ERROR: Huffman table error(1)!");
          }
          k = 0;
          currentTable += 1;
        }
      }
    }
  }
};

// src/quantization-table.ts
var QuantizationTable = class _QuantizationTable {
  precision = [];
  // Quantization precision 8 or 16
  tq = [0, 0, 0, 0];
  // 1: this table is presented
  quantTables = createArray(4, 64);
  // Tables
  static enhanceQuantizationTable = function(qtab, table) {
    for (let i = 0; i < 8; i += 1) {
      qtab[table[0 * 8 + i]] *= 90;
      qtab[table[4 * 8 + i]] *= 90;
      qtab[table[2 * 8 + i]] *= 118;
      qtab[table[6 * 8 + i]] *= 49;
      qtab[table[5 * 8 + i]] *= 71;
      qtab[table[1 * 8 + i]] *= 126;
      qtab[table[7 * 8 + i]] *= 25;
      qtab[table[3 * 8 + i]] *= 106;
    }
    for (let i = 0; i < 8; i += 1) {
      qtab[table[0 + 8 * i]] *= 90;
      qtab[table[4 + 8 * i]] *= 90;
      qtab[table[2 + 8 * i]] *= 118;
      qtab[table[6 + 8 * i]] *= 49;
      qtab[table[5 + 8 * i]] *= 71;
      qtab[table[1 + 8 * i]] *= 126;
      qtab[table[7 + 8 * i]] *= 25;
      qtab[table[3 + 8 * i]] *= 106;
    }
    for (let i = 0; i < 64; i += 1) {
      qtab[i] >>= 6;
    }
  };
  read(data, table) {
    let count = 0;
    let temp;
    let t;
    let i;
    const length = data.get16();
    count += 2;
    while (count < length) {
      temp = data.get8();
      count += 1;
      t = temp & 15;
      if (t > 3) {
        throw new Error("ERROR: Quantization table ID > 3");
      }
      this.precision[t] = temp >> 4;
      if (this.precision[t] === 0) {
        this.precision[t] = 8;
      } else if (this.precision[t] === 1) {
        this.precision[t] = 16;
      } else {
        throw new Error("ERROR: Quantization table precision error");
      }
      this.tq[t] = 1;
      if (this.precision[t] === 8) {
        for (i = 0; i < 64; i += 1) {
          if (count > length) {
            throw new Error("ERROR: Quantization table format error");
          }
          this.quantTables[t][i] = data.get8();
          count += 1;
        }
        _QuantizationTable.enhanceQuantizationTable(this.quantTables[t], table);
      } else {
        for (i = 0; i < 64; i += 1) {
          if (count > length) {
            throw new Error("ERROR: Quantization table format error");
          }
          this.quantTables[t][i] = data.get16();
          count += 2;
        }
        _QuantizationTable.enhanceQuantizationTable(this.quantTables[t], table);
      }
    }
    if (count !== length) {
      throw new Error("ERROR: Quantization table error [count!=Lq]");
    }
    return 1;
  }
};

// src/scan-component.ts
var ScanComponent = {
  acTabSel: 0,
  // AC table selector
  dcTabSel: 0,
  // DC table selector
  scanCompSel: 0
  // Scan component selector
};

// src/scan-header.ts
var ScanHeader = class {
  ah = 0;
  al = 0;
  numComp = 0;
  // Number of components in the scan
  selection = 0;
  // Start of spectral or predictor selection
  spectralEnd = 0;
  // End of spectral selection
  components = [];
  read(data) {
    let count = 0;
    let i;
    let temp;
    const length = data.get16();
    count += 2;
    this.numComp = data.get8();
    count += 1;
    for (i = 0; i < this.numComp; i += 1) {
      this.components[i] = { ...ScanComponent };
      if (count > length) {
        throw new Error("ERROR: scan header format error");
      }
      this.components[i].scanCompSel = data.get8();
      count += 1;
      temp = data.get8();
      count += 1;
      this.components[i].dcTabSel = temp >> 4;
      this.components[i].acTabSel = temp & 15;
    }
    this.selection = data.get8();
    count += 1;
    this.spectralEnd = data.get8();
    count += 1;
    temp = data.get8();
    this.ah = temp >> 4;
    this.al = temp & 15;
    count += 1;
    if (count !== length) {
      throw new Error("ERROR: scan header format error [count!=Ns]");
    }
    return 1;
  }
};

// src/decoder.ts
var littleEndian = function() {
  const buffer = new ArrayBuffer(2);
  new DataView(buffer).setInt16(
    0,
    256,
    true
    /* littleEndian */
  );
  return new Int16Array(buffer)[0] === 256;
}();
var Decoder = class _Decoder {
  static IDCT_P = [
    0,
    5,
    40,
    16,
    45,
    2,
    7,
    42,
    21,
    56,
    8,
    61,
    18,
    47,
    1,
    4,
    41,
    23,
    58,
    13,
    32,
    24,
    37,
    10,
    63,
    17,
    44,
    3,
    6,
    43,
    20,
    57,
    15,
    34,
    29,
    48,
    53,
    26,
    39,
    9,
    60,
    19,
    46,
    22,
    59,
    12,
    33,
    31,
    50,
    55,
    25,
    36,
    11,
    62,
    14,
    35,
    28,
    49,
    52,
    27,
    38,
    30,
    51,
    54
  ];
  static TABLE = [
    0,
    1,
    5,
    6,
    14,
    15,
    27,
    28,
    2,
    4,
    7,
    13,
    16,
    26,
    29,
    42,
    3,
    8,
    12,
    17,
    25,
    30,
    41,
    43,
    9,
    11,
    18,
    24,
    31,
    40,
    44,
    53,
    10,
    19,
    23,
    32,
    39,
    45,
    52,
    54,
    20,
    22,
    33,
    38,
    46,
    51,
    55,
    60,
    21,
    34,
    37,
    47,
    50,
    56,
    59,
    61,
    35,
    36,
    48,
    49,
    57,
    58,
    62,
    63
  ];
  static MAX_HUFFMAN_SUBTREE = 50;
  static MSB = 2147483648;
  static RESTART_MARKER_BEGIN = 65488;
  static RESTART_MARKER_END = 65495;
  buffer = null;
  stream = null;
  frame = new FrameHeader();
  huffTable = new HuffmanTable();
  quantTable = new QuantizationTable();
  scan = new ScanHeader();
  DU = createArray(10, 4, 64);
  // at most 10 data units in a MCU, at most 4 data units in one component
  HuffTab = createArray(4, 2, 50 * 256);
  IDCT_Source = [];
  nBlock = [];
  // number of blocks in the i-th Comp in a scan
  acTab = createArray(10, 1);
  // ac HuffTab for the i-th Comp in a scan
  dcTab = createArray(10, 1);
  // dc HuffTab for the i-th Comp in a scan
  qTab = createArray(10, 1);
  // quantization table for the i-th Comp in a scan
  marker = 0;
  markerIndex = 0;
  numComp = 0;
  restartInterval = 0;
  selection = 0;
  xDim = 0;
  yDim = 0;
  xLoc = 0;
  yLoc = 0;
  outputData = null;
  restarting = false;
  mask = 0;
  numBytes = 0;
  precision = void 0;
  components = [];
  getter = null;
  setter = null;
  output = null;
  selector = null;
  /**
   * The Decoder constructor.
   * @property {number} numBytes - number of bytes per component
   * @type {Function}
   */
  constructor(buffer, numBytes) {
    this.buffer = buffer ?? null;
    this.numBytes = numBytes ?? 0;
  }
  /**
   * Returns decompressed data.
   */
  decompress(buffer, offset, length) {
    const result = this.decode(buffer, offset, length);
    return result.buffer;
  }
  decode(buffer, offset, length, numBytes) {
    let scanNum = 0;
    const pred = [];
    let i;
    let compN;
    const temp = [];
    const index = [];
    let mcuNum;
    if (buffer) {
      this.buffer = buffer;
    }
    if (numBytes !== void 0) {
      this.numBytes = numBytes;
    }
    this.stream = new DataStream(this.buffer, offset, length);
    this.buffer = null;
    this.xLoc = 0;
    this.yLoc = 0;
    let current = this.stream.get16();
    if (current !== 65496) {
      throw new Error("Not a JPEG file");
    }
    current = this.stream.get16();
    while (current >> 4 !== 4092 || current === 65476) {
      switch (current) {
        case 65476:
          this.huffTable.read(this.stream, this.HuffTab);
          break;
        case 65484:
          throw new Error("Program doesn't support arithmetic coding. (format throw new IOException)");
        case 65499:
          this.quantTable.read(this.stream, _Decoder.TABLE);
          break;
        case 65501:
          this.restartInterval = this.readNumber() ?? 0;
          break;
        case 65504:
        case 65505:
        case 65506:
        case 65507:
        case 65508:
        case 65509:
        case 65510:
        case 65511:
        case 65512:
        case 65513:
        case 65514:
        case 65515:
        case 65516:
        case 65517:
        case 65518:
        case 65519:
          this.readApp();
          break;
        case 65534:
          this.readComment();
          break;
        default:
          if (current >> 8 !== 255) {
            throw new Error("ERROR: format throw new IOException! (decode)");
          }
      }
      current = this.stream.get16();
    }
    if (current < 65472 || current > 65479) {
      throw new Error("ERROR: could not handle arithmetic code!");
    }
    this.frame.read(this.stream);
    current = this.stream.get16();
    do {
      while (current !== 65498) {
        switch (current) {
          case 65476:
            this.huffTable.read(this.stream, this.HuffTab);
            break;
          case 65484:
            throw new Error("Program doesn't support arithmetic coding. (format throw new IOException)");
          case 65499:
            this.quantTable.read(this.stream, _Decoder.TABLE);
            break;
          case 65501:
            this.restartInterval = this.readNumber() ?? 0;
            break;
          case 65504:
          case 65505:
          case 65506:
          case 65507:
          case 65508:
          case 65509:
          case 65510:
          case 65511:
          case 65512:
          case 65513:
          case 65514:
          case 65515:
          case 65516:
          case 65517:
          case 65518:
          case 65519:
            this.readApp();
            break;
          case 65534:
            this.readComment();
            break;
          default:
            if (current >> 8 !== 255) {
              throw new Error("ERROR: format throw new IOException! (Parser.decode)");
            }
        }
        current = this.stream.get16();
      }
      this.precision = this.frame.precision;
      this.components = this.frame.components;
      if (!this.numBytes) {
        this.numBytes = Math.round(Math.ceil(this.precision / 8));
      }
      if (this.numBytes === 1) {
        this.mask = 255;
      } else {
        this.mask = 65535;
      }
      this.scan.read(this.stream);
      this.numComp = this.scan.numComp;
      this.selection = this.scan.selection;
      if (this.numBytes === 1) {
        if (this.numComp === 3) {
          this.getter = this.getValueRGB;
          this.setter = this.setValueRGB;
          this.output = this.outputRGB;
        } else {
          this.getter = this.getValue8;
          this.setter = this.setValue8;
          this.output = this.outputSingle;
        }
      } else {
        this.getter = this.getValue8;
        this.setter = this.setValue8;
        this.output = this.outputSingle;
      }
      switch (this.selection) {
        case 2:
          this.selector = this.select2;
          break;
        case 3:
          this.selector = this.select3;
          break;
        case 4:
          this.selector = this.select4;
          break;
        case 5:
          this.selector = this.select5;
          break;
        case 6:
          this.selector = this.select6;
          break;
        case 7:
          this.selector = this.select7;
          break;
        default:
          this.selector = this.select1;
          break;
      }
      for (i = 0; i < this.numComp; i += 1) {
        compN = this.scan.components[i].scanCompSel;
        this.qTab[i] = this.quantTable.quantTables[this.components[compN].quantTableSel];
        this.nBlock[i] = this.components[compN].vSamp * this.components[compN].hSamp;
        this.dcTab[i] = this.HuffTab[this.scan.components[i].dcTabSel][0];
        this.acTab[i] = this.HuffTab[this.scan.components[i].acTabSel][1];
      }
      this.xDim = this.frame.dimX;
      this.yDim = this.frame.dimY;
      if (this.numBytes === 1) {
        this.outputData = new Uint8Array(new ArrayBuffer(this.xDim * this.yDim * this.numBytes * this.numComp));
      } else {
        this.outputData = new Uint16Array(new ArrayBuffer(this.xDim * this.yDim * this.numBytes * this.numComp));
      }
      scanNum += 1;
      while (true) {
        temp[0] = 0;
        index[0] = 0;
        for (i = 0; i < 10; i += 1) {
          pred[i] = 1 << this.precision - 1;
        }
        if (this.restartInterval === 0) {
          current = this.decodeUnit(pred, temp, index);
          while (current === 0 && this.xLoc < this.xDim && this.yLoc < this.yDim) {
            this.output(pred);
            current = this.decodeUnit(pred, temp, index);
          }
          break;
        }
        for (mcuNum = 0; mcuNum < this.restartInterval; mcuNum += 1) {
          this.restarting = mcuNum === 0;
          current = this.decodeUnit(pred, temp, index);
          this.output(pred);
          if (current !== 0) {
            break;
          }
        }
        if (current === 0) {
          if (this.markerIndex !== 0) {
            current = 65280 | this.marker;
            this.markerIndex = 0;
          } else {
            current = this.stream.get16();
          }
        }
        if (!(current >= _Decoder.RESTART_MARKER_BEGIN && current <= _Decoder.RESTART_MARKER_END)) {
          break;
        }
      }
      if (current === 65500 && scanNum === 1) {
        this.readNumber();
        current = this.stream.get16();
      }
    } while (current !== 65497 && this.xLoc < this.xDim && this.yLoc < this.yDim && scanNum === 0);
    return this.outputData;
  }
  decodeUnit(prev, temp, index) {
    if (this.numComp === 1) {
      return this.decodeSingle(prev, temp, index);
    } else if (this.numComp === 3) {
      return this.decodeRGB(prev, temp, index);
    } else {
      return -1;
    }
  }
  select1(compOffset) {
    return this.getPreviousX(compOffset);
  }
  select2(compOffset) {
    return this.getPreviousY(compOffset);
  }
  select3(compOffset) {
    return this.getPreviousXY(compOffset);
  }
  select4(compOffset) {
    return this.getPreviousX(compOffset) + this.getPreviousY(compOffset) - this.getPreviousXY(compOffset);
  }
  select5(compOffset) {
    return this.getPreviousX(compOffset) + (this.getPreviousY(compOffset) - this.getPreviousXY(compOffset) >> 1);
  }
  select6(compOffset) {
    return this.getPreviousY(compOffset) + (this.getPreviousX(compOffset) - this.getPreviousXY(compOffset) >> 1);
  }
  select7(compOffset) {
    return (this.getPreviousX(compOffset) + this.getPreviousY(compOffset)) / 2;
  }
  decodeRGB(prev, temp, index) {
    if (this.selector === null)
      throw new Error("decode hasn't run yet");
    let actab, dctab, qtab, ctrC, i, k, j;
    prev[0] = this.selector(0);
    prev[1] = this.selector(1);
    prev[2] = this.selector(2);
    for (ctrC = 0; ctrC < this.numComp; ctrC += 1) {
      qtab = this.qTab[ctrC];
      actab = this.acTab[ctrC];
      dctab = this.dcTab[ctrC];
      for (i = 0; i < this.nBlock[ctrC]; i += 1) {
        for (k = 0; k < this.IDCT_Source.length; k += 1) {
          this.IDCT_Source[k] = 0;
        }
        let value = this.getHuffmanValue(dctab, temp, index);
        if (value >= 65280) {
          return value;
        }
        prev[ctrC] = this.IDCT_Source[0] = prev[ctrC] + this.getn(index, value, temp, index);
        this.IDCT_Source[0] *= qtab[0];
        for (j = 1; j < 64; j += 1) {
          value = this.getHuffmanValue(actab, temp, index);
          if (value >= 65280) {
            return value;
          }
          j += value >> 4;
          if ((value & 15) === 0) {
            if (value >> 4 === 0) {
              break;
            }
          } else {
            this.IDCT_Source[_Decoder.IDCT_P[j]] = this.getn(index, value & 15, temp, index) * qtab[j];
          }
        }
      }
    }
    return 0;
  }
  decodeSingle(prev, temp, index) {
    if (this.selector === null)
      throw new Error("decode hasn't run yet");
    let value, i, n, nRestart;
    if (this.restarting) {
      this.restarting = false;
      prev[0] = 1 << this.frame.precision - 1;
    } else {
      prev[0] = this.selector();
    }
    for (i = 0; i < this.nBlock[0]; i += 1) {
      value = this.getHuffmanValue(this.dcTab[0], temp, index);
      if (value >= 65280) {
        return value;
      }
      n = this.getn(prev, value, temp, index);
      nRestart = n >> 8;
      if (nRestart >= _Decoder.RESTART_MARKER_BEGIN && nRestart <= _Decoder.RESTART_MARKER_END) {
        return nRestart;
      }
      prev[0] += n;
    }
    return 0;
  }
  //	Huffman table for fast search: (HuffTab) 8-bit Look up table 2-layer search architecture, 1st-layer represent 256 node (8 bits) if codeword-length > 8
  //	bits, then the entry of 1st-layer = (# of 2nd-layer table) | MSB and it is stored in the 2nd-layer Size of tables in each layer are 256.
  //	HuffTab[*][*][0-256] is always the only 1st-layer table.
  //
  //	An entry can be: (1) (# of 2nd-layer table) | MSB , for code length > 8 in 1st-layer (2) (Code length) << 8 | HuffVal
  //
  //	HuffmanValue(table   HuffTab[x][y] (ex) HuffmanValue(HuffTab[1][0],...)
  //	                ):
  //	    return: Huffman Value of table
  //	            0xFF?? if it receives a MARKER
  //	    Parameter:  table   HuffTab[x][y] (ex) HuffmanValue(HuffTab[1][0],...)
  //	                temp    temp storage for remainded bits
  //	                index   index to bit of temp
  //	                in      FILE pointer
  //	    Effect:
  //	        temp  store new remainded bits
  //	        index change to new index
  //	        in    change to new position
  //	    NOTE:
  //	      Initial by   temp=0; index=0;
  //	    NOTE: (explain temp and index)
  //	      temp: is always in the form at calling time or returning time
  //	       |  byte 4  |  byte 3  |  byte 2  |  byte 1  |
  //	       |     0    |     0    | 00000000 | 00000??? |  if not a MARKER
  //	                                               ^index=3 (from 0 to 15)
  //	                                               321
  //	    NOTE (marker and marker_index):
  //	      If get a MARKER from 'in', marker=the low-byte of the MARKER
  //	        and marker_index=9
  //	      If marker_index=9 then index is always > 8, or HuffmanValue()
  //	        will not be called
  getHuffmanValue(table, temp, index) {
    let code, input;
    const mask = 65535;
    if (!this.stream)
      throw new Error("stream not initialized");
    if (index[0] < 8) {
      temp[0] <<= 8;
      input = this.stream.get8();
      if (input === 255) {
        this.marker = this.stream.get8();
        if (this.marker !== 0) {
          this.markerIndex = 9;
        }
      }
      temp[0] |= input;
    } else {
      index[0] -= 8;
    }
    code = table[temp[0] >> index[0]];
    if ((code & _Decoder.MSB) !== 0) {
      if (this.markerIndex !== 0) {
        this.markerIndex = 0;
        return 65280 | this.marker;
      }
      temp[0] &= mask >> 16 - index[0];
      temp[0] <<= 8;
      input = this.stream.get8();
      if (input === 255) {
        this.marker = this.stream.get8();
        if (this.marker !== 0) {
          this.markerIndex = 9;
        }
      }
      temp[0] |= input;
      code = table[(code & 255) * 256 + (temp[0] >> index[0])];
      index[0] += 8;
    }
    index[0] += 8 - (code >> 8);
    if (index[0] < 0) {
      throw new Error("index=" + index[0] + " temp=" + temp[0] + " code=" + code + " in HuffmanValue()");
    }
    if (index[0] < this.markerIndex) {
      this.markerIndex = 0;
      return 65280 | this.marker;
    }
    temp[0] &= mask >> 16 - index[0];
    return code & 255;
  }
  getn(PRED, n, temp, index) {
    let result, input;
    const one = 1;
    const n_one = -1;
    const mask = 65535;
    if (this.stream === null)
      throw new Error("stream not initialized");
    if (n === 0) {
      return 0;
    }
    if (n === 16) {
      if (PRED[0] >= 0) {
        return -32768;
      } else {
        return 32768;
      }
    }
    index[0] -= n;
    if (index[0] >= 0) {
      if (index[0] < this.markerIndex && !this.isLastPixel()) {
        this.markerIndex = 0;
        return (65280 | this.marker) << 8;
      }
      result = temp[0] >> index[0];
      temp[0] &= mask >> 16 - index[0];
    } else {
      temp[0] <<= 8;
      input = this.stream.get8();
      if (input === 255) {
        this.marker = this.stream.get8();
        if (this.marker !== 0) {
          this.markerIndex = 9;
        }
      }
      temp[0] |= input;
      index[0] += 8;
      if (index[0] < 0) {
        if (this.markerIndex !== 0) {
          this.markerIndex = 0;
          return (65280 | this.marker) << 8;
        }
        temp[0] <<= 8;
        input = this.stream.get8();
        if (input === 255) {
          this.marker = this.stream.get8();
          if (this.marker !== 0) {
            this.markerIndex = 9;
          }
        }
        temp[0] |= input;
        index[0] += 8;
      }
      if (index[0] < 0) {
        throw new Error("index=" + index[0] + " in getn()");
      }
      if (index[0] < this.markerIndex) {
        this.markerIndex = 0;
        return (65280 | this.marker) << 8;
      }
      result = temp[0] >> index[0];
      temp[0] &= mask >> 16 - index[0];
    }
    if (result < one << n - 1) {
      result += (n_one << n) + 1;
    }
    return result;
  }
  getPreviousX(compOffset = 0) {
    if (this.getter === null)
      throw new Error("decode hasn't run yet");
    if (this.xLoc > 0) {
      return this.getter(this.yLoc * this.xDim + this.xLoc - 1, compOffset);
    } else if (this.yLoc > 0) {
      return this.getPreviousY(compOffset);
    } else {
      return 1 << this.frame.precision - 1;
    }
  }
  getPreviousXY(compOffset = 0) {
    if (this.getter === null)
      throw new Error("decode hasn't run yet");
    if (this.xLoc > 0 && this.yLoc > 0) {
      return this.getter((this.yLoc - 1) * this.xDim + this.xLoc - 1, compOffset);
    } else {
      return this.getPreviousY(compOffset);
    }
  }
  getPreviousY(compOffset = 0) {
    if (this.getter === null)
      throw new Error("decode hasn't run yet");
    if (this.yLoc > 0) {
      return this.getter((this.yLoc - 1) * this.xDim + this.xLoc, compOffset);
    } else {
      return this.getPreviousX(compOffset);
    }
  }
  isLastPixel() {
    return this.xLoc === this.xDim - 1 && this.yLoc === this.yDim - 1;
  }
  outputSingle(PRED) {
    if (this.setter === null)
      throw new Error("decode hasn't run yet");
    if (this.xLoc < this.xDim && this.yLoc < this.yDim) {
      this.setter(this.yLoc * this.xDim + this.xLoc, this.mask & PRED[0]);
      this.xLoc += 1;
      if (this.xLoc >= this.xDim) {
        this.yLoc += 1;
        this.xLoc = 0;
      }
    }
  }
  outputRGB(PRED) {
    if (this.setter === null)
      throw new Error("decode hasn't run yet");
    const offset = this.yLoc * this.xDim + this.xLoc;
    if (this.xLoc < this.xDim && this.yLoc < this.yDim) {
      this.setter(offset, PRED[0], 0);
      this.setter(offset, PRED[1], 1);
      this.setter(offset, PRED[2], 2);
      this.xLoc += 1;
      if (this.xLoc >= this.xDim) {
        this.yLoc += 1;
        this.xLoc = 0;
      }
    }
  }
  setValue8(index, val) {
    if (!this.outputData)
      throw new Error("output data not ready");
    if (littleEndian) {
      this.outputData[index] = val;
    } else {
      this.outputData[index] = (val & 255) << 8 | val >> 8 & 255;
    }
  }
  getValue8(index) {
    if (this.outputData === null)
      throw new Error("output data not ready");
    if (littleEndian) {
      return this.outputData[index];
    } else {
      const val = this.outputData[index];
      return (val & 255) << 8 | val >> 8 & 255;
    }
  }
  setValueRGB(index, val, compOffset = 0) {
    if (this.outputData === null)
      return;
    this.outputData[index * 3 + compOffset] = val;
  }
  getValueRGB(index, compOffset) {
    if (this.outputData === null)
      throw new Error("output data not ready");
    return this.outputData[index * 3 + compOffset];
  }
  readApp() {
    if (this.stream === null)
      return null;
    let count = 0;
    const length = this.stream.get16();
    count += 2;
    while (count < length) {
      this.stream.get8();
      count += 1;
    }
    return length;
  }
  readComment() {
    if (this.stream === null)
      return null;
    let sb = "";
    let count = 0;
    const length = this.stream.get16();
    count += 2;
    while (count < length) {
      sb += this.stream.get8();
      count += 1;
    }
    return sb;
  }
  readNumber() {
    if (this.stream === null)
      return null;
    const Ld = this.stream.get16();
    if (Ld !== 4) {
      throw new Error("ERROR: Define number format throw new IOException [Ld!=4]");
    }
    return this.stream.get16();
  }
};

//# sourceMappingURL=lossless.js.map

/***/ })

}]);