(globalThis["rspackChunk"] = globalThis["rspackChunk"] || []).push([[4104], {
26337(module) {
"use strict";


function iota(n) {
  var result = new Array(n)
  for(var i=0; i<n; ++i) {
    result[i] = i
  }
  return result
}

module.exports = iota

},
3293(module, __unused_rspack_exports, __webpack_require__) {
var iota = __webpack_require__(26337)
var isBuffer = __webpack_require__(4575)

var hasTypedArrays  = ((typeof Float64Array) !== "undefined")

function compare1st(a, b) {
  return a[0] - b[0]
}

function order() {
  var stride = this.stride
  var terms = new Array(stride.length)
  var i
  for(i=0; i<terms.length; ++i) {
    terms[i] = [Math.abs(stride[i]), i]
  }
  terms.sort(compare1st)
  var result = new Array(terms.length)
  for(i=0; i<result.length; ++i) {
    result[i] = terms[i][1]
  }
  return result
}

function compileConstructor(dtype, dimension) {
  var className = ["View", dimension, "d", dtype].join("")
  if(dimension < 0) {
    className = "View_Nil" + dtype
  }
  var useGetters = (dtype === "generic")

  if(dimension === -1) {
    //Special case for trivial arrays
    var code =
      "function "+className+"(a){this.data=a;};\
var proto="+className+".prototype;\
proto.dtype='"+dtype+"';\
proto.index=function(){return -1};\
proto.size=0;\
proto.dimension=-1;\
proto.shape=proto.stride=proto.order=[];\
proto.lo=proto.hi=proto.transpose=proto.step=\
function(){return new "+className+"(this.data);};\
proto.get=proto.set=function(){};\
proto.pick=function(){return null};\
return function construct_"+className+"(a){return new "+className+"(a);}"
    var procedure = new Function(code)
    return procedure()
  } else if(dimension === 0) {
    //Special case for 0d arrays
    var code =
      "function "+className+"(a,d) {\
this.data = a;\
this.offset = d\
};\
var proto="+className+".prototype;\
proto.dtype='"+dtype+"';\
proto.index=function(){return this.offset};\
proto.dimension=0;\
proto.size=1;\
proto.shape=\
proto.stride=\
proto.order=[];\
proto.lo=\
proto.hi=\
proto.transpose=\
proto.step=function "+className+"_copy() {\
return new "+className+"(this.data,this.offset)\
};\
proto.pick=function "+className+"_pick(){\
return TrivialArray(this.data);\
};\
proto.valueOf=proto.get=function "+className+"_get(){\
return "+(useGetters ? "this.data.get(this.offset)" : "this.data[this.offset]")+
"};\
proto.set=function "+className+"_set(v){\
return "+(useGetters ? "this.data.set(this.offset,v)" : "this.data[this.offset]=v")+"\
};\
return function construct_"+className+"(a,b,c,d){return new "+className+"(a,d)}"
    var procedure = new Function("TrivialArray", code)
    return procedure(CACHED_CONSTRUCTORS[dtype][0])
  }

  var code = ["'use strict'"]

  //Create constructor for view
  var indices = iota(dimension)
  var args = indices.map(function(i) { return "i"+i })
  var index_str = "this.offset+" + indices.map(function(i) {
        return "this.stride[" + i + "]*i" + i
      }).join("+")
  var shapeArg = indices.map(function(i) {
      return "b"+i
    }).join(",")
  var strideArg = indices.map(function(i) {
      return "c"+i
    }).join(",")
  code.push(
    "function "+className+"(a," + shapeArg + "," + strideArg + ",d){this.data=a",
      "this.shape=[" + shapeArg + "]",
      "this.stride=[" + strideArg + "]",
      "this.offset=d|0}",
    "var proto="+className+".prototype",
    "proto.dtype='"+dtype+"'",
    "proto.dimension="+dimension)

  //view.size:
  code.push("Object.defineProperty(proto,'size',{get:function "+className+"_size(){\
return "+indices.map(function(i) { return "this.shape["+i+"]" }).join("*"),
"}})")

  //view.order:
  if(dimension === 1) {
    code.push("proto.order=[0]")
  } else {
    code.push("Object.defineProperty(proto,'order',{get:")
    if(dimension < 4) {
      code.push("function "+className+"_order(){")
      if(dimension === 2) {
        code.push("return (Math.abs(this.stride[0])>Math.abs(this.stride[1]))?[1,0]:[0,1]}})")
      } else if(dimension === 3) {
        code.push(
"var s0=Math.abs(this.stride[0]),s1=Math.abs(this.stride[1]),s2=Math.abs(this.stride[2]);\
if(s0>s1){\
if(s1>s2){\
return [2,1,0];\
}else if(s0>s2){\
return [1,2,0];\
}else{\
return [1,0,2];\
}\
}else if(s0>s2){\
return [2,0,1];\
}else if(s2>s1){\
return [0,1,2];\
}else{\
return [0,2,1];\
}}})")
      }
    } else {
      code.push("ORDER})")
    }
  }

  //view.set(i0, ..., v):
  code.push(
"proto.set=function "+className+"_set("+args.join(",")+",v){")
  if(useGetters) {
    code.push("return this.data.set("+index_str+",v)}")
  } else {
    code.push("return this.data["+index_str+"]=v}")
  }

  //view.get(i0, ...):
  code.push("proto.get=function "+className+"_get("+args.join(",")+"){")
  if(useGetters) {
    code.push("return this.data.get("+index_str+")}")
  } else {
    code.push("return this.data["+index_str+"]}")
  }

  //view.index:
  code.push(
    "proto.index=function "+className+"_index(", args.join(), "){return "+index_str+"}")

  //view.hi():
  code.push("proto.hi=function "+className+"_hi("+args.join(",")+"){return new "+className+"(this.data,"+
    indices.map(function(i) {
      return ["(typeof i",i,"!=='number'||i",i,"<0)?this.shape[", i, "]:i", i,"|0"].join("")
    }).join(",")+","+
    indices.map(function(i) {
      return "this.stride["+i + "]"
    }).join(",")+",this.offset)}")

  //view.lo():
  var a_vars = indices.map(function(i) { return "a"+i+"=this.shape["+i+"]" })
  var c_vars = indices.map(function(i) { return "c"+i+"=this.stride["+i+"]" })
  code.push("proto.lo=function "+className+"_lo("+args.join(",")+"){var b=this.offset,d=0,"+a_vars.join(",")+","+c_vars.join(","))
  for(var i=0; i<dimension; ++i) {
    code.push(
"if(typeof i"+i+"==='number'&&i"+i+">=0){\
d=i"+i+"|0;\
b+=c"+i+"*d;\
a"+i+"-=d}")
  }
  code.push("return new "+className+"(this.data,"+
    indices.map(function(i) {
      return "a"+i
    }).join(",")+","+
    indices.map(function(i) {
      return "c"+i
    }).join(",")+",b)}")

  //view.step():
  code.push("proto.step=function "+className+"_step("+args.join(",")+"){var "+
    indices.map(function(i) {
      return "a"+i+"=this.shape["+i+"]"
    }).join(",")+","+
    indices.map(function(i) {
      return "b"+i+"=this.stride["+i+"]"
    }).join(",")+",c=this.offset,d=0,ceil=Math.ceil")
  for(var i=0; i<dimension; ++i) {
    code.push(
"if(typeof i"+i+"==='number'){\
d=i"+i+"|0;\
if(d<0){\
c+=b"+i+"*(a"+i+"-1);\
a"+i+"=ceil(-a"+i+"/d)\
}else{\
a"+i+"=ceil(a"+i+"/d)\
}\
b"+i+"*=d\
}")
  }
  code.push("return new "+className+"(this.data,"+
    indices.map(function(i) {
      return "a" + i
    }).join(",")+","+
    indices.map(function(i) {
      return "b" + i
    }).join(",")+",c)}")

  //view.transpose():
  var tShape = new Array(dimension)
  var tStride = new Array(dimension)
  for(var i=0; i<dimension; ++i) {
    tShape[i] = "a[i"+i+"]"
    tStride[i] = "b[i"+i+"]"
  }
  code.push("proto.transpose=function "+className+"_transpose("+args+"){"+
    args.map(function(n,idx) { return n + "=(" + n + "===undefined?" + idx + ":" + n + "|0)"}).join(";"),
    "var a=this.shape,b=this.stride;return new "+className+"(this.data,"+tShape.join(",")+","+tStride.join(",")+",this.offset)}")

  //view.pick():
  code.push("proto.pick=function "+className+"_pick("+args+"){var a=[],b=[],c=this.offset")
  for(var i=0; i<dimension; ++i) {
    code.push("if(typeof i"+i+"==='number'&&i"+i+">=0){c=(c+this.stride["+i+"]*i"+i+")|0}else{a.push(this.shape["+i+"]);b.push(this.stride["+i+"])}")
  }
  code.push("var ctor=CTOR_LIST[a.length+1];return ctor(this.data,a,b,c)}")

  //Add return statement
  code.push("return function construct_"+className+"(data,shape,stride,offset){return new "+className+"(data,"+
    indices.map(function(i) {
      return "shape["+i+"]"
    }).join(",")+","+
    indices.map(function(i) {
      return "stride["+i+"]"
    }).join(",")+",offset)}")

  //Compile procedure
  var procedure = new Function("CTOR_LIST", "ORDER", code.join("\n"))
  return procedure(CACHED_CONSTRUCTORS[dtype], order)
}

function arrayDType(data) {
  if(isBuffer(data)) {
    return "buffer"
  }
  if(hasTypedArrays) {
    switch(Object.prototype.toString.call(data)) {
      case "[object Float64Array]":
        return "float64"
      case "[object Float32Array]":
        return "float32"
      case "[object Int8Array]":
        return "int8"
      case "[object Int16Array]":
        return "int16"
      case "[object Int32Array]":
        return "int32"
      case "[object Uint8Array]":
        return "uint8"
      case "[object Uint16Array]":
        return "uint16"
      case "[object Uint32Array]":
        return "uint32"
      case "[object Uint8ClampedArray]":
        return "uint8_clamped"
      case "[object BigInt64Array]":
        return "bigint64"
      case "[object BigUint64Array]":
        return "biguint64"
    }
  }
  if(Array.isArray(data)) {
    return "array"
  }
  return "generic"
}

var CACHED_CONSTRUCTORS = {
  "float32":[],
  "float64":[],
  "int8":[],
  "int16":[],
  "int32":[],
  "uint8":[],
  "uint16":[],
  "uint32":[],
  "array":[],
  "uint8_clamped":[],
  "bigint64": [],
  "biguint64": [],
  "buffer":[],
  "generic":[]
}

;(function() {
  for(var id in CACHED_CONSTRUCTORS) {
    CACHED_CONSTRUCTORS[id].push(compileConstructor(id, -1))
  }
});

function wrappedNDArrayCtor(data, shape, stride, offset) {
  if(data === undefined) {
    var ctor = CACHED_CONSTRUCTORS.array[0]
    return ctor([])
  } else if(typeof data === "number") {
    data = [data]
  }
  if(shape === undefined) {
    shape = [ data.length ]
  }
  var d = shape.length
  if(stride === undefined) {
    stride = new Array(d)
    for(var i=d-1, sz=1; i>=0; --i) {
      stride[i] = sz
      sz *= shape[i]
    }
  }
  if(offset === undefined) {
    offset = 0
    for(var i=0; i<d; ++i) {
      if(stride[i] < 0) {
        offset -= (shape[i]-1)*stride[i]
      }
    }
  }
  var dtype = arrayDType(data)
  var ctor_list = CACHED_CONSTRUCTORS[dtype]
  while(ctor_list.length <= d+1) {
    ctor_list.push(compileConstructor(dtype, ctor_list.length-1))
  }
  var ctor = ctor_list[d+1]
  return ctor(data, shape, stride, offset)
}

module.exports = wrappedNDArrayCtor


},
4575(module) {
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


},
65419(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  fX: () => (/* reexport */ enums_namespaceObject),
  W6: () => (/* reexport */ NO_IMAGE_ID),
  X6: () => (/* reexport */ adaptersPMAP),
  f_: () => (/* reexport */ adaptersRT),
  ql: () => (/* reexport */ adaptersSEG),
  QX: () => (/* reexport */ adaptersSR),
  _$: () => (/* reexport */ helpers_namespaceObject)
});

// UNUSED EXPORTS: utilities
// NAMESPACE OBJECT: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/Segmentation.js
var Segmentation_namespaceObject = {};
__webpack_require__.r(Segmentation_namespaceObject);
__webpack_require__.d(Segmentation_namespaceObject, { 
  fillSegmentation: () => (Segmentation_fillSegmentation),
  generateSegmentation: () => (Segmentation_generateSegmentation),
  generateToolState: () => (Segmentation_generateToolState) });

// NAMESPACE OBJECT: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/Segmentation/index.js
var Cornerstone3D_Segmentation_namespaceObject = {};
__webpack_require__.r(Cornerstone3D_Segmentation_namespaceObject);
__webpack_require__.d(Cornerstone3D_Segmentation_namespaceObject, { 
  createFromDICOMSegBuffer: () => (createFromDICOMSegBuffer),
  createFromDicomSegImageId: () => (createFromDicomSegImageId),
  createLabelmapsFromDICOMBuffer: () => (createLabelmapsFromDICOMBuffer),
  createLabelmapsFromSegImageIds: () => (createLabelmapsFromSegImageIds),
  generateLabelMaps2DFrom3D: () => (generateLabelMaps2DFrom3D),
  generateSegmentation: () => (generateSegmentation_generateSegmentation),
  generateToolState: () => (generateToolState_generateToolState) });

// NAMESPACE OBJECT: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/ParametricMap/index.js
var Cornerstone3D_ParametricMap_namespaceObject = {};
__webpack_require__.r(Cornerstone3D_ParametricMap_namespaceObject);
__webpack_require__.d(Cornerstone3D_ParametricMap_namespaceObject, { 
  generateToolState: () => (ParametricMap_generateToolState_generateToolState) });

// NAMESPACE OBJECT: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/RTStruct/index.js
var RTStruct_namespaceObject = {};
__webpack_require__.r(RTStruct_namespaceObject);
__webpack_require__.d(RTStruct_namespaceObject, { 
  generateContourSetsFromLabelmap: () => (RTStruct_generateContourSetsFromLabelmap),
  generateRTSSFromAnnotations: () => (generateRTSSFromAnnotations),
  generateRTSSFromContour: () => (generateRTSSFromContour),
  generateRTSSFromLabelmap: () => (generateRTSSFromLabelmap),
  generateRTSSFromRepresentation: () => (generateRTSSFromRepresentation),
  generateRTSSFromSegmentations: () => (generateRTSSFromSegmentations) });

// NAMESPACE OBJECT: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/enums/index.js
var enums_namespaceObject = {};
__webpack_require__.r(enums_namespaceObject);
__webpack_require__.d(enums_namespaceObject, { 
  s: () => (Events_Events) });

// NAMESPACE OBJECT: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/index.js
var helpers_namespaceObject = {};
__webpack_require__.r(helpers_namespaceObject);
__webpack_require__.d(helpers_namespaceObject, { 
  vk: () => (downloadDICOMData) });


// EXTERNAL MODULE: ../../../node_modules/dcmjs/build/dcmjs.es.js
var dcmjs_es = __webpack_require__(5842);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/toArray.js
const toArray = x => Array.isArray(x) ? x : x !== undefined ? [x] : [];



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/codeMeaningEquals.js
const codeMeaningEquals = codeMeaningName => {
  return contentItem => {
    return contentItem.ConceptNameCodeSequence.CodeMeaning === codeMeaningName;
  };
};



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/downloadDICOMData.js


const datasetToBlob = dcmjs_es/* .data.datasetToBlob */.p.datasetToBlob;
function downloadDICOMData(bufferOrDataset, filename) {
  let blob;
  if (bufferOrDataset instanceof ArrayBuffer) {
    blob = new Blob([bufferOrDataset], {
      type: 'application/dicom'
    });
  } else {
    if (!bufferOrDataset._meta) {
      throw new Error('Dataset must have a _meta property');
    }
    blob = datasetToBlob(bufferOrDataset);
  }
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}



// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(88479);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/toScoordType.js


const globalWorldToImageCoords = esm.utilities.worldToImageCoords;
let useWorldToImageCoords = globalWorldToImageCoords;
function toScoord(_ref, point) {
  let is3DMeasurement = _ref.is3DMeasurement,
    referencedImageId = _ref.referencedImageId;
  if (is3DMeasurement) {
    return {
      x: point[0],
      y: point[1],
      z: point[2]
    };
  }
  const point2 = useWorldToImageCoords(referencedImageId, point);
  return {
    x: point2[0],
    y: point2[1]
  };
}
function toScoords(scoordArgs, points) {
  return points.map(point => toScoord(scoordArgs, point));
}
function setWorldToImageCoords() {
  let worldToImage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : globalWorldToImageCoords;
  useWorldToImageCoords = worldToImage;
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/scoordToWorld.js


const imageToWorldCoords = esm.utilities.imageToWorldCoords;
function scoordToWorld(_ref, scoord) {
  let is3DMeasurement = _ref.is3DMeasurement,
    referencedImageId = _ref.referencedImageId;
  const worldCoords = [];
  if (is3DMeasurement) {
    const GraphicData = scoord.GraphicData;
    for (let i = 0; i < GraphicData.length; i += 3) {
      const point = [GraphicData[i], GraphicData[i + 1], GraphicData[i + 2]];
      worldCoords.push(point);
    }
  } else {
    const GraphicData = scoord.GraphicData;
    for (let i = 0; i < GraphicData.length; i += 2) {
      const point = imageToWorldCoords(referencedImageId, [GraphicData[i], GraphicData[i + 1]]);
      worldCoords.push(point);
    }
  }
  return worldCoords;
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/MeasurementReport.js







const TID1500 = dcmjs_es/* .utilities.TID1500 */.BF.TID1500,
  addAccessors = dcmjs_es/* .utilities.addAccessors */.BF.addAccessors;
const StructuredReport = dcmjs_es/* .derivations.StructuredReport */.h4.StructuredReport;
const Normalizer = dcmjs_es/* .normalizers.Normalizer */.z8.Normalizer;
const TID1500MeasurementReport = TID1500.TID1500MeasurementReport,
  TID1501MeasurementGroup = TID1500.TID1501MeasurementGroup;
const DicomMetaDictionary = dcmjs_es/* .data.DicomMetaDictionary */.p.DicomMetaDictionary;
const FINDING = {
  CodingSchemeDesignator: 'DCM',
  CodeValue: '121071'
};
const FINDING_SITE = {
  CodingSchemeDesignator: 'SCT',
  CodeValue: '363698007'
};
const FINDING_SITE_OLD = {
  CodingSchemeDesignator: 'SRT',
  CodeValue: 'G-C0E3'
};
const codeValueMatch = (group, code, oldCode) => {
  const ConceptNameCodeSequence = group.ConceptNameCodeSequence;
  if (!ConceptNameCodeSequence) {
    return;
  }
  const CodingSchemeDesignator = ConceptNameCodeSequence.CodingSchemeDesignator,
    CodeValue = ConceptNameCodeSequence.CodeValue;
  return CodingSchemeDesignator == code.CodingSchemeDesignator && CodeValue == code.CodeValue || oldCode && CodingSchemeDesignator == oldCode.CodingSchemeDesignator && CodeValue == oldCode.CodeValue;
};
function getTID300ContentItem(tool, ReferencedSOPSequence, adapterClass) {
  const args = adapterClass.getTID300RepresentationArguments(tool);
  args.ReferencedSOPSequence = ReferencedSOPSequence;
  args.ReferencedFrameOfReferenceUID = args.use3DSpatialCoordinates ? tool.metadata.FrameOfReferenceUID : null;
  const tid300Measurement = new adapterClass.TID300Representation(args);
  return tid300Measurement;
}
function getMeasurementGroup(toolType, toolData, ReferencedSOPSequence) {
  const toolTypeData = toolData[toolType];
  const toolClass = MeasurementReport.CORNERSTONE_TOOL_CLASSES_BY_TOOL_TYPE[toolType];
  if (!toolTypeData || !toolTypeData.data || !toolTypeData.data.length || !toolClass) {
    return;
  }

  // Loop through the array of tool instances
  // for this tool
  const measurements = toolTypeData.data.map(tool => {
    return getTID300ContentItem(tool, ReferencedSOPSequence, toolClass);
  });
  return new TID1501MeasurementGroup(measurements);
}
class MeasurementReport {
  static getSetupMeasurementData(MeasurementGroup) {
    const ContentSequence = MeasurementGroup.ContentSequence;
    const contentSequenceArr = toArray(ContentSequence);
    const findingGroup = contentSequenceArr.find(group => codeValueMatch(group, FINDING));
    const findingSiteGroups = contentSequenceArr.filter(group => codeValueMatch(group, FINDING_SITE, FINDING_SITE_OLD)) || [];
    const NUMGroup = contentSequenceArr.find(group => group.ValueType === 'NUM');
    const SCOORDGroup = toArray(NUMGroup.ContentSequence).find(group => group.ValueType === 'SCOORD');
    const ReferencedSOPSequence = SCOORDGroup.ContentSequence.ReferencedSOPSequence;
    const ReferencedSOPInstanceUID = ReferencedSOPSequence.ReferencedSOPInstanceUID,
      ReferencedFrameNumber = ReferencedSOPSequence.ReferencedFrameNumber;
    const defaultState = {
      sopInstanceUid: ReferencedSOPInstanceUID,
      frameIndex: ReferencedFrameNumber || 1,
      complete: true,
      finding: findingGroup ? addAccessors(findingGroup.ConceptCodeSequence) : undefined,
      findingSites: findingSiteGroups.map(fsg => {
        return addAccessors(fsg.ConceptCodeSequence);
      })
    };
    if (defaultState.finding) {
      defaultState.description = defaultState.finding.CodeMeaning;
    }
    const findingSite = defaultState.findingSites && defaultState.findingSites[0];
    if (findingSite) {
      defaultState.location = findingSite[0] && findingSite[0].CodeMeaning || findingSite.CodeMeaning;
    }
    return {
      defaultState,
      findingGroup,
      findingSiteGroups,
      NUMGroup,
      SCOORDGroup,
      ReferencedSOPSequence,
      ReferencedSOPInstanceUID,
      ReferencedFrameNumber
    };
  }
  static generateReport(toolState, metadataProvider, options) {
    // ToolState for array of imageIDs to a Report
    // Assume Cornerstone metadata provider has access to Study / Series / Sop Instance UID

    let allMeasurementGroups = [];
    const firstImageId = Object.keys(toolState)[0];
    if (!firstImageId) {
      throw new Error('No measurements provided.');
    }

    /* Patient ID
        Warning - Missing attribute or value that would be needed to build DICOMDIR - Patient ID
        Warning - Missing attribute or value that would be needed to build DICOMDIR - Study Date
        Warning - Missing attribute or value that would be needed to build DICOMDIR - Study Time
        Warning - Missing attribute or value that would be needed to build DICOMDIR - Study ID
         */
    const generalSeriesModule = metadataProvider.get('generalSeriesModule', firstImageId);

    //const sopCommonModule = metadataProvider.get('sopCommonModule', firstImageId);

    // NOTE: We are getting the Series and Study UIDs from the first imageId of the toolState
    // which means that if the toolState is for multiple series, the report will have the incorrect
    // SeriesInstanceUIDs
    const studyInstanceUID = generalSeriesModule.studyInstanceUID,
      seriesInstanceUID = generalSeriesModule.seriesInstanceUID;

    // Loop through each image in the toolData
    Object.keys(toolState).forEach(imageId => {
      const sopCommonModule = metadataProvider.get('sopCommonModule', imageId);
      const frameNumber = metadataProvider.get('frameNumber', imageId);
      const toolData = toolState[imageId];
      const toolTypes = Object.keys(toolData);
      const ReferencedSOPSequence = {
        ReferencedSOPClassUID: sopCommonModule.sopClassUID,
        ReferencedSOPInstanceUID: sopCommonModule.sopInstanceUID
      };
      if (Normalizer.isMultiframeSOPClassUID(sopCommonModule.sopClassUID)) {
        ReferencedSOPSequence.ReferencedFrameNumber = frameNumber;
      }

      // Loop through each tool type for the image
      const measurementGroups = [];
      toolTypes.forEach(toolType => {
        const group = getMeasurementGroup(toolType, toolData, ReferencedSOPSequence);
        if (group) {
          measurementGroups.push(group);
        }
      });
      allMeasurementGroups = allMeasurementGroups.concat(measurementGroups);
    });
    const tid1500MeasurementReport = new TID1500MeasurementReport({
      TID1501MeasurementGroups: allMeasurementGroups
    }, options);

    // TODO: what is the correct metaheader
    // http://dicom.nema.org/medical/Dicom/current/output/chtml/part10/chapter_7.html
    // TODO: move meta creation to happen in derivations.js
    const fileMetaInformationVersionArray = new Uint8Array(2);
    fileMetaInformationVersionArray[1] = 1;
    const derivationSourceDataset = {
      StudyInstanceUID: studyInstanceUID,
      SeriesInstanceUID: seriesInstanceUID
      //SOPInstanceUID: sopInstanceUID, // TODO: Necessary?
      //SOPClassUID: sopClassUID,
    };
    const _meta = {
      FileMetaInformationVersion: {
        Value: [fileMetaInformationVersionArray.buffer],
        vr: 'OB'
      },
      //MediaStorageSOPClassUID
      //MediaStorageSOPInstanceUID: sopCommonModule.sopInstanceUID,
      TransferSyntaxUID: {
        Value: ['1.2.840.10008.1.2.1'],
        vr: 'UI'
      },
      ImplementationClassUID: {
        Value: [DicomMetaDictionary.uid()],
        // TODO: could be git hash or other valid id
        vr: 'UI'
      },
      ImplementationVersionName: {
        Value: ['dcmjs'],
        vr: 'SH'
      }
    };
    const _vrMap = {
      PixelData: 'OW'
    };
    derivationSourceDataset._meta = _meta;
    derivationSourceDataset._vrMap = _vrMap;
    const report = new StructuredReport([derivationSourceDataset]);
    const contentItem = tid1500MeasurementReport.contentItem(derivationSourceDataset);

    // Merge the derived dataset with the content from the Measurement Report
    report.dataset = Object.assign(report.dataset, contentItem);
    report.dataset._meta = _meta;
    report.dataset.SpecificCharacterSet = 'ISO_IR 192';
    return report;
  }

  /**
   * Generate Cornerstone tool state from dataset
   * @param {object} dataset dataset
   * @param {object} hooks
   * @param {function} hooks.getToolClass Function to map dataset to a tool class
   * @returns
   */
  static generateToolState(dataset) {
    let hooks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    // For now, bail out if the dataset is not a TID1500 SR with length measurements
    if (dataset.ContentTemplateSequence.TemplateIdentifier !== '1500') {
      throw new Error('This package can currently only interpret DICOM SR TID 1500');
    }
    const REPORT = 'Imaging Measurements';
    const GROUP = 'Measurement Group';
    const TRACKING_IDENTIFIER = 'Tracking Identifier';

    // Identify the Imaging Measurements
    const imagingMeasurementContent = toArray(dataset.ContentSequence).find(codeMeaningEquals(REPORT));

    // Retrieve the Measurements themselves
    const measurementGroups = toArray(imagingMeasurementContent.ContentSequence).filter(codeMeaningEquals(GROUP));

    // For each of the supported measurement types, compute the measurement data
    const measurementData = {};
    const cornerstoneToolClasses = MeasurementReport.CORNERSTONE_TOOL_CLASSES_BY_UTILITY_TYPE;
    const registeredToolClasses = [];
    Object.keys(cornerstoneToolClasses).forEach(key => {
      registeredToolClasses.push(cornerstoneToolClasses[key]);
      measurementData[key] = [];
    });
    measurementGroups.forEach(measurementGroup => {
      const measurementGroupContentSequence = toArray(measurementGroup.ContentSequence);
      const TrackingIdentifierGroup = measurementGroupContentSequence.find(contentItem => contentItem.ConceptNameCodeSequence.CodeMeaning === TRACKING_IDENTIFIER);
      const TrackingIdentifierValue = TrackingIdentifierGroup.TextValue;
      const toolClass = hooks.getToolClass ? hooks.getToolClass(measurementGroup, dataset, registeredToolClasses) : registeredToolClasses.find(tc => tc.isValidCornerstoneTrackingIdentifier(TrackingIdentifierValue));
      if (toolClass) {
        const measurement = toolClass.getMeasurementData(measurementGroup);
        console.log("=== ".concat(toolClass.toolType, " ==="));
        console.log(measurement);
        measurementData[toolClass.toolType].push(measurement);
      }
    });

    // NOTE: There is no way of knowing the cornerstone imageIds as that could be anything.
    // That is up to the consumer to derive from the SOPInstanceUIDs.
    return measurementData;
  }
  static registerTool(toolClass) {
    MeasurementReport.CORNERSTONE_TOOL_CLASSES_BY_UTILITY_TYPE[toolClass.utilityToolType] = toolClass;
    MeasurementReport.CORNERSTONE_TOOL_CLASSES_BY_TOOL_TYPE[toolClass.toolType] = toolClass;
    MeasurementReport.MEASUREMENT_BY_TOOLTYPE[toolClass.toolType] = toolClass.utilityToolType;
  }
}
MeasurementReport.MEASUREMENT_BY_TOOLTYPE = {};
MeasurementReport.CORNERSTONE_TOOL_CLASSES_BY_UTILITY_TYPE = {};
MeasurementReport.CORNERSTONE_TOOL_CLASSES_BY_TOOL_TYPE = {};



// EXTERNAL MODULE: ../../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js + 3 modules
var slicedToArray = __webpack_require__(39590);
// EXTERNAL MODULE: ../../../node_modules/@babel/runtime/helpers/esm/defineProperty.js
var defineProperty = __webpack_require__(36111);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/cornerstone4Tag.js
var CORNERSTONE_4_TAG = 'cornerstoneTools@^4.0.0';



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/Length.js






function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const TID300Length = dcmjs_es/* .utilities.TID300.Length */.BF.TID300.Length;
const LENGTH = 'Length';
class Length {
  // TODO: this function is required for all Cornerstone Tool Adapters, since it is called by MeasurementReport.
  static getMeasurementData(MeasurementGroup) {
    const _MeasurementReport$ge = MeasurementReport.getSetupMeasurementData(MeasurementGroup),
      defaultState = _MeasurementReport$ge.defaultState,
      NUMGroup = _MeasurementReport$ge.NUMGroup,
      SCOORDGroup = _MeasurementReport$ge.SCOORDGroup;
    const state = _objectSpread(_objectSpread({}, defaultState), {}, {
      length: NUMGroup.MeasuredValueSequence.NumericValue,
      toolType: Length.toolType,
      handles: {
        start: {},
        end: {},
        textBox: {
          hasMoved: false,
          movesIndependently: false,
          drawnIndependently: true,
          allowedOutsideImage: true,
          hasBoundingBox: true
        }
      }
    });
    var _SCOORDGroup$GraphicD = (0,slicedToArray/* ["default"] */.A)(SCOORDGroup.GraphicData, 4);
    state.handles.start.x = _SCOORDGroup$GraphicD[0];
    state.handles.start.y = _SCOORDGroup$GraphicD[1];
    state.handles.end.x = _SCOORDGroup$GraphicD[2];
    state.handles.end.y = _SCOORDGroup$GraphicD[3];
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    const handles = tool.handles,
      finding = tool.finding,
      findingSites = tool.findingSites;
    const point1 = handles.start;
    const point2 = handles.end;
    const distance = tool.length;
    const trackingIdentifierTextValue = 'cornerstoneTools@^4.0.0:Length';
    return {
      point1,
      point2,
      distance,
      trackingIdentifierTextValue,
      finding,
      findingSites: findingSites || []
    };
  }
}
Length.toolType = LENGTH;
Length.utilityToolType = LENGTH;
Length.TID300Representation = TID300Length;
Length.isValidCornerstoneTrackingIdentifier = TrackingIdentifier => {
  if (!TrackingIdentifier.includes(':')) {
    return false;
  }
  const _TrackingIdentifier$s = TrackingIdentifier.split(':'),
    _TrackingIdentifier$s2 = (0,slicedToArray/* ["default"] */.A)(_TrackingIdentifier$s, 2),
    cornerstone4Tag = _TrackingIdentifier$s2[0],
    toolType = _TrackingIdentifier$s2[1];
  if (cornerstone4Tag !== CORNERSTONE_4_TAG) {
    return false;
  }
  return toolType === LENGTH;
};
MeasurementReport.registerTool(Length);



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/FreehandRoi.js






function FreehandRoi_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function FreehandRoi_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? FreehandRoi_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : FreehandRoi_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const TID300Polyline = dcmjs_es/* .utilities.TID300.Polyline */.BF.TID300.Polyline;
class FreehandRoi {
  static getMeasurementData(MeasurementGroup) {
    const _MeasurementReport$ge = MeasurementReport.getSetupMeasurementData(MeasurementGroup),
      defaultState = _MeasurementReport$ge.defaultState,
      SCOORDGroup = _MeasurementReport$ge.SCOORDGroup,
      NUMGroup = _MeasurementReport$ge.NUMGroup;
    const state = FreehandRoi_objectSpread(FreehandRoi_objectSpread({}, defaultState), {}, {
      toolType: FreehandRoi.toolType,
      handles: {
        points: [],
        textBox: {
          active: false,
          hasMoved: false,
          movesIndependently: false,
          drawnIndependently: true,
          allowedOutsideImage: true,
          hasBoundingBox: true
        }
      },
      cachedStats: {
        area: NUMGroup ? NUMGroup.MeasuredValueSequence.NumericValue : 0
      },
      color: undefined,
      invalidated: true
    });
    const GraphicData = SCOORDGroup.GraphicData;
    for (let i = 0; i < GraphicData.length; i += 2) {
      state.handles.points.push({
        x: GraphicData[i],
        y: GraphicData[i + 1]
      });
    }
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    const handles = tool.handles,
      finding = tool.finding,
      findingSites = tool.findingSites,
      _tool$cachedStats = tool.cachedStats,
      cachedStats = _tool$cachedStats === void 0 ? {} : _tool$cachedStats;
    const points = handles.points;
    const _cachedStats$area = cachedStats.area,
      area = _cachedStats$area === void 0 ? 0 : _cachedStats$area,
      _cachedStats$perimete = cachedStats.perimeter,
      perimeter = _cachedStats$perimete === void 0 ? 0 : _cachedStats$perimete;
    const trackingIdentifierTextValue = 'cornerstoneTools@^4.0.0:FreehandRoi';
    return {
      points,
      area,
      perimeter,
      trackingIdentifierTextValue,
      finding,
      findingSites: findingSites || []
    };
  }
}
FreehandRoi.toolType = 'FreehandRoi';
FreehandRoi.utilityToolType = 'FreehandRoi';
FreehandRoi.TID300Representation = TID300Polyline;
FreehandRoi.isValidCornerstoneTrackingIdentifier = TrackingIdentifier => {
  if (!TrackingIdentifier.includes(':')) {
    return false;
  }
  const _TrackingIdentifier$s = TrackingIdentifier.split(':'),
    _TrackingIdentifier$s2 = (0,slicedToArray/* ["default"] */.A)(_TrackingIdentifier$s, 2),
    cornerstone4Tag = _TrackingIdentifier$s2[0],
    toolType = _TrackingIdentifier$s2[1];
  if (cornerstone4Tag !== CORNERSTONE_4_TAG) {
    return false;
  }
  return toolType === FreehandRoi.toolType;
};
MeasurementReport.registerTool(FreehandRoi);



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/Bidirectional.js









const TID300Bidirectional = dcmjs_es/* .utilities.TID300.Bidirectional */.BF.TID300.Bidirectional;
const BIDIRECTIONAL = 'Bidirectional';
const LONG_AXIS = 'Long Axis';
const SHORT_AXIS = 'Short Axis';
const Bidirectional_FINDING = '121071';
const Bidirectional_FINDING_SITE = 'G-C0E3';
class Bidirectional {
  // TODO: this function is required for all Cornerstone Tool Adapters, since it is called by MeasurementReport.
  static getMeasurementData(MeasurementGroup) {
    const ContentSequence = MeasurementGroup.ContentSequence;
    const findingGroup = toArray(ContentSequence).find(group => group.ConceptNameCodeSequence.CodeValue === Bidirectional_FINDING);
    const findingSiteGroups = toArray(ContentSequence).filter(group => group.ConceptNameCodeSequence.CodeValue === Bidirectional_FINDING_SITE);
    const longAxisNUMGroup = toArray(ContentSequence).find(group => group.ConceptNameCodeSequence.CodeMeaning === LONG_AXIS);
    const longAxisSCOORDGroup = toArray(longAxisNUMGroup.ContentSequence).find(group => group.ValueType === 'SCOORD');
    const shortAxisNUMGroup = toArray(ContentSequence).find(group => group.ConceptNameCodeSequence.CodeMeaning === SHORT_AXIS);
    const shortAxisSCOORDGroup = toArray(shortAxisNUMGroup.ContentSequence).find(group => group.ValueType === 'SCOORD');
    const ReferencedSOPSequence = longAxisSCOORDGroup.ContentSequence.ReferencedSOPSequence;
    const ReferencedSOPInstanceUID = ReferencedSOPSequence.ReferencedSOPInstanceUID,
      ReferencedFrameNumber = ReferencedSOPSequence.ReferencedFrameNumber;

    // Long axis

    const longestDiameter = String(longAxisNUMGroup.MeasuredValueSequence.NumericValue);
    const shortestDiameter = String(shortAxisNUMGroup.MeasuredValueSequence.NumericValue);
    const bottomRight = {
      x: Math.max(longAxisSCOORDGroup.GraphicData[0], longAxisSCOORDGroup.GraphicData[2], shortAxisSCOORDGroup.GraphicData[0], shortAxisSCOORDGroup.GraphicData[2]),
      y: Math.max(longAxisSCOORDGroup.GraphicData[1], longAxisSCOORDGroup.GraphicData[3], shortAxisSCOORDGroup.GraphicData[1], shortAxisSCOORDGroup.GraphicData[3])
    };
    const state = {
      sopInstanceUid: ReferencedSOPInstanceUID,
      frameIndex: ReferencedFrameNumber || 1,
      toolType: Bidirectional.toolType,
      active: false,
      handles: {
        start: {
          x: longAxisSCOORDGroup.GraphicData[0],
          y: longAxisSCOORDGroup.GraphicData[1],
          drawnIndependently: false,
          allowedOutsideImage: false,
          active: false,
          highlight: false,
          index: 0
        },
        end: {
          x: longAxisSCOORDGroup.GraphicData[2],
          y: longAxisSCOORDGroup.GraphicData[3],
          drawnIndependently: false,
          allowedOutsideImage: false,
          active: false,
          highlight: false,
          index: 1
        },
        perpendicularStart: {
          x: shortAxisSCOORDGroup.GraphicData[0],
          y: shortAxisSCOORDGroup.GraphicData[1],
          drawnIndependently: false,
          allowedOutsideImage: false,
          active: false,
          highlight: false,
          index: 2
        },
        perpendicularEnd: {
          x: shortAxisSCOORDGroup.GraphicData[2],
          y: shortAxisSCOORDGroup.GraphicData[3],
          drawnIndependently: false,
          allowedOutsideImage: false,
          active: false,
          highlight: false,
          index: 3
        },
        textBox: {
          highlight: false,
          hasMoved: true,
          active: false,
          movesIndependently: false,
          drawnIndependently: true,
          allowedOutsideImage: true,
          hasBoundingBox: true,
          x: bottomRight.x + 10,
          y: bottomRight.y + 10
        }
      },
      invalidated: false,
      isCreating: false,
      longestDiameter,
      shortestDiameter,
      toolName: 'Bidirectional',
      visible: true,
      finding: findingGroup ? findingGroup.ConceptCodeSequence : undefined,
      findingSites: findingSiteGroups.map(fsg => fsg.ConceptCodeSequence)
    };
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    const _tool$handles = tool.handles,
      start = _tool$handles.start,
      end = _tool$handles.end,
      perpendicularStart = _tool$handles.perpendicularStart,
      perpendicularEnd = _tool$handles.perpendicularEnd;
    const shortestDiameter = tool.shortestDiameter,
      longestDiameter = tool.longestDiameter,
      finding = tool.finding,
      findingSites = tool.findingSites;
    const trackingIdentifierTextValue = 'cornerstoneTools@^4.0.0:Bidirectional';
    return {
      longAxis: {
        point1: start,
        point2: end
      },
      shortAxis: {
        point1: perpendicularStart,
        point2: perpendicularEnd
      },
      longAxisLength: longestDiameter,
      shortAxisLength: shortestDiameter,
      trackingIdentifierTextValue,
      finding: finding,
      findingSites: findingSites || []
    };
  }
}
Bidirectional.toolType = BIDIRECTIONAL;
Bidirectional.utilityToolType = BIDIRECTIONAL;
Bidirectional.TID300Representation = TID300Bidirectional;
Bidirectional.isValidCornerstoneTrackingIdentifier = TrackingIdentifier => {
  if (!TrackingIdentifier.includes(':')) {
    return false;
  }
  const _TrackingIdentifier$s = TrackingIdentifier.split(':'),
    _TrackingIdentifier$s2 = (0,slicedToArray/* ["default"] */.A)(_TrackingIdentifier$s, 2),
    cornerstone4Tag = _TrackingIdentifier$s2[0],
    toolType = _TrackingIdentifier$s2[1];
  if (cornerstone4Tag !== CORNERSTONE_4_TAG) {
    return false;
  }
  return toolType === BIDIRECTIONAL;
};
MeasurementReport.registerTool(Bidirectional);



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/EllipticalRoi.js






function EllipticalRoi_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function EllipticalRoi_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? EllipticalRoi_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : EllipticalRoi_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const TID300Ellipse = dcmjs_es/* .utilities.TID300.Ellipse */.BF.TID300.Ellipse;
const ELLIPTICALROI = 'EllipticalRoi';
class EllipticalRoi {
  // TODO: this function is required for all Cornerstone Tool Adapters, since it is called by MeasurementReport.
  static getMeasurementData(MeasurementGroup) {
    const _MeasurementReport$ge = MeasurementReport.getSetupMeasurementData(MeasurementGroup),
      defaultState = _MeasurementReport$ge.defaultState,
      NUMGroup = _MeasurementReport$ge.NUMGroup,
      SCOORDGroup = _MeasurementReport$ge.SCOORDGroup;
    const GraphicData = SCOORDGroup.GraphicData;
    const majorAxis = [{
      x: GraphicData[0],
      y: GraphicData[1]
    }, {
      x: GraphicData[2],
      y: GraphicData[3]
    }];
    const minorAxis = [{
      x: GraphicData[4],
      y: GraphicData[5]
    }, {
      x: GraphicData[6],
      y: GraphicData[7]
    }];

    // Calculate two opposite corners of box defined by two axes.

    const minorAxisLength = Math.sqrt(Math.pow(minorAxis[0].x - minorAxis[1].x, 2) + Math.pow(minorAxis[0].y - minorAxis[1].y, 2));
    const minorAxisDirection = {
      x: (minorAxis[1].x - minorAxis[0].x) / minorAxisLength,
      y: (minorAxis[1].y - minorAxis[0].y) / minorAxisLength
    };
    const halfMinorAxisLength = minorAxisLength / 2;

    // First end point of major axis + half minor axis vector
    const corner1 = {
      x: majorAxis[0].x + minorAxisDirection.x * halfMinorAxisLength,
      y: majorAxis[0].y + minorAxisDirection.y * halfMinorAxisLength
    };

    // Second end point of major axis - half of minor axis vector
    const corner2 = {
      x: majorAxis[1].x - minorAxisDirection.x * halfMinorAxisLength,
      y: majorAxis[1].y - minorAxisDirection.y * halfMinorAxisLength
    };
    const state = EllipticalRoi_objectSpread(EllipticalRoi_objectSpread({}, defaultState), {}, {
      toolType: EllipticalRoi.toolType,
      active: false,
      cachedStats: {
        area: NUMGroup ? NUMGroup.MeasuredValueSequence.NumericValue : 0
      },
      handles: {
        end: {
          x: corner1.x,
          y: corner1.y,
          highlight: false,
          active: false
        },
        initialRotation: 0,
        start: {
          x: corner2.x,
          y: corner2.y,
          highlight: false,
          active: false
        },
        textBox: {
          hasMoved: false,
          movesIndependently: false,
          drawnIndependently: true,
          allowedOutsideImage: true,
          hasBoundingBox: true
        }
      },
      invalidated: true,
      visible: true
    });
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    const _tool$cachedStats = tool.cachedStats,
      cachedStats = _tool$cachedStats === void 0 ? {} : _tool$cachedStats,
      handles = tool.handles,
      finding = tool.finding,
      findingSites = tool.findingSites;
    const start = handles.start,
      end = handles.end;
    const area = cachedStats.area;
    const halfXLength = Math.abs(start.x - end.x) / 2;
    const halfYLength = Math.abs(start.y - end.y) / 2;
    const points = [];
    const center = {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2
    };
    if (halfXLength > halfYLength) {
      // X-axis major
      // Major axis
      points.push({
        x: center.x - halfXLength,
        y: center.y
      });
      points.push({
        x: center.x + halfXLength,
        y: center.y
      });
      // Minor axis
      points.push({
        x: center.x,
        y: center.y - halfYLength
      });
      points.push({
        x: center.x,
        y: center.y + halfYLength
      });
    } else {
      // Y-axis major
      // Major axis
      points.push({
        x: center.x,
        y: center.y - halfYLength
      });
      points.push({
        x: center.x,
        y: center.y + halfYLength
      });
      // Minor axis
      points.push({
        x: center.x - halfXLength,
        y: center.y
      });
      points.push({
        x: center.x + halfXLength,
        y: center.y
      });
    }
    const trackingIdentifierTextValue = 'cornerstoneTools@^4.0.0:EllipticalRoi';
    return {
      area,
      points,
      trackingIdentifierTextValue,
      finding,
      findingSites: findingSites || []
    };
  }
}
EllipticalRoi.toolType = ELLIPTICALROI;
EllipticalRoi.utilityToolType = ELLIPTICALROI;
EllipticalRoi.TID300Representation = TID300Ellipse;
EllipticalRoi.isValidCornerstoneTrackingIdentifier = TrackingIdentifier => {
  if (!TrackingIdentifier.includes(':')) {
    return false;
  }
  const _TrackingIdentifier$s = TrackingIdentifier.split(':'),
    _TrackingIdentifier$s2 = (0,slicedToArray/* ["default"] */.A)(_TrackingIdentifier$s, 2),
    cornerstone4Tag = _TrackingIdentifier$s2[0],
    toolType = _TrackingIdentifier$s2[1];
  if (cornerstone4Tag !== CORNERSTONE_4_TAG) {
    return false;
  }
  return toolType === ELLIPTICALROI;
};
MeasurementReport.registerTool(EllipticalRoi);



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/CircleRoi.js






function CircleRoi_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function CircleRoi_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? CircleRoi_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : CircleRoi_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const TID300Circle = dcmjs_es/* .utilities.TID300.Circle */.BF.TID300.Circle;
const CIRCLEROI = 'CircleRoi';
class CircleRoi {
  /** Gets the measurement data for cornerstone, given DICOM SR measurement data. */
  static getMeasurementData(MeasurementGroup) {
    const _MeasurementReport$ge = MeasurementReport.getSetupMeasurementData(MeasurementGroup),
      defaultState = _MeasurementReport$ge.defaultState,
      NUMGroup = _MeasurementReport$ge.NUMGroup,
      SCOORDGroup = _MeasurementReport$ge.SCOORDGroup;
    const GraphicData = SCOORDGroup.GraphicData;
    const center = {
      x: GraphicData[0],
      y: GraphicData[1]
    };
    const end = {
      x: GraphicData[2],
      y: GraphicData[3]
    };
    const state = CircleRoi_objectSpread(CircleRoi_objectSpread({}, defaultState), {}, {
      toolType: CircleRoi.toolType,
      active: false,
      cachedStats: {
        area: NUMGroup ? NUMGroup.MeasuredValueSequence.NumericValue : 0,
        // Dummy values to be updated by cornerstone
        radius: 0,
        perimeter: 0
      },
      handles: {
        end: CircleRoi_objectSpread(CircleRoi_objectSpread({}, end), {}, {
          highlight: false,
          active: false
        }),
        initialRotation: 0,
        start: CircleRoi_objectSpread(CircleRoi_objectSpread({}, center), {}, {
          highlight: false,
          active: false
        }),
        textBox: {
          hasMoved: false,
          movesIndependently: false,
          drawnIndependently: true,
          allowedOutsideImage: true,
          hasBoundingBox: true
        }
      },
      invalidated: true,
      visible: true
    });
    return state;
  }

  /**
   * Gets the TID 300 representation of a circle, given the cornerstone representation.
   *
   * @param {Object} tool
   * @returns
   */
  static getTID300RepresentationArguments(tool) {
    const _tool$cachedStats = tool.cachedStats,
      cachedStats = _tool$cachedStats === void 0 ? {} : _tool$cachedStats,
      handles = tool.handles,
      finding = tool.finding,
      findingSites = tool.findingSites;
    const center = handles.start,
      end = handles.end;
    const area = cachedStats.area,
      radius = cachedStats.radius;
    const perimeter = 2 * Math.PI * radius;
    const points = [];
    points.push(center);
    points.push(end);
    const trackingIdentifierTextValue = 'cornerstoneTools@^4.0.0:CircleRoi';
    return {
      area,
      perimeter,
      radius,
      points,
      trackingIdentifierTextValue,
      finding,
      findingSites: findingSites || []
    };
  }
}
CircleRoi.toolType = CIRCLEROI;
CircleRoi.utilityToolType = CIRCLEROI;
CircleRoi.TID300Representation = TID300Circle;
CircleRoi.isValidCornerstoneTrackingIdentifier = TrackingIdentifier => {
  if (!TrackingIdentifier.includes(':')) {
    return false;
  }
  const _TrackingIdentifier$s = TrackingIdentifier.split(':'),
    _TrackingIdentifier$s2 = (0,slicedToArray/* ["default"] */.A)(_TrackingIdentifier$s, 2),
    cornerstone4Tag = _TrackingIdentifier$s2[0],
    toolType = _TrackingIdentifier$s2[1];
  if (cornerstone4Tag !== CORNERSTONE_4_TAG) {
    return false;
  }
  return toolType === CIRCLEROI;
};
MeasurementReport.registerTool(CircleRoi);



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/ArrowAnnotate.js






function ArrowAnnotate_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function ArrowAnnotate_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ArrowAnnotate_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ArrowAnnotate_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const TID300Point = dcmjs_es/* .utilities.TID300.Point */.BF.TID300.Point;
const ARROW_ANNOTATE = 'ArrowAnnotate';
const CORNERSTONEFREETEXT = 'CORNERSTONEFREETEXT';
class ArrowAnnotate {
  static getMeasurementData(MeasurementGroup) {
    const _MeasurementReport$ge = MeasurementReport.getSetupMeasurementData(MeasurementGroup),
      defaultState = _MeasurementReport$ge.defaultState,
      SCOORDGroup = _MeasurementReport$ge.SCOORDGroup;
      _MeasurementReport$ge.findingGroup;
    const GraphicData = SCOORDGroup.GraphicData;
    const state = ArrowAnnotate_objectSpread(ArrowAnnotate_objectSpread({}, defaultState), {}, {
      toolType: ArrowAnnotate.toolType,
      active: false,
      handles: {
        start: {
          x: GraphicData[0],
          y: GraphicData[1],
          highlight: true,
          active: false
        },
        // Use a generic offset if the stored data doesn't have the endpoint, otherwise
        // use the actual endpoint.
        end: {
          x: GraphicData.length == 4 ? GraphicData[2] : GraphicData[0] + 20,
          y: GraphicData.length == 4 ? GraphicData[3] : GraphicData[1] + 20,
          highlight: true,
          active: false
        },
        textBox: {
          hasMoved: false,
          movesIndependently: false,
          drawnIndependently: true,
          allowedOutsideImage: true,
          hasBoundingBox: true
        }
      },
      invalidated: true,
      visible: true
    });
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    const points = [tool.handles.start, tool.handles.end];
    const findingSites = tool.findingSites;
    let finding = tool.finding;
    const TID300RepresentationArguments = {
      points,
      trackingIdentifierTextValue: "cornerstoneTools@^4.0.0:ArrowAnnotate",
      findingSites: findingSites || []
    };

    // If freetext finding isn't present, add it from the tool label.
    if (!finding || finding.CodeValue !== CORNERSTONEFREETEXT) {
      finding = {
        CodeValue: CORNERSTONEFREETEXT,
        CodingSchemeDesignator: 'CST4',
        CodeMeaning: tool.label
      };
    }
    TID300RepresentationArguments.finding = finding;
    return TID300RepresentationArguments;
  }
}
ArrowAnnotate.toolType = ARROW_ANNOTATE;
ArrowAnnotate.utilityToolType = ARROW_ANNOTATE;
ArrowAnnotate.TID300Representation = TID300Point;
ArrowAnnotate.isValidCornerstoneTrackingIdentifier = TrackingIdentifier => {
  if (!TrackingIdentifier.includes(':')) {
    return false;
  }
  const _TrackingIdentifier$s = TrackingIdentifier.split(':'),
    _TrackingIdentifier$s2 = (0,slicedToArray/* ["default"] */.A)(_TrackingIdentifier$s, 2),
    cornerstone4Tag = _TrackingIdentifier$s2[0],
    toolType = _TrackingIdentifier$s2[1];
  if (cornerstone4Tag !== CORNERSTONE_4_TAG) {
    return false;
  }
  return toolType === ARROW_ANNOTATE;
};
MeasurementReport.registerTool(ArrowAnnotate);



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/CobbAngle.js






function CobbAngle_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function CobbAngle_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? CobbAngle_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : CobbAngle_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const TID300CobbAngle = dcmjs_es/* .utilities.TID300.CobbAngle */.BF.TID300.CobbAngle;
const COBB_ANGLE = 'CobbAngle';
class CobbAngle {
  // TODO: this function is required for all Cornerstone Tool Adapters, since it is called by MeasurementReport.
  static getMeasurementData(MeasurementGroup) {
    const _MeasurementReport$ge = MeasurementReport.getSetupMeasurementData(MeasurementGroup),
      defaultState = _MeasurementReport$ge.defaultState,
      NUMGroup = _MeasurementReport$ge.NUMGroup,
      SCOORDGroup = _MeasurementReport$ge.SCOORDGroup;
    const state = CobbAngle_objectSpread(CobbAngle_objectSpread({}, defaultState), {}, {
      rAngle: NUMGroup.MeasuredValueSequence.NumericValue,
      toolType: CobbAngle.toolType,
      handles: {
        start: {},
        end: {},
        start2: {
          highlight: true,
          drawnIndependently: true
        },
        end2: {
          highlight: true,
          drawnIndependently: true
        },
        textBox: {
          hasMoved: false,
          movesIndependently: false,
          drawnIndependently: true,
          allowedOutsideImage: true,
          hasBoundingBox: true
        }
      }
    });
    var _SCOORDGroup$GraphicD = (0,slicedToArray/* ["default"] */.A)(SCOORDGroup.GraphicData, 8);
    state.handles.start.x = _SCOORDGroup$GraphicD[0];
    state.handles.start.y = _SCOORDGroup$GraphicD[1];
    state.handles.end.x = _SCOORDGroup$GraphicD[2];
    state.handles.end.y = _SCOORDGroup$GraphicD[3];
    state.handles.start2.x = _SCOORDGroup$GraphicD[4];
    state.handles.start2.y = _SCOORDGroup$GraphicD[5];
    state.handles.end2.x = _SCOORDGroup$GraphicD[6];
    state.handles.end2.y = _SCOORDGroup$GraphicD[7];
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    const handles = tool.handles,
      finding = tool.finding,
      findingSites = tool.findingSites;
    const point1 = handles.start;
    const point2 = handles.end;
    const point3 = handles.start2;
    const point4 = handles.end2;
    const rAngle = tool.rAngle;
    const trackingIdentifierTextValue = 'cornerstoneTools@^4.0.0:CobbAngle';
    return {
      point1,
      point2,
      point3,
      point4,
      rAngle,
      trackingIdentifierTextValue,
      finding,
      findingSites: findingSites || []
    };
  }
}
CobbAngle.toolType = COBB_ANGLE;
CobbAngle.utilityToolType = COBB_ANGLE;
CobbAngle.TID300Representation = TID300CobbAngle;
CobbAngle.isValidCornerstoneTrackingIdentifier = TrackingIdentifier => {
  if (!TrackingIdentifier.includes(':')) {
    return false;
  }
  const _TrackingIdentifier$s = TrackingIdentifier.split(':'),
    _TrackingIdentifier$s2 = (0,slicedToArray/* ["default"] */.A)(_TrackingIdentifier$s, 2),
    cornerstone4Tag = _TrackingIdentifier$s2[0],
    toolType = _TrackingIdentifier$s2[1];
  if (cornerstone4Tag !== CORNERSTONE_4_TAG) {
    return false;
  }
  return toolType === COBB_ANGLE;
};
MeasurementReport.registerTool(CobbAngle);



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/Angle.js






function Angle_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function Angle_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? Angle_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : Angle_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const TID300Angle = dcmjs_es/* .utilities.TID300.Angle */.BF.TID300.Angle;
const ANGLE = 'Angle';
class Angle {
  /**
   * Generate TID300 measurement data for a plane angle measurement - use a Angle, but label it as Angle
   */
  static getMeasurementData(MeasurementGroup) {
    const _MeasurementReport$ge = MeasurementReport.getSetupMeasurementData(MeasurementGroup),
      defaultState = _MeasurementReport$ge.defaultState,
      NUMGroup = _MeasurementReport$ge.NUMGroup,
      SCOORDGroup = _MeasurementReport$ge.SCOORDGroup;
    const state = Angle_objectSpread(Angle_objectSpread({}, defaultState), {}, {
      rAngle: NUMGroup.MeasuredValueSequence.NumericValue,
      toolType: Angle.toolType,
      handles: {
        start: {},
        middle: {},
        end: {},
        textBox: {
          hasMoved: false,
          movesIndependently: false,
          drawnIndependently: true,
          allowedOutsideImage: true,
          hasBoundingBox: true
        }
      }
    });
    var _SCOORDGroup$GraphicD = (0,slicedToArray/* ["default"] */.A)(SCOORDGroup.GraphicData, 8);
    state.handles.start.x = _SCOORDGroup$GraphicD[0];
    state.handles.start.y = _SCOORDGroup$GraphicD[1];
    state.handles.middle.x = _SCOORDGroup$GraphicD[2];
    state.handles.middle.y = _SCOORDGroup$GraphicD[3];
    state.handles.middle.x = _SCOORDGroup$GraphicD[4];
    state.handles.middle.y = _SCOORDGroup$GraphicD[5];
    state.handles.end.x = _SCOORDGroup$GraphicD[6];
    state.handles.end.y = _SCOORDGroup$GraphicD[7];
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    const handles = tool.handles,
      finding = tool.finding,
      findingSites = tool.findingSites;
    const point1 = handles.start;
    const point2 = handles.middle;
    const point3 = handles.middle;
    const point4 = handles.end;
    const rAngle = tool.rAngle;
    const trackingIdentifierTextValue = 'cornerstoneTools@^4.0.0:Angle';
    return {
      point1,
      point2,
      point3,
      point4,
      rAngle,
      trackingIdentifierTextValue,
      finding,
      findingSites: findingSites || []
    };
  }
}
Angle.toolType = ANGLE;
Angle.utilityToolType = ANGLE;
Angle.TID300Representation = TID300Angle;
Angle.isValidCornerstoneTrackingIdentifier = TrackingIdentifier => {
  if (!TrackingIdentifier.includes(':')) {
    return false;
  }
  const _TrackingIdentifier$s = TrackingIdentifier.split(':'),
    _TrackingIdentifier$s2 = (0,slicedToArray/* ["default"] */.A)(_TrackingIdentifier$s, 2),
    cornerstone4Tag = _TrackingIdentifier$s2[0],
    toolType = _TrackingIdentifier$s2[1];
  if (cornerstone4Tag !== CORNERSTONE_4_TAG) {
    return false;
  }
  return toolType === ANGLE;
};
MeasurementReport.registerTool(Angle);



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/RectangleRoi.js






function RectangleRoi_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function RectangleRoi_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? RectangleRoi_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : RectangleRoi_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const RectangleRoi_TID300Polyline = dcmjs_es/* .utilities.TID300.Polyline */.BF.TID300.Polyline;
class RectangleRoi {
  static getMeasurementData(MeasurementGroup) {
    const _MeasurementReport$ge = MeasurementReport.getSetupMeasurementData(MeasurementGroup),
      defaultState = _MeasurementReport$ge.defaultState,
      SCOORDGroup = _MeasurementReport$ge.SCOORDGroup,
      NUMGroup = _MeasurementReport$ge.NUMGroup;
    const state = RectangleRoi_objectSpread(RectangleRoi_objectSpread({}, defaultState), {}, {
      toolType: RectangleRoi.toolType,
      handles: {
        start: {},
        end: {},
        textBox: {
          active: false,
          hasMoved: false,
          movesIndependently: false,
          drawnIndependently: true,
          allowedOutsideImage: true,
          hasBoundingBox: true
        },
        initialRotation: 0
      },
      cachedStats: {
        area: NUMGroup ? NUMGroup.MeasuredValueSequence.NumericValue : 0
      },
      color: undefined,
      invalidated: true
    });
    var _SCOORDGroup$GraphicD = (0,slicedToArray/* ["default"] */.A)(SCOORDGroup.GraphicData, 6);
    state.handles.start.x = _SCOORDGroup$GraphicD[0];
    state.handles.start.y = _SCOORDGroup$GraphicD[1];
    _SCOORDGroup$GraphicD[2];
    _SCOORDGroup$GraphicD[3];
    state.handles.end.x = _SCOORDGroup$GraphicD[4];
    state.handles.end.y = _SCOORDGroup$GraphicD[5];
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    const finding = tool.finding,
      findingSites = tool.findingSites,
      _tool$cachedStats = tool.cachedStats,
      cachedStats = _tool$cachedStats === void 0 ? {} : _tool$cachedStats,
      handles = tool.handles;
    const start = handles.start,
      end = handles.end;
    const points = [start, {
      x: start.x,
      y: end.y
    }, end, {
      x: end.x,
      y: start.y
    }];
    const area = cachedStats.area,
      perimeter = cachedStats.perimeter;
    const trackingIdentifierTextValue = 'cornerstoneTools@^4.0.0:RectangleRoi';
    return {
      points,
      area,
      perimeter,
      trackingIdentifierTextValue,
      finding,
      findingSites: findingSites || []
    };
  }
}
RectangleRoi.toolType = 'RectangleRoi';
RectangleRoi.utilityToolType = 'RectangleRoi';
RectangleRoi.TID300Representation = RectangleRoi_TID300Polyline;
RectangleRoi.isValidCornerstoneTrackingIdentifier = TrackingIdentifier => {
  if (!TrackingIdentifier.includes(':')) {
    return false;
  }
  const _TrackingIdentifier$s = TrackingIdentifier.split(':'),
    _TrackingIdentifier$s2 = (0,slicedToArray/* ["default"] */.A)(_TrackingIdentifier$s, 2),
    cornerstone4Tag = _TrackingIdentifier$s2[0],
    toolType = _TrackingIdentifier$s2[1];
  if (cornerstone4Tag !== CORNERSTONE_4_TAG) {
    return false;
  }
  return toolType === RectangleRoi.toolType;
};
MeasurementReport.registerTool(RectangleRoi);



// EXTERNAL MODULE: ../../../node_modules/ndarray/ndarray.js
var ndarray = __webpack_require__(3293);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/getDatasetsFromImages.js


const DicomMessage = dcmjs_es/* .data.DicomMessage */.p.DicomMessage,
  getDatasetsFromImages_DicomMetaDictionary = dcmjs_es/* .data.DicomMetaDictionary */.p.DicomMetaDictionary;
const getDatasetsFromImages_Normalizer = dcmjs_es/* .normalizers.Normalizer */.z8.Normalizer;
function getDatasetsFromImages(images, isMultiframe, options) {
  const datasets = [];
  if (isMultiframe) {
    const image = images[0];
    const arrayBuffer = image.data.byteArray.buffer;
    const dicomData = DicomMessage.readFile(arrayBuffer);
    const dataset = getDatasetsFromImages_DicomMetaDictionary.naturalizeDataset(dicomData.dict);
    dataset._meta = getDatasetsFromImages_DicomMetaDictionary.namifyDataset(dicomData.meta);
    datasets.push(dataset);
  } else {
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const arrayBuffer = image.data.byteArray.buffer;
      const dicomData = DicomMessage.readFile(arrayBuffer);
      const dataset = getDatasetsFromImages_DicomMetaDictionary.naturalizeDataset(dicomData.dict);
      dataset._meta = getDatasetsFromImages_DicomMetaDictionary.namifyDataset(dicomData.meta);
      datasets.push(dataset);
    }
  }
  if (options !== null && options !== void 0 && options.SpecificCharacterSet) {
    datasets.forEach(dataset => dataset.SpecificCharacterSet = options.SpecificCharacterSet);
  }
  return getDatasetsFromImages_Normalizer.normalizeToDataset(datasets);
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/Segmentation_3X.js




const _utilities$orientatio = dcmjs_es/* .utilities.orientation */.BF.orientation,
  rotateDirectionCosinesInPlane = _utilities$orientatio.rotateDirectionCosinesInPlane,
  flipIOP = _utilities$orientatio.flipImageOrientationPatient,
  flipMatrix2D = _utilities$orientatio.flipMatrix2D,
  rotateMatrix902D = _utilities$orientatio.rotateMatrix902D;
const Segmentation_3X_datasetToBlob = dcmjs_es/* .utilities.datasetToBlob */.BF.datasetToBlob,
  BitArray = dcmjs_es/* .utilities.BitArray */.BF.BitArray,
  Segmentation_3X_DicomMessage = dcmjs_es/* .utilities.DicomMessage */.BF.DicomMessage,
  Segmentation_3X_DicomMetaDictionary = dcmjs_es/* .utilities.DicomMetaDictionary */.BF.DicomMetaDictionary;
const Segmentation_3X_Normalizer = dcmjs_es/* .normalizers.Normalizer */.z8.Normalizer;
const SegmentationDerivation = dcmjs_es/* .derivations.Segmentation */.h4.Segmentation;
const Segmentation = {
  generateSegmentation,
  generateToolState
};

/**
 *
 * @typedef {Object} BrushData
 * @property {Object} toolState - The cornerstoneTools global toolState.
 * @property {Object[]} segments - The cornerstoneTools segment metadata that corresponds to the
 *                                 seriesInstanceUid.
 */

/**
 * generateSegmentation - Generates cornerstoneTools brush data, given a stack of
 * imageIds, images and the cornerstoneTools brushData.
 *
 * @param  {object[]} images    An array of the cornerstone image objects.
 * @param  {BrushData} brushData and object containing the brushData.
 * @returns {type}           description
 */
function generateSegmentation(images, brushData) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    includeSliceSpacing: true
  };
  const toolState = brushData.toolState,
    segments = brushData.segments;

  // Calculate the dimensions of the data cube.
  const image0 = images[0];
  const dims = {
    x: image0.columns,
    y: image0.rows,
    z: images.length
  };
  dims.xy = dims.x * dims.y;
  const numSegments = _getSegCount(seg, segments);
  if (!numSegments) {
    throw new Error('No segments to export!');
  }
  const isMultiframe = image0.imageId.includes('?frame');
  const seg = _createSegFromImages(images, isMultiframe, options);
  const _getNumberOfFramesPer = _getNumberOfFramesPerSegment(toolState, images, segments),
    referencedFramesPerSegment = _getNumberOfFramesPer.referencedFramesPerSegment,
    segmentIndicies = _getNumberOfFramesPer.segmentIndicies;
  let NumberOfFrames = 0;
  for (let i = 0; i < referencedFramesPerSegment.length; i++) {
    NumberOfFrames += referencedFramesPerSegment[i].length;
  }
  seg.setNumberOfFrames(NumberOfFrames);
  for (let i = 0; i < segmentIndicies.length; i++) {
    const segmentIndex = segmentIndicies[i];
    const referencedFrameIndicies = referencedFramesPerSegment[i];

    // Frame numbers start from 1.
    const referencedFrameNumbers = referencedFrameIndicies.map(element => {
      return element + 1;
    });
    const segment = segments[segmentIndex];
    seg.addSegment(segment, _extractCornerstoneToolsPixelData(segmentIndex, referencedFrameIndicies, toolState, images, dims), referencedFrameNumbers);
  }
  seg.bitPackPixelData();
  const segBlob = Segmentation_3X_datasetToBlob(seg.dataset);
  return segBlob;
}
function _extractCornerstoneToolsPixelData(segmentIndex, referencedFrames, toolState, images, dims) {
  const pixelData = new Uint8Array(dims.xy * referencedFrames.length);
  let pixelDataIndex = 0;
  for (let i = 0; i < referencedFrames.length; i++) {
    const frame = referencedFrames[i];
    const imageId = images[frame].imageId;
    const imageIdSpecificToolState = toolState[imageId];
    const brushPixelData = imageIdSpecificToolState.brush.data[segmentIndex].pixelData;
    for (let p = 0; p < brushPixelData.length; p++) {
      pixelData[pixelDataIndex] = brushPixelData[p];
      pixelDataIndex++;
    }
  }
  return pixelData;
}
function _getNumberOfFramesPerSegment(toolState, images, segments) {
  const segmentIndicies = [];
  const referencedFramesPerSegment = [];
  for (let i = 0; i < segments.length; i++) {
    if (segments[i]) {
      segmentIndicies.push(i);
      referencedFramesPerSegment.push([]);
    }
  }
  for (let z = 0; z < images.length; z++) {
    const imageId = images[z].imageId;
    const imageIdSpecificToolState = toolState[imageId];
    for (let i = 0; i < segmentIndicies.length; i++) {
      const segIdx = segmentIndicies[i];
      if (imageIdSpecificToolState && imageIdSpecificToolState.brush && imageIdSpecificToolState.brush.data && imageIdSpecificToolState.brush.data[segIdx] && imageIdSpecificToolState.brush.data[segIdx].pixelData) {
        referencedFramesPerSegment[i].push(z);
      }
    }
  }
  return {
    referencedFramesPerSegment,
    segmentIndicies
  };
}
function _getSegCount(seg, segments) {
  let numSegments = 0;
  for (let i = 0; i < segments.length; i++) {
    if (segments[i]) {
      numSegments++;
    }
  }
  return numSegments;
}

/**
 * _createSegFromImages - description
 *
 * @param  {Object[]} images    An array of the cornerstone image objects.
 * @param  {Boolean} isMultiframe Whether the images are multiframe.
 * @returns {Object}              The Seg derived dataSet.
 */
function _createSegFromImages(images, isMultiframe, options) {
  const multiframe = getDatasetsFromImages(images, isMultiframe);
  return new SegmentationDerivation([multiframe], options);
}

/**
 * generateToolState - Given a set of cornrstoneTools imageIds and a Segmentation buffer,
 * derive cornerstoneTools toolState and brush metadata.
 *
 * @param  {string[]} imageIds    An array of the imageIds.
 * @param  {ArrayBuffer} arrayBuffer The SEG arrayBuffer.
 * @param {*} metadataProvider
 * @returns {Object}  The toolState and an object from which the
 *                    segment metadata can be derived.
 */
function generateToolState(imageIds, arrayBuffer, metadataProvider) {
  const dicomData = Segmentation_3X_DicomMessage.readFile(arrayBuffer);
  const dataset = Segmentation_3X_DicomMetaDictionary.naturalizeDataset(dicomData.dict);
  dataset._meta = Segmentation_3X_DicomMetaDictionary.namifyDataset(dicomData.meta);
  const multiframe = Segmentation_3X_Normalizer.normalizeToDataset([dataset]);
  const imagePlaneModule = metadataProvider.get('imagePlaneModule', imageIds[0]);
  if (!imagePlaneModule) {
    console.warn('Insufficient metadata, imagePlaneModule missing.');
  }
  const ImageOrientationPatient = Array.isArray(imagePlaneModule.rowCosines) ? [...imagePlaneModule.rowCosines, ...imagePlaneModule.columnCosines] : [imagePlaneModule.rowCosines.x, imagePlaneModule.rowCosines.y, imagePlaneModule.rowCosines.z, imagePlaneModule.columnCosines.x, imagePlaneModule.columnCosines.y, imagePlaneModule.columnCosines.z];

  // Get IOP from ref series, compute supported orientations:
  const validOrientations = getValidOrientations(ImageOrientationPatient);
  const SharedFunctionalGroupsSequence = multiframe.SharedFunctionalGroupsSequence;
  const sharedImageOrientationPatient = SharedFunctionalGroupsSequence.PlaneOrientationSequence ? SharedFunctionalGroupsSequence.PlaneOrientationSequence.ImageOrientationPatient : undefined;
  const sliceLength = multiframe.Columns * multiframe.Rows;
  const segMetadata = getSegmentMetadata(multiframe);
  const pixelData = unpackPixelData(multiframe);
  const PerFrameFunctionalGroupsSequence = multiframe.PerFrameFunctionalGroupsSequence;
  const toolState = {};
  let inPlane = true;
  for (let i = 0; i < PerFrameFunctionalGroupsSequence.length; i++) {
    const PerFrameFunctionalGroups = PerFrameFunctionalGroupsSequence[i];
    const ImageOrientationPatientI = sharedImageOrientationPatient || PerFrameFunctionalGroups.PlaneOrientationSequence.ImageOrientationPatient;
    const pixelDataI2D = ndarray(new Uint8Array(pixelData.buffer, i * sliceLength, sliceLength), [multiframe.Rows, multiframe.Columns]);
    const alignedPixelDataI = alignPixelDataWithSourceData(pixelDataI2D, ImageOrientationPatientI, validOrientations);
    if (!alignedPixelDataI) {
      console.warn("This segmentation object is not in-plane with the source data. Bailing out of IO. It'd be better to render this with vtkjs. ");
      inPlane = false;
      break;
    }
    const segmentIndex = PerFrameFunctionalGroups.SegmentIdentificationSequence.ReferencedSegmentNumber - 1;
    let SourceImageSequence;
    if (SharedFunctionalGroupsSequence.DerivationImageSequence && SharedFunctionalGroupsSequence.DerivationImageSequence.SourceImageSequence) {
      SourceImageSequence = SharedFunctionalGroupsSequence.DerivationImageSequence.SourceImageSequence[i];
    } else {
      SourceImageSequence = PerFrameFunctionalGroups.DerivationImageSequence.SourceImageSequence;
    }
    const imageId = getImageIdOfSourceImage(SourceImageSequence, imageIds, metadataProvider);
    addImageIdSpecificBrushToolState(toolState, imageId, segmentIndex, alignedPixelDataI);
  }
  if (!inPlane) {
    return;
  }
  return {
    toolState,
    segMetadata
  };
}

/**
 * unpackPixelData - Unpacks bitpacked pixelData if the Segmentation is BINARY.
 *
 * @param  {Object} multiframe The multiframe dataset.
 * @return {Uint8Array}      The unpacked pixelData.
 */
function unpackPixelData(multiframe) {
  const segType = multiframe.SegmentationType;
  if (segType === 'BINARY') {
    return BitArray.unpack(multiframe.PixelData);
  }
  const pixelData = new Uint8Array(multiframe.PixelData);
  const max = multiframe.MaximumFractionalValue;
  const onlyMaxAndZero = pixelData.find(element => element !== 0 && element !== max) === undefined;
  if (!onlyMaxAndZero) {
    dcmjs_es/* .log.warn */.Rm.warn('This is a fractional segmentation, which is not currently supported.');
    return;
  }
  dcmjs_es/* .log.warn */.Rm.warn('This segmentation object is actually binary... processing as such.');
  return pixelData;
}

/**
 * addImageIdSpecificBrushToolState - Adds brush pixel data to cornerstoneTools
 * formatted toolState object.
 *
 * @param  {Object} toolState    The toolState object to modify
 * @param  {String} imageId      The imageId of the toolState to add the data.
 * @param  {Number} segmentIndex The index of the segment data being added.
 * @param  {Ndarray} pixelData2D  The pixelData in Ndarry 2D format.
 */
function addImageIdSpecificBrushToolState(toolState, imageId, segmentIndex, pixelData2D) {
  if (!toolState[imageId]) {
    toolState[imageId] = {};
    toolState[imageId].brush = {};
    toolState[imageId].brush.data = [];
  } else if (!toolState[imageId].brush) {
    toolState[imageId].brush = {};
    toolState[imageId].brush.data = [];
  } else if (!toolState[imageId].brush.data) {
    toolState[imageId].brush.data = [];
  }
  toolState[imageId].brush.data[segmentIndex] = {};
  const brushDataI = toolState[imageId].brush.data[segmentIndex];
  brushDataI.pixelData = new Uint8Array(pixelData2D.data.length);
  const cToolsPixelData = brushDataI.pixelData;
  for (let p = 0; p < cToolsPixelData.length; p++) {
    if (pixelData2D.data[p]) {
      cToolsPixelData[p] = 1;
    } else {
      cToolsPixelData[p] = 0;
    }
  }
}

/**
 * getImageIdOfSourceImage - Returns the Cornerstone imageId of the source image.
 *
 * @param  {Object} SourceImageSequence Sequence describing the source image.
 * @param  {String[]} imageIds          A list of imageIds.
 * @param  {Object} metadataProvider    A Cornerstone metadataProvider to query
 *                                      metadata from imageIds.
 * @return {String}                     The corresponding imageId.
 */
function getImageIdOfSourceImage(SourceImageSequence, imageIds, metadataProvider) {
  const ReferencedSOPInstanceUID = SourceImageSequence.ReferencedSOPInstanceUID,
    ReferencedFrameNumber = SourceImageSequence.ReferencedFrameNumber;
  return ReferencedFrameNumber ? getImageIdOfReferencedFrame(ReferencedSOPInstanceUID, ReferencedFrameNumber, imageIds, metadataProvider) : getImageIdOfReferencedSingleFramedSOPInstance(ReferencedSOPInstanceUID, imageIds, metadataProvider);
}

/**
 * getImageIdOfReferencedSingleFramedSOPInstance - Returns the imageId
 * corresponding to the specified sopInstanceUid for single-frame images.
 *
 * @param  {String} sopInstanceUid   The sopInstanceUid of the desired image.
 * @param  {String[]} imageIds         The list of imageIds.
 * @param  {Object} metadataProvider The metadataProvider to obtain sopInstanceUids
 *                                 from the cornerstone imageIds.
 * @return {String}                  The imageId that corresponds to the sopInstanceUid.
 */
function getImageIdOfReferencedSingleFramedSOPInstance(sopInstanceUid, imageIds, metadataProvider) {
  return imageIds.find(imageId => {
    const sopCommonModule = metadataProvider.get('sopCommonModule', imageId);
    if (!sopCommonModule) {
      return;
    }
    return sopCommonModule.sopInstanceUID === sopInstanceUid;
  });
}

/**
 * getImageIdOfReferencedFrame - Returns the imageId corresponding to the
 * specified sopInstanceUid and frameNumber for multi-frame images.
 *
 * @param  {String} sopInstanceUid   The sopInstanceUid of the desired image.
 * @param  {Number} frameNumber      The frame number.
 * @param  {String} imageIds         The list of imageIds.
 * @param  {Object} metadataProvider The metadataProvider to obtain sopInstanceUids
 *                                   from the cornerstone imageIds.
 * @return {String}                  The imageId that corresponds to the sopInstanceUid.
 */
function getImageIdOfReferencedFrame(sopInstanceUid, frameNumber, imageIds, metadataProvider) {
  const imageId = imageIds.find(imageId => {
    const sopCommonModule = metadataProvider.get('sopCommonModule', imageId);
    if (!sopCommonModule) {
      return;
    }
    const imageIdFrameNumber = Number(imageId.split('frame=')[1]);
    return (
      //frameNumber is zero indexed for cornerstoneDICOMImageLoader image Ids.
      sopCommonModule.sopInstanceUID === sopInstanceUid && imageIdFrameNumber === frameNumber - 1
    );
  });
  return imageId;
}

/**
 * getValidOrientations - returns an array of valid orientations.
 *
 * @param  iop - The row (0..2) an column (3..5) direction cosines.
 * @return  An array of valid orientations.
 */
function getValidOrientations(iop) {
  const orientations = [];

  // [0,  1,  2]: 0,   0hf,   0vf
  // [3,  4,  5]: 90,  90hf,  90vf
  // [6, 7]:      180, 270

  orientations[0] = iop;
  orientations[1] = flipIOP.h(iop);
  orientations[2] = flipIOP.v(iop);
  const iop90 = rotateDirectionCosinesInPlane(iop, Math.PI / 2);
  orientations[3] = iop90;
  orientations[4] = flipIOP.h(iop90);
  orientations[5] = flipIOP.v(iop90);
  orientations[6] = rotateDirectionCosinesInPlane(iop, Math.PI);
  orientations[7] = rotateDirectionCosinesInPlane(iop, 1.5 * Math.PI);
  return orientations;
}

/**
 * alignPixelDataWithSourceData -
 *
 * @param pixelData2D - The data to align.
 * @param iop - The orientation of the image slice.
 * @param orientations - An array of valid imageOrientationPatient values.
 * @return The aligned pixelData.
 */
function alignPixelDataWithSourceData(pixelData2D, iop, orientations) {
  if (compareIOP(iop, orientations[0])) {
    //Same orientation.
    return pixelData2D;
  } else if (compareIOP(iop, orientations[1])) {
    //Flipped vertically.
    return flipMatrix2D.v(pixelData2D);
  } else if (compareIOP(iop, orientations[2])) {
    //Flipped horizontally.
    return flipMatrix2D.h(pixelData2D);
  } else if (compareIOP(iop, orientations[3])) {
    //Rotated 90 degrees.
    return rotateMatrix902D(pixelData2D);
  } else if (compareIOP(iop, orientations[4])) {
    //Rotated 90 degrees and fliped horizontally.
    return flipMatrix2D.h(rotateMatrix902D(pixelData2D));
  } else if (compareIOP(iop, orientations[5])) {
    //Rotated 90 degrees and fliped vertically.
    return flipMatrix2D.v(rotateMatrix902D(pixelData2D));
  } else if (compareIOP(iop, orientations[6])) {
    //Rotated 180 degrees. // TODO -> Do this more effeciently, there is a 1:1 mapping like 90 degree rotation.
    return rotateMatrix902D(rotateMatrix902D(pixelData2D));
  } else if (compareIOP(iop, orientations[7])) {
    //Rotated 270 degrees.  // TODO -> Do this more effeciently, there is a 1:1 mapping like 90 degree rotation.
    return rotateMatrix902D(rotateMatrix902D(rotateMatrix902D(pixelData2D)));
  }
}
const dx = 1e-5;

/**
 * compareIOP - Returns true if iop1 and iop2 are equal
 * within a tollerance, dx.
 *
 * @param  iop1 - An ImageOrientationPatient array.
 * @param  iop2 - An ImageOrientationPatient array.
 * @return True if iop1 and iop2 are equal.
 */
function compareIOP(iop1, iop2) {
  return Math.abs(iop1[0] - iop2[0]) < dx && Math.abs(iop1[1] - iop2[1]) < dx && Math.abs(iop1[2] - iop2[2]) < dx && Math.abs(iop1[3] - iop2[3]) < dx && Math.abs(iop1[4] - iop2[4]) < dx && Math.abs(iop1[5] - iop2[5]) < dx;
}
function getSegmentMetadata(multiframe) {
  const data = [];
  const segmentSequence = multiframe.SegmentSequence;
  if (Array.isArray(segmentSequence)) {
    for (let segIdx = 0; segIdx < segmentSequence.length; segIdx++) {
      data.push(segmentSequence[segIdx]);
    }
  } else {
    // Only one segment, will be stored as an object.
    data.push(segmentSequence);
  }
  return {
    seriesInstanceUid: multiframe.ReferencedSeriesSequence.SeriesInstanceUID,
    data
  };
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/checkIfPerpendicular.js
function checkIfPerpendicular(iop1, iop2, tolerance) {
  const absDotColumnCosines = Math.abs(iop1[0] * iop2[0] + iop1[1] * iop2[1] + iop1[2] * iop2[2]);
  const absDotRowCosines = Math.abs(iop1[3] * iop2[3] + iop1[4] * iop2[4] + iop1[5] * iop2[5]);
  return (absDotColumnCosines < tolerance || Math.abs(absDotColumnCosines - 1) < tolerance) && (absDotRowCosines < tolerance || Math.abs(absDotRowCosines - 1) < tolerance);
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/checkOrientation.js



function checkOrientation(multiframe, validOrientations, sourceDataDimensions, tolerance) {
  const SharedFunctionalGroupsSequence = multiframe.SharedFunctionalGroupsSequence,
    PerFrameFunctionalGroupsSequence = multiframe.PerFrameFunctionalGroupsSequence;
  const sharedImageOrientationPatient = SharedFunctionalGroupsSequence.PlaneOrientationSequence ? SharedFunctionalGroupsSequence.PlaneOrientationSequence.ImageOrientationPatient : undefined;
  const PerFrameFunctionalGroups = PerFrameFunctionalGroupsSequence[0];
  const iopRaw = sharedImageOrientationPatient || PerFrameFunctionalGroups.PlaneOrientationSequence.ImageOrientationPatient;
  const iop = Array.isArray(iopRaw) ? iopRaw.map(Number) : iopRaw;
  const inPlane = validOrientations.some(operation => esm.utilities.isEqual(iop, operation, tolerance));
  if (inPlane) {
    return 'Planar';
  }
  if (checkIfPerpendicular(iop, validOrientations[0], tolerance) && sourceDataDimensions.includes(multiframe.Rows) && sourceDataDimensions.includes(multiframe.Columns)) {
    return 'Perpendicular';
  }
  return 'Oblique';
}



// EXTERNAL MODULE: ../../../node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js + 1 modules
var objectWithoutProperties = __webpack_require__(89503);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/Segmentation/perFrameFunctionalGroups.js




const _excluded = ["SegmentIdentificationSequence"];
function perFrameFunctionalGroups_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function perFrameFunctionalGroups_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? perFrameFunctionalGroups_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : perFrameFunctionalGroups_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const MetadataModules = esm.Enums.MetadataModules;

/**
 * Resolves the 1-based DICOM frame number referenced by an imageId.
 *
 * Prefer the metadata provider's own frame extraction when it offers one — it
 * understands the full set of imageId shapes the host app produces (wadors
 * `/frames/N` as well as `?frame=N` / `&frame=N`). Fall back to the core
 * FrameRange helper (handles `/frames/N` and `frameNumber=N`) so that
 * provider-agnostic callers still resolve multi-frame references. A one-off
 * `/[?&]frame=/` regex silently drops the wadors form, so it must not be used.
 *
 * @param {string} imageId
 * @param {object} metadata - metadata provider
 * @returns {number|undefined}
 */
function getReferencedFrameNumber(imageId, metadata) {
  var _metadata$getFrameInf;
  if (!imageId) {
    return undefined;
  }
  const providerFrame = metadata === null || metadata === void 0 || (_metadata$getFrameInf = metadata.getFrameInformationFromURL) === null || _metadata$getFrameInf === void 0 ? void 0 : _metadata$getFrameInf.call(metadata, imageId);
  const frameNumber = providerFrame != null ? Number(providerFrame) : esm.utilities.FrameRange.imageIdToFrameStart(imageId);
  return Number.isFinite(frameNumber) ? frameNumber : undefined;
}

/**
 * Builds a SourceImageSequence item (ReferencedSOPInstanceUID + optional
 * ReferencedFrameNumber) for a cornerstone image, using the shared frame
 * extraction so all SEG export paths resolve multi-frame references identically.
 *
 * @param {{ imageId?: string }} image
 * @param {object} metadata - metadata provider
 * @returns {{ ReferencedSOPInstanceUID: string, ReferencedFrameNumber?: number }}
 */
function getReferencedSourceImageSequenceItem(image, metadata) {
  var _metadata$get;
  const imageData = (metadata === null || metadata === void 0 || (_metadata$get = metadata.get) === null || _metadata$get === void 0 ? void 0 : _metadata$get.call(metadata, MetadataModules.IMAGE_DATA, image === null || image === void 0 ? void 0 : image.imageId)) || {};
  const referencedFrameNumber = getReferencedFrameNumber(image === null || image === void 0 ? void 0 : image.imageId, metadata);
  const item = {
    ReferencedSOPInstanceUID: imageData.SOPInstanceUID
  };
  if (Number.isFinite(referencedFrameNumber) && referencedFrameNumber > 0) {
    item.ReferencedFrameNumber = referencedFrameNumber;
  }
  return item;
}
function normalizeSharedFunctionalGroupsSequence(dataset) {
  const shared = dataset.SharedFunctionalGroupsSequence;
  if (Array.isArray(shared) && shared.length > 0) {
    dataset.SharedFunctionalGroupsSequence = shared[0];
  } else if (!shared || typeof shared !== 'object') {
    dataset.SharedFunctionalGroupsSequence = {};
  }
}

/**
 * @param {object} dataset - SEG dataset
 * @param {Array<{
 *   referencedSegmentNumber?: number,
 *   sourceImageSequenceItem: { ReferencedSOPInstanceUID: string, ReferencedFrameNumber?: number },
 *   planeOrientationSequence?: object,
 *   planePositionSequence?: object,
 * }>} frames
 *
 * `referencedSegmentNumber` drives the per-frame `SegmentIdentificationSequence`
 * macro (one segment per frame — BINARY SEGs). Omit it for LABELMAP SEGs: there a
 * single frame carries many segment labels as pixel values, so the standard
 * forbids the macro and a fixed `ReferencedSegmentNumber` would be wrong for any
 * label other than the one hard-coded.
 */
function applyPerFrameFunctionalGroups(dataset, frames) {
  normalizeSharedFunctionalGroupsSequence(dataset);
  const validFrames = frames.filter(frame => {
    var _frame$sourceImageSeq;
    return frame === null || frame === void 0 || (_frame$sourceImageSeq = frame.sourceImageSequenceItem) === null || _frame$sourceImageSeq === void 0 ? void 0 : _frame$sourceImageSeq.ReferencedSOPInstanceUID;
  });
  const existing = dataset.PerFrameFunctionalGroupsSequence;
  const existingList = Array.isArray(existing) ? existing : [];
  const nextSequence = validFrames.map((frame, index) => {
    const prior = existingList[index] && typeof existingList[index] === 'object' ? existingList[index] : {};

    // Drop any inherited SegmentIdentificationSequence when this frame has no
    // referencedSegmentNumber (LABELMAP path) so the macro is truly absent.
    prior.SegmentIdentificationSequence;
      const priorRest = (0,objectWithoutProperties/* ["default"] */.A)(prior, _excluded);
    const group = perFrameFunctionalGroups_objectSpread(perFrameFunctionalGroups_objectSpread({}, priorRest), {}, {
      DerivationImageSequence: [{
        SourceImageSequence: [frame.sourceImageSequenceItem]
      }]
    });
    if (frame.referencedSegmentNumber != null) {
      group.SegmentIdentificationSequence = {
        ReferencedSegmentNumber: frame.referencedSegmentNumber
      };
    }
    if (frame.planeOrientationSequence) {
      group.PlaneOrientationSequence = frame.planeOrientationSequence;
    }
    if (frame.planePositionSequence) {
      group.PlanePositionSequence = frame.planePositionSequence;
    }
    return group;
  });
  dataset.PerFrameFunctionalGroupsSequence = nextSequence;
  dataset.NumberOfFrames = nextSequence.length;
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/encodePixelData.js


const RLE_LOSSLESS_TRANSFER_SYNTAX_UID = '1.2.840.10008.1.2.5';
const EXPLICIT_VR_LITTLE_ENDIAN_TRANSFER_SYNTAX_UID = dcmjs_es/* .constants.EXPLICIT_LITTLE_ENDIAN */.AA.EXPLICIT_LITTLE_ENDIAN;
function getTransferSyntaxUid(multiframe) {
  var _meta$TransferSyntaxU;
  const meta = multiframe._meta;
  const fromMeta = meta === null || meta === void 0 || (_meta$TransferSyntaxU = meta.TransferSyntaxUID) === null || _meta$TransferSyntaxU === void 0 || (_meta$TransferSyntaxU = _meta$TransferSyntaxU.Value) === null || _meta$TransferSyntaxU === void 0 ? void 0 : _meta$TransferSyntaxU[0];
  if (fromMeta) {
    return fromMeta;
  }
  if (typeof multiframe.TransferSyntaxUID === 'string') {
    return multiframe.TransferSyntaxUID;
  }
  return EXPLICIT_VR_LITTLE_ENDIAN_TRANSFER_SYNTAX_UID;
}
function getSegNumberOfFramesFromDataset(multiframe) {
  const fromTag = Number(multiframe.NumberOfFrames);
  if (fromTag > 0) {
    return fromTag;
  }
  const perFrame = multiframe.PerFrameFunctionalGroupsSequence;
  if (Array.isArray(perFrame) && perFrame.length > 0) {
    return perFrame.length;
  }
  return 1;
}
function decodeRlePackBitsSegment(data, start, end, outLength) {
  const out = new Uint8Array(outLength);
  let outIndex = 0;
  let inIndex = start;
  while (inIndex < end && outIndex < outLength) {
    const n = data[inIndex++];
    if (n >= 0 && n <= 127) {
      for (let i = 0; i < n + 1 && outIndex < outLength; ++i) {
        out[outIndex++] = data[inIndex++] & 0xff;
      }
    } else if (n <= -1 && n >= -127) {
      const value = data[inIndex++] & 0xff;
      for (let j = 0; j < -n + 1 && outIndex < outLength; ++j) {
        out[outIndex++] = value;
      }
    }
  }
  return out;
}
function decodeRleLosslessToPackedBytes(rleData, packedByteLength) {
  const frameData = rleData instanceof Uint8Array ? rleData : new Uint8Array(rleData);
  const header = new DataView(frameData.buffer, frameData.byteOffset, frameData.byteLength);
  const data = new Int8Array(frameData.buffer, frameData.byteOffset, frameData.byteLength);
  const numSegments = header.getInt32(0, true);
  if (numSegments !== 1) {
    throw new Error("Expected a single RLE segment for SEG re-encode, got ".concat(numSegments));
  }
  const start = header.getInt32(4, true);
  let end = header.getInt32(8, true);
  if (end === 0) {
    end = frameData.length;
  }
  return decodeRlePackBitsSegment(data, start, end, packedByteLength);
}
function decodeRleMultiByteFrame(rleData, samplesPerFrame, bitsAllocated) {
  const frameData = rleData instanceof Uint8Array ? rleData : new Uint8Array(rleData);
  const header = new DataView(frameData.buffer, frameData.byteOffset, frameData.byteLength);
  const data = new Int8Array(frameData.buffer, frameData.byteOffset, frameData.byteLength);
  const numSegments = header.getInt32(0, true);
  const bytesPerSample = Math.ceil(bitsAllocated / 8);
  if (numSegments !== bytesPerSample) {
    throw new Error("Expected ".concat(bytesPerSample, " RLE segment(s) for ").concat(bitsAllocated, "-bit SEG, got ").concat(numSegments));
  }
  const segmentStart = index => header.getInt32(4 + index * 4, true);
  if (bitsAllocated <= 8) {
    return decodeRlePackBitsSegment(data, segmentStart(0), frameData.length, samplesPerFrame);
  }
  const highStart = segmentStart(0);
  const lowStart = segmentStart(1);
  const highBytes = decodeRlePackBitsSegment(data, highStart, lowStart, samplesPerFrame);
  const lowBytes = decodeRlePackBitsSegment(data, lowStart, frameData.length, samplesPerFrame);
  const frame = new Uint16Array(samplesPerFrame);
  for (let i = 0; i < samplesPerFrame; i++) {
    frame[i] = (highBytes[i] << 8 | lowBytes[i]) & 0xffff;
  }
  return frame;
}
function decodeSegFramesFromMultiframe(multiframe) {
  const rows = Number(multiframe.Rows);
  const columns = Number(multiframe.Columns);
  const samplesPerFrame = rows * columns;
  const bitsAllocated = Number(multiframe.BitsAllocated);
  const numberOfFrames = getSegNumberOfFramesFromDataset(multiframe);
  const transferSyntaxUid = getTransferSyntaxUid(multiframe);
  if (!multiframe.PixelData) {
    throw new Error('SEG dataset has no PixelData');
  }
  if (bitsAllocated === 1) {
    if (transferSyntaxUid === RLE_LOSSLESS_TRANSFER_SYNTAX_UID) {
      const encodedFrames = Array.isArray(multiframe.PixelData) ? multiframe.PixelData : [multiframe.PixelData];
      const bytesPerFrame = getBytesForBinaryFrame(samplesPerFrame);
      const frames = [];
      for (let frameIndex = 0; frameIndex < numberOfFrames; frameIndex++) {
        const rleFrame = encodedFrames[frameIndex];
        if (!rleFrame) {
          frames.push(new Uint8Array(samplesPerFrame));
          continue;
        }
        const packed = decodeRleLosslessToPackedBytes(rleFrame, bytesPerFrame);
        frames.push(unpackBinaryFrameFromPacked(packed, samplesPerFrame));
      }
      return frames;
    }
    return getBitmapFramesFromDataset(multiframe).frames;
  }
  if (transferSyntaxUid === RLE_LOSSLESS_TRANSFER_SYNTAX_UID) {
    const encodedFrames = Array.isArray(multiframe.PixelData) ? multiframe.PixelData : [multiframe.PixelData];
    const frames = [];
    for (let frameIndex = 0; frameIndex < numberOfFrames; frameIndex++) {
      const rleFrame = encodedFrames[frameIndex];
      if (!rleFrame) {
        frames.push(bitsAllocated <= 8 ? new Uint8Array(samplesPerFrame) : new Uint16Array(samplesPerFrame));
        continue;
      }
      frames.push(decodeRleMultiByteFrame(rleFrame, samplesPerFrame, bitsAllocated));
    }
    return frames;
  }
  return getBitmapFramesFromDataset(multiframe).frames;
}
function createDecodeImageDataFromMultiframe(multiframe) {
  let cachedFrames = null;
  return async (_frameImageId, frameNumber) => {
    if (!cachedFrames) {
      cachedFrames = decodeSegFramesFromMultiframe(multiframe);
    }
    const frame = cachedFrames[frameNumber - 1];
    if (!frame) {
      throw new Error("No SEG frame at index ".concat(frameNumber));
    }
    return frame;
  };
}
function getBytesForBinaryFrame(numPixels) {
  return Math.ceil(numPixels / 8);
}
function asUint8PixelData(pixelData) {
  if (pixelData instanceof Uint8Array) {
    return pixelData;
  }
  if (pixelData instanceof ArrayBuffer) {
    return new Uint8Array(pixelData);
  }
  if (Array.isArray(pixelData)) {
    if (pixelData.length === 1) {
      return new Uint8Array(pixelData[0]);
    }
    throw new Error('Multiframe encapsulated PixelData fragments cannot be converted to binary frames for re-encoding');
  }
  return new Uint8Array(pixelData);
}
function normalizeBinaryFrameTo01(frame) {
  const normalized = new Uint8Array(frame.length);
  for (let i = 0; i < frame.length; i++) {
    normalized[i] = frame[i] ? 1 : 0;
  }
  return normalized;
}
function unpackBinaryFrameFromPacked(packed, samplesPerFrame) {
  const frame = new Uint8Array(samplesPerFrame);
  for (let i = 0; i < samplesPerFrame; i++) {
    const bytePos = i >> 3;
    const bitPos = i % 8;
    frame[i] = packed[bytePos] & 1 << bitPos ? 1 : 0;
  }
  return frame;
}
function unpackBinaryFrameFromContinuousPack(packed, samplesPerFrame, frameIndex) {
  const frame = new Uint8Array(samplesPerFrame);
  const bitOffset = frameIndex * samplesPerFrame;
  for (let i = 0; i < samplesPerFrame; i++) {
    const bitIndex = bitOffset + i;
    const bytePos = bitIndex >> 3;
    const bitPos = bitIndex % 8;
    frame[i] = packed[bytePos] & 1 << bitPos ? 1 : 0;
  }
  return frame;
}
function getBitmapFramesFromDataset(dataset) {
  const numberOfFrames = Number(dataset.NumberOfFrames) || 1;
  const rows = Number(dataset.Rows);
  const columns = Number(dataset.Columns);
  const samplesPerFrame = rows * columns;
  const bitsAllocated = Number(dataset.BitsAllocated);
  if (!dataset.PixelData) {
    throw new Error('Bitmap SEG dataset has no PixelData');
  }
  if (bitsAllocated === 1) {
    const buffer = asUint8PixelData(dataset.PixelData);
    const bytesPerFrame = getBytesForBinaryFrame(samplesPerFrame);
    const unpackedFrameBytes = samplesPerFrame * numberOfFrames;
    const perFramePackedBytes = bytesPerFrame * numberOfFrames;
    const continuousPackedBytes = getBytesForBinaryFrame(samplesPerFrame * numberOfFrames);
    const frames = [];
    if (buffer.length === unpackedFrameBytes) {
      for (let frameIndex = 0; frameIndex < numberOfFrames; frameIndex++) {
        const start = frameIndex * samplesPerFrame;
        frames.push(normalizeBinaryFrameTo01(buffer.subarray(start, start + samplesPerFrame)));
      }
    } else if (buffer.length === perFramePackedBytes) {
      for (let frameIndex = 0; frameIndex < numberOfFrames; frameIndex++) {
        const framePacked = buffer.subarray(frameIndex * bytesPerFrame, (frameIndex + 1) * bytesPerFrame);
        frames.push(unpackBinaryFrameFromPacked(framePacked, samplesPerFrame));
      }
    } else if (buffer.length === continuousPackedBytes) {
      for (let frameIndex = 0; frameIndex < numberOfFrames; frameIndex++) {
        frames.push(unpackBinaryFrameFromContinuousPack(buffer, samplesPerFrame, frameIndex));
      }
    } else {
      throw new Error("Unexpected 1-bit SEG PixelData length ".concat(buffer.length, " for ").concat(numberOfFrames, " frame(s) of ").concat(samplesPerFrame, " pixels"));
    }
    return {
      frames,
      bitsAllocated
    };
  }
  if (bitsAllocated <= 8) {
    const buffer = asUint8PixelData(dataset.PixelData);
    const frames = [];
    for (let frameIndex = 0; frameIndex < numberOfFrames; frameIndex++) {
      const start = frameIndex * samplesPerFrame;
      frames.push(buffer.slice(start, start + samplesPerFrame));
    }
    return {
      frames,
      bitsAllocated
    };
  }
  let buffer;
  if (dataset.PixelData instanceof Uint16Array) {
    buffer = dataset.PixelData;
  } else {
    const bytes = asUint8PixelData(dataset.PixelData);
    buffer = new Uint16Array(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
  }
  const frames = [];
  for (let frameIndex = 0; frameIndex < numberOfFrames; frameIndex++) {
    const start = frameIndex * samplesPerFrame;
    frames.push(buffer.slice(start, start + samplesPerFrame));
  }
  return {
    frames,
    bitsAllocated
  };
}
function packBitsRange(samples, start, end, output) {
  let i = start;
  while (i < end) {
    let replicateRunLength = 1;
    while (i + replicateRunLength < end && replicateRunLength < 128 && samples[i + replicateRunLength] === samples[i]) {
      replicateRunLength++;
    }
    if (replicateRunLength >= 2) {
      output.push(257 - replicateRunLength, samples[i] & 0xff);
      i += replicateRunLength;
      continue;
    }
    const literalStart = i;
    i++;
    while (i < end) {
      replicateRunLength = 1;
      while (i + replicateRunLength < end && replicateRunLength < 128 && samples[i + replicateRunLength] === samples[i]) {
        replicateRunLength++;
      }
      if (replicateRunLength >= 2 || i - literalStart >= 128) {
        break;
      }
      i++;
    }
    const literalLength = i - literalStart;
    output.push(literalLength - 1);
    for (let j = literalStart; j < i; j++) {
      output.push(samples[j] & 0xff);
    }
  }
}
function packBits(samples, rowLength) {
  const output = [];
  const total = samples.length;
  if (rowLength && rowLength > 0 && total % rowLength === 0) {
    for (let start = 0; start < total; start += rowLength) {
      packBitsRange(samples, start, start + rowLength, output);
    }
  } else {
    packBitsRange(samples, 0, total, output);
  }
  return Uint8Array.from(output);
}
function bitPackBinaryFrame(frame) {
  const packedLength = Math.ceil(frame.length / 8);
  const packed = new Uint8Array(packedLength);
  for (let i = 0; i < frame.length; i++) {
    if (frame[i]) {
      packed[i >> 3] |= 1 << i % 8;
    }
  }
  return packed;
}
function concatUint8Frames(frames) {
  const totalLength = frames.reduce((sum, frame) => sum + frame.length, 0);
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  for (const frame of frames) {
    for (let i = 0; i < frame.length; i++) {
      combined[offset + i] = frame[i] & 0xff;
    }
    offset += frame.length;
  }
  return combined;
}
function concatUint16Frames(frames) {
  const totalLength = frames.reduce((sum, frame) => sum + frame.length, 0);
  const combined = new Uint16Array(totalLength);
  let offset = 0;
  for (const frame of frames) {
    for (let i = 0; i < frame.length; i++) {
      combined[offset + i] = frame[i] & 0xffff;
    }
    offset += frame.length;
  }
  return combined;
}
function getRleSegmentsForFrame(frame, bitsAllocated) {
  if (bitsAllocated === 1) {
    return [bitPackBinaryFrame(frame)];
  }
  if (bitsAllocated === 8) {
    const segment = new Uint8Array(frame.length);
    for (let i = 0; i < frame.length; i++) {
      segment[i] = frame[i] & 0xff;
    }
    return [segment];
  }
  if (bitsAllocated === 16) {
    const highByteSegment = new Uint8Array(frame.length);
    const lowByteSegment = new Uint8Array(frame.length);
    for (let i = 0; i < frame.length; i++) {
      const sample = frame[i] & 0xffff;
      highByteSegment[i] = sample >> 8 & 0xff;
      lowByteSegment[i] = sample & 0xff;
    }
    return [highByteSegment, lowByteSegment];
  }
  throw new Error("Unsupported bitsAllocated for RLE encoding: ".concat(bitsAllocated, ". Expected 1, 8, or 16."));
}
function encodeFrameToRle(frame, bitsAllocated, columns) {
  const segmentPlanes = getRleSegmentsForFrame(frame, bitsAllocated);
  if (segmentPlanes.length > 15) {
    throw new Error("RLE segment count ".concat(segmentPlanes.length, " exceeds DICOM maximum of 15 segments"));
  }
  const rowLength = columns && columns > 0 ? bitsAllocated === 1 ? columns % 8 === 0 ? columns / 8 : undefined : columns : undefined;
  const encodedSegments = segmentPlanes.map(segment => {
    const encoded = packBits(segment, rowLength);
    if (encoded.length % 2 === 0) {
      return encoded;
    }
    const padded = new Uint8Array(encoded.length + 1);
    padded.set(encoded, 0);
    return padded;
  });
  const header = new DataView(new ArrayBuffer(64));
  header.setUint32(0, encodedSegments.length, true);
  let offset = 64;
  for (let i = 0; i < encodedSegments.length; i++) {
    header.setUint32((i + 1) * 4, offset, true);
    offset += encodedSegments[i].length;
  }
  const frameBytes = new Uint8Array(offset);
  frameBytes.set(new Uint8Array(header.buffer), 0);
  let writeOffset = 64;
  for (let i = 0; i < encodedSegments.length; i++) {
    frameBytes.set(encodedSegments[i], writeOffset);
    writeOffset += encodedSegments[i].length;
  }
  return frameBytes.buffer;
}
function isUncompressedSegTransferSyntax(transferSyntaxUID) {
  return transferSyntaxUID === EXPLICIT_VR_LITTLE_ENDIAN_TRANSFER_SYNTAX_UID;
}
function resolveFrameAtIndex(args, frameIndex) {
  if (args.frames) {
    return args.frames[frameIndex];
  }
  return args.buildFrame(frameIndex);
}
function materializeAllFrames(args) {
  var _args$frames$length, _args$frames;
  const frameCount = (_args$frames$length = (_args$frames = args.frames) === null || _args$frames === void 0 ? void 0 : _args$frames.length) !== null && _args$frames$length !== void 0 ? _args$frames$length : args.frameCount;
  return Array.from({
    length: frameCount
  }, (_, frameIndex) => resolveFrameAtIndex(args, frameIndex));
}
function encodeCompressedFrameToTransferSyntax(frame, transferSyntaxUID, bitsAllocated, columns) {
  if (transferSyntaxUID === RLE_LOSSLESS_TRANSFER_SYNTAX_UID) {
    return encodeFrameToRle(frame, bitsAllocated, columns);
  }
  throw new Error("Unsupported compressed transfer syntax for SEG encoding: ".concat(transferSyntaxUID, ". ") + "Supported: ".concat(RLE_LOSSLESS_TRANSFER_SYNTAX_UID));
}
function encodeFramesToTransferSyntax(args) {
  var _args$frames$length2, _args$frames2;
  const transferSyntaxUID = args.transferSyntaxUID,
    bitsAllocated = args.bitsAllocated,
    columns = args.columns;
  const frameCount = (_args$frames$length2 = (_args$frames2 = args.frames) === null || _args$frames2 === void 0 ? void 0 : _args$frames2.length) !== null && _args$frames$length2 !== void 0 ? _args$frames$length2 : args.frameCount;
  if (isUncompressedSegTransferSyntax(transferSyntaxUID)) {
    const frames = materializeAllFrames(args);
    if (bitsAllocated === 1) {
      const packedFrames = frames.map(frame => bitPackBinaryFrame(frame));
      const combinedPacked = concatUint8Frames(packedFrames);
      return {
        transferSyntaxUID,
        pixelDataVR: 'OW',
        pixelData: combinedPacked
      };
    }
    return {
      transferSyntaxUID,
      pixelDataVR: bitsAllocated <= 8 ? 'OB' : 'OW',
      pixelData: bitsAllocated <= 8 ? concatUint8Frames(frames) : concatUint16Frames(frames)
    };
  }
  const pixelData = [];
  for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
    pixelData.push(encodeCompressedFrameToTransferSyntax(resolveFrameAtIndex(args, frameIndex), transferSyntaxUID, bitsAllocated, columns));
  }
  return {
    transferSyntaxUID,
    pixelDataVR: 'OB',
    pixelData
  };
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/enums/Events.js
var Events_Events;
(function (Events) {
  Events["SEGMENTATION_LOAD_PROGRESS"] = "CORNERSTONE_ADAPTER_SEGMENTATION_LOAD_PROGRESS";
})(Events_Events || (Events_Events = {}));



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/Segmentation_4X.js










const Segmentation_4X_utilities$orientatio = dcmjs_es/* .utilities.orientation */.BF.orientation,
  Segmentation_4X_rotateDirectionCosinesInPlane = Segmentation_4X_utilities$orientatio.rotateDirectionCosinesInPlane,
  Segmentation_4X_flipIOP = Segmentation_4X_utilities$orientatio.flipImageOrientationPatient,
  Segmentation_4X_flipMatrix2D = Segmentation_4X_utilities$orientatio.flipMatrix2D,
  Segmentation_4X_rotateMatrix902D = Segmentation_4X_utilities$orientatio.rotateMatrix902D;
const Segmentation_4X_BitArray = dcmjs_es/* .data.BitArray */.p.BitArray,
  Segmentation_4X_DicomMessage = dcmjs_es/* .data.DicomMessage */.p.DicomMessage,
  Segmentation_4X_DicomMetaDictionary = dcmjs_es/* .data.DicomMetaDictionary */.p.DicomMetaDictionary;
const Segmentation_4X_Normalizer = dcmjs_es/* .normalizers.Normalizer */.z8.Normalizer;
const Segmentation_4X_SegmentationDerivation = dcmjs_es/* .derivations.Segmentation */.h4.Segmentation;
const _utilities$compressio = dcmjs_es/* .utilities.compression */.BF.compression,
  encode = _utilities$compressio.encode,
  decode = _utilities$compressio.decode;
const Segmentation_4X_RLE_LOSSLESS_TRANSFER_SYNTAX_UID = '1.2.840.10008.1.2.5';
const Segmentation_4X_EXPLICIT_VR_LITTLE_ENDIAN_TRANSFER_SYNTAX_UID = '1.2.840.10008.1.2.1';

/**
 *
 * @typedef {Object} BrushData
 * @property {Object} toolState - The cornerstoneTools global toolState.
 * @property {Object[]} segments - The cornerstoneTools segment metadata that corresponds to the
 *                                 seriesInstanceUid.
 */
const generateSegmentationDefaultOptions = {
  includeSliceSpacing: true,
  transferSyntaxUid: Segmentation_4X_RLE_LOSSLESS_TRANSFER_SYNTAX_UID
};

/**
 * generateSegmentation - Generates cornerstoneTools brush data, given a stack of
 * imageIds, images and the cornerstoneTools brushData.
 *
 * @param  {object[]} images An array of cornerstone images that contain the source
 *                           data under `image.data.byteArray.buffer`.
 * @param  {Object|Object[]} inputLabelmaps3D The cornerstone `Labelmap3D` object, or an array of objects.
 * @param  {Object} userOptions Options to pass to the segmentation derivation and `fillSegmentation`.
 * @returns {Blob}
 */
function Segmentation_4X_generateSegmentation(images, inputLabelmaps3D) {
  let userOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const isMultiframe = isMultiframeImage(images[0]);
  const segmentation = Segmentation_4X_createSegFromImages(images, isMultiframe, userOptions);
  return fillSegmentation(segmentation, inputLabelmaps3D, userOptions);
}

/**
 * The set of non-zero segment values actually present in a frame's pixel data,
 * collected in a single pass. `segmentsOnLabelmap` can be stale, so presence is
 * verified against the pixels — but once per frame, not with one full-frame
 * scan per listed segment.
 */
function segmentsPresentInFrame(pixelData) {
  const presentSegments = new Set();
  if (!pixelData) {
    return presentSegments;
  }
  for (let i = 0; i < pixelData.length; i++) {
    const value = pixelData[i];
    if (value !== 0) {
      presentSegments.add(value);
    }
  }
  return presentSegments;
}

/**
 * Fills a given segmentation object with data from the input labelmaps3D
 *
 * @param segmentation - The segmentation object to be filled.
 * @param inputLabelmaps3D - An array of 3D labelmaps, or a single 3D labelmap.
 * @param userOptions - Optional configuration settings. Will override the default options.
 *   - `transferSyntaxUid` — the output transfer syntax. Defaults to RLE Lossless
 *     (`1.2.840.10008.1.2.5`); Explicit VR Little Endian
 *     (`1.2.840.10008.1.2.1`) is also supported. Any other value throws.
 *   - `rleEncode` — **obsolete / ignored.** This option is no longer read. It
 *     never worked correctly in prior versions (the old path did not produce a
 *     valid RLE-encoded SEG), so it has been dropped rather than fixed. RLE
 *     output is now selected via `transferSyntaxUid` (RLE Lossless is the
 *     default), and encoding is handled by `encodeFramesToTransferSyntax`.
 *
 * @returns {object} The filled segmentation object.
 */
function fillSegmentation(segmentation, inputLabelmaps3D) {
  var _ref, _options$transferSynt;
  let userOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let images = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  let metadata = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  const options = Object.assign({}, generateSegmentationDefaultOptions, userOptions);

  // Use another variable so we don't redefine labelmaps3D.
  const labelmaps3D = Array.isArray(inputLabelmaps3D) ? inputLabelmaps3D : [inputLabelmaps3D];
  const referencedFramesPerLabelmap = [];
  const frameDescriptors = [];
  for (let labelmapIndex = 0; labelmapIndex < labelmaps3D.length; labelmapIndex++) {
    const labelmap3D = labelmaps3D[labelmapIndex];
    const labelmaps2D = labelmap3D.labelmaps2D,
      segmentMetadata = labelmap3D.metadata;
    const referencedFramesPerSegment = [];
    for (let i = 1; i < segmentMetadata.length; i++) {
      if (segmentMetadata[i]) {
        referencedFramesPerSegment[i] = [];
      }
    }
    for (let i = 0; i < labelmaps2D.length; i++) {
      const labelmap2D = labelmaps2D[i];
      if (!(labelmap2D !== null && labelmap2D !== void 0 && labelmap2D.pixelData)) {
        continue;
      }
      const segmentsOnLabelmap = labelmap2D.segmentsOnLabelmap;
      const presentSegments = segmentsPresentInFrame(labelmap2D.pixelData);
      segmentsOnLabelmap.forEach(segmentIndex => {
        if (segmentIndex !== 0 && segmentMetadata[segmentIndex] && referencedFramesPerSegment[segmentIndex] && presentSegments.has(segmentIndex)) {
          referencedFramesPerSegment[segmentIndex].push(i);
        }
      });
    }
    referencedFramesPerLabelmap[labelmapIndex] = referencedFramesPerSegment;
  }
  let numberOfFrames = 0;
  for (let labelmapIndex = 0; labelmapIndex < labelmaps3D.length; labelmapIndex++) {
    const referencedFramesPerSegment = referencedFramesPerLabelmap[labelmapIndex];
    const labelmap3D = labelmaps3D[labelmapIndex];
    const segmentMetadata = labelmap3D.metadata;
    for (let segmentIndex = 1; segmentIndex < referencedFramesPerSegment.length; segmentIndex++) {
      const referencedFrameIndicies = referencedFramesPerSegment[segmentIndex];
      if (!(referencedFrameIndicies !== null && referencedFrameIndicies !== void 0 && referencedFrameIndicies.length) || !segmentMetadata[segmentIndex]) {
        continue;
      }
      const labelmaps = _getLabelmapsFromReferencedFrameIndicies(labelmap3D, referencedFrameIndicies);
      if (!labelmaps.length || !labelmaps.some(frame => (frame === null || frame === void 0 ? void 0 : frame.length) && frame.some(v => v !== 0))) {
        continue;
      }
      numberOfFrames += referencedFrameIndicies.length;
    }
  }
  if (numberOfFrames === 0) {
    throw new Error('No non-empty segmentation frames found for SEG export');
  }
  segmentation.setNumberOfFrames(numberOfFrames);
  for (let labelmapIndex = 0; labelmapIndex < labelmaps3D.length; labelmapIndex++) {
    const referencedFramesPerSegment = referencedFramesPerLabelmap[labelmapIndex];
    const labelmap3D = labelmaps3D[labelmapIndex];
    const segmentMetadata = labelmap3D.metadata;
    for (let segmentIndex = 1; segmentIndex < referencedFramesPerSegment.length; segmentIndex++) {
      const referencedFrameIndicies = referencedFramesPerSegment[segmentIndex];
      if (!(referencedFrameIndicies !== null && referencedFrameIndicies !== void 0 && referencedFrameIndicies.length) || !segmentMetadata[segmentIndex]) {
        continue;
      }
      const labelmaps = _getLabelmapsFromReferencedFrameIndicies(labelmap3D, referencedFrameIndicies);
      if (!labelmaps.length || !labelmaps.some(frame => (frame === null || frame === void 0 ? void 0 : frame.length) && frame.some(v => v !== 0))) {
        continue;
      }

      // Frame numbers start from 1.
      const referencedFrameNumbers = referencedFrameIndicies.map(element => element + 1);
      referencedFrameNumbers.forEach(frameNumber => {
        frameDescriptors.push({
          referencedSegmentNumber: segmentIndex,
          sourceFrameIndex: frameNumber - 1
        });
      });
      segmentation.addSegmentFromLabelmap(segmentMetadata[segmentIndex], labelmaps, segmentIndex, referencedFrameNumbers);
    }
  }
  if (frameDescriptors.length && images !== null && images !== void 0 && images.length && metadata) {
    // Every SEG frame must reference a resolvable source SOP Instance UID.
    // Reject rather than silently dropping frames: a dropped frame would make
    // the per-frame functional groups disagree with the encoded PixelData and
    // produce a SEG whose source-image references are unreliable.
    const perFrameInputs = frameDescriptors.map(desc => {
      const sourceImageSequenceItem = getReferencedSourceImageSequenceItem(images[desc.sourceFrameIndex], metadata);
      if (!(sourceImageSequenceItem !== null && sourceImageSequenceItem !== void 0 && sourceImageSequenceItem.ReferencedSOPInstanceUID)) {
        throw new Error("Cannot resolve a source ReferencedSOPInstanceUID for SEG frame " + "(sourceFrameIndex ".concat(desc.sourceFrameIndex, ", segment ") + "".concat(desc.referencedSegmentNumber, "). Refusing to write a SEG with ") + "unreliable source image references.");
      }
      return {
        referencedSegmentNumber: desc.referencedSegmentNumber,
        sourceImageSequenceItem
      };
    });
    applyPerFrameFunctionalGroups(segmentation.dataset, perFrameInputs);
  }
  const transferSyntaxUid = (_ref = (_options$transferSynt = options.transferSyntaxUid) !== null && _options$transferSynt !== void 0 ? _options$transferSynt : options.transferSyntaxUID) !== null && _ref !== void 0 ? _ref : Segmentation_4X_RLE_LOSSLESS_TRANSFER_SYNTAX_UID;
  if (transferSyntaxUid === Segmentation_4X_RLE_LOSSLESS_TRANSFER_SYNTAX_UID) {
    const isBinaryBitmap = segmentation.dataset.SegmentationType === 'BINARY' && Number(segmentation.dataset.BitsAllocated) === 1;
    if (isBinaryBitmap) {
      segmentation.bitPackPixelData();
      const _getBitmapFramesFromD = getBitmapFramesFromDataset(segmentation.dataset),
        frames = _getBitmapFramesFromD.frames,
        bitsAllocated = _getBitmapFramesFromD.bitsAllocated;
      const _encodeFramesToTransf = encodeFramesToTransferSyntax({
          transferSyntaxUID: RLE_LOSSLESS_TRANSFER_SYNTAX_UID,
          frames,
          bitsAllocated,
          columns: Number(segmentation.dataset.Columns) || undefined
        }),
        pixelData = _encodeFramesToTransf.pixelData,
        pixelDataVR = _encodeFramesToTransf.pixelDataVR;
      segmentation.dataset.PixelData = pixelData;
      segmentation.dataset._vrMap.PixelData = pixelDataVR;
      if (!options.skipTransferSyntaxMeta) {
        segmentation.dataset._meta.TransferSyntaxUID = {
          Value: [Segmentation_4X_RLE_LOSSLESS_TRANSFER_SYNTAX_UID],
          vr: 'UI'
        };
      }
      segmentation.dataset.SpecificCharacterSet = 'ISO_IR 192';
    } else {
      const rleEncodedFrames = encode(segmentation.dataset.PixelData, numberOfFrames, segmentation.dataset.Rows, segmentation.dataset.Columns);

      // Fractional/8-bit labelmaps: legacy dcmjs row RLE (not valid for 1-bit packed binary).
      segmentation.assignToDataset({
        BitsAllocated: '8',
        BitsStored: '8',
        HighBit: '7',
        SegmentationType: 'FRACTIONAL',
        SegmentationFractionalType: 'PROBABILITY',
        MaximumFractionalValue: '255'
      });
      if (!options.skipTransferSyntaxMeta) {
        segmentation.dataset._meta.TransferSyntaxUID = {
          Value: [Segmentation_4X_RLE_LOSSLESS_TRANSFER_SYNTAX_UID],
          vr: 'UI'
        };
      }
      segmentation.dataset.SpecificCharacterSet = 'ISO_IR 192';
      segmentation.dataset._vrMap.PixelData = 'OB';
      segmentation.dataset.PixelData = rleEncodedFrames;
    }
  } else if (transferSyntaxUid === Segmentation_4X_EXPLICIT_VR_LITTLE_ENDIAN_TRANSFER_SYNTAX_UID) {
    // For explicit VR little endian, at least bitpack the data.
    segmentation.bitPackPixelData();
    if (!options.skipTransferSyntaxMeta) {
      segmentation.dataset._meta.TransferSyntaxUID = {
        Value: [Segmentation_4X_EXPLICIT_VR_LITTLE_ENDIAN_TRANSFER_SYNTAX_UID],
        vr: 'UI'
      };
    }
  } else {
    throw new Error("Unsupported SEG transfer syntax: ".concat(transferSyntaxUid, ". ") + "Supported: ".concat(Segmentation_4X_RLE_LOSSLESS_TRANSFER_SYNTAX_UID, ", ").concat(Segmentation_4X_EXPLICIT_VR_LITTLE_ENDIAN_TRANSFER_SYNTAX_UID));
  }
  return segmentation;
}
function _getLabelmapsFromReferencedFrameIndicies(labelmap3D, referencedFrameIndicies) {
  const labelmaps2D = labelmap3D.labelmaps2D;
  const labelmaps = [];
  for (let i = 0; i < referencedFrameIndicies.length; i++) {
    const frame = referencedFrameIndicies[i];
    labelmaps.push(labelmaps2D[frame].pixelData);
  }
  return labelmaps;
}

/**
 * _createSegFromImages - description
 *
 * @param  {Object[]} images    An array of the cornerstone image objects.
 * @param  {Boolean} isMultiframe Whether the images are multiframe.
 * @returns {Object}              The Seg derived dataSet.
 */
function Segmentation_4X_createSegFromImages(images, isMultiframe, options) {
  const multiframe = getDatasetsFromImages(images, isMultiframe);
  return new Segmentation_4X_SegmentationDerivation([multiframe], options);
}

/**
 * generateToolState - Given a set of cornerstoneTools imageIds and a Segmentation buffer,
 * derive cornerstoneTools toolState and brush metadata.
 *
 * @param  {string[]} referencedImageIds - An array for referenced image imageIds.
 * @param  {ArrayBuffer} arrayBuffer - The SEG arrayBuffer.
 * @param  {*} metadataProvider.
 * @param  {obj} options - Options object.
 *
 * @return {[]ArrayBuffer}a list of array buffer for each labelMap
 * @return {Object} an object from which the segment metadata can be derived
 * @return {[][][]} 2D list containing the track of segments per frame
 * @return {[][][]} 3D list containing the track of segments per frame for each labelMap
 *                  (available only for the overlapping case).
 */
async function Segmentation_4X_generateToolState(referencedImageIds, arrayBuffer, metadataProvider, options) {
  const _options$skipOverlapp = options.skipOverlapping,
    skipOverlapping = _options$skipOverlapp === void 0 ? false : _options$skipOverlapp,
    _options$tolerance = options.tolerance,
    tolerance = _options$tolerance === void 0 ? 1e-3 : _options$tolerance,
    _options$TypedArrayCo = options.TypedArrayConstructor,
    TypedArrayConstructor = _options$TypedArrayCo === void 0 ? Uint8Array : _options$TypedArrayCo,
    _options$maxBytesPerC = options.maxBytesPerChunk,
    maxBytesPerChunk = _options$maxBytesPerC === void 0 ? 199000000 : _options$maxBytesPerC,
    _options$eventTarget = options.eventTarget,
    eventTarget = _options$eventTarget === void 0 ? null : _options$eventTarget,
    _options$triggerEvent = options.triggerEvent,
    triggerEvent = _options$triggerEvent === void 0 ? null : _options$triggerEvent;
  const dicomData = Segmentation_4X_DicomMessage.readFile(arrayBuffer);
  const dataset = Segmentation_4X_DicomMetaDictionary.naturalizeDataset(dicomData.dict);
  dataset._meta = Segmentation_4X_DicomMetaDictionary.namifyDataset(dicomData.meta);
  const multiframe = Segmentation_4X_Normalizer.normalizeToDataset([dataset]);
  const imagePlaneModule = metadataProvider.get('imagePlaneModule', referencedImageIds[0]);
  const generalSeriesModule = metadataProvider.get('generalSeriesModule', referencedImageIds[0]);
  const SeriesInstanceUID = generalSeriesModule.seriesInstanceUID;
  if (!imagePlaneModule) {
    console.warn('Insufficient metadata, imagePlaneModule missing.');
  }
  const ImageOrientationPatient = Array.isArray(imagePlaneModule.rowCosines) ? [...imagePlaneModule.rowCosines, ...imagePlaneModule.columnCosines] : [imagePlaneModule.rowCosines.x, imagePlaneModule.rowCosines.y, imagePlaneModule.rowCosines.z, imagePlaneModule.columnCosines.x, imagePlaneModule.columnCosines.y, imagePlaneModule.columnCosines.z];

  // Get IOP from ref series, compute supported orientations:
  const validOrientations = Segmentation_4X_getValidOrientations(ImageOrientationPatient);
  const sliceLength = multiframe.Columns * multiframe.Rows;
  const segMetadata = Segmentation_4X_getSegmentMetadata(multiframe, SeriesInstanceUID);
  const TransferSyntaxUID = multiframe._meta.TransferSyntaxUID.Value[0];
  let pixelData;
  let pixelDataChunks;
  if (TransferSyntaxUID === '1.2.840.10008.1.2.5') {
    const rleEncodedFrames = Array.isArray(multiframe.PixelData) ? multiframe.PixelData : [multiframe.PixelData];
    pixelData = decode(rleEncodedFrames, multiframe.Rows, multiframe.Columns);
    if (multiframe.BitsStored === 1) {
      console.warn('No implementation for rle + bitbacking.');
      return;
    }

    // Todo: need to test this with rle data
    pixelDataChunks = [pixelData];
  } else {
    pixelDataChunks = Segmentation_4X_unpackPixelData(multiframe, {
      maxBytesPerChunk
    });
    if (!pixelDataChunks) {
      throw new Error('Fractional segmentations are not yet supported');
    }
  }
  const orientation = checkOrientation(multiframe, validOrientations, [imagePlaneModule.rows, imagePlaneModule.columns, referencedImageIds.length], tolerance);

  // Pre-compute the sop UID to imageId index map so that in the for loop
  // we don't have to call metadataProvider.get() for each imageId over
  // and over again.
  const sopUIDImageIdIndexMap = referencedImageIds.reduce((acc, imageId) => {
    const _metadataProvider$get = metadataProvider.get('generalImageModule', imageId),
      sopInstanceUID = _metadataProvider$get.sopInstanceUID;
    acc[sopInstanceUID] = imageId;
    return acc;
  }, {});
  let overlapping = false;
  if (!skipOverlapping) {
    overlapping = checkSEGsOverlapping(pixelDataChunks, multiframe, referencedImageIds, validOrientations, metadataProvider, tolerance, TypedArrayConstructor, sopUIDImageIdIndexMap);
  }
  let insertFunction;
  switch (orientation) {
    case 'Planar':
      if (overlapping) {
        insertFunction = insertOverlappingPixelDataPlanar;
      } else {
        insertFunction = insertPixelDataPlanar;
      }
      break;
    case 'Perpendicular':
      //insertFunction = insertPixelDataPerpendicular;
      throw new Error('Segmentations orthogonal to the acquisition plane of the source data are not yet supported.');
    case 'Oblique':
      throw new Error('Segmentations oblique to the acquisition plane of the source data are not yet supported.');
  }

  /* if SEGs are overlapping:
    1) the labelmapBuffer will contain M volumes which have non-overlapping segments;
    2) segmentsOnFrame will have M * numberOfFrames values to track in which labelMap are the segments;
    3) insertFunction will return the number of LabelMaps
    4) generateToolState return is an array*/

  const segmentsOnFrameArray = [];
  segmentsOnFrameArray[0] = [];
  const segmentsOnFrame = [];
  const arrayBufferLength = sliceLength * referencedImageIds.length * TypedArrayConstructor.BYTES_PER_ELEMENT;
  const labelmapBufferArray = [];
  labelmapBufferArray[0] = new ArrayBuffer(arrayBufferLength);

  // Pre-compute the indices and metadata so that we don't have to call
  // a function for each imageId in the for loop.
  const imageIdMaps = referencedImageIds.reduce((acc, curr, index) => {
    acc.indices[curr] = index;
    acc.metadata[curr] = metadataProvider.get('instance', curr);
    return acc;
  }, {
    indices: {},
    metadata: {}
  });

  // This is the centroid calculation for each segment Index, the data structure
  // is a Map with key = segmentIndex and value = {imageIdIndex: centroid, ...}
  // later on we will use this data structure to calculate the centroid of the
  // segment in the labelmapBuffer
  const segmentsPixelIndices = new Map();
  const overlappingSegments = await insertFunction(segmentsOnFrame, segmentsOnFrameArray, labelmapBufferArray, pixelDataChunks, multiframe, referencedImageIds, validOrientations, metadataProvider, tolerance, TypedArrayConstructor, segmentsPixelIndices, sopUIDImageIdIndexMap, imageIdMaps, eventTarget, triggerEvent);

  // calculate the centroid of each segment
  const centroidXYZ = new Map();
  segmentsPixelIndices.forEach((imageIdIndexBufferIndex, segmentIndex) => {
    const centroids = calculateCentroid(imageIdIndexBufferIndex, multiframe, metadataProvider, referencedImageIds);
    centroidXYZ.set(segmentIndex, centroids);
  });
  return {
    labelmapBufferArray,
    segMetadata,
    segmentsOnFrame,
    segmentsOnFrameArray,
    centroids: centroidXYZ,
    overlappingSegments
  };
}

// function insertPixelDataPerpendicular(
//     segmentsOnFrame,
//     labelmapBuffer,
//     pixelData,
//     multiframe,
//     imageIds,
//     validOrientations,
//     metadataProvider
// ) {
//     const {
//         SharedFunctionalGroupsSequence,
//         PerFrameFunctionalGroupsSequence,
//         Rows,
//         Columns
//     } = multiframe;

//     const firstImagePlaneModule = metadataProvider.get(
//         "imagePlaneModule",
//         imageIds[0]
//     );

//     const lastImagePlaneModule = metadataProvider.get(
//         "imagePlaneModule",
//         imageIds[imageIds.length - 1]
//     );

//     console.log(firstImagePlaneModule);
//     console.log(lastImagePlaneModule);

//     const corners = [
//         ...getCorners(firstImagePlaneModule),
//         ...getCorners(lastImagePlaneModule)
//     ];

//     console.log(`corners:`);
//     console.log(corners);

//     const indexToWorld = mat4.create();

//     const ippFirstFrame = firstImagePlaneModule.imagePositionPatient;
//     const rowCosines = Array.isArray(firstImagePlaneModule.rowCosines)
//         ? [...firstImagePlaneModule.rowCosines]
//         : [
//               firstImagePlaneModule.rowCosines.x,
//               firstImagePlaneModule.rowCosines.y,
//               firstImagePlaneModule.rowCosines.z
//           ];

//     const columnCosines = Array.isArray(firstImagePlaneModule.columnCosines)
//         ? [...firstImagePlaneModule.columnCosines]
//         : [
//               firstImagePlaneModule.columnCosines.x,
//               firstImagePlaneModule.columnCosines.y,
//               firstImagePlaneModule.columnCosines.z
//           ];

//     const { pixelSpacing } = firstImagePlaneModule;

//     mat4.set(
//         indexToWorld,
//         // Column 1
//         0,
//         0,
//         0,
//         ippFirstFrame[0],
//         // Column 2
//         0,
//         0,
//         0,
//         ippFirstFrame[1],
//         // Column 3
//         0,
//         0,
//         0,
//         ippFirstFrame[2],
//         // Column 4
//         0,
//         0,
//         0,
//         1
//     );

//     // TODO -> Get origin and (x,y,z) increments to build a translation matrix:
//     // TODO -> Equation C.7.6.2.1-1

//     // | cx*di rx* Xx 0 |  |x|
//     // | cy*di ry Xy 0 |  |y|
//     // | cz*di rz Xz 0 |  |z|
//     // | tx ty tz 1 |  |1|

//     // const [
//     //     0, 0 , 0 , 0,
//     //     0, 0 , 0 , 0,
//     //     0, 0 , 0 , 0,
//     //     ipp[0], ipp[1] , ipp[2] , 1,
//     // ]

//     // Each frame:

//     // Find which corner the first voxel lines up with (one of 8 corners.)

//     // Find how i,j,k orient with respect to source volume.
//     // Go through each frame, find location in source to start, and whether to increment +/ix,+/-y,+/-z
//     //   through each voxel.

//     // [1,0,0,0,1,0]

//     // const [

//     // ]

//     // Invert transformation matrix to get worldToIndex

//     // Apply world to index on each point to fill up the matrix.

//     // const sharedImageOrientationPatient = SharedFunctionalGroupsSequence.PlaneOrientationSequence
//     //     ? SharedFunctionalGroupsSequence.PlaneOrientationSequence
//     //           .ImageOrientationPatient
//     //     : undefined;
//     // const sliceLength = Columns * Rows;
// }

// function getCorners(imagePlaneModule) {
//     // console.log(imagePlaneModule);

//     const {
//         rows,
//         columns,
//         rowCosines,
//         columnCosines,
//         imagePositionPatient: ipp,
//         rowPixelSpacing,
//         columnPixelSpacing
//     } = imagePlaneModule;

//     const rowLength = columns * columnPixelSpacing;
//     const columnLength = rows * rowPixelSpacing;

//     const entireRowVector = [
//         rowLength * columnCosines[0],
//         rowLength * columnCosines[1],
//         rowLength * columnCosines[2]
//     ];

//     const entireColumnVector = [
//         columnLength * rowCosines[0],
//         columnLength * rowCosines[1],
//         columnLength * rowCosines[2]
//     ];

//     const topLeft = [ipp[0], ipp[1], ipp[2]];
//     const topRight = [
//         topLeft[0] + entireRowVector[0],
//         topLeft[1] + entireRowVector[1],
//         topLeft[2] + entireRowVector[2]
//     ];
//     const bottomLeft = [
//         topLeft[0] + entireColumnVector[0],
//         topLeft[1] + entireColumnVector[1],
//         topLeft[2] + entireColumnVector[2]
//     ];

//     const bottomRight = [
//         bottomLeft[0] + entireRowVector[0],
//         bottomLeft[1] + entireRowVector[1],
//         bottomLeft[2] + entireRowVector[2]
//     ];

//     return [topLeft, topRight, bottomLeft, bottomRight];
// }

/**
 * Find the reference frame of the segmentation frame in the source data.
 *
 * @param  {Object}      multiframe        dicom metadata
 * @param  {Int}         frameSegment      frame dicom index
 * @param  {String[]}    imageIds          A list of imageIds.
 * @param  {Object}      sopUIDImageIdIndexMap  A map of SOPInstanceUID to imageId
 * @param  {Float}       tolerance         The tolerance parameter
 *
 * @returns {String}     Returns the imageId
 */
function findReferenceSourceImageId(multiframe, frameSegment, imageIds, metadataProvider, tolerance, sopUIDImageIdIndexMap) {
  let imageId = undefined;
  if (!multiframe) {
    return imageId;
  }
  const FrameOfReferenceUID = multiframe.FrameOfReferenceUID,
    PerFrameFunctionalGroupsSequence = multiframe.PerFrameFunctionalGroupsSequence,
    SourceImageSequence = multiframe.SourceImageSequence,
    ReferencedSeriesSequence = multiframe.ReferencedSeriesSequence;
  if (!PerFrameFunctionalGroupsSequence || PerFrameFunctionalGroupsSequence.length === 0) {
    return imageId;
  }
  const PerFrameFunctionalGroup = PerFrameFunctionalGroupsSequence[frameSegment];
  if (!PerFrameFunctionalGroup) {
    return imageId;
  }
  let frameSourceImageSequence = undefined;
  if (PerFrameFunctionalGroup.DerivationImageSequence) {
    let DerivationImageSequence = PerFrameFunctionalGroup.DerivationImageSequence;
    if (Array.isArray(DerivationImageSequence)) {
      if (DerivationImageSequence.length !== 0) {
        DerivationImageSequence = DerivationImageSequence[0];
      } else {
        DerivationImageSequence = undefined;
      }
    }
    if (DerivationImageSequence) {
      frameSourceImageSequence = DerivationImageSequence.SourceImageSequence;
      if (Array.isArray(frameSourceImageSequence)) {
        if (frameSourceImageSequence.length !== 0) {
          frameSourceImageSequence = frameSourceImageSequence[0];
        } else {
          frameSourceImageSequence = undefined;
        }
      }
    }
  } else if (SourceImageSequence && SourceImageSequence.length !== 0) {
    console.warn('DerivationImageSequence not present, using SourceImageSequence assuming SEG has the same geometry as the source image.');
    frameSourceImageSequence = SourceImageSequence[frameSegment];
  }
  if (frameSourceImageSequence) {
    imageId = getImageIdOfSourceImageBySourceImageSequence(frameSourceImageSequence, sopUIDImageIdIndexMap);
  }
  if (imageId === undefined && ReferencedSeriesSequence) {
    const referencedSeriesSequence = Array.isArray(ReferencedSeriesSequence) ? ReferencedSeriesSequence[0] : ReferencedSeriesSequence;
    const ReferencedSeriesInstanceUID = referencedSeriesSequence.SeriesInstanceUID;
    imageId = getImageIdOfSourceImagebyGeometry(ReferencedSeriesInstanceUID, FrameOfReferenceUID, PerFrameFunctionalGroup, imageIds, metadataProvider, tolerance);
  }
  return imageId;
}

/**
 * Checks if there is any overlapping segmentations.
 *  @returns {boolean} Returns a flag if segmentations overlapping
 */

function checkSEGsOverlapping(pixelData, multiframe, imageIds, validOrientations, metadataProvider, tolerance, TypedArrayConstructor, sopUIDImageIdIndexMap) {
  const SharedFunctionalGroupsSequence = multiframe.SharedFunctionalGroupsSequence,
    PerFrameFunctionalGroupsSequence = multiframe.PerFrameFunctionalGroupsSequence,
    SegmentSequence = multiframe.SegmentSequence,
    Rows = multiframe.Rows,
    Columns = multiframe.Columns;
  let numberOfSegs = SegmentSequence.length;
  if (numberOfSegs < 2) {
    return false;
  }
  const sharedImageOrientationPatient = SharedFunctionalGroupsSequence.PlaneOrientationSequence ? SharedFunctionalGroupsSequence.PlaneOrientationSequence.ImageOrientationPatient : undefined;
  const sliceLength = Columns * Rows;
  const groupsLen = PerFrameFunctionalGroupsSequence.length;

  /** sort groupsLen to have all the segments for each frame in an array
   * frame 2 : 1, 2
   * frame 4 : 1, 3
   * frame 5 : 4
   */

  let frameSegmentsMapping = new Map();
  for (let frameSegment = 0; frameSegment < groupsLen; ++frameSegment) {
    const segmentIndex = getSegmentIndex(multiframe, frameSegment);
    if (segmentIndex === undefined) {
      console.warn('Could not retrieve the segment index for frame segment ' + frameSegment + ', skipping this frame.');
      continue;
    }
    const imageId = findReferenceSourceImageId(multiframe, frameSegment, imageIds, metadataProvider, tolerance, sopUIDImageIdIndexMap);
    if (!imageId) {
      console.warn("Image not present in stack, can't import frame : " + frameSegment + '.');
      continue;
    }
    const imageIdIndex = imageIds.findIndex(element => element === imageId);
    if (frameSegmentsMapping.has(imageIdIndex)) {
      let segmentArray = frameSegmentsMapping.get(imageIdIndex);
      if (!segmentArray.includes(frameSegment)) {
        segmentArray.push(frameSegment);
        frameSegmentsMapping.set(imageIdIndex, segmentArray);
      }
    } else {
      frameSegmentsMapping.set(imageIdIndex, [frameSegment]);
    }
  }
  for (let _ref2 of frameSegmentsMapping.entries()) {
    var _ref3 = (0,slicedToArray/* ["default"] */.A)(_ref2, 2);
    let role = _ref3[1];
    let temp2DArray = new TypedArrayConstructor(sliceLength).fill(0);
    for (let i = 0; i < role.length; ++i) {
      const frameSegment = role[i];
      const PerFrameFunctionalGroups = PerFrameFunctionalGroupsSequence[frameSegment];
      const ImageOrientationPatientI = sharedImageOrientationPatient || PerFrameFunctionalGroups.PlaneOrientationSequence.ImageOrientationPatient;
      const view = readFromUnpackedChunks(pixelData, frameSegment * sliceLength, sliceLength);
      const pixelDataI2D = ndarray(view, [Rows, Columns]);
      const alignedPixelDataI = Segmentation_4X_alignPixelDataWithSourceData(pixelDataI2D, ImageOrientationPatientI, validOrientations, tolerance);
      if (!alignedPixelDataI) {
        console.warn('Individual SEG frames are out of plane with respect to the first SEG frame, this is not yet supported, skipping this frame.');
        continue;
      }
      const data = alignedPixelDataI.data;
      for (let j = 0, len = data.length; j < len; ++j) {
        if (data[j] !== 0) {
          temp2DArray[j]++;
          if (temp2DArray[j] > 1) {
            return true;
          }
        }
      }
    }
  }
  return false;
}
function insertOverlappingPixelDataPlanar(segmentsOnFrame, segmentsOnFrameArray, labelmapBufferArray, pixelData, multiframe, imageIds, validOrientations, metadataProvider, tolerance, TypedArrayConstructor, segmentsPixelIndices, sopUIDImageIdIndexMap) {
  const SharedFunctionalGroupsSequence = multiframe.SharedFunctionalGroupsSequence,
    PerFrameFunctionalGroupsSequence = multiframe.PerFrameFunctionalGroupsSequence,
    Rows = multiframe.Rows,
    Columns = multiframe.Columns;
  const sharedImageOrientationPatient = SharedFunctionalGroupsSequence.PlaneOrientationSequence ? SharedFunctionalGroupsSequence.PlaneOrientationSequence.ImageOrientationPatient : undefined;
  const sliceLength = Columns * Rows;
  const arrayBufferLength = sliceLength * imageIds.length * TypedArrayConstructor.BYTES_PER_ELEMENT;
  // indicate the number of labelMaps
  let M = 1;

  // indicate the current labelMap array index;
  let m = 0;

  // temp array for checking overlaps
  let tempBuffer = labelmapBufferArray[m].slice(0);

  // temp list for checking overlaps
  let tempSegmentsOnFrame = structuredClone(segmentsOnFrameArray[m]);

  /** split overlapping SEGs algorithm for each segment:
   *  A) copy the labelmapBuffer in the array with index 0
   *  B) add the segment pixel per pixel on the copied buffer from (A)
   *  C) if no overlap, copy the results back on the orignal array from (A)
   *  D) if overlap, repeat increasing the index m up to M (if out of memory, add new buffer in the array and M++);
   */

  let numberOfSegs = multiframe.SegmentSequence.length;
  for (let segmentIndexToProcess = 1; segmentIndexToProcess <= numberOfSegs; ++segmentIndexToProcess) {
    for (let i = 0, groupsLen = PerFrameFunctionalGroupsSequence.length; i < groupsLen; ++i) {
      const PerFrameFunctionalGroups = PerFrameFunctionalGroupsSequence[i];
      const segmentIndex = getSegmentIndex(multiframe, i);
      if (segmentIndex === undefined) {
        throw new Error('Could not retrieve the segment index. Aborting segmentation loading.');
      }
      if (segmentIndex !== segmentIndexToProcess) {
        continue;
      }
      const ImageOrientationPatientI = sharedImageOrientationPatient || PerFrameFunctionalGroups.PlaneOrientationSequence.ImageOrientationPatient;

      // Since we moved to the chunks approach, we need to read the data
      // and handle scenarios where the portion of data is in one chunk
      // and the other portion is in another chunk
      const view = readFromUnpackedChunks(pixelData, i * sliceLength, sliceLength);
      const pixelDataI2D = ndarray(view, [Rows, Columns]);
      const alignedPixelDataI = Segmentation_4X_alignPixelDataWithSourceData(pixelDataI2D, ImageOrientationPatientI, validOrientations, tolerance);
      if (!alignedPixelDataI) {
        throw new Error('Individual SEG frames are out of plane with respect to the first SEG frame. ' + 'This is not yet supported. Aborting segmentation loading.');
      }
      const imageId = findReferenceSourceImageId(multiframe, i, imageIds, metadataProvider, tolerance, sopUIDImageIdIndexMap);
      if (!imageId) {
        console.warn("Image not present in stack, can't import frame : " + i + '.');
        continue;
      }
      const sourceImageMetadata = metadataProvider.get('instance', imageId);
      if (Rows !== sourceImageMetadata.Rows || Columns !== sourceImageMetadata.Columns) {
        throw new Error('Individual SEG frames have different geometry dimensions (Rows and Columns) ' + 'respect to the source image reference frame. This is not yet supported. ' + 'Aborting segmentation loading. ');
      }
      const imageIdIndex = imageIds.findIndex(element => element === imageId);
      const byteOffset = sliceLength * imageIdIndex * TypedArrayConstructor.BYTES_PER_ELEMENT;
      const labelmap2DView = new TypedArrayConstructor(tempBuffer, byteOffset, sliceLength);
      const data = alignedPixelDataI.data;
      let segmentOnFrame = false;
      for (let j = 0, len = alignedPixelDataI.data.length; j < len; ++j) {
        if (data[j]) {
          if (labelmap2DView[j] !== 0) {
            m++;
            if (m >= M) {
              labelmapBufferArray[m] = new ArrayBuffer(arrayBufferLength);
              segmentsOnFrameArray[m] = [];
              M++;
            }
            tempBuffer = labelmapBufferArray[m].slice(0);
            tempSegmentsOnFrame = structuredClone(segmentsOnFrameArray[m]);
            i = 0;
            break;
          } else {
            labelmap2DView[j] = segmentIndex;
            segmentOnFrame = true;
          }
        }
      }
      if (segmentOnFrame) {
        if (!tempSegmentsOnFrame[imageIdIndex]) {
          tempSegmentsOnFrame[imageIdIndex] = [];
        }
        tempSegmentsOnFrame[imageIdIndex].push(segmentIndex);
        if (!segmentsOnFrame[imageIdIndex]) {
          segmentsOnFrame[imageIdIndex] = [];
        }
        segmentsOnFrame[imageIdIndex].push(segmentIndex);
      }
    }
    labelmapBufferArray[m] = tempBuffer.slice(0);
    segmentsOnFrameArray[m] = structuredClone(tempSegmentsOnFrame);

    // reset temp variables/buffers for new segment
    m = 0;
    tempBuffer = labelmapBufferArray[m].slice(0);
    tempSegmentsOnFrame = structuredClone(segmentsOnFrameArray[m]);
  }
}
function getReferencedSegmentNumberFromIdentificationSequence(segmentIdentificationSequence) {
  if (!segmentIdentificationSequence) {
    return undefined;
  }
  const normalized = Array.isArray(segmentIdentificationSequence) ? segmentIdentificationSequence[0] : segmentIdentificationSequence;
  return normalized === null || normalized === void 0 ? void 0 : normalized.ReferencedSegmentNumber;
}
function getSharedFunctionalGroupsSequence(multiframe) {
  const shared = multiframe === null || multiframe === void 0 ? void 0 : multiframe.SharedFunctionalGroupsSequence;
  if (Array.isArray(shared)) {
    return shared.length > 0 ? shared[0] : undefined;
  }
  return shared;
}
const getSegmentIndex = (multiframe, frame) => {
  const PerFrameFunctionalGroupsSequence = multiframe.PerFrameFunctionalGroupsSequence;
  const PerFrameFunctionalGroups = PerFrameFunctionalGroupsSequence === null || PerFrameFunctionalGroupsSequence === void 0 ? void 0 : PerFrameFunctionalGroupsSequence[frame];
  const fromPerFrame = getReferencedSegmentNumberFromIdentificationSequence(PerFrameFunctionalGroups === null || PerFrameFunctionalGroups === void 0 ? void 0 : PerFrameFunctionalGroups.SegmentIdentificationSequence);
  if (fromPerFrame !== undefined) {
    return fromPerFrame;
  }
  const shared = getSharedFunctionalGroupsSequence(multiframe);
  return getReferencedSegmentNumberFromIdentificationSequence(shared === null || shared === void 0 ? void 0 : shared.SegmentIdentificationSequence);
};
function insertPixelDataPlanar(segmentsOnFrame, segmentsOnFrameArray, labelmapBufferArray, pixelData, multiframe, imageIds, validOrientations, metadataProvider, tolerance, TypedArrayConstructor, segmentsPixelIndices, sopUIDImageIdIndexMap, imageIdMaps, eventTarget, triggerEvent) {
  const SharedFunctionalGroupsSequence = multiframe.SharedFunctionalGroupsSequence,
    PerFrameFunctionalGroupsSequence = multiframe.PerFrameFunctionalGroupsSequence,
    Rows = multiframe.Rows,
    Columns = multiframe.Columns;
  const sharedImageOrientationPatient = SharedFunctionalGroupsSequence.PlaneOrientationSequence ? SharedFunctionalGroupsSequence.PlaneOrientationSequence.ImageOrientationPatient : undefined;
  const sliceLength = Columns * Rows;
  let i = 0;
  const groupsLen = PerFrameFunctionalGroupsSequence.length;
  const chunkSize = Math.ceil(groupsLen / 10); // 10% of total length

  const shouldTriggerEvent = triggerEvent && eventTarget;
  let overlapping = false;
  // Below, we chunk the processing of the frames to avoid blocking the main thread
  // if the segmentation is large. We also use a promise to allow the caller to
  // wait for the processing to finish.
  return new Promise(resolve => {
    function processInChunks() {
      // process one chunk
      for (let end = Math.min(i + chunkSize, groupsLen); i < end; ++i) {
        const PerFrameFunctionalGroups = PerFrameFunctionalGroupsSequence[i];
        const ImageOrientationPatientI = sharedImageOrientationPatient || PerFrameFunctionalGroups.PlaneOrientationSequence.ImageOrientationPatient;
        const view = readFromUnpackedChunks(pixelData, i * sliceLength, sliceLength);
        const pixelDataI2D = ndarray(view, [Rows, Columns]);
        const alignedPixelDataI = Segmentation_4X_alignPixelDataWithSourceData(pixelDataI2D, ImageOrientationPatientI, validOrientations, tolerance);
        if (!alignedPixelDataI) {
          throw new Error('Individual SEG frames are out of plane with respect to the first SEG frame. ' + 'This is not yet supported. Aborting segmentation loading.');
        }
        const segmentIndex = getSegmentIndex(multiframe, i);
        if (segmentIndex === undefined) {
          throw new Error('Could not retrieve the segment index. Aborting segmentation loading.');
        }
        if (!segmentsPixelIndices.has(segmentIndex)) {
          segmentsPixelIndices.set(segmentIndex, {});
        }
        const imageId = findReferenceSourceImageId(multiframe, i, imageIds, metadataProvider, tolerance, sopUIDImageIdIndexMap);
        if (!imageId) {
          console.warn("Image not present in stack, can't import frame : " + i + '.');
          continue;
        }
        const sourceImageMetadata = imageIdMaps.metadata[imageId];
        if (Rows !== sourceImageMetadata.Rows || Columns !== sourceImageMetadata.Columns) {
          throw new Error('Individual SEG frames have different geometry dimensions (Rows and Columns) ' + 'respect to the source image reference frame. This is not yet supported. ' + 'Aborting segmentation loading. ');
        }
        const imageIdIndex = imageIdMaps.indices[imageId];
        const byteOffset = sliceLength * imageIdIndex * TypedArrayConstructor.BYTES_PER_ELEMENT;
        const labelmap2DView = new TypedArrayConstructor(labelmapBufferArray[0], byteOffset, sliceLength);
        const data = alignedPixelDataI.data;
        const indexCache = [];
        for (let j = 0, len = alignedPixelDataI.data.length; j < len; ++j) {
          if (data[j]) {
            for (let x = j; x < len; ++x) {
              if (data[x]) {
                if (!overlapping && labelmap2DView[x] !== 0) {
                  overlapping = true;
                }
                labelmap2DView[x] = segmentIndex;
                indexCache.push(x);
              }
            }
            if (!segmentsOnFrame[imageIdIndex]) {
              segmentsOnFrame[imageIdIndex] = [];
            }
            segmentsOnFrame[imageIdIndex].push(segmentIndex);
            break;
          }
        }
        const segmentIndexObject = segmentsPixelIndices.get(segmentIndex);
        segmentIndexObject[imageIdIndex] = indexCache;
        segmentsPixelIndices.set(segmentIndex, segmentIndexObject);
      }

      // trigger an event after each chunk
      if (shouldTriggerEvent) {
        const percentComplete = Math.round(i / groupsLen * 100);
        triggerEvent(eventTarget, Events_Events.SEGMENTATION_LOAD_PROGRESS, {
          percentComplete
        });
      }

      // schedule next chunk
      if (i < groupsLen) {
        setTimeout(processInChunks, 0);
      } else {
        // resolve the Promise when all chunks have been processed
        resolve(overlapping);
      }
    }
    processInChunks();
  });
}

/**
 * unpackPixelData - Unpacks bit packed pixelData if the Segmentation is BINARY.
 *
 * @param  {Object} multiframe The multiframe dataset.
 * @param  {Object} options    Options for the unpacking.
 * @return {Uint8Array}      The unpacked pixelData.
 */
function Segmentation_4X_unpackPixelData(multiframe, options) {
  const segType = multiframe.SegmentationType;
  let data;
  if (Array.isArray(multiframe.PixelData)) {
    data = multiframe.PixelData[0];
  } else {
    data = multiframe.PixelData;
  }
  if (data === undefined) {
    dcmjs_es/* .log.error */.Rm.error('This segmentation pixelData is undefined.');
  }
  if (segType === 'BINARY') {
    // For extreme big data, we can't unpack the data at once and we need to
    // chunk it and unpack each chunk separately.
    // MAX 2GB is the limit right now to allocate a buffer
    return getUnpackedChunks(data, options.maxBytesPerChunk);
  }
  if (segType === 'LABELMAP') {
    // For LABELMAP, we can return the data as is, since it is already in a
    // format that Cornerstone can handle. Also here we are returning the
    // whole data at once, since the storage is more efficent than BINARY mode
    if (multiframe.BitsStored === 8) {
      return new Uint8Array(data);
    } else if (multiframe.BitsStored === 16) {
      return new Uint16Array(data);
    } else {
      return new Uint8Array(data);
    }
  }
  const pixelData = new Uint8Array(data);
  const max = multiframe.MaximumFractionalValue;
  const onlyMaxAndZero = pixelData.find(element => element !== 0 && element !== max) === undefined;
  if (!onlyMaxAndZero) {
    // This is a fractional segmentation, which is not currently supported.
    return;
  }
  dcmjs_es/* .log.warn */.Rm.warn('This segmentation object is actually binary... processing as such.');
  return pixelData;
}
function getUnpackedChunks(data, maxBytesPerChunk) {
  var bitArray = new Uint8Array(data);
  var chunks = [];
  var maxBitsPerChunk = maxBytesPerChunk * 8;
  var numberOfChunks = Math.ceil(bitArray.length * 8 / maxBitsPerChunk);
  for (var i = 0; i < numberOfChunks; i++) {
    var startBit = i * maxBitsPerChunk;
    var endBit = Math.min(startBit + maxBitsPerChunk, bitArray.length * 8);
    var startByte = Math.floor(startBit / 8);
    var endByte = Math.ceil(endBit / 8);
    var chunk = bitArray.slice(startByte, endByte);
    var unpackedChunk = Segmentation_4X_BitArray.unpack(chunk);
    chunks.push(unpackedChunk);
  }
  return chunks;
}

/**
 * getImageIdOfSourceImageBySourceImageSequence - Returns the Cornerstone imageId of the source image.
 *
 * @param  {Object}   SourceImageSequence  Sequence describing the source image.
 * @param  {String[]} imageIds             A list of imageIds.
 * @param  {Object}   sopUIDImageIdIndexMap A map of SOPInstanceUIDs to imageIds.
 * @return {String}                        The corresponding imageId.
 */
function getImageIdOfSourceImageBySourceImageSequence(SourceImageSequence, sopUIDImageIdIndexMap) {
  const ReferencedSOPInstanceUID = SourceImageSequence.ReferencedSOPInstanceUID,
    ReferencedFrameNumber = SourceImageSequence.ReferencedFrameNumber;
  const baseImageId = sopUIDImageIdIndexMap[ReferencedSOPInstanceUID];
  if (!baseImageId) {
    console.warn("No imageId found for SOPInstanceUID: ".concat(ReferencedSOPInstanceUID));
    return undefined;
  }
  if (ReferencedFrameNumber !== undefined) {
    if (baseImageId.includes('frames/')) {
      return baseImageId.replace(/frames\/\d+/, "frames/".concat(ReferencedFrameNumber));
    } else if (baseImageId.includes('dicomfile:')) {
      // dicomfile base 1, despite having frame=
      return baseImageId.replace(/frame=\d+/, "frame=".concat(ReferencedFrameNumber));
    } else if (baseImageId.includes('frame=') || baseImageId.includes('wadouri:')) {
      // OHIF local/wadouri use 1-based ?frame= / &frame= (same as dicomfile:).
      return baseImageId.replace(/frame=\d+/, "frame=".concat(ReferencedFrameNumber));
    } else {
      if (baseImageId.includes('wadors:')) {
        return "".concat(baseImageId, "/frames/").concat(ReferencedFrameNumber);
      } else {
        return "".concat(baseImageId, "?frame=").concat(ReferencedFrameNumber);
      }
    }
  }
  return baseImageId;
}

/**
 * Determines if an image is a multiframe image based on its metadata.
 *
 * @param {Object} imageMetadata - The metadata object for the image
 * @param {number} [imageMetadata.NumberOfFrames] - The number of frames in the image
 * @returns {boolean} True if the image is a multiframe image (NumberOfFrames > 1)
 */
function isMultiframeImage(imageMetadata) {
  return imageMetadata && imageMetadata.NumberOfFrames > 1;
}

/**
 * getImageIdOfSourceImagebyGeometry - Returns the Cornerstone imageId of the source image.
 *
 * @param  {String}    ReferencedSeriesInstanceUID    Referenced series of the source image.
 * @param  {String}    FrameOfReferenceUID            Frame of reference.
 * @param  {Object}    PerFrameFunctionalGroup        Sequence describing segmentation reference attributes per frame.
 * @param  {String[]}  imageIds                       A list of imageIds.
 * @param  {Object}    sopUIDImageIdIndexMap          A map of SOPInstanceUIDs to imageIds.
 * @param  {Float}     tolerance                      The tolerance parameter
 *
 * @return {String}                                   The corresponding imageId.
 */
function getImageIdOfSourceImagebyGeometry(ReferencedSeriesInstanceUID, FrameOfReferenceUID, PerFrameFunctionalGroup, imageIds, metadataProvider, tolerance) {
  var _PerFrameFunctionalGr;
  if (!ReferencedSeriesInstanceUID || !((_PerFrameFunctionalGr = PerFrameFunctionalGroup.PlanePositionSequence) !== null && _PerFrameFunctionalGr !== void 0 && (_PerFrameFunctionalGr = _PerFrameFunctionalGr[0]) !== null && _PerFrameFunctionalGr !== void 0 && _PerFrameFunctionalGr.ImagePositionPatient)) {
    return undefined;
  }
  const segFramePosition = PerFrameFunctionalGroup.PlanePositionSequence[0].ImagePositionPatient;
  for (let imageId of imageIds) {
    const sourceImageMetadata = metadataProvider.get('instance', imageId);
    if (!sourceImageMetadata) {
      continue;
    }
    const isMultiframe = isMultiframeImage(sourceImageMetadata);
    if (!sourceImageMetadata.ImagePositionPatient || sourceImageMetadata.FrameOfReferenceUID !== FrameOfReferenceUID || sourceImageMetadata.SeriesInstanceUID !== ReferencedSeriesInstanceUID) {
      continue;
    }

    // For multiframe images, check each frame's position
    if (isMultiframe) {
      var _metadataProvider$get2;
      const framePosition = (_metadataProvider$get2 = metadataProvider.get('imagePlaneModule', imageId)) === null || _metadataProvider$get2 === void 0 ? void 0 : _metadataProvider$get2.imagePositionPatient;
      if (framePosition && esm.utilities.isEqual(segFramePosition, framePosition, tolerance)) {
        return imageId;
      }
    } else if (esm.utilities.isEqual(segFramePosition, sourceImageMetadata.ImagePositionPatient, tolerance)) {
      return imageId;
    }
  }
  return undefined;
}

/**
 * getValidOrientations - returns an array of valid orientations.
 *
 * @param  {Number[6]} iop The row (0..2) an column (3..5) direction cosines.
 * @return {Number[8][6]} An array of valid orientations.
 */
function Segmentation_4X_getValidOrientations(iop) {
  const orientations = [];

  // [0,  1,  2]: 0,   0hf,   0vf
  // [3,  4,  5]: 90,  90hf,  90vf
  // [6, 7]:      180, 270

  orientations[0] = iop;
  orientations[1] = Segmentation_4X_flipIOP.h(iop);
  orientations[2] = Segmentation_4X_flipIOP.v(iop);
  const iop90 = Segmentation_4X_rotateDirectionCosinesInPlane(iop, Math.PI / 2);
  orientations[3] = iop90;
  orientations[4] = Segmentation_4X_flipIOP.h(iop90);
  orientations[5] = Segmentation_4X_flipIOP.v(iop90);
  orientations[6] = Segmentation_4X_rotateDirectionCosinesInPlane(iop, Math.PI);
  orientations[7] = Segmentation_4X_rotateDirectionCosinesInPlane(iop, 1.5 * Math.PI);
  return orientations;
}

/**
 * alignPixelDataWithSourceData -
 *
 * @param {Ndarray} pixelData2D - The data to align.
 * @param {Number[6]} iop - The orientation of the image slice.
 * @param {Number[8][6]} orientations - An array of valid imageOrientationPatient values.
 * @param {Number} tolerance.
 * @return {Ndarray} The aligned pixelData.
 */
function Segmentation_4X_alignPixelDataWithSourceData(pixelData2D, iop, orientations, tolerance) {
  if (esm.utilities.isEqual(iop, orientations[0], tolerance)) {
    return pixelData2D;
  } else if (esm.utilities.isEqual(iop, orientations[1], tolerance)) {
    // Flipped vertically.

    // Undo Flip
    return Segmentation_4X_flipMatrix2D.v(pixelData2D);
  } else if (esm.utilities.isEqual(iop, orientations[2], tolerance)) {
    // Flipped horizontally.

    // Unfo flip
    return Segmentation_4X_flipMatrix2D.h(pixelData2D);
  } else if (esm.utilities.isEqual(iop, orientations[3], tolerance)) {
    //Rotated 90 degrees

    // Rotate back
    return Segmentation_4X_rotateMatrix902D(pixelData2D);
  } else if (esm.utilities.isEqual(iop, orientations[4], tolerance)) {
    //Rotated 90 degrees and fliped horizontally.

    // Undo flip and rotate back.
    return Segmentation_4X_rotateMatrix902D(Segmentation_4X_flipMatrix2D.h(pixelData2D));
  } else if (esm.utilities.isEqual(iop, orientations[5], tolerance)) {
    // Rotated 90 degrees and fliped vertically

    // Unfo flip and rotate back.
    return Segmentation_4X_rotateMatrix902D(Segmentation_4X_flipMatrix2D.v(pixelData2D));
  } else if (esm.utilities.isEqual(iop, orientations[6], tolerance)) {
    // Rotated 180 degrees. // TODO -> Do this more effeciently, there is a 1:1 mapping like 90 degree rotation.

    return Segmentation_4X_rotateMatrix902D(Segmentation_4X_rotateMatrix902D(pixelData2D));
  } else if (esm.utilities.isEqual(iop, orientations[7], tolerance)) {
    // Rotated 270 degrees

    // Rotate back.
    return Segmentation_4X_rotateMatrix902D(Segmentation_4X_rotateMatrix902D(Segmentation_4X_rotateMatrix902D(pixelData2D)));
  }
}
function Segmentation_4X_getSegmentMetadata(multiframe, seriesInstanceUid) {
  const segmentSequence = multiframe.SegmentSequence;
  let data = [];
  if (Array.isArray(segmentSequence)) {
    data = [undefined, ...segmentSequence];
  } else {
    // Only one segment, will be stored as an object.
    data = [undefined, segmentSequence];
  }
  return {
    seriesInstanceUid,
    data
  };
}

/**
 * Reads a range of SAMPLES (typed-array elements, not bytes) from an array of
 * typed-array chunks and aggregates them into a new typed array of the same
 * element type. Chunks may be Uint8Array (8-bit / packed binary) or
 * Uint16Array (16-bit labelmaps); offsets and lengths are in elements so the
 * same sample-indexed math works for both widths.
 *
 * @param {Uint8Array[]|Uint16Array[]} chunks - Typed-array chunks (all the same type).
 * @param {number} offset - The offset of the first sample to read.
 * @param {number} length - The number of samples to read.
 * @returns {Uint8Array|Uint16Array} A view/copy containing the requested samples.
 */
function readFromUnpackedChunks(chunks, offset, length) {
  var _chunks$0$constructor, _chunks$, _TypedArray$BYTES_PER;
  const mapping = getUnpackedOffsetAndLength(chunks, offset, length);
  const TypedArray = (_chunks$0$constructor = (_chunks$ = chunks[0]) === null || _chunks$ === void 0 ? void 0 : _chunks$.constructor) !== null && _chunks$0$constructor !== void 0 ? _chunks$0$constructor : Uint8Array;
  const bytesPerElement = (_TypedArray$BYTES_PER = TypedArray.BYTES_PER_ELEMENT) !== null && _TypedArray$BYTES_PER !== void 0 ? _TypedArray$BYTES_PER : 1;

  // Chunks are typically subarray views that share one backing ArrayBuffer, so
  // `chunk.buffer` is the whole buffer (byte 0 = chunk 0) while the computed
  // offsets are chunk-relative. Add each chunk's own byteOffset so a view into
  // chunk N reads chunk N's bytes and not chunk 0's; element offsets are scaled
  // by the chunk's element width so 16-bit chunks are not read as bytes.
  // If all the data is in one chunk, we can just slice that chunk
  if (mapping.start.chunkIndex === mapping.end.chunkIndex) {
    const chunk = chunks[mapping.start.chunkIndex];
    return new TypedArray(chunk.buffer, chunk.byteOffset + mapping.start.offset * bytesPerElement, length);
  } else {
    // If the data spans multiple chunks, we need to create a new typed array and copy the data from each chunk
    let result = new TypedArray(length);
    let resultOffset = 0;
    for (let i = mapping.start.chunkIndex; i <= mapping.end.chunkIndex; i++) {
      let start = i === mapping.start.chunkIndex ? mapping.start.offset : 0;
      let end = i === mapping.end.chunkIndex ? mapping.end.offset : chunks[i].length;
      result.set(new TypedArray(chunks[i].buffer, chunks[i].byteOffset + start * bytesPerElement, end - start), resultOffset);
      resultOffset += end - start;
    }
    return result;
  }
}
function getUnpackedOffsetAndLength(chunks, offset, length) {
  var totalBytes = chunks.reduce((total, chunk) => total + chunk.length, 0);
  if (offset < 0 || offset + length > totalBytes) {
    throw new Error('Offset and length out of bounds');
  }
  var startChunkIndex = 0;
  var startOffsetInChunk = offset;
  while (startOffsetInChunk >= chunks[startChunkIndex].length) {
    startOffsetInChunk -= chunks[startChunkIndex].length;
    startChunkIndex++;
  }
  var endChunkIndex = startChunkIndex;
  var endOffsetInChunk = startOffsetInChunk + length;
  while (endOffsetInChunk > chunks[endChunkIndex].length) {
    endOffsetInChunk -= chunks[endChunkIndex].length;
    endChunkIndex++;
  }
  return {
    start: {
      chunkIndex: startChunkIndex,
      offset: startOffsetInChunk
    },
    end: {
      chunkIndex: endChunkIndex,
      offset: endOffsetInChunk
    }
  };
}
function calculateCentroid(imageIdIndexBufferIndex, multiframe, metadataProvider, imageIds) {
  let xAcc = 0;
  let yAcc = 0;
  let zAcc = 0;
  let worldXAcc = 0;
  let worldYAcc = 0;
  let worldZAcc = 0;
  let count = 0;
  for (const _ref4 of Object.entries(imageIdIndexBufferIndex)) {
    var _ref5 = (0,slicedToArray/* ["default"] */.A)(_ref4, 2);
    const imageIdIndex = _ref5[0];
    const bufferIndices = _ref5[1];
    const z = Number(imageIdIndex);
    if (!bufferIndices || bufferIndices.length === 0) {
      continue;
    }

    // Get metadata for this slice
    const imageId = imageIds[z];
    const imagePlaneModule = metadataProvider.get('imagePlaneModule', imageId);
    if (!imagePlaneModule) {
      console.debug('Missing imagePlaneModule metadata for centroid calculation');
      continue;
    }
    const imagePositionPatient = imagePlaneModule.imagePositionPatient,
      rowCosines = imagePlaneModule.rowCosines,
      columnCosines = imagePlaneModule.columnCosines,
      rowPixelSpacing = imagePlaneModule.rowPixelSpacing,
      columnPixelSpacing = imagePlaneModule.columnPixelSpacing;
    for (const bufferIndex of bufferIndices) {
      const y = Math.floor(bufferIndex / multiframe.Rows);
      const x = bufferIndex % multiframe.Rows;

      // Image coordinates
      xAcc += x;
      yAcc += y;
      zAcc += z;

      // Calculate world coordinates
      // P(world) = P(image) * IOP * spacing + IPP
      const worldX = imagePositionPatient[0] + x * rowCosines[0] * columnPixelSpacing + y * columnCosines[0] * rowPixelSpacing;
      const worldY = imagePositionPatient[1] + x * rowCosines[1] * columnPixelSpacing + y * columnCosines[1] * rowPixelSpacing;
      const worldZ = imagePositionPatient[2] + x * rowCosines[2] * columnPixelSpacing + y * columnCosines[2] * rowPixelSpacing;
      worldXAcc += worldX;
      worldYAcc += worldY;
      worldZAcc += worldZ;
      count++;
    }
  }
  return {
    image: {
      x: Math.floor(xAcc / count),
      y: Math.floor(yAcc / count),
      z: Math.floor(zAcc / count)
    },
    world: {
      x: worldXAcc / count,
      y: worldYAcc / count,
      z: worldZAcc / count
    },
    count
  };
}
const Segmentation_4X_Segmentation = {
  generateSegmentation: Segmentation_4X_generateSegmentation,
  generateToolState: Segmentation_4X_generateToolState,
  fillSegmentation
};



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/Segmentation.js



/**
 * generateSegmentation - Generates a DICOM Segmentation object given cornerstoneTools data.
 *
 * @param  {object[]} images    An array of the cornerstone image objects.
 * @param  {Object|Object[]} labelmaps3DorBrushData For 4.X: The cornerstone `Labelmap3D` object, or an array of objects.
 *                                                  For 3.X: the BrushData.
 * @param  {number} cornerstoneToolsVersion The cornerstoneTools major version to map against.
 * @returns {Object}
 */
function Segmentation_generateSegmentation(images, labelmaps3DorBrushData) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    includeSliceSpacing: true
  };
  let cornerstoneToolsVersion = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 4;
  if (cornerstoneToolsVersion === 4) {
    return Segmentation_4X_Segmentation.generateSegmentation(images, labelmaps3DorBrushData, options);
  }
  if (cornerstoneToolsVersion === 3) {
    return Segmentation.generateSegmentation(images, labelmaps3DorBrushData, options);
  }
  console.warn("No generateSegmentation adapter for cornerstone version ".concat(cornerstoneToolsVersion, ", exiting."));
}

/**
 * generateToolState - Given a set of cornerstoneTools imageIds and a Segmentation buffer,
 * derive cornerstoneTools toolState and brush metadata.
 *
 * @param  {string[]} imageIds    An array of the imageIds.
 * @param  {ArrayBuffer} arrayBuffer The SEG arrayBuffer.
 * @param {*} metadataProvider
 * @param  {boolean} skipOverlapping - skip checks for overlapping segs, default value false.
 * @param  {number} tolerance - default value 1.e-3.
 * @param  {number} cornerstoneToolsVersion - default value 4.
 *
 * @returns {Object}  The toolState and an object from which the
 *                    segment metadata can be derived.
 */
function Segmentation_generateToolState(imageIds, arrayBuffer, metadataProvider) {
  let skipOverlapping = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  let tolerance = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1e-3;
  let cornerstoneToolsVersion = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 4;
  if (cornerstoneToolsVersion === 4) {
    return Segmentation_4X_Segmentation.generateToolState(imageIds, arrayBuffer, metadataProvider, skipOverlapping, tolerance);
  }
  if (cornerstoneToolsVersion === 3) {
    return Segmentation.generateToolState(imageIds, arrayBuffer, metadataProvider);
  }
  console.warn("No generateToolState adapter for cornerstone version ".concat(cornerstoneToolsVersion, ", exiting."));
}

/**
 * fillSegmentation - Fills a derived segmentation dataset with cornerstoneTools `LabelMap3D` data.
 *
 * @param  {object[]} segmentation An empty segmentation derived dataset.
 * @param  {Object|Object[]} inputLabelmaps3D The cornerstone `Labelmap3D` object, or an array of objects.
 * @param  {Object} userOptions Options object to override default options.
 * @returns {Blob}           description
 */
function Segmentation_fillSegmentation(segmentation, inputLabelmaps3D) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    includeSliceSpacing: true
  };
  let cornerstoneToolsVersion = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 4;
  if (cornerstoneToolsVersion === 4) {
    return Segmentation_4X_Segmentation.fillSegmentation(segmentation, inputLabelmaps3D, options);
  }
  console.warn("No generateSegmentation adapter for cornerstone version ".concat(cornerstoneToolsVersion, ", exiting."));
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/ParametricMap.js




const ParametricMap_DicomMessage = dcmjs_es/* .data.DicomMessage */.p.DicomMessage,
  ParametricMap_DicomMetaDictionary = dcmjs_es/* .data.DicomMetaDictionary */.p.DicomMetaDictionary;
const ParametricMap_Normalizer = dcmjs_es/* .normalizers.Normalizer */.z8.Normalizer;
async function ParametricMap_generateToolState(imageIds, arrayBuffer, metadataProvider) {
  let tolerance = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1e-3;
  const dicomData = ParametricMap_DicomMessage.readFile(arrayBuffer);
  const dataset = ParametricMap_DicomMetaDictionary.naturalizeDataset(dicomData.dict);
  dataset._meta = ParametricMap_DicomMetaDictionary.namifyDataset(dicomData.meta);
  const multiframe = ParametricMap_Normalizer.normalizeToDataset([dataset]);
  const imagePlaneModule = metadataProvider.get('imagePlaneModule', imageIds[0]);
  if (!imagePlaneModule) {
    console.warn('Insufficient metadata, imagePlaneModule missing.');
  }
  const ImageOrientationPatient = Array.isArray(imagePlaneModule.rowCosines) ? [...imagePlaneModule.rowCosines, ...imagePlaneModule.columnCosines] : [imagePlaneModule.rowCosines.x, imagePlaneModule.rowCosines.y, imagePlaneModule.rowCosines.z, imagePlaneModule.columnCosines.x, imagePlaneModule.columnCosines.y, imagePlaneModule.columnCosines.z];
  const validOrientations = [ImageOrientationPatient];
  const pixelData = getPixelData(multiframe);
  const orientation = checkOrientation(multiframe, validOrientations, [imagePlaneModule.rows, imagePlaneModule.columns, imageIds.length], tolerance);
  const sopUIDImageIdIndexMap = imageIds.reduce((acc, imageId) => {
    const _metadataProvider$get = metadataProvider.get('generalImageModule', imageId),
      sopInstanceUID = _metadataProvider$get.sopInstanceUID;
    acc[sopInstanceUID] = imageId;
    return acc;
  }, {});
  if (orientation !== 'Planar') {
    const orientationText = {
      Perpendicular: 'orthogonal',
      Oblique: 'oblique'
    };
    throw new Error("Parametric maps ".concat(orientationText[orientation], " to the acquisition plane of the source data are not yet supported."));
  }
  const imageIdMaps = imageIds.reduce((acc, curr, index) => {
    acc.indices[curr] = index;
    acc.metadata[curr] = metadataProvider.get('instance', curr);
    return acc;
  }, {
    indices: {},
    metadata: {}
  });
  await ParametricMap_insertPixelDataPlanar(pixelData, multiframe, imageIds, metadataProvider, tolerance, sopUIDImageIdIndexMap, imageIdMaps);
  return {
    pixelData
  };
}
function ParametricMap_insertPixelDataPlanar(sourcePixelData, multiframe, imageIds, metadataProvider, tolerance, sopUIDImageIdIndexMap, imageIdMaps) {
  const targetPixelData = new sourcePixelData.constructor(sourcePixelData.length);
  const PerFrameFunctionalGroupsSequence = multiframe.PerFrameFunctionalGroupsSequence,
    Rows = multiframe.Rows,
    Columns = multiframe.Columns;
  const sliceLength = Columns * Rows;
  const numSlices = PerFrameFunctionalGroupsSequence.length;
  for (let i = 0; i < numSlices; i++) {
    const sourceSliceDataView = new sourcePixelData.constructor(sourcePixelData.buffer, i * sliceLength, sliceLength);
    const imageId = ParametricMap_findReferenceSourceImageId(multiframe, i, imageIds, metadataProvider, tolerance, sopUIDImageIdIndexMap);
    if (!imageId) {
      console.warn("Image not present in stack, can't import frame : " + i + '.');
      continue;
    }
    const sourceImageMetadata = imageIdMaps.metadata[imageId];
    if (Rows !== sourceImageMetadata.Rows || Columns !== sourceImageMetadata.Columns) {
      throw new Error('Parametric map have different geometry dimensions (Rows and Columns) ' + 'respect to the source image reference frame. This is not yet supported.');
    }
    const imageIdIndex = imageIdMaps.indices[imageId];
    const byteOffset = sliceLength * imageIdIndex * targetPixelData.BYTES_PER_ELEMENT;
    const targetSliceDataView = new targetPixelData.constructor(targetPixelData.buffer, byteOffset, sliceLength);
    targetSliceDataView.set(sourceSliceDataView);
  }
  return targetPixelData;
}
function getPixelData(multiframe) {
  let TypedArrayClass;
  let data;
  if (multiframe.PixelData) {
    var _multiframe$PixelRepr;
    const validTypedArrays = multiframe.BitsAllocated === 16 ? [Uint16Array, Int16Array] : [Uint32Array, Int32Array];
    TypedArrayClass = validTypedArrays[(_multiframe$PixelRepr = multiframe.PixelRepresentation) !== null && _multiframe$PixelRepr !== void 0 ? _multiframe$PixelRepr : 0];
    data = multiframe.PixelData;
  } else if (multiframe.FloatPixelData) {
    TypedArrayClass = Float32Array;
    data = multiframe.FloatPixelData;
  } else if (multiframe.DoubleFloatPixelData) {
    TypedArrayClass = Float64Array;
    data = multiframe.DoubleFloatPixelData;
  }
  if (data === undefined) {
    dcmjs_es/* .log.error */.Rm.error('This parametric map pixel data is undefined.');
  }
  if (Array.isArray(data)) {
    data = data[0];
  }
  return new TypedArrayClass(data);
}
function ParametricMap_findReferenceSourceImageId(multiframe, frameSegment, imageIds, metadataProvider, tolerance, sopUIDImageIdIndexMap) {
  let imageId = undefined;
  if (!multiframe) {
    return imageId;
  }
  const FrameOfReferenceUID = multiframe.FrameOfReferenceUID,
    PerFrameFunctionalGroupsSequence = multiframe.PerFrameFunctionalGroupsSequence,
    SourceImageSequence = multiframe.SourceImageSequence,
    ReferencedSeriesSequence = multiframe.ReferencedSeriesSequence;
  if (!PerFrameFunctionalGroupsSequence || PerFrameFunctionalGroupsSequence.length === 0) {
    return imageId;
  }
  const PerFrameFunctionalGroup = PerFrameFunctionalGroupsSequence[frameSegment];
  if (!PerFrameFunctionalGroup) {
    return imageId;
  }
  let frameSourceImageSequence = undefined;
  if (PerFrameFunctionalGroup.DerivationImageSequence) {
    let DerivationImageSequence = PerFrameFunctionalGroup.DerivationImageSequence;
    if (Array.isArray(DerivationImageSequence)) {
      if (DerivationImageSequence.length !== 0) {
        DerivationImageSequence = DerivationImageSequence[0];
      } else {
        DerivationImageSequence = undefined;
      }
    }
    if (DerivationImageSequence) {
      frameSourceImageSequence = DerivationImageSequence.SourceImageSequence;
      if (Array.isArray(frameSourceImageSequence)) {
        if (frameSourceImageSequence.length !== 0) {
          frameSourceImageSequence = frameSourceImageSequence[0];
        } else {
          frameSourceImageSequence = undefined;
        }
      }
    }
  } else if (SourceImageSequence && SourceImageSequence.length !== 0) {
    console.warn('DerivationImageSequence not present, using SourceImageSequence assuming SEG has the same geometry as the source image.');
    frameSourceImageSequence = SourceImageSequence[frameSegment];
  }
  if (frameSourceImageSequence) {
    imageId = ParametricMap_getImageIdOfSourceImageBySourceImageSequence(frameSourceImageSequence, sopUIDImageIdIndexMap);
  }
  if (imageId === undefined && ReferencedSeriesSequence) {
    const referencedSeriesSequence = Array.isArray(ReferencedSeriesSequence) ? ReferencedSeriesSequence[0] : ReferencedSeriesSequence;
    const ReferencedSeriesInstanceUID = referencedSeriesSequence.SeriesInstanceUID;
    imageId = ParametricMap_getImageIdOfSourceImagebyGeometry(ReferencedSeriesInstanceUID, FrameOfReferenceUID, PerFrameFunctionalGroup, imageIds, metadataProvider, tolerance);
  }
  return imageId;
}
function ParametricMap_getImageIdOfSourceImageBySourceImageSequence(SourceImageSequence, sopUIDImageIdIndexMap) {
  const ReferencedSOPInstanceUID = SourceImageSequence.ReferencedSOPInstanceUID,
    ReferencedFrameNumber = SourceImageSequence.ReferencedFrameNumber;
  return ReferencedFrameNumber ? ParametricMap_getImageIdOfReferencedFrame(ReferencedSOPInstanceUID, ReferencedFrameNumber, sopUIDImageIdIndexMap) : sopUIDImageIdIndexMap[ReferencedSOPInstanceUID];
}
function ParametricMap_getImageIdOfSourceImagebyGeometry(ReferencedSeriesInstanceUID, FrameOfReferenceUID, PerFrameFunctionalGroup, imageIds, metadataProvider, tolerance) {
  if (ReferencedSeriesInstanceUID === undefined || PerFrameFunctionalGroup.PlanePositionSequence === undefined || PerFrameFunctionalGroup.PlanePositionSequence[0] === undefined || PerFrameFunctionalGroup.PlanePositionSequence[0].ImagePositionPatient === undefined) {
    return undefined;
  }
  for (let imageIdsIndex = 0; imageIdsIndex < imageIds.length; ++imageIdsIndex) {
    const sourceImageMetadata = metadataProvider.get('instance', imageIds[imageIdsIndex]);
    if (sourceImageMetadata === undefined || sourceImageMetadata.ImagePositionPatient === undefined || sourceImageMetadata.FrameOfReferenceUID !== FrameOfReferenceUID || sourceImageMetadata.SeriesInstanceUID !== ReferencedSeriesInstanceUID) {
      continue;
    }
    if (esm.utilities.isEqual(PerFrameFunctionalGroup.PlanePositionSequence[0].ImagePositionPatient, sourceImageMetadata.ImagePositionPatient, tolerance)) {
      return imageIds[imageIdsIndex];
    }
  }
}
function ParametricMap_getImageIdOfReferencedFrame(sopInstanceUid, frameNumber, sopUIDImageIdIndexMap) {
  const imageId = sopUIDImageIdIndexMap[sopInstanceUid];
  if (!imageId) {
    return;
  }
  const imageIdFrameNumber = Number(imageId.split('frame=')[1]);
  return imageIdFrameNumber === frameNumber - 1 ? imageId : undefined;
}
const ParametricMapObj = {
  generateToolState: ParametricMap_generateToolState
};



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/index.js













const CornerstoneSR = {
  Length: Length,
  FreehandRoi: FreehandRoi,
  Bidirectional: Bidirectional,
  EllipticalRoi: EllipticalRoi,
  CircleRoi: CircleRoi,
  ArrowAnnotate: ArrowAnnotate,
  MeasurementReport: MeasurementReport,
  CobbAngle: CobbAngle,
  Angle: Angle,
  RectangleRoi: RectangleRoi
};
const CornerstoneSEG = {
  Segmentation: Segmentation_namespaceObject
};
const CornerstonePMAP = {
  ParametricMap: ParametricMapObj
};



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/cornerstone3DTag.js
var CORNERSTONE_3D_TAG = 'Cornerstone3DTools@^0.1.0';



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/copyStudyTags.js
const patientTags = ['PatientName', 'PatientID', 'PatientBirthDate', 'PatientBirthTime', 'IssuerOfPatientID', 'OtherPatientIDs', 'OtherPatientIDsSequence', 'PatientSex', 'PatientIdentityRemoved', 'DeidentificationMethodCodeSequence'];
const copyStudyTags_studyTags = ['StudyDate', 'StudyTime', 'StudyStatusID', 'StudyPriorityID', 'StudyInstanceUID', 'StudyDescription', 'AccessionNumber', 'StudyID', 'ReferringPhysicianName', 'TimezoneOffsetFromUTC'];
const patientStudyTags = [...patientTags, ...copyStudyTags_studyTags];
function copyStudyTags(src) {
  const study = {
    _meta: src._meta,
    _vrMap: src._vrMap
  };
  for (const tagKey of patientStudyTags) {
    const value = src[tagKey];
    if (value === undefined) {
      continue;
    }
    study[tagKey] = value;
  }
  return study;
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/copySeriesTags.js
const copySeriesTags_seriesTags = ['SeriesInstanceUID', 'SeriesNumber', 'SeriesDescription', 'Modality', 'SeriesDate', 'SeriesTime', '_meta', '_vrMap'];
function copySeriesTags(src) {
  const result = {};
  for (const tagKey of copySeriesTags_seriesTags) {
    const value = src[tagKey];
    if (value === undefined) {
      continue;
    }
    result[tagKey] = value;
  }
  return result;
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/toPoint3.js
function toPoint3(flatPoints) {
  const points = [];
  if (!(flatPoints !== null && flatPoints !== void 0 && flatPoints.length)) {
    return points;
  }
  const n = flatPoints.length;
  if (n % 3 !== 0) {
    throw new Error("Points array should be divisible by 3 for SCOORD3D, but contents are: ".concat(JSON.stringify(flatPoints), " of length ").concat(n));
  }
  for (let i = 0; i < n; i += 3) {
    points.push([flatPoints[i], flatPoints[i + 1], flatPoints[i + 2]]);
  }
  return points;
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/CodingScheme.js
// This is a custom coding scheme defined to store some annotations from Cornerstone.
// Note: CodeMeaning is VR type LO, which means we only actually support 64 characters
// here this is fine for most labels, but may be problematic at some point.
const CodingScheme_CORNERSTONEFREETEXT = 'CORNERSTONEFREETEXT';

// Cornerstone specified coding scheme for storing findings
const CodingScheme_CodingSchemeDesignator = 'CORNERSTONEJS';
const CodingScheme = {
  CodingSchemeDesignator: CodingScheme_CodingSchemeDesignator,
  codeValues: {
    CORNERSTONEFREETEXT: CodingScheme_CORNERSTONEFREETEXT
  }
};



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/constants/index.js


function constants_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function constants_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? constants_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : constants_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const NO_IMAGE_ID = 'none';
const CS3D_DESIGNATOR = '99CS3D';
const TEXT_ANNOTATION_POSITION = {
  schemeDesignator: CS3D_DESIGNATOR,
  meaning: 'Text Annotation Position',
  value: 'TextPosition'
};
const CONTROL_POINTS_CODE = {
  schemeDesignator: CS3D_DESIGNATOR,
  meaning: 'Control Points',
  value: 'ControlPoints'
};
const SPLINE_TYPE_CODE = {
  schemeDesignator: CS3D_DESIGNATOR,
  meaning: 'Spline Type',
  value: 'SplineType'
};
const COMMENT_CODE = {
  schemeDesignator: 'DCM',
  meaning: 'Comment',
  value: '121106'
};
const fileMetaInformationVersionArray1 = new Uint8Array(2);
fileMetaInformationVersionArray1[1] = 1;
const fileMetaInformationVersionArray2 = new Uint8Array(2);
fileMetaInformationVersionArray2[1] = 2;
const ImplementationClassUidSRAnnotation = '2.25.2470123695996825859949881583571202391.1.0.1';
const ImplementationClassRtssContours = '2.25.2470123695996825859949881583571202391.2.0.1';
const constants_fileMetaInformationVersionArray = new Uint8Array(2);
constants_fileMetaInformationVersionArray[1] = 1;
const metaSRAnnotation = {
  FileMetaInformationVersion: {
    Value: [fileMetaInformationVersionArray2.buffer],
    vr: 'OB'
  },
  TransferSyntaxUID: {
    Value: ['1.2.840.10008.1.2'],
    vr: 'UI'
  },
  ImplementationClassUID: {
    Value: [ImplementationClassUidSRAnnotation],
    vr: 'UI'
  },
  ImplementationVersionName: {
    Value: ['cs3d-4.8.4'],
    vr: 'SH'
  }
};
const metaRTSSContour = constants_objectSpread(constants_objectSpread({}, metaSRAnnotation), {}, {
  ImplementationClassUID: {
    Value: [ImplementationClassRtssContours],
    vr: 'UI'
  }
});



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/LabelData.js






const _dcmjs$sr = dcmjs_es/* ["default"].sr */.Ay.sr,
  valueTypes = _dcmjs$sr.valueTypes,
  coding = _dcmjs$sr.coding,
  Cornerstone3D = dcmjs_es/* ["default"].adapters.Cornerstone3D */.Ay.adapters.Cornerstone3D;
class LabelData {
  constructor(tid300Item, annotation) {
    this.tid300Item = tid300Item;
    this.annotation = annotation;
    this.ReferencedSOPSequence = tid300Item.ReferencedSOPSequence;
  }
  contentItem() {
    var _handles$textBox;
    const contentEntries = this.tid300Item.contentItem();
    this.fixScoordRelationships(contentEntries);
    const _this$annotation$data = this.annotation.data,
      label = _this$annotation$data.label,
      handles = _this$annotation$data.handles;
    if (label) {
      contentEntries.push(this.createQualitativeLabel(label));
      this.filterCornerstoneFreeText(contentEntries);
    }
    if (handles !== null && handles !== void 0 && (_handles$textBox = handles.textBox) !== null && _handles$textBox !== void 0 && _handles$textBox.hasMoved) {
      contentEntries.push(this.createQualitativeLabelPosition(this.annotation));
    }
    return contentEntries;
  }
  fixScoordRelationships(contentEntries) {
    const INFERRED_FROM = valueTypes.RelationshipTypes.INFERRED_FROM;
    for (const entry of contentEntries) {
      const item = entry;
      const contentSeq = item.ContentSequence;
      const children = this.normalizeContentSequence(contentSeq);
      for (const child of children) {
        if ((child.ValueType === 'SCOORD' || child.ValueType === 'SCOORD3D') && (child.RelationshipType === 'CONTAINS' || child.RelationshipType === 'Contains')) {
          child.RelationshipType = INFERRED_FROM;
        }
      }
    }
  }
  normalizeContentSequence(contentSeq) {
    if (!contentSeq) return [];
    if (Array.isArray(contentSeq)) return contentSeq;
    return [contentSeq];
  }
  filterCornerstoneFreeText(contentEntries) {
    const codeValues = Cornerstone3D.CodeScheme.codeValues;
    const freeTextCodes = [codeValues.FREE_TEXT_CODE_VALUE, codeValues.CORNERSTONEFREETEXT];
    for (let i = 0; i < contentEntries.length; i++) {
      const group = contentEntries[i];
      if (!group.ConceptCodeSequence) {
        continue;
      }
      const csLabel = group.ConceptCodeSequence.findIndex(item => freeTextCodes.includes(item.CodeValue));
      if (csLabel !== -1) {
        group.ConceptCodeSequence.splice(csLabel, 1);
        if (group.ConceptCodeSequence.length === 0) {
          contentEntries.splice(i, 1);
        }
        return;
      }
    }
  }
  createQualitativeLabel(label) {
    const relationshipType = valueTypes.RelationshipTypes.CONTAINS;
    return new valueTypes.TextContentItem({
      name: new coding.CodedConcept(COMMENT_CODE),
      relationshipType,
      value: label
    });
  }
  createQualitativeLabelPosition(annotation) {
    const textBox = annotation.data.handles.textBox;
    const _annotation$metadata = annotation.metadata,
      referencedImageId = _annotation$metadata.referencedImageId,
      frameOfReferenceUID = _annotation$metadata.FrameOfReferenceUID;
    const is3DMeasurement = !referencedImageId;
    const _toScoord = toScoord({
        is3DMeasurement,
        referencedImageId
      }, textBox.worldPosition),
      x = _toScoord.x,
      y = _toScoord.y,
      z = _toScoord.z;
    const graphicType = valueTypes.GraphicTypes.POINT;
    const relationshipType = valueTypes.RelationshipTypes.CONTAINS;
    const name = new coding.CodedConcept(TEXT_ANNOTATION_POSITION);
    const scoord = is3DMeasurement ? new valueTypes.Scoord3DContentItem({
      name,
      relationshipType,
      graphicType,
      graphicData: [x, y, z],
      frameOfReferenceUID
    }) : new valueTypes.ScoordContentItem({
      name,
      relationshipType,
      graphicType,
      graphicData: [x, y]
    });
    scoord.ContentSequence = [{
      RelationshipType: valueTypes.RelationshipTypes.SELECTED_FROM,
      ValueType: valueTypes.ValueTypes.IMAGE,
      ReferencedSOPSequence: this.ReferencedSOPSequence
    }];
    return scoord;
  }
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/MeasurementReport.js
















var _MeasurementReport;
function MeasurementReport_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function MeasurementReport_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? MeasurementReport_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : MeasurementReport_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const MeasurementReport_MetadataModules = esm.Enums.MetadataModules;
const MeasurementReport_TID1500 = dcmjs_es/* .utilities.TID1500 */.BF.TID1500,
  MeasurementReport_addAccessors = dcmjs_es/* .utilities.addAccessors */.BF.addAccessors;
const MeasurementReport_StructuredReport = dcmjs_es/* .derivations.StructuredReport */.h4.StructuredReport;
const MeasurementReport_Normalizer = dcmjs_es/* .normalizers.Normalizer */.z8.Normalizer;
const MeasurementReport_TID1500MeasurementReport = MeasurementReport_TID1500.TID1500MeasurementReport,
  MeasurementReport_TID1501MeasurementGroup = MeasurementReport_TID1500.TID1501MeasurementGroup;
const MeasurementReport_DicomMetaDictionary = dcmjs_es/* .data.DicomMetaDictionary */.p.DicomMetaDictionary;
const MeasurementReport_FINDING = {
  CodingSchemeDesignator: 'DCM',
  CodeValue: '121071'
};
const COMMENT = {
  CodingSchemeDesignator: COMMENT_CODE.schemeDesignator,
  CodeValue: COMMENT_CODE.value
};
const COMMENT_POSITION = {
  CodingSchemeDesignator: TEXT_ANNOTATION_POSITION.schemeDesignator,
  CodeValue: TEXT_ANNOTATION_POSITION.value
};
const CONTROL_POINTS = {
  CodingSchemeDesignator: CONTROL_POINTS_CODE.schemeDesignator,
  CodeValue: CONTROL_POINTS_CODE.value
};
const MeasurementReport_FINDING_SITE = {
  CodingSchemeDesignator: 'SCT',
  CodeValue: '363698007'
};
const MeasurementReport_FINDING_SITE_OLD = {
  CodingSchemeDesignator: 'SRT',
  CodeValue: 'G-C0E3'
};
function isSecondaryScoordGroup(group) {
  if (group.ValueType !== 'SCOORD' && group.ValueType !== 'SCOORD3D') {
    return false;
  }
  const conceptNameCodeSequence = group.ConceptNameCodeSequence;
  const conceptCode = Array.isArray(conceptNameCodeSequence) ? conceptNameCodeSequence[0] : conceptNameCodeSequence;
  return !!conceptCode && conceptCode.CodingSchemeDesignator === CONTROL_POINTS.CodingSchemeDesignator && conceptCode.CodeValue === CONTROL_POINTS.CodeValue;
}
class MeasurementReport_MeasurementReport {
  static getTID300ContentItem(tool, ReferencedSOPSequence, toolClass, is3DMeasurement) {
    const args = toolClass.getTID300RepresentationArguments(tool, is3DMeasurement);
    args.ReferencedSOPSequence = ReferencedSOPSequence;
    if (args.use3DSpatialCoordinates) {
      args.ReferencedFrameOfReferenceUID = tool.metadata.FrameOfReferenceUID;
    }
    const tid300Measurement = new toolClass.TID300Representation(args);
    const labelMeasurement = new LabelData(tid300Measurement, tool);
    return labelMeasurement;
  }
  static getMeasurementGroup(toolType, toolData, ReferencedSOPSequence, is3DMeasurement) {
    const toolTypeData = toolData[toolType];
    const toolClass = this.measurementAdapterByToolType.get(toolType);
    if (!toolTypeData || !toolTypeData.data || !toolTypeData.data.length || !toolClass) {
      return;
    }
    const Measurements = toolTypeData.data.map(tool => {
      return this.getTID300ContentItem(tool, ReferencedSOPSequence, toolClass, is3DMeasurement);
    });
    return new MeasurementReport_TID1501MeasurementGroup(Measurements);
  }
  static getCornerstoneLabelFromDefaultState(defaultState) {
    const _defaultState$finding = defaultState.findingSites,
      findingSites = _defaultState$finding === void 0 ? [] : _defaultState$finding,
      finding = defaultState.finding,
      commentGroup = defaultState.commentGroup;
    if (commentGroup !== null && commentGroup !== void 0 && commentGroup.TextValue) {
      return commentGroup.TextValue;
    }
    const cornersoneFreeTextCodingValue = CodingScheme.codeValues.CORNERSTONEFREETEXT;
    const freeTextLabel = findingSites.find(fs => fs.CodeValue === cornersoneFreeTextCodingValue);
    if (freeTextLabel) {
      return freeTextLabel.CodeMeaning;
    }
    if (finding && finding.CodeValue === cornersoneFreeTextCodingValue) {
      return finding.CodeMeaning;
    }
  }
  static generateDatasetMeta() {
    return metaSRAnnotation;
  }
  static processSCOORDGroup(_ref) {
    let SCOORDGroup = _ref.SCOORDGroup,
      toolType = _ref.toolType,
      sopInstanceUIDToImageIdMap = _ref.sopInstanceUIDToImageIdMap,
      metadata = _ref.metadata;
    const ReferencedSOPSequence = SCOORDGroup.ContentSequence.ReferencedSOPSequence;
    const ReferencedSOPInstanceUID = ReferencedSOPSequence.ReferencedSOPInstanceUID,
      _ReferencedSOPSequenc = ReferencedSOPSequence.ReferencedFrameNumber,
      ReferencedFrameNumber = _ReferencedSOPSequenc === void 0 ? 1 : _ReferencedSOPSequenc;
    const referencedImageId = sopInstanceUIDToImageIdMap["".concat(ReferencedSOPInstanceUID, ":").concat(ReferencedFrameNumber)];
    const imagePlaneModule = metadata.get('imagePlaneModule', referencedImageId);
    const annotationUID = MeasurementReport_DicomMetaDictionary.uid();
    return {
      SCOORDGroup,
      ReferencedSOPSequence,
      ReferencedSOPInstanceUID,
      ReferencedFrameNumber,
      referencedImageId,
      state: {
        description: undefined,
        sopInstanceUid: ReferencedSOPInstanceUID,
        annotation: {
          data: {
            annotationUID,
            cachedStats: {},
            handles: {
              activeHandleIndex: 0,
              textBox: {
                hasMoved: false
              }
            }
          },
          annotationUID,
          metadata: {
            toolName: toolType,
            referencedImageId,
            FrameOfReferenceUID: imagePlaneModule.frameOfReferenceUID
          }
        }
      }
    };
  }
  static processSCOORD3DGroup(_ref2) {
    let SCOORD3DGroup = _ref2.SCOORD3DGroup,
      toolType = _ref2.toolType;
    const annotationUID = MeasurementReport_DicomMetaDictionary.uid();
    const toolData = {
      SCOORD3DGroup,
      FrameOfReferenceUID: SCOORD3DGroup.ReferencedFrameOfReferenceUID,
      state: {
        description: undefined,
        annotation: {
          annotationUID,
          data: {
            annotationUID,
            cachedStats: {},
            handles: {
              activeHandleIndex: 0,
              textBox: {
                hasMoved: false
              }
            }
          },
          metadata: {
            toolName: toolType,
            FrameOfReferenceUID: SCOORD3DGroup.ReferencedFrameOfReferenceUID
          }
        }
      }
    };
    esm.utilities.updatePlaneRestriction(toPoint3(SCOORD3DGroup.GraphicData), toolData.state.annotation.metadata);
    return toolData;
  }
  static getSpatialCoordinatesState(_ref3) {
    var _contentSequenceArr$f, _contentSequenceArr$f2;
    let NUMGroup = _ref3.NUMGroup,
      sopInstanceUIDToImageIdMap = _ref3.sopInstanceUIDToImageIdMap,
      metadata = _ref3.metadata,
      toolType = _ref3.toolType;
    const contentSequenceArr = toArray(NUMGroup.ContentSequence);
    const SCOORDGroup = (_contentSequenceArr$f = contentSequenceArr.find(group => group.ValueType === 'SCOORD' && !isSecondaryScoordGroup(group))) !== null && _contentSequenceArr$f !== void 0 ? _contentSequenceArr$f : contentSequenceArr.find(group => group.ValueType === 'SCOORD');
    const SCOORD3DGroup = (_contentSequenceArr$f2 = contentSequenceArr.find(group => group.ValueType === 'SCOORD3D' && !isSecondaryScoordGroup(group))) !== null && _contentSequenceArr$f2 !== void 0 ? _contentSequenceArr$f2 : contentSequenceArr.find(group => group.ValueType === 'SCOORD3D');
    const result = SCOORD3DGroup && this.processSCOORD3DGroup({
      SCOORD3DGroup,
      toolType
    }) || SCOORDGroup && this.processSCOORDGroup({
      SCOORDGroup,
      toolType,
      metadata,
      sopInstanceUIDToImageIdMap
    });
    if (!result) {
      throw new Error('No spatial coordinates group found.');
    }
    return result;
  }
  static processSpatialCoordinatesGroup(_ref4) {
    let NUMGroup = _ref4.NUMGroup,
      sopInstanceUIDToImageIdMap = _ref4.sopInstanceUIDToImageIdMap,
      metadata = _ref4.metadata,
      findingGroup = _ref4.findingGroup,
      findingSiteGroups = _ref4.findingSiteGroups,
      commentGroup = _ref4.commentGroup,
      commentPositionGroup = _ref4.commentPositionGroup,
      controlPointsGroup = _ref4.controlPointsGroup,
      toolType = _ref4.toolType;
    const _this$getSpatialCoord = this.getSpatialCoordinatesState({
        NUMGroup,
        sopInstanceUIDToImageIdMap,
        metadata,
        toolType
      }),
      state = _this$getSpatialCoord.state,
      SCOORDGroup = _this$getSpatialCoord.SCOORDGroup,
      ReferencedSOPSequence = _this$getSpatialCoord.ReferencedSOPSequence,
      ReferencedSOPInstanceUID = _this$getSpatialCoord.ReferencedSOPInstanceUID,
      ReferencedFrameNumber = _this$getSpatialCoord.ReferencedFrameNumber,
      SCOORD3DGroup = _this$getSpatialCoord.SCOORD3DGroup,
      FrameOfReferenceUID = _this$getSpatialCoord.FrameOfReferenceUID,
      referencedImageId = _this$getSpatialCoord.referencedImageId,
      textBoxPosition = _this$getSpatialCoord.textBoxPosition;
    const finding = findingGroup ? MeasurementReport_addAccessors(findingGroup.ConceptCodeSequence) : undefined;
    const findingSites = findingSiteGroups.map(fsg => {
      return MeasurementReport_addAccessors(fsg.ConceptCodeSequence);
    });
    if (commentPositionGroup) {
      state.commentPositionGroup = commentPositionGroup;
      const textBoxCoords = scoordToWorld({
        is3DMeasurement: !referencedImageId,
        referencedImageId
      }, commentPositionGroup);
      state.annotation.data.handles.textBox = {
        hasMoved: true,
        worldPosition: textBoxCoords[0]
      };
    }
    if (controlPointsGroup) {
      const controlPoints = scoordToWorld({
        is3DMeasurement: !referencedImageId,
        referencedImageId
      }, controlPointsGroup);
      state.annotation.data.handles.points = controlPoints;
    }
    state.finding = finding;
    state.findingSites = findingSites;
    state.commentGroup = commentGroup;
    state.commentPositionGroup = commentPositionGroup;
    if (finding) {
      state.description = finding.CodeMeaning;
    }
    state.annotation.data.label = this.getCornerstoneLabelFromDefaultState(state);
    return {
      defaultState: state,
      state,
      NUMGroup,
      scoord: SCOORD3DGroup || SCOORDGroup,
      SCOORDGroup,
      ReferencedSOPSequence,
      ReferencedSOPInstanceUID,
      referencedImageId,
      textBoxPosition,
      ReferencedFrameNumber,
      SCOORD3DGroup,
      FrameOfReferenceUID
    };
  }
  static getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, toolType) {
    const ContentSequence = MeasurementGroup.ContentSequence;
    const contentSequenceArr = toArray(ContentSequence);
    const findingGroup = contentSequenceArr.find(group => this.codeValueMatch(group, MeasurementReport_FINDING));
    const commentGroup = contentSequenceArr.find(group => this.codeValueMatch(group, COMMENT));
    const commentPositionGroup = contentSequenceArr.find(group => this.codeValueMatch(group, COMMENT_POSITION));
    let controlPointsGroup = contentSequenceArr.find(group => this.codeValueMatch(group, CONTROL_POINTS));
    const NUMGroupForLookup = contentSequenceArr.find(group => group.ValueType === 'NUM');
    if (!controlPointsGroup && NUMGroupForLookup !== null && NUMGroupForLookup !== void 0 && NUMGroupForLookup.ContentSequence) {
      controlPointsGroup = toArray(NUMGroupForLookup.ContentSequence).find(item => this.codeValueMatch(item, CONTROL_POINTS));
    }
    const findingSiteGroups = contentSequenceArr.filter(group => this.codeValueMatch(group, MeasurementReport_FINDING_SITE, MeasurementReport_FINDING_SITE_OLD)) || [];
    const NUMGroup = NUMGroupForLookup || {
      ContentSequence: contentSequenceArr.filter(group => group.ValueType === 'SCOORD' || group.ValueType === 'SCOORD3D')
    };
    const spatialGroup = this.processSpatialCoordinatesGroup({
      NUMGroup,
      sopInstanceUIDToImageIdMap,
      metadata,
      findingGroup,
      findingSiteGroups,
      commentGroup,
      commentPositionGroup,
      controlPointsGroup,
      toolType
    });
    const referencedImageId = spatialGroup.state.annotation.metadata.referencedImageId;
    const is3DMeasurement = !!spatialGroup.SCOORD3DGroup;
    const scoordArgs = {
      referencedImageId,
      is3DMeasurement
    };
    const scoord = spatialGroup.SCOORD3DGroup || spatialGroup.SCOORDGroup;
    const worldCoords = scoordToWorld(scoordArgs, scoord);
    return MeasurementReport_objectSpread(MeasurementReport_objectSpread({}, spatialGroup), {}, {
      is3DMeasurement,
      scoordArgs,
      scoord,
      worldCoords
    });
  }
  static generateReferencedSOPSequence(_ref5) {
    let toolData = _ref5.toolData,
      toolTypes = _ref5.toolTypes,
      metadataProvider = _ref5.metadataProvider,
      imageId = _ref5.imageId,
      sopInstanceUIDsToSeriesInstanceUIDMap = _ref5.sopInstanceUIDsToSeriesInstanceUIDMap,
      derivationSourceDatasets = _ref5.derivationSourceDatasets;
    const effectiveImageId = imageId === NO_IMAGE_ID ? this.getImageIdFromVolume({
      toolData,
      toolTypes
    }) : imageId;
    const sopCommonModule = metadataProvider.get('sopCommonModule', effectiveImageId);
    const instance = metadataProvider.get('instance', effectiveImageId);
    const sopInstanceUID = sopCommonModule.sopInstanceUID,
      sopClassUID = sopCommonModule.sopClassUID;
    const seriesInstanceUID = instance.SeriesInstanceUID;
    sopInstanceUIDsToSeriesInstanceUIDMap[sopInstanceUID] = seriesInstanceUID;
    if (!derivationSourceDatasets.find(dsd => dsd.SeriesInstanceUID === seriesInstanceUID)) {
      const derivationSourceDataset = MeasurementReport_MeasurementReport.generateDerivationSourceDataset(instance);
      derivationSourceDatasets.push(derivationSourceDataset);
    }
    const frameNumber = metadataProvider.get('frameNumber', effectiveImageId);
    const ReferencedSOPSequence = {
      ReferencedSOPClassUID: sopClassUID,
      ReferencedSOPInstanceUID: sopInstanceUID,
      ReferencedFrameNumber: undefined
    };
    if (instance && instance.NumberOfFrames && instance.NumberOfFrames > 1 || MeasurementReport_Normalizer.isMultiframeSOPClassUID(sopClassUID)) {
      ReferencedSOPSequence.ReferencedFrameNumber = frameNumber;
    }
    return ReferencedSOPSequence;
  }
  static getImageIdFromVolume(_ref6) {
    var _toolData$toolTypes$, _referenceToolData$me;
    let toolData = _ref6.toolData,
      toolTypes = _ref6.toolTypes;
    const referenceToolData = toolData === null || toolData === void 0 || (_toolData$toolTypes$ = toolData[toolTypes === null || toolTypes === void 0 ? void 0 : toolTypes[0]]) === null || _toolData$toolTypes$ === void 0 || (_toolData$toolTypes$ = _toolData$toolTypes$.data) === null || _toolData$toolTypes$ === void 0 ? void 0 : _toolData$toolTypes$[0];
    const volumeId = referenceToolData === null || referenceToolData === void 0 || (_referenceToolData$me = referenceToolData.metadata) === null || _referenceToolData$me === void 0 ? void 0 : _referenceToolData$me.volumeId;
    const volume = esm.cache.getVolume(volumeId);
    if (!volume) {
      throw new Error("No volume found for ".concat(volumeId));
    }
    const imageId = volume.imageIds[0];
    return imageId;
  }
  static generateReport(toolState, metadataProvider, options) {
    var _report$dataset;
    let allMeasurementGroups = [];
    const sopInstanceUIDsToSeriesInstanceUIDMap = {};
    const derivationSourceDatasets = [];
    const _meta = MeasurementReport_MeasurementReport.generateDatasetMeta();
    let is3DSR = false;
    Object.keys(toolState).forEach(imageId => {
      const toolData = toolState[imageId];
      const toolTypes = Object.keys(toolData);
      const is3DMeasurement = imageId === NO_IMAGE_ID;
      const ReferencedSOPSequence = this.generateReferencedSOPSequence({
        toolData,
        toolTypes,
        metadataProvider,
        imageId,
        sopInstanceUIDsToSeriesInstanceUIDMap,
        derivationSourceDatasets
      });
      if (is3DMeasurement) {
        is3DSR = true;
      }
      const measurementGroups = [];
      toolTypes.forEach(toolType => {
        const group = this.getMeasurementGroup(toolType, toolData, ReferencedSOPSequence, is3DMeasurement);
        if (group) {
          measurementGroups.push(group);
        }
      });
      allMeasurementGroups = allMeasurementGroups.concat(measurementGroups);
    });
    const tid1500MeasurementReport = new MeasurementReport_TID1500MeasurementReport({
      TID1501MeasurementGroups: allMeasurementGroups
    }, options);
    const report = new MeasurementReport_StructuredReport(derivationSourceDatasets, options);
    const contentItem = tid1500MeasurementReport.contentItem(derivationSourceDatasets, MeasurementReport_objectSpread(MeasurementReport_objectSpread({}, options), {}, {
      sopInstanceUIDsToSeriesInstanceUIDMap
    }));
    report.dataset = Object.assign(report.dataset, contentItem);
    report.dataset._meta = _meta;
    report.SpecificCharacterSet = 'ISO_IR 192';
    (_report$dataset = report.dataset).InstanceNumber || (_report$dataset.InstanceNumber = options.InstanceNumber || 1);
    if (options.predecessorImageId) {
      Object.assign(report.dataset, metadataProvider.get(MeasurementReport_MetadataModules.PREDECESSOR_SEQUENCE, options.predecessorImageId));
    }
    if (is3DSR) {
      report.dataset.SOPClassUID = MeasurementReport_DicomMetaDictionary.sopClassUIDsByName.Comprehensive3DSR;
      if (!report.dataset.SOPClassUID) {
        throw new Error("NO sop class defined for Comprehensive3DSR in ".concat(JSON.stringify(MeasurementReport_DicomMetaDictionary.sopClassUIDsByName)));
      }
    }
    return report;
  }
  static generateToolState(dataset, sopInstanceUIDToImageIdMap, metadata, hooks) {
    if (dataset.ContentTemplateSequence.TemplateIdentifier !== '1500') {
      throw new Error('This package can currently only interpret DICOM SR TID 1500');
    }
    const REPORT = 'Imaging Measurements';
    const GROUP = 'Measurement Group';
    const TRACKING_IDENTIFIER = 'Tracking Identifier';
    const TRACKING_UNIQUE_IDENTIFIER = 'Tracking Unique Identifier';
    const predecessorImageId = dataset.imageId;
    const imagingMeasurementContent = toArray(dataset.ContentSequence).find(codeMeaningEquals(REPORT));
    const measurementGroups = toArray(imagingMeasurementContent.ContentSequence).filter(codeMeaningEquals(GROUP));
    const measurementData = {};
    measurementGroups.forEach(measurementGroup => {
      try {
        var _hooks$getToolClass;
        const measurementGroupContentSequence = toArray(measurementGroup.ContentSequence);
        const trackingIdentifierGroup = measurementGroupContentSequence.find(contentItem => contentItem.ConceptNameCodeSequence.CodeMeaning === TRACKING_IDENTIFIER);
        const trackingIdentifierValue = trackingIdentifierGroup.TextValue;
        const trackingUniqueIdentifierGroup = measurementGroupContentSequence.find(contentItem => contentItem.ConceptNameCodeSequence.CodeMeaning === TRACKING_UNIQUE_IDENTIFIER);
        const trackingUniqueIdentifierValue = trackingUniqueIdentifierGroup === null || trackingUniqueIdentifierGroup === void 0 ? void 0 : trackingUniqueIdentifierGroup.UID;
        const toolAdapter = (hooks === null || hooks === void 0 || (_hooks$getToolClass = hooks.getToolClass) === null || _hooks$getToolClass === void 0 ? void 0 : _hooks$getToolClass.call(hooks, measurementGroup, dataset, this.measurementAdapterByToolType)) || this.getAdapterForTrackingIdentifier(trackingIdentifierValue) || this.getAdapterForCodeType(measurementGroup);
        if (toolAdapter) {
          var _toolAdapter$toolType;
          const measurement = toolAdapter.getMeasurementData(measurementGroup, sopInstanceUIDToImageIdMap, metadata, trackingIdentifierValue);
          measurement.TrackingUniqueIdentifier = trackingUniqueIdentifierValue;
          measurement.predecessorImageId = predecessorImageId;
          console.log("=== ".concat(toolAdapter.toolType, " ==="));
          console.log(measurement);
          measurementData[_toolAdapter$toolType = toolAdapter.toolType] || (measurementData[_toolAdapter$toolType] = []);
          measurementData[toolAdapter.toolType].push(measurement);
        }
      } catch (e) {
        console.warn('Unable to generate tool state for', measurementGroup, e);
      }
    });
    return measurementData;
  }
  static registerTool(toolAdapter) {
    let replace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const registerName = toolAdapter.toolType;
    if (this.measurementAdapterByToolType.has(registerName)) {
      if (!replace) {
        throw new Error("The registered tool name ".concat(registerName, " already exists in adapters, use a different toolType or use replace"));
      }
      if (typeof replace === 'function') {
        replace(this.measurementAdapterByToolType.get(registerName));
      }
    }
    this.measurementAdapterByToolType.set(toolAdapter.toolType, toolAdapter);
    this.measurementAdapterByTrackingIdentifier.set(toolAdapter.trackingIdentifierTextValue, toolAdapter);
  }
  static registerTrackingIdentifier(toolClass) {
    for (var _len = arguments.length, trackingIdentifiers = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      trackingIdentifiers[_key - 1] = arguments[_key];
    }
    for (const identifier of trackingIdentifiers) {
      this.measurementAdapterByTrackingIdentifier.set(identifier, toolClass);
    }
  }
  static getAdapterForTrackingIdentifier(trackingIdentifier) {
    const adapter = this.measurementAdapterByTrackingIdentifier.get(trackingIdentifier);
    if (adapter) {
      return adapter;
    }
    for (const adapterTest of [...this.measurementAdapterByToolType.values()]) {
      if (adapterTest.isValidCornerstoneTrackingIdentifier(trackingIdentifier)) {
        this.measurementAdapterByTrackingIdentifier.set(trackingIdentifier, adapterTest);
        return adapterTest;
      }
    }
  }
  static getAdapterForCodeType(measurementGroup) {
    for (const adapter of this.measurementAdapterByTrackingIdentifier.values()) {
      if (adapter.isValidMeasurement(measurementGroup)) {
        return adapter;
      }
    }
  }
  static registerAdapterTypes(adapter) {
    for (var _len2 = arguments.length, types = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      types[_key2 - 1] = arguments[_key2];
    }
    for (const type of types) {
      if (!this.measurementAdaptersByType.has(type)) {
        this.measurementAdaptersByType.set(type, []);
      }
      const adapters = this.measurementAdaptersByType.get(type);
      if (adapters.indexOf(adapter) === -1) {
        adapters.push(adapter);
      }
    }
  }
  static getAdaptersForTypes(graphicCode, graphicType, pointCount) {
    const adapters = [];
    MeasurementReport_appendList(adapters, this.measurementAdaptersByType.get("".concat(graphicCode, "-").concat(graphicType, "-").concat(pointCount)));
    MeasurementReport_appendList(adapters, this.measurementAdaptersByType.get("".concat(graphicCode, "-").concat(graphicType)));
    MeasurementReport_appendList(adapters, this.measurementAdaptersByType.get(graphicCode));
    MeasurementReport_appendList(adapters, this.measurementAdaptersByType.get(graphicType));
    return adapters;
  }
}
_MeasurementReport = MeasurementReport_MeasurementReport;
_MeasurementReport.CORNERSTONE_3D_TAG = CORNERSTONE_3D_TAG;
_MeasurementReport.measurementAdapterByToolType = new Map();
_MeasurementReport.measurementAdaptersByType = new Map();
_MeasurementReport.measurementAdapterByTrackingIdentifier = new Map();
_MeasurementReport.codeValueMatch = (group, code, oldCode) => {
  const ConceptNameCodeSequence = group.ConceptNameCodeSequence;
  if (!ConceptNameCodeSequence) {
    return;
  }
  const seq = Array.isArray(ConceptNameCodeSequence) ? ConceptNameCodeSequence[0] : ConceptNameCodeSequence;
  if (!seq) {
    return;
  }
  const CodingSchemeDesignator = seq.CodingSchemeDesignator,
    CodeValue = seq.CodeValue;
  return CodingSchemeDesignator == code.CodingSchemeDesignator && CodeValue == code.CodeValue || oldCode && CodingSchemeDesignator == oldCode.CodingSchemeDesignator && CodeValue == oldCode.CodeValue;
};
_MeasurementReport.generateDerivationSourceDataset = instance => {
  const studyTags = copyStudyTags(instance);
  const seriesTags = copySeriesTags(instance);
  return MeasurementReport_objectSpread(MeasurementReport_objectSpread({}, studyTags), seriesTags);
};
function MeasurementReport_appendList(list, appendList) {
  if (!(appendList !== null && appendList !== void 0 && appendList.length)) {
    return;
  }
  list.push(...appendList);
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/BaseAdapter3D.js






class BaseAdapter3D {
  static registerType() {
    let code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    let count = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    let key = code;
    if (type) {
      key = "".concat(key).concat(key.length ? '-' : '').concat(type);
    }
    if (count) {
      key = "".concat(key).concat(key.length ? '-' : '').concat(count);
    }
    MeasurementReport_MeasurementReport.registerAdapterTypes(this, key);
  }
  static getPointsCount(graphicItem) {
    const is3DMeasurement = graphicItem.ValueType === 'SCOORD3D';
    const pointSize = is3DMeasurement ? 3 : 2;
    return graphicItem.GraphicData.length / pointSize;
  }
  static getGraphicItems(measurementGroup, filter) {
    const items = measurementGroup.ContentSequence.filter(group => group.ValueType === 'SCOORD' || group.ValueType === 'SCOORD3D');
    return filter ? items.filter(filter) : items;
  }
  static getGraphicItem(measurementGroup) {
    let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    let type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    const items = this.getGraphicItems(measurementGroup, type && (group => group.ValueType === type));
    return items[offset];
  }
  static getGraphicCode(graphicItem) {
    const conceptNameItem = graphicItem.ConceptNameCodeSequence;
    const graphicValue = conceptNameItem.CodeValue,
      graphicDesignator = conceptNameItem.CodingSchemeDesignator;
    return "".concat(graphicDesignator, ":").concat(graphicValue);
  }
  static getGraphicType(graphicItem) {
    return graphicItem.GraphicType;
  }
  static isValidMeasurement(_measurementGroup) {
    return false;
  }
  static init(toolType, representation, options) {
    this.toolType = toolType;
    if (BaseAdapter3D.toolType) {
      throw new Error("Base adapter tool type set to ".concat(this.toolType, " while setting ").concat(toolType));
    }
    this.parentType = options === null || options === void 0 ? void 0 : options.parentType;
    this.trackingIdentifiers = new Set();
    this.TID300Representation = representation;
    if (this.parentType) {
      this.trackingIdentifierTextValue = "".concat(CORNERSTONE_3D_TAG, ":").concat(this.parentType, ":").concat(this.toolType);
      const alternateTrackingIdentifier = "".concat(CORNERSTONE_3D_TAG, ":").concat(this.toolType);
      this.trackingIdentifiers.add(alternateTrackingIdentifier);
    } else {
      this.trackingIdentifierTextValue = "".concat(CORNERSTONE_3D_TAG, ":").concat(toolType);
    }
    this.trackingIdentifiers.add(this.trackingIdentifierTextValue);
    MeasurementReport_MeasurementReport.registerTool(this);
  }
  static registerLegacy() {
    this.trackingIdentifiers.add("cornerstoneTools@^4.0.0:".concat(this.toolType));
  }
  static registerSubType(adapter, toolType, replace) {
    const subAdapter = Object.create(adapter);
    subAdapter.init(toolType, adapter.TID300Representation, {
      parentType: adapter.parentType || adapter.toolType,
      replace
    });
    return subAdapter;
  }
  static isValidCornerstoneTrackingIdentifier(trackingIdentifier) {
    if (this.trackingIdentifiers.has(trackingIdentifier)) {
      return true;
    }
    if (!trackingIdentifier.includes(':')) {
      return false;
    }
    return trackingIdentifier.startsWith(this.trackingIdentifierTextValue);
  }
  static getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, trackingIdentifier) {
    const _MeasurementReport$ge = MeasurementReport_MeasurementReport.getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, this.toolType),
      state = _MeasurementReport$ge.defaultState,
      ReferencedFrameNumber = _MeasurementReport$ge.ReferencedFrameNumber;
    state.annotation.data = {
      cachedStats: {},
      frameNumber: ReferencedFrameNumber,
      seriesLevel: (trackingIdentifier === null || trackingIdentifier === void 0 ? void 0 : trackingIdentifier.indexOf(':Series')) > 0
    };
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    let is3DMeasurement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const metadata = tool.metadata;
    const finding = tool.finding,
      findingSites = tool.findingSites;
    const referencedImageId = metadata.referencedImageId;
    const scoordProps = {
      is3DMeasurement,
      referencedImageId
    };
    const pointsImage = toScoords(scoordProps, tool.data.handles.points);
    const tidArguments = {
      points: pointsImage,
      trackingIdentifierTextValue: this.trackingIdentifierTextValue,
      findingSites: findingSites || [],
      finding,
      ReferencedFrameOfReferenceUID: is3DMeasurement ? metadata.FrameOfReferenceUID : null
    };
    return tidArguments;
  }
  static getCachedStats(cachedStats, metadata) {
    const referencedImageId = metadata.referencedImageId,
      volumeId = metadata.volumeId;
    return cachedStats["imageId:".concat(referencedImageId)] || cachedStats["volumeId:".concat(volumeId)] || {};
  }
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/ArrowAnnotate.js









var _ArrowAnnotate;
function Cornerstone3D_ArrowAnnotate_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function Cornerstone3D_ArrowAnnotate_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? Cornerstone3D_ArrowAnnotate_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : Cornerstone3D_ArrowAnnotate_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const TID300ArrowAnnotate = dcmjs_es/* .utilities.TID300.ArrowAnnotate */.BF.TID300.ArrowAnnotate;
const ArrowAnnotate_imageToWorldCoords = esm.utilities.imageToWorldCoords;
class ArrowAnnotate_ArrowAnnotate extends BaseAdapter3D {
  static getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, _trackingIdentifier) {
    const _MeasurementReport$ge = MeasurementReport_MeasurementReport.getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, this.toolType),
      state = _MeasurementReport$ge.state,
      SCOORDGroup = _MeasurementReport$ge.SCOORDGroup,
      worldCoords = _MeasurementReport$ge.worldCoords,
      referencedImageId = _MeasurementReport$ge.referencedImageId,
      ReferencedFrameNumber = _MeasurementReport$ge.ReferencedFrameNumber;
    const text = state.annotation.data.label;
    if (worldCoords.length === 1 && SCOORDGroup) {
      const imagePixelModule = metadata.get('imagePixelModule', referencedImageId);
      let xOffset = 10;
      let yOffset = 10;
      if (imagePixelModule) {
        const columns = imagePixelModule.columns,
          rows = imagePixelModule.rows;
        xOffset = columns / 10;
        yOffset = rows / 10;
      }
      const GraphicData = SCOORDGroup.GraphicData;
      const secondPoint = ArrowAnnotate_imageToWorldCoords(referencedImageId, [GraphicData[0] + xOffset, GraphicData[1] + yOffset]);
      worldCoords.push(secondPoint);
    }
    state.annotation.data = Cornerstone3D_ArrowAnnotate_objectSpread(Cornerstone3D_ArrowAnnotate_objectSpread({}, state.annotation.data), {}, {
      text,
      handles: Cornerstone3D_ArrowAnnotate_objectSpread(Cornerstone3D_ArrowAnnotate_objectSpread({}, state.annotation.data.handles), {}, {
        arrowFirst: true,
        points: worldCoords
      }),
      frameNumber: ReferencedFrameNumber
    });
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    let is3DMeasurement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const data = tool.data,
      metadata = tool.metadata,
      findingSites = tool.findingSites;
    const finding = tool.finding;
    const referencedImageId = metadata.referencedImageId;
    const scoordProps = {
      is3DMeasurement,
      referencedImageId
    };
    const _data$handles = data.handles,
      points = _data$handles.points,
      arrowFirst = _data$handles.arrowFirst;
    const point = arrowFirst ? points[0] : points[1];
    const point2 = arrowFirst ? points[1] : points[0];
    const pointImage = toScoord(scoordProps, point);
    const pointImage2 = toScoord(scoordProps, point2);
    const TID300RepresentationArguments = {
      points: [pointImage, pointImage2],
      trackingIdentifierTextValue: this.trackingIdentifierTextValue,
      findingSites: findingSites || [],
      finding,
      ReferencedFrameOfReferenceUID: is3DMeasurement ? metadata.FrameOfReferenceUID : null,
      use3DSpatialCoordinates: is3DMeasurement
    };
    return TID300RepresentationArguments;
  }
}
_ArrowAnnotate = ArrowAnnotate_ArrowAnnotate;
(() => {
  _ArrowAnnotate.init('ArrowAnnotate', TID300ArrowAnnotate);
  _ArrowAnnotate.registerLegacy();
})();



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/Bidirectional.js









var _Bidirectional;
function Bidirectional_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function Bidirectional_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? Bidirectional_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : Bidirectional_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const Bidirectional_TID300Bidirectional = dcmjs_es/* .utilities.TID300.Bidirectional */.BF.TID300.Bidirectional;
const Bidirectional_LONG_AXIS = 'Long Axis';
const Bidirectional_SHORT_AXIS = 'Short Axis';
class Bidirectional_Bidirectional extends BaseAdapter3D {
  static getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata) {
    const _MeasurementReport$ge = MeasurementReport_MeasurementReport.getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, this.toolType),
      state = _MeasurementReport$ge.state,
      scoordArgs = _MeasurementReport$ge.scoordArgs,
      referencedImageId = _MeasurementReport$ge.referencedImageId,
      ReferencedFrameNumber = _MeasurementReport$ge.ReferencedFrameNumber;
    const ContentSequence = MeasurementGroup.ContentSequence;
    const longAxisNUMGroup = toArray(ContentSequence).find(group => group.ConceptNameCodeSequence.CodeMeaning === Bidirectional_LONG_AXIS);
    const shortAxisNUMGroup = toArray(ContentSequence).find(group => group.ConceptNameCodeSequence.CodeMeaning === Bidirectional_SHORT_AXIS);
    const longAxisScoordGroup = toArray(longAxisNUMGroup.ContentSequence).find(group => group.ValueType === 'SCOORD3D' || group.ValueType === 'SCOORD');
    const shortAxisScoordGroup = toArray(shortAxisNUMGroup.ContentSequence).find(group => group.ValueType === 'SCOORD3D' || group.ValueType === 'SCOORD');
    const worldCoords = [];
    worldCoords.push(...scoordToWorld(scoordArgs, longAxisScoordGroup));
    worldCoords.push(...scoordToWorld(scoordArgs, shortAxisScoordGroup));
    state.annotation.data = Bidirectional_objectSpread(Bidirectional_objectSpread({}, state.annotation.data), {}, {
      handles: Bidirectional_objectSpread(Bidirectional_objectSpread({}, state.annotation.data.handles), {}, {
        points: [worldCoords[0], worldCoords[1], worldCoords[2], worldCoords[3]]
      }),
      frameNumber: ReferencedFrameNumber
    });
    if (referencedImageId) {
      state.annotation.data.cachedStats = {
        ["imageId:".concat(referencedImageId)]: {
          length: longAxisNUMGroup.MeasuredValueSequence.NumericValue,
          width: shortAxisNUMGroup.MeasuredValueSequence.NumericValue,
          unit: longAxisNUMGroup.MeasuredValueSequence.MeasurementUnitsCodeSequence.CodeValue,
          widthUnit: shortAxisNUMGroup.MeasuredValueSequence.MeasurementUnitsCodeSequence.CodeValue
        }
      };
    }
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    let is3DMeasurement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const data = tool.data,
      finding = tool.finding,
      findingSites = tool.findingSites,
      metadata = tool.metadata;
    const _data$cachedStats = data.cachedStats,
      cachedStats = _data$cachedStats === void 0 ? {} : _data$cachedStats,
      handles = data.handles;
    const referencedImageId = metadata.referencedImageId;
    const scoordProps = {
      is3DMeasurement,
      referencedImageId
    };
    const points = handles.points;
    const firstPointPairs = [points[0], points[1]];
    const secondPointPairs = [points[2], points[3]];
    const firstPointPairsDistance = Math.sqrt(Math.pow(firstPointPairs[0][0] - firstPointPairs[1][0], 2) + Math.pow(firstPointPairs[0][1] - firstPointPairs[1][1], 2) + Math.pow(firstPointPairs[0][2] - firstPointPairs[1][2], 2));
    const secondPointPairsDistance = Math.sqrt(Math.pow(secondPointPairs[0][0] - secondPointPairs[1][0], 2) + Math.pow(secondPointPairs[0][1] - secondPointPairs[1][1], 2) + Math.pow(secondPointPairs[0][2] - secondPointPairs[1][2], 2));
    let shortAxisPoints;
    let longAxisPoints;
    if (firstPointPairsDistance > secondPointPairsDistance) {
      shortAxisPoints = firstPointPairs;
      longAxisPoints = secondPointPairs;
    } else {
      shortAxisPoints = secondPointPairs;
      longAxisPoints = firstPointPairs;
    }
    const longAxisStartImage = toScoord(scoordProps, shortAxisPoints[0]);
    const longAxisEndImage = toScoord(scoordProps, shortAxisPoints[1]);
    const shortAxisStartImage = toScoord(scoordProps, longAxisPoints[0]);
    const shortAxisEndImage = toScoord(scoordProps, longAxisPoints[1]);
    const _super$getCachedStats = super.getCachedStats(cachedStats, metadata),
      length = _super$getCachedStats.length,
      width = _super$getCachedStats.width,
      unit = _super$getCachedStats.unit;
    return {
      longAxis: {
        point1: longAxisStartImage,
        point2: longAxisEndImage
      },
      shortAxis: {
        point1: shortAxisStartImage,
        point2: shortAxisEndImage
      },
      longAxisLength: length,
      shortAxisLength: width,
      unit,
      trackingIdentifierTextValue: this.trackingIdentifierTextValue,
      finding: finding,
      findingSites: findingSites || [],
      ReferencedFrameOfReferenceUID: is3DMeasurement ? metadata.FrameOfReferenceUID : null,
      use3DSpatialCoordinates: is3DMeasurement
    };
  }
}
_Bidirectional = Bidirectional_Bidirectional;
(() => {
  _Bidirectional.init('Bidirectional', Bidirectional_TID300Bidirectional);
  _Bidirectional.registerLegacy();
})();



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/Angle.js








var _Angle;
function Cornerstone3D_Angle_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function Cornerstone3D_Angle_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? Cornerstone3D_Angle_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : Cornerstone3D_Angle_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const Angle_TID300CobbAngle = dcmjs_es/* .utilities.TID300.CobbAngle */.BF.TID300.CobbAngle;
class Angle_Angle extends BaseAdapter3D {
  static getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata) {
    const _MeasurementReport$ge = MeasurementReport_MeasurementReport.getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, this.toolType),
      state = _MeasurementReport$ge.state,
      NUMGroup = _MeasurementReport$ge.NUMGroup,
      worldCoords = _MeasurementReport$ge.worldCoords,
      referencedImageId = _MeasurementReport$ge.referencedImageId,
      ReferencedFrameNumber = _MeasurementReport$ge.ReferencedFrameNumber;
    const cachedStats = referencedImageId ? {
      ["imageId:".concat(referencedImageId)]: {
        angle: NUMGroup ? NUMGroup.MeasuredValueSequence.NumericValue : null
      }
    } : {};
    state.annotation.data = Cornerstone3D_Angle_objectSpread(Cornerstone3D_Angle_objectSpread({}, state.annotation.data), {}, {
      handles: Cornerstone3D_Angle_objectSpread(Cornerstone3D_Angle_objectSpread({}, state.annotation.data.handles), {}, {
        points: [worldCoords[0], worldCoords[1], worldCoords[3]]
      }),
      cachedStats,
      frameNumber: ReferencedFrameNumber
    });
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    let is3DMeasurement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const data = tool.data,
      finding = tool.finding,
      findingSites = tool.findingSites,
      metadata = tool.metadata;
    const _data$cachedStats = data.cachedStats,
      cachedStats = _data$cachedStats === void 0 ? {} : _data$cachedStats,
      handles = data.handles;
    const referencedImageId = metadata.referencedImageId;
    const scoordProps = {
      is3DMeasurement,
      referencedImageId
    };
    const point1 = toScoord(scoordProps, handles.points[0]);
    const point2 = toScoord(scoordProps, handles.points[1]);
    const point3 = toScoord(scoordProps, handles.points[1]);
    const point4 = toScoord(scoordProps, handles.points[2]);
    const _super$getCachedStats = super.getCachedStats(cachedStats, metadata),
      angle = _super$getCachedStats.angle;
    return {
      point1,
      point2,
      point3,
      point4,
      rAngle: angle,
      trackingIdentifierTextValue: this.trackingIdentifierTextValue,
      finding,
      findingSites: findingSites || [],
      ReferencedFrameOfReferenceUID: is3DMeasurement ? metadata.FrameOfReferenceUID : null,
      use3DSpatialCoordinates: is3DMeasurement
    };
  }
}
_Angle = Angle_Angle;
(() => {
  _Angle.init('Angle', Angle_TID300CobbAngle);
  _Angle.registerLegacy();
})();



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/CobbAngle.js









var _CobbAngle;
function Cornerstone3D_CobbAngle_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function Cornerstone3D_CobbAngle_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? Cornerstone3D_CobbAngle_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : Cornerstone3D_CobbAngle_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const CobbAngle_TID300CobbAngle = dcmjs_es/* .utilities.TID300.CobbAngle */.BF.TID300.CobbAngle;
class CobbAngle_CobbAngle extends BaseAdapter3D {
  static getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata) {
    const _MeasurementReport$ge = MeasurementReport_MeasurementReport.getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, CobbAngle_CobbAngle.toolType),
      state = _MeasurementReport$ge.state,
      NUMGroup = _MeasurementReport$ge.NUMGroup,
      referencedImageId = _MeasurementReport$ge.referencedImageId,
      worldCoords = _MeasurementReport$ge.worldCoords,
      ReferencedFrameNumber = _MeasurementReport$ge.ReferencedFrameNumber;
    state.annotation.data = Cornerstone3D_CobbAngle_objectSpread(Cornerstone3D_CobbAngle_objectSpread({}, state.annotation.data), {}, {
      handles: Cornerstone3D_CobbAngle_objectSpread(Cornerstone3D_CobbAngle_objectSpread({}, state.annotation.data.handles), {}, {
        points: [worldCoords[0], worldCoords[1], worldCoords[2], worldCoords[3]]
      }),
      frameNumber: ReferencedFrameNumber
    });
    if (referencedImageId) {
      state.annotation.data.cachedStats = {
        ["imageId:".concat(referencedImageId)]: {
          angle: NUMGroup ? NUMGroup.MeasuredValueSequence.NumericValue : null
        }
      };
    }
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    let is3DMeasurement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const data = tool.data,
      finding = tool.finding,
      findingSites = tool.findingSites,
      metadata = tool.metadata;
    const _data$cachedStats = data.cachedStats,
      cachedStats = _data$cachedStats === void 0 ? {} : _data$cachedStats,
      handles = data.handles;
    const referencedImageId = metadata.referencedImageId;
    const scoordProps = {
      is3DMeasurement,
      referencedImageId
    };
    const points = toScoords(scoordProps, handles.points);
    const _points = (0,slicedToArray/* ["default"] */.A)(points, 4),
      point1 = _points[0],
      point2 = _points[1],
      point3 = _points[2],
      point4 = _points[3];
    const _ref = cachedStats["imageId:".concat(referencedImageId)] || {},
      angle = _ref.angle;
    return {
      point1,
      point2,
      point3,
      point4,
      rAngle: angle,
      trackingIdentifierTextValue: this.trackingIdentifierTextValue,
      finding,
      findingSites: findingSites || [],
      ReferencedFrameOfReferenceUID: is3DMeasurement ? metadata.FrameOfReferenceUID : null,
      use3DSpatialCoordinates: is3DMeasurement
    };
  }
}
_CobbAngle = CobbAngle_CobbAngle;
(() => {
  _CobbAngle.init('CobbAngle', CobbAngle_TID300CobbAngle);
  _CobbAngle.registerLegacy();
})();



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/unitMapper.js
const UCUM_HOUNSFIELD_UNIT = "[hnsf'U]";
const DISPLAY_HOUNSFIELD_UNIT = 'HU';
const UCUM_SQUARE_MILLIMETER = 'mm2';
const DISPLAY_SQUARE_MILLIMETER = 'mm²';
const UNIT_MAP_FROM_UCUM = {
  [UCUM_HOUNSFIELD_UNIT]: DISPLAY_HOUNSFIELD_UNIT,
  [UCUM_SQUARE_MILLIMETER]: DISPLAY_SQUARE_MILLIMETER
};
function mapUnitFromUCUM(unit) {
  if (!unit) {
    return unit;
  }
  return UNIT_MAP_FROM_UCUM[unit] || unit;
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/metricHandler.js



const INTENSITY_METRICS = new Set(['Mean', 'Standard Deviation', 'Maximum', 'Minimum']);
function extractAllNUMGroups(MeasurementGroup, referencedSOPInstanceUID) {
  const numGroupsBySOPInstanceUID = {};
  if (MeasurementGroup.ContentSequence) {
    MeasurementGroup.ContentSequence.forEach(item => {
      if (item.ValueType === 'NUM' && item.ConceptNameCodeSequence) {
        var _item$MeasuredValueSe, _item$MeasuredValueSe2;
        const codeMeaning = item.ConceptNameCodeSequence.CodeMeaning;
        const numericValue = (_item$MeasuredValueSe = item.MeasuredValueSequence) === null || _item$MeasuredValueSe === void 0 ? void 0 : _item$MeasuredValueSe.NumericValue;
        const unitCode = (_item$MeasuredValueSe2 = item.MeasuredValueSequence) === null || _item$MeasuredValueSe2 === void 0 || (_item$MeasuredValueSe2 = _item$MeasuredValueSe2.MeasurementUnitsCodeSequence) === null || _item$MeasuredValueSe2 === void 0 ? void 0 : _item$MeasuredValueSe2.CodeValue;
        if (numericValue !== undefined && referencedSOPInstanceUID) {
          if (!numGroupsBySOPInstanceUID[referencedSOPInstanceUID]) {
            numGroupsBySOPInstanceUID[referencedSOPInstanceUID] = {};
          }
          let unit = '';
          if (unitCode) {
            unit = resolveUnit(codeMeaning, unitCode);
          }
          numGroupsBySOPInstanceUID[referencedSOPInstanceUID][codeMeaning] = {
            value: numericValue,
            unit
          };
        }
      }
    });
  }
  return numGroupsBySOPInstanceUID;
}
function restoreAdditionalMetrics(numGroups) {
  const additionalMetrics = {};
  let modalityUnit = '';
  const metricMapping = {
    Mean: 'mean',
    'Standard Deviation': 'stdDev',
    Maximum: 'max',
    Minimum: 'min',
    Area: 'area',
    Radius: 'radius',
    Perimeter: 'perimeter',
    Length: 'length',
    Width: 'width'
  };
  const unitCategory = {
    mean: 'modalityUnit',
    stdDev: 'modalityUnit',
    max: 'modalityUnit',
    min: 'modalityUnit',
    area: 'areaUnit',
    radius: 'radiusUnit',
    perimeter: 'unit',
    length: 'unit',
    width: 'widthUnit'
  };
  for (const _ref of Object.entries(metricMapping)) {
    var _ref2 = (0,slicedToArray/* ["default"] */.A)(_ref, 2);
    const codeMeaning = _ref2[0];
    const metricKey = _ref2[1];
    const group = numGroups[codeMeaning];
    if (!group) {
      continue;
    }
    const value = group.value,
      unit = group.unit;
    if (value == null) {
      continue;
    }
    additionalMetrics[metricKey] = value;
    if (!unit) {
      continue;
    }
    const mappedUnit = mapUnitFromUCUM(unit);
    if (!mappedUnit) {
      continue;
    }
    if (INTENSITY_METRICS.has(codeMeaning) && !modalityUnit) {
      modalityUnit = mappedUnit;
    }
    const category = unitCategory[metricKey];
    if (category) {
      if (!additionalMetrics[category]) {
        additionalMetrics[category] = mappedUnit;
      }
    } else {
      additionalMetrics["".concat(metricKey, "Unit")] = mappedUnit;
    }
  }
  additionalMetrics.modalityUnit = modalityUnit;
  return additionalMetrics;
}
function resolveUnit(codeMeaning, unitCode) {
  if (!unitCode) {
    return '';
  }
  const CodeValue = unitCode.CodeValue,
    CodeMeaning = unitCode.CodeMeaning;
  if (CodeValue === '1') {
    if (!INTENSITY_METRICS.has(codeMeaning) && codeMeaning === 'Area') {
      return "".concat(CodeMeaning, "\xB2");
    }
    return INTENSITY_METRICS.has(codeMeaning) ? '' : CodeMeaning;
  }
  return CodeValue;
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/CircleROI.js









var _CircleROI;
function CircleROI_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function CircleROI_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? CircleROI_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : CircleROI_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const CircleROI_TID300Circle = dcmjs_es/* .utilities.TID300.Circle */.BF.TID300.Circle;
class CircleROI extends BaseAdapter3D {
  static getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata) {
    const _MeasurementReport$ge = MeasurementReport_MeasurementReport.getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, this.toolType),
      state = _MeasurementReport$ge.state,
      NUMGroup = _MeasurementReport$ge.NUMGroup,
      worldCoords = _MeasurementReport$ge.worldCoords,
      referencedImageId = _MeasurementReport$ge.referencedImageId,
      ReferencedFrameNumber = _MeasurementReport$ge.ReferencedFrameNumber;
    const referencedSOPInstanceUID = state.sopInstanceUid;
    const allNUMGroups = extractAllNUMGroups(MeasurementGroup, referencedSOPInstanceUID);
    const measurementNUMGroups = allNUMGroups[referencedSOPInstanceUID] || {};
    state.annotation.data = CircleROI_objectSpread(CircleROI_objectSpread({}, state.annotation.data), {}, {
      handles: CircleROI_objectSpread(CircleROI_objectSpread({}, state.annotation.data.handles), {}, {
        points: worldCoords
      }),
      frameNumber: ReferencedFrameNumber
    });
    if (referencedImageId) {
      state.annotation.data.cachedStats = {
        ["imageId:".concat(referencedImageId)]: CircleROI_objectSpread({
          area: NUMGroup ? NUMGroup.MeasuredValueSequence.NumericValue : 0,
          radius: 0,
          perimeter: 0
        }, restoreAdditionalMetrics(measurementNUMGroups))
      };
    }
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    let is3DMeasurement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const data = tool.data,
      finding = tool.finding,
      findingSites = tool.findingSites,
      metadata = tool.metadata;
    const _data$cachedStats = data.cachedStats,
      cachedStats = _data$cachedStats === void 0 ? {} : _data$cachedStats,
      handles = data.handles;
    const referencedImageId = metadata.referencedImageId;
    const scoordProps = {
      is3DMeasurement,
      referencedImageId
    };
    const center = toScoord(scoordProps, handles.points[0]);
    const end = toScoord(scoordProps, handles.points[1]);
    const _super$getCachedStats = super.getCachedStats(cachedStats, metadata),
      area = _super$getCachedStats.area,
      radius = _super$getCachedStats.radius,
      max = _super$getCachedStats.max,
      min = _super$getCachedStats.min,
      stdDev = _super$getCachedStats.stdDev,
      mean = _super$getCachedStats.mean,
      modalityUnit = _super$getCachedStats.modalityUnit,
      radiusUnit = _super$getCachedStats.radiusUnit,
      areaUnit = _super$getCachedStats.areaUnit;
    const perimeter = 2 * Math.PI * radius;
    return {
      area,
      areaUnit,
      perimeter,
      modalityUnit,
      radiusUnit,
      radius,
      max,
      min,
      stdDev,
      mean,
      points: [center, end],
      trackingIdentifierTextValue: this.trackingIdentifierTextValue,
      finding,
      findingSites: findingSites || [],
      ReferencedFrameOfReferenceUID: is3DMeasurement ? metadata.FrameOfReferenceUID : null,
      use3DSpatialCoordinates: is3DMeasurement
    };
  }
}
_CircleROI = CircleROI;
(() => {
  _CircleROI.init('CircleROI', CircleROI_TID300Circle);
  _CircleROI.registerLegacy();
})();



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/EllipticalROI.js









var _EllipticalROI;
function EllipticalROI_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function EllipticalROI_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? EllipticalROI_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : EllipticalROI_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const EllipticalROI_TID300Ellipse = dcmjs_es/* .utilities.TID300.Ellipse */.BF.TID300.Ellipse;
class EllipticalROI extends BaseAdapter3D {
  static getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata) {
    const _MeasurementReport$ge = MeasurementReport_MeasurementReport.getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, EllipticalROI.toolType),
      state = _MeasurementReport$ge.state,
      NUMGroup = _MeasurementReport$ge.NUMGroup,
      worldCoords = _MeasurementReport$ge.worldCoords,
      referencedImageId = _MeasurementReport$ge.referencedImageId,
      ReferencedFrameNumber = _MeasurementReport$ge.ReferencedFrameNumber;
    const referencedSOPInstanceUID = state.sopInstanceUid;
    const allNUMGroups = extractAllNUMGroups(MeasurementGroup, referencedSOPInstanceUID);
    const measurementNUMGroups = allNUMGroups[referencedSOPInstanceUID] || {};
    state.annotation.data = EllipticalROI_objectSpread(EllipticalROI_objectSpread({}, state.annotation.data), {}, {
      handles: EllipticalROI_objectSpread(EllipticalROI_objectSpread({}, state.annotation.data.handles), {}, {
        points: worldCoords
      }),
      frameNumber: ReferencedFrameNumber
    });
    state.annotation.data.cachedStats = referencedImageId ? {
      ["imageId:".concat(referencedImageId)]: EllipticalROI_objectSpread({
        area: NUMGroup ? NUMGroup.MeasuredValueSequence.NumericValue : 0
      }, restoreAdditionalMetrics(measurementNUMGroups))
    } : {};
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    let is3DMeasurement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const data = tool.data,
      finding = tool.finding,
      findingSites = tool.findingSites,
      metadata = tool.metadata;
    const _data$cachedStats = data.cachedStats,
      cachedStats = _data$cachedStats === void 0 ? {} : _data$cachedStats,
      handles = data.handles;
    const rotation = data.initialRotation || 0;
    const referencedImageId = metadata.referencedImageId;
    const scoordProps = {
      is3DMeasurement,
      referencedImageId
    };
    let top, bottom, left, right;
    if (rotation == 90 || rotation == 270) {
      bottom = handles.points[2];
      top = handles.points[3];
      left = handles.points[0];
      right = handles.points[1];
    } else {
      top = handles.points[0];
      bottom = handles.points[1];
      left = handles.points[2];
      right = handles.points[3];
    }
    const topBottomLength = Math.sqrt((top[0] - bottom[0]) ** 2 + (top[1] - bottom[1]) ** 2 + (top[2] - bottom[2]) ** 2);
    const leftRightLength = Math.sqrt((left[0] - right[0]) ** 2 + (left[1] - right[1]) ** 2 + (left[2] - right[2]) ** 2);
    const points = [];
    if (topBottomLength > leftRightLength) {
      points.push(top, bottom, left, right);
    } else {
      points.push(left, right, top, bottom);
    }
    const _super$getCachedStats = super.getCachedStats(cachedStats, metadata),
      area = _super$getCachedStats.area,
      max = _super$getCachedStats.max,
      min = _super$getCachedStats.min,
      mean = _super$getCachedStats.mean,
      stdDev = _super$getCachedStats.stdDev,
      modalityUnit = _super$getCachedStats.modalityUnit,
      areaUnit = _super$getCachedStats.areaUnit;
    const convertedPoints = points.map(point => toScoord(scoordProps, point));
    return {
      area,
      areaUnit,
      max,
      min,
      mean,
      stdDev,
      modalityUnit,
      points: convertedPoints,
      trackingIdentifierTextValue: this.trackingIdentifierTextValue,
      finding,
      findingSites: findingSites || [],
      ReferencedFrameOfReferenceUID: is3DMeasurement ? metadata.FrameOfReferenceUID : null,
      use3DSpatialCoordinates: is3DMeasurement
    };
  }
}
_EllipticalROI = EllipticalROI;
_EllipticalROI.init('EllipticalROI', EllipticalROI_TID300Ellipse);



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/RectangleROI.js










var _RectangleROI;
function RectangleROI_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function RectangleROI_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? RectangleROI_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : RectangleROI_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const RectangleROI_TID300Polyline = dcmjs_es/* .utilities.TID300.Polyline */.BF.TID300.Polyline;
class RectangleROI extends BaseAdapter3D {
  static isValidMeasurement(measurement) {
    const graphicItem = this.getGraphicItem(measurement);
    const pointsCount = this.getPointsCount(graphicItem);
    return this.getGraphicType(graphicItem) === 'POLYLINE' && (pointsCount === 4 || pointsCount === 5);
  }
  static getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata) {
    var _areaGroup$MeasuredVa, _areaGroup$MeasuredVa2;
    const _MeasurementReport$ge = MeasurementReport_MeasurementReport.getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, this.toolType),
      state = _MeasurementReport$ge.state,
      worldCoords = _MeasurementReport$ge.worldCoords,
      referencedImageId = _MeasurementReport$ge.referencedImageId,
      ReferencedFrameNumber = _MeasurementReport$ge.ReferencedFrameNumber;
    const points = worldCoords.length === 5 ? worldCoords.slice(0, 4) : worldCoords;
    const areaGroup = MeasurementGroup.ContentSequence.find(g => g.ValueType === 'NUM' && g.ConceptNameCodeSequence.CodeMeaning === 'Area');
    const referencedSOPInstanceUID = state.sopInstanceUid;
    const allNUMGroups = extractAllNUMGroups(MeasurementGroup, referencedSOPInstanceUID);
    const measurementNUMGroups = allNUMGroups[referencedSOPInstanceUID] || {};
    const restoredMetrics = restoreAdditionalMetrics(measurementNUMGroups);
    const rawAreaUnit = areaGroup === null || areaGroup === void 0 || (_areaGroup$MeasuredVa = areaGroup.MeasuredValueSequence) === null || _areaGroup$MeasuredVa === void 0 || (_areaGroup$MeasuredVa = _areaGroup$MeasuredVa[0]) === null || _areaGroup$MeasuredVa === void 0 ? void 0 : _areaGroup$MeasuredVa.MeasurementUnitsCodeSequence;
    const areaUnitFromSR = rawAreaUnit === null || rawAreaUnit === void 0 ? void 0 : rawAreaUnit.CodeValue;
    const mappedAreaUnit = areaUnitFromSR ? mapUnitFromUCUM(areaUnitFromSR) : restoredMetrics.areaUnit;
    const cachedStats = referencedImageId ? {
      ["imageId:".concat(referencedImageId)]: RectangleROI_objectSpread({
        area: (areaGroup === null || areaGroup === void 0 || (_areaGroup$MeasuredVa2 = areaGroup.MeasuredValueSequence) === null || _areaGroup$MeasuredVa2 === void 0 || (_areaGroup$MeasuredVa2 = _areaGroup$MeasuredVa2[0]) === null || _areaGroup$MeasuredVa2 === void 0 ? void 0 : _areaGroup$MeasuredVa2.NumericValue) || 0,
        areaUnit: mappedAreaUnit
      }, restoredMetrics)
    } : {};
    const handlesPoints = [points[0], points[1], points[3], points[2]];
    state.annotation.data = RectangleROI_objectSpread(RectangleROI_objectSpread({}, state.annotation.data), {}, {
      handles: RectangleROI_objectSpread(RectangleROI_objectSpread({}, state.annotation.data.handles), {}, {
        points: handlesPoints
      }),
      cachedStats,
      frameNumber: ReferencedFrameNumber
    });
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    let is3DMeasurement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const data = tool.data,
      finding = tool.finding,
      findingSites = tool.findingSites,
      metadata = tool.metadata;
    const referencedImageId = metadata.referencedImageId;
    const scoordProps = {
      is3DMeasurement,
      referencedImageId
    };
    const corners = toScoords(scoordProps, data.handles.points);
    const _super$getCachedStats = super.getCachedStats(data.cachedStats, metadata),
      area = _super$getCachedStats.area,
      perimeter = _super$getCachedStats.perimeter,
      max = _super$getCachedStats.max,
      mean = _super$getCachedStats.mean,
      stdDev = _super$getCachedStats.stdDev,
      areaUnit = _super$getCachedStats.areaUnit,
      modalityUnit = _super$getCachedStats.modalityUnit;
    return {
      points: [corners[0], corners[1], corners[3], corners[2], corners[0]],
      area,
      perimeter,
      max,
      mean,
      stdDev,
      areaUnit,
      modalityUnit,
      trackingIdentifierTextValue: this.trackingIdentifierTextValue,
      finding,
      findingSites: findingSites || [],
      use3DSpatialCoordinates: is3DMeasurement
    };
  }
}
_RectangleROI = RectangleROI;
(() => {
  _RectangleROI.init('RectangleROI', RectangleROI_TID300Polyline);
  _RectangleROI.registerLegacy();
  _RectangleROI.registerType('DCM:111030', 'POLYLINE', 4);
  _RectangleROI.registerType('DCM:111030', 'POLYLINE', 5);
})();



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/Length.js








var _Length;
function Length_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function Length_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? Length_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : Length_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const Length_TID300Length = dcmjs_es/* .utilities.TID300.Length */.BF.TID300.Length;
const Length_LENGTH = 'Length';
class Length_Length extends BaseAdapter3D {
  static getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata) {
    const _MeasurementReport$ge = MeasurementReport_MeasurementReport.getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, this.toolType),
      state = _MeasurementReport$ge.state,
      NUMGroup = _MeasurementReport$ge.NUMGroup,
      worldCoords = _MeasurementReport$ge.worldCoords,
      referencedImageId = _MeasurementReport$ge.referencedImageId,
      ReferencedFrameNumber = _MeasurementReport$ge.ReferencedFrameNumber;
    const cachedStats = referencedImageId ? {
      ["imageId:".concat(referencedImageId)]: {
        length: NUMGroup ? NUMGroup.MeasuredValueSequence.NumericValue : 0,
        unit: NUMGroup.MeasuredValueSequence.MeasurementUnitsCodeSequence.CodeValue
      }
    } : {};
    state.annotation.data = Length_objectSpread(Length_objectSpread({}, state.annotation.data), {}, {
      handles: Length_objectSpread(Length_objectSpread({}, state.annotation.data.handles), {}, {
        points: [worldCoords[0], worldCoords[1]],
        activeHandleIndex: 0
      }),
      cachedStats,
      frameNumber: ReferencedFrameNumber
    });
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    let is3DMeasurement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const data = tool.data,
      finding = tool.finding,
      findingSites = tool.findingSites,
      metadata = tool.metadata;
    const _data$cachedStats = data.cachedStats,
      cachedStats = _data$cachedStats === void 0 ? {} : _data$cachedStats,
      handles = data.handles;
    const referencedImageId = metadata.referencedImageId;
    const scoordProps = {
      is3DMeasurement,
      referencedImageId
    };
    const point1 = toScoord(scoordProps, handles.points[0]);
    const point2 = toScoord(scoordProps, handles.points[1]);
    const _super$getCachedStats = super.getCachedStats(cachedStats, metadata),
      distance = _super$getCachedStats.length;
    return {
      point1,
      point2,
      distance,
      trackingIdentifierTextValue: this.trackingIdentifierTextValue,
      finding,
      findingSites: findingSites || [],
      use3DSpatialCoordinates: is3DMeasurement
    };
  }
}
_Length = Length_Length;
(() => {
  _Length.init(Length_LENGTH, Length_TID300Length);
  _Length.registerLegacy();
})();



// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/index.js
var gl_matrix_esm = __webpack_require__(40230);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/ControlPointPolyline.js



const ControlPointPolyline_valueTypes = dcmjs_es.sr.valueTypes;
const ControlPointPolyline_TID300Polyline = dcmjs_es/* .utilities.TID300.Polyline */.BF.TID300.Polyline;
class ControlPointPolyline extends ControlPointPolyline_TID300Polyline {
  contentItem() {
    const contentEntries = super.contentItem();
    const self = this;
    const _self$props = self.props,
      controlPoints = _self$props.controlPoints,
      use3DSpatialCoordinates = _self$props.use3DSpatialCoordinates,
      ReferencedSOPSequence = _self$props.ReferencedSOPSequence,
      ReferencedFrameOfReferenceUID = _self$props.ReferencedFrameOfReferenceUID,
      is3DMeasurement = _self$props.use3DSpatialCoordinates;
    if (!(controlPoints !== null && controlPoints !== void 0 && controlPoints.length)) {
      return contentEntries;
    }
    const GraphicData = self.flattenPoints({
      points: controlPoints,
      use3DSpatialCoordinates
    });
    const GraphicType = ControlPointPolyline_valueTypes.GraphicTypes.MULTIPOINT;
    const scoordPlain = is3DMeasurement ? {
      RelationshipType: ControlPointPolyline_valueTypes.RelationshipTypes.CONTAINS,
      ValueType: 'SCOORD3D',
      ConceptNameCodeSequence: [{
        CodeValue: CONTROL_POINTS_CODE.value,
        CodingSchemeDesignator: CONTROL_POINTS_CODE.schemeDesignator,
        CodeMeaning: CONTROL_POINTS_CODE.meaning
      }],
      GraphicType,
      GraphicData,
      ReferencedFrameOfReferenceUID,
      ContentSequence: [{
        RelationshipType: ControlPointPolyline_valueTypes.RelationshipTypes.SELECTED_FROM,
        ValueType: ControlPointPolyline_valueTypes.ValueTypes.IMAGE,
        ReferencedSOPSequence
      }]
    } : {
      RelationshipType: ControlPointPolyline_valueTypes.RelationshipTypes.CONTAINS,
      ValueType: 'SCOORD',
      ConceptNameCodeSequence: [{
        CodeValue: CONTROL_POINTS_CODE.value,
        CodingSchemeDesignator: CONTROL_POINTS_CODE.schemeDesignator,
        CodeMeaning: CONTROL_POINTS_CODE.meaning
      }],
      GraphicType,
      GraphicData,
      ContentSequence: [{
        RelationshipType: ControlPointPolyline_valueTypes.RelationshipTypes.SELECTED_FROM,
        ValueType: ControlPointPolyline_valueTypes.ValueTypes.IMAGE,
        ReferencedSOPSequence
      }]
    };
    const splineType = self.props.splineType;
    const entries = contentEntries;
    const numEntry = entries.find(e => e.ValueType === 'NUM');
    if (numEntry) {
      const inner = numEntry.ContentSequence;
      const innerArray = Array.isArray(inner) ? inner : inner ? [inner] : [];
      numEntry.ContentSequence = [...innerArray, scoordPlain];
    } else {
      entries.push(scoordPlain);
    }
    if (splineType) {
      const splineTypeObsContext = {
        RelationshipType: ControlPointPolyline_valueTypes.RelationshipTypes.HAS_OBS_CONTEXT,
        ValueType: 'TEXT',
        ConceptNameCodeSequence: {
          CodeValue: SPLINE_TYPE_CODE.value,
          CodingSchemeDesignator: SPLINE_TYPE_CODE.schemeDesignator,
          CodeMeaning: SPLINE_TYPE_CODE.meaning
        },
        TextValue: splineType
      };
      const hasObsContextIndex = entries.findIndex(e => e.RelationshipType === ControlPointPolyline_valueTypes.RelationshipTypes.HAS_OBS_CONTEXT);
      const insertIndex = hasObsContextIndex >= 0 ? hasObsContextIndex + 2 : 2;
      entries.splice(insertIndex, 0, splineTypeObsContext);
    }
    return entries;
  }
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/PlanarFreehandROI.js












var _PlanarFreehandROI;
function PlanarFreehandROI_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function PlanarFreehandROI_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? PlanarFreehandROI_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : PlanarFreehandROI_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
class PlanarFreehandROI extends BaseAdapter3D {
  static getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata) {
    var _state$annotation$dat, _state$annotation$dat2, _numSeq$find;
    const _MeasurementReport$ge = MeasurementReport_MeasurementReport.getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, this.toolType),
      state = _MeasurementReport$ge.state,
      NUMGroup = _MeasurementReport$ge.NUMGroup,
      worldCoords = _MeasurementReport$ge.worldCoords,
      referencedImageId = _MeasurementReport$ge.referencedImageId,
      ReferencedFrameNumber = _MeasurementReport$ge.ReferencedFrameNumber;
    const distanceBetweenFirstAndLastPoint = gl_matrix_esm/* .vec3.distance */.eR.Io(worldCoords[worldCoords.length - 1], worldCoords[0]);
    let isOpenContour = true;
    if (distanceBetweenFirstAndLastPoint < this.closedContourThreshold) {
      worldCoords.pop();
      isOpenContour = false;
    }
    let points = (_state$annotation$dat = (_state$annotation$dat2 = state.annotation.data.handles) === null || _state$annotation$dat2 === void 0 ? void 0 : _state$annotation$dat2.points) !== null && _state$annotation$dat !== void 0 ? _state$annotation$dat : [];
    if (isOpenContour && points.length === 0) {
      points = [worldCoords[0], worldCoords[worldCoords.length - 1]];
    }
    const referencedSOPInstanceUID = state.sopInstanceUid;
    const allNUMGroups = extractAllNUMGroups(MeasurementGroup, referencedSOPInstanceUID);
    const measurementNUMGroups = allNUMGroups[referencedSOPInstanceUID] || {};
    const SPLINE_TYPE = {
      CodingSchemeDesignator: SPLINE_TYPE_CODE.schemeDesignator,
      CodeValue: SPLINE_TYPE_CODE.value
    };
    const numSeq = NUMGroup ? toArray(NUMGroup.ContentSequence) : [];
    const mgContentSeq = toArray(MeasurementGroup.ContentSequence);
    const splineTypeItem = (_numSeq$find = numSeq.find(item => MeasurementReport_MeasurementReport.codeValueMatch(item, SPLINE_TYPE))) !== null && _numSeq$find !== void 0 ? _numSeq$find : mgContentSeq.find(item => MeasurementReport_MeasurementReport.codeValueMatch(item, SPLINE_TYPE));
    state.annotation.data = PlanarFreehandROI_objectSpread(PlanarFreehandROI_objectSpread({}, state.annotation.data), {}, {
      contour: {
        polyline: worldCoords,
        closed: !isOpenContour
      },
      handles: PlanarFreehandROI_objectSpread(PlanarFreehandROI_objectSpread({}, state.annotation.data.handles), {}, {
        points
      }),
      frameNumber: ReferencedFrameNumber
    }, splineTypeItem && {
      spline: {
        type: splineTypeItem.TextValue
      }
    });
    if (referencedImageId) {
      state.annotation.data.cachedStats = {
        ["imageId:".concat(referencedImageId)]: PlanarFreehandROI_objectSpread(PlanarFreehandROI_objectSpread({}, !isOpenContour && NUMGroup ? {
          area: NUMGroup.MeasuredValueSequence.NumericValue
        } : {}), restoreAdditionalMetrics(measurementNUMGroups))
      };
    }
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    var _handles$points, _data$spline;
    let is3DMeasurement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const data = tool.data,
      finding = tool.finding,
      findingSites = tool.findingSites,
      metadata = tool.metadata;
    const handles = data.handles;
    const _data$contour = data.contour,
      polyline = _data$contour.polyline,
      closed = _data$contour.closed;
    const isOpenContour = closed !== true;
    const referencedImageId = metadata.referencedImageId;
    const scoordProps = {
      is3DMeasurement,
      referencedImageId
    };
    const points = toScoords(scoordProps, polyline);
    if (!isOpenContour) {
      const firstPoint = points[0];
      points.push(firstPoint);
    }
    const controlPoints = (handles === null || handles === void 0 || (_handles$points = handles.points) === null || _handles$points === void 0 ? void 0 : _handles$points.length) && toScoords(scoordProps, handles.points);
    const _super$getCachedStats = super.getCachedStats(data.cachedStats, metadata),
      area = _super$getCachedStats.area,
      areaUnit = _super$getCachedStats.areaUnit,
      modalityUnit = _super$getCachedStats.modalityUnit,
      perimeter = _super$getCachedStats.perimeter,
      mean = _super$getCachedStats.mean,
      max = _super$getCachedStats.max,
      stdDev = _super$getCachedStats.stdDev,
      length = _super$getCachedStats.length;
    return {
      points,
      controlPoints,
      area,
      areaUnit,
      perimeter: perimeter !== null && perimeter !== void 0 ? perimeter : length,
      modalityUnit,
      mean,
      max,
      stdDev,
      splineType: (_data$spline = data.spline) === null || _data$spline === void 0 ? void 0 : _data$spline.type,
      trackingIdentifierTextValue: this.trackingIdentifierTextValue,
      finding,
      findingSites: findingSites || [],
      ReferencedFrameOfReferenceUID: is3DMeasurement ? metadata.FrameOfReferenceUID : null,
      use3DSpatialCoordinates: is3DMeasurement
    };
  }
}
_PlanarFreehandROI = PlanarFreehandROI;
_PlanarFreehandROI.closedContourThreshold = 1e-5;
(() => {
  _PlanarFreehandROI.init('PlanarFreehandROI', ControlPointPolyline);
  _PlanarFreehandROI.registerSubType(_PlanarFreehandROI, 'LivewireContour');
  _PlanarFreehandROI.registerSubType(_PlanarFreehandROI, 'SplineROI');
})();



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/Probe.js








var _Probe;
function Probe_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function Probe_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? Probe_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : Probe_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const Probe_TID300Point = dcmjs_es/* .utilities.TID300.Point */.BF.TID300.Point;
class Probe extends BaseAdapter3D {
  static isValidMeasurement(measurement) {
    const graphicItem = this.getGraphicItem(measurement);
    return this.getGraphicType(graphicItem) === 'POINT' && this.getPointsCount(graphicItem) <= 2;
  }
  static getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, _trackingIdentifier) {
    var _NUMGroup$MeasuredVal, _NUMGroup$MeasuredVal2;
    const _MeasurementReport$ge = MeasurementReport_MeasurementReport.getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, this.toolType),
      state = _MeasurementReport$ge.state,
      NUMGroup = _MeasurementReport$ge.NUMGroup,
      worldCoords = _MeasurementReport$ge.worldCoords,
      referencedImageId = _MeasurementReport$ge.referencedImageId,
      ReferencedFrameNumber = _MeasurementReport$ge.ReferencedFrameNumber;
    const cachedStats = referencedImageId ? {
      ["imageId:".concat(referencedImageId)]: {
        value: (_NUMGroup$MeasuredVal = NUMGroup === null || NUMGroup === void 0 || (_NUMGroup$MeasuredVal2 = NUMGroup.MeasuredValueSequence) === null || _NUMGroup$MeasuredVal2 === void 0 ? void 0 : _NUMGroup$MeasuredVal2.NumericValue) !== null && _NUMGroup$MeasuredVal !== void 0 ? _NUMGroup$MeasuredVal : null
      }
    } : {};
    state.annotation.data = Probe_objectSpread(Probe_objectSpread({}, state.annotation.data), {}, {
      handles: Probe_objectSpread(Probe_objectSpread({}, state.annotation.data.handles), {}, {
        points: worldCoords
      }),
      cachedStats,
      frameNumber: ReferencedFrameNumber,
      invalidated: true
    });
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    let is3DMeasurement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const data = tool.data,
      metadata = tool.metadata;
    const finding = tool.finding,
      findingSites = tool.findingSites;
    const referencedImageId = metadata.referencedImageId;
    const scoordProps = {
      is3DMeasurement,
      referencedImageId
    };
    const _data$handles$points = data.handles.points,
      points = _data$handles$points === void 0 ? [] : _data$handles$points;
    const pointsImage = toScoords(scoordProps, points);
    return {
      points: pointsImage,
      trackingIdentifierTextValue: this.trackingIdentifierTextValue,
      findingSites: findingSites || [],
      finding,
      ReferencedFrameOfReferenceUID: is3DMeasurement ? metadata.FrameOfReferenceUID : null,
      use3DSpatialCoordinates: is3DMeasurement
    };
  }
}
_Probe = Probe;
(() => {
  _Probe.init('Probe', Probe_TID300Point);
  _Probe.registerLegacy();
  _Probe.registerType('DCM:111030', 'POINT', 1);
  _Probe.registerType('DCM:111030', 'POINT', 2);
})();



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/UltrasoundDirectional.js






var _UltrasoundDirectional;
function UltrasoundDirectional_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function UltrasoundDirectional_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? UltrasoundDirectional_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : UltrasoundDirectional_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const UltrasoundDirectional_TID300Length = dcmjs_es/* .utilities.TID300.Length */.BF.TID300.Length;
const worldToImageCoords = esm.utilities.worldToImageCoords;
class UltrasoundDirectional extends BaseAdapter3D {
  static getMeasurementData(measurementGroup, sopInstanceUIDToImageIdMap, metadata) {
    const _MeasurementReport$ge = MeasurementReport_MeasurementReport.getSetupMeasurementData(measurementGroup, sopInstanceUIDToImageIdMap, metadata, this.toolType),
      state = _MeasurementReport$ge.state,
      worldCoords = _MeasurementReport$ge.worldCoords,
      ReferencedFrameNumber = _MeasurementReport$ge.ReferencedFrameNumber;
    state.annotation.data = UltrasoundDirectional_objectSpread(UltrasoundDirectional_objectSpread({}, state.annotation.data), {}, {
      handles: UltrasoundDirectional_objectSpread(UltrasoundDirectional_objectSpread({}, state.annotation.data.handles), {}, {
        points: worldCoords
      }),
      frameNumber: ReferencedFrameNumber
    });
    return state;
  }
  static getTID300RepresentationArguments(tool, is3DMeasurement) {
    const data = tool.data,
      finding = tool.finding,
      findingSites = tool.findingSites,
      metadata = tool.metadata;
    const handles = data.handles;
    const referencedImageId = metadata.referencedImageId;
    if (!referencedImageId) {
      throw new Error('UltrasoundDirectionalTool.getTID300RepresentationArguments: referencedImageId is not defined');
    }
    const start = worldToImageCoords(referencedImageId, handles.points[0]);
    const end = worldToImageCoords(referencedImageId, handles.points[1]);
    const point1 = {
      x: start[0],
      y: start[1]
    };
    const point2 = {
      x: end[0],
      y: end[1]
    };
    return {
      point1,
      point2,
      trackingIdentifierTextValue: this.trackingIdentifierTextValue,
      finding,
      findingSites: findingSites || []
    };
  }
}
_UltrasoundDirectional = UltrasoundDirectional;
_UltrasoundDirectional.init('UltrasoundDirectionalTool', UltrasoundDirectional_TID300Length);



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/Segmentation/generateSegmentation.js








function generateSegmentation_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function generateSegmentation_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? generateSegmentation_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : generateSegmentation_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const generateSegmentation_MetadataModules = esm.Enums.MetadataModules;
const SEGImageNormalizer = dcmjs_es/* .normalizers.SEGImageNormalizer */.z8.SEGImageNormalizer;
const generateSegmentation_SegmentationDerivation = dcmjs_es/* .derivations.Segmentation */.h4.Segmentation;
const LABELMAP_SEG_SOP_CLASS_UID = '1.2.840.10008.5.1.4.1.1.66.7';
const BITMAP_SEG_SOP_CLASS_UID = '1.2.840.10008.5.1.4.1.1.66.4';
function resolveTransferSyntaxUid() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const transferSyntaxUid = options.transferSyntaxUid || options.transferSyntaxUID;
  if (!transferSyntaxUid) {
    return EXPLICIT_VR_LITTLE_ENDIAN_TRANSFER_SYNTAX_UID;
  }
  return transferSyntaxUid;
}
function applySegDatasetTransferSyntax(dataset, transferSyntaxUid, pixelData, pixelDataVR) {
  dataset.PixelData = pixelData;
  dataset._vrMap = dataset._vrMap || {};
  dataset._vrMap.PixelData = pixelDataVR;
  dataset._meta = dataset._meta || {};
  dataset._meta.TransferSyntaxUID = {
    Value: [transferSyntaxUid],
    vr: 'UI'
  };
}
function hasAnySegment(pixelData) {
  for (let i = 0; i < pixelData.length; i++) {
    if (pixelData[i] !== 0) {
      return true;
    }
  }
  return false;
}
function toLabelmap3DArray(inputLabelmaps3D) {
  if (Array.isArray(inputLabelmaps3D)) {
    return inputLabelmaps3D.filter(Boolean);
  }
  return inputLabelmaps3D ? [inputLabelmaps3D] : [];
}
function collectNonEmptyFrameIndices(labelmap3DArray) {
  const indices = new Set();
  labelmap3DArray.forEach(labelmap3D => {
    var _labelmap3D$labelmaps;
    const labelmaps2D = (_labelmap3D$labelmaps = labelmap3D === null || labelmap3D === void 0 ? void 0 : labelmap3D.labelmaps2D) !== null && _labelmap3D$labelmaps !== void 0 ? _labelmap3D$labelmaps : [];
    for (let i = 0; i < labelmaps2D.length; i++) {
      const frame = labelmaps2D[i];
      if (frame !== null && frame !== void 0 && frame.pixelData && hasAnySegment(frame.pixelData)) {
        indices.add(i);
      }
    }
  });
  return Array.from(indices).sort((a, b) => a - b);
}
function resolveReferencedImagesForExport(images, frameIndices) {
  if (!frameIndices.length) {
    throw new Error('No non-empty labelmap frames found for SEG export');
  }
  return frameIndices.map(frameIndex => {
    const image = images[frameIndex];
    if (!(image !== null && image !== void 0 && image.imageId)) {
      throw new Error("Cannot resolve referenced source image for labelmap stack frame ".concat(frameIndex, " ") + "(image not loaded in cache). Load the referenced series before storing the segmentation.");
    }
    return image;
  });
}
function maxSegmentValue(labelmap3DArray, frameIndices) {
  let max = 0;
  labelmap3DArray.forEach(labelmap3D => {
    var _labelmap3D$labelmaps2;
    const labelmaps2D = (_labelmap3D$labelmaps2 = labelmap3D === null || labelmap3D === void 0 ? void 0 : labelmap3D.labelmaps2D) !== null && _labelmap3D$labelmaps2 !== void 0 ? _labelmap3D$labelmaps2 : [];
    frameIndices.forEach(frameIndex => {
      var _labelmaps2D$frameInd;
      const pixelData = (_labelmaps2D$frameInd = labelmaps2D[frameIndex]) === null || _labelmaps2D$frameInd === void 0 ? void 0 : _labelmaps2D$frameInd.pixelData;
      if (!pixelData) {
        return;
      }
      for (let i = 0; i < pixelData.length; i++) {
        if (pixelData[i] > max) {
          max = pixelData[i];
        }
      }
    });
  });
  return max;
}
function collectSegmentSequence(labelmap3DArray) {
  const bySegmentNumber = new Map();
  labelmap3DArray.forEach(labelmap3D => {
    var _labelmap3D$metadata;
    ((_labelmap3D$metadata = labelmap3D === null || labelmap3D === void 0 ? void 0 : labelmap3D.metadata) !== null && _labelmap3D$metadata !== void 0 ? _labelmap3D$metadata : []).forEach((segment, index) => {
      var _segment$SegmentNumbe;
      if (!segment) {
        return;
      }
      const key = Number((_segment$SegmentNumbe = segment.SegmentNumber) !== null && _segment$SegmentNumbe !== void 0 ? _segment$SegmentNumbe : index);
      if (!bySegmentNumber.has(key)) {
        bySegmentNumber.set(key, generateSegmentation_objectSpread({}, segment));
      }
    });
  });
  return Array.from(bySegmentNumber.entries()).sort((a, b) => a[0] - b[0]).map(_ref => {
    let _ref2 = (0,slicedToArray/* ["default"] */.A)(_ref, 2),
      segment = _ref2[1];
    return segment;
  });
}
function getPlaneSequencesForImage(image, metadata) {
  var _metadata$get;
  const imagePlane = metadata === null || metadata === void 0 || (_metadata$get = metadata.get) === null || _metadata$get === void 0 ? void 0 : _metadata$get.call(metadata, generateSegmentation_MetadataModules.IMAGE_PLANE, image === null || image === void 0 ? void 0 : image.imageId);
  if (!imagePlane) {
    return {};
  }
  const result = {};
  const imagePositionPatient = imagePlane.imagePositionPatient,
    imageOrientationPatient = imagePlane.imageOrientationPatient,
    rowCosines = imagePlane.rowCosines,
    columnCosines = imagePlane.columnCosines;
  if (Array.isArray(imagePositionPatient) && imagePositionPatient.length === 3) {
    result.planePositionSequence = {
      ImagePositionPatient: [...imagePositionPatient]
    };
  }
  let orientation = imageOrientationPatient;
  if ((!Array.isArray(orientation) || orientation.length !== 6) && Array.isArray(rowCosines) && Array.isArray(columnCosines)) {
    orientation = [...rowCosines, ...columnCosines];
  }
  if (Array.isArray(orientation) && orientation.length === 6) {
    result.planeOrientationSequence = {
      ImageOrientationPatient: [...orientation]
    };
  }
  return result;
}
function fillLabelmapSegmentation(segmentation, inputLabelmaps3D, metadata, images) {
  let options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  const labelmap3DArray = toLabelmap3DArray(inputLabelmaps3D);
  const segmentSequence = collectSegmentSequence(labelmap3DArray);
  const validFrameIndices = collectNonEmptyFrameIndices(labelmap3DArray);
  if (!validFrameIndices.length) {
    throw new Error('No non-empty labelmap frames found for SEG export');
  }
  const firstFrame = labelmap3DArray.map(labelmap3D => {
    var _labelmap3D$labelmaps3;
    return labelmap3D === null || labelmap3D === void 0 || (_labelmap3D$labelmaps3 = labelmap3D.labelmaps2D) === null || _labelmap3D$labelmaps3 === void 0 ? void 0 : _labelmap3D$labelmaps3[validFrameIndices[0]];
  }).find(Boolean);
  const rows = firstFrame.rows;
  const columns = firstFrame.columns;
  const frameLength = rows * columns;
  const numberOfFrames = validFrameIndices.length;
  const maxValue = maxSegmentValue(labelmap3DArray, validFrameIndices);
  const useUint16 = maxValue > 255;
  const FrameArray = useUint16 ? Uint16Array : Uint8Array;
  const bitsAllocated = useUint16 ? 16 : 8;
  let overlapWarned = false;
  const buildExportFrame = frameIndex => {
    const frame = new FrameArray(frameLength);
    labelmap3DArray.forEach(labelmap3D => {
      var _labelmap3D$labelmaps4;
      const source = labelmap3D === null || labelmap3D === void 0 || (_labelmap3D$labelmaps4 = labelmap3D.labelmaps2D) === null || _labelmap3D$labelmaps4 === void 0 || (_labelmap3D$labelmaps4 = _labelmap3D$labelmaps4[frameIndex]) === null || _labelmap3D$labelmaps4 === void 0 ? void 0 : _labelmap3D$labelmaps4.pixelData;
      if (!source) {
        return;
      }
      const len = Math.min(source.length, frameLength);
      for (let i = 0; i < len; i++) {
        const value = source[i];
        if (value === 0) {
          continue;
        }
        if (frame[i] !== 0 && frame[i] !== value && !overlapWarned) {
          console.warn('generateSegmentation: overlapping labelmap segments detected on the ' + 'same voxel while exporting a LABELMAP SEG; the later labelmap wins.');
          overlapWarned = true;
        }
        frame[i] = value;
      }
    });
    return frame;
  };
  const dataset = segmentation.dataset;
  dataset.NumberOfFrames = numberOfFrames;
  dataset.Rows = rows;
  dataset.Columns = columns;
  dataset.SOPClassUID = LABELMAP_SEG_SOP_CLASS_UID;
  dataset.SegmentationType = 'LABELMAP';
  if (segmentSequence.length) {
    dataset.SegmentSequence = segmentSequence;
  }
  dataset.BitsAllocated = useUint16 ? '16' : '8';
  dataset.BitsStored = useUint16 ? '16' : '8';
  dataset.HighBit = useUint16 ? '15' : '7';
  dataset.PixelRepresentation = '0';
  delete dataset.MaximumFractionalValue;
  delete dataset.SegmentationFractionalType;
  dataset.SpecificCharacterSet = 'ISO_IR 192';
  dataset._vrMap || (dataset._vrMap = {});
  const transferSyntaxUid = resolveTransferSyntaxUid(options);
  const _encodeFramesToTransf = encodeFramesToTransferSyntax({
      transferSyntaxUID: transferSyntaxUid,
      buildFrame: outputIndex => buildExportFrame(validFrameIndices[outputIndex]),
      frameCount: validFrameIndices.length,
      bitsAllocated,
      columns
    }),
    pixelData = _encodeFramesToTransf.pixelData,
    pixelDataVR = _encodeFramesToTransf.pixelDataVR;
  applySegDatasetTransferSyntax(dataset, transferSyntaxUid, pixelData, pixelDataVR);
  dataset._meta || (dataset._meta = {});
  dataset._meta.MediaStorageSOPClassUID = {
    Value: [LABELMAP_SEG_SOP_CLASS_UID],
    vr: 'UI'
  };
  const sourceImageSequence = images.map(image => getReferencedSourceImageSequenceItem(image, metadata)).filter(item => item.ReferencedSOPInstanceUID);
  if (sourceImageSequence.length) {
    dataset.SourceImageSequence = sourceImageSequence;
  }
  const perFrameInputs = validFrameIndices.map((_, outputIndex) => {
    var _dataset$PerFrameFunc, _dataset$PerFrameFunc2, _planeSequences$plane, _planeSequences$plane2;
    const image = images[outputIndex];
    const sourceImageSequenceItem = getReferencedSourceImageSequenceItem(image, metadata);
    if (!(sourceImageSequenceItem !== null && sourceImageSequenceItem !== void 0 && sourceImageSequenceItem.ReferencedSOPInstanceUID)) {
      throw new Error("Cannot resolve a source ReferencedSOPInstanceUID for labelmap SEG " + "frame ".concat(outputIndex, ". Refusing to write a SEG with unreliable ") + "source image references.");
    }
    const priorGroup = (_dataset$PerFrameFunc = (_dataset$PerFrameFunc2 = dataset.PerFrameFunctionalGroupsSequence) === null || _dataset$PerFrameFunc2 === void 0 ? void 0 : _dataset$PerFrameFunc2[outputIndex]) !== null && _dataset$PerFrameFunc !== void 0 ? _dataset$PerFrameFunc : {};
    const planeSequences = getPlaneSequencesForImage(image, metadata);
    return {
      sourceImageSequenceItem,
      planeOrientationSequence: (_planeSequences$plane = planeSequences.planeOrientationSequence) !== null && _planeSequences$plane !== void 0 ? _planeSequences$plane : priorGroup === null || priorGroup === void 0 ? void 0 : priorGroup.PlaneOrientationSequence,
      planePositionSequence: (_planeSequences$plane2 = planeSequences.planePositionSequence) !== null && _planeSequences$plane2 !== void 0 ? _planeSequences$plane2 : priorGroup === null || priorGroup === void 0 ? void 0 : priorGroup.PlanePositionSequence
    };
  });
  applyPerFrameFunctionalGroups(dataset, perFrameInputs);
  const sopInstanceUIDs = new Set(images.map(image => {
    var _metadata$get2;
    return (_metadata$get2 = metadata.get(generateSegmentation_MetadataModules.IMAGE_DATA, image === null || image === void 0 ? void 0 : image.imageId)) === null || _metadata$get2 === void 0 ? void 0 : _metadata$get2.SOPInstanceUID;
  }).filter(Boolean));
  const referencedSeriesSequence = dataset.ReferencedSeriesSequence;
  const referencedSeries = Array.isArray(referencedSeriesSequence) ? referencedSeriesSequence[0] : referencedSeriesSequence;
  if (referencedSeries !== null && referencedSeries !== void 0 && referencedSeries.ReferencedInstanceSequence && sopInstanceUIDs.size) {
    const referencedInstances = Array.isArray(referencedSeries.ReferencedInstanceSequence) ? referencedSeries.ReferencedInstanceSequence : [referencedSeries.ReferencedInstanceSequence];
    referencedSeries.ReferencedInstanceSequence = referencedInstances.filter(instance => (instance === null || instance === void 0 ? void 0 : instance.ReferencedSOPInstanceUID) && sopInstanceUIDs.has(instance.ReferencedSOPInstanceUID));
  }
  return segmentation;
}
function generateSegmentation_generateSegmentation(images, labelmaps, metadata) {
  let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const requestedSOPClassUID = (options === null || options === void 0 ? void 0 : options.sopClassUID) || BITMAP_SEG_SOP_CLASS_UID;
  const shouldExportBitmap = requestedSOPClassUID === BITMAP_SEG_SOP_CLASS_UID;
  if (shouldExportBitmap) {
    var _segmentationResult$d;
    const transferSyntaxUid = resolveTransferSyntaxUid(options);
    const segmentation = _createMultiframeSegmentationFromReferencedImages(images, metadata, options);
    const segmentationResult = fillSegmentation(segmentation, labelmaps, generateSegmentation_objectSpread(generateSegmentation_objectSpread({}, options), {}, {
      transferSyntaxUid: EXPLICIT_VR_LITTLE_ENDIAN_TRANSFER_SYNTAX_UID,
      skipTransferSyntaxMeta: true
    }), images, metadata);
    const _getBitmapFramesFromD = getBitmapFramesFromDataset(segmentationResult.dataset),
      frames = _getBitmapFramesFromD.frames,
      bitsAllocated = _getBitmapFramesFromD.bitsAllocated;
    const _encodeFramesToTransf2 = encodeFramesToTransferSyntax({
        transferSyntaxUID: transferSyntaxUid,
        frames,
        bitsAllocated,
        columns: Number(segmentationResult.dataset.Columns) || undefined
      }),
      pixelData = _encodeFramesToTransf2.pixelData,
      pixelDataVR = _encodeFramesToTransf2.pixelDataVR;
    applySegDatasetTransferSyntax(segmentationResult.dataset, transferSyntaxUid, pixelData, pixelDataVR);
    segmentationResult.dataset.SOPClassUID = BITMAP_SEG_SOP_CLASS_UID;
    (_segmentationResult$d = segmentationResult.dataset)._meta || (_segmentationResult$d._meta = {});
    segmentationResult.dataset._meta.MediaStorageSOPClassUID = {
      Value: [BITMAP_SEG_SOP_CLASS_UID],
      vr: 'UI'
    };
    const predecessorImageId = options === null || options === void 0 ? void 0 : options.predecessorImageId;
    if (predecessorImageId) {
      const predecessor = metadata.get(generateSegmentation_MetadataModules.PREDECESSOR_SEQUENCE, predecessorImageId);
      Object.assign(segmentationResult, predecessor);
    }
    return segmentationResult;
  }
  const nonEmptyFrameIndices = collectNonEmptyFrameIndices(toLabelmap3DArray(labelmaps));
  const filteredImages = resolveReferencedImagesForExport(images, nonEmptyFrameIndices);
  const segmentation = _createMultiframeSegmentationFromReferencedImages(filteredImages, metadata, options);
  const segmentationResult = fillLabelmapSegmentation(segmentation, labelmaps, metadata, filteredImages, options);
  const predecessorImageId = options === null || options === void 0 ? void 0 : options.predecessorImageId;
  if (predecessorImageId) {
    const predecessor = metadata.get(generateSegmentation_MetadataModules.PREDECESSOR_SEQUENCE, predecessorImageId);
    Object.assign(segmentationResult, predecessor);
  }
  return segmentationResult;
}
function _createMultiframeSegmentationFromReferencedImages(images, metadata, options) {
  var _images$, _multiframe$SharedFun;
  if (!(images !== null && images !== void 0 && images.length) || !((_images$ = images[0]) !== null && _images$ !== void 0 && _images$.imageId)) {
    throw new Error('Cannot create SEG derivation: no referenced source images were resolved.');
  }
  const studyImageId = (options === null || options === void 0 ? void 0 : options.predecessorImageId) || images[0].imageId;
  const studyData = metadata.get(generateSegmentation_MetadataModules.STUDY_DATA, studyImageId);
  const datasets = images.map(image => {
    const imageId = image.imageId;
    const seriesData = metadata.get(generateSegmentation_MetadataModules.SERIES_DATA, imageId);
    const imageData = metadata.get(generateSegmentation_MetadataModules.IMAGE_DATA, imageId);
    return generateSegmentation_objectSpread(generateSegmentation_objectSpread(generateSegmentation_objectSpread(generateSegmentation_objectSpread({}, studyData), seriesData), imageData), {}, {
      PixelData: image.voxelManager.getScalarData(),
      BitsAllocated: 16,
      _vrMap: {
        PixelData: 'OW'
      },
      _meta: {}
    });
  });
  const isSingleNonMultiFrame = datasets.length === 1 && !(datasets[0].NumberOfFrames > 1);
  if (isSingleNonMultiFrame) {
    datasets.push(datasets[0]);
  }
  const normalizer = new SEGImageNormalizer(datasets);
  normalizer.normalize();
  const multiframe = normalizer.dataset;
  if (!multiframe) {
    throw new Error('Failed to normalize the multiframe dataset, the data is not multi-frame.');
  }
  normalizeSharedFunctionalGroupsSequence(multiframe);
  (_multiframe$SharedFun = multiframe.SharedFunctionalGroupsSequence).PixelMeasuresSequence || (_multiframe$SharedFun.PixelMeasuresSequence = {});
  multiframe.PerFrameFunctionalGroupsSequence || (multiframe.PerFrameFunctionalGroupsSequence = []);
  for (let index = 0; index < images.length; index++) {
    var _multiframe$PerFrameF, _index;
    (_multiframe$PerFrameF = multiframe.PerFrameFunctionalGroupsSequence)[_index = index] || (_multiframe$PerFrameF[_index] = {
      PlanePositionSequence: {},
      PlaneOrientationSequence: {}
    });
  }
  if (isSingleNonMultiFrame) {
    multiframe.PerFrameFunctionalGroupsSequence = [multiframe.PerFrameFunctionalGroupsSequence[0]];
    multiframe.NumberOfFrames = 1;
  }
  return new generateSegmentation_SegmentationDerivation([multiframe], options);
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/Segmentation/generateLabelMaps2DFrom3D.js
function generateLabelMaps2DFrom3D(labelmap3D) {
  const scalarData = labelmap3D.scalarData,
    dimensions = labelmap3D.dimensions;
  const labelmaps2D = [];
  const segmentsOnLabelmap3D = new Set();
  for (let z = 0; z < dimensions[2]; z++) {
    const pixelData = scalarData.slice(z * dimensions[0] * dimensions[1], (z + 1) * dimensions[0] * dimensions[1]);
    const segmentsOnLabelmap = [];
    for (let i = 0; i < pixelData.length; i++) {
      const segment = pixelData[i];
      if (!segmentsOnLabelmap.includes(segment) && segment !== 0) {
        segmentsOnLabelmap.push(segment);
      }
    }
    const labelmap2D = {
      segmentsOnLabelmap,
      pixelData,
      rows: dimensions[1],
      columns: dimensions[0]
    };
    if (segmentsOnLabelmap.length === 0) {
      continue;
    }
    segmentsOnLabelmap.forEach(segmentIndex => {
      segmentsOnLabelmap3D.add(segmentIndex);
    });
    labelmaps2D[dimensions[2] - 1 - z] = labelmap2D;
  }
  labelmap3D.segmentsOnLabelmap = Array.from(segmentsOnLabelmap3D);
  labelmap3D.labelmaps2D = labelmaps2D;
  return labelmap3D;
}



// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/index.js
var dist_esm = __webpack_require__(55526);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/Segmentation/compactMergeSegData.js
const checkHasOverlapping = _ref => {
  let largerArray = _ref.largerArray,
    currentTestedArray = _ref.currentTestedArray,
    newArray = _ref.newArray;
  return largerArray.some((_, currentImageIndex) => {
    const originalImagePixelData = currentTestedArray[currentImageIndex];
    const newImagePixelData = newArray[currentImageIndex];
    if (!originalImagePixelData || !newImagePixelData) {
      return false;
    }
    return originalImagePixelData.some((originalPixel, currentPixelIndex) => {
      const newPixel = newImagePixelData[currentPixelIndex];
      return originalPixel && newPixel;
    });
  });
};
const compactMergeSegmentDataWithoutInformationLoss = _ref2 => {
  let arrayOfSegmentData = _ref2.arrayOfSegmentData,
    newSegmentData = _ref2.newSegmentData;
  if (arrayOfSegmentData.length === 0) {
    arrayOfSegmentData.push(newSegmentData);
    return;
  }
  for (let currentTestedIndex = 0; currentTestedIndex < arrayOfSegmentData.length; currentTestedIndex++) {
    const currentTestedArray = arrayOfSegmentData[currentTestedIndex];
    const originalArrayIsLarger = currentTestedArray.length > newSegmentData.length;
    const largerArray = originalArrayIsLarger ? currentTestedArray : newSegmentData;
    const hasOverlapping = checkHasOverlapping({
      currentTestedArray,
      largerArray,
      newArray: newSegmentData
    });
    if (hasOverlapping) {
      continue;
    }
    largerArray.forEach((_, currentImageIndex) => {
      const originalImagePixelData = currentTestedArray[currentImageIndex];
      const newImagePixelData = newSegmentData[currentImageIndex];
      if (!originalImagePixelData && !newImagePixelData || !newImagePixelData) {
        return;
      }
      if (!originalImagePixelData) {
        currentTestedArray[currentImageIndex] = newImagePixelData;
        return;
      }
      const mergedPixelData = originalImagePixelData.map((originalPixel, currentPixelIndex) => {
        const newPixel = newImagePixelData[currentPixelIndex];
        return originalPixel || newPixel;
      });
      currentTestedArray[currentImageIndex] = mergedPixelData;
    });
    return;
  }
  arrayOfSegmentData.push(newSegmentData);
};



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/Segmentation/labelmapImagesFromBuffer.js












function labelmapImagesFromBuffer_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function labelmapImagesFromBuffer_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? labelmapImagesFromBuffer_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : labelmapImagesFromBuffer_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const labelmapImagesFromBuffer_DicomMessage = dcmjs_es/* .data.DicomMessage */.p.DicomMessage,
  labelmapImagesFromBuffer_DicomMetaDictionary = dcmjs_es/* .data.DicomMetaDictionary */.p.DicomMetaDictionary;
const labelmapImagesFromBuffer_Normalizer = dcmjs_es/* .normalizers.Normalizer */.z8.Normalizer;
const labelmapImagesFromBuffer_LABELMAP_SEG_SOP_CLASS_UID = '1.2.840.10008.5.1.4.1.1.66.7';
const BUFFER_SEG_IMAGE_ID = 'cornerstone-adapters-buffer-seg:0';
function stripFrameQualifiersFromImageId(imageId) {
  if (!imageId) {
    return imageId;
  }
  if (imageId.includes('/frames/')) {
    return imageId.replace(/\/frames\/\d+.*$/, '');
  }
  return imageId.split('&frame=')[0].split('?frame=')[0];
}
function prepareSegMultiframeMetadata(multiframe) {
  normalizeSharedFunctionalGroupsSequence(multiframe);
  const perFrame = multiframe.PerFrameFunctionalGroupsSequence;
  if (perFrame && !Array.isArray(perFrame)) {
    multiframe.PerFrameFunctionalGroupsSequence = [perFrame];
  }
  const coerceIop = group => {
    const seq = group === null || group === void 0 ? void 0 : group.PlaneOrientationSequence;
    if (seq && Array.isArray(seq.ImageOrientationPatient)) {
      seq.ImageOrientationPatient = seq.ImageOrientationPatient.map(Number);
    }
  };
  coerceIop(multiframe.SharedFunctionalGroupsSequence);
  const perFrameGroups = multiframe.PerFrameFunctionalGroupsSequence;
  if (Array.isArray(perFrameGroups)) {
    perFrameGroups.forEach(coerceIop);
  }
}
function getFrameNumberFromImageId(imageId) {
  const frameQueryMatch = imageId.match(/(?:&|\?)frame=(\d+)/);
  if (frameQueryMatch) {
    return Number(frameQueryMatch[1]);
  }
  const wadorsFrameMatch = imageId.match(/\/frames\/(\d+)/);
  if (wadorsFrameMatch) {
    return Number(wadorsFrameMatch[1]);
  }
  return undefined;
}
function isPseudoBinaryFractional(pixelData, maximumFractionalValue) {
  const max = Number(maximumFractionalValue);
  if (!Number.isFinite(max)) {
    return false;
  }
  for (let i = 0; i < pixelData.length; i++) {
    const value = pixelData[i];
    if (value !== 0 && value !== max) {
      return false;
    }
  }
  return true;
}
function isPseudoBinaryFractionalFromChunks(chunks, maximumFractionalValue) {
  for (const chunk of chunks) {
    if (!isPseudoBinaryFractional(chunk, maximumFractionalValue)) {
      return false;
    }
  }
  return true;
}
function buildSopUIDImageIdIndexMap(referencedImageIds, metadataProvider) {
  return referencedImageIds.reduce((acc, imageId) => {
    var _metadataProvider$get;
    const _ref = (_metadataProvider$get = metadataProvider.get('generalImageModule', imageId)) !== null && _metadataProvider$get !== void 0 ? _metadataProvider$get : {},
      sopInstanceUID = _ref.sopInstanceUID;
    if (!sopInstanceUID) {
      return acc;
    }
    if (!acc[sopInstanceUID]) {
      acc[sopInstanceUID] = imageId;
    }
    return acc;
  }, {});
}
function resolveStackImageId(imageId, referencedImageIds, metadataProvider) {
  if (!imageId) {
    return undefined;
  }
  if (referencedImageIds.includes(imageId)) {
    return imageId;
  }
  const strippedTarget = stripFrameQualifiersFromImageId(imageId);
  const targetFrame = getFrameNumberFromImageId(imageId);
  for (const refId of referencedImageIds) {
    var _getFrameNumberFromIm;
    if (stripFrameQualifiersFromImageId(refId) !== strippedTarget) {
      continue;
    }
    if (targetFrame === undefined) {
      return refId;
    }
    const refFrame = (_getFrameNumberFromIm = getFrameNumberFromImageId(refId)) !== null && _getFrameNumberFromIm !== void 0 ? _getFrameNumberFromIm : 1;
    if (refFrame === targetFrame) {
      return refId;
    }
  }
  if (metadataProvider !== null && metadataProvider !== void 0 && metadataProvider.get) {
    const _ref2 = metadataProvider.get('generalImageModule', imageId) || {},
      sopInstanceUID = _ref2.sopInstanceUID;
    if (sopInstanceUID) {
      for (const refId of referencedImageIds) {
        var _metadataProvider$get2, _getFrameNumberFromIm2;
        const refSop = (_metadataProvider$get2 = metadataProvider.get('generalImageModule', refId)) === null || _metadataProvider$get2 === void 0 ? void 0 : _metadataProvider$get2.sopInstanceUID;
        if (refSop !== sopInstanceUID) {
          continue;
        }
        if (targetFrame === undefined) {
          return refId;
        }
        const refFrame = (_getFrameNumberFromIm2 = getFrameNumberFromImageId(refId)) !== null && _getFrameNumberFromIm2 !== void 0 ? _getFrameNumberFromIm2 : 1;
        if (refFrame === targetFrame) {
          return refId;
        }
      }
    }
  }
  return undefined;
}
function ensureImageIdMapsEntry(imageId, referencedImageIds, imageIdMaps, metadataProvider) {
  const stackImageId = resolveStackImageId(imageId, referencedImageIds, metadataProvider);
  if (!stackImageId) {
    return undefined;
  }
  if (imageIdMaps.indices[stackImageId] === undefined) {
    const index = referencedImageIds.indexOf(stackImageId);
    if (index === -1) {
      return undefined;
    }
    imageIdMaps.indices[stackImageId] = index;
    imageIdMaps.metadata[stackImageId] = imageIdMaps.metadata[stackImageId] || metadataProvider.get('instance', stackImageId);
  }
  return stackImageId;
}
function chunkPixelData(pixelData) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const _options$maxBytesPerC = options.maxBytesPerChunk,
    maxBytesPerChunk = _options$maxBytesPerC === void 0 ? Number.POSITIVE_INFINITY : _options$maxBytesPerC;
  if (pixelData.length <= maxBytesPerChunk) {
    return [pixelData];
  }
  const chunks = [];
  for (let offset = 0; offset < pixelData.length; offset += maxBytesPerChunk) {
    chunks.push(pixelData.subarray(offset, offset + maxBytesPerChunk));
  }
  return chunks;
}
function normalizeDecodedPixelData(pixelData) {
  if (Array.isArray(pixelData)) {
    if (pixelData.length === 1) {
      return normalizeDecodedPixelData(pixelData[0]);
    }
    const hasUint16Frame = pixelData.some(frame => frame instanceof Uint16Array);
    if (hasUint16Frame) {
      const normalizedFrames = pixelData.map(frame => frame instanceof Uint16Array ? frame : new Uint16Array(frame));
      const totalLength = normalizedFrames.reduce((acc, frame) => acc + frame.length, 0);
      const combined = new Uint16Array(totalLength);
      let offset = 0;
      for (const frame of normalizedFrames) {
        combined.set(frame, offset);
        offset += frame.length;
      }
      return combined;
    }
    const normalizedFrames = pixelData.map(frame => frame instanceof Uint8Array ? frame : new Uint8Array(frame));
    const totalLength = normalizedFrames.reduce((acc, frame) => acc + frame.length, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const frame of normalizedFrames) {
      combined.set(frame, offset);
      offset += frame.length;
    }
    return combined;
  }
  if (pixelData instanceof Uint8Array || pixelData instanceof Uint16Array) {
    return pixelData;
  }
  return new Uint8Array(pixelData);
}
function getExpectedVoxelCount(multiframe) {
  var _multiframe$PerFrameF;
  const numberOfFrames = Number(multiframe.NumberOfFrames) || ((_multiframe$PerFrameF = multiframe.PerFrameFunctionalGroupsSequence) === null || _multiframe$PerFrameF === void 0 ? void 0 : _multiframe$PerFrameF.length) || 1;
  return multiframe.Rows * multiframe.Columns * numberOfFrames;
}
const DEFAULT_SEG_FRAME_DECODE_CONCURRENCY = 16;
async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let nextIndex = 0;
  const worker = async () => {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await fn(items[index], index);
    }
  };
  const poolSize = Math.max(1, Math.min(limit, items.length));
  await Promise.all(Array.from({
    length: poolSize
  }, worker));
  return results;
}
function getSegNumberOfFrames(multiframe) {
  const fromTag = Number(multiframe.NumberOfFrames);
  if (fromTag > 0) {
    return fromTag;
  }
  const perFrame = multiframe.PerFrameFunctionalGroupsSequence;
  if (Array.isArray(perFrame) && perFrame.length > 0) {
    return perFrame.length;
  }
  return 1;
}
function expandWadorsFrameImageIds(segImageId, numberOfFrames) {
  const frameMatch = segImageId.match(/(.*\/frames\/)(\d+)(.*)$/);
  if (!frameMatch || numberOfFrames <= 1) {
    return [segImageId];
  }
  const prefix = frameMatch[1];
  const suffix = frameMatch[3] || '';
  const frameImageIds = [];
  for (let frameNumber = 1; frameNumber <= numberOfFrames; frameNumber++) {
    frameImageIds.push("".concat(prefix).concat(frameNumber).concat(suffix));
  }
  return frameImageIds;
}
const WADO_URI_FRAME_SCHEME = /^(wadouri:|dicomfile:)/;
function expandWadoUriFrameImageIds(segImageId, numberOfFrames) {
  if (numberOfFrames <= 1 || !WADO_URI_FRAME_SCHEME.test(segImageId)) {
    return [segImageId];
  }
  const base = segImageId.split('&frame=')[0].split('?frame=')[0];
  const separator = base.includes('?') ? '&' : '?';
  const frameImageIds = [];
  for (let frameNumber = 1; frameNumber <= numberOfFrames; frameNumber++) {
    frameImageIds.push("".concat(base).concat(separator, "frame=").concat(frameNumber));
  }
  return frameImageIds;
}
function resolveFrameImageIds(_ref3) {
  let segImageId = _ref3.segImageId,
    numberOfFrames = _ref3.numberOfFrames,
    frameImageIds = _ref3.frameImageIds,
    getFrameImageId = _ref3.getFrameImageId;
  if (frameImageIds !== null && frameImageIds !== void 0 && frameImageIds.length) {
    return frameImageIds;
  }
  if (getFrameImageId) {
    return Array.from({
      length: numberOfFrames
    }, (_, index) => getFrameImageId(segImageId, index + 1));
  }
  const wadorsFrameIds = expandWadorsFrameImageIds(segImageId, numberOfFrames);
  if (wadorsFrameIds.length > 1) {
    return wadorsFrameIds;
  }
  const wadoUriFrameIds = expandWadoUriFrameImageIds(segImageId, numberOfFrames);
  if (wadoUriFrameIds.length > 1) {
    return wadoUriFrameIds;
  }
  if (numberOfFrames > 1) {
    throw new Error("Cannot derive per-frame imageIds for multiframe SEG \"".concat(segImageId, "\" ") + "(".concat(numberOfFrames, " frames): its imageId scheme is not WADO-RS ") + "(\".../frames/N\") or WADO-URI (\"?frame=N\"/\"&frame=N\"). Supply " + "options.frameImageIds or options.getFrameImageId for this data source.");
  }
  return [segImageId];
}
function unpackFramePixelDataIfNeeded(framePixelData, multiframe, sliceLength) {
  const bitsStored = Number(multiframe.BitsStored);
  if (bitsStored === 1 && framePixelData.length < sliceLength) {
    const packed = framePixelData instanceof Uint8Array ? framePixelData : new Uint8Array(framePixelData);
    return unpackBinaryFrameFromPacked(packed, sliceLength);
  }
  return framePixelData;
}
function ensureInstanceOnMetadataProvider(metadataProvider, segImageId, multiframe) {
  if (metadataProvider.get('instance', segImageId)) {
    return;
  }
  if (metadataProvider.addCustomMetadata) {
    metadataProvider.addCustomMetadata(segImageId, 'instance', multiframe);
    return;
  }
  if (metadataProvider.add) {
    metadataProvider.add(segImageId, 'instance', multiframe);
  }
}
async function defaultDecodeFrameImageData(frameImageId, _frameNumber) {
  var _segImage$getPixelDat;
  const segImage = await esm.imageLoader.loadImage(frameImageId);
  return segImage === null || segImage === void 0 || (_segImage$getPixelDat = segImage.getPixelData) === null || _segImage$getPixelDat === void 0 ? void 0 : _segImage$getPixelDat.call(segImage);
}
async function decodeSegPixelDataFromFrameIds(_ref4) {
  let segImageId = _ref4.segImageId,
    multiframe = _ref4.multiframe,
    frameImageIds = _ref4.frameImageIds,
    getFrameImageId = _ref4.getFrameImageId,
    _ref4$decodeImageData = _ref4.decodeImageData,
    decodeImageData = _ref4$decodeImageData === void 0 ? defaultDecodeFrameImageData : _ref4$decodeImageData,
    _ref4$concurrency = _ref4.concurrency,
    concurrency = _ref4$concurrency === void 0 ? DEFAULT_SEG_FRAME_DECODE_CONCURRENCY : _ref4$concurrency;
  const rows = Number(multiframe.Rows);
  const columns = Number(multiframe.Columns);
  const sliceLength = rows * columns;
  const numberOfFrames = getSegNumberOfFrames(multiframe);
  const expectedVoxelCount = getExpectedVoxelCount(multiframe);
  const resolvedFrameImageIds = resolveFrameImageIds({
    segImageId,
    numberOfFrames,
    frameImageIds,
    getFrameImageId
  });
  if (numberOfFrames <= 1) {
    const frameImageId = resolvedFrameImageIds[0] || segImageId;
    const framePixelData = await decodeImageData(frameImageId, 1);
    if (!framePixelData) {
      throw new Error("No decoded pixel data found for SEG imageId: ".concat(frameImageId));
    }
    const normalized = normalizeDecodedPixelData(framePixelData);
    const decodedPixelData = unpackFramePixelDataIfNeeded(normalized, multiframe, sliceLength);
    return {
      pixelDataChunks: [decodedPixelData],
      expectedVoxelCount
    };
  }
  const perFramePixelData = await mapWithConcurrency(resolvedFrameImageIds.slice(0, numberOfFrames), concurrency, async (frameImageId, frameIndex) => {
    const frameNumber = frameIndex + 1;
    if (!frameImageId) {
      throw new Error("Missing SEG frame imageId at frame ".concat(frameNumber, " (expected ").concat(numberOfFrames, " frame imageIds)"));
    }
    const framePixelData = await decodeImageData(frameImageId, frameNumber);
    if (!framePixelData) {
      throw new Error("No decoded pixel data found for SEG frame imageId: ".concat(frameImageId));
    }
    let normalizedFrame = normalizeDecodedPixelData(framePixelData);
    normalizedFrame = unpackFramePixelDataIfNeeded(normalizedFrame, multiframe, sliceLength);
    return normalizedFrame.subarray(0, sliceLength);
  });
  return {
    pixelDataChunks: perFramePixelData,
    expectedVoxelCount
  };
}
const updateSegmentsOnFrame = _ref5 => {
  let segmentsOnFrame = _ref5.segmentsOnFrame,
    imageIdIndex = _ref5.imageIdIndex,
    segmentIndex = _ref5.segmentIndex;
  if (!segmentsOnFrame[imageIdIndex]) {
    segmentsOnFrame[imageIdIndex] = [];
  }
  segmentsOnFrame[imageIdIndex].push(segmentIndex);
};
const updateSegmentsPixelIndices = _ref6 => {
  let segmentsPixelIndices = _ref6.segmentsPixelIndices,
    segmentIndex = _ref6.segmentIndex,
    imageIdIndex = _ref6.imageIdIndex,
    indexCache = _ref6.indexCache;
  if (!segmentsPixelIndices.has(segmentIndex)) {
    segmentsPixelIndices.set(segmentIndex, {});
  }
  const segmentIndexObject = segmentsPixelIndices.get(segmentIndex);
  segmentIndexObject[imageIdIndex] = indexCache;
  segmentsPixelIndices.set(segmentIndex, segmentIndexObject);
};
const extractInfoFromPerFrameFunctionalGroups = _ref7 => {
  let PerFrameFunctionalGroups = _ref7.PerFrameFunctionalGroups,
    sequenceIndex = _ref7.sequenceIndex,
    sopUIDImageIdIndexMap = _ref7.sopUIDImageIdIndexMap,
    multiframe = _ref7.multiframe;
  const derivationImageSequence = PerFrameFunctionalGroups === null || PerFrameFunctionalGroups === void 0 ? void 0 : PerFrameFunctionalGroups.DerivationImageSequence;
  const normalizedDerivationImageSequence = Array.isArray(derivationImageSequence) ? derivationImageSequence[0] : derivationImageSequence;
  const sourceImageSequence = normalizedDerivationImageSequence === null || normalizedDerivationImageSequence === void 0 ? void 0 : normalizedDerivationImageSequence.SourceImageSequence;
  const normalizedSourceImageSequence = Array.isArray(sourceImageSequence) ? sourceImageSequence[0] : sourceImageSequence;
  const referencedSOPInstanceUid = normalizedSourceImageSequence === null || normalizedSourceImageSequence === void 0 ? void 0 : normalizedSourceImageSequence.ReferencedSOPInstanceUID;
  const referencedImageId = referencedSOPInstanceUid && normalizedSourceImageSequence ? getImageIdOfSourceImageBySourceImageSequence(normalizedSourceImageSequence, sopUIDImageIdIndexMap) : undefined;
  const segmentIndex = getSegmentIndex(multiframe, sequenceIndex);
  return {
    referencedSOPInstanceUid,
    referencedImageId,
    segmentIndex
  };
};
const getReferencedImageIdFromPerFrameGroup = _ref8 => {
  let perFrameFunctionalGroup = _ref8.perFrameFunctionalGroup,
    sopUIDImageIdIndexMap = _ref8.sopUIDImageIdIndexMap;
  const derivationImageSequence = perFrameFunctionalGroup === null || perFrameFunctionalGroup === void 0 ? void 0 : perFrameFunctionalGroup.DerivationImageSequence;
  const normalizedDerivationImageSequence = Array.isArray(derivationImageSequence) ? derivationImageSequence[0] : derivationImageSequence;
  const sourceImageSequence = normalizedDerivationImageSequence === null || normalizedDerivationImageSequence === void 0 ? void 0 : normalizedDerivationImageSequence.SourceImageSequence;
  const normalizedSourceImageSequence = Array.isArray(sourceImageSequence) ? sourceImageSequence[0] : sourceImageSequence;
  const referencedSOPInstanceUID = normalizedSourceImageSequence === null || normalizedSourceImageSequence === void 0 ? void 0 : normalizedSourceImageSequence.ReferencedSOPInstanceUID;
  if (!referencedSOPInstanceUID || !normalizedSourceImageSequence) {
    return;
  }
  return getImageIdOfSourceImageBySourceImageSequence(normalizedSourceImageSequence, sopUIDImageIdIndexMap);
};
async function createLabelmapsFromSegImageIds(referencedImageIds, segImageId, metadataProvider, options) {
  const _ref9 = options !== null && options !== void 0 ? options : {},
    _ref9$tolerance = _ref9.tolerance,
    tolerance = _ref9$tolerance === void 0 ? 1e-3 : _ref9$tolerance,
    _ref9$TypedArrayConst = _ref9.TypedArrayConstructor,
    TypedArrayConstructor = _ref9$TypedArrayConst === void 0 ? Uint8Array : _ref9$TypedArrayConst,
    maxBytesPerChunk = _ref9.maxBytesPerChunk,
    _ref9$parserType = _ref9.parserType,
    parserType = _ref9$parserType === void 0 ? 'bitmap' : _ref9$parserType,
    frameImageIds = _ref9.frameImageIds,
    getFrameImageId = _ref9.getFrameImageId,
    _ref9$decodeImageData = _ref9.decodeImageData,
    decodeImageData = _ref9$decodeImageData === void 0 ? defaultDecodeFrameImageData : _ref9$decodeImageData,
    _ref9$concurrency = _ref9.concurrency,
    concurrency = _ref9$concurrency === void 0 ? DEFAULT_SEG_FRAME_DECODE_CONCURRENCY : _ref9$concurrency,
    _ref9$multiframe = _ref9.multiframe,
    providedMultiframe = _ref9$multiframe === void 0 ? undefined : _ref9$multiframe;
  let multiframe = providedMultiframe;
  if (!multiframe) {
    var _instanceMeta$dataset;
    const instanceMeta = metadataProvider.get('instance', segImageId);
    if (!instanceMeta) {
      throw new Error("No instance metadata found for SEG imageId: ".concat(segImageId, ". Ensure the SEG instance is registered in the metadata provider (e.g. after loading the image)."));
    }
    multiframe = (_instanceMeta$dataset = instanceMeta.dataset) !== null && _instanceMeta$dataset !== void 0 ? _instanceMeta$dataset : instanceMeta;
  }
  prepareSegMultiframeMetadata(multiframe);
  const imagePlaneModule = metadataProvider.get('imagePlaneModule', referencedImageIds[0]);
  const generalSeriesModule = metadataProvider.get('generalSeriesModule', referencedImageIds[0]);
  const SeriesInstanceUID = generalSeriesModule.seriesInstanceUID;
  if (!imagePlaneModule) {
    console.warn('Insufficient metadata, imagePlaneModule missing.');
  }
  const ImageOrientationPatient = Array.isArray(imagePlaneModule.rowCosines) ? [...imagePlaneModule.rowCosines, ...imagePlaneModule.columnCosines] : [imagePlaneModule.rowCosines.x, imagePlaneModule.rowCosines.y, imagePlaneModule.rowCosines.z, imagePlaneModule.columnCosines.x, imagePlaneModule.columnCosines.y, imagePlaneModule.columnCosines.z];
  const validOrientations = Segmentation_4X_getValidOrientations(ImageOrientationPatient);
  const segMetadata = Segmentation_4X_getSegmentMetadata(multiframe, SeriesInstanceUID);
  const _await$decodeSegPixel = await decodeSegPixelDataFromFrameIds({
      segImageId,
      multiframe,
      frameImageIds,
      getFrameImageId,
      decodeImageData,
      concurrency
    }),
    pixelDataChunks = _await$decodeSegPixel.pixelDataChunks,
    expectedVoxelCount = _await$decodeSegPixel.expectedVoxelCount;
  const sliceLength = multiframe.Rows * multiframe.Columns;
  let resolvedPixelDataChunks = pixelDataChunks;
  if (Number(multiframe.BitsStored) === 1 && pixelDataChunks.length === 1 && pixelDataChunks[0].length < expectedVoxelCount) {
    const packed = pixelDataChunks[0];
    const unpacked = unpackBinaryFrameFromPacked(packed instanceof Uint8Array ? packed : new Uint8Array(packed), sliceLength);
    resolvedPixelDataChunks = chunkPixelData(unpacked, {
      maxBytesPerChunk
    });
  }
  const totalSamples = resolvedPixelDataChunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const decodedFrameCount = Math.max(1, Math.floor(totalSamples / sliceLength));
  if (multiframe.SegmentationType === 'FRACTIONAL' && !isPseudoBinaryFractionalFromChunks(resolvedPixelDataChunks, multiframe.MaximumFractionalValue)) {
    throw new Error('Fractional segmentations are not yet supported');
  }
  let finalPixelDataChunks = resolvedPixelDataChunks;
  if (maxBytesPerChunk && maxBytesPerChunk < Number.POSITIVE_INFINITY) {
    finalPixelDataChunks = resolvedPixelDataChunks.flatMap(chunk => chunkPixelData(chunk, {
      maxBytesPerChunk
    }));
  }
  const orientation = checkOrientation(multiframe, validOrientations, [imagePlaneModule.rows, imagePlaneModule.columns, referencedImageIds.length], tolerance);
  const sopUIDImageIdIndexMap = buildSopUIDImageIdIndexMap(referencedImageIds, metadataProvider);
  let insertFunction;
  switch (orientation) {
    case 'Planar':
      insertFunction = labelmapImagesFromBuffer_insertPixelDataPlanar;
      break;
    case 'Perpendicular':
      throw new Error('Segmentations orthogonal to the acquisition plane of the source data are not yet supported.');
    case 'Oblique':
      throw new Error('Segmentations oblique to the acquisition plane of the source data are not yet supported.');
  }
  const segmentsOnFrame = [];
  const imageIdMaps = {
    indices: {},
    metadata: {}
  };
  const labelMapImages = [];
  for (let i = 0; i < referencedImageIds.length; i++) {
    const referenceImageId = referencedImageIds[i];
    imageIdMaps.indices[referenceImageId] = i;
    imageIdMaps.metadata[referenceImageId] = metadataProvider.get('instance', referenceImageId);
    const labelMapImage = esm.imageLoader.createAndCacheDerivedLabelmapImage(referenceImageId);
    labelMapImages.push(labelMapImage);
  }
  const segmentsPixelIndices = new Map();
  const _await$insertFunction = await insertFunction({
      segmentsOnFrame,
      labelMapImages,
      pixelDataChunks: finalPixelDataChunks,
      multiframe,
      referencedImageIds,
      validOrientations,
      metadataProvider,
      tolerance,
      segmentsPixelIndices,
      sopUIDImageIdIndexMap,
      imageIdMaps,
      TypedArrayConstructor,
      parserType,
      decodedFrameCount
    }),
    hasOverlappingSegments = _await$insertFunction.hasOverlappingSegments,
    arrayOfLabelMapImages = _await$insertFunction.arrayOfLabelMapImages;
  const centroidXYZ = new Map();
  segmentsPixelIndices.forEach((imageIdIndexBufferIndex, segmentIndex) => {
    const centroids = calculateCentroid(imageIdIndexBufferIndex, multiframe, metadataProvider, referencedImageIds);
    centroidXYZ.set(segmentIndex, centroids);
  });
  return {
    labelMapImages: arrayOfLabelMapImages,
    segMetadata,
    segmentsOnFrame,
    centroids: centroidXYZ,
    overlappingSegments: hasOverlappingSegments
  };
}
const throttledTriggerLoadProgressEvent = dist_esm.utilities.throttle(percentComplete => {
  (0,esm.triggerEvent)(esm.eventTarget, Events_Events.SEGMENTATION_LOAD_PROGRESS, {
    percentComplete
  });
}, 200);
function labelmapImagesFromBuffer_insertPixelDataPlanar(_ref0) {
  let segmentsOnFrame = _ref0.segmentsOnFrame,
    labelMapImages = _ref0.labelMapImages,
    pixelDataChunks = _ref0.pixelDataChunks,
    multiframe = _ref0.multiframe,
    referencedImageIds = _ref0.referencedImageIds,
    validOrientations = _ref0.validOrientations,
    metadataProvider = _ref0.metadataProvider,
    tolerance = _ref0.tolerance,
    segmentsPixelIndices = _ref0.segmentsPixelIndices,
    sopUIDImageIdIndexMap = _ref0.sopUIDImageIdIndexMap,
    imageIdMaps = _ref0.imageIdMaps,
    parserType = _ref0.parserType,
    decodedFrameCount = _ref0.decodedFrameCount;
  const SharedFunctionalGroupsSequence = multiframe.SharedFunctionalGroupsSequence,
    PerFrameFunctionalGroupsSequence = multiframe.PerFrameFunctionalGroupsSequence,
    Rows = multiframe.Rows,
    Columns = multiframe.Columns;
  const sharedImageOrientationPatient = SharedFunctionalGroupsSequence.PlaneOrientationSequence ? SharedFunctionalGroupsSequence.PlaneOrientationSequence.ImageOrientationPatient : undefined;
  const sliceLength = Columns * Rows;
  const metadataFrameCount = Number(multiframe.NumberOfFrames) || PerFrameFunctionalGroupsSequence.length;
  const groupsLenFromMetadata = PerFrameFunctionalGroupsSequence.length || metadataFrameCount;
  const groupsLen = typeof decodedFrameCount === 'number' ? Math.min(groupsLenFromMetadata, decodedFrameCount) : groupsLenFromMetadata;
  let overlapping = false;
  return new Promise(resolve => {
    const percentImagesPerChunk = 0.1;
    const imagesPerChunk = Math.ceil(groupsLen * percentImagesPerChunk);
    const processChunk = firstIndex => {
      for (let i = firstIndex; i < firstIndex + imagesPerChunk && i < groupsLen; i++) {
        var _PerFrameFunctionalGr;
        const PerFrameFunctionalGroups = PerFrameFunctionalGroupsSequence[i];
        const ImageOrientationPatientI = sharedImageOrientationPatient || (PerFrameFunctionalGroups === null || PerFrameFunctionalGroups === void 0 || (_PerFrameFunctionalGr = PerFrameFunctionalGroups.PlaneOrientationSequence) === null || _PerFrameFunctionalGr === void 0 ? void 0 : _PerFrameFunctionalGr.ImageOrientationPatient);
        if (!ImageOrientationPatientI) {
          throw new Error("SEG frame ".concat(i + 1, " is missing ImageOrientationPatient in per-frame and shared functional groups."));
        }
        const view = readFromUnpackedChunks(pixelDataChunks, i * sliceLength, sliceLength);
        const pixelDataI2D = ndarray(view, [Rows, Columns]);
        const alignedPixelDataI = Segmentation_4X_alignPixelDataWithSourceData(pixelDataI2D, ImageOrientationPatientI, validOrientations, tolerance);
        if (!alignedPixelDataI) {
          throw new Error('Individual SEG frames are out of plane with respect to the first SEG frame. ' + 'This is not yet supported. Aborting segmentation loading.');
        }
        const segmentIndex = getSegmentIndex(multiframe, i);
        if (segmentIndex === undefined) {
          throw new Error('Could not retrieve the segment index. Aborting segmentation loading.');
        }
        if (!segmentsPixelIndices.has(segmentIndex)) {
          segmentsPixelIndices.set(segmentIndex, {});
        }
        let imageId = findReferenceSourceImageId(multiframe, i, referencedImageIds, metadataProvider, tolerance, sopUIDImageIdIndexMap);
        if (!imageId) {
          console.warn("Image not present in stack, can't import frame : " + i + '.');
          continue;
        }
        const stackImageId = ensureImageIdMapsEntry(imageId, referencedImageIds, imageIdMaps, metadataProvider);
        if (!stackImageId) {
          console.warn("Image not present in stack, can't import frame : ".concat(i, "."));
          continue;
        }
        const sourceImageMetadata = imageIdMaps.metadata[stackImageId];
        if (!sourceImageMetadata) {
          console.warn("No instance metadata for referenced image at frame : ".concat(i, "."));
          continue;
        }
        if (Rows !== sourceImageMetadata.Rows || Columns !== sourceImageMetadata.Columns) {
          throw new Error('Individual SEG frames have different geometry dimensions (Rows and Columns) ' + 'respect to the source image reference frame. This is not yet supported. ' + 'Aborting segmentation loading. ');
        }
        const imageIdIndex = imageIdMaps.indices[stackImageId];
        const labelmapImage = labelMapImages[imageIdIndex];
        const labelmap2DView = labelmapImage.getPixelData();
        const imageVoxelManager = labelmapImage.voxelManager;
        const data = alignedPixelDataI.data;
        const indexCache = [];
        for (let k = 0, len = alignedPixelDataI.data.length; k < len; ++k) {
          if (data[k]) {
            for (let x = k; x < len; ++x) {
              if (data[x]) {
                if (!overlapping && labelmap2DView[x] !== 0) {
                  overlapping = true;
                  return resolve(labelmapImagesFromBuffer_insertOverlappingPixelDataPlanar({
                    segmentsOnFrame,
                    labelMapImages,
                    pixelDataChunks,
                    multiframe,
                    referencedImageIds,
                    validOrientations,
                    metadataProvider,
                    tolerance,
                    segmentsPixelIndices,
                    sopUIDImageIdIndexMap,
                    imageIdMaps
                  }));
                }
                if (imageVoxelManager) {
                  imageVoxelManager.setAtIndex(x, segmentIndex);
                } else {
                  labelmap2DView[x] = segmentIndex;
                }
                indexCache.push(x);
              }
            }
            if (!segmentsOnFrame[imageIdIndex]) {
              segmentsOnFrame[imageIdIndex] = [];
            }
            segmentsOnFrame[imageIdIndex].push(segmentIndex);
            break;
          }
        }
        const segmentIndexObject = segmentsPixelIndices.get(segmentIndex);
        segmentIndexObject[imageIdIndex] = indexCache;
        segmentsPixelIndices.set(segmentIndex, segmentIndexObject);
      }
      const percentComplete = Math.round(firstIndex / groupsLen * 100);
      throttledTriggerLoadProgressEvent(percentComplete);
      if (firstIndex < groupsLen) {
        setTimeout(() => processChunk(firstIndex + imagesPerChunk), 0);
      } else {
        resolve({
          hasOverlappingSegments: false,
          arrayOfLabelMapImages: [labelMapImages]
        });
      }
    };
    const processLabelmapChunk = firstIndex => {
      var _multiframe$SharedFun;
      const pfSeq = multiframe.PerFrameFunctionalGroupsSequence;
      const sharedPlaneOrientation = (_multiframe$SharedFun = multiframe.SharedFunctionalGroupsSequence.PlaneOrientationSequence) === null || _multiframe$SharedFun === void 0 ? void 0 : _multiframe$SharedFun.ImageOrientationPatient;
      for (let i = firstIndex; i < firstIndex + imagesPerChunk && i < groupsLen; i++) {
        var _PerFrameFunctionalGr2;
        const PerFrameFunctionalGroups = pfSeq[i];
        const ImageOrientationPatientI = sharedPlaneOrientation || (PerFrameFunctionalGroups === null || PerFrameFunctionalGroups === void 0 || (_PerFrameFunctionalGr2 = PerFrameFunctionalGroups.PlaneOrientationSequence) === null || _PerFrameFunctionalGr2 === void 0 ? void 0 : _PerFrameFunctionalGr2.ImageOrientationPatient) || validOrientations[0];
        const view = readFromUnpackedChunks(pixelDataChunks, i * sliceLength, sliceLength);
        const pixelDataI2D = ndarray(view, [Rows, Columns]);
        const alignedPixelDataI = Segmentation_4X_alignPixelDataWithSourceData(pixelDataI2D, ImageOrientationPatientI, validOrientations, tolerance);
        if (!alignedPixelDataI) {
          throw new Error('Individual Labelmap SEG frames are out of plane with respect to the first SEG frame. ' + 'This is not yet supported. Aborting segmentation loading.');
        }
        let imageId = findReferenceSourceImageId(multiframe, i, referencedImageIds, metadataProvider, tolerance, sopUIDImageIdIndexMap);
        if (!imageId) {
          imageId = getReferencedImageIdFromPerFrameGroup({
            perFrameFunctionalGroup: PerFrameFunctionalGroups,
            sopUIDImageIdIndexMap
          });
        }
        if (!imageId) {
          console.warn("Image not present in stack, can't import frame : ".concat(i, "."));
          continue;
        }
        const stackImageId = ensureImageIdMapsEntry(imageId, referencedImageIds, imageIdMaps, metadataProvider);
        if (!stackImageId) {
          console.warn("Image not present in stack, can't import frame : ".concat(i, "."));
          continue;
        }
        const sourceImageMetadata = imageIdMaps.metadata[stackImageId];
        if (!sourceImageMetadata) {
          console.warn("No instance metadata for referenced image at frame : ".concat(i, "."));
          continue;
        }
        if (Rows !== sourceImageMetadata.Rows || Columns !== sourceImageMetadata.Columns) {
          throw new Error('Individual Labelmap SEG frames have different geometry dimensions (Rows and Columns) ' + 'respect to the source image reference frame. This is not yet supported. ' + 'Aborting segmentation loading. ');
        }
        const imageIdIndex = imageIdMaps.indices[stackImageId];
        const labelmapImage = labelMapImages[imageIdIndex];
        const labelmap2DView = labelmapImage.getPixelData();
        const imageVoxelManager = labelmapImage.voxelManager;
        const data = alignedPixelDataI.data;
        let segmentsOnFrameArr = segmentsOnFrame[imageIdIndex];
        if (!segmentsOnFrameArr) {
          segmentsOnFrameArr = [];
          segmentsOnFrame[imageIdIndex] = segmentsOnFrameArr;
        }
        const segSet = new Set(segmentsOnFrameArr);
        for (let k = 0, len = data.length; k < len; ++k) {
          const segIdx = data[k];
          if (segIdx !== 0) {
            if (imageVoxelManager) {
              imageVoxelManager.setAtIndex(k, segIdx);
            } else {
              labelmap2DView[k] = segIdx;
            }
            if (!segSet.has(segIdx)) {
              segmentsOnFrameArr.push(segIdx);
              segSet.add(segIdx);
            }
            if (!segmentsPixelIndices.has(segIdx)) {
              segmentsPixelIndices.set(segIdx, {});
            }
            const segmentPixelInfo = segmentsPixelIndices.get(segIdx);
            if (!segmentPixelInfo[imageIdIndex]) {
              segmentPixelInfo[imageIdIndex] = [];
            }
            segmentPixelInfo[imageIdIndex].push(k);
          }
        }
      }
      const percentComplete = Math.round(firstIndex / groupsLen * 100);
      throttledTriggerLoadProgressEvent(percentComplete);
      if (firstIndex < groupsLen) {
        setTimeout(() => processLabelmapChunk(firstIndex + imagesPerChunk), 0);
      } else {
        resolve({
          hasOverlappingSegments: false,
          arrayOfLabelMapImages: [labelMapImages]
        });
      }
    };
    const isLabelmapSegmentation = parserType === 'labelmap' || multiframe.SOPClassUID === labelmapImagesFromBuffer_LABELMAP_SEG_SOP_CLASS_UID || multiframe.SegmentationType === 'LABELMAP';
    if (isLabelmapSegmentation) {
      processLabelmapChunk(0);
    } else {
      processChunk(0);
    }
  });
}
const getAlignedPixelData = _ref1 => {
  let sharedImageOrientationPatient = _ref1.sharedImageOrientationPatient,
    PerFrameFunctionalGroups = _ref1.PerFrameFunctionalGroups,
    pixelDataChunks = _ref1.pixelDataChunks,
    sequenceIndex = _ref1.sequenceIndex,
    sliceLength = _ref1.sliceLength,
    Rows = _ref1.Rows,
    Columns = _ref1.Columns,
    validOrientations = _ref1.validOrientations,
    tolerance = _ref1.tolerance;
  const ImageOrientationPatientI = sharedImageOrientationPatient || PerFrameFunctionalGroups.PlaneOrientationSequence.ImageOrientationPatient;
  const view = readFromUnpackedChunks(pixelDataChunks, sequenceIndex * sliceLength, sliceLength);
  const pixelDataI2D = ndarray(view, [Rows, Columns]);
  const alignedPixelDataI = Segmentation_4X_alignPixelDataWithSourceData(pixelDataI2D, ImageOrientationPatientI, validOrientations, tolerance);
  if (!alignedPixelDataI) {
    throw new Error('Individual SEG frames are out of plane with respect to the first SEG frame. ' + 'This is not yet supported. Aborting segmentation loading.');
  }
  return alignedPixelDataI;
};
const checkImageDimensions = _ref10 => {
  let metadataProvider = _ref10.metadataProvider,
    imageId = _ref10.imageId,
    Rows = _ref10.Rows,
    Columns = _ref10.Columns;
  const sourceImageMetadata = metadataProvider.get('instance', imageId);
  if (Rows !== sourceImageMetadata.Rows || Columns !== sourceImageMetadata.Columns) {
    throw new Error('Individual SEG frames have different geometry dimensions (Rows and Columns) ' + 'respect to the source image reference frame. This is not yet supported. ' + 'Aborting segmentation loading. ');
  }
};
const getArrayOfLabelMapImagesWithSegmentData = _ref11 => {
  let arrayOfSegmentData = _ref11.arrayOfSegmentData,
    referencedImageIds = _ref11.referencedImageIds;
  let largestArray = [];
  for (let i = 0; i < arrayOfSegmentData.length; i++) {
    const segmentData = arrayOfSegmentData[i];
    if (segmentData.length > largestArray.length) {
      largestArray = segmentData;
    }
  }
  return arrayOfSegmentData.map(arr => {
    const labelMapImages = referencedImageIds.map((referencedImageId, i) => {
      const hasEmptySegmentData = !arr[i];
      const labelMapImage = esm.imageLoader.createAndCacheDerivedLabelmapImage(referencedImageId);
      const pixelData = labelMapImage.getPixelData();
      if (!hasEmptySegmentData) {
        for (let j = 0; j < pixelData.length; j++) {
          pixelData[j] = arr[i][j];
        }
      }
      return labelMapImage;
    }).filter(Boolean);
    return labelMapImages;
  });
};
function labelmapImagesFromBuffer_insertOverlappingPixelDataPlanar(_ref12) {
  let segmentsOnFrame = _ref12.segmentsOnFrame,
    labelMapImages = _ref12.labelMapImages,
    pixelDataChunks = _ref12.pixelDataChunks,
    multiframe = _ref12.multiframe,
    referencedImageIds = _ref12.referencedImageIds,
    validOrientations = _ref12.validOrientations,
    metadataProvider = _ref12.metadataProvider,
    tolerance = _ref12.tolerance,
    segmentsPixelIndices = _ref12.segmentsPixelIndices,
    sopUIDImageIdIndexMap = _ref12.sopUIDImageIdIndexMap,
    imageIdMaps = _ref12.imageIdMaps;
  const SharedFunctionalGroupsSequence = multiframe.SharedFunctionalGroupsSequence,
    PerFrameFunctionalGroupsSequence = multiframe.PerFrameFunctionalGroupsSequence,
    Rows = multiframe.Rows,
    Columns = multiframe.Columns;
  const sharedImageOrientationPatient = SharedFunctionalGroupsSequence.PlaneOrientationSequence ? SharedFunctionalGroupsSequence.PlaneOrientationSequence.ImageOrientationPatient : undefined;
  const sliceLength = Columns * Rows;
  const arrayOfSegmentData = getArrayOfSegmentData({
    sliceLength,
    Rows,
    Columns,
    validOrientations,
    metadataProvider,
    imageIdMaps,
    segmentsOnFrame,
    tolerance,
    pixelDataChunks,
    PerFrameFunctionalGroupsSequence,
    labelMapImages,
    sopUIDImageIdIndexMap,
    multiframe,
    sharedImageOrientationPatient,
    segmentsPixelIndices
  });
  const arrayOfLabelMapImagesWithSegmentData = getArrayOfLabelMapImagesWithSegmentData({
    arrayOfSegmentData,
    referencedImageIds
  });
  return {
    arrayOfLabelMapImages: arrayOfLabelMapImagesWithSegmentData,
    hasOverlappingSegments: true
  };
}
const getArrayOfSegmentData = _ref13 => {
  let sliceLength = _ref13.sliceLength,
    Rows = _ref13.Rows,
    Columns = _ref13.Columns,
    validOrientations = _ref13.validOrientations,
    metadataProvider = _ref13.metadataProvider,
    imageIdMaps = _ref13.imageIdMaps,
    segmentsOnFrame = _ref13.segmentsOnFrame,
    tolerance = _ref13.tolerance,
    pixelDataChunks = _ref13.pixelDataChunks,
    PerFrameFunctionalGroupsSequence = _ref13.PerFrameFunctionalGroupsSequence,
    labelMapImages = _ref13.labelMapImages,
    sopUIDImageIdIndexMap = _ref13.sopUIDImageIdIndexMap,
    multiframe = _ref13.multiframe,
    sharedImageOrientationPatient = _ref13.sharedImageOrientationPatient,
    segmentsPixelIndices = _ref13.segmentsPixelIndices;
  const arrayOfSegmentData = [];
  const numberOfSegments = multiframe.SegmentSequence.length;
  for (let currentSegmentIndex = 1; currentSegmentIndex <= numberOfSegments; ++currentSegmentIndex) {
    const segmentData = getSegmentData({
      PerFrameFunctionalGroupsSequence,
      labelMapImages,
      sopUIDImageIdIndexMap,
      multiframe,
      segmentIndex: currentSegmentIndex,
      sliceLength,
      Rows,
      Columns,
      validOrientations,
      tolerance,
      pixelDataChunks,
      sharedImageOrientationPatient,
      metadataProvider,
      imageIdMaps,
      segmentsOnFrame,
      segmentsPixelIndices
    });
    compactMergeSegmentDataWithoutInformationLoss({
      arrayOfSegmentData,
      newSegmentData: segmentData
    });
  }
  return arrayOfSegmentData;
};
const getSegmentData = _ref14 => {
  let PerFrameFunctionalGroupsSequence = _ref14.PerFrameFunctionalGroupsSequence,
    labelMapImages = _ref14.labelMapImages,
    sopUIDImageIdIndexMap = _ref14.sopUIDImageIdIndexMap,
    multiframe = _ref14.multiframe,
    segmentIndex = _ref14.segmentIndex,
    sliceLength = _ref14.sliceLength,
    Rows = _ref14.Rows,
    Columns = _ref14.Columns,
    validOrientations = _ref14.validOrientations,
    tolerance = _ref14.tolerance,
    pixelDataChunks = _ref14.pixelDataChunks,
    sharedImageOrientationPatient = _ref14.sharedImageOrientationPatient,
    metadataProvider = _ref14.metadataProvider,
    imageIdMaps = _ref14.imageIdMaps,
    segmentsOnFrame = _ref14.segmentsOnFrame,
    segmentsPixelIndices = _ref14.segmentsPixelIndices;
  const segmentData = [];
  for (let currentLabelMapImageIndex = 0; currentLabelMapImageIndex < labelMapImages.length; currentLabelMapImageIndex++) {
    const currentLabelMapImage = labelMapImages[currentLabelMapImageIndex];
    const referencedImageId = currentLabelMapImage.referencedImageId;
    const PerFrameFunctionalGroupsIndex = PerFrameFunctionalGroupsSequence.findIndex((PerFrameFunctionalGroups, currentSequenceIndex) => {
      const _extractInfoFromPerFr = extractInfoFromPerFrameFunctionalGroups({
          PerFrameFunctionalGroups,
          sequenceIndex: currentSequenceIndex,
          sopUIDImageIdIndexMap,
          multiframe
        }),
        groupsSegmentIndex = _extractInfoFromPerFr.segmentIndex,
        groupsReferenceImageId = _extractInfoFromPerFr.referencedImageId;
      const isCorrectPerFrameFunctionalGroup = groupsSegmentIndex === segmentIndex && groupsReferenceImageId === currentLabelMapImage.referencedImageId;
      return isCorrectPerFrameFunctionalGroup;
    });
    if (PerFrameFunctionalGroupsIndex === -1) {
      continue;
    }
    const PerFrameFunctionalGroups = PerFrameFunctionalGroupsSequence[PerFrameFunctionalGroupsIndex];
    const alignedPixelDataI = getAlignedPixelData({
      sharedImageOrientationPatient,
      PerFrameFunctionalGroups,
      pixelDataChunks,
      sequenceIndex: PerFrameFunctionalGroupsIndex,
      sliceLength,
      Rows,
      Columns,
      validOrientations,
      tolerance
    });
    checkImageDimensions({
      metadataProvider,
      Rows,
      Columns,
      imageId: referencedImageId
    });
    const indexCache = [];
    const segmentationDataForImageId = alignedPixelDataI.data.map((pixel, pixelIndex) => {
      const pixelValue = pixel ? segmentIndex : 0;
      if (pixelValue) {
        indexCache.push(pixelIndex);
      }
      return pixel ? segmentIndex : 0;
    });
    const hasWrittenSegmentationData = indexCache.length > 0;
    if (hasWrittenSegmentationData) {
      segmentData[currentLabelMapImageIndex] = segmentationDataForImageId;
    }
    const imageIdIndex = imageIdMaps.indices[referencedImageId];
    updateSegmentsOnFrame({
      imageIdIndex,
      segmentIndex,
      segmentsOnFrame
    });
    updateSegmentsPixelIndices({
      imageIdIndex,
      segmentIndex,
      segmentsPixelIndices,
      indexCache
    });
  }
  return segmentData;
};
async function createLabelmapsFromDICOMBuffer(referencedImageIds, arrayBuffer, metadataProvider) {
  var _options$segImageId;
  let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const dicomData = labelmapImagesFromBuffer_DicomMessage.readFile(arrayBuffer);
  const dataset = labelmapImagesFromBuffer_DicomMetaDictionary.naturalizeDataset(dicomData.dict);
  dataset._meta = labelmapImagesFromBuffer_DicomMetaDictionary.namifyDataset(dicomData.meta);
  const multiframe = labelmapImagesFromBuffer_Normalizer.normalizeToDataset([dataset]);
  const segImageId = (_options$segImageId = options.segImageId) !== null && _options$segImageId !== void 0 ? _options$segImageId : BUFFER_SEG_IMAGE_ID;
  ensureInstanceOnMetadataProvider(metadataProvider, segImageId, multiframe);
  const numberOfFrames = getSegNumberOfFramesFromDataset(multiframe);
  const frameImageIds = Array.from({
    length: numberOfFrames
  }, (_, index) => "".concat(segImageId, "#frame=").concat(index + 1));
  const decodeImageData = createDecodeImageDataFromMultiframe(multiframe);
  return createLabelmapsFromSegImageIds(referencedImageIds, segImageId, metadataProvider, labelmapImagesFromBuffer_objectSpread(labelmapImagesFromBuffer_objectSpread({}, options), {}, {
    frameImageIds,
    decodeImageData,
    multiframe
  }));
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/Segmentation/generateToolState.js



function generateToolState_generateToolState(imageIds, arrayBuffer, metadataProvider) {
  let skipOverlapping = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  let tolerance = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1e-3;
  let cs3dVersion = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 4;
  if (cs3dVersion !== 4) {
    return Segmentation_generateToolState(imageIds, arrayBuffer, metadataProvider, skipOverlapping, tolerance, cs3dVersion);
  }
  return createLabelmapsFromDICOMBuffer(imageIds, arrayBuffer, metadataProvider, {
    tolerance,
    parserType: 'bitmap'
  });
}
function createFromDicomSegImageId(referencedImageIds, segImageId, _ref) {
  let metadataProvider = _ref.metadataProvider,
    _ref$tolerance = _ref.tolerance,
    tolerance = _ref$tolerance === void 0 ? 1e-3 : _ref$tolerance,
    _ref$parserType = _ref.parserType,
    parserType = _ref$parserType === void 0 ? 'bitmap' : _ref$parserType,
    _ref$frameImageIds = _ref.frameImageIds,
    frameImageIds = _ref$frameImageIds === void 0 ? undefined : _ref$frameImageIds,
    _ref$getFrameImageId = _ref.getFrameImageId,
    getFrameImageId = _ref$getFrameImageId === void 0 ? undefined : _ref$getFrameImageId,
    _ref$decodeImageData = _ref.decodeImageData,
    decodeImageData = _ref$decodeImageData === void 0 ? undefined : _ref$decodeImageData,
    _ref$concurrency = _ref.concurrency,
    concurrency = _ref$concurrency === void 0 ? undefined : _ref$concurrency;
  return createLabelmapsFromSegImageIds(referencedImageIds, segImageId, metadataProvider, {
    tolerance,
    parserType,
    frameImageIds,
    getFrameImageId,
    decodeImageData,
    concurrency
  });
}
function createFromDICOMSegBuffer(referencedImageIds, arrayBuffer, _ref2) {
  let metadataProvider = _ref2.metadataProvider,
    _ref2$tolerance = _ref2.tolerance,
    tolerance = _ref2$tolerance === void 0 ? 1e-3 : _ref2$tolerance;
  return createLabelmapsFromDICOMBuffer(referencedImageIds, arrayBuffer, metadataProvider, {
    tolerance,
    parserType: 'bitmap'
  });
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/Segmentation/index.js





;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/ParametricMap/generateToolState.js


const ParametricMap = CornerstonePMAP.ParametricMap;
const generateToolStateCornerstone = ParametricMap.generateToolState;
function ParametricMap_generateToolState_generateToolState(imageIds, arrayBuffer, metadataProvider) {
  let skipOverlapping = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  let tolerance = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1e-3;
  return generateToolStateCornerstone(imageIds, arrayBuffer, metadataProvider, skipOverlapping, tolerance);
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/ParametricMap/index.js


;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/RTStruct/utilities/getReferencedFrameOfReferenceSequence.js
function getReferencedFrameOfReferenceSequence(referencedFrameOfReferenceSequence, metadata, _options) {
  const FrameOfReferenceUID = metadata.FrameOfReferenceUID;
  referencedFrameOfReferenceSequence || (referencedFrameOfReferenceSequence = []);
  let referencedItem = referencedFrameOfReferenceSequence.find(it => it.FrameOfReferenceUID === FrameOfReferenceUID);
  if (!referencedItem) {
    referencedItem = {
      FrameOfReferenceUID
    };
    referencedFrameOfReferenceSequence.push(referencedItem);
  }
  return referencedFrameOfReferenceSequence;
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/RTStruct/utilities/getReferencedSeriesSequence.js



const getReferencedSeriesSequence_MetadataModules = esm.Enums.MetadataModules;
function getReferencedSeriesSequence(referencedSeriesSequence, metadata, options) {
  const metadataProvider = (options === null || options === void 0 ? void 0 : options.metadataProvider) || esm.metaData;
  const imageId = metadata.referencedImageId;
  const newReferenceSeq = metadataProvider.get(getReferencedSeriesSequence_MetadataModules.REFERENCED_SERIES_REFERENCE, imageId);
  referencedSeriesSequence || (referencedSeriesSequence = []);
  if (newReferenceSeq) {
    const newSeriesUid = newReferenceSeq.ReferencedSeriesInstanceUID,
      _newReferenceSeq$Refe = (0,slicedToArray/* ["default"] */.A)(newReferenceSeq.ReferencedInstanceSequence, 1),
      newSopUID = _newReferenceSeq$Refe[0].ReferencedSOPInstanceUID;
    const existingSeries = referencedSeriesSequence.find(it => it.ReferencedSeriesInstanceUID === newSeriesUid);
    if (!existingSeries) {
      referencedSeriesSequence.push(newReferenceSeq);
      return referencedSeriesSequence;
    }
    if (existingSeries.ReferencedInstanceSequence.find(it => it.ReferencedSOPInstanceUID === newSopUID)) {
      return referencedSeriesSequence;
    }
    const referencedInstanceSeq = newReferenceSeq.ReferencedInstanceSequence;
    existingSeries.ReferencedInstanceSequence.push(Array.isArray(referencedInstanceSeq) ? referencedInstanceSeq[0] : referencedInstanceSeq);
  }
  return referencedSeriesSequence;
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/RTStruct/utilities/getRTROIObservationsSequence.js
function getRTROIObservationsSequence(segment, index, options) {
  var _segment$segmentIndex;
  return {
    ObservationNumber: index + 1,
    ReferencedROINumber: (_segment$segmentIndex = segment.segmentIndex) !== null && _segment$segmentIndex !== void 0 ? _segment$segmentIndex : index + 1,
    RTROIInterpretedType: (options === null || options === void 0 ? void 0 : options.interpretedType) || 'ORGAN',
    ROIInterpreter: (options === null || options === void 0 ? void 0 : options.observerName) || ''
  };
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/RTStruct/utilities/getStructureSetModule.js
function getStructureSetModule(contour, segment) {
  const FrameOfReferenceUID = contour.metadata.FrameOfReferenceUID;
  return {
    ROINumber: segment.segmentIndex,
    ROIName: segment.label,
    ROIDescription: segment.label,
    ROIGenerationAlgorithm: 'MANUAL',
    ReferencedFrameOfReferenceUID: FrameOfReferenceUID
  };
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/utilities/referencedMetadataProvider.js





function referencedMetadataProvider_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function referencedMetadataProvider_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? referencedMetadataProvider_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : referencedMetadataProvider_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const referencedMetadataProvider_DicomMetaDictionary = dcmjs_es/* ["default"].data.DicomMetaDictionary */.Ay.data.DicomMetaDictionary;
const referencedMetadataProvider_MetadataModules = esm.Enums.MetadataModules;
const STUDY_MODULES = [referencedMetadataProvider_MetadataModules.GENERAL_STUDY, referencedMetadataProvider_MetadataModules.PATIENT_STUDY, referencedMetadataProvider_MetadataModules.PATIENT];
const SERIES_MODULES = [referencedMetadataProvider_MetadataModules.GENERAL_SERIES];
const IMAGE_MODULES = [referencedMetadataProvider_MetadataModules.GENERAL_IMAGE, referencedMetadataProvider_MetadataModules.IMAGE_PLANE, referencedMetadataProvider_MetadataModules.CINE, referencedMetadataProvider_MetadataModules.VOI_LUT, referencedMetadataProvider_MetadataModules.MODALITY_LUT, referencedMetadataProvider_MetadataModules.SOP_COMMON];
const referencedMetadataProvider_metadataProvider = {
  get: function (type, imageId, options) {
    var _metadataProvider$typ;
    return (_metadataProvider$typ = referencedMetadataProvider_metadataProvider[type]) === null || _metadataProvider$typ === void 0 ? void 0 : _metadataProvider$typ.call(referencedMetadataProvider_metadataProvider, imageId, options);
  },
  [referencedMetadataProvider_MetadataModules.IMAGE_SOP_INSTANCE_REFERENCE]: function (imageId) {
    const frameModule = esm.metaData.get(referencedMetadataProvider_MetadataModules.FRAME_MODULE, imageId);
    const sopClassUID = frameModule.sopClassUID,
      sopInstanceUID = frameModule.sopInstanceUID,
      frameNumber = frameModule.frameNumber,
      numberOfFrames = frameModule.numberOfFrames;
    if (numberOfFrames > 1) {
      return {
        ReferencedSOPClassUID: sopClassUID,
        ReferencedSOPInstanceUID: sopInstanceUID,
        ReferencedFrameNumber: frameNumber
      };
    }
    return {
      ReferencedSOPClassUID: frameModule.sopClassUID,
      ReferencedSOPInstanceUID: frameModule.sopInstanceUID
    };
  },
  [referencedMetadataProvider_MetadataModules.REFERENCED_SERIES_REFERENCE]: imageId => {
    const sopModule = esm.metaData.get(referencedMetadataProvider_MetadataModules.SOP_COMMON, imageId);
    const seriesModule = esm.metaData.get(referencedMetadataProvider_MetadataModules.GENERAL_SERIES, imageId);
    return {
      SeriesInstanceUID: seriesModule.seriesInstanceUID,
      ReferencedInstanceSequence: [{
        ReferencedSOPClassUID: sopModule.sopClassUID,
        ReferencedSOPInstanceUID: sopModule.sopInstanceUID
      }]
    };
  },
  [referencedMetadataProvider_MetadataModules.PREDECESSOR_SEQUENCE]: imageId => {
    const result = referencedMetadataProvider_objectSpread({}, esm.metaData.get(referencedMetadataProvider_MetadataModules.SERIES_DATA, imageId));
    const generalImage = esm.metaData.get(referencedMetadataProvider_MetadataModules.GENERAL_IMAGE, imageId);
    const study = esm.metaData.get(referencedMetadataProvider_MetadataModules.GENERAL_STUDY, imageId);
    result.InstanceNumber = 1 + Number(generalImage.instanceNumber);
    result.PredecessorDocumentsSequence = {
      StudyInstanceUID: study.studyInstanceUID,
      ReferencedSeriesSequence: {
        SeriesInstanceUID: result.SeriesInstanceUID,
        ReferencedSOPSequence: {
          ReferencedSOPClassUID: generalImage.sopClassUID,
          ReferencedSOPInstanceUID: generalImage.sopInstanceUID
        }
      }
    };
    return result;
  },
  [referencedMetadataProvider_MetadataModules.STUDY_DATA]: imageId => {
    return esm.metaData.getNormalized(imageId, STUDY_MODULES);
  },
  [referencedMetadataProvider_MetadataModules.SERIES_DATA]: imageId => {
    return esm.metaData.getNormalized(imageId, SERIES_MODULES);
  },
  [referencedMetadataProvider_MetadataModules.IMAGE_DATA]: imageId => {
    return esm.metaData.getNormalized(imageId, IMAGE_MODULES);
  },
  [referencedMetadataProvider_MetadataModules.RTSS_INSTANCE_DATA]: imageId => {
    const newInstanceData = esm.metaData.get(referencedMetadataProvider_MetadataModules.NEW_INSTANCE_DATA, imageId);
    return referencedMetadataProvider_objectSpread(referencedMetadataProvider_objectSpread({}, newInstanceData), {}, {
      SeriesNumber: '3201',
      StructureSetROISequence: [],
      ROIContourSequence: [],
      RTROIObservationsSequence: [],
      ReferencedFrameOfReferenceSequence: [],
      Modality: 'RTSTRUCT',
      SOPClassUID: '1.2.840.10008.5.1.4.1.1.481.3',
      PositionReferenceIndicator: '',
      StructureSetLabel: '',
      StructureSetName: '',
      StructureSetDate: referencedMetadataProvider_DicomMetaDictionary.date(),
      StructureSetTime: referencedMetadataProvider_DicomMetaDictionary.time()
    });
  },
  [referencedMetadataProvider_MetadataModules.NEW_INSTANCE_DATA]: imageId => {
    const studyData = esm.metaData.get(referencedMetadataProvider_MetadataModules.STUDY_DATA, imageId);
    return referencedMetadataProvider_objectSpread(referencedMetadataProvider_objectSpread({}, studyData), {}, {
      SeriesNumber: '50000',
      InstanceNumber: '1',
      OperatorsName: '',
      ReferringPhysicianName: '',
      SpecificCharacterSet: 'ISO_IR 192',
      Manufacturer: 'cs3d',
      SOPInstanceUID: referencedMetadataProvider_DicomMetaDictionary.uid(),
      SeriesInstanceUID: referencedMetadataProvider_DicomMetaDictionary.uid()
    });
  },
  [referencedMetadataProvider_MetadataModules.RTSS_CONTOUR]: () => metaRTSSContour,
  [referencedMetadataProvider_MetadataModules.SR_ANNOTATION]: () => metaSRAnnotation
};
esm.metaData.addProvider(referencedMetadataProvider_metadataProvider.get, 9023);



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/utilities/createInstance.js



const createInstance_MetadataModules = esm.Enums.MetadataModules;
function assignDefined(dest, source, options) {
  if (!source) {
    return;
  }
  for (const _ref of Object.entries(source)) {
    var _ref2 = (0,slicedToArray/* ["default"] */.A)(_ref, 2);
    const key = _ref2[0];
    const value = _ref2[1];
    if (value === undefined) {
      continue;
    }
    if (dest[key] === undefined && options !== null && options !== void 0 && options.requireDestinationKey) {
      continue;
    }
    dest[key] = value;
  }
}
function createInstance(instanceKey, studyExemplarImageId, base, options) {
  const _options$metadataProv = options.metadataProvider,
    metadataProvider = _options$metadataProv === void 0 ? esm.metaData : _options$metadataProv,
    predecessorImageId = options.predecessorImageId;
  const result = {};
  const instanceBase = metadataProvider.get(instanceKey, studyExemplarImageId);
  Object.assign(result, instanceBase);
  assignDefined(result, base);
  assignDefined(result, options, {
    requireDestinationKey: true
  });
  if (predecessorImageId) {
    const predecessor = metadataProvider.get(createInstance_MetadataModules.PREDECESSOR_SEQUENCE, predecessorImageId);
    Object.assign(result, predecessor);
  }
  return result;
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/RTStruct/RTSS.js










function RTSS_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function RTSS_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? RTSS_ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* ["default"] */.A)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : RTSS_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const _utilities$contours = dist_esm.utilities.contours,
  generateContourSetsFromLabelmap = _utilities$contours.generateContourSetsFromLabelmap,
  AnnotationToPointData = _utilities$contours.AnnotationToPointData;
const RTSS_MetadataModules = esm.Enums.MetadataModules;
function generateRTSSFromSegmentations(segmentation, metadataProvider, _DicomMetadataStore) {
  return generateRTSSFromLabelmap(segmentation, {
    metadataProvider,
    _DicomMetadataStore
  });
}
async function generateRTSSFromLabelmap(segmentations, options) {
  var _dataset$ReferencedFr;
  const _options$metadataProv = options.metadataProvider,
    metadataProvider = _options$metadataProv === void 0 ? esm.metaData : _options$metadataProv;
  const roiContours = [];
  const contourSets = await generateContourSetsFromLabelmap({
    segmentations
  });
  contourSets.forEach((contourSet, segIndex) => {
    if (contourSet) {
      const contourSequence = [];
      contourSet.sliceContours.forEach(sliceContour => {
        const ContourImageSequence = metadataProvider.get('ImageSopInstanceReference', sliceContour.referencedImageId);
        const polyDataPoints = sliceContour.polyData.points;
        sliceContour.contours.forEach((contour, index) => {
          const ContourGeometricType = contour.type;
          const NumberOfContourPoints = contour.contourPoints.length;
          const ContourData = [];
          contour.contourPoints.forEach(point => {
            const pointData = polyDataPoints[point];
            ContourData.push(...pointData.map(v => v.toFixed(2)));
          });
          contourSequence.push({
            ContourImageSequence,
            ContourGeometricType,
            NumberOfContourPoints,
            ContourNumber: index + 1,
            ContourData
          });
        });
      });
      const segLabel = contourSet.label || "Segment ".concat(segIndex + 1);
      const ROIContour = {
        name: segLabel,
        description: segLabel,
        contourSequence,
        color: contourSet.color.slice(0, 3),
        metadata: contourSet.metadata
      };
      roiContours.push(ROIContour);
    }
  });
  const dataset = _initializeDataset(segmentations, roiContours[0].metadata, options);
  roiContours.forEach((contour, index) => {
    const roiContour = {
      ROIDisplayColor: contour.color || [255, 0, 0],
      ContourSequence: contour.contourSequence,
      ReferencedROINumber: index + 1
    };
    const segment = segmentations.segments[index + 1];
    dataset.StructureSetROISequence.push(getStructureSetModule(contour, segment));
    dataset.RTROIObservationsSequence.push(getRTROIObservationsSequence(segment, index, options));
    dataset.ROIContourSequence.push(roiContour);
    dataset.ReferencedSeriesSequence = getReferencedSeriesSequence(dataset.ReferencedSeriesSequence, contour.metadata, options);
    dataset.ReferencedFrameOfReferenceSequence = getReferencedFrameOfReferenceSequence(dataset.ReferencedFrameOfReferenceSequence, contour.metadata);
  });
  if (((_dataset$ReferencedFr = dataset.ReferencedFrameOfReferenceSequence) === null || _dataset$ReferencedFr === void 0 ? void 0 : _dataset$ReferencedFr.length) === 1) {
    dataset.FrameOfReferenceUID = dataset.ReferencedFrameOfReferenceSequence[0].FrameOfReferenceUID;
  }
  return dataset;
}
function generateRTSSFromAnnotations(segmentations, annotations, options) {
  var _dataset$ReferencedFr2;
  const dataset = _initializeDataset(segmentations, annotations[0].metadata, options);
  const segmentsContour = new Map();
  annotations.forEach((annotation, index) => {
    const segmentation = annotation.data.segmentation;
    if (!segmentation) {
      console.warn('Annotation is not a segmentation:', annotation);
      return;
    }
    const segmentationId = segmentation.segmentationId,
      segmentIndex = segmentation.segmentIndex;
    const key = "".concat(segmentationId, ":").concat(segmentIndex);
    let segmentAnnotation = segmentsContour.get(key);
    if (!segmentAnnotation) {
      const segment = segmentations.segments[segmentIndex];
      const structureSetModule = getStructureSetModule(annotation, segment);
      dataset.StructureSetROISequence.push(structureSetModule);
      dataset.RTROIObservationsSequence.push(getRTROIObservationsSequence(segment, index, options));
      segmentAnnotation = RTSS_objectSpread(RTSS_objectSpread({}, segmentation), {}, {
        annotations: [],
        structureSetModule,
        segment,
        roiContourSequence: null
      });
      segmentsContour.set(key, segmentAnnotation);
    }
    const roiContourSequence = AnnotationToPointData.convert(annotation, segmentAnnotation.segment, esm.metaData);
    if (segmentAnnotation.roiContourSequence) {
      segmentAnnotation.roiContourSequence.ContourSequence.push(...roiContourSequence.ContourSequence);
    } else {
      dataset.ROIContourSequence.push(roiContourSequence);
      segmentAnnotation.roiContourSequence = roiContourSequence;
    }
    dataset.ReferencedSeriesSequence = getReferencedSeriesSequence(dataset.ReferencedSeriesSequence, annotation.metadata, options);
    dataset.ReferencedFrameOfReferenceSequence = getReferencedFrameOfReferenceSequence(dataset.ReferencedFrameOfReferenceSequence, annotation.metadata);
  });
  if (((_dataset$ReferencedFr2 = dataset.ReferencedFrameOfReferenceSequence) === null || _dataset$ReferencedFr2 === void 0 ? void 0 : _dataset$ReferencedFr2.length) === 1) {
    dataset.FrameOfReferenceUID = dataset.ReferencedFrameOfReferenceSequence[0].FrameOfReferenceUID;
  }
  return dataset;
}
function _initializeDataset(segmentation, imgMetadata, options) {
  const studyExemplarImageId = imgMetadata.referencedImageId;
  return createInstance(RTSS_MetadataModules.RTSS_INSTANCE_DATA, studyExemplarImageId, {
    StructureSetLabel: segmentation.label,
    StructureSetName: segmentation.label,
    SeriesDescription: segmentation.label,
    _meta: esm.metaData.get(RTSS_MetadataModules.RTSS_CONTOUR, studyExemplarImageId)
  }, options);
}
function generateRTSSFromContour(segmentations, options) {
  const annotationUIDsMap = segmentations.representationData.Contour.annotationUIDsMap;
  const annotations = [];
  for (const annotationSet of annotationUIDsMap.values()) {
    for (const annotationUID of annotationSet.values()) {
      const annotation$1 = dist_esm.annotation.state.getAnnotation(annotationUID);
      if (!annotation$1) {
        console.error('Unable to find an annotation for UID', annotationUID);
        continue;
      }
      annotations.push(annotation$1);
    }
  }
  return generateRTSSFromAnnotations(segmentations, annotations, options);
}
function generateRTSSFromRepresentation(segmentations) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (segmentations.representationData.Labelmap) {
    return generateRTSSFromLabelmap(segmentations, options);
  }
  if (segmentations.representationData.Contour) {
    return generateRTSSFromContour(segmentations, options);
  }
  throw new Error("No representation available to save to RTSS: ".concat(Object.keys(segmentations.representationData)));
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/RTStruct/index.js



const RTStruct_generateContourSetsFromLabelmap = dist_esm.utilities.contours.generateContourSetsFromLabelmap;



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/KeyImage.js



var _KeyImage;
const KeyImage_TID300Point = dcmjs_es/* .utilities.TID300.Point */.BF.TID300.Point;
class KeyImage extends Probe {
  static getMeasurementData(measurementGroup, sopInstanceUIDToImageIdMap, metadata, trackingIdentifier) {
    const baseData = super.getMeasurementData(measurementGroup, sopInstanceUIDToImageIdMap, metadata, trackingIdentifier);
    const data = baseData.annotation.data;
    data.isPoint = trackingIdentifier.indexOf('Point') !== -1;
    return baseData;
  }
  static getTID300RepresentationArguments(tool) {
    const tid300Arguments = super.getTID300RepresentationArguments(tool);
    const data = tool.data;
    if (data.isPoint) {
      if (data.seriesLevel) {
        tid300Arguments.trackingIdentifierTextValue = this.trackingSeriesPointIdentifier;
      } else {
        tid300Arguments.trackingIdentifierTextValue = this.trackingPointIdentifier;
      }
    }
    if (data.seriesLevel) {
      tid300Arguments.trackingIdentifierTextValue = this.trackingSeriesIdentifier;
    }
    if (!tid300Arguments.points.length) {
      tid300Arguments.points.push({
        x: 0,
        y: 0
      });
    }
    return tid300Arguments;
  }
}
_KeyImage = KeyImage;
_KeyImage.init('KeyImage', KeyImage_TID300Point, {
  parentType: Probe.toolType
});
_KeyImage.trackingSeriesIdentifier = "".concat(_KeyImage.trackingIdentifierTextValue, ":Series");
_KeyImage.trackingPointIdentifier = "".concat(_KeyImage.trackingIdentifierTextValue, ":Point");
_KeyImage.trackingSeriesPointIdentifier = "".concat(_KeyImage.trackingIdentifierTextValue, ":SeriesPoint");



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/index.js





















const Cornerstone3DSR = {
  BaseAdapter3D: BaseAdapter3D,
  Bidirectional: Bidirectional_Bidirectional,
  CobbAngle: CobbAngle_CobbAngle,
  Angle: Angle_Angle,
  Length: Length_Length,
  CircleROI: CircleROI,
  EllipticalROI: EllipticalROI,
  RectangleROI: RectangleROI,
  ArrowAnnotate: ArrowAnnotate_ArrowAnnotate,
  Probe: Probe,
  PlanarFreehandROI: PlanarFreehandROI,
  UltrasoundDirectional: UltrasoundDirectional,
  KeyImage: KeyImage,
  MeasurementReport: MeasurementReport_MeasurementReport,
  CodeScheme: CodingScheme,
  CORNERSTONE_3D_TAG: CORNERSTONE_3D_TAG,
  COMMENT_CODE: COMMENT_CODE,
  NO_IMAGE_ID: NO_IMAGE_ID,
  TEXT_ANNOTATION_POSITION: TEXT_ANNOTATION_POSITION
};
const Cornerstone3DSEG = {
  Segmentation: Cornerstone3D_Segmentation_namespaceObject
};
const Cornerstone3DPMAP = {
  ParametricMap: Cornerstone3D_ParametricMap_namespaceObject
};
const Cornerstone3DRT = {
  RTSS: RTStruct_namespaceObject
};



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/VTKjs/Segmentation.js


const Colors = dcmjs_es/* .data.Colors */.p.Colors,
  Segmentation_BitArray = dcmjs_es/* .data.BitArray */.p.BitArray;

// TODO: Is there a better name for this? RGBAInt?
// Should we move it to Colors.js
function dicomlab2RGBA(cielab) {
  const rgba = Colors.dicomlab2RGB(cielab).map(x => Math.round(x * 255));
  rgba.push(255);
  return rgba;
}

// TODO: Copied these functions in from VTK Math so we don't need a dependency.
// I guess we should put them somewhere
// https://github.com/Kitware/vtk-js/blob/master/Sources/Common/Core/Math/index.js
function cross(x, y, out) {
  const Zx = x[1] * y[2] - x[2] * y[1];
  const Zy = x[2] * y[0] - x[0] * y[2];
  const Zz = x[0] * y[1] - x[1] * y[0];
  out[0] = Zx;
  out[1] = Zy;
  out[2] = Zz;
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
function subtract(a, b, out) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
}

// TODO: This is a useful utility on its own. We should move it somewhere?
// dcmjs.adapters.vtk.Multiframe? dcmjs.utils?
function geometryFromFunctionalGroups(dataset, PerFrameFunctionalGroups) {
  const geometry = {};
  const pixelMeasures = dataset.SharedFunctionalGroupsSequence.PixelMeasuresSequence;
  const planeOrientation = dataset.SharedFunctionalGroupsSequence.PlaneOrientationSequence;

  // Find the origin of the volume from the PerFrameFunctionalGroups' ImagePositionPatient values
  //
  // TODO: assumes sorted frames. This should read the ImagePositionPatient from each frame and
  // sort them to obtain the first and last position along the acquisition axis.
  const firstFunctionalGroup = PerFrameFunctionalGroups[0];
  const lastFunctionalGroup = PerFrameFunctionalGroups[PerFrameFunctionalGroups.length - 1];
  const firstPosition = firstFunctionalGroup.PlanePositionSequence.ImagePositionPatient.map(Number);
  const lastPosition = lastFunctionalGroup.PlanePositionSequence.ImagePositionPatient.map(Number);
  geometry.origin = firstPosition;

  // NB: DICOM PixelSpacing is defined as Row then Column,
  // unlike ImageOrientationPatient
  geometry.spacing = [pixelMeasures.PixelSpacing[1], pixelMeasures.PixelSpacing[0], pixelMeasures.SpacingBetweenSlices].map(Number);
  geometry.dimensions = [dataset.Columns, dataset.Rows, PerFrameFunctionalGroups.length].map(Number);
  const orientation = planeOrientation.ImageOrientationPatient.map(Number);
  const columnStepToPatient = orientation.slice(0, 3);
  const rowStepToPatient = orientation.slice(3, 6);
  geometry.planeNormal = [];
  cross(columnStepToPatient, rowStepToPatient, geometry.planeNormal);
  geometry.sliceStep = [];
  subtract(lastPosition, firstPosition, geometry.sliceStep);
  normalize(geometry.sliceStep);
  geometry.direction = columnStepToPatient.concat(rowStepToPatient).concat(geometry.sliceStep);
  return geometry;
}
class Segmentation_Segmentation {
  constructor() {}

  /**
   * Produces an array of Segments from an input DICOM Segmentation dataset
   *
   * Segments are returned with Geometry values that can be used to create
   * VTK Image Data objects.
   *
   * @example Example usage to create VTK Volume actors from each segment:
   *
   * const actors = [];
   * const segments = generateToolState(dataset);
   * segments.forEach(segment => {
   *   // now make actors using the segment information
   *   const scalarArray = vtk.Common.Core.vtkDataArray.newInstance({
   *        name: "Scalars",
   *        numberOfComponents: 1,
   *        values: segment.pixelData,
   *    });
   *
   *    const imageData = vtk.Common.DataModel.vtkImageData.newInstance();
   *    imageData.getPointData().setScalars(scalarArray);
   *    imageData.setDimensions(geometry.dimensions);
   *    imageData.setSpacing(geometry.spacing);
   *    imageData.setOrigin(geometry.origin);
   *    imageData.setDirection(geometry.direction);
   *
   *    const mapper = vtk.Rendering.Core.vtkVolumeMapper.newInstance();
   *    mapper.setInputData(imageData);
   *    mapper.setSampleDistance(2.);
   *
   *    const actor = vtk.Rendering.Core.vtkVolume.newInstance();
   *    actor.setMapper(mapper);
   *
   *    actors.push(actor);
   * });
   *
   * @param dataset
   * @return {{}}
   */
  static generateSegments(dataset) {
    if (dataset.SegmentSequence.constructor.name !== 'Array') {
      dataset.SegmentSequence = [dataset.SegmentSequence];
    }
    dataset.SegmentSequence.forEach(segment => {
      // TODO: other interesting fields could be extracted from the segment
      // TODO: Read SegmentsOverlay field
      // http://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_C.8.20.2.html

      // TODO: Looks like vtkColor only wants RGB in 0-1 values.
      // Why was this example converting to RGBA with 0-255 values?
      const color = dicomlab2RGBA(segment.RecommendedDisplayCIELabValue);
      segments[segment.SegmentNumber] = {
        color,
        functionalGroups: [],
        offset: null,
        size: null,
        pixelData: null
      };
    });

    // make a list of functional groups per segment
    dataset.PerFrameFunctionalGroupsSequence.forEach(functionalGroup => {
      const segmentNumber = functionalGroup.SegmentIdentificationSequence.ReferencedSegmentNumber;
      segments[segmentNumber].functionalGroups.push(functionalGroup);
    });

    // determine per-segment index into the pixel data
    // TODO: only handles one-bit-per pixel
    const frameSize = Math.ceil(dataset.Rows * dataset.Columns / 8);
    let nextOffset = 0;
    Object.keys(segments).forEach(segmentNumber => {
      const segment = segments[segmentNumber];
      segment.numberOfFrames = segment.functionalGroups.length;
      segment.size = segment.numberOfFrames * frameSize;
      segment.offset = nextOffset;
      nextOffset = segment.offset + segment.size;
      const packedSegment = dataset.PixelData.slice(segment.offset, nextOffset);
      segment.pixelData = Segmentation_BitArray.unpack(packedSegment);
      const geometry = geometryFromFunctionalGroups(dataset, segment.functionalGroups);
      segment.geometry = geometry;
    });
    return segments;
  }
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/VTKjs/index.js


const VTKjsSEG = {
  Segmentation: Segmentation_Segmentation
};



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/index.js









const adaptersSR = {
  Cornerstone: CornerstoneSR,
  Cornerstone3D: Cornerstone3DSR
};
const adaptersSEG = {
  Cornerstone: CornerstoneSEG,
  Cornerstone3D: Cornerstone3DSEG,
  VTKjs: VTKjsSEG
};
const adaptersPMAP = {
  Cornerstone: CornerstonePMAP,
  Cornerstone3D: Cornerstone3DPMAP
};
const adaptersRT = {
  Cornerstone3D: Cornerstone3DRT
};



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/utilities/index.js



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/enums/index.js


;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/graphicTypeEquals.js
const graphicTypeEquals = graphicType => {
  return contentItem => {
    return contentItem && contentItem.GraphicType === graphicType;
  };
};



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/index.js










;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/index.js










},

}]);