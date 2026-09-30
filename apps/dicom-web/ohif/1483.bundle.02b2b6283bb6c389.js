"use strict";
(globalThis["rspackChunk"] = globalThis["rspackChunk"] || []).push([[1483], {
77798(__unused_rspack_module, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ segmentation_src)
});

// UNUSED EXPORTS: customizations, initToolGroups, modeInstance, onModeEnter, segmentationLayout, segmentationRoute

;// CONCATENATED MODULE: ../../../modes/segmentation/package.json
var package_namespaceObject = JSON.parse('{"UU":"@ohif/mode-segmentation"}')
;// CONCATENATED MODULE: ../../../modes/segmentation/src/id.js

const id = package_namespaceObject.UU;

;// CONCATENATED MODULE: ../../../modes/segmentation/src/constants.ts
const MIN_SEGMENTATION_DRAWING_RADIUS = 0.5;
const MAX_SEGMENTATION_DRAWING_RADIUS = 99.5;
;// CONCATENATED MODULE: ../../../modes/segmentation/src/initToolGroups.ts

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
        minRadius: (/* inlined export .MIN_SEGMENTATION_DRAWING_RADIUS */0.5),
        maxRadius: (/* inlined export .MAX_SEGMENTATION_DRAWING_RADIUS */99.5)
      }
    }, {
      toolName: toolNames.LabelmapSlicePropagation
    }, {
      toolName: toolNames.MarkerLabelmap
    }, {
      toolName: toolNames.ClickSegment
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
        minRadius: (/* inlined export .MIN_SEGMENTATION_DRAWING_RADIUS */0.5),
        maxRadius: (/* inlined export .MAX_SEGMENTATION_DRAWING_RADIUS */99.5),
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
        minRadius: (/* inlined export .MIN_SEGMENTATION_DRAWING_RADIUS */0.5),
        maxRadius: (/* inlined export .MAX_SEGMENTATION_DRAWING_RADIUS */99.5),
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
    // Bind Crosshairs to Primary+Shift (matching the longitudinal/tmtv modes)
    // so it lives on its own mouse binding. Without a binding it activates on
    // plain Primary and, being `disableOnPassive`, gets disabled the moment
    // another Primary tool (brush/zoom/pan, all in this `mpr` group) is
    // activated from the toolbar — making Crosshairs mutually exclusive with
    // them. On its own binding it stays active alongside those tools.
    bindings: [{
      mouseButton: utilityModule.exports.Enums.MouseBindings.Primary,
      modifierKey: utilityModule.exports.Enums.KeyboardBindings.Shift
    }],
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
function initToolGroups({
  extensionManager,
  toolGroupService,
  commandsManager
}) {
  initDefaultToolGroup(extensionManager, toolGroupService, commandsManager, 'default');
  initMPRToolGroup(extensionManager, toolGroupService, commandsManager);
  initVolume3DToolGroup(extensionManager, toolGroupService);
}
/* export default */ const src_initToolGroups = (initToolGroups);
;// CONCATENATED MODULE: ../../../modes/segmentation/src/utils/setUpAutoTabSwitchHandler.ts
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
var src = __webpack_require__(69932);
;// CONCATENATED MODULE: ../../../modes/segmentation/src/index.tsx





/**
 * Extends the basic mode enter with the segmentation panel auto tab switch
 * handling (switching between labelmap/contour panels as segmentations of the
 * relevant type become active).
 */
function onModeEnter(ctx) {
  src/* .onModeEnter.call */.jQ.call(this, ctx);
  const {
    segmentationService,
    viewportGridService,
    panelService
  } = ctx.servicesManager.services;
  const {
    unsubscribeAutoTabSwitchEvents
  } = setUpAutoTabSwitchHandler({
    segmentationService,
    viewportGridService,
    panelService
  });
  this._unsubscriptions.push(...unsubscribeAutoTabSwitchEvents);
}
const segmentationLayout = {
  id: src/* .ohif.layout */.Dt.layout,
  props: {
    // Literal panel lists; the mode route seeds them into the standard
    // `leftPanels` / `rightPanels` customizations so `mode` phase
    // blocks and global customizations can modify them.
    leftPanels: [src/* .ohif.thumbnailList */.Dt.thumbnailList],
    leftPanelResizable: true,
    rightPanels: [src/* .cornerstone.labelMapSegmentationPanel */.Nu.labelMapSegmentationPanel, src/* .cornerstone.contourSegmentationPanel */.Nu.contourSegmentationPanel,
    // NIfTI overlay panel — lists `.nii.gz` segmentations related
    // to the active series (`/nifti/related`) and loads them
    // into a Cornerstone3D labelmap volume. Sits last on the
    // right rail so the user can scan the standard segmentation
    // panels first and only open the overlay panel when needed.
    src/* .niftiSegmentation.panel */.pN.panel],
    rightPanelResizable: true,
    viewports: [{
      namespace: src/* .cornerstone.viewport */.Nu.viewport,
      displaySetsToDisplay: [src/* .ohif.sopClassHandler */.Dt.sopClassHandler]
    }, {
      namespace: src/* .segmentation.viewport */.b2.viewport,
      displaySetsToDisplay: [src/* .segmentation.sopClassHandler */.b2.sopClassHandler]
    }, {
      namespace: src/* .dicomRT.viewport */.V6.viewport,
      displaySetsToDisplay: [src/* .dicomRT.sopClassHandler */.V6.sopClassHandler]
    }]
  }
};
const segmentationRoute = {
  path: 'template',
  layoutTemplate: src/* .layoutTemplate */.ZM,
  layoutInstance: segmentationLayout
};
const modeInstance = {
  id: id,
  routeName: 'segmentation',
  displayName: 'Segmentation',
  // Toolbar/tool-group composition: which capability packs this mode uses.
  // The mode route seeds these onto the Mode customization scope on enter, so
  // `?customization=` modules extend them through the `mode` phase (e.g. add
  // the annotation tools/buttons). Pack names are resolved when the toolbar is
  // registered.
  toolbarButtons: [{
    $reference: 'cornerstone.toolbarButtons'
  }, {
    $reference: 'cornerstone.segmentationToolbarButtons'
  }],
  toolbarSections: [{
    $reference: 'cornerstone.segmentationModeToolbarSections'
  }, {
    $reference: 'cornerstone.segmentationToolbarSections'
  }],
  toolGroupAdditions: {
    default: [],
    mpr: [],
    volume3d: []
  },
  // Tool group setup used by onModeEnter; extending modes can replace it.
  initToolGroups: src_initToolGroups,
  // The mode's own customizations, applied by the mode route as the bottom
  // layer of the mode scope.  Unlike basic, the registered block is empty (no
  // `panelSegmentation.disableEditing`): the segmentation panel is editable.
  modeCustomizations: 'segmentationModeCustomizations',
  activatePanelTriggers: [],
  /**
   * Lifecycle hooks
   */
  onModeEnter,
  onModeExit: src/* .onModeExit */.$2,
  validationTags: {
    study: [],
    series: []
  },
  // Data-driven validity: valid unless the study ONLY contains modalities that
  // segmentation cannot be performed on.
  isValidMode: src/* .isValidMode */.ur,
  nonModeModalities: ['SM', 'ECG', 'OT', 'DOC'],
  routes: [segmentationRoute],
  extensions: src/* .extensionDependencies */.tR,
  // Prefer the grid layout hanging protocol when applicable.
  hangingProtocol: ['@ohif/mnGrid'],
  sopClassHandlers: [src/* .ohif.sopClassHandler */.Dt.sopClassHandler, src/* .segmentation.sopClassHandler */.b2.sopClassHandler, src/* .dicomRT.sopClassHandler */.V6.sopClassHandler]
};

/**
 * Customizations the mode registers (Default scope) when it loads.  The mode's
 * own block is empty — the segmentation panel is editable in this mode — but
 * it is registered so bootstrap / `?customization=` modules can add
 * mode-scoped values to it.
 */
const customizations = {
  segmentationModeCustomizations: {}
};

/**
 * The mode uses the basic mode's `modeFactory`, which applies
 * immutability-helper commands from `modeConfiguration` onto `modeInstance`,
 * so a site can define a `mySegmentation` mode that extends this one.
 */
const mode = {
  id: id,
  modeFactory: src/* .modeFactory */.U1,
  modeInstance,
  extensionDependencies: src/* .extensionDependencies */.tR,
  customizations
};
/* export default */ const segmentation_src = (mode);


},

}]);