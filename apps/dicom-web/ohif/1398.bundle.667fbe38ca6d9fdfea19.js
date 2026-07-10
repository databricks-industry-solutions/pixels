"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[1398],{

/***/ 22826
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AP: () => (/* binding */ getActiveEcgViewport),
/* harmony export */   G7: () => (/* binding */ unregisterEcgViewport),
/* harmony export */   KF: () => (/* binding */ getEcgViewport),
/* harmony export */   xP: () => (/* binding */ registerEcgViewport)
/* harmony export */ });
/**
 * Bridge between an `OHIFDicomECGViewport` instance and code outside the
 * viewport's React tree (toolbar buttons, command modules). The viewport
 * publishes a stable API on mount; toolbar commands pick it up via the
 * active viewport id.
 *
 * Each method reads from the viewport's latest state via refs, so the
 * caller doesn't have to worry about stale closures even though the API
 * object itself is registered once at mount-time.
 */

const instances = new Map();
function registerEcgViewport(viewportId, api) {
  if (!viewportId) return;
  instances.set(viewportId, api);
}
function unregisterEcgViewport(viewportId) {
  if (!viewportId) return;
  instances.delete(viewportId);
}
function getEcgViewport(viewportId) {
  if (!viewportId) return undefined;
  return instances.get(viewportId);
}

/**
 * Convenience: look up the API for the active viewport reported by the
 * `viewportGridService`. Returns `undefined` when no viewport is active
 * or when the active viewport isn't a registered ECG viewport (i.e. the
 * caller should treat the toolbar action as a no-op).
 */
function getActiveEcgViewport(viewportGridService) {
  if (!viewportGridService?.getState) return undefined;
  const {
    activeViewportId
  } = viewportGridService.getState() ?? {};
  if (!activeViewportId) return undefined;
  return getEcgViewport(activeViewportId);
}

/***/ },

/***/ 21398
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ dicom_ecg_src)
});

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
;// ../../../../../../../plugins/ohifv3/extensions/dicom-ecg/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/extension-dicom-ecg"}');
;// ../../../../../../../plugins/ohifv3/extensions/dicom-ecg/src/id.js

const id = package_namespaceObject.UU;
const SOPClassHandlerName = 'dicom-ecg';
const SOPClassHandlerId = `${id}.sopClassHandlerModule.${SOPClassHandlerName}`;

// EXTERNAL MODULE: ../../core/src/index.ts + 69 modules
var src = __webpack_require__(42356);
// EXTERNAL MODULE: ../../i18n/src/index.js + 286 modules
var i18n_src = __webpack_require__(89010);
;// ../../../../../../../plugins/ohifv3/extensions/dicom-ecg/src/getSopClassHandlerModule.js




/**
 * SOP Class UIDs for DICOM ECG / waveform storage that this extension knows how
 * to render. See PS3.4 B.5 and PS3.6 Annex A for the official list.
 */
const SOP_CLASS_UIDS = {
  TwelveLeadECGWaveformStorage: '1.2.840.10008.5.1.4.1.1.9.1.1',
  GeneralECGWaveformStorage: '1.2.840.10008.5.1.4.1.1.9.1.2',
  AmbulatoryECGWaveformStorage: '1.2.840.10008.5.1.4.1.1.9.1.3',
  HemodynamicWaveformStorage: '1.2.840.10008.5.1.4.1.1.9.2.1',
  CardiacElectrophysiologyWaveformStorage: '1.2.840.10008.5.1.4.1.1.9.3.1'
};
const sopClassUids = Object.values(SOP_CLASS_UIDS);
const _getDisplaySetsFromSeries = (instances, servicesManager, extensionManager) => {
  return instances.map(instance => {
    const {
      Modality,
      SOPInstanceUID,
      SOPClassUID,
      SeriesDescription = 'ECG',
      SeriesNumber,
      SeriesDate,
      SeriesTime,
      ContentDate,
      ContentTime,
      SeriesInstanceUID,
      StudyInstanceUID
    } = instance;
    return {
      Modality: Modality || 'ECG',
      displaySetInstanceUID: src.utils.guid(),
      SeriesDescription,
      SeriesNumber,
      SeriesDate: SeriesDate || ContentDate,
      SeriesTime: SeriesTime || ContentTime,
      SOPInstanceUID,
      SOPClassUID,
      SeriesInstanceUID,
      StudyInstanceUID,
      SOPClassHandlerId: SOPClassHandlerId,
      referencedImages: null,
      measurements: null,
      instances: [instance],
      thumbnailSrc: null,
      isDerivedDisplaySet: true,
      isLoaded: false,
      sopClassUids,
      numImageFrames: 0,
      numInstances: 1,
      instance,
      // OHIF uses these to decide what controls to show; ECG is non-image.
      supportsWindowLevel: false,
      label: SeriesDescription || `${i18n_src/* default */.A.t('Series')} ${SeriesNumber} - ${i18n_src/* default */.A.t(Modality || 'ECG')}`
    };
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
    name: SOPClassHandlerName,
    sopClassUids,
    getDisplaySetsFromSeries
  }];
}
// EXTERNAL MODULE: ../../../../../../../plugins/ohifv3/extensions/dicom-ecg/src/ecgViewportRegistry.ts
var ecgViewportRegistry = __webpack_require__(22826);
;// ../../../../../../../plugins/ohifv3/extensions/dicom-ecg/src/components/EcgExportDialog.tsx

/**
 * Modal opened by our `showDownloadViewportModal` override when the
 * active viewport is an ECG viewport. Replaces the (otherwise
 * non-functional for ECG) cornerstone download form. Each button
 * invokes one of the internal export commands and then closes the
 * modal.
 */
function EcgExportDialog({
  commandsManager,
  uiModalService
}) {
  const close = () => uiModalService?.hide?.();
  const dispatch = commandName => {
    commandsManager?.run?.(commandName);
    close();
  };
  const buttonClass = 'inline-flex items-center justify-center rounded px-4 py-3 text-sm font-medium ' + 'bg-primary-main text-white hover:bg-primary-active focus:outline-none ' + 'focus:ring-2 focus:ring-primary-light/60 transition-colors min-w-[120px]';
  return /*#__PURE__*/react.createElement("div", {
    className: "text-foreground flex flex-col gap-4 p-2"
  }, /*#__PURE__*/react.createElement("p", {
    className: "text-sm"
  }, "Choose how you want to save the current ECG view."), /*#__PURE__*/react.createElement("div", {
    className: "grid grid-cols-3 gap-2"
  }, /*#__PURE__*/react.createElement("button", {
    type: "button",
    className: buttonClass,
    onClick: () => dispatch('exportEcgPng')
  }, "PNG image"), /*#__PURE__*/react.createElement("button", {
    type: "button",
    className: buttonClass,
    onClick: () => dispatch('exportEcgJpeg')
  }, "JPEG image"), /*#__PURE__*/react.createElement("button", {
    type: "button",
    className: buttonClass,
    onClick: () => dispatch('exportEcgPdf')
  }, "PDF report")), /*#__PURE__*/react.createElement("p", {
    className: "text-foreground/70 text-xs"
  }, "PNG and JPEG download a snapshot of the ECG chart with measurements overlaid. PDF opens a print-ready page with patient + study metadata - use the browser's \"Save as PDF\" option in the print dialog to file it."));
}
;// ../../../../../../../plugins/ohifv3/extensions/dicom-ecg/src/getCommandsModule.ts


/**
 * Maps a Cornerstone toolbar button id (used by `setToolActiveToolbar`
 * when the OHIF top toolbar dispatches Pan / Zoom) to the equivalent
 * in-viewport ECG tool. We piggyback on the existing Pan / Zoom toolbar
 * buttons instead of shipping ECG-specific ones, so the user has a single
 * Pan + Zoom affordance that does the right thing on whichever viewport
 * is active.
 */
const CORNERSTONE_TOOLBAR_TO_ECG_TOOL = {
  Pan: 'pan',
  Zoom: 'zoom'
};

/**
 * The dicom-ecg extension registers its commands under a brand-new `ECG`
 * commands context. Because OHIF's `CommandsManager.contextOrder` is
 * traversed newest-first, any command registered here will SHADOW the
 * cornerstone extension's same-named command when `commandsManager.run`
 * is called without an explicit context.
 *
 * That's how a single physical button - the OHIF header's Undo / Redo,
 * the Reset entry in the MoreTools popout, the Capture button in the
 * primary section - can do the right thing on both ECG and cornerstone
 * viewports without us having to ship duplicate "ECG-only" buttons:
 *
 *   1. The button click triggers `commandsManager.run('undo')` (or
 *      `redo` / `resetViewport` / `showDownloadViewportModal`).
 *   2. CommandsManager finds OUR override first because the `ECG`
 *      context is created after `CORNERSTONE`.
 *   3. The override checks if the active viewport is an ECG viewport.
 *      If it is, it dispatches into the active `OHIFDicomECGViewport`
 *      via the `ecgViewportRegistry` singleton.
 *   4. Otherwise, it explicitly delegates to the cornerstone
 *      implementation by passing the `'CORNERSTONE'` context to
 *      `runCommand` - so non-ECG viewports keep their existing
 *      behaviour byte-for-byte.
 *
 * The `setToolActiveToolbar` override is what makes the cornerstone
 * Pan and Zoom toolbar buttons usable on ECG viewports: those buttons
 * share a single `setToolActiveToolbar` command, and our override
 * detects when the active viewport is ECG and translates the click
 * into a `setTool('pan' | 'zoom')` call on the ECG viewport (with the
 * same second-click-toggles-off behaviour as the in-viewport caliper
 * buttons) instead of trying to activate a cornerstone tool group that
 * doesn't exist for the ECG viewport.
 *
 * `setEcgTool` and the three internal `exportEcg*` commands are NOT
 * overrides - they only exist for ECG and are dispatched from the
 * EcgTools dropdown / EcgExportDialog respectively.
 */
function getCommandsModule({
  servicesManager,
  commandsManager
}) {
  const {
    viewportGridService,
    uiModalService
  } = servicesManager.services;
  const delegateToCornerstone = (commandName, options = {}) => {
    commandsManager?.runCommand?.(commandName, options, 'CORNERSTONE');
  };
  const actions = {
    /**
     * Activate one of the in-viewport ECG calipers. Clicking the button
     * for the already-active tool toggles back to `pointer`, matching
     * how Cornerstone3D's toolbar buttons behave.
     */
    setEcgTool: ({
      tool
    }) => {
      const api = (0,ecgViewportRegistry/* getActiveEcgViewport */.AP)(viewportGridService);
      if (!api) return;
      const next = api.getTool() === tool ? 'pointer' : tool;
      api.setTool(next);
    },
    /**
     * Override of the cornerstone `setToolActiveToolbar` command. This
     * is what the OHIF top-toolbar Pan and Zoom buttons dispatch when
     * clicked (the buttons' `commands` is the shared
     * `setToolActiveToolbar` object). On a cornerstone viewport we
     * delegate so the cornerstone tool group activates the right tool.
     * On an ECG viewport we map the button id (`'Pan'` / `'Zoom'`) to
     * the matching ECG tool and route through `setEcgTool`-style toggle
     * logic, so clicking the same button twice returns to the pointer
     * tool - same behaviour as the in-viewport caliper buttons.
     */
    setToolActiveToolbar: (options = {}) => {
      const api = (0,ecgViewportRegistry/* getActiveEcgViewport */.AP)(viewportGridService);
      if (!api) {
        delegateToCornerstone('setToolActiveToolbar', options);
        return;
      }
      // The toolbar layer passes the clicked button's id via `itemId`;
      // `toolName` may be undefined for plain tool buttons. We accept
      // either so this override also works if someone wires up an
      // explicit toolName via commandOptions in the future.
      const requested = options?.toolName ?? options?.itemId ?? options?.value ?? '';
      const ecgTool = CORNERSTONE_TOOLBAR_TO_ECG_TOOL[requested];
      if (!ecgTool) {
        // Not a button we understand on the ECG side (e.g. a future
        // Crosshairs button). Fall through to cornerstone so we don't
        // silently eat the click.
        delegateToCornerstone('setToolActiveToolbar', options);
        return;
      }
      const next = api.getTool() === ecgTool ? 'pointer' : ecgTool;
      api.setTool(next);
    },
    /**
     * Override of the cornerstone `undo` command. Pops the most recent
     * ECG measurement when the active viewport is an ECG viewport;
     * falls through to the cornerstone history-memo otherwise.
     */
    undo: () => {
      const api = (0,ecgViewportRegistry/* getActiveEcgViewport */.AP)(viewportGridService);
      if (api) {
        api.undoMeasurement();
        return;
      }
      delegateToCornerstone('undo');
    },
    /**
     * Override of the cornerstone `redo` command. Re-applies the last
     * undone ECG measurement when the active viewport is an ECG
     * viewport; falls through to the cornerstone history-memo
     * otherwise.
     */
    redo: () => {
      const api = (0,ecgViewportRegistry/* getActiveEcgViewport */.AP)(viewportGridService);
      if (api) {
        api.redoMeasurement();
        return;
      }
      delegateToCornerstone('redo');
    },
    /**
     * Override of the cornerstone `resetViewport` command. On an ECG
     * viewport this restores default speed/gain/zoom/lead-visibility
     * AND clears every measurement (mirrors the in-viewport reset
     * behaviour). On any other viewport we delegate so the built-in
     * Reset button keeps its existing behaviour.
     */
    resetViewport: () => {
      const api = (0,ecgViewportRegistry/* getActiveEcgViewport */.AP)(viewportGridService);
      if (api) {
        api.resetView();
        return;
      }
      delegateToCornerstone('resetViewport');
    },
    /**
     * Override of the cornerstone `showDownloadViewportModal` command
     * (the one wired up to the existing Capture button). Cornerstone's
     * implementation refuses to download non-cornerstone viewports;
     * here we open a small ECG-flavoured export dialog (PNG / JPEG /
     * PDF) when the active viewport is an ECG viewport, and fall
     * through to the cornerstone modal otherwise.
     */
    showDownloadViewportModal: () => {
      const api = (0,ecgViewportRegistry/* getActiveEcgViewport */.AP)(viewportGridService);
      if (!api) {
        delegateToCornerstone('showDownloadViewportModal');
        return;
      }
      if (!uiModalService) {
        return;
      }
      uiModalService.show({
        content: EcgExportDialog,
        title: 'Save ECG view',
        contentProps: {
          commandsManager,
          uiModalService
        },
        containerClassName: 'max-w-md p-2'
      });
    },
    // Internal commands invoked by EcgExportDialog. Intentionally not
    // wired to any toolbar button - the user goes through the Capture
    // button, which opens the dialog above.
    exportEcgPng: () => {
      (0,ecgViewportRegistry/* getActiveEcgViewport */.AP)(viewportGridService)?.exportImage('png');
    },
    exportEcgJpeg: () => {
      (0,ecgViewportRegistry/* getActiveEcgViewport */.AP)(viewportGridService)?.exportImage('jpeg');
    },
    exportEcgPdf: () => {
      (0,ecgViewportRegistry/* getActiveEcgViewport */.AP)(viewportGridService)?.exportPdf();
    }
  };
  return {
    actions,
    definitions: {
      setEcgTool: {
        commandFn: actions.setEcgTool
      },
      setToolActiveToolbar: {
        commandFn: actions.setToolActiveToolbar
      },
      undo: {
        commandFn: actions.undo
      },
      redo: {
        commandFn: actions.redo
      },
      resetViewport: {
        commandFn: actions.resetViewport
      },
      showDownloadViewportModal: {
        commandFn: actions.showDownloadViewportModal
      },
      exportEcgPng: {
        commandFn: actions.exportEcgPng
      },
      exportEcgJpeg: {
        commandFn: actions.exportEcgJpeg
      },
      exportEcgPdf: {
        commandFn: actions.exportEcgPdf
      }
    },
    // NOTE: a brand-new context (not 'CORNERSTONE') is critical here:
    // it makes our `undo` / `redo` / `resetViewport` /
    // `showDownloadViewportModal` SHADOW the cornerstone versions when
    // commands are dispatched without an explicit context, while still
    // letting us delegate back to cornerstone via an explicit context
    // arg in `delegateToCornerstone`.
    defaultContext: 'ECG'
  };
}
;// ../../../../../../../plugins/ohifv3/extensions/dicom-ecg/src/getToolbarModule.ts


const ECG_NOT_ACTIVE = {
  disabled: true,
  disabledText: 'Open an ECG to use this tool'
};
const CORNERSTONE_NOT_AVAILABLE = {
  disabled: true,
  disabledText: 'Tool not available for this viewport'
};

/**
 * Returns true when the viewport identified by `viewportId` currently
 * shows an ECG display set (via our SOP class handler). Used by both
 * evaluators below as the "should this ECG button be enabled?" gate.
 */
function isEcgViewport(viewportId, viewportGridService, displaySetService) {
  if (!viewportId) return false;
  const displaySetUIDs = viewportGridService?.getDisplaySetsUIDsForViewport?.(viewportId) ?? [];
  if (!displaySetUIDs.length) return false;
  return displaySetUIDs.some(uid => {
    const ds = displaySetService?.getDisplaySetByUID?.(uid);
    return ds?.SOPClassHandlerId === SOPClassHandlerId;
  });
}

/**
 * Cornerstone toolbar buttons such as Pan / Zoom are tied to a
 * Cornerstone3D tool group. The ECG viewport has no tool group, so the
 * upstream `evaluate.cornerstoneTool` evaluator (after our hide-when-
 * disabled patch) hides those buttons entirely on ECG viewports.
 *
 * For Pan and Zoom specifically we want the OPPOSITE: the buttons should
 * stay visible on ECG viewports too, so the user can click and drag on the
 * ECG to pan/zoom (mirroring how the same button works on cornerstone
 * viewports). We map the button id to an ECG tool when the active
 * viewport is an ECG viewport, and otherwise fall back to the standard
 * cornerstone tool-group inspection.
 */
const CORNERSTONE_BUTTON_TO_ECG_TOOL = {
  Pan: 'pan',
  Zoom: 'zoom'
};

/**
 * Toolbar module: registers the evaluators used by the basic-mode ECG
 * tool buttons.
 *
 * - `evaluate.ecgViewport`: enables a button (e.g. Undo, Clear, Export)
 *   only when the active viewport is an ECG viewport.
 * - `evaluate.ecgTool`: same gate, plus an `isActive` flag so the button
 *   highlights when its tool is the currently selected ECG tool. The
 *   target tool is read from `button.props.commands.commandOptions.tool`,
 *   which is how the basic-mode toolbar config wires individual caliper
 *   buttons to the shared `setEcgTool` command.
 * - `evaluate.cornerstoneOrEcgTool`: drop-in replacement for the upstream
 *   `evaluate.cornerstoneTool` for buttons that should also work on ECG
 *   viewports (Pan, Zoom). On ECG viewports it reports the matching ECG
 *   tool's active state; on every other viewport it falls back to the
 *   tool-group logic so the button behaves identically to the upstream
 *   button on cornerstone viewports.
 */
function getToolbarModule({
  servicesManager
}) {
  const {
    viewportGridService,
    displaySetService,
    toolGroupService,
    toolbarService
  } = servicesManager.services;
  return [{
    name: 'evaluate.ecgViewport',
    evaluate: ({
      viewportId
    }) => {
      if (!isEcgViewport(viewportId, viewportGridService, displaySetService)) {
        return ECG_NOT_ACTIVE;
      }
      return {
        disabled: false
      };
    }
  }, {
    name: 'evaluate.ecgTool',
    evaluate: ({
      viewportId,
      button
    }) => {
      if (!isEcgViewport(viewportId, viewportGridService, displaySetService)) {
        return ECG_NOT_ACTIVE;
      }

      // Pull the target tool out of the button's command options. The
      // basic-mode toolbar config encodes which caliper this button
      // represents there (e.g. `tool: 'time-caliper'`).
      const commands = button?.props?.commands;
      const opts = Array.isArray(commands) ? commands[0]?.commandOptions : commands?.commandOptions;
      const targetTool = opts?.tool;
      const api = (0,ecgViewportRegistry/* getEcgViewport */.KF)(viewportId);
      const isActive = !!targetTool && api?.getTool?.() === targetTool;
      return {
        disabled: false,
        isActive
      };
    }
  }, {
    name: 'evaluate.cornerstoneOrEcgTool',
    evaluate: ({
      viewportId,
      button,
      disabledText
    }) => {
      // ECG path: short-circuit so the button stays visible + active-
      // highlight tracks the ECG-side tool state. The override of
      // `setToolActiveToolbar` in getCommandsModule.ts translates the
      // click into a `setTool('pan')` / `setTool('zoom')` call on the
      // active ECG viewport.
      if (isEcgViewport(viewportId, viewportGridService, displaySetService)) {
        const ecgTarget = CORNERSTONE_BUTTON_TO_ECG_TOOL[button?.id];
        const api = (0,ecgViewportRegistry/* getEcgViewport */.KF)(viewportId);
        const isActive = !!ecgTarget && api?.getTool?.() === ecgTarget;
        return {
          disabled: false,
          isActive
        };
      }

      // Cornerstone path: mirror the upstream `evaluate.cornerstoneTool`
      // evaluator (extensions/cornerstone/src/getToolbarModule.tsx) so
      // the button keeps its existing enabled / active / disabled
      // behaviour on every non-ECG viewport. We can't simply forward to
      // the upstream evaluator because the toolbar service exposes them
      // through a private map; replicating the small amount of logic
      // here is safer than reaching into that internal state.
      const toolGroup = toolGroupService?.getToolGroupForViewport?.(viewportId);
      if (!toolGroup) {
        return {
          ...CORNERSTONE_NOT_AVAILABLE,
          disabledText: disabledText ?? CORNERSTONE_NOT_AVAILABLE.disabledText
        };
      }
      const toolName = toolbarService?.getToolNameForButton?.(button);
      if (!toolName || !toolGroup.hasTool?.(toolName)) {
        return {
          ...CORNERSTONE_NOT_AVAILABLE,
          disabledText: disabledText ?? CORNERSTONE_NOT_AVAILABLE.disabledText
        };
      }
      const isPrimaryActive = toolGroup.getActivePrimaryMouseButtonTool?.() === toolName;
      return {
        disabled: false,
        isActive: isPrimaryActive
      };
    }
  }];
}
;// ../../../../../../../plugins/ohifv3/extensions/dicom-ecg/src/index.tsx
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }





const Component = /*#__PURE__*/react.lazy(() => {
  return Promise.all(/* import() */[__webpack_require__.e(3562), __webpack_require__.e(3910)]).then(__webpack_require__.bind(__webpack_require__, 3910));
});
const OHIFDicomECGViewport = props => {
  return /*#__PURE__*/react.createElement(react.Suspense, {
    fallback: /*#__PURE__*/react.createElement("div", null, "Loading ECG\u2026")
  }, /*#__PURE__*/react.createElement(Component, props));
};

/**
 * @ohif/extension-dicom-ecg
 *
 * Registers a SOPClassHandler + Viewport that can render DICOM ECG waveform
 * instances (12-Lead, General, Ambulatory, Hemodynamic, Cardiac EP) using the
 * ecg-dicom-web-viewer library. Plugged into the basic mode by patch so that
 * ECG series show up automatically in the standard viewer.
 */
const dicomECGExtension = {
  id: id,
  getViewportModule({
    servicesManager,
    extensionManager
  }) {
    const ExtendedOHIFDicomECGViewport = props => {
      return /*#__PURE__*/react.createElement(OHIFDicomECGViewport, _extends({
        servicesManager: servicesManager,
        extensionManager: extensionManager
      }, props));
    };
    return [{
      name: 'dicom-ecg',
      component: ExtendedOHIFDicomECGViewport
    }];
  },
  getSopClassHandlerModule: getSopClassHandlerModule,
  getCommandsModule: getCommandsModule,
  getToolbarModule: getToolbarModule
};
/* harmony default export */ const dicom_ecg_src = (dicomECGExtension);

/***/ }

}]);