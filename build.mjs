// Build script for the Atomic Model Explorer.
// No external dependencies — uses only Node built-ins.
//
//   node build.mjs [--base-url https://user.github.io/repo/] [--out dist]
//
// Outputs a fully static site (HTML/CSS/JS/data + pre-rendered element & model
// pages + service worker + sitemap/robots/manifest) and reports measured sizes.

import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, rmSync, statSync, readdirSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

import { ELEMENTS } from './src/data/elements.js';
import { shells as computeShells } from './src/data/chemistry.js';
import { MODELS } from './src/js/models.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname);

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const BASE_URL = (arg('--base-url', 'https://example.com/atomic-model-explorer/')).replace(/\/+$/, '/');
const OUT = join(root, arg('--out', 'dist'));

const VERSION = '1.0.0';
const PLACEHOLDER = 'https://example.com/atomic-model-explorer/';

const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const supNum = (n) => String(n).split('').map((c) => SUP[c] || c).join('');

function read(rel) { return readFileSync(join(root, rel), 'utf8'); }
function write(rel, content) {
  const p = join(OUT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
}
function copy(rel) {
  const src = join(root, rel);
  const dst = join(OUT, rel.replace(/^src\//, ''));
  mkdirSync(dirname(dst), { recursive: true });
  cpSync(src, dst, { recursive: true });
}

// ---- SVG Bohr-schematic for static element pages -----------------------
function bohrSVG(el) {
  const sh = computeShells(el.config);
  const n = sh.length;
  const cx = 50, cy = 50;
  const rInner = 10, rOuter = 46;
  const W = 240, H = 240;
  let svg = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" ` +
    `aria-label="Simplified Bohr-style diagram of ${el.name}, not to scale" ` +
    `style="max-width:480px;height:auto;display:block;margin:0 auto">`;
  svg += `<rect width="${W}" height="${H}" fill="transparent"/>`;
  for (let i = 0; i < n; i++) {
    const r = n === 1 ? (rInner + rOuter) / 2 : rInner + (rOuter - rInner) * (i / (n - 1));
    svg += `<circle cx="${cx*W/100}" cy="${cy*H/100}" r="${r*W/100}" fill="none" stroke="#9ca3af" stroke-width="1"/>`;
    const count = sh[i];
    for (let k = 0; k < count; k++) {
      const a = (k / count) * Math.PI * 2;
      const ex = (cx + Math.cos(a) * r) * W / 100;
      const ey = (cy + Math.sin(a) * r) * H / 100;
      svg += `<circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="2.4" fill="#1d4ed8"/>`;
    }
    svg += `<text x="${(cx)*W/100}" y="${(cy - r)*H/100 - 2}" font-size="7" fill="#6b7280" text-anchor="middle">n=${i+1}</text>`;
  }
  svg += `<circle cx="${cx*W/100}" cy="${cy*H/100}" r="5" fill="#b45309"/>`;
  svg += `<text x="${cx*W/100}" y="${cy*H/100+3}" font-size="6" fill="#fff" text-anchor="middle">${el.sym}</text>`;
  svg += `</svg>`;
  return svg;
}

// ---- element page -----------------------------------------------------
function elementPage(el) {
  const sh = computeShells(el.config);
  const neutrons = el.iso - el.z;
  const isoLine = `Isotope ${supNum(el.iso)}${el.sym} (mass number ${el.iso}): ${el.z} proton(s) + ${neutrons} neutron(s) — an explicitly chosen isotope, never derived by rounding the atomic weight.`;
  const notes = MODELS.map((m) => (
    `<h3>${m.name} (${m.year})</h3>` +
    `<p>${m.principle}</p>` +
    `<p><strong>For ${el.name}:</strong> ${m.note(el)}</p>` +
    `<p><strong>Why it falls short:</strong> ${m.limitation}</p>`
  )).join('\n');
  const links = MODELS.map((m) =>
    `<a href="../index.html#el=${el.sym}&amp;m=${m.id}">${m.name.split('—')[0].trim()}</a>`
  ).join(' · ');
  const jsonld = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ChemicalSubstance',
    name: el.name,
    alternateName: el.sym,
    identifier: { '@type': 'PropertyValue', name: 'Atomic number', value: el.z },
    description: `Electron configuration ${el.config}; electrons per shell ${sh.join(', ')}.`
  });

  let html = read('src/templates/element.html');
  const kToC = k => k==null ? '—' : `${(k-273.15).toFixed(1)}°C / ${k}K`;
  html = html
    .replaceAll('{{TITLE}}', `${el.name} (${el.sym}) — Atomic Model Explorer`)
    .replaceAll('{{DESC}}', `Facts and simplified atomic-model diagrams for ${el.name} (${el.sym}, atomic number ${el.z}): electron configuration ${el.config}, electrons per shell ${sh.join(', ')}, and how Dalton, Thomson, Rutherford, Bohr and the quantum model describe it.`)
    .replaceAll('{{CANONICAL}}', BASE_URL + `elements/${el.z}-${el.sym}.html`)
    .replaceAll('{{SYM}}', el.sym)
    .replaceAll('{{NAME}}', el.name)
    .replaceAll('{{Z}}', String(el.z))
    .replaceAll('{{MASS}}', el.mass)
    .replaceAll('{{CONFIG}}', el.config)
    .replaceAll('{{SHELLS}}', sh.join(', '))
    .replaceAll('{{CAT}}', el.cat)
    .replaceAll('{{GROUP}}', el.group ?? '—')
    .replaceAll('{{PERIOD}}', String(el.period))
    .replaceAll('{{BLOCK}}', el.block)
    .replaceAll('{{PHASE}}', el.phase || '—')
    .replaceAll('{{APPEARANCE}}', el.appearance || '—')
    .replaceAll('{{DENSITY}}', el.density!=null ? `${el.density} g/cm³` : '—')
    .replaceAll('{{MELT}}', kToC(el.melt))
    .replaceAll('{{BOIL}}', kToC(el.boil))
    .replaceAll('{{EN}}', el.electronegativity!=null ? String(el.electronegativity) : '—')
    .replaceAll('{{DISCOVERED}}', el.discoveredBy || '—')
    .replaceAll('{{SUMMARY}}', el.summary || '—')
    .replaceAll('{{ISOTOPE_LINE}}', isoLine)
    .replaceAll('{{SVG}}', bohrSVG(el))
    .replaceAll('{{MODEL_NOTES}}', notes)
    .replaceAll('{{LINKS}}', links)
    .replaceAll('{{JSONLD}}', jsonld);
  return { html, file: `${el.z}-${el.sym}.html` };
}

// ---- model page -------------------------------------------------------
function modelPage(m) {
  const examples = ['H', 'C', 'Fe', 'U', 'Og'].map((sym) => {
    const el = ELEMENTS.find((e) => e.sym === sym);
    return `<a href="../elements/${el.z}-${el.sym}.html">${el.name}</a>`;
  }).join(' · ');
  const jsonld = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: m.name,
    description: m.principle
  });
  let html = read('src/templates/model.html');
  html = html
    .replaceAll('{{TITLE}}', `${m.name} — Atomic Model Explorer`)
    .replaceAll('{{DESC}}', `${m.name} (${m.year}): ${m.principle} ${m.limitation}`)
    .replaceAll('{{CANONICAL}}', BASE_URL + `models/${m.id}.html`)
    .replaceAll('{{ID}}', m.id)
    .replaceAll('{{NAME}}', m.name)
    .replaceAll('{{YEAR}}', m.year)
    .replaceAll('{{PRINCIPLE}}', m.principle)
    .replaceAll('{{SIGNIFICANCE}}', m.significance)
    .replaceAll('{{LIMITATION}}', m.limitation)
    .replaceAll('{{EXAMPLES}}', examples)
    .replaceAll('{{JSONLD}}', jsonld);
  return { html, file: `${m.id}.html` };
}

// ---- run --------------------------------------------------------------
function main() {
  if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });

  // Copy static assets
  copy('src/css/styles.css');
  copy('src/js');
  copy('src/data');
  copy('src/assets');
  copy('src/sw.js');

  // Build index.html
  const options = ELEMENTS.map((e) =>
    `<option value="${e.z} · ${e.sym} · ${e.name}"></option>`
  ).join('\n        ');
  let index = read('src/templates/index.html');
  index = index
    .replaceAll('<!--ELEMENT_OPTIONS-->', options)
    .replaceAll('<!--APP_VERSION-->', VERSION)
    .replaceAll(PLACEHOLDER, BASE_URL);
  write('index.html', index);

  // Element + model pages
  const urls = [BASE_URL];
  for (const el of ELEMENTS) {
    const { html, file } = elementPage(el);
    write(`elements/${file}`, html);
    urls.push(BASE_URL + `elements/${file}`);
  }
  for (const m of MODELS) {
    const { html, file } = modelPage(m);
    write(`models/${file}`, html);
    urls.push(BASE_URL + `models/${file}`);
  }

  // Manifest with real icons
  const manifest = {
    name: 'Atomic Model Explorer',
    short_name: 'Atomic Models',
    description: 'Interactive explorer of the five major atomic models for all 118 elements with images, properties and periodic table locator.',
    start_url: './index.html',
    scope: './',
    display: 'standalone',
    background_color: '#fcfcfd',
    theme_color: '#4f46e5',
    icons: [
      { src: './assets/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: './assets/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      { src: './assets/apple-touch-icon.png', sizes: '180x180', type: 'image/png', purpose: 'any' },
      { src: './assets/favicon-32.png', sizes: '32x32', type: 'image/png', purpose: 'any' }
    ]
  };
  write('manifest.webmanifest', JSON.stringify(manifest, null, 2));

  // Robots + sitemap
  write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${BASE_URL}sitemap.xml\n`);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n') + `\n</urlset>\n`;
  write('sitemap.xml', sitemap);

  write('.nojekyll', '');

  // Browser test harness (emitted at the site root so the service-worker scope
  // resolves correctly). Needs the local server / SW context to run.
  write('browser-tests.html', read('src/tests/browser.test.html'));

  report();
}

function report() {
  // Essential payload = index.html + css + all js + sw + manifest (excludes
  // pre-rendered pages, which count as optional cached content).
  const essential = [
    'index.html', 'css/styles.css', 'js/app.js', 'js/viz.js', 'js/models.js',
    'js/sw-register.js', 'data/elements.js', 'data/chemistry.js',
    'sw.js', 'manifest.webmanifest'
  ];
  let raw = 0, gz = 0;
  const sizes = [];
  for (const f of essential) {
    const buf = readFileSync(join(OUT, f));
    const g = gzipSync(buf);
    raw += buf.length; gz += g.length;
    sizes.push({ f, raw: buf.length, gz: g.length });
  }
  // total dist size
  let total = 0;
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p); else total += statSync(p).size;
    }
  };
  walk(OUT);

  console.log('\n=== Atomic Model Explorer — build complete ===');
  console.log(`Output: ${OUT}`);
  console.log(`Pages: index + ${ELEMENTS.length} elements + ${MODELS.length} models`);
  console.log('\nEssential payload (HTML+CSS+JS+data+SW+manifest):');
  for (const s of sizes) {
    console.log(`  ${s.f.padEnd(22)} raw ${String(s.raw).padStart(7)} B  gzip ${String(s.gz).padStart(7)} B`);
  }
  console.log(`\n  Essential raw : ${(raw/1024).toFixed(1)} KB`);
  console.log(`  Essential gzip: ${(gz/1024).toFixed(1)} KB  (budget < 200 KB)`);
  console.log(`  Total dist    : ${(total/1024).toFixed(1)} KB (includes optional pre-rendered pages)`);
  console.log(gz < 200 * 1024 ? '\n  ✓ Essential payload is under the 200 KB compressed budget.' : '\n  ✗ Essential payload EXCEEDS 200 KB budget!');
}

main();
