"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[2932,8402],{

/***/ 11026:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   v: () => (/* binding */ measurementTrackingMode)
/* harmony export */ });
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(40680);

const RESPONSE = {
  NO_NEVER: -1,
  CANCEL: 0,
  CREATE_REPORT: 1,
  ADD_SERIES: 2,
  SET_STUDY_AND_SERIES: 3
};
const measurementTrackingMode = {
  STANDARD: 'standard',
  SIMPLIFIED: 'simplified',
  NONE: 'none'
};
function promptBeginTracking({
  servicesManager,
  extensionManager
}, ctx, evt) {
  const {
    uiViewportDialogService,
    customizationService
  } = servicesManager.services;
  const appConfig = extensionManager._appConfig;
  // When the state change happens after a promise, the state machine sends the retult in evt.data;
  // In case of direct transition to the state, the state machine sends the data in evt;
  const {
    viewportId,
    StudyInstanceUID,
    SeriesInstanceUID
  } = evt.data || evt;
  return new Promise(async function (resolve, reject) {
    const standardMode = appConfig?.measurementTrackingMode === measurementTrackingMode.STANDARD;
    const noTrackingMode = appConfig?.measurementTrackingMode === measurementTrackingMode.NONE;
    let promptResult;
    promptResult = noTrackingMode ? RESPONSE.NO_NEVER : standardMode ? await _askTrackMeasurements(uiViewportDialogService, customizationService, viewportId) : RESPONSE.SET_STUDY_AND_SERIES;
    resolve({
      userResponse: promptResult,
      StudyInstanceUID,
      SeriesInstanceUID,
      viewportId
    });
  });
}
function _askTrackMeasurements(uiViewportDialogService, customizationService, viewportId) {
  return new Promise(function (resolve, reject) {
    const message = customizationService.getCustomization('viewportNotification.beginTrackingMessage');
    const actions = [{
      id: 'prompt-begin-tracking-cancel',
      type: 'secondary',
      text: i18next__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.t('Common:No'),
      value: RESPONSE.CANCEL
    }, {
      id: 'prompt-begin-tracking-no-do-not-ask-again',
      type: 'secondary',
      text: i18next__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.t('MeasurementTable:No, do not ask again'),
      value: RESPONSE.NO_NEVER
    }, {
      id: 'prompt-begin-tracking-yes',
      type: 'primary',
      text: i18next__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.t('Common:Yes'),
      value: RESPONSE.SET_STUDY_AND_SERIES
    }];
    const onSubmit = result => {
      uiViewportDialogService.hide();
      resolve(result);
    };
    uiViewportDialogService.show({
      viewportId,
      id: 'measurement-tracking-prompt-begin-tracking',
      type: 'info',
      message,
      actions,
      onSubmit,
      onOutsideClick: () => {
        uiViewportDialogService.hide();
        resolve(RESPONSE.CANCEL);
      },
      onKeyPress: event => {
        if (event.key === 'Enter') {
          const action = actions.find(action => action.id === 'prompt-begin-tracking-yes');
          onSubmit(action.value);
        }
      }
    });
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (promptBeginTracking);

/***/ }),

/***/ 55844:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ src_getContextModule),
  B: () => (/* reexport */ useTrackedMeasurements)
});

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../../node_modules/prop-types/index.js
var prop_types = __webpack_require__(97598);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
// EXTERNAL MODULE: ../../../node_modules/xstate/es/index.js + 22 modules
var es = __webpack_require__(70574);
// EXTERNAL MODULE: ../../../node_modules/@xstate/react/es/index.js + 8 modules
var react_es = __webpack_require__(95261);
// EXTERNAL MODULE: ../../ui-next/src/index.ts + 1053 modules
var src = __webpack_require__(2836);
;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/contexts/TrackedMeasurementsContext/measurementTrackingMachine.js

const RESPONSE = {
  NO_NEVER: -1,
  CANCEL: 0,
  CREATE_REPORT: 1,
  ADD_SERIES: 2,
  SET_STUDY_AND_SERIES: 3,
  NO_NOT_FOR_SERIES: 4,
  HYDRATE_REPORT: 5
};
const machineConfiguration = {
  id: 'measurementTracking',
  initial: 'idle',
  context: {
    activeViewportId: null,
    trackedStudy: '',
    trackedSeries: [],
    ignoredSeries: [],
    //
    prevTrackedStudy: '',
    prevTrackedSeries: [],
    prevIgnoredSeries: [],
    //
    ignoredSRSeriesForHydration: [],
    isDirty: false
  },
  states: {
    off: {
      type: 'final'
    },
    labellingOnly: {
      on: {
        TRACK_SERIES: [{
          target: 'promptLabelAnnotation',
          actions: ['setPreviousState']
        }, {
          target: 'off'
        }]
      }
    },
    idle: {
      entry: 'clearContext',
      on: {
        TRACK_SERIES: [{
          target: 'promptLabelAnnotation',
          cond: 'isLabelOnMeasure',
          actions: ['setPreviousState']
        }, {
          target: 'promptBeginTracking',
          actions: ['setPreviousState']
        }],
        SET_TRACKED_SERIES: [{
          target: 'tracking',
          actions: ['setTrackedStudyAndMultipleSeries', 'setIsDirtyToClean']
        }],
        PROMPT_HYDRATE_SR: {
          target: 'promptHydrateStructuredReport',
          cond: 'hasNotIgnoredSRSeriesForHydration'
        },
        RESTORE_PROMPT_HYDRATE_SR: 'promptHydrateStructuredReport',
        HYDRATE_SR: 'hydrateStructuredReport',
        UPDATE_ACTIVE_VIEWPORT_ID: {
          actions: (0,es/* assign */.kp)({
            activeViewportId: (_, event) => event.activeViewportId
          })
        }
      }
    },
    promptBeginTracking: {
      invoke: {
        src: 'promptBeginTracking',
        onDone: [{
          target: 'tracking',
          actions: ['setTrackedStudyAndSeries', 'setIsDirty'],
          cond: 'shouldSetStudyAndSeries'
        }, {
          target: 'labellingOnly',
          cond: 'isLabelOnMeasureAndShouldKillMachine'
        }, {
          target: 'off',
          cond: 'shouldKillMachine'
        }, {
          target: 'idle'
        }],
        onError: {
          target: 'idle'
        }
      }
    },
    tracking: {
      on: {
        TRACK_SERIES: [{
          target: 'promptLabelAnnotation',
          cond: 'isLabelOnMeasure',
          actions: ['setPreviousState']
        }, {
          target: 'promptTrackNewStudy',
          cond: 'isNewStudy'
        }, {
          target: 'promptTrackNewSeries',
          cond: 'isNewSeries'
        }],
        UNTRACK_SERIES: [{
          target: 'tracking',
          actions: ['removeTrackedSeries', 'setIsDirty', 'clearDisplaySetHydratedState'],
          cond: 'hasRemainingTrackedSeries'
        }, {
          target: 'idle'
        }],
        UNTRACK_ALL: [{
          target: 'tracking',
          actions: ['clearContext', 'setIsDirtyToClean', 'clearDisplaySetHydratedState', 'clearAllMeasurements']
        }, {
          target: 'idle'
        }],
        SET_TRACKED_SERIES: [{
          target: 'tracking',
          actions: ['setTrackedStudyAndMultipleSeries']
        }],
        SAVE_REPORT: 'promptSaveReport',
        SET_DIRTY: [{
          target: 'tracking',
          actions: ['setIsDirty'],
          cond: 'shouldSetDirty'
        }, {
          target: 'tracking'
        }],
        CHECK_DIRTY: {
          target: 'promptHasDirtyAnnotations',
          cond: 'hasDirtyAndSimplified'
        },
        PROMPT_HYDRATE_SR: {
          target: 'promptHydrateStructuredReport',
          cond: 'isSimplifiedConfig',
          actions: ['clearAllMeasurements', 'clearDisplaySetHydratedState']
        }
      }
    },
    promptTrackNewSeries: {
      invoke: {
        src: 'promptTrackNewSeries',
        onDone: [{
          target: 'tracking',
          actions: ['addTrackedSeries', 'setIsDirty'],
          cond: 'shouldAddSeries'
        }, {
          target: 'tracking',
          actions: ['discardPreviouslyTrackedMeasurements', 'setTrackedStudyAndSeries', 'setIsDirty'],
          cond: 'shouldSetStudyAndSeries'
        }, {
          target: 'promptSaveReport',
          cond: 'shouldPromptSaveReport'
        }, {
          target: 'tracking'
        }],
        onError: {
          target: 'idle'
        }
      }
    },
    promptTrackNewStudy: {
      invoke: {
        src: 'promptTrackNewStudy',
        onDone: [{
          target: 'tracking',
          actions: ['discardPreviouslyTrackedMeasurements', 'setTrackedStudyAndSeries', 'setIsDirty'],
          cond: 'shouldSetStudyAndSeries'
        }, {
          target: 'tracking',
          actions: ['ignoreSeries'],
          cond: 'shouldAddIgnoredSeries'
        }, {
          target: 'promptSaveReport',
          cond: 'shouldPromptSaveReport'
        }, {
          target: 'tracking'
        }],
        onError: {
          target: 'idle'
        }
      }
    },
    promptSaveReport: {
      invoke: {
        src: 'promptSaveReport',
        onDone: [{
          target: 'tracking',
          actions: ['clearAllMeasurements', 'clearDisplaySetHydratedState', 'setIsDirty', 'updatedViewports'],
          cond: 'simplifiedAndLoadSR'
        },
        // "clicked the save button"
        // - should clear all measurements
        // - show DICOM SR
        {
          target: 'idle',
          actions: ['clearAllMeasurements', 'showStructuredReportDisplaySetInActiveViewport'],
          cond: 'shouldSaveAndContinueWithSameReport'
        },
        // "starting a new report"
        // - remove "just saved" measurements
        // - start tracking a new study + report
        {
          target: 'tracking',
          actions: ['discardPreviouslyTrackedMeasurements', 'setTrackedStudyAndSeries'],
          cond: 'shouldSaveAndStartNewReport'
        },
        // Cancel, back to tracking
        {
          target: 'tracking'
        }],
        onError: {
          target: 'idle'
        }
      }
    },
    promptHydrateStructuredReport: {
      invoke: {
        src: 'promptHydrateStructuredReport',
        onDone: [{
          target: 'tracking',
          actions: ['setTrackedStudyAndMultipleSeries', 'jumpToSameImageInActiveViewport', 'setIsDirtyToClean'],
          cond: 'shouldHydrateStructuredReport'
        }, {
          target: 'idle',
          actions: ['ignoreHydrationForSRSeries'],
          cond: 'shouldIgnoreHydrationForSR'
        }],
        onError: {
          target: 'idle'
        }
      }
    },
    hydrateStructuredReport: {
      invoke: {
        src: 'hydrateStructuredReport',
        onDone: [{
          target: 'tracking',
          actions: ['setTrackedStudyAndMultipleSeries', 'jumpToSameImageInActiveViewport', 'setIsDirtyToClean']
        }],
        onError: {
          target: 'idle'
        }
      }
    },
    promptLabelAnnotation: {
      invoke: {
        src: 'promptLabelAnnotation',
        onDone: [{
          target: 'labellingOnly',
          cond: 'wasLabellingOnly'
        }, {
          target: 'promptBeginTracking',
          cond: 'wasIdle'
        }, {
          target: 'promptTrackNewStudy',
          cond: 'wasTrackingAndIsNewStudy'
        }, {
          target: 'promptTrackNewSeries',
          cond: 'wasTrackingAndIsNewSeries'
        }, {
          target: 'tracking',
          cond: 'wasTracking'
        }, {
          target: 'off'
        }]
      }
    },
    promptHasDirtyAnnotations: {
      invoke: {
        src: 'promptHasDirtyAnnotations',
        onDone: [{
          target: 'tracking',
          actions: ['clearAllMeasurements', 'clearDisplaySetHydratedState', 'setIsDirty', 'updatedViewports'],
          cond: 'shouldSetStudyAndSeries'
        }, {
          target: 'promptSaveReport',
          cond: 'shouldPromptSaveReport'
        }, {
          target: 'tracking'
        }]
      }
    }
  },
  strict: true
};
const defaultOptions = {
  services: {
    promptBeginTracking: (ctx, evt) => {
      // return { userResponse, StudyInstanceUID, SeriesInstanceUID }
    },
    promptTrackNewStudy: (ctx, evt) => {
      // return { userResponse, StudyInstanceUID, SeriesInstanceUID }
    },
    promptTrackNewSeries: (ctx, evt) => {
      // return { userResponse, StudyInstanceUID, SeriesInstanceUID }
    }
  },
  actions: {
    discardPreviouslyTrackedMeasurements: (ctx, evt) => {
      console.log('discardPreviouslyTrackedMeasurements: not implemented');
    },
    clearAllMeasurements: (ctx, evt) => {
      console.log('clearAllMeasurements: not implemented');
    },
    jumpToFirstMeasurementInActiveViewport: (ctx, evt) => {
      console.warn('jumpToFirstMeasurementInActiveViewport: not implemented');
    },
    showStructuredReportDisplaySetInActiveViewport: (ctx, evt) => {
      console.warn('showStructuredReportDisplaySetInActiveViewport: not implemented');
    },
    clearContext: (0,es/* assign */.kp)({
      trackedStudy: '',
      trackedSeries: [],
      ignoredSeries: [],
      prevTrackedStudy: '',
      prevTrackedSeries: [],
      prevIgnoredSeries: []
    }),
    // Promise resolves w/ `evt.data.*`
    setTrackedStudyAndSeries: (0,es/* assign */.kp)((ctx, evt) => ({
      prevTrackedStudy: ctx.trackedStudy,
      prevTrackedSeries: ctx.trackedSeries.slice(),
      prevIgnoredSeries: ctx.ignoredSeries.slice(),
      //
      trackedStudy: evt.data.StudyInstanceUID,
      trackedSeries: [evt.data.SeriesInstanceUID],
      ignoredSeries: []
    })),
    setTrackedStudyAndMultipleSeries: (0,es/* assign */.kp)((ctx, evt) => {
      const studyInstanceUID = evt.StudyInstanceUID || evt.data.StudyInstanceUID;
      const seriesInstanceUIDs = evt.SeriesInstanceUIDs || evt.data.SeriesInstanceUIDs;
      return {
        prevTrackedStudy: ctx.trackedStudy,
        prevTrackedSeries: ctx.trackedSeries.slice(),
        prevIgnoredSeries: ctx.ignoredSeries.slice(),
        //
        trackedStudy: studyInstanceUID,
        trackedSeries: [...ctx.trackedSeries, ...seriesInstanceUIDs],
        ignoredSeries: []
      };
    }),
    setIsDirtyToClean: (0,es/* assign */.kp)((ctx, evt) => ({
      isDirty: false
    })),
    setIsDirty: (0,es/* assign */.kp)((ctx, evt) => ({
      isDirty: true
    })),
    ignoreSeries: (0,es/* assign */.kp)((ctx, evt) => ({
      prevIgnoredSeries: [...ctx.ignoredSeries],
      ignoredSeries: [...ctx.ignoredSeries, evt.data.SeriesInstanceUID]
    })),
    ignoreHydrationForSRSeries: (0,es/* assign */.kp)((ctx, evt) => ({
      ignoredSRSeriesForHydration: [...ctx.ignoredSRSeriesForHydration, evt.data.srSeriesInstanceUID]
    })),
    addTrackedSeries: (0,es/* assign */.kp)((ctx, evt) => ({
      prevTrackedSeries: [...ctx.trackedSeries],
      trackedSeries: [...ctx.trackedSeries, evt.data.SeriesInstanceUID]
    })),
    removeTrackedSeries: (0,es/* assign */.kp)((ctx, evt) => ({
      prevTrackedSeries: ctx.trackedSeries.slice().filter(ser => ser !== evt.SeriesInstanceUID),
      trackedSeries: ctx.trackedSeries.slice().filter(ser => ser !== evt.SeriesInstanceUID)
    })),
    setPreviousState: (0,es/* assign */.kp)((ctx, evt, meta) => {
      return {
        prevState: meta.state.value
      };
    })
  },
  guards: {
    // We set dirty any time we performan an action that:
    // - Tracks a new study
    // - Tracks a new series
    // - Adds a measurement to an already tracked study/series
    //
    // We set clean any time we restore from an SR
    //
    // This guard/condition is specific to "new measurements"
    // to make sure we only track dirty when the new measurement is specific
    // to a series we're already tracking
    //
    // tl;dr
    // Any report change, that is not a hydration of an existing report, should
    // result in a "dirty" report
    //
    // Where dirty means there would be "loss of data" if we blew away measurements
    // without creating a new SR.
    shouldSetDirty: (ctx, evt) => {
      return (
        // When would this happen?
        evt.SeriesInstanceUID === undefined || ctx.trackedSeries.includes(evt.SeriesInstanceUID)
      );
    },
    wasLabellingOnly: (ctx, evt, condMeta) => {
      return ctx.prevState === 'labellingOnly';
    },
    wasIdle: (ctx, evt, condMeta) => {
      return ctx.prevState === 'idle';
    },
    wasTracking: (ctx, evt, condMeta) => {
      return ctx.prevState === 'tracking';
    },
    wasTrackingAndIsNewStudy: (ctx, evt, condMeta) => {
      return ctx.prevState === 'tracking' && !ctx.ignoredSeries.includes(evt.data.SeriesInstanceUID) && ctx.trackedStudy !== evt.data.StudyInstanceUID;
    },
    wasTrackingAndIsNewSeries: (ctx, evt, condMeta) => {
      return ctx.prevState === 'tracking' && !ctx.ignoredSeries.includes(evt.data.SeriesInstanceUID) && !ctx.trackedSeries.includes(evt.data.SeriesInstanceUID);
    },
    shouldKillMachine: (ctx, evt) => evt.data && evt.data.userResponse === RESPONSE.NO_NEVER,
    shouldAddSeries: (ctx, evt) => evt.data && evt.data.userResponse === RESPONSE.ADD_SERIES,
    shouldSetStudyAndSeries: (ctx, evt) => evt.data && evt.data.userResponse === RESPONSE.SET_STUDY_AND_SERIES,
    shouldAddIgnoredSeries: (ctx, evt) => evt.data && evt.data.userResponse === RESPONSE.NO_NOT_FOR_SERIES,
    shouldPromptSaveReport: (ctx, evt) => evt.data && evt.data.userResponse === RESPONSE.CREATE_REPORT,
    shouldIgnoreHydrationForSR: (ctx, evt) => evt.data && evt.data.userResponse === RESPONSE.CANCEL,
    shouldSaveAndContinueWithSameReport: (ctx, evt) => evt.data && evt.data.userResponse === RESPONSE.CREATE_REPORT && evt.data.isBackupSave === true,
    shouldSaveAndStartNewReport: (ctx, evt) => evt.data && evt.data.userResponse === RESPONSE.CREATE_REPORT && evt.data.isBackupSave === false,
    shouldHydrateStructuredReport: (ctx, evt) => evt.data && evt.data.userResponse === RESPONSE.HYDRATE_REPORT,
    // Has more than 1, or SeriesInstanceUID is not in list
    // --> Post removal would have non-empty trackedSeries array
    hasRemainingTrackedSeries: (ctx, evt) => ctx.trackedSeries.length > 1 || !ctx.trackedSeries.includes(evt.SeriesInstanceUID),
    hasNotIgnoredSRSeriesForHydration: (ctx, evt) => {
      return !ctx.ignoredSRSeriesForHydration.includes(evt.SeriesInstanceUID);
    },
    isNewStudy: (ctx, evt) => !ctx.ignoredSeries.includes(evt.SeriesInstanceUID) && ctx.trackedStudy !== evt.StudyInstanceUID,
    isNewSeries: (ctx, evt) => !ctx.ignoredSeries.includes(evt.SeriesInstanceUID) && !ctx.trackedSeries.includes(evt.SeriesInstanceUID)
  }
};

// EXTERNAL MODULE: ../../../extensions/measurement-tracking/src/contexts/TrackedMeasurementsContext/promptBeginTracking.js
var promptBeginTracking = __webpack_require__(11026);
// EXTERNAL MODULE: ../../../extensions/cornerstone-dicom-sr/src/index.tsx + 18 modules
var cornerstone_dicom_sr_src = __webpack_require__(34113);
;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/contexts/TrackedMeasurementsContext/hydrateStructuredReport.tsx

function hydrateStructuredReport({
  servicesManager,
  extensionManager,
  commandsManager,
  appConfig
}, ctx, evt) {
  const {
    displaySetService
  } = servicesManager.services;
  const {
    viewportId,
    displaySetInstanceUID
  } = evt;
  const srDisplaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
  return new Promise((resolve, reject) => {
    const hydrationResult = (0,cornerstone_dicom_sr_src.hydrateStructuredReport)({
      servicesManager,
      extensionManager,
      commandsManager,
      appConfig
    }, displaySetInstanceUID);
    const StudyInstanceUID = hydrationResult.StudyInstanceUID;
    const SeriesInstanceUIDs = hydrationResult.SeriesInstanceUIDs;
    resolve({
      displaySetInstanceUID: evt.displaySetInstanceUID,
      srSeriesInstanceUID: srDisplaySet.SeriesInstanceUID,
      viewportId,
      StudyInstanceUID,
      SeriesInstanceUIDs
    });
  });
}
/* harmony default export */ const TrackedMeasurementsContext_hydrateStructuredReport = (hydrateStructuredReport);
// EXTERNAL MODULE: ./state/index.js + 1 modules
var state = __webpack_require__(45981);
;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/contexts/TrackedMeasurementsContext/promptWrapperFunctions.ts
const promptBeginTrackingWrapper = ({
  servicesManager,
  extensionManager
}, ctx, evt) => {
  const {
    customizationService
  } = servicesManager.services;
  const promptBeginTracking = customizationService.getCustomization('measurement.promptBeginTracking');
  return promptBeginTracking({
    servicesManager,
    extensionManager
  }, ctx, evt);
};
const promptHydrateStructuredReportWrapper = ({
  servicesManager,
  extensionManager,
  commandsManager,
  appConfig
}, ctx, evt) => {
  const {
    customizationService
  } = servicesManager.services;
  const promptHydrateStructuredReport = customizationService.getCustomization('measurement.promptHydrateStructuredReport');
  return promptHydrateStructuredReport({
    servicesManager,
    extensionManager,
    commandsManager,
    appConfig
  }, ctx, evt);
};
const promptTrackNewSeriesWrapper = ({
  servicesManager,
  extensionManager
}, ctx, evt) => {
  const {
    customizationService
  } = servicesManager.services;
  const promptTrackNewSeries = customizationService.getCustomization('measurement.promptTrackNewSeries');
  return promptTrackNewSeries({
    servicesManager,
    extensionManager
  }, ctx, evt);
};
const promptTrackNewStudyWrapper = ({
  servicesManager,
  extensionManager
}, ctx, evt) => {
  const {
    customizationService
  } = servicesManager.services;
  const promptTrackNewStudy = customizationService.getCustomization('measurement.promptTrackNewStudy');
  return promptTrackNewStudy({
    servicesManager,
    extensionManager
  }, ctx, evt);
};
const promptLabelAnnotationWrapper = ({
  servicesManager
}, ctx, evt) => {
  const {
    customizationService
  } = servicesManager.services;
  const promptLabelAnnotation = customizationService.getCustomization('measurement.promptLabelAnnotation');
  return promptLabelAnnotation({
    servicesManager
  }, ctx, evt);
};
const promptSaveReportWrapper = ({
  servicesManager,
  commandsManager,
  extensionManager
}, ctx, evt) => {
  const {
    customizationService
  } = servicesManager.services;
  const promptSaveReport = customizationService.getCustomization('measurement.promptSaveReport');
  return promptSaveReport({
    servicesManager,
    commandsManager,
    extensionManager
  }, ctx, evt);
};
const promptHasDirtyAnnotationsWrapper = ({
  servicesManager,
  commandsManager,
  extensionManager
}, ctx, evt) => {
  const {
    customizationService
  } = servicesManager.services;
  const promptHasDirtyAnnotations = customizationService.getCustomization('measurement.promptHasDirtyAnnotations');
  return promptHasDirtyAnnotations({
    servicesManager,
    commandsManager,
    extensionManager
  }, ctx, evt);
};

;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/contexts/TrackedMeasurementsContext/TrackedMeasurementsContext.tsx










const TrackedMeasurementsContext = /*#__PURE__*/react.createContext();
TrackedMeasurementsContext.displayName = 'TrackedMeasurementsContext';
const useTrackedMeasurements = () => (0,react.useContext)(TrackedMeasurementsContext);
const SR_SOPCLASSHANDLERID = '@ohif/extension-cornerstone-dicom-sr.sopClassHandlerModule.dicom-sr';

/**
 *
 * @param {*} param0
 */
function TrackedMeasurementsContextProvider({
  servicesManager,
  commandsManager,
  extensionManager
},
// Bound by consumer
{
  children
} // Component props
) {
  const [appConfig] = (0,state/* useAppConfig */.r)();
  const [viewportGrid, viewportGridService] = (0,src/* useViewportGrid */.ihW)();
  const {
    activeViewportId,
    viewports
  } = viewportGrid;
  const {
    measurementService,
    displaySetService,
    customizationService
  } = servicesManager.services;
  const machineOptions = Object.assign({}, defaultOptions);
  machineOptions.actions = Object.assign({}, machineOptions.actions, {
    jumpToFirstMeasurementInActiveViewport: (ctx, evt) => {
      const {
        trackedStudy,
        trackedSeries
      } = ctx;
      const {
        viewportId: activeViewportId
      } = evt.data;
      const measurements = measurementService.getMeasurements();
      const trackedMeasurements = measurements.filter(m => trackedStudy === m.referenceStudyUID && trackedSeries.includes(m.referenceSeriesUID));
      console.log('jumping to measurement reset viewport', activeViewportId, trackedMeasurements[0]);
      const referencedDisplaySetUID = trackedMeasurements[0].displaySetInstanceUID;
      const referencedDisplaySet = displaySetService.getDisplaySetByUID(referencedDisplaySetUID);
      const referencedImages = referencedDisplaySet.images;
      const isVolumeIdReferenced = referencedImages[0].imageId.startsWith('volumeId');
      const measurementData = trackedMeasurements[0].data;
      let imageIndex = 0;
      if (!isVolumeIdReferenced && measurementData) {
        // if it is imageId referenced find the index of the imageId, we don't have
        // support for volumeId referenced images yet
        imageIndex = referencedImages.findIndex(image => {
          const imageIdToUse = Object.keys(measurementData)[0].substring(8);
          return image.imageId === imageIdToUse;
        });
        if (imageIndex === -1) {
          console.warn('Could not find image index for tracked measurement, using 0');
          imageIndex = 0;
        }
      }
      viewportGridService.setDisplaySetsForViewport({
        viewportId: activeViewportId,
        displaySetInstanceUIDs: [referencedDisplaySetUID],
        viewportOptions: {
          initialImageOptions: {
            index: imageIndex
          }
        }
      });
    },
    jumpToSameImageInActiveViewport: (ctx, evt) => {
      const {
        trackedStudy,
        trackedSeries
      } = ctx;
      const {
        viewportId: activeViewportId
      } = evt.data;
      const measurements = measurementService.getMeasurements();
      const trackedMeasurements = measurements.filter(m => trackedStudy === m.referenceStudyUID && trackedSeries.includes(m.referenceSeriesUID));

      // Jump to the last tracked measurement - most recent
      if (!trackedMeasurements?.length) {
        console.warn("Didn't find any tracked measurements", measurements, trackedStudy, trackedSeries);
        return;
      }
      const trackedMeasurement = trackedMeasurements[trackedMeasurements.length - 1];
      const referencedDisplaySetUID = trackedMeasurement.displaySetInstanceUID;

      // update the previously stored positionPresentation with the new viewportId
      // presentation so that when we put the referencedDisplaySet back in the viewport
      // it will be in the correct position zoom and pan
      commandsManager.runCommand('updateStoredPositionPresentation', {
        viewportId: activeViewportId,
        displaySetInstanceUID: referencedDisplaySetUID,
        referencedImageId: trackedMeasurement.referencedImageId
      });
      viewportGridService.setDisplaySetsForViewport({
        viewportId: activeViewportId,
        displaySetInstanceUIDs: [referencedDisplaySetUID]
      });
    },
    showStructuredReportDisplaySetInActiveViewport: (ctx, evt) => {
      if (evt.data.createdDisplaySetInstanceUIDs.length > 0) {
        const StructuredReportDisplaySetInstanceUID = evt.data.createdDisplaySetInstanceUIDs[0];
        viewportGridService.setDisplaySetsForViewport({
          viewportId: evt.data.viewportId,
          displaySetInstanceUIDs: [StructuredReportDisplaySetInstanceUID]
        });
      }
    },
    discardPreviouslyTrackedMeasurements: (ctx, evt) => {
      const measurements = measurementService.getMeasurements();
      const filteredMeasurements = measurements.filter(ms => ctx.prevTrackedSeries.includes(ms.referenceSeriesUID));
      const measurementIds = filteredMeasurements.map(fm => fm.id);
      for (let i = 0; i < measurementIds.length; i++) {
        measurementService.remove(measurementIds[i]);
      }
    },
    clearAllMeasurements: (ctx, evt) => {
      const measurements = measurementService.getMeasurements();
      const measurementIds = measurements.map(fm => fm.uid);
      for (let i = 0; i < measurementIds.length; i++) {
        measurementService.remove(measurementIds[i]);
      }
      measurementService.setIsMeasurementDeletedIndividually(false);
    },
    clearDisplaySetHydratedState: (ctx, evt) => {
      const {
        displaySetInstanceUID
      } = evt.data ?? evt;
      const displaysets = displaySetService.getActiveDisplaySets();
      displaysets?.forEach(displayset => {
        if (displayset.Modality === 'SR' && displayset.displaySetInstanceUID !== displaySetInstanceUID && displayset.isHydrated) {
          displayset.isHydrated = false;
          displayset.isLoaded = false;
        }
      });
    },
    updatedViewports: (ctx, evt) => {
      const {
        hangingProtocolService
      } = servicesManager.services;
      const {
        displaySetInstanceUID,
        viewportId
      } = evt.data ?? evt;
      const updatedViewports = hangingProtocolService.getViewportsRequireUpdate(viewportId, displaySetInstanceUID);
      viewportGridService.setDisplaySetsForViewports(updatedViewports);
    }
  });
  machineOptions.services = Object.assign({}, machineOptions.services, {
    promptBeginTracking: promptBeginTrackingWrapper.bind(null, {
      servicesManager,
      extensionManager,
      appConfig
    }),
    promptTrackNewSeries: promptTrackNewSeriesWrapper.bind(null, {
      servicesManager,
      extensionManager,
      appConfig
    }),
    promptTrackNewStudy: promptTrackNewStudyWrapper.bind(null, {
      servicesManager,
      extensionManager,
      appConfig
    }),
    promptSaveReport: promptSaveReportWrapper.bind(null, {
      servicesManager,
      commandsManager,
      extensionManager,
      appConfig
    }),
    promptHydrateStructuredReport: promptHydrateStructuredReportWrapper.bind(null, {
      servicesManager,
      extensionManager,
      commandsManager,
      appConfig
    }),
    promptHasDirtyAnnotations: promptHasDirtyAnnotationsWrapper.bind(null, {
      servicesManager,
      extensionManager,
      commandsManager,
      appConfig
    }),
    hydrateStructuredReport: TrackedMeasurementsContext_hydrateStructuredReport.bind(null, {
      servicesManager,
      extensionManager,
      commandsManager,
      appConfig
    }),
    promptLabelAnnotation: promptLabelAnnotationWrapper.bind(null, {
      servicesManager,
      extensionManager,
      commandsManager
    })
  });
  machineOptions.guards = Object.assign({}, machineOptions.guards, {
    isLabelOnMeasure: (ctx, evt, condMeta) => {
      const labelConfig = customizationService.getCustomization('measurementLabels');
      return labelConfig?.labelOnMeasure;
    },
    isLabelOnMeasureAndShouldKillMachine: (ctx, evt, condMeta) => {
      const labelConfig = customizationService.getCustomization('measurementLabels');
      return evt.data && evt.data.userResponse === RESPONSE.NO_NEVER && labelConfig?.labelOnMeasure;
    },
    isSimplifiedConfig: (ctx, evt, condMeta) => {
      return appConfig?.measurementTrackingMode === promptBeginTracking/* measurementTrackingMode */.v.SIMPLIFIED;
    },
    simplifiedAndLoadSR: (ctx, evt, condMeta) => {
      return appConfig?.measurementTrackingMode === promptBeginTracking/* measurementTrackingMode */.v.SIMPLIFIED && evt.data.isBackupSave === false;
    },
    hasDirtyAndSimplified: (ctx, evt, condMeta) => {
      const measurements = measurementService.getMeasurements();
      const hasDirtyMeasurements = measurements.some(measurement => measurement.isDirty) || measurements.length && measurementService.getIsMeasurementDeletedIndividually();
      return appConfig?.measurementTrackingMode === promptBeginTracking/* measurementTrackingMode */.v.SIMPLIFIED && hasDirtyMeasurements;
    }
  });

  // TODO: IMPROVE
  // - Add measurement_updated to cornerstone; debounced? (ext side, or consumption?)
  // - Friendlier transition/api in front of measurementTracking machine?
  // - Blocked: viewport overlay shouldn't clip when resized
  // TODO: PRIORITY
  // - Fix "ellipses" series description dynamic truncate length
  // - Fix viewport border resize
  // - created/destroyed hooks for extensions (cornerstone measurement subscriptions in it's `init`)

  const measurementTrackingMachine = (0,react.useMemo)(() => {
    return (0,es/* Machine */.u5)(machineConfiguration, machineOptions);
  }, []); // Empty dependency array ensures this is only created once

  const [trackedMeasurements, sendTrackedMeasurementsEvent] = (0,react_es/* useMachine */.zl)(measurementTrackingMachine);
  (0,react.useEffect)(() => {
    // Update the state machine with the active viewport ID
    sendTrackedMeasurementsEvent('UPDATE_ACTIVE_VIEWPORT_ID', {
      activeViewportId
    });
  }, [activeViewportId, sendTrackedMeasurementsEvent]);

  // ~~ Listen for changes to ViewportGrid for potential SRs hung in panes when idle
  (0,react.useEffect)(() => {
    const triggerPromptHydrateFlow = async () => {
      if (viewports.size > 0) {
        const activeViewport = viewports.get(activeViewportId);
        if (!activeViewport || !activeViewport?.displaySetInstanceUIDs?.length) {
          return;
        }

        // Todo: Getting the first displaySetInstanceUID is wrong, but we don't have
        // tracking fusion viewports yet. This should change when we do.
        const {
          displaySetService
        } = servicesManager.services;
        const displaySet = displaySetService.getDisplaySetByUID(activeViewport.displaySetInstanceUIDs[0]);
        if (!displaySet) {
          return;
        }

        // If this is an SR produced by our SR SOPClassHandler,
        // and it hasn't been loaded yet, do that now so we
        // can check if it can be rehydrated or not.
        //
        // Note: This happens:
        // - If the viewport is not currently an OHIFCornerstoneSRViewport
        // - If the displaySet has never been hung
        //
        // Otherwise, the displaySet will be loaded by the useEffect handler
        // listening to displaySet changes inside OHIFCornerstoneSRViewport.
        // The issue here is that this handler in TrackedMeasurementsContext
        // ends up occurring before the Viewport is created, so the displaySet
        // is not loaded yet, and isRehydratable is undefined unless we call load().
        if (displaySet.SOPClassHandlerId === SR_SOPCLASSHANDLERID && !displaySet.isLoaded && displaySet.load) {
          await displaySet.load();
        }

        // Magic string
        // load function added by our sopClassHandler module
        if (displaySet.SOPClassHandlerId === SR_SOPCLASSHANDLERID && displaySet.isRehydratable === true && !displaySet.isHydrated) {
          const params = {
            displaySetInstanceUID: displaySet.displaySetInstanceUID,
            SeriesInstanceUID: displaySet.SeriesInstanceUID,
            viewportId: activeViewportId
          };

          // Check if we should bypass the confirmation prompt
          const disableConfirmationPrompts = appConfig?.disableConfirmationPrompts;
          if (disableConfirmationPrompts) {
            sendTrackedMeasurementsEvent('HYDRATE_SR', params);
          } else {
            sendTrackedMeasurementsEvent('PROMPT_HYDRATE_SR', params);
          }
        }
      }
    };
    triggerPromptHydrateFlow();
  }, [trackedMeasurements, activeViewportId, sendTrackedMeasurementsEvent, servicesManager.services, viewports, appConfig]);
  (0,react.useEffect)(() => {
    // The command needs to be bound to the context's sendTrackedMeasurementsEvent
    // so the command has to be registered in a React component.
    commandsManager.registerCommand('DEFAULT', 'loadTrackedSRMeasurements', {
      commandFn: props => sendTrackedMeasurementsEvent('HYDRATE_SR', props)
    });
  }, [commandsManager, sendTrackedMeasurementsEvent]);
  return /*#__PURE__*/react.createElement(TrackedMeasurementsContext.Provider, {
    value: [trackedMeasurements, sendTrackedMeasurementsEvent]
  }, children);
}
TrackedMeasurementsContextProvider.propTypes = {
  children: prop_types_default().oneOf([(prop_types_default()).func, (prop_types_default()).node]),
  appConfig: (prop_types_default()).object
};

;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/contexts/TrackedMeasurementsContext/index.js

;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/contexts/index.js

;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/getContextModule.tsx

function getContextModule({
  servicesManager,
  extensionManager,
  commandsManager
}) {
  const BoundTrackedMeasurementsContextProvider = TrackedMeasurementsContextProvider.bind(null, {
    servicesManager,
    extensionManager,
    commandsManager
  });
  return [{
    name: 'TrackedMeasurementsContext',
    context: TrackedMeasurementsContext,
    provider: BoundTrackedMeasurementsContextProvider
  }];
}

/* harmony default export */ const src_getContextModule = (getContextModule);

/***/ }),

/***/ 3427:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ measurement_tracking_src),
  measurementTrackingMode: () => (/* reexport */ promptBeginTracking/* measurementTrackingMode */.v)
});

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../../extensions/measurement-tracking/src/getContextModule.tsx + 6 modules
var getContextModule = __webpack_require__(55844);
// EXTERNAL MODULE: ../../../node_modules/prop-types/index.js
var prop_types = __webpack_require__(97598);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
// EXTERNAL MODULE: ../../core/src/index.ts + 69 modules
var src = __webpack_require__(62037);
// EXTERNAL MODULE: ../../../extensions/default/src/Panels/StudyBrowser/PanelStudyBrowser.tsx + 3 modules
var PanelStudyBrowser = __webpack_require__(40565);
// EXTERNAL MODULE: ../../ui-next/src/index.ts + 1053 modules
var ui_next_src = __webpack_require__(2836);
;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/panels/PanelStudyBrowserTracking/untrackSeriesModal.tsx


function UntrackSeriesModal({
  hide,
  onConfirm,
  message
}) {
  return /*#__PURE__*/react.createElement("div", {
    className: "text-foreground text-[13px]"
  }, /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement("p", null, message), /*#__PURE__*/react.createElement("p", {
    className: "mt-2"
  }, "This action cannot be undone and will delete all your existing measurements.")), /*#__PURE__*/react.createElement(ui_next_src/* FooterAction */.esu, {
    className: "mt-4"
  }, /*#__PURE__*/react.createElement(ui_next_src/* FooterAction */.esu.Right, null, /*#__PURE__*/react.createElement(ui_next_src/* FooterAction */.esu.Secondary, {
    onClick: hide
  }, "Cancel"), /*#__PURE__*/react.createElement(ui_next_src/* FooterAction */.esu.Primary, {
    onClick: () => {
      onConfirm();
      hide();
    }
  }, "Untrack"))));
}
;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/panels/PanelStudyBrowserTracking/PanelStudyBrowserTracking.tsx






const thumbnailNoImageModalities = ['SR', 'SEG', 'SM', 'RTSTRUCT', 'RTPLAN', 'RTDOSE', 'DOC', 'OT', 'PMAP'];

/**
 * Panel component for the Study Browser with tracking capabilities
 */
function PanelStudyBrowserTracking({
  getImageSrc,
  getStudiesForPatientByMRN,
  requestDisplaySetCreationForStudy,
  dataSource
}) {
  const {
    servicesManager
  } = (0,src.useSystem)();
  const {
    displaySetService,
    uiModalService,
    measurementService,
    viewportGridService
  } = servicesManager.services;
  const [trackedMeasurements, sendTrackedMeasurementsEvent] = (0,getContextModule/* useTrackedMeasurements */.B)();
  const {
    trackedSeries
  } = trackedMeasurements.context;
  const checkDirtyMeasurements = displaySetInstanceUID => {
    const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
    if (displaySet.Modality === 'SR') {
      const activeViewportId = viewportGridService.getActiveViewportId();
      sendTrackedMeasurementsEvent('CHECK_DIRTY', {
        viewportId: activeViewportId,
        displaySetInstanceUID: displaySetInstanceUID
      });
    }
  };
  (0,react.useEffect)(() => {
    const subscriptionOndropFired = viewportGridService.subscribe(viewportGridService.EVENTS.VIEWPORT_ONDROP_HANDLED, ({
      eventData
    }) => {
      checkDirtyMeasurements(eventData.displaySetInstanceUID);
    });
    return () => {
      subscriptionOndropFired.unsubscribe();
    };
  }, []);
  const onClickUntrack = displaySetInstanceUID => {
    const onConfirm = () => {
      const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
      sendTrackedMeasurementsEvent('UNTRACK_SERIES', {
        SeriesInstanceUID: displaySet.SeriesInstanceUID
      });
      const measurements = measurementService.getMeasurements();
      measurements.forEach(m => {
        if (m.referenceSeriesUID === displaySet.SeriesInstanceUID) {
          measurementService.remove(m.uid);
        }
      });
    };
    uiModalService.show({
      title: 'Untrack Series',
      content: UntrackSeriesModal,
      contentProps: {
        onConfirm,
        message: 'Are you sure you want to untrack this series?'
      }
    });
  };

  // Custom mapping function to add tracking data to display sets
  const mapDisplaySetsWithTracking = (displaySets, displaySetLoadingState, thumbnailImageSrcMap, viewports) => {
    const thumbnailDisplaySets = [];
    const thumbnailNoImageDisplaySets = [];
    displaySets.filter(ds => !ds.excludeFromThumbnailBrowser).forEach(ds => {
      const {
        thumbnailSrc,
        displaySetInstanceUID
      } = ds;
      const componentType = getComponentType(ds);
      const array = componentType === 'thumbnailTracked' ? thumbnailDisplaySets : thumbnailNoImageDisplaySets;
      const loadingProgress = displaySetLoadingState?.[displaySetInstanceUID];
      array.push({
        displaySetInstanceUID,
        description: ds.SeriesDescription || '',
        seriesNumber: ds.SeriesNumber,
        modality: ds.Modality,
        seriesDate: ds.SeriesDate ? new Date(ds.SeriesDate).toLocaleDateString() : '',
        numInstances: ds.numImageFrames,
        loadingProgress,
        countIcon: ds.countIcon,
        messages: ds.messages,
        StudyInstanceUID: ds.StudyInstanceUID,
        componentType,
        imageSrc: thumbnailSrc || thumbnailImageSrcMap[displaySetInstanceUID],
        dragData: {
          type: 'displayset',
          displaySetInstanceUID
        },
        isTracked: trackedSeries.includes(ds.SeriesInstanceUID),
        isHydratedForDerivedDisplaySet: ds.isHydrated
      });
    });
    return [...thumbnailDisplaySets, ...thumbnailNoImageDisplaySets];
  };

  // Override component type to use tracking specific components
  const getComponentType = ds => {
    if (thumbnailNoImageModalities.includes(ds.Modality) || ds?.unsupported) {
      return 'thumbnailNoImage';
    }
    return 'thumbnailTracked';
  };
  return /*#__PURE__*/react.createElement(PanelStudyBrowser/* default */.A, {
    getImageSrc: getImageSrc,
    getStudiesForPatientByMRN: getStudiesForPatientByMRN,
    requestDisplaySetCreationForStudy: requestDisplaySetCreationForStudy,
    dataSource: dataSource,
    customMapDisplaySets: mapDisplaySetsWithTracking,
    onClickUntrack: onClickUntrack,
    onDoubleClickThumbnailHandlerCallBack: checkDirtyMeasurements
  });
}
PanelStudyBrowserTracking.propTypes = {
  dataSource: prop_types_default().shape({
    getImageIdsForDisplaySet: (prop_types_default()).func.isRequired
  }).isRequired,
  getImageSrc: (prop_types_default()).func.isRequired,
  getStudiesForPatientByMRN: (prop_types_default()).func.isRequired,
  requestDisplaySetCreationForStudy: (prop_types_default()).func.isRequired
};
;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/panels/PanelStudyBrowserTracking/getImageSrcFromImageId.js
/**
 * @param {*} cornerstone
 * @param {*} imageId
 */
function getImageSrcFromImageId(cornerstone, imageId) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    cornerstone.utilities.loadImageToCanvas({
      canvas,
      imageId,
      thumbnail: true
    }).then(imageId => {
      resolve(canvas.toDataURL());
    }).catch(reject);
  });
}
/* harmony default export */ const PanelStudyBrowserTracking_getImageSrcFromImageId = (getImageSrcFromImageId);
// EXTERNAL MODULE: ../../../extensions/default/src/index.ts + 136 modules
var default_src = __webpack_require__(96926);
;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/panels/PanelStudyBrowserTracking/index.tsx

//




function _getStudyForPatientUtility(extensionManager) {
  const utilityModule = extensionManager.getModuleEntry('@ohif/extension-default.utilityModule.common');
  const {
    getStudiesForPatientByMRN
  } = utilityModule.exports;
  return getStudiesForPatientByMRN;
}

/**
 * Wraps the PanelStudyBrowser and provides features afforded by managers/services
 *
 * @param {object} params
 * @param {object} commandsManager
 * @param {object} extensionManager
 */
function WrappedPanelStudyBrowserTracking() {
  const {
    extensionManager
  } = (0,src.useSystem)();
  const dataSource = extensionManager.getActiveDataSource()[0];
  const getStudiesForPatientByMRN = _getStudyForPatientUtility(extensionManager);
  const _getStudiesForPatientByMRN = getStudiesForPatientByMRN.bind(null, dataSource);
  const _getImageSrcFromImageId = (0,react.useCallback)(_createGetImageSrcFromImageIdFn(extensionManager), []);
  const _requestDisplaySetCreationForStudy = default_src.requestDisplaySetCreationForStudy.bind(null, dataSource);
  return /*#__PURE__*/react.createElement(PanelStudyBrowserTracking, {
    dataSource: dataSource,
    getImageSrc: _getImageSrcFromImageId,
    getStudiesForPatientByMRN: _getStudiesForPatientByMRN,
    requestDisplaySetCreationForStudy: _requestDisplaySetCreationForStudy
  });
}

/**
 * Grabs cornerstone library reference using a dependent command from
 * the @ohif/extension-cornerstone extension. Then creates a helper function
 * that can take an imageId and return an image src.
 *
 * @param {func} getCommand - CommandManager's getCommand method
 * @returns {func} getImageSrcFromImageId - A utility function powered by
 * cornerstone
 */
function _createGetImageSrcFromImageIdFn(extensionManager) {
  const utilities = extensionManager.getModuleEntry('@ohif/extension-cornerstone.utilityModule.common');
  try {
    const {
      cornerstone
    } = utilities.exports.getCornerstoneLibraries();
    return PanelStudyBrowserTracking_getImageSrcFromImageId.bind(null, cornerstone);
  } catch (ex) {
    throw new Error('Required command not found');
  }
}
/* harmony default export */ const panels_PanelStudyBrowserTracking = (WrappedPanelStudyBrowserTracking);
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/index.tsx + 136 modules
var cornerstone_src = __webpack_require__(72283);
;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/panels/PanelMeasurementTableTracking.tsx
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }






const {
  filterAnd,
  filterPlanarMeasurement,
  filterMeasurementsBySeriesUID
} = src.utils.MeasurementFilters;
function PanelMeasurementTableTracking(props) {
  const [viewportGrid] = (0,ui_next_src/* useViewportGrid */.ihW)();
  const {
    measurementService,
    uiModalService
  } = props.servicesManager.services;
  const [trackedMeasurements, sendTrackedMeasurementsEvent] = (0,getContextModule/* useTrackedMeasurements */.B)();
  const {
    trackedStudy,
    trackedSeries
  } = trackedMeasurements.context;
  const measurementFilter = trackedStudy ? filterAnd(filterPlanarMeasurement, filterMeasurementsBySeriesUID(trackedSeries)) : filterPlanarMeasurement;
  const onUntrackConfirm = () => {
    sendTrackedMeasurementsEvent('UNTRACK_ALL', {});
  };
  const onDelete = () => {
    const hasDirtyMeasurements = measurementService.getMeasurements().some(measurement => measurement.isDirty);
    hasDirtyMeasurements ? uiModalService.show({
      title: 'Untrack Study',
      content: UntrackSeriesModal,
      contentProps: {
        onConfirm: onUntrackConfirm,
        message: 'Are you sure you want to untrack study and delete all measurements?'
      }
    }) : onUntrackConfirm();
  };
  const EmptyComponent = () => /*#__PURE__*/react.createElement("div", {
    "data-cy": "trackedMeasurements-panel"
  }, /*#__PURE__*/react.createElement(ui_next_src/* MeasurementTable */.VaM, {
    title: "Measurements",
    isExpanded: false
  }, /*#__PURE__*/react.createElement(ui_next_src/* MeasurementTable */.VaM.Body, null)));
  const actions = {
    createSR: ({
      StudyInstanceUID
    }) => {
      sendTrackedMeasurementsEvent('SAVE_REPORT', {
        viewportId: viewportGrid.activeViewportId,
        isBackupSave: true,
        StudyInstanceUID,
        measurementFilter
      });
    },
    onDelete
  };
  const Header = props => /*#__PURE__*/react.createElement(ui_next_src/* AccordionTrigger */.$m7, {
    asChild: true,
    className: "px-0"
  }, /*#__PURE__*/react.createElement("div", {
    "data-cy": "TrackingHeader"
  }, /*#__PURE__*/react.createElement(cornerstone_src.StudySummaryFromMetadata, _extends({}, props, {
    actions: actions
  }))));
  return /*#__PURE__*/react.createElement(ui_next_src/* ScrollArea */.FKN, null, /*#__PURE__*/react.createElement("div", {
    "data-cy": "trackedMeasurements-panel"
  }, /*#__PURE__*/react.createElement(cornerstone_src.PanelMeasurement, {
    measurementFilter: measurementFilter,
    emptyComponent: EmptyComponent,
    sourceChildren: props.children
  }, /*#__PURE__*/react.createElement(cornerstone_src.StudyMeasurements, {
    grouping: props.grouping
  }, /*#__PURE__*/react.createElement(cornerstone_src.AccordionGroup.Trigger, {
    key: "trackingMeasurementsHeader",
    asChild: true
  }, /*#__PURE__*/react.createElement(Header, {
    key: "trackingHeadChild"
  })), /*#__PURE__*/react.createElement(cornerstone_src.MeasurementsOrAdditionalFindings, {
    key: "measurementsOrAdditionalFindings",
    activeStudyUID: trackedStudy,
    customHeader: cornerstone_src.StudyMeasurementsActions,
    measurementFilter: measurementFilter,
    actions: actions
  })))));
}
/* harmony default export */ const panels_PanelMeasurementTableTracking = (PanelMeasurementTableTracking);
;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/panels/index.js



// EXTERNAL MODULE: ../../../node_modules/i18next/dist/esm/i18next.js
var i18next = __webpack_require__(40680);
;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/getPanelModule.tsx
function getPanelModule_extends() { return getPanelModule_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, getPanelModule_extends.apply(null, arguments); }




// TODO:
// - No loading UI exists yet
// - cancel promises when component is destroyed
// - show errors in UI for thumbnails if promise fails

function getPanelModule({
  commandsManager,
  extensionManager,
  servicesManager
}) {
  return [{
    name: 'seriesList',
    iconName: 'tab-studies',
    iconLabel: 'Studies',
    label: i18next/* default */.A.t('SidePanel:Studies'),
    component: props => /*#__PURE__*/react.createElement(panels_PanelStudyBrowserTracking, props)
  }, {
    name: 'trackedMeasurements',
    iconName: 'tab-linear',
    iconLabel: 'Measure',
    label: i18next/* default */.A.t('SidePanel:Measurements'),
    component: props => /*#__PURE__*/react.createElement(panels_PanelMeasurementTableTracking, getPanelModule_extends({}, props, {
      key: "trackedMeasurements-panel",
      commandsManager: commandsManager,
      extensionManager: extensionManager,
      servicesManager: servicesManager
    }))
  }];
}
/* harmony default export */ const src_getPanelModule = (getPanelModule);
;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/getViewportModule.tsx
function getViewportModule_extends() { return getViewportModule_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, getViewportModule_extends.apply(null, arguments); }


const Component = /*#__PURE__*/react.lazy(() => {
  return __webpack_require__.e(/* import() */ 9862).then(__webpack_require__.bind(__webpack_require__, 49862));
});
const OHIFCornerstoneViewport = props => {
  return /*#__PURE__*/react.createElement(react.Suspense, {
    fallback: /*#__PURE__*/react.createElement("div", null, "Loading...")
  }, /*#__PURE__*/react.createElement(Component, props));
};
function getViewportModule({
  servicesManager,
  commandsManager,
  extensionManager
}) {
  const ExtendedOHIFCornerstoneTrackingViewport = props => {
    return /*#__PURE__*/react.createElement(OHIFCornerstoneViewport, getViewportModule_extends({
      servicesManager: servicesManager,
      commandsManager: commandsManager,
      extensionManager: extensionManager
    }, props));
  };
  return [{
    name: 'cornerstone-tracked',
    component: ExtendedOHIFCornerstoneTrackingViewport,
    isReferenceViewable: props => cornerstone_src.utils.isReferenceViewable({
      ...props,
      servicesManager
    })
  }];
}
/* harmony default export */ const src_getViewportModule = (getViewportModule);
;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/extension-measurement-tracking"}');
;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/id.js

const id = package_namespaceObject.UU;

// EXTERNAL MODULE: ../../i18n/src/index.js + 150 modules
var i18n_src = __webpack_require__(16076);
// EXTERNAL MODULE: ../../../extensions/measurement-tracking/src/contexts/TrackedMeasurementsContext/promptBeginTracking.js
var promptBeginTracking = __webpack_require__(11026);
;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/contexts/TrackedMeasurementsContext/promptHasDirtyAnnotations.ts
const RESPONSE = {
  NO_NEVER: -1,
  CANCEL: 0,
  CREATE_REPORT: 1,
  ADD_SERIES: 2,
  SET_STUDY_AND_SERIES: 3,
  NO_NOT_FOR_SERIES: 4
};
function promptHasDirtyAnnotations({
  servicesManager
}, ctx, evt) {
  const {
    viewportId,
    displaySetInstanceUID
  } = evt.data || evt;
  return new Promise(async function (resolve, reject) {
    const {
      uiViewportDialogService,
      customizationService
    } = servicesManager.services;
    const promptResult = await _askSaveDiscardOrCancel(uiViewportDialogService, customizationService, viewportId);
    resolve({
      displaySetInstanceUID,
      userResponse: promptResult,
      viewportId,
      isBackupSave: false
    });
  });
}
function _askSaveDiscardOrCancel(UIViewportDialogService, customizationService, viewportId) {
  return new Promise(function (resolve, reject) {
    const message = customizationService.getCustomization('viewportNotification.discardDirtyMessage');
    const actions = [{
      id: 'cancel',
      type: 'cancel',
      text: 'Cancel',
      value: RESPONSE.CANCEL
    }, {
      id: 'discard-existing',
      type: 'secondary',
      text: 'No, discard existing',
      value: RESPONSE.SET_STUDY_AND_SERIES
    }, {
      id: 'save-existing',
      type: 'primary',
      text: 'Yes',
      value: RESPONSE.CREATE_REPORT
    }];
    const onSubmit = result => {
      UIViewportDialogService.hide();
      resolve(result);
    };
    UIViewportDialogService.show({
      viewportId,
      id: 'measurement-tracking-prompt-dirty-measurement',
      type: 'info',
      message,
      actions,
      onSubmit,
      onOutsideClick: () => {
        UIViewportDialogService.hide();
        resolve(RESPONSE.CANCEL);
      },
      onKeyPress: event => {
        if (event.key === 'Enter') {
          const action = actions.find(action => action.id === 'save-existing');
          onSubmit(action.value);
        }
      }
    });
  });
}
/* harmony default export */ const TrackedMeasurementsContext_promptHasDirtyAnnotations = (promptHasDirtyAnnotations);
// EXTERNAL MODULE: ../../../extensions/cornerstone-dicom-sr/src/index.tsx + 18 modules
var cornerstone_dicom_sr_src = __webpack_require__(34113);
;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/contexts/TrackedMeasurementsContext/promptHydrateStructuredReport.js


const promptHydrateStructuredReport_RESPONSE = {
  NO_NEVER: -1,
  CANCEL: 0,
  CREATE_REPORT: 1,
  ADD_SERIES: 2,
  SET_STUDY_AND_SERIES: 3,
  NO_NOT_FOR_SERIES: 4,
  HYDRATE_REPORT: 5
};
function promptHydrateStructuredReport({
  servicesManager,
  extensionManager,
  commandsManager,
  appConfig
}, ctx, evt) {
  const {
    uiViewportDialogService,
    displaySetService,
    customizationService
  } = servicesManager.services;
  const {
    viewportId,
    displaySetInstanceUID
  } = evt;
  const srDisplaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
  return new Promise(async function (resolve, reject) {
    const standardMode = appConfig?.measurementTrackingMode === promptBeginTracking/* measurementTrackingMode */.v.STANDARD;
    const promptResult = standardMode ? await _askTrackMeasurements(uiViewportDialogService, customizationService, viewportId) : promptHydrateStructuredReport_RESPONSE.HYDRATE_REPORT;

    // Need to do action here... So we can set state...
    let StudyInstanceUID, SeriesInstanceUIDs;
    if (promptResult === promptHydrateStructuredReport_RESPONSE.HYDRATE_REPORT) {
      console.warn('!! HYDRATING STRUCTURED REPORT');
      const hydrationResult = (0,cornerstone_dicom_sr_src.hydrateStructuredReport)({
        servicesManager,
        extensionManager,
        commandsManager,
        appConfig
      }, displaySetInstanceUID);
      StudyInstanceUID = hydrationResult.StudyInstanceUID;
      SeriesInstanceUIDs = hydrationResult.SeriesInstanceUIDs;
    }
    resolve({
      userResponse: promptResult,
      displaySetInstanceUID: evt.displaySetInstanceUID,
      srSeriesInstanceUID: srDisplaySet.SeriesInstanceUID,
      viewportId,
      StudyInstanceUID,
      SeriesInstanceUIDs
    });
  });
}
function _askTrackMeasurements(uiViewportDialogService, customizationService, viewportId) {
  return new Promise(function (resolve, reject) {
    const message = customizationService.getCustomization('viewportNotification.hydrateSRMessage');
    const actions = [{
      id: 'no-hydrate',
      type: 'secondary',
      text: 'No',
      value: promptHydrateStructuredReport_RESPONSE.CANCEL
    }, {
      id: 'yes-hydrate',
      type: 'primary',
      text: 'Yes',
      value: promptHydrateStructuredReport_RESPONSE.HYDRATE_REPORT
    }];
    const onSubmit = result => {
      uiViewportDialogService.hide();
      resolve(result);
    };
    uiViewportDialogService.show({
      viewportId,
      type: 'info',
      message,
      actions,
      onSubmit,
      onOutsideClick: () => {
        uiViewportDialogService.hide();
        resolve(promptHydrateStructuredReport_RESPONSE.CANCEL);
      },
      onKeyPress: event => {
        if (event.key === 'Enter') {
          const action = actions.find(action => action.value === promptHydrateStructuredReport_RESPONSE.HYDRATE_REPORT);
          onSubmit(action.value);
        }
      }
    });
  });
}
/* harmony default export */ const TrackedMeasurementsContext_promptHydrateStructuredReport = (promptHydrateStructuredReport);
;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/contexts/TrackedMeasurementsContext/promptTrackNewSeries.js

const promptTrackNewSeries_RESPONSE = {
  NO_NEVER: -1,
  CANCEL: 0,
  CREATE_REPORT: 1,
  ADD_SERIES: 2,
  SET_STUDY_AND_SERIES: 3,
  NO_NOT_FOR_SERIES: 4
};
function promptTrackNewSeries({
  servicesManager,
  extensionManager
}, ctx, evt) {
  const {
    UIViewportDialogService,
    customizationService
  } = servicesManager.services;
  // When the state change happens after a promise, the state machine sends the retult in evt.data;
  // In case of direct transition to the state, the state machine sends the data in evt;
  const {
    viewportId,
    StudyInstanceUID,
    SeriesInstanceUID
  } = evt.data || evt;
  return new Promise(async function (resolve, reject) {
    const appConfig = extensionManager._appConfig;
    const showPrompt = appConfig?.measurementTrackingMode === promptBeginTracking/* measurementTrackingMode */.v.STANDARD;
    let promptResult = showPrompt ? await _askShouldAddMeasurements(UIViewportDialogService, customizationService, viewportId) : promptTrackNewSeries_RESPONSE.ADD_SERIES;
    if (promptResult === promptTrackNewSeries_RESPONSE.CREATE_REPORT) {
      promptResult = ctx.isDirty ? await promptTrackNewSeries_askSaveDiscardOrCancel(UIViewportDialogService, customizationService, viewportId) : promptTrackNewSeries_RESPONSE.SET_STUDY_AND_SERIES;
    }
    resolve({
      userResponse: promptResult,
      StudyInstanceUID,
      SeriesInstanceUID,
      viewportId,
      isBackupSave: false
    });
  });
}
function _askShouldAddMeasurements(uiViewportDialogService, customizationService, viewportId) {
  return new Promise(function (resolve, reject) {
    const message = customizationService.getCustomization('viewportNotification.trackNewSeriesMessage');
    const actions = [{
      type: 'secondary',
      text: 'Cancel',
      value: promptTrackNewSeries_RESPONSE.CANCEL
    }, {
      type: 'primary',
      text: 'Create new report',
      value: promptTrackNewSeries_RESPONSE.CREATE_REPORT
    }, {
      type: 'primary',
      text: 'Add to existing report',
      value: promptTrackNewSeries_RESPONSE.ADD_SERIES
    }];
    const onSubmit = result => {
      uiViewportDialogService.hide();
      resolve(result);
    };
    uiViewportDialogService.show({
      viewportId,
      type: 'info',
      message,
      actions,
      onSubmit,
      onOutsideClick: () => {
        uiViewportDialogService.hide();
        resolve(promptTrackNewSeries_RESPONSE.CANCEL);
      }
    });
  });
}
function promptTrackNewSeries_askSaveDiscardOrCancel(UIViewportDialogService, customizationService, viewportId) {
  return new Promise(function (resolve, reject) {
    const message = customizationService.getCustomization('viewportNotification.discardSeriesMessage');
    const actions = [{
      type: 'secondary',
      text: 'Cancel',
      value: promptTrackNewSeries_RESPONSE.CANCEL
    }, {
      type: 'secondary',
      text: 'Save',
      value: promptTrackNewSeries_RESPONSE.CREATE_REPORT
    }, {
      type: 'primary',
      text: 'Discard',
      value: promptTrackNewSeries_RESPONSE.SET_STUDY_AND_SERIES
    }];
    const onSubmit = result => {
      UIViewportDialogService.hide();
      resolve(result);
    };
    UIViewportDialogService.show({
      viewportId,
      type: 'warning',
      message,
      actions,
      onSubmit,
      onOutsideClick: () => {
        UIViewportDialogService.hide();
        resolve(promptTrackNewSeries_RESPONSE.CANCEL);
      }
    });
  });
}
/* harmony default export */ const TrackedMeasurementsContext_promptTrackNewSeries = (promptTrackNewSeries);
;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/contexts/TrackedMeasurementsContext/promptTrackNewStudy.ts


const promptTrackNewStudy_RESPONSE = {
  NO_NEVER: -1,
  CANCEL: 0,
  CREATE_REPORT: 1,
  ADD_SERIES: 2,
  SET_STUDY_AND_SERIES: 3,
  NO_NOT_FOR_SERIES: 4
};
function promptTrackNewStudy({
  servicesManager,
  extensionManager
}, ctx, evt) {
  const {
    uiViewportDialogService,
    customizationService
  } = servicesManager.services;
  // When the state change happens after a promise, the state machine sends the retult in evt.data;
  // In case of direct transition to the state, the state machine sends the data in evt;
  const {
    viewportId,
    StudyInstanceUID,
    SeriesInstanceUID
  } = evt.data || evt;
  return new Promise(async function (resolve, reject) {
    const appConfig = extensionManager._appConfig;
    const standardMode = appConfig?.measurementTrackingMode === promptBeginTracking/* measurementTrackingMode */.v.STANDARD;
    const simplifiedMode = appConfig?.measurementTrackingMode === promptBeginTracking/* measurementTrackingMode */.v.SIMPLIFIED;
    let promptResult = standardMode ? await promptTrackNewStudy_askTrackMeasurements(uiViewportDialogService, customizationService, viewportId) : promptTrackNewStudy_RESPONSE.SET_STUDY_AND_SERIES;
    if (promptResult === promptTrackNewStudy_RESPONSE.SET_STUDY_AND_SERIES) {
      promptResult = ctx.isDirty && (standardMode || simplifiedMode) ? await promptTrackNewStudy_askSaveDiscardOrCancel(uiViewportDialogService, customizationService, viewportId) : promptTrackNewStudy_RESPONSE.SET_STUDY_AND_SERIES;
    }
    resolve({
      userResponse: promptResult,
      StudyInstanceUID,
      SeriesInstanceUID,
      viewportId,
      isBackupSave: false
    });
  });
}
function promptTrackNewStudy_askTrackMeasurements(UIViewportDialogService, customizationService, viewportId) {
  return new Promise(function (resolve, reject) {
    const message = customizationService.getCustomization('viewportNotification.trackNewStudyMessage');
    const actions = [{
      type: 'cancel',
      text: i18next/* default */.A.t('MeasurementTable:No'),
      value: promptTrackNewStudy_RESPONSE.CANCEL
    }, {
      type: 'secondary',
      text: i18next/* default */.A.t('MeasurementTable:No, do not ask again'),
      value: promptTrackNewStudy_RESPONSE.NO_NOT_FOR_SERIES
    }, {
      type: 'primary',
      text: i18next/* default */.A.t('MeasurementTable:Yes'),
      value: promptTrackNewStudy_RESPONSE.SET_STUDY_AND_SERIES
    }];
    const onSubmit = result => {
      UIViewportDialogService.hide();
      resolve(result);
    };
    UIViewportDialogService.show({
      viewportId,
      type: 'info',
      message,
      actions,
      onSubmit,
      onOutsideClick: () => {
        UIViewportDialogService.hide();
        resolve(promptTrackNewStudy_RESPONSE.CANCEL);
      },
      onKeyPress: event => {
        if (event.key === 'Enter') {
          const action = actions.find(action => action.value === promptTrackNewStudy_RESPONSE.SET_STUDY_AND_SERIES);
          onSubmit(action.value);
        }
      }
    });
  });
}
function promptTrackNewStudy_askSaveDiscardOrCancel(UIViewportDialogService, customizationService, viewportId) {
  return new Promise(function (resolve, reject) {
    const message = customizationService.getCustomization('viewportNotification.discardStudyMessage');
    const actions = [{
      type: 'cancel',
      text: 'Cancel',
      value: promptTrackNewStudy_RESPONSE.CANCEL
    }, {
      type: 'secondary',
      text: 'No, discard previously tracked series & measurements',
      value: promptTrackNewStudy_RESPONSE.SET_STUDY_AND_SERIES
    }, {
      type: 'primary',
      text: 'Yes',
      value: promptTrackNewStudy_RESPONSE.CREATE_REPORT
    }];
    const onSubmit = result => {
      UIViewportDialogService.hide();
      resolve(result);
    };
    UIViewportDialogService.show({
      viewportId,
      type: 'warning',
      message,
      actions,
      onSubmit,
      onOutsideClick: () => {
        UIViewportDialogService.hide();
        resolve(promptTrackNewStudy_RESPONSE.CANCEL);
      }
    });
  });
}
/* harmony default export */ const TrackedMeasurementsContext_promptTrackNewStudy = (promptTrackNewStudy);
;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/customizations/measurementTrackingPrompts.tsx






/* harmony default export */ const measurementTrackingPrompts = ({
  'measurement.promptBeginTracking': promptBeginTracking/* default */.A,
  'measurement.promptHydrateStructuredReport': TrackedMeasurementsContext_promptHydrateStructuredReport,
  'measurement.promptTrackNewSeries': TrackedMeasurementsContext_promptTrackNewSeries,
  'measurement.promptTrackNewStudy': TrackedMeasurementsContext_promptTrackNewStudy,
  'measurement.promptLabelAnnotation': default_src.promptLabelAnnotation,
  'measurement.promptSaveReport': default_src.promptSaveReport,
  'measurement.promptHasDirtyAnnotations': TrackedMeasurementsContext_promptHasDirtyAnnotations
});
;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/getCustomizationModule.ts

function getCustomizationModule() {
  return [{
    name: 'default',
    value: {
      ...measurementTrackingPrompts
    }
  }];
}
;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/customizations/studyBrowserCustomization.ts

const onDoubleClickHandler = {
  callbacks: [({
    activeViewportId,
    servicesManager,
    isHangingProtocolLayout,
    appConfig
  }) => async displaySetInstanceUID => {
    const {
      hangingProtocolService,
      viewportGridService,
      uiNotificationService
    } = servicesManager.services;
    let updatedViewports = [];
    const viewportId = activeViewportId;
    const haveDirtyMeasurementsInSimplifiedMode = checkHasDirtyAndSimplifiedMode({
      servicesManager,
      appConfig,
      displaySetInstanceUID
    });
    try {
      if (!haveDirtyMeasurementsInSimplifiedMode) {
        updatedViewports = hangingProtocolService.getViewportsRequireUpdate(viewportId, displaySetInstanceUID, isHangingProtocolLayout);
        viewportGridService.setDisplaySetsForViewports(updatedViewports);
      }
    } catch (error) {
      console.warn(error);
      uiNotificationService.show({
        title: 'Thumbnail Double Click',
        message: 'The selected display sets could not be added to the viewport.',
        type: 'error',
        duration: 3000
      });
    }
  }]
};
const customOnDropHandlerCallback = async props => {
  const handled = checkHasDirtyAndSimplifiedMode(props);
  return Promise.resolve({
    handled
  });
};
const checkHasDirtyAndSimplifiedMode = props => {
  const {
    servicesManager,
    appConfig,
    displaySetInstanceUID
  } = props;
  const simplifiedMode = appConfig.measurementTrackingMode === promptBeginTracking/* measurementTrackingMode */.v.SIMPLIFIED;
  const {
    measurementService,
    displaySetService
  } = servicesManager.services;
  const measurements = measurementService.getMeasurements();
  const haveDirtyMeasurements = measurements.some(m => m.isDirty) || measurements.length && measurementService.getIsMeasurementDeletedIndividually();
  const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
  const hasDirtyAndSimplifiedMode = displaySet.Modality === 'SR' && simplifiedMode && haveDirtyMeasurements;
  return hasDirtyAndSimplifiedMode;
};

;// CONCATENATED MODULE: ../../../extensions/measurement-tracking/src/index.tsx










const measurementTrackingExtension = {
  /**
   * Only required property. Should be a unique value across all extensions.
   */
  id: id,
  getContextModule: getContextModule/* default */.A,
  getPanelModule: src_getPanelModule,
  getViewportModule: src_getViewportModule,
  onModeEnter({
    servicesManager
  }) {
    const {
      toolbarService,
      customizationService
    } = servicesManager.services;
    customizationService.setCustomizations({
      'studyBrowser.thumbnailDoubleClickCallback': {
        $set: onDoubleClickHandler
      },
      customOnDropHandler: {
        $set: customOnDropHandlerCallback
      }
    });
    toolbarService.addButtons([{
      // A button for loading tracked, SR measurements.
      // Note that the command run is registered in TrackedMeasurementsContext
      // because it must be bound to a React context's data.
      id: 'loadSRMeasurements',
      component: props => /*#__PURE__*/react.createElement(ui_next_src/* ViewportActionButton */.N8H, props, i18n_src/* default */.A.t('Common:LOAD')),
      props: {
        commands: ['loadTrackedSRMeasurements']
      }
    }], true // replace the button if it is already defined
    );
  },
  getCustomizationModule: getCustomizationModule
};
/* harmony default export */ const measurement_tracking_src = (measurementTrackingExtension);


/***/ })

}]);