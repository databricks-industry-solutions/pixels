"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[6201,8402],{

/***/ 82098:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ cornerstone_dicom_pmap_src)
});

;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-pmap/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/extension-cornerstone-dicom-pmap"}');
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-pmap/src/id.js

const id = package_namespaceObject.UU;
const SOPClassHandlerName = 'dicom-pmap';
const SOPClassHandlerId = `${id}.sopClassHandlerModule.${SOPClassHandlerName}`;

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../core/src/index.ts + 69 modules
var src = __webpack_require__(62037);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(15327);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/index.js + 65 modules
var dist_esm = __webpack_require__(93468);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/index.tsx + 136 modules
var cornerstone_src = __webpack_require__(72283);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-pmap/src/getSopClassHandlerModule.ts





const VOLUME_LOADER_SCHEME = 'cornerstoneStreamingImageVolume';
const sopClassUids = ['1.2.840.10008.5.1.4.1.1.30'];
function _getDisplaySetsFromSeries(instances, servicesManager, extensionManager) {
  const instance = instances[0];
  const {
    StudyInstanceUID,
    SeriesInstanceUID,
    SOPInstanceUID,
    SeriesDescription,
    SeriesNumber,
    SeriesDate,
    SOPClassUID,
    wadoRoot,
    wadoUri,
    wadoUriRoot
  } = instance;
  const displaySet = {
    // Parametric map use to have the same modality as its referenced volume but
    // "PMAP" is used in the viewer even though this is not a valid DICOM modality
    Modality: 'PMAP',
    isReconstructable: true,
    // by default for now
    displaySetInstanceUID: `pmap.${src.utils.guid()}`,
    SeriesDescription,
    SeriesNumber,
    SeriesDate,
    SOPInstanceUID,
    SeriesInstanceUID,
    StudyInstanceUID,
    SOPClassHandlerId: SOPClassHandlerId,
    SOPClassUID,
    referencedImages: null,
    referencedSeriesInstanceUID: null,
    referencedDisplaySetInstanceUID: null,
    referencedVolumeURI: null,
    referencedVolumeId: null,
    isDerivedDisplaySet: true,
    loadStatus: {
      loading: false,
      loaded: false
    },
    sopClassUids,
    instance,
    instances: [instance],
    wadoRoot,
    wadoUriRoot,
    wadoUri,
    isOverlayDisplaySet: true
  };
  const referencedSeriesSequence = instance.ReferencedSeriesSequence;
  if (!referencedSeriesSequence) {
    console.error('ReferencedSeriesSequence is missing for the parametric map');
    return;
  }
  const referencedSeries = referencedSeriesSequence[0] || referencedSeriesSequence;
  displaySet.referencedImages = instance.ReferencedSeriesSequence.ReferencedInstanceSequence;
  displaySet.referencedSeriesInstanceUID = referencedSeries.SeriesInstanceUID;

  // Does not get the referenced displaySet during parametric displaySet creation
  // because it is still not available (getDisplaySetByUID returns `undefined`).
  displaySet.getReferenceDisplaySet = () => {
    const {
      displaySetService
    } = servicesManager.services;
    if (displaySet.referencedDisplaySetInstanceUID) {
      return displaySetService.getDisplaySetByUID(displaySet.referencedDisplaySetInstanceUID);
    }
    const referencedDisplaySets = displaySetService.getDisplaySetsForSeries(displaySet.referencedSeriesInstanceUID);
    if (!referencedDisplaySets || referencedDisplaySets.length === 0) {
      throw new Error('Referenced displaySet is missing for the parametric map');
    }
    const referencedDisplaySet = referencedDisplaySets[0];
    displaySet.referencedDisplaySetInstanceUID = referencedDisplaySet.displaySetInstanceUID;
    return referencedDisplaySet;
  };

  // Does not get the referenced volumeId during parametric displaySet creation because the
  // referenced displaySet is still not available  (getDisplaySetByUID returns `undefined`).
  displaySet.getReferencedVolumeId = () => {
    if (displaySet.referencedVolumeId) {
      return displaySet.referencedVolumeId;
    }
    const referencedDisplaySet = displaySet.getReferenceDisplaySet();
    const referencedVolumeURI = referencedDisplaySet.displaySetInstanceUID;
    const referencedVolumeId = `${VOLUME_LOADER_SCHEME}:${referencedVolumeURI}`;
    displaySet.referencedVolumeURI = referencedVolumeURI;
    displaySet.referencedVolumeId = referencedVolumeId;
    return referencedVolumeId;
  };
  displaySet.load = async ({
    headers
  }) => await _load(displaySet, servicesManager, extensionManager, headers);
  return [displaySet];
}
const getRangeFromPixelData = pixelData => {
  let lowest = pixelData[0];
  let highest = pixelData[0];
  for (let i = 1; i < pixelData.length; i++) {
    if (pixelData[i] < lowest) {
      lowest = pixelData[i];
    }
    if (pixelData[i] > highest) {
      highest = pixelData[i];
    }
  }
  return [lowest, highest];
};
async function _load(displaySet, servicesManager, extensionManager, headers) {
  const volumeId = `${VOLUME_LOADER_SCHEME}:${displaySet.displaySetInstanceUID}`;
  const volumeLoadObject = esm.cache.getVolumeLoadObject(volumeId);
  if (volumeLoadObject) {
    return volumeLoadObject.promise;
  }
  displaySet.loading = true;
  displaySet.isLoaded = false;

  // We don't want to fire multiple loads, so we'll wait for the first to finish
  // and also return the same promise to any other callers.
  const promise = _loadParametricMap({
    extensionManager,
    displaySet,
    headers
  });
  esm.cache.putVolumeLoadObject(volumeId, {
    promise
  }).catch(err => {
    throw err;
  });
  promise.then(() => {
    displaySet.loading = false;
    displaySet.isLoaded = true;
    // Broadcast that loading is complete
    servicesManager.services.segmentationService._broadcastEvent(servicesManager.services.segmentationService.EVENTS.SEGMENTATION_LOADING_COMPLETE, {
      pmapDisplaySet: displaySet
    });
  }).catch(err => {
    displaySet.loading = false;
    displaySet.isLoaded = false;
    throw err;
  });
  return promise;
}
async function _loadParametricMap({
  displaySet,
  headers
}) {
  const arrayBuffer = await cornerstone_src.dicomLoaderService.findDicomDataPromise(displaySet, null, headers);
  const referencedVolumeId = displaySet.getReferencedVolumeId();
  const cachedReferencedVolume = esm.cache.getVolume(referencedVolumeId);

  // Parametric map can be loaded only if its referenced volume exists otherwise it will fail
  if (!cachedReferencedVolume) {
    throw new Error('Referenced Volume is missing for the PMAP, and stack viewport PMAP is not supported yet');
  }
  const {
    imageIds
  } = cachedReferencedVolume;
  const results = await dist_esm/* adaptersPMAP */.X6.Cornerstone3D.ParametricMap.generateToolState(imageIds, arrayBuffer, esm.metaData);
  const {
    pixelData
  } = results;
  const TypedArrayConstructor = pixelData.constructor;
  const paramMapId = displaySet.displaySetInstanceUID;
  const derivedVolume = await esm.volumeLoader.createAndCacheDerivedVolume(referencedVolumeId, {
    volumeId: paramMapId,
    targetBuffer: {
      type: TypedArrayConstructor.name
    }
  });
  const newPixelData = new TypedArrayConstructor(pixelData.length);
  for (let i = 0; i < pixelData.length; i++) {
    newPixelData[i] = pixelData[i] * 100;
  }
  derivedVolume.voxelManager.setCompleteScalarDataArray(newPixelData);
  const range = getRangeFromPixelData(newPixelData);
  const windowLevel = esm.utilities.windowLevel.toWindowLevel(range[0], range[1]);
  derivedVolume.metadata.voiLut = [windowLevel];
  derivedVolume.loadStatus = {
    loaded: true
  };
  return derivedVolume;
}
function getSopClassHandlerModule({
  servicesManager,
  extensionManager
}) {
  const getDisplaySetsFromSeries = instances => {
    return _getDisplaySetsFromSeries(instances, servicesManager, extensionManager);
  };
  return [{
    name: 'dicom-pmap',
    sopClassUids,
    getDisplaySetsFromSeries
  }];
}
/* harmony default export */ const src_getSopClassHandlerModule = (getSopClassHandlerModule);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-pmap/src/index.tsx
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }



const Component = /*#__PURE__*/react.lazy(() => {
  return __webpack_require__.e(/* import() */ 4202).then(__webpack_require__.bind(__webpack_require__, 74202));
});
const OHIFCornerstonePMAPViewport = props => {
  return /*#__PURE__*/react.createElement(react.Suspense, {
    fallback: /*#__PURE__*/react.createElement("div", null, "Loading...")
  }, /*#__PURE__*/react.createElement(Component, props));
};

/**
 * You can remove any of the following modules if you don't need them.
 */
const extension = {
  id: id,
  getViewportModule({
    servicesManager,
    extensionManager,
    commandsManager
  }) {
    const ExtendedOHIFCornerstonePMAPViewport = props => {
      return /*#__PURE__*/react.createElement(OHIFCornerstonePMAPViewport, _extends({
        servicesManager: servicesManager,
        extensionManager: extensionManager,
        commandsManager: commandsManager
      }, props));
    };
    return [{
      name: 'dicom-pmap',
      component: ExtendedOHIFCornerstonePMAPViewport
    }];
  },
  getSopClassHandlerModule: src_getSopClassHandlerModule
};
/* harmony default export */ const cornerstone_dicom_pmap_src = (extension);

/***/ })

}]);