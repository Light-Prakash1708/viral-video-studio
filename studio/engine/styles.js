// engine/styles.js — colour moods + switchable visual styles.
// A MOOD is the lighting situation of a location (day, dusk, night, storm, interiors, void).
// A STYLE re-grades every mood (palette overrides + a lift/gamma/gain colour grade on the final frame + post settings).
// grade: contrast (around mid-grey), sat (saturation), lift/gamma/gain per RGB channel (lift tints shadows, gain tints highlights).
// Scenes must take colours from mood()/S() so a style switch re-themes the whole video.

export const BASE_MOODS = {
  day:          { sky: ['#8fb0d8', '#cfdcea', '#efe3d2'], ambient: '#6f7d96', key: '#fff3dc', rim: '#fff1d6', wall: '#8d8496', floor: '#5f5866', dark: '#2f2a36', practical: '#ffe2a8', grass: '#4f8a55', road: '#5d5a66', fog: '#dfe4f0' },
  golden:       { sky: ['#6b5a8e', '#e89a6a', '#f9d49c'], ambient: '#4a3a50', key: '#ffcf8f', rim: '#ffc68a', wall: '#5a3a34', floor: '#45302a', dark: '#2a1814', practical: '#ffe7b0', grass: '#4d6b3c', road: '#4a3c40', fog: '#f0c49a' },
  dusk:         { sky: ['#3d3360', '#8a5a86', '#e8956b', '#f7cf98'], ambient: '#3b2b3d', key: '#ffc68a', rim: '#ffc68a', wall: '#4a3646', floor: '#3d2c38', dark: '#231a27', practical: '#ffd59a', grass: '#3d5a48', road: '#3a3040', fog: '#c08a8a' },
  night:        { sky: ['#0b1028', '#1d2550', '#3a3570'], ambient: '#1e2444', key: '#c9d4ff', rim: '#a9b8ff', wall: '#262a46', floor: '#1b1e33', dark: '#0f1122', practical: '#ffb860', grass: '#22433a', road: '#24263a', fog: '#3a4270' },
  storm:        { sky: ['#141a33', '#2a3358', '#3d4670'], ambient: '#232a48', key: '#dfe6ff', rim: '#cfd9ff', wall: '#2b3150', floor: '#1c2238', dark: '#0d1020', practical: '#bcd0ff', grass: '#25483e', road: '#232838', fog: '#4a5580' },
  interiorWarm: { sky: ['#c98a74', '#f2b585', '#f7cf98'], ambient: '#4a3646', key: '#ffd59a', rim: '#ffcf8f', wall: '#4f3a40', floor: '#3a2a2e', dark: '#21171c', practical: '#ffd28a', grass: '#3d5a48', road: '#3a3040', fog: '#a87a70' },
  interiorCool: { sky: ['#2a3560', '#5a6aa0'], ambient: '#2a2c48', key: '#cbd6ff', rim: '#b8c6ff', wall: '#2e3150', floor: '#22243a', dark: '#121426', practical: '#9fe0ff', grass: '#22433a', road: '#24263a', fog: '#4a5080' },
  void:         { sky: ['#0a0e1a', '#121a2e'], ambient: '#151c30', key: '#ffffff', rim: '#8fb8e8', wall: '#121a2e', floor: '#0d1322', dark: '#070a12', practical: '#ffd47e', grass: '#1d3a33', road: '#151a28', fog: '#1d2740' },
};

const UI = { card: 'rgba(18,28,48,.94)', cardLine: 'rgba(150,180,230,.25)', text: '#9fb6d8', sub: '#6f84a6', accent: '#ff6f61', gold: '#ffd47e', cream: '#fff1dc', blueprint: '#8fb8e8', bpBg: '#0b1324', good: '#5fd39a' };

export const STYLES = {
  dystopia: {
    name: 'Dystopian Grime', desc: 'Grim near-future: soot-black shadows with a sick green cast, sodium-amber highlights, desaturated, heavy grain and vignette. Toxic green screens + warning orange accents.',
    ink: '#0a0b08', inkFar: '#2a2c24', feature: '#f0ecd8', rimWidth: 5,
    ui: { ...UI, card: 'rgba(14,14,10,.88)', cardLine: 'rgba(184,255,106,.3)', text: '#ecead8', sub: '#a8a48c', accent: '#ff7a2a', gold: '#b8ff6a', blueprint: '#b8ff6a', bpBg: '#0e100c', good: '#b8ff6a' },
    grade: { contrast: 1.16, sat: 0.72, lift: [0.025, 0.035, 0.02], gamma: [1.0, 1.02, 0.96], gain: [1.08, 1.02, 0.84], vignette: 0.62, grain: 0.07, bloom: 0.5 },
    moods: {
      night:  { sky: ['#060706', '#121410', '#22241c'], ambient: '#3a3c30', key: '#e8d8a8', rim: '#b8ff6a', wall: '#20221c', floor: '#141610', dark: '#050604', practical: '#ffb04a', fog: '#2a2c22' },
      interiorCool: { sky: ['#060706', '#101210', '#1e201a'], key: '#e8e4c8', rim: '#b8ff6a', wall: '#1e201a', floor: '#121410', dark: '#050604', practical: '#b8ff6a', fog: '#24261e' },
      interiorWarm: { sky: ['#1a120a', '#3a2814', '#6a4a24'], key: '#ffc070', rim: '#ffd090', wall: '#4a3a24', floor: '#2a2014', dark: '#0e0a06', practical: '#ffc070', fog: '#5a4a30' },
      golden: { sky: ['#5a6a5a', '#b8a878', '#f0d8a0'], key: '#fff0c8', rim: '#ffffff', wall: '#a89878', floor: '#6a6048', dark: '#24201a', practical: '#fff0c8', grass: '#8ab86a', fog: '#d8ccaa' },
      dusk:   { sky: ['#1a1a14', '#5a4a2a', '#c8783a', '#f0b060'], key: '#ffb060', rim: '#ffd090', wall: '#3a3024', floor: '#221c14', dark: '#0a0806', practical: '#ffb060', grass: '#6a8a4a', fog: '#8a6a4a' },
    },
  },
  surreal: {
    name: 'Surreal Future', desc: 'Dreamlike sci-fi: violet/cyan neon, pearl highlights, heavy bloom, soft haze. For 3D dream worlds, simulations, headsets.',
    ink: '#0a0816', inkFar: '#2a2448', feature: '#f4f0ff', rimWidth: 5,
    ui: { ...UI, card: 'rgba(14,8,32,.86)', cardLine: 'rgba(140,220,255,.35)', text: '#eef0ff', sub: '#a8a4d0', accent: '#ff5ab4', gold: '#7ff0ff', blueprint: '#9fe8ff', bpBg: '#0c0a24', good: '#8affc8' },
    grade: { contrast: 1.08, sat: 1.12, lift: [0.03, 0.02, 0.06], gamma: [1.0, 0.98, 1.04], gain: [1.04, 0.98, 1.08], vignette: 0.5, grain: 0.03, bloom: 1.2 },
    moods: {
      night:  { sky: ['#06041a', '#1a0e44', '#3a1a6a'], ambient: '#4a3a8a', key: '#bfe8ff', rim: '#7ff0ff', wall: '#1e1a3a', floor: '#120e28', dark: '#04030e', practical: '#ff9ae0', fog: '#3a2a6a' },
      dusk:   { sky: ['#1a0e44', '#6a2a8a', '#ff7ab4', '#ffd0a0'], key: '#ffd0e8', rim: '#ffe0f0', wall: '#3a2a5a', floor: '#2a1e44', dark: '#0a0618', practical: '#ffc0e0', grass: '#5ad0b0', fog: '#c890d0' },
      golden: { sky: ['#3a5ad0', '#b890f0', '#ffd8e8'], key: '#fff0f8', rim: '#ffffff', wall: '#c8b0e0', floor: '#8a74b0', dark: '#2a1e4a', practical: '#fff0c8', grass: '#7ae0c0', fog: '#e0d0f8' },
      interiorCool: { sky: ['#0a0c20', '#14183a', '#22285a'], key: '#bfe8ff', rim: '#7ff0ff', wall: '#1a1e38', floor: '#10122a', dark: '#05060f', practical: '#7ff0ff', fog: '#2a3060' },
      interiorWarm: { sky: ['#2a1a14', '#5a3a28', '#a87050'], key: '#ffd8a0', rim: '#ffe0b0', wall: '#6a4a38', floor: '#3a2820', dark: '#120a08', practical: '#ffd8a0', fog: '#8a6a50' },
    },
  },
  painterly: {
    name: 'Nostalgic Painterly', desc: 'Warm, faded-film painting: lifted blacks, honey highlights, soft bloom, paper grain. Use with presets/nostalgic-painterly/paint.js.',
    ink: '#1a1410', inkFar: '#4a3a30', feature: '#fff8ec', rimWidth: 5,
    ui: { ...UI, card: 'rgba(30,20,14,.78)', cardLine: 'rgba(255,220,160,.35)', text: '#fff3e0', sub: '#d8c0a0', accent: '#ff7a5a', gold: '#ffd27a', blueprint: '#ffe8c8', bpBg: '#2a2018', good: '#9fe0a0' },
    grade: { contrast: 1.12, sat: 1.12, lift: [0.035, 0.028, 0.02], gamma: [1.03, 1.01, 0.97], gain: [1.06, 1.02, 0.94], vignette: 0.45, grain: 0.035, bloom: 0.6 },
    moods: {
      golden: { sky: ['#5a8fc8', '#f2b880', '#ffe2a8'], ambient: '#8a6a58', key: '#ffd8a0', rim: '#ffe0b0', wall: '#c89a6a', floor: '#8a6a48', dark: '#3a2a20', practical: '#ffe0a8', grass: '#7aa84a', fog: '#f0d8b8' },
      day:    { sky: ['#4a8ed8', '#8cc4ec', '#dff0f6'], ambient: '#7a8aa0', key: '#fff6e0', rim: '#ffffff', wall: '#d8c0a0', floor: '#a08a68', dark: '#3a3428', practical: '#fff0c8', grass: '#6aa84a', fog: '#e8eef0' },
      dusk:   { sky: ['#2a2a5a', '#8a5a8a', '#f08a5a', '#ffd08a'], key: '#ffb070', rim: '#ffc890', wall: '#6a4a50', floor: '#4a3438', dark: '#1a1218', practical: '#ffd89a', grass: '#3a5a3a', fog: '#c89a90' },
      interiorCool: { sky: ['#5a6470', '#8a949e', '#b8c0c6'], key: '#e8eef4', rim: '#f0f4f8', wall: '#7e868e', floor: '#5a6066', dark: '#24282c', practical: '#e0e8f0', fog: '#9aa4ac' },
      interiorWarm: { sky: ['#6a4a34', '#a87850', '#e0b880'], key: '#ffd8a0', rim: '#ffe0b0', wall: '#a87e5a', floor: '#6a4c34', dark: '#2a1c14', practical: '#ffe0a8', fog: '#d8b890' },
      night:  { sky: ['#101830', '#24305a', '#4a4a7a'], key: '#ffd8a0', rim: '#ffd8a0', wall: '#2a2a40', floor: '#1a1a2a', dark: '#0a0a14', practical: '#ffd890', fog: '#3a3a5a' },
    },
  },
  silent: {
    name: 'Silent Story', desc: 'Wordless short-film look: soft grey world, gentle window light, eyes-only faces (no mouths), low contrast. Colour is earned through the story with desat() per shot.',
    ink: '#0d0d10', inkFar: '#2e2e36', feature: '#ffffff', rimWidth: 3, noMouth: true,
    ui: { ...UI, card: 'rgba(16,16,20,.88)', cardLine: 'rgba(255,255,255,.18)', text: '#f2f2f2', sub: '#a0a0a8', accent: '#e0443a', gold: '#f2c94c', blueprint: '#cfd8e0', bpBg: '#16181c', good: '#6fcf97' },
    grade: { contrast: 0.98, sat: 0.9, lift: [0.03, 0.03, 0.035], gamma: [1.02, 1.02, 1.03], gain: [1.0, 1.0, 1.0], vignette: 0.32, grain: 0.03, bloom: 0.35 },
    moods: {
      day:    { sky: ['#b8c4cc', '#d8dde0', '#eceeee'], ambient: '#9aa0a6', key: '#ffffff', rim: '#ffffff', wall: '#c8cacc', floor: '#9a9c9e', dark: '#4a4c50', practical: '#fff4dc', fog: '#d8dcde' },
      interiorWarm: { sky: ['#a8a8a8', '#c8c6c2', '#e2e0da'], key: '#fff4e0', rim: '#ffffff', wall: '#bdbab4', floor: '#8a8680', dark: '#3a3834', practical: '#ffe8c0', fog: '#cfcac0' },
      interiorCool: { sky: ['#9aa4ac', '#bcc4ca', '#dde2e6'], key: '#eef4ff', rim: '#ffffff', wall: '#aeb4ba', floor: '#7e8489', dark: '#33373b', practical: '#e8f0ff', fog: '#c4ccd2' },
      night:  { sky: ['#1a1e26', '#2a303a', '#3c4450'], ambient: '#3a404a', key: '#ffd9a0', rim: '#d8dde6', wall: '#3a3e46', floor: '#2a2d33', dark: '#121418', practical: '#ffcf8a', fog: '#4a525e' },
      golden: { sky: ['#8fb4d8', '#cfe0ec', '#ffe8c4'], key: '#fff0d0', rim: '#ffffff', wall: '#c8b8a4', floor: '#9a8a74', dark: '#4a4034', practical: '#ffe8c0', fog: '#e0dccf' },
    },
  },
  cinema: {
    name: 'Cinema Noir Gold', desc: 'Emotional film look: deep teal shadows, warm amber highlights, glowing practicals, heavy vignette, bloom and grain. For dramatic, story-driven pieces.',
    ink: '#06080c', inkFar: '#1e2a34', feature: '#fff4e0', rimWidth: 5,
    ui: { ...UI, card: 'rgba(6,14,20,.92)', cardLine: 'rgba(255,190,110,.35)', text: '#ffe6c4', sub: '#9ab0b8', accent: '#ff5a3c', gold: '#ffc15a', blueprint: '#7fd8e8', bpBg: '#061218', good: '#5fe8c8' },
    grade: { contrast: 1.14, sat: 1.02, lift: [0.0, 0.03, 0.05], gamma: [1.02, 1.0, 0.97], gain: [1.1, 1.0, 0.88], vignette: 0.6, grain: 0.05, bloom: 0.95 },
    moods: {
      night:  { sky: ['#03080e', '#0a1c28', '#16384a'], ambient: '#1a2a36', key: '#ffd08a', rim: '#ffb760', wall: '#1a2a34', floor: '#10181e', dark: '#05090c', practical: '#ffbe6a', fog: '#2a4a5a' },
      storm:  { sky: ['#02060a', '#0a1820', '#1a3040'], ambient: '#14222c', key: '#cfe0ff', rim: '#ffb760', wall: '#16222c', floor: '#0c141a', dark: '#04080a', practical: '#ffbe6a', fog: '#2a4050' },
      dusk:   { sky: ['#0c1a2a', '#2a4a5e', '#c8763e', '#ffc078'], key: '#ffc078', rim: '#ffc078', wall: '#24303a', floor: '#1a2228', dark: '#080c10', practical: '#ffc078', fog: '#5a6a70' },
      golden: { sky: ['#14283a', '#5a7480', '#ffb060', '#ffe0a0'], key: '#ffd090', rim: '#ffcf8a', wall: '#3a3230', floor: '#2a2420', dark: '#0c0a08', practical: '#ffd090', fog: '#8a7a68' },
      interiorWarm: { sky: ['#1a1410', '#3a2a1e', '#6a4a2e'], key: '#ffc078', rim: '#ffc078', wall: '#2e241e', floor: '#1e1814', dark: '#0a0806', practical: '#ffc078', fog: '#4a3a2a' },
      interiorCool: { sky: ['#06101a', '#0e2230', '#1a3a4c'], key: '#bfe6ff', rim: '#8fd8ff', wall: '#14222c', floor: '#0c161e', dark: '#04080c', practical: '#cfeeff', fog: '#2a4858' },
    },
  },
  aegean: {
    name: 'Aegean Day', desc: 'Bright, saturated Mediterranean daylight: azure sky, warm sandstone, golden key, crisp cream rim. Built for punchy Shorts.',
    ink: '#0c1018', inkFar: '#34405a', feature: '#fffaf0', rimWidth: 5,
    ui: { ...UI, card: 'rgba(12,30,52,.92)', cardLine: 'rgba(255,220,140,.35)', text: '#fff4dc', sub: '#c8b48a', accent: '#ff4a32', gold: '#ffd23f', blueprint: '#8fe4ff', bpBg: '#0d2c4a', good: '#5fff9a' },
    grade: { contrast: 1.07, sat: 1.18, lift: [0.05, 0.05, 0.06], gamma: [1.1, 1.08, 1.04], gain: [1.1, 1.07, 1.0], vignette: 0.18, grain: 0.012, bloom: 0.45 },
    moods: {
      dusk:   { sky: ['#2f7fd0', '#6fbdf0', '#bfe6f8', '#ffe3a8'], ambient: '#6a7a9a', key: '#fff1c8', rim: '#fff0c0', wall: '#c98d58', floor: '#9a6a44', dark: '#4a3424', practical: '#ffe7a0', fog: '#cfe6f0' },
      golden: { sky: ['#3a8ee0', '#86cdf4', '#ffe9b8'], ambient: '#7a7a90', key: '#fff3cf', rim: '#fff0c4', wall: '#d39a62', floor: '#a8784e', dark: '#553a26', practical: '#ffeab0', fog: '#d8ecf4' },
      night:  { sky: ['#0e1e48', '#23407a', '#4a6aa8'], ambient: '#3a4a70', key: '#dfe8ff', rim: '#ffd890', wall: '#3a4670', floor: '#2a3256', dark: '#141a30', practical: '#ffd890', fog: '#5a6a98' },
      storm:  { sky: ['#101a2a', '#2a3a52', '#4a5a70'], rim: '#bcd4ff' },
    },
  },
  emerald: {
    name: 'GrowKaz Emerald', desc: 'GrowKaz signature look: deep forest-green shadows, warm gold key light, electric lime rim light, rich bloom.',
    ink: '#06110c', inkFar: '#1c3328', feature: '#f2ffe8', rimWidth: 4.5,
    ui: { ...UI, card: 'rgba(8,30,22,.94)', cardLine: 'rgba(140,255,170,.28)', text: '#a8e8c0', sub: '#6fa88a', accent: '#c6ff3d', gold: '#ffd45a', blueprint: '#7dffb0', bpBg: '#061a12', good: '#c6ff3d' },
    grade: { contrast: 1.08, sat: 1.15, lift: [0.0, 0.035, 0.02], gamma: [0.96, 1.06, 0.96], gain: [1.02, 1.1, 0.88], vignette: 0.6, grain: 0.05, bloom: 0.8 },
    moods: {
      dusk: { sky: ['#0c2a22', '#1f5a44', '#7ab05a', '#f2d36a'], key: '#ffd77a', rim: '#c6ff3d', wall: '#1e3a30', floor: '#152a22', dark: '#0a1812', practical: '#ffe28a', fog: '#5a8a6a' },
      golden: { sky: ['#1a4a38', '#8ab04a', '#f6d45a'], rim: '#d8ff6a', key: '#ffd36a' },
      night: { sky: ['#03100c', '#0a2a20', '#164a36'], rim: '#7dffb0', practical: '#ffd45a', wall: '#10261e' },
      interiorWarm: { rim: '#c6ff3d', wall: '#233a2e', practical: '#ffd45a' },
      void: { sky: ['#03100c', '#08201a'], rim: '#7dffb0' },
    },
  },
  ember: {
    name: 'Ember Forge', desc: 'Charcoal-black world lit by fire: crimson shadows, molten copper rim light, hot orange glows, heavy contrast.',
    ink: '#0c0606', inkFar: '#2e1614', feature: '#fff0e0', rimWidth: 4,
    ui: { ...UI, card: 'rgba(30,12,10,.94)', cardLine: 'rgba(255,140,90,.3)', text: '#f0b49a', sub: '#a8705c', accent: '#ff3d2e', gold: '#ffa53d', blueprint: '#ff9a6a', bpBg: '#1a0806', good: '#ffc53d' },
    grade: { contrast: 1.18, sat: 1.2, lift: [0.05, 0.0, 0.0], gamma: [1.08, 0.94, 0.86], gain: [1.2, 0.95, 0.75], vignette: 0.75, grain: 0.065, bloom: 0.85 },
    moods: {
      dusk: { sky: ['#1a0606', '#5a140e', '#c8401e', '#ffa040'], key: '#ff9a4a', rim: '#ff7a2e', wall: '#3a1612', floor: '#2a100c', dark: '#140606', practical: '#ffb050', fog: '#8a3a26' },
      night: { sky: ['#0a0404', '#2a0a08', '#5a1a10'], rim: '#ff6a2e', practical: '#ffa53d', wall: '#241010' },
      golden: { sky: ['#4a1a10', '#d0602a', '#ffb860'], rim: '#ff8a3a' },
      interiorWarm: { rim: '#ff7a2e', wall: '#3a1a16' },
    },
  },
  arctic: {
    name: 'Arctic Glass', desc: 'Clean icy world: pale steel-teal shadows, crisp white key, bright cyan rim light, cool and sharp, almost no grain.',
    ink: '#08121a', inkFar: '#2a4050', feature: '#f4fdff', rimWidth: 4,
    ui: { ...UI, card: 'rgba(10,30,44,.92)', cardLine: 'rgba(160,240,255,.3)', text: '#bfefff', sub: '#7aaabf', accent: '#3de0ff', gold: '#e8fbff', blueprint: '#9af2ff', bpBg: '#071822', good: '#5fffd2' },
    grade: { contrast: 1.04, sat: 0.82, lift: [0.02, 0.05, 0.07], gamma: [0.94, 1.02, 1.08], gain: [0.92, 1.04, 1.12], vignette: 0.4, grain: 0.025, bloom: 0.65 },
    moods: {
      dusk: { sky: ['#123044', '#2e6a86', '#8ad0e0', '#e6f8ff'], key: '#eaf8ff', rim: '#7ff0ff', wall: '#2a4656', floor: '#1e3442', dark: '#0e1e28', practical: '#c8f6ff', fog: '#8ab8c8' },
      golden: { sky: ['#2a5a76', '#a0d8e8', '#f0fcff'], rim: '#a8f6ff', key: '#f4fcff' },
      night: { sky: ['#040e16', '#0c2636', '#18465a'], rim: '#5fe8ff', practical: '#e8fbff' },
      interiorWarm: { rim: '#9af2ff', wall: '#2e4a58', practical: '#e0faff' },
    },
  },
  sakura: {
    name: 'Sakura Bloom', desc: 'Dreamy rose-and-peach world: plum shadows, soft pink sky, warm peach key, glowing rose rim light, gentle haze.',
    ink: '#1a0c16', inkFar: '#4a2a40', feature: '#fff4f6', rimWidth: 5,
    ui: { ...UI, card: 'rgba(50,20,40,.9)', cardLine: 'rgba(255,170,210,.3)', text: '#ffc4dc', sub: '#c088a4', accent: '#ff5fa0', gold: '#ffd0a0', blueprint: '#ffb0d4', bpBg: '#220e1c', good: '#ffa0c8' },
    grade: { contrast: 0.95, sat: 1.05, lift: [0.07, 0.03, 0.06], gamma: [1.08, 1.0, 1.04], gain: [1.1, 0.96, 1.02], vignette: 0.35, grain: 0.05, bloom: 0.7 },
    moods: {
      dusk: { sky: ['#4a2050', '#b05a8a', '#f2a0b4', '#ffe0d0'], key: '#ffcfb0', rim: '#ffa0c8', wall: '#5a3048', floor: '#46243a', dark: '#2a1222', practical: '#ffd8c0', fog: '#d08aa8' },
      night: { sky: ['#1a0a24', '#3a1a48', '#6a3a70'], rim: '#ff9ad0', practical: '#ffc8a0' },
      golden: { sky: ['#8a4a7a', '#f2a0a0', '#ffe4c4'], rim: '#ffb4c8' },
      interiorWarm: { rim: '#ffa0c8', wall: '#5a3448' },
    },
  },
  retro: {
    name: 'Retro Print', desc: 'Vintage poster look: faded teal and mustard, sepia-warm highlights, low saturation, flat contrast, heavy print grain.',
    ink: '#1c1612', inkFar: '#4a4036', feature: '#fbf2dc', rimWidth: 5.5,
    ui: { ...UI, card: 'rgba(36,40,36,.92)', cardLine: 'rgba(230,200,140,.3)', text: '#e8d8b0', sub: '#a89878', accent: '#e8603a', gold: '#e8b83a', blueprint: '#8ac0b0', bpBg: '#1a2420', good: '#9ac06a' },
    grade: { contrast: 0.9, sat: 0.7, lift: [0.08, 0.07, 0.05], gamma: [1.06, 1.04, 0.96], gain: [1.06, 1.0, 0.86], vignette: 0.5, grain: 0.11, bloom: 0.35 },
    moods: {
      dusk: { sky: ['#2a4a48', '#5a8a80', '#e0a050', '#f2d8a0'], key: '#f2c880', rim: '#f2c070', wall: '#4a4038', floor: '#3a322c', dark: '#221c18', practical: '#f2d090', fog: '#a89070' },
      night: { sky: ['#14201e', '#24403c', '#3a5a54'], rim: '#e8c070', practical: '#e8603a' },
      golden: { sky: ['#4a7a70', '#e0a050', '#f6dca8'], rim: '#f6c87a' },
    },
  },
};
STYLES.flat = { ...STYLES.cinema, name: "Flat Vector", desc: "Clean flat-vector cartoon: true whites, no tint, faint vignette, no grain or bloom.", grade: { contrast: 1.02, sat: 1.06, lift: [0, 0, 0], gamma: [1, 1, 1], gain: [1, 1, 1], vignette: 0.12, grain: 0, bloom: 0 } };
export const STYLE_IDS = Object.keys(STYLES);
