"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[5457],{

/***/ 95457
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ longitudinal_src)
});

// UNUSED EXPORTS: extensionDependencies, initToolGroups, longitudinalInstance, longitudinalRoute, modeInstance, toolbarButtons, tracked

// EXTERNAL MODULE: ../../../node_modules/i18next/dist/esm/i18next.js
var i18next = __webpack_require__(40680);
;// ../../../modes/longitudinal/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/mode-longitudinal"}');
;// ../../../modes/longitudinal/src/id.js

const id = package_namespaceObject.UU;

// EXTERNAL MODULE: ../../../modes/basic/src/index.tsx + 4 modules
var src = __webpack_require__(35485);
;// ../../../modes/longitudinal/src/index.ts



const tracked = {
  measurements: '@ohif/extension-measurement-tracking.panelModule.trackedMeasurements',
  thumbnailList: '@ohif/extension-measurement-tracking.panelModule.seriesList',
  viewport: '@ohif/extension-measurement-tracking.viewportModule.cornerstone-tracked'
};
const extensionDependencies = {
  // Can derive the versions at least process.env.from npm_package_version
  ...src/* extensionDependencies */.tR,
  '@ohif/extension-measurement-tracking': '^3.0.0'
};
const longitudinalInstance = {
  ...src/* basicLayout */.xT,
  id: src/* ohif */.Dt.layout,
  props: {
    ...src/* basicLayout */.xT.props,
    leftPanels: [tracked.thumbnailList],
    rightPanels: [src/* cornerstone */.Nu.segmentation, tracked.measurements],
    viewports: [{
      namespace: tracked.viewport,
      // Re-use the display sets from basic
      displaySetsToDisplay: src/* basicLayout */.xT.props.viewports[0].displaySetsToDisplay
    }, ...src/* basicLayout */.xT.props.viewports]
  }
};
const longitudinalRoute = {
  ...src/* basicRoute */.o2,
  path: 'longitudinal',
  /*init: ({ servicesManager, extensionManager }) => {
    //defaultViewerRouteInit
  },*/
  layoutInstance: longitudinalInstance
};
const modeInstance = {
  ...src/* modeInstance */.dw,
  // TODO: We're using this as a route segment
  // We should not be.
  id: id,
  routeName: 'viewer',
  displayName: i18next/* default */.A.t('Modes:Basic Viewer'),
  routes: [longitudinalRoute],
  extensions: extensionDependencies
};
const mode = {
  ...src/* mode */.Mq,
  id: id,
  modeInstance,
  extensionDependencies
};
/* harmony default export */ const longitudinal_src = (mode);


/***/ }

}]);