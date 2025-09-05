"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[3933],{

/***/ 73933:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ monai_label_src)
});

;// CONCATENATED MODULE: ../../../../extensions/monai-label/package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"@ohif/extension-monai-label"}');
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/id.js

const id = package_namespaceObject.UU;

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(86326);
// EXTERNAL MODULE: ../../../node_modules/prop-types/index.js
var prop_types = __webpack_require__(97598);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/MonaiLabelPanel.css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/ModelSelector.css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/ModelSelector.tsx
/*
Copyright (c) MONAI Consortium
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/




class ModelSelector extends react.Component {
  constructor(props) {
    super(props);
    this.onChangeModel = evt => {
      this.setState({
        currentModel: evt.target.value
      });
      if (this.props.onSelectModel) {
        this.props.onSelectModel(evt.target.value);
      }
    };
    this.currentModel = () => {
      return this.props.currentModel ? this.props.currentModel : this.state.currentModel;
    };
    this.onClickBtn = async () => {
      if (this.state.buttonDisabled) {
        return;
      }
      let model = this.state.currentModel;
      if (!model) {
        console.error('This should never happen!');
        model = this.props.models.length > 0 ? this.props.models[0] : '';
      }
      this.setState({
        buttonDisabled: true
      });
      await this.props.onClick(model);
      this.setState({
        buttonDisabled: false
      });
    };
    const currentModel = props.currentModel ? props.currentModel : props.models.length > 0 ? props.models[0] : '';
    this.state = {
      models: props.models,
      currentModel: currentModel,
      buttonDisabled: false
    };
  }
  static getDerivedStateFromProps(props, current_state) {
    if (current_state.models !== props.models) {
      return {
        models: props.models,
        currentModel: props.models.length > 0 ? props.models[0] : ''
      };
    }
    return null;
  }
  render() {
    const currentModel = this.currentModel();
    return /*#__PURE__*/react.createElement("div", {
      className: "modelSelector"
    }, /*#__PURE__*/react.createElement("table", null, /*#__PURE__*/react.createElement("tbody", null, /*#__PURE__*/react.createElement("tr", null, /*#__PURE__*/react.createElement("td", {
      colSpan: "3"
    }, "Models:")), /*#__PURE__*/react.createElement("tr", null, /*#__PURE__*/react.createElement("td", {
      width: "80%"
    }, /*#__PURE__*/react.createElement("select", {
      className: "selectBox",
      onChange: this.onChangeModel,
      defaultValue: currentModel
    }, this.props.models.map(model => /*#__PURE__*/react.createElement("option", {
      key: model,
      name: model,
      value: model
    }, `${model} `)))), /*#__PURE__*/react.createElement("td", {
      width: "2%"
    }, "\xA0"), /*#__PURE__*/react.createElement("td", {
      width: "18%"
    }, /*#__PURE__*/react.createElement("button", {
      className: "actionButton",
      onClick: this.onClickBtn,
      title: 'Run ' + this.props.title,
      disabled: this.state.isButtonDisabled || !this.props.models.length,
      style: {
        display: this.props.onClick ? 'block' : 'none'
      }
    }, "Run"))))), this.props.usage);
  }
}
ModelSelector.propTypes = {
  name: (prop_types_default()).string,
  title: (prop_types_default()).string,
  models: (prop_types_default()).array,
  currentModel: (prop_types_default()).string,
  usage: (prop_types_default()).any,
  onClick: (prop_types_default()).func,
  onSelectModel: (prop_types_default()).func
};
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/actions/BaseTab.css
// extracted by mini-css-extract-plugin

// EXTERNAL MODULE: ../../core/src/index.ts + 69 modules
var src = __webpack_require__(62037);
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/utils/SegUtils.js
/*
Copyright (c) MONAI Consortium
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

function currentSegmentsInfo(segmentationService) {
  const info = {};
  const indices = new Set();
  const segmentations = segmentationService.getSegmentations();
  if (segmentations && Object.keys(segmentations).length > 0) {
    const segmentation = segmentations['0'];
    const {
      segments
    } = segmentation.config;
    for (const segmentIndex of Object.keys(segments)) {
      const segment = segments[segmentIndex];
      info[segment.label] = {
        segmentIndex: segment.segmentIndex,
        color: segment.color
      };
      indices.add(segment.segmentIndex);
    }
  }
  return {
    info,
    indices
  };
}

;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/actions/BaseTab.tsx
/*
Copyright (c) MONAI Consortium
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/






class BaseTab extends react.Component {
  constructor(props) {
    super(props);
    this.notification = void 0;
    this.uiModelService = void 0;
    this.tabId = void 0;
    this.onSelectActionTab = evt => {
      this.props.onSelectActionTab(evt.currentTarget.value);
    };
    this.onEnterActionTab = () => {};
    this.onLeaveActionTab = () => {};
    this.onSegmentCreated = id => {};
    this.onSegmentUpdated = id => {};
    this.onSegmentDeleted = id => {};
    this.onSegmentSelected = id => {};
    this.onSelectModel = model => {};
    this.segmentInfo = () => {
      return currentSegmentsInfo(this.props.servicesManager.services.segmentationService).info;
    };
    this.notification = new src.UINotificationService();
    this.uiModelService = new src.UIModalService();
    this.tabId = 'tab-' + this.props.tabIndex;
  }
}
BaseTab.propTypes = {
  tabIndex: (prop_types_default()).number,
  info: (prop_types_default()).any,
  client: (prop_types_default()).func,
  updateView: (prop_types_default()).func,
  onSelectActionTab: (prop_types_default()).func,
  onOptionsConfig: (prop_types_default()).func,
  getActiveViewportInfo: (prop_types_default()).func,
  servicesManager: (prop_types_default()).any,
  commandsManager: (prop_types_default()).any
};
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/utils/GenericAnatomyColors.js
/*
Copyright (c) MONAI Consortium
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}
function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
const GenericAnatomyColors_GenericNames = (/* unused pure expression or super */ null && (['james', 'robert', 'john', 'michael', 'william', 'david', 'richard', 'joseph', 'thomas', 'charles', 'christopher', 'daniel', 'matthew', 'anthony', 'mark', 'donald', 'steven', 'paul', 'andrew', 'joshua', 'kenneth', 'kevin', 'brian', 'george', 'edward', 'ronald', 'timothy', 'jason', 'jeffrey', 'ryan', 'jacob', 'gary', 'nicholas', 'eric', 'jonathan', 'stephen', 'larry', 'justin', 'scott', 'brandon', 'benjamin', 'samuel', 'gregory', 'frank', 'alexander', 'raymond', 'patrick', 'jack', 'dennis', 'jerry', 'tyler', 'aaron', 'jose', 'adam', 'henry', 'nathan', 'douglas', 'zachary', 'peter', 'kyle', 'walter', 'ethan', 'jeremy', 'harold', 'keith', 'christian', 'roger', 'noah', 'gerald', 'carl', 'terry', 'sean', 'austin', 'arthur', 'lawrence', 'jesse', 'dylan', 'bryan', 'joe', 'jordan', 'billy', 'bruce', 'albert', 'willie', 'gabriel', 'logan', 'alan', 'juan', 'wayne', 'roy', 'ralph', 'randy', 'eugene', 'vincent', 'russell', 'elijah', 'louis', 'bobby', 'philip', 'johnny', 'mary', 'patricia', 'jennifer', 'linda', 'elizabeth', 'barbara', 'susan', 'jessica', 'sarah', 'karen', 'nancy', 'lisa', 'betty', 'margaret', 'sandra', 'ashley', 'kimberly', 'emily', 'donna', 'michelle', 'dorothy', 'carol', 'amanda', 'melissa', 'deborah', 'stephanie', 'rebecca', 'sharon', 'laura', 'cynthia', 'kathleen', 'amy', 'shirley', 'angela', 'helen', 'anna', 'brenda', 'pamela', 'nicole', 'emma', 'samantha', 'katherine', 'christine', 'debra', 'rachel', 'catherine', 'carolyn', 'janet', 'ruth', 'maria', 'heather', 'diane', 'virginia', 'julie', 'joyce', 'victoria', 'olivia', 'kelly', 'christina', 'lauren', 'joan', 'evelyn', 'judith', 'megan', 'cheryl', 'andrea', 'hannah', 'martha', 'jacqueline', 'frances', 'gloria', 'ann', 'teresa', 'kathryn', 'sara', 'janice', 'jean', 'alice', 'madison', 'doris', 'abigail', 'julia', 'judy', 'grace', 'denise', 'amber', 'marilyn', 'beverly', 'danielle', 'theresa', 'sophia', 'marie', 'diana', 'brittany', 'natalie', 'isabella', 'charlotte', 'rose', 'alexis', 'kayla']));
const GenericAnatomyColors = [{
  label: 'background',
  value: rgbToHex(0, 0, 0)
}, {
  label: 'tissue',
  value: rgbToHex(128, 174, 128)
}, {
  label: 'bone',
  value: rgbToHex(241, 214, 145)
}, {
  label: 'skin',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'connective tissue',
  value: rgbToHex(111, 184, 210)
}, {
  label: 'blood',
  value: rgbToHex(216, 101, 79)
}, {
  label: 'organ',
  value: rgbToHex(221, 130, 101)
}, {
  label: 'mass',
  value: rgbToHex(144, 238, 144)
}, {
  label: 'muscle',
  value: rgbToHex(192, 104, 88)
}, {
  label: 'foreign object',
  value: rgbToHex(220, 245, 20)
}, {
  label: 'waste',
  value: rgbToHex(78, 63, 0)
}, {
  label: 'teeth',
  value: rgbToHex(255, 250, 220)
}, {
  label: 'fat',
  value: rgbToHex(230, 220, 70)
}, {
  label: 'gray matter',
  value: rgbToHex(200, 200, 235)
}, {
  label: 'white matter',
  value: rgbToHex(250, 250, 210)
}, {
  label: 'nerve',
  value: rgbToHex(244, 214, 49)
}, {
  label: 'vein',
  value: rgbToHex(0, 151, 206)
}, {
  label: 'artery',
  value: rgbToHex(216, 101, 79)
}, {
  label: 'capillary',
  value: rgbToHex(183, 156, 220)
}, {
  label: 'ligament',
  value: rgbToHex(183, 214, 211)
}, {
  label: 'tendon',
  value: rgbToHex(152, 189, 207)
}, {
  label: 'cartilage',
  value: rgbToHex(111, 184, 210)
}, {
  label: 'meniscus',
  value: rgbToHex(178, 212, 242)
}, {
  label: 'lymph node',
  value: rgbToHex(68, 172, 100)
}, {
  label: 'lymphatic vessel',
  value: rgbToHex(111, 197, 131)
}, {
  label: 'cerebro-spinal fluid',
  value: rgbToHex(85, 188, 255)
}, {
  label: 'bile',
  value: rgbToHex(0, 145, 30)
}, {
  label: 'urine',
  value: rgbToHex(214, 230, 130)
}, {
  label: 'feces',
  value: rgbToHex(78, 63, 0)
}, {
  label: 'gas',
  value: rgbToHex(218, 255, 255)
}, {
  label: 'fluid',
  value: rgbToHex(170, 250, 250)
}, {
  label: 'edema',
  value: rgbToHex(140, 224, 228)
}, {
  label: 'bleeding',
  value: rgbToHex(188, 65, 28)
}, {
  label: 'necrosis',
  value: rgbToHex(216, 191, 216)
}, {
  label: 'clot',
  value: rgbToHex(145, 60, 66)
}, {
  label: 'embolism',
  value: rgbToHex(150, 98, 83)
}, {
  label: 'head',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'central nervous system',
  value: rgbToHex(244, 214, 49)
}, {
  label: 'brain',
  value: rgbToHex(250, 250, 225)
}, {
  label: 'gray matter of brain',
  value: rgbToHex(200, 200, 215)
}, {
  label: 'telencephalon',
  value: rgbToHex(68, 131, 98)
}, {
  label: 'cerebral cortex',
  value: rgbToHex(128, 174, 128)
}, {
  label: 'right frontal lobe',
  value: rgbToHex(83, 146, 164)
}, {
  label: 'left frontal lobe',
  value: rgbToHex(83, 146, 164)
}, {
  label: 'right temporal lobe',
  value: rgbToHex(162, 115, 105)
}, {
  label: 'left temporal lobe',
  value: rgbToHex(162, 115, 105)
}, {
  label: 'right parietal lobe',
  value: rgbToHex(141, 93, 137)
}, {
  label: 'left parietal lobe',
  value: rgbToHex(141, 93, 137)
}, {
  label: 'right occipital lobe',
  value: rgbToHex(182, 166, 110)
}, {
  label: 'left occipital lobe',
  value: rgbToHex(182, 166, 110)
}, {
  label: 'right insular lobe',
  value: rgbToHex(188, 135, 166)
}, {
  label: 'left insular lobe',
  value: rgbToHex(188, 135, 166)
}, {
  label: 'right limbic lobe',
  value: rgbToHex(154, 150, 201)
}, {
  label: 'left limbic lobe',
  value: rgbToHex(154, 150, 201)
}, {
  label: 'right striatum',
  value: rgbToHex(177, 140, 190)
}, {
  label: 'left striatum',
  value: rgbToHex(177, 140, 190)
}, {
  label: 'right caudate nucleus',
  value: rgbToHex(30, 111, 85)
}, {
  label: 'left caudate nucleus',
  value: rgbToHex(30, 111, 85)
}, {
  label: 'right putamen',
  value: rgbToHex(210, 157, 166)
}, {
  label: 'left putamen',
  value: rgbToHex(210, 157, 166)
}, {
  label: 'right pallidum',
  value: rgbToHex(48, 129, 126)
}, {
  label: 'left pallidum',
  value: rgbToHex(48, 129, 126)
}, {
  label: 'right amygdaloid complex',
  value: rgbToHex(98, 153, 112)
}, {
  label: 'left amygdaloid complex',
  value: rgbToHex(98, 153, 112)
}, {
  label: 'diencephalon',
  value: rgbToHex(69, 110, 53)
}, {
  label: 'thalamus',
  value: rgbToHex(166, 113, 137)
}, {
  label: 'right thalamus',
  value: rgbToHex(122, 101, 38)
}, {
  label: 'left thalamus',
  value: rgbToHex(122, 101, 38)
}, {
  label: 'pineal gland',
  value: rgbToHex(253, 135, 192)
}, {
  label: 'midbrain',
  value: rgbToHex(145, 92, 109)
}, {
  label: 'substantia nigra',
  value: rgbToHex(46, 101, 131)
}, {
  label: 'right substantia nigra',
  value: rgbToHex(0, 108, 112)
}, {
  label: 'left substantia nigra',
  value: rgbToHex(0, 108, 112)
}, {
  label: 'cerebral white matter',
  value: rgbToHex(250, 250, 225)
}, {
  label: 'right superior longitudinal fasciculus',
  value: rgbToHex(127, 150, 88)
}, {
  label: 'left superior longitudinal fasciculus',
  value: rgbToHex(127, 150, 88)
}, {
  label: 'right inferior longitudinal fasciculus',
  value: rgbToHex(159, 116, 163)
}, {
  label: 'left inferior longitudinal fasciculus',
  value: rgbToHex(159, 116, 163)
}, {
  label: 'right arcuate fasciculus',
  value: rgbToHex(125, 102, 154)
}, {
  label: 'left arcuate fasciculus',
  value: rgbToHex(125, 102, 154)
}, {
  label: 'right uncinate fasciculus',
  value: rgbToHex(106, 174, 155)
}, {
  label: 'left uncinate fasciculus',
  value: rgbToHex(106, 174, 155)
}, {
  label: 'right cingulum bundle',
  value: rgbToHex(154, 146, 83)
}, {
  label: 'left cingulum bundle',
  value: rgbToHex(154, 146, 83)
}, {
  label: 'projection fibers',
  value: rgbToHex(126, 126, 55)
}, {
  label: 'right corticospinal tract',
  value: rgbToHex(201, 160, 133)
}, {
  label: 'left corticospinal tract',
  value: rgbToHex(201, 160, 133)
}, {
  label: 'right optic radiation',
  value: rgbToHex(78, 152, 141)
}, {
  label: 'left optic radiation',
  value: rgbToHex(78, 152, 141)
}, {
  label: 'right medial lemniscus',
  value: rgbToHex(174, 140, 103)
}, {
  label: 'left medial lemniscus',
  value: rgbToHex(174, 140, 103)
}, {
  label: 'right superior cerebellar peduncle',
  value: rgbToHex(139, 126, 177)
}, {
  label: 'left superior cerebellar peduncle',
  value: rgbToHex(139, 126, 177)
}, {
  label: 'right middle cerebellar peduncle',
  value: rgbToHex(148, 120, 72)
}, {
  label: 'left middle cerebellar peduncle',
  value: rgbToHex(148, 120, 72)
}, {
  label: 'right inferior cerebellar peduncle',
  value: rgbToHex(186, 135, 135)
}, {
  label: 'left inferior cerebellar peduncle',
  value: rgbToHex(186, 135, 135)
}, {
  label: 'optic chiasm',
  value: rgbToHex(99, 106, 24)
}, {
  label: 'right optic tract',
  value: rgbToHex(156, 171, 108)
}, {
  label: 'left optic tract',
  value: rgbToHex(156, 171, 108)
}, {
  label: 'right fornix',
  value: rgbToHex(64, 123, 147)
}, {
  label: 'left fornix',
  value: rgbToHex(64, 123, 147)
}, {
  label: 'commissural fibers',
  value: rgbToHex(138, 95, 74)
}, {
  label: 'corpus callosum',
  value: rgbToHex(97, 113, 158)
}, {
  label: 'posterior commissure',
  value: rgbToHex(126, 161, 197)
}, {
  label: 'cerebellar white matter',
  value: rgbToHex(194, 195, 164)
}, {
  label: 'CSF space',
  value: rgbToHex(85, 188, 255)
}, {
  label: 'ventricles of brain',
  value: rgbToHex(88, 106, 215)
}, {
  label: 'right lateral ventricle',
  value: rgbToHex(88, 106, 215)
}, {
  label: 'left lateral ventricle',
  value: rgbToHex(88, 106, 215)
}, {
  label: 'right third ventricle',
  value: rgbToHex(88, 106, 215)
}, {
  label: 'left third ventricle',
  value: rgbToHex(88, 106, 215)
}, {
  label: 'cerebral aqueduct',
  value: rgbToHex(88, 106, 215)
}, {
  label: 'fourth ventricle',
  value: rgbToHex(88, 106, 215)
}, {
  label: 'subarachnoid space',
  value: rgbToHex(88, 106, 215)
}, {
  label: 'spinal cord',
  value: rgbToHex(244, 214, 49)
}, {
  label: 'gray matter of spinal cord',
  value: rgbToHex(200, 200, 215)
}, {
  label: 'white matter of spinal cord',
  value: rgbToHex(250, 250, 225)
}, {
  label: 'endocrine system of brain',
  value: rgbToHex(82, 174, 128)
}, {
  label: 'pituitary gland',
  value: rgbToHex(57, 157, 110)
}, {
  label: 'adenohypophysis',
  value: rgbToHex(60, 143, 83)
}, {
  label: 'neurohypophysis',
  value: rgbToHex(92, 162, 109)
}, {
  label: 'meninges',
  value: rgbToHex(255, 244, 209)
}, {
  label: 'dura mater',
  value: rgbToHex(255, 244, 209)
}, {
  label: 'arachnoid',
  value: rgbToHex(255, 244, 209)
}, {
  label: 'pia mater',
  value: rgbToHex(255, 244, 209)
}, {
  label: 'muscles of head',
  value: rgbToHex(201, 121, 77)
}, {
  label: 'salivary glands',
  value: rgbToHex(70, 163, 117)
}, {
  label: 'lips',
  value: rgbToHex(188, 91, 95)
}, {
  label: 'nose',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'tongue',
  value: rgbToHex(166, 84, 94)
}, {
  label: 'soft palate',
  value: rgbToHex(182, 105, 107)
}, {
  label: 'right inner ear',
  value: rgbToHex(229, 147, 118)
}, {
  label: 'left inner ear',
  value: rgbToHex(229, 147, 118)
}, {
  label: 'right external ear',
  value: rgbToHex(174, 122, 90)
}, {
  label: 'left external ear',
  value: rgbToHex(174, 122, 90)
}, {
  label: 'right middle ear',
  value: rgbToHex(201, 112, 73)
}, {
  label: 'left middle ear',
  value: rgbToHex(201, 112, 73)
}, {
  label: 'right eyeball',
  value: rgbToHex(194, 142, 0)
}, {
  label: 'left eyeball',
  value: rgbToHex(194, 142, 0)
}, {
  label: 'skull',
  value: rgbToHex(241, 213, 144)
}, {
  label: 'right frontal bone',
  value: rgbToHex(203, 179, 77)
}, {
  label: 'left frontal bone',
  value: rgbToHex(203, 179, 77)
}, {
  label: 'right parietal bone',
  value: rgbToHex(229, 204, 109)
}, {
  label: 'left parietal bone',
  value: rgbToHex(229, 204, 109)
}, {
  label: 'right temporal bone',
  value: rgbToHex(255, 243, 152)
}, {
  label: 'left temporal bone',
  value: rgbToHex(255, 243, 152)
}, {
  label: 'right sphenoid bone',
  value: rgbToHex(209, 185, 85)
}, {
  label: 'left sphenoid bone',
  value: rgbToHex(209, 185, 85)
}, {
  label: 'right ethmoid bone',
  value: rgbToHex(248, 223, 131)
}, {
  label: 'left ethmoid bone',
  value: rgbToHex(248, 223, 131)
}, {
  label: 'occipital bone',
  value: rgbToHex(255, 230, 138)
}, {
  label: 'maxilla',
  value: rgbToHex(196, 172, 68)
}, {
  label: 'right zygomatic bone',
  value: rgbToHex(255, 255, 167)
}, {
  label: 'right lacrimal bone',
  value: rgbToHex(255, 250, 160)
}, {
  label: 'vomer bone',
  value: rgbToHex(255, 237, 145)
}, {
  label: 'right palatine bone',
  value: rgbToHex(242, 217, 123)
}, {
  label: 'left palatine bone',
  value: rgbToHex(242, 217, 123)
}, {
  label: 'mandible',
  value: rgbToHex(222, 198, 101)
}, {
  label: 'neck',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'muscles of neck',
  value: rgbToHex(213, 124, 109)
}, {
  label: 'pharynx',
  value: rgbToHex(184, 105, 108)
}, {
  label: 'larynx',
  value: rgbToHex(150, 208, 243)
}, {
  label: 'thyroid gland',
  value: rgbToHex(62, 162, 114)
}, {
  label: 'right parathyroid glands',
  value: rgbToHex(62, 162, 114)
}, {
  label: 'left parathyroid glands',
  value: rgbToHex(62, 162, 114)
}, {
  label: 'skeleton of neck',
  value: rgbToHex(242, 206, 142)
}, {
  label: 'hyoid bone',
  value: rgbToHex(250, 210, 139)
}, {
  label: 'cervical vertebral column',
  value: rgbToHex(255, 255, 207)
}, {
  label: 'thorax',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'trachea',
  value: rgbToHex(182, 228, 255)
}, {
  label: 'bronchi',
  value: rgbToHex(175, 216, 244)
}, {
  label: 'lung',
  value: rgbToHex(197, 165, 145)
}, {
  label: 'lung tumor',
  value: rgbToHex(144, 238, 144)
}, {
  label: 'right lung',
  value: rgbToHex(197, 165, 145)
}, {
  label: 'left lung',
  value: rgbToHex(197, 165, 145)
}, {
  label: 'superior lobe of right lung',
  value: rgbToHex(172, 138, 115)
}, {
  label: 'superior lobe of left lung',
  value: rgbToHex(172, 138, 115)
}, {
  label: 'middle lobe of right lung',
  value: rgbToHex(202, 164, 140)
}, {
  label: 'inferior lobe of right lung',
  value: rgbToHex(224, 186, 162)
}, {
  label: 'inferior lobe of left lung',
  value: rgbToHex(224, 186, 162)
}, {
  label: 'pleura',
  value: rgbToHex(255, 245, 217)
}, {
  label: 'heart',
  value: rgbToHex(206, 110, 84)
}, {
  label: 'right atrium',
  value: rgbToHex(210, 115, 89)
}, {
  label: 'left atrium',
  value: rgbToHex(203, 108, 81)
}, {
  label: 'atrial septum',
  value: rgbToHex(233, 138, 112)
}, {
  label: 'ventricular septum',
  value: rgbToHex(195, 100, 73)
}, {
  label: 'right ventricle of heart',
  value: rgbToHex(181, 85, 57)
}, {
  label: 'left ventricle of heart',
  value: rgbToHex(152, 55, 13)
}, {
  label: 'mitral valve',
  value: rgbToHex(159, 63, 27)
}, {
  label: 'tricuspid valve',
  value: rgbToHex(166, 70, 38)
}, {
  label: 'aortic valve',
  value: rgbToHex(218, 123, 97)
}, {
  label: 'pulmonary valve',
  value: rgbToHex(225, 130, 104)
}, {
  label: 'aorta',
  value: rgbToHex(224, 97, 76)
}, {
  label: 'pericardium',
  value: rgbToHex(255, 244, 209)
}, {
  label: 'pericardial cavity',
  value: rgbToHex(184, 122, 154)
}, {
  label: 'esophagus',
  value: rgbToHex(211, 171, 143)
}, {
  label: 'thymus',
  value: rgbToHex(47, 150, 103)
}, {
  label: 'mediastinum',
  value: rgbToHex(255, 244, 209)
}, {
  label: 'skin of thoracic wall',
  value: rgbToHex(173, 121, 88)
}, {
  label: 'muscles of thoracic wall',
  value: rgbToHex(188, 95, 76)
}, {
  label: 'skeleton of thorax',
  value: rgbToHex(255, 239, 172)
}, {
  label: 'thoracic vertebral column',
  value: rgbToHex(226, 202, 134)
}, {
  label: 'ribs',
  value: rgbToHex(253, 232, 158)
}, {
  label: 'sternum',
  value: rgbToHex(244, 217, 154)
}, {
  label: 'right clavicle',
  value: rgbToHex(205, 179, 108)
}, {
  label: 'left clavicle',
  value: rgbToHex(205, 179, 108)
}, {
  label: 'abdominal cavity',
  value: rgbToHex(186, 124, 161)
}, {
  label: 'abdomen',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'peritoneum',
  value: rgbToHex(255, 255, 220)
}, {
  label: 'omentum',
  value: rgbToHex(234, 234, 194)
}, {
  label: 'peritoneal cavity',
  value: rgbToHex(204, 142, 178)
}, {
  label: 'retroperitoneal space',
  value: rgbToHex(180, 119, 153)
}, {
  label: 'stomach',
  value: rgbToHex(216, 132, 105)
}, {
  label: 'duodenum',
  value: rgbToHex(255, 253, 229)
}, {
  label: 'small bowel',
  value: rgbToHex(205, 167, 142)
}, {
  label: 'colon',
  value: rgbToHex(204, 168, 143)
}, {
  label: 'anus',
  value: rgbToHex(255, 224, 199)
}, {
  label: 'liver',
  value: rgbToHex(221, 130, 101)
}, {
  label: 'liver tumor',
  value: rgbToHex(144, 238, 144)
}, {
  label: 'biliary tree',
  value: rgbToHex(0, 145, 30)
}, {
  label: 'gallbladder',
  value: rgbToHex(139, 150, 98)
}, {
  label: 'pancreas',
  value: rgbToHex(249, 180, 111)
}, {
  label: 'pancreatic tumor',
  value: rgbToHex(144, 238, 144)
}, {
  label: 'spleen',
  value: rgbToHex(157, 108, 162)
}, {
  label: 'urinary system',
  value: rgbToHex(203, 136, 116)
}, {
  label: 'kidney',
  value: rgbToHex(185, 102, 83)
}, {
  label: 'kidney tumor',
  value: rgbToHex(144, 238, 144)
}, {
  label: 'right kidney',
  value: rgbToHex(185, 102, 83)
}, {
  label: 'left kidney',
  value: rgbToHex(185, 102, 83)
}, {
  label: 'right ureter',
  value: rgbToHex(247, 182, 164)
}, {
  label: 'left ureter',
  value: rgbToHex(247, 182, 164)
}, {
  label: 'urinary bladder',
  value: rgbToHex(222, 154, 132)
}, {
  label: 'urethra',
  value: rgbToHex(124, 186, 223)
}, {
  label: 'right adrenal gland',
  value: rgbToHex(249, 186, 150)
}, {
  label: 'left adrenal gland',
  value: rgbToHex(249, 186, 150)
}, {
  label: 'female internal genitalia',
  value: rgbToHex(244, 170, 147)
}, {
  label: 'uterus',
  value: rgbToHex(255, 181, 158)
}, {
  label: 'right fallopian tube',
  value: rgbToHex(255, 190, 165)
}, {
  label: 'left fallopian tube',
  value: rgbToHex(227, 153, 130)
}, {
  label: 'right ovary',
  value: rgbToHex(213, 141, 113)
}, {
  label: 'left ovary',
  value: rgbToHex(213, 141, 113)
}, {
  label: 'vagina',
  value: rgbToHex(193, 123, 103)
}, {
  label: 'male internal genitalia',
  value: rgbToHex(216, 146, 127)
}, {
  label: 'prostate',
  value: rgbToHex(230, 158, 140)
}, {
  label: 'right seminal vesicle',
  value: rgbToHex(245, 172, 147)
}, {
  label: 'left seminal vesicle',
  value: rgbToHex(245, 172, 147)
}, {
  label: 'right deferent duct',
  value: rgbToHex(241, 172, 151)
}, {
  label: 'left deferent duct',
  value: rgbToHex(241, 172, 151)
}, {
  label: 'skin of abdominal wall',
  value: rgbToHex(177, 124, 92)
}, {
  label: 'muscles of abdominal wall',
  value: rgbToHex(171, 85, 68)
}, {
  label: 'skeleton of abdomen',
  value: rgbToHex(217, 198, 131)
}, {
  label: 'lumbar vertebral column',
  value: rgbToHex(212, 188, 102)
}, {
  label: 'female external genitalia',
  value: rgbToHex(185, 135, 134)
}, {
  label: 'male external genitalia',
  value: rgbToHex(185, 135, 134)
}, {
  label: 'skeleton of upper limb',
  value: rgbToHex(198, 175, 125)
}, {
  label: 'muscles of upper limb',
  value: rgbToHex(194, 98, 79)
}, {
  label: 'right upper limb',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'left upper limb',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'right shoulder',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'left shoulder',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'right arm',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'left arm',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'right elbow',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'left elbow',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'right forearm',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'left forearm',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'right wrist',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'left wrist',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'right hand',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'left hand',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'skeleton of lower limb',
  value: rgbToHex(255, 238, 170)
}, {
  label: 'muscles of lower limb',
  value: rgbToHex(206, 111, 93)
}, {
  label: 'right lower limb',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'left lower limb',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'right hip',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'left hip',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'right thigh',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'left thigh',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'right knee',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'left knee',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'right leg',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'left leg',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'right foot',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'left foot',
  value: rgbToHex(177, 122, 101)
}, {
  label: 'peripheral nervous system',
  value: rgbToHex(216, 186, 0)
}, {
  label: 'autonomic nerve',
  value: rgbToHex(255, 226, 77)
}, {
  label: 'sympathetic trunk',
  value: rgbToHex(255, 243, 106)
}, {
  label: 'cranial nerves',
  value: rgbToHex(255, 234, 92)
}, {
  label: 'vagus nerve',
  value: rgbToHex(240, 210, 35)
}, {
  label: 'peripheral nerve',
  value: rgbToHex(224, 194, 0)
}, {
  label: 'circulatory system',
  value: rgbToHex(213, 99, 79)
}, {
  label: 'systemic arterial system',
  value: rgbToHex(217, 102, 81)
}, {
  label: 'systemic venous system',
  value: rgbToHex(0, 147, 202)
}, {
  label: 'pulmonary arterial system',
  value: rgbToHex(0, 122, 171)
}, {
  label: 'pulmonary venous system',
  value: rgbToHex(186, 77, 64)
}, {
  label: 'lymphatic system',
  value: rgbToHex(111, 197, 131)
}, {
  label: 'needle',
  value: rgbToHex(240, 255, 30)
}, {
  label: 'region 0',
  value: rgbToHex(185, 232, 61)
}, {
  label: 'region 1',
  value: rgbToHex(0, 226, 255)
}, {
  label: 'region 2',
  value: rgbToHex(251, 159, 255)
}, {
  label: 'region 3',
  value: rgbToHex(230, 169, 29)
}, {
  label: 'region 4',
  value: rgbToHex(0, 194, 113)
}, {
  label: 'region 5',
  value: rgbToHex(104, 160, 249)
}, {
  label: 'region 6',
  value: rgbToHex(221, 108, 158)
}, {
  label: 'region 7',
  value: rgbToHex(137, 142, 0)
}, {
  label: 'region 8',
  value: rgbToHex(230, 70, 0)
}, {
  label: 'region 9',
  value: rgbToHex(0, 147, 0)
}, {
  label: 'region 10',
  value: rgbToHex(0, 147, 248)
}, {
  label: 'region 11',
  value: rgbToHex(231, 0, 206)
}, {
  label: 'region 12',
  value: rgbToHex(129, 78, 0)
}, {
  label: 'region 13',
  value: rgbToHex(0, 116, 0)
}, {
  label: 'region 14',
  value: rgbToHex(0, 0, 255)
}, {
  label: 'region 15',
  value: rgbToHex(157, 0, 0)
}, {
  label: 'unknown',
  value: rgbToHex(100, 100, 130)
}, {
  label: 'cyst',
  value: rgbToHex(205, 205, 100)
}];
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/utils/GenericUtils.js
/*
Copyright (c) MONAI Consortium
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
function randomRGB(toHex = false) {
  const o = Math.round,
    r = Math.random,
    s = 255;
  const x = o(r() * s);
  const y = o(r() * s);
  const z = o(r() * s);
  return toHex ? GenericUtils_rgbToHex(x, y, z) : {
    r: x,
    g: y,
    b: z
  };
}
function randomName() {
  return GenericNames[getRandomInt(0, GenericNames.length)];
}
function GenericUtils_componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}
function GenericUtils_rgbToHex(r, g, b) {
  return '#' + GenericUtils_componentToHex(r) + GenericUtils_componentToHex(g) + GenericUtils_componentToHex(b);
}
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
function fixedRGBForLabel(str, toHex = false) {
  const r = generateIntForString(str);
  const x = 2 * r % 256;
  const y = 3 * r % 256;
  const z = 5 * r % 256;
  return toHex ? GenericUtils_rgbToHex(x, y, z) : {
    r: x,
    g: y,
    b: z
  };
}
function generateIntForString(str) {
  let hash = str.length * 4;
  for (let i = 0; i < str.length; ++i) {
    hash += str.charCodeAt(i);
  }
  return hash;
}
function getLabelColor(label, rgb = true, random = true) {
  const name = label.toLowerCase();
  for (const i of GenericAnatomyColors) {
    if (i.label === name) {
      return rgb ? hexToRgb(i.value) : i.value;
    }
  }
  if (random) {
    return fixedRGBForLabel(label, !rgb);
  }
  return null;
}
function hideNotification(nid, notification) {
  if (!nid) {
    window.snackbar.hideAll();
  } else {
    notification.hide(nid);
  }
}
class CookieUtils {
  static setCookie(name, value, exp_y, exp_m, exp_d, path, domain, secure) {
    let cookie_string = name + '=' + escape(value);
    if (exp_y) {
      let expires = new Date(exp_y, exp_m, exp_d);
      cookie_string += '; expires=' + expires.toGMTString();
    }
    if (path) {
      cookie_string += '; path=' + escape(path);
    }
    if (domain) {
      cookie_string += '; domain=' + escape(domain);
    }
    if (secure) {
      cookie_string += '; secure';
    }
    document.cookie = cookie_string;
  }
  static getCookie(cookie_name) {
    let results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
    // console.log('Cookie results: ', results);
    if (results) {
      return unescape(results[2]);
    } else {
      return null;
    }
  }
  static getCookieString(name, defaultVal = '') {
    const val = CookieUtils.getCookie(name);
    // console.log(name + ' = ' + val + ' (default: ' + defaultVal + ' )');
    if (!val || val === 'undefined' || val === 'null' || val === '') {
      CookieUtils.setCookie(name, defaultVal);
      return defaultVal;
    }
    return val;
  }
  static getCookieBool(name, defaultVal = false) {
    const val = CookieUtils.getCookieString(name, defaultVal);
    return !!JSON.parse(String(val).toLowerCase());
  }
  static getCookieNumber(name, defaultVal = 0) {
    const val = CookieUtils.getCookieString(name, defaultVal);
    return Number(val);
  }
}

;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/actions/AutoSegmentation.tsx
/*
Copyright (c) MONAI Consortium
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/





class AutoSegmentation extends BaseTab {
  constructor(props) {
    super(props);
    this.modelSelector = void 0;
    this.onSelectModel = model => {
      console.log('Selecting  Auto Segmentation Model...');
      console.log(model);
      this.setState({
        currentModel: model
      });
    };
    this.onSegmentation = async () => {
      const {
        currentModel,
        currentLabel,
        clickPoints
      } = this.state;
      const {
        info
      } = this.props;
      const {
        displaySet
      } = this.props.getActiveViewportInfo();
      const models = this.getModels();
      let selectedModel = 0;
      for (const model of models) {
        if (!currentModel || model === currentModel) {
          break;
        }
        selectedModel++;
      }
      const model = models.length > 0 ? models[selectedModel] : null;
      if (!model) {
        this.notification.show({
          title: 'MONAI Label',
          message: 'Something went wrong: Model is not selected',
          type: 'error',
          duration: 10000
        });
        return;
      }
      const nid = this.notification.show({
        title: 'MONAI Label - ' + model,
        message: 'Running Auto-Segmentation...',
        type: 'info',
        duration: 7000
      });
      const config = this.props.onOptionsConfig();
      const params = config && config.infer && config.infer[model] ? config.infer[model] : {};
      const label_names = info.modelLabelNames[model];
      const label_classes = info.modelLabelIndices[model];
      if (info.data.models[model].type === 'vista3d') {
        const bodyComponents = ['kidney', 'lung', 'bone', 'lung tumor', 'uterus', 'postcava'];
        const exclusionValues = bodyComponents.map(cls_name => info.modelLabelToIdxMap[model][cls_name]);
        const filteredLabelClasses = label_classes.filter(value => !exclusionValues.includes(value));
        params['label_prompt'] = filteredLabelClasses;
      }
      const response = await this.props.client().infer(model, displaySet.SeriesInstanceUID, params);
      // console.log(response);

      hideNotification(nid, this.notification);
      if (response.status !== 200) {
        this.notification.show({
          title: 'MONAI Label - ' + model,
          message: 'Failed to Run Segmentation',
          type: 'error',
          duration: 6000
        });
        return;
      }
      this.notification.show({
        title: 'MONAI Label - ' + model,
        message: 'Running Segmentation - Successful',
        type: 'success',
        duration: 4000
      });
      this.props.updateView(response, model, label_names);
    };
    this.modelSelector = /*#__PURE__*/react.createRef();
    this.state = {
      currentModel: null
    };
  }
  getModels() {
    const {
      info
    } = this.props;
    const models = Object.keys(info.data.models).filter(m => info.data.models[m].type === 'segmentation' || info.data.models[m].type === 'vista3d');
    return models;
  }
  render() {
    const models = this.getModels();
    return /*#__PURE__*/react.createElement("div", {
      className: "tab"
    }, /*#__PURE__*/react.createElement("input", {
      type: "radio",
      name: "rd",
      id: this.tabId,
      className: "tab-switch",
      defaultValue: "segmentation",
      onClick: this.onSelectActionTab,
      defaultChecked: true
    }), /*#__PURE__*/react.createElement("label", {
      htmlFor: this.tabId,
      className: "tab-label"
    }, "Auto-Segmentation"), /*#__PURE__*/react.createElement("div", {
      className: "tab-content"
    }, /*#__PURE__*/react.createElement(ModelSelector, {
      ref: this.modelSelector,
      name: "segmentation",
      title: "Segmentation",
      models: models,
      currentModel: this.state.currentModel,
      onClick: this.onSegmentation,
      onSelectModel: this.onSelectModel,
      usage: /*#__PURE__*/react.createElement("div", {
        style: {
          fontSize: 'smaller'
        }
      }, /*#__PURE__*/react.createElement("br", null), /*#__PURE__*/react.createElement("p", null, "Experience fully automated segmentation for ", /*#__PURE__*/react.createElement("b", null, "everything"), ' ', "from the pre-trained model."))
    })));
  }
}
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/actions/PointPrompts.css
// extracted by mini-css-extract-plugin

// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/index.js
var esm = __webpack_require__(4667);
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/actions/PointPrompts.tsx
/*
Copyright (c) MONAI Consortium
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/







class PointPrompts extends BaseTab {
  constructor(props) {
    super(props);
    this.modelSelector = void 0;
    this.onSelectModel = model => {
      // console.log('Selecting  (Point) Interaction Model...');
      const currentLabel = null;
      const clickPoints = new Map();
      this.setState({
        currentModel: model,
        currentLabel: currentLabel,
        clickPoints: clickPoints,
        availableOrgans: this.getModelLabels(model)
      });
      this.clearAllPoints();
    };
    this.onEnterActionTab = () => {
      this.props.commandsManager.runCommand('setToolActive', {
        toolName: 'ProbeMONAILabel'
      });
      // console.info('Here we activate the probe');
    };
    this.onLeaveActionTab = () => {
      this.onChangeLabel(null);
      this.props.commandsManager.runCommand('setToolDisable', {
        toolName: 'ProbeMONAILabel'
      });
      // console.info('Here we deactivate the probe');
    };
    this.onRunInference = async () => {
      const {
        currentModel,
        currentLabel,
        clickPoints
      } = this.state;
      const {
        info
      } = this.props;
      const {
        viewport,
        displaySet
      } = this.props.getActiveViewportInfo();
      const models = this.getModels();
      let selectedModel = 0;
      for (const model of models) {
        if (!currentModel || model === currentModel) {
          break;
        }
        selectedModel++;
      }
      const model = models.length > 0 ? models[selectedModel] : null;
      if (!model) {
        this.notification.show({
          title: 'MONAI Label',
          message: 'Something went wrong: Model is not selected',
          type: 'error',
          duration: 10000
        });
        return;
      }
      const nid = this.notification.show({
        title: 'MONAI Label - ' + model,
        message: 'Running Point Based Inference...',
        type: 'info',
        duration: 4000
      });
      const {
        cornerstoneViewportService
      } = this.props.servicesManager.services;
      const viewportInfo = cornerstoneViewportService.getViewportInfo(viewport.viewportId);
      const {
        worldToIndex
      } = viewportInfo.viewportData.data[0].volume.imageData;
      const manager = esm.annotation.state.getAnnotationManager();
      clickPoints[currentLabel] = manager.saveAnnotations(null, 'ProbeMONAILabel');
      const points = {};
      let label_names = [];
      for (const label in clickPoints) {
        // console.log(clickPoints[label]);
        for (const uid in clickPoints[label]) {
          const annotations = clickPoints[label][uid]['ProbeMONAILabel'];
          // console.log(annotations);
          points[label] = [];
          for (const annotation of annotations) {
            const pt = annotation.data.handles.points[0];
            points[label].push(worldToIndex(pt).map(Math.round));
          }
        }
        label_names.push(label);
      }
      const config = this.props.onOptionsConfig();
      const params = config && config.infer && config.infer[model] ? config.infer[model] : {};
      let sidx = -1;
      if (info.data.models[model].type === 'vista3d') {
        params['points'] = points[currentLabel];
        params['point_labels'] = new Array(params['points'].length).fill(1);
        if (points['background'] && points['background'].length > 0) {
          for (let i = 0; i < points['background'].length; i++) {
            params['point_labels'].push(0);
          }
          params['points'] = params['points'].concat(points['background']);
        }
        params['label_prompt'] = [info.modelLabelToIdxMap[model][currentLabel]];
        label_names = [currentLabel];
      } else if (info.data.models[model].type === 'deepedit') {
        params['background'] = [];
        for (const label in points) {
          params[label] = points[label];
        }
      } else {
        let bg = points['background'] && points['background'].length ? points['background'] : [];
        let fg = points[currentLabel];
        if (info.data.models[model].dimension === 2) {
          sidx = fg.length ? fg[fg.length - 1][2] : bg.length ? bg[bg.length - 1][2] : -1;
          fg = fg.filter(p => p[2] === sidx);
          bg = bg.filter(p => p[2] === sidx);
        }
        params['foreground'] = fg;
        params['background'] = bg;
        label_names = [currentLabel];
      }
      const response = await this.props.client().infer(model, displaySet.SeriesInstanceUID, params);
      // console.log(response);

      hideNotification(nid, this.notification);
      if (response.status !== 200) {
        this.notification.show({
          title: 'MONAI Label - ' + model,
          message: 'Failed to Run Inference for Point Prompts',
          type: 'error',
          duration: 6000
        });
        return;
      }
      this.notification.show({
        title: 'MONAI Label - ' + model,
        message: 'Running Inference for Point Prompts - Successful',
        type: 'success',
        duration: 4000
      });
      const label_class_unknown = info.data.models[model].type === 'deepgrow';
      console.log('Target Labels to update: ', label_names, label_class_unknown);
      this.props.updateView(response, model, label_names, true, label_class_unknown, sidx);
    };
    this.initPoints = () => {
      const label = this.state.currentLabel;
      if (!label) {
        console.log('Current Label is Null (No need to init)');
        return;
      }
      const {
        toolGroupService,
        viewportGridService
      } = this.props.servicesManager.services;
      const {
        viewports,
        activeViewportId
      } = viewportGridService.getState();
      const viewport = viewports.get(activeViewportId);
      const {
        viewportOptions
      } = viewport;
      const toolGroupId = viewportOptions.toolGroupId;
      const colorMap = this.segmentInfo();
      const customColor = this.segColorToRgb(colorMap[label]);
      toolGroupService.setToolConfiguration(toolGroupId, 'ProbeMONAILabel', {
        customColor: customColor
      });
      const annotations = this.state.clickPoints[label];
      if (annotations) {
        const manager = esm.annotation.state.getAnnotationManager();
        manager.restoreAnnotations(annotations, null, 'ProbeMONAILabel');
      }
    };
    this.clearPoints = () => {
      esm.annotation.state.getAnnotationManager().removeAllAnnotations();
      this.props.servicesManager.services.cornerstoneViewportService.getRenderingEngine().render();
    };
    this.clearAllPoints = () => {
      const clickPoints = new Map();
      this.setState({
        clickPoints: clickPoints
      });
      this.clearPoints();
    };
    this.onChangeLabel = name => {
      console.log(name, this.state.currentLabel);
      if (name === this.state.currentLabel) {
        console.log('Both new and prev are same');
        return;
      }
      const prev = this.state.currentLabel;
      const clickPoints = this.state.clickPoints;
      if (prev) {
        const manager = esm.annotation.state.getAnnotationManager();
        const annotations = manager.saveAnnotations(null, 'ProbeMONAILabel');
        console.log('Saving Prev annotations...', annotations);
        this.state.clickPoints[prev] = annotations;
        this.clearPoints();
      }
      this.state.currentLabel = name;
      this.setState({
        currentLabel: name,
        clickPoints: clickPoints
      });
      this.initPoints();
    };
    this.modelSelector = /*#__PURE__*/react.createRef();
    this.state = {
      currentModel: null,
      currentLabel: null,
      clickPoints: new Map(),
      availableOrgans: {}
    };
  }
  segColorToRgb(s) {
    const c = s ? s.color : [0, 0, 0];
    return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
  }
  getModels() {
    const {
      info
    } = this.props;
    const models = Object.keys(info.data.models).filter(m => info.data.models[m].type === 'deepgrow' || info.data.models[m].type === 'deepedit' || info.data.models[m].type === 'vista3d');
    return models;
  }
  getModelLabels(model) {
    const {
      info
    } = this.props;
    if (model && info.modelLabelNames[model].length) {
      return info.modelLabelNames[model];
    }
    return info.labels;
  }
  getSelectedModel() {
    let selectedModel = 0;
    const models = this.getModels();
    for (const model of models) {
      if (!this.state.currentModel || model === this.state.currentModel) {
        break;
      }
      selectedModel++;
    }
    const model = models.length > 0 ? models[selectedModel] : null;
    // console.log('Selected Model: ', model);
    if (!model) {
      console.log('Something went error..');
      return null;
    }
    return model;
  }
  render() {
    const models = this.getModels();
    const display = models.length > 0 ? 'block' : 'none';
    const segInfo = this.segmentInfo();
    const labels = this.getModelLabels(this.getSelectedModel());
    return /*#__PURE__*/react.createElement("div", {
      className: "tab",
      style: {
        display: display
      }
    }, /*#__PURE__*/react.createElement("input", {
      type: "radio",
      name: "rd",
      id: this.tabId,
      className: "tab-switch",
      defaultValue: "pointprompts",
      onClick: this.onSelectActionTab
    }), /*#__PURE__*/react.createElement("label", {
      htmlFor: this.tabId,
      className: "tab-label"
    }, "Point Prompts"), /*#__PURE__*/react.createElement("div", {
      className: "tab-content"
    }, /*#__PURE__*/react.createElement(ModelSelector, {
      ref: this.modelSelector,
      name: "pointprompts",
      title: "PointPrompts",
      models: models,
      currentModel: this.state.currentModel,
      onClick: this.onRunInference,
      onSelectModel: this.onSelectModel,
      usage: /*#__PURE__*/react.createElement("div", {
        style: {
          fontSize: 'smaller'
        }
      }, /*#__PURE__*/react.createElement("br", null), /*#__PURE__*/react.createElement("p", null, "Select an anatomy from the segments menu below."), /*#__PURE__*/react.createElement("p", null, "To guide the inference, add foreground clicks:"), /*#__PURE__*/react.createElement("u", null, /*#__PURE__*/react.createElement("a", {
        style: {
          color: 'red',
          cursor: 'pointer'
        },
        onClick: () => this.clearPoints()
      }, "Clear Points")), ' ', "|", ' ', /*#__PURE__*/react.createElement("u", null, /*#__PURE__*/react.createElement("a", {
        style: {
          color: 'red',
          cursor: 'pointer'
        },
        onClick: () => this.clearAllPoints()
      }, "Clear All Points")))
    }), /*#__PURE__*/react.createElement("div", {
      className: "optionsTableContainer"
    }, /*#__PURE__*/react.createElement("hr", null), /*#__PURE__*/react.createElement("p", null, "Available Organ(s):"), /*#__PURE__*/react.createElement("hr", null), /*#__PURE__*/react.createElement("div", {
      className: "bodyTableContainer"
    }, /*#__PURE__*/react.createElement("table", {
      className: "optionsTable"
    }, /*#__PURE__*/react.createElement("tbody", null, /*#__PURE__*/react.createElement("tr", {
      key: "background",
      className: "clickable-row",
      style: {
        backgroundColor: this.state.currentLabel === 'background' ? 'darkred' : 'transparent'
      },
      onClick: () => this.onChangeLabel('background')
    }, /*#__PURE__*/react.createElement("td", null, /*#__PURE__*/react.createElement("span", {
      className: "segColor",
      style: {
        backgroundColor: this.segColorToRgb(segInfo['background'])
      }
    })), /*#__PURE__*/react.createElement("td", null, "background")), labels.filter(l => l !== 'background').map(label => /*#__PURE__*/react.createElement("tr", {
      key: label,
      className: "clickable-row",
      style: {
        backgroundColor: this.state.currentLabel === label ? 'darkblue' : 'transparent',
        cursor: 'pointer'
      },
      onClick: () => this.onChangeLabel(label)
    }, /*#__PURE__*/react.createElement("td", null, /*#__PURE__*/react.createElement("span", {
      className: "segColor",
      style: {
        backgroundColor: this.segColorToRgb(segInfo[label])
      }
    })), /*#__PURE__*/react.createElement("td", null, label)))))))));
  }
}
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/actions/ClassPrompts.tsx
/*
Copyright (c) MONAI Consortium
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/





class ClassPrompts extends BaseTab {
  constructor(props) {
    super(props);
    this.modelSelector = void 0;
    this.onSelectModel = model => {
      console.log('Selecting  (Class/Vista) Interaction Model...');
      console.log(model);
      this.setState({
        currentModel: model,
        selectedOrgans: this.getModelOrgans(model)
      });
    };
    this.onChangeOrgans = (k, evt) => {
      const selectedOrgans = this.state.selectedOrgans;
      selectedOrgans[k] = !!evt.target.checked;
      this.setState({
        selectedOrgans: selectedOrgans
      });
    };
    this.onRunInference = async () => {
      const {
        currentModel,
        currentLabel,
        clickPoints
      } = this.state;
      const {
        info
      } = this.props;
      const {
        displaySet
      } = this.props.getActiveViewportInfo();
      const models = this.getModels();
      let selectedModel = 0;
      for (const model of models) {
        if (!currentModel || model === currentModel) {
          break;
        }
        selectedModel++;
      }
      const model = models.length > 0 ? models[selectedModel] : null;
      if (!model) {
        this.notification.show({
          title: 'MONAI Label',
          message: 'Something went wrong: Model is not selected',
          type: 'error',
          duration: 10000
        });
        return;
      }
      const nid = this.notification.show({
        title: 'MONAI Label - ' + model,
        message: 'Running Class Based Inference...',
        type: 'info',
        duration: 4000
      });
      const label_names = [];
      const label_classes = [];
      for (const label in this.state.selectedOrgans) {
        if (!this.state.selectedOrgans[label]) {
          continue;
        }
        const idx = info.modelLabelToIdxMap[model][label];
        if (idx) {
          label_names.push(label);
          label_classes.push(idx);
        } else {
          console.log("Ignoring this class as it's not defined part of the model", label);
        }
      }
      const config = this.props.onOptionsConfig();
      const params = config && config.infer && config.infer[model] ? config.infer[model] : {};
      params['label_prompt'] = label_classes;
      const response = await this.props.client().infer(model, displaySet.SeriesInstanceUID, params);
      // console.log(response.data);

      hideNotification(nid, this.notification);
      if (response.status !== 200) {
        this.notification.show({
          title: 'MONAI Label',
          message: 'Failed to Run Class Based Inference',
          type: 'error',
          duration: 6000
        });
        console.log(response.data);
        return;
      }
      this.notification.show({
        title: 'MONAI Label',
        message: 'Run Class Based Inference - Successful',
        type: 'success',
        duration: 4000
      });
      this.props.updateView(response, model, label_names, true);
    };
    this.updateOrganSelection = label_classes => {
      const {
        selectedOrgans
      } = this.state;
      const models = this.getModels();
      const model_id = this.state.currentModel ? this.state.currentModel : models[0];

      // Reset Previous selection
      for (const name in selectedOrgans) {
        selectedOrgans[name] = false;
      }
      for (const cls_name of label_classes) {
        const idx = this.props.info.modelLabelToIdxMap[model_id][cls_name];
        if (idx) {
          selectedOrgans[cls_name] = true;
        }
      }
      this.setState({
        selectedOrgans: selectedOrgans
      });
    };
    // TODO:: Select By label name instead of hard-coded indices
    this.onOrgansClickBtn = async () => {
      const selected_organs_indx = ['liver', 'bladder', 'colon', 'dudenum', 'esphagus', 'gallbladder', 'spleen', 'pancreas', 'right kidney', 'right adrenal gland', 'left adrenal gland', 'stomach', 'left kidney', 'bladder', 'prostate or uterus', 'rectum', 'small bowel'];
      this.updateOrganSelection(selected_organs_indx);
    };
    this.onVascularClickBtn = async () => {
      const selected_organs_indx = ['aorta', 'inferior vena cava', 'portal vein and splenic vein', 'hepatic vessel', 'pulmonary artery', 'left iliac artery', 'right iliac artery', 'left iliac vena', 'right iliac vena'];
      this.updateOrganSelection(selected_organs_indx);
    };
    this.onBonesClickBtn = async () => {
      const selected_organs_indx = ['vertebrae l5', 'vertebrae l4', 'vertebrae l3', 'vertebrae l2', 'vertebrae l1', 'vertebrae t12', 'vertebrae t11', 'vertebrae t10', 'vertebrae t9', 'vertebrae t8', 'vertebrae t7', 'vertebrae t6', 'vertebrae t5', 'vertebrae t4', 'vertebrae t3', 'vertebrae t2', 'vertebrae t1', 'vertebrae c7', 'vertebrae c6', 'vertebrae c5', 'vertebrae c4', 'vertebrae c3', 'vertebrae c2', 'vertebrae c1', 'left rib 1', 'left rib 2', 'left rib 3', 'left rib 4', 'left rib 5', 'left rib 6', 'left rib 7', 'left rib 8', 'left rib 9', 'left rib 10', 'left rib 11', 'left rib 12', 'right rib 1', 'right rib 2', 'right rib 3', 'right rib 4', 'right rib 5', 'right rib 6', 'right rib 7', 'right rib 8', 'right rib 9', 'right rib 10', 'right rib 11', 'right rib 12', 'left humerus', 'right humerus', 'left scapula', 'right scapula', 'left clavicula', 'right clavicula', 'left femur', 'right femur', 'left hip', 'right hip', 'sacrum'];
      this.updateOrganSelection(selected_organs_indx);
    };
    this.onLungsClickBtn = async () => {
      const selected_organs_indx = ['left lung upper lobe', 'left lung lower lobe', 'right lung upper lobe', 'right lung middle lobe', 'right lung lower lobe', 'trachea', 'heart', 'heart myocardium', 'left heart atrium', 'left heart ventricle', 'right heart atrium', 'right heart ventricle'];
      this.updateOrganSelection(selected_organs_indx);
    };
    this.onMusclesClickBtn = async () => {
      const selected_organs_indx = ['left gluteus maximus', 'right gluteus maximus', 'left gluteus medius', 'right gluteus medius', 'left gluteus minimus', 'right gluteus minimus', 'left autochthon', 'right autochthon', 'left iliopsoas', 'left iliopsoas'];
      this.updateOrganSelection(selected_organs_indx);
    };
    this.modelSelector = /*#__PURE__*/react.createRef();
    this.state = {
      currentModel: null,
      selectedOrgans: {}
    };
  }
  getModels() {
    const {
      info
    } = this.props;
    const models = Object.keys(info.data.models).filter(m => info.data.models[m].type === 'segmentation' || info.data.models[m].type === 'vista3d');
    return models;
  }
  getModelOrgans(model) {
    const selectedOrgans = {};
    const {
      info
    } = this.props;
    if (model && info.modelLabelNames[model].length) {
      for (const label of info.modelLabelNames[model]) {
        if (label !== 'background') {
          selectedOrgans[label] = false;
        }
      }
    }
    console.log(selectedOrgans);
    return selectedOrgans;
  }
  segColorToRgb(s) {
    const c = s ? s.color : [0, 0, 0];
    return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
  }
  render() {
    const models = this.getModels();
    const display = models.length > 0 ? 'block' : 'none';
    const segInfo = this.segmentInfo();
    if (Object.keys(this.state.selectedOrgans).length === 0 && models.length > 0) {
      this.state.selectedOrgans = this.getModelOrgans(models[0]);
    }
    return /*#__PURE__*/react.createElement("div", {
      className: "tab",
      style: {
        display: display
      }
    }, /*#__PURE__*/react.createElement("input", {
      type: "radio",
      name: "rd",
      id: this.tabId,
      className: "tab-switch",
      defaultValue: "segmentation",
      onClick: this.onSelectActionTab
    }), /*#__PURE__*/react.createElement("label", {
      htmlFor: this.tabId,
      className: "tab-label"
    }, "Class Prompts"), /*#__PURE__*/react.createElement("div", {
      className: "tab-content"
    }, /*#__PURE__*/react.createElement(ModelSelector, {
      ref: this.modelSelector,
      name: "segmentation",
      title: "Segmentation VISTA",
      models: models,
      currentModel: this.state.currentModel,
      onClick: this.onRunInference,
      onSelectModel: this.onSelectModel,
      usage: /*#__PURE__*/react.createElement("div", {
        style: {
          fontSize: 'smaller'
        }
      }, /*#__PURE__*/react.createElement("br", null), /*#__PURE__*/react.createElement("p", null, "Choose following structures or individual classes"))
    }), /*#__PURE__*/react.createElement("button", {
      className: "tmpActionButton",
      onClick: this.onOrgansClickBtn,
      title: 'Organs',
      style: {
        backgroundColor: '#00a4d9',
        marginRight: '2px'
      }
    }, "Organs"), /*#__PURE__*/react.createElement("button", {
      className: "tmpActionButton",
      onClick: this.onLungsClickBtn,
      title: 'Lung',
      style: {
        backgroundColor: '#00a4d9'
      }
    }, "Lung/Heart"), /*#__PURE__*/react.createElement("button", {
      className: "tmpActionButton",
      onClick: this.onVascularClickBtn,
      title: 'Vascular',
      style: {
        backgroundColor: '#00a4d9',
        marginRight: '2px'
      }
    }, "Vascular"), /*#__PURE__*/react.createElement("button", {
      className: "tmpActionButton",
      onClick: this.onBonesClickBtn,
      title: 'Bones',
      style: {
        backgroundColor: '#00a4d9',
        marginRight: '2px'
      }
    }, "Bones"), /*#__PURE__*/react.createElement("button", {
      className: "tmpActionButton",
      onClick: this.onMusclesClickBtn,
      title: 'Muscles',
      style: {
        backgroundColor: '#00a4d9',
        marginRight: '2px',
        marginTop: '2px'
      }
    }, "Muscles"), /*#__PURE__*/react.createElement("br", null), /*#__PURE__*/react.createElement("div", {
      className: "optionsTableContainer"
    }, /*#__PURE__*/react.createElement("hr", null), /*#__PURE__*/react.createElement("p", null, "Selected Organ(s):"), /*#__PURE__*/react.createElement("hr", null), /*#__PURE__*/react.createElement("div", {
      className: "bodyTableContainer"
    }, /*#__PURE__*/react.createElement("table", {
      className: "optionsTable"
    }, /*#__PURE__*/react.createElement("tbody", null, Object.entries(this.state.selectedOrgans).map(([k, v]) => /*#__PURE__*/react.createElement("tr", {
      key: k
    }, /*#__PURE__*/react.createElement("td", null, /*#__PURE__*/react.createElement("input", {
      type: "checkbox",
      checked: v,
      onChange: e => this.onChangeOrgans(k, e)
    })), /*#__PURE__*/react.createElement("td", null, /*#__PURE__*/react.createElement("span", {
      className: "segColor",
      style: {
        backgroundColor: this.segColorToRgb(segInfo[k])
      }
    })), /*#__PURE__*/react.createElement("td", null, k)))))))));
  }
}
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/actions/NextSampleForm.css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/actions/NextSampleForm.tsx
/*
Copyright (c) MONAI Consortium
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/




class NextSampleForm extends react.Component {
  constructor(props) {
    super(props);
    this.onSubmit = () => {
      // TODO:: OHIF Doesn't support loading exact series in URI
      const path = window.location.href.split('=');
      path[path.length - 1] = this.props.info.StudyInstanceUID;
      const pathname = path.join('=');
      console.info(pathname);
      const msg = 'This action will reload current page.  Are you sure to continue?';
      if (!window.confirm(msg)) {
        return;
      }
      window.location.href = pathname;
    };
  }
  render() {
    const fields = {
      Modality: 'Modality',
      StudyDate: 'Study Date',
      StudyTime: 'Study Time',
      PatientID: 'Patient ID',
      StudyInstanceUID: 'Study Instance UID',
      SeriesInstanceUID: 'Series Instance UID'
    };
    return /*#__PURE__*/react.createElement("div", {
      className: "nextSampleForm"
    }, /*#__PURE__*/react.createElement("table", {
      className: "optionsTable"
    }, /*#__PURE__*/react.createElement("thead", null, /*#__PURE__*/react.createElement("tr", null, /*#__PURE__*/react.createElement("th", {
      style: {
        width: '30%'
      }
    }, "Field"), /*#__PURE__*/react.createElement("th", null, "Value"))), /*#__PURE__*/react.createElement("tbody", null, Object.keys(fields).map(field => /*#__PURE__*/react.createElement("tr", {
      key: field
    }, /*#__PURE__*/react.createElement("td", null, fields[field]), field === 'SeriesInstanceUID' ? /*#__PURE__*/react.createElement("td", null, /*#__PURE__*/react.createElement("a", {
      rel: "noreferrer noopener",
      target: "_blank",
      href: this.props.info['RetrieveURL']
    }, this.props.info[field])) : /*#__PURE__*/react.createElement("td", null, this.props.info[field]))))), /*#__PURE__*/react.createElement("br", null), /*#__PURE__*/react.createElement("div", {
      className: "mb-3 text-right"
    }, /*#__PURE__*/react.createElement("button", {
      className: "actionButton",
      type: "submit",
      onClick: this.onSubmit
    }, "OK")));
  }
}
NextSampleForm.propTypes = {
  info: (prop_types_default()).any
};
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/actions/ActiveLearning.tsx
/*
Copyright (c) MONAI Consortium
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/




class OptionTable extends BaseTab {
  constructor(props) {
    super(props);
    this.onClickNextSample = async () => {
      const nid = this.notification.show({
        title: 'MONAI Label',
        message: 'Running Active Learning strategy - ' + this.state.strategy,
        type: 'info',
        duration: 60000
      });
      const strategy = this.state.strategy;
      const config = this.props.onOptionsConfig();
      const params = config && config.activelearning && config.activelearning[strategy] ? config.activelearning[strategy] : {};
      const response = await this.props.client().next_sample(strategy, params);
      if (!nid) {
        window.snackbar.hideAll();
      } else {
        this.notification.hide(nid);
      }
      if (response.status !== 200) {
        this.notification.show({
          title: 'MONAI Label',
          message: 'Failed to Fetch Next Sample',
          type: 'error',
          duration: 5000
        });
      } else {
        this.uiModelService.show({
          content: NextSampleForm,
          contentProps: {
            info: response.data
          },
          shouldCloseOnEsc: true,
          title: 'Active Learning - Next Sample',
          customClassName: 'nextSampleForm'
        });
      }
    };
    this.onClickUpdateModel = async () => {
      const training = this.state.training;
      console.debug('Current training status: ' + training);
      const config = this.props.onOptionsConfig();
      const params = config && config.train ? config.train : {};
      const response = training ? await this.props.client().stop_train() : await this.props.client().run_train(params);
      if (response.status !== 200) {
        this.notification.show({
          title: 'MONAI Label',
          message: 'Failed to ' + (training ? 'STOP' : 'RUN') + ' training',
          type: 'error',
          duration: 5000
        });
      } else {
        this.notification.show({
          title: 'MONAI Label',
          message: 'Model update task ' + (training ? 'STOPPED' : 'STARTED'),
          type: 'success',
          duration: 2000
        });
        this.setState({
          training: !training
        });
      }
    };
    this.state = {
      strategy: 'random',
      training: false,
      segmentId: 'liver'
    };
  }
  async componentDidMount() {
    const training = await this.props.client().is_train_running();
    this.setState({
      training: training
    });
  }
  render() {
    const ds = this.props.info.data.datastore;
    const completed = ds && ds.completed ? ds.completed : 0;
    const total = ds && ds.total ? ds.total : 1;
    const activelearning = Math.round(100 * (completed / total)) + '%';
    const activelearningTip = completed + '/' + total + ' samples annotated';
    const ts = this.props.info.data.train_stats ? Object.values(this.props.info.data.train_stats)[0] : null;
    const epochs = ts ? ts.total_time ? 0 : ts.epoch ? ts.epoch : 1 : 0;
    const total_epochs = ts && ts.total_epochs ? ts.total_epochs : 1;
    const training = Math.round(100 * (epochs / total_epochs)) + '%';
    const trainingTip = epochs ? epochs + '/' + total_epochs + ' epochs completed' : 'Not Running';
    const accuracy = ts && ts.best_metric ? Math.round(100 * ts.best_metric) + '%' : '0%';
    const accuracyTip = ts && ts.best_metric ? accuracy + ' is current best metric' : 'not determined';
    const strategies = this.props.info.data.strategies ? this.props.info.data.strategies : {};
    return /*#__PURE__*/react.createElement("div", {
      className: "tab"
    }, /*#__PURE__*/react.createElement("input", {
      className: "tab-switch",
      type: "checkbox",
      id: this.tabId,
      name: "activelearning",
      defaultValue: "activelearning"
    }), /*#__PURE__*/react.createElement("label", {
      className: "tab-label",
      htmlFor: this.tabId
    }, "Active Learning"), /*#__PURE__*/react.createElement("div", {
      className: "tab-content"
    }, /*#__PURE__*/react.createElement("table", {
      style: {
        fontSize: 'smaller',
        width: '100%'
      }
    }, /*#__PURE__*/react.createElement("tbody", null, /*#__PURE__*/react.createElement("tr", null, /*#__PURE__*/react.createElement("td", null, /*#__PURE__*/react.createElement("button", {
      className: "actionInput",
      style: {
        backgroundColor: 'lightgray'
      },
      onClick: this.onClickNextSample
    }, "Next Sample")), /*#__PURE__*/react.createElement("td", null, "\xA0"), /*#__PURE__*/react.createElement("td", null, /*#__PURE__*/react.createElement("button", {
      className: "actionInput",
      style: {
        backgroundColor: 'lightgray'
      },
      onClick: this.onClickUpdateModel
    }, this.state.training ? 'Stop Training' : 'Update Model'))))), /*#__PURE__*/react.createElement("br", null), /*#__PURE__*/react.createElement("table", {
      className: "optionsTable"
    }, /*#__PURE__*/react.createElement("tbody", null, /*#__PURE__*/react.createElement("tr", null, /*#__PURE__*/react.createElement("td", null, "Strategy:"), /*#__PURE__*/react.createElement("td", {
      width: "80%"
    }, /*#__PURE__*/react.createElement("select", {
      className: "actionInput",
      onChange: this.onChangeStrategy,
      defaultValue: this.state.strategy
    }, Object.keys(strategies).map(a => /*#__PURE__*/react.createElement("option", {
      key: a,
      name: a,
      value: a
    }, a))))), /*#__PURE__*/react.createElement("tr", null, /*#__PURE__*/react.createElement("td", {
      colSpan: "2"
    }, "\xA0")), /*#__PURE__*/react.createElement("tr", null, /*#__PURE__*/react.createElement("td", null, "Annotated:"), /*#__PURE__*/react.createElement("td", {
      width: "80%",
      title: activelearningTip
    }, /*#__PURE__*/react.createElement("div", {
      className: "w3-round w3-light-grey w3-tiny"
    }, /*#__PURE__*/react.createElement("div", {
      className: "w3-round w3-container w3-blue w3-center",
      style: {
        backgroundColor: 'white'
      }
    }, activelearning)))), /*#__PURE__*/react.createElement("tr", null, /*#__PURE__*/react.createElement("td", null, "Training:"), /*#__PURE__*/react.createElement("td", {
      title: trainingTip
    }, /*#__PURE__*/react.createElement("div", {
      className: "w3-round w3-light-grey w3-tiny"
    }, /*#__PURE__*/react.createElement("div", {
      className: "w3-round w3-container w3-orange w3-center",
      style: {
        backgroundColor: 'white'
      }
    }, training)))), /*#__PURE__*/react.createElement("tr", null, /*#__PURE__*/react.createElement("td", null, "Train Acc:"), /*#__PURE__*/react.createElement("td", {
      title: accuracyTip
    }, /*#__PURE__*/react.createElement("div", {
      className: "w3-round w3-light-grey w3-tiny"
    }, /*#__PURE__*/react.createElement("div", {
      className: "w3-round w3-container w3-green w3-center",
      style: {
        backgroundColor: 'white'
      }
    }, accuracy))))))));
  }
}
// EXTERNAL MODULE: ../../../node_modules/axios/index.js + 49 modules
var axios = __webpack_require__(17739);
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/services/MonaiLabelClient.js
/*
Copyright (c) MONAI Consortium
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


class MonaiLabelClient {
  constructor(server_url) {
    this.server_url = new URL(server_url);
  }
  async info() {
    let url = new URL('info/', this.server_url);
    return await MonaiLabelClient.api_get(url.toString());
  }
  async infer(model, image, params, label = null, result_extension = '.nrrd', output = 'image') {
    console.log('Running Infer for: ', {
      model,
      image,
      params,
      result_extension,
      output
    });
    let url = new URL('infer/' + encodeURIComponent(model), this.server_url);
    url.searchParams.append('image', image);
    url.searchParams.append('output', output);
    url = url.toString();
    if (result_extension) {
      params.result_extension = result_extension;
      params.result_dtype = 'uint8';
      params.result_compress = false;
    }

    // return the indexes as defined in the config file
    params.restore_label_idx = false;
    return await MonaiLabelClient.api_post(url, params, label, true, 'arraybuffer');
  }
  async next_sample(stategy = 'random', params = {}) {
    const url = new URL('activelearning/' + encodeURIComponent(stategy), this.server_url).toString();
    return await MonaiLabelClient.api_post(url, params, null, false, 'json');
  }
  async save_label(image, label, params) {
    let url = new URL('datastore/label', this.server_url);
    url.searchParams.append('image', image);
    url = url.toString();

    /* debugger; */

    const data = MonaiLabelClient.constructFormDataFromArray(params, label, 'label', 'label.bin');
    return await MonaiLabelClient.api_put_data(url, data, 'json');
  }
  async is_train_running() {
    let url = new URL('train/', this.server_url);
    url.searchParams.append('check_if_running', 'true');
    url = url.toString();
    const response = await MonaiLabelClient.api_get(url);
    return response && response.status === 200 && response.data.status === 'RUNNING';
  }
  async run_train(params) {
    const url = new URL('train/', this.server_url).toString();
    return await MonaiLabelClient.api_post(url, params, null, false, 'json');
  }
  async stop_train() {
    const url = new URL('train/', this.server_url).toString();
    return await MonaiLabelClient.api_delete(url);
  }
  static constructFormDataFromArray(params, data, name, fileName) {
    let formData = new FormData();
    formData.append('params', JSON.stringify(params));
    formData.append(name, data, fileName);
    return formData;
  }
  static constructFormData(params, files) {
    let formData = new FormData();
    formData.append('params', JSON.stringify(params));
    if (files) {
      if (!Array.isArray(files)) {
        files = [files];
      }
      for (let i = 0; i < files.length; i++) {
        formData.append(files[i].name, files[i].data, files[i].fileName);
      }
    }
    return formData;
  }
  static constructFormOrJsonData(params, files) {
    return files ? MonaiLabelClient.constructFormData(params, files) : params;
  }
  static api_get(url) {
    console.debug('GET:: ' + url);
    return axios/* default */.Ay.get(url).then(function (response) {
      console.debug(response);
      return response;
    }).catch(function (error) {
      return error;
    }).finally(function () {});
  }
  static api_delete(url) {
    console.debug('DELETE:: ' + url);
    return axios/* default */.Ay.delete(url).then(function (response) {
      console.debug(response);
      return response;
    }).catch(function (error) {
      return error;
    }).finally(function () {});
  }
  static api_post(url, params, files, form = true, responseType = 'arraybuffer') {
    const data = form ? MonaiLabelClient.constructFormData(params, files) : MonaiLabelClient.constructFormOrJsonData(params, files);
    return MonaiLabelClient.api_post_data(url, data, responseType);
  }
  static api_post_data(url, data, responseType) {
    console.debug('POST:: ' + url);
    return axios/* default */.Ay.post(url, data, {
      responseType: responseType,
      headers: {
        accept: ['application/json', 'multipart/form-data']
      }
    }).then(function (response) {
      console.debug(response);
      return response;
    }).catch(function (error) {
      return error;
    }).finally(function () {});
  }
  static api_put(url, params, files, form = false, responseType = 'json') {
    const data = form ? MonaiLabelClient.constructFormData(params, files) : MonaiLabelClient.constructFormOrJsonData(params, files);
    return MonaiLabelClient.api_put_data(url, data, responseType);
  }
  static api_put_data(url, data, responseType = 'json') {
    console.debug('PUT:: ' + url);
    return axios/* default */.Ay.put(url, data, {
      responseType: responseType,
      headers: {
        accept: ['application/json', 'multipart/form-data']
      }
    }).then(function (response) {
      console.debug(response);
      return response;
    }).catch(function (error) {
      return error;
    });
  }
}
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 1 modules
var dist_esm = __webpack_require__(15327);
// EXTERNAL MODULE: ../../../node_modules/nrrd-js/nrrd.js
var nrrd = __webpack_require__(45609);
// EXTERNAL MODULE: ../../../node_modules/pako/dist/pako.esm.mjs
var pako_esm = __webpack_require__(41135);
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/utils/SegmentationReader.js
/*
Copyright (c) MONAI Consortium
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/



class SegmentationReader {
  static parseNrrdData(data) {
    let nrrdfile = nrrd.parse(data);

    // Currently gzip is not supported in nrrd.js
    if (nrrdfile.encoding === 'gzip') {
      const buffer = pako_esm/* default.inflate */.Ay.inflate(nrrdfile.buffer).buffer;
      nrrdfile.encoding = 'raw';
      nrrdfile.data = new Uint16Array(buffer);
      nrrdfile.buffer = buffer;
    }
    const image = nrrdfile.buffer;
    const header = nrrdfile;
    delete header.data;
    delete header.buffer;
    return {
      header,
      image
    };
  }
}
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/SettingsTable.css
// extracted by mini-css-extract-plugin

// EXTERNAL MODULE: ../../ui-next/src/index.ts + 1053 modules
var ui_next_src = __webpack_require__(2836);
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/SettingsTable.tsx
/*
Copyright (c) MONAI Consortium
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/





class SettingsTable extends react.Component {
  constructor(props) {
    super(props);
    this.onInfo = void 0;
    this.onBlurSeverURL = evt => {
      const url = evt.target.value;
      this.setState({
        url: url
      });
      CookieUtils.setCookie('MONAILABEL_SERVER_URL', url);
      console.log('Settings onBlurSeverURL', url);
    };
    this.onConnect = () => {
      const url = document.getElementById('monailabelServerURL').value;
      this.setState({
        url: url
      });
      CookieUtils.setCookie('MONAILABEL_SERVER_URL', url);
      console.log('Connecting Server', url);
      this.onInfo(url);
    };
    this.onInfo = props.onInfo;
    const _url = CookieUtils.getCookieString('MONAILABEL_SERVER_URL', 'http://' + window.location.host.split(':')[0] + ':8000/');
    const overlap_segments = CookieUtils.getCookieBool('MONAILABEL_OVERLAP_SEGMENTS', true);
    const export_format = CookieUtils.getCookieString('MONAILABEL_EXPORT_FORMAT', 'NRRD');
    this.state = {
      url: _url,
      overlap_segments: overlap_segments,
      export_format: export_format
    };
  }
  render() {
    return /*#__PURE__*/react.createElement("table", {
      className: "settingsTable"
    }, /*#__PURE__*/react.createElement("tbody", null, /*#__PURE__*/react.createElement("tr", null, /*#__PURE__*/react.createElement("td", {
      colSpan: 3
    }, "Server:")), /*#__PURE__*/react.createElement("tr", null, /*#__PURE__*/react.createElement("td", null, /*#__PURE__*/react.createElement("input", {
      id: "monailabelServerURL",
      className: "actionInput",
      name: "monailabelServerURL",
      type: "text",
      defaultValue: this.state.url,
      onBlur: this.onBlurSeverURL
    })), /*#__PURE__*/react.createElement("td", null, "\xA0"), /*#__PURE__*/react.createElement("td", null, /*#__PURE__*/react.createElement("button", {
      className: "actionButton",
      onClick: this.onConnect
    }, /*#__PURE__*/react.createElement(ui_next_src/* Icons */.FI1.ToolReset, {
      width: "12px",
      height: "12px"
    })))), /*#__PURE__*/react.createElement("tr", {
      style: {
        fontSize: 'smaller'
      }
    }, /*#__PURE__*/react.createElement("td", {
      colSpan: 3
    }, /*#__PURE__*/react.createElement("a", {
      href: new URL(this.state.url).toString() + 'info/',
      target: "_blank",
      rel: "noopener noreferrer"
    }, "Info"), /*#__PURE__*/react.createElement("b", null, "\xA0\xA0|\xA0\xA0"), /*#__PURE__*/react.createElement("a", {
      href: new URL(this.state.url).toString() + 'logs/?lines=100',
      target: "_blank",
      rel: "noopener noreferrer"
    }, "Logs")))));
  }
}
// EXTERNAL MODULE: ../../ui/src/index.js + 455 modules
var ui_src = __webpack_require__(98391);
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/actions/OptionsForm.css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/actions/OptionTable.tsx
/*
Copyright (c) MONAI Consortium
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/



class OptionTable_OptionTable extends react.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      seed: 0
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.update_map !== this.props.update_map) {
      // console.log('update_map - Prop changed!');
      if (!Object.keys(this.props.update_map).length) {
        // console.log('Forcing the update.');
        this.setState({
          seed: Math.random()
        });
        return;
      }
      Object.entries(this.props.update_map).map(([k, v]) => {
        const e = document.getElementById(this.props.section + this.props.name + k);
        if (e.type === 'checkbox') {
          e.checked = v;
        } else {
          e.value = v;
        }
      });
    }
  }
  render() {
    const {
      section,
      name,
      name_map
    } = this.props;
    const {
      seed
    } = this.state;
    // console.log('Render Table Object: ' + seed);
    return /*#__PURE__*/react.createElement("div", {
      className: "optionsConfig"
    }, /*#__PURE__*/react.createElement("table", {
      className: "optionsConfigTable"
    }, /*#__PURE__*/react.createElement("thead", null, /*#__PURE__*/react.createElement("tr", null, /*#__PURE__*/react.createElement("th", null, "Key"), /*#__PURE__*/react.createElement("th", null, "Value"))), /*#__PURE__*/react.createElement("tbody", null, Object.entries(name_map).map(([k, v]) => /*#__PURE__*/react.createElement("tr", {
      key: seed + section + name + k
    }, /*#__PURE__*/react.createElement("td", null, k), /*#__PURE__*/react.createElement("td", null, v !== null && typeof v === 'boolean' ? /*#__PURE__*/react.createElement("input", {
      id: section + name + k,
      type: "checkbox",
      defaultChecked: v,
      onChange: e => this.props.onChangeConfig(section, name, k, e)
    }) : v !== null && typeof v === 'object' ? /*#__PURE__*/react.createElement("select", {
      id: section + name + k,
      className: "optionsInput",
      onChange: e => this.props.onChangeConfig(section, name, k, e)
    }, Object.entries(v).map(([a, b]) => /*#__PURE__*/react.createElement("option", {
      key: a,
      name: a,
      value: b
    }, b))) : /*#__PURE__*/react.createElement("input", {
      id: section + name + k,
      type: "text",
      defaultValue: v ? '' + v : '',
      className: "optionsInput",
      onChange: e => this.props.onChangeConfig(section, name, k, e)
    })))))));
  }
}
OptionTable_OptionTable.propTypes = {
  section: (prop_types_default()).string,
  name: (prop_types_default()).string,
  name_map: (prop_types_default()).any,
  update_map: (prop_types_default()).any,
  onChangeConfig: (prop_types_default()).func
};
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/actions/OptionsForm.tsx
/*
Copyright (c) MONAI Consortium
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/





class OptionsForm extends react.Component {
  constructor(props) {
    super(props);
    this.configs = {};
    this.onChangeSection = evt => {
      this.setState({
        section: evt.target.value
      });
    };
    this.onChangeName = evt => {
      this.setState({
        name: evt.target.value
      });
    };
    this.onReset = () => {
      console.log('Reset the config map');
      this.configs = {};
      this.setState({
        config: {},
        section: '',
        name: ''
      });
    };
    this.onChangeConfig = (s, n, k, evt) => {
      // console.log(s + ' => ' + n + ' => ' + k, evt);
      const c = {
        ...this.state.config
      };
      if (!c[s]) {
        c[s] = {};
      }
      if (!c[s][n]) {
        c[s][n] = {};
      }
      if (typeof this.configs[s][n][k] === 'boolean') {
        c[s][n][k] = !!evt.target.checked;
      } else {
        if (typeof this.configs[s][n][k] === 'number') {
          c[s][n][k] = Number.isInteger(this.configs[s][n][k]) ? parseInt(evt.target.value) : parseFloat(evt.target.value);
        } else {
          c[s][n][k] = evt.target.value;
        }
      }
      this.setState({
        config: c
      });
    };
    this.state = {
      config: {
        ...props.config
      },
      section: '',
      name: ''
    };
  }
  getConfigs() {
    const {
      info
    } = this.props;
    const mapping = {
      infer: 'models',
      train: 'trainers',
      activelearning: 'strategies',
      scoring: 'scoring'
    };
    if (!Object.keys(this.configs).length) {
      Object.entries(mapping).forEach(([m, n]) => {
        const obj = info && info.data && info.data[n] ? info.data[n] : {};
        Object.entries(obj).forEach(([k, v]) => {
          if (v && v.config && Object.keys(v.config).length) {
            if (!this.configs[m]) {
              this.configs[m] = {};
            }
            this.configs[m][k] = v.config;
          }
        });
      });
    }
    return this.configs;
  }
  getSection() {
    return this.state.section.length && this.configs[this.state.section] ? this.state.section : Object.keys(this.configs).length ? Object.keys(this.configs)[0] : '';
  }
  getSectionMap(section) {
    return section && this.configs[section] ? this.configs[section] : Object.keys(this.configs).length ? this.configs[Object.keys(this.configs)[0]] : {};
  }
  getName(section_map) {
    return this.state.name.length && section_map[this.state.name] ? this.state.name : Object.keys(section_map).length ? Object.keys(section_map)[0] : '';
  }
  getNameMap(name, section_map) {
    return name && section_map[name] ? section_map[name] : Object.keys(section_map).length ? section_map[Object.keys(section_map)[0]] : {};
  }
  render() {
    // console.log('Render Options Table..');
    // console.log('State Config: ', this.state.config);

    const config = this.getConfigs();
    const section = this.getSection();
    const section_map = this.getSectionMap(section);
    const name = this.getName(section_map);
    const name_map = this.getNameMap(name, section_map);
    const update_map = {};

    // console.log('Config State: ', this.state.config);
    Object.keys(name_map).forEach(k => {
      if (this.state.config[section] && this.state.config[section][name]) {
        const x = this.state.config[section][name][k];
        if (x !== null && x !== undefined) {
          update_map[k] = x;
        }
      }
    });
    // console.log('Update Map: ', update_map);

    return /*#__PURE__*/react.createElement("div", {
      className: "optionsForm"
    }, /*#__PURE__*/react.createElement("table", {
      className: "optionsSection"
    }, /*#__PURE__*/react.createElement("tbody", null, /*#__PURE__*/react.createElement("tr", null, /*#__PURE__*/react.createElement("td", null, "Section:"), /*#__PURE__*/react.createElement("td", null, /*#__PURE__*/react.createElement("select", {
      className: "selectBox",
      name: "selectSection",
      onChange: this.onChangeSection,
      defaultValue: section
    }, Object.keys(config).map(k => /*#__PURE__*/react.createElement("option", {
      key: k,
      value: k
    }, `${k} `))))), /*#__PURE__*/react.createElement("tr", null, /*#__PURE__*/react.createElement("td", null, "Name:"), /*#__PURE__*/react.createElement("td", null, /*#__PURE__*/react.createElement("select", {
      className: "selectBox",
      name: "selectName",
      onChange: this.onChangeName,
      defaultValue: name
    }, Object.keys(section_map).map(k => /*#__PURE__*/react.createElement("option", {
      key: k,
      value: k
    }, `${k} `))))), /*#__PURE__*/react.createElement("tr", null, /*#__PURE__*/react.createElement("td", {
      colSpan: 2
    }, "\xA0")))), /*#__PURE__*/react.createElement(OptionTable_OptionTable, {
      section: section,
      name: name,
      name_map: name_map,
      update_map: update_map,
      onChangeConfig: this.onChangeConfig
    }));
  }
}
OptionsForm.propTypes = {
  info: (prop_types_default()).any,
  config: (prop_types_default()).any
};
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/OptionsInputDialog.tsx
/*
Copyright (c) MONAI Consortium
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/




function optionsInputDialog(uiDialogService, config, info, callback) {
  const dialogId = 'monai-label-options';
  const optionsRef = /*#__PURE__*/react.createRef();
  const onSubmitHandler = ({
    action
  }) => {
    switch (action.id) {
      case 'save':
        callback(optionsRef.current.state.config, action.id);
        uiDialogService.hide(dialogId);
        break;
      case 'cancel':
        callback({}, action.id);
        uiDialogService.hide(dialogId);
        break;
      case 'reset':
        optionsRef.current.onReset();
        break;
    }
  };
  uiDialogService.show({
    id: dialogId,
    centralize: true,
    isDraggable: false,
    showOverlay: true,
    content: ui_src/* Dialog */.lG,
    contentProps: {
      title: 'Options / Configurations',
      noCloseButton: true,
      onClose: () => uiDialogService.hide(dialogId),
      actions: [{
        id: 'reset',
        text: 'Reset',
        type: ui_src/* ButtonEnums.type */.Ny.NW.secondary
      }, {
        id: 'cancel',
        text: 'Cancel',
        type: ui_src/* ButtonEnums.type */.Ny.NW.secondary
      }, {
        id: 'save',
        text: 'Confirm',
        type: ui_src/* ButtonEnums.type */.Ny.NW.primary
      }],
      onSubmit: onSubmitHandler,
      body: () => {
        return /*#__PURE__*/react.createElement(OptionsForm, {
          ref: optionsRef,
          config: config,
          info: info
        });
      }
    }
  });
}
/* harmony default export */ const OptionsInputDialog = (optionsInputDialog);
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/MonaiLabelPanel.tsx
/*
Copyright (c) MONAI Consortium
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

















class MonaiLabelPanel extends react.Component {
  constructor(props) {
    super(props);
    this.notification = void 0;
    this.settings = void 0;
    this.actions = void 0;
    this.serverURI = 'http://127.0.0.1:8000';
    this.client = () => {
      const settings = this.settings && this.settings.current && this.settings.current.state ? this.settings.current.state : null;
      return new MonaiLabelClient(settings ? settings.url : this.serverURI);
    };
    this.getActiveViewportInfo = () => {
      const {
        viewportGridService,
        displaySetService
      } = this.props.servicesManager.services;
      const {
        viewports,
        activeViewportId
      } = viewportGridService.getState();
      const viewport = viewports.get(activeViewportId);
      const displaySet = displaySetService.getDisplaySetByUID(viewport.displaySetInstanceUIDs[0]);

      // viewportId = viewport.viewportId
      // SeriesInstanceUID = displaySet.SeriesInstanceUID;
      // StudyInstanceUID = displaySet.StudyInstanceUID;
      // FrameOfReferenceUID = displaySet.instances[0].FrameOfReferenceUID;
      // displaySetInstanceUID = displaySet.displaySetInstanceUID;
      // numImageFrames = displaySet.numImageFrames;
      return {
        viewport,
        displaySet
      };
    };
    this.onInfo = async serverURI => {
      const nid = this.notification.show({
        title: 'MONAI Label',
        message: 'Connecting to MONAI Label',
        type: 'info',
        duration: 2000
      });
      this.serverURI = serverURI;
      const response = await this.client().info();
      console.log(response.data);
      hideNotification(nid, this.notification);
      if (response.status !== 200) {
        this.notification.show({
          title: 'MONAI Label',
          message: 'Failed to Connect to MONAI Label',
          type: 'error',
          duration: 5000
        });
        return;
      }
      this.notification.show({
        title: 'MONAI Label',
        message: 'Connected to MONAI Label - Successful',
        type: 'success',
        duration: 2000
      });
      const all_models = response.data.models;
      const all_model_names = Object.keys(all_models);
      const deepgrow_models = all_model_names.filter(m => all_models[m].type === 'deepgrow');
      const deepedit_models = all_model_names.filter(m => all_models[m].type === 'deepedit');
      const vista3d_models = all_model_names.filter(m => all_models[m].type === 'vista3d');
      const segmentation_models = all_model_names.filter(m => all_models[m].type === 'segmentation');
      const models = deepgrow_models.concat(deepedit_models).concat(vista3d_models).concat(segmentation_models);
      const all_labels = response.data.labels;
      const modelLabelToIdxMap = {};
      const modelIdxToLabelMap = {};
      const modelLabelNames = {};
      const modelLabelIndices = {};
      for (const model of models) {
        const labels = all_models[model]['labels'];
        modelLabelToIdxMap[model] = {};
        modelIdxToLabelMap[model] = {};
        if (Array.isArray(labels)) {
          for (let label_idx = 1; label_idx <= labels.length; label_idx++) {
            const label = labels[label_idx - 1];
            all_labels.push(label);
            modelLabelToIdxMap[model][label] = label_idx;
            modelIdxToLabelMap[model][label_idx] = label;
          }
        } else {
          for (const label of Object.keys(labels)) {
            const label_idx = labels[label];
            all_labels.push(label);
            modelLabelToIdxMap[model][label] = label_idx;
            modelIdxToLabelMap[model][label_idx] = label;
          }
        }
        modelLabelNames[model] = [...Object.keys(modelLabelToIdxMap[model])].sort();
        modelLabelIndices[model] = [...Object.keys(modelIdxToLabelMap[model])].sort().map(Number);
      }
      const labelsOrdered = [...new Set(all_labels)].sort();
      const segmentations = [{
        segmentationId: '1',
        representation: {
          type: esm.Enums.SegmentationRepresentations.Labelmap
        },
        config: {
          label: 'Segmentations',
          segments: labelsOrdered.reduce((acc, label, index) => {
            acc[index + 1] = {
              segmentIndex: index + 1,
              label: label,
              active: index === 0,
              // First segment is active
              locked: false,
              color: this.segmentColor(label)
            };
            return acc;
          }, {})
        }
      }];
      const initialSegs = segmentations[0].config.segments;
      const volumeLoadObject = dist_esm.cache.getVolume('1');
      if (!volumeLoadObject) {
        this.props.commandsManager.runCommand('loadSegmentationsForViewport', {
          segmentations
        });

        // Wait for Above Segmentations to be added/available
        setTimeout(() => {
          const {
            viewport
          } = this.getActiveViewportInfo();
          for (const segmentIndex of Object.keys(initialSegs)) {
            esm.segmentation.config.color.setSegmentIndexColor(viewport.viewportId, '1', initialSegs[segmentIndex].segmentIndex, initialSegs[segmentIndex].color);
          }
        }, 1000);
      }
      const info = {
        models: models,
        labels: labelsOrdered,
        data: response.data,
        modelLabelToIdxMap: modelLabelToIdxMap,
        modelIdxToLabelMap: modelIdxToLabelMap,
        modelLabelNames: modelLabelNames,
        modelLabelIndices: modelLabelIndices,
        initialSegs: initialSegs
      };
      console.log(info);
      this.setState({
        info: info
      });
      this.setState({
        isDataReady: true
      }); // Mark as ready
      this.setState({
        options: {}
      });
    };
    this.onSelectActionTab = name => {
      for (const action of Object.keys(this.actions)) {
        if (this.state.action === action) {
          if (this.actions[action].current) {
            this.actions[action].current.onLeaveActionTab();
          }
        }
      }
      for (const action of Object.keys(this.actions)) {
        if (name === action) {
          if (this.actions[action].current) {
            this.actions[action].current.onEnterActionTab();
          }
        }
      }
      this.setState({
        action: name
      });
    };
    this.updateView = async (response, model_id, labels, override = false, label_class_unknown = false, sidx = -1) => {
      console.log('UpdateView: ', {
        model_id,
        labels,
        override,
        label_class_unknown,
        sidx
      });
      const ret = SegmentationReader.parseNrrdData(response.data);
      if (!ret) {
        throw new Error('Failed to parse NRRD data');
      }
      const labelNames = {};
      const currentSegs = currentSegmentsInfo(this.props.servicesManager.services.segmentationService);
      const modelToSegMapping = {};
      modelToSegMapping[0] = 0;
      let tmp_model_seg_idx = 1;
      for (const label of labels) {
        const s = currentSegs.info[label];
        if (!s) {
          for (let i = 1; i <= 255; i++) {
            if (!currentSegs.indices.has(i)) {
              labelNames[label] = i;
              currentSegs.indices.add(i);
              break;
            }
          }
        } else {
          labelNames[label] = s.segmentIndex;
        }
        const seg_idx = labelNames[label];
        let model_seg_idx = this.state.info.modelLabelToIdxMap[model_id][label];
        model_seg_idx = model_seg_idx ? model_seg_idx : tmp_model_seg_idx;
        modelToSegMapping[model_seg_idx] = 0xff & seg_idx;
        tmp_model_seg_idx++;
      }
      console.log('Index Remap', labels, modelToSegMapping);
      const data = new Uint8Array(ret.image);
      const {
        segmentationService
      } = this.props.servicesManager.services;
      const volumeLoadObject = segmentationService.getLabelmapVolume('1');
      if (volumeLoadObject) {
        // console.log('Volume Object is In Cache....');
        let convertedData = data;
        for (let i = 0; i < convertedData.length; i++) {
          const midx = convertedData[i];
          const sidx = modelToSegMapping[midx];
          if (midx && sidx) {
            convertedData[i] = sidx;
          } else if (override && label_class_unknown && labels.length === 1) {
            convertedData[i] = midx ? labelNames[labels[0]] : 0;
          } else if (labels.length > 0) {
            convertedData[i] = 0;
          }
        }
        if (override === true) {
          const {
            segmentationService
          } = this.props.servicesManager.services;
          const volumeLoadObject = segmentationService.getLabelmapVolume('1');
          const {
            voxelManager
          } = volumeLoadObject;
          const scalarData = voxelManager?.getCompleteScalarDataArray();

          // console.log('Current ScalarData: ', scalarData);
          const currentSegArray = new Uint8Array(scalarData.length);
          currentSegArray.set(scalarData);

          // get unique values to determine which organs to update, keep rest
          const updateTargets = new Set(convertedData);
          const numImageFrames = this.getActiveViewportInfo().displaySet.numImageFrames;
          const sliceLength = scalarData.length / numImageFrames;
          const sliceBegin = sliceLength * sidx;
          const sliceEnd = sliceBegin + sliceLength;
          for (let i = 0; i < convertedData.length; i++) {
            if (sidx >= 0 && (i < sliceBegin || i >= sliceEnd)) {
              continue;
            }
            if (convertedData[i] !== 255 && updateTargets.has(currentSegArray[i])) {
              currentSegArray[i] = convertedData[i];
            }
          }
          convertedData = currentSegArray;
        }
        const {
          voxelManager
        } = volumeLoadObject;
        voxelManager?.setCompleteScalarDataArray(convertedData);
        (0,dist_esm.triggerEvent)(dist_esm.eventTarget, esm.Enums.Events.SEGMENTATION_DATA_MODIFIED, {
          segmentationId: '1'
        });
        console.log("updated the segmentation's scalar data");
      } else {
        console.log('TODO:: Volume Object is NOT In Cache....');
      }
    };
    this.openConfigurations = e => {
      e.preventDefault();
      const {
        uiDialogService
      } = this.props.servicesManager.services;
      OptionsInputDialog(uiDialogService, this.state.options, this.state.info, (options, actionId) => {
        if (actionId === 'save' || actionId == 'reset') {
          this.setState({
            options: options
          });
        }
      });
    };
    this.onOptionsConfig = () => {
      return this.state.options;
    };
    const {
      uiNotificationService
    } = props.servicesManager.services;
    this.notification = uiNotificationService;
    this.settings = /*#__PURE__*/react.createRef();
    this.actions = {
      activelearning: /*#__PURE__*/react.createRef(),
      segmentation: /*#__PURE__*/react.createRef(),
      pointprompts: /*#__PURE__*/react.createRef(),
      classprompts: /*#__PURE__*/react.createRef()
    };
    this.state = {
      info: {
        models: [],
        datasets: []
      },
      action: {},
      options: {}
    };
  }
  segmentColor(label) {
    const color = getLabelColor(label);
    const rgbColor = [];
    for (const key in color) {
      rgbColor.push(color[key]);
    }
    rgbColor.push(255);
    return rgbColor;
  }
  async componentDidMount() {
    if (this.state.isDataReady) {
      return;
    }
    console.log('(Component Mounted) Ready to Connect to MONAI Server...');
    // await this.onInfo();
  }
  render() {
    const {
      isDataReady
    } = this.state;
    return /*#__PURE__*/react.createElement("div", {
      className: "monaiLabelPanel"
    }, /*#__PURE__*/react.createElement("br", {
      style: {
        margin: '3px'
      }
    }), /*#__PURE__*/react.createElement(SettingsTable, {
      ref: this.settings,
      onInfo: this.onInfo
    }), isDataReady && /*#__PURE__*/react.createElement("div", {
      style: {
        color: 'white'
      }
    }, /*#__PURE__*/react.createElement("p", {
      className: "subtitle"
    }, this.state.info.data.name), /*#__PURE__*/react.createElement("br", null), /*#__PURE__*/react.createElement("hr", {
      className: "separator"
    }), /*#__PURE__*/react.createElement("a", {
      href: "#",
      onClick: this.openConfigurations
    }, "Options / Configurations"), /*#__PURE__*/react.createElement("hr", {
      className: "separator"
    })), isDataReady && /*#__PURE__*/react.createElement("div", {
      className: "tabs scrollbar",
      id: "style-3"
    }, /*#__PURE__*/react.createElement(OptionTable, {
      ref: this.actions['activelearning'],
      tabIndex: 1,
      info: this.state.info,
      client: this.client,
      updateView: this.updateView,
      onSelectActionTab: this.onSelectActionTab,
      onOptionsConfig: this.onOptionsConfig,
      getActiveViewportInfo: this.getActiveViewportInfo
    }), /*#__PURE__*/react.createElement(AutoSegmentation, {
      ref: this.actions['segmentation'],
      tabIndex: 2,
      info: this.state.info,
      client: this.client,
      updateView: this.updateView,
      onSelectActionTab: this.onSelectActionTab,
      onOptionsConfig: this.onOptionsConfig,
      getActiveViewportInfo: this.getActiveViewportInfo
    }), /*#__PURE__*/react.createElement(PointPrompts, {
      ref: this.actions['pointprompts'],
      tabIndex: 3,
      info: this.state.info,
      client: this.client,
      updateView: this.updateView,
      onSelectActionTab: this.onSelectActionTab,
      onOptionsConfig: this.onOptionsConfig,
      getActiveViewportInfo: this.getActiveViewportInfo,
      servicesManager: this.props.servicesManager,
      commandsManager: this.props.commandsManager
    }), /*#__PURE__*/react.createElement(ClassPrompts, {
      ref: this.actions['classprompts'],
      tabIndex: 4,
      info: this.state.info,
      client: this.client,
      updateView: this.updateView,
      onSelectActionTab: this.onSelectActionTab,
      onOptionsConfig: this.onOptionsConfig,
      getActiveViewportInfo: this.getActiveViewportInfo,
      servicesManager: this.props.servicesManager,
      commandsManager: this.props.commandsManager
    })));
  }
}
MonaiLabelPanel.propTypes = {
  commandsManager: (prop_types_default()).any,
  servicesManager: (prop_types_default()).any,
  extensionManager: (prop_types_default()).any
};
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/getPanelModule.tsx


function getPanelModule({
  commandsManager,
  extensionManager,
  servicesManager
}) {
  const WrappedMonaiLabelPanel = () => {
    return /*#__PURE__*/react.createElement(MonaiLabelPanel, {
      commandsManager: commandsManager,
      servicesManager: servicesManager,
      extensionManager: extensionManager
    });
  };
  return [{
    name: 'monailabel',
    iconName: 'tab-patient-info',
    iconLabel: 'MONAI',
    label: 'MONAI Label',
    secondaryLabel: 'MONAI Label',
    component: WrappedMonaiLabelPanel
  }];
}
/* harmony default export */ const src_getPanelModule = (getPanelModule);
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/getCommandsModule.ts
function getCommandsModule({
  servicesManager
}) {
  const {
    uiNotificationService
  } = servicesManager.services;
  const actions = {
    setToolActive: ({
      toolName
    }) => {
      uiNotificationService.show({
        title: 'MONAI Label probe',
        message: 'MONAI Label Probe Activated.',
        type: 'info',
        duration: 3000
      });
    }
  };
  const definitions = {};
  return {
    actions,
    definitions,
    defaultContext: 'MONAILabel'
  };
}
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/tools/ProbeMONAILabelTool.ts
/*
Copyright (c) MONAI Consortium
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


const {
  getAnnotations
} = esm.annotation.state;
class ProbeMONAILabelTool extends esm.ProbeTool {
  constructor(toolProps = {}, defaultToolProps = {
    configuration: {
      customColor: undefined
    }
  }) {
    super(toolProps, defaultToolProps);
    this.renderAnnotation = (enabledElement, svgDrawingHelper) => {
      let renderStatus = false;
      const {
        viewport
      } = enabledElement;
      const {
        element
      } = viewport;
      let annotations = getAnnotations(this.getToolName(), element);
      if (!annotations?.length) {
        return renderStatus;
      }
      annotations = this.filterInteractableAnnotationsForElement(element, annotations);
      if (!annotations?.length) {
        return renderStatus;
      }
      const targetId = this.getTargetId(viewport);
      const renderingEngine = viewport.getRenderingEngine();
      const styleSpecifier = {
        toolGroupId: this.toolGroupId,
        toolName: this.getToolName(),
        viewportId: enabledElement.viewport.id
      };
      for (let i = 0; i < annotations.length; i++) {
        const annotation = annotations[i];
        const annotationUID = annotation.annotationUID;
        const data = annotation.data;
        const point = data.handles.points[0];
        const canvasCoordinates = viewport.worldToCanvas(point);
        styleSpecifier.annotationUID = annotationUID;
        const color = this.configuration?.customColor ?? this.getStyle('color', styleSpecifier, annotation);

        // If rendering engine has been destroyed while rendering
        if (!viewport.getRenderingEngine()) {
          console.warn('Rendering Engine has been destroyed');
          return renderStatus;
        }
        const handleGroupUID = '0';
        esm.drawing.drawHandles(svgDrawingHelper, annotationUID, handleGroupUID, [canvasCoordinates], {
          color
        });
        renderStatus = true;
      }
      return renderStatus;
    };
  }
}
ProbeMONAILabelTool.toolName = 'ProbeMONAILabel';
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/init.ts



/**
 * @param {object} configuration
 */
function init({
  servicesManager,
  configuration = {}
}) {
  (0,esm.addTool)(ProbeMONAILabelTool);
}
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/index.tsx




/* harmony default export */ const monai_label_src = ({
  id: id,
  preRegistration: init,
  getPanelModule: src_getPanelModule,
  getCommandsModule: getCommandsModule
});

/***/ })

}]);