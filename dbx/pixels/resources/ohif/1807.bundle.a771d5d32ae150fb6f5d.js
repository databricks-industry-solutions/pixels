"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[1807],{

/***/ 41807:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ tmtv_src)
});

// EXTERNAL MODULE: ../../core/src/index.ts + 69 modules
var src = __webpack_require__(62037);
;// CONCATENATED MODULE: ../../../modes/tmtv/src/initToolGroups.js
const toolGroupIds = {
  CT: 'ctToolGroup',
  PT: 'ptToolGroup',
  Fusion: 'fusionToolGroup',
  MIP: 'mipToolGroup',
  default: 'default'
};
function _initToolGroups(toolNames, Enums, toolGroupService, commandsManager) {
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
      toolName: toolNames.StackScroll,
      bindings: [{
        mouseButton: Enums.MouseBindings.Wheel
      }]
    }],
    passive: [{
      toolName: toolNames.Length
    }, {
      toolName: toolNames.SegmentBidirectional
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
      toolName: 'CircularBrush',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'FILL_INSIDE_CIRCLE'
      }
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
        // preview: {
        //   enabled: true,
        // },
        threshold: {
          isDynamic: true,
          dynamicRadius: 3
        }
      }
    }],
    enabled: [],
    disabled: [{
      toolName: toolNames.Crosshairs,
      configuration: {
        disableOnPassive: true,
        autoPan: {
          enabled: false,
          panSize: 10
        }
      }
    }]
  };
  toolGroupService.createToolGroupAndAddTools(toolGroupIds.CT, tools);
  toolGroupService.createToolGroupAndAddTools(toolGroupIds.PT, {
    active: tools.active,
    passive: [...tools.passive, {
      toolName: 'RectangleROIStartEndThreshold'
    }],
    enabled: tools.enabled,
    disabled: tools.disabled
  });
  toolGroupService.createToolGroupAndAddTools(toolGroupIds.Fusion, tools);
  toolGroupService.createToolGroupAndAddTools(toolGroupIds.default, tools);
  const mipTools = {
    active: [{
      toolName: toolNames.VolumeRotate,
      bindings: [{
        mouseButton: Enums.MouseBindings.Wheel
      }],
      configuration: {
        rotateIncrementDegrees: 5
      }
    }, {
      toolName: toolNames.MipJumpToClick,
      configuration: {
        toolGroupId: toolGroupIds.PT
      },
      bindings: [{
        mouseButton: Enums.MouseBindings.Primary
      }]
    }],
    enabled: [{
      toolName: toolNames.OrientationMarker,
      configuration: {
        orientationWidget: {
          viewportCorner: 'BOTTOM_LEFT'
        }
      }
    }]
  };
  toolGroupService.createToolGroupAndAddTools(toolGroupIds.MIP, mipTools);
}
function initToolGroups(toolNames, Enums, toolGroupService, commandsManager) {
  _initToolGroups(toolNames, Enums, toolGroupService, commandsManager);
}
/* harmony default export */ const src_initToolGroups = (initToolGroups);
;// CONCATENATED MODULE: ../../../modes/tmtv/src/toolbarButtons.ts

const setToolActiveToolbar = {
  commandName: 'setToolActiveToolbar',
  commandOptions: {
    toolGroupIds: [toolGroupIds.CT, toolGroupIds.PT, toolGroupIds.Fusion]
  }
};
const toolbarButtons = [{
  id: 'MeasurementTools',
  uiType: 'ohif.toolButtonList',
  props: {
    buttonSection: 'measurementSection',
    groupId: 'MeasurementTools'
  }
}, {
  id: 'SegmentationTools',
  uiType: 'ohif.toolBoxButton',
  props: {
    groupId: 'SegmentationTools',
    buttonSection: 'segmentationToolboxToolsSection'
  }
}, {
  id: 'BrushTools',
  uiType: 'ohif.toolBoxButtonGroup',
  props: {
    buttonSection: 'brushToolsSection',
    groupId: 'BrushTools'
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
    label: 'Arrow Annotate',
    tooltip: 'Arrow Annotate Tool',
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'EllipticalROI',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-ellipse',
    label: 'Ellipse',
    tooltip: 'Ellipse Tool',
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
  id: 'Crosshairs',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-crosshair',
    label: 'Crosshairs',
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
  id: 'RectangleROIStartEndThreshold',
  uiType: 'ohif.toolBoxButton',
  props: {
    icon: 'tool-create-threshold',
    label: 'Rectangle ROI Threshold',
    commands: setToolActiveToolbar,
    evaluate: ['evaluate.cornerstone.segmentation', {
      name: 'evaluate.cornerstoneTool',
      disabledText: 'Select the PT Axial to enable this tool'
    }],
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
  uiType: 'ohif.toolButton',
  props: {
    icon: 'icon-tool-threshold',
    label: 'Threshold Tool',
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
      value: 25,
      commands: {
        commandName: 'setBrushSize',
        commandOptions: {
          toolNames: ['ThresholdCircularBrush', 'ThresholdSphereBrush', 'ThresholdCircularBrushDynamic']
        }
      }
    }, {
      name: 'Threshold',
      type: 'radio',
      id: 'dynamic-mode',
      value: 'ThresholdRange',
      values: [{
        value: 'ThresholdDynamic',
        label: 'Dynamic'
      }, {
        value: 'ThresholdRange',
        label: 'Range'
      }],
      commands: ({
        value,
        commandsManager
      }) => {
        if (value === 'ThresholdDynamic') {
          commandsManager.run('setToolActive', {
            toolName: 'ThresholdCircularBrushDynamic'
          });
        } else {
          commandsManager.run('setToolActive', {
            toolName: 'ThresholdCircularBrush'
          });
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
      condition: ({
        options
      }) => options.find(option => option.id === 'dynamic-mode').value === 'ThresholdRange',
      commands: 'setToolActiveToolbar'
    }, {
      name: 'ThresholdRange',
      type: 'double-range',
      id: 'threshold-range',
      min: 0,
      max: 50,
      step: 0.5,
      value: [2.5, 50],
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
}];
/* harmony default export */ const src_toolbarButtons = (toolbarButtons);
;// CONCATENATED MODULE: ../../../modes/tmtv/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/mode-tmtv"}');
;// CONCATENATED MODULE: ../../../modes/tmtv/src/id.js

const id = package_namespaceObject.UU;

;// CONCATENATED MODULE: ../../../modes/tmtv/src/utils/setCrosshairsConfiguration.js

function setCrosshairsConfiguration(matches, toolNames, toolGroupService, displaySetService) {
  const matchDetails = matches.get('ctDisplaySet');
  if (!matchDetails) {
    return;
  }
  const {
    SeriesInstanceUID
  } = matchDetails;
  const displaySets = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID);
  const toolConfig = toolGroupService.getToolConfiguration(toolGroupIds.Fusion, toolNames.Crosshairs);
  const crosshairsConfig = {
    ...toolConfig,
    filterActorUIDsToSetSlabThickness: [displaySets[0].displaySetInstanceUID]
  };
  toolGroupService.setToolConfiguration(toolGroupIds.Fusion, toolNames.Crosshairs, crosshairsConfig);
}
;// CONCATENATED MODULE: ../../../modes/tmtv/src/utils/setFusionActiveVolume.js

function setFusionActiveVolume(matches, toolNames, toolGroupService, displaySetService) {
  const matchDetails = matches.get('ptDisplaySet');
  const matchDetails2 = matches.get('ctDisplaySet');
  if (!matchDetails) {
    return;
  }
  const {
    SeriesInstanceUID
  } = matchDetails;
  const displaySets = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID);
  if (!displaySets || displaySets.length === 0) {
    return;
  }
  const wlToolConfig = toolGroupService.getToolConfiguration(toolGroupIds.Fusion, toolNames.WindowLevel);
  const ellipticalToolConfig = toolGroupService.getToolConfiguration(toolGroupIds.Fusion, toolNames.EllipticalROI);

  // Todo: this should not take into account the loader id
  const volumeId = `cornerstoneStreamingImageVolume:${displaySets[0].displaySetInstanceUID}`;
  const {
    SeriesInstanceUID: SeriesInstanceUID2
  } = matchDetails2;
  const ctDisplaySets = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID2);
  const ctVolumeId = `cornerstoneStreamingImageVolume:${ctDisplaySets[0].displaySetInstanceUID}`;
  const windowLevelConfig = {
    ...wlToolConfig,
    volumeId: ctVolumeId
  };
  const ellipticalROIConfig = {
    ...ellipticalToolConfig,
    volumeId
  };
  toolGroupService.setToolConfiguration(toolGroupIds.Fusion, toolNames.WindowLevel, windowLevelConfig);
  toolGroupService.setToolConfiguration(toolGroupIds.Fusion, toolNames.EllipticalROI, ellipticalROIConfig);
}
// EXTERNAL MODULE: ../../../node_modules/i18next/dist/esm/i18next.js
var i18next = __webpack_require__(40680);
;// CONCATENATED MODULE: ../../../modes/tmtv/src/index.ts







const {
  MetadataProvider
} = src/* classes */.Ly;
const ohif = {
  layout: '@ohif/extension-default.layoutTemplateModule.viewerLayout',
  sopClassHandler: '@ohif/extension-default.sopClassHandlerModule.stack',
  thumbnailList: '@ohif/extension-default.panelModule.seriesList'
};
const cs3d = {
  viewport: '@ohif/extension-cornerstone.viewportModule.cornerstone',
  segPanel: '@ohif/extension-cornerstone.panelModule.panelSegmentationNoHeader',
  measurements: '@ohif/extension-cornerstone.panelModule.measurements'
};
const tmtv = {
  hangingProtocol: '@ohif/extension-tmtv.hangingProtocolModule.ptCT',
  petSUV: '@ohif/extension-tmtv.panelModule.petSUV',
  tmtv: '@ohif/extension-tmtv.panelModule.tmtv'
};
const extensionDependencies = {
  // Can derive the versions at least process.env.from npm_package_version
  '@ohif/extension-default': '^3.0.0',
  '@ohif/extension-cornerstone': '^3.0.0',
  '@ohif/extension-cornerstone-dicom-seg': '^3.0.0',
  '@ohif/extension-tmtv': '^3.0.0'
};
const unsubscriptions = [];
function modeFactory({
  modeConfiguration
}) {
  return {
    // TODO: We're using this as a route segment
    // We should not be.
    id: id,
    routeName: 'tmtv',
    displayName: i18next/* default */.A.t('Modes:Total Metabolic Tumor Volume'),
    /**
     * Lifecycle hooks
     */
    onModeEnter: ({
      servicesManager,
      extensionManager,
      commandsManager
    }) => {
      const {
        toolbarService,
        toolGroupService,
        customizationService,
        hangingProtocolService,
        displaySetService
      } = servicesManager.services;
      const utilityModule = extensionManager.getModuleEntry('@ohif/extension-cornerstone.utilityModule.tools');
      const {
        toolNames,
        Enums
      } = utilityModule.exports;

      // Init Default and SR ToolGroups
      src_initToolGroups(toolNames, Enums, toolGroupService, commandsManager);
      const {
        unsubscribe
      } = toolGroupService.subscribe(toolGroupService.EVENTS.VIEWPORT_ADDED, () => {
        // For fusion toolGroup we need to add the volumeIds for the crosshairs
        // since in the fusion viewport we don't want both PT and CT to render MIP
        // when slabThickness is modified
        const {
          displaySetMatchDetails
        } = hangingProtocolService.getMatchDetails();
        setCrosshairsConfiguration(displaySetMatchDetails, toolNames, toolGroupService, displaySetService);
        setFusionActiveVolume(displaySetMatchDetails, toolNames, toolGroupService, displaySetService);
      });
      unsubscriptions.push(unsubscribe);
      toolbarService.addButtons(src_toolbarButtons);
      toolbarService.createButtonSection('primary', ['MeasurementTools', 'Zoom', 'WindowLevel', 'Crosshairs', 'Pan']);
      toolbarService.createButtonSection('measurementSection', ['Length', 'Bidirectional', 'ArrowAnnotate', 'EllipticalROI']);
      toolbarService.createButtonSection('ROIThresholdToolbox', ['SegmentationTools']);
      toolbarService.createButtonSection('segmentationToolboxToolsSection', ['RectangleROIStartEndThreshold', 'BrushTools']);
      toolbarService.createButtonSection('brushToolsSection', ['Brush', 'Eraser', 'Threshold']);
      customizationService.setCustomizations({
        'panelSegmentation.tableMode': {
          $set: 'expanded'
        },
        'panelSegmentation.onSegmentationAdd': {
          $set: () => {
            commandsManager.run('createNewLabelmapFromPT');
          }
        }
      });

      // For the hanging protocol we need to decide on the window level
      // based on whether the SUV is corrected or not, hence we can't hard
      // code the window level in the hanging protocol but we add a custom
      // attribute to the hanging protocol that will be used to get the
      // window level based on the metadata
      hangingProtocolService.addCustomAttribute('getPTVOIRange', 'get PT VOI based on corrected or not', props => {
        const ptDisplaySet = props.find(imageSet => imageSet.Modality === 'PT');
        if (!ptDisplaySet) {
          return;
        }
        const {
          imageId
        } = ptDisplaySet.images[0];
        const imageIdScalingFactor = MetadataProvider.get('scalingModule', imageId);
        const isSUVAvailable = imageIdScalingFactor && imageIdScalingFactor.suvbw;
        if (isSUVAvailable) {
          return {
            windowWidth: 5,
            windowCenter: 2.5
          };
        }
        return;
      });
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
      unsubscriptions.forEach(unsubscribe => unsubscribe());
      uiDialogService.hideAll();
      uiModalService.hide();
      toolGroupService.destroy();
      syncGroupService.destroy();
      segmentationService.destroy();
      cornerstoneViewportService.destroy();
    },
    validationTags: {
      study: [],
      series: []
    },
    isValidMode: ({
      modalities,
      study
    }) => {
      const modalities_list = modalities.split('\\');
      const invalidModalities = ['SM'];
      const isValid = modalities_list.includes('CT') && study.mrn !== 'M1' && modalities_list.includes('PT') && !invalidModalities.some(modality => modalities_list.includes(modality)) &&
      // This is study is a 4D study with PT and CT and not a 3D study for the tmtv
      // mode, until we have a better way to identify 4D studies we will use the
      // StudyInstanceUID to identify the study
      // Todo: when we add the 4D mode which comes with a mechanism to identify
      // 4D studies we can use that
      study.studyInstanceUid !== '1.3.6.1.4.1.12842.1.1.14.3.20220915.105557.468.2963630849';

      // there should be both CT and PT modalities and the modality should not be SM
      return {
        valid: isValid,
        description: 'The mode requires both PT and CT series in the study'
      };
    },
    routes: [{
      path: 'tmtv',
      /*init: ({ servicesManager, extensionManager }) => {
        //defaultViewerRouteInit
      },*/
      layoutTemplate: () => {
        return {
          id: ohif.layout,
          props: {
            leftPanels: [ohif.thumbnailList],
            leftPanelResizable: true,
            leftPanelClosed: true,
            rightPanels: [tmtv.tmtv, tmtv.petSUV],
            rightPanelResizable: true,
            viewports: [{
              namespace: cs3d.viewport,
              displaySetsToDisplay: [ohif.sopClassHandler]
            }]
          }
        };
      }
    }],
    extensions: extensionDependencies,
    hangingProtocol: tmtv.hangingProtocol,
    sopClassHandlers: [ohif.sopClassHandler],
    ...modeConfiguration
  };
}
const mode = {
  id: id,
  modeFactory,
  extensionDependencies
};
/* harmony default export */ const tmtv_src = (mode);

/***/ })

}]);