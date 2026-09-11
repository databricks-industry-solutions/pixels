"use strict";
(globalThis["rspackChunk"] = globalThis["rspackChunk"] || []).push([[100], {
59423(__unused_rspack_module, __webpack_exports__, __webpack_require__) {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ dicom_video_src)
});

;// CONCATENATED MODULE: ../../../extensions/dicom-video/package.json
var package_namespaceObject = JSON.parse('{"UU":"@ohif/extension-dicom-video"}')
;// CONCATENATED MODULE: ../../../extensions/dicom-video/src/id.js

const id = package_namespaceObject.UU;
const SOPClassHandlerId = `${id}.sopClassHandlerModule.dicom-video`;

// EXTERNAL MODULE: ../../core/src/index.ts + 75 modules
var src = __webpack_require__(50679);
// EXTERNAL MODULE: ../../i18n/src/index.js + 289 modules
var i18n_src = __webpack_require__(78919);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var esm = __webpack_require__(88479);
;// CONCATENATED MODULE: ../../../extensions/dicom-video/src/getSopClassHandlerModule.js




const SOP_CLASS_UIDS = {
  VIDEO_MICROSCOPIC_IMAGE_STORAGE: '1.2.840.10008.5.1.4.1.1.77.1.2.1',
  VIDEO_PHOTOGRAPHIC_IMAGE_STORAGE: '1.2.840.10008.5.1.4.1.1.77.1.4.1',
  VIDEO_ENDOSCOPIC_IMAGE_STORAGE: '1.2.840.10008.5.1.4.1.1.77.1.1.1',
  /** Need to use fallback, could be video or image */
  SECONDARY_CAPTURE_IMAGE_STORAGE: '1.2.840.10008.5.1.4.1.1.7',
  MULTIFRAME_TRUE_COLOR_SECONDARY_CAPTURE_IMAGE_STORAGE: '1.2.840.10008.5.1.4.1.1.7.4'
};
const sopClassUids = Object.values(SOP_CLASS_UIDS);
const secondaryCaptureSopClassUids = [SOP_CLASS_UIDS.SECONDARY_CAPTURE_IMAGE_STORAGE, SOP_CLASS_UIDS.MULTIFRAME_TRUE_COLOR_SECONDARY_CAPTURE_IMAGE_STORAGE];
const SupportedTransferSyntaxes = {
  MPEG4_AVC_264_HIGH_PROFILE: '1.2.840.10008.1.2.4.102',
  MPEG4_AVC_264_BD_COMPATIBLE_HIGH_PROFILE: '1.2.840.10008.1.2.4.103',
  MPEG4_AVC_264_HIGH_PROFILE_FOR_2D_VIDEO: '1.2.840.10008.1.2.4.104',
  MPEG4_AVC_264_HIGH_PROFILE_FOR_3D_VIDEO: '1.2.840.10008.1.2.4.105',
  MPEG4_AVC_264_STEREO_HIGH_PROFILE: '1.2.840.10008.1.2.4.106',
  HEVC_265_MAIN_PROFILE: '1.2.840.10008.1.2.4.107',
  HEVC_265_MAIN_10_PROFILE: '1.2.840.10008.1.2.4.108'
};
const supportedTransferSyntaxUIDs = Object.values(SupportedTransferSyntaxes);
const _getDisplaySetsFromSeries = (instances, servicesManager, extensionManager) => {
  const dataSource = extensionManager.getActiveDataSource()[0];
  const thumbnailSrc = null;
  console.warn('dataSource=', dataSource);
  return instances.filter(metadata => {
    const tsuid = metadata.AvailableTransferSyntaxUID || metadata.TransferSyntaxUID || metadata['00083002'];
    if (supportedTransferSyntaxUIDs.includes(tsuid)) {
      return true;
    }
    if (metadata.SOPClassUID === SOP_CLASS_UIDS.VIDEO_PHOTOGRAPHIC_IMAGE_STORAGE) {
      return true;
    }

    // Assume that an instance with one of the secondary capture SOPClassUIDs and
    // with at least 90 frames (i.e. typically 3 seconds of video) is indeed a video.
    return secondaryCaptureSopClassUids.includes(metadata.SOPClassUID) && metadata.NumberOfFrames >= 90;
  }).map(instance => {
    const {
      Modality,
      SOPInstanceUID,
      SeriesDescription = 'VIDEO',
      imageId
    } = instance;
    const {
      SeriesNumber,
      SeriesDate,
      SeriesInstanceUID,
      StudyInstanceUID,
      NumberOfFrames,
      url
    } = instance;
    const videoUrlParams = {
      instance,
      singlepart: 'video',
      tag: 'PixelData',
      url
    };
    const videoUrl = dataSource.retrieve.directURL(videoUrlParams);
    const getVideoUrl = dataSource.retrieve.renderedURL ? options => dataSource.retrieve.renderedURL({
      ...videoUrlParams,
      url: videoUrl
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
      referencedImages: null,
      measurements: null,
      videoUrl,
      getVideoUrl,
      viewportType: esm.Enums.ViewportType.VIDEO,
      instances: [instance],
      getThumbnailSrc: dataSource.retrieve.getGetThumbnailSrc?.(instance),
      thumbnailSrc,
      imageIds: [imageId],
      isDerivedDisplaySet: true,
      isLoaded: false,
      sopClassUids,
      numImageFrames: NumberOfFrames,
      instance,
      supportsWindowLevel: true,
      label: SeriesDescription || `${i18n_src/* ["default"].t */.A.t('Series')} ${SeriesNumber} - ${i18n_src/* ["default"].t */.A.t(Modality)}`
    };
    esm.utilities.genericMetadataProvider.add(imageId, {
      type: 'imageUrlModule',
      metadata: {
        rendered: videoUrl
      }
    });
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
    name: 'dicom-video',
    sopClassUids,
    getDisplaySetsFromSeries
  }];
}
;// CONCATENATED MODULE: ../../../extensions/dicom-video/src/index.tsx



/**
 *
 */
const dicomVideoExtension = {
  /**
   * Only required property. Should be a unique value across all extensions.
   */
  id: id,
  getSopClassHandlerModule: getSopClassHandlerModule
};
/* export default */ const dicom_video_src = (dicomVideoExtension);

},

}]);