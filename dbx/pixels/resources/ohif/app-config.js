window.config = {
  routerBasename: '{ROUTER_BASENAME}',
  showStudyList: true,
  maxCacheSize: 4294967296, // 4GB
  extensions: [],
  modes: [],
  // below flag is for performance reasons, but it might not work for all servers

  showWarningMessageForCrossOrigin: true,
  showCPUFallbackMessage: true,
  showLoadingIndicator: true,
  strictZSpacingForVolumeViewport: true,
  defaultDataSourceName: '{DEFAULT_DATA_SOURCE}',

  // GPU Acceleration Settings
  useSharedArrayBuffer: 'AUTO', // Enable SharedArrayBuffer for better performance
  useNorm16Texture: true, // Use 16-bit normalized textures for GPU rendering
  preferSizeOverAccuracy: true, // Prioritize rendering speed over precision
  useCPURendering: false, // Force GPU rendering when available

  // Web Worker Settings for Parallel Decoding
  maxNumberOfWebWorkers: navigator.hardwareConcurrency || 4, // Use all available CPU cores

  // Increase concurrent request pool sizes for better parallelism
  maxNumRequests: {
    interaction: 20,  // User interactions (pan, zoom, scroll) - high priority
    thumbnail: 10,    // Thumbnail generation
    prefetch: 20,     // Background prefetching - INCREASE THIS for parallel loading
    compute: 10       // Computation tasks
  },

  customizationService: [
    {
      'studyBrowser.studyMode': {
        $set: 'primary', // or recent
      },
    },
  ],

  dataSources: [
    {
      namespace: '@ohif/extension-default.dataSourcesModule.databricksPixelsDicom',
      sourceName: 'databricksPixelsDicom',
      configuration: {
        friendlyName: 'Databricks Pixels Dicom',
        token: "TOKEN_REPLACED_BY_DBTUNNEL",
        httpPath: "/sql/1.0/warehouses/{SQL_WAREHOUSE}",
        //serverHostname: "{ROUTER_BASENAME}/sqlwarehouse",
        serverHostname: "{HOST_NAME}",
        pixelsTable: "{PIXELS_TABLE}",
        staticWado: true,
        lazyLoad: true
      },
    },
    {
      namespace: "@ohif/extension-default.dataSourcesModule.dicomweb",
      sourceName: "pixelsdicomweb",
      configuration: {
        friendlyName: "Pixels dicomweb",
        qidoRoot: "{DICOMWEB_ROOT}",
        wadoRoot: "{DICOMWEB_ROOT}",
        wadoUriRoot: "{DICOMWEB_ROOT}/wado",
        qidoSupportsIncludeField: !1,
        supportsReject: !0,
        supportsStow: !0,
        imageRendering: "wadouri",
        thumbnailRendering: "wadouri",
        enableStudyLazyLoad: !0,
        supportsFuzzyMatching: !1,
        supportsWildcard: !0,
        staticWado: !0,
        singlepart: "bulkdata,video",
        bulkDataURI: {
          enabled: !0,
          relativeResolution: "studies"
        }
      }
    },
    {
      namespace: '@ohif/extension-default.dataSourcesModule.dicomlocal',
      sourceName: 'dicomlocal',
      configuration: {
        friendlyName: 'dicom local',
      },
    },
  ],
};
