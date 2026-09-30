"use strict";
(globalThis["rspackChunk"] = globalThis["rspackChunk"] || []).push([[5696], {
63683(__unused_rspack_module, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ longitudinal_src)
});

// UNUSED EXPORTS: extensionDependencies, initToolGroups, longitudinalInstance, longitudinalRoute, modeInstance, tracked

// EXTERNAL MODULE: ../../../node_modules/i18next/dist/esm/i18next.js
var i18next = __webpack_require__(40680);
;// CONCATENATED MODULE: ../../../modes/longitudinal/package.json
var package_namespaceObject = JSON.parse('{"UU":"@ohif/mode-longitudinal"}')
;// CONCATENATED MODULE: ../../../modes/longitudinal/src/id.js

const id = package_namespaceObject.UU;

// EXTERNAL MODULE: ../../../modes/basic/src/index.tsx + 4 modules
var src = __webpack_require__(69932);
;// CONCATENATED MODULE: ../../../modes/longitudinal/src/index.ts



const tracked = {
  measurements: '@ohif/extension-measurement-tracking.panelModule.trackedMeasurements',
  thumbnailList: '@ohif/extension-measurement-tracking.panelModule.seriesList',
  viewport: '@ohif/extension-measurement-tracking.viewportModule.cornerstone-tracked'
};
const extensionDependencies = {
  // Can derive the versions at least process.env.from npm_package_version
  ...src/* .extensionDependencies */.tR,
  '@ohif/extension-measurement-tracking': '^3.0.0'
};
const longitudinalInstance = {
  ...src/* .basicLayout */.xT,
  id: src/* .ohif.layout */.Dt.layout,
  props: {
    ...src/* .basicLayout.props */.xT.props,
    // Literal panel lists; the mode route seeds them into the standard
    // `leftPanels` / `rightPanels` customizations so `mode` phase
    // blocks and global customizations can modify them.
    leftPanels: [tracked.thumbnailList],
    // NIfTI segmentation overlay panel -- appended at the end of the right
    // rail so it sits below the tracked measurements panel without disturbing
    // the upstream layout. The extension dependency is inherited from basic
    // mode via `...basicDependencies` above; the panel id is a string literal
    // (rather than re-importing from `@ohif/mode-basic`) to keep this patch
    // a focused one-hunker. See nifti_overlay/ and NIFTI_OVERLAY_PLAN.md at
    // the repo root.
    rightPanels: [src/* .cornerstone.segmentation */.Nu.segmentation, tracked.measurements, '@ohif/extension-nifti-segmentation.panelModule.niftiOverlayPanel'],
    viewports: [{
      namespace: tracked.viewport,
      // Re-use the display sets from basic
      displaySetsToDisplay: src/* .basicLayout.props.viewports["0"].displaySetsToDisplay */.xT.props.viewports["0"].displaySetsToDisplay
    }, ...src/* .basicLayout.props.viewports */.xT.props.viewports]
  }
};
const longitudinalRoute = {
  ...src/* .basicRoute */.o2,
  path: 'longitudinal',
  /*init: ({ servicesManager, extensionManager }) => {
          //defaultViewerRouteInit
        },*/
  layoutInstance: longitudinalInstance
};
const modeInstance = {
  ...src/* .modeInstance */.dw,
  // TODO: We're using this as a route segment
  // We should not be.
  id: id,
  routeName: 'viewer',
  displayName: i18next/* ["default"].t */.A.t('Modes:Basic Viewer'),
  routes: [longitudinalRoute],
  extensions: extensionDependencies
};
const mode = {
  ...src/* .mode */.Mq,
  id: id,
  modeInstance,
  extensionDependencies
};
/* export default */ const longitudinal_src = (mode);


},

}]);