# Atomic Model Explorer

An interactive, offline-capable browser app for exploring the five major atomic
models — **Dalton, Thomson, Rutherford, Bohr, and the quantum-mechanical model**
— across all **118 elements**.

- **Live demo:** https://mahimmazidul.github.io/AtomicModels/
- **Issues:** https://github.com/mahimmazidul/AtomicModels/issues

**Status:** production-ready · zero runtime dependencies · essential payload ~26 KB
gzipped · works offline after first load.

---

## Why this exists

Atomic models are foundational to chemistry and physics, but most interactive
explainers either over-simplify (implying electrons really orbit like planets) or
over-complicate. This tool stays honest: every visualization is a **simplified,
not-to-scale schematic**, and wherever a model cannot accurately describe an
element, the UI says so instead of faking a precise simulation.

## Features

- **Five models** with concise, accessible explanations of principles, historical
  significance, and limitations.
- **Searchable element selector** for all 118 elements (by name, symbol, or
  atomic number). Neutral atoms by default.
- **Per-element facts:** atomic number, symbol, name, IUPAC standard atomic
  weight, electron configuration, and electrons per shell.
- **Procedural Canvas 2D visualizations** — solid sphere, plum pudding, nuclear,
  Bohr quantised orbits, and schematic quantum probability clouds — each clearly
  labelled as simplified.
- **Explicit isotopes:** when a neutron count is shown, a real, named isotope is
  chosen (e.g. ¹²C). The standard atomic weight is never rounded to derive
  neutrons.
- **Responsive & mobile-first** down to 320 px; works in landscape, tablet, and
  desktop with no horizontal scrolling.
- **Pointer Events** (mouse / touch / pen) with accurate hit testing, a small
  contextual pointer indicator, visible hover/focus, and zoom/pan with button
  alternatives.
- **Accessible:** keyboard-operable controls, a `role="radiogroup"` model switch,
  visible focus states, crawlable educational text, `aria-live` selection info,
  reduced-motion support, and light/dark themes.
- **Offline:** a versioned service worker caches the app after first load. No
  runtime APIs, no third-party scripts, no tracking.

## Scientific honesty

- **Bohr shells** (n = 1, 2, 3 …) are clearly distinguished from real **quantum
  orbitals** (s, p, d, f). Electrons on classical circular paths appear only for
  the historical Bohr/Rutherford models, with explicit notes that this is a
  teaching simplification — not the modern description.
- **Quantum clouds** are schematic translucent shapes, not calculated orbital
  probability distributions. The UI states that many-electron atoms require
  numerical quantum-chemistry methods.
- **Electron configurations** use the ground-state arrangement, including the
  well-known anomalous configurations (Cr, Cu, Nb, Mo, Ru, Rh, Pd, Ag, La, Ce,
  Gd, Pt, Au, Ac, Th, Pa, U, Np, Cm, Lr).
- Data shown for a "representative isotope" is explicitly identified; neutron
  counts are `mass number − atomic number` for that named isotope only.

## Tech stack

- Semantic HTML, CSS custom properties, and **vanilla JavaScript (ES modules)**.
- **Canvas 2D** for all visualizations; no frameworks, no 3D engines, no external
  assets, no CDN.
- A **versioned service worker** for offline use; system fonts only.
- **Static-first build** that pre-renders an index page plus 118 element pages
  and 5 model pages for SEO.

## Quick start

```bash
git clone https://github.com/mahimmazidul/AtomicModels.git
cd AtomicModels
node build.mjs            # -> produces dist/
node serve.mjs 8080       # serve dist/ at http://localhost:8080
```

Open `http://localhost:8080/` for the app, and
`http://localhost:8080/browser-tests.html` for the in-browser test suite.

## Scripts

| Command | Description |
| --- | --- |
| `node build.mjs` | Build the static site into `dist/` (pre-renders element/model pages, sitemap, robots, manifest). |
| `node build.mjs --base-url "https://you.github.io/repo/"` | Set absolute URLs for canonical/sitemap. |
| `node build.mjs --out docs` | Emit to `docs/` instead of `dist/`. |
| `node serve.mjs [port]` | Zero-dependency local dev server. |
| `node --test tests/` | Data-integrity, chemistry, model-logic, and bundle-size tests. |

## Project structure

```
AtomicModels/
├── build.mjs                  # zero-dependency build + page generator + size report
├── serve.mjs                  # zero-dependency local server
├── src/
│   ├── data/                  # elements.js (118 entries) + chemistry.js (pure helpers)
│   ├── js/                    # app.js, viz.js, models.js, sw-register.js
│   ├── css/styles.css         # responsive, themed, accessible stylesheet
│   ├── sw.js                  # versioned offline service worker
│   ├── templates/             # index.html, element.html, model.html
│   └── tests/browser.test.html
├── tests/                     # Node tests (data, chemistry, size)
└── dist/                      # build output (this is what gets deployed)
```

## Deployment (GitHub Pages)

The repository includes a GitHub Actions workflow that builds `dist/` and deploys
it to GitHub Pages. To activate:

1. Go to **Settings → Pages → Build and deployment → Source → "GitHub Actions"**
   and save.
2. Re-run the latest workflow (Actions tab) so it deploys.

Alternatively, build into `docs/` (`node build.mjs --out docs`), commit it, and set
Pages source to the `docs` branch/folder.

## Data sources & limitations

- **Element data:** IUPAC standard atomic weights and standard ground-state
  electron configurations. Synthetic elements show the most-studied/longest-lived
  isotope mass in `[brackets]`.
- **Visualizations are educational schematics**, not to scale, and not physical
  simulations of quantum behaviour.
- **Pre-rendered pages** are "optional cached content"; only the interactive app
  payload counts against the 200 KB budget.
- **Browser support:** modern evergreen browsers (Chrome, Edge, Firefox, Safari 16+)
  with ES modules, Canvas 2D, Pointer Events, `IntersectionObserver`,
  `ResizeObserver`, and Service Workers for offline use.
- **Measured performance:** essential payload gzips to ~26 KB; single-canvas
  rendering with capped DPR and no per-frame allocation in the static models.
  Runtime FPS should be verified with Lighthouse/DevTools in the target browser —
  the Bohr animation is the only continuously rendering path and pauses when
  offscreen or hidden.

## Testing

```bash
node --test tests/
```

The browser test harness (`browser-tests.html`) exercises model switching,
keyboard operation, pointer/touch hit-testing, responsive layout, theme toggle,
and service-worker offline caching. Run it over the local server (service workers
require a secure context; `localhost` qualifies).

## Accessibility

Keyboard-operable controls, visible focus states, sufficient contrast, appropriate
labels, and text alternatives for visualizations. Animation is paused for
`prefers-reduced-motion`. The goal is WCAG 2.2 AA.

## Contributing

Issues and pull requests are welcome. Keep changes dependency-free and verify with
`node --test tests/`.

## Author

Built by **Mahim Mazidul** ([@mahimmazidul](https://github.com/mahimmazidul)).

## License

MIT — see [LICENSE](./LICENSE). Copyright (c) 2026 Mahim Mazidul.
