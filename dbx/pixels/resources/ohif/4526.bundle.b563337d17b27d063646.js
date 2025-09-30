"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[4526],{

/***/ 58295:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ viewports_OHIFCornerstoneSEGViewport)
});

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../../node_modules/react-i18next/dist/es/index.js + 15 modules
var es = __webpack_require__(99993);
// EXTERNAL MODULE: ../../ui-next/src/index.ts + 1053 modules
var src = __webpack_require__(2836);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-seg/src/utils/initSEGToolGroup.ts
function createSEGToolGroupAndAddTools(ToolGroupService, customizationService, toolGroupId) {
  const tools = customizationService.getCustomization('cornerstone.overlayViewportTools');
  return ToolGroupService.createToolGroupAndAddTools(toolGroupId, tools);
}
/* harmony default export */ const initSEGToolGroup = (createSEGToolGroupAndAddTools);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-seg/src/utils/promptHydrateSEG.ts
const RESPONSE = {
  NO_NEVER: -1,
  CANCEL: 0,
  HYDRATE_SEG: 5
};
function promptHydrateSEG({
  servicesManager,
  segDisplaySet,
  viewportId,
  preHydrateCallbacks,
  hydrateCallback
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
      window.setTimeout(async () => {
        const isHydrated = await hydrateCallback({
          segDisplaySet,
          viewportId
        });
        resolve(isHydrated);
      }, 0);
    }
  });
}
function _askHydrate(uiViewportDialogService, customizationService, viewportId) {
  return new Promise(function (resolve, reject) {
    const message = customizationService.getCustomization('viewportNotification.hydrateSEGMessage');
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
/* harmony default export */ const utils_promptHydrateSEG = (promptHydrateSEG);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-seg/src/viewports/_getStatusComponent.tsx




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
      ToolTipMessage = () => /*#__PURE__*/react.createElement("div", null, "Click LOAD to load segmentation.");
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
    }, "SEG")), !isHydrated && /*#__PURE__*/react.createElement(src/* ViewportActionButton */.N8H, {
      onInteraction: onStatusClick
    }, loadStr));
  };
  return /*#__PURE__*/react.createElement(react.Fragment, null, ToolTipMessage && /*#__PURE__*/react.createElement(src/* Tooltip */.m_M, null, /*#__PURE__*/react.createElement(src/* TooltipTrigger */.k$k, {
    asChild: true
  }, /*#__PURE__*/react.createElement("span", null, /*#__PURE__*/react.createElement(StatusArea, null))), /*#__PURE__*/react.createElement(src/* TooltipContent */.ZIw, {
    side: "bottom"
  }, /*#__PURE__*/react.createElement(ToolTipMessage, null))), !ToolTipMessage && /*#__PURE__*/react.createElement(StatusArea, null));
}
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/index.tsx + 136 modules
var cornerstone_src = __webpack_require__(72283);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js + 2 modules
var enums = __webpack_require__(99737);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-seg/src/viewports/OHIFCornerstoneSEGViewport.tsx
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }










const SEG_TOOLGROUP_BASE_NAME = 'SEGToolGroup';
function OHIFCornerstoneSEGViewport(props) {
  const {
    children,
    displaySets,
    viewportOptions,
    servicesManager,
    extensionManager,
    commandsManager
  } = props;
  const {
    t
  } = (0,es/* useTranslation */.Bd)('SEGViewport');
  const viewportId = viewportOptions.viewportId;
  const {
    displaySetService,
    toolGroupService,
    segmentationService,
    customizationService,
    viewportActionCornersService
  } = servicesManager.services;
  const LoadingIndicatorTotalPercent = customizationService.getCustomization('ui.loadingIndicatorTotalPercent');
  const toolGroupId = `${SEG_TOOLGROUP_BASE_NAME}-${viewportId}`;

  // SEG viewport will always have a single display set
  if (displaySets.length > 1) {
    throw new Error('SEG viewport should only have a single display set');
  }
  const segDisplaySet = displaySets[0];
  const [viewportGrid, viewportGridService] = (0,src/* useViewportGrid */.ihW)();

  // States
  const selectedSegmentObjectIndex = 0;
  const {
    setPositionPresentation
  } = (0,cornerstone_src.usePositionPresentationStore)();

  // Hydration means that the SEG is opened and segments are loaded into the
  // segmentation panel, and SEG is also rendered on any viewport that is in the
  // same frameOfReferenceUID as the referencedSeriesUID of the SEG. However,
  // loading basically means SEG loading over network and bit unpacking of the
  // SEG data.
  const [isHydrated, setIsHydrated] = (0,react.useState)(segDisplaySet.isHydrated);
  const [segIsLoading, setSegIsLoading] = (0,react.useState)(!segDisplaySet.isLoaded);
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
  const referencedDisplaySetInstanceUID = segDisplaySet.referencedDisplaySetInstanceUID;
  const referencedDisplaySet = displaySetService.getDisplaySetByUID(referencedDisplaySetInstanceUID);
  const referencedDisplaySetMetadata = _getReferencedDisplaySetMetadata(referencedDisplaySet, segDisplaySet);
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
  const getCornerstoneViewport = (0,react.useCallback)(() => {
    const {
      component: Component
    } = extensionManager.getModuleEntry('@ohif/extension-cornerstone.viewportModule.cornerstone');

    // Todo: jump to the center of the first segment
    return /*#__PURE__*/react.createElement(Component, _extends({}, props, {
      displaySets: [segDisplaySet],
      viewportOptions: {
        viewportType: viewportOptions.viewportType,
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
  }, [viewportId, segDisplaySet, toolGroupId]);
  const onSegmentChange = (0,react.useCallback)(direction => {
    cornerstone_src.utils.handleSegmentChange({
      direction,
      segDisplaySet: segDisplaySet,
      viewportId,
      selectedSegmentObjectIndex,
      segmentationService
    });
  }, [selectedSegmentObjectIndex]);
  const hydrateSEG = (0,react.useCallback)(() => {
    // update the previously stored segmentationPresentation with the new viewportId
    // presentation so that when we put the referencedDisplaySet back in the viewport
    // it will have the correct segmentation representation hydrated
    commandsManager.runCommand('updateStoredSegmentationPresentation', {
      displaySet: segDisplaySet,
      type: enums.SegmentationRepresentations.Labelmap
    });

    // update the previously stored positionPresentation with the new viewportId
    // presentation so that when we put the referencedDisplaySet back in the viewport
    // it will be in the correct position zoom and pan
    commandsManager.runCommand('updateStoredPositionPresentation', {
      viewportId,
      displaySetInstanceUID: referencedDisplaySet.displaySetInstanceUID
    });
    commandsManager.runCommand('loadSegmentationDisplaySetsForViewport', {
      viewportId,
      displaySetInstanceUIDs: [referencedDisplaySet.displaySetInstanceUID]
    });
  }, [commandsManager, viewportId, referencedDisplaySet, segDisplaySet]);
  (0,react.useEffect)(() => {
    if (segIsLoading) {
      return;
    }
    utils_promptHydrateSEG({
      servicesManager,
      viewportId,
      segDisplaySet,
      preHydrateCallbacks: [storePresentationState],
      hydrateCallback: hydrateSEG
    }).then(isHydrated => {
      if (isHydrated) {
        setIsHydrated(true);
      }
    });
  }, [servicesManager, viewportId, segDisplaySet, segIsLoading, hydrateSEG]);
  (0,react.useEffect)(() => {
    // on new seg display set, remove all segmentations from all viewports
    segmentationService.clearSegmentationRepresentations(viewportId);
    const {
      unsubscribe
    } = segmentationService.subscribe(segmentationService.EVENTS.SEGMENTATION_LOADING_COMPLETE, evt => {
      if (evt.segDisplaySet.displaySetInstanceUID === segDisplaySet.displaySetInstanceUID) {
        setSegIsLoading(false);
      }
      if (segDisplaySet?.firstSegmentedSliceImageId && viewportOptions?.presentationIds) {
        const {
          firstSegmentedSliceImageId
        } = segDisplaySet;
        const {
          presentationIds
        } = viewportOptions;
        setPositionPresentation(presentationIds.positionPresentationId, {
          viewReference: {
            referencedImageId: firstSegmentedSliceImageId
          }
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, [segDisplaySet]);
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
  }, [segDisplaySet]);

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

    // keep the already stored segmentationPresentation for this viewport in memory
    // so that we can restore it after hydrating the SEG
    commandsManager.runCommand('updateStoredSegmentationPresentation', {
      displaySet: segDisplaySet,
      type: enums.SegmentationRepresentations.Labelmap
    });

    // always start fresh for this viewport since it is special type of viewport
    // that should only show one segmentation at a time.
    segmentationService.clearSegmentationRepresentations(viewportId);

    // This creates a custom tool group which has the lifetime of this view
    // only, and does NOT interfere with currently displayed segmentations.
    toolGroup = initSEGToolGroup(toolGroupService, customizationService, toolGroupId);
    return () => {
      // remove the segmentation representations if seg displayset changed
      // e.g., another seg displayset is dragged into the viewport
      segmentationService.clearSegmentationRepresentations(viewportId);

      // Only destroy the viewport specific implementation
      toolGroupService.destroyToolGroup(toolGroupId);
    };
  }, []);
  const onStatusClick = (0,react.useCallback)(async () => {
    // Before hydrating a SEG and make it added to all viewports in the grid
    // that share the same frameOfReferenceUID, we need to store the viewport grid
    // presentation state, so that we can restore it after hydrating the SEG. This is
    // required if the user has changed the viewport (other viewport than SEG viewport)
    // presentation state (w/l and invert) and then opens the SEG. If we don't store
    // the presentation state, the viewport will be reset to the default presentation
    storePresentationState();
    hydrateSEG();
  }, [storePresentationState, hydrateSEG]);
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
  return /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
    className: "relative flex h-full w-full flex-row overflow-hidden"
  }, segIsLoading && /*#__PURE__*/react.createElement(LoadingIndicatorTotalPercent, {
    className: "h-full w-full",
    totalNumbers: processingProgress.totalSegments,
    percentComplete: processingProgress.percentComplete,
    loadingText: "Loading SEG..."
  }), getCornerstoneViewport(), childrenWithProps));
}
function _getReferencedDisplaySetMetadata(referencedDisplaySet, segDisplaySet) {
  const {
    SharedFunctionalGroupsSequence
  } = segDisplaySet.instance;
  const SharedFunctionalGroup = Array.isArray(SharedFunctionalGroupsSequence) ? SharedFunctionalGroupsSequence[0] : SharedFunctionalGroupsSequence;
  const {
    PixelMeasuresSequence
  } = SharedFunctionalGroup;
  const PixelMeasures = Array.isArray(PixelMeasuresSequence) ? PixelMeasuresSequence[0] : PixelMeasuresSequence;
  const {
    SpacingBetweenSlices,
    SliceThickness
  } = PixelMeasures;
  const image0 = referencedDisplaySet.images[0];
  const referencedDisplaySetMetadata = {
    PatientID: image0.PatientID,
    PatientName: image0.PatientName,
    PatientSex: image0.PatientSex,
    PatientAge: image0.PatientAge,
    SliceThickness: image0.SliceThickness || SliceThickness,
    StudyDate: image0.StudyDate,
    SeriesDescription: image0.SeriesDescription,
    SeriesInstanceUID: image0.SeriesInstanceUID,
    SeriesNumber: image0.SeriesNumber,
    ManufacturerModelName: image0.ManufacturerModelName,
    SpacingBetweenSlices: image0.SpacingBetweenSlices || SpacingBetweenSlices
  };
  return referencedDisplaySetMetadata;
}
/* harmony default export */ const viewports_OHIFCornerstoneSEGViewport = (OHIFCornerstoneSEGViewport);

/***/ })

}]);