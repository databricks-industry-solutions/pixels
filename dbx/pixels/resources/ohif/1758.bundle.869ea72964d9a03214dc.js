"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[1758],{

/***/ 51758:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ redaction_viewer_src),
  initToolGroups: () => (/* reexport */ src_initToolGroups),
  toolbarButtons: () => (/* reexport */ src_toolbarButtons)
});

// EXTERNAL MODULE: ../../../node_modules/i18next/dist/esm/i18next.js
var i18next = __webpack_require__(40680);
;// ../../../../../../../plugins/ohifv3/modes/redaction-viewer/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/mode-redaction-viewer"}');
;// ../../../../../../../plugins/ohifv3/modes/redaction-viewer/src/id.js
/*
OHIF Image Redactor Extension Copyright (2025) Databricks, Inc.
Author: Emanuele Rinaldi <emanuele.rinaldi@databricks.com>

This library (the "Software") may not be used except in connection with the Licensee's use of the Databricks Platform Services pursuant to an Agreement (defined below) between Licensee (defined below) and Databricks, Inc. ("Databricks"). The Object Code version of the Software shall be deemed part of the Downloadable Services under the Agreement, or if the Agreement does not define Downloadable Services, Subscription Services, or if neither are defined then the term in such Agreement that refers to the applicable Databricks Platform Services (as defined below) shall be substituted herein for "Downloadable Services." Licensee's use of the Software must comply at all times with any restrictions applicable to the Downlodable Services and Subscription Services, generally, and must be used in accordance with any applicable documentation. For the avoidance of doubt, the Software constitutes Databricks Confidential Information under the Agreement. Additionally, and notwithstanding anything in the Agreement to the contrary:
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
* you may view, make limited copies of, and may compile the Source Code version of the Software into an Object Code version of the Software. For the avoidance of doubt, you may not make derivative works of Software (or make any any changes to the Source Code version of the unless you have agreed to separate terms with Databricks permitting such modifications (e.g., a contribution license agreement)).
If you have not agreed to an Agreement or otherwise do not agree to these terms, you may not use the Software or view, copy or compile the Source Code of the Software. This license terminates automatically upon the termination of the Agreement or Licensee's breach of these terms. Additionally, Databricks may terminate this license at any time on notice. Upon termination, you must permanently delete the Software and all copies thereof (including the Source Code).
*/


const id = package_namespaceObject.UU;

;// ../../../../../../../plugins/ohifv3/modes/redaction-viewer/src/initToolGroups.js
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
    passive: [
    // Measurement Tools
    {
      toolName: toolNames.Length
    }, {
      toolName: toolNames.Bidirectional
    }, {
      toolName: toolNames.ArrowAnnotate
    }, {
      toolName: toolNames.EllipticalROI
    }, {
      toolName: toolNames.RectangleROI
    }, {
      toolName: toolNames.CircleROI
    }, {
      toolName: toolNames.PlanarFreehandROI
    }, {
      toolName: toolNames.SplineROI
    }, {
      toolName: toolNames.LivewireContour
    },
    // Redaction Tool - NEW
    {
      toolName: 'RedactionRectangle'
    },
    // Navigation Tools
    {
      toolName: toolNames.Magnify
    }, {
      toolName: toolNames.DragProbe
    }, {
      toolName: toolNames.Angle
    }, {
      toolName: toolNames.CobbAngle
    }, {
      toolName: toolNames.CalibrationLine
    }, {
      toolName: toolNames.AdvancedMagnify
    }, {
      toolName: toolNames.UltrasoundDirectional
    }, {
      toolName: toolNames.WindowLevelRegion
    },
    // 3D Tools
    {
      toolName: toolNames.TrackballRotate
    }],
    disabled: [{
      toolName: toolNames.ReferenceLines
    }, {
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
        }
      }
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
  const tools = createTools(utilityModule);
  toolGroupService.createToolGroupAndAddTools('volume3d', tools);
}
function initSRToolGroup(extensionManager, toolGroupService) {
  const SRUtilityModule = extensionManager.getModuleEntry('@ohif/extension-cornerstone-dicom-sr.utilityModule.tools');
  if (!SRUtilityModule) {
    return;
  }
  const tools = {
    active: [{
      toolName: SRUtilityModule.exports.toolNames.SRLength,
      bindings: [{
        mouseButton: 1
      }]
    }, {
      toolName: SRUtilityModule.exports.toolNames.SRBidirectional,
      bindings: [{
        mouseButton: 1
      }]
    }, {
      toolName: SRUtilityModule.exports.toolNames.SRArrowAnnotate,
      bindings: [{
        mouseButton: 1
      }]
    }],
    passive: [{
      toolName: SRUtilityModule.exports.toolNames.SRLength
    }, {
      toolName: SRUtilityModule.exports.toolNames.SRBidirectional
    }, {
      toolName: SRUtilityModule.exports.toolNames.SRArrowAnnotate
    }],
    disabled: []
  };
  toolGroupService.createToolGroupAndAddTools('SRToolGroup', tools);
}
function initToolGroups(extensionManager, toolGroupService, commandsManager) {
  initDefaultToolGroup(extensionManager, toolGroupService, commandsManager, 'default');
  initMPRToolGroup(extensionManager, toolGroupService, commandsManager);
  initVolume3DToolGroup(extensionManager, toolGroupService);
  initSRToolGroup(extensionManager, toolGroupService);
}
/* harmony default export */ const src_initToolGroups = (initToolGroups);
// EXTERNAL MODULE: ../../core/src/index.ts + 68 modules
var src = __webpack_require__(15871);
;// ../../../../../../../plugins/ohifv3/modes/redaction-viewer/src/toolbarButtons.js

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
  id: 'TagRedactor',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'ToolDicomTagBrowser',
    label: 'Tag Redactor',
    tooltip: 'Redact, hash, or modify DICOM metadata tags',
    commands: 'openTagRedactor',
    evaluate: 'evaluate.action'
  }
}, {
  id: 'RedactionRectangle',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-rectangle',
    label: 'Redaction',
    tooltip: 'Draw rectangles to mark areas for redaction',
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
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
;// ../../../../../../../plugins/ohifv3/modes/redaction-viewer/src/index.ts





// Allow this mode by excluding non-imaging modalities such as SR, SEG
// Also, SM is not a simple imaging modalities, so exclude it.
const NON_IMAGE_MODALITIES = ['ECG', 'SEG', 'RTSTRUCT', 'RTPLAN', 'PR'];
const ohif = {
  layout: '@ohif/extension-default.layoutTemplateModule.viewerLayout',
  sopClassHandler: '@ohif/extension-default.sopClassHandlerModule.stack',
  thumbnailList: '@ohif/extension-default.panelModule.seriesList',
  wsiSopClassHandler: '@ohif/extension-cornerstone.sopClassHandlerModule.DicomMicroscopySopClassHandler'
};
const tracked = {
  measurements: '@ohif/extension-measurement-tracking.panelModule.trackedMeasurements',
  thumbnailList: '@ohif/extension-default.panelModule.seriesList',
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

// Image Redactor Extension
const imageRedactor = {
  panel: '@ohif/extension-image-redactor.panelModule.redactionPanel'
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
  '@ohif/extension-image-redactor': '^1.0.0'
};
function modeFactory({
  modeConfiguration
}) {
  let _activatePanelTriggersSubscriptions = [];
  return {
    // TODO: We're using this as a route segment
    // We should not be.
    id: id,
    routeName: 'redaction-viewer',
    displayName: i18next/* default */.A.t('Modes:Redaction Tool'),
    /**
     * Lifecycle hooks
     */
    onModeEnter: function ({
      servicesManager,
      extensionManager,
      commandsManager
    }) {
      const {
        toolbarService,
        toolGroupService,
        customizationService
      } = servicesManager.services;

      // Init Default and SR ToolGroups
      src_initToolGroups(extensionManager, toolGroupService, commandsManager);
      toolbarService.addButtons(src_toolbarButtons);
      toolbarService.createButtonSection('primary', ['WindowLevel', 'Pan', 'Zoom', 'Capture', 'VLMAnalyzer', 'RedactionRectangle', 'TagRedactor', 'Reset', 'MoreTools']);
      toolbarService.createButtonSection('moreToolsSection', ['rotate-right', 'flipHorizontal', 'ReferenceLines', 'ImageOverlayViewer', 'StackScroll', 'invert', 'Cine', 'Magnify', 'TagBrowser']);
      customizationService.setCustomizations({
        'panelSegmentation.disableEditing': {
          $set: true
        }
      });
    },
    onModeExit: ({
      servicesManager
    }) => {
      const {
        toolGroupService,
        syncGroupService,
        cornerstoneViewportService,
        uiDialogService,
        uiModalService
      } = servicesManager.services;
      _activatePanelTriggersSubscriptions.forEach(sub => sub.unsubscribe());
      _activatePanelTriggersSubscriptions = [];
      uiDialogService.hideAll();
      uiModalService.hide();
      toolGroupService.destroy();
      syncGroupService.destroy();
      cornerstoneViewportService.destroy();
    },
    validationTags: {
      study: [],
      series: []
    },
    isValidMode: function ({
      modalities
    }) {
      const modalities_list = modalities.split('\\');

      // Exclude non-image modalities
      return {
        valid: !!modalities_list.filter(modality => NON_IMAGE_MODALITIES.indexOf(modality) === -1).length,
        description: 'The mode does not support studies that ONLY include the following modalities: SM, ECG, SEG, RTSTRUCT'
      };
    },
    routes: [{
      path: 'redaction',
      /*init: ({ servicesManager, extensionManager }) => {
        //defaultViewerRouteInit
      },*/
      layoutTemplate: () => {
        return {
          id: ohif.layout,
          props: {
            leftPanels: [tracked.thumbnailList],
            leftPanelClosed: true,
            leftPanelResizable: true,
            rightPanels: [imageRedactor.panel],
            // Add redaction panel
            rightPanelClosed: false,
            // Keep right panel open by default
            rightPanelResizable: true,
            viewports: [{
              namespace: tracked.viewport,
              closed: true,
              displaySetsToDisplay: [ohif.sopClassHandler, dicomvideo.sopClassHandler, dicomsr.sopClassHandler3D, ohif.wsiSopClassHandler]
            }, {
              namespace: dicomsr.viewport,
              closed: true,
              displaySetsToDisplay: [dicomsr.sopClassHandler]
            }, {
              namespace: dicompdf.viewport,
              closed: true,
              displaySetsToDisplay: [dicompdf.sopClassHandler]
            }, {
              namespace: dicomSeg.viewport,
              closed: true,
              displaySetsToDisplay: [dicomSeg.sopClassHandler]
            }, {
              namespace: dicomPmap.viewport,
              closed: true,
              displaySetsToDisplay: [dicomPmap.sopClassHandler]
            }, {
              namespace: dicomRT.viewport,
              closed: true,
              displaySetsToDisplay: [dicomRT.sopClassHandler]
            }]
          }
        };
      }
    }],
    extensions: extensionDependencies,
    // Default protocol gets self-registered by default in the init
    hangingProtocol: 'default',
    // Order is important in sop class handlers when two handlers both use
    // the same sop class under different situations.  In that case, the more
    // general handler needs to come last.  For this case, the dicomvideo must
    // come first to remove video transfer syntax before ohif uses images
    sopClassHandlers: [dicomvideo.sopClassHandler, dicomPmap.sopClassHandler, ohif.sopClassHandler, ohif.wsiSopClassHandler, dicompdf.sopClassHandler, dicomsr.sopClassHandler3D, dicomsr.sopClassHandler, dicomRT.sopClassHandler],
    ...modeConfiguration
  };
}
const mode = {
  id: id,
  modeFactory,
  extensionDependencies
};
/* harmony default export */ const redaction_viewer_src = (mode);


/***/ })

}]);