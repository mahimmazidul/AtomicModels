import { useState } from "react";
import { ArrowDown } from "lucide-react";
import Spectrum from "./Spectrum";
import Reveal from "./Reveal";

/* ————— decorative instrument: concentric reticle + counter-rotating orbits ————— */

function Orrery() {
  const ticks = Array.from({ length: 48 }, (_, i) => (i / 48) * Math.PI * 2);
  return (
    <svg viewBox="0 0 560 560" className="h-auto w-full" aria-hidden>
      {ticks.map((a, i) => (
        <line
          key={i}
          x1={280 + 252 * Math.cos(a)}
          y1={280 + 252 * Math.sin(a)}
          x2={280 + (i % 4 === 0 ? 238 : 246) * Math.cos(a)}
          y2={280 + (i % 4 === 0 ? 238 : 246) * Math.sin(a)}
          stroke="rgba(233,228,214,0.35)"
          strokeWidth={i % 4 === 0 ? 1.2 : 0.7}
        />
      ))}
      <circle cx={280} cy={280} r={266} fill="none" stroke="rgba(233,228,214,0.16)" strokeDasharray="2 7" />
      {[84, 128, 172, 216].map((r) => (
        <circle key={r} cx={280} cy={280} r={r} fill="none" stroke="rgba(233,228,214,0.13)" />
      ))}
      <line x1={280} x2={280} y1={16} y2={544} stroke="rgba(233,228,214,0.09)" />
      <line x1={16} x2={544} y1={280} y2={280} stroke="rgba(233,228,214,0.09)" />

      {/* orbit A */}
      <g
        className="orbit"
        style={{ ["--d" as never]: "26s", transformBox: "view-box", transformOrigin: "50% 50%" }}
      >
        <g transform="rotate(-24 280 280)">
          <ellipse cx={280} cy={280} rx={216} ry={78} fill="none" stroke="rgba(155,232,242,0.4)" strokeWidth={1.1} />
          <circle cx={496} cy={280} r={6} fill="#9be8f2" />
          <circle cx={496} cy={280} r={13} fill="rgba(53,189,208,0.25)" />
          <circle cx={196} cy={346} r={4.5} fill="#5a66e0" />
        </g>
      </g>
      {/* orbit B */}
      <g
        className="orbit-rev"
        style={{ ["--d" as never]: "38s", transformBox: "view-box", transformOrigin: "50% 50%" }}
      >
        <g transform="rotate(58 280 280)">
          <ellipse cx={280} cy={280} rx={172} ry={60} fill="none" stroke="rgba(148,98,232,0.38)" strokeWidth={1.1} />
          <circle cx={452} cy={280} r={5.4} fill="#b99bf0" />
          <circle cx={146} cy={236} r={4} fill="#35bdd0" />
        </g>
      </g>
      {/* orbit C */}
      <g
        className="orbit"
        style={{ ["--d" as never]: "54s", transformBox: "view-box", transformOrigin: "50% 50%" }}
      >
        <g transform="rotate(4 280 280)">
          <ellipse cx={280} cy={280} rx={128} ry={128} fill="none" stroke="rgba(233,228,214,0.22)" strokeWidth={1} />
          <circle cx={280} cy={152} r={4.6} fill="#e9e4d6" />
        </g>
      </g>

      <circle cx={280} cy={280} r={19} fill="rgba(229,72,60,0.28)" />
      <circle cx={280} cy={280} r={9} fill="#e5483c" />
      <circle cx={280} cy={280} r={3.2} fill="#ffd9d4" />

      <text
        x={280}
        y={60}
        textAnchor="middle"
        fontSize={10}
        fill="rgba(233,228,214,0.45)"
        style={{ fontFamily: "IBM Plex Mono, monospace", letterSpacing: "0.3em" }}
      >
        FIG. 0 — THE IDEA OF AN ATOM
      </text>
    </svg>
  );
}

export default function Hero() {
  const [tilt, setTilt] = useState<[number, number]>([0, 0]);

  return (
    <section
      id="top"
      className="relative overflow-hidden"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTilt([
          ((e.clientX - r.left) / r.width - 0.5) * 16,
          ((e.clientY - r.top) / r.height - 0.5) * 10,
        ]);
      }}
    >
      {/* ghost index */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 top-16 select-none font-display text-[38vw] font-semibold leading-none text-paper/[0.025] md:text-[26vw]"
      >
        118
      </span>

      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 pb-16 pt-32 sm:px-10 md:pt-40 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-8">
        <div className="relative z-10">
          <Reveal>
            <p className="kicker mb-8 flex items-center gap-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-halpha" />
              AN ARCHIVE OF FIVE DRAWINGS · 1803 — 1926
            </p>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="font-display text-[clamp(3rem,8.4vw,7.2rem)] font-light leading-[0.94] tracking-[-0.015em]">
              The atom was
              <br />
              never seen —
              <br />
              <em className="bg-gradient-to-r from-hbeta via-hgamma to-halpha bg-clip-text font-medium italic text-transparent">
                only drawn.
              </em>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-9 max-w-[46ch] text-[17px] leading-[1.75] text-paper/75">
              <span className="font-semibold text-paper">Atomic Models</span> is a working archive of five
              attempts to picture the indivisible — Dalton’s billiard ball to the quantum cloud —
              operable across all 118 elements. Every drawing is a schematic, and every schematic
              says where it stops being true.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <a
                href="#instrument"
                className="group inline-flex items-center gap-3 border border-paper/70 px-6 py-3.5 font-mono text-[11px] tracking-[0.28em] text-paper transition-colors hover:bg-paper hover:text-ink"
              >
                OPERATE THE INSTRUMENT
                <ArrowDown size={13} className="transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>
              <a href="#chronicle" className="nav-link">
                Read the chronicle
              </a>
            </div>
          </Reveal>

          <Reveal delay={420}>
            <dl className="mt-16 grid max-w-xl grid-cols-3 gap-6 border-t border-[var(--line)] pt-6">
              {[
                ["118", "specimens indexed"],
                ["05", "models, honestly drawn"],
                ["123 yrs", "Dalton → Schrödinger"],
              ].map(([v, k]) => (
                <div key={k}>
                  <dt className="font-mono text-[10px] tracking-[0.22em] text-fog order-2">{k.toUpperCase()}</dt>
                  <dd className="font-display text-[26px] font-medium text-paper">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={260} className="relative hidden lg:block">
          <div
            className="sticky top-28 mx-auto max-w-[520px] transition-transform duration-300 ease-out"
            style={{ transform: `translate(${tilt[0]}px, ${tilt[1]}px)` }}
          >
            <Orrery />
          </div>
        </Reveal>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 pb-14 sm:px-10">
        <Spectrum showBalmer labelled height={6} />
      </div>
    </section>
  );
}
