"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[2424],{

/***/ 12424:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ dicom_pdf_src)
});

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
;// ../../../extensions/dicom-pdf/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/extension-dicom-pdf"}');
;// ../../../extensions/dicom-pdf/src/id.js

const id = package_namespaceObject.UU;
const SOPClassHandlerId = `${id}.sopClassHandlerModule.dicom-pdf`;

// EXTERNAL MODULE: ../../core/src/index.ts + 68 modules
var src = __webpack_require__(15871);
// EXTERNAL MODULE: ../../i18n/src/index.js + 197 modules
var i18n_src = __webpack_require__(89806);
;// ../../../extensions/dicom-pdf/src/getSopClassHandlerModule.js



const SOP_CLASS_UIDS = {
  ENCAPSULATED_PDF: '1.2.840.10008.5.1.4.1.1.104.1'
};
const sopClassUids = Object.values(SOP_CLASS_UIDS);
const _getDisplaySetsFromSeries = (instances, servicesManager, extensionManager) => {
  const dataSource = extensionManager.getActiveDataSource()[0];
  return instances.map(instance => {
    const {
      Modality,
      SOPInstanceUID
    } = instance;
    const {
      SeriesDescription = 'PDF',
      MIMETypeOfEncapsulatedDocument
    } = instance;
    const {
      SeriesNumber,
      SeriesDate,
      SeriesInstanceUID,
      StudyInstanceUID,
      SOPClassUID
    } = instance;
    const renderedUrl = dataSource.retrieve.directURL({
      instance,
      tag: 'EncapsulatedDocument',
      defaultType: MIMETypeOfEncapsulatedDocument || 'application/pdf',
      singlepart: 'pdf'
    });
    const displaySet = {
      //plugin: id,
      Modality,
      displaySetInstanceUID: src.utils.guid(),
      SeriesDescription,
      SeriesNumber,
      SeriesDate,
      SOPInstanceUID,
      SeriesInstanceUID,
      StudyInstanceUID,
      SOPClassHandlerId: SOPClassHandlerId,
      SOPClassUID,
      referencedImages: null,
      measurements: null,
      renderedUrl: renderedUrl,
      instances: [instance],
      thumbnailSrc: null,
      isDerivedDisplaySet: true,
      isLoaded: false,
      sopClassUids,
      numImageFrames: 0,
      numInstances: 1,
      instance,
      supportsWindowLevel: true,
      label: SeriesDescription || `${i18n_src/* default */.A.t('Series')} ${SeriesNumber} - ${i18n_src/* default */.A.t(Modality)}`
    };
    return displaySet;
  });
};
function getSopClassHandlerModule(params) {
  const {
    servicesManager,
    extensionManager
  } = params;
  const getDisplaySetsFromSeries = instances => {
    return _getDisplaySetsFromSeries(instances, servicesManager, extensionManager);
  };
  return [{
    name: 'dicom-pdf',
    sopClassUids,
    getDisplaySetsFromSeries
  }];
}
;// ../../../extensions/dicom-pdf/src/index.tsx
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }



const Component = /*#__PURE__*/react.lazy(() => {
  return __webpack_require__.e(/* import() */ 7159).then(__webpack_require__.bind(__webpack_require__, 67159));
});
const OHIFCornerstonePdfViewport = props => {
  return /*#__PURE__*/react.createElement(react.Suspense, {
    fallback: /*#__PURE__*/react.createElement("div", null, "Loading...")
  }, /*#__PURE__*/react.createElement(Component, props));
};

/**
 *
 */
const dicomPDFExtension = {
  /**
   * Only required property. Should be a unique value across all extensions.
   */
  id: id,
  /**
   *
   *
   * @param {object} [configuration={}]
   * @param {object|array} [configuration.csToolsConfig] - Passed directly to `initCornerstoneTools`
   */
  getViewportModule({
    servicesManager,
    extensionManager
  }) {
    const ExtendedOHIFCornerstonePdfViewport = props => {
      return /*#__PURE__*/react.createElement(OHIFCornerstonePdfViewport, _extends({
        servicesManager: servicesManager,
        extensionManager: extensionManager
      }, props));
    };
    return [{
      name: 'dicom-pdf',
      component: ExtendedOHIFCornerstonePdfViewport
    }];
  },
  getSopClassHandlerModule: getSopClassHandlerModule
};
/* harmony default export */ const dicom_pdf_src = (dicomPDFExtension);

/***/ })

}]);