"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[7639],{

/***/ 47639:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ src)
});

;// ../../../modes/preclinical-4d/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/mode-preclinical-4d"}');
;// ../../../modes/preclinical-4d/src/id.js

const id = package_namespaceObject.UU;

;// ../../../modes/preclinical-4d/src/getWorkflowSettings.ts
const dynamicVolume = {
  sopClassHandler: '@ohif/extension-cornerstone-dynamic-volume.sopClassHandlerModule.dynamic-volume',
  leftPanel: '@ohif/extension-cornerstone-dynamic-volume.panelModule.dynamic-volume',
  segmentation: '@ohif/extension-cornerstone-dynamic-volume.panelModule.dynamic-segmentation'
};
const cornerstone = {
  segmentation: '@ohif/extension-cornerstone.panelModule.panelSegmentationNoHeader',
  activeViewportWindowLevel: '@ohif/extension-cornerstone.panelModule.activeViewportWindowLevel'
};
function getDefaultButtons({
  toolbarService
}) {
  return [{
    buttonSection: toolbarService.sections.primary,
    buttons: ['MeasurementTools', 'Zoom', 'WindowLevel', 'Crosshairs', 'Pan']
  }, {
    buttonSection: 'MeasurementTools',
    buttons: ['Length', 'Bidirectional', 'ArrowAnnotate', 'EllipticalROI']
  }];
}
function getROIThresholdToolbox({
  toolbarService
}) {
  return [{
    buttonSection: toolbarService.sections.dynamicToolbox,
    buttons: ['SegmentationTools']
  }, {
    buttonSection: 'SegmentationTools',
    buttons: ['BrushTools', 'RectangleROIStartEndThreshold']
  }, {
    buttonSection: 'BrushTools',
    buttons: ['Brush', 'Eraser', 'Threshold']
  }];
}
const defaultLeftPanel = [[dynamicVolume.leftPanel, cornerstone.activeViewportWindowLevel]];
const defaultLayout = {
  panels: {
    left: defaultLeftPanel,
    right: []
  }
};
function getWorkflowSettings({
  servicesManager
}) {
  const {
    toolbarService
  } = servicesManager.services;
  const defaultButtons = getDefaultButtons({
    toolbarService
  });
  const ROIThresholdToolbox = getROIThresholdToolbox({
    toolbarService
  });
  return {
    steps: [{
      id: 'dataPreparation',
      name: 'Data Preparation',
      layout: {
        panels: {
          left: defaultLeftPanel
        }
      },
      toolbarButtons: defaultButtons,
      hangingProtocol: {
        protocolId: 'default4D',
        stageId: 'dataPreparation'
      },
      info: 'In the Data Preparation step, you can visualize the dynamic PT volume data in three orthogonal views: axial, sagittal, and coronal. Use the left panel controls to adjust the visualization settings, such as playback speed, or navigate between different frames. This step allows you to assess the quality of the PT data and prepare for further analysis or registration with other modalities.'
    }, {
      id: 'registration',
      name: 'Registration',
      layout: defaultLayout,
      toolbarButtons: defaultButtons,
      hangingProtocol: {
        protocolId: 'default4D',
        stageId: 'registration'
      },
      info: 'The Registration step provides a comprehensive view of the CT, PT, and fused CT-PT volume data in multiple orientations. The fusion viewports display the CT and PT volumes overlaid, allowing you to visually assess the alignment and registration between the two modalities. The individual CT and PT viewports are also available for side-by-side comparison. This step is crucial for ensuring proper registration before proceeding with further analysis or quantification.'
    }, {
      id: 'roiQuantification',
      name: 'ROI Quantification',
      layout: {
        panels: {
          left: defaultLeftPanel,
          right: [[dynamicVolume.segmentation]]
        },
        options: {
          leftPanelClosed: false,
          rightPanelClosed: false
        }
      },
      toolbarButtons: [...defaultButtons, ...ROIThresholdToolbox],
      hangingProtocol: {
        protocolId: 'default4D',
        stageId: 'roiQuantification'
      },
      info: 'The ROI quantification step allows you to define regions of interest (ROIs) with labelmap segmentations, on the fused CT-PT volume data using the labelmap tools. The left panel provides controls for adjusting the dynamic volume visualization, while the right panel offers tools for segmentation, editing, and exporting the ROI data. This step enables you to quantify the uptake or other measures within the defined ROIs for further analysis.'
    }, {
      id: 'kineticAnalysis',
      name: 'Kinetic Analysis',
      layout: defaultLayout,
      toolbarButtons: defaultButtons,
      hangingProtocol: {
        protocolId: 'default4D',
        stageId: 'kineticAnalysis'
      },
      onEnter: [{
        commandName: 'updateSegmentationsChartDisplaySet',
        options: {
          servicesManager
        }
      }],
      info: 'The Kinetic Analysis step provides a comprehensive view for visualizing and analyzing the dynamic data derived from the ROI segmentations. The fusion viewports display the combined CT-PT volume data, while a dedicated viewport shows a series chart representing the data over time. This step allows you to explore the temporal dynamics of the uptake or other kinetic measures within the defined regions of interest, enabling further quantitative analysis and modeling.'
    }]
  };
}

;// ../../../modes/preclinical-4d/src/initWorkflowSteps.ts

function initWorkflowSteps({
  servicesManager
}) {
  const {
    workflowStepsService
  } = servicesManager.services;
  const workflowSettings = getWorkflowSettings({
    servicesManager
  });
  workflowStepsService.addWorkflowSteps(workflowSettings.steps);
  workflowStepsService.setActiveWorkflowStep(workflowSettings.steps[0].id);
}
;// ../../../modes/preclinical-4d/src/initToolGroups.tsx
const toolGroupIds = {
  default: 'dynamic4D-default',
  PT: 'dynamic4D-pt',
  Fusion: 'dynamic4D-fusion',
  CT: 'dynamic4D-ct'
};
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
function _initToolGroups(toolNames, Enums, toolGroupService, commandsManager, servicesManager) {
  const {
    cornerstoneViewportService
  } = servicesManager.services;
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
      toolName: toolNames.SegmentBidirectional
    }, {
      toolName: toolNames.ArrowAnnotate
    }, {
      toolName: toolNames.Bidirectional
    }, {
      toolName: toolNames.Probe
    }, {
      toolName: toolNames.EllipticalROI
    }, {
      toolName: toolNames.RectangleROI
    }, {
      toolName: toolNames.RectangleROIThreshold
    }, {
      toolName: toolNames.RectangleScissors
    }, {
      toolName: toolNames.PaintFill
    }, {
      toolName: toolNames.StackScroll
    }, {
      toolName: toolNames.Magnify
    }, {
      toolName: 'CircularBrush',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'FILL_INSIDE_CIRCLE',
        brushSize: 7
      }
    }, {
      toolName: 'CircularEraser',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'ERASE_INSIDE_CIRCLE',
        brushSize: 7
      }
    }, {
      toolName: 'SphereBrush',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'FILL_INSIDE_SPHERE',
        brushSize: 7
      }
    }, {
      toolName: 'SphereEraser',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'ERASE_INSIDE_SPHERE',
        brushSize: 7
      }
    }, {
      toolName: 'ThresholdCircularBrush',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'THRESHOLD_INSIDE_CIRCLE',
        brushSize: 7
      }
    }, {
      toolName: 'ThresholdSphereBrush',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'THRESHOLD_INSIDE_SPHERE',
        brushSize: 7
      }
    }, {
      toolName: toolNames.CircleScissors
    }, {
      toolName: toolNames.RectangleScissors
    }, {
      toolName: toolNames.SphereScissors
    }, {
      toolName: toolNames.StackScroll
    }, {
      toolName: toolNames.Magnify
    }],
    enabled: [],
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
    }]
  };
  toolGroupService.createToolGroupAndAddTools(toolGroupIds.PT, {
    ...tools,
    passive: [...tools.passive, {
      toolName: 'RectangleROIStartEndThreshold'
    }]
  });
  toolGroupService.createToolGroupAndAddTools(toolGroupIds.CT, {
    ...tools,
    passive: [...tools.passive, {
      toolName: 'RectangleROIStartEndThreshold'
    }]
  });
  toolGroupService.createToolGroupAndAddTools(toolGroupIds.Fusion, {
    ...tools,
    passive: [...tools.passive, {
      toolName: 'RectangleROIStartEndThreshold'
    }]
  });
  toolGroupService.createToolGroupAndAddTools(toolGroupIds.default, tools);
}
function initToolGroups({
  toolNames,
  Enums,
  toolGroupService,
  commandsManager,
  servicesManager
}) {
  _initToolGroups(toolNames, Enums, toolGroupService, commandsManager, servicesManager);
}

;// ../../../modes/preclinical-4d/src/toolbarButtons.tsx

const setToolActiveToolbar = {
  commandName: 'setToolActiveToolbar',
  commandOptions: {
    toolGroupIds: [toolGroupIds.PT, toolGroupIds.CT, toolGroupIds.Fusion, toolGroupIds.default]
  }
};
const callbacks = toolName => [{
  commandName: 'setViewportForToolConfiguration',
  commandOptions: {
    toolName
  }
}];
const toolbarButtons = [{
  id: 'MeasurementTools',
  uiType: 'ohif.toolButtonList',
  props: {
    buttonSection: true
  }
}, {
  id: 'BrushTools',
  uiType: 'ohif.toolBoxButtonGroup',
  props: {
    buttonSection: true
  }
}, {
  id: 'SegmentationTools',
  uiType: 'ohif.toolBoxButton',
  props: {
    buttonSection: true
  }
}, {
  id: 'AdvancedRenderingControls',
  uiType: 'ohif.advancedRenderingControls',
  props: {
    buttonSection: true
  }
}, {
  id: 'modalityLoadBadge',
  uiType: 'ohif.modalityLoadBadge',
  props: {
    icon: 'Status',
    label: 'Status',
    tooltip: 'Status',
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
    label: 'Navigation',
    tooltip: 'Navigate between segments/measurements and manage their visibility',
    evaluate: {
      name: 'evaluate.navigationComponent',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'windowLevelMenuEmbedded',
  uiType: 'ohif.windowLevelMenuEmbedded',
  props: {
    icon: 'WindowLevel',
    label: 'Window Level',
    tooltip: 'Adjust window/level presets and customize image contrast settings',
    evaluate: {
      name: 'evaluate.windowLevelMenuEmbedded',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'trackingStatus',
  uiType: 'ohif.trackingStatus',
  props: {
    icon: 'TrackingStatus',
    label: 'Tracking Status',
    tooltip: 'View and manage tracking status of measurements and annotations',
    evaluate: {
      name: 'evaluate.trackingStatus',
      hideWhenDisabled: true
    }
  }
}, {
  id: 'Length',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-length',
    label: 'Length',
    tooltip: 'Length Tool',
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'Bidirectional',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-bidirectional',
    label: 'Bidirectional',
    tooltip: 'Bidirectional Tool',
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'ArrowAnnotate',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-annotate',
    label: 'Annotation',
    tooltip: 'Arrow Annotate',
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'EllipticalROI',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-ellipse',
    label: 'Ellipse',
    tooltip: 'Ellipse ROI',
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'Zoom',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-zoom',
    label: 'Zoom',
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'WindowLevel',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-window-level',
    label: 'Window Level',
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'Pan',
  uiType: 'ohif.toolButton',
  props: {
    type: 'tool',
    icon: 'tool-move',
    label: 'Pan',
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'TrackballRotate',
  uiType: 'ohif.toolButton',
  props: {
    type: 'tool',
    icon: 'tool-3d-rotate',
    label: '3D Rotate',
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'Capture',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-capture',
    label: 'Capture',
    commands: 'showDownloadViewportModal',
    evaluate: ['evaluate.action', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['video', 'wholeSlide']
    }]
  }
}, {
  id: 'Layout',
  uiType: 'ohif.layoutSelector',
  props: {
    rows: 3,
    columns: 4,
    evaluate: 'evaluate.action',
    commands: 'setViewportGridLayout'
  }
}, {
  id: 'Crosshairs',
  uiType: 'ohif.toolButton',
  props: {
    type: 'tool',
    icon: 'tool-crosshair',
    label: 'Crosshairs',
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'ProgressDropdown',
  uiType: 'ohif.progressDropdown'
}, {
  id: 'RectangleROIStartEndThreshold',
  uiType: 'ohif.toolBoxButton',
  props: {
    icon: 'tool-create-threshold',
    label: 'Rectangle ROI Threshold',
    commands: setToolActiveToolbar,
    evaluate: {
      name: 'evaluate.cornerstone.segmentation',
      toolNames: ['RectangleROIStartEndThreshold']
    },
    options: 'tmtv.RectangleROIThresholdOptions'
  }
}, {
  id: 'Brush',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'icon-tool-brush',
    label: 'Brush',
    evaluate: {
      name: 'evaluate.cornerstone.segmentation',
      toolNames: ['CircularBrush', 'SphereBrush']
    },
    options: [{
      name: 'Size (mm)',
      id: 'brush-radius',
      type: 'range',
      min: 0.5,
      max: 99.5,
      step: 0.5,
      value: 7,
      commands: {
        commandName: 'setBrushSize',
        commandOptions: {
          toolNames: ['CircularBrush', 'SphereBrush']
        }
      }
    }, {
      name: 'Shape',
      type: 'radio',
      id: 'brush-mode',
      value: 'CircularBrush',
      values: [{
        value: 'CircularBrush',
        label: 'Circle'
      }, {
        value: 'SphereBrush',
        label: 'Sphere'
      }],
      commands: 'setToolActiveToolbar'
    }]
  }
}, {
  id: 'Eraser',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'icon-tool-eraser',
    label: 'Eraser',
    evaluate: {
      name: 'evaluate.cornerstone.segmentation',
      toolNames: ['CircularEraser', 'SphereEraser']
    },
    options: [{
      name: 'Radius (mm)',
      id: 'eraser-radius',
      type: 'range',
      min: 0.5,
      max: 99.5,
      step: 0.5,
      value: 7,
      commands: {
        commandName: 'setBrushSize',
        commandOptions: {
          toolNames: ['CircularEraser', 'SphereEraser']
        }
      }
    }, {
      name: 'Shape',
      type: 'radio',
      id: 'eraser-mode',
      value: 'CircularEraser',
      values: [{
        value: 'CircularEraser',
        label: 'Circle'
      }, {
        value: 'SphereEraser',
        label: 'Sphere'
      }],
      commands: 'setToolActiveToolbar'
    }]
  }
}, {
  id: 'Threshold',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'icon-tool-threshold',
    label: 'Threshold',
    evaluate: {
      name: 'evaluate.cornerstone.segmentation',
      toolNames: ['ThresholdCircularBrush', 'ThresholdSphereBrush']
    },
    options: [{
      name: 'Radius (mm)',
      id: 'threshold-radius',
      type: 'range',
      min: 0.5,
      max: 99.5,
      step: 0.5,
      value: 7,
      commands: {
        commandName: 'setBrushSize',
        commandOptions: {
          toolNames: ['ThresholdCircularBrush', 'ThresholdSphereBrush']
        }
      }
    }, {
      name: 'Shape',
      type: 'radio',
      id: 'eraser-mode',
      value: 'ThresholdCircularBrush',
      values: [{
        value: 'ThresholdCircularBrush',
        label: 'Circle'
      }, {
        value: 'ThresholdSphereBrush',
        label: 'Sphere'
      }],
      commands: 'setToolActiveToolbar'
    }, {
      name: 'ThresholdRange',
      type: 'double-range',
      id: 'threshold-range',
      min: 0,
      max: 100,
      step: 0.5,
      value: [2, 50],
      commands: {
        commandName: 'setThresholdRange',
        commandOptions: {
          toolNames: ['ThresholdCircularBrush', 'ThresholdSphereBrush']
        }
      }
    }]
  }
}, {
  id: 'Shapes',
  uiType: 'ohif.toolBoxButton',
  props: {
    label: 'Shapes',
    evaluate: {
      name: 'evaluate.cornerstone.segmentation',
      toolNames: ['CircleScissor', 'SphereScissor', 'RectangleScissor']
    },
    icon: 'icon-tool-shape',
    options: [{
      name: 'Shape',
      type: 'radio',
      value: 'CircleScissor',
      id: 'shape-mode',
      values: [{
        value: 'CircleScissor',
        label: 'Circle'
      }, {
        value: 'SphereScissor',
        label: 'Sphere'
      }, {
        value: 'RectangleScissor',
        label: 'Rectangle'
      }],
      commands: 'setToolActiveToolbar'
    }]
  }
}, {
  id: 'dataOverlayMenu',
  uiType: 'ohif.dataOverlayMenu',
  props: {
    icon: 'ViewportViews',
    label: 'Data Overlay',
    tooltip: 'Configure data overlay options and manage foreground/background display sets',
    evaluate: 'evaluate.dataOverlayMenu'
  }
}, {
  id: 'orientationMenu',
  uiType: 'ohif.orientationMenu',
  props: {
    icon: 'OrientationSwitch',
    label: 'Orientation',
    tooltip: 'Change viewport orientation between axial, sagittal, coronal and reformat planes',
    evaluate: {
      name: 'evaluate.orientationMenu'
      // hideWhenDisabled: true,
    }
  }
}, {
  id: 'windowLevelMenu',
  uiType: 'ohif.windowLevelMenu',
  props: {
    icon: 'WindowLevel',
    label: 'Window Level',
    tooltip: 'Adjust window/level presets and customize image contrast settings',
    evaluate: 'evaluate.windowLevelMenu'
  }
}, {
  id: 'voiManualControlMenu',
  uiType: 'ohif.voiManualControlMenu',
  props: {
    icon: 'WindowLevelAdvanced',
    label: 'Advanced Window Level',
    tooltip: 'Advanced window/level settings with manual controls and presets',
    evaluate: 'evaluate.voiManualControlMenu'
  }
}, {
  id: 'thresholdMenu',
  uiType: 'ohif.thresholdMenu',
  props: {
    icon: 'Threshold',
    label: 'Threshold',
    tooltip: 'Image threshold settings',
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
    label: 'Opacity',
    tooltip: 'Image opacity settings',
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
    label: 'Colorbar'
  }
}];
/* harmony default export */ const src_toolbarButtons = (toolbarButtons);
;// ../../../modes/preclinical-4d/src/index.tsx




const extensionDependencies = {
  '@ohif/extension-default': '3.7.0-beta.76',
  '@ohif/extension-cornerstone': '3.7.0-beta.76',
  '@ohif/extension-cornerstone-dynamic-volume': '3.7.0-beta.76',
  '@ohif/extension-cornerstone-dicom-seg': '3.7.0-beta.76',
  '@ohif/extension-tmtv': '3.7.0-beta.76'
};
const ohif = {
  layout: '@ohif/extension-default.layoutTemplateModule.viewerLayout',
  defaultSopClassHandler: '@ohif/extension-default.sopClassHandlerModule.stack',
  chartSopClassHandler: '@ohif/extension-default.sopClassHandlerModule.chart',
  hangingProtocol: '@ohif/extension-default.hangingProtocolModule.default',
  leftPanel: '@ohif/extension-default.panelModule.seriesList',
  chartViewport: '@ohif/extension-default.viewportModule.chartViewport'
};
const src_dynamicVolume = {
  leftPanel: '@ohif/extension-cornerstone-dynamic-volume.panelModule.dynamic-volume'
};
const src_cornerstone = {
  viewport: '@ohif/extension-cornerstone.viewportModule.cornerstone',
  activeViewportWindowLevel: '@ohif/extension-cornerstone.panelModule.activeViewportWindowLevel'
};
function modeFactory({
  modeConfiguration
}) {
  return {
    id: id,
    routeName: 'dynamic-volume',
    displayName: 'Preclinical 4D',
    onModeEnter: function ({
      servicesManager,
      extensionManager,
      commandsManager
    }) {
      const {
        measurementService,
        toolbarService,
        cineService,
        cornerstoneViewportService,
        toolGroupService,
        customizationService,
        viewportGridService
      } = servicesManager.services;
      const utilityModule = extensionManager.getModuleEntry('@ohif/extension-cornerstone.utilityModule.tools');
      const {
        toolNames,
        Enums
      } = utilityModule.exports;
      measurementService.clearMeasurements();
      initToolGroups({
        toolNames,
        Enums,
        toolGroupService,
        commandsManager,
        servicesManager
      });
      toolbarService.register(src_toolbarButtons);
      toolbarService.updateSection(toolbarService.sections.secondary, ['ProgressDropdown']);
      toolbarService.updateSection(toolbarService.sections.viewportActionMenu.topLeft, ['orientationMenu', 'dataOverlayMenu']);
      toolbarService.updateSection(toolbarService.sections.viewportActionMenu.topLeft, ['orientationMenu', 'dataOverlayMenu']);
      toolbarService.updateSection(toolbarService.sections.viewportActionMenu.bottomMiddle, ['AdvancedRenderingControls']);
      toolbarService.updateSection('AdvancedRenderingControls', ['windowLevelMenuEmbedded', 'voiManualControlMenu', 'Colorbar', 'opacityMenu', 'thresholdMenu']);
      toolbarService.updateSection(toolbarService.sections.viewportActionMenu.topRight, ['modalityLoadBadge', 'trackingStatus', 'navigationComponent']);
      toolbarService.updateSection(toolbarService.sections.viewportActionMenu.bottomLeft, ['windowLevelMenu']);

      // the primary button section is created in the workflow steps
      // specific to the step
      customizationService.setCustomizations({
        'panelSegmentation.tableMode': {
          $set: 'expanded'
        },
        'panelSegmentation.onSegmentationAdd': {
          $set: () => {
            commandsManager.run('createNewLabelMapForDynamicVolume');
          }
        },
        'panelSegmentation.showAddSegment': {
          $set: false
        }
      });

      // Auto play the clip initially when the volumes are loaded
      const {
        unsubscribe
      } = cornerstoneViewportService.subscribe(cornerstoneViewportService.EVENTS.VIEWPORT_VOLUMES_CHANGED, () => {
        const viewportId = viewportGridService.getActiveViewportId();
        const csViewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
        cineService.playClip(csViewport.element, {
          viewportId
        });
        // cineService.setIsCineEnabled(true);

        unsubscribe();
      });
    },
    onSetupRouteComplete: ({
      servicesManager
    }) => {
      // This needs to run after hanging protocol matching process because
      // it may change the protocol/stage based on workflow stage settings
      initWorkflowSteps({
        servicesManager
      });
    },
    onModeExit: ({
      servicesManager
    }) => {
      const {
        toolGroupService,
        syncGroupService,
        segmentationService,
        cornerstoneViewportService
      } = servicesManager.services;
      toolGroupService.destroy();
      syncGroupService.destroy();
      segmentationService.destroy();
      cornerstoneViewportService.destroy();
    },
    get validationTags() {
      return {
        study: [],
        series: []
      };
    },
    isValidMode: ({
      modalities,
      study
    }) => {
      // Todo: we need to find a better way to validate the mode
      return {
        valid: study.mrn === 'M1',
        description: 'This mode is only available for 4D PET/CT studies.'
      };
    },
    /**
     * Mode Routes are used to define the mode's behavior. A list of Mode Route
     * that includes the mode's path and the layout to be used. The layout will
     * include the components that are used in the layout. For instance, if the
     * default layoutTemplate is used (id: '@ohif/extension-default.layoutTemplateModule.viewerLayout')
     * it will include the leftPanels, rightPanels, and viewports. However, if
     * you define another layoutTemplate that includes a Footer for instance,
     * you should provide the Footer component here too. Note: We use Strings
     * to reference the component's ID as they are registered in the internal
     * ExtensionManager. The template for the string is:
     * `${extensionId}.{moduleType}.${componentId}`.
     */
    routes: [{
      path: 'preclinical-4d',
      layoutTemplate: ({
        location,
        servicesManager
      }) => {
        return {
          id: ohif.layout,
          props: {
            leftPanels: [[src_dynamicVolume.leftPanel, src_cornerstone.activeViewportWindowLevel]],
            leftPanelResizable: true,
            rightPanels: [],
            rightPanelResizable: true,
            rightPanelClosed: true,
            viewports: [{
              namespace: src_cornerstone.viewport,
              displaySetsToDisplay: [ohif.defaultSopClassHandler]
            }, {
              namespace: ohif.chartViewport,
              displaySetsToDisplay: [ohif.chartSopClassHandler]
            }]
          }
        };
      }
    }],
    extensions: extensionDependencies,
    // Default protocol gets self-registered by default in the init
    hangingProtocol: 'default4D',
    // Order is important in sop class handlers when two handlers both use
    // the same sop class under different situations.  In that case, the more
    // general handler needs to come last.  For this case, the dicomvideo must
    // come first to remove video transfer syntax before ohif uses images
    sopClassHandlers: [ohif.chartSopClassHandler, ohif.defaultSopClassHandler]
  };
}
const mode = {
  id: id,
  modeFactory,
  extensionDependencies
};
/* harmony default export */ const src = (mode);

/***/ })

}]);