# AtomicModels — Redesign rev. II (“Instrument & Archive”)

**Concept:** *The atom was never seen — only drawn.* The site is reframed from a
plain explorer into an exhibition-grade instrument: a measuring stage with
reticles and specimen labels, an archive of historical plates, a chronicle of
123 years, and an explicit honesty policy — the README’s “scientific honesty”
section promoted from text to the design itself.

Motif: the visible spectrum with hydrogen’s Balmer lines (H-α 656.3 → H-δ 410.2 nm)
— *we read atoms by light*. Type: Fraunces + IBM Plex Mono. Ink/paper/spectral
palette. No gradients-hero-SaaS patterns: everything is rules, plates, ledgers.

## What’s inside

| Area | Old | New |
| --- | --- | --- |
| Explorer | search box + canvas | The Instrument: bracketed stage, crosshair, specimen strip, model tabs (I–V, custom icons), paper ledger readout, keyboard (←/→ Z-step, 1–5 model, R random) |
| Models | text blurbs | Procedural SVG per model, drawn per-element from real shell data; every figure self-annotates its limits (“30 of 118 e⁻ drawn — schematic”, “fixed rungs only”) |
| Imagery | — | 5 historical plates from **Wikimedia Commons** (verified URLs via `Special:FilePath`), matted frames with author credits + licenses |
| Story | card list | Chronology ledger 1803–1926 with the forcing experiments + full-width Balmer evidence strip |
| Policy | implicit | “Honesty” section: label every schematic · ship each model with its refutation · never round reality |
| Extra | — | 118-element ticker (click to load), custom icon set, reduced-motion support |

## Stack

React 19 + Vite 7 + Tailwind 4 + lucide. `npm run build` emits a **single
self-contained `dist/index.html`** (fonts via Google CDN, plates hot-linked
from Commons) — it can be dropped on GitHub Pages as-is, or the `src/` tree
can replace the vanilla build.

## Files

```
index.html                  fonts, meta, favicon
src/index.css               design tokens + instrument chrome
src/data/elements.ts        118 elements (weights, shells, category)
src/data/models.ts          5 models + Commons plate URLs/credits
src/lib/prng.ts             deterministic scatter
src/components/…            icons · Spectrum · Ticker · Reveal · Hero
                            AtomViz · Instrument · Plates · Chronicle
                            Honesty · Footer
```

## Revision II, second pass

| Feature | Where |
| --- | --- |
| Dark / light setting | Header toggle (`ThemeToggle.tsx`), `T` key, `lib/theme.ts`. Both drawings and chrome follow it; the choice is stored, otherwise the system decides. |
| Specimen photographs | `Specimen.tsx` sits under the stage: Wikipedia lead image by way of Commons, credited, with the article's intro extract. 94 of 118 elements; the rest say so. |
| Data refresh | `node scripts/fetch-specimens.mjs` rewrites `src/data/specimens.ts` (page images, Commons credits, extracts). Nothing is fetched at runtime. |
| Contrast | Both settings audited with a WCAG pass over every text node — 0 failures at 4.5:1 (3:1 for large text). |
| Storage diet | Photographs requested at the ~500 px Commons bucket (~50 KB each, was up to 6.8 MB for full-resolution originals), plates likewise, and the service worker no longer caches opaque cross-origin images — reported storage after browsing a dozen elements fell from 61.6 MB to under 1 MB. |

## Ship it on a new branch

```bash
# inside your AtomicModels clone, after copying these files over:
git checkout -b redesign/instrument-archive
git add -A
git commit -m "Redesign rev. II: instrument & archive — plates from Wikimedia Commons"
git push -u origin redesign/instrument-archive
gh pr create --fill   # or open the PR from the pushed-branch banner
```

Note: rotate any personal access token that was ever pasted into a chat
before using it again — treat it as leaked. Never commit tokens.
