# Atomic Model Explorer

An interactive, **offline-capable** browser explorer of the five major historical
and modern atomic models — **Dalton, Thomson, Rutherford, Bohr, and the
quantum-mechanical model** — for **all 118 elements**. Built with semantic HTML,
Canvas 2D, and vanilla JavaScript/ES modules. No frameworks, no build-step
runtime, no external network requests, no tracking.

> Every visualization is a **simplified, not-to-scale schematic**. Where a model
> cannot accurately describe an element, the UI says so — it never invents a
> precise simulation.

---

## Features

- **Five atomic models**, each with concise, accessible explanations of its
  principles, historical significance, and limitations.
- **Searchable element selector** covering all 118 elements (search by name,
  symbol, or atomic number). Neutral atoms by default.
- **Per-element facts**: atomic number, symbol, name, IUPAC standard atomic
  weight, electron configuration, and electrons per shell.
- **Procedural visualizations** drawn with Canvas 2D — solid sphere, plum
  pudding, nuclear, Bohr quantised orbits, and schematic quantum probability
  clouds. Clearly labelled as simplified.
- **Explicit isotopes**: when a neutron count is shown, a real, named isotope is
  chosen (e.g. ¹²C). The standard atomic weight is **never** rounded to derive
  neutrons.
- **Responsive & mobile-first** down to 320 px; works in landscape, tablet, and
  desktop. No horizontal scrolling.
- **Pointer Events** (mouse / touch / pen) with accurate hit testing, a small
  contextual pointer indicator, visible hover/focus, and zoom/pan with button
  alternatives.
- **Accessible**: keyboard-operable controls, `role="radiogroup"` model switch,
  visible focus states, crawlable educational text, `aria-live` selection info,
  reduced-motion support, and light/dark themes.
- **Offline**: a versioned service worker caches the app after first load.
  No runtime APIs or third-party scripts.

## Scientific accuracy

- Bohr-style **electron shells** (n = 1, 2, 3 …) are clearly distinguished from
  real **quantum orbitals** (s, p, d, f). Electrons on classical circular paths
  are presented only for the historical Bohr/Rutherford models, with explicit
  notes that this is a teaching simplification, not the modern description.
- Quantum clouds are **schematic** translucent shapes, not calculated orbital
  probability distributions. The UI states that many-electron atoms require
  numerical quantum-chemistry methods.
- Electron configurations use the **ground-state** arrangement, including the
  well-known anomalous configurations (Cr, Cu, Nb, Mo, Ru, Rh, Pd, Ag, La, Ce,
  Gd, Pt, Au, Ac, Th, Pa, U, Np, Cm, Lr).
- Data shown for a "representative isotope" is explicitly identified; neutron
  counts are `mass number − atomic number` for that named isotope only.

## Tech approach

- **Static-first**: the build pre-renders an index page plus **118 element pages**
  and **5 model pages** (each with unique, crawlable content) for SEO. The
  interactive app is a single page that deep-links via the URL hash.
- **No runtime dependencies.** All element data is bundled locally.
- **On-demand rendering**: static diagrams render once; only the Bohr model
  animates, and only via `requestAnimationFrame` while visible, on-screen, and
  not hidden. Animation pauses for `prefers-reduced-motion`.
- **Performance budget**: the essential compressed payload (HTML + CSS + JS +
  data + SW + manifest) measures **~26 KB gzipped** — far below the 200 KB
  target. Device pixel ratio is capped and particle/electric counts are bounded.

## Project structure

```
atomic-model-explorer/
├── build.mjs                 # zero-dependency static build + page generator + size report
├── serve.mjs                 # zero-dependency local dev server
├── package.json
├── src/
│   ├── data/
│   │   ├── elements.js       # 118 elements (symbol, name, mass, isotope, config, category)
│   │   └── chemistry.js      # config expansion, shells, subshells (pure helpers)
│   ├── js/
│   │   ├── app.js            # application logic, input, theming, deep links
│   │   ├── viz.js            # Canvas 2D renderers for all five models
│   │   ├── models.js         # model metadata + per-element explanatory text
│   │   └── sw-register.js    # service-worker registration (path-aware)
│   ├── css/styles.css        # responsive, themed, accessible stylesheet
│   ├── sw.js                 # versioned offline service worker
│   ├── templates/            # index.html, element.html, model.html templates
│   └── tests/browser.test.html
├── tests/                   # Node tests (data integrity, chemistry, size) + size check
└── dist/                    # build output (generated; this is what gets deployed)
```

## Setup

Prerequisites: **Node.js 18+** (no `npm install` needed — zero runtime deps).

```bash
git clone <repo> && cd atomic-model-explorer
node build.mjs                      # -> produces dist/
node serve.mjs 8080                 # serve dist/ at http://localhost:8080
```

Open `http://localhost:8080/` for the app, and
`http://localhost:8080/browser-tests.html` for the in-browser test suite.

### Build options

```bash
node build.mjs --base-url "https://you.github.io/repo/"   # absolute URLs for canonical/sitemap
node build.mjs --out docs                                 # emit to docs/ instead of dist/
```

## Testing

```bash
node --test tests/        # data integrity, chemistry, model logic, measured bundle size
```

The browser test harness (`browser-tests.html`) exercises model switching,
keyboard operation, pointer/touch hit-testing, responsive layout, theme toggle,
and service-worker offline caching. Run it over the local server (service workers
require a secure context; `localhost` qualifies).

## Deployment (GitHub Pages)

**Option A — GitHub Actions (recommended).** Push to `main`; the included
`.github/workflows/deploy.yml` builds and deploys `dist/` to GitHub Pages. In repo
**Settings → Pages**, set *Build and deployment → Source → GitHub Actions*. The
workflow sets the canonical/sitemap base URL automatically for project pages.

**Option B — docs folder.** Build into `docs/` and let Pages serve that folder:

```bash
node build.mjs --out docs
git add docs && git commit -m "build" && git push
```

Then set Pages source to the `docs` branch/folder.

> If you publish to a **user/organization site** (`https://<owner>.github.io/`),
> pass `--base-url "https://<owner>.github.io/"` so canonical/sitemap URLs are
> correct.

## Data sources & limitations

- **Element data**: IUPAC standard atomic weights and standard ground-state
  electron configurations. Synthetic elements show the most-studied/longest-lived
  isotope mass in `[brackets]`.
- **Visualizations are educational schematics**, not to scale, and not physical
  simulations of quantum behaviour.
- **Pre-rendered pages** are "optional cached content"; only the interactive app
  payload counts against the 200 KB budget.
- **Browser support**: modern evergreen browsers (Chrome, Edge, Firefox, Safari 16+).
  Requires ES modules, Canvas 2D, Pointer Events, `IntersectionObserver`,
  `ResizeObserver`, and Service Workers for offline use.
- **Measured performance**: essential payload gzips to ~26 KB; single-canvas
  rendering with capped DPR and no per-frame allocation in the static models.
  Runtime FPS should be verified with Lighthouse/DevTools in the target browser —
  the Bohr animation is the only continuously rendering path and pauses when
  offscreen or hidden.

## License

MIT.
