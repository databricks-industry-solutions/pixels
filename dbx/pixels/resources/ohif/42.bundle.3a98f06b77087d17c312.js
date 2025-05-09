(self["webpackChunk"] = self["webpackChunk"] || []).push([[42,579],{

/***/ 26792:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ monai_label_src)
});

// EXTERNAL MODULE: ../../../../extensions/monai-label/package.json
var monai_label_package = __webpack_require__(99971);
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/id.js

const id = monai_label_package.name;

// EXTERNAL MODULE: ../../../node_modules/react/index.js
var react = __webpack_require__(43001);
// EXTERNAL MODULE: ../../../node_modules/prop-types/index.js
var prop_types = __webpack_require__(3827);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/core/dist/esm/index.js + 331 modules
var esm = __webpack_require__(3743);
// EXTERNAL MODULE: ../../../node_modules/@cornerstonejs/tools/dist/esm/index.js + 348 modules
var dist_esm = __webpack_require__(14957);
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/MonaiLabelPanel.css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/SettingsTable.css
// extracted by mini-css-extract-plugin

// EXTERNAL MODULE: ../../ui/src/index.js + 485 modules
var src = __webpack_require__(66467);
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/utils/GenericAnatomyColors.js
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
  label: 'biliary tree',
  value: rgbToHex(0, 145, 30)
}, {
  label: 'gallbladder',
  value: rgbToHex(139, 150, 98)
}, {
  label: 'pancreas',
  value: rgbToHex(249, 180, 111)
}, {
  label: 'spleen',
  value: rgbToHex(157, 108, 162)
}, {
  label: 'urinary system',
  value: rgbToHex(203, 136, 116)
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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function randomRGB() {
  const o = Math.round,
    r = Math.random,
    s = 255;
  return GenericUtils_rgbToHex(o(r() * s), o(r() * s), o(r() * s));
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
function getLabelColor(label) {
  let rgb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  const name = label.toLowerCase();
  for (const i of GenericAnatomyColors) {
    if (i.label === name) {
      return rgb ? hexToRgb(i.value) : i.value;
    }
  }
  return null;
}
class CookieUtils {
  static setCookie(name, value, exp_y, exp_m, exp_d, path, domain, secure) {
    let cookie_string = name + '=' + escape(value);
    if (exp_y) {
      let expires = new Date(exp_y, exp_m, exp_d);
      cookie_string += '; expires=' + expires.toGMTString();
    }
    if (path) cookie_string += '; path=' + escape(path);
    if (domain) cookie_string += '; domain=' + escape(domain);
    if (secure) cookie_string += '; secure';
    document.cookie = cookie_string;
  }
  static getCookie(cookie_name) {
    let results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
    if (results) return unescape(results[2]);else return null;
  }
  static getCookieString(name) {
    let defaultVal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    const val = CookieUtils.getCookie(name);
    console.debug(name + ' = ' + val + ' (default: ' + defaultVal + ' )');
    if (!val) {
      CookieUtils.setCookie(name, defaultVal);
      return defaultVal;
    }
    return val;
  }
  static getCookieBool(name) {
    let defaultVal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const val = CookieUtils.getCookie(name, defaultVal);
    return !!JSON.parse(String(val).toLowerCase());
  }
  static getCookieNumber(name) {
    let defaultVal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    const val = CookieUtils.getCookie(name, defaultVal);
    return Number(val);
  }
}

;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/SettingsTable.tsx




class SettingsTable extends react.Component {
  constructor(props) {
    super(props);
    this.getSettings = () => {
      const url = CookieUtils.getCookieString('MONAILABEL_SERVER_URL', window.location.href.split('/3000/')[0] + '/8000/');
      const overlap_segments = CookieUtils.getCookieBool('MONAILABEL_OVERLAP_SEGMENTS', true);
      const export_format = CookieUtils.getCookieString('MONAILABEL_EXPORT_FORMAT', 'NRRD');
      return {
        url: url,
        overlap_segments: overlap_segments,
        export_format: export_format
      };
    };
    this.onBlurSeverURL = evt => {
      let url = evt.target.value;
      this.setState({
        url: url
      });
      CookieUtils.setCookie('MONAILABEL_SERVER_URL', url);
    };
    const onInfo = props.onInfo;
    this.onInfo = onInfo;
    this.state = this.getSettings();
  }
  render() {
    return /*#__PURE__*/react.createElement("table", {
      className: "settingsTable"
    }, /*#__PURE__*/react.createElement("tbody", null, /*#__PURE__*/react.createElement("tr", null, /*#__PURE__*/react.createElement("td", null, "Server:"), /*#__PURE__*/react.createElement("td", null, /*#__PURE__*/react.createElement("input", {
      className: "actionInput",
      name: "monailabelServerURL",
      type: "text",
      defaultValue: this.state.url,
      onBlur: this.onBlurSeverURL
    })), /*#__PURE__*/react.createElement("td", null, "\xA0"), /*#__PURE__*/react.createElement("td", null, /*#__PURE__*/react.createElement("button", {
      className: "actionButton",
      onClick: this.onInfo
    }, /*#__PURE__*/react.createElement(src/* Icon */.JO, {
      name: "tool-reset",
      width: "12px",
      height: "12px"
    })))), /*#__PURE__*/react.createElement("tr", {
      style: {
        fontSize: 'smaller'
      }
    }, /*#__PURE__*/react.createElement("td", null, "\xA0"), /*#__PURE__*/react.createElement("td", {
      colSpan: "4"
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
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/ModelSelector.css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/ModelSelector.tsx



class ModelSelector extends react.Component {
  constructor(props) {
    super(props);
    this.onChangeModel = evt => {
      this.setState({
        currentModel: evt.target.value
      });
      if (this.props.onSelectModel) this.props.onSelectModel(evt.target.value);
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
      value: currentModel
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
    }, "Run"))), this.props.scribblesSelector)), this.props.usage);
  }
}
ModelSelector.propTypes = {
  name: (prop_types_default()).string,
  title: (prop_types_default()).string,
  models: (prop_types_default()).array,
  currentModel: (prop_types_default()).string,
  usage: (prop_types_default()).any,
  onClick: (prop_types_default()).func,
  onSelectModel: (prop_types_default()).func,
  scribblesSelector: (prop_types_default()).any
};
// EXTERNAL MODULE: ../../core/src/index.ts + 65 modules
var core_src = __webpack_require__(71771);
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/actions/BaseTab.tsx



class BaseTab extends react.Component {
  constructor(props) {
    super(props);
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
    this.notification = new core_src/* UINotificationService */.ex();
    this.uiModelService = new core_src/* UIModalService */.vq();
    this.tabId = 'tab-' + this.props.tabIndex;
  }
}
BaseTab.propTypes = {
  tabIndex: (prop_types_default()).number,
  info: (prop_types_default()).any,
  segmentId: (prop_types_default()).string,
  viewConstants: (prop_types_default()).any,
  client: (prop_types_default()).func,
  updateView: (prop_types_default()).func,
  onSelectActionTab: (prop_types_default()).func,
  onOptionsConfig: (prop_types_default()).func
};
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/actions/AutoSegmentation.tsx



class AutoSegmentation extends BaseTab {
  constructor(props) {
    super(props);
    this.onSelectModel = model => {
      this.setState({
        currentModel: model
      });
    };
    this.onSegmentation = async () => {
      const nid = this.notification.show({
        title: 'MONAI Label',
        message: 'Running Auto-Segmentation...',
        type: 'info',
        duration: 60000
      });

      // TODO:: Fix Image ID...
      const {
        info,
        viewConstants
      } = this.props;
      const image = viewConstants.SeriesInstanceUID;
      const model = this.modelSelector.current.currentModel();
      const config = this.props.onOptionsConfig();
      const params = config && config.infer && config.infer[model] ? config.infer[model] : {};
      const labels = info.models[model].labels;
      const response = await this.props.client().segmentation(model, image, params);

      // Bug:: Notification Service on show doesn't return id
      if (!nid) {
        window.snackbar.hideAll();
      } else {
        this.notification.hide(nid);
      }
      if (response.status !== 200) {
        this.notification.show({
          title: 'MONAI Label',
          message: 'Failed to Run Segmentation',
          type: 'error',
          duration: 5000
        });
      } else {
        this.notification.show({
          title: 'MONAI Label',
          message: 'Run Segmentation - Successful',
          type: 'success',
          duration: 2000
        });
        await this.props.updateView(response, labels);
      }
    };
    this.modelSelector = /*#__PURE__*/react.createRef();
    this.state = {
      currentModel: null
    };
  }
  render() {
    let models = [];
    if (this.props.info && this.props.info.models) {
      for (let [name, model] of Object.entries(this.props.info.models)) {
        if (model.type === 'segmentation') {
          models.push(name);
        }
      }
    }
    return /*#__PURE__*/react.createElement("div", {
      className: "tab"
    }, /*#__PURE__*/react.createElement("input", {
      type: "radio",
      name: "rd",
      id: this.tabId,
      className: "tab-switch",
      value: "segmentation",
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
      usage: /*#__PURE__*/react.createElement("p", {
        style: {
          fontSize: 'smaller'
        }
      }, "Fully automated segmentation ", /*#__PURE__*/react.createElement("b", null, "without any user prompt"), ". Just select a model and click to run")
    })));
  }
}
// EXTERNAL MODULE: ../../../node_modules/gl-matrix/esm/index.js + 10 modules
var gl_matrix_esm = __webpack_require__(45451);
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/actions/SmartEdit.tsx
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






/* import { getFirstSegmentId } from '../../utils/SegmentationUtils'; */

class SmartEdit extends BaseTab {
  constructor(props) {
    super(props);
    this.onSelectModel = model => {
      this.setState({
        currentModel: model
      });
    };
    this.onDeepgrow = async () => {
      const {
        segmentationService,
        cornerstoneViewportService,
        viewportGridService
      } = this.props.servicesManager.services;
      const {
        info,
        viewConstants
      } = this.props;
      const image = viewConstants.SeriesInstanceUID;
      const model = this.modelSelector.current.currentModel();
      const activeSegment = segmentationService.getActiveSegment();
      const segmentId = activeSegment.label;
      if (segmentId && !this.state.segmentId) {
        this.onSegmentSelected(segmentId);
      }
      const is3D = info.models[model].dimension === 3;
      if (!segmentId) {
        this.notification.show({
          title: 'MONAI Label',
          message: 'Please create/select a label first',
          type: 'warning'
        });
        return;
      }

      /* const points = this.state.deepgrowPoints.get(segmentId); */

      // Getting the clicks in IJK format

      const {
        activeViewportId
      } = viewportGridService.getState();
      const viewPort = cornerstoneViewportService.getCornerstoneViewport(activeViewportId);
      const pts = dist_esm.annotation.state.getAnnotations('ProbeMONAILabel', viewPort.element);
      const pointsWorld = pts.map(pt => pt.data.handles.points[0]);
      const {
        imageData
      } = viewPort.getImageData();
      const ijk = gl_matrix_esm/* vec3.fromValues */.R3.fromValues(0, 0, 0);

      // Rounding is not working
      /* const pointsIJK = pointsWorld.map((world) =>
        Math.round(imageData.worldToIndex(world, ijk))
      ); */

      const pointsIJK = pointsWorld.map(world => imageData.worldToIndex(world, ijk));

      /* const roundPointsIJK = pointsIJK.map(ind => Math.round(ind)) */

      this.state.deepgrowPoints.set(segmentId, pointsIJK);

      // when changing label,  delete previous? or just keep track of all provided clicks per labels
      const points = this.state.deepgrowPoints.get(segmentId);

      // Error as ctrlKey is part of the points?

      /* if (!points.length) {
        return;
      }
       const currentPoint = points[points.length - 1]; */

      const config = this.props.onOptionsConfig();
      const labels = info.models[model].labels;
      const params = config && config.infer && config.infer[model] ? config.infer[model] : {};

      // block the cursor while waiting for MONAI Label response?

      for (let l in labels) {
        if (l === segmentId) {
          console.log('This is the segmentId');
          let p = [];
          for (var i = 0; i < pointsIJK.length; i++) {
            p.push(Array.from(pointsIJK[i]));
            console.log(p[i]);
          }
          params[l] = p;
          continue;
        }
        ;
        console.log(l);
        params[l] = [];
      }
      const response = await this.props.client().infer(model, image, params);
      if (response.status !== 200) {
        this.notification.show({
          title: 'MONAI Label',
          message: 'Failed to Run Deepgrow',
          type: 'error',
          duration: 3000
        });
      } else {
        await this.props.updateView(response, labels, 'override', is3D ? -1 : currentPoint.z);
      }

      // Remove the segmentation and create a new one with a differen index
      /* debugger;
      this.props.servicesManager.services.segmentationService.remove('1') */
    };
    this.getPointData = evt => {
      const {
        x,
        y,
        imageId
      } = evt.detail;
      const z = this.props.viewConstants.imageIdsToIndex.get(imageId);
      console.debug('X: ' + x + '; Y: ' + y + '; Z: ' + z);
      return {
        x,
        y,
        z,
        data: evt.detail,
        imageId
      };
    };
    this.onSegmentDeleted = id => {
      this.clearPoints(id);
      this.setState({
        segmentId: null
      });
    };
    this.onSegmentSelected = id => {
      this.initPoints(id);
      this.setState({
        segmentId: id
      });
    };
    this.initPoints = id => {
      console.log('Initializing points');
    };
    this.clearPoints = id => {
      dist_esm.annotation.state.getAnnotationManager().removeAllAnnotations();
      this.props.servicesManager.services.cornerstoneViewportService.getRenderingEngine().render();
      console.log('Clearing all points');
    };
    this.onSelectActionTab = evt => {
      this.props.onSelectActionTab(evt.currentTarget.value);
    };
    this.onEnterActionTab = () => {
      this.props.commandsManager.runCommand('setToolActive', {
        toolName: 'ProbeMONAILabel'
      });
      console.info('Here we activate the probe');
    };
    this.onLeaveActionTab = () => {
      this.props.commandsManager.runCommand('setToolDisable', {
        toolName: 'ProbeMONAILabel'
      });
      console.info('Here we deactivate the probe');
      /* cornerstoneTools.setToolDisabled('DeepgrowProbe', {});
      this.removeEventListeners(); */
    };
    this.addEventListeners = (eventName, handler) => {
      this.removeEventListeners();
      const {
        element
      } = this.props.viewConstants;
      element.addEventListener(eventName, handler);
      this.setState({
        currentEvent: {
          name: eventName,
          handler: handler
        }
      });
    };
    this.removeEventListeners = () => {
      if (!this.state.currentEvent) {
        return;
      }
      const {
        element
      } = this.props.viewConstants;
      const {
        currentEvent
      } = this.state;
      element.removeEventListener(currentEvent.name, currentEvent.handler);
      this.setState({
        currentEvent: null
      });
    };
    this.modelSelector = /*#__PURE__*/react.createRef();
    this.state = {
      segmentId: null,
      currentPoint: null,
      deepgrowPoints: new Map(),
      currentEvent: null,
      currentModel: null
    };
  }
  componentDidMount() {
    const {
      segmentationService,
      toolGroupService,
      viewportGridService
    } = this.props.servicesManager.services;
    const added = segmentationService.EVENTS.SEGMENTATION_ADDED;
    const updated = segmentationService.EVENTS.SEGMENTATION_UPDATED;
    const removed = segmentationService.EVENTS.SEGMENTATION_REMOVED;
    const subscriptions = [];
    [added, updated, removed].forEach(evt => {
      const {
        unsubscribe
      } = segmentationService.subscribe(evt, () => {
        const segmentations = segmentationService.getSegmentations();
        if (!segmentations?.length) {
          return;
        }

        // get the first segmentation Todo: fix this to be active
        const segmentation = segmentations[0];
        const {
          segments,
          activeSegmentIndex
        } = segmentation;
        const selectedSegment = segments[activeSegmentIndex];
        const color = selectedSegment.color;

        // get the active viewport toolGroup
        const {
          viewports,
          activeViewportId
        } = viewportGridService.getState();
        const viewport = viewports.get(activeViewportId);
        const {
          viewportOptions
        } = viewport;
        const toolGroupId = viewportOptions.toolGroupId;
        toolGroupService.setToolConfiguration(toolGroupId, 'ProbeMONAILabel', {
          customColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`
        });
      });
      subscriptions.push(unsubscribe);
    });
    this.unsubscribe = () => {
      subscriptions.forEach(unsubscribe => unsubscribe());
    };
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    let models = [];
    if (this.props.info && this.props.info.models) {
      for (let [name, model] of Object.entries(this.props.info.models)) {
        if (model.type === 'deepgrow' || model.type === 'deepedit' || model.type === 'vista') {
          models.push(name);
        }
      }
    }
    return /*#__PURE__*/react.createElement("div", {
      className: "tab"
    }, /*#__PURE__*/react.createElement("input", {
      type: "radio",
      name: "rd",
      id: this.tabId,
      className: "tab-switch",
      value: "smartedit",
      onClick: this.onSelectActionTab
    }), /*#__PURE__*/react.createElement("label", {
      htmlFor: this.tabId,
      className: "tab-label"
    }, "SmartEdit"), /*#__PURE__*/react.createElement("div", {
      className: "tab-content"
    }, /*#__PURE__*/react.createElement(ModelSelector, {
      ref: this.modelSelector,
      name: "smartedit",
      title: "SmartEdit",
      models: models,
      currentModel: this.state.currentModel,
      onClick: this.onDeepgrow,
      onSelectModel: this.onSelectModel,
      usage: /*#__PURE__*/react.createElement("div", {
        style: {
          fontSize: 'smaller'
        }
      }, /*#__PURE__*/react.createElement("p", null, "Create a label and annotate ", /*#__PURE__*/react.createElement("b", null, "any organ"), "."), /*#__PURE__*/react.createElement("a", {
        style: {
          backgroundColor: 'lightgray'
        },
        onClick: () => this.clearPoints()
      }, "Clear Points"))
    })));
  }
}
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/actions/OptionTable.css
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




class OptionTable extends BaseTab {
  constructor(props) {
    super(props);
    this.onChangeSection = evt => {
      this.state.section = evt.target.value;
      this.setState({
        section: evt.target.value
      });
    };
    this.onChangeName = evt => {
      this.state.name = evt.target.value;
      this.setState({
        name: evt.target.value
      });
    };
    this.onChangeConfig = (s, n, k, evt) => {
      console.debug(s + ' => ' + n + ' => ' + k);
      const c = this.state.config;
      if (typeof c[s][n][k] === 'boolean') {
        c[s][n][k] = !!evt.target.checked;
      } else {
        if (typeof c[s][n][k] === 'number') c[s][n][k] = parseFloat(evt.target.value);else c[s][n][k] = evt.target.value;
      }
      this.setState({
        config: c
      });
    };
    this.state = {
      section: '',
      name: '',
      config: null
    };
  }
  render() {
    let config = this.state.config ? this.state.config : {};
    if (!Object.keys(config).length) {
      const info = this.props.info;
      const mapping = {
        infer: 'models',
        train: 'trainers',
        activelearning: 'strategies',
        scoring: 'scoring'
      };
      for (const [m, n] of Object.entries(mapping)) {
        for (const [k, v] of Object.entries(info && info[n] ? info[n] : {})) {
          if (v && v.config && Object.keys(v.config).length) {
            if (!config[m]) config[m] = {};
            config[m][k] = v.config;
          }
        }
      }
      this.state.config = config;
    }
    const section = this.state.section.length && config[this.state.section] ? this.state.section : Object.keys(config).length ? Object.keys(config)[0] : '';
    this.state.section = section;
    const section_map = config[section] ? config[section] : {};
    const name = this.state.name.length && section_map[this.state.name] ? this.state.name : Object.keys(section_map).length ? Object.keys(section_map)[0] : '';
    this.state.name = name;
    const name_map = section_map[name] ? section_map[name] : {};

    //console.log('Section: ' + section + '; Name: ' + name);
    //console.log(name_map);

    return /*#__PURE__*/react.createElement("div", {
      className: "tab"
    }, /*#__PURE__*/react.createElement("input", {
      className: "tab-switch",
      type: "checkbox",
      id: this.tabId,
      name: "options",
      value: "options"
    }), /*#__PURE__*/react.createElement("label", {
      className: "tab-label",
      htmlFor: this.tabId
    }, "Options"), /*#__PURE__*/react.createElement("div", {
      className: "tab-content"
    }, /*#__PURE__*/react.createElement("table", null, /*#__PURE__*/react.createElement("tbody", null, /*#__PURE__*/react.createElement("tr", null, /*#__PURE__*/react.createElement("td", null, "Section:"), /*#__PURE__*/react.createElement("td", null, /*#__PURE__*/react.createElement("select", {
      className: "selectBox",
      name: "selectSection",
      onChange: this.onChangeSection,
      value: this.state.section
    }, Object.keys(config).map(k => /*#__PURE__*/react.createElement("option", {
      key: k,
      value: k
    }, `${k} `))))), /*#__PURE__*/react.createElement("tr", null, /*#__PURE__*/react.createElement("td", null, "Name:"), /*#__PURE__*/react.createElement("td", null, /*#__PURE__*/react.createElement("select", {
      className: "selectBox",
      name: "selectName",
      onChange: this.onChangeName,
      value: this.state.name
    }, Object.keys(section_map).map(k => /*#__PURE__*/react.createElement("option", {
      key: k,
      value: k
    }, `${k} `))))))), /*#__PURE__*/react.createElement("br", null), /*#__PURE__*/react.createElement("table", {
      className: "optionsTable"
    }, /*#__PURE__*/react.createElement("thead", null, /*#__PURE__*/react.createElement("tr", null, /*#__PURE__*/react.createElement("th", null, "Key"), /*#__PURE__*/react.createElement("th", null, "Value"))), /*#__PURE__*/react.createElement("tbody", null, Object.entries(name_map).map(_ref => {
      let [k, v] = _ref;
      return /*#__PURE__*/react.createElement("tr", {
        key: this.state.section + this.state.name + k
      }, /*#__PURE__*/react.createElement("td", null, k), /*#__PURE__*/react.createElement("td", null, v !== null && typeof v === 'boolean' ? /*#__PURE__*/react.createElement("input", {
        type: "checkbox",
        defaultChecked: v,
        onChange: e => this.onChangeConfig(this.state.section, this.state.name, k, e)
      }) : v !== null && typeof v === 'object' ? /*#__PURE__*/react.createElement("select", {
        className: "optionsInput",
        onChange: e => this.onChangeConfig(this.state.section, this.state.name, k, e)
      }, Object.keys(v).map(a => /*#__PURE__*/react.createElement("option", {
        key: a,
        name: a,
        value: a
      }, a))) : /*#__PURE__*/react.createElement("input", {
        type: "text",
        defaultValue: v ? v : '',
        className: "optionsInput",
        onChange: e => this.onChangeConfig(this.state.section, this.state.name, k, e)
      })));
    })))));
  }
}
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/actions/ActiveLearning.css
// extracted by mini-css-extract-plugin

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
      let path = window.location.href.split('=');
      path[path.length - 1] = this.props.info.StudyInstanceUID;
      const pathname = path.join('=');
      console.info(pathname);
      let msg = 'This action will reload current page.  Are you sure to continue?';
      if (!window.confirm(msg)) return;
      window.location.href = pathname;
    };
  }
  render() {
    const fields = {
      id: 'Image ID (MONAILabel)',
      Modality: 'Modality',
      StudyDate: 'Study Date',
      StudyTime: 'Study Time',
      PatientID: 'Patient ID',
      StudyInstanceUID: 'Study Instance UID',
      SeriesInstanceUID: 'Series Instance UID'
    };
    return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement("table", {
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
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/utils/SegmentationUtils.tsx

function createSegmentMetadata(label, segmentId) {
  let description = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  let newLabelMap = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  const labelMeta = {
    SegmentedPropertyCategoryCodeSequence: {
      CodeValue: 'T-D0050',
      CodingSchemeDesignator: 'SRT',
      CodeMeaning: 'Tissue'
    },
    SegmentNumber: 1,
    SegmentLabel: label ? label : 'label-0-1',
    SegmentDescription: description,
    SegmentAlgorithmType: 'SEMIAUTOMATIC',
    SegmentAlgorithmName: 'MONAI',
    SegmentedPropertyTypeCodeSequence: {
      CodeValue: 'T-D0050',
      CodingSchemeDesignator: 'SRT',
      CodeMeaning: 'Tissue'
    }
  };
  if (newLabelMap) {
    console.debug('Logic to create a new segment');
  }
  const color = getLabelColor(label);
  const rgbColor = [];
  for (let key in color) {
    rgbColor.push(color[key]);
  }
  rgbColor.push(255);
  return {
    id: '0+' + segmentId,
    color: rgbColor,
    labelmapIndex: 0,
    name: label,
    segmentIndex: segmentId,
    description: description,
    meta: labelMeta
  };
}

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






class ActiveLearning_OptionTable extends BaseTab {
  constructor(props) {
    super(props);
    this.onChangeStrategy = evt => {
      this.setState({
        strategy: evt.target.value
      });
    };
    this.onSegmentSelected = id => {
      this.setState({
        segmentId: id
      });
    };
    this.onSegmentDeleted = id => {
      this.setState({
        segmentId: null
      });
    };
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
    this.onClickSubmitLabel = async () => {
      const labelmaps3D = cornerstone.cache.getVolume('1');
      if (!labelmaps3D) {
        console.info('LabelMap3D is empty.. so zero segments');
        return;
      }
      this.notification.show({
        title: 'MONAI Label',
        message: 'Preparing the labelmap to submit',
        type: 'info',
        duration: 5000
      });
      const labelNames = this.props.info.labels;
      const segments = [];
      for (let i = 0; i < labelNames.length; i++) {
        if (labelNames[i] === 'background') {
          console.debug('Ignore Background...');
          continue;
        }
        let segment = createSegmentMetadata(labelNames[i], i, '');
        segments.push(segment);
      }
      const params = {
        label_info: segments
      };
      const image = this.props.viewConstants.SeriesInstanceUID;
      const label = new Blob([labelmaps3D.scalarData], {
        type: 'application/octet-stream'
      });
      const response = await this.props.client().save_label(image, label, params);
      if (response.status !== 200) {
        this.notification.show({
          title: 'MONAI Label',
          message: 'Failed to save label',
          type: 'error',
          duration: 5000
        });
      } else {
        this.notification.show({
          title: 'MONAI Label',
          message: 'Label submitted to server',
          type: 'success',
          duration: 2000
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
    /* const segmentId = this.state.segmentId
      ? this.state.segmentId
      : getFirstSegmentId(this.props.viewConstants.element); */

    const segmentId = this.state.segmentId;
    const ds = this.props.info.datastore;
    const completed = ds && ds.completed ? ds.completed : 0;
    const total = ds && ds.total ? ds.total : 1;
    const activelearning = Math.round(100 * (completed / total)) + '%';
    const activelearningTip = completed + '/' + total + ' samples annotated';
    const ts = this.props.info.train_stats ? Object.values(this.props.info.train_stats)[0] : null;
    const epochs = ts ? ts.total_time ? 0 : ts.epoch ? ts.epoch : 1 : 0;
    const total_epochs = ts && ts.total_epochs ? ts.total_epochs : 1;
    const training = Math.round(100 * (epochs / total_epochs)) + '%';
    const trainingTip = epochs ? epochs + '/' + total_epochs + ' epochs completed' : 'Not Running';
    const accuracy = ts && ts.best_metric ? Math.round(100 * ts.best_metric) + '%' : '0%';
    const accuracyTip = ts && ts.best_metric ? accuracy + ' is current best metric' : 'not determined';
    const strategies = this.props.info.strategies ? this.props.info.strategies : {};
    return /*#__PURE__*/react.createElement("div", {
      className: "tab"
    }, /*#__PURE__*/react.createElement("input", {
      className: "tab-switch",
      type: "checkbox",
      id: this.tabId,
      name: "activelearning",
      value: "activelearning",
      defaultChecked: true
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
      value: this.state.strategy
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
// EXTERNAL MODULE: ../../../node_modules/axios/index.js
var axios = __webpack_require__(94486);
var axios_default = /*#__PURE__*/__webpack_require__.n(axios);
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/services/MonaiLabelClient.js

class MonaiLabelClient {
  constructor(server_url) {
    this.server_url = new URL(server_url);
  }
  async info() {
    let url = new URL('info/', this.server_url);
    return await MonaiLabelClient.api_get(url.toString());
  }
  async segmentation(model, image) {
    let params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    let label = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    // label is used to send label volumes, e.g. scribbles,
    // that are to be used during segmentation
    return this.infer(model, image, params, label);
  }
  async deepgrow(model, image, foreground, background) {
    let params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    params['foreground'] = foreground;
    params['background'] = background;
    return this.infer(model, image, params);
  }
  async infer(model, image, params) {
    let label = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    let result_extension = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '.nrrd';
    let url = new URL('infer/' + encodeURIComponent(model), this.server_url);
    url.searchParams.append('image', image);
    url.searchParams.append('output', 'all');
    // url.searchParams.append('output', 'image');
    url = url.toString();
    if (result_extension) {
      params.result_extension = result_extension;
      params.result_dtype = 'uint16';
      params.result_compress = false;
    }

    // return the indexes as defined in the config file
    params.restore_label_idx = false;
    return await MonaiLabelClient.api_post(url, params, label, true, 'arraybuffer');
  }
  async next_sample() {
    let stategy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'random';
    let params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
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
    return axios_default().get(url).then(function (response) {
      console.debug(response);
      return response;
    }).catch(function (error) {
      return error;
    }).finally(function () {});
  }
  static api_delete(url) {
    console.debug('DELETE:: ' + url);
    return axios_default()["delete"](url).then(function (response) {
      console.debug(response);
      return response;
    }).catch(function (error) {
      return error;
    }).finally(function () {});
  }
  static api_post(url, params, files) {
    let form = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    let responseType = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'arraybuffer';
    const data = form ? MonaiLabelClient.constructFormData(params, files) : MonaiLabelClient.constructFormOrJsonData(params, files);
    return MonaiLabelClient.api_post_data(url, data, responseType);
  }
  static api_post_data(url, data, responseType) {
    console.debug('POST:: ' + url);
    return axios_default().post(url, data, {
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
  static api_put(url, params, files) {
    let form = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    let responseType = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'json';
    const data = form ? MonaiLabelClient.constructFormData(params, files) : MonaiLabelClient.constructFormOrJsonData(params, files);
    return MonaiLabelClient.api_put_data(url, data, responseType);
  }
  static api_put_data(url, data) {
    let responseType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'json';
    console.debug('PUT:: ' + url);
    return axios_default().put(url, data, {
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
// EXTERNAL MODULE: ../../../node_modules/nrrd-js/nrrd.js
var nrrd = __webpack_require__(5179);
// EXTERNAL MODULE: ../../../node_modules/pako/dist/pako.esm.mjs
var pako_esm = __webpack_require__(95013);
// EXTERNAL MODULE: ../../../node_modules/itk/readImageArrayBuffer.js
var readImageArrayBuffer = __webpack_require__(32631);
// EXTERNAL MODULE: ../../../node_modules/itk/writeArrayBuffer.js + 3 modules
var writeArrayBuffer = __webpack_require__(93197);
// EXTERNAL MODULE: ../../../node_modules/itk/itkConfig.js
var itkConfig = __webpack_require__(68211);
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






const pkgJSON = __webpack_require__(99971);
const itkVersion = pkgJSON.dependencies.itk.substring(1);
itkConfig/* default */.Z.itkModulesPath = 'https://unpkg.com/itk@' + itkVersion; // HACK to use ITK from CDN

class SegmentationReader {
  static parseNrrdData(data) {
    let nrrdfile = nrrd.parse(data);

    // Currently gzip is not supported in nrrd.js
    if (nrrdfile.encoding === 'gzip') {
      const buffer = pako_esm/* default.inflate */.ZP.inflate(nrrdfile.buffer).buffer;
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
  static saveFile(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const a = document.createElement('a');
      document.body.appendChild(a);
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 0);
    }
  }

  // GZIP write not supported by nrrd-js (so use ITK save with compressed = true)
  static serializeNrrdCompressed(header, image, filename) {
    const nrrdBuffer = SegmentationReader.serializeNrrd(header, image);
    const reader = (0,readImageArrayBuffer/* default */.Z)(null, nrrdBuffer, 'temp.nrrd');
    reader.then(function (response) {
      const writer = (0,writeArrayBuffer/* default */.Z)(response.webWorker, true, response.image, filename);
      writer.then(function (response) {
        SegmentationReader.saveFile(new Blob([response.arrayBuffer]), filename);
        console.debug('File downloaded: ' + filename);
      });
    });
  }
  static serializeNrrd(header, image, filename) {
    let nrrdOrg = Object.assign({}, header);
    nrrdOrg.buffer = image;
    nrrdOrg.data = new Uint16Array(image);
    const nrrdBuffer = nrrd.serialize(nrrdOrg);
    if (filename) {
      SegmentationReader.saveFile(new Blob([nrrdBuffer]), filename);
      console.debug('File downloaded: ' + filename);
    }
    return nrrdBuffer;
  }
}
// EXTERNAL MODULE: ../../../extensions/default/src/index.ts + 78 modules
var default_src = __webpack_require__(65798);
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/callInputDialog.tsx


function callInputDialog(uiDialogService, label, callback) {
  const dialogId = 'enter-segment-label';
  const onSubmitHandler = _ref => {
    let {
      action,
      value
    } = _ref;
    switch (action.id) {
      case 'save':
        callback(value.label, action.id);
        break;
      case 'cancel':
        callback('', action.id);
        break;
    }
    uiDialogService.dismiss({
      id: dialogId
    });
  };
  if (uiDialogService) {
    uiDialogService.create({
      id: dialogId,
      centralize: true,
      isDraggable: false,
      showOverlay: true,
      content: src/* Dialog */.Vq,
      contentProps: {
        title: 'Segment',
        value: {
          label
        },
        noCloseButton: true,
        onClose: () => uiDialogService.dismiss({
          id: dialogId
        }),
        actions: [{
          id: 'cancel',
          text: 'Cancel',
          type: src/* ButtonEnums.type */.LZ.dt.secondary
        }, {
          id: 'save',
          text: 'Confirm',
          type: src/* ButtonEnums.type */.LZ.dt.primary
        }],
        onSubmit: onSubmitHandler,
        body: _ref2 => {
          let {
            value,
            setValue
          } = _ref2;
          return /*#__PURE__*/react.createElement(src/* Input */.II, {
            label: "Enter the segment label",
            labelClassName: "text-white text-[14px] leading-[1.2]",
            autoFocus: true,
            className: "border-primary-main bg-black",
            type: "text",
            value: value.label,
            onChange: event => {
              event.persist();
              setValue(value => ({
                ...value,
                label: event.target.value
              }));
            },
            onKeyPress: event => {
              if (event.key === 'Enter') {
                onSubmitHandler({
                  value,
                  action: {
                    id: 'save'
                  }
                });
              }
            }
          });
        }
      }
    });
  }
}
/* harmony default export */ const components_callInputDialog = (callInputDialog);
// EXTERNAL MODULE: ../../../node_modules/react-color/es/index.js + 219 modules
var es = __webpack_require__(22831);
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/colorPickerDialog.css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/colorPickerDialog.tsx




function callColorPickerDialog(uiDialogService, rgbaColor, callback) {
  const dialogId = 'pick-color';
  const onSubmitHandler = _ref => {
    let {
      action,
      value
    } = _ref;
    switch (action.id) {
      case 'save':
        callback(value.rgbaColor, action.id);
        break;
      case 'cancel':
        callback('', action.id);
        break;
    }
    uiDialogService.dismiss({
      id: dialogId
    });
  };
  if (uiDialogService) {
    uiDialogService.create({
      id: dialogId,
      centralize: true,
      isDraggable: false,
      showOverlay: true,
      content: src/* Dialog */.Vq,
      contentProps: {
        title: 'Segment Color',
        value: {
          rgbaColor
        },
        noCloseButton: true,
        onClose: () => uiDialogService.dismiss({
          id: dialogId
        }),
        actions: [{
          id: 'cancel',
          text: 'Cancel',
          type: 'primary'
        }, {
          id: 'save',
          text: 'Save',
          type: 'secondary'
        }],
        onSubmit: onSubmitHandler,
        body: _ref2 => {
          let {
            value,
            setValue
          } = _ref2;
          const handleChange = color => {
            setValue({
              rgbaColor: color.rgb
            });
          };
          return /*#__PURE__*/react.createElement(es/* ChromePicker */.AI, {
            color: value.rgbaColor,
            onChange: handleChange,
            presetColors: [],
            width: 300
          });
        }
      }
    });
  }
}
/* harmony default export */ const colorPickerDialog = (callColorPickerDialog);
// EXTERNAL MODULE: ../../../node_modules/react-i18next/dist/es/index.js + 15 modules
var dist_es = __webpack_require__(69190);
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/MonaiSegmentation.tsx







function MonaiSegmentation(_ref) {
  let {
    servicesManager,
    commandsManager,
    extensionManager,
    configuration
  } = _ref;
  const {
    segmentationService,
    uiDialogService
  } = servicesManager.services;
  const {
    t
  } = (0,dist_es/* useTranslation */.$G)('PanelSegmentation');
  const [selectedSegmentationId, setSelectedSegmentationId] = (0,react.useState)(null);
  const [segmentationConfiguration, setSegmentationConfiguration] = (0,react.useState)(segmentationService.getConfiguration());
  const [segmentations, setSegmentations] = (0,react.useState)(() => segmentationService.getSegmentations());
  (0,react.useEffect)(() => {
    // ~~ Subscription
    const added = segmentationService.EVENTS.SEGMENTATION_ADDED;
    const updated = segmentationService.EVENTS.SEGMENTATION_UPDATED;
    const removed = segmentationService.EVENTS.SEGMENTATION_REMOVED;
    const subscriptions = [];
    [added, updated, removed].forEach(evt => {
      const {
        unsubscribe
      } = segmentationService.subscribe(evt, () => {
        const segmentations = segmentationService.getSegmentations();
        setSegmentations(segmentations);
        setSegmentationConfiguration(segmentationService.getConfiguration());
      });
      subscriptions.push(unsubscribe);
    });
    return () => {
      subscriptions.forEach(unsub => {
        unsub();
      });
    };
  }, []);
  const getToolGroupIds = segmentationId => {
    const toolGroupIds = segmentationService.getToolGroupIdsWithSegmentation(segmentationId);
    return toolGroupIds;
  };
  const onSegmentationAdd = async () => {
    commandsManager.runCommand('addSegmentationForActiveViewport');
  };
  const onSegmentationClick = segmentationId => {
    segmentationService.setActiveSegmentationForToolGroup(segmentationId);
  };
  const onSegmentationDelete = segmentationId => {
    segmentationService.remove(segmentationId);
  };
  const onSegmentAdd = segmentationId => {
    segmentationService.addSegment(segmentationId);
  };
  const onSegmentClick = (segmentationId, segmentIndex) => {
    segmentationService.setActiveSegment(segmentationId, segmentIndex);
    const toolGroupIds = getToolGroupIds(segmentationId);
    toolGroupIds.forEach(toolGroupId => {
      // const toolGroupId =
      segmentationService.setActiveSegmentationForToolGroup(segmentationId, toolGroupId);
      segmentationService.jumpToSegmentCenter(segmentationId, segmentIndex, toolGroupId);
    });
  };
  const onSegmentEdit = (segmentationId, segmentIndex) => {
    const segmentation = segmentationService.getSegmentation(segmentationId);
    const segment = segmentation.segments[segmentIndex];
    const {
      label
    } = segment;
    components_callInputDialog(uiDialogService, label, (label, actionId) => {
      if (label === '') {
        return;
      }
      segmentationService.setSegmentLabel(segmentationId, segmentIndex, label);
    });
  };
  const onSegmentationEdit = segmentationId => {
    const segmentation = segmentationService.getSegmentation(segmentationId);
    const {
      label
    } = segmentation;
    components_callInputDialog(uiDialogService, label, (label, actionId) => {
      if (label === '') {
        return;
      }
      segmentationService.addOrUpdateSegmentation({
        id: segmentationId,
        label
      }, false,
      // suppress event
      true // notYetUpdatedAtSource
      );
    });
  };

  const onSegmentColorClick = (segmentationId, segmentIndex) => {
    const segmentation = segmentationService.getSegmentation(segmentationId);
    const segment = segmentation.segments[segmentIndex];
    const {
      color,
      opacity
    } = segment;
    const rgbaColor = {
      r: color[0],
      g: color[1],
      b: color[2],
      a: opacity / 255.0
    };
    colorPickerDialog(uiDialogService, rgbaColor, (newRgbaColor, actionId) => {
      if (actionId === 'cancel') {
        return;
      }
      segmentationService.setSegmentRGBAColor(segmentationId, segmentIndex, [newRgbaColor.r, newRgbaColor.g, newRgbaColor.b, newRgbaColor.a * 255.0]);
    });
  };
  const onSegmentDelete = (segmentationId, segmentIndex) => {
    segmentationService.removeSegment(segmentationId, segmentIndex);
  };
  const onToggleSegmentVisibility = (segmentationId, segmentIndex) => {
    const segmentation = segmentationService.getSegmentation(segmentationId);
    const segmentInfo = segmentation.segments[segmentIndex];
    const isVisible = !segmentInfo.isVisible;
    const toolGroupIds = getToolGroupIds(segmentationId);

    // Todo: right now we apply the visibility to all tool groups
    toolGroupIds.forEach(toolGroupId => {
      segmentationService.setSegmentVisibility(segmentationId, segmentIndex, isVisible, toolGroupId);
    });
  };
  const onToggleSegmentLock = (segmentationId, segmentIndex) => {
    segmentationService.toggleSegmentLocked(segmentationId, segmentIndex);
  };
  const onToggleSegmentationVisibility = segmentationId => {
    segmentationService.toggleSegmentationVisibility(segmentationId);
  };
  const _setSegmentationConfiguration = (0,react.useCallback)((segmentationId, key, value) => {
    segmentationService.setConfiguration({
      segmentationId,
      [key]: value
    });
  }, [segmentationService]);
  const onSegmentationDownload = segmentationId => {
    commandsManager.runCommand('downloadSegmentation', {
      segmentationId
    });
  };
  const onSegmentationDownloadRTSS = segmentationId => {};
  const storeSegmentation = segmentationId => {
    const datasources = extensionManager.getActiveDataSource();
    const getReport = async () => {
      return await commandsManager.runCommand('storeSegmentation', {
        segmentationId,
        dataSource: datasources[0]
      });
    };
    (0,default_src.createReportAsync)({
      servicesManager,
      getReport,
      reportType: 'Segmentation'
    });
  };
  return /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
    className: "flex min-h-0 flex-auto select-none flex-col justify-between"
  }, /*#__PURE__*/react.createElement(src/* SegmentationGroupTable */.cX, {
    title: t('Segmentations'),
    segmentations: segmentations,
    disableEditing: configuration?.disableEditing,
    activeSegmentationId: selectedSegmentationId || '',
    onSegmentationAdd: onSegmentationAdd,
    onSegmentationClick: onSegmentationClick,
    onSegmentationDelete: onSegmentationDelete,
    onSegmentationDownload: onSegmentationDownload,
    storeSegmentation: storeSegmentation,
    onSegmentationEdit: onSegmentationEdit,
    onSegmentClick: onSegmentClick,
    onSegmentEdit: onSegmentEdit,
    onSegmentAdd: onSegmentAdd,
    onSegmentColorClick: onSegmentColorClick,
    onSegmentDelete: onSegmentDelete,
    onToggleSegmentVisibility: onToggleSegmentVisibility,
    onToggleSegmentLock: onToggleSegmentLock,
    onToggleSegmentationVisibility: onToggleSegmentationVisibility,
    showDeleteSegment: true,
    segmentationConfig: {
      initialConfig: segmentationConfiguration
    },
    onSegmentationDownloadRTSS: onSegmentationDownloadRTSS,
    setRenderOutline: value => _setSegmentationConfiguration(selectedSegmentationId, 'renderOutline', value),
    setOutlineOpacityActive: value => _setSegmentationConfiguration(selectedSegmentationId, 'outlineOpacity', value),
    setRenderFill: value => _setSegmentationConfiguration(selectedSegmentationId, 'renderFill', value),
    setRenderInactiveSegmentations: value => _setSegmentationConfiguration(selectedSegmentationId, 'renderInactiveSegmentations', value),
    setOutlineWidthActive: value => _setSegmentationConfiguration(selectedSegmentationId, 'outlineWidthActive', value),
    setFillAlpha: value => _setSegmentationConfiguration(selectedSegmentationId, 'fillAlpha', value),
    setFillAlphaInactive: value => _setSegmentationConfiguration(selectedSegmentationId, 'fillAlphaInactive', value)
  })));
}
MonaiSegmentation.propTypes = {
  commandsManager: prop_types_default().shape({
    runCommand: (prop_types_default()).func.isRequired
  }),
  servicesManager: prop_types_default().shape({
    services: prop_types_default().shape({
      segmentationService: prop_types_default().shape({
        getSegmentation: (prop_types_default()).func.isRequired,
        getSegmentations: (prop_types_default()).func.isRequired,
        toggleSegmentationVisibility: (prop_types_default()).func.isRequired,
        subscribe: (prop_types_default()).func.isRequired,
        EVENTS: (prop_types_default()).object.isRequired
      }).isRequired
    }).isRequired
  }).isRequired
};
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/SegmentationToolbox.tsx



const {
  segmentation: segmentationUtils
} = dist_esm.utilities;
const ACTIONS = {
  SET_BRUSH_SIZE: 'SET_BRUSH_SIZE',
  SET_TOOL_CONFIG: 'SET_TOOL_CONFIG',
  SET_ACTIVE_TOOL: 'SET_ACTIVE_TOOL'
};
const initialState = {
  Brush: {
    brushSize: 15,
    mode: 'CircularBrush' // Can be 'CircularBrush' or 'SphereBrush'
  },

  Eraser: {
    brushSize: 15,
    mode: 'CircularEraser' // Can be 'CircularEraser' or 'SphereEraser'
  },

  Scissors: {
    brushSize: 15,
    mode: 'CircleScissor' // E.g., 'CircleScissor', 'RectangleScissor', or 'SphereScissor'
  },

  ThresholdBrush: {
    brushSize: 15,
    thresholdRange: [-500, 500]
  },
  activeTool: null
};
function toolboxReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_TOOL_CONFIG:
      const {
        tool,
        config
      } = action.payload;
      return {
        ...state,
        [tool]: {
          ...state[tool],
          ...config
        }
      };
    case ACTIONS.SET_ACTIVE_TOOL:
      return {
        ...state,
        activeTool: action.payload
      };
    default:
      return state;
  }
}
function SegmentationToolbox(_ref) {
  let {
    servicesManager,
    extensionManager
  } = _ref;
  const {
    toolbarService,
    segmentationService,
    toolGroupService
  } = servicesManager.services;
  const [viewportGrid] = (0,src/* useViewportGrid */.O_)();
  const {
    viewports,
    activeViewportId
  } = viewportGrid;
  const [toolsEnabled, setToolsEnabled] = (0,react.useState)(false);
  const [state, dispatch] = (0,react.useReducer)(toolboxReducer, initialState);
  const updateActiveTool = (0,react.useCallback)(() => {
    if (!viewports?.size || activeViewportId === undefined) {
      return;
    }
    const viewport = viewports.get(activeViewportId);
    dispatch({
      type: ACTIONS.SET_ACTIVE_TOOL,
      payload: toolGroupService.getActiveToolForViewport(viewport.viewportId)
    });
  }, [activeViewportId, viewports, toolGroupService, dispatch]);

  /**
   * sets the tools enabled IF there are segmentations
   */
  (0,react.useEffect)(() => {
    const events = [segmentationService.EVENTS.SEGMENTATION_ADDED, segmentationService.EVENTS.SEGMENTATION_UPDATED];
    const unsubscriptions = [];
    events.forEach(event => {
      const {
        unsubscribe
      } = segmentationService.subscribe(event, () => {
        const segmentations = segmentationService.getSegmentations();
        const activeSegmentation = segmentations?.find(seg => seg.isActive);
        setToolsEnabled(activeSegmentation?.segmentCount > 0);
      });
      unsubscriptions.push(unsubscribe);
    });
    return () => {
      unsubscriptions.forEach(unsubscribe => unsubscribe());
    };
  }, [activeViewportId, viewports, segmentationService]);

  /**
   * Update the active tool when the toolbar state changes
   */
  (0,react.useEffect)(() => {
    const {
      unsubscribe
    } = toolbarService.subscribe(toolbarService.EVENTS.TOOL_BAR_STATE_MODIFIED, () => {
      updateActiveTool();
    });
    return () => {
      unsubscribe();
    };
  }, [toolbarService, updateActiveTool]);
  const setToolActive = (0,react.useCallback)(toolName => {
    toolbarService.recordInteraction({
      groupId: 'SegmentationTools',
      itemId: 'Brush',
      interactionType: 'tool',
      commands: [{
        commandName: 'setToolActive',
        commandOptions: {
          toolName
        }
      }]
    });
    dispatch({
      type: ACTIONS.SET_ACTIVE_TOOL,
      payload: toolName
    });
  }, [toolbarService, dispatch]);
  const updateBrushSize = (0,react.useCallback)((toolName, brushSize) => {
    toolGroupService.getToolGroupIds()?.forEach(toolGroupId => {
      segmentationUtils.setBrushSizeForToolGroup(toolGroupId, brushSize, toolName);
    });
  }, [toolGroupService]);
  const onBrushSizeChange = (0,react.useCallback)((valueAsStringOrNumber, toolCategory) => {
    const value = Number(valueAsStringOrNumber);
    _getToolNamesFromCategory(toolCategory).forEach(toolName => {
      updateBrushSize(toolName, value);
    });
    dispatch({
      type: ACTIONS.SET_TOOL_CONFIG,
      payload: {
        tool: toolCategory,
        config: {
          brushSize: value
        }
      }
    });
  }, [toolGroupService, dispatch]);
  const handleRangeChange = (0,react.useCallback)(newRange => {
    if (newRange[0] === state.ThresholdBrush.thresholdRange[0] && newRange[1] === state.ThresholdBrush.thresholdRange[1]) {
      return;
    }
    const toolNames = _getToolNamesFromCategory('ThresholdBrush');
    toolNames.forEach(toolName => {
      toolGroupService.getToolGroupIds()?.forEach(toolGroupId => {
        const toolGroup = toolGroupService.getToolGroup(toolGroupId);
        toolGroup.setToolConfiguration(toolName, {
          strategySpecificConfiguration: {
            THRESHOLD_INSIDE_CIRCLE: {
              threshold: newRange
            }
          }
        });
      });
    });
    dispatch({
      type: ACTIONS.SET_TOOL_CONFIG,
      payload: {
        tool: 'ThresholdBrush',
        config: {
          thresholdRange: newRange
        }
      }
    });
  }, [toolGroupService, dispatch, state.ThresholdBrush.thresholdRange]);
  return /*#__PURE__*/react.createElement(src/* AdvancedToolbox */.bY, {
    title: "Segmentation Tools",
    items: [{
      name: 'Brush',
      icon: 'icon-tool-brush',
      disabled: !toolsEnabled,
      active: state.activeTool === 'CircularBrush' || state.activeTool === 'SphereBrush',
      onClick: () => setToolActive('CircularBrush'),
      options: [{
        name: 'Radius (mm)',
        id: 'brush-radius',
        type: 'range',
        min: 0.01,
        max: 100,
        value: state.Brush.brushSize,
        step: 0.5,
        onChange: value => onBrushSizeChange(value, 'Brush')
      }, {
        name: 'Mode',
        type: 'radio',
        id: 'brush-mode',
        value: state.Brush.mode,
        values: [{
          value: 'CircularBrush',
          label: 'Circle'
        }, {
          value: 'SphereBrush',
          label: 'Sphere'
        }],
        onChange: value => setToolActive(value)
      }]
    }, {
      name: 'Eraser',
      icon: 'icon-tool-eraser',
      disabled: !toolsEnabled,
      active: state.activeTool === 'CircularEraser' || state.activeTool === 'SphereEraser',
      onClick: () => setToolActive('CircularEraser'),
      options: [{
        name: 'Radius (mm)',
        type: 'range',
        id: 'eraser-radius',
        min: 0.01,
        max: 100,
        value: state.Eraser.brushSize,
        step: 0.5,
        onChange: value => onBrushSizeChange(value, 'Eraser')
      }, {
        name: 'Mode',
        type: 'radio',
        id: 'eraser-mode',
        value: state.Eraser.mode,
        values: [{
          value: 'CircularEraser',
          label: 'Circle'
        }, {
          value: 'SphereEraser',
          label: 'Sphere'
        }],
        onChange: value => setToolActive(value)
      }]
    }, {
      name: 'Scissor',
      icon: 'icon-tool-scissor',
      disabled: !toolsEnabled,
      active: state.activeTool === 'CircleScissor' || state.activeTool === 'RectangleScissor' || state.activeTool === 'SphereScissor',
      onClick: () => setToolActive('CircleScissor'),
      options: [{
        name: 'Mode',
        type: 'radio',
        value: state.Scissors.mode,
        id: 'scissor-mode',
        values: [{
          value: 'CircleScissor',
          label: 'Circle'
        }, {
          value: 'RectangleScissor',
          label: 'Rectangle'
        }, {
          value: 'SphereScissor',
          label: 'Sphere'
        }],
        onChange: value => setToolActive(value)
      }]
    }, {
      name: 'Threshold Tool',
      icon: 'icon-tool-threshold',
      disabled: !toolsEnabled,
      active: state.activeTool === 'ThresholdCircularBrush' || state.activeTool === 'ThresholdSphereBrush',
      onClick: () => setToolActive('ThresholdCircularBrush'),
      options: [{
        name: 'Radius (mm)',
        id: 'threshold-radius',
        type: 'range',
        min: 0.01,
        max: 100,
        value: state.ThresholdBrush.brushSize,
        step: 0.5,
        onChange: value => onBrushSizeChange(value, 'ThresholdBrush')
      }, {
        name: 'Mode',
        type: 'radio',
        id: 'threshold-mode',
        value: state.activeTool,
        values: [{
          value: 'ThresholdCircularBrush',
          label: 'Circle'
        }, {
          value: 'ThresholdSphereBrush',
          label: 'Sphere'
        }],
        onChange: value => setToolActive(value)
      }, {
        type: 'custom',
        children: () => {
          return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement("div", {
            className: "bg-secondary-light h-[1px]"
          }), /*#__PURE__*/react.createElement("div", {
            className: "mt-1 text-[13px] text-white"
          }, "Threshold"), /*#__PURE__*/react.createElement(src/* InputDoubleRange */.R0, {
            values: state.ThresholdBrush.thresholdRange,
            onChange: handleRangeChange,
            minValue: -1000,
            maxValue: 1000,
            step: 1,
            showLabel: true,
            allowNumberEdit: true,
            showAdjustmentArrows: false
          }));
        }
      }]
    }]
  });
}
function _getToolNamesFromCategory(category) {
  let toolNames = [];
  switch (category) {
    case 'Brush':
      toolNames = ['CircularBrush', 'SphereBrush'];
      break;
    case 'Eraser':
      toolNames = ['CircularEraser', 'SphereEraser'];
      break;
    case 'ThresholdBrush':
      toolNames = ['ThresholdCircularBrush', 'ThresholdSphereBrush'];
      break;
    default:
      break;
  }
  return toolNames;
}
/* harmony default export */ const components_SegmentationToolbox = (SegmentationToolbox);
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/components/MonaiLabelPanel.tsx














class MonaiLabelPanel extends react.Component {
  constructor(props) {
    super(props);
    this.notification = void 0;
    this.settings = void 0;
    this.state = void 0;
    this.actions = void 0;
    this.props = void 0;
    this.SeriesInstanceUID = void 0;
    this.StudyInstanceUID = void 0;
    this.client = () => {
      const settings = this.settings && this.settings.current && this.settings.current.state ? this.settings.current.state : null;
      return new MonaiLabelClient(settings ? settings.url : 'http://127.0.0.1:8000');
    };
    this.onInfo = async () => {
      this.notification.show({
        title: 'MONAI Label',
        message: 'Connecting to MONAI Label',
        type: 'info',
        duration: 3000
      });

      this.refreshUIDs();
    
      const response = await this.client().info();
      const labels = response.data.labels;
      const segmentations = [{
        id: '1',
        label: 'Segmentations',
        segments: labels.map((label, index) => ({
          segmentIndex: index + 1,
          label
        })),
        isActive: true,
        activeSegmentIndex: 1
      }];
      this.props.commandsManager.runCommand('loadSegmentationsForViewport', {
        segmentations
      });
      if (response.status !== 200) {
        this.notification.show({
          title: 'MONAI Label',
          message: 'Failed to Connect to MONAI Label Server',
          type: 'error',
          duration: 5000
        });
      } else {
        this.notification.show({
          title: 'MONAI Label',
          message: 'Connected to MONAI Label Server - Successful',
          type: 'success',
          duration: 2000
        });
        this.setState({
          info: response.data
        });
      }
    };
    this.onSelectActionTab = name => {
      // Leave Event
      for (const action of Object.keys(this.actions)) {
        if (this.state.action === action) {
          if (this.actions[action].current) this.actions[action].current.onLeaveActionTab();
        }
      }

      // Enter Event
      for (const action of Object.keys(this.actions)) {
        if (name === action) {
          if (this.actions[action].current) this.actions[action].current.onEnterActionTab();
        }
      }
      this.setState({
        action: name
      });
    };
    this.onOptionsConfig = () => {
      return this.actions['options'].current && this.actions['options'].current.state ? this.actions['options'].current.state.config : {};
    };
    this._update = async (response, labelNames) => {
      // Process the obtained binary file from the MONAI Label server
      /* const onInfoLabelNames = this.state.info.labels */
      const onInfoLabelNames = labelNames;
      console.info('These are the predicted labels');
      console.info(onInfoLabelNames);
      if (onInfoLabelNames.hasOwnProperty('background')) {
        delete onInfoLabelNames.background;
      }
      const ret = SegmentationReader.parseNrrdData(response.data);
      if (!ret) {
        throw new Error('Failed to parse NRRD data');
      }
      
      delete response.data
      const data = new Uint16Array(ret.image);
      delete ret.image

      // reformat centroids
      const centroidsIJK = new Map();
      for (const [key, value] of Object.entries(response.centroids)) {
        const segmentIndex = parseInt(value[0], 10);
        const image = value.slice(1).map(v => parseFloat(v));
        centroidsIJK.set(segmentIndex, {
          image: image,
          world: []
        });
      }
      const segmentations = [{
        id: '1',
        label: 'Segmentations',
        segments: Object.keys(onInfoLabelNames).map(key => ({
          segmentIndex: onInfoLabelNames[key],
          label: key
        })),
        isActive: true,
        activeSegmentIndex: 1,
        scalarData: data,
        FrameOfReferenceUID: this.FrameOfReferenceUID,
        centroidsIJK: centroidsIJK
      }];

      // Todo: rename volumeId
      const volumeLoadObject = esm.cache.getVolume('1');
      if (volumeLoadObject) {
        const {
          scalarData
        } = volumeLoadObject;
        scalarData.set(data);
        (0,esm.triggerEvent)(esm.eventTarget, dist_esm.Enums.Events.SEGMENTATION_DATA_MODIFIED, {
          segmentationId: '1'
        });
        console.debug("updated the segmentation's scalar data");
      } else {
        this.props.commandsManager.runCommand('hydrateSegmentationsForViewport', {
          segmentations
        });
      }
    };
    this._debug = async () => {
      let nrrdFetch = await fetch('http://localhost:3000/pred2.nrrd');
      const info = {
        spleen: 1,
        'right kidney': 2,
        'left kidney': 3,
        liver: 6,
        stomach: 7,
        aorta: 8,
        'inferior vena cava': 9
      };
      const nrrd = await nrrdFetch.arrayBuffer();
      this._update({
        data: nrrd
      }, info);
    };
    this.parseResponse = response => {
      const contentType = response.headers['content-type'];
      const boundaryMatch = contentType.match(/boundary=([^;]+)/i);
      const boundary = boundaryMatch ? boundaryMatch[1] : null;
      
      let text = new TextDecoder().decode(response.data);
      delete response.data
      
      let parts = text.split(`--${boundary}`).filter(part => part.trim() !== '');
      text = undefined

      // Find the JSON part and NRRD part
      const jsonPart = parts.find(part => part.includes('Content-Type: application/json'));
      let nrrdPart = parts.find(part => part.includes('Content-Type: application/octet-stream'));
      parts = undefined

      // Extract JSON data
      const jsonStartIndex = jsonPart.indexOf('{');
      const jsonEndIndex = jsonPart.lastIndexOf('}');
      const jsonData = JSON.parse(jsonPart.slice(jsonStartIndex, jsonEndIndex + 1));

      // Extract NRRD data
      let binaryData = nrrdPart.split('\r\n\r\n')[1];
      nrrdPart = undefined
      const binaryDataEnd = binaryData.lastIndexOf('\r\n');
      const nrrdArrayBuffer = new Uint8Array(binaryData.slice(0, binaryDataEnd).split('').map(c => c.charCodeAt(0))).buffer;
      binaryData = undefined
      
      return {
        data: nrrdArrayBuffer,
        centroids: jsonData.centroids
      };
    };
    this.updateView = async (response, labelNames) => {
      const {
        data,
        centroids
      } = this.parseResponse(response);
      this._update({
        data,
        centroids
      }, labelNames);
    };
    const {
      uiNotificationService,
      viewportGridService,
      displaySetService
    } = props.servicesManager.services;
    this.notification = uiNotificationService;
    this.settings = /*#__PURE__*/react.createRef();
    this.actions = {
      options: /*#__PURE__*/react.createRef(),
      activeLearning: /*#__PURE__*/react.createRef(),
      segmentation: /*#__PURE__*/react.createRef(),
      smartedit: /*#__PURE__*/react.createRef()
    };
    this.state = {
      info: {},
      action: {},
      segmentations: [],
      SeriesInstanceUID: "",
      StudyInstanceUID: ""
    };

    // Todo: fix this hack
    setTimeout(() => {
      const {
        viewports,
        activeViewportId
      } = viewportGridService.getState();
      const viewport = viewports.get(activeViewportId);
      const displaySet = displaySetService.getDisplaySetByUID(viewport.displaySetInstanceUIDs[0]);
      this.SeriesInstanceUID = displaySet.SeriesInstanceUID;
      this.StudyInstanceUID = displaySet.StudyInstanceUID;
      this.FrameOfReferenceUID = displaySet.instances[0].FrameOfReferenceUID;
      this.displaySetInstanceUID = displaySet.displaySetInstanceUID;

      this.setState({
        SeriesInstanceUID: displaySet.SeriesInstanceUID,
        StudyInstanceUID: displaySet.StudyInstanceUID
      })
      
    }, 5000);
  }

  refreshUIDs = () => {

    const { uiNotificationService, viewportGridService, displaySetService } = this.props.servicesManager.services

    const { viewports, activeViewportId } = viewportGridService.getState();
      const viewport = viewports.get(activeViewportId);
      const displaySet = displaySetService.getDisplaySetByUID(
        viewport.displaySetInstanceUIDs[0]
      );

    this.setState({
      SeriesInstanceUID: displaySet.SeriesInstanceUID,
      StudyInstanceUID: displaySet.StudyInstanceUID
    })

    console.log(this.state)

  }
  
  async componentDidMount() {
    const {
      segmentationService
    } = this.props.servicesManager.services;
    const added = segmentationService.EVENTS.SEGMENTATION_ADDED;
    const updated = segmentationService.EVENTS.SEGMENTATION_UPDATED;
    const removed = segmentationService.EVENTS.SEGMENTATION_REMOVED;
    const subscriptions = [];
    [added, updated, removed].forEach(evt => {
      const {
        unsubscribe
      } = segmentationService.subscribe(evt, () => {
        const segmentations = segmentationService.getSegmentations();
        if (!segmentations?.length) {
          return;
        }
        this.setState({
          segmentations
        });
      });
      subscriptions.push(unsubscribe);
    });
    this.unsubscribe = () => {
      subscriptions.forEach(unsubscribe => unsubscribe());
    };
  }

  // componentDidUnmount? Doesn't exist this method anymore in V3?
  async componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    return /*#__PURE__*/react.createElement("div", {
      className: "monaiLabelPanel"
    }, /*#__PURE__*/react.createElement("br", {
      style: {
        margin: '3px'
      }
    }), /*#__PURE__*/react.createElement(SettingsTable, {
      ref: this.settings,
      onInfo: this.onInfo
    }), /*#__PURE__*/react.createElement("hr", {
      className: "separator"
    }), /*#__PURE__*/react.createElement("p", {
      className: "subtitle"
    }, this.state.info.name), /*#__PURE__*/react.createElement("div", {
      className: "tabs scrollbar",
      id: "style-3"
    }, /*#__PURE__*/react.createElement(OptionTable, {
      ref: this.actions['options'],
      tabIndex: 1,
      info: this.state.info,
      viewConstants: {
        SeriesInstanceUID: this.SeriesInstanceUID,
        StudyInstanceUID: this.StudyInstanceUID
      },
      client: this.client,
      notification: this.notification
      //updateView={this.updateView}
      ,
      onSelectActionTab: this.onSelectActionTab
    }), /*#__PURE__*/react.createElement(ActiveLearning_OptionTable, {
      ref: this.actions['activelearning'],
      tabIndex: 2,
      info: this.state.info,
      viewConstants: {
        SeriesInstanceUID: this.state.SeriesInstanceUID,
        StudyInstanceUID: this.state.StudyInstanceUID
      },
      client: this.client,
      notification: this.notification
      /* updateView={this.updateView} */,
      onSelectActionTab: this.onSelectActionTab,
      onOptionsConfig: this.onOptionsConfig
      // additional function - delete scribbles before submit
      /* onDeleteSegmentByName={this.onDeleteSegmentByName} */
    }), /*#__PURE__*/react.createElement(AutoSegmentation, {
      ref: this.actions['segmentation'],
      tabIndex: 3,
      info: this.state.info,
      viewConstants: {
        SeriesInstanceUID: this.SeriesInstanceUID,
        StudyInstanceUID: this.StudyInstanceUID
      },
      client: this.client,
      notification: this.notification,
      updateView: this.updateView,
      onSelectActionTab: this.onSelectActionTab,
      onOptionsConfig: this.onOptionsConfig
    }), /*#__PURE__*/react.createElement(SmartEdit, {
      ref: this.actions['smartedit'],
      tabIndex: 4,
      servicesManager: this.props.servicesManager,
      commandsManager: this.props.commandsManager,
      info: this.state.info
      // Here we have to send element - In OHIF V2 - const element = cornerstone.getEnabledElements()[this.props.activeIndex].element;
      ,
      viewConstants: {
        SeriesInstanceUID: this.SeriesInstanceUID,
        StudyInstanceUID: this.StudyInstanceUID
      },
      client: this.client,
      notification: this.notification,
      updateView: this.updateView,
      onSelectActionTab: this.onSelectActionTab,
      onOptionsConfig: this.onOptionsConfig
    })), this.state.segmentations?.map(segmentation => /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement(components_SegmentationToolbox, {
      servicesManager: this.props.servicesManager
    }), /*#__PURE__*/react.createElement(MonaiSegmentation, {
      servicesManager: this.props.servicesManager,
      extensionManager: this.props.extensionManager,
      commandsManager: this.props.commandsManager
    }))));
  }
}
MonaiLabelPanel.propTypes = {
  commandsManager: (prop_types_default()).any,
  servicesManager: (prop_types_default()).any,
  extensionManager: (prop_types_default()).any
};
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/getPanelModule.tsx


function getPanelModule(_ref) {
  let {
    commandsManager,
    extensionManager,
    servicesManager
  } = _ref;
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
function getCommandsModule(_ref) {
  let {
    servicesManager,
    commandsManager,
    extensionManager
  } = _ref;
  const {
    viewportGridService,
    toolGroupService,
    cineService,
    toolbarService,
    uiNotificationService
  } = servicesManager.services;
  const actions = {
    setToolActive: _ref2 => {
      let {
        toolName
      } = _ref2;
      uiNotificationService.show({
        title: 'MONAI Label probe',
        message: 'MONAI Label Probe Activated.',
        type: 'info',
        duration: 3000
      });
    }
  };
  const definitions = {
    /* setToolActive: {
      commandFn: actions.setToolActive,
    }, */
  };
  return {
    actions,
    definitions,
    defaultContext: 'MONAILabel'
  };
}
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/tools/ProbeMONAILabelTool.ts

const {
  getAnnotations
} = dist_esm.annotation.state;
class ProbeMONAILabelTool extends dist_esm.ProbeTool {
  constructor() {
    let toolProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let defaultToolProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      configuration: {
        customColor: undefined
      }
    };
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
        dist_esm.drawing.drawHandles(svgDrawingHelper, annotationUID, handleGroupUID, [canvasCoordinates], {
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
function init(_ref) {
  let {
    servicesManager,
    configuration = {}
  } = _ref;
  (0,dist_esm.addTool)(ProbeMONAILabelTool);
}
;// CONCATENATED MODULE: ../../../../extensions/monai-label/src/index.tsx




/* harmony default export */ const monai_label_src = ({
  id: id,
  preRegistration: init,
  getPanelModule: src_getPanelModule,
  getViewportModule: _ref => {
    let {
      servicesManager,
      commandsManager,
      extensionManager
    } = _ref;
  },
  getToolbarModule: _ref2 => {
    let {
      servicesManager,
      commandsManager,
      extensionManager
    } = _ref2;
  },
  getLayoutTemplateModule: _ref3 => {
    let {
      servicesManager,
      commandsManager,
      extensionManager
    } = _ref3;
  },
  getSopClassHandlerModule: _ref4 => {
    let {
      servicesManager,
      commandsManager,
      extensionManager
    } = _ref4;
  },
  getHangingProtocolModule: _ref5 => {
    let {
      servicesManager,
      commandsManager,
      extensionManager
    } = _ref5;
  },
  getCommandsModule: getCommandsModule,
  getContextModule: _ref6 => {
    let {
      servicesManager,
      commandsManager,
      extensionManager
    } = _ref6;
  },
  getDataSourcesModule: _ref7 => {
    let {
      servicesManager,
      commandsManager,
      extensionManager
    } = _ref7;
  }
});

/***/ }),

/***/ 78753:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 99971:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"@ohif/extension-monai-label","version":"0.0.1","description":"OHIFv3 extension for MONAI Label","author":"OHIF,NVIDIA,KCL","license":"MIT","main":"dist/umd/extension-monai-label/index.umd.js","files":["dist/**","public/**","README.md"],"repository":"OHIF/Viewers","keywords":["ohif-extension"],"module":"src/index.tsx","publishConfig":{"access":"public"},"engines":{"node":">=14","npm":">=6","yarn":">=1.18.0"},"scripts":{"dev":"cross-env NODE_ENV=development webpack --config .webpack/webpack.dev.js --watch --output-pathinfo","dev:my-extension":"yarn run dev","build":"cross-env NODE_ENV=production webpack --config .webpack/webpack.prod.js","build:package":"yarn run build","start":"yarn run dev"},"peerDependencies":{"@ohif/core":"^3.7.0-beta.80","@ohif/extension-default":"^3.7.0-beta.80","@ohif/extension-cornerstone":"^3.7.0-beta.80","@ohif/i18n":"^3.7.0-beta.80","prop-types":"^15.6.2","react":"^17.0.2","react-dom":"^17.0.2","react-i18next":"^12.2.2","react-router":"^6.8.1","react-router-dom":"^6.8.1"},"dependencies":{"@babel/runtime":"^7.20.13","md5.js":"^1.3.5","axios":"^0.21.1","arraybuffer-concat":"^0.0.1","ndarray":"^1.0.19","nrrd-js":"^0.2.1","pako":"^2.0.3","react-color":"^2.19.3","bootstrap":"^5.0.2","react-select":"^4.3.1","chroma-js":"^2.1.2","itk":"^14.1.1"},"devDependencies":{"@babel/runtime":"^7.20.13","@cornerstonejs/tools":"^1.16.4","react-color":"^2.19.3"}}');

/***/ })

}]);