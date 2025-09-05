window.config = {
  routerBasename: '{ROUTER_BASENAME}',
  showStudyList: true,
  extensions: [],
  modes: [],
  // below flag is for performance reasons, but it might not work for all servers

  showWarningMessageForCrossOrigin: true,
  showCPUFallbackMessage: true,
  showLoadingIndicator: true,
  strictZSpacingForVolumeViewport: true,
  defaultDataSourceName: 'databricksPixelsDicom',
  useSharedArrayBuffer: 'AUTO',
  useNorm16Texture: true,
  preferSizeOverAccuracy: true,
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
      namespace: '@ohif/extension-default.dataSourcesModule.dicomlocal',
      sourceName: 'dicomlocal',
      configuration: {
        friendlyName: 'dicom local',
      },
    },
  ],
};
