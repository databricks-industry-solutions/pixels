"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[9026],{

/***/ 99026:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Viewport_OHIFCornerstoneViewport)
});

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../../node_modules/react-resize-detector/build/index.esm.js
var index_esm = __webpack_require__(81980);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/index.js
var esm = __webpack_require__(4667);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var dist_esm = __webpack_require__(15327);
// EXTERNAL MODULE: ../../core/src/index.ts + 69 modules
var src = __webpack_require__(62037);
// EXTERNAL MODULE: ../../ui-next/src/index.ts + 1053 modules
var ui_next_src = __webpack_require__(2836);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/state.ts
var state = __webpack_require__(71353);
;// CONCATENATED MODULE: ../../../extensions/cornerstone/src/Viewport/OHIFCornerstoneViewport.css
// extracted by mini-css-extract-plugin

// EXTERNAL MODULE: ../../../node_modules/prop-types/index.js
var prop_types = __webpack_require__(97598);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
;// CONCATENATED MODULE: ../../../extensions/cornerstone/src/Viewport/Overlays/ViewportImageScrollbar.tsx




function CornerstoneImageScrollbar({
  viewportData,
  viewportId,
  element,
  imageSliceData,
  setImageSliceData,
  scrollbarHeight,
  servicesManager
}) {
  const {
    cineService,
    cornerstoneViewportService
  } = servicesManager.services;
  const onImageScrollbarChange = (imageIndex, viewportId) => {
    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
    const {
      isCineEnabled
    } = cineService.getState();
    if (isCineEnabled) {
      // on image scrollbar change, stop the CINE if it is playing
      cineService.stopClip(element, {
        viewportId
      });
      cineService.setCine({
        id: viewportId,
        isPlaying: false
      });
    }
    dist_esm.utilities.jumpToSlice(viewport.element, {
      imageIndex,
      debounceLoading: true
    });
  };
  (0,react.useEffect)(() => {
    if (!viewportData) {
      return;
    }
    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
    if (!viewport || viewport instanceof dist_esm.VolumeViewport3D) {
      return;
    }
    try {
      const imageIndex = viewport.getCurrentImageIdIndex();
      const numberOfSlices = viewport.getNumberOfSlices();
      setImageSliceData({
        imageIndex: imageIndex,
        numberOfSlices
      });
    } catch (error) {
      console.warn(error);
    }
  }, [viewportId, viewportData]);
  (0,react.useEffect)(() => {
    if (!viewportData) {
      return;
    }
    const {
      viewportType
    } = viewportData;
    const eventId = viewportType === dist_esm.Enums.ViewportType.STACK && dist_esm.Enums.Events.STACK_VIEWPORT_SCROLL || viewportType === dist_esm.Enums.ViewportType.ORTHOGRAPHIC && dist_esm.Enums.Events.VOLUME_NEW_IMAGE || dist_esm.Enums.Events.IMAGE_RENDERED;
    const updateIndex = event => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (!viewport || viewport instanceof dist_esm.VolumeViewport3D) {
        return;
      }
      const {
        imageIndex,
        newImageIdIndex = imageIndex
      } = event.detail;
      const numberOfSlices = viewport.getNumberOfSlices();
      // find the index of imageId in the imageIds
      setImageSliceData({
        imageIndex: newImageIdIndex,
        numberOfSlices
      });
    };
    element.addEventListener(eventId, updateIndex);
    return () => {
      element.removeEventListener(eventId, updateIndex);
    };
  }, [viewportData, element]);
  return /*#__PURE__*/react.createElement(ui_next_src/* ImageScrollbar */.uqr, {
    onChange: evt => onImageScrollbarChange(evt, viewportId),
    max: imageSliceData.numberOfSlices ? imageSliceData.numberOfSlices - 1 : 0,
    height: scrollbarHeight,
    value: imageSliceData.imageIndex || 0
  });
}
CornerstoneImageScrollbar.propTypes = {
  viewportData: (prop_types_default()).object,
  viewportId: (prop_types_default()).string.isRequired,
  element: prop_types_default().instanceOf(Element),
  scrollbarHeight: (prop_types_default()).string,
  imageSliceData: (prop_types_default()).object.isRequired,
  setImageSliceData: (prop_types_default()).func.isRequired,
  servicesManager: (prop_types_default()).object.isRequired
};
/* harmony default export */ const ViewportImageScrollbar = (CornerstoneImageScrollbar);
// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/index.js + 1 modules
var gl_matrix_esm = __webpack_require__(3823);
// EXTERNAL MODULE: ../../../node_modules/moment/moment.js
var moment = __webpack_require__(14867);
var moment_default = /*#__PURE__*/__webpack_require__.n(moment);
;// CONCATENATED MODULE: ../../../extensions/cornerstone/src/Viewport/Overlays/utils.ts



/**
 * Checks if value is valid.
 *
 * @param {number} value
 * @returns {boolean} is valid.
 */
function isValidNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Formats number precision.
 *
 * @param {number} number
 * @param {number} precision
 * @returns {number} formatted number.
 */
function formatNumberPrecision(number, precision = 0) {
  if (number !== null) {
    return parseFloat(number).toFixed(precision);
  }
}

/**
 * Formats DICOM date.
 *
 * @param {string} date
 * @param {string} strFormat
 * @returns {string} formatted date.
 */
function formatDICOMDate(date, strFormat = 'MMM D, YYYY') {
  return moment_default()(date, 'YYYYMMDD').format(strFormat);
}

/**
 *    DICOM Time is stored as HHmmss.SSS, where:
 *      HH 24 hour time:
 *        m mm        0..59   Minutes
 *        s ss        0..59   Seconds
 *        S SS SSS    0..999  Fractional seconds
 *
 *        Goal: '24:12:12'
 *
 * @param {*} time
 * @param {string} strFormat
 * @returns {string} formatted name.
 */
function formatDICOMTime(time, strFormat = 'HH:mm:ss') {
  return moment_default()(time, 'HH:mm:ss').format(strFormat);
}

/**
 * Gets compression type
 *
 * @param {number} imageId
 * @returns {string} compression type.
 */
function getCompression(imageId) {
  const generalImageModule = metaData.get('generalImageModule', imageId) || {};
  const {
    lossyImageCompression,
    lossyImageCompressionRatio,
    lossyImageCompressionMethod
  } = generalImageModule;
  if (lossyImageCompression === '01' && lossyImageCompressionRatio !== '') {
    const compressionMethod = lossyImageCompressionMethod || 'Lossy: ';
    const compressionRatio = formatNumberPrecision(lossyImageCompressionRatio, 2);
    return compressionMethod + compressionRatio + ' : 1';
  }
  return 'Lossless / Uncompressed';
}
;// CONCATENATED MODULE: ../../../extensions/cornerstone/src/Viewport/Overlays/CustomizableViewportOverlay.css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ../../../extensions/cornerstone/src/Viewport/Overlays/CustomizableViewportOverlay.tsx








const EPSILON = 1e-4;
const {
  formatPN
} = src.utils;
const OverlayItemComponents = {
  'ohif.overlayItem': OverlayItem,
  'ohif.overlayItem.windowLevel': VOIOverlayItem,
  'ohif.overlayItem.zoomLevel': ZoomOverlayItem,
  'ohif.overlayItem.instanceNumber': InstanceNumberOverlayItem
};

/**
 * Customizable Viewport Overlay
 */
function CustomizableViewportOverlay({
  element,
  viewportData,
  imageSliceData,
  viewportId,
  servicesManager
}) {
  const {
    cornerstoneViewportService,
    customizationService,
    toolGroupService,
    displaySetService
  } = servicesManager.services;
  const [voi, setVOI] = (0,react.useState)({
    windowCenter: null,
    windowWidth: null
  });
  const [scale, setScale] = (0,react.useState)(1);
  const {
    imageIndex
  } = imageSliceData;

  // Historical usage defined the overlays as separate items due to lack of
  // append functionality.  This code enables the historical usage, but
  // the recommended functionality is to append to the default values in
  // cornerstoneOverlay rather than defining individual items.
  const topLeftCustomization = customizationService.getCustomization('viewportOverlay.topLeft');
  const topRightCustomization = customizationService.getCustomization('viewportOverlay.topRight');
  const bottomLeftCustomization = customizationService.getCustomization('viewportOverlay.bottomLeft');
  const bottomRightCustomization = customizationService.getCustomization('viewportOverlay.bottomRight');
  const instanceNumber = (0,react.useMemo)(() => viewportData ? getInstanceNumber(viewportData, viewportId, imageIndex, cornerstoneViewportService) : null, [viewportData, viewportId, imageIndex, cornerstoneViewportService]);
  const displaySetProps = (0,react.useMemo)(() => {
    const displaySets = getDisplaySets(viewportData, displaySetService);
    if (!displaySets) {
      return null;
    }
    const [displaySet] = displaySets;
    const {
      instances,
      instance: referenceInstance
    } = displaySet;
    return {
      displaySets,
      displaySet,
      instance: instances?.[imageIndex],
      instances,
      referenceInstance
    };
  }, [viewportData, viewportId, instanceNumber, cornerstoneViewportService]);

  /**
   * Updating the VOI when the viewport changes its voi
   */
  (0,react.useEffect)(() => {
    const updateVOI = eventDetail => {
      const {
        range
      } = eventDetail.detail;
      if (!range) {
        return;
      }
      const {
        lower,
        upper
      } = range;
      const {
        windowWidth,
        windowCenter
      } = dist_esm.utilities.windowLevel.toWindowLevel(lower, upper);
      setVOI({
        windowCenter,
        windowWidth
      });
    };
    element.addEventListener(dist_esm.Enums.Events.VOI_MODIFIED, updateVOI);
    return () => {
      element.removeEventListener(dist_esm.Enums.Events.VOI_MODIFIED, updateVOI);
    };
  }, [viewportId, viewportData, voi, element]);

  /**
   * Updating the scale when the viewport changes its zoom
   */
  (0,react.useEffect)(() => {
    const updateScale = eventDetail => {
      const {
        previousCamera,
        camera
      } = eventDetail.detail;
      if (previousCamera.parallelScale !== camera.parallelScale || previousCamera.scale !== camera.scale) {
        const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
        if (!viewport) {
          return;
        }
        const scale = viewport.getZoom();
        setScale(scale);
      }
    };
    element.addEventListener(dist_esm.Enums.Events.CAMERA_MODIFIED, updateScale);
    return () => {
      element.removeEventListener(dist_esm.Enums.Events.CAMERA_MODIFIED, updateScale);
    };
  }, [viewportId, viewportData, cornerstoneViewportService, element]);
  const _renderOverlayItem = (0,react.useCallback)((item, props) => {
    const overlayItemProps = {
      ...props,
      element,
      viewportData,
      imageSliceData,
      viewportId,
      servicesManager,
      customization: item,
      formatters: {
        formatPN,
        formatDate: formatDICOMDate,
        formatTime: formatDICOMTime,
        formatNumberPrecision: formatNumberPrecision
      }
    };
    if (!item) {
      return null;
    }
    const {
      inheritsFrom
    } = item;
    const OverlayItemComponent = OverlayItemComponents[inheritsFrom];
    if (OverlayItemComponent) {
      return /*#__PURE__*/react.createElement(OverlayItemComponent, overlayItemProps);
    } else {
      const renderItem = customizationService.transform(item);
      if (typeof renderItem.contentF === 'function') {
        return renderItem.contentF(overlayItemProps);
      }
    }
  }, [element, viewportData, imageSliceData, viewportId, servicesManager, customizationService, displaySetProps, voi, scale, instanceNumber]);
  const getContent = (0,react.useCallback)((customization, keyPrefix) => {
    const props = {
      ...displaySetProps,
      formatters: {
        formatDate: formatDICOMDate
      },
      voi,
      scale,
      instanceNumber,
      viewportId,
      toolGroupService
    };
    return /*#__PURE__*/react.createElement(react.Fragment, null, customization.map((item, index) => /*#__PURE__*/react.createElement("div", {
      key: `${keyPrefix}_${index}`
    }, (!item?.condition || item.condition(props)) && _renderOverlayItem(item, props) || null)));
  }, [_renderOverlayItem]);
  return /*#__PURE__*/react.createElement(ui_next_src/* ViewportOverlay */.pUj, {
    topLeft: getContent(topLeftCustomization, 'topLeftOverlayItem'),
    topRight: getContent(topRightCustomization, 'topRightOverlayItem'),
    bottomLeft: getContent(bottomLeftCustomization, 'bottomLeftOverlayItem'),
    bottomRight: getContent(bottomRightCustomization, 'bottomRightOverlayItem')
  });
}

/**
 * Gets an array of display sets for the given viewport, based on the viewport data.
 * Returns null if none found.
 */
function getDisplaySets(viewportData, displaySetService) {
  if (!viewportData?.data?.length) {
    return null;
  }
  const displaySets = viewportData.data.map(datum => displaySetService.getDisplaySetByUID(datum.displaySetInstanceUID)).filter(it => !!it);
  if (!displaySets.length) {
    return null;
  }
  return displaySets;
}
const getInstanceNumber = (viewportData, viewportId, imageIndex, cornerstoneViewportService) => {
  let instanceNumber;
  switch (viewportData.viewportType) {
    case dist_esm.Enums.ViewportType.STACK:
      instanceNumber = _getInstanceNumberFromStack(viewportData, imageIndex);
      break;
    case dist_esm.Enums.ViewportType.ORTHOGRAPHIC:
      instanceNumber = _getInstanceNumberFromVolume(viewportData, viewportId, cornerstoneViewportService, imageIndex);
      break;
  }
  return instanceNumber ?? null;
};
function _getInstanceNumberFromStack(viewportData, imageIndex) {
  const imageIds = viewportData.data[0].imageIds;
  const imageId = imageIds[imageIndex];
  if (!imageId) {
    return;
  }
  const generalImageModule = dist_esm.metaData.get('generalImageModule', imageId) || {};
  const {
    instanceNumber
  } = generalImageModule;
  const stackSize = imageIds.length;
  if (stackSize <= 1) {
    return;
  }
  return parseInt(instanceNumber);
}

// Since volume viewports can be in any view direction, they can render
// a reconstructed image which don't have imageIds; therefore, no instance and instanceNumber
// Here we check if viewport is in the acquisition direction and if so, we get the instanceNumber
function _getInstanceNumberFromVolume(viewportData, viewportId, cornerstoneViewportService, imageIndex) {
  const volumes = viewportData.data;
  if (!volumes) {
    return;
  }

  // Todo: support fusion of acquisition plane which has instanceNumber
  const {
    volume
  } = volumes[0];
  if (!volume) {
    return;
  }
  const {
    direction,
    imageIds
  } = volume;
  const cornerstoneViewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
  if (!cornerstoneViewport) {
    return;
  }
  const camera = cornerstoneViewport.getCamera();
  const {
    viewPlaneNormal
  } = camera;
  // checking if camera is looking at the acquisition plane (defined by the direction on the volume)

  const scanAxisNormal = direction.slice(6, 9);

  // check if viewPlaneNormal is parallel to scanAxisNormal
  const cross = gl_matrix_esm/* vec3.cross */.eR.cross(gl_matrix_esm/* vec3.create */.eR.create(), viewPlaneNormal, scanAxisNormal);
  const isAcquisitionPlane = gl_matrix_esm/* vec3.length */.eR.length(cross) < EPSILON;
  if (isAcquisitionPlane) {
    const imageId = imageIds[imageIndex];
    if (!imageId) {
      return {};
    }
    const {
      instanceNumber
    } = dist_esm.metaData.get('generalImageModule', imageId) || {};
    return parseInt(instanceNumber);
  }
}
function OverlayItem(props) {
  const {
    instance,
    customization = {}
  } = props;
  const {
    color,
    attribute,
    title,
    label,
    background
  } = customization;
  const value = customization.contentF?.(props, customization) ?? instance?.[attribute];
  if (value === undefined || value === null) {
    return null;
  }
  return /*#__PURE__*/react.createElement("div", {
    className: "overlay-item flex flex-row",
    style: {
      color,
      background
    },
    title: title
  }, label ? /*#__PURE__*/react.createElement("span", {
    className: "mr-1 shrink-0"
  }, label) : null, /*#__PURE__*/react.createElement("span", {
    className: "ml-0 mr-2 shrink-0"
  }, value));
}

/**
 * Window Level / Center Overlay item
 */
function VOIOverlayItem({
  voi,
  customization
}) {
  const {
    windowWidth,
    windowCenter
  } = voi;
  if (typeof windowCenter !== 'number' || typeof windowWidth !== 'number') {
    return null;
  }
  return /*#__PURE__*/react.createElement("div", {
    className: "overlay-item flex flex-row",
    style: {
      color: customization?.color
    }
  }, /*#__PURE__*/react.createElement("span", {
    className: "mr-0.5 shrink-0 opacity-[0.67]"
  }, "W:"), /*#__PURE__*/react.createElement("span", {
    className: "mr-2.5 shrink-0"
  }, windowWidth.toFixed(0)), /*#__PURE__*/react.createElement("span", {
    className: "mr-0.5 shrink-0 opacity-[0.67]"
  }, "L:"), /*#__PURE__*/react.createElement("span", {
    className: "shrink-0"
  }, windowCenter.toFixed(0)));
}

/**
 * Zoom Level Overlay item
 */
function ZoomOverlayItem({
  scale,
  customization
}) {
  return /*#__PURE__*/react.createElement("div", {
    className: "overlay-item flex flex-row",
    style: {
      color: customization && customization.color || undefined
    }
  }, /*#__PURE__*/react.createElement("span", {
    className: "mr-0.5 shrink-0 opacity-[0.67]"
  }, "Zoom:"), /*#__PURE__*/react.createElement("span", null, scale.toFixed(2), "x"));
}

/**
 * Instance Number Overlay Item
 */
function InstanceNumberOverlayItem({
  instanceNumber,
  imageSliceData,
  customization
}) {
  const {
    imageIndex,
    numberOfSlices
  } = imageSliceData;
  return /*#__PURE__*/react.createElement("div", {
    className: "overlay-item flex flex-row",
    style: {
      color: customization && customization.color || undefined
    }
  }, /*#__PURE__*/react.createElement("span", null, instanceNumber !== undefined && instanceNumber !== null ? /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("span", {
    className: "mr-0.5 shrink-0 opacity-[0.67]"
  }, "I:"), /*#__PURE__*/react.createElement("span", null, `${instanceNumber} (${imageIndex + 1}/${numberOfSlices})`)) : `${imageIndex + 1}/${numberOfSlices}`));
}
CustomizableViewportOverlay.propTypes = {
  viewportData: (prop_types_default()).object,
  imageIndex: (prop_types_default()).number,
  viewportId: (prop_types_default()).string
};
/* harmony default export */ const Overlays_CustomizableViewportOverlay = (CustomizableViewportOverlay);

// EXTERNAL MODULE: ../../../node_modules/classnames/index.js
var classnames = __webpack_require__(55530);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
;// CONCATENATED MODULE: ../../../extensions/cornerstone/src/Viewport/Overlays/ViewportOrientationMarkers.css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ../../../extensions/cornerstone/src/Viewport/Overlays/ViewportOrientationMarkers.tsx






const {
  getOrientationStringLPS,
  invertOrientationStringLPS
} = esm.utilities.orientation;
function ViewportOrientationMarkers({
  element,
  viewportData,
  imageSliceData,
  viewportId,
  servicesManager,
  orientationMarkers = ['top', 'left']
}) {
  // Rotation is in degrees
  const [rotation, setRotation] = (0,react.useState)(0);
  const [flipHorizontal, setFlipHorizontal] = (0,react.useState)(false);
  const [flipVertical, setFlipVertical] = (0,react.useState)(false);
  const {
    cornerstoneViewportService
  } = servicesManager.services;
  (0,react.useEffect)(() => {
    const cameraModifiedListener = evt => {
      const {
        previousCamera,
        camera
      } = evt.detail;
      const {
        rotation
      } = camera;
      if (rotation !== undefined) {
        setRotation(rotation);
      }
      if (camera.flipHorizontal !== undefined && previousCamera.flipHorizontal !== camera.flipHorizontal) {
        setFlipHorizontal(camera.flipHorizontal);
      }
      if (camera.flipVertical !== undefined && previousCamera.flipVertical !== camera.flipVertical) {
        setFlipVertical(camera.flipVertical);
      }
    };
    element.addEventListener(dist_esm.Enums.Events.CAMERA_MODIFIED, cameraModifiedListener);
    return () => {
      element.removeEventListener(dist_esm.Enums.Events.CAMERA_MODIFIED, cameraModifiedListener);
    };
  }, []);
  const markers = (0,react.useMemo)(() => {
    if (!viewportData) {
      return '';
    }
    let rowCosines, columnCosines, isDefaultValueSetForRowCosine, isDefaultValueSetForColumnCosine;
    if (viewportData.viewportType === 'stack') {
      const imageIndex = imageSliceData.imageIndex;
      const imageId = viewportData.data[0].imageIds?.[imageIndex];

      // Workaround for below TODO stub
      if (!imageId) {
        return false;
      }
      ({
        rowCosines,
        columnCosines,
        isDefaultValueSetForColumnCosine,
        isDefaultValueSetForColumnCosine
      } = dist_esm.metaData.get('imagePlaneModule', imageId) || {});
    } else {
      if (!element || !(0,dist_esm.getEnabledElement)(element)) {
        return '';
      }
      const {
        viewport
      } = (0,dist_esm.getEnabledElement)(element);
      const {
        viewUp,
        viewPlaneNormal
      } = viewport.getCamera();
      const viewRight = gl_matrix_esm/* vec3.create */.eR.create();
      gl_matrix_esm/* vec3.cross */.eR.cross(viewRight, viewUp, viewPlaneNormal);
      columnCosines = [-viewUp[0], -viewUp[1], -viewUp[2]];
      rowCosines = viewRight;
    }
    if (!rowCosines || !columnCosines || rotation === undefined || isDefaultValueSetForRowCosine || isDefaultValueSetForColumnCosine) {
      return '';
    }
    const markers = _getOrientationMarkers(rowCosines, columnCosines, rotation, flipVertical, flipHorizontal);
    const ohifViewport = cornerstoneViewportService.getViewportInfo(viewportId);
    if (!ohifViewport) {
      console.log('ViewportOrientationMarkers::No viewport');
      return null;
    }
    return orientationMarkers.map((m, index) => /*#__PURE__*/react.createElement("div", {
      className: classnames_default()('overlay-text', `${m}-mid orientation-marker`, 'text-highlight/65', 'text-base', 'leading-5'),
      key: `${m}-mid orientation-marker`
    }, /*#__PURE__*/react.createElement("div", {
      className: "orientation-marker-value"
    }, markers[m])));
  }, [viewportData, imageSliceData, rotation, flipVertical, flipHorizontal, orientationMarkers, element]);
  return /*#__PURE__*/react.createElement("div", {
    className: "ViewportOrientationMarkers select-none"
  }, markers);
}

/**
 *
 * Computes the orientation labels on a Cornerstone-enabled Viewport element
 * when the viewport settings change (e.g. when a horizontal flip or a rotation occurs)
 *
 * @param {*} rowCosines
 * @param {*} columnCosines
 * @param {*} rotation in degrees
 * @returns
 */
function _getOrientationMarkers(rowCosines, columnCosines, rotation, flipVertical, flipHorizontal) {
  const rowString = getOrientationStringLPS(rowCosines);
  const columnString = getOrientationStringLPS(columnCosines);
  const oppositeRowString = invertOrientationStringLPS(rowString);
  const oppositeColumnString = invertOrientationStringLPS(columnString);
  const markers = {
    top: oppositeColumnString,
    left: oppositeRowString,
    right: rowString,
    bottom: columnString
  };

  // If any vertical or horizontal flips are applied, change the orientation strings ahead of
  // the rotation applications
  if (flipVertical) {
    markers.top = invertOrientationStringLPS(markers.top);
    markers.bottom = invertOrientationStringLPS(markers.bottom);
  }
  if (flipHorizontal) {
    markers.left = invertOrientationStringLPS(markers.left);
    markers.right = invertOrientationStringLPS(markers.right);
  }

  // Swap the labels accordingly if the viewport has been rotated
  // This could be done in a more complex way for intermediate rotation values (e.g. 45 degrees)
  if (rotation === 90 || rotation === -270) {
    return {
      top: markers.left,
      left: invertOrientationStringLPS(markers.top),
      right: invertOrientationStringLPS(markers.bottom),
      bottom: markers.right // left
    };
  } else if (rotation === -90 || rotation === 270) {
    return {
      top: invertOrientationStringLPS(markers.left),
      left: markers.top,
      bottom: markers.left,
      right: markers.bottom
    };
  } else if (rotation === 180 || rotation === -180) {
    return {
      top: invertOrientationStringLPS(markers.top),
      left: invertOrientationStringLPS(markers.left),
      bottom: invertOrientationStringLPS(markers.bottom),
      right: invertOrientationStringLPS(markers.right)
    };
  }
  return markers;
}
/* harmony default export */ const Overlays_ViewportOrientationMarkers = (ViewportOrientationMarkers);
;// CONCATENATED MODULE: ../../../extensions/cornerstone/src/Viewport/Overlays/ViewportImageSliceLoadingIndicator.tsx



function ViewportImageSliceLoadingIndicator({
  viewportData,
  element
}) {
  const [loading, setLoading] = (0,react.useState)(false);
  const [error, setError] = (0,react.useState)(false);
  const loadIndicatorRef = (0,react.useRef)(null);
  const imageIdToBeLoaded = (0,react.useRef)(null);
  const setLoadingState = evt => {
    clearTimeout(loadIndicatorRef.current);
    loadIndicatorRef.current = setTimeout(() => {
      setLoading(true);
    }, 50);
  };
  const setFinishLoadingState = evt => {
    clearTimeout(loadIndicatorRef.current);
    setLoading(false);
  };
  const setErrorState = evt => {
    clearTimeout(loadIndicatorRef.current);
    if (imageIdToBeLoaded.current === evt.detail.imageId) {
      setError(evt.detail.error);
      imageIdToBeLoaded.current = null;
    }
  };
  (0,react.useEffect)(() => {
    element.addEventListener(dist_esm.Enums.Events.STACK_VIEWPORT_SCROLL, setLoadingState);
    element.addEventListener(dist_esm.Enums.Events.IMAGE_LOAD_ERROR, setErrorState);
    element.addEventListener(dist_esm.Enums.Events.STACK_NEW_IMAGE, setFinishLoadingState);
    return () => {
      element.removeEventListener(dist_esm.Enums.Events.STACK_VIEWPORT_SCROLL, setLoadingState);
      element.removeEventListener(dist_esm.Enums.Events.STACK_NEW_IMAGE, setFinishLoadingState);
      element.removeEventListener(dist_esm.Enums.Events.IMAGE_LOAD_ERROR, setErrorState);
    };
  }, [element, viewportData]);
  if (error) {
    return /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
      className: "absolute top-0 left-0 h-full w-full bg-black opacity-50"
    }, /*#__PURE__*/react.createElement("div", {
      className: "transparent flex h-full w-full items-center justify-center"
    }, /*#__PURE__*/react.createElement("p", {
      className: "text-primary-light text-xl font-light"
    }, /*#__PURE__*/react.createElement("h4", null, "Error Loading Image"), /*#__PURE__*/react.createElement("p", null, "An error has occurred."), /*#__PURE__*/react.createElement("p", null, error)))));
  }
  if (loading) {
    return (
      /*#__PURE__*/
      // IMPORTANT: we need to use the pointer-events-none class to prevent the loading indicator from
      // interacting with the mouse, since scrolling should propagate to the viewport underneath
      react.createElement("div", {
        className: "pointer-events-none absolute top-0 left-0 h-full w-full bg-black opacity-50"
      }, /*#__PURE__*/react.createElement("div", {
        className: "transparent flex h-full w-full items-center justify-center"
      }, /*#__PURE__*/react.createElement("p", {
        className: "text-primary-light text-xl font-light"
      }, "Loading...")))
    );
  }
  return null;
}
ViewportImageSliceLoadingIndicator.propTypes = {
  error: (prop_types_default()).object,
  element: (prop_types_default()).object
};
/* harmony default export */ const Overlays_ViewportImageSliceLoadingIndicator = (ViewportImageSliceLoadingIndicator);
;// CONCATENATED MODULE: ../../../extensions/cornerstone/src/Viewport/Overlays/CornerstoneOverlays.tsx





function CornerstoneOverlays(props) {
  const {
    viewportId,
    element,
    scrollbarHeight,
    servicesManager
  } = props;
  const {
    cornerstoneViewportService
  } = servicesManager.services;
  const [imageSliceData, setImageSliceData] = (0,react.useState)({
    imageIndex: 0,
    numberOfSlices: 0
  });
  const [viewportData, setViewportData] = (0,react.useState)(null);
  (0,react.useEffect)(() => {
    const {
      unsubscribe
    } = cornerstoneViewportService.subscribe(cornerstoneViewportService.EVENTS.VIEWPORT_DATA_CHANGED, props => {
      if (props.viewportId !== viewportId) {
        return;
      }
      setViewportData(props.viewportData);
    });
    return () => {
      unsubscribe();
    };
  }, [viewportId]);
  if (!element) {
    return null;
  }
  if (viewportData) {
    const viewportInfo = cornerstoneViewportService.getViewportInfo(viewportId);
    if (viewportInfo?.viewportOptions?.customViewportProps?.hideOverlays) {
      return null;
    }
  }
  return /*#__PURE__*/react.createElement("div", {
    className: "noselect"
  }, /*#__PURE__*/react.createElement(ViewportImageScrollbar, {
    viewportId: viewportId,
    viewportData: viewportData,
    element: element,
    imageSliceData: imageSliceData,
    setImageSliceData: setImageSliceData,
    scrollbarHeight: scrollbarHeight,
    servicesManager: servicesManager
  }), /*#__PURE__*/react.createElement(Overlays_CustomizableViewportOverlay, {
    imageSliceData: imageSliceData,
    viewportData: viewportData,
    viewportId: viewportId,
    servicesManager: servicesManager,
    element: element
  }), /*#__PURE__*/react.createElement(Overlays_ViewportImageSliceLoadingIndicator, {
    viewportData: viewportData,
    element: element
  }), /*#__PURE__*/react.createElement(Overlays_ViewportOrientationMarkers, {
    imageSliceData: imageSliceData,
    element: element,
    viewportData: viewportData,
    servicesManager: servicesManager,
    viewportId: viewportId
  }));
}
/* harmony default export */ const Overlays_CornerstoneOverlays = (CornerstoneOverlays);
// EXTERNAL MODULE: ./state/index.js + 1 modules
var state_0 = __webpack_require__(45981);
;// CONCATENATED MODULE: ../../../extensions/cornerstone/src/components/CinePlayer/CinePlayer.tsx




function WrappedCinePlayer({
  enabledVPElement,
  viewportId,
  servicesManager
}) {
  const {
    customizationService,
    displaySetService,
    viewportGridService
  } = servicesManager.services;
  const [{
    isCineEnabled,
    cines
  }, cineService] = (0,ui_next_src/* useCine */.tqw)();
  const [newStackFrameRate, setNewStackFrameRate] = (0,react.useState)(24);
  const [dynamicInfo, setDynamicInfo] = (0,react.useState)(null);
  const [appConfig] = (0,state_0/* useAppConfig */.r)();
  const isMountedRef = (0,react.useRef)(null);
  const cineHandler = () => {
    if (!cines?.[viewportId] || !enabledVPElement) {
      return;
    }
    const {
      isPlaying = false,
      frameRate = 24
    } = cines[viewportId];
    const validFrameRate = Math.max(frameRate, 1);
    return isPlaying ? cineService.playClip(enabledVPElement, {
      framesPerSecond: validFrameRate,
      viewportId
    }) : cineService.stopClip(enabledVPElement);
  };
  const newDisplaySetHandler = (0,react.useCallback)(() => {
    if (!enabledVPElement || !isCineEnabled) {
      return;
    }
    const {
      viewports
    } = viewportGridService.getState();
    const {
      displaySetInstanceUIDs
    } = viewports.get(viewportId);
    let frameRate = 24;
    let isPlaying = cines[viewportId]?.isPlaying || false;
    displaySetInstanceUIDs.forEach(displaySetInstanceUID => {
      const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
      if (displaySet.FrameRate) {
        // displaySet.FrameRate corresponds to DICOM tag (0018,1063) which is defined as the the frame time in milliseconds
        // So a bit of math to get the actual frame rate.
        frameRate = Math.round(1000 / displaySet.FrameRate);
        isPlaying ||= !!appConfig.autoPlayCine;
      }

      // check if the displaySet is dynamic and set the dynamic info
      if (displaySet.isDynamicVolume) {
        const {
          dynamicVolumeInfo
        } = displaySet;
        const numDimensionGroups = dynamicVolumeInfo.timePoints.length;
        const label = dynamicVolumeInfo.splittingTag;
        const dimensionGroupNumber = dynamicVolumeInfo.dimensionGroupNumber || 1;
        setDynamicInfo({
          volumeId: displaySet.displaySetInstanceUID,
          dimensionGroupNumber,
          numDimensionGroups,
          label
        });
      } else {
        setDynamicInfo(null);
      }
    });
    if (isPlaying) {
      cineService.setIsCineEnabled(isPlaying);
    }
    cineService.setCine({
      id: viewportId,
      isPlaying,
      frameRate
    });
    setNewStackFrameRate(frameRate);
  }, [displaySetService, viewportId, viewportGridService, cines, isCineEnabled, enabledVPElement]);
  (0,react.useEffect)(() => {
    isMountedRef.current = true;
    newDisplaySetHandler();
    return () => {
      isMountedRef.current = false;
    };
  }, [isCineEnabled, newDisplaySetHandler]);
  (0,react.useEffect)(() => {
    if (!isCineEnabled) {
      return;
    }
    cineHandler();
  }, [isCineEnabled, cineHandler, enabledVPElement]);

  /**
   * Use effect for handling new display set
   */
  (0,react.useEffect)(() => {
    if (!enabledVPElement) {
      return;
    }
    enabledVPElement.addEventListener(dist_esm.Enums.Events.VIEWPORT_NEW_IMAGE_SET, newDisplaySetHandler);
    // this doesn't makes sense that we are listening to this event on viewport element
    enabledVPElement.addEventListener(dist_esm.Enums.Events.VOLUME_VIEWPORT_NEW_VOLUME, newDisplaySetHandler);
    return () => {
      cineService.setCine({
        id: viewportId,
        isPlaying: false
      });
      enabledVPElement.removeEventListener(dist_esm.Enums.Events.VIEWPORT_NEW_IMAGE_SET, newDisplaySetHandler);
      enabledVPElement.removeEventListener(dist_esm.Enums.Events.VOLUME_VIEWPORT_NEW_VOLUME, newDisplaySetHandler);
    };
  }, [enabledVPElement, newDisplaySetHandler, viewportId]);
  (0,react.useEffect)(() => {
    if (!cines || !cines[viewportId] || !enabledVPElement || !isMountedRef.current) {
      return;
    }
    cineHandler();
    return () => {
      cineService.stopClip(enabledVPElement, {
        viewportId
      });
    };
  }, [cines, viewportId, cineService, enabledVPElement, cineHandler]);
  if (!isCineEnabled) {
    return null;
  }
  const cine = cines[viewportId];
  const isPlaying = cine?.isPlaying || false;
  return /*#__PURE__*/react.createElement(RenderCinePlayer, {
    viewportId: viewportId,
    cineService: cineService,
    newStackFrameRate: newStackFrameRate,
    isPlaying: isPlaying,
    dynamicInfo: dynamicInfo,
    customizationService: customizationService
  });
}
function RenderCinePlayer({
  viewportId,
  cineService,
  newStackFrameRate,
  isPlaying,
  dynamicInfo: dynamicInfoProp,
  customizationService
}) {
  const CinePlayerComponent = customizationService.getCustomization('cinePlayer');
  const [dynamicInfo, setDynamicInfo] = (0,react.useState)(dynamicInfoProp);
  (0,react.useEffect)(() => {
    setDynamicInfo(dynamicInfoProp);
  }, [dynamicInfoProp]);

  /**
   * Use effect for handling 4D time index changed
   */
  (0,react.useEffect)(() => {
    if (!dynamicInfo) {
      return;
    }
    const handleDimensionGroupChange = evt => {
      const {
        volumeId,
        dimensionGroupNumber,
        numDimensionGroups,
        splittingTag
      } = evt.detail;
      setDynamicInfo({
        volumeId,
        dimensionGroupNumber,
        numDimensionGroups,
        label: splittingTag
      });
    };
    dist_esm.eventTarget.addEventListener(dist_esm.Enums.Events.DYNAMIC_VOLUME_DIMENSION_GROUP_CHANGED, handleDimensionGroupChange);
    return () => {
      dist_esm.eventTarget.removeEventListener(dist_esm.Enums.Events.DYNAMIC_VOLUME_DIMENSION_GROUP_CHANGED, handleDimensionGroupChange);
    };
  }, [dynamicInfo]);
  (0,react.useEffect)(() => {
    if (!dynamicInfo) {
      return;
    }
    const {
      volumeId,
      dimensionGroupNumber,
      numDimensionGroups,
      splittingTag
    } = dynamicInfo || {};
    const volume = dist_esm.cache.getVolume(volumeId, true);
    volume.dimensionGroupNumber = dimensionGroupNumber;
    setDynamicInfo({
      volumeId,
      dimensionGroupNumber,
      numDimensionGroups,
      label: splittingTag
    });
  }, []);
  const updateDynamicInfo = (0,react.useCallback)(props => {
    const {
      volumeId,
      dimensionGroupNumber
    } = props;
    const volume = dist_esm.cache.getVolume(volumeId, true);
    volume.dimensionGroupNumber = dimensionGroupNumber;
  }, []);
  return /*#__PURE__*/react.createElement(CinePlayerComponent, {
    className: "absolute left-1/2 bottom-3 -translate-x-1/2",
    frameRate: newStackFrameRate,
    isPlaying: isPlaying,
    onClose: () => {
      // also stop the clip
      cineService.setCine({
        id: viewportId,
        isPlaying: false
      });
      cineService.setIsCineEnabled(false);
      cineService.setViewportCineClosed(viewportId);
    },
    onPlayPauseChange: isPlaying => {
      cineService.setCine({
        id: viewportId,
        isPlaying
      });
    },
    onFrameRateChange: frameRate => cineService.setCine({
      id: viewportId,
      frameRate
    }),
    dynamicInfo: dynamicInfo,
    updateDynamicInfo: updateDynamicInfo
  });
}
/* harmony default export */ const CinePlayer = (WrappedCinePlayer);
;// CONCATENATED MODULE: ../../../extensions/cornerstone/src/components/CinePlayer/index.ts

/* harmony default export */ const components_CinePlayer = (CinePlayer);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/contextProviders/ViewportActionCornersProvider.tsx
var ViewportActionCornersProvider = __webpack_require__(76255);
;// CONCATENATED MODULE: ../../../extensions/cornerstone/src/components/OHIFViewportActionCorners.tsx



function OHIFViewportActionCorners({
  viewportId
}) {
  const {
    servicesManager
  } = (0,src.useSystem)();
  const [viewportActionCornersState] = (0,ViewportActionCornersProvider/* useViewportActionCornersContext */.R4)();
  const ViewportActionCorners = servicesManager.services.customizationService.getCustomization('ui.viewportActionCorner');
  if (!viewportActionCornersState[viewportId]) {
    return null;
  }
  return /*#__PURE__*/react.createElement(ViewportActionCorners, {
    cornerComponents: viewportActionCornersState[viewportId]
  });
}
/* harmony default export */ const components_OHIFViewportActionCorners = (OHIFViewportActionCorners);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/components/WindowLevelActionMenu/WindowLevelActionMenu.tsx + 10 modules
var WindowLevelActionMenu_WindowLevelActionMenu = __webpack_require__(35392);
;// CONCATENATED MODULE: ../../../extensions/cornerstone/src/components/WindowLevelActionMenu/getWindowLevelActionMenu.tsx


function getWindowLevelActionMenu({
  viewportId,
  element,
  displaySets,
  servicesManager,
  commandsManager,
  verticalDirection,
  horizontalDirection
}) {
  const {
    customizationService
  } = servicesManager.services;
  const presets = customizationService.getCustomization('cornerstone.windowLevelPresets');
  const colorbarProperties = customizationService.getCustomization('cornerstone.colorbar');
  const {
    volumeRenderingPresets,
    volumeRenderingQualityRange
  } = customizationService.getCustomization('cornerstone.3dVolumeRendering');
  const WindowLevelActionMenu = customizationService.getCustomization('viewportActionMenu.windowLevelActionMenu');
  const displaySetPresets = displaySets.filter(displaySet => presets[displaySet.Modality]).map(displaySet => {
    return {
      [displaySet.Modality]: presets[displaySet.Modality]
    };
  });
  const modalities = displaySets.map(displaySet => displaySet.Modality).filter(modality => !WindowLevelActionMenu_WindowLevelActionMenu/* nonWLModalities */.i.includes(modality));
  if (modalities.length === 0) {
    return null;
  }
  const WindowLevelActionMenuComponent = WindowLevelActionMenu?.component;
  return /*#__PURE__*/react.createElement(WindowLevelActionMenuComponent, {
    viewportId: viewportId,
    element: element,
    presets: displaySetPresets,
    verticalDirection: verticalDirection,
    horizontalDirection: horizontalDirection,
    commandsManager: commandsManager,
    servicesManager: servicesManager,
    colorbarProperties: colorbarProperties,
    displaySets: displaySets,
    volumeRenderingPresets: volumeRenderingPresets,
    volumeRenderingQualityRange: volumeRenderingQualityRange
  });
}
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/enums/index.js + 2 modules
var enums = __webpack_require__(99737);
;// CONCATENATED MODULE: ../../../extensions/cornerstone/src/components/ViewportDataOverlaySettingMenu/ViewportSegmentationMenu.tsx



function ViewportSegmentationMenu({
  viewportId,
  servicesManager
}) {
  const {
    segmentationService
  } = servicesManager.services;
  const [activeSegmentations, setActiveSegmentations] = (0,react.useState)([]);
  const [availableSegmentations, setAvailableSegmentations] = (0,react.useState)([]);
  (0,react.useEffect)(() => {
    const updateSegmentations = () => {
      const active = segmentationService.getSegmentationRepresentations(viewportId);
      setActiveSegmentations(active);
      const all = segmentationService.getSegmentations();
      const available = all.filter(seg => !active.some(activeSeg => activeSeg.segmentationId === seg.segmentationId));
      setAvailableSegmentations(available);
    };
    updateSegmentations();
    const subscriptions = [segmentationService.EVENTS.SEGMENTATION_MODIFIED, segmentationService.EVENTS.SEGMENTATION_REMOVED, segmentationService.EVENTS.SEGMENTATION_REPRESENTATION_MODIFIED].map(event => segmentationService.subscribe(event, updateSegmentations));
    return () => {
      subscriptions.forEach(subscription => subscription.unsubscribe());
    };
  }, [segmentationService, viewportId]);
  const toggleSegmentationRepresentationVisibility = (segmentationId, type = enums.SegmentationRepresentations.Labelmap) => {
    segmentationService.toggleSegmentationRepresentationVisibility(viewportId, {
      segmentationId,
      type
    });
  };
  const addSegmentationToViewport = segmentationId => {
    segmentationService.addSegmentationRepresentation(viewportId, {
      segmentationId
    });
  };
  const removeSegmentationFromViewport = segmentationId => {
    segmentationService.removeSegmentationRepresentations(viewportId, {
      segmentationId
    });
  };
  return /*#__PURE__*/react.createElement("div", {
    className: "bg-muted flex h-full w-[262px] flex-col rounded p-3"
  }, /*#__PURE__*/react.createElement("span", {
    className: "text-muted-foreground mb-2 text-xs font-semibold"
  }, "Current Viewport"), /*#__PURE__*/react.createElement("ul", {
    className: "space-y-1"
  }, activeSegmentations.map(segmentation => /*#__PURE__*/react.createElement("li", {
    key: segmentation.id,
    className: "flex items-center text-sm"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    size: "icon",
    className: "text-muted-foreground mr-2",
    onClick: () => removeSegmentationFromViewport(segmentation.segmentationId)
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Minus, {
    className: "h-6 w-6"
  })), /*#__PURE__*/react.createElement("span", {
    className: "text-foreground flex-grow"
  }, segmentation.label), segmentation.visible ? /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    size: "icon",
    className: "text-muted-foreground",
    onClick: () => toggleSegmentationRepresentationVisibility(segmentation.segmentationId, segmentation.type)
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Hide, {
    className: "h-6 w-6"
  })) : /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    size: "icon",
    className: "text-muted-foreground",
    onClick: () => toggleSegmentationRepresentationVisibility(segmentation.segmentationId, segmentation.type)
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Show, {
    className: "h-6 w-6"
  }))))), availableSegmentations.length > 0 && /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement(ui_next_src/* Separator */.wvv, {
    className: "bg-input mb-3"
  }), /*#__PURE__*/react.createElement("span", {
    className: "text-muted-foreground mb-2 text-xs font-semibold"
  }, "Available"), /*#__PURE__*/react.createElement("ul", {
    className: "space-y-1"
  }, availableSegmentations.map(({
    segmentationId,
    label
  }) => /*#__PURE__*/react.createElement("li", {
    key: segmentationId,
    className: "flex items-center text-sm"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    size: "icon",
    className: "text-muted-foreground mr-2",
    onClick: () => addSegmentationToViewport(segmentationId)
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.Plus, {
    className: "h-6 w-6"
  })), /*#__PURE__*/react.createElement("span", {
    className: "text-foreground/60"
  }, label))))));
}
/* harmony default export */ const ViewportDataOverlaySettingMenu_ViewportSegmentationMenu = (ViewportSegmentationMenu);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/hooks/useSegmentations.ts
var useSegmentations = __webpack_require__(73421);
;// CONCATENATED MODULE: ../../../extensions/cornerstone/src/components/ViewportDataOverlaySettingMenu/ViewportSegmentationMenuWrapper.tsx





function ViewportSegmentationMenuWrapper({
  viewportId,
  displaySets,
  servicesManager,
  commandsManager,
  location
}) {
  const {
    viewportActionCornersService,
    viewportGridService
  } = servicesManager.services;
  const segmentations = (0,useSegmentations/* useSegmentations */.j)({
    servicesManager
  });
  const activeViewportId = viewportGridService.getActiveViewportId();
  const isActiveViewport = viewportId === activeViewportId;
  const {
    align,
    side
  } = getAlignAndSide(viewportActionCornersService, location);
  if (!segmentations?.length) {
    return null;
  }
  return /*#__PURE__*/react.createElement(ui_next_src/* Popover */.AMh, null, /*#__PURE__*/react.createElement(ui_next_src/* PopoverTrigger */.Wvm, {
    asChild: true,
    className: "flex items-center justify-center"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "ghost",
    size: "icon"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ViewportViews, {
    className: classnames_default()('text-highlight', isActiveViewport ? 'visible' : 'invisible group-hover/pane:visible')
  }))), /*#__PURE__*/react.createElement(ui_next_src/* PopoverContent */.hlN, {
    className: "border-none bg-transparent p-0 shadow-none",
    side: side,
    align: align,
    alignOffset: -15,
    sideOffset: 5
  }, /*#__PURE__*/react.createElement(ViewportDataOverlaySettingMenu_ViewportSegmentationMenu, {
    className: "w-full",
    viewportId: viewportId,
    displaySets: displaySets,
    servicesManager: servicesManager,
    commandsManager: commandsManager
  })));
}
const getAlignAndSide = (viewportActionCornersService, location) => {
  const ViewportActionCornersLocations = viewportActionCornersService.LOCATIONS;
  switch (location) {
    case ViewportActionCornersLocations.topLeft:
      return {
        align: 'start',
        side: 'bottom'
      };
    case ViewportActionCornersLocations.topRight:
      return {
        align: 'end',
        side: 'bottom'
      };
    case ViewportActionCornersLocations.bottomLeft:
      return {
        align: 'start',
        side: 'top'
      };
    case ViewportActionCornersLocations.bottomRight:
      return {
        align: 'end',
        side: 'top'
      };
    default:
      console.debug('Unknown location, defaulting to bottom-start');
      return {
        align: 'start',
        side: 'bottom'
      };
  }
};
;// CONCATENATED MODULE: ../../../extensions/cornerstone/src/components/ViewportDataOverlaySettingMenu/index.tsx


function getViewportDataOverlaySettingsMenu(props) {
  return /*#__PURE__*/react.createElement(ViewportSegmentationMenuWrapper, props);
}
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/stores/usePositionPresentationStore.ts
var usePositionPresentationStore = __webpack_require__(44646);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/stores/useLutPresentationStore.ts
var useLutPresentationStore = __webpack_require__(10182);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/stores/useSegmentationPresentationStore.ts + 1 modules
var useSegmentationPresentationStore = __webpack_require__(2847);
;// CONCATENATED MODULE: ../../../extensions/cornerstone/src/utils/presentations/getViewportPresentations.ts



function getViewportPresentations(viewportId, viewportOptions) {
  const {
    lutPresentationStore
  } = useLutPresentationStore/* useLutPresentationStore */.I.getState();
  const {
    positionPresentationStore
  } = usePositionPresentationStore/* usePositionPresentationStore */.q.getState();
  const {
    segmentationPresentationStore
  } = useSegmentationPresentationStore/* useSegmentationPresentationStore */.v.getState();

  // NOTE: this is the new viewport state, we should not get the presentationIds from the cornerstoneViewportService
  // since that has the old viewport state
  const {
    presentationIds
  } = viewportOptions;
  if (!presentationIds) {
    return {
      positionPresentation: null,
      lutPresentation: null,
      segmentationPresentation: null
    };
  }
  const {
    lutPresentationId,
    positionPresentationId,
    segmentationPresentationId
  } = presentationIds;
  return {
    positionPresentation: positionPresentationStore[positionPresentationId],
    lutPresentation: lutPresentationStore[lutPresentationId],
    segmentationPresentation: segmentationPresentationStore[segmentationPresentationId]
  };
}
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/stores/useSynchronizersStore.ts
var useSynchronizersStore = __webpack_require__(68578);
;// CONCATENATED MODULE: ../../../extensions/cornerstone/src/utils/ActiveViewportBehavior.tsx

const ActiveViewportBehavior = /*#__PURE__*/(0,react.memo)(({
  servicesManager,
  viewportId
}) => {
  const {
    displaySetService,
    cineService,
    viewportGridService,
    customizationService,
    cornerstoneViewportService
  } = servicesManager.services;
  const [activeViewportId, setActiveViewportId] = (0,react.useState)(viewportId);
  const handleCineEnable = (0,react.useCallback)(() => {
    if (cineService.isViewportCineClosed(activeViewportId)) {
      return;
    }
    const displaySetInstanceUIDs = viewportGridService.getDisplaySetsUIDsForViewport(activeViewportId);
    if (!displaySetInstanceUIDs) {
      return;
    }
    const displaySets = displaySetInstanceUIDs.map(uid => displaySetService.getDisplaySetByUID(uid));
    if (!displaySets.length) {
      return;
    }
    const modalities = displaySets.map(displaySet => displaySet?.Modality);
    const isDynamicVolume = displaySets.some(displaySet => displaySet?.isDynamicVolume);
    const sourceModalities = customizationService.getCustomization('autoCineModalities');
    const requiresCine = modalities.some(modality => sourceModalities.includes(modality));
    if ((requiresCine || isDynamicVolume) && !cineService.getState().isCineEnabled) {
      cineService.setIsCineEnabled(true);
    }
  }, [activeViewportId, cineService, viewportGridService, displaySetService, customizationService]);
  (0,react.useEffect)(() => {
    const subscription = viewportGridService.subscribe(viewportGridService.EVENTS.ACTIVE_VIEWPORT_ID_CHANGED, ({
      viewportId
    }) => setActiveViewportId(viewportId));
    return () => subscription.unsubscribe();
  }, [viewportId, viewportGridService]);
  (0,react.useEffect)(() => {
    const subscription = cornerstoneViewportService.subscribe(cornerstoneViewportService.EVENTS.VIEWPORT_DATA_CHANGED, () => {
      const activeViewportId = viewportGridService.getActiveViewportId();
      setActiveViewportId(activeViewportId);
      handleCineEnable();
    });
    return () => subscription.unsubscribe();
  }, [viewportId, cornerstoneViewportService, viewportGridService, handleCineEnable]);
  (0,react.useEffect)(() => {
    handleCineEnable();
  }, [handleCineEnable]);
  return null;
}, arePropsEqual);
ActiveViewportBehavior.displayName = 'ActiveViewportBehavior';
function arePropsEqual(prevProps, nextProps) {
  return prevProps.viewportId === nextProps.viewportId && prevProps.servicesManager === nextProps.servicesManager;
}
/* harmony default export */ const utils_ActiveViewportBehavior = (ActiveViewportBehavior);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/services/ViewportService/CornerstoneViewportService.ts + 4 modules
var CornerstoneViewportService = __webpack_require__(11794);
;// CONCATENATED MODULE: ../../../extensions/cornerstone/src/Viewport/OHIFCornerstoneViewport.tsx


















const STACK = 'stack';

// Todo: This should be done with expose of internal API similar to react-vtkjs-viewport
// Then we don't need to worry about the re-renders if the props change.
const OHIFCornerstoneViewport = /*#__PURE__*/react.memo(props => {
  const {
    displaySets,
    dataSource,
    viewportOptions,
    displaySetOptions,
    servicesManager,
    commandsManager,
    onElementEnabled,
    // eslint-disable-next-line react/prop-types
    onElementDisabled,
    isJumpToMeasurementDisabled = false,
    // Note: you SHOULD NOT use the initialImageIdOrIndex for manipulation
    // of the imageData in the OHIFCornerstoneViewport. This prop is used
    // to set the initial state of the viewport's first image to render
    // eslint-disable-next-line react/prop-types
    initialImageIndex,
    // if the viewport is part of a hanging protocol layout
    // we should not really rely on the old synchronizers and
    // you see below we only rehydrate the synchronizers if the viewport
    // is not part of the hanging protocol layout. HPs should
    // define their own synchronizers. Since the synchronizers are
    // viewportId dependent and
    // eslint-disable-next-line react/prop-types
    isHangingProtocolLayout
  } = props;
  const viewportId = viewportOptions.viewportId;
  if (!viewportId) {
    throw new Error('Viewport ID is required');
  }

  // Make sure displaySetOptions has one object per displaySet
  while (displaySetOptions.length < displaySets.length) {
    displaySetOptions.push({});
  }

  // Since we only have support for dynamic data in volume viewports, we should
  // handle this case here and set the viewportType to volume if any of the
  // displaySets are dynamic volumes
  viewportOptions.viewportType = displaySets.some(ds => ds.isDynamicVolume && ds.isReconstructable) ? 'volume' : viewportOptions.viewportType;
  const [scrollbarHeight, setScrollbarHeight] = (0,react.useState)('100px');
  const [enabledVPElement, setEnabledVPElement] = (0,react.useState)(null);
  const elementRef = (0,react.useRef)();
  const {
    displaySetService,
    toolbarService,
    toolGroupService,
    syncGroupService,
    cornerstoneViewportService,
    segmentationService,
    cornerstoneCacheService,
    viewportActionCornersService,
    customizationService,
    measurementService
  } = servicesManager.services;
  const [viewportDialogState] = (0,ui_next_src/* useViewportDialog */.ORo)();
  // useCallback for scroll bar height calculation
  const setImageScrollBarHeight = (0,react.useCallback)(() => {
    const scrollbarHeight = `${elementRef.current.clientHeight - 10}px`;
    setScrollbarHeight(scrollbarHeight);
  }, [elementRef]);

  // useCallback for onResize
  const onResize = (0,react.useCallback)(() => {
    if (elementRef.current) {
      cornerstoneViewportService.resize();
      setImageScrollBarHeight();
    }
  }, [elementRef]);
  const cleanUpServices = (0,react.useCallback)(viewportInfo => {
    const renderingEngineId = viewportInfo.getRenderingEngineId();
    const syncGroups = viewportInfo.getSyncGroups();
    toolGroupService.removeViewportFromToolGroup(viewportId, renderingEngineId);
    syncGroupService.removeViewportFromSyncGroup(viewportId, renderingEngineId, syncGroups);
    segmentationService.clearSegmentationRepresentations(viewportId);
    viewportActionCornersService.clear(viewportId);
  }, [viewportId, segmentationService, syncGroupService, toolGroupService, viewportActionCornersService]);
  const elementEnabledHandler = (0,react.useCallback)(evt => {
    // check this is this element reference and return early if doesn't match
    if (evt.detail.element !== elementRef.current) {
      return;
    }
    const {
      viewportId,
      element
    } = evt.detail;
    const viewportInfo = cornerstoneViewportService.getViewportInfo(viewportId);
    if (!viewportInfo) {
      return;
    }
    (0,state/* setEnabledElement */.ye)(viewportId, element);
    setEnabledVPElement(element);
    const renderingEngineId = viewportInfo.getRenderingEngineId();
    const toolGroupId = viewportInfo.getToolGroupId();
    const syncGroups = viewportInfo.getSyncGroups();
    toolGroupService.addViewportToToolGroup(viewportId, renderingEngineId, toolGroupId);
    syncGroupService.addViewportToSyncGroup(viewportId, renderingEngineId, syncGroups);

    // we don't need reactivity here so just use state
    const {
      synchronizersStore
    } = useSynchronizersStore/* useSynchronizersStore */.U.getState();
    if (synchronizersStore?.[viewportId]?.length && !isHangingProtocolLayout) {
      // If the viewport used to have a synchronizer, re apply it again
      _rehydrateSynchronizers(viewportId, syncGroupService);
    }
    if (onElementEnabled && typeof onElementEnabled === 'function') {
      onElementEnabled(evt);
    }
  }, [viewportId, onElementEnabled, toolGroupService]);

  // disable the element upon unmounting
  (0,react.useEffect)(() => {
    cornerstoneViewportService.enableViewport(viewportId, elementRef.current);
    dist_esm.eventTarget.addEventListener(dist_esm.Enums.Events.ELEMENT_ENABLED, elementEnabledHandler);
    setImageScrollBarHeight();
    return () => {
      const viewportInfo = cornerstoneViewportService.getViewportInfo(viewportId);
      if (!viewportInfo) {
        return;
      }
      cornerstoneViewportService.storePresentation({
        viewportId
      });

      // This should be done after the store presentation since synchronizers
      // will get cleaned up and they need the viewportInfo to be present
      cleanUpServices(viewportInfo);
      if (onElementDisabled && typeof onElementDisabled === 'function') {
        onElementDisabled(viewportInfo);
      }
      cornerstoneViewportService.disableElement(viewportId);
      dist_esm.eventTarget.removeEventListener(dist_esm.Enums.Events.ELEMENT_ENABLED, elementEnabledHandler);
    };
  }, []);

  // subscribe to displaySet metadata invalidation (updates)
  // Currently, if the metadata changes we need to re-render the display set
  // for it to take effect in the viewport. As we deal with scaling in the loading,
  // we need to remove the old volume from the cache, and let the
  // viewport to re-add it which will use the new metadata. Otherwise, the
  // viewport will use the cached volume and the new metadata will not be used.
  // Note: this approach does not actually end of sending network requests
  // and it uses the network cache
  (0,react.useEffect)(() => {
    const {
      unsubscribe
    } = displaySetService.subscribe(displaySetService.EVENTS.DISPLAY_SET_SERIES_METADATA_INVALIDATED, async ({
      displaySetInstanceUID: invalidatedDisplaySetInstanceUID,
      invalidateData
    }) => {
      if (!invalidateData) {
        return;
      }
      const viewportInfo = cornerstoneViewportService.getViewportInfo(viewportId);
      if (viewportInfo.hasDisplaySet(invalidatedDisplaySetInstanceUID)) {
        const viewportData = viewportInfo.getViewportData();
        const newViewportData = await cornerstoneCacheService.invalidateViewportData(viewportData, invalidatedDisplaySetInstanceUID, dataSource, displaySetService);
        const keepCamera = true;
        cornerstoneViewportService.updateViewport(viewportId, newViewportData, keepCamera);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [viewportId]);
  (0,react.useEffect)(() => {
    // handle the default viewportType to be stack
    if (!viewportOptions.viewportType) {
      viewportOptions.viewportType = STACK;
    }
    const loadViewportData = async () => {
      const viewportData = await cornerstoneCacheService.createViewportData(displaySets, viewportOptions, dataSource, initialImageIndex);
      const presentations = getViewportPresentations(viewportId, viewportOptions);

      // Note: This is a hack to get the grid to re-render the OHIFCornerstoneViewport component
      // Used for segmentation hydration right now, since the logic to decide whether
      // a viewport needs to render a segmentation lives inside the CornerstoneViewportService
      // so we need to re-render (force update via change of the needsRerendering) so that React
      // does the diffing and decides we should render this again (although the id and element has not changed)
      // so that the CornerstoneViewportService can decide whether to render the segmentation or not. Not that we reached here we can turn it off.
      if (viewportOptions.needsRerendering) {
        viewportOptions.needsRerendering = false;
      }
      cornerstoneViewportService.setViewportData(viewportId, viewportData, viewportOptions, displaySetOptions, presentations);
    };
    loadViewportData();
  }, [viewportOptions, displaySets, dataSource]);

  /**
   * There are two scenarios for jump to click
   * 1. Current viewports contain the displaySet that the annotation was drawn on
   * 2. Current viewports don't contain the displaySet that the annotation was drawn on
   * and we need to change the viewports displaySet for jumping.
   * Since measurement_jump happens via events and listeners, the former case is handled
   * by the measurement_jump direct callback, but the latter case is handled first by
   * the viewportGrid to set the correct displaySet on the viewport, AND THEN we check
   * the cache for jumping to see if there is any jump queued, then we jump to the correct slice.
   */
  (0,react.useEffect)(() => {
    if (isJumpToMeasurementDisabled) {
      return;
    }
    const {
      unsubscribe
    } = measurementService.subscribe(src.MeasurementService.EVENTS.JUMP_TO_MEASUREMENT_VIEWPORT, event => handleJumpToMeasurement(event, elementRef, viewportId, cornerstoneViewportService));
    return () => {
      unsubscribe();
    };
  }, [displaySets, elementRef, viewportId, isJumpToMeasurementDisabled, servicesManager]);

  // Set up the window level action menu in the viewport action corners.
  (0,react.useEffect)(() => {
    const windowLevelActionMenu = customizationService.getCustomization('viewportActionMenu.windowLevelActionMenu');
    const segmentationOverlay = customizationService.getCustomization('viewportActionMenu.segmentationOverlay');
    if (windowLevelActionMenu?.enabled) {
      viewportActionCornersService.addComponent({
        viewportId,
        id: 'windowLevelActionMenu',
        component: getWindowLevelActionMenu({
          viewportId,
          element: elementRef.current,
          displaySets,
          servicesManager,
          commandsManager,
          location: windowLevelActionMenu.location,
          verticalDirection: ui_next_src/* AllInOneMenu */.se.VerticalDirection.TopToBottom,
          horizontalDirection: ui_next_src/* AllInOneMenu */.se.HorizontalDirection.RightToLeft
        }),
        location: windowLevelActionMenu.location
      });
    }
    if (segmentationOverlay?.enabled) {
      viewportActionCornersService.addComponent({
        viewportId,
        id: 'segmentation',
        component: getViewportDataOverlaySettingsMenu({
          viewportId,
          element: elementRef.current,
          displaySets,
          servicesManager,
          commandsManager,
          location: segmentationOverlay.location
        }),
        location: segmentationOverlay.location
      });
    }
  }, [displaySets, viewportId, viewportActionCornersService, servicesManager, commandsManager]);
  const {
    ref: resizeRef
  } = (0,index_esm/* useResizeDetector */.u)({
    onResize
  });
  const Notification = customizationService.getCustomization('ui.notificationComponent');
  return /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
    className: "viewport-wrapper"
  }, /*#__PURE__*/react.createElement("div", {
    className: "cornerstone-viewport-element",
    style: {
      height: '100%',
      width: '100%'
    },
    onContextMenu: e => e.preventDefault(),
    onMouseDown: e => e.preventDefault(),
    ref: el => {
      resizeRef.current = el;
      elementRef.current = el;
    }
  }), /*#__PURE__*/react.createElement(Overlays_CornerstoneOverlays, {
    viewportId: viewportId,
    toolBarService: toolbarService,
    element: elementRef.current,
    scrollbarHeight: scrollbarHeight,
    servicesManager: servicesManager
  }), /*#__PURE__*/react.createElement(components_CinePlayer, {
    enabledVPElement: enabledVPElement,
    viewportId: viewportId,
    servicesManager: servicesManager
  }), /*#__PURE__*/react.createElement(utils_ActiveViewportBehavior, {
    viewportId: viewportId,
    servicesManager: servicesManager
  })), /*#__PURE__*/react.createElement("div", {
    className: "absolute top-[24px] w-full"
  }, viewportDialogState.viewportId === viewportId && /*#__PURE__*/react.createElement(Notification, {
    id: "viewport-notification",
    message: viewportDialogState.message,
    type: viewportDialogState.type,
    actions: viewportDialogState.actions,
    onSubmit: viewportDialogState.onSubmit,
    onOutsideClick: viewportDialogState.onOutsideClick,
    onKeyPress: viewportDialogState.onKeyPress
  })), /*#__PURE__*/react.createElement(components_OHIFViewportActionCorners, {
    viewportId: viewportId
  }));
}, areEqual);

// Helper function to handle jumping to measurements
function handleJumpToMeasurement(event, elementRef, viewportId, cornerstoneViewportService) {
  const {
    measurement,
    isConsumed
  } = event;
  if (!measurement || isConsumed) {
    return;
  }
  const enabledElement = (0,dist_esm.getEnabledElement)(elementRef.current);
  if (!enabledElement) {
    return;
  }
  const viewport = enabledElement.viewport;
  const {
    metadata,
    displaySetInstanceUID
  } = measurement;
  const viewportDisplaySets = cornerstoneViewportService.getViewportDisplaySets(viewportId);
  const showingDisplaySet = viewportDisplaySets.find(ds => ds.displaySetInstanceUID === displaySetInstanceUID);
  let metadataToUse = metadata;
  // if it is not showing the displaySet we need to remove the FOR from the metadata
  if (!showingDisplaySet) {
    metadataToUse = {
      ...metadata,
      FrameOfReferenceUID: undefined
    };
  }

  // Todo: make it work with cases where we want to define FOR based measurements too
  if (!viewport.isReferenceViewable(metadataToUse, CornerstoneViewportService/* WITH_NAVIGATION */.g)) {
    return;
  }
  try {
    viewport.setViewReference(metadata);
    viewport.render();
  } catch (e) {
    console.warn('Unable to apply', metadata, e);
  }
  esm.annotation.selection.setAnnotationSelected(measurement.uid);
  event?.consume?.();
}
function _rehydrateSynchronizers(viewportId, syncGroupService) {
  const {
    synchronizersStore
  } = useSynchronizersStore/* useSynchronizersStore */.U.getState();
  const synchronizers = synchronizersStore[viewportId];
  if (!synchronizers) {
    return;
  }
  synchronizers.forEach(synchronizerObj => {
    if (!synchronizerObj.id) {
      return;
    }
    const {
      id,
      sourceViewports,
      targetViewports
    } = synchronizerObj;
    const synchronizer = syncGroupService.getSynchronizer(id);
    if (!synchronizer) {
      return;
    }
    const sourceViewportInfo = sourceViewports.find(sourceViewport => sourceViewport.viewportId === viewportId);
    const targetViewportInfo = targetViewports.find(targetViewport => targetViewport.viewportId === viewportId);
    const isSourceViewportInSynchronizer = synchronizer.getSourceViewports().find(sourceViewport => sourceViewport.viewportId === viewportId);
    const isTargetViewportInSynchronizer = synchronizer.getTargetViewports().find(targetViewport => targetViewport.viewportId === viewportId);

    // if the viewport was previously a source viewport, add it again
    if (sourceViewportInfo && !isSourceViewportInSynchronizer) {
      synchronizer.addSource({
        viewportId: sourceViewportInfo.viewportId,
        renderingEngineId: sourceViewportInfo.renderingEngineId
      });
    }

    // if the viewport was previously a target viewport, add it again
    if (targetViewportInfo && !isTargetViewportInSynchronizer) {
      synchronizer.addTarget({
        viewportId: targetViewportInfo.viewportId,
        renderingEngineId: targetViewportInfo.renderingEngineId
      });
    }
  });
}

// Component displayName
OHIFCornerstoneViewport.displayName = 'OHIFCornerstoneViewport';
function areEqual(prevProps, nextProps) {
  if (nextProps.needsRerendering) {
    console.debug('OHIFCornerstoneViewport: Rerender caused by: needsRerendering');
    return false;
  }
  if (prevProps.displaySets.length !== nextProps.displaySets.length) {
    console.debug('OHIFCornerstoneViewport: Rerender caused by: displaySets length change');
    return false;
  }
  if (prevProps.viewportOptions.orientation !== nextProps.viewportOptions.orientation) {
    console.debug('OHIFCornerstoneViewport: Rerender caused by: orientation change');
    return false;
  }
  if (prevProps.viewportOptions.toolGroupId !== nextProps.viewportOptions.toolGroupId) {
    console.debug('OHIFCornerstoneViewport: Rerender caused by: toolGroupId change');
    return false;
  }
  if (nextProps.viewportOptions.viewportType && prevProps.viewportOptions.viewportType !== nextProps.viewportOptions.viewportType) {
    console.debug('OHIFCornerstoneViewport: Rerender caused by: viewportType change');
    return false;
  }
  if (nextProps.viewportOptions.needsRerendering) {
    console.debug('OHIFCornerstoneViewport: Rerender caused by: viewportOptions.needsRerendering');
    return false;
  }
  const prevDisplaySets = prevProps.displaySets;
  const nextDisplaySets = nextProps.displaySets;
  if (prevDisplaySets.length !== nextDisplaySets.length) {
    console.debug('OHIFCornerstoneViewport: Rerender caused by: displaySets length mismatch');
    return false;
  }
  for (let i = 0; i < prevDisplaySets.length; i++) {
    const prevDisplaySet = prevDisplaySets[i];
    const foundDisplaySet = nextDisplaySets.find(nextDisplaySet => nextDisplaySet.displaySetInstanceUID === prevDisplaySet.displaySetInstanceUID);
    if (!foundDisplaySet) {
      console.debug('OHIFCornerstoneViewport: Rerender caused by: displaySet not found');
      return false;
    }

    // check they contain the same image
    if (foundDisplaySet.images?.length !== prevDisplaySet.images?.length) {
      console.debug('OHIFCornerstoneViewport: Rerender caused by: images length mismatch');
      return false;
    }

    // check if their imageIds are the same
    if (foundDisplaySet.images?.length) {
      for (let j = 0; j < foundDisplaySet.images.length; j++) {
        if (foundDisplaySet.images[j].imageId !== prevDisplaySet.images[j].imageId) {
          console.debug('OHIFCornerstoneViewport: Rerender caused by: imageId mismatch');
          return false;
        }
      }
    }
  }
  return true;
}

// Helper function to check if display sets have changed
function haveDisplaySetsChanged(prevDisplaySets, currentDisplaySets) {
  if (prevDisplaySets.length !== currentDisplaySets.length) {
    return true;
  }
  return currentDisplaySets.some((currentDS, index) => {
    const prevDS = prevDisplaySets[index];
    return currentDS.displaySetInstanceUID !== prevDS.displaySetInstanceUID;
  });
}
/* harmony default export */ const Viewport_OHIFCornerstoneViewport = (OHIFCornerstoneViewport);

/***/ })

}]);