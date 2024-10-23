"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[760],{

/***/ 98760:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ monai_label_src)
});

// EXTERNAL MODULE: ../../core/src/index.ts + 65 modules
var src = __webpack_require__(71771);
// EXTERNAL MODULE: ../../ui/src/index.js + 485 modules
var ui_src = __webpack_require__(66467);
;// CONCATENATED MODULE: ../../../../modes/monai-label/src/toolbarButtons.js
// TODO: torn, can either bake this here; or have to create a whole new button type
// Only ways that you can pass in a custom React component for render :l


const {
  windowLevelPresets
} = src.defaults;
/**
 *
 * @param {*} type - 'tool' | 'action' | 'toggle'
 * @param {*} id
 * @param {*} icon
 * @param {*} label
 */
function _createButton(type, id, icon, label, commands, tooltip, uiType) {
  return {
    id,
    icon,
    label,
    type,
    commands,
    tooltip,
    uiType
  };
}
const _createActionButton = _createButton.bind(null, 'action');
const _createToggleButton = _createButton.bind(null, 'toggle');
const _createToolButton = _createButton.bind(null, 'tool');

/**
 *
 * @param {*} preset - preset number (from above import)
 * @param {*} title
 * @param {*} subtitle
 */
function _createWwwcPreset(preset, title, subtitle) {
  return {
    id: preset.toString(),
    title,
    subtitle,
    type: 'action',
    commands: [{
      commandName: 'setWindowLevel',
      commandOptions: {
        ...windowLevelPresets[preset]
      },
      context: 'CORNERSTONE'
    }]
  };
}
const toolGroupIds = ['default', 'mpr', 'SRToolGroup'];

/**
 * Creates an array of 'setToolActive' commands for the given toolName - one for
 * each toolGroupId specified in toolGroupIds.
 * @param {string} toolName
 * @returns {Array} an array of 'setToolActive' commands
 */
function _createSetToolActiveCommands(toolName) {
  const temp = toolGroupIds.map(toolGroupId => ({
    commandName: 'setToolActive',
    commandOptions: {
      toolGroupId,
      toolName
    },
    context: 'CORNERSTONE'
  }));
  return temp;
}
const toolbarButtons = [
// Measurement
{
  id: 'MeasurementTools',
  type: 'ohif.splitButton',
  props: {
    groupId: 'MeasurementTools',
    isRadio: true,
    // ?
    // Switch?
    primary: _createToolButton('Length', 'tool-length', 'Length', [{
      commandName: 'setToolActive',
      commandOptions: {
        toolName: 'Length'
      },
      context: 'CORNERSTONE'
    }, {
      commandName: 'setToolActive',
      commandOptions: {
        toolName: 'SRLength',
        toolGroupId: 'SRToolGroup'
      },
      // we can use the setToolActive command for this from Cornerstone commandsModule
      context: 'CORNERSTONE'
    }], 'Length'),
    secondary: {
      icon: 'chevron-down',
      label: '',
      isActive: true,
      tooltip: 'More Measure Tools'
    },
    items: [_createToolButton('Length', 'tool-length', 'Length', [{
      commandName: 'setToolActive',
      commandOptions: {
        toolName: 'Length'
      },
      context: 'CORNERSTONE'
    }, {
      commandName: 'setToolActive',
      commandOptions: {
        toolName: 'SRLength',
        toolGroupId: 'SRToolGroup'
      },
      // we can use the setToolActive command for this from Cornerstone commandsModule
      context: 'CORNERSTONE'
    }], 'Length Tool'), _createToolButton('Bidirectional', 'tool-bidirectional', 'Bidirectional', [{
      commandName: 'setToolActive',
      commandOptions: {
        toolName: 'Bidirectional'
      },
      context: 'CORNERSTONE'
    }, {
      commandName: 'setToolActive',
      commandOptions: {
        toolName: 'SRBidirectional',
        toolGroupId: 'SRToolGroup'
      },
      context: 'CORNERSTONE'
    }], 'Bidirectional Tool'), _createToolButton('ArrowAnnotate', 'tool-annotate', 'Annotation', [{
      commandName: 'setToolActive',
      commandOptions: {
        toolName: 'ArrowAnnotate'
      },
      context: 'CORNERSTONE'
    }, {
      commandName: 'setToolActive',
      commandOptions: {
        toolName: 'SRArrowAnnotate',
        toolGroupId: 'SRToolGroup'
      },
      context: 'CORNERSTONE'
    }], 'Arrow Annotate'), _createToolButton('EllipticalROI', 'tool-elipse', 'Ellipse', [{
      commandName: 'setToolActive',
      commandOptions: {
        toolName: 'EllipticalROI'
      },
      context: 'CORNERSTONE'
    }, {
      commandName: 'setToolActive',
      commandOptions: {
        toolName: 'SREllipticalROI',
        toolGroupId: 'SRToolGroup'
      },
      context: 'CORNERSTONE'
    }], 'Ellipse Tool'), _createToolButton('CircleROI', 'tool-circle', 'Circle', [{
      commandName: 'setToolActive',
      commandOptions: {
        toolName: 'CircleROI'
      },
      context: 'CORNERSTONE'
    }, {
      commandName: 'setToolActive',
      commandOptions: {
        toolName: 'SRCircleROI',
        toolGroupId: 'SRToolGroup'
      },
      context: 'CORNERSTONE'
    }], 'Circle Tool')]
  }
},
// Zoom..
{
  id: 'Zoom',
  type: 'ohif.radioGroup',
  props: {
    type: 'tool',
    icon: 'tool-zoom',
    label: 'Zoom',
    commands: _createSetToolActiveCommands('Zoom')
  }
},
// Window Level + Presets...
{
  id: 'WindowLevel',
  type: 'ohif.splitButton',
  props: {
    groupId: 'WindowLevel',
    primary: _createToolButton('WindowLevel', 'tool-window-level', 'Window Level', [{
      commandName: 'setToolActive',
      commandOptions: {
        toolName: 'WindowLevel'
      },
      context: 'CORNERSTONE'
    }], 'Window Level'),
    secondary: {
      icon: 'chevron-down',
      label: 'W/L Manual',
      isActive: true,
      tooltip: 'W/L Presets'
    },
    isAction: true,
    // ?
    renderer: ui_src/* WindowLevelMenuItem */.eJ,
    items: [_createWwwcPreset(1, 'Soft tissue', '400 / 40'), _createWwwcPreset(2, 'Lung', '1500 / -600'), _createWwwcPreset(3, 'Liver', '150 / 90'), _createWwwcPreset(4, 'Bone', '2500 / 480'), _createWwwcPreset(5, 'Brain', '80 / 40')]
  }
},
// Pan...
{
  id: 'Pan',
  type: 'ohif.radioGroup',
  props: {
    type: 'tool',
    icon: 'tool-move',
    label: 'Pan',
    commands: _createSetToolActiveCommands('Pan')
  }
}, {
  id: 'Capture',
  type: 'ohif.action',
  props: {
    icon: 'tool-capture',
    label: 'Capture',
    type: 'action',
    commands: [{
      commandName: 'showDownloadViewportModal',
      commandOptions: {},
      context: 'CORNERSTONE'
    }]
  }
}, {
  id: 'Layout',
  type: 'ohif.layoutSelector',
  props: {
    rows: 3,
    columns: 3
  }
}, {
  id: 'MPR',
  type: 'ohif.action',
  props: {
    type: 'toggle',
    icon: 'icon-mpr',
    label: 'MPR',
    commands: [{
      commandName: 'toggleHangingProtocol',
      commandOptions: {
        protocolId: 'mpr'
      },
      context: 'DEFAULT'
    }]
  }
}, {
  id: 'Crosshairs',
  type: 'ohif.radioGroup',
  props: {
    type: 'tool',
    icon: 'tool-crosshair',
    label: 'Crosshairs',
    commands: [{
      commandName: 'setToolActive',
      commandOptions: {
        toolName: 'Crosshairs',
        toolGroupId: 'mpr'
      },
      context: 'CORNERSTONE'
    }]
  }
},
// More...
{
  id: 'MoreTools',
  type: 'ohif.splitButton',
  props: {
    isRadio: true,
    // ?
    groupId: 'MoreTools',
    primary: _createActionButton('Reset', 'tool-reset', 'Reset View', [{
      commandName: 'resetViewport',
      commandOptions: {},
      context: 'CORNERSTONE'
    }], 'Reset'),
    secondary: {
      icon: 'chevron-down',
      label: '',
      isActive: true,
      tooltip: 'More Tools'
    },
    items: [_createActionButton('Reset', 'tool-reset', 'Reset View', [{
      commandName: 'resetViewport',
      commandOptions: {},
      context: 'CORNERSTONE'
    }], 'Reset'), _createActionButton('rotate-right', 'tool-rotate-right', 'Rotate Right', [{
      commandName: 'rotateViewportCW',
      commandOptions: {},
      context: 'CORNERSTONE'
    }], 'Rotate +90'), _createActionButton('flip-horizontal', 'tool-flip-horizontal', 'Flip Horizontally', [{
      commandName: 'flipViewportHorizontal',
      commandOptions: {},
      context: 'CORNERSTONE'
    }], 'Flip Horizontal'), _createToggleButton('StackImageSync', 'link', 'Stack Image Sync', [{
      commandName: 'toggleStackImageSync',
      commandOptions: {},
      context: 'CORNERSTONE'
    }]), _createToggleButton('ReferenceLines', 'tool-referenceLines',
    // change this with the new icon
    'Reference Lines', [{
      commandName: 'toggleReferenceLines',
      commandOptions: {},
      context: 'CORNERSTONE'
    }]), _createToolButton('StackScroll', 'tool-stack-scroll', 'Stack Scroll', [{
      commandName: 'setToolActive',
      commandOptions: {
        toolName: 'StackScroll'
      },
      context: 'CORNERSTONE'
    }], 'Stack Scroll'), _createActionButton('invert', 'tool-invert', 'Invert', [{
      commandName: 'invertViewport',
      commandOptions: {},
      context: 'CORNERSTONE'
    }], 'Invert Colors'), _createToolButton('Probe', 'tool-probe', 'Probe', [{
      commandName: 'setToolActive',
      commandOptions: {
        toolName: 'DragProbe'
      },
      context: 'CORNERSTONE'
    }], 'Probe'), _createToggleButton('cine', 'tool-cine', 'Cine', [{
      commandName: 'toggleCine',
      context: 'CORNERSTONE'
    }], 'Cine'), _createToolButton('Angle', 'tool-angle', 'Angle', [{
      commandName: 'setToolActive',
      commandOptions: {
        toolName: 'Angle'
      },
      context: 'CORNERSTONE'
    }], 'Angle'),
    // Next two tools can be added once icons are added
    // _createToolButton(
    //   'Cobb Angle',
    //   'tool-cobb-angle',
    //   'Cobb Angle',
    //   [
    //     {
    //       commandName: 'setToolActive',
    //       commandOptions: {
    //         toolName: 'CobbAngle',
    //       },
    //       context: 'CORNERSTONE',
    //     },
    //   ],
    //   'Cobb Angle'
    // ),
    // _createToolButton(
    //   'Planar Freehand ROI',
    //   'tool-freehand',
    //   'PlanarFreehandROI',
    //   [
    //     {
    //       commandName: 'setToolActive',
    //       commandOptions: {
    //         toolName: 'PlanarFreehandROI',
    //       },
    //       context: 'CORNERSTONE',
    //     },
    //   ],
    //   'Planar Freehand ROI'
    // ),
    _createToolButton('Magnify', 'tool-magnify', 'Magnify', [{
      commandName: 'setToolActive',
      commandOptions: {
        toolName: 'Magnify'
      },
      context: 'CORNERSTONE'
    }], 'Magnify'), _createToolButton('Rectangle', 'tool-rectangle', 'Rectangle', [{
      commandName: 'setToolActive',
      commandOptions: {
        toolName: 'RectangleROI'
      },
      context: 'CORNERSTONE'
    }], 'Rectangle'), _createToolButton('CalibrationLine', 'tool-calibration', 'Calibration', [{
      commandName: 'setToolActive',
      commandOptions: {
        toolName: 'CalibrationLine'
      },
      context: 'CORNERSTONE'
    }], 'Calibration Line'), _createActionButton('TagBrowser', 'list-bullets', 'Dicom Tag Browser', [{
      commandName: 'openDICOMTagViewer',
      commandOptions: {},
      context: 'DEFAULT'
    }], 'Dicom Tag Browser')]
  }
}];
/* harmony default export */ const src_toolbarButtons = (toolbarButtons);
;// CONCATENATED MODULE: ../../../../modes/monai-label/package.json
const package_namespaceObject = JSON.parse('{"u2":"@ohif/mode-monai-label"}');
;// CONCATENATED MODULE: ../../../../modes/monai-label/src/id.js

const id = package_namespaceObject.u2;

;// CONCATENATED MODULE: ../../../../modes/monai-label/src/initToolGroups.js
const brushInstanceNames = {
  CircularBrush: 'CircularBrush',
  CircularEraser: 'CircularEraser',
  SphereBrush: 'SphereBrush',
  SphereEraser: 'SphereEraser',
  ThresholdCircularBrush: 'ThresholdCircularBrush',
  ThresholdSphereBrush: 'ThresholdSphereBrush'
};
const brushStrategies = {
  [brushInstanceNames.CircularBrush]: 'FILL_INSIDE_CIRCLE',
  [brushInstanceNames.CircularEraser]: 'ERASE_INSIDE_CIRCLE',
  [brushInstanceNames.SphereBrush]: 'FILL_INSIDE_SPHERE',
  [brushInstanceNames.SphereEraser]: 'ERASE_INSIDE_SPHERE',
  [brushInstanceNames.ThresholdCircularBrush]: 'THRESHOLD_INSIDE_CIRCLE',
  [brushInstanceNames.ThresholdSphereBrush]: 'THRESHOLD_INSIDE_SPHERE'
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
      }]
    }, {
      toolName: toolNames.StackScrollMouseWheel,
      bindings: []
    }],
    passive: [{
      toolName: toolNames.CircleScissors
    }, {
      toolName: toolNames.RectangleScissors
    }, {
      toolName: toolNames.SphereScissors
    }, {
      toolName: brushInstanceNames.CircularBrush,
      parentTool: 'Brush',
      configuration: {
        activeStrategy: brushStrategies.CircularBrush
      }
    }, {
      toolName: brushInstanceNames.CircularEraser,
      parentTool: 'Brush',
      configuration: {
        activeStrategy: brushStrategies.CircularEraser
      }
    }, {
      toolName: brushInstanceNames.SphereEraser,
      parentTool: 'Brush',
      configuration: {
        activeStrategy: brushStrategies.SphereEraser
      }
    }, {
      toolName: brushInstanceNames.SphereBrush,
      parentTool: 'Brush',
      configuration: {
        activeStrategy: brushStrategies.SphereBrush
      }
    }, {
      toolName: brushInstanceNames.ThresholdCircularBrush,
      parentTool: 'Brush',
      configuration: {
        activeStrategy: brushStrategies.ThresholdCircularBrush
      }
    }, {
      toolName: brushInstanceNames.ThresholdSphereBrush,
      parentTool: 'Brush',
      configuration: {
        activeStrategy: brushStrategies.ThresholdSphereBrush
      }
    }, {
      toolName: toolNames.StackScroll
    }, {
      toolName: toolNames.Magnify
    }, {
      toolName: toolNames.SegmentationDisplay
    }, {
      toolName: 'ProbeMONAILabel'
    }],
    // enabled
    // disabled
    disabled: [{
      toolName: toolNames.ReferenceLines
    }]
  };
  toolGroupService.createToolGroupAndAddTools(toolGroupId, tools);
}
function initMPRToolGroup(extensionManager, toolGroupService, commandsManager) {
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
      }]
    }, {
      toolName: toolNames.StackScrollMouseWheel,
      bindings: []
    }],
    passive: [{
      toolName: toolNames.CircleScissors
    }, {
      toolName: toolNames.RectangleScissors
    }, {
      toolName: toolNames.SphereScissors
    }, {
      toolName: brushInstanceNames.CircularBrush,
      parentTool: 'Brush',
      configuration: {
        activeStrategy: brushStrategies.CircularBrush
      }
    }, {
      toolName: brushInstanceNames.CircularEraser,
      parentTool: 'Brush',
      configuration: {
        activeStrategy: brushStrategies.CircularEraser
      }
    }, {
      toolName: brushInstanceNames.SphereEraser,
      parentTool: 'Brush',
      configuration: {
        activeStrategy: brushStrategies.SphereEraser
      }
    }, {
      toolName: brushInstanceNames.SphereBrush,
      parentTool: 'Brush',
      configuration: {
        activeStrategy: brushStrategies.SphereBrush
      }
    }, {
      toolName: brushInstanceNames.ThresholdCircularBrush,
      parentTool: 'Brush',
      configuration: {
        activeStrategy: brushStrategies.ThresholdCircularBrush
      }
    }, {
      toolName: brushInstanceNames.ThresholdSphereBrush,
      parentTool: 'Brush',
      configuration: {
        activeStrategy: brushStrategies.ThresholdSphereBrush
      }
    }, {
      toolName: toolNames.SegmentationDisplay
    }, {
      toolName: 'ProbeMONAILabel'
    }, {
      toolName: 'ProbeMONAILabel'
    }],
    disabled: [{
      toolName: toolNames.Crosshairs,
      configuration: {
        viewportIndicators: false,
        autoPan: {
          enabled: false,
          panSize: 10
        }
      }
    }, {
      toolName: toolNames.ReferenceLines
    }]
    // enabled
    // disabled
  };

  toolGroupService.createToolGroupAndAddTools('mpr', tools);
}
function initToolGroups(extensionManager, toolGroupService, commandsManager) {
  initDefaultToolGroup(extensionManager, toolGroupService, commandsManager, 'default');
  initMPRToolGroup(extensionManager, toolGroupService, commandsManager);
}
/* harmony default export */ const src_initToolGroups = (initToolGroups);
;// CONCATENATED MODULE: ../../../../modes/monai-label/src/index.tsx




const ohif = {
  layout: '@ohif/extension-default.layoutTemplateModule.viewerLayout',
  sopClassHandler: '@ohif/extension-default.sopClassHandlerModule.stack',
  hangingProtocol: '@ohif/extension-default.hangingProtocolModule.default',
  leftPanel: '@ohif/extension-default.panelModule.seriesList'
};
const monailabel = {
  monaiLabel: '@ohif/extension-monai-label.panelModule.monailabel'
};
const cornerstone = {
  viewport: '@ohif/extension-cornerstone.viewportModule.cornerstone'
};
const dicomSeg = {
  sopClassHandler: '@ohif/extension-cornerstone-dicom-seg.sopClassHandlerModule.dicom-seg',
  viewport: '@ohif/extension-cornerstone-dicom-seg.viewportModule.dicom-seg',
  panel: '@ohif/extension-cornerstone-dicom-seg.panelModule.panelSegmentation'
};

/**
 * Just two dependencies to be able to render a viewport with panels in order
 * to make sure that the mode is working.
 */
const extensionDependencies = {
  '@ohif/extension-default': '^3.0.0',
  '@ohif/extension-cornerstone': '^3.0.0',
  '@ohif/extension-cornerstone-dicom-seg': '^3.0.0',
  '@ohif/extension-test': '^0.0.1',
  '@ohif/extension-monai-label': '^0.0.1'
};
function modeFactory(_ref) {
  let {
    modeConfiguration
  } = _ref;
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
    onModeEnter: _ref2 => {
      let {
        servicesManager,
        extensionManager,
        commandsManager
      } = _ref2;
      const {
        measurementService,
        toolbarService,
        toolGroupService,
        customizationService
      } = servicesManager.services;
      measurementService.clearMeasurements();

      // Init Default and SR ToolGroups
      src_initToolGroups(extensionManager, toolGroupService, commandsManager);

      // init customizations
      customizationService.addModeCustomizations(['@ohif/extension-test.customizationModule.custom-context-menu']);
      let unsubscribe;
      const activateTool = () => {
        toolbarService.recordInteraction({
          groupId: 'WindowLevel',
          itemId: 'WindowLevel',
          interactionType: 'tool',
          commands: [{
            commandName: 'setToolActive',
            commandOptions: {
              toolName: 'WindowLevel'
            },
            context: 'CORNERSTONE'
          }]
        });

        // We don't need to reset the active tool whenever a viewport is getting
        // added to the toolGroup.
        unsubscribe();
      };

      // Since we only have one viewport for the basic cs3d mode and it has
      // only one hanging protocol, we can just use the first viewport
      ({
        unsubscribe
      } = toolGroupService.subscribe(toolGroupService.EVENTS.VIEWPORT_ADDED, activateTool));
      toolbarService.init(extensionManager);
      toolbarService.addButtons(src_toolbarButtons);
      toolbarService.createButtonSection('primary', ['MeasurementTools', 'Zoom', 'WindowLevel', 'Pan', 'Capture', 'Layout', 'MPR', 'Crosshairs', 'MoreTools']);
    },
    onModeExit: _ref3 => {
      let {
        servicesManager
      } = _ref3;
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
    /** */
    validationTags: {
      study: [],
      series: []
    },
    /**
     * A boolean return value that indicates whether the mode is valid for the
     * modalities of the selected studies. For instance a PET/CT mode should be
     */
    isValidMode: function (_ref4) {
      let {
        modalities
      } = _ref4;
      const modalities_list = modalities.split('\\');
      const isValid = modalities_list.includes('CT') || modalities_list.includes('MR');
      // Only CT or MR modalities
      return isValid;
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
      path: 'monai-label',
      layoutTemplate: _ref5 => {
        let {
          location,
          servicesManager
        } = _ref5;
        return {
          id: ohif.layout,
          props: {
            rightPanelDefaultClosed: false,
            /* leftPanelDefaultClosed: true, */
            leftPanels: [ohif.leftPanel],
            rightPanels: [monailabel.monaiLabel],
            viewports: [{
              namespace: cornerstone.viewport,
              displaySetsToDisplay: [ohif.sopClassHandler]
            }, {
              namespace: dicomSeg.viewport,
              displaySetsToDisplay: [dicomSeg.sopClassHandler]
            }]
          }
        };
      }
    }],
    /** List of extensions that are used by the mode */
    extensions: extensionDependencies,
    /** HangingProtocol used by the mode */
    hangingProtocol: 'mpr',
    // hangingProtocol: [''],
    /** SopClassHandlers used by the mode */
    sopClassHandlers: [dicomSeg.sopClassHandler, ohif.sopClassHandler] /** hotkeys for mode */,
    hotkeys: [...src/* hotkeys */.dD.defaults.hotkeyBindings]
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