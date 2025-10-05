(self["webpackChunk"] = self["webpackChunk"] || []).push([[908],{

/***/ 93468:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  fX: () => (/* reexport */ enums_namespaceObject),
  X6: () => (/* reexport */ adaptersPMAP),
  f_: () => (/* reexport */ adaptersRT),
  ql: () => (/* reexport */ adaptersSEG),
  QX: () => (/* reexport */ adaptersSR),
  _$: () => (/* reexport */ helpers_namespaceObject)
});

// NAMESPACE OBJECT: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/Segmentation.js
var Segmentation_namespaceObject = {};
__webpack_require__.r(Segmentation_namespaceObject);
__webpack_require__.d(Segmentation_namespaceObject, {
  fillSegmentation: () => (Segmentation_fillSegmentation),
  generateSegmentation: () => (Segmentation_generateSegmentation),
  generateToolState: () => (Segmentation_generateToolState)
});

// NAMESPACE OBJECT: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/Segmentation/index.js
var Cornerstone3D_Segmentation_namespaceObject = {};
__webpack_require__.r(Cornerstone3D_Segmentation_namespaceObject);
__webpack_require__.d(Cornerstone3D_Segmentation_namespaceObject, {
  createFromDICOMSegBuffer: () => (createFromDICOMSegBuffer),
  generateLabelMaps2DFrom3D: () => (generateLabelMaps2DFrom3D),
  generateSegmentation: () => (generateSegmentation_generateSegmentation),
  generateToolState: () => (generateToolState_generateToolState)
});

// NAMESPACE OBJECT: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/ParametricMap/index.js
var Cornerstone3D_ParametricMap_namespaceObject = {};
__webpack_require__.r(Cornerstone3D_ParametricMap_namespaceObject);
__webpack_require__.d(Cornerstone3D_ParametricMap_namespaceObject, {
  generateToolState: () => (ParametricMap_generateToolState_generateToolState)
});

// NAMESPACE OBJECT: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/RTStruct/index.js
var RTStruct_namespaceObject = {};
__webpack_require__.r(RTStruct_namespaceObject);
__webpack_require__.d(RTStruct_namespaceObject, {
  generateContourSetsFromLabelmap: () => (RTStruct_generateContourSetsFromLabelmap),
  generateRTSSFromAnnotations: () => (generateRTSSFromAnnotations),
  generateRTSSFromSegmentations: () => (generateRTSSFromSegmentations)
});

// NAMESPACE OBJECT: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/enums/index.js
var enums_namespaceObject = {};
__webpack_require__.r(enums_namespaceObject);
__webpack_require__.d(enums_namespaceObject, {
  s: () => (Events)
});

// NAMESPACE OBJECT: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/index.js
var helpers_namespaceObject = {};
__webpack_require__.r(helpers_namespaceObject);
__webpack_require__.d(helpers_namespaceObject, {
  vk: () => (downloadDICOMData)
});

// EXTERNAL MODULE: ../../../node_modules/dcmjs/build/dcmjs.es.js
var dcmjs_es = __webpack_require__(5842);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/toArray.js
const toArray = x => Array.isArray(x) ? x : [x];



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/codeMeaningEquals.js
const codeMeaningEquals = codeMeaningName => {
  return contentItem => {
    return contentItem.ConceptNameCodeSequence.CodeMeaning === codeMeaningName;
  };
};



// EXTERNAL MODULE: ../../../node_modules/buffer/index.js
var node_modules_buffer = __webpack_require__(81429);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/MeasurementReport.js





const {
  TID1500,
  addAccessors
} = dcmjs_es/* utilities */.BF;
const {
  StructuredReport
} = dcmjs_es/* derivations */.h4;
const {
  Normalizer
} = dcmjs_es/* normalizers */.z8;
const {
  TID1500MeasurementReport,
  TID1501MeasurementGroup
} = TID1500;
const {
  DicomMetaDictionary
} = dcmjs_es/* data */.p;
const FINDING = {
  CodingSchemeDesignator: "DCM",
  CodeValue: "121071"
};
const FINDING_SITE = {
  CodingSchemeDesignator: "SCT",
  CodeValue: "363698007"
};
const FINDING_SITE_OLD = {
  CodingSchemeDesignator: "SRT",
  CodeValue: "G-C0E3"
};
const codeValueMatch = (group, code, oldCode) => {
  const {
    ConceptNameCodeSequence
  } = group;
  if (!ConceptNameCodeSequence) {
    return;
  }
  const {
    CodingSchemeDesignator,
    CodeValue
  } = ConceptNameCodeSequence;
  return CodingSchemeDesignator == code.CodingSchemeDesignator && CodeValue == code.CodeValue || oldCode && CodingSchemeDesignator == oldCode.CodingSchemeDesignator && CodeValue == oldCode.CodeValue;
};
function getTID300ContentItem(tool, ReferencedSOPSequence, adapterClass) {
  const args = adapterClass.getTID300RepresentationArguments(tool);
  args.ReferencedSOPSequence = ReferencedSOPSequence;
  const TID300Measurement = new adapterClass.TID300Representation(args);
  return TID300Measurement;
}
function getMeasurementGroup(toolType, toolData, ReferencedSOPSequence) {
  const toolTypeData = toolData[toolType];
  const toolClass = MeasurementReport.CORNERSTONE_TOOL_CLASSES_BY_TOOL_TYPE[toolType];
  if (!toolTypeData || !toolTypeData.data || !toolTypeData.data.length || !toolClass) {
    return;
  }

  // Loop through the array of tool instances
  // for this tool
  const Measurements = toolTypeData.data.map(tool => {
    return getTID300ContentItem(tool, ReferencedSOPSequence, toolClass);
  });
  return new TID1501MeasurementGroup(Measurements);
}
class MeasurementReport {
  static getSetupMeasurementData(MeasurementGroup) {
    const {
      ContentSequence
    } = MeasurementGroup;
    const contentSequenceArr = toArray(ContentSequence);
    const findingGroup = contentSequenceArr.find(group => codeValueMatch(group, FINDING));
    const findingSiteGroups = contentSequenceArr.filter(group => codeValueMatch(group, FINDING_SITE, FINDING_SITE_OLD)) || [];
    const NUMGroup = contentSequenceArr.find(group => group.ValueType === "NUM");
    const SCOORDGroup = toArray(NUMGroup.ContentSequence).find(group => group.ValueType === "SCOORD");
    const {
      ReferencedSOPSequence
    } = SCOORDGroup.ContentSequence;
    const {
      ReferencedSOPInstanceUID,
      ReferencedFrameNumber
    } = ReferencedSOPSequence;
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
      throw new Error("No measurements provided.");
    }

    /* Patient ID
    Warning - Missing attribute or value that would be needed to build DICOMDIR - Patient ID
    Warning - Missing attribute or value that would be needed to build DICOMDIR - Study Date
    Warning - Missing attribute or value that would be needed to build DICOMDIR - Study Time
    Warning - Missing attribute or value that would be needed to build DICOMDIR - Study ID
     */
    const generalSeriesModule = metadataProvider.get("generalSeriesModule", firstImageId);

    //const sopCommonModule = metadataProvider.get('sopCommonModule', firstImageId);

    // NOTE: We are getting the Series and Study UIDs from the first imageId of the toolState
    // which means that if the toolState is for multiple series, the report will have the incorrect
    // SeriesInstanceUIDs
    const {
      studyInstanceUID,
      seriesInstanceUID
    } = generalSeriesModule;

    // Loop through each image in the toolData
    Object.keys(toolState).forEach(imageId => {
      const sopCommonModule = metadataProvider.get("sopCommonModule", imageId);
      const frameNumber = metadataProvider.get("frameNumber", imageId);
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
    const MeasurementReport = new TID1500MeasurementReport({
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
        vr: "OB"
      },
      //MediaStorageSOPClassUID
      //MediaStorageSOPInstanceUID: sopCommonModule.sopInstanceUID,
      TransferSyntaxUID: {
        Value: ["1.2.840.10008.1.2.1"],
        vr: "UI"
      },
      ImplementationClassUID: {
        Value: [DicomMetaDictionary.uid()],
        // TODO: could be git hash or other valid id
        vr: "UI"
      },
      ImplementationVersionName: {
        Value: ["dcmjs"],
        vr: "SH"
      }
    };
    const _vrMap = {
      PixelData: "OW"
    };
    derivationSourceDataset._meta = _meta;
    derivationSourceDataset._vrMap = _vrMap;
    const report = new StructuredReport([derivationSourceDataset]);
    const contentItem = MeasurementReport.contentItem(derivationSourceDataset);

    // Merge the derived dataset with the content from the Measurement Report
    report.dataset = Object.assign(report.dataset, contentItem);
    report.dataset._meta = _meta;
    report.dataset.SpecificCharacterSet = "ISO_IR 192";
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
    if (dataset.ContentTemplateSequence.TemplateIdentifier !== "1500") {
      throw new Error("This package can currently only interpret DICOM SR TID 1500");
    }
    const REPORT = "Imaging Measurements";
    const GROUP = "Measurement Group";
    const TRACKING_IDENTIFIER = "Tracking Identifier";

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
        console.log(`=== ${toolClass.toolType} ===`);
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



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/cornerstone4Tag.js
var CORNERSTONE_4_TAG = "cornerstoneTools@^4.0.0";



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/Length.js




const {
  Length: TID300Length
} = dcmjs_es/* utilities */.BF.TID300;
const LENGTH = "Length";
class Length {
  // TODO: this function is required for all Cornerstone Tool Adapters, since it is called by MeasurementReport.
  static getMeasurementData(MeasurementGroup) {
    const {
      defaultState,
      NUMGroup,
      SCOORDGroup
    } = MeasurementReport.getSetupMeasurementData(MeasurementGroup);
    const state = {
      ...defaultState,
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
    };
    [state.handles.start.x, state.handles.start.y, state.handles.end.x, state.handles.end.y] = SCOORDGroup.GraphicData;
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    const {
      handles,
      finding,
      findingSites
    } = tool;
    const point1 = handles.start;
    const point2 = handles.end;
    const distance = tool.length;
    const trackingIdentifierTextValue = "cornerstoneTools@^4.0.0:Length";
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
  if (!TrackingIdentifier.includes(":")) {
    return false;
  }
  const [cornerstone4Tag, toolType] = TrackingIdentifier.split(":");
  if (cornerstone4Tag !== CORNERSTONE_4_TAG) {
    return false;
  }
  return toolType === LENGTH;
};
MeasurementReport.registerTool(Length);



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/FreehandRoi.js




const {
  Polyline: TID300Polyline
} = dcmjs_es/* utilities */.BF.TID300;
class FreehandRoi {
  static getMeasurementData(MeasurementGroup) {
    const {
      defaultState,
      SCOORDGroup,
      NUMGroup
    } = MeasurementReport.getSetupMeasurementData(MeasurementGroup);
    const state = {
      ...defaultState,
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
    };
    const {
      GraphicData
    } = SCOORDGroup;
    for (let i = 0; i < GraphicData.length; i += 2) {
      state.handles.points.push({
        x: GraphicData[i],
        y: GraphicData[i + 1]
      });
    }
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    const {
      handles,
      finding,
      findingSites,
      cachedStats = {}
    } = tool;
    const {
      points
    } = handles;
    const {
      area = 0,
      perimeter = 0
    } = cachedStats;
    const trackingIdentifierTextValue = "cornerstoneTools@^4.0.0:FreehandRoi";
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
FreehandRoi.toolType = "FreehandRoi";
FreehandRoi.utilityToolType = "FreehandRoi";
FreehandRoi.TID300Representation = TID300Polyline;
FreehandRoi.isValidCornerstoneTrackingIdentifier = TrackingIdentifier => {
  if (!TrackingIdentifier.includes(":")) {
    return false;
  }
  const [cornerstone4Tag, toolType] = TrackingIdentifier.split(":");
  if (cornerstone4Tag !== CORNERSTONE_4_TAG) {
    return false;
  }
  return toolType === FreehandRoi.toolType;
};
MeasurementReport.registerTool(FreehandRoi);



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/Bidirectional.js






const {
  Bidirectional: TID300Bidirectional
} = dcmjs_es/* utilities */.BF.TID300;
const BIDIRECTIONAL = "Bidirectional";
const LONG_AXIS = "Long Axis";
const SHORT_AXIS = "Short Axis";
const Bidirectional_FINDING = "121071";
const Bidirectional_FINDING_SITE = "G-C0E3";
class Bidirectional {
  // TODO: this function is required for all Cornerstone Tool Adapters, since it is called by MeasurementReport.
  static getMeasurementData(MeasurementGroup) {
    const {
      ContentSequence
    } = MeasurementGroup;
    const findingGroup = toArray(ContentSequence).find(group => group.ConceptNameCodeSequence.CodeValue === Bidirectional_FINDING);
    const findingSiteGroups = toArray(ContentSequence).filter(group => group.ConceptNameCodeSequence.CodeValue === Bidirectional_FINDING_SITE);
    const longAxisNUMGroup = toArray(ContentSequence).find(group => group.ConceptNameCodeSequence.CodeMeaning === LONG_AXIS);
    const longAxisSCOORDGroup = toArray(longAxisNUMGroup.ContentSequence).find(group => group.ValueType === "SCOORD");
    const shortAxisNUMGroup = toArray(ContentSequence).find(group => group.ConceptNameCodeSequence.CodeMeaning === SHORT_AXIS);
    const shortAxisSCOORDGroup = toArray(shortAxisNUMGroup.ContentSequence).find(group => group.ValueType === "SCOORD");
    const {
      ReferencedSOPSequence
    } = longAxisSCOORDGroup.ContentSequence;
    const {
      ReferencedSOPInstanceUID,
      ReferencedFrameNumber
    } = ReferencedSOPSequence;

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
      toolName: "Bidirectional",
      visible: true,
      finding: findingGroup ? findingGroup.ConceptCodeSequence : undefined,
      findingSites: findingSiteGroups.map(fsg => fsg.ConceptCodeSequence)
    };
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    const {
      start,
      end,
      perpendicularStart,
      perpendicularEnd
    } = tool.handles;
    const {
      shortestDiameter,
      longestDiameter,
      finding,
      findingSites
    } = tool;
    const trackingIdentifierTextValue = "cornerstoneTools@^4.0.0:Bidirectional";
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
  if (!TrackingIdentifier.includes(":")) {
    return false;
  }
  const [cornerstone4Tag, toolType] = TrackingIdentifier.split(":");
  if (cornerstone4Tag !== CORNERSTONE_4_TAG) {
    return false;
  }
  return toolType === BIDIRECTIONAL;
};
MeasurementReport.registerTool(Bidirectional);



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/EllipticalRoi.js




const {
  Ellipse: TID300Ellipse
} = dcmjs_es/* utilities */.BF.TID300;
const ELLIPTICALROI = "EllipticalRoi";
class EllipticalRoi {
  // TODO: this function is required for all Cornerstone Tool Adapters, since it is called by MeasurementReport.
  static getMeasurementData(MeasurementGroup) {
    const {
      defaultState,
      NUMGroup,
      SCOORDGroup
    } = MeasurementReport.getSetupMeasurementData(MeasurementGroup);
    const {
      GraphicData
    } = SCOORDGroup;
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
    const state = {
      ...defaultState,
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
    };
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    const {
      cachedStats = {},
      handles,
      finding,
      findingSites
    } = tool;
    const {
      start,
      end
    } = handles;
    const {
      area
    } = cachedStats;
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
    const trackingIdentifierTextValue = "cornerstoneTools@^4.0.0:EllipticalRoi";
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
  if (!TrackingIdentifier.includes(":")) {
    return false;
  }
  const [cornerstone4Tag, toolType] = TrackingIdentifier.split(":");
  if (cornerstone4Tag !== CORNERSTONE_4_TAG) {
    return false;
  }
  return toolType === ELLIPTICALROI;
};
MeasurementReport.registerTool(EllipticalRoi);



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/CircleRoi.js




const {
  Circle: TID300Circle
} = dcmjs_es/* utilities */.BF.TID300;
const CIRCLEROI = "CircleRoi";
class CircleRoi {
  /** Gets the measurement data for cornerstone, given DICOM SR measurement data. */
  static getMeasurementData(MeasurementGroup) {
    const {
      defaultState,
      NUMGroup,
      SCOORDGroup
    } = MeasurementReport.getSetupMeasurementData(MeasurementGroup);
    const {
      GraphicData
    } = SCOORDGroup;
    const center = {
      x: GraphicData[0],
      y: GraphicData[1]
    };
    const end = {
      x: GraphicData[2],
      y: GraphicData[3]
    };
    const state = {
      ...defaultState,
      toolType: CircleRoi.toolType,
      active: false,
      cachedStats: {
        area: NUMGroup ? NUMGroup.MeasuredValueSequence.NumericValue : 0,
        // Dummy values to be updated by cornerstone
        radius: 0,
        perimeter: 0
      },
      handles: {
        end: {
          ...end,
          highlight: false,
          active: false
        },
        initialRotation: 0,
        start: {
          ...center,
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
    };
    return state;
  }

  /**
   * Gets the TID 300 representation of a circle, given the cornerstone representation.
   *
   * @param {Object} tool
   * @returns
   */
  static getTID300RepresentationArguments(tool) {
    const {
      cachedStats = {},
      handles,
      finding,
      findingSites
    } = tool;
    const {
      start: center,
      end
    } = handles;
    const {
      area,
      radius
    } = cachedStats;
    const perimeter = 2 * Math.PI * radius;
    const points = [];
    points.push(center);
    points.push(end);
    const trackingIdentifierTextValue = "cornerstoneTools@^4.0.0:CircleRoi";
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
  if (!TrackingIdentifier.includes(":")) {
    return false;
  }
  const [cornerstone4Tag, toolType] = TrackingIdentifier.split(":");
  if (cornerstone4Tag !== CORNERSTONE_4_TAG) {
    return false;
  }
  return toolType === CIRCLEROI;
};
MeasurementReport.registerTool(CircleRoi);



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/ArrowAnnotate.js




const {
  Point: TID300Point
} = dcmjs_es/* utilities */.BF.TID300;
const ARROW_ANNOTATE = "ArrowAnnotate";
const CORNERSTONEFREETEXT = "CORNERSTONEFREETEXT";
class ArrowAnnotate {
  static getMeasurementData(MeasurementGroup) {
    const {
      defaultState,
      SCOORDGroup,
      findingGroup
    } = MeasurementReport.getSetupMeasurementData(MeasurementGroup);
    const text = findingGroup.ConceptCodeSequence.CodeMeaning;
    const {
      GraphicData
    } = SCOORDGroup;
    const state = {
      ...defaultState,
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
      text,
      visible: true
    };
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    const points = [tool.handles.start, tool.handles.end];
    const {
      findingSites
    } = tool;
    let {
      finding
    } = tool;
    const TID300RepresentationArguments = {
      points,
      trackingIdentifierTextValue: `cornerstoneTools@^4.0.0:ArrowAnnotate`,
      findingSites: findingSites || []
    };

    // If freetext finding isn't present, add it from the tool text.
    if (!finding || finding.CodeValue !== CORNERSTONEFREETEXT) {
      finding = {
        CodeValue: CORNERSTONEFREETEXT,
        CodingSchemeDesignator: "CST4",
        CodeMeaning: tool.text
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
  if (!TrackingIdentifier.includes(":")) {
    return false;
  }
  const [cornerstone4Tag, toolType] = TrackingIdentifier.split(":");
  if (cornerstone4Tag !== CORNERSTONE_4_TAG) {
    return false;
  }
  return toolType === ARROW_ANNOTATE;
};
MeasurementReport.registerTool(ArrowAnnotate);



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/CobbAngle.js




const {
  CobbAngle: TID300CobbAngle
} = dcmjs_es/* utilities */.BF.TID300;
const COBB_ANGLE = "CobbAngle";
class CobbAngle {
  // TODO: this function is required for all Cornerstone Tool Adapters, since it is called by MeasurementReport.
  static getMeasurementData(MeasurementGroup) {
    const {
      defaultState,
      NUMGroup,
      SCOORDGroup
    } = MeasurementReport.getSetupMeasurementData(MeasurementGroup);
    const state = {
      ...defaultState,
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
    };
    [state.handles.start.x, state.handles.start.y, state.handles.end.x, state.handles.end.y, state.handles.start2.x, state.handles.start2.y, state.handles.end2.x, state.handles.end2.y] = SCOORDGroup.GraphicData;
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    const {
      handles,
      finding,
      findingSites
    } = tool;
    const point1 = handles.start;
    const point2 = handles.end;
    const point3 = handles.start2;
    const point4 = handles.end2;
    const rAngle = tool.rAngle;
    const trackingIdentifierTextValue = "cornerstoneTools@^4.0.0:CobbAngle";
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
  if (!TrackingIdentifier.includes(":")) {
    return false;
  }
  const [cornerstone4Tag, toolType] = TrackingIdentifier.split(":");
  if (cornerstone4Tag !== CORNERSTONE_4_TAG) {
    return false;
  }
  return toolType === COBB_ANGLE;
};
MeasurementReport.registerTool(CobbAngle);



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/Angle.js




const {
  Angle: TID300Angle
} = dcmjs_es/* utilities */.BF.TID300;
const ANGLE = "Angle";
class Angle {
  /**
   * Generate TID300 measurement data for a plane angle measurement - use a Angle, but label it as Angle
   */
  static getMeasurementData(MeasurementGroup) {
    const {
      defaultState,
      NUMGroup,
      SCOORDGroup
    } = MeasurementReport.getSetupMeasurementData(MeasurementGroup);
    const state = {
      ...defaultState,
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
    };
    [state.handles.start.x, state.handles.start.y, state.handles.middle.x, state.handles.middle.y, state.handles.middle.x, state.handles.middle.y, state.handles.end.x, state.handles.end.y] = SCOORDGroup.GraphicData;
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    const {
      handles,
      finding,
      findingSites
    } = tool;
    const point1 = handles.start;
    const point2 = handles.middle;
    const point3 = handles.middle;
    const point4 = handles.end;
    const rAngle = tool.rAngle;
    const trackingIdentifierTextValue = "cornerstoneTools@^4.0.0:Angle";
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
  if (!TrackingIdentifier.includes(":")) {
    return false;
  }
  const [cornerstone4Tag, toolType] = TrackingIdentifier.split(":");
  if (cornerstone4Tag !== CORNERSTONE_4_TAG) {
    return false;
  }
  return toolType === ANGLE;
};
MeasurementReport.registerTool(Angle);



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/RectangleRoi.js




const {
  Polyline: RectangleRoi_TID300Polyline
} = dcmjs_es/* utilities */.BF.TID300;
class RectangleRoi {
  static getMeasurementData(MeasurementGroup) {
    const {
      defaultState,
      SCOORDGroup,
      NUMGroup
    } = MeasurementReport.getSetupMeasurementData(MeasurementGroup);
    const state = {
      ...defaultState,
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
    };
    const intermediate = {};
    [state.handles.start.x, state.handles.start.y, intermediate.x, intermediate.y, state.handles.end.x, state.handles.end.y] = SCOORDGroup.GraphicData;
    return state;
  }
  static getTID300RepresentationArguments(tool) {
    const {
      finding,
      findingSites,
      cachedStats = {},
      handles
    } = tool;
    const {
      start,
      end
    } = handles;
    const points = [start, {
      x: start.x,
      y: end.y
    }, end, {
      x: end.x,
      y: start.y
    }];
    const {
      area,
      perimeter
    } = cachedStats;
    const trackingIdentifierTextValue = "cornerstoneTools@^4.0.0:RectangleRoi";
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
RectangleRoi.toolType = "RectangleRoi";
RectangleRoi.utilityToolType = "RectangleRoi";
RectangleRoi.TID300Representation = RectangleRoi_TID300Polyline;
RectangleRoi.isValidCornerstoneTrackingIdentifier = TrackingIdentifier => {
  if (!TrackingIdentifier.includes(":")) {
    return false;
  }
  const [cornerstone4Tag, toolType] = TrackingIdentifier.split(":");
  if (cornerstone4Tag !== CORNERSTONE_4_TAG) {
    return false;
  }
  return toolType === RectangleRoi.toolType;
};
MeasurementReport.registerTool(RectangleRoi);



// EXTERNAL MODULE: ../../../node_modules/ndarray/ndarray.js
var ndarray = __webpack_require__(3293);
var ndarray_default = /*#__PURE__*/__webpack_require__.n(ndarray);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/getDatasetsFromImages.js


const {
  DicomMessage,
  DicomMetaDictionary: getDatasetsFromImages_DicomMetaDictionary
} = dcmjs_es/* data */.p;
const {
  Normalizer: getDatasetsFromImages_Normalizer
} = dcmjs_es/* normalizers */.z8;
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
  if (options?.SpecificCharacterSet) {
    datasets.forEach(dataset => dataset.SpecificCharacterSet = options.SpecificCharacterSet);
  }
  return getDatasetsFromImages_Normalizer.normalizeToDataset(datasets);
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/Segmentation_3X.js




const {
  rotateDirectionCosinesInPlane,
  flipImageOrientationPatient: flipIOP,
  flipMatrix2D,
  rotateMatrix902D
} = dcmjs_es/* utilities */.BF.orientation;
const {
  datasetToBlob,
  BitArray,
  DicomMessage: Segmentation_3X_DicomMessage,
  DicomMetaDictionary: Segmentation_3X_DicomMetaDictionary
} = dcmjs_es/* utilities */.BF;
const {
  Normalizer: Segmentation_3X_Normalizer
} = dcmjs_es/* normalizers */.z8;
const {
  Segmentation: SegmentationDerivation
} = dcmjs_es/* derivations */.h4;
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
  const {
    toolState,
    segments
  } = brushData;

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
    throw new Error("No segments to export!");
  }
  const isMultiframe = image0.imageId.includes("?frame");
  const seg = _createSegFromImages(images, isMultiframe, options);
  const {
    referencedFramesPerSegment,
    segmentIndicies
  } = _getNumberOfFramesPerSegment(toolState, images, segments);
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
  const segBlob = datasetToBlob(seg.dataset);
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
  const imagePlaneModule = metadataProvider.get("imagePlaneModule", imageIds[0]);
  if (!imagePlaneModule) {
    console.warn("Insufficient metadata, imagePlaneModule missing.");
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
    const pixelDataI2D = ndarray_default()(new Uint8Array(pixelData.buffer, i * sliceLength, sliceLength), [multiframe.Rows, multiframe.Columns]);
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
  if (segType === "BINARY") {
    return BitArray.unpack(multiframe.PixelData);
  }
  const pixelData = new Uint8Array(multiframe.PixelData);
  const max = multiframe.MaximumFractionalValue;
  const onlyMaxAndZero = pixelData.find(element => element !== 0 && element !== max) === undefined;
  if (!onlyMaxAndZero) {
    dcmjs_es/* log */.Rm.warn("This is a fractional segmentation, which is not currently supported.");
    return;
  }
  dcmjs_es/* log */.Rm.warn("This segmentation object is actually binary... processing as such.");
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
  const {
    ReferencedSOPInstanceUID,
    ReferencedFrameNumber
  } = SourceImageSequence;
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
    const sopCommonModule = metadataProvider.get("sopCommonModule", imageId);
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
    const sopCommonModule = metadataProvider.get("sopCommonModule", imageId);
    if (!sopCommonModule) {
      return;
    }
    const imageIdFrameNumber = Number(imageId.split("frame=")[1]);
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



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/compareArrays.js


const {
  nearlyEqual
} = dcmjs_es/* utilities */.BF.orientation;
function compareArrays(array1, array2, tolerance) {
  if (array1.length !== array2.length) {
    return false;
  }
  for (let i = 0; i < array1.length; ++i) {
    if (!nearlyEqual(array1[i], array2[i], tolerance)) {
      return false;
    }
  }
  return true;
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/checkOrientation.js



function checkOrientation(multiframe, validOrientations, sourceDataDimensions, tolerance) {
  const {
    SharedFunctionalGroupsSequence,
    PerFrameFunctionalGroupsSequence
  } = multiframe;
  const sharedImageOrientationPatient = SharedFunctionalGroupsSequence.PlaneOrientationSequence ? SharedFunctionalGroupsSequence.PlaneOrientationSequence.ImageOrientationPatient : undefined;
  const PerFrameFunctionalGroups = PerFrameFunctionalGroupsSequence[0];
  const iop = sharedImageOrientationPatient || PerFrameFunctionalGroups.PlaneOrientationSequence.ImageOrientationPatient;
  const inPlane = validOrientations.some(operation => compareArrays(iop, operation, tolerance));
  if (inPlane) {
    return "Planar";
  }
  if (checkIfPerpendicular(iop, validOrientations[0], tolerance) && sourceDataDimensions.includes(multiframe.Rows) && sourceDataDimensions.includes(multiframe.Columns)) {
    return "Perpendicular";
  }
  return "Oblique";
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/enums/Events.js
var Events;
(function (Events) {
  Events["SEGMENTATION_LOAD_PROGRESS"] = "CORNERSTONE_ADAPTER_SEGMENTATION_LOAD_PROGRESS";
})(Events || (Events = {}));



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/Segmentation_4X.js







const {
  rotateDirectionCosinesInPlane: Segmentation_4X_rotateDirectionCosinesInPlane,
  flipImageOrientationPatient: Segmentation_4X_flipIOP,
  flipMatrix2D: Segmentation_4X_flipMatrix2D,
  rotateMatrix902D: Segmentation_4X_rotateMatrix902D
} = dcmjs_es/* utilities */.BF.orientation;
const {
  BitArray: Segmentation_4X_BitArray,
  DicomMessage: Segmentation_4X_DicomMessage,
  DicomMetaDictionary: Segmentation_4X_DicomMetaDictionary
} = dcmjs_es/* data */.p;
const {
  Normalizer: Segmentation_4X_Normalizer
} = dcmjs_es/* normalizers */.z8;
const {
  Segmentation: Segmentation_4X_SegmentationDerivation
} = dcmjs_es/* derivations */.h4;
const {
  encode,
  decode
} = dcmjs_es/* utilities */.BF.compression;

/**
 *
 * @typedef {Object} BrushData
 * @property {Object} toolState - The cornerstoneTools global toolState.
 * @property {Object[]} segments - The cornerstoneTools segment metadata that corresponds to the
 *                                 seriesInstanceUid.
 */
const generateSegmentationDefaultOptions = {
  includeSliceSpacing: true,
  rleEncode: false
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
 * Fills a given segmentation object with data from the input labelmaps3D
 *
 * @param segmentation - The segmentation object to be filled.
 * @param inputLabelmaps3D - An array of 3D labelmaps, or a single 3D labelmap.
 * @param userOptions - Optional configuration settings. Will override the default options.
 *
 * @returns {object} The filled segmentation object.
 */
function fillSegmentation(segmentation, inputLabelmaps3D) {
  let userOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const options = Object.assign({}, generateSegmentationDefaultOptions, userOptions);

  // Use another variable so we don't redefine labelmaps3D.
  const labelmaps3D = Array.isArray(inputLabelmaps3D) ? inputLabelmaps3D : [inputLabelmaps3D];
  let numberOfFrames = 0;
  const referencedFramesPerLabelmap = [];
  for (let labelmapIndex = 0; labelmapIndex < labelmaps3D.length; labelmapIndex++) {
    const labelmap3D = labelmaps3D[labelmapIndex];
    const {
      labelmaps2D,
      metadata
    } = labelmap3D;
    const referencedFramesPerSegment = [];
    for (let i = 1; i < metadata.length; i++) {
      if (metadata[i]) {
        referencedFramesPerSegment[i] = [];
      }
    }
    for (let i = 0; i < labelmaps2D.length; i++) {
      const labelmap2D = labelmaps2D[i];
      if (labelmaps2D[i]) {
        const {
          segmentsOnLabelmap
        } = labelmap2D;
        segmentsOnLabelmap.forEach(segmentIndex => {
          if (segmentIndex !== 0) {
            referencedFramesPerSegment[segmentIndex].push(i);
            numberOfFrames++;
          }
        });
      }
    }
    referencedFramesPerLabelmap[labelmapIndex] = referencedFramesPerSegment;
  }
  segmentation.setNumberOfFrames(numberOfFrames);
  for (let labelmapIndex = 0; labelmapIndex < labelmaps3D.length; labelmapIndex++) {
    const referencedFramesPerSegment = referencedFramesPerLabelmap[labelmapIndex];
    const labelmap3D = labelmaps3D[labelmapIndex];
    const {
      metadata
    } = labelmap3D;
    for (let segmentIndex = 1; segmentIndex < referencedFramesPerSegment.length; segmentIndex++) {
      const referencedFrameIndicies = referencedFramesPerSegment[segmentIndex];
      if (referencedFrameIndicies) {
        // Frame numbers start from 1.
        const referencedFrameNumbers = referencedFrameIndicies.map(element => {
          return element + 1;
        });
        const segmentMetadata = metadata[segmentIndex];
        const labelmaps = _getLabelmapsFromReferencedFrameIndicies(labelmap3D, referencedFrameIndicies);
        segmentation.addSegmentFromLabelmap(segmentMetadata, labelmaps, segmentIndex, referencedFrameNumbers);
      }
    }
  }
  if (options.rleEncode) {
    const rleEncodedFrames = encode(segmentation.dataset.PixelData, numberOfFrames, segmentation.dataset.Rows, segmentation.dataset.Columns);

    // Must use fractional now to RLE encode, as the DICOM standard only allows BitStored && BitsAllocated
    // to be 1 for BINARY. This is not ideal and there should be a better format for compression in this manner
    // added to the standard.
    segmentation.assignToDataset({
      BitsAllocated: "8",
      BitsStored: "8",
      HighBit: "7",
      SegmentationType: "FRACTIONAL",
      SegmentationFractionalType: "PROBABILITY",
      MaximumFractionalValue: "255"
    });
    segmentation.dataset._meta.TransferSyntaxUID = {
      Value: ["1.2.840.10008.1.2.5"],
      vr: "UI"
    };
    segmentation.dataset.SpecificCharacterSet = "ISO_IR 192";
    segmentation.dataset._vrMap.PixelData = "OB";
    segmentation.dataset.PixelData = rleEncodedFrames;
  } else {
    // If no rleEncoding, at least bitpack the data.
    segmentation.bitPackPixelData();
  }
  return segmentation;
}
function _getLabelmapsFromReferencedFrameIndicies(labelmap3D, referencedFrameIndicies) {
  const {
    labelmaps2D
  } = labelmap3D;
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
  const {
    skipOverlapping = false,
    tolerance = 1e-3,
    TypedArrayConstructor = Uint8Array,
    maxBytesPerChunk = 199000000,
    eventTarget = null,
    triggerEvent = null
  } = options;
  const dicomData = Segmentation_4X_DicomMessage.readFile(arrayBuffer);
  const dataset = Segmentation_4X_DicomMetaDictionary.naturalizeDataset(dicomData.dict);
  dataset._meta = Segmentation_4X_DicomMetaDictionary.namifyDataset(dicomData.meta);
  const multiframe = Segmentation_4X_Normalizer.normalizeToDataset([dataset]);
  const imagePlaneModule = metadataProvider.get("imagePlaneModule", referencedImageIds[0]);
  const generalSeriesModule = metadataProvider.get("generalSeriesModule", referencedImageIds[0]);
  const SeriesInstanceUID = generalSeriesModule.seriesInstanceUID;
  if (!imagePlaneModule) {
    console.warn("Insufficient metadata, imagePlaneModule missing.");
  }
  const ImageOrientationPatient = Array.isArray(imagePlaneModule.rowCosines) ? [...imagePlaneModule.rowCosines, ...imagePlaneModule.columnCosines] : [imagePlaneModule.rowCosines.x, imagePlaneModule.rowCosines.y, imagePlaneModule.rowCosines.z, imagePlaneModule.columnCosines.x, imagePlaneModule.columnCosines.y, imagePlaneModule.columnCosines.z];

  // Get IOP from ref series, compute supported orientations:
  const validOrientations = Segmentation_4X_getValidOrientations(ImageOrientationPatient);
  const sliceLength = multiframe.Columns * multiframe.Rows;
  const segMetadata = Segmentation_4X_getSegmentMetadata(multiframe, SeriesInstanceUID);
  const TransferSyntaxUID = multiframe._meta.TransferSyntaxUID.Value[0];
  let pixelData;
  let pixelDataChunks;
  if (TransferSyntaxUID === "1.2.840.10008.1.2.5") {
    const rleEncodedFrames = Array.isArray(multiframe.PixelData) ? multiframe.PixelData : [multiframe.PixelData];
    pixelData = decode(rleEncodedFrames, multiframe.Rows, multiframe.Columns);
    if (multiframe.BitsStored === 1) {
      console.warn("No implementation for rle + bitbacking.");
      return;
    }

    // Todo: need to test this with rle data
    pixelDataChunks = [pixelData];
  } else {
    pixelDataChunks = Segmentation_4X_unpackPixelData(multiframe, {
      maxBytesPerChunk
    });
    if (!pixelDataChunks) {
      throw new Error("Fractional segmentations are not yet supported");
    }
  }
  const orientation = checkOrientation(multiframe, validOrientations, [imagePlaneModule.rows, imagePlaneModule.columns, referencedImageIds.length], tolerance);

  // Pre-compute the sop UID to imageId index map so that in the for loop
  // we don't have to call metadataProvider.get() for each imageId over
  // and over again.
  const sopUIDImageIdIndexMap = referencedImageIds.reduce((acc, imageId) => {
    const {
      sopInstanceUID
    } = metadataProvider.get("generalImageModule", imageId);
    acc[sopInstanceUID] = imageId;
    return acc;
  }, {});
  let overlapping = false;
  if (!skipOverlapping) {
    overlapping = checkSEGsOverlapping(pixelDataChunks, multiframe, referencedImageIds, validOrientations, metadataProvider, tolerance, TypedArrayConstructor, sopUIDImageIdIndexMap);
  }
  let insertFunction;
  switch (orientation) {
    case "Planar":
      if (overlapping) {
        insertFunction = insertOverlappingPixelDataPlanar;
      } else {
        insertFunction = insertPixelDataPlanar;
      }
      break;
    case "Perpendicular":
      //insertFunction = insertPixelDataPerpendicular;
      throw new Error("Segmentations orthogonal to the acquisition plane of the source data are not yet supported.");
    case "Oblique":
      throw new Error("Segmentations oblique to the acquisition plane of the source data are not yet supported.");
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
    acc.metadata[curr] = metadataProvider.get("instance", curr);
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
  const {
    FrameOfReferenceUID,
    PerFrameFunctionalGroupsSequence,
    SourceImageSequence,
    ReferencedSeriesSequence
  } = multiframe;
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
    console.warn("DerivationImageSequence not present, using SourceImageSequence assuming SEG has the same geometry as the source image.");
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
  const {
    SharedFunctionalGroupsSequence,
    PerFrameFunctionalGroupsSequence,
    SegmentSequence,
    Rows,
    Columns
  } = multiframe;
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
      console.warn("Could not retrieve the segment index for frame segment " + frameSegment + ", skipping this frame.");
      continue;
    }
    const imageId = findReferenceSourceImageId(multiframe, frameSegment, imageIds, metadataProvider, tolerance, sopUIDImageIdIndexMap);
    if (!imageId) {
      console.warn("Image not present in stack, can't import frame : " + frameSegment + ".");
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
  for (let [, role] of frameSegmentsMapping.entries()) {
    let temp2DArray = new TypedArrayConstructor(sliceLength).fill(0);
    for (let i = 0; i < role.length; ++i) {
      const frameSegment = role[i];
      const PerFrameFunctionalGroups = PerFrameFunctionalGroupsSequence[frameSegment];
      const ImageOrientationPatientI = sharedImageOrientationPatient || PerFrameFunctionalGroups.PlaneOrientationSequence.ImageOrientationPatient;
      const view = readFromUnpackedChunks(pixelData, frameSegment * sliceLength, sliceLength);
      const pixelDataI2D = ndarray_default()(view, [Rows, Columns]);
      const alignedPixelDataI = Segmentation_4X_alignPixelDataWithSourceData(pixelDataI2D, ImageOrientationPatientI, validOrientations, tolerance);
      if (!alignedPixelDataI) {
        console.warn("Individual SEG frames are out of plane with respect to the first SEG frame, this is not yet supported, skipping this frame.");
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
  const {
    SharedFunctionalGroupsSequence,
    PerFrameFunctionalGroupsSequence,
    Rows,
    Columns
  } = multiframe;
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
        throw new Error("Could not retrieve the segment index. Aborting segmentation loading.");
      }
      if (segmentIndex !== segmentIndexToProcess) {
        continue;
      }
      const ImageOrientationPatientI = sharedImageOrientationPatient || PerFrameFunctionalGroups.PlaneOrientationSequence.ImageOrientationPatient;

      // Since we moved to the chunks approach, we need to read the data
      // and handle scenarios where the portion of data is in one chunk
      // and the other portion is in another chunk
      const view = readFromUnpackedChunks(pixelData, i * sliceLength, sliceLength);
      const pixelDataI2D = ndarray_default()(view, [Rows, Columns]);
      const alignedPixelDataI = Segmentation_4X_alignPixelDataWithSourceData(pixelDataI2D, ImageOrientationPatientI, validOrientations, tolerance);
      if (!alignedPixelDataI) {
        throw new Error("Individual SEG frames are out of plane with respect to the first SEG frame. " + "This is not yet supported. Aborting segmentation loading.");
      }
      const imageId = findReferenceSourceImageId(multiframe, i, imageIds, metadataProvider, tolerance, sopUIDImageIdIndexMap);
      if (!imageId) {
        console.warn("Image not present in stack, can't import frame : " + i + ".");
        continue;
      }
      const sourceImageMetadata = metadataProvider.get("instance", imageId);
      if (Rows !== sourceImageMetadata.Rows || Columns !== sourceImageMetadata.Columns) {
        throw new Error("Individual SEG frames have different geometry dimensions (Rows and Columns) " + "respect to the source image reference frame. This is not yet supported. " + "Aborting segmentation loading. ");
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
const getSegmentIndex = (multiframe, frame) => {
  const {
    PerFrameFunctionalGroupsSequence,
    SharedFunctionalGroupsSequence
  } = multiframe;
  const PerFrameFunctionalGroups = PerFrameFunctionalGroupsSequence[frame];
  return PerFrameFunctionalGroups && PerFrameFunctionalGroups.SegmentIdentificationSequence ? PerFrameFunctionalGroups.SegmentIdentificationSequence.ReferencedSegmentNumber : SharedFunctionalGroupsSequence.SegmentIdentificationSequence ? SharedFunctionalGroupsSequence.SegmentIdentificationSequence.ReferencedSegmentNumber : undefined;
};
function insertPixelDataPlanar(segmentsOnFrame, segmentsOnFrameArray, labelmapBufferArray, pixelData, multiframe, imageIds, validOrientations, metadataProvider, tolerance, TypedArrayConstructor, segmentsPixelIndices, sopUIDImageIdIndexMap, imageIdMaps, eventTarget, triggerEvent) {
  const {
    SharedFunctionalGroupsSequence,
    PerFrameFunctionalGroupsSequence,
    Rows,
    Columns
  } = multiframe;
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
        const pixelDataI2D = ndarray_default()(view, [Rows, Columns]);
        const alignedPixelDataI = Segmentation_4X_alignPixelDataWithSourceData(pixelDataI2D, ImageOrientationPatientI, validOrientations, tolerance);
        if (!alignedPixelDataI) {
          throw new Error("Individual SEG frames are out of plane with respect to the first SEG frame. " + "This is not yet supported. Aborting segmentation loading.");
        }
        const segmentIndex = getSegmentIndex(multiframe, i);
        if (segmentIndex === undefined) {
          throw new Error("Could not retrieve the segment index. Aborting segmentation loading.");
        }
        if (!segmentsPixelIndices.has(segmentIndex)) {
          segmentsPixelIndices.set(segmentIndex, {});
        }
        const imageId = findReferenceSourceImageId(multiframe, i, imageIds, metadataProvider, tolerance, sopUIDImageIdIndexMap);
        if (!imageId) {
          console.warn("Image not present in stack, can't import frame : " + i + ".");
          continue;
        }
        const sourceImageMetadata = imageIdMaps.metadata[imageId];
        if (Rows !== sourceImageMetadata.Rows || Columns !== sourceImageMetadata.Columns) {
          throw new Error("Individual SEG frames have different geometry dimensions (Rows and Columns) " + "respect to the source image reference frame. This is not yet supported. " + "Aborting segmentation loading. ");
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
        triggerEvent(eventTarget, Events.SEGMENTATION_LOAD_PROGRESS, {
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
    dcmjs_es/* log */.Rm.error("This segmentation pixelData is undefined.");
  }
  if (segType === "BINARY") {
    // For extreme big data, we can't unpack the data at once and we need to
    // chunk it and unpack each chunk separately.
    // MAX 2GB is the limit right now to allocate a buffer
    return getUnpackedChunks(data, options.maxBytesPerChunk);
  }
  const pixelData = new Uint8Array(data);
  const max = multiframe.MaximumFractionalValue;
  const onlyMaxAndZero = pixelData.find(element => element !== 0 && element !== max) === undefined;
  if (!onlyMaxAndZero) {
    // This is a fractional segmentation, which is not currently supported.
    return;
  }
  dcmjs_es/* log */.Rm.warn("This segmentation object is actually binary... processing as such.");
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
  const {
    ReferencedSOPInstanceUID,
    ReferencedFrameNumber
  } = SourceImageSequence;
  const baseImageId = sopUIDImageIdIndexMap[ReferencedSOPInstanceUID];
  if (!baseImageId) {
    console.warn(`No imageId found for SOPInstanceUID: ${ReferencedSOPInstanceUID}`);
    return undefined;
  }
  if (ReferencedFrameNumber !== undefined) {
    if (baseImageId.includes("frames/")) {
      return baseImageId.replace(/frames\/\d+/, `frames/${ReferencedFrameNumber}`);
    } else if (baseImageId.includes("frame=")) {
      return baseImageId.replace(/frame=\d+/, `frame=${ReferencedFrameNumber - 1}`);
    } else {
      if (baseImageId.includes("wadors:")) {
        return `${baseImageId}/frames/${ReferencedFrameNumber}`;
      } else {
        return `${baseImageId}?frame=${ReferencedFrameNumber - 1}`;
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
  if (!ReferencedSeriesInstanceUID || !PerFrameFunctionalGroup.PlanePositionSequence?.[0]?.ImagePositionPatient) {
    return undefined;
  }
  const segFramePosition = PerFrameFunctionalGroup.PlanePositionSequence[0].ImagePositionPatient;
  for (let imageId of imageIds) {
    const sourceImageMetadata = metadataProvider.get("instance", imageId);
    if (!sourceImageMetadata) {
      continue;
    }
    const isMultiframe = isMultiframeImage(sourceImageMetadata);
    if (!sourceImageMetadata.ImagePositionPatient || sourceImageMetadata.FrameOfReferenceUID !== FrameOfReferenceUID || sourceImageMetadata.SeriesInstanceUID !== ReferencedSeriesInstanceUID) {
      continue;
    }

    // For multiframe images, check each frame's position
    if (isMultiframe) {
      const framePosition = metadataProvider.get("imagePlaneModule", imageId)?.imagePositionPatient;
      if (framePosition && compareArrays(segFramePosition, framePosition, tolerance)) {
        return imageId;
      }
    } else if (compareArrays(segFramePosition, sourceImageMetadata.ImagePositionPatient, tolerance)) {
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
  if (compareArrays(iop, orientations[0], tolerance)) {
    return pixelData2D;
  } else if (compareArrays(iop, orientations[1], tolerance)) {
    // Flipped vertically.

    // Undo Flip
    return Segmentation_4X_flipMatrix2D.v(pixelData2D);
  } else if (compareArrays(iop, orientations[2], tolerance)) {
    // Flipped horizontally.

    // Unfo flip
    return Segmentation_4X_flipMatrix2D.h(pixelData2D);
  } else if (compareArrays(iop, orientations[3], tolerance)) {
    //Rotated 90 degrees

    // Rotate back
    return Segmentation_4X_rotateMatrix902D(pixelData2D);
  } else if (compareArrays(iop, orientations[4], tolerance)) {
    //Rotated 90 degrees and fliped horizontally.

    // Undo flip and rotate back.
    return Segmentation_4X_rotateMatrix902D(Segmentation_4X_flipMatrix2D.h(pixelData2D));
  } else if (compareArrays(iop, orientations[5], tolerance)) {
    // Rotated 90 degrees and fliped vertically

    // Unfo flip and rotate back.
    return Segmentation_4X_rotateMatrix902D(Segmentation_4X_flipMatrix2D.v(pixelData2D));
  } else if (compareArrays(iop, orientations[6], tolerance)) {
    // Rotated 180 degrees. // TODO -> Do this more effeciently, there is a 1:1 mapping like 90 degree rotation.

    return Segmentation_4X_rotateMatrix902D(Segmentation_4X_rotateMatrix902D(pixelData2D));
  } else if (compareArrays(iop, orientations[7], tolerance)) {
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
 * Reads a range of bytes from an array of ArrayBuffer chunks and
 * aggregate them into a new Uint8Array.
 *
 * @param {ArrayBuffer[]} chunks - An array of ArrayBuffer chunks.
 * @param {number} offset - The offset of the first byte to read.
 * @param {number} length - The number of bytes to read.
 * @returns {Uint8Array} A new Uint8Array containing the requested bytes.
 */
function readFromUnpackedChunks(chunks, offset, length) {
  const mapping = getUnpackedOffsetAndLength(chunks, offset, length);

  // If all the data is in one chunk, we can just slice that chunk
  if (mapping.start.chunkIndex === mapping.end.chunkIndex) {
    return new Uint8Array(chunks[mapping.start.chunkIndex].buffer, mapping.start.offset, length);
  } else {
    // If the data spans multiple chunks, we need to create a new Uint8Array and copy the data from each chunk
    let result = new Uint8Array(length);
    let resultOffset = 0;
    for (let i = mapping.start.chunkIndex; i <= mapping.end.chunkIndex; i++) {
      let start = i === mapping.start.chunkIndex ? mapping.start.offset : 0;
      let end = i === mapping.end.chunkIndex ? mapping.end.offset : chunks[i].length;
      result.set(new Uint8Array(chunks[i].buffer, start, end - start), resultOffset);
      resultOffset += end - start;
    }
    return result;
  }
}
function getUnpackedOffsetAndLength(chunks, offset, length) {
  var totalBytes = chunks.reduce((total, chunk) => total + chunk.length, 0);
  if (offset < 0 || offset + length > totalBytes) {
    throw new Error("Offset and length out of bounds");
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
  for (const [imageIdIndex, bufferIndices] of Object.entries(imageIdIndexBufferIndex)) {
    const z = Number(imageIdIndex);
    if (!bufferIndices || bufferIndices.length === 0) {
      continue;
    }

    // Get metadata for this slice
    const imageId = imageIds[z];
    const imagePlaneModule = metadataProvider.get("imagePlaneModule", imageId);
    if (!imagePlaneModule) {
      console.debug("Missing imagePlaneModule metadata for centroid calculation");
      continue;
    }
    const {
      imagePositionPatient,
      rowCosines,
      columnCosines,
      rowPixelSpacing,
      columnPixelSpacing
    } = imagePlaneModule;
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
  console.warn(`No generateSegmentation adapter for cornerstone version ${cornerstoneToolsVersion}, exiting.`);
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
  console.warn(`No generateToolState adapter for cornerstone version ${cornerstoneToolsVersion}, exiting.`);
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
  console.warn(`No generateSegmentation adapter for cornerstone version ${cornerstoneToolsVersion}, exiting.`);
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone/ParametricMap.js




const {
  DicomMessage: ParametricMap_DicomMessage,
  DicomMetaDictionary: ParametricMap_DicomMetaDictionary
} = dcmjs_es/* data */.p;
const {
  Normalizer: ParametricMap_Normalizer
} = dcmjs_es/* normalizers */.z8;
async function ParametricMap_generateToolState(imageIds, arrayBuffer, metadataProvider) {
  let tolerance = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1e-3;
  const dicomData = ParametricMap_DicomMessage.readFile(arrayBuffer);
  const dataset = ParametricMap_DicomMetaDictionary.naturalizeDataset(dicomData.dict);
  dataset._meta = ParametricMap_DicomMetaDictionary.namifyDataset(dicomData.meta);
  const multiframe = ParametricMap_Normalizer.normalizeToDataset([dataset]);
  const imagePlaneModule = metadataProvider.get("imagePlaneModule", imageIds[0]);
  if (!imagePlaneModule) {
    console.warn("Insufficient metadata, imagePlaneModule missing.");
  }
  const ImageOrientationPatient = Array.isArray(imagePlaneModule.rowCosines) ? [...imagePlaneModule.rowCosines, ...imagePlaneModule.columnCosines] : [imagePlaneModule.rowCosines.x, imagePlaneModule.rowCosines.y, imagePlaneModule.rowCosines.z, imagePlaneModule.columnCosines.x, imagePlaneModule.columnCosines.y, imagePlaneModule.columnCosines.z];
  const validOrientations = [ImageOrientationPatient];
  const pixelData = getPixelData(multiframe);
  const orientation = checkOrientation(multiframe, validOrientations, [imagePlaneModule.rows, imagePlaneModule.columns, imageIds.length], tolerance);
  const sopUIDImageIdIndexMap = imageIds.reduce((acc, imageId) => {
    const {
      sopInstanceUID
    } = metadataProvider.get("generalImageModule", imageId);
    acc[sopInstanceUID] = imageId;
    return acc;
  }, {});
  if (orientation !== "Planar") {
    const orientationText = {
      Perpendicular: "orthogonal",
      Oblique: "oblique"
    };
    throw new Error(`Parametric maps ${orientationText[orientation]} to the acquisition plane of the source data are not yet supported.`);
  }
  const imageIdMaps = imageIds.reduce((acc, curr, index) => {
    acc.indices[curr] = index;
    acc.metadata[curr] = metadataProvider.get("instance", curr);
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
  const {
    PerFrameFunctionalGroupsSequence,
    Rows,
    Columns
  } = multiframe;
  const sliceLength = Columns * Rows;
  const numSlices = PerFrameFunctionalGroupsSequence.length;
  for (let i = 0; i < numSlices; i++) {
    const sourceSliceDataView = new sourcePixelData.constructor(sourcePixelData.buffer, i * sliceLength, sliceLength);
    const imageId = ParametricMap_findReferenceSourceImageId(multiframe, i, imageIds, metadataProvider, tolerance, sopUIDImageIdIndexMap);
    if (!imageId) {
      console.warn("Image not present in stack, can't import frame : " + i + ".");
      continue;
    }
    const sourceImageMetadata = imageIdMaps.metadata[imageId];
    if (Rows !== sourceImageMetadata.Rows || Columns !== sourceImageMetadata.Columns) {
      throw new Error("Parametric map have different geometry dimensions (Rows and Columns) " + "respect to the source image reference frame. This is not yet supported.");
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
    const validTypedArrays = multiframe.BitsAllocated === 16 ? [Uint16Array, Int16Array] : [Uint32Array, Int32Array];
    TypedArrayClass = validTypedArrays[multiframe.PixelRepresentation ?? 0];
    data = multiframe.PixelData;
  } else if (multiframe.FloatPixelData) {
    TypedArrayClass = Float32Array;
    data = multiframe.FloatPixelData;
  } else if (multiframe.DoubleFloatPixelData) {
    TypedArrayClass = Float64Array;
    data = multiframe.DoubleFloatPixelData;
  }
  if (data === undefined) {
    dcmjs_es/* log */.Rm.error("This parametric map pixel data is undefined.");
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
  const {
    FrameOfReferenceUID,
    PerFrameFunctionalGroupsSequence,
    SourceImageSequence,
    ReferencedSeriesSequence
  } = multiframe;
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
    console.warn("DerivationImageSequence not present, using SourceImageSequence assuming SEG has the same geometry as the source image.");
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
  const {
    ReferencedSOPInstanceUID,
    ReferencedFrameNumber
  } = SourceImageSequence;
  return ReferencedFrameNumber ? ParametricMap_getImageIdOfReferencedFrame(ReferencedSOPInstanceUID, ReferencedFrameNumber, sopUIDImageIdIndexMap) : sopUIDImageIdIndexMap[ReferencedSOPInstanceUID];
}
function ParametricMap_getImageIdOfSourceImagebyGeometry(ReferencedSeriesInstanceUID, FrameOfReferenceUID, PerFrameFunctionalGroup, imageIds, metadataProvider, tolerance) {
  if (ReferencedSeriesInstanceUID === undefined || PerFrameFunctionalGroup.PlanePositionSequence === undefined || PerFrameFunctionalGroup.PlanePositionSequence[0] === undefined || PerFrameFunctionalGroup.PlanePositionSequence[0].ImagePositionPatient === undefined) {
    return undefined;
  }
  for (let imageIdsIndex = 0; imageIdsIndex < imageIds.length; ++imageIdsIndex) {
    const sourceImageMetadata = metadataProvider.get("instance", imageIds[imageIdsIndex]);
    if (sourceImageMetadata === undefined || sourceImageMetadata.ImagePositionPatient === undefined || sourceImageMetadata.FrameOfReferenceUID !== FrameOfReferenceUID || sourceImageMetadata.SeriesInstanceUID !== ReferencedSeriesInstanceUID) {
      continue;
    }
    if (compareArrays(PerFrameFunctionalGroup.PlanePositionSequence[0].ImagePositionPatient, sourceImageMetadata.ImagePositionPatient, tolerance)) {
      return imageIds[imageIdsIndex];
    }
  }
}
function ParametricMap_getImageIdOfReferencedFrame(sopInstanceUid, frameNumber, sopUIDImageIdIndexMap) {
  const imageId = sopUIDImageIdIndexMap[sopInstanceUid];
  if (!imageId) {
    return;
  }
  const imageIdFrameNumber = Number(imageId.split("frame=")[1]);
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
var CORNERSTONE_3D_TAG = "Cornerstone3DTools@^0.1.0";



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/copyStudyTags.js
const patientTags = ["PatientName", "PatientID", "PatientBirthDate", "PatientBirthTime", "PatientID", "IssuerOfPatientID", "OtherPatientIDs", "OtherPatientIDsSequence", "PatientSex", "PatientIdentityRemoved", "DeidentificationMethodCodeSequence"];
const studyTags = ["StudyDate", "StudyTime", "StudyStatusID", "StudyPriorityID", "StudyInstanceUID", "StudyDescription", "AccessionNumber", "StudyID", "ReferringPhysicianName", "BodyPartExamined", "TimezoneOffsetFromUTC"];
const patientStudyTags = [...patientTags, ...studyTags];
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
const seriesTags = ["SeriesInstanceUID", "SeriesNumber", "SeriesDescription", "Modality", "SeriesDate", "SeriesTime"];
function copySeriesTags(src) {
  const study = {
    _meta: src._meta,
    _vrMap: src._vrMap
  };
  for (const tagKey of seriesTags) {
    const value = src[tagKey];
    if (value === undefined) {
      continue;
    }
    study[tagKey] = value;
  }
  return study;
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/CodingScheme.js
// This is a custom coding scheme defined to store some annotations from Cornerstone.
// Note: CodeMeaning is VR type LO, which means we only actually support 64 characters
// here this is fine for most labels, but may be problematic at some point.
const CodingScheme_CORNERSTONEFREETEXT = "CORNERSTONEFREETEXT";

// Cornerstone specified coding scheme for storing findings
const CodingSchemeDesignator = "CORNERSTONEJS";
const CodingScheme = {
  CodingSchemeDesignator,
  codeValues: {
    CORNERSTONEFREETEXT: CodingScheme_CORNERSTONEFREETEXT
  }
};



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/MeasurementReport.js









var _MeasurementReport;
const {
  TID1500: MeasurementReport_TID1500,
  addAccessors: MeasurementReport_addAccessors
} = dcmjs_es/* utilities */.BF;
const {
  StructuredReport: MeasurementReport_StructuredReport
} = dcmjs_es/* derivations */.h4;
const {
  Normalizer: MeasurementReport_Normalizer
} = dcmjs_es/* normalizers */.z8;
const {
  TID1500MeasurementReport: MeasurementReport_TID1500MeasurementReport,
  TID1501MeasurementGroup: MeasurementReport_TID1501MeasurementGroup
} = MeasurementReport_TID1500;
const {
  DicomMetaDictionary: MeasurementReport_DicomMetaDictionary
} = dcmjs_es/* data */.p;
const MeasurementReport_FINDING = {
  CodingSchemeDesignator: "DCM",
  CodeValue: "121071"
};
const MeasurementReport_FINDING_SITE = {
  CodingSchemeDesignator: "SCT",
  CodeValue: "363698007"
};
const MeasurementReport_FINDING_SITE_OLD = {
  CodingSchemeDesignator: "SRT",
  CodeValue: "G-C0E3"
};
class MeasurementReport_MeasurementReport {
  static getTID300ContentItem(tool, ReferencedSOPSequence, toolClass, worldToImageCoords) {
    const args = toolClass.getTID300RepresentationArguments(tool, worldToImageCoords);
    args.ReferencedSOPSequence = ReferencedSOPSequence;
    const TID300Measurement = new toolClass.TID300Representation(args);
    return TID300Measurement;
  }
  static getMeasurementGroup(toolType, toolData, ReferencedSOPSequence, worldToImageCoords) {
    const toolTypeData = toolData[toolType];
    const toolClass = this.measurementAdapterByToolType.get(toolType);
    if (!toolTypeData || !toolTypeData.data || !toolTypeData.data.length || !toolClass) {
      return;
    }
    const Measurements = toolTypeData.data.map(tool => {
      return this.getTID300ContentItem(tool, ReferencedSOPSequence, toolClass, worldToImageCoords);
    });
    return new MeasurementReport_TID1501MeasurementGroup(Measurements);
  }
  static getCornerstoneLabelFromDefaultState(defaultState) {
    const {
      findingSites = [],
      finding
    } = defaultState;
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
    const fileMetaInformationVersionArray = new Uint8Array(2);
    fileMetaInformationVersionArray[1] = 1;
    const _meta = {
      FileMetaInformationVersion: {
        Value: [fileMetaInformationVersionArray.buffer],
        vr: "OB"
      },
      TransferSyntaxUID: {
        Value: ["1.2.840.10008.1.2.1"],
        vr: "UI"
      },
      ImplementationClassUID: {
        Value: [MeasurementReport_DicomMetaDictionary.uid()],
        vr: "UI"
      },
      ImplementationVersionName: {
        Value: ["dcmjs"],
        vr: "SH"
      }
    };
    return _meta;
  }
  static getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, toolType) {
    const {
      ContentSequence
    } = MeasurementGroup;
    const contentSequenceArr = toArray(ContentSequence);
    const findingGroup = contentSequenceArr.find(group => this.codeValueMatch(group, MeasurementReport_FINDING));
    const findingSiteGroups = contentSequenceArr.filter(group => this.codeValueMatch(group, MeasurementReport_FINDING_SITE, MeasurementReport_FINDING_SITE_OLD)) || [];
    const NUMGroup = contentSequenceArr.find(group => group.ValueType === "NUM");
    const SCOORDGroup = toArray(NUMGroup.ContentSequence).find(group => group.ValueType === "SCOORD");
    const {
      ReferencedSOPSequence
    } = SCOORDGroup.ContentSequence;
    const {
      ReferencedSOPInstanceUID,
      ReferencedFrameNumber
    } = ReferencedSOPSequence;
    const referencedImageId = sopInstanceUIDToImageIdMap[ReferencedSOPInstanceUID];
    const imagePlaneModule = metadata.get("imagePlaneModule", referencedImageId);
    const finding = findingGroup ? MeasurementReport_addAccessors(findingGroup.ConceptCodeSequence) : undefined;
    const findingSites = findingSiteGroups.map(fsg => {
      return MeasurementReport_addAccessors(fsg.ConceptCodeSequence);
    });
    const defaultState = {
      description: undefined,
      sopInstanceUid: ReferencedSOPInstanceUID,
      annotation: {
        annotationUID: MeasurementReport_DicomMetaDictionary.uid(),
        metadata: {
          toolName: toolType,
          referencedImageId,
          FrameOfReferenceUID: imagePlaneModule.frameOfReferenceUID,
          label: ""
        },
        data: undefined
      },
      finding,
      findingSites
    };
    if (defaultState.finding) {
      defaultState.description = defaultState.finding.CodeMeaning;
    }
    defaultState.annotation.metadata.label = MeasurementReport_MeasurementReport.getCornerstoneLabelFromDefaultState(defaultState);
    return {
      defaultState,
      NUMGroup,
      SCOORDGroup,
      ReferencedSOPSequence,
      ReferencedSOPInstanceUID,
      ReferencedFrameNumber
    };
  }
  static generateReport(toolState, metadataProvider, worldToImageCoords, options) {
    let allMeasurementGroups = [];
    const sopInstanceUIDsToSeriesInstanceUIDMap = {};
    const derivationSourceDatasets = [];
    const _meta = MeasurementReport_MeasurementReport.generateDatasetMeta();
    Object.keys(toolState).forEach(imageId => {
      const sopCommonModule = metadataProvider.get("sopCommonModule", imageId);
      const instance = metadataProvider.get("instance", imageId);
      const {
        sopInstanceUID,
        sopClassUID
      } = sopCommonModule;
      const {
        SeriesInstanceUID: seriesInstanceUID
      } = instance;
      sopInstanceUIDsToSeriesInstanceUIDMap[sopInstanceUID] = seriesInstanceUID;
      if (!derivationSourceDatasets.find(dsd => dsd.SeriesInstanceUID === seriesInstanceUID)) {
        const derivationSourceDataset = MeasurementReport_MeasurementReport.generateDerivationSourceDataset(instance);
        derivationSourceDatasets.push(derivationSourceDataset);
      }
      const frameNumber = metadataProvider.get("frameNumber", imageId);
      const toolData = toolState[imageId];
      const toolTypes = Object.keys(toolData);
      const ReferencedSOPSequence = {
        ReferencedSOPClassUID: sopClassUID,
        ReferencedSOPInstanceUID: sopInstanceUID,
        ReferencedFrameNumber: undefined
      };
      if (instance && instance.NumberOfFrames && instance.NumberOfFrames > 1 || MeasurementReport_Normalizer.isMultiframeSOPClassUID(sopClassUID)) {
        ReferencedSOPSequence.ReferencedFrameNumber = frameNumber;
      }
      const measurementGroups = [];
      toolTypes.forEach(toolType => {
        const group = this.getMeasurementGroup(toolType, toolData, ReferencedSOPSequence, worldToImageCoords);
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
    const contentItem = tid1500MeasurementReport.contentItem(derivationSourceDatasets, {
      ...options,
      sopInstanceUIDsToSeriesInstanceUIDMap
    });
    report.dataset = Object.assign(report.dataset, contentItem);
    report.dataset._meta = _meta;
    report.SpecificCharacterSet = "ISO_IR 192";
    return report;
  }
  static generateToolState(dataset, sopInstanceUIDToImageIdMap, imageToWorldCoords, metadata, hooks) {
    if (dataset.ContentTemplateSequence.TemplateIdentifier !== "1500") {
      throw new Error("This package can currently only interpret DICOM SR TID 1500");
    }
    const REPORT = "Imaging Measurements";
    const GROUP = "Measurement Group";
    const TRACKING_IDENTIFIER = "Tracking Identifier";
    const TRACKING_UNIQUE_IDENTIFIER = "Tracking Unique Identifier";
    const imagingMeasurementContent = toArray(dataset.ContentSequence).find(codeMeaningEquals(REPORT));
    const measurementGroups = toArray(imagingMeasurementContent.ContentSequence).filter(codeMeaningEquals(GROUP));
    const measurementData = {};
    measurementGroups.forEach(measurementGroup => {
      try {
        const measurementGroupContentSequence = toArray(measurementGroup.ContentSequence);
        const trackingIdentifierGroup = measurementGroupContentSequence.find(contentItem => contentItem.ConceptNameCodeSequence.CodeMeaning === TRACKING_IDENTIFIER);
        const {
          TextValue: trackingIdentifierValue
        } = trackingIdentifierGroup;
        const trackingUniqueIdentifierGroup = measurementGroupContentSequence.find(contentItem => contentItem.ConceptNameCodeSequence.CodeMeaning === TRACKING_UNIQUE_IDENTIFIER);
        const trackingUniqueIdentifierValue = trackingUniqueIdentifierGroup?.UID;
        const toolAdapter = hooks?.getToolClass?.(measurementGroup, dataset, this.measurementAdapterByToolType) || this.getAdapterForTrackingIdentifier(trackingIdentifierValue);
        if (toolAdapter) {
          const measurement = toolAdapter.getMeasurementData(measurementGroup, sopInstanceUIDToImageIdMap, imageToWorldCoords, metadata, trackingIdentifierValue);
          measurement.TrackingUniqueIdentifier = trackingUniqueIdentifierValue;
          console.log(`=== ${toolAdapter.toolType} ===`);
          console.log(measurement);
          measurementData[toolAdapter.toolType] ||= [];
          measurementData[toolAdapter.toolType].push(measurement);
        }
      } catch (e) {
        console.warn("Unable to generate tool state for", measurementGroup, e);
      }
    });
    return measurementData;
  }
  static registerTool(toolAdapter) {
    let replace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const registerName = toolAdapter.toolType;
    if (this.measurementAdapterByToolType.has(registerName)) {
      if (!replace) {
        throw new Error(`The registered tool name ${registerName} already exists in adapters, use a different toolType or use replace`);
      }
      if (typeof replace === "function") {
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
}
_MeasurementReport = MeasurementReport_MeasurementReport;
_MeasurementReport.CORNERSTONE_3D_TAG = CORNERSTONE_3D_TAG;
_MeasurementReport.measurementAdapterByToolType = new Map();
_MeasurementReport.measurementAdapterByTrackingIdentifier = new Map();
_MeasurementReport.codeValueMatch = (group, code, oldCode) => {
  const {
    ConceptNameCodeSequence
  } = group;
  if (!ConceptNameCodeSequence) {
    return;
  }
  const {
    CodingSchemeDesignator,
    CodeValue
  } = ConceptNameCodeSequence;
  return CodingSchemeDesignator == code.CodingSchemeDesignator && CodeValue == code.CodeValue || oldCode && CodingSchemeDesignator == oldCode.CodingSchemeDesignator && CodeValue == oldCode.CodeValue;
};
_MeasurementReport.generateDerivationSourceDataset = instance => {
  const studyTags = copyStudyTags(instance);
  const seriesTags = copySeriesTags(instance);
  return {
    ...studyTags,
    ...seriesTags
  };
};



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/BaseAdapter3D.js



class BaseAdapter3D {
  static init(toolType, representation, options) {
    this.toolType = toolType;
    if (BaseAdapter3D.toolType) {
      throw new Error(`Base adapter tool type set to ${this.toolType} while setting ${toolType}`);
    }
    this.parentType = options?.parentType;
    this.trackingIdentifiers = new Set();
    this.TID300Representation = representation;
    if (this.parentType) {
      this.trackingIdentifierTextValue = `${CORNERSTONE_3D_TAG}:${this.parentType}:${this.toolType}`;
      const alternateTrackingIdentifier = `${CORNERSTONE_3D_TAG}:${this.toolType}`;
      this.trackingIdentifiers.add(alternateTrackingIdentifier);
    } else {
      this.trackingIdentifierTextValue = `${CORNERSTONE_3D_TAG}:${toolType}`;
    }
    this.trackingIdentifiers.add(this.trackingIdentifierTextValue);
    MeasurementReport_MeasurementReport.registerTool(this);
  }
  static registerLegacy() {
    this.trackingIdentifiers.add(`cornerstoneTools@^4.0.0:${this.toolType}`);
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
    if (!trackingIdentifier.includes(":")) {
      return false;
    }
    return trackingIdentifier.startsWith(this.trackingIdentifierTextValue);
  }
  static getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, _imageToWorldCoords, metadata, trackingIdentifier) {
    const {
      defaultState: state,
      ReferencedFrameNumber
    } = MeasurementReport_MeasurementReport.getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, this.toolType);
    state.annotation.data = {
      cachedStats: {},
      frameNumber: ReferencedFrameNumber,
      seriesLevel: trackingIdentifier?.indexOf(":Series") > 0
    };
    return state;
  }
  static getTID300RepresentationArguments(tool, worldToImageCoords) {
    const {
      data,
      metadata
    } = tool;
    const {
      finding,
      findingSites
    } = tool;
    const {
      referencedImageId
    } = metadata;
    if (!referencedImageId) {
      throw new Error("Probe.getTID300RepresentationArguments: referencedImageId is not defined");
    }
    const {
      handles: {
        points = []
      }
    } = data;
    const pointsImage = points.map(point => {
      const pointImage = worldToImageCoords(referencedImageId, point);
      return {
        x: pointImage[0],
        y: pointImage[1]
      };
    });
    const tidArguments = {
      points: pointsImage,
      trackingIdentifierTextValue: this.trackingIdentifierTextValue,
      findingSites: findingSites || [],
      finding
    };
    return tidArguments;
  }
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/ArrowAnnotate.js





var _ArrowAnnotate;
const {
  Point: ArrowAnnotate_TID300Point
} = dcmjs_es/* utilities */.BF.TID300;
const {
  codeValues
} = CodingScheme;
class ArrowAnnotate_ArrowAnnotate extends BaseAdapter3D {
  static getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, imageToWorldCoords, metadata, _trackingIdentifier) {
    const {
      defaultState,
      SCOORDGroup,
      ReferencedFrameNumber
    } = MeasurementReport_MeasurementReport.getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, ArrowAnnotate_ArrowAnnotate.toolType);
    const referencedImageId = defaultState.annotation.metadata.referencedImageId;
    const text = defaultState.annotation.metadata.label;
    const {
      GraphicData
    } = SCOORDGroup;
    const worldCoords = [];
    for (let i = 0; i < GraphicData.length; i += 2) {
      const point = imageToWorldCoords(referencedImageId, [GraphicData[i], GraphicData[i + 1]]);
      worldCoords.push(point);
    }
    if (worldCoords.length === 1) {
      const imagePixelModule = metadata.get("imagePixelModule", referencedImageId);
      let xOffset = 10;
      let yOffset = 10;
      if (imagePixelModule) {
        const {
          columns,
          rows
        } = imagePixelModule;
        xOffset = columns / 10;
        yOffset = rows / 10;
      }
      const secondPoint = imageToWorldCoords(referencedImageId, [GraphicData[0] + xOffset, GraphicData[1] + yOffset]);
      worldCoords.push(secondPoint);
    }
    const state = defaultState;
    state.annotation.data = {
      text,
      handles: {
        arrowFirst: true,
        points: [worldCoords[0], worldCoords[1]],
        activeHandleIndex: 0,
        textBox: {
          hasMoved: false
        }
      },
      frameNumber: ReferencedFrameNumber
    };
    return state;
  }
  static getTID300RepresentationArguments(tool, worldToImageCoords) {
    const {
      data,
      metadata,
      findingSites
    } = tool;
    let {
      finding
    } = tool;
    const {
      referencedImageId
    } = metadata;
    if (!referencedImageId) {
      throw new Error("ArrowAnnotate.getTID300RepresentationArguments: referencedImageId is not defined");
    }
    const {
      points,
      arrowFirst
    } = data.handles;
    let point;
    let point2;
    if (arrowFirst) {
      point = points[0];
      point2 = points[1];
    } else {
      point = points[1];
      point2 = points[0];
    }
    const pointImage = worldToImageCoords(referencedImageId, point);
    const pointImage2 = worldToImageCoords(referencedImageId, point2);
    const TID300RepresentationArguments = {
      points: [{
        x: pointImage[0],
        y: pointImage[1]
      }, {
        x: pointImage2[0],
        y: pointImage2[1]
      }],
      trackingIdentifierTextValue: this.trackingIdentifierTextValue,
      findingSites: findingSites || [],
      finding
    };
    if (!finding || finding.CodeValue !== codeValues.CORNERSTONEFREETEXT) {
      finding = {
        CodeValue: codeValues.CORNERSTONEFREETEXT,
        CodingSchemeDesignator: CodingScheme.CodingSchemeDesignator,
        CodeMeaning: data.text
      };
    }
    return TID300RepresentationArguments;
  }
}
_ArrowAnnotate = ArrowAnnotate_ArrowAnnotate;
(() => {
  _ArrowAnnotate.init("ArrowAnnotate", ArrowAnnotate_TID300Point);
  _ArrowAnnotate.registerLegacy();
})();



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/Bidirectional.js






var _Bidirectional;
const {
  Bidirectional: Bidirectional_TID300Bidirectional
} = dcmjs_es/* utilities */.BF.TID300;
const Bidirectional_LONG_AXIS = "Long Axis";
const Bidirectional_SHORT_AXIS = "Short Axis";
class Bidirectional_Bidirectional extends BaseAdapter3D {
  static getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, imageToWorldCoords, metadata) {
    const {
      defaultState,
      ReferencedFrameNumber
    } = MeasurementReport_MeasurementReport.getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, Bidirectional_Bidirectional.toolType);
    const referencedImageId = defaultState.annotation.metadata.referencedImageId;
    const {
      ContentSequence
    } = MeasurementGroup;
    const longAxisNUMGroup = toArray(ContentSequence).find(group => group.ConceptNameCodeSequence.CodeMeaning === Bidirectional_LONG_AXIS);
    const longAxisSCOORDGroup = toArray(longAxisNUMGroup.ContentSequence).find(group => group.ValueType === "SCOORD");
    const shortAxisNUMGroup = toArray(ContentSequence).find(group => group.ConceptNameCodeSequence.CodeMeaning === Bidirectional_SHORT_AXIS);
    const shortAxisSCOORDGroup = toArray(shortAxisNUMGroup.ContentSequence).find(group => group.ValueType === "SCOORD");
    const worldCoords = [];
    [longAxisSCOORDGroup, shortAxisSCOORDGroup].forEach(group => {
      const {
        GraphicData
      } = group;
      for (let i = 0; i < GraphicData.length; i += 2) {
        const point = imageToWorldCoords(referencedImageId, [GraphicData[i], GraphicData[i + 1]]);
        worldCoords.push(point);
      }
    });
    const state = defaultState;
    state.annotation.data = {
      handles: {
        points: [worldCoords[0], worldCoords[1], worldCoords[2], worldCoords[3]],
        activeHandleIndex: 0,
        textBox: {
          hasMoved: false
        }
      },
      cachedStats: {
        [`imageId:${referencedImageId}`]: {
          length: longAxisNUMGroup.MeasuredValueSequence.NumericValue,
          width: shortAxisNUMGroup.MeasuredValueSequence.NumericValue
        }
      },
      frameNumber: ReferencedFrameNumber
    };
    return state;
  }
  static getTID300RepresentationArguments(tool, worldToImageCoords) {
    const {
      data,
      finding,
      findingSites,
      metadata
    } = tool;
    const {
      cachedStats = {},
      handles
    } = data;
    const {
      referencedImageId
    } = metadata;
    if (!referencedImageId) {
      throw new Error("Bidirectional.getTID300RepresentationArguments: referencedImageId is not defined");
    }
    const {
      length,
      width
    } = cachedStats[`imageId:${referencedImageId}`] || {};
    const {
      points
    } = handles;
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
    const longAxisStartImage = worldToImageCoords(referencedImageId, shortAxisPoints[0]);
    const longAxisEndImage = worldToImageCoords(referencedImageId, shortAxisPoints[1]);
    const shortAxisStartImage = worldToImageCoords(referencedImageId, longAxisPoints[0]);
    const shortAxisEndImage = worldToImageCoords(referencedImageId, longAxisPoints[1]);
    return {
      longAxis: {
        point1: {
          x: longAxisStartImage[0],
          y: longAxisStartImage[1]
        },
        point2: {
          x: longAxisEndImage[0],
          y: longAxisEndImage[1]
        }
      },
      shortAxis: {
        point1: {
          x: shortAxisStartImage[0],
          y: shortAxisStartImage[1]
        },
        point2: {
          x: shortAxisEndImage[0],
          y: shortAxisEndImage[1]
        }
      },
      longAxisLength: length,
      shortAxisLength: width,
      trackingIdentifierTextValue: this.trackingIdentifierTextValue,
      finding: finding,
      findingSites: findingSites || []
    };
  }
}
_Bidirectional = Bidirectional_Bidirectional;
(() => {
  _Bidirectional.init("Bidirectional", Bidirectional_TID300Bidirectional);
  _Bidirectional.registerLegacy();
})();



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/Angle.js




var _Angle;
const {
  CobbAngle: Angle_TID300CobbAngle
} = dcmjs_es/* utilities */.BF.TID300;
class Angle_Angle extends BaseAdapter3D {
  static getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, imageToWorldCoords, metadata) {
    const {
      defaultState,
      NUMGroup,
      SCOORDGroup,
      ReferencedFrameNumber
    } = MeasurementReport_MeasurementReport.getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, Angle_Angle.toolType);
    const referencedImageId = defaultState.annotation.metadata.referencedImageId;
    const {
      GraphicData
    } = SCOORDGroup;
    const worldCoords = [];
    for (let i = 0; i < GraphicData.length; i += 2) {
      const point = imageToWorldCoords(referencedImageId, [GraphicData[i], GraphicData[i + 1]]);
      worldCoords.push(point);
    }
    const state = defaultState;
    state.annotation.data = {
      handles: {
        points: [worldCoords[0], worldCoords[1], worldCoords[3]],
        activeHandleIndex: 0,
        textBox: {
          hasMoved: false
        }
      },
      cachedStats: {
        [`imageId:${referencedImageId}`]: {
          angle: NUMGroup ? NUMGroup.MeasuredValueSequence.NumericValue : null
        }
      },
      frameNumber: ReferencedFrameNumber
    };
    return state;
  }
  static getTID300RepresentationArguments(tool, worldToImageCoords) {
    const {
      data,
      finding,
      findingSites,
      metadata
    } = tool;
    const {
      cachedStats = {},
      handles
    } = data;
    const {
      referencedImageId
    } = metadata;
    if (!referencedImageId) {
      throw new Error("Angle.getTID300RepresentationArguments: referencedImageId is not defined");
    }
    const start1 = worldToImageCoords(referencedImageId, handles.points[0]);
    const middle = worldToImageCoords(referencedImageId, handles.points[1]);
    const end = worldToImageCoords(referencedImageId, handles.points[2]);
    const point1 = {
      x: start1[0],
      y: start1[1]
    };
    const point2 = {
      x: middle[0],
      y: middle[1]
    };
    const point3 = point2;
    const point4 = {
      x: end[0],
      y: end[1]
    };
    const {
      angle
    } = cachedStats[`imageId:${referencedImageId}`] || {};
    return {
      point1,
      point2,
      point3,
      point4,
      rAngle: angle,
      trackingIdentifierTextValue: this.trackingIdentifierTextValue,
      finding,
      findingSites: findingSites || []
    };
  }
}
_Angle = Angle_Angle;
(() => {
  _Angle.init("Angle", Angle_TID300CobbAngle);
  _Angle.registerLegacy();
})();



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/CobbAngle.js




var _CobbAngle;
const {
  CobbAngle: CobbAngle_TID300CobbAngle
} = dcmjs_es/* utilities */.BF.TID300;
class CobbAngle_CobbAngle extends BaseAdapter3D {
  static getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, imageToWorldCoords, metadata) {
    const {
      defaultState,
      NUMGroup,
      SCOORDGroup,
      ReferencedFrameNumber
    } = MeasurementReport_MeasurementReport.getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, CobbAngle_CobbAngle.toolType);
    const referencedImageId = defaultState.annotation.metadata.referencedImageId;
    const {
      GraphicData
    } = SCOORDGroup;
    const worldCoords = [];
    for (let i = 0; i < GraphicData.length; i += 2) {
      const point = imageToWorldCoords(referencedImageId, [GraphicData[i], GraphicData[i + 1]]);
      worldCoords.push(point);
    }
    const state = defaultState;
    state.annotation.data = {
      handles: {
        points: [worldCoords[0], worldCoords[1], worldCoords[2], worldCoords[3]],
        activeHandleIndex: 0,
        textBox: {
          hasMoved: false
        }
      },
      cachedStats: {
        [`imageId:${referencedImageId}`]: {
          angle: NUMGroup ? NUMGroup.MeasuredValueSequence.NumericValue : null
        }
      },
      frameNumber: ReferencedFrameNumber
    };
    return state;
  }
  static getTID300RepresentationArguments(tool, worldToImageCoords) {
    const {
      data,
      finding,
      findingSites,
      metadata
    } = tool;
    const {
      cachedStats = {},
      handles
    } = data;
    const {
      referencedImageId
    } = metadata;
    if (!referencedImageId) {
      throw new Error("CobbAngle.getTID300RepresentationArguments: referencedImageId is not defined");
    }
    const start1 = worldToImageCoords(referencedImageId, handles.points[0]);
    const end1 = worldToImageCoords(referencedImageId, handles.points[1]);
    const start2 = worldToImageCoords(referencedImageId, handles.points[2]);
    const end2 = worldToImageCoords(referencedImageId, handles.points[3]);
    const point1 = {
      x: start1[0],
      y: start1[1]
    };
    const point2 = {
      x: end1[0],
      y: end1[1]
    };
    const point3 = {
      x: start2[0],
      y: start2[1]
    };
    const point4 = {
      x: end2[0],
      y: end2[1]
    };
    const {
      angle
    } = cachedStats[`imageId:${referencedImageId}`] || {};
    return {
      point1,
      point2,
      point3,
      point4,
      rAngle: angle,
      trackingIdentifierTextValue: this.trackingIdentifierTextValue,
      finding,
      findingSites: findingSites || []
    };
  }
}
_CobbAngle = CobbAngle_CobbAngle;
(() => {
  _CobbAngle.init("CobbAngle", CobbAngle_TID300CobbAngle);
  _CobbAngle.registerLegacy();
})();



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/CircleROI.js




var _CircleROI;
const {
  Circle: CircleROI_TID300Circle
} = dcmjs_es/* utilities */.BF.TID300;
class CircleROI extends BaseAdapter3D {
  static getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, imageToWorldCoords, metadata) {
    const {
      defaultState,
      NUMGroup,
      SCOORDGroup,
      ReferencedFrameNumber
    } = MeasurementReport_MeasurementReport.getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, CircleROI.toolType);
    const referencedImageId = defaultState.annotation.metadata.referencedImageId;
    const {
      GraphicData
    } = SCOORDGroup;
    const pointsWorld = [];
    for (let i = 0; i < GraphicData.length; i += 2) {
      const worldPos = imageToWorldCoords(referencedImageId, [GraphicData[i], GraphicData[i + 1]]);
      pointsWorld.push(worldPos);
    }
    const state = defaultState;
    state.annotation.data = {
      handles: {
        points: [...pointsWorld],
        activeHandleIndex: 0,
        textBox: {
          hasMoved: false
        }
      },
      cachedStats: {
        [`imageId:${referencedImageId}`]: {
          area: NUMGroup ? NUMGroup.MeasuredValueSequence.NumericValue : 0,
          radius: 0,
          perimeter: 0
        }
      },
      frameNumber: ReferencedFrameNumber
    };
    return state;
  }
  static getTID300RepresentationArguments(tool, worldToImageCoords) {
    const {
      data,
      finding,
      findingSites,
      metadata
    } = tool;
    const {
      cachedStats = {},
      handles
    } = data;
    const {
      referencedImageId
    } = metadata;
    if (!referencedImageId) {
      throw new Error("CircleROI.getTID300RepresentationArguments: referencedImageId is not defined");
    }
    const center = worldToImageCoords(referencedImageId, handles.points[0]);
    const end = worldToImageCoords(referencedImageId, handles.points[1]);
    const points = [];
    points.push({
      x: center[0],
      y: center[1]
    });
    points.push({
      x: end[0],
      y: end[1]
    });
    const {
      area,
      radius
    } = cachedStats[`imageId:${referencedImageId}`] || {};
    const perimeter = 2 * Math.PI * radius;
    return {
      area,
      perimeter,
      radius,
      points,
      trackingIdentifierTextValue: this.trackingIdentifierTextValue,
      finding,
      findingSites: findingSites || []
    };
  }
}
_CircleROI = CircleROI;
(() => {
  _CircleROI.init("CircleROI", CircleROI_TID300Circle);
  _CircleROI.registerLegacy();
})();



// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/index.js + 1 modules
var esm = __webpack_require__(3823);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/EllipticalROI.js





var _EllipticalROI;
const {
  Ellipse: EllipticalROI_TID300Ellipse
} = dcmjs_es/* utilities */.BF.TID300;
const EPSILON = 1e-4;
class EllipticalROI extends BaseAdapter3D {
  static getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, imageToWorldCoords, metadata) {
    const {
      defaultState,
      NUMGroup,
      SCOORDGroup,
      ReferencedFrameNumber
    } = MeasurementReport_MeasurementReport.getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, EllipticalROI.toolType);
    const referencedImageId = defaultState.annotation.metadata.referencedImageId;
    const {
      GraphicData
    } = SCOORDGroup;
    const pointsWorld = [];
    for (let i = 0; i < GraphicData.length; i += 2) {
      const worldPos = imageToWorldCoords(referencedImageId, [GraphicData[i], GraphicData[i + 1]]);
      pointsWorld.push(worldPos);
    }
    const majorAxisStart = esm/* vec3.fromValues */.eR.fromValues(...pointsWorld[0]);
    const majorAxisEnd = esm/* vec3.fromValues */.eR.fromValues(...pointsWorld[1]);
    const minorAxisStart = esm/* vec3.fromValues */.eR.fromValues(...pointsWorld[2]);
    const minorAxisEnd = esm/* vec3.fromValues */.eR.fromValues(...pointsWorld[3]);
    const majorAxisVec = esm/* vec3.create */.eR.create();
    esm/* vec3.sub */.eR.sub(majorAxisVec, majorAxisEnd, majorAxisStart);
    esm/* vec3.normalize */.eR.normalize(majorAxisVec, majorAxisVec);
    const minorAxisVec = esm/* vec3.create */.eR.create();
    esm/* vec3.sub */.eR.sub(minorAxisVec, minorAxisEnd, minorAxisStart);
    esm/* vec3.normalize */.eR.normalize(minorAxisVec, minorAxisVec);
    const imagePlaneModule = metadata.get("imagePlaneModule", referencedImageId);
    if (!imagePlaneModule) {
      throw new Error("imageId does not have imagePlaneModule metadata");
    }
    const {
      columnCosines
    } = imagePlaneModule;
    const columnCosinesVec = esm/* vec3.fromValues */.eR.fromValues(columnCosines[0], columnCosines[1], columnCosines[2]);
    const projectedMajorAxisOnColVec = esm/* vec3.dot */.eR.dot(columnCosinesVec, majorAxisVec);
    const projectedMinorAxisOnColVec = esm/* vec3.dot */.eR.dot(columnCosinesVec, minorAxisVec);
    const absoluteOfMajorDotProduct = Math.abs(projectedMajorAxisOnColVec);
    const absoluteOfMinorDotProduct = Math.abs(projectedMinorAxisOnColVec);
    let ellipsePoints = [];
    if (Math.abs(absoluteOfMajorDotProduct - 1) < EPSILON) {
      ellipsePoints = [pointsWorld[0], pointsWorld[1], pointsWorld[2], pointsWorld[3]];
    } else if (Math.abs(absoluteOfMinorDotProduct - 1) < EPSILON) {
      ellipsePoints = [pointsWorld[2], pointsWorld[3], pointsWorld[0], pointsWorld[1]];
    } else {
      console.warn("OBLIQUE ELLIPSE NOT YET SUPPORTED");
    }
    const state = defaultState;
    state.annotation.data = {
      handles: {
        points: [...ellipsePoints],
        activeHandleIndex: 0,
        textBox: {
          hasMoved: false
        }
      },
      cachedStats: {
        [`imageId:${referencedImageId}`]: {
          area: NUMGroup ? NUMGroup.MeasuredValueSequence.NumericValue : 0
        }
      },
      frameNumber: ReferencedFrameNumber
    };
    return state;
  }
  static getTID300RepresentationArguments(tool, worldToImageCoords) {
    const {
      data,
      finding,
      findingSites,
      metadata
    } = tool;
    const {
      cachedStats = {},
      handles
    } = data;
    const rotation = data.initialRotation || 0;
    const {
      referencedImageId
    } = metadata;
    if (!referencedImageId) {
      throw new Error("EllipticalROI.getTID300RepresentationArguments: referencedImageId is not defined");
    }
    let top, bottom, left, right;
    if (rotation == 90 || rotation == 270) {
      bottom = worldToImageCoords(referencedImageId, handles.points[2]);
      top = worldToImageCoords(referencedImageId, handles.points[3]);
      left = worldToImageCoords(referencedImageId, handles.points[0]);
      right = worldToImageCoords(referencedImageId, handles.points[1]);
    } else {
      top = worldToImageCoords(referencedImageId, handles.points[0]);
      bottom = worldToImageCoords(referencedImageId, handles.points[1]);
      left = worldToImageCoords(referencedImageId, handles.points[2]);
      right = worldToImageCoords(referencedImageId, handles.points[3]);
    }
    const topBottomLength = Math.abs(top[1] - bottom[1]);
    const leftRightLength = Math.abs(left[0] - right[0]);
    const points = [];
    if (topBottomLength > leftRightLength) {
      points.push({
        x: top[0],
        y: top[1]
      });
      points.push({
        x: bottom[0],
        y: bottom[1]
      });
      points.push({
        x: left[0],
        y: left[1]
      });
      points.push({
        x: right[0],
        y: right[1]
      });
    } else {
      points.push({
        x: left[0],
        y: left[1]
      });
      points.push({
        x: right[0],
        y: right[1]
      });
      points.push({
        x: top[0],
        y: top[1]
      });
      points.push({
        x: bottom[0],
        y: bottom[1]
      });
    }
    const {
      area
    } = cachedStats[`imageId:${referencedImageId}`] || {};
    return {
      area,
      points,
      trackingIdentifierTextValue: this.trackingIdentifierTextValue,
      finding,
      findingSites: findingSites || []
    };
  }
}
_EllipticalROI = EllipticalROI;
_EllipticalROI.init("EllipticalROI", EllipticalROI_TID300Ellipse);



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/RectangleROI.js




var _RectangleROI;
const {
  Polyline: RectangleROI_TID300Polyline
} = dcmjs_es/* utilities */.BF.TID300;
class RectangleROI extends BaseAdapter3D {
  static getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, imageToWorldCoords, metadata) {
    const {
      defaultState,
      NUMGroup,
      SCOORDGroup,
      ReferencedFrameNumber
    } = MeasurementReport_MeasurementReport.getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, RectangleROI.toolType);
    const referencedImageId = defaultState.annotation.metadata.referencedImageId;
    const {
      GraphicData
    } = SCOORDGroup;
    const worldCoords = [];
    for (let i = 0; i < GraphicData.length; i += 2) {
      const point = imageToWorldCoords(referencedImageId, [GraphicData[i], GraphicData[i + 1]]);
      worldCoords.push(point);
    }
    const state = defaultState;
    state.annotation.data = {
      handles: {
        points: [worldCoords[0], worldCoords[1], worldCoords[3], worldCoords[2]],
        activeHandleIndex: 0,
        textBox: {
          hasMoved: false
        }
      },
      cachedStats: {
        [`imageId:${referencedImageId}`]: {
          area: NUMGroup ? NUMGroup.MeasuredValueSequence.NumericValue : null
        }
      },
      frameNumber: ReferencedFrameNumber
    };
    return state;
  }
  static getTID300RepresentationArguments(tool, worldToImageCoords) {
    const {
      data,
      finding,
      findingSites,
      metadata
    } = tool;
    const {
      cachedStats = {},
      handles
    } = data;
    const {
      referencedImageId
    } = metadata;
    if (!referencedImageId) {
      throw new Error("CobbAngle.getTID300RepresentationArguments: referencedImageId is not defined");
    }
    const corners = handles.points.map(point => worldToImageCoords(referencedImageId, point));
    const {
      area,
      perimeter
    } = cachedStats;
    return {
      points: [corners[0], corners[1], corners[3], corners[2], corners[0]],
      area,
      perimeter,
      trackingIdentifierTextValue: this.trackingIdentifierTextValue,
      finding,
      findingSites: findingSites || []
    };
  }
}
_RectangleROI = RectangleROI;
(() => {
  _RectangleROI.init("RectangleROI", RectangleROI_TID300Polyline);
  _RectangleROI.registerLegacy();
})();



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/Length.js




var _Length;
const {
  Length: Length_TID300Length
} = dcmjs_es/* utilities */.BF.TID300;
const Length_LENGTH = "Length";
class Length_Length extends BaseAdapter3D {
  static getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, imageToWorldCoords, metadata) {
    const {
      defaultState,
      NUMGroup,
      SCOORDGroup,
      ReferencedFrameNumber
    } = MeasurementReport_MeasurementReport.getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, this.toolType);
    const referencedImageId = defaultState.annotation.metadata.referencedImageId;
    const {
      GraphicData
    } = SCOORDGroup;
    const worldCoords = [];
    for (let i = 0; i < GraphicData.length; i += 2) {
      const point = imageToWorldCoords(referencedImageId, [GraphicData[i], GraphicData[i + 1]]);
      worldCoords.push(point);
    }
    const state = defaultState;
    state.annotation.data = {
      handles: {
        points: [worldCoords[0], worldCoords[1]],
        activeHandleIndex: 0,
        textBox: {
          hasMoved: false
        }
      },
      cachedStats: {
        [`imageId:${referencedImageId}`]: {
          length: NUMGroup ? NUMGroup.MeasuredValueSequence.NumericValue : 0
        }
      },
      frameNumber: ReferencedFrameNumber
    };
    return state;
  }
  static getTID300RepresentationArguments(tool, worldToImageCoords) {
    const {
      data,
      finding,
      findingSites,
      metadata
    } = tool;
    const {
      cachedStats = {},
      handles
    } = data;
    const {
      referencedImageId
    } = metadata;
    if (!referencedImageId) {
      throw new Error("Length.getTID300RepresentationArguments: referencedImageId is not defined");
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
    const {
      length: distance
    } = cachedStats[`imageId:${referencedImageId}`] || {};
    return {
      point1,
      point2,
      distance,
      trackingIdentifierTextValue: this.trackingIdentifierTextValue,
      finding,
      findingSites: findingSites || []
    };
  }
}
_Length = Length_Length;
(() => {
  _Length.init(Length_LENGTH, Length_TID300Length);
  _Length.registerLegacy();
})();



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/PlanarFreehandROI.js





var _PlanarFreehandROI;
const {
  Polyline: PlanarFreehandROI_TID300Polyline
} = dcmjs_es/* utilities */.BF.TID300;
class PlanarFreehandROI extends BaseAdapter3D {
  static getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, imageToWorldCoords, metadata) {
    const {
      defaultState,
      NUMGroup,
      SCOORDGroup,
      ReferencedFrameNumber
    } = MeasurementReport_MeasurementReport.getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, PlanarFreehandROI.toolType);
    const referencedImageId = defaultState.annotation.metadata.referencedImageId;
    const {
      GraphicData
    } = SCOORDGroup;
    const worldCoords = [];
    for (let i = 0; i < GraphicData.length; i += 2) {
      const point = imageToWorldCoords(referencedImageId, [GraphicData[i], GraphicData[i + 1]]);
      worldCoords.push(point);
    }
    const distanceBetweenFirstAndLastPoint = esm/* vec3.distance */.eR.distance(worldCoords[worldCoords.length - 1], worldCoords[0]);
    let isOpenContour = true;
    if (distanceBetweenFirstAndLastPoint < this.closedContourThreshold) {
      worldCoords.pop();
      isOpenContour = false;
    }
    const points = [];
    if (isOpenContour) {
      points.push(worldCoords[0], worldCoords[worldCoords.length - 1]);
    }
    const state = defaultState;
    state.annotation.data = {
      contour: {
        polyline: worldCoords,
        closed: !isOpenContour
      },
      handles: {
        points,
        activeHandleIndex: null,
        textBox: {
          hasMoved: false
        }
      },
      cachedStats: {
        [`imageId:${referencedImageId}`]: {
          area: NUMGroup ? NUMGroup.MeasuredValueSequence.NumericValue : null
        }
      },
      frameNumber: ReferencedFrameNumber
    };
    return state;
  }
  static getTID300RepresentationArguments(tool, worldToImageCoords) {
    const {
      data,
      finding,
      findingSites,
      metadata
    } = tool;
    const {
      polyline,
      closed
    } = data.contour;
    const isOpenContour = closed !== true;
    const {
      referencedImageId
    } = metadata;
    if (!referencedImageId) {
      throw new Error("PlanarFreehandROI.getTID300RepresentationArguments: referencedImageId is not defined");
    }
    const points = polyline.map(worldPos => worldToImageCoords(referencedImageId, worldPos));
    if (!isOpenContour) {
      const firstPoint = points[0];
      points.push([firstPoint[0], firstPoint[1]]);
    }
    const {
      area,
      areaUnit,
      modalityUnit,
      perimeter,
      mean,
      max,
      stdDev
    } = data.cachedStats[`imageId:${referencedImageId}`] || {};
    return {
      points,
      area,
      areaUnit,
      perimeter,
      modalityUnit,
      mean,
      max,
      stdDev,
      trackingIdentifierTextValue: this.trackingIdentifierTextValue,
      finding,
      findingSites: findingSites || []
    };
  }
}
_PlanarFreehandROI = PlanarFreehandROI;
_PlanarFreehandROI.closedContourThreshold = 1e-5;
_PlanarFreehandROI.init("PlanarFreehandROI", PlanarFreehandROI_TID300Polyline);



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/Probe.js




var _Probe;
const {
  Point: Probe_TID300Point
} = dcmjs_es/* utilities */.BF.TID300;
class Probe extends BaseAdapter3D {
  static getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, imageToWorldCoords, metadata, trackingIdentifier) {
    const state = super.getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, imageToWorldCoords, metadata, trackingIdentifier);
    const {
      defaultState,
      SCOORDGroup
    } = MeasurementReport_MeasurementReport.getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, Probe.toolType);
    const referencedImageId = defaultState.annotation.metadata.referencedImageId;
    const {
      GraphicData
    } = SCOORDGroup;
    const worldCoords = [];
    for (let i = 0; i < GraphicData.length; i += 2) {
      const point = imageToWorldCoords(referencedImageId, [GraphicData[i], GraphicData[i + 1]]);
      worldCoords.push(point);
    }
    state.annotation.data = {
      ...state.annotation.data,
      handles: {
        points: worldCoords,
        activeHandleIndex: null,
        textBox: {
          hasMoved: false
        }
      }
    };
    return state;
  }
}
_Probe = Probe;
(() => {
  _Probe.init("Probe", Probe_TID300Point);
  _Probe.registerLegacy();
})();



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/UltrasoundDirectional.js




var _UltrasoundDirectional;
const {
  Length: UltrasoundDirectional_TID300Length
} = dcmjs_es/* utilities */.BF.TID300;
class UltrasoundDirectional extends BaseAdapter3D {
  static getMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, imageToWorldCoords, metadata) {
    const {
      defaultState,
      SCOORDGroup,
      ReferencedFrameNumber
    } = MeasurementReport_MeasurementReport.getSetupMeasurementData(MeasurementGroup, sopInstanceUIDToImageIdMap, metadata, UltrasoundDirectional.toolType);
    const referencedImageId = defaultState.annotation.metadata.referencedImageId;
    const {
      GraphicData
    } = SCOORDGroup;
    const worldCoords = [];
    for (let i = 0; i < GraphicData.length; i += 2) {
      const point = imageToWorldCoords(referencedImageId, [GraphicData[i], GraphicData[i + 1]]);
      worldCoords.push(point);
    }
    const state = defaultState;
    state.annotation.data = {
      handles: {
        points: [worldCoords[0], worldCoords[1]],
        activeHandleIndex: 0,
        textBox: {
          hasMoved: false
        }
      },
      cachedStats: {},
      frameNumber: ReferencedFrameNumber
    };
    return state;
  }
  static getTID300RepresentationArguments(tool, worldToImageCoords) {
    const {
      data,
      finding,
      findingSites,
      metadata
    } = tool;
    const {
      handles
    } = data;
    const {
      referencedImageId
    } = metadata;
    if (!referencedImageId) {
      throw new Error("UltrasoundDirectionalTool.getTID300RepresentationArguments: referencedImageId is not defined");
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
_UltrasoundDirectional.init("UltrasoundDirectionalTool", UltrasoundDirectional_TID300Length);



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/Segmentation/generateSegmentation.js



const {
  Normalizer: generateSegmentation_Normalizer
} = dcmjs_es/* normalizers */.z8;
const {
  Segmentation: generateSegmentation_SegmentationDerivation
} = dcmjs_es/* derivations */.h4;
function generateSegmentation_generateSegmentation(images, labelmaps, metadata) {
  let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const segmentation = _createMultiframeSegmentationFromReferencedImages(images, metadata, options);
  return fillSegmentation(segmentation, labelmaps, options);
}
function _createMultiframeSegmentationFromReferencedImages(images, metadata, options) {
  const datasets = images.map(image => {
    const instance = metadata.get("instance", image.imageId);
    return {
      ...image,
      ...instance,
      SOPClassUID: instance.SopClassUID || instance.SOPClassUID,
      SOPInstanceUID: instance.SopInstanceUID || instance.SOPInstanceUID,
      PixelData: image.voxelManager.getScalarData(),
      _vrMap: {
        PixelData: "OW"
      },
      _meta: {}
    };
  });
  const multiframe = generateSegmentation_Normalizer.normalizeToDataset(datasets);
  if (!multiframe) {
    throw new Error("Failed to normalize the multiframe dataset, the data is not multi-frame.");
  }
  return new generateSegmentation_SegmentationDerivation([multiframe], options);
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/Segmentation/generateLabelMaps2DFrom3D.js
function generateLabelMaps2DFrom3D(labelmap3D) {
  const {
    scalarData,
    dimensions
  } = labelmap3D;
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



// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var dist_esm = __webpack_require__(15327);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/index.js
var tools_dist_esm = __webpack_require__(4667);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/Segmentation/compactMergeSegData.js
const checkHasOverlapping = _ref => {
  let {
    largerArray,
    currentTestedArray,
    newArray
  } = _ref;
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
  let {
    arrayOfSegmentData,
    newSegmentData
  } = _ref2;
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









const {
  DicomMessage: labelmapImagesFromBuffer_DicomMessage,
  DicomMetaDictionary: labelmapImagesFromBuffer_DicomMetaDictionary
} = dcmjs_es/* data */.p;
const {
  Normalizer: labelmapImagesFromBuffer_Normalizer
} = dcmjs_es/* normalizers */.z8;
const {
  decode: labelmapImagesFromBuffer_decode
} = dcmjs_es/* utilities */.BF.compression;
const updateSegmentsOnFrame = _ref => {
  let {
    segmentsOnFrame,
    imageIdIndex,
    segmentIndex
  } = _ref;
  if (!segmentsOnFrame[imageIdIndex]) {
    segmentsOnFrame[imageIdIndex] = [];
  }
  segmentsOnFrame[imageIdIndex].push(segmentIndex);
};
const updateSegmentsPixelIndices = _ref2 => {
  let {
    segmentsPixelIndices,
    segmentIndex,
    imageIdIndex,
    indexCache
  } = _ref2;
  if (!segmentsPixelIndices.has(segmentIndex)) {
    segmentsPixelIndices.set(segmentIndex, {});
  }
  const segmentIndexObject = segmentsPixelIndices.get(segmentIndex);
  segmentIndexObject[imageIdIndex] = indexCache;
  segmentsPixelIndices.set(segmentIndex, segmentIndexObject);
};
const extractInfoFromPerFrameFunctionalGroups = _ref3 => {
  let {
    PerFrameFunctionalGroups,
    sequenceIndex,
    sopUIDImageIdIndexMap,
    multiframe
  } = _ref3;
  const referencedSOPInstanceUid = PerFrameFunctionalGroups.DerivationImageSequence[0].SourceImageSequence[0].ReferencedSOPInstanceUID;
  const referencedImageId = sopUIDImageIdIndexMap[referencedSOPInstanceUid];
  const segmentIndex = getSegmentIndex(multiframe, sequenceIndex);
  return {
    referencedSOPInstanceUid,
    referencedImageId,
    segmentIndex
  };
};
async function createLabelmapsFromBufferInternal(referencedImageIds, arrayBuffer, metadataProvider, options) {
  const {
    tolerance = 1e-3,
    TypedArrayConstructor = Uint8Array,
    maxBytesPerChunk = 199000000
  } = options;
  const dicomData = labelmapImagesFromBuffer_DicomMessage.readFile(arrayBuffer);
  const dataset = labelmapImagesFromBuffer_DicomMetaDictionary.naturalizeDataset(dicomData.dict);
  dataset._meta = labelmapImagesFromBuffer_DicomMetaDictionary.namifyDataset(dicomData.meta);
  const multiframe = labelmapImagesFromBuffer_Normalizer.normalizeToDataset([dataset]);
  const imagePlaneModule = metadataProvider.get("imagePlaneModule", referencedImageIds[0]);
  const generalSeriesModule = metadataProvider.get("generalSeriesModule", referencedImageIds[0]);
  const SeriesInstanceUID = generalSeriesModule.seriesInstanceUID;
  if (!imagePlaneModule) {
    console.warn("Insufficient metadata, imagePlaneModule missing.");
  }
  const ImageOrientationPatient = Array.isArray(imagePlaneModule.rowCosines) ? [...imagePlaneModule.rowCosines, ...imagePlaneModule.columnCosines] : [imagePlaneModule.rowCosines.x, imagePlaneModule.rowCosines.y, imagePlaneModule.rowCosines.z, imagePlaneModule.columnCosines.x, imagePlaneModule.columnCosines.y, imagePlaneModule.columnCosines.z];
  const validOrientations = Segmentation_4X_getValidOrientations(ImageOrientationPatient);
  const segMetadata = Segmentation_4X_getSegmentMetadata(multiframe, SeriesInstanceUID);
  const TransferSyntaxUID = multiframe._meta.TransferSyntaxUID.Value[0];
  let pixelData;
  let pixelDataChunks;
  if (TransferSyntaxUID === "1.2.840.10008.1.2.5") {
    const rleEncodedFrames = Array.isArray(multiframe.PixelData) ? multiframe.PixelData : [multiframe.PixelData];
    pixelData = labelmapImagesFromBuffer_decode(rleEncodedFrames, multiframe.Rows, multiframe.Columns);
    if (multiframe.BitsStored === 1) {
      console.warn("No implementation for rle + bit packing.");
      return;
    }
    pixelDataChunks = [pixelData];
  } else {
    pixelDataChunks = Segmentation_4X_unpackPixelData(multiframe, {
      maxBytesPerChunk
    });
    if (!pixelDataChunks) {
      throw new Error("Fractional segmentations are not yet supported");
    }
  }
  const orientation = checkOrientation(multiframe, validOrientations, [imagePlaneModule.rows, imagePlaneModule.columns, referencedImageIds.length], tolerance);
  const sopUIDImageIdIndexMap = referencedImageIds.reduce((acc, imageId) => {
    const {
      sopInstanceUID
    } = metadataProvider.get("generalImageModule", imageId);
    acc[sopInstanceUID] = imageId;
    return acc;
  }, {});
  let insertFunction;
  switch (orientation) {
    case "Planar":
      insertFunction = labelmapImagesFromBuffer_insertPixelDataPlanar;
      break;
    case "Perpendicular":
      throw new Error("Segmentations orthogonal to the acquisition plane of the source data are not yet supported.");
    case "Oblique":
      throw new Error("Segmentations oblique to the acquisition plane of the source data are not yet supported.");
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
    imageIdMaps.metadata[referenceImageId] = metadataProvider.get("instance", referenceImageId);
    const labelMapImage = dist_esm.imageLoader.createAndCacheDerivedLabelmapImage(referenceImageId);
    labelMapImages.push(labelMapImage);
  }
  const segmentsPixelIndices = new Map();
  const {
    hasOverlappingSegments,
    arrayOfLabelMapImages
  } = await insertFunction({
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
    imageIdMaps,
    TypedArrayConstructor
  });
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
const throttledTriggerLoadProgressEvent = tools_dist_esm.utilities.throttle(percentComplete => {
  (0,dist_esm.triggerEvent)(dist_esm.eventTarget, Events.SEGMENTATION_LOAD_PROGRESS, {
    percentComplete
  });
}, 200);
function labelmapImagesFromBuffer_insertPixelDataPlanar(_ref4) {
  let {
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
  } = _ref4;
  const {
    SharedFunctionalGroupsSequence,
    PerFrameFunctionalGroupsSequence,
    Rows,
    Columns
  } = multiframe;
  const sharedImageOrientationPatient = SharedFunctionalGroupsSequence.PlaneOrientationSequence ? SharedFunctionalGroupsSequence.PlaneOrientationSequence.ImageOrientationPatient : undefined;
  const sliceLength = Columns * Rows;
  const groupsLen = PerFrameFunctionalGroupsSequence.length;
  let overlapping = false;
  return new Promise(resolve => {
    const percentImagesPerChunk = 0.1;
    const imagesPerChunk = Math.ceil(groupsLen * percentImagesPerChunk);
    const processChunk = firstIndex => {
      for (let i = firstIndex; i < firstIndex + imagesPerChunk && i < groupsLen; i++) {
        const PerFrameFunctionalGroups = PerFrameFunctionalGroupsSequence[i];
        const ImageOrientationPatientI = sharedImageOrientationPatient || PerFrameFunctionalGroups.PlaneOrientationSequence.ImageOrientationPatient;
        const view = readFromUnpackedChunks(pixelDataChunks, i * sliceLength, sliceLength);
        const pixelDataI2D = ndarray_default()(view, [Rows, Columns]);
        const alignedPixelDataI = Segmentation_4X_alignPixelDataWithSourceData(pixelDataI2D, ImageOrientationPatientI, validOrientations, tolerance);
        if (!alignedPixelDataI) {
          throw new Error("Individual SEG frames are out of plane with respect to the first SEG frame. " + "This is not yet supported. Aborting segmentation loading.");
        }
        const segmentIndex = getSegmentIndex(multiframe, i);
        if (segmentIndex === undefined) {
          throw new Error("Could not retrieve the segment index. Aborting segmentation loading.");
        }
        if (!segmentsPixelIndices.has(segmentIndex)) {
          segmentsPixelIndices.set(segmentIndex, {});
        }
        const imageId = findReferenceSourceImageId(multiframe, i, referencedImageIds, metadataProvider, tolerance, sopUIDImageIdIndexMap);
        if (!imageId) {
          console.warn("Image not present in stack, can't import frame : " + i + ".");
          return;
        }
        const sourceImageMetadata = imageIdMaps.metadata[imageId];
        if (Rows !== sourceImageMetadata.Rows || Columns !== sourceImageMetadata.Columns) {
          throw new Error("Individual SEG frames have different geometry dimensions (Rows and Columns) " + "respect to the source image reference frame. This is not yet supported. " + "Aborting segmentation loading. ");
        }
        const imageIdIndex = imageIdMaps.indices[imageId];
        const labelmapImage = labelMapImages[imageIdIndex];
        const labelmap2DView = labelmapImage.getPixelData();
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
    processChunk(0);
  });
}
const getAlignedPixelData = _ref5 => {
  let {
    sharedImageOrientationPatient,
    PerFrameFunctionalGroups,
    pixelDataChunks,
    sequenceIndex,
    sliceLength,
    Rows,
    Columns,
    validOrientations,
    tolerance
  } = _ref5;
  const ImageOrientationPatientI = sharedImageOrientationPatient || PerFrameFunctionalGroups.PlaneOrientationSequence.ImageOrientationPatient;
  const view = readFromUnpackedChunks(pixelDataChunks, sequenceIndex * sliceLength, sliceLength);
  const pixelDataI2D = ndarray_default()(view, [Rows, Columns]);
  const alignedPixelDataI = Segmentation_4X_alignPixelDataWithSourceData(pixelDataI2D, ImageOrientationPatientI, validOrientations, tolerance);
  if (!alignedPixelDataI) {
    throw new Error("Individual SEG frames are out of plane with respect to the first SEG frame. " + "This is not yet supported. Aborting segmentation loading.");
  }
  return alignedPixelDataI;
};
const checkImageDimensions = _ref6 => {
  let {
    metadataProvider,
    imageId,
    Rows,
    Columns
  } = _ref6;
  const sourceImageMetadata = metadataProvider.get("instance", imageId);
  if (Rows !== sourceImageMetadata.Rows || Columns !== sourceImageMetadata.Columns) {
    throw new Error("Individual SEG frames have different geometry dimensions (Rows and Columns) " + "respect to the source image reference frame. This is not yet supported. " + "Aborting segmentation loading. ");
  }
};
const getArrayOfLabelMapImagesWithSegmentData = _ref7 => {
  let {
    arrayOfSegmentData,
    referencedImageIds
  } = _ref7;
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
      const labelMapImage = dist_esm.imageLoader.createAndCacheDerivedLabelmapImage(referencedImageId);
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
function labelmapImagesFromBuffer_insertOverlappingPixelDataPlanar(_ref8) {
  let {
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
  } = _ref8;
  const {
    SharedFunctionalGroupsSequence,
    PerFrameFunctionalGroupsSequence,
    Rows,
    Columns
  } = multiframe;
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
const getArrayOfSegmentData = _ref9 => {
  let {
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
  } = _ref9;
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
const getSegmentData = _ref10 => {
  let {
    PerFrameFunctionalGroupsSequence,
    labelMapImages,
    sopUIDImageIdIndexMap,
    multiframe,
    segmentIndex,
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
  } = _ref10;
  const segmentData = [];
  for (let currentLabelMapImageIndex = 0; currentLabelMapImageIndex < labelMapImages.length; currentLabelMapImageIndex++) {
    const currentLabelMapImage = labelMapImages[currentLabelMapImageIndex];
    const referencedImageId = currentLabelMapImage.referencedImageId;
    const PerFrameFunctionalGroupsIndex = PerFrameFunctionalGroupsSequence.findIndex((PerFrameFunctionalGroups, currentSequenceIndex) => {
      const {
        segmentIndex: groupsSegmentIndex,
        referencedImageId: groupsReferenceImageId
      } = extractInfoFromPerFrameFunctionalGroups({
        PerFrameFunctionalGroups,
        sequenceIndex: currentSequenceIndex,
        sopUIDImageIdIndexMap,
        multiframe
      });
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



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/Segmentation/generateToolState.js



function generateToolState_generateToolState(imageIds, arrayBuffer, metadataProvider) {
  let skipOverlapping = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  let tolerance = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1e-3;
  let cs3dVersion = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 4;
  return Segmentation_generateToolState(imageIds, arrayBuffer, metadataProvider, skipOverlapping, tolerance, cs3dVersion);
}
function createFromDICOMSegBuffer(referencedImageIds, arrayBuffer, _ref) {
  let {
    metadataProvider,
    tolerance = 1e-3
  } = _ref;
  return createLabelmapsFromBufferInternal(referencedImageIds, arrayBuffer, metadataProvider, {
    tolerance
  });
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/Segmentation/index.js




;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/ParametricMap/generateToolState.js


const {
  ParametricMap
} = CornerstonePMAP;
const {
  generateToolState: generateToolStateCornerstone
} = ParametricMap;
function ParametricMap_generateToolState_generateToolState(imageIds, arrayBuffer, metadataProvider) {
  let skipOverlapping = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  let tolerance = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1e-3;
  return generateToolStateCornerstone(imageIds, arrayBuffer, metadataProvider, skipOverlapping, tolerance);
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/ParametricMap/index.js


;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/RTStruct/utilities/getPatientModule.js
function getPatientModule(imageId, metadataProvider) {
  const generalSeriesModule = metadataProvider.get("generalSeriesModule", imageId);
  const generalStudyModule = metadataProvider.get("generalStudyModule", imageId);
  const patientStudyModule = metadataProvider.get("patientStudyModule", imageId);
  const patientModule = metadataProvider.get("patientModule", imageId);
  const patientDemographicModule = metadataProvider.get("patientDemographicModule", imageId);
  return {
    Modality: generalSeriesModule.modality,
    PatientID: patientModule.patientId,
    PatientName: patientModule.patientName,
    PatientBirthDate: "",
    PatientAge: patientStudyModule.patientAge,
    PatientSex: patientDemographicModule.patientSex,
    PatientWeight: patientStudyModule.patientWeight,
    StudyDate: generalStudyModule.studyDate,
    StudyTime: generalStudyModule.studyTime,
    StudyID: "ToDo",
    AccessionNumber: generalStudyModule.accessionNumber
  };
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/RTStruct/utilities/getReferencedFrameOfReferenceSequence.js
function getReferencedFrameOfReferenceSequence(metadata, metadataProvider, dataset) {
  const {
    referencedImageId: imageId,
    FrameOfReferenceUID
  } = metadata;
  const instance = metadataProvider.get("instance", imageId);
  const {
    SeriesInstanceUID
  } = instance;
  const {
    ReferencedSeriesSequence
  } = dataset;
  return [{
    FrameOfReferenceUID,
    RTReferencedStudySequence: [{
      ReferencedSOPClassUID: dataset.SOPClassUID,
      ReferencedSOPInstanceUID: dataset.SOPInstanceUID,
      RTReferencedSeriesSequence: [{
        SeriesInstanceUID,
        ContourImageSequence: [...ReferencedSeriesSequence[0].ReferencedInstanceSequence]
      }]
    }]
  }];
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/RTStruct/utilities/getReferencedSeriesSequence.js
function getReferencedSeriesSequence(metadata, _index, metadataProvider, DicomMetadataStore) {
  // grab imageId from toolData
  const {
    referencedImageId: imageId
  } = metadata;
  const instance = metadataProvider.get("instance", imageId);
  const {
    SeriesInstanceUID,
    StudyInstanceUID
  } = instance;
  const ReferencedSeriesSequence = [];
  if (SeriesInstanceUID) {
    const series = DicomMetadataStore.getSeries(StudyInstanceUID, SeriesInstanceUID);
    const ReferencedSeries = {
      SeriesInstanceUID,
      ReferencedInstanceSequence: []
    };
    series.instances.forEach(instance => {
      const {
        SOPInstanceUID,
        SOPClassUID
      } = instance;
      ReferencedSeries.ReferencedInstanceSequence.push({
        ReferencedSOPClassUID: SOPClassUID,
        ReferencedSOPInstanceUID: SOPInstanceUID
      });
    });
    ReferencedSeriesSequence.push(ReferencedSeries);
  }
  return ReferencedSeriesSequence;
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/RTStruct/utilities/getRTROIObservationsSequence.js
function getRTROIObservationsSequence(toolData, index) {
  return {
    ObservationNumber: index + 1,
    ReferencedROINumber: index + 1,
    RTROIInterpretedType: "Todo: type",
    ROIInterpreter: "Todo: interpreter"
  };
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/RTStruct/utilities/getRTSeriesModule.js
function getRTSeriesModule(DicomMetaDictionary) {
  return {
    SeriesInstanceUID: DicomMetaDictionary.uid(),
    // generate a new series instance uid
    SeriesNumber: "99" // Todo:: what should be the series number?
  };
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/RTStruct/utilities/getStructureSetModule.js
function getStructureSetModule(contour, index) {
  const {
    FrameOfReferenceUID
  } = contour.metadata;
  return {
    ROINumber: index + 1,
    ROIName: contour.name || `Todo: name ${index + 1}`,
    ROIDescription: `Todo: description ${index + 1}`,
    ROIGenerationAlgorithm: "Todo: algorithm",
    ReferencedFrameOfReferenceUID: FrameOfReferenceUID
  };
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/RTStruct/RTSS.js









const {
  generateContourSetsFromLabelmap,
  AnnotationToPointData
} = tools_dist_esm.utilities.contours;
const {
  DicomMetaDictionary: RTSS_DicomMetaDictionary
} = dcmjs_es/* default.data */.Ay.data;
async function generateRTSSFromSegmentations(segmentations, metadataProvider, DicomMetadataStore) {
  const roiContours = [];
  const contourSets = await generateContourSetsFromLabelmap({
    segmentations
  });
  contourSets.forEach((contourSet, segIndex) => {
    if (contourSet) {
      const contourSequence = [];
      contourSet.sliceContours.forEach(sliceContour => {
        const sopCommon = metadataProvider.get("sopCommonModule", sliceContour.referencedImageId);
        const ReferencedSOPClassUID = sopCommon.sopClassUID;
        const ReferencedSOPInstanceUID = sopCommon.sopInstanceUID;
        const ContourImageSequence = [{
          ReferencedSOPClassUID,
          ReferencedSOPInstanceUID
        }];
        const sliceContourPolyData = sliceContour.polyData;
        sliceContour.contours.forEach((contour, index) => {
          const ContourGeometricType = contour.type;
          const NumberOfContourPoints = contour.contourPoints.length;
          const ContourData = [];
          contour.contourPoints.forEach(point => {
            const pointData = sliceContourPolyData.points[point];
            pointData[0] = +pointData[0].toFixed(2);
            pointData[1] = +pointData[1].toFixed(2);
            pointData[2] = +pointData[2].toFixed(2);
            ContourData.push(pointData[0]);
            ContourData.push(pointData[1]);
            ContourData.push(pointData[2]);
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
      const segLabel = contourSet.label || `Segment ${segIndex + 1}`;
      const ROIContour = {
        name: segLabel,
        description: segLabel,
        contourSequence,
        color: contourSet.color,
        metadata: contourSet.metadata
      };
      roiContours.push(ROIContour);
    }
  });
  const rtMetadata = {
    name: segmentations.label,
    label: segmentations.label
  };
  const dataset = _initializeDataset(rtMetadata, roiContours[0].metadata, metadataProvider);
  roiContours.forEach((contour, index) => {
    const roiContour = {
      ROIDisplayColor: contour.color || [255, 0, 0],
      ContourSequence: contour.contourSequence,
      ReferencedROINumber: index + 1
    };
    dataset.StructureSetROISequence.push(getStructureSetModule(contour, index));
    dataset.ROIContourSequence.push(roiContour);
    dataset.ReferencedSeriesSequence = getReferencedSeriesSequence(contour.metadata, index, metadataProvider, DicomMetadataStore);
    dataset.ReferencedFrameOfReferenceSequence = getReferencedFrameOfReferenceSequence(contour.metadata, metadataProvider, dataset);
  });
  const fileMetaInformationVersionArray = new Uint8Array(2);
  fileMetaInformationVersionArray[1] = 1;
  const _meta = {
    FileMetaInformationVersion: {
      Value: [fileMetaInformationVersionArray.buffer],
      vr: "OB"
    },
    TransferSyntaxUID: {
      Value: ["1.2.840.10008.1.2.1"],
      vr: "UI"
    },
    ImplementationClassUID: {
      Value: [RTSS_DicomMetaDictionary.uid()],
      vr: "UI"
    },
    ImplementationVersionName: {
      Value: ["dcmjs"],
      vr: "SH"
    }
  };
  dataset._meta = _meta;
  dataset.SpecificCharacterSet = "ISO_IR 192";
  return dataset;
}
function generateRTSSFromAnnotations(annotations, metadataProvider, DicomMetadataStore) {
  const rtMetadata = {
    name: "RTSS from Annotations",
    label: "RTSS from Annotations"
  };
  const dataset = _initializeDataset(rtMetadata, annotations[0].metadata, metadataProvider);
  annotations.forEach((annotation, index) => {
    const ContourSequence = AnnotationToPointData.convert(annotation, index, metadataProvider);
    dataset.StructureSetROISequence.push(getStructureSetModule(annotation, index));
    dataset.ROIContourSequence.push(ContourSequence);
    dataset.RTROIObservationsSequence.push(getRTROIObservationsSequence(annotation, index));
    dataset.ReferencedSeriesSequence = getReferencedSeriesSequence(annotation.metadata, index, metadataProvider, DicomMetadataStore);
    dataset.ReferencedFrameOfReferenceSequence = getReferencedFrameOfReferenceSequence(annotation.metadata, metadataProvider, dataset);
  });
  const fileMetaInformationVersionArray = new Uint8Array(2);
  fileMetaInformationVersionArray[1] = 1;
  const _meta = {
    FileMetaInformationVersion: {
      Value: [fileMetaInformationVersionArray.buffer],
      vr: "OB"
    },
    TransferSyntaxUID: {
      Value: ["1.2.840.10008.1.2.1"],
      vr: "UI"
    },
    ImplementationClassUID: {
      Value: [RTSS_DicomMetaDictionary.uid()],
      vr: "UI"
    },
    ImplementationVersionName: {
      Value: ["dcmjs"],
      vr: "SH"
    }
  };
  dataset._meta = _meta;
  dataset.SpecificCharacterSet = "ISO_IR 192";
  return dataset;
}
function _initializeDataset(rtMetadata, imgMetadata, metadataProvider) {
  const rtSOPInstanceUID = RTSS_DicomMetaDictionary.uid();
  const {
    referencedImageId: imageId,
    FrameOfReferenceUID
  } = imgMetadata;
  const {
    studyInstanceUID
  } = metadataProvider.get("generalSeriesModule", imageId);
  const patientModule = getPatientModule(imageId, metadataProvider);
  const rtSeriesModule = getRTSeriesModule(RTSS_DicomMetaDictionary);
  return {
    StructureSetROISequence: [],
    ROIContourSequence: [],
    RTROIObservationsSequence: [],
    ReferencedSeriesSequence: [],
    ReferencedFrameOfReferenceSequence: [],
    ...patientModule,
    ...rtSeriesModule,
    StudyInstanceUID: studyInstanceUID,
    SOPClassUID: "1.2.840.10008.5.1.4.1.1.481.3",
    SOPInstanceUID: rtSOPInstanceUID,
    Manufacturer: "dcmjs",
    Modality: "RTSTRUCT",
    FrameOfReferenceUID,
    PositionReferenceIndicator: "",
    StructureSetLabel: rtMetadata.label || "",
    StructureSetName: rtMetadata.name || "",
    ReferringPhysicianName: "",
    OperatorsName: "",
    StructureSetDate: RTSS_DicomMetaDictionary.date(),
    StructureSetTime: RTSS_DicomMetaDictionary.time(),
    _meta: null
  };
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/RTStruct/index.js



const {
  generateContourSetsFromLabelmap: RTStruct_generateContourSetsFromLabelmap
} = tools_dist_esm.utilities.contours;



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/Cornerstone3D/KeyImage.js



var _KeyImage;
const {
  Point: KeyImage_TID300Point
} = dcmjs_es/* utilities */.BF.TID300;
class KeyImage extends Probe {
  static getMeasurementData(measurementGroup, sopInstanceUIDToImageIdMap, imageToWorldCoords, metadata, trackingIdentifier) {
    const baseData = super.getMeasurementData(measurementGroup, sopInstanceUIDToImageIdMap, imageToWorldCoords, metadata, trackingIdentifier);
    const {
      data
    } = baseData.annotation;
    data.isPoint = trackingIdentifier.indexOf("Point") !== -1;
    return baseData;
  }
  static getTID300RepresentationArguments(tool, worldToImageCoords) {
    const tid300Arguments = super.getTID300RepresentationArguments(tool, worldToImageCoords);
    const {
      data
    } = tool;
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
_KeyImage.init("KeyImage", KeyImage_TID300Point, {
  parentType: Probe.toolType
});
_KeyImage.trackingSeriesIdentifier = `${_KeyImage.trackingIdentifierTextValue}:Series`;
_KeyImage.trackingPointIdentifier = `${_KeyImage.trackingIdentifierTextValue}:Point`;
_KeyImage.trackingSeriesPointIdentifier = `${_KeyImage.trackingIdentifierTextValue}:SeriesPoint`;



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
  CORNERSTONE_3D_TAG: CORNERSTONE_3D_TAG
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


const {
  Colors,
  BitArray: Segmentation_BitArray
} = dcmjs_es/* data */.p;

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
    if (dataset.SegmentSequence.constructor.name !== "Array") {
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



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/enums/index.js


;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/graphicTypeEquals.js
const graphicTypeEquals = graphicType => {
  return contentItem => {
    return contentItem && contentItem.GraphicType === graphicType;
  };
};



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/downloadDICOMData.js



const {
  datasetToDict
} = dcmjs_es/* data */.p;
function downloadDICOMData(bufferOrDataset, filename) {
  let blob;
  if (bufferOrDataset instanceof ArrayBuffer) {
    blob = new Blob([bufferOrDataset], {
      type: "application/dicom"
    });
  } else {
    if (!bufferOrDataset._meta) {
      throw new Error("Dataset must have a _meta property");
    }
    const buffer = node_modules_buffer/* Buffer */.hp.from(datasetToDict(bufferOrDataset).write());
    blob = new Blob([buffer], {
      type: "application/dicom"
    });
  }
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}



;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/adapters/helpers/index.js







;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/index.js







/***/ }),

/***/ 75183:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var ChangeTypes;
(function (ChangeTypes) {
    ChangeTypes["Interaction"] = "Interaction";
    ChangeTypes["HandlesUpdated"] = "HandlesUpdated";
    ChangeTypes["StatsUpdated"] = "StatsUpdated";
    ChangeTypes["InitialSetup"] = "InitialSetup";
    ChangeTypes["Completed"] = "Completed";
    ChangeTypes["InterpolationUpdated"] = "InterpolationUpdated";
    ChangeTypes["History"] = "History";
    ChangeTypes["MetadataReferenceModified"] = "MetadataReferenceModified";
    ChangeTypes["LabelChange"] = "LabelChange";
})(ChangeTypes || (ChangeTypes = {}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChangeTypes);


/***/ }),

/***/ 94021:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var Events;
(function (Events) {
    Events["TOOL_ACTIVATED"] = "CORNERSTONE_TOOLS_TOOL_ACTIVATED";
    Events["TOOLGROUP_VIEWPORT_ADDED"] = "CORNERSTONE_TOOLS_TOOLGROUP_VIEWPORT_ADDED";
    Events["TOOLGROUP_VIEWPORT_REMOVED"] = "CORNERSTONE_TOOLS_TOOLGROUP_VIEWPORT_REMOVED";
    Events["TOOL_MODE_CHANGED"] = "CORNERSTONE_TOOLS_TOOL_MODE_CHANGED";
    Events["CROSSHAIR_TOOL_CENTER_CHANGED"] = "CORNERSTONE_TOOLS_CROSSHAIR_TOOL_CENTER_CHANGED";
    Events["ANNOTATION_ADDED"] = "CORNERSTONE_TOOLS_ANNOTATION_ADDED";
    Events["ANNOTATION_COMPLETED"] = "CORNERSTONE_TOOLS_ANNOTATION_COMPLETED";
    Events["ANNOTATION_MODIFIED"] = "CORNERSTONE_TOOLS_ANNOTATION_MODIFIED";
    Events["ANNOTATION_REMOVED"] = "CORNERSTONE_TOOLS_ANNOTATION_REMOVED";
    Events["ANNOTATION_SELECTION_CHANGE"] = "CORNERSTONE_TOOLS_ANNOTATION_SELECTION_CHANGE";
    Events["ANNOTATION_LOCK_CHANGE"] = "CORNERSTONE_TOOLS_ANNOTATION_LOCK_CHANGE";
    Events["ANNOTATION_VISIBILITY_CHANGE"] = "CORNERSTONE_TOOLS_ANNOTATION_VISIBILITY_CHANGE";
    Events["ANNOTATION_RENDERED"] = "CORNERSTONE_TOOLS_ANNOTATION_RENDERED";
    Events["ANNOTATION_INTERPOLATION_PROCESS_COMPLETED"] = "CORNERSTONE_TOOLS_ANNOTATION_INTERPOLATION_PROCESS_COMPLETED";
    Events["INTERPOLATED_ANNOTATIONS_REMOVED"] = "CORNERSTONE_TOOLS_INTERPOLATED_ANNOTATIONS_REMOVED";
    Events["SEGMENTATION_MODIFIED"] = "CORNERSTONE_TOOLS_SEGMENTATION_MODIFIED";
    Events["SEGMENTATION_RENDERED"] = "CORNERSTONE_TOOLS_SEGMENTATION_RENDERED";
    Events["SEGMENTATION_REPRESENTATION_ADDED"] = "CORNERSTONE_TOOLS_SEGMENTATION_REPRESENTATION_ADDED";
    Events["SEGMENTATION_ADDED"] = "CORNERSTONE_TOOLS_SEGMENTATION_ADDED";
    Events["SEGMENTATION_REPRESENTATION_MODIFIED"] = "CORNERSTONE_TOOLS_SEGMENTATION_REPRESENTATION_MODIFIED";
    Events["SEGMENTATION_REMOVED"] = "CORNERSTONE_TOOLS_SEGMENTATION_REMOVED";
    Events["SEGMENTATION_REPRESENTATION_REMOVED"] = "CORNERSTONE_TOOLS_SEGMENTATION_REPRESENTATION_REMOVED";
    Events["SEGMENTATION_DATA_MODIFIED"] = "CORNERSTONE_TOOLS_SEGMENTATION_DATA_MODIFIED";
    Events["HISTORY_UNDO"] = "CORNERSTONE_TOOLS_HISTORY_UNDO";
    Events["HISTORY_REDO"] = "CORNERSTONE_TOOLS_HISTORY_REDO";
    Events["KEY_DOWN"] = "CORNERSTONE_TOOLS_KEY_DOWN";
    Events["KEY_UP"] = "CORNERSTONE_TOOLS_KEY_UP";
    Events["MOUSE_DOWN"] = "CORNERSTONE_TOOLS_MOUSE_DOWN";
    Events["MOUSE_UP"] = "CORNERSTONE_TOOLS_MOUSE_UP";
    Events["MOUSE_DOWN_ACTIVATE"] = "CORNERSTONE_TOOLS_MOUSE_DOWN_ACTIVATE";
    Events["MOUSE_DRAG"] = "CORNERSTONE_TOOLS_MOUSE_DRAG";
    Events["MOUSE_MOVE"] = "CORNERSTONE_TOOLS_MOUSE_MOVE";
    Events["MOUSE_CLICK"] = "CORNERSTONE_TOOLS_MOUSE_CLICK";
    Events["MOUSE_DOUBLE_CLICK"] = "CORNERSTONE_TOOLS_MOUSE_DOUBLE_CLICK";
    Events["MOUSE_WHEEL"] = "CORNERSTONE_TOOLS_MOUSE_WHEEL";
    Events["TOUCH_START"] = "CORNERSTONE_TOOLS_TOUCH_START";
    Events["TOUCH_START_ACTIVATE"] = "CORNERSTONE_TOOLS_TOUCH_START_ACTIVATE";
    Events["TOUCH_PRESS"] = "CORNERSTONE_TOOLS_TOUCH_PRESS";
    Events["TOUCH_DRAG"] = "CORNERSTONE_TOOLS_TOUCH_DRAG";
    Events["TOUCH_END"] = "CORNERSTONE_TOOLS_TOUCH_END";
    Events["TOUCH_TAP"] = "CORNERSTONE_TOOLS_TAP";
    Events["TOUCH_SWIPE"] = "CORNERSTONE_TOOLS_SWIPE";
})(Events || (Events = {}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Events);


/***/ }),

/***/ 18682:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var SegmentationRepresentations;
(function (SegmentationRepresentations) {
    SegmentationRepresentations["Labelmap"] = "Labelmap";
    SegmentationRepresentations["Contour"] = "Contour";
    SegmentationRepresentations["Surface"] = "Surface";
})(SegmentationRepresentations || (SegmentationRepresentations = {}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SegmentationRepresentations);


/***/ }),

/***/ 84093:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var StrategyCallbacks;
(function (StrategyCallbacks) {
    StrategyCallbacks["OnInteractionStart"] = "onInteractionStart";
    StrategyCallbacks["OnInteractionEnd"] = "onInteractionEnd";
    StrategyCallbacks["Preview"] = "preview";
    StrategyCallbacks["RejectPreview"] = "rejectPreview";
    StrategyCallbacks["AcceptPreview"] = "acceptPreview";
    StrategyCallbacks["Fill"] = "fill";
    StrategyCallbacks["Interpolate"] = "interpolate";
    StrategyCallbacks["StrategyFunction"] = "strategyFunction";
    StrategyCallbacks["CreateIsInThreshold"] = "createIsInThreshold";
    StrategyCallbacks["Initialize"] = "initialize";
    StrategyCallbacks["INTERNAL_setValue"] = "setValue";
    StrategyCallbacks["AddPreview"] = "addPreview";
    StrategyCallbacks["ComputeInnerCircleRadius"] = "computeInnerCircleRadius";
    StrategyCallbacks["GetStatistics"] = "getStatistics";
    StrategyCallbacks["EnsureImageVolumeFor3DManipulation"] = "ensureImageVolumeFor3DManipulation";
    StrategyCallbacks["EnsureSegmentationVolumeFor3DManipulation"] = "ensureSegmentationVolumeFor3DManipulation";
})(StrategyCallbacks || (StrategyCallbacks = {}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StrategyCallbacks);


/***/ }),

/***/ 66452:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   i: () => (/* binding */ MouseBindings),
/* harmony export */   q: () => (/* binding */ KeyboardBindings)
/* harmony export */ });
var MouseBindings;
(function (MouseBindings) {
    MouseBindings[MouseBindings["Primary"] = 1] = "Primary";
    MouseBindings[MouseBindings["Secondary"] = 2] = "Secondary";
    MouseBindings[MouseBindings["Primary_And_Secondary"] = 3] = "Primary_And_Secondary";
    MouseBindings[MouseBindings["Auxiliary"] = 4] = "Auxiliary";
    MouseBindings[MouseBindings["Primary_And_Auxiliary"] = 5] = "Primary_And_Auxiliary";
    MouseBindings[MouseBindings["Secondary_And_Auxiliary"] = 6] = "Secondary_And_Auxiliary";
    MouseBindings[MouseBindings["Primary_And_Secondary_And_Auxiliary"] = 7] = "Primary_And_Secondary_And_Auxiliary";
    MouseBindings[MouseBindings["Fourth_Button"] = 8] = "Fourth_Button";
    MouseBindings[MouseBindings["Fifth_Button"] = 16] = "Fifth_Button";
    MouseBindings[MouseBindings["Wheel"] = 524288] = "Wheel";
    MouseBindings[MouseBindings["Wheel_Primary"] = 524289] = "Wheel_Primary";
})(MouseBindings || (MouseBindings = {}));
var KeyboardBindings;
(function (KeyboardBindings) {
    KeyboardBindings[KeyboardBindings["Shift"] = 16] = "Shift";
    KeyboardBindings[KeyboardBindings["Ctrl"] = 17] = "Ctrl";
    KeyboardBindings[KeyboardBindings["Alt"] = 18] = "Alt";
    KeyboardBindings[KeyboardBindings["Meta"] = 91] = "Meta";
    KeyboardBindings[KeyboardBindings["ShiftCtrl"] = 1617] = "ShiftCtrl";
    KeyboardBindings[KeyboardBindings["ShiftAlt"] = 1618] = "ShiftAlt";
    KeyboardBindings[KeyboardBindings["ShiftMeta"] = 1691] = "ShiftMeta";
    KeyboardBindings[KeyboardBindings["CtrlAlt"] = 1718] = "CtrlAlt";
    KeyboardBindings[KeyboardBindings["CtrlMeta"] = 1791] = "CtrlMeta";
    KeyboardBindings[KeyboardBindings["AltMeta"] = 1891] = "AltMeta";
})(KeyboardBindings || (KeyboardBindings = {}));



/***/ }),

/***/ 49892:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var ToolModes;
(function (ToolModes) {
    ToolModes["Active"] = "Active";
    ToolModes["Passive"] = "Passive";
    ToolModes["Enabled"] = "Enabled";
    ToolModes["Disabled"] = "Disabled";
})(ToolModes || (ToolModes = {}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ToolModes);


/***/ }),

/***/ 10401:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   H: () => (/* binding */ Swipe)
/* harmony export */ });
var Swipe;
(function (Swipe) {
    Swipe["UP"] = "UP";
    Swipe["DOWN"] = "DOWN";
    Swipe["LEFT"] = "LEFT";
    Swipe["RIGHT"] = "RIGHT";
})(Swipe || (Swipe = {}));



/***/ }),

/***/ 99737:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  AnnotationStyleStates: () => (/* reexport */ enums_AnnotationStyleStates),
  ChangeTypes: () => (/* reexport */ ChangeTypes/* default */.A),
  Events: () => (/* reexport */ Events/* default */.A),
  KeyboardBindings: () => (/* reexport */ ToolBindings/* KeyboardBindings */.q),
  MouseBindings: () => (/* reexport */ ToolBindings/* MouseBindings */.i),
  SegmentationRepresentations: () => (/* reexport */ SegmentationRepresentations/* default */.A),
  StrategyCallbacks: () => (/* reexport */ StrategyCallbacks/* default */.A),
  Swipe: () => (/* reexport */ Touch/* Swipe */.H),
  ToolModes: () => (/* reexport */ ToolModes/* default */.A),
  WorkerTypes: () => (/* reexport */ WorkerTypes)
});

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/ToolBindings.js
var ToolBindings = __webpack_require__(66452);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/ToolModes.js
var ToolModes = __webpack_require__(49892);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/AnnotationStyleStates.js
var AnnotationStyleStates;
(function (AnnotationStyleStates) {
    AnnotationStyleStates["Default"] = "";
    AnnotationStyleStates["Highlighted"] = "Highlighted";
    AnnotationStyleStates["Selected"] = "Selected";
    AnnotationStyleStates["Locked"] = "Locked";
    AnnotationStyleStates["AutoGenerated"] = "AutoGenerated";
})(AnnotationStyleStates || (AnnotationStyleStates = {}));
/* harmony default export */ const enums_AnnotationStyleStates = (AnnotationStyleStates);

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/Events.js
var Events = __webpack_require__(94021);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/SegmentationRepresentations.js
var SegmentationRepresentations = __webpack_require__(18682);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/Touch.js
var Touch = __webpack_require__(10401);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/StrategyCallbacks.js
var StrategyCallbacks = __webpack_require__(84093);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/ChangeTypes.js
var ChangeTypes = __webpack_require__(75183);
;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/WorkerTypes.js
var WorkerTypes_ChangeTypes;
(function (ChangeTypes) {
    ChangeTypes["POLYSEG_CONTOUR_TO_LABELMAP"] = "Converting Contour to Labelmap";
    ChangeTypes["POLYSEG_SURFACE_TO_LABELMAP"] = "Converting Surfaces to Labelmap";
    ChangeTypes["POLYSEG_CONTOUR_TO_SURFACE"] = "Converting Contour to Surface";
    ChangeTypes["POLYSEG_LABELMAP_TO_SURFACE"] = "Converting Labelmap to Surface";
    ChangeTypes["SURFACE_CLIPPING"] = "Clipping Surfaces";
    ChangeTypes["COMPUTE_STATISTICS"] = "Computing Statistics";
    ChangeTypes["INTERPOLATE_LABELMAP"] = "Interpolating Labelmap";
    ChangeTypes["COMPUTE_LARGEST_BIDIRECTIONAL"] = "Computing Largest Bidirectional";
    ChangeTypes["GENERATE_CONTOUR_SETS"] = "Generating Contour Sets";
})(WorkerTypes_ChangeTypes || (WorkerTypes_ChangeTypes = {}));
/* harmony default export */ const WorkerTypes = (WorkerTypes_ChangeTypes);

;// CONCATENATED MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js












/***/ }),

/***/ 26337:
/***/ ((module) => {

"use strict";


function iota(n) {
  var result = new Array(n)
  for(var i=0; i<n; ++i) {
    result[i] = i
  }
  return result
}

module.exports = iota

/***/ }),

/***/ 11604:
/***/ ((module) => {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

module.exports = function isBuffer (obj) {
  return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}


/***/ }),

/***/ 3293:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var iota = __webpack_require__(26337)
var isBuffer = __webpack_require__(11604)

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


/***/ })

}]);