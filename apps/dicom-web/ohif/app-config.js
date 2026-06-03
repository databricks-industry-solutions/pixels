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

  // NIfTI Segmentation Overlay
  // Loads .nii.gz segmentation masks fetched from a Delta-table-backed gateway
  // and displays them on top of the active DICOM volume viewport.
  // See NIFTI_OVERLAY_PLAN.md and plugins/ohifv3/extensions/nifti-segmentation/README.md.
  niftiOverlay: {
    // Master switch. When false, the extension is loaded but the panel is hidden.
    // Flipped to true once the backend route and the extension UI land.
    enabled: false,

    // Where to talk to.
    //   null   -> inherit from the active data source's qidoRoot (production default;
    //             routes live next to QIDO-RS on the same gateway).
    //   string -> explicit override (e.g. NIfTI gateway hosted separately).
    baseUrl: null,

    // Path mount under baseUrl. Override if the gateway exposes the routes elsewhere.
    pathPrefix: '/nifti',

    // Individual endpoint paths (relative to baseUrl + pathPrefix). Overridable
    // per-route so a gateway can rename without us touching client code.
    endpoints: {
      related: '/related',   // GET ?study=<uid>&series=<uid> -> [ {id, name, label_info, ...} ]
      fetch:   '/fetch',     // GET ?id=<id>                  -> octet-stream of .nii.gz
    },

    // Auth.
    //   'inherit' -> reuse the data source's Authorization header (Bearer token used
    //                by DatabricksPixelsDicom today). Recommended.
    //   'none'    -> no Authorization header (open gateway).
    auth: { mode: 'inherit' },

    // Client-side alignment behavior.
    alignment: {
      // Header-equality tolerance for the fast-path (no-resample) check.
      spacingTolerance: 1e-4,
      originTolerance:  1e-4,
      // If true, prompt the user before kicking off the (slow) VTK.js resample.
      promptOnResample: false,
      // When true, the panel toggle is initially ON and the loader writes the
      // NIfTI buffer into the labelmap as-is — the file's affine header is
      // ignored. Use this when your NIfTI exporter copies DICOM voxel data
      // but writes an LAS/RAS-style affine that doesn't match the layout.
      // The user can still flip the panel toggle (persisted to localStorage).
      // assumeDicomGrid: true,
    },

    // UI behavior.
    autoLoadOnSeriesOpen: false,   // load the first overlay automatically when a series opens
    maxOverlaysListed:    25,
  },

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
        imageRendering: "wadors",
        thumbnailRendering: "wadors",
        enableStudyLazyLoad: !0,
        supportsFuzzyMatching: !0,
        supportsWildcard: !0,
        staticWado: 0,
        singlepart: "bulkdata,video",
        bulkDataURI: {
          enabled: !0,
          relativeResolution: "series"
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
