"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[8408],{

/***/ 86027:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ src)
});

;// CONCATENATED MODULE: ../../../modes/basic-dev-mode/src/toolbarButtons.ts
const setToolActiveToolbar = {
  commandName: 'setToolActive',
  commandOptions: {
    toolGroupIds: ['default', 'mpr']
  },
  context: 'CORNERSTONE'
};
const toolbarButtons = [
// sections
{
  id: 'measurementSection',
  uiType: 'ohif.toolButtonList',
  props: {
    buttonSection: 'measurementSection',
    groupId: 'measurementSection'
  }
}, {
  id: 'MoreTools',
  uiType: 'ohif.toolButtonList',
  props: {
    buttonSection: 'moreToolsSection',
    groupId: 'MoreTools'
  }
},
// tool defs
{
  id: 'Length',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-length',
    label: 'Length',
    tooltip: 'Length Tool',
    commands: {
      ...setToolActiveToolbar,
      commandOptions: {
        ...setToolActiveToolbar.commandOptions,
        toolName: 'Length'
      }
    },
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'Bidirectional',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-bidirectional',
    label: 'Bidirectional',
    tooltip: 'Bidirectional Tool',
    commands: {
      ...setToolActiveToolbar,
      commandOptions: {
        ...setToolActiveToolbar.commandOptions,
        toolName: 'Bidirectional'
      }
    },
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'EllipticalROI',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-ellipse',
    label: 'Ellipse',
    tooltip: 'Ellipse ROI',
    commands: {
      ...setToolActiveToolbar,
      commandOptions: {
        ...setToolActiveToolbar.commandOptions,
        toolName: 'EllipticalROI'
      }
    },
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'CircleROI',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-circle',
    label: 'Circle',
    tooltip: 'Circle Tool',
    commands: {
      ...setToolActiveToolbar,
      commandOptions: {
        ...setToolActiveToolbar.commandOptions,
        toolName: 'CircleROI'
      }
    },
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'Zoom',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-zoom',
    label: 'Zoom',
    tooltip: 'Zoom',
    commands: {
      ...setToolActiveToolbar,
      commandOptions: {
        ...setToolActiveToolbar.commandOptions,
        toolName: 'Zoom'
      }
    },
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'Pan',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-move',
    label: 'Pan',
    tooltip: 'Pan',
    commands: {
      ...setToolActiveToolbar,
      commandOptions: {
        ...setToolActiveToolbar.commandOptions,
        toolName: 'Pan'
      }
    },
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'Capture',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-capture',
    label: 'Capture',
    tooltip: 'Capture',
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
  id: 'RotateRight',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-rotate-right',
    label: 'Rotate Right',
    tooltip: 'Rotate Right +90',
    commands: 'rotateViewportCW',
    evaluate: 'evaluate.action'
  }
}, {
  id: 'FlipHorizontal',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-flip-horizontal',
    label: 'Flip Horizontally',
    tooltip: 'Flip Horizontally',
    commands: 'flipViewportHorizontal',
    evaluate: 'evaluate.action'
  }
}, {
  id: 'StackScroll',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-stack-scroll',
    label: 'Stack Scroll',
    tooltip: 'Stack Scroll',
    commands: {
      ...setToolActiveToolbar,
      commandOptions: {
        ...setToolActiveToolbar.commandOptions,
        toolName: 'StackScroll'
      }
    },
    evaluate: 'evaluate.cornerstoneTool'
  }
}, {
  id: 'Invert',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-invert',
    label: 'Invert Colors',
    tooltip: 'Invert Colors',
    commands: 'invertViewport',
    evaluate: 'evaluate.action'
  }
}, {
  id: 'CalibrationLine',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-calibration',
    label: 'Calibration Line',
    tooltip: 'Calibration Line',
    commands: {
      ...setToolActiveToolbar,
      commandOptions: {
        ...setToolActiveToolbar.commandOptions,
        toolName: 'CalibrationLine'
      }
    },
    evaluate: 'evaluate.cornerstoneTool'
  }
}];
/* harmony default export */ const src_toolbarButtons = (toolbarButtons);
;// CONCATENATED MODULE: ../../../modes/basic-dev-mode/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/mode-basic-dev-mode"}');
;// CONCATENATED MODULE: ../../../modes/basic-dev-mode/src/id.js

const id = package_namespaceObject.UU;

// EXTERNAL MODULE: ../../../node_modules/i18next/dist/esm/i18next.js
var i18next = __webpack_require__(40680);
;// CONCATENATED MODULE: ../../../modes/basic-dev-mode/src/index.ts



const configs = {
  Length: {}
  //
};
const ohif = {
  layout: '@ohif/extension-default.layoutTemplateModule.viewerLayout',
  sopClassHandler: '@ohif/extension-default.sopClassHandlerModule.stack',
  measurements: '@ohif/extension-cornerstone.panelModule.panelMeasurement',
  thumbnailList: '@ohif/extension-default.panelModule.seriesList'
};
const cs3d = {
  viewport: '@ohif/extension-cornerstone.viewportModule.cornerstone'
};
const dicomsr = {
  sopClassHandler: '@ohif/extension-cornerstone-dicom-sr.sopClassHandlerModule.dicom-sr',
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
const extensionDependencies = {
  '@ohif/extension-default': '^3.0.0',
  '@ohif/extension-cornerstone': '^3.0.0',
  '@ohif/extension-cornerstone-dicom-sr': '^3.0.0',
  '@ohif/extension-dicom-pdf': '^3.0.1',
  '@ohif/extension-dicom-video': '^3.0.1'
};
function modeFactory({
  modeConfiguration
}) {
  return {
    id: id,
    routeName: 'dev',
    displayName: i18next/* default */.A.t('Modes:Basic Dev Viewer'),
    /**
     * Lifecycle hooks
     */
    onModeEnter: ({
      servicesManager,
      extensionManager
    }) => {
      const {
        toolbarService,
        toolGroupService
      } = servicesManager.services;
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
          toolName: toolNames.StackScroll,
          bindings: [{
            mouseButton: Enums.MouseBindings.Wheel
          }]
        }],
        passive: [{
          toolName: toolNames.Length
        }, {
          toolName: toolNames.Bidirectional
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
          toolName: toolNames.CalibrationLine
        }],
        // enabled
        enabled: [{
          toolName: toolNames.ImageOverlayViewer
        }]
        // disabled
      };
      toolGroupService.createToolGroupAndAddTools('default', tools);
      toolbarService.addButtons(src_toolbarButtons);
      toolbarService.createButtonSection('primary', ['measurementSection', 'Zoom', 'WindowLevel', 'Pan', 'Layout', 'MoreTools']);
    },
    onModeExit: ({
      servicesManager
    }) => {
      const {
        toolGroupService,
        uiDialogService,
        uiModalService
      } = servicesManager.services;
      uiDialogService.hideAll();
      uiModalService.hide();
      toolGroupService.destroy();
    },
    validationTags: {
      study: [],
      series: []
    },
    isValidMode: ({
      modalities
    }) => {
      const modalities_list = modalities.split('\\');

      // Slide Microscopy modality not supported by basic mode yet
      return {
        valid: !modalities_list.includes('SM'),
        description: 'The mode does not support the following modalities: SM'
      };
    },
    routes: [{
      path: 'viewer-cs3d',
      /*init: ({ servicesManager, extensionManager }) => {
        //defaultViewerRouteInit
      },*/
      layoutTemplate: ({
        location,
        servicesManager
      }) => {
        return {
          id: ohif.layout,
          props: {
            // TODO: Should be optional, or required to pass empty array for slots?
            leftPanels: [ohif.thumbnailList],
            leftPanelResizable: true,
            rightPanels: [ohif.measurements],
            rightPanelResizable: true,
            viewports: [{
              namespace: cs3d.viewport,
              displaySetsToDisplay: [ohif.sopClassHandler]
            }, {
              namespace: dicomvideo.viewport,
              displaySetsToDisplay: [dicomvideo.sopClassHandler]
            }, {
              namespace: dicompdf.viewport,
              displaySetsToDisplay: [dicompdf.sopClassHandler]
            }]
          }
        };
      }
    }],
    extensions: extensionDependencies,
    hangingProtocol: 'default',
    sopClassHandlers: [dicomvideo.sopClassHandler, ohif.sopClassHandler, dicompdf.sopClassHandler, dicomsr.sopClassHandler]
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