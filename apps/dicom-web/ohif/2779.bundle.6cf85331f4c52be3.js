"use strict";
(globalThis["rspackChunk"] = globalThis["rspackChunk"] || []).push([[2779], {
64667(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  C: () => (setShowPercentage),
  w: () => (showPercentage)
});
// Global state to control whether to show the percentage in the overlay
let showPercentage = true;

/**
 * Sets whether to show the pleura percentage in the viewport overlay
 * @param value - Boolean indicating whether to show the percentage
 */
function setShowPercentage(value) {
  showPercentage = value;
}

},
93798(__unused_rspack_module, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ usAnnotation_src)
});

// UNUSED EXPORTS: setShowPercentage, showPercentage

;// CONCATENATED MODULE: ../../../extensions/usAnnotation/package.json
var package_namespaceObject = JSON.parse('{"UU":"@ohif/extension-ultrasound-pleura-bline"}')
;// CONCATENATED MODULE: ../../../extensions/usAnnotation/src/id.js

const id = package_namespaceObject.UU;

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/index.js
var esm = __webpack_require__(55526);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var dist_esm = __webpack_require__(88479);
// EXTERNAL MODULE: ../../core/src/index.ts + 75 modules
var src = __webpack_require__(50679);
// EXTERNAL MODULE: ../../../node_modules/react-i18next/dist/es/index.js + 29 modules
var es = __webpack_require__(75258);
// EXTERNAL MODULE: ../../ui-next/src/index.ts + 3685 modules
var ui_next_src = __webpack_require__(77723);
;// CONCATENATED MODULE: ../../../extensions/usAnnotation/src/panels/USAnnotationPanel.tsx







/**
 * A side panel that drives the ultrasound annotation workflow.
 * It provides controls for managing annotations, toggling display options,
 * and downloading annotations as JSON.
 * @returns The USAnnotationPanel component
 */
function USAnnotationPanel() {
  const {
    t
  } = (0,es/* .useTranslation */.Bd)('USAnnotationPanel');
  const {
    servicesManager,
    commandsManager
  } = (0,src/* .useSystem */.Jg)();

  /** ──────────────────────────────────────────────────────
   * Local state – purely UI related (no business logic).   */

  const {
    viewportGridService,
    cornerstoneViewportService,
    measurementService
  } = servicesManager.services;

  // UI state variables
  const [depthGuide, setDepthGuide] = (0,react.useState)(true);
  const [autoAdd, setAutoAdd] = (0,react.useState)(true);
  const [showPleuraPct, setShowPleuraPct] = (0,react.useState)(true);
  const [showOverlay, setShowOverlay] = (0,react.useState)(true);

  // Data state variables
  const [annotatedFrames, setAnnotatedFrames] = (0,react.useState)([]);
  const [imageIdsToObserve, setImageIdsToObserve] = (0,react.useState)([]);
  const [labels, setLabels] = (0,react.useState)([]);

  /** ──────────────────────────────────────────────────────
   * Helper – commands bridging back to OHIF services.       */

  /**
   * Switches the active annotation type (pleura or B-line)
   * @param type - The annotation type to switch to
   */
  const switchAnnotation = type => {
    commandsManager.runCommand('setToolActive', {
      toolName: esm.UltrasoundPleuraBLineTool.toolName
    });
    commandsManager.runCommand('switchUSAnnotation', {
      annotationType: type
    });
  };

  /**
   * Deletes the last annotation of the specified type
   * @param type - The annotation type to delete
   */
  const deleteLast = type => {
    commandsManager.runCommand('deleteLastAnnotation', {
      annotationType: type
    });
    updateAnnotatedFrames();
  };

  /**
   * Sets the depth guide display state
   * @param value - Boolean indicating whether to show the depth guide
   */
  const setDepthGuideCommand = value => {
    commandsManager.runCommand('setDepthGuide', {
      value
    });
    setDepthGuide(value);
  };
  /**
   * Sets the auto-add annotations state
   * When enabled, all frames are monitored for annotations
   * When disabled, only manually added frames are monitored
   * @param value - Boolean indicating whether to auto-add annotations
   */
  const setAutoAddCommand = value => {
    if (value) {
      setImageIdsToObserve([]);
    } else {
      const imageIds = annotatedFrames.map(item => item.imageId);
      if (imageIds.length > 0) {
        setImageIdsToObserve(imageIds);
      } else {
        setImageIdsToObserve(['Manual']);
      }
    }
    setAutoAdd(value);
  };
  /**
   * Sets whether to show the pleura percentage in the viewport overlay
   * @param value - Boolean indicating whether to show the percentage
   */
  const setShowPleuraPercentageCommand = value => {
    commandsManager.runCommand('setShowPleuraPercentage', {
      value
    });
    setShowPleuraPct(value);
  };
  /**
   * Sets whether to show the fan overlay in the viewport
   * @param value - Boolean indicating whether to show the overlay
   */
  const setShowOverlayCommand = value => {
    commandsManager.runCommand('setDisplayFanAnnotation', {
      value
    });
    commandsManager.runCommand('setShowPleuraPercentage', {
      value
    });
    setShowOverlay(value);
  };
  /**
   * Downloads the annotations as a JSON file
   * Uses the labels and imageIdsToObserve state variables
   */
  const downloadJSON = () => {
    commandsManager.runCommand('downloadJSON', {
      labels,
      imageIds: imageIdsToObserve
    });
  };

  /**
   * Adds the current image ID to the list of monitored image IDs
   * Only works when auto-add is disabled
   */
  const addCurrentImageId = () => {
    if (!autoAdd) {
      const activeViewportId = viewportGridService.getActiveViewportId();
      const viewport = cornerstoneViewportService.getCornerstoneViewport(activeViewportId);
      const currentImageId = viewport.getCurrentImageId();
      const imageIds = [...imageIdsToObserve];
      if (!imageIds.includes(currentImageId)) {
        imageIds.push(currentImageId);
      }
      setImageIdsToObserve(imageIds);
    }
  };

  /**
   * Handles clicking on a row in the annotated frames table
   * Scrolls the viewport to the selected frame
   * @param item - The annotated frame item that was clicked
   */
  const handleRowClick = item => {
    const activeViewportId = viewportGridService.getActiveViewportId();
    const viewport = cornerstoneViewportService.getCornerstoneViewport(activeViewportId);
    dist_esm.utilities.scroll(viewport, {
      delta: item.frame - viewport.getCurrentImageIdIndex()
    });
  };

  /**
   * Render helpers so the JSX doesn’t become spaghetti.     */
  const renderWorkflowToggles = () => /*#__PURE__*/react.createElement(ui_next_src/* .PanelSection.Content */.aUM.Content, null, /*#__PURE__*/react.createElement("div", {
    className: "text-foreground space-y-3 p-2 text-sm"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/react.createElement(ui_next_src/* .Switch */.dOG, {
    id: "depth-guide-switch",
    className: "mr-3",
    checked: depthGuide,
    onCheckedChange: () => setDepthGuideCommand(!depthGuide)
  }), /*#__PURE__*/react.createElement("label", {
    htmlFor: "depth-guide-switch",
    className: "cursor-pointer",
    onClick: () => setDepthGuideCommand(!depthGuide)
  }, t('Depth guide toggle'))), /*#__PURE__*/react.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/react.createElement(ui_next_src/* .Switch */.dOG, {
    id: "pleura-percentage-switch",
    className: "mr-3",
    checked: showPleuraPct,
    onCheckedChange: () => setShowPleuraPercentageCommand(!showPleuraPct)
  }), /*#__PURE__*/react.createElement("label", {
    htmlFor: "pleura-percentage-switch",
    className: "cursor-pointer",
    onClick: () => setShowPleuraPercentageCommand(!showPleuraPct)
  }, t('Show pleura percentage')))));
  const renderSectorAnnotations = () => /*#__PURE__*/react.createElement(ui_next_src/* .PanelSection.Content */.aUM.Content, null, /*#__PURE__*/react.createElement("div", {
    className: "flex flex-col gap-4 p-2"
  }, /*#__PURE__*/react.createElement(ui_next_src/* .Label */.JU7, null, t('Sector Annotations')), /*#__PURE__*/react.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/react.createElement(ui_next_src/* .Tabs */.tUM, {
    defaultValue: esm.UltrasoundPleuraBLineTool.USPleuraBLineAnnotationType.BLINE,
    onValueChange: newValue => switchAnnotation(newValue)
  }, /*#__PURE__*/react.createElement(ui_next_src/* .TabsList */.j7C, null, /*#__PURE__*/react.createElement(ui_next_src/* .TabsTrigger */.Xib, {
    value: esm.UltrasoundPleuraBLineTool.USPleuraBLineAnnotationType.PLEURA
  }, /*#__PURE__*/react.createElement(ui_next_src/* .Icons.Plus */.FI1.Plus, null), " ", t('Pleura line')), /*#__PURE__*/react.createElement(ui_next_src/* .TabsTrigger */.Xib, {
    value: esm.UltrasoundPleuraBLineTool.USPleuraBLineAnnotationType.BLINE
  }, /*#__PURE__*/react.createElement(ui_next_src/* .Icons.Plus */.FI1.Plus, null), " ", t('B-line')), /*#__PURE__*/react.createElement(ui_next_src/* .Separator */.wvv, {
    orientation: "vertical"
  }), /*#__PURE__*/react.createElement(ui_next_src/* .Separator */.wvv, {
    orientation: "vertical"
  }))), /*#__PURE__*/react.createElement(ui_next_src/* .DropdownMenu */.rId, null, /*#__PURE__*/react.createElement(ui_next_src/* .DropdownMenuTrigger */.tyb, {
    asChild: true
  }, /*#__PURE__*/react.createElement(ui_next_src/* .Button */.$nd, {
    variant: "ghost",
    className: "ml-auto"
  }, /*#__PURE__*/react.createElement(ui_next_src/* .Icons.More */.FI1.More, null))), /*#__PURE__*/react.createElement(ui_next_src/* .DropdownMenuContent */.SQm, null, /*#__PURE__*/react.createElement(ui_next_src/* .DropdownMenuItem */._26, {
    onClick: () => deleteLast(esm.UltrasoundPleuraBLineTool.USPleuraBLineAnnotationType.BLINE)
  }, /*#__PURE__*/react.createElement(ui_next_src/* .Icons.Delete */.FI1.Delete, {
    className: "text-foreground"
  }), /*#__PURE__*/react.createElement("span", {
    className: "pl-2"
  }, t('B-line annotation'))), /*#__PURE__*/react.createElement(ui_next_src/* .DropdownMenuItem */._26, {
    onClick: () => deleteLast(esm.UltrasoundPleuraBLineTool.USPleuraBLineAnnotationType.PLEURA)
  }, /*#__PURE__*/react.createElement(ui_next_src/* .Icons.Delete */.FI1.Delete, {
    className: "text-foreground"
  }), /*#__PURE__*/react.createElement("span", {
    className: "pl-2"
  }, t('Pleura annotation')))))), /*#__PURE__*/react.createElement("div", {
    className: "mt-2 flex items-center gap-2"
  }, /*#__PURE__*/react.createElement(ui_next_src/* .Switch */.dOG, {
    id: "show-overlay-switch",
    checked: showOverlay,
    onCheckedChange: () => setShowOverlayCommand(!showOverlay)
  }), /*#__PURE__*/react.createElement("label", {
    htmlFor: "show-overlay-switch",
    className: "text-muted-foreground cursor-pointer"
  }, t('Show Overlay'))), /*#__PURE__*/react.createElement("hr", {
    className: "border-input/50 border-t"
  })));
  const renderAnnotatedFrames = () => /*#__PURE__*/react.createElement(ui_next_src/* .ScrollArea */.FKN, {
    className: "h-full"
  }, /*#__PURE__*/react.createElement(ui_next_src/* .PanelSection.Content */.aUM.Content, null, /*#__PURE__*/react.createElement("div", {
    className: "mb-4 flex items-center justify-between"
  }, /*#__PURE__*/react.createElement(ui_next_src/* .Button */.$nd, {
    variant: "ghost",
    onClick: () => downloadJSON()
  }, /*#__PURE__*/react.createElement(ui_next_src/* .Icons.Download */.FI1.Download, {
    className: "h-5 w-5"
  }), /*#__PURE__*/react.createElement("span", null, t('JSON'))), /*#__PURE__*/react.createElement(ui_next_src/* .Button */.$nd, {
    variant: "ghost",
    onClick: () => setShowOverlayCommand(!showOverlay)
  }, showOverlay ? /*#__PURE__*/react.createElement(ui_next_src/* .Icons.Hide */.FI1.Hide, {
    className: "h-5 w-5"
  }) : /*#__PURE__*/react.createElement(ui_next_src/* .Icons.Show */.FI1.Show, {
    className: "h-5 w-5"
  }))), /*#__PURE__*/react.createElement("div", {
    className: "w-full overflow-hidden"
  }, /*#__PURE__*/react.createElement("table", {
    className: "w-full border-collapse text-sm"
  }, /*#__PURE__*/react.createElement("thead", null, /*#__PURE__*/react.createElement("tr", {
    className: "text-muted-foreground border-input/50 border-b"
  }, /*#__PURE__*/react.createElement("th", null), /*#__PURE__*/react.createElement("th", {
    className: "py-2 px-2 text-left font-normal"
  }, t('Frame')), /*#__PURE__*/react.createElement("th", {
    className: "py-2 px-2 text-center font-normal"
  }, t('Pleura lines')), /*#__PURE__*/react.createElement("th", {
    className: "py-2 px-2 text-center font-normal"
  }, t('B-lines')), /*#__PURE__*/react.createElement("th", {
    className: "w-10"
  }))), /*#__PURE__*/react.createElement("tbody", null, annotatedFrames.map(item => /*#__PURE__*/react.createElement("tr", {
    key: item.frame,
    className: `border-input/50 border-b ${item.frame === 5 ? 'bg-cyan-800 bg-opacity-30' : ''}`,
    onClick: () => handleRowClick(item),
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/react.createElement("td", {
    className: "py-2 px-2"
  }, item.index), /*#__PURE__*/react.createElement("td", {
    className: "py-2 px-2"
  }, item.frame + 1), /*#__PURE__*/react.createElement("td", {
    className: "py-2 px-2 text-center"
  }, item.pleura), /*#__PURE__*/react.createElement("td", {
    className: "py-2 px-2 text-center"
  }, item.bLine), /*#__PURE__*/react.createElement("td", {
    className: "py-2 px-2 text-right"
  }, item.frame === 5 && /*#__PURE__*/react.createElement("div", {
    className: "flex items-center justify-end"
  }, /*#__PURE__*/react.createElement(ui_next_src/* .Button */.$nd, {
    variant: "ghost",
    className: "p-0"
  }, /*#__PURE__*/react.createElement(ui_next_src/* .Icons.EyeVisible */.FI1.EyeVisible, null)), /*#__PURE__*/react.createElement(ui_next_src/* .Button */.$nd, {
    variant: "ghost",
    className: "ml-2 p-0"
  }, /*#__PURE__*/react.createElement(ui_next_src/* .Icons.More */.FI1.More, null)))))))))));
  const updateAnnotatedFrames = () => {
    const activeViewportId = viewportGridService.getActiveViewportId();
    const viewport = cornerstoneViewportService.getCornerstoneViewport(activeViewportId);
    // copying to avoid mutating the original array
    const imageIdsMonitored = [...imageIdsToObserve];
    const imageIdFilter = imageId => {
      if (imageIdsMonitored.length === 0) {
        return true;
      }
      return imageIdsMonitored.includes(imageId);
    };
    const mapping = esm.UltrasoundPleuraBLineTool.countAnnotations(viewport.element, imageIdFilter);
    if (!mapping) {
      setAnnotatedFrames([]);
      return;
    }
    const keys = Array.from(mapping.keys());
    const updatedFrames = keys.map((key, index) => {
      const {
        pleura,
        bLine,
        frame
      } = mapping.get(key) || {
        pleura: 0,
        bLine: 0,
        frame: 0
      };
      return {
        imageId: key,
        index: index + 1,
        frame,
        pleura,
        bLine
      };
    });
    setAnnotatedFrames(updatedFrames);
  };
  /**
   * Callback function that is called when an annotation is modified
   * Updates the annotatedFrames state with the latest annotation data
   */
  const annotationModified = react.useCallback(event => {
    if (event.detail.annotation.metadata.toolName === esm.UltrasoundPleuraBLineTool.toolName) {
      updateAnnotatedFrames();
    }
  }, [viewportGridService, cornerstoneViewportService, imageIdsToObserve]);
  (0,react.useEffect)(() => {
    dist_esm.eventTarget.addEventListener(esm.Enums.Events.ANNOTATION_MODIFIED, annotationModified);
    const {
      unsubscribe
    } = measurementService.subscribe(measurementService.EVENTS.MEASUREMENT_REMOVED, () => {
      updateAnnotatedFrames();
    });
    return () => {
      dist_esm.eventTarget.removeEventListener(esm.Enums.Events.ANNOTATION_MODIFIED, annotationModified);
      unsubscribe();
    };
  }, [annotationModified, measurementService]);

  /**
   * ──────────────────────────────────────────────────────
   *  🖼  Final Render                                      */
  return /*#__PURE__*/react.createElement("div", {
    className: "text-foreground h-full bg-background",
    style: {
      minWidth: 240,
      maxWidth: 480,
      width: '100%'
    }
  }, /*#__PURE__*/react.createElement(ui_next_src/* .PanelSection */.aUM, null, /*#__PURE__*/react.createElement(ui_next_src/* .PanelSection.Header */.aUM.Header, null, t('Workflow')), renderWorkflowToggles()), /*#__PURE__*/react.createElement(ui_next_src/* .PanelSection */.aUM, null, /*#__PURE__*/react.createElement(ui_next_src/* .PanelSection.Header */.aUM.Header, null, t('Annotations')), renderSectorAnnotations()), /*#__PURE__*/react.createElement(ui_next_src/* .PanelSection */.aUM, {
    className: "flex-1"
  }, /*#__PURE__*/react.createElement(ui_next_src/* .PanelSection.Header */.aUM.Header, null, t('Annotated Frames')), renderAnnotatedFrames()));
}
;// CONCATENATED MODULE: ../../../extensions/usAnnotation/src/getPanelModule.tsx



/**
 * Creates and returns the panel module for ultrasound annotation
 * @param params - Object containing commandsManager, servicesManager, and extensionManager
 * @returns Array of panel configurations
 */
const getPanelModule = ({
  commandsManager,
  servicesManager,
  extensionManager
}) => {
  /**
   * Wrapper component for the USAnnotationPanel that injects the required props
   * @param props - Component props including configuration
   * @returns The wrapped USAnnotationPanel component
   */
  const wrappedUSAnnotationPanel = ({
    configuration
  }) => {
    return /*#__PURE__*/react.createElement(USAnnotationPanel, null);
  };
  return [{
    name: 'USAnnotationPanel',
    iconName: 'tab-linear',
    iconLabel: 'US Annotation',
    label: 'USAnnotation',
    component: wrappedUSAnnotationPanel
  }];
};
/* export default */ const src_getPanelModule = (getPanelModule);
;// CONCATENATED MODULE: ../../../extensions/usAnnotation/src/getInstanceByImageId.ts
/**
 * Retrieves the DICOM instance associated with a specific imageId
 * @param services - The OHIF services object
 * @param imageId - The image ID to find the instance for
 * @returns The DICOM instance object or undefined if not found
 */
function getInstanceByImageId(services, imageId) {
  const activeDisplaySets = services.displaySetService.getActiveDisplaySets();
  const displaySet = activeDisplaySets.find(displaySet => displaySet?.imageIds?.includes(imageId));
  return displaySet?.instance;
}
// EXTERNAL MODULE: ../../../extensions/usAnnotation/src/PleuraBlinePercentage.ts
var PleuraBlinePercentage = __webpack_require__(64667);
;// CONCATENATED MODULE: ../../../extensions/usAnnotation/src/getCommandsModule.ts





const {
  downloadBlob
} = src/* .utils */.Wp;
const {
  transformWorldToIndex
} = dist_esm.utilities;

/**
 * Creates and returns the commands module for ultrasound annotation
 * @param params - Extension parameters including servicesManager and commandsManager
 * @returns The commands module with actions and definitions
 */
function commandsModule({
  servicesManager
}) {
  const {
    viewportGridService,
    toolGroupService,
    cornerstoneViewportService
  } = servicesManager.services;
  const actions = {
    /**
     * Switches the active ultrasound annotation type
     * @param options - Object containing the annotationType to switch to
     */
    switchUSPleuraBLineAnnotation: ({
      annotationType
    }) => {
      const activeViewportId = viewportGridService.getActiveViewportId();
      const toolGroup = toolGroupService.getToolGroupForViewport(activeViewportId);
      if (!toolGroup) {
        return;
      }
      const usAnnotation = toolGroup.getToolInstance(esm.UltrasoundPleuraBLineTool.toolName);
      if (usAnnotation) {
        usAnnotation.setActiveAnnotationType(annotationType);
      }
    },
    /**
     * Convenience method to switch to pleura line annotation type
     */
    switchUSPleuraBLineAnnotationToPleuraLine: () => {
      actions.switchUSPleuraBLineAnnotation({
        annotationType: esm.UltrasoundPleuraBLineTool.USPleuraBLineAnnotationType.PLEURA
      });
    },
    /**
     * Convenience method to switch to B-line annotation type
     */
    switchUSPleuraBLineAnnotationToBLine: () => {
      actions.switchUSPleuraBLineAnnotation({
        annotationType: esm.UltrasoundPleuraBLineTool.USPleuraBLineAnnotationType.BLINE
      });
    },
    /**
     * Deletes the last annotation of the specified type
     * @param options - Object containing the annotationType to delete
     */
    deleteLastUSPleuraBLineAnnotation: ({
      annotationType
    }) => {
      const activeViewportId = viewportGridService.getActiveViewportId();
      const toolGroup = toolGroupService.getToolGroupForViewport(activeViewportId);
      if (!toolGroup) {
        return;
      }
      const usAnnotation = toolGroup.getToolInstance(esm.UltrasoundPleuraBLineTool.toolName);
      if (usAnnotation) {
        const viewport = cornerstoneViewportService.getCornerstoneViewport(activeViewportId);
        usAnnotation.deleteLastAnnotationType(viewport.element, annotationType);
        viewport.render();
      }
    },
    /**
     * Convenience method to delete the last pleura line annotation
     */
    deleteLastPleuraAnnotation: () => {
      actions.deleteLastUSPleuraBLineAnnotation({
        annotationType: esm.UltrasoundPleuraBLineTool.USPleuraBLineAnnotationType.PLEURA
      });
    },
    /**
     * Convenience method to delete the last B-line annotation
     */
    deleteLastBLineAnnotation: () => {
      actions.deleteLastUSPleuraBLineAnnotation({
        annotationType: esm.UltrasoundPleuraBLineTool.USPleuraBLineAnnotationType.BLINE
      });
    },
    /**
     * Toggles a boolean attribute of the ultrasound annotation tool
     * @param options - Object containing the attribute name to toggle
     */
    toggleUSToolAttribute: ({
      attribute
    }) => {
      const activeViewportId = viewportGridService.getActiveViewportId();
      const toolGroup = toolGroupService.getToolGroupForViewport(activeViewportId);
      if (!toolGroup) {
        return;
      }
      const configuration = toolGroup.getToolConfiguration(esm.UltrasoundPleuraBLineTool.toolName);
      if (!configuration) {
        return;
      }
      toolGroup.setToolConfiguration(esm.UltrasoundPleuraBLineTool.toolName, {
        [attribute]: !configuration[attribute]
      });
      const viewport = cornerstoneViewportService.getCornerstoneViewport(activeViewportId);
      viewport.render();
    },
    /**
     * Sets a specific attribute of the ultrasound annotation tool to a given value
     * @param options - Object containing the attribute name and value to set
     */
    setUSToolAttribute: ({
      attribute,
      value
    }) => {
      const activeViewportId = viewportGridService.getActiveViewportId();
      const toolGroup = toolGroupService.getToolGroupForViewport(activeViewportId);
      if (!toolGroup) {
        return;
      }
      const configuration = toolGroup.getToolConfiguration(esm.UltrasoundPleuraBLineTool.toolName);
      if (!configuration) {
        return;
      }
      toolGroup.setToolConfiguration(esm.UltrasoundPleuraBLineTool.toolName, {
        [attribute]: value
      });
      const viewport = cornerstoneViewportService.getCornerstoneViewport(activeViewportId);
      viewport.render();
    },
    /**
     * Toggles the display of fan annotations
     */
    toggleDisplayFanAnnotation: () => {
      actions.toggleUSToolAttribute({
        attribute: 'showFanAnnotations'
      });
    },
    /**
     * Toggles the display of the depth guide
     */
    toggleDepthGuide: () => {
      actions.toggleUSToolAttribute({
        attribute: 'drawDepthGuide'
      });
    },
    /**
     * Sets the depth guide display state
     * @param options - Object containing the boolean value to set
     */
    setDepthGuide: ({
      value
    }) => {
      actions.setUSToolAttribute({
        attribute: 'drawDepthGuide',
        value
      });
    },
    /**
     * Sets the fan annotation display state
     * @param options - Object containing the boolean value to set
     */
    setDisplayFanAnnotation: ({
      value
    }) => {
      actions.setUSToolAttribute({
        attribute: 'showFanAnnotations',
        value
      });
    },
    /**
     * Sets whether to show the pleura percentage in the viewport overlay
     * @param options - Object containing the boolean value to set
     */
    setShowPleuraPercentage: ({
      value
    }) => {
      (0,PleuraBlinePercentage/* .setShowPercentage */.C)(value);
      // Trigger ANNOTATION_MODIFIED event to update the overlay
      (0,dist_esm.triggerEvent)(dist_esm.eventTarget, esm.Enums.Events.ANNOTATION_MODIFIED, {
        annotation: {
          metadata: {
            toolName: esm.UltrasoundPleuraBLineTool.toolName
          }
        }
      });
    },
    /**
     * Generates a JSON representation of the ultrasound annotations
     * @param labels - Array of annotation labels
     * @param imageIds - Array of image IDs to include in the JSON
     * @returns A JSON object containing the annotations data or undefined if generation fails
     */
    generateUSPleuraBLineAnnotationsJSON: (labels = [], imageIds = []) => {
      const activeViewportId = viewportGridService.getActiveViewportId();
      const viewport = cornerstoneViewportService.getCornerstoneViewport(activeViewportId);
      if (!viewport) {
        return;
      }
      const {
        imageData
      } = viewport.getImageData() || {};
      if (!imageData) {
        return;
      }
      const toolGroup = toolGroupService.getToolGroupForViewport(activeViewportId);
      if (!toolGroup) {
        return;
      }
      const usAnnotation = toolGroup.getToolInstance(esm.UltrasoundPleuraBLineTool.toolName);
      if (usAnnotation) {
        const configuration = toolGroup.getToolConfiguration(esm.UltrasoundPleuraBLineTool.toolName);
        const imageId = viewport.getCurrentImageId();
        const filterImageIds = imageId => {
          if (imageIds.length === 0) {
            return true;
          } else {
            return imageIds.includes(imageId);
          }
        };
        const annotations = esm.UltrasoundPleuraBLineTool.filterAnnotations(viewport.element, filterImageIds);
        const frame_annotations = {};
        const viewportImageIds = viewport.getImageIds();
        annotations.forEach(annotation => {
          const imageId = annotation.metadata.referencedImageId;
          const {
            annotationType
          } = annotation.data;
          const [point1, point2] = annotation.data.handles.points;
          const p1 = transformWorldToIndex(imageData, point1);
          const p2 = transformWorldToIndex(imageData, point2);
          const imageIdIndex = viewportImageIds.indexOf(imageId);
          if (frame_annotations[imageIdIndex] === undefined) {
            frame_annotations[imageIdIndex] = {
              pleura_lines: [],
              b_lines: []
            };
          }
          if (annotationType === esm.UltrasoundPleuraBLineTool.USPleuraBLineAnnotationType.PLEURA) {
            frame_annotations[imageIdIndex].pleura_lines.push([[p1[0], p1[1], 0], [p2[0], p2[1], 0]]);
          } else if (annotationType === esm.UltrasoundPleuraBLineTool.USPleuraBLineAnnotationType.BLINE) {
            frame_annotations[imageIdIndex].b_lines.push([[p1[0], p1[1], 0], [p2[0], p2[1], 0]]);
          }
        });
        const instance = getInstanceByImageId(servicesManager.services, imageId);
        const json = {
          SOPInstanceUID: instance.SOPInstanceUID,
          GrayscaleConversion: false,
          mask_type: 'fan',
          angle1: configuration.startAngle,
          angle2: configuration.endAngle,
          center_rows_px: configuration.center[0],
          center_cols_px: configuration.center[1],
          radius1: configuration.innerRadius,
          radius2: configuration.outerRadius,
          image_size_rows: instance.rows,
          image_size_cols: instance.columns,
          AnnotationLabels: labels,
          frame_annotations
        };
        return json;
      }
    },
    /**
     * Downloads the ultrasound annotations as a JSON file
     * @param options - Object containing labels and imageIds arrays
     */
    downloadUSPleuraBLineAnnotationsJSON({
      labels = [],
      imageIds = []
    }) {
      const json = actions.generateUSPleuraBLineAnnotationsJSON(labels, imageIds);
      if (!json) {
        return;
      }

      // Convert JSON object to a string
      const jsonString = JSON.stringify(json, null, 2);

      // Create a blob with the JSON data
      const blob = new Blob([jsonString], {
        type: 'application/json'
      });
      downloadBlob(blob, {
        filename: `ultrasound_annotations_${new Date().toISOString().slice(0, 10)}.json`
      });
    }
  };
  const definitions = {
    switchUSAnnotation: {
      commandFn: actions.switchUSPleuraBLineAnnotation
    },
    deleteLastAnnotation: {
      commandFn: actions.deleteLastUSPleuraBLineAnnotation
    },
    toggleDepthGuide: {
      commandFn: actions.toggleDepthGuide
    },
    setDepthGuide: {
      commandFn: actions.setDepthGuide
    },
    setShowPleuraPercentage: {
      commandFn: actions.setShowPleuraPercentage
    },
    toggleUSToolAttribute: {
      commandFn: actions.toggleUSToolAttribute
    },
    setUSToolAttribute: {
      commandFn: actions.setUSToolAttribute
    },
    toggleDisplayFanAnnotation: {
      commandFn: actions.toggleDisplayFanAnnotation
    },
    setDisplayFanAnnotation: {
      commandFn: actions.setDisplayFanAnnotation
    },
    generateJSON: {
      commandFn: actions.generateUSPleuraBLineAnnotationsJSON
    },
    downloadJSON: {
      commandFn: actions.downloadUSPleuraBLineAnnotationsJSON
    },
    switchUSAnnotationToPleuraLine: {
      commandFn: actions.switchUSPleuraBLineAnnotationToPleuraLine
    },
    switchUSAnnotationToBLine: {
      commandFn: actions.switchUSPleuraBLineAnnotationToBLine
    },
    deleteLastPleuraAnnotation: {
      commandFn: actions.deleteLastPleuraAnnotation
    },
    deleteLastBLineAnnotation: {
      commandFn: actions.deleteLastBLineAnnotation
    }
  };
  return {
    actions,
    definitions,
    defaultContext: 'CORNERSTONE'
  };
}
/* export default */ const getCommandsModule = (commandsModule);
;// CONCATENATED MODULE: ../../../extensions/usAnnotation/src/index.ts




/**
 * You can remove any of the following modules if you don't need them.
 */
/* export default */ const usAnnotation_src = ({
  /**
   * Only required property. Should be a unique value across all extensions.
   * You ID can be anything you want, but it should be unique.
   */
  id: id,
  /**
   * PanelModule should provide a list of panels that will be available in OHIF
   * for Modes to consume and render. Each panel is defined by a {name,
   * iconName, iconLabel, label, component} object. Example of a panel module
   * is the StudyBrowserPanel that is provided by the default extension in OHIF.
   */
  getPanelModule: src_getPanelModule,
  /**
   * CommandsModule should provide a list of commands that will be available in OHIF
   * for Modes to consume and use in the viewports. Each command is defined by
   * an object of { actions, definitions, defaultContext } where actions is an
   * object of functions, definitions is an object of available commands, their
   * options, and defaultContext is the default context for the command to run against.
   */
  getCommandsModule: getCommandsModule
});


},

}]);