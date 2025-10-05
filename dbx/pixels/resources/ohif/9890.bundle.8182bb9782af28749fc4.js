"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[9890,8402],{

/***/ 23121:
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
// EXTERNAL MODULE: ../../ui-next/src/index.ts + 1053 modules
var src = __webpack_require__(2836);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/index.tsx + 135 modules
var cornerstone_src = __webpack_require__(78572);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-rt/src/utils/promptHydrateRT.ts
const RESPONSE = {
  NO_NEVER: -1,
  CANCEL: 0,
  HYDRATE_SEG: 5
};
function promptHydrateRT({
  servicesManager,
  rtDisplaySet,
  viewportId,
  preHydrateCallbacks,
  hydrateRTDisplaySet
}) {
  const {
    uiViewportDialogService,
    customizationService
  } = servicesManager.services;
  const extensionManager = servicesManager._extensionManager;
  const appConfig = extensionManager._appConfig;
  return new Promise(async function (resolve, reject) {
    const promptResult = appConfig?.disableConfirmationPrompts ? RESPONSE.HYDRATE_SEG : await _askHydrate(uiViewportDialogService, customizationService, viewportId);
    if (promptResult === RESPONSE.HYDRATE_SEG) {
      preHydrateCallbacks?.forEach(callback => {
        callback();
      });
      const isHydrated = await hydrateRTDisplaySet({
        rtDisplaySet,
        viewportId,
        servicesManager
      });
      resolve(isHydrated);
    }
  });
}
function _askHydrate(uiViewportDialogService, customizationService, viewportId) {
  return new Promise(function (resolve, reject) {
    const message = customizationService.getCustomization('viewportNotification.hydrateRTMessage');
    const actions = [{
      id: 'no-hydrate',
      type: 'secondary',
      text: 'No',
      value: RESPONSE.CANCEL
    }, {
      id: 'yes-hydrate',
      type: 'primary',
      text: 'Yes',
      value: RESPONSE.HYDRATE_SEG
    }];
    const onSubmit = result => {
      uiViewportDialogService.hide();
      resolve(result);
    };
    uiViewportDialogService.show({
      id: 'promptHydrateRT',
      viewportId,
      type: 'info',
      message,
      actions,
      onSubmit,
      onOutsideClick: () => {
        uiViewportDialogService.hide();
        resolve(RESPONSE.CANCEL);
      },
      onKeyPress: event => {
        if (event.key === 'Enter') {
          onSubmit(RESPONSE.HYDRATE_SEG);
        }
      }
    });
  });
}
/* harmony default export */ const utils_promptHydrateRT = (promptHydrateRT);
// EXTERNAL MODULE: ../../../node_modules/react-i18next/dist/es/index.js + 15 modules
var es = __webpack_require__(99993);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-rt/src/viewports/_getStatusComponent.tsx




function _getStatusComponent({
  isHydrated,
  onStatusClick
}) {
  let ToolTipMessage = null;
  let StatusIcon = null;
  switch (isHydrated) {
    case true:
      StatusIcon = () => /*#__PURE__*/react.createElement(src/* Icons */.FI1.ByName, {
        name: "status-alert"
      });
      ToolTipMessage = () => /*#__PURE__*/react.createElement("div", null, "This Segmentation is loaded in the segmentation panel");
      break;
    case false:
      StatusIcon = () => /*#__PURE__*/react.createElement(src/* Icons */.FI1.ByName, {
        className: "text-muted-foreground h-4 w-4",
        name: "status-untracked"
      });
      ToolTipMessage = () => /*#__PURE__*/react.createElement("div", null, "Click LOAD to load RTSTRUCT.");
  }
  const StatusArea = () => {
    const {
      t
    } = (0,es/* useTranslation */.Bd)('Common');
    const loadStr = t('LOAD');
    return /*#__PURE__*/react.createElement("div", {
      className: "flex h-6 cursor-default text-sm leading-6 text-white"
    }, /*#__PURE__*/react.createElement("div", {
      className: "bg-customgray-100 flex min-w-[45px] items-center rounded-l-xl rounded-r p-1"
    }, /*#__PURE__*/react.createElement(StatusIcon, null), /*#__PURE__*/react.createElement("span", {
      className: "ml-1"
    }, "RTSTRUCT")), !isHydrated && /*#__PURE__*/react.createElement(src/* ViewportActionButton */.N8H, {
      onInteraction: onStatusClick
    }, loadStr));
  };
  return /*#__PURE__*/react.createElement(react.Fragment, null, ToolTipMessage && /*#__PURE__*/react.createElement(src/* Tooltip */.m_M, null, /*#__PURE__*/react.createElement(src/* TooltipTrigger */.k$k, {
    asChild: true
  }, /*#__PURE__*/react.createElement("span", null, /*#__PURE__*/react.createElement(StatusArea, null))), /*#__PURE__*/react.createElement(src/* TooltipContent */.ZIw, {
    side: "bottom"
  }, /*#__PURE__*/react.createElement(ToolTipMessage, null))), !ToolTipMessage && /*#__PURE__*/react.createElement(StatusArea, null));
}
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-rt/src/utils/initRTToolGroup.ts
function createRTToolGroupAndAddTools(ToolGroupService, customizationService, toolGroupId) {
  const tools = customizationService.getCustomization('cornerstone.overlayViewportTools');
  return ToolGroupService.createToolGroupAndAddTools(toolGroupId, tools);
}
/* harmony default export */ const initRTToolGroup = (createRTToolGroupAndAddTools);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-rt/src/viewports/OHIFCornerstoneRTViewport.tsx
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }









const RT_TOOLGROUP_BASE_NAME = 'RTToolGroup';
function OHIFCornerstoneRTViewport(props) {
  const {
    children,
    displaySets,
    viewportOptions,
    servicesManager,
    extensionManager,
    commandsManager
  } = props;
  const {
    displaySetService,
    toolGroupService,
    segmentationService,
    uiNotificationService,
    customizationService,
    viewportActionCornersService
  } = servicesManager.services;
  const viewportId = viewportOptions.viewportId;
  const toolGroupId = `${RT_TOOLGROUP_BASE_NAME}-${viewportId}`;

  // RT viewport will always have a single display set
  if (displaySets.length > 1) {
    throw new Error('RT viewport should only have a single display set');
  }
  const LoadingIndicatorTotalPercent = customizationService.getCustomization('ui.loadingIndicatorTotalPercent');
  const rtDisplaySet = displaySets[0];
  const [viewportGrid, viewportGridService] = (0,src/* useViewportGrid */.ihW)();

  // States
  const selectedSegmentObjectIndex = 0;
  const {
    setPositionPresentation
  } = (0,cornerstone_src.usePositionPresentationStore)();

  // Hydration means that the RT is opened and segments are loaded into the
  // segmentation panel, and RT is also rendered on any viewport that is in the
  // same frameOfReferenceUID as the referencedSeriesUID of the RT. However,
  // loading basically means RT loading over network and bit unpacking of the
  // RT data.
  const [isHydrated, setIsHydrated] = (0,react.useState)(rtDisplaySet.isHydrated);
  const [rtIsLoading, setRtIsLoading] = (0,react.useState)(!rtDisplaySet.isLoaded);
  const [element, setElement] = (0,react.useState)(null);
  const [processingProgress, setProcessingProgress] = (0,react.useState)({
    percentComplete: null,
    totalSegments: null
  });

  // refs
  const referencedDisplaySetRef = (0,react.useRef)(null);
  const {
    viewports,
    activeViewportId
  } = viewportGrid;
  const referencedDisplaySetInstanceUID = rtDisplaySet.referencedDisplaySetInstanceUID;
  const referencedDisplaySet = displaySetService.getDisplaySetByUID(referencedDisplaySetInstanceUID);
  const referencedDisplaySetMetadata = _getReferencedDisplaySetMetadata(referencedDisplaySet);
  referencedDisplaySetRef.current = {
    displaySet: referencedDisplaySet,
    metadata: referencedDisplaySetMetadata
  };
  /**
   * OnElementEnabled callback which is called after the cornerstoneExtension
   * has enabled the element. Note: we delegate all the image rendering to
   * cornerstoneExtension, so we don't need to do anything here regarding
   * the image rendering, element enabling etc.
   */
  const onElementEnabled = evt => {
    setElement(evt.detail.element);
  };
  const onElementDisabled = () => {
    setElement(null);
  };
  const storePresentationState = (0,react.useCallback)(() => {
    viewportGrid?.viewports.forEach(({
      viewportId
    }) => {
      commandsManager.runCommand('storePresentation', {
        viewportId
      });
    });
  }, [viewportGrid]);
  const hydrateRTDisplaySet = (0,react.useCallback)(({
    rtDisplaySet,
    viewportId
  }) => {
    commandsManager.runCommand('hydrateRTSDisplaySet', {
      displaySet: rtDisplaySet,
      viewportId
    });
  }, [commandsManager]);
  const getCornerstoneViewport = (0,react.useCallback)(() => {
    const {
      component: Component
    } = extensionManager.getModuleEntry('@ohif/extension-cornerstone.viewportModule.cornerstone');
    const {
      displaySet: referencedDisplaySet
    } = referencedDisplaySetRef.current;

    // Todo: jump to the center of the first segment
    return /*#__PURE__*/react.createElement(Component, _extends({}, props, {
      displaySets: [referencedDisplaySet, rtDisplaySet],
      viewportOptions: {
        viewportType: 'stack',
        toolGroupId: toolGroupId,
        orientation: viewportOptions.orientation,
        viewportId: viewportOptions.viewportId,
        presentationIds: viewportOptions.presentationIds
      },
      onElementEnabled: evt => {
        props.onElementEnabled?.(evt);
        onElementEnabled(evt);
      },
      onElementDisabled: onElementDisabled
    }));
  }, [viewportId, rtDisplaySet, toolGroupId]);
  const onSegmentChange = (0,react.useCallback)(direction => {
    cornerstone_src.utils.handleSegmentChange({
      direction,
      segDisplaySet: rtDisplaySet,
      viewportId,
      selectedSegmentObjectIndex,
      segmentationService
    });
  }, [selectedSegmentObjectIndex]);
  (0,react.useEffect)(() => {
    if (rtIsLoading) {
      return;
    }
    utils_promptHydrateRT({
      servicesManager,
      viewportId,
      rtDisplaySet,
      preHydrateCallbacks: [storePresentationState],
      hydrateRTDisplaySet
    }).then(isHydrated => {
      if (isHydrated) {
        setIsHydrated(true);
      }
    });
  }, [servicesManager, viewportId, rtDisplaySet, rtIsLoading]);
  (0,react.useEffect)(() => {
    // I'm not sure what is this, since in RT we support Overlapping segments
    // via contours
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
      if (evt.overlappingSegments) {
        uiNotificationService.show({
          title: 'Overlapping Segments',
          message: 'Overlapping segments detected which is not currently supported',
          type: 'warning'
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, [rtDisplaySet]);
  (0,react.useEffect)(() => {
    const {
      unsubscribe
    } = segmentationService.subscribe(segmentationService.EVENTS.SEGMENT_LOADING_COMPLETE, ({
      percentComplete,
      numSegments
    }) => {
      setProcessingProgress({
        percentComplete,
        totalSegments: numSegments
      });
    });
    return () => {
      unsubscribe();
    };
  }, [rtDisplaySet]);

  /**
   Cleanup the SEG viewport when the viewport is destroyed
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
  (0,react.useEffect)(() => {
    let toolGroup = toolGroupService.getToolGroup(toolGroupId);
    if (toolGroup) {
      return;
    }
    toolGroup = initRTToolGroup(toolGroupService, customizationService, toolGroupId);
    return () => {
      // remove the segmentation representations if seg displayset changed
      segmentationService.removeSegmentationRepresentations(viewportId);
      toolGroupService.destroyToolGroup(toolGroupId);
    };
  }, []);
  (0,react.useEffect)(() => {
    setIsHydrated(rtDisplaySet.isHydrated);
    return () => {
      // remove the segmentation representations if seg displayset changed
      segmentationService.removeSegmentationRepresentations(viewportId);
      referencedDisplaySetRef.current = null;
    };
  }, [rtDisplaySet]);
  const onStatusClick = (0,react.useCallback)(async () => {
    // Before hydrating a RT and make it added to all viewports in the grid
    // that share the same frameOfReferenceUID, we need to store the viewport grid
    // presentation state, so that we can restore it after hydrating the RT. This is
    // required if the user has changed the viewport (other viewport than RT viewport)
    // presentation state (w/l and invert) and then opens the RT. If we don't store
    // the presentation state, the viewport will be reset to the default presentation
    storePresentationState();
    const isHydrated = await hydrateRTDisplaySet({
      rtDisplaySet,
      viewportId
    });
    setIsHydrated(isHydrated);
  }, [hydrateRTDisplaySet, rtDisplaySet, storePresentationState, viewportId]);

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
  (0,react.useEffect)(() => {
    viewportActionCornersService.addComponents([{
      viewportId,
      id: 'viewportStatusComponent',
      component: _getStatusComponent({
        isHydrated,
        onStatusClick
      }),
      indexPriority: -100,
      location: viewportActionCornersService.LOCATIONS.topLeft
    }, {
      viewportId,
      id: 'viewportActionArrowsComponent',
      component: /*#__PURE__*/react.createElement(src/* ViewportActionArrows */.$IX, {
        key: "actionArrows",
        onArrowsClick: onSegmentChange,
        className: viewportId === activeViewportId ? 'visible' : 'invisible group-hover/pane:visible'
      }),
      indexPriority: 0,
      location: viewportActionCornersService.LOCATIONS.topRight
    }]);
  }, [activeViewportId, isHydrated, onSegmentChange, onStatusClick, viewportActionCornersService, viewportId]);
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