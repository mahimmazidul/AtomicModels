# Atomic Models

**An instrument for the indivisible — five honest drawings of the atom, operated across all 118 elements.**

[![Deploy to GitHub Pages](https://github.com/mahimmazidul/AtomicModels/actions/workflows/pages.yml/badge.svg)](https://github.com/mahimmazidul/AtomicModels/actions/workflows/pages.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-1f6feb.svg)](./LICENSE)
[![Bundle: single file](https://img.shields.io/badge/build-one%20self--contained%20HTML-8957e5.svg)](./vite.config.ts)
[![Payload: 120 kB gzip](https://img.shields.io/badge/payload-120%20kB%20gzip-2f8f45.svg)](#performance-and-storage)

- **Live instrument:** https://mahimmazidul.github.io/AtomicModels/
- **Issues:** https://github.com/mahimmazidul/AtomicModels/issues
- **Design notes for this revision:** [REDESIGN_NOTES.md](./REDESIGN_NOTES.md)

The atom was never seen, only drawn. Most explainers quietly blur the line between
the drawing and the thing drawn — a Bohr orbit rendered as if it were what an
electron does. This instrument keeps that line visible: every figure states which
model it is, what it leaves out, and which experiment finished it off.

---

## Table of contents

- [What is on the page](#what-is-on-the-page)
- [Operating the instrument](#operating-the-instrument)
- [The five models](#the-five-models)
- [Specimen photographs](#specimen-photographs)
- [Scientific honesty](#scientific-honesty)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Deployment](#deployment-github-pages)
- [Performance and storage](#performance-and-storage)
- [Accessibility](#accessibility)
- [Browser support](#browser-support)
- [Data, sources and licensing](#data-sources-and-licensing)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

## What is on the page

The site is one scrolling instrument, not a dashboard.

| Section | What it holds |
| --- | --- |
| **Hero** | The premise, the spectral motif — hydrogen's Balmer lines, H-α 656.3 to H-δ 410.2 nm — and the two rules the site holds itself to. |
| **Ticker** | All 118 specimens in one ruled strip. Click any cell to load it. |
| **Instrument** | The working stage: specimen readout, five model tabs (I–V), a bracketed canvas with a crosshair, the specimen photograph, and a paper ledger of the element's properties. |
| **Plates** | Five historical plates from Wikimedia Commons — Dalton's 1808 engraving, the plum-pudding diagram, the Geiger–Marsden expectation-versus-result figure, Bohr's 1913 atom, and hydrogen density plots — each matted with its author and licence. |
| **Chronicle** | The 123-year ledger, 1803–1926, pairing each model with the experiment that forced it and the one that finished it. |
| **Honesty** | The policy stated plainly, and how it is enforced in the interface. |

## Operating the instrument

| Action | How |
| --- | --- |
| Find an element | Search by name, symbol or atomic number; or click a cell in the ticker. |
| Step through the table | `←` / `→`, or the arrow buttons under the stage. |
| Switch model | `1`–`5`, or the model tabs I–V. |
| Random specimen | `R`, or the shuffle button. |
| Dark / light reading | The header toggle, or `T` from anywhere outside a text field. |

The **setting** swaps ink and paper: the same instrument read as dark marks on
paper, or light marks on ink. The choice is stored in `localStorage`; with nothing
stored, the system preference decides and dark is the fallback. An inline script
sets the attribute before first paint, so there is no flash of the wrong paper.

Each drawing **annotates its own limits** in place — how many electrons are
actually drawn out of the shell total, that the cloud is schematic rather than a
computed orbital, that the Rutherford figure is mostly void because the atom is.

## The five models

Every drawing is generated from the element's real shell data. The table below is
also what ships in the interface, limits included.

| | Model | Year | Author | Core claim | Where it fails |
| --- | --- | --- | --- | --- | --- |
| I | Solid Sphere | 1803 | John Dalton | Matter is built from indivisible, identical spheres; elements differ only in mass and combine in fixed whole-number ratios. | It has no internal structure at all — it cannot hear a spectrum, and it never saw the electron coming. |
| II | Plum Pudding | 1904 | J. J. Thomson | A diffuse sphere of positive charge with electrons embedded throughout, like plums in a pudding. | No nucleus, and therefore no account of why alpha particles ricochet off gold foil. |
| III | Nuclear Model | 1911 | Ernest Rutherford | Nearly all the mass and all the positive charge sits in a nucleus one hundred-thousandth the width of the atom. | Classical physics says an orbiting charge radiates energy, so every atom should collapse in a nanosecond. |
| IV | Quantised Orbits | 1913 | Niels Bohr | Electrons occupy fixed circular orbits of quantised energy, n = 1, 2, 3…, emitting or absorbing light only when they jump rungs. | Exact for one-electron atoms only; it fines nothing heavier and ignores fine structure entirely. |
| V | Probability Cloud | 1926 | Schrödinger, Heisenberg, Born | The electron is a wave function; \|ψ\|² gives not a path but a probability density — orbitals s, p, d, f. | Many-electron atoms have no closed-form solution; every real answer is a numerical approximation. |

## Specimen photographs

Every figure in the instrument is a labelled schematic, so the photograph matters:
it is the one thing on the stage nobody drew. Each element's lead image comes from
its English Wikipedia article, by way of Wikimedia Commons, with its author and
licence printed beneath the frame, and the caption carries the article's intro
extract at about two sentences.

- **94 of 118 elements** have a lead photograph; the heaviest is einsteinium
  (Z = 99). The 24 without one are promethium, hafnium, radon, francium, curium,
  fermium, and every element from mendelevium (101) to oganesson (118). Those
  show an explicit *no photograph on file* mat rather than substituting a
  drawing.
- Photographs are requested through `Special:FilePath?width=480`, which lands on
  Commons' nearest rendered bucket — about 500 px, 40–60 KB. Wikimedia's raw
  thumbnail paths refuse any width that has not already been rendered, so
  `Special:FilePath` is the route that always resolves.
- The data is compiled at build time by `node scripts/fetch-specimens.mjs` into
  `src/data/specimens.ts`. The app makes **no API calls at runtime**, and images
  are hot-linked rather than rehosted, which keeps attribution with the file.
- Every entry carries `file`, `page` (the Commons file page with its full licence
  text) and `wiki` (the article), so the credit is one click from the claim.

## Scientific honesty

A schematic that pretends to be the thing itself is the failure mode this project
exists to avoid. The rules, all enforced in the interface:

- **Bohr shells (n = 1, 2, 3 …) are not quantum orbitals (s, p, d, f).** The
  interface never conflates them. Classical circular paths appear only under the
  historical Rutherford and Bohr models, each with a note that it is a teaching
  simplification.
- **Quantum clouds are schematic shapes**, not calculated probability densities.
  Multi-electron atoms would need numerical quantum-chemistry methods, and the
  page says so where it draws them.
- **Electron populations** use ground-state shell distributions, including the
  well-known anomalous configurations (Cr, Cu, Nb, Mo, Ru, Rh, Pd, Ag, La, Ce,
  Gd, Pt, Au, Ac, Th, Pa, U, Np, Cm, Lr).
- **Every figure is a schematic.** Counts are annotated, nothing is drawn to
  scale, and nothing is rounded to look more precise than the data.
- **Each model ships with its refutation** in the ledger beside it, not buried in
  a footnote.

## Tech stack

- **React 19** and **TypeScript** built with **Vite 7**, styled with **Tailwind CSS 4**
  through `@tailwindcss/vite`. Interface icons from `lucide-react`; the five model
  marks are custom SVG.
- **`vite-plugin-singlefile`** inlines every script and stylesheet, so
  `npm run build` emits one self-contained `dist/index.html` — no hashed asset
  paths, nothing to configure for a project subpath.
- **Fraunces** and **IBM Plex Mono** from Google Fonts; the five historical plates
  are hot-linked from Wikimedia Commons with their credits and licences shown
  beneath each frame.
- **Service worker** (`public/sw.js`) for offline use: network-first navigations,
  cache-first same-origin assets, and a size-capped runtime cache for web fonts.
  Photographs are deliberately *not* cached by the worker — see
  [Performance and storage](#performance-and-storage) for why.
- No state library, no CSS-in-JS, no analytics, no third-party scripts, no cookies.

## Quick start

Requires **Node 20 or newer**.

```bash
git clone https://github.com/mahimmazidul/AtomicModels.git
cd AtomicModels
npm install
npm run dev        # http://localhost:5173
npm run build      # -> dist/index.html (one file)
npm run preview    # serve the built file
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Vite dev server with hot reload. |
| `npm run build` | Production build; inlines everything into `dist/index.html`. |
| `npm run preview` | Serve `dist/` locally to check the real output. |
| `npm run specimens` | Refresh photographs, credits and extracts from Wikipedia and Commons into `src/data/specimens.ts`. Resumes from a local cache if it is rate-limited. |
| `node scripts/fetch-specimens.mjs --normalize-only` | Rewrite the photograph URLs in `src/data/specimens.ts` at the reference size. Pure string work, no network access. |

## Project structure

```
AtomicModels/
├── index.html                  # shell: fonts, meta, Open Graph, JSON-LD, noscript summary
├── public/
│   ├── assets/                 # favicon 32, apple-touch-icon 180, icon 192 and 512
│   ├── manifest.webmanifest    # installable web app metadata
│   ├── robots.txt              # crawl policy and sitemap pointer
│   ├── sitemap.xml
│   └── sw.js                   # offline service worker
├── scripts/
│   └── fetch-specimens.mjs     # build-time Commons/Wikipedia data refresh
├── src/
│   ├── App.tsx                 # header, setting toggle, section order, shared element/model state
│   ├── index.css               # design tokens: ink and paper, both settings, spectral palette
│   ├── components/
│   │   ├── Hero.tsx            # premise, orrery, spectral rule
│   │   ├── Ticker.tsx          # 118-element strip
│   │   ├── Instrument.tsx      # stage, model tabs I–V, ledger readout, keyboard
│   │   ├── Specimen.tsx        # the photographed object, credited, with its extract
│   │   ├── ThemeToggle.tsx     # dark / light reading of the instrument
│   │   ├── AtomViz.tsx         # the five drawings, generated from shell data
│   │   ├── Plates.tsx          # Commons plates with credits and licences
│   │   ├── Chronicle.tsx       # the 1803–1926 ledger
│   │   ├── Honesty.tsx         # editorial policy
│   │   ├── Spectrum.tsx        # Balmer line strip
│   │   ├── Reveal.tsx          # reduced-motion-aware section reveal
│   │   ├── icons.tsx           # instrument mark and model marks
│   │   └── Footer.tsx          # colophon, sources, back to top
│   ├── data/
│   │   ├── elements.ts         # 118 elements: weight, shells, category
│   │   ├── models.ts           # the five models, their limits, plate credits
│   │   └── specimens.ts        # generated: photographs, credits, extracts
│   ├── lib/
│   │   ├── prng.ts             # deterministic scatter, so drawings are stable
│   │   └── theme.ts            # dark / light state, persisted, system-aware
│   ├── main.tsx                # mount, theme sync, service-worker registration
│   └── utils/cn.ts             # class merge helper
└── .github/workflows/pages.yml # build and deploy to GitHub Pages
```

## Deployment (GitHub Pages)

The site is served at a project subpath (`/AtomicModels/`) by a Pages
**workflow** build, not a committed folder:

1. **Settings → Pages → Build and deployment → Source → GitHub Actions.**
2. Push to `main`, or run the workflow by hand from the Actions tab.
3. `.github/workflows/pages.yml` installs dependencies, runs `npm run build` and
   deploys `dist/`.

Because the build inlines its own JavaScript and CSS, no `base` path juggling is
needed — the same artifact works at a project subpath or at a custom domain.
Nothing from the old pre-rendered build (element pages, committed `docs/`) is
required; the deploy artifact is a single file plus icons, manifest, robots,
sitemap and the service worker.

## Performance and storage

Measured against the deployed site, not a local estimate:

| | Figure |
| --- | --- |
| Build output | one file, **414 KB raw / 120 KB gzip** |
| First load, cold cache | **0.73 MB** over 14 requests |
| Photographs | ~40–60 KB each (Commons ~500 px bucket) |
| Fonts | ~180 KB, 5 files, served from Google Fonts with a `display=swap` fallback |
| Storage after browsing 15 elements | **0.88 MB** |

Two decisions keep that number honest, and both were the result of measuring
rather than guessing:

- **Reference sizes, not originals.** Forty of the specimen URLs once pointed at
  full-resolution Commons files — one photograph alone was 6.8 MB — because the
  Wikipedia API returns the original URL for images below its thumbnail
  threshold. Every photograph is now requested at a fixed reference width.
- **No opaque caching in the service worker.** Chromium charges an *opaque*
  cross-origin response several megabytes of storage quota regardless of its real
  size, and an opaque body cannot be measured or trimmed. Caching a dozen
  photographs inflated reported storage past 60 MB. The worker now caches only
  the document shell, its own small assets, and size-capped fonts; photographs
  ride the browser's ordinary HTTP cache, where Wikimedia's long-lived headers
  make a second visit free.

## Accessibility

Keyboard-operable controls with visible focus, semantic headings and lists,
labelled figures and live regions, an honest text summary in the `noscript` block,
and full `prefers-reduced-motion` support. Both settings are audited with a WCAG
contrast pass over every rendered text node — currently **zero failures** at
4.5:1 for body text and 3:1 for large text. The target is WCAG 2.2 AA.

## Browser support

Modern evergreen browsers: Chrome and Edge 111+, Safari 16.4+, Firefox 113+.
The interface relies on CSS `color-mix()`, `oklab` interpolation, CSS custom
properties and ES modules — all long-supported, but these are the floors.

## Data, sources and licensing

- **Element data** — standard atomic weights, ground-state electron configurations
  and electrons-per-shell distributions for all 118 elements, as commonly
  tabulated from IUPAC and reference chemistry sources.
- **Historical plates and specimen photographs** — Wikimedia Commons. Authors and
  licences are printed beneath each frame and each specimen, with a link to the
  file page carrying the full licence text. Images are hot-linked, not rehosted.
- **The code is MIT; the images are not.** Photographs and plates keep their own
  licences (public domain, FAL, CC BY, CC BY-SA and others). Reusing the
  repository's imagery means honouring the credit shown with it.
- **Visualizations are educational schematics** — not to scale, and not physical
  simulations of quantum behaviour.

## Contributing

Issues and pull requests are welcome. Keep the dependency list small, keep every
schematic labelled, and check both settings before opening a PR — the light
reading is not an afterthought, and a change that only looks right on dark is a
regression.

## Author

Built by **Mahim Mazidul** ([@mahimmazidul](https://github.com/mahimmazidul)).

## License

MIT — see [LICENSE](./LICENSE). Copyright (c) 2026 Mahim Mazidul.
