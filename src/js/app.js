// Atomic Model Explorer — main application logic.
// Vanilla JS, no framework. Wires element selection, model switching, the
// procedural visualizer, pointer/touch/keyboard input, theming, deep links and
// on-demand rendering.

import { ELEMENTS, byZ, bySym } from '../data/elements.js';
import { MODELS, modelById } from './models.js';
import { Visualizer } from './viz.js';
import { shells as computeShells, parseSubshells } from '../data/chemistry.js';
import { registerServiceWorker } from './sw-register.js';

const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
function supNum(n) { return String(n).split('').map((c) => SUP[c] || c).join(''); }

const state = {
  element: byZ(6),          // default: Carbon
  model: modelById('bohr'),
  zoom: 1,
  pan: { x: 0, y: 0 },
  selected: null,
  playing: true,
  showIsotope: false
};

// ---- DOM refs ----------------------------------------------------------
const $ = (id) => document.getElementById(id);
const canvas = $('viz');
const viz = new Visualizer(canvas);

// ---- rendering lifecycle ----------------------------------------------
let animating = false;
let rafId = null;
let visible = true;
let docHidden = document.hidden;
let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function shouldAnimate() {
  return state.playing && state.model.kind === 'bohr' && visible && !docHidden && !reducedMotion;
}

function frame(now) {
  if (!animating) return;
  viz.render(now);
  rafId = requestAnimationFrame(frame);
}

function startAnim() {
  if (animating || !shouldAnimate()) return;
  animating = true;
  rafId = requestAnimationFrame(frame);
}

function stopAnim() {
  animating = false;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
}

function renderOnce() {
  if (animating) return;
  const now = performance.now();
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => viz.render(now), { timeout: 120 });
  } else {
    requestAnimationFrame(() => viz.render(now));
  }
}

// Push app state to the visualizer and refresh UI / loop.
function sync(rerender = true) {
  viz.setState({
    element: state.element,
    modelKind: state.model.kind,
    zoom: state.zoom,
    pan: state.pan,
    selected: state.selected,
    playing: state.playing
  });
  updateInfo();
  buildParts();
  updateAria();
  if (shouldAnimate()) startAnim(); else { stopAnim(); if (rerender) renderOnce(); }
}

// ---- element selection -------------------------------------------------
function findElement(q) {
  q = (q || '').trim();
  if (!q) return null;
  // Accept the combined "Z · Symbol · Name" value produced by selection.
  const parts = q.split('·').map((s) => s.trim());
  if (parts.length >= 2) {
    const e2 = bySym(parts[1]);
    if (e2) return e2;
  }
  if (/^\d+$/.test(q)) return byZ(Number(q)) || null;
  const ql = q.toLowerCase();
  // exact symbol
  let e = bySym(q);
  if (e) return e;
  // prefix symbol
  e = ELEMENTS.find((x) => x.sym.toLowerCase() === ql);
  if (e) return e;
  e = ELEMENTS.find((x) => x.sym.toLowerCase().startsWith(ql));
  if (e) return e;
  // name
  e = ELEMENTS.find((x) => x.name.toLowerCase() === ql);
  if (e) return e;
  e = ELEMENTS.find((x) => x.name.toLowerCase().startsWith(ql));
  if (e) return e;
  return null;
}

const searchInput = $('element-search');
searchInput.addEventListener('change', () => {
  const e = findElement(searchInput.value);
  if (e) selectElement(e);
  else searchInput.setAttribute('aria-invalid', 'true');
});
searchInput.addEventListener('input', () => searchInput.removeAttribute('aria-invalid'));

$('element-random').addEventListener('click', () => {
  const e = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
  selectElement(e);
});

function selectElement(e) {
  state.element = e;
  state.selected = null;
  searchInput.value = `${e.z} · ${e.sym} · ${e.name}`;
  searchInput.setAttribute('aria-invalid', 'false');
  sync();
  updateSelectionInfo();
  writeHash();
}

// ---- model switching (radiogroup) -------------------------------------
const modelBtns = Array.from(document.querySelectorAll('.model-btn'));
function selectModel(id) {
  const m = modelById(id);
  state.model = m;
  state.selected = null;
  state.playing = (m.kind === 'bohr') && !reducedMotion; // animate only Bohr, and only if motion allowed
  modelBtns.forEach((b) => {
    const on = b.dataset.model === id;
    b.setAttribute('aria-checked', on ? 'true' : 'false');
    b.tabIndex = on ? 0 : -1;
  });
  updatePlayButton();
  sync();
  updateSelectionInfo();
  writeHash();
}
modelBtns.forEach((b, i) => {
  b.addEventListener('click', () => selectModel(b.dataset.model));
  b.addEventListener('keydown', (ev) => {
    let idx = i;
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') idx = (i + 1) % modelBtns.length;
    else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') idx = (i - 1 + modelBtns.length) % modelBtns.length;
    else if (ev.key === 'Home') idx = 0;
    else if (ev.key === 'End') idx = modelBtns.length - 1;
    else return;
    ev.preventDefault();
    modelBtns[idx].focus();
    selectModel(modelBtns[idx].dataset.model);
  });
});

// ---- play / pause / zoom / reset controls -----------------------------
const playBtn = $('play-pause');
function updatePlayButton() {
  const bohr = state.model.kind === 'bohr';
  playBtn.disabled = !bohr;
  playBtn.setAttribute('aria-pressed', state.playing ? 'true' : 'false');
  playBtn.querySelector('.label').textContent = state.playing ? 'Pause' : 'Play';
  playBtn.setAttribute('aria-label', state.playing ? 'Pause animation' : 'Play animation');
}
playBtn.addEventListener('click', () => {
  state.playing = !state.playing;
  updatePlayButton();
  viz.patch({ playing: state.playing });
  if (shouldAnimate()) startAnim(); else { stopAnim(); renderOnce(); }
});

const ZMIN = 0.5, ZMAX = 4;
function setZoom(z, cx, cy) {
  z = Math.max(ZMIN, Math.min(ZMAX, z));
  const rect = canvas.getBoundingClientRect();
  const px = cx == null ? rect.width / 2 : cx;
  const py = cy == null ? rect.height / 2 : cy;
  const g = viz.geom;
  const ox = (px - (g.cx + state.pan.x)) / state.zoom;
  const oy = (py - (g.cy + state.pan.y)) / state.zoom;
  state.pan.x = px - g.cx - ox * z;
  state.pan.y = py - g.cy - oy * z;
  state.zoom = z;
  clampPan();
  viz.patch({ zoom: state.zoom, pan: state.pan });
  renderOnce();
}
$('zoom-in').addEventListener('click', () => setZoom(state.zoom * 1.25));
$('zoom-out').addEventListener('click', () => setZoom(state.zoom / 1.25));
$('zoom-reset').addEventListener('click', resetView);

function resetView() {
  state.zoom = 1;
  state.pan = { x: 0, y: 0 };
  clampPan();
  viz.patch({ zoom: state.zoom, pan: state.pan });
  renderOnce();
}

function clampPan() {
  const rect = canvas.getBoundingClientRect();
  const lim = Math.max(rect.width, rect.height) * 0.6;
  state.pan.x = Math.max(-lim, Math.min(lim, state.pan.x));
  state.pan.y = Math.max(-lim, Math.min(lim, state.pan.y));
}

// ---- selectable parts (keyboard + click/tap) --------------------------
const partsBox = $('parts');
function buildParts() {
  const parts = viz.getParts();
  partsBox.innerHTML = '';
  if (!parts.length) { partsBox.hidden = true; return; }
  partsBox.hidden = false;
  const label = document.createElement('span');
  label.className = 'parts-label';
  label.textContent = 'Inspect:';
  partsBox.appendChild(label);
  for (const part of parts) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'part-btn';
    btn.dataset.part = part.id;
    btn.textContent = part.label;
    btn.setAttribute('aria-pressed', state.selected === part.id ? 'true' : 'false');
    // Selecting on focus gives keyboard users the same feedback as mouse/tap.
    btn.addEventListener('focus', () => selectPart(part.id, part.label));
    btn.addEventListener('click', () => selectPart(part.id, part.label));
    partsBox.appendChild(btn);
  }
}
function highlightParts() {
  for (const btn of partsBox.querySelectorAll('.part-btn')) {
    btn.setAttribute('aria-pressed', state.selected === btn.dataset.part ? 'true' : 'false');
  }
}

function selectPart(id, label) {
  state.selected = id;
  viz.patch({ selected: id });
  highlightParts();
  updateSelectionInfo(label);
  renderOnce();
  updateAria();
}

function updateSelectionInfo(label) {
  const el = state.element;
  const box = $('selection-info');
  box.textContent = '';
  const h = document.createElement('h3');
  h.textContent = label || 'Selection';
  box.appendChild(h);
  const p = document.createElement('p');
  p.id = 'selection-text';
  box.appendChild(p);
  const sel = state.selected;
  if (sel === 'nucleus' || sel === 'atom') {
    if (sel === 'atom') {
      p.textContent = `${el.name} shown as a single indivisible sphere — Dalton’s useful but outdated abstraction.`;
    } else {
      const n = el.iso - el.z;
      p.textContent = `Nucleus of ${supNum(el.iso)}${el.sym} (mass number ${el.iso}): ${el.z} proton(s) and ${n} neutron(s). It holds almost all of the atom’s mass.`;
    }
  } else if (sel === 'electrons') {
    p.textContent = `Electrons (${el.z}). In this model they are shown as point particles; the true quantum description replaces fixed paths with probability distributions.`;
  } else if (sel === 'positive') {
    p.textContent = `The diffuse positive charge of the atom, with ${el.z} electrons embedded — Thomson’s neutral "plum pudding".`;
  } else if (sel && sel.startsWith('shell-')) {
    const n = Number(sel.split('-')[1]);
    const sh = shellsOf(el);
    p.textContent = `Shell n=${n} holds ${sh[n - 1]} electron(s) in fixed circular orbits. This is a teaching simplification, not the modern quantum picture.`;
  } else if (sel && sel.startsWith('orb-')) {
    const [, ns, ls] = sel.split('-');
    const subs = subsOf(el).find((s) => String(s.n) === ns && String(s.l) === ls);
    const lname = { 0: 's', 1: 'p', 2: 'd', 3: 'f' }[Number(ls)];
    p.textContent = `${ns}${lname} orbital: ${subs ? subs.count : '?'} electron(s). Shown as a schematic probability cloud; exact shapes need quantum-chemistry calculations.`;
  } else {
    p.textContent = 'Tap, click, or focus a part of the model to learn what it represents.';
  }
}

// ---- canvas pointer / touch / pen handling ----------------------------
const pointers = new Map();
let pinch = null;
let dragStart = null;

canvas.addEventListener('pointerdown', (e) => {
  try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left, y = e.clientY - rect.top;
  viz.setPointer(x, y, true);
  if (pointers.size === 2) {
    const pts = [...pointers.values()];
    pinch = { d: dist(pts[0], pts[1]), zoom: state.zoom };
    dragStart = null;
  } else {
    dragStart = { x: e.clientX, y: e.clientY, px: x, py: y, pan: { ...state.pan }, moved: false };
  }
});

canvas.addEventListener('pointermove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left, y = e.clientY - rect.top;
  if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  viz.setPointer(x, y, true);

  if (pointers.size === 2 && pinch) {
    const pts = [...pointers.values()];
    const d = dist(pts[0], pts[1]);
    const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
    const rect2 = canvas.getBoundingClientRect();
    setZoom(pinch.zoom * (d / pinch.d), mid.x - rect2.left, mid.y - rect2.top);
    return;
  }
  if (dragStart && pointers.size === 1) {
    const dx = e.clientX - dragStart.x, dy = e.clientY - dragStart.y;
    if (Math.hypot(dx, dy) > 4) dragStart.moved = true;
    if (dragStart.moved) {
      state.pan.x = dragStart.pan.x + dx;
      state.pan.y = dragStart.pan.y + dy;
      clampPan();
      viz.patch({ pan: state.pan });
      renderOnce();
    }
  }
});

function endPointer(e) {
  const wasDrag = dragStart && dragStart.moved;
  if (!wasDrag && pointers.size === 1) {
    const rect = canvas.getBoundingClientRect();
    const hit = viz.hitTest(e.clientX - rect.left, e.clientY - rect.top);
    if (hit) selectPart(hit.id, hit.label);
  }
  pointers.delete(e.pointerId);
  if (pointers.size < 2) pinch = null;
  if (pointers.size === 0) dragStart = null;
  if (canvas.hasPointerCapture && canvas.hasPointerCapture(e.pointerId)) {
    try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
  }
  if (pointers.size === 0) { viz.setPointer(0, 0, false); renderOnce(); }
}
canvas.addEventListener('pointerup', endPointer);
canvas.addEventListener('pointercancel', (e) => {
  pointers.delete(e.pointerId);
  pinch = null; dragStart = null;
  viz.setPointer(0, 0, false);
  renderOnce();
});
canvas.addEventListener('pointerleave', () => {
  if (pointers.size === 0) { viz.setPointer(0, 0, false); renderOnce(); }
});
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
  setZoom(state.zoom * factor, e.clientX - rect.left, e.clientY - rect.top);
}, { passive: false });

function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

// ---- theme ------------------------------------------------------------
const themeBtn = $('theme-toggle');
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('ame-theme', theme); } catch (_) {}
  viz.setTheme(theme);
  sync(false);
}
themeBtn.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  applyTheme(cur === 'dark' ? 'light' : 'dark');
});

// ---- info panel -------------------------------------------------------
function shellsOf(el) {
  return computeShells(el.config);
}
function subsOf(el) {
  return parseSubshells(el.config);
}

function updateInfo() {
  const el = state.element;
  const m = state.model;
  $('el-number').textContent = el.z;
  const symEl = $('el-symbol');
  symEl.textContent = el.sym;
  symEl.style.background = `var(--chip-${el.cat})`;
  symEl.style.color = `var(--chip-${el.cat}-fg)`;
  $('el-name').textContent = el.name;
  $('el-mass').textContent = el.mass.startsWith('[') ? `${el.mass} (most stable isotope)` : el.mass;
  $('el-config').textContent = m.kind === 'dalton'
    ? '— (Dalton model has no internal structure)'
    : el.config;
  const sh = shellsOf(el);
  $('el-shells').textContent = sh.join(', ');
  const neutrons = el.iso - el.z;
  const isoText = `Isotope ${supNum(el.iso)}${el.sym} (mass number ${el.iso}): ${el.z} protons + ${neutrons} neutrons.`;
  $('el-isotope').textContent = isoText + (state.showIsotope ? '' : ' Neutron count shown for an explicitly chosen isotope, never by rounding the atomic weight.');

  $('model-title').textContent = `${m.name} (${m.year})`;
  $('model-principle').textContent = m.principle;
  $('model-significance').textContent = m.significance;
  $('model-limitation').textContent = m.limitation;
  $('model-note').textContent = m.note(el);
}

function updateAria() {
  const el = state.element, m = state.model;
  const label = `Atomic model explorer. ${m.name}. Element ${el.name}, symbol ${el.sym}, atomic number ${el.z}.` +
    (state.selected ? ` Selected: ${state.selected}.` : '');
  canvas.setAttribute('aria-label', label);
  const desc = $('viz-desc');
  if (desc) {
    desc.textContent = `${m.name} schematic of ${el.name}. ${m.limitation} ${m.note(el)}`;
  }
}

// ---- deep linking -----------------------------------------------------
function writeHash() {
  const h = `#el=${encodeURIComponent(state.element.sym)}&m=${state.model.id}`;
  history.replaceState(null, '', h);
}
function readHash() {
  const h = location.hash.replace(/^#/, '');
  if (!h) return;
  const params = new URLSearchParams(h);
  const sym = params.get('el');
  const mid = params.get('m');
  if (mid && modelById(mid)) { /* will set below */ }
  const e = sym ? bySym(sym) : null;
  if (e) { state.element = e; searchInput.value = `${e.z} · ${e.sym} · ${e.name}`; }
  if (mid && modelById(mid)) { state.model = modelById(mid); }
}

// ---- lifecycle: visibility, intersection, resize, motion ---------------
const io = new IntersectionObserver((entries) => {
  visible = entries[0].isIntersecting;
  if (visible) { if (shouldAnimate()) startAnim(); else renderOnce(); }
  else stopAnim();
}, { threshold: 0.01 });
io.observe(canvas);

document.addEventListener('visibilitychange', () => {
  docHidden = document.hidden;
  if (docHidden) stopAnim();
  else if (shouldAnimate()) startAnim(); else renderOnce();
});

const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
mq.addEventListener('change', (e) => {
  reducedMotion = e.matches;
  state.playing = (state.model.kind === 'bohr') && !reducedMotion;
  updatePlayButton();
  sync();
});

const ro = new ResizeObserver(() => { viz.resize(); renderOnce(); });
ro.observe(canvas);
window.addEventListener('orientationchange', () => { setTimeout(() => { viz.resize(); renderOnce(); }, 200); });

// ---- boot -------------------------------------------------------------
function boot() {
  let theme = 'light';
  try { theme = localStorage.getItem('ame-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); } catch (_) {}
  document.documentElement.setAttribute('data-theme', theme);
  viz.setTheme(theme);

  readHash();
  // initialise model buttons
  modelBtns.forEach((b) => {
    const on = b.dataset.model === state.model.id;
    b.setAttribute('aria-checked', on ? 'true' : 'false');
    b.tabIndex = on ? 0 : -1;
  });
  state.playing = (state.model.kind === 'bohr') && !reducedMotion;
  updatePlayButton();
  if (state.element && !searchInput.value) searchInput.value = `${state.element.z} · ${state.element.sym} · ${state.element.name}`;

  viz.resize();
  sync(false);
  if (shouldAnimate()) startAnim(); else renderOnce();
  writeHash();
  registerServiceWorker();
}

// Expose a minimal debug/test handle (harmless in production).
window.AME = { state, viz, selectModel, selectElement, selectPart, sync };

function autoBoot() {
  if (!document.getElementById('viz')) return; // not the interactive app page
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
}
autoBoot();
