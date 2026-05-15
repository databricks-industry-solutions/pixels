"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[2701],{

/***/ 62701:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ components_OHIFCornerstoneSRViewport)
});

// EXTERNAL MODULE: ../../../node_modules/prop-types/index.js
var prop_types = __webpack_require__(97598);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../core/src/index.ts + 68 modules
var src = __webpack_require__(15871);
// EXTERNAL MODULE: ../../../extensions/cornerstone-dicom-sr/src/tools/modules/dicomSRModule.js
var dicomSRModule = __webpack_require__(76654);
// EXTERNAL MODULE: ../../../extensions/cornerstone-dicom-sr/src/utils/createReferencedImageDisplaySet.ts
var createReferencedImageDisplaySet = __webpack_require__(92643);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/index.tsx + 185 modules
var cornerstone_src = __webpack_require__(39162);
// EXTERNAL MODULE: ../../ui-next/src/index.ts + 3073 modules
var ui_next_src = __webpack_require__(17130);
// EXTERNAL MODULE: ../../core/src/contextProviders/SystemProvider.tsx
var SystemProvider = __webpack_require__(83641);
;// ../../../extensions/cornerstone-dicom-sr/src/components/OHIFCornerstoneSRMeasurementViewport.tsx
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }







const SR_TOOLGROUP_BASE_NAME = 'SRToolGroup';
function OHIFCornerstoneSRMeasurementViewport(props) {
  const {
    servicesManager
  } = (0,SystemProvider/* useSystem */.Jg)();
  const {
    children,
    dataSource,
    displaySets,
    viewportOptions
  } = props;
  const {
    displaySetService
  } = servicesManager.services;
  const viewportId = viewportOptions.viewportId;

  // SR viewport will always have a single display set
  if (displaySets.length > 1) {
    throw new Error('SR viewport should only have a single display set');
  }
  const srDisplaySet = displaySets[0];
  const {
    setPositionPresentation
  } = (0,cornerstone_src.usePositionPresentationStore)();
  const [viewportGrid, viewportGridService] = (0,ui_next_src/* useViewportGrid */.ihW)();
  const [measurementSelected, setMeasurementSelected] = (0,react.useState)(0);
  const [activeImageDisplaySetData, setActiveImageDisplaySetData] = (0,react.useState)(null);
  const [referencedDisplaySetMetadata, setReferencedDisplaySetMetadata] = (0,react.useState)(null);
  const [element, setElement] = (0,react.useState)(null);
  const {
    viewports,
    activeViewportId
  } = viewportGrid;
  const setTrackingIdentifiers = (0,react.useCallback)(measurementSelected => {
    const {
      measurements
    } = srDisplaySet;
    (0,dicomSRModule/* setTrackingUniqueIdentifiersForElement */.m1)(element, measurements.map(measurement => measurement.TrackingUniqueIdentifier), measurementSelected);
  }, [element, measurementSelected, srDisplaySet]);

  /**
   * OnElementEnabled callback which is called after the cornerstoneExtension
   * has enabled the element. Note: we delegate all the image rendering to
   * cornerstoneExtension, so we don't need to do anything here regarding
   * the image rendering, element enabling etc.
   */
  const onElementEnabled = evt => {
    setElement(evt.detail.element);
  };
  const updateViewport = (0,react.useCallback)(newMeasurementSelected => {
    const {
      StudyInstanceUID,
      displaySetInstanceUID
    } = srDisplaySet;
    if (!StudyInstanceUID || !displaySetInstanceUID) {
      return;
    }
    _getViewportReferencedDisplaySetData(srDisplaySet, newMeasurementSelected, displaySetService).then(({
      referencedDisplaySet,
      referencedDisplaySetMetadata
    }) => {
      if (!referencedDisplaySet || !referencedDisplaySetMetadata) {
        return;
      }
      setMeasurementSelected(newMeasurementSelected);
      setActiveImageDisplaySetData(referencedDisplaySet);
      setReferencedDisplaySetMetadata(referencedDisplaySetMetadata);
      const {
        presentationIds
      } = viewportOptions;
      const measurement = srDisplaySet.measurements[newMeasurementSelected];
      setPositionPresentation(presentationIds.positionPresentationId, {
        viewReference: {
          referencedImageId: measurement.imageId
        }
      });
    });
  }, [dataSource, srDisplaySet, activeImageDisplaySetData, viewportId]);
  const getCornerstoneViewport = (0,react.useCallback)(() => {
    if (!activeImageDisplaySetData) {
      return null;
    }
    const {
      measurements
    } = srDisplaySet;
    const measurement = measurements[measurementSelected];
    if (!measurement) {
      return null;
    }
    return /*#__PURE__*/react.createElement(cornerstone_src.OHIFCornerstoneViewport, _extends({}, props, {
      // should be passed second since we don't want SR displaySet to
      // override the activeImageDisplaySetData
      displaySets: [activeImageDisplaySetData]
      // It is possible that there is a hanging protocol applying viewportOptions
      // for the SR, so inherit the viewport options
      // TODO: Ensure the viewport options are set correctly with respect to
      // stack etc, in the incoming viewport options.
      ,
      viewportOptions: {
        ...viewportOptions,
        toolGroupId: `${SR_TOOLGROUP_BASE_NAME}`,
        // viewportType should not be required, as the stack type should be
        // required already in order to view SR, but sometimes segmentation
        // views set the viewport type without fixing the allowed display
        viewportType: 'stack',
        // The positionIds for the viewport aren't meaningful for the child display sets
        positionIds: null
      },
      onElementEnabled: evt => {
        props.onElementEnabled?.(evt);
        onElementEnabled(evt);
      },
      isJumpToMeasurementDisabled: true
    }));
  }, [activeImageDisplaySetData, viewportId, measurementSelected]);

  /**
   Cleanup the SR viewport when the viewport is destroyed
   */
  (0,react.useEffect)(() => {
    const onDisplaySetsRemovedSubscription = displaySetService.subscribe(displaySetService.EVENTS.DISPLAY_SETS_REMOVED, ({
      displaySetInstanceUIDs
    }) => {
      const activeViewport = viewports.get(activeViewportId);
      if (displaySetInstanceUIDs.includes(activeViewport.displaySetInstanceUID)) {
        viewportGridService.setDisplaySetsForViewport({
          viewportId: activeViewportId,
          displaySetInstanceUIDs: []
        });
      }
    });
    return () => {
      onDisplaySetsRemovedSubscription.unsubscribe();
    };
  }, []);

  /**
   * Loading the measurements from the SR viewport, which goes through the
   * isHydratable check, the outcome for the isHydrated state here is always FALSE
   * since we don't do the hydration here. Todo: can't we just set it as false? why
   * we are changing the state here? isHydrated is always false at this stage, and
   * if it is hydrated we don't even use the SR viewport.
   */
  (0,react.useEffect)(() => {
    const loadSR = async () => {
      if (!srDisplaySet.isLoaded) {
        await srDisplaySet.load();
      }
      updateViewport(measurementSelected);
    };
    loadSR();
  }, [srDisplaySet]);

  /**
   * Hook to update the tracking identifiers when the selected measurement changes or
   * the element changes
   */
  (0,react.useEffect)(() => {
    const updateSR = async () => {
      if (!srDisplaySet.isLoaded) {
        await srDisplaySet.load();
      }
      if (!element || !srDisplaySet.isLoaded) {
        return;
      }
      setTrackingIdentifiers(measurementSelected);
    };
    updateSR();
  }, [measurementSelected, element, setTrackingIdentifiers, srDisplaySet]);

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  let childrenWithProps = null;
  if (!activeImageDisplaySetData || !referencedDisplaySetMetadata) {
    return null;
  }
  if (children && children.length) {
    childrenWithProps = children.map((child, index) => {
      return child && /*#__PURE__*/react.cloneElement(child, {
        viewportId,
        key: index
      });
    });
  }
  return /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
    className: "relative flex h-full w-full flex-row overflow-hidden"
  }, getCornerstoneViewport(), childrenWithProps));
}
OHIFCornerstoneSRMeasurementViewport.propTypes = {
  displaySets: prop_types_default().arrayOf((prop_types_default()).object),
  viewportId: (prop_types_default()).string.isRequired,
  dataSource: (prop_types_default()).object,
  children: (prop_types_default()).node,
  viewportLabel: (prop_types_default()).string,
  viewportOptions: (prop_types_default()).object
};
async function _getViewportReferencedDisplaySetData(displaySet, measurementSelected, displaySetService) {
  const {
    measurements
  } = displaySet;
  const measurement = measurements[measurementSelected];
  const {
    displaySetInstanceUID
  } = measurement;
  if (!displaySet.keyImageDisplaySet) {
    // Create a new display set, and preserve a reference to it here,
    // so that it can be re-displayed and shown inside the SR viewport.
    // This is only for ease of redisplay - the display set is stored in the
    // usual manner in the display set service.
    displaySet.keyImageDisplaySet = (0,createReferencedImageDisplaySet/* default */.A)(displaySetService, displaySet);
  }
  if (!displaySetInstanceUID) {
    return {
      referencedDisplaySetMetadata: null,
      referencedDisplaySet: null
    };
  }
  const referencedDisplaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
  if (!referencedDisplaySet?.images) {
    return {
      referencedDisplaySetMetadata: null,
      referencedDisplaySet: null
    };
  }
  const image0 = referencedDisplaySet.images[0];
  const referencedDisplaySetMetadata = {
    PatientID: image0.PatientID,
    PatientName: image0.PatientName,
    PatientSex: image0.PatientSex,
    PatientAge: image0.PatientAge,
    SliceThickness: image0.SliceThickness,
    StudyDate: image0.StudyDate,
    SeriesDescription: image0.SeriesDescription,
    SeriesInstanceUID: image0.SeriesInstanceUID,
    SeriesNumber: image0.SeriesNumber,
    ManufacturerModelName: image0.ManufacturerModelName,
    SpacingBetweenSlices: image0.SpacingBetweenSlices
  };
  return {
    referencedDisplaySetMetadata,
    referencedDisplaySet
  };
}
/* harmony default export */ const components_OHIFCornerstoneSRMeasurementViewport = (OHIFCornerstoneSRMeasurementViewport);
// EXTERNAL MODULE: ../../../extensions/cornerstone-dicom-sr/src/enums.ts
var enums = __webpack_require__(74137);
;// ../../../extensions/cornerstone-dicom-sr/src/utils/formatContentItem.ts


/**
 * Formatters used to format each of the content items (SR "nodes") which can be
 * text, code, UID ref, number, person name, date, time and date time. Each
 * formatter must be a function with the following signature:
 *
 *    [VALUE_TYPE]: (contentItem) => string
 *
 */
const contentItemFormatters = {
  TEXT: contentItem => contentItem.TextValue,
  CODE: contentItem => contentItem.ConceptCodeSequence?.[0]?.CodeMeaning,
  UIDREF: contentItem => contentItem.UID,
  NUM: contentItem => {
    const measuredValue = contentItem.MeasuredValueSequence?.[0];
    if (!measuredValue) {
      return;
    }
    const {
      NumericValue,
      MeasurementUnitsCodeSequence
    } = measuredValue;
    const {
      CodeValue
    } = MeasurementUnitsCodeSequence;
    return `${NumericValue} ${CodeValue}`;
  },
  PNAME: contentItem => {
    const personName = contentItem.PersonName?.[0];
    return personName ? src.utils.formatPN(personName) : undefined;
  },
  DATE: contentItem => {
    const {
      Date
    } = contentItem;
    return Date ? src.utils.formatDate(Date) : undefined;
  },
  TIME: contentItem => {
    const {
      Time
    } = contentItem;
    return Time ? src.utils.formatTime(Time) : undefined;
  },
  DATETIME: contentItem => {
    const {
      DateTime
    } = contentItem;
    if (typeof DateTime !== 'string') {
      return;
    }

    // 14 characters because it should be something like 20180614113714
    if (DateTime.length < 14) {
      return DateTime;
    }
    const dicomDate = DateTime.substring(0, 8);
    const dicomTime = DateTime.substring(8, 14);
    const formattedDate = src.utils.formatDate(dicomDate);
    const formattedTime = src.utils.formatTime(dicomTime);
    return `${formattedDate} ${formattedTime}`;
  }
};
function formatContentItemValue(contentItem) {
  const {
    ValueType
  } = contentItem;
  const fnFormat = contentItemFormatters[ValueType];
  return fnFormat ? fnFormat(contentItem) : `[${ValueType} is not supported]`;
}

;// ../../../extensions/cornerstone-dicom-sr/src/components/OHIFCornerstoneSRContentItem.tsx




const EMPTY_TAG_VALUE = '[empty]';
function OHIFCornerstoneSRContentItem(props) {
  const {
    contentItem,
    nodeIndexesTree,
    continuityOfContent
  } = props;
  const {
    ConceptNameCodeSequence
  } = contentItem;
  const {
    CodeValue,
    CodeMeaning
  } = ConceptNameCodeSequence;
  const isChildFirstNode = nodeIndexesTree[nodeIndexesTree.length - 1] === 0;
  const formattedValue = formatContentItemValue(contentItem) ?? EMPTY_TAG_VALUE;
  const startWithAlphaNumCharRegEx = /^[a-zA-Z0-9]/;
  const isContinuous = continuityOfContent === 'CONTINUOUS';
  const isFinding = CodeValue === enums/* CodeNameCodeSequenceValues */.n7.Finding;
  const addExtraSpace = isContinuous && !isChildFirstNode && startWithAlphaNumCharRegEx.test(formattedValue?.[0]);

  // Collapse sequences of white space preserving newline characters
  let className = 'whitespace-pre-line';
  if (CodeValue === enums/* CodeNameCodeSequenceValues */.n7.Finding) {
    // Preserve spaces because it is common to see tabular text in a
    // "Findings" ConceptNameCodeSequence
    className = 'whitespace-pre-wrap';
  }
  if (isContinuous) {
    return /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("span", {
      className: className,
      title: CodeMeaning
    }, addExtraSpace ? ' ' : '', formattedValue));
  }
  return /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/react.createElement("span", {
    className: "font-bold"
  }, CodeMeaning, ": "), isFinding ? /*#__PURE__*/react.createElement("pre", null, formattedValue) : /*#__PURE__*/react.createElement("span", {
    className: className
  }, formattedValue)));
}
OHIFCornerstoneSRContentItem.propTypes = {
  contentItem: (prop_types_default()).object,
  nodeIndexesTree: prop_types_default().arrayOf((prop_types_default()).number),
  continuityOfContent: (prop_types_default()).string
};

;// ../../../extensions/cornerstone-dicom-sr/src/components/OHIFCornerstoneSRContainer.tsx
function OHIFCornerstoneSRContainer_extends() { return OHIFCornerstoneSRContainer_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, OHIFCornerstoneSRContainer_extends.apply(null, arguments); }



function OHIFCornerstoneSRContainer(props) {
  const {
    container,
    nodeIndexesTree = [0],
    containerNumberedTree = [1]
  } = props;
  const {
    ContinuityOfContent,
    ConceptNameCodeSequence
  } = container;
  const {
    CodeMeaning
  } = ConceptNameCodeSequence ?? {};
  let childContainerIndex = 1;
  const contentItems = container.ContentSequence?.map((contentItem, i) => {
    const {
      ValueType
    } = contentItem;
    const childNodeLevel = [...nodeIndexesTree, i];
    const key = childNodeLevel.join('.');
    let Component;
    let componentProps;
    if (ValueType === 'CONTAINER') {
      const childContainerNumberedTree = [...containerNumberedTree, childContainerIndex++];
      Component = OHIFCornerstoneSRContainer;
      componentProps = {
        container: contentItem,
        nodeIndexesTree: childNodeLevel,
        containerNumberedTree: childContainerNumberedTree
      };
    } else {
      Component = OHIFCornerstoneSRContentItem;
      componentProps = {
        contentItem,
        nodeIndexesTree: childNodeLevel,
        continuityOfContent: ContinuityOfContent
      };
    }
    return /*#__PURE__*/react.createElement(Component, OHIFCornerstoneSRContainer_extends({
      key: key
    }, componentProps));
  });
  return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement("div", {
    className: "font-bold"
  }, containerNumberedTree.join('.'), ".\xA0", CodeMeaning), /*#__PURE__*/react.createElement("div", {
    className: "ml-4 mb-2"
  }, contentItems));
}
OHIFCornerstoneSRContainer.propTypes = {
  /**
   * A tree node that may contain another container or one or more content items
   * (text, code, uidref, pname, etc.)
   */
  container: (prop_types_default()).object,
  /**
   * A 0-based index list
   */
  nodeIndexesTree: prop_types_default().arrayOf((prop_types_default()).number),
  /**
   * A 1-based index list that represents a container in a multi-level numbered
   * list (tree).
   *
   * Example:
   *  1. History
   *    1.1. Chief Complaint
   *    1.2. Present Illness
   *    1.3. Past History
   *    1.4. Family History
   *  2. Findings
   * */
  containerNumberedTree: prop_types_default().arrayOf((prop_types_default()).number)
};
;// ../../../extensions/cornerstone-dicom-sr/src/components/OHIFCornerstoneSRTextViewport.tsx




function OHIFCornerstoneSRTextViewport(props) {
  const {
    displaySets
  } = props;
  const displaySet = displaySets[0];
  const instance = displaySet.instances[0];
  return /*#__PURE__*/react.createElement("div", {
    className: "relative flex h-full w-full flex-col overflow-auto p-4 text-white"
  }, /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(OHIFCornerstoneSRContainer, {
    container: instance
  })));
}
OHIFCornerstoneSRTextViewport.propTypes = {
  displaySets: prop_types_default().arrayOf((prop_types_default()).object),
  viewportId: (prop_types_default()).string.isRequired,
  dataSource: (prop_types_default()).object,
  children: (prop_types_default()).node,
  viewportLabel: (prop_types_default()).string,
  viewportOptions: (prop_types_default()).object,
  servicesManager: (prop_types_default()).object.isRequired,
  extensionManager: prop_types_default().instanceOf(src.ExtensionManager).isRequired
};
/* harmony default export */ const components_OHIFCornerstoneSRTextViewport = (OHIFCornerstoneSRTextViewport);
;// ../../../extensions/cornerstone-dicom-sr/src/components/OHIFCornerstoneSRViewport.tsx





function OHIFCornerstoneSRViewport(props) {
  const {
    displaySets
  } = props;
  const {
    isImagingMeasurementReport
  } = displaySets[0];
  if (isImagingMeasurementReport) {
    return /*#__PURE__*/react.createElement(components_OHIFCornerstoneSRMeasurementViewport, props);
  }
  return /*#__PURE__*/react.createElement(components_OHIFCornerstoneSRTextViewport, props);
}
OHIFCornerstoneSRViewport.propTypes = {
  displaySets: prop_types_default().arrayOf((prop_types_default()).object),
  viewportId: (prop_types_default()).string.isRequired,
  dataSource: (prop_types_default()).object,
  children: (prop_types_default()).node,
  viewportLabel: (prop_types_default()).string,
  viewportOptions: (prop_types_default()).object,
  servicesManager: (prop_types_default()).object.isRequired,
  extensionManager: prop_types_default().instanceOf(src.ExtensionManager).isRequired
};
/* harmony default export */ const components_OHIFCornerstoneSRViewport = (OHIFCornerstoneSRViewport);

/***/ })

}]);