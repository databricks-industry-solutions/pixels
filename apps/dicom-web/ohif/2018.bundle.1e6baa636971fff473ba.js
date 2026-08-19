"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[2018],{

/***/ 42018
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ segmentation_src)
});

// UNUSED EXPORTS: toolbarButtons

;// ../../../modes/segmentation/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/mode-segmentation"}');
;// ../../../modes/segmentation/src/id.js

const id = package_namespaceObject.UU;

// EXTERNAL MODULE: ../../core/src/index.ts + 69 modules
var src = __webpack_require__(42356);
// EXTERNAL MODULE: ../../../node_modules/i18next/dist/esm/i18next.js
var i18next = __webpack_require__(40680);
;// ../../../modes/segmentation/src/constants.ts
const MIN_SEGMENTATION_DRAWING_RADIUS = 0.5;
const MAX_SEGMENTATION_DRAWING_RADIUS = 99.5;
;// ../../../modes/segmentation/src/toolbarButtons.ts



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
const toolbarButtons = [{
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
    evaluate: 'evaluate.windowLevelMenu'
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
},
// sections
{
  id: 'MoreTools',
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
},
// Section containers for the nested toolboxes and toolbars.
{
  id: 'LabelMapUtilities',
  uiType: 'ohif.Toolbar',
  props: {
    buttonSection: true
  }
}, {
  id: 'ContourUtilities',
  uiType: 'ohif.Toolbar',
  props: {
    buttonSection: true
  }
}, {
  id: 'LabelMapTools',
  uiType: 'ohif.toolBoxButtonGroup',
  props: {
    buttonSection: true
  }
}, {
  id: 'ContourTools',
  uiType: 'ohif.toolBoxButtonGroup',
  props: {
    buttonSection: true
  }
},
// tool defs
{
  id: 'Zoom',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-zoom',
    label: i18next/* default */.A.t('Buttons:Zoom'),
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'WindowLevel',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-window-level',
    label: i18next/* default */.A.t('Buttons:Window Level'),
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'Pan',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-move',
    label: i18next/* default */.A.t('Buttons:Pan'),
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
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
    label: i18next/* default */.A.t('Buttons:Crosshairs'),
    commands: {
      commandName: 'setToolActiveToolbar',
      commandOptions: {
        toolGroupIds: ['mpr']
      }
    },
    evaluate: {
      name: 'evaluate.cornerstoneTool',
      disabledText: i18next/* default */.A.t('Buttons:Select an MPR viewport to enable this tool')
    }
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
    evaluate: 'evaluate.action'
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
      unsupportedViewportTypes: ['volume3d']
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
    evaluate: 'evaluate.cornerstoneTool.toggle'
  }
}, {
  id: 'ImageOverlayViewer',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'toggle-dicom-overlay',
    label: i18next/* default */.A.t('Buttons:Image Overlay'),
    tooltip: i18next/* default */.A.t('Buttons:Toggle Image Overlay'),
    commands: 'toggleEnabledDisabledToolbar',
    evaluate: 'evaluate.cornerstoneTool.toggle'
  }
}, {
  id: 'StackScroll',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-stack-scroll',
    label: i18next/* default */.A.t('Buttons:Stack Scroll'),
    tooltip: i18next/* default */.A.t('Buttons:Stack Scroll'),
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'invert',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-invert',
    label: i18next/* default */.A.t('Buttons:Invert'),
    tooltip: i18next/* default */.A.t('Buttons:Invert Colors'),
    commands: 'invertViewport',
    evaluate: 'evaluate.viewportProperties.toggle'
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
  id: 'Magnify',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-magnify',
    label: i18next/* default */.A.t('Buttons:Zoom-in'),
    tooltip: i18next/* default */.A.t('Buttons:Zoom-in'),
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
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
  id: 'PlanarFreehandContourSegmentationTool',
  uiType: 'ohif.toolBoxButton',
  props: {
    icon: 'icon-tool-freehand-roi',
    label: i18next/* default */.A.t('Buttons:Freehand Segmentation'),
    tooltip: i18next/* default */.A.t('Buttons:Freehand Segmentation'),
    evaluate: [{
      name: 'evaluate.cornerstone.segmentation',
      toolNames: ['PlanarFreehandContourSegmentationTool'],
      disabledText: i18next/* default */.A.t('Buttons:Create new segmentation to enable this tool.')
    }, {
      name: 'evaluate.cornerstone.hasSegmentationOfType',
      segmentationRepresentationType: 'Contour'
    }],
    commands: [{
      commandName: 'setToolActiveToolbar',
      commandOptions: {
        bindings: [{
          mouseButton: 1 // Left Click
        }, {
          mouseButton: 1,
          // Left Click+Shift to create a hole
          modifierKey: 16 // Shift
        }]
      }
    }, {
      commandName: 'activateSelectedSegmentationOfType',
      commandOptions: {
        segmentationRepresentationType: 'Contour'
      }
    }],
    options: [{
      name: i18next/* default */.A.t('Buttons:Interpolate Contours'),
      type: 'switch',
      id: 'planarFreehandInterpolateContours',
      value: false,
      commands: {
        commandName: 'setInterpolationToolConfiguration'
      }
    }]
  }
}, {
  id: 'LivewireContourSegmentationTool',
  uiType: 'ohif.toolBoxButton',
  props: {
    icon: 'icon-tool-livewire',
    label: i18next/* default */.A.t('Buttons:Livewire Contour'),
    tooltip: i18next/* default */.A.t('Buttons:Livewire Contour'),
    evaluate: [{
      name: 'evaluate.cornerstone.segmentation',
      toolNames: ['LivewireContourSegmentationTool'],
      disabledText: i18next/* default */.A.t('Buttons:Create new segmentation to enable this tool.')
    }, {
      name: 'evaluate.cornerstone.hasSegmentationOfType',
      segmentationRepresentationType: 'Contour'
    }],
    commands: [{
      commandName: 'setToolActiveToolbar',
      commandOptions: {
        bindings: [{
          mouseButton: 1 // Left Click
        }, {
          mouseButton: 1,
          // Left Click+Shift to create a hole
          modifierKey: 16 // Shift
        }]
      }
    }, {
      commandName: 'activateSelectedSegmentationOfType',
      commandOptions: {
        segmentationRepresentationType: 'Contour'
      }
    }],
    options: [{
      name: i18next/* default */.A.t('Buttons:Interpolate Contours'),
      type: 'switch',
      id: 'livewireInterpolateContours',
      value: false,
      commands: {
        commandName: 'setInterpolationToolConfiguration'
      }
    }]
  }
}, {
  id: 'SplineContourSegmentationTool',
  uiType: 'ohif.toolBoxButton',
  props: {
    icon: 'icon-tool-spline-roi',
    label: i18next/* default */.A.t('Buttons:Spline Contour Segmentation Tool'),
    tooltip: i18next/* default */.A.t('Buttons:Spline Contour Segmentation Tool'),
    evaluate: [{
      name: 'evaluate.cornerstone.segmentation',
      toolNames: ['CatmullRomSplineROI', 'LinearSplineROI', 'BSplineROI'],
      disabledText: i18next/* default */.A.t('Buttons:Create new segmentation to enable this tool.')
    }, {
      name: 'evaluate.cornerstone.hasSegmentationOfType',
      segmentationRepresentationType: 'Contour'
    }],
    commands: [{
      commandName: 'activateSelectedSegmentationOfType',
      commandOptions: {
        segmentationRepresentationType: 'Contour'
      }
    }],
    options: [{
      name: i18next/* default */.A.t('Buttons:Spline Type'),
      type: 'select',
      id: 'splineTypeSelect',
      value: 'CatmullRomSplineROI',
      values: [{
        id: 'CatmullRomSplineROI',
        value: 'CatmullRomSplineROI',
        label: i18next/* default */.A.t('Buttons:Catmull Rom Spline')
      }, {
        id: 'LinearSplineROI',
        value: 'LinearSplineROI',
        label: i18next/* default */.A.t('Buttons:Linear Spline')
      }, {
        id: 'BSplineROI',
        value: 'BSplineROI',
        label: i18next/* default */.A.t('Buttons:B-Spline')
      }],
      commands: {
        commandName: 'setToolActiveToolbar',
        commandOptions: {
          bindings: [{
            mouseButton: 1 // Left Click
          }, {
            mouseButton: 1,
            // Left Click+Shift to create a hole
            modifierKey: 16 // Shift
          }]
        }
      }
    }, {
      name: i18next/* default */.A.t('Buttons:Simplified Spline'),
      type: 'switch',
      id: 'simplifiedSpline',
      value: true,
      commands: {
        commandName: 'setSimplifiedSplineForSplineContourSegmentationTool'
      }
    }, {
      name: i18next/* default */.A.t('Buttons:Interpolate Contours'),
      type: 'switch',
      id: 'splineInterpolateContours',
      value: false,
      commands: {
        commandName: 'setInterpolationToolConfiguration',
        commandOptions: {
          toolNames: ['CatmullRomSplineROI', 'LinearSplineROI', 'BSplineROI']
        }
      }
    }]
  }
}, {
  id: 'SculptorTool',
  uiType: 'ohif.toolBoxButton',
  props: {
    icon: 'icon-tool-sculptor',
    label: i18next/* default */.A.t('Buttons:Sculptor Tool'),
    tooltip: i18next/* default */.A.t('Buttons:Sculptor Tool'),
    evaluate: [{
      name: 'evaluate.cornerstone.segmentation',
      toolNames: ['SculptorTool'],
      disabledText: i18next/* default */.A.t('Buttons:Create new segmentation to enable this tool.')
    }, {
      name: 'evaluate.cornerstone.hasSegmentationOfType',
      segmentationRepresentationType: 'Contour'
    }],
    commands: ['setToolActiveToolbar', {
      commandName: 'activateSelectedSegmentationOfType',
      commandOptions: {
        segmentationRepresentationType: 'Contour'
      }
    }],
    options: [{
      name: i18next/* default */.A.t('Buttons:Dynamic Cursor Size'),
      type: 'switch',
      id: 'dynamicCursorSize',
      value: true,
      commands: {
        commandName: 'setDynamicCursorSizeForSculptorTool'
      }
    }]
  }
}, {
  id: 'Brush',
  uiType: 'ohif.toolBoxButton',
  props: {
    icon: 'icon-tool-brush',
    label: i18next/* default */.A.t('Buttons:Brush'),
    evaluate: [{
      name: 'evaluate.cornerstone.segmentation',
      toolNames: ['CircularBrush', 'SphereBrush'],
      disabledText: i18next/* default */.A.t('Buttons:Create new segmentation to enable this tool.')
    }, {
      name: 'evaluate.cornerstone.segmentation.synchronizeDrawingRadius',
      radiusOptionId: 'brush-radius'
    }, {
      name: 'evaluate.cornerstone.hasSegmentationOfType',
      segmentationRepresentationType: 'Labelmap'
    }],
    commands: {
      commandName: 'activateSelectedSegmentationOfType',
      commandOptions: {
        segmentationRepresentationType: 'Labelmap'
      }
    },
    options: [{
      name: i18next/* default */.A.t('Buttons:Radius (mm)'),
      id: 'brush-radius',
      type: 'range',
      explicitRunOnly: true,
      min: MIN_SEGMENTATION_DRAWING_RADIUS,
      max: MAX_SEGMENTATION_DRAWING_RADIUS,
      step: 0.5,
      value: 25,
      commands: [{
        commandName: 'setBrushSize',
        commandOptions: {
          toolNames: ['CircularBrush', 'SphereBrush']
        }
      }]
    }, {
      name: i18next/* default */.A.t('Buttons:Shape'),
      type: 'radio',
      id: 'brush-mode',
      value: 'CircularBrush',
      values: [{
        value: 'CircularBrush',
        label: i18next/* default */.A.t('Buttons:Circle')
      }, {
        value: 'SphereBrush',
        label: i18next/* default */.A.t('Buttons:Sphere')
      }],
      commands: ['setToolActiveToolbar']
    }]
  }
}, {
  id: 'InterpolateLabelmap',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'actions-interpolate',
    label: i18next/* default */.A.t('Buttons:Interpolate Labelmap'),
    tooltip: i18next/* default */.A.t('Buttons:Automatically fill in missing slices between drawn segments. Use brush or threshold tools on at least two slices, then click to interpolate across slices. Works in any direction. Volume must be reconstructable.'),
    evaluate: [{
      name: 'evaluate.cornerstone.segmentation'
    }, {
      name: 'evaluate.cornerstone.hasSegmentationOfType',
      segmentationRepresentationType: 'Labelmap'
    }, {
      name: 'evaluate.displaySetIsReconstructable',
      disabledText: i18next/* default */.A.t('Buttons:The current viewport cannot handle interpolation.')
    }],
    commands: [{
      commandName: 'activateSelectedSegmentationOfType',
      commandOptions: {
        segmentationRepresentationType: 'Labelmap'
      }
    }, 'interpolateLabelmap']
  }
}, {
  id: 'SegmentBidirectional',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'actions-bidirectional',
    label: i18next/* default */.A.t('Buttons:Segment Bidirectional'),
    tooltip: i18next/* default */.A.t('Buttons:Automatically detects the largest length and width across slices for the selected segment and displays a bidirectional measurement.'),
    evaluate: [{
      name: 'evaluate.cornerstone.segmentation',
      disabledText: i18next/* default */.A.t('Buttons:Create new segmentation to enable this tool.')
    }, {
      name: 'evaluate.cornerstone.hasSegmentationOfType',
      segmentationRepresentationType: 'Labelmap'
    }],
    commands: [{
      commandName: 'activateSelectedSegmentationOfType',
      commandOptions: {
        segmentationRepresentationType: 'Labelmap'
      }
    }, 'runSegmentBidirectional']
  }
}, {
  id: 'RegionSegmentPlus',
  uiType: 'ohif.toolBoxButton',
  props: {
    icon: 'icon-tool-click-segment',
    label: i18next/* default */.A.t('Buttons:One Click Segment'),
    tooltip: i18next/* default */.A.t('Buttons:Detects segmentable regions with one click. Hover for visual feedback—click when a plus sign appears to auto-segment the lesion.'),
    evaluate: [{
      name: 'evaluate.cornerstone.segmentation',
      toolNames: ['RegionSegmentPlus'],
      disabledText: i18next/* default */.A.t('Buttons:Create new segmentation to enable this tool.')
    }, {
      name: 'evaluate.cornerstone.hasSegmentationOfType',
      segmentationRepresentationType: 'Labelmap'
    }],
    commands: ['setToolActiveToolbar', {
      commandName: 'activateSelectedSegmentationOfType',
      commandOptions: {
        segmentationRepresentationType: 'Labelmap'
      }
    }]
  }
}, {
  id: 'LabelmapSlicePropagation',
  uiType: 'ohif.toolBoxButton',
  props: {
    icon: 'icon-labelmap-slice-propagation',
    label: i18next/* default */.A.t('Buttons:Labelmap Assist'),
    tooltip: i18next/* default */.A.t('Buttons:Toggle AI assistance for segmenting nearby slices. After drawing on a slice, scroll to preview predictions. Press Enter to accept or Esc to skip.'),
    evaluate: ['evaluate.cornerstoneTool.toggle', {
      name: 'evaluate.cornerstone.hasSegmentationOfType',
      segmentationRepresentationType: 'Labelmap'
    }],
    listeners: {
      [src.ViewportGridService.EVENTS.ACTIVE_VIEWPORT_ID_CHANGED]: callbacks('LabelmapSlicePropagation'),
      [src.ViewportGridService.EVENTS.VIEWPORTS_READY]: callbacks('LabelmapSlicePropagation')
    },
    commands: [{
      commandName: 'activateSelectedSegmentationOfType',
      commandOptions: {
        segmentationRepresentationType: 'Labelmap'
      }
    }, 'toggleEnabledDisabledToolbar']
  }
}, {
  id: 'MarkerLabelmap',
  uiType: 'ohif.toolBoxButton',
  props: {
    icon: 'icon-marker-labelmap',
    label: i18next/* default */.A.t('Buttons:Marker Guided Labelmap'),
    tooltip: i18next/* default */.A.t('Buttons:Use include/exclude markers to guide AI (SAM) segmentation. Click to place markers, Enter to accept results, Esc to reject, and N to go to the next slice while keeping markers.'),
    evaluate: [{
      name: 'evaluate.cornerstone.segmentation',
      toolNames: ['MarkerLabelmap', 'MarkerInclude', 'MarkerExclude']
    }, {
      name: 'evaluate.cornerstone.hasSegmentationOfType',
      segmentationRepresentationType: 'Labelmap'
    }],
    commands: ['setToolActiveToolbar', {
      commandName: 'activateSelectedSegmentationOfType',
      commandOptions: {
        segmentationRepresentationType: 'Labelmap'
      }
    }],
    listeners: {
      [src.ViewportGridService.EVENTS.ACTIVE_VIEWPORT_ID_CHANGED]: callbacks('MarkerLabelmap'),
      [src.ViewportGridService.EVENTS.VIEWPORTS_READY]: callbacks('MarkerLabelmap')
    },
    options: [{
      name: i18next/* default */.A.t('Buttons:Marker Mode'),
      type: 'radio',
      id: 'marker-mode',
      value: 'markerInclude',
      values: [{
        value: 'markerInclude',
        label: i18next/* default */.A.t('Buttons:Include')
      }, {
        value: 'markerExclude',
        label: i18next/* default */.A.t('Buttons:Exclude')
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
      name: i18next/* default */.A.t('Buttons:Clear Markers'),
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
    label: i18next/* default */.A.t('Buttons:Eraser'),
    evaluate: [{
      name: 'evaluate.cornerstone.segmentation',
      toolNames: ['CircularEraser', 'SphereEraser']
    }, {
      name: 'evaluate.cornerstone.segmentation.synchronizeDrawingRadius',
      radiusOptionId: 'eraser-radius'
    }, {
      name: 'evaluate.cornerstone.hasSegmentationOfType',
      segmentationRepresentationType: 'Labelmap'
    }],
    options: [{
      name: i18next/* default */.A.t('Buttons:Radius (mm)'),
      id: 'eraser-radius',
      type: 'range',
      explicitRunOnly: true,
      min: MIN_SEGMENTATION_DRAWING_RADIUS,
      max: MAX_SEGMENTATION_DRAWING_RADIUS,
      step: 0.5,
      value: 25,
      commands: {
        commandName: 'setBrushSize',
        commandOptions: {
          toolNames: ['CircularEraser', 'SphereEraser']
        }
      }
    }, {
      name: i18next/* default */.A.t('Buttons:Shape'),
      type: 'radio',
      id: 'eraser-mode',
      value: 'CircularEraser',
      values: [{
        value: 'CircularEraser',
        label: i18next/* default */.A.t('Buttons:Circle')
      }, {
        value: 'SphereEraser',
        label: i18next/* default */.A.t('Buttons:Sphere')
      }],
      commands: 'setToolActiveToolbar'
    }],
    commands: {
      commandName: 'activateSelectedSegmentationOfType',
      commandOptions: {
        segmentationRepresentationType: 'Labelmap'
      }
    }
  }
}, {
  id: 'Threshold',
  uiType: 'ohif.toolBoxButton',
  props: {
    icon: 'icon-tool-threshold',
    label: i18next/* default */.A.t('Buttons:Threshold Tool'),
    evaluate: [{
      name: 'evaluate.cornerstone.segmentation',
      toolNames: ['ThresholdCircularBrush', 'ThresholdSphereBrush', 'ThresholdCircularBrushDynamic', 'ThresholdSphereBrushDynamic']
    }, {
      name: 'evaluate.cornerstone.segmentation.synchronizeDrawingRadius',
      radiusOptionId: 'threshold-radius'
    }, {
      name: 'evaluate.cornerstone.hasSegmentationOfType',
      segmentationRepresentationType: 'Labelmap'
    }],
    commands: {
      commandName: 'activateSelectedSegmentationOfType',
      commandOptions: {
        segmentationRepresentationType: 'Labelmap'
      }
    },
    options: [{
      name: i18next/* default */.A.t('Buttons:Radius (mm)'),
      id: 'threshold-radius',
      type: 'range',
      explicitRunOnly: true,
      min: MIN_SEGMENTATION_DRAWING_RADIUS,
      max: MAX_SEGMENTATION_DRAWING_RADIUS,
      step: 0.5,
      value: 25,
      commands: {
        commandName: 'setBrushSize',
        commandOptions: {
          toolNames: ['ThresholdCircularBrush', 'ThresholdSphereBrush', 'ThresholdCircularBrushDynamic', 'ThresholdSphereBrushDynamic']
        }
      }
    }, {
      name: i18next/* default */.A.t('Buttons:Shape'),
      type: 'radio',
      id: 'threshold-shape',
      value: 'ThresholdCircularBrush',
      values: [{
        value: 'ThresholdCircularBrush',
        label: i18next/* default */.A.t('Buttons:Circle')
      }, {
        value: 'ThresholdSphereBrush',
        label: i18next/* default */.A.t('Buttons:Sphere')
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
      name: i18next/* default */.A.t('Buttons:Threshold'),
      type: 'radio',
      id: 'dynamic-mode',
      value: 'ThresholdDynamic',
      values: [{
        value: 'ThresholdDynamic',
        label: i18next/* default */.A.t('Buttons:Dynamic')
      }, {
        value: 'ThresholdRange',
        label: i18next/* default */.A.t('Buttons:Range')
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
    label: i18next/* default */.A.t('Buttons:Shapes'),
    evaluate: [{
      name: 'evaluate.cornerstone.segmentation',
      toolNames: ['CircleScissor', 'SphereScissor', 'RectangleScissor'],
      disabledText: i18next/* default */.A.t('Buttons:Create new segmentation to enable shapes tool.')
    }, {
      name: 'evaluate.cornerstone.hasSegmentationOfType',
      segmentationRepresentationType: 'Labelmap'
    }],
    commands: {
      commandName: 'activateSelectedSegmentationOfType',
      commandOptions: {
        segmentationRepresentationType: 'Labelmap'
      }
    },
    options: [{
      name: i18next/* default */.A.t('Buttons:Shape'),
      type: 'radio',
      value: 'CircleScissor',
      id: 'shape-mode',
      values: [{
        value: 'CircleScissor',
        label: i18next/* default */.A.t('Buttons:Circle')
      }, {
        value: 'SphereScissor',
        label: i18next/* default */.A.t('Buttons:Sphere')
      }, {
        value: 'RectangleScissor',
        label: i18next/* default */.A.t('Buttons:Rectangle')
      }],
      commands: 'setToolActiveToolbar'
    }]
  }
}, {
  id: 'SimplifyContours',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'actions-simplify',
    label: 'Simplify Contours',
    tooltip: 'Simplify Contours',
    commands: ['toggleActiveSegmentationUtility'],
    evaluate: [{
      name: 'cornerstone.isActiveSegmentationUtility'
    }],
    options: 'cornerstone.SimplifyContourOptions'
  }
}, {
  id: 'SmoothContours',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'actions-smooth',
    label: 'Smooth Contours',
    tooltip: 'Smooth Contours',
    commands: ['toggleActiveSegmentationUtility'],
    evaluate: [{
      name: 'cornerstone.isActiveSegmentationUtility'
    }],
    options: 'cornerstone.SmoothContoursOptions'
  }
}, {
  id: 'LogicalContourOperations',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'actions-combine',
    label: 'Combine Contours',
    tooltip: 'Combine Contours',
    commands: ['toggleActiveSegmentationUtility'],
    evaluate: [{
      name: 'cornerstone.isActiveSegmentationUtility'
    }],
    options: 'cornerstone.LogicalContourOperationsOptions'
  }
}, {
  id: 'LabelMapEditWithContour',
  uiType: 'ohif.toolBoxButton',
  props: {
    icon: 'tool-labelmap-edit-with-contour',
    label: i18next/* default */.A.t('Buttons:Labelmap Edit with Contour Tool'),
    tooltip: i18next/* default */.A.t('Buttons:Labelmap Edit with Contour Tool'),
    commands: ['setToolActiveToolbar', {
      commandName: 'activateSelectedSegmentationOfType',
      commandOptions: {
        segmentationRepresentationType: 'Labelmap'
      }
    }],
    evaluate: [{
      name: 'evaluate.cornerstone.segmentation',
      toolNames: ['LabelMapEditWithContour'],
      disabledText: 'Create new segmentation to enable this tool.'
    }, {
      name: 'evaluate.cornerstone.hasSegmentationOfType',
      segmentationRepresentationType: 'Labelmap'
    }]
  }
}];
/* harmony default export */ const src_toolbarButtons = (toolbarButtons);
;// ../../../modes/segmentation/src/initToolGroups.ts

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
function createTools({
  utilityModule,
  commandsManager
}) {
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
      toolName: 'CircularBrush',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'FILL_INSIDE_CIRCLE',
        minRadius: MIN_SEGMENTATION_DRAWING_RADIUS,
        maxRadius: MAX_SEGMENTATION_DRAWING_RADIUS
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
        activeStrategy: 'ERASE_INSIDE_CIRCLE',
        minRadius: MIN_SEGMENTATION_DRAWING_RADIUS,
        maxRadius: MAX_SEGMENTATION_DRAWING_RADIUS
      }
    }, {
      toolName: 'SphereBrush',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'FILL_INSIDE_SPHERE',
        minRadius: MIN_SEGMENTATION_DRAWING_RADIUS,
        maxRadius: MAX_SEGMENTATION_DRAWING_RADIUS
      }
    }, {
      toolName: 'SphereEraser',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'ERASE_INSIDE_SPHERE',
        minRadius: MIN_SEGMENTATION_DRAWING_RADIUS,
        maxRadius: MAX_SEGMENTATION_DRAWING_RADIUS
      }
    }, {
      toolName: 'ThresholdCircularBrush',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'THRESHOLD_INSIDE_CIRCLE',
        minRadius: MIN_SEGMENTATION_DRAWING_RADIUS,
        maxRadius: MAX_SEGMENTATION_DRAWING_RADIUS
      }
    }, {
      toolName: 'ThresholdSphereBrush',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'THRESHOLD_INSIDE_SPHERE',
        minRadius: MIN_SEGMENTATION_DRAWING_RADIUS,
        maxRadius: MAX_SEGMENTATION_DRAWING_RADIUS
      }
    }, {
      toolName: 'ThresholdCircularBrushDynamic',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'THRESHOLD_INSIDE_CIRCLE',
        minRadius: MIN_SEGMENTATION_DRAWING_RADIUS,
        maxRadius: MAX_SEGMENTATION_DRAWING_RADIUS,
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
        minRadius: MIN_SEGMENTATION_DRAWING_RADIUS,
        maxRadius: MAX_SEGMENTATION_DRAWING_RADIUS,
        threshold: {
          isDynamic: true,
          dynamicRadius: 3
        }
      }
    }, {
      toolName: toolNames.LabelMapEditWithContourTool
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
    }, {
      toolName: toolNames.PlanarFreehandContourSegmentation
    }, {
      toolName: toolNames.LivewireContourSegmentation
    }, {
      toolName: toolNames.SculptorTool
    }, {
      toolName: toolNames.PlanarFreehandROI
    }, {
      toolName: 'CatmullRomSplineROI',
      parentTool: toolNames.SplineContourSegmentation,
      configuration: {
        spline: {
          type: 'CATMULLROM',
          enableTwoPointPreview: true
        }
      }
    }, {
      toolName: 'LinearSplineROI',
      parentTool: toolNames.SplineContourSegmentation,
      configuration: {
        spline: {
          type: 'LINEAR',
          enableTwoPointPreview: true
        }
      }
    }, {
      toolName: 'BSplineROI',
      parentTool: toolNames.SplineContourSegmentation,
      configuration: {
        spline: {
          type: 'BSPLINE',
          enableTwoPointPreview: true
        }
      }
    }],
    disabled: [{
      toolName: toolNames.ReferenceLines
    }, {
      toolName: toolNames.AdvancedMagnify
    }]
  };
  const updatedTools = commandsManager.run('initializeSegmentLabelTool', {
    tools
  });
  return updatedTools;
}
function initDefaultToolGroup(extensionManager, toolGroupService, commandsManager, toolGroupId) {
  const utilityModule = extensionManager.getModuleEntry('@ohif/extension-cornerstone.utilityModule.tools');
  const tools = createTools({
    commandsManager,
    utilityModule
  });
  toolGroupService.createToolGroupAndAddTools(toolGroupId, tools);
}
function initMPRToolGroup(extensionManager, toolGroupService, commandsManager) {
  const utilityModule = extensionManager.getModuleEntry('@ohif/extension-cornerstone.utilityModule.tools');
  const servicesManager = extensionManager._servicesManager;
  const {
    cornerstoneViewportService
  } = servicesManager.services;
  const tools = createTools({
    commandsManager,
    utilityModule
  });
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
      }, {
        numTouchPoints: 2
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
;// ../../../modes/segmentation/src/utils/setUpAutoTabSwitchHandler.ts
/**
 * Sets up auto tab switching for when the first segmentation is added into the viewer.
 */
function setUpAutoTabSwitchHandler({
  segmentationService,
  viewportGridService,
  panelService
}) {
  const autoTabSwitchEvents = [segmentationService.EVENTS.SEGMENTATION_MODIFIED, segmentationService.EVENTS.SEGMENTATION_REPRESENTATION_MODIFIED];

  // Initially there are no segmentations, so we should switch the tab whenever the first segmentation is added.
  let shouldSwitchTab = true;
  const unsubscribeAutoTabSwitchEvents = autoTabSwitchEvents.map(eventName => segmentationService.subscribe(eventName, () => {
    const segmentations = segmentationService.getSegmentations();
    if (!segmentations.length) {
      // If all the segmentations are removed, then the next time a segmentation is added, we should switch the tab.
      shouldSwitchTab = true;
      return;
    }
    const activeViewportId = viewportGridService.getActiveViewportId();
    const activeRepresentation = segmentationService.getSegmentationRepresentations(activeViewportId)?.find(representation => representation.active);
    if (activeRepresentation && shouldSwitchTab) {
      shouldSwitchTab = false;
      switch (activeRepresentation.type) {
        case 'Labelmap':
          panelService.activatePanel('@ohif/extension-cornerstone.panelModule.panelSegmentationWithToolsLabelMap', true);
          break;
        case 'Contour':
          panelService.activatePanel('@ohif/extension-cornerstone.panelModule.panelSegmentationWithToolsContour', true);
          break;
      }
    }
  })).map(subscription => subscription.unsubscribe);
  return {
    unsubscribeAutoTabSwitchEvents
  };
}
// EXTERNAL MODULE: ../../../modes/basic/src/index.tsx + 4 modules
var basic_src = __webpack_require__(35485);
;// ../../../modes/segmentation/src/index.tsx




// `niftiSegmentation` is exported from `@ohif/mode-basic` by the
// `viewers_modes_basic_src_index.tsx.nifti.patch` applied in
// `plugins/ohifv3/build.sh`. Pulling it in here lets the dedicated
// segmentation mode mount the NIfTI overlay panel alongside the labelmap /
// contour segmentation panels, so a user can load a `.nii.gz` overlay and
// then edit it with the same brush / eraser / threshold tools the mode
// already wires up. Extension dependency is inherited via the same
// `extensionDependencies` import (basic mode already lists
// `@ohif/extension-nifti-segmentation`).


function modeFactory({
  modeConfiguration
}) {
  const _unsubscriptions = [];
  return {
    /**
     * Mode ID, which should be unique among modes used by the viewer. This ID
     * is used to identify the mode in the viewer's state.
     */
    id: id,
    routeName: 'segmentation',
    /**
     * Mode name, which is displayed in the viewer's UI in the workList, for the
     * user to select the mode.
     */
    displayName: 'Segmentation',
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
        segmentationService,
        viewportGridService,
        panelService
      } = servicesManager.services;
      measurementService.clearMeasurements();

      // Init Default and SR ToolGroups
      src_initToolGroups(extensionManager, toolGroupService, commandsManager);
      toolbarService.register(src_toolbarButtons);
      toolbarService.updateSection(toolbarService.sections.primary, ['WindowLevel', 'Pan', 'Zoom', 'TrackballRotate', 'Capture', 'Layout', 'Crosshairs', 'MoreTools']);
      toolbarService.updateSection(toolbarService.sections.viewportActionMenu.topLeft, ['orientationMenu', 'dataOverlayMenu']);
      toolbarService.updateSection(toolbarService.sections.viewportActionMenu.bottomMiddle, ['AdvancedRenderingControls']);
      toolbarService.updateSection('AdvancedRenderingControls', ['windowLevelMenuEmbedded', 'voiManualControlMenu', 'Colorbar', 'opacityMenu', 'thresholdMenu']);
      toolbarService.updateSection(toolbarService.sections.viewportActionMenu.topRight, ['modalityLoadBadge', 'trackingStatus', 'navigationComponent']);
      toolbarService.updateSection(toolbarService.sections.viewportActionMenu.bottomLeft, ['windowLevelMenu']);
      toolbarService.updateSection('MoreTools', ['Reset', 'rotate-right', 'flipHorizontal', 'ReferenceLines', 'ImageOverlayViewer', 'StackScroll', 'invert', 'Cine', 'Magnify', 'TagBrowser']);
      toolbarService.updateSection(toolbarService.sections.labelMapSegmentationToolbox, ['LabelMapTools']);
      toolbarService.updateSection(toolbarService.sections.contourSegmentationToolbox, ['ContourTools']);
      toolbarService.updateSection('LabelMapTools', ['LabelmapSlicePropagation', 'BrushTools', 'MarkerLabelmap', 'RegionSegmentPlus', 'Shapes', 'LabelMapEditWithContour']);
      toolbarService.updateSection('ContourTools', ['PlanarFreehandContourSegmentationTool', 'SculptorTool', 'SplineContourSegmentationTool', 'LivewireContourSegmentationTool']);
      toolbarService.updateSection(toolbarService.sections.labelMapSegmentationUtilities, ['LabelMapUtilities']);
      toolbarService.updateSection(toolbarService.sections.contourSegmentationUtilities, ['ContourUtilities']);
      toolbarService.updateSection('LabelMapUtilities', ['InterpolateLabelmap', 'SegmentBidirectional']);
      toolbarService.updateSection('ContourUtilities', ['LogicalContourOperations', 'SimplifyContours', 'SmoothContours']);
      toolbarService.updateSection('BrushTools', ['Brush', 'Eraser', 'Threshold']);
      const {
        unsubscribeAutoTabSwitchEvents
      } = setUpAutoTabSwitchHandler({
        segmentationService,
        viewportGridService,
        panelService
      });
      _unsubscriptions.push(...unsubscribeAutoTabSwitchEvents);
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
      _unsubscriptions.forEach(unsubscribe => unsubscribe());
      _unsubscriptions.length = 0;
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
        valid: modalitiesArray.length === 1 ? !['SM', 'ECG', 'OT', 'DOC'].includes(modalitiesArray[0]) : true,
        description: 'The mode does not support studies that ONLY include the following modalities: SM, OT, DOC'
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
          id: basic_src/* ohif */.Dt.layout,
          props: {
            leftPanels: [basic_src/* ohif */.Dt.thumbnailList],
            leftPanelResizable: true,
            rightPanels: [basic_src/* cornerstone */.Nu.labelMapSegmentationPanel, basic_src/* cornerstone */.Nu.contourSegmentationPanel,
            // NIfTI overlay panel — lists `.nii.gz` segmentations related
            // to the active series (`/nifti/related`) and loads them
            // into a Cornerstone3D labelmap volume. Sits last on the
            // right rail so the user can scan the standard segmentation
            // panels first and only open the overlay panel when needed.
            basic_src/* niftiSegmentation */.pN.panel],
            rightPanelResizable: true,
            // leftPanelClosed: true,
            viewports: [{
              namespace: basic_src/* cornerstone */.Nu.viewport,
              displaySetsToDisplay: [basic_src/* ohif */.Dt.sopClassHandler]
            }, {
              namespace: basic_src/* segmentation */.b2.viewport,
              displaySetsToDisplay: [basic_src/* segmentation */.b2.sopClassHandler]
            }, {
              namespace: basic_src/* dicomRT */.V6.viewport,
              displaySetsToDisplay: [basic_src/* dicomRT */.V6.sopClassHandler]
            }]
          }
        };
      }
    }],
    /** List of extensions that are used by the mode */
    extensions: basic_src/* extensionDependencies */.tR,
    /** HangingProtocol used by the mode */
    // Commented out to just use the most applicable registered hanging protocol
    // The example is used for a grid layout to specify that as a preferred layout
    hangingProtocol: ['@ohif/mnGrid'],
    /** SopClassHandlers used by the mode */
    sopClassHandlers: [basic_src/* ohif */.Dt.sopClassHandler, basic_src/* segmentation */.b2.sopClassHandler, basic_src/* dicomRT */.V6.sopClassHandler]
  };
}
const mode = {
  id: id,
  modeFactory,
  extensionDependencies: basic_src/* extensionDependencies */.tR
};
/* harmony default export */ const segmentation_src = (mode);

/***/ }

}]);