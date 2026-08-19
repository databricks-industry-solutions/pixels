"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[1459],{

/***/ 71459
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ src)
});

// UNUSED EXPORTS: cornerstone

// EXTERNAL MODULE: ../../../node_modules/i18next/dist/esm/i18next.js
var i18next = __webpack_require__(40680);
;// ../../../modes/microscopy/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/mode-microscopy"}');
;// ../../../modes/microscopy/src/id.js

const id = package_namespaceObject.UU;

;// ../../../modes/microscopy/src/toolbarButtons.ts

const setToolActiveToolbar = {
  commandName: 'setToolActive',
  commandOptions: {
    toolName: 'line'
  },
  context: 'MICROSCOPY'
};
const toolbarButtons = [{
  id: 'MeasurementTools',
  uiType: 'ohif.toolButtonList',
  props: {
    buttonSection: true
  }
}, {
  id: 'line',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-length',
    label: i18next/* default */.A.t('Buttons:Line'),
    tooltip: i18next/* default */.A.t('Buttons:Line Tool'),
    commands: setToolActiveToolbar,
    evaluate: 'evaluate.microscopyTool'
  }
}, {
  id: 'point',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-point',
    label: i18next/* default */.A.t('Buttons:Point'),
    tooltip: i18next/* default */.A.t('Buttons:Point Tool'),
    commands: {
      ...setToolActiveToolbar,
      commandOptions: {
        toolName: 'point'
      }
    },
    evaluate: 'evaluate.microscopyTool'
  }
}, {
  id: 'polygon',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-polygon',
    label: i18next/* default */.A.t('Buttons:Polygon'),
    tooltip: i18next/* default */.A.t('Buttons:Polygon Tool'),
    commands: {
      ...setToolActiveToolbar,
      commandOptions: {
        toolName: 'polygon'
      }
    },
    evaluate: 'evaluate.microscopyTool'
  }
}, {
  id: 'circle',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-circle',
    label: i18next/* default */.A.t('Buttons:Circle'),
    tooltip: i18next/* default */.A.t('Buttons:Circle Tool'),
    commands: {
      ...setToolActiveToolbar,
      commandOptions: {
        toolName: 'circle'
      }
    },
    evaluate: 'evaluate.microscopyTool'
  }
}, {
  id: 'box',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-rectangle',
    label: i18next/* default */.A.t('Buttons:Box'),
    tooltip: i18next/* default */.A.t('Buttons:Box Tool'),
    commands: {
      ...setToolActiveToolbar,
      commandOptions: {
        toolName: 'box'
      }
    },
    evaluate: 'evaluate.microscopyTool'
  }
}, {
  id: 'freehandpolygon',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-freehand-polygon',
    label: i18next/* default */.A.t('Buttons:Freehand Polygon'),
    tooltip: i18next/* default */.A.t('Buttons:Freehand Polygon Tool'),
    commands: {
      ...setToolActiveToolbar,
      commandOptions: {
        toolName: 'freehandpolygon'
      }
    },
    evaluate: 'evaluate.microscopyTool'
  }
}, {
  id: 'freehandline',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-freehand-line',
    label: i18next/* default */.A.t('Buttons:Freehand Line'),
    tooltip: i18next/* default */.A.t('Buttons:Freehand Line Tool'),
    commands: {
      ...setToolActiveToolbar,
      commandOptions: {
        toolName: 'freehandline'
      }
    },
    evaluate: 'evaluate.microscopyTool'
  }
}, {
  id: 'dragPan',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'tool-move',
    label: i18next/* default */.A.t('Buttons:Pan'),
    commands: {
      ...setToolActiveToolbar,
      commandOptions: {
        toolName: 'dragPan'
      }
    },
    evaluate: 'evaluate.microscopyTool'
  }
}, {
  id: 'TagBrowser',
  uiType: 'ohif.toolButton',
  props: {
    icon: 'dicom-tag-browser',
    label: i18next/* default */.A.t('Buttons:Dicom Tag Browser'),
    tooltip: i18next/* default */.A.t('Buttons:Dicom Tag Browser'),
    commands: 'openDICOMTagViewer',
    evaluate: 'evaluate.action'
  }
}];
/* harmony default export */ const src_toolbarButtons = (toolbarButtons);
;// ../../../modes/microscopy/src/index.tsx



const ohif = {
  layout: '@ohif/extension-default.layoutTemplateModule.viewerLayout',
  sopClassHandler: '@ohif/extension-default.sopClassHandlerModule.stack',
  hangingProtocols: '@ohif/extension-default.hangingProtocolModule.default',
  leftPanel: '@ohif/extension-default.panelModule.seriesList',
  rightPanel: '@ohif/extension-dicom-microscopy.panelModule.measure'
};
const cornerstone = {
  viewport: '@ohif/extension-cornerstone.viewportModule.cornerstone'
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
  // Can derive the versions at least process.env.from npm_package_version
  '@ohif/extension-default': '^3.0.0',
  '@ohif/extension-cornerstone': '^3.0.0',
  '@ohif/extension-cornerstone-dicom-sr': '^3.0.0',
  '@ohif/extension-dicom-pdf': '^3.0.1',
  '@ohif/extension-dicom-video': '^3.0.1',
  '@ohif/extension-dicom-microscopy': '^3.0.0'
};
function modeFactory({
  modeConfiguration
}) {
  return {
    id: id,
    routeName: 'microscopy',
    displayName: i18next/* default */.A.t('Modes:Microscopy'),
    /**
     * Lifecycle hooks
     */
    onModeEnter: ({
      servicesManager
    }) => {
      const {
        toolbarService
      } = servicesManager.services;
      toolbarService.register(src_toolbarButtons);
      toolbarService.updateSection('primary', ['MeasurementTools', 'dragPan', 'TagBrowser']);
      toolbarService.updateSection('MeasurementTools', ['line', 'point', 'polygon', 'circle', 'box', 'freehandpolygon', 'freehandline']);
    },
    onModeExit: ({
      servicesManager
    }) => {
      const {
        toolbarService,
        uiDialogService,
        uiModalService
      } = servicesManager.services;
      uiDialogService.hideAll();
      uiModalService.hide();
      toolbarService.reset();
    },
    validationTags: {
      study: [],
      series: []
    },
    isValidMode: ({
      modalities
    }) => {
      const modalities_list = modalities.split('\\');
      return {
        valid: modalities_list.includes('SM'),
        description: 'Microscopy mode only supports the SM modality'
      };
    },
    routes: [{
      path: 'microscopy',
      layoutTemplate: ({
        location,
        servicesManager
      }) => {
        return {
          id: ohif.layout,
          props: {
            leftPanels: [ohif.leftPanel],
            leftPanelResizable: true,
            leftPanelClosed: true,
            // we have problem with rendering thumbnails for microscopy images
            // rightPanelClosed: true, // we do not have the save microscopy measurements yet
            rightPanels: [ohif.rightPanel],
            rightPanelResizable: true,
            viewports: [{
              namespace: '@ohif/extension-dicom-microscopy.viewportModule.microscopy-dicom',
              displaySetsToDisplay: [
              // Share the sop class handler with cornerstone version of it
              '@ohif/extension-cornerstone.sopClassHandlerModule.DicomMicroscopySopClassHandler', '@ohif/extension-dicom-microscopy.sopClassHandlerModule.DicomMicroscopySRSopClassHandler', '@ohif/extension-dicom-microscopy.sopClassHandlerModule.DicomMicroscopyANNSopClassHandler']
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
    sopClassHandlers: ['@ohif/extension-cornerstone.sopClassHandlerModule.DicomMicroscopySopClassHandler', '@ohif/extension-dicom-microscopy.sopClassHandlerModule.DicomMicroscopySRSopClassHandler', '@ohif/extension-dicom-microscopy.sopClassHandlerModule.DicomMicroscopyANNSopClassHandler', dicomvideo.sopClassHandler, dicompdf.sopClassHandler],
    ...modeConfiguration
  };
}
const mode = {
  id: id,
  modeFactory,
  extensionDependencies
};
/* harmony default export */ const src = (mode);

/***/ }

}]);