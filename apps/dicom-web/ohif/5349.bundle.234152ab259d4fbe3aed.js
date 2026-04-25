"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[5349,8402],{

/***/ 88414:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ viewports_OHIFCornerstoneRTViewport)
});

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../../node_modules/prop-types/index.js
var prop_types = __webpack_require__(97598);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
// EXTERNAL MODULE: ../../ui-next/src/index.ts + 3073 modules
var src = __webpack_require__(17130);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/index.tsx + 185 modules
var cornerstone_src = __webpack_require__(39162);
;// ../../../extensions/cornerstone-dicom-rt/src/utils/promptHydrateRT.ts

function promptHydrateRT({
  servicesManager,
  rtDisplaySet,
  viewportId,
  preHydrateCallbacks,
  hydrateRTDisplaySet
}) {
  return cornerstone_src.utils.promptHydrationDialog({
    servicesManager,
    viewportId,
    displaySet: rtDisplaySet,
    preHydrateCallbacks,
    hydrateCallback: hydrateRTDisplaySet,
    type: 'RTSTRUCT'
  });
}
/* harmony default export */ const utils_promptHydrateRT = (promptHydrateRT);
;// ../../../extensions/cornerstone-dicom-rt/src/utils/initRTToolGroup.ts
function createRTToolGroupAndAddTools(ToolGroupService, customizationService, toolGroupId) {
  const tools = customizationService.getCustomization('cornerstone.overlayViewportTools');
  return ToolGroupService.createToolGroupAndAddTools(toolGroupId, tools);
}
/* harmony default export */ const initRTToolGroup = (createRTToolGroupAndAddTools);
// EXTERNAL MODULE: ../../core/src/index.ts + 68 modules
var core_src = __webpack_require__(15871);
;// ../../../extensions/cornerstone-dicom-rt/src/viewports/OHIFCornerstoneRTViewport.tsx
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }







const RT_TOOLGROUP_BASE_NAME = 'RTToolGroup';
function OHIFCornerstoneRTViewport(props) {
  const {
    servicesManager,
    commandsManager
  } = (0,core_src.useSystem)();
  const {
    children,
    displaySets,
    viewportOptions
  } = props;
  const {
    displaySetService,
    toolGroupService,
    segmentationService,
    customizationService
  } = servicesManager.services;
  const viewportId = viewportOptions.viewportId;
  const toolGroupId = `${RT_TOOLGROUP_BASE_NAME}-${viewportId}`;

  // RT viewport will always have a single display set
  if (displaySets.length > 1) {
    throw new Error('RT viewport should only have a single display set');
  }
  const LoadingIndicatorTotalPercent = customizationService.getCustomization('ui.loadingIndicatorTotalPercent');
  const rtDisplaySet = displaySets[0];
  const [{
    viewports,
    activeViewportId
  }, viewportGridService] = (0,src/* useViewportGrid */.ihW)();

  // States
  const {
    setPositionPresentation
  } = (0,cornerstone_src.usePositionPresentationStore)();
  const [rtIsLoading, setRtIsLoading] = (0,react.useState)(!rtDisplaySet.isLoaded);
  const [processingProgress, setProcessingProgress] = (0,react.useState)({
    percentComplete: null,
    totalSegments: null
  });
  const referencedDisplaySetRef = (0,react.useRef)(null);
  const referencedDisplaySetInstanceUID = rtDisplaySet.referencedDisplaySetInstanceUID;
  // If the referencedDisplaySetInstanceUID is not found, it means the RTStruct series is being
  // launched without its corresponding referenced display set (e.g., the RTStruct series is launched using
  // series launch /mode?StudyInstanceUIDs=&SeriesInstanceUID).
  // In such cases, we attempt to handle this scenario gracefully by
  // invoking a custom handler. Ideally, if a user tries to launch a series that isn't viewable,
  // (eg.: we can prompt them with an explanation and provide a link to the full study).
  if (!referencedDisplaySetInstanceUID) {
    const missingReferenceDisplaySetHandler = customizationService.getCustomization('missingReferenceDisplaySetHandler');
    const {
      handled
    } = missingReferenceDisplaySetHandler();
    if (handled) {
      return;
    }
  }
  const referencedDisplaySet = displaySetService.getDisplaySetByUID(referencedDisplaySetInstanceUID);
  const referencedDisplaySetMetadata = _getReferencedDisplaySetMetadata(referencedDisplaySet);
  referencedDisplaySetRef.current = {
    displaySet: referencedDisplaySet,
    metadata: referencedDisplaySetMetadata
  };
  (0,react.useEffect)(() => {
    if (rtIsLoading) {
      return;
    }

    // if not active viewport, return
    if (viewportId !== activeViewportId) {
      return;
    }
    utils_promptHydrateRT({
      servicesManager,
      viewportId,
      rtDisplaySet,
      hydrateRTDisplaySet: async () => {
        return commandsManager.runCommand('hydrateSecondaryDisplaySet', {
          displaySet: rtDisplaySet,
          viewportId
        });
      }
    });
  }, [servicesManager, viewportId, rtDisplaySet, rtIsLoading, commandsManager, activeViewportId]);
  (0,react.useEffect)(() => {
    const {
      unsubscribe
    } = segmentationService.subscribe(segmentationService.EVENTS.SEGMENTATION_LOADING_COMPLETE, evt => {
      if (evt.rtDisplaySet.displaySetInstanceUID === rtDisplaySet.displaySetInstanceUID) {
        setRtIsLoading(false);
      }
      if (rtDisplaySet?.firstSegmentedSliceImageId && viewportOptions?.presentationIds) {
        const {
          firstSegmentedSliceImageId
        } = rtDisplaySet;
        const {
          presentationIds
        } = viewportOptions;
        setPositionPresentation(presentationIds.positionPresentationId, {
          viewportType: 'stack',
          viewReference: {
            referencedImageId: firstSegmentedSliceImageId
          },
          viewPresentation: {}
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, [rtDisplaySet]);
  (0,react.useEffect)(() => {
    const segmentLoadingSubscription = segmentationService.subscribe(segmentationService.EVENTS.SEGMENT_LOADING_COMPLETE, ({
      percentComplete,
      numSegments
    }) => {
      setProcessingProgress({
        percentComplete,
        totalSegments: numSegments
      });
    });
    const displaySetsRemovedSubscription = displaySetService.subscribe(displaySetService.EVENTS.DISPLAY_SETS_REMOVED, ({
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
      segmentLoadingSubscription.unsubscribe();
      displaySetsRemovedSubscription.unsubscribe();
    };
  }, [rtDisplaySet, displaySetService, viewports, activeViewportId, viewportGridService]);
  (0,react.useEffect)(() => {
    let toolGroup = toolGroupService.getToolGroup(toolGroupId);
    if (toolGroup) {
      return;
    }
    toolGroup = initRTToolGroup(toolGroupService, customizationService, toolGroupId);
    return () => {
      // remove the segmentation representations if seg displayset changed
      segmentationService.removeSegmentationRepresentations(viewportId);
      referencedDisplaySetRef.current = null;
      toolGroupService.destroyToolGroup(toolGroupId);
    };
  }, []);
  const getCornerstoneViewport = (0,react.useCallback)(() => {
    const {
      displaySet: referencedDisplaySet
    } = referencedDisplaySetRef.current;

    // Todo: jump to the center of the first segment
    return /*#__PURE__*/react.createElement(cornerstone_src.OHIFCornerstoneViewport, _extends({}, props, {
      displaySets: [referencedDisplaySet, rtDisplaySet],
      viewportOptions: {
        viewportType: viewportOptions.viewportType,
        toolGroupId: toolGroupId,
        orientation: viewportOptions.orientation,
        viewportId: viewportOptions.viewportId,
        presentationIds: viewportOptions.presentationIds
      },
      onElementEnabled: evt => {
        props.onElementEnabled?.(evt);
      }
    }));
  }, [viewportId, rtDisplaySet, toolGroupId]);
  let childrenWithProps = null;
  if (!referencedDisplaySetRef.current || referencedDisplaySet.displaySetInstanceUID !== referencedDisplaySetRef.current.displaySet.displaySetInstanceUID) {
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
  }, rtIsLoading && /*#__PURE__*/react.createElement(LoadingIndicatorTotalPercent, {
    className: "h-full w-full",
    totalNumbers: processingProgress.totalSegments,
    percentComplete: processingProgress.percentComplete,
    loadingText: "Loading RTSTRUCT..."
  }), getCornerstoneViewport(), childrenWithProps));
}
OHIFCornerstoneRTViewport.propTypes = {
  displaySets: prop_types_default().arrayOf((prop_types_default()).object),
  viewportId: (prop_types_default()).string.isRequired,
  dataSource: (prop_types_default()).object,
  children: (prop_types_default()).node
};
function _getReferencedDisplaySetMetadata(referencedDisplaySet) {
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
  return referencedDisplaySetMetadata;
}
/* harmony default export */ const viewports_OHIFCornerstoneRTViewport = (OHIFCornerstoneRTViewport);

/***/ })

}]);