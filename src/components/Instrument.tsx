import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, Shuffle } from "lucide-react";
import { CAT_LABEL, ELEMENTS, byZ, padZ } from "../data/elements";
import { MODELS, MODEL_BY_KEY, type ModelKey } from "../data/models";
import AtomViz from "./AtomViz";
import Reveal from "./Reveal";
import {
  IconBohr,
  IconDalton,
  IconQuantum,
  IconRutherford,
  IconThomson,
} from "./icons";
import { cn } from "../utils/cn";

const MODEL_ICONS = {
  dalton: IconDalton,
  thomson: IconThomson,
  rutherford: IconRutherford,
  bohr: IconBohr,
  quantum: IconQuantum,
} as const;

const electronsDrawn = (m: ModelKey, z: number) =>
  m === "dalton" ? 0 : m === "thomson" ? Math.min(z, 30) : m === "rutherford" ? Math.min(z, 18) : z;

interface Props {
  z: number;
  setZ: (z: number) => void;
  model: ModelKey;
  setModel: (m: ModelKey) => void;
}

function Brackets() {
  const c = "absolute h-5 w-5 border-[var(--line-strong)] pointer-events-none";
  return (
    <>
      <span className={cn(c, "left-0 top-0 border-l border-t")} />
      <span className={cn(c, "right-0 top-0 border-r border-t")} />
      <span className={cn(c, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(c, "bottom-0 right-0 border-b border-r")} />
    </>
  );
}

function Row({ k, v, mono = true }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="readout-row">
      <span className="text-[10px] uppercase tracking-[0.22em] text-ink/55">{k}</span>
      <span className={cn("text-right text-[12.5px] text-ink", mono && "font-mono tracking-[0.04em]")}>
        {v}
      </span>
    </div>
  );
}

export default function Instrument({ z, setZ, model, setModel }: Props) {
  const el = byZ(z);
  const m = MODEL_BY_KEY[model];
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as typeof ELEMENTS;
    const exactZ = /^\d{1,3}$/.test(q) ? parseInt(q, 10) : NaN;
    return ELEMENTS.filter(
      (e) => e.name.toLowerCase().includes(q) || e.sym.toLowerCase().startsWith(q) || e.z === exactZ,
    ).slice(0, 8);
  }, [query]);

  const commit = (zz: number) => {
    setZ(zz);
    setQuery("");
    setOpen(false);
  };

  /* keyboard operation: ←/→ step Z · 1–5 switch model · R random */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowLeft") setZ(z === 1 ? 118 : z - 1);
      else if (e.key === "ArrowRight") setZ(z === 118 ? 1 : z + 1);
      else if (e.key.toLowerCase() === "r") setZ(1 + Math.floor(Math.random() * 118));
      else if (/^[1-5]$/.test(e.key)) setModel(MODELS[parseInt(e.key, 10) - 1].key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [z, setZ, setModel]);

  return (
    <section id="instrument" className="relative mx-auto max-w-[1440px] px-5 py-24 sm:px-10 md:py-36">
      {/* section head */}
      <Reveal>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <div>
            <p className="kicker mb-4">№ 01 · Operate</p>
            <h2 className="font-display text-[clamp(2.4rem,5.4vw,4.2rem)] leading-[0.95] tracking-[-0.01em]">
              The <em className="font-light italic text-hbeta">Instrument</em>
            </h2>
          </div>
          <p className="max-w-[26ch] pb-1 font-mono text-[11px] leading-relaxed tracking-[0.08em] text-fog">
            118 SPECIMENS · 5 DRAWINGS · KEYS ← → STEP Z · 1–5 SWITCH MODEL · R = RANDOM
          </p>
        </div>
      </Reveal>

      <Reveal className="grid gap-10 lg:grid-cols-[168px_minmax(0,1fr)_350px] xl:gap-14" delay={120}>
        {/* ————— model selector ————— */}
        <div
          role="radiogroup"
          aria-label="Atomic model"
          className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible"
        >
          {MODELS.map((mm) => {
            const Icon = MODEL_ICONS[mm.key];
            const active = mm.key === model;
            return (
              <button
                key={mm.key}
                role="radio"
                aria-checked={active}
                onClick={() => setModel(mm.key)}
                className={cn(
                  "model-tab group flex min-w-[150px] flex-col items-start gap-2 border px-4 py-3.5 text-left lg:min-w-0",
                  active
                    ? "border-paper bg-paper text-ink"
                    : "border-[var(--line)] text-fog hover:border-[var(--line-strong)] hover:text-paper",
                )}
              >
                <span className="flex w-full items-center justify-between">
                  <Icon size={18} />
                  <span className="font-mono text-[10px] tracking-[0.3em]">{mm.numeral}</span>
                </span>
                <span className="font-display text-[15px] leading-tight">{mm.name}</span>
                <span className={cn("font-mono text-[9.5px] tracking-[0.24em]", active ? "text-ink/60" : "text-fog/70")}>
                  {mm.year} · {mm.person.split(" ")[0].toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>

        {/* ————— stage ————— */}
        <div>
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.28em] text-fog">
            <span>
              SPECIMEN № {padZ(z)} · {el.name.toUpperCase()}
            </span>
            <span className="hidden sm:block">
              MODEL {m.numeral} · {m.name.toUpperCase()}
            </span>
          </div>

          <div className="relative mt-3 border border-[var(--line)] bg-ink-2/60">
            <Brackets />
            {/* crosshair */}
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <span className="absolute left-1/2 top-4 bottom-4 w-px bg-[var(--line)] opacity-40" />
              <span className="absolute top-1/2 left-4 right-4 h-px bg-[var(--line)] opacity-40" />
            </div>
            <AtomViz
              key={`${el.z}-${model}`}
              el={el}
              model={model}
              className="viz-in mx-auto aspect-square w-full max-w-[640px]"
            />
          </div>

          <div className="mt-3 flex items-center justify-between font-mono text-[9.5px] tracking-[0.24em] text-fog">
            <span>SIMPLIFIED SCHEMATIC — NOT TO SCALE</span>
            <span>
              FIG. {m.numeral} · {electronsDrawn(model, z)}/{z} e⁻ DRAWN
            </span>
          </div>

          {/* controls */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex border border-[var(--line)]">
              <button
                onClick={() => setZ(z === 1 ? 118 : z - 1)}
                aria-label="Previous element"
                className="grid h-11 w-11 place-items-center text-fog transition-colors hover:bg-ink-2 hover:text-paper"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setZ(1 + Math.floor(Math.random() * 118))}
                aria-label="Random element"
                className="grid h-11 w-11 place-items-center border-x border-[var(--line)] text-fog transition-colors hover:bg-ink-2 hover:text-paper"
              >
                <Shuffle size={14} />
              </button>
              <button
                onClick={() => setZ(z === 118 ? 1 : z + 1)}
                aria-label="Next element"
                className="grid h-11 w-11 place-items-center text-fog transition-colors hover:bg-ink-2 hover:text-paper"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="relative min-w-0 flex-1">
              <Search size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fog" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 140)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const q = query.trim().toLowerCase();
                    const exact = ELEMENTS.find(
                      (x) => x.name.toLowerCase() === q || x.sym.toLowerCase() === q || x.z === parseInt(q, 10),
                    );
                    if (exact) commit(exact.z);
                    else if (matches.length) commit(matches[0].z);
                  }
                  if (e.key === "Escape") setOpen(false);
                }}
                placeholder="FIND SPECIMEN — NAME, SYMBOL, OR №"
                aria-label="Find element by name, symbol, or atomic number"
                className="h-11 w-full border border-[var(--line)] bg-transparent pl-10 pr-4 font-mono text-[12px] tracking-[0.14em] text-paper placeholder:text-fog/50 focus:border-[var(--line-strong)] focus:outline-none"
              />
              {open && matches.length > 0 && (
                <ul className="absolute left-0 right-0 top-full z-30 mt-1 border border-[var(--line)] bg-ink-2 shadow-2xl">
                  {matches.map((e) => (
                    <li key={e.z}>
                      <button
                        onMouseDown={(ev) => ev.preventDefault()}
                        onClick={() => commit(e.z)}
                        className="flex w-full items-baseline justify-between px-4 py-2.5 text-left transition-colors hover:bg-ink-3"
                      >
                        <span className="font-display text-[14px] text-paper">{e.name}</span>
                        <span className="font-mono text-[10px] tracking-[0.2em] text-fog">
                          {padZ(e.z)} · {e.sym}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* ————— ledger ————— */}
        <aside className="self-start bg-bone p-6 text-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] sm:p-7 lg:-rotate-[0.4deg]">
          <div className="flex items-baseline justify-between border-b-2 border-ink/80 pb-3">
            <span className="font-mono text-[10px] tracking-[0.3em] text-ink/60">SPECIMEN LEDGER</span>
            <span className="font-mono text-[10px] tracking-[0.3em] text-ink/60">№ {padZ(z)}</span>
          </div>

          <div className="flex items-end justify-between gap-4 pt-4">
            <div>
              <div className="font-display text-[44px] font-medium leading-none">{el.sym}</div>
              <div className="mt-1 font-display text-[17px] italic text-ink/80">{el.name}</div>
            </div>
            <span className="mb-1 inline-flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink/70">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: `var(--color-cat-${el.cat})` }}
              />
              {CAT_LABEL[el.cat]}
            </span>
          </div>

          <div className="mt-5 font-mono">
            <Row k="Atomic № (protons)" v={String(z)} />
            <Row k="Std. atomic weight" v={el.mass} />
            <Row k={`Shells n=1…${el.shells.length}`} v={el.shells.join(" · ")} />
            <Row k="Valence e⁻" v={String(el.shells[el.shells.length - 1])} />
            <Row k="Period" v={String(el.shells.length)} />
            <Row k={`Drawn under fig. ${m.numeral}`} v={`${electronsDrawn(model, z)} of ${z} e⁻`} />
          </div>
          {el.synthetic && (
            <p className="mt-2 font-mono text-[9.5px] leading-relaxed tracking-[0.06em] text-ink/55">
              [BRACKETED] = MASS № OF LONGEST-LIVED ISOTOPE; NO STANDARD WEIGHT EXISTS.
            </p>
          )}

          <div className="mt-6 border-t border-ink/25 pt-4">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[10px] tracking-[0.28em] text-halpha">FIG. {m.numeral}</span>
              <span className="font-display text-[15px] font-medium">
                {m.name}, {m.year}
              </span>
            </div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink/85">{m.idea}</p>
            <p className="mt-3 border-l-2 border-halpha pl-3 font-display text-[13px] italic leading-relaxed text-ink/70">
              Where it fails — {m.limit}
            </p>
          </div>
        </aside>
      </Reveal>
    </section>
  );
}
