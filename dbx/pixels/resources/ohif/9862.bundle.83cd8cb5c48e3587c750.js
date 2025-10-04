"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[9862],{

/***/ 49862:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(86326);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(97598);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ohif_ui_next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2836);
/* harmony import */ var _cornerstonejs_tools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4667);
/* harmony import */ var _getContextModule__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(55844);
/* harmony import */ var _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(15327);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(99993);
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }








function TrackedCornerstoneViewport(props) {
  const {
    displaySets,
    viewportId,
    servicesManager,
    extensionManager
  } = props;
  const {
    measurementService,
    cornerstoneViewportService,
    viewportGridService,
    viewportActionCornersService
  } = servicesManager.services;

  // Todo: handling more than one displaySet on the same viewport
  const displaySet = displaySets[0];
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_6__/* .useTranslation */ .Bd)('Common');
  const [viewportGrid] = (0,_ohif_ui_next__WEBPACK_IMPORTED_MODULE_2__/* .useViewportGrid */ .ihW)();
  const {
    activeViewportId
  } = viewportGrid;
  const [trackedMeasurements, sendTrackedMeasurementsEvent] = (0,_getContextModule__WEBPACK_IMPORTED_MODULE_4__/* .useTrackedMeasurements */ .B)();
  const [isTracked, setIsTracked] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [trackedMeasurementUID, setTrackedMeasurementUID] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [viewportElem, setViewportElem] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const {
    trackedSeries
  } = trackedMeasurements.context;
  const {
    SeriesInstanceUID
  } = displaySet;
  const updateIsTracked = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
    if (viewport instanceof _cornerstonejs_core__WEBPACK_IMPORTED_MODULE_5__.BaseVolumeViewport) {
      // A current image id will only exist for volume viewports that can have measurements tracked.
      // Typically these are those volume viewports for the series of acquisition.
      const currentImageId = viewport?.getCurrentImageId();
      if (!currentImageId) {
        if (isTracked) {
          setIsTracked(false);
        }
        return;
      }
    }
    if (trackedSeries.includes(SeriesInstanceUID) !== isTracked) {
      setIsTracked(!isTracked);
    }
  }, [isTracked, trackedMeasurements, viewportId, SeriesInstanceUID]);
  const onElementEnabled = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(evt => {
    if (evt.detail.element !== viewportElem) {
      // The VOLUME_VIEWPORT_NEW_VOLUME event allows updateIsTracked to reliably fetch the image id for a volume viewport.
      evt.detail.element?.addEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_5__.Enums.Events.VOLUME_VIEWPORT_NEW_VOLUME, updateIsTracked);
      setViewportElem(evt.detail.element);
    }
  }, [updateIsTracked, viewportElem]);
  const onElementDisabled = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    viewportElem?.removeEventListener(_cornerstonejs_core__WEBPACK_IMPORTED_MODULE_5__.Enums.Events.VOLUME_VIEWPORT_NEW_VOLUME, updateIsTracked);
  }, [updateIsTracked, viewportElem]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(updateIsTracked, [updateIsTracked]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const {
      unsubscribe
    } = cornerstoneViewportService.subscribe(cornerstoneViewportService.EVENTS.VIEWPORT_DATA_CHANGED, props => {
      if (props.viewportId !== viewportId) {
        return;
      }
      updateIsTracked();
    });
    return () => {
      unsubscribe();
    };
  }, [updateIsTracked, viewportId]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isTracked) {
      _cornerstonejs_tools__WEBPACK_IMPORTED_MODULE_3__.annotation.config.style.setViewportToolStyles(viewportId, {
        ReferenceLines: {
          lineDash: '4,4'
        },
        global: {
          lineDash: ''
        }
      });
      cornerstoneViewportService.getRenderingEngine().renderViewport(viewportId);
      return;
    }
    _cornerstonejs_tools__WEBPACK_IMPORTED_MODULE_3__.annotation.config.style.setViewportToolStyles(viewportId, {
      global: {
        lineDash: '4,4'
      }
    });
    cornerstoneViewportService.getRenderingEngine().renderViewport(viewportId);
    return () => {
      _cornerstonejs_tools__WEBPACK_IMPORTED_MODULE_3__.annotation.config.style.setViewportToolStyles(viewportId, {});
    };
  }, [isTracked]);

  /**
   * The effect for listening to measurement service measurement added events
   * and in turn firing an event to update the measurement tracking state machine.
   * The TrackedCornerstoneViewport is the best place for this because when
   * a measurement is added, at least one TrackedCornerstoneViewport will be in
   * the DOM and thus can react to the events fired.
   */
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const added = measurementService.EVENTS.MEASUREMENT_ADDED;
    const addedRaw = measurementService.EVENTS.RAW_MEASUREMENT_ADDED;
    const subscriptions = [];
    [added, addedRaw].forEach(evt => {
      subscriptions.push(measurementService.subscribe(evt, ({
        source,
        measurement
      }) => {
        const {
          activeViewportId
        } = viewportGridService.getState();

        // Each TrackedCornerstoneViewport receives the MeasurementService's events.
        // Only send the tracked measurements event for the active viewport to avoid
        // sending it more than once.
        if (viewportId === activeViewportId) {
          const {
            referenceStudyUID: StudyInstanceUID,
            referenceSeriesUID: SeriesInstanceUID,
            uid: measurementId,
            toolName
          } = measurement;
          sendTrackedMeasurementsEvent('SET_DIRTY', {
            SeriesInstanceUID
          });
          sendTrackedMeasurementsEvent('TRACK_SERIES', {
            viewportId,
            StudyInstanceUID,
            SeriesInstanceUID,
            measurementId,
            toolName
          });
        }
      }).unsubscribe);
    });
    return () => {
      subscriptions.forEach(unsub => {
        unsub();
      });
    };
  }, [measurementService, sendTrackedMeasurementsEvent, viewportId, viewportGridService]);
  const switchMeasurement = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(direction => {
    const newTrackedMeasurementUID = _getNextMeasurementUID(direction, servicesManager, trackedMeasurementUID, trackedMeasurements);
    if (!newTrackedMeasurementUID) {
      return;
    }
    setTrackedMeasurementUID(newTrackedMeasurementUID);
    measurementService.jumpToMeasurement(viewportId, newTrackedMeasurementUID);
  }, [measurementService, servicesManager, trackedMeasurementUID, trackedMeasurements, viewportId]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const statusComponent = _getStatusComponent(isTracked, t);
    const arrowsComponent = _getArrowsComponent(isTracked, switchMeasurement, viewportId === activeViewportId);
    viewportActionCornersService.addComponents([{
      viewportId,
      id: 'viewportStatusComponent',
      component: statusComponent,
      indexPriority: -100,
      location: viewportActionCornersService.LOCATIONS.topLeft
    }, {
      viewportId,
      id: 'viewportActionArrowsComponent',
      component: arrowsComponent,
      indexPriority: 0,
      location: viewportActionCornersService.LOCATIONS.topRight
    }]);
  }, [activeViewportId, isTracked, switchMeasurement, viewportActionCornersService, viewportId]);
  const getCornerstoneViewport = () => {
    const {
      component: Component
    } = extensionManager.getModuleEntry('@ohif/extension-cornerstone.viewportModule.cornerstone');
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component, _extends({}, props, {
      onElementEnabled: evt => {
        props.onElementEnabled?.(evt);
        onElementEnabled(evt);
      },
      onElementDisabled: onElementDisabled
    }));
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "relative flex h-full w-full flex-row overflow-hidden"
  }, getCornerstoneViewport());
}
TrackedCornerstoneViewport.propTypes = {
  displaySets: prop_types__WEBPACK_IMPORTED_MODULE_1___default().arrayOf((prop_types__WEBPACK_IMPORTED_MODULE_1___default().object).isRequired).isRequired,
  viewportId: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string).isRequired,
  dataSource: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object),
  children: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().node)
};
function _getNextMeasurementUID(direction, servicesManager, trackedMeasurementId, trackedMeasurements) {
  const {
    measurementService,
    viewportGridService
  } = servicesManager.services;
  const measurements = measurementService.getMeasurements();
  const {
    activeViewportId,
    viewports
  } = viewportGridService.getState();
  const {
    displaySetInstanceUIDs: activeViewportDisplaySetInstanceUIDs
  } = viewports.get(activeViewportId);
  const {
    trackedSeries
  } = trackedMeasurements.context;

  // Get the potentially trackable measurements for the series of the
  // active viewport.
  // The measurements to jump between are the same
  // regardless if this series is tracked or not.

  const filteredMeasurements = measurements.filter(m => trackedSeries.includes(m.referenceSeriesUID) && activeViewportDisplaySetInstanceUIDs.includes(m.displaySetInstanceUID));
  if (!filteredMeasurements.length) {
    // No measurements on this series.
    return;
  }
  const measurementCount = filteredMeasurements.length;
  const uids = filteredMeasurements.map(fm => fm.uid);
  let measurementIndex = uids.findIndex(uid => uid === trackedMeasurementId);
  if (measurementIndex === -1) {
    // Not tracking a measurement, or previous measurement now deleted, revert to 0.
    measurementIndex = 0;
  } else {
    measurementIndex += direction;
    if (measurementIndex < 0) {
      measurementIndex = measurementCount - 1;
    } else if (measurementIndex === measurementCount) {
      measurementIndex = 0;
    }
  }
  const newTrackedMeasurementId = uids[measurementIndex];
  return newTrackedMeasurementId;
}
const _getArrowsComponent = (isTracked, switchMeasurement, isActiveViewport) => {
  if (!isTracked) {
    return null;
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_2__/* .ViewportActionArrows */ .$IX, {
    onArrowsClick: direction => switchMeasurement(direction),
    className: isActiveViewport ? 'visible' : 'invisible group-hover/pane:visible'
  });
};
function _getStatusComponent(isTracked, t) {
  if (!isTracked) {
    return null;
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_2__/* .Tooltip */ .m_M, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_2__/* .TooltipTrigger */ .k$k, {
    asChild: true
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_2__/* .Icons */ .FI1.StatusTracking, {
    className: "text-muted-foreground mt-0.5 ml-0.5"
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ohif_ui_next__WEBPACK_IMPORTED_MODULE_2__/* .TooltipContent */ .ZIw, {
    align: "start",
    side: "bottom"
  }, isTracked ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, t('Series is tracked and can be viewed in the measurement panel')) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, t('Measurements for untracked series will not be shown in the measurements panel'))));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TrackedCornerstoneViewport);

/***/ })

}]);