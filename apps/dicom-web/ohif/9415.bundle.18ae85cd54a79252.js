"use strict";
(globalThis["rspackChunk"] = globalThis["rspackChunk"] || []).push([[9415], {
76494(__unused_rspack_module, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ cornerstone_dicom_pmap_src)
});

;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-pmap/package.json
var package_namespaceObject = JSON.parse('{"UU":"@ohif/extension-cornerstone-dicom-pmap"}')
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-pmap/src/id.js

const id = package_namespaceObject.UU;
const SOPClassHandlerName = 'dicom-pmap';
const SOPClassHandlerId = `${id}.sopClassHandlerModule.${SOPClassHandlerName}`;

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../core/src/index.ts + 75 modules
var src = __webpack_require__(50679);
// EXTERNAL MODULE: ../../i18n/src/index.js + 289 modules
var i18n_src = __webpack_require__(78919);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(88479);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/index.js + 75 modules
var dist_esm = __webpack_require__(65419);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/index.tsx + 212 modules
var cornerstone_src = __webpack_require__(8067);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-pmap/src/getSopClassHandlerModule.ts






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
    displaySetInstanceUID: `pmap.${src/* .utils.guid */.Wp.guid()}`,
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
    supportsWindowLevel: true,
    label: SeriesDescription || `${i18n_src/* ["default"].t */.A.t('Series')} ${SeriesNumber} - ${i18n_src/* ["default"].t */.A.t('PMAP')}`
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
    const referencedVolumeId = `${cornerstone_src/* .VOLUME_LOADER_SCHEME */.Rj}:${referencedVolumeURI}`;
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
  const volumeId = `${cornerstone_src/* .VOLUME_LOADER_SCHEME */.Rj}:${displaySet.displaySetInstanceUID}`;
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
  const arrayBuffer = await cornerstone_src/* .dicomLoaderService.findDicomDataPromise */.HA.findDicomDataPromise(displaySet, null, headers);
  const referencedVolumeId = displaySet.getReferencedVolumeId();
  const cachedReferencedVolume = esm.cache.getVolume(referencedVolumeId);

  // Parametric map can be loaded only if its referenced volume exists otherwise it will fail
  if (!cachedReferencedVolume) {
    throw new Error('Referenced Volume is missing for the PMAP, and stack viewport PMAP is not supported yet');
  }
  const {
    imageIds
  } = cachedReferencedVolume;
  const results = await dist_esm/* .adaptersPMAP.Cornerstone3D.ParametricMap.generateToolState */.X6.Cornerstone3D.ParametricMap.generateToolState(imageIds, arrayBuffer, esm.metaData);
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
function getSopClassHandlerModule(params) {
  const {
    servicesManager,
    extensionManager
  } = params;
  const getDisplaySetsFromSeries = instances => {
    return _getDisplaySetsFromSeries(instances, servicesManager, extensionManager);
  };
  return [{
    name: 'dicom-pmap',
    sopClassUids,
    getDisplaySetsFromSeries
  }];
}
/* export default */ const src_getSopClassHandlerModule = (getSopClassHandlerModule);
;// CONCATENATED MODULE: ../../../extensions/cornerstone-dicom-pmap/src/index.tsx
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }



const Component = /*#__PURE__*/react.lazy(() => {
  return __webpack_require__.e(/* import() */ 5448).then(__webpack_require__.bind(__webpack_require__, 28059));
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
/* export default */ const cornerstone_dicom_pmap_src = (extension);

},

}]);