// Procedural Canvas 2D visualizations for the five atomic models.
//
// Design notes (performance & correctness):
//  - No per-frame object allocation in the hot path; geometry is precomputed and
//    cached, recomputed only when size / element / model / zoom / pan changes.
//  - Device pixel ratio is capped (see DPR_CAP) and lowered on slower devices.
//  - Only the Bohr model animates; quantum / others are static schematics.
//  - Every diagram is drawn as a SIMPLIFIED, NOT-TO-SCALE schematic. Nothing
//    here claims to be a calculated orbital probability distribution.

import { shells as computeShells, parseSubshells, L_NAME } from '../data/chemistry.js';

export const DPR_CAP = 2;

const PALETTES = {
  light: {
    bg: '#ffffff', fg: '#1f2937', muted: '#6b7280', border: '#d6d3d1',
    nucleus: '#b45309', proton: '#dc2626', neutron: '#475569',
    electron: '#1d4ed8', positive: '#f59e0b',
    s: '#2563eb', p: '#16a34a', d: '#9333ea', f: '#db2777',
    ring: '#9ca3af', indicator: '#111827', shellLabel: '#374151'
  },
  dark: {
    bg: '#0b0f14', fg: '#e5e7eb', muted: '#9ca3af', border: '#2a313c',
    nucleus: '#f59e0b', proton: '#f87171', neutron: '#94a3b8',
    electron: '#60a5fa', positive: '#fbbf24',
    s: '#60a5fa', p: '#4ade80', d: '#c084fc', f: '#f472b6',
    ring: '#4b5563', indicator: '#e5e7eb', shellLabel: '#cbd5e1'
  }
};

// Small deterministic PRNG so scattered electrons stay put between renders.
function lcg(seed) {
  let s = (seed >>> 0) || 1;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export class Visualizer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.theme = 'light';
    this.palette = PALETTES.light;
    this.dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    this.w = 0; this.h = 0;
    this.geomDirty = true;
    this.geom = null;
    this.state = {
      element: null, modelKind: 'bohr', zoom: 1, pan: { x: 0, y: 0 },
      selected: null, pointer: { x: 0, y: 0, active: false }, playing: false
    };
  }

  setTheme(name) {
    this.theme = name === 'dark' ? 'dark' : 'light';
    this.palette = PALETTES[this.theme];
    this.geomDirty = true;
  }

  setState(patch) {
    Object.assign(this.state, patch);
    this.geomDirty = true;
  }

  // Update transform / selection / playing WITHOUT recomputing geometry
  // (used for pan, zoom, part selection, play toggle).
  patch(p) {
    Object.assign(this.state, p);
  }

  setPointer(x, y, active) {
    this.state.pointer.x = x;
    this.state.pointer.y = y;
    this.state.pointer.active = active;
  }

  invalidate() { this.geomDirty = true; }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    // Lower DPR on very high-density / large canvases to save fill cost.
    let dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    if (w * h > 900 * 900) dpr = Math.min(dpr, 1.5);
    this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.w = w; this.h = h;
    this.geomDirty = true;
  }

  // ---- geometry ---------------------------------------------------------
  computeGeometry() {
    const st = this.state;
    const el = st.element;
    const fit = Math.min(this.w, this.h) * 0.5 * 0.92;
    const cx = this.w / 2;
    const cy = this.h / 2;
    const nucR = Math.max(4, fit * 0.05);
    const g = { fit, cx, cy, nucR, kind: st.modelKind, electrons: [] };

    if (!el) return g;

    if (st.modelKind === 'dalton') {
      g.sphereR = fit * 0.62;
    } else if (st.modelKind === 'thomson') {
      g.positiveR = fit * 0.86;
      const rnd = lcg(el.z * 2654435761);
      g.thomsonElectrons = [];
      for (let i = 0; i < el.z; i++) {
        const ang = rnd() * Math.PI * 2;
        const rad = Math.sqrt(rnd()) * g.positiveR * 0.88;
        g.thomsonElectrons.push({ x: Math.cos(ang) * rad, y: Math.sin(ang) * rad });
      }
    } else if (st.modelKind === 'rutherford') {
      g.orbits = [fit * 0.42, fit * 0.66, fit * 0.9];
      g.rutherfordElectrons = [];
      const rnd = lcg(el.z * 40503 + 7);
      for (let i = 0; i < el.z; i++) {
        const oi = i % g.orbits.length;
        const ang = (i / el.z) * Math.PI * 2 + rnd() * 0.3;
        const r = g.orbits[oi];
        g.rutherfordElectrons.push({
          x: Math.cos(ang) * r, y: Math.sin(ang) * r,
          ox: Math.cos(ang), oy: Math.sin(ang), r, speed: (0.4 + 0.15 * (g.orbits.length - oi))
        });
      }
    } else if (st.modelKind === 'bohr') {
      const sh = computeShells(el.config);
      const n = sh.length;
      g.shellRadii = [];
      const rInner = fit * 0.2;
      const rOuter = fit * 0.92;
      for (let i = 0; i < n; i++) {
        const r = n === 1 ? fit * 0.55 : rInner + (rOuter - rInner) * (i / (n - 1));
        g.shellRadii.push(r);
      }
      // Precompute per-electron base angles (stable across frames).
      g.bohrElectrons = [];
      for (let i = 0; i < n; i++) {
        const count = sh[i];
        const r = g.shellRadii[i];
        const speed = 0.25 + 0.12 * (n - i); // inner shells faster
        for (let k = 0; k < count; k++) {
          g.bohrElectrons.push({ r, base: (k / count) * Math.PI * 2, speed, n: i + 1 });
        }
      }
    } else if (st.modelKind === 'quantum') {
      const subs = parseSubshells(el.config);
      g.orbitals = [];
      for (const s of subs) {
        const r = Math.min(fit * 0.92, fit * (0.14 + 0.15 * s.n));
        g.orbitals.push({ n: s.n, l: s.l, count: s.count, r, key: `${s.n}${L_NAME[s.l]}` });
      }
    }
    return g;
  }

  // ---- main render ------------------------------------------------------
  render(now) {
    if (this.w === 0 || this.h === 0) return;
    if (this.geomDirty || !this.geom) {
      this.geom = this.computeGeometry();
      this.geomDirty = false;
    }
    const ctx = this.ctx;
    const p = this.palette;
    const st = this.state;
    const g = this.geom;

    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);

    // Atom-space transform (translate to centre + pan, scale by zoom).
    const tx = g.cx + st.pan.x;
    const ty = g.cy + st.pan.y;
    ctx.save();
    ctx.translate(tx, ty);
    ctx.scale(st.zoom, st.zoom);

    const t = (now || 0) / 1000;
    const sel = st.selected;

    if (!st.element) {
      ctx.restore();
      this.drawCaption(p);
      return;
    }

    switch (g.kind) {
      case 'dalton': this.drawDalton(ctx, p, g, sel); break;
      case 'thomson': this.drawThomson(ctx, p, g, sel); break;
      case 'rutherford': this.drawRutherford(ctx, p, g, sel, t); break;
      case 'bohr': this.drawBohr(ctx, p, g, sel, t); break;
      case 'quantum': this.drawQuantum(ctx, p, g, sel); break;
    }

    ctx.restore();

    // Pointer indicator in screen space (preserves native cursor).
    if (st.pointer.active) {
      ctx.save();
      ctx.strokeStyle = p.indicator;
      ctx.globalAlpha = 0.7;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(st.pointer.x, st.pointer.y, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(st.pointer.x - 11, st.pointer.y);
      ctx.lineTo(st.pointer.x - 3, st.pointer.y);
      ctx.moveTo(st.pointer.x + 3, st.pointer.y);
      ctx.lineTo(st.pointer.x + 11, st.pointer.y);
      ctx.moveTo(st.pointer.x, st.pointer.y - 11);
      ctx.lineTo(st.pointer.x, st.pointer.y - 3);
      ctx.moveTo(st.pointer.x, st.pointer.y + 3);
      ctx.lineTo(st.pointer.x, st.pointer.y + 11);
      ctx.stroke();
      ctx.restore();
    }

    this.drawCaption(p);
  }

  drawCaption(p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.fillStyle = p.muted;
    ctx.font = '11px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('Simplified · not to scale', 10, this.h - 10);
    ctx.restore();
  }

  // ---- model renderers --------------------------------------------------
  drawNucleus(ctx, p, g, highlight) {
    if (highlight) {
      ctx.save();
      ctx.fillStyle = p.nucleus;
      ctx.globalAlpha = 0.18;
      ctx.beginPath();
      ctx.arc(0, 0, g.nucR * 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, g.nucR);
    grad.addColorStop(0, p.nucleus);
    grad.addColorStop(1, p.nucleus);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, g.nucR, 0, Math.PI * 2);
    ctx.fill();
  }

  drawDalton(ctx, p, g, sel) {
    const r = g.sphereR;
    const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    grad.addColorStop(0, p.positive);
    grad.addColorStop(1, p.nucleus);
    if (sel === 'atom') {
      ctx.save();
      ctx.strokeStyle = p.fg;
      ctx.lineWidth = 3 / this.state.zoom;
      ctx.beginPath(); ctx.arc(0, 0, r + 6 / this.state.zoom, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.max(14, r * 0.5)}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.state.element.sym, 0, 0);
    ctx.textAlign = 'start';
  }

  drawThomson(ctx, p, g, sel) {
    const R = g.positiveR;
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
    grad.addColorStop(0, p.positive);
    grad.addColorStop(1, p.nucleus);
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    if (sel === 'positive') {
      ctx.save();
      ctx.strokeStyle = p.fg; ctx.lineWidth = 3 / this.state.zoom;
      ctx.beginPath(); ctx.arc(0, 0, R + 5 / this.state.zoom, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
    // boundary
    ctx.strokeStyle = p.positive; ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1.5 / this.state.zoom;
    ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1;
    const er = Math.max(2.5, R * 0.022);
    for (const e of g.thomsonElectrons) {
      ctx.fillStyle = p.electron;
      ctx.beginPath(); ctx.arc(e.x, e.y, er, 0, Math.PI * 2); ctx.fill();
    }
    if (sel === 'electrons') {
      ctx.save(); ctx.strokeStyle = p.electron; ctx.lineWidth = 2 / this.state.zoom;
      ctx.beginPath(); ctx.arc(0, 0, R * 0.96, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    }
  }

  drawRutherford(ctx, p, g, sel, t) {
    for (const r of g.orbits) {
      ctx.strokeStyle = p.ring; ctx.globalAlpha = 0.45;
      ctx.lineWidth = 1 / this.state.zoom;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    const er = Math.max(2.5, g.fit * 0.02);
    for (const e of g.rutherfordElectrons) {
      const ang = Math.atan2(e.oy, e.ox) + (this.state.playing ? t * e.speed : 0);
      const x = Math.cos(ang) * e.r, y = Math.sin(ang) * e.r;
      ctx.fillStyle = p.electron;
      ctx.beginPath(); ctx.arc(x, y, er, 0, Math.PI * 2); ctx.fill();
    }
    this.drawNucleus(ctx, p, g, sel === 'nucleus');
  }

  drawBohr(ctx, p, g, sel, t) {
    for (let i = 0; i < g.shellRadii.length; i++) {
      const r = g.shellRadii[i];
      const isSel = sel === `shell-${i + 1}`;
      ctx.strokeStyle = isSel ? p.fg : p.ring;
      ctx.globalAlpha = isSel ? 0.9 : 0.4;
      ctx.lineWidth = (isSel ? 2.5 : 1.2) / this.state.zoom;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;
      // n label
      ctx.fillStyle = p.shellLabel;
      ctx.font = `${Math.max(9, g.fit * 0.03)}px ui-sans-serif, system-ui, sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(`n=${i + 1}`, 0, -r - g.fit * 0.025);
    }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const er = Math.max(2.5, g.fit * 0.018);
    for (const e of g.bohrElectrons) {
      const ang = e.base + (this.state.playing ? t * e.speed : 0.6);
      const x = Math.cos(ang) * e.r, y = Math.sin(ang) * e.r;
      ctx.fillStyle = p.electron;
      ctx.beginPath(); ctx.arc(x, y, er, 0, Math.PI * 2); ctx.fill();
    }
    this.drawNucleus(ctx, p, g, sel === 'nucleus');
  }

  drawQuantum(ctx, p, g, sel) {
    const colorOf = { 0: p.s, 1: p.p, 2: p.d, 3: p.f };
    ctx.save();
    for (const o of g.orbitals) {
      const isSel = sel === `orb-${o.n}-${o.l}`;
      const col = colorOf[o.l];
      const alpha = isSel ? 0.5 : 0.22;
      if (o.l === 0) {
        this.cloudBlob(ctx, 0, 0, o.r, col, alpha);
      } else if (o.l === 1) {
        const d = o.r * 0.55;
        this.cloudBlob(ctx, 0, -d, o.r * 0.7, col, alpha);
        this.cloudBlob(ctx, 0, d, o.r * 0.7, col, alpha);
      } else if (o.l === 2) {
        const d = o.r * 0.5;
        this.cloudBlob(ctx, -d, -d, o.r * 0.55, col, alpha);
        this.cloudBlob(ctx, d, -d, o.r * 0.55, col, alpha);
        this.cloudBlob(ctx, -d, d, o.r * 0.55, col, alpha);
        this.cloudBlob(ctx, d, d, o.r * 0.55, col, alpha);
      } else {
        const d = o.r * 0.5;
        for (let k = 0; k < 6; k++) {
          const a = (k / 6) * Math.PI * 2;
          this.cloudBlob(ctx, Math.cos(a) * d, Math.sin(a) * d, o.r * 0.45, col, alpha);
        }
      }
      if (isSel) {
        ctx.strokeStyle = p.fg; ctx.globalAlpha = 0.9;
        ctx.lineWidth = 2 / this.state.zoom;
        ctx.beginPath(); ctx.arc(0, 0, o.r * 1.05, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    ctx.restore();
    this.drawNucleus(ctx, p, g, sel === 'nucleus');
    // schematic label
    ctx.fillStyle = p.muted;
    ctx.font = `${Math.max(9, g.fit * 0.028)}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('schematic probability clouds', 0, g.orbitals.length ? g.fit * 0.78 : 0);
    ctx.textAlign = 'start';
  }

  cloudBlob(ctx, x, y, r, color, alpha) {
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, this.hexA(color, alpha));
    grad.addColorStop(1, this.hexA(color, 0));
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }

  hexA(hex, a) {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  // ---- hit testing (screen CSS coords) ---------------------------------
  hitTest(cssX, cssY) {
    const g = this.geom;
    if (!g || !this.state.element) return null;
    const ax = (cssX - (g.cx + this.state.pan.x)) / this.state.zoom;
    const ay = (cssY - (g.cy + this.state.pan.y)) / this.state.zoom;
    const dist = Math.hypot(ax, ay);

    if (g.kind === 'dalton') {
      return dist <= g.sphereR ? { id: 'atom', label: 'Atom (solid sphere)' } : null;
    }
    if (g.kind === 'thomson') {
      if (dist <= g.nucR * 3) return { id: 'positive', label: 'Positive charge sphere' };
      const er = Math.max(2.5, g.positiveR * 0.022) + 4 / this.state.zoom;
      for (const e of g.thomsonElectrons) {
        if (Math.hypot(ax - e.x, ay - e.y) <= er) {
          return { id: 'electrons', label: `Electrons (${this.state.element.z})` };
        }
      }
      return dist <= g.positiveR ? { id: 'positive', label: 'Positive charge sphere' } : null;
    }
    if (g.kind === 'rutherford') {
      if (dist <= g.nucR * 3) return { id: 'nucleus', label: 'Nucleus' };
      const er = Math.max(2.5, g.fit * 0.02) + 5 / this.state.zoom;
      for (const e of g.rutherfordElectrons) {
        const ang = Math.atan2(e.oy, e.ox);
        const x = Math.cos(ang) * e.r, y = Math.sin(ang) * e.r;
        if (Math.hypot(ax - x, ay - y) <= er) return { id: 'electrons', label: 'Orbiting electrons' };
      }
      return { id: 'electrons', label: 'Orbiting electrons' };
    }
    if (g.kind === 'bohr') {
      if (dist <= g.nucR * 3) return { id: 'nucleus', label: 'Nucleus' };
      for (let i = 0; i < g.shellRadii.length; i++) {
        const r = g.shellRadii[i];
        if (Math.abs(dist - r) <= Math.max(8, g.fit * 0.05)) {
          return { id: `shell-${i + 1}`, label: `Shell n=${i + 1}` };
        }
      }
      return null;
    }
    if (g.kind === 'quantum') {
      if (dist <= g.nucR * 3) return { id: 'nucleus', label: 'Nucleus' };
      let best = null, bestD = Infinity;
      for (const o of g.orbitals) {
        const d = Math.abs(dist - o.r);
        if (d <= o.r * 0.6 && d < bestD) { bestD = d; best = o; }
      }
      if (best) return { id: `orb-${best.n}-${best.l}`, label: `${best.n}${L_NAME[best.l]} orbital` };
      return null;
    }
    return null;
  }

  // Selectable parts for keyboard / focus UI.
  getParts() {
    const g = this.geom;
    const el = this.state.element;
    if (!g || !el) return [];
    if (g.kind === 'dalton') return [{ id: 'atom', label: 'Atom (solid sphere)' }];
    if (g.kind === 'thomson') return [
      { id: 'positive', label: 'Positive charge' },
      { id: 'electrons', label: `Electrons (${el.z})` }
    ];
    if (g.kind === 'rutherford') return [
      { id: 'nucleus', label: 'Nucleus' },
      { id: 'electrons', label: 'Orbiting electrons' }
    ];
    if (g.kind === 'bohr') {
      const sh = computeShells(el.config);
      return [{ id: 'nucleus', label: 'Nucleus' }].concat(
        sh.map((c, i) => ({ id: `shell-${i + 1}`, label: `Shell n=${i + 1} (${c} e⁻)` }))
      );
    }
    if (g.kind === 'quantum') {
      const subs = parseSubshells(el.config);
      return [{ id: 'nucleus', label: 'Nucleus' }].concat(
        subs.map((s) => ({ id: `orb-${s.n}-${s.l}`, label: `${s.n}${L_NAME[s.l]} orbital (${s.count} e⁻)` }))
      );
    }
    return [];
  }
}
