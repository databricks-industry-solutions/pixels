"use strict";
(globalThis["rspackChunk"] = globalThis["rspackChunk"] || []).push([[9116], {
95991(__unused_rspack_module, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ dicom_pdf_src)
});

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
;// CONCATENATED MODULE: ../../../extensions/dicom-pdf/package.json
var package_namespaceObject = JSON.parse('{"UU":"@ohif/extension-dicom-pdf"}')
;// CONCATENATED MODULE: ../../../extensions/dicom-pdf/src/id.js

const id = package_namespaceObject.UU;
const SOPClassHandlerId = `${id}.sopClassHandlerModule.dicom-pdf`;

// EXTERNAL MODULE: ../../core/src/index.ts + 75 modules
var src = __webpack_require__(50679);
// EXTERNAL MODULE: ../../i18n/src/index.js + 289 modules
var i18n_src = __webpack_require__(78919);
;// CONCATENATED MODULE: ../../../extensions/dicom-pdf/src/getSopClassHandlerModule.js



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
    const renderedUrlParams = {
      instance,
      tag: 'EncapsulatedDocument',
      defaultType: MIMETypeOfEncapsulatedDocument || 'application/pdf',
      singlepart: 'pdf'
    };
    const renderedUrl = dataSource.retrieve.directURL(renderedUrlParams);
    const getRenderedUrl = dataSource.retrieve.renderedURL ? options => dataSource.retrieve.renderedURL({
      ...renderedUrlParams,
      url: renderedUrl
    }, options) : undefined;
    const displaySet = {
      //plugin: id,
      Modality,
      displaySetInstanceUID: src/* .utils.guid */.Wp.guid(),
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
      getRenderedUrl,
      instances: [instance],
      thumbnailSrc: null,
      isDerivedDisplaySet: true,
      isLoaded: false,
      sopClassUids,
      numImageFrames: 0,
      numInstances: 1,
      instance,
      supportsWindowLevel: true,
      label: SeriesDescription || `${i18n_src/* ["default"].t */.A.t('Series')} ${SeriesNumber} - ${i18n_src/* ["default"].t */.A.t(Modality)}`
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
;// CONCATENATED MODULE: ../../../extensions/dicom-pdf/src/index.tsx



const Component = /*#__PURE__*/react.lazy(() => {
  return __webpack_require__.e(/* import() */ 7463).then(__webpack_require__.bind(__webpack_require__, 55738));
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
  getViewportModule() {
    const ExtendedOHIFCornerstonePdfViewport = props => {
      return /*#__PURE__*/react.createElement(OHIFCornerstonePdfViewport, props);
    };
    return [{
      name: 'dicom-pdf',
      component: ExtendedOHIFCornerstonePdfViewport
    }];
  },
  getSopClassHandlerModule: getSopClassHandlerModule
};
/* export default */ const dicom_pdf_src = (dicomPDFExtension);

},

}]);