"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[7159],{

/***/ 67159:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ viewports_OHIFCornerstonePdfViewport)
});

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../../node_modules/prop-types/index.js
var prop_types = __webpack_require__(97598);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
// EXTERNAL MODULE: ../../core/src/index.ts + 68 modules
var src = __webpack_require__(15871);
;// ../../../extensions/dicom-pdf/src/viewports/OHIFCornerstonePdfViewport.css
// extracted by mini-css-extract-plugin

;// ../../../extensions/dicom-pdf/src/viewports/OHIFCornerstonePdfViewport.tsx




function OHIFCornerstonePdfViewport({
  displaySets,
  viewportId = 'pdf-viewport'
}) {
  const [url, setUrl] = (0,react.useState)(null);
  const viewportElementRef = (0,react.useRef)(null);
  const viewportRef = (0,src.useViewportRef)(viewportId);
  (0,react.useEffect)(() => {
    document.body.addEventListener('drag', makePdfDropTarget);
    return function cleanup() {
      document.body.removeEventListener('drag', makePdfDropTarget);
      viewportRef.unregister();
    };
  }, []);
  const [style, setStyle] = (0,react.useState)('pdf-yes-click');
  const makePdfScrollable = () => {
    setStyle('pdf-yes-click');
  };
  const makePdfDropTarget = () => {
    setStyle('pdf-no-click');
  };
  if (displaySets && displaySets.length > 1) {
    throw new Error('OHIFCornerstonePdfViewport: only one display set is supported for dicom pdf right now');
  }
  const {
    renderedUrl
  } = displaySets[0];
  (0,react.useEffect)(() => {
    const load = async () => {
      setUrl(await renderedUrl);
    };
    load();
  }, [renderedUrl]);
  return /*#__PURE__*/react.createElement("div", {
    className: "bg-primary-black h-full w-full text-white",
    onClick: makePdfScrollable,
    ref: el => {
      viewportElementRef.current = el;
      if (el) viewportRef.register(el);
    },
    "data-viewport-id": viewportId
  }, /*#__PURE__*/react.createElement("object", {
    data: url,
    type: "application/pdf",
    className: style
  }, /*#__PURE__*/react.createElement("div", null, "No online PDF viewer installed")));
}
OHIFCornerstonePdfViewport.propTypes = {
  displaySets: prop_types_default().arrayOf((prop_types_default()).object).isRequired,
  viewportId: (prop_types_default()).string
};
/* harmony default export */ const viewports_OHIFCornerstonePdfViewport = (OHIFCornerstonePdfViewport);

/***/ })

}]);