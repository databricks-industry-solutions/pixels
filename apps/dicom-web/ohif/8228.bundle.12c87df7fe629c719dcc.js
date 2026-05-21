"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[8228],{

/***/ 48228:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ src_DicomMicroscopyViewport)
});

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../../extensions/default/src/index.ts + 140 modules
var src = __webpack_require__(77440);
;// ../../../extensions/dicom-microscopy/src/DicomMicroscopyViewport.css
// extracted by mini-css-extract-plugin

// EXTERNAL MODULE: ../../../node_modules/classnames/index.js
var classnames = __webpack_require__(55530);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
;// ../../../extensions/dicom-microscopy/src/components/ViewportOverlay/listComponentGenerator.tsx
const listComponentGenerator = props => {
  const {
    list,
    itemGenerator
  } = props;
  if (!list) {
    return;
  }
  return list.map(item => {
    if (!item) {
      return;
    }
    const generator = item.generator || itemGenerator;
    if (!generator) {
      throw new Error(`No generator for ${item}`);
    }
    return generator({
      ...props,
      item
    });
  });
};
/* harmony default export */ const ViewportOverlay_listComponentGenerator = (listComponentGenerator);
;// ../../../extensions/dicom-microscopy/src/components/ViewportOverlay/ViewportOverlay.css
// extracted by mini-css-extract-plugin

// EXTERNAL MODULE: ../../../node_modules/moment/moment.js
var moment = __webpack_require__(14867);
var moment_default = /*#__PURE__*/__webpack_require__.n(moment);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
;// ../../../extensions/dicom-microscopy/src/components/ViewportOverlay/utils.ts



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
function formatNumberPrecision(number, precision) {
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
  const generalImageModule = cornerstone.metaData.get('generalImageModule', imageId) || {};
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
// EXTERNAL MODULE: ../../core/src/index.ts + 68 modules
var core_src = __webpack_require__(15871);
;// ../../../extensions/dicom-microscopy/src/components/ViewportOverlay/index.tsx






const {
  formatPN
} = core_src.utils;
/**
 *
 * @param {*} config is a configuration object that defines four lists of elements,
 * one topLeft, topRight, bottomLeft, bottomRight contents.
 * @param {*} extensionManager is used to load the image data.
 * @returns
 */
const generateFromConfig = ({
  config,
  overlayData,
  ...props
}) => {
  const {
    topLeft = [],
    topRight = [],
    bottomLeft = [],
    bottomRight = []
  } = overlayData ?? {};
  const topLeftClass = 'top-viewport left-viewport text-primary-light';
  const topRightClass = 'top-viewport right-viewport-scrollbar text-primary-light';
  const bottomRightClass = 'bottom-viewport right-viewport-scrollbar text-primary-light';
  const bottomLeftClass = 'bottom-viewport left-viewport text-primary-light';
  const overlay = 'absolute pointer-events-none microscopy-viewport-overlay';
  return /*#__PURE__*/react.createElement(react.Fragment, null, topLeft && topLeft.length > 0 && /*#__PURE__*/react.createElement("div", {
    "data-cy": 'viewport-overlay-top-left',
    className: classnames_default()(overlay, topLeftClass)
  }, ViewportOverlay_listComponentGenerator({
    ...props,
    list: topLeft,
    itemGenerator
  })), topRight && topRight.length > 0 && /*#__PURE__*/react.createElement("div", {
    "data-cy": 'viewport-overlay-top-right',
    className: classnames_default()(overlay, topRightClass)
  }, ViewportOverlay_listComponentGenerator({
    ...props,
    list: topRight,
    itemGenerator
  })), bottomRight && bottomRight.length > 0 && /*#__PURE__*/react.createElement("div", {
    "data-cy": 'viewport-overlay-bottom-right',
    className: classnames_default()(overlay, bottomRightClass)
  }, ViewportOverlay_listComponentGenerator({
    ...props,
    list: bottomRight,
    itemGenerator
  })), bottomLeft && bottomLeft.length > 0 && /*#__PURE__*/react.createElement("div", {
    "data-cy": 'viewport-overlay-bottom-left',
    className: classnames_default()(overlay, bottomLeftClass)
  }, ViewportOverlay_listComponentGenerator({
    ...props,
    list: bottomLeft,
    itemGenerator
  })));
};
const itemGenerator = props => {
  const {
    item
  } = props;
  const {
    title,
    value: valueFunc,
    condition,
    contents
  } = item;
  props.image = {
    ...props.image,
    ...props.metadata
  };
  props.formatDate = formatDICOMDate;
  props.formatTime = formatDICOMTime;
  props.formatPN = formatPN;
  props.formatNumberPrecision = formatNumberPrecision;
  if (condition && !condition(props)) {
    return null;
  }
  if (!contents && !valueFunc) {
    return null;
  }
  const value = valueFunc && valueFunc(props);
  const contentsValue = contents && contents(props) || [{
    className: 'mr-1',
    value: title
  }, {
    classname: 'mr-1 font-light',
    value
  }];
  return /*#__PURE__*/react.createElement("div", {
    key: item.id,
    className: "flex flex-row"
  }, contentsValue.map((content, idx) => /*#__PURE__*/react.createElement("span", {
    key: idx,
    className: content.className
  }, content.value)));
};
/* harmony default export */ const ViewportOverlay = (generateFromConfig);
// EXTERNAL MODULE: ../../../extensions/default/src/DatabricksPixelsDicom/StaticWadoClient.ts + 2 modules
var StaticWadoClient = __webpack_require__(34551);
;// ../../../extensions/dicom-microscopy/src/utils/dicomWebClient.ts



/**
 * create a DICOMwebClient object to be used by Dicom Microscopy Viewer
 *
 * Referenced the code from `/extensions/default/src/DicomWebDataSource/index.js`
 *
 * @param param0
 * @returns
 */
function getDicomWebClient({
  extensionManager,
  servicesManager
}) {
  const dataSourceConfig = window.config.dataSources.find(ds => ds.sourceName === extensionManager.activeDataSourceName);
  const {
    userAuthenticationService
  } = servicesManager.services;
  const {
    wadoRoot,
    staticWado,
    singlepart
  } = dataSourceConfig.configuration;
  const wadoConfig = {
    url: wadoRoot || '/dicomlocal',
    staticWado,
    singlepart,
    headers: userAuthenticationService.getAuthorizationHeader(),
    errorInterceptor: core_src.errorHandler.getHTTPErrorHandler()
  };
  const client = new StaticWadoClient/* default */.A(wadoConfig);
  client.wadoURL = wadoConfig.url;
  if (extensionManager.activeDataSourceName === 'dicomlocal') {
    /**
     * For local data source, override the retrieveInstanceFrames() method of the
     * dicomweb-client to retrieve image data from memory cached metadata.
     * Other methods of the client doesn't matter, as we are feeding the DMV
     * with the series metadata already.
     *
     * @param {Object} options
     * @param {String} options.studyInstanceUID - Study Instance UID
     * @param {String} options.seriesInstanceUID - Series Instance UID
     * @param {String} options.sopInstanceUID - SOP Instance UID
     * @param {String} options.frameNumbers - One-based indices of Frame Items
     * @param {Object} [options.queryParams] - HTTP query parameters
     * @returns {ArrayBuffer[]} Rendered Frame Items as byte arrays
     */
    //
    client.retrieveInstanceFrames = async options => {
      if (!('studyInstanceUID' in options)) {
        throw new Error('Study Instance UID is required for retrieval of instance frames');
      }
      if (!('seriesInstanceUID' in options)) {
        throw new Error('Series Instance UID is required for retrieval of instance frames');
      }
      if (!('sopInstanceUID' in options)) {
        throw new Error('SOP Instance UID is required for retrieval of instance frames');
      }
      if (!('frameNumbers' in options)) {
        throw new Error('frame numbers are required for retrieval of instance frames');
      }
      console.log(`retrieve frames ${options.frameNumbers.toString()} of instance ${options.sopInstanceUID}`);
      const instance = core_src.DicomMetadataStore.getInstance(options.studyInstanceUID, options.seriesInstanceUID, options.sopInstanceUID);
      const frameNumbers = Array.isArray(options.frameNumbers) ? options.frameNumbers : options.frameNumbers.split(',');
      return frameNumbers.map(fr => Array.isArray(instance.PixelData) ? instance.PixelData[+fr - 1] : instance.PixelData);
    };
  }
  return client;
}
// EXTERNAL MODULE: ../../../node_modules/dcmjs/build/dcmjs.es.js
var dcmjs_es = __webpack_require__(5842);
;// ../../../extensions/dicom-microscopy/src/DicomMicroscopyViewport.tsx







function DicomMicroscopyViewport({
  activeViewportId,
  setViewportActive,
  displaySets,
  viewportId,
  dataSource,
  resizeRef
}) {
  const {
    servicesManager,
    extensionManager
  } = (0,core_src.useSystem)();
  const [isLoaded, setIsLoaded] = (0,react.useState)(false);
  const [viewer, setViewer] = (0,react.useState)(null);
  const [managedViewer, setManagedViewer] = (0,react.useState)(null);
  const overlayElement = (0,react.useRef)();
  const container = (0,react.useRef)();
  const {
    microscopyService,
    customizationService
  } = servicesManager.services;
  const overlayData = customizationService.getCustomization('microscopyViewport.overlay');

  // install the microscopy renderer into the web page.
  // you should only do this once.
  const installOpenLayersRenderer = (0,react.useCallback)(async (container, displaySet) => {
    const loadViewer = async metadata => {
      const dicomMicroscopyModule = await microscopyService.importDicomMicroscopyViewer();
      const {
        viewer: DicomMicroscopyViewer,
        metadata: metadataUtils
      } = dicomMicroscopyModule;
      const microscopyViewer = DicomMicroscopyViewer.VolumeImageViewer;
      const client = getDicomWebClient({
        extensionManager,
        servicesManager
      });

      // Parse, format, and filter metadata
      const volumeImages = [];

      /**
       * This block of code is the original way of loading DICOM into dicom-microscopy-viewer
       * as in their documentation.
       * But we have the metadata already loaded by our loaders.
       * As the metadata for microscopy DIOM files tends to be big and we don't
       * want to double load it, below we have the mechanism to reconstruct the
       * DICOM JSON structure (denaturalized) from naturalized metadata.
       * (NOTE: Our loaders cache only naturalized metadata, not the denaturalized.)
       */
      // {
      //   const retrieveOptions = {
      //     studyInstanceUID: metadata[0].StudyInstanceUID,
      //     seriesInstanceUID: metadata[0].SeriesInstanceUID,
      //   };
      //   metadata = await client.retrieveSeriesMetadata(retrieveOptions);
      //   // Parse, format, and filter metadata
      //   metadata.forEach(m => {
      //     if (
      //       volumeImages.length > 0 &&
      //       m['00200052'].Value[0] != volumeImages[0].FrameOfReferenceUID
      //     ) {
      //       console.warn(
      //         'Expected FrameOfReferenceUID of difference instances within a series to be the same, found multiple different values',
      //         m['00200052'].Value[0]
      //       );
      //       m['00200052'].Value[0] = volumeImages[0].FrameOfReferenceUID;
      //     }
      //     NOTE: depending on different data source, image.ImageType sometimes
      //     is a string, not a string array.
      //     m['00080008'] = transformImageTypeUnnaturalized(m['00080008']);

      //     const image = new metadataUtils.VLWholeSlideMicroscopyImage({
      //       metadata: m,
      //     });
      //     const imageFlavor = image.ImageType[2];
      //     if (imageFlavor === 'VOLUME' || imageFlavor === 'THUMBNAIL') {
      //       volumeImages.push(image);
      //     }
      //   });
      // }

      metadata.forEach(m => {
        // NOTE: depending on different data source, image.ImageType sometimes
        //    is a string, not a string array.
        m.ImageType = typeof m.ImageType === 'string' ? m.ImageType.split('\\') : m.ImageType;
        const inst = (0,src.cleanDenaturalizedDataset)(dcmjs_es/* default.data */.Ay.data.DicomMetaDictionary.denaturalizeDataset(m), {
          StudyInstanceUID: m.StudyInstanceUID,
          SeriesInstanceUID: m.SeriesInstanceUID,
          dataSourceConfig: dataSource.getConfig()
        });
        if (!inst['00480105']) {
          // Optical Path Sequence, no OpticalPathIdentifier?
          // NOTE: this is actually a not-well formatted DICOM VL Whole Slide Microscopy Image.
          inst['00480105'] = {
            vr: 'SQ',
            Value: [{
              '00480106': {
                vr: 'SH',
                Value: ['1']
              }
            }]
          };
        }
        const image = new metadataUtils.VLWholeSlideMicroscopyImage({
          metadata: inst
        });
        const imageFlavor = image.ImageType[2];
        if (imageFlavor === 'VOLUME' || imageFlavor === 'THUMBNAIL') {
          volumeImages.push(image);
        }
      });

      // format metadata for microscopy-viewer
      const options = {
        client,
        metadata: volumeImages,
        retrieveRendered: false,
        controls: ['overview', 'position']
      };
      const viewer = new microscopyViewer(options);
      if (overlayElement && overlayElement.current && viewer.addViewportOverlay) {
        viewer.addViewportOverlay({
          element: overlayElement.current,
          coordinates: [0, 0],
          // TODO: dicom-microscopy-viewer documentation says this can be false to be automatically, but it is not.
          navigate: true,
          className: 'OpenLayersOverlay'
        });
      }
      viewer.render({
        container
      });
      const {
        StudyInstanceUID,
        SeriesInstanceUID
      } = displaySet;
      const managedViewer = microscopyService.addViewer(viewer, viewportId, container, StudyInstanceUID, SeriesInstanceUID);
      managedViewer.addContextMenuCallback(event => {
        // TODO: refactor this after Bill's changes on ContextMenu feature get merged
        // const roiAnnotationNearBy = this.getNearbyROI(event);
      });
      setViewer(viewer);
      setManagedViewer(managedViewer);
    };
    microscopyService.clearAnnotations();
    let smDisplaySet = displaySet;
    if (displaySet.Modality === 'SR') {
      // for SR displaySet, let's load the actual image displaySet
      smDisplaySet = displaySet.getSourceDisplaySet();
    }
    console.log('Loading viewer metadata', smDisplaySet);
    await loadViewer(smDisplaySet.others);
    if (displaySet.Modality === 'SR') {
      displaySet.load(smDisplaySet);
    }
  }, [dataSource, extensionManager, microscopyService, servicesManager, viewportId]);
  (0,react.useEffect)(() => {
    const displaySet = displaySets[0];
    installOpenLayersRenderer(container.current, displaySet).then(() => {
      setIsLoaded(true);
    });
    return () => {
      if (viewer) {
        microscopyService.removeViewer(viewer);
      }
    };
  }, []);
  (0,react.useEffect)(() => {
    const displaySet = displaySets[0];
    microscopyService.clearAnnotations();

    // loading SR
    if (displaySet.Modality === 'SR') {
      const referencedDisplaySet = displaySet.getSourceDisplaySet();
      displaySet.load(referencedDisplaySet);
    }
  }, [managedViewer, displaySets, microscopyService]);
  const style = {
    width: '100%',
    height: '100%'
  };
  const displaySet = displaySets[0];
  const firstInstance = displaySet.firstInstance || displaySet.instance;
  const LoadingIndicatorProgress = customizationService.getCustomization('ui.loadingIndicatorProgress');
  return /*#__PURE__*/react.createElement("div", {
    className: 'DicomMicroscopyViewer',
    style: style,
    onClick: () => {
      if (viewportId !== activeViewportId) {
        setViewportActive(viewportId);
      }
    }
  }, /*#__PURE__*/react.createElement("div", {
    style: {
      ...style,
      display: 'none'
    }
  }, /*#__PURE__*/react.createElement("div", {
    style: {
      ...style
    },
    ref: overlayElement
  }, /*#__PURE__*/react.createElement("div", {
    style: {
      position: 'relative',
      height: '100%',
      width: '100%'
    }
  }, displaySet && firstInstance.imageId && /*#__PURE__*/react.createElement(ViewportOverlay, {
    overlayData: overlayData,
    displaySet: displaySet,
    instance: displaySet.instance,
    metadata: displaySet.metadata
  })))), /*#__PURE__*/react.createElement("div", {
    style: style,
    ref: ref => {
      container.current = ref;
      resizeRef.current = ref;
    }
  }), isLoaded ? null : /*#__PURE__*/react.createElement(LoadingIndicatorProgress, {
    className: 'h-full w-full bg-black'
  }));
}
/* harmony default export */ const src_DicomMicroscopyViewport = (DicomMicroscopyViewport);

/***/ })

}]);