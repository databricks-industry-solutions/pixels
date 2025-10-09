"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[2068],{

/***/ 2068:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ monai_label_src)
});

;// CONCATENATED MODULE: ../../../../modes/monai-label/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/mode-monai-label"}');
;// CONCATENATED MODULE: ../../../../modes/monai-label/src/id.js

const id = package_namespaceObject.UU;

// EXTERNAL MODULE: ../../core/src/index.ts + 69 modules
var src = __webpack_require__(62037);
;// CONCATENATED MODULE: ../../../../modes/monai-label/src/toolbarButtons.js

const setToolActiveToolbar = {
  commandName: 'setToolActiveToolbar',
  commandOptions: {
    toolGroupIds: ['default', 'mpr', 'SRToolGroup', 'volume3d']
  }
};
const callbacks = toolName => [{
  commandName: 'setViewportForToolConfiguration',
  commandOptions: {
    toolName
  }
}];
const toolbarButtons = [
// sections
{
  id: 'MoreTools',
  uiType: 'ohif.toolButtonList',
  props: {
    buttonSection: 'moreToolsSection',
    groupId: 'MoreTools'
  }
}, {
  id: 'BrushTools',
  uiType: 'ohif.toolBoxButtonGroup',
  props: {
    groupId: 'BrushTools',
    buttonSection: 'brushToolsSection'
  }
},
// Section containers for the nested toolbox
{
  id: 'SegmentationUtilities',
  uiType: 'ohif.toolBoxButton',
  props: {
    groupId: 'SegmentationUtilities',
    buttonSection: 'segmentationToolboxUtilitySection'
  }
}, {
  id: 'SegmentationTools',
  uiType: 'ohif.toolBoxButton',
  props: {
    groupId: 'SegmentationTools',
    buttonSection: 'segmentationToolboxToolsSection'
  }
},
// tool defs
{
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
    evaluate: {
      name: 'evaluate.cornerstoneTool',
      disabledText: 'Select a 3D viewport to enable this tool'
    }
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
    icon: 'tool-crosshair',
    label: 'Crosshairs',
    commands: {
      commandName: 'setToolActiveToolbar',
      commandOptions: {
        toolGroupIds: ['mpr']
      }
    },
    evaluate: {
      name: 'evaluate.cornerstoneTool',
      disabledText: 'Select an MPR viewport to enable this tool'
    }
  }
}, {
  id: 'Reset',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-reset',
    label: 'Reset View',
    tooltip: 'Reset View',
    commands: 'resetViewport',
    evaluate: 'evaluate.action'
  }
}, {
  id: 'rotate-right',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-rotate-right',
    label: 'Rotate Right',
    tooltip: 'Rotate +90',
    commands: 'rotateViewportCW',
    evaluate: 'evaluate.action'
  }
}, {
  id: 'flipHorizontal',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-flip-horizontal',
    label: 'Flip Horizontal',
    tooltip: 'Flip Horizontally',
    commands: 'flipViewportHorizontal',
    evaluate: ['evaluate.viewportProperties.toggle', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['volume3d']
    }]
  }
}, {
  id: 'ReferenceLines',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-referenceLines',
    label: 'Reference Lines',
    tooltip: 'Show Reference Lines',
    commands: 'toggleEnabledDisabledToolbar',
    evaluate: 'evaluate.cornerstoneTool.toggle'
  }
}, {
  id: 'ImageOverlayViewer',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'toggle-dicom-overlay',
    label: 'Image Overlay',
    tooltip: 'Toggle Image Overlay',
    commands: 'toggleEnabledDisabledToolbar',
    evaluate: 'evaluate.cornerstoneTool.toggle'
  }
}, {
  id: 'StackScroll',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-stack-scroll',
    label: 'Stack Scroll',
    tooltip: 'Stack Scroll',
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'invert',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-invert',
    label: 'Invert',
    tooltip: 'Invert Colors',
    commands: 'invertViewport',
    evaluate: 'evaluate.viewportProperties.toggle'
  }
}, {
  id: 'Cine',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-cine',
    label: 'Cine',
    tooltip: 'Cine',
    commands: 'toggleCine',
    evaluate: ['evaluate.cine', {
      name: 'evaluate.viewport.supported',
      unsupportedViewportTypes: ['volume3d']
    }]
  }
}, {
  id: 'Magnify',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-magnify',
    label: 'Zoom-in',
    tooltip: 'Zoom-in',
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'TagBrowser',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'dicom-tag-browser',
    label: 'Dicom Tag Browser',
    tooltip: 'Dicom Tag Browser',
    commands: 'openDICOMTagViewer'
  }
}, {
  id: 'Brush',
  uiType: 'ohif.toolBoxButton',
  props: {
    icon: 'icon-tool-brush',
    label: 'Brush',
    evaluate: {
      name: 'evaluate.cornerstone.segmentation',
      toolNames: ['CircularBrush', 'SphereBrush'],
      disabledText: 'Create new segmentation to enable this tool.'
    },
    options: [{
      name: 'Radius (mm)',
      id: 'brush-radius',
      type: 'range',
      min: 0.5,
      max: 99.5,
      step: 0.5,
      value: 25,
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
  id: 'InterpolateLabelmap',
  uiType: 'ohif.toolBoxButton',
  props: {
    icon: 'icon-tool-interpolation',
    label: 'Interpolate Labelmap',
    tooltip: 'Automatically fill in missing slices between drawn segments. Use brush or threshold tools on at least two slices, then click to interpolate across slices. Works in any direction. Volume must be reconstructable.',
    evaluate: ['evaluate.cornerstone.segmentation', {
      name: 'evaluate.displaySetIsReconstructable',
      disabledText: 'The current viewport cannot handle interpolation.'
    }],
    commands: 'interpolateLabelmap'
  }
}, {
  id: 'SegmentBidirectional',
  uiType: 'ohif.toolBoxButton',
  props: {
    icon: 'icon-tool-bidirectional-segment',
    label: 'Segment Bidirectional',
    tooltip: 'Automatically detects the largest length and width across slices for the selected segment and displays a bidirectional measurement.',
    evaluate: {
      name: 'evaluate.cornerstone.segmentation',
      disabledText: 'Create new segmentation to enable this tool.'
    },
    commands: 'runSegmentBidirectional'
  }
}, {
  id: 'RegionSegmentPlus',
  uiType: 'ohif.toolBoxButton',
  props: {
    icon: 'icon-tool-click-segment',
    label: 'One Click Segment',
    tooltip: 'Detects segmentable regions with one click. Hover for visual feedback—click when a plus sign appears to auto-segment the lesion.',
    evaluate: {
      name: 'evaluate.cornerstone.segmentation',
      toolNames: ['RegionSegmentPlus'],
      disabledText: 'Create new segmentation to enable this tool.'
    },
    commands: 'setToolActiveToolbar'
  }
}, {
  id: 'LabelmapSlicePropagation',
  uiType: 'ohif.toolBoxButton',
  props: {
    icon: 'icon-labelmap-slice-propagation',
    label: 'Labelmap Assist',
    tooltip: 'Toggle AI assistance for segmenting nearby slices. After drawing on a slice, scroll to preview predictions. Press Enter to accept or Esc to skip.',
    evaluate: ['evaluate.cornerstoneTool.toggle', {
      name: 'evaluate.cornerstone.hasSegmentation'
    }],
    listeners: {
      [src.ViewportGridService.EVENTS.ACTIVE_VIEWPORT_ID_CHANGED]: callbacks('LabelmapSlicePropagation'),
      [src.ViewportGridService.EVENTS.VIEWPORTS_READY]: callbacks('LabelmapSlicePropagation')
    },
    commands: 'toggleEnabledDisabledToolbar'
  }
}, {
  id: 'MarkerLabelmap',
  uiType: 'ohif.toolBoxButton',
  props: {
    icon: 'icon-marker-labelmap',
    label: 'Marker Guided Labelmap',
    tooltip: 'Use include/exclude markers to guide AI (SAM) segmentation. Click to place markers, Enter to accept results, Esc to reject, and N to go to the next slice while keeping markers.',
    evaluate: [{
      name: 'evaluate.cornerstone.segmentation',
      toolNames: ['MarkerLabelmap', 'MarkerInclude', 'MarkerExclude']
    }],
    commands: 'setToolActiveToolbar',
    listeners: {
      [src.ViewportGridService.EVENTS.ACTIVE_VIEWPORT_ID_CHANGED]: callbacks('MarkerLabelmap'),
      [src.ViewportGridService.EVENTS.VIEWPORTS_READY]: callbacks('MarkerLabelmap')
    },
    options: [{
      name: 'Marker Mode',
      type: 'radio',
      id: 'marker-mode',
      value: 'markerInclude',
      values: [{
        value: 'markerInclude',
        label: 'Include'
      }, {
        value: 'markerExclude',
        label: 'Exclude'
      }],
      commands: ({
        commandsManager,
        options
      }) => {
        const markerModeOption = options.find(option => option.id === 'marker-mode');
        if (markerModeOption.value === 'markerInclude') {
          commandsManager.run('setToolActive', {
            toolName: 'MarkerInclude'
          });
        } else {
          commandsManager.run('setToolActive', {
            toolName: 'MarkerExclude'
          });
        }
      }
    }, {
      name: 'Clear Markers',
      type: 'button',
      id: 'clear-markers',
      commands: 'clearMarkersForMarkerLabelmap'
    }]
  }
}, {
  id: 'Eraser',
  uiType: 'ohif.toolBoxButton',
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
      value: 25,
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
  uiType: 'ohif.toolBoxButton',
  props: {
    icon: 'icon-tool-threshold',
    label: 'Threshold Tool',
    evaluate: {
      name: 'evaluate.cornerstone.segmentation',
      toolNames: ['ThresholdCircularBrush', 'ThresholdSphereBrush', 'ThresholdCircularBrushDynamic', 'ThresholdSphereBrushDynamic']
    },
    options: [{
      name: 'Radius (mm)',
      id: 'threshold-radius',
      type: 'range',
      min: 0.5,
      max: 99.5,
      step: 0.5,
      value: 25,
      commands: {
        commandName: 'setBrushSize',
        commandOptions: {
          toolNames: ['ThresholdCircularBrush', 'ThresholdSphereBrush', 'ThresholdCircularBrushDynamic', 'ThresholdSphereBrushDynamic']
        }
      }
    }, {
      name: 'Shape',
      type: 'radio',
      id: 'threshold-shape',
      value: 'ThresholdCircularBrush',
      values: [{
        value: 'ThresholdCircularBrush',
        label: 'Circle'
      }, {
        value: 'ThresholdSphereBrush',
        label: 'Sphere'
      }],
      commands: ({
        value,
        commandsManager,
        options
      }) => {
        const optionsDynamic = options.find(option => option.id === 'dynamic-mode');
        if (optionsDynamic.value === 'ThresholdDynamic') {
          commandsManager.run('setToolActive', {
            toolName: value === 'ThresholdCircularBrush' ? 'ThresholdCircularBrushDynamic' : 'ThresholdSphereBrushDynamic'
          });
        } else {
          commandsManager.run('setToolActive', {
            toolName: value
          });
        }
      }
    }, {
      name: 'Threshold',
      type: 'radio',
      id: 'dynamic-mode',
      value: 'ThresholdDynamic',
      values: [{
        value: 'ThresholdDynamic',
        label: 'Dynamic'
      }, {
        value: 'ThresholdRange',
        label: 'Range'
      }],
      commands: ({
        value,
        commandsManager,
        options
      }) => {
        const thresholdRangeOption = options.find(option => option.id === 'threshold-shape');
        if (value === 'ThresholdDynamic') {
          commandsManager.run('setToolActiveToolbar', {
            toolName: thresholdRangeOption.value === 'ThresholdCircularBrush' ? 'ThresholdCircularBrushDynamic' : 'ThresholdSphereBrushDynamic'
          });
        } else {
          commandsManager.run('setToolActiveToolbar', {
            toolName: thresholdRangeOption.value
          });
          const thresholdRangeValue = options.find(option => option.id === 'threshold-range').value;
          commandsManager.run('setThresholdRange', {
            toolNames: ['ThresholdCircularBrush', 'ThresholdSphereBrush'],
            value: thresholdRangeValue
          });
        }
      }
    }, {
      name: 'ThresholdRange',
      type: 'double-range',
      id: 'threshold-range',
      min: -1000,
      max: 1000,
      step: 1,
      value: [50, 600],
      condition: ({
        options
      }) => options.find(option => option.id === 'dynamic-mode').value === 'ThresholdRange',
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
    icon: 'icon-tool-shape',
    label: 'Shapes',
    evaluate: {
      name: 'evaluate.cornerstone.segmentation',
      toolNames: ['CircleScissor', 'SphereScissor', 'RectangleScissor'],
      disabledText: 'Create new segmentation to enable shapes tool.'
    },
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
}];
/* harmony default export */ const src_toolbarButtons = (toolbarButtons);
;// CONCATENATED MODULE: ../../../../modes/monai-label/src/initToolGroups.js
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
function createTools(utilityModule) {
  const {
    toolNames,
    Enums
  } = utilityModule.exports;
  return {
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
      }]
    }, {
      toolName: toolNames.StackScroll,
      bindings: [{
        mouseButton: Enums.MouseBindings.Wheel
      }]
    }],
    passive: [{
      toolName: 'CircularBrush',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'FILL_INSIDE_CIRCLE'
      }
    }, {
      toolName: toolNames.LabelmapSlicePropagation
    }, {
      toolName: toolNames.MarkerLabelmap
    }, {
      toolName: toolNames.RegionSegmentPlus
    }, {
      toolName: 'CircularEraser',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'ERASE_INSIDE_CIRCLE'
      }
    }, {
      toolName: 'SphereBrush',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'FILL_INSIDE_SPHERE'
      }
    }, {
      toolName: 'SphereEraser',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'ERASE_INSIDE_SPHERE'
      }
    }, {
      toolName: 'ThresholdCircularBrush',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'THRESHOLD_INSIDE_CIRCLE'
      }
    }, {
      toolName: 'ThresholdSphereBrush',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'THRESHOLD_INSIDE_SPHERE'
      }
    }, {
      toolName: 'ThresholdCircularBrushDynamic',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'THRESHOLD_INSIDE_CIRCLE',
        threshold: {
          isDynamic: true,
          dynamicRadius: 3
        }
      }
    }, {
      toolName: toolNames.SegmentBidirectional
    }, {
      toolName: toolNames.SegmentSelect
    }, {
      toolName: 'ThresholdSphereBrushDynamic',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'THRESHOLD_INSIDE_SPHERE',
        threshold: {
          isDynamic: true,
          dynamicRadius: 3
        }
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
    }, {
      toolName: toolNames.WindowLevelRegion
    }, {
      toolName: toolNames.UltrasoundDirectional
    }],
    disabled: [{
      toolName: toolNames.ReferenceLines
    }, {
      toolName: toolNames.AdvancedMagnify
    }]
  };
}
function initDefaultToolGroup(extensionManager, toolGroupService, commandsManager, toolGroupId) {
  const utilityModule = extensionManager.getModuleEntry('@ohif/extension-cornerstone.utilityModule.tools');
  const tools = createTools(utilityModule);
  toolGroupService.createToolGroupAndAddTools(toolGroupId, tools);
}
function initMPRToolGroup(extensionManager, toolGroupService, commandsManager) {
  const utilityModule = extensionManager.getModuleEntry('@ohif/extension-cornerstone.utilityModule.tools');
  const servicesManager = extensionManager._servicesManager;
  const {
    cornerstoneViewportService
  } = servicesManager.services;
  const tools = createTools(utilityModule);
  tools.disabled.push({
    toolName: utilityModule.exports.toolNames.Crosshairs,
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
    toolName: utilityModule.exports.toolNames.ReferenceLines
  });
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
      }]
    }, {
      toolName: toolNames.Pan,
      bindings: [{
        mouseButton: Enums.MouseBindings.Auxiliary
      }]
    }]
  };
  toolGroupService.createToolGroupAndAddTools('volume3d', tools);
}
function initToolGroups(extensionManager, toolGroupService, commandsManager) {
  initDefaultToolGroup(extensionManager, toolGroupService, commandsManager, 'default');
  initMPRToolGroup(extensionManager, toolGroupService, commandsManager);
  initVolume3DToolGroup(extensionManager, toolGroupService);
}
/* harmony default export */ const src_initToolGroups = (initToolGroups);
;// CONCATENATED MODULE: ../../../../modes/monai-label/src/index.tsx




const monailabel = {
  monaiLabel: '@ohif/extension-monai-label.panelModule.monailabel'
};
const ohif = {
  layout: '@ohif/extension-default.layoutTemplateModule.viewerLayout',
  sopClassHandler: '@ohif/extension-default.sopClassHandlerModule.stack',
  hangingProtocol: '@ohif/extension-default.hangingProtocolModule.default',
  leftPanel: '@ohif/extension-default.panelModule.seriesList'
};
const cornerstone = {
  viewport: '@ohif/extension-cornerstone.viewportModule.cornerstone',
  panelTool: '@ohif/extension-cornerstone.panelModule.panelSegmentationWithTools',
  measurements: '@ohif/extension-cornerstone.panelModule.panelMeasurement'
};
const segmentation = {
  sopClassHandler: '@ohif/extension-cornerstone-dicom-seg.sopClassHandlerModule.dicom-seg',
  viewport: '@ohif/extension-cornerstone-dicom-seg.viewportModule.dicom-seg'
};
const dicomRT = {
  viewport: '@ohif/extension-cornerstone-dicom-rt.viewportModule.dicom-rt',
  sopClassHandler: '@ohif/extension-cornerstone-dicom-rt.sopClassHandlerModule.dicom-rt'
};
/**
 * Just two dependencies to be able to render a viewport with panels in order
 * to make sure that the mode is working.
 */
const extensionDependencies = {
  '@ohif/extension-default': '^3.0.0',
  '@ohif/extension-cornerstone': '^3.0.0',
  '@ohif/extension-cornerstone-dicom-seg': '^3.0.0',
  '@ohif/extension-cornerstone-dicom-rt': '^3.0.0',
  '@ohif/extension-monai-label': '^3.0.0'
};
function modeFactory({
  modeConfiguration
}) {
  return {
    /**
     * Mode ID, which should be unique among modes used by the viewer. This ID
     * is used to identify the mode in the viewer's state.
     */
    id: id,
    routeName: 'monai-label',
    /**
     * Mode name, which is displayed in the viewer's UI in the workList, for the
     * user to select the mode.
     */
    displayName: 'MONAI Label',
    /**
     * Runs when the Mode Route is mounted to the DOM. Usually used to initialize
     * Services and other resources.
     */
    onModeEnter: ({
      servicesManager,
      extensionManager,
      commandsManager
    }) => {
      const {
        measurementService,
        toolbarService,
        toolGroupService,
        customizationService
      } = servicesManager.services;
      measurementService.clearMeasurements();

      // Init Default and SR ToolGroups
      src_initToolGroups(extensionManager, toolGroupService, commandsManager);
      toolbarService.addButtons(src_toolbarButtons);
      toolbarService.createButtonSection('primary', ['WindowLevel', 'Pan', 'Zoom', 'TrackballRotate', 'Capture', 'Layout', 'Crosshairs', 'MoreTools']);
      toolbarService.createButtonSection('moreToolsSection', ['Reset', 'rotate-right', 'flipHorizontal', 'ReferenceLines', 'ImageOverlayViewer', 'StackScroll', 'invert', 'Cine', 'Magnify', 'TagBrowser']);
      toolbarService.createButtonSection('segmentationToolbox', ['SegmentationUtilities', 'SegmentationTools']);
      toolbarService.createButtonSection('segmentationToolboxUtilitySection', ['LabelmapSlicePropagation', 'InterpolateLabelmap', 'SegmentBidirectional']);
      toolbarService.createButtonSection('segmentationToolboxToolsSection', ['BrushTools', 'MarkerLabelmap', 'RegionSegmentPlus', 'Shapes']);
      toolbarService.createButtonSection('brushToolsSection', ['Brush', 'Eraser', 'Threshold']);
    },
    onModeExit: ({
      servicesManager
    }) => {
      const {
        toolGroupService,
        syncGroupService,
        segmentationService,
        cornerstoneViewportService,
        uiDialogService,
        uiModalService
      } = servicesManager.services;
      uiDialogService.hideAll();
      uiModalService.hide();
      toolGroupService.destroy();
      syncGroupService.destroy();
      segmentationService.destroy();
      cornerstoneViewportService.destroy();
    },
    /** */
    validationTags: {
      study: [],
      series: []
    },
    /**
     * A boolean return value that indicates whether the mode is valid for the
     * modalities of the selected studies. Currently we don't have stack viewport
     * segmentations and we should exclude them
     */
    isValidMode: ({
      modalities
    }) => {
      // Don't show the mode if the selected studies have only one modality
      // that is not supported by the mode
      const modalitiesArray = modalities.split('\\');
      return {
        valid: modalitiesArray.length === 1 ? ['CT'].includes(modalitiesArray[0]) : false,
        description: 'The mode support studies that include the following modalities: CT'
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
      path: 'template',
      layoutTemplate: ({
        location,
        servicesManager
      }) => {
        return {
          id: ohif.layout,
          props: {
            leftPanels: [ohif.leftPanel],
            leftPanelResizable: true,
            rightPanels: [cornerstone.panelTool, monailabel.monaiLabel],
            rightPanelResizable: true,
            // leftPanelClosed: true,
            viewports: [{
              namespace: cornerstone.viewport,
              displaySetsToDisplay: [ohif.sopClassHandler]
            }, {
              namespace: segmentation.viewport,
              displaySetsToDisplay: [segmentation.sopClassHandler]
            }, {
              namespace: dicomRT.viewport,
              displaySetsToDisplay: [dicomRT.sopClassHandler]
            }]
          }
        };
      }
    }],
    /** List of extensions that are used by the mode */
    extensions: extensionDependencies,
    /** HangingProtocol used by the mode */
    // Commented out to just use the most applicable registered hanging protocol
    // The example is used for a grid layout to specify that as a preferred layout
    hangingProtocol: ['mpr'],
    /** SopClassHandlers used by the mode */
    sopClassHandlers: [ohif.sopClassHandler, segmentation.sopClassHandler, dicomRT.sopClassHandler],
    hotkeys: [...src.hotkeys.defaults.hotkeyBindings]
  };
}
const mode = {
  id: id,
  modeFactory,
  extensionDependencies
};
/* harmony default export */ const monai_label_src = (mode);

/***/ })

}]);