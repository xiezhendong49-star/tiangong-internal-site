/* V3 requirement-aligned prototype. Loaded after the original demo and intentionally
   redefines the screen functions while preserving the existing preview shell. */

const V3_USER_ASSETS = {
  floor: 'prototype_assets/floor-chunhe-121.jpg',
  style: 'prototype_assets/style-modern-warm.jpg',
  effectBefore: 'prototype_assets/effect-before-bedroom.png',
  effectAfter: 'prototype_assets/effect-after-bedroom.png',
  materials: [
    'prototype_assets/material-soft-white.png',
    'prototype_assets/material-linear-weave.png',
    'prototype_assets/material-boucle-white.jpg',
  ],
};

const V3_FLOORS = [
  { name: '春·和 121㎡ 三居两卫', image: V3_USER_ASSETS.floor },
  ...DEMO_FLOOR_ITEMS.slice(1, 8).map(([name, image]) => ({ name, image })),
];

const V3_STYLES = [
  { name: '现代暖奢', image: V3_USER_ASSETS.style },
  ...DEMO_STYLE_ITEMS.slice(1, 12).map(([name, image]) => ({
    name,
    image: name === '新中式'
      ? 'prototype_assets/room-alt.jpg'
      : name === '日式原木'
        ? 'prototype_assets/effect-after-bedroom.png'
        : image,
  })),
];

V3_USER_ASSETS.materials.forEach((image, index) => {
  if (MATERIAL_CATALOG[index]) MATERIAL_CATALOG[index].image = image;
});
Object.assign(MATERIAL_CATALOG[0], { name: '暖白内墙涂料', categoryName: '涂料' });
Object.assign(MATERIAL_CATALOG[1], { name: '米脂木饰面', categoryName: '木材' });
Object.assign(MATERIAL_CATALOG[2], { name: '莎士比亚米色地毯', categoryName: '地毯' });

const V3_EFFECT_PRESETS = [
  { name: '暖光主卧', image: V3_USER_ASSETS.effectBefore },
  { name: '原木餐厅', image: V3_STYLE_SCENE_IMAGES[1] },
  { name: '现代主卧', image: V3_STYLE_SCENE_IMAGES[2] },
  { name: '简约会客厅', image: V3_STYLE_SCENE_IMAGES[3] },
  { name: '自然光餐厅', image: V3_STYLE_SCENE_IMAGES[4] },
];

const V3_CATALOG_CATEGORIES = {
  tiangong: [
    ['装饰材料', '#64cfe1'], ['瓷砖', '#875235'], ['石材', '#f5a13b'], ['木地板', '#b9a27a'],
    ['架空地板', '#9b9b9b'], ['橡胶地板', '#f7dfaa'], ['地毯', '#ec8fa9'], ['涂料', '#7845e6'],
    ['墙纸壁布', '#ff5458'], ['木质门', '#69db61'], ['板材、龙骨', '#4f88e8'], ['铝板', '#d9d9d9'],
    ['洁具', '#83dcdf'], ['灯具', '#f7df9b'],
  ],
  zhaocai: [
    ['石材', '#d8c69d'], ['砖', '#875235'], ['木材', '#f5a13b'], ['地板', '#b9a27a'],
    ['涂料', '#765333'], ['墙纸', '#9d9d9d'], ['玻璃', '#f1f1ee'], ['金属', '#f3dfb1'],
    ['特殊材料', '#eba2b4'], ['面料', '#7845e6'], ['窗帘', '#ff5458'], ['洁具', '#69db61'],
    ['五金', '#4f88e8'], ['工程灯具', '#f0d28b'], ['开关面板', '#d7c29b'], ['镜子', '#e6e6e6'],
    ['室内分区', '#baa982'], ['门窗', '#cab98f'],
  ],
};

const V3_EFFECT_HISTORY_SEED = [
  { id: 'history-3', name: '花香壹号 · 现代简约', image: V3_STYLE_SCENE_IMAGES[3], time: '2026-08-31 16:42', operator: '高志远' },
  { id: 'history-2', name: '滨江四居 · 原木风', image: V3_STYLE_SCENE_IMAGES[1], time: '2026-08-31 14:18', operator: '陈晓' },
  { id: 'history-1', name: '澜庭四居 · 奶油风', image: V3_STYLE_SCENE_IMAGES[4], time: '2026-08-30 11:06', operator: '高志远' },
];
const V3_EFFECT_HISTORY_IMAGE_UPGRADE = Object.fromEntries(V3_EFFECT_HISTORY_SEED.map(item => [item.id, item.image]));
const V3_HISTORY_STORAGE_KEY = 'tiangong-v3-effect-history';
const V3_EFFECT_HISTORY = (() => {
  if (typeof localStorage === 'undefined') return [...V3_EFFECT_HISTORY_SEED];
  try {
    const saved = JSON.parse(localStorage.getItem(V3_HISTORY_STORAGE_KEY) || '[]');
    return Array.isArray(saved) && saved.length
      ? saved.map(item => V3_EFFECT_HISTORY_IMAGE_UPGRADE[item.id] ? { ...item, image: V3_EFFECT_HISTORY_IMAGE_UPGRADE[item.id] } : item)
      : [...V3_EFFECT_HISTORY_SEED];
  } catch (_) {
    return [...V3_EFFECT_HISTORY_SEED];
  }
})();

function v3PersistEffectHistory() {
  if (typeof localStorage === 'undefined') return;
  try { localStorage.setItem(V3_HISTORY_STORAGE_KEY, JSON.stringify(V3_EFFECT_HISTORY.slice(0, 30))); } catch (_) {}
}

const V3_ADMIN_ITEMS = {
  floor: V3_FLOORS.slice(0, 6).map((item, index) => ({ ...item, sort: index + 1, status: '启用', operator: '高志远', updatedAt: `2026-08-${30 - index} 10:2${index}` })),
  effect: V3_EFFECT_PRESETS.map((item, index) => ({ ...item, sort: index + 1, status: '启用', operator: index % 2 ? '陈晓' : '高志远', updatedAt: `2026-08-${29 - index} 15:1${index}` })),
  style: V3_STYLES.slice(0, 8).map((item, index) => ({ ...item, sort: index + 1, status: '启用', operator: '高志远', updatedAt: `2026-08-${28 - index} 09:3${index}` })),
};

const V3_INSTITUTIONS = [
  { id: 'JG138196', name: '空间改造设计机构', admin: '刘晨', quota: 120, used: 37, startAt: '2026-09-01T00:00', endAt: '2027-08-31T23:59' },
  { id: 'JG633483', name: '成都近相室内设计有限公司', admin: '李彬', quota: 80, used: 62, startAt: '2026-08-01T00:00', endAt: '2027-07-31T23:59' },
  { id: 'JG714865', name: 'MCC利宾国际', admin: '机构管理员', quota: 200, used: 94, startAt: '2026-07-01T00:00', endAt: '2027-06-30T23:59' },
  { id: 'JG615047', name: '贝泰室内设计有限公司', admin: '机构管理员', quota: 60, used: 18, startAt: '2026-09-01T00:00', endAt: '2027-08-31T23:59' },
];

const V3_ZHAO_ORGS = [
  { id: 'PP138196', name: '空间改造/刘晨', admin: '刘晨', account: '18680340653', location: '广东省/深圳市', scale: '0-20人', created: '2026-08-20 14:24:11', lastLogin: '2026-08-20 14:04:12', members: 1, tag: '', payment: '试用客户', quota: 120, used: 37, startAt: '2026-08-19T00:00', endAt: '2035-08-01T23:59', version: '专业版', memberLimit: 10, coins: 0 },
  { id: 'YF633483', name: '成都近相室内设计有限公司', admin: '李彬', account: '19949403933', location: '四川省/成都市', scale: '0-20人', created: '2026-08-07 16:04:06', lastLogin: '2026-08-07 16:24:45', members: 1, tag: '北京物料房沙龙', payment: '试用客户', quota: 80, used: 62, startAt: '2026-08-01T00:00', endAt: '2027-07-31T23:59', version: '专业版', memberLimit: 10, coins: 0 },
  { id: 'EP714865', name: 'MCC利宾国际', admin: '机构管理员', account: '13268351441', location: '广东省/深圳市', scale: '100-499人', created: '2026-07-31 11:56:28', lastLogin: '2026-07-31 15:39:59', members: 1, tag: 'Connie介绍', payment: '试用客户', quota: 200, used: 94, startAt: '2026-07-01T00:00', endAt: '2027-06-30T23:59', version: '专业版', memberLimit: 10, coins: 0 },
  { id: 'DJ615047', name: '贝泰室内设计(重庆)有限公司', admin: '机构管理员', account: '13452918674', location: '重庆市/市辖区', scale: '20-99人', created: '2026-07-23 16:58:41', lastLogin: '2026-07-24 14:47:58', members: 1, tag: '', payment: '试用客户', quota: 60, used: 18, startAt: '2026-07-01T00:00', endAt: '2027-06-30T23:59', version: '专业版', memberLimit: 10, coins: 0 },
  { id: 'CR778821', name: '云南布之空间设计有限公司', admin: '张越童', account: '15331750331', location: '云南省/昆明市', scale: '20-99人', created: '2026-07-17 15:58:23', lastLogin: '2026-08-14 13:50:32', members: 1, tag: '北京物料房沙龙', payment: '试用客户', quota: 100, used: 26, startAt: '2026-07-01T00:00', endAt: '2027-06-30T23:59', version: '专业版', memberLimit: 10, coins: 0 },
  { id: 'KN916676', name: '深圳市宁和建筑装饰有限公司', admin: '徐生', account: '13074955421', location: '广东省/深圳市', scale: '0-20人', created: '2026-07-17 11:31:51', lastLogin: '2026-07-21 14:42:22', members: 1, tag: 'Connie介绍', payment: '试用客户', quota: 100, used: 13, startAt: '2026-07-01T00:00', endAt: '2027-06-30T23:59', version: '专业版', memberLimit: 10, coins: 0 },
  { id: 'HW675169', name: '广东燕麦家居有限公司', admin: '曾立府', account: '13875970888', location: '广东省/佛山市', scale: '20-99人', created: '2026-07-16 15:55:23', lastLogin: '2026-08-04 16:09:43', members: 1, tag: '北京物料房沙龙', payment: '试用客户', quota: 120, used: 31, startAt: '2026-07-01T00:00', endAt: '2027-06-30T23:59', version: '专业版', memberLimit: 10, coins: 0 },
  { id: 'TS847205', name: '秦斯汀智能家居有限公司', admin: '付文翔', account: '13699109131', location: '河北省/衡水市', scale: '100-499人', created: '2026-07-15 15:29:19', lastLogin: '2026-08-17 17:43:40', members: 1, tag: '2026年618活动', payment: '试用客户', quota: 160, used: 47, startAt: '2026-07-01T00:00', endAt: '2027-06-30T23:59', version: '专业版', memberLimit: 10, coins: 0 },
  { id: 'XQ248239', name: '烟台三平二设计有限公司', admin: '夏文杰', account: '18562162101', location: '山东省/烟台市', scale: '0-20人', created: '2026-07-15 15:27:40', lastLogin: '2026-07-17 09:28:27', members: 1, tag: '2026年618活动', payment: '试用客户', quota: 80, used: 22, startAt: '2026-07-01T00:00', endAt: '2027-06-30T23:59', version: '专业版', memberLimit: 10, coins: 0 },
];

function v3SeedAiRights(org, index) {
  if (Array.isArray(org.aiRights)) return;
  org.aiRights = [{
    id: `AIR-${org.id}-${index + 1}`,
    quota: Number(org.quota) || 0,
    used: Number(org.used) || 0,
    startAt: org.startAt,
    endAt: org.endAt,
    operator: '高志远',
    createdAt: '2026-09-01 09:00',
  }];
}

[...V3_INSTITUTIONS, ...V3_ZHAO_ORGS].forEach(v3SeedAiRights);

function v3AiRightStatus(right, now = Date.now()) {
  if (right.used >= right.quota) return '已用完';
  if (new Date(right.endAt).getTime() < now) return '已到期';
  if (new Date(right.startAt).getTime() > now) return '待生效';
  return '生效中';
}

function v3AiRightTotals(org) {
  const rights = org.aiRights || [];
  return rights.reduce((total, right) => {
    total.quota += Number(right.quota) || 0;
    total.used += Number(right.used) || 0;
    return total;
  }, { quota: 0, used: 0, remaining: 0 });
}

function v3SyncAiRightTotals(org) {
  const totals = v3AiRightTotals(org);
  totals.remaining = Math.max(0, totals.quota - totals.used);
  org.quota = totals.quota;
  org.used = totals.used;
  return totals;
}

function v3ConsumeAiRight(org) {
  const now = Date.now();
  const right = (org.aiRights || []).filter(item => v3AiRightStatus(item, now) === '生效中')
    .sort((a, b) => new Date(a.endAt) - new Date(b.endAt))[0];
  if (!right) return false;
  right.used += 1;
  v3SyncAiRightTotals(org);
  return true;
}

const V3_CALL_LOGS = [
  {
    id: 'AI202609010012', institution: '空间改造设计机构', operator: '高志远', type: '生成效果图',
    time: '2026-09-01 09:41', generatedAt: '2026-09-01 09:43', status: '成功', counted: true,
    mainImage: 'prototype_assets/floorplan-98.png', mainLabel: '花香壹号 98㎡',
    resultImage: 'prototype_assets/room-original.jpg', resultLabel: '最终效果图',
    floorBox: { x: 6, y: 48, w: 31, h: 43 },
    inputs: [
      { label: '户型图与框选范围', image: 'prototype_assets/floorplan-98.png', floorBox: { x: 6, y: 48, w: 31, h: 43 } },
      { label: '风格参考图', image: 'prototype_assets/style-2.jpg' },
      { label: '最终效果图', image: 'prototype_assets/room-original.jpg' },
    ],
  },
  {
    id: 'AI202609010011', institution: '空间改造设计机构', operator: '陈晓', type: '材质替换',
    time: '2026-09-01 09:26', generatedAt: '2026-09-01 09:27', status: '成功', counted: true,
    mainImage: 'prototype_assets/room-alt.jpg', mainLabel: '原木餐厅',
    resultImage: 'prototype_assets/room-replaced.jpg', resultLabel: '最终替换效果图',
    points: [
      { x: 28, y: 62, material: { name: MATERIAL_CATALOG[2].name, category: MATERIAL_CATALOG[2].categoryName, source: '天工云仓', image: MATERIAL_CATALOG[2].image } },
      { x: 62, y: 72, material: { name: MATERIAL_CATALOG[4].name, category: MATERIAL_CATALOG[4].categoryName, source: '天工云仓', image: MATERIAL_CATALOG[4].image } },
    ],
    inputs: [
      { label: '带点原图', image: 'prototype_assets/room-alt.jpg' },
      { label: '最终替换效果图', image: 'prototype_assets/room-replaced.jpg' },
    ],
  },
  {
    id: 'AI202608310086', institution: '成都近相室内设计有限公司', operator: '李彬', type: '生成效果图',
    time: '2026-08-31 17:52', generatedAt: '', status: '失败', counted: false,
    failureReason: '图片生成服务响应超时，本次任务未生成效果图，请稍后重试。',
    mainImage: 'prototype_assets/floorplan-135.png', mainLabel: '滨江四居 135㎡',
    floorBox: { x: 52, y: 12, w: 35, h: 37 },
    inputs: [
      { label: '户型图与框选范围', image: 'prototype_assets/floorplan-135.png', floorBox: { x: 52, y: 12, w: 35, h: 37 } },
      { label: '风格参考图', image: 'prototype_assets/style-4.jpg' },
    ],
  },
];

Object.assign(S, {
  page: 'home',
  route: '',
  flowModal: '',
  floorImage: '',
  floorName: '',
  floorBox: null,
  floorDraftImage: V3_FLOORS[0].image,
  floorDraftName: V3_FLOORS[0].name,
  floorDraftBox: null,
  floorDraftZoom: 1,
  floorDraftIndex: 0,
  styleImage: '',
  styleName: '',
  styleDraftImage: V3_STYLES[0].image,
  styleDraftName: V3_STYLES[0].name,
  styleDraftIndex: 0,
  effectSelection: null,
  replacementResult: '',
  materialCandidates: [],
  materialMenuOpen: false,
  materialSourceModal: '',
  materialSearch: '',
  activeMaterialId: null,
  marks: [],
  active: null,
  generationStartedAt: '',
  replacementStartedAt: '',
  compare: 50,
  adminSection: 'floor',
  v3AdminModal: null,
  v3AdminForm: null,
  v3CallDetail: null,
  v3Institution: null,
  v3InstitutionTab: 'ai',
  adminQuery: '',
  adminStatus: 'all',
  zcQuery: '',
  zcRightsIndex: null,
  zcRightsTab: 'base',
  zcAiFormOpen: false,
  zcAiDraft: null,
  zcRightsDraft: null,
});

function v3Esc(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function v3Now() {
  const d = new Date();
  const p = value => String(value).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function v3Head(title, backTarget = '') {
  const backAction = backTarget ? `S.page='${backTarget}';render()` : 'back()';
  return `<div class="v3-head">
    <button class="v3-back" aria-label="返回" onclick="${backAction}">←</button>
    <div class="v3-head-copy"><small>AI 空间选材</small><h1>${title}</h1></div>
  </div>`;
}

function v3Shell(title, content, backTarget = '', extra = '') {
  return appTop() + `<main class="main"><section class="v3-shell">${v3Head(title, backTarget)}<div class="v3-content">${content}</div>${extra}</section></main>`;
}

function v3FloorBox(box, className = '') {
  if (!box) return '';
  const editable = String(className).split(/\s+/).includes('editable');
  const handles = editable
    ? ['nw', 'ne', 'se', 'sw'].map(direction => `<i data-v3-resize="${direction}" aria-label="调整框选范围" onpointerdown="v3ResizeFloorBox(event,'${direction}')" ontouchstart="event.stopPropagation()" ontouchmove="event.stopPropagation()" ontouchend="event.stopPropagation()"></i>`).join('')
    : '<i></i><i></i><i></i><i></i>';
  return `<span class="v3-crop-box ${className}" data-floor-x="${box.x}" data-floor-y="${box.y}" data-floor-w="${box.w}" data-floor-h="${box.h}" style="left:${box.x}%;top:${box.y}%;width:${box.w}%;height:${box.h}%">${handles}</span>`;
}

function source() {
  return v3Shell('选择功能', `<div class="v3-entry-grid v3-entry-grid-compact">
    <button class="v3-entry-card v3-entry-card-compact generate" onclick="startRoute('floor')">
      <span class="v3-entry-symbol" aria-hidden="true"><span class="v3-plan-icon"><i class="wall-v"></i><i class="wall-h"></i><i class="wall-short-v"></i><i class="wall-short-h"></i></span></span>
      <span class="v3-entry-copy"><h2>生成效果图</h2><p>选择户型图和风格</p></span><span class="v3-entry-arrow">→</span>
    </button>
    <button class="v3-entry-card v3-entry-card-compact replace" onclick="startRoute('effect')">
      <span class="v3-entry-symbol" aria-hidden="true"><span class="v3-swatch-icon"><i></i><i></i><i></i></span></span>
      <span class="v3-entry-copy"><h2>材质替换</h2><p>选择效果图并替换材料</p></span><span class="v3-entry-arrow">→</span>
    </button>
  </div>`, 'home');
}

function startRoute(route) {
  clearTimeout(S.loadingTimer);
  clearTimeout(S.rfidTimer);
  S.route = route;
  S.flowModal = '';
  S.materialMenuOpen = false;
  S.materialSourceModal = '';
  S.materialCandidates = [];
  S.activeMaterialId = null;
  S.marks = [];
  S.active = null;
  S.page = route === 'floor' ? 'generateSetup' : 'effectSelect';
  render();
}

function generateSetupScreen() {
  const floor = S.floorImage
    ? `<div class="v3-choice-preview"><div class="v3-floor-audit" style="width:100%;height:100%"><img src="${S.floorImage}" alt="${v3Esc(S.floorName || '户型图')}">${v3FloorBox(S.floorBox)}</div>${S.floorName ? `<span class="v3-choice-name">${v3Esc(S.floorName)}</span>` : ''}</div>`
    : `<div class="v3-choice-preview"><button class="v3-empty-choice" onclick="openGeneratePicker('floor')"><span><b>选择户型图</b>＋</span></button></div>`;
  const style = S.styleImage
    ? `<div class="v3-choice-preview style"><img src="${S.styleImage}" alt="${v3Esc(S.styleName || '风格参考图')}">${S.styleName ? `<span class="v3-choice-name">${v3Esc(S.styleName)}</span>` : ''}</div>`
    : `<div class="v3-choice-preview"><button class="v3-empty-choice" onclick="openGeneratePicker('style')"><span><b>选择风格参考图</b>＋</span></button></div>`;
  const body = `<div class="v3-setup">
    <section class="v3-choice-panel"><header class="v3-panel-head"><h2>户型图</h2><button class="v3-btn" onclick="openGeneratePicker('floor')">${S.floorImage ? '更换' : '选择'}</button></header>${floor}</section>
    <section class="v3-choice-panel"><header class="v3-panel-head"><h2>风格参考图</h2><button class="v3-btn" onclick="openGeneratePicker('style')">${S.styleImage ? '更换' : '选择'}</button></header>${style}</section>
    <div class="v3-setup-action"><button class="v3-btn primary" ${S.floorImage && S.styleImage ? '' : 'disabled'} onclick="generateBase()">生成效果图</button></div>
  </div>`;
  return v3Shell('生成效果图', body, 'source', S.flowModal ? generatePickerDialog() : '');
}

function openGeneratePicker(kind) {
  S.flowModal = kind;
  if (kind === 'floor') {
    S.floorDraftImage = S.floorImage || V3_FLOORS[0].image;
    S.floorDraftName = S.floorName || V3_FLOORS[0].name;
    S.floorDraftBox = S.floorBox ? { ...S.floorBox } : { x: 8, y: 50, w: 30, h: 40 };
    S.floorDraftIndex = Math.max(0, V3_FLOORS.findIndex(item => item.image === S.floorDraftImage));
  } else {
    S.styleDraftImage = S.styleImage || V3_STYLES[0].image;
    S.styleDraftName = S.styleName || V3_STYLES[0].name;
    S.styleDraftIndex = Math.max(0, V3_STYLES.findIndex(item => item.image === S.styleDraftImage));
  }
  render();
}

function closeGeneratePicker() {
  S.flowModal = '';
  render();
}

function pickV3Floor(index) {
  const item = V3_FLOORS[index];
  if (!item) return;
  S.floorDraftIndex = index;
  S.floorDraftImage = item.image;
  S.floorDraftName = item.name;
  S.floorDraftBox = { x: 8, y: 50, w: 30, h: 40 };
  render();
}

function pickV3Style(index) {
  const item = V3_STYLES[index];
  if (!item) return;
  S.styleDraftIndex = index;
  S.styleDraftImage = item.image;
  S.styleDraftName = item.name;
  render();
}

function v3GenerateFileChosen(event, kind) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (!/^image\/(png|jpeg)$/.test(file.type) || file.size > 10 * 1024 * 1024) {
    toast('请选择 10 MB 以内的 JPG 或 PNG');
    return;
  }
  const url = URL.createObjectURL(file);
  const name = file.name.replace(/\.[^.]+$/, '');
  if (kind === 'floor') {
    S.floorDraftIndex = -1;
    S.floorDraftImage = url;
    S.floorDraftName = name;
    S.floorDraftBox = { x: 10, y: 10, w: 45, h: 45 };
  } else {
    S.styleDraftIndex = -1;
    S.styleDraftImage = url;
    S.styleDraftName = name;
  }
  render();
}

function confirmGeneratePicker() {
  if (S.flowModal === 'floor') {
    S.floorImage = S.floorDraftImage;
    S.floorName = S.floorDraftName;
    S.floorBox = { ...S.floorDraftBox };
  } else {
    S.styleImage = S.styleDraftImage;
    S.styleName = S.styleDraftName;
  }
  S.flowModal = '';
  render();
}

function v3FloorPointer(event) {
  if (event.button !== undefined && event.button !== 0) return;
  const canvas = event.currentTarget;
  const rect = canvas.getBoundingClientRect();
  const point = e => ({
    x: Math.max(0, Math.min(100, (e.clientX - rect.left) / rect.width * 100)),
    y: Math.max(0, Math.min(100, (e.clientY - rect.top) / rect.height * 100)),
  });
  const start = point(event);
  S.floorDraftBox = { x: start.x, y: start.y, w: .1, h: .1 };
  const move = e => {
    const current = point(e);
    const x = Math.min(start.x, current.x);
    const y = Math.min(start.y, current.y);
    S.floorDraftBox = { x, y, w: Math.abs(current.x - start.x), h: Math.abs(current.y - start.y) };
    const box = canvas.querySelector('.v3-crop-box');
    if (box) Object.assign(box.style, { left: `${x}%`, top: `${y}%`, width: `${S.floorDraftBox.w}%`, height: `${S.floorDraftBox.h}%` });
  };
  const up = () => {
    removeEventListener('pointermove', move);
    removeEventListener('pointerup', up);
    if (S.floorDraftBox.w < 6 || S.floorDraftBox.h < 6) S.floorDraftBox = { x: 8, y: 50, w: 30, h: 40 };
    render();
  };
  addEventListener('pointermove', move);
  addEventListener('pointerup', up);
}

function resetFloorBox() {
  S.floorDraftBox = { x: 8, y: 50, w: 30, h: 40 };
  render();
}

function generatePickerDialog() {
  if (S.flowModal === 'floor') {
    return `<div class="v3-mask"><section class="v3-dialog" role="dialog" aria-modal="true" aria-label="选择户型图">
      <header class="v3-dialog-head"><div><h2>选择户型图</h2><p>拖动画框</p></div><button class="v3-icon-btn" aria-label="关闭" onclick="closeGeneratePicker()">×</button></header>
      <div class="v3-dialog-body"><div class="v3-floor-picker">
        <aside class="v3-picker-list"><div class="v3-picker-list-head"><b>预设户型</b><span class="v3-count">${V3_FLOORS.length}</span></div><div class="v3-mini-grid">
          ${V3_FLOORS.map((item, index) => `<button class="v3-mini-card ${S.floorDraftIndex === index ? 'on' : ''}" onclick="pickV3Floor(${index})"><img src="${item.image}" alt="${v3Esc(item.name)}"><span>${v3Esc(item.name)}</span></button>`).join('')}
          <label class="v3-upload-mini"><span>＋<br>本地上传</span><input type="file" accept="image/png,image/jpeg" onchange="v3GenerateFileChosen(event,'floor')"></label>
        </div></aside>
        <div class="v3-crop-side"><div class="v3-crop-title"><span>${v3Esc(S.floorDraftName)}</span></div><div class="v3-crop-canvas" onpointerdown="v3FloorPointer(event)"><img src="${S.floorDraftImage}" alt="${v3Esc(S.floorDraftName)}">${v3FloorBox(S.floorDraftBox)}</div><div class="v3-crop-actions"><span>框选需要识别的空间</span><button class="v3-btn ghost" onclick="resetFloorBox()">重画</button></div></div>
      </div></div>
      <footer class="v3-dialog-foot"><button class="v3-btn" onclick="closeGeneratePicker()">取消</button><button class="v3-btn primary" onclick="confirmGeneratePicker()">确定</button></footer>
    </section></div>`;
  }
  return `<div class="v3-mask"><section class="v3-dialog compact" role="dialog" aria-modal="true" aria-label="选择风格参考图">
    <header class="v3-dialog-head"><div><h2>选择风格参考图</h2></div><button class="v3-icon-btn" aria-label="关闭" onclick="closeGeneratePicker()">×</button></header>
    <div class="v3-dialog-body"><div class="v3-style-picker-grid">
      ${V3_STYLES.map((item, index) => `<button class="v3-style-pick ${S.styleDraftIndex === index ? 'on' : ''}" onclick="pickV3Style(${index})"><img src="${item.image}" alt="${v3Esc(item.name)}"><b>${v3Esc(item.name)}</b></button>`).join('')}
      <label class="v3-upload-card"><span><strong>＋ 本地上传</strong>JPG / PNG</span><input type="file" accept="image/png,image/jpeg" onchange="v3GenerateFileChosen(event,'style')"></label>
    </div></div>
    <footer class="v3-dialog-foot"><button class="v3-btn" onclick="closeGeneratePicker()">取消</button><button class="v3-btn primary" onclick="confirmGeneratePicker()">确定</button></footer>
  </section></div>`;
}

function generateBase() {
  if (!S.floorImage || !S.styleImage) return;
  S.generationStartedAt = v3Now();
  S.page = 'loadingBase';
  render();
  clearTimeout(S.loadingTimer);
  S.loadingTimer = setTimeout(finishBaseGeneration, 1100);
}

function finishBaseGeneration() {
  const generatedAt = v3Now();
  const time = S.generationStartedAt || generatedAt;
  S.baseResult = V3_USER_ASSETS.effectBefore;
  const historyName = [S.floorName, S.styleName].filter(Boolean).join(' · ') || '生成效果图';
  const history = { id: `history-${Date.now()}`, name: historyName, image: S.baseResult, time: generatedAt, operator: '高志远' };
  V3_EFFECT_HISTORY.unshift(history);
  v3PersistEffectHistory();
  V3_CALL_LOGS.unshift({
    id: `AI${Date.now()}`,
    institution: '空间改造设计机构', operator: '高志远', type: '生成效果图', time, generatedAt, status: '成功', counted: true,
    mainImage: S.floorImage, mainLabel: S.floorName, floorBox: { ...S.floorBox },
    resultImage: S.baseResult, resultLabel: '最终效果图',
    inputs: [
      { label: '户型图与框选范围', image: S.floorImage, floorBox: { ...S.floorBox } },
      { label: '风格参考图', image: S.styleImage },
      { label: '最终效果图', image: S.baseResult },
    ],
  });
  S.generationStartedAt = '';
  v3ConsumeAiRight(V3_INSTITUTIONS[0]);
  v3ConsumeAiRight(V3_ZHAO_ORGS[0]);
  S.page = 'generatePreview';
  render();
}

function loading(type) {
  const title = type === 'base' ? '正在生成' : '正在替换';
  return v3Shell(title, `<div class="loading"><div class="loadinner"><div class="spinner"></div><h2>${title}</h2><div class="progressbar"><span></span></div></div></div>`, type === 'base' ? 'generateSetup' : 'mark');
}

function generatePreviewScreen() {
  const floorMeta = S.floorName ? `<b>${v3Esc(S.floorName)}</b>` : '';
  const styleMeta = S.styleName ? `<span>风格：${v3Esc(S.styleName)}</span>` : '';
  const meta = floorMeta || styleMeta ? `<div class="v3-preview-meta">${floorMeta}${styleMeta}</div>` : '';
  const body = `<div class="v3-preview-layout refined">
    <button class="v3-generated v3-image-zoom" aria-label="查看效果图大图" onclick="openV3PreviewImage('effect')" style="--v3-preview-image:url('${v3Esc(S.baseResult)}')"><img src="${S.baseResult}" alt="生成的效果图"><span class="v3-zoom-hint">查看大图</span></button>
    <aside class="v3-preview-side"><div class="v3-preview-side-title"><h2>框选范围</h2><span>生成时使用的户型区域</span></div><button class="v3-floor-audit v3-image-zoom" aria-label="查看户型图大图" onclick="openV3PreviewImage('floor')"><img src="${S.floorImage}" alt="${v3Esc(S.floorName || '户型图')}">${v3FloorBox(S.floorBox)}<span class="v3-zoom-hint">查看大图</span></button>${meta}<div class="v3-preview-actions"><button class="v3-btn primary" onclick="startMaterialFromGenerated()">材质替换</button><button class="v3-btn" onclick="goHome()">完成并返回首页</button></div></aside>
  </div>`;
  return v3Shell('效果图预览', body, 'generateSetup', S.previewImageKind ? v3PreviewImageDialog() : '');
}

function openV3PreviewImage(kind) {
  if (!['effect', 'floor'].includes(kind)) return;
  S.previewImageKind = kind;
  render();
}

function closeV3PreviewImage() {
  S.previewImageKind = '';
  render();
}

function v3PreviewImageDialog() {
  const isFloor = S.previewImageKind === 'floor';
  const title = isFloor ? '户型图' : '效果图';
  const media = isFloor
    ? `<div class="v3-image-viewer-floor v3-floor-audit"><img src="${S.floorImage}" alt="${v3Esc(S.floorName || '户型图')}">${v3FloorBox(S.floorBox)}</div>`
    : `<img class="v3-image-viewer-effect" src="${S.baseResult}" alt="生成的效果图">`;
  return `<div class="v3-mask v3-image-viewer-mask" onclick="closeV3PreviewImage()"><section class="v3-image-viewer" role="dialog" aria-modal="true" aria-label="${title}大图" onclick="event.stopPropagation()"><header><h2>${title}</h2><button class="v3-icon-btn" aria-label="关闭" onclick="closeV3PreviewImage()">×</button></header><div class="v3-image-viewer-stage">${media}</div></section></div>`;
}

function startMaterialFromGenerated() {
  S.inputImage = S.baseResult;
  S.inputName = '生成效果图';
  S.effectSelection = { id: `generated-${Date.now()}`, name: '生成效果图', image: S.baseResult, source: '生成记录' };
  S.materialCandidates = [];
  S.activeMaterialId = null;
  S.marks = [];
  S.active = null;
  S.page = 'mark';
  render();
}

function effectSelectScreen() {
  const selectionId = S.effectSelection && S.effectSelection.id;
  const presetCards = V3_EFFECT_PRESETS.map((item, index) => `<button class="v3-effect-card ${selectionId === `preset-${index}` ? 'on' : ''}" onclick="selectV3Effect('preset',${index})"><img src="${item.image}" alt="${v3Esc(item.name)}"><b>${v3Esc(item.name)}</b><small>预设效果图</small></button>`).join('');
  const historyCards = V3_EFFECT_HISTORY.map((item, index) => `<button class="v3-effect-card ${selectionId === item.id ? 'on' : ''}" onclick="selectV3Effect('history',${index})"><img src="${item.image}" alt="${v3Esc(item.name)}"><b>${v3Esc(item.name)}</b><small>${item.time}</small></button>`).join('');
  const body = `<div class="v3-effect-page">
    <section class="v3-effect-section"><header class="v3-section-title"><h2>预设效果图</h2><span>${V3_EFFECT_PRESETS.length} 张</span><label class="v3-btn" style="display:grid;place-items:center">本地上传<input hidden type="file" accept="image/png,image/jpeg" onchange="v3EffectFileChosen(event)"></label></header><div class="v3-effect-grid">${presetCards}</div></section>
    <section class="v3-effect-section history"><header class="v3-section-title"><h2>历史记录</h2><span>${V3_EFFECT_HISTORY.length} 张</span></header><div class="v3-effect-grid">${historyCards}</div></section>
    <div class="v3-effect-action"><button class="v3-btn primary" ${S.effectSelection ? '' : 'disabled'} onclick="confirmEffectSource()">下一步</button></div>
  </div>`;
  return v3Shell('选择效果图', body, 'source');
}

function selectV3Effect(group, index) {
  const item = group === 'preset' ? V3_EFFECT_PRESETS[index] : V3_EFFECT_HISTORY[index];
  if (!item) return;
  S.effectSelection = { ...item, id: group === 'preset' ? `preset-${index}` : item.id, source: group === 'preset' ? '管端预设' : '历史记录' };
  render();
}

function v3EffectFileChosen(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (!/^image\/(png|jpeg)$/.test(file.type) || file.size > 10 * 1024 * 1024) {
    toast('请选择 10 MB 以内的 JPG 或 PNG');
    return;
  }
  S.effectSelection = { id: `upload-${Date.now()}`, name: '', image: URL.createObjectURL(file), source: '本地上传' };
  render();
}

function confirmEffectSource() {
  if (!S.effectSelection) return;
  S.inputImage = S.effectSelection.image;
  S.inputName = S.effectSelection.name;
  S.materialCandidates = [];
  S.activeMaterialId = null;
  S.marks = [];
  S.page = 'mark';
  render();
}

function v3MaterialName(material) {
  return material.name || '';
}

function materialPrepareScreen() {
  const cards = S.materialCandidates.length
    ? S.materialCandidates.map(material => `<article class="v3-material-card">
        <img src="${material.image}" alt="${material.name ? v3Esc(material.name) : '本地物料图片'}">
        <button class="v3-material-remove" aria-label="删除" onclick="removeCandidateMaterial('${material.id}')">×</button>
        <div class="v3-material-card-body">${material.name ? `<b>${v3Esc(material.name)}</b>` : ''}<small>${material.source}</small></div>
      </article>`).join('')
    : `<div class="v3-material-empty"><span>点击“添加物料”</span></div>`;
  const body = `<div class="v3-material-layout">
    <aside class="v3-effect-summary"><img src="${S.inputImage}" alt="${v3Esc(S.inputName || '效果图')}"><b>${v3Esc(S.inputName || '效果图')}</b></aside>
    <section class="v3-material-panel">
      <div class="v3-material-toolbar"><h2>物料</h2><span class="v3-count">${S.materialCandidates.length}/5</span><div class="v3-add-wrap"><button class="v3-btn primary" ${S.materialCandidates.length >= 5 ? 'disabled' : ''} onclick="toggleMaterialMenu()">＋ 添加物料</button>${S.materialMenuOpen ? materialSourceMenu() : ''}</div></div>
      <div class="v3-material-grid">${cards}</div>
      <div class="v3-material-next"><button class="v3-btn primary" ${S.materialCandidates.length ? '' : 'disabled'} onclick="S.page='mark';S.activeMaterialId=null;render()">标记位置</button></div>
    </section>
  </div>`;
  return v3Shell('添加物料', body, 'effectSelect', S.materialSourceModal ? materialSourceDialog() : '');
}

function materialSourceMenu() {
  return `<div class="v3-source-menu">
    <button onclick="openMaterialSource('tiangong')">天工云仓物料库</button>
    <button onclick="openMaterialSource('zhaocai')">兆材云库</button>
    <button onclick="openMaterialSource('rfid')">RFID识别</button>
    <button onclick="openMaterialSource('local')">本地上传</button>
  </div>`;
}

function toggleMaterialMenu() {
  S.materialMenuOpen = !S.materialMenuOpen;
  render();
}

function openMaterialSource(source) {
  S.materialMenuOpen = false;
  S.materialSourceModal = source;
  S.materialSearch = '';
  S.materialCatalogCategory = source === 'zhaocai' ? '石材' : '装饰材料';
  if (source === 'rfid') {
    S.rfid = 'scanning';
    render();
    clearTimeout(S.rfidTimer);
    S.rfidTimer = setTimeout(finishV3RfidRecognition, 1000);
    return;
  }
  render();
}

function closeMaterialSource() {
  clearTimeout(S.rfidTimer);
  S.materialSourceModal = '';
  S.rfid = false;
  render();
}

function v3CatalogRows(source) {
  const start = source === 'zhaocai' ? 2 : 0;
  const rows = MATERIAL_CATALOG.slice(start, start + 8).map((item, index) => ({ ...item, catalogIndex: start + index }));
  const query = S.materialSearch.trim().toLowerCase();
  return rows.filter(item => !query || item.name.toLowerCase().includes(query) || String(item.brand || '').toLowerCase().includes(query));
}

function setV3CatalogCategory(category) {
  S.materialCatalogCategory = category;
  render();
}

function addCatalogMaterial(index, source) {
  const item = MATERIAL_CATALOG[index];
  if (!item) return;
  const id = `${source}-${index}`;
  const existingIndex = S.materialCandidates.findIndex(material => material.id === id);
  if (existingIndex >= 0) {
    S.materialCandidates.splice(existingIndex, 1);
    S.marks = S.marks.filter(mark => mark.materialId !== id);
    if (S.activeMaterialId === id) S.activeMaterialId = null;
    S.active = null;
    render();
    return;
  }
  S.materialCandidates.push({ id, name: item.name, category: item.categoryName || item.category || '', image: item.image, source: source === 'zhaocai' ? '兆材云库' : '天工云仓' });
  render();
}

function v3MaterialFileChosen(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  const valid = files.filter(file => /^image\/(png|jpeg)$/.test(file.type) && file.size <= 10 * 1024 * 1024);
  valid.forEach(file => S.materialCandidates.push({ id: `local-${Date.now()}-${Math.random()}`, name: '', category: '', image: URL.createObjectURL(file), source: '本地上传' }));
  S.materialSourceModal = '';
  render();
}

function finishV3RfidRecognition() {
  if (S.materialSourceModal !== 'rfid') return;
  const batch = [2, 4].map(index => ({
    id: `rfid-${index}`,
    name: MATERIAL_CATALOG[index].name,
    category: MATERIAL_CATALOG[index].categoryName || MATERIAL_CATALOG[index].category || '',
    image: MATERIAL_CATALOG[index].image,
    source: 'RFID',
  })).filter(item => !S.materialCandidates.some(existing => existing.id === item.id));
  S.materialCandidates.push(...batch);
  S.materialSourceModal = '';
  S.rfid = false;
  toast(`已添加${batch.length}个物料`);
}

function removeCandidateMaterial(id) {
  const mark = S.marks.find(item => item.materialId === id);
  if (mark && !confirm('删除物料及对应标点？')) return;
  S.marks = S.marks.filter(item => item.materialId !== id);
  S.materialCandidates = S.materialCandidates.filter(item => item.id !== id);
  if (S.activeMaterialId === id) S.activeMaterialId = null;
  render();
}

function materialSourceDialog() {
  const source = S.materialSourceModal;
  const title = source === 'tiangong' ? '天工云仓物料库' : source === 'zhaocai' ? '兆材云库' : source === 'local' ? '本地上传' : 'RFID识别';
  if (source === 'rfid') {
    return `<div class="v3-mask"><section class="v3-dialog compact" role="dialog" aria-modal="true" aria-label="RFID识别"><header class="v3-dialog-head"><h2>${title}</h2><button class="v3-icon-btn" aria-label="关闭" onclick="closeMaterialSource()">×</button></header><div class="v3-dialog-body"><div class="v3-rfid-state"><div><div class="v3-rfid-rings">⌁</div><h2>正在识别</h2></div></div></div></section></div>`;
  }
  if (source === 'local') {
    return `<div class="v3-mask"><section class="v3-dialog compact" role="dialog" aria-modal="true" aria-label="本地上传"><header class="v3-dialog-head"><h2>${title}</h2><button class="v3-icon-btn" aria-label="关闭" onclick="closeMaterialSource()">×</button></header><div class="v3-dialog-body"><label class="v3-local-drop v3-unified-upload"><span class="v3-upload-copy"><strong>＋</strong>本地上传</span><input type="file" multiple accept="image/png,image/jpeg" onchange="v3MaterialFileChosen(event)"></label></div></section></div>`;
  }
  const rows = v3CatalogRows(source);
  const categories = V3_CATALOG_CATEGORIES[source];
  const themeClass = source === 'zhaocai' ? 'zhaocai-library' : 'tiangong-library';
  const brand = source === 'tiangong'
    ? `<div class="v3-library-brand"><img src="${IMG.logo}" alt="天工云仓"><span>天工云仓</span></div>`
    : `<div class="v3-library-brand text"><span>兆材云库</span></div>`;
  const cards = rows.map(item => {
    const id = `${source}-${item.catalogIndex}`;
    const added = S.materialCandidates.some(material => material.id === id);
    return `<button class="v3-library-card ${added ? 'added' : ''}" onclick="addCatalogMaterial(${item.catalogIndex},'${source}')"><span class="v3-library-image"><img src="${item.image}" alt="${v3Esc(item.name)}">${added ? '<em>已添加</em>' : ''}</span><b>${v3Esc(item.name)}</b><small>${v3Esc(item.brand || '')}</small></button>`;
  }).join('');
  return `<div class="v3-mask"><section class="v3-library-dialog ${themeClass}" role="dialog" aria-modal="true" aria-label="${title}">
    <header class="v3-library-head">${brand}<h2>物料库 <span>/ MATERIAL WAREHOUSE</span></h2><button class="v3-library-close" aria-label="关闭" onclick="closeMaterialSource()">×</button></header>
    <div class="v3-library-search"><input aria-label="搜索物料" placeholder="请输入物料关键词" value="${v3Esc(S.materialSearch)}" oninput="S.materialSearch=this.value"><button aria-label="搜索" onclick="render()">⌕</button></div>
    <div class="v3-library-content"><div class="v3-library-grid">${cards || '<div class="v3-library-empty">没有找到相关物料</div>'}</div><aside class="v3-library-categories"><h3>${v3Esc(S.materialCatalogCategory || categories[0][0])}</h3>${categories.map(([name, color]) => `<button class="${S.materialCatalogCategory === name ? 'on' : ''}" onclick="setV3CatalogCategory('${name}')"><span>${name}</span><i style="background:${color}"></i></button>`).join('')}</aside></div>
    <footer class="v3-library-foot"><span>已添加 ${S.materialCandidates.length}</span><button onclick="closeMaterialSource()">完成</button></footer>
  </section></div>`;
}

function markerScreen() {
  const activeId = S.activeMaterialId;
  const cards = S.materialCandidates.map(material => {
    const markIndex = S.marks.findIndex(mark => mark.materialId === material.id);
    const bound = markIndex >= 0;
    return `<button class="v3-marker-material ${activeId === material.id ? 'on' : ''} ${bound ? 'bound' : ''}" onclick="selectMarkerMaterial('${material.id}')">
      <img src="${material.image}" alt="${material.name ? v3Esc(material.name) : '本地物料图片'}"><span>${material.name ? `<b>${v3Esc(material.name)}</b>` : ''}<small>${material.source}</small></span>
    </button>`;
  }).join('');
  const points = S.marks.map((mark, index) => `<button class="v3-point ${S.active === index ? 'on' : ''}" data-v3-mark="${index}" style="left:${mark.x}%;top:${mark.y}%" aria-label="标点 ${index + 1}" onpointerdown="dragV3Mark(event,${index})" onclick="selectV3Mark(event,${index})">${index + 1}</button>`).join('');
  const body = `<div class="v3-marker-layout"><div class="v3-marker-canvas" id="v3MarkerCanvas" onclick="addV3Mark(event)"><img src="${S.inputImage}" alt="待换材效果图">${points}</div><aside class="v3-marker-side"><h2>物料</h2><small>${S.marks.length}/3 个标点</small><div class="v3-marker-materials">${cards}</div><div class="v3-marker-actions"><button class="v3-btn danger" ${S.active === null ? 'disabled' : ''} onclick="deleteActiveV3Mark()">删除标点</button><button class="v3-btn" onclick="S.page='materialPrepare';render()">添加物料</button><button class="v3-btn primary" ${S.marks.length ? '' : 'disabled'} onclick="replaceMaterial()">生成替换效果</button></div></aside></div>`;
  return v3Shell('标记位置', body, 'materialPrepare');
}

function selectMarkerMaterial(id) {
  S.activeMaterialId = id;
  const index = S.marks.findIndex(mark => mark.materialId === id);
  S.active = index >= 0 ? index : null;
  render();
}

function v3CanvasPoint(event) {
  const canvas = document.getElementById('v3MarkerCanvas');
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.max(1, Math.min(99, (event.clientX - rect.left) / rect.width * 100)),
    y: Math.max(1, Math.min(99, (event.clientY - rect.top) / rect.height * 100)),
  };
}

function addV3Mark(event) {
  if (event.target.closest('[data-v3-mark]')) return;
  if (!S.activeMaterialId) {
    toast('先选择物料');
    return;
  }
  const point = v3CanvasPoint(event);
  if (!point) return;
  const existingIndex = S.marks.findIndex(mark => mark.materialId === S.activeMaterialId);
  if (existingIndex >= 0) {
    S.marks[existingIndex] = { ...S.marks[existingIndex], ...point };
    S.active = existingIndex;
    render();
    return;
  }
  if (S.marks.length >= 3) {
    toast('最多添加3个标点');
    return;
  }
  S.marks.push({ ...point, materialId: S.activeMaterialId });
  S.active = S.marks.length - 1;
  render();
}

function selectV3Mark(event, index) {
  event.stopPropagation();
  S.active = index;
  S.activeMaterialId = S.marks[index].materialId;
  render();
}

function dragV3Mark(event, index) {
  event.preventDefault();
  event.stopPropagation();
  S.active = index;
  S.activeMaterialId = S.marks[index].materialId;
  const move = current => {
    const point = v3CanvasPoint(current);
    if (!point) return;
    Object.assign(S.marks[index], point);
    const marker = document.querySelector(`[data-v3-mark="${index}"]`);
    if (marker) Object.assign(marker.style, { left: `${point.x}%`, top: `${point.y}%` });
  };
  const up = () => {
    removeEventListener('pointermove', move);
    removeEventListener('pointerup', up);
    render();
  };
  addEventListener('pointermove', move);
  addEventListener('pointerup', up);
}

function deleteActiveV3Mark() {
  if (S.active === null) return;
  S.marks.splice(S.active, 1);
  S.active = null;
  render();
}

function canGenerate() {
  return S.marks.length > 0;
}

function replaceMaterial() {
  if (!canGenerate()) return;
  S.replacementStartedAt = v3Now();
  S.page = 'loadingReplace';
  render();
  clearTimeout(S.loadingTimer);
  S.loadingTimer = setTimeout(finishV3Replacement, 1100);
}

function v3SameImageAsset(left, right) {
  const normalize = value => String(value || '').split('#')[0].split('?')[0].replace(/\\/g, '/');
  const leftPath = normalize(left);
  const rightPath = normalize(right);
  return leftPath === rightPath || leftPath.endsWith(`/${rightPath}`) || rightPath.endsWith(`/${leftPath}`);
}

function v3ResolveReplacementResult(inputImage) {
  return v3SameImageAsset(inputImage, V3_USER_ASSETS.effectAfter)
    ? V3_USER_ASSETS.effectBefore
    : V3_USER_ASSETS.effectAfter;
}

function finishV3Replacement() {
  const used = S.marks.map(mark => S.materialCandidates.find(material => material.id === mark.materialId)).filter(Boolean);
  const generatedAt = v3Now();
  const time = S.replacementStartedAt || generatedAt;
  S.replacementResult = v3ResolveReplacementResult(S.inputImage);
  const historyName = `${S.inputName || '效果图'} · 材质替换`;
  V3_EFFECT_HISTORY.unshift({ id: `replacement-${Date.now()}`, name: historyName, image: S.replacementResult, time: generatedAt, operator: '高志远', type: '材质替换' });
  v3PersistEffectHistory();
  const points = S.marks.map(mark => {
    const material = S.materialCandidates.find(item => item.id === mark.materialId);
    return { x: mark.x, y: mark.y, material: material ? { ...material } : null };
  }).filter(point => point.material);
  V3_CALL_LOGS.unshift({
    id: `AI${Date.now()}`,
    institution: '空间改造设计机构', operator: '高志远', type: '材质替换', time, generatedAt, status: '成功', counted: true,
    mainImage: S.inputImage, mainLabel: S.inputName || '效果图',
    resultImage: S.replacementResult, resultLabel: '最终替换效果图', points,
    inputs: [{ label: '带点原图', image: S.inputImage }, { label: '最终替换效果图', image: S.replacementResult }],
  });
  S.replacementStartedAt = '';
  v3ConsumeAiRight(V3_INSTITUTIONS[0]);
  v3ConsumeAiRight(V3_ZHAO_ORGS[0]);
  S.page = 'compare';
  render();
}

function v3CompareMaterial(material, isUsed) {
  return `<article class="v3-marker-material v3-compare-material-card ${isUsed ? 'bound used' : 'unused'}">
    <span class="v3-marker-thumb"><img src="${material.image}" alt="${material.name ? v3Esc(material.name) : '本地物料图片'}"></span>
    <span class="v3-marker-material-copy">${material.name ? `<b>${v3Esc(material.name)}</b>` : ''}${material.category ? `<span>${v3Esc(material.category)}</span>` : ''}<small>${material.source ? v3Esc(material.source) : '本地上传'}</small></span>
    <span class="v3-marker-material-actions"><em>${isUsed ? '已使用' : '未使用'}</em></span>
  </article>`;
}

function compareScreen() {
  const usedIds = new Set(S.marks.map(mark => mark.materialId));
  const used = S.materialCandidates.filter(material => usedIds.has(material.id));
  const unused = S.materialCandidates.filter(material => !usedIds.has(material.id));
  const value = Math.max(0, Math.min(100, Number(S.compare) || 50));
  const afterImage = S.replacementResult && !v3SameImageAsset(S.replacementResult, S.inputImage)
    ? S.replacementResult
    : v3ResolveReplacementResult(S.inputImage);
  const materialRows = `${used.map(material => v3CompareMaterial(material, true)).join('')}${unused.map(material => v3CompareMaterial(material, false)).join('')}`;
  const body = `<div class="v3-compare"><div class="v3-compare-main" id="v3Compare"><img src="${afterImage}" alt="替换后效果图"><img class="v3-before-img" src="${S.inputImage}" alt="替换前效果图" style="clip-path:inset(0 ${100 - value}% 0 0)"><div class="v3-compare-labels"><span>替换前</span><span>替换后</span></div><input id="v3CompareRange" type="range" min="0" max="100" value="${value}" aria-label="查看替换前后" oninput="setCompare(this.value)"><div class="v3-compare-line" style="left:${value}%"><div class="v3-compare-knob">↔</div></div></div><aside class="v3-compare-side"><div class="v3-marker-side-top"><div><h2>物料</h2><small>${S.materialCandidates.length} 个物料</small></div></div><div class="v3-marker-materials v3-compare-materials unified">${materialRows}</div><div class="v3-compare-actions"><button class="v3-btn" onclick="continueAdjust()">继续调整</button><button class="v3-btn primary" onclick="goHome()">完成并返回首页</button></div></aside></div>`;
  return v3Shell('效果对比', body, 'mark');
}

function setCompare(value) {
  const next = Math.max(0, Math.min(100, Number(value)));
  S.compare = next;
  const image = document.querySelector('.v3-before-img');
  const line = document.querySelector('.v3-compare-line');
  if (image) image.style.clipPath = `inset(0 ${100 - next}% 0 0)`;
  if (line) line.style.left = `${next}%`;
}

function continueAdjust() {
  S.page = 'mark';
  render();
}

function v3AdminNav() {
  const item = (section, label) => `<button class="${S.adminSection === section ? 'on' : ''}" onclick="switchAdmin('${section}')">${label}</button>`;
  return `<aside class="v3-admin-nav"><img src="${IMG.logo}" alt="天工云仓"><h4>AI空间选材</h4>${item('floor','户型图配置')}${item('effect','效果图配置')}${item('style','风格参考图配置')}${item('calls','创作记录')}</aside>`;
}

function v3AdminFrame(title, content, modal = '') {
  return `<div class="v3-admin">${v3AdminNav()}<main class="v3-admin-main"><header class="v3-admin-top"><span>首页　/　<b>${title}</b></span><span><span class="avatar">高</span>　高志远</span></header><div class="v3-admin-body">${content}</div></main>${modal}</div>`;
}

function admin() {
  if (S.adminSection === 'calls') return v3CallLogScreen();
  const labels = { floor: '户型图配置', effect: '效果图配置', style: '风格参考图配置' };
  const rows = V3_ADMIN_ITEMS[S.adminSection]
    .map((item, index) => ({ ...item, index }))
    .filter(item => (!S.adminQuery || item.name.toLowerCase().includes(S.adminQuery.toLowerCase())) && (S.adminStatus === 'all' || item.status === S.adminStatus));
  const tableRows = rows.map((item, rowIndex) => `<tr><td>${rowIndex + 1}</td><td><img class="v3-table-thumb" src="${item.image}" alt="${v3Esc(item.name)}"></td><td><b>${v3Esc(item.name)}</b></td><td>${item.sort}</td><td><span class="v3-status ${item.status === '停用' ? 'fail' : ''}">${item.status}</span></td><td>${item.operator}<br><small>${item.updatedAt}</small></td><td><div class="v3-admin-actions"><button onclick="openAdminEdit(${item.index})">编辑</button><button onclick="toggleAdminStatus(${item.index})">${item.status === '启用' ? '停用' : '启用'}</button></div></td></tr>`).join('');
  const content = `<section class="v3-admin-card"><div class="v3-admin-title"><div><h1>${labels[S.adminSection]}</h1><p>每条配置对应一张图片</p></div><button class="v3-btn primary" onclick="openAdminModal()">＋ 新增</button></div><div class="v3-admin-filters"><input placeholder="搜索名称" value="${v3Esc(S.adminQuery)}" oninput="S.adminQuery=this.value"><select onchange="S.adminStatus=this.value;render()"><option value="all">全部状态</option><option ${S.adminStatus === '启用' ? 'selected' : ''}>启用</option><option ${S.adminStatus === '停用' ? 'selected' : ''}>停用</option></select><button class="v3-btn" onclick="render()">查询</button></div><div class="v3-table-wrap"><table class="v3-table"><thead><tr><th>序号</th><th>图片</th><th>名称</th><th>排序</th><th>状态</th><th>操作人 / 时间</th><th>操作</th></tr></thead><tbody>${tableRows || '<tr><td colspan="7">暂无记录</td></tr>'}</tbody></table></div></section>`;
  return v3AdminFrame(labels[S.adminSection], content, S.v3AdminModal ? v3AdminItemDialog() : '');
}

function switchAdmin(section) {
  S.adminSection = section;
  S.adminQuery = '';
  S.adminStatus = 'all';
  S.v3AdminModal = null;
  S.v3CallDetail = null;
  S.v3Institution = null;
  render();
}

function openAdminModal() {
  S.v3AdminModal = 'item';
  S.v3AdminForm = { name: '', image: '', sort: '1', status: '启用', editIndex: null };
  render();
}

function openAdminEdit(index) {
  const item = V3_ADMIN_ITEMS[S.adminSection][index];
  S.v3AdminModal = 'item';
  S.v3AdminForm = { ...item, sort: String(item.sort), editIndex: index };
  render();
}

function toggleAdminStatus(index) {
  const item = V3_ADMIN_ITEMS[S.adminSection][index];
  item.status = item.status === '启用' ? '停用' : '启用';
  item.operator = '高志远';
  item.updatedAt = v3Now();
  render();
}

function v3AdminFileChosen(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (!/^image\/(png|jpeg)$/.test(file.type) || file.size > 10 * 1024 * 1024) {
    toast('请选择 10 MB 以内的 JPG 或 PNG');
    return;
  }
  S.v3AdminForm.image = URL.createObjectURL(file);
  if (!S.v3AdminForm.name) S.v3AdminForm.name = file.name.replace(/\.[^.]+$/, '');
  render();
}

function saveV3AdminItem() {
  const form = S.v3AdminForm;
  const sort = Number(form.sort);
  if (!form.name.trim() || !form.image || !Number.isInteger(sort) || sort < 1) {
    toast('请填写名称、图片和排序');
    return;
  }
  const item = { name: form.name.trim(), image: form.image, sort, status: form.status || '启用', operator: '高志远', updatedAt: v3Now() };
  if (Number.isInteger(form.editIndex)) V3_ADMIN_ITEMS[S.adminSection][form.editIndex] = item;
  else V3_ADMIN_ITEMS[S.adminSection].push(item);
  S.v3AdminModal = null;
  render();
}

function v3AdminItemDialog() {
  const form = S.v3AdminForm;
  const editing = Number.isInteger(form.editIndex);
  return `<div class="v3-mask"><section class="v3-admin-dialog" role="dialog" aria-modal="true"><header class="v3-dialog-head"><h2>${editing ? '编辑' : '新增'}图片</h2><button class="v3-icon-btn" onclick="S.v3AdminModal=null;render()">×</button></header><div class="v3-dialog-body"><div class="v3-admin-form"><label>名称<input value="${v3Esc(form.name)}" oninput="S.v3AdminForm.name=this.value"></label><label>排序<input type="number" min="1" value="${form.sort}" oninput="S.v3AdminForm.sort=this.value"></label><label class="v3-admin-upload">${form.image ? `<img src="${form.image}" alt="${v3Esc(form.name)}">` : '<span>＋ 选择图片</span>'}<input type="file" accept="image/png,image/jpeg" onchange="v3AdminFileChosen(event)"></label></div></div><footer class="v3-dialog-foot"><button class="v3-btn" onclick="S.v3AdminModal=null;render()">取消</button><button class="v3-btn primary" onclick="saveV3AdminItem()">保存</button></footer></section></div>`;
}

function v3FloorThumb(log) {
  return `<div class="v3-table-floor"><img src="${log.mainImage}" alt="${v3Esc(log.mainLabel)}">${log.floorBox ? `<i style="left:${log.floorBox.x}%;top:${log.floorBox.y}%;width:${log.floorBox.w}%;height:${log.floorBox.h}%"></i>` : ''}</div>`;
}

function v3MarkedEffect(log, compact = false) {
  const points = (log.points || []).map((point, index) => `<i style="left:${point.x}%;top:${point.y}%">${index + 1}</i>`).join('');
  return `<div class="v3-marked-audit ${compact ? 'compact' : ''}"><img src="${log.mainImage}" alt="${v3Esc(log.mainLabel || '带点原图')}">${points}</div>`;
}

function v3CallImagesCell(log) {
  if (log.type !== '生成效果图') return `<div class="v3-call-table-single">${v3MarkedEffect(log, true)}<small>带点原图</small></div>`;
  const result = log.resultImage
    ? `<div class="v3-call-table-image"><img src="${log.resultImage}" alt="${v3Esc(log.resultLabel || '最终效果图')}"><small>效果图</small></div>`
    : `<div class="v3-call-table-image empty"><span>—</span><small>未生成</small></div>`;
  return `<div class="v3-call-table-pair"><div class="v3-call-table-image">${v3FloorThumb(log)}<small>户型图</small></div><b aria-hidden="true">→</b>${result}</div>`;
}

function v3CallLogScreen() {
  const query = String(S.adminQuery || '').trim();
  const rows = V3_CALL_LOGS.filter(log => !query || log.operator.includes(query) || log.type.includes(query) || log.time.includes(query) || (log.generatedAt || '').includes(query));
  const tableRows = rows.map((log, index) => `<tr><td>${index + 1}</td><td>${v3CallImagesCell(log)}</td><td><b>${log.type}</b></td><td>${log.operator}</td><td><span class="v3-call-time">${log.time}</span></td><td><span class="v3-call-time ${log.generatedAt ? '' : 'empty'}">${log.generatedAt || '未生成'}</span></td><td><span class="v3-status ${log.status === '失败' ? 'fail' : ''}">${log.status}</span></td><td><div class="v3-admin-actions"><button onclick="openV3CallDetail('${log.id}')">查看</button></div></td></tr>`).join('');
  const content = `<section class="v3-admin-card"><div class="v3-admin-title"><div><h1>创作记录</h1><p>查看创作图片</p></div></div><div class="v3-admin-filters"><input placeholder="搜索操作人或创作类型" value="${v3Esc(S.adminQuery)}" oninput="S.adminQuery=this.value"><button class="v3-btn" onclick="render()">查询</button></div><div class="v3-table-wrap"><table class="v3-table"><thead><tr><th>序号</th><th>相关图片</th><th>创作类型</th><th>操作人</th><th>创作时间</th><th>生成时间</th><th>状态</th><th>操作</th></tr></thead><tbody>${tableRows}</tbody></table></div></section>`;
  return v3AdminFrame('创作记录', content, S.v3CallDetail ? v3CallDetailDialog() : '');
}

function openV3CallDetail(id) {
  S.v3CallDetail = V3_CALL_LOGS.find(log => log.id === id) || null;
  render();
}

function v3CallDetailDialog() {
  const log = S.v3CallDetail;
  const failed = log.status === '失败';
  const statusClass = failed ? 'fail' : 'success';
  const inputItems = (log.inputs || []).filter(input => !input.label.startsWith('最终'));
  const inputCards = inputItems.map((input, index) => `<article class="v3-call-image"><div class="v3-call-image-title"><span>${String(index + 1).padStart(2, '0')}</span><b>${v3Esc(input.label)}</b></div>${input.floorBox ? `<div class="v3-floor-audit v3-call-floor-preview"><img src="${input.image}" alt="${v3Esc(input.label)}">${v3FloorBox(input.floorBox)}</div>` : `<img src="${input.image}" alt="${v3Esc(input.label)}">`}</article>`).join('');
  const generatedResult = failed
    ? `<div class="v3-call-result-empty fail"><span aria-hidden="true">!</span><div><b>未生成效果图</b><small>任务执行失败，未产生结果文件</small></div></div>`
    : `<figure class="v3-call-output-card"><img src="${log.resultImage}" alt="${v3Esc(log.resultLabel || '最终效果图')}"><figcaption>${v3Esc(log.resultLabel || '最终效果图')}</figcaption></figure>`;
  const generated = `<div class="v3-call-detail-stack"><section class="v3-call-detail-section"><div class="v3-call-section-title"><div><h3>输入内容</h3><p>本次创作使用的户型与风格参考</p></div><span>${inputItems.length} 项</span></div><div class="v3-call-images">${inputCards}</div></section><section class="v3-call-detail-section"><div class="v3-call-section-title"><div><h3>生成结果</h3><p>${failed ? '任务未成功完成' : '本次任务生成的最终图片'}</p></div></div>${generatedResult}</section></div>`;
  const material = `<section class="v3-call-detail-section"><div class="v3-call-section-title"><div><h3>创作内容</h3><p>查看原图、替换结果与标点物料</p></div></div><div class="v3-material-call-detail"><section><h3>带点原图</h3>${v3MarkedEffect(log)}</section><aside><div class="v3-call-result"><h3>最终替换效果图</h3><img src="${log.resultImage || log.mainImage}" alt="最终替换效果图"></div><div class="v3-point-material-list"><h3>标点物料</h3>${(log.points || []).map((point, index) => `<article><em>${index + 1}</em><img src="${point.material.image}" alt="${v3Esc(point.material.name || '本地物料图片')}"><span>${point.material.name ? `<b>${v3Esc(point.material.name)}</b>` : ''}${point.material.category ? `<small>${v3Esc(point.material.category)}</small>` : ''}<small>${v3Esc(point.material.source)}</small></span></article>`).join('')}</div></aside></div></section>`;
  const failure = failed ? `<div class="v3-call-failure" role="status" aria-atomic="true"><span aria-hidden="true">!</span><div><b>创作失败</b><p>${v3Esc(log.failureReason || '任务执行失败，本次未生成结果。')}</p></div></div>` : '';
  return `<div class="v3-mask"><section class="v3-admin-dialog v3-call-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="v3-call-detail-title"><header class="v3-call-detail-head"><div class="v3-call-detail-heading"><div><span class="v3-call-detail-eyebrow">创作记录详情</span><h2 id="v3-call-detail-title">${v3Esc(log.type)}</h2></div><span class="v3-detail-status ${statusClass}" role="status" aria-atomic="true">${v3Esc(log.status)}</span></div><button class="v3-icon-btn" aria-label="关闭创作记录详情" onclick="S.v3CallDetail=null;render()">×</button></header><div class="v3-dialog-body v3-call-detail-body"><div class="v3-call-meta"><div><span>记录编号</span><b>${v3Esc(log.id)}</b></div><div><span>操作人</span><b>${v3Esc(log.operator)}</b></div><div><span>创作时间</span><b>${v3Esc(log.time)}</b></div><div><span>生成时间</span><b class="${log.generatedAt ? '' : 'empty'}">${v3Esc(log.generatedAt || '未生成')}</b></div></div>${failure}${log.type === '材质替换' ? material : generated}</div><footer class="v3-dialog-foot v3-call-detail-foot"><button class="v3-btn" onclick="S.v3CallDetail=null;render()">关闭</button></footer></section></div>`;
}

function v3InstitutionScreen() {
  const rows = V3_INSTITUTIONS.map((item, index) => `<tr><td>${index + 1}</td><td><b>${item.name}</b><br><small>${item.id}</small></td><td>${item.admin}</td><td>${item.quota}</td><td>${item.used}</td><td><b>${Math.max(0, item.quota - item.used)}</b></td><td><div class="v3-admin-actions"><button onclick="openV3Institution(${index})">权益配置</button></div></td></tr>`).join('');
  const content = `<section class="v3-admin-card"><div class="v3-admin-title"><div><h1>机构列表</h1><p>配置机构权益</p></div></div><div class="v3-admin-filters"><input placeholder="搜索机构名称或编号"></div><div class="v3-table-wrap"><table class="v3-table"><thead><tr><th>序号</th><th>机构</th><th>管理员</th><th>AI总次数</th><th>已使用</th><th>剩余</th><th>操作</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
  return v3AdminFrame('机构列表', content, S.v3Institution !== null ? v3InstitutionDialog() : '');
}

function openV3Institution(index) {
  S.v3Institution = index;
  S.v3InstitutionTab = 'ai';
  S.v3QuotaDraft = String(V3_INSTITUTIONS[index].quota);
  S.v3StartDraft = V3_INSTITUTIONS[index].startAt || '';
  S.v3EndDraft = V3_INSTITUTIONS[index].endAt || '';
  render();
}

function saveV3Quota() {
  const institution = V3_INSTITUTIONS[S.v3Institution];
  const quota = Number(S.v3QuotaDraft);
  if (!Number.isInteger(quota) || quota < institution.used) {
    toast(`总次数不能少于${institution.used}`);
    return;
  }
  if (!S.v3StartDraft || !S.v3EndDraft) {
    toast('请选择有效期');
    return;
  }
  if (new Date(S.v3EndDraft).getTime() <= new Date(S.v3StartDraft).getTime()) {
    toast('结束时间需晚于开始时间');
    return;
  }
  institution.quota = quota;
  institution.startAt = S.v3StartDraft;
  institution.endAt = S.v3EndDraft;
  S.v3Institution = null;
  render();
}

function v3InstitutionDialog() {
  const institution = V3_INSTITUTIONS[S.v3Institution];
  const remaining = Math.max(0, Number(S.v3QuotaDraft || institution.quota) - institution.used);
  return `<div class="v3-mask"><section class="v3-admin-dialog" role="dialog" aria-modal="true"><header class="v3-dialog-head"><div><h2>权益配置</h2><p>${institution.name}</p></div><button class="v3-icon-btn" onclick="S.v3Institution=null;render()">×</button></header><div class="v3-dialog-body"><div class="v3-tabs"><button onclick="S.v3InstitutionTab='base';render()">相关权益</button><button class="${S.v3InstitutionTab === 'ai' ? 'on' : ''}" onclick="S.v3InstitutionTab='ai';render()">AI权益</button></div>${S.v3InstitutionTab === 'ai' ? `<div class="v3-quota-grid"><div class="v3-quota-card"><span>AI总次数</span><b>${S.v3QuotaDraft}</b></div><div class="v3-quota-card"><span>已使用</span><b>${institution.used}</b></div><div class="v3-quota-card"><span>剩余</span><b>${remaining}</b></div></div><label class="v3-quota-input">AI总次数<input type="number" min="${institution.used}" value="${S.v3QuotaDraft}" oninput="S.v3QuotaDraft=this.value;render()"></label><div class="v3-validity-grid"><label>开始时间<input type="datetime-local" value="${v3Esc(S.v3StartDraft)}" oninput="S.v3StartDraft=this.value"></label><label>结束时间<input type="datetime-local" value="${v3Esc(S.v3EndDraft)}" oninput="S.v3EndDraft=this.value"></label></div>` : '<div style="padding:28px 0;color:#6f7d87">相关权益保持不变</div>'}</div><footer class="v3-dialog-foot"><button class="v3-btn" onclick="S.v3Institution=null;render()">取消</button><button class="v3-btn primary" onclick="saveV3Quota()">保存</button></footer></section></div>`;
}

function openZhaocaiRights(index) {
  const org = V3_ZHAO_ORGS[index];
  if (!org) return;
  v3SyncAiRightTotals(org);
  S.zcRightsIndex = index;
  S.zcRightsTab = 'base';
  S.zcAiFormOpen = false;
  S.zcAiDraft = null;
  S.zcRightsDraft = {
    payment: org.payment, version: org.version, startAt: org.startAt, endAt: org.endAt,
    memberLimit: String(org.memberLimit), coins: String(org.coins),
  };
  render();
}

function closeZhaocaiRights() {
  S.zcRightsIndex = null;
  S.zcRightsDraft = null;
  S.zcAiFormOpen = false;
  S.zcAiDraft = null;
  render();
}

function saveZhaocaiRights() {
  const org = V3_ZHAO_ORGS[S.zcRightsIndex];
  const draft = S.zcRightsDraft;
  if (!org || !draft) return;
  if (!draft.startAt || !draft.endAt) {
    toast('请选择生效时间');
    return;
  }
  if (new Date(draft.endAt).getTime() <= new Date(draft.startAt).getTime()) {
    toast('结束时间需晚于开始时间');
    return;
  }
  Object.assign(org, {
    payment: draft.payment, version: draft.version, startAt: draft.startAt, endAt: draft.endAt,
    memberLimit: Number(draft.memberLimit) || 10, coins: Number(draft.coins) || 0,
  });
  S.zcRightsIndex = null;
  S.zcRightsDraft = null;
  toast('权益已保存');
}

function v3DateTimeInput(date) {
  const pad = value => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function openZhaocaiAiRightForm() {
  const start = new Date();
  const end = new Date(start);
  end.setFullYear(end.getFullYear() + 1);
  S.zcAiFormOpen = true;
  S.zcAiDraft = { quota: '', startAt: v3DateTimeInput(start), endAt: v3DateTimeInput(end) };
  render();
}

function closeZhaocaiAiRightForm() {
  S.zcAiFormOpen = false;
  S.zcAiDraft = null;
  render();
}

function saveZhaocaiAiRight() {
  const org = V3_ZHAO_ORGS[S.zcRightsIndex];
  const draft = S.zcAiDraft;
  const quota = Number(draft && draft.quota);
  if (!org || !draft) return;
  if (!Number.isInteger(quota) || quota <= 0) {
    toast('请输入有效的权益次数');
    return;
  }
  if (!draft.startAt || !draft.endAt || new Date(draft.endAt) <= new Date(draft.startAt)) {
    toast('请选择正确的有效期');
    return;
  }
  org.aiRights.push({
    id: `AIR-${org.id}-${Date.now()}`,
    quota, used: 0, startAt: draft.startAt, endAt: draft.endAt,
    operator: '高志远', createdAt: v3Now(),
  });
  v3SyncAiRightTotals(org);
  S.zcAiFormOpen = false;
  S.zcAiDraft = null;
  toast('AI权益已新增');
}

function zhaocaiAiRightsPanel(org) {
  const totals = v3SyncAiRightTotals(org);
  const remaining = Math.max(0, totals.quota - totals.used);
  const rows = org.aiRights.map(right => {
    const status = v3AiRightStatus(right);
    return `<tr><td><b>${right.quota}</b></td><td>${right.used}</td><td>${Math.max(0, right.quota - right.used)}</td><td>${v3Esc(right.startAt.replace('T', ' '))}<br><small>至 ${v3Esc(right.endAt.replace('T', ' '))}</small></td><td><span class="zc-ai-status ${status}">${status}</span></td><td>${v3Esc(right.operator)}<br><small>${v3Esc(right.createdAt)}</small></td></tr>`;
  }).join('');
  const form = S.zcAiFormOpen ? `<section class="zc-ai-add-form"><header><b>新增AI权益</b><button onclick="closeZhaocaiAiRightForm()">×</button></header><div><label>权益次数<input type="number" min="1" placeholder="请输入次数" value="${v3Esc(S.zcAiDraft.quota)}" oninput="S.zcAiDraft.quota=this.value"></label><label>开始时间<input type="datetime-local" value="${v3Esc(S.zcAiDraft.startAt)}" oninput="S.zcAiDraft.startAt=this.value"></label><label>结束时间<input type="datetime-local" value="${v3Esc(S.zcAiDraft.endAt)}" oninput="S.zcAiDraft.endAt=this.value"></label></div><footer><button onclick="closeZhaocaiAiRightForm()">取消</button><button class="primary" onclick="saveZhaocaiAiRight()">保存权益</button></footer></section>` : '';
  return `<div class="zc-ai-rights-panel"><div class="zc-ai-summary"><div><span>AI总次数</span><b>${totals.quota}</b></div><div><span>已使用</span><b>${totals.used}</b></div><div><span>剩余</span><b>${remaining}</b></div></div><div class="zc-ai-list-head"><div><b>权益明细</b><span>按有效期独立管理</span></div><button onclick="openZhaocaiAiRightForm()">＋ 新增权益</button></div>${form}<div class="zc-ai-table-wrap"><table><thead><tr><th>权益次数</th><th>已使用</th><th>剩余</th><th>有效期</th><th>状态</th><th>创建信息</th></tr></thead><tbody>${rows}</tbody></table></div><p class="zc-ai-rule">使用时优先扣减最早到期的有效权益。</p></div>`;
}

function zhaocaiRightsDialog() {
  const org = V3_ZHAO_ORGS[S.zcRightsIndex];
  const draft = S.zcRightsDraft;
  if (!org || !draft) return '';
  const tab = (id, label) => `<button class="${S.zcRightsTab === id ? 'on' : ''}" onclick="S.zcRightsTab='${id}';render()">${label}</button>`;
  const base = `<div class="zc-rights-form">
    <label><span><em>*</em> 付费状态：</span><div class="zc-radio-row"><label><input type="radio" name="zcPayment" ${draft.payment === '试用客户' ? 'checked' : ''} onchange="S.zcRightsDraft.payment='试用客户'">试用客户</label><label><input type="radio" name="zcPayment" ${draft.payment === '付费客户' ? 'checked' : ''} onchange="S.zcRightsDraft.payment='付费客户'">付费客户</label><label><input type="radio" name="zcPayment" ${draft.payment === '免费客户' ? 'checked' : ''} onchange="S.zcRightsDraft.payment='免费客户'">免费客户</label></div></label>
    <label><span><em>*</em> 应用版本：</span><select onchange="S.zcRightsDraft.version=this.value"><option ${draft.version === '专业版' ? 'selected' : ''}>专业版</option><option ${draft.version === '标准版' ? 'selected' : ''}>标准版</option></select></label>
    <label><span><em>*</em> 生效开始时间：</span><input type="datetime-local" value="${v3Esc(draft.startAt)}" oninput="S.zcRightsDraft.startAt=this.value"></label>
    <label><span><em>*</em> 生效结束时间：</span><input type="datetime-local" value="${v3Esc(draft.endAt)}" oninput="S.zcRightsDraft.endAt=this.value"></label>
    <label><span><em>*</em> 配置成员限制：</span><select onchange="S.zcRightsDraft.memberLimit=this.value"><option ${draft.memberLimit === '10' ? 'selected' : ''}>10</option><option ${draft.memberLimit === '20' ? 'selected' : ''}>20</option><option ${draft.memberLimit === '50' ? 'selected' : ''}>50</option></select></label>
    <label><span>灵感币发放：</span><input type="number" min="0" placeholder="请输入灵感币数量" value="${v3Esc(draft.coins)}" oninput="S.zcRightsDraft.coins=this.value"></label>
  </div>`;
  const follow = `<div class="zc-follow-placeholder">跟进信息保持原有配置</div>`;
  const ai = zhaocaiAiRightsPanel(org);
  const content = S.zcRightsTab === 'base' ? base : S.zcRightsTab === 'follow' ? follow : ai;
  return `<div class="zc-mask"><section class="zc-rights-dialog" role="dialog" aria-modal="true" aria-label="配置权益">
    <header><h2>配置权益</h2><button aria-label="关闭" onclick="closeZhaocaiRights()">×</button></header>
    <div class="zc-rights-scroll"><div class="zc-org-summary"><p>设计机构名称：<b>${v3Esc(org.name)}</b></p><p>当前机构灵感币：<b>${org.coins}</b></p><p>设计机构英文名称：</p></div><nav class="zc-rights-tabs">${tab('base','相关权益')}${tab('follow','跟进信息')}${tab('ai','AI权益')}</nav>${content}</div>
    <footer>${S.zcRightsTab === 'ai' ? '<button class="primary" onclick="closeZhaocaiRights()">关闭</button>' : '<button onclick="closeZhaocaiRights()">取消</button><button class="primary" onclick="saveZhaocaiRights()">提交</button>'}</footer>
  </section></div>`;
}

function zhaocaiAdminScreen() {
  const query = String(S.zcQuery || '').trim().toLowerCase();
  const rows = V3_ZHAO_ORGS.filter(org => !query || org.name.toLowerCase().includes(query) || org.id.toLowerCase().includes(query) || org.admin.toLowerCase().includes(query) || org.account.includes(query));
  const tableRows = rows.map(org => {
    const index = V3_ZHAO_ORGS.indexOf(org);
    return `<tr><td><input type="checkbox" aria-label="选择${v3Esc(org.name)}"></td><td><b>${v3Esc(org.name)}</b></td><td>${org.id}</td><td>${v3Esc(org.admin)}</td><td>${org.account}</td><td>${v3Esc(org.location)}</td><td>${org.scale}</td><td>${org.created}</td><td>${org.lastLogin}</td><td>${org.members}</td><td>${v3Esc(org.tag)}</td><td>${org.payment}</td><td><div class="zc-row-actions"><button>详情</button><button>编辑</button><button>成员</button><button>修改日志</button><button onclick="openZhaocaiRights(${index})">权益配置</button><button>停用</button></div></td></tr>`;
  }).join('');
  return `<div class="zc-admin">
    <header class="zc-top"><div class="zc-top-logo"><img src="${IMG.logo}" alt="兆材云库"></div><button class="zc-menu">☰</button><span>欢迎进入 展昭管理后台</span><div class="zc-top-spacer"></div><span>⌕　中国站⌄　♢　<span class="zc-user-dot"></span> 欢迎您，高志远　↪ 退出登录</span></header>
    <aside class="zc-sidebar"><button>⌂　首页</button><button>平台数据看板</button><button>▣　用户账号列表</button><button>♙　案例管理　⌄</button><button class="on">♧　设计机构租户管理　⌃</button><div class="zc-side-sub">兆材云系统版本配置</div><div class="zc-side-sub">兆材云系统权限配置</div><div class="zc-side-sub">兆材云系统菜单管理</div><div class="zc-side-sub">兆材云系统应用中心</div><div class="zc-side-sub">客户标签配置</div><div class="zc-side-sub active">兆材云系统租户列表</div><button>平台活跃报表</button><button>新材速递　⌄</button><button>供应商管理　⌄</button><button>留资管理　⌄</button><button>会员体系管理　⌄</button><button>意见反馈　⌄</button><button>品牌管理　⌄</button><button>物料管理　⌄</button></aside>
    <main class="zc-main"><nav class="zc-main-tabs"><button>首页</button><button class="on">兆材云系统租户列表</button><button>用户账号列表</button><button>设计师认证审核</button><button>验证码管理</button><button>兆材云系统版本配置</button><button>兆材云系统权限配置</button><button>兆材云系统菜单管理</button><button>兆材云系统应用中心</button></nav>
      <section class="zc-panel"><div class="zc-filters"><label><input placeholder="输入ID/名称/管理员账号搜索" value="${v3Esc(S.zcQuery)}" oninput="S.zcQuery=this.value"></label><label><span>创建时间：</span><input placeholder="请选择开始日期　~　请选择结束日期"></label><label><span>最后登录时间：</span><input placeholder="请选择开始日期　~　请选择结束日期"></label><label><span>所在地：</span><input placeholder="请选择省市区"></label><label><span>客户标签：</span><input placeholder="请输入客户标签"></label><label><span>付费状态：</span><input placeholder="请选择付费状态"></label><label><span>权益状态：</span><input placeholder="请选择权益状态"></label><label><span>权益版本：</span><input placeholder="请选择权益版本"></label><label><span>权益生效时间：</span><input placeholder="请选择开始日期　~　请选择结束日期"></label><label><span>灵感币权益：</span><input placeholder="请输入最小区间　-　请输入最大区间"></label><label><span>灵感币余额：</span><input placeholder="请输入最小区间　-　请输入最大区间"></label><label><span>市场跟进人：</span><input placeholder="请输入市场跟进人"></label><label><span>运营跟进人：</span><input placeholder="请输入运营跟进人"></label><label><span>备注：</span><input placeholder="请输入备注"></label><button class="zc-query" onclick="render()">⌕ 查询</button><button onclick="S.zcQuery='';render()">↻ 重置</button></div>
        <div class="zc-toolbar"><button>＋ 新增</button><button>⇩ 导出</button><button>⚙ 系统配置</button><button>♢ 安全日志</button><button>⌁ 批量修改</button><button>▽ 高级查询</button></div><div class="zc-selection">已选择 <b>0</b> 项　<span>清空</span></div>
        <div class="zc-table-wrap"><table><thead><tr><th>□</th><th>机构名称</th><th>机构ID</th><th>管理员</th><th>管理员账号</th><th>所在地</th><th>机构人数(规模)</th><th>创建时间</th><th>最后登录时间</th><th>成员数</th><th>客户标签</th><th>付费状态</th><th>操作</th></tr></thead><tbody>${tableRows}</tbody></table></div>
      </section>
    </main>${S.zcRightsIndex !== null ? zhaocaiRightsDialog() : ''}
  </div>`;
}

/* Unified uploads, empty-by-default floor framing, and zoom gestures. */
var v3FloorTouchState = { mode: '', start: null, startDistance: 0, startZoom: 1 };

function openGeneratePicker(kind) {
  S.flowModal = kind;
  if (kind === 'floor') {
    S.floorDraftImage = S.floorImage || V3_FLOORS[0].image;
    S.floorDraftName = S.floorImage ? S.floorName : V3_FLOORS[0].name;
    S.floorDraftBox = S.floorBox ? { ...S.floorBox } : null;
    S.floorDraftZoom = 1;
    S.floorDraftIndex = Math.max(0, V3_FLOORS.findIndex(item => item.image === S.floorDraftImage));
  } else {
    S.styleDraftImage = S.styleImage || V3_STYLES[0].image;
    S.styleDraftName = S.styleImage ? S.styleName : V3_STYLES[0].name;
    S.styleDraftIndex = Math.max(0, V3_STYLES.findIndex(item => item.image === S.styleDraftImage));
  }
  render();
}

function pickV3Floor(index) {
  const item = V3_FLOORS[index];
  if (!item) return;
  S.floorDraftIndex = index;
  S.floorDraftImage = item.image;
  S.floorDraftName = item.name;
  S.floorDraftBox = null;
  S.floorDraftZoom = 1;
  render();
}

function pickV3Style(index) {
  const item = V3_STYLES[index];
  if (!item) return;
  S.styleDraftIndex = index;
  S.styleDraftImage = item.image;
  S.styleDraftName = item.name;
  render();
}

function v3GenerateFileChosen(event, kind) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (!/^image\/(png|jpeg)$/.test(file.type) || file.size > 10 * 1024 * 1024) {
    toast('请选择 10 MB 以内的 JPG 或 PNG');
    return;
  }
  const url = URL.createObjectURL(file);
  if (kind === 'floor') {
    S.floorDraftIndex = -1;
    S.floorDraftImage = url;
    S.floorDraftName = '';
    S.floorDraftBox = null;
    S.floorDraftZoom = 1;
  } else {
    S.styleDraftIndex = -1;
    S.styleDraftImage = url;
    S.styleDraftName = '';
  }
  render();
}

function confirmGeneratePicker() {
  if (S.flowModal === 'floor') {
    if (!S.floorDraftBox) {
      toast('请框选范围');
      return;
    }
    S.floorImage = S.floorDraftImage;
    S.floorName = S.floorDraftName;
    S.floorBox = { ...S.floorDraftBox };
  } else {
    S.styleImage = S.styleDraftImage;
    S.styleName = S.styleDraftName;
  }
  S.flowModal = '';
  render();
}

function v3FloorImageFrame(canvas, zoom = 1) {
  const image = canvas && canvas.querySelector('img');
  const width = Math.max(1, canvas ? canvas.clientWidth : 1);
  const height = Math.max(1, canvas ? canvas.clientHeight : 1);
  const naturalWidth = image && image.naturalWidth ? image.naturalWidth : width;
  const naturalHeight = image && image.naturalHeight ? image.naturalHeight : height;
  const fit = Math.min(width / naturalWidth, height / naturalHeight);
  const drawnWidth = naturalWidth * fit * zoom;
  const drawnHeight = naturalHeight * fit * zoom;
  return {
    left: (width - drawnWidth) / 2,
    top: (height - drawnHeight) / 2,
    width: drawnWidth,
    height: drawnHeight,
    canvasWidth: width,
    canvasHeight: height,
  };
}

function v3CropPoint(clientX, clientY, canvas) {
  const rect = canvas.getBoundingClientRect();
  const frame = v3FloorImageFrame(canvas, S.floorDraftZoom || 1);
  const localX = (clientX - rect.left) * frame.canvasWidth / Math.max(1, rect.width);
  const localY = (clientY - rect.top) * frame.canvasHeight / Math.max(1, rect.height);
  return {
    x: Math.max(0, Math.min(100, (localX - frame.left) / frame.width * 100)),
    y: Math.max(0, Math.min(100, (localY - frame.top) / frame.height * 100)),
  };
}

function v3PositionFloorBox(canvas, element, box, zoom = 1) {
  if (!canvas || !element || !box) return;
  const frame = v3FloorImageFrame(canvas, zoom);
  const left = (frame.left + box.x / 100 * frame.width) / frame.canvasWidth * 100;
  const top = (frame.top + box.y / 100 * frame.height) / frame.canvasHeight * 100;
  const width = box.w / 100 * frame.width / frame.canvasWidth * 100;
  const height = box.h / 100 * frame.height / frame.canvasHeight * 100;
  Object.assign(element.style, { left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` });
  element.dataset.floorX = box.x;
  element.dataset.floorY = box.y;
  element.dataset.floorW = box.w;
  element.dataset.floorH = box.h;
}

function v3LayoutFloorBoxes(root = document) {
  const selector = '.v3-crop-canvas, .v3-floor-audit';
  const canvases = root && root.matches && root.matches(selector)
    ? [root, ...root.querySelectorAll(selector)]
    : [...root.querySelectorAll(selector)];
  canvases.forEach(canvas => {
    const image = canvas.querySelector('img');
    if (!image) return;
    if (!image.naturalWidth) {
      image.addEventListener('load', () => v3LayoutFloorBoxes(canvas), { once: true });
      return;
    }
    const zoom = canvas.classList.contains('v3-crop-canvas') ? (S.floorDraftZoom || 1) : 1;
    canvas.querySelectorAll('.v3-crop-box').forEach(element => {
      const box = {
        x: Number(element.dataset.floorX), y: Number(element.dataset.floorY),
        w: Number(element.dataset.floorW), h: Number(element.dataset.floorH),
      };
      if (Object.values(box).every(Number.isFinite)) v3PositionFloorBox(canvas, element, box, zoom);
    });
  });
}

function v3LiveDraftBox(canvas) {
  let box = canvas.querySelector('.v3-crop-box');
  if (!box) {
    box = document.createElement('span');
    box.className = 'v3-crop-box drawing';
    box.setAttribute('aria-hidden', 'true');
    box.innerHTML = '<span class="v3-crop-size"></span>';
    canvas.appendChild(box);
  }
  return box;
}

function v3DrawDraftBox(start, current, canvas) {
  S.floorDraftBox = {
    x: Math.min(start.x, current.x),
    y: Math.min(start.y, current.y),
    w: Math.abs(current.x - start.x),
    h: Math.abs(current.y - start.y),
  };
  const box = v3LiveDraftBox(canvas);
  v3PositionFloorBox(canvas, box, S.floorDraftBox, S.floorDraftZoom || 1);
  const size = box.querySelector('.v3-crop-size');
  if (size) size.textContent = `${Math.round(S.floorDraftBox.w)}% × ${Math.round(S.floorDraftBox.h)}%`;
}

function v3FinishDraftBox() {
  if (!S.floorDraftBox || S.floorDraftBox.w < 6 || S.floorDraftBox.h < 6) S.floorDraftBox = null;
  render();
}

function v3FloorPointer(event) {
  if (event.pointerType === 'touch' || (event.button !== undefined && event.button !== 0)) return;
  event.preventDefault();
  const canvas = event.currentTarget;
  const start = v3CropPoint(event.clientX, event.clientY, canvas);
  S.floorDraftBox = { x: start.x, y: start.y, w: .1, h: .1 };
  const move = current => v3DrawDraftBox(start, v3CropPoint(current.clientX, current.clientY, canvas), canvas);
  const up = () => {
    removeEventListener('pointermove', move);
    removeEventListener('pointerup', up);
    removeEventListener('pointercancel', up);
    v3FinishDraftBox();
  };
  addEventListener('pointermove', move);
  addEventListener('pointerup', up);
  addEventListener('pointercancel', up);
}

function v3ResizeFloorBox(event, direction) {
  if (!S.floorDraftBox || !['nw', 'ne', 'se', 'sw'].includes(direction)) return;
  event.stopPropagation();
  event.preventDefault();
  const canvas = event.currentTarget.closest('.v3-crop-canvas');
  if (!canvas) return;
  const startBox = { ...S.floorDraftBox };
  const minSize = 6;
  const startLeft = startBox.x;
  const startTop = startBox.y;
  const startRight = startBox.x + startBox.w;
  const startBottom = startBox.y + startBox.h;
  const move = currentEvent => {
    currentEvent.preventDefault();
    const point = v3CropPoint(currentEvent.clientX, currentEvent.clientY, canvas);
    let left = startLeft;
    let top = startTop;
    let right = startRight;
    let bottom = startBottom;
    if (direction.includes('w')) left = Math.max(0, Math.min(startRight - minSize, point.x));
    if (direction.includes('e')) right = Math.min(100, Math.max(startLeft + minSize, point.x));
    if (direction.includes('n')) top = Math.max(0, Math.min(startBottom - minSize, point.y));
    if (direction.includes('s')) bottom = Math.min(100, Math.max(startTop + minSize, point.y));
    S.floorDraftBox = { x: left, y: top, w: right - left, h: bottom - top };
    const box = canvas.querySelector('.v3-crop-box');
    if (box) v3PositionFloorBox(canvas, box, S.floorDraftBox, S.floorDraftZoom || 1);
  };
  const up = () => {
    removeEventListener('pointermove', move);
    removeEventListener('pointerup', up);
    removeEventListener('pointercancel', up);
    render();
  };
  addEventListener('pointermove', move, { passive: false });
  addEventListener('pointerup', up);
  addEventListener('pointercancel', up);
}

function v3FloorTouchStart(event) {
  event.preventDefault();
  const canvas = event.currentTarget;
  if (event.touches.length === 2) {
    const [a, b] = event.touches;
    v3FloorTouchState = { mode: 'pinch', start: null, startDistance: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), startZoom: S.floorDraftZoom || 1 };
    return;
  }
  const touch = event.touches[0];
  v3FloorTouchState = { mode: 'draw', start: v3CropPoint(touch.clientX, touch.clientY, canvas), startDistance: 0, startZoom: S.floorDraftZoom || 1 };
}

function v3FloorTouchMove(event) {
  event.preventDefault();
  const canvas = event.currentTarget;
  if (event.touches.length === 2) {
    const [a, b] = event.touches;
    if (v3FloorTouchState.mode !== 'pinch') {
      v3FloorTouchState.mode = 'pinch';
      v3FloorTouchState.startDistance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      v3FloorTouchState.startZoom = S.floorDraftZoom || 1;
    }
    const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    setFloorZoom(v3FloorTouchState.startZoom * distance / Math.max(1, v3FloorTouchState.startDistance));
    return;
  }
  if (v3FloorTouchState.mode === 'draw' && event.touches[0]) {
    const touch = event.touches[0];
    v3DrawDraftBox(v3FloorTouchState.start, v3CropPoint(touch.clientX, touch.clientY, canvas), canvas);
  }
}

function v3FloorTouchEnd(event) {
  event.preventDefault();
  if (v3FloorTouchState.mode === 'draw' && event.touches.length === 0) v3FinishDraftBox();
  if (event.touches.length < 2) v3FloorTouchState.mode = '';
}

function setFloorZoom(value) {
  S.floorDraftZoom = Math.max(1, Math.min(3, Number(value) || 1));
  const image = document.getElementById('v3FloorDraftImage');
  const label = document.getElementById('v3FloorZoomLabel');
  if (image) image.style.transform = `scale(${S.floorDraftZoom})`;
  if (label) label.textContent = `${Math.round(S.floorDraftZoom * 100)}%`;
  if (image) v3LayoutFloorBoxes(image.closest('.v3-crop-canvas'));
}

function v3FloorWheel(event) {
  event.preventDefault();
  setFloorZoom((S.floorDraftZoom || 1) + (event.deltaY < 0 ? .2 : -.2));
}

function resetFloorBox() {
  S.floorDraftBox = null;
  render();
}

function generatePickerDialog() {
  if (S.flowModal === 'floor') {
    const uploadContent = S.floorDraftIndex === -1
      ? `<img src="${S.floorDraftImage}" alt="本地户型图">`
      : `<span class="v3-upload-copy"><strong>＋</strong>本地上传</span>`;
    return `<div class="v3-mask"><section class="v3-dialog" role="dialog" aria-modal="true" aria-label="选择户型图">
      <header class="v3-dialog-head"><div><h2>选择户型图</h2><p>拖动画框</p></div><button class="v3-icon-btn" aria-label="关闭" onclick="closeGeneratePicker()">×</button></header>
      <div class="v3-dialog-body"><div class="v3-floor-picker">
        <aside class="v3-picker-list"><div class="v3-picker-list-head"><b>户型图</b><span class="v3-count">${V3_FLOORS.length}</span></div><div class="v3-mini-grid">
          <label class="v3-mini-card v3-unified-upload ${S.floorDraftIndex === -1 ? 'on local-selected' : ''}">${uploadContent}<input type="file" accept="image/png,image/jpeg" onchange="v3GenerateFileChosen(event,'floor')"></label>
          ${V3_FLOORS.map((item, index) => `<button class="v3-mini-card ${S.floorDraftIndex === index ? 'on' : ''}" onclick="pickV3Floor(${index})"><img src="${item.image}" alt="${v3Esc(item.name)}"><span>${v3Esc(item.name)}</span></button>`).join('')}
        </div></aside>
        <div class="v3-crop-side"><div class="v3-crop-title"><span>${v3Esc(S.floorDraftName)}</span><div class="v3-zoom-controls"><button aria-label="缩小" onclick="setFloorZoom(S.floorDraftZoom-.25)">−</button><span id="v3FloorZoomLabel">${Math.round((S.floorDraftZoom || 1) * 100)}%</span><button aria-label="放大" onclick="setFloorZoom(S.floorDraftZoom+.25)">＋</button></div></div><div class="v3-crop-canvas fixed" onwheel="v3FloorWheel(event)" onpointerdown="v3FloorPointer(event)" ontouchstart="v3FloorTouchStart(event)" ontouchmove="v3FloorTouchMove(event)" ontouchend="v3FloorTouchEnd(event)"><img id="v3FloorDraftImage" src="${S.floorDraftImage}" alt="${v3Esc(S.floorDraftName)}" style="transform:scale(${S.floorDraftZoom || 1})">${v3FloorBox(S.floorDraftBox, 'editable')}</div><div class="v3-crop-actions"><span>框选识别范围</span><button class="v3-btn ghost" ${S.floorDraftBox ? '' : 'disabled'} onclick="resetFloorBox()">重画</button></div></div>
      </div></div>
      <footer class="v3-dialog-foot"><button class="v3-btn" onclick="closeGeneratePicker()">取消</button><button class="v3-btn primary" ${S.floorDraftBox ? '' : 'disabled'} onclick="confirmGeneratePicker()">确定</button></footer>
    </section></div>`;
  }
  const localStyle = S.styleDraftIndex === -1
    ? `<img src="${S.styleDraftImage}" alt="本地风格参考图">`
    : `<span class="v3-upload-copy"><strong>＋</strong>本地上传</span>`;
  return `<div class="v3-mask"><section class="v3-dialog compact" role="dialog" aria-modal="true" aria-label="选择风格参考图">
    <header class="v3-dialog-head"><div><h2>选择风格参考图</h2></div><button class="v3-icon-btn" aria-label="关闭" onclick="closeGeneratePicker()">×</button></header>
    <div class="v3-dialog-body"><div class="v3-style-picker-grid">
      <label class="v3-style-pick v3-unified-upload ${S.styleDraftIndex === -1 ? 'on local-selected' : ''}">${localStyle}<input type="file" accept="image/png,image/jpeg" onchange="v3GenerateFileChosen(event,'style')"></label>
      ${V3_STYLES.map((item, index) => `<button class="v3-style-pick ${S.styleDraftIndex === index ? 'on' : ''}" onclick="pickV3Style(${index})"><img src="${item.image}" alt="${v3Esc(item.name)}"><b>${v3Esc(item.name)}</b></button>`).join('')}
    </div></div>
    <footer class="v3-dialog-foot"><button class="v3-btn" onclick="closeGeneratePicker()">取消</button><button class="v3-btn primary" onclick="confirmGeneratePicker()">确定</button></footer>
  </section></div>`;
}

function effectSelectScreen() {
  const selectionId = S.effectSelection && S.effectSelection.id;
  const localCard = S.effectSelection && S.effectSelection.source === '本地上传'
    ? `<button class="v3-effect-card on local-selected" onclick="render()"><img src="${S.effectSelection.image}" alt="本地效果图"><small>本地上传</small></button>` : '';
  const uploadCard = `<label class="v3-effect-card v3-unified-upload"><span class="v3-upload-copy"><strong>＋</strong>本地上传</span><input type="file" accept="image/png,image/jpeg" onchange="v3EffectFileChosen(event)"></label>`;
  const presetCards = V3_EFFECT_PRESETS.map((item, index) => `<button class="v3-effect-card ${selectionId === `preset-${index}` ? 'on' : ''}" onclick="selectV3Effect('preset',${index})"><img src="${item.image}" alt="${v3Esc(item.name)}"><b>${v3Esc(item.name)}</b></button>`).join('');
  const historyCards = V3_EFFECT_HISTORY.map((item, index) => `<button class="v3-effect-card ${selectionId === item.id ? 'on' : ''}" onclick="selectV3Effect('history',${index})"><img src="${item.image}" alt="${v3Esc(item.name)}"><b>${v3Esc(item.name)}</b><small>${item.time}</small></button>`).join('');
  const body = `<div class="v3-effect-page">
    <section class="v3-effect-section"><div class="v3-effect-grid">${uploadCard}${localCard}${presetCards}</div></section>
    <section class="v3-effect-section history"><header class="v3-section-title"><h2>历史记录</h2><span>${V3_EFFECT_HISTORY.length} 张</span></header><div class="v3-effect-grid">${historyCards}</div></section>
    <div class="v3-effect-action"><button class="v3-btn primary" ${S.effectSelection ? '' : 'disabled'} onclick="confirmEffectSource()">下一步</button></div>
  </div>`;
  return v3Shell('选择效果图', body, 'source');
}

/* Material preparation and point placement share one workspace. */
function markerScreen() {
  const activeId = S.activeMaterialId;
  const hasMaterials = S.materialCandidates.length > 0;
  const activeMaterial = S.materialCandidates.find(material => material.id === activeId);
  const activeMarkIndex = S.marks.findIndex(mark => mark.materialId === activeId);
  const guideText = !hasMaterials ? '先添加物料' : activeMaterial ? (activeMarkIndex >= 0 ? '点击图中调整位置' : '点击图中位置') : '选择一个物料';
  const cards = hasMaterials ? S.materialCandidates.map(material => {
    const markIndex = S.marks.findIndex(mark => mark.materialId === material.id);
    const bound = markIndex >= 0;
    return `<article class="v3-marker-material ${activeId === material.id ? 'on' : ''} ${bound ? 'bound' : ''}" onclick="selectMarkerMaterial('${material.id}')">
      <span class="v3-marker-thumb"><img src="${material.image}" alt="${material.name ? v3Esc(material.name) : '本地物料图片'}"></span>
      <span class="v3-marker-material-copy">${material.name ? `<b>${v3Esc(material.name)}</b>` : ''}${material.category ? `<span>${v3Esc(material.category)}</span>` : ''}<small>${v3Esc(material.source)}</small></span>
      <span class="v3-marker-material-actions">${bound
        ? `<span class="v3-marker-thumb-point ${S.active === markIndex ? 'on' : ''}" aria-hidden="true">${markIndex + 1}</span><button onclick="deleteMarkForMaterial(event,'${material.id}')">删除标点</button>`
        : `<button class="remove" onclick="removeCandidateMaterialFromMarker(event,'${material.id}')">移除</button>`}</span>
    </article>`;
  }).join('') : `<div class="v3-marker-empty">
    <span class="v3-marker-empty-icon" aria-hidden="true"><i></i><i></i><i></i></span>
    <b>暂无物料</b>
    <small>添加后即可标记位置</small>
    <div class="v3-add-wrap"><button class="v3-btn primary" onclick="toggleMaterialMenu()">＋ 添加物料</button>${S.materialMenuOpen ? materialSourceMenu() : ''}</div>
  </div>`;
  const points = S.marks.map((mark, index) => `<button class="v3-point ${S.active === index ? 'on' : ''}" data-v3-mark="${index}" style="left:${mark.x}%;top:${mark.y}%" aria-label="标点 ${index + 1}" onpointerdown="dragV3Mark(event,${index})" onclick="selectV3Mark(event,${index})">${index + 1}</button>`).join('');
  const body = `<div class="v3-marker-layout merged">
    <div class="v3-marker-canvas" id="v3MarkerCanvas" onclick="addV3Mark(event)"><span class="v3-marker-guide">${guideText}</span><img src="${S.inputImage}" alt="${v3Esc(S.inputName || '效果图')}">${points}</div>
    <aside class="v3-marker-side">
      <div class="v3-marker-side-top"><div><h2>物料</h2><small>${S.materialCandidates.length} 个物料　${S.marks.length}/3 个标点</small></div>${hasMaterials ? `<div class="v3-add-wrap"><button class="v3-btn" onclick="toggleMaterialMenu()">＋ 添加</button>${S.materialMenuOpen ? materialSourceMenu() : ''}</div>` : ''}</div>
      <div class="v3-marker-materials">${cards}</div>
      <button class="v3-btn primary v3-marker-submit" ${S.marks.length ? '' : 'disabled'} onclick="replaceMaterial()">生成替换效果</button>
    </aside>
  </div>`;
  return v3Shell('标记位置', body, 'effectSelect', S.materialSourceModal ? materialSourceDialog() : '');
}

function deleteMarkForMaterial(event, materialId) {
  event.stopPropagation();
  const index = S.marks.findIndex(mark => mark.materialId === materialId);
  if (index < 0) return;
  S.marks.splice(index, 1);
  S.active = null;
  S.activeMaterialId = materialId;
  render();
}

function removeCandidateMaterialFromMarker(event, materialId) {
  event.stopPropagation();
  removeCandidateMaterial(materialId);
}

function back() {
  clearTimeout(S.loadingTimer);
  clearTimeout(S.rfidTimer);
  const map = {
    source: 'home',
    generateSetup: 'source',
    loadingBase: 'generateSetup',
    generatePreview: 'generateSetup',
    effectSelect: 'source',
    materialPrepare: 'effectSelect',
    mark: 'effectSelect',
    loadingReplace: 'mark',
    compare: 'mark',
    material: 'home',
  };
  S.page = map[S.page] || 'source';
  render();
}

function goHome() {
  clearTimeout(S.loadingTimer);
  clearTimeout(S.rfidTimer);
  S.page = 'home';
  S.flowModal = '';
  S.materialSourceModal = '';
  S.materialMenuOpen = false;
  S.materialCandidates = [];
  S.marks = [];
  S.replacementResult = '';
  S.active = null;
  S.activeMaterialId = null;
  render();
}

function render() {
  let html = '';
  if (S.page === 'home') html = home();
  else if (S.page === 'material') html = materialDetail();
  else if (S.page === 'source') html = source();
  else if (S.page === 'generateSetup') html = generateSetupScreen();
  else if (S.page === 'loadingBase') html = loading('base');
  else if (S.page === 'generatePreview') html = generatePreviewScreen();
  else if (S.page === 'effectSelect') html = effectSelectScreen();
  else if (S.page === 'materialPrepare') html = markerScreen();
  else if (S.page === 'mark') html = markerScreen();
  else if (S.page === 'loadingReplace') html = loading('replace');
  else if (S.page === 'compare') html = compareScreen();
  else if (S.page === 'admin') html = admin();
  else if (S.page === 'zhaocaiAdmin') html = zhaocaiAdminScreen();
  app.innerHTML = html + (S.toast ? `<div class="toast" role="status">${S.toast}</div>` : '');
  setTimeout(() => v3LayoutFloorBoxes(app), 0);
}

function setPrototypeMode(mode) {
  const device = document.getElementById('ipad');
  device.classList.toggle('admin-canvas', mode === 'admin' || mode === 'zhaocai');
  document.getElementById('ipadMode').classList.toggle('on', mode === 'ipad');
  document.getElementById('adminMode').classList.toggle('on', mode === 'admin');
  document.getElementById('zhaocaiAdminMode').classList.toggle('on', mode === 'zhaocai');
  S.page = mode === 'ipad' ? 'home' : mode === 'zhaocai' ? 'zhaocaiAdmin' : 'admin';
  if (mode === 'admin' && !['floor', 'effect', 'style', 'calls'].includes(S.adminSection)) S.adminSection = 'floor';
  fit();
  render();
}

document.getElementById('ipadMode').onclick = () => setPrototypeMode('ipad');
document.getElementById('adminMode').onclick = () => setPrototypeMode('admin');
document.getElementById('zhaocaiAdminMode').onclick = () => setPrototypeMode('zhaocai');
render();
fit();
