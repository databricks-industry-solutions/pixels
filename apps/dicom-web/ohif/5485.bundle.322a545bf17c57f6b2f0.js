"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[5485],{

/***/ 35485
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  xT: () => (/* binding */ basicLayout),
  o2: () => (/* binding */ basicRoute),
  Nu: () => (/* binding */ cornerstone),
  "default": () => (/* binding */ basic_src),
  V6: () => (/* binding */ dicomRT),
  tR: () => (/* binding */ extensionDependencies),
  Mq: () => (/* binding */ mode),
  dw: () => (/* binding */ modeInstance),
  Dt: () => (/* binding */ ohif),
  b2: () => (/* binding */ segmentation)
});

// UNUSED EXPORTS: NON_IMAGE_MODALITIES, dicomPmap, dicomSeg, dicomecg, dicompdf, dicomsr, dicomvideo, initToolGroups, isValidMode, layoutTemplate, modeFactory, onModeEnter, onModeExit, sopClassHandlers, toolbarButtons, toolbarSections

// EXTERNAL MODULE: ../../../node_modules/immutability-helper/index.js
var immutability_helper = __webpack_require__(1752);
var immutability_helper_default = /*#__PURE__*/__webpack_require__.n(immutability_helper);
// EXTERNAL MODULE: ../../core/src/index.ts + 69 modules
var src = __webpack_require__(42356);
;// ../../../modes/basic/src/initToolGroups.ts
const colours = {
  'viewport-0': 'rgb(200, 0, 0)',
  'viewport-1': 'rgb(200, 200, 0)',
  'viewport-2': 'rgb(0, 200, 0)'
};
const colorsByOrientation = {
  axial: 'rgb(200, 0, 0)',
  sagittal: 'rgb(200, 200, 0)',
  coronal: 'rgb(0, 200, 0)'
};
function initDefaultToolGroup(extensionManager, toolGroupService, commandsManager, toolGroupId) {
  const utilityModule = extensionManager.getModuleEntry('@ohif/extension-cornerstone.utilityModule.tools');
  const {
    toolNames,
    Enums
  } = utilityModule.exports;
  const tools = {
    active: [{
      toolName: toolNames.WindowLevel,
      bindings: [{
        mouseButton: Enums.MouseBindings.Primary
      }]
    }, {
      toolName: toolNames.Pan,
      bindings: [{
        mouseButton: Enums.MouseBindings.Auxiliary
      }]
    }, {
      toolName: toolNames.Zoom,
      bindings: [{
        mouseButton: Enums.MouseBindings.Secondary
      }, {
        numTouchPoints: 2
      }]
    }, {
      toolName: toolNames.StackScroll,
      bindings: [{
        mouseButton: Enums.MouseBindings.Wheel
      }, {
        numTouchPoints: 3
      }]
    }],
    passive: [{
      toolName: toolNames.Length
    }, {
      toolName: toolNames.ArrowAnnotate,
      configuration: {
        getTextCallback: (callback, eventDetails) => {
          commandsManager.runCommand('arrowTextCallback', {
            callback,
            eventDetails
          });
        },
        changeTextCallback: (data, eventDetails, callback) => {
          commandsManager.runCommand('arrowTextCallback', {
            callback,
            data,
            eventDetails
          });
        }
      }
    }, {
      toolName: toolNames.SegmentBidirectional
    }, {
      toolName: toolNames.Bidirectional
    }, {
      toolName: toolNames.DragProbe
    }, {
      toolName: toolNames.Probe
    }, {
      toolName: toolNames.EllipticalROI
    }, {
      toolName: toolNames.CircleROI
    }, {
      toolName: toolNames.RectangleROI
    }, {
      toolName: toolNames.StackScroll
    }, {
      toolName: toolNames.Angle
    }, {
      toolName: toolNames.CobbAngle
    }, {
      toolName: toolNames.Magnify
    }, {
      toolName: toolNames.CalibrationLine
    }, {
      toolName: toolNames.PlanarFreehandContourSegmentation,
      configuration: {
        displayOnePointAsCrosshairs: true
      }
    }, {
      toolName: toolNames.UltrasoundDirectional
    }, {
      toolName: toolNames.PlanarFreehandROI
    }, {
      toolName: toolNames.SplineROI
    }, {
      toolName: toolNames.LivewireContour
    }, {
      toolName: toolNames.WindowLevelRegion
    }],
    enabled: [{
      toolName: toolNames.ImageOverlayViewer
    }, {
      toolName: toolNames.ReferenceLines
    }],
    disabled: [{
      toolName: toolNames.AdvancedMagnify
    }]
  };
  const updatedTools = commandsManager.run('initializeSegmentLabelTool', {
    tools
  });
  toolGroupService.createToolGroupAndAddTools(toolGroupId, updatedTools);
}
function initSRToolGroup(extensionManager, toolGroupService) {
  const SRUtilityModule = extensionManager.getModuleEntry('@ohif/extension-cornerstone-dicom-sr.utilityModule.tools');
  if (!SRUtilityModule) {
    return;
  }
  const CS3DUtilityModule = extensionManager.getModuleEntry('@ohif/extension-cornerstone.utilityModule.tools');
  const {
    toolNames: SRToolNames
  } = SRUtilityModule.exports;
  const {
    toolNames,
    Enums
  } = CS3DUtilityModule.exports;
  const tools = {
    active: [{
      toolName: toolNames.WindowLevel,
      bindings: [{
        mouseButton: Enums.MouseBindings.Primary
      }]
    }, {
      toolName: toolNames.Pan,
      bindings: [{
        mouseButton: Enums.MouseBindings.Auxiliary
      }]
    }, {
      toolName: toolNames.Zoom,
      bindings: [{
        mouseButton: Enums.MouseBindings.Secondary
      }, {
        numTouchPoints: 2
      }]
    }, {
      toolName: toolNames.StackScroll,
      bindings: [{
        mouseButton: Enums.MouseBindings.Wheel
      }, {
        numTouchPoints: 3
      }]
    }],
    passive: [{
      toolName: SRToolNames.SRLength
    }, {
      toolName: SRToolNames.SRArrowAnnotate
    }, {
      toolName: SRToolNames.SRBidirectional
    }, {
      toolName: SRToolNames.SREllipticalROI
    }, {
      toolName: SRToolNames.SRCircleROI
    }, {
      toolName: SRToolNames.SRPlanarFreehandROI
    }, {
      toolName: SRToolNames.SRRectangleROI
    }, {
      toolName: toolNames.WindowLevelRegion
    }],
    enabled: [{
      toolName: SRToolNames.DICOMSRDisplay
    }]
    // disabled
  };
  const toolGroupId = 'SRToolGroup';
  toolGroupService.createToolGroupAndAddTools(toolGroupId, tools);
}
function initMPRToolGroup(extensionManager, toolGroupService, commandsManager) {
  const utilityModule = extensionManager.getModuleEntry('@ohif/extension-cornerstone.utilityModule.tools');
  const serviceManager = extensionManager._servicesManager;
  const {
    cornerstoneViewportService
  } = serviceManager.services;
  const {
    toolNames,
    Enums
  } = utilityModule.exports;
  const tools = {
    active: [{
      toolName: toolNames.WindowLevel,
      bindings: [{
        mouseButton: Enums.MouseBindings.Primary
      }]
    }, {
      toolName: toolNames.Pan,
      bindings: [{
        mouseButton: Enums.MouseBindings.Auxiliary
      }]
    }, {
      toolName: toolNames.Zoom,
      bindings: [{
        mouseButton: Enums.MouseBindings.Secondary
      }, {
        numTouchPoints: 2
      }]
    }, {
      toolName: toolNames.StackScroll,
      bindings: [{
        mouseButton: Enums.MouseBindings.Wheel
      }, {
        numTouchPoints: 3
      }]
    }],
    passive: [{
      toolName: toolNames.Length
    }, {
      toolName: toolNames.ArrowAnnotate,
      configuration: {
        getTextCallback: (callback, eventDetails) => {
          commandsManager.runCommand('arrowTextCallback', {
            callback,
            eventDetails
          });
        },
        changeTextCallback: (data, eventDetails, callback) => {
          commandsManager.runCommand('arrowTextCallback', {
            callback,
            data,
            eventDetails
          });
        }
      }
    }, {
      toolName: toolNames.Bidirectional
    }, {
      toolName: toolNames.DragProbe
    }, {
      toolName: toolNames.Probe
    }, {
      toolName: toolNames.EllipticalROI
    }, {
      toolName: toolNames.CircleROI
    }, {
      toolName: toolNames.RectangleROI
    }, {
      toolName: toolNames.StackScroll
    }, {
      toolName: toolNames.Angle
    }, {
      toolName: toolNames.CobbAngle
    }, {
      toolName: toolNames.PlanarFreehandROI
    }, {
      toolName: toolNames.SplineROI
    }, {
      toolName: toolNames.LivewireContour
    }, {
      toolName: toolNames.WindowLevelRegion
    }, {
      toolName: toolNames.PlanarFreehandContourSegmentation,
      configuration: {
        displayOnePointAsCrosshairs: true
      }
    }],
    disabled: [{
      toolName: toolNames.Crosshairs,
      configuration: {
        viewportIndicators: true,
        viewportIndicatorsConfig: {
          circleRadius: 5,
          xOffset: 0.95,
          yOffset: 0.05
        },
        disableOnPassive: true,
        autoPan: {
          enabled: false,
          panSize: 10
        },
        getReferenceLineColor: viewportId => {
          const viewportInfo = cornerstoneViewportService.getViewportInfo(viewportId);
          const viewportOptions = viewportInfo?.viewportOptions;
          if (viewportOptions) {
            return colours[viewportOptions.id] || colorsByOrientation[viewportOptions.orientation] || '#0c0';
          } else {
            console.warn('missing viewport?', viewportId);
            return '#0c0';
          }
        }
      }
    }, {
      toolName: toolNames.AdvancedMagnify
    }, {
      toolName: toolNames.ReferenceLines
    }]
  };
  toolGroupService.createToolGroupAndAddTools('mpr', tools);
}
function initVolume3DToolGroup(extensionManager, toolGroupService) {
  const utilityModule = extensionManager.getModuleEntry('@ohif/extension-cornerstone.utilityModule.tools');
  const {
    toolNames,
    Enums
  } = utilityModule.exports;
  const tools = {
    active: [{
      toolName: toolNames.TrackballRotateTool,
      bindings: [{
        mouseButton: Enums.MouseBindings.Primary
      }]
    }, {
      toolName: toolNames.Zoom,
      bindings: [{
        mouseButton: Enums.MouseBindings.Secondary
      }, {
        numTouchPoints: 2
      }]
    }, {
      toolName: toolNames.Pan,
      bindings: [{
        mouseButton: Enums.MouseBindings.Auxiliary
      }, {
        numTouchPoints: 3
      }]
    }]
  };
  toolGroupService.createToolGroupAndAddTools('volume3d', tools);
}
function initToolGroups(extensionManager, toolGroupService, commandsManager) {
  initDefaultToolGroup(extensionManager, toolGroupService, commandsManager, 'default');
  initSRToolGroup(extensionManager, toolGroupService);
  initMPRToolGroup(extensionManager, toolGroupService, commandsManager);
  initVolume3DToolGroup(extensionManager, toolGroupService);
}
/* harmony default export */ const src_initToolGroups = (initToolGroups);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
// EXTERNAL MODULE: ../../../node_modules/i18next/dist/esm/i18next.js
var i18next = __webpack_require__(40680);
;// ../../../modes/basic/src/toolbarButtons.ts



const callbacks = toolName => [{
  commandName: 'setViewportForToolConfiguration',
  commandOptions: {
    toolName
  }
}];
const setToolActiveToolbar = {
  commandName: 'setToolActiveToolbar',
  commandOptions: {
    toolGroupIds: ['default', 'mpr', 'SRToolGroup', 'volume3d']
  }
};
const toolbarButtons = [
// sections
{
  id: 'MeasurementTools',
  uiType: 'ohif.toolButtonList',
  props: {
    buttonSection: true
  }
}, {
  id: 'MoreTools',
  uiType: 'ohif.toolButtonList',
  props: {
    buttonSection: true
  }
}, {
  id: 'AdvancedRenderingControls',
  uiType: 'ohif.advancedRenderingControls',
  props: {
    buttonSection: true
  }
},
// tool defs
{
  id: 'modalityLoadBadge',
  uiType: 'ohif.modalityLoadBadge',
  props: {
    icon: 'Status',
    label: i18next/* default */.A.t('Buttons:Status'),
    tooltip: i18next/* default */.A.t('Buttons:Status'),
    evaluate: {
      name: 'evaluate.modalityLoadBadge',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'navigationComponent',
  uiType: 'ohif.navigationComponent',
  props: {
    icon: 'Navigation',
    label: i18next/* default */.A.t('Buttons:Navigation'),
    tooltip: i18next/* default */.A.t('Buttons:Navigate between segments/measurements and manage their visibility'),
    evaluate: {
      name: 'evaluate.navigationComponent',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'trackingStatus',
  uiType: 'ohif.trackingStatus',
  props: {
    icon: 'TrackingStatus',
    label: i18next/* default */.A.t('Buttons:Tracking Status'),
    tooltip: i18next/* default */.A.t('Buttons:View and manage tracking status of measurements and annotations'),
    evaluate: {
      name: 'evaluate.trackingStatus',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'dataOverlayMenu',
  uiType: 'ohif.dataOverlayMenu',
  props: {
    icon: 'ViewportViews',
    label: i18next/* default */.A.t('Buttons:Data Overlay'),
    tooltip: i18next/* default */.A.t('Buttons:Configure data overlay options and manage foreground/background display sets'),
    evaluate: 'evaluate.dataOverlayMenu'
  }
}, {
  id: 'orientationMenu',
  uiType: 'ohif.orientationMenu',
  props: {
    icon: 'OrientationSwitch',
    label: i18next/* default */.A.t('Buttons:Orientation'),
    tooltip: i18next/* default */.A.t('Buttons:Change viewport orientation between axial, sagittal, coronal and reformat planes'),
    evaluate: {
      name: 'evaluate.orientationMenu'
      // hideWhenDisabled: true,
    }
  }
}, {
  id: 'windowLevelMenuEmbedded',
  uiType: 'ohif.windowLevelMenuEmbedded',
  props: {
    icon: 'WindowLevel',
    label: i18next/* default */.A.t('Buttons:Window Level'),
    tooltip: i18next/* default */.A.t('Buttons:Adjust window/level presets and customize image contrast settings'),
    evaluate: {
      name: 'evaluate.windowLevelMenuEmbedded',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'windowLevelMenu',
  uiType: 'ohif.windowLevelMenu',
  props: {
    icon: 'WindowLevel',
    label: i18next/* default */.A.t('Buttons:Window Level'),
    tooltip: i18next/* default */.A.t('Buttons:Adjust window/level presets and customize image contrast settings'),
    evaluate: {
      name: 'evaluate.windowLevelMenu'
    }
  }
}, {
  id: 'voiManualControlMenu',
  uiType: 'ohif.voiManualControlMenu',
  props: {
    icon: 'WindowLevelAdvanced',
    label: i18next/* default */.A.t('Buttons:Advanced Window Level'),
    tooltip: i18next/* default */.A.t('Buttons:Advanced window/level settings with manual controls and presets'),
    evaluate: 'evaluate.voiManualControlMenu'
  }
}, {
  id: 'thresholdMenu',
  uiType: 'ohif.thresholdMenu',
  props: {
    icon: 'Threshold',
    label: i18next/* default */.A.t('Buttons:Threshold'),
    tooltip: i18next/* default */.A.t('Buttons:Image threshold settings'),
    evaluate: {
      name: 'evaluate.thresholdMenu',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'opacityMenu',
  uiType: 'ohif.opacityMenu',
  props: {
    icon: 'Opacity',
    label: i18next/* default */.A.t('Buttons:Opacity'),
    tooltip: i18next/* default */.A.t('Buttons:Image opacity settings'),
    evaluate: {
      name: 'evaluate.opacityMenu',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'Colorbar',
  uiType: 'ohif.colorbar',
  props: {
    type: 'tool',
    label: i18next/* default */.A.t('Buttons:Colorbar')
  }
}, {
  id: 'Reset',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-reset',
    label: i18next/* default */.A.t('Buttons:Reset View'),
    tooltip: i18next/* default */.A.t('Buttons:Reset View'),
    commands: 'resetViewport',
    evaluate: 'evaluate.action'
  }
}, {
  id: 'rotate-right',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-rotate-right',
    label: i18next/* default */.A.t('Buttons:Rotate Right'),
    tooltip: i18next/* default */.A.t('Buttons:Rotate +90'),
    commands: 'rotateViewportCW',
    evaluate: ['evaluate.action', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video']
    }]
  }
}, {
  id: 'flipHorizontal',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-flip-horizontal',
    label: i18next/* default */.A.t('Buttons:Flip Horizontal'),
    tooltip: i18next/* default */.A.t('Buttons:Flip Horizontally'),
    commands: 'flipViewportHorizontal',
    evaluate: ['evaluate.viewportProperties.toggle', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video', 'volume3d']
    }]
  }
}, {
  id: 'ImageSliceSync',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'link',
    label: i18next/* default */.A.t('Buttons:Image Slice Sync'),
    tooltip: i18next/* default */.A.t('Buttons:Enable position synchronization on stack viewports'),
    commands: {
      commandName: 'toggleSynchronizer',
      commandOptions: {
        type: 'imageSlice'
      }
    },
    listeners: {
      [esm.EVENTS.VIEWPORT_NEW_IMAGE_SET]: {
        commandName: 'toggleImageSliceSync',
        commandOptions: {
          toggledState: true
        }
      }
    },
    evaluate: ['evaluate.cornerstone.synchronizer', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video', 'volume3d']
    }]
  }
}, {
  id: 'ReferenceLines',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-referenceLines',
    label: i18next/* default */.A.t('Buttons:Reference Lines'),
    tooltip: i18next/* default */.A.t('Buttons:Show Reference Lines'),
    commands: 'toggleEnabledDisabledToolbar',
    listeners: {
      [src.ViewportGridService.EVENTS.ACTIVE_VIEWPORT_ID_CHANGED]: callbacks('ReferenceLines'),
      [src.ViewportGridService.EVENTS.VIEWPORTS_READY]: callbacks('ReferenceLines')
    },
    evaluate: ['evaluate.cornerstoneTool.toggle', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video']
    }]
  }
}, {
  id: 'ImageOverlayViewer',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'toggle-dicom-overlay',
    label: i18next/* default */.A.t('Buttons:Image Overlay'),
    tooltip: i18next/* default */.A.t('Buttons:Toggle Image Overlay'),
    commands: 'toggleEnabledDisabledToolbar',
    evaluate: ['evaluate.cornerstoneTool.toggle', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video']
    }]
  }
}, {
  id: 'StackScroll',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-stack-scroll',
    label: i18next/* default */.A.t('Buttons:Stack Scroll'),
    tooltip: i18next/* default */.A.t('Buttons:Stack Scroll'),
    commands: setToolActiveToolbar,
    evaluate: {
      name: 'evaluate.cornerstoneTool',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'invert',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-invert',
    label: i18next/* default */.A.t('Buttons:Invert'),
    tooltip: i18next/* default */.A.t('Buttons:Invert Colors'),
    commands: 'invertViewport',
    evaluate: ['evaluate.viewportProperties.toggle', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video']
    }]
  }
}, {
  id: 'Probe',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-probe',
    label: i18next/* default */.A.t('Buttons:Probe'),
    tooltip: i18next/* default */.A.t('Buttons:Probe'),
    commands: setToolActiveToolbar,
    evaluate: {
      name: 'evaluate.cornerstoneTool',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'Cine',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-cine',
    label: i18next/* default */.A.t('Buttons:Cine'),
    tooltip: i18next/* default */.A.t('Buttons:Cine'),
    commands: 'toggleCine',
    evaluate: ['evaluate.cine', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['volume3d']
    }]
  }
}, {
  id: 'Angle',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-angle',
    label: i18next/* default */.A.t('Buttons:Angle'),
    tooltip: i18next/* default */.A.t('Buttons:Angle'),
    commands: setToolActiveToolbar,
    evaluate: {
      name: 'evaluate.cornerstoneTool',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'CobbAngle',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'icon-tool-cobb-angle',
    label: i18next/* default */.A.t('Buttons:Cobb Angle'),
    tooltip: i18next/* default */.A.t('Buttons:Cobb Angle'),
    commands: setToolActiveToolbar,
    evaluate: {
      name: 'evaluate.cornerstoneTool',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'Magnify',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-magnify',
    label: i18next/* default */.A.t('Buttons:Zoom-in'),
    tooltip: i18next/* default */.A.t('Buttons:Zoom-in'),
    commands: setToolActiveToolbar,
    evaluate: [{
      name: 'evaluate.cornerstoneTool',
      hideWhenDisabled: true
    }, {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video']
    }]
  }
}, {
  id: 'CalibrationLine',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-calibration',
    label: i18next/* default */.A.t('Buttons:Calibration'),
    tooltip: i18next/* default */.A.t('Buttons:Calibration Line'),
    commands: setToolActiveToolbar,
    evaluate: [{
      name: 'evaluate.cornerstoneTool',
      hideWhenDisabled: true
    }, {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video']
    }]
  }
}, {
  id: 'TagBrowser',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'dicom-tag-browser',
    label: i18next/* default */.A.t('Buttons:Dicom Tag Browser'),
    tooltip: i18next/* default */.A.t('Buttons:Dicom Tag Browser'),
    commands: 'openDICOMTagViewer'
  }
}, {
  id: 'AdvancedMagnify',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'icon-tool-loupe',
    label: i18next/* default */.A.t('Buttons:Magnify Probe'),
    tooltip: i18next/* default */.A.t('Buttons:Magnify Probe'),
    commands: 'toggleActiveDisabledToolbar',
    evaluate: ['evaluate.cornerstoneTool.toggle.ifStrictlyDisabled', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video']
    }]
  }
}, {
  id: 'UltrasoundDirectionalTool',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'icon-tool-ultrasound-bidirectional',
    label: i18next/* default */.A.t('Buttons:Ultrasound Directional'),
    tooltip: i18next/* default */.A.t('Buttons:Ultrasound Directional'),
    commands: setToolActiveToolbar,
    evaluate: [{
      name: 'evaluate.cornerstoneTool',
      hideWhenDisabled: true
    }, {
      name: 'evaluate.modality.supported',
      supportedModalities: ['US']
    }]
  }
}, {
  id: 'WindowLevelRegion',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'icon-tool-window-region',
    label: i18next/* default */.A.t('Buttons:Window Level Region'),
    tooltip: i18next/* default */.A.t('Buttons:Window Level Region'),
    commands: setToolActiveToolbar,
    evaluate: [{
      name: 'evaluate.cornerstoneTool',
      hideWhenDisabled: true
    }, {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video']
    }]
  }
}, {
  id: 'Length',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-length',
    label: i18next/* default */.A.t('Buttons:Length'),
    tooltip: i18next/* default */.A.t('Buttons:Length Tool'),
    commands: setToolActiveToolbar,
    evaluate: {
      name: 'evaluate.cornerstoneTool',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'Bidirectional',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-bidirectional',
    label: i18next/* default */.A.t('Buttons:Bidirectional'),
    tooltip: i18next/* default */.A.t('Buttons:Bidirectional Tool'),
    commands: setToolActiveToolbar,
    evaluate: {
      name: 'evaluate.cornerstoneTool',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'ArrowAnnotate',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-annotate',
    label: i18next/* default */.A.t('Buttons:Annotation'),
    tooltip: i18next/* default */.A.t('Buttons:Arrow Annotate'),
    commands: setToolActiveToolbar,
    evaluate: {
      name: 'evaluate.cornerstoneTool',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'EllipticalROI',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-ellipse',
    label: i18next/* default */.A.t('Buttons:Ellipse'),
    tooltip: i18next/* default */.A.t('Buttons:Ellipse ROI'),
    commands: setToolActiveToolbar,
    evaluate: {
      name: 'evaluate.cornerstoneTool',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'RectangleROI',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-rectangle',
    label: i18next/* default */.A.t('Buttons:Rectangle'),
    tooltip: i18next/* default */.A.t('Buttons:Rectangle ROI'),
    commands: setToolActiveToolbar,
    evaluate: {
      name: 'evaluate.cornerstoneTool',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'CircleROI',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-circle',
    label: i18next/* default */.A.t('Buttons:Circle'),
    tooltip: i18next/* default */.A.t('Buttons:Circle Tool'),
    commands: setToolActiveToolbar,
    evaluate: {
      name: 'evaluate.cornerstoneTool',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'PlanarFreehandROI',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'icon-tool-freehand-roi',
    label: i18next/* default */.A.t('Buttons:Freehand ROI'),
    tooltip: i18next/* default */.A.t('Buttons:Freehand ROI'),
    commands: setToolActiveToolbar,
    evaluate: {
      name: 'evaluate.cornerstoneTool',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'SplineROI',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'icon-tool-spline-roi',
    label: i18next/* default */.A.t('Buttons:Spline ROI'),
    tooltip: i18next/* default */.A.t('Buttons:Spline ROI'),
    commands: setToolActiveToolbar,
    evaluate: {
      name: 'evaluate.cornerstoneTool',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'LivewireContour',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'icon-tool-livewire',
    label: i18next/* default */.A.t('Buttons:Livewire tool'),
    tooltip: i18next/* default */.A.t('Buttons:Livewire tool'),
    commands: setToolActiveToolbar,
    evaluate: {
      name: 'evaluate.cornerstoneTool',
      hideWhenDisabled: true
    }
  }
},
// Window Level
{
  id: 'WindowLevel',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-window-level',
    label: i18next/* default */.A.t('Buttons:Window Level'),
    commands: setToolActiveToolbar,
    evaluate: [{
      name: 'evaluate.cornerstoneTool',
      hideWhenDisabled: true
    }, {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['wholeSlide']
    }]
  }
}, {
  id: 'Pan',
  uiType: 'ohif.toolButton',
  props: {
    type: 'tool',
    icon: 'tool-move',
    label: i18next/* default */.A.t('Buttons:Pan'),
    commands: setToolActiveToolbar,
    // ECG patch: use the `evaluate.cornerstoneOrEcgTool` evaluator
    // registered by @ohif/extension-dicom-ecg. The default
    // `evaluate.cornerstoneTool` evaluator marks the button disabled
    // (and hides it, given `hideWhenDisabled: true`) on viewports
    // with no Cornerstone3D tool group, which kills the Pan button
    // on ECG viewports. The replacement evaluator keeps the existing
    // behaviour on cornerstone viewports AND keeps the button visible
    // + active-highlighted on ECG viewports. The matching
    // `setToolActiveToolbar` override in the dicom-ecg
    // commandsModule routes the click into an ECG-side drag-pan.
    evaluate: {
      name: 'evaluate.cornerstoneOrEcgTool',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'Zoom',
  uiType: 'ohif.toolButton',
  props: {
    type: 'tool',
    icon: 'tool-zoom',
    label: i18next/* default */.A.t('Buttons:Zoom'),
    commands: setToolActiveToolbar,
    // ECG patch: see the matching comment on the Pan button above -
    // same reasoning, mapped to the ECG-side drag-zoom interaction.
    evaluate: {
      name: 'evaluate.cornerstoneOrEcgTool',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'TrackballRotate',
  uiType: 'ohif.toolButton',
  props: {
    type: 'tool',
    icon: 'tool-3d-rotate',
    label: i18next/* default */.A.t('Buttons:3D Rotate'),
    commands: setToolActiveToolbar,
    evaluate: {
      name: 'evaluate.cornerstoneTool',
      hideWhenDisabled: true,
      disabledText: i18next/* default */.A.t('Buttons:Select a 3D viewport to enable this tool')
    }
  }
}, {
  id: 'Capture',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-capture',
    label: i18next/* default */.A.t('Buttons:Capture'),
    commands: 'showDownloadViewportModal',
    evaluate: ['evaluate.action', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video', 'wholeSlide']
    }]
  }
}, {
  id: 'VLMAnalyzer',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'icon-magic-wand',
    label: 'VLM Analyzer',
    tooltip: 'Vision Language Model Analyzer',
    commands: 'showDownloadVLMViewportModal',
    evaluate: ['evaluate.action', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video']
    }]
  }
}, {
  id: 'Layout',
  uiType: 'ohif.layoutSelector',
  props: {
    rows: 3,
    columns: 4,
    evaluate: 'evaluate.action'
  }
}, {
  id: 'Crosshairs',
  uiType: 'ohif.toolButton',
  props: {
    type: 'tool',
    icon: 'tool-crosshair',
    label: i18next/* default */.A.t('Buttons:Crosshairs'),
    commands: {
      commandName: 'setToolActiveToolbar',
      commandOptions: {
        toolGroupIds: ['mpr']
      }
    },
    evaluate: {
      name: 'evaluate.cornerstoneTool',
      hideWhenDisabled: true,
      disabledText: i18next/* default */.A.t('Buttons:Select an MPR viewport to enable this tool')
    }
  }
}, {
  id: 'SegmentLabelTool',
  uiType: 'ohif.toolBoxButton',
  props: {
    icon: 'tool-segment-label',
    label: i18next/* default */.A.t('Buttons:Segment Label Display'),
    tooltip: i18next/* default */.A.t('Buttons:Click to show or hide segment labels when hovering with your mouse.'),
    commands: {
      commandName: 'toggleSegmentLabel'
    },
    evaluate: ['evaluate.cornerstoneTool.toggle', {
      name: 'evaluate.cornerstone.hasSegmentation'
    }]
  }
},
// {
//   id: 'Undo',
//   uiType: 'ohif.toolButton',
//   props: {
//     type: 'tool',
//     icon: 'prev-arrow',
//     label: 'Undo',
//     commands: {
//       commandName: 'undo',
//     },
//     evaluate: 'evaluate.action',
//   },
// },
// {
//   id: 'Redo',
//   uiType: 'ohif.toolButton',
//   props: {
//     type: 'tool',
//     icon: 'next-arrow',
//     label: 'Redo',
//     commands: {
//       commandName: 'redo',
//     },
//     evaluate: 'evaluate.action',
//   },
// },
// ---------------------------------------------------------------
// ECG-only dropdown (registered by @ohif/extension-dicom-ecg).
//
// The ECG viewport doesn't share Cornerstone3D's tool group
// mechanism, so it can't reuse the Length / Bidirectional / etc.
// toolbar buttons. Instead we ship a single section button (a
// dropdown) that hides on cornerstone viewports and reveals
// ECG-native calipers (Time / Amplitude) on ECG viewports.
//
// Undo / Redo / Reset / Capture are intentionally NOT duplicated
// here. The dicom-ecg extension's commands module overrides the
// standard `undo`, `redo`, `resetViewport` and
// `showDownloadViewportModal` commands so the existing OHIF
// header Undo / Redo buttons, the Reset entry in MoreTools, and
// the Capture button in the primary section all become
// ECG-aware automatically.
// ---------------------------------------------------------------
{
  id: 'EcgTools',
  uiType: 'ohif.toolButtonList',
  props: {
    buttonSection: true,
    // The OHIF ToolbarService.ts patch shipped alongside this
    // mode (`viewers_platform_core_ToolbarService.ts.ecg.patch`)
    // teaches section buttons to honour `evaluate` +
    // `hideWhenDisabled`, so this dropdown disappears entirely
    // when no ECG viewport is active.
    evaluate: {
      name: 'evaluate.ecgViewport',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'EcgTimeCaliper',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-length',
    label: 'Time',
    tooltip: 'ECG time caliper - drag horizontally to measure Δt and bpm',
    commands: {
      commandName: 'setEcgTool',
      commandOptions: {
        tool: 'time-caliper'
      }
    },
    evaluate: {
      name: 'evaluate.ecgTool',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'EcgAmplitudeCaliper',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-bidirectional',
    label: 'Amplitude',
    tooltip: 'ECG amplitude caliper - drag vertically to measure ΔmV',
    commands: {
      commandName: 'setEcgTool',
      commandOptions: {
        tool: 'amplitude-caliper'
      }
    },
    evaluate: {
      name: 'evaluate.ecgTool',
      hideWhenDisabled: true
    }
  }
}];
/* harmony default export */ const src_toolbarButtons = (toolbarButtons);
;// ../../../modes/basic/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/mode-basic"}');
;// ../../../modes/basic/src/id.js

const id = package_namespaceObject.UU;

;// ../../../modes/basic/src/index.tsx





const {
  TOOLBAR_SECTIONS
} = src.ToolbarService;
const {
  structuredCloneWithFunctions
} = src.utils;

/**
 * Define non-imaging modalities.
 * This can be used to exclude modes which have only these modalities,
 * or it can be used to not display thumbnails for some of these.
 * This list used to include SM, for whole slide imaging, but this is now supported
 * by cornerstone.  Others of these may get added.
 */
const NON_IMAGE_MODALITIES = ['SEG', 'RTSTRUCT', 'RTPLAN', 'PR', 'SR'];
const ohif = {
  layout: '@ohif/extension-default.layoutTemplateModule.viewerLayout',
  sopClassHandler: '@ohif/extension-default.sopClassHandlerModule.stack',
  thumbnailList: '@ohif/extension-default.panelModule.seriesList',
  hangingProtocol: '@ohif/extension-default.hangingProtocolModule.default',
  wsiSopClassHandler: '@ohif/extension-cornerstone.sopClassHandlerModule.DicomMicroscopySopClassHandler'
};
const cornerstone = {
  measurements: '@ohif/extension-cornerstone.panelModule.panelMeasurement',
  labelMapSegmentationPanel: '@ohif/extension-cornerstone.panelModule.panelSegmentationWithToolsLabelMap',
  contourSegmentationPanel: '@ohif/extension-cornerstone.panelModule.panelSegmentationWithToolsContour',
  segmentation: '@ohif/extension-cornerstone.panelModule.panelSegmentation',
  viewport: '@ohif/extension-cornerstone.viewportModule.cornerstone'
};
const dicomsr = {
  sopClassHandler: '@ohif/extension-cornerstone-dicom-sr.sopClassHandlerModule.dicom-sr',
  sopClassHandler3D: '@ohif/extension-cornerstone-dicom-sr.sopClassHandlerModule.dicom-sr-3d',
  viewport: '@ohif/extension-cornerstone-dicom-sr.viewportModule.dicom-sr'
};
const dicomvideo = {
  sopClassHandler: '@ohif/extension-dicom-video.sopClassHandlerModule.dicom-video',
  viewport: '@ohif/extension-dicom-video.viewportModule.dicom-video'
};
const dicompdf = {
  sopClassHandler: '@ohif/extension-dicom-pdf.sopClassHandlerModule.dicom-pdf',
  viewport: '@ohif/extension-dicom-pdf.viewportModule.dicom-pdf'
};
const dicomecg = {
  sopClassHandler: '@ohif/extension-dicom-ecg.sopClassHandlerModule.dicom-ecg',
  viewport: '@ohif/extension-dicom-ecg.viewportModule.dicom-ecg'
};
const dicomSeg = {
  sopClassHandler: '@ohif/extension-cornerstone-dicom-seg.sopClassHandlerModule.dicom-seg',
  viewport: '@ohif/extension-cornerstone-dicom-seg.viewportModule.dicom-seg'
};
const dicomPmap = {
  sopClassHandler: '@ohif/extension-cornerstone-dicom-pmap.sopClassHandlerModule.dicom-pmap',
  viewport: '@ohif/extension-cornerstone-dicom-pmap.viewportModule.dicom-pmap'
};
const dicomRT = {
  viewport: '@ohif/extension-cornerstone-dicom-rt.viewportModule.dicom-rt',
  sopClassHandler: '@ohif/extension-cornerstone-dicom-rt.sopClassHandlerModule.dicom-rt'
};
const segmentation = {
  sopClassHandler: '@ohif/extension-cornerstone-dicom-seg.sopClassHandlerModule.dicom-seg',
  viewport: '@ohif/extension-cornerstone-dicom-seg.viewportModule.dicom-seg'
};
const extensionDependencies = {
  // Can derive the versions at least process.env.from npm_package_version
  '@ohif/extension-default': '^3.0.0',
  '@ohif/extension-cornerstone': '^3.0.0',
  '@ohif/extension-cornerstone-dicom-sr': '^3.0.0',
  '@ohif/extension-cornerstone-dicom-seg': '^3.0.0',
  '@ohif/extension-cornerstone-dicom-pmap': '^3.0.0',
  '@ohif/extension-cornerstone-dicom-rt': '^3.0.0',
  '@ohif/extension-dicom-pdf': '^3.0.1',
  '@ohif/extension-dicom-video': '^3.0.1',
  '@ohif/extension-dicom-ecg': '^1.0.0'
};
const sopClassHandlers = [dicomvideo.sopClassHandler, dicomSeg.sopClassHandler, dicomPmap.sopClassHandler, ohif.sopClassHandler, ohif.wsiSopClassHandler, dicompdf.sopClassHandler, dicomsr.sopClassHandler3D, dicomsr.sopClassHandler, dicomecg.sopClassHandler, dicomRT.sopClassHandler];

/**
 * Indicate this is a valid mode if:
 *   - it contains at least one of the modeModalities
 *   - it contains all of the array value in modeModalities
 * Otherwise, if modeModalities is not defined:
 *   - it contains at least one modality other than the nonModeMOdalities.
 */
function isValidMode({
  modalities
}) {
  const modalities_list = modalities.split('\\');
  if (this.modeModalities?.length) {
    for (const modeModality of this.modeModalities) {
      if (Array.isArray(modeModality) && modeModality.every(m => modalities.indexOf(m) !== -1)) {
        return {
          valid: true,
          description: `Matches ${modeModality.join(', ')}`
        };
      } else if (modalities.indexOf(modeModality)) {
        return {
          valid: true,
          description: `Matches ${modeModality}`
        };
      }
    }
    return {
      valid: false,
      description: `None of the mode modalities match: ${JSON.stringify(this.modeModalities)}`
    };
  }
  return {
    valid: !!modalities_list.find(modality => this.nonModeModalities.indexOf(modality) === -1),
    description: `The mode does not support studies that ONLY include the following modalities: ${this.nonModeModalities.join(', ')}`
  };
}
function onModeEnter({
  servicesManager,
  extensionManager,
  commandsManager,
  panelService,
  segmentationService
}) {
  const {
    measurementService,
    toolbarService,
    toolGroupService,
    customizationService
  } = servicesManager.services;
  measurementService.clearMeasurements();

  // Init Default and SR ToolGroups
  src_initToolGroups(extensionManager, toolGroupService, commandsManager);
  toolbarService.register(this.toolbarButtons);
  for (const [key, section] of Object.entries(this.toolbarSections)) {
    toolbarService.updateSection(key, section);
  }
  if (!this.enableSegmentationEdit) {
    customizationService.setCustomizations({
      'panelSegmentation.disableEditing': {
        $set: true
      }
    });
  }

  // // ActivatePanel event trigger for when a segmentation or measurement is added.
  // // Do not force activation so as to respect the state the user may have left the UI in.
  if (this.activatePanelTrigger) {
    this._activatePanelTriggersSubscriptions = [...panelService.addActivatePanelTriggers(cornerstone.segmentation, [{
      sourcePubSubService: segmentationService,
      sourceEvents: [segmentationService.EVENTS.SEGMENTATION_ADDED]
    }], true), ...panelService.addActivatePanelTriggers(cornerstone.measurements, [{
      sourcePubSubService: measurementService,
      sourceEvents: [measurementService.EVENTS.MEASUREMENT_ADDED, measurementService.EVENTS.RAW_MEASUREMENT_ADDED]
    }], true), true];
  }
}
function onModeExit({
  servicesManager
}) {
  const {
    toolGroupService,
    syncGroupService,
    segmentationService,
    cornerstoneViewportService,
    uiDialogService,
    uiModalService
  } = servicesManager.services;
  this._activatePanelTriggersSubscriptions.forEach(sub => sub.unsubscribe());
  this._activatePanelTriggersSubscriptions.length = 0;
  uiDialogService.hideAll();
  uiModalService.hide();
  toolGroupService.destroy();
  syncGroupService.destroy();
  segmentationService.destroy();
  cornerstoneViewportService.destroy();
}
const toolbarSections = {
  [TOOLBAR_SECTIONS.primary]: [
  // Single ECG-specific dropdown. Sits at the LEFT of the primary
  // toolbar so the calipers are the first affordance the user
  // reaches when an ECG viewport is active. Hidden by
  // `evaluate.ecgViewport` (combined with the ToolbarService.ts
  // patch shipped in this repo) when no ECG viewport is active.
  // Children are defined below in the `EcgTools` subsection.
  'EcgTools', 'MeasurementTools', 'Zoom', 'Pan', 'TrackballRotate', 'WindowLevel', 'Capture', 'VLMAnalyzer', 'Layout', 'Crosshairs', 'MoreTools'],
  // Items shown when the user opens the EcgTools dropdown. We don't
  // ship a separate Capture / Reset / Undo / Redo entry here: the
  // dicom-ecg extension overrides the standard OHIF commands so the
  // built-in header Undo / Redo, the Reset entry in MoreTools, and
  // the primary-section Capture button all become ECG-aware.
  EcgTools: ['EcgTimeCaliper', 'EcgAmplitudeCaliper'],
  [TOOLBAR_SECTIONS.viewportActionMenu.topLeft]: ['orientationMenu', 'dataOverlayMenu'],
  [TOOLBAR_SECTIONS.viewportActionMenu.bottomMiddle]: ['AdvancedRenderingControls'],
  AdvancedRenderingControls: ['windowLevelMenuEmbedded', 'voiManualControlMenu', 'Colorbar', 'opacityMenu', 'thresholdMenu'],
  [TOOLBAR_SECTIONS.viewportActionMenu.topRight]: ['modalityLoadBadge', 'trackingStatus', 'navigationComponent'],
  [TOOLBAR_SECTIONS.viewportActionMenu.bottomLeft]: ['windowLevelMenu'],
  MeasurementTools: ['Length', 'Bidirectional', 'ArrowAnnotate', 'EllipticalROI', 'RectangleROI', 'CircleROI', 'PlanarFreehandROI', 'SplineROI', 'LivewireContour'],
  MoreTools: ['Reset', 'rotate-right', 'flipHorizontal', 'ImageSliceSync', 'ReferenceLines', 'ImageOverlayViewer', 'StackScroll', 'invert', 'Probe', 'Cine', 'Angle', 'CobbAngle', 'Magnify', 'CalibrationLine', 'TagBrowser', 'AdvancedMagnify', 'UltrasoundDirectionalTool', 'WindowLevelRegion', 'SegmentLabelTool']
};
const basicLayout = {
  id: ohif.layout,
  props: {
    leftPanels: [ohif.thumbnailList],
    leftPanelResizable: true,
    rightPanels: [cornerstone.segmentation, cornerstone.measurements],
    rightPanelClosed: true,
    rightPanelResizable: true,
    viewports: [{
      namespace: cornerstone.viewport,
      displaySetsToDisplay: [ohif.sopClassHandler, dicomvideo.sopClassHandler, ohif.wsiSopClassHandler]
    }, {
      namespace: dicomsr.viewport,
      displaySetsToDisplay: [dicomsr.sopClassHandler, dicomsr.sopClassHandler3D]
    }, {
      namespace: dicompdf.viewport,
      displaySetsToDisplay: [dicompdf.sopClassHandler]
    }, {
      namespace: dicomecg.viewport,
      displaySetsToDisplay: [dicomecg.sopClassHandler]
    }, {
      namespace: dicomSeg.viewport,
      displaySetsToDisplay: [dicomSeg.sopClassHandler]
    }, {
      namespace: dicomPmap.viewport,
      displaySetsToDisplay: [dicomPmap.sopClassHandler]
    }, {
      namespace: dicomRT.viewport,
      displaySetsToDisplay: [dicomRT.sopClassHandler]
    }]
  }
};
function layoutTemplate() {
  return structuredCloneWithFunctions(this.layoutInstance);
}
const basicRoute = {
  path: 'basic',
  layoutTemplate,
  layoutInstance: basicLayout
};
const modeInstance = {
  // TODO: We're using this as a route segment
  // We should not be.
  id: id,
  routeName: 'basic',
  // Don't hide this by default - see the registration later to hide the basic
  // instance by default.
  hide: false,
  displayName: 'Non-Longitudinal Basic',
  _activatePanelTriggersSubscriptions: [],
  toolbarSections,
  /**
   * Lifecycle hooks
   */
  onModeEnter,
  onModeExit,
  validationTags: {
    study: [],
    series: []
  },
  isValidMode,
  routes: [basicRoute],
  extensions: extensionDependencies,
  // Default protocol gets self-registered by default in the init
  hangingProtocol: 'default',
  // Order is important in sop class handlers when two handlers both use
  // the same sop class under different situations.  In that case, the more
  // general handler needs to come last.  For this case, the dicomvideo must
  // come first to remove video transfer syntax before ohif uses images
  sopClassHandlers,
  toolbarButtons: src_toolbarButtons,
  enableSegmentationEdit: false,
  nonModeModalities: NON_IMAGE_MODALITIES
};

/**
 * Creates a mode on this object, using immutability-helper to apply changes
 * from modeConfiguration into the modeInstance.
 */
function modeFactory({
  modeConfiguration
}) {
  let modeInstance = this.modeInstance;
  if (modeConfiguration) {
    modeInstance = immutability_helper_default()(modeInstance, modeConfiguration);
  }
  return modeInstance;
}
const mode = {
  id: id,
  modeFactory,
  modeInstance: {
    ...modeInstance,
    hide: true
  },
  extensionDependencies
};
/* harmony default export */ const basic_src = (mode);


/***/ }

}]);