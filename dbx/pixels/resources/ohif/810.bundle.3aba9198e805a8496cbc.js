"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([[810,8402],{

/***/ 57289:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ tmtv_src)
});

;// ../../../extensions/tmtv/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/extension-tmtv"}');
;// ../../../extensions/tmtv/src/id.js

const id = package_namespaceObject.UU;

;// ../../../extensions/tmtv/src/utils/hpViewports.ts
// Common sync group configurations
const cameraPositionSync = id => ({
  type: 'cameraPosition',
  id,
  source: true,
  target: true
});
const hydrateSegSync = {
  type: 'hydrateseg',
  id: 'sameFORId',
  source: true,
  target: true,
  options: {
    matchingRules: ['sameFOR']
  }
};
const ctAXIAL = {
  viewportOptions: {
    viewportId: 'ctAXIAL',
    viewportType: 'volume',
    orientation: 'axial',
    toolGroupId: 'ctToolGroup',
    initialImageOptions: {
      // index: 5,
      preset: 'first' // 'first', 'last', 'middle'
    },
    syncGroups: [cameraPositionSync('axialSync'), {
      type: 'voi',
      id: 'ctWLSync',
      source: true,
      target: true,
      options: {
        syncColormap: true
      }
    }, hydrateSegSync]
  },
  displaySets: [{
    id: 'ctDisplaySet'
  }]
};
const ctSAGITTAL = {
  viewportOptions: {
    viewportId: 'ctSAGITTAL',
    viewportType: 'volume',
    orientation: 'sagittal',
    toolGroupId: 'ctToolGroup',
    syncGroups: [cameraPositionSync('sagittalSync'), {
      type: 'voi',
      id: 'ctWLSync',
      source: true,
      target: true,
      options: {
        syncColormap: true
      }
    }, hydrateSegSync]
  },
  displaySets: [{
    id: 'ctDisplaySet'
  }]
};
const ctCORONAL = {
  viewportOptions: {
    viewportId: 'ctCORONAL',
    viewportType: 'volume',
    orientation: 'coronal',
    toolGroupId: 'ctToolGroup',
    syncGroups: [cameraPositionSync('coronalSync'), {
      type: 'voi',
      id: 'ctWLSync',
      source: true,
      target: true,
      options: {
        syncColormap: true
      }
    }, hydrateSegSync]
  },
  displaySets: [{
    id: 'ctDisplaySet'
  }]
};
const ptAXIAL = {
  viewportOptions: {
    viewportId: 'ptAXIAL',
    viewportType: 'volume',
    background: [1, 1, 1],
    orientation: 'axial',
    toolGroupId: 'ptToolGroup',
    initialImageOptions: {
      // index: 5,
      preset: 'first' // 'first', 'last', 'middle'
    },
    syncGroups: [cameraPositionSync('axialSync'), {
      type: 'voi',
      id: 'ptWLSync',
      source: true,
      target: true,
      options: {
        syncColormap: true
      }
    }, {
      type: 'voi',
      id: 'ptFusionWLSync',
      source: true,
      target: false,
      options: {
        syncColormap: false,
        syncInvertState: false
      }
    }, hydrateSegSync]
  },
  displaySets: [{
    options: {
      voi: {
        custom: 'getPTVOIRange'
      },
      voiInverted: true
    },
    id: 'ptDisplaySet'
  }]
};
const ptSAGITTAL = {
  viewportOptions: {
    viewportId: 'ptSAGITTAL',
    viewportType: 'volume',
    orientation: 'sagittal',
    background: [1, 1, 1],
    toolGroupId: 'ptToolGroup',
    syncGroups: [cameraPositionSync('sagittalSync'), {
      type: 'voi',
      id: 'ptWLSync',
      source: true,
      target: true,
      options: {
        syncColormap: true
      }
    }, {
      type: 'voi',
      id: 'ptFusionWLSync',
      source: true,
      target: false,
      options: {
        syncColormap: false,
        syncInvertState: false
      }
    }, hydrateSegSync]
  },
  displaySets: [{
    options: {
      voi: {
        custom: 'getPTVOIRange'
      },
      voiInverted: true
    },
    id: 'ptDisplaySet'
  }]
};
const ptCORONAL = {
  viewportOptions: {
    viewportId: 'ptCORONAL',
    viewportType: 'volume',
    orientation: 'coronal',
    background: [1, 1, 1],
    toolGroupId: 'ptToolGroup',
    syncGroups: [cameraPositionSync('coronalSync'), {
      type: 'voi',
      id: 'ptWLSync',
      source: true,
      target: true,
      options: {
        syncColormap: true
      }
    }, {
      type: 'voi',
      id: 'ptFusionWLSync',
      source: true,
      target: false,
      options: {
        syncColormap: false,
        syncInvertState: false
      }
    }, hydrateSegSync]
  },
  displaySets: [{
    options: {
      voi: {
        custom: 'getPTVOIRange'
      },
      voiInverted: true
    },
    id: 'ptDisplaySet'
  }]
};
const fusionAXIAL = {
  viewportOptions: {
    viewportId: 'fusionAXIAL',
    viewportType: 'volume',
    orientation: 'axial',
    toolGroupId: 'fusionToolGroup',
    initialImageOptions: {
      // index: 5,
      preset: 'first' // 'first', 'last', 'middle'
    },
    syncGroups: [cameraPositionSync('axialSync'), {
      type: 'voi',
      id: 'ctWLSync',
      source: false,
      target: true
    }, {
      type: 'voi',
      id: 'fusionWLSync',
      source: true,
      target: true,
      options: {
        syncColormap: true
      }
    }, {
      type: 'voi',
      id: 'ptFusionWLSync',
      source: false,
      target: true,
      options: {
        syncColormap: false,
        syncInvertState: false
      }
    }, hydrateSegSync]
  },
  displaySets: [{
    id: 'ctDisplaySet'
  }, {
    id: 'ptDisplaySet',
    options: {
      colormap: {
        name: 'hsv',
        opacity: [{
          value: 0,
          opacity: 0
        }, {
          value: 0.1,
          opacity: 0.8
        }, {
          value: 1,
          opacity: 0.9
        }]
      },
      voi: {
        custom: 'getPTVOIRange'
      }
    }
  }]
};
const fusionSAGITTAL = {
  viewportOptions: {
    viewportId: 'fusionSAGITTAL',
    viewportType: 'volume',
    orientation: 'sagittal',
    toolGroupId: 'fusionToolGroup',
    // initialImageOptions: {
    //   index: 180,
    //   preset: 'middle', // 'first', 'last', 'middle'
    // },
    syncGroups: [cameraPositionSync('sagittalSync'), {
      type: 'voi',
      id: 'ctWLSync',
      source: false,
      target: true
    }, {
      type: 'voi',
      id: 'fusionWLSync',
      source: true,
      target: true,
      options: {
        syncColormap: true
      }
    }, {
      type: 'voi',
      id: 'ptFusionWLSync',
      source: false,
      target: true,
      options: {
        syncColormap: false,
        syncInvertState: false
      }
    }, hydrateSegSync]
  },
  displaySets: [{
    id: 'ctDisplaySet'
  }, {
    id: 'ptDisplaySet',
    options: {
      colormap: {
        name: 'hsv',
        opacity: [{
          value: 0,
          opacity: 0
        }, {
          value: 0.1,
          opacity: 0.8
        }, {
          value: 1,
          opacity: 0.9
        }]
      },
      voi: {
        custom: 'getPTVOIRange'
      }
    }
  }]
};
const fusionCORONAL = {
  viewportOptions: {
    viewportId: 'fusionCoronal',
    viewportType: 'volume',
    orientation: 'coronal',
    toolGroupId: 'fusionToolGroup',
    // initialImageOptions: {
    //   index: 180,
    //   preset: 'middle', // 'first', 'last', 'middle'
    // },
    syncGroups: [cameraPositionSync('coronalSync'), {
      type: 'voi',
      id: 'ctWLSync',
      source: false,
      target: true
    }, {
      type: 'voi',
      id: 'fusionWLSync',
      source: true,
      target: true,
      options: {
        syncColormap: true
      }
    }, {
      type: 'voi',
      id: 'ptFusionWLSync',
      source: false,
      target: true,
      options: {
        syncColormap: false,
        syncInvertState: false
      }
    }, hydrateSegSync]
  },
  displaySets: [{
    id: 'ctDisplaySet'
  }, {
    id: 'ptDisplaySet',
    options: {
      colormap: {
        name: 'hsv',
        opacity: [{
          value: 0,
          opacity: 0
        }, {
          value: 0.1,
          opacity: 0.8
        }, {
          value: 1,
          opacity: 0.9
        }]
      },
      voi: {
        custom: 'getPTVOIRange'
      }
    }
  }]
};
const mipSAGITTAL = {
  viewportOptions: {
    viewportId: 'mipSagittal',
    viewportType: 'volume',
    orientation: 'sagittal',
    background: [1, 1, 1],
    toolGroupId: 'mipToolGroup',
    syncGroups: [{
      type: 'voi',
      id: 'ptWLSync',
      source: true,
      target: true,
      options: {
        syncColormap: true
      }
    }, {
      type: 'voi',
      id: 'ptFusionWLSync',
      source: true,
      target: false,
      options: {
        syncColormap: false,
        syncInvertState: false
      }
    }, hydrateSegSync],
    // Custom props can be used to set custom properties which extensions
    // can react on.
    customViewportProps: {
      // We use viewportDisplay to filter the viewports which are displayed
      // in mip and we set the scrollbar according to their rotation index
      // in the cornerstone extension.
      hideOverlays: true
    }
  },
  displaySets: [{
    options: {
      blendMode: 'MIP',
      slabThickness: 'fullVolume',
      voi: {
        custom: 'getPTVOIRange'
      },
      voiInverted: true
    },
    id: 'ptDisplaySet'
  }]
};

;// ../../../extensions/tmtv/src/getHangingProtocolModule.ts


/**
 * represents a 3x4 viewport layout configuration. The layout displays CT axial, sagittal, and coronal
 * images in the first row, PT axial, sagittal, and coronal images in the second row, and fusion axial,
 * sagittal, and coronal images in the third row. The fourth column is fully spanned by a MIP sagittal
 * image, covering all three rows. It has synchronizers for windowLevel for all CT and PT images, and
 * also camera synchronizer for each orientation
 */
const stage1 = {
  name: 'default',
  id: 'default',
  viewportStructure: {
    layoutType: 'grid',
    properties: {
      rows: 3,
      columns: 4,
      layoutOptions: [{
        x: 0,
        y: 0,
        width: 1 / 4,
        height: 1 / 3
      }, {
        x: 1 / 4,
        y: 0,
        width: 1 / 4,
        height: 1 / 3
      }, {
        x: 2 / 4,
        y: 0,
        width: 1 / 4,
        height: 1 / 3
      }, {
        x: 0,
        y: 1 / 3,
        width: 1 / 4,
        height: 1 / 3
      }, {
        x: 1 / 4,
        y: 1 / 3,
        width: 1 / 4,
        height: 1 / 3
      }, {
        x: 2 / 4,
        y: 1 / 3,
        width: 1 / 4,
        height: 1 / 3
      }, {
        x: 0,
        y: 2 / 3,
        width: 1 / 4,
        height: 1 / 3
      }, {
        x: 1 / 4,
        y: 2 / 3,
        width: 1 / 4,
        height: 1 / 3
      }, {
        x: 2 / 4,
        y: 2 / 3,
        width: 1 / 4,
        height: 1 / 3
      }, {
        x: 3 / 4,
        y: 0,
        width: 1 / 4,
        height: 1
      }]
    }
  },
  viewports: [ctAXIAL, ctSAGITTAL, ctCORONAL, ptAXIAL, ptSAGITTAL, ptCORONAL, fusionAXIAL, fusionSAGITTAL, fusionCORONAL, mipSAGITTAL],
  createdDate: '2021-02-23T18:32:42.850Z'
};

/**
 * The layout displays CT axial image in the top-left viewport, fusion axial image
 * in the top-right viewport, PT axial image in the bottom-left viewport, and MIP
 * sagittal image in the bottom-right viewport. The layout follows a simple grid
 * pattern with 2 rows and 2 columns. It includes synchronizers as well.
 */
const stage2 = {
  name: 'Fusion 2x2',
  id: 'Fusion-2x2',
  viewportStructure: {
    layoutType: 'grid',
    properties: {
      rows: 2,
      columns: 2
    }
  },
  viewports: [ctAXIAL, fusionAXIAL, ptAXIAL, mipSAGITTAL]
};

/**
 * The top row displays CT images in axial, sagittal, and coronal orientations from
 * left to right, respectively. The bottom row displays PT images in axial, sagittal,
 * and coronal orientations from left to right, respectively.
 * The layout follows a simple grid pattern with 2 rows and 3 columns.
 * It includes synchronizers as well.
 */
const stage3 = {
  name: '2x3-layout',
  id: '2x3-layout',
  viewportStructure: {
    layoutType: 'grid',
    properties: {
      rows: 2,
      columns: 3
    }
  },
  viewports: [ctAXIAL, ctSAGITTAL, ctCORONAL, ptAXIAL, ptSAGITTAL, ptCORONAL]
};

/**
 * In this layout, the top row displays PT images in coronal, sagittal, and axial
 * orientations from left to right, respectively, followed by a MIP sagittal image
 * that spans both rows on the rightmost side. The bottom row displays fusion images
 * in coronal, sagittal, and axial orientations from left to right, respectively.
 * There is no viewport in the bottom row's rightmost position, as the MIP sagittal viewport
 * from the top row spans the full height of both rows.
 * It includes synchronizers as well.
 */
const stage4 = {
  name: '2x4-layout',
  id: '2x4-layout',
  viewportStructure: {
    layoutType: 'grid',
    properties: {
      rows: 2,
      columns: 4,
      layoutOptions: [{
        x: 0,
        y: 0,
        width: 1 / 4,
        height: 1 / 2
      }, {
        x: 1 / 4,
        y: 0,
        width: 1 / 4,
        height: 1 / 2
      }, {
        x: 2 / 4,
        y: 0,
        width: 1 / 4,
        height: 1 / 2
      }, {
        x: 3 / 4,
        y: 0,
        width: 1 / 4,
        height: 1
      }, {
        x: 0,
        y: 1 / 2,
        width: 1 / 4,
        height: 1 / 2
      }, {
        x: 1 / 4,
        y: 1 / 2,
        width: 1 / 4,
        height: 1 / 2
      }, {
        x: 2 / 4,
        y: 1 / 2,
        width: 1 / 4,
        height: 1 / 2
      }]
    }
  },
  viewports: [ptCORONAL, ptSAGITTAL, ptAXIAL, mipSAGITTAL, fusionCORONAL, fusionSAGITTAL, fusionAXIAL]
};

/**
 * This layout displays three fusion viewports: axial, sagittal, and coronal.
 * It follows a simple grid pattern with 1 row and 3 columns.
 */
// const stage0: AppTypes.HangingProtocol.ProtocolStage = {
//   name: 'Fusion 1x3',
//   viewportStructure: {
//     layoutType: 'grid',
//     properties: {
//       rows: 1,
//       columns: 3,
//     },
//   },
//   viewports: [fusionAXIAL, fusionSAGITTAL, fusionCORONAL],
// };

const ptCT = {
  id: '@ohif/extension-tmtv.hangingProtocolModule.ptCT',
  locked: true,
  name: 'Default',
  createdDate: '2021-02-23T19:22:08.894Z',
  modifiedDate: '2022-10-04T19:22:08.894Z',
  availableTo: {},
  editableBy: {},
  imageLoadStrategy: 'interleaveTopToBottom',
  // "default" , "interleaveTopToBottom",  "interleaveCenter"
  protocolMatchingRules: [{
    attribute: 'ModalitiesInStudy',
    constraint: {
      contains: ['CT', 'PT']
    }
  }, {
    attribute: 'StudyDescription',
    constraint: {
      contains: 'PETCT'
    }
  }, {
    attribute: 'StudyDescription',
    constraint: {
      contains: 'PET/CT'
    }
  }],
  displaySetSelectors: {
    ctDisplaySet: {
      seriesMatchingRules: [{
        attribute: 'Modality',
        constraint: {
          equals: {
            value: 'CT'
          }
        },
        required: true
      }, {
        attribute: 'isReconstructable',
        constraint: {
          equals: {
            value: true
          }
        },
        required: true
      }, {
        attribute: 'SeriesDescription',
        constraint: {
          contains: 'CT'
        }
      }, {
        attribute: 'SeriesDescription',
        constraint: {
          contains: 'CT WB'
        }
      }]
    },
    ptDisplaySet: {
      seriesMatchingRules: [{
        attribute: 'Modality',
        constraint: {
          equals: 'PT'
        },
        required: true
      }, {
        attribute: 'isReconstructable',
        constraint: {
          equals: {
            value: true
          }
        },
        required: true
      }, {
        attribute: 'SeriesDescription',
        constraint: {
          contains: 'Corrected'
        }
      }, {
        weight: 2,
        attribute: 'SeriesDescription',
        constraint: {
          doesNotContain: {
            value: 'Uncorrected'
          }
        }
      }]
    }
  },
  stages: [stage1, stage2, stage3, stage4],
  numberOfPriorsReferenced: -1
};
function getHangingProtocolModule() {
  return [{
    name: ptCT.id,
    protocol: ptCT
  }];
}
/* harmony default export */ const src_getHangingProtocolModule = (getHangingProtocolModule);
// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../../node_modules/prop-types/index.js
var prop_types = __webpack_require__(97598);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
// EXTERNAL MODULE: ../../core/src/index.ts + 68 modules
var src = __webpack_require__(15871);
// EXTERNAL MODULE: ../../../node_modules/react-i18next/dist/es/index.js + 15 modules
var es = __webpack_require__(99993);
// EXTERNAL MODULE: ../../ui-next/src/index.ts + 3073 modules
var ui_next_src = __webpack_require__(17130);
;// ../../../extensions/tmtv/src/Panels/PanelPetSUV.tsx
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }






const DEFAULT_MEATADATA = {
  PatientWeight: null,
  PatientSex: null,
  SeriesTime: null,
  RadiopharmaceuticalInformationSequence: {
    RadionuclideTotalDose: null,
    RadionuclideHalfLife: null,
    RadiopharmaceuticalStartTime: null
  }
};

/*
 * PETSUV panel enables the user to modify the patient related information, such as
 * patient sex, patientWeight. This is allowed since
 * sometimes these metadata are missing or wrong. By changing them
 * @param param0
 * @returns
 */

// InputRow compound component
const InputRow = ({
  children,
  className,
  ...props
}) => {
  return /*#__PURE__*/react.createElement("div", _extends({
    className: `flex flex-row items-center space-x-4 ${className || ''}`
  }, props), children);
};

// InputRow sub-components
InputRow.Label = ({
  children,
  unit,
  className,
  ...props
}) => /*#__PURE__*/react.createElement(ui_next_src/* Label */.JU7, _extends({
  className: `min-w-32 flex-shrink-0 ${className || ''}`
}, props), children, unit && /*#__PURE__*/react.createElement("span", {
  className: "text-muted-foreground"
}, " ", unit));
InputRow.Input = ({
  className,
  ...props
}) => /*#__PURE__*/react.createElement(ui_next_src/* Input */.pde, _extends({
  className: `h-7 flex-1 ${className || ''}`
}, props));

// Set display names for better debugging
InputRow.Label.displayName = 'InputRow.Label';
InputRow.Input.displayName = 'InputRow.Input';
function PanelPetSUV() {
  const {
    commandsManager,
    servicesManager
  } = (0,src.useSystem)();
  const {
    t
  } = (0,es/* useTranslation */.Bd)('PanelSUV');
  const {
    displaySetService,
    hangingProtocolService
  } = servicesManager.services;
  const [metadata, setMetadata] = (0,react.useState)(DEFAULT_MEATADATA);
  const [ptDisplaySet, setPtDisplaySet] = (0,react.useState)(null);
  const handleMetadataChange = metadata => {
    setMetadata(prevState => {
      const newState = {
        ...prevState
      };
      Object.keys(metadata).forEach(key => {
        if (typeof metadata[key] === 'object') {
          newState[key] = {
            ...prevState[key],
            ...metadata[key]
          };
        } else {
          newState[key] = metadata[key];
        }
      });
      return newState;
    });
  };
  const getMatchingPTDisplaySet = viewportMatchDetails => {
    const ptDisplaySet = commandsManager.runCommand('getMatchingPTDisplaySet', {
      viewportMatchDetails
    });
    if (!ptDisplaySet) {
      return;
    }
    const metadata = commandsManager.runCommand('getPTMetadata', {
      ptDisplaySet
    });
    return {
      ptDisplaySet,
      metadata
    };
  };
  (0,react.useEffect)(() => {
    const displaySets = displaySetService.getActiveDisplaySets();
    const {
      viewportMatchDetails
    } = hangingProtocolService.getMatchDetails();
    if (!displaySets.length) {
      return;
    }
    const displaySetInfo = getMatchingPTDisplaySet(viewportMatchDetails);
    if (!displaySetInfo) {
      return;
    }
    const {
      ptDisplaySet,
      metadata
    } = displaySetInfo;
    setPtDisplaySet(ptDisplaySet);
    setMetadata(metadata);
  }, []);

  // get the patientMetadata from the StudyInstanceUIDs and update the state
  (0,react.useEffect)(() => {
    const {
      unsubscribe
    } = hangingProtocolService.subscribe(hangingProtocolService.EVENTS.PROTOCOL_CHANGED, ({
      viewportMatchDetails
    }) => {
      const displaySetInfo = getMatchingPTDisplaySet(viewportMatchDetails);
      if (!displaySetInfo) {
        return;
      }
      const {
        ptDisplaySet,
        metadata
      } = displaySetInfo;
      setPtDisplaySet(ptDisplaySet);
      setMetadata(metadata);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  function updateMetadata() {
    if (!ptDisplaySet) {
      throw new Error('No ptDisplaySet found');
    }

    // metadata should be dcmjs naturalized
    src.DicomMetadataStore.updateMetadataForSeries(ptDisplaySet.StudyInstanceUID, ptDisplaySet.SeriesInstanceUID, metadata);

    // update the displaySets
    displaySetService.setDisplaySetMetadataInvalidated(ptDisplaySet.displaySetInstanceUID);

    // Crosshair position depends on the metadata values such as the positioning interaction
    // between series, so when the metadata is updated, the crosshairs need to be reset.
    setTimeout(() => {
      commandsManager.runCommand('resetCrosshairs');
    }, 0);
  }
  return /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
    className: "ohif-scrollbar flex min-h-0 flex-auto select-none flex-col justify-between overflow-auto"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex min-h-0 flex-1 flex-col bg-black text-base"
  }, /*#__PURE__*/react.createElement(ui_next_src/* PanelSection */.aUM, {
    defaultOpen: true
  }, /*#__PURE__*/react.createElement(ui_next_src/* PanelSection */.aUM.Header, null, t('Patient Information')), /*#__PURE__*/react.createElement(ui_next_src/* PanelSection */.aUM.Content, null, /*#__PURE__*/react.createElement("div", {
    className: "bg-primary-dark flex flex-col gap-3 p-2"
  }, /*#__PURE__*/react.createElement(InputRow, null, /*#__PURE__*/react.createElement(InputRow.Label, null, t('Patient Sex')), /*#__PURE__*/react.createElement(InputRow.Input, {
    value: metadata.PatientSex || '',
    onChange: e => {
      handleMetadataChange({
        PatientSex: e.target.value
      });
    }
  })), /*#__PURE__*/react.createElement(InputRow, null, /*#__PURE__*/react.createElement(InputRow.Label, {
    unit: "kg"
  }, t('Weight')), /*#__PURE__*/react.createElement(InputRow.Input, {
    value: metadata.PatientWeight || '',
    onChange: e => {
      handleMetadataChange({
        PatientWeight: e.target.value
      });
    },
    id: "weight-input"
  })), /*#__PURE__*/react.createElement(InputRow, null, /*#__PURE__*/react.createElement(InputRow.Label, {
    unit: "bq"
  }, t('Total Dose')), /*#__PURE__*/react.createElement(InputRow.Input, {
    value: metadata.RadiopharmaceuticalInformationSequence.RadionuclideTotalDose || '',
    onChange: e => {
      handleMetadataChange({
        RadiopharmaceuticalInformationSequence: {
          RadionuclideTotalDose: e.target.value
        }
      });
    }
  })), /*#__PURE__*/react.createElement(InputRow, null, /*#__PURE__*/react.createElement(InputRow.Label, {
    unit: "s"
  }, t('Half Life')), /*#__PURE__*/react.createElement(InputRow.Input, {
    value: metadata.RadiopharmaceuticalInformationSequence.RadionuclideHalfLife || '',
    onChange: e => {
      handleMetadataChange({
        RadiopharmaceuticalInformationSequence: {
          RadionuclideHalfLife: e.target.value
        }
      });
    }
  })), /*#__PURE__*/react.createElement(InputRow, null, /*#__PURE__*/react.createElement(InputRow.Label, {
    unit: "s"
  }, t('Injection Time')), /*#__PURE__*/react.createElement(InputRow.Input, {
    value: metadata.RadiopharmaceuticalInformationSequence.RadiopharmaceuticalStartTime || '',
    onChange: e => {
      handleMetadataChange({
        RadiopharmaceuticalInformationSequence: {
          RadiopharmaceuticalStartTime: e.target.value
        }
      });
    }
  })), /*#__PURE__*/react.createElement(InputRow, null, /*#__PURE__*/react.createElement(InputRow.Label, {
    unit: "s"
  }, t('Acquisition Time')), /*#__PURE__*/react.createElement(InputRow.Input, {
    value: metadata.SeriesTime || '',
    onChange: () => {}
  })), /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "default",
    size: "sm",
    className: "w-28 self-end",
    onClick: updateMetadata
  }, "Reload Data")))))));
}
PanelPetSUV.propTypes = {
  servicesManager: prop_types_default().shape({
    services: prop_types_default().shape({
      measurementService: prop_types_default().shape({
        getMeasurements: (prop_types_default()).func.isRequired,
        subscribe: (prop_types_default()).func.isRequired,
        EVENTS: (prop_types_default()).object.isRequired,
        VALUE_TYPES: (prop_types_default()).object.isRequired
      }).isRequired
    }).isRequired
  }).isRequired
};
// EXTERNAL MODULE: ../../../extensions/cornerstone/src/index.tsx + 185 modules
var cornerstone_src = __webpack_require__(39162);
;// ../../../extensions/tmtv/src/utils/handleROIThresholding.ts
const handleROIThresholding = async ({
  commandsManager,
  segmentationService
}) => {
  const segmentations = segmentationService.getSegmentations();
  const tmtv = await commandsManager.run('calculateTMTV', {
    segmentations
  });

  // add the tmtv to all the segment cachedStats, although it is a global
  // value but we don't have any other way to display it for now
  // Update all segmentations with the calculated TMTV
  segmentations.forEach(segmentation => {
    segmentation.cachedStats = {
      ...segmentation.cachedStats,
      tmtv
    };
    segmentationService.addOrUpdateSegmentation(segmentation);
  });
};
// EXTERNAL MODULE: ../../core/src/utils/index.ts + 29 modules
var utils = __webpack_require__(80735);
;// ../../../extensions/tmtv/src/Panels/PanelROIThresholdSegmentation/PanelROIThresholdExport.tsx






function PanelRoiThresholdSegmentation() {
  const {
    commandsManager,
    servicesManager
  } = (0,src.useSystem)();
  const {
    segmentationService
  } = servicesManager.services;
  const {
    segmentationsWithRepresentations: segmentationsInfo
  } = (0,cornerstone_src.useActiveViewportSegmentationRepresentations)();
  const segmentationIds = segmentationsInfo?.map(info => info.segmentation.segmentationId) || [];
  const segmentations = segmentationsInfo?.map(info => info.segmentation) || [];
  (0,react.useEffect)(() => {
    const initialRun = async () => {
      for (const segmentationId of segmentationIds) {
        await handleROIThresholding({
          segmentationId,
          commandsManager,
          segmentationService
        });
      }
    };
    initialRun();
  }, []);
  (0,react.useEffect)(() => {
    const debouncedHandleROIThresholding = (0,utils/* debounce */.sg)(async eventDetail => {
      const {
        segmentationId
      } = eventDetail;
      await handleROIThresholding({
        segmentationId,
        commandsManager,
        segmentationService
      });
    }, 100);
    const dataModifiedCallback = eventDetail => {
      debouncedHandleROIThresholding(eventDetail);
    };
    const dataModifiedSubscription = segmentationService.subscribe(segmentationService.EVENTS.SEGMENTATION_DATA_MODIFIED, dataModifiedCallback);
    return () => {
      dataModifiedSubscription.unsubscribe();
    };
  }, [commandsManager, segmentationService]);

  // Find the first segmentation with a TMTV value since all of them have the same value
  const stats = segmentationService.getSegmentationGroupStats(segmentationIds);
  const tmtvValue = stats?.tmtv;
  const handleExportCSV = () => {
    if (!segmentations.length) {
      return;
    }
    commandsManager.runCommand('exportTMTVReportCSV', {
      segmentations,
      tmtv: tmtvValue,
      config: {}
    });
  };
  return /*#__PURE__*/react.createElement("div", {
    className: "mb-1 flex flex-col"
  }, /*#__PURE__*/react.createElement("div", {
    className: "invisible-scrollbar overflow-y-auto overflow-x-hidden"
  }, /*#__PURE__*/react.createElement("div", {
    className: "bg-secondary-dark flex items-baseline justify-between px-2 py-1"
  }, /*#__PURE__*/react.createElement("div", {
    className: "py-1"
  }, /*#__PURE__*/react.createElement("span", {
    className: "text-muted-foreground text-base font-bold uppercase"
  }, 'TMTV: '), /*#__PURE__*/react.createElement("span", {
    className: "text-foreground"
  }, tmtvValue ? `${tmtvValue.toFixed(3)} mL` : '')), /*#__PURE__*/react.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    dataCY: "exportTmtvCsvReport",
    size: "sm",
    variant: "ghost",
    className: "text-blue-500",
    onClick: handleExportCSV
  }, /*#__PURE__*/react.createElement("span", {
    className: "pl-1"
  }, "CSV"))))));
}
;// ../../../extensions/tmtv/src/Panels/PanelROIThresholdSegmentation/index.ts

/* harmony default export */ const PanelROIThresholdSegmentation = (PanelRoiThresholdSegmentation);
;// ../../../extensions/tmtv/src/Panels/index.tsx



// EXTERNAL MODULE: ../../../extensions/default/src/index.ts + 140 modules
var default_src = __webpack_require__(77440);
;// ../../../extensions/tmtv/src/Panels/PanelTMTV.tsx



function PanelTMTV({
  configuration
}) {
  return /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement(cornerstone_src.PanelSegmentation, {
    configuration: configuration
  }, /*#__PURE__*/react.createElement(PanelRoiThresholdSegmentation, null)));
}
;// ../../../extensions/tmtv/src/getPanelModule.tsx




function getPanelModule({
  commandsManager,
  extensionManager,
  servicesManager
}) {
  const {
    toolbarService
  } = servicesManager.services;
  const wrappedPanelPetSuv = () => {
    return /*#__PURE__*/react.createElement(PanelPetSUV, null);
  };
  const wrappedROIThresholdToolbox = () => {
    return /*#__PURE__*/react.createElement(default_src.Toolbox, {
      buttonSectionId: toolbarService.sections.roiThresholdToolbox,
      title: "Threshold Tools"
    });
  };
  const wrappedROIThresholdExport = () => {
    return /*#__PURE__*/react.createElement(PanelROIThresholdSegmentation, null);
  };
  const wrappedPanelTMTV = () => {
    return /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement(default_src.Toolbox, {
      buttonSectionId: toolbarService.sections.roiThresholdToolbox,
      title: "Threshold Tools"
    }), /*#__PURE__*/react.createElement(PanelTMTV, {
      commandsManager: commandsManager,
      servicesManager: servicesManager
    }));
  };
  return [{
    name: 'petSUV',
    iconName: 'tab-patient-info',
    iconLabel: 'Patient Info',
    label: 'Patient Info',
    component: wrappedPanelPetSuv
  }, {
    name: 'tmtv',
    iconName: 'tab-segmentation',
    iconLabel: 'Segmentation',
    component: wrappedPanelTMTV
  }, {
    name: 'tmtvBox',
    iconName: 'tab-segmentation',
    iconLabel: 'Segmentation',
    label: 'Segmentation Toolbox',
    component: wrappedROIThresholdToolbox
  }, {
    name: 'tmtvExport',
    iconName: 'tab-segmentation',
    iconLabel: 'Segmentation',
    label: 'Segmentation Export',
    component: wrappedROIThresholdExport
  }];
}
/* harmony default export */ const src_getPanelModule = (getPanelModule);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/index.js
var esm = __webpack_require__(4667);
;// ../../../extensions/tmtv/src/utils/measurementServiceMappings/constants/supportedTools.js
/* harmony default export */ const supportedTools = (['RectangleROIStartEndThreshold', 'CircleROIStartEndThreshold']);
;// ../../../extensions/tmtv/src/utils/measurementServiceMappings/RectangleROIStartEndThreshold.js


const RectangleROIStartEndThreshold = {
  toAnnotation: (measurement, definition) => {},
  /**
   * Maps cornerstone annotation event data to measurement service format.
   *
   * @param {Object} cornerstone Cornerstone event data
   * @return {Measurement} Measurement instance
   */
  toMeasurement: (csToolsEventDetail, displaySetService, cornerstoneViewportService) => {
    const {
      annotation,
      viewportId
    } = csToolsEventDetail;
    const {
      metadata,
      data,
      annotationUID
    } = annotation;
    if (!metadata || !data) {
      console.warn('Length tool: Missing metadata or data');
      return null;
    }
    const {
      toolName,
      referencedImageId,
      FrameOfReferenceUID
    } = metadata;
    const validToolType = supportedTools.includes(toolName);
    if (!validToolType) {
      throw new Error('Tool not supported');
    }
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      StudyInstanceUID
    } = (0,cornerstone_src.getSOPInstanceAttributes)(referencedImageId, cornerstoneViewportService, viewportId);
    let displaySet;
    if (SOPInstanceUID) {
      displaySet = displaySetService.getDisplaySetForSOPInstanceUID(SOPInstanceUID, SeriesInstanceUID);
    } else {
      displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID);
    }
    return {
      uid: annotationUID,
      SOPInstanceUID,
      FrameOfReferenceUID,
      // points,
      metadata,
      referenceSeriesUID: SeriesInstanceUID,
      referenceStudyUID: StudyInstanceUID,
      toolName: metadata.toolName,
      displaySetInstanceUID: displaySet.displaySetInstanceUID,
      label: metadata.label,
      data: data.cachedStats,
      type: 'RectangleROIStartEndThreshold'
    };
  }
};
/* harmony default export */ const measurementServiceMappings_RectangleROIStartEndThreshold = (RectangleROIStartEndThreshold);
;// ../../../extensions/tmtv/src/utils/measurementServiceMappings/CircleROIStartEndThreshold.js


const CircleROIStartEndThreshold = {
  toAnnotation: (measurement, definition) => {},
  /**
   * Maps cornerstone annotation event data to measurement service format.
   *
   * @param {Object} cornerstone Cornerstone event data
   * @return {Measurement} Measurement instance
   */
  toMeasurement: (csToolsEventDetail, displaySetService, cornerstoneViewportService) => {
    const {
      annotation,
      viewportId
    } = csToolsEventDetail;
    const {
      metadata,
      data,
      annotationUID
    } = annotation;
    if (!metadata || !data) {
      console.warn('Length tool: Missing metadata or data');
      return null;
    }
    const {
      toolName,
      referencedImageId,
      FrameOfReferenceUID
    } = metadata;
    const validToolType = supportedTools.includes(toolName);
    if (!validToolType) {
      throw new Error('Tool not supported');
    }
    const {
      SOPInstanceUID,
      SeriesInstanceUID,
      StudyInstanceUID
    } = (0,cornerstone_src.getSOPInstanceAttributes)(referencedImageId, cornerstoneViewportService, viewportId);
    let displaySet;
    if (SOPInstanceUID) {
      displaySet = displaySetService.getDisplaySetForSOPInstanceUID(SOPInstanceUID, SeriesInstanceUID);
    } else {
      displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID);
    }
    const {
      cachedStats
    } = data;
    return {
      uid: annotationUID,
      SOPInstanceUID,
      FrameOfReferenceUID,
      // points,
      metadata,
      referenceSeriesUID: SeriesInstanceUID,
      referenceStudyUID: StudyInstanceUID,
      toolName: metadata.toolName,
      displaySetInstanceUID: displaySet.displaySetInstanceUID,
      label: metadata.label,
      // displayText: displayText,
      data: data.cachedStats,
      type: 'CircleROIStartEndThreshold'
      // getReport,
    };
  }
};
/* harmony default export */ const measurementServiceMappings_CircleROIStartEndThreshold = (CircleROIStartEndThreshold);
;// ../../../extensions/tmtv/src/utils/measurementServiceMappings/measurementServiceMappingsFactory.js


const measurementServiceMappingsFactory = (measurementService, displaySetService, cornerstoneViewportService) => {
  return {
    RectangleROIStartEndThreshold: {
      toAnnotation: measurementServiceMappings_RectangleROIStartEndThreshold.toAnnotation,
      toMeasurement: csToolsAnnotation => measurementServiceMappings_RectangleROIStartEndThreshold.toMeasurement(csToolsAnnotation, displaySetService, cornerstoneViewportService),
      matchingCriteria: [{
        valueType: measurementService.VALUE_TYPES.ROI_THRESHOLD_MANUAL
      }]
    },
    CircleROIStartEndThreshold: {
      toAnnotation: measurementServiceMappings_CircleROIStartEndThreshold.toAnnotation,
      toMeasurement: csToolsAnnotation => measurementServiceMappings_CircleROIStartEndThreshold.toMeasurement(csToolsAnnotation, displaySetService, cornerstoneViewportService),
      matchingCriteria: [{
        valueType: measurementService.VALUE_TYPES.ROI_THRESHOLD_MANUAL
      }]
    }
  };
};
/* harmony default export */ const measurementServiceMappings_measurementServiceMappingsFactory = (measurementServiceMappingsFactory);
;// ../../../extensions/tmtv/src/init.js



const {
  CORNERSTONE_3D_TOOLS_SOURCE_NAME,
  CORNERSTONE_3D_TOOLS_SOURCE_VERSION
} = cornerstone_src.Enums;

/**
 *
 * @param {Object} servicesManager
 * @param {Object} configuration
 * @param {Object|Array} configuration.csToolsConfig
 */
function init({
  servicesManager
}) {
  const {
    measurementService,
    displaySetService,
    cornerstoneViewportService
  } = servicesManager.services;
  (0,esm.addTool)(esm.RectangleROIStartEndThresholdTool);
  (0,esm.addTool)(esm.CircleROIStartEndThresholdTool);
  const {
    RectangleROIStartEndThreshold,
    CircleROIStartEndThreshold
  } = measurementServiceMappings_measurementServiceMappingsFactory(measurementService, displaySetService, cornerstoneViewportService);
  const csTools3DVer1MeasurementSource = measurementService.getSource(CORNERSTONE_3D_TOOLS_SOURCE_NAME, CORNERSTONE_3D_TOOLS_SOURCE_VERSION);
  measurementService.addMapping(csTools3DVer1MeasurementSource, 'RectangleROIStartEndThreshold', RectangleROIStartEndThreshold.matchingCriteria, RectangleROIStartEndThreshold.toAnnotation, RectangleROIStartEndThreshold.toMeasurement);
  measurementService.addMapping(csTools3DVer1MeasurementSource, 'CircleROIStartEndThreshold', CircleROIStartEndThreshold.matchingCriteria, CircleROIStartEndThreshold.toAnnotation, CircleROIStartEndThreshold.toMeasurement);
}
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var dist_esm = __webpack_require__(15327);
// EXTERNAL MODULE: ../../i18n/src/index.js + 197 modules
var i18n_src = __webpack_require__(89806);
;// ../../../extensions/tmtv/src/utils/getThresholdValue.ts


function getRoiStats(displaySet, annotations) {
  const {
    imageIds
  } = displaySet;
  const ptVolumeInfo = dist_esm.cache.getVolumeContainingImageId(imageIds[0]);
  if (!ptVolumeInfo) {
    throw new Error('No volume found for display set');
  }
  const {
    volume
  } = ptVolumeInfo;
  const {
    voxelManager
  } = volume;

  // Todo: add support for other strategies
  const {
    fn,
    baseValue
  } = _getStrategyFn('max');
  let value = baseValue;
  const boundsIJK = esm.utilities.rectangleROITool.getBoundsIJKFromRectangleAnnotations(annotations, volume);

  // Use the voxelManager's forEach method to iterate over the bounds
  voxelManager.forEach(({
    value: voxelValue
  }) => {
    value = fn(voxelValue, value);
  }, {
    boundsIJK
  });
  return value;
}
function getThresholdValues(annotationUIDs, ptDisplaySet, config) {
  if (config.strategy === 'range') {
    return {
      ptLower: Number(config.ptLower),
      ptUpper: Number(config.ptUpper),
      ctLower: Number(config.ctLower),
      ctUpper: Number(config.ctUpper)
    };
  }
  const {
    weight
  } = config;
  const annotations = annotationUIDs.map(annotationUID => esm.annotation.state.getAnnotation(annotationUID));
  const ptValue = getRoiStats(ptDisplaySet, annotations);
  return {
    ctLower: -Infinity,
    ctUpper: +Infinity,
    ptLower: weight * ptValue,
    ptUpper: +Infinity
  };
}
function _getStrategyFn(statistic) {
  const baseValue = -Infinity;
  const fn = (number, maxValue) => {
    if (number > maxValue) {
      maxValue = number;
    }
    return maxValue;
  };
  return {
    fn,
    baseValue
  };
}
/* harmony default export */ const getThresholdValue = (getThresholdValues);
;// ../../../extensions/tmtv/src/utils/createAndDownloadTMTVReport.js
function createAndDownloadTMTVReport(segReport, additionalReportRows, options = {}) {
  const firstReport = segReport[Object.keys(segReport)[0]];
  const columns = Object.keys(firstReport);
  const csv = [columns.map(column => column.toLowerCase().startsWith('namedstats_') ? column.substring(11) : column).join(',')];
  Object.values(segReport).forEach(segmentation => {
    const row = [];
    columns.forEach(column => {
      // if it is array then we need to replace , with space to avoid csv parsing error
      row.push(segmentation[column] && typeof segmentation[column] === 'object' ? Array.isArray(segmentation[column]) ? segmentation[column].join(' ') : segmentation[column].value && Array.isArray(segmentation[column].value) ? segmentation[column].value.join(' ') : segmentation[column].value ?? segmentation[column] : segmentation[column]);
    });
    csv.push(row.join(','));
  });
  csv.push('');
  csv.push('');
  csv.push('');
  csv.push(`Patient ID,${firstReport.PatientID}`);
  csv.push(`Study Date,${firstReport.StudyDate}`);
  csv.push('');
  additionalReportRows.forEach(({
    key,
    value: values
  }) => {
    const temp = [];
    temp.push(`${key}`);
    Object.keys(values).forEach(k => {
      temp.push(`${k}`);
      temp.push(`${values[k]}`);
    });
    csv.push(temp.join(','));
  });
  const blob = new Blob([csv.join('\n')], {
    type: 'text/csv;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = options.filename ?? `${firstReport.PatientID}_tmtv.csv`;
  a.click();
}
// EXTERNAL MODULE: ../../../node_modules/dcmjs/build/dcmjs.es.js
var dcmjs_es = __webpack_require__(5842);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/adapters/dist/esm/index.js + 69 modules
var adapters_dist_esm = __webpack_require__(53434);
;// ../../../extensions/tmtv/src/utils/dicomRTAnnotationExport/RTStructureSet/dicomRTAnnotationExport.js



const {
  datasetToBlob
} = dcmjs_es/* default.data */.Ay.data;
const metadataProvider = src.classes.MetadataProvider;
function dicomRTAnnotationExport(annotations) {
  const dataset = adapters_dist_esm/* adaptersRT */.f_.Cornerstone3D.RTSS.generateRTSSFromAnnotations(annotations, metadataProvider, src.DicomMetadataStore);
  const reportBlob = datasetToBlob(dataset);

  //Create a URL for the binary.
  var objectUrl = URL.createObjectURL(reportBlob);
  window.location.assign(objectUrl);
}
;// ../../../extensions/tmtv/src/utils/dicomRTAnnotationExport/RTStructureSet/index.js

/* harmony default export */ const RTStructureSet = (dicomRTAnnotationExport);
;// ../../../extensions/tmtv/src/commandsModule.ts










const {
  SegmentationRepresentations
} = esm.Enums;
const {
  formatPN
} = src.utils;
const commandsModule_metadataProvider = src.classes.MetadataProvider;
const ROI_THRESHOLD_MANUAL_TOOL_IDS = ['RectangleROIStartEndThreshold', 'RectangleROIThreshold', 'CircleROIStartEndThreshold'];
const commandsModule = ({
  servicesManager,
  commandsManager,
  extensionManager
}) => {
  const {
    viewportGridService,
    uiNotificationService,
    displaySetService,
    hangingProtocolService,
    toolGroupService,
    cornerstoneViewportService,
    segmentationService
  } = servicesManager.services;
  const utilityModule = extensionManager.getModuleEntry('@ohif/extension-cornerstone.utilityModule.common');
  const {
    getEnabledElement
  } = utilityModule.exports;
  function _getActiveViewportsEnabledElement() {
    const {
      activeViewportId
    } = viewportGridService.getState();
    const {
      element
    } = getEnabledElement(activeViewportId) || {};
    const enabledElement = dist_esm.getEnabledElement(element);
    return enabledElement;
  }
  function _getAnnotationsSelectedByToolNames(toolNames) {
    return toolNames.reduce((allAnnotationUIDs, toolName) => {
      const annotationUIDs = esm.annotation.selection.getAnnotationsSelectedByToolName(toolName);
      return allAnnotationUIDs.concat(annotationUIDs);
    }, []);
  }
  const actions = {
    getMatchingPTDisplaySet: ({
      viewportMatchDetails
    }) => {
      // Todo: this is assuming that the hanging protocol has successfully matched
      // the correct PT. For future, we should have a way to filter out the PTs
      // that are in the viewer layout (but then we have the problem of the attenuation
      // corrected PT vs the non-attenuation correct PT)

      let ptDisplaySet = null;
      for (const [, viewportDetails] of viewportMatchDetails) {
        const {
          displaySetsInfo
        } = viewportDetails;
        const displaySets = displaySetsInfo.map(({
          displaySetInstanceUID
        }) => displaySetService.getDisplaySetByUID(displaySetInstanceUID));
        if (!displaySets || displaySets.length === 0) {
          continue;
        }
        ptDisplaySet = displaySets.find(displaySet => displaySet.Modality === 'PT');
        if (ptDisplaySet) {
          break;
        }
      }
      return ptDisplaySet;
    },
    getPTMetadata: ({
      ptDisplaySet
    }) => {
      const dataSource = extensionManager.getDataSources()[0];
      const imageIds = dataSource.getImageIdsForDisplaySet(ptDisplaySet);
      const firstImageId = imageIds[0];
      const instance = commandsModule_metadataProvider.get('instance', firstImageId);
      if (instance.Modality !== 'PT') {
        return;
      }
      const metadata = {
        SeriesTime: instance.SeriesTime,
        Modality: instance.Modality,
        PatientSex: instance.PatientSex,
        PatientWeight: instance.PatientWeight,
        RadiopharmaceuticalInformationSequence: {
          RadionuclideTotalDose: instance.RadiopharmaceuticalInformationSequence[0].RadionuclideTotalDose,
          RadionuclideHalfLife: instance.RadiopharmaceuticalInformationSequence[0].RadionuclideHalfLife,
          RadiopharmaceuticalStartTime: instance.RadiopharmaceuticalInformationSequence[0].RadiopharmaceuticalStartTime,
          RadiopharmaceuticalStartDateTime: instance.RadiopharmaceuticalInformationSequence[0].RadiopharmaceuticalStartDateTime
        }
      };
      return metadata;
    },
    createNewLabelmapFromPT: async ({
      label
    }) => {
      // Create a segmentation of the same resolution as the source data
      // using volumeLoader.createAndCacheDerivedVolume.

      const {
        viewportMatchDetails
      } = hangingProtocolService.getMatchDetails();
      const ptDisplaySet = actions.getMatchingPTDisplaySet({
        viewportMatchDetails
      });
      let withPTViewportId = null;
      for (const [viewportId, {
        displaySetsInfo
      }] of viewportMatchDetails.entries()) {
        const isPT = displaySetsInfo.some(({
          displaySetInstanceUID
        }) => displaySetInstanceUID === ptDisplaySet.displaySetInstanceUID);
        if (isPT) {
          withPTViewportId = viewportId;
          break;
        }
      }
      if (!ptDisplaySet) {
        uiNotificationService.error('No matching PT display set found');
        return;
      }
      const currentSegmentations = segmentationService.getSegmentationRepresentations(withPTViewportId);
      const displaySet = displaySetService.getDisplaySetByUID(ptDisplaySet.displaySetInstanceUID);
      const segmentationId = await segmentationService.createLabelmapForDisplaySet(displaySet, {
        label: `Segmentation ${currentSegmentations.length + 1}`,
        segments: {
          1: {
            label: `${i18n_src/* default */.A.t('Segment')} 1`,
            active: true
          }
        }
      });
      segmentationService.addSegmentationRepresentation(withPTViewportId, {
        segmentationId
      });
      return segmentationId;
    },
    thresholdSegmentationByRectangleROITool: ({
      segmentationId,
      config,
      segmentIndex
    }) => {
      const segmentation = esm.segmentation.state.getSegmentation(segmentationId);
      const {
        representationData
      } = segmentation;
      const {
        displaySetMatchDetails: matchDetails
      } = hangingProtocolService.getMatchDetails();
      const ctDisplaySetMatch = matchDetails.get('ctDisplaySet');
      const ptDisplaySetMatch = matchDetails.get('ptDisplaySet');
      const ctDisplaySet = displaySetService.getDisplaySetByUID(ctDisplaySetMatch.displaySetInstanceUID);
      const ptDisplaySet = displaySetService.getDisplaySetByUID(ptDisplaySetMatch.displaySetInstanceUID);
      const {
        volumeId: segVolumeId
      } = representationData[SegmentationRepresentations.Labelmap];
      const labelmapVolume = dist_esm.cache.getVolume(segVolumeId);
      const annotationUIDs = _getAnnotationsSelectedByToolNames(ROI_THRESHOLD_MANUAL_TOOL_IDS);
      if (annotationUIDs.length === 0) {
        uiNotificationService.show({
          title: 'Commands Module',
          message: 'No ROIThreshold Tool is Selected',
          type: 'error'
        });
        return;
      }
      const {
        ptLower,
        ptUpper,
        ctLower,
        ctUpper
      } = getThresholdValue(annotationUIDs, ptDisplaySet, config);
      const {
        imageIds: ptImageIds
      } = ptDisplaySet;
      const ptVolumeInfo = dist_esm.cache.getVolumeContainingImageId(ptImageIds[0]);
      if (!ptVolumeInfo) {
        uiNotificationService.error('No PT volume found');
        return;
      }
      const {
        imageIds: ctImageIds
      } = ctDisplaySet;
      const ctVolumeInfo = dist_esm.cache.getVolumeContainingImageId(ctImageIds[0]);
      if (!ctVolumeInfo) {
        uiNotificationService.error('No CT volume found');
        return;
      }
      const ptVolume = ptVolumeInfo.volume;
      const ctVolume = ctVolumeInfo.volume;
      return esm.utilities.segmentation.rectangleROIThresholdVolumeByRange(annotationUIDs, labelmapVolume, [{
        volume: ptVolume,
        lower: ptLower,
        upper: ptUpper
      }, {
        volume: ctVolume,
        lower: ctLower,
        upper: ctUpper
      }], {
        overwrite: true,
        segmentIndex,
        segmentationId
      });
    },
    calculateTMTV: async ({
      segmentations
    }) => {
      const segmentationIds = segmentations.map(segmentation => segmentation.segmentationId);
      const stats = await esm.utilities.segmentation.computeMetabolicStats({
        segmentationIds,
        segmentIndex: 1
      });
      segmentationService.setSegmentationGroupStats(segmentationIds, stats);
      return stats;
    },
    exportTMTVReportCSV: async ({
      segmentations,
      tmtv,
      config,
      options
    }) => {
      const segReport = commandsManager.runCommand('getSegmentationCSVReport', {
        segmentations
      });
      let total_tlg = 0;
      for (const segmentationId in segReport) {
        const report = segReport[segmentationId];
        const tlg = report['namedStats_lesionGlycolysis'];
        total_tlg += tlg.value;
      }
      const additionalReportRows = [{
        key: 'Total Lesion Glycolysis',
        value: {
          tlg: total_tlg.toFixed(4)
        }
      }, {
        key: 'Threshold Configuration',
        value: {
          ...config
        }
      }];
      if (tmtv !== undefined) {
        additionalReportRows.unshift({
          key: 'Total Metabolic Tumor Volume',
          value: {
            tmtv
          }
        });
      }
      createAndDownloadTMTVReport(segReport, additionalReportRows, options);
    },
    setStartSliceForROIThresholdTool: () => {
      const {
        viewport
      } = _getActiveViewportsEnabledElement();
      const {
        focalPoint
      } = viewport.getCamera();
      const selectedAnnotationUIDs = _getAnnotationsSelectedByToolNames(ROI_THRESHOLD_MANUAL_TOOL_IDS);
      const annotationUID = selectedAnnotationUIDs[0];
      const annotation = esm.annotation.state.getAnnotation(annotationUID);

      // set the current focal point
      annotation.data.startCoordinate = focalPoint;
      // IMPORTANT: invalidate the toolData for the cached stat to get updated
      // and re-calculate the projection points
      annotation.invalidated = true;
      viewport.render();
    },
    setEndSliceForROIThresholdTool: () => {
      const {
        viewport
      } = _getActiveViewportsEnabledElement();
      const selectedAnnotationUIDs = _getAnnotationsSelectedByToolNames(ROI_THRESHOLD_MANUAL_TOOL_IDS);
      const annotationUID = selectedAnnotationUIDs[0];
      const annotation = esm.annotation.state.getAnnotation(annotationUID);

      // get the current focal point
      const focalPointToEnd = viewport.getCamera().focalPoint;
      annotation.data.endCoordinate = focalPointToEnd;

      // IMPORTANT: invalidate the toolData for the cached stat to get updated
      // and re-calculate the projection points
      annotation.invalidated = true;
      viewport.render();
    },
    createTMTVRTReport: () => {
      // get all Rectangle ROI annotation
      const stateManager = esm.annotation.state.getAnnotationManager();
      const annotations = [];
      Object.keys(stateManager.annotations).forEach(frameOfReferenceUID => {
        const forAnnotations = stateManager.annotations[frameOfReferenceUID];
        const ROIAnnotations = ROI_THRESHOLD_MANUAL_TOOL_IDS.reduce((annotations, toolName) => [...annotations, ...(forAnnotations[toolName] ?? [])], []);
        annotations.push(...ROIAnnotations);
      });
      commandsManager.runCommand('exportRTReportForAnnotations', {
        annotations
      });
    },
    getSegmentationCSVReport: ({
      segmentations
    }) => {
      if (!segmentations || !segmentations.length) {
        segmentations = segmentationService.getSegmentations();
      }
      const report = {};
      for (const segmentation of segmentations) {
        const {
          label,
          segmentationId,
          representationData
        } = segmentation;
        const id = segmentationId;
        const segReport = {
          id,
          label
        };
        if (!representationData) {
          report[id] = segReport;
          continue;
        }
        const {
          cachedStats
        } = segmentation.segments[1] || {}; // Assuming we want stats from the first segment

        if (cachedStats) {
          Object.entries(cachedStats).forEach(([key, value]) => {
            if (typeof value !== 'object') {
              segReport[key] = value;
            } else {
              Object.entries(value).forEach(([subKey, subValue]) => {
                const newKey = `${key}_${subKey}`;
                segReport[newKey] = subValue;
              });
            }
          });
        }
        const labelmapVolume = segmentation.representationData[SegmentationRepresentations.Labelmap];
        if (!labelmapVolume) {
          report[id] = segReport;
          continue;
        }
        const referencedVolume = esm.utilities.segmentation.getReferenceVolumeForSegmentationVolume(labelmapVolume.volumeId);
        if (!referencedVolume) {
          report[id] = segReport;
          continue;
        }
        if (!referencedVolume.imageIds || !referencedVolume.imageIds.length) {
          report[id] = segReport;
          continue;
        }
        const firstImageId = referencedVolume.imageIds[0];
        const instance = src["default"].classes.MetadataProvider.get('instance', firstImageId);
        if (!instance) {
          report[id] = segReport;
          continue;
        }
        report[id] = {
          ...segReport,
          PatientID: instance.PatientID ?? '000000',
          PatientName: formatPN(instance.PatientName),
          StudyInstanceUID: instance.StudyInstanceUID,
          SeriesInstanceUID: instance.SeriesInstanceUID,
          StudyDate: instance.StudyDate
        };
      }
      return report;
    },
    exportRTReportForAnnotations: ({
      annotations
    }) => {
      RTStructureSet(annotations);
    },
    setFusionPTColormap: ({
      toolGroupId,
      colormap
    }) => {
      const toolGroup = toolGroupService.getToolGroup(toolGroupId);
      if (!toolGroup) {
        return;
      }
      const {
        viewportMatchDetails
      } = hangingProtocolService.getMatchDetails();
      const ptDisplaySet = actions.getMatchingPTDisplaySet({
        viewportMatchDetails
      });
      if (!ptDisplaySet) {
        return;
      }
      const fusionViewportIds = toolGroup.getViewportIds();
      const viewports = [];
      fusionViewportIds.forEach(viewportId => {
        commandsManager.runCommand('setViewportColormap', {
          viewportId,
          displaySetInstanceUID: ptDisplaySet.displaySetInstanceUID,
          colormap: {
            name: colormap
          }
        });
        viewports.push(cornerstoneViewportService.getCornerstoneViewport(viewportId));
      });
      viewports.forEach(viewport => {
        viewport.render();
      });
    }
  };
  const definitions = {
    setEndSliceForROIThresholdTool: {
      commandFn: actions.setEndSliceForROIThresholdTool
    },
    setStartSliceForROIThresholdTool: {
      commandFn: actions.setStartSliceForROIThresholdTool
    },
    getMatchingPTDisplaySet: {
      commandFn: actions.getMatchingPTDisplaySet
    },
    getPTMetadata: {
      commandFn: actions.getPTMetadata
    },
    createNewLabelmapFromPT: {
      commandFn: actions.createNewLabelmapFromPT
    },
    thresholdSegmentationByRectangleROITool: {
      commandFn: actions.thresholdSegmentationByRectangleROITool
    },
    calculateTMTV: {
      commandFn: actions.calculateTMTV
    },
    exportTMTVReportCSV: {
      commandFn: actions.exportTMTVReportCSV
    },
    createTMTVRTReport: {
      commandFn: actions.createTMTVRTReport
    },
    getSegmentationCSVReport: {
      commandFn: actions.getSegmentationCSVReport
    },
    exportRTReportForAnnotations: {
      commandFn: actions.exportRTReportForAnnotations
    },
    setFusionPTColormap: {
      commandFn: actions.setFusionPTColormap
    }
  };
  return {
    actions,
    definitions,
    defaultContext: 'TMTV:CORNERSTONE'
  };
};
/* harmony default export */ const src_commandsModule = (commandsModule);
;// ../../../extensions/tmtv/src/Panels/PanelROIThresholdSegmentation/ROIThresholdConfiguration.tsx



const ROI_STAT = 'roi_stat';
const RANGE = 'range';
const options = [{
  value: ROI_STAT,
  label: 'Max',
  placeHolder: 'Max'
}, {
  value: RANGE,
  label: 'Range',
  placeHolder: 'Range'
}];
function ROIThresholdConfiguration({
  config,
  dispatch,
  runCommand
}) {
  const {
    t
  } = (0,es/* useTranslation */.Bd)('ROIThresholdConfiguration');
  return /*#__PURE__*/react.createElement("div", {
    className: "bg-primary-dark flex flex-col space-y-4 p-px"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex items-end space-x-3"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex min-w-0 flex-1 flex-col"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Select */.l6P, {
    value: config.strategy,
    onValueChange: value => {
      dispatch({
        type: 'setStrategy',
        payload: {
          strategy: value
        }
      });
    }
  }, /*#__PURE__*/react.createElement(ui_next_src/* SelectTrigger */.bqE, {
    className: "w-full"
  }, /*#__PURE__*/react.createElement(ui_next_src/* SelectValue */.yvm, {
    placeholder: options.find(option => option.value === config.strategy)?.placeHolder
  })), /*#__PURE__*/react.createElement(ui_next_src/* SelectContent */.gCo, {
    className: ""
  }, options.map(option => /*#__PURE__*/react.createElement(ui_next_src/* SelectItem */.ebT, {
    key: option.value,
    value: option.value
  }, option.label))))), /*#__PURE__*/react.createElement("div", {
    className: "flex-shrink-0"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex justify-end space-x-2"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "secondary",
    onClick: () => runCommand('setStartSliceForROIThresholdTool')
  }, t('Start')), /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "secondary",
    onClick: () => runCommand('setEndSliceForROIThresholdTool')
  }, t('End'))))), config.strategy === ROI_STAT && /*#__PURE__*/react.createElement("div", {
    className: "mr-0"
  }, /*#__PURE__*/react.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Label */.JU7, null, t('Percentage of Max SUV'))), /*#__PURE__*/react.createElement(ui_next_src/* Input */.pde, {
    className: "w-full",
    type: "text",
    value: config.weight,
    onChange: e => {
      dispatch({
        type: 'setWeight',
        payload: {
          weight: e.target.value
        }
      });
    }
  })), config.strategy !== ROI_STAT && /*#__PURE__*/react.createElement("div", {
    className: "mr-2 text-sm"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex flex-col space-y-2"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Label */.JU7, null, "Lower & Upper Ranges"), /*#__PURE__*/react.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/react.createElement("div", {
    className: "w-10 text-left"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Label */.JU7, null, "CT")), /*#__PURE__*/react.createElement("div", {
    className: "flex flex-1 space-x-2"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Input */.pde, {
    className: "w-full",
    type: "text",
    value: config.ctLower,
    onChange: e => {
      dispatch({
        type: 'setThreshold',
        payload: {
          ctLower: e.target.value
        }
      });
    }
  })), /*#__PURE__*/react.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Input */.pde, {
    className: "w-full",
    type: "text",
    value: config.ctUpper,
    onChange: e => {
      dispatch({
        type: 'setThreshold',
        payload: {
          ctUpper: e.target.value
        }
      });
    }
  })))), /*#__PURE__*/react.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/react.createElement("div", {
    className: "w-10 text-left"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Label */.JU7, null, "PT")), /*#__PURE__*/react.createElement("div", {
    className: "flex flex-1 space-x-2"
  }, /*#__PURE__*/react.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Input */.pde, {
    className: "w-full",
    type: "text",
    value: config.ptLower,
    onChange: e => {
      dispatch({
        type: 'setThreshold',
        payload: {
          ptLower: e.target.value
        }
      });
    }
  })), /*#__PURE__*/react.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/react.createElement(ui_next_src/* Input */.pde, {
    className: "w-full",
    type: "text",
    value: config.ptUpper,
    onChange: e => {
      dispatch({
        type: 'setThreshold',
        payload: {
          ptUpper: e.target.value
        }
      });
    }
  })))))));
}
/* harmony default export */ const PanelROIThresholdSegmentation_ROIThresholdConfiguration = (ROIThresholdConfiguration);
;// ../../../extensions/tmtv/src/Panels/RectangleROIOptions.tsx






const LOWER_CT_THRESHOLD_DEFAULT = -1024;
const UPPER_CT_THRESHOLD_DEFAULT = 1024;
const LOWER_PT_THRESHOLD_DEFAULT = 2.5;
const UPPER_PT_THRESHOLD_DEFAULT = 100;
const WEIGHT_DEFAULT = 0.41; // a default weight for suv max often used in the literature
const DEFAULT_STRATEGY = ROI_STAT;
function reducer(state, action) {
  const {
    payload
  } = action;
  const {
    strategy,
    ctLower,
    ctUpper,
    ptLower,
    ptUpper,
    weight
  } = payload;
  switch (action.type) {
    case 'setStrategy':
      return {
        ...state,
        strategy
      };
    case 'setThreshold':
      return {
        ...state,
        ctLower: ctLower ? ctLower : state.ctLower,
        ctUpper: ctUpper ? ctUpper : state.ctUpper,
        ptLower: ptLower ? ptLower : state.ptLower,
        ptUpper: ptUpper ? ptUpper : state.ptUpper
      };
    case 'setWeight':
      return {
        ...state,
        weight
      };
    default:
      return state;
  }
}
function RectangleROIOptions() {
  const {
    commandsManager
  } = (0,src.useSystem)();
  const segmentations = (0,cornerstone_src.useSegmentations)();
  const activeSegmentation = segmentations[0];
  const runCommand = (0,react.useCallback)((commandName, commandOptions = {}) => {
    return commandsManager.runCommand(commandName, commandOptions);
  }, [commandsManager]);
  const [config, dispatch] = (0,react.useReducer)(reducer, {
    strategy: DEFAULT_STRATEGY,
    ctLower: LOWER_CT_THRESHOLD_DEFAULT,
    ctUpper: UPPER_CT_THRESHOLD_DEFAULT,
    ptLower: LOWER_PT_THRESHOLD_DEFAULT,
    ptUpper: UPPER_PT_THRESHOLD_DEFAULT,
    weight: WEIGHT_DEFAULT
  });
  const handleROIThresholding = (0,react.useCallback)(() => {
    if (!activeSegmentation) {
      return;
    }
    const segmentationId = activeSegmentation.segmentationId;
    const activeSegmentIndex = esm.segmentation.segmentIndex.getActiveSegmentIndex(segmentationId);
    runCommand('thresholdSegmentationByRectangleROITool', {
      segmentationId,
      config,
      segmentIndex: activeSegmentIndex
    });
  }, [activeSegmentation, config]);
  return /*#__PURE__*/react.createElement("div", {
    className: "invisible-scrollbar mb-1 flex flex-col overflow-y-auto overflow-x-hidden"
  }, /*#__PURE__*/react.createElement(PanelROIThresholdSegmentation_ROIThresholdConfiguration, {
    config: config,
    dispatch: dispatch,
    runCommand: runCommand
  }), activeSegmentation && /*#__PURE__*/react.createElement(ui_next_src/* Button */.$nd, {
    variant: "default",
    className: "my-3 mr-auto w-20",
    onClick: handleROIThresholding
  }, "Run"));
}
/* harmony default export */ const Panels_RectangleROIOptions = (RectangleROIOptions);
;// ../../../extensions/tmtv/src/getToolbarModule.tsx

function getToolbarModule() {
  return [{
    name: 'tmtv.RectangleROIThresholdOptions',
    defaultComponent: Panels_RectangleROIOptions
  }];
}
;// ../../../extensions/tmtv/src/index.tsx







/**
 *
 */
const tmtvExtension = {
  /**
   * Only required property. Should be a unique value across all extensions.
   */
  id: id,
  preRegistration({
    servicesManager,
    commandsManager,
    extensionManager,
    configuration = {}
  }) {
    init({
      servicesManager,
      commandsManager,
      extensionManager,
      configuration
    });
  },
  getToolbarModule: getToolbarModule,
  getPanelModule: src_getPanelModule,
  getHangingProtocolModule: src_getHangingProtocolModule,
  getCommandsModule({
    servicesManager,
    commandsManager,
    extensionManager
  }) {
    return src_commandsModule({
      servicesManager,
      commandsManager,
      extensionManager
    });
  }
};
/* harmony default export */ const tmtv_src = (tmtvExtension);

/***/ })

}]);