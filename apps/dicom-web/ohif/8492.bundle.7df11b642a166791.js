"use strict";
(globalThis["rspackChunk"] = globalThis["rspackChunk"] || []).push([[8492], {
69387(__unused_rspack_module, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ modes_tmtv_src)
});

// UNUSED EXPORTS: cs3d, customizations, extensionDependencies, initToolGroups, modeInstance, ohif, onModeEnter, tmtv, tmtvLayout, tmtvRoute

// EXTERNAL MODULE: ../../core/src/index.ts + 75 modules
var src = __webpack_require__(50679);
// EXTERNAL MODULE: ../../../modes/basic/src/index.tsx + 4 modules
var basic_src = __webpack_require__(69932);
// EXTERNAL MODULE: ../../../node_modules/i18next/dist/esm/i18next.js
var i18next = __webpack_require__(40680);
;// CONCATENATED MODULE: ../../../modes/tmtv/package.json
var package_namespaceObject = JSON.parse('{"UU":"@ohif/mode-tmtv"}')
;// CONCATENATED MODULE: ../../../modes/tmtv/src/id.js

const id = package_namespaceObject.UU;

// EXTERNAL MODULE: ../../../extensions/tmtv/src/index.tsx + 27 modules
var tmtv_src = __webpack_require__(87110);
;// CONCATENATED MODULE: ../../../modes/tmtv/src/constants.ts
const MIN_SEGMENTATION_DRAWING_RADIUS = 0.5;
const MAX_SEGMENTATION_DRAWING_RADIUS = 99.5;
;// CONCATENATED MODULE: ../../../modes/tmtv/src/initToolGroups.js



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
        activeStrategy: 'FILL_INSIDE_CIRCLE',
        minRadius: (/* inlined export .MIN_SEGMENTATION_DRAWING_RADIUS */0.5),
        maxRadius: (/* inlined export .MAX_SEGMENTATION_DRAWING_RADIUS */99.5)
      }
    }, {
      toolName: 'CircularEraser',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'ERASE_INSIDE_CIRCLE',
        minRadius: (/* inlined export .MIN_SEGMENTATION_DRAWING_RADIUS */0.5),
        maxRadius: (/* inlined export .MAX_SEGMENTATION_DRAWING_RADIUS */99.5)
      }
    }, {
      toolName: 'SphereBrush',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'FILL_INSIDE_SPHERE',
        minRadius: (/* inlined export .MIN_SEGMENTATION_DRAWING_RADIUS */0.5),
        maxRadius: (/* inlined export .MAX_SEGMENTATION_DRAWING_RADIUS */99.5)
      }
    }, {
      toolName: 'SphereEraser',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'ERASE_INSIDE_SPHERE',
        minRadius: (/* inlined export .MIN_SEGMENTATION_DRAWING_RADIUS */0.5),
        maxRadius: (/* inlined export .MAX_SEGMENTATION_DRAWING_RADIUS */99.5)
      }
    }, {
      toolName: 'ThresholdCircularBrush',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'THRESHOLD_INSIDE_CIRCLE',
        minRadius: (/* inlined export .MIN_SEGMENTATION_DRAWING_RADIUS */0.5),
        maxRadius: (/* inlined export .MAX_SEGMENTATION_DRAWING_RADIUS */99.5)
      }
    }, {
      toolName: 'ThresholdSphereBrush',
      parentTool: 'Brush',
      configuration: {
        activeStrategy: 'THRESHOLD_INSIDE_SPHERE',
        minRadius: (/* inlined export .MIN_SEGMENTATION_DRAWING_RADIUS */0.5),
        maxRadius: (/* inlined export .MAX_SEGMENTATION_DRAWING_RADIUS */99.5)
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
        },
        minRadius: (/* inlined export .MIN_SEGMENTATION_DRAWING_RADIUS */0.5),
        maxRadius: (/* inlined export .MAX_SEGMENTATION_DRAWING_RADIUS */99.5)
      }
    }],
    enabled: [],
    disabled: [{
      toolName: toolNames.Crosshairs,
      bindings: [{
        mouseButton: Enums.MouseBindings.Primary,
        modifierKey: Enums.KeyboardBindings.Shift
      }],
      configuration: {
        disableOnPassive: true,
        autoPan: {
          enabled: false,
          panSize: 10
        }
      }
    }]
  };
  toolGroupService.createToolGroupAndAddTools(tmtv_src/* .toolGroupIds.CT */.i.CT, tools);
  toolGroupService.createToolGroupAndAddTools(tmtv_src/* .toolGroupIds.PT */.i.PT, {
    active: tools.active,
    passive: [...tools.passive, {
      toolName: 'RectangleROIStartEndThreshold'
    }],
    enabled: tools.enabled,
    disabled: tools.disabled
  });
  toolGroupService.createToolGroupAndAddTools(tmtv_src/* .toolGroupIds.Fusion */.i.Fusion, tools);
  toolGroupService.createToolGroupAndAddTools(tmtv_src/* .toolGroupIds["default"] */.i["default"], tools);
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
        toolGroupId: tmtv_src/* .toolGroupIds.PT */.i.PT
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
  toolGroupService.createToolGroupAndAddTools(tmtv_src/* .toolGroupIds.MIP */.i.MIP, mipTools);
}

/**
 * Mode tool group setup, sharing the options-object signature used by all
 * modes so implementations are interchangeable via the `initToolGroups` mode
 * instance property.
 */
function initToolGroups({
  extensionManager,
  toolGroupService,
  commandsManager
}) {
  const utilityModule = extensionManager.getModuleEntry('@ohif/extension-cornerstone.utilityModule.tools');
  const {
    toolNames,
    Enums
  } = utilityModule.exports;
  _initToolGroups(toolNames, Enums, toolGroupService, commandsManager);
}
/* export default */ const src_initToolGroups = (initToolGroups);
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
  const toolConfig = toolGroupService.getToolConfiguration(tmtv_src/* .toolGroupIds.Fusion */.i.Fusion, toolNames.Crosshairs);
  const crosshairsConfig = {
    ...toolConfig,
    filterActorUIDsToSetSlabThickness: [displaySets[0].displaySetInstanceUID]
  };
  toolGroupService.setToolConfiguration(tmtv_src/* .toolGroupIds.Fusion */.i.Fusion, toolNames.Crosshairs, crosshairsConfig);
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
  const wlToolConfig = toolGroupService.getToolConfiguration(tmtv_src/* .toolGroupIds.Fusion */.i.Fusion, toolNames.WindowLevel);
  const ellipticalToolConfig = toolGroupService.getToolConfiguration(tmtv_src/* .toolGroupIds.Fusion */.i.Fusion, toolNames.EllipticalROI);

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
  toolGroupService.setToolConfiguration(tmtv_src/* .toolGroupIds.Fusion */.i.Fusion, toolNames.WindowLevel, windowLevelConfig);
  toolGroupService.setToolConfiguration(tmtv_src/* .toolGroupIds.Fusion */.i.Fusion, toolNames.EllipticalROI, ellipticalROIConfig);
}
;// CONCATENATED MODULE: ../../../modes/tmtv/src/index.ts







const {
  MetadataProvider
} = src/* .classes */.Ly;
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

/**
 * Extends the basic mode enter (tool groups, toolbar, tool group additions)
 * with the TMTV specifics: the fusion viewport crosshairs/active-volume
 * configuration and the PT VOI hanging protocol attribute.
 */
function onModeEnter(ctx) {
  basic_src/* .onModeEnter.call */.jQ.call(this, ctx);
  const {
    servicesManager,
    extensionManager,
    commandsManager
  } = ctx;
  const {
    toolGroupService,
    customizationService,
    hangingProtocolService,
    displaySetService
  } = servicesManager.services;
  const utilityModule = extensionManager.getModuleEntry('@ohif/extension-cornerstone.utilityModule.tools');
  const {
    toolNames
  } = utilityModule.exports;
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
  this._unsubscriptions.push(unsubscribe);

  // Function-valued customization; kept out of the registered
  // `tmtvModeCustomizations` block because it needs the mode's
  // commandsManager.  Written at mode scope, so a global-scope customization
  // still overrides it by scope precedence.
  customizationService.setCustomizations({
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
}
const tmtvLayout = {
  id: ohif.layout,
  props: {
    // Literal panel lists; the mode route seeds them into the standard
    // `leftPanels` / `rightPanels` customizations so `mode` phase
    // blocks and global customizations can modify them.
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
const tmtvRoute = {
  path: 'tmtv',
  layoutTemplate: basic_src/* .layoutTemplate */.ZM,
  layoutInstance: tmtvLayout
};
const modeInstance = {
  // TODO: We're using this as a route segment
  // We should not be.
  id: id,
  routeName: 'tmtv',
  displayName: i18next/* ["default"].t */.A.t('Modes:Total Metabolic Tumor Volume'),
  // Toolbar/tool-group composition: which capability packs this mode uses.
  // The mode route seeds these onto the Mode customization scope on enter, so
  // `?customization=` modules extend them through the `mode` phase. The tmtv
  // extension supplies the TMTV-specific button/section packs.
  toolbarButtons: [{
    $reference: 'tmtv.toolbarButtons'
  }],
  toolbarSections: [{
    $reference: 'tmtv.toolbarSections'
  }],
  toolGroupAdditions: {
    [tmtv_src/* .toolGroupIds.CT */.i.CT]: [],
    [tmtv_src/* .toolGroupIds.PT */.i.PT]: [],
    [tmtv_src/* .toolGroupIds.Fusion */.i.Fusion]: [],
    [tmtv_src/* .toolGroupIds.MIP */.i.MIP]: [],
    [tmtv_src/* .toolGroupIds["default"] */.i["default"]]: []
  },
  // Tool group setup used by onModeEnter; extending modes can replace it.
  initToolGroups: src_initToolGroups,
  // The mode's own customizations, referenced by name: the block is registered
  // at default scope when the mode loads (see `customizations` below), and the
  // mode route applies it as the bottom layer of the mode scope on enter.
  modeCustomizations: 'tmtvModeCustomizations',
  activatePanelTriggers: [],
  /**
   * Lifecycle hooks
   */
  onModeEnter,
  onModeExit: basic_src/* .onModeExit */.$2,
  validationTags: {
    study: [],
    series: []
  },
  // Data-driven validity: requires both PT and CT, rejects SM, and excludes
  // the demo studies that belong to the preclinical 4D mode.  Until we have a
  // better way to identify 4D studies we use the mrn/StudyInstanceUID.
  isValidMode: basic_src/* .isValidMode */.ur,
  modeModalities: [['PT', 'CT']],
  excludedModalities: ['SM'],
  excludedStudies: [{
    mrn: 'M1'
  }, {
    studyInstanceUid: '1.3.6.1.4.1.12842.1.1.14.3.20220915.105557.468.2963630849'
  }],
  routes: [tmtvRoute],
  extensions: extensionDependencies,
  hangingProtocol: tmtv.hangingProtocol,
  sopClassHandlers: [ohif.sopClassHandler]
};

/**
 * Customizations the mode registers (Default scope) when it loads — before
 * the bootstrap phase applies, so bootstrap / `?customization=` modules can
 * modify them before anything reads them.  Values are plain data.
 */
const customizations = {
  tmtvModeCustomizations: {
    'panelSegmentation.tableMode': 'expanded'
  }
};

/**
 * The mode uses the basic mode's `modeFactory`, which applies
 * immutability-helper commands from `modeConfiguration` onto `modeInstance`,
 * so a site can define a mode that extends this one.
 */
const mode = {
  id: id,
  modeFactory: basic_src/* .modeFactory */.U1,
  modeInstance,
  extensionDependencies,
  customizations
};
/* export default */ const modes_tmtv_src = (mode);


},

}]);