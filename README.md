# Atomic Models — An Instrument for the Indivisible

Five honest drawings of the atom — **Dalton's solid sphere (1803)**,
**Thomson's plum pudding (1904)**, **Rutherford's nucleus (1911)**,
**Bohr's quantised orbits (1913)** and **the quantum probability cloud (1926)**
— operated across all **118 elements**.

- **Live instrument:** https://mahimmazidul.github.io/AtomicModels/
- **Issues:** https://github.com/mahimmazidul/AtomicModels/issues
- **Notes on this revision:** [REDESIGN_NOTES.md](./REDESIGN_NOTES.md)

**Status:** revision II ("Instrument & Archive") · the whole site ships as one
self-contained HTML document · no runtime APIs, no analytics, no cookies.

---

## Why this exists

The atom was never seen, only drawn. Most explainers quietly blur the line
between the drawing and the thing drawn — a Bohr orbit rendered as if it were
what an electron does. This instrument keeps a line between them: every figure
says which model it is, what it leaves out, and which experiment killed it.

## What it is

A single scrolling instrument rather than a dashboard:

| Section | What it does |
| --- | --- |
| Hero | The premise, the spectral motif (hydrogen's Balmer lines, H-α 656.3 → H-δ 410.2 nm), and the two rules of the site. |
| Ticker | All 118 elements in one ruled strip — click any specimen to load it. |
| Instrument | The working stage: specimen readout, five model tabs (I–V), a bracketed canvas with crosshair, and a paper ledger of the element's properties. |
| Plates | Five historical plates from Wikimedia Commons — Dalton's 1808 plate, the plum-pudding diagram, the Geiger–Marsden expectation-versus-result figure, Bohr's 1913 atom, and hydrogen density plots — each matted with author and licence. |
| Chronicle | The 123-year ledger, 1803–1926, pairing each model with the experiment that forced it and the one that finished it. |
| Specimen | The object itself, from the element's Wikipedia article by way of Wikimedia Commons — photographed, credited, and captioned with the article's intro extract. |
| Honesty | The policy stated plainly: label every schematic, ship each model with its refutation, never round reality. |

## Operating the instrument

- **Search** by name, symbol or atomic number, or click a cell in the ticker.
- **Keyboard:** `←` / `→` step one element, `1`–`5` switch model, `R` loads a random specimen, `T` swaps the setting.
- **Setting:** the toggle in the header switches between the dark and light readings of the same instrument — ink on paper, or paper on ink. The choice is remembered, and with no stored choice the system preference decides.
- **Model tabs I–V** redraw the same element as Dalton, Thomson, Rutherford, Bohr or quantum cloud.
- Each drawing **annotates its own limits** in place — for example how many electrons are actually drawn out of the shell total, or that the cloud is schematic rather than a computed orbital.
- **Responsive** from 320 px upward; pointer, touch and keyboard all work; `prefers-reduced-motion` disables the animated paths.

## Specimen photographs

Every drawing here is a labelled schematic, so the photograph matters: it is the
one thing on the stage nobody drew. Each element's lead image comes from its
English Wikipedia article, by way of Wikimedia Commons, at reference size
(~1000–1280 px) and hot-linked from `upload.wikimedia.org`; the author and licence
are printed beneath the frame, and the caption carries the article's plain-text
intro extract about two sentences long.

- Photographs are requested through `Special:FilePath?width=480`, which lands on
  Commons' ~500 px bucket and delivers about 40–60 KB each — the wikitext-style
  thumbnail paths refuse any width Commons has not already rendered, so that
  route is the one that always resolves.
- **94 of 118 elements** have a lead photograph (through Californium). The
  remaining 24 — Einsteinium and everything heavier, plus technetium, hafnium,
  radon and francium — have no Commons lead image; those show an explicit
  *no photograph on file* mat rather than substituting a drawing.
- The data is compiled at build time by `node scripts/fetch-specimens.mjs`, which
  writes `src/data/specimens.ts`. The app never calls an API at runtime.
- Every entry keeps `file`, `page` (the file page with its full licence text) and
  `wiki` (the article), so the credit is one click from the claim.

## Scientific honesty

- **Bohr shells (n = 1, 2, 3 …)** are not the same thing as **quantum orbitals (s, p, d, f)**, and the interface never conflates them. Classical circular paths appear only under the historical Rutherford and Bohr models, with a note that they are teaching simplifications.
- **Quantum clouds** are drawn as schematic translucent shapes, not calculated probability densities. Multi-electron atoms would need numerical quantum-chemistry methods, and the page says so.
- **Electron populations** use ground-state shell distributions, including the well-known anomalous configurations (Cr, Cu, Nb, Mo, Ru, Rh, Pd, Ag, La, Ce, Gd, Pt, Au, Ac, Th, Pa, U, Np, Cm, Lr).
- **Every figure is a schematic.** Counts are annotated; nothing is drawn to scale; nothing is rounded to look more precise than the data.

## Tech stack

- **React 19** + **TypeScript**, **Vite 7**, **Tailwind CSS 4** (`@tailwindcss/vite`), `lucide-react` for interface icons, custom SVG marks for the five models.
- **`vite-plugin-singlefile`** inlines every script and stylesheet, so `npm run build` emits one `dist/index.html` that can be dropped anywhere.
- **Fraunces** and **IBM Plex Mono** via Google Fonts; the five historical plates are hot-linked from Wikimedia Commons with their credits and licences shown beneath each frame.
- **Service worker** (`public/sw.js`) for offline use: network-first navigations, cache-first same-origin assets, and a size-capped runtime cache for web fonts. Photographs are deliberately **not** cached by the worker — Chromium charges an opaque cross-origin response several megabytes of storage quota regardless of its real size, so caching a dozen photographs inflated reported storage by tens of megabytes. The browser's ordinary HTTP cache holds them instead.
- No state library, no CSS-in-JS, no analytics, no third-party scripts.

## Quick start

```bash
git clone https://github.com/mahimmazidul/AtomicModels.git
cd AtomicModels
npm install
npm run dev        # http://localhost:5173
npm run build      # -> dist/index.html (single file)
npm run preview    # serve the built file
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Vite dev server with hot reload. |
| `npm run build` | Production build; inlines everything into `dist/index.html`. |
| `npm run preview` | Serve `dist/` locally to check the real output. |
| `node scripts/fetch-specimens.mjs` | Refresh photograph URLs, credits and extracts from Wikipedia/Commons. |
| `node scripts/fetch-specimens.mjs --normalize-only` | Rewrite the photograph URLs in `src/data/specimens.ts` at the reference size. Pure string work, no network. |

## Project structure

```
AtomicModels/
├── index.html                 # shell: fonts, meta, Open Graph, JSON-LD, noscript summary
├── public/
│   ├── assets/                # favicon 32, apple-touch-icon 180, icon 192 and 512
│   ├── manifest.webmanifest   # installable web app metadata
│   ├── robots.txt             # crawl policy + sitemap pointer
│   ├── sitemap.xml
│   └── sw.js                  # offline service worker
├── scripts/
│   └── fetch-specimens.mjs    # build-time Commons/Wikipedia data refresh (writes src/data/specimens.ts)
├── src/
│   ├── App.tsx                # header, setting toggle, section order, shared element/model state
│   ├── index.css              # design tokens: ink and paper, both settings, spectral Balmer palette
│   ├── components/
│   │   ├── Hero.tsx           # premise + spectral rule
│   │   ├── Ticker.tsx         # 118-element strip
│   │   ├── Instrument.tsx     # stage, model tabs I–V, ledger readout, specimen card, keyboard
│   │   ├── Specimen.tsx       # the photographed object, credited, with its article extract
│   │   ├── ThemeToggle.tsx    # dark / light reading of the instrument
│   │   ├── AtomViz.tsx        # the five drawings, generated from shell data
│   │   ├── Plates.tsx         # Commons plates with credits and licences
│   │   ├── Chronicle.tsx      # 1803–1926 ledger
│   │   ├── Honesty.tsx        # editorial policy
│   │   ├── Spectrum.tsx       # Balmer line strip
│   │   ├── Reveal.tsx         # reduced-motion-aware section reveal
│   │   ├── icons.tsx          # instrument mark and model marks
│   │   └── Footer.tsx         # colophon, sources, back to top
│   ├── data/
│   │   ├── elements.ts        # 118 elements: weight, shells, category, period, group
│   │   ├── models.ts          # the five models + plate credits
│   │   └── specimens.ts       # generated: photographs, credits, extracts for all 118
│   ├── lib/
│   │   ├── prng.ts            # deterministic scatter so drawings are stable
│   │   └── theme.ts           # dark / light state, persisted, with system-preference fallback
│   └── utils/cn.ts            # class merge helper
└── .github/workflows/pages.yml  # build + deploy to GitHub Pages
```

## Deployment (GitHub Pages)

The site is served from the **repository root** of GitHub Pages, so the Pages
source must be **GitHub Actions**:

1. **Settings → Pages → Build and deployment → Source → GitHub Actions.**
2. Push to `main` (or run the workflow manually from the Actions tab).
3. `.github/workflows/pages.yml` installs dependencies, runs `npm run build` and
   deploys `dist/`.

Because the build inlines its own JavaScript and CSS, no `base` path juggling is
needed — the same artifact works at a project subpath such as `/AtomicModels/`
or at a custom domain.

## Data and sources

- **Element data:** standard atomic weights, ground-state electron configurations
  and electron-per-shell distributions for all 118 elements, as commonly tabulated
  by IUPAC and reference chemistry sources.
- **Historical plates:** Wikimedia Commons, via `Special:FilePath`, with the
  author, source and licence printed beneath every frame in the Plates section.
- **Visualizations are educational schematics** — not to scale, and not physical
  simulations of quantum behaviour.

## Accessibility

Keyboard-operable controls with visible focus, semantic headings and lists,
labelled figures, an honest text summary in the `noscript` block, sufficient
contrast on the ink-and-paper palette, and full `prefers-reduced-motion` support.
The target is WCAG 2.2 AA.

## Author

Built by **Mahim Mazidul** ([@mahimmazidul](https://github.com/mahimmazidul)).

## License

MIT — see [LICENSE](./LICENSE). Copyright (c) 2026 Mahim Mazidul.
